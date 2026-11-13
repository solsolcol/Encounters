/* v26.2 · WHERE A STRING OF FLAGS MEETS A TREE'S CROWN. node tools/probes/stringend.mjs '<json>' where json is
   { top: [x, y, z], trees: [{ key, x, z, h, ry, centre }], ends: [[x, y, z], ...] }: each string is walked from the pole's
   top toward its end along the curve b_world2.js draws (its sag 7 % of its length), and the first point within CLEAR m of
   any of the trees' own vertices (fitted as stand() or grove() fits them) is reported, with how far along it lies. */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder } from 'meshoptimizer';
await MeshoptDecoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder });
const A = JSON.parse(process.argv[2]), CLEAR = +(process.env.CLEAR || 0.45);
const mul = (a, b) => { const o = new Array(16).fill(0); for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) for (let k = 0; k < 4; k++) o[c * 4 + r] += a[k * 4 + r] * b[c * 4 + k]; return o; };
const cache = {};
async function pts(key) { if (cache[key]) return cache[key];
  const doc = await io.read('assets/' + key + '.glb'), out = [];
  const walk = (node, M) => { const W = mul(M, node.getMatrix()), mesh = node.getMesh();
    if (mesh) for (const prim of mesh.listPrimitives()) { const a = prim.getAttribute('POSITION'); if (!a) continue; const v = [0, 0, 0];
      for (let i = 0; i < a.getCount(); i++) { a.getElement(i, v); out.push([W[0] * v[0] + W[4] * v[1] + W[8] * v[2] + W[12], W[1] * v[0] + W[5] * v[1] + W[9] * v[2] + W[13], W[2] * v[0] + W[6] * v[1] + W[10] * v[2] + W[14]]); } }
    for (const c of node.listChildren()) walk(c, W); };
  const sc = doc.getRoot().getDefaultScene() || doc.getRoot().listScenes()[0];
  for (const n of sc.listChildren()) walk(n, [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]);
  return cache[key] = out; }
/* every tree's vertices in the world, in a grid of half-metre cells */
const grid = new Map(), G = 0.5, gk = (x, y, z) => Math.floor(x / G) + ',' + Math.floor(y / G) + ',' + Math.floor(z / G);
for (const T of A.trees) {
  const P = await pts(T.key); let bb = [[1e9, 1e9, 1e9], [-1e9, -1e9, -1e9]];
  for (const p of P) for (let k = 0; k < 3; k++) { bb[0][k] = Math.min(bb[0][k], p[k]); bb[1][k] = Math.max(bb[1][k], p[k]); }
  const s = T.h / (bb[1][1] - bb[0][1]), cx = T.centre ? (bb[0][0] + bb[1][0]) / 2 : 0, cz = T.centre ? (bb[0][2] + bb[1][2]) / 2 : 0, c = Math.cos(T.ry || 0), sn = Math.sin(T.ry || 0);
  for (const p of P) { const lx = (p[0] - cx) * s, ly = (p[1] - bb[0][1]) * s, lz = (p[2] - cz) * s;
    const wx = T.x + lx * c + lz * sn, wz = T.z - lx * sn + lz * c; const k = gk(wx, ly, wz); let L = grid.get(k); if (!L) grid.set(k, L = []); L.push([wx, ly, wz]); }
}
const near = (x, y, z) => { let best = 1e9;
  for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) for (let k = -1; k <= 1; k++) { const L = grid.get((Math.floor(x / G) + i) + ',' + (Math.floor(y / G) + j) + ',' + (Math.floor(z / G) + k)); if (!L) continue;
    for (const q of L) { const d = Math.hypot(q[0] - x, q[1] - y, q[2] - z); if (d < best) best = d; } }
  return best; };
const lp = (a, b, k) => a + (b - a) * k, TOP = A.top;
for (const e of A.ends) {
  const len = Math.hypot(e[0] - TOP[0], e[1] - TOP[1], e[2] - TOP[2]), sag = len * 0.07; let hit = null;
  for (let i = 0; i <= 400; i++) { const k = i / 400, x = lp(TOP[0], e[0], k), y = lp(TOP[1], e[1], k) - Math.sin(k * Math.PI) * sag, z = lp(TOP[2], e[2], k);
    /* (a flag hangs 0.24 m under the string: the string and the flag's foot both kept clear) */
    const d = Math.min(near(x, y, z), near(x, y - 0.24, z));
    if (d < CLEAR) { hit = { k, at: [x, y, z].map(v => +v.toFixed(2)), d: +d.toFixed(2) }; break; } }
  console.log(JSON.stringify({ end: e, len: +len.toFixed(2), hit }));
}
