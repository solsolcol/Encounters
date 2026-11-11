/* v26.0 · A LIGHTER BODY ON THE SAME RIG (episode 4 chapter 3's people; masters/v26.0/make.sh §3).

   A generated person is 310,000 triangles on a sheet of thousands of small islands, and it cannot be thinned here: the
   strict simplifier stalls on the islands (asked for 31,000 triangles, Hermit A came back with 128,000) and the permissive
   one cuts across them (his face came back a mosaic of shards wearing his hair's colour: photographed, both). The
   generator can: Meshy's REMESH builds the same surface again at the triangle count asked for and lays the paint on a new
   sheet. What its remesh does not keep is the RIG. This lays the rig on it:

     1. the rigged body is put in its rest pose (it must be its bind pose: the tool stops if it is not);
     2. the remeshed body is brought onto it: one size and one place (the two are the same surface, so their boxes agree;
        the fit is CHECKED by how far each remeshed point lies from the rigged surface's points, and the tool stops over
        MAXOFF);
     3. every remeshed point takes the joints and weights of the rigged points round it (those within reach whose surface
        faces the same way, by distance), cut to its four strongest;
     4. written: the RIGGED file's own skeleton, skin and inverse bind matrices, untouched (so every take made for the rig
        plays on it, and a lighter level can be bound to the fuller level's bones by name), with the remeshed surface and
        the remeshed sheets in place of the old.

     node tools/riglod.mjs rigged.glb remeshed.glb out.glb      (env: MAXOFF metres, default 0.012; REACH, default 0.02)

   The remesh's sheets arrive as 4096 PNGs (80 MB a body). The file this writes is the SOURCE kept beside the rig (Meshy
   keeps a job three days), so its sheets are stored at their own size as pictures a tenth the weight: the colour a JPEG
   at quality 95 with full chroma, the normal sheet a WebP at quality 95; the metal sheet is not carried (a person here is
   cloth and skin: prepmonk sets roughness 0.78 and no metal). RAWSHEETS=1 keeps the three as they came.

   The weights are still the auto-rig's blocks: tools/prepmonk.mjs diffuses them (WSMOOTH), as it does for every rig. */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { prune, dequantize } from '@gltf-transform/functions';
import { MeshoptDecoder, MeshoptEncoder } from 'meshoptimizer';
import { Matrix4, Vector3, Quaternion } from 'three';
import sharp from 'sharp';
import fs from 'node:fs';
const [RIG, REM, OUT] = process.argv.slice(2);
if (!OUT) throw new Error('usage: riglod.mjs rigged.glb remeshed.glb out.glb');
const MAXOFF = +(process.env.MAXOFF || 0.012), REACH = +(process.env.REACH || 0.02);
await Promise.all([MeshoptDecoder.ready, MeshoptEncoder.ready]);
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder, 'meshopt.encoder': MeshoptEncoder });
const worldOf = (root) => {            // every node's world matrix at rest
  const nodes = root.listNodes(), W = new Map(), par = new Map();
  for (const n of nodes) for (const c of n.listChildren()) par.set(c, n);
  const get = (n) => { let m = W.get(n); if (m) return m; m = new Matrix4().compose(new Vector3(...n.getTranslation()), new Quaternion(...n.getRotation()), new Vector3(...n.getScale()));
    const p = par.get(n); if (p) m = new Matrix4().multiplyMatrices(get(p), m); W.set(n, m); return m; };
  for (const n of nodes) get(n); return W;
};

/* ---- the rigged body at rest ---- */
const rig = await io.read(RIG); await rig.transform(dequantize());
const rroot = rig.getRoot(), skin = rroot.listSkins()[0], joints = skin.listJoints(), IBM = skin.getInverseBindMatrices().getArray();
const rW = worldOf(rroot);
const rprims = []; for (const m of rroot.listMeshes()) for (const p of m.listPrimitives()) if (p.getAttribute('JOINTS_0')) rprims.push(p);
if (rprims.length !== 1) throw new Error(`expects one skinned primitive in the rigged file (found ${rprims.length})`);
const rp = rprims[0];
const M0 = new Matrix4().multiplyMatrices(rW.get(joints[0]), new Matrix4().fromArray(IBM, 0)); let bindErr = 0;
for (let k = 1; k < joints.length; k++) { const m = new Matrix4().multiplyMatrices(rW.get(joints[k]), new Matrix4().fromArray(IBM, k * 16));
  for (let e = 0; e < 16; e++) bindErr = Math.max(bindErr, Math.abs(m.elements[e] - M0.elements[e])); }
if (bindErr > 1e-3) throw new Error(`the rigged file does not rest in its bind pose (joint matrices differ by ${bindErr.toExponential(2)})`);
const rP = rp.getAttribute('POSITION'), rN = rp.getAttribute('NORMAL'), rJ = rp.getAttribute('JOINTS_0'), rWt = rp.getAttribute('WEIGHTS_0');
const NR = rP.getCount(), X = new Float32Array(NR * 3), XN = new Float32Array(NR * 3), v = new Vector3(), a3 = [0, 0, 0];
const M0n = new Matrix4().copy(M0).invert().transpose();
for (let i = 0; i < NR; i++) { rP.getElement(i, a3); v.set(a3[0], a3[1], a3[2]).applyMatrix4(M0); X[3 * i] = v.x; X[3 * i + 1] = v.y; X[3 * i + 2] = v.z;
  rN.getElement(i, a3); v.set(a3[0], a3[1], a3[2]).transformDirection(M0n); XN[3 * i] = v.x; XN[3 * i + 1] = v.y; XN[3 * i + 2] = v.z; }
const box = (A, n) => { const lo = [1e9, 1e9, 1e9], hi = [-1e9, -1e9, -1e9]; for (let i = 0; i < n; i++) for (let k = 0; k < 3; k++) { const x = A[3 * i + k]; if (x < lo[k]) lo[k] = x; if (x > hi[k]) hi[k] = x; } return [lo, hi]; };
const [rlo, rhi] = box(X, NR);

/* ---- the remeshed body, in its own world ---- */
const rem = await io.read(REM); await rem.transform(dequantize());
const mroot = rem.getRoot(), mW = worldOf(mroot);
const parts = [];
for (const n of mroot.listNodes()) { const mesh = n.getMesh(); if (!mesh) continue; for (const p of mesh.listPrimitives()) parts.push([n, p]); }
if (parts.length !== 1) throw new Error(`expects one primitive in the remeshed file (found ${parts.length})`);
const [mn, mp] = parts[0], mP = mp.getAttribute('POSITION'), mN = mp.getAttribute('NORMAL'), mUV = mp.getAttribute('TEXCOORD_0');
if (!mUV) throw new Error('the remeshed file has no sheet coordinates');
const NM = mP.getCount(), Y = new Float32Array(NM * 3), YN = new Float32Array(NM * 3), mWm = mW.get(mn), mWn = new Matrix4().copy(mWm).invert().transpose();
for (let i = 0; i < NM; i++) { mP.getElement(i, a3); v.set(a3[0], a3[1], a3[2]).applyMatrix4(mWm); Y[3 * i] = v.x; Y[3 * i + 1] = v.y; Y[3 * i + 2] = v.z;
  if (mN) { mN.getElement(i, a3); v.set(a3[0], a3[1], a3[2]).transformDirection(mWn); YN[3 * i] = v.x; YN[3 * i + 1] = v.y; YN[3 * i + 2] = v.z; } }
const mI = mp.getIndices() ? Uint32Array.from(mp.getIndices().getArray()) : Uint32Array.from({ length: NM }, (_, i) => i);
if (!mN) {   // no normals given: each point's, from its faces (by position, so a seam's two sides agree)
  const key = i => `${Math.round(Y[3 * i] * 1e5)},${Math.round(Y[3 * i + 1] * 1e5)},${Math.round(Y[3 * i + 2] * 1e5)}`, g = new Map(), gid = new Int32Array(NM);
  for (let i = 0; i < NM; i++) { const k = key(i); let q = g.get(k); if (q === undefined) g.set(k, q = g.size); gid[i] = q; }
  const GN = new Float64Array(g.size * 3);
  for (let t = 0; t < mI.length; t += 3) { const a = mI[t], b = mI[t + 1], c = mI[t + 2];
    const ux = Y[3 * b] - Y[3 * a], uy = Y[3 * b + 1] - Y[3 * a + 1], uz = Y[3 * b + 2] - Y[3 * a + 2], vx = Y[3 * c] - Y[3 * a], vy = Y[3 * c + 1] - Y[3 * a + 1], vz = Y[3 * c + 2] - Y[3 * a + 2];
    const nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx; for (const i of [a, b, c]) { GN[3 * gid[i]] += nx; GN[3 * gid[i] + 1] += ny; GN[3 * gid[i] + 2] += nz; } }
  for (let i = 0; i < NM; i++) { const q = gid[i], L = Math.hypot(GN[3 * q], GN[3 * q + 1], GN[3 * q + 2]) || 1; YN[3 * i] = GN[3 * q] / L; YN[3 * i + 1] = GN[3 * q + 1] / L; YN[3 * i + 2] = GN[3 * q + 2] / L; }
}

/* ---- the rigged points in a grid, for "who is near" ---- */
const CELL = 0.015, gk = (x, y, z) => `${Math.floor(x / CELL)},${Math.floor(y / CELL)},${Math.floor(z / CELL)}`, grid = new Map();
for (let i = 0; i < NR; i++) { const k = gk(X[3 * i], X[3 * i + 1], X[3 * i + 2]); let c = grid.get(k); if (!c) grid.set(k, c = []); c.push(i); }
const near = (x, y, z, r, out) => { out.length = 0; const R = Math.ceil(r / CELL), cx = Math.floor(x / CELL), cy = Math.floor(y / CELL), cz = Math.floor(z / CELL), r2 = r * r;
  for (let dx = -R; dx <= R; dx++) for (let dy = -R; dy <= R; dy++) for (let dz = -R; dz <= R; dz++) { const c = grid.get(`${cx + dx},${cy + dy},${cz + dz}`); if (!c) continue;
    for (const i of c) { const d2 = (X[3 * i] - x) ** 2 + (X[3 * i + 1] - y) ** 2 + (X[3 * i + 2] - z) ** 2; if (d2 <= r2) out.push(i, d2); } }
  return out; };

/* ---- one size and one place: the boxes' heights and floors, the turn that fits best of the four about the upright ---- */
const [mlo, mhi] = box(Y, NM);
const fits = [];
for (const turn of [0, 1, 2, 3]) {
  const c = Math.cos(turn * Math.PI / 2), s = Math.sin(turn * Math.PI / 2), T = new Float32Array(NM * 3);
  for (let i = 0; i < NM; i++) { T[3 * i] = c * Y[3 * i] + s * Y[3 * i + 2]; T[3 * i + 1] = Y[3 * i + 1]; T[3 * i + 2] = -s * Y[3 * i] + c * Y[3 * i + 2]; }
  const [lo, hi] = box(T, NM), sc = (rhi[1] - rlo[1]) / (hi[1] - lo[1]);
  const off = [0, 1, 2].map(k => (rlo[k] + rhi[k]) / 2 - sc * (lo[k] + hi[k]) / 2); off[1] = rlo[1] - sc * lo[1];
  let sum = 0, cnt = 0, worst = 0; const hit = [], step = Math.max(1, Math.floor(NM / 4000));
  for (let i = 0; i < NM; i += step) { const x = sc * T[3 * i] + off[0], y = sc * T[3 * i + 1] + off[1], z = sc * T[3 * i + 2] + off[2];
    let r = 0.01, best = Infinity; while (r <= 0.16) { near(x, y, z, r, hit); for (let q = 1; q < hit.length; q += 2) if (hit[q] < best) best = hit[q]; if (best < Infinity) break; r *= 2; }
    const d = Math.sqrt(Math.min(best, 0.0256)); sum += d; cnt++; if (d > worst) worst = d; }
  fits.push({ turn, c, s, sc, off, mean: sum / cnt, worst });
}
fits.sort((a, b) => a.mean - b.mean);
const F = fits[0];
console.log(`  fit: turn ${F.turn * 90} degrees, size x${F.sc.toFixed(4)}, moved [${F.off.map(x => x.toFixed(4)).join(', ')}]; a remeshed point lies ${(F.mean * 1000).toFixed(2)} mm from the rig's points on average, ${(F.worst * 1000).toFixed(1)} mm at worst (the other turns: ${fits.slice(1).map(f => (f.mean * 1000).toFixed(1)).join(', ')} mm)`);
if (F.mean > MAXOFF) throw new Error(`the remeshed body does not lie on the rigged one (${(F.mean * 1000).toFixed(1)} mm on average, over ${MAXOFF * 1000} mm)`);
const Z = new Float32Array(NM * 3), ZN = new Float32Array(NM * 3);
for (let i = 0; i < NM; i++) {
  Z[3 * i] = F.sc * (F.c * Y[3 * i] + F.s * Y[3 * i + 2]) + F.off[0]; Z[3 * i + 1] = F.sc * Y[3 * i + 1] + F.off[1]; Z[3 * i + 2] = F.sc * (-F.s * Y[3 * i] + F.c * Y[3 * i + 2]) + F.off[2];
  ZN[3 * i] = F.c * YN[3 * i] + F.s * YN[3 * i + 2]; ZN[3 * i + 1] = YN[3 * i + 1]; ZN[3 * i + 2] = -F.s * YN[3 * i] + F.c * YN[3 * i + 2];
}

/* ---- the weights: every remeshed point from the rigged points round it that face its way ---- */
const NJ = joints.length, J4 = new Uint16Array(NM * 4), W4 = new Float32Array(NM * 4), acc = new Float64Array(NJ), hit = [], jj = [0, 0, 0, 0], ww = [0, 0, 0, 0];
let far = 0, loose = 0;
for (let i = 0; i < NM; i++) {
  const x = Z[3 * i], y = Z[3 * i + 1], z = Z[3 * i + 2]; let r = REACH, got = 0, any = 0;
  acc.fill(0);
  while (r <= 0.32) {
    near(x, y, z, r, hit); any = hit.length / 2; got = 0;
    for (let q = 0; q < hit.length; q += 2) { const s = hit[q]; if (XN[3 * s] * ZN[3 * i] + XN[3 * s + 1] * ZN[3 * i + 1] + XN[3 * s + 2] * ZN[3 * i + 2] >= 0.3) got++; }
    if (got >= 3 || (any >= 3 && r >= REACH * 4)) break; r *= 2;
  }
  const strict = got >= 3; if (!strict) loose++; if (r > REACH * 2) far++;
  /* the nearest dozen that qualify, by distance (a far ring of a hundred would blur a finger into the palm) */
  const cand = [];
  for (let q = 0; q < hit.length; q += 2) { const s = hit[q]; if (strict && XN[3 * s] * ZN[3 * i] + XN[3 * s + 1] * ZN[3 * i + 1] + XN[3 * s + 2] * ZN[3 * i + 2] < 0.3) continue; cand.push([hit[q + 1], s]); }
  cand.sort((a, b) => a[0] - b[0]);
  for (const [d2, s] of cand.slice(0, 12)) { const k = 1 / (d2 + 1e-8); rJ.getElement(s, jj); rWt.getElement(s, ww); for (let e = 0; e < 4; e++) if (ww[e] > 0) acc[jj[e]] += k * ww[e]; }
  const top = []; for (let j = 0; j < NJ; j++) if (acc[j] > 0) top.push([acc[j], j]); top.sort((a, b) => b[0] - a[0]);
  const t4 = top.slice(0, 4), sum = t4.reduce((a, b) => a + b[0], 0) || 1;
  for (let e = 0; e < 4; e++) { J4[4 * i + e] = t4[e] ? t4[e][1] : 0; W4[4 * i + e] = t4[e] ? t4[e][0] / sum : 0; }
  if (!t4.length) { J4[4 * i] = 0; W4[4 * i] = 1; }
}
console.log(`  weights: ${NM} points from ${NR}; ${far} reached further than ${REACH * 2 * 100} cm, ${loose} found too few that face their way and took the nearest`);

/* ---- back into the rig's own mesh space, and written into the rig's file ---- */
const Minv = new Matrix4().copy(M0).invert(), Mn = new Matrix4().copy(M0).transpose();
const P2 = new Float32Array(NM * 3), N2 = new Float32Array(NM * 3), UV2 = new Float32Array(NM * 2), u2 = [0, 0];
for (let i = 0; i < NM; i++) { v.set(Z[3 * i], Z[3 * i + 1], Z[3 * i + 2]).applyMatrix4(Minv); P2[3 * i] = v.x; P2[3 * i + 1] = v.y; P2[3 * i + 2] = v.z;
  v.set(ZN[3 * i], ZN[3 * i + 1], ZN[3 * i + 2]).transformDirection(Mn); N2[3 * i] = v.x; N2[3 * i + 1] = v.y; N2[3 * i + 2] = v.z;
  mUV.getElement(i, u2); UV2[2 * i] = u2[0]; UV2[2 * i + 1] = u2[1]; }
const buf = rroot.listBuffers()[0];
for (const sem of rp.listSemantics()) rp.setAttribute(sem, null);
rp.setAttribute('POSITION', rig.createAccessor().setType('VEC3').setArray(P2).setBuffer(buf))
  .setAttribute('NORMAL', rig.createAccessor().setType('VEC3').setArray(N2).setBuffer(buf))
  .setAttribute('TEXCOORD_0', rig.createAccessor().setType('VEC2').setArray(UV2).setBuffer(buf))
  .setAttribute('JOINTS_0', rig.createAccessor().setType('VEC4').setArray(J4).setBuffer(buf))
  .setAttribute('WEIGHTS_0', rig.createAccessor().setType('VEC4').setArray(W4).setBuffer(buf))
  .setIndices(rig.createAccessor().setType('SCALAR').setArray(mI).setBuffer(buf));
/* the sheets: the remeshed file's own, in the rig's material (its other settings kept) */
const rmat = rp.getMaterial(), mmat = mp.getMaterial();
const RAW = !!process.env.RAWSHEETS;
const carry = async (get, set, how) => { const t = get.call(mmat); if (!t || (!RAW && how === 'drop')) { set.call(rmat, null); return 0; }
  let img = t.getImage(), mime = t.getMimeType();
  if (!RAW && how === 'jpeg') { img = await sharp(Buffer.from(img)).flatten({ background: '#808080' }).jpeg({ quality: 95, chromaSubsampling: '4:4:4' }).toBuffer(); mime = 'image/jpeg'; }
  if (!RAW && how === 'webp') { img = await sharp(Buffer.from(img)).webp({ quality: 95 }).toBuffer(); mime = 'image/webp'; }
  const nt = rig.createTexture(t.getName() || '').setImage(img).setMimeType(mime); set.call(rmat, nt); return img.length; };
const sizes = { colour: await carry(mmat.getBaseColorTexture, rmat.setBaseColorTexture, 'jpeg'), normal: await carry(mmat.getNormalTexture, rmat.setNormalTexture, 'webp'),
                mr: await carry(mmat.getMetallicRoughnessTexture, rmat.setMetallicRoughnessTexture, 'drop') };
rmat.setOcclusionTexture(null).setEmissiveTexture(null);
await rig.transform(prune());
await io.write(OUT, rig);
console.log(`riglod ${OUT.split('/').pop()}: ${mI.length / 3} triangles on ${joints.length} joints; sheets ${Object.entries(sizes).map(([k, b]) => `${k} ${(b / 1048576).toFixed(1)} MB`).join(', ')}; ${(fs.statSync(OUT).size / 1048576).toFixed(1)} MB`);
