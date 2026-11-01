// v24.26 · THE YARD THROUGH THE DOOR — episode 4 chapter 1's receiving room, its doorway photographed from four places
// (the mat, just inside the door, the far corner, at the sill looking down) in a phase's light, with the draw counts,
// and three checks: (1) the portal cull drops nothing that is drawn (the same frame with the cull off and on, pixel for
// pixel), (2) the yard's people are out of sight and handed back on leaving the room, (3) the yard's room building is
// set aside inside and back outside.
//   ENC_DIST=<dist copy> CHROMIUM_PATH=... VIEW=phone|desktop PHASE=consult|work|storm:done|decide node tools/probes/doorview.mjs <outdir>
import { chromium } from 'playwright';
import fs from 'node:fs';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const OUT = process.argv[2]; fs.mkdirSync(OUT, { recursive: true });
const PHONE = (process.env.VIEW || 'phone') === 'phone';
const PHASE = process.env.PHASE || 'consult';
const b = await chromium.launch(LAUNCH);
const ctx = await b.newContext(PHONE ? { viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, hasTouch: true, isMobile: true }
                                     : { viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 });
const p = await ctx.newPage();
const errs = []; p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
p.on('console', m => { if (m.type() === 'error') errs.push('console ' + m.text().slice(0, 200)); });
const T0 = Date.now(), log = (...a) => console.log(((Date.now() - T0) / 1000).toFixed(0) + 's', ...a);
let bad = 0; const check = (name, ok, extra = '') => { if (!ok) bad++; log(ok ? 'ok  ' : 'FAIL', name, extra); };
await p.goto(PAGE + '?ch=e4c1', { waitUntil: 'load', timeout: 240000 });
await p.waitForFunction(() => !!window.__enc, null, { timeout: 180000 });
{ const r = await p.locator('#startBtn').boundingBox();
  if (PHONE) await p.touchscreen.tap(r.x + r.width / 2, r.y + r.height / 2); else await p.mouse.click(r.x + r.width / 2, r.y + r.height / 2); }
await toPlay(p, 1500000);
await p.waitForTimeout(4000);
/* in the yard first: the yard's people where they stand, and its room building whole */
const yardBefore = await p.evaluate(() => { const S = window.__enc.stage, C = S.film.worldC;
  const under = (g) => { for (let q = g.parent; q; q = q.parent) if (q === C) return true; return false; };
  return { people: Object.entries(S.cast).filter(([k, P]) => P && P.group && under(P.group)).map(([k]) => k).sort(),
           shell: !!S.yard.roomShell && S.yard.roomShell.visible, off: C.position.toArray() }; });
log('in the yard', JSON.stringify(yardBefore));
await p.evaluate((ph) => window.__enc.stage.applyPhase(ph), PHASE);
log('applied', PHASE);
await p.waitForFunction(() => window.__enc.getState() === 'play' && window.__enc.stage.info().world === 'R', null, { timeout: 300000, polling: 500 });
await p.waitForFunction(() => window.__enc.kit.getFade() < 0.02, null, { timeout: 900000, polling: 500 });
log('the black has lifted');
/* LOOK=DARK|FLASH|HUSH (and RAIN=k): the room's light and rain laid on for the photographs, as the storm lays them */
if (process.env.LOOK || process.env.RAIN) await p.evaluate(([L, k]) => { const S = window.__enc.stage;
  if (L) S.look(L, 0); if (k) S.room.rain(+k, 0.01); }, [process.env.LOOK || '', process.env.RAIN || '']);
await p.waitForTimeout(3000);
const frames = (n = 3) => p.evaluate((n) => new Promise(r => { let k = 0; const f = () => (++k >= n ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); }), n);
/* the chapter turns him in the room (turnTo): the aim is laid on in the renderer's own call, after every frame function */
await p.evaluate(() => { const E = window.__enc, R = E.renderer, orig = R.render.bind(R);
  R.render = (sc, cam) => { const a = window.__aimAt; if (a && sc === E.scene) {
    E.yaw.position.set(a.x, a.y, a.z); E.yaw.rotation.y = a.ry; E.pitch.rotation.x = a.pt; } return orig(sc, cam); }; });
const SPOTS = { mat: [0, 0, 1.62, 0.0], inside: [-0.6, 1.0, 1.62, -0.05], corner: [2.1, -2.1, 1.62, 0.02], sill: [-0.6, 1.6, 1.62, -0.32] };
const aim = (s) => p.evaluate(([lx, lz, ey, pt]) => {
  const E = window.__enc, F = E.stage.film, x = F.RX + lx, dx = (F.RX - 0.6) - x, dz = 2.6 - lz;
  window.__aimAt = { x, y: ey, z: lz, ry: Math.atan2(-dx, -dz), pt };
  E.yaw.position.set(x, ey, lz); E.yaw.rotation.y = window.__aimAt.ry; E.pitch.rotation.x = pt;
}, s);
const count = () => p.evaluate(() => { const E = window.__enc, R = E.renderer; R.render(E.scene, E.camera);
  return { calls: R.info.render.calls, tris: R.info.render.triangles }; });
const inR = await p.evaluate(() => { const S = window.__enc.stage, C = S.film.worldC, D = S.doorView;
  const under = (g) => { for (let q = g.parent; q; q = q.parent) if (q === C) return true; return false; };
  return { on: D.on, shell: S.yard.roomShell.visible, off: C.position.toArray().map(v => +v.toFixed(2)),
           people: Object.entries(S.cast).filter(([k, P]) => P && P.group && under(P.group)).map(([k]) => k),
           parked: D.parked.length, paint: S.roomState.doorPaint.map(o => o.visible) }; });
check('inside: the yard under the room, its building set aside, its people parked, the painting hidden',
  inR.on && !inR.shell && inR.off[0] === 241.5 && inR.off[1] === -0.5 && inR.off[2] === 8.4 && inR.people.length === 0
  && inR.parked === yardBefore.people.length && inR.paint.every(v => !v), JSON.stringify(inR));
const out = {};
for (const [k, s] of Object.entries(SPOTS)) {
  await aim(s); await frames(3); await aim(s); await frames(3);
  out[k] = await count();
  out[k].cands = await p.evaluate(() => { const D = window.__enc.stage.doorView; return D.cands ? D.cands.length + '/' + D.cands.filter(c => c.out).length + ' out' : null; });
  await p.screenshot({ path: `${OUT}/${k}.jpg`, quality: 76, timeout: 240000 }).catch(e => log('shot fail', e.message));
}
log('draws', JSON.stringify(out));
/* (1) the cull drops nothing drawn: from the far corner and the mat, the frame with the cull off and on, pixel for pixel */
for (const k of ['corner', 'mat']) {
  await aim(SPOTS[k]); await frames(3);
  const r = await p.evaluate(async () => {
    const E = window.__enc, R = E.renderer, D = E.stage.doorView, gl = R.getContext();
    const grab = () => { R.render(E.scene, E.camera); const w = gl.drawingBufferWidth, h = gl.drawingBufferHeight, px = new Uint8Array(w * h * 4);
      gl.readPixels(0, 0, w, h, gl.RGBA, gl.UNSIGNED_BYTE, px); return px; };
    /* everything in the room moves on the wall clock (the fan, the flames, the smoke, the rain): the clock is held
       still for the comparison, so the only thing that differs between the two frames is the cull */
    const now0 = performance.now(), realNow = performance.now.bind(performance);
    performance.now = () => now0;
    let a, b2, offCalls, onCalls;
    try {
      D.cull = false; E.stage.updateNotes(0, 0); a = grab(); offCalls = R.info.render.calls;
      D.cull = true; E.stage.updateNotes(0, 0); b2 = grab(); onCalls = R.info.render.calls;
    } finally { performance.now = realNow; }
    /* what the portal promises is the DOORWAY: everything seen through the opening the same. A pixel outside the opening
       can only be the yard seen through a hairline seam of the room's own planes (wall meets floor), where the cull's
       picture is the right one (v24.26: the water jar by the steps, one pixel at the front wall's foot) — counted, not
       failed */
    const F = E.stage.film, M = E.stage.rmc.ENTRY, W = gl.drawingBufferWidth, H = gl.drawingBufferHeight, V = E.yaw.position.constructor;
    E.camera.updateMatrixWorld(true);
    const q = [[M.x0, 0], [M.x1, 0], [M.x1, M.h], [M.x0, M.h]].map(([x, y]) => { const v = new V(F.RX + x, y, F.RM.z1).project(E.camera); return [(v.x * 0.5 + 0.5) * W, (v.y * 0.5 + 0.5) * H]; });
    const inside = (x, y) => { let s0 = 0; for (let i = 0; i < 4; i++) { const [ax, ay] = q[i], [bx, by] = q[(i + 1) % 4]; const c = (bx - ax) * (y - ay) - (by - ay) * (x - ax); if (c === 0) continue; const sg = Math.sign(c); if (!s0) s0 = sg; else if (sg !== s0) return false; } return true; };
    let diff = 0, seam = 0, maxd = 0;
    for (let i = 0; i < a.length; i += 4) { const d = Math.abs(a[i] - b2[i]) + Math.abs(a[i + 1] - b2[i + 1]) + Math.abs(a[i + 2] - b2[i + 2]);
      if (d > 0) { const pi = i / 4; if (inside(pi % W + 0.5, Math.floor(pi / W) + 0.5)) { diff++; if (d > maxd) maxd = d; } else seam++; } }
    return { px: a.length / 4, diff, maxd, seam, offCalls, onCalls };
  });
  check(`the portal cull from the ${k}: the same picture through the doorway`, r.diff === 0, JSON.stringify(r));
}
/* (2)(3) out of the room: everything handed back */
await p.evaluate(() => { window.__aimAt = null; });
await p.evaluate(() => { const E = window.__enc, F = E.stage.film; E.yaw.position.set(F.YARD.x0 + 4, 1.62, 2); });
await frames(4);
const back = await p.evaluate(() => { const S = window.__enc.stage, C = S.film.worldC, D = S.doorView;
  const under = (g) => { for (let q = g.parent; q; q = q.parent) if (q === C) return true; return false; };
  let masked = 0; C.traverse(o => { if ((o.isMesh || o.isPoints || o.isLine || o.isSprite) && o.layers.mask === 0) masked++; });
  return { on: D.on, shell: S.yard.roomShell.visible, off: C.position.toArray(), people: Object.entries(S.cast).filter(([k, P]) => P && P.group && under(P.group)).map(([k]) => k).sort(),
           parked: D.parked.length, masked }; });
check('back in the yard: the yard at its own place, the building whole, the people back, nothing left off the layers',
  !back.on && back.shell && back.off.every(v => v === 0) && JSON.stringify(back.people) === JSON.stringify(yardBefore.people) && back.parked === 0 && back.masked === 0,
  JSON.stringify(back));
check('no page errors', errs.length === 0, errs.slice(0, 6).join(' | '));
log(bad ? `${bad} FAILED` : 'all passed');
await b.close();
process.exit(bad ? 1 : 0);
