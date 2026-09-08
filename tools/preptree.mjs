/* v6.15 — the three tree models Chad supplied, made shippable and made
   INTERCHANGEABLE, so any chapter can plant a mixture of them.

   The recipe is v5.20's (prepwoman.mjs), with four steps trees need:

   1. metalRough(). Two of the three arrive as KHR_materials_pbrSpecularGlossiness,
      which three.js REMOVED from GLTFLoader — it renders flat white and says
      nothing (v5.17's study table, the same trap).
   2. Every map but base colour goes: the CSP-safe rescueTextures() only ever
      restores base colour, so a normal or specular map is pure download.
   3. LEAVES ARE CUTOUTS. Their sheets keep alpha (PNG) and their material
      becomes MASK with a cutoff, not BLEND: blended foliage sorts wrongly
      against itself from every angle and costs fill for nothing. Bark is
      JPEG and single-sided; leaf cards stay double-sided.
   4. BAKED TO A CONTRACT: every output is Y-up (all three arrive Z-up from
      their FBX), its trunk centred on the origin, its base on y = 0 and its
      height exactly 1.0. A chapter then plants a tree by saying how tall it
      is, and the four kinds are interchangeable at any placement. The
      transform is baked into the vertex data BEFORE quantization, because a
      quantized attribute is an integer array no runtime matrix can be
      applied to (the trap that decided this).

   Usage: node tools/preptree.mjs in.glb out.glb [ratio] [leafPx] [barkPx] [onlyNode]
*/
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS, KHRMeshQuantization } from '@gltf-transform/extensions';
import { weld, simplify, quantize, prune, dedup, flatten, clearNodeTransform, metalRough } from '@gltf-transform/functions';
import { MeshoptSimplifier, MeshoptEncoder, MeshoptDecoder } from 'meshoptimizer';
import sharp from 'sharp';
import fs from 'node:fs';

await MeshoptSimplifier.ready; await MeshoptEncoder.ready; await MeshoptDecoder.ready;
const [inp, outp, ratioS = '1', leafS = '1024', barkS = '1024', onlyNode = ''] = process.argv.slice(2);
const RATIO = +ratioS, LEAF = +leafS, BARK = +barkS;

const io = new NodeIO().registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({ 'meshopt.decoder': MeshoptDecoder, 'meshopt.encoder': MeshoptEncoder });
const doc = await io.read(inp);
const root = doc.getRoot();
const before = fs.statSync(inp).size;

/* 0 — one tree per file. trees_low_poly.glb carries TWO (tree4 and tree6),
   which is where the fourth kind comes from. */
if (onlyNode) {
  const target = root.listNodes().find(n => n.getName() === onlyNode);
  if (!target) throw new Error(`no node named ${onlyNode}`);
  const live = new Set();
  for (let p = target; p; p = p.getParentNode()) live.add(p);      // its ancestry, or the scene loses it
  (function walk(n) { live.add(n); for (const c of n.listChildren()) walk(c); })(target);
  for (const node of root.listNodes()) if (!live.has(node)) node.dispose();
}

/* 1 — the material model three.js still speaks */
await doc.transform(metalRough());

/* 2 — base colour only; a detached texture must also be disposed or it stays */
const keep = new Set();
for (const m of root.listMaterials()) {
  const base = m.getBaseColorTexture(); if (base) keep.add(base);
  m.setNormalTexture(null); m.setMetallicRoughnessTexture(null);
  m.setOcclusionTexture(null); m.setEmissiveTexture(null);
  m.setEmissiveFactor([0, 0, 0]); m.setMetallicFactor(0); m.setRoughnessFactor(0.9);
}
for (const t of root.listTextures()) if (!keep.has(t)) t.dispose();

/* 3 — leaves cut out, bark solid.

   A material is FOLIAGE if its name says so or if the file itself shipped it
   as BLEND — the second half matters, because a model whose materials are
   unnamed would otherwise have its leaves treated as bark, and bark loses its
   alpha (below). Recorded here, BEFORE the alpha mode is rewritten. */
const isLeaf = (m) => /leaf|leaves|crown|branch|foliage/i.test(m.getName())
                      || m.getAlphaMode() !== 'OPAQUE';
const leafMats = new Set(root.listMaterials().filter(isLeaf));
for (const m of root.listMaterials()) {
  if (leafMats.has(m)) { m.setAlphaMode('MASK'); m.setAlphaCutoff(0.45); m.setDoubleSided(true); }
  else { m.setAlphaMode('OPAQUE'); m.setDoubleSided(false); }
}

await doc.transform(dedup(), prune(), flatten());
for (const node of root.listNodes()) clearNodeTransform(node);

/* 4 — the contract: Y-up, trunk on the origin, base at y = 0, one metre tall.

   The up axis is FOUND, never assumed. All three files arrive Z-up out of
   their FBX, but `flatten()` above bakes whatever corrective rotation the
   Sketchfab wrapper carried, so some come out of it Y-up already — and a
   blind Z-up remap tips those on their side and then normalises by the
   wrong span (measured on the first attempt: trees 1.84 units long lying
   down, crowns rendering two and a half times their own height).

   What tells the axes apart is the TRUNK: along the up axis, the far end
   is a crown and the near end is a stick. So for each axis and each
   direction, take the outermost twelfth of the model and measure how far
   its vertices sit from that axis; the smallest of the six is the base of
   the trunk, and up is away from it.                                     */
const prims = [];
for (const mesh of root.listMeshes()) for (const p of mesh.listPrimitives()) prims.push(p);
const verts = [];
for (const p of prims) {
  const a = p.getAttribute('POSITION').getArray(); const n = p.getAttribute('POSITION').getCount();
  for (let i = 0; i < n; i++) verts.push([a[i * 3], a[i * 3 + 1], a[i * 3 + 2]]);
}
let raw0 = [Infinity, Infinity, Infinity], raw1 = [-Infinity, -Infinity, -Infinity];
for (const v of verts) for (let k = 0; k < 3; k++) { if (v[k] < raw0[k]) raw0[k] = v[k]; if (v[k] > raw1[k]) raw1[k] = v[k]; }
let best = { score: Infinity, axis: 1, dir: 1 };
for (let axis = 0; axis < 3; axis++) {
  const span = raw1[axis] - raw0[axis]; if (span <= 0) continue;
  const o1 = (axis + 1) % 3, o2 = (axis + 2) % 3;
  const c1 = (raw0[o1] + raw1[o1]) / 2, c2 = (raw0[o2] + raw1[o2]) / 2;
  for (const dir of [1, -1]) {
    const edge = dir > 0 ? raw0[axis] + span / 12 : raw1[axis] - span / 12;
    let sum = 0, n = 0;
    for (const v of verts) {
      if (dir > 0 ? v[axis] > edge : v[axis] < edge) continue;
      sum += Math.hypot(v[o1] - c1, v[o2] - c2); n++;
    }
    if (!n) continue;
    const score = (sum / n) / span;         // a trunk is thin against the tree's own height
    if (score < best.score) best = { score, axis, dir };
  }
}
const AX = best.axis, DIR = best.dir;                       // up is `DIR` along `AX`
const oth = [0, 1, 2].filter(k => k !== AX);
const yUp = (v) => { const o = [0, 0, 0]; o[0] = v[oth[0]]; o[1] = DIR * v[AX]; o[2] = DIR * v[oth[1]]; return o; };
let lo = [Infinity, Infinity, Infinity], hi = [-Infinity, -Infinity, -Infinity];
for (const v of verts) { const u = yUp(v); for (let k = 0; k < 3; k++) { if (u[k] < lo[k]) lo[k] = u[k]; if (u[k] > hi[k]) hi[k] = u[k]; } }
console.log(`  up axis ${'xyz'[AX]}${DIR > 0 ? '+' : '-'} (trunk score ${best.score.toFixed(3)}); crown ${( (Math.max(hi[0]-lo[0], hi[2]-lo[2])) / (hi[1]-lo[1]) ).toFixed(2)} x its height`);
const H = hi[1] - lo[1], S = 1 / H;
const cx = (lo[0] + hi[0]) / 2, cz = (lo[2] + hi[2]) / 2;
for (const p of prims) {
  for (const sem of ['POSITION', 'NORMAL']) {
    const acc = p.getAttribute(sem); if (!acc) continue;
    const a = acc.getArray(); const n = acc.getCount(); const out = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const v = yUp([a[i * 3], a[i * 3 + 1], a[i * 3 + 2]]);
      if (sem === 'POSITION') { out[i * 3] = (v[0] - cx) * S; out[i * 3 + 1] = (v[1] - lo[1]) * S; out[i * 3 + 2] = (v[2] - cz) * S; }
      else { const L = Math.hypot(v[0], v[1], v[2]) || 1; out[i * 3] = v[0] / L; out[i * 3 + 1] = v[1] / L; out[i * 3 + 2] = v[2] / L; }
    }
    acc.setArray(out).setNormalized(false);
  }
}

/* 5 — sheets: leaf cards keep their alpha, bark does not need it.

   WHICH SHEET IS WHICH IS DECIDED BY THE MATERIAL THAT USES IT, never by the
   texture's own name (v6.16). All three of Chad's files embed their textures
   UNNAMED and with no URI, so a name test matched nothing, every sheet took
   the bark branch, and every leaf sheet was re-encoded as JPEG — a format
   with no alpha channel. The cut-outs became solid rectangles: half the
   crown was opaque card, which is what "heavily compressed" looked like.
   The alpha is the whole point of a leaf sheet, so it is what the split has
   to protect.

   A leaf sheet stays PNG with its alpha. Palette mode is what keeps that
   affordable — a foliage sheet is a few greens and a hard alpha edge, and
   alphaCutoff throws away every partial value anyway, so 256 colours costs
   nothing visible and roughly a quarter of the bytes. */
const leafTex = new Set();
for (const m of leafMats) { const t = m.getBaseColorTexture(); if (t) leafTex.add(t); }
for (const t of root.listTextures()) {
  const img = t.getImage(); if (!img) continue;
  const leaf = leafTex.has(t);
  const px = leaf ? LEAF : BARK;
  const out = leaf
    ? await sharp(Buffer.from(img)).ensureAlpha().resize(px, px, { fit: 'inside' })
        .png({ palette: true, quality: 92, effort: 9 }).toBuffer()
    : await sharp(Buffer.from(img)).resize(px, px, { fit: 'inside' })
        .jpeg({ quality: 88 }).toBuffer();
  t.setImage(out).setMimeType(leaf ? 'image/png' : 'image/jpeg');
  console.log(`  ${leaf ? 'leaf' : 'bark'} sheet -> ${px}px ${leaf ? 'png(alpha)' : 'jpeg'} ${(out.length / 1024).toFixed(0)} KB`);
}

/* 6 — weld and (gently) simplify; leaf cards resist and are left mostly alone */
await doc.transform(weld({ tolerance: 0.0001 }));
if (RATIO < 1) await doc.transform(simplify({ simplifier: MeshoptSimplifier, ratio: RATIO, error: 0.008 }));

/* 7 — quantization LAST: the one compression three.js reads with no decoder */
doc.createExtension(KHRMeshQuantization).setRequired(true);
await doc.transform(prune(), dedup(), quantize({ pattern: /POSITION|NORMAL|TEXCOORD/ }));

await io.write(outp, doc);
const after = fs.statSync(outp).size;
let tris = 0; for (const p of prims) { const idx = p.getIndices(); tris += (idx ? idx.getCount() : p.getAttribute('POSITION').getCount()) / 3; }
console.log(`${inp.split('/').pop()} -> ${outp.split('/').pop()}: ${(before / 1024 / 1024).toFixed(2)} MB -> ${(after / 1024).toFixed(0)} KB, ${Math.round(tris)} tris, source height ${H.toFixed(2)} units`);
