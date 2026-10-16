// every joint of a file, with its parent, and the vertex count against triangles (a flat-shaded export has ~3 verts a triangle)
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
for (const f of process.argv.slice(2)) {
  const doc = await io.read(f), root = doc.getRoot();
  let v = 0, t = 0; for (const m of root.listMeshes()) for (const p of m.listPrimitives()) { v += p.getAttribute('POSITION').getCount(); t += (p.getIndices() ? p.getIndices().getCount() : 0) / 3; }
  const sk = root.listSkins()[0];
  const par = new Map(); for (const n of root.listNodes()) for (const c of n.listChildren()) par.set(c, n);
  console.log(f.split('/').pop(), 'verts', v, 'tris', t, 'v/t', (v / t).toFixed(2));
  if (sk) console.log(sk.listJoints().map(j => j.getName() + '<' + (par.get(j)?.getName() || '-')).join('  '));
}
