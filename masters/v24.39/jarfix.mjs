/* v24.39 · The Thai ghost jar (N0M4DXII, Sketchfab, CC BY-NC-SA 4.0), made to look as its author's own picture shows it,
   before tools/prepstatic.mjs: two things the export got wrong, nothing of its paint or its shape touched.
   1. METAL. The metal-roughness sheet's blue channel is 255 everywhere — every texel metal — so the terracotta and the
      cloth draw as dark metal (photographed: a near-black pot, a black band). The author's Sketchfab render shows matte
      clay, a matte woven cloth and a SHINY SILVER BAND round the neck. Metal is kept only on the band: a texel is band
      where the colour sheet is a pale neutral grey (chroma < CH, value > VMIN) and the sheet's own roughness marks it
      glossy (G < GMAX); everything else is metal 0. Roughness (green) is the author's, untouched.
   2. LEVEL. The file's root carries the author's viewer turn, which tips the jar ~2° off upright, so on a table one side
      of its foot would float. The root is replaced by the same turn with the tip taken out (its yaw kept).
     node masters/v24.39/jarfix.mjs <in.glb> <out.glb> [maskPreview.png] */
import { NodeIO } from '@gltf-transform/core';
import sharp from 'sharp';
const [,, IN, OUT, PREVIEW] = process.argv;
const CH = 46, VMIN = 70, GMAX = 90;
const io = new NodeIO();
const doc = await io.read(IN);
const root = doc.getRoot();
/* 2 · level */
const top = root.listScenes()[0].listChildren()[0];
const m = top.getMatrix();
const a = [m[0], m[1], m[2]], c = [m[8], m[9], m[10]];
const tilt = Math.acos(Math.min(1, Math.abs(c[1]) / Math.hypot(...c))) * 180 / Math.PI;
const L = Math.hypot(a[0], a[2]), ax = a[0] / L, az = a[2] / L;
/* columns: local x -> (ax,0,az); local y -> (az,0,-ax); local z -> (0,1,0) — right-handed, the yaw kept */
top.setMatrix([ax, 0, az, 0, az, 0, -ax, 0, 0, 1, 0, 0, m[12], m[13], m[14], 1]);
console.log(`level: the root tipped ${tilt.toFixed(2)}° off upright; replaced by its yaw alone (${(Math.atan2(az, ax) * 180 / Math.PI).toFixed(1)}°)`);
/* 1 · metal on the band only */
const mat = root.listMaterials()[0];
const bc = mat.getBaseColorTexture(), mr = mat.getMetallicRoughnessTexture();
const B = await sharp(Buffer.from(bc.getImage())).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const R = await sharp(Buffer.from(mr.getImage())).removeAlpha().raw().toBuffer({ resolveWithObject: true });
if (B.info.width !== R.info.width || B.info.height !== R.info.height) throw new Error('sheet sizes differ');
const n = R.info.width * R.info.height, out = Buffer.from(R.data), prev = Buffer.alloc(n * 3);
let band = 0, metalBefore = 0;
for (let i = 0; i < n; i++) {
  const r = B.data[i * 3], g = B.data[i * 3 + 1], b = B.data[i * 3 + 2];
  const v = Math.max(r, g, b), ch = v - Math.min(r, g, b);
  if (R.data[i * 3 + 2] > 127) metalBefore++;
  const isBand = ch < CH && v > VMIN && R.data[i * 3 + 1] < GMAX;
  out[i * 3 + 2] = isBand ? 255 : 0;
  if (isBand) band++;
  prev[i * 3] = isBand ? 255 : r >> 2; prev[i * 3 + 1] = isBand ? 255 : g >> 2; prev[i * 3 + 2] = isBand ? 255 : b >> 2;
}
const png = await sharp(out, { raw: { width: R.info.width, height: R.info.height, channels: 3 } }).png().toBuffer();
mr.setImage(new Uint8Array(png)).setMimeType('image/png');
console.log(`metal: ${(metalBefore / n * 100).toFixed(1)} % of texels before; ${band} texels (${(band / n * 100).toFixed(2)} %) after — the band`);
if (PREVIEW) await sharp(prev, { raw: { width: R.info.width, height: R.info.height, channels: 3 } }).png().toFile(PREVIEW);
await io.write(OUT, doc);
console.log('wrote', OUT);
