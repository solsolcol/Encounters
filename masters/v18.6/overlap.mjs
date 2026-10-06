// v18.6 · static overlap scan of every voice cue in episode 3's films and
// scenes, against the registry's measured lengths — run with the OLD lengths
// (Louis, from git) and the NEW (Brian, the working tree) so only what the
// new voice changed is reported. Usage: node masters/v18.6/overlap.mjs
import { readFileSync, readdirSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { join } from 'node:path';
const DIR = process.cwd();
const chapDir = join(DIR, 'src', 'chapters', 'e3');
const win = { __CHAPTERS__: undefined }; globalThis.window = win;
for (const f of readdirSync(chapDir).filter(f => f.endsWith('.js'))) (0, eval)(readFileSync(join(chapDir, f), 'utf8'));
const mainJs = readFileSync(join(DIR, 'src', 'main.js'), 'utf8');
const blk = mainJs.slice(mainJs.indexOf('const STING_SAMPLE = {'), mainJs.indexOf('};', mainJs.indexOf('const STING_SAMPLE = {')));
const S2S = Object.fromEntries([...blk.matchAll(/(\w+):\s*\['([a-zA-Z0-9_]+)',/g)].map(m => [m[1], m[2]]));
const reg = src => { const w = {}; new Function('window', src)(w); const v = w.__VOICE__;
  const rows = v.LINES; const o = {}; for (const r of rows) o[r.id] = r.secs; return o; };
const NEW = reg(readFileSync(join(DIR, 'src', 'voicelines.js'), 'utf8'));
const OLD = reg(execSync('git show HEAD:src/voicelines.js', { encoding: 'utf8' }));
const anyProxy = () => { const f = function () { return anyProxy(); }; return new Proxy(f, { get(t, k) {
  if (k === Symbol.toPrimitive) return () => 0; if (k === Symbol.iterator) return function* () {}; if (k === 'then') return undefined;
  if (k === 'length') return 0; if (typeof k === 'symbol') return undefined; return anyProxy(); }, set() { return true; },
  apply() { return anyProxy(); }, has() { return true; } }); };
const walk = fn => { const tracks = [], cues = []; const T = (a, b) => tracks.push(Math.max(+a || 0, (b === undefined ? +a : +b) || 0));
  const api = { tr: T, step: t => T(t, t), fade: T, camTo: T, yawTo: T, pitchTo: T, bob: T, ghostGlide: T, ghostFacePlayer: T, lens: T, sfxFade: T,
    event: a => T(a, a), eventWait: a => T(a, a), sfx: (at, kind) => cues.push({ at: +at || 0, kind: String(kind) }), music() {}, duck() {},
    rawK: k => k, smoothK: k => k * k * (3 - 2 * k), mixAngle: (a, b, k) => a + (b - a) * k, faceFrom: () => 0, CAM_FOV: 72, handWidth: () => 0.1,
    getReveal: () => 0, ghostOpacity() {}, setHandPrayer() {}, handsPose() {}, handsFrom: () => ({ k: 1, t: 0 }) };
  for (const k of ['THREE', 'SHRINE', 'stage', 'camera', 'yaw', 'pitch', 'ghost', 'ghostLight', 'kit', 'handsRoot', 'armR', 'armL', 'rightHandModel', 'prayerArmL', 'PRAYER_R', 'PRAYER_L']) api[k] = anyProxy();
  fn(anyProxy(), anyProxy(), api); return { dur: Math.max(1, ...tracks), cues }; };
let flagged = 0;
for (const key of ['e3c1', 'e3c2']) {
  const ch = win.__CHAPTERS__[key]; const list = [['film', ch.intro], ...ch.scenes.map((f, i) => ['scene ' + 'ABCD'[i], f])];
  for (const [label, fn] of list) {
    const { dur, cues } = walk(fn);
    const v = cues.map(q => ({ ...q, s: S2S[q.kind] || q.kind })).filter(q => NEW[q.s] !== undefined).sort((a, b) => a.at - b.at);
    console.log(`\n${key} ${label} (${dur.toFixed(2)} s)`);
    const rep = L => v.map((q, i) => { const end = q.at + L[q.s]; const nx = v.slice(i + 1).find(n => n.at >= q.at);
      return { q, end, clash: nx && end > nx.at + 0.05 ? nx : null, past: end > dur + 0.05 }; });
    const o = rep(OLD), n = rep(NEW);
    n.forEach((r, i) => { const was = o[i]; const z = r.q.s.startsWith('z');
      const newClash = r.clash && !(was.clash && was.end >= r.end - 1e-6);
      const mark = (newClash ? ' <<< NEW OVERLAP with ' + r.clash.s + ' @' + r.clash.at.toFixed(2) : r.clash ? ' (overlap existed: ' + r.clash.s + ')' : '')
        + (r.past && !was.past ? ' <<< NEW: runs past the end' : r.past ? ' (ran past before too)' : '');
      if (newClash || (r.past && !was.past)) flagged++;
      console.log(`  ${r.q.at.toFixed(2).padStart(6)}  ${r.q.s.padEnd(10)} ${z ? (OLD[r.q.s].toFixed(2) + '->' + NEW[r.q.s].toFixed(2)) : NEW[r.q.s].toFixed(2).padStart(10)}  ends ${r.end.toFixed(2)}${mark}`); });
  }
}
console.log(`\n${flagged} new problem(s)`);
