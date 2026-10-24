import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder } from 'meshoptimizer';
await MeshoptDecoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder });
const doc = await io.read('/home/user/Encounters/assets/filmoffice.glb');
const pts = JSON.parse(process.argv[2]);   // [[x,z],...] in the model's frame
const best = pts.map(() => []);
function mul(m, v) { return [m[0]*v[0]+m[4]*v[1]+m[8]*v[2]+m[12], m[1]*v[0]+m[5]*v[1]+m[9]*v[2]+m[13], m[2]*v[0]+m[6]*v[1]+m[10]*v[2]+m[14]]; }
for (const node of doc.getRoot().listNodes()) {
  const mesh = node.getMesh(); if (!mesh) continue;
  const M = node.getWorldMatrix();
  for (const prim of mesh.listPrimitives()) {
    const pos = prim.getAttribute('POSITION'), idx = prim.getIndices();
    const n = idx ? idx.getCount() : pos.getCount();
    const P = (i) => mul(M, pos.getElement(idx ? idx.getScalar(i) : i, []));
    for (let i = 0; i < n; i += 3) {
      const a = P(i), b = P(i + 1), c = P(i + 2);
      pts.forEach(([x, z], k) => {
        // barycentric in xz
        const d = (b[2]-c[2])*(a[0]-c[0]) + (c[0]-b[0])*(a[2]-c[2]); if (Math.abs(d) < 1e-12) return;
        const l1 = ((b[2]-c[2])*(x-c[0]) + (c[0]-b[0])*(z-c[2])) / d, l2 = ((c[2]-a[2])*(x-c[0]) + (a[0]-c[0])*(z-c[2])) / d, l3 = 1 - l1 - l2;
        if (l1 < 0 || l2 < 0 || l3 < 0) return;
        const y = l1*a[1] + l2*b[1] + l3*c[1];
        best[k].push(+y.toFixed(3) + ' ' + (mesh.getName() || node.getName()));
      });
    }
  }
}
pts.forEach((p, k) => console.log(JSON.stringify(p), best[k].sort((u, v) => parseFloat(u) - parseFloat(v)).slice(0, 12).join(' | ')));
