// the Hanuman scan's shape by height: per slice, the vertex count and x/z extents, to find the face for the vision's framing
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { dequantize } from '@gltf-transform/functions';
import { MeshoptDecoder } from 'meshoptimizer';
await MeshoptDecoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder });
const doc = await io.read(process.argv[2]);
await doc.transform(dequantize());
const P = [];
for (const node of doc.getRoot().listNodes()) {
  const mesh = node.getMesh(); if (!mesh) continue;
  const m = node.getWorldMatrix();
  for (const prim of mesh.listPrimitives()) {
    const a = prim.getAttribute('POSITION'); const v = [0, 0, 0];
    for (let i = 0; i < a.getCount(); i++) {
      a.getElement(i, v);
      const x = m[0] * v[0] + m[4] * v[1] + m[8] * v[2] + m[12], y = m[1] * v[0] + m[5] * v[1] + m[9] * v[2] + m[13], z = m[2] * v[0] + m[6] * v[1] + m[10] * v[2] + m[14];
      P.push([x, y, z]);
    }
  }
}
let mn = [1e9, 1e9, 1e9], mx = [-1e9, -1e9, -1e9];
for (const p of P) for (let k = 0; k < 3; k++) { mn[k] = Math.min(mn[k], p[k]); mx[k] = Math.max(mx[k], p[k]); }
console.log('verts', P.length, 'min', mn.map(v => v.toFixed(3)), 'max', mx.map(v => v.toFixed(3)));
const H = mx[1] - mn[1], N = 20;
for (let s = N - 1; s >= 0; s--) {
  const y0 = mn[1] + H * s / N, y1 = y0 + H / N;
  const q = P.filter(p => p[1] >= y0 && p[1] < y1);
  if (!q.length) { console.log(((s + 0.5) / N).toFixed(3), 'empty'); continue; }
  const xs = q.map(p => p[0]), zs = q.map(p => p[2]);
  const cx = xs.reduce((a, b) => a + b, 0) / q.length, cz = zs.reduce((a, b) => a + b, 0) / q.length;
  console.log(((s + 0.5) / N).toFixed(3), 'n', String(q.length).padStart(6), 'x', Math.min(...xs).toFixed(2), Math.max(...xs).toFixed(2), 'cx', cx.toFixed(2), 'z', Math.min(...zs).toFixed(2), Math.max(...zs).toFixed(2), 'cz', cz.toFixed(2));
}
// the face: the forward-most part at head height
for (const [lo, hi, zmin] of [[0.70, 0.86, 0.45], [0.72, 0.84, 0.50], [0.66, 0.80, 0.50]]) {
  const q = P.filter(p => p[1] >= mn[1] + H * lo && p[1] < mn[1] + H * hi && p[2] > zmin);
  const c = [0, 0, 0]; for (const p of q) for (let k = 0; k < 3; k++) c[k] += p[k] / q.length;
  console.log('face band', lo, hi, 'z>', zmin, 'n', q.length, 'centroid', c.map(v => v.toFixed(3)), 'as height frac', (c[1] / H).toFixed(3), (c[0] / H).toFixed(3), (c[2] / H).toFixed(3));
}
