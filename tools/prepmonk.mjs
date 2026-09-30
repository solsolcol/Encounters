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
const [,, IN, OUT, R] = process.argv;
const RATIO = Number(R || 0.3), TAUBIN = Number(process.env.TAUBIN || 0), NOMAP = !!process.env.NOMAP;
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
await doc.transform(simplify({ simplifier: MeshoptSimplifier, ratio: RATIO, error: 0.0015 }), prune());

/* ---- normals shared across the seams (and an optional Taubin pass) ---- */
for (const mesh of root.listMeshes()) for (const p of mesh.listPrimitives()) {
  const pos = p.getAttribute('POSITION'), nor = p.getAttribute('NORMAL'), I = p.getIndices().getArray();
  const n = pos.getCount(), P = new Float32Array(n * 3), v = [0, 0, 0];
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
    const a = I[t], b = I[t + 1], c = I[t + 2];
    const ux = P[3 * b] - P[3 * a], uy = P[3 * b + 1] - P[3 * a + 1], uz = P[3 * b + 2] - P[3 * a + 2];
    const vx = P[3 * c] - P[3 * a], vy = P[3 * c + 1] - P[3 * a + 1], vz = P[3 * c + 2] - P[3 * a + 2];
    const nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;     // area-weighted
    for (const i of [a, b, c]) { const g = gid[i]; GN[3 * g] += nx; GN[3 * g + 1] += ny; GN[3 * g + 2] += nz; }
  }
  let changed = 0; const old = [0, 0, 0];
  for (let i = 0; i < n; i++) {
    const g = gid[i]; let x = GN[3 * g], y = GN[3 * g + 1], z = GN[3 * g + 2]; const L = Math.hypot(x, y, z) || 1; x /= L; y /= L; z /= L;
    nor.getElement(i, old); if (old[0] * x + old[1] * y + old[2] * z < 0.985) changed++;
    nor.setElement(i, [x, y, z]);
  }
  console.log(`  ${n} vertices in ${G} positions; ${changed} normals turned more than 10° to agree across a seam${TAUBIN ? `; Taubin x${TAUBIN}` : ''}`);
}

/* sheets: base colour and normal map at 2048 WebP, on a plain source */
for (const tex of root.listTextures()) {
  const img = await sharp(Buffer.from(tex.getImage())).resize(2048, 2048, { fit: 'fill' }).webp({ quality: 92 }).toBuffer();
  tex.setImage(img).setMimeType('image/webp').setURI('');
}
await doc.transform(prune(), meshopt({ encoder: MeshoptEncoder, level: 'medium' }));
await io.write(OUT, doc);
console.log(`prepmonk ${OUT.split('/').pop()}: tris ${t0} -> ${tris()}, ${root.listAnimations().length} takes, ${(fs.statSync(OUT).size / 1024).toFixed(0)} KB`);
