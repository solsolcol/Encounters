// v19.0 · find every monitor in the office's Computers mesh (after the prep's
// bake and x(0.74/0.55) scale) — connected pieces, their boxes — so the film
// can lay its scrolling code on the real screens. Prints pieces by size.
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { flatten, clearNodeTransform, dedup } from '@gltf-transform/functions';
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
const doc = await io.read(process.argv[2]); const root = doc.getRoot();
await doc.transform(dedup(), flatten());
for (const n of root.listNodes()) clearNodeTransform(n);
const S = 0.74 / 0.55;
const want = process.argv[3] || 'Desktop';
for (const m of root.listMeshes()) for (const p of m.listPrimitives()) {
  if (p.getMaterial().getName() !== want) continue;
  const pos = p.getAttribute('POSITION'), idx = p.getIndices().getArray(), N = pos.getCount();
  // weld by position, then union-find over triangles
  const key = new Map(), id = new Int32Array(N), v = [0, 0, 0];
  for (let i = 0; i < N; i++) { pos.getElement(i, v); const k = v.map(x => Math.round(x * 1e4)).join(','); if (!key.has(k)) key.set(k, key.size); id[i] = key.get(k); }
  const par = new Int32Array(key.size).map((_, i) => i);
  const f = x => { while (par[x] !== x) x = par[x] = par[par[x]]; return x; };
  for (let t = 0; t < idx.length; t += 3) { const a = f(id[idx[t]]), b = f(id[idx[t + 1]]), c = f(id[idx[t + 2]]); par[b] = a; par[f(c)] = a; }
  const box = new Map();
  for (let i = 0; i < N; i++) { pos.getElement(i, v); const r = f(id[i]); let b = box.get(r); if (!b) box.set(r, b = { mn: [1e9, 1e9, 1e9], mx: [-1e9, -1e9, -1e9], n: 0 }); b.n++; for (let k = 0; k < 3; k++) { b.mn[k] = Math.min(b.mn[k], v[k] * S); b.mx[k] = Math.max(b.mx[k], v[k] * S); } }
  const list = [...box.values()].map(b => ({ c: b.mn.map((x, k) => +((x + b.mx[k]) / 2).toFixed(3)), s: b.mn.map((x, k) => +(b.mx[k] - x).toFixed(3)), n: b.n }));
  list.sort((a, b) => a.c[0] - b.c[0] || a.c[2] - b.c[2]);
  console.log(list.length, 'pieces');
  if (!process.env.PANELS) { for (const l of list) console.log(JSON.stringify(l)); continue; }
  /* the PANELS: pieces of ~84-92 vertices are the monitor panels (the stands
     are 136, keyboards 103, mice 153, pads 41). Their plane by PCA; the
     screen faces the nearest keyboard. */
  const kbs = list.filter(l => l.n === 103);
  const pts = new Map();
  for (let i = 0; i < N; i++) { pos.getElement(i, v); const r = f(id[i]); if (!pts.has(r)) pts.set(r, []); pts.get(r).push(v.map(x => x * S)); }
  const out = [];
  for (const [r, P] of pts) {
    if (P.length < 80 || P.length > 95) continue;
    const c = [0, 1, 2].map(k => P.reduce((a, q) => a + q[k], 0) / P.length);
    // covariance in xz only (the panels stand upright): normal is the thin horizontal axis
    let xx = 0, xz = 0, zz = 0;
    for (const q of P) { const dx = q[0] - c[0], dz = q[2] - c[2]; xx += dx * dx; xz += dx * dz; zz += dz * dz; }
    const ang = 0.5 * Math.atan2(2 * xz, xx - zz);          // the long axis
    let nx = -Math.sin(ang), nz = Math.cos(ang);             // its normal
    const kb = kbs.reduce((b, k) => (Math.hypot(k.c[0] - c[0], k.c[2] - c[2]) < Math.hypot(b.c[0] - c[0], b.c[2] - c[2]) ? k : b));
    if ((kb.c[0] - c[0]) * nx + (kb.c[2] - c[2]) * nz < 0) { nx = -nx; nz = -nz; }
    let w = 0, h0 = 1e9, h1 = -1e9, d0 = 1e9, d1 = -1e9;
    for (const q of P) { const a = (q[0] - c[0]) * Math.cos(ang) + (q[2] - c[2]) * Math.sin(ang); w = Math.max(w, Math.abs(a)); h0 = Math.min(h0, q[1]); h1 = Math.max(h1, q[1]); const d = (q[0] - c[0]) * nx + (q[2] - c[2]) * nz; d0 = Math.min(d0, d); d1 = Math.max(d1, d); }
    out.push({ c: c.map(x => +x.toFixed(3)), ry: +Math.atan2(nx, nz).toFixed(3), w: +(2 * w).toFixed(3), y0: +h0.toFixed(3), y1: +h1.toFixed(3), front: +d1.toFixed(3), kb: kb.c });
  }
  out.sort((a, b) => a.c[0] - b.c[0]);
  for (const o of out) console.log(JSON.stringify(o));
}
