// a horizontal slab through one lock: how many strands cross it, and how is each strand built?
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
const d = await io.read(process.argv[2]);
const [Y0, Y1] = [+(process.argv[3] || -0.45), +(process.argv[4] || -0.40)];
const p = d.getRoot().listMeshes()[0].listPrimitives()[0];
const P = p.getAttribute('POSITION').getArray(), I = p.getIndices().getArray();
const nv = P.length / 3, nt = I.length / 3;
const canon = new Int32Array(nv); const m = new Map();
for (let i = 0; i < nv; i++) { const k = Math.round(P[3*i]*1e6)+','+Math.round(P[3*i+1]*1e6)+','+Math.round(P[3*i+2]*1e6); let c = m.get(k); if (c === undefined) { c = i; m.set(k, c); } canon[i] = c; }
const sel = [];
for (let t = 0; t < nt; t++) {
  let ok = true; for (let j = 0; j < 3; j++) { const v = I[3*t+j]; const x = P[3*v], y = P[3*v+1]; if (!(x < -0.45 && y >= Y0 && y <= Y1)) { ok = false; break; } }
  if (ok) sel.push(t);
}
const par = new Map(); const find = x => { let r = x; while (par.has(r) && par.get(r) !== r) r = par.get(r); return r; };
for (const t of sel) { const a = find(canon[I[3*t]]), b = find(canon[I[3*t+1]]), c = find(canon[I[3*t+2]]); par.set(a, a); par.set(b, b); par.set(c, c); if (a !== b) par.set(a, b); const b2 = find(b), c2 = find(c); if (b2 !== c2) par.set(b2, c2); }
const comp = new Map(); let elen = [];
for (const t of sel) {
  const r = find(canon[I[3*t]]); comp.set(r, (comp.get(r) || 0) + 1);
  for (const [u, w] of [[0,1],[1,2],[2,0]]) { const a = I[3*t+u]*3, b = I[3*t+w]*3; elen.push(Math.hypot(P[a]-P[b], P[a+1]-P[b+1], P[a+2]-P[b+2])); }
}
elen.sort((a,b)=>a-b);
const sizes = [...comp.values()].sort((a,b)=>b-a);
console.log('slab tris', sel.length, 'components', comp.size, 'top sizes', sizes.slice(0,10), 'median comp', sizes[Math.floor(sizes.length/2)]);
const q = f => elen[Math.floor(elen.length*f)].toFixed(5);
console.log('edge length quantiles 5/25/50/75/95/99:', q(.05), q(.25), q(.5), q(.75), q(.95), q(.99));
// a single small component's vertex positions: the cross-section shape
const small = [...comp.entries()].filter(([,n]) => n >= 6 && n <= 60).slice(0, 3);
for (const [r, n] of small) {
  const vs = new Set(); for (const t of sel) if (find(canon[I[3*t]]) === r) for (let j=0;j<3;j++) vs.add(canon[I[3*t+j]]);
  const pts = [...vs].map(v => [P[3*v], P[3*v+1], P[3*v+2]].map(x=>+x.toFixed(4)));
  console.log('comp', n, 'tris', vs.size, 'verts', JSON.stringify(pts.slice(0, 16)));
}
