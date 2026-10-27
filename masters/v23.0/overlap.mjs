/* v23.0 CP12 · episode 3 chapter 5, READ FOR OVERLAPS AND SILENCES against the MEASURED lengths (v21.30's rule: no
   voice over another; no stretch passes in silence; an ending is a whole story). Walks every film and every ending
   against a recording stand-in (chaptertest's), takes each line's length from the chapter's own SECS (measured off the
   shipped takes at CP11) and each other sound's from its shipped file (ffprobe), and reports:
     OVERLAP   two voices at once (any two, not only neighbours);
     PAST END  a line still being said when its film or scene ends;
     gap       every stretch of 1.5 s or more with no voice in it, and what holds it: a sound that begins in it or is
               still playing through it (its real length), or the black. A gap held only by the room's loop (the beds
               mixBeds keeps under every picture since CP11) is listed as "bed" for a reader to judge, not passed.
   node masters/v23.0/overlap.mjs            (the four endings, each with the epilogue)
   FILMS=1 node masters/v23.0/overlap.mjs    (the opening film and the six films from play) */
import { readFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
const src = readFileSync('src/chapters/e3/e3c5.js', 'utf8');
const win = {}; new Function('window', src)(win);
const ch = win.__CHAPTERS__.e3c5;
const secsLit = src.match(/const SECS = \{([\s\S]*?)\n  \};/);
const SECS = {};
for (const m of (secsLit ? secsLit[1] : '').matchAll(/'([a-zA-Z0-9_]+)':\s*([0-9.]+)/g)) SECS[m[1]] = +m[2];
const BEDS = new Set((ch.ambience && ch.ambience.beds || []).map(b => b[0]));
const LEN = {};
const lenOf = (name) => {
  if (LEN[name] !== undefined) return LEN[name];
  const f = `assets/audio/${name}.mp3`;
  LEN[name] = existsSync(f) ? +execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).toString().trim() : 0;
  return LEN[name];
};
const anyProxy = () => {
  const f = function () { return anyProxy(); };
  return new Proxy(f, { get(t, k) { if (k === Symbol.toPrimitive) return () => 0; if (k === Symbol.iterator) return function* () {};
    if (k === 'then') return undefined; if (k === 'length') return 0; if (typeof k === 'symbol') return undefined; return anyProxy(); },
    set() { return true; }, apply() { return anyProxy(); }, has() { return true; } });
};
let bad = 0, beds = 0;
const WALK = process.env.FILMS ? [['intro', ch.intro], ...Object.entries(ch.films || {})].filter(([, f]) => f)
                               : (ch.scenes || []).map((f, i) => ['ABCD'[i], f]);
WALK.forEach(([L, fn]) => {
  const cues = [], fades = [], cuts = [], waits = []; let dur = 0;
  const T = (t0, t1) => { dur = Math.max(dur, +t0 || 0, (t1 === undefined ? +t0 : +t1) || 0); };
  const api = { tr: T, step: t => T(t, t), fade: (a, b, x, y) => { T(a, b); fades.push([+a, +b, +x, +y]); }, lens: T,
    sfxFade: (a, b, kind) => { T(a, b); cuts.push([+b, String(kind)]); }, eventWait: t => { T(t, t); waits.push(+t); },
    sfx: (at, kind, vol) => cues.push({ at: +at || 0, kind: String(kind), vol }), music: () => {}, duck: () => {}, rawK: k => k, smoothK: k => k };
  for (const k of ['THREE', 'stage', 'camera', 'yaw', 'pitch', 'kit', 'handsRoot', 'armR']) api[k] = anyProxy();
  api.event = () => anyProxy(); api.craft = () => anyProxy();
  fn(anyProxy(), anyProxy(), api);
  /* an eventWait PAUSES the film while a voice cued before it plays on: on WALL time, everything after the wait comes
     at least PAUSE seconds later — COME BACK at its quickest, its lead 0.4 s and its hold 0.4 s and a drag of 0.1 s.
     The scan holds every line to that worst case (a slower climb only widens the gaps) */
  const PAUSE = 0.9, wall = (t) => t + PAUSE * waits.filter(w => t > w + 1e-6).length;
  for (const q of cues) q.at = wall(q.at);
  for (const f of fades) { f[0] = wall(f[0]); f[1] = wall(f[1]); }
  for (const c of cuts) c[0] = wall(c[0]);
  dur = wall(dur);
  const voices = cues.filter(q => SECS[q.kind] !== undefined).map(q => ({ ...q, end: q.at + SECS[q.kind] })).sort((a, b) => a.at - b.at);
  const others = cues.filter(q => SECS[q.kind] === undefined).map(q => {
    const cut = cuts.filter(([b, k]) => k === q.kind && b > q.at).map(([b]) => b);
    return { ...q, end: Math.min(q.at + lenOf(q.kind), cut.length ? Math.min(...cut) : Infinity) };
  }).sort((a, b) => a.at - b.at);
  console.log(`\n${process.env.FILMS ? 'film' : 'scene'} ${L}: ${dur.toFixed(1)} s, ${voices.length} lines, ${others.length} sounds`);
  /* two voices at once: each line against the latest end of every line before it */
  let reach = null;
  for (const v of voices) {
    if (reach && v.at < reach.end - 0.05) { bad++; console.log(`  OVERLAP  ${reach.kind} (${reach.at.toFixed(2)}–${reach.end.toFixed(2)}) and ${v.kind} at ${v.at.toFixed(2)} (${(reach.end - v.at).toFixed(2)} s)`); }
    if (!reach || v.end > reach.end) reach = v;
  }
  for (const v of voices) if (v.end > dur + 0.05) { bad++; console.log(`  PAST END ${v.kind} (${v.at.toFixed(2)}–${v.end.toFixed(2)}) past ${dur.toFixed(2)}`); }
  /* the gaps: from 0, between lines, to the end */
  const marks = [{ end: 0 }, ...voices, { at: dur }];
  let edge = 0;
  for (let k = 1; k < marks.length; k++) {
    const g0 = edge, g1 = marks[k].at;
    if (g1 - g0 >= 1.5) {
      const held = others.filter(q => q.at <= g1 && q.end >= g0 + 0.3).map(q => `${q.kind}@${q.at.toFixed(1)}–${Math.min(q.end, 999).toFixed(1)}`);
      const black = fades.some(([a, b, x, y]) => y === 1 && a <= g0 + 0.5 && b >= g1 - 0.5);
      const label = held.join(' ') || (black ? '(black)' : 'bed');
      console.log(`  gap ${g0.toFixed(1)}–${g1.toFixed(1)} (${(g1 - g0).toFixed(1)} s): ${label}`);
      if (!held.length && !black) beds++;
    }
    edge = Math.max(edge, marks[k].end || 0);
  }
});
console.log(`\n${bad ? bad + ' problem(s)' : 'no overlaps, nothing past an end'}; ${beds} gap(s) held by the room's bed alone`);
process.exit(bad ? 1 : 0);
