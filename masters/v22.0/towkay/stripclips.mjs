// keep only the named clips in a GLB (meshopt-aware), prune what they leave behind
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { prune } from '@gltf-transform/functions';
import { MeshoptDecoder, MeshoptEncoder } from 'meshoptimizer';
await MeshoptDecoder.ready; await MeshoptEncoder.ready;
const [inp, out, ...keep] = process.argv.slice(2);
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder, 'meshopt.encoder': MeshoptEncoder });
const doc = await io.read(inp);
for (const a of doc.getRoot().listAnimations()) if (!keep.includes(a.getName())) { console.log('drop', a.getName()); a.dispose(); }
await doc.transform(prune({ keepAttributes: true, keepIndices: true, keepLeaves: true, keepSolidTextures: true }));
await io.write(out, doc);
console.log('kept', doc.getRoot().listAnimations().map(a => a.getName()).join(', '));
