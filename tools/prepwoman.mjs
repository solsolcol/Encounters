/* v5.20 — the v5.05 recipe, made reusable, for the four women of chapter 3.
   The recipe, and WHY each step (docs/V5.05-CROWD.md has the long form):

   1. DROP every map that is not base colour. The CSP-safe rescueTextures()
      in main.js only ever restores base colour, so a normal/AO/rough map
      renders white in production and is pure download. Flat roughness 0.85,
      metalness 0 is what a person in a car park looks like.
   2. Body sheets to JPEG at the given size. Hair/eyelash sheets that carry
      CUTOUT ALPHA stay PNG and small, because JPEG has no alpha and hair
      cards stop reading as hair without it.
   3. Weld + simplify. Hair resists collapsing (alpha cards have seams
      meshopt will not cross) and stays the biggest mesh.
   4. KHR_mesh_quantization LAST — the one compression this game gets free,
      handled inside three.js's own GLTFLoader with no decoder and no blob
      (v5.16). For a skinned mesh the dequantization scale rides the
      INVERSE BIND MATRICES, not the node.

   5. DROP the clip library. A bought character often ships every take its
      author made — fearful_woman arrived with eleven, 2742 KB of keyframes
      against 258 KB of geometry and 74 KB of texture. A background sitter
      plays exactly ONE take, retargeted, so the other ten are pure
      download and they DWARF everything the first four steps save. Pass a
      comma-separated keep-list as the last argument to keep named clips
      (kana brings her own talking take and must keep it).

   Usage: node tools/prepwoman.mjs in.glb out.glb [ratio] [bodyPx] [alphaPx] [keepClips]
*/
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS, KHRMeshQuantization } from '@gltf-transform/extensions';
import { weld, simplify, quantize, prune, dedup, textureCompress } from '@gltf-transform/functions';
import { MeshoptSimplifier, MeshoptEncoder, MeshoptDecoder } from 'meshoptimizer';
import sharp from 'sharp';
import fs from 'node:fs';

await MeshoptSimplifier.ready; await MeshoptEncoder.ready; await MeshoptDecoder.ready;

const [inp, outp, ratioS = '0.28', bodyS = '512', alphaS = '256', keepS = ''] = process.argv.slice(2);
const RATIO = +ratioS, BODY = +bodyS, ALPHA = +alphaS;
const KEEP = keepS.split(',').map(s => s.trim()).filter(Boolean);

const io = new NodeIO().registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({ 'meshopt.decoder': MeshoptDecoder, 'meshopt.encoder': MeshoptEncoder });
const doc = await io.read(inp);
const root = doc.getRoot();
const before = fs.statSync(inp).size;

/* 1 — every slot but base colour goes. Detaching the texture is not enough:
   the Texture object itself must be disposed or it stays in the file. */
const keep = new Set();
for (const m of root.listMaterials()) {
  const base = m.getBaseColorTexture();
  if (base) keep.add(base);
  m.setNormalTexture(null);
  m.setMetallicRoughnessTexture(null);
  m.setOcclusionTexture(null);
  m.setEmissiveTexture(null);
  m.setRoughnessFactor(0.85);
  m.setMetallicFactor(0);
  /* KHR_materials_specular and friends read as extra bytes and extra
     shader work for something nobody sees at three metres. */
  for (const e of m.listExtensions()) m.setExtension(e.extensionName, null);
}
for (const t of root.listTextures()) if (!keep.has(t)) t.dispose();
/* and the EXTENSION objects themselves, or the file still declares
   extensionsUsed for something no material references — harmless for a
   'used' entry, fatal if it were ever 'required'. */
for (const e of root.listExtensionsUsed()) {
  if (e.extensionName !== 'KHR_mesh_quantization') e.dispose();
}

/* 2 — a sheet that carries cutout alpha stays PNG and small; everything
   else becomes a JPEG. "Carries alpha" is MEASURED from the pixels, not
   guessed from the name: a hair sheet named 'body' is still a hair sheet. */
for (const t of root.listTextures()) {
  const img = t.getImage(); if (!img) continue;
  const s = sharp(Buffer.from(img));
  const meta = await s.metadata();
  let hasAlpha = false;
  if (meta.hasAlpha) {
    const st = await s.clone().ensureAlpha().extractChannel(3).stats();
    hasAlpha = st.channels[0].min < 250;      // a real cutout, not an opaque alpha channel
  }
  const px = hasAlpha ? ALPHA : BODY;
  const out = hasAlpha
    ? await sharp(Buffer.from(img)).resize(px, px, { fit: 'inside' }).png({ compressionLevel: 9, palette: true }).toBuffer()
    : await sharp(Buffer.from(img)).resize(px, px, { fit: 'inside' }).jpeg({ quality: 84 }).toBuffer();
  t.setImage(out).setMimeType(hasAlpha ? 'image/png' : 'image/jpeg');
  console.log('   tex', (meta.width + 'x' + meta.height).padEnd(9),
    (img.byteLength / 1024 | 0) + 'KB', '->', hasAlpha ? 'PNG' : 'JPEG', px, (out.byteLength / 1024 | 0) + 'KB');
}

/* 5 — the clip library. See the header: this is usually the biggest win
   on a bought character and the least obvious one. */
for (const a of root.listAnimations()) {
  if (KEEP.includes(a.getName())) continue;
  let n = 0;
  for (const smp of a.listSamplers()) n += (smp.getInput()?.getByteLength() || 0) + (smp.getOutput()?.getByteLength() || 0);
  console.log('   drop clip', a.getName(), (n / 1024 | 0) + 'KB');
  for (const c of a.listChannels()) c.dispose();
  for (const smp of a.listSamplers()) smp.dispose();
  a.dispose();
}

let tris0 = 0;
for (const m of root.listMeshes()) for (const p of m.listPrimitives()) {
  const i = p.getIndices(); tris0 += (i ? i.getCount() : p.getAttribute('POSITION').getCount()) / 3;
}

await doc.transform(
  dedup(),
  weld(),
  simplify({ simplifier: MeshoptSimplifier, ratio: RATIO, error: 0.02 }),
  prune(),
);
/* quantize last, and its extension declared, or three.js will not know to
   dequantize and the mesh arrives as a ball of integers. */
doc.createExtension(KHRMeshQuantization).setRequired(true);
await doc.transform(quantize({ pattern: /^(POSITION|NORMAL|TEXCOORD|WEIGHTS|JOINTS)/ }));

let tris1 = 0;
for (const m of root.listMeshes()) for (const p of m.listPrimitives()) {
  const i = p.getIndices(); tris1 += (i ? i.getCount() : p.getAttribute('POSITION').getCount()) / 3;
}
await io.write(outp, doc);
const after = fs.statSync(outp).size;
console.log(`   ${inp.split('/').pop()} -> ${outp.split('/').pop()}: `
  + `${(before / 1048576).toFixed(2)} MB -> ${(after / 1024 | 0)} KB, `
  + `${tris0 | 0} -> ${tris1 | 0} tris, ext: `
  + root.listExtensionsUsed().map(e => e.extensionName).join(','));
