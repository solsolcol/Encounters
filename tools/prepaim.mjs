/* v12.2 — Chad's static aiming soldier (`fbo-static-pointing.glb`), made
   shippable as `assets/fboaim.glb`.

   docs/E2-SOLDIER-MODELS.md specified this model at v7.0 and named it
   `fboaim`: "the only figures in the set that show a shouldered weapon; on
   a firing line nobody moves, so a statue is not a compromise, it is
   correct." It was never prepped, which is why episode 2 chapter 4's
   firing line was dressed with `fbosling` and `admintee` — men standing
   about with their rifles slung on a live range.

   Despite the file's name he is not pointing, he is AIMING: a proper
   standing aim, bullpup rifle shouldered, cheek on the stock. Photographed
   before anything was measured (tools/shootmodel.mjs), which is the order
   v6.17 paid for — the render is the authority and the measures below are
   its guard.

   Three things about this file decide the recipe:

   1. IT HAS NO RIG AND NO CLIPS (0 bones, 0 animations). A statue, and on a
      firing line that is exactly right.
   2. ITS MATERIAL IS metalness 1 WITH A 4096px METALLIC-ROUGHNESS SHEET.
      Drop that sheet without dropping the factor and he renders NEAR BLACK
      (v8.9's law) — a black cut-out at night, which is the failure this
      chapter can least afford. `setMetallicFactor(0)` is not optional.
   3. HE AIMS DIAGONALLY IN HIS OWN FRAME. Measured, the muzzle runs out
      toward +x+z at about 45 degrees, so neither axis of the bounding box
      is the aim and neither is the body's depth. The tool MEASURES the aim
      and bakes the turn, because a firing line where everyone points 45
      degrees off the range is worse than no statue at all.

   The output contract, asserted on the BAKED vertices and BEFORE
   `quantize()` (which rewrites POSITION as integers and makes the same read
   meaningless — paid for at v12.1):
     · Y-up, BOOTS ON y = 0;
     · the origin under the BODY, not under the bounding box — a rifle held
       out in front skews the box by a quarter of a metre, and a line of men
       is spaced by their shoulders, not by their barrels;
     · THE RIFLE AIMING DOWN -Z, which is the direction three.js calls
       forward, so a chapter turns him downrange with a plain rotation.y.

   Usage: node tools/prepaim.mjs in.glb out.glb [ratio] [error]
*/
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS, KHRMeshQuantization } from '@gltf-transform/extensions';
import { weld, simplifyPrimitive, quantize, prune, dedup, flatten, clearNodeTransform, metalRough, textureCompress } from '@gltf-transform/functions';
import { MeshoptSimplifier, MeshoptEncoder, MeshoptDecoder } from 'meshoptimizer';
import sharp from 'sharp';
import fs from 'node:fs';

await MeshoptSimplifier.ready; await MeshoptEncoder.ready; await MeshoptDecoder.ready;
const [inp, outp, ratioS = '0.08', errS = '0.01'] = process.argv.slice(2);
const RATIO = +ratioS, ERROR = +errS;

const io = new NodeIO().registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({ 'meshopt.decoder': MeshoptDecoder, 'meshopt.encoder': MeshoptEncoder });
const doc = await io.read(inp);
const root = doc.getRoot();
const before = fs.statSync(inp).size;

await doc.transform(metalRough());

/* 1 — one sheet survives: base colour. He is a LIT man on a dark range and
   his camouflage is the whole point of him, so unlike the ghost cyclist he
   keeps his paint. Everything else goes, and the factors go with it. */
for (const m of root.listMaterials()) {
  m.setNormalTexture(null); m.setMetallicRoughnessTexture(null);
  m.setOcclusionTexture(null); m.setEmissiveTexture(null);
  m.setEmissiveFactor([0, 0, 0]);
  m.setMetallicFactor(0.0);          /* v8.9: metal with no environment is black */
  m.setRoughnessFactor(0.82);
  m.setAlphaMode('OPAQUE');
}
for (const t of root.listTextures()) if (!root.listMaterials().some(m => m.getBaseColorTexture() === t)) t.dispose();

/* 2 — bake every node transform down, so the vertices are the model */
await doc.transform(flatten());
for (const node of root.listNodes()) if (node.getMesh()) clearNodeTransform(node);

const prims = root.listMeshes().flatMap(m => m.listPrimitives());
const triCount = () => prims.reduce((s, p) => s + (p.getIndices() ? p.getIndices().getCount() : p.getAttribute('POSITION').getCount()) / 3, 0);
console.log(`in: ${(before / 1024).toFixed(0)} KB, ${Math.round(triCount())} tris, ${prims.length} primitive(s)`);

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

/* The BODY's footprint, from the legs alone. The knees-to-thighs slab is the
   one part of a man that is only ever the man — no rifle, no pack, no
   outstretched arm — so it is what the origin is put under and what the
   aim is measured from. */
function bodyAxis() {
  const { l, h } = bounds(), H = h[1] - l[1];
  const lo = l[1] + H * 0.10, hi = l[1] + H * 0.45;
  let xl = Infinity, xh = -Infinity, zl = Infinity, zh = -Infinity;
  for (const p of prims) {
    const a = p.getAttribute('POSITION').getArray(), n = p.getAttribute('POSITION').getCount();
    for (let i = 0; i < n; i++) {
      const y = a[i * 3 + 1]; if (y < lo || y > hi) continue;
      const x = a[i * 3], z = a[i * 3 + 2];
      if (x < xl) xl = x; if (x > xh) xh = x; if (z < zl) zl = z; if (z > zh) zh = z;
    }
  }
  return { x: (xl + xh) / 2, z: (zl + zh) / 2, w: xh - xl, d: zh - zl };
}

/* 3 — WHICH WAY THE RIFLE POINTS. Two measures, and they must agree, and
   the render (shootmodel: he aims toward +x in the deg-0 view and toward
   +z in the deg-90 view) must agree with both.

     · the FURTHEST point of the chest slab from the body's own axis is the
       muzzle — a bullpup held out at the shoulder reaches further from a
       man than anything else he is carrying;
     · the MEAN direction of the furthest 1% of that slab, which is the
       barrel as a whole rather than one vertex.

   The pack on his back is the thing that could fool this, so the tool also
   reports how far the pack reaches the other way: if the muzzle does not
   beat it by a clear margin, the slab is wrong and somebody has to look at
   the model again. */
function aimOf() {
  const { l, h } = bounds(), H = h[1] - l[1], B = bodyAxis();
  const lo = l[1] + H * 0.68, hi = l[1] + H * 0.88;
  const pts = [];
  for (const p of prims) {
    const a = p.getAttribute('POSITION').getArray(), n = p.getAttribute('POSITION').getCount();
    for (let i = 0; i < n; i++) {
      const y = a[i * 3 + 1]; if (y < lo || y > hi) continue;
      const dx = a[i * 3] - B.x, dz = a[i * 3 + 2] - B.z;
      pts.push([dx, dz, Math.hypot(dx, dz)]);
    }
  }
  pts.sort((a, b) => b[2] - a[2]);
  const far = pts[0];
  const top = pts.slice(0, Math.max(1, Math.round(pts.length * 0.01)));
  let mx = 0, mz = 0; for (const q of top) { mx += q[0]; mz += q[1]; }
  const mL = Math.hypot(mx, mz) || 1; mx /= mL; mz /= mL;
  const fL = far[2] || 1;
  const dot = (far[0] / fL) * mx + (far[1] / fL) * mz;
  /* the reach the OTHER way — the pack */
  let back = 0;
  for (const q of pts) if (q[0] * mx + q[1] * mz < 0) back = Math.max(back, q[2]);
  return { x: mx, z: mz, reach: far[2], back, agree: dot };
}

{
  const A = aimOf();
  const deg = (Math.atan2(A.x, A.z) * 180 / Math.PI).toFixed(1);
  console.log(`  aim: (${A.x.toFixed(3)}, ${A.z.toFixed(3)})  ${deg} deg from +z, muzzle ${A.reach.toFixed(3)} m out, pack ${A.back.toFixed(3)} m back, measures agree ${A.agree.toFixed(3)}`);
  if (A.agree < 0.90) throw new Error('the furthest point and the barrel mean disagree — photograph the model before going on');
  if (A.reach < A.back * 1.30) throw new Error(`the muzzle (${A.reach.toFixed(3)}) does not clearly beat the pack (${A.back.toFixed(3)}) — the chest slab is wrong`);

  /* Turn about y so the aim lands on -z. Under three.js's Ry(t) a bearing
     b = atan2(x, z) becomes b + t, so the turn wanted is simply PI - b.
     (Written the other way round first, which put him 104 degrees off and
     was caught by the assert below rather than by a render — which is the
     whole reason the assert re-measures instead of trusting the maths.) */
  const th = Math.PI - Math.atan2(A.x, A.z);
  const c = Math.cos(th), s = Math.sin(th);
  for (const p of prims) {
    for (const sem of ['POSITION', 'NORMAL']) {
      const acc = p.getAttribute(sem); if (!acc) continue;
      const a = acc.getArray().slice();
      for (let i = 0; i < acc.getCount(); i++) {
        const x = a[i * 3], z = a[i * 3 + 2];
        a[i * 3] = c * x + s * z; a[i * 3 + 2] = -s * x + c * z;
      }
      acc.setArray(a);
    }
  }
  console.log(`  baked a turn of ${(th * 180 / Math.PI).toFixed(1)} deg about y: he aims down -z now`);
}

/* 4 — weld and simplify. The NORMALS AND THE UVs BOTH STAY. Dropping
   normals is v8.0's trick for a flat-shaded export, and it is wrong here
   for two reasons: this file is already smooth-shaded (so weld collapses it
   anyway), and re-deriving normals per primitive after a weld leaves a
   SHADING SEAM everywhere the UVs split, which on a textured man is a line
   down his face. 41k triangles is already fourteen times under the ~118k
   the models doc budgeted for him. */
await doc.transform(weld({ tolerance: 0.0001 }));
console.log(`  weld: ${prims[0].getAttribute('POSITION').getCount()} verts`);
if (RATIO < 1) {
  const was = triCount();
  for (const p of prims) simplifyPrimitive(p, { simplifier: MeshoptSimplifier, ratio: RATIO, error: ERROR });
  console.log(`  simplify ${Math.round(was)} -> ${Math.round(triCount())} tris (ratio ${RATIO}, error ${ERROR})`);
}

/* 5 — boots on the floor, the ORIGIN UNDER THE BODY (never under the box) */
{
  const b = bounds(), B = bodyAxis();
  const dx = -B.x, dy = -b.l[1], dz = -B.z;
  for (const p of prims) {
    const pos = p.getAttribute('POSITION'), a = pos.getArray().slice();
    for (let i = 0; i < pos.getCount(); i++) { a[i * 3] += dx; a[i * 3 + 1] += dy; a[i * 3 + 2] += dz; }
    pos.setArray(a);
  }
}

/* 6 — the sheet: 2048 PNG down to 1024 JPEG. A man seen at four metres in
   the dark on a phone does not read 2048 pixels of camouflage. */
await doc.transform(
  textureCompress({ encoder: sharp, targetFormat: 'jpeg', quality: 88, resize: [1024, 1024] }),
  dedup(), prune(),
);

/* 7 — the contract, on the baked vertices and BEFORE quantization */
{
  const b = bounds(), B = bodyAxis(), A = aimOf();
  const size = [b.h[0] - b.l[0], b.h[1] - b.l[1], b.h[2] - b.l[2]];
  if (Math.abs(b.l[1]) > 2e-3) throw new Error(`boots at y ${b.l[1].toFixed(4)}, not 0`);
  if (Math.abs(B.x) > 5e-3 || Math.abs(B.z) > 5e-3) throw new Error(`body axis at (${B.x.toFixed(4)}, ${B.z.toFixed(4)}), not the origin`);
  if (A.z > -0.985) throw new Error(`the rifle aims (${A.x.toFixed(3)}, ${A.z.toFixed(3)}), not down -z`);
  console.log(`  height ${size[1].toFixed(3)} m, body ${B.w.toFixed(3)} x ${B.d.toFixed(3)} at the legs, box ${size.map(v => v.toFixed(3)).join(' x ')}`);
}

doc.createExtension(KHRMeshQuantization).setRequired(true);
await doc.transform(quantize({ quantizePosition: 14, quantizeNormal: 10, quantizeTexcoord: 12 }));
await io.write(outp, doc);
const after = fs.statSync(outp).size;
console.log(`out: ${(after / 1024).toFixed(0)} KB, ${Math.round(triCount())} tris  (${(before / 1024).toFixed(0)} -> ${(after / 1024).toFixed(0)} KB)`);
