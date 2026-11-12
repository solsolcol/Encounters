/* v26.0 · HOW FAR AN UPPER ARM STANDS OUT FROM THE BODY, frame by frame (where an armpit opens most, so a fix to it is
   looked at where it is most seen): the angle between the upper arm (shoulder joint to elbow) and the body's own down
   line (Spine2 to Hips), every `step` seconds of each take named.
     node tools/probes/armopen.mjs <file.glb> [--takes=a,b] [--step=0.1] [--side=Right] */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder } from 'meshoptimizer';
import * as THREE from 'three';
await MeshoptDecoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder });
const args = process.argv.slice(2), arg = (k, d) => { const a = args.find(x => x.startsWith(`--${k}=`)); return a ? a.slice(k.length + 3) : d; };
const FILE = args.find(a => !a.startsWith('--')), STEP = +arg('step', 0.1), SIDE = arg('side', 'Right'), TAKES = arg('takes', '').split(',').filter(Boolean);
const doc = await io.read(FILE), root = doc.getRoot(), nodes = root.listNodes(), NI = new Map(nodes.map((n, i) => [n, i])), parent = new Int32Array(nodes.length).fill(-1);
nodes.forEach((n, i) => n.listChildren().forEach(c => { parent[NI.get(c)] = i; }));
const order = []; { const seen = new Uint8Array(nodes.length); const visit = i => { if (seen[i]) return; if (parent[i] >= 0) visit(parent[i]); seen[i] = 1; order.push(i); }; nodes.forEach((_, i) => visit(i)); }
const tq = new THREE.Quaternion(), tq2 = new THREE.Quaternion();
const sample = (ch, t) => { const smp = ch.getSampler(), inp = smp.getInput().getArray(), out = smp.getOutput().getArray(), n = inp.length, w = ch.getTargetPath() === 'rotation' ? 4 : 3, at = k => Array.from(out.slice(k * w, k * w + w));
  if (t <= inp[0]) return at(0); if (t >= inp[n - 1]) return at(n - 1); let lo = 0, hi = n - 1; while (hi - lo > 1) { const m = (lo + hi) >> 1; if (inp[m] <= t) lo = m; else hi = m; }
  const u = (t - inp[lo]) / (inp[hi] - inp[lo]), a = at(lo), b = at(hi); if (w === 4) { tq.fromArray(a); tq2.fromArray(b); tq.slerp(tq2, u); return tq.toArray(); } return a.map((x, k) => x + (b[k] - x) * u); };
const world = nodes.map(() => new THREE.Matrix4()), _l = new THREE.Matrix4(), _t = new THREE.Vector3(), _q = new THREE.Quaternion(), _s = new THREE.Vector3();
const pose = (an, t) => { const trs = nodes.map(n => ({ t: n.getTranslation(), r: n.getRotation(), s: n.getScale() }));
  for (const ch of an.listChannels()) { const i = NI.get(ch.getTargetNode()), p = ch.getTargetPath(); if (p === 'translation') trs[i].t = sample(ch, t); else if (p === 'rotation') trs[i].r = sample(ch, t); }
  for (const i of order) { _l.compose(_t.fromArray(trs[i].t), _q.fromArray(trs[i].r).normalize(), _s.fromArray(trs[i].s)); if (parent[i] >= 0) world[i].multiplyMatrices(world[parent[i]], _l); else world[i].copy(_l); } };
const at = (re) => { const i = nodes.findIndex(n => re.test(n.getName())); return () => new THREE.Vector3().setFromMatrixPosition(world[i]); };
const A = at(new RegExp(SIDE + 'Arm$')), E = at(new RegExp(SIDE + 'ForeArm$')), S2 = at(/Spine2$/), H = at(/Hips$/);
for (const an of root.listAnimations()) { if (TAKES.length && !TAKES.includes(an.getName())) continue;
  let len = 0; for (const ch of an.listChannels()) { const a = ch.getSampler().getInput().getArray(); len = Math.max(len, a[a.length - 1]); }
  const row = []; let mx = -1, mt = 0;
  for (let t = 0; t <= len + 1e-6; t += STEP) { pose(an, t); const u = E().sub(A()).normalize(), d = H().sub(S2()).normalize(), ang = Math.acos(Math.max(-1, Math.min(1, u.dot(d)))) * 180 / Math.PI; row.push(ang.toFixed(0)); if (ang > mx) { mx = ang; mt = t; } }
  console.log(`${an.getName()} (${len.toFixed(2)} s): most open ${mx.toFixed(1)} deg at ${mt.toFixed(2)} s | every ${STEP} s: ${row.join(' ')}`); }
