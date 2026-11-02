// v24.34 · WHERE A CHAPTER HAS MUSIC (Chad, 2 Nov 2026, of episode 4 chapter 1: "throughout this entire episode there is
// a serious lack of background music, ambient music, mood music, not just in gameplay, but all the cutscenes"). Static,
// no browser: the chapter is loaded as chaptertest loads it (a stub window and eval), its opening film, its films from
// play and its endings walked with a stub cutscene language that records every sfx(at, kind) and sfxFade(t0, t1, kind)
// and every track's end (the film's length). A music cue sounds from its `at` for its file's own length (ffprobe of the
// mp3 its STING_SAMPLE row names), or until a fade cue on the same kind ends sooner. Printed per film: its length, the
// spans with music, and every stretch of GAP seconds or more with none — the census a plan for music starts from.
// ITS BLIND SPOT (found at v24.34): it reads only a film's OWN cues. A sound the stage starts itself is invisible to it
// — e4c1's storm drone (w4storm) is begun by films.begin('storm') through sfxReady, so the census said the storm film
// had no music when the drone was there, rising out of near silence. Read what a film's stage starts before trusting a 0.
//   CH=e4c1 MUSIC=w4open,w4endA,w4endB,w4endC,w4endD,w4coda,w4storm [GAP=4] node tools/probes/musiccensus.mjs
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { DIR } from '../../testlib.mjs';
const CH = process.env.CH || 'e4c1', GAP = +(process.env.GAP || 4);
const MUSIC = new Set((process.env.MUSIC || '').split(',').filter(Boolean));
const ep = CH.match(/^e(\d+)c/), file = ep ? join(DIR, 'src', 'chapters', 'e' + ep[1], CH + '.js') : join(DIR, 'src', 'chapters', CH + '.js');
const win = { __CHAPTERS__: undefined }; globalThis.window = win;
(0, eval)(readFileSync(file, 'utf8'));
const ch = (win.__CHAPTERS__ || {})[CH];
if (!ch) { console.error('no chapter', CH); process.exit(1); }
/* the sample each kind plays, from main.js's STING_SAMPLE (a kind's own name when it has no row) */
const mainJs = readFileSync(join(DIR, 'src', 'main.js'), 'utf8');
const sampleOf = k => { const m = mainJs.match(new RegExp('\\b' + k + ":\\s*\\['([a-zA-Z0-9_]+)'")); return m ? m[1] : k; };
const lenCache = {};
const lenOf = k => {
  const s = sampleOf(k);
  if (lenCache[s] == null) {
    try { lenCache[s] = +execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', join(DIR, 'assets', 'audio', s + '.mp3')]).toString().trim(); }
    catch { lenCache[s] = NaN; }
  }
  return lenCache[s];
};
const anyProxy = () => {
  const f = function () { return anyProxy(); };
  return new Proxy(f, {
    get(t, k) { if (k === Symbol.toPrimitive) return () => 0; if (k === Symbol.iterator) return function* () {}; if (k === 'then') return undefined;
      if (k === 'length') return 0; if (typeof k === 'symbol') return undefined; return anyProxy(); },
    set() { return true; }, apply() { return anyProxy(); }, has() { return true; },
  });
};
const list = [];
if (typeof ch.intro === 'function') list.push(['opening film', ch.intro]);
for (const [k, fn] of Object.entries(ch.films || {})) if (typeof fn === 'function') list.push(['film ' + k, fn]);
(ch.scenes || []).forEach((fn, i) => { if (typeof fn === 'function') list.push(['ending ' + 'ABCD'[i], fn]); });
const fmt = x => x.toFixed(1);
let total = 0, withMusic = 0;
for (const [label, fn] of list) {
  const tracks = [], cues = [], fades = [];
  const T = (t0, t1) => { tracks.push(Math.max(+t0 || 0, (t1 === undefined ? +t0 : +t1) || 0)); };
  const api = {
    tr: T, step: t0 => T(t0, t0), fade: T, camTo: T, yawTo: T, pitchTo: T, bob: T, ghostGlide: T, ghostFacePlayer: T, lens: T,
    sfxFade: (t0, t1, kind) => { T(t0, t1); fades.push({ t0: +t0 || 0, t1: +t1 || 0, kind: String(kind) }); },
    event: at => T(at, at), eventWait: at => T(at, at), phone: T,
    sfx: (at, kind, vol) => cues.push({ at: +at || 0, kind: String(kind), vol: vol == null ? 1 : +vol }),
    music: () => {}, duck: () => {},
    rawK: k => k, smoothK: k => k * k * (3 - 2 * k), mixAngle: (a, b, k) => a + (b - a) * k, faceFrom: () => 0,
    CAM_FOV: 72, handWidth: () => 0.1, getReveal: () => 0, ghostOpacity: () => {}, setHandPrayer: () => {},
    handsPose: () => {}, handsFrom: () => ({ k: 1, t: 0 }),
  };
  for (const k of ['THREE', 'SHRINE', 'stage', 'camera', 'yaw', 'pitch', 'ghost', 'ghostLight', 'kit', 'handsRoot', 'armR', 'armL',
                   'rightHandModel', 'prayerArmL', 'PRAYER_R', 'PRAYER_L']) api[k] = anyProxy();
  try { fn(anyProxy(), anyProxy(), api); } catch (e) { console.log(label, 'could not be walked:', e.message); continue; }
  const dur = Math.max(1, ...tracks);
  const spans = cues.filter(q => MUSIC.has(q.kind)).map(q => {
    const f = fades.filter(x => x.kind === q.kind && x.t0 >= q.at - 1e-6).sort((a, b) => a.t0 - b.t0)[0];
    return { kind: q.kind, a: q.at, b: Math.min(dur, q.at + lenOf(q.kind), f ? f.t1 : Infinity) };
  }).sort((x, y) => x.a - y.a);
  /* the union of the spans, and the gaps in it */
  const merged = [];
  for (const s of spans) { const l = merged[merged.length - 1]; if (l && s.a <= l.b) l.b = Math.max(l.b, s.b); else merged.push({ a: s.a, b: s.b }); }
  const gaps = []; let at = 0;
  for (const m of merged) { if (m.a - at >= GAP) gaps.push([at, m.a]); at = Math.max(at, m.b); }
  if (dur - at >= GAP) gaps.push([at, dur]);
  const cov = merged.reduce((s, m) => s + (Math.min(dur, m.b) - m.a), 0);
  total += dur; withMusic += cov;
  console.log(`\n${label}: ${fmt(dur)} s, music ${fmt(cov)} s (${Math.round(100 * cov / dur)} %)`);
  for (const s of spans) console.log(`  ${s.kind.padEnd(10)} ${fmt(s.a).padStart(6)} → ${fmt(s.b).padStart(6)}`);
  for (const [a, b] of gaps) console.log(`  NO MUSIC ${fmt(a).padStart(6)} → ${fmt(b).padStart(6)}  (${fmt(b - a)} s)`);
}
console.log(`\nall films: ${fmt(total)} s, music under ${fmt(withMusic)} s (${Math.round(100 * withMusic / total)} %)`);
