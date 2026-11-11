/* v26.0 · THE ARMS BROUGHT IN, on a file's own takes.
 *
 *   node tools/calmarms.mjs <in.glb> <out.glb> <Take>=<hang°>[,<ka>[,<ks>]] [<Take>=...] ...
 *   node tools/calmarms.mjs <in.glb> --measure            (every take: how far out each upper arm hangs, and its swing)
 *
 * A library stand made for a broad young man holds both upper arms well out from the body (Meshy's Idle_3: about thirty
 * degrees on a slight devotee; photographed on Ton at the way in, it reads as a doll's A pose). v25.5 met the same in
 * the library walks and cured it inside the retarget (tools/retarget.mjs --calm). These people's takes are laid on
 * their own rig with no retarget (tools/mergetakes.mjs), so this is that cure as a tool of its own, on a merged file:
 *
 *   in WORLD space, a side at a time, the upper arm's line is read as two angles from the body's own axes (out from the
 *   body, and fore-and-aft); its MEAN angle out becomes <hang>, what it varies by is kept at a share <ka> (1 if not
 *   given), its swing at a share <ks> (1); the forearm and the hand ride the upper arm exactly as they did, so the
 *   take's own elbow and wrist are kept. Nothing else is touched: not the shoulders, the spine, the hips or the legs.
 *
 * The body's axes are measured, never assumed (v12.1): its left from the two thigh bones' rest places, up the world's.
 * A take that is not named is written back as it was. Judge the result by photograph (tools/clipsheet.mjs), front and
 * side: an arm brought to the vertical may put a hand into a wide skirt. */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder, MeshoptEncoder } from 'meshoptimizer';
await MeshoptDecoder.ready; await MeshoptEncoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder, 'meshopt.encoder': MeshoptEncoder });
const die = (m) => { console.error('calmarms: ' + m); process.exit(1); };
const argv = process.argv.slice(2), MEASURE = argv.includes('--measure');
const [inP, outP, ...specs] = argv.filter(a => a !== '--measure');
if (!inP || (!MEASURE && (!outP || !specs.length))) die('<in.glb> <out.glb> <Take>=<hang°>[,<ka>[,<ks>]] ...   |   <in.glb> --measure');
const D2R = Math.PI / 180;
const qMul = (a, b) => [a[3] * b[0] + a[0] * b[3] + a[1] * b[2] - a[2] * b[1], a[3] * b[1] - a[0] * b[2] + a[1] * b[3] + a[2] * b[0], a[3] * b[2] + a[0] * b[1] - a[1] * b[0] + a[2] * b[3], a[3] * b[3] - a[0] * b[0] - a[1] * b[1] - a[2] * b[2]];
const qInv = (q) => [-q[0], -q[1], -q[2], q[3]];
const qNorm = (q) => { const l = Math.hypot(q[0], q[1], q[2], q[3]) || 1; return [q[0] / l, q[1] / l, q[2] / l, q[3] / l]; };
const qRot = (q, v) => { const p = qMul(qMul(q, [v[0], v[1], v[2], 0]), qInv(q)); return [p[0], p[1], p[2]]; };
const vNorm = (v) => { const l = Math.hypot(v[0], v[1], v[2]); return l > 1e-9 ? [v[0] / l, v[1] / l, v[2] / l] : null; };
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
function qFromTo(a, b) {                                   // the shortest turn that takes unit a onto unit b
  const c = cross(a, b), d = dot(a, b);
  if (d < -0.999999) { const ax = vNorm(cross(Math.abs(a[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0], a)); return [ax[0], ax[1], ax[2], 0]; }
  return qNorm([c[0], c[1], c[2], 1 + d]);
}
function slerp(a, b, k) {
  let d = a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3]; if (d < 0) { b = [-b[0], -b[1], -b[2], -b[3]]; d = -d; }
  if (d > 0.9995) return qNorm([a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k, a[3] + (b[3] - a[3]) * k]);
  const th = Math.acos(d), s = Math.sin(th), wa = Math.sin((1 - k) * th) / s, wb = Math.sin(k * th) / s;
  return [a[0] * wa + b[0] * wb, a[1] * wa + b[1] * wb, a[2] * wa + b[2] * wb, a[3] * wa + b[3] * wb];
}

const doc = await io.read(inP), root = doc.getRoot();
const nodes = root.listNodes(), byName = new Map(nodes.map(n => [n.getName(), n]));
const parentOf = new Map(); for (const n of nodes) for (const c of n.listChildren()) parentOf.set(c, n);
const find = (re) => nodes.find(n => re.test(n.getName()));
const bone = (side, part) => find(new RegExp('^(mixamorig:?)?' + side + part + '$'));
const upL = bone('Left', 'UpLeg'), upR = bone('Right', 'UpLeg');
if (!upL || !upR) die('no thigh bones to take the body\'s left from');
/* the body's own axes at rest, in the world */
const wp = (n) => { const m = n.getWorldMatrix(); return [m[12], m[13], m[14]]; };
const UP = [0, 1, 0];
let LAT = vNorm([wp(upL)[0] - wp(upR)[0], 0, wp(upL)[2] - wp(upR)[2]]); if (!LAT) die('the thighs rest on one spot');
const FWD = vNorm(cross(LAT, UP));                         // (left x up: the way the body faces, for a body whose left is +x and face +z)
const deg = (r) => (r / D2R).toFixed(1), rngOf = (a) => `${deg(Math.min(...a))}..${deg(Math.max(...a))}`;

function work(anim, hang, ka, ks, write) {
  const rot = new Map();                                    // node -> { t: Float32Array, v: Float32Array, sampler }
  for (const ch of anim.listChannels()) { if (ch.getTargetPath() !== 'rotation') continue; const s = ch.getSampler();
    if (s.getInterpolation() !== 'LINEAR') die(anim.getName() + ': a ' + s.getInterpolation() + ' track on ' + ch.getTargetNode().getName());
    rot.set(ch.getTargetNode(), { t: s.getInput().getArray(), v: s.getOutput().getArray(), sampler: s }); }
  const at = (n, t) => { const r = rot.get(n); if (!r) return n.getRotation();
    const T = r.t, N = T.length; if (t <= T[0]) return [r.v[0], r.v[1], r.v[2], r.v[3]]; if (t >= T[N - 1]) return [r.v[N * 4 - 4], r.v[N * 4 - 3], r.v[N * 4 - 2], r.v[N * 4 - 1]];
    let lo = 0, hi = N - 1; while (hi - lo > 1) { const m = (lo + hi) >> 1; if (T[m] <= t) lo = m; else hi = m; }
    const k = (t - T[lo]) / (T[hi] - T[lo] || 1);
    return slerp([r.v[lo * 4], r.v[lo * 4 + 1], r.v[lo * 4 + 2], r.v[lo * 4 + 3]], [r.v[hi * 4], r.v[hi * 4 + 1], r.v[hi * 4 + 2], r.v[hi * 4 + 3]], k); };
  const worldOfParent = (n, t) => { const chain = []; for (let p = parentOf.get(n); p; p = parentOf.get(p)) chain.unshift(p);
    let q = [0, 0, 0, 1]; for (const p of chain) q = qMul(q, at(p, t)); return qNorm(q); };
  const out = [];
  for (const side of ['Left', 'Right']) {
    const A = bone(side, 'Arm'), Fo = bone(side, 'ForeArm');
    if (!A || !Fo) { out.push(side + ': no arm'); continue; }
    const r = rot.get(A); if (!r) { out.push(side + ': the take does not turn this arm'); continue; }
    const tl = vNorm(Fo.getTranslation()); if (!tl) { out.push(side + ': the forearm sits on its parent'); continue; }
    const sg = side === 'Left' ? 1 : -1, N = r.t.length, pW = new Array(N), wA = new Array(N), abd = [], sw = [];
    for (let f = 0; f < N; f++) { pW[f] = worldOfParent(A, r.t[f]); wA[f] = qNorm(qMul(pW[f], [r.v[f * 4], r.v[f * 4 + 1], r.v[f * 4 + 2], r.v[f * 4 + 3]]));
      const d = qRot(wA[f], tl); abd.push(Math.atan2(sg * dot(d, LAT), -dot(d, UP))); sw.push(Math.atan2(dot(d, FWD), -dot(d, UP))); }
    const mAbd = abd.reduce((a, b) => a + b, 0) / N;
    if (!write) { out.push(`${side} out ${rngOf(abd)} (mean ${deg(mAbd)}), swing ${rngOf(sw)}`); continue; }
    const nv = new Float32Array(N * 4), abd2 = [], sw2 = []; let prev = null;
    for (let f = 0; f < N; f++) { const a2 = hang * D2R + ka * (abd[f] - mAbd), s2 = ks * sw[f]; abd2.push(a2); sw2.push(s2);
      const d = qRot(wA[f], tl);
      const d2 = vNorm([sg * Math.tan(a2) * LAT[0] - UP[0] + Math.tan(s2) * FWD[0], sg * Math.tan(a2) * LAT[1] - UP[1] + Math.tan(s2) * FWD[1], sg * Math.tan(a2) * LAT[2] - UP[2] + Math.tan(s2) * FWD[2]]);
      let q = qNorm(qMul(qInv(pW[f]), qMul(qFromTo(d, d2), wA[f])));
      if (prev && dot4(prev, q) < 0) q = [-q[0], -q[1], -q[2], -q[3]];        // (the same turn, written on the same side as the key before it)
      prev = q; nv.set(q, f * 4); }
    const buf = r.sampler.getOutput().getBuffer() || root.listBuffers()[0];
    r.sampler.setOutput(doc.createAccessor().setType('VEC4').setArray(nv).setBuffer(buf));
    out.push(`${side} out ${rngOf(abd)} (mean ${deg(mAbd)}) -> ${rngOf(abd2)}; swing ${rngOf(sw)} -> ${rngOf(sw2)}`);
  }
  return out;
}
function dot4(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3]; }

console.log(`calmarms ${inP}: the body's left ${LAT.map(v => v.toFixed(2))}, its face ${FWD.map(v => v.toFixed(2))}`);
if (MEASURE) { for (const a of root.listAnimations()) console.log('  ' + a.getName().padEnd(30) + work(a, 0, 1, 1, false).join(' | ')); process.exit(0); }
for (const spec of specs) {
  const [name, rest] = spec.split('='); const [hang, ka = 1, ks = 1] = (rest || '').split(',').map(Number);
  if (!Number.isFinite(hang) || !Number.isFinite(ka) || !Number.isFinite(ks)) die('bad numbers in ' + spec);
  const anim = root.listAnimations().find(a => a.getName() === name);
  if (!anim) { console.log('  ' + name + ': not in this file (left out)'); continue; }
  console.log('  ' + name + ': ' + work(anim, hang, ka, ks, true).join(' | '));
}
await io.write(outP, doc);
console.log('wrote', outP);
