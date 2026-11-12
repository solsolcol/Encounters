/* v26.0 · THE TRIANGLES ROUND ONE JOINT, POSED, AS NUMBERS (Grandmaster Pho's right armpit, 12 Nov 2026): every triangle
   of the part that holds the joint whose posed middle lies within `r` of the joint, posed in the take and moment named
   exactly as the game skins it (each bone's world turn times its inverse bind, weighted), written as JSON for a reader
   that slices or draws them (tools/probes/armslice.py): per triangle its index in the part, its three posed points, and
   per point the share of the arm's bones (`--arm`, a regex) and the colour of its texel.
     node tools/probes/armdump.mjs <file.glb> <out.json> --take=Sitting_Answering_Questions --t=0.7 [--joint=RightArm] [--r=0.16] [--arm=Right(Arm|ForeArm|Hand)] */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder, MeshoptEncoder } from 'meshoptimizer';
import * as THREE from 'three';
import fs from 'node:fs';
await MeshoptDecoder.ready; await MeshoptEncoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder, 'meshopt.encoder': MeshoptEncoder });
const args = process.argv.slice(2), files = args.filter(a => !a.startsWith('--')), arg = (k, d) => { const a = args.find(x => x.startsWith(`--${k}=`)); return a ? a.slice(k.length + 3) : d; };
const [IN, OUT] = files, TAKE = arg('take', 'Sitting_Answering_Questions'), T = +arg('t', 0.7), R = +arg('r', 0.16), JN = arg('joint', 'RightArm'), ARM = new RegExp(arg('arm', 'Right(Arm|ForeArm|Hand)') + '$');
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
const an = TAKE === 'REST' ? null : root.listAnimations().find(a => a.getName() === TAKE); if (TAKE !== 'REST' && !an) { console.error('no take ' + TAKE); process.exit(2); }
pose(an, T); const SM = joints.map((j, k) => new THREE.Matrix4().multiplyMatrices(world[NI.get(j)], new THREE.Matrix4().fromArray(IBM, k * 16)));
const jJ = joints.findIndex(j => new RegExp(JN + '$').test(j.getName())), JW = new THREE.Vector3().setFromMatrixPosition(world[NI.get(joints[jJ])]);
const armJ = new Set(joints.map((j, k) => ARM.test(j.getName()) ? k : -1).filter(k => k >= 0));
const named = (re) => { const k = joints.findIndex(j => re.test(j.getName())); return k < 0 ? null : new THREE.Vector3().setFromMatrixPosition(world[NI.get(joints[k])]).toArray(); };
const out = { file: IN, take: TAKE, t: T, joint: JW.toArray(), elbow: named(/RightForeArm$/), spine1: named(/Spine1$/), spine2: named(/Spine2$/), neck: named(/Neck$/), parts: [] };
let part = 0;
for (const n of root.listNodes()) { const m = n.getMesh(); if (!m || !n.getSkin()) continue;
  for (const pr of m.listPrimitives()) { const P = pr.getAttribute('POSITION'), J = pr.getAttribute('JOINTS_0'), W = pr.getAttribute('WEIGHTS_0'), I = pr.getIndices(), UV = pr.getAttribute('TEXCOORD_0');
    const rec = { part, name: (m.getName() || '?') + ':' + (pr.getMaterial() ? pr.getMaterial().getName() : ''), tris: [] }; part++;
    if (!P || !J || !W || !I) { out.parts.push(rec); continue; }
    const nV = P.getCount(), X = new Float32Array(nV * 3), A = new Float32Array(nV), e = [0, 0, 0], j4 = [0, 0, 0, 0], w4 = [0, 0, 0, 0], v = new THREE.Vector3(), M = new THREE.Matrix4();
    for (let i = 0; i < nV; i++) { P.getElement(i, e); J.getElement(i, j4); W.getElement(i, w4); M.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0); const me = M.elements; let a = 0;
      for (let k = 0; k < 4; k++) { if (!(w4[k] > 0)) continue; const s = SM[j4[k]].elements; for (let c = 0; c < 16; c++) me[c] += w4[k] * s[c]; if (armJ.has(j4[k])) a += w4[k]; }
      v.fromArray(e).applyMatrix4(M); X[3 * i] = v.x; X[3 * i + 1] = v.y; X[3 * i + 2] = v.z; A[i] = a; }
    const ix = I.getArray(), uv = [0, 0];
    for (let t = 0; t < ix.length / 3; t++) { const a = ix[3 * t], b = ix[3 * t + 1], c = ix[3 * t + 2];
      const mx = (X[3 * a] + X[3 * b] + X[3 * c]) / 3, my = (X[3 * a + 1] + X[3 * b + 1] + X[3 * c + 1]) / 3, mz = (X[3 * a + 2] + X[3 * b + 2] + X[3 * c + 2]) / 3;
      if (Math.hypot(mx - JW.x, my - JW.y, mz - JW.z) > R) continue;
      const q = []; for (const i of [a, b, c]) { if (UV) UV.getElement(i, uv); q.push([+X[3 * i].toFixed(5), +X[3 * i + 1].toFixed(5), +X[3 * i + 2].toFixed(5), +A[i].toFixed(3), +uv[0].toFixed(5), +uv[1].toFixed(5), i]); }
      rec.tris.push([t, q]); }
    out.parts.push(rec); } }
fs.writeFileSync(OUT, JSON.stringify(out)); console.log(OUT, out.parts.map(p => p.name + ' ' + p.tris.length).join(' | '), 'joint', JW.toArray().map(x => x.toFixed(3)).join(','), 'elbow', out.elbow && out.elbow.map(x => x.toFixed(3)).join(','));
