/* v16.9 · the temple's COLLISION, derived from the model rather than typed.
   A 10 cm grid over the base's floor (world metres, the prepped file); a
   cell is SOLID when, at knee and at chest height over the floor, anything
   of the temple lies within 0.2 m of it horizontally, or when there is a
   surface less than 2.3 m over it (inside a wall's shell, under a sill).
   The solid cells are merged into rectangles and printed as the chapter's
   TEMPLE_BLOCK table. Offline; needs three-mesh-bvh (a scratch install).
     node blockgrid.mjs <temple.glb> */
import * as THREE from 'three';
import { MeshBVH, acceleratedRaycast } from 'three-mesh-bvh';
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder } from 'meshoptimizer';
THREE.Mesh.prototype.raycast = acceleratedRaycast;
await MeshoptDecoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder });
const doc = await io.read(process.argv[2]);
const P = [];
for (const n of doc.getRoot().listNodes()) {
  const m = n.getMesh(); if (!m) continue;
  const W = new THREE.Matrix4().fromArray(n.getWorldMatrix());
  for (const p of m.listPrimitives()) {
    const a = p.getAttribute('POSITION'), ix = p.getIndices(), v = [0, 0, 0], t = new THREE.Vector3();
    for (let i = 0; i < ix.getCount(); i++) { a.getElement(ix.getScalar(i), v); t.fromArray(v).applyMatrix4(W); P.push(t.x, t.y, t.z); }
  }
}
const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3));
g.boundsTree = new MeshBVH(g);
const mesh = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ side: THREE.DoubleSide }));
const rc = new THREE.Raycaster(); rc.firstHitOnly = true;
const F = 2.456, C = 0.1, X0 = -7.2, X1 = 7.2, Z0 = -18.4, Z1 = 0.2;
const nx = Math.round((X1 - X0) / C), nz = Math.round((Z1 - Z0) / C);
const solid = new Uint8Array(nx * nz);
const dirs = []; for (let i = 0; i < 12; i++) dirs.push(new THREE.Vector3(Math.cos(i / 12 * Math.PI * 2), 0, Math.sin(i / 12 * Math.PI * 2)));
const o = new THREE.Vector3();
for (let j = 0; j < nz; j++) for (let i = 0; i < nx; i++) {
  const x = X0 + (i + 0.5) * C, z = Z0 + (j + 0.5) * C;
  let s = 0;
  for (const h of [0.3, 1.3]) {
    o.set(x, F + h, z);
    for (const d of dirs) { rc.set(o, d); rc.far = 0.2; if (rc.intersectObject(mesh, false).length) { s = 1; break; } }
    if (s) break;
  }
  if (!s) { o.set(x, F + 0.3, z); rc.set(o, new THREE.Vector3(0, 1, 0)); rc.far = 2.0; if (rc.intersectObject(mesh, false).length) s = 1; }
  solid[j * nx + i] = s;
}
/* greedy rectangles: a run along x, grown in z while the run below is identical */
const used = new Uint8Array(nx * nz), rects = [];
for (let j = 0; j < nz; j++) for (let i = 0; i < nx; i++) {
  if (!solid[j * nx + i] || used[j * nx + i]) continue;
  let w = 0; while (i + w < nx && solid[j * nx + i + w] && !used[j * nx + i + w]) w++;
  let h = 1;
  grow: for (; j + h < nz; h++) for (let k = 0; k < w; k++) if (!solid[(j + h) * nx + i + k] || used[(j + h) * nx + i + k]) break grow;
  for (let a = 0; a < h; a++) for (let k = 0; k < w; k++) used[(j + a) * nx + i + k] = 1;
  rects.push([+(X0 + i * C).toFixed(2), +(Z0 + j * C).toFixed(2), +(X0 + (i + w) * C).toFixed(2), +(Z0 + (j + h) * C).toFixed(2)]);
}
/* a picture of it, for the eye: # solid, . open */
if (process.env.MAP) for (let j = 0; j < nz; j += 2) { let s = ''; for (let i = 0; i < nx; i += 1) s += solid[j * nx + i] ? '#' : '.'; console.error(s); }
console.log(JSON.stringify(rects));
console.error('cells', nx * nz, 'solid', solid.reduce((a, b) => a + b, 0), 'rects', rects.length);
