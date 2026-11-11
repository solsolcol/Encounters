// where a seat's top is: the model's points in its middle (a third of its width and depth), the heights where most of them lie
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder } from 'meshoptimizer';
await MeshoptDecoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder });
for (const f of process.argv.slice(2)) {
  const doc = await io.read(f); const pts = [];
  for (const n of doc.getRoot().listNodes()) { const m = n.getMesh(); if (!m) continue; const M = n.getWorldMatrix();
    for (const p of m.listPrimitives()) { const a = p.getAttribute('POSITION'); const v = [0, 0, 0];
      for (let i = 0; i < a.getCount(); i++) { a.getElement(i, v); pts.push([M[0] * v[0] + M[4] * v[1] + M[8] * v[2] + M[12], M[1] * v[0] + M[5] * v[1] + M[9] * v[2] + M[13], M[2] * v[0] + M[6] * v[1] + M[10] * v[2] + M[14]]); } } }
  let mn = [1e9, 1e9, 1e9], mx = [-1e9, -1e9, -1e9]; for (const p of pts) for (let k = 0; k < 3; k++) { mn[k] = Math.min(mn[k], p[k]); mx[k] = Math.max(mx[k], p[k]); }
  const cx = (mn[0] + mx[0]) / 2, W = mx[0] - mn[0], D = mx[2] - mn[2];
  // the seat: middle third in x; in z, from the middle to the front (try both ends as the front)
  const hist = (z0, z1) => { const h = new Map(); for (const p of pts) if (Math.abs(p[0] - cx) < W / 6 && p[2] >= z0 && p[2] <= z1) { const k = Math.round(p[1] * 50) / 50; h.set(k, (h.get(k) || 0) + 1); } return [...h.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5).map(e => e[0].toFixed(2) + ':' + e[1]).join(' '); };
  const zc = (mn[2] + mx[2]) / 2;
  console.log(f.split('/').pop(), 'box', mn.map(v => v.toFixed(2)), mx.map(v => v.toFixed(2)), '\n   +z half:', hist(zc, mx[2] - D * 0.12), '\n   -z half:', hist(mn[2] + D * 0.12, zc));
}
