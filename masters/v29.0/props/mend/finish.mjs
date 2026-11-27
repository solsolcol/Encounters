/* v29.0 · a prepared prop finished without touching its sheets (no re-encode, so no loss): TURN=deg turns it about y
   (its points and normals baked; the clock's blank display was on its back), METAL=k sets the material's metallic factor
   (a generator's brushed steel comes fully metal and draws near black where there is little to reflect: the kettle), and
   the file packed as prepmeshy packs it (quantize, meshopt).   usage: [TURN=180] [METAL=0.3] node finish.mjs IN OUT */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { dequantize, clearNodeTransform, quantize, meshopt } from '@gltf-transform/functions';
import { MeshoptDecoder, MeshoptEncoder } from 'meshoptimizer';
import fs from 'fs';
const [, , IN, OUT] = process.argv;
await Promise.all([MeshoptDecoder.ready, MeshoptEncoder.ready]);
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder, 'meshopt.encoder': MeshoptEncoder });
const doc = await io.read(IN); await doc.transform(dequantize());
for (const n of doc.getRoot().listNodes()) if (n.getMesh()) clearNodeTransform(n);
const t = Number(process.env.TURN || 0) * Math.PI / 180, cs = Math.cos(t), sn = Math.sin(t), v = [0, 0, 0];
if (t) for (const m of doc.getRoot().listMeshes()) for (const p of m.listPrimitives()) for (const s of ['POSITION', 'NORMAL']) {
  const a = p.getAttribute(s); if (!a) continue;
  for (let i = 0; i < a.getCount(); i++) { a.getElement(i, v); a.setElement(i, [cs*v[0] + sn*v[2], v[1], -sn*v[0] + cs*v[2]]); } }
if (process.env.METAL) for (const m of doc.getRoot().listMaterials()) m.setMetallicFactor(Number(process.env.METAL));
await doc.transform(quantize(), meshopt({ encoder: MeshoptEncoder, level: 'medium' }));
const tmp = OUT + '.tmp.glb'; await io.write(tmp, doc); fs.renameSync(tmp, OUT);
console.log('finished', OUT, fs.statSync(OUT).size, 'bytes');
