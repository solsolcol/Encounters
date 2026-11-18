/* v27.0 · A TAKE'S PATH, second by second (windowread.mjs's own reading of a take's keys, written out): the head's, the
   hips' and both hands' places through the whole take, relative to where the hips start, in the file's metres. Where a
   generated take wanders (a trance that folds the body out of its chair) is read here before a film plays it.
     [STEP=0.5] node tools/probes/takepath.mjs <file.glb> <take> 0 0
   (from windowread.mjs:) A REST WINDOW READ AS A MOTION (Chad, 12 Nov 2026: "grandmaster pho is bobbing and bouncing too much in his
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
/* (PARTS=LeftArm,RightArm,...: those bones instead of the head, the hips and the hands) */
const parts = process.env.PARTS ? Object.fromEntries(process.env.PARTS.split(',').map(n => [n, find(new RegExp('^(mixamorig:?)?' + n + '$'))]))
  : { head: find(/^(mixamorig:?)?Head$/), hips: find(/^(mixamorig:?)?Hips$/), lhand: find(/^(mixamorig:?)?LeftHand$/), rhand: find(/^(mixamorig:?)?RightHand$/) };
const dur = Math.max(...[...ch.values()].flatMap(c => Object.values(c).map(s => s.t[s.t.length - 1])));
const STEP = +(process.env.STEP || 0.5);
console.log(`${file.split('/').pop()} ${clipName} (${dur.toFixed(2)} s): every ${STEP} s, the file's own metres (x y z), relative to the hips at 0`);
const h0 = process.env.ABS ? [0, 0, 0] : (parts.hips ? world(parts.hips, 0) : [0, 0, 0]);   // (ABS=1: the file's own origin instead)
for (let t = 0; t <= dur + 1e-6; t += STEP) {
  const row = [`t ${t.toFixed(2).padStart(5)}`];
  for (const [name, node] of Object.entries(parts)) { if (!node) continue; const p = world(node, Math.min(t, dur)); row.push(`${name} ${p.map((v, i) => (v - h0[i]).toFixed(2).padStart(6)).join(' ')}`); }
  console.log(row.join(' | '));
}
