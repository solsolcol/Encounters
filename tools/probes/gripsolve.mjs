/* v28.0 (E4C5, R25/R26): HIS GRIP ON THE NAGA STICK SOLVED WITH NO BROWSER. The chapter's own solve (c_fightstage.js
   PHOGRIP5: solve(), its finger(), thumb() and chainQ(), the same numbers) run on p5pho.glb's right hand as it is bound
   (armsOf's frame: the fingers' line, the palm's facing, from the bind), each finger's joints then carried down its chain
   by the turns found, and every point of his skin that his right hand or a finger of it carries skinned there (the rest
   of him at his bind). Written as JSON for tools/probes/gripdraw.py to draw: the shaft's circle and each finger seen down
   the shaft's line and from the back of his hand, and each skin point's distance from the shaft's surface.
     node tools/probes/gripsolve.mjs [assets/p5pho.glb] [out.json] [TILT=18] [STICK_Y=1.10] [THUMB_R=0.009] ... (NAME=value) */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder } from 'meshoptimizer';
import * as THREE from 'three';
import fs from 'node:fs';
await MeshoptDecoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder });
const args = process.argv.slice(2), pos = args.filter(a => !a.includes('=')), kv = Object.fromEntries(args.filter(a => a.includes('=')).map(a => a.split('=')));
const FILE = pos[0] || 'assets/p5pho.glb', OUT = pos[1] || '/tmp/gripsolve.json';
const D2R = Math.PI / 180;
const NUM = { STICK_R: 0.036, BACK: 0.018, PALM: 0.012, FING_R: 0.008, GAP: 0.003, TILT: 18, THUMB_R: 0.009 };
for (const k in kv) NUM[k] = +kv[k];
const LIM = { f: [90, 110, 85], t: [60, 60, 80] };
const doc = await io.read(FILE), root = doc.getRoot(), skin = root.listSkins()[0], joints = skin.listJoints(), ibm = skin.getInverseBindMatrices().getArray();
const nm = (j) => j.getName().replace(/^mixamorig:?/, '');
const bind = new Map(); joints.forEach((j, k) => bind.set(nm(j), new THREE.Matrix4().fromArray(ibm, k * 16).invert()));
const node = (n) => joints.find(j => nm(j) === n);
const at = (n) => bind.has(n) ? new THREE.Vector3().setFromMatrixPosition(bind.get(n)) : null;
/* armsOf, the right hand */
const mh = bind.get('RightHand'), ph = at('RightHand'), side = -1;
const f = at('RightHandMiddle1').sub(ph).normalize(), ac = at('RightHandIndex1').sub(at('RightHandPinky1')); ac.addScaledVector(f, -ac.dot(f)).normalize();
const nrm = new THREE.Vector3().crossVectors(f, ac).multiplyScalar(side).normalize();
const ri = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().extractRotation(mh)).invert();
const fL = f.clone().applyQuaternion(ri), nL = nrm.clone().applyQuaternion(ri);
/* (the nodes as a tree in metres, every joint at its rest: the bind matrices above are the vertex space's, scaled; the solve
   and the skin are read in the bones' own metres, as the chapter's are) */
const obj = new Map(); for (const n of root.listNodes()) { const o = new THREE.Object3D(); o.position.fromArray(n.getTranslation()); o.quaternion.fromArray(n.getRotation()); o.scale.fromArray(n.getScale()); obj.set(n, o); }
const scene = new THREE.Object3D(); for (const n of root.listNodes()) { const o = obj.get(n); for (const k of n.listChildren()) o.add(obj.get(k)); } for (const o of obj.values()) if (!o.parent) scene.add(o);
scene.updateMatrixWorld(true);
const handObj = obj.get(node('RightHand')), s = new THREE.Vector3().setFromMatrixColumn(handObj.matrixWorld, 0).length(), M = (m) => m / s;     // (metres to the hand's units)
/* the solve, as the chapter's */
const NAMES = ['Thumb', 'Index', 'Middle', 'Ring', 'Pinky'], chains = {}, J = {};
for (const n of NAMES) { chains[n] = [1, 2, 3, 4].map(i => node('RightHand' + n + i)); const p = [new THREE.Vector3()];
  for (let i = 0; i < 4; i++) p.push(p[i].clone().add(new THREE.Vector3(...chains[n][i].getTranslation()))); p.shift(); J[n] = p; }
const TILT = NUM.TILT * D2R;
const acL = J.Index[0].clone().sub(J.Pinky[0]); acL.addScaledVector(fL, -acL.dot(fL)).normalize();
const up = nL.clone().negate();
const A = acL.clone().multiplyScalar(Math.cos(TILT)).addScaledVector(fL, Math.sin(TILT)).normalize();
const C = fL.clone().multiplyScalar(J.Middle[0].dot(fL) - M(NUM.BACK)).addScaledVector(nL, M(NUM.PALM + NUM.STICK_R));
const arc = (l, r) => 2 * Math.asin(Math.min(1, l / (2 * r)));
const finger = (n) => {
  const P0 = J[n][0], seg = [0, 1, 2].map(i => J[n][i + 1].clone().sub(J[n][i])), l = seg.map(v => v.length());
  const d = seg[0].clone().normalize(), w = d.clone().cross(nL).normalize();
  const cs = C.clone().addScaledVector(A, P0.clone().sub(C).dot(w) / A.dot(w));
  const x3 = d.clone().addScaledVector(w, -d.dot(w)).normalize(), y3 = w.clone().cross(x3).normalize(); if (y3.dot(up) < 0) y3.negate();
  const to2 = (p) => [p.clone().sub(P0).dot(x3), p.clone().sub(P0).dot(y3)], c = to2(cs), rho = M(NUM.STICK_R + NUM.FING_R + NUM.GAP);
  let phi = 0; const hit = (ph) => Math.hypot(l[0] * Math.cos(ph) - c[0], -l[0] * Math.sin(ph) - c[1]) - rho;
  for (let t = 0; t <= 100; t++) { const ph = t * D2R; if (hit(ph) <= 0) { phi = ph; break; } phi = ph; }
  for (let it = 0; it < 30; it++) { const a0 = phi - D2R, a1 = phi; const m2 = (a0 + a1) / 2; if (hit(m2) <= 0) phi = m2; else break; }
  const p1 = [l[0] * Math.cos(phi), -l[0] * Math.sin(phi)];
  let al = Math.atan2(p1[1] - c[1], p1[0] - c[0]); const pts = [[0, 0], p1];
  for (const li of [l[1], l[2]]) { al -= arc(li, rho); pts.push([c[0] + rho * Math.cos(al), c[1] + rho * Math.sin(al)]); }
  return { x3, y3, pts, lim: LIM.f, c, rho, phi: phi / D2R };
};
const thumb = () => {
  const P0 = J.Thumb[0], seg = [0, 1, 2].map(i => J.Thumb[i + 1].clone().sub(J.Thumb[i])), l = seg.map(v => v.length());
  const st = J.Thumb[1].clone().sub(C).dot(A), cs = C.clone().addScaledVector(A, st);
  const x3 = fL.clone().addScaledVector(A, -fL.dot(A)).normalize(), y3 = A.clone().cross(x3).normalize(); if (y3.dot(up) < 0) y3.negate();
  const rho = M(NUM.STICK_R + NUM.THUMB_R + NUM.GAP), Q = (b) => cs.clone().addScaledVector(x3, rho * Math.cos(b)).addScaledVector(y3, rho * Math.sin(b));
  let best = null; const es = []; for (let t = 60; t <= 200; t += 0.5) { const b = t * D2R, e = Math.abs(Q(b).distanceTo(P0) - l[0]); es.push([t, e]); if (!best || e < best.e) best = { b, e }; }
  const roots = es.filter((q, i) => i > 0 && i < es.length - 1 && q[1] <= es[i - 1][1] && q[1] <= es[i + 1][1]).map(q => [q[0], +(q[1] * s * 100).toFixed(2)]);
  const rest0 = seg[0].clone().normalize(); let pick = best.b, least = Infinity;
  for (const [t, e] of roots) if (e < 0.4) { const d = Q(t * D2R).sub(P0).normalize(), turn = Math.acos(Math.max(-1, Math.min(1, d.dot(rest0)))); if (turn < least) { least = turn; pick = t * D2R; } }
  let be = pick; const tg = [P0.clone(), Q(be)];
  for (const li of [l[1], l[2]]) { be += arc(li, rho); tg.push(Q(be)); }
  return { tg, roots, at: pick / D2R };
};
const out = { q: {}, report: {} };
const chainQ = (n, tgDirs, lim) => {
  const L = chains[n], qs = [], acc = new THREE.Quaternion(), rep = [];
  for (let i = 0; i < 3; i++) {
    const restW = new THREE.Vector3(...L[i + 1].getTranslation()).normalize().applyQuaternion(acc);
    let qw = new THREE.Quaternion().setFromUnitVectors(restW, tgDirs[i]);
    let ang = 2 * Math.acos(Math.min(1, Math.abs(qw.w)));
    if (ang > lim[i] * D2R) { qw = new THREE.Quaternion().slerp(qw, lim[i] * D2R / ang); ang = lim[i] * D2R; }
    const ql = acc.clone().invert().multiply(qw).multiply(acc);
    qs.push(ql); acc.premultiply(qw); rep.push(+(ang / D2R).toFixed(1));
  }
  out.q[n] = qs; out.report[n] = rep;
};
const F2 = {};
for (const n of ['Index', 'Middle', 'Ring', 'Pinky']) { const F = finger(n); F2[n] = F;
  const dir = (i) => { const a0 = F.pts[i], a1 = F.pts[i + 1]; return F.x3.clone().multiplyScalar(a1[0] - a0[0]).addScaledVector(F.y3, a1[1] - a0[1]).normalize(); };
  chainQ(n, [dir(0), dir(1), dir(2)], F.lim); }
const T = thumb(); chainQ('Thumb', [0, 1, 2].map(i => T.tg[i + 1].clone().sub(T.tg[i]).normalize()), LIM.t);
out.report.thumbAt = +T.at.toFixed(1); out.report.thumbRoots = T.roots;
/* each finger's joints carried down its chain by the turns (in the hand's frame) */
const chainPts = {};
for (const n of NAMES) { const L = chains[n], acc = new THREE.Quaternion(), p = [J[n][0].clone()];
  for (let i = 0; i < 3; i++) { acc.multiply(out.q[n][i]); p.push(p[i].clone().add(new THREE.Vector3(...L[i + 1].getTranslation()).applyQuaternion(acc))); }
  chainPts[n] = p; }
/* the skin his right hand carries, skinned with the fingers turned (the hand bone itself at its bind), in the hand's frame */
const jointIdx = new Map(); joints.forEach((j, k) => jointIdx.set(nm(j), k));
const IBM = joints.map((_, k) => new THREE.Matrix4().fromArray(ibm, k * 16));
const W = joints.map((j) => obj.get(j).matrixWorld.clone());                     // (every joint at its rest, in metres)
/* the fingers' world matrices: the hand's at rest times each chain's local transforms with the turns */
const hw = handObj.matrixWorld.clone();
for (const n of NAMES) { let m = hw.clone(); const L = chains[n];
  for (let i = 0; i < 4; i++) { const t = new THREE.Vector3(...L[i].getTranslation()), q = i < 3 ? out.q[n][i] : new THREE.Quaternion();
    m = m.clone().multiply(new THREE.Matrix4().compose(t, q, new THREE.Vector3(1, 1, 1))); W[jointIdx.get(nm(L[i]))] = m; } }
const SK = W.map((w, k) => w.clone().multiply(IBM[k]));
const handFam = new Map(); for (const [n, k] of jointIdx) { const m = /^RightHand(Thumb|Index|Middle|Ring|Pinky)?\d*$/.exec(n); if (m) handFam.set(k, m[1] || 'Palm'); }
const mhInv = hw.clone().invert(), pts = [];
root.listMeshes().forEach(mesh => mesh.listPrimitives().forEach(pr => { const P = pr.getAttribute('POSITION'), JJ = pr.getAttribute('JOINTS_0'), WW = pr.getAttribute('WEIGHTS_0'); if (!JJ) return;
  const e = [0, 0, 0], jj = [0, 0, 0, 0], ww = [0, 0, 0, 0], v = new THREE.Vector3(), acc = new THREE.Vector3(), t3 = new THREE.Vector3();
  for (let i = 0; i < P.getCount(); i++) { JJ.getElement(i, jj); WW.getElement(i, ww); let best = -1, bw = 0; for (let q = 0; q < 4; q++) if (ww[q] > bw) { bw = ww[q]; best = jj[q]; }
    const fam = handFam.get(best); if (!fam) continue;
    P.getElement(i, e); v.fromArray(e); acc.set(0, 0, 0); let sw = 0;
    for (let q = 0; q < 4; q++) { if (!(ww[q] > 0)) continue; t3.copy(v).applyMatrix4(SK[jj[q]]).multiplyScalar(ww[q]); acc.add(t3); sw += ww[q]; }
    acc.divideScalar(sw || 1).applyMatrix4(mhInv);                                   // (into the hand's own frame)
    const r = acc.clone().sub(C), along = r.dot(A), radial = r.addScaledVector(A, -along).length();
    pts.push([fam, +acc.x.toFixed(5), +acc.y.toFixed(5), +acc.z.toFixed(5), +((radial * s - NUM.STICK_R) * 100).toFixed(2), nm(joints[best]).replace(/^RightHand/, '') || 'Palm']); } }));
const per = {}; for (const p of pts) { const F = per[p[0]] || (per[p[0]] = { n: 0, inside: 0, deepCm: 0 }); F.n++; if (p[4] < -0.3) F.inside++; F.deepCm = Math.max(F.deepCm, -p[4]); }
const V = (v) => v.toArray().map(x => +x.toFixed(5));
fs.writeFileSync(OUT, JSON.stringify({ NUM, s, fL: V(fL), nL: V(nL), acL: V(acL), A: V(A), C: V(C), report: out.report, chains: Object.fromEntries(Object.entries(chainPts).map(([k, p]) => [k, p.map(V)])),
  rest: Object.fromEntries(Object.entries(J).map(([k, p]) => [k, p.map(V)])), skin: pts, per }, null, 0));
console.log(JSON.stringify({ report: out.report, per }));
