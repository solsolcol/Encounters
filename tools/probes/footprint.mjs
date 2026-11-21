/* v28.0 (E4C5, R25): HOW MUCH GROUND A BODY TAKES, measured with no browser: every point of a skinned file skinned on the
   CPU (as tools/probes/skinsame.mjs) at moments across a take, and the ground it covers read in its own frame (its origin
   the base's centre, metres): the box over x and z of all of it and of what is under a height (its legs and hem: what
   stands on the paving), and the farthest any point stands from its upright line. So bodies are set apart by what each
   really covers, never by a guessed width.
     node tools/probes/footprint.mjs <file.glb> [take] [samples] [under] */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder } from 'meshoptimizer';
import * as THREE from 'three';
await MeshoptDecoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder });
const [F, TAKE, NS, UNDER] = process.argv.slice(2);
const doc = await io.read(F), root = doc.getRoot(), obj = new Map();
for (const n of root.listNodes()) { const o = new THREE.Object3D(); o.name = n.getName(); o.position.fromArray(n.getTranslation()); o.quaternion.fromArray(n.getRotation()); o.scale.fromArray(n.getScale()); obj.set(n, o); }
const scene = new THREE.Object3D(); for (const n of root.listNodes()) { const o = obj.get(n); for (const k of n.listChildren()) o.add(obj.get(k)); } for (const o of obj.values()) if (!o.parent) scene.add(o);
const rest = new Map(); for (const o of obj.values()) rest.set(o, [o.position.clone(), o.quaternion.clone(), o.scale.clone()]);
const skin = root.listSkins()[0], joints = skin.listJoints().map(j => obj.get(j)), ibm = skin.getInverseBindMatrices().getArray();
const IBM = joints.map((_, k) => new THREE.Matrix4().fromArray(ibm, k * 16));
const prims = []; root.listMeshes().forEach(m => m.listPrimitives().forEach(p => { if (p.getAttribute('JOINTS_0')) prims.push(p); }));
const anim = TAKE ? root.listAnimations().find(a => a.getName() === TAKE) : null;
if (TAKE && !anim) { console.log('no take ' + TAKE + '; it has: ' + root.listAnimations().map(a => a.getName()).join(', ')); process.exit(2); }
let len = 0; if (anim) for (const c of anim.listChannels()) { const ti = c.getSampler().getInput().getArray(); len = Math.max(len, ti[ti.length - 1]); }
const pose = (t) => { for (const [o, r] of rest) { o.position.copy(r[0]); o.quaternion.copy(r[1]); o.scale.copy(r[2]); }
  if (anim) { const v = new THREE.Vector3(), q = new THREE.Quaternion(), q2 = new THREE.Quaternion();
    for (const c of anim.listChannels()) { const s = c.getSampler(), ti = s.getInput().getArray(), va = s.getOutput().getArray(), o = obj.get(c.getTargetNode()), p = c.getTargetPath();
      let i = 0; while (i < ti.length - 1 && ti[i + 1] <= t) i++; const j = Math.min(ti.length - 1, i + 1), u = j === i ? 0 : Math.max(0, Math.min(1, (t - ti[i]) / (ti[j] - ti[i])));
      if (p === 'rotation') { q.fromArray(va, i * 4); q2.fromArray(va, j * 4); o.quaternion.copy(q).slerp(q2, u); } else if (p === 'translation') { o.position.fromArray(va, i * 3).lerp(v.fromArray(va, j * 3), u); } else if (p === 'scale') { o.scale.fromArray(va, i * 3).lerp(v.fromArray(va, j * 3), u); } } }
  scene.updateMatrixWorld(true); return joints.map((jo, k) => jo.matrixWorld.clone().multiply(IBM[k])); };
const under = UNDER != null ? +UNDER : 0.6, n = anim ? Math.max(1, +NS || 16) : 1;
const all = { x0: 1e9, x1: -1e9, z0: 1e9, z1: -1e9, r: 0, y1: 0 }, low = { x0: 1e9, x1: -1e9, z0: 1e9, z1: -1e9, r: 0 };
const BAND = 0.2, bands = [], cells = [];                                      // (the farthest at each 20 cm of height; its ground, cell by cm)
const e = [0, 0, 0], jj = [0, 0, 0, 0], w = [0, 0, 0, 0], v = new THREE.Vector3(), acc = new THREE.Vector3(), t3 = new THREE.Vector3();
for (let si = 0; si < n; si++) {
  const t = anim ? (si / n) * len : 0, B = pose(t);
  for (const p of prims) { const P = p.getAttribute('POSITION'), J = p.getAttribute('JOINTS_0'), W = p.getAttribute('WEIGHTS_0'), cnt = P.getCount();
    for (let i = 0; i < cnt; i++) { P.getElement(i, e); J.getElement(i, jj); W.getElement(i, w); v.fromArray(e); acc.set(0, 0, 0); let s = 0;
      for (let q = 0; q < 4; q++) { if (!(w[q] > 0)) continue; t3.copy(v).applyMatrix4(B[jj[q]]).multiplyScalar(w[q]); acc.add(t3); s += w[q]; }
      acc.divideScalar(s || 1);
      const r = Math.hypot(acc.x, acc.z);
      all.x0 = Math.min(all.x0, acc.x); all.x1 = Math.max(all.x1, acc.x); all.z0 = Math.min(all.z0, acc.z); all.z1 = Math.max(all.z1, acc.z); all.r = Math.max(all.r, r); all.y1 = Math.max(all.y1, acc.y);
      { const b = Math.max(0, Math.floor(acc.y / BAND)); bands[b] = Math.max(bands[b] || 0, r); (cells[b] || (cells[b] = new Set())).add(Math.round(acc.x * 100) + ',' + Math.round(acc.z * 100)); }
      if (acc.y < under) { low.x0 = Math.min(low.x0, acc.x); low.x1 = Math.max(low.x1, acc.x); low.z0 = Math.min(low.z0, acc.z); low.z1 = Math.max(low.z1, acc.z); low.r = Math.max(low.r, r); } } }
}
/* each band's ground as a convex outline (its own frame, metres: x across, z its front), for a test of two bodies as turned */
const hullOf = (set) => { const pts = [...set].map(k => k.split(',').map(Number)).sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]), lo = [], up = [];
  for (const p of pts) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop(); lo.push(p); }
  for (let i = pts.length - 1; i >= 0; i--) { const p = pts[i]; while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], p) <= 0) up.pop(); up.push(p); }
  return lo.slice(0, -1).concat(up.slice(0, -1)).map(([x, z]) => [x / 100, z / 100]); };
const hulls = Array.from(cells, c => (c ? hullOf(c) : []));
const f = (o) => Object.fromEntries(Object.entries(o).map(([k, x]) => [k, +x.toFixed(3)]));
console.log(JSON.stringify({ file: F, take: TAKE || null, length: +len.toFixed(2), samples: n, under, all: f(all), low: f(low), band: BAND, r: Array.from(bands, x => +(x || 0).toFixed(3)), ...(process.env.HULL ? { hulls } : {}) }));
