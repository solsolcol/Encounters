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
       THE MAP: each solid is a column from the floor (S.blockers, grown 0.14 m for his eye: taken back off), met by each
       body's own measured reach (R76: FOOT5, below; it was one disc of 0.18 m for all); a blocker made empty (the gate, the
       leaf, by phase) is no solid. A SWITCH, NAV5.on: off, nothing moves.
       READ by tools/probes/e4c5bodies.py on the films' rows (stage.nav5: the counts): every shown standing body against the
       solids as they stand at each row and against each other, at every 0.1 s of every film. */
    const NAV5 = { on: true, gap: 0.02, grow: 0.14, ring: 0.025, far: 1.2, dirs: 32, cell: 0.1, comfort: 0.10, near: 0.35, limbs: true, limbTol: 0.03, limbMax: 0.2, limbOut: 0.8, limbBack: 0.2, limbHold: 0.8, limbMoved: 0,
                   standY: 0.65, moved: 0, routed: 0, missed: 0, passes: 0, deepIn: 0, open: new Set(), shut: new Set() };
    const NAV_FLOOR = /^(p5pho|e4ton|p5jun|p5koh|p5zavier|p5collector)$/;   // (who stands on the floor; the spirits are not here)
    /* EACH BODY'S OWN REACH OVER THE FLOOR (R76, Chad, 23 Nov 2026: "why isn't there some kind of universal fix to this?"
       ... "characters still walking into walls, arms of characters clipping through each other"). The map held every body
       as one disc 0.18 m round its hips (Mr Koh 0.21): a man's shoulders and hanging hands are some 0.27 m either side of
       his middle, so a body kept 0.18 off a wall had a shoulder in it, and two men side by side 0.38 apart had their arms
       through each other. Each body's reach is MEASURED from its own skin (tools/probes/e4c5foot.mjs: every sixth point of
       its skin, at twelve moments of each take it plays, about its hips, in its own frame): `a` half its width across
       (shoulders, arms, hands), `b` half its depth front to back standing, `bw` walking (the arms' and the legs' swing). It
       is an ellipse turned with the body: its reach toward a way u is sqrt((a u_across)^2 + (b u_front)^2), so two men face
       to face may stand as close as their chests allow and side by side no closer than their arms. A route keeps
       NAV5.comfort (0.10 m) more than a body's half-width off every solid where the place has the room, and only the bare
       half-width where it has not, within NAV5.near of either end (a station by a wall stays where it is) */
    /* (measured 23 Nov 2026 on build 43, the 99th hundredth of every sixth skin point over twelve moments of each take: across
       the higher of the shoulders' band and the hands' band, standing and walking; b the standing take's front and back;
       bw the walk's (the hands' swing). Grandmaster Pho's robe flares to 0.38 across at the hands; Mr Koh is the broadest
       man and stands with his belly 0.23 forward) */
    const FOOT5 = { p5pho: { a: 0.37, b: 0.24, bw: 0.39 }, e4ton: { a: 0.26, b: 0.17, bw: 0.34 }, p5jun: { a: 0.27, b: 0.19, bw: 0.32 },
                    p5koh: { a: 0.33, b: 0.23, bw: 0.37 }, p5zavier: { a: 0.26, b: 0.16, bw: 0.38 }, def: { a: 0.27, b: 0.20, bw: 0.36 } },
          FOOT_ME5 = { a: 0.25, b: 0.25, bw: 0.25 };
    const footOf = (P) => (P && FOOT5[P.key]) || FOOT5.def;
    const discF = (r) => ({ a: r, b: r, bw: r });
    /* a body's reach (f, turned ry, walking or still) toward the unit way (ux, uz) in the world */
    function footReach(f, ry, walking, ux, uz) {
      const c = Math.cos(ry), sn = Math.sin(ry), ac = ux * c - uz * sn, fw = ux * sn + uz * c, b = walking ? f.bw : f.b;
      return Math.sqrt(f.a * f.a * ac * ac + b * b * fw * fw);
    }
    const navR = (P) => footOf(P).a;                               // (a route's disc: the body's half-width across)
    /* THE SOLIDS, each [x0, x1, z0, z1] (the blockers taken back by the 0.14 m they were grown for his eye), kept while the
       blockers are the same (a cheap signature each call). INSIDE A FILM'S PICTURE (navFilmOn) a solid the film has open
       (navFilmOpen: the lift's doors as they slide open in the opening) is no solid: play's map holds those doors shut */
    let navFilmOn = false;
    function navFilmOpen(solid, open) { if (!solid) return; if (open) NAV5.open.add(solid); else NAV5.open.delete(solid); }
    /* (and a solid play's map has EMPTY that the film has standing: the gate's leaf swung open along the court's wall while
       the walk phase holds the gate shut: the devotee film. Its box is the solid's own) */
    function navFilmShut(solid, on) { if (!solid) return; if (on) NAV5.shut.add(solid); else NAV5.shut.delete(solid); }
    const navSolidBox = new WeakMap();
    function navBoxOf(q) { let b = navSolidBox.get(q); if (!b) { q.updateWorldMatrix(true, false); const B = new THREE.Box3().setFromObject(q); b = [B.min.x, B.max.x, B.min.z, B.max.z]; navSolidBox.set(q, b); } return b; }
    function navBoxes() {
      /* (signed at most once in 30 ms: within one picture the blockers are the same, and a nearest-point search makes up to
         1,536 calls, each of which signed every blocker again: R33's L4-11) */
      const film = navFilmOn && (NAV5.open.size > 0 || NAV5.shut.size > 0), C = film ? navBoxes.F : navBoxes.P, now = performance.now();
      if (C.list && now - (C.t || 0) < 30) return C.list;
      C.t = now;
      const B = (S && S.blockers) || [], g = NAV5.grow, skip = new Set();
      if (film) for (const q of NAV5.open) { const i = solids.indexOf(q); if (i >= 0) skip.add(i); }
      let sig = B.length;
      for (const b of B) sig = (Math.imul(sig, 31) + (b.isEmpty() ? 7 : Math.round(b.min.x * 97 + b.max.z * 89 + b.max.x * 13))) | 0;
      for (const i of skip) sig = (Math.imul(sig, 31) + i + 1) | 0;
      if (film) for (const q of NAV5.shut) sig = (Math.imul(sig, 31) + 1000 + solids.indexOf(q)) | 0;
      if (C.list && C.sig === sig) return C.list;
      const L = [];
      B.forEach((b, i) => { if (b.isEmpty() || skip.has(i)) return; L.push([b.min.x + g, b.max.x - g, b.min.z + g, b.max.z - g]); });
      if (film) for (const q of NAV5.shut) { const i = solids.indexOf(q); if (i >= 0 && B[i] && B[i].isEmpty()) L.push(navBoxOf(q).slice()); }
      C.sig = sig; C.list = L; C.memo = new Map(); C.routes = new Map();
      if (S && !S.nav5) S.nav5 = NAV5API;
      return L;
    }
    navBoxes.P = {}; navBoxes.F = {};
    const navMemo = () => { navBoxes(); return (navFilmOn && (NAV5.open.size > 0 || NAV5.shut.size > 0) ? navBoxes.F : navBoxes.P); };
    /* how far a body reaches INTO the solid b (> 0: it does), and out[] the way out of it: [ux, uz, hips inside the solid] */
    function footInBox(b, x, z, f, ry, walking, out) {
      const qx = Math.max(b[0], Math.min(b[1], x)), qz = Math.max(b[2], Math.min(b[3], z)), dx = x - qx, dz = z - qz, d = Math.hypot(dx, dz);
      if (d > 1e-6) { const ux = dx / d, uz = dz / d; if (out) { out[0] = ux; out[1] = uz; out[2] = false; } return footReach(f, ry, walking, ux, uz) - d; }
      const dl = x - b[0], dr = b[1] - x, dn = z - b[2], df = b[3] - z, m = Math.min(dl, dr, dn, df);
      const ux = m === dl ? -1 : m === dr ? 1 : 0, uz = ux ? 0 : (m === dn ? -1 : 1);
      if (out) { out[0] = ux; out[1] = uz; out[2] = true; }
      return m + footReach(f, ry, walking, ux, uz);
    }
    /* how far two bodies' reaches overlap along the line between them (> 0: they do); o is { x, z, f, ry, w } */
    function footApart(x, z, f, ry, w, o) {
      const dx = o.x - x, dz = o.z - z, d = Math.hypot(dx, dz);
      if (d < 1e-6) return 1;
      return footReach(f, ry, w, dx / d, dz / d) + footReach(o.f, o.ry, o.w, -dx / d, -dz / d) + NAV5.gap - d;
    }
    /* clear for a body (f, ry, w) at (x, z): no solid within its reach, and no body of `others` within the two reaches */
    function navClear(x, z, f, ry, w, others) {
      for (const b of navBoxes()) { if (x < b[0] - 1 || x > b[1] + 1 || z < b[2] - 1 || z > b[3] + 1) continue; if (footInBox(b, x, z, f, ry, w, null) > 0) return false; }
      if (others) for (const o of others) if (footApart(x, z, f, ry, w, o) > 0) return false;
      return true;
    }
    /* the nearest clear point to (x, z) for a body, or null when there is none within reach */
    function navStand(x, z, f, ry, w, others) {
      if (navClear(x, z, f, ry, w, others)) return [x, z];
      const key = Math.round(x * 100) + ',' + Math.round(z * 100) + ',' + Math.round(f.a * 100) + ',' + Math.round((w ? f.bw : f.b) * 100) + ',' + Math.round(ry * 50) + (others && others.length ? '|' + others.map(o => Math.round(o.x * 100) + ',' + Math.round(o.z * 100)).join(';') : '');
      const M = navMemo().memo;
      if (M.has(key)) return M.get(key);
      let best = null;
      for (let k = 1; k * NAV5.ring <= NAV5.far + 1e-9 && !best; k++) { const rr = k * NAV5.ring;
        for (let i = 0; i < NAV5.dirs; i++) { const a = i / NAV5.dirs * Math.PI * 2, px = x + Math.sin(a) * rr, pz = z + Math.cos(a) * rr;
          if (navClear(px, pz, f, ry, w, others)) { best = [px, pz]; break; } } }
      if (M.size > 20000) M.clear();
      M.set(key, best); return best;
    }
    /* the SMALLEST move that clears a body (f, ry, w) at (x, z): out of each solid its reach is in, along the way out of
       that solid (exact on a face, the nearest corner's way at a corner), and out of each body of `others` along the line
       between them, a few rounds until nothing is met. It is continuous where a body only brushes a solid (as a still
       body's breathing does). A body whose HIPS stand inside a solid is left as it is and counted (deepIn): only a picture
       that means it puts him there (a doorway the film has open and has not said so, navFilmOpen), and the check reports
       it, to be read with its picture */
    function navPush(x, z, f, ry, w, others) {
      const L = navBoxes(), o3 = [0, 0, false];
      for (let it = 0; it < 6; it++) {
        let met = false;
        for (const b of L) {
          if (x < b[0] - 1 || x > b[1] + 1 || z < b[2] - 1 || z > b[3] + 1) continue;
          const pen = footInBox(b, x, z, f, ry, w, o3);
          if (pen <= 0) continue;
          if (o3[2]) { NAV5.deepIn++; continue; }       // (stood in it by design: a door the picture has open, a gateway)
          x += o3[0] * (pen + 1e-4); z += o3[1] * (pen + 1e-4); met = true;
        }
        if (others) for (const o of others) {
          const pen = footApart(x, z, f, ry, w, o); if (pen <= 0) continue;
          const dx = x - o.x, dz = z - o.z, d = Math.hypot(dx, dz);
          if (d < 1e-6) x += pen + 1e-4; else { x += dx / d * (pen + 1e-4); z += dz / d * (pen + 1e-4); }
          met = true;
        }
        if (!met) return [x, z];
      }
      return [x, z];
    }
    /* the bodies a film put in THIS PICTURE (each call of a film's frame is one picture: its frame(t) puts every one of its
       people for that t, so a seek, a skip, a probe's run of seeks and play all land on the same picture), and whether each
       walks in it (fmWalk's own answer) along which way (its route) */
    /* (t, f: the film's clock and which film, for the arms' ease: R79) */
    const navFrame = { put: new Map(), depth: 0, t: null, f: null };
    /* THE THINGS A BODY CARRIES in the world (laid at its hands this picture by handHold5 and STICK5, world-attached): when the
       settle moves the body they go with it, by the same amount (R33, lens 4's L4-08: Ton's wrapped staff, Jun's duffel,
       his teacher's tied bag, the stick laid on Ton's palms were laid before the settle and left where the body had been) */
    const navCarry = new Map();
    function navCarried(P, g) { if (!P || !g) return; let a = navCarry.get(P); if (!a) navCarry.set(P, a = []); if (!a.includes(g)) a.push(g); }
    function navHook() {
      if (navHook.done) return;
      let F = null; try { F = FILMS5; } catch (e) { return; }      // (not yet made while the parts after this one build)
      navHook.done = true;
      const wrap = (o) => { if (!o || typeof o.frame !== 'function' || o.frame.__nav) return; const f0 = o.frame;
        const f = function (...a) { navFrame.depth++; if (navFrame.depth === 1) { navFrame.put.clear(); navCarry.clear(); NAV5.open.clear(); NAV5.shut.clear(); navFilmOn = true;
            navFrame.t = typeof a[0] === 'number' ? a[0] : typeof a[1] === 'number' ? a[1] : null; navFrame.f = typeof a[0] === 'string' ? 'ending:' + a[0] : o; }
          try { return f0.apply(this, a); } finally { navFrame.depth--; if (!navFrame.depth) { try { navSettle('film'); } finally { navFilmOn = false; } } } };
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
    /* round one body o ({ x, z, f, ry, w }) on the side the way fd already passes it: the distance along the way kept, the
       distance across grown to the two reaches and a gap, read along the line between them (an arc round it, continuous
       where the way enters and leaves it; a way through its very middle always passes on the same side) */
    function navRound(x, z, it, o, fd) {
      const dx = x - o.x, dz = z - o.z, d0 = Math.hypot(dx, dz), ux = d0 > 1e-6 ? dx / d0 : fd[1], uz = d0 > 1e-6 ? dz / d0 : -fd[0];
      const R = footReach(it.f, it.ry, true, -ux, -uz) + footReach(o.f, o.ry, o.w, ux, uz) + NAV5.gap;
      if (d0 >= R) return null;
      const nx = fd[1], nz = -fd[0], a = dx * fd[0] + dz * fd[1], b = dx * nx + dz * nz, sd = b >= -1e-3 ? 1 : -1;
      const aa = Math.max(-R, Math.min(R, a)), bb = Math.sqrt(Math.max(0, R * R - aa * aa));
      return [o.x + fd[0] * aa + nx * bb * sd, o.z + fd[1] * aa + nz * bb * sd];
    }
    const navPlayWalk = new Map();                 // (play: the walkers walking this frame, and where to)
    /* THE ARMS (R76: "arms of characters clipping through each other"). Kept apart by their reaches, two bodies can still put
       an arm into each other: a hand that talks, an arm that hangs wide, past the 99th hundredth the reach was measured at.
       So what is DRAWN is read too: each pair of standing bodies within 1.6 m of each other, each as sixteen capsules along
       its own bones (the torso, the head, the upper arms, forearms and hands, the thighs, shins and feet; the limbs' own
       check's, tools/probes/limbclip.js, the same numbers), and where an arm or a hand of one reaches more than NAV5.limbTol
       (3 cm) into the other (two hands meeting excepted: a thing handed from one to the other), the one that may move is
       moved straight away from the other by what overlaps (at most 0.2 m), and off the solids again */
    const LIMB5 = [['torso', 'Hips', 'Neck', 0, 0.13], ['head', 'Head', null, 0.2, 0.1]];
    for (const sd of ['Left', 'Right']) LIMB5.push(['uarm', sd + 'Arm', sd + 'ForeArm', 0, 0.05], ['farm', sd + 'ForeArm', sd + 'Hand', 0, 0.04], ['hand', sd + 'Hand', null, 0.12, 0.04],
      ['thigh', sd + 'UpLeg', sd + 'Leg', 0, 0.075], ['shin', sd + 'Leg', sd + 'Foot', 0, 0.05], ['foot', sd + 'Foot', sd + 'ToeBase', 0, 0.045]);
    const TORSO5 = { p5koh: 0.17, p5pho: 0.15 }, _lnA = new THREE.Vector3(), _lnB = new THREE.Vector3(), _lnQ = new THREE.Quaternion();
    const navLimbBones = new WeakMap();
    /* (R75's debug, B3: Ton, Jun, Mr Koh and Master Zavier name the neck `neck`, Grandmaster Pho `mixamorig:Neck`, and the
       name was matched in its own case: their torsos were never one of the capsules, so no arm was ever kept out of their
       chests or backs, and nothing said so. A bone is looked for in its own case first, then in any; a capsule that still
       finds no bone is said once a body, never dropped in silence: R40) */
    const navBone = (P, nm) => { const b = boneOf(P, nm); if (b || !P || !P.bone) return b;
      const re = new RegExp('^(mixamorig:?)?' + nm + '$', 'i'); for (const n in P.bone) if (re.test(n)) return P.bone[n]; return null; };
    function navCaps(P) {
      let bs = navLimbBones.get(P);
      if (!bs) { bs = LIMB5.map(([nm, b0, b1, len, r]) => [nm, navBone(P, b0), b1 ? navBone(P, b1) : null, len, nm === 'torso' ? (TORSO5[P.key] || r) : r]); navLimbBones.set(P, bs);
        const lost = bs.filter(([nm, A, B, len], i) => !A || (len === 0 && !B)).map(([nm], i) => nm);
        if (lost.length) console.warn('e4c5 limbs: ' + (P.key || '?') + ' has no bones for ' + lost.join(', ') + ': those capsules are not read'); }
      P.group.updateWorldMatrix(true, true);
      const out = [];
      for (const [nm, A, B, len, r] of bs) { if (!A || (len === 0 && !B)) continue;
        A.getWorldPosition(_lnA);
        if (B) B.getWorldPosition(_lnB); else { A.getWorldQuaternion(_lnQ); _lnB.set(0, 1, 0).applyQuaternion(_lnQ).multiplyScalar(len).add(_lnA); }
        out.push([nm, _lnA.x, _lnA.y, _lnA.z, _lnB.x, _lnB.y, _lnB.z, r]); }
      return out;
    }
    function navSegSeg(c1, c2) {
      const d1x = c1[4] - c1[1], d1y = c1[5] - c1[2], d1z = c1[6] - c1[3], d2x = c2[4] - c2[1], d2y = c2[5] - c2[2], d2z = c2[6] - c2[3];
      const rx = c1[1] - c2[1], ry = c1[2] - c2[2], rz = c1[3] - c2[3];
      const A = d1x * d1x + d1y * d1y + d1z * d1z, Bq = d2x * d2x + d2y * d2y + d2z * d2z, C = d1x * rx + d1y * ry + d1z * rz, F = d2x * rx + d2y * ry + d2z * rz;
      let s = 0, t = 0;
      if (A < 1e-9 && Bq < 1e-9) { s = 0; t = 0; } else if (A < 1e-9) { t = Math.max(0, Math.min(1, F / Bq)); } else if (Bq < 1e-9) { s = Math.max(0, Math.min(1, -C / A)); }
      else { const Bd = d1x * d2x + d1y * d2y + d1z * d2z, den = A * Bq - Bd * Bd; s = den > 1e-12 ? Math.max(0, Math.min(1, (Bd * F - C * Bq) / den)) : 0; t = (Bd * s + F) / Bq;
        if (t < 0) { t = 0; s = Math.max(0, Math.min(1, -C / A)); } else if (t > 1) { t = 1; s = Math.max(0, Math.min(1, (Bd - C) / A)); } }
      const px = c1[1] + d1x * s - (c2[1] + d2x * t), py = c1[2] + d1y * s - (c2[2] + d2y * t), pz = c1[3] + d1z * s - (c2[3] + d2z * t);
      return Math.sqrt(px * px + py * py + pz * pz);
    }
    /* how far the two bodies' drawn limbs go into each other at the deepest (two hands meeting left out) */
    function navLimbDeep(cA, cB) {
      let d = 0;
      for (const a of cA) for (const b of cB) { if (a[0] === 'hand' && b[0] === 'hand') continue;
        const pen = a[7] + b[7] - navSegSeg(a, b); if (pen > d) d = pen; }
      return d;
    }
    /* THE SETTLE (the header): 'film' moves only the bodies the film put in this picture; 'play' any body on the floor */
    function navSettle(mode) {
      const fight = typeof FS5 !== 'undefined' && FS5.on;
      if (!NAV5.on || (fight && mode !== 'film')) return;
      navBoxes(); NAV5.passes++;
      const film = mode === 'film', list = [];
      for (const P of people) {
        if (!P || !P.ready || P.hidden || !P.key || !NAV_FLOOR.test(P.key) || !navSeen(P.group)) continue;
        if (fight && (P === cast.pho || P === cast.zav)) continue;         // (in the fight's own film its two are the fight's)
        const b = navBody(P), stands = b[2] >= NAV5.standY;
        const e = film ? navFrame.put.get(P) : (navPlayWalk.has(P) ? { walk: true, to: navPlayWalk.get(P) } : null);
        const may = stands && (!film || !!e), walking = may && !!(e && e.walk);
        list.push({ P, x: b[0], z: b[1], f: footOf(P), ry: P.group.rotation.y, may, walking, e, rank: may ? (walking ? 2 : 1) : 0 });
      }
      list.sort((p, q) => p.rank - q.rank);         // (stable: within a rank, the order the chapter made them)
      const done = [];
      for (const it of list) {
        let x = it.x, z = it.z;
        if (it.may && !it.walking) {
          const q = navPush(x, z, it.f, it.ry, false, done);
          if (q) { x = q[0]; z = q[1]; } else NAV5.missed++;
        } else if (it.walking) {
          const fd = navWay(it.P, x, z, it.e), obs = film ? done : done.concat([{ x: myX(), z: myZ(), f: FOOT_ME5, ry: 0, w: false }]);
          for (const o of obs) { const q = navRound(x, z, it, o, fd); if (q) { x = q[0]; z = q[1]; } }
          if (!film) { const q = navPush(x, z, it.f, it.ry, true, null); if (q) { x = q[0]; z = q[1]; } }
        }
        if (x !== it.x || z !== it.z) { const g = it.P.group.position, dx = x - it.x, dz = z - it.z; g.x += dx; g.z += dz; NAV5.moved++;
          const cs = navCarry.get(it.P); if (cs) for (const c of cs) if (c.parent === world) { c.position.x += dx; c.position.z += dz; } }
        done.push({ x, z, f: it.f, ry: it.ry, w: it.walking });
      }
      /* THE ARMS (above): each pair standing within 1.6 m, the later one (or the earlier, if only it may) moved off */
      if (NAV5.limbs) {
        const st = list.map((it, k) => ({ it, k, stands: navBody(it.P)[2] >= NAV5.standY }));
        const easeOn = film && navFrame.t != null, want = new Map();
        for (let i = 1; i < st.length; i++) for (let j = 0; j < i; j++) {
          const A = st[j], Bq = st[i]; if (!A.stands || !Bq.stands) continue;
          const mv = Bq.it.may ? Bq : A.it.may ? A : null; if (!mv) continue;
          const other = mv === Bq ? A : Bq, gm = mv.it.P.group.position, go = other.it.P.group.position;
          if (Math.hypot(gm.x - go.x, gm.z - go.z) > 1.6) continue;
          const deep = navLimbDeep(navCaps(mv.it.P), navCaps(other.it.P));
          if (deep <= NAV5.limbTol) continue;
          const bm = navBody(mv.it.P), bo = navBody(other.it.P); let dx = bm[0] - bo[0], dz = bm[1] - bo[1]; const dl = Math.hypot(dx, dz) || 1; dx /= dl; dz /= dl;
          const by = Math.min(NAV5.limbMax, deep - NAV5.limbTol + 0.01);
          let nx = gm.x + dx * by, nz = gm.z + dz * by;
          if (!(film && mv.it.walking)) { const q = navPush(bm[0] + dx * by, bm[1] + dz * by, mv.it.f, mv.it.ry, mv.it.walking, null); nx += q[0] - (bm[0] + dx * by); nz += q[1] - (bm[1] + dz * by); }
          const mx = nx - gm.x, mz = nz - gm.z;
          if (easeOn && !mv.it.walking) { const w = want.get(mv.it) || [0, 0]; w[0] += mx; w[1] += mz; want.set(mv.it, w); continue; }
          gm.x = nx; gm.z = nz; NAV5.limbMoved++;
          const cs = navCarry.get(mv.it.P); if (cs) for (const c of cs) if (c.parent === world) { c.position.x += mx; c.position.z += mz; }
        }
        if (easeOn) navLimbEase(list, want);
      }
    }
    /* THE ARMS' MOVE, EASED IN A FILM (R79, Chad, 24 Nov 2026: "his hand movement causes collision to ton, and because of
       that, ton jerks repeatedly to clear the collision but ends up vibrating"). A film puts its people again in every
       picture, so the move above, made afresh from each picture's overlap, followed a talking hand in and out of a body
       standing still beside it: moved off in one picture, put back in the next, many times a second. In a film a STANDING
       body's move off another's arm is eased on the film's own clock instead: out toward what this picture asks at
       NAV5.limbOut metres a second, held while an arm is still there, and back at NAV5.limbBack once it has been clear for
       NAV5.limbHold seconds. A seek, a skip, another film or a picture more than a quarter second from the last lands on
       what its own picture asks at once, so a probe's seeks see each picture's own move, as before. A walker's move, and
       play's (where a body is not put again each frame, so a move once made stays), are as they were */
    const navEase = new Map();
    function navLimbEase(list, want) {
      const T = navFrame.t, F = navFrame.f;
      for (const it of list) {
        if (!it.may || it.walking) continue;
        const w = want.get(it) || [0, 0], s = navEase.get(it.P);
        if (!s || s.f !== F || T < s.t || T - s.t > 0.25) { navEase.set(it.P, { x: w[0], z: w[1], t: T, f: F, held: T }); navLimbApply(it.P, w[0], w[1]); continue; }
        const cur = Math.hypot(s.x, s.z), tg = Math.hypot(w[0], w[1]);
        let rate = 0;
        if (tg >= cur - 1e-4) { s.held = T; rate = NAV5.limbOut; } else if (T - s.held >= NAV5.limbHold) rate = NAV5.limbBack;
        const dx = w[0] - s.x, dz = w[1] - s.z, d = Math.hypot(dx, dz), step = Math.min(d, rate * (T - s.t));
        if (d > 1e-6 && step > 0) { s.x += dx / d * step; s.z += dz / d * step; }
        s.t = T;
        navLimbApply(it.P, s.x, s.z);
      }
    }
    function navLimbApply(P, x, z) {
      if (Math.abs(x) < 1e-5 && Math.abs(z) < 1e-5) return;
      const g = P.group.position; g.x += x; g.z += z; NAV5.limbMoved++;
      const cs = navCarry.get(P); if (cs) for (const c of cs) if (c.parent === world) { c.position.x += x; c.position.z += z; }
    }
    /* THE WRAPS (each the original, called as it was) */
    const navPut0 = put;
    put = function (P, x, z, ry, y) {
      if (navFrame.depth && P && !navFrame.put.has(P)) navFrame.put.set(P, { walk: false, pts: null });
      return navPut0(P, x, z, ry, y);
    };
    /* A FILM'S WALK ROUTED ROUND THE SOLIDS: the path itself unchanged where every leg is clear. A route keeps the body's
       half-width and the comfort (rr) off every solid, but within NAV5.near of the route's two ends (E: [start, goal]) only
       the bare half-width (r0): a station by a wall is reached, never moved */
    const navRad = (x, z, rr, r0, E) => (E && r0 < rr && (Math.hypot(x - E[0][0], z - E[0][1]) < NAV5.near || Math.hypot(x - E[1][0], z - E[1][1]) < NAV5.near)) ? r0 : rr;
    function navLegClear(a, b, r, r0, E) { const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.ceil(L / 0.05));
      for (let i = 0; i <= n; i++) { const u = i / n, x = a[0] + (b[0] - a[0]) * u, z = a[1] + (b[1] - a[1]) * u;
        if (!navClear(x, z, discF(navRad(x, z, r, r0 == null ? r : r0, E)), 0, false, null)) return false; } return true; }
    function navAstar(a, b, r, r0) {
      const E = [a, b];
      /* (the grid on the world's own 10 cm lines: a doorway's middle is a cell, wherever the route began) */
      const C = NAV5.cell, pad = 3, x0 = Math.floor((Math.min(a[0], b[0]) - pad) / C) * C, z0 = Math.floor((Math.min(a[1], b[1]) - pad) / C) * C;
      const W = Math.ceil((Math.abs(b[0] - a[0]) + 2 * pad) / C) + 1, H = Math.ceil((Math.abs(b[1] - a[1]) + 2 * pad) / C) + 1;
      const ix = (x) => Math.max(0, Math.min(W - 1, Math.round((x - x0) / C))), iz = (z) => Math.max(0, Math.min(H - 1, Math.round((z - z0) / C)));
      const cx = (i) => x0 + i * C, cz = (j) => z0 + j * C, N = W * H, free = new Int8Array(N).fill(-1);
      const ok = (i, j) => { const k = j * W + i; if (free[k] < 0) free[k] = navClear(cx(i), cz(j), discF(navRad(cx(i), cz(j), r, r0, E)), 0, false, null) ? 1 : 0; return free[k] === 1; };
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
      while (at < cells.length - 1) { let nx = cells.length - 1; while (nx > at + 1 && !navLegClear(cells[at], cells[nx], r, r0, E)) nx--; out.push(cells[nx]); at = nx; }
      return out;
    }
    function navRoute(pts, r) {
      if (!NAV5.on || !pts || pts.length < 2) return pts;
      const M = navMemo().routes, rr = r + NAV5.comfort;
      const key = pts.map(p => Math.round(p[0] * 1000) + ',' + Math.round(p[1] * 1000)).join(';') + '|' + Math.round(r * 100);
      if (M.has(key)) return M.get(key);
      let out = pts;
      if (!pts.every((p, i) => i === 0 || navLegClear(pts[i - 1], p, rr, r, [pts[i - 1], p]))) {
        out = [];
        for (let i = 0; i < pts.length; i++) {
          const p = navStand(pts[i][0], pts[i][1], discF(r), 0, false, null) || pts[i];
          if (i === 0) { out.push(p); continue; }
          const a = out[out.length - 1];
          if (navLegClear(a, p, rr, r, [a, p])) { out.push(p); continue; }
          const via = navAstar(a, p, rr, r) || navAstar(a, p, r, r);
          if (via) { for (let k = 1; k < via.length; k++) out.push(via[k]); } else { out.push(p); NAV5.missed++; }
        }
        NAV5.routed++;
      }
      M.set(key, out);
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
    function navTellWalk(P, moving, tx, tz) { if (!P) return; if (moving) navPlayWalk.set(P, [tx, tz]); else navPlayWalk.delete(P); }
    const navWalkerMove0 = walkerMove;
    walkerMove = function (W0, tx, tz, wdt, pace) {
      const moving = navWalkerMove0(W0, tx, tz, wdt, pace);
      if (W0 && W0.P) navTellWalk(W0.P, moving, tx, tz);
      return moving;
    };
    const navPlayFrame0 = playFrame;
    playFrame = function (wdt, st) {
      navCarry.clear();
      const out = navPlayFrame0(wdt, st);
      navHook();
      if (st === 'play') navSettle('play');
      navPlayWalk.clear();
      return out;
    };
    /* the probe's read (stage.nav5): the solids as boxes, each body's disc, and the counts */
    const NAV5API = {
      get on() { return NAV5.on; }, set on(v) { NAV5.on = !!v; for (const C of [navBoxes.P, navBoxes.F]) { if (C.memo) C.memo.clear(); if (C.routes) C.routes.clear(); } },
      boxes: () => navBoxes().map(b => b.slice()), r: FOOT5.def.a, rOf: Object.fromEntries(Object.keys(FOOT5).filter(k => k !== 'def').map(k => [k, FOOT5[k].a])),
      foot: (key) => Object.assign({}, FOOT5[key] || FOOT5.def), feet: () => JSON.parse(JSON.stringify(FOOT5)), comfort: NAV5.comfort, floor: NAV_FLOOR.source,
      open: () => [...NAV5.open].map(q => solids.indexOf(q)).filter(i => i >= 0),       // (the solids the last film picture had open)
      shutBoxes: () => [...NAV5.shut].map(q => { const b = navBoxOf(q); return [b[0], b[1], 2.2, b[2], b[3], 'shut:' + solids.indexOf(q)]; }),   // (and those it had standing)
      counts: () => ({ moved: NAV5.moved, routed: NAV5.routed, missed: NAV5.missed, passes: NAV5.passes, deepIn: NAV5.deepIn, limbMoved: NAV5.limbMoved }),
      /* (each solid's OWN box where it stands on: [x0, x1, top, z0, z1, index]; the blockers are all at least 1.4 m tall, for
         his eye: the coffee table is 0.36) */
      solidsReal: () => solids.map((q, i) => { const b = S && S.blockers && S.blockers[i]; if (!b || b.isEmpty()) return null;
        q.updateWorldMatrix(true, false); const B = new THREE.Box3().setFromObject(q); return [B.min.x, B.max.x, B.max.y, B.min.z, B.max.z, i]; }).filter(Boolean),
      clear: (x, z, r) => navClear(x, z, discF(r || FOOT5.def.a), 0, false, null), stand: (x, z, r) => navStand(x, z, discF(r || FOOT5.def.a), 0, false, null)
    };
