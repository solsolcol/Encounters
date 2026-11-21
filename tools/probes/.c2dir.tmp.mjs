import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder } from 'meshoptimizer';
import * as THREE from 'three';
await MeshoptDecoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({'meshopt.decoder':MeshoptDecoder});
const [f, take, tt] = process.argv.slice(2);
const doc = await io.read(f), root = doc.getRoot(); const map = new Map(); const sc = new THREE.Scene();
const build = (n, p) => { const o = new THREE.Object3D(); o.name = n.getName(); o.position.fromArray(n.getTranslation()); o.quaternion.fromArray(n.getRotation()); o.scale.fromArray(n.getScale()); p.add(o); map.set(n, o); n.listChildren().forEach(c => build(c, o)); };
root.listScenes()[0].listChildren().forEach(n => build(n, sc));
const an = root.listAnimations().find(a => a.getName() === take); let dur = 0; an.listChannels().forEach(c => { const I = c.getSampler().getInput().getArray(); dur = Math.max(dur, I[I.length-1]); });
const t = +tt * dur;
for (const ch of an.listChannels()) { const o = map.get(ch.getTargetNode()); if (!o) continue; const s = ch.getSampler(), I = s.getInput().getArray(), O = s.getOutput().getArray(), p = ch.getTargetPath(), es = p==='rotation'?4:3; let k=0; while(k<I.length-2&&I[k+1]<t)k++; const k1=Math.min(k+1,I.length-1), u=I[k1]>I[k]?Math.min(1,Math.max(0,(t-I[k])/(I[k1]-I[k]))):0;
  if (p==='rotation') o.quaternion.fromArray(O.slice(k*4,k*4+4)).slerp(new THREE.Quaternion().fromArray(O.slice(k1*4,k1*4+4)),u); else if (p==='translation') o.position.fromArray(O.slice(k*3,k*3+3)).lerp(new THREE.Vector3().fromArray(O.slice(k1*3,k1*3+3)),u); }
sc.updateMatrixWorld(true); const P = n => { let o; sc.traverse(x => { if (x.name === n) o = x; }); return new THREE.Vector3().setFromMatrixPosition(o.matrixWorld); };
const d = (a, b) => P(b).sub(P(a)).normalize().toArray().map(x => x.toFixed(2)).join(',');
console.log(f.split('/').pop(), take, 'at', t.toFixed(2), '| hips', P('Hips').toArray().map(x=>x.toFixed(2)).join(','), '| L upper arm', d('LeftArm','LeftForeArm'), '| L forearm', d('LeftForeArm','LeftHand'), '| spine', d('Hips','neck'), '| L thigh', d('LeftUpLeg','LeftLeg'));
