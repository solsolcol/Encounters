// the file's own scene nodes (their rest TRS), each joint's place at rest, and the takes with their lengths
const R=require('path').resolve(__dirname,'../../../node_modules')+'/';
const {NodeIO}=require(R+'@gltf-transform/core');const {ALL_EXTENSIONS}=require(R+'@gltf-transform/extensions');
(async()=>{const io=new NodeIO().registerExtensions(ALL_EXTENSIONS);
const m=require(R+'meshoptimizer');await m.MeshoptDecoder.ready;io.registerDependencies({'meshopt.decoder':m.MeshoptDecoder});
const d=await io.read(process.argv[2]);const root=d.getRoot();const skin=root.listSkins()[0];const joints=skin.listJoints();const ibm=skin.getInverseBindMatrices();
// world matrices of the nodes at REST (the file's own TRS), to compare with the bind
const mulM=(a,b)=>{const o=new Array(16).fill(0);for(let c=0;c<4;c++)for(let r=0;r<4;r++){let s=0;for(let k=0;k<4;k++)s+=a[k*4+r]*b[c*4+k];o[c*4+r]=s;}return o;};
const wm=(n)=>{let M=n.getMatrix();let p=n.getParentNode&&n.getParentNode();while(p){M=mulM(p.getMatrix(),M);p=p.getParentNode&&p.getParentNode();}return M;};
console.log('scene nodes:');for(const s of root.listScenes())for(const n of s.listChildren()){const pr=(x,dp)=>{console.log(' '.repeat(dp)+x.getName(),'T',x.getTranslation().map(v=>v.toFixed(3)).join(','),'S',x.getScale().map(v=>v.toFixed(3)).join(','),x.getMesh()?'[mesh]':'',x.getSkin()?'[skin]':'');if(dp<4)for(const c of x.listChildren())if(!/mixamorig:(Left|Right|Spine|Neck|Head)/.test(c.getName()))pr(c,dp+2);};pr(n,1);}
for(let i=0;i<joints.length;i++){const W=wm(joints[i]);console.log(joints[i].getName().padEnd(28),'rest world',[W[12],W[13],W[14]].map(v=>v.toFixed(3)).join(', '));}
const anims=root.listAnimations();console.log('takes:',anims.map(a=>a.getName()+':'+Math.max(...a.listSamplers().map(s=>{const inp=s.getInput();return inp.getElement(inp.getCount()-1,[])[0];})).toFixed(2)).join(' '));
})();
