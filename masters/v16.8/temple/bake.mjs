/* Temple bake: classify every face, bake ambient occlusion per vertex with a
   BVH, write one mesh per material class with the AO in COLOR_0.
   node bake.mjs in.glb out.glb [rays] [dist] */
import * as THREE from 'three';
import { MeshBVH, acceleratedRaycast } from 'three-mesh-bvh';
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import fs from 'node:fs';
THREE.Mesh.prototype.raycast = acceleratedRaycast;

const [IN, OUT, RAYS = '28', DIST = '7'] = process.argv.slice(2);
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
const src = await io.read(IN);

/* ---- 1. every triangle in world space (the file is Z-up under a -90° X root) ---- */
const P = [];              // flat xyz per corner
const MID = [];            // source mesh per triangle (crowding is counted per mesh, as v1 did)
let meshNo = 0;
const N = [];              // source vertex normals per corner (smooth)
const v = [0, 0, 0], nn = [0, 0, 0];
for (const node of src.getRoot().listNodes()) {
  const m = node.getMesh(); if (!m) continue;
  const W = new THREE.Matrix4().fromArray(node.getWorldMatrix());
  const Nm = new THREE.Matrix3().getNormalMatrix(W);
  for (const p of m.listPrimitives()) {
    const a = p.getAttribute('POSITION'), na = p.getAttribute('NORMAL'), ix = p.getIndices();
    const cnt = ix ? ix.getCount() : a.getCount();
    const tv = new THREE.Vector3(), tn = new THREE.Vector3();
    for (let i = 0; i < cnt; i++) {
      const vi = ix ? ix.getScalar(i) : i;
      a.getElement(vi, v); tv.fromArray(v).applyMatrix4(W); P.push(tv.x, tv.y, tv.z);
      if (na) { na.getElement(vi, nn); tn.fromArray(nn).applyMatrix3(Nm).normalize(); N.push(tn.x, tn.y, tn.z); }
      if (i % 3 === 0) MID.push(meshNo);
    }
    meshNo++;
  }
}
const T = P.length / 9;
console.log('triangles', T);

/* ---- 2. per-face measures: centroid, face normal, edge size, crowding, aspect ---- */
const cen = new Float32Array(T * 3), fn = new Float32Array(T * 3), fe = new Float32Array(T), fa = new Float32Array(T);
const A = new THREE.Vector3(), B = new THREE.Vector3(), C = new THREE.Vector3(), U = new THREE.Vector3(), V = new THREE.Vector3(), Q = new THREE.Vector3();
const CELL = 1.6, grid = new Map();
for (let t = 0; t < T; t++) {
  A.fromArray(P, 9 * t); B.fromArray(P, 9 * t + 3); C.fromArray(P, 9 * t + 6);
  cen[3 * t] = (A.x + B.x + C.x) / 3; cen[3 * t + 1] = (A.y + B.y + C.y) / 3; cen[3 * t + 2] = (A.z + B.z + C.z) / 3;
  Q.crossVectors(U.subVectors(B, A), V.subVectors(C, A)); const len = Q.length(); if (len > 0) Q.divideScalar(len);
  fn[3 * t] = Q.x; fn[3 * t + 1] = Q.y; fn[3 * t + 2] = Q.z;
  const L0 = A.distanceTo(B), L1 = B.distanceTo(C), L2 = C.distanceTo(A), Lm = Math.max(L0, L1, L2);
  fe[t] = (L0 + L1 + L2) / 3; fa[t] = len > 0 ? Lm * Lm / len : 99;
  const k = MID[t] + ':' + ((cen[3 * t] / CELL) | 0) + ',' + ((cen[3 * t + 1] / CELL) | 0) + ',' + ((cen[3 * t + 2] / CELL) | 0);
  grid.set(k, (grid.get(k) || 0) + 1);
}
const dens = t => grid.get(MID[t] + ':' + ((cen[3 * t] / CELL) | 0) + ',' + ((cen[3 * t + 1] / CELL) | 0) + ',' + ((cen[3 * t + 2] / CELL) | 0)) || 0;

/* ---- 4. BVH over the whole temple ---- */
const geo = new THREE.BufferGeometry();
geo.setAttribute('position', new THREE.Float32BufferAttribute(P, 3));
geo.boundsTree = new MeshBVH(geo);
const mesh = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ side: THREE.DoubleSide }));
const ray = new THREE.Raycaster(); ray.firstHitOnly = true; ray.far = +DIST;

/* ORIENT: the file's pieces are exported inside-out (walls wound inward,
   the roof's top facing down; its stored normals follow the winding, so
   they cannot say which side is out). Each face is turned to whichever of
   its two sides is more OPEN — a wall's outside sees sky, its inside hits
   the wall's other face a step away. A thin sheet open on both sides keeps
   its winding (the roof's sheet rule deals with it). */
{
  const OR = 12, far = 40, D2 = [];
  for (let i = 0; i < OR; i++) { const u1 = (i + 0.5) / OR, th = 2 * Math.PI * ((i * 0.618034) % 1), r = Math.sqrt(u1); D2.push(new THREE.Vector3(r * Math.cos(th), Math.sqrt(1 - u1), r * Math.sin(th))); }
  const rr = new THREE.Raycaster(); rr.firstHitOnly = true; rr.far = far;
  const up = new THREE.Vector3(0, 1, 0), q = new THREE.Quaternion(), d = new THREE.Vector3(), o = new THREE.Vector3(), n = new THREE.Vector3();
  const open = (t, sgn) => {
    n.set(fn[3 * t] * sgn, fn[3 * t + 1] * sgn, fn[3 * t + 2] * sgn); q.setFromUnitVectors(up, n);
    o.set(cen[3 * t] + n.x * 0.05, cen[3 * t + 1] + n.y * 0.05, cen[3 * t + 2] + n.z * 0.05);
    let s = 0;
    for (const v of D2) { d.copy(v).applyQuaternion(q); rr.set(o, d); rr.near = 0.02; const h = rr.intersectObject(mesh, false); s += h.length ? Math.min(1, h[0].distance / far) : 1; }
    return s;
  };
  let turned = 0; const t0 = Date.now();
  for (let t = 0; t < T; t++) {
    if (open(t, -1) > open(t, 1) + 0.75) {
      turned++; fn[3 * t] *= -1; fn[3 * t + 1] *= -1; fn[3 * t + 2] *= -1;
      const o9 = 9 * t;
      for (let k = 0; k < 3; k++) { const a = P[o9 + 3 + k]; P[o9 + 3 + k] = P[o9 + 6 + k]; P[o9 + 6 + k] = a;
        if (N.length) { const b = N[o9 + 3 + k]; N[o9 + 3 + k] = N[o9 + 6 + k]; N[o9 + 6 + k] = b; } }
      if (N.length) for (let j = 0; j < 9; j++) N[o9 + j] *= -1;
    }
    if (t % 100000 === 0 && t) console.log('  oriented', t, ((Date.now() - t0) / 1000).toFixed(0) + 's');
  }
  console.log('faces turned outward', turned, 'of', T);
}
/* ---- 3. the classifier (v1's, refined) ---- */
function classify(t) {
  const y = cen[3 * t + 1], ny = fn[3 * t + 1], e = fe[t], d = dens(t), asp = fa[t], nz = fn[3 * t + 2];
  if (y < 38) return ny > 0.9 ? 'floor' : (d > 60 ? 'gold' : 'base');
  if (d > (y > 50 ? 25 : 60) || e < 0.3) return 'gold';
  if (y > 44) {
    /* the roof is ONE sheet in this file, and its winding faces DOWN
       (photographed in flat class colours: the whole top read as soffit) —
       a sloped face up here is both the tiles and the underside */
    if (Math.abs(ny) > 0.2 && Math.abs(ny) < 0.985) return 'sheet';
    if (y > 60) return Math.abs(nz) > 0.7 && asp > 6 ? 'gold' : 'red';
  }
  if (ny > 0.9) return 'floor';
  if (ny < -0.9) return 'soffit';
  return 'white';
}
const cls = new Array(T), stats = {};
for (let t = 0; t < T; t++) { cls[t] = classify(t); stats[cls[t]] = (stats[cls[t]] || 0) + 1; }
/* one emission per (face, class, facing): a sheet face goes out twice,
   facing up as roof and facing down as soffit; a face whose own normal
   disagrees with the facing wanted is written reversed */
const EM = [];
for (let t = 0; t < T; t++) {
  if (cls[t] === 'sheet') { EM.push([t, 'roof', 1], [t, 'soffit', -1]); }
  else EM.push([t, cls[t], 0]);
}
console.log('classes', stats);
if (process.env.CLS_ONLY) process.exit(0);

/* cosine-weighted hemisphere directions, a fixed set rotated per vertex */
const R = +RAYS, DIRS = [];
for (let i = 0; i < R; i++) {
  const u1 = (i + 0.5) / R, u2 = (i * 0.618034) % 1, r = Math.sqrt(u1), th = 2 * Math.PI * u2;
  DIRS.push(new THREE.Vector3(r * Math.cos(th), Math.sqrt(1 - u1), r * Math.sin(th)));
}
const up = new THREE.Vector3(0, 1, 0), qn = new THREE.Quaternion(), dir = new THREE.Vector3(), org = new THREE.Vector3(), nrm = new THREE.Vector3();
function ao(px, py, pz, nx, ny, nz, spin) {
  nrm.set(nx, ny, nz); qn.setFromUnitVectors(up, nrm);
  /* start a little off the surface and ignore the first 0.25 units: a
     finely tessellated curved roof otherwise shades itself at grazing
     angles, and a hit that close is the same surface, not a crevice */
  org.set(px + nx * 0.08, py + ny * 0.08, pz + nz * 0.08);
  let occ = 0;
  for (let i = 0; i < R; i++) {
    dir.copy(DIRS[i]).applyAxisAngle(up, spin).applyQuaternion(qn);
    if (dir.dot(nrm) < 0.12) continue;
    ray.set(org, dir); ray.near = 0.25;
    const h = ray.intersectObject(mesh, false);
    if (h.length) { const f = 1 - Math.min(1, h[0].distance / +DIST); occ += f * f * 0.7 + 0.3 * f; }
  }
  return 1 - occ / R;
}

/* ---- 5. split per class, bake per output vertex (a corner shared by faces of
   one class is one vertex: keyed by quantized position + class) ---- */
const groups = {};
const keyOf = (x, y, z) => `${Math.round(x * 500)},${Math.round(y * 500)},${Math.round(z * 500)}`;
const t0 = Date.now();
let baked = 0;
for (const [t, k, want] of EM) {
  const g = groups[k] || (groups[k] = { map: new Map(), pos: [], nor: [], ao: [], idx: [] });
  const flip = want !== 0 && Math.sign(fn[3 * t + 1]) !== want;
  const order = flip ? [0, 2, 1] : [0, 1, 2];
  for (const j of order) {
    const o = 9 * t + 3 * j, x = P[o], y = P[o + 1], z = P[o + 2];
    let nx = fn[3 * t], ny = fn[3 * t + 1], nz = fn[3 * t + 2];
    if (N.length) { const sx = N[o], sy = N[o + 1], sz = N[o + 2]; if (sx * nx + sy * ny + sz * nz > 0.7) { nx = sx; ny = sy; nz = sz; } }
    if (flip) { nx = -nx; ny = -ny; nz = -nz; }
    const key = keyOf(x, y, z) + '|' + (nx > 0 ? 1 : 0) + (ny > 0 ? 1 : 0) + (nz > 0 ? 1 : 0);
    let vi = g.map.get(key);
    if (vi === undefined) {
      vi = g.pos.length / 3; g.map.set(key, vi);
      g.pos.push(x, y, z); g.nor.push(nx, ny, nz);
      g.ao.push(ao(x, y, z, nx, ny, nz, (vi * 2.399) % 6.283));
      if (++baked % 50000 === 0) console.log('  baked', baked, ((Date.now() - t0) / 1000).toFixed(0) + 's');
    }
    g.idx.push(vi);
  }
}
console.log('vertices baked', baked, 'in', ((Date.now() - t0) / 1000).toFixed(0) + 's');

/* ---- 6. write: one mesh per class, AO in COLOR_0 (grey), Y-up world units ---- */
const { Document } = await import('@gltf-transform/core');
const doc = new Document(); const buf = doc.createBuffer(); const scene = doc.createScene('temple');
for (const [k, g] of Object.entries(groups)) {
  const col = new Float32Array(g.ao.length * 4);
  for (let i = 0; i < g.ao.length; i++) { const a = g.ao[i]; col[4 * i] = col[4 * i + 1] = col[4 * i + 2] = a; col[4 * i + 3] = 1; }
  const prim = doc.createPrimitive()
    .setAttribute('POSITION', doc.createAccessor().setType('VEC3').setArray(new Float32Array(g.pos)).setBuffer(buf))
    .setAttribute('NORMAL', doc.createAccessor().setType('VEC3').setArray(new Float32Array(g.nor)).setBuffer(buf))
    .setAttribute('COLOR_0', doc.createAccessor().setType('VEC4').setArray(col).setBuffer(buf))
    .setIndices(doc.createAccessor().setType('SCALAR').setArray(new Uint32Array(g.idx)).setBuffer(buf))
    .setMaterial(doc.createMaterial('temple_' + k));
  scene.addChild(doc.createNode('temple_' + k).setMesh(doc.createMesh('temple_' + k).addPrimitive(prim)));
  console.log(k.padEnd(8), 'verts', g.pos.length / 3, 'tris', g.idx.length / 3);
}
await io.write(OUT, doc);
console.log('wrote', OUT, (fs.statSync(OUT).size / 1048576).toFixed(1) + ' MB');
