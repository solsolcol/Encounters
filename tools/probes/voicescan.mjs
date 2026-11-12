// v25.0 · THE STATIC SCAN OF A CHAPTER'S FILMS (v21.30's law: "no voice over another, and every stretch of 1.5 s or more
// without a voice held by a sound with a reason"). No browser: the chapter is loaded as chaptertest loads it (a stub
// window and eval) and its opening film, its films from play and its endings are walked with a stub cutscene language
// that records every sfx(at, kind, vol) and sfxFade, and every track's end (the film's length). A VOICE is a cue whose
// kind is a row of src/voicelines.js; it sounds for its Opus file's own length (what SECS was measured from, v25.0).
// Printed per film: any two voices that overlap (FAIL), and every stretch of GAP seconds or more with no voice, with the
// music and the effects sounding in it — the stretches a reader then judges ("held by a sound with a reason").
// ITS BLIND SPOTS: a chapter's beds (DATA.ambience, set under a film by its own frame — e4c2's filmBedAt) and any sound a
// stage starts itself are not cues, so a stretch held only by the room reads as bare here: read the film's bed before
// calling a stretch silent (musiccensus.mjs has the same note).
//   CH=e4c2 [GAP=1.5] [MUSIC=x2open,...] [OUT=cues.json] node tools/probes/voicescan.mjs     (exit 1 on any overlap)
// (v26.0) OUT=<file.json> also writes what was walked: per film its length, every cue (at, kind, vol) in time order and
// every fade. It is the list of what SHOULD sound, which a browser probe then holds against what did (e4c3sound.mjs).
import { readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { DIR } from '../../testlib.mjs';
const CH = process.env.CH || 'e4c2', GAP = +(process.env.GAP || 1.5);
const MUSIC = new Set((process.env.MUSIC || '').split(',').filter(Boolean));
const ep = CH.match(/^e(\d+)c/), file = ep ? join(DIR, 'src', 'chapters', 'e' + ep[1], CH + '.js') : join(DIR, 'src', 'chapters', CH + '.js');
const win = { __CHAPTERS__: undefined }; globalThis.window = win;
(0, eval)(readFileSync(file, 'utf8'));
const ch = (win.__CHAPTERS__ || {})[CH];
if (!ch) { console.error('no chapter', CH); process.exit(1); }
const VOICES = new Set([...readFileSync(join(DIR, 'src', 'voicelines.js'), 'utf8').matchAll(/\bid:\s*"([^"]+)"/g)].map(m => m[1]));
const mainJs = readFileSync(join(DIR, 'src', 'main.js'), 'utf8');
const sampleOf = k => { const m = mainJs.match(new RegExp('\\b' + k + ":\\s*\\['([a-zA-Z0-9_]+)'")); return m ? m[1] : k; };
const lenCache = {};
const lenOf = k => {
  const s = sampleOf(k);
  if (lenCache[s] == null) {
    try { lenCache[s] = +execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', join(DIR, 'assets', 'audio-opus', s + '.ogg')]).toString().trim(); }
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
const fmt = x => x.toFixed(2);
let fails = 0;
const dump = {};
for (const [label, fn] of list) {
  const tracks = [], cues = [], fades = [];
  const T = (t0, t1) => { tracks.push(Math.max(+t0 || 0, (t1 === undefined ? +t0 : +t1) || 0)); };
  const api = {
    tr: T, step: t0 => T(t0, t0), fade: T, camTo: T, yawTo: T, pitchTo: T, bob: T, ghostGlide: T, ghostFacePlayer: T, lens: T,
    sfxFade: (t0, t1, kind) => { T(t0, t1); fades.push({ t0: +t0 || 0, t1: +t1 || 0, kind: String(kind) }); },
    event: at => T(at, at), eventWait: at => T(at, at), phone: T,
    sfx: (at, kind, vol) => cues.push({ at: +at || 0, kind: String(kind), vol: vol == null ? 1 : +vol }),
    music: () => {}, duck: () => {}, captions: () => {},
    rawK: k => k, smoothK: k => k * k * (3 - 2 * k), mixAngle: (a, b, k) => a + (b - a) * k, faceFrom: () => 0,
    CAM_FOV: 72, handWidth: () => 0.1, getReveal: () => 0, ghostOpacity: () => {}, setHandPrayer: () => {},
    handsPose: () => {}, handsFrom: () => ({ k: 1, t: 0 }), handPose: () => {},
  };
  for (const k of ['THREE', 'SHRINE', 'stage', 'camera', 'yaw', 'pitch', 'ghost', 'ghostLight', 'kit', 'handsRoot', 'armR', 'armL',
                   'rightHandModel', 'prayerArmL', 'PRAYER_R', 'PRAYER_L']) api[k] = anyProxy();
  try { fn(anyProxy(), anyProxy(), api); } catch (e) { console.log(label, 'could not be walked:', e.message); continue; }
  const dur = Math.max(1, ...tracks);
  dump[label] = { dur, cues: cues.slice().sort((a, b) => a.at - b.at), fades };
  const span = q => {
    const f = fades.filter(x => x.kind === q.kind && x.t0 >= q.at - 1e-6).sort((a, b) => a.t0 - b.t0)[0];
    return { kind: q.kind, a: q.at, b: Math.min(dur, q.at + lenOf(q.kind), f ? f.t1 : Infinity) };
  };
  const voices = cues.filter(q => VOICES.has(q.kind)).map(span).sort((x, y) => x.a - y.a);
  const others = cues.filter(q => !VOICES.has(q.kind)).map(span);
  console.log(`\n${label}: ${fmt(dur)} s, ${voices.length} voices`);
  /* one voice at a time */
  for (let i = 1; i < voices.length; i++) {
    const p = voices[i - 1], q = voices[i];
    if (q.a < p.b - 0.05) { fails++; console.log(`  OVERLAP ${p.kind} (${fmt(p.a)}–${fmt(p.b)}) and ${q.kind} from ${fmt(q.a)}: ${fmt(p.b - q.a)} s`); }
  }
  /* the stretches with no voice, and what sounds in each */
  const gaps = []; let at = 0;
  for (const v of voices) { if (v.a - at >= GAP) gaps.push([at, v.a]); at = Math.max(at, v.b); }
  if (dur - at >= GAP) gaps.push([at, dur]);
  for (const [a, b] of gaps) {
    const held = others.filter(o => o.a < b && o.b > a).map(o => `${o.kind}${MUSIC.has(o.kind) ? '(music)' : ''} ${fmt(Math.max(a, o.a))}–${fmt(Math.min(b, o.b))}`);
    console.log(`  no voice ${fmt(a).padStart(6)} → ${fmt(b).padStart(6)} (${fmt(b - a)} s): ${held.length ? held.join(', ') : 'NO CUE (the beds only)'}`);
  }
}
if (process.env.OUT) writeFileSync(process.env.OUT, JSON.stringify(dump, null, 1));
console.log(`\n${fails ? fails + ' OVERLAP(S)' : 'no voice over another'}`);
process.exit(fails ? 1 : 0);
