/* v27.0: episode 4 chapter 4, CONTINUE from a real save at each of its phases: tools/probes/e4c3cont.mjs's method, whole.
   A checkpoint written into localStorage, the page loaded with NO ?ch=, Continue TAPPED on the title (a phone-sized
   touch context), where the run lands reported and photographed, then in the SAME SITTING back to the title by the menu
   and Continue again, and whether it lands in the same place. 'done:e4c3' is a run that finished chapter 3 and moves to
   this chapter's start: NATURAL PROGRESSION, its opening film and its first phase. A save's phase string is
   `phase:marks` (c_story.js readMark): r m f o a the five things of her story learned, k Amma spoken to, p the first peek,
   v his sight opened, l1 l2 l3 the three spirits looked at, w the holy water given, x her husband gone. Some phases move
   on by themselves within seconds (her whole story learned and Amma spoken to: Grandmaster Pho's line and the sight; all
   three looked at: the sight shut and the blessing; `kept`: the decision): the landing wanted is given as the phases it
   may be read in. (The chapter must be IN THE RUN for this: a preview is never a Continue.)
   ENC_DIST=<snapshot> CHROMIUM_PATH=... [PH='history:|kept:'] [SAME=0] [VIEW=phone|desktop] [OUT=dir]
     node tools/probes/e4c4cont.mjs */
import { chromium } from 'playwright';
import fs from 'node:fs';
import { LAUNCH, PAGE } from '../../testlib.mjs';
const OUT = process.env.OUT || '/tmp/e4c4cont';
const SAME = process.env.SAME !== '0';
const VIEW = process.env.VIEW || 'phone', PHONE = VIEW === 'phone';
fs.mkdirSync(OUT, { recursive: true });
/* (M8) the strings are the game's OWN (setPhase writes `phase:` and that phase's marks only: mark()); the last three are
   what it never writes (a phase with no colon, marks carried from other phases), which readMark must still take */
const PH = (process.env.PH || ['done:e4c3', 'history:', 'history:r', 'history:r,m,f', 'history:r,m,f,o,a', 'history:r,m,f,o,a,k',
  'sight:', 'sight:v', 'sight:v,l1,l2', 'sight:v,l1,l2,l3', 'bless:', 'bless:w', 'bless:w,x', 'kept:',
  'history', 'sight:r,m,f,o,a,k,v,l1', 'bless:r,m,f,o,a,k,p,v,l1,l2,l3,w'].join('|')).split('|');
/* where a Continue may be read (the phase's own name, or the one it moves to by itself) */
const WANT = (ph) => { const p = ph.split(':')[0], m = ph.split(':')[1] || '', has = (c) => m.split(',').includes(c);
  if (ph.startsWith('done:')) return ['history'];
  if (p === 'history' && ['r', 'm', 'f', 'o', 'a', 'k'].every(has)) return ['history', 'sight'];
  if (p === 'sight' && ['l1', 'l2', 'l3'].every(has)) return ['sight', 'bless'];
  return [p]; };
const SPAWN = null;     /* (the chapter places him by its phase: c_story.js) */
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
    : { v: 2, ch: 'e4c4', stats: { sanity: 90, awareness: 55, wisdom: 52 }, inv: { gear: {}, bag: [] }, phase: ph,
        conduct: { s: 0, a: 0, notes: [] }, choices: {}, at: SPAWN, done: false, t: 1 };
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
    /* (M8) the landing is read only once the stage has APPLIED the save (its first live frame: stage.info().applied) and
       two more frames are drawn. A fixed twelve seconds was not that: with four browsers on this box a frame took longer,
       and `check:h,t` was read before its resume ran ("wanted check, got arrive", the saved string still the seed) */
    const applied = () => p.waitForFunction(() => { try { return ['decide', 'cine'].includes(window.__enc.getState()) || window.__enc.stage.info().applied === true; } catch { return false; } }, null, { timeout: 900000, polling: 500 });
    const drawn = async (n) => { for (let i = 0; i < n; i++) await p.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))); };
    await applied(); await drawn(3); await p.waitForTimeout(3000); await drawn(2);
    /* (v25.0 CP13) a phase that starts a film from play on a Continue (the visit plays again, then hands to the clearing)
       is in play for a frame before its film starts, so the check above can see play and the landing was read inside the
       film ("WRONG (wanted clearing, got visit)", in the cine state): a film found after the wait is skipped the same way
       and the landing read after it */
    for (let n = 0; n < 2 && await p.evaluate(() => window.__enc.getState() === 'cine'); n++) {
      await p.waitForFunction(() => !window.__enc.cine.active() || window.__enc.cine.t() > 3.1, null, { timeout: 600000, polling: 300 });
      await p.evaluate(() => window.__enc.cine.skip());
      await p.waitForFunction(() => ['play', 'decide'].includes(window.__enc.getState()), null, { timeout: 600000, polling: 500 });
      await applied(); await drawn(3); await p.waitForTimeout(3000); await drawn(2);
    }
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
        const pOf = (q) => String(q.phase || '').split(':')[0];
        const same = pOf(r.land) === pOf(r.again) ? JSON.stringify(r.land.obj) === JSON.stringify(r.again.obj) : (WANT(ph).includes(pOf(r.again)) && WANT(ph).length > 1);
        r.sameSitting = same ? 'same' : 'DIFFERS';
        if (!same) await p.screenshot({ path: `${OUT}/${VIEW}-${ph.replace(/[^a-z0-9]+/gi, '_')}-again.jpg`, quality: 65, timeout: 240000 });
      }
    }
  } catch (e) { r.fail = String(e.message || e).slice(0, 200); }
  r.errs = errs;
  const want = WANT(ph);
  const got = r.land && r.land.phase ? String(r.land.phase).split(':')[0] : null;
  r.landed = want.includes(got) ? 'right' : `WRONG (wanted ${want.join(' or ')}, got ${got})`;
  if (done && r.land && r.land.ch !== 'e4c4') r.landed = `WRONG CHAPTER (${r.land.ch})`;
  if (r.fail || errs.length || r.sameSitting === 'DIFFERS' || r.landed !== 'right') bad++;
  console.log(el(), JSON.stringify(r));
  await ctx.close();
}
await b.close();
console.log(bad ? `RESULT ${bad} phase(s) with a failure, a page error or a same-sitting difference` : 'RESULT every phase landed with no page error');
console.log('exit');
