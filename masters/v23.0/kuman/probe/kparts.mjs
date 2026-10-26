// kuman2: connected components over POSITION-welded vertices; report the parts
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder } from 'meshoptimizer';
import fs from 'node:fs';
await MeshoptDecoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder });
const d = await io.read(process.argv[2]);
const p = d.getRoot().listMeshes()[0].listPrimitives()[0];
const P = p.getAttribute('POSITION').getArray(), I = p.getIndices().getArray();
const UV = p.getAttribute('TEXCOORD_0').getArray();
const nv = P.length / 3, nt = I.length / 3;
console.log('verts', nv, 'tris', nt);
// weld by position (1e-6 grid)
const canon = new Int32Array(nv); const m = new Map();
for (let i = 0; i < nv; i++) { const k = Math.round(P[3*i]*1e6)+','+Math.round(P[3*i+1]*1e6)+','+Math.round(P[3*i+2]*1e6); let c = m.get(k); if (c === undefined) { c = i; m.set(k, c); } canon[i] = c; }
console.log('unique positions', m.size);
const par = new Int32Array(nv); for (let i = 0; i < nv; i++) par[i] = i;
const find = x => { while (par[x] !== x) { par[x] = par[par[x]]; x = par[x]; } return x; };
const uni = (a, b) => { a = find(a); b = find(b); if (a !== b) par[a] = b; };
for (let t = 0; t < nt; t++) { const a = canon[I[3*t]], b = canon[I[3*t+1]], c = canon[I[3*t+2]]; uni(a, b); uni(a, c); }
const comp = new Map();
for (let t = 0; t < nt; t++) {
  const r = find(canon[I[3*t]]); let o = comp.get(r);
  if (!o) { o = { tris: 0, mn: [1e9,1e9,1e9], mx: [-1e9,-1e9,-1e9], uvmn:[9,9], uvmx:[-9,-9] }; comp.set(r, o); }
  o.tris++;
  for (let j = 0; j < 3; j++) { const v = I[3*t+j]; for (let k = 0; k < 3; k++) { const x = P[3*v+k]; if (x < o.mn[k]) o.mn[k] = x; if (x > o.mx[k]) o.mx[k] = x; } for (let k=0;k<2;k++){const u=UV[2*v+k]; if(u<o.uvmn[k])o.uvmn[k]=u; if(u>o.uvmx[k])o.uvmx[k]=u;} }
}
const arr = [...comp.entries()].map(([r, o]) => ({ r, ...o, size: o.mx.map((x, k) => x - o.mn[k]), c: o.mx.map((x, k) => (x + o.mn[k]) / 2) })).sort((a, b) => b.tris - a.tris);
console.log('components', arr.length);
const f = v => v.map(x => x.toFixed(3)).join(',');
for (const o of arr.slice(0, 40)) console.log(o.tris, 'c', f(o.c), 'size', f(o.size), 'uv', f(o.uvmn), '..', f(o.uvmx));
// histogram of the rest by tri count
const bins = [[1,10],[11,50],[51,200],[201,1000],[1001,5000],[5001,20000],[20001,1e9]];
for (const [a,b] of bins) { const s = arr.filter(o=>o.tris>=a&&o.tris<=b); console.log(`  ${a}-${b}: ${s.length} comps, ${s.reduce((x,o)=>x+o.tris,0)} tris`); }
fs.writeFileSync(process.argv[3], JSON.stringify(arr.map(o => ({ tris: o.tris, c: o.c, size: o.size, mn: o.mn, mx: o.mx, uvmn: o.uvmn, uvmx: o.uvmx }))));
