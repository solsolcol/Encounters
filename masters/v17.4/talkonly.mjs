/* v17.4 — the stall auntie's talking take, as its own small file.
 * Input: sitwoman.glb with the monk's Sitting_Answering_Questions retargeted
 * onto it (tools/retarget.mjs … meshy). Output: the skeleton's nodes and that
 * ONE clip, no mesh, no skin, no texture — the engine binds it to her clone by
 * bone name (motheranim/tangkianim precedent), so chapter 3's sitwoman.glb is
 * byte-for-byte untouched.
 * retarget.mjs writes rotations only, and a clip with no Hips translation lets
 * the mixer hand that bone back its BIND position (standing height), so the
 * hips translation of her own Sit_Cross_Legged take is copied in, as a track.
 * Usage: node masters/v17.4/talkonly.mjs in.glb out.glb */
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
const anims = root.listAnimations();
const idle = anims.find(a => /Sit_Cross_Legged/.test(a.getName()));
const talk = anims.find(a => a.getName() === 'Sitting_Answering_Questions');
if (!idle || !talk) throw new Error('missing a clip');
const hipsT = idle.listChannels().find(c => c.getTargetPath() === 'translation' && c.getTargetNode().getName() === 'Hips');
if (hipsT) {
  const src = hipsT.getSampler();
  const s = doc.createAnimationSampler().setInterpolation(src.getInterpolation())
    .setInput(src.getInput()).setOutput(src.getOutput());
  talk.addSampler(s);
  talk.addChannel(doc.createAnimationChannel().setTargetNode(hipsT.getTargetNode()).setTargetPath('translation').setSampler(s));
  console.log('   hips translation copied from the idle:', src.getOutput().getCount(), 'keys');
} else console.log('   the idle has no hips translation');
idle.dispose();
talk.setName('Talk');
for (const n of root.listNodes()) { if (n.getMesh()) n.setMesh(null); if (n.getSkin()) n.setSkin(null); }
for (const m of root.listMeshes()) m.dispose();
for (const s of root.listSkins()) s.dispose();
await doc.transform(prune());
for (const e of root.listExtensionsUsed()) if (!/mesh_quantization/.test(e.extensionName)) {} 
await io.write(outF, doc);
console.log('   ->', outF);
