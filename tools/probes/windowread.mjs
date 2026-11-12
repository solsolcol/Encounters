/* v26.0: A REST WINDOW READ AS A MOTION (Chad, 12 Nov 2026: "grandmaster pho is bobbing and bouncing too much in his
   passive pose, slow down the bobbing significantly"). A person at rest plays a WINDOW of a take there and back
   (c_cast.js windowTime: [from, length, period]); how fast his head and hips move is the window's travel over its
   period, and that is read here from the take's own keys, with no browser: the head's and the hips' path through the
   window, how far each goes there and back, and its peak and mean speed at a given period (the eased there-and-back
   windowTime plays: a window of `len` seconds of the take, there and back in `period` seconds; unsaid, 2 x len, the
   take's own pace).
     node tools/probes/windowread.mjs <file.glb> <take> <from> <len> [period ...] */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder, MeshoptEncoder } from 'meshoptimizer';
await MeshoptDecoder.ready; await MeshoptEncoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder, 'meshopt.encoder': MeshoptEncoder });
const [file, clipName, fromS, lenS, ...periods] = process.argv.slice(2);
if (!file || !clipName || fromS == null || lenS == null) { console.error('usage: node tools/probes/windowread.mjs <file.glb> <take> <from> <len> [period ...]'); process.exit(2); }
const from = +fromS, len = +lenS;
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
const parts = { head: find(/^(mixamorig:?)?Head$/), hips: find(/^(mixamorig:?)?Hips$/), 'right hand': find(/^(mixamorig:?)?RightHand$/) };
const dur = Math.max(...[...ch.values()].flatMap(c => Object.values(c).map(s => s.t[s.t.length - 1])));
const wrap = (t) => ((t % dur) + dur) % dur, N = 240;
console.log(`${file.split('/').pop()} ${clipName} (${dur.toFixed(2)} s): the window ${from} + ${len} s`);
for (const [name, node] of Object.entries(parts)) { if (!node) continue;
  /* the path through the window, by the take's own time */
  const pts = []; for (let i = 0; i <= N; i++) pts.push(world(node, wrap(from + len * i / N)));
  let path = 0; for (let i = 1; i <= N; i++) path += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1], pts[i][2] - pts[i - 1][2]);
  const ends = Math.hypot(pts[N][0] - pts[0][0], pts[N][1] - pts[0][1], pts[N][2] - pts[0][2]), ys = pts.map(p => p[1]);
  let line = `  ${name.padEnd(10)} goes ${(path * 100).toFixed(1)} cm along its path one way (${(ends * 100).toFixed(1)} cm end to end; up and down ${((Math.max(...ys) - Math.min(...ys)) * 100).toFixed(1)} cm)`;
  for (const per of (periods.length ? periods : [String(len * 2)])) { const P = +per;
    /* the eased there-and-back: the take's time at clock c is from + len * (0.5 - 0.5 cos(2 pi c / P)) */
    let peak = 0; const M = 2000; let prev = null;
    for (let i = 0; i <= M; i++) { const c = P * i / M, t = wrap(from + len * (0.5 - 0.5 * Math.cos(2 * Math.PI * c / P))), p = world(node, t); if (prev) peak = Math.max(peak, Math.hypot(p[0] - prev[0], p[1] - prev[1], p[2] - prev[2]) / (P / M)); prev = p; }
    line += `; there and back in ${P} s: ${(2 * path * 100 / P).toFixed(1)} cm a second on average, ${(peak * 100).toFixed(1)} at its fastest`; }
  console.log(line); }
