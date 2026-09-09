/* v7.1 — copy named takes from one Mixamo-cored rig into another, OFFLINE.
 *
 * Episode 2's soldiers all share the Mixamo core with its raw `mixamorig:`
 * names (docs/E2-SOLDIER-MODELS.md §4), so a take moves between them by
 * NAME — the v5.02 path, not the v5.20 world-space retarget, which is for
 * a rig that is not Mixamo. Two things the render tests proved a
 * transplant must do (dbg-render's `__borrowClips`):
 *
 *   1. DROP every position track except the hips'. These takes write
 *      position on every bone, so an unedited clip carries its source
 *      rig's bone lengths and units wholesale — the target keeps its own
 *      skeleton and wears only the rotations.
 *   2. SCALE the hips' position by the unit ratio. The FBX-derived files
 *      are in centimetres and the FBO family in metres; a metre clip onto a
 *      centimetre rig takes ×100. `auto` measures it: the median hip
 *      height of the target's own first clip over the source clip's.
 *
 * Usage: node tools/borrowclips.mjs target.glb source.glb out.glb "Clip,Clip" [hipScale|auto]
 */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder, MeshoptEncoder } from 'meshoptimizer';
await MeshoptDecoder.ready; await MeshoptEncoder.ready;

const [tgtP, srcP, outP, keepS = '', scaleS = 'auto'] = process.argv.slice(2);
const KEEP = keepS.split(',').map(s => s.trim()).filter(Boolean);
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({ 'meshopt.decoder': MeshoptDecoder, 'meshopt.encoder': MeshoptEncoder });
const tgt = await io.read(tgtP), src = await io.read(srcP);
const tRoot = tgt.getRoot(), sRoot = src.getRoot();
const byName = new Map(tRoot.listNodes().map(n => [n.getName(), n]));
const buffer = tRoot.listBuffers()[0] || tgt.createBuffer();

const hipsOf = n => /Hips$/.test(n.getName());
function medianHipY(anim) {
  for (const ch of anim.listChannels()) {
    if (ch.getTargetPath() !== 'translation' || !hipsOf(ch.getTargetNode())) continue;
    const a = ch.getSampler().getOutput().getArray();
    const ys = []; for (let i = 1; i < a.length; i += 3) ys.push(a[i]);
    ys.sort((p, q) => p - q); return ys[ys.length >> 1];
  }
  return null;
}
function hipScaleFor(sAnim) {
  if (scaleS !== 'auto') return +scaleS;
  const own = tRoot.listAnimations()[0];
  if (!own) throw new Error('auto hip scale needs a clip on the target — pass a number');
  const t = medianHipY(own), s = medianHipY(sAnim);
  if (t == null || s == null) throw new Error('no hips translation track to measure');
  /* snap to the unit steps this family actually has — 1, 100, 0.01 */
  const raw = t / s;
  const snap = [0.01, 1, 100].reduce((b, k) => Math.abs(Math.log(raw / k)) < Math.abs(Math.log(raw / b)) ? k : b, 1);
  console.log(`   hips: target ${t.toFixed(3)} / source ${s.toFixed(3)} = ${raw.toFixed(3)} -> x${snap}`);
  return snap;
}

for (const sAnim of sRoot.listAnimations()) {
  if (!KEEP.includes(sAnim.getName())) continue;
  const scale = hipScaleFor(sAnim);
  const anim = tgt.createAnimation(sAnim.getName());
  const inputs = new Map();
  let kept = 0, dropped = 0, missing = 0;
  for (const ch of sAnim.listChannels()) {
    const path = ch.getTargetPath(), node = ch.getTargetNode();
    const target = byName.get(node.getName());
    if (!target) { missing++; continue; }
    if (path === 'translation' && !hipsOf(node)) { dropped++; continue; }
    if (path === 'scale') { dropped++; continue; }
    const sSmp = ch.getSampler();
    const sIn = sSmp.getInput(), sOut = sSmp.getOutput();
    let input = inputs.get(sIn);
    if (!input) {
      input = tgt.createAccessor().setType('SCALAR').setArray(new Float32Array(sIn.getArray())).setBuffer(buffer);
      inputs.set(sIn, input);
    }
    let vals = new Float32Array(sOut.getArray());
    if (path === 'translation' && scale !== 1) vals = vals.map(v => v * scale);
    const output = tgt.createAccessor().setType(sOut.getType()).setArray(vals).setBuffer(buffer);
    const smp = tgt.createAnimationSampler().setInput(input).setOutput(output).setInterpolation(sSmp.getInterpolation());
    const nch = tgt.createAnimationChannel().setTargetNode(target).setTargetPath(path).setSampler(smp);
    anim.addSampler(smp).addChannel(nch); kept++;
  }
  console.log(`   ${sAnim.getName()}: ${kept} channels kept, ${dropped} position/scale dropped, ${missing} bones absent on the target`);
}
await io.write(outP, tgt);
console.log(`   ${outP.split('/').pop()}: clips now ${tRoot.listAnimations().map(a => a.getName()).join(', ')}`);
