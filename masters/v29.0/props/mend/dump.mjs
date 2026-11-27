// dump a glb's first primitive: positions, indices, uvs (.npy-free raw f32/u32) and its textures as files
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { dequantize } from '@gltf-transform/functions';
import { MeshoptDecoder } from 'meshoptimizer';
import fs from 'fs';
const [, , IN, OUT] = process.argv;
await MeshoptDecoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder });
const d = await io.read(IN); await d.transform(dequantize());
fs.mkdirSync(OUT, { recursive: true });
const p = d.getRoot().listMeshes()[0].listPrimitives()[0];
const w = (n, a) => fs.writeFileSync(`${OUT}/${n}`, Buffer.from(a.buffer, a.byteOffset, a.byteLength));
w('pos.f32', new Float32Array(p.getAttribute('POSITION').getArray()));
w('uv.f32', new Float32Array(p.getAttribute('TEXCOORD_0').getArray()));
w('idx.u32', new Uint32Array(p.getIndices().getArray()));
for (const t of d.getRoot().listTextures()) fs.writeFileSync(`${OUT}/${t.getName()}.jpg`, t.getImage());
console.log('dumped', p.getAttribute('POSITION').getCount());
