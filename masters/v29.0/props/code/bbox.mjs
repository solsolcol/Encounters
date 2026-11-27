/* v29.0 (E5C1 THINGS-3): a GLB's measures: its extent in its own metres (every node baked), triangles, materials and
   their sheets.   node masters/v29.0/props/code/bbox.mjs <file.glb> [...] */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder } from 'meshoptimizer';
await MeshoptDecoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder });
for (const f of process.argv.slice(2)) {
  const doc = await io.read(f); const lo = [1e9, 1e9, 1e9], hi = [-1e9, -1e9, -1e9]; let tris = 0;
  for (const n of doc.getRoot().listNodes()) { const m = n.getMesh(); if (!m) continue; const W = n.getWorldMatrix();
    for (const p of m.listPrimitives()) { const a = p.getAttribute('POSITION'), v = []; const ix = p.getIndices(); tris += (ix ? ix.getCount() : a.getCount()) / 3;
      for (let i = 0; i < a.getCount(); i++) { a.getElement(i, v); const [x, y, z] = v; const w = [W[0]*x+W[4]*y+W[8]*z+W[12], W[1]*x+W[5]*y+W[9]*z+W[13], W[2]*x+W[6]*y+W[10]*z+W[14]];
        for (let k = 0; k < 3; k++) { lo[k] = Math.min(lo[k], w[k]); hi[k] = Math.max(hi[k], w[k]); } } } }
  const mats = doc.getRoot().listMaterials().map(m => m.getName() + (m.getBaseColorTexture() ? '[' + m.getBaseColorTexture().getSize() + ']' : '') + ' ' + m.getBaseColorFactor().map(x => +x.toFixed(2)) + ' m' + m.getMetallicFactor() + ' r' + m.getRoughnessFactor() + ' ' + m.getAlphaMode());
  console.log(f, 'size', [0, 1, 2].map(k => +(hi[k] - lo[k]).toFixed(3)).join(' x '), 'lo', lo.map(v => +v.toFixed(3)).join(','), 'hi', hi.map(v => +v.toFixed(3)).join(','), 'tris', tris, '\n   ', mats.join(' | '));
}
