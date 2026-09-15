/* v11.2 — Chad's Sketchfab "forest with a road at night", made shippable
   for the film pocket of episode 2 chapter 3 (the drive in and the walk in).

   What the file is: a MINIATURE — a 9.5-unit ground plane with a winding
   dirt road painted into its sheet, 1,480 tree CARDS (crossed quads on one
   1024 atlas, BLEND alpha) with cylinder trunks, everything at roughly one
   tenth of life size. Where it serves and why (docs/V11.0-E2C3-PLAN.md
   §18): the FILM only. The playable harbour is a flat ground the engine
   walks with one collision sample at y = 1.0, six torch spots at measured
   positions and a ring of scrapes; this terrain has two metres of relief
   and a thousand alpha cards — it would take the whole chapter to re-lay on
   it, for a film set. As a film set it is exactly right.

   The recipe, and the three things it does beyond the standing one:

   1. JOIN by material. 1,480 meshes is 1,480 draw calls a frame on a phone;
      the atlas is shared, so every card can be one mesh. gltf-transform's
      join() does it after flatten(). Three meshes leave: ground, trees,
      trunks.
   2. The LEAF ALPHA STAYS (v6.16's law): the tree atlas is PNG with a real
      alpha channel and is re-encoded as palette PNG, never JPEG. The ground
      and bark sheets have no alpha and go to JPEG.
   3. The SCALE IS NOT BAKED. The chapter scales the set (`FOREST.S`) so the
      number is one place, measured against the road's own width; the
      road's centreline in the file's units is traced offline (dbg-road)
      and lives in the chapter as `ROAD_PATH`.

   Output contract, asserted: Y-up, the file's own origin kept (the road
   path is in these coordinates), three primitives.

   4. CLEAR THE ROAD. The file plants bushes right up to the ruts, and a
      card that overhangs the road is a card the truck drives through and
      the walking camera stands inside (found by render: a frame of leaf).
      Given the traced centreline (a JSON of [x,y,z] in file units) and a
      clearance, every tree NODE whose origin lies within the clearance of
      the polyline is dropped before the join. 0.32 units at x8 is 2.6 m —
      the truck's half width plus a boot.

   Usage: node tools/prepforest.mjs in.glb out.glb [groundPx=1024] [atlasPx=1024] [road.json] [clearance=0.32]
*/
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS, KHRMeshQuantization } from '@gltf-transform/extensions';
import { weld, quantize, prune, dedup, flatten, join, clearNodeTransform, metalRough } from '@gltf-transform/functions';
import { MeshoptEncoder, MeshoptDecoder } from 'meshoptimizer';
import sharp from 'sharp';
import fs from 'node:fs';

await MeshoptEncoder.ready; await MeshoptDecoder.ready;
const [inp, outp, gS = '1024', aS = '1024', roadJson = '', clearS = '0.32'] = process.argv.slice(2);
const GROUND_PX = +gS, ATLAS_PX = +aS, CLEAR = +clearS;
const ROAD = roadJson ? JSON.parse(fs.readFileSync(roadJson, 'utf8')) : null;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({ 'meshopt.decoder': MeshoptDecoder, 'meshopt.encoder': MeshoptEncoder });
const doc = await io.read(inp);
const root = doc.getRoot();
const before = fs.statSync(inp).size;

await doc.transform(metalRough());
const keep = new Set(); const blendTex = new Set();
for (const m of root.listMaterials()) {
  const base = m.getBaseColorTexture(); if (base) keep.add(base);
  const wasBlend = m.getAlphaMode() === 'BLEND';
  if (wasBlend && base) blendTex.add(base);
  m.setNormalTexture(null); m.setMetallicRoughnessTexture(null); m.setOcclusionTexture(null); m.setEmissiveTexture(null);
  m.setEmissiveFactor([0, 0, 0]); m.setMetallicFactor(0); m.setRoughnessFactor(0.95);
  /* a cutout, not a blend: MASK sorts itself (v6.16) */
  if (wasBlend) { m.setAlphaMode('MASK'); m.setAlphaCutoff(0.45); m.setDoubleSided(true); } else { m.setAlphaMode('OPAQUE'); m.setDoubleSided(false); }
  for (const e of m.listExtensions()) m.setExtension(e.extensionName, null);
}
for (const t of root.listTextures()) if (!keep.has(t)) t.dispose();
for (const e of root.listExtensionsUsed()) if (e.extensionName !== 'KHR_mesh_quantization') e.dispose();

for (const mesh of root.listMeshes()) for (const p of mesh.listPrimitives())
  for (const sem of ['TANGENT', 'TEXCOORD_1', 'TEXCOORD_2', 'COLOR_0']) if (p.getAttribute(sem)) p.setAttribute(sem, null);

/* flatten() leaves each node's world transform ON the node; join() would
   then merge 1,480 cards into one node's LOCAL space (the first pass came out
   with trunks a kilometre away). Every transform is baked into the vertices
   first, so the join happens in world space. */
await doc.transform(prune(), flatten());
/* step 4: the road is cleared BEFORE the transforms are baked, while every
   tree is still its own node with an origin to measure */
if (ROAD) {
  const distToRoad = (x, z) => {
    let best = Infinity;
    for (let i = 1; i < ROAD.length; i++) {
      const [ax, , az] = ROAD[i - 1], [bx, , bz] = ROAD[i];
      const vx = bx - ax, vz = bz - az, wx = x - ax, wz = z - az;
      const t = Math.max(0, Math.min(1, (vx * wx + vz * wz) / (vx * vx + vz * vz || 1)));
      best = Math.min(best, Math.hypot(x - (ax + vx * t), z - (az + vz * t)));
    }
    return best;
  };
  let dropped = 0, kept = 0;
  for (const node of root.listNodes()) {
    const m = node.getMesh(); if (!m) continue;
    const isGround = m.listPrimitives().some(p => p.getMaterial()?.getName() === 'Material.003');
    if (isGround) continue;
    const M = node.getWorldMatrix(); const x = M[12], z = M[14];
    if (distToRoad(x, z) < CLEAR) { node.dispose(); dropped++; } else kept++;
  }
  console.log(`  road cleared: ${dropped} trees within ${CLEAR} of the centreline dropped, ${kept} kept`);
  await doc.transform(prune());
}
for (const node of root.listNodes()) clearNodeTransform(node);
await doc.transform(join({ keepNamed: false }), weld({ tolerance: 0.0001 }));

for (const t of root.listTextures()) {
  const img = t.getImage(); if (!img) continue;
  const meta = await sharp(Buffer.from(img)).metadata();
  if (blendTex.has(t)) {
    const out = await sharp(Buffer.from(img)).resize(ATLAS_PX, ATLAS_PX, { fit: 'inside' }).png({ palette: true, quality: 90, colours: 256 }).toBuffer();
    t.setImage(out).setMimeType('image/png'); console.log(`  atlas ${meta.width}px alpha=${meta.hasAlpha} -> ${ATLAS_PX}px palette png ${(out.length / 1024).toFixed(0)} KB`);
  } else {
    const px = meta.width >= 1024 ? GROUND_PX : Math.min(meta.width, 512);
    const out = await sharp(Buffer.from(img)).resize(px, px, { fit: 'inside' }).jpeg({ quality: 86 }).toBuffer();
    t.setImage(out).setMimeType('image/jpeg'); console.log(`  sheet ${meta.width}px -> ${px}px jpeg ${(out.length / 1024).toFixed(0)} KB`);
  }
}
/* the contract */
const prims = []; for (const mesh of root.listMeshes()) for (const p of mesh.listPrimitives()) prims.push(p);
console.log(`  primitives after join: ${prims.length}`);
for (const p of prims) {
  const a = p.getAttribute('POSITION').getArray(), n = p.getAttribute('POSITION').getCount();
  let lo = [Infinity, Infinity, Infinity], hi = [-Infinity, -Infinity, -Infinity];
  for (let i = 0; i < n; i++) for (let k = 0; k < 3; k++) { const v = a[i * 3 + k]; if (v < lo[k]) lo[k] = v; if (v > hi[k]) hi[k] = v; }
  const idx = p.getIndices();
  console.log(`   ${p.getMaterial().getName()} ${p.getMaterial().getAlphaMode()} tris=${Math.round((idx ? idx.getCount() : n) / 3)} box ${lo.map(x => x.toFixed(2))} .. ${hi.map(x => x.toFixed(2))}`);
}
if (prims.length > 4) throw new Error(`join left ${prims.length} primitives`);
for (const node of root.listNodes()) { const tr = node.getTranslation(), sc = node.getScale(); if (node.getMesh() && (tr.some(x => Math.abs(x) > 1e-6) || sc.some(x => Math.abs(x - 1) > 1e-6))) throw new Error(`node ${node.getName()} still carries a transform`); }
doc.createExtension(KHRMeshQuantization).setRequired(true);
await doc.transform(prune(), dedup(), quantize({ pattern: /POSITION|NORMAL|TEXCOORD/ }));
await io.write(outp, doc);
const after = fs.statSync(outp).size;
console.log(`${inp.split('/').pop()} -> ${outp.split('/').pop()}: ${(before / 1024 / 1024).toFixed(2)} MB -> ${(after / 1024).toFixed(0)} KB`);
