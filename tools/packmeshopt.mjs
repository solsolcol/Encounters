import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { meshopt } from '@gltf-transform/functions';
import { MeshoptEncoder, MeshoptDecoder } from 'meshoptimizer';
import fs from 'node:fs';
await MeshoptEncoder.ready; await MeshoptDecoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.encoder': MeshoptEncoder, 'meshopt.decoder': MeshoptDecoder });
for (const f of process.argv.slice(2)) {
  const doc = await io.read(f);
  await doc.transform(meshopt({ encoder: MeshoptEncoder, level: 'medium' }));
  const out = f.replace('.quant.glb', '.mo.glb');
  await io.write(out, doc);
  console.log(out, (fs.statSync(out).size / 1024 | 0) + ' KB', 'ext:', doc.getRoot().listExtensionsUsed().map(e => e.extensionName).join(','));
}
