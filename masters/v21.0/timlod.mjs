/* v21.0 · the LP Tim's LIGHT copy, for its case on the owner's counter (the
   full `timkp` takes over within 1.4 m, the v14.14 rule — every amulet shows
   full quality up close). Cut from the shipped timkp.glb, because the source
   scan is not kept: re-running prepamulet on it zeroed every normal (its
   normals are normalized int16 and came out of the simplifier at length 0 —
   the model rendered black). So: dequantize first, weld, simplify, recompute
   area-weighted normals across the seams by hand, 1024 sheets, meshopt.
     node masters/v21.0/timlod.mjs assets/timkp.glb assets/timkplod.glb 0.03 */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { dequantize, weld, simplify, prune, meshopt } from '@gltf-transform/functions';
import { MeshoptSimplifier, MeshoptEncoder, MeshoptDecoder } from 'meshoptimizer';
import sharp from 'sharp';
import fs from 'node:fs';
const [,, IN, OUT, R] = process.argv;
await Promise.all([MeshoptSimplifier.ready, MeshoptEncoder.ready, MeshoptDecoder.ready]);
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.encoder': MeshoptEncoder, 'meshopt.decoder': MeshoptDecoder });
const doc = await io.read(IN);
await doc.transform(dequantize(), weld(), simplify({ simplifier: MeshoptSimplifier, ratio: Number(R || 0.03), error: 0.002 }), prune());
let tris = 0;
for (const m of doc.getRoot().listMeshes()) for (const p of m.listPrimitives()) {
  const P = p.getAttribute('POSITION'), N = p.getAttribute('NORMAL'), I = p.getIndices();
  const n = P.getCount(), acc = new Float32Array(n * 3), key = new Map(), grp = new Int32Array(n);
  const a = [0, 0, 0], b = [0, 0, 0], c = [0, 0, 0];
  for (let i = 0; i < n; i++) { P.getElement(i, a); const k = a.map(v => v.toFixed(6)).join(','); if (!key.has(k)) key.set(k, i); grp[i] = key.get(k); }
  for (let t = 0; t < I.getCount(); t += 3) {
    const i0 = I.getScalar(t), i1 = I.getScalar(t + 1), i2 = I.getScalar(t + 2);
    P.getElement(i0, a); P.getElement(i1, b); P.getElement(i2, c);
    const ux = b[0] - a[0], uy = b[1] - a[1], uz = b[2] - a[2], vx = c[0] - a[0], vy = c[1] - a[1], vz = c[2] - a[2];
    const fx = uy * vz - uz * vy, fy = uz * vx - ux * vz, fz = ux * vy - uy * vx;          // area-weighted
    for (const i of [i0, i1, i2]) { const g = grp[i]; acc[g * 3] += fx; acc[g * 3 + 1] += fy; acc[g * 3 + 2] += fz; }
    tris++;
  }
  for (let i = 0; i < n; i++) { const g = grp[i]; let x = acc[g * 3], y = acc[g * 3 + 1], z = acc[g * 3 + 2]; const L = Math.hypot(x, y, z) || 1; N.setElement(i, [x / L, y / L, z / L]); }
}
for (const t of doc.getRoot().listTextures()) {
  const img = await sharp(Buffer.from(t.getImage())).resize(1024, 1024, { fit: 'fill' }).jpeg({ quality: 88 }).toBuffer();
  t.setImage(img).setMimeType('image/jpeg');
}
await doc.transform(prune(), meshopt({ encoder: MeshoptEncoder, level: 'medium' }));
await io.write(OUT, doc);
console.log(`timlod: ${tris} triangles, ${(fs.statSync(OUT).size / 1024).toFixed(0)} KB`);
