/* GLASS, BY THE MATERIAL ALONE: a prop's one primitive split in two by a mask (one byte a face, in index order; 1 keeps
   the prop's own material, 0 is glass). The glass faces get a material of their own: no colour sheet (Meshy painted the
   glass opaque white), a faint cool tint, alpha-blended at a low opacity, smooth and not metal, single-sided (only the
   near wall is drawn, so a phone draws it in one cheap pass with no sorting of its inside), its normal map kept.
   usage: node glass.mjs IN OUT MASK [opacity] [tint r,g,b] */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { dequantize, prune, meshopt } from '@gltf-transform/functions';
import { MeshoptDecoder, MeshoptEncoder } from 'meshoptimizer';
import fs from 'fs';
const [, , IN, OUT, MASK, OP = '0.22', TINT = '0.86,0.93,0.95'] = process.argv;
await Promise.all([MeshoptDecoder.ready, MeshoptEncoder.ready]);
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder, 'meshopt.encoder': MeshoptEncoder });
const d = await io.read(IN); await d.transform(dequantize());
const m = fs.readFileSync(MASK);
const mesh = d.getRoot().listMeshes()[0]; const p = mesh.listPrimitives()[0]; const src = p.getMaterial();
const a = p.getIndices().getArray(); const keep = [], glass = [];
for (let f = 0; f < a.length / 3; f++) (m[f] ? keep : glass).push(a[3*f], a[3*f+1], a[3*f+2]);
// (a thing that is glass all over, the jug and the tumbler: no face kept, so the one primitive itself takes the glass:
//  an empty primitive beside it fails meshopt's encoder)
const g = keep.length ? p.clone() : p;
if (keep.length) { g.setIndices(d.createAccessor().setType('SCALAR').setArray(new Uint32Array(glass)).setBuffer(p.getIndices().getBuffer()));
  p.setIndices(d.createAccessor().setType('SCALAR').setArray(new Uint32Array(keep)).setBuffer(p.getIndices().getBuffer())); }
const t = TINT.split(',').map(Number);
const gm = d.createMaterial('glass').setBaseColorFactor([t[0], t[1], t[2], Number(OP)]).setAlphaMode('BLEND')
  .setMetallicFactor(0).setRoughnessFactor(0.06).setDoubleSided(!!process.env.DS);   // DS=1: a thin skin drawn from both sides (the tumbler)
if (src.getNormalTexture() && !process.env.NONORMAL) {   // NONORMAL=1: the glass drawn smooth (the tumbler's normal sheet carries the torn inner sheets' patches)
  gm.setNormalTexture(src.getNormalTexture()); gm.setNormalScale(src.getNormalScale()); }
g.setMaterial(gm); if (g !== p) mesh.addPrimitive(g);
await d.transform(prune(), meshopt({ encoder: MeshoptEncoder, level: 'medium' }));
const tmp = OUT + '.tmp.glb'; await io.write(tmp, d); fs.renameSync(tmp, OUT);
console.log('kept', keep.length / 3, 'glass', glass.length / 3);
