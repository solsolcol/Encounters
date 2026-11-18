/* v27.0 · DOES A PROP FIT WHERE IT IS PUT? Two models placed as stand() places them (a group at x, y, z turned by ry, the
   model scaled by s), measured against each other: how many of A's points lie INSIDE B (a ray's crossings of B counted,
   odd is inside, three rays must agree) and of B's inside A, and how much of a rectangle on A (a picture: its middle,
   size and lean in A's own metres) can be seen from each eye (the segment to the eye against B's triangles).
     node tools/probes/propfit.mjs <spec.json>
   spec: { a: { file, at: [x, y, z], ry, s }, b: { ... }, pic: { y, z, w, h, rx }, eyes: [[x, y, z], ...] } */
import fs from 'node:fs';
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder } from 'meshoptimizer';
await MeshoptDecoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder });
const spec = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
function place(o, p) { const s = o.s || 1, c = Math.cos(o.ry || 0), sn = Math.sin(o.ry || 0), x = p[0] * s, y = p[1] * s, z = p[2] * s;
  return [o.at[0] + c * x + sn * z, o.at[1] + y, o.at[2] - sn * x + c * z]; }
async function load(o) { const doc = await io.read(o.file), P = [], T = [];
  for (const nd of doc.getRoot().listNodes()) { const m = nd.getMesh(); if (!m || /_far$/.test(nd.getName())) continue; const M = nd.getWorldMatrix();
    for (const pr of m.listPrimitives()) { const a = pr.getAttribute('POSITION'), ix = pr.getIndices(), v = [0, 0, 0], base = P.length;
      for (let i = 0; i < a.getCount(); i++) { a.getElement(i, v);
        P.push(place(o, [M[0] * v[0] + M[4] * v[1] + M[8] * v[2] + M[12], M[1] * v[0] + M[5] * v[1] + M[9] * v[2] + M[13], M[2] * v[0] + M[6] * v[1] + M[10] * v[2] + M[14]])); }
      const n = ix ? ix.getCount() : a.getCount(); for (let i = 0; i < n; i += 3) T.push([base + (ix ? ix.getScalar(i) : i), base + (ix ? ix.getScalar(i + 1) : i + 1), base + (ix ? ix.getScalar(i + 2) : i + 2)]); } }
  let lo = [1e9, 1e9, 1e9], hi = [-1e9, -1e9, -1e9]; for (const p of P) for (let k = 0; k < 3; k++) { lo[k] = Math.min(lo[k], p[k]); hi[k] = Math.max(hi[k], p[k]); }
  return { P, T, lo, hi }; }
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]], dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
function hit(o, d, A, B, C) { const e1 = sub(B, A), e2 = sub(C, A), p = cross(d, e2), det = dot(e1, p); if (Math.abs(det) < 1e-12) return -1;
  const iv = 1 / det, t0 = sub(o, A), u = dot(t0, p) * iv; if (u < 0 || u > 1) return -1; const q = cross(t0, e1), v = dot(d, q) * iv; if (v < 0 || u + v > 1) return -1; return dot(e2, q) * iv; }
function inside(pt, M) { if (pt[0] < M.lo[0] || pt[0] > M.hi[0] || pt[1] < M.lo[1] || pt[1] > M.hi[1] || pt[2] < M.lo[2] || pt[2] > M.hi[2]) return false;
  let votes = 0; for (const d of [[0.577, 0.577, 0.577], [-0.6, 0.48, 0.64], [0.36, -0.8, 0.48]]) { let n = 0; for (const [a, b, c] of M.T) if (hit(pt, d, M.P[a], M.P[b], M.P[c]) > 1e-6) n++; if (n % 2) votes++; }
  return votes >= 2; }
function blocked(pt, eye, M) { const d = sub(eye, pt), L = Math.hypot(...d), u = d.map(x => x / L); for (const [a, b, c] of M.T) { const t = hit(pt, u, M.P[a], M.P[b], M.P[c]); if (t > 1e-4 && t < L) return true; } return false; }
const A = await load(spec.a), B = await load(spec.b);
const near = (M, o) => M.P.filter(p => p[0] >= o.lo[0] - 0.02 && p[0] <= o.hi[0] + 0.02 && p[1] >= o.lo[1] - 0.02 && p[1] <= o.hi[1] + 0.02 && p[2] >= o.lo[2] - 0.02 && p[2] <= o.hi[2] + 0.02);
const aIn = near(A.P.length ? A : A, B).filter(p => inside(p, B)), bIn = near(B, A).filter(p => inside(p, A));
const yr = (L) => L.length ? ' heights ' + Math.min(...L.map(p => p[1])).toFixed(3) + ' to ' + Math.max(...L.map(p => p[1])).toFixed(3) : '';
console.log('A', spec.a.file.split('/').pop(), A.P.length, 'points; inside B:', aIn.length + yr(aIn), aIn.length ? '(e.g. ' + aIn.slice(0, 3).map(p => p.map(x => x.toFixed(3)).join(',')).join(' | ') + ')' : '');
console.log('B', spec.b.file.split('/').pop(), 'points near A inside A:', bIn.length + yr(bIn), bIn.length ? '(e.g. ' + bIn.slice(0, 3).map(p => p.map(x => x.toFixed(3)).join(',')).join(' | ') + ')' : '');
if (spec.pic && spec.eyes) { const pc = spec.pic, s = spec.a.s || 1, pts = [];
  for (let i = 0; i <= 8; i++) for (let j = 0; j <= 6; j++) { const lx = (i / 8 - 0.5) * pc.w, ly = (j / 6 - 0.5) * pc.h;
    const y = pc.y + ly * Math.cos(pc.rx || 0), z = pc.z + ly * Math.sin(pc.rx || 0); pts.push(place({ ...spec.a, s: 1 }, [lx * s, y * s, z * s].map((q, k) => q))); }
  for (const e of spec.eyes) { const bad = pts.filter(p => blocked(p, e, B)); console.log('eye', e.join(','), ': picture points hidden by B', bad.length, 'of', pts.length); } }
