/* v14.12 — soldier Master Zav, the equipment panel's figure for EPISODE 2.
   OFFLINE prep (not part of the build). Chad's 39 MB static scan (Meshy-style:
   one mesh, one baked material, base colour + normal + metal-roughness, no
   rig, no clips) shrunk to the shape zavyoung.glb has shipped in since v5.29:
   welded, simplified to about half, meshopt + quantization (zavLoader() carries
   the decoder), every sheet 1024 px WebP.
     node tools/prepzavsoldier.mjs <in.glb> <out.glb> [ratio]
   The panel's own zavNoMip() handles the atlas seams at draw time. */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { dedup, prune, weld, simplify, textureCompress, meshopt, flatten } from '@gltf-transform/functions';
import { MeshoptSimplifier, MeshoptEncoder, MeshoptDecoder } from 'meshoptimizer';
import sharp from 'sharp';
const [,, IN, OUT, R] = process.argv;
const RATIO = Number(R || 0.5);
await Promise.all([MeshoptSimplifier.ready, MeshoptEncoder.ready, MeshoptDecoder.ready]);
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({
  'meshopt.encoder': MeshoptEncoder, 'meshopt.decoder': MeshoptDecoder });
const doc = await io.read(IN);
const count = () => { let t = 0; for (const m of doc.getRoot().listMeshes()) for (const p of m.listPrimitives()) t += (p.getIndices()?.getCount() ?? p.getAttribute('POSITION').getCount()) / 3; return t; };
console.log('in tris', count());
await doc.transform(
  dedup(), flatten(), weld(),
  simplify({ simplifier: MeshoptSimplifier, ratio: RATIO, error: 0.002 }),
  textureCompress({ encoder: sharp, targetFormat: 'webp', resize: [1024, 1024], quality: 88 }),
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
