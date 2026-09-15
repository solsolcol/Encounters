/* v11.1 — Chad's Sketchfab flashlight, made shippable as the torch VIEWMODEL.

   The standing recipe (prepbunk.mjs): base colour only, JPEG sheet, weld,
   prune, dedup, KHR_mesh_quantization last. Two things this one needs:

   1. THE LENS END IS MEASURED, not assumed. The file's length runs along y
      (36 units); the head of a torch is the wider end, so the end whose
      vertices sit furthest from the axis is the lens. That end is baked to
      face −z, which is "forward" in the viewmodel camera's frame, so the
      engine can hang the prop off the hands root with no runtime rotation.
   2. THE SCALE IS BAKED to a hand torch's real length (`LEN_M`), centred on
      its own middle, so the pivot the engine holds is the grip.

   Usage: node tools/prepflash.mjs in.glb out.glb [texPx] [lenM] */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { weld, quantize, prune, dedup, flatten, clearNodeTransform, metalRough } from '@gltf-transform/functions';
import sharp from 'sharp';
import fs from 'node:fs';

const [inp, outp, texS = '512', lenS = '0.21'] = process.argv.slice(2);
const TEX_PX = +texS, LEN_M = +lenS;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
const doc = await io.read(inp);
const root = doc.getRoot();
const before = fs.statSync(inp).size;

await doc.transform(metalRough());
/* v11.3 (Chad: "why is the flashlight texture missing?"): it was never in
   the base colour. Measured, the file's base sheet averages 33/255 — a
   black metal torch — and everything that makes it READ as one is in the
   other two maps: the metal/roughness sheet (knurling on the grip, the
   bright rings, the matte rubber, mean R 237 G 165 B 89) and the emissive
   sheet (the lens, factor 0.75). v11.1's prep dropped both and set the
   metal to 0.15, which is a dark plastic tube. Both maps ship now (JPEG
   at the same size), the factors are the file's, and the engine turns up
   the environment on this one material so the metal has something to
   reflect (v8.9's law). The normal and occlusion maps still go. */
const keep = new Set();
for (const m of root.listMaterials()) {
  for (const t of [m.getBaseColorTexture(), m.getMetallicRoughnessTexture(), m.getEmissiveTexture()]) if (t) keep.add(t);
  m.setNormalTexture(null); m.setOcclusionTexture(null);
  if (!m.getMetallicRoughnessTexture()) { m.setMetallicFactor(0.15); m.setRoughnessFactor(0.62); }
  m.setAlphaMode('OPAQUE'); m.setDoubleSided(false);
}
for (const t of root.listTextures()) if (!keep.has(t)) t.dispose();
await doc.transform(prune(), flatten());
for (const node of root.listNodes()) clearNodeTransform(node);

const prims = [];
for (const mesh of root.listMeshes()) for (const p of mesh.listPrimitives()) prims.push(p);

/* which end is the lens: mean radial distance of the outermost eighth */
let lo = [Infinity, Infinity, Infinity], hi = [-Infinity, -Infinity, -Infinity];
const all = [];
for (const p of prims) {
  const a = p.getAttribute('POSITION').getArray(), n = p.getAttribute('POSITION').getCount();
  for (let i = 0; i < n; i++) { const v = [a[i * 3], a[i * 3 + 1], a[i * 3 + 2]]; all.push(v); for (let k = 0; k < 3; k++) { if (v[k] < lo[k]) lo[k] = v[k]; if (v[k] > hi[k]) hi[k] = v[k]; } }
}
const span = [hi[0] - lo[0], hi[1] - lo[1], hi[2] - lo[2]];
const L = span.indexOf(Math.max(...span));                    // the long axis
const A = [0, 1, 2].filter(k => k !== L);
const cx = (lo[0] + hi[0]) / 2, cy = (lo[1] + hi[1]) / 2, cz = (lo[2] + hi[2]) / 2, c = [cx, cy, cz];
const radial = (v) => Math.hypot(v[A[0]] - c[A[0]], v[A[1]] - c[A[1]]);
const eighth = span[L] / 8;
const rHi = all.filter(v => v[L] > hi[L] - eighth).map(radial), rLo = all.filter(v => v[L] < lo[L] + eighth).map(radial);
const mean = (xs) => xs.reduce((s, x) => s + x, 0) / Math.max(1, xs.length);
const lensAtHi = mean(rHi) > mean(rLo);
console.log(`  long axis ${'xyz'[L]} (${span[L].toFixed(2)}), head radius hi ${mean(rHi).toFixed(2)} / lo ${mean(rLo).toFixed(2)} -> lens at ${lensAtHi ? '+' : '-'}${'xyz'[L]}`);

/* bake: centre, scale to LEN_M, long axis onto -z with the lens forward */
const s = LEN_M / span[L];
const map = (v) => {
  const d = [(v[0] - cx) * s, (v[1] - cy) * s, (v[2] - cz) * s];
  const along = d[L] * (lensAtHi ? -1 : 1);                   // lens -> negative
  const o = [d[A[0]], d[A[1]]];                               // the two cross axes
  return [o[0], o[1], along];
};
const mapN = (v) => { const along = v[L] * (lensAtHi ? -1 : 1); return [v[A[0]], v[A[1]], along]; };
/* keep handedness: if the axis permutation flips it, mirror one cross axis */
const perm = [A[0], A[1], L]; const det = ((perm[0] === 0 && perm[1] === 1) || (perm[0] === 1 && perm[1] === 2) || (perm[0] === 2 && perm[1] === 0)) ? 1 : -1;
const flip = det * (lensAtHi ? -1 : 1) < 0;
for (const p of prims) {
  for (const [sem, fn] of [['POSITION', map], ['NORMAL', mapN]]) {
    const acc = p.getAttribute(sem); if (!acc) continue;
    const a = acc.getArray(), n = acc.getCount(), out = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) { const v = fn([a[i * 3], a[i * 3 + 1], a[i * 3 + 2]]); if (flip) v[0] = -v[0]; out[i * 3] = v[0]; out[i * 3 + 1] = v[1]; out[i * 3 + 2] = v[2]; }
    acc.setArray(out).setNormalized(false);
  }
  if (flip) { const idx = p.getIndices(); if (idx) { const a = idx.getArray(); for (let i = 0; i + 2 < a.length; i += 3) { const t = a[i + 1]; a[i + 1] = a[i + 2]; a[i + 2] = t; } idx.setArray(a); } }
  for (const sem of ['TANGENT', 'TEXCOORD_1', 'TEXCOORD_2', 'COLOR_0']) if (p.getAttribute(sem)) p.setAttribute(sem, null);
}
for (const t of root.listTextures()) {
  const buf = await sharp(Buffer.from(t.getImage())).resize(TEX_PX, TEX_PX, { fit: 'fill' }).jpeg({ quality: 86 }).toBuffer();
  t.setImage(buf).setMimeType('image/jpeg');
}
await doc.transform(weld(), dedup(), prune(), quantize({ quantizePosition: 14, quantizeNormal: 10, quantizeTexcoord: 12 }));
await io.write(outp, doc);
/* report the baked box */
let lo2 = [1e9, 1e9, 1e9], hi2 = [-1e9, -1e9, -1e9]; let tris = 0;
const d2 = await io.read(outp);
for (const mesh of d2.getRoot().listMeshes()) for (const p of mesh.listPrimitives()) {
  const acc = p.getAttribute('POSITION'), n = acc.getCount(); const v = [0, 0, 0];
  for (let i = 0; i < n; i++) { acc.getElement(i, v); for (let k = 0; k < 3; k++) { if (v[k] < lo2[k]) lo2[k] = v[k]; if (v[k] > hi2[k]) hi2[k] = v[k]; } }
  tris += (p.getIndices() ? p.getIndices().getCount() : n) / 3;
}
console.log(`  ${(before / 1024).toFixed(0)} KB -> ${(fs.statSync(outp).size / 1024).toFixed(0)} KB, ${tris} tris, box ${lo2.map(v => v.toFixed(3))} .. ${hi2.map(v => v.toFixed(3))}`);
