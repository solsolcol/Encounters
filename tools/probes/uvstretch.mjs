/* v26.1 debug (13 Nov 2026) · A SHEET COORDINATE THAT REACHES ACROSS THE SHEET. For each triangle of each part of a model:
   its edges on the colour sheet against its edges on the body. A triangle whose sheet edge is many times what its body
   edge asks (the median of the part) is painted with a streak of whatever lies along that reach: v26.1's repaint left 29
   such slivers on Ton's near body, a corner at the sheet's own corner (0, 0) (tools/repaint.py now mends them), and
   they drew two orange lines across his white trousers and a pale one down his face. A sound layout's largest sheet edge
   is a few hundredths of the sheet; a reach is most of it.
     node tools/probes/uvstretch.mjs <model.glb> [...]          (prints, per part: triangles, the median sheet-to-body
                                                                ratio, how many are over 8 times it, the largest sheet edge;
                                                                exits 1 if any part has a sheet edge over 0.25) */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder } from 'meshoptimizer';
await MeshoptDecoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder });
let bad = 0;
for (const file of process.argv.slice(2)) {
  const doc = await io.read(file);
  for (const mesh of doc.getRoot().listMeshes()) for (const p of mesh.listPrimitives()) {
    const P = p.getAttribute('POSITION'), U = p.getAttribute('TEXCOORD_0'), ix = p.getIndices();
    if (!P || !U || !ix) continue;
    const I = ix.getArray(), a = [], b = [], n = I.length / 3, worst = new Float64Array(n);
    let reach = 0;
    for (let t = 0; t < n; t++) for (let k = 0; k < 3; k++) {
      const i = I[t * 3 + k], j = I[t * 3 + (k + 1) % 3];
      P.getElement(i, a); P.getElement(j, b); const d3 = Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
      U.getElement(i, a); U.getElement(j, b); const du = Math.hypot(a[0] - b[0], a[1] - b[1]);
      if (d3 > 1e-6) worst[t] = Math.max(worst[t], du / d3);
      reach = Math.max(reach, du);
    }
    const s = Array.from(worst).sort((x, y) => x - y), med = s[Math.floor(s.length / 2)] || 0;
    const over = s.filter(x => x > med * 8).length;
    if (reach > 0.25) bad++;
    console.log(`${file} ${mesh.getName() || '(mesh)'}: ${n} triangles, median ${med.toFixed(3)}, over 8x ${over}, largest sheet edge ${reach.toFixed(4)}${reach > 0.25 ? '  <- REACHES ACROSS THE SHEET' : ''}`);
  }
}
process.exit(bad ? 1 : 0);
