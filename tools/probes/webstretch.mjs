/* v24.56 · WHAT STRETCHES ROUND A JOINT — every triangle within a radius of one joint's rest place, measured over every
   frame of every take: its longest edge posed over the same edge at rest (the most it is ever drawn out), where and when
   that happens, its area posed, and the bones its corners ride. Grandmaster Pho (Chad, 9 Nov 2026: "why is there a piece
   of skin colour thing popping out from under the right armpit? didnt you notice it"): a few triangles joining his inner
   arm to his side, tiny at rest, drawn 27 times longer when his arm swings forward to talk. A photograph shows one frame
   from one side; this reads every frame. The posing is tools/rigstrain.mjs's (the file's own animation sampled through
   its node tree and inverse bind matrices, in plain Node).
     node tools/probes/webstretch.mjs <file.glb> [--joint=RightArm] [--radius=0.25] [--fps=10] [--over=3] [--json=out.json]
   Prints the triangles drawn out past --over in any frame (part, triangle, worst stretch, take@t, area at rest and posed
   in cm2, the corners' main bones), and per take how many pass it at its worst frame. */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { dequantize } from '@gltf-transform/functions';
import { MeshoptDecoder } from 'meshoptimizer';
import { Matrix4, Quaternion, Vector3 } from 'three';
import fs from 'node:fs';
const FILE = process.argv[2], arg = (k, d) => { const a = process.argv.find(x => x.startsWith(`--${k}=`)); return a ? a.slice(k.length + 3) : d; };
if (!FILE) { console.error('usage: node tools/probes/webstretch.mjs <file.glb> [--joint=RightArm] [--radius=0.25] [--fps=10] [--over=3] [--json=out.json]'); process.exit(1); }
const JOINT = arg('joint', 'RightArm'), RAD = +arg('radius', 0.25), FPS = +arg('fps', 10), OVER = +arg('over', 3), JSONOUT = arg('json', '');
await MeshoptDecoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder });
const doc = await io.read(FILE); await doc.transform(dequantize());
const root = doc.getRoot(), skin = root.listSkins()[0], joints = skin.listJoints();
const JN = joints.map(j => j.getName().replace(/^mixamorig[:_]?/, '')), IBM = skin.getInverseBindMatrices().getArray();
const nodes = root.listNodes(), NI = new Map(nodes.map((n, i) => [n, i])), parent = new Int32Array(nodes.length).fill(-1);
nodes.forEach((n, i) => n.listChildren().forEach(c => { parent[NI.get(c)] = i; }));
const order = []; { const seen = new Uint8Array(nodes.length); const visit = i => { if (seen[i]) return; if (parent[i] >= 0) visit(parent[i]); seen[i] = 1; order.push(i); }; nodes.forEach((_, i) => visit(i)); }
// every skinned part's points and triangles, each triangle remembering its part and its number there
let P = [], JW = [], TRI = [], TP = [];
let part = 0;
for (const mesh of root.listMeshes()) for (const prim of mesh.listPrimitives()) {
  const A = prim.getAttribute('POSITION'), J = prim.getAttribute('JOINTS_0'), W = prim.getAttribute('WEIGHTS_0'); if (!J || !W) { part++; continue; }
  const base = P.length / 3, v = [0, 0, 0], j4 = [0, 0, 0, 0], w4 = [0, 0, 0, 0];
  for (let i = 0; i < A.getCount(); i++) { A.getElement(i, v); J.getElement(i, j4); W.getElement(i, w4); P.push(...v); JW.push(...j4, ...w4); }
  const ix = prim.getIndices(); for (let i = 0; i < ix.getCount(); i += 3) { TRI.push(base + ix.getScalar(i), base + ix.getScalar(i + 1), base + ix.getScalar(i + 2)); TP.push(part, i / 3); }
  part++;
}
P = Float64Array.from(P); JW = Float64Array.from(JW); TRI = Uint32Array.from(TRI);
const NV = P.length / 3, NT = TRI.length / 3;
const tq = new Quaternion(), tq2 = new Quaternion();
const sample = (ch, t) => {
  const smp = ch.getSampler(), inp = smp.getInput().getArray(), out = smp.getOutput().getArray(), n = inp.length, interp = smp.getInterpolation();
  const w = ch.getTargetPath() === 'rotation' ? 4 : 3, cub = interp === 'CUBICSPLINE', stride = cub ? 3 * w : w, off = cub ? w : 0;
  const at = k => Array.from(out.slice(k * stride + off, k * stride + off + w));
  if (t <= inp[0]) return at(0); if (t >= inp[n - 1]) return at(n - 1);
  let lo = 0, hi = n - 1; while (hi - lo > 1) { const m = (lo + hi) >> 1; if (inp[m] <= t) lo = m; else hi = m; }
  if (interp === 'STEP') return at(lo);
  const u = (t - inp[lo]) / (inp[hi] - inp[lo]), a = at(lo), b = at(hi);
  if (w === 4) { tq.fromArray(a); tq2.fromArray(b); tq.slerp(tq2, u); return tq.toArray(); }
  return a.map((x, k) => x + (b[k] - x) * u);
};
const world = nodes.map(() => new Matrix4()), _l = new Matrix4(), _t = new Vector3(), _q = new Quaternion(), _s = new Vector3();
const pose = (an, t) => {
  const trs = nodes.map(n => ({ t: n.getTranslation(), r: n.getRotation(), s: n.getScale() }));
  if (an) for (const ch of an.listChannels()) { const i = NI.get(ch.getTargetNode()), p = ch.getTargetPath();
    if (p === 'translation') trs[i].t = sample(ch, t); else if (p === 'rotation') trs[i].r = sample(ch, t); else if (p === 'scale') trs[i].s = sample(ch, t); }
  for (const i of order) { _l.compose(_t.fromArray(trs[i].t), _q.fromArray(trs[i].r).normalize(), _s.fromArray(trs[i].s));
    if (parent[i] >= 0) world[i].multiplyMatrices(world[parent[i]], _l); else world[i].copy(_l); } };
const SK = new Float64Array(joints.length * 16), _m = new Matrix4(), _ib = new Matrix4();
const skinMats = () => joints.forEach((j, k) => { _ib.fromArray(IBM, k * 16); _m.multiplyMatrices(world[NI.get(j)], _ib); SK.set(_m.elements, k * 16); });
const deformPts = (idx, out) => { for (const i of idx) { let x = 0, y = 0, z = 0; const px = P[3 * i], py = P[3 * i + 1], pz = P[3 * i + 2];
  for (let k = 0; k < 4; k++) { const w = JW[8 * i + 4 + k]; if (!w) continue; const o = JW[8 * i + k] * 16;
    x += w * (SK[o] * px + SK[o + 4] * py + SK[o + 8] * pz + SK[o + 12]); y += w * (SK[o + 1] * px + SK[o + 5] * py + SK[o + 9] * pz + SK[o + 13]); z += w * (SK[o + 2] * px + SK[o + 6] * py + SK[o + 10] * pz + SK[o + 14]); }
  out[3 * i] = x; out[3 * i + 1] = y; out[3 * i + 2] = z; } };
// the joint at rest, and the triangles round it
pose(null, 0); skinMats();
const ji = JN.findIndex(n => n === JOINT); if (ji < 0) throw new Error(`no joint ${JOINT}`);
const JP = (() => { const e = world[NI.get(joints[ji])].elements; return [e[12], e[13], e[14]]; })();
const R = new Float64Array(NV * 3); deformPts([...Array(NV).keys()], R);
const near = [], pts = new Set();
for (let t = 0; t < NT; t++) { const c = [0, 1, 2].map(k => TRI[3 * t + k]); let cx = 0, cy = 0, cz = 0; for (const i of c) { cx += R[3 * i]; cy += R[3 * i + 1]; cz += R[3 * i + 2]; }
  if (Math.hypot(cx / 3 - JP[0], cy / 3 - JP[1], cz / 3 - JP[2]) < RAD) { near.push(t); c.forEach(i => pts.add(i)); } }
const ptl = [...pts];
const len = (A, a, b) => Math.hypot(A[3 * a] - A[3 * b], A[3 * a + 1] - A[3 * b + 1], A[3 * a + 2] - A[3 * b + 2]);
const area = (A, a, b, c) => { const ux = A[3 * b] - A[3 * a], uy = A[3 * b + 1] - A[3 * a + 1], uz = A[3 * b + 2] - A[3 * a + 2], vx = A[3 * c] - A[3 * a], vy = A[3 * c + 1] - A[3 * a + 1], vz = A[3 * c + 2] - A[3 * a + 2];
  return 0.5 * Math.hypot(uy * vz - uz * vy, uz * vx - ux * vz, ux * vy - uy * vx); };
const restE = near.map(t => [0, 1, 2].map(k => Math.max(len(R, TRI[3 * t + k], TRI[3 * t + (k + 1) % 3]), 1e-6)));
const worst = near.map(() => ({ s: 1, take: '', t: 0, area: 0 }));
const perTake = {};
const X = new Float64Array(NV * 3);
for (const an of root.listAnimations()) {
  const dur = Math.max(...an.listChannels().map(c => { const i = c.getSampler().getInput().getArray(); return i[i.length - 1]; })), n = Math.max(2, Math.ceil(dur * FPS) + 1);
  let takeWorst = 0;
  for (let f = 0; f < n; f++) { const t = dur * f / (n - 1); pose(an, t); skinMats(); deformPts(ptl, X); let cnt = 0;
    near.forEach((tr, k) => { const a = TRI[3 * tr], b = TRI[3 * tr + 1], c = TRI[3 * tr + 2];
      const s = Math.max(len(X, a, b) / restE[k][0], len(X, b, c) / restE[k][1], len(X, c, a) / restE[k][2]);
      if (s > OVER) cnt++;
      if (s > worst[k].s) worst[k] = { s, take: an.getName(), t: +t.toFixed(2), area: area(X, a, b, c) }; });
    takeWorst = Math.max(takeWorst, cnt); }
  perTake[an.getName()] = takeWorst;
}
const bonesOf = i => { const a = []; for (let k = 0; k < 4; k++) { const w = JW[8 * i + 4 + k]; if (w > 0.05) a.push(`${JN[JW[8 * i + k]]}:${w.toFixed(2)}`); } return a.join(' '); };
const rows = near.map((tr, k) => ({ part: TP[2 * tr], tri: TP[2 * tr + 1], stretch: +worst[k].s.toFixed(2), at: `${worst[k].take}@${worst[k].t}`,
  restArea: +(area(R, TRI[3 * tr], TRI[3 * tr + 1], TRI[3 * tr + 2]) * 1e4).toFixed(3), poseArea: +(worst[k].area * 1e4).toFixed(2),
  corners: [0, 1, 2].map(j => bonesOf(TRI[3 * tr + j])) })).filter(r => r.stretch > OVER).sort((a, b) => b.stretch - a.stretch);
console.log(`${FILE.split('/').pop()}: ${near.length} triangles within ${RAD} m of ${JOINT}; ${rows.length} drawn out past ${OVER}x in some frame`);
for (const r of rows.slice(0, 60)) console.log(`  part ${r.part} tri ${r.tri}: ${r.stretch}x at ${r.at}, area ${r.restArea} -> ${r.poseArea} cm2 | ${r.corners.join(' | ')}`);
console.log('per take, the most past it in one frame:', Object.entries(perTake).map(([k, v]) => `${k} ${v}`).join(', '));
if (JSONOUT) fs.writeFileSync(JSONOUT, JSON.stringify({ joint: JOINT, radius: RAD, over: OVER, rows, perTake }));
