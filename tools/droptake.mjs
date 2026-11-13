/* v26.8 · A TAKE TAKEN OUT OF A BODY'S FILE, and nothing else touched (v5.20: a take nobody plays is not shipped).
   For a body whose own recipe cannot be run again on this machine (masters/v26.0/people.sh lays each body's paint out
   again with Blender's Python, which a fresh container does not have): the file is read whole (meshopt decoded), each
   named take and the samplers and keys that only it used are removed, and the file is written back with its own
   compression and nothing reordered or quantized again. tools/probes/samebody.mjs then proves that every kept number
   (every mesh's every attribute and triangle, every picture's bytes, every material, the skeleton, every kept take's
   every key) is what shipped.
     node tools/droptake.mjs <in.glb> <out.glb> <take> [<take> ...]
   Refuses a take the file does not have (a name mistyped would drop nothing and say nothing). */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder, MeshoptEncoder } from 'meshoptimizer';
await MeshoptDecoder.ready; await MeshoptEncoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder, 'meshopt.encoder': MeshoptEncoder });
const [src, out, ...names] = process.argv.slice(2);
if (!src || !out || !names.length) { console.error('usage: node tools/droptake.mjs <in.glb> <out.glb> <take> [...]'); process.exit(2); }
const doc = await io.read(src), root = doc.getRoot();
const have = root.listAnimations().map(a => a.getName());
const miss = names.filter(n => !have.includes(n));
if (miss.length) { console.error(src + ' has no take ' + miss.join(', ') + ' (it has ' + have.join(', ') + ')'); process.exit(1); }
let keys = 0;
for (const a of root.listAnimations()) {
  if (!names.includes(a.getName())) continue;
  const acc = new Set();
  for (const s of a.listSamplers()) { if (s.getInput()) acc.add(s.getInput()); if (s.getOutput()) acc.add(s.getOutput()); }
  for (const c of a.listChannels()) c.dispose();
  for (const s of a.listSamplers()) s.dispose();
  a.dispose();
  /* (a key used by nothing now but the document itself goes with it: a sampler's times may be shared, so each is
     asked, not assumed) */
  for (const x of acc) if (x.listParents().every(p => p === root)) { keys += x.getCount(); x.dispose(); }
}
await io.write(out, doc);
console.log(`${src} -> ${out}: took out ${names.join(', ')} (${keys} keys); kept ${root.listAnimations().map(a => a.getName()).join(', ')}`);
