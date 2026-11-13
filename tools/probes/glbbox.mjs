/* v26.2 · a model's box in its own metres (every node's transform applied, meshopt decoded): node tools/probes/glbbox.mjs <key> ... */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder } from 'meshoptimizer';
await MeshoptDecoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder });
const mul = (a, b) => { const o = new Array(16).fill(0); for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) for (let k = 0; k < 4; k++) o[c * 4 + r] += a[k * 4 + r] * b[c * 4 + k]; return o; };
for (const key of process.argv.slice(2)) {
  const doc = await io.read('assets/' + key + '.glb'), bb = [[1e9, 1e9, 1e9], [-1e9, -1e9, -1e9]];
  const walk = (node, M) => { const W = mul(M, node.getMatrix()), mesh = node.getMesh();
    if (mesh) for (const prim of mesh.listPrimitives()) { const a = prim.getAttribute('POSITION'); if (!a) continue; const v = [0, 0, 0];
      for (let i = 0; i < a.getCount(); i++) { a.getElement(i, v); const p = [W[0] * v[0] + W[4] * v[1] + W[8] * v[2] + W[12], W[1] * v[0] + W[5] * v[1] + W[9] * v[2] + W[13], W[2] * v[0] + W[6] * v[1] + W[10] * v[2] + W[14]];
        for (let k = 0; k < 3; k++) { bb[0][k] = Math.min(bb[0][k], p[k]); bb[1][k] = Math.max(bb[1][k], p[k]); } } }
    for (const c of node.listChildren()) walk(c, W); };
  const sc = doc.getRoot().getDefaultScene() || doc.getRoot().listScenes()[0];
  for (const n of sc.listChildren()) walk(n, [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]);
  console.log(key.padEnd(14), 'x', bb[0][0].toFixed(3), bb[1][0].toFixed(3), ' y', bb[0][1].toFixed(3), bb[1][1].toFixed(3), ' z', bb[0][2].toFixed(3), bb[1][2].toFixed(3));
}
