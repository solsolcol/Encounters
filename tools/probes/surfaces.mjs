/* v27.0 · WHERE A THING CAN STAND ON A MODEL: its box, and its up-facing surfaces band by band (2 cm), each band's area and
   depth, in the middle third of its width; so a lamp is set on a shelf's own floor, never on a height guessed from a box.
     node tools/probes/surfaces.mjs <file.glb> */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder } from 'meshoptimizer';
await MeshoptDecoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder });
const doc = await io.read(process.argv[2]);
const P = [], N = [];
for (const node of doc.getRoot().listNodes()) { const m = node.getMesh(); if (!m) continue; const M = node.getWorldMatrix();
  for (const pr of m.listPrimitives()) { const pa = pr.getAttribute('POSITION'), na = pr.getAttribute('NORMAL'), idx = pr.getIndices();
    const v = [0,0,0], n = [0,0,0];
    const tri = idx ? idx.getArray() : null; const cnt = tri ? tri.length : pa.getCount();
    const get = (i) => { pa.getElement(i, v); const x = M[0]*v[0]+M[4]*v[1]+M[8]*v[2]+M[12], y = M[1]*v[0]+M[5]*v[1]+M[9]*v[2]+M[13], z = M[2]*v[0]+M[6]*v[1]+M[10]*v[2]+M[14]; return [x,y,z]; };
    for (let t = 0; t < cnt; t += 3) { const a = get(tri ? tri[t] : t), b = get(tri ? tri[t+1] : t+1), c = get(tri ? tri[t+2] : t+2);
      const u = [b[0]-a[0], b[1]-a[1], b[2]-a[2]], w = [c[0]-a[0], c[1]-a[1], c[2]-a[2]];
      const nx = u[1]*w[2]-u[2]*w[1], ny = u[2]*w[0]-u[0]*w[2], nz = u[0]*w[1]-u[1]*w[0], l = Math.hypot(nx,ny,nz) || 1;
      P.push([(a[0]+b[0]+c[0])/3, (a[1]+b[1]+c[1])/3, (a[2]+b[2]+c[2])/3, nx/l, ny/l, nz/l, l/2]); } } }
let mn = [1e9,1e9,1e9], mx = [-1e9,-1e9,-1e9];
for (const p of P) for (let k = 0; k < 3; k++) { mn[k] = Math.min(mn[k], p[k]); mx[k] = Math.max(mx[k], p[k]); }
console.log('bbox min', mn.map(v=>v.toFixed(3)).join(' '), 'max', mx.map(v=>v.toFixed(3)).join(' '));
// up-facing area by height, in the middle third of the width
const W = mx[0]-mn[0], bins = {};
for (const p of P) { if (p[4] < 0.85) continue; if (Math.abs(p[0] - (mn[0]+mx[0])/2) > W/3) continue; const h = (Math.round(p[1]*50)/50).toFixed(2); bins[h] = (bins[h]||0) + p[6]; }
for (const [h, a] of Object.entries(bins).sort((a,b)=>+a[0]-+b[0])) if (a > 0.002) console.log('up-facing at y', h, 'area', a.toFixed(4));
// the depth of each up-facing band (z range)
const zr = {}; for (const p of P) { if (p[4] < 0.85) continue; if (Math.abs(p[0] - (mn[0]+mx[0])/2) > W/3) continue; const h = (Math.round(p[1]*50)/50).toFixed(2); zr[h] = zr[h] || [1e9,-1e9]; zr[h][0] = Math.min(zr[h][0], p[2]); zr[h][1] = Math.max(zr[h][1], p[2]); }
for (const [h, r] of Object.entries(zr).sort((a,b)=>+a[0]-+b[0])) if ((bins[h]||0) > 0.002) console.log('  y', h, 'z from', r[0].toFixed(3), 'to', r[1].toFixed(3));
