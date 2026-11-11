/* v26.0 · the takes a model's file holds, each with its length: node tools/probes/takes.mjs <file.glb> ... */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder } from 'meshoptimizer';
await MeshoptDecoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder });
for (const f of process.argv.slice(2)) {
  const doc = await io.read(f);
  const L = doc.getRoot().listAnimations().map(a => { let d = 0; for (const s of a.listSamplers()) { const t = s.getInput().getArray(); d = Math.max(d, t[t.length - 1]); } return a.getName() + ' ' + d.toFixed(2); });
  console.log(f.split('/').pop().padEnd(18), L.length, '·', L.join(' | '));
}
