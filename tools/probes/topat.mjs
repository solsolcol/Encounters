/* v27.0 · the height of a model's top surface over a spot (its own metres): the highest points within r of (x, z), and
   the spread of heights there in 1 cm bins (a tray's floor, a shelf's board, a seat):
     node tools/probes/topat.mjs <file.glb> [x z r] */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder } from 'meshoptimizer';
await MeshoptDecoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder });
const [f, X = '0', Z = '0', R = '0.05'] = process.argv.slice(2), x0 = +X, z0 = +Z, r = +R;
const doc = await io.read(f), h = new Map(); let top = -Infinity;
for (const n of doc.getRoot().listNodes()) { const m = n.getMesh(); if (!m) continue; const M = n.getWorldMatrix();
  for (const p of m.listPrimitives()) { const a = p.getAttribute('POSITION'); const v = [0, 0, 0];
    for (let i = 0; i < a.getCount(); i++) { a.getElement(i, v); const x = M[0] * v[0] + M[4] * v[1] + M[8] * v[2] + M[12], y = M[1] * v[0] + M[5] * v[1] + M[9] * v[2] + M[13], z = M[2] * v[0] + M[6] * v[1] + M[10] * v[2] + M[14];
      if (Math.hypot(x - x0, z - z0) > r) continue; top = Math.max(top, y); const k = Math.round(y * 100) / 100; h.set(k, (h.get(k) || 0) + 1); } } }
console.log(f.split('/').pop(), 'top', top.toFixed(3), '|', [...h.entries()].sort((a, b) => a[0] - b[0]).map(e => e[0].toFixed(2) + ':' + e[1]).join(' '));
