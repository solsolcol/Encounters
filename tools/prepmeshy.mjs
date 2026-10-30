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
     node tools/prepmeshy.mjs <in.glb> <out.glb> <size> [axis=h] [ratio=0.1] [turnDeg=0] [px=1024] */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { weld, prune, dedup, flatten, clearNodeTransform, simplify, meshopt } from '@gltf-transform/functions';
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
/* the turn, then the box */
const c = Math.cos(TURN), s = Math.sin(TURN);
let lo = [Infinity, Infinity, Infinity], hi = [-Infinity, -Infinity, -Infinity];
for (const p of prims) for (const sem of ['POSITION', 'NORMAL']) {
  const acc = p.getAttribute(sem); if (!acc) continue;
  const a = acc.getArray().slice();
  for (let i = 0; i < a.length; i += 3) { const x = a[i], z = a[i + 2]; a[i] = c * x + s * z; a[i + 2] = -s * x + c * z;
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
/* DEFLAT=1 — Meshy's full-detail file carries a normal per triangle corner (the v8.0 law: an attribute seam on every
   edge, so nothing simplifies): the normals go before the weld and are rebuilt smooth, by hand, after the simplify
   (area-weighted over the faces round each welded vertex; gltf-transform's normals() would unweld them again) */
if (process.env.DEFLAT) for (const p of prims) p.setAttribute('NORMAL', null);
await doc.transform(weld(), dedup(), prune());
if (RATIO < 1) await doc.transform(simplify({ simplifier: MeshoptSimplifier, ratio: RATIO, error: ERR }), prune());
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
  for (let i = 0; i < N.length; i += 3) { const l = Math.hypot(N[i], N[i + 1], N[i + 2]) || 1; N[i] /= l; N[i + 1] /= l; N[i + 2] /= l; }
  p.setAttribute('NORMAL', doc.createAccessor().setType('VEC3').setArray(N).setBuffer(root.listBuffers()[0]));
}
/* the sheets: every one kept, as JPEG */
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
    const out = await src.resize(PX, PX, { fit: 'inside', withoutEnlargement: true }).jpeg({ quality: q }).toBuffer();
    tx.setImage(out).setMimeType('image/jpeg').setURI(''); tx.__done = true;
  }
  m.setOcclusionTexture(null); m.setAlphaMode('OPAQUE').setDoubleSided(false);
}
/* the contract, asserted before the pack */
{ let L = [Infinity, Infinity, Infinity], H = [-Infinity, -Infinity, -Infinity];
  for (const m of root.listMeshes()) for (const p of m.listPrimitives()) { const a = p.getAttribute('POSITION').getArray(); for (let i = 0; i < a.length; i += 3) for (let j = 0; j < 3; j++) { L[j] = Math.min(L[j], a[i + j]); H[j] = Math.max(H[j], a[i + j]); } }
  if (Math.abs(L[1]) > 1e-3) throw new Error('not on y = 0: ' + L[1]);
  const got = { h: H[1] - L[1], l: H[2] - L[2], w: H[0] - L[0] }[AXIS];
  if (Math.abs(got - SIZE) > SIZE * 0.02) throw new Error(`the ${AXIS} came out ${got.toFixed(3)} against ${SIZE}`);
  console.log(`  CONTRACT: w ${(H[0] - L[0]).toFixed(3)}  h ${(H[1] - L[1]).toFixed(3)}  l ${(H[2] - L[2]).toFixed(3)} m (x ${L[0].toFixed(3)}..${H[0].toFixed(3)}, z ${L[2].toFixed(3)}..${H[2].toFixed(3)})`); }
await doc.transform(meshopt({ encoder: MeshoptEncoder, level: 'medium' }));
await io.write(OUT, doc);
console.log(`prepmeshy ${OUT.split('/').pop()}: ${t0} -> ${tris()} triangles; ${(before / 1048576).toFixed(1)} MB -> ${(fs.statSync(OUT).size / 1024).toFixed(0)} KB`);
