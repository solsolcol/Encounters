/* v24.5: episode 4 chapter 1, CONTINUE from a real save at each of its phases — a checkpoint written into localStorage,
   the page loaded with NO ?ch=, Continue TAPPED on the title (a phone-sized touch context). Reports where the run lands
   (the state, world, phase, the order on screen, the kit's fade, where he stands, the lines heard and queued, the bag,
   the ledger's entries) and photographs it; then, in the SAME SITTING, back to the title and Continue again (the
   v22.2 path: freshStage, no rebuild) and reports whether it lands in the same place. 'done:e3c5' is a run that
   finished episode 3 and moves to this chapter's start.
   ENC_DIST=<snapshot> CHROMIUM_PATH=... [PH='arrive|wait:joy;n10'] [SAME=0] [OUT=dir] node tools/probes/e4c1cont.mjs
   (v24.9: the queue and the birthday pick went — 'wait:…' and '~fri' are now OLD saves, from v24.0–v24.8, which must still
   land right: a wait at the master's door, a day mark let go; the new marks carry '~ask' once he has asked Pong. Only an
   old save is given the stock book's pages it would have carried) */
import { chromium } from 'playwright';
import fs from 'node:fs';
import { LAUNCH, PAGE } from '../../testlib.mjs';
const OUT = process.env.OUT || '/tmp/e4c1cont';
const SAME = process.env.SAME !== '0';
const VIEW = process.env.VIEW || 'phone', PHONE = VIEW === 'phone';   // desktop: a mouse clicks Continue
fs.mkdirSync(OUT, { recursive: true });
const PH = (process.env.PH || ['done:e3c5', 'arrive', 'called', 'called:~ask', 'consult', 'consult:~ask', 'items', 'items:takrut~ask',
  'work:~ask', 'work:smoke,cloth', 'storm', 'storm:done~ask', 'decide', 'decide:~ask',
  /* old saves (v24.0–v24.8) */
  'wait:;n9', 'wait:joy,lim,sb,pong;n13', 'wait:joy;n14;mlim', 'consult:fri', 'items:takrut~fri', 'storm:done~fri', 'decide:~fri'].join('|')).split('|');
const OLD = /^wait|~fri|^consult:fri/;
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
  const ledger = OLD.test(ph) && /^(wait:.*(joy|lim|sb|pong))|^(called|consult|items|work|storm|decide)/.test(ph)
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
             kp: E.kit && E.kit.getPhase ? E.kit.getPhase() : null,
             x: +E.yaw.position.x.toFixed(2), y: +E.yaw.position.y.toFixed(2), z: +E.yaw.position.z.toFixed(2),
             obj: o && !o.classList.contains('hide') ? (document.getElementById('objTxt') || o).textContent.trim() : null,
             fade: E.kit && E.kit.getFade ? +E.kit.getFade().toFixed(2) : null, bag: E.inv().bag, led,
             /* (v24.9) at the door the door is offered, once Pong stands there — a Continue puts him there at once */
             door: (() => { const h = E.stage.hotspots && E.stage.hotspots.find(x => x.id === 'door'); return h ? !!(!h.enabled || h.enabled()) : null; })(),
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
        const same = ['phase', 'world', 'obj'].every(k => JSON.stringify(r.land[k]) === JSON.stringify(r.again[k]));
        r.sameSitting = same ? 'same' : 'DIFFERS';
        if (!same) await p.screenshot({ path: `${OUT}/${VIEW}-${ph.replace(/[^a-z0-9]+/gi, '_')}-again.jpg`, quality: 65, timeout: 240000 });
      }
    }
  } catch (e) { r.fail = String(e.message || e).slice(0, 200); }
  r.errs = errs;
  /* (v24.5) where it should land: the save's own phase, but for a finished episode 3 (this chapter's start), a wait whose
     number fourteen has been called (the call), and the storm already paid (the decision) */
  /* (v24.9) an old save in the queue lands at the master's door; whether he asked Pong rides the bookmark from there on */
  const want = done ? 'arrive' : /^wait/.test(ph) ? 'called' : /^storm:done/.test(ph) ? 'decide' : ph.split(/[:~]/)[0];
  const got = r.land && r.land.phase ? String(r.land.phase).split(/[:~]/)[0] : null;
  const askWant = !done && (/~ask/.test(ph) || /^wait:[^;]*pong/.test(ph)) && want !== 'arrive';
  const askGot = !!(r.land && r.land.kp && /~ask/.test(r.land.kp));
  r.landed = got === want ? 'right' : `WRONG (wanted ${want}, got ${got})`;
  r.askedMark = askGot === askWant ? 'right' : `WRONG (wanted ${askWant ? '~ask' : 'no ~ask'}, got ${r.land && r.land.kp})`;
  /* (v24.9) a Continue at the door finds the door offered (Pong is put beside the steps), in both sittings */
  const doorBad = want === 'called' && got === 'called' && (r.land.door !== true || (r.again && r.again.door !== true));
  if (want === 'called') r.doorOpen = doorBad ? `SHUT (land ${r.land && r.land.door}, again ${r.again && r.again.door})` : 'right';
  if (r.fail || errs.length || r.sameSitting === 'DIFFERS' || got !== want || askGot !== askWant || doorBad) bad++;
  console.log(el(), JSON.stringify(r));
  await ctx.close();
}
await b.close();
console.log(bad ? `RESULT ${bad} phase(s) with a failure, a page error or a same-sitting difference` : 'RESULT every phase landed with no page error');
console.log('exit');
