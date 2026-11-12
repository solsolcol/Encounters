/* v16.8 — Chad's monk (a Meshy-style scan, 597k triangles, one baked
   material, a 28-joint Mixamo skeleton, five takes: Running, Walking,
   Sit_Cross_Legged_on_Floor, Sit_Thumbs_Up_Right,
   Sitting_Answering_Questions), for the monk's dais in episode 3 chapter 1.
   Chad: "The model looks rough at the edges, is there anything you can do
   to refine it?"

   WHAT "ROUGH" WAS, measured by rendering the face three ways (untextured,
   without the normal map, texture only, unlit): the creases round the
   eyes, the nose and the mouth are there UNTEXTURED — they are SHADING, not
   paint. A scan like this is split into a separate vertex on each side of
   every UV seam, and each copy carries its own normal, so the light breaks
   along every seam. The shape is smooth; its normals are not.

   THE FIX touches neither the shape nor a painted pixel: after the weld and
   the simplify, every vertex's normal is recomputed as the area-weighted
   average of every face round its POSITION — across the seam, so both
   copies agree. (gltf-transform's normals() cannot do this: it unwelds and
   writes face normals, v8.0.) A light Taubin pass (TAUBIN=n, off by
   default) can also smooth the positions, moving every copy of a position
   together so no seam opens.

   The rest is the scan recipe: KHR_materials_specular and the 4096
   metal-roughness sheet dropped (roughness 0.78, metalness 0 is a cotton
   robe and skin), base colour and normal map kept at 2048 WebP on a plain
   source (rescueTextures reads json.textures[i].source, v14.12), all five
   takes kept (56 channels each, a few hundred KB), meshopt last.
     node tools/prepmonk.mjs in.glb out.glb [ratio] */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { dedup, prune, weld, simplify, meshopt } from '@gltf-transform/functions';
import { MeshoptSimplifier, MeshoptEncoder, MeshoptDecoder } from 'meshoptimizer';
import sharp from 'sharp';
import fs from 'node:fs';
import { fixThinCharts } from './chartfix.mjs';
const [,, IN, OUT, R] = process.argv;
const RATIO = Number(R || 0.3), TAUBIN = Number(process.env.TAUBIN || 0), NOMAP = !!process.env.NOMAP;
const TEXPX = Number(process.env.TEX || 2048);   // v19.6: the sheets' size (a crowd cut is seen small)
await Promise.all([MeshoptSimplifier.ready, MeshoptEncoder.ready, MeshoptDecoder.ready]);
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({
  'meshopt.encoder': MeshoptEncoder, 'meshopt.decoder': MeshoptDecoder });
const doc = await io.read(IN);
const root = doc.getRoot();
const tris = () => root.listMeshes().reduce((a, m) => a + m.listPrimitives().reduce((b, p) => b + p.getIndices().getCount() / 3, 0), 0);
const t0 = tris();

for (const mat of root.listMaterials()) {
  for (const ext of mat.listExtensions()) mat.setExtension(ext.extensionName, null);
  mat.setMetallicRoughnessTexture(null).setOcclusionTexture(null).setEmissiveTexture(null);
  mat.setMetallicFactor(0).setRoughnessFactor(0.78);
  if (NOMAP) mat.setNormalTexture(null);
}
await doc.transform(dedup(), weld());

/* ---- THE SKIN WEIGHTS (Chad: "when he starts animating, there are rough
   edges under his arms"). Rendered mid-take, the robe down both flanks and
   under the arms breaks into a SAW-TOOTH staircase: the auto-rig's weights
   change in blocks (a voxel rig's steps), so a bent arm shears the surface
   into steps. They are DIFFUSED over the mesh — each position's weights
   pulled toward its neighbours' for WSMOOTH passes, every copy of a position
   (the UV seams) sharing one set so no seam can open — then cut back to the
   four strongest and renormalised. On the FULL mesh, before the simplify,
   so the steps are smoothed where they were made. ---- */
const WSMOOTH = Number(process.env.WSMOOTH ?? 24);
if (WSMOOTH > 0) for (const mesh of root.listMeshes()) for (const p of mesh.listPrimitives()) {
  const pos = p.getAttribute('POSITION'), J = p.getAttribute('JOINTS_0'), Wt = p.getAttribute('WEIGHTS_0');
  if (!J || !Wt) continue;
  const I = p.getIndices().getArray(), n = pos.getCount(), v = [0, 0, 0], jj = [0, 0, 0, 0], ww = [0, 0, 0, 0];
  const key = i => { pos.getElement(i, v); return `${Math.round(v[0] * 1e5)},${Math.round(v[1] * 1e5)},${Math.round(v[2] * 1e5)}`; };
  const gid = new Int32Array(n), gmap = new Map(); let G = 0;
  for (let i = 0; i < n; i++) { const k = key(i); let g = gmap.get(k); if (g === undefined) { g = G++; gmap.set(k, g); } gid[i] = g; }
  let NJ = 0;
  for (let i = 0; i < n; i++) { J.getElement(i, jj); for (const j of jj) NJ = Math.max(NJ, j + 1); }
  let A = new Float32Array(G * NJ), cnt = new Float32Array(G);
  for (let i = 0; i < n; i++) { const g = gid[i]; J.getElement(i, jj); Wt.getElement(i, ww); cnt[g]++;
    for (let k = 0; k < 4; k++) A[g * NJ + jj[k]] += ww[k]; }
  for (let g = 0; g < G; g++) for (let j = 0; j < NJ; j++) A[g * NJ + j] /= cnt[g];
  // neighbours per position (CSR)
  const deg = new Uint32Array(G + 1), pairs = [];
  for (let t = 0; t < I.length; t += 3) for (let k = 0; k < 3; k++) { const a = gid[I[t + k]], b = gid[I[t + (k + 1) % 3]]; if (a !== b) { pairs.push(a, b); deg[a + 1]++; deg[b + 1]++; } }
  for (let g = 0; g < G; g++) deg[g + 1] += deg[g];
  const adj = new Uint32Array(deg[G]), fill = deg.slice(0, G);
  for (let e = 0; e < pairs.length; e += 2) { const a = pairs[e], b = pairs[e + 1]; adj[fill[a]++] = b; adj[fill[b]++] = a; }
  let B = new Float32Array(A.length);
  for (let it = 0; it < WSMOOTH; it++) {
    for (let g = 0; g < G; g++) {
      const s0 = deg[g], s1 = deg[g + 1], m = s1 - s0, o = g * NJ;
      if (!m) { for (let j = 0; j < NJ; j++) B[o + j] = A[o + j]; continue; }
      for (let j = 0; j < NJ; j++) { let acc = 0; for (let e = s0; e < s1; e++) acc += A[adj[e] * NJ + j]; B[o + j] = 0.5 * A[o + j] + 0.5 * acc / m; }
    }
    const T = A; A = B; B = T;
  }
  // back to four influences per vertex
  let moved = 0;
  for (let i = 0; i < n; i++) {
    const o = gid[i] * NJ, best = [];
    for (let j = 0; j < NJ; j++) if (A[o + j] > 1e-4) best.push([A[o + j], j]);
    best.sort((a, b) => b[0] - a[0]); const top = best.slice(0, 4); let sum = top.reduce((a, b) => a + b[0], 0) || 1;
    while (top.length < 4) top.push([0, 0]);
    J.getElement(i, jj); Wt.getElement(i, ww);
    const nw = top.map(t => t[0] / sum), nj = top.map(t => t[1]);
    if (Math.abs(nw[0] - ww[0]) > 0.1 || nj[0] !== jj[0]) moved++;
    J.setElement(i, nj); Wt.setElement(i, nw);
  }
  console.log(`  skin weights: ${n} vertices in ${G} positions over ${NJ} joints, ${WSMOOTH} diffusion passes; ${moved} vertices' main weight moved`);
}
/* v24.54 · THINLOCK=<r> (masters/v24.54/PLAN.md): the thinning may not move or take out a point within r of his right
   shoulder joint whose arm share (RightArm, RightForeArm, RightHand) lies between 0.02 and 0.98, nor a point joined to one
   by an edge (meshopt's vertex lock; every other point is thinned by the same rule as before). His right armpit, rebuilt in
   Blender before this step (tools/armpit.py), is kept as built: free to move there, the thinning remade joins between his
   arm and his side from the points round them (v24.53's patch came back however the joins were cut or painted before it). */
const THINLOCK = Number(process.env.THINLOCK || 0);
let thinner = MeshoptSimplifier;
if (THINLOCK > 0) {
  const skin = root.listSkins()[0], joints = skin.listJoints(), names = joints.map(j => j.getName().replace('mixamorig:', ''));
  const k = names.indexOf('RightArm'), a = Array.from(skin.getInverseBindMatrices().getArray().slice(k * 16, k * 16 + 16));
  // the joint's rest place: the translation of its inverse bind matrix's inverse (as tools/armfree.mjs finds it)
  const c00 = a[5] * a[10] - a[9] * a[6], c01 = -(a[4] * a[10] - a[8] * a[6]), c02 = a[4] * a[9] - a[8] * a[5];
  const c10 = -(a[1] * a[10] - a[9] * a[2]), c11 = a[0] * a[10] - a[8] * a[2], c12 = -(a[0] * a[9] - a[8] * a[1]);
  const c20 = a[1] * a[6] - a[5] * a[2], c21 = -(a[0] * a[6] - a[4] * a[2]), c22 = a[0] * a[5] - a[4] * a[1];
  const id = 1 / (a[0] * c00 + a[4] * c10 + a[8] * c20), r = [c00, c01, c02, c10, c11, c12, c20, c21, c22].map(x => x * id);
  const C = [0, 1, 2].map(i => -(r[3 * i] * a[12] + r[3 * i + 1] * a[13] + r[3 * i + 2] * a[14]));
  const ARM = new Set(['RightArm', 'RightForeArm', 'RightHand'].map(x => names.indexOf(x)));
  const key = (a, o) => `${Math.round(a[o] * 1e5)},${Math.round(a[o + 1] * 1e5)},${Math.round(a[o + 2] * 1e5)}`;
  const band = new Set();
  for (const mesh of root.listMeshes()) for (const prim of mesh.listPrimitives()) {
    const P = prim.getAttribute('POSITION'), J = prim.getAttribute('JOINTS_0'), W = prim.getAttribute('WEIGHTS_0');
    if (!J || !W) continue;
    const pos = P.getArray(), I = prim.getIndices().getArray(), n = P.getCount(), jj = [0, 0, 0, 0], ww = [0, 0, 0, 0], inBand = new Uint8Array(n);
    for (let i = 0; i < n; i++) { const d = Math.hypot(pos[3 * i] - C[0], pos[3 * i + 1] - C[1], pos[3 * i + 2] - C[2]); if (d > THINLOCK) continue;
      J.getElement(i, jj); W.getElement(i, ww); let a = 0; for (let q = 0; q < 4; q++) if (ARM.has(jj[q])) a += ww[q];
      if (a > 0.02 && a < 0.98) inBand[i] = 1; }
    const lockV = new Uint8Array(n);
    for (let t = 0; t < I.length; t += 3) if (inBand[I[t]] || inBand[I[t + 1]] || inBand[I[t + 2]]) lockV[I[t]] = lockV[I[t + 1]] = lockV[I[t + 2]] = 1;
    for (let i = 0; i < n; i++) if (lockV[i]) band.add(key(pos, 3 * i));
  }
  thinner = { ...MeshoptSimplifier, simplify: (idx, pos, stride, target, err, flags) => {
    const nv = pos.length / stride, lock = new Uint8Array(nv); let nl = 0;
    for (let i = 0; i < nv; i++) if (band.has(key(pos, i * stride))) { lock[i] = 1; nl++; }
    console.log(`  thinning: ${nl} points at his right armpit held (within ${THINLOCK} m of the joint, arm share 0.02-0.98, and their neighbours)`);
    return MeshoptSimplifier.simplifyWithAttributes(idx, pos, stride, new Float32Array(0), 0, [], lock, target, err, flags); } };
}
/* v26.0 · NOTHIN=1: no thinning at all (a body the generator already rebuilt at the count wanted: tools/riglod.mjs).
   Unset, the thinning runs as it always did. */
if (process.env.NOTHIN) await doc.transform(prune());
else await doc.transform(simplify({ simplifier: thinner, ratio: RATIO, error: 0.0015 }), prune());

/* ---- v19.8: THE FOLDS. The simplifier can fold a thin flap flat onto
   itself, leaving two copies of one triangle facing opposite ways (none in
   the scan; 1 to 319 per cut of the congregation). Summed at a vertex their
   normals cancel to nothing, a zero normal shades as NaN, and NaN draws
   BLACK — the black slits on the shirts, black with the light off, with a
   solid colour and with both sides drawn. The second of each pair gets its
   own three vertices (every attribute copied, so the skin moves them as
   one) and both are left out of the shared normals below; each side is then
   shaded by its own face. ---- */
for (const mesh of root.listMeshes()) for (const p of mesh.listPrimitives()) {
  const pos = p.getAttribute('POSITION'), idx = p.getIndices(), I0 = idx.getArray();
  const n = pos.getCount(), v = [0, 0, 0], key = [];
  for (let i = 0; i < n; i++) { pos.getElement(i, v); key.push(v.join(',')); }
  const gm = new Map(), g = i => { let x = gm.get(key[i]); if (x === undefined) gm.set(key[i], x = gm.size); return x; };
  const seen = new Map(), pairs = [];
  for (let t = 0; t < I0.length / 3; t++) {
    const q = [g(I0[3 * t]), g(I0[3 * t + 1]), g(I0[3 * t + 2])];
    if (q[0] === q[1] || q[1] === q[2] || q[0] === q[2]) continue;
    const m = q.indexOf(Math.min(...q)), cyc = [q[m], q[(m + 1) % 3], q[(m + 2) % 3]], s = [...q].sort((a, b) => a - b).join(',');
    const prev = seen.get(s);
    if (prev && prev.cyc[1] === cyc[2] && !prev.paired) { prev.paired = true; pairs.push([prev.t, t]); } else if (!prev) seen.set(s, { t, cyc });
  }
  if (!pairs.length) continue;
  const add = pairs.length * 3, N = n + add;
  for (const sem of p.listSemantics()) {
    const acc = p.getAttribute(sem), old = acc.getArray(), es = acc.getElementSize();
    const arr = new old.constructor(N * es); arr.set(old);
    let o = n;
    for (const [, t] of pairs) for (let k = 0; k < 3; k++, o++) for (let e = 0; e < es; e++) arr[o * es + e] = old[I0[3 * t + k] * es + e];
    acc.setArray(arr);
  }
  const I = N > 65535 ? new Uint32Array(I0) : new I0.constructor(I0);
  let o = n; for (const [, t] of pairs) for (let k = 0; k < 3; k++, o++) I[3 * t + k] = o;
  idx.setArray(I);
  p.setExtras({ ...(p.getExtras() || {}), folds: pairs.map(q => q.flat()) });
  console.log(`  folds: ${pairs.length} triangles lying back to back on another, each side given its own vertices`);
}

/* ---- v24.52 · STRETCHPAINT=R: AFTER the thinning, the robe's white kept only where nothing stretches. Grandmaster Pho
   (Chad, 8 Nov 2026: "It is still not clean enough"): tools/armfree.mjs draws in skin the triangles at his right armpit
   that stretch while holding the robe's white, but the thinning above merges points into NEW such triangles, white teeth
   at the robe's edge stretched 8 to 18 times (built without the thinning, there are none; no hold width before it cured
   them). So here, after it: a triangle within R metres of the STRETCHJOINT bone's joint (his right shoulder) whose
   corners' shares of the STRETCHBONES bones (his right arm) differ by STRETCHDIFF or more, and that holds any of the
   robe's white (15 points sampled in it; a pale neutral texel, saturation under 0.16 and value over 150), is drawn in the
   skin beside it: its three corners copied with every attribute, pointed at the texel of the most typical skin within
   3 cm. No point moves, no weight changes. Unset, nothing here runs. ---- */
const STRETCHPAINT = Number(process.env.STRETCHPAINT || 0);
if (STRETCHPAINT > 0) {
  const reJ = new RegExp(process.env.STRETCHJOINT || 'RightArm$'), reB = new RegExp(process.env.STRETCHBONES || 'Right(Arm|ForeArm|Hand)$'), DIFF = Number(process.env.STRETCHDIFF || 0.015);
  /* v24.53 · ROBEHANG=d: low on his side, further than d metres from the joint, a triangle in skin with a corner on the robe
     (a vertex there holds the robe's white) riding his trunk and a corner riding the arm by 0.3 or more hangs off the robe:
     raised, the arm draws it out over the robe as a patch of skin (his scan's lowest joins, seen from his right in the chair
     sit's cheer). Chad, 8 Nov 2026: "Fix those remaining issues cleanly and efficiently". It is taken out, here, after the
     thinning: drawn in the robe's white it showed as a white streak up the skin under his arm, and painted or taken out
     before the thinning, the thinning made it again from the points round it. What is behind it is his robe and the web. */
  const ROBEHANG = Number(process.env.ROBEHANG || 0); let nHang = 0;
  /* v24.53 · EDGEBLEED=r: within r metres of the joint, a triangle of skin whose texels lie within 2 texels of the robe's
     white (a thin chart of skin beside white in his colour sheet) is pointed at a texel of the skin beside it whose own
     7 x 7 texels are all skin. Drawn, a texel at a chart's edge mixes in its neighbour: the white came through as the faint
     pale dots and lines in the crease of his armpit with the arm down (look D, Talk_with_Hands_Open). No pixel of his sheet
     is touched. Unset, nothing changes. */
  const EDGEBLEED = Number(process.env.EDGEBLEED || 0); let nBleed = 0;
  for (const node of root.listNodes()) { const mesh = node.getMesh(), skin = node.getSkin(); if (!mesh || !skin) continue;
    const jn = skin.listJoints().map(j => j.getName()), ji = jn.findIndex(x => reJ.test(x)); if (ji < 0) continue;
    const a = Array.from(skin.getInverseBindMatrices().getArray().slice(ji * 16, ji * 16 + 16));   // the joint at rest: the inverse of its inverse-bind matrix
    const c00 = a[5] * a[10] - a[9] * a[6], c01 = -(a[4] * a[10] - a[8] * a[6]), c02 = a[4] * a[9] - a[8] * a[5], c10 = -(a[1] * a[10] - a[9] * a[2]), c11 = a[0] * a[10] - a[8] * a[2], c12 = -(a[0] * a[9] - a[8] * a[1]);
    const c20 = a[1] * a[6] - a[5] * a[2], c21 = -(a[0] * a[6] - a[4] * a[2]), c22 = a[0] * a[5] - a[4] * a[1], idet = 1 / (a[0] * c00 + a[4] * c10 + a[8] * c20);
    const r = [c00, c01, c02, c10, c11, c12, c20, c21, c22].map(x => x * idet), JP = [0, 1, 2].map(k => -(r[3 * k] * a[12] + r[3 * k + 1] * a[13] + r[3 * k + 2] * a[14]));
    const moving = jn.map(x => reB.test(x));
    for (const p of mesh.listPrimitives()) { const P = p.getAttribute('POSITION'), J = p.getAttribute('JOINTS_0'), W = p.getAttribute('WEIGHTS_0'), UV = p.getAttribute('TEXCOORD_0');
      const tex = p.getMaterial() && p.getMaterial().getBaseColorTexture(); if (!J || !W || !UV || !tex) continue;
      const { data, info } = await sharp(Buffer.from(tex.getImage()), { limitInputPixels: false }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
      const n = P.getCount(), v = [0, 0, 0], uv = [0, 0], jj = [0, 0, 0, 0], ww = [0, 0, 0, 0], pos = new Float32Array(3 * n), share = new Float32Array(n);
      for (let i = 0; i < n; i++) { P.getElement(i, v); pos.set(v, 3 * i); J.getElement(i, jj); W.getElement(i, ww); let s = 0; for (let k = 0; k < 4; k++) if (moving[jj[k]]) s += ww[k]; share[i] = s; }
      const wrap = (x, m) => ((x % m) + m) % m, px = (u, w) => { const o = (wrap(Math.floor(w * info.height), info.height) * info.width + wrap(Math.floor(u * info.width), info.width)) * 3; return [data[o], data[o + 1], data[o + 2]]; };
      const sat = c => { const mx = Math.max(c[0], c[1], c[2]); return mx ? (mx - Math.min(c[0], c[1], c[2])) / mx : 0; }, pale = c => Math.max(c[0], c[1], c[2]) > 150 && sat(c) < 0.16;
      const dJ = (x, y, z) => Math.hypot(x - JP[0], y - JP[1], z - JP[2]), skinV = [];
      for (let i = 0; i < n; i++) { if (dJ(pos[3 * i], pos[3 * i + 1], pos[3 * i + 2]) > STRETCHPAINT + 0.05) continue; UV.getElement(i, uv); const c = px(uv[0], uv[1]); if (sat(c) > 0.2 && !pale(c)) skinV.push([i, c]); }
      const I0 = p.getIndices().getArray(), jobs = [], drops = new Set();
      const pk = i => Math.round(pos[3 * i] * 1e5) + ',' + Math.round(pos[3 * i + 1] * 1e5) + ',' + Math.round(pos[3 * i + 2] * 1e5), robeAt = new Map();
      if (ROBEHANG > 0) for (let i = 0; i < n; i++) { if (share[i] >= 0.05 || dJ(pos[3 * i], pos[3 * i + 1], pos[3 * i + 2]) > STRETCHPAINT + 0.05) continue; UV.getElement(i, uv); if (pale(px(uv[0], uv[1])) && !robeAt.has(pk(i))) robeAt.set(pk(i), i); }
      for (let t = 0; t < I0.length; t += 3) { const q = [I0[t], I0[t + 1], I0[t + 2]], cx = (pos[3 * q[0]] + pos[3 * q[1]] + pos[3 * q[2]]) / 3, cy = (pos[3 * q[0] + 1] + pos[3 * q[1] + 1] + pos[3 * q[2] + 1]) / 3, cz = (pos[3 * q[0] + 2] + pos[3 * q[1] + 2] + pos[3 * q[2] + 2]) / 3;
        if (dJ(cx, cy, cz) > STRETCHPAINT) continue; const s3 = q.map(i => share[i]), spread = Math.max(...s3) - Math.min(...s3);
        if (EDGEBLEED > 0 && dJ(cx, cy, cz) <= EDGEBLEED) { const u3b = q.map(i => { UV.getElement(i, uv); return [uv[0], uv[1]]; }); let skinN = 0, nearW = false;
          for (let s = 0; s <= 4; s++) for (let r2 = 0; r2 + s <= 4; r2++) { const b = [s / 4, r2 / 4, 1 - s / 4 - r2 / 4], uu = b[0] * u3b[0][0] + b[1] * u3b[1][0] + b[2] * u3b[2][0], ww2 = b[0] * u3b[0][1] + b[1] * u3b[1][1] + b[2] * u3b[2][1];
            if (!pale(px(uu, ww2))) skinN++; if (!nearW) for (let dy = -2; dy <= 2 && !nearW; dy++) for (let dx = -2; dx <= 2; dx++) if (pale(px(uu + dx / info.width, ww2 + dy / info.height))) { nearW = true; break; } }
          if (skinN >= 12 && nearW) { const safe = skinV.filter(([i]) => Math.hypot(pos[3 * i] - cx, pos[3 * i + 1] - cy, pos[3 * i + 2] - cz) < 0.03).filter(([i]) => { UV.getElement(i, uv); for (let dy = -3; dy <= 3; dy++) for (let dx = -3; dx <= 3; dx++) if (pale(px(uv[0] + dx / info.width, uv[1] + dy / info.height))) return false; return true; });
            if (safe.length) { const med = [0, 1, 2].map(k => safe.map(x => x[1][k]).sort((x, y) => x - y)[safe.length >> 1]); let best = safe[0][0], bd = 1e9; for (const [i, c] of safe) { const d = (c[0] - med[0]) ** 2 + (c[1] - med[1]) ** 2 + (c[2] - med[2]) ** 2; if (d < bd) { bd = d; best = i; } }
              jobs.push([t, best]); nBleed++; continue; } } }
        if (spread < DIFF) continue;
        if (ROBEHANG > 0 && dJ(cx, cy, cz) > ROBEHANG) { const tr = q.filter(i => share[i] < 0.05 && robeAt.has(pk(i)));
          if (tr.length >= 1 && q.some(i => share[i] > 0.3)) { const u3h = q.map(i => { UV.getElement(i, uv); return [uv[0], uv[1]]; }); let skinN = 0;
            for (let s = 0; s <= 4; s++) for (let r2 = 0; r2 + s <= 4; r2++) { const b = [s / 4, r2 / 4, 1 - s / 4 - r2 / 4]; if (!pale(px(b[0] * u3h[0][0] + b[1] * u3h[1][0] + b[2] * u3h[2][0], b[0] * u3h[0][1] + b[1] * u3h[1][1] + b[2] * u3h[2][1]))) skinN++; }
            if (skinN >= 8) { drops.add(t); nHang++; continue; } } }
        const u3 = q.map(i => { UV.getElement(i, uv); return [uv[0], uv[1]]; }); let white = false;
        for (let s = 0; s <= 4 && !white; s++) for (let r2 = 0; r2 + s <= 4; r2++) { const b = [s / 4, r2 / 4, 1 - s / 4 - r2 / 4]; if (pale(px(b[0] * u3[0][0] + b[1] * u3[1][0] + b[2] * u3[2][0], b[0] * u3[0][1] + b[1] * u3[1][1] + b[2] * u3[2][1]))) { white = true; break; } }
        if (!white) continue;
        const near = skinV.filter(([i]) => Math.hypot(pos[3 * i] - cx, pos[3 * i + 1] - cy, pos[3 * i + 2] - cz) < 0.03); if (!near.length) continue;
        const med = [0, 1, 2].map(k => near.map(x => x[1][k]).sort((x, y) => x - y)[near.length >> 1]); let best = near[0][0], bd = 1e9;
        for (const [i, c] of near) { const d = (c[0] - med[0]) ** 2 + (c[1] - med[1]) ** 2 + (c[2] - med[2]) ** 2; if (d < bd) { bd = d; best = i; } }
        jobs.push([t, best]); }
      if (!jobs.length && !drops.size) { console.log('  stretch paint: none'); continue; }
      const N = n + 3 * jobs.length;
      for (const sem of p.listSemantics()) { const acc = p.getAttribute(sem), old = acc.getArray(), es = acc.getElementSize(), arr = new old.constructor(N * es); arr.set(old);
        let o = n; for (const [t, best] of jobs) for (let k = 0; k < 3; k++, o++) { const src = sem === 'TEXCOORD_0' ? best : I0[t + k]; for (let e = 0; e < es; e++) arr[o * es + e] = old[src * es + e]; }
        acc.setArray(arr); }
      const I = N > 65535 ? new Uint32Array(I0) : new I0.constructor(I0); let o = n; for (const [t] of jobs) for (let k = 0; k < 3; k++, o++) I[t + k] = o;
      /* ROBEHANG: the hanging triangles taken out */
      if (drops.size) { const I2 = new I.constructor(I.length - 3 * drops.size); let w = 0; for (let t = 0; t < I.length; t += 3) if (!drops.has(t)) { I2[w++] = I[t]; I2[w++] = I[t + 1]; I2[w++] = I[t + 2]; } p.getIndices().setArray(I2); }
      else p.getIndices().setArray(I);
      if (EDGEBLEED > 0) console.log(`  edge bleed: ${nBleed} triangles of skin within ${EDGEBLEED} m of ${jn[ji]} beside the robe's white in the sheet pointed at skin inside a chart`);
      console.log(`  stretch paint: ${jobs.length - nBleed} triangles within ${STRETCHPAINT} m of ${jn[ji]} that stretch with /${reB.source}/ and held the robe's white drawn in the skin beside them`);
      if (ROBEHANG > 0) console.log(`  robe hang: ${nHang} triangles in skin hanging off the robe further than ${ROBEHANG} m from ${jn[ji]} taken out`); } } }

/* ---- normals shared across the seams (and an optional Taubin pass) ---- */
for (const mesh of root.listMeshes()) for (const p of mesh.listPrimitives()) {
  const pos = p.getAttribute('POSITION'), nor = p.getAttribute('NORMAL'), I = p.getIndices().getArray();
  const n = pos.getCount(), P = new Float32Array(n * 3), v = [0, 0, 0];
  const folds = (p.getExtras() || {}).folds || [], inFold = new Set(folds.flat());
  for (let i = 0; i < n; i++) { pos.getElement(i, v); P.set(v, 3 * i); }
  // group vertices by position (1e-5 m)
  const key = i => `${Math.round(P[3 * i] * 1e5)},${Math.round(P[3 * i + 1] * 1e5)},${Math.round(P[3 * i + 2] * 1e5)}`;
  const gid = new Int32Array(n), gmap = new Map(); let G = 0;
  for (let i = 0; i < n; i++) { const k = key(i); let g = gmap.get(k); if (g === undefined) { g = G++; gmap.set(k, g); } gid[i] = g; }
  if (TAUBIN > 0) {
    // neighbours per position group, from the triangles
    const nb = Array.from({ length: G }, () => new Set());
    for (let t = 0; t < I.length; t += 3) for (let j = 0; j < 3; j++) { const a = gid[I[t + j]], b = gid[I[t + (j + 1) % 3]]; nb[a].add(b); nb[b].add(a); }
    const GP = new Float64Array(G * 3), cnt = new Uint32Array(G);
    for (let i = 0; i < n; i++) { const g = gid[i]; if (cnt[g]++) continue; GP[3 * g] = P[3 * i]; GP[3 * g + 1] = P[3 * i + 1]; GP[3 * g + 2] = P[3 * i + 2]; }
    const step = (f) => { const D = new Float64Array(G * 3);
      for (let g = 0; g < G; g++) { const s = nb[g]; if (!s.size) continue; let x = 0, y = 0, z = 0;
        for (const h of s) { x += GP[3 * h]; y += GP[3 * h + 1]; z += GP[3 * h + 2]; }
        D[3 * g] = x / s.size - GP[3 * g]; D[3 * g + 1] = y / s.size - GP[3 * g + 1]; D[3 * g + 2] = z / s.size - GP[3 * g + 2]; }
      for (let k = 0; k < G * 3; k++) GP[k] += f * D[k]; };
    for (let it = 0; it < TAUBIN; it++) { step(0.5); step(-0.53); }
    for (let i = 0; i < n; i++) { const g = gid[i]; P[3 * i] = GP[3 * g]; P[3 * i + 1] = GP[3 * g + 1]; P[3 * i + 2] = GP[3 * g + 2]; pos.setElement(i, [P[3 * i], P[3 * i + 1], P[3 * i + 2]]); }
  }
  const GN = new Float64Array(G * 3);
  for (let t = 0; t < I.length; t += 3) {
    if (inFold.has(t / 3)) continue;   // v19.8: a fold's two faces would cancel each other here
    const a = I[t], b = I[t + 1], c = I[t + 2];
    const ux = P[3 * b] - P[3 * a], uy = P[3 * b + 1] - P[3 * a + 1], uz = P[3 * b + 2] - P[3 * a + 2];
    const vx = P[3 * c] - P[3 * a], vy = P[3 * c + 1] - P[3 * a + 1], vz = P[3 * c + 2] - P[3 * a + 2];
    const nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;     // area-weighted
    for (const i of [a, b, c]) { const g = gid[i]; GN[3 * g] += nx; GN[3 * g + 1] += ny; GN[3 * g + 2] += nz; }
  }
  /* v26.0 · SIDED=1: a point shares the normal of the faces at its place that look ITS way (within eighty degrees of the
     normal it came with), and of no others. A remesh closes a fold by putting both its sides' points on one place (the
     inner corner of an eye, the corner of a mouth): shared among all the faces there, the normal is the sum of two
     sides and points along the fold, and the faces round it are lit as one flat grey patch (the two monks made on
     12 Nov 2026: a patch over the bridge of the nose and one at the mouth, lit; unlit the paint is clean). Across a
     sheet's seam the copies of a point look the same way and still agree. Unset, every point of a place shares one
     normal, as it always did. */
  const SIDED = !!process.env.SIDED, GF = SIDED ? Array.from({ length: G }, () => []) : null;
  if (SIDED) for (let t = 0; t < I.length; t += 3) { if (inFold.has(t / 3)) continue; const a = I[t], b = I[t + 1], c = I[t + 2];
    const ux = P[3 * b] - P[3 * a], uy = P[3 * b + 1] - P[3 * a + 1], uz = P[3 * b + 2] - P[3 * a + 2], vx = P[3 * c] - P[3 * a], vy = P[3 * c + 1] - P[3 * a + 1], vz = P[3 * c + 2] - P[3 * a + 2];
    const nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx; for (const g of new Set([gid[a], gid[b], gid[c]])) GF[g].push(nx, ny, nz); }
  let changed = 0, sided = 0; const old = [0, 0, 0];
  for (let i = 0; i < n; i++) {
    const g = gid[i]; let x = GN[3 * g], y = GN[3 * g + 1], z = GN[3 * g + 2]; const L = Math.hypot(x, y, z) || 1; x /= L; y /= L; z /= L;
    nor.getElement(i, old);
    if (SIDED) { const F = GF[g]; let sx = 0, sy = 0, sz = 0, left = 0;
      for (let k = 0; k < F.length; k += 3) { const fl = Math.hypot(F[k], F[k + 1], F[k + 2]) || 1; if ((F[k] * old[0] + F[k + 1] * old[1] + F[k + 2] * old[2]) / fl > 0.17) { sx += F[k]; sy += F[k + 1]; sz += F[k + 2]; } else left++; }
      const sl = Math.hypot(sx, sy, sz); if (left && sl > 1e-12) { x = sx / sl; y = sy / sl; z = sz / sl; sided++; } }
    if (old[0] * x + old[1] * y + old[2] * z < 0.985) changed++;
    nor.setElement(i, [x, y, z]);
  }
  if (SIDED) console.log(`  sided: ${sided} points share only the faces at their place that look their way`);
  /* v19.8: each side of a fold, and any vertex no other face touches, takes its own face's normal */
  const face = t => { const a = I[3 * t], b = I[3 * t + 1], c = I[3 * t + 2];
    const ux = P[3 * b] - P[3 * a], uy = P[3 * b + 1] - P[3 * a + 1], uz = P[3 * b + 2] - P[3 * a + 2];
    const vx = P[3 * c] - P[3 * a], vy = P[3 * c + 1] - P[3 * a + 1], vz = P[3 * c + 2] - P[3 * a + 2];
    const f = [uy * vz - uz * vy, uz * vx - ux * vz, ux * vy - uy * vx], L = Math.hypot(...f) || 1; return f.map(q => q / L); };
  for (const [t1, t2] of folds) {
    for (let k = 0; k < 3; k++) nor.setElement(I[3 * t2 + k], face(t2));
    for (let k = 0; k < 3; k++) { const i = I[3 * t1 + k], g = gid[i]; if (Math.hypot(GN[3 * g], GN[3 * g + 1], GN[3 * g + 2]) < 1e-20) nor.setElement(i, face(t1)); }
  }
  /* and a knife edge the simplifier left without an identical twin (two faces
     folded back on a shared edge): where a position's faces cancel, each of
     its vertices takes the faces that use THAT vertex, then its largest one */
  { const big = new Float64Array(G); for (let t = 0; t < I.length; t += 3) { if (inFold.has(t / 3)) continue;
      const f = face(t / 3), a = I[t], b = I[t + 1], c = I[t + 2];
      const ux = P[3 * b] - P[3 * a], uy = P[3 * b + 1] - P[3 * a + 1], uz = P[3 * b + 2] - P[3 * a + 2], vx = P[3 * c] - P[3 * a], vy = P[3 * c + 1] - P[3 * a + 1], vz = P[3 * c + 2] - P[3 * a + 2];
      const ar = Math.hypot(uy * vz - uz * vy, uz * vx - ux * vz, ux * vy - uy * vx); for (const i of [a, b, c]) big[gid[i]] += ar; }
    const own = new Map();
    for (let t = 0; t < I.length / 3; t++) for (let k = 0; k < 3; k++) { const i = I[3 * t + k], g = gid[i];
      if (inFold.has(t) || Math.hypot(GN[3 * g], GN[3 * g + 1], GN[3 * g + 2]) > 1e-3 * big[g]) continue;
      const f = face(t), o = own.get(i) || [0, 0, 0, null, 0]; o[0] += f[0]; o[1] += f[1]; o[2] += f[2]; own.set(i, o); }
    for (const [i, o] of own) { const L = Math.hypot(o[0], o[1], o[2]); if (L > 1e-6) nor.setElement(i, [o[0] / L, o[1] / L, o[2] / L]);
      else { for (let t = 0; t < I.length / 3; t++) if (I[3 * t] === i || I[3 * t + 1] === i || I[3 * t + 2] === i) { nor.setElement(i, face(t)); break; } } }
    if (own.size) console.log(`  knife edges: ${own.size} vertices whose faces cancel, shaded by their own faces`);
  }
  const used = new Set(I);   // the simplifier leaves vertices no triangle uses; meshopt's reorder drops them
  let zero = 0; for (const i of used) { nor.getElement(i, v); if (!(Math.hypot(...v) > 0.5)) zero++; }
  if (folds.length) p.setExtras({ ...(p.getExtras() || {}), folds: undefined });
  console.log(`  ${n} vertices in ${G} positions; ${changed} normals turned more than 10° to agree across a seam${TAUBIN ? `; Taubin x${TAUBIN}` : ''}; normals of no length: ${zero}`);
}

/* v24.55 · BAKE=dump:<dir> | apply:<dir> (masters/v24.55/PLAN.md): his face and hands at his scan's full detail, a part of
   their own baked in Blender (tools/rebake.py). Grandmaster Pho (Chad, 8 Nov 2026: "you are not using it to its fullest
   potential and capacity"): his colour sheet is 8192 pixels and every part of him has the same share of it (23 texels a
   centimetre), so cut to 4096 for a phone his face and hands lost half their detail with the plain robe; and the chart fix
   below pins each of his hair's hundreds of slivers to one texel of the sheets, so lit, each sliver takes one tilt of the
   normal map: a mosaic of grey squares on the back of his head. dump (here, before the chart fix and the two-side split):
   this mesh (its points, normals, sheet coordinates, triangles and which part of him each point rides), the mesh this run
   read and his two sheets as read are written to <dir>, and the run stops. Blender packs the charts of his head and hands
   (and his necklace's gold) into a square of their own, bakes his 8192 colour sheet into it through each triangle's own
   coordinates (every triangle shows what it showed: no texel of his paint changed) and his normal map from the full mesh
   read (the slivers keep their real shading), and gives Blender's tangents for the new coordinates. apply: the run reads it
   back and checks the mesh is the one dumped; those triangles become a part of their own with their own points (copies:
   every attribute their point's, so they move and bend as before, with the new sheets' coordinates and tangents) and a
   copy of his material with the two new sheets (DETNORMAL=0: none, shaded by its points). The chart fix leaves that part
   alone (a gutter round every chart). His body sheet, normal map, points, weights and the rest of his triangles are as
   they were. The sheets keep their own sizes, WebP as the others. Unset, nothing here runs and the output is as it was. */
const chartSkip = new Set();
if (process.env.BAKE) {
  const [mode, dir] = process.env.BAKE.split(/:(.*)/s);
  const node = root.listNodes().find(x => x.getMesh() && x.getSkin()), mesh = node.getMesh(), prims = mesh.listPrimitives();
  if (prims.length !== 1) throw new Error('BAKE: one part expected before the two-side split');
  const p0 = prims[0], mat0 = p0.getMaterial(), baseTex = mat0.getBaseColorTexture();
  const P = p0.getAttribute('POSITION').getArray(), N = p0.getAttribute('NORMAL').getArray(), UVA = p0.getAttribute('TEXCOORD_0'), n = UVA.getCount();
  const idx = Uint32Array.from(p0.getIndices().getArray());
  const fnv = (...arrs) => { let h = 0x811c9dc5; for (const a of arrs) { const b = new Uint8Array(a.buffer, a.byteOffset, a.byteLength); for (let i = 0; i < b.length; i++) { h ^= b[i]; h = Math.imul(h, 0x01000193) >>> 0; } } return h.toString(16); };
  const hash = fnv(Float32Array.from(P), idx, Float32Array.from(UVA.getArray()));
  const bin = (f, a) => fs.writeFileSync(`${dir}/${f}`, Buffer.from(a.buffer, a.byteOffset, a.byteLength));
  const ext = t => (t.getMimeType() === 'image/png' ? 'png' : t.getMimeType() === 'image/webp' ? 'webp' : 'jpg');
  if (mode === 'dump') {
    fs.mkdirSync(dir, { recursive: true });
    const jn = node.getSkin().listJoints().map(j => j.getName()), J = p0.getAttribute('JOINTS_0'), W = p0.getAttribute('WEIGHTS_0'), reg = new Uint8Array(n), jj = [], ww = [];
    for (let i = 0; i < n; i++) { J.getElement(i, jj); W.getElement(i, ww); const acc = {}; for (let k = 0; k < 4; k++) acc[jj[k]] = (acc[jj[k]] || 0) + ww[k];
      let best = 0, bw = -1; for (const k in acc) if (acc[k] > bw) { bw = acc[k]; best = +k; } const nm = jn[best] || '';
      reg[i] = /Head|Neck/.test(nm) ? 1 : /Hand|Thumb|Index|Middle|Ring|Pinky/.test(nm) ? 2 : /Foot|Toe/.test(nm) ? 3 : 0; }
    bin('low_pos.f32', Float32Array.from(P)); bin('low_nor.f32', Float32Array.from(N)); bin('low_uv.f32', Float32Array.from(UVA.getArray())); bin('low_idx.u32', idx); bin('low_reg.u8', reg);
    const hp = (await io.read(IN)).getRoot().listMeshes()[0].listPrimitives()[0], hn = hp.getMaterial().getNormalTexture();
    bin('high_pos.f32', Float32Array.from(hp.getAttribute('POSITION').getArray())); bin('high_nor.f32', Float32Array.from(hp.getAttribute('NORMAL').getArray()));
    bin('high_uv.f32', Float32Array.from(hp.getAttribute('TEXCOORD_0').getArray())); bin('high_idx.u32', Uint32Array.from(hp.getIndices().getArray()));
    fs.writeFileSync(`${dir}/base_src.${ext(baseTex)}`, Buffer.from(baseTex.getImage())); fs.writeFileSync(`${dir}/normal_src.${ext(hn)}`, Buffer.from(hn.getImage()));
    fs.writeFileSync(`${dir}/dump.json`, JSON.stringify({ hash, n, tris: idx.length / 3, base: `base_src.${ext(baseTex)}`, normal: `normal_src.${ext(hn)}`,
      high: { n: hp.getAttribute('POSITION').getCount(), tris: hp.getIndices().getCount() / 3 }, texPx: TEXPX }));
    console.log(`  bake: dumped ${n} points and ${idx.length / 3} triangles (and the ${hp.getIndices().getCount() / 3} read) to ${dir}; run tools/rebake.py ${dir}, then BAKE=apply:${dir}`);
    process.exit(0);
  }
  if (mode !== 'apply') throw new Error(`BAKE=${process.env.BAKE}: dump:<dir> or apply:<dir>`);
  const dj = JSON.parse(fs.readFileSync(`${dir}/dump.json`, 'utf8')), out = JSON.parse(fs.readFileSync(`${dir}/baked.json`, 'utf8'));
  if (dj.hash !== hash || out.hash !== hash) throw new Error(`BAKE: the mesh is not the one dumped (${hash} against ${dj.hash}/${out.hash})`);
  const rdf = f => { const b = fs.readFileSync(`${dir}/${f}`); return new Float32Array(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength)); };
  const rdu = f => { const b = fs.readFileSync(`${dir}/${f}`); return new Uint32Array(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength)); };
  const detUV = rdf('det_uv.f32'), detTan = rdf('det_tan.f32'), copySrc = rdu('copy_src.u32'), idxNew = rdu('idx_new.u32'), detTri = fs.readFileSync(`${dir}/det_tri.u8`), nv = n + copySrc.length;
  if (nv !== out.points || detUV.length !== 2 * nv || detTan.length !== 4 * nv || idxNew.length !== idx.length || detTri.length !== idx.length / 3) throw new Error('BAKE: the baked coordinates do not match the points');
  // the part's own points: one for each (point, coordinate) its triangles use, every attribute its point's
  const own = new Map(), srcOf = [], body = [], face = [];
  for (let t = 0; t < idx.length; t += 3) {
    if (!detTri[t / 3]) { body.push(idx[t], idx[t + 1], idx[t + 2]); continue; }
    for (let k = 0; k < 3; k++) { const id = idxNew[t + k]; let o = own.get(id); if (o === undefined) { o = srcOf.length; own.set(id, o); srcOf.push(id); } face.push(o); } }
  const m = srcOf.length, Ctor0 = p0.getIndices().getArray().constructor;
  const p2 = doc.createPrimitive().setMode(p0.getMode());
  for (const sem of p0.listSemantics()) { const acc = p0.getAttribute(sem), old = acc.getArray(), es = acc.getElementSize(), arr = new old.constructor(m * es);
    for (let o = 0; o < m; o++) { const id = srcOf[o], v = id < n ? id : copySrc[id - n]; for (let e = 0; e < es; e++) arr[o * es + e] = old[v * es + e]; }
    p2.setAttribute(sem, doc.createAccessor().setType(acc.getType()).setArray(arr).setNormalized(acc.getNormalized()).setBuffer(acc.getBuffer())); }
  const uv2 = new Float32Array(2 * m), tan2 = new Float32Array(4 * m);
  for (let o = 0; o < m; o++) { const id = srcOf[o]; uv2[2 * o] = detUV[2 * id]; uv2[2 * o + 1] = detUV[2 * id + 1]; for (let e = 0; e < 4; e++) tan2[4 * o + e] = detTan[4 * id + e]; }
  p2.getAttribute('TEXCOORD_0').setArray(uv2);
  if (p2.getAttribute('TANGENT')) p2.getAttribute('TANGENT').setArray(tan2); else p2.setAttribute('TANGENT', doc.createAccessor().setType('VEC4').setArray(tan2).setBuffer(UVA.getBuffer()));
  p2.setIndices(doc.createAccessor().setType('SCALAR').setArray(m > 65535 ? Uint32Array.from(face) : Uint16Array.from(face)).setBuffer(p0.getIndices().getBuffer()));
  p0.getIndices().setArray(Ctor0.from(body));
  const dm = mat0.clone().setName(`${mat0.getName() || 'material'} (face and hands)`);
  dm.setBaseColorTexture(doc.createTexture('detail').setImage(fs.readFileSync(`${dir}/${out.detail}`)).setMimeType('image/png'));
  if (out.normal && process.env.DETNORMAL !== '0') dm.setNormalTexture(doc.createTexture('detail normal').setImage(fs.readFileSync(`${dir}/${out.normal}`)).setMimeType('image/png'));
  else dm.setNormalTexture(null);
  p2.setMaterial(dm); mesh.addPrimitive(p2); chartSkip.add(dm);
  console.log(`  bake: ${out.summary}; a part of its own: ${face.length / 3} triangles on ${m} points of their own${dm.getNormalTexture() ? '' : ', no normal map'}`);
}

/* v19.8: the scan's two-texel charts, each pointed at a uniform spot of the
   colour its surface shows, so an edge fetch cannot bleed a neighbour into
   them (CHARTFIX=1; tools/chartfix.mjs has the measurement) */
if (process.env.PREPACK) await io.write(process.env.PREPACK, doc);   // the cut before the fix, for probes
if (process.env.CHARTFIX) {
  const rep = [];
  await fixThinCharts(doc, { finalPx: TEXPX, report: rep, inset: Number(process.env.INSET || 1.5), skip: chartSkip });
  const sz = rep.map(r => r.texels).sort((a, b) => b - a);
  console.log(`  largest fixed charts (texels at ${TEXPX}): ${sz.slice(0, 12).join(' ')}`);
  if (process.env.CHARTREPORT) fs.writeFileSync(process.env.CHARTREPORT, JSON.stringify(rep));
}

/* v24.47: TWOSIDE=<bone pattern> — the triangles riding those bones (all three points' weight on them over a half) drawn
   from both sides, as a second part of the same mesh sharing its points (the very same accessors, so no seam can open)
   with a copy of its material that is double-sided: Grandmaster Pho's robe below his waist, one layer of cloth since
   tools/robeshell.mjs, whose inside is then the back of the same cloth. The rest of him is drawn from its front as before
   (his whole material double-sided showed specks of his scan's own holes at his head and necklace). Unset, nothing here
   runs and the output is as it was. */
if (process.env.TWOSIDE) { const re = new RegExp(process.env.TWOSIDE);
  for (const node of root.listNodes()) { const mesh = node.getMesh(), skin = node.getSkin(); if (!mesh || !skin) continue; const jn = skin.listJoints().map(j => j.getName());
    for (const p of [...mesh.listPrimitives()]) { const J = p.getAttribute('JOINTS_0'), W = p.getAttribute('WEIGHTS_0'); if (!J || !W) continue;
      const n = J.getCount(), on = new Uint8Array(n), jj = [], ww = [];
      for (let i = 0; i < n; i++) { J.getElement(i, jj); W.getElement(i, ww); let s = 0; for (let k = 0; k < 4; k++) if (re.test(jn[jj[k]])) s += ww[k]; on[i] = s > 0.5 ? 1 : 0; }
      const I = p.getIndices().getArray(), rest = [], both = [];
      for (let t = 0; t < I.length; t += 3) (on[I[t]] && on[I[t + 1]] && on[I[t + 2]] ? both : rest).push(I[t], I[t + 1], I[t + 2]);
      if (!both.length) continue;
      const Ctor = I.constructor; p.getIndices().setArray(new Ctor(rest));
      const m2 = p.getMaterial().clone().setDoubleSided(true).setName(`${p.getMaterial().getName() || 'material'} (both sides)`);
      const p2 = doc.createPrimitive().setMode(p.getMode()).setMaterial(m2).setIndices(doc.createAccessor().setType('SCALAR').setArray(new Ctor(both)).setBuffer(p.getIndices().getBuffer()));
      for (const sem of p.listSemantics()) p2.setAttribute(sem, p.getAttribute(sem));
      mesh.addPrimitive(p2);
      console.log(`  both sides: ${both.length / 3} triangles riding /${process.env.TWOSIDE}/ in their own part, its material double-sided (${rest.length / 3} drawn from the front as before)`); } } }

/* sheets: base colour and normal map at 2048 WebP, on a plain source.
   v24.38: NTEX sizes the normal map on its own (a face's sharpness is in the
   colour sheet; unset, the normal map takes TEX as it always did) */
const NTEXPX = Number(process.env.NTEX || TEXPX);
const normalTex = new Set(root.listMaterials().map(m => m.getNormalTexture()).filter(Boolean));
for (const tex of root.listTextures()) {
  /* v24.55: the face-and-hands sheets (BAKE) keep their own sizes */
  const px = /^detail( normal)?$/.test(tex.getName()) ? tex.getSize()[0] : normalTex.has(tex) ? NTEXPX : TEXPX;
  const img = await sharp(Buffer.from(tex.getImage())).resize(px, px, { fit: 'fill' }).webp({ quality: 92 }).toBuffer();
  tex.setImage(img).setMimeType('image/webp').setURI('');
}
await doc.transform(prune(), meshopt({ encoder: MeshoptEncoder, level: 'medium' }));
await io.write(OUT, doc);
console.log(`prepmonk ${OUT.split('/').pop()}: tris ${t0} -> ${tris()}, ${root.listAnimations().length} takes, ${(fs.statSync(OUT).size / 1024).toFixed(0)} KB`);
