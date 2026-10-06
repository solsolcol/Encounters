// the size of one named node in the thai kit (world box of its meshes), metres
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder } from 'meshoptimizer';
import { getBounds } from '@gltf-transform/core';
await MeshoptDecoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder });
const d = await io.read('assets/thaikit.glb');
for (const n of d.getRoot().listNodes()) if (process.argv.slice(2).includes(n.getName())) {
  const b = getBounds(n); console.log(n.getName(), 'min', b.min.map(v => v.toFixed(3)), 'max', b.max.map(v => v.toFixed(3)), 'size', b.max.map((v, i) => (v - b.min[i]).toFixed(3)));
}
