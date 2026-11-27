/* v29.0 · the spool's shape by height: for each 2 mm slice of its height, the slice's width (x and z) */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder } from 'meshoptimizer';
await MeshoptDecoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder });
const doc = await io.read(process.argv[2]);
const pts = [];
for (const n of doc.getRoot().listNodes()) {
  const m = n.getMesh(); if (!m) continue; const W = n.getWorldMatrix();
  for (const p of m.listPrimitives()) { const a = p.getAttribute('POSITION'); const v = [];
    for (let i = 0; i < a.getCount(); i++) { a.getElement(i, v); const [x, y, z] = v;
      pts.push([W[0]*x+W[4]*y+W[8]*z+W[12], W[1]*x+W[5]*y+W[9]*z+W[13], W[2]*x+W[6]*y+W[10]*z+W[14]]); } }
}
let y0 = Infinity, y1 = -Infinity; for (const p of pts) { y0 = Math.min(y0, p[1]); y1 = Math.max(y1, p[1]); }
console.log('points', pts.length, 'y', y0.toFixed(4), y1.toFixed(4));
const S = 0.002;
for (let y = y0; y < y1; y += S) {
  let a = [Infinity, -Infinity, Infinity, -Infinity], c = 0;
  for (const p of pts) if (p[1] >= y && p[1] < y + S) { c++; a = [Math.min(a[0], p[0]), Math.max(a[1], p[0]), Math.min(a[2], p[2]), Math.max(a[3], p[2])]; }
  console.log(y.toFixed(3), c, c ? (a[1]-a[0]).toFixed(3) : '-', c ? (a[3]-a[2]).toFixed(3) : '-', c ? ((a[0]+a[1])/2).toFixed(3) + ',' + ((a[2]+a[3])/2).toFixed(3) : '');
}
