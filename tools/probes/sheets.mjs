/* v26.1 · THE SHEETS OF A MODEL: every texture's size in pixels, its kind and bytes, and the triangle count, so a
   level's paint can be read against its source's (Chad, 12 Nov 2026: "many characters have their face details and
   body details absolutely butchered by the compression and reduction in detail").
     node tools/probes/sheets.mjs <file.glb> [...] */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder, MeshoptEncoder } from 'meshoptimizer';
import sharp from 'sharp';
await MeshoptDecoder.ready; await MeshoptEncoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder, 'meshopt.encoder': MeshoptEncoder });
for (const f of process.argv.slice(2)) {
  const doc = await io.read(f), root = doc.getRoot();
  let tris = 0; for (const m of root.listMeshes()) for (const p of m.listPrimitives()) { const ix = p.getIndices(); tris += (ix ? ix.getCount() : p.getAttribute('POSITION').getCount()) / 3; }
  const tx = [];
  for (const t of root.listTextures()) { const img = t.getImage(); let wh = '?';
    try { const md = await sharp(Buffer.from(img)).metadata(); wh = md.width + 'x' + md.height; } catch (e) {}
    tx.push(`${t.getMimeType().replace('image/', '')} ${wh} ${(img.byteLength / 1024).toFixed(0)} KB`); }
  console.log(f.split('/').pop(), Math.round(tris), 'tris |', tx.join(' | '));
}
