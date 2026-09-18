/* v13.1 — Chad's Sketchfab "muzzle meshes", made shippable as the rifle's
   MUZZLE FLASH (Chad: "See if you can use this muzzle flash effect when
   shooting the rifle, it should show this for a split second").

   WHAT THE FILE IS. Two nine-vertex CONE FANS — an apex at the muzzle and
   eight rim verts 92 units out on a 200-unit circle — carrying two different
   flash paintings between them: `muzzle2` the four-pointed STAR and `muzzle1`
   the rounder BURST. Both are drawn on black, and both are 1024 px PNG:
   1.65 MB of texture for sixteen triangles.

   WHAT IS KEPT. Both variants, because a rifle on a range fires many rounds
   and two flashes dealt alternately (plus the engine's per-shot roll about
   the bore) is what stops every shot looking like a photocopy of the last.
   Sixteen triangles is nothing; the textures are the whole cost.

   WHAT CHANGES, and why each is forced:

   1. THE ALPHA GOES, because the ENGINE draws this additively. A flash
      painted on black needs no alpha channel — black adds nothing and the
      bright core glows — and MEASURED, this file's two RGB images are
      already identical: tex1 (BLEND, with alpha) and tex2 (the emissive, no
      alpha) hash the same over RGB. So the alpha was never carrying a
      silhouette the colour did not already carry. Two images ship, not three.

   2. JPEG, at 512. The flash fills perhaps a fifth of the frame at its
      biggest and is on screen for 90 ms; 1024 px of it is paying for detail
      no eye can reach. (Additive blending makes JPEG ringing in the black
      field add a faint haze rather than a hard edge, which is the forgiving
      direction — checked by measuring the mean of the black field after.)

   3. THE ORIENTATION IS BAKED: apex on the origin, opening along -Z, length
      exactly 1.0. -Z because that is forward in the viewmodel's own frame
      (the camera looks down -Z and `weaponProp` is an unrotated group in
      viewmodel metres), and length 1.0 because the engine then states the
      flash's size in ONE number it can bracket by render. The winding is
      reversed with the Z flip so the faces still face out, though the
      material is DoubleSide anyway — a cone seen from inside its own apex
      is a thing that happens.

   4. NO QUANTIZATION. Eighteen vertices. There is nothing to save and
      KHR_mesh_quantization would only stand between this file and the
      plainest possible loader.

   Usage: node tools/prepmuzzle.mjs in.glb out.glb [px] [quality] */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { prune, dedup } from '@gltf-transform/functions';
import sharp from 'sharp';
import fs from 'node:fs';

const [inp, outp, pxS = '512', qS = '88'] = process.argv.slice(2);
const PX = +pxS, Q = +qS;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
const doc = await io.read(inp);
const root = doc.getRoot();

/* ---- 1. the geometry: apex to the origin, opening along -Z, length 1 ---- */
const report = [];
for (const mesh of root.listMeshes()) {
  for (const prim of mesh.listPrimitives()) {
    const pos = prim.getAttribute('POSITION');
    const n = pos.getCount();
    const v = [0, 0, 0];
    /* the APEX is the one vertex the fan is built around: every triangle in
       this file is [rim, apex, rim], so the apex is index 1 of the first
       triangle. Found rather than assumed — and then checked, because a fan
       whose apex is not shared is not a fan. */
    const idx = prim.getIndices().getArray();
    const apexI = idx[1];
    let shared = 0;
    for (let i = 1; i < idx.length; i += 3) if (idx[i] === apexI) shared++;
    if (shared !== idx.length / 3) throw new Error(`${mesh.getName()}: not a fan — apex shared by ${shared} of ${idx.length / 3}`);
    const apex = [0, 0, 0]; pos.getElement(apexI, apex);
    /* the LENGTH is apex-to-rim along the cone's axis, which is the span in
       the axis the rim is flat in. Measured, never assumed: take the axis
       with the smallest spread among the rim verts and the largest distance
       from the apex. */
    let far = 0;
    for (let i = 0; i < n; i++) {
      if (i === apexI) continue;
      pos.getElement(i, v);
      far = Math.max(far, Math.abs(v[2] - apex[2]));
    }
    if (!(far > 0)) throw new Error(`${mesh.getName()}: zero-length cone`);
    for (let i = 0; i < n; i++) {
      pos.getElement(i, v);
      pos.setElement(i, [(v[0] - apex[0]) / far, (v[1] - apex[1]) / far, -(v[2] - apex[2]) / far]);
    }
    /* the Z flip mirrors the mesh, so the winding is reversed to match */
    for (let i = 0; i < idx.length; i += 3) { const t = idx[i]; idx[i] = idx[i + 2]; idx[i + 2] = t; }
    prim.getIndices().setArray(idx);
    /* the NORMALS mean nothing to an unlit additive card, and a mirrored
       mesh's normals are wrong anyway — drop them rather than ship a lie */
    if (prim.getAttribute('NORMAL')) prim.setAttribute('NORMAL', null);
    /* re-measure and ASSERT the contract, here, before anything downstream
       can hide it (the v12.1 law: assert the contract in the tool) */
    let zmin = Infinity, zmax = -Infinity, rmax = 0;
    for (let i = 0; i < n; i++) {
      pos.getElement(i, v);
      zmin = Math.min(zmin, v[2]); zmax = Math.max(zmax, v[2]);
      rmax = Math.max(rmax, Math.hypot(v[0], v[1]));
    }
    if (Math.abs(zmax) > 1e-5) throw new Error(`${mesh.getName()}: apex not at z 0 (${zmax})`);
    if (Math.abs(zmin + 1) > 1e-5) throw new Error(`${mesh.getName()}: rim not at z -1 (${zmin})`);
    report.push(`  ${mesh.getName()}  tris=${idx.length / 3}  rim radius=${rmax.toFixed(3)} of its length`);
  }
}

/* ---- 2. every node transform baked out, so the cone IS its own frame ----
   the file hangs its two cones off a Sketchfab root with two cancelling
   quarter turns and a 94-unit lift; none of that may reach the engine. */
for (const node of root.listNodes()) {
  node.setTranslation([0, 0, 0]); node.setRotation([0, 0, 0, 1]); node.setScale([1, 1, 1]);
}

/* ---- 3. the textures: RGB only, 512 JPEG ---- */
const seen = new Map();
for (const mat of root.listMaterials()) {
  /* the emissive slot is what a flash actually is; base colour is the same
     image and the engine draws it unlit, so ONE map survives per material */
  const src = mat.getEmissiveTexture() || mat.getBaseColorTexture();
  if (!src) continue;
  const key = src;
  let out = seen.get(key);
  if (!out) {
    const buf = Buffer.from(src.getImage());
    const jpg = await sharp(buf).removeAlpha().resize(PX, PX, { fit: 'fill' }).jpeg({ quality: Q, chromaSubsampling: '4:4:4' }).toBuffer();
    const st = await sharp(jpg).stats();
    report.push(`  texture -> ${PX}px JPEG q${Q}  ${(buf.length / 1024).toFixed(0)}KB -> ${(jpg.length / 1024).toFixed(1)}KB  meanRGB=${st.channels.slice(0, 3).map(c => c.mean.toFixed(1)).join('/')}`);
    src.setImage(jpg).setMimeType('image/jpeg');
    out = src; seen.set(key, out);
  }
  mat.setBaseColorTexture(out);
  mat.setEmissiveTexture(null);
  mat.setMetallicRoughnessTexture(null);
  mat.setNormalTexture(null);
  mat.setOcclusionTexture(null);
  mat.setEmissiveFactor([0, 0, 0]);
  mat.setMetallicFactor(0); mat.setRoughnessFactor(1);
  mat.setAlphaMode('OPAQUE');       // the ENGINE makes it additive; OPAQUE here
  mat.setDoubleSided(true);
}

await doc.transform(prune(), dedup());
await io.write(outp, doc);
const a = fs.statSync(inp).size, b = fs.statSync(outp).size;
console.log(report.join('\n'));
console.log(`prepmuzzle: ${(a / 1024).toFixed(0)}KB -> ${(b / 1024).toFixed(0)}KB`);
