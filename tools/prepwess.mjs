/* v16.6 — Chad's two Thao Wessuwan scans (red and green), the guardian giants
   just inside the wat's gate in episode 3 chapter 1 (Chad: "Use these 2 models
   to replace those 2 red and green entrance statues"). OFFLINE prep.

   Each arrives as a Meshy-style static scan: one mesh, one baked material,
   ~575k triangles, a 2048 base colour, a 2048 normal map and a 4096
   metal-roughness sheet — 49 MB. The recipe is prepzavsoldier's (weld,
   simplify, meshopt + quantization) with the budget of a PROP rather than a
   close-up figure: two of them stand in the spawn's first view, so they are
   simplified to ~a sixth, the base colour keeps 2048 (the face and the
   crown's gold are painted, not modelled, at this triangle count), the
   normal map 1024, and the metal-roughness sheet goes (the gold reads from
   the paint; a 4096 sheet for a sheen is 12 MB of source).

   The contract is asserted BEFORE the meshopt pass (v12.1): Y up, base on
   y = 0, centred on x/z, in the scan's own units (the chapter scales it to
   the primitive giant's height).
     node tools/prepwess.mjs <in.glb> <out.glb> [ratio] */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { dedup, prune, weld, simplify, meshopt, flatten, clearNodeTransform, transformPrimitive } from '@gltf-transform/functions';
import { MeshoptSimplifier, MeshoptEncoder, MeshoptDecoder } from 'meshoptimizer';
import sharp from 'sharp';
import fs from 'node:fs';
const [,, IN, OUT, R] = process.argv;
const RATIO = Number(R || 0.16);
await Promise.all([MeshoptSimplifier.ready, MeshoptEncoder.ready, MeshoptDecoder.ready]);
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({
  'meshopt.encoder': MeshoptEncoder, 'meshopt.decoder': MeshoptDecoder });
const doc = await io.read(IN);
const root = doc.getRoot();
const count = () => { let t = 0; for (const m of root.listMeshes()) for (const p of m.listPrimitives()) t += (p.getIndices()?.getCount() ?? p.getAttribute('POSITION').getCount()) / 3; return t; };
const t0 = count();
for (const mat of root.listMaterials()) {
  mat.setMetallicRoughnessTexture(null).setOcclusionTexture(null).setEmissiveTexture(null);
  mat.setMetallicFactor(0.15).setRoughnessFactor(0.62);
}
await doc.transform(dedup(), flatten());
for (const n of root.listNodes()) clearNodeTransform(n);
await doc.transform(weld(), simplify({ simplifier: MeshoptSimplifier, ratio: RATIO, error: Number(process.env.ERR || 0.002) }), prune());
/* base centre */
const mn = [Infinity, Infinity, Infinity], mx = [-Infinity, -Infinity, -Infinity], v = [0, 0, 0];
for (const m of root.listMeshes()) for (const p of m.listPrimitives()) {
  const a = p.getAttribute('POSITION');
  for (let i = 0; i < a.getCount(); i++) { a.getElement(i, v); for (let k = 0; k < 3; k++) { mn[k] = Math.min(mn[k], v[k]); mx[k] = Math.max(mx[k], v[k]); } }
}
for (const m of root.listMeshes()) for (const p of m.listPrimitives())
  transformPrimitive(p, [1,0,0,0, 0,1,0,0, 0,0,1,0, -(mn[0] + mx[0]) / 2, -mn[1], -(mn[2] + mx[2]) / 2, 1]);
const size = mx.map((x, i) => x - mn[i]);
/* v16.6 · BEND="zTop,zFoot,drop" (model units, after the base-centre): the
   naga balustrade. Chad's naga lies FLAT with its head rearing at +z, and a
   stair's cheek wall slopes, so the body is lifted by `drop` behind zTop,
   by a straight ramp between zTop and zFoot, and not at all past zFoot —
   a SHEAR, not a tilt, so the rearing head (all past zFoot) stays upright,
   and a shear keeps every vertical line vertical. Normals follow the shear
   (n' = M^-T n: nz -= k·ny). */
if (process.env.BEND) {
  const [zt, zf, drop] = process.env.BEND.split(',').map(Number), k = -drop / (zf - zt);
  const off = z => z <= zt ? drop : z >= zf ? 0 : drop * (zf - z) / (zf - zt);
  const done = new Set(), n = [0, 0, 0];
  for (const m of root.listMeshes()) for (const p of m.listPrimitives()) {
    const a = p.getAttribute('POSITION'), na = p.getAttribute('NORMAL');
    if (done.has(a)) continue; done.add(a);
    for (let i = 0; i < a.getCount(); i++) {
      a.getElement(i, v);
      if (na && v[2] > zt && v[2] < zf) { na.getElement(i, n); n[2] -= k * n[1]; const L = Math.hypot(...n) || 1; na.setElement(i, n.map(c => c / L)); }
      a.setElement(i, [v[0], v[1] + off(v[2]), v[2]]);
    }
  }
  console.log(`bent: ${drop} up behind z ${zt}, ramp to ${zf} (slope ${k.toFixed(3)})`);
}
if (!process.env.LONG && !(size[1] > size[0] && size[1] > size[2])) throw new Error(`not standing up: ${size.map(x => x.toFixed(2))}`);
/* the sheets: base colour 2048, normal 1024, WebP on a PLAIN source (no
   EXT_texture_webp — rescueTextures reads json.textures[i].source, v14.12) */
for (const mat of root.listMaterials()) {
  for (const [tex, px, q] of [[mat.getBaseColorTexture(), 2048, 90], [mat.getNormalTexture(), 1024, 92]]) {
    if (!tex) continue;
    const img = await sharp(Buffer.from(tex.getImage())).resize(px, px, { fit: 'fill' }).webp({ quality: q }).toBuffer();
    tex.setImage(img).setMimeType('image/webp').setURI('');
  }
}
await doc.transform(prune());
await doc.transform(meshopt({ encoder: MeshoptEncoder, level: 'medium' }));
await io.write(OUT, doc);
console.log(`prepwess ${OUT.split('/').pop()}: tris ${t0} -> ${count()}, size ${size.map(x => x.toFixed(3)).join(' x ')}, ${(fs.statSync(OUT).size / 1024).toFixed(0)} KB`);
