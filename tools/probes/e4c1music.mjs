// v24.34 · EPISODE 4 CHAPTER 1'S MUSIC IN PLAY, read off the engine (Chad, 2 Nov 2026: "a serious lack of background
// music ... not just in gameplay"). On a phone (touch: sound on), the chapter booted through its opening film, then
// each phase set by the stage's own applyPhase once play has run (v9.3) — at each, the beds' levels as the engine holds
// them (__enc.pack().loops: what loopVol was last asked for) sampled until they settle, and the decoded sounds (which of
// the new music is held, and its size: seconds x 48 kHz x channels x 4 bytes). Counts what SHOULD be there (v8.5): a bed
// that never starts reads 0 and fails the line, a page error fails the run.
//   ENC_DIST=<snap> CHROMIUM_PATH=... [MODE=play|films] [OPT=A|B|C|D] node tools/probes/e4c1music.mjs
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
const req = createRequire(new URL('../../package.json', import.meta.url).pathname);
const PW = await import(pathToFileURL(req.resolve('playwright')).href);
const chromium = PW.chromium || (PW.default && PW.default.chromium);
const { LAUNCH, PAGE, toPlay } = await import(new URL('../../testlib.mjs', import.meta.url).href);
const MUSIC = ['w4yardmus', 'w4roommus', 'w4stormmus', 'w4endA0', 'w4endB0', 'w4endD0', 'w4codamus'];
const b = await chromium.launch(LAUNCH);
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
const p = await ctx.newPage(); const errs = [];
p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
p.on('console', m => { if (m.type() === 'error') errs.push('console ' + m.text().slice(0, 200)); });
const TS = Date.now(), log = (...a) => console.log(((Date.now() - TS) / 1000).toFixed(0) + 's', ...a);
await p.goto(PAGE + '?ch=e4c1', { waitUntil: 'load', timeout: 240000 });
await p.waitForFunction(() => !!window.__enc, null, { timeout: 180000 });
await p.evaluate(() => document.getElementById('startBtn').click());
await toPlay(p, 1500000);
await p.waitForTimeout(4000);
let bad = 0;
const read = () => p.evaluate((M) => { const P = window.__enc.pack(); return { loops: P.loops, dec: P.decodedNames.filter(n => M.includes(n)), muted: window.__enc.audio().muted }; }, MUSIC);
/* each phase's levels are a RANGE the beds must reach (they ease over 2.5 s of wall time, and a slow box draws a frame
   every few seconds, so the probe waits on the condition itself — v8.7, never a timer — and fails the line if it never
   comes); [yard lo, yard hi, room lo, room hi] */
async function phaseCheck(label, R) {
  const t0 = Date.now(); let ok = true;
  try {
    await p.waitForFunction((R) => { const L = window.__enc.pack().loops, y = L.w4yardmus || 0, m = L.w4roommus || 0;
      return y >= R[0] && y <= R[1] && m >= R[2] && m <= R[3]; }, R, { timeout: 240000, polling: 500 });
  } catch { ok = false; bad++; }
  const r = await read(), y = r.loops.w4yardmus || 0, m = r.loops.w4roommus || 0;
  log(`${label.padEnd(9)} yard music ${y.toFixed(3)}  room music ${m.toFixed(3)}  radio ${(r.loops.w4radio || 0).toFixed(3)}  rain ${(r.loops.w4rainl || 0).toFixed(3)}/${(r.loops.w4rainh || 0).toFixed(3)}  after ${(r.loops.w4after || 0).toFixed(3)}  ${ok ? 'ok' : 'NEVER REACHED ' + JSON.stringify(R)} (${((Date.now() - t0) / 1000).toFixed(0)} s)`);
  return r;
}
/* MODE=play: the beds through the phases of play; MODE=films: a fresh boot straight into the storm (a run of phase jumps
   first leaves the line queue full, and the storm's film waits behind it — v21.25's slow-box law), its film, the
   decision, and an ending */
const MODE = process.env.MODE || 'play';
let r = null;
if (MODE === 'play') {
  r = await phaseCheck('arrive', [0.25, 0.38, 0, 0.005]);
  log('muted', r.muted, 'decoded music:', r.dec.join(' ') || '(none)');
  for (const [ph, R] of [['called', [0.25, 0.38, 0, 0.005]], ['consult', [0, 0.005, 0.2, 0.23]], ['items', [0, 0.005, 0.2, 0.23]],
                         ['work', [0, 0.005, 0, 0.005]]]) {
    await p.evaluate((ph) => window.__enc.stage.applyPhase(ph), ph);
    r = await phaseCheck(ph, R);
  }
  log('decoded music now:', r.dec.join(' '));
  log('errors', JSON.stringify(errs.slice(0, 6)));
  await b.close();
  process.exit(errs.length || bad ? 1 : 0);
}
/* a film's music cue PLAYED, from its own sample: the stings log (__enc.stings(): kind, and how it sounded) read from an
   index taken BEFORE the cue (v8.2's baseline law); 'sample' is the decoded file, anything else is silence */
async function cueCheck(label, kind, at) {
  const i0 = await p.evaluate(() => window.__enc.stings().length);
  if (at != null) await p.evaluate((t) => { window.__enc.cine.seek(t); window.__enc.cine.resume(); }, Math.max(0, at - 0.6));
  let how = 'never';
  try {
    await p.waitForFunction(([k, i0]) => window.__enc.stings().slice(i0).some(s => s.kind === k), [kind, i0], { timeout: 300000, polling: 300 });
    how = await p.evaluate(([k, i0]) => window.__enc.stings().slice(i0).find(s => s.kind === k).how, [kind, i0]);
  } catch {}
  if (how !== 'sample') bad++;
  log(`${label.padEnd(22)} ${kind.padEnd(11)} ${how === 'sample' ? 'played from its sample' : 'NOT PLAYED (' + how + ')'}`);
}
/* the storm, as play starts it (stormWatch: kit.film('storm')); its music at 0.2 s; then on to the film's end */
const st0 = await p.evaluate(() => window.__enc.stings().length);
await p.evaluate(() => window.__enc.stage.applyPhase('storm'));
await p.waitForFunction(() => window.__enc.cine.active(), null, { timeout: 300000, polling: 300 });
await cueCheck('the storm film', 'w4stormmus', null);
await p.evaluate(() => { const C = window.__enc.cine; C.seek(C.dur() - 0.3); C.resume(); });
await p.waitForFunction(() => !window.__enc.cine.active(), null, { timeout: 300000, polling: 500 });
void st0;
await p.evaluate(() => window.__enc.stage.applyPhase('decide'));
r = await phaseCheck('decide', [0, 0.005, 0.1, 0.116]);
/* an ending (OPT, default D): the option tapped on the panel, then each of its new cues seeked to and heard */
const OPT = process.env.OPT || 'D';
const CUES = { A: [['w4endA0', 4.5], ['w4codamus', 70.2]], B: [['w4endB0', null], ['w4codamus', 84.1]],
               C: [['w4codamus', 51.8]], D: [['w4endD0', 7.6], ['w4codamus', 60.6]] };
await p.waitForFunction(() => window.__enc.getState() === 'decide', null, { timeout: 600000, polling: 500 });
await p.waitForFunction(() => { const P = document.querySelector('#decide .panel'); return P && P.getAnimations().every(a => a.playState === 'finished'); }, null, { timeout: 120000, polling: 200 });
const bt = await p.evaluate((i) => { const B = [...document.querySelectorAll('#choices button.choice')]; const q = B[i] && B[i].getBoundingClientRect();
  return q ? { x: q.left + q.width / 2, y: q.top + q.height / 2 } : null; }, 'ABCD'.indexOf(OPT));
await p.touchscreen.tap(Math.round(bt.x), Math.round(bt.y));
await p.waitForFunction(() => window.__enc.cine.active() && window.__enc.getState() === 'cine', null, { timeout: 1500000, polling: 500 });
for (const [kind, at] of CUES[OPT]) await cueCheck('ending ' + OPT, kind, at);
const L = await read();
log(`in the ending: yard music ${(L.loops.w4yardmus || 0).toFixed(3)}  room music ${(L.loops.w4roommus || 0).toFixed(3)} (a film cues its own)`);
log('decoded music now:', r.dec.join(' '));
log('errors', JSON.stringify(errs.slice(0, 6)));
await b.close();
process.exit(errs.length || bad ? 1 : 0);
