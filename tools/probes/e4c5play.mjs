/* v28.0 (E4C5, M7): THE PLAY, PLAYED ON A PHONE. Episode 4 chapter 5 booted on a phone (390 x 844 CSS points drawn at two
   pixels a point, a TOUCH context), Start pressed, the opening skipped by its key, and then each of the three plays driven
   through the REAL input path: every press a real touch on the thing's own mark (hotMarkAt) or on the HUD's own buttons
   (SMELL, the eye), CDP touch events with their own timestamps. Where he walks is set (the walk test walks the ground; this
   probe tests what is pressed and said). A picture at every beat; the story's state, the lines heard and the objective
   written beside it (OUT/log.txt). Every page error and console error is kept.
     ENC_DIST=<snapshot> CHROMIUM_PATH=... [OUT=dir] [PART=walk,hunt,table] node tools/probes/e4c5play.mjs */
import { chromium } from 'playwright';
import fs from 'node:fs';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const OUT = process.env.OUT || '/tmp/e4c5play';
fs.mkdirSync(OUT, { recursive: true });
const PART = (process.env.PART || 'walk,hunt,table').split(',');
const b = await chromium.launch(LAUNCH);
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
const p = await ctx.newPage(); const errs = [];
p.on('pageerror', e => errs.push('PAGEERROR ' + e.message + ' | ' + String(e.stack || '').split('\n').slice(1, 3).join(' ')));
p.on('console', m => { if (m.type() === 'error' || /threw|has no take|no line/i.test(m.text())) errs.push('CONSOLE ' + m.text().slice(0, 240)); });
const T0 = Date.now(), logf = fs.createWriteStream(OUT + '/log.txt');
const log = (...a) => { const s = ((Date.now() - T0) / 1000).toFixed(0) + 's ' + a.join(' '); console.log(s); logf.write(s + '\n'); };
const frames = (n = 4) => p.evaluate((n) => new Promise(r => { let k = 0; const f = () => (++k >= n ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); }), n);
const st = () => p.evaluate(() => { const E = window.__enc, S = E.stage, i = S.info(), sn = S.snap().story, k = E.kitDebug ? E.kitDebug() : {};
  return { state: E.getState(), phase: sn.phase, found: sn.found.join(','), busy: sn.busy, q: i.queued, heard: i.heard.slice(-4).join(' '), smell: sn.smell,
           heat: sn.heat, pending: sn.pending, obj: (document.querySelector('#objective, #obj, .objective') || {}).textContent || k.objective || '', vis: E.kit && E.kit.vision ? JSON.stringify(E.kit.vision()) : '' }; });
const wait = (fn, arg, secs = 240) => p.waitForFunction(fn, arg, { timeout: secs * 1000, polling: 250 });
const idle = () => wait(() => { const S = window.__enc.stage, i = S.info(); return i.queued === 0 && !i.busy && !i.pending && i.t >= i.until; }, null, 400);
let shot = 0;
async function pic(name) { await frames(3); const s = await st(); const f = `${OUT}/${String(++shot).padStart(2, '0')}-${name}.png`;
  try { await p.screenshot({ path: f, timeout: 240000 }); } catch { log('  (no picture)'); }
  log('PIC', name, JSON.stringify(s)); }
async function at(x, z, ry, pt = -0.08) {
  await p.evaluate(([x, z, ry, pt]) => { const E = window.__enc; E.yaw.position.x = x; E.yaw.position.z = z; E.yaw.rotation.y = ry; E.pitch.rotation.x = pt; }, [x, z, ry, pt]);
  await frames(4);
}
async function tapMark(id) {
  let q = await p.evaluate((id) => window.__enc.hotMarkAt(id), id);
  if (q && (q.z >= 1 || q.x < 20 || q.y < 60 || q.x > 370 || q.y > 800)) {
    /* off the screen: he turns to it, as a player would */
    await p.evaluate((id) => { const E = window.__enc, h = E.stage.hotspots.find(s => s.id === id); const dx = h.pos.x - E.yaw.position.x, dz = h.pos.z - E.yaw.position.z;
      E.yaw.rotation.y = Math.atan2(-dx, -dz); }, id);
    await frames(4); q = await p.evaluate((id) => window.__enc.hotMarkAt(id), id); log('  turned to', id); }
  if (!q || q.z >= 1 || q.x < 0 || q.y < 0 || q.x > 390 || q.y > 844) { log('  mark not on screen:', id, JSON.stringify(q)); return false; }
  await p.touchscreen.tap(q.x, q.y); log('  tapped', id, q.x.toFixed(0), q.y.toFixed(0)); await frames(3); return true;
}
async function tapEl(sel) {
  const r = await p.evaluate((sel) => { const e = document.querySelector(sel); if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width }; }, sel);
  if (!r || !r.w) { log('  no element', sel); return false; }
  await p.touchscreen.tap(r.x, r.y); log('  tapped', sel); await frames(3); return true;
}
const SMELL = '.cBtn';
await p.goto(PAGE + '?ch=e4c5', { waitUntil: 'load', timeout: 240000 });
await p.waitForFunction(() => !!window.__enc, null, { timeout: 120000 });
await p.evaluate(() => document.getElementById('startBtn').click());
await toPlay(p, 1500000);
await wait(() => { try { return window.__enc.stage.ready(); } catch { return false; } }, null, 900);
log('play, ready');

if (PART.includes('walk')) {
  await at(0, 0.25, 0, -0.06); await frames(8); await pic('walk-start');
  await tapMark('ton'); await wait(() => window.__enc.stage.info().heard.includes('tn5w1'), null); await pic('walk-askton');
  await idle(); await tapMark('jun'); await wait(() => window.__enc.stage.info().heard.includes('ju5w1'), null); await pic('walk-askjun');
  await wait(() => window.__enc.stage.info().heard.includes('ph5w2'), null); await pic('walk-pho-smell');
  await idle(); await frames(4); await pic('walk-follow');
  await tapEl('#visionBtn'); await wait(() => window.__enc.stage.info().heard.includes('ph5w3'), null, 60).catch(() => log('  no ph5w3')); await pic('walk-eye-notyet');
  await idle(); await tapEl(SMELL); await new Promise(r => setTimeout(r, 1500)); await pic('walk-smell-lift');
  await at(0.1, -6.6, -0.3, -0.35); await new Promise(r => setTimeout(r, 7000)); await tapEl(SMELL); await new Promise(r => setTimeout(r, 1500)); await pic('walk-smell-drain');
  await tapMark('drain'); await wait(() => window.__enc.stage.info().heard.includes('q5w2'), null); await pic('walk-drain');
  await idle(); await at(0.0, -12.0, 0.35, -0.22); await new Promise(r => setTimeout(r, 6000)); await tapEl(SMELL); await new Promise(r => setTimeout(r, 1600)); await pic('walk-smell-turn');
  await at(-6.6, -14.85, Math.PI / 2, -0.2); await new Promise(r => setTimeout(r, 6000)); await tapEl(SMELL); await new Promise(r => setTimeout(r, 1600)); await pic('walk-smell-gate');
  await at(-8.5, -15.1, Math.PI, -0.1); await tapMark('gate'); await wait(() => window.__enc.stage.info().heard.includes('ph5w5'), null); await pic('walk-gate');
  await wait(() => window.__enc.stage.snap().story.phase === 'hunt', null);
  log('walk done');
}
if (PART.includes('hunt')) {
  if (!PART.includes('walk')) { await p.evaluate(() => window.__enc.stage.setPhase('hunt')); }
  await wait(() => window.__enc.getState() === 'play' && window.__enc.stage.snap().story.phase === 'hunt', null); await frames(6);
  await pic('hunt-start');
  await tapEl(SMELL); await new Promise(r => setTimeout(r, 1500)); await pic('hunt-smell-door');
  await at(-8.9, -4.75, -0.55, -0.55); await pic('hunt-shoecab-mark');
  await tapMark('stain1'); await pic('hunt-stain1-ask');
  await tapEl('#visionBtn'); await wait(() => window.__enc.stage.info().heard.includes('q5h1'), null); await new Promise(r => setTimeout(r, 1500)); await pic('hunt-stain1-seen');
  await idle(); await tapEl('#visionBtn'); await new Promise(r => setTimeout(r, 2500));
  await at(-7.4, -2.9, Math.PI + 0.1, -0.35); await tapEl(SMELL); await new Promise(r => setTimeout(r, 1500)); await pic('hunt-smell-armchair');
  await tapMark('armchair'); await tapEl('#visionBtn'); await wait(() => window.__enc.stage.info().heard.includes('ph5h4'), null); await pic('hunt-armchair');
  await idle(); await tapEl('#visionBtn'); await new Promise(r => setTimeout(r, 2500));
  await at(-7.5, -10.4, -0.2, -0.3); await new Promise(r => setTimeout(r, 6000)); await tapEl(SMELL); await new Promise(r => setTimeout(r, 1500)); await pic('hunt-smell-court');
  await tapEl('#visionBtn'); await wait(() => window.__enc.stage.info().heard.includes('ph5h1'), null); await new Promise(r => setTimeout(r, 1800)); await pic('hunt-nine');
  await idle(); await pic('hunt-after-nine');
  await at(-7.6, -11.6, Math.PI / 2 + 0.3, -0.5); await tapMark('stain2'); await wait(() => window.__enc.stage.info().heard.includes('q5h2'), null); await pic('hunt-stain2');
  await idle(); await at(-8.5, -12.6, 0, -0.45); await tapMark('stain3'); await wait(() => window.__enc.stage.info().heard.includes('q5h3'), null); await pic('hunt-stain3');
  await wait(() => window.__enc.stage.info().heard.includes('ph5h3'), null); await pic('hunt-belief');
  await wait(() => window.__enc.stage.snap().story.phase === 'fight', null);
  log('hunt done');
}
if (PART.includes('table')) {
  await p.evaluate(() => window.__enc.stage.setPhase('table'));
  await wait(() => window.__enc.getState() === 'play' && window.__enc.stage.snap().story.phase === 'table', null); await frames(6);
  await pic('table-start');
  await tapEl(SMELL); await new Promise(r => setTimeout(r, 1500)); await pic('table-smell');
  await wait(() => window.__enc.stage.snap().story.found.includes('m'), null); await pic('table-look-order');
  await tapEl('#visionBtn'); await new Promise(r => setTimeout(r, 3000)); await pic('table-vision');
  for (const [id, line] of [['look1', 'ph5t1'], ['look2', 'ph5t2'], ['look3', 'ph5t3']]) {
    await idle();
    const q = await p.evaluate((id) => { const E = window.__enc, h = E.stage.hotspots.find(s => s.id === id); return h ? [h.pos.x, h.pos.y, h.pos.z] : null; }, id);
    /* turn the lens onto the piece (the look is his to aim), then tap its mark */
    await p.evaluate(([x, y, z]) => { const E = window.__enc; const dx = x - E.yaw.position.x, dz = z - E.yaw.position.z, dy = y - E.yaw.position.y;
      E.yaw.rotation.y = Math.atan2(-dx, -dz); E.pitch.rotation.x = Math.atan2(dy, Math.hypot(dx, dz)); }, q);
    await frames(4); await tapMark(id);
    await wait((l) => window.__enc.stage.info().heard.includes(l), line, 120).catch(() => log('  not heard', line));
    await pic('table-' + id);
  }
  await wait(() => window.__enc.stage.info().heard.includes('co5t6'), null); await pic('table-question');
  await wait(() => window.__enc.getState() === 'decide', null, 120).then(() => log('decision open')).catch(() => log('  no decision'));
  await frames(4); await pic('table-decision');
}
log('errors', errs.length ? errs.join('\n') : 'none');
await b.close(); process.exit(errs.length ? 1 : 0);
