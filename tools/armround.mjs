/* v26.0: A SCANNED ARM MADE A CLEAN LIMB BELOW ITS ARMPIT (Chad, 12 Nov 2026: "Grandmaster pho's models still have that
   skin piece sticking out of his right armpits issue, can you fix it completely?").

   His scan hung the right arm against his side, so the arm and the body were one surface there. Earlier rounds cut them
   apart and closed the arm's inner side (v24.50 to v24.56), but the cut ran along the scan's own triangles and left two
   WEBS of skin on the arm, where the front and the back folds of the armpit ran on down it: read as rings round the bone
   (tools/probes/armring.mjs) the arm is a round limb with two fins, 4 to 5 cm proud of it, from the armpit to its
   middle. Part of each still joins points that ride his body (so it stretches when the arm leaves his side), part hangs
   free (the tooth under his arm, seen from behind in his seated rest).

   What this does, in the bind pose, to every skinned part of the file:
     1. reads the limb as rings: each point's place along the bone (s), across it (x toward the body's middle line, y
        square to that) and its share of the limb's bones;
     2. finds the limb's own outline at every half centimetre of the bone: the convex hull of the points that ride the
        limb by half or more and lie within `cap` of its outer side's radius (the round of the arm and the wall that
        closes its inner side; the fins lie outside it);
     3. TAKES OUT every triangle of a web: one whose middle lies past `cut` along the bone, on the limb's inner side,
        outside that outline by more than `margin`, and all of whose points ride the limb at least a little (`webw`):
        the fin and its join to the body, on both sides of the old cut. A triangle with no point that rides the limb is
        never touched (his side and his robe are his body's own);
     4. LAYS what is left of the limb's own points that still stand outside the outline onto it (eased in from `from`
        to `full` along the bone, so the true folds of the armpit, above, keep their shape);
     5. gives the points it moved their normals again (shared across a sheet's seam);
     6. (--shell) CLOSES THE LIMB'S INNER SIDE WITH A NEW SURFACE: under the webs the old closing has holes (seen the
        moment the webs were out: the grey of the room through his arm). A strip of new triangles is laid a millimetre
        outside the limb's outline, round its inner side (`shlo` to `shhi` degrees), a ring every centimetre from a
        little above the cut to `to`: each point rides the bones the limb's nearest own point rides, and each
        triangle is painted with one texel, the paint of the limb's nearest own point (the plain skin beside it);
     7. (--side) HIS SIDE UNDER THE ARM IS ONE NEW SURFACE. The scan never saw his side where the arm lay on it: what
        it drew there is the two webs' roots meeting at the arm (no wall of his body behind the arm at all, so with the
        webs out the armpit opened into his chest), crumpled in layers, and painted by the earlier rounds a triangle at
        a time (a ragged border of skin and robe, seen from his front the moment the front web was out). So that
        patch is REBUILT: his body is read round an axis of its own (along the limb's, inside his chest) as a reach by
        angle and by place along the axis; every node of that grid the scan really drew keeps its reach (clean points
        of his body); every node it did not (painted, torn, a web's, missing) takes the reach of a membrane held by
        the clean nodes round it; the new surface is drawn over those and a cell's width in under the scan's own, the
        old triangles it stands in for are taken out, and it is painted skin above the robe's top edge and robe below
        it, the edge one smooth line read from the scan's clean paint either side (`sideedge`). Its paint is one
        texel a triangle, from texels whose NORMAL sheet is flat (a single texel of a bumped normal sheet leans each
        triangle its own way: blotches); the robe's part is one white, the skin's is matched to the mean of the clean
        skin nearest it, and the limb's new inner side (6) is given the same matched skin. Its bones are the mean of
        the nearest clean points of his body (none rides the limb): it stays with him as the arm swings.
     8. THE ARMPIT'S VAULT (with --side): a lid of skin in the plane of the cut, from the limb's ring there to his
        side's row there (bare skin only), riding the limb on one side and his body on the other, drawn on both
        faces: the top of the armpit, closed. And a web's triangle that straddles the cut is CLIPPED along it (3),
        not taken or kept whole.
   Nothing else in the file is touched: no other point, no paint, no weight, no bone, no take.
     node tools/armround.mjs <in.glb> <out.glb> [--bone=RightArm] [--next=RightForeArm] [--cut=0.035] [--from=0.03]
          [--full=0.06] [--to=0.2] [--cap=1.18] [--margin=0.006] [--webw=0.04] [--shell] [--side] [--dry]
   (a far body with no paint of its own names its sheets: ROBE_PAINT=<colour picture> ROBE_NORMAL=<normal picture>)
   Prints what it took and what it moved, by where along the bone. --dry writes nothing. */
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { MeshoptDecoder, MeshoptEncoder } from 'meshoptimizer';
import * as THREE from 'three';
await MeshoptDecoder.ready; await MeshoptEncoder.ready;
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.decoder': MeshoptDecoder, 'meshopt.encoder': MeshoptEncoder });
const args = process.argv.slice(2), files = args.filter(a => !a.startsWith('--'));
const arg = (k, d) => { const a = args.find(x => x.startsWith(`--${k}=`)); return a ? a.slice(k.length + 3) : d; };
const [IN_FILE, OUT_FILE] = files, DRY = args.includes('--dry');
if (!IN_FILE || (!OUT_FILE && !DRY)) { console.error('usage: node tools/armround.mjs <in.glb> <out.glb> [--dry] ...'); process.exit(2); }
const BONE = arg('bone', 'RightArm'), NEXT = arg('next', 'RightForeArm');
const CUT = +arg('cut', 0.035), CUT_TO = +arg('cutto', 0.13), FROM = +arg('from', 0.03), FULL = +arg('full', 0.06), TO = +arg('to', 0.2), CAP = +arg('cap', 1.18), MARGIN = +arg('margin', 0.006), WEBW = +arg('webw', 0.04);
const ANG_LO = +arg('anglo', -125), ANG_HI = +arg('anghi', 80);                  // the limb's inner side, in degrees from "inward" (front positive)
const SIDE_ON = args.includes('--side'), CLIP = !args.includes('--noclip');
const SHELL = args.includes('--shell'), SH_LO = +arg('shlo', -118), SH_HI = +arg('shhi', 62), SH_UP = +arg('shup', 0.015), SH_OUT = +arg('shout', 0.001), SH_N = +arg('shn', 18);

const doc = await io.read(IN_FILE), root = doc.getRoot(), skin = root.listSkins()[0];
const joints = skin.listJoints(), names = joints.map(j => j.getName()), ibm = skin.getInverseBindMatrices().getArray();
const find = (n) => names.findIndex(x => x === n || x.replace(/^mixamorig:?/, '') === n);
const bindOf = (i) => new THREE.Matrix4().fromArray(ibm, i * 16).invert();
const jb = find(BONE), jn = find(NEXT);
if (jb < 0 || jn < 0) { console.error('no bone ' + BONE + ' or ' + NEXT); process.exit(2); }
const A = new THREE.Vector3().setFromMatrixPosition(bindOf(jb)), B = new THREE.Vector3().setFromMatrixPosition(bindOf(jn));
const axis = B.clone().sub(A), LEN = axis.length(); axis.normalize();
const spI = [/^(mixamorig:?)?Spine2$/, /^(mixamorig:?)?Spine1$/, /Spine/].map(re => names.findIndex(n => re.test(n))).find(i => i >= 0);
const SP = new THREE.Vector3().setFromMatrixPosition(bindOf(spI));
const mid = A.clone().addScaledVector(axis, LEN / 2), INW = new THREE.Vector3(SP.x - mid.x, 0, SP.z - mid.z); INW.addScaledVector(axis, -INW.dot(axis)).normalize();
const SIDE = new THREE.Vector3().crossVectors(axis, INW).normalize();
const smooth = (a, b, x) => { const t = Math.max(0, Math.min(1, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

/* ---- every skinned part, its points in the limb's frame */
const parts = [];
root.listMeshes().forEach((m) => m.listPrimitives().forEach((pr) => {
  const P = pr.getAttribute('POSITION'), J = pr.getAttribute('JOINTS_0'), W = pr.getAttribute('WEIGHTS_0'), I = pr.getIndices(); if (!P || !J || !W || !I) return;
  const node = root.listNodes().find(n => n.getMesh() === m), wm = new THREE.Matrix4().fromArray(node ? node.getWorldMatrix() : new THREE.Matrix4().toArray()), wi = wm.clone().invert();
  const n = P.getCount(), s = new Float32Array(n), x = new Float32Array(n), y = new Float32Array(n), w = new Float32Array(n);
  const v = new THREE.Vector3(), d = new THREE.Vector3(), jj = [0, 0, 0, 0], ww = [0, 0, 0, 0], e = [0, 0, 0];
  for (let i = 0; i < n; i++) { J.getElement(i, jj); W.getElement(i, ww); const sum = ww[0] + ww[1] + ww[2] + ww[3] || 1; let k = 0;
    for (let c = 0; c < 4; c++) if (jj[c] === jb || jj[c] === jn) k += ww[c] / sum;
    w[i] = k; v.fromArray(P.getElement(i, e)).applyMatrix4(wm); d.copy(v).sub(A); s[i] = d.dot(axis); d.addScaledVector(axis, -s[i]); x[i] = d.dot(INW); y[i] = d.dot(SIDE); }
  parts.push({ m, pr, P, I, J, W, wm, wi, n, s, x, y, w, name: (m.getName() || '?') + ':' + (pr.getMaterial() ? pr.getMaterial().getName() : '') });
}));

/* ---- the limb's outer radius along the bone (its outer half's ninetieth percentile, a centimetre a slice, smoothed) */
const SL = 0.01, s0 = -0.02, nS = Math.ceil((TO + 0.04 - s0) / SL), hi = new Float32Array(nS);
for (let b = 0; b < nS; b++) { const r = [];
  for (const Q of parts) for (let i = 0; i < Q.n; i++) { if (Q.w[i] < 0.5) continue; const sb = Math.floor((Q.s[i] - s0) / SL); if (sb !== b) continue;
    const ang = Math.atan2(Q.y[i], Q.x[i]) * 180 / Math.PI; if (Math.abs(ang) > 100) r.push(Math.hypot(Q.x[i], Q.y[i])); }
  r.sort((p, q) => p - q); hi[b] = r.length >= 4 ? r[Math.floor(r.length * 0.9)] : 0; }
const hiS = new Float32Array(nS);
for (let b = 0; b < nS; b++) { const w5 = []; for (let k = -2; k <= 2; k++) if (hi[b + k] > 0) w5.push(hi[b + k]); w5.sort((p, q) => p - q); hiS[b] = w5.length ? w5[w5.length >> 1] : 0; }
const hiAt = (s) => { const b = Math.max(0, Math.min(nS - 1, Math.floor((s - s0) / SL))); return hiS[b]; };

/* ---- the limb's outline at every half centimetre: the convex hull of its own points within the cap */
const HS = 0.005, nH = Math.ceil((TO + 0.02 - 0) / HS) + 1, hulls = [];
const hull2 = (pts) => { pts.sort((p, q) => p[0] - q[0] || p[1] - q[1]); const cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]); const lo = [], up = [];
  for (const p of pts) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop(); lo.push(p); }
  for (let i = pts.length - 1; i >= 0; i--) { const p = pts[i]; while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], p) <= 0) up.pop(); up.push(p); }
  lo.pop(); up.pop(); return lo.concat(up); };
for (let h = 0; h < nH; h++) { const sc = h * HS, pts = [];
  for (const Q of parts) for (let i = 0; i < Q.n; i++) { if (Q.w[i] < 0.5 || Math.abs(Q.s[i] - sc) > 0.01) continue; if (Math.hypot(Q.x[i], Q.y[i]) <= CAP * hiAt(Q.s[i])) pts.push([Q.x[i], Q.y[i]]); }
  hulls.push(pts.length >= 12 ? hull2(pts) : null); }
/* how far a point of a slice lies outside an outline (negative inside), and the outline's nearest point to it */
const outOf = (H, px, py) => { let inside = true, best = Infinity, bx = px, by = py;
  for (let i = 0; i < H.length; i++) { const a = H[i], b = H[(i + 1) % H.length], ex = b[0] - a[0], ey = b[1] - a[1], L2 = ex * ex + ey * ey || 1e-12;
    if (ex * (py - a[1]) - ey * (px - a[0]) < 0) inside = false;
    const t = Math.max(0, Math.min(1, ((px - a[0]) * ex + (py - a[1]) * ey) / L2)), qx = a[0] + ex * t, qy = a[1] + ey * t, dd = Math.hypot(px - qx, py - qy);
    if (dd < best) { best = dd; bx = qx; by = qy; } }
  return { d: inside ? -best : best, x: bx, y: by }; };
const at = (s, px, py) => { const f = Math.max(0, Math.min(nH - 1.001, s / HS)), h0 = Math.floor(f), k = f - h0, H0 = hulls[h0] || hulls[h0 + 1], H1 = hulls[h0 + 1] || hulls[h0];
  if (!H0 || !H1) return null; const a = outOf(H0, px, py), b = outOf(H1, px, py);
  return { d: a.d * (1 - k) + b.d * k, x: a.x * (1 - k) + b.x * k, y: a.y * (1 - k) + b.y * k }; };

/* ---- 3: the webs' triangles out; 4: the limb's own points laid on its outline */
let took = 0, moved = 0, far = 0; const tookBy = {}, movedBy = {}, report = [];
/* a new point on the edge between two of a part's points (everything they carry mixed), held until the part is grown */
const clipPoint = (Q, i, j, t) => { const add = Q.add || (Q.add = { P: [], N: [], T: [], TG: [], J: [], W: [], n: 0 }), pr = Q.pr, N = pr.getAttribute('NORMAL'), T = pr.getAttribute('TEXCOORD_0'), TG = pr.getAttribute('TANGENT');
  const L = (acc, size) => { const p = acc.getElement(i, new Array(size).fill(0)), q = acc.getElement(j, new Array(size).fill(0)); return p.map((u, k) => u + (q[k] - u) * t); }, nz = (u) => { const l = Math.hypot(u[0], u[1], u[2]) || 1; return [u[0] / l, u[1] / l, u[2] / l]; };
  add.P.push(...L(Q.P, 3)); if (N) add.N.push(...nz(L(N, 3))); if (T) add.T.push(...L(T, 2)); if (TG) { const g = L(TG, 4); add.TG.push(...nz(g), TG.getElement(i, [0, 0, 0, 0])[3]); }
  const w = new Map(), ja = Q.J.getElement(i, [0, 0, 0, 0]), wa = Q.W.getElement(i, [0, 0, 0, 0]), jb2 = Q.J.getElement(j, [0, 0, 0, 0]), wb = Q.W.getElement(j, [0, 0, 0, 0]);
  ja.forEach((jn2, k) => w.set(jn2, (w.get(jn2) || 0) + wa[k] * (1 - t))); jb2.forEach((jn2, k) => w.set(jn2, (w.get(jn2) || 0) + wb[k] * t));
  const top = [...w.entries()].filter(e => e[1] > 0).sort((p, q) => q[1] - p[1]).slice(0, 4), sum = top.reduce((u, e) => u + e[1], 0) || 1; while (top.length < 4) top.push([0, 0]);
  add.J.push(...top.map(e => e[0])); add.W.push(...top.map(e => e[1] / sum)); return Q.P.getCount() + add.n++; };
const growPart = (Q) => { const add = Q.add; if (!add || !add.n) return; const pr = Q.pr, n0 = Q.P.getCount(), nAdd = add.n;
  const grow = (acc, vals, size) => { if (!acc) return; const old = acc.getArray(), arr = new (old.constructor)(old.length + nAdd * size); arr.set(old); acc.setArray(arr); for (let i = 0; i < nAdd; i++) acc.setElement(n0 + i, vals.slice(i * size, i * size + size)); };
  grow(Q.P, add.P, 3); grow(pr.getAttribute('NORMAL'), add.N, 3); grow(pr.getAttribute('TEXCOORD_0'), add.T, 2); grow(pr.getAttribute('TANGENT'), add.TG, 4); grow(Q.J, add.J, 4); grow(Q.W, add.W, 4);
  for (const sm of pr.listSemantics()) { const a = pr.getAttribute(sm); if (a.getCount() !== n0 + nAdd) { console.error('the part has an attribute this does not grow: ' + sm); process.exit(3); } }
  Q.add = null; };
let clippedAll = 0;
for (const Q of parts) {
  const ix = Q.I.getArray(), nT = ix.length / 3, keep = []; let gone = 0, clipped = 0;
  for (let t = 0; t < nT; t++) { const a = ix[t * 3], b = ix[t * 3 + 1], c = ix[t * 3 + 2];
    const cs = (Q.s[a] + Q.s[b] + Q.s[c]) / 3, cx = (Q.x[a] + Q.x[b] + Q.x[c]) / 3, cy = (Q.y[a] + Q.y[b] + Q.y[c]) / 3, wmin = Math.min(Q.w[a], Q.w[b], Q.w[c]), wmax = Math.max(Q.w[a], Q.w[b], Q.w[c]);
    let out = false;
    if (cs >= CUT && cs <= CUT_TO && wmin >= WEBW && wmax >= 0.2) { const ang = Math.atan2(cy, cx) * 180 / Math.PI;
      if (ang >= ANG_LO && ang <= ANG_HI) { const o = at(cs, cx, cy); if (o && o.d > MARGIN) out = true; } }
    if (out) { gone++; const k = Math.floor(cs * 50) * 2; tookBy[k] = (tookBy[k] || 0) + 1; continue; }
    /* a web's triangle that straddles the cut is CLIPPED along it (the part above the cut kept, on new points along
       its two cut edges): taken or kept whole, the web's lower edge was a row of teeth in the armpit's apex */
    const sv = [Q.s[a], Q.s[b], Q.s[c]], over = sv.filter(u => u >= CUT).length;
    if (CLIP && over > 0 && over < 3 && wmin >= WEBW && wmax >= 0.2) { const V = [a, b, c], lone = over === 1 ? sv.findIndex(u => u >= CUT) : sv.findIndex(u => u < CUT), i0 = lone, i1 = (lone + 1) % 3, i2 = (lone + 2) % 3;
      const t1 = (CUT - sv[i0]) / (sv[i1] - sv[i0]), t2 = (CUT - sv[i0]) / (sv[i2] - sv[i0]), L = (p, q, t) => p + (q - p) * t;
      /* (the part beyond the cut: is IT a web's? its middle, in the limb's frame) */
      const mx1 = L(Q.x[V[i0]], Q.x[V[i1]], t1), my1 = L(Q.y[V[i0]], Q.y[V[i1]], t1), mx2 = L(Q.x[V[i0]], Q.x[V[i2]], t2), my2 = L(Q.y[V[i0]], Q.y[V[i2]], t2);
      const far = over === 1 ? [[sv[i0], Q.x[V[i0]], Q.y[V[i0]]], [CUT, mx1, my1], [CUT, mx2, my2]] : [[sv[i1], Q.x[V[i1]], Q.y[V[i1]]], [sv[i2], Q.x[V[i2]], Q.y[V[i2]]], [CUT, mx1, my1], [CUT, mx2, my2]];
      const fs = far.reduce((u, q) => u + q[0], 0) / far.length, fx = far.reduce((u, q) => u + q[1], 0) / far.length, fy = far.reduce((u, q) => u + q[2], 0) / far.length, fang = Math.atan2(fy, fx) * 180 / Math.PI, o = fang >= ANG_LO && fang <= ANG_HI ? at(Math.max(fs, CUT), fx, fy) : null;
      if (o && o.d > MARGIN) { const m1 = clipPoint(Q, V[i0], V[i1], t1), m2 = clipPoint(Q, V[i0], V[i2], t2);
        if (over === 1) keep.push(m1, V[i1], V[i2], m1, V[i2], m2); else keep.push(V[i0], m1, m2); clipped++; continue; } }
    keep.push(a, b, c); }
  if (gone || clipped) { took += gone; if (!DRY) { growPart(Q); Q.I.setArray(new Uint32Array(keep)); } }
  /* (which points a kept triangle still uses: only those are laid on the outline) */
  const used = new Uint8Array(Q.n); for (const i of keep) if (i < Q.n) used[i] = 1;
  const movedIdx = [], e = [0, 0, 0], v = new THREE.Vector3();
  for (let i = 0; i < Q.n; i++) { if (!used[i] || Q.w[i] < 0.5 || Q.s[i] < FROM || Q.s[i] > TO) continue;
    const ang = Math.atan2(Q.y[i], Q.x[i]) * 180 / Math.PI; if (ang < ANG_LO || ang > ANG_HI) continue;
    const o = at(Q.s[i], Q.x[i], Q.y[i]); if (!o || o.d <= 0.0005) continue;
    const k = smooth(FROM, FULL, Q.s[i]) * (1 - smooth(TO - 0.03, TO, Q.s[i])); if (k <= 0) continue;
    const nx = Q.x[i] + (o.x - Q.x[i]) * k, ny = Q.y[i] + (o.y - Q.y[i]) * k; far = Math.max(far, o.d * k);
    v.copy(A).addScaledVector(axis, Q.s[i]).addScaledVector(INW, nx).addScaledVector(SIDE, ny).applyMatrix4(Q.wi);
    if (!DRY) Q.P.setElement(i, v.toArray(e)); Q.x[i] = nx; Q.y[i] = ny; movedIdx.push(i); moved++; const kb = Math.floor(Q.s[i] * 50) * 2; movedBy[kb] = (movedBy[kb] || 0) + 1; }
  /* 5: normals again for what moved (and the same normal for points that share a place) */
  const N = Q.pr.getAttribute('NORMAL');
  if (!DRY && N && movedIdx.length) { const acc = new Map(), key = (i) => Q.P.getElement(i, [0, 0, 0]).join(','), pa = new THREE.Vector3(), pb = new THREE.Vector3(), pc = new THREE.Vector3(), fn = new THREE.Vector3();
    const want = new Set(movedIdx.map(key));
    for (let t = 0; t < keep.length; t += 3) { const tri = [keep[t], keep[t + 1], keep[t + 2]], ks = tri.map(key); if (!ks.some(k => want.has(k))) continue;
      pa.fromArray(Q.P.getElement(tri[0], [0, 0, 0])); pb.fromArray(Q.P.getElement(tri[1], [0, 0, 0])); pc.fromArray(Q.P.getElement(tri[2], [0, 0, 0]));
      fn.copy(pb).sub(pa).cross(pc.sub(pa));                                    // (its length is twice the area: a larger face counts for more)
      for (const k of ks) { if (!want.has(k)) continue; const a = acc.get(k) || [0, 0, 0]; a[0] += fn.x; a[1] += fn.y; a[2] += fn.z; acc.set(k, a); } }
    for (const i of movedIdx) { const a = acc.get(key(i)); if (!a) continue; const L = Math.hypot(a[0], a[1], a[2]); if (L < 1e-12) continue; N.setElement(i, [a[0] / L, a[1] / L, a[2] / L]); } }
  clippedAll += clipped;
  if (gone || movedIdx.length) report.push(`${Q.name}: ${gone} triangles of the webs out of ${nT}, ${clipped} more clipped along the cut; ${movedIdx.length} points laid on the limb's outline`);
}
/* how far an outline reaches from the bone along a direction across it */
const ray = (H, c, sn) => { let best = 0; for (let i = 0; i < H.length; i++) { const a = H[i], b = H[(i + 1) % H.length], ex = b[0] - a[0], ey = b[1] - a[1], den = c * ey - sn * ex; if (Math.abs(den) < 1e-12) continue;
    const t = (a[0] * ey - a[1] * ex) / den, u = (a[0] * sn - a[1] * c) / den; if (t > 0 && u >= -1e-9 && u <= 1 + 1e-9) best = Math.max(best, t); } return best; };
/* ---- 6: the new inner surface */
let shellTris = 0, shellBase = -1; const shellCen = [];
if (SHELL) {
  /* the part that holds most of the limb's own points takes it */
  const Q = parts.slice().sort((a, b) => { const c = (q) => { let k = 0; for (let i = 0; i < q.n; i++) if (q.w[i] >= 0.9 && q.s[i] > 0 && q.s[i] < TO) k++; return k; }; return c(b) - c(a); })[0];
  const pr = Q.pr, sem = pr.listSemantics(), T = pr.getAttribute('TEXCOORD_0'), N = pr.getAttribute('NORMAL'), TG = pr.getAttribute('TANGENT');
  /* who may lend its bones and its paint: the limb's own points, on or inside its outline */
  const don = []; for (let i = 0; i < Q.n; i++) { if (Q.w[i] < 0.9 || Q.s[i] < CUT - SH_UP - 0.02 || Q.s[i] > TO + 0.02) continue; const o = at(Math.max(0, Q.s[i]), Q.x[i], Q.y[i]); if (o && o.d <= 0.001) don.push(i); }
  const near = (s, x, y) => { let b = -1, bd = Infinity; for (const i of don) { const d = (Q.s[i] - s) ** 2 + (Q.x[i] - x) ** 2 + (Q.y[i] - y) ** 2; if (d < bd) { bd = d; b = i; } } return b; };
  const rings = []; for (let sk = CUT - SH_UP; sk <= TO + 1e-9; sk += 0.01) { const H = hulls[Math.max(0, Math.min(nH - 1, Math.round(sk / HS)))]; if (!H) continue; const ring = [];
    for (let k = 0; k <= SH_N; k++) { const ph = (SH_LO + (SH_HI - SH_LO) * k / SH_N) * Math.PI / 180, c = Math.cos(ph), sn = Math.sin(ph), rho = ray(H, c, sn) + SH_OUT; ring.push({ s: sk, x: rho * c, y: rho * sn, c, sn }); }
    rings.push(ring); }
  const add = { P: [], N: [], T: [], TG: [], J: [], W: [] }, v = new THREE.Vector3(), nrm = new THREE.Vector3(), nrot = new THREE.Matrix3().setFromMatrix4(Q.wi);
  const push = (pt, uv) => { v.copy(A).addScaledVector(axis, pt.s).addScaledVector(INW, pt.x).addScaledVector(SIDE, pt.y).applyMatrix4(Q.wi); add.P.push(v.x, v.y, v.z);
    nrm.set(0, 0, 0).addScaledVector(INW, pt.c).addScaledVector(SIDE, pt.sn).applyMatrix3(nrot).normalize(); add.N.push(nrm.x, nrm.y, nrm.z);
    add.T.push(uv[0], uv[1]); if (TG) { const tv = new THREE.Vector3().copy(axis).applyMatrix3(nrot).normalize(); add.TG.push(tv.x, tv.y, tv.z, 1); }
    const d = near(pt.s, pt.x, pt.y); add.J.push(...Q.J.getElement(d, [0, 0, 0, 0])); add.W.push(...Q.W.getElement(d, [0, 0, 0, 0])); };
  const tri = (a, b, c) => { const cen = [(a.s + b.s + c.s) / 3, (a.x + b.x + c.x) / 3, (a.y + b.y + c.y) / 3], d = near(cen[0], cen[1], cen[2]), uv = T.getElement(d, [0, 0]); push(a, uv); push(b, uv); push(c, uv); shellTris++; shellCen.push(cen); };
  for (let r = 0; r + 1 < rings.length; r++) for (let k = 0; k < SH_N; k++) { const a = rings[r][k], b = rings[r][k + 1], c = rings[r + 1][k], d = rings[r + 1][k + 1];
    /* (wound so the face looks outward: along the bone, then round it) */
    const fa = new THREE.Vector3(c.s - a.s, c.x - a.x, c.y - a.y), fb = new THREE.Vector3(b.s - a.s, b.x - a.x, b.y - a.y), out = fa.clone().cross(fb), rad = new THREE.Vector3(0, a.x, a.y);
    if (out.dot(rad) > 0) { tri(a, c, b); tri(b, c, d); } else { tri(a, b, c); tri(b, d, c); } }
  if (!DRY && shellTris) { const n0 = Q.P.getCount(), nAdd = add.P.length / 3; shellBase = n0;
    const grow = (acc, vals, size) => { if (!acc) return; const old = acc.getArray(), arr = new (old.constructor)(old.length + nAdd * size); arr.set(old); acc.setArray(arr); for (let i = 0; i < nAdd; i++) acc.setElement(n0 + i, vals.slice(i * size, i * size + size)); };
    grow(Q.P, add.P, 3); grow(N, add.N, 3); grow(T, add.T, 2); if (TG) grow(TG, add.TG, 4); grow(Q.J, add.J, 4); grow(Q.W, add.W, 4);
    for (const sm of sem) { const a = pr.getAttribute(sm); if (a.getCount() !== n0 + nAdd) { console.error('the part has an attribute this does not grow: ' + sm); process.exit(3); } }
    const ix = Q.I.getArray(), ni = new Uint32Array(ix.length + nAdd); ni.set(ix); for (let i = 0; i < nAdd; i++) ni[ix.length + i] = n0 + i; Q.I.setArray(ni); }
  report.push(`${Q.name}: ${shellTris} new triangles close the limb's inner side (${rings.length} rings from ${((CUT - SH_UP) * 100).toFixed(1)} cm, ${SH_LO} to ${SH_HI} degrees, ${(SH_OUT * 1000).toFixed(1)} mm outside its outline; ${don.length} of its own points lend bones and paint)`);
}
/* ---- 7: his side under the arm, one new surface */
let sideNew = 0, sideGone = 0, sideSkin = 0, sideRobe = 0;
if (SIDE_ON) {
  const texOf = (q) => (q.pr.getMaterial() ? q.pr.getMaterial().getBaseColorTexture() : null);
  const Q = parts.slice().sort((a, b) => { const c = (q) => { let k = 0; for (let i = 0; i < q.n; i++) if (q.w[i] >= 0.9 && q.s[i] > 0 && q.s[i] < TO) k++; return k; }; return c(b) - c(a); })[0];
  const sharp = (await import('sharp')).default;
  const paintBytes = process.env.ROBE_PAINT ? (await import('node:fs')).readFileSync(process.env.ROBE_PAINT) : (texOf(Q) && texOf(Q).getImage());
  if (!paintBytes) { console.error('--side: the limb\'s part has no paint in this file (a far body borrows its paint: name the sheet with ROBE_PAINT=<picture>)'); process.exit(3); }
  const { data: px, info } = await sharp(Buffer.from(paintBytes)).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const texel = (u, v) => { const X = Math.max(0, Math.min(info.width - 1, Math.floor(u * info.width))), Y = Math.max(0, Math.min(info.height - 1, Math.floor(v * info.height))), o = (Y * info.width + X) * 3; return [px[o], px[o + 1], px[o + 2]]; };
  /* (the part's normal sheet too, where it has one: a triangle painted with ONE texel reads one texel of that sheet as
     well, and each new triangle would lean its own way under the light: blotches of grey on white cloth. A texel lends
     its paint only where the normal sheet is flat under it) */
  const nTex = Q.pr.getMaterial() ? Q.pr.getMaterial().getNormalTexture() : null, nBytes = process.env.ROBE_NORMAL ? (await import('node:fs')).readFileSync(process.env.ROBE_NORMAL) : (nTex && nTex.getImage());
  const nrmSheet = nBytes ? await sharp(Buffer.from(nBytes)).removeAlpha().raw().toBuffer({ resolveWithObject: true }) : null, FLATN = +arg('sideflatn', 5);
  const flatNormal = (u, v) => { if (!nrmSheet) return true; const I2 = nrmSheet.info, X = Math.max(0, Math.min(I2.width - 1, Math.floor(u * I2.width))), Y = Math.max(0, Math.min(I2.height - 1, Math.floor(v * I2.height))), o = (Y * I2.width + X) * 3;
    return Math.abs(nrmSheet.data[o] - 128) <= FLATN && Math.abs(nrmSheet.data[o + 1] - 128) <= FLATN; };
  /* what a texel is: clean skin (saturated), clean robe (bright, unsaturated), or neither (the grey of a crease no camera saw) */
  const kindOf = (c) => { const mx = Math.max(c[0], c[1], c[2]), mn = Math.min(c[0], c[1], c[2]), sat = (mx - mn) / (mx || 1); return sat > 0.22 && mx > 110 ? 'S' : (mx > 185 && sat < 0.08 ? 'R' : '?'); };
  const pr = Q.pr, sem = pr.listSemantics(), T = pr.getAttribute('TEXCOORD_0'), N = pr.getAttribute('NORMAL'), TG = pr.getAttribute('TANGENT');
  const n0 = Q.P.getCount(), nOld = Q.n, ix = Q.I.getArray(), nT = ix.length / 3;
  /* a point an earlier round painted (every corner of one of its triangles on one texel) is not the scan's surface */
  const flatPt = new Uint8Array(nOld), uvA = [0, 0], uvB = [0, 0], uvC = [0, 0];
  for (let t = 0; t < nT; t++) { const a = ix[t * 3], b = ix[t * 3 + 1], c = ix[t * 3 + 2]; if (a >= nOld || b >= nOld || c >= nOld) continue; T.getElement(a, uvA); T.getElement(b, uvB); T.getElement(c, uvC);
    if (Math.abs((uvB[0] - uvA[0]) * (uvC[1] - uvA[1]) - (uvB[1] - uvA[1]) * (uvC[0] - uvA[0])) < 1e-10) { flatPt[a] = flatPt[b] = flatPt[c] = 1; } }
  /* the body round an axis of its own: an axis along the limb's, set inside his chest (`sidey` across, `sidex` toward
     his middle); a point is an angle round it (0 toward the limb, front positive), a place along it (s) and a reach (r) */
  const YC = +arg('sidey', -0.055), XC = +arg('sidex', 0.22), TH0 = +arg('sideth0', -62.5), TH1 = +arg('sideth1', 70), DTH = +arg('sidedth', 2.5), FL0 = +arg('sidefl0', -46), FL1 = +arg('sidefl1', 62);
  const S_TOP = +arg('sidetop', -0.04), S_SOLVE = CUT - 0.01, S_BOT = +arg('sidebot', 0.225), DS = 0.005, TUCK = +arg('sidetuck', 0.0015), TAPER = +arg('sidetaper', 0.4);
  const nTh = Math.round((TH1 - TH0) / DTH) + 1, nSr = Math.round((S_BOT - S_TOP) / DS) + 1, rowSolve = Math.round((S_SOLVE - S_TOP) / DS);
  const th = new Float32Array(nOld), rr = new Float32Array(nOld), colr = new Uint8Array(nOld * 3), knd = new Uint8Array(nOld);   // kind: 1 skin, 2 robe, 0 neither
  for (let i = 0; i < nOld; i++) { const dy = Q.y[i] - YC, dx = Q.x[i] - XC; th[i] = Math.atan2(dy, -dx) * 180 / Math.PI; rr[i] = Math.hypot(dy, dx);
    const uv = T.getElement(i, uvA), c = texel(uv[0], uv[1]), k = kindOf(c); colr[i * 3] = c[0]; colr[i * 3 + 1] = c[1]; colr[i * 3 + 2] = c[2]; knd[i] = k === 'S' ? 1 : k === 'R' ? 2 : 0; }
  /* the robe's top edge round his side, as places along the axis by angle (read from the scan's own clean paint either
     side of what the arm hid, joined under the arm with a little sag): above it he is bare, below it he is robed */
  const EDGE = arg('sideedge', '-62:-0.16,-50:-0.06,-45:-0.02,-35:0.026,-25:0.076,10:0.086,45:0.074,55:0.058,65:0.001,75:-0.053').split(',').map(p => p.split(':').map(Number));
  const edgeRaw = (t) => { if (t <= EDGE[0][0]) return EDGE[0][1]; for (let k = 0; k + 1 < EDGE.length; k++) if (t <= EDGE[k + 1][0]) { const u = (t - EDGE[k][0]) / (EDGE[k + 1][0] - EDGE[k][0]); return EDGE[k][1] + (EDGE[k + 1][1] - EDGE[k][1]) * u; } return EDGE[EDGE.length - 1][1]; };
  const edgeAt = (t) => { let a = 0; for (let k = -4; k <= 4; k++) a += edgeRaw(t + k * 1.5); return a / 9; };              // (its corners eased over twelve degrees)
  /* which nodes of the grid the scan really drew: clean points of his body stand there (below the cut, none that rides
     the limb at all; above it, the folds of the armpit, which ride it a little). And which it did not: every row's
     span of painted, torn or missing surface, and of skin lying below the robe's edge */
  const node = (r, k) => r * nTh + k, G = nSr * nTh, sup = Array.from({ length: G }, () => []), bad = new Uint8Array(G);
  const inWin = (i) => th[i] >= TH0 - DTH && th[i] <= TH1 + DTH && Q.s[i] >= S_TOP - DS && Q.s[i] <= S_BOT + DS && rr[i] > 0.07 && rr[i] < 0.24;
  for (let i = 0; i < nOld; i++) { if (!inWin(i)) continue; const kf = (th[i] - TH0) / DTH, rf = (Q.s[i] - S_TOP) / DS, k = Math.round(kf), r = Math.round(rf);
    const below = Q.s[i] >= S_SOLVE, body = Q.w[i] < (below ? 0.02 : 0.5);
    /* (torn: what an earlier round painted, in the span the arm hid; a web's own points; a fleck of skin on the robe of his back) */
    const torn = (flatPt[i] && Q.w[i] < 0.5 && th[i] >= FL0 && th[i] <= FL1) || (below && Q.w[i] >= 0.02 && Q.w[i] < 0.5) || (below && body && knd[i] === 1 && th[i] < -25 && Q.s[i] > edgeAt(th[i]) + 0.01);
    if (torn) { if (k >= 0 && k < nTh && r >= 0 && r < nSr) bad[node(r, k)] = 1; continue; }
    /* (a clean point holds every node within a node and a half of it: the scan's points stand wider apart than the grid's) */
    if (body) for (let r2 = Math.ceil(rf - 1.5); r2 <= Math.floor(rf + 1.5); r2++) for (let k2 = Math.ceil(kf - 1.5); k2 <= Math.floor(kf + 1.5); k2++) if (k2 >= 0 && k2 < nTh && r2 >= 0 && r2 < nSr) sup[node(r2, k2)].push(rr[i]); }
  /* (a row's torn span is whole from its first torn node to its last, and a node wider each way; under the limb's
     root, above the cut, the span is the limb's own: nothing of his body was ever drawn behind it) */
  const unknown = new Uint8Array(G), rv = new Float32Array(G), known = new Uint8Array(G);
  for (let r = 0; r < nSr; r++) { let lo = nTh, hi = -1; for (let k = 0; k < nTh; k++) if (bad[node(r, k)]) { lo = Math.min(lo, k); hi = Math.max(hi, k); }
    if (hi >= 0) for (let k = Math.max(0, lo - 1); k <= Math.min(nTh - 1, hi + 1); k++) unknown[node(r, k)] = 1; }
  /* (and the span of each row is no narrower than the rows two either side of it: a ragged edge of the old paint is not kept) */
  { const u2 = unknown.slice(); for (let r = 0; r < nSr; r++) for (let k = 0; k < nTh; k++) { if (u2[node(r, k)]) continue; let up = false, dn = false; for (let d = 1; d <= 2; d++) { if (r - d >= 0 && u2[node(r - d, k)]) up = true; if (r + d < nSr && u2[node(r + d, k)]) dn = true; } if (up && dn) unknown[node(r, k)] = 1; } }
  /* (a node the scan drew: its reach is the upper quarter of the clean points round it, the surface that is seen. A
     node with nothing clean round it and no torn span over it lies off his body: it is neither) */
  for (let g = 0; g < G; g++) { if (unknown[g]) continue; const a = sup[g]; if (a.length >= 2) { a.sort((p, q) => p - q); rv[g] = a[Math.min(a.length - 1, Math.floor(a.length * 0.75))]; known[g] = 1; } }
  /* (a node of neither kind shut in by the new surface is the new surface's) */
  for (let pass = 0; pass < 3; pass++) for (let r = 0; r < nSr; r++) for (let k = 0; k < nTh; k++) { const g = node(r, k); if (unknown[g] || known[g]) continue; let c = 0; if (r > 0 && unknown[node(r - 1, k)]) c++; if (r + 1 < nSr && unknown[node(r + 1, k)]) c++; if (k > 0 && unknown[node(r, k - 1)]) c++; if (k + 1 < nTh && unknown[node(r, k + 1)]) c++; if (c >= 2) unknown[g] = 1; }
  /* the new surface's reach at every unknown node: a membrane held by the known nodes round it (each the mean of its
     four neighbours, to rest; an edge of the grid is free), then eased once more so no crease stands where it meets them */
  { let seed = 0, cnt = 0; for (let g = 0; g < G; g++) if (known[g]) { seed += rv[g]; cnt++; } seed /= cnt || 1; for (let g = 0; g < G; g++) if (!known[g]) rv[g] = seed;
    const live = (g) => known[g] || unknown[g];
    for (let it = 0; it < 6000; it++) { let mv = 0; for (let r = rowSolve; r < nSr; r++) for (let k = 0; k < nTh; k++) { const g = node(r, k); if (!unknown[g]) continue; let a = 0, c = 0;
        if (r > rowSolve && live(node(r - 1, k))) { a += rv[node(r - 1, k)]; c++; } if (r + 1 < nSr && live(node(r + 1, k))) { a += rv[node(r + 1, k)]; c++; } if (k > 0 && live(node(r, k - 1))) { a += rv[node(r, k - 1)]; c++; } if (k + 1 < nTh && live(node(r, k + 1))) { a += rv[node(r, k + 1)]; c++; }
        if (!c) continue; const nv = rv[g] + (a / c - rv[g]) * 1.6; mv = Math.max(mv, Math.abs(nv - rv[g])); rv[g] = nv; } if (mv < 2e-6) break; } }
  /* (above the solve's top row the surface runs on up inside his shoulder, drawing in toward his middle: it closes
     the hollow behind the limb's root and never stands proud of it) */
  for (let r = rowSolve - 1; r >= 0; r--) for (let k = 0; k < nTh; k++) { const g = node(r, k); rv[g] = rv[node(rowSolve, k)] - TAPER * (rowSolve - r) * DS; }
  /* which cells are drawn: every cell with an unknown corner, and the ring of cells round those (the new surface runs
     a little way in under the scan's own, `tuck` beneath it, so no gap opens along the old surface's cut edge) */
  const nCs = nSr - 1, nCt = nTh - 1, cellOn = new Uint8Array(nCs * nCt), cellCore = new Uint8Array(nCs * nCt);
  for (let r = 0; r < nCs; r++) for (let k = 0; k < nCt; k++) { const any = unknown[node(r, k)] || unknown[node(r, k + 1)] || unknown[node(r + 1, k)] || unknown[node(r + 1, k + 1)];
    const all = unknown[node(r, k)] && unknown[node(r, k + 1)] && unknown[node(r + 1, k)] && unknown[node(r + 1, k + 1)];
    if (r < rowSolve) { /* above the solve: only the columns that are unknown on its top row */ if (unknown[node(rowSolve, k)] || unknown[node(rowSolve, k + 1)]) cellOn[r * nCt + k] = 1; continue; }
    const liveAll = (known[node(r, k)] || unknown[node(r, k)]) && (known[node(r, k + 1)] || unknown[node(r, k + 1)]) && (known[node(r + 1, k)] || unknown[node(r + 1, k)]) && (known[node(r + 1, k + 1)] || unknown[node(r + 1, k + 1)]);
    if (any && liveAll) cellOn[r * nCt + k] = 1; if (all) cellCore[r * nCt + k] = 1; }
  { const c2 = cellOn.slice(); for (let r = rowSolve; r < nCs; r++) for (let k = 0; k < nCt; k++) { if (c2[r * nCt + k]) continue; let nb = false; for (let dr = -1; dr <= 1; dr++) for (let dk = -1; dk <= 1; dk++) { const rr2 = r + dr, kk = k + dk; if (rr2 >= rowSolve && rr2 < nCs && kk >= 0 && kk < nCt && c2[rr2 * nCt + kk]) nb = true; } if (nb && known[node(r, k)] && known[node(r, k + 1)] && known[node(r + 1, k)] && known[node(r + 1, k + 1)]) cellOn[r * nCt + k] = 1; } }
  /* every node's place, bones and normal */
  const posL = new Float32Array(G * 3), frm = new Float32Array(G * 3), v = new THREE.Vector3(), nrot = new THREE.Matrix3().setFromMatrix4(Q.wi);
  for (let r = 0; r < nSr; r++) for (let k = 0; k < nTh; k++) { const g = node(r, k), t = (TH0 + k * DTH) * Math.PI / 180, R0 = rv[g] - (known[g] ? TUCK : 0), s = S_TOP + r * DS, y = YC + R0 * Math.sin(t), x = XC - R0 * Math.cos(t);
    frm[g * 3] = s; frm[g * 3 + 1] = x; frm[g * 3 + 2] = y; v.copy(A).addScaledVector(axis, s).addScaledVector(INW, x).addScaledVector(SIDE, y).applyMatrix4(Q.wi); posL[g * 3] = v.x; posL[g * 3 + 1] = v.y; posL[g * 3 + 2] = v.z; }
  const nrmL = new Float32Array(G * 3), pa = new THREE.Vector3(), pb = new THREE.Vector3(), pc = new THREE.Vector3(), pd = new THREE.Vector3(), nn = new THREE.Vector3(), outw = new THREE.Vector3();
  const P3 = (g, o) => o.set(posL[g * 3], posL[g * 3 + 1], posL[g * 3 + 2]);
  for (let r = 0; r < nSr; r++) for (let k = 0; k < nTh; k++) { const g = node(r, k); P3(node(Math.max(0, r - 1), k), pa); P3(node(Math.min(nSr - 1, r + 1), k), pb); P3(node(r, Math.max(0, k - 1)), pc); P3(node(r, Math.min(nTh - 1, k + 1)), pd);
    nn.copy(pb.sub(pa)).cross(pd.sub(pc)).normalize(); const t = (TH0 + k * DTH) * Math.PI / 180; outw.set(0, 0, 0).addScaledVector(INW, -Math.cos(t)).addScaledVector(SIDE, Math.sin(t)).applyMatrix3(nrot).normalize();
    if (nn.dot(outw) < 0) nn.negate(); nrmL[g * 3] = nn.x; nrmL[g * 3 + 1] = nn.y; nrmL[g * 3 + 2] = nn.z; }
  /* bones: the mean of the eight nearest clean points of his body (none rides the limb), by nearness; the four that count most are kept */
  const bodyDon = []; for (let i = 0; i < nOld; i++) if (Q.w[i] < 0.02 && !flatPt[i] && Q.s[i] > S_TOP - 0.08 && Q.s[i] < S_BOT + 0.06 && rr[i] < 0.3 && th[i] > TH0 - 25 && th[i] < TH1 + 25) bodyDon.push(i);
  const nodeJ = new Uint16Array(G * 4), nodeW = new Float32Array(G * 4), jj = [0, 0, 0, 0], ww = [0, 0, 0, 0];
  const usedNode = new Uint8Array(G); for (let r = 0; r < nCs; r++) for (let k = 0; k < nCt; k++) if (cellOn[r * nCt + k]) { usedNode[node(r, k)] = usedNode[node(r, k + 1)] = usedNode[node(r + 1, k)] = usedNode[node(r + 1, k + 1)] = 1; }
  for (let g = 0; g < G; g++) { if (!usedNode[g]) continue; const s = frm[g * 3], x = frm[g * 3 + 1], y = frm[g * 3 + 2], best = [];
    for (const i of bodyDon) { const d = (Q.s[i] - s) ** 2 + (Q.x[i] - x) ** 2 + (Q.y[i] - y) ** 2; if (best.length < 8) { best.push([d, i]); if (best.length === 8) best.sort((p, q) => p[0] - q[0]); } else if (d < best[7][0]) { best[7] = [d, i]; best.sort((p, q) => p[0] - q[0]); } }
    const acc = new Map(); for (const [d, i] of best) { const k = 1 / (Math.sqrt(d) + 0.004); Q.J.getElement(i, jj); Q.W.getElement(i, ww); const sum = ww[0] + ww[1] + ww[2] + ww[3] || 1; for (let c = 0; c < 4; c++) if (ww[c] > 0) acc.set(jj[c], (acc.get(jj[c]) || 0) + k * ww[c] / sum); }
    const top = [...acc.entries()].sort((p, q) => q[1] - p[1]).slice(0, 4), tot = top.reduce((a, e) => a + e[1], 0) || 1; for (let c = 0; c < 4; c++) { nodeJ[g * 4 + c] = top[c] ? top[c][0] : 0; nodeW[g * 4 + c] = top[c] ? top[c][1] / tot : 0; } }
  /* paint: one texel a triangle. Of the sixteen clean points of its kind nearest it, the one whose colour is nearest
     their mean: an even tone, no blotch of one odd texel */
  const don = { S: [], R: [] };
  /* (the robe's paint from its bright texels only: the scan painted every fold's shadow into the cloth, and a new
     surface drawn from those is blotched grey; its own shading is the light's) */
  const RB_MIN = +arg('siderobemin', 226);
  for (let i = 0; i < nOld; i++) { if (flatPt[i] || Q.s[i] < S_TOP - 0.1 || Q.s[i] > S_BOT + 0.1 || rr[i] > 0.34) continue; const uv = T.getElement(i, uvA); if (!flatNormal(uv[0], uv[1])) continue;
    if (knd[i] === 2 && Q.w[i] < 0.02) { if (Math.min(colr[i * 3], colr[i * 3 + 1], colr[i * 3 + 2]) >= RB_MIN) don.R.push(i); } else if (knd[i] === 1) don.S.push(i); }
  /* (the robe's new surface is ONE texel's white, the middle one of the clean cloth round it: its shading is all the light's) */
  let robeOne = -1; if (don.R.length) { const med = [0, 1, 2].map(c => { const a = don.R.map(i => colr[i * 3 + c]).sort((p, q) => p - q); return a[a.length >> 1]; }); let bd = Infinity;
    for (const i of don.R) { const d = (colr[i * 3] - med[0]) ** 2 + (colr[i * 3 + 1] - med[1]) ** 2 + (colr[i * 3 + 2] - med[2]) ** 2; if (d < bd) { bd = d; robeOne = i; } } }
  if (!don.R.length || !don.S.length) { console.error('--side: no clean robe or no clean skin near the limb to take paint from'); process.exit(3); }
  const pick = (list, s, x, y) => { const best = []; for (const i of list) { const d = (Q.s[i] - s) ** 2 + (Q.x[i] - x) ** 2 + (Q.y[i] - y) ** 2; if (best.length < 16) { best.push([d, i]); if (best.length === 16) best.sort((p, q) => p[0] - q[0]); } else if (d < best[15][0]) { best[15] = [d, i]; best.sort((p, q) => p[0] - q[0]); } }
    let m0 = 0, m1 = 0, m2 = 0; for (const [, i] of best) { m0 += colr[i * 3]; m1 += colr[i * 3 + 1]; m2 += colr[i * 3 + 2]; } m0 /= best.length; m1 /= best.length; m2 /= best.length;
    let b = best[0][1], bd = Infinity; for (const [, i] of best) { const d = (colr[i * 3] - m0) ** 2 + (colr[i * 3 + 1] - m1) ** 2 + (colr[i * 3 + 2] - m2) ** 2; if (d < bd) { bd = d; b = i; } } return b; };
  /* (the limb's new inner side takes the same matched paint: drawn from its nearest own point it took whatever an
     earlier round had painted there, paler than the arm round it, a pale band up his inner arm when it is raised) */
  if (!DRY && shellBase >= 0) for (let t = 0; t < shellCen.length; t++) { const c = shellCen[t], d = pick(don.S, c[0], c[1], c[2]), uv = T.getElement(d, [0, 0]); for (let k = 0; k < 3; k++) T.setElement(shellBase + t * 3 + k, uv); }
  /* a corner of a new triangle: a node, or a point on an edge between two (everything it carries mixed) */
  const cornerOf = (g) => ({ P: [posL[g * 3], posL[g * 3 + 1], posL[g * 3 + 2]], N: [nrmL[g * 3], nrmL[g * 3 + 1], nrmL[g * 3 + 2]], J: [nodeJ[g * 4], nodeJ[g * 4 + 1], nodeJ[g * 4 + 2], nodeJ[g * 4 + 3]], W: [nodeW[g * 4], nodeW[g * 4 + 1], nodeW[g * 4 + 2], nodeW[g * 4 + 3]],
    s: frm[g * 3], x: frm[g * 3 + 1], y: frm[g * 3 + 2], f: frm[g * 3] - edgeAt(TH0 + (g % nTh) * DTH) });
  const mixC = (A2, B2, t) => { const L = (p, q) => p.map((vv, k) => vv + (q[k] - vv) * t), nz = (vv) => { const l = Math.hypot(vv[0], vv[1], vv[2]) || 1; return [vv[0] / l, vv[1] / l, vv[2] / l]; };
    const w = new Map(); A2.J.forEach((j, k) => w.set(j, (w.get(j) || 0) + A2.W[k] * (1 - t))); B2.J.forEach((j, k) => w.set(j, (w.get(j) || 0) + B2.W[k] * t));
    const top = [...w.entries()].filter(e => e[1] > 0).sort((p, q) => q[1] - p[1]).slice(0, 4), sum = top.reduce((a, e) => a + e[1], 0) || 1; while (top.length < 4) top.push([0, 0]);
    return { P: L(A2.P, B2.P), N: nz(L(A2.N, B2.N)), J: top.map(e => e[0]), W: top.map(e => e[1] / sum), s: A2.s + (B2.s - A2.s) * t, x: A2.x + (B2.x - A2.x) * t, y: A2.y + (B2.y - A2.y) * t, f: 0 }; };
  const add = { P: [], N: [], T: [], TG: [], J: [], W: [] }, outIdx = []; let nAdd = 0;
  const tanL = new THREE.Vector3().copy(axis).applyMatrix3(nrot).normalize();
  const emit = (a, b, c, side) => { const d = side === 'R' ? robeOne : pick(don.S, (a.s + b.s + c.s) / 3, (a.x + b.x + c.x) / 3, (a.y + b.y + c.y) / 3), uv = T.getElement(d, [0, 0]);
    /* (wound to face outward: against the mean of its corners' normals) */
    pa.fromArray(a.P); pb.fromArray(b.P); pc.fromArray(c.P); nn.copy(pb).sub(pa).cross(pd.copy(pc).sub(pa)); const flip = nn.x * (a.N[0] + b.N[0] + c.N[0]) + nn.y * (a.N[1] + b.N[1] + c.N[1]) + nn.z * (a.N[2] + b.N[2] + c.N[2]) < 0;
    for (const q of (flip ? [a, c, b] : [a, b, c])) { add.P.push(...q.P); add.N.push(...q.N); add.T.push(uv[0], uv[1]); if (TG) add.TG.push(tanL.x, tanL.y, tanL.z, 1); add.J.push(...q.J); add.W.push(...q.W); outIdx.push(n0 + nAdd); nAdd++; }
    sideNew++; if (side === 'R') sideRobe++; else sideSkin++; };
  const cut3 = (V) => { const f = V.map(q => q.f); if (f.every(u => u >= 0)) return emit(V[0], V[1], V[2], 'R'); if (f.every(u => u < 0)) return emit(V[0], V[1], V[2], 'S');
    const lone = f.filter(u => u >= 0).length === 1 ? f.findIndex(u => u >= 0) : f.findIndex(u => u < 0), i0 = lone, i1 = (lone + 1) % 3, i2 = (lone + 2) % 3;
    const m1 = mixC(V[i0], V[i1], f[i0] / (f[i0] - f[i1])), m2 = mixC(V[i0], V[i2], f[i0] / (f[i0] - f[i2])), sl = f[i0] >= 0 ? 'R' : 'S', st = sl === 'R' ? 'S' : 'R';
    emit(V[i0], m1, m2, sl); emit(m1, V[i1], V[i2], st); emit(m1, V[i2], m2, st); };
  for (let r = 0; r < nCs; r++) for (let k = 0; k < nCt; k++) { if (!cellOn[r * nCt + k]) continue; const a = cornerOf(node(r, k)), b = cornerOf(node(r, k + 1)), c = cornerOf(node(r + 1, k)), d = cornerOf(node(r + 1, k + 1)); cut3([a, b, c]); cut3([b, d, c]); }
  /* THE ARMPIT'S VAULT: a lid of skin in the plane of the cut, from the limb's own ring there (its new inner side) to
     his side's row there. The webs' clipped edges end in that plane and the limb's new inner side and his new side
     both pass through it, but nothing joined them: between the two the armpit was open at its top (a pinhole into his
     shoulder from the front, a slot from below). Its limb side rides the limb and its other side his body, so it
     stretches as the arm leaves his side, as an armpit's skin does; drawn on both faces (seen from in front and behind) */
  let lidTris = 0;
  { const rowL = Math.round((CUT - S_TOP) / DS), H = hulls[Math.max(0, Math.min(nH - 1, Math.round(CUT / HS)))]; let kA = nTh, kB = -1;
    /* (only where his side is bare at the cut: where the robe's edge stands above it the lid would lay a strip of skin on the cloth) */
    for (let k = 0; k < nTh; k++) if (unknown[node(rowL, k)] && edgeAt(TH0 + k * DTH) > CUT + 0.004) { kA = Math.min(kA, k); kB = Math.max(kB, k); }
    if (H && kB > kA) { const M = kB - kA, axL = new THREE.Vector3().copy(axis).applyMatrix3(nrot).normalize().toArray(), armDon = [];
      for (let i = 0; i < nOld; i++) if (Q.w[i] >= 0.9 && Math.abs(Q.s[i] - CUT) < 0.03) armDon.push(i);
      const lidS = [], lidW = [];
      /* (the lid joins the limb's INNER side only, `lidlo` to `lidhi` degrees: run on round to the limb's outer side
         its end triangles were long slivers, spikes under the arm when it is raised) */
      const LID_LO = +arg('lidlo', -75), LID_HI = +arg('lidhi', 55);
      for (let j = 0; j <= M; j++) { const ph = (LID_LO + (LID_HI - LID_LO) * j / M) * Math.PI / 180, c = Math.cos(ph), sn = Math.sin(ph), rho = ray(H, c, sn) + SH_OUT, x = rho * c, y = rho * sn;
        let bi = armDon[0], bd = Infinity; for (const i of armDon) { const d = (Q.s[i] - CUT) ** 2 + (Q.x[i] - x) ** 2 + (Q.y[i] - y) ** 2; if (d < bd) { bd = d; bi = i; } }
        v.copy(A).addScaledVector(axis, CUT).addScaledVector(INW, x).addScaledVector(SIDE, y).applyMatrix4(Q.wi);
        lidS.push({ P: v.toArray(), N: axL, J: Q.J.getElement(bi, [0, 0, 0, 0]), W: Q.W.getElement(bi, [0, 0, 0, 0]), s: CUT, x, y, f: -1 }); lidW.push({ ...cornerOf(node(rowL, kA + j)), N: axL, f: -1 }); }
      for (let j = 0; j < M; j++) for (const sgn of [1, -1]) { const tn = (q) => ({ ...q, N: q.N.map(u => u * sgn) }); emit(tn(lidS[j]), tn(lidS[j + 1]), tn(lidW[j]), 'S'); emit(tn(lidS[j + 1]), tn(lidW[j + 1]), tn(lidW[j]), 'S'); lidTris += 2; } } }
  /* the old surface out, where the new one stands in for all of it: every triangle of his body (no corner rides the
     limb by half) below the cut whose middle lies in a cell all four of whose corners the scan never drew */
  const keep = [];
  for (let t = 0; t < nT; t++) { const a = ix[t * 3], b = ix[t * 3 + 1], c = ix[t * 3 + 2]; let gone = false;
    if (a < nOld && b < nOld && c < nOld && Q.w[a] < 0.5 && Q.w[b] < 0.5 && Q.w[c] < 0.5) { const cs = (Q.s[a] + Q.s[b] + Q.s[c]) / 3, cy = (Q.y[a] + Q.y[b] + Q.y[c]) / 3 - YC, cx = (Q.x[a] + Q.x[b] + Q.x[c]) / 3 - XC, ct = Math.atan2(cy, -cx) * 180 / Math.PI, cr = Math.hypot(cy, cx);
      if (cs >= S_SOLVE && cr > 0.07 && cr < 0.24) { const r = Math.floor((cs - S_TOP) / DS), k = Math.floor((ct - TH0) / DTH); if (r >= 0 && r < nCs && k >= 0 && k < nCt && cellCore[r * nCt + k]) gone = true; } }
    if (gone) sideGone++; else keep.push(a, b, c); }
  if (!DRY && nAdd) { const grow = (acc, vals, size) => { if (!acc) return; const old = acc.getArray(), arr = new (old.constructor)(old.length + nAdd * size); arr.set(old); acc.setArray(arr); for (let i = 0; i < nAdd; i++) acc.setElement(n0 + i, vals.slice(i * size, i * size + size)); };
    grow(Q.P, add.P, 3); grow(N, add.N, 3); grow(T, add.T, 2); if (TG) grow(TG, add.TG, 4); grow(Q.J, add.J, 4); grow(Q.W, add.W, 4);
    for (const sm of sem) { const a = pr.getAttribute(sm); if (a.getCount() !== n0 + nAdd) { console.error('the part has an attribute this does not grow: ' + sm); process.exit(3); } }
    Q.I.setArray(new Uint32Array(keep.concat(outIdx))); }
  let nUnk = 0, nKn = 0; for (let g = 0; g < G; g++) { if (unknown[g]) nUnk++; else if (known[g]) nKn++; }
  if (lidTris) report.push(`${Q.name}: the armpit's vault: ${lidTris} triangles (both faces) in the plane of the cut, from the limb's ring to his side`);
  report.push(`${Q.name}: his side under the arm: ${sideNew - lidTris} new triangles (${sideSkin} skin above the robe's edge, ${sideRobe} robe below it) on a grid of ${nTh} by ${nSr} (${nUnk} nodes the scan never drew, ${nKn} it did); ${sideGone} old triangles out; paint lent by ${don.R.length} clean points of robe and ${don.S.length} of skin, bones by ${bodyDon.length}`);
  if (arg('sidemap', '')) { const rows = []; for (let r = 0; r < nSr; r++) { let row = ''; for (let k = 0; k < nTh; k++) { const g = node(r, k); row += unknown[g] ? (bad[g] ? '#' : '+') : known[g] ? 'o' : ' '; } rows.push(`${((S_TOP + r * DS) * 100).toFixed(1).padStart(5)} ${row}  ${[0, 0.25, 0.5, 0.75, 1].map(u => (rv[node(r, Math.round(u * (nTh - 1)))] * 100).toFixed(1)).join(' ')}`); } (await import('node:fs')).writeFileSync(arg('sidemap', ''), rows.join('\n') + '\n'); }
}
console.log(`${BONE} (${(LEN * 100).toFixed(1)} cm): cut from ${(CUT * 100).toFixed(1)} cm, laid on from ${(FROM * 100).toFixed(1)} (whole at ${(FULL * 100).toFixed(1)}) to ${(TO * 100).toFixed(1)} cm; outline within ${CAP} of the outer radius; margin ${(MARGIN * 1000).toFixed(0)} mm`);
for (const r of report) console.log('  ' + r);
const byS = (o) => Object.keys(o).map(Number).sort((a, b) => a - b).map(k => `${k}: ${o[k]}`).join(' | ');
console.log(`  triangles taken, by centimetre along the bone: ${byS(tookBy) || 'none'}`);
console.log(`  points laid on, by centimetre along the bone: ${byS(movedBy) || 'none'}; the furthest came in ${(far * 100).toFixed(1)} cm`);
if (!DRY) { await io.write(OUT_FILE, doc); console.log(`wrote ${OUT_FILE}`); } else console.log(`dry: nothing written (${took} triangles, ${moved} points)`);
