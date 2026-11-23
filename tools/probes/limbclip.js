/* v28.0 (E4C5, R76: Chad, 23 Nov 2026: "Especially there are still so many clipping bugs, body collision issues, characters
   still walking into walls, arms of characters clipping through each other, etc. why isn't there some kind of universal fix
   to this?"). THE LIMBS' OWN CHECK, run in the page on whatever picture stands there (a film sought to a moment, or play).
   The walkable map keeps bodies apart by their measured reach over the floor; this measures what is DRAWN: each standing
   body of the chapter's floor cast as sixteen capsules along its own bones (the torso hips to neck, the head, both upper
   arms, forearms and hands, both thighs, shins and feet), each capsule's radius a body's own (a torso 0.13 m, Mr Koh's 0.17,
   Grandmaster Pho's 0.15 under his robe; an upper arm 0.05, a forearm and a hand 0.04, a thigh 0.075, a shin 0.05, a foot
   0.045, the head 0.1), and reads
     w  a limb in a SOLID: each capsule against every solid of the place (the blockers taken back by the 0.14 m they were
        grown for his eye, from the floor to their top), sampled every 3 cm along it: how far its surface is inside;
        a body whose hips are under 0.65 m (seated, kneeling) is left out of this one (a sitter's legs are under his table);
        a solid the film has open in this picture (stage.nav5.open: the lift's doors in the opening) is no solid;
     b  two bodies IN EACH OTHER: every capsule of one against every capsule of the other: how far their surfaces overlap.
   Installed by evaluating this file's text in the page; `window.__limbs()` answers the picture's findings, each
   [kind, who, limb, other (a body's label, or the solid's index), its limb, depth in metres], deeper than TOL (0.02 m).
   Read in tools/probes/e4c5films.mjs (LIMBS=1: every row carries its findings, K) and by tools/probes/limbread.py. */
(() => {
  const E = window.__enc, S = E.stage, V3 = E.camera.position.constructor, Q4 = E.camera.quaternion.constructor;
  const FLOOR = /^(p5pho|e4ton|p5jun|p5koh|p5zavier|p5collector)$/, TOL = 0.02, GROW = 0.14;
  const TORSO = { p5koh: 0.17, p5pho: 0.15 };
  const seen = (o) => { for (let q = o; q; q = q.parent) if (!q.visible) return false; return true; };
  const boneOf = (Q, nm) => { Q.__lb = Q.__lb || {}; if (nm in Q.__lb) return Q.__lb[nm];
    const re = new RegExp('^(mixamorig:?)?' + nm + '$'); let f = null; for (const k in (Q.bone || {})) if (re.test(k)) { f = Q.bone[k]; break; }
    Q.__lb[nm] = f; return f; };
  /* [name, from bone, to bone (or null: along the bone's own +Y, len), len, radius] */
  const LIMB = [['torso', 'Hips', 'Neck', 0, 0.13], ['head', 'Head', null, 0.2, 0.1]];
  for (const s of ['Left', 'Right']) {
    const k = s[0];
    LIMB.push(['uarm' + k, s + 'Arm', s + 'ForeArm', 0, 0.05], ['farm' + k, s + 'ForeArm', s + 'Hand', 0, 0.04], ['hand' + k, s + 'Hand', null, 0.12, 0.04],
              ['thigh' + k, s + 'UpLeg', s + 'Leg', 0, 0.075], ['shin' + k, s + 'Leg', s + 'Foot', 0, 0.05], ['foot' + k, s + 'Foot', s + 'ToeBase', 0, 0.045]);
  }
  const a = new V3(), b = new V3(), q = new Q4(), up = new V3();
  /* each shown floor body's capsules in the world: [{ who, key, low, caps: [[name, ax, ay, az, bx, by, bz, r]] }] */
  function bodies() {
    const F = S.films || {}, P = F.people ? F.people() : [], out = [];
    P.forEach((Q, i) => {
      if (!Q || !Q.ready || !Q.key || !FLOOR.test(Q.key) || !Q.group || !seen(Q.group) || Q.hidden) return;
      Q.group.updateWorldMatrix(true, true);
      const caps = [];
      for (const [nm, b0, b1, len, r0] of LIMB) {
        const A = boneOf(Q, b0); if (!A) continue;
        A.getWorldPosition(a);
        if (b1) { const B = boneOf(Q, b1); if (!B) continue; B.getWorldPosition(b); }
        else { A.getWorldQuaternion(q); up.set(0, 1, 0).applyQuaternion(q); b.copy(a).addScaledVector(up, len); }
        const r = nm === 'torso' ? (TORSO[Q.key] || r0) : r0;
        caps.push([nm, a.x, a.y, a.z, b.x, b.y, b.z, r]);
      }
      /* (seated or kneeling: the hips under 0.65 m, or the thighs lying level (the hips less than 0.25 m over the knees): a
         body on a seat is in its seat's column by design) */
      const h = boneOf(Q, 'Hips'), kl = boneOf(Q, 'LeftLeg'), kr = boneOf(Q, 'RightLeg'); let low = false;
      if (h) { h.getWorldPosition(a); low = a.y < 0.65;
        if (!low && kl && kr) { kl.getWorldPosition(b); const y1 = b.y; kr.getWorldPosition(b); low = a.y - (y1 + b.y) / 2 < 0.25; } }
      out.push({ who: Q.key + '#' + i, key: Q.key, low, caps });
    });
    return out;
  }
  /* the closest distance between two segments (p1-q1, p2-q2) */
  function segSeg(c1, c2) {
    const d1x = c1[4] - c1[1], d1y = c1[5] - c1[2], d1z = c1[6] - c1[3], d2x = c2[4] - c2[1], d2y = c2[5] - c2[2], d2z = c2[6] - c2[3];
    const rx = c1[1] - c2[1], ry = c1[2] - c2[2], rz = c1[3] - c2[3];
    const A = d1x * d1x + d1y * d1y + d1z * d1z, Bq = d2x * d2x + d2y * d2y + d2z * d2z, C = d1x * rx + d1y * ry + d1z * rz, F = d2x * rx + d2y * ry + d2z * rz;
    let s = 0, t = 0;
    if (A < 1e-9 && Bq < 1e-9) { s = 0; t = 0; }
    else if (A < 1e-9) { s = 0; t = Math.max(0, Math.min(1, F / Bq)); }
    else if (Bq < 1e-9) { t = 0; s = Math.max(0, Math.min(1, -C / A)); }
    else { const Bd = d1x * d2x + d1y * d2y + d1z * d2z, den = A * Bq - Bd * Bd;
      s = den > 1e-12 ? Math.max(0, Math.min(1, (Bd * F - C * Bq) / den)) : 0;
      t = (Bd * s + F) / Bq;
      if (t < 0) { t = 0; s = Math.max(0, Math.min(1, -C / A)); } else if (t > 1) { t = 1; s = Math.max(0, Math.min(1, (Bd - C) / A)); } }
    const px = c1[1] + d1x * s - (c2[1] + d2x * t), py = c1[2] + d1y * s - (c2[2] + d2y * t), pz = c1[3] + d1z * s - (c2[3] + d2z * t);
    return Math.sqrt(px * px + py * py + pz * pz);
  }
  /* the solids as they stand in this picture, [x0, x1, y1, z0, z1, index] (a solid the film has open left out) */
  function solids() {
    const B = S.blockers || [], open = new Set(S.nav5 && S.nav5.open ? S.nav5.open() : []), out = [];
    /* (each solid's own box where the build gives it, its own height: the blockers are all at least 1.4 m tall, for his eye,
       and a hand over the 0.36 m coffee table read as in it; else the blockers taken back) */
    if (S.nav5 && S.nav5.solidsReal) { for (const r of S.nav5.solidsReal()) if (!open.has(r[5])) out.push(r); }
    else B.forEach((bb, i) => { if (bb.isEmpty() || open.has(i)) return;
      out.push([bb.min.x + GROW, bb.max.x - GROW, bb.max.y - GROW, bb.min.z + GROW, bb.max.z - GROW, i]); });
    /* (and the solids the film has standing that play's map has empty: the gate's leaf swung open) */
    if (S.nav5 && S.nav5.shutBoxes) for (const b of S.nav5.shutBoxes()) out.push(b);
    return out;
  }
  /* how far a capsule's surface reaches into a solid (<= 0: clear), sampled every 3 cm along it */
  function capInBox(c, s) {
    const L = Math.hypot(c[4] - c[1], c[5] - c[2], c[6] - c[3]), n = Math.max(1, Math.ceil(L / 0.03)); let best = -1;
    for (let i = 0; i <= n; i++) { const u = i / n, x = c[1] + (c[4] - c[1]) * u, y = c[2] + (c[5] - c[2]) * u, z = c[3] + (c[6] - c[3]) * u;
      const dx = Math.max(s[0] - x, 0, x - s[1]), dy = Math.max(0 - y, 0, y - s[2]), dz = Math.max(s[3] - z, 0, z - s[4]);
      let d = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (d === 0) d = -Math.min(x - s[0], s[1] - x, y, s[2] - y, z - s[3], s[4] - z);
      const pen = c[7] - d; if (pen > best) best = pen; }
    return best;
  }
  window.__limbs = () => {
    const Bs = bodies(), Ss = solids(), out = [];
    for (const B of Bs) if (!B.low) for (const c of B.caps) {
      let bx0 = Math.min(c[1], c[4]) - c[7], bx1 = Math.max(c[1], c[4]) + c[7], bz0 = Math.min(c[3], c[6]) - c[7], bz1 = Math.max(c[3], c[6]) + c[7];
      for (const s of Ss) { if (bx1 < s[0] || bx0 > s[1] || bz1 < s[3] || bz0 > s[4]) continue;
        const pen = capInBox(c, s); if (pen > TOL) out.push(['w', B.who, c[0], s[5], '', +pen.toFixed(3)]); } }
    for (let i = 0; i < Bs.length; i++) for (let j = i + 1; j < Bs.length; j++) {
      let worst = null;
      for (const c1 of Bs[i].caps) for (const c2 of Bs[j].caps) { const pen = c1[7] + c2[7] - segSeg(c1, c2);
        if (pen > TOL && (!worst || pen > worst[5])) worst = ['b', Bs[i].who, c1[0], Bs[j].who, c2[0], +pen.toFixed(3)]; }
      if (worst) out.push(worst);
    }
    return out;
  };
  window.__limbBodies = () => bodies().map(B => ({ who: B.who, low: B.low, n: B.caps.length }));
})();
