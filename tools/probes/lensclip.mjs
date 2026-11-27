/* v29.0 · THE LENS INSIDE A SOLID, MEASURED (Chad, 27 Nov 2026, R15 of docs/V29.0-E5C1-PLAN.md: "Also check for all kinds of
   clipping"; the tracker's CP9.3a, kind 6). A picture shows a lens through a wall only where someone looked; this measures
   every moment. GENERIC: any chapter, any film key, every phase of play.

   At each moment (a film sought to it, or play with the look set to it), every VISIBLE surface near the lens is taken in
   the world as it stands: each placed model (its group), each copy of an instanced one (by its own matrix), each person
   AS POSED on that moment (every skinned mesh, whatever its key: the skin moved by its bones), each separate piece of a
   merged mesh the chapter built in code (its triangles that share corners): clipscan.mjs's own idea of an OBJECT, with its
   labels, so the two read alike. Then two tests:
     NEAR   the frustum's tip, the pyramid from the eye to the near plane's rectangle (camera.near, the lens's angle, its
            shape): every triangle clipped against its five faces; anything left is a surface the near plane cuts (`cut`:
            it reaches the near rectangle, so a solid is seen sliced open) or that stands wholly between the eye and the
            near plane (the lens sees PAST it: through a wall). depth = how far it comes in front of the near plane (m).
     INSIDE the eye inside a closed thing: seven rays from the eye, each crossing counted (odd: inside, by parity) and
            the first surface met read for its side (a solid is met from within on its BACK faces; a room around the
            lens is met on its front ones): inside when at least 5 of 7 rays are odd and meet a back face first; a
            double-sided thing, whose side says nothing, when all 7 are odd and its smallest extent is under 1.5 m (so
            a room is not read as a solid). depth = the nearest surface met (m).
   Glows are left out (additive blending, sprites, points), as are lines; a see-through surface (glass) is kept, marked.

     ENC_DIST=<snap> CHROMIUM_PATH=... CH=e5c1 [VIEW=phone|desktop|both] [STEP=0.25]
       [FILMS=open,keepsake@room:w,l,p,g,h,k,v!,cord@breaking,home@breaking,end:A] [ASK=ask]
       [PHASES=room,breaking,night,night:u,ask] [PITCH='room=-1.05..0.55;breaking=-1.05..0.55;night=-0.9..0.6']
       [WALK=night:u] [PICS='end:A@12.5,40;play:room@0.55,-0.5'] [DPR=1] [SETTLE=1200] [OUT=dir] node tools/probes/lensclip.mjs
   A film job: `open` (Start pressed), `end:X` (the decision's bookmark ASK applied and option X pressed as a finger or a
   click presses it), `<key>@<phase>` (the phase applied, the black let down, then kit.film(key)), `<key>@<phase>!` (the
   phase hands to the film itself). VIEW=both measures every film moment twice from one phone page: at a phone's shape and
   at a desk's (camera.aspect 1.6 set before the seek, so the film's own frame chooses its lens by it). Play is measured at
   the page's own shape (run it once a VIEW). PHASES: each phase applied, then the look swept over its limits: the yaw's
   found by turning the lens past them and reading where the chapter's frame holds it (a lying or kneeling pose clamps
   it), the pitch's from PITCH (the engine clamps pitch only on input: -1.2..1.2 standing, the chapter's own numbers
   otherwise). WALK: in those phases the ground he can reach is flooded from where he stands (the engine's own collision,
   collideAt, a 0.1 m grid), and at every edge of it the eye is put as close to the blocker as the collision lets it go,
   and the look swept there too.
   CHECK=1 (the proof, never on the real chapter): ON A THROWAWAY COPY OF THE PAGE'S WORLD, a wall is laid 3 cm in front of
   the lens, a box laid round the eye, and a room laid round the eye (front faces in), and each must read as it is: the
   wall NEAR, the box INSIDE, the room nothing; then all three are taken away again.
   The other probe of the two, coplanar.mjs, takes this file's in-page gathering (LIB) and its way of reaching a film. */
import { chromium } from 'playwright';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { LAUNCH, PAGE, toPlay } from '../../testlib.mjs';

/* ---------------- THE GATHERING, in the page (window.__clip) ---------------- */
export const LIB = () => {
  if (window.__clip) return;
  const E = window.__enc, scene = E.scene, cam = E.camera, V3 = cam.position.constructor;
  const lib = window.__clip = {};
  const layer = (q) => q === scene || (q.children && q.children.length > 25);
  const rootOf = (o) => { let q = o; while (q.parent && !layer(q.parent)) { if (q.userData && q.userData.model) return q; q = q.parent; } return q; };
  const visibleChain = (o) => { for (let q = o; q; q = q.parent) if (!q.visible) return false; return true; };
  const inScene = (o) => { let q = o; while (q.parent) q = q.parent; return q === scene; };
  const castNames = () => { const m = new Map();
    try { const C = E.stage.dbg.cast || {}; for (const k in C) { const P = C[k]; if (Array.isArray(P)) P.forEach((q, i) => q && q.group && m.set(q.group, 'cast:' + k + i)); else if (P && P.group) m.set(P.group, 'cast:' + k); } } catch (e) {}
    return m; };
  const labelOf = (o, root, cn) => {
    const mat = Array.isArray(o.material) ? o.material[0] : o.material;
    const names = []; root.traverse(q => { if (q.isMesh && q.name && names.length < 2 && !names.includes(q.name)) names.push(q.name); });
    return [cn.get(root) || '', root.name || '', o.isSkinnedMesh ? 'person' : '', names.join(','), mat && mat.name ? 'mat:' + mat.name : '', mat && mat.color ? 'col:' + mat.color.getHexString() : '',
            mat && mat.transparent ? 'see-through' : ''].filter(Boolean).join(' ');
  };
  /* (clipscan's: the parts of one instanced call are one thing, named by the copies' placements relative to the first) */
  const sigs = new Map();
  const sigOf = (im) => { let s = sigs.get(im); if (s && s.n === im.count) return s.s;
    const m0 = new cam.matrixWorld.constructor(), mj = m0.clone(), inv = m0.clone(); im.getMatrixAt(0, m0); inv.copy(m0).invert();
    s = im.name + '|' + im.count;
    for (let j = 1; j < im.count; j++) { im.getMatrixAt(j, mj); mj.multiply(inv); s += '|' + mj.elements[12].toFixed(2) + ',' + mj.elements[14].toFixed(2); }
    if (im.count === 1) s += '@' + Math.round(m0.elements[12] / 3) + ',' + Math.round(m0.elements[14] / 3);
    sigs.set(im, { s, n: im.count }); return s; };
  const cache = new Map();              // mesh.uuid#k -> { sig, W, pc, pbox }  (a still thing's world corners, kept)
  const va = new V3(), m4 = cam.matrixWorld.clone(), mi = cam.matrixWorld.clone(), cs = new V3();
  const matSig = (m) => { const e = m.elements; let s = ''; for (let i = 0; i < 16; i++) s += e[i].toFixed(5) + ','; return s; };
  const sideOf = (mat) => (mat ? mat.side : 0);   // 0 front, 1 back, 2 double
  /* every visible mesh (and copy) whose bounding sphere comes within r of the point: its world triangles */
  lib.near = (pt, r, o = {}) => {
    scene.updateMatrixWorld(true);
    const cn = castNames(), out = [];
    scene.traverse(q => {
      if (!q.isMesh || !visibleChain(q)) return;
      if (o.still && q.isSkinnedMesh) return;                                   // (coplanar's moments that meet no people)
      const mats = Array.isArray(q.material) ? q.material : [q.material], mat = mats[0];
      if (!mat || mat.visible === false) return;
      if (mat.blending === 2 && !o.fx) return;                                   // additive glows: light, not things
      if (!o.fx && mat.transparent && mat.depthWrite === false && !(mat.opacity > 0.2)) return;
      if (mat.colorWrite === false && mat.depthWrite === false) return;
      const g = q.geometry; if (!g || !g.attributes.position) return;
      if (!g.boundingSphere) g.computeBoundingSphere();
      const inst = q.isInstancedMesh ? q.count : 1, root = rootOf(q), pos = g.attributes.position;
      const idx = g.index ? g.index.array : null, nT = idx ? Math.floor(idx.length / 3) : Math.floor(pos.count / 3);
      let posed = false;
      for (let k = 0; k < inst; k++) {
        m4.copy(q.matrixWorld);
        if (q.isInstancedMesh) { q.getMatrixAt(k, mi); if (Math.abs(mi.determinant()) < 1e-12) continue; m4.multiply(mi); }
        /* the sphere: the rig's own culling sphere for a person (set round every pose, v8.4), with room to spare */
        let sph = g.boundingSphere, rad, extra = 0;
        if (q.isSkinnedMesh) { if (q.boundingSphere && q.boundingSphere.radius > sph.radius) sph = q.boundingSphere; extra = 0.4; }
        cs.copy(sph.center).applyMatrix4(m4); rad = sph.radius * m4.getMaxScaleOnAxis() + extra;
        if (cs.distanceTo(pt) > rad + r) continue;
        const key = q.uuid + '#' + k, sig = q.isSkinnedMesh ? null : matSig(m4);
        let C = cache.get(key);
        if (!C || q.isSkinnedMesh || C.sig !== sig || C.n !== pos.count) {
          if (q.isSkinnedMesh && !posed) { if (q.skeleton) q.skeleton.update(); posed = true; }
          const W = new Float32Array(pos.count * 3);
          for (let i = 0; i < pos.count; i++) { if (q.isSkinnedMesh) q.getVertexPosition(i, va); else va.fromBufferAttribute(pos, i);
            va.applyMatrix4(m4); W[i * 3] = va.x; W[i * 3 + 1] = va.y; W[i * 3 + 2] = va.z; }
          /* a merged piece the chapter built in code (a nameless mesh straight under a layer): split by the corners its
             triangles share, welded at a millimetre (clipscan's) */
          let pc = null;
          if (!q.isInstancedMesh && !q.isSkinnedMesh && root === q && !q.name) {
            const P = new Int32Array(pos.count); for (let i = 0; i < P.length; i++) P[i] = i;
            const find = (i) => { while (P[i] !== i) { P[i] = P[P[i]]; i = P[i]; } return i; };
            const unite = (a, c) => { a = find(a); c = find(c); if (a !== c) P[a] = c; };
            const at = new Map();
            for (let i = 0; i < pos.count; i++) { const kk = Math.round(W[i * 3] * 1000) + ',' + Math.round(W[i * 3 + 1] * 1000) + ',' + Math.round(W[i * 3 + 2] * 1000);
              const j = at.get(kk); if (j === undefined) at.set(kk, i); else unite(i, j); }
            for (let t = 0; t < nT; t++) { const i0 = idx ? idx[t * 3] : t * 3, i1 = idx ? idx[t * 3 + 1] : t * 3 + 1, i2 = idx ? idx[t * 3 + 2] : t * 3 + 2; unite(i0, i1); unite(i1, i2); }
            pc = new Int32Array(pos.count); for (let i = 0; i < pos.count; i++) pc[i] = find(i);
          }
          C = { sig, W, pc, n: pos.count }; if (!q.isSkinnedMesh) cache.set(key, C);
        }
        const flip = (m4.determinant() < 0) !== (sideOf(mat) === 1);
        const lab = (q.isInstancedMesh ? q.name + ' #' + k + ' ' : '') + labelOf(q, root, cn);
        out.push({ mesh: q, k, mat, mats, root, W: C.W, pc: C.pc, idx, nT, flip, double: sideOf(mat) === 2,
                   rk: q.isInstancedMesh ? 'I' + sigOf(q) + '#' + k : (C.pc ? 'M' + q.uuid : 'R' + root.uuid), label: lab, skinned: !!q.isSkinnedMesh,
                   groups: g.groups && g.groups.length > 1 ? g.groups : null });
      }
    });
    return out;
  };
  lib.tri = (en, t) => { const i0 = en.idx ? en.idx[t * 3] : t * 3, i1 = en.idx ? en.idx[t * 3 + 1] : t * 3 + 1, i2 = en.idx ? en.idx[t * 3 + 2] : t * 3 + 2; return [i0, i1, i2]; };
  lib.objKey = (en, i0) => en.pc ? en.rk + '#' + en.pc[i0] : en.rk;
  lib.visibleChain = visibleChain; lib.inScene = inScene;

  /* ---------------- THE LENS (kind 6) ---------------- */
  const RAYS = [[0.577, 0.611, 0.542], [-0.613, 0.389, 0.688], [0.402, -0.701, 0.589], [-0.55, -0.48, -0.683],
                [0.8, 0.13, -0.585], [-0.17, 0.93, -0.326], [0.287, -0.33, -0.899]].map(v => { const L = Math.hypot(...v); return v.map(x => x / L); });
  const rayTri = (o, d, W, i0, i1, i2) => {      // Möller–Trumbore: the distance along the ray, and the triangle's winding normal's dot with d
    const ax = W[i0 * 3], ay = W[i0 * 3 + 1], az = W[i0 * 3 + 2];
    const e1x = W[i1 * 3] - ax, e1y = W[i1 * 3 + 1] - ay, e1z = W[i1 * 3 + 2] - az, e2x = W[i2 * 3] - ax, e2y = W[i2 * 3 + 1] - ay, e2z = W[i2 * 3 + 2] - az;
    const px = d[1] * e2z - d[2] * e2y, py = d[2] * e2x - d[0] * e2z, pz = d[0] * e2y - d[1] * e2x, det = e1x * px + e1y * py + e1z * pz;
    if (Math.abs(det) < 1e-14) return null;
    const inv = 1 / det, sx = o[0] - ax, sy = o[1] - ay, sz = o[2] - az, u = (sx * px + sy * py + sz * pz) * inv; if (u < 0 || u > 1) return null;
    const qx = sy * e1z - sz * e1y, qy = sz * e1x - sx * e1z, qz = sx * e1y - sy * e1x, v = (d[0] * qx + d[1] * qy + d[2] * qz) * inv; if (v < 0 || u + v > 1) return null;
    const t = (e2x * qx + e2y * qy + e2z * qz) * inv; if (t <= 1e-6) return null;
    const nx = e1y * e2z - e1z * e2y, ny = e1z * e2x - e1x * e2z, nz = e1x * e2y - e1y * e2x;
    return [t, nx * d[0] + ny * d[1] + nz * d[2]];
  };
  /* the distance from a point to a triangle (Ericson's closest point) */
  const ptTri = (p, W, i0, i1, i2) => {
    const a = [W[i0 * 3], W[i0 * 3 + 1], W[i0 * 3 + 2]], b = [W[i1 * 3], W[i1 * 3 + 1], W[i1 * 3 + 2]], c = [W[i2 * 3], W[i2 * 3 + 1], W[i2 * 3 + 2]];
    const sub = (u, v) => [u[0] - v[0], u[1] - v[1], u[2] - v[2]], dot = (u, v) => u[0] * v[0] + u[1] * v[1] + u[2] * v[2];
    const ab = sub(b, a), ac = sub(c, a), ap = sub(p, a), d1 = dot(ab, ap), d2 = dot(ac, ap); let q;
    if (d1 <= 0 && d2 <= 0) q = a; else { const bp = sub(p, b), d3 = dot(ab, bp), d4 = dot(ac, bp);
      if (d3 >= 0 && d4 <= d3) q = b; else { const vc = d1 * d4 - d3 * d2;
        if (vc <= 0 && d1 >= 0 && d3 <= 0) { const v = d1 / (d1 - d3); q = [a[0] + ab[0] * v, a[1] + ab[1] * v, a[2] + ab[2] * v]; }
        else { const cp = sub(p, c), d5 = dot(ab, cp), d6 = dot(ac, cp);
          if (d6 >= 0 && d5 <= d6) q = c; else { const vb = d5 * d2 - d1 * d6;
            if (vb <= 0 && d2 >= 0 && d6 <= 0) { const w = d2 / (d2 - d6); q = [a[0] + ac[0] * w, a[1] + ac[1] * w, a[2] + ac[2] * w]; }
            else { const va = d3 * d6 - d5 * d4;
              if (va <= 0 && (d4 - d3) >= 0 && (d5 - d6) >= 0) { const w = (d4 - d3) / ((d4 - d3) + (d5 - d6)); q = [b[0] + (c[0] - b[0]) * w, b[1] + (c[1] - b[1]) * w, b[2] + (c[2] - b[2]) * w]; }
              else { const den = 1 / (va + vb + vc), v = vb * den, w = vc * den; q = [a[0] + ab[0] * v + ac[0] * w, a[1] + ab[1] * v + ac[1] * w, a[2] + ab[2] * v + ac[2] * w]; } } } } } }
    return Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]); };
  /* clip a polygon (camera space: x right, y up, d forward) by a plane f(p) >= 0, f linear */
  const clipBy = (P, f) => { const out = []; for (let i = 0; i < P.length; i++) { const a = P[i], c = P[(i + 1) % P.length], fa = f(a), fc = f(c);
      if (fa >= 0) out.push(a); if ((fa >= 0) !== (fc >= 0)) { const s = fa / (fa - fc); out.push([a[0] + (c[0] - a[0]) * s, a[1] + (c[1] - a[1]) * s, a[2] + (c[2] - a[2]) * s]); } }
    return out; };
  lib.lensAt = (o = {}) => {
    scene.updateMatrixWorld(true); cam.updateMatrixWorld(true);
    const eye = new V3(); cam.getWorldPosition(eye);
    const n = cam.near, hh = n * Math.tan(cam.fov * Math.PI / 360) / (cam.zoom || 1), hw = hh * cam.aspect;
    const reach = Math.hypot(n, hh, hw) + 0.002;
    const CLR = 0.4, EN = lib.near(eye, CLR, o), inv = cam.matrixWorldInverse;
    let clear = Infinity, clearWho = null;
    const e = inv.elements, eo = [eye.x, eye.y, eye.z];
    const hits = new Map();
    const hit = (en, i0, kind, val, extra) => { const ok = lib.objKey(en, i0); let H = hits.get(ok);
      if (!H) hits.set(ok, H = { label: en.label + (en.pc ? ' piece' : ''), kind: {}, tris: 0 });
      H.kind[kind] = H.kind[kind] == null ? val : (kind === 'inside' ? Math.min(H.kind[kind], val) : Math.max(H.kind[kind], val));
      if (extra) Object.assign(H, extra); H.tris++; };
    const toCam = (W, i) => { const x = W[i * 3], y = W[i * 3 + 1], z = W[i * 3 + 2];
      return [e[0] * x + e[4] * y + e[8] * z + e[12], e[1] * x + e[5] * y + e[9] * z + e[13], -(e[2] * x + e[6] * y + e[10] * z + e[14])]; };
    const insideObjs = new Map();       // object key -> [entry, piece]
    for (const en of EN) {
      const W = en.W;
      for (let t = 0; t < en.nT; t++) {
        const [i0, i1, i2] = lib.tri(en, t);
        /* NEAR: a quick box test, then the clip */
        let far = false;
        for (const c of [0, 1, 2]) { const a = W[i0 * 3 + c], b = W[i1 * 3 + c], d = W[i2 * 3 + c];
          if (Math.min(a, b, d) > eo[c] + reach || Math.max(a, b, d) < eo[c] - reach) { far = true; break; } }
        /* THE CLEARANCE: how near any surface comes to the eye (a lead's measure, and the proof something was measured) */
        { let out = false; for (const c of [0, 1, 2]) { const a = W[i0 * 3 + c], b = W[i1 * 3 + c], d = W[i2 * 3 + c];
            if (Math.min(a, b, d) > eo[c] + CLR || Math.max(a, b, d) < eo[c] - CLR) { out = true; break; } }
          if (!out) { const dd = ptTri(eo, W, i0, i1, i2); if (dd < clear) { clear = dd; clearWho = en.label + (en.pc ? ' piece' : ''); } } }
        if (!far) {
          let P = [toCam(W, i0), toCam(W, i1), toCam(W, i2)];
          const dmax = Math.max(P[0][2], P[1][2], P[2][2]);
          P = clipBy(P, p => hw * p[2] / n - p[0]); if (P.length) P = clipBy(P, p => hw * p[2] / n + p[0]);
          if (P.length) P = clipBy(P, p => hh * p[2] / n - p[1]); if (P.length) P = clipBy(P, p => hh * p[2] / n + p[1]);
          if (P.length) P = clipBy(P, p => n - p[2]);
          if (P.length >= 3) { let dmin = Infinity; for (const p of P) dmin = Math.min(dmin, p[2]);
            const cut = dmax > n + 1e-5;
            hit(en, i0, cut ? 'cut' : 'past', +(n - dmin).toFixed(4)); }
        }
      }
      /* INSIDE: only things whose box holds the eye */
      if (en.pc) { const seen = new Map();
        for (let t = 0; t < en.nT; t++) { const [i0] = lib.tri(en, t), pc = en.pc[i0]; let B = seen.get(pc); if (!B) seen.set(pc, B = [Infinity, Infinity, Infinity, -Infinity, -Infinity, -Infinity]);
          for (const i of lib.tri(en, t)) for (let c = 0; c < 3; c++) { B[c] = Math.min(B[c], W[i * 3 + c]); B[c + 3] = Math.max(B[c + 3], W[i * 3 + c]); } }
        for (const [pc, B] of seen) if (eo.every((v, c) => v >= B[c] - 1e-3 && v <= B[c + 3] + 1e-3)) { const ok = en.rk + '#' + pc; let L = insideObjs.get(ok); if (!L) insideObjs.set(ok, L = { B, parts: [] }); L.parts.push([en, pc]); } }
      else { const B = [Infinity, Infinity, Infinity, -Infinity, -Infinity, -Infinity];
        for (let i = 0; i < W.length; i += 3) for (let c = 0; c < 3; c++) { B[c] = Math.min(B[c], W[i + c]); B[c + 3] = Math.max(B[c + 3], W[i + c]); }
        if (eo.every((v, c) => v >= B[c] - 1e-3 && v <= B[c + 3] + 1e-3)) { let L = insideObjs.get(en.rk); if (!L) insideObjs.set(en.rk, L = { B, parts: [] });
          else for (let c = 0; c < 3; c++) { L.B[c] = Math.min(L.B[c], B[c]); L.B[c + 3] = Math.max(L.B[c + 3], B[c + 3]); }
          L.parts.push([en, null]); } }
    }
    for (const [ok, L] of insideObjs) {
      let odd = 0, back = 0, nearest = Infinity, dbl = false;
      for (const d of RAYS) { let cnt = 0, best = Infinity, bestBack = false;
        for (const [en, pc] of L.parts) { dbl = dbl || en.double;
          for (let t = 0; t < en.nT; t++) { const [i0, i1, i2] = lib.tri(en, t); if (pc != null && en.pc[i0] !== pc) continue;
            const h = rayTri(eo, d, en.W, i0, i1, i2); if (!h) continue; cnt++;
            if (h[0] < best) { best = h[0]; bestBack = en.flip ? h[1] < 0 : h[1] > 0; } } }
        if (cnt % 2) odd++; if (bestBack && cnt) back++; nearest = Math.min(nearest, best); }
      const small = Math.min(L.B[3] - L.B[0], L.B[4] - L.B[1], L.B[5] - L.B[2]) < 1.5;
      const inside = (odd >= 5 && back >= 5) || (dbl && odd === 7 && small);
      if (inside) { const [en, pc] = L.parts[0]; let H = hits.get(ok);
        if (!H) hits.set(ok, H = { label: en.label + (pc != null ? ' piece' : ''), kind: {}, tris: 0 });
        H.kind.inside = +nearest.toFixed(4); H.rays = odd + '/7 odd, ' + back + '/7 back' + (dbl ? ', double-sided' : ''); H.box = L.B.map(v => +v.toFixed(2)); }
    }
    return { eye: eo.map(v => +v.toFixed(3)), fov: +cam.fov.toFixed(2), asp: +cam.aspect.toFixed(3), near: n, objs: EN.length,
             clear: clear === Infinity ? null : +clear.toFixed(4), clearWho: clearWho ? clearWho.slice(0, 90) : null,
             hits: [...hits.values()] };
  };
  /* CHECK=1: the proof on throwaway things laid into the page's world and taken away again */
  lib.check = () => {
    /* (the engine hands no THREE to a page: the constructors are taken from what the scene already holds) */
    let proto = null; scene.traverse(q => { if (!proto && q.isMesh && !q.isSkinnedMesh && !q.isInstancedMesh && q.material && !Array.isArray(q.material) && q.material.color) proto = q; });
    const MeshC = proto.constructor, GeoC = proto.geometry.constructor, AttrC = proto.geometry.attributes.position.constructor;
    const geo = (tris) => { const g = new GeoC(); g.setAttribute('position', new AttrC(new Float32Array(tris), 3)); g.computeBoundingSphere(); return g; };
    /* a quad facing +z (counter-clockwise from +z), and a box whose faces wind outward */
    const plane = (w, h) => geo([-w / 2, -h / 2, 0, w / 2, -h / 2, 0, w / 2, h / 2, 0, -w / 2, -h / 2, 0, w / 2, h / 2, 0, -w / 2, h / 2, 0]);
    const boxG = (a, b, c) => { const x = a / 2, y = b / 2, z = c / 2, T = [];
      const quad = (p0, p1, p2, p3) => T.push(...p0, ...p1, ...p2, ...p0, ...p2, ...p3);
      quad([-x, -y, z], [x, -y, z], [x, y, z], [-x, y, z]); quad([x, -y, -z], [-x, -y, -z], [-x, y, -z], [x, y, -z]);
      quad([x, -y, z], [x, -y, -z], [x, y, -z], [x, y, z]); quad([-x, -y, -z], [-x, -y, z], [-x, y, z], [-x, y, -z]);
      quad([-x, y, z], [x, y, z], [x, y, -z], [-x, y, -z]); quad([-x, -y, -z], [x, -y, -z], [x, -y, z], [-x, -y, z]); return geo(T); };
    const mk = (g, side) => { const m = proto.material.clone(); m.side = side; m.visible = true; m.transparent = false; m.blending = 1; m.depthWrite = true; m.colorWrite = true; m.opacity = 1; m.color.setHex(0xff0000); m.name = '__check';
      const o = new MeshC(g, m); o.name = '__check'; return o; };
    const T = { PlaneGeometry: function (w, h) { return plane(w, h); }, BoxGeometry: function (a, b, c) { return boxG(a, b, c); } };
    cam.updateMatrixWorld(true); const eye = new V3(), dir = new V3(); cam.getWorldPosition(eye); cam.getWorldDirection(dir);
    const res = {};
    const clean = lib.lensAt(); res.clean = clean.hits.map(h => h.label + ' ' + JSON.stringify(h.kind));
    const wall = mk(T.PlaneGeometry(2, 2), 2); wall.position.copy(eye).addScaledVector(dir, 0.03); wall.lookAt(eye); scene.add(wall);
    res.wall = lib.lensAt().hits.filter(h => /col:ff0000/.test(h.label)).map(h => h.kind); scene.remove(wall);
    const box = mk(T.BoxGeometry(0.6, 0.6, 0.6), 0); box.position.copy(eye).addScaledVector(dir, 0.15); scene.add(box);
    res.box = lib.lensAt().hits.filter(h => /col:ff0000/.test(h.label)).map(h => ({ kind: h.kind, rays: h.rays })); scene.remove(box);
    const room = mk(T.BoxGeometry(4, 3, 4), 1); room.position.copy(eye); scene.add(room);
    res.room = lib.lensAt().hits.filter(h => /col:ff0000/.test(h.label)).map(h => ({ kind: h.kind, rays: h.rays })); scene.remove(room);
    /* a wall 0.5 m ahead: no clip */
    const wall2 = mk(T.PlaneGeometry(2, 2), 0); wall2.position.copy(eye).addScaledVector(dir, 0.5); wall2.lookAt(eye); scene.add(wall2);
    res.wallFar = lib.lensAt().hits.filter(h => /col:ff0000/.test(h.label)).map(h => h.kind); scene.remove(wall2);
    for (const m of [wall, box, room, wall2]) { m.geometry.dispose(); m.material.dispose(); }
    /* and on the chapter's OWN surfaces, the world untouched: the lens carried along its own look to 3 cm short of the first
       real surface it meets (a ray from the eye), where that surface must read NEAR; then put back where it was */
    { const EN = lib.near(eye, 6, {}), d = [dir.x, dir.y, dir.z], eo = [eye.x, eye.y, eye.z]; let best = Infinity, who = null;
      for (const en of EN) for (let t = 0; t < en.nT; t++) { const [i0, i1, i2] = lib.tri(en, t); const h = rayTri(eo, d, en.W, i0, i1, i2); if (h && h[0] < best) { best = h[0]; who = en.label; } }
      res.realSurface = who ? { label: who.slice(0, 80), at: +best.toFixed(3) } : null;
      if (who && best > 0.05) { const P = cam.parent, keep = cam.position.clone(), wp = eye.clone().addScaledVector(dir, best - 0.03);
        cam.position.copy(P.worldToLocal(wp)); cam.updateMatrixWorld(true);
        const r = lib.lensAt(); res.realHit = r.hits.filter(h => h.label === who || h.label.startsWith(who)).map(h => h.kind);
        cam.position.copy(keep); cam.updateMatrixWorld(true); res.realBack = lib.lensAt().hits.length === clean.hits.length; } }
    res.pass = res.wall.length === 1 && res.wall[0].past > 0.04 && res.box.length === 1 && res.box[0].kind.inside > 0 && res.room.length === 0 && res.wallFar.length === 0 && (!res.realSurface || res.realSurface.at <= 0.05 || (res.realHit && res.realHit.length >= 1 && res.realBack));
    return res;
  };
};

/* ---------------- reaching a moment (shared with coplanar.mjs) ---------------- */
export const frames = (p, n = 3) => p.evaluate((n) => new Promise(r => { let k = 0; const f = () => (++k >= n ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); }), n);
export const VIEWS = { phone: { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true }, desktop: { viewport: { width: 1280, height: 800 } } };
export async function boot(p, CH, log, errs) {
  p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
  p.on('console', m => { if (m.type() === 'error' || /failed|threw/i.test(m.text())) errs.push('CONSOLE ' + m.text().slice(0, 240)); });
  await p.goto(PAGE + '?ch=' + CH, { waitUntil: 'load', timeout: 240000 });
  await p.waitForFunction(() => !!window.__enc, null, { timeout: 120000 });
  await p.evaluate(() => document.getElementById('startBtn').click());
}
export async function toPlayReady(p) {
  await toPlay(p, 1500000); await p.waitForTimeout(6000);
  /* the chapter's first frame in play applies its own start: wait for it (e5c1films' R83 note) */
  await p.waitForFunction(() => window.__enc.stage && window.__enc.stage.phase != null, null, { timeout: 300000, polling: 500 }).catch(() => {});
}
export async function blackDown(p) {
  await p.evaluate(() => { window.__lcClear = 0; });
  await p.waitForFunction(() => { const el = document.getElementById('cineFade'), o = el ? parseFloat(getComputedStyle(el).opacity) || 0 : 0, now = performance.now();
    if (o >= 0.02) { window.__lcClear = 0; return false; } if (!window.__lcClear) window.__lcClear = now; return now - window.__lcClear > 2500; }, null, { timeout: 900000, polling: 250 }).catch(() => {});
}
/* a film job reached: returns once its film runs */
export async function reachFilm(p, job, { PHONE, ASK = 'ask' }) {
  if (job !== 'open') {
    await toPlayReady(p);
    if (job.startsWith('end:')) {
      await p.evaluate((ph) => window.__enc.stage.applyPhase(ph), ASK);
      await p.waitForFunction(() => window.__enc.getState() === 'decide', null, { timeout: 900000, polling: 500 });
      await p.waitForTimeout(2500);
      await p.waitForFunction(() => { const P = document.querySelector('#decide .panel'); return P && P.getAnimations().every(a => a.playState === 'finished'); }, null, { timeout: 120000, polling: 200 });
      const bt = await p.evaluate((i) => { const B = [...document.querySelectorAll('#choices button.choice')], r = B[i] && B[i].getBoundingClientRect();
        return r ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : null; }, 'ABCD'.indexOf(job.slice(4)));
      if (PHONE) await p.touchscreen.tap(Math.round(bt.x), Math.round(bt.y)); else await p.mouse.click(bt.x, bt.y);
    } else {
      const at = job.indexOf('@'), key = job.slice(0, at), self = job.endsWith('!'), ph = job.slice(at + 1).replace(/!$/, '');
      await p.evaluate((ph) => window.__enc.stage.applyPhase(ph), ph);
      if (!self) {
        await p.waitForFunction((ph) => window.__enc.stage.phase === ph.split(':')[0] && window.__enc.getState() === 'play', ph, { timeout: 600000, polling: 500 });
        await blackDown(p); await p.waitForTimeout(1500);
        await p.evaluate((k) => window.__enc.kit.film(k), key);
      }
    }
  }
  await p.waitForFunction(() => window.__enc.cine.active() && window.__enc.getState() === 'cine' && window.__enc.cine.t() > 0.2, null, { timeout: 1500000, polling: 250 });
  await p.waitForFunction(() => { try { return !!window.__enc.stage.ready(); } catch { return true; } }, null, { timeout: 300000, polling: 500 }).catch(() => {});
}
export async function reachPhase(p, ph) {
  await p.evaluate((ph) => { const E = window.__enc; if (E.cine && E.cine.active && E.cine.active() && E.cine.skip) E.cine.skip(); E.stage.applyPhase(ph); }, ph);
  await p.waitForFunction((ph) => { const E = window.__enc; return E.stage.phase === ph.split(':')[0] && !(E.cine && E.cine.active && E.cine.active()); }, ph, { timeout: 600000, polling: 300 }).catch(() => {});
  await blackDown(p);
  await p.waitForFunction(() => { try { const i = window.__enc.stage.info(); return !i.waiting || !i.waiting.length; } catch { return true; } }, null, { timeout: 600000, polling: 1000 }).catch(() => {});
  await frames(p, 4);
}
/* the moments of a film, in chunks, each sought (forward only) and measured by the named in-page function; BOTH: twice,
   at a phone's shape and a desk's */
export async function sweepFilm(p, { fn, STEP, FROM = 0, UNTIL = 1e9, BOTH, args = {}, log, job }) {
  const dur = await p.evaluate(() => window.__enc.cine.dur()), rows = [];
  const ts = []; for (let k = Math.ceil(FROM / STEP - 1e-6); k * STEP <= Math.min(dur - 0.05, UNTIL) + 1e-6; k++) ts.push(+(k * STEP).toFixed(3));
  const T0 = Date.now();
  for (let i = 0; i < ts.length; i += 8) {
    const part = await p.evaluate(([ts, fn, both, args]) => { const E = window.__enc, C = E.cine, cam = E.camera, aP = cam.aspect, out = [];
      for (const t of ts) {
        cam.aspect = aP; cam.updateProjectionMatrix(); C.seek(t); out.push({ t, v: 'p', r: window.__clip[fn]({ ...args, t }) });
        if (both) { cam.aspect = 1280 / 800; cam.updateProjectionMatrix(); C.seek(t); out.push({ t, v: 'd', r: window.__clip[fn]({ ...args, t }) }); } }
      cam.aspect = aP; cam.updateProjectionMatrix(); return out; }, [ts.slice(i, i + 8), fn, BOTH, args]);
    rows.push(...part);
    if (log && i % 80 === 0) log(job, 't', ts[i], 'of', dur.toFixed(1), ((Date.now() - T0) / 1000).toFixed(0) + 's');
  }
  return { dur, rows };
}
export async function picture(p, f, settle) { await frames(p, 3); await p.waitForTimeout(settle); await p.screenshot({ path: f, timeout: 240000 }); }

/* ---------------- the probe ---------------- */
const MAIN = process.argv[1] && fileURLToPath(import.meta.url) === fs.realpathSync(process.argv[1]);
if (MAIN) {
  const CH = process.env.CH || 'e5c1', VIEW = process.env.VIEW || 'both', PHONE = VIEW !== 'desktop', BOTH = VIEW === 'both';
  const STEP = +(process.env.STEP || 0.25), FROM = +(process.env.FROM || 0), UNTIL = +(process.env.UNTIL || 1e9);
  const FILMS = (process.env.FILMS || '').split(',').filter(Boolean), PHASES = (process.env.PHASES || '').split(',').filter(Boolean);
  const WALK = (process.env.WALK || '').split(',').filter(Boolean), ASK = process.env.ASK || 'ask';
  const PITCH = {}; for (const it of (process.env.PITCH || '').split(';').filter(Boolean)) { const [k, v] = it.split('='); PITCH[k] = v.split('..').map(Number); }
  const PICS = {}; for (const it of (process.env.PICS || '').split(';').filter(Boolean)) { const i = it.lastIndexOf('@'); PICS[it.slice(0, i)] = it.slice(i + 1).split(',').map(Number); }
  const DPR = +(process.env.DPR || 1), SETTLE = +(process.env.SETTLE || 1200), OUT = process.env.OUT || '/tmp/lensclip';
  fs.mkdirSync(OUT, { recursive: true });
  const T0 = Date.now(), log = (...a) => console.log(((Date.now() - T0) / 1000).toFixed(0) + 's', ...a);
  const b = await chromium.launch(LAUNCH);
  const ctx = await b.newContext({ ...(PHONE ? VIEWS.phone : VIEWS.desktop), deviceScaleFactor: DPR });
  const report = { ch: CH, view: VIEW, step: STEP, films: {}, play: {} };
  /* a span: consecutive moments where one object is hit */
  const spans = (rows) => { const open = new Map(), out = [];
    for (const row of rows) { const seen = new Set();
      for (const h of row.r.hits) { const k = row.v + '|' + h.label; seen.add(k); let S = open.get(k);
        const dep = Math.max(...Object.values(h.kind));
        if (!S) { open.set(k, S = { v: row.v, label: h.label, from: row.t, to: row.t, kinds: new Set(), worst: 0, worstAt: row.t, eye: row.r.eye }); out.push(S); }
        S.to = row.t; Object.keys(h.kind).forEach(x => S.kinds.add(x)); if (dep > S.worst) { S.worst = dep; S.worstAt = row.t; S.eye = row.r.eye; } }
      for (const k of [...open.keys()]) if (k.startsWith(row.v + '|') && !seen.has(k)) open.delete(k); }
    return out.map(S => ({ ...S, kinds: [...S.kinds] })); };
  for (const job of FILMS) {
    const p = await ctx.newPage(), errs = [];
    try {
      await boot(p, CH, log, errs); await reachFilm(p, job, { PHONE, ASK });
      await p.evaluate(LIB);
      if (process.env.CHECK === '1') { log(job, 'CHECK', JSON.stringify(await p.evaluate(() => window.__clip.check()))); }
      const { dur, rows } = await sweepFilm(p, { fn: 'lensAt', STEP, FROM, UNTIL, BOTH, log, job });
      const S = spans(rows);
      /* the nearest any surface came to the lens over the film (each shape), and how many moments had something within 0.4 m */
      const near = {}; for (const v of ['p', 'd']) { const R = rows.filter(r => r.v === v); if (!R.length) continue; let m = null;
        for (const r of R) if (r.r.clear != null && (!m || r.r.clear < m.clear)) m = { clear: r.r.clear, t: r.t, who: r.r.clearWho, eye: r.r.eye };
        near[v] = { moments: R.length, withNear: R.filter(r => r.r.clear != null).length, closest: m }; }
      report.films[job] = { dur, moments: rows.length, near, spans: S, errs };
      log(job, 'dur', dur.toFixed(2), rows.length, 'moments,', S.length, 'spans', errs.length ? 'errs ' + JSON.stringify(errs.slice(0, 3)) : '');
      for (const v in near) log('  ', v, 'surfaces within 0.4 m at', near[v].withNear, 'of', near[v].moments, 'moments; the closest', JSON.stringify(near[v].closest));
      for (const s of S) log('  ', s.v, s.from.toFixed(2) + '..' + s.to.toFixed(2), s.kinds.join('+'), 'worst', s.worst, '@', s.worstAt, s.label.slice(0, 90));
      for (const t of (PICS[job] || [])) { await p.evaluate((t) => window.__enc.cine.seek(t), t);
        const f = `${OUT}/${job.replace(/[:@!,]/g, '_')}-${VIEW}-${t.toFixed(2)}.png`; await picture(p, f, SETTLE); log(job, 'picture', f); }
    } catch (e) { log(job, 'FAILED', String(e).slice(0, 300), JSON.stringify(errs.slice(0, 4))); report.films[job] = { failed: String(e).slice(0, 300), errs }; }
    fs.writeFileSync(`${OUT}/lensclip-${CH}-${VIEW}.json`, JSON.stringify(report, null, 1));
    await p.close();
  }
  if (PHASES.length) {
    const p = await ctx.newPage(), errs = [];
    try {
      await boot(p, CH, log, errs); await toPlayReady(p); await p.evaluate(LIB);
      for (const ph of PHASES) {
        await reachPhase(p, ph);
        /* the yaw's limits, found: the lens turned past them, the chapter's frame left to hold it, and read back */
        const y0 = await p.evaluate(() => window.__enc.yaw.rotation.y), reads = [];
        for (const dy of [0.6, 1.2, 1.8, 2.6, -0.6, -1.2, -1.8, -2.6]) { await p.evaluate((y) => { window.__enc.yaw.rotation.y = y; }, y0 + dy); await frames(p, 2);
          reads.push(await p.evaluate(() => window.__enc.yaw.rotation.y) - y0); }
        await p.evaluate((y) => { window.__enc.yaw.rotation.y = y; }, y0);
        const wrap = (a) => Math.atan2(Math.sin(a), Math.cos(a)), held = reads.some((r, i) => Math.abs(wrap(r - [0.6, 1.2, 1.8, 2.6, -0.6, -1.2, -1.8, -2.6][i])) > 0.01);
        const lo = held ? Math.min(...reads.map(wrap)) : -Math.PI, hi = held ? Math.max(...reads.map(wrap)) : Math.PI;
        const pr = PITCH[ph] || PITCH[ph.split(':')[0]] || [-1.2, 1.2];
        const yaws = []; const NY = held ? 13 : 24; for (let i = 0; i < NY; i++) yaws.push(y0 + lo + (hi - lo) * (held ? i / (NY - 1) : i / NY));
        const pitches = [pr[0], pr[0] / 2, 0, pr[1] / 2, pr[1]];
        const looks = []; for (const y of yaws) for (const q of pitches) looks.push([y, q]);
        const meas = async (looks, at) => p.evaluate(([looks, at]) => { const E = window.__enc, Y = E.yaw, P = E.pitch, y0 = Y.rotation.y, p0 = P.rotation.x, x0 = Y.position.x, z0 = Y.position.z, out = [];
          for (const [y, q] of looks) { if (at) { Y.position.x = at[0]; Y.position.z = at[1]; } Y.rotation.y = y; P.rotation.x = q; Y.updateMatrixWorld(true);
            out.push({ t: +y.toFixed(3), q: +q.toFixed(3), at, v: 'p', r: window.__clip.lensAt() }); }
          Y.rotation.y = y0; P.rotation.x = p0; Y.position.x = x0; Y.position.z = z0; Y.updateMatrixWorld(true); return out; }, [looks, at]);
        const rows = await meas(looks, null);
        let cm = null; for (const r of rows) if (r.r.clear != null && (!cm || r.r.clear < cm.clear)) cm = { clear: r.r.clear, yaw: r.t, pitch: r.q, who: r.r.clearWho };
        const R = { yaw: [+(y0 + lo).toFixed(3), +(y0 + hi).toFixed(3)], held, pitch: pr, looks: rows.length, closest: cm, eye: rows[0] && rows[0].r.eye, hits: rows.filter(r => r.r.hits.length).map(r => ({ yaw: r.t, pitch: r.q, eye: r.r.eye, hits: r.r.hits })) };
        if (WALK.includes(ph)) {
          /* the ground he can reach, flooded by the engine's own collision, and every edge of it pressed to the blocker */
          const stands = await p.evaluate(() => { const E = window.__enc, Y = E.yaw, sx = Y.position.x, sz = Y.position.z, G = 0.1, key = (i, j) => i + ',' + j;
            const ok = (x, z) => !E.collideAt(x, z), seen = new Map(), Q = [[0, 0]]; seen.set(key(0, 0), true);
            while (Q.length && seen.size < 60000) { const [i, j] = Q.shift();
              for (const [di, dj] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const k = key(i + di, j + dj); if (seen.has(k)) continue; const r = ok(sx + (i + di) * G, sz + (j + dj) * G);
                seen.set(k, r); if (r && Math.hypot(i + di, j + dj) * G < 15) Q.push([i + di, j + dj]); } }
            const out = [];
            for (const [k, r] of seen) { if (!r) continue; const [i, j] = k.split(',').map(Number); const cx = sx + i * G, cz = sz + j * G;
              for (const [di, dj] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { if (seen.get(key(i + di, j + dj)) !== false) continue;
                let a = 0, c = G; for (let s = 0; s < 12; s++) { const m = (a + c) / 2; if (ok(cx + di * m, cz + dj * m)) a = m; else c = m; }
                out.push([+(cx + di * a).toFixed(3), +(cz + dj * a).toFixed(3), Math.atan2(-di, -dj)]); } }
            return { cells: [...seen.values()].filter(Boolean).length, stands: out }; });
          log(ph, 'walk: reachable cells', stands.cells, 'edge stands', stands.stands.length);
          const wh = [];
          for (let i = 0; i < stands.stands.length; i += 20) {
            const part = stands.stands.slice(i, i + 20);
            for (const [x, z, face] of part) { const lk = []; for (const dy of [-1.2, -0.6, 0, 0.6, 1.2]) for (const q of [pr[0], 0, pr[1]]) lk.push([face + dy, q]);
              const rr = await meas(lk, [x, z]); for (const r of rr) if (r.r.hits.length) wh.push({ at: [x, z], yaw: r.t, pitch: r.q, eye: r.r.eye, hits: r.r.hits }); }
          }
          R.walk = { cells: stands.cells, stands: stands.stands.length, hits: wh };
        }
        report.play[ph] = R;
        log('play', ph, 'yaw', R.yaw.join('..'), held ? '(held)' : '(free)', 'pitch', pr.join('..'), rows.length, 'looks,', R.hits.length, 'with hits; the eye', JSON.stringify(R.eye), 'the closest', JSON.stringify(cm), R.walk ? '; walk ' + R.walk.stands + ' stands, ' + R.walk.hits.length + ' with hits' : '');
        const tally = new Map(); for (const h of [...R.hits, ...(R.walk ? R.walk.hits : [])]) for (const x of h.hits) { const k = x.label; const T = tally.get(k) || { n: 0, worst: 0, at: null }; T.n++; const d = Math.max(...Object.values(x.kind)); if (d > T.worst) { T.worst = d; T.at = h; } tally.set(k, T); }
        for (const [k, T] of tally) log('  ', T.n, 'looks', 'worst', T.worst, Object.keys(T.at.hits.find(x => x.label === k).kind).join('+'), 'yaw', T.at.yaw, 'pitch', T.at.pitch, T.at.at ? 'at ' + T.at.at : '', k.slice(0, 90));
        for (const pk of Object.keys(PICS).filter(k => k === 'play:' + ph)) { const [y, q, x, z] = PICS[pk];
          await p.evaluate(([y, q, x, z]) => { const E = window.__enc; if (x != null) { E.yaw.position.x = x; E.yaw.position.z = z; } E.yaw.rotation.y = y; E.pitch.rotation.x = q; }, [y, q, x, z]);
          const f = `${OUT}/play-${ph.replace(/[:,]/g, '_')}-${VIEW}-${y}_${q}.png`; await picture(p, f, SETTLE); log('play', ph, 'picture', f); }
        fs.writeFileSync(`${OUT}/lensclip-${CH}-${VIEW}.json`, JSON.stringify(report, null, 1));
      }
      report.playErrs = errs;
    } catch (e) { log('play FAILED', String(e).slice(0, 300), JSON.stringify(errs.slice(0, 4))); report.playFailed = String(e).slice(0, 300); }
    await p.close();
  }
  fs.writeFileSync(`${OUT}/lensclip-${CH}-${VIEW}.json`, JSON.stringify(report, null, 1));
  log('wrote', `${OUT}/lensclip-${CH}-${VIEW}.json`);
  await b.close();
}
