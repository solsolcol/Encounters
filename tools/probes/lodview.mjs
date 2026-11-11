/* v26.0 · one level of a two-level file (tools/lodpair.mjs) on its own, to be LOOKED AT before it is drawn far off:
     node tools/probes/lodview.mjs <pair.glb> <out.glb> [far|near]     then tools/shootmodel.mjs <out.glb> ... */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { prune } from '@gltf-transform/functions';
import { MeshoptEncoder, MeshoptDecoder } from 'meshoptimizer';
await Promise.all([MeshoptEncoder.ready, MeshoptDecoder.ready]);
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.encoder': MeshoptEncoder, 'meshopt.decoder': MeshoptDecoder });
const [IN, OUT, LV = 'far'] = process.argv.slice(2);
const d = await io.read(IN);
for (const n of d.getRoot().listNodes()) if (n.getMesh() && !new RegExp('_' + LV + '$').test(n.getName())) n.dispose();
await d.transform(prune());
await io.write(OUT, d);
console.log('wrote', OUT, 'with only the', LV, 'level');
