/* v27.0 · WHERE EVERYONE IS through one of episode 4 chapter 4's endings: the decision opened from a phase jump (kept),
   the option's own button tapped by a finger, and at each film time (TS) each person's group, hips and head in the world
   and whether drawn: a body that leaves its shot, slides or jumps is read here before it is photographed again.
     ENC_DIST=<snap> CHROMIUM_PATH=... OPT=C TS=0.05,1,3 node tools/probes/e4c4who.mjs */
import { chromium } from 'playwright';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const OPT = process.env.OPT || 'C', TS = (process.env.TS || '0.05,1,3,5.3,5.4,5.6,6,6.6,7.3').split(',').map(Number);
const b = await chromium.launch(LAUNCH);
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, hasTouch: true, isMobile: true });
const p = await ctx.newPage(); const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto(PAGE + '?ch=e4c4', { waitUntil: 'load', timeout: 240000 });
await p.waitForFunction(() => !!window.__enc, null, { timeout: 120000 });
await p.evaluate(() => document.getElementById('startBtn').click());
await toPlay(p, 1500000); await p.waitForTimeout(8000);
await p.evaluate(() => window.__enc.stage.applyPhase('kept'));
await p.waitForFunction(() => window.__enc.getState() === 'decide', null, { timeout: 600000, polling: 500 });
await p.waitForFunction(() => { const P = document.querySelector('#decide .panel'); return P && P.getAnimations().every(a => a.playState === 'finished'); }, null, { timeout: 120000, polling: 200 });
const rv0 = await p.evaluate(() => { const P = window.__enc.stage.dbg.cast.ravi, v = P.group.position; return [v.x, v.z, P.group.rotation.y].map(x => +x.toFixed(3)); });
console.log('decision: ravi group', JSON.stringify(rv0));
const bt = await p.evaluate((i) => { const r = document.querySelectorAll('#choices button.choice')[i].getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }, 'ABCD'.indexOf(OPT));
await p.touchscreen.tap(bt.x, bt.y);
await p.waitForFunction(() => window.__enc.cine.active() && window.__enc.cine.t() > 0.1, null, { timeout: 300000, polling: 300 });
for (const t of TS) {
  await p.evaluate((t) => window.__enc.cine.seek(t), t);
  await p.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
  const s = await p.evaluate(() => { const E = window.__enc, C = E.stage.dbg.cast, V = E.camera.position.constructor, out = {};
    for (const k of ['ravi', 'amma', 'mala', 'phoB']) { const P = C[k]; if (!P || !P.group) continue; const g = P.group.position, h = new V(), hd = new V();
      if (P.hips) P.hips.getWorldPosition(h); const H = P.head || null; if (H) H.getWorldPosition(hd);
      let vis = true; for (let q = P.group; q; q = q.parent) if (!q.visible) vis = false;
      out[k] = { g: [g.x, g.z].map(x => +x.toFixed(2)), hips: [h.x, h.y, h.z].map(x => +x.toFixed(2)), head: H ? [hd.x, hd.y, hd.z].map(x => +x.toFixed(2)) : null, vis }; }
    return { t: +E.cine.t().toFixed(2), out }; });
  console.log(JSON.stringify(s));
}
console.log('errors', errs.length, errs.slice(0, 3).join(' | '));
await b.close();
