import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder } from 'meshoptimizer';
await MeshoptDecoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({'meshopt.decoder':MeshoptDecoder});
for (const f of process.argv.slice(2)) { const d = await io.read(f); const h = d.getRoot().listNodes().find(n=>n.getName()==='Hips'); const a = h.getParentNode(); console.log(f.split('/').pop(), 'armature', a?.getName(), 'r', a?.getRotation().map(x=>x.toFixed(3)).join(','), 's', a?.getScale().map(x=>x.toFixed(3)).join(','), '| hips t', h.getTranslation().map(x=>x.toFixed(3)).join(','), 'r', h.getRotation().map(x=>x.toFixed(3)).join(','), '| armature parent', a?.getParentNode()?.getName()); }
