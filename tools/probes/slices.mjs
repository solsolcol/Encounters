/* v26.18 · a model's extent at each height: node tools/probes/slices.mjs <file.glb> [step=0.01] [y0=0] [y1=0.45]
   (the vertices in each slab of the height: how many, and their extent on x and z; written to find where a generated
   statue's own plinth ends and its body begins, before the plinth is cut off: prepmeshy BASECUT) */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder, MeshoptEncoder } from 'meshoptimizer';
await Promise.all([MeshoptDecoder.ready, MeshoptEncoder.ready]);
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder, 'meshopt.encoder': MeshoptEncoder });
const doc = await io.read(process.argv[2]);
const step = Number(process.argv[3] || 0.01), y0 = Number(process.argv[4] || 0), y1 = Number(process.argv[5] || 0.45);
const rows = new Map();
for (const node of doc.getRoot().listNodes()) { const mesh = node.getMesh(); if (!mesh) continue; const M = node.getWorldMatrix();
  for (const p of mesh.listPrimitives()) { const acc = p.getAttribute('POSITION'); const n = acc.getCount(), v = [0, 0, 0];
    for (let i = 0; i < n; i++) { acc.getElement(i, v); const x = M[0] * v[0] + M[4] * v[1] + M[8] * v[2] + M[12], y = M[1] * v[0] + M[5] * v[1] + M[9] * v[2] + M[13], z = M[2] * v[0] + M[6] * v[1] + M[10] * v[2] + M[14];
      if (y < y0 || y > y1) continue; const k = Math.floor(y / step); let r = rows.get(k); if (!r) rows.set(k, r = { n: 0, x0: 9, x1: -9, z0: 9, z1: -9 }); r.n++; r.x0 = Math.min(r.x0, x); r.x1 = Math.max(r.x1, x); r.z0 = Math.min(r.z0, z); r.z1 = Math.max(r.z1, z); } } }
for (const k of [...rows.keys()].sort((a, b) => a - b)) { const r = rows.get(k); console.log((k * step).toFixed(3), 'n', r.n, 'x', r.x0.toFixed(3), r.x1.toFixed(3), 'w', (r.x1 - r.x0).toFixed(3), 'z', r.z0.toFixed(3), r.z1.toFixed(3), 'd', (r.z1 - r.z0).toFixed(3)); }
