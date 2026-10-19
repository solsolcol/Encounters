/* v21.0 · the static overlap scan for episode 3 chapter 3: every film and
   scene walked against a recording stub (chaptertest's shape), each VOICE cue
   laid out as [at, at + secs] from the registry, and any two that overlap
   reported — plus any line still talking when its cutscene ends. The stage
   carries the real numbers the timings are built from (the shrine's places,
   the film's pockets), so a walk's length, and every cue after it, is real.
   node masters/v21.0/overlap.mjs */
import { readFileSync } from 'node:fs';
const ROOT = new URL('../../', import.meta.url).pathname;
globalThis.window = { __CHAPTERS__: undefined };
(0, eval)(readFileSync(ROOT + 'src/chapters/e3/e3c3.js', 'utf8'));
const ch = window.__CHAPTERS__.e3c3;
const vl = readFileSync(ROOT + 'src/voicelines.js', 'utf8');
const SECS = {};
for (const m of vl.matchAll(/id: "([a-zA-Z0-9_]+)"[\s\S]*?secs: ([0-9.]+)/g)) SECS[m[1]] = +m[2];
const anyProxy = () => {
  const f = function () { return anyProxy(); };
  return new Proxy(f, { get(t, k) { if (k === Symbol.toPrimitive) return () => 0; if (k === Symbol.iterator) return function* () {};
    if (k === 'then') return undefined; if (k === 'length') return 0; if (typeof k === 'symbol') return undefined; return anyProxy(); },
    set() { return true; }, apply() { return anyProxy(); }, has() { return true; } });
};
const real = (obj) => new Proxy(obj, { get(t, k) { return k in t ? t[k] : anyProxy(); } });
const LX = (x) => -250 + x;
const film = real({ LX, MED_AT: { x: LX(0), z: -7.55 }, ASST_AT: { x: LX(3.62), z: -6.5 }, TABLE_AT: { x: LX(0.1), z: -5.5 },
  MED_EYE: { x: LX(0), y: 1.45, z: -7.4 }, FP: { x: 300, z: 0 }, FM: { x: 300, z: 240 }, OWN: { x: 3.98, z: -2.45 } });
const stage = real({ film });
const s = { yawPos: { x: LX(0.1), y: 1.13, z: -5.15 }, yawRot: 0, pitchX: 0 };
const list = [['intro', ch.intro]];
for (const [k, f] of Object.entries(ch.films || {})) list.push([`film ${k}`, f]);
(ch.scenes || []).forEach((f, i) => list.push([`scene ${'ABCD'[i]}`, f]));
let bad = 0;
for (const [label, fn] of list) {
  const tracks = [], cues = [];
  const T = (t0, t1) => { tracks.push(Math.max(+t0 || 0, (t1 === undefined ? +t0 : +t1) || 0)); };
  const api = { tr: T, step: t0 => T(t0, t0), fade: T, camTo: T, yawTo: T, pitchTo: T, lens: T, sfxFade: T,
    sfx: (at, kind) => cues.push({ at: +at || 0, kind: String(kind) }), music: () => {}, duck: () => {},
    rawK: k => k, smoothK: k => k * k * (3 - 2 * k), faceFrom: (x0, z0, x1, z1) => Math.atan2(-(x1 - x0), -(z1 - z0)),
    CAM_FOV: 72, handsPose: () => {}, handsFrom: () => ({ k: 0, t: 0 }), stage };
  for (const k of ['THREE', 'camera', 'yaw', 'pitch', 'kit', 'handsRoot', 'armR', 'rightHand', 'prayerArm', 'vmHemi', 'vmKey', 'vmFire']) api[k] = anyProxy();
  const c = { keep: {} };
  fn(c, s, api);
  const dur = Math.max(1, ...tracks);
  const voices = cues.filter(q => SECS[q.kind]).map(q => ({ ...q, end: q.at + SECS[q.kind] })).sort((a, b) => a.at - b.at);
  const notes = [];
  for (let i = 0; i < voices.length; i++) for (let j = i + 1; j < voices.length; j++) {
    const a = voices[i], b = voices[j];
    if (b.at < a.end - 0.02) notes.push(`OVERLAP ${a.kind} ${a.at.toFixed(2)}–${a.end.toFixed(2)} × ${b.kind} ${b.at.toFixed(2)}–${b.end.toFixed(2)} (${(a.end - b.at).toFixed(2)} s)`);
  }
  for (const v of voices) if (v.end > dur + 0.05) notes.push(`PAST THE END ${v.kind} ends ${v.end.toFixed(2)} > ${dur.toFixed(2)}`);
  console.log(`${label.padEnd(12)} ${dur.toFixed(1).padStart(5)} s  ${voices.map(v => `${v.kind}@${v.at.toFixed(1)}`).join(' ')}`);
  for (const n of notes) { console.log('   ' + n); bad++; }
}
console.log(bad ? `${bad} problem(s)` : 'no voice overlaps, no line past its cutscene');
