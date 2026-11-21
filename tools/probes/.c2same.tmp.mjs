import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder } from 'meshoptimizer';
await MeshoptDecoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({'meshopt.decoder':MeshoptDecoder});
const [aF, aN, bF, bN] = process.argv.slice(2);
const get = async (f, n) => { const d = await io.read(f); const an = d.getRoot().listAnimations().find(x => x.getName() === n); const m = new Map();
  for (const ch of an.listChannels()) if (ch.getTargetPath()==='rotation') m.set(ch.getTargetNode().getName(), { t: ch.getSampler().getInput().getArray(), v: ch.getSampler().getOutput().getArray() }); return m; };
const A = await get(aF, aN), B = await get(bF, bN);
const at = (tr, time) => { const {t,v}=tr; let i=0; while(i<t.length-2 && t[i+1]<time) i++; const k=t.length>1?Math.min(1,Math.max(0,(time-t[i])/((t[i+1]-t[i])||1))):0; const a=[...v.slice(i*4,i*4+4)], b=t.length>1?[...v.slice(i*4+4,i*4+8)]:a; const s=(a[0]*b[0]+a[1]*b[1]+a[2]*b[2]+a[3]*b[3])<0?-1:1; const q=a.map((x,j)=>x+(b[j]*s-x)*k); const l=Math.hypot(...q); return q.map(x=>x/l); };
let worst = 0, wn = '';
for (const [n, tb] of B) { const ta = A.get(n); if (!ta) continue; for (const time of tb.t) { const p = at(ta, time), q = at(tb, time); const d = Math.abs(p[0]*q[0]+p[1]*q[1]+p[2]*q[2]+p[3]*q[3]); const ang = 2*Math.acos(Math.min(1,d))*180/Math.PI; if (ang > worst) { worst = ang; wn = n + '@' + time.toFixed(2); } } }
console.log('bones compared', [...B.keys()].filter(n=>A.has(n)).length, 'largest difference', worst.toFixed(4), 'deg at', wn);
