/* v9.0 — Chad's Sketchfab bunk bed, made shippable and made to match the
   chapter's own bed convention.

   The recipe is v6.15's (preptree.mjs) with the tree-specific steps dropped
   and two the bunk needs:

   1. The model arrives with its LENGTH on z; every bed in e2c1 has its
      length on x (`BED.len` is the x span, `BED.wid` the z one, because the
      rails are built that way). The quarter turn is BAKED INTO THE VERTICES
      here rather than set on the node at runtime, for the reason preptree
      writes down: a quantized attribute is an integer array, and no
      per-frame matrix can be applied to one after the fact. Bake first,
      quantize last.

   2. The frame and the mattresses are simplified at DIFFERENT rates. The
      frame is tubular — a simplifier eats a round tube's silhouette, which
      is the whole model — so it keeps every triangle. A mattress is a
      soft-cornered slab carrying 3,982 of the file's 10,488 triangles for a
      shape a box would nearly serve, and takes a hard cut with nothing
      visible lost.

   Everything else is the standing recipe: every map but base colour goes,
   because the CSP-safe `rescueTextures()` only ever restores base colour and
   a normal map is therefore pure download (v5.05); base sheets to JPEG;
   weld, prune, dedup; KHR_mesh_quantization last, the one compression
   three.js reads with no decoder and no blob (v5.16).

   The output contract, which the chapter relies on and this tool asserts:
   Y-up, base on y = 0, centred on x and z, LENGTH ON X.

   Usage: node tools/prepbunk.mjs in.glb out.glb [framePx] [matPx] [matRatio]
*/
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS, KHRMeshQuantization } from '@gltf-transform/extensions';
import { weld, simplifyPrimitive, quantize, prune, dedup, flatten, clearNodeTransform, metalRough } from '@gltf-transform/functions';
import { MeshoptSimplifier, MeshoptEncoder, MeshoptDecoder } from 'meshoptimizer';
import sharp from 'sharp';
import fs from 'node:fs';

await MeshoptSimplifier.ready; await MeshoptEncoder.ready; await MeshoptDecoder.ready;
const [inp, outp, frameS = '1024', matS = '512', ratioS = '0.20'] = process.argv.slice(2);
const FRAME_PX = +frameS, MAT_PX = +matS, MAT_RATIO = +ratioS;

const io = new NodeIO().registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({ 'meshopt.decoder': MeshoptDecoder, 'meshopt.encoder': MeshoptEncoder });
const doc = await io.read(inp);
const root = doc.getRoot();
const before = fs.statSync(inp).size;

/* 1 — the material model three.js still speaks */
await doc.transform(metalRough());

/* 2 — base colour only */
const keep = new Set();
for (const m of root.listMaterials()) {
  const base = m.getBaseColorTexture(); if (base) keep.add(base);
  m.setNormalTexture(null); m.setMetallicRoughnessTexture(null);
  m.setOcclusionTexture(null); m.setEmissiveTexture(null);
  m.setEmissiveFactor([0, 0, 0]); m.setMetallicFactor(0.05); m.setRoughnessFactor(0.85);
  m.setAlphaMode('OPAQUE'); m.setDoubleSided(false);
}
for (const t of root.listTextures()) if (!keep.has(t)) t.dispose();

/* 3 — UN-SHARE THE MESHES FIRST, then bake the node transforms down.

   The file carries ONE mattress mesh instanced at two nodes, 0.373 m and
   1.356 m up. `flatten()` and `clearNodeTransform()` bake a node's transform
   into its mesh — which cannot be done twice to one mesh, so the first pass
   of this tool came out with a single mattress and a model 2.297 m tall
   instead of 1.71. A mesh reachable from more than one node gets its own
   copy before anything is baked into it. */
{
  const seen = new Set();
  for (const node of root.listNodes()) {
    const m = node.getMesh(); if (!m) continue;
    if (seen.has(m)) node.setMesh(m.clone()); else seen.add(m);
  }
}
/* NOT dedup() here: it merges meshes, and merging the two mattresses back
   together is exactly what the clone above just undid. */
await doc.transform(prune(), flatten());
for (const node of root.listNodes()) clearNodeTransform(node);

/* 4 — which primitives are MATTRESS and which are FRAME, decided by the
   material rather than by the mesh's name: the file names its meshes
   Bunk_Bed_1 / Bunk_Bed_2 / Bunk_Bed_2.1, which says nothing, but the two
   materials are one per part and the mattress material is the one used by
   more than one mesh. Measured on the source: frame 2,524 tris on its own
   material, mattress 3,982 twice on a shared one. */
const useCount = new Map();
for (const mesh of root.listMeshes()) for (const p of mesh.listPrimitives()) {
  const m = p.getMaterial(); useCount.set(m, (useCount.get(m) || 0) + 1);
}
const matMattress = [...useCount.entries()].sort((a, b) => b[1] - a[1])[0][0];
const prims = [];
for (const mesh of root.listMeshes()) for (const p of mesh.listPrimitives()) prims.push(p);
const isMattress = (p) => p.getMaterial() === matMattress;
console.log(`  mattress material: ${matMattress.getName()} (${useCount.get(matMattress)} primitives)`);

/* 5 — THE QUARTER TURN, baked. (x, y, z) -> (z, y, -x): the model's +z
   length lands on +x, and the handedness is kept so normals stay outward. */
const turn = (v) => [v[2], v[1], -v[0]];
for (const p of prims) {
  for (const sem of ['POSITION', 'NORMAL']) {
    const acc = p.getAttribute(sem); if (!acc) continue;
    const a = acc.getArray(); const n = acc.getCount(); const out = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const v = turn([a[i * 3], a[i * 3 + 1], a[i * 3 + 2]]);
      out[i * 3] = v[0]; out[i * 3 + 1] = v[1]; out[i * 3 + 2] = v[2];
    }
    acc.setArray(out).setNormalized(false);
  }
  for (const sem of ['TANGENT', 'TEXCOORD_1', 'TEXCOORD_2', 'COLOR_0'])
    if (p.getAttribute(sem)) p.setAttribute(sem, null);          // a normal map is gone, so its tangents are dead weight
}

/* 6 — centre on x and z, sit on y = 0, and REPORT the real dimensions. The
   chapter fits the model to `BED` from these numbers, so they are printed
   rather than assumed anywhere. */
let lo = [Infinity, Infinity, Infinity], hi = [-Infinity, -Infinity, -Infinity];
for (const p of prims) {
  const a = p.getAttribute('POSITION').getArray(), n = p.getAttribute('POSITION').getCount();
  for (let i = 0; i < n; i++) for (let k = 0; k < 3; k++) {
    const v = a[i * 3 + k]; if (v < lo[k]) lo[k] = v; if (v > hi[k]) hi[k] = v;
  }
}
const cx = (lo[0] + hi[0]) / 2, cz = (lo[2] + hi[2]) / 2;
for (const p of prims) {
  const acc = p.getAttribute('POSITION'); const a = acc.getArray(); const n = acc.getCount();
  const out = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    out[i * 3] = a[i * 3] - cx; out[i * 3 + 1] = a[i * 3 + 1] - lo[1]; out[i * 3 + 2] = a[i * 3 + 2] - cz;
  }
  acc.setArray(out).setNormalized(false);
}
const LEN = hi[0] - lo[0], HGT = hi[1] - lo[1], WID = hi[2] - lo[2];

/* 6b — and the two DECK heights, which is what the chapter actually has to
   line up with: a mattress's top surface is where a man lies and where the
   sheet, the pillow and the folded blanket have to sit. Found by clustering
   the mattress primitives' own tops rather than by reading the source's node
   translations, because step 3 baked those away. */
const decks = [];
for (const p of prims) {
  if (!isMattress(p)) continue;
  const a = p.getAttribute('POSITION').getArray(), n = p.getAttribute('POSITION').getCount();
  let top = -Infinity, bot = Infinity;
  for (let i = 0; i < n; i++) { const y = a[i * 3 + 1]; if (y > top) top = y; if (y < bot) bot = y; }
  decks.push({ top: +top.toFixed(4), bot: +bot.toFixed(4) });
}
decks.sort((a, b) => a.top - b.top);

/* 7 — the sheets */
const mattressTex = new Set(); { const t = matMattress.getBaseColorTexture(); if (t) mattressTex.add(t); }
for (const t of root.listTextures()) {
  const img = t.getImage(); if (!img) continue;
  const px = mattressTex.has(t) ? MAT_PX : FRAME_PX;
  const out = await sharp(Buffer.from(img)).resize(px, px, { fit: 'inside' }).jpeg({ quality: 88 }).toBuffer();
  t.setImage(out).setMimeType('image/jpeg');
  console.log(`  ${mattressTex.has(t) ? 'mattress' : 'frame'} sheet -> ${px}px jpeg ${(out.length / 1024).toFixed(0)} KB`);
}

/* 8 — weld, then simplify THE MATTRESSES ONLY. gltf-transform's simplify()
   is document-wide, so the frame is protected by splitting the work: the
   mattress primitives are moved into a document of their own, simplified,
   and their results written back. */
await doc.transform(weld({ tolerance: 0.0001 }));
if (MAT_RATIO < 1) {
  const was = prims.filter(isMattress).reduce((s, p) => s + p.getIndices().getCount() / 3, 0);
  /* `simplifyPrimitive`, ONE PRIMITIVE AT A TIME, not the document-wide
     `simplify()`. The first pass of this tool detached the frame's
     primitives, ran the document transform and put them back — and shipped a
     model with no frame in it at all, because `simplify()` prunes, and
     pruning removed the emptied mesh and its node while they were parked.
     The frame was gone from the render and the box measured 1.88 x 1.17,
     which is a mattress. A per-primitive call cannot do that. */
  for (const p of prims) if (isMattress(p))
    simplifyPrimitive(p, { simplifier: MeshoptSimplifier, ratio: MAT_RATIO, error: 0.004 });
  const now = prims.filter(isMattress).reduce((s, p) => s + p.getIndices().getCount() / 3, 0);
  console.log(`  mattresses ${Math.round(was)} -> ${Math.round(now)} tris (frame untouched)`);
}

/* 9 — the contract, ASSERTED rather than hoped for (v6.17's law: a model is
   checked on the baked file, not on the intent) */
{
  let l = [Infinity, Infinity, Infinity], h = [-Infinity, -Infinity, -Infinity];
  for (const p of prims) {
    const a = p.getAttribute('POSITION').getArray(), n = p.getAttribute('POSITION').getCount();
    for (let i = 0; i < n; i++) for (let k = 0; k < 3; k++) {
      const v = a[i * 3 + k]; if (v < l[k]) l[k] = v; if (v > h[k]) h[k] = v;
    }
  }
  if (Math.abs(l[1]) > 1e-4) throw new Error(`base is at y ${l[1].toFixed(4)}, not 0`);
  if (Math.abs(l[0] + h[0]) > 1e-3 || Math.abs(l[2] + h[2]) > 1e-3) throw new Error('not centred on x/z');
  if (h[0] - l[0] < h[2] - l[2]) throw new Error(`length ${(h[0]-l[0]).toFixed(2)} is not on x (z span ${(h[2]-l[2]).toFixed(2)}) — the quarter turn went the wrong way`);
  /* and THE FRAME IS STILL THERE. The first pass lost it silently and the
     only tell was a bounding box that happened to look plausible. A bed
     without its frame is 1.25 m tall from the top mattress down; with it,
     1.71 to the head rail. Assert on the part count too. */
  const frameCount = prims.filter(p => !isMattress(p)).length;
  if (frameCount < 1) throw new Error('no frame primitive survived — the bed is two floating mattresses');
  if (h[1] < 1.6) throw new Error(`top of the model is ${h[1].toFixed(3)}, under the frame's own head rail — the frame is missing`);
  console.log(`  parts: ${frameCount} frame + ${prims.length - frameCount} mattress`);
}

/* 10 — quantization LAST */
doc.createExtension(KHRMeshQuantization).setRequired(true);
await doc.transform(prune(), dedup(), quantize({ pattern: /POSITION|NORMAL|TEXCOORD/ }));

await io.write(outp, doc);
const after = fs.statSync(outp).size;
let tris = 0; for (const p of prims) { const idx = p.getIndices(); tris += (idx ? idx.getCount() : p.getAttribute('POSITION').getCount()) / 3; }
console.log(`${inp.split('/').pop()} -> ${outp.split('/').pop()}: ${(before / 1024 / 1024).toFixed(2)} MB -> ${(after / 1024).toFixed(0)} KB, ${Math.round(tris)} tris`);
console.log(`  CONTRACT: length(x) ${LEN.toFixed(3)}  width(z) ${WID.toFixed(3)}  height(y) ${HGT.toFixed(3)}`);
console.log(`  DECKS (mattress top / bottom): ${decks.map(d => `${d.top.toFixed(3)}/${d.bot.toFixed(3)}`).join('  ')}`);
