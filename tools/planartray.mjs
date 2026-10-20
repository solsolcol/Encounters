/* v21.8 · CHAD'S AMULET DISPLAY TRAY, LIGHT ENOUGH TO STAND IN DOZENS — and
   still his real 3D tray. OFFLINE.
   (Chad: "you removed too much detail from the amulet display trays and
   shelf. I wanted it as real 3d, not just texture".) The shop holds 86 of
   his trays. Near the player each one is his scan cut to 6 % (traynear.glb,
   tools/permcut.mjs STRICT=1 NW=0.5: photographed at the closest a player can
   stand, it reads as the full scan). Across the room a tray cannot be cut
   that way below ~12k triangles — his atlas is many islands, and the strict
   simplifier will not cross their seams, while the permissive one smears one
   island's colour into the next (photographed: dark streaks on the velvet).
   So for the far levels the SEAMS are taken away: the tray is a flat board
   seen from the front, so its own front view (tools/bakeboard.mjs, rendered
   from the full 792k scan) is projected straight onto its geometry — every
   vertex's UV is where it sits in that picture — and with no seams left the
   same geometry cuts cleanly to a few thousand triangles. The relief is the
   real geometry's; the colour and metal are his texture as seen from the
   front.
     node tools/planartray.mjs trayfull.glb boardDir out.glb midTris farTris
   trayfull.glb is tools/prepwess.mjs's full tray (base-centred: x centred,
   y 0..H, z centred, the face to +z); boardDir holds bakeboard's output. */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { prune, meshopt, dequantize, weld, compactPrimitive, clearNodeTransform } from '@gltf-transform/functions';
import { MeshoptSimplifier, MeshoptEncoder, MeshoptDecoder } from 'meshoptimizer';
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
await Promise.all([MeshoptSimplifier.ready, MeshoptEncoder.ready, MeshoptDecoder.ready]);
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.encoder': MeshoptEncoder, 'meshopt.decoder': MeshoptDecoder });
const [IN, BOARD, OUT, MT, FT] = process.argv.slice(2);
const board = JSON.parse(fs.readFileSync(path.join(BOARD, 'board.json'), 'utf8'));
const d = await io.read(IN);
await d.transform(dequantize());
const root = d.getRoot();
const nodes = root.listNodes().filter(n => n.getMesh());
if (nodes.length !== 1 || nodes[0].getMesh().listPrimitives().length !== 1) throw new Error('expects one mesh with one primitive');
const node = nodes[0];
clearNodeTransform(node);                         // the quantization's own scale and offset, baked back into the positions
const prim = node.getMesh().listPrimitives()[0];
const pos = prim.getAttribute('POSITION'), n = pos.getCount(), v = [0, 0, 0];
let mn = [Infinity, Infinity, Infinity], mx = [-Infinity, -Infinity, -Infinity];
for (let i = 0; i < n; i++) { pos.getElement(i, v); for (let k = 0; k < 3; k++) { mn[k] = Math.min(mn[k], v[k]); mx[k] = Math.max(mx[k], v[k]); } }
const W = mx[0] - mn[0], H = mx[1] - mn[1];
// the bake and this geometry must be the same board (bakeboard measured the scan before base-centring)
if (Math.abs(W - board.size[0]) > 1e-3 || Math.abs(H - board.size[1]) > 1e-3) throw new Error(`board ${board.size} vs geometry ${W} x ${H}`);
/* the projection: u across, v DOWN the picture (a texture inside a GLB is read with its first row at v = 0) */
const uv = d.createAccessor().setType('VEC2').setArray(new Float32Array(n * 2)).setBuffer(root.listBuffers()[0]);
for (let i = 0; i < n; i++) { pos.getElement(i, v); uv.setElement(i, [(v[0] - mn[0]) / W, (mx[1] - v[1]) / H]); }
prim.setAttribute('TEXCOORD_0', uv);
/* the scan's normals stay (they carry its relief at full size); with no UV seam left, the copies of one point
   become one vertex once the welder sees equal normals too — so the normals are first made to agree across them */
{
  const nor = prim.getAttribute('NORMAL'), I = prim.getIndices().getArray(), P = new Float64Array(n * 3);
  for (let i = 0; i < n; i++) { pos.getElement(i, v); P.set(v, 3 * i); }
  const key = i => `${Math.round(P[3 * i] * 1e5)},${Math.round(P[3 * i + 1] * 1e5)},${Math.round(P[3 * i + 2] * 1e5)}`;
  const gid = new Int32Array(n), gm = new Map(); let G = 0;
  for (let i = 0; i < n; i++) { const k = key(i); let g = gm.get(k); if (g === undefined) { g = G++; gm.set(k, g); } gid[i] = g; }
  const GN = new Float64Array(G * 3), nn = [0, 0, 0];
  for (let i = 0; i < n; i++) { nor.getElement(i, nn); const g = gid[i]; GN[3 * g] += nn[0]; GN[3 * g + 1] += nn[1]; GN[3 * g + 2] += nn[2]; }
  for (let i = 0; i < n; i++) { const g = gid[i], L = Math.hypot(GN[3 * g], GN[3 * g + 1], GN[3 * g + 2]) || 1; nor.setElement(i, [GN[3 * g] / L, GN[3 * g + 1] / L, GN[3 * g + 2] / L]); }
  void I;
}
await d.transform(weld());
/* the mid level: the strict simplifier (no seams left to stop it), the normals weighed so a rim's sideways normal is
   never dragged across the velvet */
const cut = (I, P, N, tris) => {
  const A = new Float32Array(N.length);
  A.set(N);
  return MeshoptSimplifier.simplifyWithAttributes(I, P, 3, A, 3, [0.5, 0.5, 0.5], null, Math.floor(tris) * 3, 0.05, [])[0];
};
const read = (p) => {
  const ps = p.getAttribute('POSITION'), ns = p.getAttribute('NORMAL'), m = ps.getCount(), P = new Float32Array(m * 3), N = new Float32Array(m * 3), t = [0, 0, 0];
  for (let i = 0; i < m; i++) { ps.getElement(i, t); P.set(t, 3 * i); ns.getElement(i, t); N.set(t, 3 * i); }
  return { P, N, I: new Uint32Array(p.getIndices().getArray()) };
};
let r = read(prim);
const t0 = r.I.length / 3;
prim.getIndices().setArray(cut(r.I, r.P, r.N, +MT));
compactPrimitive(prim);
r = read(prim);
const tMid = r.I.length / 3;
/* the far level: cut from the mid's own vertices */
const far = cut(r.I, r.P, r.N, +FT);
/* EACH LEVEL'S NORMALS, FROM ITS OWN TRIANGLES, WITH CREASES. A cut this light has long triangles running from a rim
   down onto the velvet, and a shared vertex there averages the rim's sideways normal with the velvet's upward one —
   a dark wedge across the cloth (photographed). So every corner takes the average of only the faces round its vertex
   that lie within CREASE of its own face, and a vertex is split wherever two of its corners disagree. */
const CREASE = Math.cos(48 * Math.PI / 180);
const uvA = prim.getAttribute('TEXCOORD_0');
const UV = new Float32Array(uvA.getCount() * 2), tw = [0, 0];
for (let i = 0; i < uvA.getCount(); i++) { uvA.getElement(i, tw); UV[2 * i] = tw[0]; UV[2 * i + 1] = tw[1]; }
function level(I) {
  const T = I.length / 3, FN = new Float64Array(T * 3), around = new Map();
  for (let t = 0; t < T; t++) {
    const a = I[3 * t], b = I[3 * t + 1], c = I[3 * t + 2];
    const ux = r.P[3*b]-r.P[3*a], uy = r.P[3*b+1]-r.P[3*a+1], uz = r.P[3*b+2]-r.P[3*a+2];
    const vx = r.P[3*c]-r.P[3*a], vy = r.P[3*c+1]-r.P[3*a+1], vz = r.P[3*c+2]-r.P[3*a+2];
    FN[3*t] = uy*vz-uz*vy; FN[3*t+1] = uz*vx-ux*vz; FN[3*t+2] = ux*vy-uy*vx;
    for (const i of [a, b, c]) { let l = around.get(i); if (!l) around.set(i, l = []); l.push(t); }
  }
  const unit = (t) => { const L = Math.hypot(FN[3*t], FN[3*t+1], FN[3*t+2]) || 1; return [FN[3*t] / L, FN[3*t+1] / L, FN[3*t+2] / L]; };
  const outP = [], outU = [], outN = [], outI = [], made = new Map();
  for (let t = 0; t < T; t++) {
    const f = unit(t);
    for (let k = 0; k < 3; k++) {
      const i = I[3 * t + k];
      let x = 0, y = 0, z = 0;
      for (const o of around.get(i)) { const g = unit(o); if (g[0]*f[0] + g[1]*f[1] + g[2]*f[2] < CREASE) continue; x += FN[3*o]; y += FN[3*o+1]; z += FN[3*o+2]; }
      const L = Math.hypot(x, y, z) || 1; x /= L; y /= L; z /= L;
      const key = `${i}|${Math.round(x * 50)},${Math.round(y * 50)},${Math.round(z * 50)}`;
      let j = made.get(key);
      if (j === undefined) { j = outP.length / 3; made.set(key, j); outP.push(r.P[3*i], r.P[3*i+1], r.P[3*i+2]); outU.push(UV[2*i], UV[2*i+1]); outN.push(x, y, z); }
      outI.push(j);
    }
  }
  const buf = root.listBuffers()[0];
  const pr = d.createPrimitive().setMaterial(prim.getMaterial())
    .setAttribute('POSITION', d.createAccessor().setType('VEC3').setArray(new Float32Array(outP)).setBuffer(buf))
    .setAttribute('NORMAL', d.createAccessor().setType('VEC3').setArray(new Float32Array(outN)).setBuffer(buf))
    .setAttribute('TEXCOORD_0', d.createAccessor().setType('VEC2').setArray(new Float32Array(outU)).setBuffer(buf))
    .setIndices(d.createAccessor().setType('SCALAR').setArray(new Uint32Array(outI)).setBuffer(buf));
  return pr;
}
const midP = level(r.I), farP = level(far);
const sceneRoot = node.getParentNode() || root.listScenes()[0];
sceneRoot.addChild(d.createNode('tray_mid').setMesh(d.createMesh('tray_mid').addPrimitive(midP)));
sceneRoot.addChild(d.createNode('tray_far').setMesh(d.createMesh('tray_far').addPrimitive(farP)));
const oldMat = prim.getMaterial();
node.getMesh().dispose(); node.dispose();
/* the maps: the bake's colour and metal-roughness (its relief is now real geometry, so no normal map) */
const mat = oldMat;
const col = await sharp(path.join(BOARD, 'board_color.png')).flatten({ background: { r: 58, g: 7, b: 8 } }).jpeg({ quality: 88, mozjpeg: true }).toBuffer();
const mr = await sharp(path.join(BOARD, 'board_mr.png')).flatten({ background: { r: 0, g: 230, b: 0 } }).resize(1024, Math.round(1024 * board.h / board.w)).jpeg({ quality: 88, chromaSubsampling: '4:4:4', mozjpeg: true }).toBuffer();
const tex = (buf, name) => d.createTexture(name).setImage(buf).setMimeType('image/jpeg');
mat.setBaseColorTexture(tex(col, 'tray_color')).setMetallicRoughnessTexture(tex(mr, 'tray_mr')).setNormalTexture(null)
   .setMetallicFactor(1).setRoughnessFactor(1).setOcclusionTexture(null).setEmissiveTexture(null);
await d.transform(prune(), meshopt({ encoder: MeshoptEncoder, level: 'medium' }));
await io.write(OUT, d);
console.log(`planartray ${path.basename(OUT)}: ${t0} -> mid ${tMid}, far ${far.length / 3}; ${(fs.statSync(OUT).size / 1024).toFixed(0)} KB`);
