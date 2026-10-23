/* v22.0 — the Yin shop's skulls (episode 3 chapter 4, Chad: "there are usually many skulls or occult items all
   over, that is the real eerie part"). A REAL skull, scanned — never built from shapes: Khronos's glTF sample
   "ScatteringSkull" (a human skull with its jaw and teeth, 188,871 triangles, © 2025 Public, CC0 1.0, Vladimir
   Petkovic), whose material is a frosted glass made of four extensions and one 2048 AO-and-thickness sheet. OFFLINE.

   Out comes one node `skull`, in METRES, Y up, the FACE to +z, the jaw's lowest point on y 0, centred in x and z,
   LEN m from the brow to the back of the head; one plain material whose colour is BONE: the sheet's ambient occlusion
   (its red channel) turned into ivory that yellows and darkens into every crevice — so a skull reads as old bone in a
   shop's light with no lighting trick at all. The chapter tints each copy (an aged one, a smoked one, a lacquered one).
     node tools/prepskull.mjs <in.glb> <out.glb> [ratio] [len] [bone.jpg] */
import { NodeIO, Document } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { weld, meshopt, prune, simplify } from '@gltf-transform/functions';
import { MeshoptSimplifier, MeshoptEncoder, MeshoptDecoder } from 'meshoptimizer';
import fs from 'fs';

const [,, IN, OUT, R, LN, BONE] = process.argv;
const RATIO = Number(R || 0.09), LEN = Number(LN || 0.2);
await Promise.all([MeshoptSimplifier.ready, MeshoptEncoder.ready, MeshoptDecoder.ready]);
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({
  'meshopt.encoder': MeshoptEncoder, 'meshopt.decoder': MeshoptDecoder });
const src = await io.read(IN);

/* every vertex in world space, with its normal and uv (one primitive in the file) */
const mul = (m, p) => [m[0] * p[0] + m[4] * p[1] + m[8] * p[2] + m[12], m[1] * p[0] + m[5] * p[1] + m[9] * p[2] + m[13], m[2] * p[0] + m[6] * p[1] + m[10] * p[2] + m[14]];
const rotN = (m, n) => { const v = [m[0] * n[0] + m[4] * n[1] + m[8] * n[2], m[1] * n[0] + m[5] * n[1] + m[9] * n[2], m[2] * n[0] + m[6] * n[1] + m[10] * n[2]];
  const l = Math.hypot(...v) || 1; return v.map(x => x / l); };
let P = [], N = [], U = [], I = [];
for (const n of src.getRoot().listNodes()) {
  const m = n.getMesh(); if (!m) continue;
  const W = n.getWorldMatrix();
  for (const p of m.listPrimitives()) {
    const a = p.getAttribute('POSITION'), nn = p.getAttribute('NORMAL'), uv = p.getAttribute('TEXCOORD_0'), ix = p.getIndices();
    const base = P.length;
    for (let i = 0; i < a.getCount(); i++) { P.push(mul(W, a.getElement(i, []))); N.push(rotN(W, nn.getElement(i, []))); U.push(uv.getElement(i, [])); }
    for (let i = 0; i < ix.getCount(); i++) I.push(base + ix.getScalar(i));
  }
}
const mn = (k) => P.reduce((x, p) => Math.min(x, p[k]), Infinity), mx = (k) => P.reduce((x, p) => Math.max(x, p[k]), -Infinity);
console.log('in', P.length, 'verts', I.length / 3, 'tris; box', [0, 1, 2].map(k => mn(k).toFixed(3) + '..' + mx(k).toFixed(3)).join(' '));

/* THE FACE: the teeth are the skull's front. The two horizontal axes are scored by where the thin, dense band of
   the teeth lies — the teeth are the LOW, far-forward part — so the front is the end of the long horizontal axis whose
   lowest slab (the jaw and the teeth) reaches furthest out. Asserted below by the render, not trusted alone */
const ys = P.map(p => p[1]), y0 = mn(1), y1 = mx(1), H = y1 - y0;
const ext = (k) => mx(k) - mn(k);
const longK = ext(0) > ext(2) ? 0 : 2, sideK = longK === 0 ? 2 : 0;
const lowBand = P.filter(p => p[1] < y0 + H * 0.35);            // the jaw and the teeth
const cLong = (mn(longK) + mx(longK)) / 2;
const reachHi = lowBand.reduce((x, p) => Math.max(x, p[longK] - cLong), -Infinity);
const reachLo = lowBand.reduce((x, p) => Math.max(x, cLong - p[longK]), -Infinity);
const frontSign = reachHi > reachLo ? 1 : -1;                   // which end of the long axis the jaw juts toward
console.log('long axis', 'xyz'[longK], 'front', frontSign > 0 ? '+' : '-', 'jaw reach', reachHi.toFixed(3), reachLo.toFixed(3));
/* turn so the face looks along +z, the side axis along x (a proper rotation: a mirror would turn the skull inside out) */
const cx = (mn(0) + mx(0)) / 2, cz = (mn(2) + mx(2)) / 2;
const turn = (p) => {
  const x = p[0] - cx, y = p[1], z = p[2] - cz;
  if (longK === 2) return frontSign > 0 ? [x, y, z] : [-x, y, -z];
  return frontSign > 0 ? [-z, y, x] : [z, y, -x];               // long axis was x: rotate about y by ∓90°
};
const turnN = (n) => {
  if (longK === 2) return frontSign > 0 ? n : [-n[0], n[1], -n[2]];
  return frontSign > 0 ? [-n[2], n[1], n[0]] : [n[2], n[1], -n[0]];
};
P = P.map(turn); N = N.map(turnN);
const L = mx(2) - mn(2), S = LEN / L, by = mn(1), bz = (mn(2) + mx(2)) / 2, bx = (mn(0) + mx(0)) / 2;
P = P.map(p => [(p[0] - bx) * S, (p[1] - by) * S, (p[2] - bz) * S]);
console.log('scaled', S.toFixed(4), 'box', [0, 1, 2].map(k => mn(k).toFixed(3) + '..' + mx(k).toFixed(3)).join(' '));
/* the contract, BEFORE quantize (v12.1): face +z, base y 0, centred */
if (Math.abs(mn(1)) > 1e-6 || Math.abs(mn(0) + mx(0)) > 1e-4 || Math.abs(mn(2) + mx(2)) > 1e-4) throw new Error('contract broken');

/* a fresh document: POSITION, NORMAL, TEXCOORD_0 (the tangents went with the frosted glass) */
const doc = new Document(); const buf = doc.createBuffer(); const scene = doc.createScene();
const img = BONE ? fs.readFileSync(BONE) : null;
const mat = doc.createMaterial('bone').setBaseColorFactor([1, 1, 1, 1]).setRoughnessFactor(0.62).setMetallicFactor(0);
if (img) mat.setBaseColorTexture(doc.createTexture('bone').setImage(img).setMimeType('image/jpeg'));
const acc = (type, arr) => doc.createAccessor().setType(type).setArray(arr).setBuffer(buf);
const prim = doc.createPrimitive()
  .setAttribute('POSITION', acc('VEC3', Float32Array.from(P.flat())))
  .setAttribute('NORMAL', acc('VEC3', Float32Array.from(N.flat())))
  .setAttribute('TEXCOORD_0', acc('VEC2', Float32Array.from(U.flat())))
  .setIndices(acc('SCALAR', Uint32Array.from(I))).setMaterial(mat);
scene.addChild(doc.createNode('skull').setMesh(doc.createMesh('skull').addPrimitive(prim)));
const tris = () => doc.getRoot().listMeshes()[0].listPrimitives()[0].getIndices().getCount() / 3;
console.log('before', tris());
await doc.transform(weld(), simplify({ simplifier: MeshoptSimplifier, ratio: RATIO, error: 0.004 }), prune(),
  meshopt({ encoder: MeshoptEncoder, level: 'medium' }));
await io.write(OUT, doc);
console.log('after', tris(), 'tris;', fs.statSync(OUT).size, 'bytes');
