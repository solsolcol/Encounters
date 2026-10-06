// drop the normal map from a prepped file (its normals are kept): a light cut of a
// scan whose normal map was baked against the FULL mesh shades in facets with it
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { prune } from '@gltf-transform/functions';
import { MeshoptEncoder, MeshoptDecoder } from 'meshoptimizer';
await Promise.all([MeshoptEncoder.ready, MeshoptDecoder.ready]);
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.encoder': MeshoptEncoder, 'meshopt.decoder': MeshoptDecoder });
const [IN, OUT] = process.argv.slice(2);
const d = await io.read(IN);
for (const m of d.getRoot().listMaterials()) m.setNormalTexture(null);
await d.transform(prune());
await io.write(OUT, d);
