// a probe: a prepped body's points, coordinates, triangles and colour sheet written out for a Python reader
//   node tools/probes/glbdump.mjs <file.glb> <outDir>   ->  pos.f32 (raw, as stored), uv.f32, idx.u32, sheet.png
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder } from 'meshoptimizer';
import sharp from 'sharp';
import fs from 'node:fs';
await MeshoptDecoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder });
const [, , inp, out] = process.argv; fs.mkdirSync(out, { recursive: true });
const doc = await io.read(inp);
const prim = doc.getRoot().listMeshes()[0].listPrimitives()[0];
const P = prim.getAttribute('POSITION'), U = prim.getAttribute('TEXCOORD_0'), n = P.getCount(), e = [];
const pos = new Float32Array(n * 3), uv = new Float32Array(n * 2);
for (let i = 0; i < n; i++) { P.getElement(i, e); pos.set(e, i * 3); U.getElement(i, e); uv[i * 2] = e[0]; uv[i * 2 + 1] = e[1]; }
const idx = Uint32Array.from(prim.getIndices().getArray());
const w = (f, a) => fs.writeFileSync(`${out}/${f}`, Buffer.from(a.buffer, a.byteOffset, a.byteLength));
w('pos.f32', pos); w('uv.f32', uv); w('idx.u32', idx);
await sharp(Buffer.from(prim.getMaterial().getBaseColorTexture().getImage())).png().toFile(`${out}/sheet.png`);
console.log(n, 'points', idx.length / 3, 'triangles');
