/* v26.18 · a game file written again WITHOUT meshopt or quantization, so that Blender can open it (its importer reads
   neither): node tools/glbplain.mjs <in.glb> <out.glb>. Nothing else is changed: the same meshes, skins, takes, sheets. */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { dequantize } from '@gltf-transform/functions';
import { MeshoptDecoder } from 'meshoptimizer';
await MeshoptDecoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder });
const doc = await io.read(process.argv[2]);
await doc.transform(dequantize());
for (const e of doc.getRoot().listExtensionsUsed()) if (/meshopt|quantization/.test(e.extensionName)) e.dispose();
await io.write(process.argv[3], doc);
console.log('wrote', process.argv[3], 'extensions left:', doc.getRoot().listExtensionsUsed().map(e => e.extensionName).join(', ') || 'none');
