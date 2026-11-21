/* v28.0 (E4C5, R26): FINGER BONES GRAFTED ONTO GRANDMASTER PHO'S RIGHT HAND, for this chapter only (Chad, R26: "Finger bones
   (Recommended)", of R25's "the way the naga stick is attached to pho is very unnatural and wrongly attached, improve it so it
   looks like he is actually holding it"). His rig has none (231 joints, each hand one bone; his fingers his scan's own, open
   and straight), so no take can close his hand round the Naga stick. This makes a NEW file from his shipped one
   (assets/pho.glb -> assets/pho5.glb, key `pho5`); his own file and chapters 3 and 4 are untouched.
   1. HIS RIGHT HAND READ in its bind pose (its joint's inverse bind): the fingers' line (wrist to the hand's end site), across
      the palm (its skin's widest spread), the palm's facing (its thinnest; the palm is the side the thumb stands out on).
      Lengths are the file's own units (its quantized space; the inverse binds carry the scale): the report gives metres too.
   2. THE FOUR FINGERS as the mesh's own pieces beyond a cut across the hand (points at one place welded, a UV seam's twins;
      a union over the triangles), each finger's line by PCA of its piece, its tip its furthest point, its web the nearest
      cut at which it stands apart from the others; THE THUMB from the points beyond the index's side.
   3. THE JOINTS by the hand's own proportions: the web lies halfway along the first phalanx, which is 0.46 of the finger
      (MCP to tip), so L = (tip - web) / 0.775 and MCP = tip - L along its line; PIP at 0.46 L, DIP at 0.73 L, the end at
      L. The thumb's CMC is 0.56 of the hand's length (wrist to the middle tip) back from its tip along its line, its MCP at
      0.43 and its IP at 0.73 of that.
   4. TWENTY JOINTS (Thumb, Index, Middle, Ring, Pinky 1 to 4, the library's names), each a child of the one before it (the
      first of the hand), turned as the hand is: a translation only. So each one's inverse bind is L^-1 times its parent's,
      and its skinning matrix W . IBM equals the hand's at EVERY pose while the fingers are not turned: at rest the hand is
      drawn exactly as before, in every take. The hand's old end site (RightHandMiddle4, a joint with no weight) is renamed
      RightHandEnd, so the new chain's names are its own.
   5. EACH POINT of either skinned piece within reach of a finger's (or the thumb's) line is weighed along it: the hand to the
      first bone over +-B0 round its MCP (CMC for the thumb), then each bone to the next over +-B round its PIP and DIP; the
      hand's share of the point is split so, every other bone's share kept, four influences at most (the smallest dropped,
      the rest renormalised), quantized back to the file's own bytes with their sum kept.
   6. WRITTEN with the same compression (meshopt, its lossless 'quantize' method: no filters) and quantization; every other
      accessor (every attribute, triangle and take), every texture and every old inverse bind compared value for value with
      his file's, here, before it is written.
     node tools/fingergraft.mjs <in.glb> <out.glb> <report.json> */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder, MeshoptEncoder } from 'meshoptimizer';
import * as THREE from 'three';
import { writeFileSync, mkdirSync } from 'fs';
import { dirname } from 'path';
await MeshoptDecoder.ready; await MeshoptEncoder.ready;
const [IN, OUT, REP] = process.argv.slice(2);
if (!IN || !OUT || !REP) { console.error('usage: node tools/fingergraft.mjs <in.glb> <out.glb> <report.json>'); process.exit(2); }
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder, 'meshopt.encoder': MeshoptEncoder });
const doc = await io.read(IN), root = doc.getRoot();
const log = (...a) => console.log('fingergraft:', ...a);
const SIDE = 'Right';
const skins = root.listSkins(); if (skins.length !== 1) throw new Error('one skin expected, found ' + skins.length);
const skin = skins[0], joints0 = skin.listJoints(), IBM0 = skin.getInverseBindMatrices(), ibm0 = IBM0.getArray().slice();
const jIdx = (re) => joints0.findIndex(j => re.test(j.getName()));
const HI = jIdx(new RegExp('^(mixamorig:?)?' + SIDE + 'Hand$')); if (HI < 0) throw new Error('no ' + SIDE + 'Hand joint');
for (const fn of ['Thumb', 'Index', 'Middle', 'Ring', 'Pinky']) for (let i = 1; i <= 3; i++)
  if (jIdx(new RegExp('^(mixamorig:?)?' + SIDE + 'Hand' + fn + i + '$')) >= 0) throw new Error('the hand already has ' + fn + i + ': nothing to graft');
const handNode = joints0[HI], prefix = /^mixamorig:/.test(handNode.getName()) ? 'mixamorig:' : '';
const ibmOf = (k) => new THREE.Matrix4().fromArray(ibm0, k * 16);
const IBM_H = ibmOf(HI), BIND_H = IBM_H.clone().invert(), wp = new THREE.Vector3().setFromMatrixPosition(BIND_H);
const endNode = handNode.listChildren().find(c => new RegExp(SIDE + 'HandMiddle4$').test(c.getName()));
if (!endNode) throw new Error('no hand end site');
const endJ = joints0.indexOf(endNode);
const ep = new THREE.Vector3().setFromMatrixPosition(endJ >= 0 ? ibmOf(endJ).invert() : BIND_H.clone().multiply(new THREE.Matrix4().makeTranslation(...endNode.getTranslation())));
/* the metre: the bind world of two joints through the node tree (the armature in metres) against their places in this space */
const worldOf = (node) => { const chain = []; for (let n = node; n; n = n.getParentNode ? n.getParentNode() : null) chain.unshift(n);
  const M = new THREE.Matrix4(); for (const n of chain) M.multiply(new THREE.Matrix4().compose(new THREE.Vector3(...n.getTranslation()), new THREE.Quaternion(...n.getRotation()), new THREE.Vector3(...n.getScale()))); return M; };
const hipsJ = jIdx(/Hips$/), headJ = jIdx(/Head$/);
const dv = new THREE.Vector3().setFromMatrixPosition(ibmOf(hipsJ).invert()).distanceTo(new THREE.Vector3().setFromMatrixPosition(ibmOf(headJ).invert()));
const dw = new THREE.Vector3().setFromMatrixPosition(worldOf(joints0[hipsJ])).distanceTo(new THREE.Vector3().setFromMatrixPosition(worldOf(joints0[headJ])));
const METRE = dw / dv;                                                           // (metres a unit of this space)
log('a unit of the vertex space is', METRE.toFixed(4), 'm (hips to head', dw.toFixed(3), 'm)');

/* ---- 1. the hand's frame */
const prims = []; root.listMeshes().forEach(m => m.listPrimitives().forEach(p => { if (p.getAttribute('JOINTS_0')) prims.push(p); }));
const handPts = [];
prims.forEach((pr, pi) => { const P = pr.getAttribute('POSITION'), J = pr.getAttribute('JOINTS_0'), W = pr.getAttribute('WEIGHTS_0'), j = [0, 0, 0, 0], w = [0, 0, 0, 0], e = [0, 0, 0];
  for (let i = 0; i < P.getCount(); i++) { J.getElement(i, j); W.getElement(i, w); let s = 0; for (let q = 0; q < 4; q++) if (j[q] === HI) s += w[q];
    if (s > 0.0001) handPts.push({ pi, i, p: new THREE.Vector3(...P.getElement(i, e)), w: s }); } });
const f = ep.clone().sub(wp).normalize();
const core = handPts.filter(q => q.w >= 0.5), cen = new THREE.Vector3(); for (const q of core) cen.add(q.p); cen.divideScalar(core.length);
const u0 = new THREE.Vector3(0, 1, 0); if (Math.abs(u0.dot(f)) > 0.9) u0.set(1, 0, 0); u0.addScaledVector(f, -u0.dot(f)).normalize(); const v0 = new THREE.Vector3().crossVectors(f, u0);
let sxx = 0, sxy = 0, syy = 0; for (const q of core) { const d = q.p.clone().sub(cen); const a = d.dot(u0), b = d.dot(v0); sxx += a * a; sxy += a * b; syy += b * b; }
const th = 0.5 * Math.atan2(2 * sxy, sxx - syy);
const ax = u0.clone().multiplyScalar(Math.cos(th)).addScaledVector(v0, Math.sin(th)).normalize(), nx = new THREE.Vector3().crossVectors(f, ax).normalize();
const H = (p) => { const d = p.clone().sub(wp); return [d.dot(f), d.dot(ax), d.dot(nx)]; };
const HL = Math.max(...core.map(q => H(q.p)[0]));                               // (the hand's length: wrist to its furthest point)
/* (across runs toward the THUMB: across the palm's middle, the thumb stands out further beyond the index's side than the
   little finger's edge does on its own; the normal is f x across) */
{ const mid = core.map(q => H(q.p)).filter(q => q[0] > 0.3 * HL && q[0] < 0.6 * HL), hiA = Math.max(...mid.map(q => q[1])), loA = Math.min(...mid.map(q => q[1]));
  if (-loA > hiA) { ax.negate(); nx.crossVectors(f, ax).normalize(); } }
log('hand: wrist', wp.toArray().map(x => +x.toFixed(4)), 'length', HL.toFixed(4), `(${(HL * METRE).toFixed(3)} m)`);

/* ---- 2. the fingers as the mesh's own pieces, welded */
const pieceAt = (pi, cut) => {
  const pr = prims[pi], idx = pr.getIndices().getArray(), P = pr.getAttribute('POSITION'), e = [0, 0, 0];
  const keep = new Map(); for (const q of handPts) if (q.pi === pi && q.w >= 0.3) { const h = H(q.p); if (h[0] >= cut) keep.set(q.i, h); }
  const par = new Map(), fnd = (x) => { while (par.get(x) !== x) { par.set(x, par.get(par.get(x))); x = par.get(x); } return x; };
  for (const k of keep.keys()) par.set(k, k);
  const at = new Map(); for (const k of keep.keys()) { const key = P.getElement(k, e).map(x => Math.round(x * 2e4)).join(','); if (at.has(key)) par.set(fnd(k), fnd(at.get(key))); else at.set(key, k); }
  for (let t = 0; t < idx.length; t += 3) { const A = idx[t], B = idx[t + 1], C = idx[t + 2]; if (keep.has(A) && keep.has(B)) par.set(fnd(A), fnd(B)); if (keep.has(B) && keep.has(C)) par.set(fnd(B), fnd(C)); if (keep.has(A) && keep.has(C)) par.set(fnd(A), fnd(C)); }
  const comp = new Map(); for (const k of keep.keys()) { const r = fnd(k); if (!comp.has(r)) comp.set(r, []); comp.get(r).push({ i: k, h: keep.get(k) }); }
  return [...comp.values()].filter(c => c.length >= 12).sort((a, b) => b.length - a.length);
};
const counts = prims.map((_, pi) => handPts.filter(q => q.pi === pi && q.w >= 0.5).length), MP = counts.indexOf(Math.max(...counts));
let CUT = 0.14 * HL / 0.236, pieces = pieceAt(MP, CUT);
for (let k = 0; k < 12 && pieces.filter(c => Math.max(...c.map(q => q.h[1])) < 0.6 * Math.max(...core.map(q => H(q.p)[1]))).length < 4; k++) { CUT += 0.004 * HL / 0.236; pieces = pieceAt(MP, CUT); }
const fingers = pieces.filter(c => { const A = Math.max(...core.map(q => H(q.p)[1])); return Math.max(...c.map(q => q.h[1])) < 0.6 * A; }).slice(0, 4);
if (fingers.length !== 4) throw new Error('found ' + fingers.length + ' fingers beyond ' + CUT.toFixed(3));
fingers.sort((a, b) => b.reduce((s, q) => s + q.h[1], 0) / b.length - a.reduce((s, q) => s + q.h[1], 0) / a.length);   // (index first: nearest the thumb)
const NAMES = ['Index', 'Middle', 'Ring', 'Pinky'];
const pca = (pts) => { const c = [0, 0, 0]; for (const q of pts) for (let k = 0; k < 3; k++) c[k] += q[k] / pts.length;
  const C = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]; for (const q of pts) for (let a = 0; a < 3; a++) for (let b = 0; b < 3; b++) C[a][b] += (q[a] - c[a]) * (q[b] - c[b]);
  let v = [1, 0, 0]; for (let it = 0; it < 60; it++) { const w = [0, 1, 2].map(a => C[a][0] * v[0] + C[a][1] * v[1] + C[a][2] * v[2]); const l = Math.hypot(...w); v = w.map(x => x / l); }
  if (v[0] < 0) v = v.map(x => -x); return { c, d: v }; };
/* the web: the nearest cut at which this finger is still a piece of its own (walked back from the first cut: the piece that
   holds most of its points, until that piece grows half as wide again, where it has joined a neighbour or the palm) */
const span = (c) => Math.max(...c.map(q => q.h[1])) - Math.min(...c.map(q => q.h[1]));
const webOf = (fi) => { const S = new Set(fingers[fi].map(q => q.i)), w0 = span(fingers[fi]); let web = CUT;
  for (let k = 1; k <= 24; k++) { const cut = CUT - 0.0025 * k * HL / 0.236, ps = pieceAt(MP, cut);
    let best = null, bo = 0; for (const c of ps) { let o = 0; for (const q of c) if (S.has(q.i)) o++; if (o > bo) { bo = o; best = c; } }
    if (!best || span(best) > 1.5 * w0) break; web = cut; } return web; };
const lineAt = (ax0, s) => { const t = (s - ax0.c[0]) / ax0.d[0]; return [ax0.c[0] + ax0.d[0] * t, ax0.c[1] + ax0.d[1] * t, ax0.c[2] + ax0.d[2] * t]; };
const FIN = fingers.map((g, fi) => { const pts = g.map(q => q.h), A = pca(pts);
  const tipT = Math.max(...pts.map(q => (q[0] - A.c[0]) * A.d[0] + (q[1] - A.c[1]) * A.d[1] + (q[2] - A.c[2]) * A.d[2]));
  const tip = [0, 1, 2].map(k => A.c[k] + A.d[k] * tipT), web = webOf(fi), webP = lineAt(A, web);
  const vis = Math.hypot(tip[0] - webP[0], tip[1] - webP[1], tip[2] - webP[2]), L = vis / 0.775;
  const at = (k) => [0, 1, 2].map(j => tip[j] - A.d[j] * L * (1 - k));
  const rad = pts.map(q => { const d = [q[0] - A.c[0], q[1] - A.c[1], q[2] - A.c[2]], t = d[0] * A.d[0] + d[1] * A.d[1] + d[2] * A.d[2]; return Math.hypot(d[0] - A.d[0] * t, d[1] - A.d[1] * t, d[2] - A.d[2] * t); }).sort((a, b) => a - b);
  return { name: NAMES[fi], n: pts.length, d: A.d, tip, web, L, joints: [at(0), at(0.46), at(0.73), at(1)], radius: rad[Math.floor(rad.length * 0.9)] }; });
/* the thumb: the points beyond the index's side, before the fingers' webs */
const idxA = FIN[0].joints[0][1], thumbPts = core.map(q => H(q.p)).filter(q => q[1] > idxA + 0.2 * (Math.max(...core.map(r => H(r.p)[1])) - idxA) && q[0] > 0.12 * HL && q[0] < FIN[0].web + 0.01 * HL / 0.236);
const TA = pca(thumbPts);
/* (the palm faces the side the thumb lies on, through the hand's thickness: the thumb stands in front of the palm) */
const palmSign = Math.sign(thumbPts.reduce((s, q) => s + q[2], 0)) || -1;
log('the palm faces', palmSign > 0 ? '+normal' : '-normal', '(the thumb\'s side)');
{ const s = Math.sign(TA.d[1]) || 1; if (s < 0) TA.d = TA.d.map(x => -x); }     // (from the wrist out toward its tip)
const tTip = Math.max(...thumbPts.map(q => (q[0] - TA.c[0]) * TA.d[0] + (q[1] - TA.c[1]) * TA.d[1] + (q[2] - TA.c[2]) * TA.d[2]));
const thTip = [0, 1, 2].map(k => TA.c[k] + TA.d[k] * tTip), TL = 0.56 * HL;
const tAt = (k) => [0, 1, 2].map(j => thTip[j] - TA.d[j] * TL * (1 - k));
const tRad = thumbPts.map(q => { const d = [q[0] - TA.c[0], q[1] - TA.c[1], q[2] - TA.c[2]], t = d[0] * TA.d[0] + d[1] * TA.d[1] + d[2] * TA.d[2]; return Math.hypot(d[0] - TA.d[0] * t, d[1] - TA.d[1] * t, d[2] - TA.d[2] * t); }).sort((a, b) => a - b);
const THUMB = { name: 'Thumb', n: thumbPts.length, d: TA.d, tip: thTip, L: TL, joints: [tAt(0), tAt(0.43), tAt(0.73), tAt(1)], radius: tRad[Math.floor(tRad.length * 0.9)] };
const ALL = [THUMB, ...FIN];
for (const F of ALL) log(F.name.padEnd(6), 'points', F.n, 'length', F.L.toFixed(4), `(${(F.L * METRE * 100).toFixed(1)} cm)`, 'joints (along, across, normal)', F.joints.map(j => '[' + j.map(x => x.toFixed(3)).join(',') + ']').join(' '), 'radius', F.radius.toFixed(4));

/* ---- 4. the joints: hand-frame places back to the vertex space; each a child of the one before, a translation only */
const toV = (h) => wp.clone().addScaledVector(f, h[0]).addScaledVector(ax, h[1]).addScaledVector(nx, h[2]);
const newJoints = [], newIBM = [];
endNode.setName(prefix + SIDE + 'HandEnd');
for (const F of ALL) {
  let parent = handNode, parentIBM = IBM_H.clone(); F.nodes = [];
  for (let k = 0; k < 4; k++) {
    const pv = toV(F.joints[k]), T = pv.clone().applyMatrix4(parentIBM);
    const node = doc.createNode(prefix + SIDE + 'Hand' + F.name + (k + 1)).setTranslation([T.x, T.y, T.z]).setRotation([0, 0, 0, 1]).setScale([1, 1, 1]);
    parent.addChild(node);
    const ibm = new THREE.Matrix4().makeTranslation(-T.x, -T.y, -T.z).multiply(parentIBM);
    newJoints.push(node); newIBM.push(ibm); F.nodes.push({ node, index: joints0.length + newJoints.length - 1, pv });
    parent = node; parentIBM = ibm;
  }
}
for (const n of newJoints) skin.addJoint(n);
{ const arr = new Float32Array((joints0.length + newIBM.length) * 16); arr.set(ibm0, 0); newIBM.forEach((m, k) => arr.set(m.elements, (joints0.length + k) * 16));
  IBM0.setArray(arr); }
if (joints0.length + newJoints.length > 255) throw new Error('too many joints for one byte: ' + (joints0.length + newJoints.length));

/* ---- 5. the weights */
const B0 = 0.012 / METRE, B = 0.006 / METRE;                                     // (the MCP's blend +-1.2 cm, the PIP's and DIP's +-0.6 cm)
const smooth = (x, a, b) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const segOf = (F) => { const J = F.joints; const len = (a, b) => Math.hypot(J[b][0] - J[a][0], J[b][1] - J[a][1], J[b][2] - J[a][2]); return { l1: len(0, 1), l2: len(1, 2), l3: len(2, 3) }; };
for (const F of ALL) F.seg = segOf(F);
const shares = (F, h) => {                                                       // (this point's share to each of the finger's bones, or null)
  const J0 = F.joints[0], d = F.d, rel = [h[0] - J0[0], h[1] - J0[1], h[2] - J0[2]], t = rel[0] * d[0] + rel[1] * d[1] + rel[2] * d[2];
  const r = Math.hypot(rel[0] - d[0] * t, rel[1] - d[1] * t, rel[2] - d[2] * t);
  const isThumb = F.name === 'Thumb', reach = isThumb ? Math.max(F.radius * 1.35, 0.016 / METRE) : F.radius * 1.35 + 0.002 / METRE;
  if (t < -B0 || t > F.L + 0.015 / METRE || r > reach) return null;
  if (isThumb && h[1] < idxA + 0.004 / METRE) return null;                       // (never the palm's middle)
  const p12 = F.seg.l1, p23 = F.seg.l1 + F.seg.l2;
  const w1 = isThumb ? smooth(t, -B0 * 0.25, B0 * 2.2) : smooth(t, -B0, B0), a12 = smooth(t, p12 - B, p12 + B), a23 = smooth(t, p23 - B, p23 + B);
  return { r: r / reach, w: [1 - w1, w1 * (1 - a12), w1 * a12 * (1 - a23), w1 * a12 * a23] };
};
let changed = 0, touched = 0; const perFinger = Object.fromEntries(ALL.map(F => [F.name, 0]));
prims.forEach((pr, pi) => { const J = pr.getAttribute('JOINTS_0'), W = pr.getAttribute('WEIGHTS_0'), P = pr.getAttribute('POSITION');
  const jArr = J.getArray(), wArr = W.getArray(), e = [0, 0, 0], norm = W.getNormalized(), MAXW = norm ? (W.getComponentType() === 5121 ? 255 : 65535) : 1;
  for (let i = 0; i < P.getCount(); i++) {
    let hs = 0; for (let q = 0; q < 4; q++) if (jArr[i * 4 + q] === HI) hs += wArr[i * 4 + q];
    if (!(hs > 0)) continue;
    const h = H(new THREE.Vector3(...P.getElement(i, e)));
    let best = null; for (const F of ALL) { const s = shares(F, h); if (s && (!best || s.r < best.s.r)) best = { F, s }; }
    touched++; if (!best || best.s.w[0] > 0.999) continue;
    /* the hand's share split along the finger, every other bone's kept */
    const inf = new Map(); for (let q = 0; q < 4; q++) { const j = jArr[i * 4 + q], w = wArr[i * 4 + q]; if (w > 0 && j !== HI) inf.set(j, (inf.get(j) || 0) + w); }
    const add = (j, w) => { if (w > 1e-6) inf.set(j, (inf.get(j) || 0) + w); };
    add(HI, hs * best.s.w[0]); for (let k = 0; k < 3; k++) add(best.F.nodes[k].index, hs * best.s.w[k + 1]);
    let L = [...inf.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4);
    const tot = L.reduce((s, x) => s + x[1], 0), sum0 = (() => { let s = 0; for (let q = 0; q < 4; q++) s += wArr[i * 4 + q]; return s; })();
    /* quantized back: the largest remainder keeps the sum the point had */
    const raw = L.map(x => x[1] / tot * sum0), flo = raw.map(x => Math.floor(x + 1e-9)); let rest = Math.round(sum0 - flo.reduce((s, x) => s + x, 0));
    const ord = raw.map((x, k) => [x - flo[k], k]).sort((a, b) => b[0] - a[0]); for (const [, k] of ord) { if (rest <= 0) break; flo[k]++; rest--; }
    for (let q = 0; q < 4; q++) { jArr[i * 4 + q] = q < L.length ? L[q][0] : 0; wArr[i * 4 + q] = q < L.length ? flo[q] : 0; }
    changed++; perFinger[best.F.name]++; }
  J.setArray(jArr); W.setArray(wArr); void MAXW; });
log('points with a hand share', touched, 'given finger bones', changed, JSON.stringify(perFinger));

/* ---- 6. checked against his file, then written */
const before = await io.read(IN), b = before.getRoot(), a = root;
const accKey = (acc) => acc.getName() + '|' + acc.getType() + '|' + acc.getCount();
const same = (x, y) => { if (x.length !== y.length) return false; for (let k = 0; k < x.length; k++) if (x[k] !== y[k]) return false; return true; };
let compared = 0;
b.listMeshes().forEach((m, mi) => m.listPrimitives().forEach((p, pi) => { const q = a.listMeshes()[mi].listPrimitives()[pi];
  for (const sem of p.listSemantics()) { if (sem === 'JOINTS_0' || sem === 'WEIGHTS_0') continue; if (!same(p.getAttribute(sem).getArray(), q.getAttribute(sem).getArray())) throw new Error('changed: ' + sem + ' of mesh ' + mi + ' prim ' + pi); compared++; }
  if (!same(p.getIndices().getArray(), q.getIndices().getArray())) throw new Error('changed: indices of ' + mi + '/' + pi); compared++; }));
b.listAnimations().forEach((A, ai) => A.listSamplers().forEach((s, si) => { const t = a.listAnimations()[ai].listSamplers()[si];
  if (!same(s.getInput().getArray(), t.getInput().getArray()) || !same(s.getOutput().getArray(), t.getOutput().getArray())) throw new Error('changed: take ' + A.getName()); compared++; }));
{ const old = b.listSkins()[0].getInverseBindMatrices().getArray(), now = IBM0.getArray(); for (let k = 0; k < old.length; k++) if (old[k] !== now[k]) throw new Error('changed: an old inverse bind'); compared++; }
b.listTextures().forEach((t, ti) => { if (!same(t.getImage(), a.listTextures()[ti].getImage())) throw new Error('changed: texture ' + ti); compared++; });
log('compared with his file, value for value:', compared, 'accessors, takes, binds and textures the same');
mkdirSync(dirname(OUT), { recursive: true });
await io.write(OUT, doc);
const back = await io.read(OUT);
{ const r2 = back.getRoot(); if (r2.listSkins()[0].listJoints().length !== joints0.length + newJoints.length) throw new Error('written: joints');
  r2.listMeshes().forEach((m, mi) => m.listPrimitives().forEach((p, pi) => { const q = a.listMeshes()[mi].listPrimitives()[pi];
    for (const sem of p.listSemantics()) if (!same(p.getAttribute(sem).getArray(), q.getAttribute(sem).getArray())) throw new Error('written differs: ' + sem); })); }
mkdirSync(dirname(REP), { recursive: true });
writeFileSync(REP, JSON.stringify({ in: IN, out: OUT, metre: METRE, hand: { wrist: wp.toArray(), f: f.toArray(), across: ax.toArray(), normal: nx.toArray(), palm: palmSign, length: HL, lengthM: HL * METRE },
  cut: CUT, fingers: ALL.map(F => ({ name: F.name, points: F.n, dir: F.d, tip: F.tip, web: F.web, L: F.L, Lm: F.L * METRE, seg: F.seg, segM: Object.fromEntries(Object.entries(F.seg).map(([k, v]) => [k, v * METRE])), radius: F.radius, joints: F.joints,
    names: F.nodes.map(n => n.node.getName()), indices: F.nodes.map(n => n.index) })), weighed: { touched, changed, perFinger }, compared }, null, 1));
log('wrote', OUT, 'and', REP);
