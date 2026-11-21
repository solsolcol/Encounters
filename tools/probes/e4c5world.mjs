/* v28.0 (E4C5, M6): THE WORLD PHOTOGRAPHED. Episode 4 chapter 5 booted on a phone (390 x 844 CSS points drawn at DSF pixels
   a point, a touch context; or a desktop with VIEW=desk, 1280 x 720), play reached, the stage's ready() waited for, then
   each named view: the phase set as a Continue lands it (stage.setPhase), the lens put where the player stands (x, z, the
   turn, the pitch) and the picture taken after the frames have drawn. Also reported: every page error, the models that
   have not landed (stage.info().waiting, when exposed), and the triangles and draw calls the lens holds at each view
   (counted from the scene's visible meshes inside the lens: an InstancedMesh counts every copy).
     ENC_DIST=<snapshot> CHROMIUM_PATH=... [OUT=dir] [VIEWS=a,b] [VIEW=desk] [DSF=2] node tools/probes/e4c5world.mjs */
import { chromium } from 'playwright';
import fs from 'node:fs';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const OUT = process.env.OUT || '/tmp/e4c5world';
fs.mkdirSync(OUT, { recursive: true });
const DESK = process.env.VIEW === 'desk';
const W = DESK ? 1280 : 390, H = DESK ? 720 : 844, DSF = +(process.env.DSF || (DESK ? 1 : 2));
/* name: [phase, x, z, turn (0 looks -z), pitch (+ up)] */
const ALL = {
  spawn:      ['walk', 0, 0.25, 0, -0.04],
  walk1:      ['walk', 0.1, -4.5, 0, -0.06],
  drain:      ['walk', -0.3, -7.2, -0.35, -0.42],
  lookout:    ['walk', 0.0, -9.5, -Math.PI / 2 - 0.3, -0.12],
  turn:       ['walk', 0.0, -13.6, Math.PI / 4, -0.05],
  run2:       ['walk', -3.0, -14.95, Math.PI / 2, -0.04],
  gate:       ['walk', -8.5, -15.2, Math.PI, -0.12],
  liftback:   ['walk', 0.0, -3.0, Math.PI, -0.02],
  courtin:    ['hunt', -8.5, -13.4, Math.PI, -0.1],
  courtmid:   ['hunt', -8.0, -9.8, Math.PI, -0.08],
  courtback:  ['hunt', -8.5, -6.4, 0, -0.06],
  planter:    ['hunt', -7.4, -10.4, Math.PI * 0.8, -0.45],
  living:     ['hunt', -8.3, -4.55, Math.PI * 0.62, -0.1],
  livingN:    ['hunt', -6.0, -5.0, Math.PI * 0.9, -0.1],
  livingW:    ['hunt', -5.6, -3.0, Math.PI / 2, -0.1],
  dining:     ['hunt', -8.9, -2.3, Math.PI * 0.8, -0.18],
  shoecab:    ['hunt', -9.4, -4.2, -0.2, -0.5],
  armchair:   ['hunt', -7.3, -3.4, Math.PI, -0.3],
  doorout:    ['hunt', -8.5, -4.4, 0, -0.06],
  fight:      ['fight', -8.5, -10.6, Math.PI, -0.08],
  courtup:    ['hunt', -8.5, -11.5, Math.PI, 0.45],
  doorfight:  ['fight', -8.45, -8.2, Math.PI, -0.05],
  gateup:     ['hunt', -8.5, -7.0, 0, 0.42],
  sideW:      ['hunt', -7.0, -10.0, Math.PI / 2 + 0.25, 0.2],
  windowout:  ['hunt', -8.2, -7.6, Math.PI, -0.02],
  windowin:   ['hunt', -10.3, -4.2, 0, -0.05],
  fightcam:   ['fight', -8.5, -14.0, Math.PI, -0.454, 3.1 - 1.62],
  boomH:      ['hunt', -8.5, -14.0, Math.PI, -0.454, 3.1 - 1.62],     // (the fight's boom with no brief over it)
  doorthru:   ['hunt', -8.5, -6.2, Math.PI, -0.05],                    // (in at the open doorway from the step)
  room:       ['table', 0, 239.4, Math.PI, -0.3],
  roomwide:   ['table', -1.6, 237.9, Math.PI + 0.64, -0.2],
  roomseat:   ['table', 0, 239.2, Math.PI, -0.62, -0.47],
  seated:     ['table', 0, 239.2, Math.PI, -0.5, 1.02 - 1.62],      // (the play's own seat: c_story.js SIT5)
  doorin:     ['hunt', -8.3, -4.45, Math.PI + 0.55, -0.15],          // (the open leaf against its jamb, from inside)
  roomdoor:   ['table', 1.5, 242.0, 0.85, -0.25],
  roomwin:    ['table', -0.8, 240.6, -Math.PI / 2, -0.04]
};
const pick = process.env.VIEWS ? process.env.VIEWS.split(',') : Object.keys(ALL);
const b = await chromium.launch(LAUNCH);
const ctx = await b.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: DSF, hasTouch: !DESK, isMobile: !DESK });
const p = await ctx.newPage(); const errs = [];
p.on('pageerror', e => errs.push('PAGEERROR ' + e.message + ' | ' + String(e.stack || '').split('\n').slice(1, 3).join(' ')));
p.on('console', m => { if (m.type() === 'error' || /failed|threw|has no take/i.test(m.text())) errs.push('CONSOLE ' + m.text().slice(0, 240)); });
const T0 = Date.now(), log = (...a) => console.log(((Date.now() - T0) / 1000).toFixed(0) + 's', ...a);
await p.goto(PAGE + '?ch=e4c5', { waitUntil: 'load', timeout: 240000 });
await p.waitForFunction(() => !!window.__enc, null, { timeout: 120000 });
await p.evaluate(() => document.getElementById('startBtn').click());
await toPlay(p, 1500000);
log('play');
const ready = await p.waitForFunction(() => { try { return window.__enc.stage.ready(); } catch { return false; } }, null, { timeout: 900000, polling: 500 }).then(() => true, () => false);
log('ready', ready);
const frames = (n = 4) => p.evaluate((n) => new Promise(r => { let k = 0; const f = () => (++k >= n ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); }), n);
/* the HUD's panels that would lie over the picture of a place are left as the player sees them */
for (const name of pick) {
  const v = ALL[name]; if (!v) { log('no view', name); continue; }
  const [phase, x, z, ry, pt, up] = v;
  await p.evaluate(([phase]) => { const S = window.__enc.stage; if (S.phase !== phase) S.setPhase(phase); }, [phase]);
  await frames(3);
  await p.evaluate(([x, z, ry, pt, up]) => { const E = window.__enc; E.yaw.position.set(x, 1.62 + (up || 0), z); E.yaw.rotation.y = ry; E.pitch.rotation.x = pt; }, [x, z, ry, pt, up || 0]);
  await frames(6);
  await p.evaluate(([x, z, ry, pt, up]) => { const E = window.__enc; E.yaw.position.set(x, 1.62 + (up || 0), z); E.yaw.rotation.y = ry; E.pitch.rotation.x = pt; }, [x, z, ry, pt, up || 0]);
  await frames(4);
  const n = await p.evaluate(() => { const E = window.__enc, cam = E.camera; cam.updateMatrixWorld();
    const m = cam.projectionMatrix.clone().multiply(cam.matrixWorldInverse), e = m.elements, P = [];
    const pl = (a, b2, c, d) => { const l = Math.hypot(a, b2, c); P.push([a / l, b2 / l, c / l, d / l]); };
    pl(e[3] - e[0], e[7] - e[4], e[11] - e[8], e[15] - e[12]); pl(e[3] + e[0], e[7] + e[4], e[11] + e[8], e[15] + e[12]);
    pl(e[3] + e[1], e[7] + e[5], e[11] + e[9], e[15] + e[13]); pl(e[3] - e[1], e[7] - e[5], e[11] - e[9], e[15] - e[13]);
    pl(e[3] - e[2], e[7] - e[6], e[11] - e[10], e[15] - e[14]); pl(e[3] + e[2], e[7] + e[6], e[11] + e[10], e[15] + e[14]);
    let tris = 0, draws = 0;
    E.scene.traverseVisible(o => { if (!o.isMesh || !o.geometry || !o.geometry.attributes.position) return;
      const bs = (o.isInstancedMesh && o.boundingSphere) || (o.geometry.boundingSphere || (o.geometry.computeBoundingSphere(), o.geometry.boundingSphere));
      if (bs && o.frustumCulled !== false) { const c = bs.center.clone().applyMatrix4(o.matrixWorld), r = bs.radius * o.matrixWorld.getMaxScaleOnAxis();
        for (const q of P) if (q[0] * c.x + q[1] * c.y + q[2] * c.z + q[3] < -r) return; }
      const g = o.geometry, t = (g.index ? g.index.count : g.attributes.position.count) / 3; tris += t * (o.isInstancedMesh ? o.count : 1); draws++; });
    return { tris: Math.round(tris), draws }; }).catch(e => ({ err: String(e) }));
  try { await p.screenshot({ path: `${OUT}/${name}.png`, timeout: 240000 }); } catch { log('  (no picture)'); }
  log(name, phase, JSON.stringify(n));
}
console.log('errors', errs.length ? errs.join('\n') : 'none');
await b.close(); process.exit(errs.length ? 1 : 0);
