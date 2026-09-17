/* v12.1 — Chad's ghost cyclist (a soldier on a bicycle, one baked mesh),
   made shippable.

   Two things make this model different from every other one prepped here,
   and both save more than any simplifier could:

   1. IT IS ONLY EVER A GHOST. `ghostify()` replaces the material's colour,
      emissive and opacity wholesale, so the file's two sheets — a 2048px
      base and a 4096px metallic-roughness, 14 MB of the source's 35 — are
      paid for and then overwritten. They go. What is left is a silhouette
      and its shading, which is all a pale figure at the edge of a torch
      beam has ever been.
   2. IT HAS NO RIG AND NO CLIPS (measured: 0 bones, 0 animations). It is a
      statue of a rider, and that is exactly the beat the chapter wants — a
      rider who does not pedal is more wrong than one who does (the plan's
      §11). Nothing here tries to animate it.

   Everything else is the standing recipe: weld, simplify, prune, dedup,
   KHR_mesh_quantization last (v5.16 — the one compression three.js reads
   with no decoder and no blob).

   The output contract, asserted on the BAKED file (v6.17's law):
   Y-up, wheels on y = 0, centred on x and z, and THE RIDER FACING -Z,
   which is the direction three.js calls forward, so a chapter aims him
   with a plain rotation.y and no sign to remember.

   Usage: node tools/prepcyclist.mjs in.glb out.glb [ratio]
*/
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS, KHRMeshQuantization } from '@gltf-transform/extensions';
import { weld, simplifyPrimitive, quantize, prune, dedup, flatten, clearNodeTransform, metalRough } from '@gltf-transform/functions';
import { MeshoptSimplifier, MeshoptEncoder, MeshoptDecoder } from 'meshoptimizer';
import fs from 'node:fs';

await MeshoptSimplifier.ready; await MeshoptEncoder.ready; await MeshoptDecoder.ready;
const [inp, outp, ratioS = '0.08', errS = '0.02'] = process.argv.slice(2);
const RATIO = +ratioS, ERROR = +errS;

const io = new NodeIO().registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({ 'meshopt.decoder': MeshoptDecoder, 'meshopt.encoder': MeshoptEncoder });
const doc = await io.read(inp);
const root = doc.getRoot();
const before = fs.statSync(inp).size;

await doc.transform(metalRough());

/* 1 — every sheet goes, and the material becomes a plain surface the ghost
   treatment can own. Metalness 1 with no environment renders near black
   (v8.9's law); this is cloth, webbing and painted steel, so it is not
   metal at all. */
for (const m of root.listMaterials()) {
  m.setBaseColorTexture(null); m.setNormalTexture(null); m.setMetallicRoughnessTexture(null);
  m.setOcclusionTexture(null); m.setEmissiveTexture(null);
  m.setBaseColorFactor([0.72, 0.73, 0.76, 1]);
  m.setEmissiveFactor([0, 0, 0]); m.setMetallicFactor(0.0); m.setRoughnessFactor(0.85);
  m.setAlphaMode('OPAQUE'); m.setDoubleSided(false);
}
for (const t of root.listTextures()) t.dispose();

/* 2a — the UVs go with the sheets. They are dead weight once no texture
   reads them, and worse: meshopt will not collapse an edge across an
   attribute seam, so a UV border the eye can no longer see still acts as a
   wall to the simplifier. Measured on this file — with TEXCOORD_0 left in,
   ratio 0.08 and ratio 0.04 both floored at 57.5k triangles, the same
   number, which is the tell that the ratio is not what is binding. */
for (const m of root.listMeshes()) for (const p of m.listPrimitives()) {
  for (const name of p.listSemantics()) if (/^TEXCOORD_|^COLOR_|^TANGENT/.test(name)) p.setAttribute(name, null);
}

/* 2 — bake every node transform down, so the vertices are the model */
await doc.transform(flatten());
for (const node of root.listNodes()) if (node.getMesh()) clearNodeTransform(node);

const prims = root.listMeshes().flatMap(m => m.listPrimitives());
const triCount = () => prims.reduce((s, p) => s + (p.getIndices() ? p.getIndices().getCount() : p.getAttribute('POSITION').getCount()) / 3, 0);
console.log(`in: ${(before / 1024).toFixed(0)} KB, ${Math.round(triCount())} tris, ${prims.length} primitive(s)`);

/* 3 — WHICH WAY HE FACES. The render is the authority and these two
   measures are the GUARD, which is the order v6.17 paid for: the first pass
   of this tool reasoned its way to a sign ("a rider leans over the bars, so
   the helmet is forward of centre") and got BOTH measures backwards, and
   because both were backwards they agreed with each other and the tool was
   sure. Photographed on its own (tools/shootmodel.mjs, the deg-0 shot shows
   his face), this file's rider faces +z, and the real geometry is:

     · the HELMET sits BEHIND the bicycle's midpoint — an upright military
       roadster seats the man over the rear wheel, not over the bars
       (measured: 18 mm behind, a small margin, so it is a tie-breaker and
       never the answer on its own);
     · the outer eighth at the REAR is the TALLER one — the luggage rack and
       its mudguard stand higher than the front mudguard (measured: 83 mm).

   Both must point the same way, and both must say the front is +z, or this
   is not the file that was photographed and somebody has to look again. */
function bounds() {
  let l = [Infinity, Infinity, Infinity], h = [-Infinity, -Infinity, -Infinity];
  for (const p of prims) {
    const a = p.getAttribute('POSITION').getArray(), n = p.getAttribute('POSITION').getCount();
    for (let i = 0; i < n; i++) for (let k = 0; k < 3; k++) {
      const v = a[i * 3 + k]; if (v < l[k]) l[k] = v; if (v > h[k]) h[k] = v;
    }
  }
  return { l, h };
}
{
  const { l, h } = bounds();
  const yCut = h[1] - (h[1] - l[1]) * 0.04;
  let sz = 0, n = 0, endLo = -Infinity, endHi = -Infinity;
  const zLo = l[2] + (h[2] - l[2]) * 0.125, zHi = h[2] - (h[2] - l[2]) * 0.125;
  for (const p of prims) {
    const a = p.getAttribute('POSITION').getArray(), c = p.getAttribute('POSITION').getCount();
    for (let i = 0; i < c; i++) {
      const y = a[i * 3 + 1], z = a[i * 3 + 2];
      if (y >= yCut) { sz += z; n++; }
      if (z <= zLo) endLo = Math.max(endLo, y);
      if (z >= zHi) endHi = Math.max(endHi, y);
    }
  }
  const midZ = (l[2] + h[2]) / 2, helmetZ = sz / n;
  const helmetFront = helmetZ < midZ ? '+z' : '-z';   // the helmet is at the REAR
  const endFront = endLo > endHi ? '+z' : '-z';       // the taller end is the REAR
  console.log(`  facing: helmet mean z ${helmetZ.toFixed(3)} vs mid ${midZ.toFixed(3)} -> front ${helmetFront}; ` +
              `end heights lo-z ${endLo.toFixed(3)} / hi-z ${endHi.toFixed(3)} -> front ${endFront}`);
  if (helmetFront !== endFront) throw new Error('the two facing measures disagree — photograph the model before going on');
  if (helmetFront !== '+z') throw new Error('this file does not face +z as the photographed one did — look at it again');
  /* he faces +z and the shipped contract is -z, so the half turn is baked */
  for (const p of prims) {
    const pos = p.getAttribute('POSITION'), a = pos.getArray().slice();
    for (let i = 0; i < pos.getCount(); i++) { a[i * 3] = -a[i * 3]; a[i * 3 + 2] = -a[i * 3 + 2]; }
    pos.setArray(a);
    const nrm = p.getAttribute('NORMAL');
    if (nrm) { const b = nrm.getArray().slice(); for (let i = 0; i < nrm.getCount(); i++) { b[i * 3] = -b[i * 3]; b[i * 3 + 2] = -b[i * 3 + 2]; } nrm.setArray(b); }
  }
  console.log('  baked a half turn about y: he faces -z now');
}

/* 4 — DROP THE NORMALS, weld, simplify, and put smooth normals back by
   hand. This is v8.0's law in its other form: meshopt will not collapse an
   edge across an attribute seam, and a scan's hard-edge normals make nearly
   every shared vertex a seam. Measured on this file:

     with the file's normals   weld 440,292 -> 440,234 verts   floor 52,532 tris
     normals dropped           weld 440,292 -> 297,042 verts   29,714 at ratio 0.05

   297,042 is 594,730 / 2, which is what a closed manifold welds to, so the
   second number is the mesh actually being welded and the first was 58
   vertices of luck. Ratios 0.08, 0.05 and 0.03 all floored at ~52.6k before
   this, which is the tell: when three ratios give one number, the ratio is
   not what is binding.

   The normals go back area-weighted and smooth (deflatten.mjs's fifteen
   lines — gltf-transform's `normals()` UNWELDS and writes per-face normals,
   undoing the whole point). */
await doc.transform(weld({ tolerance: 0.0001 }));
for (const p of prims) p.setAttribute('NORMAL', null);
await doc.transform(weld({ tolerance: 0.0001 }));
console.log(`  weld without normals: ${prims[0].getAttribute('POSITION').getCount()} verts`);
if (RATIO < 1) {
  const was = triCount();
  for (const p of prims) simplifyPrimitive(p, { simplifier: MeshoptSimplifier, ratio: RATIO, error: ERROR });
  console.log(`  simplify ${Math.round(was)} -> ${Math.round(triCount())} tris (ratio ${RATIO}, error ${ERROR})`);
}
for (const p of prims) {
  const posA = p.getAttribute('POSITION'), idxA = p.getIndices();
  if (!posA || !idxA) continue;
  const pos = posA.getArray(), idx = idxA.getArray(), n = posA.getCount();
  const nr = new Float32Array(n * 3);
  for (let t = 0; t + 2 < idx.length; t += 3) {
    const a = idx[t] * 3, b = idx[t + 1] * 3, c = idx[t + 2] * 3;
    const ux = pos[b] - pos[a], uy = pos[b + 1] - pos[a + 1], uz = pos[b + 2] - pos[a + 2];
    const vx = pos[c] - pos[a], vy = pos[c + 1] - pos[a + 1], vz = pos[c + 2] - pos[a + 2];
    const cx = uy * vz - uz * vy, cy = uz * vx - ux * vz, cz = ux * vy - uy * vx;
    nr[a] += cx; nr[a + 1] += cy; nr[a + 2] += cz;
    nr[b] += cx; nr[b + 1] += cy; nr[b + 2] += cz;
    nr[c] += cx; nr[c + 1] += cy; nr[c + 2] += cz;
  }
  for (let i = 0; i < n; i++) {
    const L = Math.hypot(nr[i * 3], nr[i * 3 + 1], nr[i * 3 + 2]) || 1;
    nr[i * 3] /= L; nr[i * 3 + 1] /= L; nr[i * 3 + 2] /= L;
  }
  p.setAttribute('NORMAL', doc.createAccessor().setType('VEC3').setArray(nr).setBuffer(root.listBuffers()[0]));
}

/* 5 — wheels on the floor, centred on x and z */
{
  const b = bounds(); const dx = -(b.l[0] + b.h[0]) / 2, dy = -b.l[1], dz = -(b.l[2] + b.h[2]) / 2;
  for (const p of prims) {
    const pos = p.getAttribute('POSITION'), a = pos.getArray().slice();
    for (let i = 0; i < pos.getCount(); i++) { a[i * 3] += dx; a[i * 3 + 1] += dy; a[i * 3 + 2] += dz; }
    pos.setArray(a);
  }
}

await doc.transform(dedup(), prune());

/* 6 — the contract, asserted on the baked vertices and BEFORE quantization.
   `quantize()` rewrites POSITION as an integer array and puts the inverse
   scale on the node, so the same read after it answers -27095 and means
   nothing (paid for once). */
{
  const b = bounds();
  const size = [b.h[0] - b.l[0], b.h[1] - b.l[1], b.h[2] - b.l[2]];
  if (Math.abs(b.l[1]) > 2e-3) throw new Error(`wheels at y ${b.l[1].toFixed(4)}, not 0`);
  if (Math.abs(b.l[0] + b.h[0]) > 4e-3 || Math.abs(b.l[2] + b.h[2]) > 4e-3) throw new Error('not centred on x/z');
  if (size[2] < size[0]) throw new Error(`length ${size[2].toFixed(2)} is not on z`);
  console.log(`  size ${size.map(v => v.toFixed(3)).join(' x ')} (w x h x len)`);
}

doc.createExtension(KHRMeshQuantization).setRequired(true);
await doc.transform(quantize({ quantizePosition: 14, quantizeNormal: 10, quantizeTexcoord: 12 }));
await io.write(outp, doc);
const after = fs.statSync(outp).size;
console.log(`out: ${(after / 1024).toFixed(0)} KB, ${Math.round(triCount())} tris  (${(before / 1024).toFixed(0)} -> ${(after / 1024).toFixed(0)} KB)`);
