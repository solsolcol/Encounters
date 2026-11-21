/* v28.0 (E4C5, M8): THE CLEANSING PLAYED ON A PHONE, by real input. Episode 4 chapter 5 booted on a touch page (390 x 844
   CSS points drawn at DSF pixels a point; VIEW=desk for 1280 x 720 with a mouse and keys), play reached, the fight's phase
   set as a Continue lands it (stage.setPhase('fight')), then the fight PLAYED as a player who follows the screen plays it:
   START tapped on the brief; then on every look at the screen, the button that pulses is tapped (where it stands, by a
   touch: Input.dispatchTouchEvent through Playwright's touchscreen), only once its ring has filled; when the moment asks him
   to walk to a Prai (the bag's reach), the stick is held toward it (a touch on the left of the screen dragged toward the
   target as the screen shows it: up is down the court). LOSE=1 presses nothing once the fight proper begins (the fight is
   lost; the card's BEGIN AGAIN is tapped and the fight then played to its end). Every picture is taken at full size into
   OUT; the run's log is OUT/log.json (every stage, need, line said, loss, error).
     ENC_DIST=<snapshot> CHROMIUM_PATH=... [OUT=dir] [DSF=2] [LOSE=1] [VIEW=desk] [MAXMIN=60] node tools/probes/e4c5fight.mjs */
import { chromium } from 'playwright';
import fs from 'node:fs';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const OUT = process.env.OUT || '/tmp/e4c5fight';
fs.mkdirSync(OUT, { recursive: true });
const DESK = process.env.VIEW === 'desk', LOSE = process.env.LOSE !== '0';   // (by default it loses once first, then wins: both in one run; LOSE=0 only wins)
const W = DESK ? 1280 : 390, H = DESK ? 720 : 844, DSF = +(process.env.DSF || (DESK ? 1 : 2));
const MAXMS = (+(process.env.MAXMIN || 70)) * 60000;
const b = await chromium.launch(LAUNCH);
const ctx = await b.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: DSF, hasTouch: !DESK, isMobile: !DESK });
const p = await ctx.newPage(); const errs = [], log = { stages: [], needs: [], lines: [], shots: [], errs, losses: 0, presses: 0, walks: 0 };
p.on('pageerror', e => errs.push('PAGEERROR ' + e.message + ' | ' + String(e.stack || '').split('\n').slice(1, 3).join(' ')));
p.on('console', m => { if (m.type() === 'error' || /failed|threw|has no take|cannot|undefined/i.test(m.text())) errs.push('CONSOLE ' + m.text().slice(0, 300)); });
const T0 = Date.now(), say = (...a) => console.log(((Date.now() - T0) / 1000).toFixed(0) + 's', ...a);
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
let shot = 0;
async function frames(n = 2) { await p.evaluate((n) => new Promise(r => { let k = 0; const f = () => (++k >= n ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); }), n); }
async function pic(name) {
  await frames(2);
  const f = `${OUT}/${String(++shot).padStart(3, '0')}-${name}.png`;
  await p.screenshot({ path: f, timeout: 300000 });
  const s = await snap();
  log.shots.push({ f, name, t: s && s.f ? s.f.t : null, stage: s && s.f ? s.f.stage : null, who: s && s.f ? s.f.who : null });
  say('  pic', f);
}
async function snap() {
  return p.evaluate(() => {
    const E = window.__enc, S = E.stage, f = S && S.snap ? S.snap().story.fight : null, ts = E.kit.tagState ? E.kit.tagState() : null;
    const rect = (id) => { const el = document.getElementById(id); if (!el) return null; const r = el.getBoundingClientRect(), cs = getComputedStyle(el);
      return { x: r.x + r.width / 2, y: r.y + r.height / 2, w: r.width, h: r.height, shown: r.width > 0 && cs.display !== 'none' && cs.visibility !== 'hidden' && !el.classList.contains('hide'),
               cls: el.className, txt: (el.textContent || '').trim().slice(0, 30) }; };
    return { state: E.getState(), ev: E.kit.eventActive(), film: E.kit.filmPlaying ? E.kit.filmPlaying() : null, f, ts,
             btn: { main: rect('tagA0'), second: rect('tagA1'), third: rect('tagA2'), sw: rect('tagSw'), start: rect('evBtn'), again: rect('rtAgain'), more: rect('rtMore') },
             cap: (() => { const el = document.getElementById('caption'); return el ? (el.textContent || '').trim().slice(0, 120) : ''; })(),
             obj: (() => { const el = document.querySelector('#objective .obox'); return el ? (el.textContent || '').trim().slice(0, 80) : ''; })(),
             sanity: E.stats.sanity };
  });
}
async function tap(r, why) { if (!r || !r.shown) return false; await p.touchscreen.tap(r.x, r.y); log.presses++; say('  tap', why, r.x.toFixed(0), r.y.toFixed(0)); return true; }
/* the stick held toward a direction on the screen (dx, dy: pixels; up the screen is down the court) for `ms` */
async function walk(dx, dy, ms) {
  const L = Math.hypot(dx, dy) || 1, ox = W * 0.18, oy = H * 0.78, kx = dx / L * 50, ky = dy / L * 50;
  const cdp = await ctx.newCDPSession(p);
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: ox, y: oy, id: 7 }] });
  await sleep(60);
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: ox + kx * 0.5, y: oy + ky * 0.5, id: 7 }] });
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: ox + kx, y: oy + ky, id: 7 }] });
  await sleep(ms);
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await cdp.detach(); log.walks++;
}
const toWorld = (lx, lz) => ({ x: -8.5 - lx, z: -8.7 - lz });
const ACT_BTN = { FIRE: 'main', BIND: 'main', TOGETHER: 'main', SHOCKWAVE: 'second', SMELL: 'second', BAG: 'third', LEND: 'third', SWITCH: 'sw' };

/* ---- boot */
await p.goto(PAGE + '?ch=e4c5', { waitUntil: 'load', timeout: 300000 });
await p.waitForFunction(() => !!window.__enc, null, { timeout: 180000 });
await p.evaluate(() => document.getElementById('startBtn').click());
await toPlay(p, 1500000);
say('play');
await p.waitForFunction(() => { try { return window.__enc.stage.ready(); } catch { return false; } }, null, { timeout: 900000, polling: 500 });
say('ready');
await p.evaluate(() => window.__enc.stage.setPhase('fight'));
await p.waitForFunction(() => window.__enc.kit.eventActive() && window.__enc.kit.tagState().on, null, { timeout: 120000, polling: 250 });
await sleep(1500); await pic('brief');
let s = await snap();
log.briefText = s.f;
for (let i = 0; ; i++) {                                     // (START by a tap on it; again if a tap was not taken, each written)
  s = await snap(); say('  START at', JSON.stringify(s.btn.start), 'ev', s.ev, 'state', s.state);
  await tap(s.btn.start, 'START');
  try { await p.waitForFunction(() => { const f = window.__enc.stage.snap().story.fight; return f && f.stage === 'learn'; }, null, { timeout: 45000, polling: 300 }); break; }
  catch (e) { await pic('start-missed-' + i); if (i >= 2) throw e; }
}
await sleep(800);
/* (how fast this box draws the fight: drawn frames and the mode's clock over 12 s of wall time) */
log.rate = await p.evaluate(() => new Promise(r => { const E = window.__enc, w0 = performance.now(), t0 = E.kit.tagState().t; let n = 0;
  const f = () => { n++; if (performance.now() - w0 < 12000) requestAnimationFrame(f); else r({ fps: +(n / ((performance.now() - w0) / 1000)).toFixed(2), clock: +((E.kit.tagState().t - t0) / ((performance.now() - w0) / 1000)).toFixed(3) }); };
  requestAnimationFrame(f); }));
say('RATE', JSON.stringify(log.rate));
await pic('learn-start');

/* ---- the fight, played by the screen */
const seen = new Set(), seenNeed = new Set();
let lastStage = '', lastPicT = -99, filmPics = 0, lostOnce = false, wonAt = 0, lastLine = '';
while (Date.now() - T0 < MAXMS) {
  s = await snap();
  const f = s.f; if (!f) { await sleep(400); continue; }
  if (f.stage !== lastStage) { log.stages.push({ stage: f.stage, t: f.t, wall: (Date.now() - T0) / 1000, left: f.left, sanity: s.sanity }); say('STAGE', f.stage, 'left', f.left, 'sanity', s.sanity.toFixed(1)); lastStage = f.stage;
    if (!seen.has('st:' + f.stage)) { seen.add('st:' + f.stage); if (s.state === 'play') await pic('stage-' + f.stage); } }
  for (const L of f.lines || []) if (!log.lines.includes(L)) log.lines.push(L);
  if (s.state === 'cine') {                                  // the Naga's film (it cannot be skipped the first time), or the bag tied
    if (s.film === 'bagtied' || s.film === 'collector') { await sleep(1500); await pic('after-' + s.film); break; }
    if (filmPics < 4) { await sleep(5000); await pic('film-' + (s.film || 'cine') + '-' + (++filmPics)); } else await sleep(1500);
    continue;
  }
  if (s.state === 'retry') {
    if (!seen.has('card')) { seen.add('card'); await sleep(900); await pic('lost-card'); }
    log.losses++; lostOnce = true; await sleep(900); s = await snap(); await tap(s.btn.again, 'BEGIN AGAIN'); await sleep(1500); continue;
  }
  if (s.state !== 'play') { await sleep(500); continue; }
  if (f.stage === 'won') { if (!wonAt) { wonAt = Date.now(); await pic('won'); } if (Date.now() - wonAt > 60000) break; await sleep(600); continue; }
  if (f.stage === 'lost') { await sleep(400); continue; }
  /* a picture now and then of the fight as it stands (every 15 s of its clock), and the first time each need is asked */
  const nd = f.need;
  if (nd && !seenNeed.has(f.who + ':' + nd.id)) { seenNeed.add(f.who + ':' + nd.id); log.needs.push({ t: f.t, who: f.who, need: nd, left: f.left }); if (seenNeed.size <= 40) await pic('need-' + f.who + '-' + nd.id); }
  else if (f.t - lastPicT > 15) { lastPicT = f.t; await pic('fight-' + f.stage + '-' + f.left); }
  if (LOSE && !lostOnce && f.stage === 'fight') { await sleep(600); continue; }   // (presses nothing: the fight is lost)
  if (!nd) { await sleep(300); continue; }
  /* walk to what the bag needs (or what the moment names) when it is out of reach */
  if (nd.move && nd.target) {
    const pr = f.prai.find(q => q.id === nd.target), me = s.ts.bodies.find(q => q.played);
    if (pr && me) { const w = toWorld(pr.x, pr.z); const dx = w.x - me.x, dz = w.z - me.z; await walk(-dx, -dz, 450); continue; }
  }
  const k = ACT_BTN[nd.act], r = k ? s.btn[k] : null;
  if (r && nd.ready && !/waiting|blocked/.test(r.cls)) { await tap(r, nd.act + ' (' + nd.id + ')'); await sleep(350); }
  else await sleep(250);
}
s = await snap();
log.end = { f: s.f, state: s.state, film: s.film, sanity: s.sanity, wall: (Date.now() - T0) / 1000 };
fs.writeFileSync(OUT + '/log.json', JSON.stringify(log, null, 1));
say('done', s.state, s.film, s.f && s.f.stage, 'errors', errs.length);
for (const e of errs.slice(0, 20)) say(e);
await b.close();
