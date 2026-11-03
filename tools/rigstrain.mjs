/* v24.40 · RIG STRAIN — where a skinned model's body THINS, measured over every frame of every take, so a distortion is
   found by number, not by a lucky camera angle. Chad, 3 Nov 2026, of Grandmaster Pho: "The biggest problems are with his
   torso and back that distorts to very thin. You need to look at more angles", then "you are not looking at the right
   angles for the big issues". A photograph shows a frame from an angle; this reads them all.

   For every take, sampled at FPS (default 15), the posed skin is computed in plain Node (the file's own animation
   sampled — LINEAR/STEP, slerp — through its node tree and inverse bind matrices; no browser) and compared with the
   rest pose, which is checked to be the bind pose:
     · TRUNK — every point of the body between the hips and the neck that is nearer the spine than an arm: its distance
       to the spine's polyline (Hips→Spine→Spine1→Spine2→Neck), posed over rest. Under 0.75 the trunk is caving in at
       that point (a chest or back pulled toward the spine or through it); the share under 0.75 and the 1st/5th
       percentile are reported for the chest (in front of the spine) and the back (behind it) apart.
     · DEPTH — the trunk's own thickness: at five heights along the spine, the chest-to-back extent of the points of that
       slab along the posed Spine2's forward axis, posed over rest (a whole torso flattened reads here even where no
       single point moved far).
     · EDGES — every edge's length posed over rest, by region (trunk, arms, head, below the hips): the share squashed
       under 0.5 or stretched past 2.
     · SEAMS — copies of one position (UV seams) that the pose pulls apart (different weights on the copies).
   Prints, per take, the worst frame of each measure; with --json=<file> writes every frame's numbers; with
   --heat=<take>@<t>:<out.glb> writes that frame's posed skin as a static GLB painted by the trunk measure (grey sound,
   red caved in under 0.75, deeper red to 0.4, blue swollen past 1.35) for tools/clipsheet.mjs --static to photograph.
     node tools/rigstrain.mjs <file.glb> [--fps=15] [--clips=a,b] [--json=out.json] [--heat=Take@1.2:out.glb,...] */
import { NodeIO, Document } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { dequantize } from '@gltf-transform/functions';
import { MeshoptDecoder } from 'meshoptimizer';
import { Matrix4, Quaternion, Vector3 } from 'three';
import fs from 'node:fs';

const FILE = process.argv[2];
const arg = (k, d) => { const a = process.argv.find(x => x.startsWith(`--${k}=`)); return a ? a.slice(k.length + 3) : d; };
const FPS = +arg('fps', 15), ONLY = arg('clips', ''), JSONOUT = arg('json', ''), HEAT = arg('heat', '');
await MeshoptDecoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder });
const doc = await io.read(FILE);
await doc.transform(dequantize());
const root = doc.getRoot(), skin = root.listSkins()[0], joints = skin.listJoints();
const JN = joints.map(j => j.getName().replace(/^mixamorig[:_]?/, '')), JI = Object.fromEntries(JN.map((n, i) => [n, i]));
const IBM = skin.getInverseBindMatrices().getArray();
const nodes = root.listNodes(), NI = new Map(nodes.map((n, i) => [n, i]));
const parent = new Int32Array(nodes.length).fill(-1);
nodes.forEach((n, i) => n.listChildren().forEach(c => { parent[NI.get(c)] = i; }));
const order = []; { const seen = new Uint8Array(nodes.length); const visit = i => { if (seen[i]) return; if (parent[i] >= 0) visit(parent[i]); seen[i] = 1; order.push(i); }; nodes.forEach((_, i) => visit(i)); }

/* the skinned primitive(s): positions, weights, triangles */
let P = [], JW = [], TRI = [];
for (const mesh of root.listMeshes()) for (const prim of mesh.listPrimitives()) {
  const A = prim.getAttribute('POSITION'), J = prim.getAttribute('JOINTS_0'), W = prim.getAttribute('WEIGHTS_0');
  if (!J || !W) continue;
  const base = P.length / 3, v = [0, 0, 0], j4 = [0, 0, 0, 0], w4 = [0, 0, 0, 0];
  for (let i = 0; i < A.getCount(); i++) { A.getElement(i, v); J.getElement(i, j4); W.getElement(i, w4); P.push(...v); JW.push(...j4, ...w4); }
  const ix = prim.getIndices(); if (ix) for (let i = 0; i < ix.getCount(); i++) TRI.push(base + ix.getScalar(i)); else for (let i = 0; i < A.getCount(); i++) TRI.push(base + i);
}
P = Float64Array.from(P); JW = Float64Array.from(JW); TRI = Uint32Array.from(TRI);
const NV = P.length / 3;

/* the node tree posed by a take at t (null: the rest pose) -> world matrices */
const tmpQ = new Quaternion(), tmpQ2 = new Quaternion();
const sample = (ch, t) => {
  const smp = ch.getSampler(), inp = smp.getInput().getArray(), out = smp.getOutput().getArray(), n = inp.length, interp = smp.getInterpolation();
  const w = ch.getTargetPath() === 'rotation' ? 4 : 3, cub = interp === 'CUBICSPLINE', stride = cub ? 3 * w : w, off = cub ? w : 0;
  const at = k => Array.from(out.slice(k * stride + off, k * stride + off + w));
  if (t <= inp[0]) return at(0); if (t >= inp[n - 1]) return at(n - 1);
  let lo = 0, hi = n - 1; while (hi - lo > 1) { const m = (lo + hi) >> 1; if (inp[m] <= t) lo = m; else hi = m; }
  if (interp === 'STEP') return at(lo);
  const u = (t - inp[lo]) / (inp[hi] - inp[lo]), a = at(lo), b = at(hi);
  if (w === 4) { tmpQ.fromArray(a); tmpQ2.fromArray(b); tmpQ.slerp(tmpQ2, u); return tmpQ.toArray(); }
  return a.map((x, k) => x + (b[k] - x) * u);
};
const world = nodes.map(() => new Matrix4());
const _l = new Matrix4(), _t = new Vector3(), _q = new Quaternion(), _s = new Vector3();
const pose = (an, t) => {
  const trs = nodes.map(n => ({ t: n.getTranslation(), r: n.getRotation(), s: n.getScale() }));
  if (an) for (const ch of an.listChannels()) { const i = NI.get(ch.getTargetNode()), p = ch.getTargetPath();
    if (p === 'translation') trs[i].t = sample(ch, t); else if (p === 'rotation') trs[i].r = sample(ch, t); else if (p === 'scale') trs[i].s = sample(ch, t); }
  for (const i of order) { _l.compose(_t.fromArray(trs[i].t), _q.fromArray(trs[i].r).normalize(), _s.fromArray(trs[i].s));
    if (parent[i] >= 0) world[i].multiplyMatrices(world[parent[i]], _l); else world[i].copy(_l); }
};
const SK = new Float64Array(joints.length * 16), _m = new Matrix4(), _ib = new Matrix4();
const skinMats = () => joints.forEach((j, k) => { _ib.fromArray(IBM, k * 16); _m.multiplyMatrices(world[NI.get(j)], _ib); SK.set(_m.elements, k * 16); });
const jointPos = () => joints.map(j => { const e = world[NI.get(j)].elements; return [e[12], e[13], e[14]]; });
const deform = (out) => {
  for (let i = 0; i < NV; i++) {
    let x = 0, y = 0, z = 0; const px = P[3 * i], py = P[3 * i + 1], pz = P[3 * i + 2];
    for (let k = 0; k < 4; k++) { const w = JW[8 * i + 4 + k]; if (!w) continue; const o = JW[8 * i + k] * 16;
      x += w * (SK[o] * px + SK[o + 4] * py + SK[o + 8] * pz + SK[o + 12]);
      y += w * (SK[o + 1] * px + SK[o + 5] * py + SK[o + 9] * pz + SK[o + 13]);
      z += w * (SK[o + 2] * px + SK[o + 6] * py + SK[o + 10] * pz + SK[o + 14]); }
    out[3 * i] = x; out[3 * i + 1] = y; out[3 * i + 2] = z;
  }
};

/* the rest pose: the reference (and a check that it is the bind pose) */
pose(null, 0); skinMats();
const R = new Float64Array(NV * 3); deform(R);
let restErr = 0; for (let i = 0; i < NV * 3; i++) restErr = Math.max(restErr, Math.abs(R[i] - P[i]));
const RJ = jointPos();
const REST_S2 = world[NI.get(joints[JI.Spine2])].clone();   // the chest's rest frame, for its forward axis posed
const has = n => JI[n] !== undefined;
const SPINE = ['Hips', 'Spine', 'Spine1', 'Spine2', 'Neck'].filter(has).map(n => JI[n]);
const ARMS = [['LeftShoulder', 'LeftArm'], ['LeftArm', 'LeftForeArm'], ['LeftForeArm', 'LeftHand'], ['RightShoulder', 'RightArm'], ['RightArm', 'RightForeArm'], ['RightForeArm', 'RightHand']]
  .filter(([a, b]) => has(a) && has(b)).map(([a, b]) => [JI[a], JI[b]]);
const segD = (p, a, b) => { const ab = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], ap = [p[0] - a[0], p[1] - a[1], p[2] - a[2]];
  const L2 = ab[0] ** 2 + ab[1] ** 2 + ab[2] ** 2 || 1e-9, t = Math.max(0, Math.min(1, (ap[0] * ab[0] + ap[1] * ab[1] + ap[2] * ab[2]) / L2));
  return Math.hypot(ap[0] - t * ab[0], ap[1] - t * ab[1], ap[2] - t * ab[2]); };
const polyD = (p, J, chain) => { let d = 9; for (let k = 0; k + 1 < chain.length; k++) d = Math.min(d, segD(p, J[chain[k]], J[chain[k + 1]])); return d; };
/* regions, in the rest pose */
const hipsY = RJ[JI.Hips][1], neckY = RJ[JI.Neck][1], spineZ = RJ[JI.Spine1][2];
const REG = new Uint8Array(NV), D0 = new Float64Array(NV);   // 1 trunk, 2 arm, 3 head, 4 below the hips
let nT = 0;
for (let i = 0; i < NV; i++) {
  const p = [R[3 * i], R[3 * i + 1], R[3 * i + 2]];
  const dS = polyD(p, RJ, SPINE); let dA = 9; for (const [a, b] of ARMS) dA = Math.min(dA, segD(p, RJ[a], RJ[b]));
  if (p[1] > neckY) REG[i] = 3;
  else if (dA < dS && dA < 0.14) REG[i] = 2;
  else if (p[1] >= hipsY - 0.02) { REG[i] = 1; D0[i] = dS; nT++; }
  else REG[i] = 4;
}
/* the trunk's slabs for DEPTH: five heights between the hips and the neck, each 4 cm */
const SLABS = [0.15, 0.32, 0.5, 0.68, 0.85].map(f => hipsY + f * (neckY - hipsY));
const slabOf = new Int8Array(NV).fill(-1);
for (let i = 0; i < NV; i++) if (REG[i] === 1 && D0[i] > 0.03) SLABS.forEach((y, k) => { if (Math.abs(R[3 * i + 1] - y) < 0.02) slabOf[i] = k; });
/* edges (unique, over positions grouped by value so seam copies count once) and the seam copies */
const gkey = new Map(), gid = new Int32Array(NV); let G = 0;
for (let i = 0; i < NV; i++) { const k = `${Math.round(P[3 * i] * 1e5)},${Math.round(P[3 * i + 1] * 1e5)},${Math.round(P[3 * i + 2] * 1e5)}`;
  let g = gkey.get(k); if (g === undefined) { g = G++; gkey.set(k, g); } gid[i] = g; }
const rep = new Int32Array(G).fill(-1); for (let i = 0; i < NV; i++) if (rep[gid[i]] < 0) rep[gid[i]] = i;
const seamPairs = []; for (let i = 0; i < NV; i++) if (rep[gid[i]] !== i) seamPairs.push(rep[gid[i]], i);
const eset = new Set(), EDGES = [];
for (let t = 0; t < TRI.length; t += 3) for (let k = 0; k < 3; k++) { const a = rep[gid[TRI[t + k]]], b = rep[gid[TRI[t + (k + 1) % 3]]]; if (a === b) continue;
  const key = a < b ? a * 4194304 + b : b * 4194304 + a; if (!eset.has(key)) { eset.add(key); EDGES.push(a, b); } }
const EL0 = new Float64Array(EDGES.length / 2); for (let e = 0; e < EL0.length; e++) { const a = EDGES[2 * e], b = EDGES[2 * e + 1]; EL0[e] = Math.hypot(R[3 * a] - R[3 * b], R[3 * a + 1] - R[3 * b + 1], R[3 * a + 2] - R[3 * b + 2]); }
console.log(`${FILE}: ${NV} vertices, ${TRI.length / 3} triangles, ${joints.length} joints; rest pose = bind pose within ${restErr.toExponential(1)} m;`
  + ` trunk ${nT} points (hips y ${hipsY.toFixed(3)} .. neck y ${neckY.toFixed(3)}), ${EL0.length} edges, ${seamPairs.length / 2} seam copies`);

const X = new Float64Array(NV * 3), rat = new Float64Array(NV);
const measure = () => {
  const J = jointPos(); const r = { chest: [], back: [] }; let cav = 0, swell = 0, nTr = 0;
  for (let i = 0; i < NV; i++) { if (REG[i] !== 1 || D0[i] < 0.04) { rat[i] = 1; continue; }
    const q = polyD([X[3 * i], X[3 * i + 1], X[3 * i + 2]], J, SPINE) / D0[i]; rat[i] = q; nTr++;
    (R[3 * i + 2] >= spineZ ? r.chest : r.back).push(q); if (q < 0.75) cav++; if (q > 1.35) swell++; }
  const pct = (a, f) => { if (!a.length) return 1; a.sort((x, y) => x - y); return a[Math.floor(f * (a.length - 1))]; };
  /* depth: along the posed Spine2's own forward (the rest pose's +z carried by that bone) */
  /* the rest pose's +z carried by the chest's own turn (posed frame times the rest frame's inverse), never the bone's
     local axis (a rig's local z need not be the body's forward) */
  const rot = new Matrix4().multiplyMatrices(world[NI.get(joints[JI.Spine2])], REST_S2.clone().invert()).elements;
  const fw = [rot[8], rot[9], rot[10]]; const fl = Math.hypot(...fw); fw.forEach((x, k) => fw[k] = x / fl);
  const s2r = [0, 0, 1];   // the rest pose faces +z
  const dep = SLABS.map(() => [9, -9, 9, -9]);
  for (let i = 0; i < NV; i++) { const k = slabOf[i]; if (k < 0) continue;
    const d1 = X[3 * i] * fw[0] + X[3 * i + 1] * fw[1] + X[3 * i + 2] * fw[2], d0 = R[3 * i] * s2r[0] + R[3 * i + 1] * s2r[1] + R[3 * i + 2] * s2r[2];
    dep[k][0] = Math.min(dep[k][0], d1); dep[k][1] = Math.max(dep[k][1], d1); dep[k][2] = Math.min(dep[k][2], d0); dep[k][3] = Math.max(dep[k][3], d0); }
  const depth = dep.map(([a, b, c, d]) => (b - a) / ((d - c) || 1));
  const eb = [0, 0, 0, 0, 0].map(() => [0, 0, 0]);
  for (let e = 0; e < EL0.length; e++) { const a = EDGES[2 * e], b = EDGES[2 * e + 1]; if (EL0[e] < 1e-5) continue;
    const L = Math.hypot(X[3 * a] - X[3 * b], X[3 * a + 1] - X[3 * b + 1], X[3 * a + 2] - X[3 * b + 2]) / EL0[e], g = REG[a];
    eb[g][0]++; if (L < 0.5) eb[g][1]++; if (L > 2) eb[g][2]++; }
  let seam = 0; for (let k = 0; k < seamPairs.length; k += 2) { const a = seamPairs[k], b = seamPairs[k + 1]; seam = Math.max(seam, Math.hypot(X[3 * a] - X[3 * b], X[3 * a + 1] - X[3 * b + 1], X[3 * a + 2] - X[3 * b + 2])); }
  let miny = 9; for (let i = 0; i < NV; i++) miny = Math.min(miny, X[3 * i + 1]);
  return { cav: cav / (nTr || 1), swell: swell / (nTr || 1), chest5: pct(r.chest, 0.05), chest1: pct(r.chest, 0.01), back5: pct(r.back, 0.05), back1: pct(r.back, 0.01),
    depth: Math.min(...depth), depthAll: depth, squash: eb.map(x => x[1] / (x[0] || 1)), stretch: eb.map(x => x[2] / (x[0] || 1)), seam, miny };
};

const heats = HEAT ? HEAT.split(',').map(s => { const [ta, out] = s.split(':'); const [take, t] = ta.split('@'); return { take, t: +t, out }; }) : [];
const all = {};
for (const an of root.listAnimations()) {
  const name = an.getName(); if (ONLY && !ONLY.split(',').includes(name)) continue;
  const dur = Math.max(...an.listChannels().map(c => { const a = c.getSampler().getInput().getArray(); return a[a.length - 1]; }));
  const frames = [];
  for (let f = 0; f <= Math.round(dur * FPS); f++) { const t = Math.min(dur, f / FPS); pose(an, t); skinMats(); deform(X); frames.push({ t, ...measure() }); }
  all[name] = frames;
  const worst = (k, sign) => frames.reduce((a, b) => (sign * b[k] > sign * a[k] ? b : a));
  const wc = worst('cav', 1), wch = worst('chest1', -1), wb = worst('back1', -1), wd = worst('depth', -1), ws = worst('seam', 1);
  const sq = frames.reduce((a, b) => (b.squash[1] > a.squash[1] ? b : a));
  console.log(`${name.padEnd(28)} ${dur.toFixed(2)}s | caved<0.75 max ${(100 * wc.cav).toFixed(1)}% @${wc.t.toFixed(2)} | chest p1 ${wch.chest1.toFixed(2)} @${wch.t.toFixed(2)} | back p1 ${wb.back1.toFixed(2)} @${wb.t.toFixed(2)}`
    + ` | depth min ${wd.depth.toFixed(2)} @${wd.t.toFixed(2)} | trunk edges squashed ${(100 * sq.squash[1]).toFixed(1)}% @${sq.t.toFixed(2)} | arm sq ${(100 * Math.max(...frames.map(x => x.squash[2]))).toFixed(1)}%`
    + ` | seam ${(100 * ws.seam).toFixed(1)} cm | low y ${Math.min(...frames.map(x => x.miny)).toFixed(3)}`);
}
if (JSONOUT) fs.writeFileSync(JSONOUT, JSON.stringify(all));
/* a frame's posed skin painted by the trunk measure */
for (const h of heats) {
  const an = root.listAnimations().find(a => a.getName() === h.take); if (!an) throw new Error('no take ' + h.take);
  pose(an, h.t); skinMats(); deform(X); measure();
  const d = new Document(), buf = d.createBuffer(), col = new Float32Array(NV * 4);
  for (let i = 0; i < NV; i++) { const q = rat[i]; let c = [0.78, 0.78, 0.76];
    if (REG[i] === 1 && q < 0.75) { const k = Math.min(1, (0.75 - q) / 0.35); c = [0.95, 0.55 * (1 - k), 0.5 * (1 - k)]; }
    else if (REG[i] === 1 && q > 1.35) { const k = Math.min(1, (q - 1.35) / 0.5); c = [0.5 * (1 - k), 0.6 * (1 - k) + 0.2, 1]; }
    col.set([...c, 1], 4 * i); }
  const acc = (type, arr) => d.createAccessor().setType(type).setArray(arr).setBuffer(buf);
  const prim = d.createPrimitive().setAttribute('POSITION', acc('VEC3', Float32Array.from(X))).setAttribute('COLOR_0', acc('VEC4', col))
    .setIndices(acc('SCALAR', Uint32Array.from(TRI))).setMaterial(d.createMaterial('heat').setRoughnessFactor(0.8).setDoubleSided(true));
  d.createScene().addChild(d.createNode('heat').setMesh(d.createMesh('heat').addPrimitive(prim)));
  await new NodeIO().write(h.out, d); console.log('heat', h.take, h.t, '->', h.out);
}
