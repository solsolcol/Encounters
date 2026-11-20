// swap a GLB's base colour sheet for a PNG (a probe: to see a class map on the body)
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptEncoder, MeshoptDecoder } from 'meshoptimizer';
import fs from 'node:fs';
await MeshoptDecoder.ready; await MeshoptEncoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.encoder': MeshoptEncoder, 'meshopt.decoder': MeshoptDecoder });
const [, , inp, png, out] = process.argv;
const doc = await io.read(inp);
for (const m of doc.getRoot().listMaterials()) { const t = m.getBaseColorTexture(); if (t) { t.setImage(fs.readFileSync(png)).setMimeType('image/png'); } m.setEmissiveFactor([0, 0, 0]); }
await io.write(out, doc);
console.log('written', out);
