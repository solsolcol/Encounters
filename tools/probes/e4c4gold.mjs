/* v27.0 build 46 (Chad, 19 Nov 2026, R107 to R110): LUANG PU PHIBOON'S MOMENT, photographed on a phone (390 x 844 CSS points
   drawn at DSF device pixels a point, 2 by default, a touch context). A real save in the blessing with the water given
   (`bless:w`) is Continued from the title by a tap, the fight's brief STARTed by a tap, his sight opened by a tap on its
   eye, and the blessing put at its surge (the fight's own `k`, FIGHT.surgeAt): the surge, his call, his teacher's word and
   his, and the amulet's showcase, all as the chapter runs them.
   The SHOWCASE is photographed in SLOW MOTION: the engine's own timers and drawn light SLOW times slower (window.__enc
   .showSlow) and the page's CSS animations the same through the browser's animation domain, so each moment of AT (seconds
   of the showcase) is a photograph of that moment: the lines gathering, its birth, its hover, its release, its dive, the
   merge. MERGE_AT then photographs the merge's rings, wash and shockwave (seconds after the merge, still slowed).
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
const MERGE_AT = (process.env.MERGE_AT || '0.03,0.1,0.2,0.35,0.6').split(',').map(Number);
const MERGE = 5.2 - 0.12;                                          // (the showcase's merge, seconds into its 5.2: main.js fillT)
const b = await chromium.launch(LAUNCH);
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: DSF, hasTouch: true, isMobile: true });
const save = { v: 2, ch: 'e4c4', stats: { sanity: 90, awareness: 55, wisdom: 52 }, inv: { gear: {}, bag: [] }, phase: 'bless:w',
               conduct: { s: 0, a: 0, notes: [] }, choices: {}, at: { x: 0.15, y: 1.62, z: 1.0 }, done: false, t: 1 };
await ctx.addInitScript(s => { if (!sessionStorage.getItem('seeded')) { localStorage.setItem('mz.encounters.checkpoint', s); sessionStorage.setItem('seeded', '1'); } }, JSON.stringify(save));
const p = await ctx.newPage();
const cdp = await ctx.newCDPSession(p);
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
await p.waitForTimeout(2500);
await shot('surge');
await p.waitForFunction(() => { const F = window.__enc.stage.dbg.play.fight; return F && F.call === 'asking'; }, null, { timeout: 300000, polling: 300 });
log('the call', JSON.stringify(await fightState()));
/* slow motion from here: the engine's showcase and the page's CSS animations alike */
await p.evaluate((f) => window.__enc.showSlow(f), SLOW);
await cdp.send('Animation.enable'); await cdp.send('Animation.setPlaybackRate', { playbackRate: 1 / SLOW });
await p.waitForFunction(() => window.__enc.getState() === 'unlock' && window.__enc.showT() != null, null, { timeout: 300000, polling: 100 });
log('the showcase opened, slowed', SLOW, 'times');
for (const t of AT) {
  await p.waitForFunction((t) => { const s = window.__enc.showT(); return s == null || s >= t; }, t, { timeout: 600000, polling: 'raf' });
  const s = await p.evaluate(() => window.__enc.showT());
  if (s == null) { log('the showcase closed before', t); break; }
  await shot('show-' + t.toFixed(2)); log('photographed the showcase at', t, '(taken at', s.toFixed(2), 'to', (await p.evaluate(() => window.__enc.showT()) || 0).toFixed(2) + ')');
}
/* the merge, still slowed: its rings, its wash, its shockwave and the shake */
let closedAt = null;
for (const dt of MERGE_AT) {
  const t = MERGE + dt;
  const ok = await p.waitForFunction((t) => { const s = window.__enc.showT(); return s == null || s >= t; }, t, { timeout: 600000, polling: 'raf' }).then(() => true).catch(() => false);
  const s = await p.evaluate(() => window.__enc.showT());
  if (!ok) break;
  if (s == null && closedAt == null) { closedAt = Date.now(); log('the showcase has closed (the nova runs at the wall clock from here)', JSON.stringify(await fightState())); }
  await shot('merge+' + dt.toFixed(2)); log('photographed the merge at +', dt, s == null ? '(after the close)' : '(showcase ' + s.toFixed(2) + ')');
}
/* the nova and the return, at the wall's clock */
await p.waitForFunction(() => window.__enc.getState() === 'play', null, { timeout: 600000, polling: 100 });
if (closedAt == null) { closedAt = Date.now(); log('the showcase closed', JSON.stringify(await fightState())); }
await cdp.send('Animation.setPlaybackRate', { playbackRate: 1 }); await p.evaluate(() => window.__enc.showSlow(1));
const seen = [];
for (let i = 0; i < 8; i++) {
  const st = await fightState(); seen.push({ after: +((Date.now() - closedAt) / 1000).toFixed(2), ...st });
  log('after the close', seen[seen.length - 1].after, 's:', JSON.stringify(st));
  await shot('nova-' + i);
}
const struck = Math.max(...seen.map(s => s.quick)), back = Math.max(...seen.map(s => s.come + s.feed));
log('the gold\'s wave struck', struck, 'at most at once; the most that came back', back);
if (!struck) errs.push('THE WAVE STRUCK NONE');
if (!back) errs.push('NONE CAME BACK');
log('errors', errs.length ? errs.join('\n') : 'none');
await b.close();
process.exit(errs.length ? 1 : 0);
