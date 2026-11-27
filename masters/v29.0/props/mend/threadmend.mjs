/* v29.0 · the spool of white thread MENDED as this chapter's own file, at no credits (the old one untouched):
     node masters/v29.0/props/mend/threadmend.mjs assets/w5threadreel.glb assets/w51threadreel.glb
   Chapter 5's spool (w5threadreel) came back from Meshy with its loose end hanging straight down below the ball, so the
   thing stood on the thread's tip and the ball floated about a centimetre off the ground (masters/v28.0/props/RECORD.md).
   Here the hanging strand (every point under YB, measured by measure.mjs: under 7.5 mm only the strand is there, off to
   one side of the ball) is LAID DOWN: each of its points is carried out along the ground away from the ball by as far as
   it hung below YB, and lowered to a thin layer just under the ball's foot; then the whole is set down so its lowest point
   is on y 0. The ball, its paint and every triangle are as they were; the strand's own triangles bend with it. */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { dequantize, clearNodeTransform, meshopt } from '@gltf-transform/functions';
import { MeshoptDecoder, MeshoptEncoder } from 'meshoptimizer';
const [, , IN, OUT] = process.argv;
const YB = Number(process.env.YB || 0.0075), FLAT = 0.15;
await Promise.all([MeshoptDecoder.ready, MeshoptEncoder.ready]);
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder, 'meshopt.encoder': MeshoptEncoder });
const doc = await io.read(IN);
await doc.transform(dequantize());
for (const n of doc.getRoot().listNodes()) if (n.getMesh()) clearNodeTransform(n);
for (const n of doc.getRoot().listNodes()) if (n.getMesh() && n.getParentNode()) throw new Error('a mesh under a parent: bake it first');
const acc = [];
for (const m of doc.getRoot().listMeshes()) for (const p of m.listPrimitives()) acc.push(p.getAttribute('POSITION'));
/* the strand's way out: from the ball's axis (the mean x, z of the points over YB) to the strand's own mean */
let bx = 0, bz = 0, bc = 0, sx = 0, sz = 0, sc = 0; const v = [];
for (const a of acc) for (let i = 0; i < a.getCount(); i++) { a.getElement(i, v);
  if (v[1] >= YB) { bx += v[0]; bz += v[2]; bc++; } else { sx += v[0]; sz += v[2]; sc++; } }
bx /= bc; bz /= bc; sx /= sc; sz /= sc;
let dx = sx - bx, dz = sz - bz; const dl = Math.hypot(dx, dz); dx /= dl; dz /= dl;
console.log('ball axis', bx.toFixed(4), bz.toFixed(4), 'strand', sc, 'points, way out', dx.toFixed(3), dz.toFixed(3));
let ymin = Infinity, moved = 0;
for (const a of acc) for (let i = 0; i < a.getCount(); i++) { a.getElement(i, v);
  if (v[1] < YB) { const d = YB - v[1]; v[0] += dx * d; v[2] += dz * d; v[1] = YB - d * FLAT; a.setElement(i, v); moved++; }
  ymin = Math.min(ymin, v[1]); }
for (const a of acc) for (let i = 0; i < a.getCount(); i++) { a.getElement(i, v); v[1] -= ymin; a.setElement(i, v); }
console.log('laid down', moved, 'points; set down by', (YB - ymin).toFixed(4), '... lowest was', ymin.toFixed(4));
await doc.transform(meshopt({ encoder: MeshoptEncoder, level: 'medium' }));
await io.write(OUT, doc);
