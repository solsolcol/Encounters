/* v26.0: A HAND OF ONE PIECE, MEASURED (Chad's monk has no finger bones: each hand is one piece). The hand's skin is read
   in the hand bone's own bind frame (its inverse bind times each point) and its three axes found (longest: the fingers'
   line; shortest: the palm's facing), set against the line of the tip bone the file carries, and each read in the bind
   pose's world. What a pose that lays this hand must be built from, before it is laid.
     node tools/probes/handaxes.mjs <file.glb> */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder } from 'meshoptimizer';
import * as THREE from 'three';
await MeshoptDecoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder });
const doc = await io.read(process.argv[2]), root = doc.getRoot(), skin = root.listSkins()[0], joints = skin.listJoints(), ibm = skin.getInverseBindMatrices().getArray();
const fmt = (v) => v.toArray().map(x => x.toFixed(2)).join(',');
for (const S of ['Left', 'Right']) {
  const re = new RegExp('^(mixamorig:?)?' + S + 'Hand$'), hi = joints.findIndex(j => re.test(j.getName())); if (hi < 0) { console.log('no ' + S + 'Hand'); continue; }
  const hand = joints[hi], tipN = hand.listChildren().find(c => joints.includes(c)), ti = tipN ? joints.indexOf(tipN) : -1;
  const IB = new THREE.Matrix4().fromArray(ibm, hi * 16), pts = [], v = new THREE.Vector3();
  for (const mesh of root.listMeshes()) for (const p of mesh.listPrimitives()) { const P = p.getAttribute('POSITION'), J = p.getAttribute('JOINTS_0'), W = p.getAttribute('WEIGHTS_0'); if (!J || !W) continue;
    const j4 = [0, 0, 0, 0], w4 = [0, 0, 0, 0], q = [0, 0, 0];
    for (let i = 0; i < P.getCount(); i++) { J.getElement(i, j4); W.getElement(i, w4); let w = 0; for (let k = 0; k < 4; k++) if (j4[k] === hi || (ti >= 0 && j4[k] === ti)) w += w4[k]; if (w < 0.6) continue;
      P.getElement(i, q); v.fromArray(q).applyMatrix4(IB); pts.push(v.clone()); } }
  const m = new THREE.Vector3(); for (const q of pts) m.add(q); m.multiplyScalar(1 / pts.length);
  const C = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]; for (const q of pts) { const d = q.clone().sub(m).toArray(); for (let a = 0; a < 3; a++) for (let b = 0; b < 3; b++) C[a][b] += d[a] * d[b] / pts.length; }
  const mul = (M, x) => [0, 1, 2].map(r => M[r][0] * x[0] + M[r][1] * x[1] + M[r][2] * x[2]), eig = [], M = C.map(r => r.slice());
  for (let e = 0; e < 3; e++) { let x = [0.3 + e, 0.7, 0.2 - e]; for (let it = 0; it < 300; it++) { x = mul(M, x); const l = Math.hypot(...x) || 1; x = x.map(u => u / l); }
    const lam = mul(M, x).reduce((s, u, i) => s + u * x[i], 0); eig.push({ lam, v: new THREE.Vector3(...x) }); for (let a = 0; a < 3; a++) for (let b = 0; b < 3; b++) M[a][b] -= lam * x[a] * x[b]; }
  const BW = IB.clone().invert(), qb = new THREE.Quaternion(); BW.decompose(new THREE.Vector3(), qb, new THREE.Vector3());
  const tipDir = tipN ? new THREE.Vector3(...tipN.getTranslation()).normalize() : null;
  console.log(`${S} hand: ${pts.length} points; their middle ${fmt(m)} (in the hand's frame); tip bone ${tipN ? tipN.getName() : 'none'} along ${tipDir ? fmt(tipDir) : '-'}; the hand at ${fmt(new THREE.Vector3().setFromMatrixPosition(BW))} in the bind world`);
  for (const [k, e] of eig.entries()) { const along = pts.map(q => q.clone().sub(m).dot(e.v)).sort((a, b) => a - b);
    console.log(`   axis ${k} (${['longest', 'middle', 'shortest'][k]}): spread ${(along[Math.floor(along.length * 0.97)] - along[Math.floor(along.length * 0.03)]).toFixed(3)} m; in the hand ${fmt(e.v)}, in the bind world ${fmt(e.v.clone().applyQuaternion(qb))}${tipDir ? `; ${(Math.acos(Math.min(1, Math.abs(e.v.dot(tipDir)))) * 180 / Math.PI).toFixed(0)} degrees from the tip's line` : ''}`); }
}
