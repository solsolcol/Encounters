/* v26.0: AN ARMPIT'S LOOSE FLAPS LAID DOWN ON THE ARM (Chad, 12 Nov 2026: "Grandmaster pho's models still have that
   skin piece sticking out of his right armpits issue, can you fix it completely?"; "Pho's armpit problem can be seen
   directly in game, when facing him straight head on, as he talks, his arm swings, and the issue can be seen").
   WHAT THE PIECES ARE (tools/probes/armslice.py: his upper arm cut across, posed as he talks): his scan pressed the arm
   against his side, and the front fold of the armpit between the chest and the arm came out a thin pleat, two walls a
   centimetre apart. Weighted wholly to the arm, the pleat's lower end rides the arm as it swings out and hangs a
   centimetre off the arm's top as loose flaps (and a few spikes stand off it): the slivers seen from his front. Cut
   away, each opens a hole (the pleat IS the arm's skin there: tried, photographed). So they are LAID DOWN instead:
     posed in the take and moment named (the arm open), each point wholly the arm's (`--min`, 0.95 of the upper arm)
     between `s0` and `s1` metres down the arm from its joint, on the side toward his chest, looks straight in toward
     the arm's own line; where another surface of the arm faces it within `gap` (2 cm), the point (and every point at
     its place: a sheet's seams split one place into several) is set a millimetre under that surface, and brought back
     to the bind pose through its own bones. Wholly the arm's, it is the arm's skin in every frame of every take after.
   No triangle is added or taken out, no paint, weight, bone or take is touched; only the points named move.
     node tools/armflap.mjs <in.glb> <out.glb> [--take=Sitting_Answering_Questions] [--t=0.7] [--s0=0.0] [--s1=0.12]
          [--gap=0.02] [--min=0.95] [--passes=2] [--dry] */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder, MeshoptEncoder } from 'meshoptimizer';
import * as THREE from 'three';
await MeshoptDecoder.ready; await MeshoptEncoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder, 'meshopt.encoder': MeshoptEncoder });
const args = process.argv.slice(2), files = args.filter(a => !a.startsWith('--')), arg = (k, d) => { const a = args.find(x => x.startsWith(`--${k}=`)); return a ? a.slice(k.length + 3) : d; };
const [IN, OUT] = files, DRY = args.includes('--dry');
const TAKE = arg('take', 'Sitting_Answering_Questions'), T = +arg('t', 0.7), S0 = +arg('s0', 0.0), S1 = +arg('s1', 0.12), GAP = +arg('gap', 0.02), MIN = +arg('min', 0.95), PASSES = +arg('passes', 2);
const doc = await io.read(IN), root = doc.getRoot(), skin = root.listSkins()[0], joints = skin.listJoints(), IBM = skin.getInverseBindMatrices().getArray();
const nodes = root.listNodes(), NI = new Map(nodes.map((n, i) => [n, i])), parent = new Int32Array(nodes.length).fill(-1);
nodes.forEach((n, i) => n.listChildren().forEach(c => { parent[NI.get(c)] = i; }));
const order = []; { const seen = new Uint8Array(nodes.length); const visit = i => { if (seen[i]) return; if (parent[i] >= 0) visit(parent[i]); seen[i] = 1; order.push(i); }; nodes.forEach((_, i) => visit(i)); }
const tq = new THREE.Quaternion(), tq2 = new THREE.Quaternion();
const sample = (ch, t) => { const smp = ch.getSampler(), inp = smp.getInput().getArray(), out = smp.getOutput().getArray(), n = inp.length, interp = smp.getInterpolation();
  const w = ch.getTargetPath() === 'rotation' ? 4 : 3, cub = interp === 'CUBICSPLINE', stride = cub ? 3 * w : w, off = cub ? w : 0, at = k => Array.from(out.slice(k * stride + off, k * stride + off + w));
  if (t <= inp[0]) return at(0); if (t >= inp[n - 1]) return at(n - 1); let lo = 0, hi = n - 1; while (hi - lo > 1) { const m = (lo + hi) >> 1; if (inp[m] <= t) lo = m; else hi = m; }
  if (interp === 'STEP') return at(lo); const u = (t - inp[lo]) / (inp[hi] - inp[lo]), a = at(lo), b = at(hi);
  if (w === 4) { tq.fromArray(a); tq2.fromArray(b); tq.slerp(tq2, u); return tq.toArray(); } return a.map((x, k) => x + (b[k] - x) * u); };
const world = nodes.map(() => new THREE.Matrix4()), _l = new THREE.Matrix4(), _t = new THREE.Vector3(), _q = new THREE.Quaternion(), _s = new THREE.Vector3();
const pose = (an, t) => { const trs = nodes.map(n => ({ t: n.getTranslation(), r: n.getRotation(), s: n.getScale() }));
  if (an) for (const ch of an.listChannels()) { const i = NI.get(ch.getTargetNode()), p = ch.getTargetPath(); if (p === 'translation') trs[i].t = sample(ch, t); else if (p === 'rotation') trs[i].r = sample(ch, t); else if (p === 'scale') trs[i].s = sample(ch, t); }
  for (const i of order) { _l.compose(_t.fromArray(trs[i].t), _q.fromArray(trs[i].r).normalize(), _s.fromArray(trs[i].s)); if (parent[i] >= 0) world[i].multiplyMatrices(world[parent[i]], _l); else world[i].copy(_l); } };
const an = root.listAnimations().find(a => a.getName() === TAKE); if (!an) { console.error('no take ' + TAKE); process.exit(2); }
pose(an, T); const SM = joints.map((j, k) => new THREE.Matrix4().multiplyMatrices(world[NI.get(j)], new THREE.Matrix4().fromArray(IBM, k * 16)));
const jA = joints.findIndex(j => /RightArm$/.test(j.getName())), jE = joints.findIndex(j => /RightForeArm$/.test(j.getName())), jS = joints.findIndex(j => /Spine2$/.test(j.getName()));
const PA = new THREE.Vector3().setFromMatrixPosition(world[NI.get(joints[jA])]), PE = new THREE.Vector3().setFromMatrixPosition(world[NI.get(joints[jE])]), PS = new THREE.Vector3().setFromMatrixPosition(world[NI.get(joints[jS])]);
const AX = PE.clone().sub(PA).normalize(), TOC = PS.clone().sub(PA); TOC.addScaledVector(AX, -TOC.dot(AX)).normalize();
/* the part that holds the armpit: the one with the most points near the shoulder joint */
let Q = null;
root.listMeshes().forEach(m => m.listPrimitives().forEach(pr => { const P = pr.getAttribute('POSITION'), J = pr.getAttribute('JOINTS_0'), W = pr.getAttribute('WEIGHTS_0'), I = pr.getIndices(); if (!P || !J || !W || !I) return;
  const n = P.getCount(), X = new Float64Array(n * 3), e = [0, 0, 0], j4 = [0, 0, 0, 0], w4 = [0, 0, 0, 0], v = new THREE.Vector3(), M = new THREE.Matrix4(); let k = 0;
  const Wa = new Float32Array(n);
  for (let i = 0; i < n; i++) { P.getElement(i, e); J.getElement(i, j4); W.getElement(i, w4); M.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0); const me = M.elements;
    for (let c = 0; c < 4; c++) { if (!(w4[c] > 0)) continue; const s = SM[j4[c]].elements; for (let z = 0; z < 16; z++) me[z] += w4[c] * s[z]; if (j4[c] === jA) Wa[i] += w4[c]; }
    v.fromArray(e).applyMatrix4(M); X[3 * i] = v.x; X[3 * i + 1] = v.y; X[3 * i + 2] = v.z; if (v.distanceTo(PA) < 0.25) k++; }
  if (!Q || k > Q.k) Q = { pr, P, J, W, I, X, n, k, Wa }; }));
const { P, J, W, X, n, Wa } = Q, ix = Q.I.getArray(), nT = ix.length / 3;
const XP = (i, out = new THREE.Vector3()) => out.set(X[3 * i], X[3 * i + 1], X[3 * i + 2]);
/* points at one place (a sheet's seams split them): welded to a tenth of a millimetre, in the bind pose */
const e3 = [0, 0, 0], key = new Map(), grp = new Int32Array(n);
for (let i = 0; i < n; i++) { P.getElement(i, e3); const k = e3.map(x => Math.round(x * 1e5)).join(','); if (!key.has(k)) key.set(k, key.size); grp[i] = key.get(k); }
const members = new Map(); for (let i = 0; i < n; i++) { const g = grp[i]; if (!members.has(g)) members.set(g, []); members.get(g).push(i); }
/* the triangles near the arm, posed */
const near = []; { const c = new THREE.Vector3(); for (let t = 0; t < nT; t++) { const a = ix[3 * t], b = ix[3 * t + 1], d = ix[3 * t + 2]; c.set((X[3 * a] + X[3 * b] + X[3 * d]) / 3, (X[3 * a + 1] + X[3 * b + 1] + X[3 * d + 1]) / 3, (X[3 * a + 2] + X[3 * b + 2] + X[3 * d + 2]) / 3); if (c.distanceTo(PA) < S1 + 0.12) near.push(t); } }
const _e1 = new THREE.Vector3(), _e2 = new THREE.Vector3(), _pv = new THREE.Vector3(), _tv = new THREE.Vector3(), _qv = new THREE.Vector3(), _a = new THREE.Vector3(), _b = new THREE.Vector3(), _c = new THREE.Vector3(), _nn = new THREE.Vector3();
/* the nearest surface straight along d from p within GAP that faces p, not touching p's own place */
function rayHit(p, d, g) {
  let best = Infinity;
  for (const t of near) { const ia = ix[3 * t], ib = ix[3 * t + 1], ic = ix[3 * t + 2]; if (grp[ia] === g || grp[ib] === g || grp[ic] === g) continue;
    /* (and the surface it is laid on must ride the arm as wholly as it does, or in another frame the two part again: a
       flap laid on the skin near the elbow, which the forearm shares, stood out as a tab when the arm was raised) */
    if (Wa[ia] < MIN - 0.05 || Wa[ib] < MIN - 0.05 || Wa[ic] < MIN - 0.05) continue;
    XP(ia, _a); XP(ib, _b); XP(ic, _c); _e1.subVectors(_b, _a); _e2.subVectors(_c, _a); _pv.crossVectors(d, _e2); const det = _e1.dot(_pv); if (Math.abs(det) < 1e-12) continue;
    const inv = 1 / det; _tv.subVectors(p, _a); const u = _tv.dot(_pv) * inv; if (u < 0 || u > 1) continue; _qv.crossVectors(_tv, _e1); const v = d.dot(_qv) * inv; if (v < 0 || u + v > 1) continue;
    const tt = _e2.dot(_qv) * inv; if (tt <= 0.0005 || tt > GAP || tt >= best) continue;
    _nn.crossVectors(_e1, _e2); if (_nn.dot(d) >= 0) continue;            // (it must face back toward p: an outer face of the arm under the flap)
    best = tt; }
  return best;
}
const moved = new Map(); let tried = 0;
for (let pass = 0; pass < PASSES; pass++) {
  let nm = 0;
  for (const [g, list] of members) { const i = list[0]; if (moved.has(g) && pass === 0) continue;
    let wmin = 1; for (const k of list) wmin = Math.min(wmin, Wa[k]); if (wmin < MIN) continue;
    const p = XP(i), r = p.clone().sub(PA), s = r.dot(AX); if (s < S0 || s > S1) continue;
    r.addScaledVector(AX, -s); const rl = r.length(); if (rl < 1e-4) continue; r.multiplyScalar(1 / rl);
    if (r.dot(TOC) < 0.2) continue;                                             // (the side toward his chest)
    tried++;
    const d = r.clone().negate(), tt = rayHit(p, d, g); if (!isFinite(tt)) continue;
    const q = p.clone().addScaledVector(d, tt + 0.001);
    for (const k of list) { X[3 * k] = q.x; X[3 * k + 1] = q.y; X[3 * k + 2] = q.z; }
    moved.set(g, tt); nm++; }
  console.log(`pass ${pass + 1}: ${nm} places laid down`);
}
const gaps = [...moved.values()].sort((a, b) => a - b);
console.log(`${tried} places looked at; ${moved.size} laid down, each by ${gaps.length ? (gaps[0] * 1000).toFixed(1) + ' to ' + (gaps[gaps.length - 1] * 1000).toFixed(1) + ' mm (median ' + (gaps[gaps.length >> 1] * 1000).toFixed(1) + ')' : '-'}`);
if (DRY) process.exit(0);
/* back to the bind pose through each point's own bones */
const j4 = [0, 0, 0, 0], w4 = [0, 0, 0, 0], v = new THREE.Vector3(), M = new THREE.Matrix4(); let over = 0;
const norm = P.getNormalized(), arr = P.getArray(), lim = 1;
for (const g of moved.keys()) for (const i of members.get(g)) { J.getElement(i, j4); W.getElement(i, w4); M.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0); const me = M.elements;
  for (let c = 0; c < 4; c++) { if (!(w4[c] > 0)) continue; const s = SM[j4[c]].elements; for (let z = 0; z < 16; z++) me[z] += w4[c] * s[z]; }
  v.set(X[3 * i], X[3 * i + 1], X[3 * i + 2]).applyMatrix4(M.invert());
  if (norm && (Math.abs(v.x) > lim || Math.abs(v.y) > lim || Math.abs(v.z) > lim)) { over++; continue; }
  P.setElement(i, [v.x, v.y, v.z]); }
if (over) { console.error(over + ' points fall outside the part\'s quantized range: nothing written'); process.exit(3); }
await io.write(OUT, doc); console.log('wrote ' + OUT);
