import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder } from 'meshoptimizer';
import sharp from 'sharp';
await MeshoptDecoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({'meshopt.decoder':MeshoptDecoder});
const doc = await io.read(process.argv[2]); const root = doc.getRoot(); const [x0,x1,y0,y1,z0,z1] = process.argv[3].split(',').map(Number);
const prim = root.listMeshes()[0].listPrimitives()[0]; const tex = prim.getMaterial().getBaseColorTexture();
const img = sharp(Buffer.from(tex.getImage())); const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
const P = prim.getAttribute('POSITION'), UV = prim.getAttribute('TEXCOORD_0'); const v=[], u=[];
const lin = c => { c/=255; return c<=0.04045? c/12.92 : ((c+0.055)/1.055)**2.4; };
const lab = (r,g,b) => { const R=lin(r),G=lin(g),B=lin(b); let X=(0.4124*R+0.3576*G+0.1805*B)/0.95047, Y=(0.2126*R+0.7152*G+0.0722*B), Z=(0.0193*R+0.1192*G+0.9505*B)/1.08883; const f=t=>t>0.008856?Math.cbrt(t):7.787*t+16/116; const L=116*f(Y)-16, a=500*(f(X)-f(Y)), bb=200*(f(Y)-f(Z)); return [L, Math.hypot(a,bb), (Math.atan2(bb,a)*180/Math.PI+360)%360]; };
const rows = new Map();
for (let i=0;i<P.getCount();i++){ P.getElement(i,v); if(v[0]<x0||v[0]>x1||v[1]<y0||v[1]>y1||v[2]<z0||v[2]>z1) continue; UV.getElement(i,u);
  const px=Math.min(info.width-1,Math.max(0,Math.round(u[0]*info.width))), py=Math.min(info.height-1,Math.max(0,Math.round(u[1]*info.height))); const o=(py*info.width+px)*info.channels;
  const L=lab(data[o],data[o+1],data[o+2]); const b=(Math.round(v[1]*200)/200).toFixed(3); const r=rows.get(b)||[]; r.push(L); rows.set(b,r); }
for (const [y,r] of [...rows].sort((a,b)=>b[0]-a[0])) { const w=r.filter(l=>l[0]>70).length, nv=r.filter(l=>l[0]<45).length; const m=k=>(r.reduce((s,l)=>s+l[k],0)/r.length).toFixed(0); console.log(y, 'n', r.length, 'white', w, 'dark', nv, 'mean L C h', m(0), m(1), m(2)); }
