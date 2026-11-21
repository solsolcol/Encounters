/* The hunt with his sight shut: is the vision's pass drawn, and what do the nine Prai cost the GL? (lead's probe, 21 Nov)
   ENC_DIST=<snapshot> CHROMIUM_PATH=... sh tools/bslot.sh node tools/probes/e4c5visshut.mjs */
import { chromium } from 'playwright';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const b = await chromium.launch(LAUNCH);
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
const p = await ctx.newPage(); const errs = [];
p.on('pageerror', e => errs.push(e.message));
const T0 = Date.now(), say = (...a) => console.log(((Date.now() - T0) / 1000).toFixed(0) + 's', ...a);
await p.goto(PAGE + '?ch=e4c5', { waitUntil: 'load', timeout: 300000 });
await p.waitForFunction(() => !!window.__enc, null, { timeout: 180000 });
await p.evaluate(() => document.getElementById('startBtn').click());
await toPlay(p, 1500000);
await p.waitForFunction(() => { try { return window.__enc.stage.ready() && window.__enc.stage.info().applied; } catch { return false; } }, null, { timeout: 900000, polling: 500 });
say('ready');
await p.evaluate(() => window.__enc.stage.setPhase('hunt'));
await new Promise(r => setTimeout(r, 8000));
/* the game's own context, counted on the instance */
await p.evaluate(() => {
  const C = window.__glc = { on: false, calls: 0, tris: 0, fb: 0 };
  const cv = [...document.querySelectorAll('canvas')].sort((a, b) => b.width * b.height - a.width * a.height)[0];
  const gl = cv.getContext('webgl2') || cv.getContext('webgl');
  const tri = (m, n) => m === 4 ? n / 3 : (m === 5 || m === 6) ? Math.max(0, n - 2) : 0;
  for (const [nm, ci, ii] of [['drawElements', 1, -1], ['drawArrays', 2, -1], ['drawElementsInstanced', 1, 4], ['drawArraysInstanced', 2, 3]]) {
    const f = gl[nm]; if (!f) continue;
    gl[nm] = function (...a) { if (C.on) { C.calls++; C.tris += tri(a[0], a[ci]) * (ii >= 0 ? (a[ii] || 1) : 1); } return f.apply(gl, a); };
  }
  const bf = gl.bindFramebuffer; gl.bindFramebuffer = function (t, fb) { if (C.on && fb) C.fb++; return bf.call(gl, t, fb); };
});
const frame = () => p.evaluate(async () => { const C = window.__glc; await new Promise(r => requestAnimationFrame(r));
  C.calls = 0; C.tris = 0; C.fb = 0; C.on = true; await new Promise(r => requestAnimationFrame(r)); await new Promise(r => requestAnimationFrame(r)); C.on = false;
  return { calls: C.calls, tris: Math.round(C.tris), fbBinds: C.fb }; });
const state = () => p.evaluate(() => { const E = window.__enc, v = E.vision(), k = E.kit.vision ? E.kit.vision() : null;
  return { on: v.on, r: v.r, k: v.k, dir: v.dir, drawn: v.drawn, kit: k }; });
const y0 = await p.evaluate(() => window.__enc.yaw.rotation.y);
const out = [];
for (const q of [2, 1]) {
  await p.evaluate(([y0, q]) => { window.__enc.yaw.rotation.y = y0 + q * Math.PI / 2; }, [y0, q]);
  const s0 = await state(); const A = await frame(); const s1 = await state();
  const hid = await p.evaluate(() => { const L = (window.__enc.stage.films && window.__enc.stage.films.PRAI5 && window.__enc.stage.films.PRAI5.list) || []; const was = L.map(P => P.group.visible); L.forEach(P => { P.group.visible = false; }); window.__was = was; return L.length; });
  const B = await frame();
  await p.evaluate(() => { const L = window.__enc.stage.films.PRAI5.list; L.forEach((P, i) => { P.group.visible = window.__was[i]; }); });
  /* (frame() spans two drawn frames: halve its counts for one) and what the scene holds drawn many times over: every
     visible InstancedMesh, its triangles an instance and its count, and every visible mesh of the hands' pass is not in
     the scene, so the rest of the frame's GL count is what the scene cut never sees */
  const inst = await p.evaluate(() => { const E = window.__enc, scene = E.scene, L = [];
    const nameOf = (o) => { const n = []; for (let q = o; q && q !== scene && n.length < 4; q = q.parent) if (q.name) n.push(q.name); return n.join(' < ') || o.type; };
    scene.traverse(o => { if (!o.isInstancedMesh) return; for (let q = o; q; q = q.parent) if (!q.visible) return;
      const g = o.geometry, t = g.index ? g.index.count / 3 : g.attributes.position.count / 3; L.push({ name: nameOf(o), per: Math.round(t), count: o.count, total: Math.round(t * o.count), layer: o.layers.mask }); });
    L.sort((x, y) => y.total - x.total); return L.slice(0, 20); });
  out.push({ turned: q * 90, sight: s0, drawnDuring: s1.drawn - s0.drawn, oneFrame: Math.round(A.tris / 2), withPrai: A, praiHidden: B, praiCost: A.tris - B.tris, praiCount: hid, instanced: inst });
}
console.log(JSON.stringify({ out, errs: errs.slice(0, 5) }, null, 1));
await b.close();
