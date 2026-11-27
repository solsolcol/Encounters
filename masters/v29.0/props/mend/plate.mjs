/* v29.0 · the plate LEVELLED and made ROUND, at no credits: Meshy made the ritual set's small round plate an oval
   (0.134 x 0.160 m) lying a little tipped. Its plane is found from its own points (the axis of least spread, by the
   covariance's smallest eigenvector), the plate turned so that axis is up, its short axis across the plane stretched to
   the long one (the sheet is plain white porcelain: nothing painted on it can show the stretch; its normals recomputed
   by the stretch's inverse transpose), sized to D metres across, and set down centred with its lowest point on y 0.
   usage: node plate.mjs IN OUT [D] */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { dequantize, clearNodeTransform, meshopt, quantize } from '@gltf-transform/functions';
import { MeshoptDecoder, MeshoptEncoder } from 'meshoptimizer';
import fs from 'fs';
const [, , IN, OUT, DS = '0.16'] = process.argv; const D = Number(DS);
await Promise.all([MeshoptDecoder.ready, MeshoptEncoder.ready]);
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder, 'meshopt.encoder': MeshoptEncoder });
const doc = await io.read(IN); await doc.transform(dequantize());
for (const n of doc.getRoot().listNodes()) if (n.getMesh()) clearNodeTransform(n);
const p = doc.getRoot().listMeshes()[0].listPrimitives()[0];
const P = p.getAttribute('POSITION'), N = p.getAttribute('NORMAL'), n = P.getCount(), v = [0, 0, 0];
const c = [0, 0, 0]; for (let i = 0; i < n; i++) { P.getElement(i, v); for (let k = 0; k < 3; k++) c[k] += v[k] / n; }
const C = [[0,0,0],[0,0,0],[0,0,0]];
for (let i = 0; i < n; i++) { P.getElement(i, v); for (let a = 0; a < 3; a++) for (let b = 0; b < 3; b++) C[a][b] += (v[a]-c[a])*(v[b]-c[b]) / n; }
// Jacobi eigen-decomposition of the symmetric 3x3
let A = C.map(r => r.slice()), E = [[1,0,0],[0,1,0],[0,0,1]];
for (let s = 0; s < 60; s++) for (const [a, b] of [[0,1],[0,2],[1,2]]) {
  if (Math.abs(A[a][b]) < 1e-15) continue;
  const th = 0.5 * Math.atan2(2*A[a][b], A[b][b]-A[a][a]), cs = Math.cos(th), sn = Math.sin(th);
  for (let k = 0; k < 3; k++) { const x = A[k][a], y = A[k][b]; A[k][a] = cs*x - sn*y; A[k][b] = sn*x + cs*y; }
  for (let k = 0; k < 3; k++) { const x = A[a][k], y = A[b][k]; A[a][k] = cs*x - sn*y; A[b][k] = sn*x + cs*y; }
  for (let k = 0; k < 3; k++) { const x = E[k][a], y = E[k][b]; E[k][a] = cs*x - sn*y; E[k][b] = sn*x + cs*y; } }
const ev = [0,1,2].map(i => ({ l: A[i][i], e: [E[0][i], E[1][i], E[2][i]] })).sort((x, y) => y.l - x.l);
const up = ev[2].e; if (up[1] < 0) for (let k = 0; k < 3; k++) up[k] = -up[k];
const ax1 = ev[0].e, ax2 = [ax1[1]*up[2]-ax1[2]*up[1], ax1[2]*up[0]-ax1[0]*up[2], ax1[0]*up[1]-ax1[1]*up[0]];   // ax1 x up: a right-handed frame, so no mirror turns the faces inside out
// new coordinates: x along ax1 (the long axis), y up, z along ax2 (the short one), then the short one stretched
const dot = (a, b) => a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
let lo = [1e9,1e9,1e9], hi = [-1e9,-1e9,-1e9]; const Q = [];
for (let i = 0; i < n; i++) { P.getElement(i, v); const d = [v[0]-c[0], v[1]-c[1], v[2]-c[2]];
  const q = [dot(d, ax1), dot(d, up), dot(d, ax2)]; Q.push(q); for (let k = 0; k < 3; k++) { lo[k] = Math.min(lo[k], q[k]); hi[k] = Math.max(hi[k], q[k]); } }
const sx = D / (hi[0]-lo[0]), sz = D / (hi[2]-lo[2]), sy = sx;   // the height keeps the long axis's scale
console.log('was', (hi[0]-lo[0]).toFixed(4), 'x', (hi[2]-lo[2]).toFixed(4), 'tall', (hi[1]-lo[1]).toFixed(4), '; tilt of its plane', (Math.acos(Math.abs(up[1]))*180/Math.PI).toFixed(1), 'deg');
for (let i = 0; i < n; i++) { const q = Q[i];
  P.setElement(i, [(q[0]-(lo[0]+hi[0])/2)*sx, (q[1]-lo[1])*sy, (q[2]-(lo[2]+hi[2])/2)*sz]);
  if (N) { N.getElement(i, v); const m = [dot(v, ax1)/sx, dot(v, up)/sy, dot(v, ax2)/sz]; const l = Math.hypot(...m); N.setElement(i, m.map(x => x/l)); } }
console.log('now', D, 'x', D, 'tall', ((hi[1]-lo[1])*sy).toFixed(4));
await doc.transform(quantize(), meshopt({ encoder: MeshoptEncoder, level: 'medium' }));
const tmp = OUT + '.tmp.glb'; await io.write(tmp, doc); fs.renameSync(tmp, OUT);
