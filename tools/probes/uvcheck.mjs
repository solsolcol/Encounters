/* v26.1 · A SHEET'S LAYOUT CHECKED: how much of the square the triangles' coordinates cover in sum (over 100 % means some
   overlap), how many triangles have no area in the world but some on the sheet (or the other way), and the share of the
   sheet the worst-stretched one percent take. Made for the people's paint laid out again (tools/repaint.py).
     node tools/probes/uvcheck.mjs <file.glb> [...] */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder, MeshoptEncoder } from 'meshoptimizer';
await MeshoptDecoder.ready; await MeshoptEncoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder, 'meshopt.encoder': MeshoptEncoder });
for (const f of process.argv.slice(2)) {
  const doc = await io.read(f);
  for (const mesh of doc.getRoot().listMeshes()) for (const p of mesh.listPrimitives()) {
    const pos = p.getAttribute('POSITION'), uv = p.getAttribute('TEXCOORD_0'), ix = p.getIndices(), n = ix.getCount() / 3;
    const a = [], b = [], c = [], ua = [], ub = [], uc = []; let U = 0, W = 0, zeroW = 0, zeroU = 0, out = 0; const ratio = [];
    for (let t = 0; t < n; t++) {
      const i0 = ix.getScalar(3 * t), i1 = ix.getScalar(3 * t + 1), i2 = ix.getScalar(3 * t + 2);
      pos.getElement(i0, a); pos.getElement(i1, b); pos.getElement(i2, c); uv.getElement(i0, ua); uv.getElement(i1, ub); uv.getElement(i2, uc);
      const e1 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], e2 = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
      const w = 0.5 * Math.hypot(e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]);
      const u = 0.5 * Math.abs((ub[0] - ua[0]) * (uc[1] - ua[1]) - (uc[0] - ua[0]) * (ub[1] - ua[1]));
      U += u; W += w; if (w < 1e-12) zeroW++; if (u < 1e-14) zeroU++;
      for (const q of [ua, ub, uc]) if (q[0] < -1e-4 || q[0] > 1.0001 || q[1] < -1e-4 || q[1] > 1.0001) { out++; break; }
      if (w > 1e-12) ratio.push(u / w);
    }
    ratio.sort((x, y) => x - y); const med = ratio[ratio.length >> 1], p99 = ratio[Math.floor(ratio.length * 0.99)], top = ratio.slice(Math.floor(ratio.length * 0.99));
    const topShare = top.reduce((s, r) => s, 0);
    console.log(`${f.split('/').pop()}: ${n} triangles; the sheet covered ${(100 * U).toFixed(1)}% in sum; no area in the world ${zeroW}, none on the sheet ${zeroU}, off the sheet ${out}; sheet per world area median ${med.toExponential(2)}, 99th ${p99.toExponential(2)}, max ${ratio[ratio.length - 1].toExponential(2)}`);
  }
}
