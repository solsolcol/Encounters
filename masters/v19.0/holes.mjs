// v19.0 · the cabin wall's window openings: wall vertices at window height,
// clustered along z — each cluster is one opening's rim (prepped metres)
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { flatten, clearNodeTransform, dedup } from '@gltf-transform/functions';
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
const doc = await io.read(process.argv[2]); const root = doc.getRoot();
await doc.transform(dedup(), flatten());
for (const n of root.listNodes()) clearNodeTransform(n);
const v = [0, 0, 0], zs = [];
let xmin = 9, xmax = -9;
for (const m of root.listMeshes()) for (const p of m.listPrimitives()) {
  if (p.getMaterial().getName() !== 'blinn4') continue;
  const a = p.getAttribute('POSITION');
  for (let i = 0; i < a.getCount(); i++) { a.getElement(i, v); const x = v[0] * 15, y = v[1] * 15, z = v[2] * 15; if (y > 0.72 && y < 1.22 && x > 0.55) { zs.push([z, y, x]); xmin = Math.min(xmin, x); xmax = Math.max(xmax, x); } }
}
zs.sort((a, b) => a[0] - b[0]);
const cl = [];
for (const q of zs) { const c = cl[cl.length - 1]; if (c && q[0] - c.z1 < 0.08) { c.z1 = q[0]; c.n++; c.y0 = Math.min(c.y0, q[1]); c.y1 = Math.max(c.y1, q[1]); } else cl.push({ z0: q[0], z1: q[0], n: 1, y0: q[1], y1: q[1] }); }
console.log('rim x', xmin.toFixed(3), xmax.toFixed(3));
for (const c of cl) console.log(`z ${c.z0.toFixed(3)}..${c.z1.toFixed(3)} mid ${((c.z0 + c.z1) / 2).toFixed(3)} n ${c.n} y ${c.y0.toFixed(2)}..${c.y1.toFixed(2)}`);
