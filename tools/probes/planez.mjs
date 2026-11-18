/* v27.0 · where a flat part of a model lies along z (its own metres): the points within a rectangle of x and y, their z
   in 1 mm bins (a frame's picture, a shelf's back, a screen):  node tools/probes/planez.mjs <file.glb> x0 x1 y0 y1 */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder } from 'meshoptimizer';
await MeshoptDecoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder });
const [f, ...r] = process.argv.slice(2), [x0, x1, y0, y1] = r.map(Number);
const doc = await io.read(f), h = new Map(); let n = 0, lo = Infinity, hi = -Infinity;
for (const nd of doc.getRoot().listNodes()) { const m = nd.getMesh(); if (!m) continue; const M = nd.getWorldMatrix();
  for (const p of m.listPrimitives()) { const a = p.getAttribute('POSITION'); const v = [0, 0, 0];
    for (let i = 0; i < a.getCount(); i++) { a.getElement(i, v); const x = M[0] * v[0] + M[4] * v[1] + M[8] * v[2] + M[12], y = M[1] * v[0] + M[5] * v[1] + M[9] * v[2] + M[13], z = M[2] * v[0] + M[6] * v[1] + M[10] * v[2] + M[14];
      if (x < x0 || x > x1 || y < y0 || y > y1) continue; n++; lo = Math.min(lo, z); hi = Math.max(hi, z); const k = Math.round(z * 1000) / 1000; h.set(k, (h.get(k) || 0) + 1); } } }
console.log(f.split('/').pop(), n, 'points, z', lo.toFixed(4), 'to', hi.toFixed(4), '|', [...h.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8).map(e => e[0].toFixed(3) + ':' + e[1]).join(' '));
