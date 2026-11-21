import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder } from 'meshoptimizer';
await MeshoptDecoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({'meshopt.decoder':MeshoptDecoder});
const doc = await io.read(process.argv[2]); const root = doc.getRoot();
const J = root.listSkins()[0].listJoints(); const name=J.map(j=>j.getName());
const H = +process.argv[3]; // height scale vs 1.77
const boxes = JSON.parse(process.argv[4]);
for (const [label, bx] of Object.entries(boxes)) {
  const share=new Map(); let n=0;
  for (const m of root.listMeshes()) for (const p of m.listPrimitives()) {
    const pos=p.getAttribute('POSITION'), jj=p.getAttribute('JOINTS_0'), ww=p.getAttribute('WEIGHTS_0'); const a=[],b=[],q=[];
    for (let v=0; v<pos.getCount(); v++){ pos.getElement(v,q); const x=q[0]/H,y=q[1]/H,z=q[2]/H;
      if(x<bx[0]||x>bx[1]||y<bx[2]||y>bx[3]||z<bx[4]||z>bx[5]) continue; jj.getElement(v,a); ww.getElement(v,b); n++;
      for(let k=0;k<4;k++) if(b[k]>0) share.set(name[a[k]], (share.get(name[a[k]])||0)+b[k]); }
  }
  console.log(label, n, [...share].sort((a,b)=>b[1]-a[1]).slice(0,6).map(([k,v])=>k+':'+(v/n).toFixed(2)).join(' '));
}
