import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder } from 'meshoptimizer';
await MeshoptDecoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder });
for (const f of process.argv.slice(2)) {
  const doc = await io.read(f); let lo = [1e9, 1e9, 1e9], hi = [-1e9, -1e9, -1e9]; const pts = [];
  for (const n of doc.getRoot().listNodes()) { const m = n.getMesh(); if (!m) continue; const W = n.getWorldMatrix();
    for (const p of m.listPrimitives()) { const a = p.getAttribute('POSITION'); for (let i = 0; i < a.getCount(); i++) { const v = a.getElement(i, []);
      const x = W[0] * v[0] + W[4] * v[1] + W[8] * v[2] + W[12], y = W[1] * v[0] + W[5] * v[1] + W[9] * v[2] + W[13], z = W[2] * v[0] + W[6] * v[1] + W[10] * v[2] + W[14];
      pts.push([x, y, z]); lo = [Math.min(lo[0], x), Math.min(lo[1], y), Math.min(lo[2], z)]; hi = [Math.max(hi[0], x), Math.max(hi[1], y), Math.max(hi[2], z)]; } } }
  console.log(f.split('/').pop(), 'box', lo.map(v => v.toFixed(3)), hi.map(v => v.toFixed(3)));
  const H = hi[1] - lo[1], N = 10;
  for (let b = 0; b < N; b++) { const y0 = lo[1] + H * b / N, y1 = lo[1] + H * (b + 1) / N; let r = 0, n = 0; for (const p of pts) if (p[1] >= y0 && p[1] < y1) { r = Math.max(r, Math.hypot(p[0], p[2])); n++; }
    console.log('  y', y0.toFixed(2), '-', y1.toFixed(2), 'max radius', r.toFixed(3), 'pts', n); }
}
