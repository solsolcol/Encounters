/* v22.0 — a STATIC scan, made game-ready: every mesh of the file merged into one (they must share one material —
   asserted), baked into world space through the file's own node chain (Sketchfab's Z-up root included), turned by
   TURN degrees about y, scaled so it stands HEIGHT m tall, its lowest point on y 0 and its footprint centred on the
   origin; simplified to RATIO, the base-colour sheet re-encoded as a JPEG of SIZE px (sharp), meshopt. Its first use:
   Chad's female ghost for episode 3 chapter 4's Yin shop ("Horror Ghost Character - Blood Stained Spirit" by
   adhamasalah, Sketchfab, CC BY 4.0; a Tripo scan, 197,867 triangles, one 2048 PNG, no rig).
   The FACING is settled by the RENDER (v12.1's law): shoot the result with tools/shootmodel.mjs and re-run with TURN
   until the face looks along +z.
     node tools/prepstatic.mjs <in.glb> <out.glb> <height> [ratio=0.3] [turnDeg=0] [size=2048] [quality=86] */
import { NodeIO, Document } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { weld, meshopt, prune, simplify } from '@gltf-transform/functions';
import { MeshoptSimplifier, MeshoptEncoder, MeshoptDecoder } from 'meshoptimizer';
import sharp from 'sharp';
import fs from 'fs';

const [,, IN, OUT, HT, R, TD, SZ, QL] = process.argv;
const HEIGHT = Number(HT), RATIO = Number(R || 0.3), TURN = Number(TD || 0) * Math.PI / 180, SIZE = Number(SZ || 2048), QUAL = Number(QL || 86);
if (!(HEIGHT > 0)) throw new Error('height?');
await Promise.all([MeshoptSimplifier.ready, MeshoptEncoder.ready, MeshoptDecoder.ready]);
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({
  'meshopt.encoder': MeshoptEncoder, 'meshopt.decoder': MeshoptDecoder });
const src = await io.read(IN);

const mul = (m, p) => [m[0] * p[0] + m[4] * p[1] + m[8] * p[2] + m[12], m[1] * p[0] + m[5] * p[1] + m[9] * p[2] + m[13], m[2] * p[0] + m[6] * p[1] + m[10] * p[2] + m[14]];
const rotN = (m, n) => { const v = [m[0] * n[0] + m[4] * n[1] + m[8] * n[2], m[1] * n[0] + m[5] * n[1] + m[9] * n[2], m[2] * n[0] + m[6] * n[1] + m[10] * n[2]];
  const l = Math.hypot(...v) || 1; return v.map(x => x / l); };
let P = [], N = [], U = [], I = [], mat0 = null;
for (const n of src.getRoot().listNodes()) {
  const m = n.getMesh(); if (!m) continue;
  const W = n.getWorldMatrix();
  for (const p of m.listPrimitives()) {
    if (mat0 && p.getMaterial() !== mat0) throw new Error('more than one material');
    mat0 = p.getMaterial();
    const a = p.getAttribute('POSITION'), nn = p.getAttribute('NORMAL'), uv = p.getAttribute('TEXCOORD_0'), ix = p.getIndices();
    const base = P.length;
    for (let i = 0; i < a.getCount(); i++) { P.push(mul(W, a.getElement(i, []))); N.push(rotN(W, nn.getElement(i, []))); U.push(uv.getElement(i, [])); }
    if (ix) for (let i = 0; i < ix.getCount(); i++) I.push(base + ix.getScalar(i));
    else for (let i = 0; i < a.getCount(); i++) I.push(base + i);
  }
}
const ext = () => [0, 1, 2].map(k => [P.reduce((x, p) => Math.min(x, p[k]), Infinity), P.reduce((x, p) => Math.max(x, p[k]), -Infinity)]);
let B = ext();
console.log('in', P.length, 'verts', I.length / 3, 'tris; box', B.map(([a, b]) => a.toFixed(3) + '..' + b.toFixed(3)).join(' '));
if (B[1][1] - B[1][0] < Math.max(B[0][1] - B[0][0], B[2][1] - B[2][0])) console.warn('WARNING: not taller than it is wide — is y up?');
/* the footprint's centre: the middle of the lowest tenth (the feet / the hem), not the box — an arm or hair out to one
   side must not pull the figure off its spot */
const y0 = B[1][0], y1 = B[1][1], low = P.filter(p => p[1] < y0 + (y1 - y0) * 0.1);
const fx = low.reduce((s, p) => s + p[0], 0) / low.length, fz = low.reduce((s, p) => s + p[2], 0) / low.length;
const S = HEIGHT / (y1 - y0), c = Math.cos(TURN), s = Math.sin(TURN);
P = P.map(p => { const x = (p[0] - fx) * S, z = (p[2] - fz) * S; return [x * c + z * s, (p[1] - y0) * S, -x * s + z * c]; });
N = N.map(n => [n[0] * c + n[2] * s, n[1], -n[0] * s + n[2] * c]);
B = ext();
console.log('out box', B.map(([a, b]) => a.toFixed(3) + '..' + b.toFixed(3)).join(' '), 'scale', S.toFixed(5));
if (Math.abs(B[1][0]) > 1e-6 || Math.abs(B[1][1] - HEIGHT) > 1e-4) throw new Error('contract broken');   // before quantize (v12.1)

const doc = new Document(); const buf = doc.createBuffer(); const scene = doc.createScene();
const mat = doc.createMaterial('figure').setBaseColorFactor([1, 1, 1, 1]).setRoughnessFactor(0.85).setMetallicFactor(0);
const bct = mat0 && mat0.getBaseColorTexture();
const sheet = async (t, px, q, name) => {
  const jpg = await sharp(Buffer.from(t.getImage()), { limitInputPixels: false }).resize(px, px, { fit: 'fill' }).jpeg({ quality: q, mozjpeg: true }).toBuffer();
  console.log(name, px, 'px JPEG', jpg.length, 'bytes');
  return doc.createTexture(name).setImage(new Uint8Array(jpg)).setMimeType('image/jpeg');
};
if (bct) mat.setBaseColorTexture(await sheet(bct, SIZE, QUAL, 'figure'));
/* NORMAL_PX / MR_PX (env): keep the scan's normal and metal-roughness sheets too, at those sizes (Chad's yin shelf:
   the small amulets on it are relief in the normal map; their gold rims are metal in the other) */
const NPX = Number(process.env.NORMAL_PX || 0), MPX = Number(process.env.MR_PX || 0);
if (NPX && mat0 && mat0.getNormalTexture()) mat.setNormalTexture(await sheet(mat0.getNormalTexture(), NPX, 90, 'normal'));
if (MPX && mat0 && mat0.getMetallicRoughnessTexture()) {
  mat.setMetallicRoughnessTexture(await sheet(mat0.getMetallicRoughnessTexture(), MPX, 88, 'metalrough'));
  mat.setMetallicFactor(mat0.getMetallicFactor()).setRoughnessFactor(mat0.getRoughnessFactor());
}
const acc = (type, arr) => doc.createAccessor().setType(type).setArray(arr).setBuffer(buf);
const prim = doc.createPrimitive()
  .setAttribute('POSITION', acc('VEC3', Float32Array.from(P.flat())))
  .setAttribute('NORMAL', acc('VEC3', Float32Array.from(N.flat())))
  .setAttribute('TEXCOORD_0', acc('VEC2', Float32Array.from(U.flat())))
  .setIndices(acc('SCALAR', Uint32Array.from(I))).setMaterial(mat);
scene.addChild(doc.createNode('figure').setMesh(doc.createMesh('figure').addPrimitive(prim)));
const tris = () => doc.getRoot().listMeshes()[0].listPrimitives()[0].getIndices().getCount() / 3;
await doc.transform(weld(), simplify({ simplifier: MeshoptSimplifier, ratio: RATIO, error: Number(process.env.ERR || 0.003) }), prune(),
  meshopt({ encoder: MeshoptEncoder, level: 'medium' }));
await io.write(OUT, doc);
console.log('after', tris(), 'tris;', fs.statSync(OUT).size, 'bytes');
