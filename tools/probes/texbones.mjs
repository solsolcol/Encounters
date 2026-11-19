/* v27.0 (R43, R77) · WHICH KIND OF BONE DRAWS EACH TEXEL OF A SHEET. Every triangle drawn with the sheet a material names
   (by the texture's name) is rasterized at R, and each texel it covers is marked by the kind of bone most of the
   triangle's weight rides: bit 1 a bone of the body (anything the cloth regex does not name), bit 2 a bone of the cloth
   (CLOTH, default /^(Drape|Skirt|Cloth_)/: his robe's drape, skirt and lower cloth). The map is written raw (Uint8, R x R,
   row 0 the image's top) for tools/phoflecks.py: a texel of skin colour that only the cloth draws is paint on the robe,
   whatever piece of the sheet it lies in (his forearm's skin carried on into the drape at his elbow).
     node tools/probes/texbones.mjs <file.glb> <texture name> <out.u8> [R=4096] */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder, MeshoptEncoder } from 'meshoptimizer';
import fs from 'node:fs';
await MeshoptDecoder.ready; await MeshoptEncoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder, 'meshopt.encoder': MeshoptEncoder });
const [FILE, TEX, OUT, RS] = process.argv.slice(2), R = +(RS || 4096);
const CLOTH = new RegExp(process.env.CLOTH || '^(Drape|Skirt|Cloth_)');
if (!FILE || !TEX || !OUT) { console.error('usage: node tools/probes/texbones.mjs <file.glb> <texture name> <out.u8> [R]'); process.exit(1); }
const doc = await io.read(FILE);
const mark = new Uint8Array(R * R);
let tris = 0, clothTris = 0;
for (const node of doc.getRoot().listNodes()) {
  const mesh = node.getMesh(); if (!mesh) continue;
  const sk = node.getSkin(); const names = sk ? sk.listJoints().map(j => j.getName()) : [];
  for (const p of mesh.listPrimitives()) {
    const mat = p.getMaterial(), tex = mat && mat.getBaseColorTexture();
    if (!tex || tex.getName() !== TEX) continue;
    const uvA = p.getAttribute('TEXCOORD_0'), ix = p.getIndices(), J = p.getAttribute('JOINTS_0'), W = p.getAttribute('WEIGHTS_0');
    if (!uvA || !ix) continue;
    const m = ix.getCount() / 3, e = [], jj = [], ww = [];
    for (let t = 0; t < m; t++) {
      const v = [ix.getScalar(3 * t), ix.getScalar(3 * t + 1), ix.getScalar(3 * t + 2)];
      let cw = 0, bw = 0;
      if (J && W) for (const k of v) { J.getElement(k, jj); W.getElement(k, ww); for (let a = 0; a < 4; a++) if (ww[a] > 0) { if (CLOTH.test(names[jj[a]] || '')) cw += ww[a]; else bw += ww[a]; } }
      const bit = cw > bw ? 2 : 1; tris++; if (bit === 2) clothTris++;
      const P = v.map(k => { uvA.getElement(k, e); return [e[0] * R, e[1] * R]; });
      const d = (P[1][1] - P[2][1]) * (P[0][0] - P[2][0]) + (P[2][0] - P[1][0]) * (P[0][1] - P[2][1]); if (Math.abs(d) < 1e-12) continue;
      const bx0 = Math.max(0, Math.floor(Math.min(P[0][0], P[1][0], P[2][0]))), bx1 = Math.min(R - 1, Math.ceil(Math.max(P[0][0], P[1][0], P[2][0])));
      const by0 = Math.max(0, Math.floor(Math.min(P[0][1], P[1][1], P[2][1]))), by1 = Math.min(R - 1, Math.ceil(Math.max(P[0][1], P[1][1], P[2][1])));
      for (let y = by0; y <= by1; y++) for (let x = bx0; x <= bx1; x++) {
        const px = x + 0.5, py = y + 0.5, l0 = ((P[1][1] - P[2][1]) * (px - P[2][0]) + (P[2][0] - P[1][0]) * (py - P[2][1])) / d, l1 = ((P[2][1] - P[0][1]) * (px - P[2][0]) + (P[0][0] - P[2][0]) * (py - P[2][1])) / d;
        if (l0 < 0 || l1 < 0 || l0 + l1 > 1) continue; mark[y * R + x] |= bit;
      }
    }
  }
}
fs.writeFileSync(OUT, Buffer.from(mark.buffer));
let n1 = 0, n2 = 0, n3 = 0; for (let k = 0; k < R * R; k++) { if (mark[k] === 1) n1++; else if (mark[k] === 2) n2++; else if (mark[k] === 3) n3++; }
console.log(`${FILE.split('/').pop()} '${TEX}': ${tris} triangles, ${clothTris} riding the cloth; texels: body only ${n1}, cloth only ${n2}, both ${n3} -> ${OUT}`);
