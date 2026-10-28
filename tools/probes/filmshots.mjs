/* v24.5: a chapter's OPENING FILM photographed at chosen moments of its own clock — the chapter started from its own
   ?ch= (Start tapped or clicked), the film's clock seeked to each time (a seek pauses it; every picture is a function of
   the clock — v5.30's law), a few frames drawn, SETTLE ms for what eases on the wall clock, the frame photographed.
   Prints the state, the film's time and the lens at each.
   ENC_DIST=<snapshot> CHROMIUM_PATH=... CH=e4c1 VIEW=phone|desktop TS=0.5,3,6 [SETTLE=1500] [OUT=dir]
     node tools/probes/filmshots.mjs
   (v24.5) OPT=A|B|C|D [PHASE=decide:~fri] photographs an ENDING instead: play reached (the film skipped), the bookmark
   applied once the chapter has booted, the option pressed, and the scene's clock seeked the same way. */
import { chromium } from 'playwright';
import fs from 'node:fs';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const VIEW = process.env.VIEW || 'phone', PHONE = VIEW === 'phone';
const CH = process.env.CH || 'e4c1', TS = (process.env.TS || '1,5,10').split(',').map(Number);
const SETTLE = +(process.env.SETTLE || 1500);
const OUT = (process.env.OUT || '/tmp/filmshots') + '-' + VIEW;
fs.mkdirSync(OUT, { recursive: true });
const b = await chromium.launch(LAUNCH);
const ctx = await b.newContext(PHONE ? { viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, hasTouch: true, isMobile: true }
                                     : { viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 });
const p = await ctx.newPage();
const errs = [];
p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
p.on('console', m => { if (m.type() === 'error' || /failed|threw/i.test(m.text())) errs.push('CONSOLE ' + m.text().slice(0, 200)); });
const T0 = Date.now(), el = () => ((Date.now() - T0) / 1000).toFixed(0) + 's';
await p.goto(PAGE + '?ch=' + CH, { waitUntil: 'load', timeout: 240000 });
await p.waitForFunction(() => !!window.__enc, null, { timeout: 120000 });
await p.evaluate(() => document.getElementById('startBtn').click());
const OPT = process.env.OPT || '';
if (OPT) {
  await toPlay(p, 1500000);
  await p.waitForTimeout(8000);                                       // the chapter's first frames (v9.3: boot before driving a phase)
  await p.evaluate((ph) => window.__enc.stage.applyPhase(ph), process.env.PHASE || 'decide:~fri');
  await p.waitForFunction(() => window.__enc.getState() === 'decide', null, { timeout: 600000, polling: 500 });
  await p.waitForTimeout(2500);
  const bt = await p.evaluate((i) => { const B = [...document.querySelectorAll('#choices button.choice')]; const r = B[i] && B[i].getBoundingClientRect();
    return r ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : null; }, 'ABCD'.indexOf(OPT));
  if (PHONE) await p.touchscreen.tap(Math.round(bt.x), Math.round(bt.y)); else await p.mouse.click(bt.x, bt.y);
}
await p.waitForFunction(() => window.__enc.cine.active() && window.__enc.getState() === 'cine', null, { timeout: 1500000, polling: 500 });
await p.waitForFunction(() => window.__enc.cine.t() > 0.2, null, { timeout: 600000, polling: 300 });
for (const t of TS) {
  await p.evaluate((t) => window.__enc.cine.seek(t), t);
  await p.evaluate(() => new Promise(r => { let k = 0; const f = () => (++k >= 3 ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); }));
  if (SETTLE) await p.waitForTimeout(SETTLE);
  const s = await p.evaluate(() => { const E = window.__enc, c = E.camera;
    return { st: E.getState(), t: +E.cine.t().toFixed(2), fov: c ? +c.fov.toFixed(1) : null,
             cam: [E.yaw.position.x, E.yaw.position.y, E.yaw.position.z, E.yaw.rotation.y, E.pitch.rotation.x].map(v => +v.toFixed(2)) }; });
  await p.screenshot({ path: `${OUT}/${OPT ? 'end' + OPT : 'film'}-${String(t).replace('.', '_').padStart(5, '0')}.jpg`, quality: 70, timeout: 240000 });
  console.log(el(), t, JSON.stringify(s));
}
console.log(el(), 'errs', JSON.stringify(errs));
await b.close();
