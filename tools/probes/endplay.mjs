/* v24.5: a chapter's ending PLAYED THROUGH WITH THE SOUND ON (a phone-sized touch context, as on Chad's phone): the
   decision opened by the stage's own applyPhase(PHASE) once the chapter has booted (or the engine's handle), the option
   TAPPED on its button, and the scene left to run on its own clock to the card. Reports the voice log on the audio
   clock (none over another), the cues heard, the scene's length, the card, every page error; photographs every
   EVERY seconds of the scene's clock and the card.
   ENC_DIST=<snapshot> CHROMIUM_PATH=... CH=e3c5 PHASE=decide OPT=B [EVERY=8] [OUT=dir] node tools/probes/endplay.mjs */
import { chromium } from 'playwright';
import fs from 'node:fs';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const CH = process.env.CH || 'e3c5', PHASE = process.env.PHASE || 'decide', OPT = process.env.OPT || 'A';
const EVERY = +(process.env.EVERY || 8);
const OUT = (process.env.OUT || '/tmp/endplay') + '-' + CH + '-' + OPT;
fs.mkdirSync(OUT, { recursive: true });
const b = await chromium.launch(LAUNCH);
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, hasTouch: true, isMobile: true });
const p = await ctx.newPage();
const errs = [];
p.on('pageerror', e => errs.push('PAGEERROR ' + e.message + ' | ' + String(e.stack || '').split('\n').slice(1, 3).join(' ')));
p.on('console', m => { if (m.type() === 'error' || /failed|threw/i.test(m.text())) errs.push('CONSOLE ' + m.text().slice(0, 240)); });
const T0 = Date.now(), el = () => ((Date.now() - T0) / 1000).toFixed(0) + 's', log = (...a) => console.log(el(), ...a);
await p.goto(PAGE + '?ch=' + CH, { waitUntil: 'load', timeout: 240000 });
await p.waitForFunction(() => !!window.__enc, null, { timeout: 120000 });
{ const r = await p.locator('#startBtn').boundingBox(); await p.touchscreen.tap(r.x + r.width / 2, r.y + r.height / 2); }
await toPlay(p, 1500000);
await p.waitForTimeout(8000);                                       // the chapter's first frames (v9.3: boot before driving a phase)
await p.evaluate((ph) => window.__enc.stage.applyPhase(ph), PHASE);
await p.waitForFunction(() => window.__enc.getState() === 'decide', null, { timeout: 120000, polling: 500 })
  .catch(() => p.evaluate(() => window.__enc.decide()));
await p.waitForFunction(() => window.__enc.getState() === 'decide', null, { timeout: 600000, polling: 500 });
await p.waitForTimeout(3000);
const v0 = await p.evaluate(() => window.__enc.voices().length), c0 = await p.evaluate(() => window.__enc.stings().length);
const bt = await p.evaluate((i) => { const B = [...document.querySelectorAll('#choices button.choice')]; const r = B[i] && B[i].getBoundingClientRect();
  return r ? { x: r.left + r.width / 2, y: r.top + r.height / 2, n: B.length } : null; }, 'ABCD'.indexOf(OPT));
await p.touchscreen.tap(Math.round(bt.x), Math.round(bt.y));
log('tapped', OPT, 'of', bt.n);
await p.waitForFunction(() => window.__enc.cine.active(), null, { timeout: 600000, polling: 300 });
let next = 0.5, maxT = 0;
const tStart = Date.now();
while (Date.now() - tStart < 90 * 60 * 1000) {
  const s = await p.evaluate(() => ({ st: window.__enc.getState(), on: window.__enc.cine.active(), t: window.__enc.cine.active() ? window.__enc.cine.t() : null }));
  if (s.on && s.t !== null) {
    maxT = Math.max(maxT, s.t);
    if (s.t >= next) { try { await p.screenshot({ path: `${OUT}/t${String(Math.round(s.t)).padStart(3, '0')}.jpg`, quality: 60, timeout: 240000 }); } catch { /* */ } next = s.t + EVERY; }
  }
  if (!s.on && ['result', 'complete'].includes(s.st)) { log('the card, scene reached', maxT.toFixed(1)); break; }
  await p.waitForTimeout(700);
}
await p.waitForTimeout(6000);
try { await p.screenshot({ path: `${OUT}/card.jpg`, quality: 60, timeout: 240000 }); } catch { /* */ }
const V = (await p.evaluate(() => window.__enc.voices())).slice(v0);
const over = [];
for (let i = 0; i < V.length; i++) for (let j = i + 1; j < V.length; j++) {
  const a = V[i], c = V[j], aEnd = a.t1 === null ? Infinity : a.t1;
  if (c.t0 < aEnd - 0.05 && c.t0 >= a.t0) over.push(`${a.name}(${a.t0.toFixed(1)}–${a.t1 === null ? '?' : a.t1.toFixed(1)}) × ${c.name}(${c.t0.toFixed(1)})`);
}
log('VOICES', V.length, 'heard;', over.length ? 'OVERLAPS: ' + over.join('; ') : 'none over another', '|', V.map(v => `${v.name}@${v.t0.toFixed(1)}-${v.t1 === null ? '?' : v.t1.toFixed(1)}`).join(' '));
const cues = (await p.evaluate(() => window.__enc.stings().map(s => s.kind || s.name || s))).slice(c0);
log('CUES', cues.length, cues.join(' '));
log('result', errs.length ? 'ERRORS' : over.length ? 'OVERLAPS' : 'PASS');
console.log('errs', JSON.stringify(errs));
await b.close();
console.log('exit');
