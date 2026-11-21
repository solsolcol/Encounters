    /* ================================================================ THE WALKABLE MAP (R29: Chad, 21 Nov 2026: "The entire
       chapter 5 many characters have clipping problems. Cant the game have proper collision detection and proper path
       finding  and preventing bodies from clipping?"; his pick of three: "Chapter 5 only (Recommended)").
       WHY THEY CLIPPED: only he and the two bodies played in the fight ever collided. Everyone else stood where a number in a
       film or a station put him, chosen by hand shot by shot and checked only afterwards (the bag tied film put Ton's third
       place on the spot where Jun already stood, 10 cm apart), so each fix closed one clip and missed the next.
       WHAT THIS IS: one map of where a body can stand, made from the place's own solids, and the three functions every
       person is moved by WRAPPED here (this part edits no other: it can be pinned on its own on top of any base):
         put(P, x, z, ...)  every placement: a body on the floor that would stand in a solid, or in a body already put in
                            this drawn frame, stands at the NEAREST clear point instead (rings 2.5 cm apart, 32 ways round,
                            the first ring that has one; the same answer every run). A point already clear is left exactly
                            as it was, so every place the films already had clear is unchanged.
         fmWalk(...)        a film's walk: each leg that runs through a solid is found again round it (A* on a 10 cm grid
                            round the leg, pulled straight where the line is clear), solved once per path and kept, so a
                            film stays a function of its clock (a seek, a skip and a slow phone land on the same picture).
         walkerMove(...)    play's walkers (his teacher, Ton and Jun along the walkway): kept off the solids, off each other
                            and off him.
       LEFT AS THEY WERE: a seated body (at the table's seats, SEAT); the spirits (the Prai: whether one may pass through a
       body or a wall is the plan's, put to Chad, R30) and the Naga; and everything while the fight is on (FS5.on: its two
       played bodies slide on the blockers already, and its rules are FIGHT-IN's).
       THE MAP: each solid is a column from the floor (S.blockers, grown 0.14 m for his eye: taken back off), grown by the
       body's disc; a blocker made empty (the gate, the leaf, by phase) is no solid. A SWITCH, NAV5.on: off, nothing moves.
       READ by tools/probes/e4c5bodies.mjs (stage.nav5): every shown body against the solids and against each other, at
       every phase and every 0.1 s of every film. */
    const NAV5 = { on: true, r: 0.18, rOf: { p5koh: 0.21 }, gap: 0.02, grow: 0.14, ring: 0.025, far: 1.2, dirs: 32, cell: 0.1,
                   moved: 0, routed: 0, missed: 0 };
    const NAV_FLOOR = /^(p5pho|e4ton|p5jun|p5koh|p5zavier|p5collector)$/;   // (who stands on the floor; the spirits are not here)
    const navR = (P) => NAV5.rOf[P.key] || NAV5.r;
    /* the solids round a body's disc: [x0, x1, z0, z1], kept while the blockers are the same (a cheap signature each call) */
    function navBoxes() {
      const B = (S && S.blockers) || [], g = NAV5.r - NAV5.grow;
      let sig = B.length;
      for (const b of B) sig = (Math.imul(sig, 31) + (b.isEmpty() ? 7 : Math.round(b.min.x * 97 + b.max.z * 89 + b.max.x * 13))) | 0;
      if (navBoxes.list && navBoxes.sig === sig) return navBoxes.list;
      const L = [];
      for (const b of B) { if (b.isEmpty()) continue; L.push([b.min.x - g, b.max.x + g, b.min.z - g, b.max.z + g]); }
      navBoxes.sig = sig; navBoxes.list = L; navBoxes.memo = new Map(); navRoute.memo = new Map();
      if (S && !S.nav5) S.nav5 = NAV5API;
      return L;
    }
    const navInBox = (L, x, z, extra) => { for (const b of L) if (x > b[0] - extra && x < b[1] + extra && z > b[2] - extra && z < b[3] + extra) return true; return false; };
    /* clear for a disc of radius r at (x, z): no solid (the boxes are grown by NAV5.r; a larger body grows them by the rest),
       no body of `others` ([x, z, r]) nearer than the two discs and a gap */
    function navClear(x, z, r, others) {
      if (navInBox(navBoxes(), x, z, r - NAV5.r)) return false;
      if (others) for (const o of others) { const m = r + o[2] + NAV5.gap; if ((x - o[0]) * (x - o[0]) + (z - o[1]) * (z - o[1]) < m * m) return false; }
      return true;
    }
    /* the nearest clear point to (x, z) for a disc of radius r, or null when there is none within reach */
    function navStand(x, z, r, others) {
      if (navClear(x, z, r, others)) return [x, z];
      const key = Math.round(x * 100) + ',' + Math.round(z * 100) + ',' + Math.round(r * 100) + (others && others.length ? '|' + others.map(o => Math.round(o[0] * 100) + ',' + Math.round(o[1] * 100)).join(';') : '');
      const M = navBoxes.memo || (navBoxes.memo = new Map());
      if (M.has(key)) return M.get(key);
      let best = null;
      for (let k = 1; k * NAV5.ring <= NAV5.far + 1e-9 && !best; k++) { const rr = k * NAV5.ring;
        for (let i = 0; i < NAV5.dirs; i++) { const a = i / NAV5.dirs * Math.PI * 2, px = x + Math.sin(a) * rr, pz = z + Math.cos(a) * rr;
          if (navClear(px, pz, r, others)) { best = [px, pz]; break; } } }
      if (M.size > 20000) M.clear();
      M.set(key, best); return best;
    }
    /* the bodies put in THIS drawn frame (document.timeline's time is one value for every call inside one frame), so a body
       is kept off the ones already standing in this picture, never off where another stood a frame before (a seek then
       lands on the same picture as play) */
    const navFrame = { t: NaN, list: [] };
    const navNow = () => { try { return document.timeline.currentTime; } catch (e) { return 0; } };
    let navWalker = null;                          // (the body fmWalk is moving: kept off the solids only, by its route)
    const navSeated = (x, z) => { for (const k in SEAT) { const s = SEAT[k]; if (Math.hypot(x - s.x, z - s.z) < 0.4) return true; } return false; };
    function navAt(P, x, z) {
      if (!NAV5.on || !P || !P.key || !NAV_FLOOR.test(P.key) || (typeof FS5 !== 'undefined' && FS5.on) || navSeated(x, z)) return null;
      const t = navNow(); if (t !== navFrame.t) { navFrame.t = t; navFrame.list.length = 0; }
      const r = navR(P), walking = navWalker === P;
      const others = walking ? null : navFrame.list.filter(o => o[3] !== P && !o[4]).map(o => [o[0], o[1], o[2]]);
      const q = navStand(x, z, r, others);
      const fx = q ? q[0] : x, fz = q ? q[1] : z;
      if (!q) NAV5.missed++; else if (q[0] !== x || q[1] !== z) NAV5.moved++;
      const shown = !P.hidden && (!P.ready || P.group.visible);
      const i = navFrame.list.findIndex(o => o[3] === P);
      if (shown) { const e = [fx, fz, r, P, walking]; if (i >= 0) navFrame.list[i] = e; else navFrame.list.push(e); } else if (i >= 0) navFrame.list.splice(i, 1);
      return (fx !== x || fz !== z) ? [fx, fz] : null;
    }
    /* THE WRAPS (each the original, called as it was, with the place made clear) */
    const navPut0 = put;
    put = function (P, x, z, ry, y) { const q = navAt(P, x, z); return q ? navPut0(P, q[0], q[1], ry, y === undefined ? flatGround(q[0], q[1]) : y) : (y === undefined ? navPut0(P, x, z, ry) : navPut0(P, x, z, ry, y)); };
    /* A FILM'S WALK ROUTED ROUND THE SOLIDS: the path itself unchanged where every leg is clear */
    function navLegClear(a, b, r) { const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.ceil(L / 0.05));
      for (let i = 0; i <= n; i++) { const u = i / n; if (!navClear(a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, r, null)) return false; } return true; }
    function navAstar(a, b, r) {
      const C = NAV5.cell, pad = 3, x0 = Math.min(a[0], b[0]) - pad, z0 = Math.min(a[1], b[1]) - pad;
      const W = Math.ceil((Math.abs(b[0] - a[0]) + 2 * pad) / C) + 1, H = Math.ceil((Math.abs(b[1] - a[1]) + 2 * pad) / C) + 1;
      const ix = (x) => Math.max(0, Math.min(W - 1, Math.round((x - x0) / C))), iz = (z) => Math.max(0, Math.min(H - 1, Math.round((z - z0) / C)));
      const cx = (i) => x0 + i * C, cz = (j) => z0 + j * C, N = W * H, free = new Int8Array(N).fill(-1);
      const ok = (i, j) => { const k = j * W + i; if (free[k] < 0) free[k] = navClear(cx(i), cz(j), r, null) ? 1 : 0; return free[k] === 1; };
      const si = ix(a[0]), sj = iz(a[1]), gi = ix(b[0]), gj = iz(b[1]);
      const g = new Float32Array(N).fill(Infinity), from = new Int32Array(N).fill(-1), shut = new Uint8Array(N), open = [];
      const h = (i, j) => Math.hypot(i - gi, j - gj);
      const push = (k, f) => { open.push([f, k]); let c = open.length - 1; while (c > 0) { const p = (c - 1) >> 1; if (open[p][0] <= open[c][0]) break; [open[p], open[c]] = [open[c], open[p]]; c = p; } };
      const pop = () => { const top = open[0], last = open.pop(); if (open.length) { open[0] = last; let c = 0; for (;;) { const l = 2 * c + 1, rr = l + 1; let m = c;
        if (l < open.length && open[l][0] < open[m][0]) m = l; if (rr < open.length && open[rr][0] < open[m][0]) m = rr; if (m === c) break; [open[m], open[c]] = [open[c], open[m]]; c = m; } } return top; };
      g[sj * W + si] = 0; push(sj * W + si, h(si, sj));
      const D = [[1, 0, 1], [-1, 0, 1], [0, 1, 1], [0, -1, 1], [1, 1, Math.SQRT2], [1, -1, Math.SQRT2], [-1, 1, Math.SQRT2], [-1, -1, Math.SQRT2]];
      let found = false, steps = 0;
      while (open.length && steps++ < 60000) { const [, k] = pop(); if (shut[k]) continue; shut[k] = 1; const i = k % W, j = (k / W) | 0;
        if (i === gi && j === gj) { found = true; break; }
        for (const [di, dj, c] of D) { const ni = i + di, nj = j + dj; if (ni < 0 || nj < 0 || ni >= W || nj >= H) continue;
          if (!ok(ni, nj) || (di && dj && (!ok(i + di, j) || !ok(i, j + dj)))) continue;
          const nk = nj * W + ni, ng = g[k] + c; if (ng < g[nk]) { g[nk] = ng; from[nk] = k; push(nk, ng + h(ni, nj)); } } }
      if (!found) return null;
      const cells = []; for (let k = gj * W + gi; k >= 0; k = from[k]) cells.push([cx(k % W), cz((k / W) | 0)]);
      cells.reverse(); cells[0] = [a[0], a[1]]; cells[cells.length - 1] = [b[0], b[1]];
      /* pulled straight: from each kept point, the furthest later point the line reaches clear */
      const out = [cells[0]]; let at = 0;
      while (at < cells.length - 1) { let nx = cells.length - 1; while (nx > at + 1 && !navLegClear(cells[at], cells[nx], r)) nx--; out.push(cells[nx]); at = nx; }
      return out;
    }
    function navRoute(pts, r) {
      if (!NAV5.on || !pts || pts.length < 2) return pts;
      navBoxes();
      const key = pts.map(p => Math.round(p[0] * 1000) + ',' + Math.round(p[1] * 1000)).join(';') + '|' + Math.round(r * 100);
      const M = navRoute.memo || (navRoute.memo = new Map());
      if (M.has(key)) return M.get(key);
      let out = pts, changed = false;
      if (!pts.every((p, i) => i === 0 || navLegClear(pts[i - 1], p, r))) {
        out = [];
        for (let i = 0; i < pts.length; i++) {
          const p = navStand(pts[i][0], pts[i][1], r, null) || pts[i];
          if (i === 0) { out.push(p); continue; }
          const a = out[out.length - 1];
          if (navLegClear(a, p, r)) { out.push(p); continue; }
          const via = navAstar(a, p, r);
          if (via) { for (let k = 1; k < via.length; k++) out.push(via[k]); } else { out.push(p); NAV5.missed++; }
        }
        changed = true; NAV5.routed++;
      }
      M.set(key, out); void changed;
      return out;
    }
    const navWalk0 = fmWalk;
    fmWalk = function (P, t, t0, pts, v, rest, ryEnd, o) {
      const was = navWalker; navWalker = P;
      try { return navWalk0(P, t, t0, (NAV5.on && P && P.key && NAV_FLOOR.test(P.key) && !(typeof FS5 !== 'undefined' && FS5.on)) ? navRoute(pts, navR(P)) : pts, v, rest, ryEnd, o); }
      finally { navWalker = was; }
    };
    /* PLAY'S WALKERS kept off the solids, off one another and off him (his disc: 0.25 m round where he stands) */
    const navWalkerMove0 = walkerMove;
    walkerMove = function (W0, tx, tz, wdt, pace) {
      const moving = navWalkerMove0(W0, tx, tz, wdt, pace);
      if (!NAV5.on || !W0 || !W0.P || !W0.P.group || (typeof FS5 !== 'undefined' && FS5.on)) return moving;
      const P = W0.P, g = P.group.position, r = navR(P), others = [[myX(), myZ(), 0.25]];
      for (const w of walkers.list) if (w !== W0 && w.P && w.P.group && w.P.group.visible) others.push([w.P.group.position.x, w.P.group.position.z, navR(w.P)]);
      const q = navStand(g.x, g.z, r, others); if (q && (q[0] !== g.x || q[1] !== g.z)) { g.x = q[0]; g.z = q[1]; NAV5.moved++; }
      return moving;
    };
    /* the probe's read (stage.nav5): the solids as boxes, each body's disc, and the counts */
    const NAV5API = {
      get on() { return NAV5.on; }, set on(v) { NAV5.on = !!v; if (navBoxes.memo) navBoxes.memo.clear(); if (navRoute.memo) navRoute.memo.clear(); },
      boxes: () => navBoxes().map(b => b.slice()), r: NAV5.r, rOf: Object.assign({}, NAV5.rOf), floor: NAV_FLOOR.source,
      counts: () => ({ moved: NAV5.moved, routed: NAV5.routed, missed: NAV5.missed }),
      clear: (x, z, r) => navClear(x, z, r || NAV5.r, null), stand: (x, z, r) => navStand(x, z, r || NAV5.r, null)
    };
