/* v13.1 — Chad's two Sketchfab ammunition models, made shippable as the
   dressing of episode 2 chapter 4's AMMO POINT (Chad: "Also use a mix of
   these 2 models, one is ammo crate, one is a bunch of magazines and
   bullets"). One tool, because the two files want exactly the same recipe
   and differ only in numbers.

     ammo_crate        8.5 MB, 28 meshes, 40,426 tris, 22 textures — an
                       olive wooden crate stencilled AMMUNITION 5.56x45
                       with eleven loose rounds lying on its lid
     5.56mm_ammo_pickup  3.1 MB, 1 mesh, 4,634 tris, 3 textures — two
                       magazines, one open with brass showing

   THE RECIPE, which is this repo's standing one (v5.05 / v9.0) plus the two
   things these files each need:

   1. BASE COLOUR ONLY. Every metal-roughness, normal and occlusion map
      goes. `rescueTextures()` — the CSP-safe loader every chapter's models
      come through — only ever restores base colour, so a normal map is pure
      download that never reaches the screen. The crate's 22 textures become
      8; the pickup's 3 become 1.

   2. METALNESS COMES DOWN, and this is the v8.9 law rather than a taste:
      both files ship metalness 1.0, and a fully metallic material with no
      environment map has nothing to reflect and renders NEAR BLACK.
      Photographed on their own, the pickup's magazines were a black
      silhouette with three lit brass tips. The ammo point is lit by one
      red lamp on a night range; the metal has to carry its own colour.

   3. SIMPLIFY, at a ratio the part can take. The crate's lid alone is
      14,672 triangles and each of its eleven loose rounds is 1,656 — a
      4 cm brass case on a table two metres away. The pickup is left alone
      at 4,634: it is small, it is the closer of the two to the film's
      camera, and there is nothing there to win.

   4. REAL-WORLD METRES, origin at the BASE CENTRE. The pickup already
      arrives in metres (measured: 0.353 m long, which is two magazines);
      the crate arrives 3.63 units long and floating 1.4 units above its own
      origin. Both leave here scaled so one unit is one metre and sitting on
      y = 0, so the chapter states a position and nothing else. The turn is
      NOT baked — quantization forbids a runtime write to the vertices but
      says nothing about a node's rotation, so the chapter keeps that.

   5. QUANTIZE LAST, and ASSERT THE CONTRACT BEFORE IT (v12.1): afterwards
      the positions are integers and every measurement reads nonsense.

   Usage: node tools/prepammo.mjs in.glb out.glb <lengthMetres|keep> [ratio] [px] [q] */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS, KHRMeshQuantization } from '@gltf-transform/extensions';
import { prune, dedup, weld, simplify, quantize, flatten, join, clearNodeTransform } from '@gltf-transform/functions';
import { MeshoptSimplifier } from 'meshoptimizer';
import sharp from 'sharp';
import fs from 'node:fs';

const [inp, outp, lenS = 'keep', ratioS = '0', pxS = '512', qS = '86'] = process.argv.slice(2);
const RATIO = +ratioS, PX = +pxS, Q = +qS;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
const doc = await io.read(inp);
const root = doc.getRoot();
const say = [];
const triCount = () => root.listMeshes().reduce((a, m) => a + m.listPrimitives()
  .reduce((b, p) => b + (p.getIndices() ? p.getIndices().getCount() : p.getAttribute('POSITION').getCount()) / 3, 0), 0);

/* ---- 1. the maps that cannot reach the screen ---- */
let dropped = 0;
for (const mat of root.listMaterials()) {
  for (const drop of ['MetallicRoughness', 'Normal', 'Occlusion', 'Emissive']) {
    if (mat[`get${drop}Texture`] && mat[`get${drop}Texture`]()) { mat[`set${drop}Texture`](null); dropped++; }
  }
  /* v8.9: metal with no environment renders black. 0.30 keeps the sheen a
     brass case and a steel latch want without handing the look to a
     reflection that does not exist. */
  if (mat.getMetallicFactor() > 0.5) mat.setMetallicFactor(0.30);
  if (mat.getRoughnessFactor() >= 1) mat.setRoughnessFactor(0.72);
}
say.push(`  dropped ${dropped} non-base maps`);

/* ---- 2. flatten, BAKE, then the geometry work ----
   `flatten()` only removes the HIERARCHY: it leaves each mesh node holding
   its own local transform, and both of these files hang their meshes off a
   Sketchfab root with a quarter turn about X. Measuring raw POSITION
   accessors after flatten() therefore answers a question about a model
   lying on its side — the crate read 0.48 x 0.81 x 0.62 m, a crate stood on
   end. `clearNodeTransform()` is what actually bakes it, and it can only do
   that once per mesh, so a mesh used by two nodes is refused here rather
   than silently doubled (the v9.0 trap, asserted). */
await doc.transform(flatten());
{
  const users = new Map();
  for (const n of root.listNodes()) if (n.getMesh()) users.set(n.getMesh(), (users.get(n.getMesh()) || 0) + 1);
  for (const [mesh, n] of users) if (n > 1) throw new Error(`mesh ${mesh.getName()} is used by ${n} nodes — its transform cannot be baked twice`);
  for (const n of root.listNodes()) clearNodeTransform(n);
  for (const n of root.listNodes()) {
    const t = n.getTranslation(), r = n.getRotation(), sc = n.getScale();
    const id = t.every(x => Math.abs(x) < 1e-6) && Math.abs(r[3] - 1) < 1e-6 &&
               r.slice(0, 3).every(x => Math.abs(x) < 1e-6) && sc.every(x => Math.abs(x - 1) < 1e-6);
    if (!id) throw new Error(`node ${n.getName()} still carries a transform after the bake`);
  }
}
const tris0 = triCount();
if (RATIO > 0) {
  await MeshoptSimplifier.ready;
  await doc.transform(weld({ tolerance: 0.0001 }),
                      simplify({ simplifier: MeshoptSimplifier, ratio: RATIO, error: 0.002 }));
}
/* the second and third UV sets are a lightmap this game never builds */
let uvDrop = 0;
for (const mesh of root.listMeshes())
  for (const p of mesh.listPrimitives())
    for (const s of p.listSemantics())
      if (/^TEXCOORD_[1-9]/.test(s)) { p.setAttribute(s, null); uvDrop++; }
say.push(`  triangles ${Math.round(tris0)} -> ${Math.round(triCount())}${uvDrop ? `, ${uvDrop} spare UV sets dropped` : ''}`);

/* ---- 3. metres, and the origin on the base centre ----
   measured across every primitive after flatten(), so the node transforms
   are already in the vertices and there is no stale-matrix question
   (the v9.2 Box3 law, avoided by not using a scene graph at all) */
function bounds() {
  const mn = [Infinity, Infinity, Infinity], mx = [-Infinity, -Infinity, -Infinity], v = [0, 0, 0];
  for (const mesh of root.listMeshes()) for (const p of mesh.listPrimitives()) {
    const pos = p.getAttribute('POSITION');
    for (let i = 0; i < pos.getCount(); i++) { pos.getElement(i, v); for (let k = 0; k < 3; k++) { if (v[k] < mn[k]) mn[k] = v[k]; if (v[k] > mx[k]) mx[k] = v[k]; } }
  }
  return { mn, mx, size: mx.map((x, i) => x - mn[i]) };
}
const b0 = bounds();
/* the LONG AXIS is measured, never assumed to be x or z (the v6.15 law in
   its smallest form): with the turn baked these models are Y-up, so the
   length is simply the largest horizontal span. */
const LONG = Math.max(b0.size[0], b0.size[2]);
const K = lenS === 'keep' ? 1 : (+lenS) / LONG;
const off = [-(b0.mn[0] + b0.mx[0]) / 2, -b0.mn[1], -(b0.mn[2] + b0.mx[2]) / 2];
{
  const v = [0, 0, 0];
  const done = new Set();
  for (const mesh of root.listMeshes()) for (const p of mesh.listPrimitives()) {
    const pos = p.getAttribute('POSITION');
    if (done.has(pos)) continue; done.add(pos);          // accessors are shared between prims
    for (let i = 0; i < pos.getCount(); i++) {
      pos.getElement(i, v);
      pos.setElement(i, [(v[0] + off[0]) * K, (v[1] + off[1]) * K, (v[2] + off[2]) * K]);
    }
  }
}
const b1 = bounds();
say.push(`  size ${b0.size.map(x => x.toFixed(3)).join(' x ')} -> ${b1.size.map(x => x.toFixed(3)).join(' x ')} m  (x${K.toFixed(4)})`);
/* ASSERT the contract, here, while the positions are still floats */
if (Math.abs(b1.mn[1]) > 1e-4) throw new Error(`base not on y 0 (${b1.mn[1]})`);
if (Math.abs(b1.mn[0] + b1.mx[0]) > 1e-4 || Math.abs(b1.mn[2] + b1.mx[2]) > 1e-4)
  throw new Error(`not centred in x/z (${b1.mn[0]},${b1.mx[0]} / ${b1.mn[2]},${b1.mx[2]})`);
if (lenS !== 'keep' && Math.abs(Math.max(b1.size[0], b1.size[2]) - +lenS) > 1e-4)
  throw new Error(`length is ${Math.max(b1.size[0], b1.size[2])}, asked for ${lenS}`);
/* and it must be a thing that LIES DOWN: a crate or a pair of magazines is
   wider than it is tall. If this trips, the up axis came out wrong. */
if (b1.size[1] > Math.min(b1.size[0], b1.size[2]))
  throw new Error(`taller (${b1.size[1].toFixed(3)}) than its smallest footprint (${Math.min(b1.size[0], b1.size[2]).toFixed(3)}) — is it on its side?`);

/* ---- 4. the sheets. PRUNE FIRST, or the tool spends its time re-encoding
   the fourteen maps step 1 just orphaned. ---- */
await doc.transform(prune());
/* ---- 4. the sheets ---- */
for (const tex of root.listTextures()) {
  const buf = Buffer.from(tex.getImage());
  const md = await sharp(buf).metadata();
  const w = Math.min(PX, md.width), h = Math.min(PX, md.height);
  const jpg = await sharp(buf).removeAlpha().resize(w, h, { fit: 'fill' }).jpeg({ quality: Q, chromaSubsampling: '4:4:4' }).toBuffer();
  say.push(`  ${md.width}x${md.height} ${(buf.length / 1024).toFixed(0)}KB -> ${w}x${h} JPEG q${Q} ${(jpg.length / 1024).toFixed(0)}KB`);
  tex.setImage(jpg).setMimeType('image/jpeg');
}

/* ---- 5. prune, dedup, quantize LAST ---- */
await doc.transform(dedup(), join());
doc.createExtension(KHRMeshQuantization).setRequired(true);
await doc.transform(quantize({ quantizePosition: 14, quantizeNormal: 10, quantizeTexcoord: 12 }));
await io.write(outp, doc);
const a = fs.statSync(inp).size, z = fs.statSync(outp).size;
console.log(say.join('\n'));
console.log(`prepammo ${outp.split('/').pop()}: ${(a / 1024).toFixed(0)}KB -> ${(z / 1024).toFixed(0)}KB, ${Math.round(triCount())} tris, ${root.listTextures().length} textures, ${root.listMeshes().length} meshes`);
