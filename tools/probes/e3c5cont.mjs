/* Episode 3 chapter 5: CONTINUE from a real save at each of its phases — a checkpoint written into localStorage, the page
   loaded with NO ?ch=, Continue TAPPED on the title (a phone-sized touch context). Reports where the run lands (the
   state, world, phase, the order on screen, the kit's fade, where he stands, the lines heard and queued) and
   photographs it. 'done:e3c4' is the case of a run that finished chapter 4 and moves to chapter 5's start.
   (v24.3: kept here rather than as a dbg-*.mjs one-off — the v24.1 copy died with its container.)
   ENC_DIST=<snapshot> CHROMIUM_PATH=... [PH='counter|care|...'] [VIEW=desktop] [OUT=dir] node tools/probes/e3c5cont.mjs */
import { chromium } from 'playwright';
import fs from 'node:fs';
import { LAUNCH, PAGE } from '../../testlib.mjs';
const OUT = process.env.OUT || '/tmp/e3c5cont';
const VIEW = process.env.VIEW || 'phone', PHONE = VIEW === 'phone';   // v24.5: desktop — a mouse clicks Continue
fs.mkdirSync(OUT, { recursive: true });
const PH = (process.env.PH || ['done:e3c4', 'counter', 'counter:yin,m.red,m.shy,m.little,give', 'care', 'care:water,d.red',
  'care:water,d.red,d.shy,d.little,lit,i.red,i.shy,i.little,care', 'sit', 'open1', 'open2', 'open3', 'open3:mat', 'after',
  'decide'].join('|')).split('|');
const b = await chromium.launch(LAUNCH);
const T0 = Date.now(), el = () => ((Date.now() - T0) / 1000).toFixed(0) + 's';
let bad = 0;
for (const ph of PH) {
  const ctx = await b.newContext(PHONE ? { viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, hasTouch: true, isMobile: true }
                                       : { viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 });
  const done = ph.startsWith('done:');
  const save = done
    ? { v: 2, ch: ph.slice(5), stats: { sanity: 88, awareness: 61, wisdom: 70 }, inv: { gear: {}, bag: [] }, phase: null,
        conduct: { s: 0, a: 0, notes: [] }, choices: {}, at: null, done: true, t: 1 }
    : { v: 2, ch: 'e3c5', stats: { sanity: 90, awareness: 55, wisdom: 52 }, inv: { gear: {}, bag: [] }, phase: ph,
        conduct: { s: 0, a: 0, notes: [] }, choices: {},
        at: ph.startsWith('counter') ? { x: 250.6, y: 1.62, z: -1.4, ry: -Math.PI / 2 } : { x: 0.2, y: 1.62, z: 0.6, ry: 0 },
        done: false, t: 1 };
  await ctx.addInitScript(s => { if (!sessionStorage.getItem('seeded')) { localStorage.setItem('mz.encounters.checkpoint', s); sessionStorage.setItem('seeded', '1'); } }, JSON.stringify(save));
  const p = await ctx.newPage();
  const errs = [];
  p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
  p.on('console', m => { if (m.type() === 'error' || /failed|threw/i.test(m.text())) errs.push(m.text().slice(0, 200)); });
  const rep = () => p.evaluate(() => {
    const E = window.__enc, o = document.getElementById('objective');
    let i = {}; try { i = E.stage.info(); } catch { /* */ }
    return { st: E.getState(), ch: E.chapterKey ? E.chapterKey() : null, phase: i.phase, world: i.world, heard: i.heard, queued: i.queued,
             x: +E.yaw.position.x.toFixed(2), y: +E.yaw.position.y.toFixed(2), z: +E.yaw.position.z.toFixed(2),
             obj: o && !o.classList.contains('hide') ? (document.getElementById('objTxt') || o).textContent.trim() : null,
             fade: E.kit && E.kit.getFade ? +E.kit.getFade().toFixed(2) : null };
  });
  const r = { ph };
  try {
    await p.goto(PAGE, { waitUntil: 'load', timeout: 240000 });
    await p.waitForFunction(() => !!window.__enc, null, { timeout: 120000 });
    await p.waitForTimeout(1500);
    r.title = await p.evaluate(() => document.getElementById('startBtn').textContent.trim());
    const bb = await p.locator('#startBtn').boundingBox();
    if (PHONE) await p.touchscreen.tap(bb.x + bb.width / 2, bb.y + bb.height / 2); else await p.mouse.click(bb.x + bb.width / 2, bb.y + bb.height / 2);
    await p.waitForFunction(() => ['play', 'decide', 'cine'].includes(window.__enc.getState()), null, { timeout: 900000, polling: 500 });
    if (await p.evaluate(() => window.__enc.getState() === 'cine')) {          // a chapter's opening film: let it start, then skip it
      await p.waitForFunction(() => !window.__enc.cine.active() || window.__enc.cine.t() > 3.1, null, { timeout: 600000, polling: 300 });
      await p.evaluate(() => window.__enc.cine.skip());
      await p.waitForFunction(() => ['play', 'decide'].includes(window.__enc.getState()), null, { timeout: 600000, polling: 500 });
    }
    await p.waitForTimeout(12000);
    r.saved = await p.evaluate(() => { try { const s = JSON.parse(localStorage.getItem('mz.encounters.checkpoint')); return { ch: s.ch, done: s.done, phase: s.phase }; } catch { return null; } });
    r.land = await rep();
    await p.screenshot({ path: `${OUT}/${PHONE ? '' : 'desktop-'}${ph.replace(/[^a-z0-9]+/gi, '_')}.jpg`, quality: 65, timeout: 240000 });
  } catch (e) { r.fail = String(e.message || e).slice(0, 200); }
  r.errs = errs;
  if (r.fail || errs.length) bad++;
  console.log(el(), JSON.stringify(r));
  await ctx.close();
}
await b.close();
console.log(bad ? `RESULT ${bad} phase(s) with a failure or a page error` : 'RESULT every phase landed with no page error');
console.log('exit');
