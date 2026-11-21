import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder } from 'meshoptimizer';
import { Matrix4, Vector3 } from 'three';
await MeshoptDecoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({'meshopt.decoder':MeshoptDecoder});
const doc = await io.read(process.argv[2]); const root = doc.getRoot();
const skin = root.listSkins()[0], J = skin.listJoints(), nm = J.map(j=>j.getName()), ibm = skin.getInverseBindMatrices().getArray();
const jp = n => { const i = nm.indexOf(n); return new Vector3().setFromMatrixPosition(new Matrix4().fromArray(ibm, i*16).invert()); };
const side=process.argv[3]||'Left', sg=side==='Left'?1:-1, S=jp(side+'Arm'), E=jp(side+'ForeArm');
for (const n of ['Hips','Spine02','Spine01','Spine','neck',side+'Shoulder']) console.log(n, jp(n).toArray().map(x=>x.toFixed(3)).join(','));
const arm = new Set([side+'Arm', side+'ForeArm', side+'Hand'].map(n=>nm.indexOf(n)));
const rows = new Map();
for (const m of root.listMeshes()) for (const p of m.listPrimitives()) { const P=p.getAttribute('POSITION'), JJ=p.getAttribute('JOINTS_0'), W=p.getAttribute('WEIGHTS_0'); const v=[],a=[],b=[];
  for (let i=0;i<P.getCount();i++){ P.getElement(i,v); if (sg*v[0]<0.05 || v[1]>S.y || v[1]<E.y-0.05) continue; JJ.getElement(i,a); W.getElement(i,b); let as=0; for(let k=0;k<4;k++) if(arm.has(a[k])) as+=b[k];
    const y=Math.floor(v[1]/0.03)*0.03; const r=rows.get(y)||[]; r.push([sg*v[0], as, Math.atan2(sg*(v[0]-S.x), S.y-v[1])*180/Math.PI]); rows.set(y,r); } }
for (const [y,r] of [...rows].sort((a,b)=>b[0]-a[0])) { r.sort((a,b)=>a[0]-b[0]); let g=0,gi=-1; for(let i=1;i<r.length;i++){ const d=r[i][0]-r[i-1][0]; if(d>g){g=d;gi=i;} }
  const inner = r.slice(0,gi), outer = r.slice(gi); const ms = a => a.length? (a.reduce((s,x)=>s+x[1],0)/a.length).toFixed(2):'-';
  console.log('y', y.toFixed(2), 'gap', (g*100).toFixed(1)+'cm at x', gi>0? r[gi-1][0].toFixed(3)+'..'+r[gi][0].toFixed(3):'', 'angle', gi>0? r[gi-1][2].toFixed(1)+'..'+r[gi][2].toFixed(1):'', 'torso pts', inner.length, 'arm share', ms(inner), '| arm pts', outer.length, 'arm share', ms(outer)); }
