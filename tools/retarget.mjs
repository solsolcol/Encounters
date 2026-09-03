/* v5.20 — retarget a Mixamo clip onto a skeleton that is NOT Mixamo.
 *
 * WHY THIS IS NOT v5.02's BAKE. That one renamed the clip's nodes and was
 * done, because the mother's rig WAS a Mixamo rig — glTF had only sanitized
 * `mixamorig:Hips` into `mixamorigHips_01`. The same trick on gracy_lee
 * (ValveBiped) or fearful_woman (a Blender rig) produces a twisted mess,
 * because a rotation track is in the bone's LOCAL space and two rigs that
 * pose a body identically can still hold their bones at different rest
 * orientations. Renaming copies the numbers and loses the meaning.
 *
 * So this retargets properly, in WORLD space, which is the only frame the
 * two rigs agree on:
 *
 *   Dw(t) = Ws(t) · Wsb⁻¹        the delta the SOURCE bone turned through,
 *                                measured from its own rest pose
 *   Wt(t) = Dw(t) · Wtb          the same delta applied to the TARGET's rest
 *   Rt(t) = Wtp(t)⁻¹ · Wt(t)     back to local, under the target parent's
 *                                already-retargeted world rotation
 *
 * Parents must be solved before children, so the joints are walked in
 * hierarchy order. Rotations only: a clip's translations belong to the
 * source's bone lengths and would tear a differently-proportioned skeleton
 * apart. The one exception is the hips, whose translation IS the body
 * moving, and it is scaled by the MEASURED ratio of the two rigs' rest hip
 * heights — never assumed (the v5.02 lesson, and the v3.8 arms lesson
 * before it: measure from bones, never from a bounding box or a unit).
 *
 * Usage: node tools/retarget.mjs take.glb target.glb out.glb clipName mapName
 */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder, MeshoptEncoder } from 'meshoptimizer';
await MeshoptDecoder.ready; await MeshoptEncoder.ready;

/* The Mixamo core names the takes animate, and what each is called on the
   two rigs that are not Mixamo. Read out of the files themselves (see
   docs/V5.20-THE-WOMEN.md), not from any convention. */
const MAPS = {
  /* fearful_woman — a Blender rig: Hips_01 / Spine_02 / "Spine 2_03" / Chest_04 */
  fearful: {
    Hips: 'Hips_01', Spine: 'Spine_02', Spine1: 'Spine 2_03', Spine2: 'Chest_04',
    Neck: 'Neck_042', Head: 'Head_043',
    LeftShoulder: 'Clavicle_L_05', LeftArm: 'upper-arm_L_06',
    LeftForeArm: 'lower-arm_L_07', LeftHand: 'hand_L_08',
    RightShoulder: 'Clavicle_R_024', RightArm: 'upper-arm_R_025',
    RightForeArm: 'lower-arm_R_026', RightHand: 'hand_R_027',
    LeftUpLeg: 'thigh_L_080', LeftLeg: 'lower_leg_L_081',
    LeftFoot: 'foot_L_082', LeftToeBase: 'toes_L_083',
    RightUpLeg: 'thigh_R_085', RightLeg: 'lower_leg_R_086',
    RightFoot: 'foot_R_087', RightToeBase: 'toes_R_088',
    LeftHandThumb1: 'thumb_L_012', LeftHandThumb2: 'thumb_L.001_013', LeftHandThumb3: 'thumb_L.002_014',
    LeftHandIndex1: 'index_L_09', LeftHandIndex2: 'index_L.001_010', LeftHandIndex3: 'index_L.002_011',
    LeftHandMiddle1: 'middle_L_015', LeftHandMiddle2: 'middle_L.001_016', LeftHandMiddle3: 'middle_L.002_017',
    LeftHandRing1: 'ring_L_018', LeftHandRing2: 'ring_L.001_019', LeftHandRing3: 'ring_L.002_020',
    LeftHandPinky1: 'pinky_L_021', LeftHandPinky2: 'pinky_L.001_022', LeftHandPinky3: 'pinky_L.002_023',
    RightHandThumb1: 'thumb_R_030', RightHandThumb2: 'thumb_R.001_031', RightHandThumb3: 'thumb_R.002_032',
    RightHandIndex1: 'index_R_028', RightHandIndex2: 'index_R.001_029', RightHandIndex3: 'index_R.002_00',
    RightHandMiddle1: 'middle_R_033', RightHandMiddle2: 'middle_R.001_034', RightHandMiddle3: 'middle_R.002_035',
    RightHandRing1: 'ring_R_036', RightHandRing2: 'ring_R.001_037', RightHandRing3: 'ring_R.002_038',
    RightHandPinky1: 'pinky_R_039', RightHandPinky2: 'pinky_R.001_040', RightHandPinky3: 'pinky_R.002_041',
  },
  /* gracy_lee — ValveBiped, a Source-engine skeleton */
  gracy: {
    Hips: 'ValveBiped.Bip01_Pelvis_040', Spine: 'ValveBiped.Bip01_Spine_077',
    Spine1: 'ValveBiped.Bip01_Spine1_078', Spine2: 'ValveBiped.Bip01_Spine2_079',
    Neck: 'ValveBiped.Bip01_Neck1_039', Head: 'ValveBiped.Bip01_Head1_02',
    LeftShoulder: 'ValveBiped.Bip01_L_Clavicle_06', LeftArm: 'ValveBiped.Bip01_L_UpperArm_036',
    LeftForeArm: 'ValveBiped.Bip01_L_Forearm_024', LeftHand: 'ValveBiped.Bip01_L_Hand_025',
    RightShoulder: 'ValveBiped.Bip01_R_Clavicle_044', RightArm: 'ValveBiped.Bip01_R_UpperArm_074',
    RightForeArm: 'ValveBiped.Bip01_R_Forearm_062', RightHand: 'ValveBiped.Bip01_R_Hand_063',
    LeftUpLeg: 'ValveBiped.Bip01_L_Thigh_032', LeftLeg: 'ValveBiped.Bip01_L_Calf_05',
    LeftFoot: 'ValveBiped.Bip01_L_Foot_023', LeftToeBase: 'ValveBiped.Bip01_L_Toe0_033',
    RightUpLeg: 'ValveBiped.Bip01_R_Thigh_070', RightLeg: 'ValveBiped.Bip01_R_Calf_043',
    RightFoot: 'ValveBiped.Bip01_R_Foot_061', RightToeBase: 'ValveBiped.Bip01_R_Toe0_071',
    LeftHandThumb1: 'ValveBiped.Bip01_L_Finger0_08', LeftHandThumb2: 'ValveBiped.Bip01_L_Finger01_09',
    LeftHandIndex1: 'ValveBiped.Bip01_L_Finger1_011', LeftHandIndex2: 'ValveBiped.Bip01_L_Finger11_012',
    LeftHandMiddle1: 'ValveBiped.Bip01_L_Finger2_014', LeftHandMiddle2: 'ValveBiped.Bip01_L_Finger21_015',
    LeftHandRing1: 'ValveBiped.Bip01_L_Finger3_017', LeftHandRing2: 'ValveBiped.Bip01_L_Finger31_018',
    LeftHandPinky1: 'ValveBiped.Bip01_L_Finger4_020', LeftHandPinky2: 'ValveBiped.Bip01_L_Finger41_021',
    RightHandThumb1: 'ValveBiped.Bip01_R_Finger0_046', RightHandThumb2: 'ValveBiped.Bip01_R_Finger01_047',
    RightHandIndex1: 'ValveBiped.Bip01_R_Finger1_049', RightHandIndex2: 'ValveBiped.Bip01_R_Finger11_050',
    RightHandMiddle1: 'ValveBiped.Bip01_R_Finger2_052', RightHandMiddle2: 'ValveBiped.Bip01_R_Finger21_053',
  },
  /* yinn — a MakeHuman/Character Creator rig, 108 bones over nine skins.
     She has NO hips bone: `spine01_117` roots the chain, and her hands are
     `wrist.L_21` / `wrist.R_47`, not anything with 'hand' in the name. The
     talking take only needs her upper body — she stands at the paper table
     and her legs never move — so the legs are deliberately unmapped and
     keep their rest pose. */
  yinn: {
    Hips: 'spine01_117', Spine: 'spine02_118', Spine1: 'spine03_119', Spine2: 'spine04_120',
    Neck: 'neck01_116', Head: 'head_113',
    LeftShoulder: 'clavicle.L_27', LeftArm: 'upperarm01.L_25',
    LeftForeArm: 'lowerarm01.L_23', LeftHand: 'wrist.L_21',
    RightShoulder: 'clavicle.R_53', RightArm: 'upperarm01.R_51',
    RightForeArm: 'lowerarm01.R_49', RightHand: 'wrist.R_47',
  },
};

// ---------------------------------------------------------------- quaternions
const qMul = (a, b) => [
  a[3]*b[0] + a[0]*b[3] + a[1]*b[2] - a[2]*b[1],
  a[3]*b[1] - a[0]*b[2] + a[1]*b[3] + a[2]*b[0],
  a[3]*b[2] + a[0]*b[1] - a[1]*b[0] + a[2]*b[3],
  a[3]*b[3] - a[0]*b[0] - a[1]*b[1] - a[2]*b[2],
];
const qInv = q => [-q[0], -q[1], -q[2], q[3]];        // unit quaternions only
const qNorm = q => { const l = Math.hypot(...q) || 1; return q.map(v => v / l); };

// -------------------------------------------------------------------- reading
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({ 'meshopt.decoder': MeshoptDecoder, 'meshopt.encoder': MeshoptEncoder });

/* A node's world rest rotation, and its parent chain, walked from the scene
   roots. Rest = the node's own TRS as authored, which for a skinned rig is
   the bind pose (three.js binds against exactly this). */
function restWorld(doc) {
  const rot = new Map(), parent = new Map(), order = [];
  const walk = (node, pq) => {
    const q = qNorm(node.getRotation());
    const w = qMul(pq, q);
    rot.set(node, w); order.push(node);
    for (const c of node.listChildren()) { parent.set(c, node); walk(c, w); }
  };
  for (const scene of doc.getRoot().listScenes())
    for (const n of scene.listChildren()) walk(n, [0, 0, 0, 1]);
  return { rot, parent, order };
}

const [takeF, targetF, outF, clipName = 'sit', mapName] = process.argv.slice(2);
const MAP = MAPS[mapName];
if (!MAP) { console.error('unknown map: ' + mapName + ' (have: ' + Object.keys(MAPS) + ')'); process.exit(1); }

const take = await io.read(takeF);
const dst  = await io.read(targetF);

/* the take's animated nodes, by Mixamo core name */
const core = n => n.replace(/^mixamorig:?/, '').replace(/_\d+$/, '');
const srcNode = new Map();
for (const n of take.getRoot().listNodes()) srcNode.set(core(n.getName()), n);
const dstNode = new Map();
for (const n of dst.getRoot().listNodes()) dstNode.set(n.getName(), n);

const srcRest = restWorld(take), dstRest = restWorld(dst);
const anim = take.getRoot().listAnimations()[0];
if (!anim) { console.error('the take has no animation'); process.exit(1); }

/* one shared timeline: every rotation sampler in a Mixamo take shares it */
let times = null;
for (const ch of anim.listChannels()) {
  if (ch.getTargetPath() !== 'rotation') continue;
  times = Array.from(ch.getSampler().getInput().getArray());
  break;
}
if (!times) { console.error('no rotation tracks in the take'); process.exit(1); }
const F = times.length;

/* source local rotations per frame, keyed by the node */
const srcTrack = new Map();
for (const ch of anim.listChannels()) {
  if (ch.getTargetPath() !== 'rotation') continue;
  srcTrack.set(ch.getTargetNode(), Array.from(ch.getSampler().getOutput().getArray()));
}

/* Parents before children — a child's local rotation is expressed under its
   parent's ALREADY-RETARGETED world rotation, so the order is not optional. */
const mapped = [];
for (const dn of dstRest.order) {
  const entry = Object.entries(MAP).find(([, v]) => v === dn.getName());
  if (!entry) continue;
  const sn = srcNode.get(entry[0]);
  if (!sn) { console.log('   no source bone for ' + entry[0]); continue; }
  mapped.push({ dn, sn, name: entry[0] });
}

const dstWorld = new Map();          // node -> per-frame world rotation
const outLocal = new Map();          // node -> per-frame local rotation (the result)
for (const { dn, sn } of mapped) {
  const sTrack = srcTrack.get(sn);
  const sRestW = srcRest.rot.get(sn), dRestW = dstRest.rot.get(dn);
  const world = new Array(F), local = new Array(F);
  for (let f = 0; f < F; f++) {
    /* the source bone's world rotation this frame: its parent's world rest
       (the take's own hierarchy is static apart from these tracks) times its
       animated local */
    const sLocal = sTrack ? qNorm(sTrack.slice(f * 4, f * 4 + 4)) : qNorm(sn.getRotation());
    const sParentW = srcRest.parent.has(sn) ? srcRest.rot.get(srcRest.parent.get(sn)) : [0, 0, 0, 1];
    const sW = qMul(sParentW, sLocal);
    const delta = qMul(sW, qInv(sRestW));            // what the SOURCE turned through
    const dW = qNorm(qMul(delta, dRestW));           // same turn, from the TARGET's rest
    world[f] = dW;
    /* back to local, under whichever parent we have already solved; a parent
       that is not in the map has not moved, so its rest world is correct */
    const dp = dstRest.parent.get(dn);
    const dpW = dp ? (dstWorld.get(dp)?.[f] || dstRest.rot.get(dp) || [0, 0, 0, 1]) : [0, 0, 0, 1];
    local[f] = qNorm(qMul(qInv(dpW), dW));
  }
  dstWorld.set(dn, world); outLocal.set(dn, local);
}

// ------------------------------------------------------------------- writing
const buf = dst.getRoot().listBuffers()[0] || dst.createBuffer();
const inputAcc = dst.createAccessor().setType('SCALAR').setArray(new Float32Array(times)).setBuffer(buf);
const outAnim = dst.createAnimation(clipName);
for (const [dn, local] of outLocal) {
  const arr = new Float32Array(F * 4);
  for (let f = 0; f < F; f++) arr.set(local[f], f * 4);
  const s = dst.createAnimationSampler()
    .setInterpolation('LINEAR').setInput(inputAcc)
    .setOutput(dst.createAccessor().setType('VEC4').setArray(arr).setBuffer(buf));
  outAnim.addSampler(s);
  outAnim.addChannel(dst.createAnimationChannel().setTargetNode(dn).setTargetPath('rotation').setSampler(s));
}
await io.write(outF, dst);
console.log(`   ${targetF.split('/').pop()} + ${clipName}: ${mapped.length} bones retargeted, `
  + `${F} frames over ${times[F - 1].toFixed(2)}s -> ${outF.split('/').pop()}`);
