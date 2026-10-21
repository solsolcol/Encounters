/* v21.16 — his crossed legs on Ma's floor (episode 3 chapter 2's film, shot 3), from a REAL model: Chad's
 * congregation man (cg_man2hd) on the monk's own Sit_Cross_Legged_on_Floor take, retargeted onto his rig
 * (tools/retarget.mjs … meshy --align --hips). This writes the skeleton's nodes and that ONE clip, no mesh, no
 * skin, no texture — the chapter binds it to its own cg_man2hd clone by bone name (sitwomantalk's precedent,
 * v17.4), so cg_man2hd.glb is byte-for-byte untouched and the download is a few kilobytes.
 * Usage: node masters/v21.16/crossonly.mjs in.glb out.glb */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { prune } from '@gltf-transform/functions';
import { MeshoptDecoder, MeshoptEncoder } from 'meshoptimizer';
await MeshoptDecoder.ready; await MeshoptEncoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({ 'meshopt.decoder': MeshoptDecoder, 'meshopt.encoder': MeshoptEncoder });
const [inF, outF] = process.argv.slice(2);
const doc = await io.read(inF);
const root = doc.getRoot();
const keep = root.listAnimations().find(a => a.getName() === 'Sit_Cross_Legged_on_Floor');
if (!keep) throw new Error('no Sit_Cross_Legged_on_Floor in ' + inF);
for (const a of root.listAnimations()) if (a !== keep) a.dispose();
keep.setName('cross');
for (const n of root.listNodes()) { if (n.getMesh()) n.setMesh(null); if (n.getSkin()) n.setSkin(null); }
for (const m of root.listMeshes()) m.dispose();
for (const s of root.listSkins()) s.dispose();
await doc.transform(prune());
await io.write(outF, doc);
console.log('   ->', outF, keep.listChannels().length, 'channels');
