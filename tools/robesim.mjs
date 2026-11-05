// v24.47 · GRANDMASTER PHO'S ROBE AS CLOTH ROUND HIS REAL LEGS. Chad, 4 Nov 2026: his legs made real at his word
// (tools/leggraft.mjs), and a robe built for his old invisible legs that could not make room for them — seated, a real
// knee sat in front of it; walking and running, skin came through it. Put to him, his pick: "Cloth simulation"
// (masters/v24.47/PLAN.md). Run after tools/leggraft.mjs mesh and before tools/prepmonk.mjs:
//   node tools/robesim.mjs <in.glb> <out.glb>
//
// WHAT IT DOES. The robe below his waist (every point riding the skirt's chains, tools/robeskin.mjs SKIRT) is taken over
// by cloth that keeps the robe's own shape and makes room for his legs:
//   1. A PROXY: a tube of NA x NR particles round his legs' axis, from the waist ring down to the hem (each column ends at
//      the robe's own hem there), at the robe's outer radius at rest — measured from the robe's own wall points — and
//      clear of his real legs at rest by MARGIN.
//   2. Its SHAPE in every frame of every take is the robe's as the skirt's chains carry it (robeskin's skirt, fitted to
//      his file's robe where his file moves it): each particle is skinned like the robe points nearest it at rest (KNN),
//      and that is its TARGET.
//   3. Every take SIMULATED (position-based): gravity and damping; a spring toward the target (KTARGET a step); stretch,
//      shear and bend constraints whose lengths are the target's own, so the cloth keeps the robe's shape and only spreads
//      a push to its neighbours (a stretch resisted fully, a squeeze at KCOMP); each particle kept within its MOTION
//      DISTANCE of its target (0 at the waist, growing to MAXD at the hem) — a target never inside a leg and never pulling
//      the cloth across one; and, last, the COLLIDERS: each real leg (the new thigh and shin bones of tools/leggraft.mjs,
//      as thick as his legs' own points measure in that pose, plus MARGIN, and, where the robe lies in layers, as deep as
//      its layers go under the cloth's surface there: DEPTH; a knee bent shut filled from hip to ankle: KNEEFOLD), the
//      feet and heels, the floor. A take starts from the robe hanging at rest, carried into its first frame by his legs
//      (SETTLE) and held (HOLD); a take that ends where it began runs until the cloth has settled into it (LOOPSECS) and
//      is closed by spreading what its end misses its start by over its last LOOPBLEND seconds. Per take: the robe's shape
//      may be taken from another robe file (TARGETFROM, TARGETTAKES), legs folded on the floor draped (DRAPETAKES), and
//      the hem's motion distance set to its own MAXD (MAXDTAKES).
//   4. BAKED as cloth bones: a BA x BR grid of the particles, each bone a child of the waist bone, placed by a least-squares
//      fit to the whole cloth (LSFIT) and turned to lie along the cloth there (round the ring, up the column; the robe's
//      own turn where the cloth folds over itself), keyed at FPS and thinned to the keys that matter (a key is dropped
//      only where the bone's place and turn between the keys kept stay within POSTOL metres and ROTTOL degrees of it), the
//      values on power-of-two grids (QT, QR, QTIME). (Chains down each column with turns alone were tried: a cloth pushed
//      out by a knee is longer than at rest, and the chains' bones, each its rest length from the one above, fell up to
//      4.8 cm short of it.)
//   5. The robe's skirt points RE-SKINNED to them: the share each had on the chains spread bilinearly over the four bones
//      round it (its other weights kept). The chains then drive nothing, and their tracks are dropped.
// Nothing above the waist, nothing outside the skirt's points, and no bone of his own is touched.
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { Matrix4, Vector3, Quaternion } from 'three';
import { writeFileSync } from 'node:fs';

const [IN, OUT] = process.argv.slice(2);
if (!IN || !OUT) { console.error('usage: node tools/robesim.mjs <in.glb> <out.glb>'); process.exit(1); }
const E = (k, d) => (process.env[k] !== undefined ? Number(process.env[k]) : d);
const NA = E('NA', 48), NR = E('NR', 28), BA = E('BA', 16), BR = E('BR', 10), FPS = E('FPS', 24);
const DT = 1 / E('HZ', 120), ITER = E('ITER', 8), DAMP = E('DAMP', 0.985), GRAV = E('GRAV', 9.81);
const KST = E('KST', 1), KCOMP = E('KCOMP', 0.2), KSH = E('KSH', 0.5), KBE = E('KBE', 0.1);   // stretch, a squeeze's share of it, shear, bend
const MAXD = E('MAXD', 0.10), MAXP = E('MAXP', 1.5), KTARGET = E('KTARGET', 0.04), KNN = E('KNN', 8);
/* MAXDTAKES=<take>:<metres>,...: a take's own MAXD at the hem (running's heel kick: the robe kept nearer its own shape,
   whose chains follow the real legs, covers his thigh where a freer cloth swung clear of it); unset, every take MAXD */
const MAXDTAKES = new Map((process.env.MAXDTAKES || '').split(',').filter(Boolean).map(x => { const [k, v] = x.split(':'); if (!(Number(v) >= 0)) throw new Error(`robesim: MAXDTAKES: ${x}`); return [k, Number(v)]; }));
const KNEEFOLD = E('KNEEFOLD', 75), MARGIN = E('MARGIN', 0.02), SETTLE = E('SETTLE', 0.8), HOLD = E('HOLD', 0.3), LOOPBLEND = E('LOOPBLEND', 0.2), LOOPSECS = E('LOOPSECS', 1.5), ROOTY = E('ROOTY', 0.93);
const POSTOL = E('POSTOL', 0.003), ROTTOL = E('ROTTOL', 1) * Math.PI / 180, QT = E('QT', 2 ** -12), QR = E('QR', 2 ** -15), QTIME = E('QTIME', 2 ** -12), DEPTH = E('DEPTH', 1), DEPTHMAX = E('DEPTHMAX', 0.05);
const DUMP = process.env.SIMDUMP || '';   // 'Take@t': the particles, their targets and the colliders then, as JSON to SIMDUMPOUT
const log = (...a) => console.log(...a);
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
const doc = await io.read(IN), root = doc.getRoot();
if (root.listMeshes().length !== 1 || root.listMeshes()[0].listPrimitives().length !== 1) throw new Error('robesim: one mesh with one primitive');
const prim = root.listMeshes()[0].listPrimitives()[0], skin = root.listSkins()[0], joints = skin.listJoints();
/* TARGETFROM=<robe file> TARGETTAKES=<takes>: for these takes the robe's shape the cloth keeps (the skirt's chains and its
   waist) is that file's — the same robe made another way (robeskin with or without LEGRIG): the chains that follow his
   rig's legs keep the robe over his knees when he sits on a chair, those that follow the real legs make room for them
   walking */
if (process.env.TARGETFROM) { const other = await io.read(process.env.TARGETFROM), oroot = other.getRoot(), buf0 = root.listBuffers()[0]; let swapped = 0;
  for (const take of (process.env.TARGETTAKES || '').split(',').filter(Boolean)) { const an = root.listAnimations().find(a => a.getName() === take), oan = oroot.listAnimations().find(a => a.getName() === take);
    if (!an || !oan) throw new Error(`robesim: TARGETTAKES: no take ${take} in both files`);
    const ochs = new Map(oan.listChannels().map(ch => [`${ch.getTargetNode()?.getName()}|${ch.getTargetPath()}`, ch]));
    for (const ch of an.listChannels()) { const nd = ch.getTargetNode(); if (!nd || !/^Skirt/.test(nd.getName())) continue; const och = ochs.get(`${nd.getName()}|${ch.getTargetPath()}`);
      if (!och) throw new Error(`robesim: TARGETTAKES: ${take} has no track for ${nd.getName()} ${ch.getTargetPath()} in ${process.env.TARGETFROM}`);
      const os = och.getSampler(), smp = ch.getSampler();
      smp.setInput(doc.createAccessor().setType('SCALAR').setArray(os.getInput().getArray().slice()).setBuffer(buf0)).setInterpolation(os.getInterpolation())
        .setOutput(doc.createAccessor().setType(os.getOutput().getType()).setArray(os.getOutput().getArray().slice()).setBuffer(buf0)); swapped++; } }
  console.log(`robesim: the robe's shape in ${process.env.TARGETTAKES} taken from ${process.env.TARGETFROM} (${swapped} tracks)`); }
const names = joints.map(j => j.getName().replace(/^mixamorig:?/, '')), ji = n => { const k = names.indexOf(n); if (k < 0) throw new Error('robesim: no joint ' + n); return k; };
const IB = joints.map((_, k) => new Matrix4().fromArray(skin.getInverseBindMatrices().getArray(), k * 16)), BW = IB.map(m => m.clone().invert());
const V3 = (x, y, z) => new Vector3(x, y, z), posOf = m => new Vector3().setFromMatrixPosition(m);
const isChain = names.map(x => /^Skirt[AMB]/.test(x));
const jWaist = ji('SkirtWaist'), waistNode = joints[jWaist];
const sstep = x => { const t = Math.max(0, Math.min(1, x)); return t * t * (3 - 2 * t); };
const pct = (arr, q) => { const s = [...arr].sort((a, b) => a - b); return s.length ? s[Math.min(s.length - 1, Math.floor(q * s.length))] : null; };

/* ------------------------------------------------------------------ the pose: his takes */
const nodes = root.listNodes(), NI = new Map(nodes.map((n, i) => [n, i])), parent = new Int32Array(nodes.length).fill(-1);
nodes.forEach((n, i) => n.listChildren().forEach(c => { parent[NI.get(c)] = i; }));
const order = []; { const seen = new Uint8Array(nodes.length); const visit = i => { if (seen[i]) return; if (parent[i] >= 0) visit(parent[i]); seen[i] = 1; order.push(i); }; nodes.forEach((_, i) => visit(i)); }
const restTRS = nodes.map(n => ({ t: n.getTranslation(), r: n.getRotation(), s: n.getScale() }));
const sampleCh = (ch, t) => { const smp = ch.getSampler(), inp = smp.getInput().getArray(), out = smp.getOutput().getArray(), n = inp.length, w = ch.getTargetPath() === 'rotation' ? 4 : 3;
  const cub = smp.getInterpolation() === 'CUBICSPLINE', stride = cub ? 3 * w : w, off = cub ? w : 0, at = k => Array.from(out.slice(k * stride + off, k * stride + off + w));
  if (t <= inp[0]) return at(0); if (t >= inp[n - 1]) return at(n - 1); let lo = 0, hi = n - 1; while (hi - lo > 1) { const m = (lo + hi) >> 1; if (inp[m] <= t) lo = m; else hi = m; }
  if (smp.getInterpolation() === 'STEP') return at(lo); const u = (t - inp[lo]) / (inp[hi] - inp[lo]), a = at(lo), b = at(hi);
  if (w === 4) return new Quaternion().fromArray(a).slerp(new Quaternion().fromArray(b), u).toArray(); return a.map((x, k) => x + (b[k] - x) * u); };
const world = nodes.map(() => new Matrix4()), Lm = new Matrix4(), Tv = new Vector3(), Qv = new Quaternion(), Sv = new Vector3();
const chanCache = new Map();
const chansOf = an => { if (!chanCache.has(an)) chanCache.set(an, an.listChannels().filter(ch => NI.has(ch.getTargetNode()))); return chanCache.get(an); };
/* f = 1: the take at t; f < 1: his rest pose eased toward it (each node's own turn and place blended) */
const pose = (an, t, f = 1) => {
  const trs = restTRS.map(x => ({ t: x.t, r: x.r, s: x.s }));
  if (an) for (const ch of chansOf(an)) { const i = NI.get(ch.getTargetNode()), p = ch.getTargetPath(), v = sampleCh(ch, t);
    if (p === 'translation') trs[i] = { ...trs[i], t: f >= 1 ? v : restTRS[i].t.map((x, k) => x + (v[k] - x) * f) };
    else if (p === 'rotation') trs[i] = { ...trs[i], r: f >= 1 ? v : new Quaternion().fromArray(restTRS[i].r).slerp(new Quaternion().fromArray(v), f).toArray() };
    else if (p === 'scale') trs[i] = { ...trs[i], s: v }; }
  for (const i of order) { Lm.compose(Tv.fromArray(trs[i].t), Qv.fromArray(trs[i].r).normalize(), Sv.fromArray(trs[i].s)); if (parent[i] >= 0) world[i].multiplyMatrices(world[parent[i]], Lm); else world[i].copy(Lm); } };
const Wj = k => world[NI.get(joints[k])];
const duration = an => Math.max(...an.listChannels().map(c => { const a = c.getSampler().getInput().getArray(); return a[a.length - 1]; }));

/* ------------------------------------------------------------------ the robe's skirt points and its shape at rest */
const P = prim.getAttribute('POSITION'), NRM = prim.getAttribute('NORMAL'), J = prim.getAttribute('JOINTS_0'), W = prim.getAttribute('WEIGHTS_0'), n = P.getCount();
const v = [0, 0, 0], nv = [0, 0, 0], jj = [0, 0, 0, 0], ww = [0, 0, 0, 0];
const cx = 0.5 * (posOf(BW[ji('LeftUpLeg')]).x + posOf(BW[ji('RightUpLeg')]).x), cz = 0.5 * (posOf(BW[ji('LeftUpLeg')]).z + posOf(BW[ji('RightUpLeg')]).z);
const share = new Float32Array(n), RP = new Float32Array(n * 3), OUTW = new Uint8Array(n);
let nSk = 0; for (let i = 0; i < n; i++) { J.getElement(i, jj); W.getElement(i, ww); let s = 0; for (let k = 0; k < 4; k++) if (isChain[jj[k]]) s += ww[k]; share[i] = s; P.getElement(i, v); RP.set(v, 3 * i); if (s > 0) nSk++;
  /* the robe's outside: facing away from his legs' axis, not down (its folds turned in, and its underside curling in to
     where the shins went in, are not where the cloth hangs) */
  NRM.getElement(i, nv); const rx = v[0] - cx, rz = v[2] - cz, rl = Math.hypot(rx, rz) || 1; OUTW[i] = s > 0 && nv[1] >= -0.5 && (nv[0] * rx + nv[2] * rz) / rl >= 0.2 ? 1 : 0; }
const thOf = (x, z) => { let a = Math.atan2(x - cx, z - cz); if (a < 0) a += 2 * Math.PI; return a; };   // 0 his front, growing to his left
/* the wall points per column: its hem and its radius down it */
const cols = Array.from({ length: NA }, () => []);
for (let i = 0; i < n; i++) { if (share[i] < 0.5 || !OUTW[i]) continue; const x = RP[3 * i], y = RP[3 * i + 1], z = RP[3 * i + 2]; if (y > ROOTY + 0.01) continue;
  const a = thOf(x, z) / (2 * Math.PI) * NA; for (const c of [Math.floor(a) % NA, (Math.floor(a) + 1) % NA]) { let d = Math.abs(a - c); if (d > NA / 2) d = NA - d; if (d <= 1) cols[c].push([y, Math.hypot(x - cx, z - cz)]); } }
const yHem = cols.map(c => pct(c.map(p => p[0]), 0.01));
for (let k = 0; k < NA; k++) if (yHem[k] === null) yHem[k] = yHem[(k + NA - 1) % NA] ?? 0.2;
const yRow = (c, j) => ROOTY + (yHem[c] - ROOTY) * j / (NR - 1);
const R0 = Array.from({ length: NA }, (_, c) => Array.from({ length: NR }, (_, j) => { const y = yRow(c, j), h = Math.abs(ROOTY - yHem[c]) / (NR - 1) * 1.5;
  return pct(cols[c].filter(p => Math.abs(p[0] - y) < h).map(p => p[1]), 0.85); }));
for (let pass = 0; pass < 4; pass++) for (let c = 0; c < NA; c++) for (let j = 0; j < NR; j++) if (R0[c][j] === null) { const nb = [R0[(c + NA - 1) % NA][j], R0[(c + 1) % NA][j], j ? R0[c][j - 1] : null, j < NR - 1 ? R0[c][j + 1] : null].filter(x => x !== null); if (nb.length) R0[c][j] = nb.reduce((a, b) => a + b, 0) / nb.length; }
for (let pass = 0; pass < 2; pass++) { const S = R0.map(r => r.slice()); for (let c = 0; c < NA; c++) for (let j = 0; j < NR; j++) R0[c][j] = 0.5 * S[c][j] + 0.125 * (S[(c + NA - 1) % NA][j] + S[(c + 1) % NA][j] + S[c][Math.max(0, j - 1)] + S[c][Math.min(NR - 1, j + 1)]); }
/* the tube never pinches in going down: its radius at most 10 % under the ring above (his robe's inner folds near the hem
   measure as little as 5 cm off the axis) */
for (let c = 0; c < NA; c++) for (let j = 1; j < NR; j++) R0[c][j] = Math.max(R0[c][j], 0.9 * R0[c][j - 1]);

/* ------------------------------------------------------------------ the colliders: the real legs, as thick as they measure */
const gU = { Left: ji('LeftLegGraftUp'), Right: ji('RightLegGraftUp') }, gL = { Left: ji('LeftLegGraftLow'), Right: ji('RightLegGraftLow') };
const NB = 10, prof = {};
for (const s of ['Left', 'Right']) { const H = posOf(BW[gU[s]]), K = posOf(BW[gL[s]]), A = posOf(BW[ji(s + 'Foot')]);
  for (const [part, a, b, jk] of [['thigh', H, K, gU[s]], ['shin', K, A, gL[s]]]) { const bins = Array.from({ length: NB }, () => []), ab = b.clone().sub(a);
    for (let i = 0; i < n; i++) { J.getElement(i, jj); W.getElement(i, ww); let w = 0; for (let q = 0; q < 4; q++) if (jj[q] === jk) w += ww[q]; if (w < 0.5) continue; const q2 = V3(RP[3 * i], RP[3 * i + 1], RP[3 * i + 2]);
      const t = q2.clone().sub(a).dot(ab) / ab.lengthSq(); if (t < 0 || t > 1) continue; bins[Math.min(NB - 1, Math.floor(t * NB))].push(q2.distanceTo(a.clone().addScaledVector(ab, t))); }
    /* the 98th percentile of each tenth of its length; a tenth with no leg in it (the thigh above the graft's top, under the
       robe, goes on to the hip) takes the thickest tenth measured */
    const r = bins.map(x => (x.length >= 5 ? pct(x, 0.98) : null)), big = Math.max(...r.filter(x => x !== null));
    prof[s + part] = r.map(x => (x === null ? big : x)); } }
const radAt = (pr, t) => { const u = Math.max(0, Math.min(NB - 1, t * NB - 0.5)), k = Math.floor(u), f = u - k; return k + 1 < NB ? pr[k] + (pr[k + 1] - pr[k]) * f : pr[k]; };
log(`robesim: the legs' thickness (98th percentile, hip/knee/ankle ends, thickest): ${Object.entries(prof).map(([k, r]) => `${k} ${r[0].toFixed(3)}..${r[NB - 1].toFixed(3)} (${Math.max(...r).toFixed(3)})`).join(', ')}; margin ${MARGIN}`);
/* at rest the tube stands clear of every real leg by the margin */
{ const segs = []; for (const s of ['Left', 'Right']) { const H = posOf(BW[gU[s]]), K = posOf(BW[gL[s]]), A = posOf(BW[ji(s + 'Foot')]); segs.push([H, K, prof[s + 'thigh']], [K, A, prof[s + 'shin']]); }
  let pushed = 0; for (let c = 0; c < NA; c++) for (let j = 0; j < NR; j++) { const th = 2 * Math.PI * c / NA, y = yRow(c, j); let r = R0[c][j], moved = false;
    for (let it = 0; it < 60; it++) { const p = V3(cx + r * Math.sin(th), y, cz + r * Math.cos(th)); let inside = false;
      for (const [a, b, pr] of segs) { const ab = b.clone().sub(a), t = Math.max(0, Math.min(1, p.clone().sub(a).dot(ab) / ab.lengthSq())); if (p.distanceTo(a.clone().addScaledVector(ab, t)) < radAt(pr, t) + MARGIN) inside = true; }
      if (!inside) break; r += 0.005; moved = true; }
    if (moved) { R0[c][j] = r; pushed++; } }
  log(`robesim: ${pushed} of the tube's ${NA * NR} points moved out to clear his legs at rest`); }
const NP = NA * NR, pid = (c, j) => j * NA + ((c % NA) + NA) % NA;
const X0 = new Float64Array(NP * 3); for (let c = 0; c < NA; c++) for (let j = 0; j < NR; j++) { const th = 2 * Math.PI * c / NA, o = 3 * pid(c, j); X0[o] = cx + R0[c][j] * Math.sin(th); X0[o + 1] = yRow(c, j); X0[o + 2] = cz + R0[c][j] * Math.cos(th); }
log(`robesim: ${nSk} of ${n} points ride the skirt's chains; the cloth ${NA} round x ${NR} down from ${ROOTY} m to the hem (${Math.min(...yHem).toFixed(3)}–${Math.max(...yHem).toFixed(3)} m), radius ${Math.min(...R0.flat()).toFixed(3)}–${Math.max(...R0.flat()).toFixed(3)} m`);
/* the robe's depth under each particle: his robe lies in layers (the wrap's two edges, the folds), every layer carried with
   the cloth at its own depth under it, so where a leg pushes the cloth out the deepest layer must clear the leg too — the
   90th percentile of how far the robe's points (on the skirt, not its underside) lie inside the cloth's surface in the
   particle's cell, up to DEPTHMAX; DEPTH=0, none */
const depth = new Float64Array(NA * NR);
if (DEPTH) { const cellPts = Array.from({ length: NA * NR }, () => []);
  for (let i = 0; i < n; i++) { if (share[i] < 0.5) continue; NRM.getElement(i, nv); if (nv[1] < -0.5) continue; const x = RP[3 * i], y = RP[3 * i + 1], z = RP[3 * i + 2], rx = x - cx, rz = z - cz, rl = Math.hypot(rx, rz) || 1;
    if ((nv[0] * rx + nv[2] * rz) / rl < -0.2) continue;
    const c = Math.round(thOf(x, z) / (2 * Math.PI) * NA) % NA, f = (ROOTY - y) / (ROOTY - yHem[c]) * (NR - 1), j = Math.round(f); if (j < 0 || j >= NR) continue;
    for (const dc of [-1, 0, 1]) for (const dj of [-1, 0, 1]) { const cc = (c + dc + NA) % NA, j2 = j + dj; if (j2 < 0 || j2 >= NR) continue; cellPts[j2 * NA + cc].push(R0[cc][j2] - rl); } }
  for (let c = 0; c < NA; c++) for (let j = 0; j < NR; j++) { const k = j * NA + c, q = pct(cellPts[k].map(x => Math.max(0, x)), 0.9); depth[k] = Math.min(DEPTHMAX, q ?? 0); }
  const ds = [...depth].sort((a, b) => a - b); log(`robesim: the robe's layers under the cloth: median ${(ds[ds.length >> 1] * 100).toFixed(1)} cm, 90th percentile ${(ds[Math.floor(ds.length * 0.9)] * 100).toFixed(1)} cm, ${ds.filter(x => x >= DEPTHMAX - 1e-9).length} cells at the ${(DEPTHMAX * 100).toFixed(0)} cm cap`); }

/* ------------------------------------------------------------------ each particle's target: skinned like the robe nearest it */
const cand = []; for (let i = 0; i < n; i++) if (OUTW[i]) cand.push(i);
const TWj = [], TWw = [];
for (let p = 0; p < NP; p++) { const o = 3 * p, best = [];
  for (const i of cand) { const dx = RP[3 * i] - X0[o], dy = RP[3 * i + 1] - X0[o + 1], dz = RP[3 * i + 2] - X0[o + 2], d = dx * dx + dy * dy + dz * dz;
    if (best.length < KNN || d < best[best.length - 1][0]) { let k = best.length; while (k > 0 && best[k - 1][0] > d) k--; best.splice(k, 0, [d, i]); if (best.length > KNN) best.pop(); } }
  const m = new Map(); let us = 0; for (const [d2, i] of best) { const u = 1 / (Math.sqrt(d2) + 0.01); us += u; J.getElement(i, jj); W.getElement(i, ww); for (let k = 0; k < 4; k++) if (ww[k] > 0) m.set(jj[k], (m.get(jj[k]) || 0) + u * ww[k]); }
  TWj.push(Int32Array.from(m.keys())); TWw.push(Float64Array.from([...m.values()].map(x => x / us))); }
const tjs = [...new Set(TWj.flatMap(x => [...x]))], SMe = new Map(), Tg = new Float64Array(NP * 3);
const targets = () => { for (const j of tjs) SMe.set(j, new Matrix4().multiplyMatrices(Wj(j), IB[j]).elements);
  for (let p = 0; p < NP; p++) { const o = 3 * p, x = X0[o], y = X0[o + 1], z = X0[o + 2], js = TWj[p], ws = TWw[p]; let tx = 0, ty = 0, tz = 0;
    for (let k = 0; k < js.length; k++) { const e = SMe.get(js[k]), w = ws[k]; tx += w * (e[0] * x + e[4] * y + e[8] * z + e[12]); ty += w * (e[1] * x + e[5] * y + e[9] * z + e[13]); tz += w * (e[2] * x + e[6] * y + e[10] * z + e[14]); }
    Tg[o] = tx; Tg[o + 1] = ty; Tg[o + 2] = tz; }
  if (legwrapping) legWrap(); };
/* the target as the cloth is pulled toward it: never inside a leg — a target inside one is moved to the leg's surface on
   the side the particle is on — and never across one: where the way from the particle to its target passes through a leg
   (the robe's shape has a knee on the other side of it), the particle is not pulled at all that step, so the pull never
   drags the cloth into a leg or through it to the other side */
/* v24.48 · the colliders made to fit the robe (each unset: as v24.47).
   HIPOPEN=1: a thigh (and a knee bent shut, hip to ankle) is OPEN at the hip — a capsule's round end at the hip joint,
     as thick as the top of the thigh plus the margin and the robe's layers (up to 17 cm), reached above the waistband: in
     the sword slash's lunge it held the cloth just under the waist 7 cm ABOVE the waist ring, folded back on itself (the
     shards at his hip); nothing beyond the hip joint is the thigh's (the pelvis there is his body's, under the waistband).
   RESTCAP=1: no leg pushes a particle further from it than the particle stands at rest — a leg's reach (its thickness,
     the margin and the robe's layers) is cut to the particle's own distance from it in his rest pose, so the robe as it
     hangs at rest is never pushed out by the legs standing where they stand at rest (talking, the robe stood 2-5 cm out
     from its own shape round his hips and knees: the sack); only a leg that comes nearer pushes.
   TOPTAPER=k: a thigh's reach thinned toward the hip joint over the top k of its length (to TOPMIN of it at the joint):
     its thickest tenth stood for the thigh's whole top, where under the waistband the thigh meets the pelvis, and a thigh
     swung forward or back swept that thickness through the cloth hanging from the waist (the lunge's back hip). */
const HIPOPEN = E('HIPOPEN', 0), RESTCAP = E('RESTCAP', 0), TOPTAPER = E('TOPTAPER', 0), TOPMIN = E('TOPMIN', 0.4);
const restD = RESTCAP ? new Float64Array(NP * 4) : null;
if (RESTCAP) { const segs = []; for (const s2 of ['Left', 'Right']) { const H = posOf(BW[gU[s2]]), K = posOf(BW[gL[s2]]), A2 = posOf(BW[ji(s2 + 'Foot')]); segs.push([H, K], [K, A2]); }
  for (let p = 0; p < NP; p++) { const q = V3(X0[3 * p], X0[3 * p + 1], X0[3 * p + 2]); segs.forEach(([A2, B2], k) => { const ab = B2.clone().sub(A2), t = Math.max(0, Math.min(1, q.clone().sub(A2).dot(ab) / ab.lengthSq())); restD[4 * p + k] = q.distanceTo(A2.clone().addScaledVector(ab, t)); }); } }
/* how far a leg (a collider with a thickness profile) reaches from its axis at t, for particle p */
const colR = (p, col, t) => { let r = radAt(col[2], t) + MARGIN + depth[p]; if (TOPTAPER && col.top && t < TOPTAPER) r *= TOPMIN + (1 - TOPMIN) * sstep(t / TOPTAPER); if (RESTCAP && col.seg !== undefined) r = Math.min(r, Math.max(restD[4 * p + col.seg], radAt(col[2], t) + MARGIN)); return r; };
const Tp = new Float64Array(NP * 3), clamp01 = x => (x < 0 ? 0 : x > 1 ? 1 : x);
const segSeg = (px, py, pz, qx, qy, qz, A, B) => {   // closest approach of the segment p-q to the segment A-B: [distance, the parameter on A-B]
  const d1x = qx - px, d1y = qy - py, d1z = qz - pz, d2x = B.x - A.x, d2y = B.y - A.y, d2z = B.z - A.z, rx = px - A.x, ry = py - A.y, rz = pz - A.z;
  const a = d1x * d1x + d1y * d1y + d1z * d1z, e = d2x * d2x + d2y * d2y + d2z * d2z, f = d2x * rx + d2y * ry + d2z * rz; let sP, tA;
  if (a <= 1e-12) { sP = 0; tA = clamp01(f / e); } else { const c = d1x * rx + d1y * ry + d1z * rz, b = d1x * d2x + d1y * d2y + d1z * d2z, den = a * e - b * b;
    sP = den > 1e-12 ? clamp01((b * f - c * e) / den) : 0; tA = (b * sP + f) / e; if (tA < 0) { tA = 0; sP = clamp01(-c / a); } else if (tA > 1) { tA = 1; sP = clamp01((b - c) / a); } }
  return [Math.hypot(px + d1x * sP - (A.x + d2x * tA), py + d1y * sP - (A.y + d2y * tA), pz + d1z * sP - (A.z + d2z * tA)), tA]; };
/* DRAPETAKES: takes where he sits on the floor with his legs folded in front of him (crossed, every leg bone near level):
   the robe lies OVER his legs as a cloth laid on them does — a particle inside the lower half of a near-level leg is
   lifted straight up out of it, never pushed under it (pushed out from the leg's axis, the half of the robe below the axis
   went under his legs and left them bare); in the upper half it is pushed out from the axis as anywhere, so the cloth
   wraps over a knee and hangs down its outside (lifted straight up there too, it stayed on top and left the knees bare at
   his sides). Its target likewise */
const DRAPETAKES = (process.env.DRAPETAKES || '').split(',').filter(Boolean); let draping = false;
/* LEGWRAPTAKES=<take,...> (v24.48): for these takes the robe's shape the cloth keeps is the robe CARRIED BY HIS REAL LEGS,
   as a skirt skinned to its wearer's legs is carried — each target near his waist riding the waist bone, and below it
   riding the real thigh and shin nearest it at rest (each side's share by its nearness, Gaussian over LEGWRAPSIG metres;
   the thigh's and the shin's shares crossing at his knee over LEGWRAPKNEE of the leg's length; the waist's share whole
   down to LEGWRAPHIP0 metres under the waist ring and none past LEGWRAPHIP1): his legs start inside the robe at rest, and
   so stay inside it, the robe between them spanning his lap. Sitting cross-legged on the floor his waist is below the
   tops of his knees: neither the chain skirt made on his real legs nor on his rig's (both fitted to his own file's robe
   there, which rides his hips) nor cloth hanging from the waist can cover them */
const LEGWRAPTAKES = (process.env.LEGWRAPTAKES || '').split(',').filter(Boolean), LEGWRAPSIG = E('LEGWRAPSIG', 0.08), LEGWRAPKNEE = E('LEGWRAPKNEE', 0.15), LEGWRAPHIP0 = E('LEGWRAPHIP0', 0.04), LEGWRAPHIP1 = E('LEGWRAPHIP1', 0.16); let legwrapping = false, wrapW = null;
const legWrap = () => { const bones = [jWaist, gU.Left, gL.Left, gU.Right, gL.Right];
  if (!wrapW) { wrapW = []; const seg = ['Left', 'Right'].map(s2 => [posOf(BW[gU[s2]]), posOf(BW[gL[s2]]), posOf(BW[ji(s2 + 'Foot')])]);
    for (let p = 0; p < NP; p++) { const q = V3(X0[3 * p], X0[3 * p + 1], X0[3 * p + 2]), wW = 1 - sstep((ROOTY - q.y - LEGWRAPHIP0) / (LEGWRAPHIP1 - LEGWRAPHIP0)), w = [wW, 0, 0, 0, 0];
      const near = seg.map(([H, K, A]) => Math.min(segDist(q, H, K), segDist(q, K, A))), g = near.map(d => Math.exp(-((d / LEGWRAPSIG) ** 2)) + 1e-9), gs = g[0] + g[1];
      seg.forEach(([H, K, A], si) => { const L1 = H.distanceTo(K), L2 = K.distanceTo(A), hk = K.clone().sub(H), t = q.clone().sub(H).dot(hk) / hk.lengthSq() * L1, kf = sstep((t - L1 + LEGWRAPKNEE * (L1 + L2) / 2) / (LEGWRAPKNEE * (L1 + L2))), share = (1 - wW) * g[si] / gs;
        w[1 + 2 * si] = share * (1 - kf); w[2 + 2 * si] = share * kf; });
      wrapW.push(w); } }
  const M = bones.map(j => new Matrix4().multiplyMatrices(Wj(j), IB[j]).elements);
  for (let p = 0; p < NP; p++) { if (pinned[p]) continue; const o = 3 * p, x = X0[o], y = X0[o + 1], z = X0[o + 2], w = wrapW[p]; let tx = 0, ty = 0, tz = 0;
    for (let b = 0; b < 5; b++) { const a = w[b]; if (!a) continue; const e = M[b]; tx += a * (e[0] * x + e[4] * y + e[8] * z + e[12]); ty += a * (e[1] * x + e[5] * y + e[9] * z + e[13]); tz += a * (e[2] * x + e[6] * y + e[10] * z + e[14]); }
    Tg[o] = tx; Tg[o + 1] = ty; Tg[o + 2] = tz; } };
const segDist = (q, A, B) => { const ab = B.clone().sub(A), t = Math.max(0, Math.min(1, q.clone().sub(A).dot(ab) / ab.lengthSq())); return q.distanceTo(A.clone().addScaledVector(ab, t)); };
const level = (A, B) => Math.abs(B.y - A.y) < 0.7 * Math.hypot(B.x - A.x, B.y - A.y, B.z - A.z);
const capR = (x, y, z, A, B, pr, extra) => { const abx = B.x - A.x, aby = B.y - A.y, abz = B.z - A.z, L2 = abx * abx + aby * aby + abz * abz, t = clamp01(((x - A.x) * abx + (y - A.y) * aby + (z - A.z) * abz) / L2);
  return Math.hypot(x - A.x - abx * t, y - A.y - aby * t, z - A.z - abz * t) - (radAt(pr, t) + extra); };   // < 0 inside
const liftY = (x, y, z, A, B, pr, extra) => { if (capR(x, y, z, A, B, pr, extra) >= 0) return y; let lo = 0, hi = A.distanceTo(B) + 2 * (radAt(pr, 0) + radAt(pr, 1) + extra) + 0.05;
  for (let it = 0; it < 22; it++) { const m = 0.5 * (lo + hi); if (capR(x, y + m, z, A, B, pr, extra) < 0) lo = m; else hi = m; } return y + hi; };
/* and in those takes the robe's own shape is first LAID OVER his legs, as a cloth laid on them: each target in front of his
   hips that a level leg holds inside it lifted straight up out of it, and the lift spread to the targets round it
   (LIFTSPREAD passes, never less than its own), so the robe rises over his lap and knees smoothly instead of being pushed
   aside and crumpling */
const LIFTSPREAD = E('LIFTSPREAD', 6), DRAPEUNDER = E('DRAPEUNDER', 0), DRAPEKIN = E('DRAPEKIN', 0), DRAPEFREE = E('DRAPEFREE', 0);   // DRAPEFREE=k: below row k the draped robe is free cloth (no pull, no motion distance)
const liftTargets = C => { const d0 = new Float64Array(NP), hp = posOf(Wj(ji('Hips'))), fw = ['Left', 'Right'].reduce((a, s2) => a.add(posOf(Wj(gL[s2])).sub(posOf(Wj(gU[s2])))), V3(0, 0, 0)).setY(0).normalize();
  for (let p = 0; p < NP; p++) { if (pinned[p]) continue; const o = 3 * p; if ((Tg[o] - hp.x) * fw.x + (Tg[o + 2] - hp.z) * fw.z < 0.05) continue; let y = Tg[o + 1];
    for (const [A, B, pr] of C) { if (!pr || !level(A, B)) continue; const r = MARGIN + depth[p];
      /* DRAPEUNDER: a target UNDER a level leg (within its width seen from above) counts as held by it too */
      if (DRAPEUNDER) { const abx = B.x - A.x, abz = B.z - A.z, L2 = abx * abx + abz * abz, t = clamp01(L2 > 1e-12 ? ((Tg[o] - A.x) * abx + (Tg[o + 2] - A.z) * abz) / L2 : 0), qx = A.x + abx * t, qz = A.z + abz * t, qy = A.y + (B.y - A.y) * t;
        const rr = radAt(pr, t) + r, h = Math.hypot(Tg[o] - qx, Tg[o + 2] - qz); if (h < rr && Tg[o + 1] < qy) { y = Math.max(y, qy + Math.sqrt(Math.max(0, rr * rr - h * h))); continue; } }
      y = Math.max(y, liftY(Tg[o], Tg[o + 1], Tg[o + 2], A, B, pr, r)); }
    d0[p] = y - Tg[o + 1]; }
  let d = d0; for (let pass = 0; pass < LIFTSPREAD; pass++) { const nd = new Float64Array(NP);
    for (let c = 0; c < NA; c++) for (let j = 0; j < NR; j++) { const p = pid(c, j); if (pinned[p]) continue; nd[p] = Math.max(d0[p], 0.25 * (d[pid(c - 1, j)] + d[pid(c + 1, j)] + d[pid(c, Math.max(0, j - 1))] + d[pid(c, Math.min(NR - 1, j + 1))])); }
    d = nd; }
  for (let p = 0; p < NP; p++) Tg[3 * p + 1] += d[p]; };
const projectTargets = C => { Tp.set(Tg);
  for (let p = 0; p < NP; p++) { if (pinned[p]) continue; const o = 3 * p;
    for (const col of C) { const [A, B, pr] = col; if (!pr) continue; const abx = B.x - A.x, aby = B.y - A.y, abz = B.z - A.z, L2 = abx * abx + aby * aby + abz * abz;
      let t = ((Tp[o] - A.x) * abx + (Tp[o + 1] - A.y) * aby + (Tp[o + 2] - A.z) * abz) / L2; if (col.openA && t < 0) continue; t = Math.max(0, Math.min(1, t));
      const qx = A.x + abx * t, qy = A.y + aby * t, qz = A.z + abz * t, r = colR(p, col, t);
      if (Math.hypot(Tp[o] - qx, Tp[o + 1] - qy, Tp[o + 2] - qz) >= r) continue;
      if (draping && level(A, B) && Tp[o + 1] < qy) { Tp[o + 1] = liftY(Tp[o], Tp[o + 1], Tp[o + 2], A, B, pr, MARGIN + depth[p]); continue; }
      let ux = X[o] - qx, uy = X[o + 1] - qy, uz = X[o + 2] - qz; const along = (ux * abx + uy * aby + uz * abz) / L2; ux -= abx * along; uy -= aby * along; uz -= abz * along;
      const ul = Math.hypot(ux, uy, uz); if (ul < 1e-9) continue; Tp[o] = qx + ux / ul * r; Tp[o + 1] = qy + uy / ul * r; Tp[o + 2] = qz + uz / ul * r; }
    for (const col of C) { const [A, B, pr] = col; if (!pr) continue; const [d, t] = segSeg(X[o], X[o + 1], X[o + 2], Tp[o], Tp[o + 1], Tp[o + 2], A, B);
      if (col.openA && t <= 0) continue;
      if (d < colR(p, col, t) - 1e-4) { Tp[o] = X[o]; Tp[o + 1] = X[o + 1]; Tp[o + 2] = X[o + 2]; break; } } } };
log(`robesim: each particle skinned like the ${KNN} robe points nearest it (${cand.length} on the robe's outside; ${tjs.length} bones in all)`);

/* the constraints: round the ring and down the column (stretch), the diagonals (shear), skip-one both ways (bend) */
const CON = []; const addC = (a, b, k) => CON.push([a, b, k]);
for (let c = 0; c < NA; c++) for (let j = 0; j < NR; j++) { addC(pid(c, j), pid(c + 1, j), KST); if (j + 1 < NR) { addC(pid(c, j), pid(c, j + 1), KST); addC(pid(c, j), pid(c + 1, j + 1), KSH); addC(pid(c + 1, j), pid(c, j + 1), KSH); }
  addC(pid(c, j), pid(c + 2, j), KBE); if (j + 2 < NR) addC(pid(c, j), pid(c, j + 2), KBE); }
const NC = CON.length, CA = new Int32Array(CON.map(x => x[0])), CBb = new Int32Array(CON.map(x => x[1])), CD = new Float64Array(NC), CK = new Float64Array(CON.map(x => x[2]));
const pinned = new Uint8Array(NP); for (let c = 0; c < NA; c++) pinned[pid(c, 0)] = 1;
const maxD = new Float64Array(NP), setMaxD = m => { for (let c = 0; c < NA; c++) for (let j = 0; j < NR; j++) maxD[pid(c, j)] = m * Math.pow(j / (NR - 1), MAXP); };
setMaxD(MAXD);

const toeOf = s => ['ToeBase', 'Toe_End'].map(x => s + x).filter(x => names.includes(x)).map(ji);
/* each real leg's thickness in THIS pose: his legs' own points (every other one, riding the new thigh and shin bones by
   half or more) skinned where the pose puts them, each measured from the nearer of its side's thigh and shin and kept as
   the most in its tenth of that bone — so a bent knee's bulge, wider than the leg standing, is in the collider; a tenth
   with no point in it keeps the rest pose's measure */
const legPts = []; { const LJ = new Set([gU.Left, gL.Left, gU.Right, gL.Right]);
  for (let i = 0; i < n; i += 2) { J.getElement(i, jj); W.getElement(i, ww); let w = 0, lw = 0; for (let k = 0; k < 4; k++) if (LJ.has(jj[k])) { w += ww[k]; if (jj[k] === gU.Left || jj[k] === gL.Left) lw += ww[k]; }
    if (w < 0.5) continue; legPts.push({ i, side: lw >= w / 2 ? 'Left' : 'Right', js: jj.slice(), ws: ww.slice() }); } }
const legJs = [...new Set(legPts.flatMap(q => q.js.filter((_, k) => q.ws[k] > 0)))];
const legProf = () => { const SMl = new Map(); for (const j of legJs) SMl.set(j, new Matrix4().multiplyMatrices(Wj(j), IB[j]).elements);
  const segs = {}; for (const s of ['Left', 'Right']) { const h = posOf(Wj(gU[s])), k = posOf(Wj(gL[s])), a = posOf(Wj(ji(s + 'Foot'))); segs[s] = [['thigh', h, k], ['shin', k, a]]; }
  const out = {}; for (const key of Object.keys(prof)) out[key] = new Array(NB).fill(0);
  for (const q of legPts) { const x = RP[3 * q.i], y = RP[3 * q.i + 1], z = RP[3 * q.i + 2]; let px = 0, py = 0, pz = 0;
    for (let k = 0; k < 4; k++) { const w = q.ws[k]; if (!w) continue; const e = SMl.get(q.js[k]); px += w * (e[0] * x + e[4] * y + e[8] * z + e[12]); py += w * (e[1] * x + e[5] * y + e[9] * z + e[13]); pz += w * (e[2] * x + e[6] * y + e[10] * z + e[14]); }
    let best = null; for (const [part, A, B] of segs[q.side]) { const abx = B.x - A.x, aby = B.y - A.y, abz = B.z - A.z, L2 = abx * abx + aby * aby + abz * abz;
      const t = clamp01(((px - A.x) * abx + (py - A.y) * aby + (pz - A.z) * abz) / L2), d = Math.hypot(px - A.x - abx * t, py - A.y - aby * t, pz - A.z - abz * t); if (!best || d < best[0]) best = [d, part, t]; }
    const key = q.side + best[1], bin = Math.min(NB - 1, Math.floor(best[2] * NB)); if (best[0] > out[key][bin]) out[key][bin] = best[0]; }
  for (const key of Object.keys(out)) for (let b = 0; b < NB; b++) if (!out[key][b]) out[key][b] = prof[key][b];
  return out; };
log(`robesim: his legs measured in every pose from ${legPts.length} of their points`);
/* each collider: [A, B, profile | null, r at A, r at B] (a profile adds MARGIN) */
const colliders = () => { const C = [], pf = legProf();
  for (const s of ['Left', 'Right']) { const h = posOf(Wj(gU[s])), k = posOf(Wj(gL[s])), a = posOf(Wj(ji(s + 'Foot'))), t = toeOf(s).map(x => posOf(Wj(x)));
    { const th = [h, k, pf[s + 'thigh'], 0, 0], sh = [k, a, pf[s + 'shin'], 0, 0], si = s === 'Left' ? 0 : 2; th.seg = si; sh.seg = si + 1; if (HIPOPEN) th.openA = 1; if (TOPTAPER) th.top = 1; C.push(th, sh); }
    /* a knee bent shut (the thigh and the calf less than KNEEFOLD degrees apart: a running heel kicked up behind him, his
       legs folded under him on the floor) is one body: a capsule from the hip to the ankle as thick as the thinner of the
       two fills the fold, so cloth caught between thigh and calf is pushed out of it instead of back and forth between them */
    { const u = h.clone().sub(k).normalize(), w = a.clone().sub(k).normalize(); if (Math.acos(Math.max(-1, Math.min(1, u.dot(w)))) * 180 / Math.PI < KNEEFOLD) {
      const R = Math.min(Math.max(...pf[s + 'thigh']), Math.max(...pf[s + 'shin'])), kf = [h, a, new Array(NB).fill(R), 0, 0]; if (HIPOPEN) kf.openA = 1; C.push(kf); } }
    if (t.length) { const toe = t[t.length - 1], back = a.clone().sub(toe).setY(0).normalize(); C.push([a, toe, null, 0.04 + MARGIN, 0.03 + MARGIN]); const heel = a.clone().addScaledVector(back, 0.05); heel.y = Math.max(0.03, heel.y - 0.06); C.push([heel, heel, null, 0.04 + MARGIN, 0.04 + MARGIN]); } }
  return C; };

/* ------------------------------------------------------------------ the cloth bones: on the particles, children of the waist bone */
const bc = Array.from({ length: BA }, (_, b) => Math.round(b * NA / BA)), br = Array.from({ length: BR }, (_, b) => Math.round(b * (NR - 1) / (BR - 1)));
const at = (X, c, j) => { const o = 3 * pid(c, Math.max(0, Math.min(NR - 1, j))); return V3(X[o], X[o + 1], X[o + 2]); };
const frameAt = (X, c, j) => { const p = at(X, c, j), tx = at(X, c + 1, j).sub(at(X, c - 1, j)).normalize(), ty = at(X, c, j - 1).sub(at(X, c, j + 1)).normalize();   // round the ring (his left), up the column
  const z = new Vector3().crossVectors(tx, ty).normalize(), y = new Vector3().crossVectors(z, tx).normalize();
  return new Matrix4().makeBasis(tx, y, z).setPosition(p); };
pose(null, 0); const waistRest = Wj(jWaist).clone(), waistBind = BW[jWaist];
{ const d = posOf(waistRest).distanceTo(posOf(waistBind)); if (d > 1e-4) throw new Error(`robesim: the waist bone at rest is ${d} m from its bind`);
  const sc = new Vector3().setFromMatrixScale(waistRest); if (Math.abs(sc.x - 1) + Math.abs(sc.y - 1) + Math.abs(sc.z - 1) > 1e-4) throw new Error(`robesim: the waist bone's world scale is ${sc.toArray()}, not 1`); }
const CB = []; const ibm = Array.from(skin.getInverseBindMatrices().getArray());
for (let b = 0; b < BA; b++) for (let r = 0; r < BR; r++) { const Bm = frameAt(X0, bc[b], br[r]), node = doc.createNode(`Cloth_${String(b).padStart(2, '0')}_${String(r).padStart(2, '0')}`);
  const loc = waistRest.clone().invert().multiply(Bm), t = new Vector3(), q = new Quaternion(), s = new Vector3(); loc.decompose(t, q, s); node.setTranslation(t.toArray()).setRotation(q.toArray());
  waistNode.addChild(node); const jx = skin.listJoints().length; skin.addJoint(node); ibm.push(...Bm.clone().invert().elements); CB.push({ b, r, node, jx, t, q }); }
skin.getInverseBindMatrices().setArray(new Float32Array(ibm));
const cbIdx = (b, r) => CB[((b % BA) + BA) % BA * BR + r].jx;
log(`robesim: ${CB.length} cloth bones (${BA} round x ${BR} down), children of the waist bone, joints ${CB[0].jx}–${CB[CB.length - 1].jx}`);

/* ------------------------------------------------------------------ the skirt points re-skinned to the cloth bones */
const rowParam = (b, y) => { const c = bc[b], ys = br.map(j => yRow(c, j)); if (y >= ys[0]) return [0, 0]; if (y <= ys[BR - 1]) return [BR - 2, 1];
  for (let r = 0; r + 1 < BR; r++) if (y <= ys[r] && y >= ys[r + 1]) return [r, (ys[r] - y) / (ys[r] - ys[r + 1])]; return [BR - 2, 1]; };
const Jn = new Uint16Array(n * 4), Wn = new Float32Array(n * 4); let moved = 0;
for (let i = 0; i < n; i++) { J.getElement(i, jj); W.getElement(i, ww);
  if (share[i] <= 0) { for (let k = 0; k < 4; k++) { Jn[4 * i + k] = jj[k]; Wn[4 * i + k] = ww[k]; } continue; }
  const m = new Map(); for (let k = 0; k < 4; k++) if (ww[k] > 0 && !isChain[jj[k]]) m.set(jj[k], (m.get(jj[k]) || 0) + ww[k]);
  const a = thOf(RP[3 * i], RP[3 * i + 2]) / (2 * Math.PI) * BA, b0 = Math.floor(a), fu = a - b0;
  for (const [b, wb] of [[b0, 1 - fu], [b0 + 1, fu]]) { const bb = ((b % BA) + BA) % BA, [r0, fv] = rowParam(bb, RP[3 * i + 1]);
    for (const [r, wr] of [[r0, 1 - fv], [r0 + 1, fv]]) { const w = share[i] * wb * wr; if (w > 0) m.set(cbIdx(bb, r), (m.get(cbIdx(bb, r)) || 0) + w); } }
  const top = [...m].sort((x, y) => y[1] - x[1]).slice(0, 4), sum = top.reduce((x, y) => x + y[1], 0) || 1;
  for (let k = 0; k < 4; k++) { Jn[4 * i + k] = top[k] ? top[k][0] : 0; Wn[4 * i + k] = top[k] ? top[k][1] / sum : 0; } moved++; }
J.setArray(Jn).setNormalized(false); W.setArray(Wn).setNormalized(false);
log(`robesim: ${moved} skirt points re-skinned to the cloth (their share on the chains spread over the four bones round them)`);

/* ------------------------------------------------------------------ the simulation */
const X = new Float64Array(NP * 3), Xp = new Float64Array(NP * 3);
const step = C => {
  const g = GRAV * DT * DT; if (draping) liftTargets(C);
  if (draping && DRAPEKIN) { X.set(Tg); Xp.set(Tg); return; }   // DRAPEKIN: the laid robe as it is, no cloth moving
  projectTargets(C);
  for (let p = 0; p < NP; p++) { const o = 3 * p;
    if (pinned[p]) { X[o] = Xp[o] = Tg[o]; X[o + 1] = Xp[o + 1] = Tg[o + 1]; X[o + 2] = Xp[o + 2] = Tg[o + 2]; continue; }
    const vx = (X[o] - Xp[o]) * DAMP, vy = (X[o + 1] - Xp[o + 1]) * DAMP, vz = (X[o + 2] - Xp[o + 2]) * DAMP;
    Xp[o] = X[o]; Xp[o + 1] = X[o + 1]; Xp[o + 2] = X[o + 2]; X[o] += vx; X[o + 1] += vy - g; X[o + 2] += vz;
    if (!(draping && DRAPEFREE && Math.floor(p / NA) > DRAPEFREE)) { X[o] += (Tp[o] - X[o]) * KTARGET; X[o + 1] += (Tp[o + 1] - X[o + 1]) * KTARGET; X[o + 2] += (Tp[o + 2] - X[o + 2]) * KTARGET; } }
  for (let ci = 0; ci < NC; ci++) { const a = 3 * CA[ci], b = 3 * CBb[ci]; CD[ci] = Math.hypot(Tg[b] - Tg[a], Tg[b + 1] - Tg[a + 1], Tg[b + 2] - Tg[a + 2]); }   // the target's own lengths
  for (let it = 0; it < ITER; it++) {
    for (let ci = 0; ci < NC; ci++) { const a = CA[ci], b = CBb[ci], oa = 3 * a, ob = 3 * b, dx = X[ob] - X[oa], dy = X[ob + 1] - X[oa + 1], dz = X[ob + 2] - X[oa + 2], d = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1e-9;
      const wa = pinned[a] ? 0 : 1, wb2 = pinned[b] ? 0 : 1, ws = wa + wb2; if (!ws) continue; const f = (d > CD[ci] ? CK[ci] : CK[ci] * KCOMP) * (d - CD[ci]) / d / ws;
      X[oa] += dx * f * wa; X[oa + 1] += dy * f * wa; X[oa + 2] += dz * f * wa; X[ob] -= dx * f * wb2; X[ob + 1] -= dy * f * wb2; X[ob + 2] -= dz * f * wb2; }
    for (let p = 0; p < NP; p++) { if (pinned[p]) continue; const o = 3 * p;
      { const dx = X[o] - Tp[o], dy = X[o + 1] - Tp[o + 1], dz = X[o + 2] - Tp[o + 2], L = Math.sqrt(dx * dx + dy * dy + dz * dz);   // the motion distance
        if (L > maxD[p] && !(draping && DRAPEFREE && Math.floor(p / NA) > DRAPEFREE)) { const s = maxD[p] / L; X[o] = Tp[o] + dx * s; X[o + 1] = Tp[o + 1] + dy * s; X[o + 2] = Tp[o + 2] + dz * s; } }
      for (const col of C) { const [A, B, pr, ra, rb] = col; const abx = B.x - A.x, aby = B.y - A.y, abz = B.z - A.z, L2 = abx * abx + aby * aby + abz * abz;
        let t = L2 > 1e-12 ? ((X[o] - A.x) * abx + (X[o + 1] - A.y) * aby + (X[o + 2] - A.z) * abz) / L2 : 0; if (col.openA && t < 0) continue; t = Math.max(0, Math.min(1, t));
        const qx = A.x + abx * t, qy = A.y + aby * t, qz = A.z + abz * t, dx = X[o] - qx, dy = X[o + 1] - qy, dz = X[o + 2] - qz, d = Math.sqrt(dx * dx + dy * dy + dz * dz), r = pr ? colR(p, col, t) : ra + (rb - ra) * t;
        if (d < r && d > 1e-9) { if (draping && pr && level(A, B) && dy < 0) { X[o + 1] = liftY(X[o], X[o + 1], X[o + 2], A, B, pr, MARGIN + depth[p]); continue; }
          const s = r / d; X[o] = qx + dx * s; X[o + 1] = qy + dy * s; X[o + 2] = qz + dz * s; } }
      if (X[o + 1] < 0.005) X[o + 1] = 0.005; } } };
/* the bake: each bone on its particle, turned to the cloth there, in the waist bone's frame */
/* LSFIT=1: each bone's PLACE fitted to the whole cloth, not to its own particle alone — the robe between two bones is the
   blend of the two, so a knee pushing the cloth out between them (the bones stand 8–10 cm apart, a knee is 12 cm across)
   was cut short by the blend and showed through it running. Every particle is skinned as the robe's points are (bilinear
   over the four bones round it, each bone turned as the cloth is at its own particle), and the bones' places are the
   least-squares fit of those skinned particles to where the cloth is, held near their own particles by LSREG; at rest
   the fit is the rest exactly */
const LSFIT = E('LSFIT', 1), LSREG = E('LSREG', 0.05), NBn = CB.length;
const PW = []; for (let c = 0; c < NA; c++) for (let j = 0; j < NR; j++) { const p = pid(c, j), a = c / (NA / BA), b0 = Math.floor(a), fu = a - b0, wl = new Map();
  for (const [b, wb] of [[b0, 1 - fu], [b0 + 1, fu]]) { const bb = ((b % BA) + BA) % BA, [r0, fv] = rowParam(bb, yRow(c, j));
    for (const [r, wr] of [[r0, 1 - fv], [r0 + 1, fv]]) { const w = wb * wr; if (w > 0) { const k = bb * BR + r; wl.set(k, (wl.get(k) || 0) + w); } } }
  PW[p] = [...wl]; }
let LSM = null; if (LSFIT) { const A = Array.from({ length: NBn }, () => new Float64Array(NBn));
  for (let p = 0; p < NP; p++) for (const [a, wa] of PW[p]) for (const [b, wb] of PW[p]) A[a][b] += wa * wb;
  for (let k = 0; k < NBn; k++) A[k][k] += LSREG;
  /* its inverse, once (Gauss-Jordan; the matrix is symmetric and positive definite) */
  const M = A.map((row, i) => { const r = new Float64Array(2 * NBn); r.set(row); r[NBn + i] = 1; return r; });
  for (let i = 0; i < NBn; i++) { let piv = i; for (let k = i + 1; k < NBn; k++) if (Math.abs(M[k][i]) > Math.abs(M[piv][i])) piv = k; [M[i], M[piv]] = [M[piv], M[i]];
    const d = M[i][i]; for (let k = 0; k < 2 * NBn; k++) M[i][k] /= d;
    for (let r = 0; r < NBn; r++) if (r !== i && M[r][i]) { const f = M[r][i]; for (let k = 0; k < 2 * NBn; k++) M[r][k] -= f * M[i][k]; } }
  LSM = M.map(r => r.slice(NBn)); }
const restM = CB.map(cbn => frameAt(X0, bc[cbn.b], br[cbn.r])), restQ = restM.map(m => new Quaternion().setFromRotationMatrix(m)), restP = restM.map(posOf);
/* each bone's TURN is the cloth's where the cloth lies smooth, and the robe's own (its target's) where the cloth folds over
   itself: a crumpled grid of particles gives a frame turned any way at all, and the robe round that bone was thrown with it
   into shards (running, a knee lifting the robe; sitting cross-legged). Within FRAMEOK degrees of the robe's own frame the
   cloth's is kept, past FRAMEBAD the robe's, between them a blend; a frame whose ring and column cross at under 20° is
   folded and takes the robe's */
const FRAMEOK = E('FRAMEOK', 30) * Math.PI / 180, FRAMEBAD = E('FRAMEBAD', 60) * Math.PI / 180;
const clothFrame = cbn => { const c = bc[cbn.b], j = br[cbn.r], ft = frameAt(Tg, c, j), fx = frameAt(X, c, j), qt = new Quaternion().setFromRotationMatrix(ft), qx = new Quaternion().setFromRotationMatrix(fx);
  const tx = at(X, c + 1, j).sub(at(X, c - 1, j)), ty = at(X, c, j - 1).sub(at(X, c, j + 1)), cross = tx.clone().normalize().cross(ty.clone().normalize()).length();
  const ang = 2 * Math.acos(Math.min(1, Math.abs(qt.dot(qx)))), w = cross < Math.sin(20 * Math.PI / 180) ? 0 : 1 - sstep((ang - FRAMEOK) / (FRAMEBAD - FRAMEOK));
  return new Matrix4().makeRotationFromQuaternion(qt.slerp(qx, w)).setPosition(posOf(fx)); };
/* TURNFIT=1 (v24.48): each bone's turn FITTED to the cloth round it — the best rotation of the whole patch of particles it
   carries (its bilinear share of each, some 7 x 7 particles) from rest to now (shape matching: the rotation part of the
   patch's covariance, found by Mueller's iteration started from the bone's turn at the frame before), and its place the
   patch's centre carried by that turn. Read from the two pairs of particles next to it (the frames above), a bone's turn
   followed every crumple at the particles' own 2-3 cm scale: at the sword slash's lunge neighbouring bones stood up to
   172 degrees apart, and talking 20-56, and every robe point between two bones turned apart was thrown apart (the shards
   and tears). TURNSMOOTH=n: n passes averaging each bone's turn with its four neighbours' (half its own) */
const TURNFIT = E('TURNFIT', 0), TURNSMOOTH = E('TURNSMOOTH', 0), TURNITER = E('TURNITER', 30);
const patchOf = Array.from({ length: CB.length }, () => []); for (let p = 0; p < NP; p++) for (const [b, w] of PW[p]) patchOf[b].push([p, w]);
const patchC0 = patchOf.map(L => { let x = 0, y = 0, z = 0, s = 0; for (const [p, w] of L) { x += w * X0[3 * p]; y += w * X0[3 * p + 1]; z += w * X0[3 * p + 2]; s += w; } return V3(x / s, y / s, z / s); });
const turnPrev = CB.map(() => new Quaternion()); let turnFresh = true;   // a take's first frame is fitted from no turn at all: ten times the iterations
const extractRot = (A, q) => { const m = new Matrix4(), om = new Vector3(), dq = new Quaternion();   // A row-major 3x3; q in/out
  for (let it = 0, nIt = turnFresh ? 10 * TURNITER : TURNITER; it < nIt; it++) { m.makeRotationFromQuaternion(q); const e = m.elements; let ox = 0, oy = 0, oz = 0, dot = 0;
    for (let c = 0; c < 3; c++) { const rx = e[4 * c], ry = e[4 * c + 1], rz = e[4 * c + 2], ax = A[c], ay = A[3 + c], az = A[6 + c];
      ox += ry * az - rz * ay; oy += rz * ax - rx * az; oz += rx * ay - ry * ax; dot += rx * ax + ry * ay + rz * az; }
    om.set(ox, oy, oz).multiplyScalar(1 / (Math.abs(dot) + 1e-12)); const w = om.length(); if (w < 1e-9) break;
    dq.setFromAxisAngle(om.divideScalar(w), w); q.premultiply(dq).normalize(); }
  return q; };
const turnFrames = () => { const qs = CB.map((cbn, k) => { const L = patchOf[k], c0 = patchC0[k]; let cx2 = 0, cy2 = 0, cz2 = 0, s = 0;
    for (const [p, w] of L) { cx2 += w * X[3 * p]; cy2 += w * X[3 * p + 1]; cz2 += w * X[3 * p + 2]; s += w; } cx2 /= s; cy2 /= s; cz2 /= s;
    const A = new Float64Array(9); for (const [p, w] of L) { const bx = X[3 * p] - cx2, by = X[3 * p + 1] - cy2, bz = X[3 * p + 2] - cz2, ax = X0[3 * p] - c0.x, ay = X0[3 * p + 1] - c0.y, az = X0[3 * p + 2] - c0.z;
      A[0] += w * bx * ax; A[1] += w * bx * ay; A[2] += w * bx * az; A[3] += w * by * ax; A[4] += w * by * ay; A[5] += w * by * az; A[6] += w * bz * ax; A[7] += w * bz * ay; A[8] += w * bz * az; }
    turnPrev[k] = extractRot(A, turnPrev[k].clone()); return { q: turnPrev[k].clone(), c: V3(cx2, cy2, cz2) }; }); turnFresh = false;
  for (let pass = 0; pass < TURNSMOOTH; pass++) { const old = qs.map(x => x.q.clone());
    CB.forEach((cbn, k) => { const acc = [0, 0, 0, 0], add = (q, w) => { const s = q.dot(old[k]) < 0 ? -w : w; acc[0] += s * q.x; acc[1] += s * q.y; acc[2] += s * q.z; acc[3] += s * q.w; };
      let self = 0.5; for (const [db, dr] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const r2 = cbn.r + dr; if (r2 < 0 || r2 >= BR) { self += 0.125; continue; } add(old[((cbn.b + db + BA) % BA) * BR + r2], 0.125); }
      add(old[k], self); qs[k].q.set(acc[0], acc[1], acc[2], acc[3]).normalize(); }); }
  return CB.map((cbn, k) => { const { q, c } = qs[k]; return new Matrix4().makeRotationFromQuaternion(q.clone().multiply(restQ[k])).setPosition(c.clone().add(restP[k].clone().sub(patchC0[k]).applyQuaternion(q))); }); };
/* SKINPUSH=m (v24.48): the robe's own points made to clear his legs' own surface by m metres, at every frame baked. The
   cloth's particles clear the legs as capsules (a thickness profile round each bone), but the robe rides the cloth in
   layers 3-5 cm deep (pleats, the wrap's under-panel, the hem's turned rim), and a capsule is not his leg: held out by
   the layers' depth everywhere, the robe stood off his legs in a sack; held out by less, a thigh came through its back.
   So after the cloth bones are placed, the robe is skinned as the game will skin it (every SKINSTRIDE-th of its points
   on the cloth) against his legs' own points (every 8th, with their normals), and wherever a robe point lies within m
   of the leg's surface or inside it, the cloth bones it rides are moved out along the leg's normal by what it lacks
   (each bone by the mean its offending points need), SKINITER times: the robe is moved only where a leg truly meets it,
   by as much as it truly must. SKINREACH: how far from the leg a robe point is looked for (metres). */
const SKINPUSH = E('SKINPUSH', 0), SKINSTRIDE = E('SKINSTRIDE', 3), SKINITER = E('SKINITER', 3), SKINREACH = E('SKINREACH', 0.045), SKINLEG = E('SKINLEG', 8);
const J0 = CB[0].jx, restInv = restM.map(m => m.clone().invert());
let skinOn = false;   // the rest bake is not pushed (the rest is the rest)
let skinS = null, skinL = null, skinStats = { frames: 0, moved: 0, worst: 0 };
if (SKINPUSH) { skinS = []; for (let i = 0; i < n; i += SKINSTRIDE) { if (share[i] <= 0.5) continue; const js = [], ws = []; for (let k = 0; k < 4; k++) { const w = Wn[4 * i + k]; if (w > 0) { js.push(Jn[4 * i + k]); ws.push(w); } } skinS.push({ i, js, ws }); }
  skinL = legPts.filter((_, a) => a % (SKINLEG / 2) === 0).map(q => { NRM.getElement(q.i, nv); return { ...q, nrm: nv.slice() }; });
  log(`robesim: SKINPUSH ${SKINPUSH} m: ${skinS.length} robe points against ${skinL.length} of his legs' points, ${SKINITER} passes`); }
const skinPush = frames => { const M = new Map(), mat = j => { let e = M.get(j); if (e) return e; e = (j >= J0 ? new Matrix4().multiplyMatrices(frames[j - J0], restInv[j - J0]) : new Matrix4().multiplyMatrices(Wj(j), IB[j])).elements; M.set(j, e); return e; };
  const NL = skinL.length, LP = new Float64Array(3 * NL), LN = new Float64Array(3 * NL), grid = new Map(), C2 = SKINREACH, key = (x, y, z) => (x + 512) + 1024 * ((y + 512) + 1024 * (z + 512));
  skinL.forEach((q, a) => { const x = RP[3 * q.i], y = RP[3 * q.i + 1], z = RP[3 * q.i + 2], [n0, n1, n2] = q.nrm; let px = 0, py = 0, pz = 0, nx = 0, ny = 0, nz = 0;
    for (let k = 0; k < 4; k++) { const w = q.ws[k]; if (!w) continue; const e = mat(q.js[k]); px += w * (e[0] * x + e[4] * y + e[8] * z + e[12]); py += w * (e[1] * x + e[5] * y + e[9] * z + e[13]); pz += w * (e[2] * x + e[6] * y + e[10] * z + e[14]); nx += w * (e[0] * n0 + e[4] * n1 + e[8] * n2); ny += w * (e[1] * n0 + e[5] * n1 + e[9] * n2); nz += w * (e[2] * n0 + e[6] * n1 + e[10] * n2); }
    const nl = Math.hypot(nx, ny, nz) || 1; LP[3 * a] = px; LP[3 * a + 1] = py; LP[3 * a + 2] = pz; LN[3 * a] = nx / nl; LN[3 * a + 1] = ny / nl; LN[3 * a + 2] = nz / nl;
    const kk = key(Math.floor(px / C2), Math.floor(py / C2), Math.floor(pz / C2)); let L = grid.get(kk); if (!L) grid.set(kk, L = []); L.push(a); });
  let worst0 = 0;
  for (let it = 0; it < SKINITER; it++) { if (it) for (const j of [...M.keys()]) if (j >= J0) M.delete(j);
    const acc = new Float64Array(CB.length * 3), wacc = new Float64Array(CB.length); let nV = 0;
    for (const sp of skinS) { const x = RP[3 * sp.i], y = RP[3 * sp.i + 1], z = RP[3 * sp.i + 2]; let px = 0, py = 0, pz = 0;
      for (let k = 0; k < sp.js.length; k++) { const e = mat(sp.js[k]), w = sp.ws[k]; px += w * (e[0] * x + e[4] * y + e[8] * z + e[12]); py += w * (e[1] * x + e[5] * y + e[9] * z + e[13]); pz += w * (e[2] * x + e[6] * y + e[10] * z + e[14]); }
      const gx = Math.floor(px / C2), gy = Math.floor(py / C2), gz = Math.floor(pz / C2); let best = -1, bd = C2 * C2;
      for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) for (let dz = -1; dz <= 1; dz++) { const L = grid.get(key(gx + dx, gy + dy, gz + dz)); if (!L) continue;
        for (const a of L) { const ex = px - LP[3 * a], ey = py - LP[3 * a + 1], ez = pz - LP[3 * a + 2], d2 = ex * ex + ey * ey + ez * ez; if (d2 < bd) { bd = d2; best = a; } } }
      if (best < 0) continue; const sd = (px - LP[3 * best]) * LN[3 * best] + (py - LP[3 * best + 1]) * LN[3 * best + 1] + (pz - LP[3 * best + 2]) * LN[3 * best + 2];
      if (sd >= SKINPUSH) continue; const need = SKINPUSH - sd; nV++; if (!it && need > worst0) worst0 = need;
      for (let k = 0; k < sp.js.length; k++) { const j = sp.js[k]; if (j < J0) continue; const kb = j - J0, w = sp.ws[k]; acc[3 * kb] += w * need * LN[3 * best]; acc[3 * kb + 1] += w * need * LN[3 * best + 1]; acc[3 * kb + 2] += w * need * LN[3 * best + 2]; wacc[kb] += w; } }
    if (!nV) break; if (!it) skinStats.moved += nV;
    frames.forEach((m, kb) => { if (wacc[kb] > 0) { const e = m.elements; e[12] += acc[3 * kb] / wacc[kb]; e[13] += acc[3 * kb + 1] / wacc[kb]; e[14] += acc[3 * kb + 2] / wacc[kb]; } }); }
  skinStats.frames++; if (worst0 > skinStats.worst) skinStats.worst = worst0; };
const bake = () => { const Wi = Wj(jWaist).clone().invert(), frames = TURNFIT ? turnFrames() : CB.map(clothFrame);
  if (LSFIT) { const Q = frames.map((m, k) => new Quaternion().setFromRotationMatrix(m).multiply(restQ[k].clone().invert())), rhs = Array.from({ length: NBn }, () => new Vector3());
    for (let p = 0; p < NP; p++) { const o = 3 * p, y = V3(X[o], X[o + 1], X[o + 2]), x0 = V3(X0[o], X0[o + 1], X0[o + 2]);
      for (const [b, w] of PW[p]) y.addScaledVector(x0.clone().sub(restP[b]).applyQuaternion(Q[b]), -w);
      for (const [b, w] of PW[p]) rhs[b].addScaledVector(y, w); }
    frames.forEach((m, b) => rhs[b].addScaledVector(posOf(m), LSREG));
    frames.forEach((m, b) => { const P = new Vector3(); for (let k = 0; k < NBn; k++) P.addScaledVector(rhs[k], LSM[b][k]); m.setPosition(P); }); }
  if (SKINPUSH && skinOn) skinPush(frames);
  return frames.map(fr => { const loc = Wi.clone().multiply(fr), t = new Vector3(), q = new Quaternion(), s = new Vector3(); loc.decompose(t, q, s); return [t, q]; }); };
/* the rest pose bakes to rest */
{ pose(null, 0); targets(); X.set(X0); const r = bake(); let worst = 0; CB.forEach((cbn, k) => { worst = Math.max(worst, r[k][0].distanceTo(cbn.t), 2 * Math.acos(Math.min(1, Math.abs(r[k][1].dot(cbn.q))))); });
  if (worst > 1e-4) throw new Error(`robesim: the rest bakes ${worst} off the cloth bones' rest`); }
/* the keys that matter: a key is kept where the bone's place or turn between its neighbours kept misses it by more than
   POSTOL or ROTTOL */
const thin = (times, Ts, Qs) => { const keep = new Uint8Array(times.length); keep[0] = keep[times.length - 1] = 1;
  const rec = (i0, i1) => { if (i1 - i0 < 2) return; let worst = -1, wi = -1;
    for (let k = i0 + 1; k < i1; k++) { const u = (times[k] - times[i0]) / (times[i1] - times[i0]), q = Qs[i0].clone().slerp(Qs[i1], u), ang = 2 * Math.acos(Math.min(1, Math.abs(q.dot(Qs[k])))), dp = Ts[i0].clone().lerp(Ts[i1], u).distanceTo(Ts[k]);
      const e = Math.max(ang / ROTTOL, dp / POSTOL); if (e > worst) { worst = e; wi = k; } }
    if (worst > 1) { keep[wi] = 1; rec(i0, wi); rec(wi, i1); } };
  rec(0, times.length - 1); return keep; };
let dumpTake = null, dumpT = 0; if (DUMP) { const [a, b] = DUMP.split('@'); dumpTake = a; dumpT = +b; }
const buf = root.listBuffers()[0]; let nKeys = 0, nKept = 0; const stats = [];
const ONLY = process.env.ONLY ? process.env.ONLY.split(',') : null;   // a trial run: only these takes simulated (the others keep no cloth tracks)
for (const k of MAXDTAKES.keys()) if (!root.listAnimations().some(a => a.getName() === k)) throw new Error(`robesim: MAXDTAKES: no take ${k}`);
skinOn = true;
for (const an of root.listAnimations()) { const dur = duration(an); if (ONLY && !ONLY.includes(an.getName())) continue; draping = DRAPETAKES.includes(an.getName()); legwrapping = LEGWRAPTAKES.includes(an.getName());
  setMaxD(MAXDTAKES.has(an.getName()) ? MAXDTAKES.get(an.getName()) : MAXD);
  /* a take that ends as it began (his feet, knees and hips within 3 cm) loops: run twice, the second pass kept */
  const ends = t => { pose(an, t); return ['Hips', 'LeftFoot', 'RightFoot'].map(x => posOf(Wj(ji(x)))).concat(['Left', 'Right'].map(s => posOf(Wj(gL[s])))); };
  const e0 = ends(0), e1 = ends(dur), loops = e0.every((p, k) => p.distanceTo(e1[k]) < 0.03);
  /* his rest pose eased into the take's first frame, then held: the cloth starts as the robe hangs at rest and is carried
     and pushed into the take's first frame by his legs as they come, so a knee that rises in front of the robe takes the
     robe with it (begun ON the first frame, a seated knee began outside it) */
  pose(null, 0); targets(); X.set(Tg); Xp.set(Tg); turnPrev.forEach(q => q.identity()); turnFresh = true;
  const nSet = Math.round(SETTLE / DT), nHold = Math.round(HOLD / DT);
  for (let s = 0; s < nSet + nHold; s++) { pose(an, 0, s < nSet ? sstep((s + 1) / nSet) : 1); targets(); step(colliders()); }
  /* a loop is run until the cloth has settled into it (LOOPSECS seconds before the pass kept, two passes at least) */
  const passes = loops ? Math.max(2, 1 + Math.ceil(LOOPSECS / dur)) : 1, times = []; for (let k = 0; k * (1 / FPS) < dur - 1e-6; k++) times.push(k / FPS); times.push(dur);
  const rec = []; let dumped = false;
  for (let pass = 0; pass < passes; pass++) { let s = 0, ki = 0;
    while (ki < times.length) { const t = Math.min(s * DT, dur);
      if (pass === passes - 1 && t >= times[ki] - 1e-9) { rec.push(bake());
        if (dumpTake === an.getName() && !dumped && times[ki] >= dumpT - 1e-9) { dumped = true; writeFileSync(process.env.SIMDUMPOUT || 'simdump.json', JSON.stringify({ take: dumpTake, t: times[ki], X: [...X], T: [...Tg], X0: [...X0], NA, NR, bc, br, C: colliders().map(([A, B, pr, ra, rb]) => [A.toArray(), B.toArray(), pr ? pr.map(x => x + MARGIN) : [ra, rb]]) })); }
        ki++; continue; }
      s++; const t2 = Math.min(s * DT, dur); pose(an, t2); targets(); step(colliders()); if (t2 >= dur && pass < passes - 1) break; } }
  /* a loop closed: what its last frame misses its first by, laid on over its last LOOPBLEND seconds (each frame keeps its own
     shape and takes on a share of the difference, so the end meets the start; eased TOWARD the first frame, the frames in
     that window took the cloth of the take's first moment while his legs were elsewhere, and a running knee came through) */
  if (loops) { const last = rec.length - 1, dT = rec[0].map(([t], b) => t.clone().sub(rec[last][b][0])), dQ = rec[0].map(([, q], b) => q.clone().multiply(rec[last][b][1].clone().invert()));
    for (let k = 0; k < times.length; k++) { const w = sstep((times[k] - (dur - LOOPBLEND)) / LOOPBLEND); if (w <= 0) continue;
      rec[k] = rec[k].map(([t, q], b) => [t.clone().addScaledVector(dT[b], w), new Quaternion().slerp(dQ[b], w).multiply(q).normalize()]); } }
  /* written: each cloth bone a translation and a rotation track on the same keys, thinned */
  CB.forEach((cbn, b) => { const Ts = rec.map(r => r[b][0]), Qs = []; let prev = null; for (const r of rec) { const q = r[b][1].clone(); if (prev && prev.dot(q) < 0) q.set(-q.x, -q.y, -q.z, -q.w); prev = q; Qs.push(q); }
    /* the keys kept, their values on power-of-two grids (a place to QT metres, a turn's parts to QR, a time to QTIME
       seconds): the same to the eye, and the packed file's compression takes the zeroed low bits for nearly nothing */
    const keep = thin(times, Ts, Qs), TT = [], TP = [], TQ = [], g = (x, q) => Math.round(x / q) * q;
    for (let k = 0; k < times.length; k++) if (keep[k]) { TT.push(k === times.length - 1 ? times[k] : g(times[k], QTIME)); TP.push(g(Ts[k].x, QT), g(Ts[k].y, QT), g(Ts[k].z, QT)); TQ.push(g(Qs[k].x, QR), g(Qs[k].y, QR), g(Qs[k].z, QR), g(Qs[k].w, QR)); }
    for (let i = TT.length - 2; i >= 0; i--) if (TT[i] >= TT[i + 1]) TT[i] = TT[i + 1] - 1e-4;   // a rounded time never reaches the next
    nKeys += times.length; nKept += TT.length; const tAcc = doc.createAccessor().setType('SCALAR').setArray(new Float32Array(TT)).setBuffer(buf);
    for (const [path, arr, ty] of [['translation', TP, 'VEC3'], ['rotation', TQ, 'VEC4']]) { const smp = doc.createAnimationSampler().setInput(tAcc).setInterpolation('LINEAR').setOutput(doc.createAccessor().setType(ty).setArray(new Float32Array(arr)).setBuffer(buf));
      an.addSampler(smp).addChannel(doc.createAnimationChannel().setTargetNode(cbn.node).setTargetPath(path).setSampler(smp)); } });
  /* the chains drive nothing now: their tracks go */
  let dropped = 0; for (const ch of an.listChannels()) { const nd = ch.getTargetNode(); if (nd && /^Skirt[AMB]/.test(nd.getName())) { const smp = ch.getSampler(); ch.dispose(); if (smp && !smp.listParents().some(p => p.propertyType === 'AnimationChannel')) smp.dispose(); dropped++; } }
  stats.push(`${an.getName()} ${dur.toFixed(2)} s ${loops ? `loop (${passes} passes)` : 'once'}, ${times.length} frames, ${dropped} chain tracks dropped`); }
log('robesim: every take simulated:'); for (const s of stats) log('  ' + s);
if (SKINPUSH) log(`robesim: SKINPUSH: ${skinStats.moved} robe points moved off his legs over ${skinStats.frames} frames, the most one needed ${(skinStats.worst * 100).toFixed(1)} cm`);
await io.write(OUT, doc);
log(`robesim: wrote ${OUT} (${CB.length} cloth bones; ${nKept} of ${nKeys} keys kept, within ${(POSTOL * 1000).toFixed(1)} mm and ${(ROTTOL * 180 / Math.PI).toFixed(2)}°)`);
