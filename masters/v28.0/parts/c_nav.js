    /* ================================================================ THE WALKABLE MAP (R29: Chad, 21 Nov 2026: "The entire
       chapter 5 many characters have clipping problems. Cant the game have proper collision detection and proper path
       finding  and preventing bodies from clipping?"; his pick of three: "Chapter 5 only (Recommended)").
       WHY THEY CLIPPED: only he and the two bodies played in the fight ever collided. Everyone else stood where a number in a
       film or a station put him, chosen by hand shot by shot and checked only afterwards (the bag tied film put Ton's third
       place on the spot where Jun already stood, 10 cm apart), so each fix closed one clip and missed the next.
       WHAT THIS IS: one map of where a body can stand, made from the place's own solids, read WHERE EACH BODY IS: its hips in
       the world once its pose for the picture is laid, never its mark (its group's spot), because a take holds the hips off
       the mark (Mr Koh's 5.7 cm, Jun's 4 cm on deploy 25: the first design held the marks clear and moved nobody, measured;
       v24.4's law, "frame and fade a rig by where its body actually is", holds for keeping bodies out of things too).
         THE SETTLE, once a picture is made (each call of a film's frame, after every put and pose in it; in play, each drawn
         frame after the walkers have moved): every body on the floor that STANDS (hips 0.65 m up or more) is taken in turn,
         the ones that cannot be moved first (a seated body, one the film did not put in this picture), then the still ones,
         then the walking ones, each in the order the chapter made them:
           a still body whose disc meets a solid or a body already settled stands at the NEAREST clear point instead (rings
           2.5 cm apart, 32 ways round; the same answer every run): the mark moved by what the body needs;
           a walking body goes ROUND a body already settled on the side its way already passes it (its along-the-way
           distance kept, its across distance grown to the two discs: a smooth arc, never a side that flips), and in play
           off the solids too; in a film a walker is never pushed off a solid (a door the film opens is still shut in
           play's map: the lift's doors, the gate), the route below keeps him off the rest.
         fmWalk(...)  a film's walk: each leg that runs through a solid is found again round it (A* on a 10 cm grid round the
                      leg, pulled straight where the line is clear), solved once per path and kept, so a film stays a
                      function of its clock (a seek, a skip and a slow phone land on the same picture).
       LEFT AS THEY WERE: a body that does not stand (seated, kneeling: it is a body to go round, never moved); the spirits
       (the Prai: whether one may pass through a body or a wall is the plan's, put to Chad, R30) and the Naga; and
       everything while the fight is on (FS5.on: its two played bodies slide on the blockers already). He (the player) is
       a body walkers in play go round; a still one is never shoved by him.
       THE MAP: each solid is a column from the floor (S.blockers, grown 0.14 m for his eye: taken back off), grown by the
       body's disc; a blocker made empty (the gate, the leaf, by phase) is no solid. A SWITCH, NAV5.on: off, nothing moves.
       READ by tools/probes/e4c5bodies.py on the films' rows (stage.nav5: the counts): every shown standing body against the
       solids as they stand at each row and against each other, at every 0.1 s of every film. */
    const NAV5 = { on: true, r: 0.18, rOf: { p5koh: 0.21 }, gap: 0.02, grow: 0.14, ring: 0.025, far: 1.2, dirs: 32, cell: 0.1,
                   standY: 0.65, me: 0.25, deep: 0.12, moved: 0, routed: 0, missed: 0, passes: 0, deepIn: 0 };
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
    /* the SMALLEST move that clears a disc of radius r at (x, z): out of each solid it is in, across the side it is least
       far in by, and out of each body of `others` along the line between them, a few rounds until nothing is met. It is
       continuous where a body only brushes a solid (as a still body's breathing does: the rings above move in 2.5 cm
       steps). A solid it stands more than `deep` (12 cm) into is left as it is and counted (deepIn): only a picture that
       means it puts a body that far in (a doorway the film has open, which play's map still holds shut), and the check
       reports it, to be read with its picture */
    function navPush(x, z, r, others, deep = NAV5.deep) {
      const L = navBoxes(), ex = r - NAV5.r;
      for (let it = 0; it < 6; it++) {
        let met = false;
        for (const b of L) {
          const x0 = b[0] - ex, x1 = b[1] + ex, z0 = b[2] - ex, z1 = b[3] + ex;
          if (!(x > x0 && x < x1 && z > z0 && z < z1)) continue;
          const dl = x - x0, dr = x1 - x, dn = z - z0, df = z1 - z, m = Math.min(dl, dr, dn, df);
          if (m > deep) { NAV5.deepIn++; continue; }       // (stood in it by design: a door the picture has open, a gateway)
          if (m === dl) x = x0 - 1e-4; else if (m === dr) x = x1 + 1e-4; else if (m === dn) z = z0 - 1e-4; else z = z1 + 1e-4;
          met = true;
        }
        if (others) for (const o of others) {
          const m = r + o[2] + NAV5.gap, dx = x - o[0], dz = z - o[1], d = Math.hypot(dx, dz);
          if (d >= m) continue;
          if (d < 1e-6) x = o[0] + m + 1e-4; else { x = o[0] + dx / d * (m + 1e-4); z = o[1] + dz / d * (m + 1e-4); }
          met = true;
        }
        if (!met) return [x, z];
      }
      return [x, z];
    }
    /* the bodies a film put in THIS PICTURE (each call of a film's frame is one picture: its frame(t) puts every one of its
       people for that t, so a seek, a skip, a probe's run of seeks and play all land on the same picture), and whether each
       walks in it (fmWalk's own answer) along which way (its route) */
    const navFrame = { put: new Map(), depth: 0 };
    function navHook() {
      if (navHook.done) return;
      let F = null; try { F = FILMS5; } catch (e) { return; }      // (not yet made while the parts after this one build)
      navHook.done = true;
      const wrap = (o) => { if (!o || typeof o.frame !== 'function' || o.frame.__nav) return; const f0 = o.frame;
        const f = function (...a) { navFrame.depth++; if (navFrame.depth === 1) navFrame.put.clear();
          try { return f0.apply(this, a); } finally { navFrame.depth--; if (!navFrame.depth) navSettle('film'); } };
        f.__nav = true; o.frame = f; };
      for (const k of Object.keys(F)) wrap(F[k]);
    }
    Promise.resolve().then(() => navHook());                       // (once the chapter is built: before any film's first frame)
    const navSeen = (o) => { for (let q = o; q; q = q.parent) if (!q.visible) return false; return true; };
    const _navV = new THREE.Vector3();
    /* where a body is: its hips in the world (its pose for this picture laid), and how high they stand over the floor */
    function navBody(P) {
      const g = P.group.position;
      if (!P.hips) return [g.x, g.z, 1];
      P.group.updateWorldMatrix(true, false); P.hips.getWorldPosition(_navV);
      return [_navV.x, _navV.z, _navV.y - flatGround(_navV.x, _navV.z)];
    }
    /* the way a walker goes at this moment: the leg of his route nearest where he stands (a film), or toward where he is
       walking to (play), as a unit [x, z]; his facing where neither is known */
    function navWay(P, x, z, e) {
      let dx = 0, dz = 0;
      if (e && e.pts && e.pts.length > 1) { let best = Infinity;
        for (let i = 1; i < e.pts.length; i++) { const a = e.pts[i - 1], b = e.pts[i], ux = b[0] - a[0], uz = b[1] - a[1], L2 = ux * ux + uz * uz; if (L2 < 1e-8) continue;
          const u = Math.max(0, Math.min(1, ((x - a[0]) * ux + (z - a[1]) * uz) / L2)), px = a[0] + ux * u - x, pz = a[1] + uz * u - z, d2 = px * px + pz * pz;
          if (d2 < best) { best = d2; dx = ux; dz = uz; } } }
      else if (e && e.to) { dx = e.to[0] - x; dz = e.to[1] - z; }
      const L = Math.hypot(dx, dz);
      if (L < 1e-6) { const ry = P.group.rotation.y; return [Math.sin(ry), Math.cos(ry)]; }
      return [dx / L, dz / L];
    }
    /* round one body o ([x, z, r]) on the side the way already passes it: the distance along the way kept, the distance
       across grown to the two discs and a gap (an arc round it, continuous where the way enters and leaves the disc; a way
       through its very middle always passes on the same side) */
    function navRound(x, z, r, o, f) {
      const R = r + o[2] + NAV5.gap, dx = x - o[0], dz = z - o[1];
      if (dx * dx + dz * dz >= R * R) return null;
      const nx = f[1], nz = -f[0], a = dx * f[0] + dz * f[1], b = dx * nx + dz * nz, sd = b >= -1e-3 ? 1 : -1;
      const aa = Math.max(-R, Math.min(R, a)), bb = Math.sqrt(Math.max(0, R * R - aa * aa));
      return [o[0] + f[0] * aa + nx * bb * sd, o[1] + f[1] * aa + nz * bb * sd];
    }
    const navPlayWalk = new Map();                 // (play: the walkers walking this frame, and where to)
    /* THE SETTLE (the header): 'film' moves only the bodies the film put in this picture; 'play' any body on the floor */
    function navSettle(mode) {
      if (!NAV5.on || (typeof FS5 !== 'undefined' && FS5.on)) return;
      navBoxes(); NAV5.passes++;
      const film = mode === 'film', list = [];
      for (const P of people) {
        if (!P || !P.ready || P.hidden || !P.key || !NAV_FLOOR.test(P.key) || !navSeen(P.group)) continue;
        const b = navBody(P), stands = b[2] >= NAV5.standY;
        const e = film ? navFrame.put.get(P) : (navPlayWalk.has(P) ? { walk: true, to: navPlayWalk.get(P) } : null);
        const may = stands && (!film || !!e), walking = may && !!(e && e.walk);
        list.push({ P, x: b[0], z: b[1], r: navR(P), may, walking, e, rank: may ? (walking ? 2 : 1) : 0 });
      }
      list.sort((p, q) => p.rank - q.rank);         // (stable: within a rank, the order the chapter made them)
      const done = [];
      for (const it of list) {
        let x = it.x, z = it.z;
        if (it.may && !it.walking) {
          const q = navPush(x, z, it.r, done);
          if (q) { x = q[0]; z = q[1]; } else NAV5.missed++;
        } else if (it.walking) {
          const f = navWay(it.P, x, z, it.e), obs = film ? done : done.concat([[myX(), myZ(), NAV5.me]]);
          for (const o of obs) { const q = navRound(x, z, it.r, o, f); if (q) { x = q[0]; z = q[1]; } }
          if (!film) { const q = navPush(x, z, it.r, null); if (q) { x = q[0]; z = q[1]; } }
        }
        if (x !== it.x || z !== it.z) { const g = it.P.group.position; g.x += x - it.x; g.z += z - it.z; NAV5.moved++; }
        done.push([x, z, it.r]);
      }
    }
    /* THE WRAPS (each the original, called as it was) */
    const navPut0 = put;
    put = function (P, x, z, ry, y) {
      if (navFrame.depth && P && !navFrame.put.has(P)) navFrame.put.set(P, { walk: false, pts: null });
      return navPut0(P, x, z, ry, y);
    };
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
      navHook();
      const way = (NAV5.on && P && P.key && NAV_FLOOR.test(P.key) && !(typeof FS5 !== 'undefined' && FS5.on)) ? navRoute(pts, navR(P)) : pts;
      const moving = navWalk0(P, t, t0, way, v, rest, ryEnd, o);
      if (navFrame.depth && P) navFrame.put.set(P, { walk: !!moving, pts: way });
      return moving;
    };
    /* PLAY'S WALKERS: told to the settle (walking, and where to); the settle runs once the play's frame has moved them */
    const navWalkerMove0 = walkerMove;
    walkerMove = function (W0, tx, tz, wdt, pace) {
      const moving = navWalkerMove0(W0, tx, tz, wdt, pace);
      if (W0 && W0.P) { if (moving) navPlayWalk.set(W0.P, [tx, tz]); else navPlayWalk.delete(W0.P); }
      return moving;
    };
    const navPlayFrame0 = playFrame;
    playFrame = function (wdt, st) {
      const out = navPlayFrame0(wdt, st);
      navHook();
      if (st === 'play') navSettle('play');
      navPlayWalk.clear();
      return out;
    };
    /* the probe's read (stage.nav5): the solids as boxes, each body's disc, and the counts */
    const NAV5API = {
      get on() { return NAV5.on; }, set on(v) { NAV5.on = !!v; if (navBoxes.memo) navBoxes.memo.clear(); if (navRoute.memo) navRoute.memo.clear(); },
      boxes: () => navBoxes().map(b => b.slice()), r: NAV5.r, rOf: Object.assign({}, NAV5.rOf), floor: NAV_FLOOR.source,
      counts: () => ({ moved: NAV5.moved, routed: NAV5.routed, missed: NAV5.missed, passes: NAV5.passes, deepIn: NAV5.deepIn }),
      clear: (x, z, r) => navClear(x, z, r || NAV5.r, null), stand: (x, z, r) => navStand(x, z, r || NAV5.r, null)
    };
