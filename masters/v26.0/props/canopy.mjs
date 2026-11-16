/* v26.18 · the hall's canopy (D3): its bead FRINGE hung as a sheet under the model's own drum.
     node masters/v26.0/props/canopy.mjs <the prepped model> <refs/hcanopy-fringe.png> <out.glb>
   (run after `sh masters/v26.0/props/prop.sh hcanopy2`, on assets/w3hcanopy.glb, in place)

   WHY. Meshy models the canopy's fringe bead by bead: of its model's 636,000 vertices 575,000 are the fringe, and no
   remesh holds that (at 12,000 triangles, at 8,000 quads and at 60,000 triangles it is a band of shards: photographed,
   16 Nov 2026). Its quad remesh's DRUM is clean: the gathered gold cloth, the embroidered band, the scalloped braid and
   the maroon lining inside. So the drum is the generator's, and the fringe is what a curtain of beads is, a sheet with
   holes: a ring of two-sided card carrying a piece of the canopy's own reference picture (crops_hallin.py --fringe).

   WHAT IT DOES, in the model's own metres (prepmeshy has sized it and stood its lowest point on y 0):
   1. the fringe's shards are taken out: every triangle whose middle is under CUT and whose paint is the fringe's
      (silver-grey or pale blue: read from the model's own colour sheet at its corners and its middle). The maroon
      lining and the gold cloth are told from it by colour and are kept whole, wherever they are;
   2. a ring is hung where the fringe was: from TOP (tucked 2 cm up behind the scalloped braid) down to y 0, 4 mm
      inside the drum's outer face and outside the lining (both measured, and the room between them asserted);
   3. the ring is a second primitive with a material of its own: the fringe sheet, cut out by alpha (MASK, no sorting),
      two-sided, a non-metal (silver beads with nothing to reflect draw near black as a metal: v24.29).
   The file is then packed as prepmeshy packs it. */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { dequantize, flatten, clearNodeTransform, prune, meshopt } from '@gltf-transform/functions';
import { MeshoptEncoder, MeshoptDecoder } from 'meshoptimizer';
import sharp from 'sharp';
import fs from 'node:fs';

const [, , IN, SHEET, OUT] = process.argv;
if (!IN || !SHEET || !OUT) throw new Error('usage: canopy.mjs <prepped model> <fringe sheet> <out>');
const CUT = Number(process.env.CUT || 0.200);     // under this (metres) a fringe-coloured triangle is a shard
const TOP = Number(process.env.TOP || 0.220);     // the ring's top edge: behind the braid's scallops
const SEG = 96, REPEAT = 5;                       // the sheet is 0.87 m of fringe: five times round 4.2 m
await Promise.all([MeshoptEncoder.ready, MeshoptDecoder.ready]);
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder, 'meshopt.encoder': MeshoptEncoder });
const doc = await io.read(IN); const root = doc.getRoot();
if (root.listMaterials().length !== 1) throw new Error('this model already has ' + root.listMaterials().length + ' materials: is its fringe hung already?');
await doc.transform(dequantize(), flatten());
for (const n of root.listNodes()) clearNodeTransform(n);
const prims = root.listMeshes().flatMap(m => m.listPrimitives());
if (prims.length !== 1) throw new Error('one primitive expected, got ' + prims.length);
const prim = prims[0], mat = prim.getMaterial();
const P = prim.getAttribute('POSITION').getArray(), UV = prim.getAttribute('TEXCOORD_0').getArray(), IX = prim.getIndices().getArray();

// the model's own colour sheet, for telling fringe from lining and cloth
const { data: C, info } = await sharp(Buffer.from(mat.getBaseColorTexture().getImage())).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const kind = (u, v) => {            // 'f' fringe (silver bead or blue drop), 'k' anything else
  const x = Math.min(info.width - 1, Math.max(0, Math.floor(u * info.width))), y = Math.min(info.height - 1, Math.max(0, Math.floor(v * info.height)));
  const i = (y * info.width + x) * 3, r = C[i], g = C[i + 1], b = C[i + 2], mx = Math.max(r, g, b), mn = Math.min(r, g, b), sat = mx ? (mx - mn) / mx : 0;
  if (sat < 0.20 && mx > 70) return 'f';                          // silver-grey
  if (b > r + 18 && b >= g - 12 && mx > 90) return 'f';           // pale blue
  return 'k';
};
let lo = Infinity, hi = -Infinity; for (let i = 1; i < P.length; i += 3) { lo = Math.min(lo, P[i]); hi = Math.max(hi, P[i]); }
if (Math.abs(lo) > 2e-3) throw new Error('not on y = 0: ' + lo);
const keep = []; let dropped = 0, rOuter = 0, rLining = 0;
for (let t = 0; t < IX.length; t += 3) {
  const a = IX[t], b = IX[t + 1], c = IX[t + 2];
  const cy = (P[a * 3 + 1] + P[b * 3 + 1] + P[c * 3 + 1]) / 3;
  const cu = (UV[a * 2] + UV[b * 2] + UV[c * 2]) / 3, cv = (UV[a * 2 + 1] + UV[b * 2 + 1] + UV[c * 2 + 1]) / 3;
  const votes = [kind(UV[a * 2], UV[a * 2 + 1]), kind(UV[b * 2], UV[b * 2 + 1]), kind(UV[c * 2], UV[c * 2 + 1]), kind(cu, cv)].filter(k => k === 'f').length;
  const rad = Math.max(Math.hypot(P[a * 3], P[a * 3 + 2]), Math.hypot(P[b * 3], P[b * 3 + 2]), Math.hypot(P[c * 3], P[c * 3 + 2]));
  if (cy < CUT && votes >= 2) { dropped++; continue; }
  keep.push(a, b, c);
  if (cy > TOP + 0.02 && cy < TOP + 0.10) rOuter = Math.max(rOuter, rad);     // the drum's outer face just over the scallops
  if (cy < CUT - 0.03) rLining = Math.max(rLining, rad);                       // what is left under the cut is lining
}
const R = rOuter - 0.004;
console.log(`canopy: ${dropped} fringe triangles out of ${IX.length / 3}; the drum's outer face ${rOuter.toFixed(3)} m, the lining ${rLining.toFixed(3)} m, the ring at ${R.toFixed(3)} m from y 0 to ${TOP}`);
if (!(R > rLining + 0.002)) throw new Error('no room for the ring between the lining and the drum');
if (dropped < IX.length / 3 * 0.2) throw new Error('fewer than a fifth of the triangles were fringe: is this the canopy?');
prim.setIndices(doc.createAccessor().setType('SCALAR').setArray(new Uint32Array(keep)));

// the ring
const rp = new Float32Array((SEG + 1) * 2 * 3), rn = new Float32Array((SEG + 1) * 2 * 3), ru = new Float32Array((SEG + 1) * 2 * 2), ri = new Uint32Array(SEG * 6);
for (let s = 0; s <= SEG; s++) {
  const a = s / SEG * Math.PI * 2, x = Math.sin(a), z = Math.cos(a);
  for (let k = 0; k < 2; k++) { const j = s * 2 + k; rp.set([x * R, k ? 0 : TOP, z * R], j * 3); rn.set([x, 0, z], j * 3); ru.set([s / SEG * REPEAT, k ? 1 : 0], j * 2); }
  if (s < SEG) { const j = s * 2; ri.set([j, j + 1, j + 2, j + 2, j + 1, j + 3], s * 6); }
}
const buf = root.listBuffers()[0];
const tex = doc.createTexture('fringe').setImage(fs.readFileSync(SHEET)).setMimeType('image/png');
const fm = doc.createMaterial('fringe').setBaseColorTexture(tex).setAlphaMode('MASK').setAlphaCutoff(0.5).setDoubleSided(true).setMetallicFactor(0).setRoughnessFactor(0.45);
const ring = doc.createPrimitive().setMaterial(fm)
  .setAttribute('POSITION', doc.createAccessor().setType('VEC3').setArray(rp).setBuffer(buf))
  .setAttribute('NORMAL', doc.createAccessor().setType('VEC3').setArray(rn).setBuffer(buf))
  .setAttribute('TEXCOORD_0', doc.createAccessor().setType('VEC2').setArray(ru).setBuffer(buf))
  .setIndices(doc.createAccessor().setType('SCALAR').setArray(ri).setBuffer(buf));
root.listMeshes()[0].addPrimitive(ring);
await doc.transform(prune({ keepAttributes: true }), meshopt({ encoder: MeshoptEncoder, level: 'medium' }));
await io.write(OUT, doc);
const tris = root.listMeshes().flatMap(m => m.listPrimitives()).reduce((n, p) => n + p.getIndices().getCount() / 3, 0);
console.log(`canopy ${OUT.split('/').pop()}: ${tris} triangles (the ring ${SEG * 2}), ${(fs.statSync(OUT).size / 1024).toFixed(0)} KB`);
