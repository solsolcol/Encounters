/* v16.6 — Chad's two "Tailandia low polygon" Sketchfab packs, made into ONE
   small kit for episode 3 chapter 1's wat (Chad: "see how you can make use
   of these throughout the environment"; he chose the temple pieces now and
   the house furniture for chapter 5 later).

     tailandia1.glb  56 objects — roosters, cushions, a seated gold Buddha,
                     candles, incense, orchids, plants, jars, lotus bowls
     tailandia2.glb  70 objects — mostly a Thai house's furniture; a spirit
                     house, fans, an oil lamp, a tea set, low tables

   Each pack is ONE scene with every object laid out on a floor. This tool
   picks objects BY THEIR PLACE in that scene (the catalogue index: the
   top-level objects under the single-child Sketchfab wrappers, in file
   order), bakes each one's whole transform chain into its vertices, puts
   its origin on its BASE CENTRE in the packs' own metres, and hands it out
   as a named top-level node of one file (`thai_<name>`), so the chapter
   says `kit.getObjectByName('thai_buddha').clone()` and a position.

   The recipe is the standing one (prepammo / v9.0) with three things these
   packs need:
   - BASE COLOUR ONLY, metalness down (v8.9), KHR_materials_specular and
     every other extension on a material stripped — rescueTextures() only
     restores base colour anyway.
   - THE MATERIAL DECIDES what keeps its alpha (v6.16): a material the file
     ships as MASK or BLEND keeps a PNG sheet (the orchids, the palms, the
     grass are all cut-out cards); everything else is JPEG.
   - SIMPLIFY PER OBJECT, at a ratio the object can take — the monstera is
     24,048 triangles and the topiary 27,840, while a cushion is 416 and is
     left alone. A mesh USED BY TWO NODES is copied, never baked twice (the
     v9.0 trap): every primitive's accessors are cloned before the bake.

   Usage: node tools/prepthai.mjs <pack1.glb> <pack2.glb> <out.glb> [px] [q]
   (topiary, pack 1 #44, was tried and left out: 27,840 triangles of
   unwelded leaf cards the simplifier could not touch, for a garden shape
   no Thai wat grows) */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { prune, dedup, weld, meshopt, mergeDocuments, transformPrimitive, simplifyPrimitive } from '@gltf-transform/functions';
import { MeshoptSimplifier, MeshoptEncoder, MeshoptDecoder } from 'meshoptimizer';
import sharp from 'sharp';
import fs from 'node:fs';

/* [index in pack, kit name, simplify ratio (0 = keep), sheet px, opts]
   opts.hub: centre x/z on the TOP tenth (the rod), not the box — a
   five-blade fan's box is off its hub by a tenth of a blade, and it spins */
const PICK1 = [
  [0,  'rooster',   0,    256],
  [2,  'cushtri',   0,    256],
  [3,  'garland',   0,    256],
  [5,  'deity',     0.6,  256],
  [6,  'incense',   0,    256],
  [8,  'vasereed',  0,    256],
  [12, 'buddha',    0.6,  512],
  [13, 'phan',      0,    256],
  [14, 'candle',    0,    256],
  [16, 'orchid',    0.3,  256],
  [17, 'orchidw',   0.25, 256],
  [19, 'cush3',     0,    256],
  [20, 'cush4',     0,    256],
  [21, 'cush6',     0,    256],
  [31, 'rug',       0,    512],
  [32, 'runner',    0,    512],
  [35, 'lily',      0.45, 256],
  [41, 'banana',    0,    256],
  [42, 'travpalm',  0.5,  256],
  [45, 'elephear',  0,    256],
  [46, 'monstera',  0.2,  256],
  [48, 'khantok',   0,    256],
  [49, 'fern',      0,    256],
  [50, 'urnclay',   0,    256],
  [51, 'lotusleaf', 0,    256],
  [52, 'grass',     0,    256],
  [53, 'waterjar',  0,    256],
  [54, 'hedge',     0,    256],
  [55, 'lotusbowl', 0,    256],
];
const PICK2 = [
  [0,  'reedmat',   0,    256],
  [9,  'claypot',   0,    256],
  [10, 'claypot2',  0,    256],
  [17, 'bell',      0,    256],
  [24, 'cushflat',  0,    256],
  [31, 'ceilfan',   0,    256, { hub: true }],
  [45, 'standfan',  0.45, 256],
  [46, 'oillamp',   0,    256],
  [47, 'teaset',    0.5,  256],
  [57, 'cushlong',  0,    256],
  [62, 'sidetable', 0,    256],
  [65, 'lowtable',  0,    256],
  [68, 'spirit',    0,    512],
];

const [in1, in2, outp, pxS = '256', qS = '86'] = process.argv.slice(2);
const Q = +qS, PXMAX = +pxS;
await Promise.all([MeshoptSimplifier.ready, MeshoptEncoder.ready, MeshoptDecoder.ready]);
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({ 'meshopt.encoder': MeshoptEncoder, 'meshopt.decoder': MeshoptDecoder });
const report = [];
const tris = prim => (prim.getIndices() ? prim.getIndices().getCount() : prim.getAttribute('POSITION').getCount()) / 3;

async function extract(path, picks) {
  const doc = await io.read(path);
  const root = doc.getRoot();
  const scene = root.listScenes()[0];
  let level = scene.listChildren();
  while (level.length === 1) level = level[0].listChildren();
  const out = [];
  const pxOf = new Map();                       // texture -> the largest px any pick asked of it
  for (const [idx, name, ratio, px, po = {}] of picks) {
    const src = level[idx];
    if (!src) throw new Error(`${path}: no object at index ${idx} (${name})`);
    const mesh = doc.createMesh(`thai_${name}`);
    let t0 = 0;
    src.traverse(n => {
      const m = n.getMesh(); if (!m) return;
      const W = n.getWorldMatrix();
      for (const p of m.listPrimitives()) {
        const c = p.clone();
        for (const s of c.listSemantics()) {
          if (/^TEXCOORD_[1-9]|^COLOR_|^TANGENT/.test(s)) { c.setAttribute(s, null); continue; }
          c.setAttribute(s, c.getAttribute(s).clone());
        }
        if (c.getIndices()) c.setIndices(c.getIndices().clone());
        transformPrimitive(c, W);
        t0 += tris(c);
        mesh.addPrimitive(c);
        const mat = c.getMaterial(), tex = mat && mat.getBaseColorTexture();
        if (tex) pxOf.set(tex, Math.max(pxOf.get(tex) || 0, px));
      }
    });
    /* simplify FIRST: it moves the extremes, and the base must be measured
       on what ships */
    if (ratio > 0) {
      for (const p of mesh.listPrimitives()) {
        if (p.getMode() !== 4 || !p.getIndices()) continue;
        simplifyPrimitive(p, { simplifier: MeshoptSimplifier, ratio, error: 0.004 });
      }
    }
    /* the base centre, in the packs' own metres */
    const mn = [Infinity, Infinity, Infinity], mx = [-Infinity, -Infinity, -Infinity], v = [0, 0, 0];
    for (const p of mesh.listPrimitives()) {
      const a = p.getAttribute('POSITION');
      for (let i = 0; i < a.getCount(); i++) { a.getElement(i, v); for (let k = 0; k < 3; k++) { mn[k] = Math.min(mn[k], v[k]); mx[k] = Math.max(mx[k], v[k]); } }
    }
    const off = [-(mn[0] + mx[0]) / 2, -mn[1], -(mn[2] + mx[2]) / 2];
    if (po.hub) {
      const top = mx[1] - (mx[1] - mn[1]) * 0.1, hm = [Infinity, Infinity], hx = [-Infinity, -Infinity];
      for (const p of mesh.listPrimitives()) {
        const a = p.getAttribute('POSITION');
        for (let i = 0; i < a.getCount(); i++) { a.getElement(i, v); if (v[1] < top) continue;
          hm[0] = Math.min(hm[0], v[0]); hx[0] = Math.max(hx[0], v[0]); hm[1] = Math.min(hm[1], v[2]); hx[1] = Math.max(hx[1], v[2]); }
      }
      off[0] = -(hm[0] + hx[0]) / 2; off[2] = -(hm[1] + hx[1]) / 2;
      report.push(`  (${name}: hub ${(-off[0] - (mn[0] + mx[0]) / 2).toFixed(3)}, ${(-off[2] - (mn[2] + mx[2]) / 2).toFixed(3)} m off the box centre)`);
    }
    for (const p of mesh.listPrimitives())
      transformPrimitive(p, [1,0,0,0, 0,1,0,0, 0,0,1,0, off[0],off[1],off[2],1]);
    const t1 = mesh.listPrimitives().reduce((a, p) => a + tris(p), 0);
    const size = mx.map((x, i) => +(x - mn[i]).toFixed(3));
    /* the mesh hangs off a CHILD: quantize() writes its dequantizing scale
       and offset onto the node that holds the mesh, and the chapter writes
       position / rotation / scale onto the named one — two owners, two nodes */
    const node = doc.createNode(`thai_${name}`).addChild(doc.createNode(`thai_${name}_m`).setMesh(mesh));
    out.push(node);
    report.push(`  ${('thai_' + name).padEnd(16)} ${size.join(' x ').padEnd(22)} m  tris ${Math.round(t0)} -> ${Math.round(t1)}`);
  }
  /* the scene is now ONLY the picks */
  for (const c of scene.listChildren()) scene.removeChild(c);
  for (const n of out) scene.addChild(n);
  /* weld before prune: simplifyPrimitive wants shared vertices, but every
     pick is already simplified; weld here is only for size */
  await doc.transform(prune({ keepLeaves: false }));
  return { doc, pxOf };
}

const A = await extract(in1, PICK1);
const B = await extract(in2, PICK2);

/* ---- materials: base colour only, metal down, extensions off ---- */
for (const { doc } of [A, B]) {
  for (const mat of doc.getRoot().listMaterials()) {
    for (const drop of ['MetallicRoughness', 'Normal', 'Occlusion', 'Emissive'])
      if (mat[`get${drop}Texture`]()) mat[`set${drop}Texture`](null);
    for (const ext of mat.listExtensions()) mat.setExtension(ext.extensionName, null);
    if (mat.getMetallicFactor() > 0.3) mat.setMetallicFactor(0.3);
    if (mat.getRoughnessFactor() < 0.45) mat.setRoughnessFactor(0.45);
  }
  await doc.transform(prune());
}

/* ---- sheets: alpha where the MATERIAL says so (v6.16), sized by the pick ---- */
for (const { doc, pxOf } of [A, B]) {
  const alphaTex = new Set();
  for (const mat of doc.getRoot().listMaterials())
    if (mat.getAlphaMode() !== 'OPAQUE' && mat.getBaseColorTexture()) alphaTex.add(mat.getBaseColorTexture());
  for (const tex of doc.getRoot().listTextures()) {
    const buf = Buffer.from(tex.getImage());
    const md = await sharp(buf).metadata();
    const px = Math.min(PXMAX, pxOf.get(tex) || PXMAX);
    const w = Math.min(px, md.width), h = Math.min(px, md.height);
    let img, mime;
    if (alphaTex.has(tex)) {
      img = await sharp(buf).ensureAlpha().resize(w, h, { fit: 'fill' }).png({ palette: true, quality: 90, effort: 9 }).toBuffer();
      mime = 'image/png';
    } else {
      img = await sharp(buf).removeAlpha().resize(w, h, { fit: 'fill' }).jpeg({ quality: Q, chromaSubsampling: '4:4:4' }).toBuffer();
      mime = 'image/jpeg';
    }
    tex.setImage(img).setMimeType(mime).setURI('');
  }
}

/* ---- one file ---- */
const doc = A.doc;
const map = mergeDocuments(doc, B.doc);
const scene = doc.getRoot().listScenes()[0];
for (const s of doc.getRoot().listScenes().slice(1)) {
  for (const c of s.listChildren()) { s.removeChild(c); scene.addChild(c); }
  s.dispose();
}
{ /* mergeDocuments brings the second file's buffer along: a GLB holds one */
  const bufs = doc.getRoot().listBuffers();
  for (const a of doc.getRoot().listAccessors()) a.setBuffer(bufs[0]);
  for (const b of bufs.slice(1)) b.dispose();
}
await doc.transform(dedup(), weld(), prune());

/* ASSERT the contract while the positions are floats (v12.1) */
for (const n of scene.listChildren()) {
  const mn = [Infinity, Infinity, Infinity], mx = [-Infinity, -Infinity, -Infinity], v = [0, 0, 0];
  for (const p of n.listChildren()[0].getMesh().listPrimitives()) {
    const a = p.getAttribute('POSITION');
    for (let i = 0; i < a.getCount(); i++) { a.getElement(i, v); for (let k = 0; k < 3; k++) { mn[k] = Math.min(mn[k], v[k]); mx[k] = Math.max(mx[k], v[k]); } }
  }
  if (Math.abs(mn[1]) > 2e-3) throw new Error(`${n.getName()} base at ${mn[1]}`);
  if (!/ceilfan/.test(n.getName()) && (Math.abs(mn[0] + mx[0]) > 4e-3 || Math.abs(mn[2] + mx[2]) > 4e-3)) throw new Error(`${n.getName()} not centred`);
  const t = n.getTranslation(); if (t.some(x => x !== 0)) throw new Error(`${n.getName()} carries a translation`);
}
/* meshopt + quantization (the engine's every loader carries the decoder
   since v14.14, and it runs under the strict CSP — v5.10) */
await doc.transform(meshopt({ encoder: MeshoptEncoder, level: 'medium' }));
await io.write(outp, doc);
const root = doc.getRoot();
const tt = root.listMeshes().reduce((a, m) => a + m.listPrimitives().reduce((b, p) => b + tris(p), 0), 0);
console.log(report.join('\n'));
console.log(`prepthai ${outp.split('/').pop()}: ${(fs.statSync(outp).size / 1024).toFixed(0)}KB, ${scene.listChildren().length} objects, ${Math.round(tt)} tris, ${root.listTextures().length} textures, ${root.listMaterials().length} materials`);
