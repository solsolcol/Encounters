// v19.2: full-detail cuts of the two sitters the player kneels nearest (the man
// in front, Yai, the boy beside her), as v19.2 did for the woman beside him (lay_sitwomanhd):
// the v18.0 floor-posed sources with every triangle, only the floor take kept,
// the admin tee's 2048 sheet halved to 1024 (the neighbour's size).
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { prune, textureCompress } from '@gltf-transform/functions';
import sharp from 'sharp';
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
for (const [src, out] of [['admintee_floor', 'lay_adminteehd'], ['granny_floor', 'lay_grannyhd'], ['botak_floor', 'lay_botakhd']]) {
  const d = await io.read(`masters/v18.0/crowd/${src}.glb`);
  for (const a of d.getRoot().listAnimations()) if (a.getName() !== 'Sit_Cross_Legged_on_Floor') a.dispose();
  await d.transform(prune(), textureCompress({ encoder: sharp, targetFormat: 'jpeg', resize: [1024, 1024], quality: 88 }));
  await io.write(`assets/${out}.glb`, d);
  let tri = 0; for (const m of d.getRoot().listMeshes()) for (const p of m.listPrimitives()) tri += p.getIndices().getCount() / 3;
  console.log(out, tri, d.getRoot().listAnimations().map(a => a.getName()), d.getRoot().listTextures().map(t => t.getSize() + ' ' + t.getMimeType()));
}
