import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder, MeshoptEncoder } from 'meshoptimizer';
import sharp from 'sharp';
await MeshoptDecoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder, 'meshopt.encoder': MeshoptEncoder });
for (const f of process.argv.slice(2)) {
  const d = await io.read(f); const r = d.getRoot();
  console.log('==', f);
  console.log(' nodes', r.listNodes().length, 'meshes', r.listMeshes().length, 'mats', r.listMaterials().length, 'tex', r.listTextures().length, 'skins', r.listSkins().length, 'anims', r.listAnimations().length);
  console.log(' ext used', r.listExtensionsUsed().map(e=>e.extensionName).join(','));
  for (const n of r.listNodes()) { const m = n.getMesh(); console.log('  node', JSON.stringify(n.getName()), 'mesh', m ? m.getName() : '-', 'T', n.getTranslation().map(v=>+v.toFixed(3)), 'R', n.getRotation().map(v=>+v.toFixed(3)), 'S', n.getScale().map(v=>+v.toFixed(4)), 'children', n.listChildren().length); }
  for (const m of r.listMeshes()) for (const p of m.listPrimitives()) {
    const pos = p.getAttribute('POSITION'); const n = pos.getCount(); const tri = (p.getIndices()?.getCount() ?? n) / 3;
    const mn=[1e9,1e9,1e9], mx=[-1e9,-1e9,-1e9], v=[0,0,0];
    for (let i=0;i<n;i++){pos.getElement(i,v);for(let k=0;k<3;k++){mn[k]=Math.min(mn[k],v[k]);mx[k]=Math.max(mx[k],v[k]);}}
    console.log('  prim of', m.getName(), 'verts', n, 'tris', tri, 'attrs', p.listSemantics().join(','), 'mat', p.getMaterial()?.getName(), 'box', mn.map(v=>+v.toFixed(3)), mx.map(v=>+v.toFixed(3)));
  }
  for (const mat of r.listMaterials()) {
    console.log('  mat', JSON.stringify(mat.getName()), 'alpha', mat.getAlphaMode(), 'ds', mat.getDoubleSided(), 'base', !!mat.getBaseColorTexture(), 'mr', !!mat.getMetallicRoughnessTexture(), 'n', !!mat.getNormalTexture(), 'em', !!mat.getEmissiveTexture(), 'occ', !!mat.getOcclusionTexture(), 'metal', mat.getMetallicFactor(), 'rough', mat.getRoughnessFactor(), 'bcf', mat.getBaseColorFactor());
  }
  for (const t of r.listTextures()) { const img = t.getImage(); let meta = {}; try { meta = await sharp(Buffer.from(img)).metadata(); } catch(e){} console.log('  tex', t.getName(), t.getMimeType(), meta.width+'x'+meta.height, 'ch', meta.channels, (img.byteLength/1024).toFixed(0)+'KB'); }
}
