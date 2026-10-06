/* v18.8 · smooth normals for a simplified scan: every vertex's normal is the
   area-weighted average of every face round its POSITION, so the copies on
   each side of a UV seam agree (prepmonk.mjs's step, v16.8). Polished metal
   shows every normal break as a facet — the light cut of Chad's Buddha read as
   a faceted face until this ran.
   node masters/v18.8/smoothn.mjs in.glb out.glb [creaseDeg]   (no crease = fully smooth) */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { prune, meshopt, dequantize } from '@gltf-transform/functions';
import { MeshoptEncoder, MeshoptDecoder } from 'meshoptimizer';
await Promise.all([MeshoptEncoder.ready, MeshoptDecoder.ready]);
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.encoder': MeshoptEncoder, 'meshopt.decoder': MeshoptDecoder });
const [IN, OUT] = process.argv.slice(2);
const d = await io.read(IN);
await d.transform(dequantize());
for (const m of d.getRoot().listMeshes()) for (const p of m.listPrimitives()) {
  const pos = p.getAttribute('POSITION'), nor = p.getAttribute('NORMAL'), I = p.getIndices().getArray();
  const n = pos.getCount(), P = new Float64Array(n * 3), v = [0, 0, 0];
  for (let i = 0; i < n; i++) { pos.getElement(i, v); P.set(v, 3 * i); }
  const key = i => `${Math.round(P[3 * i] * 1e4)},${Math.round(P[3 * i + 1] * 1e4)},${Math.round(P[3 * i + 2] * 1e4)}`;
  const gid = new Int32Array(n), gm = new Map(); let G = 0;
  for (let i = 0; i < n; i++) { const k = key(i); let g = gm.get(k); if (g === undefined) { g = G++; gm.set(k, g); } gid[i] = g; }
  const GN = new Float64Array(G * 3);
  for (let t = 0; t < I.length; t += 3) {
    const a = I[t], b = I[t + 1], c = I[t + 2];
    const ux = P[3*b]-P[3*a], uy = P[3*b+1]-P[3*a+1], uz = P[3*b+2]-P[3*a+2], vx = P[3*c]-P[3*a], vy = P[3*c+1]-P[3*a+1], vz = P[3*c+2]-P[3*a+2];
    const nx = uy*vz-uz*vy, ny = uz*vx-ux*vz, nz = ux*vy-uy*vx;
    for (const i of [a, b, c]) { const g = gid[i]; GN[3*g] += nx; GN[3*g+1] += ny; GN[3*g+2] += nz; }
  }
  let ch = 0; const o = [0, 0, 0];
  for (let i = 0; i < n; i++) { const g = gid[i]; let x = GN[3*g], y = GN[3*g+1], z = GN[3*g+2]; const L = Math.hypot(x, y, z) || 1; x /= L; y /= L; z /= L;
    nor.getElement(i, o); if (o[0]*x + o[1]*y + o[2]*z < 0.985) ch++; nor.setElement(i, [x, y, z]); }
  console.log(`${n} vertices in ${G} positions; ${ch} normals turned more than 10°`);
}
await d.transform(prune(), meshopt({ encoder: MeshoptEncoder, level: 'medium' }));
await io.write(OUT, d);
