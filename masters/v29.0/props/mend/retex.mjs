// write IN to OUT with one texture's image replaced (by name), optionally the material changed by a JSON of edits
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder, MeshoptEncoder } from 'meshoptimizer';
import fs from 'fs';
const [, , IN, OUT, ...pairs] = process.argv;
await Promise.all([MeshoptDecoder.ready, MeshoptEncoder.ready]);
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder, 'meshopt.encoder': MeshoptEncoder });
const d = await io.read(IN);
for (const pr of pairs) { const [name, file] = pr.split('=');
  const t = d.getRoot().listTextures().find(t => t.getName() === name); if (!t) throw new Error('no texture ' + name);
  t.setImage(new Uint8Array(fs.readFileSync(file))); t.setMimeType(file.endsWith('.png') ? 'image/png' : 'image/jpeg'); }
const tmp = OUT + '.tmp.glb'; await io.write(tmp, d); fs.renameSync(tmp, OUT);
console.log('wrote', OUT);
