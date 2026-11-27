/* v29.0 (E5C1 WORLD, CP5.5): episode 5 chapter 1's PLACES PHOTOGRAPHED from the plan's camera places (its 9), each reached
   the way a probe can reach a place the play never walks: the chapter booted, a phase applied, the lens placed (its height
   held by the stage's ground while the picture is taken, then given back), a look named (the head's PRESETS), the frame
   let settle; HUD hidden; the page's errors counted; and the world's own state printed (the reflection's, the models still
   waiting). A phone is 390 x 844 CSS pixels at two device pixels a point, touch (CLAUDE.md: never a smaller picture); a
   desktop 1280 x 800.
     ENC_DIST=<snapshot> CHROMIUM_PATH=... VIEW=phone|desktop [OUT=dir] [VIEWS=a,b] [SETTLE=1500] sh tools/bslot.sh node tools/probes/e5c1world.mjs
   A view: [phase, look, x, y, z, the point looked at x, y, z, fovDeg (vertical; 0 = the play lens)]; the hands hidden as a film
   hides them (HANDS=1 keeps them). */
import { chromium } from 'playwright';
import fs from 'node:fs';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const VIEW = process.env.VIEW || 'phone', PHONE = VIEW === 'phone';
const OUT = (process.env.OUT || '/tmp/e5c1world') + '-' + VIEW;
const SETTLE = +(process.env.SETTLE || 1500);
fs.mkdirSync(OUT, { recursive: true });
const HX = 300, GY = -3.85;
const ALL = {
  /* the opening's crane (9.1): from 7 m up and 6 m out, down to the five-foot way at Marcus */
  crane0:    ['room', 'BLUE', 9.6, GY + 7.0, -6.2,  3.0, 1.6, -0.2, PHONE ? 62 : 50],
  crane1:    ['room', 'BLUE', 6.6, GY + 3.6, -4.8,  2.5, GY + 2.4, -3.3, PHONE ? 62 : 50],
  crane2:    ['room', 'BLUE', 4.2, GY + 1.6, -3.6,  1.6, GY + 1.2, -3.2, PHONE ? 62 : 50],
  fivefoot:  ['room', 'BLUE', 3.05, GY + 1.62, -1.4, 2.0, GY + 1.5, -3.6, PHONE ? 60 : 52],
  upstreet:  ['room', 'BLUE', 2.2, GY + 1.62, 2.0,  2.2, GY + 1.4, 20, 0],
  stairfoot: ['room', 'BLUE', 1.5, GY + 1.62, -3.72, -2, GY + 3.6, -3.72, PHONE ? 64 : 56],
  stairmid:  ['room', 'BLUE', -0.6, GY + 2.6 + 1.62, -3.72, -4, 1.0, -3.72, PHONE ? 64 : 56],
  landing:   ['room', 'LAMP', -3.7, 1.62, -3.6,  -3.5, 1.4, -1.9, PHONE ? 52 : 44],
  herdoor:   ['room', 'LAMP', -3.55, 1.62, -2.4, -2.7, 1.3, -2.4, PHONE ? 52 : 44],
  /* her front room (5.3, 8.1, 9.1, 9.2): from the door, from his place kneeling, his turn to the glass */
  roomdoor:  ['room', 'LAMP', -2.3, 1.62, -2.3,  2.75, 1.4, 1.0, PHONE ? 66 : 58],
  kneel:     ['room', 'LAMP', 1.45, 1.12, 1.9,   0.42, 0.8, -0.32, 0],
  glass:     ['room', 'LAMP', 1.45, 1.12, 1.9,   2.75, 1.4, 1.0, PHONE ? 50 : 44],
  glassnear: ['room', 'LAMP', 1.45, 1.12, 1.9,   2.75, 1.3, 1.05, PHONE ? 32 : 28],
  table:     ['room', 'LAMP', 1.45, 1.12, 1.9,   0.6, 0.42, 1.15, 0],
  back:      ['room', 'LAMP', 1.9, 1.62, -1.6,   -4, 1.2, 1.0, 0],
  kitchen:   ['room', 'LAMP', -2.4, 1.62, 1.2,   -4.2, 1.0, 2.4, 0],
  /* his home (5.4, 9.4, 8.3, 9.7, 9.9) */
  corridor:  ['night', 'HOME', HX - 8.6, 1.62, -3.45, HX - 3.8, 1.2, -3.0, PHONE ? 60 : 52],
  hisdoor:   ['night', 'HOME', HX - 3.8, 1.62, -1.6,  HX - 3.8, 1.2, -2.6, 0],
  living:    ['night', 'HOME', HX - 3.6, 1.62, -1.9,  HX + 1, 1.2, 2.5, 0],
  altar:     ['night', 'HOME', HX - 3.4, 1.62, 0.35,  HX - 4.28, 1.0, 0.35, PHONE ? 50 : 42],
  diningN:   ['night', 'NIGHT', HX + 0.9, 1.62, 0.9,  HX + 0.15, 0.76, -0.2, 0],
  bedroom:   ['night', 'NIGHT', HX + 6.7, 1.62, -0.48, HX + 4.4, 1.0, 1.2, 0],
  bedclock:  ['night', 'NIGHT', HX + 7.4, 0.9, 1.2,   HX + 7.79, 0.55, 2.16, PHONE ? 40 : 34],
  beddoor:   ['night', 'NIGHT', HX + 4.4, 1.62, 1.2,  HX - 3.8, 0.2, -2.3, 0],
  circle:    ['night', 'NIGHT', HX - 2.2, 0.8, 1.0,   HX - 3.8, 1.0, -2.5, PHONE ? 66 : 58],
  balcony:   ['night', 'NIGHT', HX - 0.1, 1.62, 2.1,  HX + 5, 1.0, 40, 0],
  citydown:  ['night', 'NIGHT', HX + 0.0, 1.62, 2.3,  HX + 2, -78, 18, 0],
  dawn:      ['night', 'DAWN', HX - 3.6, 1.62, -1.9,  HX + 1, 0.3, 1.5, 0],
  dawntable: ['night', 'DAWN', HX + 0.75, 1.2, 0.45,  HX + 0.75, 1.1, -0.95, PHONE ? 50 : 42]
};
/* the doors a view needs open (the films open them): street door and her door */
const OPEN = { stairfoot: [1, 1], stairmid: [1, 1], landing: [0, 1], herdoor: [0, 1], roomdoor: [0, 1], glass: [0, 1], glassnear: [0, 1] };
const pick = process.env.VIEWS ? process.env.VIEWS.split(',') : Object.keys(ALL);
const b = await chromium.launch(LAUNCH);
const ctx = await b.newContext(PHONE ? { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true }
                                     : { viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 });
const p = await ctx.newPage();
const errs = [];
p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
p.on('console', m => { if (m.type() === 'error' || /failed|threw|worldTick/i.test(m.text())) errs.push('CONSOLE ' + m.text().slice(0, 240)); });
const T0 = Date.now(), el = () => ((Date.now() - T0) / 1000).toFixed(0) + 's';
await p.goto(PAGE + '?ch=e5c1', { waitUntil: 'load', timeout: 300000 });
await p.waitForFunction(() => !!window.__enc, null, { timeout: 180000 });
await p.evaluate(() => document.getElementById('startBtn').click());
await toPlay(p, 1500000);
await p.waitForFunction(() => { try { return window.__enc.stage.ready() && window.__enc.stage.info().applied; } catch { return false; } }, null, { timeout: 900000, polling: 500 });
console.log(el(), 'ready');
/* the GL's own count of one drawn frame (every instance counted; both of the engine's passes): triangles and draws */
await p.evaluate(() => {
  const C = window.__glc = { on: false, calls: 0, tris: 0 };
  const gl = window.__enc.renderer.getContext();
  const tri = (m, n) => m === 4 ? n / 3 : (m === 5 || m === 6) ? Math.max(0, n - 2) : 0;
  for (const [nm, ci, ii] of [['drawElements', 1, -1], ['drawArrays', 2, -1], ['drawElementsInstanced', 1, 4], ['drawArraysInstanced', 2, 3]]) {
    const f = gl[nm]; if (!f) continue;
    gl[nm] = function (...a) { if (C.on) { C.calls++; C.tris += tri(a[0], a[ci]) * (ii >= 0 ? (a[ii] || 1) : 1); } return f.apply(gl, a); };
  }
});
const frameGL = () => p.evaluate(async () => { const C = window.__glc; await new Promise(r => requestAnimationFrame(r));
  C.calls = 0; C.tris = 0; C.on = true; await new Promise(r => requestAnimationFrame(r)); await new Promise(r => requestAnimationFrame(r)); C.on = false;
  return { tris: Math.round(C.tris / 2), draws: Math.round(C.calls / 2) }; });
if (process.env.HANDS !== '1') await p.evaluate(() => { if (window.__enc.handsRoot) window.__enc.handsRoot.visible = false; });
await p.addStyleTag({ content: '#hud, #objective, #reticle, .hudel, #hotBadge, #caption, #captions, #vignette { opacity: 0 !important; }' });
const frames = (n) => p.evaluate((n) => new Promise(r => { let k = 0; const f = () => (++k >= n ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); }), n);
let curPhase = null;
for (const name of pick) {
  const v = ALL[name]; if (!v) { console.log('no view', name); continue; }
  const [phase, look, x, y, z, tx, ty, tz, fov] = v;
  const yawD = Math.atan2(-(tx - x), -(tz - z)) * 180 / Math.PI, pitchD = Math.atan2(ty - y, Math.hypot(tx - x, tz - z)) * 180 / Math.PI;
  if (phase !== curPhase) { await p.evaluate((ph) => window.__enc.stage.setPhase(ph), phase); curPhase = phase;
    await p.waitForFunction(() => window.__enc.getState() === 'play', null, { timeout: 600000, polling: 300 }); await frames(4); }
  await p.evaluate(([look, x, y, z, yawD, pitchD, fov, open]) => { const E = window.__enc, S = E.stage, d = Math.PI / 180;
    if (S.presets && S.presets[look]) E.kit.daylight(S.presets[look], 0);
    const W = S.plan && S.plan.ROOMTHINGS && S.plan.ROOMTHINGS.api; if (W) { W.streetDoor(open[0]); W.herDoor(open[1]); }
    if (!S.__g0) S.__g0 = S.groundAt;
    S.groundAt = () => y - 1.62;
    E.yaw.position.set(x, y, z); E.yaw.rotation.y = yawD * d; E.pitch.rotation.x = pitchD * d;
    const cam = E.pitch.children.find(o => o.isCamera); if (cam) { cam.fov = fov || 72; cam.updateProjectionMatrix(); } }, [look, x, y, z, yawD, pitchD, fov, OPEN[name] || [0, 0]]);
  await frames(3); await p.waitForTimeout(SETTLE);
  await p.evaluate(([x, y, z]) => { const E = window.__enc; E.yaw.position.set(x, y, z); }, [x, y, z]);
  await frames(3);
  const info = await p.evaluate(() => { const S = window.__enc.stage, W = S.plan && S.plan.ROOMTHINGS && S.plan.ROOMTHINGS.api;
    return { st: window.__enc.getState(), world: W ? W.state() : null }; });
  info.gl = await frameGL();
  await p.screenshot({ path: `${OUT}/${name}.png`, timeout: 240000 });
  console.log(el(), name, 'gl', JSON.stringify(info.gl), 'refl', JSON.stringify(info.world && info.world.refl && { on: info.world.refl.on, twins: info.world.refl.twins }), 'look', info.world && info.world.look);
}
await p.evaluate(() => { const S = window.__enc.stage; if (S.__g0) S.groundAt = S.__g0; });
console.log(el(), 'errs', JSON.stringify(errs.slice(0, 20)));
await b.close();
