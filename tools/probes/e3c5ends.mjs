/* Episode 3 chapter 5's four endings, PHOTOGRAPHED at chosen moments: the decision opened by the stage's own
   applyPhase('decide') once the chapter has booted, the option CLICKED on its button, then the scene's own clock seeked
   to each time (a seek pauses it; every picture is a function of the clock — v5.30's law) and the frame photographed.
   Prints the state, the scene's shot and the lens at each.
   (v24.3: kept here — the v24.2 one-off died with its container.)
   ENC_DIST=<snapshot> CHROMIUM_PATH=... VIEW=phone|desktop OPTS=A TS=40.3,41.2 [OUT=dir] node tools/probes/e3c5ends.mjs */
import { chromium } from 'playwright';
import fs from 'node:fs';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const VIEW = process.env.VIEW || 'phone', PHONE = VIEW === 'phone';
const OPT = process.env.OPTS || 'A', TS = (process.env.TS || '5').split(',').map(Number);
const CH = process.env.CH || 'e3c5', PHASE = process.env.PHASE || 'decide';   // (any chapter: CH=e4c1 PHASE=storm:done)
const OUT = (process.env.OUT || '/tmp/e3c5ends') + '-' + VIEW;
fs.mkdirSync(OUT, { recursive: true });
const b = await chromium.launch(LAUNCH);
const ctx = await b.newContext(PHONE ? { viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, hasTouch: true, isMobile: true }
                                     : { viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 });
const p = await ctx.newPage();
const errs = [];
p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
const T0 = Date.now(), el = () => ((Date.now() - T0) / 1000).toFixed(0) + 's';
await p.goto(PAGE + '?ch=' + CH, { waitUntil: 'load', timeout: 240000 });
await p.waitForFunction(() => !!window.__enc, null, { timeout: 120000 });
await p.evaluate(() => document.getElementById('startBtn').click());
await toPlay(p, 1500000);
await p.waitForTimeout(8000);                                       // the chapter's first frames (v9.3: boot before driving a phase)
await p.evaluate((ph) => window.__enc.stage.applyPhase(ph), PHASE);
/* a chapter whose bookmark does not open the decision by itself: the engine's own handle opens it from play (v15) */
await p.waitForFunction(() => window.__enc.getState() === 'decide', null, { timeout: 120000, polling: 500 })
  .catch(() => p.evaluate(() => window.__enc.decide()));
await p.waitForFunction(() => window.__enc.getState() === 'decide', null, { timeout: 600000, polling: 500 });
await p.waitForTimeout(3000);
await p.evaluate((i) => document.querySelectorAll('#choices button.choice')[i].click(), 'ABCD'.indexOf(OPT));
await p.waitForFunction(() => window.__enc.cine.active(), null, { timeout: 600000, polling: 300 });
for (const t of TS) {
  await p.evaluate((t) => window.__enc.cine.seek(t), t);
  await p.evaluate(() => new Promise(r => { let k = 0; const f = () => (++k >= 3 ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); }));
  const s = await p.evaluate(() => { const E = window.__enc; let i = {}; try { i = E.stage.info(); } catch { /* */ }
    const c = E.camera || null;
    return { st: E.getState(), shot: i.endShot || i.shot || null, fov: c ? +c.fov.toFixed(1) : null,
             cam: [E.yaw.position.x, E.yaw.position.y, E.yaw.position.z, E.yaw.rotation.y, E.pitch.rotation.x].map(v => +v.toFixed(2)) }; });
  await p.screenshot({ path: `${OUT}/${OPT}-${String(t).replace('.', '_')}.jpg`, quality: 70, timeout: 240000 });
  console.log(el(), OPT, t, JSON.stringify(s));
}
console.log(el(), OPT, 'errs', JSON.stringify(errs));
await b.close();
