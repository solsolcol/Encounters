// the elbow's hinge: every key of every take, the forearm's own line (elbow -> wrist) in the upper arm's frame; a hinge
// keeps that line in one plane through the elbow, and the plane's normal is the hinge. Also: the range of flexion, and
// the forearm's twist about its own line in each key (how far the takes themselves roll it).
const R=require('path').resolve(__dirname,'../../../node_modules')+'/';
const {NodeIO}=require(R+'@gltf-transform/core');const {ALL_EXTENSIONS}=require(R+'@gltf-transform/extensions');
const dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2],cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const len=(a)=>Math.hypot(a[0],a[1],a[2]),nrm=(a)=>{const l=len(a)||1;return [a[0]/l,a[1]/l,a[2]/l];};
const qrot=(q,v)=>{const [x,y,z,w]=q;const ix=w*v[0]+y*v[2]-z*v[1],iy=w*v[1]+z*v[0]-x*v[2],iz=w*v[2]+x*v[1]-y*v[0],iw=-x*v[0]-y*v[1]-z*v[2];
  return [ix*w+iw*-x+iy*-z-iz*-y,iy*w+iw*-y+iz*-x-ix*-z,iz*w+iw*-z+ix*-y-iy*-x];};
const f3=(a,n=3)=>'['+a.map(x=>x.toFixed(n)).join(', ')+']';
function eig3(A){ // symmetric 3x3: smallest eigenvector by Jacobi
  let V=[[1,0,0],[0,1,0],[0,0,1]];A=A.map(r=>r.slice());
  for(let it=0;it<60;it++){let p=0,q=1,m=Math.abs(A[0][1]);if(Math.abs(A[0][2])>m){m=Math.abs(A[0][2]);p=0;q=2;}if(Math.abs(A[1][2])>m){m=Math.abs(A[1][2]);p=1;q=2;}
    if(m<1e-14)break;const th=0.5*Math.atan2(2*A[p][q],A[q][q]-A[p][p]),c=Math.cos(th),s=Math.sin(th);
    for(let k=0;k<3;k++){const a=A[k][p],b=A[k][q];A[k][p]=c*a-s*b;A[k][q]=s*a+c*b;}
    for(let k=0;k<3;k++){const a=A[p][k],b=A[q][k];A[p][k]=c*a-s*b;A[q][k]=s*a+c*b;}
    for(let k=0;k<3;k++){const a=V[k][p],b=V[k][q];V[k][p]=c*a-s*b;V[k][q]=s*a+c*b;}}
  const ev=[A[0][0],A[1][1],A[2][2]];let i=0;if(ev[1]<ev[i])i=1;if(ev[2]<ev[i])i=2;return {vec:[V[0][i],V[1][i],V[2][i]],vals:ev};}
(async()=>{const io=new NodeIO().registerExtensions(ALL_EXTENSIONS);
const m=require(R+'meshoptimizer');await m.MeshoptDecoder.ready;io.registerDependencies({'meshopt.decoder':m.MeshoptDecoder});
const d=await io.read(process.argv[2]);const root=d.getRoot();const nodes=root.listNodes();
for(const sd of ['Left','Right']){
  const fore=nodes.find(n=>new RegExp(sd+'ForeArm$').test(n.getName())),hand=nodes.find(n=>new RegExp(sd+'Hand$').test(n.getName())),up=nodes.find(n=>new RegExp(sd+'Arm$').test(n.getName()));
  const vL=nrm(hand.getTranslation()),uL=nrm(fore.getTranslation());          // the forearm's line in its own frame; the upper arm's in its own
  const q0=fore.getRotation(),v0=qrot(q0,vL);
  console.log(sd,'upper arm line (own frame)',f3(uL),'forearm line (own frame)',f3(vL),'rest: forearm line in the upper arm frame',f3(v0),'rest bend deg',(Math.acos(dot(uL,v0))*180/Math.PI).toFixed(1));
  const S=[[0,0,0],[0,0,0],[0,0,0]];let n=0;const per=[];let fmin=1e9,fmax=-1e9;
  for(const an of root.listAnimations()){const s=[[0,0,0],[0,0,0],[0,0,0]];let k=0,a0=1e9,a1=-1e9;
    for(const ch of an.listChannels()){if(ch.getTargetNode()!==fore||ch.getTargetPath()!=='rotation')continue;
      const o=ch.getSampler().getOutput();for(let i=0;i<o.getCount();i++){const v=qrot(o.getElement(i,[]),vL);
        for(let r=0;r<3;r++)for(let c=0;c<3;c++){s[r][c]+=v[r]*v[c];S[r][c]+=v[r]*v[c];}k++;n++;
        const fl=Math.acos(Math.max(-1,Math.min(1,dot(uL,v))))*180/Math.PI;a0=Math.min(a0,fl);a1=Math.max(a1,fl);}}
    if(k){const e=eig3(s);let h=e.vec;per.push([an.getName().padEnd(34),f3(h),'flex',a0.toFixed(0)+'..'+a1.toFixed(0),'out-of-plane rms deg',(Math.asin(Math.sqrt(Math.max(0,Math.min(...e.vals))/k))*180/Math.PI).toFixed(1)]);fmin=Math.min(fmin,a0);fmax=Math.max(fmax,a1);}
  }
  const E=eig3(S);let h=E.vec;
  // sign: positive turn about h takes the upper arm's line toward the flexed forearm
  // pick the most-flexed sample's direction to sign it
  console.log(sd,'HINGE in the upper arm frame',f3(h),'| angle to the upper arm line',(Math.acos(Math.abs(dot(h,uL)))*180/Math.PI).toFixed(1),'| out-of-plane rms deg',(Math.asin(Math.sqrt(Math.max(0,Math.min(...E.vals))/n))*180/Math.PI).toFixed(1),'| flexion range over all takes',fmin.toFixed(0)+'..'+fmax.toFixed(0));
  for(const r of per)console.log('    ',r.join('  '));
}
})();
