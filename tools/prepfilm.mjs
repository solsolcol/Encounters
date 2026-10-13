/* v19.0 — Chad's four Sketchfab models for episode 3 chapter 1's opening
   film (Chad: "Use the attached office environment model to replace your
   generated office ... use attached camera model file to illustrate the car
   cameras ... use the attached laptop model to replace your generated laptop
   ... use the airplane inside model, to replace your generated model").
   One tool, because the four want one recipe with different numbers.

     office     Mersus Office: a whole office floor, 60,593 tris, 44 PNG
                sheets at 1024 (22 MB of texture). Desks at 0.55 units
                under a 0.826 root, so it is scaled to a 0.74 m desk.
     actioncam  Xiaomi Yi 4K: 3,546 tris, already in metres (6.6 cm wide).
     laptop     a 15" laptop with a mouse pad, 106,298 tris (80k of them
                keys), in units where it is 3.80 wide: scaled to 0.36 m.
     plane      a cabin slice — five rows of three, one wall of windows,
                252,968 tris (220k of them seats) in units where a seat
                cushion is 0.025 high: scaled x17.5, so the cushion stands 0.37 m off the
                floor and the seat back 1.08 — an economy seat; at x15 they were
                0.32 / 0.93 and a seated man's knees came up past the armrests.

   THE RECIPE: bake every node transform (flatten() alone leaves each mesh
   node its own transform — v13.1), scale to metres, simplify only the
   materials named (the dense seats and keys; the room is left whole), drop
   the maps that do not reach the screen (the film draws these unlit or in
   its own light, so normal / metal-roughness / occlusion sheets are pure
   download), re-encode the colour sheets as WebP on a PLAIN source (v14.12:
   rescueTextures reads json.textures[i].source), and pack with meshopt.
   The contract is asserted before the pack (v12.1).

     node tools/prepfilm.mjs <office|actioncam|laptop|plane> <in.glb> <out.glb> */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { dedup, prune, weld, simplify, meshopt, flatten, clearNodeTransform, transformPrimitive } from '@gltf-transform/functions';
import { MeshoptSimplifier, MeshoptEncoder, MeshoptDecoder } from 'meshoptimizer';
import sharp from 'sharp';
import fs from 'node:fs';

const [, , KIND, IN, OUT] = process.argv;
const CFG = {
  /* scale: model units -> metres (after the bake); base: 'centre' puts the
     base centre on the origin, 'keep' keeps the room's own origin; simp:
     material name -> ratio; px: material name -> sheet size (default 512) */
  office: { scale: 0.74 / 0.55, base: 'keep', simp: { SwivlChair: 0.45, BrownChair: 0.5 },
            px: { woodFloor: 1024, carpet: 1024, Walls: 1024, ceilingtiles: 1024, ceilingtiles_plain: 1024, Desktop: 1024, BigWhiteTable: 512 } },
  actioncam: { scale: 1, base: 'centre', simp: {}, px: {} },
  laptop: { scale: 0.36 / 3.797, base: 'centre', simp: { Keyboard: 0.35 }, px: { screen: 1024 } },
  plane: { scale: 17.5, base: 'keep', simp: { blinn2: 0.12, blinn1: 0.2, blinn3: 0.12, lambert1: 0.4, blinn4: 0.3 }, px: {} },
}[KIND];
if (!CFG) throw new Error('kind?');
await Promise.all([MeshoptSimplifier.ready, MeshoptEncoder.ready, MeshoptDecoder.ready]);
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({
  'meshopt.encoder': MeshoptEncoder, 'meshopt.decoder': MeshoptDecoder });
const doc = await io.read(IN);
const root = doc.getRoot();
const tris = (prims) => prims.reduce((t, p) => t + (p.getIndices()?.getCount() ?? p.getAttribute('POSITION').getCount()) / 3, 0);
const allPrims = () => root.listMeshes().flatMap(m => m.listPrimitives());
const t0 = tris(allPrims());

/* ---- 1. the maps that never reach the screen ---- */
for (const mat of root.listMaterials()) {
  mat.setNormalTexture(null).setMetallicRoughnessTexture(null).setOcclusionTexture(null).setEmissiveTexture(null);
  /* v8.9: metal with nothing to reflect renders black — the office's tiles
     and doors and the plane's frames ship metalness ~1 on their MR sheets */
  if (mat.getMetallicFactor() > 0.5) mat.setMetallicFactor(KIND === 'laptop' ? 0.55 : 0.1);
  if (mat.getRoughnessFactor() > 0.95) mat.setRoughnessFactor(0.8);
}

/* ---- 2. bake, then simplify per material ---- */
await doc.transform(dedup(), flatten());
for (const n of root.listNodes()) clearNodeTransform(n);
/* the bake leaves a node per mesh with an identity transform: assert it */
for (const n of root.listNodes()) {
  const m = n.getMatrix(); const id = [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1];
  if (m.some((v, i) => Math.abs(v - id[i]) > 1e-6)) throw new Error(`not baked: ${n.getName()}`);
}
for (const [name, ratio] of Object.entries(CFG.simp)) {
  /* simplify() works per document; run it on a copy of the doc's view by
     temporarily giving the other prims nothing to do is not possible, so the
     simplifier is called directly per primitive (its own index buffer) */
  for (const p of allPrims()) {
    if (!p.getMaterial() || p.getMaterial().getName() !== name) continue;
    const before = tris([p]);
    const pos = p.getAttribute('POSITION'), idx = p.getIndices();
    const P = new Float32Array(pos.getArray()), I = new Uint32Array(idx.getArray());
    const [out] = MeshoptSimplifier.simplify(I, P, 3, Math.floor(I.length * ratio / 3) * 3, 0.01, ['LockBorder']);
    idx.setArray(pos.getCount() > 65535 ? new Uint32Array(out) : new Uint16Array(out));
    console.log(`  simplify ${name}: ${before} -> ${tris([p])}`);
  }
}
await doc.transform(prune());

/* ---- 3. metres, and where the origin sits ---- */
const s = CFG.scale;
const mn = [Infinity, Infinity, Infinity], mx = [-Infinity, -Infinity, -Infinity], v = [0, 0, 0];
const seen = new Set();
for (const p of allPrims()) {
  const a = p.getAttribute('POSITION'); if (seen.has(a)) continue; seen.add(a);
  for (let i = 0; i < a.getCount(); i++) { a.getElement(i, v); for (let k = 0; k < 3; k++) { mn[k] = Math.min(mn[k], v[k] * s); mx[k] = Math.max(mx[k], v[k] * s); } }
}
const off = CFG.base === 'centre' ? [-(mn[0] + mx[0]) / 2, -mn[1], -(mn[2] + mx[2]) / 2] : [0, 0, 0];
const done = new Set();
for (const p of allPrims()) {
  if (done.has(p.getAttribute('POSITION'))) continue; done.add(p.getAttribute('POSITION'));
  transformPrimitive(p, [s,0,0,0, 0,s,0,0, 0,0,s,0, off[0], off[1], off[2], 1]);
}
const size = mx.map((x, i) => x - mn[i]);
if (!(size[1] < 4.5)) throw new Error(`taller than a room: ${size}`);

/* ---- 4. the sheets: WebP on a plain source, alpha kept where the material blends ---- */
for (const mat of root.listMaterials()) {
  const tex = mat.getBaseColorTexture(); if (!tex) continue;
  const px = CFG.px[mat.getName()] || 512;
  const alpha = mat.getAlphaMode() !== 'OPAQUE';
  const img = await sharp(Buffer.from(tex.getImage())).resize(px, px, { fit: 'fill' }).webp({ quality: 86, alphaQuality: alpha ? 90 : 100 }).toBuffer();
  tex.setImage(img).setMimeType('image/webp').setURI('');
}
await doc.transform(prune());
await doc.transform(meshopt({ encoder: MeshoptEncoder, level: 'medium' }));
await io.write(OUT, doc);
console.log(`prepfilm ${KIND}: tris ${t0} -> ${tris(allPrims())}, size ${size.map(x => x.toFixed(3)).join(' x ')}, min ${mn.map(x => (x + 0).toFixed(2))}, ${(fs.statSync(OUT).size / 1024).toFixed(0)} KB`);
