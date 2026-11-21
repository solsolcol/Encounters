import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder } from 'meshoptimizer';
await MeshoptDecoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({'meshopt.decoder':MeshoptDecoder});
const doc = await io.read(process.argv[2]); const root = doc.getRoot();
const J = root.listSkins()[0].listJoints(); const name=J.map(j=>j.getName());
const want = new RegExp(process.argv[3]);
const st=new Map();
for (const m of root.listMeshes()) for (const p of m.listPrimitives()) {
  const pos=p.getAttribute('POSITION'), jj=p.getAttribute('JOINTS_0'), ww=p.getAttribute('WEIGHTS_0'); const a=[],b=[],q=[];
  for (let v=0; v<pos.getCount(); v++){ jj.getElement(v,a); ww.getElement(v,b); pos.getElement(v,q);
    let bi=0; for(let k=1;k<4;k++) if(b[k]>b[bi]) bi=k; const n=name[a[bi]]; if(!want.test(n)) continue;
    const s=st.get(n)||{n:0,mn:[9,9,9],mx:[-9,-9,-9],h:new Map()}; s.n++; for(let k=0;k<3;k++){s.mn[k]=Math.min(s.mn[k],q[k]);s.mx[k]=Math.max(s.mx[k],q[k]);}
    // histogram by 4cm y bins of x extents
    const yb=Math.round(q[1]*25)/25; const h=s.h.get(yb)||[9,-9,0]; h[0]=Math.min(h[0],q[0]); h[1]=Math.max(h[1],q[0]); h[2]++; s.h.set(yb,h); st.set(n,s);}
}
for (const [n,s] of st){ console.log(n,s.n,'x',s.mn[0].toFixed(2),s.mx[0].toFixed(2),'y',s.mn[1].toFixed(2),s.mx[1].toFixed(2),'z',s.mn[2].toFixed(2),s.mx[2].toFixed(2));
 if(process.argv[4]) for(const [y,h] of [...s.h].sort((a,b)=>b[0]-a[0])) console.log('   y',y.toFixed(2),'x',h[0].toFixed(3),h[1].toFixed(3),'n',h[2]); }
