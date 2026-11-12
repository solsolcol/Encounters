/* v26.1 · OVERLAP ON A SHEET, counted: each triangle's coordinates rasterized at 1024 (texel centres inside it), and the
   texels that two triangles of DIFFERENT charts both claim are counted. A sheet laid out again (tools/repaint.py) must have
   none to speak of: two pieces of a body on one texel paint one with the other's colour. Read through gltf-transform, so a
   quantized, meshopt-packed file is read as the game reads it.
     node tools/probes/uvoverlap.mjs <file.glb> [...] */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder, MeshoptEncoder } from 'meshoptimizer';
await MeshoptDecoder.ready; await MeshoptEncoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder, 'meshopt.encoder': MeshoptEncoder });
const R = 1024;
for (const f of process.argv.slice(2)) {
  const doc = await io.read(f);
  for (const mesh of doc.getRoot().listMeshes()) for (const p of mesh.listPrimitives()) {
    const uvA = p.getAttribute('TEXCOORD_0'), ix = p.getIndices(), nV = uvA.getCount(), m = ix.getCount() / 3;
    const U = new Float64Array(nV * 2), e = []; for (let v = 0; v < nV; v++) { uvA.getElement(v, e); U[2 * v] = e[0]; U[2 * v + 1] = e[1]; }
    const par = new Int32Array(nV).map((_, i) => i), fd = (x) => { while (par[x] !== x) { par[x] = par[par[x]]; x = par[x]; } return x; };
    const I = new Uint32Array(m * 3); for (let k = 0; k < m * 3; k++) I[k] = ix.getScalar(k);
    for (let t = 0; t < m; t++) { const a = fd(I[3 * t]), b = fd(I[3 * t + 1]), c = fd(I[3 * t + 2]); par[b] = a; par[fd(c)] = a; }
    const owner = new Int32Array(R * R).fill(-1), clash = new Uint8Array(R * R); let charts = new Set();
    for (let t = 0; t < m; t++) {
      const c = fd(I[3 * t]); charts.add(c);
      const x0 = U[2 * I[3 * t]] * R, y0 = U[2 * I[3 * t] + 1] * R, x1 = U[2 * I[3 * t + 1]] * R, y1 = U[2 * I[3 * t + 1] + 1] * R, x2 = U[2 * I[3 * t + 2]] * R, y2 = U[2 * I[3 * t + 2] + 1] * R;
      const d = (y1 - y2) * (x0 - x2) + (x2 - x1) * (y0 - y2); if (Math.abs(d) < 1e-12) continue;
      const bx0 = Math.max(0, Math.floor(Math.min(x0, x1, x2))), bx1 = Math.min(R - 1, Math.ceil(Math.max(x0, x1, x2))), by0 = Math.max(0, Math.floor(Math.min(y0, y1, y2))), by1 = Math.min(R - 1, Math.ceil(Math.max(y0, y1, y2)));
      for (let y = by0; y <= by1; y++) for (let x = bx0; x <= bx1; x++) {
        const px = x + 0.5, py = y + 0.5, l0 = ((y1 - y2) * (px - x2) + (x2 - x1) * (py - y2)) / d, l1 = ((y2 - y0) * (px - x2) + (x0 - x2) * (py - y2)) / d;
        if (l0 < 0 || l1 < 0 || l0 + l1 > 1) continue;
        const k = y * R + x, o = owner[k]; if (o < 0) owner[k] = c; else if (o !== c) clash[k] = 1;
      }
    }
    let used = 0, cl = 0; for (let k = 0; k < R * R; k++) { if (owner[k] >= 0) used++; if (clash[k]) cl++; }
    console.log(`${f.split('/').pop()}: ${m} triangles in ${charts.size} charts; ${(100 * used / (R * R)).toFixed(1)}% of the sheet's texels used at ${R}, ${cl} claimed by two charts (${(100 * cl / Math.max(1, used)).toFixed(3)}%)`);
  }
}
