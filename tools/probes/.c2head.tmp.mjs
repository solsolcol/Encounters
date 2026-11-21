import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder } from 'meshoptimizer';
import { Matrix4, Vector3 } from 'three';
await MeshoptDecoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({'meshopt.decoder':MeshoptDecoder});
const doc = await io.read(process.argv[2]); const root = doc.getRoot();
const skin = root.listSkins()[0], J = skin.listJoints(), nm = J.map(j=>j.getName()), ibm = skin.getInverseBindMatrices().getArray();
const jp = n => { const i = nm.indexOf(n); return new Vector3().setFromMatrixPosition(new Matrix4().fromArray(ibm, i*16).invert()); };
const H = jp('Head'), bone = process.argv[3]||'Head', bi = nm.indexOf(bone), X = +(process.argv[4]||0.11);
const bins = new Map(); let n = 0, s = 0;
for (const m of root.listMeshes()) for (const p of m.listPrimitives()) { const P=p.getAttribute('POSITION'), JJ=p.getAttribute('JOINTS_0'), W=p.getAttribute('WEIGHTS_0'); const v=[],a=[],b=[];
  for (let i=0;i<P.getCount();i++){ JJ.getElement(i,a); W.getElement(i,b); let hs=0; for(let k=0;k<4;k++) if(a[k]===bi) hs+=b[k]; if (hs<0.02) continue; P.getElement(i,v);
    const dx = Math.abs(v[0]-H.x); const key = (dx>X?'OUT ':'in  ')+'dx'+(Math.floor(dx*50)/50).toFixed(2); const e=bins.get(key)||[0,0,9,-9]; e[0]++; e[1]+=hs; e[2]=Math.min(e[2],v[1]); e[3]=Math.max(e[3],v[1]); bins.set(key,e); if(dx>X){n++; s+=hs;} } }
console.log(process.argv[2].split('/').pop(), bone, 'joint y', H.y.toFixed(3), 'points with its share over 0.02 farther than', X, 'm to the side:', n, 'summed', s.toFixed(1));
for (const [k,e] of [...bins].sort()) console.log('  ', k, 'pts', e[0], 'sum', e[1].toFixed(1), 'y', e[2].toFixed(2), e[3].toFixed(2));
