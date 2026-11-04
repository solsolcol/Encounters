// v24.46 · GRANDMASTER PHO'S HEM CUT FREE OF HIS SHINS. Chad, 4 Nov 2026 ("Fix the rest of the issues with grandmaster
// pho's model"), his yes to the one change the v24.45 report put to him. Run between tools/robeskin.mjs (with HEMRING=0,
// so no ring of the robe rides a shin) and tools/prepmonk.mjs:  node tools/hemcut.mjs <robe.glb> <out.glb>
//
// THE WHY (masters/v24.42/make.sh, measured again in masters/v24.46/PLAN.md): the scan's robe is one closed surface whose
// underside closes onto his shins at mid-shin (rest heights 0.17–0.30 m) through triangles that join points riding the
// robe's skirt chains to points riding his lower legs (562 of them with v24.45's weights, 405 with HEMRING=0). Whenever a
// leg moves they stretch (walking 16x, the sword lunge 27x, running 41x): the grey band at the trailing shin, the strips
// and spikes at the hem. No weight can untie a surface tied to both.
//
// WHAT IT DOES (every point that exists keeps its position, its weights and every attribute, byte for byte; only
// triangles are taken out and new points and triangles added):
//   1. Each position (the scan's seam copies welded) is classed by what it rides: the skirt (its Skirt* joints' share
//      >= 0.5) or a lower leg (Leg, Foot, ToeBase >= 0.5). Every triangle that joins the two is taken out.
//   2. The open edges that leaves, grouped into pieces, each closed by a cap: one new point at its middle and a triangle
//      from each open edge to it, wound as the surface is. A piece on the robe rides the robe as its edge points do
//      (their weights averaged) — the robe's underside closed, so nothing is seen through it from below. A shin's cut
//      top (each shin's 82–96 edges) is capped riding the shin bone alone, so a leg that steps out of the robe shows the
//      end of a leg, never an open top (HEMUP carries it up the shin's axis first). A small piece on a leg (under 20
//      edges: specks the join left) is capped as a robe piece is.
//   3. EVERY CAP IS ONE COLOUR: its points (the edge points copied: the same place and weights, so they never part from
//      them) all take ONE texel — a shin's the median skin colour of that shin 2-6 cm below its cut, a robe piece's the
//      median colour of the robe within 6 cm of it, a speck's its shin's. The scan's texture places neighbouring points
//      of a seam far apart on its atlas; a cap spanning their own texture positions smeared the atlas between them
//      across it (white and grey stripes on the first photographs).
//   A piece of one or two edges is a sliver with no area, left open (a cap there would be a triangle of no area).
//   Tried and left (masters/v24.46/PLAN.md, the hem): HEMUP 0.06 (the shin carried 6 cm up before its cap) poked
//   through the robe's front and back in walking and sitting; the joining band remade in skin colour (four layers,
//   weights blended shin to robe) stretched into flat webs of skin when he runs.
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { Matrix4 } from 'three';
import sharp from 'sharp';

const [IN, OUT] = process.argv.slice(2);
/* HEMUP=m: how far up the shin's axis each cut shin top is carried before it is capped (unset 0: capped where cut). The
   knee (the first try) and 6 cm both showed the shin through the robe where its hem lags the leg */
const HEMUP = process.env.HEMUP !== undefined ? +process.env.HEMUP : 0;
if (!IN || !OUT) { console.error('usage: node tools/hemcut.mjs <robe.glb> <out.glb>'); process.exit(1); }
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
const doc = await io.read(IN), root = doc.getRoot();
const meshes = root.listMeshes(); if (meshes.length !== 1 || meshes[0].listPrimitives().length !== 1) throw new Error('hemcut expects one mesh with one primitive');
const prim = meshes[0].listPrimitives()[0], skin = root.listSkins()[0], joints = skin.listJoints();
const names = joints.map(j => j.getName().replace(/^mixamorig:?/, ''));
const ji = n => names.indexOf(n);
const ibm = skin.getInverseBindMatrices().getArray();
const JP = k => { const m = new Matrix4().fromArray(ibm, k * 16).invert().elements; return [m[12], m[13], m[14]]; };
const SEM = prim.listSemantics();
for (const s of SEM) if (!['POSITION', 'NORMAL', 'TEXCOORD_0', 'TANGENT', 'JOINTS_0', 'WEIGHTS_0'].includes(s)) throw new Error('hemcut: an attribute it does not know how to extend: ' + s);
const P = prim.getAttribute('POSITION'), N = prim.getAttribute('NORMAL'), UV = prim.getAttribute('TEXCOORD_0'), TG = prim.getAttribute('TANGENT');
const J = prim.getAttribute('JOINTS_0'), W = prim.getAttribute('WEIGHTS_0'), I = prim.getIndices().getArray(), n = P.getCount();
/* the colour texture, read to choose each cap's one texel */
const tex = prim.getMaterial() && prim.getMaterial().getBaseColorTexture(); if (!tex) throw new Error('hemcut: no colour texture to choose the caps\' colours from');
const { data: px, info } = await sharp(Buffer.from(tex.getImage())).raw().toBuffer({ resolveWithObject: true });
const wrap = (x, m) => ((x % m) + m) % m;
const texel = i => { const uv = [0, 0]; UV.getElement(i, uv); const o = (wrap(Math.floor(uv[1] * info.height), info.height) * info.width + wrap(Math.floor(uv[0] * info.width), info.width)) * info.channels; return [px[o], px[o + 1], px[o + 2]]; };
/* of some points, the one whose texel is nearest their median colour */
const medianPoint = cand => { const cols = cand.map(texel), med = [0, 1, 2].map(k => cols.map(x => x[k]).sort((a, b) => a - b)[cols.length >> 1]);
  let bi = cand[0], bd = 1e9; cand.forEach((i, m) => { const d = (cols[m][0] - med[0]) ** 2 + (cols[m][1] - med[1]) ** 2 + (cols[m][2] - med[2]) ** 2; if (d < bd) { bd = d; bi = i; } }); return bi; };

/* 1 · classes per welded position */
const v = [0, 0, 0], gid = new Int32Array(n), gmap = new Map(); let G = 0;
for (let i = 0; i < n; i++) { P.getElement(i, v); const k = `${Math.round(v[0] * 1e5)},${Math.round(v[1] * 1e5)},${Math.round(v[2] * 1e5)}`; let g = gmap.get(k); if (g === undefined) { g = G++; gmap.set(k, g); } gid[i] = g; }
const isSk = names.map(x => /^Skirt/.test(x)), isLeg = names.map(x => /^(Left|Right)(Leg|Foot|ToeBase|Toe_End)$/.test(x));
const cls = new Int8Array(G), jj = [0, 0, 0, 0], ww = [0, 0, 0, 0];
for (let i = 0; i < n; i++) { J.getElement(i, jj); W.getElement(i, ww); let s = 0, l = 0; for (let k = 0; k < 4; k++) { if (isSk[jj[k]]) s += ww[k]; if (isLeg[jj[k]]) l += ww[k]; } cls[gid[i]] = s >= 0.5 ? 1 : l >= 0.5 ? 2 : 0; }
const ek = (a, b) => a < b ? a + ',' + b : b + ',' + a;
const before = new Map(), after = new Map(), keep = []; let cut = 0;
for (let t = 0; t < I.length; t += 3) { const g3 = [gid[I[t]], gid[I[t + 1]], gid[I[t + 2]]];
  for (let k = 0; k < 3; k++) { const e = ek(g3[k], g3[(k + 1) % 3]); before.set(e, (before.get(e) || 0) + 1); }
  const cs = g3.map(g => cls[g]); if (cs.includes(1) && cs.includes(2)) { cut++; continue; }
  keep.push(t); for (let k = 0; k < 3; k++) { const e = ek(g3[k], g3[(k + 1) % 3]); after.set(e, (after.get(e) || 0) + 1); } }

/* 2 · the open edges the cut leaves, oriented as their remaining triangle winds them (a -> b), by original index */
const edges = [];
for (const t of keep) for (let k = 0; k < 3; k++) { const a = I[t + k], b = I[t + (k + 1) % 3], e = ek(gid[a], gid[b]);
  if (after.get(e) === 1 && before.get(e) > 1) edges.push([a, b]); }
/* pieces: connected through welded positions */
const par = new Map(), find = x => { while (par.get(x) !== x) { par.set(x, par.get(par.get(x))); x = par.get(x); } return x; };
const add = x => { if (!par.has(x)) par.set(x, x); }, uni = (a, b) => { add(a); add(b); const ra = find(a), rb = find(b); if (ra !== rb) par.set(ra, rb); };
for (const [a, b] of edges) uni(gid[a], gid[b]);
const pieces = new Map(); for (const ed of edges) { const r = find(gid[ed[0]]); if (!pieces.has(r)) pieces.set(r, []); pieces.get(r).push(ed); }

/* the new points, appended */
const NP = [], NN = [], NUV = [], NTG = [], NJ = [], NW = [], tri = [];
const pos = i => { P.getElement(i, v); return [v[0], v[1], v[2]]; };
const newPoint = (p, nrm, from, jw) => { const id = n + NP.length / 3; NP.push(...p); NN.push(...nrm);
  const uv = [0, 0], tg = [0, 0, 0, 0]; UV.getElement(from, uv); NUV.push(...uv); if (TG) { TG.getElement(from, tg); NTG.push(...tg); }
  const top = jw.slice().sort((x, y) => y[1] - x[1]).slice(0, 4), s = top.reduce((x, y) => x + y[1], 0) || 1;
  for (let k = 0; k < 4; k++) { NJ.push(top[k] ? top[k][0] : 0); NW.push(top[k] ? top[k][1] / s : 0); } return id; };
const wOf = i => { J.getElement(i, jj); W.getElement(i, ww); return [0, 1, 2, 3].filter(k => ww[k] > 0).map(k => [jj[k], ww[k]]); };
const avgWeights = ids => { const m = new Map(); for (const i of ids) for (const [j, w] of wOf(i)) m.set(j, (m.get(j) || 0) + w); return [...m]; };
const norm3 = a => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
const sideOf = i => { let l = 0; for (const [j, w] of wOf(i)) { const nm = names[j] || ''; if (/^Left/.test(nm)) l += w; if (/^Right/.test(nm)) l -= w; } return l >= 0 ? 'Left' : 'Right'; };
/* a copy of an edge point (its place, normal and weights) carrying the cap's one texel */
const nn = [0, 0, 0];
const dupOf = (i, from) => { N.getElement(i, nn); return newPoint(pos(i), [nn[0], nn[1], nn[2]], from, wOf(i)); };
/* each shin's skin texel: the median colour of that shin 2-6 cm below the middle of its cut, along its axis */
const shinSkin = {};
const shinOf = (side, c) => { if (shinSkin[side]) return shinSkin[side];
  const knee = JP(ji(side + 'Leg')), ankle = JP(ji(side + 'Foot')), ax = norm3([knee[0] - ankle[0], knee[1] - ankle[1], knee[2] - ankle[2]]);
  const cand = []; for (let i = 0; i < n; i++) { if (cls[gid[i]] !== 2 || sideOf(i) !== side) continue; const p = pos(i);
    const d = (c[0] - p[0]) * ax[0] + (c[1] - p[1]) * ax[1] + (c[2] - p[2]) * ax[2]; if (d > 0.02 && d < 0.06) cand.push(i); }
  if (!cand.length) throw new Error('hemcut: no shin 2-6 cm below the cut on the ' + side + ' side');
  return shinSkin[side] = { at: medianPoint(cand), of: cand.length, ax, knee, leg: ji(side + 'Leg') }; };
const rgb = i => `rgb(${texel(i).join(',')})`;
const report = [];
/* the shins first, so a speck takes its shin's colour */
const order = [...pieces.values()].map(eds => { const ids = [...new Set(eds.flat())], cc = [0, 0, 0]; for (const i of ids) cc[cls[gid[i]]]++;
  return { eds, ids, pc: cc[1] >= cc[2] ? (cc[1] ? 1 : 0) : 2 }; }).sort((x, y) => (y.pc === 2 && y.eds.length >= 20) - (x.pc === 2 && x.eds.length >= 20));
for (const { eds, ids, pc } of order) {
  const c = [0, 0, 0]; for (const i of ids) { const p = pos(i); for (let k = 0; k < 3; k++) c[k] += p[k] / ids.length; }
  if (eds.length < 3) { report.push(`${pc === 1 ? 'robe' : 'leg'} sliver: ${eds.length} edge(s) left open (no area to cap)`); continue; }
  if (pc === 2 && eds.length >= 20) {
    /* a shin's cut top: capped riding the shin bone alone (carried HEMUP up its axis first) */
    const side = sideOf(ids[0]), S = shinOf(side, c), ax = S.ax, sk = S.at;
    const tk = (S.knee[0] - c[0]) * ax[0] + (S.knee[1] - c[1]) * ax[1] + (S.knee[2] - c[2]) * ax[2], t = Math.min(HEMUP, tk);
    const dup = new Map(); for (const i of ids) dup.set(i, dupOf(i, sk));
    if (t > 0.005) {
      const up = new Map();
      for (const i of ids) { const p = pos(i), q = [p[0] + ax[0] * t, p[1] + ax[1] * t, p[2] + ax[2] * t];
        const r = [p[0] - c[0], p[1] - c[1], p[2] - c[2]], d = r[0] * ax[0] + r[1] * ax[1] + r[2] * ax[2], rad = norm3([r[0] - ax[0] * d, r[1] - ax[1] * d, r[2] - ax[2] * d]);
        up.set(i, newPoint(q, rad, sk, [[S.leg, 1]])); }
      const top = newPoint([c[0] + ax[0] * t, c[1] + ax[1] * t, c[2] + ax[2] * t], ax, sk, [[S.leg, 1]]);
      for (const [a, b] of eds) { const a1 = dup.get(a), b1 = dup.get(b), a2 = up.get(a), b2 = up.get(b); tri.push(b1, a1, a2, b1, a2, b2, b2, a2, top); }
    } else { const top = newPoint(c, ax, sk, [[S.leg, 1]]); for (const [a, b] of eds) tri.push(dup.get(b), dup.get(a), top); }
    report.push(`${side.toLowerCase()} shin: ${eds.length} edges ${t > 0.005 ? `carried ${t.toFixed(3)} m up its axis (the knee is ${tk.toFixed(3)} m up) and capped` : 'capped where cut'}, in ${rgb(sk)} (the median of ${S.of} points of that shin 2-6 cm below)`);
  } else {
    /* a cap at the piece's middle, riding as its edge points do, in one texel: a speck its shin's, a robe piece the
       median of the robe's own points within 6 cm of its middle */
    let nrm = [0, 0, 0]; for (const [a, b] of eds) { const pa = pos(a), pb = pos(b), e = [pb[0] - pa[0], pb[1] - pa[1], pb[2] - pa[2]], r = [pa[0] - c[0], pa[1] - c[1], pa[2] - c[2]];
      nrm[0] += e[1] * r[2] - e[2] * r[1]; nrm[1] += e[2] * r[0] - e[0] * r[2]; nrm[2] += e[0] * r[1] - e[1] * r[0]; }
    nrm = norm3(nrm);   /* the cap triangle (b, a, middle) faces e x r, summed over its edges */
    let from, of = 0;
    if (pc === 2) { const S = shinSkin[sideOf(ids[0])] || shinOf(sideOf(ids[0]), c); from = S.at; }
    else { const cand = []; for (let i = 0; i < n; i++) { if (cls[gid[i]] !== 1) continue; const p = pos(i); if (Math.hypot(p[0] - c[0], p[1] - c[1], p[2] - c[2]) < 0.06) cand.push(i); }
      from = medianPoint(cand.length ? cand : ids); of = cand.length; }
    const dup = new Map(); for (const i of ids) dup.set(i, dupOf(i, from));
    const mid = newPoint(c, nrm, from, avgWeights(ids));
    for (const [a, b] of eds) tri.push(dup.get(b), dup.get(a), mid);
    report.push(`${pc === 1 ? 'robe' : pc === 2 ? 'leg speck' : 'other'} piece: ${eds.length} edges capped in ${rgb(from)}${pc === 2 ? ' (its shin\'s)' : ` (the median of ${of} robe points within 6 cm)`}`);
  }
}
/* 4 · write: the old arrays untouched at the front, the new points after them */
const grow = (acc, extra, Ctor) => { const old = acc.getArray(), out = new Ctor(old.length + extra.length); out.set(old); out.set(extra, old.length); acc.setArray(out); };
grow(P, NP, Float32Array); grow(N, NN, Float32Array); grow(UV, NUV, Float32Array); if (TG) grow(TG, NTG, Float32Array);
grow(J, NJ, J.getArray().constructor); grow(W, NW, W.getArray().constructor);
const idx = new Uint32Array(keep.length * 3 + tri.length); let o = 0; for (const t of keep) { idx[o++] = I[t]; idx[o++] = I[t + 1]; idx[o++] = I[t + 2]; } idx.set(tri, o);
prim.getIndices().setArray(idx);
await io.write(OUT, doc);
console.log(`hemcut: ${cut} triangles joining the robe to his shins taken out; ${edges.length} open edges in ${pieces.size} pieces; ${NP.length / 3} points and ${tri.length / 3} triangles added`);
for (const r of report.sort()) console.log('  ' + r);
