/* v27.0 (R43) · WHERE ON A BODY THE TEXELS OF A MASK ARE DRAWN. Every triangle drawn with the sheet a material names (by
   the texture's name) is rasterized at 4096, and each one that covers a texel of the mask (raw Uint8, 4096 x 4096, row 0
   the image's top) is listed with how many of its texels the mask holds, its centre in the file's own space (node
   transforms applied: the bind pose) and the bone most of its weight rides; grouped by mesh and bone on the console.
     node tools/probes/texwhere.mjs <file.glb> <texture name> <mask.u8> <out.json> */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder, MeshoptEncoder } from 'meshoptimizer';
import fs from 'node:fs';
await MeshoptDecoder.ready; await MeshoptEncoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder, 'meshopt.encoder': MeshoptEncoder });
const [FILE, TEX, MASK, OUT] = process.argv.slice(2), R = 4096;
const mask = fs.readFileSync(MASK);
const doc = await io.read(FILE);
const out = [];
const skins = doc.getRoot().listSkins();
for (const node of doc.getRoot().listNodes()) {
  const mesh = node.getMesh(); if (!mesh) continue;
  const W = node.getWorldMatrix();
  const sk = node.getSkin(); const joints = sk ? sk.listJoints().map(j => j.getName()) : [];
  for (const p of mesh.listPrimitives()) {
    const mat = p.getMaterial(), tex = mat && mat.getBaseColorTexture();
    if (!tex || tex.getName() !== TEX) continue;
    const uvA = p.getAttribute('TEXCOORD_0'), pos = p.getAttribute('POSITION'), ix = p.getIndices();
    const J = p.getAttribute('JOINTS_0'), Wt = p.getAttribute('WEIGHTS_0');
    const m = ix.getCount() / 3, e = [], q = [], jj = [], ww = [];
    for (let t = 0; t < m; t++) {
      const v = [ix.getScalar(3 * t), ix.getScalar(3 * t + 1), ix.getScalar(3 * t + 2)];
      const P = v.map(k => { uvA.getElement(k, e); return [e[0] * R, e[1] * R]; });
      const d = (P[1][1] - P[2][1]) * (P[0][0] - P[2][0]) + (P[2][0] - P[1][0]) * (P[0][1] - P[2][1]); if (Math.abs(d) < 1e-12) continue;
      const bx0 = Math.max(0, Math.floor(Math.min(P[0][0], P[1][0], P[2][0]))), bx1 = Math.min(R - 1, Math.ceil(Math.max(P[0][0], P[1][0], P[2][0])));
      const by0 = Math.max(0, Math.floor(Math.min(P[0][1], P[1][1], P[2][1]))), by1 = Math.min(R - 1, Math.ceil(Math.max(P[0][1], P[1][1], P[2][1])));
      let tot = 0, hit = 0;
      for (let y = by0; y <= by1; y++) for (let x = bx0; x <= bx1; x++) {
        const px = x + 0.5, py = y + 0.5, l0 = ((P[1][1] - P[2][1]) * (px - P[2][0]) + (P[2][0] - P[1][0]) * (py - P[2][1])) / d, l1 = ((P[2][1] - P[0][1]) * (px - P[2][0]) + (P[0][0] - P[2][0]) * (py - P[2][1])) / d;
        if (l0 < 0 || l1 < 0 || l0 + l1 > 1) continue; tot++; if (mask[y * R + x]) hit++;
      }
      if (!hit) continue;
      const c = [0, 0, 0]; for (const k of v) { pos.getElement(k, q); c[0] += q[0] / 3; c[1] += q[1] / 3; c[2] += q[2] / 3; }
      const w = W, wx = w[0] * c[0] + w[4] * c[1] + w[8] * c[2] + w[12], wy = w[1] * c[0] + w[5] * c[1] + w[9] * c[2] + w[13], wz = w[2] * c[0] + w[6] * c[1] + w[10] * c[2] + w[14];
      const acc = new Map(); if (J) for (const k of v) { J.getElement(k, jj); Wt.getElement(k, ww); for (let a = 0; a < 4; a++) if (ww[a] > 0) acc.set(jj[a], (acc.get(jj[a]) || 0) + ww[a]); }
      let best = -1, bw = -1; for (const [a, b2] of acc) if (b2 > bw) { bw = b2; best = a; }
      out.push({ mesh: mesh.getName(), t, tot, hit, c: [+wx.toFixed(3), +wy.toFixed(3), +wz.toFixed(3)], bone: joints[best] || best });
    }
  }
}
fs.writeFileSync(OUT, JSON.stringify(out));
const by = new Map(); for (const o of out) { const k = o.mesh + ' | ' + o.bone; const r = by.get(k) || { n: 0, hit: 0, y0: 1e9, y1: -1e9, x0: 1e9, x1: -1e9, z0: 1e9, z1: -1e9 }; r.n++; r.hit += o.hit; r.y0 = Math.min(r.y0, o.c[1]); r.y1 = Math.max(r.y1, o.c[1]); r.x0 = Math.min(r.x0, o.c[0]); r.x1 = Math.max(r.x1, o.c[0]); r.z0 = Math.min(r.z0, o.c[2]); r.z1 = Math.max(r.z1, o.c[2]); by.set(k, r); }
for (const [k, r] of [...by].sort((a, b) => b[1].hit - a[1].hit)) console.log(k, 'tris', r.n, 'texels', r.hit, 'x', r.x0.toFixed(2), r.x1.toFixed(2), 'y', r.y0.toFixed(2), r.y1.toFixed(2), 'z', r.z0.toFixed(2), r.z1.toFixed(2));
