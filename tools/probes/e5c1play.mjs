/* v29.0 (E5C1 PLAY, M6): EPISODE 5 CHAPTER 1'S PLAY, PLAYED BY REAL INPUT. Booted on a phone (390 x 844 CSS points at two
   pixels a point, a TOUCH context) or a desktop (1280 x 800, the mouse and the keys), Start pressed, the opening skipped
   as a player may, then each phase driven through the real input path: every press a real touch (CDP, its own timestamps)
   or a real mouse click on the thing's own mark (hotMarkAt), the eye button, START; KEEP THE WATER STILL held by a real
   finger (or the mouse button) dragged against the drift of the mark, read off the screen; at three o'clock his walk set
   along the way (the walk test walks the ground; this probe tests what is pressed, felt and said). A picture at every
   beat, the story's state beside it (OUT/log.txt); every page error and console error kept.
     ENC_DIST=<snapshot> CHROMIUM_PATH=... VIEW=phone|desktop [OUT=dir] [PART=room,breaking,night] [SPILL=1] [OPT=A..D]
       [CHFILE=<e5c1.js>] [PICS=0] node tools/probes/e5c1play.mjs
   SPILL=1: the first surge let go (no finger), so the light leaves the ring: the spill, "Slowly. Again.", the surge once more.
   CHFILE: the chapter served from that file instead of the build's (a chapter-only change photographed with no build) */
import { chromium } from 'playwright';
import fs from 'node:fs';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const VIEW = process.env.VIEW || 'phone', PHONE = VIEW === 'phone';
const W0 = PHONE ? 390 : 1280, H0 = PHONE ? 844 : 800;
const OUT = (process.env.OUT || '/tmp/e5c1play') + '-' + VIEW;
fs.mkdirSync(OUT, { recursive: true });
const PART = (process.env.PART || 'room,breaking,night').split(',');
const PICS = process.env.PICS !== '0';
const b = await chromium.launch(LAUNCH);
const ctx = await b.newContext(PHONE ? { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true }
                                     : { viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 });
const p = await ctx.newPage(); const errs = [];
if (process.env.CHFILE) { const CHSRC = fs.readFileSync(process.env.CHFILE, 'utf8');
  await p.route(new RegExp('/assets/e5c1\\.[0-9a-f]+\\.js$'), (r) => r.fulfill({ status: 200, contentType: 'text/javascript', body: CHSRC })); }
p.on('pageerror', e => errs.push('PAGEERROR ' + e.message + ' | ' + String(e.stack || '').split('\n').slice(1, 3).join(' ')));
p.on('console', m => { if (m.type() === 'error' || /threw|has no take|no line|failed to load|not a seat|too little skin|no .* leg/i.test(m.text())) errs.push('CONSOLE ' + m.text().slice(0, 240)); });
const cdp = PHONE ? await ctx.newCDPSession(p) : null;
const T0 = Date.now(), logf = fs.createWriteStream(OUT + '/log.txt');
const log = (...a) => { const s = ((Date.now() - T0) / 1000).toFixed(0) + 's ' + a.join(' '); console.log(s); logf.write(s + '\n'); };
const frames = (n = 4) => p.evaluate((n) => new Promise(r => { let k = 0; const f = () => (++k >= n ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); }), n);
const st = () => p.evaluate(() => { const E = window.__enc, S = E.stage, i = S.info(), sn = i.story;
  return { state: E.getState(), phase: sn.phase, found: sn.found.join(','), busy: sn.busy, q: i.queued, heard: i.heard.slice(-3).join(' '), p: sn.pressure,
           chant: sn.chant, brk: sn.brk, night: sn.night, grace: sn.grace, obj: ((document.querySelector('#objective .obox') || {}).textContent || '').trim().slice(0, 60),
           vis: E.kit && E.kit.vision ? (E.kit.vision() || {}).on : null, press: E.kit && E.kit.pressState ? E.kit.pressState().k : null }; });
const wait = (fn, arg, secs = 240) => p.waitForFunction(fn, arg, { timeout: secs * 1000, polling: 250 });
const idle = () => wait(() => { const S = window.__enc.stage, i = S.info(); return i.queued === 0 && !i.busy && !i.pending && i.t >= i.until; }, null, 400);
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
let shot = 0;
async function pic(name) { await frames(3); const s = await st(); const f = `${OUT}/${String(++shot).padStart(2, '0')}-${name}.png`;
  if (PICS) { try { await p.screenshot({ path: f, timeout: 240000 }); } catch { log('  (no picture)'); } }
  log('PIC', name, JSON.stringify(s)); }
async function press(x, y) {
  if (PHONE) await p.touchscreen.tap(x, y); else await p.mouse.click(x, y);
}
async function lookAt(x, y, z) {
  await p.evaluate(([x, y, z]) => { const E = window.__enc, dx = x - E.yaw.position.x, dz = z - E.yaw.position.z, dy = y - E.yaw.position.y;
    E.yaw.rotation.y = Math.atan2(-dx, -dz); E.pitch.rotation.x = Math.atan2(dy, Math.hypot(dx, dz)); }, [x, y, z]); await frames(4);
}
async function tapMark(id) {
  let q = await p.evaluate((id) => window.__enc.hotMarkAt(id), id);
  if (!q || q.z >= 1 || q.x < 20 || q.y < 60 || q.x > W0 - 20 || q.y > H0 - 40) {
    /* off the screen: he turns to it, as a player would (the look clamped as the chapter clamps it) */
    await p.evaluate((id) => { const E = window.__enc, h = E.stage.hotspots.find(s => s.id === id); const dx = h.pos.x - E.yaw.position.x, dz = h.pos.z - E.yaw.position.z;
      const my = (h.pos.y ?? 1.0) + (h.markY ?? 0.55) - E.yaw.position.y;
      E.yaw.rotation.y = Math.atan2(-dx, -dz); E.pitch.rotation.x = Math.max(-1.0, Math.min(0.6, Math.atan2(my, Math.hypot(dx, dz)))); }, id);
    await frames(6); q = await p.evaluate((id) => window.__enc.hotMarkAt(id), id); log('  turned to', id); }
  if (!q || q.z >= 1 || q.x < 0 || q.y < 0 || q.x > W0 || q.y > H0) { log('  mark not on screen:', id, JSON.stringify(q)); return false; }
  await press(q.x, q.y); log('  pressed', id, q.x.toFixed(0), q.y.toFixed(0)); await frames(3); return true;
}
async function tapEl(sel) {
  const r = await p.evaluate((sel) => { const e = document.querySelector(sel); if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.x + b.width / 2, y: b.y + b.height / 2, w: b.width }; }, sel);
  if (!r || !r.w) { log('  no element', sel); return false; }
  await press(r.x, r.y); log('  pressed', sel); await frames(3); return true;
}
/* A FINGER ON THE BOWL: down at the screen's middle, then dragged against the mark's offset from the ring every 60 ms */
async function holdSteady(secs, slack = 0) {
  const at = { x: W0 / 2, y: H0 * 0.62 };
  const down = async () => { if (PHONE) await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: at.x, y: at.y, id: 7 }] }); else { await p.mouse.move(at.x, at.y); await p.mouse.down(); } };
  const move = async () => { if (PHONE) await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: at.x, y: at.y, id: 7 }] }); else await p.mouse.move(at.x, at.y); };
  const up = async () => { if (PHONE) await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); else await p.mouse.up(); };
  await down(); const t0 = Date.now(); let n = 0, inside = 0;
  while ((Date.now() - t0) / 1000 < secs) {
    const o = await p.evaluate(() => { const S = document.querySelector('#evSteady'); if (!S || S.classList.contains('hide')) return null;
      const r = S.querySelector('.sring').getBoundingClientRect(), m = S.querySelector('.smark').getBoundingClientRect();
      return { dx: (m.x + m.width / 2) - (r.x + r.width / 2), dy: (m.y + m.height / 2) - (r.y + r.height / 2), R: r.width / 2, live: !!window.__enc.kit.eventActive() }; });
    if (!o || !o.live) break;
    n++; if (Math.hypot(o.dx, o.dy) < o.R) inside++;
    at.x = Math.max(5, Math.min(W0 - 5, at.x - o.dx * (0.7 - slack))); at.y = Math.max(5, Math.min(H0 - 5, at.y - o.dy * (0.7 - slack)));
    if (at.x < 40 || at.x > W0 - 40 || at.y < 60 || at.y > H0 - 60) { await up(); at.x = W0 / 2; at.y = H0 * 0.62; await down(); }
    await move(); await sleep(60);
  }
  await up(); return { n, inside };
}
await p.goto(PAGE + '?ch=e5c1', { waitUntil: 'load', timeout: 300000 });
await p.waitForFunction(() => !!window.__enc, null, { timeout: 180000 });
await p.evaluate(() => document.getElementById('startBtn').click());
await toPlay(p, 1500000);
await wait(() => { try { return window.__enc.stage.ready() && window.__enc.stage.info().applied; } catch { return false; } }, null, 900);
log('play, ready');
const people = await p.evaluate(() => { const c = window.__enc.stage.films && window.__enc.stage.films.cast; if (!c) return null; const o = {};
  for (const k in c) { const P = c[k]; o[k] = { key: P.key, ready: P.ready, take: P.cur, seated: P.seated || null, pos: P.group.position.toArray().map(v => +v.toFixed(3)) }; } return o; });
log('PEOPLE', JSON.stringify(people));

if (PART.includes('room')) {
  await frames(8); await pic('room-start');
  await tapMark('jug'); await idle(); await pic('room-poured');
  await tapMark('lighter'); await idle(); await pic('room-lit');
  for (const id of ['phoneher', 'glass', 'hands', 'packet']) {
    if (id === 'glass' || id === 'phoneher') { const h = await p.evaluate((id) => { const s = window.__enc.stage.hotspots.find(q => q.id === id); return s.pos; }, id); await lookAt(h.x, h.y, h.z); }
    else await lookAt(0.6, 0.75, -0.3);
    await wait(() => !window.__enc.stage.info().story.grace.up, null, 60).catch(() => {});
    await tapMark(id); await wait((id) => window.__enc.stage.info().busy, id, 20).catch(() => {}); await sleep(900); await pic('room-' + id); await idle();
  }
  await lookAt(0.42, 0.95, -0.25); await pic('room-askvision');
  await tapEl('#visionBtn'); await wait(() => window.__enc.stage.info().heard.includes('zv51r6'), null, 120).catch(() => log('  no zv51r6'));
  await sleep(1800); await pic('room-redline');
  await wait(() => window.__enc.getState() === 'cine' || window.__enc.stage.info().story.phase === 'breaking', null, 200).catch(() => log('  no keepsake film'));
  log('room done');
}
if (PART.includes('breaking')) {
  if (!PART.includes('room')) { await p.evaluate(() => window.__enc.stage.setPhase('breaking')); }
  await toPlay(p, 1500000);
  await wait(() => window.__enc.kit.eventActive(), null, 120).catch(() => log('  no event'));
  await sleep(1200); await pic('break-brief');
  await tapEl('#evBtn'); await sleep(300);
  for (let s = 0; s < 6; s++) {
    const ph = await p.evaluate(() => window.__enc.stage.info().story.phase); if (ph !== 'breaking') break;
    await wait(() => window.__enc.kit.eventActive() || window.__enc.stage.info().story.phase !== 'breaking', null, 60).catch(() => {});
    const i = await p.evaluate(() => window.__enc.stage.info().story.brk.i);
    if (process.env.SPILL && s === 0) { await sleep(4000); await pic('break-letgo'); await wait(() => window.__enc.stage.info().heard.includes('ph51s1'), null, 30).catch(() => log('  no spill')); await pic('break-spill'); continue; }
    setTimeout(() => pic('break-surge' + i + '-' + s).catch(() => {}), 3500);
    const r = await holdSteady(16); log('  surge', i, 'held', JSON.stringify(r));
    await sleep(1500); await pic('break-between' + s);
  }
  await wait(() => window.__enc.stage.info().story.phase === 'night', null, 120).catch(() => log('  no night'));
  log('breaking done', JSON.stringify((await st()).brk), JSON.stringify((await st()).chant));
}
if (PART.includes('night')) {
  if (!PART.includes('breaking')) await p.evaluate(() => window.__enc.stage.setPhase('night'));
  await toPlay(p, 1500000);
  await wait(() => window.__enc.stage.info().story.phase === 'night', null, 120);
  await frames(8); await pic('night-bed');
  await tapMark('getup'); await idle(); await sleep(2000); await pic('night-up');
  /* the walk, as a player walks it: a step every 0.1 s at a walking pace, stopping when it is pressing hard */
  const way = [[306.7, -0.48], [305.6, 0.4], [304.9, 1.1], [304.2, 1.2], [303.2, 1.05], [302.0, 0.9], [301.0, 0.6], [300.5, 0.5]];
  let wi = 0;
  for (let k = 0; k < 600 && wi < way.length - 1; k++) {
    const s = await st(); if (s.night && s.night.knee) { await sleep(300); continue; }
    if (s.p > 0.85) { await sleep(400); continue; }
    const [ax, az] = way[wi], [bx, bz] = way[wi + 1];
    const r = await p.evaluate(([ax, az, bx, bz]) => { const E = window.__enc, x = E.yaw.position.x, z = E.yaw.position.z, dx = bx - x, dz = bz - z, d = Math.hypot(dx, dz);
      if (d < 0.08) return 'next'; const s = Math.min(d, 0.12); E.yaw.position.x += dx / d * s; E.yaw.position.z += dz / d * s; E.yaw.rotation.y = Math.atan2(-dx, -dz); E.pitch.rotation.x = -0.1; return 'walk'; }, [ax, az, bx, bz]);
    if (r === 'next') { wi++; if (wi === 3) await pic('night-door'); continue; }
    await sleep(100);
    if (k % 60 === 30) await pic('night-walk' + k);
  }
  await pic('night-table');
  await lookAt(300.15, 0.75, -0.2); await tapMark('phone');
  await wait(() => window.__enc.getState() === 'decide', null, 120).then(() => log('decision open')).catch(() => log('  no decision'));
  await sleep(1500); await pic('night-decision');
  const OPT = process.env.OPT, OPT_I = OPT ? 'ABCD'.indexOf(OPT) : -1;
  if (OPT_I >= 0) {
    await p.waitForFunction(() => { const P = document.querySelector('#decide .panel'); return P && P.getAnimations().every(a => a.playState === 'finished'); }, null, { timeout: 120000, polling: 200 }).catch(() => {});
    const bt = await p.evaluate((i) => { const B = [...document.querySelectorAll('#choices button.choice')]; const r = B[i] && B[i].getBoundingClientRect();
      return { n: B.length, txt: B[i] ? B[i].textContent.trim().slice(0, 60) : null, at: r ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : null }; }, OPT_I);
    if (bt.at) await press(bt.at.x, bt.at.y); log('decision: pressed', OPT, JSON.stringify(bt.txt), 'of', bt.n);
    await wait(() => ['result', 'complete'].includes(window.__enc.getState()), null, 400).then(() => log('the card')).catch(() => log('  NO CARD'));
    await sleep(2500); await pic('card' + OPT);
  }
}
log('errors', errs.length ? errs.join('\n') : 'none');
await b.close(); process.exit(errs.length ? 1 : 0);
