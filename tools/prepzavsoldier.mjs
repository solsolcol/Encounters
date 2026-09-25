/* v14.12 — soldier Master Zav, the equipment panel's figure for EPISODE 2.
   OFFLINE prep (not part of the build). Chad's 39 MB static scan (Meshy-style:
   one mesh, one baked material, base colour + normal + metal-roughness, no
   rig, no clips) shrunk to the shape zavyoung.glb has shipped in since v5.29:
   welded, simplified to about half, meshopt + quantization (zavLoader() carries
   the decoder), every sheet 1024 px WebP.
     node tools/prepzavsoldier.mjs <in.glb> <out.glb> [ratio]
   v14.14 — FULL QUALITY. Chad, from his phone: "the soldier model also looks
   bad on phone." Two causes, both measured on the atlas: his FACE is a small
   island (~120 texels across at the scan's own 2048), so the 1024 sheets of
   v14.12 left it ~60 texels — a smear — and the half-simplified mesh no
   longer matched the normal map it was baked for. Ratio 1 (the default now)
   keeps every triangle; every sheet ships at 2048 (the base and the normal
   are 2048 already; the 4096 metal-roughness comes down), WebP q 94.
   The atlas's islands are DILATED (the fill between them is each island's
   own colour smeared outward), so unlike the adult scan this sheet can have
   mipmaps — see ZAV_MIPS in main.js. */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { dedup, prune, weld, simplify, textureCompress, meshopt, flatten } from '@gltf-transform/functions';
import { MeshoptSimplifier, MeshoptEncoder, MeshoptDecoder } from 'meshoptimizer';
import sharp from 'sharp';
const [,, IN, OUT, R] = process.argv;
const RATIO = Number(R || 1);
await Promise.all([MeshoptSimplifier.ready, MeshoptEncoder.ready, MeshoptDecoder.ready]);
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({
  'meshopt.encoder': MeshoptEncoder, 'meshopt.decoder': MeshoptDecoder });
const doc = await io.read(IN);
const count = () => { let t = 0; for (const m of doc.getRoot().listMeshes()) for (const p of m.listPrimitives()) t += (p.getIndices()?.getCount() ?? p.getAttribute('POSITION').getCount()) / 3; return t; };
console.log('in tris', count());
await doc.transform(
  dedup(), flatten(), weld(),
  ...(RATIO < 1 ? [simplify({ simplifier: MeshoptSimplifier, ratio: RATIO, error: 0.002 })] : []),
  textureCompress({ encoder: sharp, targetFormat: 'webp', resize: [2048, 2048], quality: 94 }),
  prune(),
);
console.log('out tris', count());
/* no EXT_texture_webp: with it a texture's image lives under the extension
   and rescueTextures() (the strict-CSP path) reads json.textures[i].source,
   so the base colour would never be rescued. A plain source with an
   image/webp mimeType is how zavyoung.glb ships and how every browser here
   decodes it. */
for (const e of doc.getRoot().listExtensionsUsed()) if (e.extensionName === 'EXT_texture_webp') e.dispose();
await doc.transform(meshopt({ encoder: MeshoptEncoder, level: 'medium' }));
await io.write(OUT, doc);
