import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import sharp from 'sharp';
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
for (const f of process.argv.slice(2)) {
  const d = await io.read(f); const mat = d.getRoot().listMaterials()[0];
  const mr = mat.getMetallicRoughnessTexture();
  const st = await sharp(Buffer.from(mr.getImage())).resize(512, 512).stats();
  console.log(f.split('/').pop(), 'MR channels mean (R,G=rough,B=metal):', st.channels.map(c => c.mean.toFixed(1)).join(', '), 'max', st.channels.map(c=>c.max).join(','));
  const bc = await sharp(Buffer.from(mat.getBaseColorTexture().getImage())).resize(512,512).stats();
  console.log('   base mean', bc.channels.map(c => c.mean.toFixed(1)).join(', '));
}
