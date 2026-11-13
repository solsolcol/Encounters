/* v26.2 · fit one model BESIDE another on a flat top, clear of it by a margin: node tools/probes/fitbeside.mjs <fixed key>
   <fixed x> <fixed z> <fixed ry> <moving key> <mirror 0|1> <x0> <x1> <z0> <z1> <ry0> <ry1> <margin> [xmax]
   The fixed model's points in the moving one's height band give, per 1 cm row of z, the extent of its outline on the side
   the moving one stands (the larger x); each candidate (x, z, ry) of the moving one is kept if every one of its points
   stands at least <margin> beyond that outline in its row (and inside xmax, the top's edge or a post's face), and the
   candidates are printed nearest the wanted place first (the middle of the ranges given). Both stand on the same top. */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder } from 'meshoptimizer';
await MeshoptDecoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder });
const mul = (a, b) => { const o = new Array(16).fill(0); for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) for (let k = 0; k < 4; k++) o[c * 4 + r] += a[k * 4 + r] * b[c * 4 + k]; return o; };
async function pts(key) { const doc = await io.read('assets/' + key + '.glb'), out = [];
  const walk = (node, M) => { const W = mul(M, node.getMatrix()), mesh = node.getMesh();
    if (mesh && !/_far$/.test(node.getName())) for (const prim of mesh.listPrimitives()) { const a = prim.getAttribute('POSITION'); if (!a) continue; const v = [0, 0, 0];
      for (let i = 0; i < a.getCount(); i++) { a.getElement(i, v); out.push([W[0] * v[0] + W[4] * v[1] + W[8] * v[2] + W[12], W[1] * v[0] + W[5] * v[1] + W[9] * v[2] + W[13], W[2] * v[0] + W[6] * v[1] + W[10] * v[2] + W[14]]); } }
    for (const c of node.listChildren()) walk(c, W); };
  const sc = doc.getRoot().getDefaultScene() || doc.getRoot().listScenes()[0];
  for (const nd of sc.listChildren()) walk(nd, [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]); return out; }
const A = process.argv.slice(2);
const [fk, fx, fz, fr, mk, mir, x0, x1, z0, z1, r0, r1, mg] = [A[0], +A[1], +A[2], +A[3], A[4], +A[5], +A[6], +A[7], +A[8], +A[9], +A[10], +A[11], +A[12]];
const XMAX = A[13] != null ? +A[13] : Infinity;
/* (ZLO, ZHI: the top's own edges in z, in the frame of the run; every point of the moving one stays between them) */
const ZLO = process.env.ZLO != null ? +process.env.ZLO : -Infinity, ZHI = process.env.ZHI != null ? +process.env.ZHI : Infinity;
const F = await pts(fk), Mv = await pts(mk);
const mh = Math.max(...Mv.map(p => p[1]));
/* the fixed outline: per cm row of z, the largest x of its points under the moving one's height */
const row = new Map(), cf = Math.cos(fr), sf = Math.sin(fr);
for (const [x, y, z] of F) { if (y > mh + 0.02) continue; const wx = fx + x * cf + z * sf, wz = fz - x * sf + z * cf, k = Math.round(wz * 100);
  row.set(k, Math.max(row.has(k) ? row.get(k) : -Infinity, wx)); }
const edgeAt = (z) => { const k = Math.round(z * 100); let m = -Infinity; for (let d = -1; d <= 1; d++) if (row.has(k + d)) m = Math.max(m, row.get(k + d)); return m; };
const res = [];
for (let ry = r0; ry <= r1 + 1e-9; ry += 0.05) { const c = Math.cos(ry), s = Math.sin(ry);
  for (let x = x0; x <= x1 + 1e-9; x += 0.01) for (let z = z0; z <= z1 + 1e-9; z += 0.01) {
    let gap = Infinity, wall = Infinity;
    for (const [px, , pz] of Mv) { const qx = mir ? -px : px; const wx = x + qx * c + pz * s, wz = z - qx * s + pz * c;
      gap = Math.min(gap, wx - edgeAt(wz)); wall = Math.min(wall, XMAX - wx, wz - ZLO, ZHI - wz); if (gap < mg || wall < 0) break; }
    if (gap >= mg && wall >= 0) res.push({ x: +x.toFixed(2), z: +z.toFixed(2), ry: +ry.toFixed(2), gap: +gap.toFixed(3), wall: +wall.toFixed(3) }); } }
const cx = (x0 + x1) / 2, cz = (z0 + z1) / 2, cr = (r0 + r1) / 2;
/* (SORT=clear: the roomiest first, the smaller of its two clearances largest) */
if (process.env.SORT === 'clear') res.sort((a, b) => Math.min(b.gap, b.wall) - Math.min(a.gap, a.wall));
else res.sort((a, b) => (Math.abs(a.x - cx) + Math.abs(a.z - cz) + 0.2 * Math.abs(a.ry - cr)) - (Math.abs(b.x - cx) + Math.abs(b.z - cz) + 0.2 * Math.abs(b.ry - cr)));
console.log(res.length, 'places clear by', mg, 'm; nearest the middle:'); for (const r of res.slice(0, 12)) console.log(JSON.stringify(r));
