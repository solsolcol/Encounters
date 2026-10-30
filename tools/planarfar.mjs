/* v24.22 · A FAR LEVEL FOR A SMALL FLAT PIECE — v21.8's planar tray (tools/planartray.mjs) made general for one
   cased amulet. OFFLINE.

   Episode 4 chapter 1's shop stands its cased amulets by the hundred (a Phra Somdej, a Khun Paen, a coin, a Jatukham:
   Meshy models of 1,750–2,800 triangles each), and from across the shop a piece is a few dozen pixels. The regular
   simplifier cannot cut them: a Meshy file's atlas puts a UV seam every few triangles, the strict cut stops at the
   seams and the permissive one tears the casing into crumpled facets (photographed, masters/v24.22). But a cased
   amulet IS a flat thing seen from the front — so its front is rendered once, orthographic, from the near model
   (tools/bakeboard.mjs: its colour, and its metal and roughness, raw), that picture is projected straight onto its
   own geometry (every vertex's UV is where it sits in the picture), and with no seam left the same surface cuts
   cleanly to a few hundred triangles that keep its outline and its relief.
     node tools/planarfar.mjs in.glb out.glb farTris name [px=256]
   in.glb: ONE mesh node with ONE primitive, the face to +z (tools/prepmeshy.mjs's output). out.glb carries the piece
   twice over: `<name>_near`, the input as it came, and `<name>_far`, farTris triangles of the same surface wearing
   its own two small maps. In the game the shop draws whichever its distance asks for (e4c1's stock). */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { prune, meshopt, dequantize, clearNodeTransform } from '@gltf-transform/functions';
import { MeshoptSimplifier, MeshoptEncoder, MeshoptDecoder } from 'meshoptimizer';
import { execFileSync } from 'node:child_process';
import sharp from 'sharp';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
await Promise.all([MeshoptSimplifier.ready, MeshoptEncoder.ready, MeshoptDecoder.ready]);
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.encoder': MeshoptEncoder, 'meshopt.decoder': MeshoptDecoder });
const [IN, OUT, FT, NAME, PXs] = process.argv.slice(2);
if (!NAME) throw new Error('usage: planarfar.mjs in.glb out.glb farTris name [px]');
const PX = +(PXs || 256);

const d = await io.read(IN);
await d.transform(dequantize());
const root = d.getRoot();
const nodes = root.listNodes().filter(n => n.getMesh());
if (nodes.length !== 1 || nodes[0].getMesh().listPrimitives().length !== 1) throw new Error('expects one mesh node with one primitive');
const node = nodes[0];
clearNodeTransform(node);                         // the quantization's scale and offset, baked back into the positions
node.setName(`${NAME}_near`);
const prim = node.getMesh().listPrimitives()[0];

/* 1 · the bake: a plain copy (no meshopt — bakeboard's loader has no decoder) photographed from the front */
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'planarfar-'));
for (const e of root.listExtensionsUsed()) if (e.extensionName === 'EXT_meshopt_compression' || e.extensionName === 'KHR_mesh_quantization') e.dispose();
await io.write(path.join(tmp, 'plain.glb'), d);
execFileSync('node', ['tools/bakeboard.mjs', path.join(tmp, 'plain.glb'), path.join(tmp, 'bake'), String(PX)], { stdio: 'inherit' });
const board = JSON.parse(fs.readFileSync(path.join(tmp, 'bake', 'board.json'), 'utf8'));

/* 2 · the geometry: the near level's own positions and normals */
const pos = prim.getAttribute('POSITION'), nor = prim.getAttribute('NORMAL'), n = pos.getCount(), v = [0, 0, 0];
const P0 = new Float64Array(n * 3), N0 = new Float64Array(n * 3);
for (let i = 0; i < n; i++) { pos.getElement(i, v); P0.set(v, 3 * i); nor.getElement(i, v); N0.set(v, 3 * i); }
const I0 = prim.getIndices().getArray();
let mn = [Infinity, Infinity, Infinity], mx = [-Infinity, -Infinity, -Infinity];
for (let i = 0; i < n; i++) for (let k = 0; k < 3; k++) { mn[k] = Math.min(mn[k], P0[3 * i + k]); mx[k] = Math.max(mx[k], P0[3 * i + k]); }
const W = mx[0] - mn[0], H = mx[1] - mn[1];
if (Math.abs(W - board.size[0]) > 1e-4 || Math.abs(H - board.size[1]) > 1e-4) throw new Error(`bake ${board.size} vs geometry ${W} x ${H}`);
/* every copy of one point (the near level's UV seams split it) becomes ONE vertex: its normal the copies' average */
const key = i => `${Math.round(P0[3 * i] * 1e6)},${Math.round(P0[3 * i + 1] * 1e6)},${Math.round(P0[3 * i + 2] * 1e6)}`;
const gid = new Int32Array(n), gm = new Map(); let G = 0;
for (let i = 0; i < n; i++) { const k = key(i); let g = gm.get(k); if (g === undefined) { g = G++; gm.set(k, g); } gid[i] = g; }
const P = new Float32Array(G * 3), NA = new Float64Array(G * 3);
for (let i = 0; i < n; i++) { const g = gid[i]; P[3 * g] = P0[3 * i]; P[3 * g + 1] = P0[3 * i + 1]; P[3 * g + 2] = P0[3 * i + 2];
  NA[3 * g] += N0[3 * i]; NA[3 * g + 1] += N0[3 * i + 1]; NA[3 * g + 2] += N0[3 * i + 2]; }
const N = new Float32Array(G * 3);
for (let g = 0; g < G; g++) { const L = Math.hypot(NA[3 * g], NA[3 * g + 1], NA[3 * g + 2]) || 1; N[3 * g] = NA[3 * g] / L; N[3 * g + 1] = NA[3 * g + 1] / L; N[3 * g + 2] = NA[3 * g + 2] / L; }
const I = new Uint32Array(I0.length);
for (let i = 0; i < I0.length; i++) I[i] = gid[I0[i]];
/* the projection: u across, v DOWN the picture (a texture in a GLB is read with its first row at v = 0) */
const UV = new Float32Array(G * 2);
for (let g = 0; g < G; g++) { UV[2 * g] = (P[3 * g] - mn[0]) / W; UV[2 * g + 1] = (mx[1] - P[3 * g + 1]) / H; }
/* 3 · the cut: the regular simplifier, strict (there is no seam left to stop it), the normals weighed */
const far = MeshoptSimplifier.simplifyWithAttributes(I, P, 3, N, 3, [0.5, 0.5, 0.5], null, Math.floor(+FT) * 3, 0.05, [])[0];
/* each corner's normal from the faces round it within 48° of its own (planartray's law: a light cut has long
   triangles from a rim onto the face, and a shared vertex there would average the rim's sideways normal into it) */
const CREASE = Math.cos(48 * Math.PI / 180), T = far.length / 3, FN = new Float64Array(T * 3), around = new Map();
for (let t = 0; t < T; t++) {
  const a = far[3 * t], b = far[3 * t + 1], c = far[3 * t + 2];
  const ux = P[3*b]-P[3*a], uy = P[3*b+1]-P[3*a+1], uz = P[3*b+2]-P[3*a+2], vx = P[3*c]-P[3*a], vy = P[3*c+1]-P[3*a+1], vz = P[3*c+2]-P[3*a+2];
  FN[3*t] = uy*vz-uz*vy; FN[3*t+1] = uz*vx-ux*vz; FN[3*t+2] = ux*vy-uy*vx;
  for (const i of [a, b, c]) { let l = around.get(i); if (!l) around.set(i, l = []); l.push(t); }
}
const unit = t => { const L = Math.hypot(FN[3*t], FN[3*t+1], FN[3*t+2]) || 1; return [FN[3*t] / L, FN[3*t+1] / L, FN[3*t+2] / L]; };
const oP = [], oU = [], oN = [], oI = [], made = new Map();
for (let t = 0; t < T; t++) {
  const f = unit(t);
  for (let k = 0; k < 3; k++) {
    const i = far[3 * t + k];
    let x = 0, y = 0, z = 0;
    for (const o of around.get(i)) { const q = unit(o); if (q[0]*f[0] + q[1]*f[1] + q[2]*f[2] < CREASE) continue; x += FN[3*o]; y += FN[3*o+1]; z += FN[3*o+2]; }
    const L = Math.hypot(x, y, z) || 1; x /= L; y /= L; z /= L;
    const kk = `${i}|${Math.round(x * 50)},${Math.round(y * 50)},${Math.round(z * 50)}`;
    let j = made.get(kk);
    if (j === undefined) { j = oP.length / 3; made.set(kk, j); oP.push(P[3*i], P[3*i+1], P[3*i+2]); oU.push(UV[2*i], UV[2*i+1]); oN.push(x, y, z); }
    oI.push(j);
  }
}
/* 4 · its maps: the bake's colour, its edge grown outward over the empty background (a rim's texels sample the
   picture's edge — left transparent, the background would bleed in as a dark line), and its metal and roughness */
const grow = async (file, passes) => {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const w = info.width, h = info.height, px = Buffer.from(data);
  for (let p = 0; p < passes; p++) {
    const src = Buffer.from(px);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const o = 4 * (y * w + x); if (src[o + 3] > 8) continue;
      let r = 0, g = 0, b = 0, c = 0;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const xx = x + dx, yy = y + dy; if (xx < 0 || yy < 0 || xx >= w || yy >= h) continue;
        const q = 4 * (yy * w + xx); if (src[q + 3] > 8) { r += src[q]; g += src[q + 1]; b += src[q + 2]; c++; } }
      if (c) { px[o] = r / c; px[o + 1] = g / c; px[o + 2] = b / c; px[o + 3] = 255; }
    }
  }
  return sharp(px, { raw: { width: w, height: h, channels: 4 } }).flatten({ background: { r: 128, g: 110, b: 70 } });
};
const col = await (await grow(path.join(tmp, 'bake', 'board_color.png'), 12)).jpeg({ quality: 90, mozjpeg: true }).toBuffer();
const mr = await (await grow(path.join(tmp, 'bake', 'board_mr.png'), 12)).jpeg({ quality: 90, chromaSubsampling: '4:4:4', mozjpeg: true }).toBuffer();
const buf = root.listBuffers()[0];
const fm = d.createMaterial(`${NAME}_far`)
  .setBaseColorTexture(d.createTexture(`${NAME}_far_color`).setImage(col).setMimeType('image/jpeg'))
  .setMetallicRoughnessTexture(d.createTexture(`${NAME}_far_mr`).setImage(mr).setMimeType('image/jpeg'))
  .setMetallicFactor(1).setRoughnessFactor(1);
const fp = d.createPrimitive().setMaterial(fm)
  .setAttribute('POSITION', d.createAccessor().setType('VEC3').setArray(new Float32Array(oP)).setBuffer(buf))
  .setAttribute('NORMAL', d.createAccessor().setType('VEC3').setArray(new Float32Array(oN)).setBuffer(buf))
  .setAttribute('TEXCOORD_0', d.createAccessor().setType('VEC2').setArray(new Float32Array(oU)).setBuffer(buf))
  .setIndices(d.createAccessor().setType('SCALAR').setArray(new Uint32Array(oI)).setBuffer(buf));
(node.getParentNode() || root.listScenes()[0]).addChild(d.createNode(`${NAME}_far`).setMesh(d.createMesh(`${NAME}_far`).addPrimitive(fp)));
await d.transform(prune(), meshopt({ encoder: MeshoptEncoder, level: 'medium' }));
await io.write(OUT, d);
fs.rmSync(tmp, { recursive: true, force: true });
console.log(`planarfar ${NAME}: near ${I0.length / 3}, far ${oI.length / 3} (${G} unique points); ${(fs.statSync(OUT).size / 1024).toFixed(0)} KB`);
