import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder } from 'meshoptimizer';
import { Matrix4, Vector3 } from 'three';
await MeshoptDecoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({'meshopt.decoder':MeshoptDecoder});
const doc = await io.read(process.argv[2]); const root = doc.getRoot();
const skin = root.listSkins()[0], J = skin.listJoints(), nm = J.map(j=>j.getName()), ibm = skin.getInverseBindMatrices().getArray();
const jp = n => new Vector3().setFromMatrixPosition(new Matrix4().fromArray(ibm, nm.indexOf(n)*16).invert());
const side = process.argv[3]||'Left', sg = side==='Left'?1:-1, S = jp(side+'Arm'), E = jp(side+'ForeArm'), C = jp(side+'Shoulder');
const u = E.clone().sub(S); const L = u.length(); u.normalize(); const out = new Vector3(sg,0,0).addScaledVector(u,-sg*u.x).normalize();
console.log(side, 'S', S.toArray().map(x=>x.toFixed(3)), 'E', E.toArray().map(x=>x.toFixed(3)), 'clav', C.toArray().map(x=>x.toFixed(3)), 'upper arm', L.toFixed(3));
const bins = new Map();
for (const m of root.listMeshes()) for (const p of m.listPrimitives()) { const P=p.getAttribute('POSITION'), JJ=p.getAttribute('JOINTS_0'), W=p.getAttribute('WEIGHTS_0'); const v=[],a=[],b=[];
  for (let i=0;i<P.getCount();i++){ P.getElement(i,v); const d=new Vector3(...v).sub(S); const t=d.dot(u)/L; if (t<-0.3||t>0.7) continue; const off=d.clone().addScaledVector(u,-t*L); const sd=off.dot(out); if (sd<=0.01) continue;
    JJ.getElement(i,a); W.getElement(i,b); const key=(Math.floor(t*10)/10).toFixed(1); const e=bins.get(key)||{n:0,s:new Map(),d:0}; e.n++; e.d+=off.length(); for(let k=0;k<4;k++) if(b[k]>0) e.s.set(nm[a[k]],(e.s.get(nm[a[k]])||0)+b[k]); bins.set(key,e);} }
for (const [k,e] of [...bins].sort((x,y)=>x[0]-y[0])) console.log(' t', k.padStart(4), 'pts', String(e.n).padStart(5), 'mean dist', (e.d/e.n).toFixed(3), [...e.s].sort((x,y)=>y[1]-x[1]).slice(0,4).map(([n,w])=>n+':'+(w/e.n).toFixed(2)).join(' '));
