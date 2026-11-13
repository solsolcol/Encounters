/* v26.2 · THINGS THAT PASS THROUGH ONE ANOTHER, MEASURED (Chad, 13 Nov 2026, of episode 4 chapter 3's debug pictures: "The
   environment has many things that clip into each other that can be seen in your screenshots, im amazed you were not
   able to pick up on that"; then five of his own phone pictures: "Look at these issues carefully"). A picture shows a
   clip only where a lens happens to look; this measures every one.

   The chapter is booted into play (a phase may be named), every model is waited for, and then, in the page, every visible
   surface is taken as an OBJECT: each placed model (its group), each copy of an instanced one (its materials joined by
   the copy's own matrix), each PERSON as posed on that frame (the skin moved by its bones), and each separate piece of
   what the chapter built in code (a merged mesh split into its pieces by the corners they share). Then:
     1. every object's triangles are sampled into a grid of VOX-metre cells; two objects in one cell are a CANDIDATE;
     2. for each candidate pair, the triangles of each near their shared cells are gathered and tested against each other
        exactly (every edge of one against the other triangle): two surfaces that really CROSS are a clip. A thing that
        only comes near another (a pole beside a rail, within a cell) is not.
   Floors, rugs and anything flat on the ground (under FLAT m tall, its top under 0.3 m) are left out (everything stands on
   them), as are glows and haze (light, not things), the sky and anything farther than R m from the middle.

     CHROMIUM_PATH=... [CH=e4c3] [PHASE=arrive] [VOX=0.1] [R=32] [OUT=file.json] node tools/probes/clipscan.mjs

   Prints the pairs whose surfaces cross, most crossings first: the two objects (a model's own node names, an instanced
   model's 'stock:<key>' and copy, a person's 'person' and skin, a built piece's colour), where they cross (the box of the
   crossing points) and each object's own box, so a thing resting on another (crossing only in a thin layer at its foot)
   reads apart from one passing through. A pair is a LEAD: photographed at its place before anything is moved. */
import { chromium } from 'playwright';
import fs from 'node:fs';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';
const CH = process.env.CH || 'e4c3', PHASE = process.env.PHASE || '', VOX = +(process.env.VOX || 0.1), R = +(process.env.R || 32);
const FLAT = +(process.env.FLAT || 0.05), OUT = process.env.OUT || '/tmp/clipscan.json', TOP = +(process.env.TOP || 150);
const b = await chromium.launch(LAUNCH);
const ctx = await b.newContext({ viewport: { width: 960, height: 540 }, deviceScaleFactor: 1 });
const p = await ctx.newPage();
const errs = [];
p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
const T0 = Date.now(), log = (...a) => console.log(((Date.now() - T0) / 1000).toFixed(0) + 's', ...a);
await p.goto(PAGE + '?ch=' + CH, { waitUntil: 'load', timeout: 240000 });
await p.waitForFunction(() => !!window.__enc, null, { timeout: 120000 });
await p.evaluate(() => document.getElementById('startBtn').click());
await toPlay(p, 1500000);
await p.waitForFunction(() => { try { return window.__enc.stage.dayClock.t > 0.5; } catch { return false; } }, null, { timeout: 600000, polling: 500 });
/* THE MEASURE ITSELF, run in the page on whatever stands there now (play, or a film sought to a moment) */
const ANALYSE = ([VOX, R, FLAT]) => {
  const E = window.__enc, scene = E.scene, V3 = scene.position.constructor;
  scene.updateMatrixWorld(true);
  const objs = [];                    // { label, at, size }
  /* (an object is the highest ancestor that is not a LAYER: the scene, or a group holding many things, such as a
     chapter's world and the groups only one day draws. A model placed once is its group; a person is theirs) */
  const layer = (q) => q === scene || (q.children && q.children.length > 25);
  /* (a model stood once is its own object even in a small group of them, such as the stack of rolled mats: stand()'s group
     carries userData.model) */
  const rootOf = (o) => { let q = o; while (q.parent && !layer(q.parent)) { if (q.userData && q.userData.model) return q; q = q.parent; } return q; };
  const visibleChain = (o) => { for (let q = o; q; q = q.parent) if (!q.visible) return false; return true; };
  const va = new V3(), vb = new V3(), vc = new V3(), m4 = scene.matrixWorld.clone(), mi = scene.matrixWorld.clone();
  const ck = (ix, iy, iz) => ((ix + 2000) * 4001 + (iz + 2000)) * 1000 + (iy + 100);
  const cellOf = (x, y, z) => ck(Math.floor(x / VOX), Math.floor(y / VOX), Math.floor(z / VOX));
  const inRange = (x, y, z) => Math.abs(x) <= R && Math.abs(z) <= R && y >= -0.5 && y <= 40;
  const labelOf = (o, root) => {
    const mat = Array.isArray(o.material) ? o.material[0] : o.material;
    const names = []; root.traverse(q => { if (q.isMesh && q.name && names.length < 2 && !names.includes(q.name)) names.push(q.name); });
    return [root.name || '', o.isSkinnedMesh ? 'person' : '', names.join(','), mat && mat.name ? 'mat:' + mat.name : '', mat && mat.color ? 'col:' + mat.color.getHexString() : ''].filter(Boolean).join(' ');
  };
  /* ---- every object's triangles, in the world, kept as flat arrays (x0 y0 z0 x1 ... z2) */
  const triOf = [];                   // object index -> Float32Array chunks
  let skipped = { flat: 0, far: 0, fx: 0 }, nPeople = 0;
  const roots = new Map();
  /* the cast by name (the stage's own handles), so a person reads as who they are */
  const castName = new Map();
  try { const C = E.stage.dbg.cast || {}; for (const k in C) { const P = C[k]; if (Array.isArray(P)) P.forEach((q, i) => q && q.group && castName.set(q.group, 'cast:' + k + i)); else if (P && P.group) castName.set(P.group, 'cast:' + k); } } catch (e) {}
  /* AN INSTANCED COPY'S PARTS ARE ONE THING: manyOf makes one InstancedMesh a part, each copy k in every part placed by the
     same placement P_k times that part's own node N. So m_j * inverse(m_0) = P_j * inverse(P_0) is the same in every part
     of one call: that list (and, for a call of one copy, where it stands) names the call */
  const sigs = new Map();
  const sigOf = (im) => { let s = sigs.get(im); if (s) return s;
    const m0 = scene.matrixWorld.clone(), mj = m0.clone(), inv = m0.clone(); im.getMatrixAt(0, m0); inv.copy(m0).invert();
    s = im.name + '|' + im.count;
    for (let j = 1; j < im.count; j++) { im.getMatrixAt(j, mj); mj.multiply(inv); s += '|' + (mj.elements[12]).toFixed(2) + ',' + (mj.elements[14]).toFixed(2); }
    if (im.count === 1) s += '@' + Math.round(m0.elements[12] / 3) + ',' + Math.round(m0.elements[14] / 3);
    sigs.set(im, s); return s; };
  const newObj = (rk, label, bb) => { let id = roots.get(rk);
    if (id === undefined) { id = objs.length; roots.set(rk, id); objs.push({ label, min: [bb.min.x, bb.min.y, bb.min.z], max: [bb.max.x, bb.max.y, bb.max.z] }); triOf.push([]); }
    else { const O = objs[id]; O.min = [Math.min(O.min[0], bb.min.x), Math.min(O.min[1], bb.min.y), Math.min(O.min[2], bb.min.z)]; O.max = [Math.max(O.max[0], bb.max.x), Math.max(O.max[1], bb.max.y), Math.max(O.max[2], bb.max.z)]; }
    return id; };
  const box3 = () => ({ min: new V3(Infinity, Infinity, Infinity), max: new V3(-Infinity, -Infinity, -Infinity),
                        add(v) { this.min.min(v); this.max.max(v); return this; } });
  scene.traverse(o => {
    /* A LINE (the strings of flags, the power lines): each segment a triangle with no width (its two ends and the far end
       again), each string its own object (its segments share their ends) */
    if ((o.isLineSegments || o.isLine) && visibleChain(o) && o.geometry && o.geometry.attributes.position) {
      const pos = o.geometry.attributes.position, W = [], segs = o.isLineSegments ? pos.count / 2 : pos.count - 1;
      for (let i = 0; i < pos.count; i++) { va.fromBufferAttribute(pos, i).applyMatrix4(o.matrixWorld); W.push(va.x, va.y, va.z); }
      const P = new Int32Array(pos.count); for (let i = 0; i < P.length; i++) P[i] = i;
      const find = (i) => { while (P[i] !== i) { P[i] = P[P[i]]; i = P[i]; } return i; };
      const at = new Map();
      for (let i = 0; i < pos.count; i++) { const key = Math.round(W[i * 3] * 1000) + ',' + Math.round(W[i * 3 + 1] * 1000) + ',' + Math.round(W[i * 3 + 2] * 1000);
        const j = at.get(key); if (j === undefined) at.set(key, i); else { const a = find(i), c = find(j); if (a !== c) P[a] = c; } }
      for (let sgi = 0; sgi < segs; sgi++) { const i0 = o.isLineSegments ? sgi * 2 : sgi, i1 = i0 + 1; const a = find(i0), c = find(i1); if (a !== c) P[a] = c; }
      const chunk = new Map();
      for (let sgi = 0; sgi < segs; sgi++) { const i0 = o.isLineSegments ? sgi * 2 : sgi, i1 = i0 + 1;
        const rk = 'L' + o.uuid + '#' + find(i0); let id = roots.get(rk);
        if (id === undefined) { const tb = box3(); tb.add(va.set(W[i0 * 3], W[i0 * 3 + 1], W[i0 * 3 + 2])); id = newObj(rk, 'line ' + (o.material && o.material.color ? 'col:' + o.material.color.getHexString() : ''), tb); }
        let a = chunk.get(id); if (!a) chunk.set(id, a = []);
        a.push(W[i0 * 3], W[i0 * 3 + 1], W[i0 * 3 + 2], W[i1 * 3], W[i1 * 3 + 1], W[i1 * 3 + 2], W[i1 * 3], W[i1 * 3 + 1], W[i1 * 3 + 2]); }
      for (const [id, a] of chunk) { const F = new Float32Array(a); triOf[id].push(F);
        const O = objs[id]; for (let i = 0; i < F.length; i += 3) { O.min[0] = Math.min(O.min[0], F[i]); O.min[1] = Math.min(O.min[1], F[i + 1]); O.min[2] = Math.min(O.min[2], F[i + 2]);
          O.max[0] = Math.max(O.max[0], F[i]); O.max[1] = Math.max(O.max[1], F[i + 1]); O.max[2] = Math.max(O.max[2], F[i + 2]); } }
      return;
    }
    if (!o.isMesh || !visibleChain(o)) return;
    const mat = Array.isArray(o.material) ? o.material[0] : o.material;
    if (mat && (mat.blending === 2 || (mat.transparent && mat.depthWrite === false))) { skipped.fx++; return; }   // glows, rays, haze
    const g = o.geometry; if (!g || !g.attributes.position) return;
    const pos = g.attributes.position, idx = g.index ? g.index.array : null, nT = idx ? idx.length / 3 : pos.count / 3;
    const inst = o.isInstancedMesh ? o.count : 1, root = rootOf(o);
    if (o.isSkinnedMesh && o.skeleton) o.skeleton.update();
    /* the vertices once, in the world */
    for (let k = 0; k < inst; k++) {
      m4.copy(o.matrixWorld);
      if (o.isInstancedMesh) { o.getMatrixAt(k, mi); if (Math.abs(mi.determinant()) < 1e-12) continue; m4.multiply(mi); }
      const W = new Float32Array(pos.count * 3), bb = box3();
      for (let i = 0; i < pos.count; i++) {
        if (o.isSkinnedMesh) o.getVertexPosition(i, va); else va.fromBufferAttribute(pos, i);
        va.applyMatrix4(m4); W[i * 3] = va.x; W[i * 3 + 1] = va.y; W[i * 3 + 2] = va.z; bb.add(va);
      }
      if (bb.max.y - bb.min.y < FLAT && bb.max.y < 0.3) { skipped.flat++; continue; }
      if (bb.min.x > R || bb.max.x < -R || bb.min.z > R || bb.max.z < -R) { skipped.far++; continue; }
      if (bb.max.x - bb.min.x > 2 * R && bb.max.z - bb.min.z > 2 * R) { skipped.far++; continue; }   // a dome, a ring
      /* WHICH OBJECT each triangle belongs to:
         - a copy of an instanced model: its materials are separate meshes, joined by the copy's own matrix;
         - a model or a person: its root group;
         - a merged piece the chapter built in code (a mesh straight under a layer): split into its pieces, a piece being
           the triangles that share corners (welded at a millimetre) */
      const merged = !o.isInstancedMesh && !o.isSkinnedMesh && root === o && !o.name;
      let compOf = null;
      if (merged) {
        const P = new Int32Array(pos.count); for (let i = 0; i < P.length; i++) P[i] = i;
        const find = (i) => { while (P[i] !== i) { P[i] = P[P[i]]; i = P[i]; } return i; };
        const unite = (a, c) => { a = find(a); c = find(c); if (a !== c) P[a] = c; };
        const at = new Map();
        for (let i = 0; i < pos.count; i++) { const key = Math.round(W[i * 3] * 1000) + ',' + Math.round(W[i * 3 + 1] * 1000) + ',' + Math.round(W[i * 3 + 2] * 1000);
          const j = at.get(key); if (j === undefined) at.set(key, i); else unite(i, j); }
        for (let t = 0; t < nT; t++) { const i0 = idx ? idx[t * 3] : t * 3, i1 = idx ? idx[t * 3 + 1] : t * 3 + 1, i2 = idx ? idx[t * 3 + 2] : t * 3 + 2; unite(i0, i1); unite(i1, i2); }
        compOf = (i) => find(i);
      }
      const lab0 = (o.isInstancedMesh ? o.name + ' #' + k + ' ' : '') + (castName.get(root) ? castName.get(root) + ' ' : '') + labelOf(o, root);
      const mkey = o.isInstancedMesh ? sigOf(o) + '#' + k : null;
      const chunk = new Map();     // object id -> array of numbers
      for (let t = 0; t < nT; t++) {
        const i0 = idx ? idx[t * 3] : t * 3, i1 = idx ? idx[t * 3 + 1] : t * 3 + 1, i2 = idx ? idx[t * 3 + 2] : t * 3 + 2;
        let rk;
        if (o.isInstancedMesh) rk = 'I' + mkey;
        else if (merged) rk = 'M' + o.uuid + '#' + compOf(i0);
        else rk = 'R' + root.uuid;
        let id = roots.get(rk);
        if (id === undefined) {
          const tb = box3(); tb.add(va.set(W[i0 * 3], W[i0 * 3 + 1], W[i0 * 3 + 2]));
          id = newObj(rk, merged ? lab0 + ' piece' : (o.isSkinnedMesh ? lab0 : lab0), tb);
          if (o.isSkinnedMesh) nPeople++;
        }
        let a = chunk.get(id); if (!a) chunk.set(id, a = []);
        for (const i of [i0, i1, i2]) a.push(W[i * 3], W[i * 3 + 1], W[i * 3 + 2]);
      }
      for (const [id, a] of chunk) { const F = new Float32Array(a); triOf[id].push(F);
        const O = objs[id]; for (let i = 0; i < F.length; i += 3) { O.min[0] = Math.min(O.min[0], F[i]); O.min[1] = Math.min(O.min[1], F[i + 1]); O.min[2] = Math.min(O.min[2], F[i + 2]);
          O.max[0] = Math.max(O.max[0], F[i]); O.max[1] = Math.max(O.max[1], F[i + 1]); O.max[2] = Math.max(O.max[2], F[i + 2]); } }
    }
  });
  /* ---- 1. cells: which objects pass through each */
  const cells = new Map(), cand = new Map();
  const sampleTri = (id, F, j) => {
    const ax = F[j], ay = F[j + 1], az = F[j + 2], bx = F[j + 3], by = F[j + 4], bz = F[j + 5], cx = F[j + 6], cy = F[j + 7], cz = F[j + 8];
    const e = Math.max(Math.hypot(bx - ax, by - ay, bz - az), Math.hypot(cx - bx, cy - by, cz - bz), Math.hypot(ax - cx, ay - cy, az - cz));
    const n = Math.min(300, Math.max(1, Math.ceil(e / (VOX * 0.5))));
    for (let i = 0; i <= n; i++) for (let k = 0; k <= n - i; k++) { const u = i / n, w = k / n, t = 1 - u - w;
      const x = ax * t + bx * u + cx * w, y = ay * t + by * u + cy * w, z = az * t + bz * u + cz * w;
      if (!inRange(x, y, z)) continue;
      const c = cellOf(x, y, z); let L = cells.get(c);
      if (L === undefined) { cells.set(c, id); continue; }
      if (L === id) continue;
      if (typeof L === 'number') { cells.set(c, L = [L]); }
      if (!L.includes(id)) { for (const o2 of L) { const a = Math.min(o2, id), b2 = Math.max(o2, id), pk = a * 100000 + b2; cand.set(pk, (cand.get(pk) || 0) + 1); } L.push(id); }
    }
  };
  let tris = 0;
  objs.forEach((O, id) => { for (const F of triOf[id]) for (let j = 0; j < F.length; j += 9) { sampleTri(id, F, j); tris++; } });
  /* ---- 2. for each candidate pair, the triangles of each near its shared cells, tested exactly */
  const shared = new Map();           // cell -> [pair keys]
  for (const [c, L] of cells) { if (typeof L === 'number') continue;
    for (let i = 0; i < L.length; i++) for (let k = i + 1; k < L.length; k++) { const a = Math.min(L[i], L[k]), b2 = Math.max(L[i], L[k]), pk = a * 100000 + b2;
      let S = shared.get(c); if (!S) shared.set(c, S = []); S.push(pk); } }
  const near = new Map();             // pair key -> { A: [tri arrays], B: [...] }
  /* every cell a triangle passes through: its corners' box when that is a few cells, else the cells its own samples fall
     in (a roof or a wall is a few large triangles: its box would be the whole roof's air) */
  const triCells = (F, j) => {
    let x0 = Infinity, y0 = Infinity, z0 = Infinity, x1 = -Infinity, y1 = -Infinity, z1 = -Infinity;
    for (let q = 0; q < 9; q += 3) { x0 = Math.min(x0, F[j + q]); y0 = Math.min(y0, F[j + q + 1]); z0 = Math.min(z0, F[j + q + 2]); x1 = Math.max(x1, F[j + q]); y1 = Math.max(y1, F[j + q + 1]); z1 = Math.max(z1, F[j + q + 2]); }
    const ix0 = Math.floor(x0 / VOX), iy0 = Math.floor(y0 / VOX), iz0 = Math.floor(z0 / VOX), ix1 = Math.floor(x1 / VOX), iy1 = Math.floor(y1 / VOX), iz1 = Math.floor(z1 / VOX);
    if ((ix1 - ix0 + 1) * (iy1 - iy0 + 1) * (iz1 - iz0 + 1) <= 64) {
      const out = []; for (let ix = ix0; ix <= ix1; ix++) for (let iy = iy0; iy <= iy1; iy++) for (let iz = iz0; iz <= iz1; iz++) out.push(ck(ix, iy, iz)); return out; }
    const ax = F[j], ay = F[j + 1], az = F[j + 2], bx = F[j + 3], by = F[j + 4], bz = F[j + 5], cx = F[j + 6], cy = F[j + 7], cz = F[j + 8];
    const e = Math.max(Math.hypot(bx - ax, by - ay, bz - az), Math.hypot(cx - bx, cy - by, cz - bz), Math.hypot(ax - cx, ay - cy, az - cz));
    const n = Math.min(600, Math.max(1, Math.ceil(e / (VOX * 0.4)))), set = new Set();
    for (let i = 0; i <= n; i++) for (let k = 0; k <= n - i; k++) { const u = i / n, w = k / n, t = 1 - u - w;
      const x = ax * t + bx * u + cx * w, y = ay * t + by * u + cy * w, z = az * t + bz * u + cz * w;
      /* (and the cells either side of it, so a crossing on a cell's face is not lost) */
      const fx = Math.floor(x / VOX), fy = Math.floor(y / VOX), fz = Math.floor(z / VOX);
      set.add(ck(fx, fy, fz)); }
    return Array.from(set);
  };
  objs.forEach((O, id) => { for (const F of triOf[id]) for (let j = 0; j < F.length; j += 9) {
    const cs = triCells(F, j); const seen = new Set();
    for (const c of cs) { const S = shared.get(c); if (!S) continue;
      for (const pk of S) { const a = Math.floor(pk / 100000), b2 = pk % 100000; if (a !== id && b2 !== id) continue;
        const sk = pk + ':' + j; if (seen.has(sk)) continue; seen.add(sk);
        let N = near.get(pk); if (!N) near.set(pk, N = { A: [], B: [] });
        (a === id ? N.A : N.B).push(F.subarray(j, j + 9)); } }
  } });
  /* an edge of one triangle through the other (Möller–Trumbore on the segment) */
  const segTri = (p0, p1, T, out) => {
    const e1x = T[3] - T[0], e1y = T[4] - T[1], e1z = T[5] - T[2], e2x = T[6] - T[0], e2y = T[7] - T[1], e2z = T[8] - T[2];
    const dx = p1[0] - p0[0], dy = p1[1] - p0[1], dz = p1[2] - p0[2];
    const px = dy * e2z - dz * e2y, py = dz * e2x - dx * e2z, pz = dx * e2y - dy * e2x, det = e1x * px + e1y * py + e1z * pz;
    if (Math.abs(det) < 1e-12) return false;
    const inv = 1 / det, sx = p0[0] - T[0], sy = p0[1] - T[1], sz = p0[2] - T[2];
    const u = (sx * px + sy * py + sz * pz) * inv; if (u < 0 || u > 1) return false;
    const qx = sy * e1z - sz * e1y, qy = sz * e1x - sx * e1z, qz = sx * e1y - sy * e1x;
    const v = (dx * qx + dy * qy + dz * qz) * inv; if (v < 0 || u + v > 1) return false;
    const t = (e2x * qx + e2y * qy + e2z * qz) * inv; if (t < 0 || t > 1) return false;
    out.push(p0[0] + dx * t, p0[1] + dy * t, p0[2] + dz * t); return true;
  };
  const pairs = [];
  const E3 = (T, i) => [T[i * 3], T[i * 3 + 1], T[i * 3 + 2]];
  for (const [pk, N] of near) {
    if (!N.A.length || !N.B.length) continue;
    /* a hash of B's triangles by cell, so each A triangle meets only B's near it */
    const hb = new Map();
    N.B.forEach((T, bi) => { const cs = triCells(T, 0); for (const c of cs) { let L = hb.get(c); if (!L) hb.set(c, L = []); L.push(bi); } });
    const pts = []; let hits = 0;
    for (const T of N.A) { const cs = triCells(T, 0); const tried = new Set();
      for (const c of cs) { const L = hb.get(c); if (!L) continue;
        for (const bi of L) { if (tried.has(bi)) continue; tried.add(bi); const U = N.B[bi]; const before = pts.length;
          for (let e = 0; e < 3; e++) { segTri(E3(T, e), E3(T, (e + 1) % 3), U, pts); segTri(E3(U, e), E3(U, (e + 1) % 3), T, pts); }
          if (pts.length > before) hits++; } } }
    if (!hits) continue;
    let x0 = Infinity, y0 = Infinity, z0 = Infinity, x1 = -Infinity, y1 = -Infinity, z1 = -Infinity;
    for (let i = 0; i < pts.length; i += 3) { x0 = Math.min(x0, pts[i]); y0 = Math.min(y0, pts[i + 1]); z0 = Math.min(z0, pts[i + 2]); x1 = Math.max(x1, pts[i]); y1 = Math.max(y1, pts[i + 1]); z1 = Math.max(z1, pts[i + 2]); }
    const a = Math.floor(pk / 100000), b2 = pk % 100000, r2 = (v) => +v.toFixed(2);
    const OA = objs[a], OB = objs[b2];
    /* resting: the crossings lie in a thin layer at the foot of one of the two (within 6 cm of its lowest point) */
    /* (A on B: the crossings lie within 6 cm of A's lowest point AND at B's top; a thin rail through an arm is not a rest) */
    const footA = y1 - OA.min[1] < 0.06 && OB.max[1] - y0 < 0.08, footB = y1 - OB.min[1] < 0.06 && OA.max[1] - y0 < 0.08;
    pairs.push({ hits, rest: footA || footB, at: [[r2(x0), r2(y0), r2(z0)], [r2(x1), r2(y1), r2(z1)]],
                 a: { label: OA.label, min: OA.min.map(r2), max: OA.max.map(r2) }, b: { label: OB.label, min: OB.min.map(r2), max: OB.max.map(r2) } });
  }
  pairs.sort((x, y) => (x.rest - y.rest) || (y.hits - x.hits));
  return { objects: objs.length, people: nPeople, tris, cells: cells.size, candidates: cand.size, skipped, pairs,
           objs: objs.map(O => ({ label: O.label, min: O.min.map(v => +v.toFixed(2)), max: O.max.map(v => +v.toFixed(2)) })) };
};
/* every model in (the stage says what it still waits for), a few frames drawn, then measured and written */
async function scanNow(tag) {
  await p.waitForFunction(() => { try { const i = window.__enc.stage.info(); return !i.waiting || !i.waiting.length; } catch { return false; } }, null, { timeout: 600000, polling: 1000 }).catch(() => log('some models never landed'));
  await p.evaluate(() => new Promise(r => { let k = 0; const f = () => (++k >= 4 ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); }));
  const res = await p.evaluate(ANALYSE, [VOX, R, FLAT]);
  /* WHAT HE CAN WALK INTO: every thing on the ground he is kept on, taller than 0.8 m and not a person, whose footprint's
     middle no blocker holds at the height collide() samples (a metre): his eye could go inside it */
  res.walkInto = await p.evaluate((objs) => {
    const E = window.__enc, K = E.stage.keepIn, B = E.stage.blockers || [], V3 = E.scene.position.constructor, v = new V3(), out = [];
    for (const o of objs) {
      if (/person|^line/.test(o.label) || o.max[1] - o.min[1] < 0.8 || o.min[1] > 0.6) continue;
      const cx = (o.min[0] + o.max[0]) / 2, cz = (o.min[2] + o.max[2]) / 2;
      if (cx < K.minX || cx > K.maxX || cz < K.minZ || cz > K.maxZ) continue;
      if (o.max[0] - o.min[0] > 6 || o.max[2] - o.min[2] > 6) continue;               // (a tent, a building's wall: their own posts and walls are solid)
      v.set(cx, 1.0, cz); if (!B.some(b => b.containsPoint(v))) out.push({ label: o.label.slice(0, 60), min: o.min, max: o.max });
    }
    return out; }, res.objs);
  if (res.walkInto.length) log(`${tag}: ${res.walkInto.length} things he can walk into: ` + res.walkInto.map(o => o.label.slice(0, 30) + ' @' + ((o.min[0] + o.max[0]) / 2).toFixed(1) + ',' + ((o.min[2] + o.max[2]) / 2).toFixed(1)).join(' | '));
  const OUTP = OUT.replace(/\.json$/, '-' + tag + '.json');
  fs.writeFileSync(OUTP, JSON.stringify(res, null, 1));
  log(`${tag}: ${res.objects} objects (${res.people} people), ${res.tris} triangles, ${res.cells} cells, ${res.candidates} candidate pairs; ${res.pairs.length} pairs whose surfaces cross -> ${OUTP}`);
}
/* STEPS=<file.json>: e4c3beats' steps (phase, film, choose, seek, seekAt, wait) with { "scan": "name" } where a measure is
   wanted (a film is measured where a seek leaves it: every body posed at that moment). Otherwise PHASES (or PHASE), each
   measured as play stands there. */
if (process.env.STEPS) {
  const STEPS = JSON.parse(fs.readFileSync(process.env.STEPS, 'utf8'));
  const frames = (n = 3) => p.evaluate((n) => new Promise(r => { let k = 0; const f = () => (++k >= n ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); }), n);
  for (const st of STEPS) { try {
    if (st.phase) { await p.evaluate((ph) => { const E = window.__enc; E.stage.reset(); E.kit.setPhase(ph); }, st.phase);
      await p.waitForFunction((ph) => window.__enc.stage.info().phase === ph.split(':')[0] && window.__enc.stage.dayClock.t > 0.2, st.phase, { timeout: 300000, polling: 300 }); await frames(3); log('phase', st.phase); }
    else if (st.wait != null) { const t0 = await p.evaluate(() => window.__enc.stage.dayClock.t); await p.waitForFunction(([t0, w]) => window.__enc.stage.dayClock.t >= t0 + w, [t0, st.wait], { timeout: 900000, polling: 300 }); }
    else if (st.until) { await p.waitForFunction(new Function('const E = window.__enc; try { return !!(' + st.until + '); } catch (e) { return false; }'), null, { timeout: st.ms || 300000, polling: 300 }).catch(() => log('until timed out', st.until)); }
    else if (st.film) { await p.evaluate((k) => window.__enc.kit.film(k), st.film); await p.waitForFunction(() => window.__enc.cine.active() && window.__enc.cine.t() > 0.15, null, { timeout: 300000, polling: 200 }).catch(() => {}); log('film', st.film); }
    else if (st.seek != null) { await p.evaluate((t) => window.__enc.cine.seek(t), st.seek); await frames(3); }
    else if (st.seekAt != null) { const t = await p.evaluate(new Function('const T = window.__enc.stage.dbg.clocks; return (' + st.seekAt + ');')); await p.evaluate((t) => window.__enc.cine.seek(t), t); await frames(3); }
    else if (st.choose != null) { await p.evaluate(() => window.__enc.decide && window.__enc.decide());
      await p.waitForFunction(() => document.querySelectorAll('#choices button.choice').length >= 4, null, { timeout: 120000, polling: 300 }); await p.waitForTimeout(600);
      await p.evaluate((i) => document.querySelectorAll('#choices button.choice')[i].click(), st.choose);
      await p.waitForFunction(() => window.__enc.cine.active() && window.__enc.cine.t() > 0.15, null, { timeout: 300000, polling: 200 }).catch(() => {}); log('choose', st.choose); }
    else if (st.skip) { await p.evaluate(() => window.__enc.cine.skip && window.__enc.cine.skip()); await frames(3); }
    else if (st.eval) { log('eval', String(await p.evaluate(new Function('const E = window.__enc; return (' + st.eval + ');'))).slice(0, 400)); }
    if (st.scan) await scanNow(st.scan);
  } catch (e) { log('step failed', JSON.stringify(st), String(e).slice(0, 200)); } }
} else {
const LIST = (process.env.PHASES || PHASE || '').split(',').map(x => x.trim());
for (const ph of LIST) {
if (ph) {
  await p.evaluate((ph) => { const E = window.__enc; if (E.cine && E.cine.active && E.cine.active() && E.cine.skip) E.cine.skip(); E.stage.reset(); E.kit.setPhase(ph); }, ph);
  await p.waitForFunction((ph) => { const E = window.__enc; return E.stage.info().phase === ph.split(':')[0] && E.stage.dayClock.t > 0.3 && !(E.cine && E.cine.active && E.cine.active()); }, ph, { timeout: 600000, polling: 300 })
    .catch(() => log('phase', ph, 'not reached as play (a film may hold it): scanned as it stands'));
}
/* every model in (the stage says what it still waits for), and every person standing at their level */
await p.waitForFunction(() => { try { const i = window.__enc.stage.info(); return !i.waiting || !i.waiting.length; } catch { return false; } }, null, { timeout: 600000, polling: 1000 }).catch(() => log('some models never landed'));
await p.evaluate(() => new Promise(r => { let k = 0; const f = () => (++k >= 6 ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); }));
log('in play', CH, ph || '(start)');
await scanNow(ph || 'start');
}
}
console.log('errs', JSON.stringify(errs));
await b.close();
