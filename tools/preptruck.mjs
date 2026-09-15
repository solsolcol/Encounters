/* v11.2 — Chad's Sketchfab Kamaz 5330, made shippable for the film pocket
   of episode 2 chapter 3 (the tonner the section rides in).

   The standing rigid recipe (prepbunk.mjs) — metalRough, base colour only,
   JPEG sheets, flatten and bake, weld/dedup/prune, KHR_mesh_quantization
   LAST — with one bake the chapter needs: the file's cab is at +z and the
   bed at −z, and the chapter's truck convention since v11.0 is the cab at
   −z with the open rear at +z (the camera sits at the front of the bed and
   looks out of the back, which is the road unrolling behind). The half turn
   is baked into the vertices (a quantized attribute is an integer array no
   runtime matrix can touch — v9.0's law). The model is not simplified: it
   arrives at 19,620 triangles, which is the price of one man of the cast.

   The output contract, asserted: Y-up, wheels on y = 0, centred on x, the
   BED FLOOR's centre on z = 0, cab at −z, open rear at +z. The numbers the
   chapter seats men and cameras against are PRINTED, never assumed: bed
   floor height, bench seat height, bench inner x, bed inner z span, roof.

   Usage: node tools/preptruck.mjs in.glb out.glb [px=1024]
*/
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS, KHRMeshQuantization } from '@gltf-transform/extensions';
import { weld, quantize, prune, dedup, flatten, clearNodeTransform, metalRough } from '@gltf-transform/functions';
import { MeshoptEncoder, MeshoptDecoder } from 'meshoptimizer';
import sharp from 'sharp';
import fs from 'node:fs';

await MeshoptEncoder.ready; await MeshoptDecoder.ready;
const [inp, outp, pxS = '1024'] = process.argv.slice(2);
const PX = +pxS;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({ 'meshopt.decoder': MeshoptDecoder, 'meshopt.encoder': MeshoptEncoder });
const doc = await io.read(inp);
const root = doc.getRoot();
const before = fs.statSync(inp).size;

await doc.transform(metalRough());
const keep = new Set();
for (const m of root.listMaterials()) {
  const base = m.getBaseColorTexture(); if (base) keep.add(base);
  m.setNormalTexture(null); m.setMetallicRoughnessTexture(null);
  m.setOcclusionTexture(null); m.setEmissiveTexture(null);
  m.setEmissiveFactor([0, 0, 0]); m.setMetallicFactor(0.05); m.setRoughnessFactor(0.8);
  /* the windscreen: the file ships it BLEND; at last light a dark opaque
     pane reads right and costs no sorting */
  m.setAlphaMode('OPAQUE'); m.setDoubleSided(false);
  for (const e of m.listExtensions()) m.setExtension(e.extensionName, null);
}
for (const t of root.listTextures()) if (!keep.has(t)) t.dispose();
for (const e of root.listExtensionsUsed()) if (e.extensionName !== 'KHR_mesh_quantization') e.dispose();

{ const seen = new Set(); for (const node of root.listNodes()) { const m = node.getMesh(); if (!m) continue; if (seen.has(m)) node.setMesh(m.clone()); else seen.add(m); } }
await doc.transform(prune(), flatten());
for (const node of root.listNodes()) clearNodeTransform(node);

const prims = []; for (const mesh of root.listMeshes()) for (const p of mesh.listPrimitives()) prims.push(p);
const matOf = (p) => p.getMaterial()?.getName();
/* the half turn: (x, y, z) -> (-x, y, -z) keeps handedness */
for (const p of prims) {
  for (const sem of ['POSITION', 'NORMAL']) {
    const acc = p.getAttribute(sem); if (!acc) continue;
    const a = acc.getArray(); const n = acc.getCount(); const out = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) { out[i * 3] = -a[i * 3]; out[i * 3 + 1] = a[i * 3 + 1]; out[i * 3 + 2] = -a[i * 3 + 2]; }
    acc.setArray(out).setNormalized(false);
  }
  for (const sem of ['TANGENT', 'TEXCOORD_1', 'TEXCOORD_2', 'COLOR_0']) if (p.getAttribute(sem)) p.setAttribute(sem, null);
}
const bounds = (sel) => {
  let lo = [Infinity, Infinity, Infinity], hi = [-Infinity, -Infinity, -Infinity];
  for (const p of prims) { if (sel && !sel(p)) continue; const a = p.getAttribute('POSITION').getArray(), n = p.getAttribute('POSITION').getCount();
    for (let i = 0; i < n; i++) for (let k = 0; k < 3; k++) { const v = a[i * 3 + k]; if (v < lo[k]) lo[k] = v; if (v > hi[k]) hi[k] = v; } }
  return { lo, hi };
};
/* the bed floor: the widest flat band of the 'material' mesh (bed sides,
   floor and benches), found by histogram rather than assumed */
const yBand = (sel, binW = 0.02) => {
  const h = new Map();
  for (const p of prims) { if (!sel(p)) continue; const a = p.getAttribute('POSITION').getArray(), n = p.getAttribute('POSITION').getCount();
    for (let i = 0; i < n; i++) { const b = Math.round(a[i * 3 + 1] / binW) * binW; const e = h.get(b) || { n: 0, minx: 1e9, maxx: -1e9, minz: 1e9, maxz: -1e9 };
      e.n++; e.minx = Math.min(e.minx, a[i * 3]); e.maxx = Math.max(e.maxx, a[i * 3]); e.minz = Math.min(e.minz, a[i * 3 + 2]); e.maxz = Math.max(e.maxz, a[i * 3 + 2]); h.set(b, e); } }
  return [...h.entries()].sort((a, b) => b[1].n - a[1].n);
};
const isBed = (p) => matOf(p) === 'material';
const all = bounds();
const bedB = bounds(isBed);
const cx = (all.lo[0] + all.hi[0]) / 2, cz = (bedB.lo[2] + bedB.hi[2]) / 2;
for (const p of prims) {
  const acc = p.getAttribute('POSITION'); const a = acc.getArray(); const n = acc.getCount(); const out = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) { out[i * 3] = a[i * 3] - cx; out[i * 3 + 1] = a[i * 3 + 1] - all.lo[1]; out[i * 3 + 2] = a[i * 3 + 2] - cz; }
  acc.setArray(out).setNormalized(false);
}
for (const t of root.listTextures()) {
  const img = t.getImage(); if (!img) continue;
  const out = await sharp(Buffer.from(img)).resize(PX, PX, { fit: 'inside' }).jpeg({ quality: 86 }).toBuffer();
  t.setImage(out).setMimeType('image/jpeg');
  console.log(`  sheet ${t.getName() || ''} -> ${PX}px jpeg ${(out.length / 1024).toFixed(0)} KB`);
}
await doc.transform(weld({ tolerance: 0.0001 }));
/* the contract */
{
  const b = bounds(); const bed = bounds(isBed); const cab = bounds(p => matOf(p) === 'Glasses');
  if (Math.abs(b.lo[1]) > 1e-4) throw new Error('base not on y=0');
  if (cab.hi[2] > 0) throw new Error('cab is not at −z — the half turn went wrong');
  const bands = yBand(isBed);
  const floor = bands.find(([, e]) => e.maxx - e.minx > 2.4 && e.maxz - e.minz > 4);      // full width, full length
  const seat = bands.find(([y, e]) => y > floor[0] + 0.3 && y < floor[0] + 0.7 && e.maxz - e.minz > 4);
  console.log(`${inp.split('/').pop()} -> ${outp.split('/').pop()}`);
  console.log(`  CONTRACT: box x ${b.lo[0].toFixed(2)}..${b.hi[0].toFixed(2)} y 0..${b.hi[1].toFixed(2)} z ${b.lo[2].toFixed(2)}..${b.hi[2].toFixed(2)} (cab −z, rear +z)`);
  console.log(`  BED (material): x ${bed.lo[0].toFixed(2)}..${bed.hi[0].toFixed(2)} y ${bed.lo[1].toFixed(2)}..${bed.hi[1].toFixed(2)} z ${bed.lo[2].toFixed(2)}..${bed.hi[2].toFixed(2)}`);
  console.log(`  FLOOR y ${floor[0].toFixed(2)} (n=${floor[1].n})  SEAT y ${seat ? seat[0].toFixed(2) : '?'} x ${seat ? seat[1].minx.toFixed(2) + '..' + seat[1].maxx.toFixed(2) : ''} z ${seat ? seat[1].minz.toFixed(2) + '..' + seat[1].maxz.toFixed(2) : ''}`);
  const top = bounds(p => matOf(p) === 'Bed_Top');
  console.log(`  CANVAS y ${top.lo[1].toFixed(2)}..${top.hi[1].toFixed(2)} z ${top.lo[2].toFixed(2)}..${top.hi[2].toFixed(2)}`);
}
doc.createExtension(KHRMeshQuantization).setRequired(true);
await doc.transform(prune(), dedup(), quantize({ pattern: /POSITION|NORMAL|TEXCOORD/ }));
await io.write(outp, doc);
const after = fs.statSync(outp).size;
let tris = 0; for (const p of prims) { const idx = p.getIndices(); tris += (idx ? idx.getCount() : p.getAttribute('POSITION').getCount()) / 3; }
console.log(`  ${(before / 1024 / 1024).toFixed(2)} MB -> ${(after / 1024).toFixed(0)} KB, ${Math.round(tris)} tris`);
