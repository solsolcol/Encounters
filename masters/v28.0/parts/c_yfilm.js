
    /* ================================================================ THE FILMS' PICTURES (M9: masters/v28.0/parts/c_yfilm.js)
       Every film of the plan's 4 (the opening, the devotee, the preparation and the turn, the bag tied, the collector's
       film in, the four endings with the rite and the last picture) and the Naga's film inside the fight (5.5, stage 5).
       Their CLOCKS are the chapter's own (z_tail.js: built by tl() from SECS, so a measured take moves everything after it,
       v5.15); here is what each frame of each shows, a pure function of the film's clock (v6.4: people POSED at the moment
       the clock asks for, a look laid on at once, every place a function), so a seek, a skip and a slow phone land on one
       picture. Every shot is HIS EYES (the lens stands where he stands, turns and narrows, and never moves through the
       people), except from the turn of the preparation to the bag tied: there, and only there, Master Zavier is seen
       (Chad's R3 and R5: the climax in third person). A shot is a track of keys: each key's eye, its aim (or its turn and
       its pitch) and its lens for a phone and a desk; between two keys the lens eases (a smooth function of the clock,
       v25.5); a key marked `cut` is jumped to. A phone's frame is a third of a desk's width, so a group a desk holds is a
       phone's pan from one face to the next. Each film ENDS where play keeps things (v5.25): its last key is the view the
       phase it hands to begins in (the snapshot the engine restores: the phase was booked before the film began), and the
       people stand at that phase's stations. */
    const FM5 = { once: new Set(), shot: '', lit: '', vis: false, s: null };
    const PLAYFOV5 = 72;
    function fmLook(name, secs = 0) { if (FM5.lit !== name) { FM5.lit = name; if (kit && kit.daylight) kit.daylight(PRESETS[name] || DUSK, secs); } }
    function fmLens(f) { if (Math.abs(camera.fov - f) > 1e-3) { camera.fov = f; camera.updateProjectionMatrix(); } }
    /* the rig at an eye, aimed at a point (yaw turns, pitch tilts: a turn of 0 looks toward -z) */
    function fmAim(p, q, roll = 0) {
      yaw.position.set(p[0], p[1], p[2]);
      const dx = q[0] - p[0], dy = q[1] - p[1], dz = q[2] - p[2];
      yaw.rotation.y = Math.atan2(-dx, -dz); pitch.rotation.x = Math.atan2(dy, Math.hypot(dx, dz)); camera.rotation.z = roll;
    }
    /* (the levels of the people and the things for THIS frame's lens, never the last one's: v24.22; the world's frame
       chooses them only in play) */
    function fmLevels() { camera.updateMatrixWorld(true); stockLod(); peopleLevels(); }
    const v3_5 = (o) => (typeof o === 'function' ? o() : o);
    /* a key: { t, name, eye, at, fp, fd, roll, cut } or, for a turn held as a rig holds it, { t, eye, yaw, pitch, fp, fd }
       (the fight's boom, the snapshot a phase begins in). Between two keys of the same kind the eye, the aim and the lens
       ease; between an aimed key and a turned one the turn and the pitch ease */
    const keysBad5 = new Set();
    /* A SHOT SOLVED FOR THE SCREEN IT IS DRAWN ON (R25, Chad: "The framing needs to be fixed so that both desktop and mobile
       looks perfect at the same time"; CLAUDE.md v21.8: each shot names the points that must be in frame and solves its
       distance for this screen's aspect). A key may name what it must HOLD (`hold`: [[x, y, z, r], ...], or a function
       answering that: each a place and how far round it must be inside the frame, a head its middle and 0.16), and how far
       its eye may come back for it (`back`, metres, 1.2 unless said). Once the eye, the aim and the lens are eased, the eye
       is drawn straight back along its own line of sight until every held place and its round fit inside 0.86 of the
       half-width and 0.88 of the half-height of THIS screen: the aim stays, the subject keeps its place in the picture, and
       only the distance answers the screen's shape (a portrait phone sees a third of a desk's width). A desk whose frame
       already holds them is not moved at all, and a key with no `hold` is exactly as before. The pull is eased between two
       keys as everything else is (each key's own pull, mixed by the same ease), so it is a smooth function of the clock.
       It never goes back through a solid (the place's own, `solids`): it stops 0.3 m short, and the lens widens for the
       rest, to the key's `fmax` (78 degrees unless said) */
    const _fhE = new THREE.Vector3(), _fhR = new THREE.Ray(), _fhH = new THREE.Vector3();
    let solidBoxes5 = null;
    function fmPullOf(K) {
      const H = K && K.hold ? (typeof K.hold === 'function' ? K.hold() : K.hold) : null; if (!H || !H.length) return 0;
      camera.updateMatrixWorld(true); camera.getWorldPosition(_fhE);
      const e = camera.matrixWorld.elements, th = Math.tan(camera.fov * Math.PI / 360), tw = th * camera.aspect;
      let d = 0;
      for (const h of H) { if (!h) continue; const dx = h[0] - _fhE.x, dy = h[1] - _fhE.y, dz = h[2] - _fhE.z, r = h[3] || 0;
        const z = -(dx * e[8] + dy * e[9] + dz * e[10]); if (z <= 0.05) continue;
        const x = dx * e[0] + dy * e[1] + dz * e[2], y = dx * e[4] + dy * e[5] + dz * e[6];
        d = Math.max(d, (Math.abs(x) + r) / (tw * 0.86) - z, (Math.abs(y) + r) / (th * 0.88) - z); }
      return Math.min(K.back != null ? K.back : 1.2, Math.max(0, d));
    }
    function fmHold(A, B, u) {
      if (!(A && A.hold) && !(B && B.hold)) return;
      const d = B ? lp(fmPullOf(A), fmPullOf(B), u) : fmPullOf(A); if (!(d > 1e-4)) return;
      camera.updateMatrixWorld(true); camera.getWorldPosition(_fhE);
      const e = camera.matrixWorld.elements; _fhR.origin.copy(_fhE); _fhR.direction.set(e[8], e[9], e[10]).normalize();      // (backward: +z)
      if (!solidBoxes5) { solidBoxes5 = []; for (const s of solids) { s.updateWorldMatrix(true, false); solidBoxes5.push(new THREE.Box3().setFromObject(s)); } }
      let dd = d;
      for (const bb of solidBoxes5) { if (bb.containsPoint(_fhE)) continue; const hit = _fhR.intersectBox(bb, _fhH); if (hit) dd = Math.min(dd, Math.max(0, _fhE.distanceTo(hit) - 0.3)); }
      yaw.position.addScaledVector(_fhR.direction, dd);
      camera.updateMatrixWorld(true);
      if (dd < d - 1e-3) {
        /* (the rest of the fit by the lens, from where the eye stopped: each key's need, mixed by the same ease) */
        const th = B ? lp(fmNeedTh(A), fmNeedTh(B), u) : fmNeedTh(A), fmax = (B ? lp(A.fmax || 78, B.fmax || 78, u) : A.fmax || 78);
        const f = Math.min(fmax, 2 * Math.atan(th) * 180 / Math.PI); if (f > camera.fov) { fmLens(f); camera.updateMatrixWorld(true); }
      }
    }
    /* the lens's half-height (its tangent) that holds a key's places from where the eye stands now (the lens as it is, if more) */
    function fmNeedTh(K) {
      const th0 = Math.tan(camera.fov * Math.PI / 360), H = K && K.hold ? (typeof K.hold === 'function' ? K.hold() : K.hold) : null; if (!H || !H.length) return th0;
      camera.getWorldPosition(_fhE); const e = camera.matrixWorld.elements; let th = th0;
      for (const h of H) { if (!h) continue; const dx = h[0] - _fhE.x, dy = h[1] - _fhE.y, dz = h[2] - _fhE.z, r = h[3] || 0;
        const z = -(dx * e[8] + dy * e[9] + dz * e[10]); if (z <= 0.05) continue;
        const x = dx * e[0] + dy * e[1] + dz * e[2], y = dx * e[4] + dy * e[5] + dz * e[6];
        th = Math.max(th, (Math.abs(x) + r) / (z * 0.86 * camera.aspect), (Math.abs(y) + r) / (z * 0.88)); }
      return th;
    }
    function fmKeyYP(K) { if (K.yaw != null) return [K.yaw, K.pitch || 0];
      const p = v3_5(K.eye), q = v3_5(K.at), dx = q[0] - p[0], dy = q[1] - p[1], dz = q[2] - p[2]; return [Math.atan2(-dx, -dz), Math.atan2(dy, Math.hypot(dx, dz))]; }
    function fmTrack(t, K) {
      for (let j = 1; j < K.length; j++) if (K[j].t < K[j - 1].t) { const w = (K[j - 1].name || '') + '@' + K[j - 1].t.toFixed(2) + ' > ' + (K[j].name || '') + '@' + K[j].t.toFixed(2);
        if (!keysBad5.has(w)) { keysBad5.add(w); console.error('e4c5: a film\'s camera keys run backwards in time: ' + w); } }
      let i = 0; while (i < K.length - 1 && t >= K[i + 1].t) i++;
      const A = K[i], B = K[i + 1], nar = isNarrow();
      if (!B || B.cut) {
        fmLens(nar ? A.fp : A.fd);
        if (A.yaw != null || !A.at) { const p = v3_5(A.eye), [yw, pt] = fmKeyYP(A); yaw.position.set(p[0], p[1], p[2]); yaw.rotation.y = yw; pitch.rotation.x = pt; camera.rotation.z = A.roll || 0; }
        else fmAim(v3_5(A.eye), v3_5(A.at), A.roll || 0);
        fmHold(A, null, 1);
        FM5.shot = A.name || ''; fmLevels(); return;
      }
      const u = smo(c01((t - A.t) / Math.max(1e-3, B.t - A.t)));
      fmLens(lp(nar ? A.fp : A.fd, nar ? B.fp : B.fd, u));
      const pe = lp3(v3_5(A.eye), v3_5(B.eye), u);
      if (A.yaw != null || B.yaw != null || !A.at || !B.at) { const [ya, pa] = fmKeyYP(A), [yb, pb] = fmKeyYP(B);
        yaw.position.set(pe[0], pe[1], pe[2]); yaw.rotation.y = ya + angTo(ya, yb) * u; pitch.rotation.x = lp(pa, pb, u); camera.rotation.z = lp(A.roll || 0, B.roll || 0, u); }
      else fmAim(pe, lp3(v3_5(A.at), v3_5(B.at), u), lp(A.roll || 0, B.roll || 0, u));
      fmHold(A, B, u);
      FM5.shot = (A.name || '') + '>' + (B.name || ''); fmLevels();
    }
    /* the view a phase begins in (the snapshot the engine will restore at the film's end), as a key */
    const fmSnapKey = (t, name = 'play') => { const s = FM5.s; return s ? { t, name, eye: [s.yawPos.x, s.yawPos.y, s.yawPos.z], yaw: s.yawRot, pitch: s.pitchX, fp: PLAYFOV5, fd: PLAYFOV5 } : null; };
    const fmRun = (t, t0, t1, a, b) => lp(a, b, smo(c01((t - t0) / (t1 - t0))));
    const fmPing = (t, from, len, secs) => from + len * (0.5 - 0.5 * Math.cos(Math.PI * 2 * t / secs));
    /* WHERE A PERSON'S HEAD IS, FOR A SHOT OR A LOOK: the place the film stands him (his group, set by the film's own
       clock) at the height his fallback names, never his LIVING head. A shot whose aim rides a talking head sways with his
       take (v25.5: a talk's head travels 19 cm at up to 29 cm a second, and the whole picture behind him goes with it),
       and a seek freezes the take, so framecheck could never see it: the face moves inside a steady frame instead */
    function fmHead(P, fb) { if (P && P.ready && P.group.visible) { const g = P.group.position; return [g.x, fb ? fb[1] : 1.55, g.z]; } return fb; }
    const fmShow = (P, on) => { if (!P) return; P.hidden = !on; if (P.ready) P.group.visible = on; };
    /* SPIRIT VISION held by a film's clock (the engine's own curve, out from his eyes over `secs` from `t0`, full until
       `t1`, home over `back`); held only round the moments it is open (R51: a held radius of 0 draws every frame through
       the vision's pass for nothing) */
    const VR5 = 70, visCurve5 = (u) => 0.30 * u + 0.70 * u * u * u;
    function fmVision(t, t0, secs = 2.2, t1 = Infinity, back = 1.6) {
      if (!kit || !kit.vision) return;
      let r = 0, mv = false;
      if (t >= t0 && t < t0 + secs) { r = VR5 * visCurve5((t - t0) / secs); mv = true; }
      else if (t >= t0 + secs && t < t1) r = VR5;
      else if (t >= t1 && t < t1 + back) { r = VR5 * visCurve5(1 - (t - t1) / back); mv = true; }
      if (r > 0.001 || mv) { kit.vision({ r, moving: mv }); FM5.vis = true; }
      else if (FM5.vis) { kit.vision(null); FM5.vis = false; }
    }
    function fmVisionOff() { if (FM5.vis && kit && kit.vision) kit.vision(null); FM5.vis = false; }
    /* THE BEDS IN A FILM: the play's own loops (c_play.js BED5: the walkway, the court, his room and its clock, the
       receiving room's fan, the smell, the lamp's buzz), which in a film are what the film writes each frame and else
       all at 0; each eased by the play's own frame. Written by every film on every frame, so none inherits another's */
    function fmBeds(o) { if (typeof BED5 !== 'undefined') BED5.film = o; }
    /* A WALK ALONG A PATH (pts: [[x, z], ...]) from `t0` at `v` metres a second, the walking take's time read from the ground
       covered (P.pace: the take's own travel, v26.0; the library walk's 1.29 m a second where a body has none), eased out
       of its rest and into it again at the end over `ease` seconds of the walk; turned along the path and, at its end, to
       `ryEnd`. `rest` is the take and moment it stands in before and after. Answers whether it is walking */
    function fmPathLen(pts) { let L = 0; for (let i = 1; i < pts.length; i++) L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); return L; }
    function fmPathAt(pts, s) { for (let i = 1; i < pts.length; i++) { const a = pts[i - 1], b = pts[i], l = Math.hypot(b[0] - a[0], b[1] - a[1]); if (s <= l || i === pts.length - 1) { const u = l > 1e-6 ? Math.min(1, s / l) : 1; return [lp(a[0], b[0], u), lp(a[1], b[1], u), Math.atan2(b[0] - a[0], b[1] - a[1])]; } s -= l; } return [pts[0][0], pts[0][1], 0]; }
    function fmWalk(P, t, t0, pts, v, rest, ryEnd, o = {}) {
      if (!P || !P.ready) return false;
      /* (the walk's time is its length at `v` plus one `ease`: speeding up over `ease` and slowing over `ease` each lose half
         of it. Written first as length / v, the slowing began where the walk had not yet got to, and every walker jumped
         forward v x ease (45 cm at a metre a second) as his last half-second began: measured, lensread.py, 21 Nov) */
      const L = fmPathLen(pts), v1 = Math.max(0.1, v), ease = Math.min(o.ease || 0.45, L / v1), T = L / v1 + ease, tw = t - t0, pace = (P.pace && P.pace.Walking) || 1.29;
      const restT = (q) => (rest[1] != null ? rest[1] : 0) + (rest[2] ? q * rest[2] : 0);
      if (tw <= 0) { const a = pts[0]; put(P, a[0], a[1], o.ry0 != null ? o.ry0 : fmPathAt(pts, 0)[2]); pose(P, rest[0], restT(t), !!rest[3]); return false; }
      if (tw >= T) { const b = pts[pts.length - 1]; const turnK = smo(c01((tw - T) / 0.6)), h = fmPathAt(pts, L)[2];
        put(P, b[0], b[1], ryEnd != null ? h + angTo(h, ryEnd) * turnK : h); pose(P, rest[0], restT(t), !!rest[3]); return false; }
      /* (eased along the path: slow away, slow to a stop, the take read from the ground covered) */
      const s = !(ease > 0) ? L * tw / T : tw < ease ? 0.5 * v1 * tw * tw / ease : tw > T - ease ? L - 0.5 * v1 * (T - tw) * (T - tw) / ease : v1 * (tw - 0.5 * ease);
      const sc = Math.max(0, Math.min(L, s)), at = fmPathAt(pts, sc), r0 = o.ry0 != null ? o.ry0 : at[2];
      put(P, at[0], at[1], r0 + angTo(r0, at[2]) * smo(c01(tw / 0.35)));
      const into = smo(c01(tw / 0.35)), outOf = smo(c01((tw - T + 0.35) / 0.35));
      if (outOf <= 0) pose(P, 'Walking', sc / pace, true, rest[0], 1 - into, restT(t));
      else pose(P, rest[0], restT(t), !!rest[3], 'Walking', 1 - outOf, sc / pace);
      return true;
    }
    /* a person turned from one heading to another over [t0, t1], standing in his rest */
    const fmTurn = (t, t0, t1, a, b) => a + angTo(a, b) * smo(c01((t - t0) / Math.max(0.05, t1 - t0)));
    /* the rests each body stands in (its take, its moment, how far its moment breathes, and whether it wraps; a fifth, how
       far a still one's moment sways, 0.25 unless said). phoS: his teacher SEATED on his cushion (the rise's first moments),
       the rest the endings always gave him by hand (R25: a seated talk mixed with the standing rest half rose at each line) */
    const REST5 = { pho: ['Sit_to_Stand_Transition_M', 5.85, 0.04, false], ton: ['Idle_3', 2.0, 0.35, true], jun: ['Idle_3', 3.0, 0.35, true],
                    koh: ['Idle_3', 1.0, 0.35, true], col: ['Sitting_Answering_Questions', 0.4, 0.0, false],
                    phoS: ['Sit_to_Stand_Transition_M', 0.02, 0.0, false, 0.3] };
    const restOf5 = (who, t) => { const R = REST5[who]; return [R[0], R[3] ? R[1] + t * R[2] : fmPing(t, R[1], R[4] || 0.25, 6), R[3]]; };
    function fmRest(P, who, t) { if (!P || !P.ready) return; const r = restOf5(who, t); pose(P, r[0], r[1], r[2]); }
    /* A PERSON'S TALKING OVER ALL HIS LINES IN A FILM (R25, Chad: "jerky character motions"): `lines` [[t0, secs, take], ...]
       each plays its talking take from the line's own start, eased in over 0.35 s and out over the half second after its
       last word, the rest of the time his rest; lines closer than a second run as ONE talk (the take's own time unbroken
       from the first), and where the next line's take is another the two are crossfaded over half a second round its start.
       fmTalk called per line by windows cut 0.1 s after each line dropped the third of the talking pose its fade still
       held in one frame, and a line begun inside the last one's fade began from the rest: both snaps, measured
       (tools/probes/e4c5filmread.py, JERK) */
    function fmSpeak(P, who, t, lines) {
      if (!P || !P.ready) return;
      const r = restOf5(who, t), S = [];
      for (const [t0, secs, take0] of lines.slice().sort((a, b) => a[0] - b[0])) { const tk = take0 || P.talkTake; if (!tk || !P.acts[tk]) continue;
        const last = S[S.length - 1];
        if (last && t0 - last.t1 < 1.0) { last.t1 = Math.max(last.t1, t0 + secs); if (last.seg[last.seg.length - 1].tk !== tk) last.seg.push({ tk, t0 }); }
        else S.push({ t0, t1: t0 + secs, seg: [{ tk, t0 }] }); }
      /* ONE TAKE FOR HIS REST AND HIS TALK (the collector has one seated take, Sitting_Answering_Questions): a take cannot be
         mixed with itself at two moments (pose() gave the one action the rest's moment and the mix's weight, so every
         line began and ended with his body sagging toward its bind pose: JUMP and JERK at each of his lines). So it PLAYS:
         slowly while he is quiet (an eighth of its pace), at its own pace while he talks, its time the sum of both (each line's weight summed over
         the clock, in closed form: smoothstep's integral), a pure function of the clock with no step */
      if (S.length && S.every(q => q.seg.every(g => g.tk === r[0]))) {
        const Sm = (x) => x * x * x - 0.5 * x * x * x * x;
        let I = 0;
        for (const q of S) { if (t <= q.t0) break;
          I += 0.35 * Sm(c01((t - q.t0) / 0.35)) + Math.max(0, Math.min(t, q.t1 - 0.1) - (q.t0 + 0.35));
          const x = c01((t - q.t1 + 0.1) / 0.5); I += 0.5 * (x - Sm(x)); }
        pose(P, r[0], REST5[who][1] + 0.12 * t + 0.88 * I, true); return;
      }
      const s = S.find(q => t >= q.t0 && t < q.t1 + 0.45);
      if (!s) { pose(P, r[0], r[1], r[2]); return; }
      const W = smo(c01((t - s.t0) / 0.35)) * (1 - smo(c01((t - s.t1 + 0.1) / 0.5)));
      let i = 0; while (i < s.seg.length - 1 && t >= s.seg[i + 1].t0) i++;
      const tt = (g) => { const d = P.acts[g.tk].getClip().duration; return ((t - s.t0) % d + d) % d; };
      const A = s.seg[i], pv = s.seg[i - 1], nx = s.seg[i + 1];
      if (pv && t < A.t0 + 0.25) { pose(P, A.tk, tt(A), true, pv.tk, 1 - smo(c01((t - A.t0 + 0.25) / 0.5)), tt(pv)); return; }
      if (nx && t > nx.t0 - 0.25) { pose(P, A.tk, tt(A), true, nx.tk, smo(c01((t - nx.t0 + 0.25) / 0.5)), tt(nx)); return; }
      pose(P, A.tk, tt(A), true, r[0], 1 - W, r[1]);
    }
    /* A LOOK THAT MOVES FROM ONE THING TO THE NEXT (R25): `list` [[t, target], ...] (a point, a function of one, or 'lens'),
       each target from its own time, the head carried from the last one to it over `ease` s. A look handed a new target
       in one frame turned the head there in that frame (lookNow lays a look on at once: v6.4), a snap of up to 60 degrees */
    const _gzA = new THREE.Vector3();
    function fmGaze(P, t, list, k = 0.8, reach = 0.75, down = 0.03, ease = 0.5) {
      if (!P || !P.ready || !list.length) return;
      const at = (q) => { const g = typeof q === 'function' ? q() : q; if (g === 'lens') { camera.getWorldPosition(_gzA); return [_gzA.x, _gzA.y, _gzA.z]; } return g; };
      let i = 0; while (i < list.length - 1 && t >= list[i + 1][0]) i++;
      const A = list[i], B = list[i - 1], u = B ? smo(c01((t - A[0]) / ease)) : 1;
      const tg = u >= 1 ? at(A[1]) : lp3(at(B[1]), at(A[1]), u);
      if (tg) lookNow(P, tg, k, reach, down);
    }
    /* a person who speaks plays his talking take from the line's own start to its end, and is back in his rest after (v11.4) */
    function fmTalk(P, who, t, t0, secs, take) {
      if (!P || !P.ready) return;
      const tk = take || (P.talkTake || null), into = smo(c01((t - t0) / 0.35)), outOf = smo(c01((t - t0 - secs + 0.1) / 0.5));
      const r = restOf5(who, t);
      if (!tk || !P.acts[tk] || t < t0 || outOf >= 1) { pose(P, r[0], r[1], r[2]); return; }
      const d = P.acts[tk].getClip().duration, tt = ((t - t0) % d + d) % d;
      pose(P, tk, tt, true, r[0], Math.max(1 - into, outOf), r[1]);
    }

    /* ---------------------------------------------------------------- THE OPENING'S OWN SET: the lift car's floor
       display, inside over its doors (amber digits on black, as such a car's are: 1, 2, 3, the third the walkway's storey,
       the hall's own plate says 3), seen only in the opening film; each number its own uploaded picture, swapped by
       visibility (nothing is uploaded on screen: the curtain warms the hidden, v14.15) */
    const LIFTNUM5 = (() => {
      const g = new THREE.Group(); g.visible = false; world.add(g);
      const box0 = new THREE.Mesh(new THREE.PlaneGeometry(0.22, 0.13), M({ color: 0x202224, roughness: 0.5, metalness: 0.3 })); owned.push(box0.geometry);
      box0.position.set(0, 2.20, LIFT.z0 + 0.012); g.add(box0);
      const nums = [];
      for (const n of ['1', '2', '3']) {
        const [c, x] = canvas(256, 128); x.fillStyle = '#0a0a0a'; x.fillRect(0, 0, 256, 128);
        x.fillStyle = '#ff8a2a'; x.font = 'bold 104px Arial, Helvetica, sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(n, 96, 68);
        x.beginPath(); x.moveTo(196, 82); x.lineTo(226, 82); x.lineTo(211, 46); x.closePath(); x.fill();      // the car going up
        const m = B({ map: tex(done(THREE, c, false)) }), q = new THREE.Mesh(new THREE.PlaneGeometry(0.19, 0.095), m); owned.push(q.geometry);
        q.position.set(0, 2.20, LIFT.z0 + 0.016); g.add(q); nums.push(q);
      }
      return { g, set(i) { g.visible = i >= 0; nums.forEach((q, j) => { q.visible = j === i; }); } };
    })();
    /* the lift car's own places (LIFT: x -0.8..0.8, z 1.35..2.85; its doors at z 1.26, in the walkway's end wall) */
    /* (Jun and Ton a step forward of him, 0.85 to 0.95 m off, each half-turned to speak back to him: at 0.56 m Jun filled
       the phone's frame edge as a face looking up past the lens: open-phone film-00011, 21 Nov) */
    const CAR5 = { eye: [0.05, EYE, 2.55], pho: [0.04, 1.62], ton: [-0.5, 1.85], jun: [0.5, 1.9] };

    /* ---------------------------------------------------------------- THE THREAD ACROSS HIS DOORWAY (the plan's 4.4: Jun
       draws white thread across it and keeps hold of its end; the household behind it): a white cord at knee height from
       the door's west jamb to Jun's hand, made here (the reel is the world's, w5threadreel) */
    const THREAD5 = (() => {
      const m = new THREE.MeshBasicMaterial({ color: 0xf2efe6, fog: false }); mats.push(m);
      const geo = new THREE.CylinderGeometry(0.0022, 0.0022, 1, 6, 1, true); geo.rotateZ(Math.PI / 2); geo.translate(0.5, 0, 0); owned.push(geo);
      const me = new THREE.Mesh(geo, m); me.visible = false; world.add(me);
      return { set(on, a, b) { me.visible = !!on; if (!on) return; const dx = b[0] - a[0], dy = b[1] - a[1], dz = b[2] - a[2], L = Math.hypot(dx, dy, dz);
        me.position.set(a[0], a[1], a[2]); me.scale.set(L, 1, 1); me.rotation.set(0, Math.atan2(-dz, dx), Math.atan2(dy, Math.hypot(dx, dz)), 'YZX'); } };
    })();

    /* ---------------------------------------------------------------- THE NAGA OF THE FIGHT'S FILM (the plan's 5.5 stage 5,
       9.3, 11): "ruby and vast", rising from the stick's head and laying its long body ONCE round the court's edge, between
       the nine and everyone in the court and at its door; not Mucalinda's seven coils and spread hood (the canon gives
       those to the Buddha alone: §0.3, 12). Drawn as ruby LIGHT (its model, people/naga.sh, is faithful to its reference
       and crumpled close: at the film's distance it is light and scale): a glowing skin of the model laid along a path by
       its own length, its head leading. The path: up from the stick's head, over, and round the court a little inside its
       walls, a rounded loop; `k` how far along the path the head has come (0 .. 1), `a` its light */
    const NAGA5 = (() => {
      const g = new THREE.Group(); g.visible = false; world.add(g);
      /* ITS LIGHT (R25, FILMS-2: the laying was right and the look was not: an unlit, double-sided red with no depth drew
         every inner face of the crumpled model over every other, "red sheets of glass", a cone, a wall and a slab of red
         shards, together-phone 5.8, 8.5 and 11.8 on the rewrite). Now a body of ruby light in three draws of the one laid
         skin: (1) its NEAREST SURFACE only (a pass that writes depth and no colour, so the next draws only the surface the
         lens meets first: no inner face, no fold behind another); (2) THE BODY: a deep ruby whose faces turned to the lens
         thin toward the court behind them and whose edges burn bright (a fresnel on its own smooth normals, welded across
         the file's split seams and turned with the path every lay), scales flowing along it (a pattern in metres along the
         body and round it, so they are never stretched with the body's length), a slow breath of light down its length, and
         GOLD only where his light falls on it (the faces turned to his shoulders, near him: uNPho); its hue normal-blended;
         (3) ITS GLOW, a layer of its own: the back faces of a skin a hand's breadth out, added (never normal-blended), drawn
         only round its silhouette (the first draw hides the rest), brightest at its edge and gone a hand away. A light it
         adds none (v9.4). uNA its strength (the fight's last stage keeps it at 0.3: under 0.5 its glow goes out and it is
         drawn after everything else, so a dim Naga hides nothing behind it), uNT its clock */
      const U = { uNK: { value: 0 }, uNA: { value: 0 }, uNT: { value: 0 }, uNLen: { value: 1 }, uNKK: { value: 0 }, uNGR: { value: 0 }, uNGW: { value: 0.16 },
                  uNS0: { value: 1 }, uNLm: { value: 1 }, uNJ: { value: 0.5 }, uNTPL: { value: 1.6 },   // (the lying middle's stretch, its length in the file, its neck's length, its taper: set())
                  uNPho: { value: new THREE.Vector4(0, 0, 0, 0) },
                  uNDeep: { value: new THREE.Color(0x3a020c) }, uNCol: { value: new THREE.Color(0xb00a22) }, uNRim: { value: new THREE.Color(0xff2a40) },
                  uNGlowC: { value: new THREE.Color(0xff1030) }, uNGold: { value: new THREE.Color(0xffc860) },
                  uNLook: { value: new THREE.Vector4(1.0, 2.6, 0.6, 0.30) } };   // (core alpha, rim power, glow strength, scale strength; the core at 0.82 showed the court's tiles and edges through it, red glass: together-phone 8.5 and 11.8 on 0f693b7)
      const st = { ready: false, path: null, len: 1, minX: 0, maxX: 1, mesh: null, laid: '' };
      /* the three draws' shaders: one vertex step for all three (the glow's pushed a hand's breadth out along its normal),
         so the nearest surface and the body are the same depths to the bit */
      const SH5 = {};
      SH5.vsHead = `attribute float aNf; attribute float aReg; attribute float aO2; attribute vec2 aCS; attribute float aW;
uniform float uNKK, uNLen, uNGR, uNGW, uNS0, uNLm, uNJ, uNTPL;
varying vec3 vNWp; varying vec3 vNWn; varying float vNS; varying vec2 vNCS; varying float vNReg; varying float vNNf;
`;
      SH5.vsBody = `#include <begin_vertex>
  /* (the lying middle's place along the path, metres from the stick's head, as set() lays it: stretched evenly, and
     unstretched over its last uNJ metres of the file, its neck, so it meets the head at the head's own scale) */
  float nXm = aO2 * uNLm, nWj = clamp((nXm - (uNLm - uNJ)) / max(uNJ, 1e-4), 0.0, 1.0);
  float nDm = uNS0 * nXm + (uNGR - uNS0) * uNJ * (nWj * nWj * nWj - 0.5 * nWj * nWj * nWj * nWj);
  #ifdef NAGA_GLOW
    /* (as thick as the body is where it stands: thinned with it where it leaves the stick, or a glow of full width stood
       round a thin body there as a pale sleeve, together-phone 5.8 on lab 5) */
    transformed += normal * (uNGW * aW * clamp(uNGR / 0.9, 0.0, 1.0) * (aReg < 1.5 ? smoothstep(0.0, 1.0, clamp(nDm / max(uNTPL, 1e-3), 0.0, 1.0)) : 1.0));
  #endif
  vNWp = (modelMatrix * vec4(transformed, 1.0)).xyz;
  vNWn = normalize(mat3(modelMatrix) * normal);
  vNS = aReg < 0.5 ? 0.0 : (aReg < 1.5 ? nDm : uNKK * uNLen + aO2 * uNGR);
  vNCS = aCS; vNReg = aReg; vNNf = aNf;
`;
      SH5.fsHead = `uniform float uNA, uNT; uniform vec4 uNPho, uNLook; uniform vec3 uNDeep, uNCol, uNRim, uNGlowC, uNGold;
varying vec3 vNWp; varying vec3 vNWn; varying float vNS; varying vec2 vNCS; varying float vNReg; varying float vNNf;
`;
      /* the nearest surface: depth only */
      SH5.depth = `gl_FragColor = vec4(0.0);`;
      /* the body */
      SH5.body = `vec3 nN = normalize(vNWn), nV = normalize(cameraPosition - vNWp);
  float nFr = pow(1.0 - clamp(abs(dot(nN, nV)), 0.0, 1.0), uNLook.y);
  /* the scales: sixteen round the body, 0.17 m long, rows offset by half, each row over the one behind it (its free edge
     toward the tail), flowing slowly toward the head; drawn only on the lying body, and faded where they would be finer
     than the screen can hold */
  vec2 nP = vec2(atan(vNCS.y, vNCS.x) * (16.0 / 6.2831853), (vNS - uNT * 0.28) / 0.17);
  float nJ = floor(nP.y) + 1.0, nO = 0.5 * mod(nJ, 2.0);
  float nD = length(nP - vec2(floor(nP.x - nO) + 0.5 + nO, nJ)) / 0.72;
  if (nD >= 1.0) { nJ -= 1.0; nO = 0.5 * mod(nJ, 2.0); nD = length(nP - vec2(floor(nP.x - nO) + 0.5 + nO, nJ)) / 0.72; }
  float nFw = (fwidth(vNCS.x) + fwidth(vNCS.y)) * (16.0 / 6.2831853) + fwidth(nP.y);
  float nAa = clamp(1.6 - 2.2 * nFw, 0.0, 1.0) * (1.0 - step(1.5, vNReg)) * step(0.5, vNReg);
  float nSc = mix(0.62, mix(0.45, 1.0, smoothstep(0.62, 0.97, nD)) * (1.0 - 0.55 * smoothstep(0.97, 1.0, nD)), nAa * uNLook.w / 0.3);
  /* a slow breath of light down its length */
  float nBr = 0.84 + 0.32 * (0.5 + 0.5 * sin(vNS * 0.7 - uNT * 1.9));
  /* ITS FORM: a key light from over the lens (above it and from its side, wherever the lens stands), so its round body and
     its head's planes read as one solid thing of light; unshaded, its head read as a flat cut-out with a glowing rim and
     its body as see-through cloth (the independent review of ba6a2bb: desk 7.0 and 25.5) */
  float nLam = max(dot(nN, normalize(nV + vec3(0.0, 1.3, 0.0))), 0.0);
  vec3 nCol = mix(uNDeep, uNCol, nSc) * nBr * (0.3 + 0.95 * nLam);
  nCol = mix(nCol, uNRim, nFr * 0.85);
  /* his light: gold on the faces turned to his shoulders, near him, and nowhere else */
  vec3 nL = uNPho.xyz - vNWp; float nDl = length(nL);
  float nGk = uNPho.w * max(dot(nN, nL / max(nDl, 1e-3)), 0.0) * (1.0 - smoothstep(0.5, 2.0, nDl));
  nCol = mix(nCol, uNGold * (0.85 + 0.3 * nFr), clamp(nGk, 0.0, 0.3));
  /* (SOLID: its light uNA makes it brighter or darker, never see-through: at the fight's 0.3 it is a darker ruby lying
     round the court, where a see-through one showed the planters' plants, the skirting's tiles and the window frames
     through it, the review's 11.8 and 25.5; it comes in over its first quarter of light) */
  nCol *= 0.4 + 0.6 * clamp(uNA, 0.0, 1.0);
  gl_FragColor = vec4(nCol, uNLook.x * clamp(uNA * 4.0, 0.0, 1.0));`;
      /* its glow: the outer skin's back faces round the silhouette, brightest at the body's edge, gone a hand away */
      SH5.glow = `vec3 nN = normalize(vNWn), nV = normalize(cameraPosition - vNWp);
  float nK = clamp(-dot(nN, nV), 0.0, 1.0);
  vec3 nL = uNPho.xyz - vNWp; float nGk = uNPho.w * (1.0 - smoothstep(0.6, 2.6, length(nL)));
  gl_FragColor = vec4(mix(uNGlowC, uNGold, clamp(0.25 * nGk, 0.0, 0.25)), pow(nK, 2.0) * uNLook.z * uNA * smoothstep(0.45, 0.6, uNA));`;
      function nagaMat(kind) {
        const m = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, fog: false, toneMapped: false,
          depthWrite: kind === 'depth', colorWrite: kind !== 'depth',
          blending: kind === 'glow' ? THREE.AdditiveBlending : THREE.NormalBlending,
          side: kind === 'glow' ? THREE.BackSide : THREE.FrontSide }); mats.push(m);
        if (kind === 'glow') m.defines = { NAGA_GLOW: 1 };
        m.onBeforeCompile = (sh) => { Object.assign(sh.uniforms, U);
          sh.vertexShader = SH5.vsHead + sh.vertexShader.replace('#include <begin_vertex>', SH5.vsBody);
          const out = sh.fragmentShader.replace('#include <opaque_fragment>', SH5[kind]);
          if (out === sh.fragmentShader) console.warn('e4c5: the Naga\'s light found no line to write (three changed?)');
          sh.fragmentShader = SH5.fsHead + out; };
        /* (a probe's lab may write SH5 and bump SH5.v: each draw is compiled again) */
        m.customProgramCacheKey = () => 'e4c5naga2-' + kind + (SH5.v || '');
        return m;
      }
      /* the path, in the world: from the stick's head up 4.5 m, arching over toward the house, down to the court's far
         corner and round it a little inside the walls: west side, gate end, east side, where its head turns in toward the
         court and rears, facing the house */
      /* (R25: laid round the whole court, its reared head 2 m long ended on the loop's own start, where the dive from the
         arch also lands: the head is the model's own now, rigid, and needs room of its own) */
      function pathFor(sx, sz) {
        const C = COURT, ins = 0.62, x0 = C.x0 + ins, x1 = C.x1 - ins, z0 = C.z0 + 1.15, z1 = HOUSE.face - 0.55, y = 0.32, zm = (z0 + z1) / 2;   // (0.62 off the side walls: at 0.42 the dive's swing into the west side put its body into the wall)
        /* (it rises leaning toward the court's middle: leaning toward the house, from a stick planted near the house end
           its body stood in the house's front) */
        const cxC = (x0 + x1) / 2; let dx = cxC - sx, dz = zm - sz; const dl = Math.hypot(dx, dz); if (dl < 0.3) { dx = 0; dz = 1; } else { dx /= dl; dz /= dl; }
        const pts = [[sx, 1.4, sz], [sx + 0.2 * dx, 3.2, sz + 0.2 * dz], [sx + 0.9 * dx, 5.0, sz + 0.9 * dz], [cxC, 4.2, zm + 1.2], [x0 + 0.4, 1.6, z1 - 0.6]];
        /* (OVER THE PLANTERS: the court's two planters stand against its side walls near the gate, 2 m long and 0.76 to 0.84
           m deep, their plants 0.67 and 0.71 m high (b_world.js PLANT_Z), and the loop's sides 0.62 m in ran through both,
           0.42 m deep, 2143 and 2863 crossings in the film's clipscan. The body is lifted over each, 1.12 m, from 0.85 m
           before it to round the gate end's corner, as a serpent goes over a box: measured at 32 stick places, every
           twentieth of the way, none of it in a planter, a wall or the house) */
        const r = 1.0, HY = 1.12, loop = [[x0, y, z1 - r], [x0, y, -9.1], [x0 + 0.02, HY, -9.95], [x0 + 0.14, HY, -12.6], [x0 + 0.9, HY * 0.9, z0], [x0 + 1.6, y, z0],
                                            [x1 - 1.6, y, z0], [x1 - 0.9, HY * 0.9, z0], [x1 - 0.14, HY, -12.6], [x1 - 0.02, HY, -10.45], [x1, y, -9.6], [x1, y, zm + 1.0]];
        return new THREE.CatmullRomCurve3(pts.concat(loop).map(p => new THREE.Vector3(p[0], p[1], p[2])), false, 'centripetal', 0.5);
      }
      function make() {
        if (st.ready || !have('p5naga')) return;
        parseOnce('p5naga').then(({ scene: src }) => {
          if (!alive) return;
          src.updateMatrixWorld(true);
          let geo = null, bb = new THREE.Box3();
          /* (a quantized file: its points made plain floats FIRST, then placed by its node. Placed first, as written until
             FILMS-2, every coordinate past one metre was written back into the file's 16-bit integers and WRAPPED (three's
             setXYZ rounds and stores, and an Int16Array keeps the low 16 bits): the 8.4 m serpent was folded four times
             into two metres and its 3.6 m head into garbage, and that was laid along the path: the "red sheets of glass".
             Measured: the file's points span z -4.21 .. 4.21 and y 0 .. 3.6; the folded copy spanned -1 .. 1) */
          src.traverse(o => { if (o.isMesh && !geo) { geo = o.geometry.clone();
            for (const nm of ['position', 'normal']) { const p = geo.attributes[nm]; if (!p || (!p.normalized && p.array instanceof Float32Array)) continue;
              const a = new Float32Array(p.count * 3); for (let i = 0; i < p.count; i++) { a[i * 3] = p.getX(i); a[i * 3 + 1] = p.getY(i); a[i * 3 + 2] = p.getZ(i); }
              geo.setAttribute(nm, new THREE.BufferAttribute(a, 3)); }
            geo.applyMatrix4(o.matrixWorld); } });
          if (!geo) return; owned.push(geo);
          geo.computeBoundingBox(); bb.copy(geo.boundingBox);
          /* its length is its longest side (8.41 m, the record's): the body laid along z of the model */
          const ext = bb.getSize(new THREE.Vector3()), along = ext.z >= ext.x ? 'z' : 'x';
          st.minX = along === 'z' ? bb.min.z : bb.min.x; st.maxX = along === 'z' ? bb.max.z : bb.max.x;
          /* ITS LONG TRIANGLES DIVIDED (R25), each into pieces no longer than 5 cm along the body, so the body bends with the
             path at the court's corners instead of cutting across them: its 5.8 m middle is laid along about 21 m of path,
             and a triangle 0.2 to 0.57 m long in the file came out 0.9 to 2.4 m long and laid flat across the inside of
             each turn (324 over 0.8 m, measured). Divided at their middles, each shared middle made once (no cracks), the
             winding kept: 62,393 triangles become 85,916; the longest laid edge 0.43 m */
          if (geo.index) { const ax = along === 'z' ? 2 : 0, P0 = geo.attributes.position.array, N0 = geo.attributes.normal ? geo.attributes.normal.array : null, X0 = geo.index.array;
            const Pa = Array.from(P0), Na = N0 ? Array.from(N0) : null, out = [], mid = new Map(), todo = [];
            for (let q = 0; q < X0.length; q += 3) todo.push([X0[q], X0[q + 1], X0[q + 2]]);
            while (todo.length) { const [a, b, c] = todo.pop(), za = Pa[a * 3 + ax], zb = Pa[b * 3 + ax], zc = Pa[c * 3 + ax];
              const sab = Math.abs(za - zb), sbc = Math.abs(zb - zc), sca = Math.abs(zc - za);
              if (Math.max(sab, sbc, sca) <= 0.05) { out.push(a, b, c); continue; }
              const [i, j, k] = sab >= sbc && sab >= sca ? [a, b, c] : sbc >= sca ? [b, c, a] : [c, a, b];
              const key = i < j ? i * 1048576 + j : j * 1048576 + i; let mi = mid.get(key);
              if (mi === undefined) { mi = Pa.length / 3; Pa.push((Pa[i * 3] + Pa[j * 3]) / 2, (Pa[i * 3 + 1] + Pa[j * 3 + 1]) / 2, (Pa[i * 3 + 2] + Pa[j * 3 + 2]) / 2);
                if (Na) { const nx = Na[i * 3] + Na[j * 3], ny = Na[i * 3 + 1] + Na[j * 3 + 1], nz = Na[i * 3 + 2] + Na[j * 3 + 2], nl = Math.hypot(nx, ny, nz) || 1; Na.push(nx / nl, ny / nl, nz / nl); }
                mid.set(key, mi); }
              todo.push([i, mi, k], [mi, j, k]); }
            const g2 = new THREE.BufferGeometry(); g2.setAttribute('position', new THREE.BufferAttribute(new Float32Array(Pa), 3));
            if (Na) g2.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(Na), 3));
            g2.setIndex(new THREE.BufferAttribute(Pa.length / 3 > 65535 ? new Uint32Array(out) : new Uint16Array(out), 1));
            geo.dispose(); geo = g2; owned.push(geo); }
          /* (each point's place along the body, 0 at the tail and 1 at the head, kept as its own attribute: the body is laid
             on the CPU into the world (set(), below), so the shader cannot read it from the position. As first written the
             shader also set every point to the origin, left from a design that laid the body in the shader, and the Naga
             was never drawn: together-00012, 21 Nov) */
          { const P = geo.attributes.position, nf = new Float32Array(P.count), sp = st.maxX - st.minX;
            for (let i = 0; i < P.count; i++) nf[i] = ((along === 'z' ? P.getZ(i) : P.getX(i)) - st.minX) / sp;
            geo.setAttribute('aNf', new THREE.BufferAttribute(nf, 1)); }
          /* (the body is laid on the CPU, not in the shader: its points moved once a frame the film draws it, along the
             path by their place along the body, a cross-section kept round the path's own frame) */
          const base = geo.attributes.position.array.slice(0);
          st.base = base; st.along = along; st.geo = geo;
          /* ITS OWN CENTRE LINE, taken out of every point before the body is laid along the path (the file's serpent rears and
             waves: 8.4 m long, 0.78 m wide and 3.6 m tall), so only its round cross-section, scales and all, is laid round the
             path. Laid with its waves, each point stood up to 1.8 m off the path and the body came out as sheets of pink glass
             across the court: together-00012 after the shader's fix, 21 Nov */
          { const NB = 200, cx = new Float32Array(NB), cy = new Float32Array(NB), cn = new Float32Array(NB), n = base.length / 3, bin = new Uint16Array(n), sp = st.maxX - st.minX;
            for (let i = 0; i < n; i++) { const ax = along === 'z' ? base[i * 3 + 2] : base[i * 3], c = along === 'z' ? base[i * 3] : base[i * 3 + 2];
              const b0 = Math.min(NB - 1, Math.max(0, Math.floor((ax - st.minX) / sp * NB))); bin[i] = b0; cx[b0] += c; cy[b0] += base[i * 3 + 1]; cn[b0]++; }
            let lx = 0, ly = 0; for (let b0 = 0; b0 < NB; b0++) { if (cn[b0] > 0) { cx[b0] /= cn[b0]; cy[b0] /= cn[b0]; lx = cx[b0]; ly = cy[b0]; } else { cx[b0] = lx; cy[b0] = ly; } }
            st.cl = { cx, cy, bin };
            /* ITS HEAD AND ITS TAIL ARE ITS OWN (R25). The file's serpent lies on the ground for its middle (every slice of
               it 0.7 m tall) and rears at both ends: its tail curls up 2.3 m and its head stands 3.6 m, a column from the
               ground with the hood and the face on it. Laid slice by slice round the path, each reared slice came out a
               flat sheet up to 2.6 m tall, and the head's 22 % of the body, stretched along the path, a 7 m wall of red
               planes across the court and through the people in it: together-phone 5.8, 12.8, 15.2 and 19.9 on deploy 16
               with NormalBlending, 21 Nov. Now the lying middle is laid along the path; the head is carried flat and
               raised at the end WHOLE, the model's own shape, in the path's own frame (its neck meets the body's last
               slice); the tail folds into the stick's head it rises from (set(), below). The middle: the longest run of
               slices under 0.85 m tall */
            const ylo = new Float32Array(NB).fill(1e9), yhi = new Float32Array(NB).fill(-1e9);
            for (let i = 0; i < n; i++) { const b0 = bin[i], y = base[i * 3 + 1]; if (y < ylo[b0]) ylo[b0] = y; if (y > yhi[b0]) yhi[b0] = y; }
            const tall = (b0) => yhi[b0] - ylo[b0] > 0.85 && yhi[b0] > ylo[b0];
            let bT = NB >> 1, bH = NB >> 1; while (bT > 0 && !tall(bT - 1)) bT--; while (bH < NB - 1 && !tall(bH + 1)) bH++;
            const ZT = st.minX + bT * sp / NB, ZH = st.minX + (bH + 1) * sp / NB;
            const reg = new Uint8Array(n), off = new Float32Array(n * 3);
            for (let i = 0; i < n; i++) { const ax = along === 'z' ? base[i * 3 + 2] : base[i * 3], c = along === 'z' ? base[i * 3] : base[i * 3 + 2], y = base[i * 3 + 1], b0 = bin[i];
              if (b0 > bH) { reg[i] = 2; off[i * 3] = c - cx[bH]; off[i * 3 + 1] = y - cy[bH]; off[i * 3 + 2] = ax - ZH; }
              else if (b0 < bT) { reg[i] = 0; off[i * 3] = c - cx[bT]; off[i * 3 + 1] = y - cy[bT]; off[i * 3 + 2] = 0; }
              else { reg[i] = 1; off[i * 3] = c - cx[b0]; off[i * 3 + 1] = y - cy[b0]; off[i * 3 + 2] = (ax - ZT) / Math.max(1e-3, ZH - ZT); } }
            st.reg = reg; st.off = off; st.parts = { ZT, ZH, bT, bH }; }
          /* ITS OWN SMOOTH NORMALS (FILMS-2). The file's 87,610 points stand on 31,214 places, and 55,546 of the 56,396 points
             that share a place with another carry a different normal (up to opposite): a fresnel read on them draws every seam
             as a line and every facet as a shard. Each place's normal is made again from the faces round it (each weighed by
             its area, the file's own winding outward); a point whose place's faces cancel (the two sides of a thin fin meet
             there) keeps its own faces' normal. Kept in the model's frame as (across, up, along), turned with the path at
             each lay (set(), below) */
          if (geo.index) { const P = st.base, X = geo.index.array, n = P.length / 3, rep = new Int32Array(n), idx = new Map(), q = 1e4;
            for (let i = 0; i < n; i++) { const k = Math.round(P[i * 3] * q) + ',' + Math.round(P[i * 3 + 1] * q) + ',' + Math.round(P[i * 3 + 2] * q);
              const r0 = idx.get(k); if (r0 === undefined) { idx.set(k, i); rep[i] = i; } else rep[i] = r0; }
            const acc = new Float64Array(n * 3), own = new Float64Array(n * 3), mag = new Float64Array(n);
            for (let t = 0; t < X.length; t += 3) { const a = X[t], b = X[t + 1], c = X[t + 2];
              const ux = P[b * 3] - P[a * 3], uy = P[b * 3 + 1] - P[a * 3 + 1], uz = P[b * 3 + 2] - P[a * 3 + 2], vx = P[c * 3] - P[a * 3], vy = P[c * 3 + 1] - P[a * 3 + 1], vz = P[c * 3 + 2] - P[a * 3 + 2];
              const fx = uy * vz - uz * vy, fy = uz * vx - ux * vz, fz = ux * vy - uy * vx, fl = Math.hypot(fx, fy, fz);
              for (const v of [a, b, c]) { const r0 = rep[v]; acc[r0 * 3] += fx; acc[r0 * 3 + 1] += fy; acc[r0 * 3 + 2] += fz; mag[r0] += fl; own[v * 3] += fx; own[v * 3 + 1] += fy; own[v * 3 + 2] += fz; } }
            const BN = new Float32Array(n * 3), alZ = st.along === 'z';
            for (let i = 0; i < n; i++) { const r0 = rep[i]; let x = acc[r0 * 3], y = acc[r0 * 3 + 1], z = acc[r0 * 3 + 2], l = Math.hypot(x, y, z);
              if (!(l > 0.3 * mag[r0])) { x = own[i * 3]; y = own[i * 3 + 1]; z = own[i * 3 + 2]; l = Math.hypot(x, y, z); }
              if (!(l > 1e-12)) { x = 0; y = 1; z = 0; l = 1; }
              BN[i * 3] = (alZ ? x : z) / l; BN[i * 3 + 1] = y / l; BN[i * 3 + 2] = (alZ ? z : x) / l; }
            st.bn = BN; }
          /* what the shaders read of each point, laid once: its region (0 the tail, 1 the lying middle, 2 the head), its place
             along its region (the middle's share 0 .. 1, the head's metres past the middle's end), its way round its
             slice's centre line (cosine and sine: an angle itself would be drawn through 0 across the seam at its back),
             and how far its glow stands out (the head's a third of the middle's: its crest and fins are thin) */
          { const n = st.base.length / 3, R = st.reg, O = st.off, B = st.base, cl = st.cl, alZ = st.along === 'z';
            const aReg = new Float32Array(n), aO2 = new Float32Array(n), aCS = new Float32Array(n * 2), aW = new Float32Array(n);
            for (let i = 0; i < n; i++) { const r0 = R[i]; aReg[i] = r0; aO2[i] = r0 === 0 ? 0 : O[i * 3 + 2];
              let cx0 = O[i * 3], cy0 = O[i * 3 + 1];
              if (r0 === 2) { const b0 = cl.bin[i]; cx0 = (alZ ? B[i * 3] : B[i * 3 + 2]) - cl.cx[b0]; cy0 = B[i * 3 + 1] - cl.cy[b0]; }
              const l = Math.hypot(cx0, cy0) || 1; aCS[i * 2] = cx0 / l; aCS[i * 2 + 1] = cy0 / l;
              aW[i] = r0 === 1 ? 1 : r0 === 2 ? 0.35 : 0; }
            geo.setAttribute('aReg', new THREE.BufferAttribute(aReg, 1)); geo.setAttribute('aO2', new THREE.BufferAttribute(aO2, 1));
            geo.setAttribute('aCS', new THREE.BufferAttribute(aCS, 2)); geo.setAttribute('aW', new THREE.BufferAttribute(aW, 1));
            const nb = new THREE.BufferAttribute(new Float32Array(n * 3), 3); nb.setUsage(THREE.DynamicDrawUsage); geo.setAttribute('normal', nb);
            geo.attributes.position.setUsage(THREE.DynamicDrawUsage); }
          /* (the laying maps the model's across, up and along onto the path's B, N and T, and B x N = -T: a mirror. So each
             triangle's order is turned once, here, after its normals were read from the file's own, and the front of the
             laid skin is its outside for the lens: drawn double-sided before, nothing showed which side was which) */
          if (st.along === 'z' && geo.index) { const X = geo.index.array; for (let t = 0; t < X.length; t += 3) { const s0 = X[t + 1]; X[t + 1] = X[t + 2]; X[t + 2] = s0; } }
          const mD = new THREE.Mesh(geo, nagaMat('depth')), mB = new THREE.Mesh(geo, nagaMat('body')), mG = new THREE.Mesh(geo, nagaMat('glow'));
          /* (WHEN IT IS DRAWN, by its light. Bright (its film): after the court's own transparent things and its painted
             ground, and before the cage and the fight's effects (renderOrder 3 and on), which its nearest surface then hides
             where its body stands in front of them, and which stand over it where they are in front. Dim (under 0.5: the
             fight's last stage keeps it at 0.3): LAST, so the effects of the fight behind it show through it and none is
             cut out by a body nearly not there. Dim and drawn among them, only its front faces and nothing nearest, every
             scale and fold of the crumpled model drew its own faint line: glass again, together-phone 26.8 on lab 4) */
          for (const [me, lo, hi] of [[mD, 2.5, 9.5], [mB, 2.6, 9.6], [mG, 2.7, 9.7]]) { me.frustumCulled = false;
            Object.defineProperty(me, 'renderOrder', { get: () => lo, set: () => {}, configurable: true }); g.add(me); }   // (solid now at every light: drawn before the fight's effects always, hi kept for a see-through look)
          st.mesh = mB; st.mat = mB.material; st.meshes = [mD, mB, mG];
          /* ITS EMBERS (the plan's 11: "embers rising"; the film's u5embers): forty sparks of its light, a fixed set (the same
             on every phone: the plan's 13), each rising from a point of its lying body (chosen once, seeded) a metre and a
             third over 1.6 to 2.6 s and going out as it rises; their rise is the shader's, on its clock (uNT), so they rise on
             wherever the body lies, the fight's last stage included, with nothing laid again */
          { const NE = 40, r = rng(28700), pick = []; for (let i = 0; i < st.reg.length; i++) if (st.reg[i] === 1) pick.push(i);
            const ev = new Int32Array(NE), ph = new Float32Array(NE), sp = new Float32Array(NE);
            for (let i = 0; i < NE; i++) { ev[i] = pick[Math.floor(r() * pick.length)] || 0; ph[i] = r(); sp[i] = 1 / (1.6 + r() * 1.0); }
            const eg = new THREE.BufferGeometry(); eg.setAttribute('position', new THREE.BufferAttribute(new Float32Array(NE * 3), 3).setUsage(THREE.DynamicDrawUsage));
            eg.setAttribute('aPh', new THREE.BufferAttribute(ph, 1)); eg.setAttribute('aSpd', new THREE.BufferAttribute(sp, 1)); owned.push(eg);
            const soft = (() => { const [c, x] = canvas(64, 64); const gd = x.createRadialGradient(32, 32, 1, 32, 32, 31);
              gd.addColorStop(0, 'rgba(255,255,255,1)'); gd.addColorStop(0.35, 'rgba(255,255,255,0.55)'); gd.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = gd; x.fillRect(0, 0, 64, 64); return tex(done(THREE, c, false)); })();
            const em = new THREE.PointsMaterial({ map: soft, color: 0xff6a3a, size: 0.11, sizeAttenuation: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false, toneMapped: false }); mats.push(em);
            em.onBeforeCompile = (sh) => { Object.assign(sh.uniforms, U);
              sh.vertexShader = 'attribute float aPh; attribute float aSpd; uniform float uNT; varying float vEA;\n' + sh.vertexShader.replace('#include <begin_vertex>', `#include <begin_vertex>
                float eC = fract(uNT * aSpd + aPh);
                transformed += vec3(sin(aPh * 6.2832 + uNT * 1.3) * (0.12 + 0.2 * aPh), 1.35, cos(aPh * 4.1 + uNT * 1.1) * (0.12 + 0.2 * fract(aPh * 3.7))) * eC;
                vEA = (1.0 - eC) * (1.0 - eC) * smoothstep(0.0, 0.12, eC);`);
              const out = sh.fragmentShader.replace('vec4 diffuseColor = vec4( diffuse, opacity );', 'vec4 diffuseColor = vec4( diffuse, opacity * vEA * smoothstep(0.4, 0.85, uNA) * smoothstep(0.1, 0.6, uNGR) );');
              if (out === sh.fragmentShader) console.warn('e4c5: the Naga\'s embers found no colour line to write (three changed?)');
              sh.fragmentShader = 'uniform float uNA, uNGR; varying float vEA;\n' + out; };
            em.customProgramCacheKey = () => 'e4c5nagaEmbers';
            const pts = new THREE.Points(eg, em); pts.frustumCulled = false; Object.defineProperty(pts, 'renderOrder', { get: () => 2.8, set: () => {}, configurable: true }); g.add(pts); st.emb = { ev, eg, pts }; }
          st.ready = true;
        }).catch(err => { console.warn('p5naga failed to load', err); if (ctx.loadFail) ctx.loadFail('p5naga', err); });
      }
      make();
      const _np = new THREE.Vector3(), _nt = new THREE.Vector3(), _nn = new THREE.Vector3(), _nb = new THREE.Vector3(), _up = new THREE.Vector3(0, 1, 0);
      let laidFor = '';
      /* THE PATH AS A TABLE (R25): its place and its frame (along, across, up from it) at TABN + 1 even steps of its
         length, made once a path, read by a straight blend between two steps (3 cm apart on its ~30 m): every point of
         the body had asked the curve for its place and its turn every frame, 87,610 points twice */
      const TABN = 1024;
      function tabFor(P0) {
        const T = new Float32Array((TABN + 1) * 12);
        for (let j = 0; j <= TABN; j++) { const u = j / TABN; P0.getPointAt(u, _np); P0.getTangentAt(u, _nt);
          _nb.crossVectors(_nt, _up); if (_nb.lengthSq() < 1e-6) _nb.set(1, 0, 0); _nb.normalize(); _nn.crossVectors(_nb, _nt).normalize();
          T.set([_np.x, _np.y, _np.z, _nt.x, _nt.y, _nt.z, _nb.x, _nb.y, _nb.z, _nn.x, _nn.y, _nn.z], j * 12); }
        st.tab = T;
      }
      const FR = new Float32Array(12), FRH = new Float32Array(12), FRT = new Float32Array(12), FRP = new Float32Array(12), FRQ = new Float32Array(12);
      function frameAt(u, out) {
        const T = st.tab, x = Math.max(0, Math.min(1, u)) * TABN, j = Math.min(TABN - 1, Math.floor(x)), w = x - j, a = j * 12, b = a + 12;
        for (let q = 0; q < 12; q++) out[q] = T[a + q] + (T[b + q] - T[a + q]) * w;
        return out;
      }
      return {
        g, U,
        /* k: the head's place along the path (0 .. 1); a: its light; t: the scales' clock; (sx, sz): the stick's head; s:
           the body's thickness (the model's 0.78 m is laid at s of it) */
        set(k, a, t, sx, sz, s = 0.9) {
          /* (hidden, it forgets its laying and its head, so nothing aimed at its head reads a head from another moment: a seek
             back to before it rises found the head where a later moment had laid it) */
          if (!st.ready || !(a > 0.001)) { g.visible = false; st.laid = ''; st.head = null; return; }
          g.visible = true; U.uNA.value = a; U.uNT.value = t; U.uNK.value = k;
          const key = sx.toFixed(2) + ',' + sz.toFixed(2);
          if (!st.path || laidFor !== key) { st.path = pathFor(sx, sz); st.len = st.path.getLength(); laidFor = key; tabFor(st.path); }
          /* THE LYING MIDDLE stretched from the stick's head to where the head has come (k), thin where it leaves the stick
             (its first 1.6 m: it rises from a point; full-thick, it brushed his teacher's arm); THE HEAD standing whole on
             its leading point (below); THE TAIL folded into the stick's head. All of it grows out of the stick over the
             first quarter of the way, and nothing goes under the ground (each point held at 1 cm over it). Measured again
             with the file read whole (FILMS-2: before, the file was folded into two metres, see make()), every twentieth of
             the way at 32 stick places (eight places over the court, each faced four ways): none of it in a wall or the
             house */
          /* (its girth and its head grow to their full size over its first tenth of the way, 2.6 m of the 25.6: grown over
             its first quarter, it rose as a red thread with a speck for a head for two seconds, together-phone 3.5 on the
             candidate 0f693b7; now its head is a third of its size a metre out of the stick and whole at the top of its
             rise. Laid so, none of it is in a wall, a planter or the house at 32 stick places, every twentieth of the way) */
          const kk = Math.max(0, Math.min(1, k)), gr = s * smo(c01(kk / 0.10)), arr = st.geo.attributes.position.array, n = arr.length / 3;
          /* THE NECK UNSTRETCHED (FILMS-2). The lying middle is laid stretched along the path (its 5.8 m in the file over up to
             25.6 m) and the head is not, so where they met the body's detail and its normals changed in one step: a twisted
             ring round its neck, together-phone 14, 15.4 and 16.5 on ba6a2bb (at 15.4 the path and the head stand within a
             degree of each other there: the ring was the stretch). Now the middle's last half metre of the file, its neck,
             eases to the head's own scale along the path (its stretch S0 elsewhere, so the whole still ends at the head's
             place); and it thins out of the stick over at most six tenths of its laid length, so a body still short is never
             a thread under its head (together-phone 3.5: a flower on a stem) */
          const Lm = Math.max(1e-3, st.parts.ZH - st.parts.ZT), NJ = Math.min(0.5, 0.3 * Lm), NZ0 = Lm - NJ, LK = kk * st.len;
          const S0 = Math.max(1e-3, (LK - gr * NJ / 2) / (Lm - NJ / 2)), TPL = Math.max(1e-3, Math.min(1.6, 0.6 * LK));
          U.uNKK.value = kk; U.uNLen.value = st.len; U.uNGR.value = gr; U.uNS0.value = S0; U.uNLm.value = Lm; U.uNJ.value = NJ; U.uNTPL.value = TPL;
          /* (laid again only when its laying moves: once it lies whole, a frame changes its light and clock alone) */
          const lk = key + '|' + kk.toFixed(6) + '|' + gr.toFixed(5);
          if (st.laid === lk) return;
          st.laid = lk;
          const R = st.reg, O = st.off, B = st.base, cl = st.cl, LEN = st.len, alZ = st.along === 'z', T0 = frameAt(0, FRT), F = FR;
          /* THE HEAD CARRIED WHOLE AND UPRIGHT (FILMS-2, with the file read whole at last: the "flat" head of the rewrite
             was each slice of the reared neck and head pressed to the body's height round the path, a jagged wedge at the
             body's front): the model's own reared neck, head and crest, rigid, standing on the body's leading point (where
             the lying middle ends: the neck's foot is that slice), upright, and facing the way the path goes 4 m ahead
             over the ground (the chord's way, so at a turn it already faces along the next side and never into a wall: at
             1.9 m ahead it stood 0.3 m into the west wall as it came down to the north-west corner; at 4 m none of it is in
             a wall or the house, every twentieth of the way, at 32 stick places, masters/v28.0 calc). It rises with the
             body out of the stick, looks over the court from the top of its arch, comes down and goes round with its head
             up, and stands at the end of the east side facing the house: always the Naga's own head, never a wedge */
          const HA = frameAt(kk, FRH), HQ = frameAt(Math.min(1, kk + 4.5 * Math.max(gr, 0.05) / LEN), FRQ);
          let hx = HQ[0] - HA[0], hz = HQ[2] - HA[2], hl = Math.hypot(hx, hz); if (hl < 1e-3) { hx = HA[3]; hz = HA[5]; hl = Math.hypot(hx, hz) || 1; } hx /= hl; hz /= hl;
          st.head = [HA[0] + hx * 0.8 * gr, HA[1] + 1.6 * gr, HA[2] + hz * 0.8 * gr];
          /* (its normals turned with it: the model's (across, up, along) onto the path's (B, N, T), the along part scaled by
             the cross-section's scale over the middle's stretch along the path, as a stretched skin's normals are) */
          const NR = st.geo.attributes.normal.array, BN = st.bn;
          /* (THE NECK'S SLOPE: where the path rises or falls under the head, over the planters' humps, the neck's slices are
             turned toward the head's upright along its length, so the two meet in one ring: 13 degrees apart at the east
             hump's foot, together-phone 14. A slope steeper than 25 degrees there (its rise out of the stick, the dive to the
             far corner) is laid as it was, the turn eased out by 45, where turning the slices would press the neck flat) */
          const nj0 = HA[9], nj1 = HA[10], nj2 = HA[11], kl = Math.hypot(nj2, nj0), PH = Math.atan2(kl, nj1);
          const PA = kl > 1e-6 ? PH * (1 - smo(c01((PH - 0.436) / 0.349))) : 0, kx = kl > 1e-6 ? -nj2 / kl : 0, kz = kl > 1e-6 ? nj0 / kl : 0;
          for (let i = 0; i < n; i++) {
            const o0 = O[i * 3], o1 = O[i * 3 + 1], o2 = O[i * 3 + 2], r = R[i];
            const bx = BN ? BN[i * 3] : 0, by = BN ? BN[i * 3 + 1] : 1, ba = BN ? BN[i * 3 + 2] : 0;
            let px, py, pz, ex, ey, ez;
            if (r === 1) { const xm = o2 * Lm; let d, sg, wj = 0;
              if (xm <= NZ0) { d = S0 * xm; sg = S0; }
              else { wj = (xm - NZ0) / NJ; const w3 = wj * wj * wj; d = S0 * xm + (gr - S0) * NJ * (w3 - 0.5 * w3 * wj); sg = S0 + (gr - S0) * wj * wj * (3 - 2 * wj); }
              frameAt(d / LEN, F); const tp = smo(c01(d / TPL)), xx = o0 * gr * tp, yy = o1 * gr * tp, na = ba * Math.max(0.02, gr * tp) / Math.max(1e-3, sg);
              let vx = F[6] * xx + F[9] * yy, vy = F[7] * xx + F[10] * yy, vz = F[8] * xx + F[11] * yy;
              ex = F[3] * na + F[6] * bx + F[9] * by; ey = F[4] * na + F[7] * bx + F[10] * by; ez = F[5] * na + F[8] * bx + F[11] * by;
              if (wj > 0 && PA > 1e-4) { const a = PA * wj * wj * (3 - 2 * wj), ca = Math.cos(a), sa = Math.sin(a);
                let kv = kx * vx + kz * vz, qx = vx * ca - kz * vy * sa + kx * kv * (1 - ca), qy = vy * ca + (kz * vx - kx * vz) * sa, qz = vz * ca + kx * vy * sa + kz * kv * (1 - ca);
                vx = qx; vy = qy; vz = qz;
                kv = kx * ex + kz * ez; qx = ex * ca - kz * ey * sa + kx * kv * (1 - ca); qy = ey * ca + (kz * ex - kx * ez) * sa; qz = ez * ca + kx * ey * sa + kz * kv * (1 - ca);
                ex = qx; ey = qy; ez = qz; }
              px = F[0] + vx; py = F[1] + vy; pz = F[2] + vz;
              /* (A SOLID BODY OF SCALES: its normal leaned seven tenths to its tube's own way out from the path, so it is shaded
                 as one round body with the shader's scales on it; read whole from the file, every lump and crumple of the
                 generated skin was drawn as a facet, and its glow, pushed out along them, as see-through copies round its
                 outline: the independent review of ba6a2bb, phone 4.2 and 5.8, "crumpled, faceted", "copies stacked") */
              const tl = Math.hypot(vx, vy, vz), el0 = Math.hypot(ex, ey, ez);
              if (tl > 1e-6 && el0 > 1e-9) { ex = 0.3 * ex / el0 + 0.7 * vx / tl; ey = 0.3 * ey / el0 + 0.7 * vy / tl; ez = 0.3 * ez / el0 + 0.7 * vz / tl; } }
            else if (r === 2) { /* (the model's across onto (-hz, 0, hx), its up onto the world's, its along onto (hx, 0, hz): the
                 path's own B, N, T where the path lies level, so the neck's foot meets the body there exactly) */
              px = HA[0] + (-hz * o0 + hx * o2) * gr; py = HA[1] + o1 * gr; pz = HA[2] + (hx * o0 + hz * o2) * gr;
              ex = -hz * bx + hx * ba; ey = by; ez = hx * bx + hz * ba; }
            else { px = T0[0]; py = T0[1]; pz = T0[2]; ex = T0[3]; ey = T0[4]; ez = T0[5]; }
            arr[i * 3] = px; arr[i * 3 + 1] = Math.max(0.01, py); arr[i * 3 + 2] = pz;
            const el = Math.hypot(ex, ey, ez) || 1; NR[i * 3] = ex / el; NR[i * 3 + 1] = ey / el; NR[i * 3 + 2] = ez / el;
          }
          st.geo.attributes.position.needsUpdate = true; st.geo.attributes.normal.needsUpdate = true; st.geo.computeBoundingSphere();
          if (st.emb) { const E = st.emb, ep = E.eg.attributes.position.array; for (let i = 0; i < E.ev.length; i++) { const v = E.ev[i]; ep[i * 3] = arr[v * 3]; ep[i * 3 + 1] = arr[v * 3 + 1]; ep[i * 3 + 2] = arr[v * 3 + 2]; }
            E.eg.attributes.position.needsUpdate = true; }
        },
        /* HIS LIGHT on it: where his gold stands (his shoulders) and how strong (0 none); the faces turned to it go gold */
        light(x, y, z, k) { U.uNPho.value.set(x, y, z, k); },
        ready: () => st.ready,
        /* the middle of its head as last laid (a film aims at it: a pure function of the film's clock, as set() is), or null */
        headAt: () => (st.ready && st.head ? st.head.slice() : null),
        /* (a probe's lab: its state, its draws; tools/probes/e4c5nagalab.mjs) */
        lab: () => Object.assign(st, { SH: SH5, U }),
        /* a place on its path `d` metres from the stick's head, where the films aim (the same path set() lays) */
        pointAtDist(sx, sz, d) {
          const key = sx.toFixed(2) + ',' + sz.toFixed(2);
          if (!st.path || laidFor !== key) { st.path = pathFor(sx, sz); st.len = st.path.getLength(); laidFor = key; tabFor(st.path); }
          const F = frameAt(d / st.len, FRP); return [F[0], F[1], F[2]];
        }
      };
    })();

    /* ---------------------------------------------------------------- THE RITE'S THINGS (case three, every ending: the
       plan's 4.9). The holy water in chapter 4's bowl on the cloth, the fan (chapter 3's, declared) in Grandmaster Pho's
       hand, the drops it throws (painted light: a fixed set, the same every run), the black bag and its white string */
    const RITE5 = (() => {
      const R = ROOM, top = 0.345;
      const bowl = place('w4waterbowl', R.cx + 0.34, top, R.cz + 0.26, 0, { name: 'riteBowl' }); bowl.visible = false;
      const fan = place('w3fan', 0, 0, 0, 0, { name: 'riteFan' }); fan.visible = false;
      /* the drops: a fixed set of soft points, each flying its own arc from the fan to the cloth (v6.15: seeded) */
      const soft = (() => { const [c, x] = canvas(64, 64); const gr = x.createRadialGradient(32, 32, 1, 32, 32, 31);
        gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.5, 'rgba(220,235,255,0.5)'); gr.addColorStop(1, 'rgba(200,220,255,0)'); x.fillStyle = gr; x.fillRect(0, 0, 64, 64); return tex(done(THREE, c, false)); })();
      const drops = [], r = rng(28640);
      for (let i = 0; i < 26; i++) { const m = new THREE.SpriteMaterial({ map: soft, color: 0xdfefff, transparent: true, opacity: 0, depthWrite: false }); mats.push(m);
        const sp = new THREE.Sprite(m); sp.scale.setScalar(0.012 + r() * 0.01); sp.visible = false; world.add(sp);
        drops.push({ sp, m, dx: (r() - 0.5) * 0.9, dz: (r() - 0.5) * 0.55, up: 0.05 + r() * 0.12, lag: r() * 0.18, life: 0.55 + r() * 0.25 }); }
      /* the white sacred string round the bag's neck (the case file: "sealed tightly with sacred string"): a ring of cord */
      const mStr = new THREE.MeshStandardMaterial({ color: 0xf4f0e4, roughness: 0.8 }); mats.push(mStr);
      const gStr = new THREE.TorusGeometry(0.034, 0.0035, 6, 28); gStr.rotateX(Math.PI / 2); owned.push(gStr);
      const strRing = new THREE.Group(); for (let i = 0; i < 3; i++) { const me = new THREE.Mesh(gStr, mStr); me.position.y = i * 0.0065; strRing.add(me); } strRing.visible = false; world.add(strRing);
      return {
        bowl, fan, drops, strRing,
        /* one throw of the fan: the drops leave the fan's head at `t0` toward the pieces (cx, cz) and fall on the cloth */
        throwAt(t, t0, from, cx, cz) {
          for (const d of drops) { const u = (t - t0 - d.lag) / d.life;
            if (u < 0 || u > 1) { d.sp.visible = false; continue; }
            d.sp.visible = true; d.m.opacity = 0.85 * (1 - u * u);
            d.sp.position.set(lp(from[0], cx + d.dx, u), lp(from[1], top + 0.01, u) + d.up * 4 * u * (1 - u), lp(from[2], cz + d.dz, u)); } },
        dropsOff() { for (const d of drops) d.sp.visible = false; },
        /* the string round the tied bag's neck, by k (0 none: the bag as it came) */
        string(k, bag) { strRing.visible = k > 0.01 && !!bag && bag.visible; if (!strRing.visible) return; strRing.position.set(bag.position.x, bag.position.y + 0.295, bag.position.z); strRing.scale.setScalar(0.92 + 0.08 * k); }
      };
    })();

    /* ---------------------------------------------------------------- THE COLLECTOR'S PIECES ON THE CLOTH (the plan's
       4.7 and 9.4: "about twenty, in rows"): the three made for this case where the play's presences sit on them
       (c_play.js TABLE5: the angry knot's bull, the hungry one's bottle, the effigy), and beside them in rows the seven
       Yin pieces of chapter 1 as other men's pieces of the same kinds (declared): twenty on the cloth, and the case's foam
       beside them. Laid out by the film in (they are not on the table before it), and gathered into the bag in the rite */
    const PIECES5 = (() => {
      const R = ROOM, top = 0.345, keys = ['e4kuman', 'e4ngang', 'e4tani', 'e4phraioil', 'e4phraitab', 'e4praicase', 'e4tanitab'];
      const list = [];
      /* three rows across the table's front half (the cloth's x -0.55 .. 0.55), the presences' three where the play
         puts them (TABLE5.P) and the rest about them, a little apart, each turned to him */
      /* (CLEAR OF THE PADDED CASE, PLAY's finding: the case stands at (cx - 0.36, cz - 0.05), 0.34 by 0.27 m turned 18
         degrees, so its footprint runs to x -0.17 over z cz - 0.21 .. cz + 0.11, and four pieces of the two rows behind the
         first stood inside it. Those rows now start east of it (x -0.15), and a fourth row behind them takes the rest) */
      const rowsZ = [R.cz - 0.30, R.cz - 0.18, R.cz - 0.06, R.cz + 0.06], xs = [-0.52, -0.40, -0.28, -0.16, -0.04, 0.08, 0.20, 0.32, 0.44, 0.54];
      const caseX = R.cx - 0.15, caseZ0 = R.cz - 0.24, caseZ1 = R.cz + 0.14;
      let n = 0; const r = rng(28650);
      for (let j = 0; j < rowsZ.length && n < 17; j++) for (let i = 0; i < xs.length && n < 17; i++) {
        const x = xs[i] + (j % 2) * 0.05, z = rowsZ[j];
        const clash = [TABLE5.P.angry, TABLE5.P.hungry, TABLE5.P.energy].some(p => Math.hypot(p.x - x, p.z - z) < 0.09);
        if (clash || x > 0.56 || x < -0.56 || (x < caseX && z > caseZ0 && z < caseZ1)) continue;
        const key = keys[n % keys.length], g = place(key, x, top, z, Math.PI + (r() - 0.5) * 0.3, { name: 'piece' + n }); list.push({ g, x, z }); n++;
      }
      return { list, set(on) { for (const p of list) p.g.visible = on; for (const k of ['w5wuathanu', 'w5rakyom', 'w5hunphayon']) if (things[k]) things[k].visible = on; } };
    })();

    const FILMS5 = {};

    /* ================================================================ THE OPENING (the plan's 4.0; its clock OP5, z_tail.js)
       Black, a lift's hum, his voice: the case. INSIDE A LIFT CAR, through his eyes (no chapter has stood the player in
       one): the floor's number over the doors climbing, Grandmaster Pho in white before him watching it, Ton at his left
       with the long thing wrapped in cloth upright at his side, Jun at his right with the duffel; Jun's line, then Ton's,
       each turning his head back to him. The chime; the doors open on the walkway in orange evening light; his teacher
       out first, then the two; his step out, and the picture SOURS from its edges (the sixty-second seam's sour tint), his
       breath stopping; his thought. Black: the title over it. Play begins where the film left him, a step outside */
    FILMS5.open = {
      begin(api, s) {
        if (api && api.handsRoot) api.handsRoot.visible = false;
        FM5.once = new Set(); FM5.lit = ''; FM5.s = s;
        liftDoors(0); LIFTNUM5.set(0);
        fmShow(cast.pho, true); fmShow(cast.ton, true); fmShow(cast.zav, false);
        whenReady(cast.jun, (P) => fmShow(P, true));
        STICK5.to('tonWrap');
        DUFFEL5.to('jun');
      },
      frame(t) {
        const T = OP5;
        fmLook('DUSK');
        /* the walkway's evening comes in as the doors open; the smell under it from his step out */
        fmBeds({ walk: 0.55 * smo(c01((t - T.open) / 1.6)), sour: 0.32 * smo(c01((t - T.sour) / 2.0)) });
        /* the car's number: 1, then 2, then 3 (the walkway's storey) as the chime comes */
        LIFTNUM5.set(t < T.out + 1.0 ? (t < T.num2 ? 0 : t < T.num3 ? 1 : 2) : -1);
        liftDoors(smo(c01((t - T.open) / 1.5)));
        /* his teacher: before him, facing the doors, his eyes on the number; out first, down the walkway to where he waits */
        /* (his look on the number let go over his first steps out, never dropped in one frame: R25) */
        whenReady(cast.pho, (P) => { fmWalk(P, t, T.out, [CAR5.pho, [0.04, 0.7], [STATION.walk.pho.x, STATION.walk.pho.z]], 1.05, restOf5('pho', t), STATION.walk.pho.ry, { ry0: Math.PI });
          const kl = 0.55 * (1 - smo(c01((t - T.out) / 0.6))); if (kl > 0.001) lookNow(P, [0, 2.2, LIFT.z0], kl, 0.6); });
        /* Ton, at his left, the wrapped staff upright in his right hand: his line turned back over his shoulder; out after
           his teacher, single file through the doors, turning back to him on the walkway as he stops */
        whenReady(cast.ton, (P) => { const r = restOf5('ton', t);
          if (t < T.tonOut) { put(P, CAR5.ton[0], CAR5.ton[1], Math.PI + angTo(Math.PI, faceTo(CAR5.ton[0], CAR5.ton[1], CAR5.eye[0], CAR5.eye[2])) * 0.55 * smo(c01((t - T.tn5o1 + 0.5) / 0.6)) * (1 - smo(c01((t - T.tn5o1 - SECS.tn5o1) / 0.8))));
            fmTalk(P, 'ton', t, T.tn5o1, SECS.tn5o1, 'Stand_and_Chat');
            lookNow(P, 'lens', smo(c01((t - T.tn5o1 + 0.3) / 0.6)) * (1 - smo(c01((t - T.tn5o1 - SECS.tn5o1) / 0.8))), 0.85, 0.12); }
          else { fmWalk(P, t, T.tonOut, [CAR5.ton, [-0.16, 1.0], [STATION.walk.ton.x, STATION.walk.ton.z]], 1.0, r, STATION.walk.ton.ry, { ry0: Math.PI });   // (turned from where he stood, never snapped to the path)
            if (t > T.sour) lookNow(P, 'lens', smo(c01((t - T.sour) / 1.2)) * 0.8, 0.8); }
          STICK5.carry(P); });
        /* Jun, at his right, the duffel in his hand: his line, then out last before him */
        whenReady(cast.jun, (P) => { const r = restOf5('jun', t);
          /* (each half-turns his body back to him for his line and the head does the rest (v14.5: a man talking to him turns to
             him); facing the doors, the back of Jun's head filled the phone as he spoke: open-phone film-012_5, R25) */
          if (t < T.junOut) { put(P, CAR5.jun[0], CAR5.jun[1], Math.PI + angTo(Math.PI, faceTo(CAR5.jun[0], CAR5.jun[1], CAR5.eye[0], CAR5.eye[2])) * 0.55 * smo(c01((t - T.ju5o1 + 0.5) / 0.6)) * (1 - smo(c01((t - T.ju5o1 - SECS.ju5o1) / 0.8))));
            fmTalk(P, 'jun', t, T.ju5o1, SECS.ju5o1, 'Talk_with_Right_Hand_Open');
            lookNow(P, 'lens', smo(c01((t - T.ju5o1 + 0.3) / 0.6)) * (1 - smo(c01((t - T.ju5o1 - SECS.ju5o1) / 0.8))), 0.85, 0.12); }
          else { fmWalk(P, t, T.junOut, [CAR5.jun, [0.14, 1.0], [STATION.walk.jun.x, STATION.walk.jun.z]], 1.0, r, STATION.walk.jun.ry, { ry0: Math.PI });
            if (t > T.sour) lookNow(P, 'lens', smo(c01((t - T.sour - 0.4) / 1.2)) * 0.8, 0.8); }
          DUFFEL5.carry(P); });
        /* THE SOUR: the colour thinned toward grey-green from the edges in as he steps out, and held */
        if (kit && kit.chill) { const k = smo(c01((t - T.sour) / 2.4)) * 0.85 * (1 - smo(c01((t - T.black - 0.2) / 0.6)));
          if (k > 0.002 || FM5.sour) { kit.chill(k, { tint: 'sour', cine: true }); FM5.sour = k > 0.002; } }
        /* THE LENS (his eyes): the number, close; the car, wide (a cramped room gets a wider lens on a phone: v24.21);
           Jun's line, Ton's; the doors; his step out, a breath of a bob; the walkway, where play begins (its snapshot) */
        const D = [0, 2.2, LIFT.z0], W = [0, 1.45, -8.0];
        fmTrack(t, [
          { t: 0, name: 'number', eye: [0.04, EYE, 2.5], at: D, fp: 26, fd: 22 },
          { t: T.ju5o1 - 1.4, name: 'number', eye: [0.04, EYE, 2.52], at: [0, 2.15, LIFT.z0], fp: 36, fd: 30 },
          /* (the car wide at the lens Jun's shot keeps: at 74 and 62 the lens went out and came back 6 and 10 degrees inside
             1.1 s as the look came round to him, a breathing lens, e4c5filmread BOUNCE) */
          { t: T.ju5o1 - 0.6, name: 'car', eye: CAR5.eye, at: [0.08, 1.42, 1.5], fp: 68, fd: 52 },
          { t: T.ju5o1 + 0.5, name: 'jun', eye: CAR5.eye, at: () => fmHead(cast.jun, [0.5, 1.5, 1.9]), fp: 68, fd: 52 },
          /* (a phone's lens for each of the two in the car 68 degrees (a cramped room's wider lens, v24.21): at 60 a talking
             head swung to the frame's edge, e4c5filmread FRAME, deploy 12)
             (Jun to Ton on a CUT between their lines: panned over the last 0.3 s of Jun's line, a phone lost him before his
             last word, and the 70 degree pan was a whip: e4c5filmread FRAME, R25) */
          { t: T.ju5o1 + SECS.ju5o1 + 0.12, name: 'jun', eye: CAR5.eye, at: () => fmHead(cast.jun, [0.5, 1.5, 1.9]), fp: 68, fd: 52 },
          { t: T.ju5o1 + SECS.ju5o1 + 0.15, name: 'ton', eye: CAR5.eye, at: () => fmHead(cast.ton, [-0.5, 1.5, 1.85]), fp: 68, fd: 52, cut: true },
          { t: T.tn5o1 + 0.4, name: 'ton', eye: CAR5.eye, at: () => fmHead(cast.ton, [-0.5, 1.5, 1.85]), fp: 68, fd: 52 },
          { t: T.tn5o1 + SECS.tn5o1 - 0.2, name: 'ton', eye: CAR5.eye, at: () => fmHead(cast.ton, [-0.5, 1.5, 1.85]), fp: 68, fd: 52 },
          { t: T.chime, name: 'doors', eye: CAR5.eye, at: [0.03, 1.45, 0.6], fp: 70, fd: 60 },
          { t: T.step, name: 'doors', eye: CAR5.eye, at: [0.02, 1.48, -2.0], fp: 70, fd: 60 },
          /* (his two steps out, one move at a walk's pace: 2.3 m over 1.9 s; a key between them made it stop and lurch, the
             eye 45 cm in a tenth of a second, measured: lensread.py) */
          { t: T.sour + 0.5, name: 'out', eye: [0.0, EYE, 0.3], at: W, fp: 66, fd: 60 },
          { t: T.q5o2, name: 'out', eye: [0.0, EYE, 0.27], at: [0.0, 1.5, -9.0], fp: 64, fd: 60 },
          fmSnapKey(T.end - 0.3, 'play') || { t: T.end - 0.3, name: 'play', eye: [0, EYE, 0.25], yaw: 0, pitch: -0.04, fp: PLAYFOV5, fd: PLAYFOV5 }
        ]);
        /* (a step's own small bob of the eye, as a man's walk carries it: two steps, 0.6 s each) */
        if (t > T.step && t < T.step + 2.2) yaw.position.y += -0.018 * Math.abs(Math.sin((t - T.step) * Math.PI / 0.6));
      },
      end() { fmLens(PLAYFOV5); LIFTNUM5.set(-1); liftDoors(0); if (kit && kit.chill && FM5.sour) kit.chill(0, { tint: 'sour' }); FM5.sour = false;
        endPhase5('walk'); }
    };

    /* ---------------------------------------------------------------- THE DUFFEL IN JUN'S HAND (w5duffel, the world's,
       stage.things): carried by its handles from his left hand, laid there from his standing rest once and carried by the
       hand bone after; set down where the story puts it (the rite's things at the doorway: RITE) */
    const DUFFEL5 = {
      who: 'away', off: null,
      to(who) { this.who = who; const g = things.duffel; if (!g) return; if (who !== 'jun' && g.parent !== world) world.attach(g); g.visible = who !== 'away'; },
      carry(P) { const g = things.duffel; if (!g || this.who !== 'jun' || !P || !P.ready) return; this.off = handHold5(P, 'Left', g, this.off, { hang: 0.03, ry: Math.PI / 2, out: 0.1 }); }
    };
    /* A THING CARRIED IN ONE HAND (Ton's wrapped staff, Jun's duffel): its offset from the hand bone made ONCE, from the
       body's standing rest (its handles or its shaft at the palm's middle), and the thing carried by the hand bone from
       then on, so it goes where the hand goes in every take. `hang`: how far below the palm its top is (a bag) or, with
       `upright`, its foot over the floor (a staff carried) */
    const _hhA = new THREE.Vector3(), _hhO = new THREE.Vector3(), _hhM = new THREE.Matrix4(), _hhQ = new THREE.Quaternion(), _hhS = new THREE.Vector3(1, 1, 1), _lbM = new THREE.Matrix4(), _lbI = new THREE.Matrix4();
    /* a thing's box in its OWN frame (its meshes carried by their matrices relative to it), whatever stands it in the world */
    function localBox5(g) { const bb = new THREE.Box3(); g.updateWorldMatrix(true, true); _lbI.copy(g.matrixWorld).invert();
      g.traverse(o => { if (!o.isMesh || !o.geometry) return; if (!o.geometry.boundingBox) o.geometry.computeBoundingBox();
        bb.union(o.geometry.boundingBox.clone().applyMatrix4(_lbM.multiplyMatrices(_lbI, o.matrixWorld))); });
      return bb.isEmpty() ? null : bb; }
    function handHold5(P, sd, g, off, o = {}) {
      const hb = boneOf(P, sd + 'Hand'); if (!hb || !g) return off;
      if (!off && !g.userData.model) return off;                               // (not landed yet: its size is not known, nothing is kept)
      /* A THING THAT HANGS OR STANDS IN A HAND (a staff carried upright, a bag by its handles) keeps itself upright, turned
         with the body, its grip at the palm's middle: it goes where the hand goes and never takes the hand's swing (laid on the
         hand bone, the wrapped staff swung 35 degrees off upright with every step: open-phone film-024_5, 21 Nov). Only a
         thing worked by the hand (the fan, `base`) turns with it */
      const world5 = !!o.upright || o.base == null;
      if (!off) {
        const keep = {}; for (const k in P.acts) keep[k] = [P.acts[k].time, P.w[k]];
        const cur = P.cur, ft = P.filmT, gp = P.group.position.clone(), gr = P.group.rotation.y;
        const R0 = o.rest || ['Idle_3', 2.0]; pose(P, R0[0], R0[1], true); P.group.updateWorldMatrix(true, true);
        const pm = palmOf(P, sd, _hhA);
        /* (upright: its length, which lies along its own x, stood up by a quarter turn about z, and raised so that its LOWEST
           point is `foot` over the floor: the wrapped staff's file is centred on its length (x -0.75 .. 0.75), so stood up from
           its middle half of it was under the paving, and the photographs showed a stump from the floor to his hand) */
        if (o.upright) { const bx = localBox5(g); off = { grip: pm.y - ((o.foot != null ? o.foot : 0.04) - (bx ? bx.min.x : 0)) }; }
        else if (world5) { const bx = localBox5(g), hgt = bx ? bx.max.y - bx.min.y : 0.3; off = { grip: (o.hang || 0) + hgt + (bx ? bx.min.y : 0) }; }
        else { const pos = new THREE.Vector3(pm.x, pm.y - o.base, pm.z), q = _hhQ.setFromAxisAngle(new THREE.Vector3(0, 1, 0), gr + (o.ry || 0));
          _hhM.compose(pos, q, _hhS); hb.updateWorldMatrix(true, false);
          off = new THREE.Matrix4().copy(hb.matrixWorld).invert().multiply(_hhM); }
        for (const k in P.acts) { P.acts[k].time = keep[k][0]; P.w[k] = keep[k][1]; P.acts[k].setEffectiveWeight(keep[k][1]); }
        P.cur = cur; P.filmT = ft; P.group.position.copy(gp); P.group.rotation.y = gr; P.mixer.update(0);
      }
      if (world5) {
        if (g.parent !== world) world.attach(g);
        P.group.updateWorldMatrix(true, true); const pm = palmOf(P, sd, _hhA); if (!pm) return off;
        g.position.set(pm.x, pm.y - off.grip, pm.z);
        /* (`out`, metres: carried BESIDE the body, the thing drawn that far out from the hand along the line from his hips
           to it, level: hung under the palm's middle, the duffel's width and the staff's foot went through his thigh as he
           walked, clipscan's pairs in the opening (staffWrap and duffel against their carriers, 600 to 1900 crossings)) */
        if (o.out && P.hips) { P.hips.getWorldPosition(_hhO); const dx = pm.x - _hhO.x, dz = pm.z - _hhO.z, dl = Math.hypot(dx, dz);
          if (dl > 1e-4) { g.position.x += dx / dl * o.out; g.position.z += dz / dl * o.out; } }
        if (o.upright) g.rotation.set(0, P.group.rotation.y + (o.ry || 0), Math.PI / 2, 'YXZ'); else g.rotation.set(0, P.group.rotation.y + (o.ry || 0), 0);
        g.visible = true; return off;
      }
      if (g.parent !== hb) hb.add(g);
      off.decompose(g.position, g.quaternion, g.scale); g.visible = true;
      return off;
    }

    /* WHERE TON'S 'give' HOLDS HIS BODY (R25, measured on deploy 12, e4c5films seek rows): his file's take steps 0.77 m toward
       the one he gives to by its held moment (2.6 s), and the cast's offset for a take is its FIRST moment's, so stood on his
       mark he gave from inside the one he gave to: in the lift his head through his teacher's face (bagtied 62 s), at the
       unwrap his body in his teacher's and the close of his hands on an empty wall (prepare 6.5 s), in the living room his
       back in the shot's way. The held moment's offset is measured ONCE on his own body (his hips with his group at the
       origin, unturned) and his group set back by it, so his hips stand on the mark and his hands 0.4 m before it */
    const _goV = new THREE.Vector3();
    function giveOff5(P) {
      if (P.__giveOff) return P.__giveOff;
      if (!P.ready || !P.hips || !P.acts.give) return [0, 0];
      const keep = {}; for (const k in P.acts) keep[k] = [P.acts[k].time, P.w[k]];
      const cur = P.cur, ft = P.filmT, gp = P.group.position.clone(), gr = P.group.rotation.y;
      P.group.position.set(0, gp.y, 0); P.group.rotation.y = 0; pose(P, 'give', 2.6); P.group.updateWorldMatrix(true, true);
      P.hips.getWorldPosition(_goV); const off = [_goV.x, _goV.z];
      for (const k in P.acts) { P.acts[k].time = keep[k][0]; P.w[k] = keep[k][1]; P.acts[k].setEffectiveWeight(keep[k][1]); }
      P.cur = cur; P.filmT = ft; P.group.position.copy(gp); P.group.rotation.y = gr; P.mixer.update(0);
      return (P.__giveOff = off);
    }
    /* called after he is put and posed: his group drawn back by the give's offset as much as the give weighs in his pose now
       (P.w.give: 1 holding it out, less as it is let down or walked out of), turned with him, so his hips stay where he was put */
    function giveFix5(P, w0) { const w = P && P.ready ? (w0 != null ? w0 : (P.w.give || 0)) : 0; if (!(w > 1e-4)) return;
      const o = giveOff5(P), ry = P.group.rotation.y, c = Math.cos(ry), s = Math.sin(ry);
      P.group.position.x -= (o[0] * c + o[1] * s) * w; P.group.position.z -= (-o[0] * s + o[1] * c) * w; }

    /* where a film that hands to a phase leaves the people: the play's own placing for that phase (c_play.js castPhase), and
       the cast's things as that phase keeps them */
    function endPhase5(p) {
      if (typeof castPhase === 'function') castPhase(p);
      fmShow(cast.zav, false); CAGE5.set(null); TRANCE5.set(0); TRANCE5.pools(null, null, 0, 0); TRANCE5.gold(0);
      if (p === 'walk' || p === 'hunt') { STICK5.to('tonWrap'); DUFFEL5.to(p === 'walk' ? 'jun' : 'away'); }
      if (p === 'table' || p === 'ask') { STICK5.to('away'); DUFFEL5.to('away'); }
      fmVisionOff(); THREAD5.set(false); NAGA5.set(0, 0, 0, 0, 0);
      if (kit && kit.captions) kit.captions(null);
    }

    /* ================================================================ THE DEVOTEE (the plan's 4.2; its clock DV5)
       From the walkway at his gate: through the gate's bars his front doors open before they reach them, and Mr Koh comes
       down his court to them; on a cut, the gate open and Mr Koh in it, his head bowed to Grandmaster Pho, awkward and
       meant: his line. Walking in behind them: the paved path between the two planters, ordinary shrubs in both (nothing
       in the court looks wrong, and to an ordinary eye never will); at his doors the slippers. His living room: the
       curtains drawn, three lamps on, the fourth flickering; what has been happening to him, and that he has quarrelled
       with people (he says nothing of who, and nobody asks); "We will look first."; his teacher's order, turned to him.
       Ton and Jun stay in the court (the hunt's stations). It ends on the view the hunt begins in */
    const DV5AT = { gateEye: [-8.18, EYE, -15.05], phoGate: [-8.92, -14.52], tonW: [-7.58, -15.3], junW: [-9.75, -15.35],
                    kohDoor: [-8.35, -4.9], kohGate: [-7.82, -13.32], phoIn: [-9.5, -3.9], eyeIn: [STATION.hunt.at.x, EYE, STATION.hunt.at.z], kohRoom: [STATION.hunt.koh.x, STATION.hunt.koh.z] };
    /* (his room, measured against its solids (b_world.js): the door's leaf stands open along x -8.9 from the wall to z -4.75, the
       sofa fills x -9.06..-8.18, z -4.67..-2.57. So he stands where the hunt begins (STATION.hunt.at, east of the door), his
       teacher west of the sofa's back, north of the leaf, so no line of sight crosses the leaf (from where the first cut put
       them, the leaf filled half the phone's picture: devotee-00045, 21 Nov); nobody walks through a solid: his teacher
       is put in the room on its cut, and goes to the hunt's own place for him as the film ends) */
    FILMS5.devotee = {
      begin(api, s) {
        if (api && api.handsRoot) api.handsRoot.visible = false;
        FM5.once = new Set(); FM5.lit = ''; FM5.s = s; FM5.api = api;
        fmShow(cast.pho, true); fmShow(cast.ton, true); whenReady(cast.jun, (P) => fmShow(P, true)); whenReady(cast.koh, (P) => fmShow(P, true));
        STICK5.to('tonWrap'); DUFFEL5.to('jun');
      },
      frame(t) {
        const T = DV5, A = DV5AT, inside = t >= T.room;
        fmLook('DUSK');
        /* outside his gate the walkway, the court heard through the bars; in the court; at the doors; his room, its clock,
           and the smell under it */
        fmBeds(t < T.in ? { walk: 0.45, court: 0.22 } : t < T.slip ? { court: 0.5, walk: 0.12 } : !inside ? { court: 0.35, room: 0.2 }
                                                    : { room: 0.5, tick: 0.22, sour: 0.18 });
        /* the gate: shut until the cut, open after (Mr Koh opened it: a change made on a cut, v24.12); his doors open */
        gateOpen(t < T.cut1 ? 0 : 1); doorOpen(smo(c01((t - T.door) / 1.2)));
        /* the fourth lamp, by the armchair, flickering (an ordinary fault: the electrician came three times, 4.0) */
        lamp(1, inside ? 0.25 + 0.75 * (Math.sin(t * 23.0) * Math.sin(t * 7.1) > -0.35 ? 1 : 0.2) : 1);
        whenReady(cast.koh, (P) => {
          if (t < T.walk) { put(P, A.kohDoor[0], A.kohDoor[1], Math.PI); fmRest(P, 'koh', t); }
          /* (inside his doors as they open, clear of the leaf's swing (0.89 m from its hinge) and of the sofa, and out through
             them: stood in the court with his back to the shut door, his arm went through its frame (clipscan, 168
             crossings), and the door opened behind him by itself) */
          else if (t < T.cut1) fmWalk(P, t, T.walk, [A.kohDoor, [-8.5, -6.0], [-8.4, -9.5], A.kohGate], 1.12, restOf5('koh', t), Math.PI + 0.2, { ry0: Math.PI });
          else if (t < T.in) { put(P, A.kohGate[0], A.kohGate[1], faceTo(A.kohGate[0], A.kohGate[1], A.phoGate[0], A.phoGate[1]));
            fmTalk(P, 'koh', t, T.ko5d1, SECS.ko5d1, 'Talk_with_Hands_Open');
            /* his head bowed to Grandmaster Pho as he greets him (the wai's own take is wanted: the plan's 4.2) */
            lookNow(P, [A.phoGate[0], 0.95, A.phoGate[1]], smo(c01((t - T.ko5d1 + 0.2) / 0.5)) * (1 - 0.6 * smo(c01((t - T.ko5d1 - 1.5) / 0.8))), 0.6); }
          /* (he leads them in: on the cut into the court he is already halfway up it (a moment passed), and is inside his
             doors before the slippers' shot looks there; walked from his gate in the shot it stood him in the doorway with
             the lens in his back) */
          else if (!inside) fmWalk(P, t, T.in, [[-8.5, -8.0], [-8.5, -5.05]], 1.4, restOf5('koh', t), Math.PI);   // (to just inside his door: the sofa begins at z -4.67)
          else { put(P, A.kohRoom[0], A.kohRoom[1], STATION.hunt.koh.ry);
            /* (his three lines one talk: the second begins 0.35 s after the first ends, the third's gesture crossfaded in) */
            fmSpeak(P, 'koh', t, [[T.ko5d2, SECS.ko5d2, 'Talk_with_Hands_Open'], [T.ko5d3, SECS.ko5d3, 'Talk_with_Hands_Open'], [T.ko5d4, SECS.ko5d4, 'Listening_Gesture']]);
            /* his eyes on the master, and down for "I know I have a mouth": carried there and back by the same ease (handed
               the low point the moment it began, his head turned there in one frame: JERK) */
            const low = smo(c01((t - T.ko5d4) / 0.6)) * (1 - smo(c01((t - T.ko5d4 - SECS.ko5d4) / 0.8)));
            lookNow(P, lp3(fmHead(cast.pho, [A.phoIn[0], 1.6, A.phoIn[1]]), [A.kohRoom[0] + 0.4, 0.6, A.kohRoom[1] - 1.0], low), 0.8, 0.75); }
        });
        /* his teacher: at the gate; in behind Mr Koh; in the room, listening, then his two lines: to Mr Koh, and turned to
           his student. At the end turned back toward the room (the hunt's station) */
        whenReady(cast.pho, (P) => {
          if (t < T.in) { put(P, A.phoGate[0], A.phoGate[1], 0); fmRest(P, 'pho', t); lookNow(P, fmHead(cast.koh, [-8.5, 1.55, -9]), 0.8, 0.7); }
          else if (!inside) fmWalk(P, t, T.in, [[A.phoGate[0], A.phoGate[1]], [-8.5, -12.6], [-8.5, -6.6]], 1.55, restOf5('pho', t), Math.PI);
          else { const toKoh = faceTo(A.phoIn[0], A.phoIn[1], A.kohRoom[0], A.kohRoom[1]), toMe = faceTo(A.phoIn[0], A.phoIn[1], A.eyeIn[0], A.eyeIn[2]);
            const ry = t < T.ph5d2 - 0.2 ? toKoh : fmTurn(t, T.ph5d2 - 0.2, T.ph5d2 + 0.6, toKoh, toMe);
            /* (his look on his student let go over his first steps, not dropped in one frame as he turns away) */
            if (t >= T.turn) { fmWalk(P, t, T.turn, [A.phoIn, [STATION.hunt.pho.x, STATION.hunt.pho.z]], 0.8, restOf5('pho', t), STATION.hunt.pho.ry, { ry0: toMe });
              lookNow(P, 'lens', 0.85 * (1 - smo(c01((t - T.turn) / 0.6))), 0.7); return; }
            put(P, A.phoIn[0], A.phoIn[1], ry);
            fmSpeak(P, 'pho', t, [[T.ph5d1, SECS.ph5d1, 'Talk_with_Hands_Open'], [T.ph5d2, SECS.ph5d2, 'Talk_with_Hands_Open']]);
            fmGaze(P, t, [[0, () => fmHead(cast.koh, [A.kohRoom[0], 1.55, A.kohRoom[1]])], [T.ph5d2 - 0.2, 'lens']], 0.85, 0.7, 0.03, 0.8); }
        });
        /* Ton and Jun: behind at the gate; into the court, where the hunt keeps them */
        whenReady(cast.ton, (P) => { if (t < T.in + 0.4) { put(P, A.tonW[0], A.tonW[1], 0); fmRest(P, 'ton', t); }
          else fmWalk(P, t, T.in + 0.4, [A.tonW, [-7.9, -14.3], [STATION.hunt.ton.x, STATION.hunt.ton.z]], 1.0, restOf5('ton', t), STATION.hunt.ton.ry);
          STICK5.carry(P); });
        whenReady(cast.jun, (P) => { if (t < T.in + 0.9) { put(P, A.junW[0], A.junW[1], 0.1); fmRest(P, 'jun', t); }
          else fmWalk(P, t, T.in + 0.9, [A.junW, [-8.9, -14.3], [-9.2, -11.0], [STATION.hunt.jun.x, STATION.hunt.jun.z]], 1.05, restOf5('jun', t), STATION.hunt.jun.ry);
          DUFFEL5.carry(P); });
        /* THE LENS: through the gate's bars to his doors, as they open and he comes; on the cut, him in the open gate, his
           greeting; walking in behind them, past the planters; his doors, the slippers; the room: him by his dining room,
           his three lines; his teacher's two; and the room the hunt begins in (its snapshot) */
        const KOH = () => fmHead(cast.koh, [A.kohRoom[0], 1.55, A.kohRoom[1]]), PHO = () => fmHead(cast.pho, [A.phoIn[0], 1.6, A.phoIn[1]]);
        fmTrack(t, [
          { t: 0, name: 'gate', eye: A.gateEye, at: [-8.55, 1.25, -5.8], fp: 46, fd: 40 },
          { t: T.walk + 1.0, name: 'gate', eye: A.gateEye, at: [-8.5, 1.35, -8.5], fp: 52, fd: 44 },
          { t: T.cut1 - 0.05, name: 'gate', eye: [-8.2, EYE, -14.95], at: () => fmHead(cast.koh, [-7.82, 1.55, -13.32]), fp: 56, fd: 48 },
          /* (on the cut, the gate open: a single of him greeting, from beside his teacher, his face toward the lens and his
             eyes on Grandmaster Pho at the frame's right; aimed between them it cut him in half at a phone's edge, and from
             where the shot before stood it was a jump cut, the look 4.7 degrees: lensread.py) */
          { t: T.cut1, name: 'greet', eye: [-8.55, EYE, -14.6], at: () => fmHead(cast.koh, [-7.82, 1.5, -13.32]), fp: 42, fd: 38, cut: true },
          { t: T.in - 0.1, name: 'greet', eye: [-8.55, EYE, -14.6], at: () => fmHead(cast.koh, [-7.82, 1.5, -13.32]), fp: 40, fd: 36 },
          { t: T.in, name: 'court', eye: [-8.4, EYE, -14.55], at: [-8.5, 1.3, -6.5], fp: 66, fd: 58, cut: true },
          { t: T.slip - 0.05, name: 'court', eye: [-8.45, EYE, -11.9], at: [-8.5, 1.25, -5.8], fp: 66, fd: 58 },
          /* (the slippers from beside the path, west of it, so nobody walking in passes through the lens) */
          { t: T.slip, name: 'slippers', eye: [-9.6, 1.45, -6.95], at: [-9.02, 0.1, -6.1], fp: 60, fd: 52, cut: true },
          { t: T.room - 0.05, name: 'slippers', eye: [-9.55, 1.45, -6.85], at: [-8.75, 0.6, -5.4], fp: 62, fd: 54 },
          { t: T.room, name: 'room', eye: A.eyeIn, at: [-9.4, 1.3, -1.9], fp: 62, fd: 54, cut: true },
          /* (he is 3.4 m away across the sofa: a longer lens holds him to his waist; his teacher 2 m away) */
          { t: T.ko5d2 + 1.2, name: 'koh', eye: A.eyeIn, at: KOH, fp: 30, fd: 28 },
          { t: T.ko5d4 + SECS.ko5d4 - 0.5, name: 'koh', eye: [-8.07, EYE, -4.8], at: KOH, fp: 26, fd: 24 },
          { t: T.ph5d1 + 0.2, name: 'pho', eye: A.eyeIn, at: PHO, fp: 38, fd: 34 },
          { t: T.ph5d2 + 0.6, name: 'pho', eye: A.eyeIn, at: PHO, fp: 34, fd: 30 },
          { t: T.turn, name: 'pho', eye: A.eyeIn, at: PHO, fp: 36, fd: 32 },
          /* (it ends where the hunt begins, inside his doors, and KEEPS that view (z_tail.js: keep.view): ended on the view the
             film began in, at his gate, it threw the eye 9 m back out of the room in a second, measured: lensread.py) */
          { t: T.end - 0.1, name: 'hunt', eye: [STATION.hunt.at.x, EYE, STATION.hunt.at.z], yaw: STATION.hunt.at.ry, pitch: -0.04, fp: PLAYFOV5, fd: PLAYFOV5 }
        ]);
        if (t > T.in && t < T.slip) yaw.position.y += -0.016 * Math.abs(Math.sin((t - T.in) * Math.PI / 0.55));
      },
      end() { fmLens(PLAYFOV5); lamp(1, 1); endPhase5('hunt'); }
    };

    /* ================================================================ THE PREPARATION, AND THE TURN (the plan's 4.4; PR5)
       Night now: the sky over the court deep blue, its two wall lamps lit. Ton unwraps the Naga stick and holds it out in
       both hands; on the cut, Grandmaster Pho has it upright in his right hand. Jun has laid the black bag and the reel on
       the paving before the doorway and drawn the white thread across it; the household behind it. "Stay behind the
       thread." "What will I hear?" He does not answer that. "Stand with me." The stick upright, a breath; the lamps sink;
       his Spirit Vision opens without his asking, the wave out across the court: the nine where they stood all evening,
       heads bowed; they lift their heads; they turn, toward the one whose senses are open; they come; his breath, the
       picture sours hard, his hands come up before his face, and the picture goes to one flat colour, his protection's
       (the forty-third seam's fade in a colour): "And then I was not alone in my body." THE CAMERA LEAVES HIS EYES: back
       and up through the violet, and for the first time Master Zavier is SEEN (Chad's R3 and R5), standing in his cage of
       light, his teacher beside him with the stick and gold at his shoulders, the nine drawn back to the far end of the
       court, facing him; the picture comes to rest exactly where the fight's camera stands (its boom: boomAt), so the film
       hands to the fight with no cut. The nine's marks and count are the mode's and come with it */
    const PR5AT = { tonU: [-8.05, -7.35], phoU: [-8.7, -7.75], eye1: [-9.75, EYE, -9.9], eyeU: [-8.6, 1.5, -8.6] };
    /* (where Ton's hands hold the stick out to his teacher: 0.4 m from his mark toward him, at 1.05 m: measured on his give) */
    const PR5HANDS = (() => { const dx = PR5AT.phoU[0] - PR5AT.tonU[0], dz = PR5AT.phoU[1] - PR5AT.tonU[1], l = Math.hypot(dx, dz);
      return [PR5AT.tonU[0] + dx / l * 0.4, 1.05, PR5AT.tonU[1] + dz / l * 0.4]; })();
    const NINE5 = () => NINE_AT;                                               // (the play's one table of where the nine stand: c_play.js, from PRAI_STAND)
    FILMS5.prepare = {
      begin(api, s) {
        if (api && api.handsRoot) api.handsRoot.visible = false;
        FM5.once = new Set(); FM5.lit = ''; FM5.s = s; FM5.api = api;
        fmShow(cast.pho, true); fmShow(cast.ton, true); fmShow(cast.zav, false); whenReady(cast.jun, (P) => fmShow(P, true)); whenReady(cast.koh, (P) => fmShow(P, true));
        STICK5.to('tonWrap'); DUFFEL5.to('away');
        const N = NINE5(); PRAI5.list.forEach((P, i) => { const a = N[i % N.length]; P.hidden = false; put(P, a[0], a[1], faceTo(a[0], a[1], a[0], HOUSE.face)); if (P.ready) P.group.visible = true; });
        PRAI5.look('vision');
        if (things.staffCloth) things.staffCloth.visible = false;
        bagBlobs5();
      },
      frame(t, api) {
        const T = PR5, F = fightStart(), N = NINE5();
        const turned = t >= T.leave;                                            // from the violet on: the trance, third person
        fmLook(turned ? 'TRANCE' : 'NIGHT');
        /* the court after dark, a wall lamp's buzz until the lamps sink; the smell as the nine come, hard; in the trance
           the court almost silent */
        const kSink = smo(c01((t - T.sink) / 1.4)), kCome = smo(c01((t - T.come) / 2.4));
        fmBeds(turned ? { court: 0.2, sour: 0.12 } : { court: 0.55 - 0.2 * kSink, buzz: 0.2 * (1 - kSink), sour: 0.4 * kCome });
        courtLamps(turned ? 0.15 : 1 - 0.75 * smo(c01((t - T.sink) / 1.4)));
        /* the rite's things before the doorway: the bag laid open, the reel beside it, the thread across the door from
           its west jamb to Jun's hand */
        setDown('bagOpen', RITE.bag, 0.3); setDown('threadReel', RITE.reel);
        THREAD5.set(t >= T.thread - 0.1, [DOOR_FRONT.x0 + 0.05, 0.52, HOUSE.face - 0.12], [STATION.fight.jun.x - 0.18, 0.86, STATION.fight.jun.z - 0.25]);
        /* the household behind the thread, in the doorway: Mr Koh's question; Ton and Jun either side */
        whenReady(cast.koh, (P) => { const s0 = STATION.fight.koh; put(P, s0.x, s0.z, s0.ry);
          fmTalk(P, 'koh', t, T.ko5p1, SECS.ko5p1, 'Talk_with_Hands_Open'); lookNow(P, fmHead(cast.pho, [-8.6, 1.6, -9]), 0.8, 0.75); });
        whenReady(cast.jun, (P) => { const s0 = STATION.fight.jun; put(P, s0.x, s0.z, s0.ry); fmRest(P, 'jun', t); lookNow(P, turned ? fmHead(cast.zav, [F.zav.x, 1.6, F.zav.z]) : fmHead(cast.pho, [-8.6, 1.6, -9]), 0.7, 0.7); });
        /* Ton: the wrapped stick at his side; unwrapped and held out on both palms ('give'); back to the doorway */
        whenReady(cast.ton, (P) => {
          /* (he stands a step back from his mark, 0.77 m, the step his 'give' takes: he steps to his teacher as he holds the
             stick out, and his hips arrive on the mark (giveFix5); stood on the mark, he gave from inside his teacher) */
          if (t < T.unwrap) { put(P, PR5AT.tonU[0], PR5AT.tonU[1], faceTo(PR5AT.tonU[0], PR5AT.tonU[1], PR5AT.phoU[0], PR5AT.phoU[1])); fmRest(P, 'ton', t); giveFix5(P, 1); STICK5.to('tonWrap'); STICK5.carry(P); }
          else if (t < T.take + 0.6) { put(P, PR5AT.tonU[0], PR5AT.tonU[1], faceTo(PR5AT.tonU[0], PR5AT.tonU[1], PR5AT.phoU[0], PR5AT.phoU[1]));
            pose(P, 'give', fmRun(t, T.unwrap, T.unwrap + 1.6, 0.18, 2.6) + (t > T.unwrap + 1.6 ? 0.08 * Math.sin((t - T.unwrap) * 0.8) : 0)); giveFix5(P, 1);
            if (STICK5.who !== 'ton') STICK5.to('ton');
            STICK5.onPalms(P, 'stick');
            if (things.staffCloth) { things.staffCloth.visible = true; things.staffCloth.position.set(PR5AT.tonU[0] + 0.32, 0.01, PR5AT.tonU[1] + 0.18); things.staffCloth.rotation.set(0, 0.6, 0); }
            lookNow(P, [PR5AT.tonU[0] + 0.1, 0.9, PR5AT.tonU[1] - 0.5], 0.8, 0.8); }
          /* (his hands let down out of 'give' over half a second before he walks: put straight into his walk, the held-out
             arms dropped in one frame, on screen: R25) */
          else if (t < T.take + 1.1) { const ry = faceTo(PR5AT.tonU[0], PR5AT.tonU[1], PR5AT.phoU[0], PR5AT.phoU[1]), r = restOf5('ton', t);
            put(P, PR5AT.tonU[0], PR5AT.tonU[1], ry); pose(P, r[0], r[1], r[2], 'give', 1 - smo(c01((t - T.take - 0.6) / 0.5)), 2.6); giveFix5(P);
            const u = smo(c01((t - T.take - 0.6) / 0.5));
            lookNow(P, lp3([PR5AT.tonU[0] + 0.1, 0.9, PR5AT.tonU[1] - 0.5], fmHead(cast.pho, [-8.6, 1.6, -9]), u), lp(0.8, 0.7, u), lp(0.8, 0.7, u)); }
          else { fmWalk(P, t, T.take + 1.1, [PR5AT.tonU, [STATION.fight.ton.x, STATION.fight.ton.z]], 0.9, restOf5('ton', t), STATION.fight.ton.ry,
                   { ry0: faceTo(PR5AT.tonU[0], PR5AT.tonU[1], PR5AT.phoU[0], PR5AT.phoU[1]) }); lookNow(P, fmHead(cast.pho, [-8.6, 1.6, -9]), 0.7, 0.7); }
        });
        /* his teacher: by the doorway as the stick is unwrapped; on the cut it is in his hand; his word to the household;
           his word to his student, at the court's middle; the stick set upright; from the turn at the fight's own place */
        whenReady(cast.pho, (P) => {
          if (t >= T.take && STICK5.who !== 'pho') STICK5.to('pho');
          if (t < T.thread) { put(P, PR5AT.phoU[0], PR5AT.phoU[1], faceTo(PR5AT.phoU[0], PR5AT.phoU[1], PR5AT.tonU[0], PR5AT.tonU[1])); fmRest(P, 'pho', t); lookNow(P, fmHead(cast.ton, [-8.05, 1.5, -7.35]), 0.7, 0.8); }
          else if (t < T.teacher) { const ry = faceTo(PR5AT.phoU[0], PR5AT.phoU[1], STATION.fight.koh.x, STATION.fight.koh.z); put(P, PR5AT.phoU[0], PR5AT.phoU[1], ry);
            fmTalk(P, 'pho', t, T.ph5p1, SECS.ph5p1, 'Talk_with_Hands_Open');
            /* (from Mr Koh to his student as he gives no answer, carried over 0.6 s: handed over in one frame, his head
               turned 70 degrees on screen: R25) */
            fmGaze(P, t, [[0, () => fmHead(cast.koh, [-8.5, 1.55, -4.7])], [T.noans + 0.2, [F.zav.x, 1.5, F.zav.z]]], 0.85, 0.7, 0.03, 0.6); }
          else if (!turned) { const walked = fmWalk(P, t, T.teacher - 0.9, [PR5AT.phoU, [F.pho.x, F.pho.z]], 1.0, restOf5('pho', t), faceTo(F.pho.x, F.pho.z, F.zav.x, F.zav.z),
                                                  { ry0: faceTo(PR5AT.phoU[0], PR5AT.phoU[1], STATION.fight.koh.x, STATION.fight.koh.z) });
            /* (his eyes stay on his student as he walks to him: dropped as he set off, the head swung back in one frame) */
            if (walked) lookNow(P, [F.zav.x, 1.5, F.zav.z], 0.85, 0.7);
            else { if (t < T.ph5p2 + SECS.ph5p2 + 0.45) fmTalk(P, 'pho', t, T.ph5p2, SECS.ph5p2, 'Talk_with_Hands_Open'); lookNow(P, 'lens', 0.85, 0.7); } }
          else { put(P, F.pho.x, F.pho.z, COURT5.heading + Math.PI); fmRest(P, 'pho', t); lookNow(P, [F.lesson.x, 1.3, F.lesson.z], 0.6, 0.7); }
        });
        /* THE NINE: where they stood all evening, heads bowed toward the house; they lift their heads, turn to him, and
           come; in the violet they are drawn back to the far end of the court, where the fight finds them */
        const me = [F.zav.x, F.zav.z];
        PRAI5.list.forEach((P, i) => whenReady(P, () => {
          const a = N[i % N.length];
          if (!turned) {
            const toHouse = 0, toMe = faceTo(a[0], a[1], me[0], me[1]), kT = smo(c01((t - T.turn - i * 0.07) / 1.3));
            const kC = smo(c01((t - T.come - i * 0.06) / 2.6)), d = Math.hypot(me[0] - a[0], me[1] - a[1]), reach = Math.max(0, d - 1.15) * kC * kC;
            const x = a[0] + (me[0] - a[0]) / (d || 1) * reach, z = a[1] + (me[1] - a[1]) / (d || 1) * reach;
            put(P, x, z, toHouse + angTo(toHouse, toMe) * kT); pose(P, 'Idle_3', 1.5 + 0.11 * i + t * 0.3, true);
            /* the head: bowed, then lifted (a neck's reach: v6.9) */
            const lift = smo(c01((t - T.heads - i * 0.05) / 1.2));
            lookNow(P, lift < 0.999 ? lp3([x + Math.sin(P.group.rotation.y) * 1.0, 0.0, z + Math.cos(P.group.rotation.y) * 1.0], [me[0], 1.6, me[1]], lift) : [me[0], 1.6, me[1]], 1, 0.9, 0);
            /* their lean as they come (a body that is pulled, not one that walks) */
            P.group.rotation.x = 0.12 * kC;
          } else {
            const at = i === 0 ? F.lesson : (F.entry[(i - 1) % Math.max(1, F.entry.length)] || F.lesson);
            put(P, at.x, at.z, faceTo(at.x, at.z, me[0], me[1])); P.group.rotation.x = 0; pose(P, 'Idle_3', 1.5 + 0.11 * i + t * 0.3, true); lookNow(P, [me[0], 1.5, me[1]], 0.6, 0.8);
          }
        }));
        PRAI5.look(turned ? 'trance' : 'vision'); PRAI5.tick(0.016);
        /* his sight, opened without his asking (the wave out from him), held until the violet; under the violet his OWN sight
           is shut (kit.vision(false)), or a sight he had open in the hunt came back the moment the hold let go, and the
           third person of the turn was drawn in the vision's negative (prepare-00047, 21 Nov) */
        fmVision(t, T.open, 2.2, turned ? T.violet + 0.4 : Infinity, 0.01);
        if (turned) fmVisionOff();
        if (t >= T.violet + 0.6 && !FM5.once.has('sightShut')) { FM5.once.add('sightShut'); if (kit && kit.vision) kit.vision(false); }
        /* THE SOUR, hard, as they come */
        if (kit && kit.chill) { const k = turned ? 0 : smo(c01((t - T.come) / 2.4)) * 0.95;
          if (k > 0.002 || FM5.sour) { kit.chill(k, { tint: 'sour', cine: true }); FM5.sour = k > 0.002; } }
        /* his hands up before his face (the library's palms before the eyes, the fingers apart: he looks through them) */
        if (api && api.handPose) { const kh = turned ? 0 : smo(c01((t - T.hands) / 1.0)) * 0.85;
          if (api.handsRoot) api.handsRoot.visible = kh > 0.01; api.handPose('peek', kh); }
        /* MASTER ZAVIER, SEEN: standing where the fight puts him, eyes half shut, lips moving (his trance's take is CAST's
           to make: until it lands he stands in his rest), in his cage; his teacher's gold; the trance's look */
        if (turned) { whenReady(cast.zav, (P) => { fmShow(P, true); put(P, F.zav.x, F.zav.z, COURT5.heading + Math.PI);
            const rt = zavRest(); if (rt) pose(P, rt, 2 + t * 0.35, true); else pose(P, 'Walking', ZAV_STAND5); lookNow(P, [F.lesson.x, 1.4, F.lesson.z], 0.5, 0.7); });
          CAGE5.set({ k: smo(c01((t - T.leave) / 1.2)), x: F.zav.x, z: F.zav.z, t });
          TRANCE5.set(1, t); TRANCE5.pools(F.zav, F.pho, 1, 1); TRANCE5.gold(smo(c01((t - T.leave - 0.5) / 1.5))); }
        else { fmShow(cast.zav, false); CAGE5.set(null); TRANCE5.set(0); TRANCE5.pools(null, null, 0, 0); TRANCE5.gold(0); }
        /* THE LENS. Through his eyes: the night court from its west side; the unwrapping, close; the stick in his teacher's
           hand; the doorway, the thread, the household; his teacher to him; the court as the lamps sink and his sight opens,
           the nine; closer as they come; the violet. Then out of his eyes: from his head back and up to the boom */
        const B = boomAt({ x: F.pho.x, z: F.pho.z }), ZH = [F.zav.x, 1.6, F.zav.z];
        const RISE = [ZH[0] + 0.1, 2.3, ZH[2] - 1.7];
        fmTrack(t, [
          { t: 0, name: 'night', eye: PR5AT.eye1, at: [-8.3, 1.3, -6.6], fp: 54, fd: 46 },
          { t: T.unwrap - 0.3, name: 'night', eye: PR5AT.eye1, at: () => lp3(fmHead(cast.ton, [-8.05, 1.55, -7.35]), fmHead(cast.pho, [-8.7, 1.6, -7.75]), 0.5), fp: 50, fd: 44 },
          /* (his hands as he steps to his teacher with the stick: where the give holds them, 0.4 m before his mark toward his
             teacher at 1.05 m; aimed at his mark at 1 m, the close held his belt, and with his body 0.77 m off it, the wall:
             prepare-phone 6.5 on deploy 10) */
          { t: T.unwrap, name: 'unwrap', eye: [-8.38, 1.45, -8.62], at: PR5HANDS, fp: 52, fd: 44, cut: true },
          { t: T.take - 0.1, name: 'unwrap', eye: [-8.4, 1.46, -8.66], at: PR5HANDS, fp: 46, fd: 40 },
          { t: T.take, name: 'stick', eye: [-8.4, EYE, -9.3], at: () => fmHead(cast.pho, [-8.7, 1.6, -7.75]), fp: 46, fd: 40, cut: true },
          { t: T.thread - 0.05, name: 'stick', eye: [-8.4, EYE, -9.25], at: () => lp3(fmHead(cast.pho, [-8.7, 1.6, -7.75]), [-8.7, 0.9, -7.75], 0.45), fp: 48, fd: 42 },
          { t: T.thread, name: 'doorway', eye: [-8.15, EYE, -8.6], at: [-8.5, 1.15, -5.3], fp: 50, fd: 44, cut: true },
          { t: T.ko5p1 + SECS.ko5p1, name: 'doorway', eye: [-8.15, EYE, -8.6], at: () => lp3([-8.5, 1.35, -5.2], fmHead(cast.koh, [-8.5, 1.55, -4.7]), 0.5), fp: 46, fd: 40 },
          { t: T.noans + 0.6, name: 'nonanswer', eye: [-8.15, EYE, -8.6], at: () => fmHead(cast.pho, [-8.7, 1.6, -7.75]), fp: 44, fd: 38 },
          { t: T.teacher, name: 'teacher', eye: [F.zav.x, EYE, F.zav.z], at: () => fmHead(cast.pho, [F.pho.x, 1.6, F.pho.z]), fp: 50, fd: 44, cut: true },
          { t: T.sink - 0.05, name: 'teacher', eye: [F.zav.x, EYE, F.zav.z], at: () => fmHead(cast.pho, [F.pho.x, 1.6, F.pho.z]), fp: 46, fd: 42 },
          /* (to the court on a CUT as the lamps sink: his teacher stands behind him, and turned there from him the look swung
             120 degrees in a second and a half, 322 a second at its fastest: lensread.py) */
          { t: T.sink, name: 'court', eye: [F.zav.x, EYE, F.zav.z], at: [F.zav.x + 0.2, 1.2, F.zav.z + 4.0], fp: 62, fd: 56, cut: true },
          { t: T.heads + 0.6, name: 'nine', eye: [F.zav.x, EYE, F.zav.z], at: [F.zav.x + 0.1, 1.3, F.zav.z + 3.2], fp: 58, fd: 52 },
          { t: T.come + 1.6, name: 'come', eye: [F.zav.x, EYE - 0.02, F.zav.z - 0.05], at: [F.zav.x, 1.45, F.zav.z + 2.0], fp: 64, fd: 58 },
          { t: T.leave, name: 'violet', eye: [F.zav.x, EYE, F.zav.z - 0.05], at: [F.zav.x, 1.5, F.zav.z + 2.0], fp: 64, fd: 58 },
          { t: T.leave + 0.05, name: 'leave', eye: [ZH[0], 1.68, ZH[2] - 0.35], at: [ZH[0], 1.45, ZH[2] + 3.0], fp: 60, fd: 54, cut: true },
          { t: T.leave + 2.6, name: 'leave', eye: RISE, at: [ZH[0], 1.0, ZH[2] + 2.2], fp: 58, fd: 54 },
          { t: T.rest, name: 'fightcam', eye: B.eye, yaw: B.heading, pitch: B.pitch, fp: B.fov, fd: B.fov },
          { t: T.end, name: 'fightcam', eye: B.eye, yaw: B.heading, pitch: B.pitch, fp: B.fov, fd: B.fov }
        ]);
      },
      end() { fmLens(PLAYFOV5); if (FM5.sour && kit && kit.chill) kit.chill(0, { tint: 'sour' }); FM5.sour = false; fmVisionOff();
        if (FM5.api && FM5.api.handPose) FM5.api.handPose(null, 0);
        /* the court as the fight finds it: the two of them at their places, the cage, the trance, the nine at theirs */
        const F = fightStart();
        whenReady(cast.zav, (P) => { fmShow(P, true); put(P, F.zav.x, F.zav.z, COURT5.heading + Math.PI); });
        whenReady(cast.pho, (P) => { put(P, F.pho.x, F.pho.z, COURT5.heading + Math.PI); rest(P, 0); });
        CAGE5.set({ k: 1, x: F.zav.x, z: F.zav.z, t: 0 }); TRANCE5.set(1, 0); TRANCE5.pools(F.zav, F.pho, 1, 1); TRANCE5.gold(1); PRAI5.look('trance');
        if (kit && kit.captions) kit.captions(null); }
    };

    /* ================================================================ TOGETHER (the plan's 5.5, stage 5; its clock NG5): the
       ONE film inside the fight, which cannot be skipped the first time (the forty-first seam: the fight plays it with
       kit.film('together', { noSkip: !ctx.sealedBefore(...) })). It begins on the fight's own picture (the boom behind the
       one played: the engine zeroes the boom under a film, so the first frame sets the same view from the rig), the tall
       dark shape over his student. Grandmaster Pho plants the Naga stick (his Charged_Spell_Cast_1: the plan's 9.1); THE
       NAGA rises from its head, ruby and vast, and lays its long body once round the court's edge, between the nine and
       everyone in the court and at its door; the tall shape cannot hold: it comes apart into its three, and they sink low
       and lie tired where the fight's last stage finds them (FIGHT.NUM laidAt). "The Naga guards. It always has." Mr Koh
       at the door, behind the thread: "It is... warm. Why is it warm?" (what he feels, never what it was). It ends on the
       boom behind Grandmaster Pho, played, the Naga lying round the court (the fight's last stage dims it) */
    FILMS5.together = {
      three: null,                                                             // the last three (the fight says which: indices into PRAI5.list)
      begin(api, s) {
        FM5.once = new Set(); FM5.lit = ''; FM5.s = s;
        if (api && api.handsRoot) api.handsRoot.visible = false;
        const L = this.three && this.three.length === 3 ? this.three : PRAI5.list.map((P, i) => i).filter(i => PRAI5.list[i].group.visible).slice(-3);
        this.L = L.length === 3 ? L : [6, 7, 8];
        /* where the two stand as the film begins (the fight's last frame) */
        this.pho = cast.pho ? { x: cast.pho.group.position.x, z: cast.pho.group.position.z, ry: cast.pho.group.rotation.y } : null;
        this.zav = cast.zav ? { x: cast.zav.group.position.x, z: cast.zav.group.position.z } : null;
        PRAI5.look('trance');
      },
      frame(t) {
        const T = NG5, F = fightStart(), pz = this.pho || { x: F.pho.x, z: F.pho.z, ry: COURT5.heading + Math.PI }, zz = this.zav || F.zav;
        fmLook('TRANCE'); courtLamps(0.15 + 0.25 * smo(c01((t - T.rise) / 2)));
        /* the court low under the trance; the smell of the tall shape until it comes apart */
        fmBeds({ court: 0.22, sour: 0.3 * (1 - smo(c01((t - T.apart) / 2.5))) });
        /* the stick planted at his front right, where his cast brings it down; it stands by itself once planted */
        /* (the stick planted 0.38 m before him and 0.40 m to his right, FIGHT-IN's measure of the strike: at 0.42 and 0.18 the
           place stood inside his body as his cast struck it down at 1.7 s, 1578 points of his trunk in the shaft; here it is
           clear of his waist and in his hand's reach from his shoulder. Laid from here, none of the Naga is in a wall or the
           house at 32 stick places) */
        const fx = Math.sin(pz.ry), fz = Math.cos(pz.ry), sx = pz.x + fx * 0.38 - fz * 0.40, sz = pz.z + fz * 0.38 + fx * 0.40;
        /* THE NAGA: up from the stick's head, over, and round the court once; ruby, and gold where his light falls (laid
           first in the frame: his look and the lens are aimed at its head as this moment lays it) */
        /* (its light comes down over the boom's last two seconds to the 0.3 the fight's last stage keeps it at: it had
           ended at 0.65, and the fight's first frame put it at 0.3 in one frame, the glow gone with it, on the same view) */
        const kN = smo(c01((t - T.rise) / (T.apart - T.rise))) , aN = smo(c01((t - T.rise) / 1.2)) * (1 - 0.35 * smo(c01((t - T.low) / 3))) * lp(1, 0.3 / 0.65, smo(c01((t - T.back - 0.1) / 1.8)));
        NAGA5.light(pz.x, 1.35, pz.z, 1); NAGA5.set(kN, aN, t, sx, sz);
        /* (his cast handed to his rest over 0.6 s, and his look from the Naga's head to his student over 0.8: each was put in
           one frame, on screen: R25) */
        whenReady(cast.pho, (P) => { put(P, pz.x, pz.z, pz.ry);
          /* (HELD ON THE STRIKE: his cast plays to the moment the stick strikes the paving (1.7 s of it) and all but stops
             there, its time going on at a twentieth (so he still lives), his hand on the stick as the Naga rises out of it;
             then he is handed to his rest over 0.9 s. Played on, the cast's own step carried his hips 0.33 m to his right
             and forward and his left arm across his front: into the planted stick, wherever his hand can plant it,
             FIGHT-IN's scan of his whole skin, 1.5 to 4.3 s) */
          const r = restOf5('pho', t), out = smo(c01((t - T.plant - 3.6) / 0.9)), ct = Math.max(0, t - T.plant), cth = ct < 1.7 ? ct : 1.7 + (ct - 1.7) * 0.05;
          if (out < 1) pose(P, 'Charged_Spell_Cast_1', cth, false, r[0], out, r[1]); else fmRest(P, 'pho', t);
          if (t < T.plant + 1.7) STICK5.to('pho'); else STICK5.plant(sx, sz, pz.ry);
          fmGaze(P, t, [[0, () => NAGA5.headAt() || NAGA5.pointAtDist(sx, sz, 0)], [T.lay, [zz.x, 1.5, zz.z]]], 0.6, 0.7, 0.03, 0.8); });   // (on the stick's head, then up at its head as it rises: R25)
        whenReady(cast.zav, (P) => { fmShow(P, true); put(P, zz.x, zz.z, COURT5.heading + Math.PI); const rt = zavRest(); if (rt) pose(P, rt, 2 + t * 0.35, true); else pose(P, 'Walking', ZAV_STAND5); });
        /* the cage: cracked under the shape, whole again as the Naga closes round them */
        const kc = t < T.apart ? 0.55 : 0.55 + 0.45 * smo(c01((t - T.apart) / 2.0));
        CAGE5.set({ k: kc, x: zz.x, z: zz.z, t, crack: t < T.apart });
        TRANCE5.set(1, t); TRANCE5.pools(zz, pz, 1, 1); TRANCE5.gold(1);
        /* the tall shape: the last three drawn together over him, leaning in; it comes apart into its three, and they sink
           low and lie where the fight's last stage finds them */
        const lay = F.laid.length === 3 ? F.laid : [courtWorld(-1.15, -0.8), courtWorld(0, -1.35), courtWorld(1.15, -0.8)];
        this.L.forEach((idx, j) => { const P = PRAI5.list[idx]; if (!P) return; whenReady(P, () => { fmShow(P, true);
          const kA = smo(c01((t - T.apart - j * 0.15) / 2.2)), kL = smo(c01((t - T.low - j * 0.1) / 1.4));
          const ox = [-0.18, 0.2, 0.0][j], oz = [0.25, 0.22, 0.45][j];
          const x = lp(zz.x + ox, lay[j].x, kA), z = lp(zz.z + oz, lay[j].z, kA), sc = lp(1.55, 1.0, kA);
          put(P, x, z, faceTo(x, z, zz.x, zz.z)); P.group.scale.setScalar(sc * (1 - 0.45 * kL)); P.group.rotation.x = lp(-0.35, 0, kA) + 0.55 * kL;
          pose(P, 'Idle_3', 2 + j * 0.7 + t * 0.4, true); PRAI5.alpha(P, 1 - 0.35 * kL); }); });
        PRAI5.tick(0.016);
        /* Mr Koh, at the doorway behind the thread, at its end */
        whenReady(cast.koh, (P) => { const s0 = STATION.fight.koh; put(P, s0.x, s0.z, s0.ry); fmTalk(P, 'koh', t, T.ko5c2, SECS.ko5c2 || 2.6, 'Talk_with_Hands_Open'); });
        /* THE LENS: the fight's picture; down low beside him, ON ITS HEAD as it rises out of the stick, looks over the court
           from the top of its arch, comes down to the far corner and down the west side toward the lens; on the line's last
           word a CUT to high over the gate end, over the walls' top, the whole court and its edge in a phone's frame as it
           runs round, easing in toward the east side where its head stands facing the house; the shape coming apart; down
           to the three; the doorway; the boom again. (FILMS-2, each key measured against the laid Naga before it was drawn:
           its nearest point to the lens, its share of the frame and where its head stands on a phone and a desk. The crane
           from beside him up through its rising body drew the column 1.8 m from the lens across half a phone's frame, and
           the high shot 3.8 m over the arch lost the head past a phone's edge as it reared at the east side; now the head
           stands within 0.82 of a phone's half-width from 9 s to 14.5 s, the body never nearer the high lens than 4.5 m.)
           The low eye is kept inside the court's walls wherever he stands */
        /* (before it rises its head is the stick's head, where it will come out: the lens on the strike turns to it, and the
           first laid head stands there; aimed up its path at 2.4 m, the lens swung to the empty wall over the strike and
           jumped down to the stick's head as it rose, together-phone 1.9 on lab 5) */
        const B0 = boomAt({ x: pz.x, z: pz.z }), HEADAT = () => NAGA5.headAt() || NAGA5.pointAtDist(sx, sz, 0);
        const LC = { x: (lay[0].x + lay[1].x + lay[2].x) / 3, z: (lay[0].z + lay[1].z + lay[2].z) / 3 };   // (the three laid: their middle)
        const LOWEYE = (e) => [Math.max(COURT.x0 + 0.3, Math.min(COURT.x1 - 0.3, e[0])), e[1], Math.max(COURT.z0 + 0.3, Math.min(HOUSE.face - 0.3, e[2]))];
        fmTrack(t, [
          { t: 0, name: 'fightcam', eye: B0.eye, yaw: B0.heading, pitch: B0.pitch, fp: B0.fov, fd: B0.fov },
          { t: T.plant + 0.8, name: 'fightcam', eye: [B0.eye[0], B0.eye[1] - 0.4, B0.eye[2] + 0.8], yaw: B0.heading, pitch: B0.pitch + 0.1, fp: B0.fov - 6, fd: B0.fov - 6 },
          { t: T.rise + 0.3, name: 'low', eye: LOWEYE([pz.x - 1.2, 0.9, pz.z - 1.4]), at: HEADAT, fp: 70, fd: 62 },
          { t: T.ph5c2 + 0.6, name: 'low', eye: LOWEYE([pz.x - 1.0, 0.95, pz.z - 1.3]), at: HEADAT, fp: 72, fd: 64 },
          { t: T.lay - 0.65, name: 'low', eye: LOWEYE([pz.x - 1.0, 0.95, pz.z - 1.3]), at: HEADAT, fp: 72, fd: 64 },
          { t: T.lay - 0.6, name: 'high', eye: [COURT5.x, 9.2, COURT.z0 + 0.2], at: [COURT5.x + 0.05, 0.0, -9.0], fp: 66, fd: 56, cut: true },
          { t: T.lay + 1.4, name: 'high', eye: [COURT5.x, 9.2, COURT.z0 + 0.2], at: [COURT5.x + 0.05, 0.0, -9.0], fp: 66, fd: 56 },
          { t: T.lay + 3.0, name: 'high', eye: [COURT5.x + 0.1, 8.6, COURT.z0 + 0.4], at: [COURT5.x + 0.4, 0.2, -8.9], fp: 64, fd: 54 },
          { t: T.apart - 1.1, name: 'high', eye: [COURT5.x + 0.2, 8.0, COURT.z0 + 0.6], at: [COURT5.x + 0.55, 0.4, -8.8], fp: 62, fd: 53 },
          { t: T.apart + 0.6, name: 'high', eye: [COURT5.x + 0.5, 6.6, COURT.z0 + 1.0], at: [zz.x + 0.2, 0.6, zz.z + 0.5], fp: 60, fd: 52 },
          /* (DOWN TO THE THREE where the Naga laid them, from high enough over his student that none of them is behind him,
             wherever the fight left him: from 1.9 m beside him the lens stood 0.71 m from the Naga's hump over the east
             planter, its body a red blob across a phone's top corner, one of the three out of the frame and one behind him,
             together-phone 19.9 on ba6a2bb; measured from here, all three in a phone's frame and a desk's, the Naga's
             nearest 2.2 m) */
          { t: T.low + 1.2, name: 'three', eye: [LC.x + 0.2, 5.2, LC.z - 4.48], at: [LC.x, 0.3, LC.z - 0.28], fp: 56, fd: 50 },
          { t: T.ko5c2, name: 'door', eye: [-8.3, 1.62, -7.3], at: () => fmHead(cast.koh, [-8.5, 1.55, -4.7]), fp: 44, fd: 38, cut: true },
          { t: T.back - 0.05, name: 'door', eye: [-8.3, 1.62, -7.3], at: () => fmHead(cast.koh, [-8.5, 1.55, -4.7]), fp: 42, fd: 36 },
          { t: T.back, name: 'fightcam', eye: B0.eye, yaw: B0.heading, pitch: B0.pitch, fp: B0.fov, fd: B0.fov, cut: true },
          { t: T.end, name: 'fightcam', eye: B0.eye, yaw: B0.heading, pitch: B0.pitch, fp: B0.fov, fd: B0.fov }
        ]);
      },
      end() { fmLens(PLAYFOV5);
        /* what the last stage finds: the three laid at its places, small and dim, the Naga lying round the court */
        const F = fightStart(), lay = F.laid.length === 3 ? F.laid : [];
        this.L && this.L.forEach((idx, j) => { const P = PRAI5.list[idx]; if (!P || !lay[j]) return; put(P, lay[j].x, lay[j].z, P.group.rotation.y); });
        if (kit && kit.captions) kit.captions(null); }
    };

    /* ================================================================ THE BAG TIED (the plan's 4.6; BT5)
       The last of the nine is in the bag. The cage thins, the murmur stops in the middle of a breath, and the camera goes
       back INTO his eyes, the turn in reverse (the violet again, and out of it his own sight); the court's lamps come
       back, one, then the other. "He moved through every part of the house doing this": three pictures through his eyes,
       the bag still open in Grandmaster Pho's hand (seen from behind him, his breath drawn and blown into it, what is left
       in each room's air drawn in): the living room, the dining room, the terrace door; behind him Ton carries the Naga
       stick in both hands and keeps looking down at it. ONLY THEN the knot (the bag's own cord, "tightly"; no string and no
       chant: both are case three's): heard over the open bag, and seen on a cut, the bag tied. Ton's line; his own. Mr
       Koh has drawn his curtains back and opened a window: night air; the fourth lamp flickers once and holds, and nobody
       says which; "lighter... or is it me"; "Both can be true."; his head bowed to Grandmaster Pho, deeper than the
       first; his teacher's two lines to him. At the lift, the bag in his teacher's hand: "Was it real?" and the case
       file's second lesson; as the doors open, the next case seeded; in, and the doors close on black */
    /* (every place measured against the rooms' solids, b_world.js: the sofa x -9.06..-8.18, z -4.67..-2.57; the low table
       x -7.66..-6.9, z -4.22..-3.02; the floor lamp by the sofa x -8.92..-8.42, z -2.5..-1.98; the dining table and its
       chairs x -11.6..-9.2, z -1.18..1.0. As first written, his teacher stood in the sofa's edge and on a dining chair, the
       eye of the dining room's shot and the one by the window stood inside the sofa, and Ton stood in it) */
    const BT5AT = { live: [-7.92, -4.0], dine: [-10.3, -1.5], terr: [-11.2, -3.6], eyeLive: [-7.0, EYE, -4.75], eyeDine: [-9.4, EYE, -2.8], eyeTerr: [-9.8, EYE, -4.6],
                    tie: [-7.28, -3.62], kohWin: [-10.5, -4.75], phoKoh: [-9.4, -4.4], eyeKoh: [-7.95, EYE, -3.3], tonKoh: [-8.0, -2.25],
                    liftPho: [0.35, 0.05], liftTon: [-0.6, 0.2], liftJun: [0.6, -0.3], liftEye: [-0.1, EYE, -1.55] };   // (Ton and Jun beside his teacher, off the line he is looked at along: Ton's back filled the phone's frame: bagtied-00058)
    FILMS5.bagtied = {
      begin(api, s) {
        FM5.once = new Set(); FM5.lit = ''; FM5.s = s; FM5.api = api;
        if (api && api.handsRoot) api.handsRoot.visible = false;
        this.F0 = fightStart();
        this.zav = cast.zav && cast.zav.group.visible ? { x: cast.zav.group.position.x, z: cast.zav.group.position.z } : this.F0.zav;
        this.pho = cast.pho ? { x: cast.pho.group.position.x, z: cast.pho.group.position.z } : this.F0.pho;
        whenReady(cast.koh, (P) => fmShow(P, true)); whenReady(cast.jun, (P) => fmShow(P, true)); fmShow(cast.ton, true); fmShow(cast.pho, true);
        PRAI5.list.forEach((P) => fmShow(P, false));
        if (things.bagTied) things.bagTied.visible = false;
        bagBlobs5();
      },
      frame(t, api) {
        const T = BT5, A = BT5AT, zz = this.zav, pz = this.pho, inEyes = t >= T.eyes, atLift = t >= T.lift;
        fmLook(!inEyes ? 'TRANCE' : 'NIGHT');
        /* the court in the trance, then after dark with its lamp's buzz; his rooms and their clock, the smell thinning room
           by room and gone at the knot; the night air through the open window; the walkway at the lift */
        const sourLeft = 0.3 * (1 - smo(c01((t - T.room1 - 2.4) / 1.5)) * 0.35 - smo(c01((t - T.room2 - 2.4) / 1.5)) * 0.35 - smo(c01((t - T.room3 - 2.4) / 1.5)) * 0.3);
        fmBeds(atLift ? { walk: 0.35 } : !inEyes ? { court: 0.25, sour: 0.25 } : t < T.room1 ? { court: 0.5, buzz: 0.15, sour: 0.25 }
             : t < T.knot ? { room: 0.5, tick: 0.2, sour: Math.max(0, sourLeft) }
             : { room: 0.45, tick: 0.2, court: t >= T.window ? 0.32 : 0.12 });
        /* the court's lamps come back, one, then the other */
        if (!atLift) { if (!inEyes) courtLamps(0.15); else for (const [i, L] of [[0, T.lamp1], [1, T.lamp2]]) void i, void L; }
        if (inEyes && !atLift) { const k1 = smo(c01((t - T.lamp1) / 0.4)), k2 = smo(c01((t - T.lamp2) / 0.4)); courtLamps(0.15 + 0.85 * Math.min(1, (k1 + k2) / 2 + 0.0)); }
        /* the cage thins; Master Zavier seen until the violet */
        const kc = 1 - smo(c01((t - T.thin) / 1.4));
        if (!inEyes) { whenReady(cast.zav, (P) => { fmShow(P, t < T.eyes); put(P, zz.x, zz.z, COURT5.heading + Math.PI); const rt = zavRest(); if (rt) pose(P, rt, 2 + t * 0.35, true); else pose(P, 'Walking', ZAV_STAND5); });
          CAGE5.set({ k: kc, x: zz.x, z: zz.z, t }); TRANCE5.set(1 - smo(c01((t - T.thin) / 2.0)), t); TRANCE5.pools(zz, pz, kc, kc); TRANCE5.gold(kc); }
        else { fmShow(cast.zav, false); CAGE5.set(null); TRANCE5.set(0); TRANCE5.pools(null, null, 0, 0); TRANCE5.gold(0); }
        /* his own hands before him, shaking, as his sight comes home to them */
        if (api && api.handPose) { const kh = inEyes && t < T.room1 - 0.3 ? smo(c01((t - T.eyes) / 0.6)) * (1 - smo(c01((t - T.room1 + 1.0) / 0.7))) : 0;
          if (api.handsRoot) api.handsRoot.visible = kh > 0.01; api.handPose('reach', kh * 0.8, { p: 0 }); if (kh > 0.01 && api.handsRoot) { api.handsRoot.position.x = 0.004 * Math.sin(t * 31); api.handsRoot.position.y = 0.004 * Math.sin(t * 27 + 1); } }
        /* the open bag in his teacher's hand, room by room (seen from behind him: the bag before him, out of the picture);
           the knot; the tied bag on the low table, then in his left hand at the lift */
        const bagT = things.bagTied, bagO = things.bagOpen;
        if (bagO) bagO.visible = t >= T.knot - 0.1 && t < T.tied;
        if (bagO && bagO.visible) { bagO.position.set(A.tie[0], 0.36, A.tie[1]); bagO.rotation.set(0, 0.4, 0); }
        if (bagT) { bagT.visible = t >= T.tied && t < T.end;
          if (bagT.visible && !atLift) { if (bagT.parent !== world) world.attach(bagT); bagT.position.set(A.tie[0], 0.36, A.tie[1]); bagT.rotation.set(0, 0.4, 0); }
          if (bagT.visible && atLift) whenReady(cast.pho, (P) => { FM5.bagOff = handHold5(P, 'Left', bagT, FM5.bagOff, { hang: 0.0, ry: 0.3, out: 0.1, rest: ['Sit_to_Stand_Transition_M', 5.9] }); }); }
        /* where his teacher is: the court; the three rooms; by Mr Koh; at the lift */
        whenReady(cast.pho, (P) => {
          STICK5.to(t < T.eyes ? 'pho' : 'ton');
          if (!inEyes) { put(P, pz.x, pz.z, COURT5.heading + Math.PI); fmRest(P, 'pho', t); }
          else if (t < T.room1) { put(P, -8.6, -7.4, Math.PI * 0.95); fmRest(P, 'pho', t); }
          else if (t < T.room2) { put(P, A.live[0], A.live[1], faceTo(A.live[0], A.live[1], -6.0, -2.6)); pose(P, 'mage_soell_cast_3', fmRun(t, T.room1 + 0.4, T.room1 + 3.2, 0.2, 2.9)); }
          else if (t < T.room3) { put(P, A.dine[0], A.dine[1], faceTo(A.dine[0], A.dine[1], -11.6, 0.9)); pose(P, 'mage_soell_cast_3', fmRun(t, T.room2 + 0.3, T.room2 + 3.0, 0.2, 2.9)); }
          else if (t < T.knot) { put(P, A.terr[0], A.terr[1], faceTo(A.terr[0], A.terr[1], -12.4, -3.6)); pose(P, 'mage_soell_cast_3', fmRun(t, T.room3 + 0.3, T.room3 + 3.0, 0.2, 2.9)); }
          else if (!atLift) { put(P, A.phoKoh[0], A.phoKoh[1], faceTo(A.phoKoh[0], A.phoKoh[1], A.kohWin[0], A.kohWin[1]));
            /* (his three lines to Mr Koh one talk, never cut 0.1 s after each: R25) */
            fmSpeak(P, 'pho', t, [[T.ph5b1, SECS.ph5b1, 'Talk_with_Hands_Open'], [T.ph5b2, SECS.ph5b2, 'Talk_with_Hands_Open'], [T.ph5b3, SECS.ph5b3, 'Talk_with_Hands_Open']]);
            lookNow(P, fmHead(cast.koh, [A.kohWin[0], 1.55, A.kohWin[1]]), 0.8, 0.7); }
          else { put(P, A.liftPho[0], A.liftPho[1], faceTo(A.liftPho[0], A.liftPho[1], A.liftEye[0], A.liftEye[2]));
            fmSpeak(P, 'pho', t, [[T.ph5b4, SECS.ph5b4, 'Talk_with_Hands_Open'], [T.ph5b5, SECS.ph5b5, 'Talk_with_Hands_Open'], [T.ph5b6, SECS.ph5b6, 'Talk_with_Hands_Open']]);
            /* (to Jun for his news and back, each carried over 0.6 s) */
            fmGaze(P, t, [[0, 'lens'], [T.ju5b1 - 0.2, () => fmHead(cast.jun, [A.liftJun[0], 1.6, A.liftJun[1]])], [T.ph5b6, 'lens']], 0.8, 0.7, 0.03, 0.6); }
        });
        /* Ton: the stick in both hands behind his teacher, looking down at it; his line to him; at the lift */
        whenReady(cast.ton, (P) => {
          if (!inEyes) { const s0 = STATION.fight.ton; put(P, s0.x, s0.z, s0.ry); fmRest(P, 'ton', t); }
          else if (t < T.knot) { const at = t < T.room2 ? [-7.02, -4.8] : t < T.room3 ? [-9.35, -2.1] : [-10.0, -3.9];   // (behind his teacher, each clear of the furniture)
            put(P, at[0], at[1], faceTo(at[0], at[1], at[0] - 0.5, at[1] + 1)); pose(P, 'give', 2.6 + 0.08 * Math.sin(t * 0.7)); giveFix5(P); STICK5.onPalms(P, 'stick');
            lookNow(P, [at[0], 0.8, at[1] + 0.5], 0.9, 0.8); }
          else if (!atLift) { put(P, A.tonKoh[0], A.tonKoh[1], faceTo(A.tonKoh[0], A.tonKoh[1], A.eyeKoh[0], A.eyeKoh[2])); pose(P, 'give', 2.6 + 0.08 * Math.sin(t * 0.7)); giveFix5(P); STICK5.onPalms(P, 'stick');
            /* (up to him for his line and back down to the stick, each carried over half a second) */
            fmGaze(P, t, [[0, [A.tonKoh[0], 0.8, A.tonKoh[1] - 0.4]], [T.tn5b1 + 0.6, 'lens'], [T.tn5b1 + SECS.tn5b1, [A.tonKoh[0], 0.8, A.tonKoh[1] - 0.4]]], 0.85, 0.8, 0.03, 0.5); }
          else { const ry0 = faceTo(A.liftTon[0], A.liftTon[1], A.liftPho[0], A.liftPho[1]);
            put(P, A.liftTon[0], A.liftTon[1], ry0); pose(P, 'give', 2.6 + 0.08 * Math.sin(t * 0.7));
            if (t > T.in) fmWalk(P, t, T.in + 0.2, [A.liftTon, [-0.3, 1.6]], 0.9, ['give', 2.6, 0, false], Math.PI, { ry0 });
            giveFix5(P); STICK5.onPalms(P, 'stick'); }
        });
        /* Mr Koh: behind the thread in the court; by his window, the curtain drawn back; his line, his bow; Jun with him */
        whenReady(cast.koh, (P) => {
          if (!inEyes) { const s0 = STATION.fight.koh; put(P, s0.x, s0.z, s0.ry); fmRest(P, 'koh', t); }
          else if (atLift) fmShow(P, false);
          else if (t < T.knot) { put(P, -9.85, -2.25, STATION.hunt.koh.ry); fmRest(P, 'koh', t); }
          else { fmShow(P, true); put(P, A.kohWin[0], A.kohWin[1], faceTo(A.kohWin[0], A.kohWin[1], A.phoKoh[0], A.phoKoh[1]));
            fmTalk(P, 'koh', t, T.ko5b1, SECS.ko5b1, 'Talk_with_Hands_Open');
            const bow = smo(c01((t - T.wai) / 0.6)) * (1 - smo(c01((t - T.wai - 1.4) / 0.8)));
            lookNow(P, lp3(fmHead(cast.pho, [A.phoKoh[0], 1.6, A.phoKoh[1]]), [A.phoKoh[0], 0.6, A.phoKoh[1]], bow), 0.85, 0.85); }   // (the bow carried by its own ease, never handed in a frame)
        });
        whenReady(cast.jun, (P) => {
          if (!inEyes) { const s0 = STATION.fight.jun; put(P, s0.x, s0.z, s0.ry); fmRest(P, 'jun', t); }
          /* (0.87 m from his teacher: at 0.54 his body was in Grandmaster Pho's robe, clipscan 920 to 9826 crossings) */
          else if (!atLift) { put(P, -10.15, -3.9, faceTo(-10.15, -3.9, A.kohWin[0], A.kohWin[1])); fmRest(P, 'jun', t); }
          else { put(P, A.liftJun[0], A.liftJun[1], faceTo(A.liftJun[0], A.liftJun[1], A.liftPho[0], A.liftPho[1])); fmTalk(P, 'jun', t, T.ju5b1, SECS.ju5b1, 'Talk_with_Right_Hand_Open');
            if (t > T.in + 0.5) fmWalk(P, t, T.in + 0.5, [A.liftJun, [0.3, 1.7]], 0.9, restOf5('jun', t), Math.PI); }
        });
        /* the curtains of his front windows drawn back and a window open (night air) from the knot on; the fourth lamp
           flickers once, and holds */
        CURTAINS5.set(t >= T.knot ? 1 : 0);
        lamp(1, t > T.window + 0.6 && t < T.window + 1.0 ? 0.25 : 1);
        /* what is drawn out of each room's air into the bag: dark threads gathering to the bag's mouth before him */
        WISPS5.set(t, [[T.room1 + 0.6, A.live], [T.room2 + 0.5, A.dine], [T.room3 + 0.5, A.terr]]);
        /* the lift: the doors at the end */
        liftDoors(atLift ? smo(c01((t - T.doors) / 1.4)) * (1 - smo(c01((t - T.close) / 1.3))) : 0);
        /* THE LENS: from the boom, forward and down into his head (the violet), then his own eyes */
        const B0 = boomAt({ x: pz.x, z: pz.z }), ZH = [zz.x, 1.66, zz.z];
        fmTrack(t, [
          { t: 0, name: 'fightcam', eye: B0.eye, yaw: B0.heading, pitch: B0.pitch, fp: B0.fov, fd: B0.fov },
          { t: T.violet + 0.3, name: 'into', eye: [ZH[0], ZH[1] + 0.35, ZH[2] - 0.9], at: [ZH[0], 1.4, ZH[2] + 2.5], fp: 60, fd: 54 },
          { t: T.eyes, name: 'eyes', eye: [ZH[0], EYE, ZH[2] + 0.02], at: [ZH[0], 1.05, ZH[2] + 1.6], fp: 62, fd: 56, cut: true },
          { t: T.room1 - 0.3, name: 'eyes', eye: [ZH[0], EYE, ZH[2] + 0.02], at: [-8.6, 1.4, -7.0], fp: 60, fd: 54 },
          { t: T.room1, name: 'living', eye: A.eyeLive, at: [A.live[0] - 0.4, 1.5, A.live[1] + 1.4], fp: 56, fd: 50, cut: true },
          { t: T.room2 - 0.05, name: 'living', eye: [A.eyeLive[0] - 0.1, EYE, A.eyeLive[2] + 0.1], at: [A.live[0] - 0.6, 1.45, A.live[1] + 1.6], fp: 54, fd: 48 },
          { t: T.room2, name: 'dining', eye: A.eyeDine, at: [A.dine[0] - 0.5, 1.45, A.dine[1] + 1.4], fp: 56, fd: 50, cut: true },
          { t: T.room3 - 0.05, name: 'dining', eye: [A.eyeDine[0], EYE, A.eyeDine[2] + 0.1], at: [A.dine[0] - 0.7, 1.45, A.dine[1] + 1.6], fp: 54, fd: 48 },
          { t: T.room3, name: 'terrace', eye: A.eyeTerr, at: [A.terr[0] - 1.2, 1.45, A.terr[1]], fp: 56, fd: 50, cut: true },
          { t: T.knot - 0.05, name: 'terrace', eye: [A.eyeTerr[0] - 0.1, EYE, A.eyeTerr[2]], at: [A.terr[0] - 1.3, 1.45, A.terr[1]], fp: 54, fd: 48 },
          /* (the bag on its table with the table round it, the knot readable: at 0.85 m on a 30 degree lens its black cloth
             filled the whole phone: bagtied-018_5) */
          { t: T.knot, name: 'knot', eye: [A.tie[0] + 0.7, 1.15, A.tie[1] - 0.75], at: [A.tie[0], 0.5, A.tie[1]], fp: 46, fd: 38, cut: true },
          /* (the bag tied seen on its own CUT, as the plan has it: the open bag became the tied one in one frame mid-shot) */
          { t: T.tied - 0.05, name: 'knot', eye: [A.tie[0] + 0.64, 1.11, A.tie[1] - 0.7], at: [A.tie[0], 0.52, A.tie[1]], fp: 43, fd: 36 },
          { t: T.tied, name: 'tied', eye: [A.tie[0] + 0.45, 0.98, A.tie[1] - 0.82], at: [A.tie[0], 0.5, A.tie[1]], fp: 40, fd: 34, cut: true },
          { t: T.tn5b1 - 0.05, name: 'tied', eye: [A.tie[0] + 0.42, 0.97, A.tie[1] - 0.78], at: [A.tie[0], 0.5, A.tie[1]], fp: 38, fd: 32 },
          { t: T.tn5b1, name: 'ton', eye: A.eyeKoh, at: () => fmHead(cast.ton, [A.tonKoh[0], 1.6, A.tonKoh[1]]), fp: 46, fd: 40, cut: true },
          { t: T.window - 0.05, name: 'ton', eye: A.eyeKoh, at: () => fmHead(cast.ton, [A.tonKoh[0], 1.6, A.tonKoh[1]]), fp: 44, fd: 38 },
          { t: T.window, name: 'window', eye: A.eyeKoh, at: () => lp3(fmHead(cast.koh, [A.kohWin[0], 1.55, A.kohWin[1]]), [A.kohWin[0] - 0.3, 1.5, A.kohWin[1] - 0.5], 0.3), fp: 52, fd: 46, cut: true },
          { t: T.ph5b1 + 0.4, name: 'koh', eye: A.eyeKoh, at: () => fmHead(cast.koh, [A.kohWin[0], 1.55, A.kohWin[1]]), fp: 44, fd: 38 },
          { t: T.ph5b2 + 0.5, name: 'pho', eye: A.eyeKoh, at: () => fmHead(cast.pho, [A.phoKoh[0], 1.6, A.phoKoh[1]]), fp: 46, fd: 40 },
          { t: T.lift - 0.05, name: 'pho', eye: A.eyeKoh, at: () => fmHead(cast.pho, [A.phoKoh[0], 1.6, A.phoKoh[1]]), fp: 46, fd: 40 },
          { t: T.lift, name: 'lift', eye: A.liftEye, at: () => fmHead(cast.pho, [A.liftPho[0], 1.6, A.liftPho[1]]), fp: 50, fd: 44, cut: true },
          { t: T.ju5b1 - 0.1, name: 'lift', eye: A.liftEye, at: () => fmHead(cast.pho, [A.liftPho[0], 1.6, A.liftPho[1]]), fp: 46, fd: 42 },
          { t: T.ju5b1 + 0.6, name: 'jun', eye: A.liftEye, at: () => fmHead(cast.jun, [A.liftJun[0], 1.6, A.liftJun[1]]), fp: 50, fd: 44 },
          /* (held on Jun to his last word and on his teacher for "Tomorrow.": drifted toward the doors from 79 s, a phone lost
             Jun from 80.5 s of his line and his teacher's answer: e4c5filmread FRAME) */
          { t: T.ju5b1 + SECS.ju5b1 - 0.1, name: 'jun', eye: A.liftEye, at: () => fmHead(cast.jun, [A.liftJun[0], 1.6, A.liftJun[1]]), fp: 50, fd: 44 },
          { t: T.ph5b6 + 0.05, name: 'pho', eye: A.liftEye, at: () => fmHead(cast.pho, [A.liftPho[0], 1.6, A.liftPho[1]]), fp: 48, fd: 42 },
          { t: T.ph5b6 + SECS.ph5b6 + 0.1, name: 'pho', eye: A.liftEye, at: () => fmHead(cast.pho, [A.liftPho[0], 1.6, A.liftPho[1]]), fp: 48, fd: 42 },
          { t: T.in, name: 'doors', eye: A.liftEye, at: [0.0, 1.45, 1.6], fp: 62, fd: 54 },
          { t: T.close + 0.4, name: 'in', eye: [0.0, EYE, 0.9], at: [0.0, 1.4, 1.6], fp: 66, fd: 58 },
          { t: T.end, name: 'in', eye: [0.0, EYE, 1.0], at: [0.0, 1.4, 1.8], fp: 66, fd: 58 }
        ]);
      },
      end() { fmLens(PLAYFOV5); CURTAINS5.set(0); WISPS5.off(); liftDoors(0); lamp(1, 1);
        if (things.bagTied && things.bagTied.parent !== world) world.attach(things.bagTied); if (things.bagTied) things.bagTied.visible = false; FM5.bagOff = null;
        if (FM5.api && FM5.api.handPose) FM5.api.handPose(null, 0); if (FM5.api && FM5.api.handsRoot) FM5.api.handsRoot.position.set(0, 0, 0);
        endPhase5('table'); }
    };
    /* (the bag tied: his front curtains drawn back by Mr Koh's own hand, on a cut: each slid along its rail toward the
       window's sides; the night through the glass) */
    /* (found by the places the world gave them, b_world.js: each front window's two, at the window's middle less and more
       4 cm, 0.10 and 0.32 m inside the front wall; slid to either side of the window) */
    const CURTAINS5 = (() => {
      let found = null;
      const find = () => { found = [];
        for (const Wn of [WIN_A, WIN_B]) { const xm = (Wn.x0 + Wn.x1) / 2;
          for (const o of world.children) if (o.isGroup && o.userData.model !== undefined && Math.abs(o.position.z - (LIVING.z0 + 0.10)) < 0.005 && Math.abs(o.position.x - (xm - 0.04)) < 0.005) found.push({ o, x0: o.position.x, side: -1 });
          for (const o of world.children) if (o.isGroup && o.userData.model !== undefined && Math.abs(o.position.z - (LIVING.z0 + 0.32)) < 0.005 && Math.abs(o.position.x - (xm + 0.04)) < 0.005) found.push({ o, x0: o.position.x, side: 1 }); } };
      return { set(k) { if (!found || found.length < 4) find(); for (const C of found) C.o.position.x = C.x0 + C.side * 0.42 * k; } };
    })();
    /* what is drawn from each room's air into the bag's mouth before him: a few dark threads gathering to a point in front
       of his face, for two and a half seconds after each breath (painted: a fixed set, v6.15) */
    const WISPS5 = (() => {
      const soft = (() => { const [c, x] = canvas(64, 64); const gr = x.createRadialGradient(32, 32, 1, 32, 32, 31);
        gr.addColorStop(0, 'rgba(20,18,26,0.9)'); gr.addColorStop(1, 'rgba(20,18,26,0)'); x.fillStyle = gr; x.fillRect(0, 0, 64, 64); return tex(done(THREE, c, false)); })();
      const L = [], r = rng(28660);
      for (let i = 0; i < 40; i++) { const m = new THREE.SpriteMaterial({ map: soft, color: 0x2a2632, transparent: true, opacity: 0, depthWrite: false }); mats.push(m);
        const sp = new THREE.Sprite(m); sp.scale.setScalar(0.08 + r() * 0.08); sp.visible = false; world.add(sp);
        L.push({ sp, m, a: r() * 6.28, rr: 1.0 + r() * 1.6, y: 0.5 + r() * 1.6, lag: r() * 0.9 }); }
      return {
        set(t, list) { let any = false;
          for (const [t0, at] of list) { const u0 = (t - t0) / 2.6; if (u0 < 0 || u0 > 1.2) continue; any = true;
            const fx = at[0], fz = at[1];
            for (const W of L) { const u = c01((t - t0 - W.lag) / 1.9); W.sp.visible = u > 0 && u < 1; if (!W.sp.visible) continue;
              const k = u * u * (3 - 2 * u), rr = W.rr * (1 - k);
              W.sp.position.set(fx + Math.cos(W.a + u * 1.4) * rr, lp(W.y, 1.45, k), fz + 0.45 + Math.sin(W.a + u * 1.4) * rr); W.m.opacity = 0.5 * Math.sin(Math.PI * u); } }
          if (!any) this.off(); },
        off() { for (const W of L) W.sp.visible = false; }
      };
    })();

    /* ================================================================ THE COLLECTOR, THE FILM IN (the plan's 4.7; CO5)
       The card on black, "The next afternoon." Daylight in the room where Grandmaster Pho receives people: the low table
       under its white cloth, his teacher seated cross-legged behind it, the ceiling fan turning, the afternoon in the
       window; a man in his thirties at the table's end with a padded case: on a cut its pieces are laid out on the cloth,
       about twenty, in rows (quickly, the way a man gets rid of something: heard, laid one after another, as the shot
       finds them); his first words over them, his small laugh, the rest. It ends on the view the table begins in */
    /* HIS EYE AT THE TABLE: his seat (STATION.table.at) at the seated height the play gives him (c_story.js SIT5), so the
       collector's film and the endings stand where the table's play seats him, whatever view a film began in */
    const SEATEYE5 = () => [STATION.table.at.x, SIT5.y, STATION.table.at.z];
    /* the collector's head as a shot aims at it: his seat, a hand forward of it along his facing (he sits leaning forward
       over the table; aimed at his seat his face stood at the phone's edge: collector-00015, 21 Nov), at a seated head's
       height */
    const colHead5 = () => { const P = cast.col, S0 = STATION.table.collector, g = P && P.ready && P.group.visible ? P.group.position : null,
      r = g ? P.group.rotation.y : S0.ry, x = g ? g.x : S0.x, z = g ? g.z : S0.z; return [x + Math.sin(r) * 0.22, 0.98, z + Math.cos(r) * 0.22]; };
    FILMS5.collector = {
      begin(api, s) {
        FM5.once = new Set(); FM5.lit = ''; FM5.s = s; FM5.api = api;
        if (api && api.handsRoot) api.handsRoot.visible = false;
        fmShow(cast.pho, false); fmShow(cast.ton, false); whenReady(cast.koh, (P) => fmShow(P, false));
        fmShow(cast.phoS, true); fmShow(cast.col, true); whenReady(cast.jun, (P) => fmShow(P, true));
        PIECES5.set(false);
      },
      frame(t) {
        const T = CO5, R = ROOM, me = SEATEYE5();
        fmLook('DAY');
        /* the receiving room's afternoon and its fan as the picture comes up; the smell he brought in with the case */
        fmBeds({ rfan: 0.55 * smo(c01((t - T.up) / 1.2)), sour: 0.22 * smo(c01((t - T.case) / 2.0)) });
        if (things.fan) things.fan.rotation.y = t * 2.6;
        /* the card, on the black (W.cardNext: the sheet's words; drawn by the captions, the screen's own words) */
        if (kit && kit.captions && !FM5.once.has('card') && t >= T.card) { FM5.once.add('card'); kit.captions([{ at: 0, end: 2.4, text: W.cardNext, sub: '' }]); }
        /* the pieces: laid out on the cut, the three of the presences among them */
        PIECES5.set(t >= T.laid);
        /* (each look carried from one thing to the next over 0.6 s, never handed in a frame; the collector's one take PLAYS
           through his lines, fmSpeak: mixed with itself it sagged toward its bind pose at each line's start and end, R25) */
        whenReady(cast.phoS, (P) => { const s0 = STATION.table.pho; put(P, s0.x, s0.z, s0.ry, CUSHION_TOP); fmRest(P, 'pho', t); pose(P, 'Sit_to_Stand_Transition_M', fmPing(t, 0.02, 0.3, 6));
          fmGaze(P, t, [[0, [R.cx, 0.4, R.cz - 0.1]], [T.co5t1, () => fmHead(cast.col, [STATION.table.collector.x, 0.95, STATION.table.collector.z])]], 0.7, 0.7, 0.03, 0.6); });
        whenReady(cast.col, (P) => { const s0 = STATION.table.collector; put(P, s0.x, s0.z, s0.ry, CUSHION_TOP);
          fmSpeak(P, 'col', t, [[T.co5t1, SECS.co5t1, 'Sitting_Answering_Questions'], [T.co5t2, SECS.co5t2, 'Sitting_Answering_Questions']]);
          fmGaze(P, t, [[0, [R.cx - 0.1, 0.35, R.cz - 0.1]], [T.co5t1, () => fmHead(cast.phoS, [0, 0.95, 240.78])], [T.co5t2 + 3.0, 'lens']], 0.8, 0.7, 0.03, 0.6); });
        whenReady(cast.jun, (P) => { const s0 = STATION.table.jun; put(P, s0.x, s0.z, s0.ry); fmRest(P, 'jun', t); lookNow(P, [R.cx, 0.4, R.cz], 0.5, 0.7); });
        const COL = colHead5;
        fmTrack(t, [
          { t: 0, name: 'room', eye: [R.x1 - 0.35, 1.5, R.z0 + 0.45], at: [R.cx - 0.2, 0.55, R.cz + 0.4], fp: 62, fd: 54 },
          { t: T.case, name: 'room', eye: [R.x1 - 0.4, 1.45, R.z0 + 0.5], at: [R.cx - 0.3, 0.5, R.cz + 0.2], fp: 58, fd: 50 },
          { t: T.case + 0.05, name: 'case', eye: [me[0] - 0.25, me[1], me[2] + 0.05], at: COL, fp: 50, fd: 44, cut: true },
          { t: T.laid - 0.05, name: 'case', eye: [me[0] - 0.25, me[1], me[2] + 0.05], at: () => lp3(COL(), [R.cx - 0.36, 0.4, R.cz - 0.05], 0.5), fp: 48, fd: 42 },
          { t: T.laid, name: 'cloth', eye: [me[0], me[1] - 0.05, me[2] + 0.05], at: [R.cx, 0.35, R.cz - 0.12], fp: 40, fd: 34, cut: true },
          { t: T.co5t1 + SECS.co5t1, name: 'cloth', eye: [me[0], me[1] - 0.05, me[2] + 0.05], at: [R.cx - 0.1, 0.36, R.cz - 0.15], fp: 44, fd: 38 },
          { t: T.co5t2 + 0.6, name: 'col', eye: me, at: COL, fp: 54, fd: 46 },
          { t: T.co5t2 + SECS.co5t2 - 0.35, name: 'col', eye: me, at: COL, fp: 50, fd: 44 },   // (on him to his line's end: from 1.2 s before it a phone lost him, e4c5filmread FRAME)
          /* (it ends on his seat's own view and KEEPS it (z_tail.js: keep.view), where the table's play seats him (c_story.js
             seatHim): the view it began in was the court's, where the bag tied film left the rig) */
          { t: T.end, name: 'table', eye: me, yaw: STATION.table.at.ry, pitch: SIT5.pitch, fp: PLAYFOV5, fd: PLAYFOV5 }   // (the seat's own look, PLAY's SIT5: no turn as play takes over)
        ]);
      },
      end() { fmLens(PLAYFOV5); PIECES5.set(true); endPhase5('table'); }
    };

    /* ================================================================ THE FOUR ENDINGS (the plan's 4.9), each a whole story,
       each that afternoon, and in each THE RITE, seen (the case file's own): Grandmaster Pho chants low and sprinkles holy
       water over the pieces with the fan; the film holds his Spirit Vision open for the rite's length; as the water
       touches them the presences cry out and come away from the pieces, each lifting off its piece and leaving the light
       of the table, thin and far (none is shown destroyed); the pieces gathered into the black bag (on a cut), sealed
       with white sacred string and chanted over "so that nothing could escape"; the smell goes: "I feel lighter. My head
       is quieter." THE LAST PICTURE, in every ending: the black bag on the white cloth, the string round its neck,
       Grandmaster Pho's hand resting on it, the empty case open beside it: "Understanding first. Then possession."
       Their clocks: EN5[k] (each ending's own beats, its rite at EN5[k].rite, its close after); the rite's own beats RT5,
       the close's CL5. Each ends on its black: the card lies over it */
    const RITE_AT = { bag: [ROOM.cx + 0.05, ROOM.cz + 0.22], fanFrom: [ROOM.cx + 0.12, 0.72, ROOM.cz + 0.48] };
    const presOf5 = () => (typeof pres !== 'undefined' ? pres : null);
    const BAGBLOB5 = { m: null, o: null };
    /* (each bag's own painted contact shadow, carried with it: the open bag on the low table at the knot read as floating,
       bagtied-phone 18.6 on deploy 10; made once, the first film that sets a bag down) */
    function bagBlobs5() { if (things.bagOpen && !BAGBLOB5.o) BAGBLOB5.o = blob(things.bagOpen, 0.3, 0.28);
      if (things.bagTied && !BAGBLOB5.m) BAGBLOB5.m = blob(things.bagTied, 0.34, 0.3); }
    FILMS5.ending = {
      begin(k, api, s) {
        FM5.once = new Set(); FM5.lit = ''; FM5.s = s; FM5.api = api; this.k = k;
        if (api && api.handsRoot) api.handsRoot.visible = false;
        fmShow(cast.phoS, true); fmShow(cast.col, true); PIECES5.set(true);
        RITE5.bowl.visible = true;
        if (things.bagTied) { if (things.bagTied.parent !== world) world.attach(things.bagTied); things.bagTied.visible = false;
          if (!BAGBLOB5.m) BAGBLOB5.m = blob(things.bagTied, 0.34, 0.3); }   // (a painted contact shadow: on the cloth it read as floating; kept here, never in userData: v25.4)
      },
      frame(k, t, api) {
        const E = EN5[k], R = ROOM, r0 = E.rite, RT = RT5, CL = CL5, c0 = E.close, me = SEATEYE5();
        const tr = t - r0, tc = t - c0;
        fmLook('DAY');
        /* the receiving room and its fan; the smell until the rite ends, and then gone ("My head is quieter") */
        fmBeds({ rfan: 0.55, sour: 0.24 * (1 - smo(c01((tr - RT.end + 1.2) / 1.6))) });
        if (things.fan) things.fan.rotation.y = t * 2.6;
        /* THE PIECES: on the cloth until the rite gathers them (on a cut, into the bag), the case beside */
        const gathered = tr >= RT.bag;
        PIECES5.set(!gathered);
        const bag = things.bagTied;
        if (bag) { bag.visible = gathered; if (gathered) { bag.position.set(RITE_AT.bag[0], 0.345, RITE_AT.bag[1]); bag.rotation.set(0, 0.5, 0); } }
        RITE5.string(gathered ? smo(c01((tr - RT.string) / 0.6)) : 0, bag);
        /* the presences (the play's own, c_play.js pres): crying out and coming away as the water reaches them, each
           lifting off its piece and leaving the table's light */
        const P5 = presOf5();
        if (P5) for (const [nm, i] of [['angry', 0], ['hungry', 1], ['energy', 2]]) { const q = P5[nm]; if (!q) continue;
          const u = smo(c01((tr - RT.away - i * 0.7) / 3.0));
          q.grp.visible = tr < RT.away + 3.6 + i * 0.7 && u < 0.999;
          if (q.grp.visible) { q.grp.position.set(q.home.x + (q.home.x - R.cx) * 2.2 * u, q.home.y + 1.1 * u * u, q.home.z + 0.9 * u);
            if (q.fx) q.fx.set('uAlpha', 1 - u); } }
        /* HIS SIGHT held open for the rite's length (a scene shuts it on its first frame; the film holds it); ending C opens
           it earlier, on his hands at the case */
        /* (ending C opens it a first time on the case, for the small thing, and shuts it again for the talk: held open from
           there to the rite's end, every face of the talk was the vision's dark negative of a bright room: endC-00009) */
        const vv = ENDS5[k].vis ? ENDS5[k].vis(E) : null;
        if (vv && t < vv[1] + 1.5) fmVision(t, vv[0], 1.8, vv[1], 1.4); else fmVision(t, r0 + RT.see, 1.8, r0 + RT.unsee, 1.4);
        /* Grandmaster Pho: at rest; through the rite the fan in his left hand dipped and thrown (his seated cheer's raise and
           fall: the flick's own take is wanted, the plan's 9.1); his hand on the bag in the last picture */
        /* (R25, "jerky character motions", measured: his seated talk was mixed with his STANDING rest (restOf5 'pho', the
           rise's last moment), so at each line's start and end he half rose; each throw of the fan began from the last one's
           top in one frame (the take wrapped); the rite's first throw and its end were put in one frame; and every look was
           handed over in one. Now: his seated rest (REST5.phoS); the rite's throws eased in and out, each throw from his rest
           and back to it; the fan in his hand from the rite's own cut to the bag's (both cuts); each look carried 0.6 s) */
        const COLH = () => fmHead(cast.col, [STATION.table.collector.x, 0.95, STATION.table.collector.z]), CLOTH = [R.cx, 0.36, R.cz - 0.1];
        whenReady(cast.phoS, (P) => { const s0 = STATION.table.pho; put(P, s0.x, s0.z, s0.ry, CUSHION_TOP);
          /* (the throws end on the cut to the bag: the pieces are in it, and that close sees no fan) */
          const wf = tr > RT.dip && tr < RT.bag ? smo(c01((tr - RT.dip) / 0.4)) : 0;
          if (wf > 0) { const cyc = ((tr - RT.dip) % 2.2 + 2.2) % 2.2, wc = smo(c01(cyc / 0.25)) * (1 - smo(c01((cyc - 1.95) / 0.25))), r = restOf5('phoS', t);
            pose(P, 'Sit_Cheer_with_Left_Hand', 0.25 + cyc * 0.85, false, r[0], 1 - wf * wc, r[1]); }
          else fmSpeak(P, 'phoS', t, (E.pho || []).map(([key, at]) => [at, SECS[key] || 2, 'Sitting_Answering_Questions']));
          if (tr >= 0 && tr < RT.bag) FM5.fanOff = handHold5(P, 'Left', RITE5.fan, FM5.fanOff, { base: 0.05, ry: 0, rest: ['Sit_Cheer_with_Left_Hand', 1.2] }); else RITE5.fan.visible = false;
          const L = [[0, COLH]];
          for (const [key, at, to] of (E.pho || [])) if (to === 'me') { L.push([at - 0.2, 'lens']); L.push([at + (SECS[key] || 2) + 0.2, COLH]); }
          L.push([r0, CLOTH]); L.push([r0 + RT.end, COLH]); L.sort((a, b) => a[0] - b[0]);
          fmGaze(P, t, L, 0.7, 0.7, 0.03, 0.6); });
        if (tr > RT.dip && tr < RT.bag) { const ft = (tr - RT.dip) % 2.2; RITE5.throwAt(ft, 0.9, RITE_AT.fanFrom, R.cx, R.cz - 0.12); } else RITE5.dropsOff();
        /* the collector: his own story first; still through the rite; lighter after it; standing at the door, and gone */
        whenReady(cast.col, (P) => { const s0 = STATION.table.collector;
          const gone = E.gone != null && t >= E.gone;
          if (gone) { fmShow(P, false); return; }
          fmShow(P, true);
          /* (R25: his one seated take PLAYS through his lines, fmSpeak, where mixed with itself it sagged toward its bind pose
             at each line; at the door, standing, he talks with his hands for his line there) */
          if (E.door != null && t >= E.door) { put(P, -1.15, 237.95, faceTo(-1.15, 237.95, me[0], me[2]));
            fmSpeak(P, 'koh', t, Object.keys(E).filter(q => /^co5/.test(q) && E[q] >= E.door && SECS[q]).map(q => [E[q], SECS[q], 'Talk_with_Hands_Open'])); }
          else { put(P, s0.x, s0.z, s0.ry, CUSHION_TOP);
            fmSpeak(P, 'col', t, (E.col || []).map(([key, at]) => [at, SECS[key] || 2, 'Sitting_Answering_Questions'])); }
          /* (his looks: the ending's own, then the cloth through the rite, then him: each carried 0.6 s) */
          const L = ENDS5[k].colLooks ? ENDS5[k].colLooks(E).slice() : [[0, 'lens']];
          L.push([r0, CLOTH]); L.push([r0 + RT.end, 'lens']); L.sort((a, b) => a[0] - b[0]);
          fmGaze(P, t, L, 0.75, 0.7, 0.03, 0.6); });
        /* the ending's own things (the case pushed across, the lid, the three) */
        const X = ENDS5[k];
        if (X.things) X.things(t, E, me);
        /* THE LENS: the ending's own shots, the rite's, the close's */
        const COL = colHead5, PHO = () => fmHead(cast.phoS, [0, 0.95, 240.78]);
        const keys = X.shots(me, COL, PHO, E).concat([
          /* (the rite begins on a CUT: eased from the shot before over its last twentieth of a second, ending B read as two
             jolts, the look 6.5 and 9.9 degrees in two steps: lensread.py on deploy 7) */
          { t: r0, name: 'rite', eye: [me[0] + 0.2, me[1] + 0.05, me[2] - 0.1], at: () => lp3(PHO(), [R.cx, 0.4, R.cz], 0.55), fp: 52, fd: 46, cut: true },
          { t: r0 + RT.see + 1.2, name: 'rite', eye: [me[0] + 0.1, me[1], me[2]], at: [R.cx, 0.42, R.cz - 0.05], fp: 46, fd: 40 },
          { t: r0 + RT.away + 2.6, name: 'away', eye: [me[0], me[1] + 0.05, me[2] - 0.05], at: [R.cx + 0.1, 0.9, R.cz + 0.1], fp: 58, fd: 50 },
          { t: r0 + RT.bag, name: 'bag', eye: [me[0] + 0.15, me[1] - 0.1, me[2] + 0.15], at: [RITE_AT.bag[0], 0.45, RITE_AT.bag[1]], fp: 34, fd: 30, cut: true },
          { t: r0 + RT.end, name: 'bag', eye: [me[0] + 0.12, me[1] - 0.1, me[2] + 0.12], at: [RITE_AT.bag[0], 0.48, RITE_AT.bag[1]], fp: 32, fd: 28 },
          { t: r0 + RT.end + 0.05, name: 'lighter', eye: me, at: COL, fp: 46, fd: 40, cut: true },
          /* (on him to "My head is quieter."'s last word: in C and D the lens eased to the table from the cut, through it) */
          { t: E.co5z1 + SECS.co5z1 - 0.1, name: 'lighter', eye: me, at: COL, fp: 45, fd: 39 }
        ]).concat(X.after(me, COL, PHO, E)).concat([
          /* (the bag, its string, his teacher's hand on it and the empty case beside it, all in the picture: at 0.9 m on a 36
             degree lens the bag alone filled the phone, the hand at its edge: endA-00050, 21 Nov) */
          { t: c0, name: 'last', eye: [RITE_AT.bag[0] + 0.8, 1.02, RITE_AT.bag[1] - 0.72], at: [RITE_AT.bag[0] - 0.1, 0.44, RITE_AT.bag[1] + 0.06], fp: 46, fd: 38, cut: true },
          { t: c0 + CL.end, name: 'last', eye: [RITE_AT.bag[0] + 0.72, 0.98, RITE_AT.bag[1] - 0.66], at: [RITE_AT.bag[0] - 0.09, 0.44, RITE_AT.bag[1] + 0.06], fp: 42, fd: 35 }
        ]);
        keys.sort((a, b) => a.t - b.t);
        fmTrack(t, keys);
        /* the case: on the cloth until it is pushed across (each ending's own), open and empty in the last picture */
        if (tc >= 0) caseAt5(RITE_AT.bag[0] - 0.36, RITE_AT.bag[1] - 0.04, 0.3);
        /* THE LAST PICTURE: his teacher's right hand laid on the bag (the people's own hand laid on a thing: handTo, its
           palm on the bag's shoulder, the fingers toward the student) */
        if (tc >= 0 && bag) whenReady(cast.phoS, (P) => handTo(P, 'R', [RITE_AT.bag[0] - 0.02, 0.345 + 0.16, RITE_AT.bag[1] + 0.03], [0.05, -0.35, -0.93], [0, -1, 0.2], smo(c01(tc / 0.6)), { out: 0.22, down: 0.3 }));
      },
      end() { fmLens(PLAYFOV5); fmVisionOff(); RITE5.dropsOff(); RITE5.fan.visible = false; if (FM5.api && FM5.api.handPose) FM5.api.handPose(null, 0); if (kit && kit.captions) kit.captions(null);
        fmBeds(null);
        /* (the presences put back where the play keeps them, whole: the rite carried them off the table) */
        { const P5 = presOf5(); if (P5) for (const nm in P5) { const q = P5[nm]; if (q && q.grp && q.home) { q.grp.position.copy(q.home); if (q.fx) q.fx.set('uAlpha', 1); } } }
        /* (a same-chapter replay never runs build() again: what the ending moved is put back, v8.1) */
        if (things.bagTied) things.bagTied.visible = false; RITE5.string(0, null); RITE5.bowl.visible = false; SMALL5.set(0, 0);
        PIECES5.set(true); threeAt5(0); if (casePos0.x !== null) caseAt5(casePos0.x, casePos0.z, casePos0.ry); }
    };

    /* EACH ENDING'S OWN DIRECTION (its lines' times are its clock, EN5[k], z_tail.js): its shots before the rite and after
       it, the things it moves, where the collector looks. The four are four KINDS of answer (the plan's 4.8): an order
       obeyed (A), a man finding out that he does not know (B), a collection sorted by a smell (C), a rule about kinds (D) */
    const DOOR5 = [-1.15, 1.55, 237.95];
    const casePos0 = { x: null, z: null, ry: null };
    function caseAt5(x, z, ry) { const pc = things.padcase; if (!pc) return; if (casePos0.x === null) { casePos0.x = pc.position.x; casePos0.z = pc.position.z; casePos0.ry = pc.rotation.y; }
      pc.position.set(x != null ? x : casePos0.x, 0.34, z != null ? z : casePos0.z); pc.rotation.set(0, ry != null ? ry : casePos0.ry, 0); }
    function casePush5(t, t0, t1, to) { caseAt5(); const u = smo(c01((t - t0) / Math.max(0.05, t1 - t0))); caseAt5(lp(casePos0.x, to[0], u), lp(casePos0.z, to[1], u), casePos0.ry + 0.35 * u); }
    const THREE5 = ['w5wuathanu', 'w5rakyom', 'w5hunphayon'];
    const threeHome5 = {};
    function threeAt5(u) { for (const key of THREE5) { const g = things[key]; if (!g) continue; if (!threeHome5[key]) threeHome5[key] = g.position.clone();
      const h = threeHome5[key]; g.position.set(lp(h.x, h.x * 0.4 + 0.05, u), h.y, lp(h.z, 240.28, u)); } }
    /* (ending C) something small that his nose never caught, on a piece he has already packed: a pale thing lifting its
       head out of the case's foam, seen only in his sight (drawn as the play's presences are: ctx.spirit) */
    const SMALL5 = (() => { const g = new THREE.Group(); const m = new THREE.Mesh(new THREE.SphereGeometry(0.022, 14, 10), matProxy); owned.push(m.geometry); g.add(m); g.visible = false; world.add(g);
      const fx = ctx.spirit ? ctx.spirit(g, { color: 0xd8c8ff, fill: 0.16, rim: 1.6, flicker: 0.12, power: 2.2, xray: 0.4 }) : null;
      return { set(k, t) { g.visible = k > 0.01; if (!g.visible) return; const pc = things.padcase, x = pc ? pc.position.x : -0.36, z = pc ? pc.position.z : 239.95;
        g.position.set(x + 0.03, 0.43 + 0.05 * k + 0.006 * Math.sin(t * 2.1), z - 0.02); g.scale.setScalar(0.6 + 0.4 * k); if (fx) fx.set('uAlpha', k); } };
    })();
    const ENDS5 = {
      /* A · "None of them. Let them all go." (good): he flinches, then nods, too quickly; "All." He pushes the case over as
         a man pays a fine. After the rite, at the door, lighter, already asking where to buy good ones; the student has no
         answer ready; his teacher's two lines; his own thought */
      A: { shots: (me, COL, PHO, E) => [
             { t: 0, name: 'col', eye: me, at: COL, fp: 44, fd: 38 },
             { t: E.q5A1 + 0.4, name: 'col', eye: me, at: COL, fp: 42, fd: 36 },
             { t: E.push + 0.2, name: 'push', eye: [me[0] - 0.08, me[1] - 0.04, me[2]], at: [-0.18, 0.42, 240.02], fp: 46, fd: 40 },
             { t: E.rite - 0.05, name: 'push', eye: [me[0] - 0.08, me[1] - 0.04, me[2]], at: [-0.02, 0.42, 240.16], fp: 46, fd: 40 } ],
           after: (me, COL, PHO, E) => [
             { t: E.door, name: 'door', eye: me, at: () => fmHead(cast.col, DOOR5), fp: 50, fd: 44, cut: true },
             { t: E.ph5A1 - 0.05, name: 'door', eye: me, at: () => fmHead(cast.col, DOOR5), fp: 50, fd: 44 },
             /* (to his teacher on a CUT: the door is behind his left shoulder and his teacher before him, and panned the look
                swung 138 degrees in half a second: endA lens, three steps read as cuts) */
             { t: E.ph5A1, name: 'pho', eye: me, at: PHO, fp: 46, fd: 40, cut: true },
             { t: E.ph5A2 + 0.3, name: 'pho', eye: me, at: PHO, fp: 44, fd: 38 },
             /* (on him to his line's last word, then down to the table: eased from 35.7 s to 43.2 s, the look left him in
                the middle of his line and he was off a phone's and a desktop's frame from 40.9 s, e4c5filmread FRAME) */
             { t: E.ph5A2 + SECS.ph5A2 - 0.1, name: 'pho', eye: me, at: PHO, fp: 43, fd: 37 },
             { t: E.q5A2 + 1.0, name: 'table', eye: me, at: [0, 0.4, 240.0], fp: 52, fd: 46 } ],
           things: (t, E) => casePush5(t, E.push, E.push + 1.4, [0.14, 240.3]) },
      /* B · "Tell me what each one is, and where it came from." (best): he starts confidently at the first row; the second;
         the third he turns over twice; he stops with his hand on the fourth, looks along the rows, and is quiet. He closes
         the case's lid himself and pushes it across. After the rite, at the door: "If I ever buy another..." "Ask it those
         two questions first."; when he has gone his teacher's word; his own thought */
      B: { shots: (me, COL, PHO, E) => [
             { t: 0, name: 'row1', eye: [me[0] - 0.05, me[1] - 0.03, me[2]], at: [-0.42, 0.36, 239.7], fp: 40, fd: 34 },
             { t: E.co5B2 + 0.2, name: 'row2', eye: [me[0] - 0.05, me[1] - 0.03, me[2]], at: [-0.06, 0.36, 239.78], fp: 40, fd: 34 },   // (the pieces east of the case: PIECES5)
             { t: E.co5B3 + 0.2, name: 'row3', eye: [me[0] - 0.05, me[1] - 0.03, me[2]], at: [0.12, 0.36, 239.94], fp: 40, fd: 34 },
             { t: E.co5B4 + 0.3, name: 'col', eye: me, at: COL, fp: 44, fd: 38 },
             { t: E.lid - 0.2, name: 'col', eye: me, at: COL, fp: 42, fd: 36 },
             { t: E.lid + 0.4, name: 'lid', eye: [me[0] - 0.08, me[1] - 0.04, me[2]], at: [-0.2, 0.42, 240.02], fp: 46, fd: 40 },
             { t: E.rite - 0.05, name: 'lid', eye: [me[0] - 0.08, me[1] - 0.04, me[2]], at: [-0.02, 0.42, 240.16], fp: 46, fd: 40 } ],
           after: (me, COL, PHO, E) => [
             { t: E.door, name: 'door', eye: me, at: () => fmHead(cast.col, DOOR5), fp: 50, fd: 44, cut: true },
             /* (to his teacher on the cut BEFORE the collector goes, so he goes out of shot: on the door until his teacher's
                word, he vanished from the doorway in the shot at 40.0 s, e4c5filmread POP on deploy 12) */
             { t: E.gone - 0.15, name: 'door', eye: me, at: () => fmHead(cast.col, DOOR5), fp: 50, fd: 44 },
             { t: E.gone - 0.1, name: 'pho', eye: me, at: PHO, fp: 46, fd: 40, cut: true },
             /* (held on him to his line's last word: eased to the table from his first, the look left him all through it) */
             { t: E.ph5B1 + SECS.ph5B1 - 0.1, name: 'pho', eye: me, at: PHO, fp: 44, fd: 38 },
             { t: E.q5B2 + 0.6, name: 'table', eye: me, at: [0, 0.4, 240.0], fp: 52, fd: 46 } ],
           things: (t, E) => casePush5(t, E.lid + 0.8, E.lid + 2.0, [0.14, 240.3]),
           colLooks: (E) => [[0, [-0.2, 0.36, 239.8]], [E.co5B4, [0.2, 0.36, 239.85]], [E.lid, 'lens']] },
      /* C · "These three are the worst. The rest feel quiet." (bad): delighted, "Three! Only three."; he pushes the three
         across with one finger and fits the seventeen back into their foam; the film opens his sight on the case: on a
         piece already packed something small that his nose never caught lifts its head; his teacher's hand flat on the lid:
         "This one. What is it?" "I... do not know." "Nor does he. Your nose is not a certificate." All twenty go across;
         the rite; his own thought */
      C: { shots: (me, COL, PHO, E) => [
             /* (each speaker HELD to his line's last word, the look carried to the next in the gap between: keyed only at
                each line's first word, the lens eased from one man to the other all through every line, R25 framing) */
             { t: 0, name: 'col', eye: me, at: COL, fp: 44, fd: 38 },
             { t: E.co5C1 + SECS.co5C1 - 0.1, name: 'col', eye: me, at: COL, fp: 44, fd: 38 },
             { t: E.three + 0.5, name: 'three', eye: [me[0], me[1] - 0.04, me[2]], at: [0.1, 0.37, 239.95], fp: 42, fd: 36 },
             { t: E.pack, name: 'pack', eye: [me[0] - 0.12, me[1] - 0.04, me[2]], at: [-0.34, 0.4, 239.95], fp: 40, fd: 34, cut: true },
             { t: E.see + 1.2, name: 'small', eye: [me[0] - 0.12, me[1] - 0.04, me[2]], at: [-0.33, 0.45, 239.93], fp: 32, fd: 28 },
             { t: E.ph5C1, name: 'pho', eye: me, at: PHO, fp: 46, fd: 40 },
             { t: E.ph5C1 + SECS.ph5C1 - 0.1, name: 'pho', eye: me, at: PHO, fp: 45, fd: 39 },
             { t: E.co5C2 + 0.3, name: 'col', eye: me, at: COL, fp: 44, fd: 38 },
             { t: E.co5C2 + SECS.co5C2 - 0.1, name: 'col', eye: me, at: COL, fp: 43, fd: 37 },
             { t: E.ph5C2 + 0.3, name: 'pho', eye: me, at: PHO, fp: 44, fd: 38 },
             { t: E.ph5C2 + SECS.ph5C2 - 0.1, name: 'pho', eye: me, at: PHO, fp: 43, fd: 37 },
             { t: E.across, name: 'across', eye: [me[0], me[1] - 0.04, me[2]], at: [0.0, 0.38, 240.05], fp: 46, fd: 40 },
             { t: E.rite - 0.05, name: 'across', eye: [me[0], me[1] - 0.04, me[2]], at: [0.0, 0.38, 240.1], fp: 46, fd: 40 } ],
           after: (me, COL, PHO, E) => [
             { t: E.q5C1 + 0.3, name: 'table', eye: me, at: [0, 0.4, 240.0], fp: 52, fd: 46 } ],
           things: (t, E) => { threeAt5(t < E.across ? smo(c01((t - E.three) / 1.4)) : 1);
             const packed = t >= E.pack && t < E.across; for (const p of PIECES5.list) p.g.visible = p.g.visible && !packed;
             SMALL5.set(t >= E.see && t < E.across ? smo(c01((t - E.see - 0.6) / 1.2)) : 0, t); },
           vis: (E) => [E.see, E.ph5C1 + 0.2] },
      /* D · "Keep the holy ones. The Yin ones are the trouble." (worst): his face clears, he knows a man, twenty by
         Friday, already counting on his fingers; his teacher does not laugh, quite: to him, then to the student; the
         collector's hand comes down from his counting; the rite; his own thought */
      D: { shots: (me, COL, PHO, E) => [
             /* (each speaker held to his line's last word: keyed only at their first, the lens eased off the collector
                through his seven seconds and off his teacher through his six, R25 framing) */
             { t: 0, name: 'col', eye: me, at: COL, fp: 44, fd: 38 },
             { t: E.co5D1 + SECS.co5D1 - 0.1, name: 'col', eye: me, at: COL, fp: 43, fd: 37 },
             { t: E.ph5D1 + 0.3, name: 'pho', eye: me, at: PHO, fp: 46, fd: 40 },
             { t: E.ph5D2 + 0.3, name: 'pho', eye: me, at: PHO, fp: 44, fd: 38 },
             { t: E.ph5D2 + SECS.ph5D2 - 0.1, name: 'pho', eye: me, at: PHO, fp: 43, fd: 37 },
             { t: E.down, name: 'col', eye: me, at: COL, fp: 44, fd: 38 },
             { t: E.rite - 0.05, name: 'col', eye: me, at: COL, fp: 44, fd: 38 } ],
           after: (me, COL, PHO, E) => [
             { t: E.q5D1 + 0.3, name: 'table', eye: me, at: [0, 0.4, 240.0], fp: 52, fd: 46 } ] }
    };

    /* what a scene reaches of the films (stage.films): each film's three hands */
    const FILMS5API = {
      open: FILMS5.open, devotee: FILMS5.devotee, prepare: FILMS5.prepare, together: FILMS5.together,
      bagtied: FILMS5.bagtied, collector: FILMS5.collector,
      ending: { begin: (k, api, s) => FILMS5.ending.begin(k, api, s), frame: (k, t, api) => FILMS5.ending.frame(k, t, api), end: () => FILMS5.ending.end() },
      /* the cast's handles the fight and the play read (the court's frame, the boom, the cage, the trance, the Naga) */
      fightStart, boomAt, COURT5, courtWorld, CAGE5, TRANCE5, NAGA5, PRAI5, STICK5,
      /* (a probe's read of every body the chapter made: tools/probes/e4c5films.mjs, R25) */
      people: () => people, crowd: () => crowd, shot: () => FM5.shot
    };
