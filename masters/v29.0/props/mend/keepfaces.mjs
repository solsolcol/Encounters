// write IN to OUT keeping only the faces whose byte in MASK (one u8 a face, in index order) equals WANT
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { dequantize, prune } from '@gltf-transform/functions';
import { MeshoptDecoder, MeshoptEncoder } from 'meshoptimizer';
import fs from 'fs';
const [, , IN, OUT, MASK, WANT] = process.argv;
await Promise.all([MeshoptDecoder.ready, MeshoptEncoder.ready]);
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder, 'meshopt.encoder': MeshoptEncoder });
const d = await io.read(IN); await d.transform(dequantize());
const m = fs.readFileSync(MASK); const p = d.getRoot().listMeshes()[0].listPrimitives()[0];
const a = p.getIndices().getArray(); const out = [];
for (let f = 0; f < a.length / 3; f++) if (m[f] === Number(WANT)) out.push(a[3*f], a[3*f+1], a[3*f+2]);
p.getIndices().setArray(new Uint32Array(out));
const tmp = OUT + '.tmp.glb'; await io.write(tmp, d); fs.renameSync(tmp, OUT); console.log('kept', out.length / 3);
