/* v24.0 · A SILHOUETTE CUT of a rigged scan — for a shadow drawn by projection (episode 4 chapter 1's lagging shadow on
   the receiving room's wall, §7.4). A shadow is one flat colour, so everything a lit model needs goes: the UVs and the
   normals (they are what keep a simplifier from collapsing an edge — v8.0's attribute-seam law), every texture and
   material map, every clip (the shadow plays its master's own clips, bound by bone name). What stays is the skin: the
   positions, the joints and the weights, welded and simplified hard, quantized, meshopt-packed.
   Usage: node tools/prepshadow.mjs <in.glb> <out.glb> [ratio=0.03] */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { dedup, prune, weld, simplify, quantize, meshopt } from '@gltf-transform/functions';
import { MeshoptSimplifier, MeshoptEncoder, MeshoptDecoder } from 'meshoptimizer';

const [IN, OUT, R] = process.argv.slice(2);
if (!IN || !OUT) { console.error('usage: prepshadow.mjs in.glb out.glb [ratio]'); process.exit(1); }
const RATIO = Number(R || 0.03);
await MeshoptDecoder.ready; await MeshoptEncoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder, 'meshopt.encoder': MeshoptEncoder });
const doc = await io.read(IN);
const root = doc.getRoot();
let before = 0;
for (const mesh of root.listMeshes()) for (const prim of mesh.listPrimitives()) {
  const idx = prim.getIndices(); before += idx ? idx.getCount() / 3 : prim.getAttribute('POSITION').getCount() / 3;
  for (const sem of prim.listSemantics()) if (!['POSITION', 'JOINTS_0', 'WEIGHTS_0'].includes(sem)) prim.setAttribute(sem, null);
  const mat = prim.getMaterial();
  if (mat) { mat.setBaseColorTexture(null).setNormalTexture(null).setMetallicRoughnessTexture(null).setOcclusionTexture(null).setEmissiveTexture(null); }
}
for (const a of root.listAnimations()) a.dispose();
for (const t of root.listTextures()) t.dispose();
await doc.transform(weld({}), simplify({ simplifier: MeshoptSimplifier, ratio: RATIO, error: 0.02 }), prune(), dedup());
await doc.transform(quantize(), meshopt({ encoder: MeshoptEncoder, level: 'medium' }));
let after = 0;
for (const mesh of root.listMeshes()) for (const prim of mesh.listPrimitives()) { const idx = prim.getIndices(); after += idx ? idx.getCount() / 3 : 0; }
await io.write(OUT, doc);
const { statSync } = await import('node:fs');
console.log(`prepshadow ${OUT.split('/').pop()}: tris ${before} -> ${after}, ${Math.round(statSync(OUT).size / 1024)} KB`);
