// each key of each take: the forearm joint's turn = flexion about the hinge x a roll about its own line (phi); and the
// hand joint's turn against the forearm, as bend (the hand's line off the forearm's) and roll about its own line
const R=require('path').resolve(__dirname,'../../../node_modules')+'/';
const {NodeIO}=require(R+'@gltf-transform/core');const {ALL_EXTENSIONS}=require(R+'@gltf-transform/extensions');
const dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
const qmul=(a,b)=>[a[3]*b[0]+a[0]*b[3]+a[1]*b[2]-a[2]*b[1],a[3]*b[1]-a[0]*b[2]+a[1]*b[3]+a[2]*b[0],a[3]*b[2]+a[0]*b[1]-a[1]*b[0]+a[2]*b[3],a[3]*b[3]-a[0]*b[0]-a[1]*b[1]-a[2]*b[2]];
const qinv=(q)=>[-q[0],-q[1],-q[2],q[3]];const qax=(ax,an)=>{const s=Math.sin(an/2);return [ax[0]*s,ax[1]*s,ax[2]*s,Math.cos(an/2)];};
const qrot=(q,v)=>{const p=qmul(qmul(q,[v[0],v[1],v[2],0]),qinv(q));return [p[0],p[1],p[2]];};
const D=180/Math.PI;const HL={Left:[0.740,0,-0.672],Right:[0.734,0,0.679]};
(async()=>{const io=new NodeIO().registerExtensions(ALL_EXTENSIONS);
const m=require(R+'meshoptimizer');await m.MeshoptDecoder.ready;io.registerDependencies({'meshopt.decoder':m.MeshoptDecoder});
const d=await io.read(process.argv[2]);const root=d.getRoot();const nodes=root.listNodes();
for(const sd of ['Left','Right']){
  const fore=nodes.find(n=>new RegExp(sd+'ForeArm$').test(n.getName())),hand=nodes.find(n=>new RegExp(sd+'Hand$').test(n.getName()));
  const hl=HL[sd],l=Math.hypot(...hl),h=hl.map(x=>x/l);
  const sgn=(()=>{ // flexion's sign: the most flexed key of all
    let best=0,s=1;for(const an of root.listAnimations())for(const ch of an.listChannels()){if(ch.getTargetNode()!==fore||ch.getTargetPath()!=='rotation')continue;const o=ch.getSampler().getOutput();
      for(let i=0;i<o.getCount();i++){const v=qrot(o.getElement(i,[]),[0,1,0]);const fl=Math.acos(Math.max(-1,Math.min(1,v[1])));if(fl>best){best=fl;const c=[h[1]*0-h[2]*1,h[2]*0-h[0]*0,h[0]*1-h[1]*0];s=dot(c,v)>0?1:-1;}}}return s;})();
  console.log(sd,'flexion is',sgn>0?'+':'-','about the hinge',JSON.stringify(h.map(x=>+x.toFixed(3))));
  const restF=fore.getRotation(),restH=hand.getRotation();
  const dec=(q)=>{const v=qrot(q,[0,1,0]);const th=sgn*Math.acos(Math.max(-1,Math.min(1,v[1])));const tw=qmul(qinv(qax(h,th)),q);return [Math.abs(th)*D,2*Math.atan2(tw[1],tw[3])*D,Math.hypot(tw[0],tw[2])];};
  const hd=(q)=>{const v=qrot(q,[0,1,0]);const bend=Math.acos(Math.max(-1,Math.min(1,v[1])))*D;const roll=2*Math.atan2(q[1],q[3])*D;return [bend,((roll+540)%360)-180,Math.atan2(v[0],v[2])*D];};
  const r0=dec(restF),h0=hd(restH);
  console.log('  rest: forearm flex',r0[0].toFixed(0),'roll',r0[1].toFixed(0),'(residue',r0[2].toFixed(2)+') | hand bend',h0[0].toFixed(0),'roll',h0[1].toFixed(0),'bend dir',h0[2].toFixed(0));
  for(const an of root.listAnimations()){let F=[],H=[];
    for(const ch of an.listChannels()){if(ch.getTargetPath()!=='rotation')continue;const o=ch.getSampler().getOutput();
      if(ch.getTargetNode()===fore)for(let i=0;i<o.getCount();i++)F.push(dec(o.getElement(i,[])));
      if(ch.getTargetNode()===hand)for(let i=0;i<o.getCount();i++)H.push(hd(o.getElement(i,[])));}
    const mm=(a,k)=>{const v=a.map(x=>x[k]);return Math.min(...v).toFixed(0)+'..'+Math.max(...v).toFixed(0);};
    console.log('  ',an.getName().padEnd(32),'forearm roll',(F.reduce((a,x)=>a+x[1],0)/F.length).toFixed(3).padEnd(10),'(residue max',Math.max(...F.map(x=>x[2])).toFixed(2)+')','| hand bend',mm(H,0).padEnd(8),'roll',mm(H,1).padEnd(10),'bend dir',mm(H,2));}
}
})();
