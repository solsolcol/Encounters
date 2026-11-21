/* v28.0 (E4C5, R23): THE COURT'S TWO CUTS PROVED ON ONE FRAME. At each view the world is drawn twice in the same task,
   the cuts off (window.__e5nocut) and on, by the game's own renderer: the GL's triangles counted on the context itself
   (every instance counted) and each picture read back from the canvas, so the two pictures are of the SAME moment and
   compared pixel for pixel (written as <view>-off.png and <view>-on.png, 780 x 1688 on a phone at DSF 2). Also: a whole
   drawn frame's GL count both ways (e4c5visshut's way: two frames, halved), and what is heavy in the lens after the cuts
   (every visible mesh over 4,000 triangles inside the lens, with its place).
     ENC_DIST=<snapshot> CHROMIUM_PATH=... [OUT=dir] [VIEWS=a,b] sh tools/bslot.sh node tools/probes/e4c5estate.mjs */
import { chromium } from 'playwright';
import fs from 'node:fs';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const OUT = process.env.OUT || '/tmp/e4c5estate';
fs.mkdirSync(OUT, { recursive: true });
/* name: [phase, x, z, turn (0 looks -z), pitch, up]; 'fightbrief' and 'fightstart' keep the fight's own boom */
const ALL = {
  courtin:   ['hunt', -8.5, -13.4, Math.PI, -0.1],
  courtmid:  ['hunt', -8.0, -9.8, Math.PI, -0.08],
  courtback: ['hunt', -8.5, -6.4, 0, -0.06],
  windowout: ['hunt', -8.2, -7.6, Math.PI, -0.02],
  doorthru:  ['hunt', -8.5, -6.2, Math.PI, -0.05],
  courtup:   ['hunt', -8.5, -11.5, Math.PI, 0.45],
  gateup:    ['hunt', -8.5, -7.0, 0, 0.42],
  sideW:     ['hunt', -7.0, -10.0, Math.PI / 2 + 0.25, 0.2],
  boomH:     ['hunt', -8.5, -13.9, Math.PI, -0.454, 3.1 - 1.62],
  gate:      ['walk', -8.5, -15.2, Math.PI, -0.12],
  fightbrief: ['fight'],
  fightstart: ['fight', 'start']
};
const pick = process.env.VIEWS ? process.env.VIEWS.split(',') : Object.keys(ALL);
const b = await chromium.launch(LAUNCH);
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
const p = await ctx.newPage(); const errs = [];
p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
const T0 = Date.now(), say = (...a) => console.log(((Date.now() - T0) / 1000).toFixed(0) + 's', ...a);
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
await p.goto(PAGE + '?ch=e4c5', { waitUntil: 'load', timeout: 300000 });
await p.waitForFunction(() => !!window.__enc, null, { timeout: 180000 });
await p.evaluate(() => document.getElementById('startBtn').click());
await toPlay(p, 1500000);
await p.waitForFunction(() => { try { return window.__enc.stage.ready() && window.__enc.stage.info().applied; } catch { return false; } }, null, { timeout: 900000, polling: 500 });
say('ready');
await p.evaluate(() => {
  const C = window.__glc = { on: false, calls: 0, tris: 0 };
  const gl = window.__enc.renderer.getContext();
  const tri = (m, n) => m === 4 ? n / 3 : (m === 5 || m === 6) ? Math.max(0, n - 2) : 0;
  for (const [nm, ci, ii] of [['drawElements', 1, -1], ['drawArrays', 2, -1], ['drawElementsInstanced', 1, 4], ['drawArraysInstanced', 2, 3]]) {
    const f = gl[nm]; if (!f) continue;
    gl[nm] = function (...a) { if (C.on) { C.calls++; C.tris += tri(a[0], a[ci]) * (ii >= 0 ? (a[ii] || 1) : 1); } return f.apply(gl, a); };
  }
});
const frames = (n) => p.evaluate((n) => new Promise(r => { let k = 0; const f = () => (++k >= n ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); }), n);
const frameGL = (off) => p.evaluate(async (off) => { const C = window.__glc; window.__e5nocut = off; await new Promise(r => requestAnimationFrame(r));
  C.calls = 0; C.tris = 0; C.on = true; await new Promise(r => requestAnimationFrame(r)); await new Promise(r => requestAnimationFrame(r)); C.on = false;
  window.__e5nocut = false; return { tris: Math.round(C.tris / 2), calls: Math.round(C.calls / 2) }; }, off);
const res = {};
for (const name of pick) {
  const v = ALL[name]; if (!v) continue;
  const [phase, x, z, ry, pt, up] = v;
  await p.evaluate(([phase]) => { const S = window.__enc.stage; if (S.phase !== phase) S.setPhase(phase); }, [phase]);
  if (phase === 'fight') {
    await p.waitForFunction(() => window.__enc.kit.eventActive() && window.__enc.kit.tagState().on, null, { timeout: 180000, polling: 250 });
    if (x === 'start') {
      await p.waitForFunction(() => { const e = document.getElementById('evBtn'), r = e && e.getBoundingClientRect(); return !!r && r.width > 0 && e.textContent.trim().length > 0; }, null, { timeout: 180000, polling: 300 });
      for (let i = 0; i < 3; i++) {
        const r = await p.evaluate(() => { const r = document.getElementById('evBtn').getBoundingClientRect(); return { x: r.x + r.width / 2, y: r.y + r.height / 2 }; });
        await p.touchscreen.tap(r.x, r.y);
        try { await p.waitForFunction(() => { const f = window.__enc.stage.snap().story.fight; return f && f.stage === 'learn'; }, null, { timeout: 45000, polling: 300 }); break; } catch {}
      }
      await sleep(1500);
    }
    await frames(4);
  } else {
    await frames(3);
    for (let k = 0; k < 2; k++) { await p.evaluate(([x, z, ry, pt, up]) => { const E = window.__enc; E.yaw.position.set(x, 1.62 + (up || 0), z); E.yaw.rotation.y = ry; E.pitch.rotation.x = pt; }, [x, z, ry, pt, up || 0]); await frames(5); }
  }
  const A = await frameGL(true), B = await frameGL(false);
  const two = await p.evaluate(() => { const E = window.__enc, R = E.renderer, C = window.__glc, out = {};
    E.camera.updateMatrixWorld();
    for (const off of [true, false]) { window.__e5nocut = off; C.calls = 0; C.tris = 0; C.on = true; R.render(E.scene, E.camera); C.on = false;
      out[off ? 'off' : 'on'] = { tris: Math.round(C.tris), calls: C.calls, png: R.domElement.toDataURL('image/png') }; }
    window.__e5nocut = false;
    const e = new E.camera.position.constructor(); e.setFromMatrixPosition(E.camera.matrixWorld);
    out.eye = [+e.x.toFixed(2), +e.y.toFixed(2), +e.z.toFixed(2)];
    /* what is heavy in the lens now (the cuts on: the last render left them so) */
    const pv = E.camera.projectionMatrix.clone().multiply(E.camera.matrixWorldInverse), el = pv.elements, P = [];
    const pl = (a, b, c, d) => { const l = Math.hypot(a, b, c); P.push([a / l, b / l, c / l, d / l]); };
    pl(el[3] - el[0], el[7] - el[4], el[11] - el[8], el[15] - el[12]); pl(el[3] + el[0], el[7] + el[4], el[11] + el[8], el[15] + el[12]);
    pl(el[3] + el[1], el[7] + el[5], el[11] + el[9], el[15] + el[13]); pl(el[3] - el[1], el[7] - el[5], el[11] - el[9], el[15] - el[13]);
    pl(el[3] - el[2], el[7] - el[6], el[11] - el[10], el[15] - el[14]); pl(el[3] + el[2], el[7] + el[6], el[11] + el[10], el[15] + el[14]);
    const heavy = [];
    const nameOf = (o) => { const n = []; for (let q = o; q && q !== E.scene && n.length < 4; q = q.parent) if (q.name) n.push(q.name); return n.join(' < ') || o.type; };
    E.scene.traverseVisible(o => { if (!o.isMesh || !o.geometry || !o.geometry.attributes.position) return;
      const g = o.geometry, t = (g.index ? g.index.count : g.attributes.position.count) / 3 * (o.isInstancedMesh ? o.count : 1);
      if (t < 4000) return;
      const bs = (o.isInstancedMesh && o.boundingSphere) || (g.boundingSphere || (g.computeBoundingSphere(), g.boundingSphere));
      const c = bs.center.clone().applyMatrix4(o.matrixWorld), r = bs.radius * o.matrixWorld.getMaxScaleOnAxis();
      if (o.frustumCulled !== false) for (const q of P) if (q[0] * c.x + q[1] * c.y + q[2] * c.z + q[3] < -r) return;
      heavy.push({ name: nameOf(o), tris: Math.round(t), inst: o.isInstancedMesh ? o.count : undefined, at: [+c.x.toFixed(1), +c.y.toFixed(1), +c.z.toFixed(1)], r: +r.toFixed(1), skinned: !!o.isSkinnedMesh });
    });
    heavy.sort((a, b) => b.tris - a.tris); out.heavy = heavy.slice(0, 30);
    return out; });
  for (const k of ['off', 'on']) fs.writeFileSync(`${OUT}/${name}-${k}.png`, Buffer.from(two[k].png.split(',')[1], 'base64'));
  res[name] = { eye: two.eye, frame: { off: A, on: B }, render: { off: { tris: two.off.tris, calls: two.off.calls }, on: { tris: two.on.tris, calls: two.on.calls } }, heavy: two.heavy };
  say(name, JSON.stringify({ eye: two.eye, frame: res[name].frame, render: res[name].render }));
}
fs.writeFileSync(`${OUT}/result.json`, JSON.stringify(res, null, 1));
console.log('errors', errs.length ? errs.join('\n') : 'none');
await b.close(); process.exit(errs.length ? 1 : 0);
