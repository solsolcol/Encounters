/* v26.1 · A TAKE READ AS HEIGHTS, with no browser: both hands', the head's, the hips' and the left foot's height above
   the rig's ground (cm), and the hips' place, every tenth of a second through a take. Made to find where a child's jump
   of joy crouches, throws its arms up and comes down (Chad, 12 Nov 2026: "I want the kids to play the flowers more
   often ... keep looping it every cycle"), so a throw is let go as the hands pass the head.
     node tools/probes/takeheights.mjs <file.glb> <take> */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder, MeshoptEncoder } from 'meshoptimizer';
await MeshoptDecoder.ready; await MeshoptEncoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder, 'meshopt.encoder': MeshoptEncoder });
const [file, clipName] = process.argv.slice(2);
const doc = await io.read(file), root = doc.getRoot();
console.log('takes:', root.listAnimations().map(a => a.getName()).join(', '));
const A = root.listAnimations().find(a => a.getName() === clipName);
const ch = new Map();
for (const c of A.listChannels()) { const n = c.getTargetNode(); if (!ch.has(n)) ch.set(n, {}); ch.get(n)[c.getTargetPath()] = { t: c.getSampler().getInput().getArray(), v: c.getSampler().getOutput().getArray(), n: c.getSampler().getOutput().getElementSize() }; }
const samp = (s, t) => { const T = s.t; let i = 0; while (i < T.length - 2 && T[i + 1] <= t) i++; const k = Math.max(0, Math.min(1, (t - T[i]) / Math.max(1e-9, T[i + 1] - T[i]))), a = [], n = s.n;
  for (let j = 0; j < n; j++) a.push(s.v[i * n + j] * (1 - k) + s.v[(i + 1) * n + j] * k);
  if (n === 4) { const l = Math.hypot(...a); return a.map(x => x / l); } return a; };
const qmul = (a, b) => [a[3] * b[0] + a[0] * b[3] + a[1] * b[2] - a[2] * b[1], a[3] * b[1] - a[0] * b[2] + a[1] * b[3] + a[2] * b[0], a[3] * b[2] + a[0] * b[1] - a[1] * b[0] + a[2] * b[3], a[3] * b[3] - a[0] * b[0] - a[1] * b[1] - a[2] * b[2]];
const qrot = (q, v) => { const [x, y, z, w] = q, ix = w * v[0] + y * v[2] - z * v[1], iy = w * v[1] + z * v[0] - x * v[2], iz = w * v[2] + x * v[1] - y * v[0], iw = -x * v[0] - y * v[1] - z * v[2];
  return [ix * w + iw * -x + iy * -z - iz * -y, iy * w + iw * -y + iz * -x - ix * -z, iz * w + iw * -z + ix * -y - iy * -x]; };
const world = (node, t) => { const chain = []; for (let n = node; n; n = n.getParentNode ? n.getParentNode() : null) chain.unshift(n);
  let p = [0, 0, 0], q = [0, 0, 0, 1], s = 1;
  for (const n of chain) { const c = ch.get(n) || {}, T = c.translation ? samp(c.translation, t) : n.getTranslation(), R = c.rotation ? samp(c.rotation, t) : n.getRotation(), S = n.getScale()[0];
    const tp = qrot(q, T.map(x => x * s)); p = [p[0] + tp[0], p[1] + tp[1], p[2] + tp[2]]; q = qmul(q, R); s *= S; }
  return p; };
const find = (re) => root.listNodes().find(n => re.test(n.getName()));
const P = { L: find(/^(mixamorig:?)?LeftHand$/), R: find(/^(mixamorig:?)?RightHand$/), head: find(/^(mixamorig:?)?Head$/), hips: find(/^(mixamorig:?)?Hips$/), foot: find(/^(mixamorig:?)?LeftFoot$/) };
const dur = Math.max(...[...ch.get(P.hips) ? Object.values(ch.get(P.hips)).map(s => s.t[s.t.length - 1]) : [0], ...[...ch.values()].flatMap(c => Object.values(c).map(s => s.t[s.t.length - 1]))]);
console.log(clipName, 'length', dur.toFixed(2), 's');
for (let t = 0; t <= dur + 1e-6; t += 0.1) {
  const r = {}; for (const [k, n] of Object.entries(P)) r[k] = world(n, t);
  console.log(t.toFixed(1).padStart(5), ' hands', (r.L[1] * 100).toFixed(0).padStart(4), (r.R[1] * 100).toFixed(0).padStart(4), '  head', (r.head[1] * 100).toFixed(0).padStart(4), '  hips', (r.hips[1] * 100).toFixed(0).padStart(4), '  foot', (r.foot[1] * 100).toFixed(0).padStart(4), '  hips xz', (r.hips[0] * 100).toFixed(0), (r.hips[2] * 100).toFixed(0));
}
