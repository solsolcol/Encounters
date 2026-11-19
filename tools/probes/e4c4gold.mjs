/* v27.0 build 46 (Chad, 19 Nov 2026, R107 to R110): LUANG PU PHIBOON'S MOMENT, photographed on a phone (390 x 844 CSS points
   drawn at DSF device pixels a point, 2 by default, a touch context). A real save in the blessing with the water given
   (`bless:w`) is Continued from the title by a tap, the fight's brief STARTed by a tap, his sight opened by a tap on its
   eye, and the blessing put at its surge (the fight's own `k`, FIGHT.surgeAt): the surge, his call, his teacher's word and
   his, and the amulet's showcase, all as the chapter runs them.
   The SHOWCASE is photographed in SLOW MOTION: the engine's own timers and drawn light SLOW times slower (window.__enc
   .showSlow) and each of the page's own animations the same, set on each the moment it exists (never through the
   browser's animation domain, which stalls the frame clock the drawn light is timed by: build 48 found every line of it
   undrawn that way), so each moment of AT (seconds of the showcase) is a photograph of that moment: the lines gathering,
   its birth, its hover, its release, its dive. MERGE_AT then photographs the merge's rings, wash and shockwave (seconds
   after the merge, still slowed, while the showcase stands).
   THE NOVA is in play and not slowed (the world's clock is the wall's): the green ones counted the moment the showcase
   closes (how many the gold's wave struck, each burning out quick), the wave's strength, and the return (how many came
   back, and when), photographed as it plays.
   Every page error and console error is printed; the run exits non-zero on one, or if the wave struck none or none came
   back.
     ENC_DIST=<snapshot> CHROMIUM_PATH=... [OUT=dir] [DSF=2] [SLOW=12] [AT=0.35,...] [MERGE_AT=0.05,...] node tools/probes/e4c4gold.mjs */
import { chromium } from 'playwright';
import fs from 'node:fs';
import { LAUNCH, PAGE } from '../../testlib.mjs';
const OUT = process.env.OUT || '/tmp/e4c4gold';
fs.mkdirSync(OUT, { recursive: true });
const DSF = +(process.env.DSF || 2), SLOW = +(process.env.SLOW || 12);
const AT = (process.env.AT || '0.3,0.6,0.85,1.0,1.2,2.6,4.12,4.4,4.85').split(',').map(Number);
const MERGE_AT = (process.env.MERGE_AT || '0.02,0.06,0.1').split(',').map(Number);
const MERGE = 5.2 - 0.12;                                          // (the showcase's merge, seconds into its 5.2: main.js fillT)
const b = await chromium.launch(LAUNCH);
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: DSF, hasTouch: true, isMobile: true });
const save = { v: 2, ch: 'e4c4', stats: { sanity: 90, awareness: 55, wisdom: 52 }, inv: { gear: {}, bag: [] }, phase: 'bless:w',
               conduct: { s: 0, a: 0, notes: [] }, choices: {}, at: { x: 0.15, y: 1.62, z: 1.0 }, done: false, t: 1 };
await ctx.addInitScript(s => { if (!sessionStorage.getItem('seeded')) { localStorage.setItem('mz.encounters.checkpoint', s); sessionStorage.setItem('seeded', '1'); } }, JSON.stringify(save));
const p = await ctx.newPage();
const errs = [];
p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
p.on('console', m => { if (m.type() === 'error' || /failed|threw/i.test(m.text())) errs.push('CONSOLE ' + m.text().slice(0, 240)); });
const T0 = Date.now(), log = (...a) => console.log(((Date.now() - T0) / 1000).toFixed(0) + 's', ...a);
const tap = (x, y) => p.touchscreen.tap(Math.round(x), Math.round(y));
const box = (sel) => p.evaluate((sel) => { const e = document.querySelector(sel); if (!e) return null; const r = e.getBoundingClientRect();
  return r.width > 2 && r.height > 2 && e.offsetParent !== null ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : null; }, sel);
const shot = (name) => p.screenshot({ path: `${OUT}/gold-${name}.png`, timeout: 240000 });
const fightState = () => p.evaluate(() => { const F = window.__enc.stage.dbg.play.fight; if (!F) return null;
  const n = (st) => F.shapes.filter(S => S.state === st).length;
  return { on: F.on, call: F.call, k: +F.k.toFixed(3), come: n('come'), feed: n('feed'), leave: n('leave'), quick: F.shapes.filter(S => S.state === 'leave' && S.quick).length,
           gone: n('gone'), dart: n('dart'), wind: n('wind'), batchAt: +(F.batchAt || 0).toFixed(2), backN: F.backN || 0, hp: F.hp, wave: window.__enc.vision().wave }; });

await p.goto(PAGE, { waitUntil: 'load', timeout: 240000 });
await p.waitForFunction(() => !!window.__enc, null, { timeout: 120000 });
await p.waitForTimeout(1500);
{ const sb = await box('#startBtn'); await tap(sb.x, sb.y); }
log('Continue tapped');
/* the brief's START, then the fight */
for (let i = 0; i < 600; i++) {
  const s = await p.evaluate(() => { const E = window.__enc; let ev = null; try { ev = E.kitDebug().event; } catch { }
    const F = E.stage && E.stage.dbg && E.stage.dbg.play.fight; return { st: E.getState(), brief: !!(ev && ev.briefing), on: !!(F && F.on) }; });
  if (s.on) break;
  if (s.st === 'cine') { await p.evaluate(() => { try { window.__enc.cine.skip(); } catch { } }); }
  if (s.st === 'unlock') { const c = await p.evaluate(() => { const b = [...document.querySelectorAll('#unlock button')].find(x => x.offsetParent); if (!b) return null; const r = b.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }); if (c) await tap(c.x, c.y); }
  if (s.brief) { const bt = await box('#evBtn'); if (bt) { await tap(bt.x, bt.y); log('START tapped'); } }
  await p.waitForTimeout(1000);
}
log('the fight', JSON.stringify(await fightState()));
/* his sight opened, as a thumb opens it */
if (!(await p.evaluate(() => window.__enc.vision().on))) { const vb = await box('#visionBtn'); if (vb) { await tap(vb.x, vb.y); log('sight opened'); } }
await p.waitForTimeout(2500);
/* the blessing at its surge */
await p.evaluate(() => { const F = window.__enc.stage.dbg.play.fight; F.k = Math.max(F.k, 0.70); });
await p.waitForFunction(() => { const F = window.__enc.stage.dbg.play.fight; return F && F.call === 'surge'; }, null, { timeout: 300000, polling: 300 });
log('the surge', JSON.stringify(await fightState()));
/* slow motion from here, before his call (a picture taken on this box can take longer than the call's lines, so the call
   is never waited for by name): the engine's showcase and the page's CSS animations alike */
/* (build 48: NOT through the browser's animation domain. Its playback rate slows the frame clock as well (a frame's time
   stood 8 s behind the page's after it), and the showcase's drawn light is timed by the frame's time: every line it
   draws fell before its own start and none was drawn, in every picture. Each of the page's own animations is slowed
   instead, the moment it exists: a watcher on every change of class or style sets its rate, and the frame loop checks) */
await p.evaluate((f) => { window.__enc.showSlow(f); const R = 1 / f;
  const fix = () => { for (const a of document.getAnimations()) if (a.playbackRate !== R) a.playbackRate = R; };
  window.__slowFix = new MutationObserver(fix); window.__slowFix.observe(document.documentElement, { attributes: true, subtree: true, childList: true, attributeFilter: ['class', 'style'] });
  const loop = () => { if (!window.__slowFix) return; fix(); requestAnimationFrame(loop); }; fix(); requestAnimationFrame(loop); }, SLOW);
log('slowed', SLOW, 'times');
/* (her life held full by the probe until the showcase opens: nothing defends her here, and twelve at once took her life
   before his call was answered on both first runs, the loss's film in place of the showcase) */
{ const until = Date.now() + 600000; let last = '';
  for (;;) {
    const s = await p.evaluate(() => { const E = window.__enc, F = E.stage.dbg.play.fight; if (F && F.on) F.hp = 100;
      return { st: E.getState(), show: E.showT(), call: F ? F.call : null }; });
    if (s.st === 'unlock' && s.show != null) break;
    if (s.st + s.call !== last) { last = s.st + s.call; log('  waiting:', JSON.stringify(s)); }
    if (s.st === 'lost' || Date.now() > until) throw new Error('the showcase never opened: ' + JSON.stringify(s));
    await p.waitForTimeout(150);
  } }
log('the showcase opened, slowed', SLOW, 'times');
for (const t of AT) {
  await p.waitForFunction((t) => { const s = window.__enc.showT(); return s == null || s >= t; }, t, { timeout: 600000, polling: 'raf' });
  const s = await p.evaluate(() => window.__enc.showT());
  if (s == null) { log('the showcase closed before', t); break; }
  await shot('show-' + t.toFixed(2)); log('photographed the showcase at', t, '(taken at', s.toFixed(2), 'to', (await p.evaluate(() => window.__enc.showT()) || 0).toFixed(2) + ')');
}
/* the merge, still slowed: its rings, its wash, its shockwave and the shake */
let closedAt = null, closeState = null;
for (const dt of MERGE_AT) {
  const t = MERGE + dt;
  const ok = await p.waitForFunction((t) => { const s = window.__enc.showT(); return s == null || s >= t; }, t, { timeout: 600000, polling: 'raf' }).then(() => true).catch(() => false);
  const s = await p.evaluate(() => window.__enc.showT());
  if (!ok) break;
  /* (the merge is photographed only while the showcase stands: once it has closed, the wave and the return are measured
     at once, at the wall's clock, before any picture) */
  if (s == null) { closedAt = Date.now(); closeState = await fightState(); log('the showcase has closed (the nova runs at the wall clock from here)', JSON.stringify(closeState)); break; }
  await shot('merge+' + dt.toFixed(2)); log('photographed the merge at +', dt, '(showcase ' + s.toFixed(2) + ')');
}
/* the nova and the return, at the wall's clock */
await p.waitForFunction(() => window.__enc.getState() === 'play', null, { timeout: 600000, polling: 100 });
if (closedAt == null) { closedAt = Date.now(); closeState = await fightState(); log('the showcase closed', JSON.stringify(closeState)); }
await p.evaluate(() => { if (window.__slowFix) { window.__slowFix.disconnect(); window.__slowFix = null; } for (const a of document.getAnimations()) a.playbackRate = 1; window.__enc.showSlow(1); });
/* the wave and the return MEASURED before any picture (a picture on this box can take longer than the whole return):
   the fight read every 150 ms for POLL seconds of the page's own clock, a line each time what it holds changes */
{ const POLL = +(process.env.POLL || 6), t0 = await p.evaluate(() => performance.now()); let last = '';
  for (;;) {
    const s = await p.evaluate((t0) => { const F = window.__enc.stage.dbg.play.fight, n = (st) => F.shapes.filter(S => S.state === st).length;
      return { t: +((performance.now() - t0) / 1000).toFixed(2), call: F.call, come: n('come'), feed: n('feed'), leave: n('leave'),
               quick: F.shapes.filter(S => S.state === 'leave' && S.quick).length, gone: n('gone'), backN: F.backN || 0, wave: window.__enc.vision().wave }; }, t0);
    const key = JSON.stringify({ ...s, t: 0 });
    if (key !== last) { last = key; log('  the fight at', s.t, 's after the close:', JSON.stringify(s)); }
    if (s.t >= POLL) break;
    await p.waitForTimeout(150);
  } }
const seen = [];
for (let i = 0; i < 8; i++) {
  const st = await fightState(); seen.push({ after: +((Date.now() - closedAt) / 1000).toFixed(2), ...st });
  log('after the close', seen[seen.length - 1].after, 's:', JSON.stringify(st));
  await shot('nova-' + i);
}
const struck = Math.max(closeState ? closeState.quick : 0, ...seen.map(s => s.quick)), back = Math.max(...seen.map(s => s.come + s.feed));
log('the gold\'s wave struck', struck, 'at most at once; the most that came back', back);
if (!struck) errs.push('THE WAVE STRUCK NONE');
if (!back) errs.push('NONE CAME BACK');
log('errors', errs.length ? errs.join('\n') : 'none');
await b.close();
process.exit(errs.length ? 1 : 0);
