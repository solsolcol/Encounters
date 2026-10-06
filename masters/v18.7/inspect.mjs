// v18.7 · what each of Chad's four files actually is
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { getBounds } from '@gltf-transform/functions';
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
for (const f of process.argv.slice(2)) {
  const doc = await io.read(f); const r = doc.getRoot();
  let tris = 0, verts = 0;
  for (const m of r.listMeshes()) for (const p of m.listPrimitives()) { const i = p.getIndices(); const pos = p.getAttribute('POSITION'); verts += pos.getCount(); tris += (i ? i.getCount() : pos.getCount()) / 3; }
  const scene = r.listScenes()[0]; const b = getBounds(scene);
  console.log(`\n== ${f}  meshes ${r.listMeshes().length}  tris ${tris}  verts ${verts}  skins ${r.listSkins().length} (joints ${r.listSkins().map(s => s.listJoints().length)})  nodes ${r.listNodes().length}`);
  console.log('  bounds min', b.min.map(v => v.toFixed(3)), 'max', b.max.map(v => v.toFixed(3)));
  console.log('  ext', r.listExtensionsUsed().map(e => e.extensionName));
  for (const a of r.listAnimations()) { let d = 0; for (const s of a.listSamplers()) { const t = s.getInput(); if (t) d = Math.max(d, t.getMax([])[0]); } console.log(`  anim "${a.getName()}" ${d.toFixed(2)}s channels ${a.listChannels().length}`); }
  for (const t of r.listTextures()) { const s = t.getSize(); console.log(`  tex "${t.getName()}" ${t.getMimeType()} ${s && s.join('x')} ${(t.getImage().byteLength / 1024).toFixed(0)}KB`); }
  for (const m of r.listMaterials()) console.log(`  mat "${m.getName()}" alpha ${m.getAlphaMode()} metal ${m.getMetallicFactor()} rough ${m.getRoughnessFactor()} base ${!!m.getBaseColorTexture()} norm ${!!m.getNormalTexture()} mr ${!!m.getMetallicRoughnessTexture()} emis ${!!m.getEmissiveTexture()} ds ${m.getDoubleSided()}`);
  const roots = scene.listChildren(); console.log('  roots', roots.map(n => `${n.getName()} s${n.getScale().map(v=>+v.toFixed(3))} r${n.getRotation().map(v=>+v.toFixed(3))}`));
}
