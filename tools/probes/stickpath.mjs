/* v28.0 (E4C5, R25/R26): WHERE THE NAGA STICK GOES IN HIS TAKES, with no browser. The grip's own solve (gripsolve.mjs's
   numbers: the shaft's middle C and line A in his right hand's frame) carried by his right hand as each take poses it, at
   steps across the window the fight plays it in; the stick's line from its foot to its top read against his head (the
   nearest it comes to the head bone and to a point 9 cm before it, his face) and his body (to the line from his hips to
   his neck), and how far from upright it stands. A take whose stick passes within a head's reach of his face, or through
   his body, is named.
     node tools/probes/stickpath.mjs [assets/p5pho.glb] take:t0:t1[,take:t0:t1...] [TILT=0 BACK=0.025 PALM=0.016 STICK_Y=1.05] */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder } from 'meshoptimizer';
import * as THREE from 'three';
await MeshoptDecoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder });
const args = process.argv.slice(2), pos = args.filter(a => !a.includes('=')), kv = Object.fromEntries(args.filter(a => a.includes('=')).map(a => a.split('=')));
const FILE = pos[0] || 'assets/p5pho.glb', WIN = (pos[1] || 'mage_soell_cast_7:0.45:2.2').split(',').map(s => { const [n, a, b] = s.split(':'); return [n, +a, +b]; });
const N = { TILT: 0, BACK: 0.025, PALM: 0.016, STICK_R: 0.036, STICK_Y: 1.05, LEN: 1.40 }; for (const k in kv) N[k] = +kv[k];
const doc = await io.read(FILE), root = doc.getRoot(), skin = root.listSkins()[0], joints = skin.listJoints(), ibm = skin.getInverseBindMatrices().getArray();
const nm = (j) => j.getName().replace(/^mixamorig:?/, '');
const obj = new Map(); for (const n of root.listNodes()) { const o = new THREE.Object3D(); o.position.fromArray(n.getTranslation()); o.quaternion.fromArray(n.getRotation()); o.scale.fromArray(n.getScale()); obj.set(n, o); }
const scene = new THREE.Object3D(); for (const n of root.listNodes()) { const o = obj.get(n); for (const k of n.listChildren()) o.add(obj.get(k)); } for (const o of obj.values()) if (!o.parent) scene.add(o);
const rest = new Map(); for (const o of obj.values()) rest.set(o, [o.position.clone(), o.quaternion.clone(), o.scale.clone()]);
const byName = (n) => { const j = joints.find(x => nm(x) === n); return j ? obj.get(j) : null; };
const bindPos = (n) => { const k = joints.findIndex(x => nm(x) === n); return new THREE.Vector3().setFromMatrixPosition(new THREE.Matrix4().fromArray(ibm, k * 16).invert()); };
const bindRot = (n) => { const k = joints.findIndex(x => nm(x) === n); const m = new THREE.Matrix4().fromArray(ibm, k * 16).invert(); return new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().extractRotation(m)); };
/* the grip's frame in the hand (as the chapter's solve: armsOf from the bind, then C and A) */
const ph = bindPos('RightHand'), f = bindPos('RightHandMiddle1').sub(ph).normalize(), ac = bindPos('RightHandIndex1').sub(bindPos('RightHandPinky1')); ac.addScaledVector(f, -ac.dot(f)).normalize();
const nrm = new THREE.Vector3().crossVectors(f, ac).multiplyScalar(-1).normalize(), ri = bindRot('RightHand').invert();
const fL = f.clone().applyQuaternion(ri), nL = nrm.clone().applyQuaternion(ri);
const hand = byName('RightHand'); scene.updateMatrixWorld(true);
const s = new THREE.Vector3().setFromMatrixColumn(hand.matrixWorld, 0).length(), M = (m) => m / s;
const J = (n) => { let p = new THREE.Vector3(); for (let i = 1; i <= 1; i++) p.add(new THREE.Vector3(...root.listNodes().find(x => x.getName().replace(/^mixamorig:?/, '') === n + i).getTranslation())); return p; };
const mid1 = J('RightHandMiddle'), idx1 = J('RightHandIndex'), pin1 = J('RightHandPinky');
const acL = idx1.clone().sub(pin1); acL.addScaledVector(fL, -acL.dot(fL)).normalize();
const T = N.TILT * Math.PI / 180, A = acL.clone().multiplyScalar(Math.cos(T)).addScaledVector(fL, Math.sin(T)).normalize();
const C = fL.clone().multiplyScalar(mid1.dot(fL) - M(N.BACK)).addScaledVector(nL, M(N.PALM + N.STICK_R));
let footL = C.clone().addScaledVector(A, -M(N.STICK_Y)), topL = C.clone().addScaledVector(A, M(N.LEN - N.STICK_Y));
const W = (o) => o.getWorldPosition(new THREE.Vector3());
/* a take posed at a moment */
const pose = (take, t) => { for (const [o, r] of rest) { o.position.copy(r[0]); o.quaternion.copy(r[1]); o.scale.copy(r[2]); }
  const an = root.listAnimations().find(a => a.getName() === take); if (!an) throw new Error('no take ' + take);
  const v = new THREE.Vector3(), q = new THREE.Quaternion(), q2 = new THREE.Quaternion();
  for (const c of an.listChannels()) { const sm = c.getSampler(), ti = sm.getInput().getArray(), va = sm.getOutput().getArray(), o = obj.get(c.getTargetNode()), p = c.getTargetPath();
    let i = 0; while (i < ti.length - 1 && ti[i + 1] <= t) i++; const j = Math.min(ti.length - 1, i + 1), u = j === i ? 0 : Math.max(0, Math.min(1, (t - ti[i]) / (ti[j] - ti[i])));
    if (p === 'rotation') { q.fromArray(va, i * 4); q2.fromArray(va, j * 4); o.quaternion.copy(q).slerp(q2, u); } else if (p === 'translation') { o.position.fromArray(va, i * 3).lerp(v.fromArray(va, j * 3), u); } else if (p === 'scale') { o.scale.fromArray(va, i * 3).lerp(v.fromArray(va, j * 3), u); } }
  scene.updateMatrixWorld(true); };
/* (OLD=1: the stick as it is laid without the grip, c_cast.js STICK5.inHand: stood upright on the paving under his palm's
   middle (halfway from his wrist to his middle finger's root) as his rest's standing moment holds him, Sit_to_Stand at
   5.9 s, and carried by his hand from there) */
if (kv.OLD === '1') { pose('Sit_to_Stand_Transition_M', 5.9); const hw = hand.matrixWorld.clone(), pm = W(hand).lerp(W(byName('RightHandMiddle1')), 0.5);
  const inv = hw.clone().invert(); footL = new THREE.Vector3(pm.x, 0, pm.z).applyMatrix4(inv); topL = new THREE.Vector3(pm.x, N.LEN, pm.z).applyMatrix4(inv); }
const segDist = (p, a, b) => { const ab = b.clone().sub(a), t = Math.max(0, Math.min(1, p.clone().sub(a).dot(ab) / ab.lengthSq())); return p.distanceTo(a.clone().addScaledVector(ab, t)); };
const segSeg = (a0, a1, b0, b1) => { let best = 9; for (let i = 0; i <= 40; i++) { const p = a0.clone().lerp(a1, i / 40); best = Math.min(best, segDist(p, b0, b1)); } return best; };
for (const [take, t0, t1] of WIN) {
  let worst = { face: 9, body: 9 }, rows = [];
  for (let k = 0; k <= 20; k++) { const t = t0 + (t1 - t0) * k / 20; pose(take, t);
    const hw = hand.matrixWorld, foot = footL.clone().applyMatrix4(hw), top = topL.clone().applyMatrix4(hw);
    const head = W(byName('Head')), neck = W(byName('Neck')), hips = W(byName('Hips'));
    const fwd = new THREE.Vector3().setFromMatrixColumn(byName('Head').matrixWorld, 2).normalize(), face = head.clone().addScaledVector(fwd, 0.09);
    const dFace = Math.min(segDist(face, foot, top), segDist(head, foot, top)), dBody = segSeg(foot, top, hips, neck);
    const up = top.clone().sub(foot).normalize(), tilt = Math.acos(Math.max(-1, Math.min(1, up.y))) * 180 / Math.PI;
    rows.push([+t.toFixed(2), +dFace.toFixed(3), +dBody.toFixed(3), +tilt.toFixed(0), +foot.y.toFixed(2), +top.y.toFixed(2)]);
    worst.face = Math.min(worst.face, dFace); worst.body = Math.min(worst.body, dBody); }
  console.log(take, t0 + '..' + t1, 'nearest his face %.2f m, his body line %.2f m'.replace('%.2f', worst.face.toFixed(2)).replace('%.2f', worst.body.toFixed(2)));
  for (const r of rows) console.log('   t', r[0], 'face', r[1], 'body', r[2], 'tilt', r[3], 'foot y', r[4], 'top y', r[5]);
}
