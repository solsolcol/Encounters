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
  /* v17.4: Meshy's auto-rig (sitwoman, the pink-shirt lady) — Mixamo's bones
     under its own names, and its spine numbered from the TOP down: Hips ->
     Spine02 -> Spine01 -> Spine, read off the file's own hierarchy */
  meshy: {
    Hips: 'Hips', Spine: 'Spine02', Spine1: 'Spine01', Spine2: 'Spine',
    Neck: 'neck', Head: 'Head',
    LeftShoulder: 'LeftShoulder', LeftArm: 'LeftArm', LeftForeArm: 'LeftForeArm', LeftHand: 'LeftHand',
    RightShoulder: 'RightShoulder', RightArm: 'RightArm', RightForeArm: 'RightForeArm', RightHand: 'RightHand',
    LeftUpLeg: 'LeftUpLeg', LeftLeg: 'LeftLeg', LeftFoot: 'LeftFoot', LeftToeBase: 'LeftToeBase',
    RightUpLeg: 'RightUpLeg', RightLeg: 'RightLeg', RightFoot: 'RightFoot', RightToeBase: 'RightToeBase',
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

// v19.6: rest WORLD positions through every node's full TRS (scale included)
const vSub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const vNorm = v => { const l = Math.hypot(...v); return l > 1e-9 ? v.map(x => x / l) : null; };
const qRot = (q, v) => { const p = qMul(qMul(q, [v[0], v[1], v[2], 0]), qInv(q)); return [p[0], p[1], p[2]]; };
const qFromTo = (a, b) => {
  const d = a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  if (d < -0.999999) { const ax = vNorm(Math.abs(a[0]) < 0.9 ? [0, -a[2], a[1]] : [-a[2], 0, a[0]]); return [ax[0], ax[1], ax[2], 0]; }
  const c = [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  return qNorm([c[0], c[1], c[2], 1 + d]);
};
function restPos(doc) {
  const pos = new Map(), frame = new Map();         // frame: [worldPos, worldRot, worldScale]
  const walk = (node, P) => {
    const t = node.getTranslation(), r = qNorm(node.getRotation()), sc = node.getScale();
    const wp = P ? vAdd(P[0], qRot(P[1], [t[0] * P[2][0], t[1] * P[2][1], t[2] * P[2][2]])) : t.slice();
    const wr = P ? qMul(P[1], r) : r, ws = P ? [P[2][0] * sc[0], P[2][1] * sc[1], P[2][2] * sc[2]] : sc.slice();
    pos.set(node, wp); frame.set(node, [wp, wr, ws]);
    for (const c of node.listChildren()) walk(c, [wp, wr, ws]);
  };
  for (const scene of doc.getRoot().listScenes()) for (const n of scene.listChildren()) walk(n, null);
  pos.frame = frame;
  return pos;
}
const vAdd = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];

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

const ARGS = process.argv.slice(2).filter(a => !a.startsWith('--'));
const ALIGN = process.argv.includes('--align'), HIPS = process.argv.includes('--hips');
const [takeF, targetF, outF, clipName = 'sit', mapName] = ARGS;
const take = await io.read(takeF);
const dst  = await io.read(targetF);

/* v7.6: `mixamo` — a Mixamo-cored TARGET, mapped from its own bones. Two
   Mixamo rigs can still hold their bones at different rest orientations
   (the admin tee's FBX-derived talking rig against its 4-animation glb:
   copying the takes BY NAME tore the cloth off him, docs/V7.5-E2C1-REBUILD.md
   CP1 record), so they go through the same world-space path as a rig that
   is not Mixamo at all. The map is the identity over whatever core names
   the target actually carries. */
const MAP = mapName === 'mixamo'
  ? Object.fromEntries(dst.getRoot().listNodes()
      .filter(n => /^mixamorig/.test(n.getName()))
      .map(n => [n.getName().replace(/^mixamorig\d*:?/, '').replace(/_\d+$/, ''), n.getName()]))   // v21.0: and a NUMBERED prefix (mixamorig9:, a second Mixamo export)
  : MAPS[mapName];
if (!MAP) { console.error('unknown map: ' + mapName + ' (have: ' + Object.keys(MAPS) + ', mixamo)'); process.exit(1); }

/* the take's animated nodes, by Mixamo core name */
const core = n => n.replace(/^mixamorig\d*:?/, '').replace(/_\d+$/, '');
const srcNode = new Map();
for (const n of take.getRoot().listNodes()) srcNode.set(core(n.getName()), n);
const dstNode = new Map();
for (const n of dst.getRoot().listNodes()) dstNode.set(n.getName(), n);

const srcRest = restWorld(take), dstRest = restWorld(dst);
/* v7.6: the take file may carry several clips — the one NAMED is used,
   the first only when no clip carries that name */
const anim = take.getRoot().listAnimations().find(a => a.getName() === clipName) || take.getRoot().listAnimations()[0];
if (!anim) { console.error('the take has no animation'); process.exit(1); }

/* v7.9: a take's rotation channels do NOT have to share one timeline. A raw
   Mixamo export does; a take that has been through an optimiser (every clip
   in this repo's shipped assets has) is keyed SPARSELY, each channel with
   its own times and its own frame count — 30 of encik's 51 channels hold a
   single key. Slicing all of them off one timeline read past the end of the
   short ones and wrote NaN into 39 of 41 bones. So: the densest channel
   gives the shared timeline, and every channel is SAMPLED on it, in its own
   time base, nearest-neighbour with a lerp between the two keys it lies
   between (a slerp is not needed at these step sizes — the result is
   normalised straight after). */
const rotCh = anim.listChannels().filter(ch => ch.getTargetPath() === 'rotation');
if (!rotCh.length) { console.error('no rotation tracks in the take'); process.exit(1); }
let times = null;
for (const ch of rotCh) {
  const t = Array.from(ch.getSampler().getInput().getArray());
  if (!times || t.length > times.length) times = t;
}
const F = times.length;

/* source local rotations, keyed by the node: its own times and values */
const srcTrack = new Map();
for (const ch of rotCh) {
  srcTrack.set(ch.getTargetNode(), {
    t: Array.from(ch.getSampler().getInput().getArray()),
    v: Array.from(ch.getSampler().getOutput().getArray()),
  });
}
/* the track's rotation at time `time`, in its own time base */
const sampleQ = (tr, time) => {
  const { t, v } = tr;
  const n = t.length;
  if (n === 1) return qNorm(v.slice(0, 4));
  if (time <= t[0]) return qNorm(v.slice(0, 4));
  if (time >= t[n - 1]) return qNorm(v.slice((n - 1) * 4, n * 4));
  let i = 0;
  while (i < n - 2 && t[i + 1] < time) i++;
  const k = (time - t[i]) / ((t[i + 1] - t[i]) || 1);
  const a = v.slice(i * 4, i * 4 + 4), b = v.slice((i + 1) * 4, (i + 1) * 4 + 4);
  const dot = a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
  const sgn = dot < 0 ? -1 : 1;                    // the short way round
  return qNorm(a.map((x, j) => x + (b[j] * sgn - x) * k));
};

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

/* v18.7: the source bone's world rotation this frame is its parent's
   ANIMATED world rotation times its own animated local — solved parents
   first over the take's whole hierarchy. Until v18.7 this read the parent's
   world REST, which is only right while every parent holds still: a take
   retargeted back onto its OWN rig came out 126° wrong at the feet
   (masters/v18.7/selfcmp.mjs), because every hips/spine/leg turn above a
   bone was left out of that bone's world. */
const srcWorld = new Map();
for (const sn of srcRest.order) {
  const tr = srcTrack.get(sn), pa = srcRest.parent.get(sn), pw = pa ? srcWorld.get(pa) : null;
  const rows = new Array(F);
  for (let f = 0; f < F; f++) {
    const l = tr ? sampleQ(tr, times[f]) : qNorm(sn.getRotation());
    rows[f] = qNorm(qMul(pw ? pw[f] : [0, 0, 0, 1], l));
  }
  srcWorld.set(sn, rows);
}

/* v19.6 · --align: TWO RIGS AT DIFFERENT REST POSES. The delta above is "how
   far the source bone turned from ITS rest", and applying it to the target's
   rest only works when both rests are the same body pose. A Mixamo take rests
   in a T-pose and Meshy's auto-rig in an A-pose (Chad's congregation), so
   every arm came out 45° off. With --align, each bone's target rest is first
   SWUNG onto the source rest's bone direction (bone → its mapped child, in
   world space, measured from the files' own TRS chains), and the delta is
   applied to that: the bone's animated direction then equals the source's.
   Twist about the bone stays the target's own. Without the flag nothing
   changes. */
const ALIGNQ = new Map();
const CHILD = { Hips: 'Spine', Spine: 'Spine1', Spine1: 'Spine2', Spine2: 'Neck', Neck: 'Head', Head: 'HeadTop_End',
  LeftShoulder: 'LeftArm', LeftArm: 'LeftForeArm', LeftForeArm: 'LeftHand', LeftHand: 'LeftHandMiddle1',
  RightShoulder: 'RightArm', RightArm: 'RightForeArm', RightForeArm: 'RightHand', RightHand: 'RightHandMiddle1',
  LeftUpLeg: 'LeftLeg', LeftLeg: 'LeftFoot', LeftFoot: 'LeftToeBase', LeftToeBase: 'LeftToe_End',
  RightUpLeg: 'RightLeg', RightLeg: 'RightFoot', RightFoot: 'RightToeBase', RightToeBase: 'RightToe_End' };
/* a target bone's child for the direction: the mapped child if mapped, else its first child (an _End tip) */
const dstChild = (dn, name) => { const cn = MAP[CHILD[name]]; const c = cn && dstNode.get(cn); return c || dn.listChildren()[0] || null; };
const srcChild = (sn, name) => srcNode.get(CHILD[name]) || sn.listChildren()[0] || null;
if (ALIGN) {
  const sP = restPos(take), dP = restPos(dst);
  for (const { dn, sn, name } of mapped) {
    if (name === 'Hips') continue;                // the hips' rest is the body's: never swung
    const dc = dstChild(dn, name), sc = srcChild(sn, name);
    if (!dc || !sc) continue;
    const vd = vNorm(vSub(dP.get(dc), dP.get(dn))), vs = vNorm(vSub(sP.get(sc), sP.get(sn)));
    if (!vd || !vs) continue;
    ALIGNQ.set(dn, qFromTo(vd, vs));
  }
  console.log(`   --align: ${ALIGNQ.size} bones swung onto the source's rest`);
}
const dstWorld = new Map();          // node -> per-frame world rotation
const outLocal = new Map();          // node -> per-frame local rotation (the result)
for (const { dn, sn } of mapped) {
  const sRestW = srcRest.rot.get(sn), dRestW = dstRest.rot.get(dn);
  const world = new Array(F), local = new Array(F);
  for (let f = 0; f < F; f++) {
    const sW = srcWorld.get(sn)[f];
    const delta = qMul(sW, qInv(sRestW));            // what the SOURCE turned through
    const dW = qNorm(qMul(qMul(delta, ALIGNQ.get(dn) || [0, 0, 0, 1]), dRestW));   // same turn, from the TARGET's rest (v19.6: rest aligned to the source's first)
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
/* v19.6 · --hips: the hips' TRANSLATION, carried across in WORLD space — a
   kneeling take lowers the body, and rotations alone leave a kneeling man
   at standing height. The source hips' world offset from its rest, scaled by
   the ratio of the two rigs' rest hip HEIGHTS (measured, v5.02's law), added
   to the target's rest and brought back into the target hips' parent frame. */
if (HIPS) {
  const sH = srcNode.get('Hips'), dH = dstNode.get(MAP.Hips);
  const tch = anim.listChannels().find(ch => ch.getTargetPath() === 'translation' && ch.getTargetNode() === sH);
  if (sH && dH && tch) {
    const sP = restPos(take), dP = restPos(dst);
    const sPa = sP.frame.get(srcRest.parent.get(sH)) || [[0, 0, 0], [0, 0, 0, 1], [1, 1, 1]];
    const dPa = dP.frame.get(dstRest.parent.get(dH)) || [[0, 0, 0], [0, 0, 0, 1], [1, 1, 1]];
    const sRest = sP.get(sH), dRest = dP.get(dH), k = dRest[1] / sRest[1];
    const tt = Array.from(tch.getSampler().getInput().getArray()), tv = Array.from(tch.getSampler().getOutput().getArray());
    const at = (time) => { let i = 0; while (i < tt.length - 2 && tt[i + 1] < time) i++; const u = tt.length > 1 ? Math.min(1, Math.max(0, (time - tt[i]) / ((tt[i + 1] - tt[i]) || 1))) : 0;
      const a = tv.slice(i * 3, i * 3 + 3), b = tt.length > 1 ? tv.slice((i + 1) * 3, i * 3 + 6) : a; return a.map((x, j) => x + (b[j] - x) * u); };
    const toWorld = (P, l) => vAdd(P[0], qRot(P[1], [l[0] * P[2][0], l[1] * P[2][1], l[2] * P[2][2]]));
    const toLocal = (P, w) => { const d = qRot(qInv(P[1]), vSub(w, P[0])); return [d[0] / P[2][0], d[1] / P[2][1], d[2] / P[2][2]]; };
    const arr = new Float32Array(F * 3);
    for (let f = 0; f < F; f++) {
      const sw = toWorld(sPa, at(times[f]));
      const dw = vAdd(dRest, vSub(sw, sRest).map(v => v * k));
      arr.set(toLocal(dPa, dw), f * 3);
    }
    const s = dst.createAnimationSampler().setInterpolation('LINEAR').setInput(inputAcc)
      .setOutput(dst.createAccessor().setType('VEC3').setArray(arr).setBuffer(buf));
    outAnim.addSampler(s);
    outAnim.addChannel(dst.createAnimationChannel().setTargetNode(dH).setTargetPath('translation').setSampler(s));
    console.log(`   --hips: rest heights ${sRest[1].toFixed(3)} -> ${dRest[1].toFixed(3)} (x${k.toFixed(4)}), lowest ${Math.min(...Array.from({ length: F }, (_, f) => toWorld(dPa, Array.from(arr.slice(f * 3, f * 3 + 3)))[1])).toFixed(3)}`);
  } else console.log('   --hips: no hips translation in the take');
}
await io.write(outF, dst);
console.log(`   ${targetF.split('/').pop()} + ${clipName}: ${mapped.length} bones retargeted, `
  + `${F} frames over ${times[F - 1].toFixed(2)}s -> ${outF.split('/').pop()}`);
