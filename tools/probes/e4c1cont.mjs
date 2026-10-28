/* v24.5: episode 4 chapter 1, CONTINUE from a real save at each of its phases — a checkpoint written into localStorage,
   the page loaded with NO ?ch=, Continue TAPPED on the title (a phone-sized touch context). Reports where the run lands
   (the state, world, phase, the order on screen, the kit's fade, where he stands, the lines heard and queued, the bag,
   the ledger's entries) and photographs it; then, in the SAME SITTING, back to the title and Continue again (the
   v22.2 path: freshStage, no rebuild) and reports whether it lands in the same place. 'done:e3c5' is a run that
   finished episode 3 and moves to this chapter's start.
   ENC_DIST=<snapshot> CHROMIUM_PATH=... [PH='arrive|wait:joy;n10'] [SAME=0] [OUT=dir] node tools/probes/e4c1cont.mjs */
import { chromium } from 'playwright';
import fs from 'node:fs';
import { LAUNCH, PAGE } from '../../testlib.mjs';
const OUT = process.env.OUT || '/tmp/e4c1cont';
const SAME = process.env.SAME !== '0';
const VIEW = process.env.VIEW || 'phone', PHONE = VIEW === 'phone';   // desktop: a mouse clicks Continue
fs.mkdirSync(OUT, { recursive: true });
const PH = (process.env.PH || ['done:e3c5', 'arrive', 'wait:;n9', 'wait:joy;n10', 'wait:joy,lim;n11', 'wait:lim;n12;mjoy',
  'wait:joy,lim,sb;n13', 'wait:joy,lim,sb,pong;n13', 'wait:joy;n14;mlim', 'called', 'consult', 'consult:fri', 'items~fri',
  'items:takrut~fri', 'work~fri', 'work:smoke,cloth~fri', 'storm~fri', 'storm:done~fri', 'decide~fri'].join('|')).split('|');
const ROOM = /^(consult|items|work|storm|decide)/;
const b = await chromium.launch(LAUNCH);
const T0 = Date.now(), el = () => ((Date.now() - T0) / 1000).toFixed(0) + 's';
let bad = 0;
for (const ph of PH) {
  const ctx = await b.newContext(PHONE ? { viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, hasTouch: true, isMobile: true }
                                       : { viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 });
  const done = ph.startsWith('done:');
  const item = (ph.match(/items:(\w+)/) || [])[1];
  const pastItems = /^(work|storm|decide)/.test(ph);
  const bag = item ? [item] : pastItems ? ['takrut'] : [];
  const ledger = /^(wait:.*(joy|lim|sb|pong))|^(called|consult|items|work|storm|decide)/.test(ph)
    ? { ep: 4, entries: [{ id: 'who:joy', kind: 'fact', page: 'who', text: 'Khun Joy: a probe line.' }] } : undefined;
  const save = done
    ? { v: 2, ch: ph.slice(5), stats: { sanity: 88, awareness: 61, wisdom: 70 }, inv: { gear: {}, bag: [] }, phase: null,
        conduct: { s: 0, a: 0, notes: [] }, choices: {}, at: null, done: true, t: 1 }
    : { v: 2, ch: 'e4c1', stats: { sanity: 90, awareness: 55, wisdom: 52 }, inv: { gear: {}, bag }, phase: ph,
        conduct: { s: 0, a: 0, notes: [] }, choices: {}, ledger,
        at: ROOM.test(ph) ? { x: 250, y: 1.62, z: 0.6, ry: 0 } : { x: -0.6, y: 1.62, z: 8.0, ry: 0 },
        done: false, t: 1 };
  await ctx.addInitScript(s => { if (!sessionStorage.getItem('seeded')) { localStorage.setItem('mz.encounters.checkpoint', s); sessionStorage.setItem('seeded', '1'); } }, JSON.stringify(save));
  const p = await ctx.newPage();
  const errs = [];
  p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
  p.on('console', m => { if (m.type() === 'error' || /failed|threw/i.test(m.text())) errs.push(m.text().slice(0, 200)); });
  const rep = () => p.evaluate(() => {
    const E = window.__enc, o = document.getElementById('objective');
    let i = {}; try { i = E.stage.info(); } catch { /* */ }
    let led = []; try { led = E.ledgerState().entries.map(e => e.id + '=' + e.kind); } catch { /* */ }
    return { st: E.getState(), ch: E.chapterKey ? E.chapterKey() : null, phase: i.phase, world: i.world, heard: i.heard, queued: i.queued,
             x: +E.yaw.position.x.toFixed(2), y: +E.yaw.position.y.toFixed(2), z: +E.yaw.position.z.toFixed(2),
             obj: o && !o.classList.contains('hide') ? (document.getElementById('objTxt') || o).textContent.trim() : null,
             fade: E.kit && E.kit.getFade ? +E.kit.getFade().toFixed(2) : null, bag: E.inv().bag, led,
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
      await p.evaluate(() => window.__enc.returnToTitle());
      await p.waitForFunction(() => window.__enc.getState() === 'title', null, { timeout: 120000, polling: 300 });
      await p.waitForTimeout(1500);
      await cont();
      r.again = await rep();
      const same = ['phase', 'world', 'obj'].every(k => JSON.stringify(r.land[k]) === JSON.stringify(r.again[k]));
      r.sameSitting = same ? 'same' : 'DIFFERS';
      if (!same) await p.screenshot({ path: `${OUT}/${VIEW}-${ph.replace(/[^a-z0-9]+/gi, '_')}-again.jpg`, quality: 65, timeout: 240000 });
    }
  } catch (e) { r.fail = String(e.message || e).slice(0, 200); }
  r.errs = errs;
  if (r.fail || errs.length || r.sameSitting === 'DIFFERS') bad++;
  console.log(el(), JSON.stringify(r));
  await ctx.close();
}
await b.close();
console.log(bad ? `RESULT ${bad} phase(s) with a failure, a page error or a same-sitting difference` : 'RESULT every phase landed with no page error');
console.log('exit');
