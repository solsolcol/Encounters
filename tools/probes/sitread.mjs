/* v26.0: A SEATED TAKE READ AS A SEAT (Chad, 12 Nov 2026, of the monks: "their body is clipping through the seats").
   Before a sitter is given a chair, the take says what chair it sits on: how high the hip joints ride over the soles,
   how far the thighs slope down to the knees (a take that perches on a high stool slopes thirty degrees; one that sits
   in a chair is near level), where the shins come down ahead of the hips, and where the hands are. Read from the take's
   own keys, with no browser, at the moments asked for (or every `step` seconds through it):
     node tools/probes/sitread.mjs <file.glb> <take> [t ...] [--step=0.5]
   All in the file's own units and frame (y up; "ahead" is along the hips-to-knees line on the ground). */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder, MeshoptEncoder } from 'meshoptimizer';
await MeshoptDecoder.ready; await MeshoptEncoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder, 'meshopt.encoder': MeshoptEncoder });
const args = process.argv.slice(2), step = +((args.find(a => a.startsWith('--step=')) || '').slice(7)) || 0, [file, clipName, ...ts] = args.filter(a => !a.startsWith('--'));
if (!file || !clipName) { console.error('usage: node tools/probes/sitread.mjs <file.glb> <take> [t ...] [--step=0.5]'); process.exit(2); }
const doc = await io.read(file), root = doc.getRoot(), A = root.listAnimations().find(a => a.getName() === clipName);
if (!A) { console.error('no take ' + clipName + ' in ' + file + ' (it has: ' + root.listAnimations().map(a => a.getName()).join(', ') + ')'); process.exit(2); }
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
const N = (s) => find(new RegExp('^(mixamorig:?)?' + s + '$'));
const B = { hips: N('Hips'), kL: N('LeftLeg'), kR: N('RightLeg'), aL: N('LeftFoot'), aR: N('RightFoot'), tL: N('LeftToeBase'), tR: N('RightToeBase'), hL: N('LeftHand'), hR: N('RightHand'), head: N('Head'), eL: N('LeftForeArm'), eR: N('RightForeArm') };
const dur = Math.max(...[...ch.values()].flatMap(c => Object.values(c).map(s => s.t[s.t.length - 1])));
const times = ts.length ? ts.map(Number) : Array.from({ length: Math.floor(dur / (step || 0.5)) + 1 }, (_, i) => i * (step || 0.5));
const f = (x) => (x * 100).toFixed(0).padStart(4);
console.log(`${file.split('/').pop()} ${clipName} (${dur.toFixed(2)} s). cm: hips up | knees up, ahead | ankles up, ahead | lowest toe | thigh slope | hands up, ahead, out | head up`);
for (const t of times) { const P = {}; for (const k in B) P[k] = B[k] ? world(B[k], Math.min(t, dur)) : null;
  /* ahead: the ground line from the hips to the middle of the knees */
  const kx = (P.kL[0] + P.kR[0]) / 2 - P.hips[0], kz = (P.kL[2] + P.kR[2]) / 2 - P.hips[2], L = Math.hypot(kx, kz) || 1, ax = kx / L, az = kz / L;
  const ah = (p) => (p[0] - P.hips[0]) * ax + (p[2] - P.hips[2]) * az, out = (p) => (p[0] - P.hips[0]) * az - (p[2] - P.hips[2]) * ax;
  const slope = (k) => Math.atan2(P.hips[1] - k[1], ah(k)) * 180 / Math.PI;
  console.log(`  ${t.toFixed(2).padStart(5)} s  hips ${f(P.hips[1])} | knees ${f(P.kL[1])} ${f(P.kR[1])}, ${f(ah(P.kL))} ${f(ah(P.kR))} | ankles ${f(P.aL[1])} ${f(P.aR[1])}, ${f(ah(P.aL))} ${f(ah(P.aR))} | toe ${f(Math.min(P.tL ? P.tL[1] : 9, P.tR ? P.tR[1] : 9))} | slope ${slope(P.kL).toFixed(0).padStart(3)} ${slope(P.kR).toFixed(0).padStart(3)} deg | hands ${f(P.hL[1])} ${f(P.hR[1])}, ${f(ah(P.hL))} ${f(ah(P.hR))}, ${f(out(P.hL))} ${f(out(P.hR))} | head ${f(P.head[1])}`); }
