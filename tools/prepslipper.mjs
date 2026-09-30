/* v16.9 — Chad's slipper (Sketchfab "slipper", a pair of flip-flops lying
   as if kicked off; 54,680 triangles, one plain material, no textures):
   "Replace all your generated slippers, with this slipper model, but change
   the colour to vary it on the shelf." OFFLINE prep.

   Out comes one file with two nodes, in METRES, Y up, base on y 0:
   - `pair`: the pair exactly as Chad's file lays it (kicked off — the pairs
     left on the paving), centred on the pair;
   - `one`: ONE slipper of it, turned so its toe points +z and centred on
     its own sole, for pairs set neatly side by side on the rack (the other
     foot is the same slipper mirrored in x by the chapter).
   The two slippers are told apart by splitting the triangles into two
   clusters by where they lie (they do not touch). Scaled so one slipper is
   0.27 m long. Simplified to RATIO (the chapter draws ~18 pairs), then
   meshopt. The chapter colours each pair by instance.
     node tools/prepslipper.mjs <in.glb> <out.glb> [ratio] */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { weld, meshopt, prune, simplify } from '@gltf-transform/functions';
import { MeshoptSimplifier, MeshoptEncoder, MeshoptDecoder } from 'meshoptimizer';

const [,, IN, OUT, R] = process.argv;
const mn = a => a.reduce((x, y) => (y < x ? y : x), Infinity), mxx = a => a.reduce((x, y) => (y > x ? y : x), -Infinity);
const RATIO = Number(R || 0.2);
await Promise.all([MeshoptSimplifier.ready, MeshoptEncoder.ready, MeshoptDecoder.ready]);
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({
  'meshopt.encoder': MeshoptEncoder, 'meshopt.decoder': MeshoptDecoder });
const src = await io.read(IN);

/* every triangle in world space (the file's root turns Z-up to Y-up) */
const T = [];
const mul = (m, p) => [m[0] * p[0] + m[4] * p[1] + m[8] * p[2] + m[12], m[1] * p[0] + m[5] * p[1] + m[9] * p[2] + m[13], m[2] * p[0] + m[6] * p[1] + m[10] * p[2] + m[14]];
for (const n of src.getRoot().listNodes()) {
  const m = n.getMesh(); if (!m) continue;
  const W = n.getWorldMatrix();
  for (const p of m.listPrimitives()) {
    const a = p.getAttribute('POSITION'), ix = p.getIndices();
    for (let i = 0; i < ix.getCount(); i += 3) T.push([0, 1, 2].map(k => mul(W, a.getElement(ix.getScalar(i + k), []))));
  }
}
/* two clusters by centroid (2-means in x/z, seeded at the extremes of x) */
const cen = T.map(t => [(t[0][0] + t[1][0] + t[2][0]) / 3, (t[0][2] + t[1][2] + t[2][2]) / 3]);
let c0 = cen.reduce((a, b) => (b[0] < a[0] ? b : a)), c1 = cen.reduce((a, b) => (b[0] > a[0] ? b : a));
let lab = [];
for (let it = 0; it < 20; it++) {
  lab = cen.map(c => ((c[0] - c0[0]) ** 2 + (c[1] - c0[1]) ** 2 <= (c[0] - c1[0]) ** 2 + (c[1] - c1[1]) ** 2 ? 0 : 1));
  const mean = (k) => { let x = 0, z = 0, n = 0; cen.forEach((c, i) => { if (lab[i] === k) { x += c[0]; z += c[1]; n++; } }); return [x / n, z / n]; };
  c0 = mean(0); c1 = mean(1);
}
const parts = [T.filter((_, i) => lab[i] === 0), T.filter((_, i) => lab[i] === 1)];
console.log('clusters', parts.map(p => p.length));
/* the slipper's long axis: the principal direction of its vertices in x/z */
function axis(tris) {
  let mx = 0, mz = 0, n = 0; for (const t of tris) for (const p of t) { mx += p[0]; mz += p[2]; n++; } mx /= n; mz /= n;
  let sxx = 0, szz = 0, sxz = 0; for (const t of tris) for (const p of t) { const dx = p[0] - mx, dz = p[2] - mz; sxx += dx * dx; szz += dz * dz; sxz += dx * dz; }
  const ang = 0.5 * Math.atan2(2 * sxz, sxx - szz);
  return { mx, mz, ang };
}
const one = parts[0], ax = axis(one);
/* turn so the long axis lies along z; the toe is the NARROWER end */
const rot = (p, a) => [p[0] * Math.cos(a) - p[2] * Math.sin(a), p[1], p[0] * Math.sin(a) + p[2] * Math.cos(a)];
let turn = Math.PI / 2 - ax.ang;
let pts = one.map(t => t.map(p => rot([p[0] - ax.mx, p[1], p[2] - ax.mz], turn)));
const zs = pts.flat().map(p => p[2]), zmin = mn(zs), zmax = mxx(zs);
const width = (lo, hi) => { const xs = pts.flat().filter(p => p[2] >= lo && p[2] <= hi).map(p => p[0]); return mxx(xs) - mn(xs); };
const L = zmax - zmin, wLo = width(zmin, zmin + L * 0.2), wHi = width(zmax - L * 0.2, zmax);
/* a flip-flop is wider at the toe than the heel: the toe must point +z */
if (wLo > wHi) pts = pts.map(t => t.map(p => [-p[0], p[1], -p[2]]));
const S = 0.27 / L;
const fit = (tris, cx, cz) => {
  const ys = tris.flat().map(p => p[1]), y0 = mn(ys);
  return tris.map(t => t.map(p => [(p[0] - cx) * S, (p[1] - y0) * S, (p[2] - cz) * S]));
};
const oneT = (() => { const all = pts.flat(); const xs = all.map(p => p[0]), zz = all.map(p => p[2]);
  return fit(pts, (mn(xs) + mxx(xs)) / 2, (mn(zz) + mxx(zz)) / 2); })();
const pairT = (() => { const all = T.flat(); const xs = all.map(p => p[0]), zz = all.map(p => p[2]);
  return fit(T, (mn(xs) + mxx(xs)) / 2, (mn(zz) + mxx(zz)) / 2); })();

/* a fresh document: two nodes, POSITION only (the chapter lights them smooth
   from recomputed normals: the file's normals are per-face) */
const { Document } = await import('@gltf-transform/core');
const doc = new Document(); const buf = doc.createBuffer(); const scene = doc.createScene();
const mat = doc.createMaterial('slipper').setBaseColorFactor([1, 1, 1, 1]).setRoughnessFactor(0.7).setMetallicFactor(0);
for (const [name, tris] of [['one', oneT], ['pair', pairT]]) {
  const pos = new Float32Array(tris.length * 9); let o = 0; for (const t of tris) for (const p of t) { pos.set(p, o); o += 3; }
  const prim = doc.createPrimitive().setAttribute('POSITION', doc.createAccessor().setType('VEC3').setArray(pos).setBuffer(buf)).setMaterial(mat);
  prim.setIndices(doc.createAccessor().setType('SCALAR').setArray(Uint32Array.from({ length: tris.length * 3 }, (_, i) => i)).setBuffer(buf));
  const mesh = doc.createMesh(name).addPrimitive(prim);
  const node = doc.createNode(name).setMesh(mesh); scene.addChild(node);
}
const count = () => doc.getRoot().listMeshes().map(m => m.getName() + ' ' + (m.listPrimitives()[0].getIndices().getCount() / 3));
console.log('before', count().join(', '), 'slipper', L.toFixed(1), 'units long, toe/heel widths', wHi.toFixed(1), wLo.toFixed(1));
await doc.transform(weld(), simplify({ simplifier: MeshoptSimplifier, ratio: RATIO, error: 0.002 }), prune(), meshopt({ encoder: MeshoptEncoder, level: 'medium' }));
await io.write(OUT, doc);
console.log('after', count().join(', '));
