// v24.54 · A BRIDGE BETWEEN A SKINNED GLB AND BLENDER, so Blender can work on a region of a model and hand back only what it
// changed: every other point, triangle, weight, texture and take of the file stays as it was, byte for byte.
//   node tools/meshpatch.mjs dump  <in.glb> <dir> <Joint> <radius>   the skinned primitive's points and triangles near that
//                                                                    joint (its rest place), welded as armfree welds them
//   node tools/meshpatch.mjs apply <in.glb> <dir> <out.glb>           <dir>/patch.json (written by Blender): triangles taken
//                                                                    out, points added (place, normal, uv, tangent, weights),
//                                                                    triangles added
// The dump (in <dir>): region.json — the joint, the radius, the welded points (place, the glTF points welded into each, arm
// share, robe flag, normal) and the region's triangles (glTF triangle index, welded corners, glTF corners, uv per corner).
// Arm share and robe flag are measured as tools/armfree.mjs measures them (RightArm + RightForeArm + RightHand; the colour
// sheet's texel pale and grey: saturation < 0.16 and value > 150).
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import sharp from 'sharp';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
const [MODE, IN, DIR, A3, A4] = process.argv.slice(2);
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
const doc = await io.read(IN);
const root = doc.getRoot(), skin = root.listSkins()[0], joints = skin.listJoints();
const JN = joints.map(j => j.getName().replace('mixamorig:', '')), JI = Object.fromEntries(JN.map((n, i) => [n, i]));
const ibm = skin.getInverseBindMatrices().getArray();
const invPos = k => { const a = Array.from(ibm.slice(k * 16, k * 16 + 16));
  const c00 = a[5] * a[10] - a[9] * a[6], c01 = -(a[4] * a[10] - a[8] * a[6]), c02 = a[4] * a[9] - a[8] * a[5];
  const c10 = -(a[1] * a[10] - a[9] * a[2]), c11 = a[0] * a[10] - a[8] * a[2], c12 = -(a[0] * a[9] - a[8] * a[1]);
  const c20 = a[1] * a[6] - a[5] * a[2], c21 = -(a[0] * a[6] - a[4] * a[2]), c22 = a[0] * a[5] - a[4] * a[1];
  const det = a[0] * c00 + a[4] * c10 + a[8] * c20, id = 1 / det;
  const r = [c00 * id, c01 * id, c02 * id, c10 * id, c11 * id, c12 * id, c20 * id, c21 * id, c22 * id];
  return [-(r[0] * a[12] + r[1] * a[13] + r[2] * a[14]), -(r[3] * a[12] + r[4] * a[13] + r[5] * a[14]), -(r[6] * a[12] + r[7] * a[13] + r[8] * a[14])]; };
const prims = root.listMeshes().flatMap(m => m.listPrimitives()).filter(p => p.getAttribute('JOINTS_0'));
if (prims.length !== 1) throw new Error(`meshpatch: expected one skinned primitive, found ${prims.length}`);
const prim = prims[0];
const P = prim.getAttribute('POSITION'), N = prim.getAttribute('NORMAL'), UV = prim.getAttribute('TEXCOORD_0'),
  TG = prim.getAttribute('TANGENT'), J = prim.getAttribute('JOINTS_0'), W = prim.getAttribute('WEIGHTS_0');
const n = P.getCount(), v = [0, 0, 0], jj = [0, 0, 0, 0], ww = [0, 0, 0, 0], uv = [0, 0], tg = [0, 0, 0, 0];
const ARMJ = new Set(['RightArm', 'RightForeArm', 'RightHand'].map(x => JI[x]));

if (MODE === 'dump') {
  const JOINT = A3, R = Number(A4), C = invPos(JI[JOINT]);
  mkdirSync(DIR, { recursive: true });
  const { data, info } = await sharp(Buffer.from(prim.getMaterial().getBaseColorTexture().getImage()), { limitInputPixels: false }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const gid = new Int32Array(n), gmap = new Map(), gpts = []; let G = 0;
  for (let i = 0; i < n; i++) { P.getElement(i, v); const k = `${Math.round(v[0] * 1e5)},${Math.round(v[1] * 1e5)},${Math.round(v[2] * 1e5)}`;
    let g = gmap.get(k); if (g === undefined) { g = G++; gmap.set(k, g); gpts.push([v[0], v[1], v[2]]); } gid[i] = g; }
  const near = new Uint8Array(G); for (let g = 0; g < G; g++) near[g] = Math.hypot(gpts[g][0] - C[0], gpts[g][1] - C[1], gpts[g][2] - C[2]) <= R ? 1 : 0;
  const I = prim.getIndices().getArray(), tris = [], used = new Map();
  for (let t = 0; t < I.length; t += 3) { const g3 = [0, 1, 2].map(k => gid[I[t + k]]); if (!g3.some(g => near[g])) continue;
    const uvs = [0, 1, 2].map(k => (UV.getElement(I[t + k], uv), [uv[0], uv[1]]));
    tris.push({ t: t / 3, g: g3, i: [I[t], I[t + 1], I[t + 2]], uv: uvs }); for (const k of [0, 1, 2]) { const g = g3[k]; if (!used.has(g)) used.set(g, []); if (!used.get(g).includes(I[t + k])) used.get(g).push(I[t + k]); } }
  const pts = {};
  for (const [g, list] of used) { const i = list[0]; let arm = 0; J.getElement(i, jj); W.getElement(i, ww); for (let k = 0; k < 4; k++) if (ARMJ.has(jj[k])) arm += ww[k];
    UV.getElement(i, uv); const x = Math.min(info.width - 1, Math.max(0, Math.floor(uv[0] * info.width))), y = Math.min(info.height - 1, Math.max(0, Math.floor(uv[1] * info.height)));
    const o = (y * info.width + x) * 3, val = Math.max(data[o], data[o + 1], data[o + 2]), sat = val ? (val - Math.min(data[o], data[o + 1], data[o + 2])) / val : 0;
    N.getElement(i, v); const nrm = [v[0], v[1], v[2]];
    pts[g] = { p: gpts[g], v: list, arm: +arm.toFixed(5), robe: sat < 0.16 && val > 150 ? 1 : 0, n: nrm, near: near[g],
      w: [0, 1, 2, 3].filter(k => ww[k] > 0).map(k => [JN[jj[k]], +ww[k].toFixed(6)]) }; }
  writeFileSync(`${DIR}/region.json`, JSON.stringify({ src: IN, joint: JOINT, center: C, radius: R, joints: JN, jointPos: Object.fromEntries(['RightShoulder', 'RightArm', 'RightForeArm', 'RightHand', 'Spine2', 'Neck'].map(x => [x, invPos(JI[x])])),
    tex: [info.width, info.height], nVerts: n, nTris: I.length / 3, pts, tris }));
  console.log(`meshpatch dump: ${tris.length} triangles, ${used.size} welded points within ${R} m of ${JOINT} -> ${DIR}/region.json`);
} else if (MODE === 'apply') {
  // <dir>/patch.json from tools/armpit.py: drop (glTF triangles out), points ({copy: glTF vertex, w: [[joint name, weight]]}:
  // a copy of that vertex with these weights), reweight ({v, w}), tris (corners {v} | {p: a point} | {safe: 'skin'|'robe', g,
  // v|p}: a triangle whose corners lie in different charts of the colour sheet, pointed whole at one texel of plain skin or
  // plain robe beside it — the median colour of the candidates within SAFER (0.03 m) whose 7 x 7 texels are all of its kind)
  const OUT = A3, patch = JSON.parse(readFileSync(`${DIR}/patch.json`, 'utf8'));
  const I = prim.getIndices().getArray(), drop = new Set(patch.drop || []);
  for (const t of drop) if (!(t >= 0 && t < I.length / 3)) throw new Error(`meshpatch: no triangle ${t}`);
  const jw = w => { const top = w.slice().sort((a, b) => b[1] - a[1]).slice(0, 4), s3 = top.reduce((a, b) => a + b[1], 0) || 1;
    const j = [0, 0, 0, 0], ww = [0, 0, 0, 0]; top.forEach(([name, x], k) => { if (!(name in JI)) throw new Error(`meshpatch: no joint ${name}`); j[k] = JI[name]; ww[k] = x / s3; }); return [j, ww]; };
  // the new weights first, so a copy made below of a point weighed again carries its new weights (a copy with the old ones
  // moves apart from the point it copies: a hairline crack along the fill's edge)
  for (const r of patch.reweight || []) { const [j, ww2] = jw(r.w); J.setElement(r.v, j); W.setElement(r.v, ww2); }
  const NP = [], NN = [], NUV = [], NTG = [], NJ = [], NW = [];
  const pushCopy = (from, w, uvOver) => { P.getElement(from, v); NP.push(v[0], v[1], v[2]); N.getElement(from, v); NN.push(v[0], v[1], v[2]);
    UV.getElement(from, uv); NUV.push(...(uvOver || [uv[0], uv[1]])); if (TG) { TG.getElement(from, tg); NTG.push(...tg); }
    if (w) { const [j, ww2] = jw(w); NJ.push(...j); NW.push(...ww2); } else { J.getElement(from, jj); W.getElement(from, ww); NJ.push(...jj); NW.push(...ww); }
    return n + NP.length / 3 - 1; };
  const pIdx = (patch.points || []).map(q => pushCopy(q.copy, q.w));
  const baseOf = c => ('p' in c ? { idx: pIdx[c.p], src: patch.points[c.p] } : { idx: c.v, src: null });
  let nSafe = 0;
  const tris = [];
  const needSafe = (patch.tris || []).some(t => t.some(c => c.safe));
  let tex = null, pos = null;
  if (needSafe) {
    tex = await sharp(Buffer.from(prim.getMaterial().getBaseColorTexture().getImage()), { limitInputPixels: false }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    pos = P.getArray();
  }
  const SAFER = Number(process.env.SAFER || 0.03);
  // a texel's kind: robe is pale and grey (saturation under 0.16, value over 150, as tools/armfree.mjs reads it); skin is
  // warm and coloured (saturation over 0.25, look D's skin, and value over 80); anything else (the dark fill between the
  // sheet's charts, a shadowed crease) is neither, and no plain paint is taken from it
  const kindAt = (x, y) => { const { data, info } = tex, xx = Math.min(info.width - 1, Math.max(0, x)), yy = Math.min(info.height - 1, Math.max(0, y)), o = (yy * info.width + xx) * 3;
    const val = Math.max(data[o], data[o + 1], data[o + 2]), sat = val ? (val - Math.min(data[o], data[o + 1], data[o + 2])) / val : 0;
    return sat < 0.16 && val > 150 ? 'robe' : (sat > 0.25 && val > 80 ? 'skin' : 'none'); };
  // v24.56: with no plain paint of its kind within SAFER, the search widens to twice and then four times it (deep in the
  // crease of his armpit the nearest plain skin can be further off); where SAFER sufficed, nothing changes
  const safeUV = (centre, kind, R = SAFER) => { const { info, data } = tex, cand = [];
    for (let i = 0; i < n; i++) { const dx = pos[3 * i] - centre[0], dy = pos[3 * i + 1] - centre[1], dz = pos[3 * i + 2] - centre[2];
      if (dx * dx + dy * dy + dz * dz > R * R) continue;
      UV.getElement(i, uv); const x = Math.floor(uv[0] * info.width), y = Math.floor(uv[1] * info.height); let ok = true;
      for (let a = -3; a <= 3 && ok; a++) for (let b = -3; b <= 3 && ok; b++) if (kindAt(x + a, y + b) !== kind) ok = false;
      if (ok) { const o = (Math.min(info.height - 1, Math.max(0, y)) * info.width + Math.min(info.width - 1, Math.max(0, x))) * 3; cand.push([uv[0], uv[1], data[o], data[o + 1], data[o + 2]]); } }
    if (!cand.length) { if (R < 4 * SAFER) return safeUV(centre, kind, 2 * R); throw new Error(`meshpatch: no plain ${kind} within ${R} m of ${centre}`); }
    const med = [2, 3, 4].map(k => cand.map(c => c[k]).sort((a, b) => a - b)[cand.length >> 1]);
    let best = cand[0], bd = 1e9; for (const c of cand) { const d2 = (c[2] - med[0]) ** 2 + (c[3] - med[1]) ** 2 + (c[4] - med[2]) ** 2; if (d2 < bd) { bd = d2; best = c; } }
    return [best[0], best[1]]; };
  // a filled triangle carrying the paint of the corners already there ({kind} on its corners) is checked: fifteen samples of
  // the sheet across it must all be of its kind (pale and grey for robe, anything else for skin); if not, it is pointed at
  // plain paint of its kind like a {safe} one (the scan printed the robe's white onto his arm where the two touched)
  const sampleKindOK = (bs, kind) => { const { info } = tex, us = bs.map(b => (UV.getElement(b.src ? b.src.copy : b.idx, uv), [uv[0], uv[1]]));
    for (const [a, b] of [[1, 0], [0, 1], [0, 0], [0.5, 0.5], [0.5, 0], [0, 0.5], [1 / 3, 1 / 3], [0.25, 0.25], [0.5, 0.25], [0.25, 0.5], [0.75, 0.125], [0.125, 0.75], [0.125, 0.125], [0.6, 0.2], [0.2, 0.6]]) {
      const c = 1 - a - b, x = Math.floor((us[0][0] * a + us[1][0] * b + us[2][0] * c) * info.width), y = Math.floor((us[0][1] * a + us[1][1] * b + us[2][1] * c) * info.height);
      if (kindAt(x, y) !== kind) return false; }
    return true; };
  let nChecked = 0, nRepointed = 0;
  for (const t of patch.tris || []) {
    if (t.length !== 3) throw new Error('meshpatch: a triangle without three corners');
    if (t.some(c => c.kind) && !t.some(c => c.safe)) {
      if (!tex) { tex = await sharp(Buffer.from(prim.getMaterial().getBaseColorTexture().getImage()), { limitInputPixels: false }).removeAlpha().raw().toBuffer({ resolveWithObject: true }); pos = P.getArray(); }
      nChecked++;
      if (!sampleKindOK(t.map(baseOf), t[0].kind)) { nRepointed++; for (const c of t) c.safe = c.kind; }
    }
    if (t.some(c => c.safe)) {
      const bs = t.map(baseOf), centre = [0, 1, 2].map(k => bs.reduce((a, b) => (P.getElement(b.src ? b.src.copy : b.idx, v), a + v[k]), 0) / 3);
      const kind = t[0].safe, suv = safeUV(centre, kind); nSafe++;
      tris.push(...bs.map(b => b.idx < n ? pushCopy(b.idx, null, suv) : pushCopy(b.src.copy, b.src.w, suv)));
    } else tris.push(...t.map(c => baseOf(c).idx));
  }
  const grow = (acc, vals) => { const a = acc.getArray(), b = new a.constructor(a.length + vals.length); b.set(a); b.set(vals, a.length); acc.setArray(b); };
  if (NP.length) { grow(P, NP); grow(N, NN); grow(UV, NUV); grow(J, NJ); grow(W, NW); if (TG) grow(TG, NTG); }
  const nn = n + NP.length / 3, keep = [];
  for (let t = 0; t < I.length; t += 3) if (!drop.has(t / 3)) keep.push(I[t], I[t + 1], I[t + 2]);
  for (const x of tris) if (!(x >= 0 && x < nn)) throw new Error(`meshpatch: corner ${x} out of range`);
  keep.push(...tris);
  prim.getIndices().setArray(new Uint32Array(keep));
  for (const acc of [P, N, UV, J, W, TG].filter(Boolean)) if (acc.getCount() !== nn) throw new Error('meshpatch: counts disagree');
  await io.write(OUT, doc);
  console.log(`meshpatch apply: ${drop.size} triangles out, ${NP.length / 3} points in (${nSafe} triangles pointed at plain skin or robe; ${nRepointed} of ${nChecked} carrying their corners' paint found off their kind), ${(patch.reweight || []).length} reweighed, ${tris.length / 3} triangles in -> ${OUT}`);
} else throw new Error('meshpatch: dump or apply');
