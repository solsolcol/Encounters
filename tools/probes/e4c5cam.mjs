/* v28.0 (E4C5, M8): THE FIGHT'S CAMERA, MEASURED AS IT MOVES (CLAUDE.md: a camera move is measured as a move, never from a
   still at each end). The fight's phase set on a phone (390 x 844 CSS at DSF, a touch context) and START tapped; then, by
   real input (the stick held by a touch, the switch tapped), Grandmaster Pho walked to the gate end (where the lens must
   stop at the slab's line), to each side wall, back to the house end; then the switch tapped (the lens glides to Master
   Zavier) and back. Every drawn frame the lens's place in the world, the turn, the pitch and the angle of view are read,
   with the played one's feet; written to OUT/cam.json with what fails: a lens past the gate's line (z under -13.9), out of
   the side walls (x outside -10.8..-6.2), inside a blocker, or a step between two drawn frames more than the walk and the
   glide can make (a jump). Pictures at each end, full size.
     ENC_DIST=<snapshot> CHROMIUM_PATH=... [OUT=dir] [DSF=2] node tools/probes/e4c5cam.mjs */
import { chromium } from 'playwright';
import fs from 'node:fs';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const OUT = process.env.OUT || '/tmp/e4c5cam';
fs.mkdirSync(OUT, { recursive: true });
const DSF = +(process.env.DSF || 2), W = 390, H = 844;
const b = await chromium.launch(LAUNCH);
const ctx = await b.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: DSF, hasTouch: true, isMobile: true });
const p = await ctx.newPage(); const errs = [];
p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
const T0 = Date.now(), say = (...a) => console.log(((Date.now() - T0) / 1000).toFixed(0) + 's', ...a);
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
await p.goto(PAGE + '?ch=e4c5', { waitUntil: 'load', timeout: 300000 });
await p.waitForFunction(() => !!window.__enc, null, { timeout: 180000 });
await p.evaluate(() => document.getElementById('startBtn').click());
await toPlay(p, 1500000);
await p.waitForFunction(() => { try { return window.__enc.stage.ready() && window.__enc.stage.info().applied; } catch { return false; } }, null, { timeout: 900000, polling: 500 });
await p.evaluate(() => window.__enc.stage.setPhase('fight'));
await p.waitForFunction(() => window.__enc.kit.eventActive() && window.__enc.kit.tagState().on, null, { timeout: 120000, polling: 250 });
await sleep(1200);
/* START, by a tap on it (and again if a tap was not taken: what the button and the event said each time is written) */
await p.waitForFunction(() => { const e = document.getElementById('evBtn'), r = e && e.getBoundingClientRect(); return !!r && r.width > 0 && e.textContent.trim().length > 0; }, null, { timeout: 180000, polling: 300 });   // (the brief laid out: its first frame builds it)
for (let i = 0; ; i++) {
  const r0 = await p.evaluate(() => { const e = document.getElementById('evBtn'), r = e.getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2, w: r.width, h: r.height, txt: e.textContent, cls: e.className, ev: window.__enc.evState ? JSON.stringify(window.__enc.evState()).slice(0, 200) : '' }; });
  say('START at', JSON.stringify(r0));
  await p.touchscreen.tap(r0.x, r0.y);
  try { await p.waitForFunction(() => { const f = window.__enc.stage.snap().story.fight; return f && f.stage === 'learn' && window.__enc.kit.tagState().live; }, null, { timeout: 45000, polling: 300 }); break; }
  catch (e) { await p.screenshot({ path: `${OUT}/start-missed-${i}.png`, timeout: 300000 }); if (i >= 2) throw e; }
}
say('live');
/* the recorder: every drawn frame, in the page */
await p.evaluate(() => {
  const E = window.__enc, cam = E.pitch.children.find(o => o.isCamera);
  window.__camLog = [];
  const v = { x: 0, y: 0, z: 0 };
  const rec = () => { if (!window.__camRec) return;
    const c = cam; if (c) { c.updateWorldMatrix(true, false); const e = c.matrixWorld.elements; v.x = e[12]; v.y = e[13]; v.z = e[14]; }
    const ts = E.kit.tagState(), P = ts.bodies.find(q => q.played);
    let inBlock = false; try { inBlock = !!E.collideAt(v.x, v.z); } catch (e) { }
    window.__camLog.push({ w: performance.now(), t: ts.t, x: +v.x.toFixed(3), y: +v.y.toFixed(3), z: +v.z.toFixed(3), fov: c ? +c.fov.toFixed(2) : null,
      yaw: +E.yaw.rotation.y.toFixed(4), pitch: +E.pitch.rotation.x.toFixed(4), who: ts.played, gl: ts.gliding, fx: P ? P.x : null, fz: P ? P.z : null, inBlock });
    requestAnimationFrame(rec); };
  window.__camRec = true; requestAnimationFrame(rec);
});
async function hold(dx, dy, ms) {
  const cdp = await ctx.newCDPSession(p), ox = W * 0.18, oy = H * 0.78, L = Math.hypot(dx, dy) || 1;
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: ox, y: oy, id: 3 }] }); await sleep(80);
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: ox + dx / L * 50, y: oy + dy / L * 50, id: 3 }] });
  await sleep(ms); await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await cdp.detach();
}
const pic = async (n) => { await sleep(600); const f = `${OUT}/${n}.png`; await p.screenshot({ path: f, timeout: 300000 }); say('pic', f); };
const fightT = () => p.evaluate(() => window.__enc.kit.tagState().t);
async function walkFor(dx, dy, secs) { const t0 = await fightT(); while ((await fightT()) - t0 < secs) await hold(dx, dy, 1500); }
await pic('cam-start');
await walkFor(0, 1, 4.5); await pic('cam-gate');            // down the screen: toward the gate (the lens must stop)
await walkFor(1, 0, 3.5); await pic('cam-east');            // screen right
await walkFor(-1, 0, 6.5); await pic('cam-west');           // screen left
await walkFor(0, -1, 7.5); await pic('cam-house');          // up the screen: toward the house
const swR = await p.evaluate(() => { const r = document.getElementById('tagSw').getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
await p.touchscreen.tap(swR.x, swR.y); await sleep(2500); await pic('cam-switched');
await p.touchscreen.tap(swR.x, swR.y); await sleep(2500); await pic('cam-back');
const L = await p.evaluate(() => { window.__camRec = false; return window.__camLog; });
/* what fails */
const bad = [];
for (let i = 0; i < L.length; i++) { const q = L[i];
  if (q.z < -13.95) bad.push(['past the gate line', i, q]);
  if (q.x < -10.85 || q.x > -6.15) bad.push(['out of the side walls', i, q]);
  if (q.y < 1.15 || q.y > 4.55) bad.push(['out of its height', i, q]);
  if (q.inBlock) bad.push(['in a blocker', i, q]);
  if (i) { const a = L[i - 1], dt = Math.max(1e-3, q.t - a.t), d = Math.hypot(q.x - a.x, q.y - a.y, q.z - a.z);
    if (d > 0.05 && d / dt > 6.5) bad.push(['a jump', i, { d: +d.toFixed(3), dt: +dt.toFixed(3), a, q }]); } }
fs.writeFileSync(OUT + '/cam.json', JSON.stringify({ n: L.length, bad, log: L }, null, 0));
say('frames', L.length, 'bad', bad.length);
for (const x of bad.slice(0, 12)) say(JSON.stringify(x).slice(0, 300));
const xs = L.map(q => q.x), zs = L.map(q => q.z), ys = L.map(q => q.y);
say('lens x', Math.min(...xs).toFixed(2), Math.max(...xs).toFixed(2), 'z', Math.min(...zs).toFixed(2), Math.max(...zs).toFixed(2), 'y', Math.min(...ys).toFixed(2), Math.max(...ys).toFixed(2));
for (const e of errs.slice(0, 10)) say(e);
await b.close();
