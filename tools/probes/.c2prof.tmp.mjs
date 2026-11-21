import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder } from 'meshoptimizer';
await MeshoptDecoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({'meshopt.decoder':MeshoptDecoder});
const doc = await io.read(process.argv[2]); const root = doc.getRoot(); const [x0,x1,y0,y1] = process.argv[3].split(',').map(Number); const zs = +process.argv[4] || 1;
const P = root.listMeshes()[0].listPrimitives()[0].getAttribute('POSITION'); const v=[]; let lo=1e9, hi=-1e9; for(let i=0;i<P.getCount();i++){P.getElement(i,v); lo=Math.min(lo,v[1]); hi=Math.max(hi,v[1]);}
console.log('y range', lo.toFixed(3), hi.toFixed(3));
const rows=new Map(); for(let i=0;i<P.getCount();i++){P.getElement(i,v); if(v[0]<x0||v[0]>x1||v[1]<y0||v[1]>y1||v[2]*zs<0) continue; const b=Math.round(v[1]*500)/500; const r=rows.get(b)||[]; r.push(v[2]*zs); rows.set(b,r);}
for(const [y,r] of [...rows].sort((a,b)=>b[0]-a[0])) console.log(y.toFixed(3), 'n', String(r.length).padStart(3), 'z max', Math.max(...r).toFixed(4), 'min', Math.min(...r).toFixed(4));
