/* v21.8 · NORMALS ACROSS THE SEAMS, KEEPING THE CREASES. OFFLINE.

   v18.8's smoothn.mjs (masters/v18.8) made a simplified scan's normals agree
   across its UV seams by averaging every face round a POSITION — right for a
   statue, which is curved everywhere, and wrong for a piece of furniture: a
   box's corner would be averaged into a rounded smear across three flat faces.
   This keeps the crease. Each vertex averages (area-weighted) only the faces
   round its position whose own normal is within CREASE degrees of the
   vertex's ORIGINAL normal — so the copies of one point on either side of a
   seam (which the scan gave the same normal) come to agree, and a corner's
   copies (which it gave different ones) stay apart.
     node tools/smoothseams.mjs in.glb out.glb [creaseDeg=50]              */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { prune, meshopt, dequantize } from '@gltf-transform/functions';
import { MeshoptEncoder, MeshoptDecoder } from 'meshoptimizer';
await Promise.all([MeshoptEncoder.ready, MeshoptDecoder.ready]);
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.encoder': MeshoptEncoder, 'meshopt.decoder': MeshoptDecoder });
const [IN, OUT, C] = process.argv.slice(2);
const COS = Math.cos((+(C || 50)) * Math.PI / 180);
const d = await io.read(IN);
await d.transform(dequantize());
for (const m of d.getRoot().listMeshes()) for (const p of m.listPrimitives()) {
  const pos = p.getAttribute('POSITION'), nor = p.getAttribute('NORMAL'), I = p.getIndices().getArray();
  const n = pos.getCount(), P = new Float64Array(n * 3), N0 = new Float64Array(n * 3), v = [0, 0, 0];
  for (let i = 0; i < n; i++) { pos.getElement(i, v); P.set(v, 3 * i); nor.getElement(i, v); N0.set(v, 3 * i); }
  // the position groups (the copies of one point a seam split)
  const key = i => `${Math.round(P[3 * i] * 1e4)},${Math.round(P[3 * i + 1] * 1e4)},${Math.round(P[3 * i + 2] * 1e4)}`;
  const gid = new Int32Array(n), gm = new Map(); let G = 0;
  for (let i = 0; i < n; i++) { const k = key(i); let g = gm.get(k); if (g === undefined) { g = G++; gm.set(k, g); } gid[i] = g; }
  // every face's area-weighted normal, and the faces round each group
  const T = I.length / 3, FN = new Float64Array(T * 3), cnt = new Int32Array(G + 1);
  for (let t = 0; t < T; t++) {
    const a = I[3 * t], b = I[3 * t + 1], c = I[3 * t + 2];
    const ux = P[3*b]-P[3*a], uy = P[3*b+1]-P[3*a+1], uz = P[3*b+2]-P[3*a+2], vx = P[3*c]-P[3*a], vy = P[3*c+1]-P[3*a+1], vz = P[3*c+2]-P[3*a+2];
    FN[3*t] = uy*vz-uz*vy; FN[3*t+1] = uz*vx-ux*vz; FN[3*t+2] = ux*vy-uy*vx;
    for (const i of [a, b, c]) cnt[gid[i] + 1]++;
  }
  for (let g = 0; g < G; g++) cnt[g + 1] += cnt[g];
  const fill = cnt.slice(), F = new Int32Array(cnt[G]);
  for (let t = 0; t < T; t++) for (let k = 0; k < 3; k++) { const g = gid[I[3 * t + k]]; F[fill[g]++] = t; }
  let ch = 0, kept = 0; const o = [0, 0, 0];
  for (let i = 0; i < n; i++) {
    const g = gid[i], ox = N0[3*i], oy = N0[3*i+1], oz = N0[3*i+2];
    let x = 0, y = 0, z = 0, seen = new Set();
    for (let k = cnt[g]; k < cnt[g + 1]; k++) {
      const t = F[k]; if (seen.has(t)) continue; seen.add(t);
      const fx = FN[3*t], fy = FN[3*t+1], fz = FN[3*t+2], L = Math.hypot(fx, fy, fz) || 1;
      if ((fx * ox + fy * oy + fz * oz) / L < COS) continue;            // across a crease: not this copy's face
      x += fx; y += fy; z += fz;
    }
    const L = Math.hypot(x, y, z);
    if (!L) { kept++; continue; }                                       // nothing on this side: the scan's own normal stands
    x /= L; y /= L; z /= L;
    nor.getElement(i, o); if (o[0]*x + o[1]*y + o[2]*z < 0.985) ch++;
    nor.setElement(i, [x, y, z]);
  }
  console.log(`${n} vertices in ${G} positions; ${ch} normals turned more than 10°, ${kept} left as they were`);
}
await d.transform(prune(), meshopt({ encoder: MeshoptEncoder, level: 'medium' }));
await io.write(OUT, d);
