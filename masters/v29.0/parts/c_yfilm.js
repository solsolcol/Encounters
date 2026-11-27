    /* ================================================================ THE FILMS' PICTURES (masters/v29.0/parts/c_yfilm.js:
       FILMS-1's, M7: the opening, the keepsake, the cord and home; FILMS-2's c_yfilm2.js has the barrier, the endings and the
       dawn, and builds on what is here). masters/v29.0/FILMS.md is the record: every shot, every number and why.
       THE CLOCKS are z_tail.js's (built by tl() from SECS, so a measured take moves everything after it: v5.15); here is what
       each frame of each film shows, a PURE FUNCTION of the film's clock (v6.4): people POSED at the moment the clock asks
       for, every place, light and effect a function of it, so a seek, a skip and a slow phone land on one picture.
       THE CAMERA'S GRAMMAR (the plan's 4.4): every shot is HIS EYES (the lens stands where he stands, turns and narrows, and
       never moves through the people); a film cuts away from his eyes only to an insert of a thing, or to a person who is
       looking at him (v21.30); the opening's crane down the street, before he steps out of the taxi, is the one exception.
       Evening: still and patient (slow pushes, held frames, eye level). Night: tight (handheld drift, a smooth function of the
       clock, never noise). A shot is a track of keys: each key's eye, its aim and its lens for a phone (fp) and a desk (fd),
       eased between keys (a smooth function of the clock: v25.5); a key marked `cut` is jumped to; a key may name what it
       must HOLD on this screen and the eye comes back along its line of sight for it (chapter 5's solve, R25), never
       through a solid. Each film ENDS where play keeps things (v5.25): its last picture is the view the phase it hands to
       begins in, the people at that phase's stations (c_cast.js worldPhase). */
    const F1 = { s: null, lit: '', vis: false, shot: '', beds: null, film: '', once: new Set(), hands: false, press: false };
    const PLAYFOV1 = 72;
    /* his look D's face and hands unlit at the level the light asks (chapter 5's R33 measure: night 0.55, the evening 0.7,
       dusk 0.8, day 1), wherever a film sets the light; the play's own light is PLAY's (said in FILMS.md) */
    const PHO_LEVEL1 = { BLUE: 0.8, LAMP: 0.7, HOME: 0.55, NIGHT: 0.55, DAWN: 1 };
    function f1PhoLevel(name) { if (typeof phoLook === 'object' && phoLook && phoLook.level) phoLook.level.value = PHO_LEVEL1[name] != null ? PHO_LEVEL1[name] : 1; }
    function f1Look(name, secs = 0) { if (F1.lit !== name) { F1.lit = name; f1PhoLevel(name); if (kit && kit.daylight) kit.daylight(PRESETS[name] || LAMP, secs); } }
    function f1Lens(f) { if (Math.abs(camera.fov - f) > 1e-3) { camera.fov = f; camera.updateProjectionMatrix(); } }
    /* the rig at an eye, aimed at a point (yaw turns, pitch tilts: a turn of 0 looks toward -z) */
    function f1Aim(p, q, roll = 0) {
      yaw.position.set(p[0], p[1], p[2]);
      const dx = q[0] - p[0], dy = q[1] - p[1], dz = q[2] - p[2];
      yaw.rotation.y = Math.atan2(-dx, -dz); pitch.rotation.x = Math.atan2(dy, Math.hypot(dx, dz)); camera.rotation.z = roll;
    }
    /* (the levels of the people and the things for THIS frame's lens, never the last one's: v24.22) */
    function f1Levels() { camera.updateMatrixWorld(true); lodTick(); peopleLevels(); }
    const f1v = (o) => (typeof o === 'function' ? o() : o);
    /* A SHOT SOLVED FOR THE SCREEN IT IS DRAWN ON (chapter 5's fmHold, R25; CLAUDE.md v21.8): a key's `hold` lists places
       [x, y, z, r] that must stand inside 0.86 of the half-width and 0.88 of the half-height of THIS screen; the eye is drawn
       back along its own line of sight until they do (at most `back`, 0.6 m unless said: these are his eyes, a lean, never a
       walk), never through a solid (it stops 0.3 m short and the lens widens for the rest, to `fmax`) */
    const _f1E = new THREE.Vector3(), _f1R = new THREE.Ray(), _f1H = new THREE.Vector3();
    let f1Solids = null;
    function f1PullOf(K) {
      const H = K && K.hold ? f1v(K.hold) : null; if (!H || !H.length) return 0;
      camera.updateMatrixWorld(true); camera.getWorldPosition(_f1E);
      const e = camera.matrixWorld.elements, th = Math.tan(camera.fov * Math.PI / 360), tw = th * camera.aspect;
      let d = 0;
      for (const h of H) { if (!h) continue; const dx = h[0] - _f1E.x, dy = h[1] - _f1E.y, dz = h[2] - _f1E.z, r = h[3] || 0;
        const z = -(dx * e[8] + dy * e[9] + dz * e[10]); if (z <= 0.05) continue;
        const x = dx * e[0] + dy * e[1] + dz * e[2], y = dx * e[4] + dy * e[5] + dz * e[6];
        d = Math.max(d, (Math.abs(x) + r) / (tw * 0.86) - z, (Math.abs(y) + r) / (th * (h[4] || K.band || 0.88)) - z); }
      return Math.min(K.back != null ? K.back : 0.6, Math.max(0, d));
    }
    function f1NeedTh(K) {
      const th0 = Math.tan(camera.fov * Math.PI / 360), H = K && K.hold ? f1v(K.hold) : null; if (!H || !H.length) return th0;
      camera.getWorldPosition(_f1E); const e = camera.matrixWorld.elements; let th = th0;
      for (const h of H) { if (!h) continue; const dx = h[0] - _f1E.x, dy = h[1] - _f1E.y, dz = h[2] - _f1E.z, r = h[3] || 0;
        const z = -(dx * e[8] + dy * e[9] + dz * e[10]); if (z <= 0.05) continue;
        const x = dx * e[0] + dy * e[1] + dz * e[2], y = dx * e[4] + dy * e[5] + dz * e[6];
        th = Math.max(th, (Math.abs(x) + r) / (z * 0.86 * camera.aspect), (Math.abs(y) + r) / (z * (h[4] || K.band || 0.88))); }
      return th;
    }
    /* EACH KEY'S HOLD IS SOLVED AT THE KEY'S OWN POSE (its eye, its aim, its lens, on this screen), and a move between two
       keys eases from the one solved eye to the other: a pull re-solved from wherever a move has got to went there and back
       (the crane on a phone, 27 Nov: its eye 9.09 -> 9.31 -> 9.05 m along the street as the pull grew faster than the move,
       and on a desk 7.07 -> 7.82 -> 6.61 m across it), so the keys' own answers are what is eased (v25.5: a fit is a smooth
       function of the clock). Answers the world offset of the eye and the lens the key is drawn with */
    const _f1Sv = { p: new THREE.Vector3(), ry: 0, rx: 0, rz: 0, f: 0 };
    /* A KEY'S OWN AIM AND HOLD FOR A PHONE (`atP`, `holdP`; 27 Nov, photographed: on a phone, a third of a desk's width, the
       keepsake's first shot could hold his teacher's face or his open hand, never both, and held neither): a key that names
       them is aimed and held by them on a narrow screen, and by `at` and `hold` on a wide one */
    const f1Shape = (K, nar) => (K && nar && (K.atP || K.holdP) ? Object.assign({}, K, { at: K.atP || K.at, hold: K.holdP || K.hold }) : K);
    function f1Solve(K0, nar) {
      const K = f1Shape(K0, nar), f0 = nar ? K.fp : K.fd, out = { x: 0, y: 0, z: 0, f: f0 };
      if (!K.hold) return out;
      _f1Sv.p.copy(yaw.position); _f1Sv.ry = yaw.rotation.y; _f1Sv.rx = pitch.rotation.x; _f1Sv.rz = camera.rotation.z; _f1Sv.f = camera.fov;
      f1Lens(f0);
      if (K.yaw != null || !K.at) { const p = f1v(K.eye), [yw, pt] = f1KeyYP(K); yaw.position.set(p[0], p[1], p[2]); yaw.rotation.y = yw; pitch.rotation.x = pt; camera.rotation.z = K.roll || 0; }
      else f1Aim(f1v(K.eye), f1v(K.at), K.roll || 0);
      camera.updateMatrixWorld(true);
      const d = f1PullOf(K);
      if (d > 1e-4) {
        camera.getWorldPosition(_f1E);
        const e = camera.matrixWorld.elements; _f1R.origin.copy(_f1E); _f1R.direction.set(e[8], e[9], e[10]).normalize();
        if (!f1Solids) { f1Solids = []; for (const s of solids) { s.updateWorldMatrix(true, false); f1Solids.push(new THREE.Box3().setFromObject(s)); } }
        let dd = d;
        for (const bb of f1Solids) { if (bb.containsPoint(_f1E)) continue; const hit = _f1R.intersectBox(bb, _f1H); if (hit) dd = Math.min(dd, Math.max(0, _f1E.distanceTo(hit) - 0.3)); }
        out.x = _f1R.direction.x * dd; out.y = _f1R.direction.y * dd; out.z = _f1R.direction.z * dd;
        if (dd < d - 1e-3) { yaw.position.addScaledVector(_f1R.direction, dd); camera.updateMatrixWorld(true);
          const f = Math.min(K.fmax || 76, 2 * Math.atan(f1NeedTh(K)) * 180 / Math.PI); if (f > out.f) out.f = f; }
      }
      yaw.position.copy(_f1Sv.p); yaw.rotation.y = _f1Sv.ry; pitch.rotation.x = _f1Sv.rx; camera.rotation.z = _f1Sv.rz; f1Lens(_f1Sv.f);
      camera.updateMatrixWorld(true);
      return out;
    }
    /* the eased offset of two keys' solved eyes laid on the eye a move has reached, and the lens drawn at least as wide as
       the two keys' solved lenses eased (u the move's own share) */
    function f1Hold(A, B, u, nar) {
      if (!(A && A.hold) && !(B && B.hold)) return;
      const sA = f1Solve(A, nar), sB = B ? f1Solve(B, nar) : sA, w = B ? u : 0;
      yaw.position.x += lp(sA.x, sB.x, w); yaw.position.y += lp(sA.y, sB.y, w); yaw.position.z += lp(sA.z, sB.z, w);
      const f = lp(sA.f, sB.f, w); if (f > camera.fov + 1e-3) f1Lens(f);
      camera.updateMatrixWorld(true);
    }
    function f1KeyYP(K) { if (K.yaw != null) return [K.yaw, K.pitch || 0];
      const p = f1v(K.eye), q = f1v(K.at), dx = q[0] - p[0], dy = q[1] - p[1], dz = q[2] - p[2]; return [Math.atan2(-dx, -dz), Math.atan2(dy, Math.hypot(dx, dz))]; }
    const f1Bad = new Set();
    /* the track: `K` a list of keys { t, name, eye, at (or yaw, pitch), fp, fd, roll, cut, hold, back, fmax, band, flow, stop }.
       Between two keys the eye, the aim, the lens and the roll ease (smoothstep); a run of keys marked `flow` is ONE move,
       passing through each key at a speed taken from the keys either side (chapter 5's R169: a cubic with Catmull-Rom's
       tangents on the clock), resting only at a key marked `stop` and at the run's ends */
    function f1Track(t, K) {
      for (let j = 1; j < K.length; j++) if (K[j].t < K[j - 1].t) { const w = (K[j - 1].name || '') + '@' + K[j - 1].t.toFixed(2) + ' > ' + (K[j].name || '') + '@' + K[j].t.toFixed(2);
        if (!f1Bad.has(w)) { f1Bad.add(w); console.error('e5c1: a film\'s camera keys run backwards in time: ' + w); } }
      let i = 0; while (i < K.length - 1 && t >= K[i + 1].t) i++;
      const nar = isNarrow(), A = f1Shape(K[i], nar), B = f1Shape(K[i + 1], nar);
      if (!B || B.cut) {
        f1Lens(nar ? A.fp : A.fd);
        if (A.yaw != null || !A.at) { const p = f1v(A.eye), [yw, pt] = f1KeyYP(A); yaw.position.set(p[0], p[1], p[2]); yaw.rotation.y = yw; pitch.rotation.x = pt; camera.rotation.z = A.roll || 0; }
        else f1Aim(f1v(A.eye), f1v(A.at), A.roll || 0);
        f1Hold(A, null, 1, nar);
        F1.shot = A.name || ''; return;
      }
      if (A.flow && B.flow && A.at && B.at && A.yaw == null && B.yaw == null) {
        const P0 = !A.cut && K[i - 1] && K[i - 1].flow ? f1Shape(K[i - 1], nar) : null, P3 = K[i + 2] && K[i + 2].flow && !K[i + 2].cut ? f1Shape(K[i + 2], nar) : null;
        const val = (X) => { const e = f1v(X.eye), a = f1v(X.at); return [e[0], e[1], e[2], a[0], a[1], a[2], nar ? X.fp : X.fd, X.roll || 0]; };
        const vA = val(A), vB = val(B), dt = Math.max(1e-3, B.t - A.t), n = vA.length;
        const m0 = new Array(n).fill(0), m1 = new Array(n).fill(0);
        if (P0 && !A.stop) { const v0 = val(P0), d = Math.max(1e-3, B.t - P0.t); for (let j = 0; j < n; j++) m0[j] = (vB[j] - v0[j]) / d; }
        if (P3 && !B.stop) { const v3 = val(P3), d = Math.max(1e-3, P3.t - A.t); for (let j = 0; j < n; j++) m1[j] = (v3[j] - vA[j]) / d; }
        const sx = c01((t - A.t) / dt), s2 = sx * sx, s3 = s2 * sx, h00 = 2 * s3 - 3 * s2 + 1, h10 = s3 - 2 * s2 + sx, h01 = 3 * s2 - 2 * s3, h11 = s3 - s2;
        const v = vA.map((a, j) => h00 * a + h10 * dt * m0[j] + h01 * vB[j] + h11 * dt * m1[j]);
        f1Lens(v[6]); f1Aim([v[0], v[1], v[2]], [v[3], v[4], v[5]], v[7]);
        f1Hold(A, B, smo(sx), nar);
        F1.shot = (A.name || '') + '>' + (B.name || ''); return;
      }
      const x0 = c01((t - A.t) / Math.max(1e-3, B.t - A.t)), u = B.ease === 'in' ? x0 * x0 : B.ease === 'lin' ? x0 : smo(x0);
      f1Lens(lp(nar ? A.fp : A.fd, nar ? B.fp : B.fd, u));
      const pe = lp3(f1v(A.eye), f1v(B.eye), u);
      if (A.yaw != null || B.yaw != null || !A.at || !B.at) { const [ya, pa] = f1KeyYP(A), [yb, pb] = f1KeyYP(B);
        yaw.position.set(pe[0], pe[1], pe[2]); yaw.rotation.y = ya + angTo(ya, yb) * u; pitch.rotation.x = lp(pa, pb, u); camera.rotation.z = lp(A.roll || 0, B.roll || 0, u); }
      else f1Aim(pe, lp3(f1v(A.at), f1v(B.at), u), lp(A.roll || 0, B.roll || 0, u));
      f1Hold(A, B, u, nar);
      F1.shot = (A.name || '') + '>' + (B.name || '');
    }
    /* the view a phase begins in (the snapshot the engine restores at a film's end), as a key */
    const f1SnapKey = (t, name = 'play') => { const s = F1.s; return s && s.yawPos ? { t, name, eye: [s.yawPos.x, s.yawPos.y, s.yawPos.z], yaw: s.yawRot, pitch: s.pitchX, fp: PLAYFOV1, fd: PLAYFOV1 } : null; };
    const f1Run = (t, t0, t1, a, b) => lp(a, b, smo(c01((t - t0) / Math.max(1e-3, t1 - t0))));
    const f1Ping = (t, from, len, secs) => from + len * (0.5 - 0.5 * Math.cos(Math.PI * 2 * t / secs));
    /* a smooth bump: 0 before t0, up to 1 over `a`, held, down to 0 over `b` before t1 */
    const f1Env = (t, t0, t1, a = 0.4, b = 0.4) => smo(c01((t - t0) / Math.max(1e-3, a))) * (1 - smo(c01((t - t1 + b) / Math.max(1e-3, b))));
    /* WHERE A PERSON'S HEAD IS, FOR A SHOT OR A LOOK: where the film stands him (his group) at the height named, never his
       LIVING head (v25.5: a shot whose aim rides a talking head sways with his take) */
    function f1Head(P, fb, h) { if (P && P.ready && P.group.visible) { const g = P.group.position; return [g.x, h != null ? g.y + h : (fb ? fb[1] : 1.55), g.z]; } return fb; }
    const f1Show = (P, on) => { if (!P) return; P.hidden = !on; if (P.ready) P.group.visible = on; };
    const f1Bone = (P, nm) => { if (!P || !P.bone) return null; const re = new RegExp('^(mixamorig:?)?' + nm + '$'); for (const n in P.bone) if (re.test(n)) return P.bone[n]; return null; };
    const _f1S = new THREE.Vector3();
    function f1Palm(P, sd, out) { const hb = f1Bone(P, sd + 'Hand'), kb = f1Bone(P, sd + 'HandMiddle1'); if (!hb) return null; hb.getWorldPosition(out); if (kb) out.lerp(kb.getWorldPosition(_f1S), 0.5); return out; }
    /* THE PALM'S MIDDLE BY THE HAND'S OWN MEASURE (armsOf: the fingers' line and the palm's facing from the bind pose, a
       rig with no finger bones measured from its skin), `up` metres out of the palm: his teacher's seated body has no finger
       bones, and the packet laid at f1Palm sat on his wrist (photographed 27 Nov) */
    const _f1Pq = new THREE.Quaternion(), _f1Pv = new THREE.Vector3();
    function f1PalmOn(P, sd, out, up = 0) {
      const A = typeof armsOf === 'function' ? armsOf(P) : null, a = A && A[sd === 'Left' ? 'L' : 'R'];
      if (!a) return f1Palm(P, sd, out);
      a.hand.updateWorldMatrix(true, false); a.hand.getWorldPosition(out); a.hand.getWorldQuaternion(_f1Pq);
      const sc = a.hand.getWorldScale(_f1Pv).x;
      out.addScaledVector(_f1Pv.copy(a.fL).applyQuaternion(_f1Pq), a.palm * sc).addScaledVector(_f1Pv.copy(a.nL).applyQuaternion(_f1Pq), up);
      return out;
    }
    /* SPIRIT VISION held by a film's clock (the engine's curve, out from his eyes over `secs` from `t0`, full until `t1`, home
       over `back`), held only round the moments it is open */
    const VR1 = 70, visCurve1 = (u) => 0.30 * u + 0.70 * u * u * u;
    function f1Vision(t, t0, secs = 2.2, t1 = Infinity, back = 1.6) {
      if (!kit || !kit.vision) return;
      let r = 0, mv = false;
      if (t >= t0 && t < t0 + secs) { r = VR1 * visCurve1((t - t0) / secs); mv = true; }
      else if (t >= t0 + secs && t < t1) r = VR1;
      else if (t >= t1 && t < t1 + back) { r = VR1 * visCurve1(1 - (t - t1) / back); mv = true; }
      if (r > 0.001 || mv) { kit.vision({ r, moving: mv }); F1.vis = true; }
      else if (F1.vis) { kit.vision(null); F1.vis = false; }
    }
    function f1VisionOff() { if (F1.vis && kit && kit.vision) kit.vision(null); F1.vis = false; }
    /* THE BEDS IN A FILM (PLAY.md 5): the play's loops (her flat's, his flat's, the room's two music beds M2 and M3) are 0 in a
       film unless the film writes how loud each is, every frame, as the play's own levels (flat 0.55, night 0.5, m2 0.3, m3
       0.26 are the play's): `stage.beds.film`. The street's, the stair's and the corridor's beds are these films' own cues */
    const BEDLV1 = { flat: 0.55, night: 0.5, m2: 0.3, m3: 0.26 };
    function f1Beds(o) { F1.beds = o; const B = S && S.beds; if (B) B.film = o ? Object.fromEntries(Object.entries(o).map(([k, v]) => [k, (BEDLV1[k] || 0.5) * v])) : null; }
    /* A WALK ALONG A PATH (pts [[x, z], ...]) from `t0` at `v` metres a second, the walking take's time read from the ground
       covered (P.pace: v26.0), eased out of its rest and into it at the end, turned along the path and at its end to `ryEnd`;
       `rest` [take, moment, rate, loop]. `o.y` a height to stand it at (the five-foot way's GY); answers whether it walks */
    function f1PathLen(pts) { let L = 0; for (let i = 1; i < pts.length; i++) L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); return L; }
    function f1PathAt(pts, s) { for (let i = 1; i < pts.length; i++) { const a = pts[i - 1], b = pts[i], l = Math.hypot(b[0] - a[0], b[1] - a[1]); if (s <= l || i === pts.length - 1) { const u = l > 1e-6 ? Math.min(1, s / l) : 1; return [lp(a[0], b[0], u), lp(a[1], b[1], u), Math.atan2(b[0] - a[0], b[1] - a[1])]; } s -= l; } return [pts[0][0], pts[0][1], 0]; }
    const f1WalkSecs = (pts, v, ease = 0.45) => { const L = f1PathLen(pts), v1 = Math.max(0.1, v); return L / v1 + Math.min(ease, L / v1); };
    function f1Walk(P, t, t0, pts, v, rest, ryEnd, o = {}) {
      if (!P || !P.ready) return false;
      const L = f1PathLen(pts), v1 = Math.max(0.1, v), ease = Math.min(o.ease || 0.45, L / v1), T = L / v1 + ease, tw = t - t0, pace = (P.pace && P.pace.Walking) || 1.29;
      const Y = (x, z) => (typeof o.y === 'function' ? o.y(x, z) : o.y != null ? o.y : flatGround(x, z));
      const restT = () => (rest[1] != null ? rest[1] : 0) + (rest[2] ? t * rest[2] : 0);
      if (tw <= 0) { const a = pts[0]; put(P, a[0], a[1], o.ry0 != null ? o.ry0 : f1PathAt(pts, 0)[2], Y(a[0], a[1])); pose(P, rest[0], restT(), !!rest[3]); return false; }
      if (tw >= T) { const b = pts[pts.length - 1]; const turnK = smo(c01((tw - T) / 0.6)), h = f1PathAt(pts, L)[2];
        put(P, b[0], b[1], ryEnd != null ? h + angTo(h, ryEnd) * turnK : h, Y(b[0], b[1])); pose(P, rest[0], restT(), !!rest[3]); return false; }
      const s = !(ease > 0) ? L * tw / T : tw < ease ? 0.5 * v1 * tw * tw / ease : tw > T - ease ? L - 0.5 * v1 * (T - tw) * (T - tw) / ease : v1 * (tw - 0.5 * ease);
      const sc = Math.max(0, Math.min(L, s)), at = f1PathAt(pts, sc), r0 = o.ry0 != null ? o.ry0 : at[2];
      put(P, at[0], at[1], r0 + angTo(r0, at[2]) * smo(c01(tw / 0.35)), Y(at[0], at[1]));
      const into = smo(c01(tw / 0.35)), outOf = smo(c01((tw - T + 0.35) / 0.35));
      if (outOf <= 0) pose(P, 'Walking', sc / pace, true, rest[0], 1 - into, restT());
      else pose(P, rest[0], restT(), !!rest[3], 'Walking', 1 - outOf, sc / pace);
      return true;
    }
    /* the street's heights under a walk (the ground function reads her floor under the five-foot way: WORLD.md 2): the road
       GY - 0.15 past the kerb, the drain's grating GY - 0.03, the five-foot way GY */
    const streetY1 = (x) => (x > STREET.kerb ? GY - 0.15 : x > STREET.face ? GY - 0.03 : GY);
    const f1Turn = (t, t0, t1, a, b) => a + angTo(a, b) * smo(c01((t - t0) / Math.max(0.05, t1 - t0)));
    /* A PERSON'S TALKING OVER HIS LINES IN A FILM (chapter 5's fmSpeak, R25): `lines` [[t0, secs, take], ...] each from the
       line's own start, eased in over 0.35 s and out over the half second after it, lines closer than a second one talk;
       `rest` [take, moment, rate, loop] his rest between */
    function f1Speak(P, t, rest, lines) {
      if (!P || !P.ready) return;
      const rT = (rest[1] || 0) + (rest[2] ? t * rest[2] : 0), S = [];
      for (const [t0, secs, take0, wmax] of lines.slice().sort((a, b) => a[0] - b[0])) { const tk = take0 || P.talkTake; if (!tk || !P.acts[tk]) continue;
        const last = S[S.length - 1];
        if (last && t0 - last.t1 < 1.0) { last.t1 = Math.max(last.t1, t0 + secs); if (last.seg[last.seg.length - 1].tk !== tk) last.seg.push({ tk, t0 }); }
        else S.push({ t0, t1: t0 + secs, seg: [{ tk, t0 }], wmax: wmax || 1 }); }
      const s = S.find(q => t >= q.t0 && t < q.t1 + 0.45);
      if (!s || !P.acts[rest[0]]) { if (P.acts[rest[0]]) pose(P, rest[0], rT, !!rest[3]); return; }
      const W = (s.wmax || 1) * smo(c01((t - s.t0) / 0.35)) * (1 - smo(c01((t - s.t1 + 0.1) / 0.5)));
      let i = 0; while (i < s.seg.length - 1 && t >= s.seg[i + 1].t0) i++;
      const tt = (g) => { const d = P.acts[g.tk].getClip().duration; return ((t - s.t0) % d + d) % d; };
      const A = s.seg[i];
      if (A.tk === rest[0]) { pose(P, rest[0], rT + 0.6 * (t - s.t0) * W, !!rest[3]); return; }
      pose(P, A.tk, tt(A), true, rest[0], 1 - W, rT);
    }
    /* A LOOK THAT MOVES FROM ONE THING TO THE NEXT (chapter 5's fmGaze): `list` [[t, target, secs], ...] (a point, a function
       of one, or 'lens'), each from its own time, carried from the last over its secs (0.6) */
    const _f1G = new THREE.Vector3();
    function f1Gaze(P, t, list, k = 0.8, reach = 0.75, down = 0.03) {
      if (!P || !P.ready || !list.length) return;
      const at = (q) => { const g = typeof q === 'function' ? q() : q; if (g === 'lens') { camera.getWorldPosition(_f1G); return [_f1G.x, _f1G.y, _f1G.z]; } return g; };
      let i = 0; while (i < list.length - 1 && t >= list[i + 1][0]) i++;
      if (t < list[0][0]) return;
      const A = list[i], B = list[i - 1], u = B ? smo(c01((t - A[0]) / (A[2] || 0.6))) : smo(c01((t - A[0]) / (A[2] || 0.6)));
      const ga = at(A[1]); if (!ga) return;
      if (!B) { lookNow(P, ga, k * u, reach, down); return; }
      const gb = at(B[1]); const tg = u >= 1 || !gb ? ga : lp3(gb, ga, u);
      lookNow(P, tg, k, reach, down);
    }

    /* ---------------------------------------------------------------- A THING IN A HAND (chapter 5's handHold5): its offset
       from the hand bone made once (`grip`: where its middle sits from the palm, in the hand's own frame) and the thing
       carried by the hand bone after, so it goes where the hand goes in every take; or (`hang`) hung upright below the palm,
       turned with the body */
    const _f1A = new THREE.Vector3(), _f1M = new THREE.Matrix4(), _f1Q = new THREE.Quaternion(), _f1One = new THREE.Vector3(1, 1, 1);
    function f1Carry(P, sd, g, o = {}) {
      const hb = f1Bone(P, sd + 'Hand'); if (!hb || !g || !P || !P.ready) return false;
      if (o.hang != null) { if (g.parent !== world) world.attach(g); P.group.updateWorldMatrix(true, true); const pm = f1Palm(P, sd, _f1A); if (!pm) return false;
        g.position.set(pm.x, pm.y - o.hang, pm.z); g.rotation.set(0, P.group.rotation.y + (o.ry || 0), 0); g.visible = true; return true; }
      if (g.parent !== hb) { hb.add(g); }
      /* IN THE PALM (`o.palm`: { along, off } in metres; 27 Nov, photographed: the phones laid by a guessed turn stood out
         across the hand, their faces outward, like a book held by its spine): a flat thing's long side (its own x) along the
         fingers' line, its face (its own y) on the palm's normal, both MEASURED on the body's own hand (armsOf: v25.3), its
         middle `along` past the palm's middle and `off` out of it */
      if (o.palm) { const A = typeof armsOf === 'function' ? armsOf(P) : null, a = A && A[sd === 'Left' ? 'L' : 'R'];
        if (a) { const sc = 1 / Math.max(1e-6, hb.getWorldScale(_f1A).x), c = new THREE.Vector3().crossVectors(a.fL, a.nL).normalize();
          g.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(a.fL, a.nL, c));
          g.position.copy(a.fL).multiplyScalar(a.palm + (o.palm.along || 0) * sc).addScaledVector(a.nL, (o.palm.off != null ? o.palm.off : 0.02) * sc);
          g.scale.setScalar(sc); g.visible = true; return true; } }
      const p = o.pos || [0, 0.06, 0.03], r = o.rot || [0, 0, 0];
      g.position.set(p[0], p[1], p[2]); g.rotation.set(r[0], r[1], r[2]); g.scale.setScalar(1 / Math.max(1e-6, hb.getWorldScale(_f1A).x)); g.visible = true; return true;
    }
    function f1Drop(g, x, y, z, ry = 0) { if (!g) return; if (g.parent !== world) world.attach(g); g.position.set(x, y, z); g.rotation.set(0, ry, 0); g.scale.setScalar(1); }
    /* A LEAN FORWARD of the trunk (`ang` radians, shared by the three spine bones, each turned about the body's own
       left-right line): a seated body reaching across a low table leans into the reach, as a person does; laid after the
       pose, kept off the next (v11.5: taken back before the mixer runs again) */
    function f1LeanBack(P) { const L = P && P.f1lean; if (!L || !L.on) return; for (const r of L.b) r[0].quaternion.copy(r[1]); L.on = false; }
    /* (and a TWIST, `tw` radians about the body's own up, shared by the same three bones: a seated man turning his shoulders
       to someone at his side, negative to his right; 27 Nov: his head alone could not turn to his student kneeling at his
       right, and his lines to him were said in profile) */
    function f1Lean(P, ang, tw = 0) {
      if (!P || !P.ready || !(Math.abs(ang) > 1e-4 || Math.abs(tw) > 1e-4)) return;
      if (!P.f1lean) { const b = ['Spine', 'Spine1', 'Spine2'].map(n => f1Bone(P, n)).filter(Boolean); P.f1lean = { b: b.map(x => [x, new THREE.Quaternion()]), on: false }; }
      const L = P.f1lean; if (!L.b.length || L.on) return;
      P.group.updateWorldMatrix(true, true);
      const ax = new THREE.Vector3(1, 0, 0).applyQuaternion(P.group.getWorldQuaternion(_f1Q)), up = new THREE.Vector3(0, 1, 0).applyQuaternion(_f1Q), per = ang / L.b.length, tper = tw / L.b.length;
      for (const r of L.b) r[1].copy(r[0].quaternion);
      for (const r of L.b) { const bone = r[0], wq = bone.getWorldQuaternion(new THREE.Quaternion());
        wq.premultiply(new THREE.Quaternion().setFromAxisAngle(ax, per)); if (tper) wq.premultiply(new THREE.Quaternion().setFromAxisAngle(up, tper)); const pq = bone.parent.getWorldQuaternion(new THREE.Quaternion());
        bone.quaternion.copy(pq.invert().multiply(wq)); bone.updateWorldMatrix(false, true); }
      L.on = true;
    }

    /* ================================================================ A CLIMB UP THE STAIR (the plan's 9.1, 24 to 34 s: "the
       stair, climbing behind Marcus and Grandmaster Pho"). Nobody in the game has a take that climbs, and a walk slid up the
       treads is not a climb (every foot would go through a riser: feetscan reads it). So a climb is MADE from the body's own
       walk: its upper body and its arms are the walk's, at the walk's own pace of two steps a cycle (one step a tread, the
       cadence a climb has), the body carried up the flight along the treads' nosing line, and EACH FOOT SET ON ITS TREAD by
       the leg's own two bones (the machinery's armTo, a two-bone solve about the knee's own forward): the foot that stands
       flat on the tread its step reached, the other lifted over the nose of the riser in an arc onto the tread two above.
       Each foot keeps the turn the walk gives it (heel down at the strike, the toe off as it leaves), so the walk's own
       roll of the foot is kept. The legs' turns are laid after the mixer and taken back before it runs again (v11.5); a
       body with grafted shins under a robe (Grandmaster Pho's, LegGraftUp/Low) has them carried with its legs by the same
       turn (chapter 5's seatLegsLay). The stair: STAIR (b_world.js), 19 risers of 0.2026 m, treads 0.235 m, the bottom
       riser at x 0.95, going -x to the landing at x -3.28, its middle line z -3.72 */
    const CLIMB1 = { rise: -GY / STAIR.risers, run: 0.235, x1: STAIR.x1, z: -3.72, n: STAIR.risers };
    const treadX = (q) => CLIMB1.x1 - (q - 0.5) * CLIMB1.run;                 // the middle of tread q (1..19) along the flight
    const treadY = (q) => GY + Math.max(0, Math.min(CLIMB1.n, q)) * CLIMB1.rise;  // the top of tread q (0 the bottom, 19 the landing)
    const _cl = { a: new THREE.Vector3(), b: new THREE.Vector3(), q: new THREE.Quaternion(), q2: new THREE.Quaternion(), q3: new THREE.Quaternion() };
    function climbLegs(P) {
      if (P.f1legs !== undefined) return P.f1legs;
      P.f1legs = null;
      const R = {};
      for (const S0 of ['Left', 'Right']) { const up = f1Bone(P, S0 + 'UpLeg'), fore = f1Bone(P, S0 + 'Leg'), foot = f1Bone(P, S0 + 'Foot'); if (!up || !fore || !foot) return null;
        R[S0] = { up, fore, hand: foot, gUp: f1Bone(P, S0 + 'LegGraftUp'), gLow: f1Bone(P, S0 + 'LegGraftLow'), save: null }; }
      /* when in the walk each foot is flattest and lowest: its middle of stance (the walk's own time) */
      const A = P.acts.Walking; if (!A) return null;
      const d = A.getClip().duration, low = { Left: [Infinity, 0], Right: [Infinity, 0] }, keep = {};
      for (const k in P.acts) keep[k] = [P.acts[k].time, P.acts[k].getEffectiveWeight()];
      for (const k in P.acts) P.acts[k].setEffectiveWeight(k === 'Walking' ? 1 : 0);
      for (let i = 0; i < 40; i++) { A.time = d * i / 40; P.mixer.update(0); P.group.updateWorldMatrix(true, true);
        for (const S0 of ['Left', 'Right']) { R[S0].hand.getWorldPosition(_cl.a); P.group.worldToLocal(_cl.a); if (_cl.a.y < low[S0][0]) low[S0] = [_cl.a.y, d * i / 40]; } }
      for (const k in P.acts) { P.acts[k].time = keep[k][0]; P.acts[k].setEffectiveWeight(keep[k][1]); } P.mixer.update(0);
      P.f1legs = { R, d, mid: { Left: low.Left[1], Right: low.Right[1] }, ankle: Math.max(0.04, Math.min(low.Left[0], low.Right[0])), on: false };
      return P.f1legs;
    }
    /* before the body's mixer runs again: the legs as the mixer wrote them */
    function climbBack(P) { const L = P.f1legs; if (!L || !L.on) return; for (const S0 in L.R) { const r = L.R[S0]; if (!r.save) continue;
      r.up.quaternion.copy(r.save[0]); r.fore.quaternion.copy(r.save[1]); r.hand.quaternion.copy(r.save[2]); if (r.gUp) r.gUp.quaternion.copy(r.save[3]); if (r.gLow) r.gLow.quaternion.copy(r.save[4]); } L.on = false; }
    /* the body at climb position `s` (treads climbed, a real number: 0 at the foot of the flight, 19 on the landing), facing
       up the flight (-x). Answers the height its group stands at */
    function climbPose(P, s, o = {}) {
      if (!P || !P.ready) return;
      const L = climbLegs(P); climbBack(P);
      const ry = o.ry != null ? o.ry : -Math.PI / 2, zc = (o.z != null ? o.z : CLIMB1.z);
      /* (the walk's time: one step a tread, two a cycle, so that the foot the step stands on is at its own middle of stance
         halfway through the step; the left foot stands on the odd treads) */
      const d = L ? L.d : 1.03, ph = L ? L.mid.Left - 0.75 * d : 0;
      const ss = Math.max(0, Math.min(CLIMB1.n, s));
      /* (THE CLOSING STEP, s from 19 to 20: the foot behind brought up beside the other on the landing's tread and the body
         over both, so a man who has reached the top stands on it; photographed 27 Nov, Marcus stood 2.6 s at the top in the
         middle of a stride, one foot a tread down and an arm swung back. `o.settle` (0..1) then eases the walk into his rest,
         `o.rest` [take, moment]) */
      const cl = s > CLIMB1.n ? Math.min(1, s - CLIMB1.n) : 0;
      /* (the body over the treads it stands between: its group a third of a tread behind the foot that stands, on the line of
         the nosings, so the hips are never further from either foot than the leg reaches) */
      const xb = s <= 0 ? CLIMB1.x1 + 0.12 : Math.min(CLIMB1.x1 + 0.12, treadX(ss - 0.15 * (1 - cl)));
      const yb = GY + Math.max(0, Math.min(CLIMB1.n, ss - 0.35 * (1 - cl))) * CLIMB1.rise;
      put(P, xb, zc, ry, s <= 0 ? GY : yb);
      const moving = o.moving !== false, wph = ph + Math.min(s, CLIMB1.n + 1) * d / 2;
      if (o.settle > 0.001 && o.rest) pose(P, 'Walking', wph, true, o.rest[0], Math.min(1, o.settle), o.rest[1]); else pose(P, 'Walking', wph, true);
      if (!L || !moving || s <= 0.02) return;
      P.group.updateWorldMatrix(true, true);
      const n = Math.floor(ss), u = ss - n;
      for (const S0 of ['Left', 'Right']) {
        const r = L.R[S0]; r.save = r.save || [new THREE.Quaternion(), new THREE.Quaternion(), new THREE.Quaternion(), new THREE.Quaternion(), new THREE.Quaternion()];
        r.save[0].copy(r.up.quaternion); r.save[1].copy(r.fore.quaternion); r.save[2].copy(r.hand.quaternion); if (r.gUp) r.save[3].copy(r.gUp.quaternion); if (r.gLow) r.save[4].copy(r.gLow.quaternion);
        /* which tread this foot stands on, or which two it swings between */
        const odd = S0 === 'Left', stands = ((n % 2) === 1) === odd;          // stands on tread n through step n -> n+1
        let tq, lift = 0;
        if (stands) tq = n;
        else if (cl > 0) { tq = lp(n - 1, n, smo(cl)); lift = Math.sin(Math.PI * cl) * 0.09; }
        else { const from = n - 1, to = n + 1, w = smo(u); tq = lp(Math.max(0, from), Math.min(CLIMB1.n, to), w); lift = Math.sin(Math.PI * u) * 0.11; }
        const tqc = Math.max(0, Math.min(CLIMB1.n, tq));
        /* (the foot's place across the flight is the walk's own, in the body's frame; along it and up, the tread's) */
        r.hand.getWorldPosition(_cl.a); P.group.worldToLocal(_cl.a); const side = _cl.a.x;
        const tx = tqc <= 0 ? CLIMB1.x1 + 0.08 : treadX(tqc), ty = (stands ? treadY(Math.round(tqc)) : Math.max(treadY(Math.floor(tqc + 1e-6)), lp(treadY(Math.max(0, n - 1)), treadY(Math.min(CLIMB1.n, n + 1)), smo(cl > 0 ? cl : u)))) + L.ankle + lift;
        _cl.b.set(side, 0, 0).applyQuaternion(P.group.quaternion);
        const target = new THREE.Vector3(tx + _cl.b.x, ty, zc + _cl.b.z);
        /* (the foot keeps its own turn in the world as the walk had it) */
        r.hand.getWorldQuaternion(_cl.q);
        const upW0 = r.up.getWorldQuaternion(new THREE.Quaternion()), foW0 = r.fore.getWorldQuaternion(new THREE.Quaternion());
        /* (a grafted shin's own turn in the world, before the leg moves: it is set after to the leg's change of turn laid on
           this, so it follows its leg once, whether it hangs from the leg or beside it) */
        const gUpW0 = r.gUp ? r.gUp.getWorldQuaternion(new THREE.Quaternion()) : null, gLowW0 = r.gLow ? r.gLow.getWorldQuaternion(new THREE.Quaternion()) : null;
        r.fore.getWorldPosition(_cl.a); const pole = _cl.a.clone().add(new THREE.Vector3(-0.6, 0.1, 0));   // the knee forward, up the flight
        armTo(r, target, pole);
        r.hand.parent.getWorldQuaternion(_cl.q2); r.hand.quaternion.copy(_cl.q2.invert().multiply(_cl.q)); r.hand.updateWorldMatrix(false, true);
        if (r.gUp) { const dq = r.up.getWorldQuaternion(new THREE.Quaternion()).multiply(upW0.invert()), w = gUpW0.premultiply(dq); r.gUp.parent.getWorldQuaternion(_cl.q2); r.gUp.quaternion.copy(_cl.q2.invert().multiply(w)); r.gUp.updateWorldMatrix(false, true); }
        if (r.gLow) { const dq = r.fore.getWorldQuaternion(new THREE.Quaternion()).multiply(foW0.invert()), w = gLowW0.premultiply(dq); r.gLow.parent.getWorldQuaternion(_cl.q2); r.gLow.quaternion.copy(_cl.q2.invert().multiply(w)); r.gLow.updateWorldMatrix(false, true); }
      }
      L.on = true;
    }
    /* THE STAIR'S STAGING (27 Nov, photographed: his teacher's back filled the whole phone picture a metre before the lens,
       and on a straight narrow flight every head the same height over its tread stands on the line of the stair, so the man
       further up hides behind the nearer one). So: Marcus a third of the flight ahead and climbing faster, keeping to the
       flight's left side (seen from below: its south wall), his teacher a tread a little over half a second on its right
       (the north wall), and the lens behind them in the middle, waiting a moment at the street door and then climbing at
       his teacher's pace, seven treads and more behind him: both men are in the picture, side by side up the flight */
    const STAIR1 = { mk: { s0: 7.0, z: -3.9 }, pho: { s0: 4.0, cad: 0.6, z: -3.55 }, eye: { s0: -2.5, cad: 0.6, wait: 0.6, z: -3.72 } };
    /* how many treads a climber has climbed at film time t: from `t0` at `cad` seconds a tread, starting with `s0` climbed,
       standing still through [p0, p1] (Marcus stops to look back down; those behind him wait), never past the landing */
    function climbAt(t, t0, cad, s0, p0, p1, top) {
      let tw = Math.max(0, t - t0); if (p1 > p0 && t > p0) tw -= Math.min(t, p1) - Math.max(p0, t0) > 0 ? Math.min(t, p1) - Math.max(p0, t0) : 0;
      return Math.min(top != null ? top : CLIMB1.n, s0 + Math.max(0, tw) / cad);
    }

    /* ================================================================ THE PEOPLE ONLY THE FILMS SHOW
       GRANDMASTER PHO STANDING (`FILMSAPI.phoStand`; FILMS-2 stands him at the dawn with it): episode 4 chapter 5's standing
       body exactly, its every posture law (c_cast.js copies them: PHO_STAND_*), p5pho, his copy with finger bones (declared:
       z_tail.js). His rest is the end of his rise from a seat (both arms down, a slow breath), his talk the library's open
       hands with his head greatly restrained, his walk his own file's. Hidden unless a film shows him; he and the seated
       cast.pho are never both drawn (a swap is made on a cut or in a shot that cannot see it: v24.12) */
    const phoStand = mkPerson('p5pho', 0, 0, 0, { take: 'Sit_to_Stand_Transition_M', hidden: true,
      win: { Sit_to_Stand_Transition_M: [5.85, 0.25, PHO_BREATH] }, skins: false, look: lookD, blobW: 0.9, blobD: 0.8,
      centre: true, talk: 'Talk_with_Hands_Open', headDamp: PHO_STAND_HEAD, pace: true,
      upright: PHO_STAND_UPRIGHT, shoulders: PHO_STAND_SHOULDERS, shWin: PHO_STAND_SHWIN, armRest: PHO_ARM_REST, knees: PHO_KNEES,
      armOut: PHO_ARM_OUT });
    const PHO_REST1 = ['Sit_to_Stand_Transition_M', 5.85, 0, false];
    /* his rest, breathing a little round its moment (a pure function of the clock) */
    const phoRest1 = (t) => ['Sit_to_Stand_Transition_M', f1Ping(t, 5.85, 0.22, PHO_BREATH), 0, false];
    /* THE TAXI'S DRIVER (v24.22: every moving vehicle has its driver): a man at the wheel on the right, as Singapore drives,
       seen only through the windscreen as the taxi draws in (the crane, 13 to 15.5 s). The collector of episode 4 chapter
       5's last case, at night behind tinted glass (declared: z_tail.js), his seated take's quiet window, his hands laid on
       the wheel; carried in the taxi's own group, so he goes where it goes */
    const driver1 = mkPerson('p5collector', 0, 0, 0, { take: 'Sitting_Answering_Questions', hidden: true, centre: true, skins: false,
      win: { Sitting_Answering_Questions: [0.2, 0.6, 9] }, blobW: 0.01, blobD: 0.01, noBlob: true, parent: things.taxi || world });

    /* ---------------------------------------------------------------- THE FILMS' OWN THINGS (each a real model the
       chapter keys: v25.2), stood hidden and shown by the film that needs it: Marcus's phone in his hand on the five-foot
       way, Grace's in hers at the door and on the cloth in the cord, Grandmaster Pho's cloth bag on his shoulder, the bowl
       in HIS hands (drawn in the hands' pass: kit.hold), his keycard. FILMSAPI.props hands them to the play, so nothing is
       made twice (FILMS.md) */
    const nowhere1 = new THREE.Group(); nowhere1.name = 'the films\' things not drawn';
    const PROPS1 = {
      mkPhone: stand('w51phone', 0, -50, 0, 0, { parent: world }),
      grPhone: stand('w51phone', 0, -50, 0, 0, { parent: world }),
      phoBag: stand('w51phobag', 0, -50, 0, 0, { parent: world }),
      keycard: stand('w51keycard', 0, -50, 0, 0, { parent: world }),
      /* the small corked bottle: on the cloth as his teacher fills and corks it (the cord), then in his hands (the hands'
         pass); the one on his altar is the world's (things.bottle) */
      clothBottle: stand('w51bottle', 0, -50, 0, 0, { parent: world, done: (m) => glassOff1(m) }),
      handBottle: stand('w51bottle', 0, 0, 0, 0, { parent: nowhere1, near: true, done: (m) => { glassOff1(m); handsPass1(m); } }),
      /* (its paint is the play's: the metal brass and the water poured, laid by stage.plan.bowlLook once it has landed, so the
         film's last picture and the event's first are one bowl: PLAY.md 2) */
      handBowl: stand('w4bigbowl', 0, 0, 0, 0, { parent: nowhere1, lift: 3, near: true, done: (m) => handsPass1(m) })
    };
    for (const k of ['mkPhone', 'grPhone', 'phoBag', 'keycard', 'clothBottle']) PROPS1[k].visible = false;
    /* (a thing drawn in the hands' pass is never culled by bounds that mean nothing there: the play's own held bowl is
       drawn so, c_play.js holdBowl) */
    function handsPass1(m) { m.traverse(q => { if (q.isMesh) q.frustumCulled = false; }); }
    /* (THINGS-2: a material named glass is drawn without writing depth, so what stands behind it is drawn) */
    function glassOff1(m) { m.traverse(q => { if (!q.isMesh) return; for (const mt of [].concat(q.material)) if (mt && /glass/i.test(mt.name || '')) { mt.depthWrite = false; mt.transparent = true; } }); }
    /* THE WATER IN HIS HANDS (27 Nov, PLAY.md 2): the bowl's own water and petals, painted by the play's bowlLook (poured),
       its candle's glint the play's own (a soft warm dot lying on the water, its size and place), and the film's own ring
       that spreads across it for each drop of wax and for the cord's snap. Only if the play's look is not there does the
       film paint the brass flat and lay a water disc of its own */
    const ringTex1 = (() => { const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d');
      const g = x.createRadialGradient(64, 64, 40, 64, 64, 62); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(0.55, 'rgba(255,255,255,0.85)'); g.addColorStop(1, 'rgba(255,255,255,0)');
      x.fillStyle = g; x.fillRect(0, 0, 128, 128); return tex(done(THREE, c, false)); })();
    const dotTex1 = (() => { const c = document.createElement('canvas'); c.width = c.height = 64; const x = c.getContext('2d'), gr = x.createRadialGradient(32, 32, 0, 32, 32, 32);
      gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.35, 'rgba(255,255,255,0.45)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
      x.fillStyle = gr; x.fillRect(0, 0, 64, 64); return tex(done(THREE, c, false)); })();
    const waterMat1 = new THREE.MeshBasicMaterial({ color: 0x1c2630, transparent: true, opacity: 0.72, depthWrite: false }); mats.push(waterMat1);
    const water1 = new THREE.Mesh(new THREE.CircleGeometry(1, 40), waterMat1); water1.rotation.x = -Math.PI / 2; owned.push(water1.geometry);
    const ringMat1 = new THREE.MeshBasicMaterial({ map: ringTex1, color: 0xfff0d8, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }); mats.push(ringMat1);
    const ring1 = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), ringMat1); ring1.rotation.x = -Math.PI / 2; owned.push(ring1.geometry);
    const glintMat1 = new THREE.MeshBasicMaterial({ map: dotTex1, color: 0xffd49a, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }); mats.push(glintMat1);
    const glint1 = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), glintMat1); glint1.rotation.x = -Math.PI / 2; glint1.renderOrder = 3; owned.push(glint1.geometry);
    whenThing1(PROPS1.handBowl, (g, m) => {
      g.updateWorldMatrix(true, true);
      const F = S && S.plan && S.plan.bowlLook ? S.plan.bowlLook(m, { empty: { value: 0 } }) : null;
      let c, r;
      if (F && F.world) { c = g.worldToLocal(F.world.c.clone()); r = g.worldToLocal(F.world.c.clone().setX(F.world.c.x + F.world.r)).distanceTo(c); }
      else { m.traverse(q => { if (!q.isMesh) return; for (const mt of [].concat(q.material)) if (mt && mt.color) mt.color.multiply(new THREE.Color(0xffd9a0)); });
        const bb = new THREE.Box3().setFromObject(m), w = Math.max(0.05, Math.min(bb.max.x - bb.min.x, bb.max.z - bb.min.z)), sc = g.getWorldScale(new THREE.Vector3()).x || 1;
        r = w * 0.4 / sc; c = g.worldToLocal(new THREE.Vector3((bb.min.x + bb.max.x) / 2, bb.min.y + (bb.max.y - bb.min.y) * 0.62, (bb.min.z + bb.max.z) / 2));
        water1.scale.setScalar(r); water1.position.copy(c); g.add(water1); }
      ring1.position.copy(c); ring1.position.y += 0.002;
      glint1.position.set(c.x - r * 0.25, c.y + 0.002, c.z + r * 0.2); glint1.scale.setScalar(r * 0.56);
      PROPS1.bowlR = r; g.add(ring1); g.add(glint1); });
    /* (a thing stood by stand(): its model once it has landed) */
    function whenThing1(g, fn) { if (!g) return; if (g.userData.model) { fn(g, g.userData.model); return; } const iv = setInterval(() => { if (!alive) { clearInterval(iv); return; } if (g.userData.model) { clearInterval(iv); fn(g, g.userData.model); } }, 250); }

    /* THE RED (the plan's 4.5 and 12): the spell's one colour. The cord's wisp: a ribbon of red light leaping from the knot
       across the table to his wrist under the bowl (a strip of sprites along a curve, its head and its fading tail a
       function of the film's clock), and the faint ring it leaves round the wrist; drawn over what stands at its depth (a
       sprite among bodies: v25.5 `depthTest` off) */
    const wispMat1 = new THREE.SpriteMaterial({ map: glowTex, color: 0xff2a24, transparent: true, opacity: 0, depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending }); mats.push(wispMat1);
    const wisp1 = []; const wispG1 = new THREE.Group(); wispG1.name = 'the cord\'s wisp'; wispG1.visible = false; world.add(wispG1);
    for (let i = 0; i < 26; i++) { const sp = new THREE.Sprite(wispMat1.clone()); mats.push(sp.material); sp.renderOrder = 9; wispG1.add(sp); wisp1.push(sp); }
    const wristMat1 = new THREE.MeshBasicMaterial({ map: ringTex1, color: 0xff3a30, transparent: true, opacity: 0, depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending }); mats.push(wristMat1);
    const wristRing1 = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), wristMat1); wristRing1.renderOrder = 10; owned.push(wristRing1.geometry);
    /* THE KNOT'S GLOW (the room's red, in Spirit Vision): the play's; the films lay a dull red glow on the packet's knot
       while it is the subject */
    const knotGlow1 = glow(0, -50, 0, 0.12, 0xff3020, 0, world, null);
    /* THE AIR-CONDITIONER'S SMALL BLUE LIGHT over his bed (the plan's 9.4: "the air-conditioner's blue light") */
    const acLed1 = glow(HIS.aircon.x - 0.18, HIS.aircon.y - 0.1, HIS.aircon.z + 0.32, 0.035, 0x58a8ff, 0, hisG, null);
    /* THE TAXI'S LIGHTS (painted: v9.4): its headlamps and the kerbside indicator, carried with it */
    const taxiLamps1 = { L: glow(0, -50, 0, 0.5, 0xfff0d0, 0, world, null), R: glow(0, -50, 0, 0.5, 0xfff0d0, 0, world, null), ind: glow(0, -50, 0, 0.28, 0xffa020, 0, world, null), box: null };
    /* THE BEDSIDE CLOCK'S FACE (the plan's 9.4: 11:58, then 3:00): its digits a picture laid on the clock's own face, the
       time a function of the film's clock */
    const clockC1 = document.createElement('canvas'); clockC1.width = 128; clockC1.height = 64; const clockX1 = clockC1.getContext('2d');
    const clockTex1 = tex(done(THREE, clockC1, false));
    const clockMat1 = new THREE.MeshBasicMaterial({ map: clockTex1, transparent: true, opacity: 0, depthWrite: false }); mats.push(clockMat1);
    const clockFace1 = new THREE.Mesh(new THREE.PlaneGeometry(0.075, 0.0375), clockMat1); owned.push(clockFace1.geometry); clockFace1.renderOrder = 3; hisG.add(clockFace1);
    let clockShown1 = '';
    function clockSet1(text) { if (text === clockShown1) return; clockShown1 = text; clockX1.clearRect(0, 0, 128, 64); clockX1.fillStyle = 'rgba(0,0,0,0)'; clockX1.fillRect(0, 0, 128, 64);
      clockX1.fillStyle = '#7cf0b8'; clockX1.font = 'bold 40px monospace'; clockX1.textAlign = 'center'; clockX1.textBaseline = 'middle'; clockX1.fillText(text, 64, 34); clockTex1.needsUpdate = true; }
    clockSet1('11:52');
    whenThing1(things.bedClock, (g, m) => { const bb = new THREE.Box3().setFromObject(m), c = bb.getCenter(new THREE.Vector3());
      /* (its face looks toward the bed: the clock is turned to it, HIS.clock.ry; laid 4 mm proud of the face's middle) */
      const f = new THREE.Vector3(0, 0, 1).applyAxisAngle(new THREE.Vector3(0, 1, 0), HIS.clock.ry);
      const d = Math.max(0.005, Math.abs((bb.max.x - bb.min.x) * f.x) / 2 + Math.abs((bb.max.z - bb.min.z) * f.z) / 2);
      clockFace1.position.set(c.x + f.x * (d + 0.004), c.y + 0.004, c.z + f.z * (d + 0.004)); clockFace1.rotation.set(0, HIS.clock.ry, 0);
      clockFace1.scale.setScalar(Math.max(0.6, Math.min(2.2, (bb.max.y - bb.min.y) / 0.06))); });

    /* ================================================================ THE FILMS */
    const FILMS1 = {};
    const HERDOOR1 = { x: FRONT.x0, z: HER.door.z };
    /* (her head's height seated on her sofa, her group standing on the floor: seatDown lays her body on the cushion, so a
       look or a lens at her face is 1.02 m up, never her group's height plus a guess; the first build looked at 0.65 to
       0.72 m, her chest) */
    const GRACE_HEAD_SEATED = 1.02;
    const GRACE_FACE_STAIRS = () => { const P = cast.grace; if (!P) return -Math.PI / 2; const g = P.group.position; return Math.atan2(-2.75 - g.x, -2.375 - g.z); };
    /* where a film leaves everyone: the phase's stations (c_cast.js worldPhase), the reflection as the play has it */
    function f1Stations(p) { if (typeof worldPhase === 'function') worldPhase(p, false); }

    /* ================================================================ THE OPENING · "Blue hour" (the plan's 9.1; its clock
       OP51, z_tail.js). Black, the street; the CRANE down the shophouse row (the one shot that is not his eyes: it watches
       Marcus wait for them), her lit windows behind half-open shutters, the fan's shadow on her ceiling, down to the five-foot
       way where Marcus waits by the stair door, his phone in his hand, and a taxi draws in. HIS EYES out of the taxi: his
       teacher ahead in white, the cloth bag on his shoulder; Marcus comes to meet them, looks up at her windows; the stair,
       climbing behind the two, the tube flickering twice, Marcus looking back down at the street door; the landing, her
       door, Grace with her phone, her eyes going past them down the stairs; inside, his teacher at the low table spreading
       his white cloth, he kneels by her windows, and in the black glass her reflection faces the stairs; black, the card */
    /* THE FIVE-FOOT WAY (27 Nov, measured): his teacher a step ahead at his LEFT, a metre off, and Marcus a metre and a
       half before him, so nobody stands in the line from his eyes to the one speaking and the lens is never within 0.9 m of
       a head (the first staging stood his teacher 0.43 m from the lens, then walked the lens through his head at 23.6 s).
       On a phone Marcus is the picture as he speaks; on a desk his teacher stands at its left edge */
    const OPEN1 = {
      marcus0: { x: 1.62, z: -2.85, ry: Math.PI / 2 + 0.55 },             // by the stair door, turned toward the road and the taxi's lights
      meet:    { x: 2.05, z: -2.5 },                                      // where he comes to meet them: under the five-foot way, before his teacher
      phoAt:   { x: 2.05, z: -1.5 },                                      // his teacher's stand, facing Marcus a metre away
      eyeAt:   [2.95, -1.15],                                            // his own, at the five-foot way's edge (the drain's grating behind him)
      phoOut:  [[3.52, -1.06], [3.0, -1.22], [2.45, -1.38], [2.05, -1.5]],   // his teacher out of the taxi first, ahead of him onto the five-foot way
      eyeOut:  [[3.62, -1.0], [3.38, -1.08], [2.95, -1.15]],                // his own steps out, from beside the taxi's door
      stairIn: [[2.05, -2.5], [1.6, -3.4], [1.12, -3.72]],               // Marcus to the stair door and in
      phoIn:   [[2.05, -1.5], [1.85, -2.45], [1.5, -3.45], [1.12, -3.72]],
      /* (the landing: his eye at the top of the stair; Marcus at the hinge end of her door, at the picture's left on a desk;
         his teacher on the lobby's far side, at its right; Grace in the doorway's middle) */
      /* (the landing, 27 Nov, photographed: Marcus stood 0.75 m before the lens with his back to it, filling a phone's picture
         and hiding the door, his teacher stood in the potted plant, and her door's open leaf hid half her face. Now: Marcus
         before the door, clear of her slippers, knocking with his right hand at the latch side; his teacher at the lobby's far
         side by the wall, clear of the plant; she opens the door and stands on its threshold, before its leaf, then steps
         back into her room to let them in; the lens at the stair's top looking through the lobby's opening. Nobody walks in
         under this shot (the lobby is 1.2 by 1.25 m, her slippers in its middle): the cut inside finds them in) */
      land:    { eye: [-3.62, EYE, -3.38], marcus: { x: -3.28, z: -2.3, ry: Math.PI / 2 }, pho: { x: -3.6, z: -1.95 }, grace: { x: -2.8, z: -2.3, ry: -Math.PI / 2 } },
      /* inside, along her room's north side behind his teacher's back (half a metre clear of it: the first path passed a
         tenth of a metre from it, the lens over his head), his teacher at the left, to his place by the windows */
      inEye:   [[-1.55, 2.0], [-0.3, 2.55], [1.2, 2.42], [1.45, 1.9]],
      graceIn: { x: -2.05, z: -2.3, ry: Math.PI / 2 - 0.3 },             // just inside her door, a step back and aside from it (clear of its leaf), facing the room
      graceSofa: [[-2.05, -2.3], [-0.75, -1.3], [-0.5, 0.3], [0.38, 0.42]],
      marcusIn: [[-2.3, -1.95], [-1.85, -1.5], [-1.6, -1.05]]
    };
    FILMS1.open = {
      begin(api, s) {
        F1.s = s; F1.lit = ''; F1.film = 'open'; F1.once = new Set();
        if (api && api.handsRoot) api.handsRoot.visible = false;
        f1Show(cast.pho, false); f1Show(phoStand, true); f1Show(cast.grace, false); f1Show(cast.marcus, true); f1Show(driver1, true);
        if (WORLD.reflect) WORLD.reflect.strength(0);
      },
      frame(t) {
        const T = OP51; F1.t = t;
        /* THE LIGHT: blue hour on the street and the stair; her room's lamps from the cut inside (v16.1: in the black) */
        f1Look(t < T.inn ? 'BLUE' : 'LAMP');
        f1Beds({ flat: t >= T.inn ? (1 - 0.45 * f1Env(t, T.m3b, T.m3b + 2.4, 0.5, 0.9)) * (1 - smo(c01((t - T.black) / 1.2))) : t >= T.land ? 0.3 : 0,
                 m3: 0.7 * f1Env(t, T.look - 0.2, T.look + 3.2, 0.8, 1.6) + 0.85 * f1Env(t, T.m3b, T.black + 0.6, 0.8, 1.4) });
        /* THE TAXI: draws in from up the street at 13 s (its lamps, its indicator), stands while they get out, and pulls away
           once his door shuts (gone up the street by 20 s); its driver at the wheel */
        taxiFrame1(t, T);
        /* HER PLACE AS IT STANDS: the street door shut until Marcus opens it; the tube on the stair, flickering twice; her door
           shut until she opens it; her shutters as the play keeps them; the cloth laid by his teacher inside */
        WORLD.streetDoor(smo(c01((t - T.turn - 0.25) / 0.7)) * (1 - smo(c01((t - T.stair - 3.5) / 1.2))));   // (shut behind him once he is two treads up)
        { const d = t - T.tube; WORLD.stairTube(d > 0 && d < 0.9 ? (d < 0.12 || (d > 0.3 && d < 0.42) ? 0.08 : 1) : 1); }
        WORLD.herDoor(t < T.lock + 0.15 ? 0 : t < T.inn ? 0.86 * smo(c01((t - T.lock - 0.15) / 1.3)) : 0);
        WORLD.cloth(t < T.inn ? 0 : smo(c01((t - T.cloth + 0.3) / 1.4)));
        WORLD.candleLit('candle1', t >= T.inn ? true : null);
        /* the reflection is the room's own only from where he kneels (WORLD.md): walking in, the glass shows nobody where he
           stands, so it is down while he walks and comes up once he kneels, in a turn that cannot see the glass */
        if (WORLD.reflect) WORLD.reflect.strength(t < T.kneel ? 0 : 1);
        /* THE PEOPLE */
        openMarcus1(t, T); openPho1(t, T); openGrace1(t, T);
        /* THE LENS */
        f1Track(t, openKeys1(T));
        /* (his steps on the five-foot way and the stair carry a small bob of the eye; kneeling eases it down) */
        if (t > T.out && t < T.mk1 - 0.2) yaw.position.y += -0.016 * Math.abs(Math.sin((t - T.out) * Math.PI / 0.55)) * smo(c01((t - T.out - 0.6) / 0.4));
        if (t > T.inn && t < T.kneel) yaw.position.y += -0.014 * Math.abs(Math.sin((t - T.inn) * Math.PI / 0.55));
        f1Levels();
      },
      end() { f1Lens(PLAYFOV1); f1VisionOff(); F1.beds = null; F1.film = '';
        f1Show(phoStand, false); f1Show(driver1, false); f1Show(cast.pho, true); f1Show(cast.grace, true); f1Show(cast.marcus, true);
        for (const k of ['mkPhone', 'grPhone', 'phoBag']) { PROPS1[k].visible = false; f1Drop(PROPS1[k], 0, -50, 0); }
        WORLD.streetDoor(0); WORLD.herDoor(0); WORLD.cloth(1); WORLD.light('tube', null); WORLD.candleLit('candle1', null);
        if (WORLD.reflect) { WORLD.reflect.strength(1); WORLD.reflect.set('grace', { face: null, turn: 0 }); }
        taxiPark1(); f1Stations('room'); }
    };
    /* THE TAXI'S WAY: from z 22 up the street at 7 m a second, slowing to stand at its stop (z -1.6) by 14.85 s; away up the
       street from 15.9 s, gathering speed. Its group's place a function of the clock */
    const TAXI1 = { x: 4.55, z: -1.6, ry: Math.PI };
    function taxiZ1(t, T) {
      const a0 = T.taxi - 0.6, a1 = T.stop, z0 = 24.0;
      if (t < a0) return z0;
      if (t < a1) { const u = (t - a0) / (a1 - a0); return lp(z0, TAXI1.z, 1 - (1 - u) * (1 - u)); }   // (slowing all the way in: a car pulling up)
      const g = t - (T.door + 0.3); if (g <= 0) return TAXI1.z;
      return TAXI1.z - 0.5 * 2.6 * g * g;                                                              // (away, 2.6 m a second each second)
    }
    function taxiFrame1(t, T) {
      const g = things.taxi; if (!g) return;
      const z = taxiZ1(t, T), shown = t < T.door + 6.0 && z > -40;
      g.position.set(TAXI1.x, GY - 0.15, z); g.rotation.y = TAXI1.ry; g.visible = shown;
      /* (its lamps, at its front corners by its own box once it has landed) */
      const m = g.userData.model;
      if (m && !taxiLamps1.box) { const bb = new THREE.Box3(); m.updateWorldMatrix(true, true); const inv = new THREE.Matrix4().copy(g.matrixWorld).invert();
        m.traverse(q => { if (q.isMesh && q.geometry) { if (!q.geometry.boundingBox) q.geometry.computeBoundingBox(); bb.union(q.geometry.boundingBox.clone().applyMatrix4(new THREE.Matrix4().multiplyMatrices(inv, q.matrixWorld))); } });
        taxiLamps1.box = bb;
        /* (the driver in the seat on the car's right, as Singapore drives: the car's own +z is its front, its right is -x) */
        if (driver1.group.parent === g) { driver1.group.position.set(bb.min.x + (bb.max.x - bb.min.x) * 0.28, bb.min.y + 0.12, bb.min.z + (bb.max.z - bb.min.z) * 0.5); driver1.group.rotation.y = 0; } }
      const B = taxiLamps1.box, lit = shown && t < T.door + 6.0 ? 1 : 0;
      for (const [k, sx] of [['L', 0.82], ['R', 0.18]]) { const L = taxiLamps1[k];
        if (B) { const p = new THREE.Vector3(lp(B.min.x, B.max.x, sx), B.min.y + (B.max.y - B.min.y) * 0.38, B.max.z + 0.02).applyMatrix4(g.matrixWorld); L.q.position.copy(p); }
        L.m.opacity = 0.75 * lit; L.q.visible = lit > 0; }
      { const L = taxiLamps1.ind, on = shown && t > T.taxi - 0.4 && t < T.door + 4.0 && (Math.floor((t - T.taxi) / 0.36) % 2 === 0);
        if (B) { const p = new THREE.Vector3(B.max.x - 0.04, B.min.y + (B.max.y - B.min.y) * 0.42, B.max.z - 0.05).applyMatrix4(g.matrixWorld); L.q.position.copy(p); }
        L.m.opacity = on ? 0.9 : 0; L.q.visible = on; }
      whenReady(driver1, (P) => { if (!g.visible) { P.group.visible = false; return; } P.group.visible = !P.hidden; pose(P, 'Sitting_Answering_Questions', 0.3 + 0.1 * Math.sin(t * 0.7), false);
        /* his hands on the wheel's rim before him (the car's own frame: the wheel 0.42 m before his hips, 0.32 up) */
        P.group.updateWorldMatrix(true, true); const h = P.hips; if (!h) return; h.getWorldPosition(_f1A);
        const fw = new THREE.Vector3(0, 0, 1).applyQuaternion(g.getWorldQuaternion(_f1Q)), rt = new THREE.Vector3(-1, 0, 0).applyQuaternion(_f1Q);
        for (const [sd, sgn] of [['L', -1], ['R', 1]]) { const w = _f1A.clone().addScaledVector(fw, 0.46).addScaledVector(rt, sgn * 0.17); w.y += 0.36;
          handTo(P, sd, [w.x, w.y, w.z], [fw.x * 0.3, 0.6, fw.z * 0.3], [-rt.x * sgn, 0, -rt.z * sgn], 1, { out: 0.16, down: 0.3 }); } });
    }
    function taxiPark1() { const g = things.taxi; if (g) { g.position.set(TAXI1.x, GY - 0.15, TAXI1.z); g.rotation.y = TAXI1.ry; g.visible = true; }
      for (const k of ['L', 'R', 'ind']) { taxiLamps1[k].m.opacity = 0; taxiLamps1[k].q.visible = false; } f1Show(driver1, false); }
    /* MARCUS: waiting by the stair door, his phone in his hand; he looks up the street at the taxi's lights, comes to meet
       them, says his line; looks up at her windows (M3); turns to the stair door and in; the climb ahead of them, a stop to
       look back down at the street door; at her door: two knocks, his line; in, to his chair by the door */
    const MK_REST1 = ['Idle_3', 1.4, 0.32, true];
    function openMarcus1(t, T) {
      const P = cast.marcus; if (!P || !P.ready) return;
      if (t < T.stair) {
        const st = OPEN1.marcus0;
        if (t < T.mk1 - 1.4) { put(P, st.x, st.z, f1Turn(t, T.taxi - 0.2, T.taxi + 1.2, st.ry, faceTo(st.x, st.z, 4.4, 2.0)), GY); pose(P, MK_REST1[0], MK_REST1[1] + t * MK_REST1[2], true);
          f1Gaze(P, t, [[0, [3.6, GY + 1.5, -1.4]], [3.2, [2.0, GY + 0.95, -2.55], 0.8], [9.0, [4.0, GY + 1.4, 4.0], 0.9], [T.taxi - 0.1, () => [TAXI1.x - 0.6, GY + 1.0, taxiZ1(t, T)], 0.7]], 0.85, 0.75, 0.05);
          f1Carry(P, 'Right', PROPS1.mkPhone, { palm: { along: 0.02, off: 0.02 } });
        } else if (t < T.turn) {
          /* (to meet them, under the five-foot way, turned to his teacher and a little toward him, so his face is seen) */
          const mRy = faceTo(OPEN1.meet.x, OPEN1.meet.z, OPEN1.phoAt.x + 0.3, OPEN1.phoAt.z + 0.1);
          const walked = f1Walk(P, t, T.mk1 - 1.4, [[st.x, st.z], [OPEN1.meet.x, OPEN1.meet.z]], 0.9, MK_REST1, mRy, { y: GY, ry0: P.group.rotation.y });
          if (!walked && t > T.mk1 - 0.3) { put(P, OPEN1.meet.x, OPEN1.meet.z, mRy, GY);
            f1Speak(P, t, MK_REST1, [[T.mk1, SECS.mk51o1, 'Stand_and_Chat', 0.55]]); }
          /* his look: to his teacher as he speaks, then a glance up toward her flat over the five-foot way's ceiling (M3: the
             windows are over the covered way, so from under it a glance up is toward her rooms, never at the glass), then to
             the stair door */
          f1Gaze(P, t, [[T.mk1 - 1.4, () => f1Head(phoStand, [OPEN1.phoAt.x, GY + 1.6, OPEN1.phoAt.z], 1.6)], [T.look, [2.3, GY + 2.9, -2.15], 1.1], [T.turn - 0.4, [1.15, GY + 1.3, -3.7], 0.6]], 0.9, 0.9, 0.0);
          f1Carry(P, 'Right', PROPS1.mkPhone, { palm: { along: 0.02, off: 0.02 } });
        } else {
          f1Walk(P, t, T.turn, OPEN1.stairIn, 1.0, MK_REST1, -Math.PI / 2, { y: GY, ry0: P.group.rotation.y });
          PROPS1.mkPhone.visible = false;
        }
        return;
      }
      if (t < T.land) {
        /* (the climb: two treads ahead of his teacher at the cut, a tread every half second; at the flicker he stops and looks
           back down at the street door, then climbs on) */
        /* (photographed 27 Nov: the street door straight behind him, his look was bowed down and could not pick a side. So
           at the stop he turns on his tread toward the flight's middle, a third of a right angle, and his head goes on over
           his left shoulder, down to the door: his face to the lens below) */
        const s = climbAt(t, T.stair, 0.5, STAIR1.mk.s0, T.tube, T.tube + 1.4, CLIMB1.n + 1);
        const back = f1Env(t, T.tube + 0.1, T.tube + 1.5, 0.35, 0.4);
        /* (at the top: the closing step onto the landing's tread, then his rest, his look going along the landing to her door) */
        const tTop = T.stair + (CLIMB1.n + 1 - STAIR1.mk.s0) * 0.5 + 1.4, settle = smo(c01((t - tTop) / 0.7));
        climbPose(P, s, { z: STAIR1.mk.z, ry: -Math.PI / 2 + 0.6 * back, settle, rest: [MK_REST1[0], MK_REST1[1] + 0.32 * Math.max(0, t - tTop)] });
        if (back > 0.001) lookNow(P, [1.15, GY + 1.2, -3.72], back * 0.95, 1.05, 0.0);
        else if (settle > 0.001) lookNow(P, [-3.4, 1.5, -2.3], settle * 0.8, 0.9, 0.0);
        PROPS1.mkPhone.visible = false;
        return;
      }
      if (t < T.inn) {
        /* AT HER DOOR: the knock (his written take's rising window, where his hand is at the height of a door's knocking),
           his line to the door; at her door until the cut inside */
        const L = OPEN1.land.marcus;
        {
          put(P, L.x, L.z, L.ry, 0);
          f1Speak(P, t, MK_REST1, [[T.mk2, SECS.mk51o2, 'Stand_and_Chat', 0.55]]);
          /* (his written knock goes above his head: people/RECORD.md 9. So the knock is his hand's own: raised to the door's
             leaf at 1.42 m, the knuckles meeting it at the sound's two knocks, 0.29 s apart) */
          const kk = f1Env(t, T.knock - 0.55, T.knock + 0.75, 0.4, 0.4);
          if (kk > 0.001) { const tap = (d) => Math.exp(-((d * d) / 0.0025)), back = 0.06 * (1 - Math.max(tap(t - T.knock), tap(t - T.knock - 0.29)));
            /* (photographed 27 Nov: an open hand stood up flat before his face, the fingers splayed like a claw, 0.27 m from
               the door. A knock is a loose fist, its second knuckles to the door, the thumb up and the forearm reaching to it:
               so he stands 0.4 m back from the leaf, the fist's front (0.055 m past the palm's middle) at the door) */
            const f = [0.94, 0.34, 0], d = [FRONT.x0 - 0.125 - back, 1.42, -2.1];
            handTo(P, 'R', [d[0] - 0.055 * f[0], d[1] - 0.055 * f[1], d[2]], f, [0, -0.35, -1], kk, { out: 0.25, down: 0.35, off: 0 });
            /* (measured 27 Nov, jointscan's ranges: curled by +1.3 his right hand's fingers bent BACKWARD 58 to 69 degrees: the
               knock's palm is laid facing his midline and his right hand's measured facing turns the curl the other way: so
               it is turned by the negative, and measured again) */
            curlFingers(P, 'R', -1.3 * kk); }
          f1Gaze(P, t, [[T.land, [-2.8, 1.5, -2.1]], [T.gr1 - 0.3, () => f1Head(cast.grace, [-2.28, 1.5, -2.3], 1.5), 0.5], [T.ph2, [OPEN1.land.pho.x, 1.55, OPEN1.land.pho.z], 0.7]], 0.8, 0.8, 0.0);
        }
        return;
      }
      /* INSIDE: to the rattan chair by the door, and seated (the play's station) before the lens can see that corner, in the
         glass or out of it (the glass is down while he walks: above) */
      if (t < T.inn + 2.6) { f1Walk(P, t, T.inn - 0.6, OPEN1.marcusIn, 0.9, MK_REST1, HER.rattan.ry, {}); return; }
      const st = STATION.room.marcus; put(P, st.x, st.z, st.ry, (P.home && P.home.y) || 0);
      if (P.acts.Sitting_Answering_Questions) pose(P, 'Sitting_Answering_Questions', 0.6 + 0.4 * Math.sin(t * 0.7), false);
    }
    /* GRANDMASTER PHO, STANDING: out of the taxi first and a step ahead on the five-foot way, the cloth bag on his
       shoulder; his answer to Marcus; up the stair behind him; on the landing behind Marcus, his thank you to Grace; in. From
       the cut inside he is the seated cast.pho at his cushion (the swap made on the cut: v24.12) */
    function openPho1(t, T) {
      const P = phoStand;
      if (t >= T.inn) { f1Show(P, false); PROPS1.phoBag.visible = false; openPhoSeated1(t, T); return; }
      /* (shown again on every frame before the cut inside, so a seek back from past it finds him: a pure function of the
         film's clock, v6.4; the probe's pictures, taken after its rows had run the film to its end, had him gone) */
      f1Show(P, true); f1Show(cast.pho, false);
      if (!P.ready) return;
      /* (out of the taxi first, and seen only from the cut to his eyes: nobody gets out under the crane, whose taxi has no
         door that opens) */
      const out = t >= T.out - 0.02;
      P.group.visible = out && !P.hidden; if (!out) { PROPS1.phoBag.visible = false; return; }
      if (t < T.stair) {
        if (t < T.ph1 + SECS.ph51o1 + 0.2) {
          /* (out of the taxi 1.6 s before the cut, so the cut finds him walking ahead of the lens, 1.1 m off and going; at his
             stand he turns to Marcus) */
          const pa = OPEN1.phoAt, pEnd = OPEN1.phoOut[OPEN1.phoOut.length - 1];
          f1Walk(P, t, T.out - 1.6, OPEN1.phoOut, 0.95, phoRest1(t), faceTo(pa.x, pa.z, OPEN1.meet.x, OPEN1.meet.z), { y: (x) => streetY1(x) });
          const g = P.group.position;
          if (Math.hypot(g.x - pEnd[0], g.z - pEnd[1]) < 0.02) f1Speak(P, t, phoRest1(t), [[T.ph1, SECS.ph51o1]]);
          f1Gaze(P, t, [[T.out - 1.6, [2.4, GY + 1.6, -1.9]], [T.mk1 - 0.6, () => f1Head(cast.marcus, [OPEN1.meet.x, GY + 1.6, OPEN1.meet.z], 1.58), 0.8], [T.turn, [1.15, GY + 1.4, -3.72], 0.8]], 0.7, 0.6, 0.02);
        } else f1Walk(P, t, T.ph1 + SECS.ph51o1 + 0.2, OPEN1.phoIn, 0.9, phoRest1(t), -Math.PI / 2, { y: GY, ry0: P.group.rotation.y });
      } else if (t < T.land) {
        /* (he stops 0.4 s after Marcus, on a whole tread: at 0.6 s a tread from four, the thirteenth, both feet down; a stop
           between treads held one foot in the air) */
        climbPose(P, climbAt(t, T.stair, STAIR1.pho.cad, STAIR1.pho.s0, T.tube + 0.4, T.tube + 1.8), { z: STAIR1.pho.z });
      } else {
        /* (at the lobby's far side, turned to her door, until the cut inside) */
        const L = OPEN1.land.pho, lRy = faceTo(L.x, L.z, -2.8, -2.3);
        put(P, L.x, L.z, lRy, 0); f1Speak(P, t, phoRest1(t), [[T.ph2, SECS.ph51o2]]);
        f1Gaze(P, t, [[T.land, [-2.85, 1.55, -2.3]], [T.gr1 - 0.2, () => f1Head(cast.grace, [-2.8, 1.5, -2.3], 1.5), 0.6]], 0.75, 0.65, 0.02);
      }
      /* the cloth bag on his left shoulder (it goes where his body goes) */
      phoBagOn1(P);
    }
    /* HIS CLOTH BAG ON HIS LEFT SHOULDER (the plan's 9.1 and 9.6: "his cloth bag on his shoulder"; 27 Nov, photographed: hung
       at his right hip, its short strap rose to his elbow and the bag hung off his bare arm, through it). Its strap's top on
       the top of his shoulder, over the robe, and the bag hanging below it outside his arm, its foot pushed out by the arm a
       little (a tilt of 0.45 rad about his front-to-back line), so a swinging arm passes inside it. w51phobag stands 0.497 m
       from its foot to the top of its strap, 0.32 wide, 0.18 deep */
    const PHOBAG1 = { top: 0.497, up: 0.08, out: 0.03, tilt: -0.45 };
    function phoBagOn1(P) {
      const g = PROPS1.phoBag; if (!g || !P.ready || !P.group.visible) { if (g) g.visible = false; return; }
      const sh = f1Bone(P, 'LeftArm') || f1Bone(P, 'LeftShoulder'); if (!sh) return;
      P.group.updateWorldMatrix(true, true); sh.getWorldPosition(_f1A);
      const ry = P.group.rotation.y, lf = new THREE.Vector3(Math.cos(ry), 0, -Math.sin(ry));
      if (g.parent !== world) world.attach(g);
      g.rotation.set(PHOBAG1.tilt, ry + Math.PI / 2, 0, 'YXZ'); g.scale.setScalar(1); g.updateMatrix();
      const topOff = new THREE.Vector3(0, PHOBAG1.top, 0).applyEuler(g.rotation);
      g.position.copy(_f1A).addScaledVector(lf, PHOBAG1.out); g.position.y += PHOBAG1.up; g.position.sub(topOff);
      g.visible = true;
    }
    /* his teacher seated, from the cut inside: at the low table spreading his white cloth over it as the lens comes in, then
       at rest, his hands in his lap (the play's seat) */
    function openPhoSeated1(t, T) {
      const P = cast.pho; f1Show(P, true); if (!P || !P.ready) return;
      const st = STATION.room.pho; put(P, st.x, st.z, st.ry, (P.home && P.home.y) || 0.12);
      pose(P, 'Sit_to_Stand_Transition_M', 0.02 + 0.01 * Math.sin(t * 0.9), false);
      const k = f1Env(t, T.inn - 0.4, T.cloth + 1.5, 0.3, 0.6);
      if (k > 0.001) { const u = smo(c01((t - T.cloth + 0.3) / 1.4)), tz = lp(HER.table.z + 0.05, HER.table.z - 0.2, u);
        for (const [sd, dx] of [['L', 0.3], ['R', -0.3]]) handTo(P, sd, [st.x + dx * (0.75 + 0.35 * u), CLOTH_Y + 0.03, tz], [0, -0.25, -1], [0, 1, 0], k, { out: 0.22, down: 0.25 }); }
    }
    /* GRACE: at her door when it opens, her phone in her hand, her eyes going past them down the stairs as she steps back;
       inside, standing just inside the door facing the room, her reflection facing the stairs; then to the sofa (the play's
       place), her reflection turning to follow a beat late */
    const GR_REST1 = ['Idle_3', 2.2, 0.3, true];
    function openGrace1(t, T) {
      const P = cast.grace; if (!P) return;
      const shown = t > T.lock + 0.2; f1Show(P, shown); if (!shown) { PROPS1.grPhone.visible = false; if (WORLD.reflect) WORLD.reflect.set('grace', { face: null }); return; }
      if (!P.ready) return;
      if (t < T.inn) {
        /* (a step back and aside, clear of her door's leaf, to let them in: OPEN1.graceIn, where the cut inside finds her) */
        const L = OPEN1.land.grace, G0 = OPEN1.graceIn, back = smo(c01((t - T.ph2 - 0.4) / 1.4));
        put(P, lp(L.x, G0.x, back), lp(L.z, G0.z, back), L.ry - 0.35 * back, 0);
        f1Speak(P, t, GR_REST1, [[T.gr1, SECS.gr51o1, 'Idle_3']]);
        /* her look: to Marcus, to his teacher, and then past them, down the stairs */
        f1Gaze(P, t, [[T.lock, () => f1Head(cast.marcus, [-3.22, 1.6, -2.32], 1.6)], [T.ph2 - 0.2, () => f1Head(phoStand, [OPEN1.land.pho.x, 1.55, OPEN1.land.pho.z], 1.55), 0.6], [T.ph2 + SECS.ph51o2 - 0.4, [-3.4, -0.6, -3.72], 0.9]], 0.85, 0.8, 0.0);
        f1Carry(P, 'Right', PROPS1.grPhone, { palm: { along: 0.02, off: 0.02 } });
        return;
      }
      PROPS1.grPhone.visible = false;
      const G = OPEN1.graceIn;
      if (t < T.sofa) { put(P, G.x, G.z, G.ry, 0); pose(P, GR_REST1[0], GR_REST1[1] + t * GR_REST1[2], true);
        if (WORLD.reflect) WORLD.reflect.set('grace', { face: GRACE_FACE_STAIRS(), turn: 0 }); return; }
      /* to the sofa: her walk, and at the sofa her turn and her sitting down (her rise played backward: people/RECORD.md) */
      /* (her pace is her path's own length over the walk's seconds, OP51.sofaWalk, so the sounds and the black that follow
         her land with her: z_tail.js) */
      const pts = OPEN1.graceSofa, v = f1PathLen(pts) / Math.max(0.5, T.sofaWalk - 0.45);
      if (t < T.sofaSit) f1Walk(P, t, T.sofa, pts, v, GR_REST1, Math.PI, { ry0: G.ry, y: 0 });
      else { const st = STATION.room.grace, u = c01((t - T.sofaSit) / (T.seated - T.sofaSit));
        if (P.acts.rise) { put(P, lp(pts[3][0], st.x, smo(u)), lp(pts[3][1], st.z, smo(u)), st.ry, 0); pose(P, 'rise', lp(4.9, 0.05, smo(u)), false); }
        else put(P, st.x, st.z, st.ry, 0);
        if (u >= 1 && P.acts.gsofa) pose(P, 'gsofa', 0.25, false); }
      /* her reflection: it faced the stairs; it turns to follow her a beat late (0.8 s behind her own turn) */
      if (WORLD.reflect) { const lag = smo(c01((t - T.sofa - 0.8) / 1.1)); WORLD.reflect.set('grace', { face: lag >= 1 ? null : GRACE_FACE_STAIRS() + angTo(GRACE_FACE_STAIRS(), P.group.rotation.y) * lag, turn: 0 }); }
    }
    /* THE OPENING'S LENS */
    function openKeys1(T) {
      const W = [2.75, 1.6, -0.1];                                                    // her two lit windows' middle
      const MK = () => f1Head(cast.marcus, [OPEN1.marcus0.x, GY + 1.0, OPEN1.marcus0.z], 1.0);
      /* (the reflected people stand 0.86 to 1.21 m up the glass from his kneeling eye: aimed at their middle, 27 Nov, where
         the first aim at 1.45 m left them at the picture's foot under a black reflected ceiling) */
      const glass = [FILMPLACE.glass.x, 1.08, FILMPLACE.glass.z + 0.06];
      const kneelEye = [HER.him.x, KNEEL_EYE, HER.him.z];
      const eyeClimb = (t) => { const s = climbAt(t, T.stair + STAIR1.eye.wait, STAIR1.eye.cad, STAIR1.eye.s0, T.tube + 0.3, T.tube + 1.7), sc = Math.max(0, s);
        return [s <= 0 ? lp(1.75, CLIMB1.x1 + 0.1, smo(c01((s + 2.0) / 2.0))) : treadX(sc - 0.2), treadY(Math.max(0, sc - 0.35)) + EYE + 0.02 * Math.abs(Math.sin(sc * Math.PI)), STAIR1.eye.z]; };
      return [
        /* THE CRANE (2 to 15.5 s): from 7 m up and over the road, the row's roofline against the deep blue and her lit windows
           in the lower half, down and in under the five-foot way's ceiling to Marcus by the stair door, seen from up the
           five-foot way (north of him), so that as the taxi's lights come down the street he turns his face to them and to us;
           the taxi passes behind the lens's right and draws in (a desk sees its front at the right edge; a phone, a third of
           the width, holds Marcus whole). (27 Nov, photographed: the first end stood south of him in the next unit's arcade,
           behind its pillar, seeing his back, and the pull hunted there and back on the way down) */
        /* (photographed 27 Nov: aimed 0.3 m off the windows' middle and allowed 2.5 m back, a phone cut the nearer window at
           its edge; now square to their middle, allowed 3.5 m) */
        { t: 0, name: 'crane', eye: [9.6, GY + 7.0, 0.6], at: [2.9, GY + 7.95, 0.0], fp: 62, fd: 50, hold: [[W[0], W[1], -1.4, 0.8], [W[0], W[1], 1.4, 0.8]], back: 3.5 },
        { t: T.up, name: 'crane', eye: [9.6, GY + 7.0, 0.6], at: [2.9, GY + 7.95, 0.0], fp: 62, fd: 50, hold: [[W[0], W[1], -1.4, 0.8], [W[0], W[1], 1.4, 0.8]], back: 3.5 },
        { t: T.out - 0.05, name: 'crane', eye: [2.25, GY + 1.55, -0.1], at: () => { const m = MK(); return [m[0], GY + 1.2, m[2]]; }, fp: 62, fd: 50,
          hold: () => [[MK()[0], GY + 1.8, MK()[2], 0.18], [MK()[0], GY + 0.45, MK()[2], 0.18]], back: 1.0 },
        /* HIS EYES, for the first time: out of the taxi onto the five-foot way, his teacher ahead in white; Marcus coming to
           meet them, his face held in the middle third as he speaks; up at her windows with him; to the stair door */
        /* (his eye rising from the taxi's seat on the road, onto the drain's grating, onto the five-foot way's edge: the
           heights are the ground's own, GY - 0.15 the road and GY - 0.03 the grating; it looks after his teacher walking
           ahead, then at Marcus; the lens stays 0.9 m and more from every head) */
        { t: T.out, name: 'out', eye: [OPEN1.eyeOut[0][0], GY - 0.15 + 1.2, OPEN1.eyeOut[0][1]], at: [2.5, GY + 1.5, -1.38], fp: 60, fd: 52, cut: true },
        { t: T.out + 0.75, name: 'out', eye: [OPEN1.eyeOut[1][0], GY - 0.03 + EYE - 0.02, OPEN1.eyeOut[1][1]], at: [2.2, GY + 1.52, -1.62], fp: 60, fd: 52 },
        { t: T.mk1 - 0.1, name: 'meet', eye: [OPEN1.eyeAt[0], GY + EYE, OPEN1.eyeAt[1]], at: () => f1Head(cast.marcus, [OPEN1.meet.x, GY + 1.5, OPEN1.meet.z], 1.5), fp: 60, fd: 52 },
        { t: T.ph1 - 0.2, name: 'meet', eye: [OPEN1.eyeAt[0], GY + EYE, OPEN1.eyeAt[1]], at: () => f1Head(cast.marcus, [OPEN1.meet.x, GY + 1.5, OPEN1.meet.z], 1.5), fp: 60, fd: 52 },
        { t: T.look + 0.3, name: 'up', eye: [OPEN1.eyeAt[0] - 0.02, GY + EYE, OPEN1.eyeAt[1] - 0.03], at: () => { const h = f1Head(cast.marcus, [OPEN1.meet.x, GY + 1.5, OPEN1.meet.z], 1.5); return [h[0], h[1] + 0.3, h[2]]; }, fp: 60, fd: 52 },
        { t: T.turn + 0.2, name: 'door', eye: [OPEN1.eyeAt[0] - 0.05, GY + EYE, OPEN1.eyeAt[1] - 0.08], at: [1.15, GY + 1.45, -3.72], fp: 60, fd: 52 },
        { t: T.stair - 0.05, name: 'door', eye: [2.72, GY + EYE, -1.6], at: [1.15, GY + 1.4, -3.72], fp: 60, fd: 52 },
        /* THE STAIR: climbing behind his teacher and Marcus, looking up the flight */
        { t: T.stair, name: 'stair', eye: () => eyeClimb(F1.t), at: () => { const e = eyeClimb(F1.t); return [e[0] - 3.0, e[1] + 1.75 - 0.3 * c01((F1.t - T.stair) / 9.5), STAIR1.eye.z]; }, fp: 64, fd: 56, cut: true },
        { t: T.land - 0.05, name: 'stair', eye: () => eyeClimb(F1.t), at: () => { const e = eyeClimb(F1.t); return [e[0] - 3.0, e[1] + 1.45, STAIR1.eye.z]; }, fp: 64, fd: 56, ease: 'lin' },
        /* THE LANDING: at the top of the stair, level with her; her door, Marcus's knock; Grace, her head, both hands and the
           door's edge held */
        { t: T.land, name: 'land', eye: OPEN1.land.eye, at: [-2.95, 1.38, -2.12], fp: 52, fd: 44, cut: true },
        /* (her stand-in place before she is drawn is where she stands, on her floor: 27 Nov, measured, the old stand-in 0.5 m
           off and 1.4 m up swung the look 13 degrees in a tenth of a second as she came into the light) */
        { t: T.gr1 - 0.3, name: 'grace', eye: [OPEN1.land.eye[0] + 0.05, EYE, OPEN1.land.eye[2] + 0.04], at: () => f1Head(cast.grace, [OPEN1.land.grace.x, 1.32, OPEN1.land.grace.z], 1.32), fp: 52, fd: 44,
          hold: () => { const g = f1Head(cast.grace, [OPEN1.land.grace.x, 0, OPEN1.land.grace.z], 0); return [[g[0], g[1] + 1.58, g[2], 0.14], [g[0], g[1] + 0.85, g[2], 0.3], [FRONT.x0, 1.2, HER.door.z + 0.45, 0.05]]; }, back: 0.25, fmax: 64 },
        /* (photographed 27 Nov: held on her as she stepped back into her room, the lens found the door's jamb and her
           shoulder. On his word the look goes to his teacher, who says it, across the lobby; she steps back unseen) */
        { t: T.ph2 - 0.45, name: 'grace', eye: [OPEN1.land.eye[0] + 0.05, EYE, OPEN1.land.eye[2] + 0.04], at: () => f1Head(cast.grace, [OPEN1.land.grace.x, 1.3, OPEN1.land.grace.z], 1.3), fp: 52, fd: 44,
          hold: () => { const g = f1Head(cast.grace, [OPEN1.land.grace.x, 0, OPEN1.land.grace.z], 0); return [[g[0], g[1] + 1.58, g[2], 0.14], [g[0], g[1] + 0.85, g[2], 0.3]]; }, back: 0.25, fmax: 64 },
        { t: T.ph2 + 0.6, name: 'pho', eye: [OPEN1.land.eye[0] + 0.03, EYE, OPEN1.land.eye[2] + 0.02], at: () => f1Head(phoStand, [OPEN1.land.pho.x, 1.5, OPEN1.land.pho.z], 1.5), fp: 52, fd: 44,
          hold: () => { const g = f1Head(phoStand, [OPEN1.land.pho.x, 0, OPEN1.land.pho.z], 0); return [[g[0], g[1] + 1.72, g[2], 0.14], [g[0], g[1] + 1.05, g[2], 0.28]]; }, back: 0.25, fmax: 64 },
        { t: T.inn - 0.05, name: 'pho', eye: [OPEN1.land.eye[0] + 0.02, EYE, OPEN1.land.eye[2]], at: () => f1Head(phoStand, [OPEN1.land.pho.x, 1.5, OPEN1.land.pho.z], 1.5), fp: 52, fd: 44,
          hold: () => { const g = f1Head(phoStand, [OPEN1.land.pho.x, 0, OPEN1.land.pho.z], 0); return [[g[0], g[1] + 1.72, g[2], 0.14], [g[0], g[1] + 1.05, g[2], 0.28]]; }, back: 0.25, fmax: 64 },
        /* INSIDE (cut in the black of the doorway): along her room's north side, his teacher at the left spreading his cloth;
           he kneels at his place; his look goes to the black glass by the shutter's edge; the lens narrows on it */
        { t: T.inn, name: 'in', eye: [OPEN1.inEye[0][0], EYE, OPEN1.inEye[0][1]], at: [2.7, 1.25, 2.1], fp: 66, fd: 58, cut: true, flow: true },
        { t: T.inn + 1.6, name: 'in', eye: [OPEN1.inEye[1][0], EYE, OPEN1.inEye[1][1]], at: [2.7, 1.15, 1.7], fp: 66, fd: 58, flow: true },
        { t: T.kneel - 0.35, name: 'in', eye: [OPEN1.inEye[2][0], EYE - 0.02, OPEN1.inEye[2][1]], at: [2.4, 1.05, 0.6], fp: 66, fd: 58, flow: true },
        { t: T.kneel + 1.2, name: 'kneel', eye: kneelEye, at: [0.9, 0.95, -0.4], fp: 66, fd: 58, flow: true, stop: true },
        { t: T.turnG, name: 'kneel', eye: kneelEye, at: [0.9, 0.95, -0.4], fp: 66, fd: 58 },
        { t: T.narrow, name: 'glass', eye: kneelEye, at: glass, fp: 66, fd: 58 },
        { t: T.narrow + 7.0, name: 'glass', eye: kneelEye, at: glass, fp: 50, fd: 44 },
        { t: T.end, name: 'glass', eye: kneelEye, at: glass, fp: 50, fd: 44 }
      ];
    }

    /* ================================================================ THE KEEPSAKE (the plan's 9.2; its clock KS51). From the
       room, all four found. His teacher's open hand held out across the cloth to Grace; her hand to her bag, stopped, Marcus's
       hand on her shoulder; the packet that her fingers will not let go, then do, into his palm; set apart on the small white
       plate at the cloth's far corner (an insert from above, its red knot); his teacher turns to him; his hands lift the bowl
       and hold it before him, the water catching the candlelight; the wax: three drops, the ripples, the chant begins; into
       the breaking's brief, the lens looking down into the bowl in his hands */
    const KEEP1 = { mkStand: { x: 0.12, z: -1.02, ry: 0.12 } };   // behind the sofa at her right shoulder
    FILMS1.keepsake = {
      begin(api, s) { F1.s = s; F1.lit = ''; F1.film = 'keepsake'; F1.api = api; F1.hands = false;
        if (api && api.handsRoot) api.handsRoot.visible = false;
        f1Show(cast.pho, true); f1Show(cast.grace, true); f1Show(cast.marcus, true); f1Show(phoStand, false); },
      frame(t) {
        const T = KS51, api = F1.api; F1.t = t;
        f1Look('LAMP'); f1Beds({ flat: 1, m2: 0.75 * (1 - smo(c01((t - T.chant) / 2.0))), m3: f1Env(t, T.bag, T.give + 0.3, 0.8, 0.7) });
        WORLD.cloth(1); WORLD.candleLit('candle1', true);
        keepPho1(t, T); keepGrace1(t, T); keepMarcus1(t, T); keepPacket1(t, T);
        /* THE BOWL: on the cloth until his hands lift it (out of the frame, under Pho's face: 26 s), then in his hands, drawn
           with them (kit.hold, the left hand under it; the engine's `bowl` pose); its water catching the candle */
        keepBowl1(t, T, api);
        f1Track(t, keepKeys1(T));
        f1Levels();
      },
      end() { f1Lens(PLAYFOV1); F1.beds = null; F1.film = ''; knotGlow1.m.opacity = 0; knotGlow1.q.visible = false;
        f1HandsHold(F1.api, null, 0); glintMat1.opacity = 0; ringMat1.opacity = 0; waxMat1.opacity = 0; f1LeanBack(cast.pho); f1LeanBack(cast.grace); f1LeanBack(cast.marcus); F1.api = null; }
    };
    function keepPho1(t, T) {
      const P = cast.pho; if (!P || !P.ready) return;
      f1LeanBack(P);
      /* (TURNED TO HIM from 22 s, as he asks him to hold the water: photographed 27 Nov, his head alone could not turn the
         right angle to where his student kneels at his right, and he spoke his line in profile. His shoulders turn to him a
         third of the way (f1Lean's twist) and his look goes the rest; he stays turned to him, over the bowl in his hands, to
         the film's end, which looks down into the bowl: the play's rest takes the turn back unseen) */
      const st = STATION.room.pho, turnK = f1Env(t, T.turn - 0.4, T.end + 9, 1.3, 0.5);
      put(P, st.x, st.z, st.ry, (P.home && P.home.y) || 0.12);
      f1Speak(P, t, ['Sit_to_Stand_Transition_M', 0.02, 0, false], [[T.k1, SECS.ph51k1, 'Sitting_Answering_Questions', 0.6], [T.k2, SECS.ph51k2, 'Sitting_Answering_Questions', 0.6]]);
      /* HIS LEFT HAND held out open across the cloth toward her, palm up (0 to 13 s), leaning into the reach as she reaches
         to him (the table is wider than two seated arms: he leans 0.5 rad and she 0.45 as the packet passes); the packet laid
         in it at 12.5 s and set on the small white plate at his left (14 to 18 s); his right hand tilts the lit candle over
         the bowl for the wax (32 to 38 s) */
      /* (the set-down, KEEPSET1: his hand brought low beside the plate on his side of it, clear of the lit candle, his fingers
         to its middle (13.7 to 14.9 s); the fingers dipped and the packet slid off them onto the plate (14.95 to 15.35); his
         hand back to his knee after (15.4 to 16.2). 27 Nov: the hand went back from 14.3 s and was at his knee by 15.0 with
         the packet still on it, which then jumped to the plate at 15.2) */
      const out = f1Env(t, T.hand, T.place + KEEPSET1.back + 0.8, 1.2, 0.8), lean = 0.18 * out + 0.57 * f1Env(t, T.pull + 1.2, T.give + 0.9, 1.4, 0.9) + 0.36 * f1Env(t, T.place - 0.5, T.place + KEEPSET1.back + 0.8, 0.7, 0.8);
      f1Lean(P, lean, -0.55 * turnK);
      if (out > 0.001) { const u = smo(c01((t - T.place - KEEPSET1.go) / KEEPSET1.come)), r = f1Env(t, T.pull - 0.4, T.give + 0.9, 1.0, 0.9), sl = keepSlide1(t, T), B = keepBeside1();
        const tx = lp(lp(0.42, KEEPG1.meet[0] - 0.01, r), B[0], u), tz = lp(lp(1.22, KEEPG1.meet[2] + 0.04, r), B[2], u), ty = lp(lp(0.66, KEEPG1.meet[1] - 0.02, r), B[1], u);
        const D = KEEPSET1.dir, fx = lp(0.0, -D[0], u), fz = lp(-1, -D[1], u), fy = lp(-0.1, -KEEPSET1.dip0 - (KEEPSET1.dip1 - KEEPSET1.dip0) * sl, u);
        handTo(P, 'L', [tx, ty, tz], [fx, fy, fz], [0, 1, 0], out, { out: 0.22, down: 0.3 }); }
      const wax = f1Env(t, T.wax - 1.2, T.chant + 4.5, 0.9, 1.0);
      if (wax > 0.001) handTo(P, 'R', [ON_CLOTH.bowl.x - 0.06, CLOTH_Y + 0.5, ON_CLOTH.bowl.z + 0.12], [0.3, 0.6, -0.4], [0.4, -0.2, 0.5], wax, { out: 0.25, down: 0.25 });
      f1Gaze(P, t, [[0, () => f1Head(cast.grace, [0.42, 1.02, -0.32], keepGraceH1(t, T))], [T.place - 0.4, [ON_CLOTH.plate.x, CLOTH_Y, ON_CLOTH.plate.z], 0.6], [T.turn, 'lens', 0.8], [T.wax - 1.0, [ON_CLOTH.bowl.x + 0.3, 0.72, ON_CLOTH.bowl.z + 0.35], 0.8]], 0.85, 0.75, 0.03);
    }
    /* SHE STANDS TO GIVE IT (photographed 27 Nov: seated on her sofa and he on his cushion, they sit 2.2 m apart across the
       table, and two seated arms with all the lean a body has reach 1.6 m: her hand and his palm never met, 0.4 m and more
       apart, and the packet passed from one to the other through the air). So as the packet comes out of her bag she gets
       up from the sofa, by her rise (the opening sits her down by the same take played back), comes up 0.72 m forward
       between the sofa and the table, and bends over the table holding it out to him; he leans to it from his cushion
       and her hand and his palm meet over the cloth's near half (0.8 m up); she lets it go into his palm at 12.5, straightens
       and sits down again under the insert that follows (14 s on). Marcus's hand leaves her shoulder as she rises */
    /* (photographed 27 Nov, the second build: stood up 0.72 m forward her hand met the place, and his palm, 0.83 m out from
       his cushion, stopped 0.25 m short of it. So she rises a little forward, takes one step to the table's edge and bends
       to him; they meet 0.75 m out from his cushion; she steps back and sits) */
    /* (measured, the second build: his palm reached 0.56 m out from his cushion leaning half a radian, hers 0.5 m from where
       she stood: so both bend further to it, he 0.75 rad, she 0.8, and they meet 0.72 m out from his cushion) */
    const KEEPG1 = { rise: { x: 0.42, z: 0.15 }, stand: { x: 0.44, z: 0.55 }, meet: [0.45, 0.78, 1.15], head: 1.5 };
    /* THE SET-DOWN ON THE PLATE (seconds from T.place; the plate is ON_CLOTH.plate, PLAY's): his left palm comes beside the
       plate on his side of it, `off` m out from its middle along `dir` (a unit line from the plate toward his cushion that
       leaves the lit candle at the plate's far side 0.15 m off), `y` over the cloth (his hand's back clear of it), arriving
       at `go` + `come`; the fingers point back along `dir` to the plate's middle, `dip0` down, dipped to `dip1` as the
       packet slides off them (the `slideFor` s before KS51.onPlate, when it lies on the plate and its sound is heard:
       z_tail.js); the hand away from `back` */
    const KEEPSET1 = { off: 0.12, dir: [0.707, 0.707], y: 0.07, go: -0.3, come: 1.2, dip0: 0.35, dip1: 0.5, slideFor: 0.4, back: 1.4 };
    const keepBeside1 = () => [ON_CLOTH.plate.x + KEEPSET1.off * KEEPSET1.dir[0], CLOTH_Y + KEEPSET1.y, ON_CLOTH.plate.z + KEEPSET1.off * KEEPSET1.dir[1]];
    const keepSlide1 = (t, T) => smo(c01((t - T.onPlate + KEEPSET1.slideFor) / KEEPSET1.slideFor));
    const keepGraceUp1 = (t, T) => smo(c01((t - T.pull - 0.3) / 2.0)) * (1 - smo(c01((t - T.give - 1.0) / 2.4)));
    const keepGraceStep1 = (t, T) => smo(c01((t - T.pull - 2.3) / 0.6)) * (1 - smo(c01((t - T.give - 0.4) / 0.6)));
    const keepGraceH1 = (t, T) => lp(GRACE_HEAD_SEATED, KEEPG1.head, keepGraceUp1(t, T));
    function keepGrace1(t, T) {
      const P = cast.grace; if (!P || !P.ready) return;
      f1LeanBack(P);
      const st = STATION.room.grace, up = keepGraceUp1(t, T), step = keepGraceStep1(t, T), R = KEEPG1.rise, S2 = KEEPG1.stand;
      put(P, lp(lp(st.x, R.x, up), S2.x, step), lp(lp(st.z, R.z, up), S2.z, step), st.ry, (P.home && P.home.y) || 0);
      /* (seated in her rest as the play seats her, inside its clean window, and stood up by her rise blended in as she gets
         up: photographed 27 Nov, the rise's own first moment has her slumped back with both hands out on the seat) */
      /* (her one step forward and back: her walk laid over her standing by the step's own share, its weight greatest at
         the middle of the step, one step of the walk's cycle along it) */
      const W = P.acts.Walking, stepping = step > 0.001 && step < 0.999 && up > 0.98;
      if (stepping && W && P.acts.rise) pose(P, 'rise', 4.9, false, 'Walking', 0.9 * Math.sin(Math.PI * step), step * W.getClip().duration / 2);
      else if (P.acts.gsofa && P.acts.rise) { if (up > 0.001) pose(P, 'gsofa', 0.3, false, 'rise', up, lp(0.05, 4.9, up)); else pose(P, 'gsofa', 0.3, false); }
      else if (P.acts.rise) pose(P, 'rise', lp(0.05, 4.9, up), false);
      else { const tk = P.acts.gsofa ? 'gsofa' : P.acts.wsit ? 'wsit' : 'Idle_3'; pose(P, tk, tk === 'gsofa' ? 0.3 : 0.8, false); }
      /* her left hand to her open bag beside her and stopped there (6 to 9 s); then the packet out, and held out over the
         table to his teacher's palm as she stands, her fingers closed on it, bent to him (9.5 to 12.5 s); let go; her hand back */
      const toBag = f1Env(t, T.bag - 0.4, T.pull + 0.4, 0.7, 0.4), hold = f1Env(t, T.pull + 2.4, T.give + 0.5, 0.6, 0.4);
      f1Lean(P, 0.8 * hold * up);
      if (toBag > 0.001) handTo(P, 'L', [HER.bag.x - 0.02, HER.bag.y + 0.12, HER.bag.z + 0.04], [0.2, -0.6, 0.3], [0, 0, 1], toBag, { out: 0.2, down: 0.3 });
      if (hold > 0.001) { const M = KEEPG1.meet; handTo(P, 'L', [M[0] + 0.01, M[1] + 0.02, M[2] - 0.03], [0.05, -0.15, 1], [0, -1, 0], hold, { out: 0.18, down: 0.28 }); curlFingers(P, 'L', 0.55 * hold * (1 - smo(c01((t - T.give) / 0.4)))); }
      f1Gaze(P, t, [[0, () => f1Head(cast.pho, [0.5, 1.0, 1.87], 0.95)], [T.bag - 0.2, [HER.bag.x, HER.bag.y, HER.bag.z], 0.7], [T.pull + 0.4, [KEEPG1.meet[0], KEEPG1.meet[1], KEEPG1.meet[2] - 0.05], 0.8], [T.give + 0.6, () => f1Head(cast.pho, [0.5, 1.0, 1.87], 0.95), 0.9]], 0.85, 0.8, 0.02);
    }
    function keepMarcus1(t, T) {
      const P = cast.marcus; if (!P || !P.ready) return;
      /* (he came to stand behind her as his teacher held out his hand: the film's first frame is a cut, and he stands there
         from it, behind the sofa at her right shoulder; his left hand on her shoulder from 7 to 13 s) */
      f1LeanBack(P);
      /* (measured 27 Nov: from the play's station, 0.24 m behind the sofa's back, his hand stopped 0.3 m short of her
         shoulder: in this film he stands against the back, 0.17 m nearer; the breaking's own station takes him back unseen,
         the film ending on the bowl) */
      const M = KEEP1.mkStand; put(P, M.x + 0.02, M.z + 0.17, M.ry, 0); pose(P, 'Idle_3', 1.2 + t * 0.3, true);
      const on = f1Env(t, T.bag + 0.4, T.pull + 0.5, 0.8, 0.6);   // (his hand leaves her shoulder as she gets up)
      /* (her shoulder is 0.7 m from his across the sofa's back: he leans over it to lay his hand there, as a person does;
         photographed 27 Nov, leaning 0.28 rad his left hand stopped short of her shoulder, over her bowed head) */
      f1Lean(P, 0.5 * on);
      /* (photographed 27 Nov: laid by the collar bone's root, by her neck, his hand came down on her hair as she bowed her head:
         now on the top of her shoulder, over its joint, a little in from it) */
      if (on > 0.001) { const g = cast.grace; const sh = g && g.ready ? (f1Bone(g, 'RightArm') || f1Bone(g, 'RightShoulder')) : null, nk = g && g.ready ? f1Bone(g, 'Neck') : null;
        /* (measured, the third build: his palm reached the place, but by her neck her bowed head and hair hid it from the
           lens across the table: so it lies on the outer top of her shoulder, over its joint, a little out from it) */
        if (sh) { g.group.updateWorldMatrix(true, true); sh.getWorldPosition(_f1A); const gq = g.group.quaternion, out = new THREE.Vector3(-0.03, 0, 0).applyQuaternion(gq);
          handTo(P, 'L', [_f1A.x + out.x, _f1A.y + 0.06, _f1A.z + out.z - 0.04], [0.2, -0.45, 0.85], [0, -1, 0], on, { out: 0.18, down: 0.32 }); } }
      f1Gaze(P, t, [[0, () => f1Head(cast.grace, [0.42, 1.02, -0.32], keepGraceH1(t, T))], [T.give + 0.2, [KEEPG1.meet[0], KEEPG1.meet[1], KEEPG1.meet[2]], 0.6], [T.turn + 0.5, () => f1Head(cast.pho, [0.5, 1.0, 1.87], 0.95), 0.8]], 0.8, 0.75, 0.04);
    }
    /* THE PACKET: in her bag; in her left hand from 9.5 s; laid in his palm at 12.5 s; in his hand to the plate; on the plate,
       its red knot glowing dully while it is the insert's subject */
    function keepPacket1(t, T) {
      const g = things.keepsake; if (!g) return;
      if (t < T.pull + 0.3) { f1Drop(g, HER.bag.x + 0.02, HER.bag.y + 0.07, HER.bag.z, 0.4); }
      else if (t < T.give) { const P = cast.grace; if (P && P.ready) { P.group.updateWorldMatrix(true, true); const pm = f1Palm(P, 'Left', _f1A);
        /* (under her palm, between her fingers: she holds it out palm down. Photographed 27 Nov: laid 1.5 cm over the palm's
           middle, it sat on the back of her hand) */
        if (pm) f1Drop(g, pm.x, pm.y - 0.03, pm.z, 0.4); } }
      else if (t < T.onPlate) { const P = cast.pho; if (P && P.ready) { P.group.updateWorldMatrix(true, true); const pm = f1PalmOn(P, 'Left', _f1A, 0.025);
        /* (on his palm; then slid off his fingers onto the plate: from where his palm is to its place on the plate, eased) */
        const s = keepSlide1(t, T);
        if (pm) f1Drop(g, lp(pm.x, ON_CLOTH.plate.x, s), lp(pm.y, CLOTH_Y + 0.018, s), lp(pm.z, ON_CLOTH.plate.z, s), 0.2 + 0.4 * c01((t - T.give) / 1.0)); } }
      else f1Drop(g, ON_CLOTH.plate.x, CLOTH_Y + 0.018, ON_CLOTH.plate.z, 0.6);
      const k = f1Env(t, T.onPlate + 0.15, T.turn - 0.4, 0.8, 0.8);
      /* (its dull red breathing slowly, at M3's pulse, 52 a minute: the pull, held still on the plate) */
      knotGlow1.q.position.set(g.position.x, g.position.y + 0.02, g.position.z); knotGlow1.m.opacity = 0.35 * k * (0.72 + 0.28 * Math.sin(Math.PI * 2 * t * 52 / 60)); knotGlow1.q.visible = k > 0.001;
    }
    /* the bowl in his hands (from the lift): the engine's own `bowl` pose (episode 4 chapter 4's holy water), the left palm
       under it, the right hand's fingertips at its rim; the bowl drawn in the hands' pass (kit.hold, his left hand), the
       one on the cloth hidden once it is lifted, which is out of the frame (under his teacher's face) */
    /* (the bowl in his hands as the play holds it, PLAY.md 2: stage.plan.BOWLHELD, so the film's last picture and the event's
       first are one; these numbers are the play's own of 27 Nov, used only if the stage does not hand them) */
    const HOLD1 = { bowl: { prop: 'handBowl', pos: [0.075, 0.035, -0.02], rot: [0, 0, 0], s: 0.62, play: 'BOWLHELD' }, bottle: { prop: 'handBottle', pos: [0.0, 0.03, 0.0], rot: [0, 0, 0], s: 1 } };
    const holdOf1 = (which) => { const H = HOLD1[which], P = H.play && S && S.plan && S.plan[H.play]; return P ? { prop: H.prop, pos: P.pos || H.pos, rot: P.rot || H.rot, s: P.s != null ? P.s : H.s } : H; };
    /* HOW HIGH HIS HANDS HOLD THE BOWL INTO THE PICTURE, by the shot (the hands' pass is the lens's: the bowl stands where
       the pose puts it in every shot). 1, the pose whole: the bowl in the picture's lower half, its water seen from above, as
       he looks down into it; BOWLDROP1, the pose whole lowered (the bowl at the picture's foot) where he looks
       at something across it: photographed 27 Nov, held at 1 it covered the packet on the plate as the cord was untied and
       his teacher's mouth as he watched it lifted. MEASURED the same evening (my scratch f1bowlk.mjs: the bowl's every point
       in a phone's picture by the share): its top edge stands at -0.61 of the picture's half-height at 0.1, -0.43 at 0.25,
       -0.07 at 0.55 (its brass side then filled the picture's lower half, photographed: a flat brown wall to the middle,
       the people's knees and the cloth's near half under it), +0.47 at 1; 30 cm across, it is wider than a phone's
       picture at any share. 0.25 put it there, but drew his hands only a quarter of the way to it: his right hand hung open
       over it, photographed. So the pose is held whole (both hands on the bowl, the right's fingertips at its rim) and the
       hands' root is lowered BOWLDROP1 m in the lens's frame (its top edge from +0.47 to about -0.43), the hands and the
       bowl one thing; raised to 0 as he looks down into it */
    const BOWLDROP1 = 0.24;
    function keepBowl1(t, T, api) {
      const lifted = t >= T.lift;
      const wb = things.holyBowl; if (wb) wb.visible = !lifted;
      /* (lifted into the picture's foot as he watches his teacher, raised as his look goes down into it, 26.4 to 33.4 s) */
      const up = smo(c01((t - T.lift - 0.4) / (T.wax - 2.0 - T.lift)));
      f1HandsHold(api, "bowl", lifted ? smo(c01((t - T.lift) / 1.2)) : 0, BOWLDROP1 * (1 - up));
      f1Water(t, T.wax, lifted ? 1 : 0);
    }
    /* WHAT HIS HANDS HOLD in a film (his left hand under it, drawn in the hands' pass: kit.hold; the engine's own pose for
       it at k: `bowl`, episode 4 chapter 4's holy water, the left palm under it; `bottle`, episode 3 chapter 5's, both hands
       round it). k 0 lets go and hides his hands */
    /* THE BOWL IN HIS HANDS, SET IN THE LENS'S OWN FRAME (27 Nov, MEASURED: at the play's BOWLHELD, laid in the left hand's
       frame, the bowl was drawn, two calls and 33,000 triangles, but below the picture's foot: in the hands' camera its box
       stood at a phone's x -1.69..0.36 and y -1.45..-0.67, so it was never seen, in the films or in the breaking. The
       hands' camera stands at its scene's origin looking -z, and kit.handPalm answers where a palm is in that frame). Its
       foot laid on his left palm (the engine's `bowl` pose holds the palm up, low in the middle of the picture), turned
       toward the lens by `tilt` about the lens's own across-line, so the water is seen from above as one sees it looking
       down into a bowl held before one: the hands' pass is the lens's, and a bowl upright in it is seen from its side */
    const BOWLCAM1 = { tilt: 0.75, lift: 0.01 };
    const _bwq = new THREE.Quaternion(), _bwq2 = new THREE.Quaternion(), _bwX = new THREE.Vector3(1, 0, 0), _bwU = new THREE.Vector3(), _bwM = new THREE.Matrix4();
    function bowlInHands1(g) {
      if (!g || !g.parent || !kit || !kit.handPalm) return false;
      const pm = kit.handPalm('left', new THREE.Vector3()); if (!pm) return false;
      _bwq.setFromAxisAngle(_bwX, BOWLCAM1.tilt); _bwU.set(0, 1, 0).applyQuaternion(_bwq);
      pm.addScaledVector(_bwU, BOWLCAM1.lift);
      g.parent.updateWorldMatrix(true, false);
      g.position.copy(pm.applyMatrix4(_bwM.copy(g.parent.matrixWorld).invert()));
      g.parent.getWorldQuaternion(_bwq2); g.quaternion.copy(_bwq2.invert().multiply(_bwq));
      return true;
    }
    function f1HandsHold(api, which, k, drop = 0) {
      if (!api) return;
      /* (the hands' root lowered `drop` m in the lens's frame while the bowl is held, else where the engine keeps it: a film
         from play draws the hands itself, and play's first frame sets the root again) */
      if (api.handsRoot) api.handsRoot.position.set(0, which === "bowl" && k > 0.001 ? -drop : 0, 0);
      if (k > 0.001 && which) {
        if (F1.held !== which) { if (F1.held && api.kit && api.kit.hold) api.kit.hold(null, { hand: 'left' });
          F1.held = which; const H = holdOf1(which); if (api.handsRoot) api.handsRoot.visible = true;
          PROPS1[H.prop].scale.setScalar(H.s || 1);
          if (api.kit && api.kit.hold) api.kit.hold(PROPS1[H.prop], { hand: 'left', pos: H.pos, rot: H.rot }); }
        if (api.handPose) api.handPose(which, k, { p: 0 });
        if (which === "bowl") bowlInHands1(PROPS1.handBowl);
      } else if (F1.held) { if (api.kit && api.kit.hold) api.kit.hold(null, { hand: 'left' }); if (api.handPose) api.handPose(F1.held, 0); F1.held = null; if (api.handsRoot) api.handsRoot.visible = false; }
    }
    /* the water in his bowl: the candle's warm point on it, still; a ring for each drop of wax (from `wax`), and the cord's
       one ring (ringAt) */
    /* THE WAX (the plan's 9.2, 32 to 42 s: "three drops of wax fall into the water, ripples"): each drop SEEN falling into
       the water in his hands, from above the picture where his teacher tilts the candle (a pale bead of wax and a short
       streak behind it, children of the held bowl, so they are drawn in the hands' pass with it), landing on the ring's own
       moment; the candle's warm glint on the water brightening and moving to the middle while the flame is over it. (27
       Nov: the first build's ripples came from nothing in the picture) */
    const waxMat1 = new THREE.MeshBasicMaterial({ color: 0xf6ecd2, transparent: true, opacity: 0, depthWrite: false }); mats.push(waxMat1);
    const waxDrop1 = new THREE.Mesh(new THREE.SphereGeometry(0.0055, 8, 6), waxMat1); waxDrop1.renderOrder = 4; owned.push(waxDrop1.geometry);
    const waxTail1 = new THREE.Mesh(new THREE.CylinderGeometry(0.0018, 0.0042, 0.05, 6, 1, true), waxMat1); waxTail1.renderOrder = 4; owned.push(waxTail1.geometry);
    const WAXFALL1 = 0.21;                                                       // (0.22 m of fall at g)
    function f1Water(t, wax, k, ringAt) {
      if (!PROPS1.bowlR) return;
      const g = PROPS1.handBowl, r = PROPS1.bowlR, c = ring1.position;
      /* (the candle over the water: the glint brightened and drawn to the middle while the drops fall) */
      const over = wax != null ? f1Env(t, wax - 0.9, wax + 3.6, 0.6, 0.7) : 0;
      glintMat1.opacity = (0.3 + 0.35 * over) * k;
      glint1.position.set(c.x - r * 0.25 * (1 - over), c.y + 0.002, c.z + r * 0.2 * (1 - over));
      let drop = -1;
      if (wax != null) for (const dt of [0, 1.5, 3.0]) { const u = (t - (wax + dt - WAXFALL1)) / WAXFALL1; if (u >= 0 && u < 1) drop = u; }
      if (drop >= 0 && g && k > 0.001) {
        if (waxDrop1.parent !== g) { g.add(waxDrop1); g.add(waxTail1); }
        /* (in the held bowl's own frame, which the hold scales by BOWLHELD.s: the fall and the bead's size in world metres) */
        const inv = 1 / Math.max(1e-6, g.scale.x), y = c.y + 0.22 * inv * (1 - drop * drop);
        waxDrop1.position.set(c.x + 0.012 * inv, y, c.z - 0.01 * inv); waxDrop1.scale.setScalar(inv);
        waxTail1.position.set(c.x + 0.012 * inv, y + 0.027 * inv, c.z - 0.01 * inv); waxTail1.scale.setScalar(inv);
        waxMat1.opacity = 0.95 * k;
      } else waxMat1.opacity = 0;
      let rk = 0, rs = 0.2;
      if (wax != null) for (const dt of [0, 1.5, 3.0]) { const d = t - wax - dt; if (d > 0 && d < 1.6) { rk = Math.max(rk, (1 - d / 1.6) * 0.8); rs = 0.15 + d * 0.5; } }
      if (ringAt != null) { const d = t - ringAt; if (d > 0 && d < 2.6) { rk = Math.max(rk, 0.85 * (1 - d / 2.6)); rs = 0.15 + 0.38 * c01(d / 2.6); } }
      ringMat1.opacity = rk * k; ring1.scale.setScalar(PROPS1.bowlR * rs);
    }
    function keepKeys1(T) {
      const eye = [HER.him.x, KNEEL_EYE, HER.him.z];
      const phoFace = () => f1Head(cast.pho, [0.5, 1.0, 1.87], 0.98);
      /* (her head where she is: seated, or standing to give it, a smooth function of the film's clock, never her living head) */
      const graceFace = () => f1Head(cast.grace, [0.42, 1.02, -0.32], keepGraceH1(F1.t, T));
      const handAt = [0.5, 0.64, 1.1];
      return [
        /* Pho's open hand across the cloth, his face: a slight push toward the hand */
        /* (a phone cannot hold his face and his hand from where he kneels: 41 degrees part them, and a phone sees 25 to 30. And
           from his side, his face as he asks her is a lost profile (photographed 27 Nov: the back of his head and his ear). So
           a phone holds HER, whom he asks, with his open hand reaching across the cloth into the picture toward her; a desk
           holds his face and his hand) */
        { t: 0, name: 'hand', eye, at: [0.62, 0.91, 1.32], fp: 52, fd: 50, hold: () => [[phoFace()[0], phoFace()[1] + 0.08, phoFace()[2], 0.12], [handAt[0], handAt[1], handAt[2], 0.1]], back: 0.45, fmax: 60,
          atP: () => { const g = graceFace(); return [lp(handAt[0], g[0], 0.58), lp(handAt[1], g[1] - 0.1, 0.58), lp(handAt[2], g[2], 0.58)]; },
          holdP: () => { const g = graceFace(); return [[g[0], g[1] + 0.04, g[2], 0.13], [handAt[0], handAt[1], handAt[2], 0.08]]; } },
        { t: T.bag - 0.6, name: 'hand', eye: [eye[0] - 0.08, eye[1], eye[2] - 0.05], at: [0.6, 0.85, 1.22], fp: 50, fd: 48, hold: () => [[phoFace()[0], phoFace()[1] + 0.08, phoFace()[2], 0.12], [handAt[0], handAt[1], handAt[2], 0.1]], back: 0.45, fmax: 60,
          atP: () => { const g = graceFace(); return [lp(handAt[0], g[0], 0.6), lp(handAt[1], g[1] - 0.1, 0.6), lp(handAt[2], g[2], 0.6)]; },
          holdP: () => { const g = graceFace(); return [[g[0], g[1] + 0.04, g[2], 0.13], [handAt[0], handAt[1], handAt[2], 0.08]]; } },
        /* across the table to her: her face, both hands, the packet */
        { t: T.bag - 0.05, name: 'grace', eye, at: () => { const g = graceFace(); return [g[0] + 0.08, g[1] - 0.52, g[2] + 0.35]; }, fp: 46, fd: 44, cut: true,
          hold: () => { const g = graceFace(); return [[g[0], g[1] + 0.04, g[2], 0.16], [HER.bag.x, HER.bag.y + 0.1, HER.bag.z, 0.12], [KEEPG1.meet[0], KEEPG1.meet[1], KEEPG1.meet[2] - 0.1, 0.12]]; }, back: 0.4, fmax: 56 },
        /* (photographed 27 Nov: on a phone her face and the two hands meeting over the table are 25 degrees apart, and the
           packet passing was out of the picture. So the look goes down to the hands as she holds it out, and stays on them
           as it is laid in his palm: the beat is seen on every screen) */
        { t: T.pull + 0.9, name: 'grace', eye, at: () => { const g = graceFace(); return [g[0] + 0.06, g[1] - 0.53, g[2] + 0.4]; }, fp: 46, fd: 44,
          hold: () => { const g = graceFace(); return [[g[0], g[1] + 0.04, g[2], 0.16], [KEEPG1.meet[0], KEEPG1.meet[1], KEEPG1.meet[2] - 0.1, 0.12]]; }, back: 0.4, fmax: 56 },
        { t: T.give - 0.9, name: 'hands', eye, at: [KEEPG1.meet[0], KEEPG1.meet[1] + 0.05, KEEPG1.meet[2] - 0.02], fp: 44, fd: 38, hold: [[KEEPG1.meet[0], KEEPG1.meet[1], KEEPG1.meet[2], 0.2]], back: 0.3, fmax: 56 },
        /* (and follows the packet in his palm as he draws it back to him, before the cut to the plate) */
        { t: T.give + 0.25, name: 'hands', eye, at: [KEEPG1.meet[0], KEEPG1.meet[1] + 0.05, KEEPG1.meet[2] - 0.02], fp: 44, fd: 38, hold: [[KEEPG1.meet[0], KEEPG1.meet[1], KEEPG1.meet[2], 0.2]], back: 0.3, fmax: 56 },
        { t: T.place - 0.15, name: 'hands', eye, at: [0.43, 0.7, 1.24], fp: 44, fd: 38, hold: [[0.43, 0.68, 1.24, 0.18]], back: 0.3, fmax: 56 },
        /* INSERT from above: the small white plate at the cloth's far corner, the packet and its red knot */
        /* (from the side away from his teacher: 27 Nov, the plate was moved within his reach, 0.75 m before his cushion, and
           an eye on his side of it would stand where his head comes down to it) */
        { t: T.place - 0.1, name: 'plate', eye: [ON_CLOTH.plate.x + 0.25, CLOTH_Y + 0.72, ON_CLOTH.plate.z - 0.3], at: [ON_CLOTH.plate.x, CLOTH_Y, ON_CLOTH.plate.z], fp: 40, fd: 34, cut: true },
        { t: T.turn - 0.05, name: 'plate', eye: [ON_CLOTH.plate.x + 0.24, CLOTH_Y + 0.66, ON_CLOTH.plate.z - 0.28], at: [ON_CLOTH.plate.x, CLOTH_Y, ON_CLOTH.plate.z], fp: 38, fd: 32 },
        /* his eyes: his teacher turns to him, looking into the lens; the bowl rises into the frame in his hands */
        { t: T.turn, name: 'pho', eye, at: () => { const f = phoFace(); return [f[0], f[1] - 0.1, f[2]]; }, fp: 52, fd: 44, cut: true },
        /* (the bowl rises in his hands over the picture's lower half, drawn over the world: photographed 27 Nov, its rim crossed
           his teacher's mouth. The look goes a little lower, so his face stands above the rim as he watches it lifted) */
        { t: T.lift + 0.4, name: 'pho', eye, at: () => { const f = phoFace(); return [f[0] + 0.15, f[1] - 0.42, f[2] - 0.05]; }, fp: 52, fd: 44 },
        /* INSERT, his eyes looking down into the bowl in his hands: the candle tilted over it, three drops of wax */
        { t: T.wax - 1.6, name: "bowl", eye, yaw: STATION.room.at.ry, pitch: -0.98, fp: 36, fd: 30 },
        { t: T.end - 1.6, name: "bowl", eye, yaw: STATION.room.at.ry, pitch: -0.98, fp: 36, fd: 30 },
        /* (the lens opens to the event's own as its brief comes up: the breaking begins on this view) */
        { t: T.end - 0.05, name: "bowl", eye, yaw: STATION.room.at.ry, pitch: -0.95, fp: 50, fd: 44 }
      ];
    }

    /* ================================================================ THE CORD (the plan's 9.3; its clock CD51). From the
       breaking. The bowl still in his hands; his teacher's fingers on the packet's red cord, untying it as he chants. THE LAST
       STRAND SNAPS BY ITSELF, in slow motion (the story's clock at 0.35 for four seconds of the film's), Spirit Vision opened
       by the film for three: a wisp of red leaps from the cord across the table and slips round his wrist under the bowl, a
       faint red ring there for an instant, gone; one ring spreads across the water; still again. Grace breathes out and
       cries; Marcus kneels beside her; his teacher's "It's alright"; her phone on the cloth lights up, and she turns it face
       down; the packet bound in white; his teacher's words to her and to Marcus; the water poured into the small bottle,
       given to him; his look at his own wrist, where nothing is. Black (home follows) */
    /* THE SLOW (the plan's 4.4: once in play's story, on the film's own clock): the story's clock runs at 0.35 of the film's
       from SL0, eased into and out of it over a third of a second each way, so no speed steps; every picture of the snap reads
       the story's clock; the sounds are on the film's (they are what is heard as it happens) */
    const CORD_SLOW1 = { a: 8.0, b: 12.0, k: 0.35, ramp: 0.3 };
    function cordTau1(t) {
      const { a, b, k, ramp } = CORD_SLOW1;
      /* the story's clock is the integral of a speed that eases from 1 to k over [a, a + ramp] and back over [b - ramp, b] */
      const seg = (x0, x1, v0, v1, x) => { const u = c01((x - x0) / (x1 - x0)), L = x1 - x0; return L * (v0 * u + (v1 - v0) * (u * u * u - 0.5 * u * u * u * u)); };
      if (t <= a) return t;
      let tau = a + seg(a, a + ramp, 1, k, Math.min(t, a + ramp));
      if (t <= a + ramp) return tau;
      tau += k * (Math.min(t, b - ramp) - (a + ramp));
      if (t <= b - ramp) return tau;
      tau += seg(b - ramp, b, k, 1, Math.min(t, b));
      if (t <= b) return tau;
      return tau + (t - b);
    }
    FILMS1.cord = {
      begin(api, s) { F1.s = s; F1.lit = ''; F1.film = 'cord'; F1.api = api; F1.hands = false;
        if (api && api.handsRoot) api.handsRoot.visible = false;
        f1Show(cast.pho, true); f1Show(cast.grace, true); f1Show(cast.marcus, true); f1Show(phoStand, false);
        if (things.holyBowl) things.holyBowl.visible = false; },
      frame(t) {
        const T = CD51, api = F1.api, tau = cordTau1(t); F1.t = t;
        f1Look('LAMP'); f1Beds({ flat: 1 - smo(c01((t - T.black) / 1.2)), m2: (1 - smo(c01((t - T.black) / 1.2))) * smo(c01((t - T.snap - 1.9) / 2.2)), m3: 0.5 * f1Env(t, T.wrist + 0.9, T.wrist + 2.6, 0.5, 1.0) });
        WORLD.cloth(1); WORLD.candleLit('candle1', true);
        /* Spirit Vision: the film opens it as the strand snaps, for three seconds of the film's (its 8 to 11), then home */
        f1Vision(t, T.snap - 0.05, 0.45, T.snap + 2.6, 1.4);
        cordPho1(t, T); cordGrace1(t, T, t); cordMarcus1(t, T); cordPacket1(t, T, t); cordWisp1(t, tau, T);
        /* the bowl in his hands until he hands it to his teacher to pour (44 s); then nothing; then the bottle */
        /* (at the picture's foot below the packet and the people across the table, BOWLDROP1; his hands hidden in the two
           inserts that are not his eyes, from behind her shoulder and from above the plate) */
        const notHim = t >= T.phone && t < T.c3 - 0.3;
        if (t < T.pour + 0.9) { const kb = t < T.pour + 0.2 ? 1 : 1 - smo(c01((t - T.pour - 0.2) / 0.7)); f1HandsHold(api, "bowl", kb, BOWLDROP1); f1Water(t, null, kb, T.snap + 0.55);
          if (api && api.handsRoot) api.handsRoot.visible = !notHim; }
        else if (t < T.take) f1HandsHold(api, null, 0);
        else f1HandsHold(api, 'bottle', smo(c01((t - T.take) / 0.7)));
        cordBottle1(t, T, api);
        f1Track(t, cordKeys1(T));
        /* (the breath of a held shot as he holds the bowl: a slight sway, a smooth function of the clock) */
        if (t < T.cry) { yaw.position.x += 0.004 * Math.sin(t * 0.9); yaw.position.y += 0.003 * Math.sin(t * 1.3 + 0.7); }
        f1Levels();
      },
      end() { f1Lens(PLAYFOV1); f1VisionOff(); F1.beds = null; F1.film = ''; wispG1.visible = false; wristMat1.opacity = 0;
        if (wristRing1.parent) wristRing1.parent.remove(wristRing1);
        f1HandsHold(F1.api, null, 0); glintMat1.opacity = 0; ringMat1.opacity = 0; if (things.holyBowl) things.holyBowl.visible = true; F1.api = null;
        PROPS1.clothBottle.visible = false; if (PROPS1.pourBowl) PROPS1.pourBowl.visible = false; if (PROPS1.spool) PROPS1.spool.visible = false; if (things.bottle) things.bottle.visible = false; f1LeanBack(cast.pho);
        { const ph = herPhone1(); if (ph && F1.phoneRy != null) ph.rotation.set(0, F1.phoneRy, 0); F1.phoneRy = null; phoneLit1.m.opacity = 0; phoneLit1.q.visible = false; }
        }
    };
    function cordPho1(tau, T) {
      const P = cast.pho; if (!P || !P.ready) return;
      f1LeanBack(P);
      const st = STATION.room.pho; put(P, st.x, st.z, st.ry, (P.home && P.home.y) || 0.12);
      f1Speak(P, tau, ['Sit_to_Stand_Transition_M', 0.02, 0, false], [[T.c1, SECS.ph51c1, 'Sitting_Answering_Questions', 0.6], [T.c2, SECS.ph51c2, 'Sitting_Answering_Questions', 0.6], [T.c3, SECS.ph51c3, 'Sitting_Answering_Questions', 0.6], [T.c4, T.c5 + SECS.ph51c5 - T.c4, 'Sitting_Answering_Questions', 0.5]]);
      const pk = [ON_CLOTH.plate.x, CLOTH_Y + 0.04, ON_CLOTH.plate.z];
      /* both hands at the packet on the plate at his left, untying the red cord as he chants (to the snap); again to wrap it in
         white and bind it (32 to 44 s); his right hand to take the bowl from him (44 s), the bottle filled and corked on the
         cloth, then held out to him (47 s) */
      const untie = f1Env(tau, 0, T.snap + 0.25, 0.2, 0.25), bind = f1Env(tau, T.wrap - 0.6, T.pour - 0.4, 0.6, 0.6), work = Math.min(1, untie + bind);
      /* (his shoulders turned to his student, a third of a right angle, to take the bowl from him and to hold the bottle out to
         him, square to the cloth for the pour and the cork between: his look to him goes the rest) */
      const toHim = Math.max(f1Env(tau, T.pour - 0.9, T.pour + 1.0, 0.6, 0.6), f1Env(tau, T.give - 0.5, T.end + 9, 0.9, 0.5));
      /* (bent over the packet as he works it: measured 27 Nov, seated and leaning half a radian his hands reach about 0.6 m
         out from his cushion, and the plate stands 1.0 m from it (ON_CLOTH.plate: a layout call put to WORLD, the report); at
         0.65 rad his hands reach the place it is asked to move to) */
      /* (and his shoulders turned a little to his left, to it: 27 Nov, photographed, at 0.65 rad square to the cloth his right
         hand fell short of the packet and hung by the incense) */
      f1Lean(P, 0.75 * work + 0.22 * f1Env(tau, T.pour - 0.3, T.take + 0.8, 0.6, 0.7), -0.5 * toHim + 0.3 * work);
      /* (each palm placed so its fingertips, about 9.5 cm on along the fingers, come to the packet's top at its near corners:
         27 Nov, with the plate moved within his reach, palms 7 and 17 cm from the packet put his left fingertips 1.7 cm down
         into the plate and his right ones on the cloth 13 cm from the knot) */
      /* (and the palms DOWN over it, toward him, as hands that pick at a knot and bind: 27 Nov, photographed from above, the
         palm faced up and away, a hand held open over the packet; clipscan: the fingertips 1 to 2 cm into the packet) */
      if (work > 0.001) { const w = 0.012 * Math.sin(tau * 7.3);
        handTo(P, 'L', [pk[0] + 0.0 + w, pk[1] + 0.088, pk[2] + 0.08], [-0.2, -0.7, -0.6], [0.1, -0.65, 0.75], work, { out: 0.22, down: 0.25 });
        handTo(P, 'R', [pk[0] + 0.076 - w, pk[1] + 0.089, pk[2] + 0.056], [-0.5, -0.7, -0.4], [0.25, -0.6, 0.75], work, { out: 0.22, down: 0.25 }); }
      /* THE POUR (27 Nov: the first build set the bowl back on the cloth untouched and laid his hand on the bottle while the
         pour was heard): his right hand takes the bowl from his student, carries it by its rim over the bottle standing on
         the cloth before him, tilts it and pours, and sets it down at its place; his left hand steadies the bottle the while;
         then his right hand corks it (POUR1, cordBowl1 carries the bowl where the hand is) */
      const pr = pourAt1(tau, T);
      /* (his hand on the bowl's near rim: the fingers over it and down inside, the palm to the bowl, turned to the bottle.
         27 Nov, photographed: palm up, his hand lay flat over the water) */
      if (pr.k > 0.001) { const dx = CB1.x - pr.hand[0], dz = CB1.z - pr.hand[2], L = Math.max(1e-3, Math.hypot(dx, dz)), ux = dx / L, uz = dz / L;
        handTo(P, 'R', pr.hand, [0.3 * ux, -0.95, 0.3 * uz], [ux, 0.1, uz], pr.k, { out: 0.24, down: 0.25 }); }
      const steady = f1Env(tau, T.pour + 0.85, T.pour + 3.55, 0.4, 0.3);
      /* (his palm against the bottle's side, his fingers round its front: 27 Nov, clipscan, 3.5 cm off its middle his fingers
         went through it, 287 crossings) */
      if (steady > 0.001) handTo(P, 'L', [CB1.x - 0.05, CLOTH_Y + 0.07, CB1.z + 0.02], [0.2, -0.3, -0.9], [1, 0.1, 0.1], steady, { out: 0.22, down: 0.28 });
      const cork = f1Env(tau, T.pour + 3.0, T.pour + 3.6, 0.25, 0.2);
      if (cork > 0.001) handTo(P, 'R', [CB1.x + 0.005, CLOTH_Y + 0.17, CB1.z + 0.01], [-0.1, -0.9, -0.3], [0.2, 0.2, 0.95], cork, { out: 0.24, down: 0.25 });
      const give = f1Env(tau, T.give, T.take + 0.7, 0.9, 0.6);
      /* (the bottle held out to him on his palm, his fingers along his forearm's line toward him: measured 27 Nov, the fingers
         turned to his side bent his wrist back 105 degrees, past a real wrist's 70) */
      /* (held out at GIVE1, on the line from his eyes to his teacher's face and below it, so one picture holds the face and
         the bottle and his hands rise to it there: 27 Nov, held out to 1.04, 0.74, 1.62 it stood 34 degrees off his look, out
         of a phone's picture) */
      if (give > 0.001) { const g = smo(c01((tau - T.give) / 0.9)); handTo(P, 'R', [lp(CB1.x, GIVE1[0], g), lp(CLOTH_Y + 0.12, GIVE1[1], g), lp(CB1.z, GIVE1[2], g)], [0.75, -0.2, -0.1], [0, 1, 0.2], give, { out: 0.25, down: 0.25 }); }
      f1Gaze(P, tau, [[0, pk], [T.snap + 1.0, () => f1Head(cast.grace, [0.42, 1.02, -0.32], GRACE_HEAD_SEATED), 1.0], [T.wrap - 0.4, pk, 0.7], [T.c2 + 0.2, () => f1Head(cast.grace, [0.42, 1.02, -0.32], GRACE_HEAD_SEATED), 0.7], [T.c3, () => f1Head(cast.marcus, [KEEP1.mkStand.x, 1.6, KEEP1.mkStand.z], 1.6), 0.8], [T.pour - 0.4, 'lens', 0.8], [T.pour + 1.0, [CB1.x, CLOTH_Y + 0.05, CB1.z], 0.6], [T.give, 'lens', 0.8]], 0.85, 0.75, 0.03);
    }
    function cordGrace1(tau, T, t) {
      const P = cast.grace; if (!P || !P.ready) return;
      const st = STATION.room.grace; put(P, st.x, st.z, st.ry, (P.home && P.home.y) || 0);
      /* her long breath out, then quiet crying, her hands over her face (her written take's EARLY window only: its later fold
         to her knees is far more than the plan's "cries quietly": people/RECORD.md 4); her phone; her small thank you */
      if (P.acts.gcry && tau >= T.cry) { const u = c01((tau - T.cry) / 2.2); pose(P, 'gcry', lp(0.0, 1.6, smo(u)) + 0.05 * Math.sin(tau * 1.7) * u, false); }
      else { const tk = P.acts.gsofa ? 'gsofa' : P.acts.wsit ? 'wsit' : 'Idle_3'; pose(P, tk, tk === 'gsofa' ? 0.3 : 0.8, false); }
      const face = f1Env(tau, T.cry + 1.0, T.phone - 0.3, 0.9, 0.6);
      if (face > 0.001) { const h = P.head; if (h) { P.group.updateWorldMatrix(true, true); h.getWorldPosition(_f1A); const fw = new THREE.Vector3(0, 0, 1).applyQuaternion(P.group.quaternion);
        /* (rt is her right: her left hand to her left of her face, her right to her right. 27 Nov, photographed: given the
           other way they crossed at the wrists before her chest, palms out) */
        for (const [sd, sx] of [['L', -0.05], ['R', 0.05]]) { const rt = new THREE.Vector3(-fw.z, 0, fw.x); const at = _f1A.clone().addScaledVector(fw, 0.11).addScaledVector(rt, sx); at.y -= 0.02;
          handTo(P, sd, [at.x, at.y, at.z], [rt.x * -sx * 4, 1, rt.z * -sx * 4], [-fw.x, 0, -fw.z], face, { out: 0.12, down: 0.35 }); } } }
      const ph = f1Env(tau, T.phone + 1.6, T.phone + 4.2, 0.8, 0.8);
      if (ph > 0.001) handTo(P, 'R', [GRPHONE1.x, GRPHONE1.y + 0.04, GRPHONE1.z], [-0.3, -0.6, 0.6], [0, -1, 0], ph, { out: 0.2, down: 0.3 });
      f1Gaze(P, tau, [[0, [ON_CLOTH.plate.x, CLOTH_Y, ON_CLOTH.plate.z]], [T.cry, [0.4, 0.5, 0.4], 1.2], [T.phone + 0.3, () => [GRPHONE1.x, GRPHONE1.y, GRPHONE1.z], 0.6], [T.c2, () => f1Head(cast.pho, [0.5, 1.0, 1.87], 0.95), 0.8], [T.g1 - 0.2, () => f1Head(cast.pho, [0.5, 1.0, 1.87], 0.95), 0.5]], 0.8, 0.75, 0.05);
    }
    /* her phone: the play's own, on the sofa beside her (PLAY.md 4: things.herPhone), lit by his message; face down after */
    const phoneLit1 = glow(0, -50, 0, 0.1, 0xd8e8ff, 0, world, null);
    const herPhone1 = () => things.herPhone || PROPS1.grPhone;
    const GRPHONE1 = { get x() { const g = herPhone1(); return g ? g.position.x : 0.09; }, get z() { const g = herPhone1(); return g ? g.position.z : -0.22; }, get y() { const g = herPhone1(); return g ? g.position.y : 0.51; } };
    const CORDMK1 = { x: -0.05, z: 0.40, to: [0.36, -0.02], head: [-0.02, 1.0, 0.36] };
    function cordMarcus1(tau, T) {
      const P = cast.marcus; if (!P || !P.ready) return;
      /* (he knelt beside her as the cord snapped: the insert cannot see him; seen from 12 s, on one knee at her right, in
         front of the sofa, turned to her knees, his raised hands (the take's, 0.7 m up) by her right knee. 27 Nov, clipscan:
         at 0.12, 0.15 turned to her middle he knelt into her legs (2,000 to 3,800 crossings), the sofa's front (1,900) and
         her phone on the cushion) */
      const M = CORDMK1;
      if (P.acts.kneelhold && tau < T.c3 - 0.8) { put(P, M.x, M.z, faceTo(M.x, M.z, M.to[0], M.to[1]), 0); pose(P, 'kneelhold', 1.4 + 0.25 * Math.sin(tau * 0.6), false); }
      else { const K = KEEP1.mkStand; put(P, K.x, K.z, K.ry, 0); f1Speak(P, tau, ['Idle_3', 1.2, 0.3, true], [[T.m1, SECS.mk51c1, 'Stand_and_Chat', 0.55]]); }
      f1Gaze(P, tau, [[0, () => f1Head(cast.grace, [0.42, 1.02, -0.32], GRACE_HEAD_SEATED)], [T.c3 - 0.2, () => f1Head(cast.pho, [0.5, 1.0, 1.87], 0.95), 0.8]], 0.8, 0.75, 0.04);
    }
    function cordPacket1(tau, T, t) {
      const g = things.keepsake; if (!g) return;
      f1Drop(g, ON_CLOTH.plate.x, CLOTH_Y + 0.018, ON_CLOTH.plate.z, 0.6);
      /* (bound in white from 32 s: the knot's glow gone at the snap; the cloth folded over it is the play's last state) */
      const k = 1 - smo(c01((tau - T.snap) / 0.25));
      knotGlow1.q.position.set(g.position.x, g.position.y + 0.02, g.position.z); knotGlow1.m.opacity = 0.4 * k * (t < T.snap + 0.3 ? 1 : 0); knotGlow1.q.visible = knotGlow1.m.opacity > 0.001;
      /* her phone: lit while it buzzes (24 to 27 s), then turned face down by her hand (27 s), its screen to the sofa */
      const ph = herPhone1(); if (ph) { if (F1.phoneRy == null) F1.phoneRy = ph.rotation.y;
        const down = smo(c01((tau - T.phone - 2.75) / 0.45)); ph.rotation.set(Math.PI * down, F1.phoneRy, 0); ph.visible = true;
        const lit = tau > T.phone - 0.05 && tau < T.phone + 2.8 ? 1 : 0; phoneLit1.q.position.set(ph.position.x, ph.position.y + 0.02, ph.position.z); phoneLit1.m.opacity = 0.55 * lit; phoneLit1.q.visible = lit > 0; }
    }
    /* THE WISP: from the knot, a leap across the table that curls round under the bowl to his left wrist (where the hands'
       pass draws it: its end is a point of his own frame, carried into the world each frame), its tail fading behind it */
    const _wA = new THREE.Vector3(), _wB = new THREE.Vector3(), _wC = new THREE.Vector3(), _wP = new THREE.Vector3();
    /* (the wisp's end: his left wrist where the hands' pass DRAWS it (its own lens, 52 degrees at its origin: kit.handPalm,
       the wrist a little under the palm), carried to the same place on the screen half a metre before the world's lens, and
       kept above the picture's lower bar so it is seen to reach him. 27 Nov: a point of the lens's frame taken as the
       world's, (-0.1, -0.24, -0.34), stood below a phone's picture, and his wrist under the bowl at the picture's foot is
       below it too) */
    function wispEnd1(out) {
      const pm = kit && kit.handPalm ? kit.handPalm('left', _wP) : null, asp = camera.aspect, tv = Math.tan(26 * Math.PI / 180);
      let nx = 0, ny = -0.9;
      if (pm && pm.z < -0.05) { nx = pm.x / (-pm.z * tv * asp); ny = (pm.y - 0.05) / (-pm.z * tv); }
      nx = Math.max(-0.85, Math.min(0.85, nx)); ny = Math.max(-0.72, Math.min(0.5, ny));
      const D = 0.5, tw = Math.tan(camera.fov / 2 * Math.PI / 180);
      return out.set(nx * tw * asp * D, ny * tw * D, -D).applyMatrix4(camera.matrixWorld);
    }
    function cordWisp1(t, tau, T) {
      const u0 = tau - (T.snap + 0.05), dur = 0.42;
      const on = u0 > -0.01 && u0 < dur + 0.5;
      wispG1.visible = on;
      if (on) {
        _wA.set(ON_CLOTH.plate.x, CLOTH_Y + 0.05, ON_CLOTH.plate.z);
        camera.updateMatrixWorld(true); wispEnd1(_wB);   // his left wrist under the bowl, where the hands' pass draws it
        _wC.copy(_wA).lerp(_wB, 0.5); _wC.y += 0.16;
        const head = c01(u0 / dur);
        for (let i = 0; i < wisp1.length; i++) { const s = head - i * 0.035, sp = wisp1[i];
          if (s < 0 || s > 1) { sp.visible = false; continue; }
          const a = 1 - s, p = new THREE.Vector3().copy(_wA).multiplyScalar(a * a).addScaledVector(_wC, 2 * a * s).addScaledVector(_wB, s * s);
          const swirl = 0.03 * Math.sin(s * 9 + tau * 5); p.x += swirl * (1 - s); p.z += swirl * 0.6;
          sp.position.copy(p); const fade = (1 - i / wisp1.length) * (u0 > dur ? Math.max(0, 1 - (u0 - dur) / 0.5) : 1);
          sp.material.opacity = 0.75 * fade; sp.scale.setScalar(0.05 * (1 - 0.5 * i / wisp1.length) * (0.6 + 0.4 * s)); sp.visible = true; }
      }
      /* the ring round his wrist for an instant (drawn in the hands' pass, on his left arm) */
      const api = F1.api, arm = api && api.prayerArm ? api.prayerArm() : null, d = tau - (T.snap + 0.05 + dur);
      const k = d > -0.05 && d < 0.75 ? (d < 0.08 ? c01((d + 0.05) / 0.13) : 1 - c01((d - 0.08) / 0.67)) : 0;
      if (arm && k > 0.001) { if (wristRing1.parent !== arm) arm.add(wristRing1); wristRing1.position.set(0.0, 0.0, 0.06); wristRing1.rotation.set(Math.PI / 2, 0, 0); wristRing1.scale.setScalar(0.075); wristMat1.opacity = 0.8 * k; }
      else wristMat1.opacity = 0;
    }
    /* THE BOTTLE (on the cloth by his teacher's right knee): filled and corked there, held out to him, taken into his hands;
       THE BOWL back on the cloth once his teacher has it; THE SPOOL of white thread out for the binding, the packet's cloth
       wrapped white as the hands work (a white wrap over the red: the knot's red is covered) */
    /* (the bottle on the cloth before him, at his left of the bowl, between the lit candle and the incense: his right hand
       pours over it from his right, his left hand steadies it without crossing his body) */
    const CB1 = { x: 0.36, z: 1.25 };
    const GIVE1 = [0.95, 0.80, 1.88];
    const POUR1 = { take: [1.06, 0.76, 1.58], tilt: 0.85 };
    /* where his right hand is in the pour, and how far into it (k): the student's bowl taken (pour - 0.3 to + 0.9), carried
       over the bottle (+0.9 to +1.4), tilted (+1.4 to +2.6), set down at its place on the cloth (+2.6 to +3.0), let go */
    function pourAt1(t, T) {
      const P0 = T.pour, B = [CB1.x + 0.075, CLOTH_Y + 0.25, CB1.z + 0.035], C = [ON_CLOTH.bowl.x + 0.06, CLOTH_Y + (BOWL1.H || 0.08) + 0.02, ON_CLOTH.bowl.z + 0.08];
      const k = smo(c01((t - P0 + 0.3) / 0.6)) * (1 - smo(c01((t - P0 - 2.95) / 0.25)));
      const u1 = smo(c01((t - P0 - 0.9) / 0.5)), u2 = smo(c01((t - P0 - 2.6) / 0.4));
      /* (set down along an arc toward the table's middle and up: straight, its rim went through the incense sticks, 27 Nov) */
      const h = lp3(lp3(POUR1.take, B, u1), C, u2), arc = Math.sin(Math.PI * u2);
      h[1] += 0.06 * arc + 0.1 * Math.sin(Math.PI * u1) * (1 - u2); h[2] -= 0.14 * arc;   // (and lifted as it is carried over: the sticks stand 0.24 m)
      return { k, hand: h, carry: t >= P0 + 0.9 && t < P0 + 3.0, tilt: POUR1.tilt * f1Env(t, P0 + 1.35, P0 + 2.65, 0.35, 0.3), down: t >= P0 + 3.0 };
    }
    PROPS1.spool = stand('w51threadreel', 0, -50, 0, 0, { parent: world }); PROPS1.spool.visible = false;
    /* the bowl in his teacher's right hand through the pour: a copy of it (the play's own, things.holyBowl, keeps its place
       on the cloth and its glint: PLAY.md 4), painted as the play paints it, hung from his palm by its near rim, turned about
       that rim to pour toward the bottle, then eased onto the play's bowl's own place and turn, where the play's is shown
       again and the copy goes */
    const _f1pb = new THREE.Vector3(), _f1pq = new THREE.Quaternion(), _f1pa = new THREE.Vector3(), _f1pr = new THREE.Vector3(), _f1pw = new THREE.Vector3(), _f1pwq = new THREE.Quaternion();
    const BOWL1 = { R: 0, H: 0 };
    PROPS1.pourBowl = stand('w4bigbowl', 0, -50, 0, 0, { parent: world, lift: 3 }); PROPS1.pourBowl.visible = false;
    whenThing1(PROPS1.pourBowl, (g, m) => { if (S && S.plan && S.plan.bowlLook) S.plan.bowlLook(m, { empty: { value: 0 } });
      else m.traverse(q => { if (!q.isMesh) return; for (const mt of [].concat(q.material)) if (mt && mt.color) mt.color.multiply(new THREE.Color(0xffd9a0)); });
      g.rotation.set(0, 0, 0); g.position.set(0, -50, 0); g.updateWorldMatrix(true, true);
      const bb = new THREE.Box3().setFromObject(m); BOWL1.R = Math.max(0.04, (bb.max.x - bb.min.x + bb.max.z - bb.min.z) / 4); BOWL1.H = Math.max(0.02, bb.max.y - bb.min.y); });
    function cordBowl1(t, T) {
      const W = things.holyBowl, g = PROPS1.pourBowl, pr = pourAt1(t, T), P = cast.pho;
      const set = t >= T.pour + 3.0, held = t >= T.pour + 0.9 && !set;
      /* (the bowl the size it was in his hands, holdOf1("bowl").s of the cloth's, from his hands to his teacher's and set
         down at the cloth's bowl's place, where it stays to the film's end; the cloth's own, the larger, is hidden till then
         (end() shows it again). 27 Nov, photographed: at the cloth's size it was 0.45 m across in one of his hands) */
      const sc = holdOf1("bowl").s || 1;
      if (W) W.visible = false;
      if (!g) return;
      g.visible = (held || set) && !!g.userData.model && BOWL1.R > 0;
      if (!g.visible || !P || !P.ready) return;
      P.group.updateWorldMatrix(true, true); const pm = f1PalmOn(P, 'Right', _f1pb, 0); if (!pm) { g.visible = false; if (W) W.visible = true; return; }
      /* (the pour's direction: from his hand toward the bottle's mouth; the bowl's near rim under his fingers, 2 cm below the
         palm's middle, the bowl beyond it, turned about the level line across that direction, so its far rim dips to the
         bottle) */
      const dx = CB1.x - pm.x, dz = CB1.z - pm.z, L = Math.max(1e-3, Math.hypot(dx, dz)), ux = dx / L, uz = dz / L;
      _f1pq.setFromAxisAngle(_f1pa.set(uz, 0, -ux), pr.tilt);
      _f1pr.set(-BOWL1.R * sc * ux, BOWL1.H * sc, -BOWL1.R * sc * uz).applyQuaternion(_f1pq);
      g.position.set(pm.x - _f1pr.x, pm.y - 0.02 - _f1pr.y, pm.z - _f1pr.z); g.quaternion.copy(_f1pq); g.scale.setScalar(sc);
      /* (set down: eased onto the play's bowl's own place and turn over the last 0.4 s) */
      const u = smo(c01((t - T.pour - 2.6) / 0.4));
      if (u > 0 && W) { W.updateWorldMatrix(true, false); W.getWorldPosition(_f1pw); W.getWorldQuaternion(_f1pwq); g.position.lerp(_f1pw, u); g.quaternion.slerp(_f1pwq, u); }
    }
    function cordBottle1(t, T, api) {
      const b = PROPS1.clothBottle;
      cordBowl1(t, T);
      if (b) { const on = t >= T.pour + 0.9 && t < T.take + 0.2;
        if (on) { if (t < T.give) { f1Drop(b, CB1.x, CLOTH_Y, CB1.z, 0); }
          else { const P = cast.pho; if (P && P.ready) { P.group.updateWorldMatrix(true, true); const pm = f1PalmOn(P, 'Right', _f1A, 0.012); if (pm) f1Drop(b, pm.x, pm.y, pm.z, 0); } } }   // (stood on his palm held out: his seated body has no finger bones, and at f1Palm it stood 5 cm under his wrist)
        b.visible = on; }
      const sp = PROPS1.spool; if (sp) { const on = t >= T.wrap - 0.3 && t < T.pour; if (on) f1Drop(sp, ON_CLOTH.plate.x + 0.2, CLOTH_Y, ON_CLOTH.plate.z - 0.06, 0.4); sp.visible = on; }
    }
    /* (the packet wrapped in white cloth and bound: there is no model of it wrapped yet, so the insert shows his teacher's
       hands binding it with the white thread from the spool, the packet as it is: FILMS.md lists the model needed) */
    function knotWhite1() {}
    function cordKeys1(T) {
      const eye = [HER.him.x, KNEEL_EYE, HER.him.z];
      const pk = [ON_CLOTH.plate.x, CLOTH_Y + 0.03, ON_CLOTH.plate.z];
      const graceFace = () => f1Head(cast.grace, [0.42, 1.02, -0.32], GRACE_HEAD_SEATED);
      const mkHead = () => f1Head(cast.marcus, [KEEP1.mkStand.x, 1.6, KEEP1.mkStand.z], 1.6);
      const phoAt = (dx, dy) => { const f = f1Head(cast.pho, [0.5, 1.0, 1.87], 0.95); return [f[0] + dx, f[1] + dy, f[2] - 0.05]; };
      const UNTIE1 = [eye[0] - 0.14, eye[1] + 0.15, eye[2] - 0.20];
      const POURAT1 = [CB1.x + 0.03, CLOTH_Y + 0.15, CB1.z + 0.01];
      return [
        /* INSERT from above (his eyes looking down): his hands and the bowl at the picture's foot, the packet in its middle */
        /* (kneeling up and leaning in to watch it: 27 Nov, with the plate moved, from where he kneels the incense stood 2 cm
           off his line to the packet and its sticks 2 cm over it, across the packet in the picture; from here they stand 5 cm
           aside and 4 cm under it) */
        { t: 0, name: 'cord', eye: UNTIE1, at: [lp(pk[0], UNTIE1[0] - 0.24, 0.35), pk[1] + 0.02, lp(pk[2], UNTIE1[2] - 0.16, 0.35)], fp: 38, fd: 32 },
        { t: T.snap - 0.2, name: 'cord', eye: UNTIE1, at: [lp(pk[0], UNTIE1[0] - 0.24, 0.33), pk[1] + 0.02, lp(pk[2], UNTIE1[2] - 0.16, 0.33)], fp: 38, fd: 32 },
        /* (the lens narrows across the slow: a smooth function of the film's clock) */
        { t: T.cry - 0.05, name: 'cord', eye: UNTIE1, at: [lp(pk[0], UNTIE1[0] - 0.24, 0.33), pk[1] + 0.02, lp(pk[2], UNTIE1[2] - 0.16, 0.33)], fp: 32, fd: 27 },
        /* his eyes across the table: Grace and Marcus kneeling beside her */
        { t: T.cry, name: 'grace', eye, at: () => { const g = graceFace(); return [g[0] - 0.05, g[1] - 0.5, g[2] + 0.3]; }, fp: 46, fd: 40, cut: true,
          hold: () => { const g = graceFace(); return [[g[0], g[1] + 0.04, g[2], 0.16], [CORDMK1.head[0], CORDMK1.head[1], CORDMK1.head[2], 0.18]]; }, back: 0.45, fmax: 58 },
        { t: T.phone - 0.05, name: 'grace', eye, at: () => { const g = graceFace(); return [g[0] - 0.03, g[1] - 0.52, g[2] + 0.32]; }, fp: 46, fd: 40,
          hold: () => { const g = graceFace(); return [[g[0], g[1] + 0.04, g[2], 0.16], [CORDMK1.head[0], CORDMK1.head[1], CORDMK1.head[2], 0.18]]; }, back: 0.45, fmax: 58 },
        /* INSERT: her phone on the cushion beside her, her right hand turning it face down: from above and behind her right
           shoulder, over the sofa's back (Marcus kneels before the sofa then, so its back is free; the first build stood this
           lens between her face and his, 0.4 m from his head and 0.5 m from hers) */
        { t: T.phone, name: 'phone', eye: () => [GRPHONE1.x - 0.12, GRPHONE1.y + 0.86, GRPHONE1.z - 0.56], at: () => [GRPHONE1.x + 0.02, GRPHONE1.y, GRPHONE1.z + 0.02], fp: 40, fd: 34, cut: true },
        { t: T.wrap - 0.05, name: 'phone', eye: () => [GRPHONE1.x - 0.11, GRPHONE1.y + 0.82, GRPHONE1.z - 0.53], at: () => [GRPHONE1.x + 0.02, GRPHONE1.y, GRPHONE1.z + 0.02], fp: 38, fd: 32 },
        /* INSERT from above: his teacher's hands binding the packet with the white thread, as he speaks to her */
        /* (from the side away from his teacher, his hands coming to it from beyond: the plate is within his reach now, and
           he bends over it) */
        { t: T.wrap, name: 'wrap', eye: [pk[0] + 0.25, CLOTH_Y + 0.7, pk[2] - 0.3], at: pk, fp: 40, fd: 34, cut: true },
        { t: T.c3 - 0.35, name: 'wrap', eye: [pk[0] + 0.24, CLOTH_Y + 0.66, pk[2] - 0.28], at: pk, fp: 40, fd: 34 },
        /* his eyes: his teacher's words to Marcus, Marcus's answer and her own small thank you, the two of them (Marcus standing
           behind the sofa at her shoulder: he rose while the insert was on); the camera on what the words are about (v21.30) */
        { t: T.c3 - 0.3, name: 'thanks', eye, at: () => { const g = graceFace(), m = mkHead(); return [lp(g[0], m[0], 0.4), lp(g[1], m[1], 0.45) - 0.06, lp(g[2], m[2], 0.4)]; }, fp: 46, fd: 40, cut: true,
          hold: () => { const g = graceFace(), m = mkHead(); return [[g[0], g[1] + 0.04, g[2], 0.16], [m[0], m[1] + 0.02, m[2], 0.16]]; }, back: 0.45, fmax: 58 },
        { t: T.pour - 0.05, name: 'thanks', eye, at: () => { const g = graceFace(), m = mkHead(); return [lp(g[0], m[0], 0.4), lp(g[1], m[1], 0.45) - 0.06, lp(g[2], m[2], 0.4)]; }, fp: 46, fd: 40,
          hold: () => { const g = graceFace(), m = mkHead(); return [[g[0], g[1] + 0.04, g[2], 0.16], [m[0], m[1] + 0.02, m[2], 0.16]]; }, back: 0.45, fmax: 58 },
        /* his eyes: his teacher looking at him, the bottle; his look drops to his hands, the bottle and his own wrist, for a
           moment, and back (each way over 1.2 s: the first build's 0.6 s drop turned his look 136 degrees a second) */
        /* (the pour SEEN: a phone, whose picture is 24 degrees wide, looks at the bowl tilted over the bottle and the cork, his
           teacher's face 31 degrees off it; a desk holds both. 27 Nov: the look stayed on his face and a phone never saw the
           pour. Then up to his face as he holds the bottle out below it, GIVE1, and speaks) */
        { t: T.pour, name: 'pour', eye, at: () => lp3(phoAt(0.1, -0.15), POURAT1, 0.5), atP: POURAT1, fp: 50, fd: 42, cut: true },
        { t: T.give - 0.1, name: 'pour', eye, at: () => lp3(phoAt(0.1, -0.15), POURAT1, 0.5), atP: POURAT1, fp: 50, fd: 42 },
        { t: T.give + 0.8, name: 'pho', eye, at: () => phoAt(0.12, -0.22), fp: 50, fd: 42 },
        { t: T.wrist - 0.1, name: 'pho', eye, at: () => phoAt(0.12, -0.22), fp: 50, fd: 42 },
        { t: T.wrist + 1.1, name: 'wrist', eye, at: [eye[0] - 0.25, eye[1] - 0.62, eye[2] - 0.32], fp: 50, fd: 42 },
        { t: T.wrist + 2.1, name: 'wrist', eye, at: [eye[0] - 0.25, eye[1] - 0.62, eye[2] - 0.32], fp: 50, fd: 42 },
        { t: T.wrist + 3.3, name: 'pho', eye, at: () => phoAt(0.12, -0.22), fp: 50, fd: 42 },
        { t: T.end, name: 'pho', eye, at: () => phoAt(0.12, -0.22), fp: 50, fd: 42 }
      ];
    }

    /* ================================================================ HOME (the plan's 9.4; its clock HM51; 11:52 PM). The
       condominium's corridor at night, carpet and wall lights, a window at its end with the city in it; his keycard, the
       lock, the door on his dark flat and the city glowing through the glass; the bottle set on his altar beside the candle,
       his palms together a moment; his phone on its charger; the bedroom, the bathroom door open on steam and light, the
       shower; the bed's edge, looking out of the bedroom door at the city's glow; he lies down: the ceiling, the air-
       conditioner's small blue light; 11:58 on the bedside clock; his eyes closing slowly (never to full black: a faint
       warm glow through the lids), his thought; they open: the ceiling, the clock, 3:00. Play begins in bed */
    FILMS1.home = {
      begin(api, s) { F1.s = s; F1.lit = ''; F1.film = 'home'; F1.api = api;
        if (api && api.handsRoot) api.handsRoot.visible = false;
        f1Show(cast.pho, false); f1Show(cast.grace, false); f1Show(cast.marcus, false); f1Show(phoStand, false);
        if (things.bottle) things.bottle.visible = false; },
      frame(t) {
        const T = HM51, api = F1.api; F1.t = t;
        f1Look('HOME');
        f1Beds({ night: t < T.door ? 0 : t < T.open ? smo(c01((t - T.door) / 1.5)) * (1 - 0.6 * smo(c01((t - T.close) / 4.0))) : 0.35 * smo(c01((t - T.open - 1.0) / 1.2)) });
        WORLD.hisDoor(t < T.card + 0.4 ? 0 : t < T.door + 2.4 ? smo(c01((t - T.card - 0.4) / 1.1)) * 0.92 : 0.92 * (1 - smo(c01((t - T.door - 2.4) / 0.9))));
        WORLD.bedDoor(t < T.bed ? 1 : lp(1, 0.15, smo(c01((t - T.bed - 0.4) / 1.6))));
        WORLD.bathLight(t > T.bed - 2.0 && t < T.lie ? f1Env(t, T.bed - 2.0, T.lie, 0.8, 0.6) : 0);
        WORLD.light('altar', 1);
        /* the bottle on his altar from the moment his hand sets it there */
        if (things.bottle) things.bottle.visible = t >= T.setb;
        if (things.hisPhone) things.hisPhone.visible = t >= T.charge;
        acLed1.m.opacity = t >= T.lie ? 0.9 : 0.35; acLed1.q.visible = true;
        /* the clock's face: 11:58 at the insert, 3:00 as his eyes open */
        clockMat1.opacity = 1; clockSet1(t < T.open ? (t < T.clock - 6 ? '11:52' : '11:58') : '3:00');
        homeHands1(t, T, api);
        f1Track(t, homeKeys1(T));
        /* his walk's small bob down the corridor and across his flat */
        const walking = (t > 0.3 && t < 5.2) || (t > T.walkIn + 0.1 && t < T.altar - 0.25) || (t > T.table0 && t < T.phone - 0.1);
        if (walking) yaw.position.y += -0.015 * Math.abs(Math.sin(t * Math.PI / 0.55));
        /* HIS EYES CLOSING (never to full black: the lids' warm glow) and opening on 3:00: the picture narrowed to a sliver
           from top and bottom, and dimmed (the engine's pressure seam is not this; this is the film's own fade in a warm
           near-black) */
        homeLids1(t, T, api);
        f1Levels();
      },
      end() { f1Lens(PLAYFOV1); F1.beds = null; F1.film = ''; lidsOff1(); WORLD.bathLight(0); WORLD.light('altar', null); WORLD.hisDoor(0); WORLD.bedDoor(1);
        if (things.bottle) things.bottle.visible = true; if (things.hisPhone) things.hisPhone.visible = true; acLed1.m.opacity = 0.9;
        clockSet1('3:00'); PROPS1.keycard.visible = false; f1HandR(F1.api, null, null, 0); if (F1.api && F1.api.handPose) F1.api.handPose('pray', 0); F1.api = null; }
    };
    /* his hands: the keycard to the reader (his right, the engine's `reach`), the bottle set down on his altar (`place`, the
       bottle in his hand), his palms together a moment (the clasp: `pray`), his phone set on its charger (`place`); each a
       thing in his right hand (kit.hold) and its pose eased in and out, drawn only while they are in the frame */
    PROPS1.handPhone = stand('e4phone', 0, 0, 0, 0, { parent: nowhere1, near: true, done: (m) => handsPass1(m) });
    PROPS1.handCard = stand('w51keycard', 0, 0, 0, 0, { parent: nowhere1, near: true, done: (m) => handsPass1(m) });
    PROPS1.handBottleR = stand('w51bottle', 0, 0, 0, 0, { parent: nowhere1, near: true, done: (m) => { glassOff1(m); handsPass1(m); } });
    function f1HandR(api, pose, prop, k) {
      if (!api) return;
      if (k > 0.001 && pose) {
        if (F1.heldR !== prop) { if (api.kit && api.kit.hold) api.kit.hold(prop ? PROPS1[prop] : null); F1.heldR = prop; }
        if (api.handsRoot) api.handsRoot.visible = true;
        if (api.handPose) api.handPose(pose, k, {});
      } else if (F1.heldR !== undefined && F1.heldR !== null) { if (api.kit && api.kit.hold) api.kit.hold(null); F1.heldR = null; }
    }
    function homeHands1(t, T, api) {
      if (!api) return;
      const card = f1Env(t, T.card - 0.9, T.card + 0.45, 0.55, 0.45), bottle = f1Env(t, T.setb - 1.5, T.setb + 0.25, 0.7, 0.45),
            pray = f1Env(t, T.palms - 0.55, T.palms + 1.5, 0.55, 0.6), phone = f1Env(t, T.charge - 1.3, T.charge + 0.25, 0.6, 0.45);
      /* (the bottle and the phone leave his hand on the moment they are shown where he sets them, never both at once) */
      if (card > 0.001) f1HandR(api, 'reach', 'handCard', card);
      else if (bottle > 0.001) f1HandR(api, 'place', t < T.setb ? 'handBottleR' : null, bottle);
      else if (phone > 0.001) f1HandR(api, 'place', t < T.charge ? 'handPhone' : null, phone);
      else if (pray > 0.001) { f1HandR(api, null, null, 0); if (api.handsRoot) api.handsRoot.visible = true; if (api.handPose) api.handPose('pray', pray, {}); }
      else { f1HandR(api, null, null, 0); if (api.handPose) api.handPose('pray', 0); if (api.handsRoot) api.handsRoot.visible = false; }
    }
    /* THE LIDS: two near-black bands from the top and the bottom of the picture closing to a sliver at its middle, and a faint
       warm glow between them as they close (the lids lit from the city through them): laid in front of the lens, drawn last
       and over everything, never to full black */
    const lidMat1 = new THREE.MeshBasicMaterial({ color: 0x060403, transparent: true, opacity: 0, depthWrite: false, depthTest: false }); mats.push(lidMat1);
    const lidGlowMat1 = new THREE.MeshBasicMaterial({ color: 0x2c140a, transparent: true, opacity: 0, depthWrite: false, depthTest: false }); mats.push(lidGlowMat1);
    const lidTop1 = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), lidMat1), lidBot1 = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), lidMat1), lidGlow1 = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), lidGlowMat1);
    for (const q of [lidTop1, lidBot1, lidGlow1]) { q.renderOrder = 60; q.frustumCulled = false; owned.push(q.geometry); }
    lidGlow1.renderOrder = 59;
    function lidsOff1() { for (const q of [lidTop1, lidBot1, lidGlow1]) if (q.parent) q.parent.remove(q); lidMat1.opacity = 0; lidGlowMat1.opacity = 0; }
    function homeLids1(t, T) {
      /* how far shut, 0 open to 1 a sliver: shutting slowly from T.close over 5 s; open at once at T.open */
      const close = t >= T.close && t < T.open ? smo(c01((t - T.close) / 5.0)) : 0;
      if (close < 0.002) { lidsOff1(); return; }
      if (lidTop1.parent !== camera) { camera.add(lidTop1); camera.add(lidBot1); camera.add(lidGlow1); }
      const d = 0.2, h = Math.tan(camera.fov * Math.PI / 360) * d, w = h * camera.aspect, c = close * 0.985;
      lidTop1.position.set(0, h - h * c / 2, -d); lidTop1.scale.set(w * 2.4, h * c, 1);
      lidBot1.position.set(0, -h + h * c / 2, -d); lidBot1.scale.set(w * 2.4, h * c, 1);
      lidMat1.opacity = 1;
      lidGlow1.position.set(0, 0, -d - 0.002); lidGlow1.scale.set(w * 2.4, h * 2.4, 1); lidGlowMat1.opacity = 0.8 * smo(c01((close - 0.5) / 0.5));
    }
    /* where the play lays him in bed at three o'clock (PLAY.md 2: STATION.night.bed), his eye and his look */
    const LIEAT1 = () => (STATION.night && STATION.night.bed) || { x: HIS.bed.x + 0.2, z: HIS.bed.z, ry: 0.8, y: 0.82, pitch: 0.12 };
    function homeKeys1(T) {
      /* (the corridor walked toward its window: from the lifts' end, west, his door on his left) */
      const c0 = [HX + 1.6, -3.45], c1 = [HIS.door.x + 0.35, -3.25];
      const doorEye = [HIS.door.x + 0.08, EYE, CORR.z1 - 0.62];
      const inEye = [HIS.door.x + 0.15, EYE, LIV.z0 + 0.55];
      const altarEye = [HIS.altar.x + 0.72, EYE, HIS.altar.z - 0.02];
      const tableEye = [HIS.dining.x - 0.95, EYE, HIS.dining.z + 0.45];
      const bedEye = [HIS.bed.x - 0.72, 1.12, HIS.bed.z - 0.62];
      const LB = LIEAT1(), lieEye = [LB.x, LB.y, LB.z];
      const ceil = [LB.x - 1.2, FLAT.ceil, LB.z + 0.05];
      const clk = [HIS.clock.x, HIS.clock.y + 0.04, HIS.clock.z];
      const bath = [(BATH.x0 + 0.7 + BATH.x0 + 1.4) / 2, 1.1, BATH.z1];
      /* (27 Nov, measured: every walk at a walk's pace, a metre a second, and every turn of his head inside 90 degrees a
         second; the first build ran the eye 2.1 m through a 107 degree turn in 0.6 s into the room, 3.4 m from the altar to
         the table in 2 s looking at the floor, and whipped his look 225 degrees a second as he woke) */
      const clkAt = [clk[0], clk[1] + 0.03, clk[2]];
      const playAt = [lieEye[0] - 2 * Math.sin(LB.ry) * Math.cos(LB.pitch), lieEye[1] + 2 * Math.sin(LB.pitch), lieEye[2] - 2 * Math.cos(LB.ry) * Math.cos(LB.pitch)];
      const reader = [HIS.door.x + 0.42, 1.12, LIV.z0];
      return [
        /* the corridor: his eyes at a walk toward the window at its end, the city in it; turning left to his door as he
           comes to it, to the keycard's reader beside it */
        { t: 0, name: 'corr', eye: [c0[0], EYE, c0[1]], at: [CORR.x0, 1.45, c0[1] + 0.1], fp: 60, fd: 52, flow: true },
        { t: 1.6, name: 'corr', eye: [HX + 0.05, EYE, -3.42], at: [CORR.x0, 1.45, -3.32], fp: 60, fd: 52, flow: true },
        { t: 3.2, name: 'corr', eye: [HX - 1.6, EYE, -3.36], at: [CORR.x0, 1.43, -3.26], fp: 60, fd: 52, flow: true },
        { t: 4.6, name: 'corr', eye: [HX - 3.0, EYE, -3.3], at: [HIS.door.x, 1.45, LIV.z0], fp: 60, fd: 52, flow: true },
        { t: 5.6, name: 'door', eye: [HIS.door.x + 0.22, EYE, -3.25], at: reader, fp: 60, fd: 52, flow: true, stop: true },
        { t: T.card + 0.3, name: 'door', eye: [HIS.door.x + 0.22, EYE, -3.25], at: reader, fp: 60, fd: 52 },
        /* the door opens on his dark flat, the city glowing through the glass across the room */
        { t: T.door + 0.6, name: 'door', eye: [HIS.door.x + 0.15, EYE, -3.2], at: [HIS.door.x + 0.6, 1.3, LIV.z1], fp: 60, fd: 52 },
        /* in, at a walk, and to his altar on the left wall (the turn to it laid along the last metre and a half) */
        { t: T.walkIn, name: 'in', eye: [HIS.door.x + 0.15, EYE, -3.2], at: [HIS.door.x + 0.6, 1.3, LIV.z1], fp: 60, fd: 52, flow: true },
        { t: T.walkIn + 1.4, name: 'in', eye: [HIS.door.x + 0.13, EYE, LIV.z0 + 0.65], at: [HIS.door.x - 0.1, 1.3, 1.6], fp: 58, fd: 50, flow: true },
        { t: T.walkIn + 2.5, name: 'in', eye: [HIS.door.x + 0.2, EYE, -0.6], at: [HIS.altar.x - 0.1, 1.2, 0.45], fp: 54, fd: 46, flow: true },
        { t: T.altar, name: 'altar', eye: altarEye, at: [HIS.altar.x + 0.1, HIS.altar.top + 0.15, HIS.altar.z - 0.05], fp: 50, fd: 42, flow: true, stop: true },
        { t: T.setb + 0.5, name: 'altar', eye: altarEye, at: [HIS.altar.x + 0.12, HIS.altar.top + 0.1, HIS.altar.z - 0.08], fp: 50, fd: 42 },
        { t: T.palms + 1.6, name: 'altar', eye: altarEye, at: [HIS.altar.x + 0.1, HIS.altar.top + 0.2, HIS.altar.z], fp: 50, fd: 42 },
        { t: T.table0 - 0.05, name: 'altar', eye: altarEye, at: [HIS.altar.x + 0.1, HIS.altar.top + 0.22, HIS.altar.z + 0.02], fp: 50, fd: 42 },
        /* (cut) the last steps to the dining table: the phone on its charger */
        { t: T.table0, name: 'table', eye: [HIS.dining.x - 1.45, EYE, HIS.dining.z + 0.55], at: [FILMPLACE.phoneAt.x, FILMPLACE.phoneAt.y + 0.05, FILMPLACE.phoneAt.z], fp: 56, fd: 48, cut: true },
        { t: T.phone, name: 'table', eye: tableEye, at: [FILMPLACE.phoneAt.x, FILMPLACE.phoneAt.y, FILMPLACE.phoneAt.z], fp: 56, fd: 48 },
        { t: T.charge + 1.4, name: 'table', eye: tableEye, at: [FILMPLACE.phoneAt.x + 0.1, FILMPLACE.phoneAt.y + 0.05, FILMPLACE.phoneAt.z], fp: 56, fd: 48 },
        { t: T.bed - 0.05, name: 'table', eye: tableEye, at: [FILMPLACE.phoneAt.x + 0.1, FILMPLACE.phoneAt.y + 0.05, FILMPLACE.phoneAt.z], fp: 56, fd: 48 },
        /* the bedroom: the bathroom door open on its light, the shower; then the bed's edge, looking out at the city's glow */
        { t: T.bed, name: 'bath', eye: [BED.x0 + 0.85, EYE, 0.7], at: bath, fp: 66, fd: 58, cut: true },
        { t: T.sit - 0.05, name: 'bath', eye: [BED.x0 + 0.85, EYE, 0.68], at: [bath[0], bath[1] + 0.05, bath[2]], fp: 66, fd: 58 },
        { t: T.sit, name: 'bed', eye: bedEye, at: [BED.x0 - 1.0, 1.15, 1.4], fp: 66, fd: 58, cut: true },
        { t: T.lie - 0.1, name: 'bed', eye: bedEye, at: [BED.x0 - 1.2, 1.1, 1.5], fp: 66, fd: 58 },
        /* he lies down (eased over 1.5 s): the ceiling, the air-conditioner's light, the bedroom door ajar on the living room */
        { t: T.lie + 1.5, name: 'lie', eye: lieEye, at: ceil, fp: 66, fd: 58 },
        { t: T.clock - 0.05, name: 'lie', eye: lieEye, at: [ceil[0] - 0.3, ceil[1], ceil[2] - 0.05], fp: 66, fd: 58 },
        /* INSERT: the bedside clock, 11:58 */
        { t: T.clock, name: 'clockface', eye: [clk[0] - 0.55, clk[1] + 0.32, clk[2] - 0.45], at: clk, fp: 34, fd: 28, cut: true },
        { t: T.clock + 5.95, name: 'clockface', eye: [clk[0] - 0.52, clk[1] + 0.3, clk[2] - 0.42], at: clk, fp: 32, fd: 27 },
        /* the ceiling in the dark; his eyes close; they open: the ceiling, held in the silence */
        { t: T.clock + 6.0, name: 'lie', eye: lieEye, at: ceil, fp: 66, fd: 58, cut: true },
        { t: T.open + 0.6, name: 'lie', eye: lieEye, at: ceil, fp: 66, fd: 58 },
        /* his head turned slowly on the pillow to the bedside clock: 3:00; then back across the ceiling over him and down the
           far side, to the room where the play begins (its own lying view: PLAY.md 2), one unbroken roll of his head */
        { t: T.open + 2.6, name: 'wake', eye: lieEye, at: clkAt, fp: 66, fd: 58 },
        { t: T.open + 3.7, name: 'wake', eye: lieEye, at: clkAt, fp: 66, fd: 58, flow: true },
        { t: T.open + 5.3, name: 'wake', eye: lieEye, at: [lieEye[0] + 0.05, FLAT.ceil, lieEye[2] - 0.05], fp: 68, fd: 64, flow: true },
        { t: T.end - 0.05, name: 'play', eye: lieEye, at: playAt, fp: PLAYFOV1, fd: PLAYFOV1, flow: true }
      ];
    }

    /* ================================================================ WHAT THE OTHER PIECES TAKE FROM HERE (FILMS.md says
       how each is meant): the shared cast, the stations, the standing Grandmaster Pho (FILMS-2's dawn), the films' things,
       each film's pictures (begin, frame, end), the beds a film asks for, and the helpers c_yfilm2.js may call by name */
    const FILMSAPI = {
      cast,
      station: STATION,
      /* (where a film's last picture hands him back: the phase's own `at`) */
      endAt: (p) => (STATION[p] && STATION[p].at) || null,
      phoStand,
      driver: driver1,
      props: PROPS1,
      films: FILMS1,
      beds: () => (F1.film ? F1.beds : null),
      state: () => ({ film: F1.film, shot: F1.shot, lit: F1.lit, vis: F1.vis, beds: F1.beds, held: F1.held || null }),
      shot: () => F1.shot,
      helpers: { track: f1Track, walk: f1Walk, speak: f1Speak, gaze: f1Gaze, head: f1Head, show: f1Show, vision: f1Vision, look: f1Look, lens: f1Lens,
                 env: f1Env, carry: f1Carry, drop: f1Drop, climb: climbPose, phoRest: phoRest1, phoBag: phoBagOn1, bowlInHands: bowlInHands1 },
      /* every person the films can show (a probe's: chapter 5's films probe reads `people()`) */
      people: () => ({ pho: cast.pho, grace: cast.grace, marcus: cast.marcus, phoStand, driver: driver1 })
    };
