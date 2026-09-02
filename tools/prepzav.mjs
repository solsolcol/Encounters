/* Master Zav, v5.09 — OFFLINE prep (not part of the build). Run beside the
   original Sketchfab zav.glb with @gltf-transform/{core,extensions,functions},
   meshoptimizer, draco3dgltf and sharp installed:
     BAND=6 DEEP=8 THRESH=4 MAXDIFF=30 node --max-old-space-size=6000 prepzav.mjs 0.04
   -> zav.opt3.glb, which ships as assets/zav.glb. docs/V5.09-EQUIPMENT-PASS.md.
   Same pipeline as v5.08 plus UV-island
   PADDING of the base colour atlas before anything else touches it. The
   scan's atlas is hundreds of small islands over a cream fill; every seam
   on the face and hair sampled that cream and drew a light crack line. */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { dedup, prune, weld, simplify, textureCompress } from '@gltf-transform/functions';
import { MeshoptSimplifier } from 'meshoptimizer';
import draco3d from 'draco3dgltf';
import sharp from 'sharp';
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({
  'draco3d.decoder': await draco3d.createDecoderModule(), 'draco3d.encoder': await draco3d.createEncoderModule() });
const doc = await io.read('zav.glb');
const root = doc.getRoot();

// --- 1. coverage mask from the FULL-RES mesh's UVs -------------------------
const tex = root.listMaterials()[0].getBaseColorTexture();
const { data: px, info } = await sharp(Buffer.from(tex.getImage())).raw().toBuffer({ resolveWithObject: true });
const W = info.width, H = info.height, C = info.channels;
const cov = new Uint8Array(W * H);
let tris = 0;
for (const mesh of root.listMeshes()) for (const prim of mesh.listPrimitives()) {
  const uv = prim.getAttribute('TEXCOORD_0'); const idx = prim.getIndices();
  if (!uv) continue;
  const U = uv.getArray(), I = idx ? idx.getArray() : null;
  const n = I ? I.length : uv.getCount();
  const u = i => U[(I ? I[i] : i) * 2] * W, v = i => U[(I ? I[i] : i) * 2 + 1] * H;
  for (let t = 0; t < n; t += 3) {
    tris++;
    const x0 = u(t), y0 = v(t), x1 = u(t + 1), y1 = v(t + 1), x2 = u(t + 2), y2 = v(t + 2);
    const minx = Math.max(0, Math.floor(Math.min(x0, x1, x2)) - 1), maxx = Math.min(W - 1, Math.ceil(Math.max(x0, x1, x2)) + 1);
    const miny = Math.max(0, Math.floor(Math.min(y0, y1, y2)) - 1), maxy = Math.min(H - 1, Math.ceil(Math.max(y0, y1, y2)) + 1);
    const area = (x1 - x0) * (y2 - y0) - (x2 - x0) * (y1 - y0);
    if (Math.abs(area) < 1e-9) continue;
    for (let y = miny; y <= maxy; y++) for (let x = minx; x <= maxx; x++) {
      const cx = x + 0.5, cy = y + 0.5;
      // a pixel counts as covered if its centre is inside the triangle, expanded by ~0.7 px
      const e0 = ((x1 - x0) * (cy - y0) - (cx - x0) * (y1 - y0)) / area;
      const e1 = ((x2 - x1) * (cy - y1) - (cx - x1) * (y2 - y1)) / area;
      const e2 = ((x0 - x2) * (cy - y2) - (cx - x2) * (y0 - y2)) / area;
      const slack = 0.7 / Math.sqrt(Math.abs(area));   // ~0.7 px in barycentric units
      if (e0 >= -slack && e1 >= -slack && e2 >= -slack) cov[y * W + x] = 1;
    }
  }
}
let covered = 0; for (let i = 0; i < cov.length; i++) covered += cov[i];
console.log('tris', tris, 'covered px', covered, 'of', W * H, (100 * covered / (W * H)).toFixed(1) + '%');

// --- 1b. HALO STRIP: the scan baked a LIGHTER blur into every island's rim
//         (the baker sampled the cream fill), so each seam draws a pale line.
//         A blanket erosion eats thin islands whole; instead a rim pixel
//         (within BAND texels of the border) goes only when it is lighter
//         than the island's own interior DEEP texels in — the halo, and
//         nothing else. The padding below repaints what went.
const BAND = Number(process.env.BAND || 4), DEEP = Number(process.env.DEEP || 6), THRESH = Number(process.env.THRESH || 8);
{
  // distance to the nearest uncovered pixel, capped at DEEP+1 (chessboard)
  const dist = new Uint8Array(W * H).fill(DEEP + 1);
  for (let i = 0; i < cov.length; i++) if (!cov[i]) dist[i] = 0;
  for (let d = 1; d <= DEEP; d++) for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const i = y * W + x; if (dist[i] !== DEEP + 1) continue;
    let near = false;
    for (let dy = -1; dy <= 1 && !near; dy++) for (let dx = -1; dx <= 1; dx++) {
      const xx = x + dx, yy = y + dy; if (xx < 0 || yy < 0 || xx >= W || yy >= H) continue;
      if (dist[yy * W + xx] === d - 1) { near = true; break; }
    }
    if (near) dist[i] = d;
  }
  const lum = i => 0.299 * px[i * C] + 0.587 * px[i * C + 1] + 0.114 * px[i * C + 2];
  let stripped = 0, rim = 0;
  const R = DEEP + 2;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const i = y * W + x; if (!cov[i] || dist[i] > BAND) continue;
    rim++;
    // the island's interior nearby: mean luminance of pixels at least DEEP in
    let sum = 0, k = 0;
    for (let dy = -R; dy <= R; dy++) for (let dx = -R; dx <= R; dx++) {
      const xx = x + dx, yy = y + dy; if (xx < 0 || yy < 0 || xx >= W || yy >= H) continue;
      const j = yy * W + xx; if (dist[j] < DEEP) continue;
      sum += lum(j); k++;
    }
    if (!k) continue;                       // a thin island: nothing deeper to compare with, keep it
    if (lum(i) > sum / k + THRESH) { cov[i] = 0; stripped++; }
  }
  console.log('rim px', rim, 'stripped as halo', stripped);
}

// --- 2. pad: every uncovered pixel takes the mean of its covered neighbours,
//        repeated until nothing is left uncovered (or 512 passes) -----------
const out = Buffer.from(px);
let cur = cov, passes = 0;
for (; passes < 512; passes++) {
  const next = new Uint8Array(cur); let filled = 0;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const i = y * W + x; if (cur[i]) continue;
    let r = 0, g = 0, b = 0, k = 0;
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
      const xx = x + dx, yy = y + dy; if (xx < 0 || yy < 0 || xx >= W || yy >= H) continue;
      const j = yy * W + xx; if (!cur[j]) continue;
      r += out[j * C]; g += out[j * C + 1]; b += out[j * C + 2]; k++;
    }
    if (!k) continue;
    out[i * C] = r / k; out[i * C + 1] = g / k; out[i * C + 2] = b / k; if (C === 4) out[i * C + 3] = 255;
    next[i] = 1; filled++;
  }
  cur = next; if (!filled) break;
}
console.log('padding passes', passes);

// --- 2b. SEAM FEATHER: what the halo strip leaves is the scan's own
//         exposure difference between neighbouring islands — a tone STEP
//         along every seam. The mesh knows which UV edge is which other
//         UV edge (same two 3D points), so each side is blended toward the
//         pair's average over BLEND texels. Sampled INSET texels in, so the
//         padding just laid down is not what gets averaged.
const INSET = Number(process.env.INSET || 3), BLEND = Number(process.env.BLEND || 4), MAXDIFF = Number(process.env.MAXDIFF || 30);
if (BLEND > 0) {
  const posId = new Map(); let nPos = 0;
  const pid = (P, i) => { const k = Math.round(P[i*3]*1e4) + ',' + Math.round(P[i*3+1]*1e4) + ',' + Math.round(P[i*3+2]*1e4);
    let id = posId.get(k); if (id === undefined) { id = nPos++; posId.set(k, id); } return id; };
  const edges = new Map();   // edgeKey -> [{a:[u,v], b:[u,v], c:[u,v]}] (a = lower position id end)
  for (const mesh of root.listMeshes()) for (const prim of mesh.listPrimitives()) {
    const P = prim.getAttribute('POSITION').getArray(), U = prim.getAttribute('TEXCOORD_0').getArray();
    const I = prim.getIndices().getArray();
    const ids = new Int32Array(prim.getAttribute('POSITION').getCount());
    for (let i = 0; i < ids.length; i++) ids[i] = pid(P, i);
    const uv = i => [U[i*2] * W, U[i*2+1] * H];
    for (let t = 0; t < I.length; t += 3) for (let e = 0; e < 3; e++) {
      let i0 = I[t + e], i1 = I[t + (e + 1) % 3]; const i2 = I[t + (e + 2) % 3];
      if (ids[i0] > ids[i1]) [i0, i1] = [i1, i0];
      const k = ids[i0] * nPos + ids[i1];
      let l = edges.get(k); if (!l) edges.set(k, l = []);
      l.push({ a: uv(i0), b: uv(i1), c: uv(i2) });
    }
  }
  const dR = new Float32Array(W * H), dG = new Float32Array(W * H), dB = new Float32Array(W * H), dW = new Float32Array(W * H);
  const samp = (x, y) => { const xi = Math.max(0, Math.min(W - 1, Math.round(x))), yi = Math.max(0, Math.min(H - 1, Math.round(y)));
    const j = (yi * W + xi) * C; return [out[j], out[j + 1], out[j + 2]]; };
  let seams = 0;
  for (const l of edges.values()) {
    if (l.length !== 2) continue;
    const [A, B] = l;
    if (Math.hypot(A.a[0] - B.a[0], A.a[1] - B.a[1]) < 0.01 && Math.hypot(A.b[0] - B.b[0], A.b[1] - B.b[1]) < 0.01) continue;   // same UVs: not a seam
    seams++;
    const len = Math.max(Math.hypot(A.b[0] - A.a[0], A.b[1] - A.a[1]), Math.hypot(B.b[0] - B.a[0], B.b[1] - B.a[1]));
    const steps = Math.max(1, Math.ceil(len * 2));
    const inward = S => {   // unit normal of edge a->b pointing toward c
      const ex = S.b[0] - S.a[0], ey = S.b[1] - S.a[1]; const L = Math.hypot(ex, ey) || 1;
      let nx = -ey / L, ny = ex / L;
      if ((S.c[0] - S.a[0]) * nx + (S.c[1] - S.a[1]) * ny < 0) { nx = -nx; ny = -ny; }
      return [nx, ny];
    };
    const nA = inward(A), nB = inward(B);
    for (let si = 0; si <= steps; si++) {
      const t = si / steps;
      const ax = A.a[0] + (A.b[0] - A.a[0]) * t, ay = A.a[1] + (A.b[1] - A.a[1]) * t;
      const bx = B.a[0] + (B.b[0] - B.a[0]) * t, by = B.a[1] + (B.b[1] - B.a[1]) * t;
      const cA = samp(ax + nA[0] * INSET, ay + nA[1] * INSET), cB = samp(bx + nB[0] * INSET, by + nB[1] * INSET);
      const half = [(cB[0] - cA[0]) / 2, (cB[1] - cA[1]) / 2, (cB[2] - cA[2]) / 2];
      // a seam that is also a CONTENT edge (hair against skin, lip against
      // cheek) must stay a hard edge: only an exposure-sized step is feathered
      if (Math.max(Math.abs(half[0]), Math.abs(half[1]), Math.abs(half[2])) * 2 > MAXDIFF) continue;
      for (let d = 0; d <= BLEND; d += 0.5) {
        const w = 1 - d / (BLEND + 0.5);
        for (const [sx, sy, n, sign] of [[ax, ay, nA, 1], [bx, by, nB, -1]]) {
          const xi = Math.round(sx + n[0] * d), yi = Math.round(sy + n[1] * d);
          if (xi < 0 || yi < 0 || xi >= W || yi >= H) continue;
          const j = yi * W + xi;
          dR[j] += sign * half[0] * w; dG[j] += sign * half[1] * w; dB[j] += sign * half[2] * w; dW[j] += w;
        }
      }
    }
  }
  let touched = 0;
  for (let j = 0; j < W * H; j++) {
    if (!dW[j]) continue; touched++;
    const k = j * C, f = 1 / dW[j];
    out[k] = Math.max(0, Math.min(255, out[k] + dR[j] * f));
    out[k + 1] = Math.max(0, Math.min(255, out[k + 1] + dG[j] * f));
    out[k + 2] = Math.max(0, Math.min(255, out[k + 2] + dB[j] * f));
  }
  console.log('positions', nPos, 'edges', edges.size, 'seam edges', seams, 'texels feathered', touched);
}
const png = await sharp(out, { raw: { width: W, height: H, channels: C } }).removeAlpha().png().toBuffer();
tex.setImage(new Uint8Array(png)).setMimeType('image/png');
if (process.argv[3]) await sharp(png).toFile(process.argv[3]);

// --- 3. the v5.08 pipeline, unchanged ---------------------------------------
for (const m of root.listMaterials()) {
  m.setNormalTexture(null); m.setOcclusionTexture(null); m.setMetallicRoughnessTexture(null); m.setEmissiveTexture(null);
  m.setMetallicFactor(0); m.setRoughnessFactor(0.8); m.setAlphaMode('OPAQUE');
}
for (const e of root.listExtensionsUsed()) if (/draco|webp/i.test(e.extensionName)) e.dispose();
await doc.transform(dedup(), weld(),
  simplify({ simplifier: MeshoptSimplifier, ratio: Number(process.argv[2] || 0.04), error: 0.01 }),
  textureCompress({ encoder: sharp, targetFormat: 'jpeg', quality: 86, resize: [1024, 1024] }),
  prune());
await io.write('zav.opt3.glb', doc);
console.log('zav tris:', root.listMeshes().map(m => m.listPrimitives().map(p => p.getIndices().getCount() / 3).join(',')).join(' '),
  'tex:', root.listTextures().map(t => t.getMimeType() + ' ' + (t.getImage().byteLength / 1024 | 0) + 'KB').join(', '),
  'ext:', root.listExtensionsUsed().map(e => e.extensionName).join(','));
