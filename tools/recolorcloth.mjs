/* v24.0 (episode 4 chapter 1) — A GARMENT RECOLOURED ON A SCAN, PRECISELY: the first master's white cloth made black.
   Chad, 27 Oct 2026: "Can you try to make that ajahn model clothes black instead of white? Be precise in the
   coloring."

   WHY COLOUR ALONE CANNOT DO IT. The scan's one 2048 sheet (a Meshy projection atlas) carries the cloth as white with
   grey-brown woven stripes, laid beside tattooed skin whose PROJECTION STREAKS are the same greyish brown as the
   stripes (histogram: stripes, tattoo ink and skin shadow all sit at saturation 0.1–0.3, value 0.3–0.6, hue ≈ 22°).
   A texel rule that blackens "white and greyish" paints black streaks across his arms; one that blackens only white
   leaves the stripes and every fold shadow standing pale on a black robe. And the eyes, the teeth and the nails are
   white too.

   SO THE MESH DECIDES, THEN THE TEXEL:
   1. Every triangle is rasterized into the sheet, so each texel knows the triangle it belongs to.
   2. Triangles whose bones are the head or the hands (summed skin weight) are never touched: eyes, teeth, nails.
   3. A triangle is CLOTH when at least WHITE_MIN of its texels are cloth-white and fewer than SKIN_MAX are
      skin-coloured (tan skin, the red-brown beads and the gold amulets all count as "skin-coloured", so all three
      are protected by the same rule).
   4. Cloth then FLOODS across shared edges (by position, so across UV seams) into triangles with no skin colour in
      them — the stripes and the deep folds, which have no white — but never into a triangle that is mostly tattoo
      ink.
   5. In a cloth triangle every texel is recoloured EXCEPT a skin-coloured one (a triangle straddling the cloth's edge
      keeps its skin side).
   6. The new colour keeps the fold: out = BLACK × (FLOOR + (1 − FLOOR) × luminance / white), so a fold that was 80 %
      as bright as the white stays 80 % as bright as the black, and the woven stripes become darker bands in the
      black, as they were darker bands in the white.
   7. The texels no triangle covers (the atlas's padding, which bilinear filtering reaches at every chart's edge) are
      refilled from the nearest covered texel, so a black chart is padded black and a skin chart skin — no white
      halo can bleed into a seam.

   Writes the GLB with the new sheet (PNG, lossless) and, with a report directory, a CHANGE MAP (every recoloured
   texel magenta over the dimmed sheet) and the counts, which is how "precise" is checked before anything is
   rendered.
     node tools/recolorcloth.mjs in.glb out.glb [reportDir]
     env: BLACK=262629 (the black at the cloth's brightest, sRGB hex), FLOOR=0.22, WHITE_MIN=0.30, SKIN_MAX=0.35 */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder, MeshoptEncoder } from 'meshoptimizer';
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const [,, IN, OUT, REPORT] = process.argv;
if (!IN || !OUT) { console.log('usage: node tools/recolorcloth.mjs in.glb out.glb [reportDir]'); process.exit(2); }
const hex = s => [0, 2, 4].map(i => parseInt(s.slice(i, i + 2), 16));
const BLACK = hex(process.env.BLACK || '262629');
const FLOOR = Number(process.env.FLOOR ?? 0.22);
const WHITE_MIN = Number(process.env.WHITE_MIN ?? 0.30), SKIN_MAX = Number(process.env.SKIN_MAX ?? 0.35);
const EXCLUDE = /Head|headfront|Hand|Toe/;        // mixamorig:Head, HeadTop_End, headfront; LeftHand, RightHand, *HandMiddle4; the toes (their nails are white)
const PAD = Number(process.env.PAD ?? 64);        // padding refilled this far from a covered texel (the scan's white halo is wider than 12)

await Promise.all([MeshoptDecoder.ready, MeshoptEncoder.ready]);
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({
  'meshopt.decoder': MeshoptDecoder, 'meshopt.encoder': MeshoptEncoder });
const doc = await io.read(IN);
const root = doc.getRoot();
const prims = root.listMeshes().flatMap(m => m.listPrimitives());
if (prims.length !== 1) throw new Error(`expected one primitive, found ${prims.length}`);
const prim = prims[0];
const mat = prim.getMaterial(), tex = mat.getBaseColorTexture();
if (!tex) throw new Error('no base colour texture');
const { data: src, info } = await sharp(Buffer.from(tex.getImage())).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const W = info.width, H = info.height, NPX = W * H;

const uvA = prim.getAttribute('TEXCOORD_0'), posA = prim.getAttribute('POSITION');
const jA = prim.getAttribute('JOINTS_0'), wA = prim.getAttribute('WEIGHTS_0');
const I = prim.getIndices().getArray(), NT = I.length / 3, NV = posA.getCount();
const joints = root.listSkins()[0].listJoints().map(j => j.getName());
const excl = joints.map(n => EXCLUDE.test(n));
const uv = new Float32Array(NV * 2), tmp = [0, 0, 0, 0];
for (let i = 0; i < NV; i++) { uvA.getElement(i, tmp); uv[2 * i] = tmp[0]; uv[2 * i + 1] = tmp[1]; }

/* 2 · the bones: each triangle's strongest joint by summed weight */
const excluded = new Uint8Array(NT), strongest = new Uint16Array(NT), jw = new Float32Array(joints.length);
for (let t = 0; t < NT; t++) {
  jw.fill(0);
  for (let k = 0; k < 3; k++) { const v = I[3 * t + k], jj = [0, 0, 0, 0], ww = [0, 0, 0, 0];
    jA.getElement(v, jj); wA.getElement(v, ww); for (let q = 0; q < 4; q++) jw[jj[q]] += ww[q]; }
  let best = 0; for (let j = 1; j < jw.length; j++) if (jw[j] > jw[best]) best = j;
  excluded[t] = excl[best] ? 1 : 0; strongest[t] = best;
}

/* 1 · rasterize every triangle into the sheet at texel centres. A SLIVER (the scan's hair-thin triangles that run
   hundreds of texels across the sheet, v19.8) is drawn LAST and only into texels nobody else owns: drawn in turn it
   overwrote the cloth it crossed and, classed by its own few texels, left a white thread across the black */
const owner = new Int32Array(NPX).fill(-1);
const isSliver = t => { const a = I[3 * t], b = I[3 * t + 1], c = I[3 * t + 2];
  const ax = uv[2 * a] * W, ay = uv[2 * a + 1] * H, bx = uv[2 * b] * W, by = uv[2 * b + 1] * H, cx = uv[2 * c] * W, cy = uv[2 * c + 1] * H;
  const area2 = Math.abs((bx - ax) * (cy - ay) - (cx - ax) * (by - ay));
  const L = Math.max(Math.hypot(bx - ax, by - ay), Math.hypot(cx - bx, cy - by), Math.hypot(ax - cx, ay - cy));
  return L > 6 && area2 / L < 1.2; };          // longer than 6 texels and under 1.2 texels across at its widest
const sliver = new Uint8Array(NT); let nSliver = 0;
for (let t = 0; t < NT; t++) if (isSliver(t)) { sliver[t] = 1; nSliver++; }
for (const pass of [0, 1]) for (let t = 0; t < NT; t++) {
  if (sliver[t] !== pass) continue;
  const a = I[3 * t], b = I[3 * t + 1], c = I[3 * t + 2];
  const ax = uv[2 * a] * W, ay = uv[2 * a + 1] * H, bx = uv[2 * b] * W, by = uv[2 * b + 1] * H, cx = uv[2 * c] * W, cy = uv[2 * c + 1] * H;
  const x0 = Math.max(0, Math.floor(Math.min(ax, bx, cx))), x1 = Math.min(W - 1, Math.ceil(Math.max(ax, bx, cx)));
  const y0 = Math.max(0, Math.floor(Math.min(ay, by, cy))), y1 = Math.min(H - 1, Math.ceil(Math.max(ay, by, cy)));
  const d = (bx - ax) * (cy - ay) - (cx - ax) * (by - ay);
  if (Math.abs(d) < 1e-12) continue;
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
    const px = x + 0.5, py = y + 0.5;
    const w1 = ((bx - px) * (cy - py) - (cx - px) * (by - py)) / d;
    const w2 = ((cx - px) * (ay - py) - (ax - px) * (cy - py)) / d;
    const w3 = 1 - w1 - w2;
    if (w1 >= -1e-6 && w2 >= -1e-6 && w3 >= -1e-6 && (!pass || owner[y * W + x] < 0)) owner[y * W + x] = t;
  }
}

/* texel colour classes */
const WHITE = 1, SKIN = 2, INK = 3, MID = 4;
const cls = new Uint8Array(NPX), lum = new Float32Array(NPX);
const classOf = (r, g, b) => {
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), dd = mx - mn, v = mx / 255, s = mx ? dd / mx : 0;
  let h = 0; if (dd) { if (mx === r) h = ((g - b) / dd) % 6; else if (mx === g) h = (b - r) / dd + 2; else h = (r - g) / dd + 4; h *= 60; if (h < 0) h += 360; }
  if (s < 0.16 && v > 0.70) return WHITE;
  if (s >= 0.30 && v > 0.22 && (h < 60 || h > 330)) return SKIN;      // tan skin, red-brown beads, gold
  if (v < 0.45 && s < 0.30) return INK;                                 // tattoo ink, deep shadow, dark stripe
  return MID;                                                           // light greys, beige bands, blends
};
for (let i = 0; i < NPX; i++) {
  const r = src[3 * i], g = src[3 * i + 1], b = src[3 * i + 2];
  cls[i] = classOf(r, g, b);
  lum[i] = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
}

/* per-triangle counts (a triangle that owns no texel centre is sampled at its corners and centroid) */
const nW = new Float32Array(NT), nS = new Float32Array(NT), nK = new Float32Array(NT), nT = new Float32Array(NT);
for (let i = 0; i < NPX; i++) { const t = owner[i]; if (t < 0) continue; nT[t]++;
  const c = cls[i]; if (c === WHITE) nW[t]++; else if (c === SKIN) nS[t]++; else if (c === INK) nK[t]++; }
const at = (u, v) => { const x = Math.min(W - 1, Math.max(0, Math.floor(u * W))), y = Math.min(H - 1, Math.max(0, Math.floor(v * H))); return y * W + x; };
for (let t = 0; t < NT; t++) {
  if (nT[t] > 0) continue;
  const a = I[3 * t], b = I[3 * t + 1], c = I[3 * t + 2];
  const pts = [[uv[2 * a], uv[2 * a + 1]], [uv[2 * b], uv[2 * b + 1]], [uv[2 * c], uv[2 * c + 1]],
    [(uv[2 * a] + uv[2 * b] + uv[2 * c]) / 3, (uv[2 * a + 1] + uv[2 * b + 1] + uv[2 * c + 1]) / 3]];
  for (const [u, v] of pts) { const k = cls[at(u, v)]; nT[t]++; if (k === WHITE) nW[t]++; else if (k === SKIN) nS[t]++; else if (k === INK) nK[t]++; }
}

/* 3 · cloth by its texels */
const cloth = new Uint8Array(NT);
let seeded = 0;
for (let t = 0; t < NT; t++) if (!excluded[t] && nW[t] / nT[t] >= WHITE_MIN && nS[t] / nT[t] < SKIN_MAX) { cloth[t] = 1; seeded++; }

/* 4 · flood across shared edges (by POSITION, so a UV seam does not stop it) */
const pk = new Map(), gid = new Int32Array(NV), pv = [0, 0, 0];
for (let i = 0; i < NV; i++) { posA.getElement(i, pv); const k = `${Math.round(pv[0] * 1e5)},${Math.round(pv[1] * 1e5)},${Math.round(pv[2] * 1e5)}`;
  let g = pk.get(k); if (g === undefined) { g = pk.size; pk.set(k, g); } gid[i] = g; }
const edgeTris = new Map();
for (let t = 0; t < NT; t++) for (let k = 0; k < 3; k++) {
  const a = gid[I[3 * t + k]], b = gid[I[3 * t + (k + 1) % 3]]; if (a === b) continue;
  const key = a < b ? a * 4194304 + b : b * 4194304 + a;
  let l = edgeTris.get(key); if (!l) edgeTris.set(key, l = []); l.push(t); }
const nbr = Array.from({ length: NT }, () => []);
for (const l of edgeTris.values()) for (const p of l) for (const q of l) if (p !== q) nbr[p].push(q);
let flooded = 0;
for (let pass = 0; pass < 12; pass++) {
  const add = [];
  for (let t = 0; t < NT; t++) {
    if (cloth[t] || excluded[t]) continue;
    if (nS[t] / nT[t] >= 0.08 || nK[t] / nT[t] >= 0.60) continue;     // skin colour in it, or mostly ink: not cloth
    if (nbr[t].some(q => cloth[q])) add.push(t);
  }
  if (!add.length) break;
  for (const t of add) cloth[t] = 1;
  flooded += add.length;
}

/* 4b · a TINY triangle follows its neighbours: two to four texels make its counts noise (the fringe and the bead
   strip along the sheet's top), so where two thirds of the triangles round it are cloth and it shows any white or
   light grey it is cloth; and a "cloth" triangle with weak evidence ringed by skin is a highlight on skin, not
   cloth. Three passes. */
let smoothed = 0, unclothed = 0;
const nM = new Float32Array(NT);
for (let i = 0; i < NPX; i++) { const t = owner[i]; if (t >= 0 && cls[i] === MID) nM[t]++; }
for (let pass = 0; pass < 3; pass++) {
  const on = [], off = [];
  for (let t = 0; t < NT; t++) {
    if (excluded[t] || !nbr[t].length) continue;
    let c = 0; for (const q of nbr[t]) c += cloth[q]; const f = c / nbr[t].length;
    if (!cloth[t] && f >= 0.67 && (nW[t] + nM[t]) / nT[t] >= 0.25) on.push(t);
    else if (cloth[t] && f <= 0.2 && nW[t] / nT[t] < 0.6 && nS[t] > 0) off.push(t);
  }
  for (const t of on) cloth[t] = 1; for (const t of off) cloth[t] = 0;
  smoothed += on.length; unclothed += off.length;
  if (!on.length && !off.length) break;
}

/* 4c · PAINTED SKIN ON THE CLOTH (found by photographing the back of the legs close). The scan projected the skin of
   his legs onto the back of the cloth: brown streaks and blotches on CLOTH GEOMETRY, dirt on the white and, kept, holes
   that seem to show skin through the black. The mesh tells them from real skin: real skin is CONNECTED to the body —
   the legs run down to the feet, the torso up to the neck and head, the arms to the hands — while a projection is an
   ISLAND of non-cloth triangles with nothing but cloth round it. Islands of tan (skin hue) are made cloth, every
   texel; islands of deep red (the beads) or gold (the amulets) keep their colour. */
const isTan = i => { const r = src[3 * i], g = src[3 * i + 1], b = src[3 * i + 2], mx = Math.max(r, g, b), mn = Math.min(r, g, b), dd = mx - mn;
  if (!dd) return false; let h = mx === r ? ((g - b) / dd) % 6 : mx === g ? (b - r) / dd + 2 : (r - g) / dd + 4; h *= 60; if (h < 0) h += 360;
  const s = dd / mx, v = mx / 255; return h >= 12 && h <= 40 && s >= 0.18 && s <= 0.62 && v >= 0.30; };
const triTan = new Float32Array(NT);
for (let i = 0; i < NPX; i++) { const t = owner[i]; if (t >= 0 && isTan(i)) triTan[t]++; }
const forceAll = new Uint8Array(NT), compOf = new Int32Array(NT).fill(-1), islands = [];
const MAXISLAND = Number(process.env.MAXISLAND ?? 0.04) * NT;
/* only round the LEGS: the scan projected the legs onto the lower cloth; on the chest an island lying on the cloth
   is an AMULET (photographed: the gold-brown pendant on the shoulder cloth would have gone black) */
const LEGS = /Hips|UpLeg|Leg$/;
for (let s0 = 0; s0 < NT; s0++) {
  if (cloth[s0] || excluded[s0] || compOf[s0] >= 0) continue;
  const id = islands.length, list = [s0]; compOf[s0] = id; let touchesBody = false, tex = 0, tan = 0;
  for (let k = 0; k < list.length; k++) { const t = list[k]; tex += nT[t]; tan += triTan[t];
    for (const q of nbr[t]) { if (excluded[q]) touchesBody = true; else if (!cloth[q] && compOf[q] < 0) { compOf[q] = id; list.push(q); } } }
  const legW = list.reduce((a, t) => a + (LEGS.test(joints[strongest[t]]) ? 1 : 0), 0) / list.length;
  islands.push({ id, tris: list.length, touchesBody, tanFrac: tex ? tan / tex : 0, legW, list });
}
let islandTris = 0, islandsMade = 0;
for (const isl of islands) {
  if (isl.touchesBody || isl.tris > MAXISLAND || isl.tanFrac < 0.45 || isl.legW < 0.6) continue;
  for (const t of isl.list) { cloth[t] = 1; forceAll[t] = 1; } islandTris += isl.tris; islandsMade++;
}
const bigIslands = islands.slice().sort((a, b) => b.tris - a.tris).slice(0, 8).map(i => `${i.tris}${i.touchesBody ? 'B' : ''}/${i.tanFrac.toFixed(2)}`);
console.log(`  islands of non-cloth: ${islands.length}; made cloth: ${islandsMade} (${islandTris} triangles); largest (tris/tan, B = joins the body): ${bigIslands.join(' ')}`);

/* 5a · skin colour inside the cloth survives only as a real PATCH of skin (his leg through the slit in the cloth):
   8-connected skin-coloured texels of at least MINSKIN; a smaller component is a fleck painted on the white */
const MINSKIN = Number(process.env.MINSKIN ?? 30);
const comp = new Int32Array(NPX).fill(-1), compSize = [];
{ const stack = new Int32Array(NPX);
  for (let s = 0; s < NPX; s++) {
    if (cls[s] !== SKIN || comp[s] >= 0) continue;
    const id = compSize.length; let n = 0, sp = 0; stack[sp++] = s; comp[s] = id;
    while (sp) { const i = stack[--sp]; n++; const x = i % W, y = (i - x) / W;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        const nx = x + dx, ny = y + dy; if ((!dx && !dy) || nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
        const j = ny * W + nx; if (cls[j] === SKIN && comp[j] < 0) { comp[j] = id; stack[sp++] = j; } } }
    compSize.push(n);
  } }

/* 5–6 · recolour, keeping each fold's brightness relative to the cloth's white */
const clothLum = [];
for (let i = 0; i < NPX; i += 7) { const t = owner[i]; if (t >= 0 && cloth[t] && cls[i] === WHITE) clothLum.push(lum[i]); }
clothLum.sort((a, b) => a - b);
const whiteRef = clothLum.length ? clothLum[Math.floor(clothLum.length * 0.95)] : 0.95;
const out = Buffer.from(src);
const changed = new Uint8Array(NPX);
let nChanged = 0, keptSkin = 0;
/* a skin-coloured texel is kept only where the triangle really straddles the cloth's edge (≥ STRADDLE of its
   texels skin); in a triangle that is all but entirely cloth it is a fleck of dirt painted on the white, and on
   black it would show as an orange speck (the first run left 399 of them) */
const STRADDLE = Number(process.env.STRADDLE ?? 0.12);
for (let i = 0; i < NPX; i++) {
  const t = owner[i]; if (t < 0 || !cloth[t]) continue;
  if (!forceAll[t] && cls[i] === SKIN && nS[t] / nT[t] >= STRADDLE && compSize[comp[i]] >= MINSKIN) { keptSkin++; continue; }
  const f = Math.min(1, lum[i] / whiteRef), m = FLOOR + (1 - FLOOR) * f;
  out[3 * i] = Math.round(BLACK[0] * m); out[3 * i + 1] = Math.round(BLACK[1] * m); out[3 * i + 2] = Math.round(BLACK[2] * m);
  if (process.env.DEBUGISLAND && forceAll[t]) { out[3 * i] = 230; out[3 * i + 1] = 20; out[3 * i + 2] = 20; }   // where the islands are, for a render
  changed[i] = 1; nChanged++;
}

/* 6b · the cloth's own WHITE painted over the edge of a piece that is not cloth (the red tassel's bottom rim, a bead's
   edge): a white texel in a non-cloth triangle that borders cloth is the cloth, and goes black with it */
let rimmed = 0;
for (let i = 0; i < NPX; i++) {
  const t = owner[i]; if (t < 0 || cloth[t] || excluded[t] || cls[i] !== WHITE) continue;
  if (!nbr[t].some(q => cloth[q])) continue;
  const f = Math.min(1, lum[i] / whiteRef), m = FLOOR + (1 - FLOOR) * f;
  out[3 * i] = Math.round(BLACK[0] * m); out[3 * i + 1] = Math.round(BLACK[1] * m); out[3 * i + 2] = Math.round(BLACK[2] * m);
  changed[i] = 1; rimmed++;
}

/* 6c · SPECKS: a texel of a TINY triangle (8 texels or fewer — the scan's flecks of painted dirt) that is not black
   but has at least six of its eight neighbours recoloured is a speck on the robe, and is recoloured too (twice, so a
   pair of specks goes). A real detail is never this small, and nothing on the head, the hands or the toes is touched. */
let despecked = 0;
for (let pass = 0; pass < 2; pass++) {
  const fix = [];
  for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) {
    const i = y * W + x, t = owner[i]; if (t < 0 || changed[i] || excluded[t] || nT[t] > 8) continue;
    let n = 0; for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) if ((dx || dy) && changed[i + dy * W + dx]) n++;
    if (n >= 6) fix.push(i);
  }
  for (const i of fix) { const f = Math.min(1, lum[i] / whiteRef), m = FLOOR + (1 - FLOOR) * f;
    out[3 * i] = Math.round(BLACK[0] * m); out[3 * i + 1] = Math.round(BLACK[1] * m); out[3 * i + 2] = Math.round(BLACK[2] * m); changed[i] = 1; }
  despecked += fix.length;
}

/* 7 · the padding refilled from the nearest covered texel (breadth-first, PAD texels out) */
const dist = new Int16Array(NPX).fill(-1), queue = new Int32Array(NPX);
let qh = 0, qt = 0;
for (let i = 0; i < NPX; i++) if (owner[i] >= 0) { dist[i] = 0; queue[qt++] = i; }
let padded = 0;
while (qh < qt) {
  const i = queue[qh++], d = dist[i]; if (d >= PAD) continue;
  const x = i % W, y = (i - x) / W;
  for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
    const nx = x + dx, ny = y + dy; if (nx < 0 || ny < 0 || nx >= W || ny >= H) continue;
    const j = ny * W + nx; if (dist[j] >= 0) continue;
    dist[j] = d + 1; out[3 * j] = out[3 * i]; out[3 * j + 1] = out[3 * i + 1]; out[3 * j + 2] = out[3 * i + 2];
    queue[qt++] = j; padded++;
  }
}

if (process.env.PROBE) for (const xy of process.env.PROBE.split(';')) {      // PROBE="x,y;x,y": what decided a texel
  const [x, y] = xy.split(',').map(Number), i = y * W + x, t = owner[i];
  console.log(`  probe ${x},${y}: src ${src[3 * i]},${src[3 * i + 1]},${src[3 * i + 2]} class ${cls[i]} owner ${t}` +
    (t >= 0 ? ` excl ${excluded[t]} cloth ${cloth[t]} n ${nT[t]} white ${nW[t]} skin ${nS[t]} ink ${nK[t]}` : ` dist ${dist[i]}`) +
    ` -> out ${out[3 * i]},${out[3 * i + 1]},${out[3 * i + 2]}`);
}
/* the counts that say whether it was precise */
let clothTris = 0, exclTris = 0; for (let t = 0; t < NT; t++) { clothTris += cloth[t]; exclTris += excluded[t]; }
let paleLeft = 0;      // cloth-white texels left standing inside triangles that border cloth (a halo would show here)
for (let i = 0; i < NPX; i++) { const t = owner[i]; if (t < 0 || cloth[t] || excluded[t]) continue;
  if (cls[i] === WHITE && nbr[t].some(q => cloth[q])) paleLeft++; }
const report = { triangles: NT, slivers: nSliver, cloth: clothTris, seeded, flooded, smoothed, unclothed, excludedHeadHands: exclTris,
  texels: { changed: nChanged, skinKeptInsideCloth: keptSkin, rimmed, despecked, paddingRefilled: padded, paleLeftBesideCloth: paleLeft },
  whiteRef: +whiteRef.toFixed(3), black: BLACK, floor: FLOOR };
console.log('recolorcloth', JSON.stringify(report));

const png = await sharp(out, { raw: { width: W, height: H, channels: 3 } }).png({ compressionLevel: 9 }).toBuffer();
tex.setImage(png).setMimeType('image/png');
await io.write(OUT, doc);
console.log(`wrote ${OUT} (${(fs.statSync(OUT).size / 1048576).toFixed(1)} MB)`);

if (REPORT) {
  fs.mkdirSync(REPORT, { recursive: true });
  /* SPECKS, counted on the OUTPUT: a texel that is not the cloth's black but has at least six of its eight
     neighbours recoloured is a fleck left on the robe (a hole between triangles the padding refill did not reach,
     or a kept texel) — the thing "precise" means there should be none of */
  const dark = i => out[3 * i] <= BLACK[0] + 2 && out[3 * i + 1] <= BLACK[1] + 2 && out[3 * i + 2] <= BLACK[2] + 2;
  const speck = new Uint8Array(NPX); let nSpeck = 0;
  for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) {
    const i = y * W + x; if (changed[i] || dark(i)) continue;
    let n = 0; for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) if ((dx || dy) && changed[i + dy * W + dx]) n++;
    if (n >= 6) { speck[i] = 1; nSpeck++; if (y > 1280 && (report.speckEg = report.speckEg || []).length < 10) report.speckEg.push(`${x},${y}`); }
  }
  report.texels.specksLeft = nSpeck;
  /* and WHITE left beside the black (a rim): why each such texel was not recoloured */
  const why = { uncovered: 0, headOrHands: 0, notCloth: 0 };
  for (let y = 3; y < H - 3; y++) for (let x = 3; x < W - 3; x++) {
    const i = y * W + x; if (changed[i] || classOf(out[3 * i], out[3 * i + 1], out[3 * i + 2]) !== WHITE) continue;
    let near = false; for (let dy = -3; dy <= 3 && !near; dy++) for (let dx = -3; dx <= 3; dx++) if (changed[i + dy * W + dx]) { near = true; break; }
    if (!near) continue;
    const t = owner[i]; if (t < 0) why.uncovered++; else if (excluded[t]) why.headOrHands++; else { why.notCloth++;
      if ((why.eg = why.eg || []).length < 8) why.eg.push(`${x},${y}`); }
  }
  report.texels.whiteRimLeft = why;
  console.log('  white left within 3 texels of the black:', JSON.stringify(why));
  console.log(`  specks left on the black (texels not black with ≥ 6 recoloured neighbours): ${nSpeck}`);
  fs.writeFileSync(path.join(REPORT, 'recolor-report.json'), JSON.stringify(report, null, 1));
  const cm = Buffer.alloc(NPX * 3);
  for (let i = 0; i < NPX; i++) {
    if (speck[i]) { cm[3 * i] = 255; cm[3 * i + 1] = 255; cm[3 * i + 2] = 0; continue; }          // yellow: a speck
    if (changed[i]) { cm[3 * i] = 255; cm[3 * i + 1] = 0; cm[3 * i + 2] = 255; continue; }        // magenta: recoloured
    if (owner[i] < 0 && dark(i)) { cm[3 * i] = 0; cm[3 * i + 1] = 150; cm[3 * i + 2] = 160; continue; }  // teal: padding refilled black
    const t = owner[i];
    const k = t >= 0 && excluded[t] ? 0.55 : 0.35;      // head and hands a little brighter, so they can be found
    cm[3 * i] = src[3 * i] * k; cm[3 * i + 1] = src[3 * i + 1] * k; cm[3 * i + 2] = src[3 * i + 2] * k;
  }
  await sharp(cm, { raw: { width: W, height: H, channels: 3 } }).png().toFile(path.join(REPORT, 'changemap.png'));
  await sharp(png).toFile(path.join(REPORT, 'recoloured-sheet.png'));
}
