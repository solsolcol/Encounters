/* v29.0 (E5C1 THINGS-3, Chad's R15 "Also check for all kinds of clipping"): a made thing measured for faces that share a
   plane (v19.3: they flicker) and for its ground. Its triangles are split into PARTS (connected by shared points); every
   pair of triangles from two different parts that lie in one plane (normals within 2 degrees, the planes within 0.3 mm)
   and OVERLAP there by more than 1 mm^2 is a pair. Same-facing pairs flicker (FLICKER); back-to-back pairs are hidden
   inside the thing and listed apart (HIDDEN). Also: the lowest point (its base on y 0), the footprint and the height.
     node masters/v29.0/props/code/coplanar.mjs <file.glb> [...]   (exits 1 on any FLICKER or a base off y 0) */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder } from 'meshoptimizer';
await MeshoptDecoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder });
let bad = 0;
for (const f of process.argv.slice(2)) {
  const doc = await io.read(f); const P = [], T = [];
  for (const n of doc.getRoot().listNodes()) { const m = n.getMesh(); if (!m) continue; const W = n.getWorldMatrix();
    for (const p of m.listPrimitives()) { const a = p.getAttribute('POSITION'), base = P.length, v = [];
      for (let i = 0; i < a.getCount(); i++) { a.getElement(i, v); const [x, y, z] = v; P.push([W[0]*x+W[4]*y+W[8]*z+W[12], W[1]*x+W[5]*y+W[9]*z+W[13], W[2]*x+W[6]*y+W[10]*z+W[14]]); }
      const ix = p.getIndices(); const N = ix ? ix.getCount() : a.getCount();
      for (let i = 0; i < N; i += 3) T.push([0, 1, 2].map(k => base + (ix ? ix.getScalar(i + k) : i + k))); } }
  // weld by position (0.01 mm) so a part's UV seams do not split it
  const key = (p) => p.map(v => Math.round(v * 1e5)).join(','), id = new Map(), wid = P.map(p => { const k = key(p); if (!id.has(k)) id.set(k, id.size); return id.get(k); });
  const par = Array.from({ length: id.size }, (_, i) => i), find = (i) => { while (par[i] !== i) { par[i] = par[par[i]]; i = par[i]; } return i; };
  for (const t of T) { const a = find(wid[t[0]]); for (const k of [1, 2]) { const b = find(wid[t[k]]); if (a !== b) par[b] = a; } }
  const part = T.map(t => find(wid[t[0]]));
  const nparts = new Set(part).size;
  // each triangle's plane, its area; bucket by quantized plane
  const tri = T.map((t, i) => { const [a, b, c] = t.map(j => P[j]); const u = [b[0]-a[0], b[1]-a[1], b[2]-a[2]], v = [c[0]-a[0], c[1]-a[1], c[2]-a[2]];
    let n = [u[1]*v[2]-u[2]*v[1], u[2]*v[0]-u[0]*v[2], u[0]*v[1]-u[1]*v[0]]; const L = Math.hypot(...n); if (L < 1e-12) return null; n = n.map(x => x / L);
    return { i, a, b, c, n, d: n[0]*a[0]+n[1]*a[1]+n[2]*a[2], area: L / 2 }; }).filter(Boolean);
  const buckets = new Map();
  for (const t of tri) { // canonical direction so back-to-back faces share a bucket
    const s = (t.n[0] > 1e-6 || (Math.abs(t.n[0]) <= 1e-6 && (t.n[1] > 1e-6 || (Math.abs(t.n[1]) <= 1e-6 && t.n[2] > 0)))) ? 1 : -1;
    const cn = t.n.map(x => x * s), cd = t.d * s;
    const k = cn.map(x => Math.round(x * 30)).join(',') + '|' + Math.round(cd / 0.0006);
    if (!buckets.has(k)) buckets.set(k, []); buckets.get(k).push(t); }
  // 2D overlap of two coplanar triangles: clip one by the other (Sutherland-Hodgman) in the plane's own axes
  const area2 = (poly) => { let s = 0; for (let i = 0; i < poly.length; i++) { const p = poly[i], q = poly[(i + 1) % poly.length]; s += p[0]*q[1]-q[0]*p[1]; } return Math.abs(s) / 2; };
  const clip = (subj, cl) => { let out = subj; const orient = Math.sign((cl[1][0]-cl[0][0])*(cl[2][1]-cl[0][1])-(cl[1][1]-cl[0][1])*(cl[2][0]-cl[0][0])) || 1;
    for (let e = 0; e < 3 && out.length; e++) { const A = cl[e], B = cl[(e + 1) % 3], inp = out; out = [];
      const side = (p) => orient * ((B[0]-A[0])*(p[1]-A[1])-(B[1]-A[1])*(p[0]-A[0]));
      for (let i = 0; i < inp.length; i++) { const p = inp[i], q = inp[(i + 1) % inp.length], sp = side(p), sq = side(q);
        if (sp >= 0) out.push(p); if ((sp >= 0) !== (sq >= 0)) { const t = sp / (sp - sq); out.push([p[0]+t*(q[0]-p[0]), p[1]+t*(q[1]-p[1])]); } } }
    return out; };
  const flick = [], hidden = [];
  for (const [, L] of buckets) { if (L.length < 2) continue;
    for (let x = 0; x < L.length; x++) for (let y = x + 1; y < L.length; y++) { const s = L[x], t = L[y]; if (part[s.i] === part[t.i]) continue;
      const dot = s.n[0]*t.n[0]+s.n[1]*t.n[1]+s.n[2]*t.n[2]; if (Math.abs(dot) < 0.9994) continue;
      if (Math.abs(s.d - Math.sign(dot) * t.d) > 0.0003) continue;
      // the plane's axes
      const n = s.n, ax = Math.abs(n[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0];
      let u = [n[1]*ax[2]-n[2]*ax[1], n[2]*ax[0]-n[0]*ax[2], n[0]*ax[1]-n[1]*ax[0]]; const lu = Math.hypot(...u); u = u.map(q => q / lu);
      const w = [n[1]*u[2]-n[2]*u[1], n[2]*u[0]-n[0]*u[2], n[0]*u[1]-n[1]*u[0]];
      const to2 = (p) => [p[0]*u[0]+p[1]*u[1]+p[2]*u[2], p[0]*w[0]+p[1]*w[1]+p[2]*w[2]];
      const A = [s.a, s.b, s.c].map(to2), B = [t.a, t.b, t.c].map(to2);
      const ov = area2(clip(A, B)); if (ov < 1e-6) continue;
      (dot > 0 ? flick : hidden).push({ at: s.a.map(v => +v.toFixed(3)), n: s.n.map(v => +v.toFixed(2)), ov: +(ov * 1e6).toFixed(1), parts: [part[s.i], part[t.i]] }); } }
  let lo = [1e9, 1e9, 1e9], hi = [-1e9, -1e9, -1e9]; for (const p of P) for (let k = 0; k < 3; k++) { lo[k] = Math.min(lo[k], p[k]); hi[k] = Math.max(hi[k], p[k]); }
  const flickArea = flick.reduce((s, q) => s + q.ov, 0);
  console.log(f.split('/').pop(), `parts ${nparts}  base y ${lo[1].toFixed(4)}  footprint ${(hi[0]-lo[0]).toFixed(3)} x ${(hi[2]-lo[2]).toFixed(3)} (x ${lo[0].toFixed(3)}..${hi[0].toFixed(3)}, z ${lo[2].toFixed(3)}..${hi[2].toFixed(3)})  height ${(hi[1]-lo[1]).toFixed(3)}  FLICKER ${flick.length} pairs ${flickArea.toFixed(0)} mm2  HIDDEN ${hidden.length}`);
  const ext = new Map(); T.forEach((t, i) => { const k = part[i]; let e = ext.get(k); if (!e) { e = [[1e9,1e9,1e9],[-1e9,-1e9,-1e9]]; ext.set(k, e); } for (const j of t) for (let q = 0; q < 3; q++) { e[0][q] = Math.min(e[0][q], P[j][q]); e[1][q] = Math.max(e[1][q], P[j][q]); } });
  const fmt = (k) => { const e = ext.get(k); return '[' + e[0].map(v => v.toFixed(3)).join(',') + ' .. ' + e[1].map(v => v.toFixed(3)).join(',') + ']'; };
  const seen = new Set();
  for (const q of flick) { const key2 = q.parts.slice().sort().join('-'); if (seen.has(key2)) continue; seen.add(key2); if (seen.size > 10) break;
    console.log('   FLICKER at', q.at.join(','), 'n', q.n.join(','), q.ov, 'mm2; parts', fmt(q.parts[0]), fmt(q.parts[1])); }
  if (flick.length || Math.abs(lo[1]) > 0.0005) bad++;
}
process.exit(bad ? 1 : 0);
