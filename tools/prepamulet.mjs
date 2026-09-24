/* v14.7 — Chad's LP Phiboon amulet, made shippable for chapter 3's table, the
   inventory views and the Item Unlocked splash.

   The source (masters/v14.7/src/amulet.glb, 36.9 MB) is one mesh of 957,344
   triangles over a 2048 atlas of small islands (an AI-style scan: colour,
   metal/roughness and a normal map). The recipe is the flashlight's
   (prepflash.mjs) plus a simplifier:

   1. ALL THREE MAPS SHIP. The gold casing, the red cloth behind the glass and
      the bronze monk are told apart by the metal/roughness sheet, and the
      relief reads through the normal map — v11.3's lesson (the torch was a
      black tube until its other two maps came back). Under the strict CSP
      build only the base colour is rescued (rescueTextures), which is the
      offline fallback's known cost.
   2. BAKED to a unit: centred on its own middle, HEIGHT = 1.0 along +y, the
      thin axis on z with the FACE toward +z. Which side is the face is
      MEASURED (the side whose medallion centre carries the most vertices —
      the relief is where the scan's detail is), then confirmed by a render;
      the contract is asserted BEFORE quantization (v13.1).
   3. SIMPLIFIED, never below what the zoom window needs: the relief is in the
      geometry as well as the normal map.

   Shipped as `assets/phiboon.glb` (key `phiboon`), NOT assets/amulet.glb:
   the asset key 'amulet' already belongs to the cased amulet parked in
   chapter 1 (SHOW_AMULET, amulet.glb at the repo root), which is kept.

   Usage: node tools/prepamulet.mjs in.glb out.glb [ratio] [basePx] [otherPx]
   v14.7: node tools/prepamulet.mjs masters/v14.7/src/amulet.glb assets/phiboon.glb 0.03 2048 1024
          -> 1967 KB, 28,720 triangles                                     */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { weld, quantize, prune, dedup, flatten, clearNodeTransform, metalRough, simplify } from '@gltf-transform/functions';
import { MeshoptSimplifier } from 'meshoptimizer';
import sharp from 'sharp';
import fs from 'node:fs';

const [inp, outp, ratioS = '0.10', baseS = '2048', otherS = '1024'] = process.argv.slice(2);
const RATIO = +ratioS, BASE_PX = +baseS, OTHER_PX = +otherS;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
const doc = await io.read(inp);
const root = doc.getRoot();
const before = fs.statSync(inp).size;

await doc.transform(metalRough(), prune(), flatten());
for (const node of root.listNodes()) clearNodeTransform(node);
for (const node of root.listNodes()) {
  const m = node.getMatrix();
  const id = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
  if (m.some((v, i) => Math.abs(v - id[i]) > 1e-6)) throw new Error('a node transform survived the bake');
}

const prims = [];
for (const mesh of root.listMeshes()) for (const p of mesh.listPrimitives()) prims.push(p);

/* the box, and which z side is the FACE: the relief side's depth varies more */
let lo = [Infinity, Infinity, Infinity], hi = [-Infinity, -Infinity, -Infinity];
for (const p of prims) {
  const a = p.getAttribute('POSITION').getArray(), n = p.getAttribute('POSITION').getCount();
  for (let i = 0; i < n; i++) for (let k = 0; k < 3; k++) {
    const v = a[i * 3 + k]; if (v < lo[k]) lo[k] = v; if (v > hi[k]) hi[k] = v;
  }
}
const span = [hi[0] - lo[0], hi[1] - lo[1], hi[2] - lo[2]];
const c = [(lo[0] + hi[0]) / 2, (lo[1] + hi[1]) / 2, (lo[2] + hi[2]) / 2];
if (!(span[1] > span[0] && span[1] > span[2])) throw new Error('expected the height on y, got span ' + span.map(v => v.toFixed(3)));
if (!(span[2] < span[0] * 0.5)) throw new Error('expected the thin axis on z, got span ' + span.map(v => v.toFixed(3)));
/* which z face carries the relief: of the vertices in the middle of the
   medallion (away from the rim), the side with the larger depth variance */
const zs = { pos: [], neg: [] };
for (const p of prims) {
  const a = p.getAttribute('POSITION').getArray(), n = p.getAttribute('POSITION').getCount();
  for (let i = 0; i < n; i++) {
    const x = a[i * 3] - c[0], y = a[i * 3 + 1] - c[1], z = a[i * 3 + 2] - c[2];
    if (Math.abs(x) > span[0] * 0.25 || Math.abs(y) > span[1] * 0.25) continue;
    (z >= 0 ? zs.pos : zs.neg).push(Math.abs(z));
  }
}
const sd = (xs) => { const m = xs.reduce((s, x) => s + x, 0) / Math.max(1, xs.length); return Math.sqrt(xs.reduce((s, x) => s + (x - m) * (x - m), 0) / Math.max(1, xs.length)); };
/* the relief side carries the DETAIL: measured on the source, the +z half of
   the medallion's centre holds 122,775 vertices against 24,240 at -z, while
   the depth spreads are within 0.0001 of each other — spread alone picked the
   back by a hair. The vertex count decides; the spread is printed as a check. */
const facePos = zs.pos.length >= zs.neg.length;
const FACE_OVERRIDE = process.env.FACE;               // 'pos' | 'neg', set only if a render disagrees
const faceAtPos = FACE_OVERRIDE ? FACE_OVERRIDE === 'pos' : facePos;
console.log(`  box ${span.map(v => v.toFixed(3))}; centre depth spread +z ${sd(zs.pos).toFixed(4)} (${zs.pos.length}) / -z ${sd(zs.neg).toFixed(4)} (${zs.neg.length}) -> face at ${faceAtPos ? '+' : '-'}z${FACE_OVERRIDE ? ' (FACE override)' : ''}`);

/* bake: centre, height 1.0, face to +z (a half turn about y when it is at -z) */
const s = 1 / span[1];
const turn = !faceAtPos;
for (const p of prims) {
  for (const sem of ['POSITION', 'NORMAL']) {
    const acc = p.getAttribute(sem); if (!acc) continue;
    const a = acc.getArray(), n = acc.getCount(), out = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      let x = a[i * 3], y = a[i * 3 + 1], z = a[i * 3 + 2];
      if (sem === 'POSITION') { x = (x - c[0]) * s; y = (y - c[1]) * s; z = (z - c[2]) * s; }
      if (turn) { x = -x; z = -z; }                    // a rotation, so handedness is kept
      out[i * 3] = x; out[i * 3 + 1] = y; out[i * 3 + 2] = z;
    }
    acc.setArray(out).setNormalized(false);
  }
  for (const sem of ['TANGENT', 'TEXCOORD_1', 'TEXCOORD_2', 'COLOR_0']) if (p.getAttribute(sem)) p.setAttribute(sem, null);
}

/* the maps: colour at BASE_PX, the other two at OTHER_PX, all JPEG */
const mat = root.listMaterials()[0];
const baseT = mat.getBaseColorTexture(), mrT = mat.getMetallicRoughnessTexture(), nT = mat.getNormalTexture();
for (const t of root.listTextures()) {
  const px = t === baseT ? BASE_PX : OTHER_PX;
  const buf = await sharp(Buffer.from(t.getImage())).resize(px, px, { fit: 'fill' }).jpeg({ quality: t === baseT ? 84 : 88 }).toBuffer();
  t.setImage(buf).setMimeType('image/jpeg');
}
mat.setOcclusionTexture(null);
mat.setAlphaMode('OPAQUE');
mat.setDoubleSided(false);
console.log(`  maps: base ${!!baseT}, metal/rough ${!!mrT}, normal ${!!nT}`);

await doc.transform(weld(), dedup(), prune());
await MeshoptSimplifier.ready;
if (RATIO < 1) await doc.transform(simplify({ simplifier: MeshoptSimplifier, ratio: RATIO, error: 0.0015 }));

/* the contract, BEFORE quantization (v13.1) */
{
  let l2 = [1e9, 1e9, 1e9], h2 = [-1e9, -1e9, -1e9];
  for (const p of prims) {
    const acc = p.getAttribute('POSITION'); const v = [0, 0, 0];
    for (let i = 0; i < acc.getCount(); i++) { acc.getElement(i, v); for (let k = 0; k < 3; k++) { if (v[k] < l2[k]) l2[k] = v[k]; if (v[k] > h2[k]) h2[k] = v[k]; } }
  }
  const hgt = h2[1] - l2[1];
  if (Math.abs(hgt - 1) > 0.02) throw new Error('height is not 1.0: ' + hgt);
  if (Math.abs((l2[1] + h2[1]) / 2) > 0.02) throw new Error('not centred on y');
  console.log(`  baked box ${l2.map(v => v.toFixed(3))} .. ${h2.map(v => v.toFixed(3))}`);
}
await doc.transform(prune(), quantize({ quantizePosition: 14, quantizeNormal: 10, quantizeTexcoord: 14 }));
await io.write(outp, doc);
let tris = 0;
const d2 = await io.read(outp);
for (const mesh of d2.getRoot().listMeshes()) for (const p of mesh.listPrimitives()) tris += (p.getIndices() ? p.getIndices().getCount() : p.getAttribute('POSITION').getCount()) / 3;
console.log(`  ${(before / 1024).toFixed(0)} KB -> ${(fs.statSync(outp).size / 1024).toFixed(0)} KB, ${tris} tris`);
