/* v26.2 · the HOLES in a model's surface: node tools/probes/openings.mjs <file.glb> [ymin] [ymax]
   Every mesh's corners welded by place (a tenth of a millimetre: a generated sheet splits a corner at every chart's edge),
   every edge counted by the triangles that use it; an edge only one triangle uses is an open edge, and open edges chained
   into loops are the openings. Prints each loop (its corners, its middle, its span), smallest first: a loop of three to a
   dozen corners inside a surface is a hole, a long one a garment's hem or a neck's opening. The file's own space (a skinned
   body in its bind pose, metres if the file was prepared so) */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder } from 'meshoptimizer';
await MeshoptDecoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder });
const [file, ymin = '-1e9', ymax = '1e9'] = process.argv.slice(2);
const doc = await io.read(file);
const mul = (a, b) => { const o = new Array(16).fill(0); for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) for (let k = 0; k < 4; k++) o[c * 4 + r] += a[k * 4 + r] * b[c * 4 + k]; return o; };
const out = [];
const walk = (node, M) => { const W = mul(M, node.getMatrix()), mesh = node.getMesh();
  if (mesh) mesh.listPrimitives().forEach((prim, pi) => { const a = prim.getAttribute('POSITION'), ix = prim.getIndices(); if (!a) return;
    const n = a.getCount(), P = new Float64Array(n * 3), v = [0, 0, 0];
    for (let i = 0; i < n; i++) { a.getElement(i, v); P[i * 3] = W[0] * v[0] + W[4] * v[1] + W[8] * v[2] + W[12]; P[i * 3 + 1] = W[1] * v[0] + W[5] * v[1] + W[9] * v[2] + W[13]; P[i * 3 + 2] = W[2] * v[0] + W[6] * v[1] + W[10] * v[2] + W[14]; }
    const key = new Map(), id = new Int32Array(n);
    for (let i = 0; i < n; i++) { const k = Math.round(P[i * 3] * 1e4) + ',' + Math.round(P[i * 3 + 1] * 1e4) + ',' + Math.round(P[i * 3 + 2] * 1e4); if (!key.has(k)) key.set(k, i); id[i] = key.get(k); }
    const tri = ix ? ix.getArray() : Uint32Array.from({ length: n }, (_, i) => i), E = new Map();
    for (let t = 0; t < tri.length; t += 3) for (let e = 0; e < 3; e++) { const p = id[tri[t + e]], q = id[tri[t + (e + 1) % 3]]; if (p === q) continue; const k = p < q ? p + '_' + q : q + '_' + p; E.set(k, (E.get(k) || 0) + 1); }
    const adj = new Map(); for (const [k, c] of E) if (c === 1) { const [p, q] = k.split('_').map(Number); (adj.get(p) || adj.set(p, []).get(p)).push(q); (adj.get(q) || adj.set(q, []).get(q)).push(p); }
    const seen = new Set();
    for (const s of adj.keys()) { if (seen.has(s)) continue; const loop = [], st = [s]; seen.add(s);
      while (st.length) { const u = st.pop(); loop.push(u); for (const w of adj.get(u)) if (!seen.has(w)) { seen.add(w); st.push(w); } }
      let cx = 0, cy = 0, cz = 0, x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9, z0 = 1e9, z1 = -1e9;
      for (const u of loop) { const x = P[u * 3], y = P[u * 3 + 1], z = P[u * 3 + 2]; cx += x; cy += y; cz += z; x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); z0 = Math.min(z0, z); z1 = Math.max(z1, z); }
      cx /= loop.length; cy /= loop.length; cz /= loop.length;
      if (cy < +ymin || cy > +ymax) continue;
      out.push({ mesh: node.getName() + '#' + pi, corners: loop.length, at: [cx, cy, cz].map(x => +x.toFixed(3)), span: +Math.max(x1 - x0, y1 - y0, z1 - z0).toFixed(3) }); }
    /* and every triangle TURNED AWAY from its own corners' normals (wound backwards): drawn one-sided it is a hole that shows
       what lies behind it, the inside of a hair's shell, dark */
    const nA = prim.getAttribute('NORMAL'); if (nA) { const N = [0, 0, 0], m = [0, 0, 0];
      for (let t = 0; t < tri.length; t += 3) { const i0 = tri[t], i1 = tri[t + 1], i2 = tri[t + 2];
        const ux = P[i1 * 3] - P[i0 * 3], uy = P[i1 * 3 + 1] - P[i0 * 3 + 1], uz = P[i1 * 3 + 2] - P[i0 * 3 + 2], vx = P[i2 * 3] - P[i0 * 3], vy = P[i2 * 3 + 1] - P[i0 * 3 + 1], vz = P[i2 * 3 + 2] - P[i0 * 3 + 2];
        let fx = uy * vz - uz * vy, fy = uz * vx - ux * vz, fz = ux * vy - uy * vx; const fl = Math.hypot(fx, fy, fz); if (fl < 1e-12) continue; fx /= fl; fy /= fl; fz /= fl;
        m[0] = m[1] = m[2] = 0; for (const i of [i0, i1, i2]) { nA.getElement(i, N); m[0] += N[0]; m[1] += N[1]; m[2] += N[2]; }
        const ml = Math.hypot(m[0], m[1], m[2]); if (ml < 1e-9) continue;
        const d = (fx * m[0] + fy * m[1] + fz * m[2]) / ml, cy = (P[i0 * 3 + 1] + P[i1 * 3 + 1] + P[i2 * 3 + 1]) / 3;
        if (d < -0.5 && cy >= +ymin && cy <= +ymax) out.push({ mesh: node.getName() + '#' + pi, turned: t / 3, dot: +d.toFixed(2), at: [(P[i0 * 3] + P[i1 * 3] + P[i2 * 3]) / 3, cy, (P[i0 * 3 + 2] + P[i1 * 3 + 2] + P[i2 * 3 + 2]) / 3].map(x => +x.toFixed(3)), span: +Math.sqrt(fl).toFixed(3) }); } } });
  for (const c of node.listChildren()) walk(c, W); };
const sc = doc.getRoot().getDefaultScene() || doc.getRoot().listScenes()[0];
for (const nd of sc.listChildren()) walk(nd, [1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]);
out.sort((a, b) => a.span - b.span);
console.log(out.length, 'openings'); for (const o of out.slice(0, +(process.env.TOP || 40))) console.log(JSON.stringify(o));
