/* v27.0 · the FRONT-MOST surface of a model over a grid of x and y (its own metres): for each point, the largest z of any
   triangle that covers it seen from the front (+z). A flat fill spanned by big triangles (a frame's glass) has few points
   of its own, so planez.mjs cannot see it; this sees the surface itself.
     node tools/probes/frontz.mjs <file.glb> x0 x1 y0 y1 [step]   prints one row a y: the front z at each x, and the row's median */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder } from 'meshoptimizer';
await MeshoptDecoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder });
const [f, ...r] = process.argv.slice(2), [x0, x1, y0, y1] = r.slice(0, 4).map(Number), st = Number(r[4] || 0.01);
const doc = await io.read(f), T = [];
for (const nd of doc.getRoot().listNodes()) { const m = nd.getMesh(); if (!m) continue; const M = nd.getWorldMatrix();
  for (const p of m.listPrimitives()) { const a = p.getAttribute('POSITION'), ix = p.getIndices(), v = [0, 0, 0], P = [];
    for (let i = 0; i < a.getCount(); i++) { a.getElement(i, v); P.push([M[0] * v[0] + M[4] * v[1] + M[8] * v[2] + M[12], M[1] * v[0] + M[5] * v[1] + M[9] * v[2] + M[13], M[2] * v[0] + M[6] * v[1] + M[10] * v[2] + M[14]]); }
    const n = ix ? ix.getCount() : P.length; for (let i = 0; i < n; i += 3) { const A = P[ix ? ix.getScalar(i) : i], B = P[ix ? ix.getScalar(i + 1) : i + 1], C = P[ix ? ix.getScalar(i + 2) : i + 2]; T.push([A, B, C]); } } }
function front(x, y) { let best = -Infinity;
  for (const [A, B, C] of T) { const d = (B[1] - C[1]) * (A[0] - C[0]) + (C[0] - B[0]) * (A[1] - C[1]); if (Math.abs(d) < 1e-12) continue;
    const l1 = ((B[1] - C[1]) * (x - C[0]) + (C[0] - B[0]) * (y - C[1])) / d, l2 = ((C[1] - A[1]) * (x - C[0]) + (A[0] - C[0]) * (y - C[1])) / d, l3 = 1 - l1 - l2;
    if (l1 < 0 || l2 < 0 || l3 < 0) continue; const z = l1 * A[2] + l2 * B[2] + l3 * C[2]; if (z > best) best = z; }
  return best; }
for (let y = y0; y <= y1 + 1e-9; y += st) { const row = []; for (let x = x0; x <= x1 + 1e-9; x += st) row.push(front(x, y));
  const s = [...row].filter(Number.isFinite).sort((a, b) => a - b); console.log('y', y.toFixed(3), 'median', s.length ? s[s.length >> 1].toFixed(4) : '-', '|', row.map(z => Number.isFinite(z) ? z.toFixed(3) : '  -  ').join(' ')); }
