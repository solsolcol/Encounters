/* v29.0 · one PIECE cut out of a model made as a set (the four ritual things, one Meshy job): the faces whose byte in
   LABELS (one u8 a face, index order) equals K, with only the vertices they use (every attribute compacted), the
   material and its sheets as they were. Then tools/prepmeshy.mjs sizes it as its own model.
   usage: node piece.mjs IN OUT LABELS K */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { dequantize, prune } from '@gltf-transform/functions';
import { MeshoptDecoder, MeshoptEncoder } from 'meshoptimizer';
import fs from 'fs';
const [, , IN, OUT, LABELS, K] = process.argv;
await Promise.all([MeshoptDecoder.ready, MeshoptEncoder.ready]);
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder, 'meshopt.encoder': MeshoptEncoder });
const d = await io.read(IN); await d.transform(dequantize());
const lab = fs.readFileSync(LABELS); const p = d.getRoot().listMeshes()[0].listPrimitives()[0];
const a = p.getIndices().getArray(); const map = new Map(); const idx = [];
for (let f = 0; f < a.length / 3; f++) if (lab[f] === Number(K)) for (let k = 0; k < 3; k++) {
  const v = a[3*f+k]; if (!map.has(v)) map.set(v, map.size); idx.push(map.get(v)); }
for (const s of p.listSemantics()) {
  const acc = p.getAttribute(s), n = acc.getElementSize(), src = acc.getArray();
  const out = new (src.constructor)(map.size * n);
  for (const [o, nw] of map) for (let j = 0; j < n; j++) out[nw*n+j] = src[o*n+j];
  p.setAttribute(s, d.createAccessor().setType(acc.getType()).setArray(out).setNormalized(acc.getNormalized()).setBuffer(acc.getBuffer()));
}
p.setIndices(d.createAccessor().setType('SCALAR').setArray(new Uint32Array(idx)).setBuffer(p.getIndices().getBuffer()));
await d.transform(prune());
const tmp = OUT + '.tmp.glb'; await io.write(tmp, d); fs.renameSync(tmp, OUT);
console.log('piece', K, 'faces', idx.length / 3, 'vertices', map.size);
