/* v28.0 (E4C5, M8): THE CLEANSING'S FRAME AGAINST ITS BUDGET (the plan's 13: under 0.9 million triangles a frame, under
   110 draws, under 720 moving bones, under 0.8 GB of pictures), counted from the fight's own camera with everything in
   (the two, the nine standing as the brief shows them, the three at the door, the room through the door). On a phone page
   (390 x 844 at 2, a touch context). WHAT IS DRAWN is counted at the GL itself (every draw call of a frame and its
   triangles, instanced ones times their count: whatever three draws, both passes), over N frames; WHAT COSTS IT is the
   scene cut by its top groups as three culls it (the visible chain, frustumCulled, the sphere against the frustum: the
   tris.mjs way); THE BONES are the visible skinned meshes' skeletons (each counted once); THE PICTURES every texture the
   scene's materials hold (width x height x 4, a third more with mipmaps); and EACH PERSON's drawn level. Then the same
   from the camera once START is pressed and the eight have sunk, and once more with Master Zavier played.
     ENC_DIST=<snapshot> CHROMIUM_PATH=... [OUT=file.json] node tools/probes/e4c5budget.mjs */
import { chromium } from 'playwright';
import fs from 'node:fs';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const OUT = process.env.OUT || '/tmp/e4c5budget.json';
const b = await chromium.launch(LAUNCH);
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
const p = await ctx.newPage(); const errs = [];
p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
const T0 = Date.now(), say = (...a) => console.log(((Date.now() - T0) / 1000).toFixed(0) + 's', ...a);
await p.addInitScript(() => {
  /* (every draw of the page's WebGL, counted: the game's one context) */
  const wrap = (proto) => { if (!proto || proto.__counted) return; proto.__counted = true; const C = window.__gl = { calls: 0, tris: 0, on: false };
    const tri = (mode, n) => mode === 4 ? n / 3 : mode === 5 || mode === 6 ? Math.max(0, n - 2) : 0;
    for (const [nm, ci, ii] of [['drawElements', 1, -1], ['drawArrays', 2, -1], ['drawElementsInstanced', 1, 4], ['drawArraysInstanced', 2, 3]]) {
      const f = proto[nm]; if (!f) continue;
      proto[nm] = function (...a) { if (C.on) { C.calls++; C.tris += tri(a[0], a[ci]) * (ii >= 0 ? (a[ii] || 1) : 1); } return f.apply(this, a); }; } };
  wrap(window.WebGL2RenderingContext && WebGL2RenderingContext.prototype); wrap(window.WebGLRenderingContext && WebGLRenderingContext.prototype);
});
await p.goto(PAGE + '?ch=e4c5', { waitUntil: 'load', timeout: 300000 });
await p.waitForFunction(() => !!window.__enc, null, { timeout: 180000 });
await p.evaluate(() => document.getElementById('startBtn').click());
await toPlay(p, 1500000);
await p.waitForFunction(() => { try { return window.__enc.stage.ready(); } catch { return false; } }, null, { timeout: 900000, polling: 500 });
say('ready');
const count = (tag) => p.evaluate(async (tag) => {
  const E = window.__enc, C = window.__gl, scene = E.scene;
  const frames = []; for (let i = 0; i < 6; i++) { await new Promise(r => requestAnimationFrame(r)); C.calls = 0; C.tris = 0; C.on = true; await new Promise(r => requestAnimationFrame(r)); C.on = false; frames.push({ calls: C.calls, tris: Math.round(C.tris) }); }
  let camera = null; scene.traverse(o => { if (o.isPerspectiveCamera && !camera) camera = o; }); if (!camera) E.yaw.traverse(o => { if (o.isPerspectiveCamera && !camera) camera = o; });
  scene.updateMatrixWorld(true); camera.updateMatrixWorld(true);
  const M = new camera.projectionMatrix.constructor().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse), me = M.elements, planes = [];
  const pl = (a, b2, c, d) => { const l = Math.hypot(a, b2, c); planes.push([a / l, b2 / l, c / l, d / l]); };
  pl(me[3] - me[0], me[7] - me[4], me[11] - me[8], me[15] - me[12]); pl(me[3] + me[0], me[7] + me[4], me[11] + me[8], me[15] + me[12]);
  pl(me[3] + me[1], me[7] + me[5], me[11] + me[9], me[15] + me[13]); pl(me[3] - me[1], me[7] - me[5], me[11] - me[9], me[15] - me[13]);
  pl(me[3] - me[2], me[7] - me[6], me[11] - me[10], me[15] - me[14]); pl(me[3] + me[2], me[7] + me[6], me[11] + me[10], me[15] + me[14]);
  const V3 = camera.position.constructor, c0 = new V3();
  const inF = (o) => { const g = o.geometry; if (!g) return false; if (o.frustumCulled === false) return true; if (!g.boundingSphere) g.computeBoundingSphere(); const s = g.boundingSphere; if (!s) return true;
    c0.copy(s.center).applyMatrix4(o.matrixWorld); const sc = o.matrixWorld.getMaxScaleOnAxis(), r = s.radius * sc; return planes.every(([a, b2, cc, d]) => a * c0.x + b2 * c0.y + cc * c0.z + d >= -r); };
  const groups = {}, skel = new Set(); let bones = 0, triCut = 0, meshes = 0;
  const top = (o) => { let q = o; while (q.parent && q.parent !== scene && q.parent.parent !== scene) q = q.parent; return q; };
  const nameOf = (o) => { for (let q = o; q && q !== scene; q = q.parent) if (q.name) return q.name; return o.type; };
  const walk = (o) => { if (!o.visible) return;
    if ((o.isMesh || o.isSprite || o.isPoints) && o.geometry && inF(o)) { const g = o.geometry, n = g.index ? g.index.count / 3 : (g.attributes.position ? g.attributes.position.count / 3 : 0), k = o.isInstancedMesh ? o.count : 1, t = Math.round(n * k);
      meshes++; triCut += t; const key = nameOf(top(o)) + (o.isSkinnedMesh ? ' (skinned)' : ''); const G = groups[key] || (groups[key] = { tris: 0, draws: 0 }); G.tris += t; G.draws++;
      if (o.isSkinnedMesh && o.skeleton && !skel.has(o.skeleton)) { skel.add(o.skeleton); bones += o.skeleton.bones.length; } }
    for (const c of o.children) walk(c); };
  walk(scene);
  const big = Object.entries(groups).sort((a, b2) => b2[1].tris - a[1].tris).slice(0, 14).map(([k, v]) => [k, v.tris, v.draws]);
  /* every texture the scene's materials hold */
  const tex = new Map(); let bytes = 0;
  scene.traverse(o => { const ms = o.material ? (Array.isArray(o.material) ? o.material : [o.material]) : []; for (const m of ms) for (const k in m) { const t = m[k]; if (t && t.isTexture && !tex.has(t)) { tex.set(t, 1);
    const im = t.image; const w = im && (im.width || im.videoWidth) || 0, h = im && (im.height || im.videoHeight) || 0; bytes += w * h * 4 * (t.generateMipmaps !== false && t.minFilter !== 1006 && t.minFilter !== 1003 ? 4 / 3 : 1); } }
    if (o.material && o.material.uniforms) for (const u of Object.values(o.material.uniforms)) { const t = u && u.value; if (t && t.isTexture && !tex.has(t)) { tex.set(t, 1); const im = t.image; bytes += (im && im.width || 0) * (im && im.height || 0) * 4; } } });
  /* each person's level */
  const S = E.stage, fl = S.plan && S.plan.FLOOR, L = [];
  const people = []; if (fl && fl.cast) for (const k in fl.cast) people.push([k, fl.cast[k]]);
  const PR = S.films && S.films.PRAI5 ? S.films.PRAI5.list : []; PR.forEach((P, i) => people.push(['prai' + (i + 1), P]));
  for (const [k, P] of people) { if (!P || !P.group) continue; const lv = P.lv || []; let tri = 0; const sh = P.lvShown;
    if (P.group.visible) P.group.traverse(o => { if (o.isSkinnedMesh && o.visible) { let ok = true; for (let q = o; q; q = q.parent) if (!q.visible) { ok = false; break; } if (ok && o.geometry && o.geometry.index) tri += o.geometry.index.count / 3; } });
    L.push({ who: k, shown: P.group.visible, level: sh, force: P.force == null ? null : P.force, levels: lv.map(x => !!x), tris: Math.round(tri), take: P.cur }); }
  const ts = E.kit.tagState();
  return { tag, frames, drawsMax: Math.max(...frames.map(f => f.calls)), trisMax: Math.max(...frames.map(f => f.tris)), cut: { meshes, tris: triCut, big }, bones, skeletons: skel.size,
           textures: tex.size, pictureMB: Math.round(bytes / 1048576), people: L, lens: [+camera.getWorldPosition(new V3()).x.toFixed(2), +camera.getWorldPosition(new V3()).y.toFixed(2), +camera.getWorldPosition(new V3()).z.toFixed(2)], played: ts.played, mode: ts.on };
}, tag);
const res = [];
await p.evaluate(() => window.__enc.stage.setPhase('fight'));
await p.waitForFunction(() => window.__enc.kit.eventActive() && window.__enc.kit.tagState().on, null, { timeout: 300000, polling: 500 });
await new Promise(r => setTimeout(r, 3000));
res.push(await count('the brief: the nine standing, the boom behind Grandmaster Pho'));
await new Promise(r => setTimeout(r, 1500)); { const r = await p.evaluate(() => { const e = document.getElementById('evBtn').getBoundingClientRect(); return { x: e.x + e.width / 2, y: e.y + e.height / 2 }; }); await p.touchscreen.tap(r.x, r.y); }   // (START by a tap: the brief's button answers a press, not a DOM click)
await p.waitForFunction(() => window.__enc.kit.tagState().live, null, { timeout: 300000, polling: 500 }).catch(() => say('(not live)'));
await new Promise(r => setTimeout(r, 4000));
res.push(await count('START pressed: the lesson\'s one, the eight sunk'));
await p.evaluate(() => { const k = window.__enc.kit; if (k.tagSwitch) k.tagSwitch('zavier', { force: true }); });
await new Promise(r => setTimeout(r, 4000));
res.push(await count('Master Zavier played'));
for (const r of res) { say('==', r.tag); say('  drawn a frame: draws max', r.drawsMax, 'triangles max', r.trisMax, '| frames', JSON.stringify(r.frames));
  say('  bones', r.bones, 'in', r.skeletons, 'skeletons | pictures', r.pictureMB, 'MB in', r.textures, 'textures | lens', JSON.stringify(r.lens), 'played', r.played);
  say('  the frustum cut:', r.cut.meshes, 'meshes,', r.cut.tris, 'triangles; the largest:'); for (const g of r.cut.big) say('    ', String(g[1]).padStart(8), String(g[2]).padStart(4), g[0]);
  say('  people:'); for (const q of r.people) if (q.shown) say('    ', q.who.padEnd(10), 'level', q.level, 'force', q.force, 'tris', q.tris, 'take', q.take); }
fs.writeFileSync(OUT, JSON.stringify({ res, errs }, null, 1));
for (const e of errs.slice(0, 8)) say(e);
await b.close();
