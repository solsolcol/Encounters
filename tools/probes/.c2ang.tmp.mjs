import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder } from 'meshoptimizer';
import { dequantize } from '@gltf-transform/functions';
import { Matrix4, Vector3 } from 'three';
await MeshoptDecoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({'meshopt.decoder':MeshoptDecoder});
const doc = await io.read(process.argv[2]); await doc.transform(dequantize()); const root = doc.getRoot();
const skin = root.listSkins()[0], J = skin.listJoints(), nm = J.map(j=>j.getName()), ibm = skin.getInverseBindMatrices().getArray();
const jp = n => { const i = nm.indexOf(n); const m = new Matrix4().fromArray(ibm, i*16).invert(); return new Vector3().setFromMatrixPosition(m); };
const side = process.argv[3] || 'Left', sg = side==='Left'?1:-1;
const S = jp(side+'Arm'), E = jp(side+'ForeArm'), N = jp('neck'), H = jp('Head');
const th = Math.atan2(sg*(E.x-S.x), S.y-E.y)*180/Math.PI;
console.log('shoulder', S.toArray().map(x=>x.toFixed(3)), 'elbow', E.toArray().map(x=>x.toFixed(3)), 'arm angle', th.toFixed(1), 'neck', N.toArray().map(x=>x.toFixed(3)), 'head', H.toArray().map(x=>x.toFixed(3)));
const arm = new Set([side+'Arm', side+'ForeArm', side+'Hand'].map(n=>nm.indexOf(n)));
const hist = new Map(); let headLow = 0, headLowW = 0; const hl = [];
for (const m of root.listMeshes()) for (const p of m.listPrimitives()) { const P=p.getAttribute('POSITION'), JJ=p.getAttribute('JOINTS_0'), W=p.getAttribute('WEIGHTS_0'); const v=[],a=[],b=[];
  for (let i=0;i<P.getCount();i++){ P.getElement(i,v); JJ.getElement(i,a); W.getElement(i,b);
    let as=0; for(let k=0;k<4;k++) if(arm.has(a[k])) as+=b[k];
    const hs = a.reduce((s,j,k)=>s+(nm[j]==='Head'?b[k]:0),0);
    if (hs>0.05 && v[1] < N.y && Math.hypot(v[0]-N.x, v[2]-N.z) > +(process.env.OUT||0.08)) { headLow++; headLowW += hs; if (hl.length<8) hl.push(v.map(x=>x.toFixed(3)).join(',')+' head '+hs.toFixed(2)); }
    if (sg*v[0] < 0.02 || v[1] > S.y-0.06 || v[1] < S.y-0.40) continue;
    const ang = Math.atan2(sg*(v[0]-S.x), S.y-v[1])*180/Math.PI; const bin = Math.round(ang/2)*2;
    const h = hist.get(bin)||[0,0]; h[0]++; h[1]+=as; hist.set(bin,h); } }
console.log('points with Head share > 0.05 below the neck joint and more than', process.env.OUT||0.08, 'm out from it:', headLow, 'summed', headLowW.toFixed(1), hl);
for (const [bin,h] of [...hist].sort((a,b)=>a[0]-b[0])) if (h[0]>20) console.log('  angle', String(bin).padStart(4), 'pts', String(h[0]).padStart(6), 'mean arm share', (h[1]/h[0]).toFixed(2));
