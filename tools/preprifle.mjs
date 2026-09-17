/* v12.0 — Chad's Sketchfab KRISS Vector ("kriss_vector_animated_free"), made
   shippable as the player's WEAPON viewmodel (docs/E2-SOLDIER-MODELS.md §8,
   docs/V12.0-E2C4-PLAN.md §11-12).

   What it keeps: all four skinned meshes (bare hand, gloved hand, weapon,
   magazine), the 53-joint rig and its four clips (Draw, Shoot, Reload, Hide)
   — the file is an FPS arms-and-weapon rig and its animations were authored
   around these fingers, so nothing is simplified, retargeted or re-posed.
   The scale (centimetres), the half turn about Y and the placement at the
   model's own eye are the ENGINE's to apply (§8's measured numbers), not the
   file's — a quantized attribute is an integer array no runtime matrix can
   touch (v9.0), so nothing is baked here that the engine wants to own.

   What changes: the three PNG sheets (2.0 MB of the 2.8) become JPEG at their
   own sizes — base colour and metal/roughness, no alpha anywhere in the
   file — and the document is pruned and deduped. No quantization: the two
   hand meshes are what a viewmodel is judged on and they are 1.3k/1.6k
   vertices, so there is nothing to save that is worth a risk to the fingers.

   Usage: node tools/preprifle.mjs in.glb out.glb [quality] */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { prune, dedup } from '@gltf-transform/functions';
import sharp from 'sharp';
import fs from 'node:fs';

const [inp, outp, qS = '86'] = process.argv.slice(2);
const Q = +qS;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
const doc = await io.read(inp);
const root = doc.getRoot();
const before = fs.statSync(inp).size;

for (const m of root.listMaterials()) {
  m.setNormalTexture(null); m.setOcclusionTexture(null);   // none in the file; the rule stands
  m.setAlphaMode('OPAQUE'); m.setDoubleSided(false);
}
for (const t of root.listTextures()) {
  if (t.getMimeType() === 'image/jpeg') continue;
  const img = sharp(Buffer.from(t.getImage()));
  const meta = await img.metadata();
  const out = await img.flatten({ background: '#000' }).jpeg({ quality: Q, mozjpeg: true }).toBuffer();
  console.log(`  ${meta.width}x${meta.height} ${meta.format} ${(t.getImage().byteLength / 1024) | 0} KB -> jpeg ${(out.length / 1024) | 0} KB`);
  t.setImage(out).setMimeType('image/jpeg');
}
await doc.transform(dedup(), prune());
await io.write(outp, doc);
const after = fs.statSync(outp).size;
const tris = root.listMeshes().reduce((n, m) => n + m.listPrimitives().reduce((k, p) => k + ((p.getIndices()?.getCount() || 0) / 3), 0), 0);
console.log(`${inp} ${(before / 1024) | 0} KB -> ${outp} ${(after / 1024) | 0} KB, ${tris | 0} triangles, clips ${root.listAnimations().map(a => a.getName()).join('/')}`);
