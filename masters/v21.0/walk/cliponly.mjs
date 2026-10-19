/* v21.0 — ONE retargeted take as its own small file (masters/v17.4's
 * talk-only recipe, generalised): the skeleton's nodes and that clip, no
 * mesh, no skin, no texture. The chapter binds it to the character's clone
 * by bone name, so the character's own file is byte-for-byte untouched.
 * Usage: node masters/v21.0/walk/cliponly.mjs in.glb clipName out.glb [newName] */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { prune } from '@gltf-transform/functions';
import { MeshoptDecoder, MeshoptEncoder } from 'meshoptimizer';
await MeshoptDecoder.ready; await MeshoptEncoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({ 'meshopt.decoder': MeshoptDecoder, 'meshopt.encoder': MeshoptEncoder });
const [inF, clipName, outF, newName] = process.argv.slice(2);
const doc = await io.read(inF);
const root = doc.getRoot();
const keep = root.listAnimations().find(a => a.getName() === clipName);
if (!keep) throw new Error('no clip ' + clipName + ' in ' + inF);
for (const a of root.listAnimations()) if (a !== keep) a.dispose();
if (newName) keep.setName(newName);
for (const n of root.listNodes()) { if (n.getMesh()) n.setMesh(null); if (n.getSkin()) n.setSkin(null); }
for (const m of root.listMeshes()) m.dispose();
for (const s of root.listSkins()) s.dispose();
await doc.transform(prune());
await io.write(outF, doc);
console.log('   ' + inF + ' : ' + clipName + ' ->', outF, '(' + root.listAnimations()[0].listChannels().length + ' channels)');
