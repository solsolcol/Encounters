// v19.0 · the plane cabin's windows (blinn5) and seat cushions / backs, in the
// prepped model's metres (x15, origin kept): connected pieces and their boxes
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { flatten, clearNodeTransform, dedup } from '@gltf-transform/functions';
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
const doc = await io.read(process.argv[2]); const root = doc.getRoot();
await doc.transform(dedup(), flatten());
for (const n of root.listNodes()) clearNodeTransform(n);
const S = 15;
for (const m of root.listMeshes()) for (const p of m.listPrimitives()) {
  const name = p.getMaterial().getName();
  if (!process.argv.slice(3).includes(name)) continue;
  const pos = p.getAttribute('POSITION'), idx = p.getIndices().getArray(), N = pos.getCount();
  const key = new Map(), id = new Int32Array(N), v = [0, 0, 0];
  for (let i = 0; i < N; i++) { pos.getElement(i, v); const k = v.map(x => Math.round(x * 1e5)).join(','); if (!key.has(k)) key.set(k, key.size); id[i] = key.get(k); }
  const par = new Int32Array(key.size).map((_, i) => i);
  const f = x => { while (par[x] !== x) x = par[x] = par[par[x]]; return x; };
  for (let t = 0; t < idx.length; t += 3) { const a = f(id[idx[t]]), b = f(id[idx[t + 1]]), c = f(id[idx[t + 2]]); par[b] = a; par[f(c)] = a; }
  const box = new Map();
  for (let i = 0; i < N; i++) { pos.getElement(i, v); const r = f(id[i]); let b = box.get(r); if (!b) box.set(r, b = { mn: [1e9, 1e9, 1e9], mx: [-1e9, -1e9, -1e9], n: 0 }); b.n++; for (let k = 0; k < 3; k++) { b.mn[k] = Math.min(b.mn[k], v[k] * S); b.mx[k] = Math.max(b.mx[k], v[k] * S); } }
  const list = [...box.values()].filter(b => b.n > 8).map(b => ({ mn: b.mn.map(x => +x.toFixed(3)), mx: b.mx.map(x => +x.toFixed(3)), n: b.n }));
  list.sort((a, b) => a.mn[2] - b.mn[2] || a.mn[0] - b.mn[0]);
  console.log(name, list.length);
  for (const l of list.slice(0, 40)) console.log(' ', JSON.stringify(l));
}
