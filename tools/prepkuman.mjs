/* v23.0 — Chad's three kumanthong (Drive 1Jj5s0xuYuXUYw8Ep0ixe8GilmMhp7RAg,
   on disk at masters/v22.0/src/), made shippable for episode 3 chapter 5's
   altar, where they are seen in MACRO (0.20–0.35 m) as well as from the mat
   and the bed. OFFLINE prep, one file per child with TWO levels in it:

     node `<name>_near`  the near level — every triangle of the scan
                         (kuman1, kuman3), or, for the 7M-triangle kuman2,
                         a cut by an error bound far under a pixel at macro
     node `<name>_far`   a permissive cut of the SAME vertices — only its
                         index list differs (tools/lodpair.mjs's shape), so
                         it costs one index buffer and wears the near level's
                         maps and UVs (v21.8's prune trap cannot happen: the
                         vertices are shared, nothing is pruned from them)

   Measured at CP1 (docs/V23.0-E3C5-PLAN.md §15):
   - all three are Meshy-style scans: ONE mesh, one material, colour 8192,
     normal and metal-roughness 4096, ~1.90 units tall, Y up, FACING +z
     (settled by render — masters/v23.0/kuman/shots; the measures are only a
     guard, v12.1);
   - kuman2 (the little one, 7,025,694 triangles) is ONE connected component:
     the two locks of real hair (2.2M triangles each, strand tubes ~2 mm
     across in the scan's units) are fused to the head, and the bells to the
     garland. So the hair cannot be thinned BY STRAND and the bells cannot be
     cut out to swing (V18 falls back to sound only). What CAN be done is a
     cut under an error bound: a strand's straight runs merge, its tube stays
     — ERR 0.0004 of the extent is 0.76 mm on the scan, 0.1 mm on the 0.24 m
     figure, half a pixel at the closest macro on a phone;
   - kuman1's normals are split at 70k of its UV seams (median 6°, some
     opposite — two-sided thin gilt). A close-up render shows no crease, so
     they are KEPT; averaging them would cancel the opposite pairs into NaN
     (the v19.8 slit). kuman2 and kuman3 agree across every seam (0.0°).

   The bake: the base on y = 0, centred on the BASE's footprint (the lowest
   3 % of the height — a figure leaning over its plinth is still stood on
   it), height 1.0, facing +z; the chapter scales each to its height in
   metres. The contract is asserted BEFORE the meshopt pass (v12.1/v13.1).
   Maps: colour COLPX (4096), normal NPX (2048), metal-roughness MRPX (2048),
   WebP on a PLAIN source — never EXT_texture_webp, which rescueTextures
   cannot read (v14.12).

     node `<name>_dist`  (v23.0 CP4, env DIST) a third, lighter cut of the
                         same vertices for the figure across the room (from
                         the door and the bed, past 1.25 m): on a phone the
                         three then cost ~75k triangles there, not 361k

     node tools/prepkuman.mjs <in.glb> <out.glb> <name> [farTris]
     env: ERR (0 = every triangle), COLPX, NPX, MRPX, FACE=neg (half turn), DIST (tris of the third level) */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { metalRough, prune, flatten, clearNodeTransform, meshopt } from '@gltf-transform/functions';
import { MeshoptSimplifier, MeshoptEncoder, MeshoptDecoder } from 'meshoptimizer';
import sharp from 'sharp';
import fs from 'node:fs';

const [IN, OUT, NAME, FT] = process.argv.slice(2);
if (!NAME) throw new Error('usage: prepkuman.mjs in.glb out.glb name [farTris]');
const ERR = +(process.env.ERR || 0), COLPX = +(process.env.COLPX || 4096), NPX = +(process.env.NPX || 2048), MRPX = +(process.env.MRPX || 2048);
await Promise.all([MeshoptSimplifier.ready, MeshoptEncoder.ready, MeshoptDecoder.ready]);
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.encoder': MeshoptEncoder, 'meshopt.decoder': MeshoptDecoder });
const doc = await io.read(IN);
const root = doc.getRoot();
const before = fs.statSync(IN).size;
await doc.transform(metalRough(), prune(), flatten());
for (const n of root.listNodes()) clearNodeTransform(n);
const id = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
for (const n of root.listNodes()) if (n.getMatrix().some((v, i) => Math.abs(v - id[i]) > 1e-6)) throw new Error('a node transform survived the bake');
const meshNodes = root.listNodes().filter(n => n.getMesh());
if (meshNodes.length !== 1 || meshNodes[0].getMesh().listPrimitives().length !== 1) throw new Error('expects one mesh node with one primitive');
const node = meshNodes[0], prim = node.getMesh().listPrimitives()[0];
for (const sem of prim.listSemantics()) if (!['POSITION', 'NORMAL', 'TEXCOORD_0'].includes(sem)) prim.setAttribute(sem, null);

let P = new Float32Array(prim.getAttribute('POSITION').getArray());
let N = new Float32Array(prim.getAttribute('NORMAL').getArray());
let UV = new Float32Array(prim.getAttribute('TEXCOORD_0').getArray());
let I = new Uint32Array(prim.getIndices().getArray());
const t0 = I.length / 3;

/* the near level: every triangle, or a cut under an error bound (kuman2) */
if (ERR > 0) {
  const [idx, e] = MeshoptSimplifier.simplifyWithAttributes(I, P, 3, UV, 2, [0.5, 0.5], null, 3, ERR, []);
  console.log(`  near cut at error ${ERR}: ${t0} -> ${idx.length / 3} triangles (error reached ${e.toFixed(6)})`);
  /* keep only the vertices the cut still uses, in first-use order */
  const map = new Int32Array(P.length / 3).fill(-1); let nv = 0;
  for (let k = 0; k < idx.length; k++) if (map[idx[k]] < 0) map[idx[k]] = nv++;
  const P2 = new Float32Array(nv * 3), N2 = new Float32Array(nv * 3), U2 = new Float32Array(nv * 2);
  for (let v = 0; v < map.length; v++) { const w = map[v]; if (w < 0) continue; P2.set(P.subarray(3 * v, 3 * v + 3), 3 * w); N2.set(N.subarray(3 * v, 3 * v + 3), 3 * w); U2.set(UV.subarray(2 * v, 2 * v + 2), 2 * w); }
  const I2 = new Uint32Array(idx.length); for (let k = 0; k < idx.length; k++) I2[k] = map[idx[k]];
  P = P2; N = N2; UV = U2; I = I2;
}

/* the bake: base centre on the origin, base on y = 0, height 1.0, facing +z */
const nv = P.length / 3;
let lo = [Infinity, Infinity, Infinity], hi = [-Infinity, -Infinity, -Infinity];
for (let i = 0; i < nv; i++) for (let k = 0; k < 3; k++) { const v = P[3 * i + k]; if (v < lo[k]) lo[k] = v; if (v > hi[k]) hi[k] = v; }
const span = hi.map((v, k) => v - lo[k]);
if (!(span[1] >= span[0] && span[1] >= span[2])) throw new Error('not standing up: ' + span.map(v => v.toFixed(3)));
const footY = lo[1] + span[1] * 0.03;
let flo = [Infinity, Infinity], fhi = [-Infinity, -Infinity];
for (let i = 0; i < nv; i++) if (P[3 * i + 1] <= footY) { const x = P[3 * i], z = P[3 * i + 2]; if (x < flo[0]) flo[0] = x; if (x > fhi[0]) fhi[0] = x; if (z < flo[1]) flo[1] = z; if (z > fhi[1]) fhi[1] = z; }
const cx = (flo[0] + fhi[0]) / 2, cz = (flo[1] + fhi[1]) / 2, s = 1 / span[1];
const turn = process.env.FACE === 'neg';
for (let i = 0; i < nv; i++) {
  let x = (P[3 * i] - cx) * s, y = (P[3 * i + 1] - lo[1]) * s, z = (P[3 * i + 2] - cz) * s;
  let nx = N[3 * i], ny = N[3 * i + 1], nz = N[3 * i + 2];
  if (turn) { x = -x; z = -z; nx = -nx; nz = -nz; }
  P[3 * i] = x; P[3 * i + 1] = y; P[3 * i + 2] = z;
  const L = Math.hypot(nx, ny, nz) || 1; N[3 * i] = nx / L; N[3 * i + 1] = ny / L; N[3 * i + 2] = nz / L;
}
console.log(`  box ${span.map(v => v.toFixed(3))} -> height 1.0; base footprint ${(fhi[0] - flo[0]).toFixed(3)} x ${(fhi[1] - flo[1]).toFixed(3)} centred (${cx.toFixed(3)}, ${cz.toFixed(3)})${turn ? '; half turn (FACE=neg)' : ''}`);

/* the contract, BEFORE quantization */
{
  let l2 = [Infinity, Infinity, Infinity], h2 = [-Infinity, -Infinity, -Infinity];
  for (let i = 0; i < nv; i++) for (let k = 0; k < 3; k++) { const v = P[3 * i + k]; if (v < l2[k]) l2[k] = v; if (v > h2[k]) h2[k] = v; }
  if (Math.abs(h2[1] - l2[1] - 1) > 1e-4) throw new Error('height is not 1.0');
  if (Math.abs(l2[1]) > 1e-4) throw new Error('the base is not on y = 0');
  for (let i = 0; i < N.length; i++) if (!Number.isFinite(N[i])) throw new Error('a normal is not finite');
  console.log(`  baked box ${l2.map(v => v.toFixed(3))} .. ${h2.map(v => v.toFixed(3))}`);
}
const buf = root.listBuffers()[0];
prim.setAttribute('POSITION', doc.createAccessor().setType('VEC3').setArray(P).setBuffer(buf));
prim.setAttribute('NORMAL', doc.createAccessor().setType('VEC3').setArray(N).setBuffer(buf));
prim.setAttribute('TEXCOORD_0', doc.createAccessor().setType('VEC2').setArray(UV).setBuffer(buf));
prim.setIndices(doc.createAccessor().setType('SCALAR').setArray(I).setBuffer(buf));
node.setName(`${NAME}_near`); node.getMesh().setName(`${NAME}_near`);

/* the far level: a permissive cut over the SAME vertices (lodpair's shape) */
const report = [`near ${I.length / 3}`];
if (FT) {
  const tris = +FT < 1 ? Math.floor(I.length / 3 * +FT) : Math.floor(+FT);
  const [idx, e] = MeshoptSimplifier.simplifyWithAttributes(I, P, 3, UV, 2, [1, 1], null, tris * 3, +(process.env.FARERR || 0.02), ['Permissive']);
  const fp = doc.createPrimitive().setMaterial(prim.getMaterial()).setIndices(doc.createAccessor().setType('SCALAR').setArray(new Uint32Array(idx)).setBuffer(buf));
  for (const sem of prim.listSemantics()) fp.setAttribute(sem, prim.getAttribute(sem));
  const fn = doc.createNode(`${NAME}_far`).setMesh(doc.createMesh(`${NAME}_far`).addPrimitive(fp));
  root.listScenes()[0].addChild(fn);
  report.push(`far ${idx.length / 3} (permissive, error ${e.toFixed(4)})`);
}
if (process.env.DIST) {
  const tris = Math.floor(+process.env.DIST);
  const [idx, e] = MeshoptSimplifier.simplifyWithAttributes(I, P, 3, UV, 2, [1, 1], null, tris * 3, +(process.env.DISTERR || 0.05), ['Permissive']);
  const dp = doc.createPrimitive().setMaterial(prim.getMaterial()).setIndices(doc.createAccessor().setType('SCALAR').setArray(new Uint32Array(idx)).setBuffer(buf));
  for (const sem of prim.listSemantics()) dp.setAttribute(sem, prim.getAttribute(sem));
  const dn = doc.createNode(`${NAME}_dist`).setMesh(doc.createMesh(`${NAME}_dist`).addPrimitive(dp));
  root.listScenes()[0].addChild(dn);
  report.push(`dist ${idx.length / 3} (permissive, error ${e.toFixed(4)})`);
}

/* the sheets */
const mat = prim.getMaterial();
mat.setOcclusionTexture(null).setEmissiveTexture(null).setAlphaMode('OPAQUE').setDoubleSided(false);
for (const [tex, px, q] of [[mat.getBaseColorTexture(), COLPX, 90], [mat.getNormalTexture(), NPX, 92], [mat.getMetallicRoughnessTexture(), MRPX, 90]]) {
  if (!tex) continue;
  const img = await sharp(Buffer.from(tex.getImage()), { limitInputPixels: false }).resize(px, px, { fit: 'fill' }).webp({ quality: q }).toBuffer();
  tex.setImage(img).setMimeType('image/webp').setURI('');
}
await doc.transform(prune(), meshopt({ encoder: MeshoptEncoder, level: 'medium', quantizePosition: 16, quantizeNormal: 12, quantizeTexcoord: 16 }));
await io.write(OUT, doc);
console.log(`prepkuman ${NAME}: ${report.join(', ')}; ${(before / 1048576).toFixed(1)} MB -> ${(fs.statSync(OUT).size / 1048576).toFixed(2)} MB`);
