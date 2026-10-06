/* v18.7 — after tools/retarget.mjs has written CLIP (rotations only) onto the
   target, copy the SOURCE take's hips translation into it, scaled by the
   measured ratio of the two rigs' rest hip heights (retarget.mjs's own rule).
   Without it the mixer hands the hips their BIND position — standing height —
   and a seated take floats a man half a metre over his chair.
   node masters/v18.7/addhips.mjs retargeted.glb source.glb CLIP out.glb [SRCCLIP] */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder, MeshoptEncoder } from 'meshoptimizer';
await MeshoptDecoder.ready; await MeshoptEncoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder, 'meshopt.encoder': MeshoptEncoder });
const [tF, sF, CLIP, outF, SRC = CLIP] = process.argv.slice(2);   // SRC: the source take, when it is named differently
const dst = await io.read(tF), src = await io.read(sF);
const hips = d => d.getRoot().listNodes().find(n => /Hips$/.test(n.getName()));
const hD = hips(dst), hS = hips(src);
const k = hD.getTranslation()[1] / hS.getTranslation()[1];
const sa = src.getRoot().listAnimations().find(a => a.getName() === SRC);
const ch = sa.listChannels().find(c => c.getTargetPath() === 'translation' && c.getTargetNode() === hS);
const da = dst.getRoot().listAnimations().find(a => a.getName() === CLIP);
if (!ch || !da) throw new Error('missing clip or hips track');
if (da.listChannels().some(c => c.getTargetPath() === 'translation')) throw new Error('already has translation');
const buf = dst.getRoot().listBuffers()[0];
const ss = ch.getSampler();
const inp = dst.createAccessor().setType('SCALAR').setArray(new Float32Array(ss.getInput().getArray())).setBuffer(buf);
const out = Float32Array.from(ss.getOutput().getArray(), v => v * k);
const s = dst.createAnimationSampler().setInterpolation(ss.getInterpolation()).setInput(inp)
  .setOutput(dst.createAccessor().setType('VEC3').setArray(out).setBuffer(buf));
da.addSampler(s);
da.addChannel(dst.createAnimationChannel().setTargetNode(hD).setTargetPath('translation').setSampler(s));
await io.write(outF, dst);
console.log(`   ${CLIP}: hips translation copied, ${ss.getInput().getCount()} keys, scaled ×${k.toFixed(4)} -> ${outF}`);
