/* v28.0 (E4C5, R26): TWO SKINNED FILES DRAW THE SAME BODY, measured with no browser: every point of every skinned piece of
   each file skinned on the CPU (the sum over its joints of weight . W . IBM, W from the node tree as a take poses it, in
   float64), at the bind pose and at moments of the takes named, and the two bodies' points compared one for one (the same
   pieces, the same points: a graft that only adds joints and splits weights between them). The first file's joints are
   found in the second by name; the second's own extra joints stand at their rest (no take moves them).
     node tools/probes/skinsame.mjs <a.glb> <b.glb> [take@t,take@t...] */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder } from 'meshoptimizer';
import * as THREE from 'three';
await MeshoptDecoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder });
const [FA, FB, POSES] = process.argv.slice(2);
const load = async (f) => {
  const doc = await io.read(f), root = doc.getRoot(), obj = new Map();
  for (const n of root.listNodes()) { const o = new THREE.Object3D(); o.name = n.getName(); o.position.fromArray(n.getTranslation()); o.quaternion.fromArray(n.getRotation()); o.scale.fromArray(n.getScale()); obj.set(n, o); }
  const scene = new THREE.Object3D(); for (const n of root.listNodes()) { const o = obj.get(n); for (const k of n.listChildren()) o.add(obj.get(k)); } for (const o of obj.values()) if (!o.parent) scene.add(o);
  const rest = new Map(); for (const o of obj.values()) rest.set(o, [o.position.clone(), o.quaternion.clone(), o.scale.clone()]);
  const skin = root.listSkins()[0], joints = skin.listJoints().map(j => obj.get(j)), ibm = skin.getInverseBindMatrices().getArray();
  const IBM = joints.map((_, k) => new THREE.Matrix4().fromArray(ibm, k * 16));
  const prims = []; root.listMeshes().forEach(m => m.listPrimitives().forEach(p => { if (p.getAttribute('JOINTS_0')) prims.push(p); }));
  const pose = (take, t) => { for (const [o, r] of rest) { o.position.copy(r[0]); o.quaternion.copy(r[1]); o.scale.copy(r[2]); }
    if (take) { const A = root.listAnimations().find(a => a.getName() === take); if (!A) throw new Error(f + ' has no take ' + take);
      const v = new THREE.Vector3(), q = new THREE.Quaternion(), q2 = new THREE.Quaternion();
      for (const c of A.listChannels()) { const s = c.getSampler(), ti = s.getInput().getArray(), va = s.getOutput().getArray(), o = obj.get(c.getTargetNode()), p = c.getTargetPath();
        let i = 0; while (i < ti.length - 1 && ti[i + 1] <= t) i++; const j = Math.min(ti.length - 1, i + 1), u = j === i ? 0 : Math.max(0, Math.min(1, (t - ti[i]) / (ti[j] - ti[i])));
        if (p === 'rotation') { q.fromArray(va, i * 4); q2.fromArray(va, j * 4); o.quaternion.copy(q).slerp(q2, u); } else if (p === 'translation') { o.position.fromArray(va, i * 3).lerp(v.fromArray(va, j * 3), u); } else if (p === 'scale') { o.scale.fromArray(va, i * 3).lerp(v.fromArray(va, j * 3), u); } } }
    scene.updateMatrixWorld(true); return joints.map((jo, k) => jo.matrixWorld.clone().multiply(IBM[k])); };
  const skinned = (B) => prims.map(p => { const P = p.getAttribute('POSITION'), J = p.getAttribute('JOINTS_0'), W = p.getAttribute('WEIGHTS_0'), n = P.getCount(), out = new Float64Array(n * 3);
    const e = [0, 0, 0], j = [0, 0, 0, 0], w = [0, 0, 0, 0], v = new THREE.Vector3(), acc = new THREE.Vector3(), t = new THREE.Vector3();
    for (let i = 0; i < n; i++) { P.getElement(i, e); J.getElement(i, j); W.getElement(i, w); v.fromArray(e); acc.set(0, 0, 0); let s = 0;
      for (let q = 0; q < 4; q++) { if (!(w[q] > 0)) continue; t.copy(v).applyMatrix4(B[j[q]]).multiplyScalar(w[q]); acc.add(t); s += w[q]; }
      acc.divideScalar(s || 1); out[i * 3] = acc.x; out[i * 3 + 1] = acc.y; out[i * 3 + 2] = acc.z; } return out; });
  return { pose, skinned, prims };
};
const A = await load(FA), B = await load(FB);
const poses = [[null, 0]].concat((POSES || '').split(',').filter(Boolean).map(s => { const [k, t] = s.split('@'); return [k, +t]; }));
let worst = 0;
for (const [take, t] of poses) {
  const a = A.skinned(A.pose(take, t)), b = B.skinned(B.pose(take, t));
  let mx = 0, n = 0; a.forEach((pa, pi) => { const pb = b[pi]; for (let i = 0; i < pa.length; i++) { const d = Math.abs(pa[i] - pb[i]); if (d > mx) mx = d; } n += pa.length / 3; });
  worst = Math.max(worst, mx);
  console.log(`${take ? take + ' at ' + t + ' s' : 'the bind pose'}: ${n} points, the most any moved ${mx.toExponential(2)} (the file's units)`);
}
console.log('worst', worst.toExponential(2));
process.exit(worst < 1e-6 ? 0 : 1);
