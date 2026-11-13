/* v24.19 — a MESHY model made game-ready (Chad's workflow, 30 Oct 2026: "first generate a reference image using GPTimage
   ... a clean reference image against a white background first, then check the reference image first, then using that
   reference image to generate the 3d models on Meshy, using the best quality settings"). Meshy hands back one mesh of
   ~310,000 triangles with base colour, metal-roughness and normal sheets at 2048, sized to ~1.9 units on its longest axis.
   Unlike prepstatic (base colour only), ALL THREE maps ship: Meshy's PBR is part of what "best quality" bought, the
   bronze and the gold of an image read through its metal sheet and every fold and scale through its normal sheet.
   1. Baked through the file's own node chain; turned TURN degrees about y (the facing is settled by a render, v12.1).
   2. Sized so the chosen extent — AXIS h (height), l (length on z), w (width on x) — is SIZE metres; the lowest point
      on y 0, the footprint centred on the origin.
   3. Welded, simplified to RATIO (an error bound, ERR), the sheets re-encoded as JPEG at PX (the normal at q 92, the
      others q 88), meshopt.
   TINTGREY=r,g,b: the base colour's GREY texels (saturation under 0.10, fading out by 0.22) multiplied by r, g, b — a
   Meshy tree's bark can come out birch-white where the species' is grey-brown (the takhian); its green leaves untouched.
   TRUNK=a,b (a tree for plantTrees, whose contract is the trunk on the origin): instead of the footprint, the centroid
   of the vertices between a and b of the height (a slab of the bole, above the root flare) goes on the origin — a crown
   that leans or spreads to one side would otherwise stand the trunk off its spot.
   FLIP=1: the model turned upside down (180 degrees about z) before anything else.
   (v25.5, the yard's cars remade: Chad, for the third time, "still very low res and looks bad")
   PAINT=k,r[,d]: the metal-roughness sheet's metal multiplied by k and its roughness raised to at least r. A generator's
   car paint comes fully metal and mirror-smooth; a metal has no colour of its own, only what it reflects, and this game's
   yard has almost no environment to reflect (v24.29), so such paint draws near black and blotched. Read mostly as
   paint (k 0.25) with a satin floor (r 0.3) it takes the sun as a car does. d: the base colour multiplied by
   1 - d x the metal it HAD. A metal's base colour is how much it reflects (silver's is near white), and read as paint
   that same number is a white car: d brings a silver back to the grey its reference picture shows.
   BLOT="x,y,z,r[;x,y,z,r...]" (the model's FINAL metres, after the turn and the sizing): every triangle that lies whole
   inside the ball is painted over on all three sheets: its colour and its metal-roughness with the median of the
   triangles in the shell just outside it (r to 1.8 r), its normals flat, and its vertices laid onto the panel round
   it. For a maker's mark the generator invented on a boot lid (no real or invented marque on a prop, v9.3).
   (v26.8, the petal bowl made again) MATTE=t,r: every texel of the metal-roughness sheet whose metal is under t (0..1)
   made a non-metal with its roughness at least r, the rest left as they are. A generator paints a bowl of gold heaped
   with petals on one sheet, the petals at metal 0.18 and roughness 0.23 (wet plastic), the gold at 0.5 to 1: PAINT
   would dull the gold with them. Absent, nothing changes.
   TWOSIDE=1: the material left double-sided (a generator's shell can have faces that only show from behind).
   SHELLS=r2[,f,lum,km]: a generator makes a car as a body and four WHEELS, each a shell of its own (nothing joins it to
   the body). A wheel is where the eye goes and it is all outline (v9.0: simplify per part, gently where the silhouette
   is the model): the shells that stand on the ground and are under a metre tall are cut to r2 of their triangles, the
   rest to the ratio. f, lum: on their part of the sheets, every texel darker than lum (0..255, the mean of its three)
   is a TYRE, its colour multiplied by f, its metal 0 and its roughness at least 0.8 (a generator paints rubber a mid
   grey, and a grey tyre reads as soft); km: the wheel's other texels (the alloy) keep PAINT's roughness floor and take
   km for their metal in place of PAINT's k, and PAINT's d leaves them alone. One primitive again at the end.
     node tools/prepmeshy.mjs <in.glb> <out.glb> <size> [axis=h] [ratio=0.1] [turnDeg=0] [px=1024] */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { weld, prune, dedup, flatten, clearNodeTransform, simplify, simplifyPrimitive, joinPrimitives, meshopt } from '@gltf-transform/functions';
import { MeshoptSimplifier, MeshoptEncoder, MeshoptDecoder } from 'meshoptimizer';
import sharp from 'sharp';
import fs from 'node:fs';

const [, , IN, OUT, SZ, AX, R, TD, PXS] = process.argv;
const SIZE = Number(SZ), AXIS = AX || 'h', RATIO = Number(R || 0.1), TURN = Number(TD || 0) * Math.PI / 180, PX = Number(PXS || 1024);
const ERR = Number(process.env.ERR || 0.002);
if (!(SIZE > 0) || !'hlw'.includes(AXIS)) throw new Error('usage: in out size [h|l|w] [ratio] [turnDeg] [px]');
await Promise.all([MeshoptEncoder.ready, MeshoptDecoder.ready, MeshoptSimplifier.ready]);
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder, 'meshopt.encoder': MeshoptEncoder });
const doc = await io.read(IN);
const root = doc.getRoot();
const before = fs.statSync(IN).size;
const tris = () => root.listMeshes().reduce((a, m) => a + m.listPrimitives().reduce((b, p) => b + (p.getIndices() ? p.getIndices().getCount() : p.getAttribute('POSITION').getCount()) / 3, 0), 0);
const t0 = tris();
for (const a of root.listAnimations()) a.dispose();
await doc.transform(prune(), flatten());
for (const node of root.listNodes()) clearNodeTransform(node);
const prims = []; for (const m of root.listMeshes()) for (const p of m.listPrimitives()) prims.push(p);
/* the turn, then the box. FLIP=1 (v25.2): turned upside down first, 180 degrees about z — Meshy read a phone lying
   face up as its back (a camera on the face that showed), and its other face is the screen */
const FL = process.env.FLIP ? -1 : 1;
const c = Math.cos(TURN), s = Math.sin(TURN);
let lo = [Infinity, Infinity, Infinity], hi = [-Infinity, -Infinity, -Infinity];
for (const p of prims) for (const sem of ['POSITION', 'NORMAL']) {
  const acc = p.getAttribute(sem); if (!acc) continue;
  const a = acc.getArray().slice();
  for (let i = 0; i < a.length; i += 3) { const x = FL * a[i], z = a[i + 2]; a[i + 1] = FL * a[i + 1]; a[i] = c * x + s * z; a[i + 2] = -s * x + c * z;
    if (sem === 'POSITION') for (let k = 0; k < 3; k++) { lo[k] = Math.min(lo[k], a[i + k]); hi[k] = Math.max(hi[k], a[i + k]); } }
  acc.setArray(a).setNormalized(false);
}
const ext = { h: hi[1] - lo[1], l: hi[2] - lo[2], w: hi[0] - lo[0] }[AXIS], k = SIZE / ext;
let cx = (lo[0] + hi[0]) / 2, cz = (lo[2] + hi[2]) / 2;
if (process.env.TRUNK) {
  /* the bole's CROSS-SECTION, not its vertices: a remeshed trunk carries a handful of vertices over long triangles, so
     the surface is sliced at five heights in the slab and each slice's perimeter centred (its segments' midpoints,
     weighted by their length) */
  const [fa, fb] = process.env.TRUNK.split(',').map(Number);
  let sx = 0, sz = 0, sw = 0, nseg = 0;
  for (let j = 0; j < 5; j++) {
    const yc = lo[1] + (fa + (fb - fa) * (j + 0.5) / 5) * (hi[1] - lo[1]);
    for (const p of prims) {
      const a = p.getAttribute('POSITION').getArray(), ix = p.getIndices() ? p.getIndices().getArray() : null, nt = (ix ? ix.length : a.length / 3) / 3;
      for (let t = 0; t < nt; t++) {
        const v = [0, 1, 2].map(q => 3 * (ix ? ix[3 * t + q] : 3 * t + q)), pts = [];
        for (let e = 0; e < 3; e++) { const A = v[e], B = v[(e + 1) % 3], ya = a[A + 1] - yc, yb = a[B + 1] - yc;
          if ((ya < 0) !== (yb < 0)) { const u = ya / (ya - yb); pts.push([a[A] + u * (a[B] - a[A]), a[A + 2] + u * (a[B + 2] - a[A + 2])]); } }
        if (pts.length !== 2) continue;
        const L = Math.hypot(pts[1][0] - pts[0][0], pts[1][1] - pts[0][1]);
        sx += (pts[0][0] + pts[1][0]) / 2 * L; sz += (pts[0][1] + pts[1][1]) / 2 * L; sw += L; nseg++;
      }
    }
  }
  if (nseg < 15) throw new Error(`TRUNK slab ${fa}..${fb} cuts only ${nseg} segments`);
  console.log(`  TRUNK: ${nseg} segments in five slices; the bole ${((sx / sw - cx) * k).toFixed(3)}, ${((sz / sw - cz) * k).toFixed(3)} m off the footprint's centre`);
  cx = sx / sw; cz = sz / sw;
}
for (const p of prims) { const acc = p.getAttribute('POSITION'), a = acc.getArray().slice();
  for (let i = 0; i < a.length; i += 3) { a[i] = (a[i] - cx) * k; a[i + 1] = (a[i + 1] - lo[1]) * k; a[i + 2] = (a[i + 2] - cz) * k; }
  acc.setArray(a); }
for (const p of prims) for (const sem of ['TANGENT', 'TEXCOORD_1', 'COLOR_0']) if (p.getAttribute(sem)) p.setAttribute(sem, null);
/* BLOT (v25.5): the triangles inside each ball and in the shell round it, as their places on the sheet (u, v 0..1, v
   down), kept for the sheets' pass below */
const BLOTS = (process.env.BLOT || '').split(';').filter(Boolean).map(s => s.split(',').map(Number));
const blotTris = BLOTS.map(() => ({ inn: [], out: [] }));
if (BLOTS.length) for (const p of prims) {
  const a = p.getAttribute('POSITION').getArray(), uvA = p.getAttribute('TEXCOORD_0'), ix = p.getIndices() ? p.getIndices().getArray() : null;
  if (!uvA) throw new Error('BLOT needs TEXCOORD_0');
  const uv = uvA.getArray(), nt = (ix ? ix.length : a.length / 3) / 3, un = uvA.getNormalized() ? 1 / (uv.BYTES_PER_ELEMENT === 1 ? 255 : 65535) : 1;
  for (let t = 0; t < nt; t++) {
    const v = [0, 1, 2].map(q => (ix ? ix[3 * t + q] : 3 * t + q));
    BLOTS.forEach(([bx, by, bz, br], bi) => {
      const d = v.map(i => Math.hypot(a[3 * i] - bx, a[3 * i + 1] - by, a[3 * i + 2] - bz));
      const tri = v.map(i => [uv[2 * i] * un, uv[2 * i + 1] * un]);
      if (Math.max(...d) <= br) blotTris[bi].inn.push(tri);
      else if (Math.min(...d) > br && Math.max(...d) <= br * 1.8) blotTris[bi].out.push(tri);
    });
  }
}
BLOTS.forEach((b, i) => console.log(`  BLOT ${b.join(',')}: ${blotTris[i].inn.length} triangles inside, ${blotTris[i].out.length} in the shell round it`));
/* ... and the BOSS itself goes (photographed: painted over, a maker's roundel was still a raised ring on the boot lid):
   the surface round the ball (the shell's vertices) is fitted with a plane, along whichever axis the panel faces most,
   and every vertex inside the ball is laid onto it with the plane's normal, eased in over the ball's outer fifth so
   nothing steps at its edge. Done before the weld: every copy of a vertex moves alike */
if (BLOTS.length) for (const p of prims) {
  const acc = p.getAttribute('POSITION'), a = acc.getArray().slice(), nAcc = p.getAttribute('NORMAL'), nn = nAcc ? nAcc.getArray().slice() : null;
  BLOTS.forEach(([bx, by, bz, br], bi) => {
    const inn = [], sh = [];
    for (let i = 0; i < a.length; i += 3) { const d = Math.hypot(a[i] - bx, a[i + 1] - by, a[i + 2] - bz); if (d <= br) inn.push([i, d]); else if (d <= br * 1.8) sh.push(i); }
    if (inn.length < 3 || sh.length < 6) return;
    /* the panel's facing: the mean of the shell's own normals if the file has them, else z */
    const m = [0, 0, 0]; if (nn) for (const i of sh) { m[0] += nn[i]; m[1] += nn[i + 1]; m[2] += nn[i + 2]; } else m[2] = 1;
    const ax = Math.abs(m[0]) > Math.abs(m[1]) && Math.abs(m[0]) > Math.abs(m[2]) ? 0 : Math.abs(m[1]) > Math.abs(m[2]) ? 1 : 2, u = (ax + 1) % 3, v = (ax + 2) % 3;
    /* least squares: a[ax] = A a[u] + B a[v] + C over the shell (about the ball's centre, for the arithmetic's sake) */
    const c0 = [bx, by, bz]; let Suu = 0, Suv = 0, Svv = 0, Su = 0, Sv = 0, Suw = 0, Svw = 0, Sw = 0; const N = sh.length;
    for (const i of sh) { const U = a[i + u] - c0[u], V = a[i + v] - c0[v], W = a[i + ax] - c0[ax]; Suu += U * U; Suv += U * V; Svv += V * V; Su += U; Sv += V; Suw += U * W; Svw += V * W; Sw += W; }
    const M3 = [[Suu, Suv, Su], [Suv, Svv, Sv], [Su, Sv, N]], R3 = [Suw, Svw, Sw];
    const det = (q) => q[0][0] * (q[1][1] * q[2][2] - q[1][2] * q[2][1]) - q[0][1] * (q[1][0] * q[2][2] - q[1][2] * q[2][0]) + q[0][2] * (q[1][0] * q[2][1] - q[1][1] * q[2][0]);
    const D = det(M3); if (Math.abs(D) < 1e-18) return;
    const sol = [0, 1, 2].map(k => det(M3.map((row, r) => row.map((x, cidx) => (cidx === k ? R3[r] : x)))) / D);
    const pn = [0, 0, 0]; pn[ax] = 1; pn[u] = -sol[0]; pn[v] = -sol[1]; const sgn = Math.sign(m[ax]) || 1, pl = Math.hypot(...pn); for (let k = 0; k < 3; k++) pn[k] *= sgn / pl;
    let mx = 0;
    for (const [i, d] of inn) { const w = Math.min(1, Math.max(0, (br - d) / (br * 0.2))), ws = w * w * (3 - 2 * w);
      const fit = c0[ax] + sol[0] * (a[i + u] - c0[u]) + sol[1] * (a[i + v] - c0[v]) + sol[2]; mx = Math.max(mx, Math.abs(fit - a[i + ax]) * ws);
      a[i + ax] += (fit - a[i + ax]) * ws;
      if (nn) { for (let k = 0; k < 3; k++) nn[i + k] += (pn[k] - nn[i + k]) * ws; const l = Math.hypot(nn[i], nn[i + 1], nn[i + 2]) || 1; for (let k = 0; k < 3; k++) nn[i + k] /= l; } }
    console.log(`  BLOT ${bi}: ${inn.length} vertices laid onto the panel (facing ${'xyz'[ax]}, fitted to ${N} round it); the boss stood up to ${(mx * 1000).toFixed(1)} mm`);
  });
  acc.setArray(a); if (nn) nAcc.setArray(nn);
}
/* a triangle's texels on a W x H sheet, each handed to fn(x, y) (its box walked, the texel centres inside it kept; a
   one-texel margin so neighbours meet) */
function texels(tri, W, H, fn) {
  const P = tri.map(([u, v]) => [(u - Math.floor(u)) * W, (v - Math.floor(v)) * H]);
  const x0 = Math.max(0, Math.floor(Math.min(P[0][0], P[1][0], P[2][0])) - 1), x1 = Math.min(W - 1, Math.ceil(Math.max(P[0][0], P[1][0], P[2][0])) + 1);
  const y0 = Math.max(0, Math.floor(Math.min(P[0][1], P[1][1], P[2][1])) - 1), y1 = Math.min(H - 1, Math.ceil(Math.max(P[0][1], P[1][1], P[2][1])) + 1);
  const den = (P[1][1] - P[2][1]) * (P[0][0] - P[2][0]) + (P[2][0] - P[1][0]) * (P[0][1] - P[2][1]); if (Math.abs(den) < 1e-12) return;
  const m = 1.2 / Math.sqrt(Math.abs(den));                              // (about a texel, in barycentric measure)
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
    const px = x + 0.5, py = y + 0.5;
    const l0 = ((P[1][1] - P[2][1]) * (px - P[2][0]) + (P[2][0] - P[1][0]) * (py - P[2][1])) / den;
    const l1 = ((P[2][1] - P[0][1]) * (px - P[2][0]) + (P[0][0] - P[2][0]) * (py - P[2][1])) / den;
    if (l0 >= -m && l1 >= -m && 1 - l0 - l1 >= -m) fn(x, y);
  }
}
/* DEFLAT=1 — Meshy's full-detail file carries a normal per triangle corner (the v8.0 law: an attribute seam on every
   edge, so nothing simplifies): the normals go before the weld and are rebuilt smooth, by hand, after the simplify
   (area-weighted over the faces round each welded vertex; gltf-transform's normals() would unweld them again) */
if (process.env.DEFLAT) for (const p of prims) p.setAttribute('NORMAL', null);
await doc.transform(weld(), dedup(), prune());
/* SHELLS (v25.5): what touches is a shell (welded by place alone: a seam on the sheet splits a vertex in two); the
   wheels' triangles go to a primitive of their own, and their places on the sheet are kept for the sheets' pass */
const SH = process.env.SHELLS ? process.env.SHELLS.split(',').map(Number) : null;
const shellTris = [];
if (SH) for (const m of root.listMeshes()) for (const p of m.listPrimitives().slice()) {
  const a = p.getAttribute('POSITION').getArray(), ix = p.getIndices().getArray(), n = a.length / 3;
  const uvA = p.getAttribute('TEXCOORD_0'), uv = uvA.getArray(), un = uvA.getNormalized() ? 1 / (uv.BYTES_PER_ELEMENT === 1 ? 255 : 65535) : 1;
  const key = new Map(), id = new Uint32Array(n); let nu = 0;
  for (let i = 0; i < n; i++) { const kk = Math.round(a[3 * i] * 2e4) + ',' + Math.round(a[3 * i + 1] * 2e4) + ',' + Math.round(a[3 * i + 2] * 2e4); let v = key.get(kk); if (v === undefined) { v = nu++; key.set(kk, v); } id[i] = v; }
  const par = new Uint32Array(nu); for (let i = 0; i < nu; i++) par[i] = i;
  const find = (q) => { while (par[q] !== q) { par[q] = par[par[q]]; q = par[q]; } return q; };
  for (let t = 0; t < ix.length; t += 3) { const r0 = find(id[ix[t]]), r1 = find(id[ix[t + 1]]), r2 = find(id[ix[t + 2]]); par[r1] = r0; par[r2] = r0; }
  const sh = new Map();
  for (let t = 0; t < ix.length; t += 3) { const r = find(id[ix[t]]); let c = sh.get(r); if (!c) { c = { n: 0, lo: Infinity, hi: -Infinity }; sh.set(r, c); } c.n++;
    for (let q = 0; q < 3; q++) { const y = a[3 * ix[t + q] + 1]; if (y < c.lo) c.lo = y; if (y > c.hi) c.hi = y; } }
  let big = null; for (const c of sh.values()) if (!big || c.n > big.n) big = c;
  for (const c of sh.values()) c.wheel = c !== big && c.n >= 500 && c.lo < 0.03 && c.hi < 1.0;
  const body = [], small = [];
  for (let t = 0; t < ix.length; t += 3) { const w = sh.get(find(id[ix[t]])).wheel; (w ? small : body).push(ix[t], ix[t + 1], ix[t + 2]);
    if (w) shellTris.push([0, 1, 2].map(q => [uv[2 * ix[t + q]] * un, uv[2 * ix[t + q] + 1] * un])); }
  console.log(`  SHELLS: ${sh.size} shells, the biggest ${big.n} triangles; the wheels ${[...sh.values()].filter(c => c.wheel).map(c => `${c.n} (y ${c.lo.toFixed(2)}..${c.hi.toFixed(2)})`).join(', ') || 'none'}; left with the body ${[...sh.values()].filter(c => !c.wheel && c !== big).reduce((s, c) => s + c.n, 0)} triangles in ${[...sh.values()].filter(c => !c.wheel && c !== big).length} more`);
  if (!small.length) continue;
  const q = p.clone();
  p.setIndices(doc.createAccessor().setType('SCALAR').setArray(new Uint32Array(body)).setBuffer(root.listBuffers()[0]));
  q.setIndices(doc.createAccessor().setType('SCALAR').setArray(new Uint32Array(small)).setBuffer(root.listBuffers()[0]));
  q.setExtras({ small: true }); m.addPrimitive(q);
}
if (RATIO < 1 && SH) {
  for (const m of root.listMeshes()) for (const p of m.listPrimitives()) simplifyPrimitive(p, { simplifier: MeshoptSimplifier, ratio: p.getExtras().small ? SH[0] : RATIO, error: ERR });
  await doc.transform(prune());
} else if (RATIO < 1) await doc.transform(simplify({ simplifier: MeshoptSimplifier, ratio: RATIO, error: ERR }), prune());
if (RATIO < 1) {      // a simplify can take the lowest vertex: back down onto y 0
  let y0 = Infinity; for (const m of root.listMeshes()) for (const p of m.listPrimitives()) { const a = p.getAttribute('POSITION').getArray(); for (let i = 1; i < a.length; i += 3) y0 = Math.min(y0, a[i]); }
  for (const m of root.listMeshes()) for (const p of m.listPrimitives()) { const acc = p.getAttribute('POSITION'), a = acc.getArray().slice(); for (let i = 1; i < a.length; i += 3) a[i] -= y0; acc.setArray(a); }
}
if (process.env.DEFLAT) for (const m of root.listMeshes()) for (const p of m.listPrimitives()) {
  const a = p.getAttribute('POSITION').getArray(), ix = p.getIndices().getArray(), N = new Float32Array(a.length);
  for (let t = 0; t < ix.length; t += 3) {
    const [i0, i1, i2] = [ix[t] * 3, ix[t + 1] * 3, ix[t + 2] * 3];
    const ux = a[i1] - a[i0], uy = a[i1 + 1] - a[i0 + 1], uz = a[i1 + 2] - a[i0 + 2], vx = a[i2] - a[i0], vy = a[i2 + 1] - a[i0 + 1], vz = a[i2 + 2] - a[i0 + 2];
    const nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
    for (const i of [i0, i1, i2]) { N[i] += nx; N[i + 1] += ny; N[i + 2] += nz; }
  }
  /* DEFLAT=2 (v25.5): the normal SHARED ACROSS THE SHEET'S SEAMS (v16.8's law). A seam on the sheet splits a vertex in
     two at one place, and each twin's normal above is its own side's faces alone: a crease along every seam. A
     generator's sheet is thousands of small islands, so its car came out faceted like a cut stone. The twins' sums
     are added by place and each takes the total (its own kept where the total cancels: two faces back to back) */
  if (process.env.DEFLAT === '2') {
    const sum = new Map(), kOf = (i) => Math.round(a[i] * 2e4) + ',' + Math.round(a[i + 1] * 2e4) + ',' + Math.round(a[i + 2] * 2e4);
    for (let i = 0; i < N.length; i += 3) { const kk = kOf(i); let s = sum.get(kk); if (!s) { s = [0, 0, 0, 0]; sum.set(kk, s); } s[0] += N[i]; s[1] += N[i + 1]; s[2] += N[i + 2]; s[3]++; }
    let twins = 0;
    for (let i = 0; i < N.length; i += 3) { const s = sum.get(kOf(i)); if (s[3] < 2) continue; const own = Math.hypot(N[i], N[i + 1], N[i + 2]), tot = Math.hypot(s[0], s[1], s[2]);
      if (tot > own * 0.05) { N[i] = s[0]; N[i + 1] = s[1]; N[i + 2] = s[2]; twins++; } }
    console.log(`  DEFLAT=2: ${twins} of ${N.length / 3} vertices share their normal across a seam`);
  }
  for (let i = 0; i < N.length; i += 3) { const l = Math.hypot(N[i], N[i + 1], N[i + 2]) || 1; N[i] /= l; N[i + 1] /= l; N[i + 2] /= l; }
  p.setAttribute('NORMAL', doc.createAccessor().setType('VEC3').setArray(N).setBuffer(root.listBuffers()[0]));
}
/* the sheets: every one kept, as JPEG */
/* (v26.0) NONORMAL=1: the normal sheet is not kept (a small thing among dozens on a table, never seen from a hand's
   length: its colour carries it). Unset, every sheet is kept as before */
if (process.env.NONORMAL) for (const m of root.listMaterials()) m.setNormalTexture(null);
let shellMask = null, maskW = 0, maskH = 0;
for (const m of root.listMaterials()) {
  for (const [tx, q] of [[m.getBaseColorTexture(), 88], [m.getMetallicRoughnessTexture(), 88], [m.getNormalTexture(), 92]]) {
    if (!tx || !tx.getImage() || tx.__done) continue;
    let src = sharp(Buffer.from(tx.getImage()));
    if (process.env.TINTGREY && tx === m.getBaseColorTexture()) {
      const T = process.env.TINTGREY.split(',').map(Number);
      const { data, info } = await src.removeAlpha().raw().toBuffer({ resolveWithObject: true });
      let n = 0;
      for (let i = 0; i < data.length; i += 3) {
        const mx = Math.max(data[i], data[i + 1], data[i + 2]), mn = Math.min(data[i], data[i + 1], data[i + 2]);
        const sat = mx > 0 ? (mx - mn) / mx : 0, w = Math.min(1, Math.max(0, (0.22 - sat) / 0.12));
        if (w > 0) { n++; for (let k = 0; k < 3; k++) data[i + k] = Math.round(data[i + k] * (1 - w + w * T[k])); }
      }
      console.log(`  TINTGREY: ${(n / (data.length / 3) * 100).toFixed(1)} % of the base colour's texels`);
      src = sharp(data, { raw: { width: info.width, height: info.height, channels: 3 } });
    }
    /* (v25.5) BLOT and PAINT, on the sheet at its own size, before it is shrunk */
    const PAINTV = process.env.PAINT ? process.env.PAINT.split(',').map(Number) : null;
    const MATTEV = process.env.MATTE ? process.env.MATTE.split(',').map(Number) : null;
    const mrT = m.getMetallicRoughnessTexture(), darken = !!(PAINTV && PAINTV[2] > 0 && mrT && tx === m.getBaseColorTexture());
    const tyres = !!(SH && SH[1] > 0 && shellTris.length), isC = tx === m.getBaseColorTexture();
    if (BLOTS.length || darken || (PAINTV && tx === mrT) || (MATTEV && tx === mrT) || (tyres && (isC || tx === mrT))) {
      const { data, info } = await src.removeAlpha().raw().toBuffer({ resolveWithObject: true });
      const W = info.width, H = info.height, isN = tx === m.getNormalTexture();
      if (tyres && isC) {
        /* the wheels' texels, told apart by the colour they came with: 2 a tyre, 1 the rest of a wheel (the colour
           sheet is the first of the three in this loop, so the mask is ready for the metal sheet) */
        const L = SH[2] || 140, hist = new Array(8).fill(0); let nd = 0, nb = 0;
        shellMask = new Uint8Array(W * H); maskW = W; maskH = H;
        for (const tri of shellTris) texels(tri, W, H, (x, y) => { const j = y * W + x; if (shellMask[j]) return; const i = j * 3, lum = (data[i] + data[i + 1] + data[i + 2]) / 3;
          hist[Math.min(7, lum >> 5)]++; if (lum < L) { shellMask[j] = 2; nd++; } else { shellMask[j] = 1; nb++; } });
        for (let j = 0; j < shellMask.length; j++) if (shellMask[j] === 2) { const i = j * 3; data[i] = Math.round(data[i] * SH[1]); data[i + 1] = Math.round(data[i + 1] * SH[1]); data[i + 2] = Math.round(data[i + 2] * SH[1]); }
        console.log(`  SHELLS: the wheels' texels by brightness (eight bands of 32): ${hist.join(' ')}; ${nd} under ${L} are tyre (x ${SH[1]}), ${nb} are not`);
      }
      if (shellMask && (W !== maskW || H !== maskH) && !isN) throw new Error(`SHELLS: this sheet is ${W}x${H} and the colour sheet was ${maskW}x${maskH}`);
      if (darken) {
        /* before the blots, so a blot's fill is the darkened paint round it. The metal sheet is still the file's own
           here (the colour sheet is the first of the three in this loop) */
        if (mrT.__done) throw new Error('PAINT d: the metal sheet was re-encoded before the colour sheet read it');
        const mr = await sharp(Buffer.from(mrT.getImage())).removeAlpha().resize(W, H, { fit: 'fill' }).raw().toBuffer();
        let n = 0;
        for (let i = 0, j = 0; i < data.length; i += 3, j++) { if (shellMask && shellMask[j]) continue; const f = 1 - PAINTV[2] * mr[i + 2] / 255; if (f < 0.995) n++;
          data[i] = Math.round(data[i] * f); data[i + 1] = Math.round(data[i + 1] * f); data[i + 2] = Math.round(data[i + 2] * f); }
        console.log(`  PAINT: the base colour x (1 - ${PAINTV[2]} x its metal): ${(n / (data.length / 3) * 100).toFixed(1)} % of its texels`);
      }
      blotTris.forEach((B, bi) => {
        if (!B.inn.length) return;
        let fill = [128, 128, 255];
        if (!isN) { const ch = [[], [], []]; for (const tri of B.out) texels(tri, W, H, (x, y) => { const i = (y * W + x) * 3; for (let k = 0; k < 3; k++) ch[k].push(data[i + k]); });
          if (!ch[0].length) throw new Error(`BLOT ${bi}: nothing in the shell to take the paint from`);
          fill = ch.map(c => { c.sort((p, q) => p - q); return c[c.length >> 1]; }); }
        let n = 0; for (const tri of B.inn) texels(tri, W, H, (x, y) => { const i = (y * W + x) * 3; data[i] = fill[0]; data[i + 1] = fill[1]; data[i + 2] = fill[2]; n++; });
        console.log(`  BLOT ${bi} on the ${isN ? 'normal' : tx === m.getBaseColorTexture() ? 'colour' : 'metal-roughness'} sheet: ${n} texels to ${fill.join(',')}`);
      });
      if (tx === mrT && (PAINTV || shellMask)) {
        const [mk, rmin] = PAINTV || [1, 0], r0 = Math.round(rmin * 255), km = SH && SH[3] !== undefined ? SH[3] : mk;
        for (let i = 0, j = 0; i < data.length; i += 3, j++) {
          const w = shellMask ? shellMask[j] : 0;
          if (w === 2) { data[i + 2] = 0; if (data[i + 1] < 204) data[i + 1] = 204; continue; }
          if (data[i + 1] < r0) data[i + 1] = r0; data[i + 2] = Math.round(data[i + 2] * (w === 1 ? km : mk));
        }
        if (PAINTV) console.log(`  PAINT: the metal x ${mk}${shellMask ? ` (the wheels' alloy x ${km})` : ''}, the roughness at least ${rmin}`);
      }
      if (tx === mrT && MATTEV) { const t0 = Math.round(MATTEV[0] * 255), r0 = Math.round(MATTEV[1] * 255); let n = 0;
        for (let i = 0; i < data.length; i += 3) if (data[i + 2] < t0) { data[i + 2] = 0; if (data[i + 1] < r0) data[i + 1] = r0; n++; }
        console.log(`  MATTE: ${(n / (data.length / 3) * 100).toFixed(1)} % of the texels (metal under ${MATTEV[0]}) made non-metal, the roughness at least ${MATTEV[1]}`); }
      src = sharp(data, { raw: { width: W, height: H, channels: 3 } });
    }
    /* (v24.26) PXMR: the metal-roughness sheet's own size (default PX). The cars at 2048 (Chad: "Why are the cars ... so
       low res and compressed"): halving their base colour blurs the lamps and halving their normal crumples the hood and
       the glass, while the metal-roughness at 1024 is identical on screen (each map shrunk alone, photographed) */
    /* (v26.0) PXN: the normal sheet's own size (default PX), for a thing whose colour is seen close and whose surface
       is not (episode 4 chapter 3's table stock: a sheet with its mipmaps is a third as much again of GPU memory, and a
       ground of sixty things cannot hold three full sheets each on a phone). Unset, nothing changes */
    const px = process.env.PXMR && tx === m.getMetallicRoughnessTexture() ? Number(process.env.PXMR)
             : process.env.PXN && tx === m.getNormalTexture() ? Number(process.env.PXN) : PX;
    const out = await src.resize(px, px, { fit: 'inside', withoutEnlargement: true }).jpeg({ quality: q }).toBuffer();
    tx.setImage(out).setMimeType('image/jpeg').setURI(''); tx.__done = true;
  }
  m.setOcclusionTexture(null); m.setAlphaMode('OPAQUE').setDoubleSided(!!process.env.TWOSIDE);
}
/* the contract, asserted before the pack */
{ let L = [Infinity, Infinity, Infinity], H = [-Infinity, -Infinity, -Infinity];
  for (const m of root.listMeshes()) for (const p of m.listPrimitives()) { const a = p.getAttribute('POSITION').getArray(); for (let i = 0; i < a.length; i += 3) for (let j = 0; j < 3; j++) { L[j] = Math.min(L[j], a[i + j]); H[j] = Math.max(H[j], a[i + j]); } }
  if (Math.abs(L[1]) > 1e-3) throw new Error('not on y = 0: ' + L[1]);
  const got = { h: H[1] - L[1], l: H[2] - L[2], w: H[0] - L[0] }[AXIS];
  if (Math.abs(got - SIZE) > SIZE * 0.02) throw new Error(`the ${AXIS} came out ${got.toFixed(3)} against ${SIZE}`);
  console.log(`  CONTRACT: w ${(H[0] - L[0]).toFixed(3)}  h ${(H[1] - L[1]).toFixed(3)}  l ${(H[2] - L[2]).toFixed(3)} m (x ${L[0].toFixed(3)}..${H[0].toFixed(3)}, z ${L[2].toFixed(3)}..${H[2].toFixed(3)})`); }
if (SH) { for (const m of root.listMeshes()) { const ps = m.listPrimitives(); if (ps.length > 1) { const j = joinPrimitives(ps); for (const p of ps) { m.removePrimitive(p); p.dispose(); } m.addPrimitive(j); } }
  await doc.transform(prune()); }
await doc.transform(meshopt({ encoder: MeshoptEncoder, level: 'medium' }));
await io.write(OUT, doc);
console.log(`prepmeshy ${OUT.split('/').pop()}: ${t0} -> ${tris()} triangles; ${(before / 1048576).toFixed(1)} MB -> ${(fs.statSync(OUT).size / 1024).toFixed(0)} KB`);
