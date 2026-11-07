// v24.50 · GRANDMASTER PHO'S ROBE FREED FROM THE UNDERSIDE OF HIS RIGHT ARM. Chad, 7 Nov 2026: "The robe is like attached
// to the underside of the arm" ... "Its the other arm" ... "Do it, go". Run between tools/robesim.mjs and tools/prepmonk.mjs:
//   node tools/armfree.mjs <cloth.glb> <out.glb>        (REPORT=1: measure only, write nothing)
// THE WHY (measured, REPORT=1, on masters/v24.49/prep/pho_cloth.glb): his scan hangs his right arm 62° below level, the
// robe's edge under that armpit touching it, and the rig gave the robe there the arm's weights — the robe 6–8 cm off the
// arm's line rides it at 0.86, 8–10 cm at 0.65, 10–12 at 0.41, 12–14 at 0.18 (robeskin's ARMBLEND fade, v24.46; his own
// file's weights inside it): 12,347 points of robe. Lift the arm and the robe climbs its underside to the elbow.
// THE SHIPPED SETTINGS (masters/v24.50/make.sh): CUT=1 CUTARM=0.5 SPECKCUT=1 CAPROBE=none CAPARM=fan — the robe re-tied to
// his trunk, the 340 triangles joining it to skin that rides the arm taken out, the scraps of robe stuck on his arm taken
// out, each opening on the arm closed by a fan whose middle sits inside the arm (FANIN). Tried and left (PLAN.md):
// SKINRING (the stretch moved into a band of armpit skin: a sheet of skin under the arm; held off the arm with SKINMAX it
// changed nothing seen), lips (LIP: thin strands where an edge's points part), ribbons to the bone line (panels floating
// where the arm had hung), CUTARM 0.15 (holes along the robe's edge on his back), fans on the robe's side (a flap near
// his chin), the specks recoloured to skin (a fin), ROBESHOULDER (untying the robe from his shoulder bone too: no change
// seen at the edge, 10,000 more points moved). Left: a jagged edge where the robe meets the armpit skin when the arm is
// straight up — the robe's own white-to-skin colour edge stretching with the skin.
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import sharp from 'sharp';
const [IN, OUT] = process.argv.slice(2);
const E = (k, d) => (process.env[k] !== undefined ? Number(process.env[k]) : d);
const SAT = E('SAT', 0.16), VAL = E('VAL', 150), REPORT = E('REPORT', 0);
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
const JP = joints.map((_, k) => invPos(k));
const segD = (p, a, b) => { const ab = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], ap = [p[0] - a[0], p[1] - a[1], p[2] - a[2]];
  const t = Math.max(0, Math.min(1, (ap[0] * ab[0] + ap[1] * ab[1] + ap[2] * ab[2]) / (ab[0] ** 2 + ab[1] ** 2 + ab[2] ** 2)));
  return Math.hypot(ap[0] - t * ab[0], ap[1] - t * ab[1], ap[2] - t * ab[2]); };
const RA = JP[JI.RightArm], RF = JP[JI.RightForeArm];
const ARMJ = new Set(['RightArm', 'RightForeArm', 'RightHand'].map(n => JI[n])), SHJ = JI.RightShoulder;
console.log(`right upper arm at rest: ${RA.map(x => x.toFixed(3))} -> ${RF.map(x => x.toFixed(3))} (down ${(Math.atan2(RA[1] - RF[1], Math.hypot(RF[0] - RA[0], RF[2] - RA[2])) * 180 / Math.PI).toFixed(0)}° from level)`);
const armSegs = [['LeftArm', 'LeftForeArm'], ['LeftForeArm', 'LeftHand'], ['RightArm', 'RightForeArm'], ['RightForeArm', 'RightHand']];
for (const mesh of root.listMeshes()) for (const prim of mesh.listPrimitives()) {
  const P = prim.getAttribute('POSITION'), UV = prim.getAttribute('TEXCOORD_0'), J = prim.getAttribute('JOINTS_0'), W = prim.getAttribute('WEIGHTS_0');
  if (!J || !W) continue;
  const { data, info } = await sharp(Buffer.from(prim.getMaterial().getBaseColorTexture().getImage()), { limitInputPixels: false }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const n = P.getCount(), v = [0, 0, 0], uv = [0, 0], jj = [0, 0, 0, 0], ww = [0, 0, 0, 0];
  const arm = new Float32Array(n), sh = new Float32Array(n), cloth = new Uint8Array(n), dR = new Float32Array(n).fill(9), pos = new Float32Array(3 * n);
  for (let i = 0; i < n; i++) {
    P.getElement(i, v); pos.set(v, 3 * i); J.getElement(i, jj); W.getElement(i, ww); UV.getElement(i, uv);
    for (let k = 0; k < 4; k++) { if (ARMJ.has(jj[k])) arm[i] += ww[k]; if (jj[k] === SHJ) sh[i] += ww[k]; }
    const x = Math.min(info.width - 1, Math.max(0, Math.floor(uv[0] * info.width))), y = Math.min(info.height - 1, Math.max(0, Math.floor(uv[1] * info.height)));
    const o = (y * info.width + x) * 3, val = Math.max(data[o], data[o + 1], data[o + 2]), sat = val ? (val - Math.min(data[o], data[o + 1], data[o + 2])) / val : 0;
    cloth[i] = sat < SAT && val > VAL ? 1 : 0;
    const d = segD(v, RA, RF); let dm = 9; for (const [a, b] of armSegs) dm = Math.min(dm, segD(v, JP[JI[a]], JP[JI[b]]));
    if (d <= dm + 1e-9) dR[i] = d;
  }
  if (REPORT) {
    const bins = [0.03, 0.045, 0.06, 0.08, 0.10, 0.12, 0.14, 0.16, 0.20];
    console.log('off his right upper arm (m) | cloth: n, arm share mean, shoulder share mean | skin: n, arm, shoulder');
    let lo = 0; for (const hi of bins) { const s = [[0, 0, 0], [0, 0, 0]];
      for (let i = 0; i < n; i++) if (dR[i] >= lo && dR[i] < hi) { const c = s[cloth[i] ? 0 : 1]; c[0]++; c[1] += arm[i]; c[2] += sh[i]; }
      console.log(`  ${lo.toFixed(3)}-${hi.toFixed(3)} | ${String(s[0][0]).padStart(5)} ${(s[0][1] / (s[0][0] || 1)).toFixed(2)} ${(s[0][2] / (s[0][0] || 1)).toFixed(2)} | ${String(s[1][0]).padStart(5)} ${(s[1][1] / (s[1][0] || 1)).toFixed(2)} ${(s[1][2] / (s[1][0] || 1)).toFixed(2)}`); lo = hi; }
    const I = prim.getIndices().getArray(); let mixed = 0, mixedCS = 0, clothOnArm = 0;
    for (let t = 0; t < I.length; t += 3) { const a = I[t], b = I[t + 1], c = I[t + 2]; if (Math.min(dR[a], dR[b], dR[c]) > 0.2) continue;
      const mx = Math.max(arm[a], arm[b], arm[c]), mn = Math.min(arm[a], arm[b], arm[c]);
      if (mx - mn > 0.5) { mixed++; if (cloth[a] + cloth[b] + cloth[c] > 0 && cloth[a] + cloth[b] + cloth[c] < 3) mixedCS++; } }
    for (let i = 0; i < n; i++) if (cloth[i] && dR[i] < 0.2 && arm[i] > 0.5) clothOnArm++;
    console.log(`triangles within 0.2 m whose points' arm shares differ by > 0.5: ${mixed} (cloth beside skin: ${mixedCS}); cloth points riding the arm more than half: ${clothOnArm}`);
    const ys = []; for (let i = 0; i < n; i++) if (cloth[i] && dR[i] < 0.2 && arm[i] > 0.05) ys.push(pos[3 * i + 1]);
    ys.sort((a, b) => a - b); console.log(`cloth points with any arm share near the arm: ${ys.length}, height ${ys[0]?.toFixed(3)}..${ys[ys.length - 1]?.toFixed(3)} (shoulder joint ${RA[1].toFixed(3)})`);
  }
}
if (REPORT) process.exit(0);
/* THE FIX. The robe's points (the colour test: a pale neutral, as tools/robeskin.mjs reads it; seam copies welded, a point
   taking its neighbours' class when most of them disagree) that ride his RIGHT arm — any share on RightArm, RightForeArm
   or RightHand — and belong to the robe itself (the robe's one big piece of cloth, never a speck of pale texture inside his
   arm's skin) are tied to his trunk: the arm's share taken out and the rest kept, where the rest is at least KEEP; where it
   is less, the trunk's weights are carried in from the robe around them (each point the mean of its robe neighbours,
   PASSES times, the points outside the set held fixed). Every other point keeps its weights byte for byte; no point moves;
   triangles are taken out and added only by CUT (below). */
const KEEP = E('KEEP', 0.5), PASSES = E('PASSES', 400), ISLAND = E('ISLAND', 2000);
for (const mesh of root.listMeshes()) for (const prim of mesh.listPrimitives()) {
  const P = prim.getAttribute('POSITION'), UV = prim.getAttribute('TEXCOORD_0'), J = prim.getAttribute('JOINTS_0'), W = prim.getAttribute('WEIGHTS_0');
  if (!J || !W) continue;
  const { data, info } = await sharp(Buffer.from(prim.getMaterial().getBaseColorTexture().getImage()), { limitInputPixels: false }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const n = P.getCount(), v = [0, 0, 0], uv = [0, 0], jj = [0, 0, 0, 0], ww = [0, 0, 0, 0], NJ = joints.length;
  const gid = new Int32Array(n), gmap = new Map(); let G = 0;
  for (let i = 0; i < n; i++) { P.getElement(i, v); const k = `${Math.round(v[0] * 1e5)},${Math.round(v[1] * 1e5)},${Math.round(v[2] * 1e5)}`;
    let g = gmap.get(k); if (g === undefined) { g = G++; gmap.set(k, g); } gid[i] = g; }
  const I = prim.getIndices().getArray(), deg = new Uint32Array(G + 1), pairs = [];
  for (let t = 0; t < I.length; t += 3) for (let k = 0; k < 3; k++) { const a = gid[I[t + k]], b = gid[I[t + (k + 1) % 3]]; if (a !== b) { pairs.push(a, b); deg[a + 1]++; deg[b + 1]++; } }
  for (let g = 0; g < G; g++) deg[g + 1] += deg[g];
  const adj = new Uint32Array(deg[G]), fill = deg.slice(0, G);
  for (let e = 0; e < pairs.length; e += 2) { const a = pairs[e], b = pairs[e + 1]; adj[fill[a]++] = b; adj[fill[b]++] = a; }
  /* per group: class, weights (NJ wide, averaged over its copies) */
  const cloth = new Uint8Array(G), A = new Float32Array(G * NJ), cnt = new Float32Array(G);
  for (let i = 0; i < n; i++) { const g = gid[i]; UV.getElement(i, uv); J.getElement(i, jj); W.getElement(i, ww); cnt[g]++;
    for (let k = 0; k < 4; k++) A[g * NJ + jj[k]] += ww[k];
    const x = Math.min(info.width - 1, Math.max(0, Math.floor(uv[0] * info.width))), y = Math.min(info.height - 1, Math.max(0, Math.floor(uv[1] * info.height)));
    const o = (y * info.width + x) * 3, val = Math.max(data[o], data[o + 1], data[o + 2]), sat = val ? (val - Math.min(data[o], data[o + 1], data[o + 2])) / val : 0;
    if (sat < SAT && val > VAL) cloth[g] = 1; }
  for (let g = 0; g < G; g++) for (let j = 0; j < NJ; j++) A[g * NJ + j] /= cnt[g];
  { const c2 = cloth.slice(); for (let g = 0; g < G; g++) { let k = 0; const m = deg[g + 1] - deg[g]; for (let e = deg[g]; e < deg[g + 1]; e++) k += cloth[adj[e]];
      if (m >= 3) { if (cloth[g] && k * 4 < m) c2[g] = 0; else if (!cloth[g] && k * 4 > 3 * m) c2[g] = 1; } } cloth.set(c2); }
  /* the robe's pieces: cloth joined to cloth; a piece under ISLAND points is a speck of pale texture, not the robe */
  const comp = new Int32Array(G).fill(-1), csize = []; let nc = 0;
  for (let g = 0; g < G; g++) { if (!cloth[g] || comp[g] >= 0) continue; const st = [g]; comp[g] = nc; let sz = 0;
    while (st.length) { const a = st.pop(); sz++; for (let e = deg[a]; e < deg[a + 1]; e++) { const b = adj[e]; if (cloth[b] && comp[b] < 0) { comp[b] = nc; st.push(b); } } }
    csize.push(sz); nc++; }
  const armOf = g => { let s = 0; for (const j of ARMJ) s += A[g * NJ + j]; return s; };
  /* ROBESHOULDER=1: the robe is untied from his right shoulder bone too (the bone lifts as the arm goes overhead, and the
     robe's edge tied to it a little was drawn up into white teeth) */
  const ROBEJ = new Set([...ARMJ, ...(E('ROBESHOULDER', 0) && SHJ !== undefined ? [SHJ] : [])]);
  const robeOf = g => { let s = 0; for (const j of ROBEJ) s += A[g * NJ + j]; return s; };
  const set = new Uint8Array(G), known = new Uint8Array(G); let nSet = 0, nFill = 0, nSpeck = 0;
  for (let g = 0; g < G; g++) { if (!cloth[g]) continue; const a = robeOf(g); if (a <= 1e-6) continue;
    if (csize[comp[g]] < ISLAND) { if (armOf(g) > 1e-6) nSpeck++; continue; }
    set[g] = 1; nSet++; for (const j of ROBEJ) A[g * NJ + j] = 0;
    const rest = 1 - a; if (rest >= KEEP) { for (let j = 0; j < NJ; j++) A[g * NJ + j] /= rest; known[g] = 1; } else nFill++; }
  /* carry the trunk's weights into the points that had little else: robe neighbours only, the rest held */
  const B = A.slice();
  for (let it = 0; it < PASSES; it++) { for (let g = 0; g < G; g++) { if (!set[g] || known[g]) continue; let m = 0; const o = g * NJ;
      for (let j = 0; j < NJ; j++) B[o + j] = 0;
      for (let e = deg[g]; e < deg[g + 1]; e++) { const b = adj[e]; if (!cloth[b] || (!set[b] && robeOf(b) > 1e-6)) continue; m++; for (let j = 0; j < NJ; j++) B[o + j] += A[b * NJ + j]; }
      if (m) for (let j = 0; j < NJ; j++) B[o + j] /= m; else for (let j = 0; j < NJ; j++) B[o + j] = A[o + j]; }
    for (let g = 0; g < G; g++) if (set[g] && !known[g]) for (let j = 0; j < NJ; j++) A[g * NJ + j] = B[g * NJ + j]; }
  /* SKINRING=R: the stretch moved off the robe's edge into his armpit's skin. With the robe on his trunk, the triangles
     between the robe's edge and skin that rides the arm stretch when the arm goes up, and the ones that carry the edge's
     pale texels show as white streaks. So the skin his re-tied robe touches is given the robe's new weights too (rings
     1..SKINHOLD from the robe, each ring the mean of its inner neighbours), then eases back to its own weights by ring R:
     the arm pulls only skin, which stretches as an armpit does. Skin with no share on his right arm is never touched. */
  const SKINRING = E('SKINRING', 0), SKINHOLD = E('SKINHOLD', 2), SKINMAX = E('SKINMAX', 2);   // SKINMAX: skin riding the arm this much or more is never eased (the arm itself)
  let nSkin = 0;
  if (SKINRING > 0) {
    const ring = new Int32Array(G).fill(-1); let front = [];
    for (let g = 0; g < G; g++) if (set[g]) { ring[g] = 0; front.push(g); }
    const O = new Float32Array(A.length); O.set(A);
    for (let r = 1; r <= SKINRING; r++) { const next = [];
      for (const g of front) for (let e = deg[g]; e < deg[g + 1]; e++) { const b = adj[e]; if (ring[b] >= 0 || cloth[b] || armOf(b) <= 1e-6 || armOf(b) >= SKINMAX) continue; ring[b] = r; next.push(b); }
      for (const g of next) { const o = g * NJ, acc = new Float32Array(NJ); let m = 0;
        for (let e = deg[g]; e < deg[g + 1]; e++) { const b = adj[e]; if (ring[b] !== r - 1) continue; m++; for (let j = 0; j < NJ; j++) acc[j] += O[b * NJ + j]; }
        const t = Math.max(0, Math.min(1, (r - SKINHOLD) / Math.max(1, SKINRING - SKINHOLD))), a = t * t * (3 - 2 * t);
        for (let j = 0; j < NJ; j++) O[o + j] = acc[j] / m;
        for (let j = 0; j < NJ; j++) A[o + j] = (1 - a) * O[o + j] + a * A[o + j];
        set[g] = 1; nSkin++; }
      front = next; }
  }
  /* write: the four largest shares, summing to 1 */
  let nw = 0;
  for (let i = 0; i < n; i++) { const g = gid[i]; if (!set[g]) continue; const o = g * NJ, top = [];
    for (let j = 0; j < NJ; j++) if (A[o + j] > 1e-6) top.push([A[o + j], j]);
    top.sort((x, y) => y[0] - x[0]); top.length = Math.min(4, top.length); const s = top.reduce((q, x) => q + x[0], 0);
    if (!s) continue;
    J.setElement(i, [0, 1, 2, 3].map(k => top[k] ? top[k][1] : 0)); W.setElement(i, [0, 1, 2, 3].map(k => top[k] ? top[k][0] / s : 0)); nw++; }
  /* CUT=1: THE JOIN TAKEN OUT (as tools/hemcut.mjs frees the hem from his shins). Where the scan joins the robe's edge
     to his arm's skin, a triangle with a robe point (now on his trunk) and a point of skin riding his right arm (its arm
     share CUTARM or more) can only stretch, as streaks of the robe's edge or a sheet of skin, when the arm goes up. Those
     triangles are taken out, and every opening that leaves is closed by a cap: one new point at its middle and a triangle
     from each open edge to it, riding as its edge points do, in ONE texel — a robe piece the median colour of the robe
     within 6 cm, an arm piece the median colour of his arm's skin within 6 cm. Every point keeps its place and weights. */
  if (E('CUT', 0)) {
    const CUTARM = E('CUTARM', 0.15), cls = new Int8Array(G), wnow = new Float32Array(G);
    for (let i = 0; i < n; i++) { J.getElement(i, jj); W.getElement(i, ww); let s2 = 0; for (let k = 0; k < 4; k++) if (ARMJ.has(jj[k])) s2 += ww[k]; wnow[gid[i]] = s2; }
    for (let g = 0; g < G; g++) cls[g] = cloth[g] && wnow[g] < 0.05 ? 1 : (!cloth[g] && wnow[g] >= CUTARM ? 2 : 0);
    /* SPECKCUT=1: the scraps of robe the scan stuck onto his arm (pale points still riding it) stand out of the raised arm
       as a flap, white or, drawn in skin, a fin: every triangle with one is taken out with the join, and the opening on the
       arm closed as the arm's own */
    const SPECKCUT = E('SPECKCUT', 0); let nSpeckCut = 0;
    if (SPECKCUT) for (let g = 0; g < G; g++) if (cloth[g] && wnow[g] >= 0.05) cls[g] = 3;
    const N = prim.getAttribute('NORMAL'), TG = prim.getAttribute('TANGENT');
    for (const sem of prim.listSemantics()) if (!['POSITION', 'NORMAL', 'TEXCOORD_0', 'TANGENT', 'JOINTS_0', 'WEIGHTS_0'].includes(sem)) throw new Error('armfree: an attribute it cannot extend: ' + sem);
    const ek = (a, b) => a < b ? a + ',' + b : b + ',' + a, before = new Map(), after = new Map(), keep = []; let cut = 0;
    for (let t = 0; t < I.length; t += 3) { const g3 = [gid[I[t]], gid[I[t + 1]], gid[I[t + 2]]];
      for (let k = 0; k < 3; k++) { const e = ek(g3[k], g3[(k + 1) % 3]); before.set(e, (before.get(e) || 0) + 1); }
      const cs = g3.map(g => cls[g]); if (cs.includes(1) && cs.includes(2)) { cut++; continue; } if (cs.includes(3)) { nSpeckCut++; continue; }
      keep.push(t); for (let k = 0; k < 3; k++) { const e = ek(g3[k], g3[(k + 1) % 3]); after.set(e, (after.get(e) || 0) + 1); } }
    const edges = [];
    for (const t of keep) for (let k = 0; k < 3; k++) { const a = I[t + k], b = I[t + (k + 1) % 3], e = ek(gid[a], gid[b]); if (after.get(e) === 1 && before.get(e) > 1) edges.push([a, b]); }
    const par = new Map(), find = x => { while (par.get(x) !== x) { par.set(x, par.get(par.get(x))); x = par.get(x); } return x; };
    const add = x => { if (!par.has(x)) par.set(x, x); }, uni = (a, b) => { add(a); add(b); const ra = find(a), rb = find(b); if (ra !== rb) par.set(ra, rb); };
    for (const [a, b] of edges) uni(gid[a], gid[b]);
    const pieces = new Map(); for (const ed of edges) { const r = find(gid[ed[0]]); if (!pieces.has(r)) pieces.set(r, []); pieces.get(r).push(ed); }
    const wrap = (x, m) => ((x % m) + m) % m, texel = i => { UV.getElement(i, uv); const o = (wrap(Math.floor(uv[1] * info.height), info.height) * info.width + wrap(Math.floor(uv[0] * info.width), info.width)) * 3; return [data[o], data[o + 1], data[o + 2]]; };
    const medianPoint = cand => { const cols = cand.map(texel), med = [0, 1, 2].map(k => cols.map(x => x[k]).sort((a, b) => a - b)[cols.length >> 1]);
      let bi = cand[0], bd = 1e9; cand.forEach((i, m) => { const d = (cols[m][0] - med[0]) ** 2 + (cols[m][1] - med[1]) ** 2 + (cols[m][2] - med[2]) ** 2; if (d < bd) { bd = d; bi = i; } }); return bi; };
    const NP = [], NN = [], NUV = [], NTG = [], NJw = [], NW = [], tri = [];
    const pos = i => { P.getElement(i, v); return [v[0], v[1], v[2]]; };
    const wOf = i => { J.getElement(i, jj); W.getElement(i, ww); return [0, 1, 2, 3].filter(k => ww[k] > 0).map(k => [jj[k], ww[k]]); };
    const newPoint = (p, nrm, from, jw) => { const id = n + NP.length / 3; NP.push(...p); NN.push(...nrm);
      const u2 = [0, 0], tg = [0, 0, 0, 0]; UV.getElement(from, u2); NUV.push(...u2); if (TG) { TG.getElement(from, tg); NTG.push(...tg); }
      const top = jw.slice().sort((x, y) => y[1] - x[1]).slice(0, 4), s3 = top.reduce((x, y) => x + y[1], 0) || 1;
      for (let k = 0; k < 4; k++) { NJw.push(top[k] ? top[k][0] : 0); NW.push(top[k] ? top[k][1] / s3 : 0); } return id; };
    const avgWeights = ids => { const m = new Map(); for (const i of ids) for (const [j, w] of wOf(i)) m.set(j, (m.get(j) || 0) + w); return [...m]; };
    const norm3 = a => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
    const nn = [0, 0, 0], dupOf = (i, from) => { N.getElement(i, nn); return newPoint(pos(i), [nn[0], nn[1], nn[2]], from, wOf(i)); };
    /* each opening sealed INWARD by a lip: every open edge carried LIP metres straight in (against its point's normal), its
       points riding as the edge point they come from, so the lip moves with the edge and never stands out of him (a fan to
       a piece's middle stood out as a fin where the cut curves; a ribbon to the bone line inside floated as a panel where
       the arm had hung, its points tied half to the arm). A piece's lip in one texel: the median skin within 6 cm (a robe
       piece shows the skin under its edge). */
    const LIP = E('LIP', 0.012), CAPROBE = process.env.CAPROBE || 'fan', CAPARM = process.env.CAPARM || 'fan', FANIN = E('FANIN', 0.6);
    const skinNear = (c, r) => { const cand = []; for (let i = 0; i < n; i++) { if (cloth[gid[i]]) continue; const q = pos(i); if (Math.hypot(q[0] - c[0], q[1] - c[1], q[2] - c[2]) < r) cand.push(i); } return cand; };
    const rep = { robe: 0, arm: 0, open: 0 };
    for (const eds of pieces.values()) {
      const ids = [...new Set(eds.flat())], cc = [0, 0, 0, 0]; for (const i of ids) cc[cls[gid[i]]]++; const pc = cc[1] > cc[2] + cc[0] ? 1 : 2;
      if (eds.length < 2) { rep.open++; continue; }
      const c = [0, 0, 0]; for (const i of ids) { const q = pos(i); for (let k = 0; k < 3; k++) c[k] += q[k] / ids.length; }
      let cand = skinNear(c, 0.06); if (!cand.length) cand = skinNear(c, 0.12); const from = medianPoint(cand.length ? cand : ids);
      const how = pc === 1 ? CAPROBE : CAPARM;
      if (how === 'none') { rep.open++; continue; }
      if (how === 'fan') {
        /* a fan to the piece's middle (tools/hemcut.mjs's cap), riding as its edge points do on average */
        let nrm = [0, 0, 0]; for (const [a, b] of eds) { const pa = pos(a), pb = pos(b), e = [pb[0] - pa[0], pb[1] - pa[1], pb[2] - pa[2]], r = [pa[0] - c[0], pa[1] - c[1], pa[2] - c[2]];
          nrm[0] += e[1] * r[2] - e[2] * r[1]; nrm[1] += e[2] * r[0] - e[0] * r[2]; nrm[2] += e[0] * r[1] - e[1] * r[0]; }
        nrm = norm3(nrm); const dup = new Map(); for (const i of ids) dup.set(i, dupOf(i, from));
        /* an arm piece's middle drawn INSIDE his arm (FANIN of the way to his upper arm's line), so the fan cannot stand out
           of the arm as a fin where the cut curves */
        let cm = c; if (pc === 2 && FANIN > 0) { const A0 = JP[JI.RightArm], B0 = JP[JI.RightForeArm], ab = [B0[0] - A0[0], B0[1] - A0[1], B0[2] - A0[2]], ac = [c[0] - A0[0], c[1] - A0[1], c[2] - A0[2]];
          const t = Math.max(0, Math.min(1, (ac[0] * ab[0] + ac[1] * ab[1] + ac[2] * ab[2]) / (ab[0] ** 2 + ab[1] ** 2 + ab[2] ** 2))), r = [A0[0] + t * ab[0], A0[1] + t * ab[1], A0[2] + t * ab[2]];
          cm = [c[0] + (r[0] - c[0]) * FANIN, c[1] + (r[1] - c[1]) * FANIN, c[2] + (r[2] - c[2]) * FANIN]; }
        const mid = newPoint(cm, nrm, from, avgWeights(ids)); for (const [a, b] of eds) tri.push(dup.get(b), dup.get(a), mid);
      } else {
        const dup = new Map(), deep = new Map();
        for (const i of ids) { N.getElement(i, nn); dup.set(i, newPoint(pos(i), [-nn[0], -nn[1], -nn[2]], from, wOf(i))); const q = pos(i); deep.set(i, newPoint([q[0] - nn[0] * LIP, q[1] - nn[1] * LIP, q[2] - nn[2] * LIP], [-nn[0], -nn[1], -nn[2]], from, wOf(i))); }
        for (const [a, b] of eds) tri.push(dup.get(b), dup.get(a), deep.get(a), dup.get(b), deep.get(a), deep.get(b)); }
      rep[pc === 1 ? 'robe' : 'arm']++; }
    /* the pale specks left riding his arm (the scan's robe printed on his arm's skin): each triangle that touches one drawn
       in his arm's skin colour (its three corners copied with the arm's median skin texel, so the atlas is not smeared) */
    const speckG = new Uint8Array(G); for (let g = 0; g < G; g++) if (cloth[g] && wnow[g] >= 0.05) speckG[g] = 1;
    let nSpeckTri = 0; const armSkin = (() => { const cand = []; for (let i = 0; i < n; i++) if (!cloth[gid[i]] && cls[gid[i]] === 2) cand.push(i); return cand.length ? medianPoint(cand.filter((_, k) => k % 7 === 0)) : null; })();
    if (armSkin !== null) for (const t of keep) { if (!speckG[gid[I[t]]] && !speckG[gid[I[t + 1]]] && !speckG[gid[I[t + 2]]]) continue;
      for (let k = 0; k < 3; k++) { const i = I[t + k]; N.getElement(i, nn); I[t + k] = newPoint(pos(i), [nn[0], nn[1], nn[2]], armSkin, wOf(i)); } nSpeckTri++; }
    const grow = (acc, extra, Ctor) => { const old = acc.getArray(), out = new Ctor(old.length + extra.length); out.set(old); out.set(extra, old.length); acc.setArray(out); };
    grow(P, NP, Float32Array); grow(N, NN, Float32Array); grow(UV, NUV, Float32Array); if (TG) grow(TG, NTG, Float32Array);
    grow(J, NJw, J.getArray().constructor); grow(W, NW, W.getArray().constructor);
    const idx = new Uint32Array(keep.length * 3 + tri.length); let o2 = 0; for (const t of keep) { idx[o2++] = I[t]; idx[o2++] = I[t + 1]; idx[o2++] = I[t + 2]; } idx.set(tri, o2);
    prim.getIndices().setArray(idx);
    console.log(`armfree cut: ${cut} triangles joining the robe to skin riding his right arm (share >= ${CUTARM}) taken out; ${edges.length} open edges in ${pieces.size} pieces: ${rep.robe} robe and ${rep.arm} arm pieces closed (robe ${CAPROBE}, arm ${CAPARM}), ${rep.open} left open; ${nSpeckTri} triangles of pale specks on his arm drawn in skin, ${nSpeckCut} taken out with them; ${NP.length / 3} points and ${tri.length / 3} triangles added`);
  }
  console.log(`armfree: ${nSet} robe points off his right arm (${nFill} given the trunk's weights from the robe around them), ${nSkin} armpit skin points eased (SKINRING ${E('SKINRING', 0)}), ${nw} vertices written; ${nSpeck} pale specks inside his skin left on the arm; robe pieces ${nc}, largest ${Math.max(...csize)}`);
}
await io.write(OUT, doc);
console.log('armfree: wrote', OUT);
