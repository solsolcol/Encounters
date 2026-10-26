// how far does a TIGHT error bound take kuman2 (the strands kept whole, only their straight runs merged)?
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptSimplifier } from 'meshoptimizer';
await MeshoptSimplifier.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
const d = await io.read(process.argv[2]);
const p = d.getRoot().listMeshes()[0].listPrimitives()[0];
const P = new Float32Array(p.getAttribute('POSITION').getArray()), I = new Uint32Array(p.getIndices().getArray());
const UV = new Float32Array(p.getAttribute('TEXCOORD_0').getArray());
console.log('in', I.length / 3, 'scale', MeshoptSimplifier.getScale(P, 3));
for (const err of (process.argv[3] || '0.0002,0.0004,0.0008').split(',').map(Number)) {
  const t0 = Date.now();
  const [idx, e] = MeshoptSimplifier.simplifyWithAttributes(I, P, 3, UV, 2, [0.5, 0.5], null, Math.floor(I.length * 0.05 / 3) * 3, err, []);
  // where did the triangles go? hair (|x|>0.42) vs body
  let hair = 0; for (let t = 0; t < idx.length / 3; t++) { const a = idx[3*t]*3, b = idx[3*t+1]*3, c = idx[3*t+2]*3; if (Math.abs((P[a]+P[b]+P[c])/3) > 0.42) hair++; }
  console.log('err', err, '->', idx.length / 3, 'tris (hair', hair, ') result err', e.toFixed(6), (Date.now() - t0) / 1000 + 's');
}
