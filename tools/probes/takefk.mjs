/* v28.0 (E4C5, R34): A TAKE MEASURED AS A MOTION, in Node, no browser: each animation of a takes file played through its own
   bones (forward kinematics from the file's rest pose and its channels, sampled), and the hands, the head, the hips and the
   feet written at N moments in the body's own frame at its first moment (x his left, y up, z his front; metres above the
   lowest sole of that moment). For picking a take for an act from what its body does, before it is cast (CLAUDE.md: a
   take is measured as a motion before it is cast).
     node tools/probes/takefk.mjs <takes.glb> [N=12] [clip-name-substring] */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder } from 'meshoptimizer';
import * as THREE from 'three';
await MeshoptDecoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder });
const [file, nArg, only] = process.argv.slice(2);
const N = +(nArg || 12);
const doc = await io.read(file), root = doc.getRoot();
const nodes = root.listNodes(), idx = new Map(nodes.map((n, i) => [n, i]));
const parent = new Array(nodes.length).fill(-1);
nodes.forEach((n, i) => n.listChildren().forEach(c => { parent[idx.get(c)] = i; }));
const order = []; const seen = new Set();
const visit = (i) => { if (seen.has(i)) return; if (parent[i] >= 0) visit(parent[i]); seen.add(i); order.push(i); };
nodes.forEach((_, i) => visit(i));
const find = (re) => nodes.findIndex(n => re.test(n.getName()));
const B = { hips: find(/^(mixamorig\d*:?)?Hips$/), head: find(/^(mixamorig\d*:?)?Head$/i), lh: find(/^(mixamorig\d*:?)?LeftHand$/), rh: find(/^(mixamorig\d*:?)?RightHand$/),
  lf: find(/^(mixamorig\d*:?)?LeftFoot$/), rf: find(/^(mixamorig\d*:?)?RightFoot$/), lt: find(/^(mixamorig\d*:?)?LeftToeBase$/), rt: find(/^(mixamorig\d*:?)?RightToeBase$/),
  lu: find(/^(mixamorig\d*:?)?LeftUpLeg$/), ru: find(/^(mixamorig\d*:?)?RightUpLeg$/) };
const sampleCh = (ch, t) => { const inp = ch.getSampler().getInput().getArray(), out = ch.getSampler().getOutput().getArray(), k = ch.getTargetPath() === 'rotation' ? 4 : 3;
  let i = 0; while (i < inp.length - 1 && inp[i + 1] <= t) i++;
  if (i >= inp.length - 1 || t <= inp[0]) { const j = t <= inp[0] ? 0 : inp.length - 1; return Array.from(out.slice(j * k, j * k + k)); }
  const u = (t - inp[i]) / Math.max(1e-6, inp[i + 1] - inp[i]);
  if (k === 4) { const a = new THREE.Quaternion().fromArray(out, i * 4), b = new THREE.Quaternion().fromArray(out, (i + 1) * 4); return a.slerp(b, u).toArray(); }
  return [0, 1, 2].map(c => out[i * 3 + c] * (1 - u) + out[(i + 1) * 3 + c] * u); };
const pose = (anim, t) => {
  const L = nodes.map(n => ({ t: n.getTranslation().slice(), r: n.getRotation().slice(), s: n.getScale().slice() }));
  if (anim) for (const ch of anim.listChannels()) { const i = idx.get(ch.getTargetNode()); if (i == null) continue; const p = ch.getTargetPath();
    if (p === 'rotation') L[i].r = sampleCh(ch, t); else if (p === 'translation') L[i].t = sampleCh(ch, t); else if (p === 'scale') L[i].s = sampleCh(ch, t); }
  const W = new Array(nodes.length);
  for (const i of order) { const m = new THREE.Matrix4().compose(new THREE.Vector3(...L[i].t), new THREE.Quaternion(...L[i].r), new THREE.Vector3(...L[i].s));
    W[i] = parent[i] >= 0 ? new THREE.Matrix4().multiplyMatrices(W[parent[i]], m) : m; }
  return (i) => new THREE.Vector3().setFromMatrixPosition(W[i]);
};
for (const anim of root.listAnimations()) {
  if (only && !anim.getName().includes(only)) continue;
  let dur = 0; for (const ch of anim.listChannels()) { const a = ch.getSampler().getInput().getArray(); dur = Math.max(dur, a[a.length - 1]); }
  const P0 = pose(anim, 0);
  /* the body's frame at its first moment: left = from the right thigh to the left, level; front = up x left */
  const left = P0(B.lu).sub(P0(B.ru)); left.y = 0; left.normalize(); const up = new THREE.Vector3(0, 1, 0), front = new THREE.Vector3().crossVectors(left, up).normalize();
  const o = P0(B.hips); o.y = 0;
  const loc = (v, floor) => [+(v.clone().sub(o).dot(left)).toFixed(2), +(v.y - floor).toFixed(2), +(v.clone().sub(o).dot(front)).toFixed(2)];
  console.log(`## ${anim.getName()} ${dur.toFixed(2)} s`);
  let prevH = null, headTravel = 0, hipsTravel = 0, prevHips = null;
  for (let k = 0; k <= N; k++) { const t = dur * k / N, P = pose(anim, t);
    const floor = Math.min(P(B.lf).y, P(B.rf).y, P(B.lt >= 0 ? B.lt : B.lf).y, P(B.rt >= 0 ? B.rt : B.rf).y) - 0.0;
    const h = P(B.head), hp = P(B.hips); if (prevH) headTravel += h.distanceTo(prevH); if (prevHips) hipsTravel += hp.distanceTo(prevHips); prevH = h; prevHips = hp;
    console.log(`  ${t.toFixed(2).padStart(5)}s head ${JSON.stringify(loc(h, floor))} hips ${JSON.stringify(loc(hp, floor))} L ${JSON.stringify(loc(P(B.lh), floor))} R ${JSON.stringify(loc(P(B.rh), floor))} feet L ${JSON.stringify(loc(P(B.lf), floor))} R ${JSON.stringify(loc(P(B.rf), floor))}`); }
  console.log(`  head travel ${headTravel.toFixed(2)} m, hips travel ${hipsTravel.toFixed(2)} m (sampled)`);
}
