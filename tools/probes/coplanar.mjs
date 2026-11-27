/* v29.0 · SURFACES SHARING A PLANE, MEASURED (Chad, 27 Nov 2026, R15 of docs/V29.0-E5C1-PLAN.md: "Also check for all kinds of
   clipping"; the tracker's CP9.3a, kind 8; v19.3's law: "Never let two surfaces share a plane; offset them by
   millimetres"). Two surfaces in one plane FLICKER: the depth buffer cannot tell which is in front, and which one wins
   changes from pixel to pixel and frame to frame as the lens moves. A still picture can show either one cleanly, so it is
   measured. GENERIC: any chapter, any film key, every phase of play.

   At each moment every visible surface within R m of the lens is gathered as lensclip.mjs gathers it (its LIB: clipscan's
   objects, every person as posed whatever their key, every copy of an instanced thing by its own matrix, each merged
   piece; glows, see-through and painted pools of light kept here, since they are drawn in the depth test too). Each
   triangle is put in the cells of a VOX-metre grid it passes through, and every two triangles sharing a cell that belong to
   DIFFERENT objects (or to different materials of one object) are read:
     parallel within ANG degrees (1), facing the same way (or either drawn from both sides: back to back, one-sided, is
     never seen at once), and the second laid flat onto the first's plane overlapping it where the two planes are within
     DIST m (0.002) of each other: that overlap's area. A pair is counted when its area passes MINAREA m² (1e-5, 10 mm²).
   A material with a polygon offset, or drawn without the depth test, cannot fight: such pairs are counted apart
   (`guarded`), not listed. A still thing's triangles are indexed once and kept (a thing that moves is indexed again where
   it went), so every moment of a film costs only its people and what moved.
   Prints each pair with both names, the overlap's area (m²), where (its box) and its normal; writes JSON.

     ENC_DIST=<snap> CHROMIUM_PATH=... CH=e5c1 [VIEW=phone|desktop|both] [STEP=0.25] [R=14] [VOX=0.25] [ANG=1] [DIST=0.002]
       [MINAREA=1e-5] [FILMS=...] [PHASES=...] [ASK=ask] [OUT=dir] node tools/probes/coplanar.mjs
   FILMS and PHASES as lensclip.mjs takes them (a film's moments; a phase measured as play stands there). The shape (VIEW)
   changes only what the films' lens frames, so a film's pairs are read at both shapes when VIEW=both.
   CHECK=1 (the proof, never on the real chapter): on throwaway quads laid into the page's world and taken away again: one
   laid 0.5 mm over the floor under the eye must pair with the floor; one laid 1 cm over it must add no pair; two laid
   exactly on one another in two materials must pair with each other. */
import { chromium } from 'playwright';
import fs from 'node:fs';
import { LAUNCH } from '../../testlib.mjs';
import { LIB, VIEWS, boot, reachFilm, reachPhase, toPlayReady, sweepFilm } from './lensclip.mjs';

const COP = () => {
  if (window.__clip.copAt) return;
  const E = window.__enc, scene = E.scene, cam = E.camera, V3 = cam.position.constructor, lib = window.__clip;
  const S = { idx: new Map(), cells: new Map(), pairs: new Map(), next: 0, tris: [] };   // the still things' index, kept
  const ck = (ix, iy, iz) => ix + ',' + iy + ',' + iz;
  const triCells = (v, VOX) => {
    let x0 = Math.min(v[0], v[3], v[6]), y0 = Math.min(v[1], v[4], v[7]), z0 = Math.min(v[2], v[5], v[8]), x1 = Math.max(v[0], v[3], v[6]), y1 = Math.max(v[1], v[4], v[7]), z1 = Math.max(v[2], v[5], v[8]);
    const ix0 = Math.floor(x0 / VOX), iy0 = Math.floor(y0 / VOX), iz0 = Math.floor(z0 / VOX), ix1 = Math.floor(x1 / VOX), iy1 = Math.floor(y1 / VOX), iz1 = Math.floor(z1 / VOX);
    if ((ix1 - ix0 + 1) * (iy1 - iy0 + 1) * (iz1 - iz0 + 1) <= 27) { const out = [];
      for (let ix = ix0; ix <= ix1; ix++) for (let iy = iy0; iy <= iy1; iy++) for (let iz = iz0; iz <= iz1; iz++) out.push(ck(ix, iy, iz)); return out; }
    const e = Math.max(Math.hypot(v[3] - v[0], v[4] - v[1], v[5] - v[2]), Math.hypot(v[6] - v[3], v[7] - v[4], v[8] - v[5]), Math.hypot(v[0] - v[6], v[1] - v[7], v[2] - v[8]));
    const n = Math.min(800, Math.max(1, Math.ceil(e / (VOX * 0.4)))), set = new Set();
    for (let i = 0; i <= n; i++) for (let k = 0; k <= n - i; k++) { const u = i / n, w = k / n, t = 1 - u - w;
      set.add(ck(Math.floor((v[0] * t + v[3] * u + v[6] * w) / VOX), Math.floor((v[1] * t + v[4] * u + v[7] * w) / VOX), Math.floor((v[2] * t + v[5] * u + v[8] * w) / VOX))); }
    return [...set];
  };
  /* a triangle's record: its corners, unit normal, area, owner and material */
  const recs = (en, base) => {
    const out = [], W = en.W, mats = en.mats;
    const matOf = (t) => { if (!en.groups) return mats[0]; for (const g of en.groups) if (t * 3 >= g.start && t * 3 < g.start + g.count) return mats[g.materialIndex] || mats[0]; return mats[0]; };
    for (let t = 0; t < en.nT; t++) { const [i0, i1, i2] = lib.tri(en, t);
      const v = [W[i0 * 3], W[i0 * 3 + 1], W[i0 * 3 + 2], W[i1 * 3], W[i1 * 3 + 1], W[i1 * 3 + 2], W[i2 * 3], W[i2 * 3 + 1], W[i2 * 3 + 2]];
      const ax = v[3] - v[0], ay = v[4] - v[1], az = v[5] - v[2], bx = v[6] - v[0], by = v[7] - v[1], bz = v[8] - v[2];
      let nx = ay * bz - az * by, ny = az * bx - ax * bz, nz = ax * by - ay * bx; const L = Math.hypot(nx, ny, nz); if (L < 2e-7) continue;
      if (en.flip) { nx = -nx; ny = -ny; nz = -nz; }
      const m = matOf(t);
      out.push({ v, n: [nx / L, ny / L, nz / L], area: L / 2, ok: lib.objKey(en, i0), mk: m ? m.uuid : '', ek: base, label: en.label + (en.pc ? ' piece' : '') + (m && m.blending === 2 ? ' additive' : ''),
                 dbl: m ? m.side === 2 : false, guard: !!(m && ((m.polygonOffset && (m.polygonOffsetFactor || m.polygonOffsetUnits)) || m.depthTest === false)) });
    }
    return out;
  };
  /* the overlap of two triangles laid in A's plane, kept where the planes are within DIST: its area and its corners */
  const clipBy = (P, f) => { const out = []; for (let i = 0; i < P.length; i++) { const a = P[i], c = P[(i + 1) % P.length], fa = f(a), fc = f(c);
      if (fa >= 0) out.push(a); if ((fa >= 0) !== (fc >= 0)) { const s = fa / (fa - fc); out.push([a[0] + (c[0] - a[0]) * s, a[1] + (c[1] - a[1]) * s, a[2] + (c[2] - a[2]) * s]); } } return out; };
  const pairTest = (A, B, o) => {
    if (A.ok === B.ok && A.mk === B.mk) return null;
    const d = A.n[0] * B.n[0] + A.n[1] * B.n[1] + A.n[2] * B.n[2];
    if (Math.abs(d) < o.cosA) return null;
    if (d < 0 && !A.dbl && !B.dbl) return null;                    // back to back, each one-sided: never both seen
    const n = A.n, p0 = [A.v[0], A.v[1], A.v[2]], dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
    /* B's corners laid onto A's plane: quick reject when they are all far from it */
    const sd = (q) => (q[0] - p0[0]) * n[0] + (q[1] - p0[1]) * n[1] + (q[2] - p0[2]) * n[2];
    const Bv = [[B.v[0], B.v[1], B.v[2]], [B.v[3], B.v[4], B.v[5]], [B.v[6], B.v[7], B.v[8]]];
    const dB = Bv.map(sd); if (Math.min(...dB) > o.DIST * 4 + 0.02 || Math.max(...dB) < -(o.DIST * 4 + 0.02)) return null;
    let P = [[A.v[0], A.v[1], A.v[2]], [A.v[3], A.v[4], A.v[5]], [A.v[6], A.v[7], A.v[8]]];
    const Bp = Bv.map((q, i) => [q[0] - n[0] * dB[i], q[1] - n[1] * dB[i], q[2] - n[2] * dB[i]]);
    /* B's edges as half-planes in A's plane (its winding read against n) */
    const e1 = [Bp[1][0] - Bp[0][0], Bp[1][1] - Bp[0][1], Bp[1][2] - Bp[0][2]], e2 = [Bp[2][0] - Bp[0][0], Bp[2][1] - Bp[0][1], Bp[2][2] - Bp[0][2]];
    const s = Math.sign(dot([e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]], n)); if (!s) return null;
    for (let i = 0; i < 3 && P.length; i++) { const a = Bp[i], c = Bp[(i + 1) % 3], ed = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
      const inw = [n[1] * ed[2] - n[2] * ed[1], n[2] * ed[0] - n[0] * ed[2], n[0] * ed[1] - n[1] * ed[0]].map(x => x * s);
      P = clipBy(P, (q) => (q[0] - a[0]) * inw[0] + (q[1] - a[1]) * inw[1] + (q[2] - a[2]) * inw[2]); }
    if (P.length < 3) return null;
    /* where the two planes are within DIST: B's plane's distance at a point of A's, a linear function */
    const nb = B.n, b0 = Bv[0], dPl = (q) => (q[0] - b0[0]) * nb[0] + (q[1] - b0[1]) * nb[1] + (q[2] - b0[2]) * nb[2];
    P = clipBy(P, (q) => o.DIST - dPl(q)); if (P.length >= 3) P = clipBy(P, (q) => o.DIST + dPl(q)); if (P.length < 3) return null;
    let ar = 0; for (let i = 1; i + 1 < P.length; i++) { const u = [P[i][0] - P[0][0], P[i][1] - P[0][1], P[i][2] - P[0][2]], w = [P[i + 1][0] - P[0][0], P[i + 1][1] - P[0][1], P[i + 1][2] - P[0][2]];
      ar += Math.hypot(u[1] * w[2] - u[2] * w[1], u[2] * w[0] - u[0] * w[2], u[0] * w[1] - u[1] * w[0]) / 2; }
    if (ar < 1e-9) return null;
    let gap = 0; for (const q of P) gap = Math.max(gap, Math.abs(dPl(q)));
    return { ar, P, gap };
  };
  const agg = (M, A, B, r, guarded) => {
    const [X, Y] = A.ok + '|' + A.mk < B.ok + '|' + B.mk ? [A, B] : [B, A], key = X.ok + '|' + X.mk + '#' + Y.ok + '|' + Y.mk;
    let G = M.get(key); if (!G) M.set(key, G = { a: X.label, b: Y.label, ea: X.ek, eb: Y.ek, area: 0, tris: 0, gap: 0, guarded, n: X.n.map(v => +v.toFixed(3)), box: [Infinity, Infinity, Infinity, -Infinity, -Infinity, -Infinity] });
    G.area += r.ar; G.tris++; G.gap = Math.max(G.gap, r.gap);
    for (const q of r.P) for (let c = 0; c < 3; c++) { G.box[c] = Math.min(G.box[c], q[c]); G.box[c + 3] = Math.max(G.box[c + 3], q[c]); }
  };
  const meet = (R1, list, o, M) => { for (const B of list) { const r = pairTest(R1, B, o); if (r) agg(M, R1, B, r, R1.guard || B.guard); } };
  const query = (R1, cells, o, M, seen, insertTo) => {
    const cs = triCells(R1.v, o.VOX), done = new Set();
    for (const c of cs) { const L = cells.get(c); if (L) for (const B of L) { if (done.has(B)) continue; done.add(B); const r = pairTest(R1, B, o); if (r) agg(M, R1, B, r, R1.guard || B.guard); }
      if (insertTo) { let L2 = insertTo.get(c); if (!L2) insertTo.set(c, L2 = []); L2.push(R1); } }
  };
  lib.copAt = (o = {}) => {
    o = { R: 14, VOX: 0.25, ANG: 1, DIST: 0.002, MINAREA: 1e-5, ...o }; o.cosA = Math.cos(o.ANG * Math.PI / 180);
    cam.updateMatrixWorld(true); const eye = new V3(); cam.getWorldPosition(eye);
    const EN = lib.near(eye, o.R, { fx: true }), present = new Set(), dyn = [];
    for (const en of EN) {
      if (en.skinned) { dyn.push(en); continue; }
      const W = en.W, j = 3 * Math.floor(W.length / 6), z = W.length - 3, sig = en.mesh.uuid + '#' + en.k + '#' + [0, 1, 2, j, j + 1, j + 2, z, z + 1, z + 2].map(i => W[i].toFixed(4)).join(',') + '#' + W.length;
      present.add(sig);
      if (S.idx.has(sig)) continue;
      /* a still thing new to the index: met against everything already in it, then put in */
      const rr = recs(en, sig); S.idx.set(sig, rr.length);
      const M = new Map();
      for (const R1 of rr) query(R1, S.cells, o, M, null, null);
      /* (and against its own other objects and materials, which the index does not hold yet) */
      const own = new Map(); for (const R1 of rr) query(R1, own, o, M, null, own);
      for (const R1 of rr) for (const c of triCells(R1.v, o.VOX)) { let L = S.cells.get(c); if (!L) S.cells.set(c, L = []); L.push(R1); }
      for (const [k, G] of M) { const P = S.pairs.get(k); if (!P) S.pairs.set(k, G); else if (P.ea === G.ea && P.eb === G.eb) { /* the same two, met again: kept as first found */ } else S.pairs.set(k + '~' + G.ea + G.eb, G); }
    }
    /* the people (and anything posed by bones): met against the index and one another, every moment */
    const MD = new Map(), tmp = new Map();
    for (const en of dyn) { const rr = recs(en, en.mesh.uuid); for (const R1 of rr) query(R1, S.cells, o, MD, null, null); for (const R1 of rr) query(R1, tmp, o, MD, null, tmp); }
    const out = [], guarded = { n: 0 };
    const take = (G) => { if (G.area < o.MINAREA) return; if (G.guarded) { guarded.n++; return; }
      out.push({ a: G.a, b: G.b, area: +G.area.toFixed(6), tris: G.tris, gap: +G.gap.toFixed(4), n: G.n, box: G.box.map(v => +v.toFixed(3)) }); };
    for (const G of S.pairs.values()) if (present.has(G.ea) && present.has(G.eb) && Math.max(...[0, 2].map(c => Math.abs((G.box[c] + G.box[c + 3]) / 2 - [eye.x, 0, eye.z][c]))) <= o.R) take(G);
    for (const G of MD.values()) take(G);
    out.sort((x, y) => y.area - x.area);
    return { eye: [eye.x, eye.y, eye.z].map(v => +v.toFixed(3)), objs: EN.length, indexed: S.idx.size, pairs: out, guarded: guarded.n };
  };
  lib.copCheck = (o = {}) => {
    cam.updateMatrixWorld(true); const eye = new V3(); cam.getWorldPosition(eye);
    let proto = null; scene.traverse(q => { if (!proto && q.isMesh && !q.isSkinnedMesh && !q.isInstancedMesh && q.material && !Array.isArray(q.material) && q.material.color) proto = q; });
    const MeshC = proto.constructor, GeoC = proto.geometry.constructor, AttrC = proto.geometry.attributes.position.constructor;
    /* a quad facing up (its winding counter-clockwise seen from above) */
    const quad = (cx, y, cz, h) => { const g = new GeoC(); g.setAttribute('position', new AttrC(new Float32Array([cx - h, y, cz + h, cx + h, y, cz + h, cx + h, y, cz - h, cx - h, y, cz + h, cx + h, y, cz - h, cx - h, y, cz - h]), 3)); g.computeBoundingSphere();
      const m = proto.material.clone(); m.side = 0; m.visible = true; m.transparent = false; m.blending = 1; m.polygonOffset = false; m.depthTest = true; m.color.setHex(0x00ff00); m.name = '__cop';
      const q = new MeshC(g, m); q.name = '__cop'; return q; };
    const fy = E.groundAt ? E.groundAt(eye.x, eye.z) : 0;
    const mine = (r) => r.pairs.filter(p => /col:00ff00/.test(p.a) || /col:00ff00/.test(p.b)).map(p => ({ a: p.a.slice(0, 60), b: p.b.slice(0, 60), area: p.area, gap: p.gap }));
    const res = { floorY: fy }, base = lib.copAt(o); res.clean = base.pairs.length;
    const q1 = quad(eye.x, fy + 0.0005, eye.z, 0.5); scene.add(q1); res.onFloor = mine(lib.copAt(o)); scene.remove(q1);
    const q2 = quad(eye.x, fy + 0.01, eye.z, 0.5); scene.add(q2); const r2 = lib.copAt(o); res.above = mine(r2); res.aboveTotal = r2.pairs.length; scene.remove(q2);
    const q3 = quad(eye.x, fy + 0.2, eye.z, 0.3), q4 = quad(eye.x + 0.1, fy + 0.2, eye.z, 0.3); q4.material.color.setHex(0x00ff00); scene.add(q3); scene.add(q4);
    res.twin = mine(lib.copAt(o)); scene.remove(q3); scene.remove(q4);
    for (const q of [q1, q2, q3, q4]) { q.geometry.dispose(); q.material.dispose(); }
    res.pass = res.onFloor.length >= 1 && res.above.length === 0 && res.aboveTotal === res.clean && res.twin.length >= 1;
    return res;
  };
};

const CH = process.env.CH || 'e5c1', VIEW = process.env.VIEW || 'both', PHONE = VIEW !== 'desktop', BOTH = VIEW === 'both';
const STEP = +(process.env.STEP || 0.25), FROM = +(process.env.FROM || 0), UNTIL = +(process.env.UNTIL || 1e9);
const FILMS = (process.env.FILMS || '').split(',').filter(Boolean), PHASES = (process.env.PHASES || '').split(',').filter(Boolean), ASK = process.env.ASK || 'ask';
const ARGS = { R: +(process.env.R || 14), VOX: +(process.env.VOX || 0.25), ANG: +(process.env.ANG || 1), DIST: +(process.env.DIST || 0.002), MINAREA: +(process.env.MINAREA || 1e-5) };
const OUT = process.env.OUT || '/tmp/coplanar'; fs.mkdirSync(OUT, { recursive: true });
const T0 = Date.now(), log = (...a) => console.log(((Date.now() - T0) / 1000).toFixed(0) + 's', ...a);
const b = await chromium.launch(LAUNCH);
const ctx = await b.newContext({ ...(PHONE ? VIEWS.phone : VIEWS.desktop), deviceScaleFactor: 1 });
const report = { ch: CH, view: VIEW, step: STEP, args: ARGS, films: {}, play: {} };
const install = async (p) => { await p.evaluate(LIB); await p.evaluate(COP); };
const pairsOf = (rows) => { const M = new Map();
  for (const row of rows) for (const q of row.r.pairs) { const k = q.a + ' || ' + q.b; let G = M.get(k);
    if (!G) M.set(k, G = { a: q.a, b: q.b, from: row.t, to: row.t, moments: 0, area: 0, gap: 0, box: q.box, n: q.n, views: new Set() });
    G.to = row.t; G.moments++; G.views.add(row.v); if (q.area > G.area) { G.area = q.area; G.box = q.box; } G.gap = Math.max(G.gap, q.gap); }
  return [...M.values()].map(G => ({ ...G, views: [...G.views] })).sort((x, y) => y.area - x.area); };
for (const job of FILMS) {
  const p = await ctx.newPage(), errs = [];
  try {
    await boot(p, CH, log, errs); await reachFilm(p, job, { PHONE, ASK }); await install(p);
    if (process.env.CHECK === '1') log(job, 'CHECK', JSON.stringify(await p.evaluate((a) => window.__clip.copCheck(a), ARGS)));
    const { dur, rows } = await sweepFilm(p, { fn: 'copAt', STEP, FROM, UNTIL, BOTH, args: ARGS, log, job });
    const P = pairsOf(rows); report.films[job] = { dur, moments: rows.length, pairs: P, guarded: Math.max(0, ...rows.map(r => r.r.guarded)), errs };
    log(job, 'dur', dur.toFixed(2), rows.length, 'moments,', P.length, 'pairs', errs.length ? 'errs ' + JSON.stringify(errs.slice(0, 3)) : '');
    for (const q of P) log('  ', q.from.toFixed(2) + '..' + q.to.toFixed(2), 'area', q.area, 'gap', q.gap, 'n', q.n.join(','), 'box', q.box.join(','), '|', q.a.slice(0, 70), '||', q.b.slice(0, 70));
  } catch (e) { log(job, 'FAILED', String(e).slice(0, 300), JSON.stringify(errs.slice(0, 4))); report.films[job] = { failed: String(e).slice(0, 300), errs }; }
  fs.writeFileSync(`${OUT}/coplanar-${CH}-${VIEW}.json`, JSON.stringify(report, null, 1));
  await p.close();
}
if (PHASES.length) {
  const p = await ctx.newPage(), errs = [];
  try {
    await boot(p, CH, log, errs); await toPlayReady(p); await install(p);
    for (const ph of PHASES) {
      await reachPhase(p, ph);
      if (process.env.CHECK === '1') log(ph, 'CHECK', JSON.stringify(await p.evaluate((a) => window.__clip.copCheck(a), ARGS)));
      const r = await p.evaluate((a) => window.__clip.copAt(a), ARGS);
      report.play[ph] = r;
      log('play', ph, r.objs, 'meshes,', r.indexed, 'indexed,', r.pairs.length, 'pairs,', r.guarded, 'guarded');
      for (const q of r.pairs) log('  ', 'area', q.area, 'gap', q.gap, 'n', q.n.join(','), 'box', q.box.join(','), '|', q.a.slice(0, 70), '||', q.b.slice(0, 70));
      fs.writeFileSync(`${OUT}/coplanar-${CH}-${VIEW}.json`, JSON.stringify(report, null, 1));
    }
    report.playErrs = errs;
  } catch (e) { log('play FAILED', String(e).slice(0, 300), JSON.stringify(errs.slice(0, 4))); report.playFailed = String(e).slice(0, 300); }
  await p.close();
}
fs.writeFileSync(`${OUT}/coplanar-${CH}-${VIEW}.json`, JSON.stringify(report, null, 1));
log('wrote', `${OUT}/coplanar-${CH}-${VIEW}.json`);
await b.close();
