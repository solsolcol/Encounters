/* v25.0: episode 4 chapter 2, CONTINUE from a real save at each of its phases — tools/probes/e4c1cont.mjs's method: a
   checkpoint written into localStorage, the page loaded with NO ?ch=, Continue TAPPED on the title (a phone-sized touch
   context), where the run lands reported and photographed, then in the SAME SITTING back to the title by the menu and
   Continue again, and whether it lands in the same place. 'done:e4c1' is a run that finished chapter 1 and moves to this
   chapter's start. A save's phase string is `phase:marks` — h{l,w,k} how the shape was met, r revealed, k knelt, b bowed,
   t{A-D} what he told Lersi Chin, x examined, c cleared, p{piece} the charm he took in chapter 1 (in the bag until the
   examination sets it on the cloth). A Continue in `visit` plays the visit film again and lands in the clearing.
   ENC_DIST=<snapshot> CHROMIUM_PATH=... [PH='shop:pnangkwak|decide:...'] [SAME=0] [VIEW=phone|desktop] [OUT=dir]
     node tools/probes/e4c2cont.mjs */
import { chromium } from 'playwright';
import fs from 'node:fs';
import { LAUNCH, PAGE } from '../../testlib.mjs';
const OUT = process.env.OUT || '/tmp/e4c2cont';
const SAME = process.env.SAME !== '0';
const VIEW = process.env.VIEW || 'phone', PHONE = VIEW === 'phone';
fs.mkdirSync(OUT, { recursive: true });
const PH = (process.env.PH || ['done:e4c1', 'shop:pnangkwak', 'night:pnangkwak', 'night:hl,r,pnangkwak', 'night:hw,r,ptakrut',
  'night:hk,r,pphayant', 'visit:hl,r,pnangkwak', 'clearing:hl,r,pnangkwak', 'clearing:hl,r,k,pnangkwak', 'clearing:hl,r,k,b,pnangkwak',
  'clearing:hl,r,k,b,tB,pnangkwak', 'clearing:hl,r,k,b,tB,x,pnangkwak', 'clearing:hl,r,k,b,tB,x,c,pnangkwak',
  'decide:hl,r,k,b,tA,x,c,pnangkwak'].join('|')).split('|');
const b = await chromium.launch(LAUNCH);
const T0 = Date.now(), el = () => ((Date.now() - T0) / 1000).toFixed(0) + 's';
let bad = 0;
for (const ph of PH) {
  const ctx = await b.newContext(PHONE ? { viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, hasTouch: true, isMobile: true }
                                       : { viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 });
  const done = ph.startsWith('done:');
  const piece = (ph.match(/(?:^|[:,])p(nangkwak|takrut|phayant)/) || [])[1] || 'nangkwak';
  const bag = done ? [piece] : /(?:^|[:,])x(?:,|$)/.test(ph) ? [] : [piece];
  const save = done
    ? { v: 2, ch: ph.slice(5), stats: { sanity: 88, awareness: 61, wisdom: 70 }, inv: { gear: {}, bag }, phase: null,
        conduct: { s: 0, a: 0, notes: [] }, choices: {}, at: null, done: true, t: 1 }
    : { v: 2, ch: 'e4c2', stats: { sanity: 90, awareness: 55, wisdom: 52 }, inv: { gear: {}, bag }, phase: ph,
        conduct: { s: 0, a: 0, notes: [] }, choices: {},
        at: /^clearing|^decide/.test(ph) ? { x: -0.95, y: 1.62, z: 1.25, ry: 0 } : { x: -0.25, y: 1.62, z: -2.3, ry: Math.PI },
        done: false, t: 1 };
  await ctx.addInitScript(s => { if (!sessionStorage.getItem('seeded')) { localStorage.setItem('mz.encounters.checkpoint', s); sessionStorage.setItem('seeded', '1'); } }, JSON.stringify(save));
  const p = await ctx.newPage();
  const errs = [];
  p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
  p.on('console', m => { if (m.type() === 'error' || /failed|threw/i.test(m.text())) errs.push(m.text().slice(0, 200)); });
  const rep = () => p.evaluate(() => {
    const E = window.__enc, o = document.getElementById('objective');
    let i = {}; try { i = E.stage.info(); } catch { /* */ }
    return { st: E.getState(), ch: E.chapterKey ? E.chapterKey() : null, phase: i.phase, heard: i.heard, queued: i.queued, look: i.look,
             kp: E.kit && E.kit.getPhase ? E.kit.getPhase() : null,
             x: +E.yaw.position.x.toFixed(2), y: +E.yaw.position.y.toFixed(2), z: +E.yaw.position.z.toFixed(2),
             obj: o && !o.classList.contains('hide') ? (document.getElementById('objTxt') || o).textContent.trim() : null,
             fade: E.kit && E.kit.getFade ? +E.kit.getFade().toFixed(2) : null, bag: E.inv().bag,
             saved: (() => { try { const s = JSON.parse(localStorage.getItem('mz.encounters.checkpoint')); return s.phase; } catch { return null; } })() };
  });
  const cont = async () => {
    const bb = await p.locator('#startBtn').boundingBox();
    if (PHONE) await p.touchscreen.tap(bb.x + bb.width / 2, bb.y + bb.height / 2); else await p.mouse.click(bb.x + bb.width / 2, bb.y + bb.height / 2);
    await p.waitForFunction(() => ['play', 'decide', 'cine'].includes(window.__enc.getState()), null, { timeout: 900000, polling: 500 });
    if (await p.evaluate(() => window.__enc.getState() === 'cine')) {          // a chapter's opening film: let it start, then skip it
      await p.waitForFunction(() => !window.__enc.cine.active() || window.__enc.cine.t() > 3.1, null, { timeout: 600000, polling: 300 });
      await p.evaluate(() => window.__enc.cine.skip());
      await p.waitForFunction(() => ['play', 'decide'].includes(window.__enc.getState()), null, { timeout: 600000, polling: 500 });
    }
    await p.waitForTimeout(12000);
  };
  const r = { ph };
  try {
    await p.goto(PAGE, { waitUntil: 'load', timeout: 240000 });
    await p.waitForFunction(() => !!window.__enc, null, { timeout: 120000 });
    await p.waitForTimeout(1500);
    r.title = await p.evaluate(() => document.getElementById('startBtn').textContent.trim());
    await cont();
    r.land = await rep();
    await p.screenshot({ path: `${OUT}/${VIEW}-${ph.replace(/[^a-z0-9]+/gi, '_')}.jpg`, quality: 65, timeout: 240000 });
    if (SAME && !done) {
      /* (v24.9) back to the title the way a player goes: the menu button, then "Back to the title screen". The menu
         does not open over a live minigame or the decision (menuOpen; the button is not even drawn over a minigame),
         and it is the only way to the title from play — so from those a player has no same-sitting Continue, and the
         probe says so. (It used to call returnToTitle() straight under them, which no player can, and waited 900 s
         for a Continue that the open storm held.) */
      const menuB = p.locator('#menuBtn');
      if (await menuB.isVisible().catch(() => false)) {
        const mb = await menuB.boundingBox();
        if (PHONE) await p.touchscreen.tap(mb.x + mb.width / 2, mb.y + mb.height / 2); else await p.mouse.click(mb.x + mb.width / 2, mb.y + mb.height / 2);
        await p.waitForTimeout(1500);
      }
      const stM = await p.evaluate(() => window.__enc.getState());
      if (stM !== 'menu') r.sameSitting = `n/a (${stM}${await menuB.isVisible().catch(() => false) ? '' : ', no menu button'}: no way to the title from here, as for a player)`;
      else {
        const tb = await p.locator('#menuTitle').boundingBox();
        if (PHONE) await p.touchscreen.tap(tb.x + tb.width / 2, tb.y + tb.height / 2); else await p.mouse.click(tb.x + tb.width / 2, tb.y + tb.height / 2);
        await p.waitForFunction(() => window.__enc.getState() === 'title', null, { timeout: 120000, polling: 300 });
        await p.waitForTimeout(1500);
        await cont();
        r.again = await rep();
        const same = ['phase', 'obj'].every(k => JSON.stringify(r.land[k]) === JSON.stringify(r.again[k]));
        r.sameSitting = same ? 'same' : 'DIFFERS';
        if (!same) await p.screenshot({ path: `${OUT}/${VIEW}-${ph.replace(/[^a-z0-9]+/gi, '_')}-again.jpg`, quality: 65, timeout: 240000 });
      }
    }
  } catch (e) { r.fail = String(e.message || e).slice(0, 200); }
  r.errs = errs;
  /* where it should land: the save's own phase, but for a finished chapter 1 (this chapter's start) and the visit (a film
     that hands to the clearing) */
  const want = done ? 'shop' : /^visit/.test(ph) ? 'clearing' : ph.split(':')[0];
  const got = r.land && r.land.phase ? String(r.land.phase).split(':')[0] : null;
  r.landed = got === want ? 'right' : `WRONG (wanted ${want}, got ${got})`;
  if (r.fail || errs.length || r.sameSitting === 'DIFFERS' || got !== want) bad++;
  console.log(el(), JSON.stringify(r));
  await ctx.close();
}
await b.close();
console.log(bad ? `RESULT ${bad} phase(s) with a failure, a page error or a same-sitting difference` : 'RESULT every phase landed with no page error');
console.log('exit');
