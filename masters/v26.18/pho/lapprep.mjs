/* v26.18 · THE LAP CLOTH'S GAME FILE: Blender's cloth (lapcloth.py: lap.glb, a bare mesh in his own frame, metres, y up,
   the cushion's top its ground) with its baked shading as its colour sheet, packed as every thing of the chapter is.

     node masters/v26.18/pho/lapprep.mjs <lap.glb> <lap-ao.png> <out.glb> [PX=1024] [FLOOR=0.42] [COLOR=fdffff]

   ITS PAINT. Grandmaster Pho's robe is white (#fdffff, the middle of 24,029 points of his own sheet on his trunk); the
   cloth is that white times its own shading (the dark under his robe's hem, the hollows of its folds), the shading
   eased so that its deepest is FLOOR of the white: a phone draws no shadows, so this is all the depth the cloth has,
   and a baked occlusion at full depth reads as dirt on white. The game gives it his robe's own look (c_cast.js lookD),
   so the two are one white. TEXCOORD_1 (his spine's share, written by Blender) is not kept: the game reads that share
   off each point's height (crossSit), so nothing rides on an attribute a later pack might drop. */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { meshopt } from '@gltf-transform/functions';
import { MeshoptEncoder, MeshoptDecoder } from 'meshoptimizer';
import sharp from 'sharp';
import fs from 'node:fs';
const [, , IN, AO, OUT, BEADS] = process.argv;
const E = (k, d) => process.env[k] != null ? process.env[k] : d;
const PX = Number(E('PX', 1024)), FLOOR = Number(E('FLOOR', 0.42)), COLOR = E('COLOR', 'fdffff');
await MeshoptEncoder.ready; await MeshoptDecoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder, 'meshopt.encoder': MeshoptEncoder });
const doc = await io.read(IN), root = doc.getRoot(), prim = root.listMeshes()[0].listPrimitives()[0];
const t1 = prim.getAttribute('TEXCOORD_1'); if (t1) { prim.setAttribute('TEXCOORD_1', null); t1.dispose(); }
/* the shading: grey, eased up from FLOOR, a little soft (the bake's own grain is not cloth) */
const { data, info } = await sharp(AO).removeAlpha().greyscale().resize(PX, PX, { fit: 'fill' }).blur(1.2).raw().toBuffer({ resolveWithObject: true });
const rgb = Buffer.alloc(info.width * info.height * 3), c = [parseInt(COLOR.slice(0, 2), 16), parseInt(COLOR.slice(2, 4), 16), parseInt(COLOR.slice(4, 6), 16)];
let lo = 255, sum = 0;
for (let i = 0; i < info.width * info.height; i++) { const a = data[i] / 255, k = FLOOR + (1 - FLOOR) * Math.pow(a, 0.8); lo = Math.min(lo, data[i]); sum += k;
  for (let j = 0; j < 3; j++) rgb[i * 3 + j] = Math.round(c[j] * k); }
const img = await sharp(rgb, { raw: { width: info.width, height: info.height, channels: 3 } }).jpeg({ quality: 92 }).toBuffer();
const tex = doc.createTexture('lap').setImage(img).setMimeType('image/jpeg');
const mat = doc.createMaterial('lap').setBaseColorTexture(tex).setBaseColorFactor([1, 1, 1, 1]).setRoughnessFactor(0.78).setMetallicFactor(0).setDoubleSided(true);
prim.setMaterial(mat);
const pos = prim.getAttribute('POSITION'), n = pos.getCount(); let L = [1e9, 1e9, 1e9], H = [-1e9, -1e9, -1e9];
for (let i = 0; i < n; i++) { const p = pos.getElement(i, []); for (let j = 0; j < 3; j++) { L[j] = Math.min(L[j], p[j]); H[j] = Math.max(H[j], p[j]); } }
if (L[1] < -0.002 || L[1] > 0.03) throw new Error('the cloth does not stand on its ground: lowest ' + L[1].toFixed(4));
/* (v26.18, Chad: "The beads get cut off") his beads below the hem, laid over the cloth (beadtail.py's JSON): a mesh named
   'beads', its coordinates his own body sheet's; the game draws it with his body's material, so the one here is only a name */
if (BEADS) { const B = JSON.parse(fs.readFileSync(BEADS, 'utf8')), buf = root.listBuffers()[0], acc = (a, type, T) => doc.createAccessor().setArray(new T(a)).setType(type).setBuffer(buf);
  const bp = doc.createPrimitive().setAttribute('POSITION', acc(B.pos, 'VEC3', Float32Array)).setAttribute('NORMAL', acc(B.nor, 'VEC3', Float32Array)).setAttribute('TEXCOORD_0', acc(B.uv, 'VEC2', Float32Array))
    .setIndices(acc(B.tri, 'SCALAR', Uint16Array)).setMaterial(doc.createMaterial('beads').setBaseColorFactor([0.08, 0.06, 0.05, 1]).setRoughnessFactor(0.78).setMetallicFactor(0));
  root.listScenes()[0].addChild(doc.createNode('beads').setMesh(doc.createMesh('beads').addPrimitive(bp)));
  console.log(`beads: ${B.pos.length / 3} points, ${B.tri.length / 3} triangles`); }
await doc.transform(meshopt({ encoder: MeshoptEncoder, level: 'medium' }));
await io.write(OUT, doc);
console.log(`lap: ${n} points, ${prim.getIndices().getCount() / 3} triangles; x ${L[0].toFixed(3)}..${H[0].toFixed(3)} y ${L[1].toFixed(3)}..${H[1].toFixed(3)} z ${L[2].toFixed(3)}..${H[2].toFixed(3)}; sheet ${info.width} px, its darkest ${(FLOOR + (1 - FLOOR) * Math.pow(lo / 255, 0.8)).toFixed(2)} of white, mean ${(sum / (info.width * info.height)).toFixed(2)}`);
