// v22.0 CP9 · static scan of episode 3 chapter 4's four endings: every voice cue against the registry's measured
// length — two voices over each other, a line running past the scene, and every stretch of 1.5 s or more with no
// voice in it, with the sounds that hold it. The scenes read their beat tables off stage.endT, so the stub hands them
// the chapter's own (parsed out of the source). Usage: node masters/v22.0/cp9/scan.mjs
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
const DIR = process.cwd();
const src = readFileSync(join(DIR, 'src/chapters/e3/e3c4.js'), 'utf8');
const win = {}; globalThis.window = win; (0, eval)(src);
const ch = win.__CHAPTERS__.e3c4;
const grab = name => { const m = src.match(new RegExp('const ' + name + ' = (\\{[^;]*?\\});')); return (0, eval)('(' + m[1] + ')'); };
const EA = grab('EA'), EB = grab('EB'), EC = grab('EC'), ED = grab('ED');
const T = { A: EA.end, B: EB.end, C: EC.end, D: ED.end };
const reg = (() => { const w = {}; new Function('window', readFileSync(join(DIR, 'src/voicelines.js'), 'utf8'))(w); const o = {}; for (const r of w.__VOICE__.LINES) o[r.id] = r; return o; })();
const SECS = (() => { const m = src.match(/const SECS = (\{[\s\S]*?\});/); return m ? (0, eval)('(' + m[1] + ')') : {}; })();
const anyProxy = () => { const f = function () { return anyProxy(); }; return new Proxy(f, { get(t, k) {
  if (k === Symbol.toPrimitive) return () => 0; if (k === Symbol.iterator) return function* () {}; if (k === 'then') return undefined;
  if (k === 'length') return 0; if (typeof k === 'symbol') return undefined; return anyProxy(); }, set() { return true; },
  apply() { return anyProxy(); }, has() { return true; } }); };
let bad = 0;
'ABCD'.split('').forEach((k, i) => {
  const tracks = [], cues = [], fades = [];
  const Tr = (a, b) => tracks.push(Math.max(+a || 0, (b === undefined ? +a : +b) || 0));
  const api = { tr: Tr, step: t => Tr(t, t), fade: (a, b, f, t) => { Tr(a, b); fades.push([+a, +b, f, t]); }, camTo: Tr, yawTo: Tr, pitchTo: Tr, lens: Tr,
    sfxFade: (a, b, n) => { Tr(a, b); cues.push({ at: +a, kind: '~' + n }); }, sfx: (at, kind, vol) => cues.push({ at: +at || 0, kind: String(kind), vol }),
    music() {}, duck() {}, rawK: x => x, smoothK: x => x * x * (3 - 2 * x),
    stage: { endT: { T, EA, EB, EC, ED, begin() {}, frame() {}, talk() {} } } };
  for (const n of ['THREE', 'camera', 'yaw', 'pitch', 'kit', 'handsRoot', 'armR', 'vmCam']) api[n] = anyProxy();
  const c = { keep: {} };
  ch.scenes[i](c, anyProxy(), api);
  const dur = Math.max(...tracks);
  const voices = cues.filter(q => reg[q.kind]).map(q => ({ ...q, len: reg[q.kind].secs, who: reg[q.kind].who })).sort((a, b) => a.at - b.at);
  const others = cues.filter(q => !reg[q.kind] && !q.kind.startsWith('~')).sort((a, b) => a.at - b.at);
  console.log(`\nending ${k} (${dur.toFixed(2)} s; table end ${T[k]})`);
  voices.forEach((v, j) => {
    const end = v.at + v.len, nx = voices[j + 1];
    const clash = nx && end > nx.at + 0.05, past = end > dur - 0.05;
    if (clash || past) bad++;
    if (SECS[v.kind] !== undefined && Math.abs(SECS[v.kind] - v.len) > 0.02) { bad++; console.log(`   SECS ${v.kind} ${SECS[v.kind]} != registry ${v.len}`); }
    console.log(`  ${v.at.toFixed(2).padStart(6)} → ${end.toFixed(2).padStart(6)}  ${v.kind.padEnd(8)} ${v.who.padEnd(11)}${clash ? '  <<< OVER ' + nx.kind + ' @' + nx.at.toFixed(2) : ''}${past ? '  <<< PAST THE END' : ''}`);
  });
  // the silences: from 0, between voices, and after the last to the start of the final fade
  const lastFade = fades.filter(f => f[3] === 1).reduce((m, f) => Math.max(m, f[0]), 0);
  const spans = []; let t0 = 0;
  for (const v of voices) { if (v.at - t0 >= 1.5) spans.push([t0, v.at]); t0 = Math.max(t0, v.at + v.len); }
  if (lastFade - t0 >= 1.5) spans.push([t0, lastFade]);
  for (const [a, b] of spans) {
    const held = others.filter(o => o.at >= a - 0.3 && o.at <= b).map(o => o.kind + '@' + o.at.toFixed(1));
    console.log(`     · ${(b - a).toFixed(2)} s without a voice ${a.toFixed(2)}–${b.toFixed(2)}: ${held.length ? held.join(' ') : '<<< NOTHING'}`);
    if (!held.length) bad++;
  }
});
console.log(`\n${bad} problem(s)`);
