/* v24.16 — PONG'S PICKUP (episode 4 chapter 1), Chad's model: "Rivian R1T (2022)" by geyges (Sketchfab, Free Standard
   licence, https://sketchfab.com/3d-models/rivian-r1t-2022-6eca29c11ca44840baf93f47ef800006).

   A showroom export: 394,460 triangles in 613 meshes, 87 materials, 135 textures on up to FOUR UV sets (base colour on
   the first; metal-roughness, normal and occlusion on the others), clearcoat, sheen, specular and transmission, and one
   take (every door opening and closing). The chapter shows it from OUTSIDE — in the yard, on the road, through the
   gate — and films its cabin from inside with its own cabin (the steering wheel on the right, as Thailand drives), so:

   1. The doors' take goes (nothing opens a door).
   2. The windows are OPAQUE near-black — a Thai pickup's tint film — so nothing inside is ever seen, and the cabin's
      insides go: leather, wood, stitching, carpet, cloth, the screens, the interior decals (by material, listed; each
      was located by its box first: door cards, seats, the dash, all inside the glass).
   3. Every map but base colour goes, with its UV set. What the metal-roughness sheet said is kept as factors — the
      mean of its G (roughness) and B (metalness) over the sheet — so a chrome trim stays metal and a tyre stays rubber.
      Clearcoat, sheen, specular and transmission go (the engine's room environment is what metal reflects, v8.9).
      The VERTEX COLOURS stay: the paint's yellow, the tyres' black and the trims are COLOR_0 on 431 of the 613 meshes
      (white factors, no sheet) — the first pass dropped them with the extra UV sets and the truck came out white.
   4. Baked: every node's transform into its vertices (flatten and join alone leave transforms behind, v11.2), joined by
      material, the half turn (the file's nose is at +z; the chapter's pickup faces −z), the tyres on y = 0, the axles'
      middle on z = 0 (measured from the tyres' lowest points, never assumed: the file's own wheelbase is 3.45 m, the
      code-built pickup's 3.44, so the model stands on its wheels exactly).
   5. Simplified to RATIO with an error bound; sheets to at most PX (JPEG where opaque, PNG where a cut-out needs alpha);
      meshopt.

   Usage: node tools/preppickup.mjs in.glb out.glb [ratio=0.2] [px=1024] */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { weld, prune, dedup, flatten, clearNodeTransform, join, simplify, meshopt } from '@gltf-transform/functions';
import { MeshoptEncoder, MeshoptDecoder, MeshoptSimplifier } from 'meshoptimizer';
import sharp from 'sharp';
import fs from 'node:fs';

const [, , IN, OUT, R, P] = process.argv;
const RATIO = Number(R || 0.2), PX = Number(P || 1024), ERR = Number(process.env.ERR || 0.0008);
await Promise.all([MeshoptEncoder.ready, MeshoptDecoder.ready, MeshoptSimplifier.ready]);
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({ 'meshopt.decoder': MeshoptDecoder, 'meshopt.encoder': MeshoptEncoder });
const doc = await io.read(IN);
const root = doc.getRoot();
const before = fs.statSync(IN).size;
const tris = () => root.listMeshes().reduce((a, m) => a + m.listPrimitives().reduce((b, p) => b + (p.getIndices() ? p.getIndices().getCount() : p.getAttribute('POSITION').getCount()) / 3, 0), 0);
const t0 = tris();

/* 1. the doors' take */
for (const a of root.listAnimations()) { for (const c of a.listChannels()) c.dispose(); for (const s of a.listSamplers()) s.dispose(); a.dispose(); }

/* 2. the cabin's insides, and the windows tinted */
const INSIDE = /leather|carpet|wood|stitch|cloth|digitalscreen|interior/i;
const GLASS = /^window_glass|^PATCH_151_SF_glass/;
let gone = 0;
for (const mesh of root.listMeshes()) for (const p of mesh.listPrimitives()) {
  const m = p.getMaterial(); if (!m || !INSIDE.test(m.getName())) continue;
  gone += (p.getIndices() ? p.getIndices().getCount() : p.getAttribute('POSITION').getCount()) / 3;
  mesh.removePrimitive(p); p.dispose();
}
console.log(`  the cabin's insides: ${gone} triangles gone (${INSIDE})`);

/* 3. the maps: base colour only; the metal-roughness sheet kept as its mean */
const mean = async (tex) => {
  const { data, info } = await sharp(Buffer.from(tex.getImage())).resize(64, 64, { fit: 'fill' }).raw().toBuffer({ resolveWithObject: true });
  let g = 0, b = 0; const n = info.width * info.height, c = info.channels;
  for (let i = 0; i < n; i++) { g += data[i * c + 1]; b += data[i * c + 2]; }
  return [g / n / 255, b / n / 255];
};
for (const m of root.listMaterials()) {
  const mr = m.getMetallicRoughnessTexture();
  let metal = m.getMetallicFactor(), rough = m.getRoughnessFactor();
  if (mr) { const [g, b] = await mean(mr); rough *= g; metal *= b; }
  if (GLASS.test(m.getName())) {
    m.setBaseColorFactor([0.025, 0.03, 0.035, 1]).setAlphaMode('OPAQUE'); metal = 0; rough = 0.1;
  }
  for (const e of m.listExtensions()) m.setExtension(e.extensionName, null);
  m.setMetallicRoughnessTexture(null).setNormalTexture(null).setOcclusionTexture(null);
  const em = m.getEmissiveTexture(), emInfo = m.getEmissiveTextureInfo();
  if (em && emInfo && emInfo.getTexCoord() !== 0) m.setEmissiveTexture(null);
  const bi = m.getBaseColorTextureInfo();
  if (m.getBaseColorTexture() && bi && bi.getTexCoord() !== 0) throw new Error(m.getName() + ': base colour on UV ' + bi.getTexCoord());
  m.setMetallicFactor(+metal.toFixed(3)).setRoughnessFactor(+Math.max(0.04, rough).toFixed(3));
}
for (const e of root.listExtensionsUsed()) e.dispose();
for (const mesh of root.listMeshes()) for (const p of mesh.listPrimitives())
  for (const sem of ['TEXCOORD_1', 'TEXCOORD_2', 'TEXCOORD_3', 'TANGENT']) if (p.getAttribute(sem)) p.setAttribute(sem, null);

/* 4. baked and joined; then the half turn, the tyres on the ground, the axles' middle on z = 0 */
{ const seen = new Set(); for (const node of root.listNodes()) { const m = node.getMesh(); if (!m) continue; if (seen.has(m)) node.setMesh(m.clone()); else seen.add(m); } }
await doc.transform(prune(), flatten());
for (const node of root.listNodes()) clearNodeTransform(node);
await doc.transform(join({ keepNamed: false }), weld(), dedup(), prune());
const prims = []; for (const mesh of root.listMeshes()) for (const p of mesh.listPrimitives()) prims.push(p);
let lo = [Infinity, Infinity, Infinity], hi = [-Infinity, -Infinity, -Infinity];
for (const p of prims) { const a = p.getAttribute('POSITION').getArray(); for (let i = 0; i < a.length; i += 3) for (let k = 0; k < 3; k++) { lo[k] = Math.min(lo[k], a[i + k]); hi[k] = Math.max(hi[k], a[i + k]); } }
/* the contact patches: every vertex within 2 cm of the lowest, split into the front and rear by z */
const front = [], rear = [];
for (const p of prims) { const a = p.getAttribute('POSITION').getArray(); for (let i = 0; i < a.length; i += 3) if (a[i + 1] < lo[1] + 0.02) (a[i + 2] > 0 ? front : rear).push(a[i + 2]); }
const avg = (v) => v.reduce((x, y) => x + y, 0) / v.length;
if (!front.length || !rear.length) throw new Error('no contact patches front and rear');
const zf = avg(front), zr = avg(rear), mid = (zf + zr) / 2;
console.log(`  tyres: front axle z ${zf.toFixed(3)}, rear ${zr.toFixed(3)} (wheelbase ${(zf - zr).toFixed(3)} m), ground y ${lo[1].toFixed(3)}`);
for (const p of prims) {
  for (const sem of ['POSITION', 'NORMAL']) {
    const acc = p.getAttribute(sem); if (!acc) continue;
    const a = acc.getArray(), out = new Float32Array(a.length);
    for (let i = 0; i < a.length; i += 3) {
      if (sem === 'POSITION') { out[i] = -a[i]; out[i + 1] = a[i + 1] - lo[1]; out[i + 2] = -(a[i + 2] - mid); }
      else { out[i] = -a[i]; out[i + 1] = a[i + 1]; out[i + 2] = -a[i + 2]; }
    }
    acc.setArray(out).setNormalized(false);
  }
}

/* 5. simplified, the sheets, meshopt */
await doc.transform(simplify({ simplifier: MeshoptSimplifier, ratio: RATIO, error: ERR }), prune());
for (const t of root.listTextures()) {
  const img = t.getImage(); if (!img) continue;
  const alpha = root.listMaterials().some(m => m.getAlphaMode() !== 'OPAQUE' && (m.getBaseColorTexture() === t));
  const s = sharp(Buffer.from(img)).resize(PX, PX, { fit: 'inside', withoutEnlargement: true });
  const out = alpha ? await s.png({ palette: true }).toBuffer() : await s.jpeg({ quality: 86 }).toBuffer();
  t.setImage(out).setMimeType(alpha ? 'image/png' : 'image/jpeg').setURI('');
}
/* the contract, asserted after the bake */
{
  let L = [Infinity, Infinity, Infinity], H = [-Infinity, -Infinity, -Infinity];
  for (const mesh of root.listMeshes()) for (const p of mesh.listPrimitives()) { const a = p.getAttribute('POSITION').getArray(); for (let i = 0; i < a.length; i += 3) for (let k = 0; k < 3; k++) { L[k] = Math.min(L[k], a[i + k]); H[k] = Math.max(H[k], a[i + k]); } }
  if (Math.abs(L[1]) > 1e-3) throw new Error('tyres not on y = 0');
  console.log(`  CONTRACT: x ${L[0].toFixed(3)}..${H[0].toFixed(3)}  y 0..${H[1].toFixed(3)}  z ${L[2].toFixed(3)}..${H[2].toFixed(3)} (nose at −z)`);
}
await doc.transform(meshopt({ encoder: MeshoptEncoder, level: 'medium' }));
await io.write(OUT, doc);
console.log(`preppickup ${OUT.split('/').pop()}: ${t0} -> ${tris()} triangles, ${root.listMaterials().length} materials, ${root.listMeshes().reduce((a, m) => a + m.listPrimitives().length, 0)} draws; ${(before / 1048576).toFixed(1)} MB -> ${(fs.statSync(OUT).size / 1024).toFixed(0)} KB`);
