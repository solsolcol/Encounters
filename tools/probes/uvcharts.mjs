/* v27.0 (R43) · WHICH PIECE OF A BODY EACH TEXEL OF A SHEET PAINTS. Every triangle drawn with the sheet that a material
   names as its colour (by the texture's name) is rasterized at R (texel centres inside it), and each texel is written with
   the number of the UV chart its triangle belongs to (triangles joined by a shared vertex, or by a vertex at the very same
   coordinates, are one chart; -1 where no triangle paints). Read through gltf-transform, so a quantized, meshopt-packed file
   is read as the game reads it. The map is written raw (Int32, little-endian, R x R, row 0 the image's top: glTF's v runs
   down the image), for tools/phoflecks.py to tell a speck lying inside a piece of robe from a small piece of skin.
     node tools/probes/uvcharts.mjs <file.glb> <texture name> <out.i32> [R=4096] */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder, MeshoptEncoder } from 'meshoptimizer';
import fs from 'node:fs';
await MeshoptDecoder.ready; await MeshoptEncoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder, 'meshopt.encoder': MeshoptEncoder });
const [FILE, TEX, OUT, RS] = process.argv.slice(2), R = +(RS || 4096);
if (!FILE || !TEX || !OUT) { console.error('usage: node tools/probes/uvcharts.mjs <file.glb> <texture name> <out.i32> [R]'); process.exit(1); }
const doc = await io.read(FILE);
const owner = new Int32Array(R * R).fill(-1);
let base = 0, prims = 0, tris = 0;
for (const mesh of doc.getRoot().listMeshes()) for (const p of mesh.listPrimitives()) {
  const mat = p.getMaterial(), tex = mat && mat.getBaseColorTexture();
  if (!tex || tex.getName() !== TEX) continue;
  const uvA = p.getAttribute('TEXCOORD_0'), ix = p.getIndices(); if (!uvA || !ix) continue;
  const nV = uvA.getCount(), m = ix.getCount() / 3;
  const U = new Float64Array(nV * 2), e = []; for (let v = 0; v < nV; v++) { uvA.getElement(v, e); U[2 * v] = e[0]; U[2 * v + 1] = e[1]; }
  const par = new Int32Array(nV).map((_, i) => i), fd = (x) => { while (par[x] !== x) { par[x] = par[par[x]]; x = par[x]; } return x; };
  /* a vertex split only for its normal sits at the very same coordinates: the same chart */
  const at = new Map(); for (let v = 0; v < nV; v++) { const k = Math.round(U[2 * v] * R * 64) + ',' + Math.round(U[2 * v + 1] * R * 64);
    const w = at.get(k); if (w === undefined) at.set(k, v); else { const a = fd(w), b = fd(v); if (a !== b) par[b] = a; } }
  const I = new Uint32Array(m * 3); for (let k = 0; k < m * 3; k++) I[k] = ix.getScalar(k);
  for (let t = 0; t < m; t++) { const a = fd(I[3 * t]), b = fd(I[3 * t + 1]); if (a !== b) par[b] = a; const c = fd(I[3 * t + 2]); if (c !== fd(I[3 * t])) par[c] = fd(I[3 * t]); }
  const ids = new Map(); let next = 0;
  for (let t = 0; t < m; t++) {
    const r = fd(I[3 * t]); let c = ids.get(r); if (c === undefined) { c = base + next++; ids.set(r, c); }
    const x0 = U[2 * I[3 * t]] * R, y0 = U[2 * I[3 * t] + 1] * R, x1 = U[2 * I[3 * t + 1]] * R, y1 = U[2 * I[3 * t + 1] + 1] * R, x2 = U[2 * I[3 * t + 2]] * R, y2 = U[2 * I[3 * t + 2] + 1] * R;
    const d = (y1 - y2) * (x0 - x2) + (x2 - x1) * (y0 - y2); if (Math.abs(d) < 1e-12) continue;
    const bx0 = Math.max(0, Math.floor(Math.min(x0, x1, x2))), bx1 = Math.min(R - 1, Math.ceil(Math.max(x0, x1, x2)));
    const by0 = Math.max(0, Math.floor(Math.min(y0, y1, y2))), by1 = Math.min(R - 1, Math.ceil(Math.max(y0, y1, y2)));
    for (let y = by0; y <= by1; y++) for (let x = bx0; x <= bx1; x++) {
      const px = x + 0.5, py = y + 0.5, l0 = ((y1 - y2) * (px - x2) + (x2 - x1) * (py - y2)) / d, l1 = ((y2 - y0) * (px - x2) + (x0 - x2) * (py - y2)) / d;
      if (l0 < 0 || l1 < 0 || l0 + l1 > 1) continue;
      owner[y * R + x] = c;
    }
  }
  base += next; prims++; tris += m;
}
fs.writeFileSync(OUT, Buffer.from(owner.buffer));
let used = 0; for (let k = 0; k < R * R; k++) if (owner[k] >= 0) used++;
console.log(`${FILE.split('/').pop()} '${TEX}': ${prims} primitives, ${tris} triangles, ${base} charts; ${(100 * used / (R * R)).toFixed(1)}% of the sheet painted at ${R} -> ${OUT}`);
