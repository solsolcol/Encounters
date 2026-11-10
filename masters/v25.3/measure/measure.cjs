// Lersi Chin measured on his file: bind skeleton (model space), arm lengths, the elbow's hinge axis (from his own takes),
// each hand's palm-side surface (a height map), and his face's profile in the head joint's frame.
const R=require('path').resolve(__dirname,'../../../node_modules')+'/';
const {NodeIO}=require(R+'@gltf-transform/core');const {ALL_EXTENSIONS}=require(R+'@gltf-transform/extensions');
const fs=require('fs');
const xf=(m,p)=>[m[0]*p[0]+m[4]*p[1]+m[8]*p[2]+m[12],m[1]*p[0]+m[5]*p[1]+m[9]*p[2]+m[13],m[2]*p[0]+m[6]*p[1]+m[10]*p[2]+m[14]];
const xr=(m,p)=>[m[0]*p[0]+m[4]*p[1]+m[8]*p[2],m[1]*p[0]+m[5]*p[1]+m[9]*p[2],m[2]*p[0]+m[6]*p[1]+m[10]*p[2]];
const inv=(m)=>{const a=m,o=new Array(16);
  const b00=a[0]*a[5]-a[1]*a[4],b01=a[0]*a[6]-a[2]*a[4],b02=a[0]*a[7]-a[3]*a[4],b03=a[1]*a[6]-a[2]*a[5],b04=a[1]*a[7]-a[3]*a[5],b05=a[2]*a[7]-a[3]*a[6];
  const b06=a[8]*a[13]-a[9]*a[12],b07=a[8]*a[14]-a[10]*a[12],b08=a[8]*a[15]-a[11]*a[12],b09=a[9]*a[14]-a[10]*a[13],b10=a[9]*a[15]-a[11]*a[13],b11=a[10]*a[15]-a[11]*a[14];
  let det=b00*b11-b01*b10+b02*b09+b03*b08-b04*b07+b05*b06;det=1/det;
  o[0]=(a[5]*b11-a[6]*b10+a[7]*b09)*det;o[1]=(a[2]*b10-a[1]*b11-a[3]*b09)*det;o[2]=(a[13]*b05-a[14]*b04+a[15]*b03)*det;o[3]=(a[10]*b04-a[9]*b05-a[11]*b03)*det;
  o[4]=(a[6]*b08-a[4]*b11-a[7]*b07)*det;o[5]=(a[0]*b11-a[2]*b08+a[3]*b07)*det;o[6]=(a[14]*b02-a[12]*b05-a[15]*b01)*det;o[7]=(a[8]*b05-a[10]*b02+a[11]*b01)*det;
  o[8]=(a[4]*b10-a[5]*b08+a[7]*b06)*det;o[9]=(a[1]*b08-a[0]*b10-a[3]*b06)*det;o[10]=(a[12]*b04-a[13]*b02+a[15]*b00)*det;o[11]=(a[9]*b02-a[8]*b04-a[11]*b00)*det;
  o[12]=(a[5]*b07-a[4]*b09-a[6]*b06)*det;o[13]=(a[0]*b09-a[1]*b07+a[2]*b06)*det;o[14]=(a[13]*b01-a[12]*b03-a[14]*b00)*det;o[15]=(a[8]*b03-a[9]*b01+a[10]*b00)*det;return o;};
const sub=(a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]],add=(a,b)=>[a[0]+b[0],a[1]+b[1],a[2]+b[2]],mulS=(a,s)=>[a[0]*s,a[1]*s,a[2]*s];
const dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2],cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const len=(a)=>Math.hypot(a[0],a[1],a[2]),nrm=(a)=>{const l=len(a)||1;return [a[0]/l,a[1]/l,a[2]/l];};
const qmul=(a,b)=>[a[3]*b[0]+a[0]*b[3]+a[1]*b[2]-a[2]*b[1],a[3]*b[1]-a[0]*b[2]+a[1]*b[3]+a[2]*b[0],a[3]*b[2]+a[0]*b[1]-a[1]*b[0]+a[2]*b[3],a[3]*b[3]-a[0]*b[0]-a[1]*b[1]-a[2]*b[2]];
const qinv=(q)=>[-q[0],-q[1],-q[2],q[3]];
const f3=(a,n=3)=>'['+a.map(x=>x.toFixed(n)).join(', ')+']';
(async()=>{const io=new NodeIO().registerExtensions(ALL_EXTENSIONS);
try{const m=require(R+'meshoptimizer');if(m.MeshoptDecoder){await m.MeshoptDecoder.ready;io.registerDependencies({'meshopt.decoder':m.MeshoptDecoder});}}catch(e){}
const d=await io.read(process.argv[2]||R+'../assets/lersichin.glb');const root=d.getRoot();
const skin=root.listSkins()[0];const joints=skin.listJoints();const ibm=skin.getInverseBindMatrices();
const names=joints.map(j=>j.getName());
const IB=(i)=>ibm.getElement(i,[]);const J=(re)=>names.findIndex(n=>re.test(n));
const W=(i)=>inv(IB(i)),pos=(i)=>{const m=W(i);return [m[12],m[13],m[14]];};
console.log('joints',names.length+':',names.join(' '));
const out={};
// ---- the bind skeleton, model space (the mesh's own space: metres? check a height)
const key={hips:/Hips$/,spine:/Spine$/,spine1:/Spine1$/,spine2:/Spine2$/,neck:/Neck$/,head:/Head$/,headTop:/HeadTop/};
for(const sd of ['Left','Right'])for(const b of ['Shoulder','Arm','ForeArm','Hand']) key[sd+b]=new RegExp(sd+b+'$');
const B={};for(const k in key){const i=J(key[k]);B[k]=i>=0?pos(i):null;console.log(k.padEnd(14),i,B[k]?f3(B[k]):'-');}
out.bind=B;
// scale of a joint's bind matrix (is the skeleton in cm?)
{const m=W(J(/Hips$/));console.log('hips bind scale',len([m[0],m[1],m[2]]).toFixed(4));}
for(const sd of ['Left','Right']){const a=B[sd+'Arm'],e=B[sd+'ForeArm'],w=B[sd+'Hand'];
  console.log(sd,'upper',len(sub(e,a)).toFixed(4),'fore',len(sub(w,e)).toFixed(4),'u0',f3(nrm(sub(e,a))),'v0',f3(nrm(sub(w,e))),'bend deg',(Math.acos(dot(nrm(sub(e,a)),nrm(sub(w,e))))*180/Math.PI).toFixed(1));}
// ---- the elbow's hinge, from his takes: the forearm's local turn against its rest, every key of every take
const nodes=root.listNodes();
const rest={};for(const n of nodes)rest[n.getName()]=n.getRotation();
for(const sd of ['Left','Right']){
  const fn=sd+'ForeArm';let acc=[0,0,0],tot=0,maxA=0;const perTake=[];
  const node=nodes.find(n=>new RegExp(fn+'$').test(n.getName()));const q0=node.getRotation();
  for(const an of root.listAnimations()){let ta=[0,0,0],tw=0,mx=0;
    for(const ch of an.listChannels()){if(ch.getTargetNode()!==node||ch.getTargetPath()!=='rotation')continue;
      const o=ch.getSampler().getOutput();for(let i=0;i<o.getCount();i++){const q=o.getElement(i,[]);
        let dq=qmul(q,qinv(q0));if(dq[3]<0)dq=dq.map(x=>-x);const s=Math.hypot(dq[0],dq[1],dq[2]),ang=2*Math.atan2(s,dq[3]);if(s<1e-5)continue;
        let ax=[dq[0]/s,dq[1]/s,dq[2]/s];if(tw>0&&dot(ax,ta)<0){ax=mulS(ax,-1);}
        ta=add(ta,mulS(ax,ang));tw+=ang;mx=Math.max(mx,ang);}}
    if(tw>0){perTake.push([an.getName(),f3(nrm(ta)),(mx*180/Math.PI).toFixed(0)]);if(tot>0&&dot(ta,acc)<0)ta=mulS(ta,-1);acc=add(acc,ta);tot+=tw;maxA=Math.max(maxA,mx);}
  }
  const axL=nrm(acc);                                   // in the forearm's PARENT frame (the upper arm's), about the rest turn
  // to model space at bind: the upper arm's bind rotation
  const ui=J(new RegExp(sd+'Arm$'));const Um=W(ui);const axM=nrm(xr(Um,axL));
  const u0=nrm(sub(B[sd+'ForeArm'],B[sd+'Arm']));
  console.log(sd,'hinge (upper arm local)',f3(axL),'model',f3(axM),'| u0 x fwd',f3(nrm(cross(u0,[0,0,1]))),'| dot with u0',dot(axM,u0).toFixed(3),'max turn deg',(maxA*180/Math.PI).toFixed(0));
  for(const r of perTake)console.log('    ',r.join('  '));
  out['hinge'+sd]={local:axL,model:axM};
  // is the rest pose the bind pose for this joint? compare rest local rotation chain vs bind
}
// ---- each hand: the palm side as a height map. Frame: f = wrist -> HandMiddle end; n = shipped rule (thinnest axis, toward hips); x = f x n
for(const sd of ['Left','Right']){
  const hi=J(new RegExp(sd+'Hand$')),ti=J(new RegExp(sd+'HandMiddle\\d')),Hinv=IB(hi);
  const tipL=xf(Hinv,pos(ti));const fL=nrm(tipL);const sc=len(tipL)/len(sub(pos(ti),pos(hi)));  // hand-frame units per metre
  const pts=[];
  for(const mesh of root.listMeshes())for(const p of mesh.listPrimitives()){
    const P=p.getAttribute('POSITION'),Jt=p.getAttribute('JOINTS_0'),Wt=p.getAttribute('WEIGHTS_0');if(!Jt||!Wt)continue;
    for(let i=0;i<P.getCount();i++){const j=Jt.getElement(i,[]),w=Wt.getElement(i,[]);let bi=-1,bw=0;for(let c=0;c<4;c++)if(w[c]>bw){bw=w[c];bi=j[c];}
      if(bi===hi||bi===ti)pts.push(xf(Hinv,P.getElement(i,[])));}}
  // the shipped palm normal: minor axis of the spread square to f, signed toward the hips
  let c0=[0,0,0];for(const p of pts)c0=add(c0,p);c0=mulS(c0,1/pts.length);
  let u=[1,0,0];if(Math.abs(dot(u,fL))>0.9)u=[0,0,1];u=nrm(sub(u,mulS(fL,dot(u,fL))));const w2=cross(fL,u);
  let a=0,b=0,cc=0;for(const p of pts){const dv=sub(p,c0),px=dot(dv,u),py=dot(dv,w2);a+=px*px;b+=px*py;cc+=py*py;}
  const th=0.5*Math.atan2(2*b,a-cc)+Math.PI/2;let nL=nrm(add(mulS(u,Math.cos(th)),mulS(w2,Math.sin(th))));
  if(dot(nL,xf(Hinv,pos(J(/Hips$/))))<0)nL=mulS(nL,-1);
  const xL=cross(fL,nL);
  // coordinates in cm: s along the fingers, w across (xL), h out of the palm (nL)
  const C=pts.map(p=>[dot(p,fL)/sc*100,dot(p,xL)/sc*100,dot(p,nL)/sc*100]);
  const sMax=Math.max(...C.map(c=>c[0])),wMin=Math.min(...C.map(c=>c[1])),wMax=Math.max(...C.map(c=>c[1]));
  console.log('\n'+sd,'hand: verts',pts.length,'length',sMax.toFixed(1),'cm, across',wMin.toFixed(1),'..',wMax.toFixed(1),'| thumb side is',(()=>{ // the thumb: the lobe that ends short of the fingertips
    const hiW=C.filter(c=>c[1]>wMax-2).map(c=>c[0]),loW=C.filter(c=>c[1]<wMin+2).map(c=>c[0]);return Math.max(...hiW)<Math.max(...loW)?'+w':'-w';})());
  // height map: rows s (1 cm), cols w (1 cm): the palm side's highest h, and the back's lowest
  const grid={};for(const c of C){const k=Math.floor(c[0])+','+Math.floor(c[1]);const g=grid[k]||(grid[k]=[-1e9,1e9]);g[0]=Math.max(g[0],c[2]);g[1]=Math.min(g[1],c[2]);}
  const w0=Math.floor(wMin),w1=Math.floor(wMax);
  console.log('palm-side height (cm) by s (rows, from the wrist) and w (cols '+w0+'..'+w1+')');
  for(let s=-1;s<=Math.floor(sMax);s++){let row=String(s).padStart(3)+' |';for(let w=w0;w<=w1;w++){const g=grid[s+','+w];row+=g?(g[0]>=0?' ':'')+g[0].toFixed(1).padStart(4):'    .';}console.log(row);}
  console.log('back-side height (cm)');
  for(let s=-1;s<=Math.floor(sMax);s++){let row=String(s).padStart(3)+' |';for(let w=w0;w<=w1;w++){const g=grid[s+','+w];row+=g?(g[1]>=0?' ':'')+g[1].toFixed(1).padStart(4):'    .';}console.log(row);}
  out['hand'+sd]={fL,nL,xL,sc,C};
}
// ---- his face in the head joint's frame: model forward (+z) and up (+y) at bind; the profile along the midline
{const hi=J(/Head$/),ti=J(/HeadTop/),ni=J(/Neck$/),Hinv=IB(hi);const hp=pos(hi);
  const pts=[];
  for(const mesh of root.listMeshes())for(const p of mesh.listPrimitives()){
    const P=p.getAttribute('POSITION'),Jt=p.getAttribute('JOINTS_0'),Wt=p.getAttribute('WEIGHTS_0');if(!Jt||!Wt)continue;
    for(let i=0;i<P.getCount();i++){const j=Jt.getElement(i,[]),w=Wt.getElement(i,[]);let bi=-1,bw=0;for(let c=0;c<4;c++)if(w[c]>bw){bw=w[c];bi=j[c];}
      if(bi===hi||bi===ti||bi===ni)pts.push(sub(P.getElement(i,[]),hp));}}
  // metres from the head joint, model axes (x his left, y up, z forward)
  console.log('\nhead joint at',f3(hp),'verts',pts.length,'| model height (max y of all)',(()=>{let m=-1e9;for(const mesh of root.listMeshes())for(const p of mesh.listPrimitives()){const P=p.getAttribute('POSITION');for(let i=0;i<P.getCount();i++)m=Math.max(m,P.getElement(i,[])[1]);}return m.toFixed(3);})());
  console.log('profile on the midline (|x| < 1.2 cm): y (cm above the head joint) -> most forward z (cm)');
  const prof=[];
  for(let y=-10;y<=22;y+=1){let mz=-1e9,mb=1e9;for(const p of pts){if(Math.abs(p[0])<0.012&&p[1]*100>=y&&p[1]*100<y+1){mz=Math.max(mz,p[2]*100);mb=Math.min(mb,p[2]*100);}}
    if(mz>-1e8){prof.push([y,mz]);console.log(String(y).padStart(4),mz.toFixed(1).padStart(6),'  back',mb.toFixed(1).padStart(6),' '+'#'.repeat(Math.max(0,Math.round(mz*2))));}}
  // half-width of the face by height (for the cheeks: where hands at the face would touch)
  out.head={joint:hp,prof};
}
fs.writeFileSync(process.argv[3]||'measure.json',JSON.stringify(out));
})();
