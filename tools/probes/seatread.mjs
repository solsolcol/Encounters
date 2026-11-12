/* v26.0: A SEAT'S OWN MEASURES, from its mesh (a seat's height is the drawn model's, never a number remembered: the monks
   sank into their chairs because the file's 0.42 m was written where the chair is drawn at 1.11 of it). Prints the
   model's box, the heights that hold the most up-facing surface (a seat's top is one of them), and each one's extent:
   how far the seat runs forward and back of the model's own origin.
     node tools/probes/seatread.mjs <seat.glb> [scale] */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder } from 'meshoptimizer';
await MeshoptDecoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder });
const doc = await io.read(process.argv[2]);
const K = +process.argv[3] || 1;
const mn = [1e9, 1e9, 1e9], mx = [-1e9, -1e9, -1e9]; const up = [], all = [];
for (const node of doc.getRoot().listNodes()) { const mesh = node.getMesh(); if (!mesh) continue; const M = node.getWorldMatrix();
  for (const p of mesh.listPrimitives()) { const pos = p.getAttribute('POSITION'), idx = p.getIndices(); const P = [];
    for (let i = 0; i < pos.getCount(); i++) { const v = pos.getElement(i, []); const x = K * (M[0] * v[0] + M[4] * v[1] + M[8] * v[2] + M[12]), y = K * (M[1] * v[0] + M[5] * v[1] + M[9] * v[2] + M[13]), z = K * (M[2] * v[0] + M[6] * v[1] + M[10] * v[2] + M[14]);
      P.push([x, y, z]); all.push([x, y, z]); for (let k = 0; k < 3; k++) { mn[k] = Math.min(mn[k], [x, y, z][k]); mx[k] = Math.max(mx[k], [x, y, z][k]); } }
    const n = idx ? idx.getCount() : P.length;
    for (let t = 0; t < n; t += 3) { const a = P[idx ? idx.getScalar(t) : t], b = P[idx ? idx.getScalar(t + 1) : t + 1], c = P[idx ? idx.getScalar(t + 2) : t + 2];
      const ux = b[0] - a[0], uy = b[1] - a[1], uz = b[2] - a[2], vx = c[0] - a[0], vy = c[1] - a[1], vz = c[2] - a[2];
      const nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx, L = Math.hypot(nx, ny, nz) || 1;
      if (ny / L > 0.9) up.push([(a[0] + b[0] + c[0]) / 3, (a[1] + b[1] + c[1]) / 3, (a[2] + b[2] + c[2]) / 3, L / 2]); } } }
console.log('box', mn.map(v => v.toFixed(3)), mx.map(v => v.toFixed(3)));
// up-facing area by height band
const bands = {}; for (const [x, y, z, A] of up) { const k = (Math.round(y / 0.02) * 0.02).toFixed(2); bands[k] = (bands[k] || 0) + A; }
const top = Object.entries(bands).sort((a, b) => b[1] - a[1]).slice(0, 8); console.log('up-facing area by height', top.map(([k, a]) => k + ':' + a.toFixed(3)).join('  '));
for (const [k] of top.slice(0, 4)) { const y0 = +k; const S = up.filter(q => Math.abs(q[1] - y0) < 0.015); let x0 = 1e9, x1 = -1e9, z0 = 1e9, z1 = -1e9; for (const q of S) { x0 = Math.min(x0, q[0]); x1 = Math.max(x1, q[0]); z0 = Math.min(z0, q[2]); z1 = Math.max(z1, q[2]); }
  console.log('  at', k, 'x', x0.toFixed(3), x1.toFixed(3), 'z', z0.toFixed(3), z1.toFixed(3), 'n', S.length); }
/* between its arms: of everything 4 to 32 cm over the seat's top (the height with the most up-facing surface), in the
   middle half of its depth, the nearest to its middle line on each side; and the same slab's reach front and back */
{ const seatY = +top[0][0], zc = (mn[2] + mx[2]) / 2, zd = (mx[2] - mn[2]) / 4; let l = -1e9, r = 1e9, f = -1e9, b = 1e9, hi = 0;
  for (const [x, y, z] of all) { if (y < seatY + 0.04 || y > seatY + 0.32) continue; f = Math.max(f, z); b = Math.min(b, z);
    if (Math.abs(z - zc) > zd) continue; if (x < 0) l = Math.max(l, x); else r = Math.min(r, x); hi = Math.max(hi, y); }
  console.log('seat top', seatY.toFixed(2), '· between the arms: x', l.toFixed(3), 'to', r.toFixed(3), '(' + (r - l).toFixed(3) + ' m clear); what stands 4 to 32 cm over the seat runs z', b.toFixed(3), 'to', f.toFixed(3)); }
