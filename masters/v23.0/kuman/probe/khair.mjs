// the hair: components among triangles whose centroid lies in the locks' region (|x| > X0)
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
const d = await io.read(process.argv[2]);
const X0 = +(process.argv[3] || 0.42);
const p = d.getRoot().listMeshes()[0].listPrimitives()[0];
const P = p.getAttribute('POSITION').getArray(), I = p.getIndices().getArray();
const nv = P.length / 3, nt = I.length / 3;
const canon = new Int32Array(nv); const m = new Map();
for (let i = 0; i < nv; i++) { const k = Math.round(P[3*i]*1e6)+','+Math.round(P[3*i+1]*1e6)+','+Math.round(P[3*i+2]*1e6); let c = m.get(k); if (c === undefined) { c = i; m.set(k, c); } canon[i] = c; }
const par = new Int32Array(nv); for (let i = 0; i < nv; i++) par[i] = i;
const find = x => { while (par[x] !== x) { par[x] = par[par[x]]; x = par[x]; } return x; };
const inH = new Uint8Array(nt); let nh = 0;
for (let t = 0; t < nt; t++) { const a = I[3*t]*3, b = I[3*t+1]*3, c = I[3*t+2]*3; const cx = (P[a]+P[b]+P[c])/3; if (Math.abs(cx) > X0) { inH[t] = 1; nh++; } }
for (let t = 0; t < nt; t++) if (inH[t]) { const a = find(canon[I[3*t]]), b = find(canon[I[3*t+1]]), c = find(canon[I[3*t+2]]); if (a !== b) par[a] = b; const b2 = find(b), c2 = find(c); if (b2 !== c2) par[b2] = c2; }
const comp = new Map();
for (let t = 0; t < nt; t++) if (inH[t]) {
  const r = find(canon[I[3*t]]); let o = comp.get(r);
  if (!o) { o = { tris: 0, mn: [1e9,1e9,1e9], mx: [-1e9,-1e9,-1e9] }; comp.set(r, o); }
  o.tris++;
  for (let j = 0; j < 3; j++) { const v = I[3*t+j]; for (let k = 0; k < 3; k++) { const x = P[3*v+k]; if (x < o.mn[k]) o.mn[k] = x; if (x > o.mx[k]) o.mx[k] = x; } }
}
const arr = [...comp.values()].map(o => ({ ...o, size: o.mx.map((x, k) => x - o.mn[k]) })).sort((a, b) => b.tris - a.tris);
console.log('hair-region tris', nh, 'components', arr.length);
const f = v => v.map(x => x.toFixed(3)).join(',');
for (const o of arr.slice(0, 15)) console.log(o.tris, 'mn', f(o.mn), 'size', f(o.size));
const bins = [[1,10],[11,50],[51,200],[201,1000],[1001,5000],[5001,20000],[20001,1e9]];
for (const [a,b] of bins) { const s = arr.filter(o=>o.tris>=a&&o.tris<=b); console.log(`  ${a}-${b}: ${s.length} comps, ${s.reduce((x,o)=>x+o.tris,0)} tris, mean ysize ${(s.reduce((x,o)=>x+o.size[1],0)/Math.max(1,s.length)).toFixed(3)}`); }
