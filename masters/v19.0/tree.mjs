// v19.0 · each file's node tree: name, mesh, material, triangles, world bounds
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { getBounds } from '@gltf-transform/functions';
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
const doc = await io.read(process.argv[2]); const r = doc.getRoot();
const f = v => v.map(x => x.toFixed(2)).join(',');
function walk(n, d) {
  const m = n.getMesh(); let s = '  '.repeat(d) + (n.getName() || '(node)');
  if (m) {
    let t = 0; const mats = new Set();
    for (const p of m.listPrimitives()) { t += (p.getIndices() ? p.getIndices().getCount() : p.getAttribute('POSITION').getCount()) / 3; mats.add(p.getMaterial() && p.getMaterial().getName()); }
    const b = getBounds(n);
    s += `  [${m.getName()}] tris ${t} mats ${[...mats].join('|')}  min(${f(b.min)}) max(${f(b.max)})`;
  }
  console.log(s);
  for (const c of n.listChildren()) walk(c, d + 1);
}
for (const n of r.listScenes()[0].listChildren()) walk(n, 0);
