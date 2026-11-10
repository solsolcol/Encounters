// (1) the bowl's own profile (radius by height), fitted 0.22 m across; (2) his chest's front on the midline, by height,
// in real metres at rest (mesh space x 0.85, y offset so the floor is 0)
const R=require('path').resolve(__dirname,'../../../node_modules')+'/';
const {NodeIO}=require(R+'@gltf-transform/core');const {ALL_EXTENSIONS}=require(R+'@gltf-transform/extensions');
const mulM=(a,b)=>{const o=new Array(16).fill(0);for(let c=0;c<4;c++)for(let r=0;r<4;r++){let s=0;for(let k=0;k<4;k++)s+=a[k*4+r]*b[c*4+k];o[c*4+r]=s;}return o;};
const xf=(m,p)=>[m[0]*p[0]+m[4]*p[1]+m[8]*p[2]+m[12],m[1]*p[0]+m[5]*p[1]+m[9]*p[2]+m[13],m[2]*p[0]+m[6]*p[1]+m[10]*p[2]+m[14]];
(async()=>{const io=new NodeIO().registerExtensions(ALL_EXTENSIONS);
const m=require(R+'meshoptimizer');await m.MeshoptDecoder.ready;io.registerDependencies({'meshopt.decoder':m.MeshoptDecoder});
{const d=await io.read(R+'../assets/e4khannam.glb');const root=d.getRoot();const P=[];
  const wm=(n)=>{let M=n.getMatrix();let p=n.getParentNode&&n.getParentNode();while(p){M=mulM(p.getMatrix(),M);p=p.getParentNode&&p.getParentNode();}return M;};
  for(const n of root.listNodes()){const me=n.getMesh();if(!me)continue;const M=wm(n);for(const pr of me.listPrimitives()){const a=pr.getAttribute('POSITION');for(let i=0;i<a.getCount();i++)P.push(xf(M,a.getElement(i,[])));}}
  let mn=[1e9,1e9,1e9],mx=[-1e9,-1e9,-1e9];for(const p of P)for(let k=0;k<3;k++){mn[k]=Math.min(mn[k],p[k]);mx[k]=Math.max(mx[k],p[k]);}
  const s=0.22/(mx[0]-mn[0]),cx=(mn[0]+mx[0])/2,cz=(mn[2]+mx[2])/2;
  console.log('bowl verts',P.length,'size',mx.map((v,k)=>((v-mn[k])*s).toFixed(3)).join(' x '),'m as fitted (0.22 across x)');
  const H=(mx[1]-mn[1])*s;console.log(' y (cm)   outer r (cm)   inner-most r');
  for(let y=0;y<H*100;y+=0.5){let r1=0,r0=1e9;for(const p of P){const yy=(p[1]-mn[1])*s*100;if(yy>=y&&yy<y+0.5){const r=Math.hypot(p[0]-cx,p[2]-cz)*s*100;r1=Math.max(r1,r);r0=Math.min(r0,r);}}
    if(r1>0)console.log(y.toFixed(1).padStart(5),r1.toFixed(2).padStart(8),r0.toFixed(2).padStart(8),' '+'#'.repeat(Math.round(r1*3)));}
}
{const d=await io.read(R+'../assets/lersichin.glb');const root=d.getRoot();const skin=root.listSkins()[0];const names=skin.listJoints().map(j=>j.getName());
  const K=0.85,OFF=0.851;const pts=[];
  for(const mesh of root.listMeshes())for(const p of mesh.listPrimitives()){const a=p.getAttribute('POSITION');for(let i=0;i<a.getCount();i++){const v=a.getElement(i,[]);pts.push([v[0]*K,v[1]*K+OFF,v[2]*K]);}}
  console.log('\nhis front on the midline (|x| < 1.5 cm), rest pose, metres: height -> most forward z (cm from the spine line z=-0.018) | half-width of the body there');
  for(let y=0.95;y<1.50;y+=0.02){let mz=-1e9,hw=0;for(const p of pts){if(p[1]>=y&&p[1]<y+0.02){if(Math.abs(p[0])<0.015)mz=Math.max(mz,p[2]);if(Math.abs(p[2])<0.06)hw=Math.max(hw,Math.abs(p[0]));}}
    console.log(y.toFixed(2),((mz+0.018)*100).toFixed(1).padStart(6),'   halfwidth(arms incl.)',(hw*100).toFixed(1));}
  console.log('rest: Spine2 y 1.275, Neck 1.338, Head 1.420, shoulders y 1.292 x +-0.175, hips 0.945');
}
})();
