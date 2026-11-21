import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder } from 'meshoptimizer';
await MeshoptDecoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({'meshopt.decoder':MeshoptDecoder});
for (const f of process.argv.slice(2)) { const d = await io.read(f); console.log(f, d.getRoot().listNodes().map(n=>n.getName()).filter(n=>!/Hand(Index|Ring|Pinky|Thumb|Middle)/.test(n)).join(' ')); }
