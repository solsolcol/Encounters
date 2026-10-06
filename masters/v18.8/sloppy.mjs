/* v18.8 · a light cut of Chad's Buddha for the SMALL images. The scan's atlas
   is cut into many small islands, and meshopt's regular simplifier will not
   collapse an edge across a UV seam, so it floors at ~120k triangles whatever
   error bound it is given. simplifySloppy ignores topology (it clusters
   vertices), so it reaches any target; judged by photograph at the size the
   small images are seen at.  node masters/v18.8/sloppy.mjs in.glb out.glb target */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { prune, meshopt } from '@gltf-transform/functions';
import { MeshoptSimplifier, MeshoptEncoder, MeshoptDecoder } from 'meshoptimizer';
await Promise.all([MeshoptSimplifier.ready, MeshoptEncoder.ready, MeshoptDecoder.ready]);
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.encoder': MeshoptEncoder, 'meshopt.decoder': MeshoptDecoder });
const [IN, OUT, T] = process.argv.slice(2);
const doc = await io.read(IN);
for (const m of doc.getRoot().listMeshes()) for (const p of m.listPrimitives()) {
  const idx = p.getIndices(), pos = p.getAttribute('POSITION');
  const I = new Uint32Array(idx.getArray()), P = new Float32Array(pos.getCount() * 3), v = [0, 0, 0];
  for (let i = 0; i < pos.getCount(); i++) { pos.getElement(i, v); P.set(v, i * 3); }
  const [out, err] = MeshoptSimplifier.simplifySloppy(I, P, 3, null, Math.floor(+T / 3) * 3, 0.02);
  idx.setArray(out.length > 65535 * 3 ? new Uint32Array(out) : new Uint32Array(out));
  console.log('tris', I.length / 3, '->', out.length / 3, 'err', err.toFixed(4));
}
await doc.transform(prune(), meshopt({ encoder: MeshoptEncoder, level: 'medium' }));
await io.write(OUT, doc);
