/* v15.1: THE LIGHT COUNTS EVERY FILM AND SCENE REACHES — recorded, so they can
   ship. For each chapter, in one browser profile per device class (desktop;
   phone = touch + 390 px, which is LOW), this walks the opening film by
   seeking it, looks round in play, then opens the decision and plays each of
   the four scenes (seeking), restarting in between. The engine's own light
   memory (`mz.encounters.lightsets`) records every frame that compiled a
   program; at the end the profile's memory is printed as JSON, and the
   per-step compiles are logged — which is also the measurement of what a
   first viewing costs WITHOUT seeds (run it on a build with the seeds
   switched off: OPT=lightSeeds:0).
   Usage: [PROFILE=phone] [VIEW=640x400] [OUT=file.json] [OPT=…] node tools/probes/seedlights.mjs <chapter…> > out
   VIEW shrinks the desktop window: the counts do not depend on its size and
   a software renderer pays for every pixel. OUT is rewritten after every
   chapter, so a run cut short keeps what it recorded. */
import { writeFileSync } from 'node:fs';
import { chromium } from 'playwright';
import { LAUNCH, PAGE } from '../../testlib.mjs';
const chs = process.argv.slice(2), phone = process.env.PROFILE === 'phone';
const STEP = +(process.env.STEP || 0.5);
const b = await chromium.launch(LAUNCH);
const ctx = await b.newContext(phone ? { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, deviceScaleFactor: 1 }
                                     : { viewport: process.env.VIEW ? { width: +process.env.VIEW.split('x')[0], height: +process.env.VIEW.split('x')[1] }
                                                                    : { width: 1280, height: 800 } });
const log = (...a) => console.error(...a);
let dump = {};
for (const ch of chs) {
  const p = await ctx.newPage();
  const errs = []; p.on('pageerror', e => errs.push(e.message.split('\n')[0]));
  try {
    await p.goto(PAGE + '?ch=' + ch + (process.env.OPT ? '&opt=' + process.env.OPT : ''), { waitUntil: 'load', timeout: 240000 });
    await p.waitForFunction(() => !!window.__enc, null, { timeout: 120000 });
    await p.click('#startBtn', { timeout: 120000 });
    await p.waitForFunction(() => ['cine', 'play'].includes(window.__enc.getState()), null, { timeout: 900000, polling: 200 });
    await p.evaluate(() => { window.__frames = (k) => new Promise(res => { let n = 0; const f = () => (++n >= k ? res() : requestAnimationFrame(f)); requestAnimationFrame(f); }); });
    const progs = () => p.evaluate(() => window.__enc.renderer.info.programs.length);
    const walk = async (label) => {                         // seek through the running cutscene
      const dur = await p.evaluate(() => window.__enc.cine.active() ? window.__enc.cine.dur() : 0);
      let base = await progs(), made = 0; const at = [];
      for (let t = 0; dur && t <= dur; t += STEP) {
        const n = await p.evaluate(async (t) => { const E = window.__enc; if (!E.cine.active()) return -1; E.cine.seek(t); await window.__frames(2); return E.renderer.info.programs.length; }, t);
        if (n < 0) break;
        if (n > base) { at.push(t.toFixed(1) + ':+' + (n - base)); made += n - base; base = n; }
      }
      log(`  ${ch} ${label}: ${dur ? dur.toFixed(1) + ' s' : 'none'}, ${made} compiled on screen ${at.length ? '[' + at.join(' ') + ']' : ''}`);
      await p.evaluate(() => { const E = window.__enc; if (E.cine.active()) { E.cine.resume(); E.cine.skip(); } });
    };
    log(`${ch} (${phone ? 'phone' : 'desktop'}): at the lift ${await progs()} programs`);
    await walk('film');
    await p.waitForFunction(() => window.__enc.getState() === 'play', null, { timeout: 600000, polling: 200 });
    for (let h = 0; h < 8; h++) await p.evaluate(async (h) => { window.__enc.yaw.rotation.y = h * Math.PI / 4; await window.__frames(2); }, h);
    const nScenes = await p.evaluate(() => (window.__enc.chapter.scenes || []).length);
    for (let i = 0; i < nScenes; i++) {
      await p.evaluate(() => window.__enc.decide());
      const ok = await p.waitForFunction(() => window.__enc.getState() === 'decide', null, { timeout: 30000 }).then(() => true, () => false);
      if (!ok) { log(`  ${ch} scene ${i}: the decision would not open`); break; }
      await p.waitForTimeout(500);
      await p.evaluate((i) => window.__enc.pick(i), i);
      const inScene = await p.waitForFunction(() => window.__enc.getState() === 'cine', null, { timeout: 120000 }).then(() => true, () => false);
      if (!inScene) { log(`  ${ch} scene ${i}: did not start`); break; }
      await walk('scene ' + 'ABCD'[i]);
      await p.waitForFunction(() => window.__enc.getState() !== 'cine', null, { timeout: 600000, polling: 200 });
      await p.evaluate(() => window.__enc.restart());
      await p.waitForFunction(() => window.__enc.getState() === 'play', null, { timeout: 600000, polling: 200 });
    }
    dump = await p.evaluate(() => { try { return JSON.parse(localStorage.getItem('mz.encounters.lightsets') || '{}'); } catch { return {}; } });
    if (process.env.OUT) writeFileSync(process.env.OUT, JSON.stringify(dump));
    if (errs.length) log(`  ${ch} page errors: ${errs.slice(0, 3).join(' | ')}`);
  } catch (e) { log(`${ch}: PROBE FAILED ${e.message.split('\n')[0]}`); }
  await p.close();
}
console.log(JSON.stringify(dump));
await b.close();
