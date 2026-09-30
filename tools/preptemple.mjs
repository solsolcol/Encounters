/* v16.9 — the Lanna temple for episode 3 chapter 1 (Chad: "replace the main
   temple you built, with this new temple model"). OFFLINE prep, the second
   half of masters/v16.8/temple/bake.mjs (which turns every face outward,
   classes it and bakes AO into COLOR_0).

   What this does to the baked file:
   1. CUTS three regions out of the mesh, clipping triangles against the box
      (a triangle across a box edge keeps exactly the part outside it — a
      cut by centroid would tear holes wider than the box):
      - the model's own front STAIR, its cheek walls and its stylised nagas
        (they become a proper staircase and Chad's own nagas in the chapter);
      - the tails of those cheek walls on the landing;
      - the WEST DOOR: the wall under the middle window pair, its mullion
        and the balustrade in front of it (the walkway to the Ajarn's room
        leaves from there — the model has no veranda to walk round).
   2. Places it in WORLD METRES: x = mx·0.2, y = (my − 21.15)·0.2,
      z = (mz + 9.5)·0.2 — base foot on y 0, the landing's front edge on
      z 0. The chapter's shader maps back to model units for its patterns.
   3. Simplifies per class (the gold carving is 451k of the 489k
      triangles), welds, and packs with meshopt + quantization.
     node tools/preptemple.mjs <baked.glb> <out.glb> */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { weld, meshopt, prune, dedup, simplifyPrimitive } from '@gltf-transform/functions';
import { MeshoptSimplifier, MeshoptEncoder, MeshoptDecoder } from 'meshoptimizer';

const [,, IN, OUT] = process.argv;
await Promise.all([MeshoptSimplifier.ready, MeshoptEncoder.ready, MeshoptDecoder.ready]);
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({
  'meshopt.encoder': MeshoptEncoder, 'meshopt.decoder': MeshoptDecoder });
const doc = await io.read(IN);
const root = doc.getRoot();

export const S = 0.2, OY = 21.15, OZ = -9.5;
const INF = 1e9;
/* the cuts, in MODEL units: [x0, x1, y0, y1, z0, z1] */
const CUTS = [
  [-15.7, 15.7, 15, 45, -9.35, INF],          // the front stair, its cheek walls, its nagas (the roof is all above 45)
  [-15.7, -12.0, 33.6, 45, -15.3, -9.35],     // the cheek walls' tails on the landing
  [12.0, 15.7, 33.6, 45, -15.3, -9.35],
  [-36.0, -26.5, 33.6, 51.9, -54.9, -48.1],   // the west door: under the middle window, its mullion, the balustrade
];
/* v16.9, Chad: "why did u cut the temple down? now it loses all its details" —
   so NOTHING is simplified: every triangle of the model ships (the first
   pass took the carving from 451k to 72k and the rosettes lost their
   filigree). Ratio 1 skips the class; the gold's own path below is kept for
   the day a far LOD is wanted, and is skipped at 1 too. */
/* the classes drawn flatShading, shipped with no NORMAL: 'gold' in the v16.8
   bake's classes, 'carve' in v17.0's parts (masters/v16.9/temple/relabel.mjs) */
const FLAT = new Set(['gold', 'carve']);
const SIMP = { gold: [1, 0], roof: [1, 0], soffit: [1, 0], white: [1, 0], base: [1, 0], red: [1, 0], floor: [1, 0] };

/* Sutherland–Hodgman against one plane: keep the part where s·(p[ax] − v) >= 0 */
function clip(poly, ax, v, s) {
  const out = [];
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length];
    const da = s * (a[ax] - v), db = s * (b[ax] - v);
    if (da >= 0) out.push(a);
    if ((da >= 0) !== (db >= 0)) {
      const t = da / (da - db);
      out.push(a.map((c, k) => c + (b[k] - c) * t));
    }
  }
  return out;
}
/* T minus box: the pieces outside each face in turn, clipping what is left */
function subtract(tri, B) {
  const out = [];
  let poly = tri;
  const faces = [[0, B[0], -1], [0, B[1], 1], [1, B[2], -1], [1, B[3], 1], [2, B[4], -1], [2, B[5], 1]];
  for (const [ax, v, s] of faces) {
    const o = clip(poly, ax, v, s);
    if (o.length >= 3) out.push(o);
    poly = clip(poly, ax, v, -s);
    if (poly.length < 3) break;
  }
  return out;
}
const inBox = (p, B) => p[0] > B[0] && p[0] < B[1] && p[1] > B[2] && p[1] < B[3] && p[2] > B[4] && p[2] < B[5];
const outBox = (tri, B) =>
  tri.every(p => p[0] <= B[0]) || tri.every(p => p[0] >= B[1]) || tri.every(p => p[1] <= B[2]) ||
  tri.every(p => p[1] >= B[3]) || tri.every(p => p[2] <= B[4]) || tri.every(p => p[2] >= B[5]);

const buffer = root.listBuffers()[0];
let before = 0, after = 0;
for (const node of root.listNodes()) {
  const mesh = node.getMesh(); if (!mesh) continue;
  const cls = node.getName().replace('temple_', '');
  for (const prim of mesh.listPrimitives()) {
    const P = prim.getAttribute('POSITION'), N = prim.getAttribute('NORMAL'), C = prim.getAttribute('COLOR_0');
    const I = prim.getIndices();
    const nc = C.getElementSize();
    const vert = (i) => { const p = P.getElement(i, []), n = N.getElement(i, []), c = C.getElement(i, []); return [...p, ...n, ...c]; };
    let tris = [];
    for (let t = 0; t < I.getCount() / 3; t++) tris.push([vert(I.getScalar(3 * t)), vert(I.getScalar(3 * t + 1)), vert(I.getScalar(3 * t + 2))]);
    before += tris.length;
    for (const B of CUTS) {
      const next = [];
      for (const tri of tris) {
        if (outBox(tri, B)) { next.push(tri); continue; }
        if (tri.every(p => inBox(p, B))) continue;
        for (const poly of subtract(tri, B)) for (let k = 1; k + 1 < poly.length; k++) next.push([poly[0], poly[k], poly[k + 1]]);
      }
      tris = next;
    }
    /* drop the slivers a clip can leave */
    tris = tris.filter(([a, b, c]) => {
      const ux = b[0] - a[0], uy = b[1] - a[1], uz = b[2] - a[2], vx = c[0] - a[0], vy = c[1] - a[1], vz = c[2] - a[2];
      return Math.hypot(uy * vz - uz * vy, uz * vx - ux * vz, ux * vy - uy * vx) > 1e-6;
    });
    const n = tris.length * 3;
    const pos = new Float32Array(n * 3), nrm = new Float32Array(n * 3), col = new Float32Array(n * nc);
    let o = 0;
    for (const tri of tris) for (const p of tri) {
      pos[3 * o] = p[0] * S; pos[3 * o + 1] = (p[1] - OY) * S; pos[3 * o + 2] = (p[2] - OZ) * S;
      const L = Math.hypot(p[3], p[4], p[5]) || 1;
      nrm[3 * o] = p[3] / L; nrm[3 * o + 1] = p[4] / L; nrm[3 * o + 2] = p[5] / L;
      for (let k = 0; k < nc; k++) col[nc * o + k] = p[6 + k];
      o++;
    }
    const idx = new Uint32Array(n); for (let i = 0; i < n; i++) idx[i] = i;
    prim.setAttribute('POSITION', doc.createAccessor().setType('VEC3').setArray(pos).setBuffer(buffer));
    /* the carving is FLAT-shaded in the file (every triangle its own normals),
       and a simplifier will not collapse an edge across an attribute seam —
       so with its normals it floors at a third of its triangles (the v8.0
       law, again). The gold ships without NORMAL and is drawn flatShading,
       which the carving wants anyway: its facets are its relief. */
    prim.setAttribute('NORMAL', FLAT.has(cls) ? null : doc.createAccessor().setType('VEC3').setArray(nrm).setBuffer(buffer));
    prim.setAttribute('COLOR_0', doc.createAccessor().setType(nc === 4 ? 'VEC4' : 'VEC3').setArray(col).setBuffer(buffer));
    prim.setIndices(doc.createAccessor().setType('SCALAR').setArray(idx).setBuffer(buffer));
    node.setExtras({ cls });
  }
}
await doc.transform(prune(), dedup(), weld());
/* per class: its own ratio and error (the carving takes almost all of it) */
for (const node of root.listNodes()) {
  const mesh = node.getMesh(); if (!mesh) continue;
  const cls = node.getName().replace('temple_', ''), [ratio, error] = SIMP[cls] || [1, 0.0001];
  if (ratio >= 1) continue;
  for (const prim of mesh.listPrimitives()) {
    if (cls !== 'gold') { simplifyPrimitive(prim, { simplifier: MeshoptSimplifier, ratio, error }); continue; }
    /* the carving is thousands of small separate pieces, all BORDER, which
       the plain simplifier keeps: Prune drops the pieces smaller than the
       error and Permissive lets edges collapse along the borders */
    /* and it is simplified BY WHERE IT IS SEEN FROM: the rosettes and the
       door's frame on the front facade, low down, are at arm's length from
       the landing (kept at 0.45); the back facade low down is seen only
       from behind the temple (0.15); the gables and the roof's edges are
       metres over anyone's head (GOLD_HIGH) */
    const pos = prim.getAttribute('POSITION').getArray(), all = prim.getIndices().getArray();
    const parts = { front: [], back: [], high: [] };
    for (let t = 0; t < all.length / 3; t++) {
      let y = 0, z = 0;
      for (let k = 0; k < 3; k++) { y += pos[3 * all[3 * t + k] + 1] / 3; z += pos[3 * all[3 * t + k] + 2] / 3; }
      /* (positions are world metres now: model y 56 → 6.97, model z −24 → −2.9) */
      parts[y > (56 - OY) * S ? 'high' : z > (-24 - OZ) * S ? 'front' : 'back'].push(all[3 * t], all[3 * t + 1], all[3 * t + 2]);
    }
    const R = { front: [0.45, 0.0004], back: [0.15, error], high: [ratio, error] };
    const merged = [];
    for (const [k, list] of Object.entries(parts)) {
      const idx = new Uint32Array(list), [r, e] = R[k];
      const [out, err] = MeshoptSimplifier.simplify(idx, pos, 3, Math.floor(idx.length * r / 3) * 3, e, ['Prune', 'Permissive']);
      console.log('  gold', k, idx.length / 3, '->', out.length / 3, 'error', err.toFixed(5));
      for (const i of out) merged.push(i);
    }
    prim.setIndices(doc.createAccessor().setType('SCALAR').setArray(new Uint32Array(merged)).setBuffer(buffer));
  }
}
for (const node of root.listNodes()) {
  const mesh = node.getMesh(); if (!mesh) continue;
  for (const prim of mesh.listPrimitives()) after += (prim.getIndices()?.getCount() ?? 0) / 3;
}
await doc.transform(prune(), meshopt({ encoder: MeshoptEncoder, level: 'medium' }));
await io.write(OUT, doc);
console.log(`triangles ${before} -> ${after}`);
for (const node of root.listNodes()) { const m = node.getMesh(); if (m) console.log('  ', node.getName(), m.listPrimitives().map(p => (p.getIndices()?.getCount() ?? 0) / 3).join(',')); }
