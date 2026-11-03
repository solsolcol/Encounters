/* v24.41 · CLOTH FOLDS — a rigged GLB posed by one of its takes in plain Node (linear skinning, as the GPU does), and the
   triangles of its robe below YTOP (rest height) counted whose skinned normals point against their own winding: cloth
   folded over itself, which shades dark from the side the camera sees. By the rest height of each such triangle, so a
   fold can be located (Grandmaster Pho's cross-legged sit: his file 9.7 %, v24.41's fitted chains 9.0 % — the fold is in
   every version; where it sits decides whether it shows).
     node tools/probes/clothfold.mjs <file.glb> <Take> <seconds> [YTOP=0.93] */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { Matrix3, Matrix4, Vector3 } from 'three';
import { makePoser } from '../gltfpose.mjs';
const [,, FILE, TAKE, T, YT] = process.argv, YTOP = YT ? +YT : 0.93;
const doc = await new NodeIO().registerExtensions(ALL_EXTENSIONS).read(FILE), root = doc.getRoot();
const P = makePoser(root), an = root.listAnimations().find(a => a.getName() === TAKE);
if (!an) { console.log('no take', TAKE); process.exit(1); }
P.pose(an, +T);
const skin = root.listSkins()[0], joints = skin.listJoints(), ibm = skin.getInverseBindMatrices().getArray();
const SK = joints.map((j, k) => new Matrix4().multiplyMatrices(P.world[P.NI.get(j)], new Matrix4().fromArray(ibm, k * 16)));
const prim = root.listMeshes()[0].listPrimitives()[0];
const pos = prim.getAttribute('POSITION'), nor = prim.getAttribute('NORMAL'), J = prim.getAttribute('JOINTS_0'), W = prim.getAttribute('WEIGHTS_0'), idx = prim.getIndices().getArray();
const n = pos.getCount(), PP = new Float32Array(n * 3), NN = new Float32Array(n * 3), rest = new Float32Array(n * 3);
const p = [0, 0, 0], nn = [0, 0, 0], jj = [0, 0, 0, 0], ww = [0, 0, 0, 0], v = new Vector3(), m = new Matrix4(), m3 = new Matrix3(), e = new Float32Array(16);
for (let i = 0; i < n; i++) { pos.getElement(i, p); nor.getElement(i, nn); J.getElement(i, jj); W.getElement(i, ww); rest.set(p, 3 * i); e.fill(0);
  for (let k = 0; k < 4; k++) { if (!ww[k]) continue; const a = SK[jj[k]].elements; for (let q = 0; q < 16; q++) e[q] += ww[k] * a[q]; }
  m.fromArray(e); v.fromArray(p).applyMatrix4(m); PP.set([v.x, v.y, v.z], 3 * i);
  v.fromArray(nn).applyMatrix3(m3.setFromMatrix4(m)).normalize(); NN.set([v.x, v.y, v.z], 3 * i); }
let bad = 0, tot = 0; const where = {};
const a = new Vector3(), b = new Vector3(), c = new Vector3(), fn = new Vector3(), vn = new Vector3(), t1 = new Vector3();
for (let t = 0; t < idx.length; t += 3) { const i0 = idx[t], i1 = idx[t + 1], i2 = idx[t + 2];
  if (rest[3 * i0 + 1] > YTOP) continue;
  a.fromArray(PP, 3 * i0); b.fromArray(PP, 3 * i1); c.fromArray(PP, 3 * i2); fn.crossVectors(t1.copy(b).sub(a), c.clone().sub(a)); const ar = fn.length(); if (ar < 1e-12) continue; fn.divideScalar(ar);
  vn.fromArray(NN, 3 * i0).add(t1.fromArray(NN, 3 * i1)).add(t1.fromArray(NN, 3 * i2)).normalize(); tot++;
  if (fn.dot(vn) < 0) { bad++; const hy = (Math.round(rest[3 * i0 + 1] * 10) / 10).toFixed(1); where[hy] = (where[hy] || 0) + 1; } }
console.log(`${FILE.split('/').pop()} ${TAKE} @ ${T}: ${tot} triangles under ${YTOP} m at rest, ${bad} folded against their winding (${(100 * bad / tot).toFixed(1)} %); by rest height:`,
  Object.entries(where).sort((x, y) => +x[0] - +y[0]).map(([h, k]) => `${h} ${k}`).join(', '));
