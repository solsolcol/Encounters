/* v27.0 · a model's side profile in its own metres: for each 5 cm band along z, the heights where its points lie in the
   middle of its width (|x| < W, default 0.12 m). Reads a seat's top, a footrest, a shelf:
     node tools/probes/profile.mjs <file.glb> [W] */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder } from 'meshoptimizer';
await MeshoptDecoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder });
const doc = await io.read(process.argv[2]), W = +(process.argv[3] || 0.12), pts = [];
for (const n of doc.getRoot().listNodes()) { const m = n.getMesh(); if (!m) continue; const M = n.getWorldMatrix();
  for (const p of m.listPrimitives()) { const a = p.getAttribute('POSITION'); const v = [0, 0, 0];
    for (let i = 0; i < a.getCount(); i++) { a.getElement(i, v); pts.push([M[0] * v[0] + M[4] * v[1] + M[8] * v[2] + M[12], M[1] * v[0] + M[5] * v[1] + M[9] * v[2] + M[13], M[2] * v[0] + M[6] * v[1] + M[10] * v[2] + M[14]]); } } }
let z0 = Infinity, z1 = -Infinity; for (const p of pts) { z0 = Math.min(z0, p[2]); z1 = Math.max(z1, p[2]); }
for (let z = Math.floor(z0 * 20) / 20; z <= z1; z += 0.05) {
  const h = new Map(); for (const p of pts) if (Math.abs(p[0]) < W && p[2] >= z && p[2] < z + 0.05) { const k = Math.round(p[1] * 20) / 20; h.set(k, (h.get(k) || 0) + 1); }
  console.log(z.toFixed(2).padStart(6), [...h.entries()].sort((a, b) => a[0] - b[0]).map(e => e[0].toFixed(2) + ':' + e[1]).join(' '));
}
