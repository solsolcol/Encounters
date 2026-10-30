/* v24.13 — THE SOI DOG (episode 4 chapter 1), Chad's model: "Animated Dog, Shiba Inu" by quander (Sketchfab, CC-BY-4.0,
   https://sketchfab.com/3d-models/animated-dog-shiba-inu-9abfce885a834399b2c3ccaed51cd474).

   A Sketchfab FBX export: ONE skinned mesh of 33,384 triangles (19,267 vertices) on a 191-joint rig — its face rigged
   (jaw, tongue, lips, lids, brows, ears, whiskers) and its tail in seven joints — two 1024 PNG sheets, and five takes,
   photographed frame by frame before anything was cut (masters/v24.13/make.sh): play_dead (sits, flops onto its side,
   rolls back up), rollover (a roll, then 2.3–8 s lying still with its head up — the sphinx pose), shake (a PAW GIVEN while
   sitting, not water shaken off), sitting (a sitting idle), standing (a standing idle, mouth open). The chapter needs a
   dog lying with its head up and a dog standing; everything else is most of the file (5.7 MB of keyframes against
   0.6 MB of geometry).

   1. Two takes kept and named for what they are: rollover's still stretch (2.4–8.0 s, re-timed from 0) → 'lie',
      standing → 'stand'. Resampled, so a channel that holds still is two keys.
   2. The base-colour sheet to WebP at 1024 on a plain source. The second sheet goes: it is a metal-roughness map whose
      blue channel (metalness) averages 179/255 — a metal dog, which with no environment to reflect renders near black
      (v8.9). Fur is metalness 0, roughness 0.85.
   3. Every triangle kept (the player walks past him at a few metres; 33k is a person's budget at a crowd cut).
   4. The export's empty Light and Camera nodes go; meshopt + quantization last (the engine's loaders read meshopt,
      v14.14; episode 4's files are hosted-only).

   Usage: node tools/prepdog.mjs in.glb out.glb */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { prune, dedup, resample, meshopt } from '@gltf-transform/functions';
import { MeshoptEncoder, MeshoptDecoder } from 'meshoptimizer';
import sharp from 'sharp';
import fs from 'node:fs';

const [,, IN, OUT] = process.argv;
await Promise.all([MeshoptEncoder.ready, MeshoptDecoder.ready]);
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.encoder': MeshoptEncoder, 'meshopt.decoder': MeshoptDecoder });
const doc = await io.read(IN);
const root = doc.getRoot();
const before = fs.statSync(IN).size;

/* 1. the takes: keep two, cut 'lie' to its still stretch */
const KEEP = { '0|rollover_0': ['lie', 2.4, 8.0], '0|standing_0': ['stand', 0, Infinity] };
for (const a of root.listAnimations()) {
  const k = KEEP[a.getName()];
  /* (an Animation's dispose() leaves its samplers holding their accessors, so prune keeps them and the writer writes them:
     the first run carried the three dropped takes' 1,738 keyframe accessors unreferenced, 4.6 MB of a 2.5 MB file
     decoded — the samplers and channels go first) */
  if (!k) { for (const c of a.listChannels()) c.dispose(); for (const s of a.listSamplers()) s.dispose(); a.dispose(); continue; }
  const [name, t0, t1] = k;
  a.setName(name);
  if (t0 > 0) for (const s of a.listSamplers()) {
    const inp = s.getInput(), out = s.getOutput(), n = inp.getCount(), w = out.getElementSize();
    const T = inp.getArray(), V = out.getArray();
    const keep = [];
    for (let i = 0; i < n; i++) if (T[i] >= t0 - 1e-4 && T[i] <= t1 + 1e-4) keep.push(i);
    /* the first kept key lands on 0 (the takes are baked at 30 fps, so the key at or after t0 is under a frame off) */
    const T2 = new Float32Array(keep.length), V2 = new Float32Array(keep.length * w);
    keep.forEach((i, j) => { T2[j] = T[i] - T[keep[0]]; for (let c = 0; c < w; c++) V2[j * w + c] = V[i * w + c]; });
    s.setInput(doc.createAccessor().setType('SCALAR').setArray(T2).setBuffer(inp.getBuffer()));
    s.setOutput(doc.createAccessor().setType(out.getType()).setArray(V2).setBuffer(out.getBuffer()));
  }
}

/* 2. the sheets */
for (const mat of root.listMaterials()) {
  for (const ext of mat.listExtensions()) mat.setExtension(ext.extensionName, null);
  mat.setMetallicRoughnessTexture(null).setOcclusionTexture(null).setEmissiveTexture(null);
  mat.setMetallicFactor(0).setRoughnessFactor(0.85);
}
for (const tex of root.listTextures()) {
  if (!root.listMaterials().some(m => m.getBaseColorTexture() === tex)) continue;
  const img = await sharp(Buffer.from(tex.getImage())).resize(1024, 1024, { fit: 'fill' }).webp({ quality: 90 }).toBuffer();
  tex.setImage(img).setMimeType('image/webp').setURI('');
}

/* 4. the export's empty Light and Camera nodes */
for (const n of root.listNodes()) if (/^(Light|Camera)$/.test(n.getName())) { for (const c of n.listChildren()) c.dispose(); n.dispose(); }

await doc.transform(dedup(), resample(), prune(), meshopt({ encoder: MeshoptEncoder, level: 'medium' }));
await io.write(OUT, doc);
const tris = root.listMeshes().reduce((a, m) => a + m.listPrimitives().reduce((b, p) => b + p.getIndices().getCount() / 3, 0), 0);
console.log(`prepdog ${OUT.split('/').pop()}: ${tris} triangles, takes ${root.listAnimations().map(a => a.getName() + ' ' + a.listSamplers().reduce((m, s) => Math.max(m, s.getInput().getMax([])[0] || 0), 0).toFixed(2) + ' s').join(', ')}; ${(before / 1048576).toFixed(2)} MB -> ${(fs.statSync(OUT).size / 1024).toFixed(0)} KB`);
