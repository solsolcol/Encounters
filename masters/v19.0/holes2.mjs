// v19.0 · the cabin's windows by RAYCAST (three in node): from inside the
// cabin toward +x at the window's height, which z values reach the pane
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import fs from 'node:fs';
const buf = fs.readFileSync(process.argv[2]);
const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
const gltf = await new Promise((res, rej) => new GLTFLoader().parse(ab, '', res, rej));
const g = gltf.scene; g.scale.setScalar(+(process.env.S || 15)); g.updateMatrixWorld(true);
const rc = new THREE.Raycaster(); const meshes = []; g.traverse(o => o.isMesh && meshes.push(o));
let run = null; const out = [];
for (let z = -2.6; z <= 2.6; z += 0.01) {
  rc.set(new THREE.Vector3(0.3, 0.97, z), new THREE.Vector3(1, 0, 0));
  const h = rc.intersectObjects(meshes, false)[0];
  const pane = h && h.object.material.name === 'blinn5';
  if (pane && !run) run = { z0: z }; if (!pane && run) { run.z1 = z; out.push(run); run = null; }
}
for (const r of out) console.log(`window z ${r.z0.toFixed(2)}..${r.z1.toFixed(2)} mid ${((r.z0 + r.z1) / 2).toFixed(3)}`);
// its height at the middle one
const zm = (out[2].z0 + out[2].z1) / 2; let y0 = null, y1 = null;
for (let y = 0.4; y <= 1.6; y += 0.005) { rc.set(new THREE.Vector3(0.3, y, zm), new THREE.Vector3(1, 0, 0)); const h = rc.intersectObjects(meshes, false)[0]; const pane = h && h.object.material.name === 'blinn5'; if (pane && y0 === null) y0 = y; if (pane) y1 = y; }
console.log('window y', y0.toFixed(3), y1.toFixed(3));
// seat cushion tops and backrest faces, straight down / forward through each seat
for (const sz of [-2.15, -1.13, -0.12, 0.90, 1.92]) for (const sx of [-0.44, -0.01, 0.42]) {
  rc.set(new THREE.Vector3(sx, 1.6, sz), new THREE.Vector3(0, -1, 0)); const d = rc.intersectObjects(meshes, false).filter(h => h.object.material.name !== 'blinn4')[0];
  rc.set(new THREE.Vector3(sx, 0.75, sz - 0.6), new THREE.Vector3(0, 0, 1)); const b = rc.intersectObjects(meshes, false)[0];
  console.log(`seat x ${sx} z ${sz}: down hits ${d && d.object.material.name} at y ${d && d.point.y.toFixed(3)}; back at z ${b && b.point.z.toFixed(3)} (${b && b.object.material.name})`);
}
// the backrest's FRONT face: from the cushion's middle toward -z (the seats face +z)
for (const y of [0.6, 0.75, 0.9, 1.0]) {
  rc.set(new THREE.Vector3(0.42, y, -1.13), new THREE.Vector3(0, 0, -1)); const b = rc.intersectObjects(meshes, false)[0];
  console.log(`backrest front at y ${y}: z ${b && b.point.z.toFixed(3)} (${b && b.object.material.name})`);
}
// the seat back's top, and the cushion's front edge
for (const z of [-1.5, -1.45, -1.4, -1.35, -1.3]) { rc.set(new THREE.Vector3(0.42, 2, z), new THREE.Vector3(0, -1, 0)); const b = rc.intersectObjects(meshes, false).filter(h => h.object.material.name !== 'blinn4')[0]; console.log(`top at z ${z}: y ${b && b.point.y.toFixed(3)}`); }
for (const z of [-0.95, -0.9, -0.85, -0.8]) { rc.set(new THREE.Vector3(0.42, 2, z), new THREE.Vector3(0, -1, 0)); const b = rc.intersectObjects(meshes, false).filter(h => h.object.material.name !== 'blinn4')[0]; console.log(`cushion front z ${z}: y ${b && b.point.y.toFixed(3)} ${b && b.object.material.name}`); }
