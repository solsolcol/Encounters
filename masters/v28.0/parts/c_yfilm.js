
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
    function fmLook(name, secs = 0) { phoLevel(name); if (FM5.lit !== name) { FM5.lit = name; if (kit && kit.daylight) kit.daylight(PRESETS[name] || DUSK, secs); estateLook5(name); } }   // (R105: the estate's ground with the hour)
    /* (R33, lens 4's L4-01: his look D draws his face, hands and beads unlit at the level the chapter sets for its light;
       this chapter never set it, so at dusk, at night and in the trance they shone at the day's brightness, and its lift
       drew his robe toward its unlit white in the dark. Chapter 4's measure for its dark, 0.55; the dusk and the evening
       between. Set wherever the light is: a film's fmLook and the play's lookAt0, wrapped here) */
    const PHO_LEVEL = { DAY: 1, DUSK: 0.8, EVENING: 0.7, NIGHT: 0.55, TRANCE: 0.55 };
    function phoLevel(name) { if (typeof phoLook === 'object' && phoLook && phoLook.level) phoLook.level.value = PHO_LEVEL[name] != null ? PHO_LEVEL[name] : 1; }
    { const look0 = lookAt0; lookAt0 = function (name, secs) { phoLevel(name); return look0(name, secs); }; phoLevel(lookName); }
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
    /* (R76, limbread on build 44: in the car Ton's talking left hand went 14.7 cm into his teacher's body and Jun's right hand
       6 cm into his teacher's forearm: the two a step further back and out, Ton's line said with his hands down) */
    const CAR5 = { eye: [0.05, EYE, 2.55], pho: [0.04, 1.62], ton: [-0.54, 1.97], jun: [0.54, 1.99] };

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

    /* ---------------------------------------------------------------- THE NAGA OF THE FIGHT'S FILM (R47 and R51, 23 Nov
       2026; the plan's 5.5 stage 5, 9.3, 11). Chad, R47: "change the naga to a blue one, and it needs to look more natural
       as it flies around and wraps the prai, the curent animation is very wooden and feels underwhelming ... The naga should
       pierce through all the prai's bodies with a water sound as it pierces through each. As it pierces through each prai,
       the fire of each prai is extinguished and it cools them down"; R51: "use the naga head, and then the rest of the body
       you generate so that you can have full control over how it moves and bends and the angles". Not Mucalinda's seven
       coils and spread hood (the canon gives those to the Buddha alone: §0.3, 12): one head, one long body.
       THE HEAD is the model's own (people/naga.sh: its crest, its open jaws, its beard), carried whole and rigid; only its
       neck, which in the file rises straight up from a body lying on the ground, is bent back once as it loads, round a
       quarter circle under the jaw, so it leaves the head along the line of flight (the head stays upright, the face
       forward, the crest up). THE BODY is made here: a tube 22 m long, round with a keel along its back and its belly a
       little flat, thickest a quarter of the way down and tapering to a point, laid every frame along the path its head
       has flown (each ring where the head was that many metres before: a serpent's own way of moving, so every bend the head
       makes runs back down its length), banked into its turns, a travelling wave down it while it flies, still when it
       lies. BLUE: a body of water and light (deep blue, azure scales, a pale belly, water running bright along it, its edge
       burning cyan; gold only where Grandmaster Pho's light falls on it, the gold being his alone). Drawn in three passes
       of each skin, as the ruby one was (its nearest surface for depth only; the body; its glow, the back faces of a skin a
       hand's breadth out, added): no inner face ever shows through, and a light it adds none (v9.4). Its path, its timing
       and what it does are the film's (FILMS5.together: plan(), then fly() each frame); a pure function of the film's
       clock, so a seek, a skip and a slow phone land on the same picture */
    const NAGA5 = (() => {
      const g = new THREE.Group(); g.visible = false; world.add(g);
      /* (R47, the lab's first pictures, 23 Nov: at 0.85 its crest stood 1.96 m over its neck's line, a head taller than a
         Prai swallowed each one whole and the pierce read as a blue wall across the frame; at 0.68 its head is a Prai's
         chest from jaw to brow, its crest 1.57 m, and it goes THROUGH. Its body thinned with it, its front the neck's size) */
      const HS = 0.68;                                     // the head's scale
      const BODY = { L: 22.0, NR: 220, NS: 22, d0: -0.12, rStub: 0.22, rMax: 0.236, rBody: 0.155, neckL: 1.4, rTip: 0.012, ax: 1.0, ay: 0.86, keel: 0.15 };
      /* (the model, measured from the file (tools: dbgnagahead; its slices by height, R52): its body 0.56 m wide and 0.7 tall
         lies along +z; from its collar its neck rises, a round post 0.64 m across round z 2.87 from y 1.2 to 1.45, and
         leans forward into the head; the snout at (0, 2.28, 4.21), the crest's tip at (0, 3.6, 4.0), the beard hanging to
         y 1.0 at z 3.55 .. 3.85. THE HEAD ALONE is taken (R52, Chad: "you could have cut the naga head higher, you included
         too much of its neck and when you could have really just kept only strictly the head"; R47 had kept the whole neck
         from y 0.95 and bent it back), cut WHERE HE DREW IT (R57, "You should cut the naga head like at the red line", on
         the side view of this file): a slanting plane from the back of the neck just under the back of the head (z 2.605,
         y 1.95) down and forward to the throat under the jaw (z 3.52, y 1.14), across the upper neck where it leans into the
         head; the head, its crest and the beard under its jaw above it, the neck, the collar and the body left with the file.
         The made body rises into that slanting cut itself: its first rings round an arc of 0.6 m from their foot on the path
         (J0) up 48.6 degrees to the cut's middle (z 2.95, y 1.645; 0.66 m across each way), meeting it square, so the head
         rides over its body's line and the body does all the bending) */
      const NK = { CZ: 2.605, CY: 1.95, NZ: 0.661, NY: 0.750, DZ: 2.95, DY: 1.645, R: 0.6, ZJAW: 3.45, HX: 0.33, HN: 0.33 };
      const PHI = Math.atan2(NK.NY, NK.NZ);                                                             // the neck's way at the cut, up from the line of flight
      const cutSide = (y, z) => (z - NK.CZ) * NK.NZ + (y - NK.CY) * NK.NY;                              // over 0: the head's side of his line
      const J0 = [0, NK.DY - NK.R * (1 - Math.cos(PHI)), NK.DZ - NK.R * Math.sin(PHI)];                // the arc's foot, on the path: the head's own origin
      const ARC = PHI * NK.R * HS;                                                                      // the arc's length at full size
      BODY.d0 = -(ARC + 0.07);                                                                          // the body's first rings: up the curve and 7 cm into the head
      const FACE = [0, 2.45 - J0[1], 3.9 - J0[2]], SNOUT = [0, 2.28 - J0[1], 4.21 - J0[2]];             // from the foot, in the model's metres
      /* (R70: its eyes, read from the file: each side's eye is its paint's dark red at (0.352, 2.262, 3.507) and the mirror, its
         ball standing out to x 0.36 (masters/v28.0 nagaeye: its points drawn from the side by their colours). From the foot) */
      const EYE = [[0.352, 2.262 - J0[1], 3.507 - J0[2]], [-0.352, 2.262 - J0[1], 3.507 - J0[2]]];
      const U = { uNA: { value: 0 }, uNT: { value: 0 }, uNGW: { value: 0.115 },
                  uNPho: { value: new THREE.Vector4(0, 0, 0, 0) },
                  uNDeep: { value: new THREE.Color(0x03163a) }, uNCol: { value: new THREE.Color(0x0d63d8) }, uNRim: { value: new THREE.Color(0x86ecff) },
                  uNBelly: { value: new THREE.Color(0xa8dcff) }, uNGlowC: { value: new THREE.Color(0x2aa6ff) }, uNGold: { value: new THREE.Color(0xffc860) },
                  uNLook: { value: new THREE.Vector4(1.0, 2.4, 0.62, 0.30) } };   // (core alpha, rim power, glow strength, scale strength)
      const st = { ready: false, head: null, tube: null, tgeo: null, plan: null, uH: 0, grow: 0, laid: '', fw: null, sw: null, emb: null, eyes: null, eyeN: null, hs: 1, eyeG: null };
      const SH5 = {};
      SH5.vsHead = `attribute float aS; attribute float aReg; attribute vec2 aCS; attribute float aW; attribute float aF;
uniform float uNGW;
varying vec3 vNWp; varying vec3 vNWn; varying float vNS; varying vec2 vNCS; varying float vNReg; varying float vNF;
`;
      SH5.vsBody = `#include <begin_vertex>
  #ifdef NAGA_GLOW
    transformed += normal * (uNGW * aW);
  #endif
  vNWp = (modelMatrix * vec4(transformed, 1.0)).xyz;
  vNWn = normalize(mat3(modelMatrix) * normal);
  vNS = aS; vNCS = aCS; vNReg = aReg; vNF = aF;
`;
      SH5.fsHead = `uniform float uNA, uNT; uniform vec4 uNPho, uNLook; uniform vec3 uNDeep, uNCol, uNRim, uNBelly, uNGlowC, uNGold;
varying vec3 vNWp; varying vec3 vNWn; varying float vNS; varying vec2 vNCS; varying float vNReg; varying float vNF;
`;
      /* (where the head's neck and beard fade out at their cut (aF under a half), they leave no depth: the body inside shows) */
      SH5.depth = `if (vNF < 0.5) discard;
  gl_FragColor = vec4(0.0);`;
      SH5.body = `vec3 nN = normalize(vNWn), nV = normalize(cameraPosition - vNWp);
  float nFr = pow(1.0 - clamp(abs(dot(nN, nV)), 0.0, 1.0), uNLook.y);
  float nTube = step(0.5, vNReg) * (1.0 - step(1.5, vNReg));
  /* its scales: fourteen round the body, 0.15 m long, rows offset by half, each over the one behind it; on the made body
     only (the head has the model's own carved scales), and faded where they would be finer than the screen can hold */
  vec2 nP = vec2(atan(vNCS.y, vNCS.x) * (14.0 / 6.2831853), vNS / 0.15);
  float nJ = floor(nP.y) + 1.0, nO = 0.5 * mod(nJ, 2.0);
  float nD = length(nP - vec2(floor(nP.x - nO) + 0.5 + nO, nJ)) / 0.72;
  if (nD >= 1.0) { nJ -= 1.0; nO = 0.5 * mod(nJ, 2.0); nD = length(nP - vec2(floor(nP.x - nO) + 0.5 + nO, nJ)) / 0.72; }
  float nFw = (fwidth(vNCS.x) + fwidth(vNCS.y)) * (14.0 / 6.2831853) + fwidth(nP.y);
  float nAa = clamp(1.6 - 2.2 * nFw, 0.0, 1.0) * nTube;
  /* (R58, Chad: "Colour the body of the naga in the same colour as the head please". The made body is painted by the
     head's own rule, one colour for the whole creature: the head's blue (its deep and its azure at 0.86), its underside
     paler where the faces turn down, and its glaze of water over all of it. The scales stay, as LIGHT on that colour and
     not as a second, darker blue: each a little darker at its heart, brighter to its rim and a fine dark line at its edge,
     about the head's own colour on the whole, as the head's carved scales read by their light. Measured before (the lab's
     pictures of build 39's colours): the head hue 207, saturation 0.63, value 0.77; the body 214, 0.72 and 0.49) */
  float nRel = mix(0.9, 1.2, smoothstep(0.62, 0.97, nD)) * (1.0 - 0.3 * smoothstep(0.97, 1.0, nD));
  /* ITS FORM: a key light from over the lens, so the round body and the head's carving read as one solid thing */
  float nLam = max(dot(nN, normalize(nV + vec3(0.0, 1.3, 0.0))), 0.0);
  vec3 nCol = mix(uNDeep, uNCol, 0.86) * (0.3 + 0.95 * nLam) * mix(1.0, nRel, nAa * uNLook.w / 0.3);
  /* its underside paler, the faces turned down (the lab's first pictures drew the head a deeper, flatter blue than the body
     it led; the same rule on the body since R58) */
  nCol = mix(nCol, uNBelly * (0.28 + 0.7 * nLam), smoothstep(-0.2, -0.8, nN.y) * 0.4);
  /* and a glaze of its water over all of it (the lab's second pictures drew the carved head a heavier blue than the body:
     the head's glaze, over the body too since R58) */
  nCol = mix(nCol, uNRim * (0.45 + 0.55 * nLam), 0.2);
  /* WATER RUNNING IN IT: two crossing ripples carried down its length, bright where they meet */
  float nW1 = sin(vNS * 2.3 - uNT * 4.4 + vNCS.x * 2.5), nW2 = sin(vNS * 3.9 - uNT * 6.3 - vNCS.y * 3.1);
  float nWat = pow(clamp(0.5 + 0.5 * nW1 * nW2, 0.0, 1.0), 6.0) * (0.55 + 0.45 * nTube);
  nCol += uNRim * nWat * 0.42 * (0.35 + 0.65 * nLam);
  nCol = mix(nCol, uNRim, nFr * 0.8);
  /* a slow breath of light down its length */
  nCol *= 0.86 + 0.28 * (0.5 + 0.5 * sin(vNS * 0.6 + uNT * 1.7));
  /* his light: gold on the faces turned to his shoulders, near him, and nowhere else (the gold is his alone) */
  vec3 nL = uNPho.xyz - vNWp; float nDl = length(nL);
  float nGk = uNPho.w * max(dot(nN, nL / max(nDl, 1e-3)), 0.0) * (1.0 - smoothstep(0.5, 2.0, nDl));
  nCol = mix(nCol, uNGold * (0.85 + 0.3 * nFr), clamp(nGk, 0.0, 0.3));
  nCol *= 0.4 + 0.6 * clamp(uNA, 0.0, 1.0);
  gl_FragColor = vec4(nCol, uNLook.x * clamp(uNA * 4.0, 0.0, 1.0) * vNF);`;
      SH5.glow = `vec3 nN = normalize(vNWn), nV = normalize(cameraPosition - vNWp);
  float nK = clamp(-dot(nN, nV), 0.0, 1.0);
  vec3 nL = uNPho.xyz - vNWp; float nGk = uNPho.w * (1.0 - smoothstep(0.6, 2.6, length(nL)));
  gl_FragColor = vec4(mix(uNGlowC, uNGold, clamp(0.25 * nGk, 0.0, 0.25)), pow(nK, 2.0) * uNLook.z * uNA * smoothstep(0.45, 0.6, uNA) * vNF);`;
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
        m.customProgramCacheKey = () => 'e4c5naga4-' + kind + (SH5.v || '');
        return m;
      }
      /* the three passes of a skin, in their order (bright: after the court's own transparent things and its painted ground,
         before the cage and the fight's effects) */
      function threeOf(geo, into) {
        const out = [];
        for (const [kind, lo] of [['depth', 2.5], ['body', 2.6], ['glow', 2.7]]) {
          const me = new THREE.Mesh(geo, st.mats[kind]); me.frustumCulled = false;
          Object.defineProperty(me, 'renderOrder', { get: () => lo, set: () => {}, configurable: true }); into.add(me); out.push(me); }
        return out;
      }
      /* ---- THE HEAD, out of the file once it lands */
      function headOf(src) {
        src.updateMatrixWorld(true);
        let geo = null;
        src.traverse(o => { if (o.isMesh && !geo) { geo = o.geometry.clone();
          for (const nm of ['position', 'normal']) { const p = geo.attributes[nm]; if (!p || (!p.normalized && p.array instanceof Float32Array)) continue;
            const a = new Float32Array(p.count * 3); for (let i = 0; i < p.count; i++) { a[i * 3] = p.getX(i); a[i * 3 + 1] = p.getY(i); a[i * 3 + 2] = p.getZ(i); }
            geo.setAttribute(nm, new THREE.BufferAttribute(a, 3)); }
          geo.applyMatrix4(o.matrixWorld); } });
        if (!geo || !geo.index) return null;
        const P = geo.attributes.position.array, X = geo.index.array, n = P.length / 3;
        /* which points are the head's: above his red line (R57), its crest, the beard under the jaw */
        const keep = new Int32Array(n).fill(-1); let m = 0;
        const isHead = (x, y, z) => z > 2.3 && (cutSide(y, z) >= 0 || (z >= NK.ZJAW && y >= 0.9));
        for (let i = 0; i < n; i++) if (isHead(P[i * 3], P[i * 3 + 1], P[i * 3 + 2])) keep[i] = m++;
        const tri = []; for (let t = 0; t < X.length; t += 3) { const a = keep[X[t]], b = keep[X[t + 1]], c = keep[X[t + 2]]; if (a >= 0 && b >= 0 && c >= 0) tri.push(a, b, c); }
        const Q = new Float32Array(m * 3), Y0 = new Float32Array(m), Z0 = new Float32Array(m);
        for (let i = 0; i < n; i++) { const k = keep[i]; if (k < 0) continue; let x = P[i * 3], y = P[i * 3 + 1], z = P[i * 3 + 2]; Y0[k] = y; Z0[k] = z;
          Q[k * 3] = (x - J0[0]) * HS; Q[k * 3 + 1] = (y - J0[1]) * HS; Q[k * 3 + 2] = (z - J0[2]) * HS; }
        /* THE CUT'S EDGE faded out over its last 6 cm, and the beard's lower edge over 12 (aF): the body's own rings, risen into
           the head's underside, show through, so no torn edge is ever drawn (a cut through a mesh follows its triangles) */
        const F = new Float32Array(m).fill(1);
        for (let k = 0; k < m; k++) F[k] = Z0[k] >= NK.ZJAW ? smo(c01((Y0[k] - 0.9) / 0.12)) : smo(c01((cutSide(Y0[k], Z0[k]) - 0.003) / 0.06));
        /* its own smooth normals, each place's from the faces round it (the file's seams carry different normals at one place:
           read on them, a rim light draws every seam as a line) */
        const rep = new Int32Array(m), idx = new Map(), q = 1e4;
        for (let i = 0; i < m; i++) { const k = Math.round(Q[i * 3] * q) + ',' + Math.round(Q[i * 3 + 1] * q) + ',' + Math.round(Q[i * 3 + 2] * q);
          const r0 = idx.get(k); if (r0 === undefined) { idx.set(k, i); rep[i] = i; } else rep[i] = r0; }
        const acc = new Float64Array(m * 3), own = new Float64Array(m * 3), mag = new Float64Array(m);
        for (let t = 0; t < tri.length; t += 3) { const a = tri[t], b = tri[t + 1], c = tri[t + 2];
          const ux = Q[b * 3] - Q[a * 3], uy = Q[b * 3 + 1] - Q[a * 3 + 1], uz = Q[b * 3 + 2] - Q[a * 3 + 2], vx = Q[c * 3] - Q[a * 3], vy = Q[c * 3 + 1] - Q[a * 3 + 1], vz = Q[c * 3 + 2] - Q[a * 3 + 2];
          const fx = uy * vz - uz * vy, fy = uz * vx - ux * vz, fz = ux * vy - uy * vx, fl = Math.hypot(fx, fy, fz);
          for (const v of [a, b, c]) { const r0 = rep[v]; acc[r0 * 3] += fx; acc[r0 * 3 + 1] += fy; acc[r0 * 3 + 2] += fz; mag[r0] += fl; own[v * 3] += fx; own[v * 3 + 1] += fy; own[v * 3 + 2] += fz; } }
        const N = new Float32Array(m * 3);
        for (let i = 0; i < m; i++) { const r0 = rep[i]; let x = acc[r0 * 3], y = acc[r0 * 3 + 1], z = acc[r0 * 3 + 2], l = Math.hypot(x, y, z);
          if (!(l > 0.3 * mag[r0])) { x = own[i * 3]; y = own[i * 3 + 1]; z = own[i * 3 + 2]; l = Math.hypot(x, y, z); }
          if (!(l > 1e-12)) { x = 0; y = 1; z = 0; l = 1; } N[i * 3] = x / l; N[i * 3 + 1] = y / l; N[i * 3 + 2] = z / l; }
        const hg = new THREE.BufferGeometry(); owned.push(hg); geo.dispose();
        hg.setAttribute('position', new THREE.BufferAttribute(Q, 3)); hg.setAttribute('normal', new THREE.BufferAttribute(N, 3));
        hg.setIndex(new THREE.BufferAttribute(m > 65535 ? new Uint32Array(tri) : new Uint16Array(tri), 1));
        const aS = new Float32Array(m), aReg = new Float32Array(m).fill(2), aCS = new Float32Array(m * 2), aW = new Float32Array(m).fill(0.35);
        for (let i = 0; i < m; i++) { aS[i] = -Q[i * 3 + 2]; aCS[i * 2 + 1] = 1; }
        hg.setAttribute('aS', new THREE.BufferAttribute(aS, 1)); hg.setAttribute('aReg', new THREE.BufferAttribute(aReg, 1));
        hg.setAttribute('aCS', new THREE.BufferAttribute(aCS, 2)); hg.setAttribute('aW', new THREE.BufferAttribute(aW, 1)); hg.setAttribute('aF', new THREE.BufferAttribute(F, 1));
        hg.computeBoundingSphere();
        return hg;
      }
      /* ---- THE BODY: its rings' cross-section (made once: a round body, its keel along the back, its belly a little flat) */
      const OX = new Float32Array(BODY.NS), OY = new Float32Array(BODY.NS), NX = new Float32Array(BODY.NS), NY = new Float32Array(BODY.NS);
      { const sec = (a) => { const c = Math.cos(a), s = Math.sin(a); return [BODY.ax * c, BODY.ay * s * (s < 0 ? 0.92 : 1) + BODY.keel * Math.pow(Math.max(0, s), 14)]; };
        for (let j = 0; j < BODY.NS; j++) { const a = j / BODY.NS * Math.PI * 2, p = sec(a), p1 = sec(a + 1e-3), p0 = sec(a - 1e-3);
          OX[j] = p[0]; OY[j] = p[1]; let nx = p1[1] - p0[1], ny = -(p1[0] - p0[0]); const l = Math.hypot(nx, ny) || 1; NX[j] = nx / l; NY[j] = ny / l; } }
      /* the body's girth along it: the neck's at the head, thickest a quarter of the way, to a point at the tail */
      const RAD = new Float32Array(BODY.NR), DS = new Float32Array(BODY.NR);
      for (let i = 0; i < BODY.NR; i++) { const d = BODY.d0 + i * (BODY.L - BODY.d0) / (BODY.NR - 1), f = d / BODY.L; DS[i] = d;
        /* (R69's "not like a real dragon", read in build 43's pictures: in the wide shots its body was a hose as thick as the
           head it carried. A serpent's neck narrows behind its head and its body is slimmer than its head: from the head's
           cut (the neck's own 0.22) it thins over 1.4 m to 0.155 and holds it, then tapers to the tail as before; the
           head is now half as wide again as the body behind it) */
        const up = d <= 0 ? BODY.rStub : BODY.rStub + (BODY.rBody - BODY.rStub) * smo(c01(d / BODY.neckL)), down = Math.pow(1 - smo(c01((f - 0.3) / 0.7)), 0.85);
        RAD[i] = Math.max(BODY.rTip, up * down); }
      function tubeOf() {
        const NR = BODY.NR, NS = BODY.NS, nv = NR * NS;
        const tg = new THREE.BufferGeometry(); owned.push(tg);
        const pos = new THREE.BufferAttribute(new Float32Array(nv * 3), 3).setUsage(THREE.DynamicDrawUsage);
        const nor = new THREE.BufferAttribute(new Float32Array(nv * 3), 3).setUsage(THREE.DynamicDrawUsage);
        const aW = new THREE.BufferAttribute(new Float32Array(nv), 1).setUsage(THREE.DynamicDrawUsage);
        const aS = new Float32Array(nv), aReg = new Float32Array(nv).fill(1), aCS = new Float32Array(nv * 2);
        for (let i = 0; i < NR; i++) for (let j = 0; j < NS; j++) { const v = i * NS + j, a = j / NS * Math.PI * 2; aS[v] = DS[i]; aCS[v * 2] = Math.cos(a); aCS[v * 2 + 1] = Math.sin(a); }
        const ind = [];
        for (let i = 0; i < NR - 1; i++) for (let j = 0; j < NS; j++) { const j1 = (j + 1) % NS, a = i * NS + j, b = i * NS + j1, c = (i + 1) * NS + j, d = (i + 1) * NS + j1;
          ind.push(a, c, b, b, c, d); }    // (outward: ring i+1 lies behind ring i, along -T)
        tg.setAttribute('position', pos); tg.setAttribute('normal', nor); tg.setAttribute('aW', aW);
        tg.setAttribute('aS', new THREE.BufferAttribute(aS, 1)); tg.setAttribute('aReg', new THREE.BufferAttribute(aReg, 1)); tg.setAttribute('aCS', new THREE.BufferAttribute(aCS, 2));
        tg.setAttribute('aF', new THREE.BufferAttribute(new Float32Array(nv).fill(1), 1));
        tg.setIndex(ind);
        return tg;
      }
      function make() {
        if (st.ready || st.making || !have('p5naga')) return; st.making = true;
        parseOnce('p5naga').then(({ scene: src }) => {
          if (!alive) return;
          const hg = headOf(src); if (!hg) return;
          st.mats = { depth: nagaMat('depth'), body: nagaMat('body'), glow: nagaMat('glow') };
          const hgrp = new THREE.Group(); hgrp.matrixAutoUpdate = false; g.add(hgrp); threeOf(hg, hgrp);
          st.head = hgrp; st.hgeo = hg;
          st.tgeo = tubeOf(); st.tube = threeOf(st.tgeo, g);
          /* ITS MIST: forty drops of its water shed off its length, each falling and fading (a fixed set: the same on every
             phone), their fall the shader's, on its clock (uNT) */
          { const NE = 48, r = rng(28701), ev = new Int32Array(NE), ph = new Float32Array(NE), sp = new Float32Array(NE);
            for (let i = 0; i < NE; i++) { ev[i] = Math.min(BODY.NR * BODY.NS - 1, Math.floor((6 + r() * (BODY.NR * 0.8)) | 0) * BODY.NS + ((r() * BODY.NS) | 0)); ph[i] = r(); sp[i] = 1 / (1.1 + r() * 0.9); }
            const eg = new THREE.BufferGeometry(); eg.setAttribute('position', new THREE.BufferAttribute(new Float32Array(NE * 3), 3).setUsage(THREE.DynamicDrawUsage));
            eg.setAttribute('aPh', new THREE.BufferAttribute(ph, 1)); eg.setAttribute('aSpd', new THREE.BufferAttribute(sp, 1)); owned.push(eg);
            const soft = (() => { const [c, x] = canvas(64, 64); const gd = x.createRadialGradient(32, 32, 1, 32, 32, 31);
              gd.addColorStop(0, 'rgba(255,255,255,1)'); gd.addColorStop(0.35, 'rgba(255,255,255,0.55)'); gd.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = gd; x.fillRect(0, 0, 64, 64); return tex(done(THREE, c, false)); })();
            const em = new THREE.PointsMaterial({ map: soft, color: 0x9fe8ff, size: 0.08, sizeAttenuation: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false, toneMapped: false }); mats.push(em);
            em.onBeforeCompile = (sh) => { Object.assign(sh.uniforms, U);
              sh.vertexShader = 'attribute float aPh; attribute float aSpd; uniform float uNT; varying float vEA;\n' + sh.vertexShader.replace('#include <begin_vertex>', `#include <begin_vertex>
                float eC = fract(uNT * aSpd + aPh);
                transformed += vec3(sin(aPh * 6.2832 + uNT * 1.3) * (0.06 + 0.12 * aPh), -0.9 * eC * eC, cos(aPh * 4.1 + uNT * 1.1) * (0.06 + 0.12 * fract(aPh * 3.7))) * eC;
                vEA = (1.0 - eC) * smoothstep(0.0, 0.1, eC);`);
              const out = sh.fragmentShader.replace('vec4 diffuseColor = vec4( diffuse, opacity );', 'vec4 diffuseColor = vec4( diffuse, opacity * vEA * smoothstep(0.4, 0.85, uNA) );');
              if (out === sh.fragmentShader) console.warn('e4c5: the Naga\'s mist found no colour line to write (three changed?)');
              sh.fragmentShader = 'uniform float uNA; varying float vEA;\n' + out; };
            em.customProgramCacheKey = () => 'e4c5nagaMist';
            const pts = new THREE.Points(eg, em); pts.frustumCulled = false; Object.defineProperty(pts, 'renderOrder', { get: () => 2.8, set: () => {}, configurable: true }); g.add(pts); st.emb = { ev, eg, pts }; }
          /* R70: ITS EYES' LIGHT. On each eye a white core and a blue halo, and behind each a trail of eight where the eye was a
             moment before, seen only at speed (light streaming off it as it climbs); painted light, added, drawn over its head
             (a card of light among a body is drawn over what stands at its depth: v25.5) and faded out where the eye turns
             away from the lens. The film says how bright (eyeFrame) */
          { const NE = 20, eg = new THREE.BufferGeometry(), at = (a, k) => new THREE.BufferAttribute(a, k).setUsage(THREE.DynamicDrawUsage);
            eg.setAttribute('position', at(new Float32Array(NE * 3), 3)); eg.setAttribute('aC', at(new Float32Array(NE * 3), 3));
            eg.setAttribute('aS', at(new Float32Array(NE), 1)); eg.setAttribute('aA', at(new Float32Array(NE), 1)); owned.push(eg);
            const m = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending, fog: false, toneMapped: false, uniforms: { uScale: { value: 500 } },
              vertexShader: 'attribute vec3 aC; attribute float aS; attribute float aA; varying vec3 vC; varying float vA; uniform float uScale; void main(){ vC = aC; vA = aA; vec4 mv = modelViewMatrix * vec4(position, 1.0); gl_PointSize = aS * uScale / max(0.05, -mv.z); gl_Position = projectionMatrix * mv; }',
              fragmentShader: 'varying vec3 vC; varying float vA; void main(){ float d = length(gl_PointCoord - 0.5) * 2.0; if (d > 1.0) discard; float f = pow(1.0 - d, 1.7); gl_FragColor = vec4(vC, vA * f); }' });
            mats.push(m);
            const pts = new THREE.Points(eg, m); pts.frustumCulled = false; pts.visible = false;
            Object.defineProperty(pts, 'renderOrder', { get: () => 2.95, set: () => {}, configurable: true }); world.add(pts); st.eyeG = { eg, m, pts, NE }; }
          st.ready = true;
          if (st.plan && st.want) layAt(st.want.t, st.want.a);
        }).catch(err => { console.warn('p5naga failed to load', err); if (ctx.loadFail) ctx.loadFail('p5naga', err); });
      }
      make();
      /* ---- ITS FLIGHT: a path through the film's points, a table of its places and frames along its length (every 4 cm:
         where it is, the way it goes, its up and its side), each frame's up kept to the sky's and banked into the turns
         (leaning toward the centre of each turn, as a flyer does, eased along its length), and the time it reaches each
         point. A pure function of the plan: made once a film run */
      const _v = new THREE.Vector3(), _t = new THREE.Vector3();
      function plan(spec) {
        const pts = spec.pts.map(p => new THREE.Vector3(p[0], p[1], p[2])), n = pts.length;
        const cv = new THREE.CatmullRomCurve3(pts, false, 'centripetal', 0.5);
        const DIV = (n - 1) * 60; cv.arcLengthDivisions = DIV;
        const lens = cv.getLengths(DIV), len = lens[lens.length - 1];
        const uAt = pts.map((p, i) => lens[i * 60]);
        const NT = Math.max(2, Math.ceil(len / 0.04) + 1), T = new Float32Array(NT * 12), ds = len / (NT - 1);
        /* (its up: the sky's, laid square to its way; where its way stands within 15 degrees of upright, the last up carried on;
           and if that too has nothing left, any square to it: never a frame of nothing) */
        let px = 0, py = 0, pz = 1;
        for (let j = 0; j < NT; j++) { const u = Math.min(1, j / (NT - 1)); cv.getPointAt(u, _v); cv.getTangentAt(u, _t);
          let nx = -_t.y * _t.x, ny = 1 - _t.y * _t.y, nz = -_t.y * _t.z, nl = Math.hypot(nx, ny, nz);
          if (nl < 0.25) { const k = px * _t.x + py * _t.y + pz * _t.z; nx = px - k * _t.x; ny = py - k * _t.y; nz = pz - k * _t.z; nl = Math.hypot(nx, ny, nz); }
          if (!(nl > 1e-4)) { nx = _t.z; ny = 0; nz = -_t.x; nl = Math.hypot(nx, ny, nz); if (!(nl > 1e-4)) { nx = 1; ny = 0; nz = 0; nl = 1; } }
          nx /= nl; ny /= nl; nz /= nl; px = nx; py = ny; pz = nz;
          T.set([_v.x, _v.y, _v.z, _t.x, _t.y, _t.z, nx, ny, nz, 0, 0, 0], j * 12); }
        /* the bank: the up leaned toward the centre of the turn by the turn's own curvature (0.9 m of lean for each 1/m),
           at most 40 degrees, eased over 1.2 m of its length; then its side, up x along */
        const lean = new Float32Array(NT * 3);
        for (let j = 0; j < NT; j++) { const a = Math.max(0, j - 2) * 12, b = Math.min(NT - 1, j + 2) * 12, h = (Math.min(NT - 1, j + 2) - Math.max(0, j - 2)) * ds || 1;
          let kx = (T[b + 3] - T[a + 3]) / h, ky = (T[b + 4] - T[a + 4]) / h, kz = (T[b + 5] - T[a + 5]) / h;
          const o = j * 12, k = kx * T[o + 3] + ky * T[o + 4] + kz * T[o + 5]; kx -= k * T[o + 3]; ky -= k * T[o + 4]; kz -= k * T[o + 5];
          const up = kx * T[o + 6] + ky * T[o + 7] + kz * T[o + 8]; kx -= up * T[o + 6]; ky -= up * T[o + 7]; kz -= up * T[o + 8];   // (only the turn across: a climb or a dive leans nothing)
          let s = 0.9, kl = Math.hypot(kx, ky, kz); if (kl * s > 0.84) s = 0.84 / kl;
          lean[j * 3] = kx * s; lean[j * 3 + 1] = ky * s; lean[j * 3 + 2] = kz * s; }
        const W = Math.max(1, Math.round(0.6 / ds));
        for (let j = 0; j < NT; j++) { let sx = 0, sy = 0, sz = 0, c = 0; for (let q = Math.max(0, j - W); q <= Math.min(NT - 1, j + W); q++) { sx += lean[q * 3]; sy += lean[q * 3 + 1]; sz += lean[q * 3 + 2]; c++; }
          const o = j * 12, tx = T[o + 3], ty = T[o + 4], tz = T[o + 5];
          let nx = T[o + 6] + sx / c, ny = T[o + 7] + sy / c, nz = T[o + 8] + sz / c; const k = nx * tx + ny * ty + nz * tz; nx -= k * tx; ny -= k * ty; nz -= k * tz;
          const nl = Math.hypot(nx, ny, nz) || 1; nx /= nl; ny /= nl; nz /= nl;
          T[o + 6] = nx; T[o + 7] = ny; T[o + 8] = nz; T[o + 9] = ny * tz - nz * ty; T[o + 10] = nz * tx - nx * tz; T[o + 11] = nx * ty - ny * tx; }
        /* its timing: the film's keys (a time for a point), between them a monotone cubic (Fritsch and Carlson), so it never
           stops or turns back between two keys and its speed changes smoothly through each */
        const K = spec.keys.map(([t, i]) => [t, typeof i === 'number' && i % 1 === 0 && i < n ? uAt[i] : +i]).sort((a, b) => a[0] - b[0]);
        const m = K.length, dd = [], mm = new Array(m).fill(0);
        for (let i = 0; i < m - 1; i++) dd.push((K[i + 1][1] - K[i][1]) / Math.max(1e-6, K[i + 1][0] - K[i][0]));
        for (let i = 1; i < m - 1; i++) mm[i] = dd[i - 1] * dd[i] <= 0 ? 0 : (dd[i - 1] + dd[i]) / 2;
        mm[0] = m > 1 ? dd[0] : 0; mm[m - 1] = m > 1 ? dd[m - 2] : 0;
        for (let i = 0; i < m - 1; i++) { if (Math.abs(dd[i]) < 1e-9) { mm[i] = mm[i + 1] = 0; continue; }
          const a = mm[i] / dd[i], b = mm[i + 1] / dd[i], s = a * a + b * b; if (s > 9) { const tau = 3 / Math.sqrt(s); mm[i] = tau * a * dd[i]; mm[i + 1] = tau * b * dd[i]; } }
        if (spec.restSecs > 0 && m > 0) mm[m - 1] = 0;
        /* (R64: where along it the stick's head is on its way home, metres; past it the creature is inside the stick) */
        const home = typeof spec.home === 'number' && spec.home % 1 === 0 && spec.home < n ? uAt[spec.home] : null;
        st.plan = { cv, len, T, NT, ds, uAt, K, mm, stick: spec.stick || [pts[0].x, pts[0].y, pts[0].z], spec, home };
        st.laid = '';
        return { len, uAt: uAt.slice() };
      }
      /* the leader's place along the path (metres) at film time t */
      function uOf(t) {
        const P = st.plan; if (!P) return 0; const K = P.K, mm = P.mm, m = K.length;
        if (!m) return 0; if (t <= K[0][0]) return K[0][1]; if (t >= K[m - 1][0]) return K[m - 1][1];
        let i = 0; while (i < m - 2 && t > K[i + 1][0]) i++;
        const h = K[i + 1][0] - K[i][0], s = (t - K[i][0]) / h, s2 = s * s, s3 = s2 * s;
        return (2 * s3 - 3 * s2 + 1) * K[i][1] + (s3 - 2 * s2 + s) * h * mm[i] + (-2 * s3 + 3 * s2) * K[i + 1][1] + (s3 - s2) * h * mm[i + 1];
      }
      const FR = new Float32Array(12), FRE = new Float32Array(12), _ev = new THREE.Vector3();
      function frameAt(u, out) {
        const P = st.plan, x = Math.max(0, Math.min(P.NT - 1, u / P.ds)), j = Math.min(P.NT - 2, Math.floor(x)), w = x - j, a = j * 12, b = a + 12;
        for (let q = 0; q < 12; q++) out[q] = P.T[a + q] + (P.T[b + q] - P.T[a + q]) * w;
        return out;
      }
      /* ---- LAID: the head where the leader is, every ring where the leader was its distance before */
      const HM = new THREE.Matrix4(), FRB = new Float32Array(12);
      function layAt(t, a) {
        if (!st.ready || !st.plan || !(a > 0.001)) return false;
        const uH = uOf(t), uP = uOf(t - 0.05), sp = Math.abs(uH - uP) / 0.05;
        const key = uH.toFixed(5) + '|' + (sp > 0.2 ? t.toFixed(3) : 'still');
        st.uH = uH; st.speed = sp;
        if (st.laid === key) return true; st.laid = key;
        const grow = smo(c01(uH / 1.4)); st.grow = grow;
        /* (R64: on its way home it goes INTO the stick's head: the head drawn smaller over its last 1.6 m and gone once in,
           each ring of its body the same as it reaches the stick, those past it inside) */
        const H = st.plan.home, sinkOf = (u) => (H == null ? 1 : smo(c01((H - u) / 1.6))), sink = sinkOf(uH);
        /* THE HEAD on the leader, its along the path's along, its up the path's banked up */
        const F = frameAt(uH, FR), s = Math.max(0.02, grow * sink); st.hs = s;
        st.head.visible = sink > 0.02;
        const bx = F[9], by = F[10], bz = F[11], nx = F[6], ny = F[7], nz = F[8], tx = F[3], ty = F[4], tz = F[5];
        HM.set(bx * s, nx * s, tx * s, F[0], by * s, ny * s, ty * s, F[1], bz * s, nz * s, tz * s, F[2], 0, 0, 0, 1);
        st.head.matrix.copy(HM); st.head.matrixWorldNeedsUpdate = true;
        const fw = (p) => [F[0] + (bx * p[0] + nx * p[1] + tx * p[2]) * HS * s, F[1] + (by * p[0] + ny * p[1] + ty * p[2]) * HS * s, F[2] + (bz * p[0] + nz * p[1] + tz * p[2]) * HS * s];
        st.fw = sink > 0.02 ? fw(FACE) : null; st.sw = sink > 0.02 ? fw(SNOUT) : null;
        st.eyes = sink > 0.02 ? EYE.map(fw) : null;
        st.eyeN = [1, -1].map(sg => { const x = bx * sg + tx * 0.35, y = by * sg + ty * 0.35, z = bz * sg + tz * 0.35, l = Math.hypot(x, y, z) || 1; return [x / l, y / l, z / l]; });
        /* THE BODY: each ring where the leader was; thin where it is still coming out of the stick; a wave travelling down it
           while it flies (none while it lies still), across and a little up and down */
        const NR = BODY.NR, NS = BODY.NS, pa = st.tgeo.attributes.position.array, na = st.tgeo.attributes.normal.array, wa = st.tgeo.attributes.aW.array;
        const mov = smo(c01((sp - 0.4) / 2.6)), stick = st.plan.stick, G = FRB;
        for (let i = 0; i < NR; i++) {
          const d = DS[i], u = uH - d;
          let r = RAD[i] * grow, rx = 0, ry = 0, cx, cy, cz, Tx, Ty, Tz, Nx, Ny, Nz, Bx, By, Bz;
          if (d < 0) {
            /* THE ARC UP INTO THE HEAD (R52, R57): rings before the leader ride with the head, round the arc from the foot
               (along the path, the body's own up) to the head's slanting cut (met square, its keel to the back of the neck,
               its throat to the front), then 7 cm on into the head; drawn from the body's size to the cut's own */
            const a2 = -d / s, Rm = NK.R * HS; let th, ly, lz;
            if (a2 <= ARC) { th = a2 / Rm; ly = Rm * (1 - Math.cos(th)); lz = Rm * Math.sin(th); }
            else { th = PHI; const e = a2 - ARC; ly = Rm * (1 - Math.cos(PHI)) + e * Math.sin(PHI); lz = Rm * Math.sin(PHI) + e * Math.cos(PHI); }
            const sn = Math.sin(th), cs = Math.cos(th), k = smo(c01(th / PHI));
            Tx = nx * sn + tx * cs; Ty = ny * sn + ty * cs; Tz = nz * sn + tz * cs;
            Nx = nx * cs - tx * sn; Ny = ny * cs - ty * sn; Nz = nz * cs - tz * sn; Bx = bx; By = by; Bz = bz;
            rx = lp(BODY.rStub, NK.HX * HS * 1.03, k) * grow * sink; ry = lp(BODY.rStub, NK.HN * HS * 1.03 / 0.9, k) * grow * sink; r = rx;
            const off = -0.11 * ry * k;                                   // (the cross-section's keel lifts its middle 0.11 of it: set back on the cut's middle)
            cx = F[0] + (nx * ly + tx * lz) * s + Nx * off; cy = F[1] + (ny * ly + ty * lz) * s + Ny * off; cz = F[2] + (nz * ly + tz * lz) * s + Nz * off; }
          else if (u <= 0) { r = 0; cx = stick[0]; cy = stick[1]; cz = stick[2]; Tx = 0; Ty = 1; Tz = 0; Nx = 0; Ny = 0; Nz = 1; Bx = 1; By = 0; Bz = 0; }
          else if (H != null && u >= H) { r = 0; frameAt(H, G); cx = G[0]; cy = G[1]; cz = G[2]; Tx = G[3]; Ty = G[4]; Tz = G[5]; Nx = G[6]; Ny = G[7]; Nz = G[8]; Bx = G[9]; By = G[10]; Bz = G[11]; }
          else { frameAt(u, G); r *= smo(c01(u / 0.9)) * sinkOf(u); cx = G[0]; cy = G[1]; cz = G[2]; Tx = G[3]; Ty = G[4]; Tz = G[5]; Nx = G[6]; Ny = G[7]; Nz = G[8]; Bx = G[9]; By = G[10]; Bz = G[11];
            const A = 0.14 * mov * smo(c01((d - 0.6) / 2.8)) * (1 - 0.45 * d / BODY.L) * smo(c01(u / 1.5)), wv = Math.sin(6.2832 * (d / 3.4) - 5.2 * t), wv2 = Math.sin(6.2832 * (d / 4.6) - 3.6 * t + 1.3);
            cx += Bx * A * wv + Nx * A * 0.45 * wv2; cy += By * A * wv + Ny * A * 0.45 * wv2; cz += Bz * A * wv + Nz * A * 0.45 * wv2;
            cy = Math.max(cy, r * BODY.ay + 0.015); }
          if (d >= 0) { rx = r; ry = r; }
          for (let j = 0; j < NS; j++) { const v = (i * NS + j) * 3, ox = OX[j] * rx, oy = OY[j] * ry;
            pa[v] = cx + Bx * ox + Nx * oy; pa[v + 1] = cy + By * ox + Ny * oy; pa[v + 2] = cz + Bz * ox + Nz * oy;
            if (rx === ry) { na[v] = Bx * NX[j] + Nx * NY[j]; na[v + 1] = By * NX[j] + Ny * NY[j]; na[v + 2] = Bz * NX[j] + Nz * NY[j]; }
            else { const ex = NX[j] * ry, ey = NY[j] * rx, el = Math.hypot(ex, ey) || 1;
              na[v] = (Bx * ex + Nx * ey) / el; na[v + 1] = (By * ex + Ny * ey) / el; na[v + 2] = (Bz * ex + Nz * ey) / el; }
            wa[i * NS + j] = rx / BODY.rMax; } }
        const ta = st.tgeo.attributes; ta.position.needsUpdate = true; ta.normal.needsUpdate = true; ta.aW.needsUpdate = true;
        if (st.emb) { const E = st.emb, ep = E.eg.attributes.position.array; for (let i = 0; i < E.ev.length; i++) { const v = E.ev[i]; ep[i * 3] = pa[v * 3]; ep[i * 3 + 1] = pa[v * 3 + 1]; ep[i * 3 + 2] = pa[v * 3 + 2]; }
          E.eg.attributes.position.needsUpdate = true; }
        return true;
      }
      return {
        g, U, bodyLen: BODY.L,
        ready: () => st.ready,
        /* the film's path and timing (FILMS5.together: { stick, pts, keys: [[t, point index or metres]], restSecs }) */
        plan,
        /* its place at film time t, its light a (0 hides it: hidden, it forgets its head, so nothing aims at a head from
           another moment) */
        fly(t, a) {
          st.want = { t, a };
          if (!st.ready || !st.plan || !(a > 0.001)) { g.visible = false; st.fw = null; st.sw = null; if (st.eyeG) st.eyeG.pts.visible = false; return; }
          g.visible = true; U.uNA.value = a; U.uNT.value = t; layAt(t, a);
        },
        /* (kept for the callers that only ever hid it: set(0, ...)) */
        set(k, a) { if (!(a > 0.001)) { st.want = null; g.visible = false; st.fw = null; st.sw = null; if (st.eyeG) st.eyeG.pts.visible = false; } },
        hide() { st.want = null; g.visible = false; st.fw = null; st.sw = null; if (st.eyeG) st.eyeG.pts.visible = false; },
        /* HIS LIGHT on it: where his gold stands (his shoulders) and how strong (0 none) */
        light(x, y, z, k) { U.uNPho.value.set(x, y, z, k); },
        /* the middle of its face as last laid, and its snout's tip (films aim at them), or null */
        headAt: () => (st.ready && st.fw && g.visible ? st.fw.slice() : null),
        snoutAt: () => (st.ready && st.sw && g.visible ? st.sw.slice() : null),
        /* the leader's place along the path at film time t, and a point on the path `u` metres along it */
        uAt: (t) => uOf(t),
        pointAt(u) { if (!st.plan) return null; const F = frameAt(u, new Float32Array(12)); return [F[0], F[1], F[2]]; },
        stickAt: () => (st.plan ? st.plan.stick.slice() : null),
        /* (R64, R70) the leader's frame at film time t, from its plan alone ([x, y, z, along, up, side]: a tracking shot rides it) */
        pose(t, out) { if (!st.plan) return null; return frameAt(uOf(t), out || new Float32Array(12)); },
        /* one eye's place at film time t, from the plan alone (its trail) */
        eyeAt(t, e) { if (!st.plan) return null; const u = uOf(t), H = st.plan.home, F = frameAt(u, FRE);
          const s = Math.max(0.02, smo(c01(u / 1.4)) * (H == null ? 1 : smo(c01((H - u) / 1.6)))), p = EYE[e];
          return [F[0] + (F[9] * p[0] + F[6] * p[1] + F[3] * p[2]) * HS * s, F[1] + (F[10] * p[0] + F[7] * p[1] + F[4] * p[2]) * HS * s, F[2] + (F[11] * p[0] + F[8] * p[1] + F[5] * p[2]) * HS * s]; },
        /* its eyes' light at film time t, k bright (0 none; over 1 they flare): after fly(), each frame */
        eyeFrame(t, k) {
          const E = st.eyeG; if (!E) return;
          if (!(k > 0.002) || !st.ready || !st.plan || !g.visible || !st.eyes || !st.head.visible) { E.pts.visible = false; return; }
          E.pts.visible = true;
          E.m.uniforms.uScale.value = Math.min(devicePixelRatio || 1, LOW ? 1.6 : 2) * innerHeight / (2 * Math.tan(camera.fov * Math.PI / 360));
          const A = E.eg.attributes, Pp = A.position.array, Cc = A.aC.array, Ss = A.aS.array, Aa = A.aA.array;
          camera.getWorldPosition(_ev);
          const trail = smo(c01(((st.speed || 0) - 2.5) / 4)), s = st.hs || 1;
          for (let e = 0; e < 2; e++) {
            const p = st.eyes[e], nr = st.eyeN[e], vx = _ev.x - p[0], vy = _ev.y - p[1], vz = _ev.z - p[2], vl = Math.hypot(vx, vy, vz) || 1;
            const face = smo(c01(((nr[0] * vx + nr[1] * vy + nr[2] * vz) / vl + 0.2) / 0.4));
            for (let j = 0; j < 10; j++) { const i = e * 10 + j; let q = p, a, sz, c0, c1, c2;
              if (j === 0) { a = Math.min(1, k) * face; sz = 0.075 * s * (0.8 + 0.25 * k); c0 = 1.0; c1 = 1.0; c2 = 1.0; }
              else if (j === 1) { a = 0.6 * Math.min(1.4, k) * face; sz = 0.3 * s * (0.75 + 0.3 * k); c0 = 0.3; c1 = 0.82; c2 = 1.0; }
              else { const f = (j - 2) / 8; q = this.eyeAt(t - (j - 1) * 0.028, e) || p; a = 0.55 * Math.min(1, k) * trail * (1 - f) * face; sz = 0.11 * s * (1 - 0.6 * f); c0 = 0.42; c1 = 0.88; c2 = 1.0; }
              Pp[i * 3] = q[0]; Pp[i * 3 + 1] = q[1]; Pp[i * 3 + 2] = q[2]; Cc[i * 3] = c0; Cc[i * 3 + 1] = c1; Cc[i * 3 + 2] = c2; Ss[i] = sz; Aa[i] = a; } }
          A.position.needsUpdate = true; A.aC.needsUpdate = true; A.aS.needsUpdate = true; A.aA.needsUpdate = true;
        },
        /* (a probe's lab: its state, its draws; tools/probes/e4c5nagalab.mjs) */
        lab: () => Object.assign(st, { SH: SH5, U, BODY, HS, J0, FACE, SNOUT, geo: st.tgeo, meshes: [st.head, st.tube && st.tube[1]] })
      };
    })();

    /* ---------------------------------------------------------------- THE PIERCE'S WATER AND STEAM (R47): as the Naga's head
       goes through a Prai, its water bursts out of the body (drops thrown forward and round, each on its own arc and falling
       under gravity, a ring of spray), and the fire put out goes up as steam (soft white puffs swelling as they climb and
       drift). Painted light, no light added (v9.4); a pure function of the film's clock and the three moments (each drop's
       way, speed, size and delay fixed by a seeded stream: the same on every phone) */
    const SPLASH5 = (() => {
      /* (R122 idea 6: "steam as each fire goes out": half as many puffs again, larger, longer and higher, was 22) */
      const ND = 64, NM = 34, NB = 3, r = rng(28747);
      const mk = (n, blend) => {
        const gg = new THREE.BufferGeometry(), at = (a, k) => new THREE.BufferAttribute(a, k).setUsage(THREE.DynamicDrawUsage);
        const pos = new Float32Array(n * 3), col = new Float32Array(n * 3), siz = new Float32Array(n), alp = new Float32Array(n);
        gg.setAttribute('position', at(pos, 3)); gg.setAttribute('aC', at(col, 3)); gg.setAttribute('aS', at(siz, 1)); gg.setAttribute('aA', at(alp, 1)); owned.push(gg);
        const m = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, blending: blend, fog: false, toneMapped: false, uniforms: { uScale: { value: 500 }, uSoft: { value: blend === THREE.AdditiveBlending ? 1.6 : 0.9 } },
          vertexShader: 'attribute vec3 aC; attribute float aS; attribute float aA; varying vec3 vC; varying float vA; uniform float uScale; void main(){ vC = aC; vA = aA; vec4 mv = modelViewMatrix * vec4(position, 1.0); gl_PointSize = aS * uScale / max(0.05, -mv.z); gl_Position = projectionMatrix * mv; }',
          fragmentShader: 'varying vec3 vC; varying float vA; uniform float uSoft; void main(){ float d = length(gl_PointCoord - 0.5) * 2.0; if (d > 1.0) discard; float f = pow(1.0 - d, uSoft); gl_FragColor = vec4(vC, vA * f); }' });
        mats.push(m);
        const pts = new THREE.Points(gg, m); pts.frustumCulled = false; pts.visible = false; world.add(pts);
        return { gg, m, pts, pos, col, siz, alp };
      };
      const D = mk(ND * NB, THREE.AdditiveBlending), M = mk(NM * NB, THREE.NormalBlending);
      D.pts.renderOrder = 4; M.pts.renderOrder = 3.9;
      /* each drop: its way (round the head's way, most of them thrown forward and out), its speed, its delay, its life and size */
      const DR = Array.from({ length: ND }, () => { const a = r() * Math.PI * 2, c = 0.15 + 0.85 * r(), s = Math.sqrt(1 - c * c);
        return { a, c, s, v: 2.2 + 3.6 * r(), dl: 0.06 * r(), life: 0.55 + 0.45 * r(), sz: 0.035 + 0.05 * r(), up: 0.4 + 1.2 * r() }; });
      const SM = Array.from({ length: NM }, () => ({ ox: (r() - 0.5) * 0.7, oz: (r() - 0.5) * 0.7, oy: r() * 0.6, dl: 0.08 + 1.0 * r(), life: 2.2 + 1.2 * r(), rise: 1.1 + 0.9 * r(), drift: (r() - 0.5) * 0.7, sz: 0.36 + 0.42 * r() }));
      let bursts = [];
      /* (R122 idea 6: THE WATER RISING ROUND THE STICK as it strikes the paving: a ring of drops thrown up all round it, turning
         as they rise, and falling back, and a swirl of mist at its foot; its own seeded stream) */
      const NR = 72, NRM = 16, r2 = rng(28748);
      const RG = mk(NR, THREE.AdditiveBlending), RGM = mk(NRM, THREE.NormalBlending);
      RG.pts.renderOrder = 4; RGM.pts.renderOrder = 3.9;
      const RR = Array.from({ length: NR }, (_, i) => ({ a: (i / NR) * Math.PI * 2 + (r2() - 0.5) * 0.12, v: 3.0 + 1.6 * r2(), out: 0.25 + 0.5 * r2(), sw: 0.6 + 0.6 * r2(), dl: 0.18 * r2(), life: 0.95 + 0.5 * r2(), sz: 0.04 + 0.05 * r2() }));
      const RM = Array.from({ length: NRM }, (_, i) => ({ a: (i / NRM) * Math.PI * 2 + r2() * 0.4, dl: 0.1 + 0.3 * r2(), life: 1.6 + 0.9 * r2(), rise: 0.5 + 0.6 * r2(), sz: 0.35 + 0.3 * r2() }));
      let ringB = null;
      return {
        /* the three moments: [{ t0, p: [x, y, z] (the body's middle), d: [x, y, z] (the head's way through it) }] */
        set(list) { bursts = list || []; },
        /* the ring: { t0, p: [x, y, z] (the stick's foot), r (metres round it) } */
        ring(o) { ringB = o || null; },
        frame(t) {
          let any = false;
          const sc = Math.min(devicePixelRatio || 1, LOW ? 1.6 : 2) * innerHeight / (2 * Math.tan(camera.fov * Math.PI / 360));
          D.m.uniforms.uScale.value = sc; M.m.uniforms.uScale.value = sc; RG.m.uniforms.uScale.value = sc; RGM.m.uniforms.uScale.value = sc;
          for (let b = 0; b < NB; b++) { const B = bursts[b];
            for (let i = 0; i < ND; i++) { const k = b * ND + i, q = DR[i], tau = B ? t - B.t0 - q.dl : -1;
              if (!B || tau < 0 || tau > q.life) { D.alp[k] = 0; continue; }
              any = true;
              /* (a frame round the head's way: the way, a side, an up) */
              const dx = B.d[0], dy = B.d[1], dz = B.d[2]; let sx = -dz, sz = dx; const sl = Math.hypot(sx, sz) || 1; sx /= sl; sz /= sl;
              const ux = -sz * dy, uy = sz * dx - sx * dz, uz = sx * dy;
              const ox = Math.cos(q.a) * q.s, oy = Math.sin(q.a) * q.s;
              const vx = (dx * q.c + sx * ox + ux * oy) * q.v, vy = (dy * q.c + oy * (q.up)) * q.v * 0.8 + 0.6, vz = (dz * q.c + sz * ox + uz * oy) * q.v;
              D.pos[k * 3] = B.p[0] + vx * tau; D.pos[k * 3 + 1] = Math.max(0.02, B.p[1] + vy * tau - 4.9 * tau * tau); D.pos[k * 3 + 2] = B.p[2] + vz * tau;
              const f = 1 - tau / q.life; D.alp[k] = 0.9 * f * f; D.siz[k] = q.sz * (0.7 + 0.3 * f);
              D.col[k * 3] = 0.62 + 0.3 * f; D.col[k * 3 + 1] = 0.88 + 0.1 * f; D.col[k * 3 + 2] = 1.0; }
            for (let i = 0; i < NM; i++) { const k = b * NM + i, q = SM[i], tau = B ? t - B.t0 - q.dl : -1;
              if (!B || tau < 0 || tau > q.life) { M.alp[k] = 0; continue; }
              any = true;
              const u = tau / q.life;
              M.pos[k * 3] = B.p[0] + q.ox + q.drift * u; M.pos[k * 3 + 1] = B.p[1] - 0.25 + q.oy + q.rise * u * (2 - u); M.pos[k * 3 + 2] = B.p[2] + q.oz + q.drift * 0.6 * u;
              M.siz[k] = q.sz * (0.5 + 1.4 * u); M.alp[k] = 0.44 * Math.pow(Math.sin(Math.PI * Math.min(1, u * 1.15)), 1.2);
              M.col[k * 3] = 0.86; M.col[k * 3 + 1] = 0.9; M.col[k * 3 + 2] = 0.94; } }
          for (let i = 0; i < NR; i++) { const q = RR[i], B = ringB, tau = B ? t - B.t0 - q.dl : -1;
            if (!B || tau < 0 || tau > q.life) { RG.alp[i] = 0; continue; }
            any = true;
            const a = q.a + q.sw * tau, rad = B.r + q.out * tau, y = Math.max(0.02, B.p[1] + q.v * tau - 4.9 * tau * tau);
            RG.pos[i * 3] = B.p[0] + rad * Math.sin(a); RG.pos[i * 3 + 1] = y; RG.pos[i * 3 + 2] = B.p[2] + rad * Math.cos(a);
            const f = 1 - tau / q.life; RG.alp[i] = 0.85 * f; RG.siz[i] = q.sz * (0.8 + 0.2 * f);
            RG.col[i * 3] = 0.6 + 0.3 * f; RG.col[i * 3 + 1] = 0.86 + 0.1 * f; RG.col[i * 3 + 2] = 1.0; }
          for (let i = 0; i < NRM; i++) { const q = RM[i], B = ringB, tau = B ? t - B.t0 - q.dl : -1;
            if (!B || tau < 0 || tau > q.life) { RGM.alp[i] = 0; continue; }
            any = true;
            const u = tau / q.life, rad = B.r * (0.8 + 0.9 * u), a = q.a + 0.4 * u;
            RGM.pos[i * 3] = B.p[0] + rad * Math.sin(a); RGM.pos[i * 3 + 1] = 0.15 + q.rise * u; RGM.pos[i * 3 + 2] = B.p[2] + rad * Math.cos(a);
            RGM.siz[i] = q.sz * (0.6 + 1.2 * u); RGM.alp[i] = 0.38 * Math.sin(Math.PI * Math.min(1, u * 1.1));
            RGM.col[i * 3] = 0.82; RGM.col[i * 3 + 1] = 0.9; RGM.col[i * 3 + 2] = 0.98; }
          for (const S of [D, M, RG, RGM]) { S.pts.visible = any; const A = S.gg.attributes; A.position.needsUpdate = true; A.aC.needsUpdate = true; A.aS.needsUpdate = true; A.aA.needsUpdate = true; }
        },
        off() { bursts = []; ringB = null; D.pts.visible = false; M.pts.visible = false; RG.pts.visible = false; RGM.pts.visible = false; }
      };
    })();

    /* ---------------------------------------------------------------- THE RITE'S THINGS (case three, every ending: the
       plan's 4.9). The holy water in chapter 4's bowl on the cloth, the drops his hand throws (painted light: a fixed set,
       the same every run), the black bag and its white string. (R88, Chad, 24 Nov: "Remove the peacock feather fan from
       pho's hand in the final cutscene": no fan; the water leaves his raised hand as it sweeps down, RITE_AT.handFrom.
       R89: the bowl inside the cloth's top, its back third had stood over the hanging drape, and on the cloth itself) */
    const RITE5 = (() => {
      const R = ROOM, top = CLOTHY5(ROOM.cx + 0.40);
      const bowl = place('w4waterbowl', R.cx + 0.40, top, R.cz + 0.19, 0, { name: 'riteBowl' }); bowl.visible = false;
      const fan = null;
      /* the drops: a fixed set of soft points, each flying its own arc from his hand to the pieces on the cloth (v6.15:
         seeded) */
      const soft = (() => { const [c, x] = canvas(64, 64); const gr = x.createRadialGradient(32, 32, 1, 32, 32, 31);
        gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.5, 'rgba(220,235,255,0.5)'); gr.addColorStop(1, 'rgba(200,220,255,0)'); x.fillStyle = gr; x.fillRect(0, 0, 64, 64); return tex(done(THREE, c, false)); })();
      const drops = [], r = rng(28640);
      for (let i = 0; i < 26; i++) { const m = new THREE.SpriteMaterial({ map: soft, color: 0xdfefff, transparent: true, opacity: 0, depthWrite: false }); mats.push(m);
        const sp = new THREE.Sprite(m); sp.scale.setScalar(0.012 + r() * 0.01); sp.visible = false; world.add(sp);
        drops.push({ sp, m, dx: (r() - 0.5) * 0.36, dz: (r() - 0.5) * 0.36, up: 0.05 + r() * 0.12, lag: r() * 0.18, life: 0.55 + r() * 0.25 }); }
      /* the white sacred string round the bag's neck (the case file: "sealed tightly with sacred string"): a ring of cord */
      const mStr = new THREE.MeshStandardMaterial({ color: 0xf4f0e4, roughness: 0.8 }); mats.push(mStr);
      const gStr = new THREE.TorusGeometry(0.034, 0.0035, 6, 28); gStr.rotateX(Math.PI / 2); owned.push(gStr);
      const strRing = new THREE.Group(); for (let i = 0; i < 3; i++) { const me = new THREE.Mesh(gStr, mStr); me.position.y = i * 0.0065; strRing.add(me); } strRing.visible = false; world.add(strRing);
      return {
        bowl, fan, drops, strRing,
        /* one throw of his hand: the drops leave it at `t0` toward the pieces (cx, cz) and fall on the cloth; `prev` (the
           throws' period, 0 for the first) lets the last throw's drops finish their fall as the next begins */
        throwAt(t, t0, from, cx, cz, prev) {
          for (const d of drops) { let u = (t - t0 - d.lag) / d.life;
            if ((u < 0 || u > 1) && prev > 0) u = (t + prev - t0 - d.lag) / d.life;
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
      const R = ROOM, keys = ['e4kuman', 'e4ngang', 'e4tani', 'e4phraioil', 'e4phraitab', 'e4praicase', 'e4tanitab'];
      const list = [];
      /* three rows across the table's front half (the cloth's x -0.55 .. 0.55), the presences' three where the play
         puts them (TABLE5.P) and the rest about them, a little apart, each turned to him */
      /* (CLEAR OF THE PADDED CASE, PLAY's finding: the case stands at (cx - 0.36, cz - 0.05), 0.34 by 0.27 m turned 18
         degrees, so its footprint runs to x -0.17 over z cz - 0.21 .. cz + 0.11, and four pieces of the two rows behind the
         first stood inside it. Those rows now start east of it (x -0.15), and a fourth row behind them takes the rest) */
      /* (R89: the grid's twenty places (c_play.js GRID5), front row first, the three's taken in the back row; the seventeen
         grouped by kind in that order, each turned square to him, set on the cloth where it stands) */
      let n = 0;
      for (let j = 0; j < GRID5.zs.length && n < 17; j++) for (let i = 0; i < GRID5.xs.length && n < 17; i++) {
        const x = R.cx + GRID5.xs[i], z = R.cz + GRID5.zs[j];
        const clash = [TABLE5.P.angry, TABLE5.P.hungry, TABLE5.P.energy].some(p => Math.hypot(p.x - x, p.z - z) < 0.05);
        if (clash) continue;
        const key = keys[Math.floor(n * keys.length / 17)], g = place(key, x, CLOTHY5(x), z, Math.PI, { name: 'piece' + n }); list.push({ g, x, z }); n++;
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
        /* the walkway's evening comes in as the doors open; the smell under it from his step out (R105: and the estate's
           evening over the first shot, before the cut into the lift) */
        fmBeds({ walk: t < T.estate ? 0.55 : 0.55 * smo(c01((t - T.open) / 1.6)), sour: 0.32 * smo(c01((t - T.sour) / 2.0)) });
        /* the car's number: 1, then 2, then 3 (the walkway's storey) as the chime comes */
        LIFTNUM5.set(t < T.out + 1.0 ? (t < T.num2 ? 0 : t < T.num3 ? 1 : 2) : -1);
        liftDoors(smo(c01((t - T.open) / 1.5)));
        /* (R76: the doors open in this picture are open to the walkable map's routes: the three are routed through the
           doorway's middle, their shoulders clear of its jambs; play's map keeps them shut) */
        navFilmOpen(LIFT_SHUT5, t >= T.open + 1.0);
        /* his teacher: before him, facing the doors, his eyes on the number; out first, down the walkway to where he waits */
        /* (his look on the number let go over his first steps out, never dropped in one frame: R25) */
        whenReady(cast.pho, (P) => { fmWalk(P, t, T.out, [CAR5.pho, [0.04, 0.7], [STATION.walk.pho.x, STATION.walk.pho.z]], 1.05, restOf5('pho', t), STATION.walk.pho.ry, { ry0: Math.PI });
          const kl = 0.55 * (1 - smo(c01((t - T.out) / 0.6))); if (kl > 0.001) lookNow(P, [0, 2.2, LIFT.z0], kl, 0.6); });
        /* Ton, at his left, the wrapped staff upright in his right hand: his line turned back over his shoulder; out after
           his teacher, single file through the doors, turning back to him on the walkway as he stops */
        whenReady(cast.ton, (P) => { const r = restOf5('ton', t);
          if (t < T.tonOut) { put(P, CAR5.ton[0], CAR5.ton[1], Math.PI + angTo(Math.PI, faceTo(CAR5.ton[0], CAR5.ton[1], CAR5.eye[0], CAR5.eye[2])) * 0.38 * smo(c01((t - T.tn5o1 + 0.5) / 0.6)) * (1 - smo(c01((t - T.tn5o1 - SECS.tn5o1) / 0.8))));
            fmTalk(P, 'ton', t, T.tn5o1, SECS.tn5o1, 'Idle_3');
            lookNow(P, 'lens', smo(c01((t - T.tn5o1 + 0.3) / 0.6)) * (1 - smo(c01((t - T.tn5o1 - SECS.tn5o1) / 0.8))), 0.85, 0.12); }
          else { fmWalk(P, t, T.tonOut, [CAR5.ton, [-0.16, 1.0], [STATION.walk.ton.x, STATION.walk.ton.z]], 1.0, r, STATION.walk.ton.ry, { ry0: Math.PI });   // (turned from where he stood, never snapped to the path)
            if (t > T.sour) lookNow(P, 'lens', smo(c01((t - T.sour) / 1.2)) * 0.8, 0.8); }
          STICK5.carry(P); });
        /* Jun, at his right, the duffel in his hand: his line, then out last before him */
        whenReady(cast.jun, (P) => { const r = restOf5('jun', t);
          /* (each half-turns his body back to him for his line and the head does the rest (v14.5: a man talking to him turns to
             him); facing the doors, the back of Jun's head filled the phone as he spoke: open-phone film-012_5, R25) */
          if (t < T.junOut) { put(P, CAR5.jun[0], CAR5.jun[1], Math.PI + angTo(Math.PI, faceTo(CAR5.jun[0], CAR5.jun[1], CAR5.eye[0], CAR5.eye[2])) * 0.38 * smo(c01((t - T.ju5o1 + 0.5) / 0.6)) * (1 - smo(c01((t - T.ju5o1 - SECS.ju5o1) / 0.8))));
            fmTalk(P, 'jun', t, T.ju5o1, SECS.ju5o1, 'Talk_with_Right_Hand_Open');
            lookNow(P, 'lens', smo(c01((t - T.ju5o1 + 0.3) / 0.6)) * (1 - smo(c01((t - T.ju5o1 - SECS.ju5o1) / 0.8))), 0.85, 0.12); }
          else { fmWalk(P, t, T.junOut, [CAR5.jun, [0.14, 1.0], [STATION.walk.jun.x, STATION.walk.jun.z]], 1.0, r, STATION.walk.jun.ry, { ry0: Math.PI });
            if (t > T.sour) lookNow(P, 'lens', smo(c01((t - T.sour - 0.4) / 1.2)) * 0.8, 0.8); }
          DUFFEL5.carry(P); });
        /* THE SOUR: the colour thinned toward grey-green from the edges in as he steps out, and held (R105: "then a pungent
           smell hit me": it HITS, past where it settles in its first fifth of a second and easing back over the next) */
        const hit5 = (d) => d <= 0 ? 0 : d < 0.18 ? d / 0.18 : Math.exp(-(d - 0.18) / 0.7);
        if (kit && kit.chill) { const k = Math.min(1, smo(c01((t - T.sour) / 2.4)) * 0.85 + 0.75 * hit5(t - T.sour)) * (1 - smo(c01((t - T.black - 0.2) / 0.6)));
          if (k > 0.002 || FM5.sour) { kit.chill(k, { tint: 'sour', cine: true }); FM5.sour = k > 0.002; } }
        /* THE LENS (his eyes): the number, close; the car, wide (a cramped room gets a wider lens on a phone: v24.21);
           Jun's line, Ton's; the doors; his step out, a breath of a bob; the walkway, where play begins (its snapshot) */
        const D = [0, 2.2, LIFT.z0], W = [0, 1.45, -8.0];
        fmTrack(t, [
          /* (R105) THE ESTATE AT DUSK, first: a crane over the lawn, outside the block and looking away from it (so its own face,
             which no shot looks at, is never in the frame), tilting up from the playground on its mat, its lamps lit, over
             the road and the cars to the east block's lit windows and the sky over it; then the cut into the lift */
          { t: 0, name: 'estate', eye: [3.0, 12.0, -0.5], at: [15.5, -5.9, -0.8], fp: 56, fd: 48 },
          { t: T.estate - 0.02, name: 'estate', eye: [4.2, 12.6, -3.2], at: [34.0, 4.5, -7.0], fp: 54, fd: 46 },
          { t: T.estate, name: 'number', eye: [0.04, EYE, 2.5], at: D, fp: 26, fd: 22, cut: true },
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
        /* (R105) THE HIT: his head jerks back and aside from it as it reaches him, in a sixth of a second, his breath caught
           (u5zbreath), and comes back to the walkway it comes from over a second and a half (laid on what the track wrote:
           every one of these is the track's own each frame) */
        { const d = t - T.sour; if (d > 0 && d < 1.8) { const a = d < 0.16 ? smo(d / 0.16) : 1 - smo((d - 0.16) / 1.6);
          yaw.position.z += 0.07 * a; yaw.rotation.y += 0.10 * a; pitch.rotation.x -= 0.05 * a; camera.rotation.z += 0.025 * a; } }
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
      carry(P) { const g = things.duffel; if (!g || this.who !== 'jun' || !P || !P.ready) return; this.off = handHold5(P, 'Left', g, this.off, { hang: 0.03, ry: Math.PI / 2, out: 0.05 }); }   // (R33 F4: his arm out 10 degrees, CARRY5; was out 0.1)
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
        g.visible = true; navCarried(P, g); return off;
      }
      if (g.parent !== hb) hb.add(g);
      off.decompose(g.position, g.quaternion, g.scale); g.visible = true;
      return off;
    }

    /* (R33 F4, 23 Nov: CARRIED AS A HAND CAN CARRY IT. The wrapped staff stood upright in Ton's HANGING fist, so its shaft ran
       up through his wrist, forearm, elbow and upper arm (the opening's clipscan: 895 crossings at 0 s and 1,133 at 27 s, from
       his hand to his shoulder); a staff upright in one fist lies ACROSS the palm, so the forearm holding it is level, the
       elbow bent near a right angle and the thumb on top, as a man carries a tall staff he is not leaning on. Each frame he
       carries it, after everything has posed him: his right wrist 0.24 m to his right of his middle, 0.97 m up and 0.17 m
       before him (his group's frame), his elbow hung under his shoulder (armHinge, its hinge read off his own pose first),
       his hand straight on his forearm as his bind holds it, the forearm and the wrist sharing the turn that puts his thumb
       on top; the staff then set in his fist, 3 cm along his palm's facing from its middle (inside his curled fingers). And
       Jun's duffel through his thigh as he walked (446): his left arm turned out from his side 10 degrees as an arm carrying
       a bag hangs, the bag under his hand. Both laid with a share eased over 0.3 s as the carrying begins or ends, kept as the
       mixer wrote them and taken back by armsBack before it runs again (v11.5); a probe's switch: CARRY5.on) */
    const CARRY5 = { on: true, k: 0, kj: 0, last: 0, wrist: [-0.24, 0.97, 0.17], pole: [0.25, -0.95, -0.15], palm: 0.03, junOut: 10 * Math.PI / 180, read: null };
    const _cyA = new THREE.Vector3(), _cyB = new THREE.Vector3(), _cyC = new THREE.Vector3(), _cyD = new THREE.Vector3(), _cyE = new THREE.Vector3(),
          _cyQ = new THREE.Quaternion(), _cyQ2 = new THREE.Quaternion(), _cyQ3 = new THREE.Quaternion(), _cyM = new THREE.Matrix4(), _cyM2 = new THREE.Matrix4();
    function bindTurn5(P, par, ch) {                                          // (a bone's turn on its parent in the body's bind pose)
      let sk = null; P.group.traverse(o => { if (!sk && o.isSkinnedMesh && o.skeleton) sk = o.skeleton; });
      const ip = sk ? sk.bones.indexOf(par) : -1, ic = sk ? sk.bones.indexOf(ch) : -1; if (ip < 0 || ic < 0) return null;
      _cyM.copy(sk.boneInverses[ip]); _cyM2.copy(sk.boneInverses[ic]).invert(); _cyM.multiply(_cyM2);
      const q = new THREE.Quaternion(); _cyM.decompose(_cyA, q, _cyB); return q;
    }
    function carryStaffLay(P, kk) {
      const As = armsOf(P), a = As && As.R; if (!a) return;
      if (!a.hinge) hingeOf(a, -1);                                           // (read off his own pose, before anything is laid)
      if (!a.c5) { const m1 = boneOf(P, 'RightHandMiddle1'), i1 = boneOf(P, 'RightHandIndex1'), k1 = boneOf(P, 'RightHandPinky1') || boneOf(P, 'RightHandRing1');
        const bt = bindTurn5(P, a.fore, a.hand);
        if (!m1 || !i1 || !k1 || !bt) { a.c5 = { none: true }; console.warn('CARRY5: ' + P.key + ' has no hand to carry the staff with'); }
        else { const f = m1.position.clone().normalize(), r = i1.position.clone().sub(k1.position); r.addScaledVector(f, -r.dot(f)).normalize();
          a.c5 = { bt, f, r, n: new THREE.Vector3().crossVectors(f, r).negate().normalize() }; } }
      if (a.c5.none) return;
      if (!a.wrote) { a.qUp.copy(a.up.quaternion); a.qFore.copy(a.fore.quaternion); a.qHand.copy(a.hand.quaternion); a.wrote = true; }
      _cyQ3.copy(a.up.quaternion); const kF = a.fore.quaternion.clone(), kH = a.hand.quaternion.clone();
      P.group.updateWorldMatrix(true, false); P.group.getWorldQuaternion(_cyQ);
      const Wr = _cyA.set(CARRY5.wrist[0], CARRY5.wrist[1], CARRY5.wrist[2]); P.group.localToWorld(Wr);
      const pole = _cyB.set(CARRY5.pole[0], CARRY5.pole[1], CARRY5.pole[2]).normalize().applyQuaternion(_cyQ);
      armHinge(a, Wr, pole);
      /* (the hand straight on the forearm, as his bind holds it; then the turn about the forearm's line that puts the thumb's side
         up, shared half and half between the forearm and the wrist, so neither carries all of it) */
      a.hand.quaternion.copy(a.c5.bt); a.hand.updateWorldMatrix(true, false);
      a.fore.getWorldPosition(_cyC); a.hand.getWorldPosition(_cyD); const e = _cyE.subVectors(_cyD, _cyC).normalize();
      a.hand.getWorldQuaternion(_cyQ2); const r = _cyC.copy(a.c5.r).applyQuaternion(_cyQ2); r.addScaledVector(e, -r.dot(e)).normalize();
      const u = _cyD.set(0, 1, 0).addScaledVector(e, -e.y).normalize();
      const phi = Math.atan2(_cyA.crossVectors(r, u).dot(e), r.dot(u));
      a.fore.getWorldQuaternion(_cyQ2); const fw = _cyQ2.clone(), hw = _cyQ2.clone().multiply(a.c5.bt);
      const qh = new THREE.Quaternion().setFromAxisAngle(e, phi / 2), qf = new THREE.Quaternion().setFromAxisAngle(e, phi);
      fw.premultiply(qh); hw.premultiply(qf);
      a.fore.parent.getWorldQuaternion(_cyQ); a.fore.quaternion.copy(_cyQ.invert().multiply(fw));
      a.hand.quaternion.copy(fw.clone().invert().multiply(hw));
      if (kk < 0.999) { a.up.quaternion.slerpQuaternions(_cyQ3, a.up.quaternion.clone(), kk); a.fore.quaternion.slerpQuaternions(kF, a.fore.quaternion.clone(), kk);
        a.hand.quaternion.slerpQuaternions(kH, a.hand.quaternion.clone(), kk); }
      a.up.updateWorldMatrix(false, true);
    }
    function carryBagLay(P, kk) {
      const As = armsOf(P), a = As && As.L; if (!a) return;
      if (!a.wrote) { a.qUp.copy(a.up.quaternion); a.qFore.copy(a.fore.quaternion); a.qHand.copy(a.hand.quaternion); a.wrote = true; }
      P.group.updateWorldMatrix(true, false); P.group.getWorldQuaternion(_cyQ);
      const fwd = _cyA.set(0, 0, 1).applyQuaternion(_cyQ);                     // (his forward: a turn about it by a positive angle takes his LEFT arm out)
      a.up.parent.updateWorldMatrix(true, false); a.up.parent.getWorldQuaternion(_cyQ2); fwd.applyQuaternion(_cyQ2.invert()).normalize();
      a.up.quaternion.premultiply(_cyQ3.setFromAxisAngle(fwd, CARRY5.junOut * kk)); a.up.updateWorldMatrix(false, true);
    }
    const carryHook = new THREE.Object3D(); carryHook.name = 'what Ton and Jun carry, held as a hand holds it';
    carryHook.updateMatrixWorld = function (force) {
      try {
        const now = performance.now(), dt = CARRY5.last ? Math.min(0.1, (now - CARRY5.last) / 1000) : 0; CARRY5.last = now;
        const T = cast.ton, J = cast.jun, tOn = CARRY5.on && typeof STICK5 === 'object' && STICK5.who === 'tonWrap' && !!(T && T.ready && T.group.visible) && !!things.staffWrap;
        const jOn = CARRY5.on && DUFFEL5.who === 'jun' && !!(J && J.ready && J.group.visible) && !!things.duffel;
        CARRY5.k = tOn ? Math.min(1, CARRY5.k + dt / 0.3) : Math.max(0, CARRY5.k - dt / 0.3);
        CARRY5.kj = jOn ? Math.min(1, CARRY5.kj + dt / 0.3) : Math.max(0, CARRY5.kj - dt / 0.3);
        /* (the first frame he carries it after a cut or a Continue: the whole share at once, never eased in on screen from his
           hanging arm, which held the staff through it) */
        if (tOn && CARRY5.k < 1 && !CARRY5.tWas) CARRY5.k = 1; if (jOn && CARRY5.kj < 1 && !CARRY5.jWas) CARRY5.kj = 1;
        CARRY5.tWas = tOn; CARRY5.jWas = jOn;
        /* (the grip's height is read once, from his plain standing rest (handHold5 poses it and puts the take back): read before
           anything is laid this frame, so the lay is not undone by it) */
        if (tOn && !STICK5.wrapOff) STICK5.carry(T); if (jOn && !DUFFEL5.off) DUFFEL5.carry(J);
        if (T && T.ready && CARRY5.k > 0) { carryStaffLay(T, CARRY5.k);
          if (tOn) { STICK5.carry(T); const a = armsOf(T).R, g = things.staffWrap; if (a && a.c5 && !a.c5.none && g) {
            a.hand.getWorldQuaternion(_cyQ); const n = _cyA.copy(a.c5.n).applyQuaternion(_cyQ); n.y = 0;
            if (n.lengthSq() > 1e-6) { n.normalize(); g.position.addScaledVector(n, CARRY5.palm); } } } }
        if (J && J.ready && CARRY5.kj > 0) { carryBagLay(J, CARRY5.kj); if (jOn) DUFFEL5.carry(J); }
      } catch (e) { if (!CARRY5.failed) { CARRY5.failed = true; console.warn('CARRY5 threw: ' + (e && e.message)); } }
      THREE.Object3D.prototype.updateMatrixWorld.call(this, force);
    };
    world.children.unshift(carryHook); carryHook.parent = world;

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
    /* (R46: the gate 2.6 m further out with the longer court: every place at it read from its line, WALK.turnZ; was -14.0) */
    const GZ5 = WALK.turnZ;
    const DV5AT = { gateEye: [-8.18, EYE, GZ5 - 1.05], phoGate: [-8.92, GZ5 - 0.52], tonW: [-7.58, GZ5 - 1.3], junW: [-9.75, GZ5 - 1.35],
                    kohDoor: [-8.35, -4.9], kohGate: [-7.82, GZ5 + 0.68], phoIn: [-9.5, -3.9], eyeIn: [STATION.hunt.at.x, EYE, STATION.hunt.at.z], kohRoom: [STATION.hunt.koh.x, STATION.hunt.koh.z] };
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
        /* (R76: the gate open in this picture is open to the walkable map's routes, its leaf standing along the court's wall:
           the walk phase holds it shut, and Ton was routed straight through its east post, 28 cm into it, limbread on build 44) */
        navFilmOpen(gateShut, t >= T.cut1); navFilmShut(gateOpenLeaf, t >= T.cut1);
        /* the lamp that flickers, the dining room's pendant (an ordinary fault: the electrician came three times, 4.0; R42: it
           was the armchair's reading lamp, out of the room at Chad's word) */
        lamp(LAMP_FLICK, inside ? 0.25 + 0.75 * (Math.sin(t * 23.0) * Math.sin(t * 7.1) > -0.35 ? 1 : 0.2) : 1);
        whenReady(cast.koh, (P) => {
          if (t < T.walk) { put(P, A.kohDoor[0], A.kohDoor[1], Math.PI); fmRest(P, 'koh', t); }
          /* (inside his doors as they open, clear of the leaf's swing (0.89 m from its hinge) and of the sofa, and out through
             them: stood in the court with his back to the shut door, his arm went through its frame (clipscan, 168
             crossings), and the door opened behind him by itself) */
          /* (R46: the court 2.6 m longer: his walk to the gate a little quicker, a worried man, and the shot 1.4 s longer, so he is
             as near the gate at the cut as he was: was 1.12 m a second over 6.2 s) */
          else if (t < T.cut1) fmWalk(P, t, T.walk, [A.kohDoor, [-8.5, -6.0], [-8.4, -9.5], A.kohGate], 1.3, restOf5('koh', t), Math.PI + 0.2, { ry0: Math.PI });
          else if (t < T.in) { put(P, A.kohGate[0], A.kohGate[1], faceTo(A.kohGate[0], A.kohGate[1], A.phoGate[0], A.phoGate[1]));
            fmTalk(P, 'koh', t, T.ko5d1, SECS.ko5d1, 'Talk_with_Hands_Open');
            /* his head bowed to Grandmaster Pho as he greets him (the wai's own take is wanted: the plan's 4.2) */
            lookNow(P, [A.phoGate[0], 0.95, A.phoGate[1]], smo(c01((t - T.ko5d1 + 0.2) / 0.5)) * (1 - 0.6 * smo(c01((t - T.ko5d1 - 1.5) / 0.8))), 0.6); }
          /* (he leads them in: on the cut into the court he is already halfway up it (a moment passed), and is inside his
             doors before the slippers' shot looks there; walked from his gate in the shot it stood him in the doorway with
             the lens in his back) */
          /* (R33 F5: stood at x -8.5 his left hand went 4 cm into the open leaf, which stands along x -8.94..-8.79 (clipscan, 52
             crossings at 17 and 18 s, on build 36): 8 cm east, his hand clear of it by 4 cm, his right side still 6 cm off the
             east jamb's line) */
          else if (!inside) fmWalk(P, t, T.in, [[-8.5, -8.0], [-8.42, -5.05]], 1.4, restOf5('koh', t), Math.PI);   // (to just inside his door: the sofa begins at z -4.67)
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
          else if (!inside) fmWalk(P, t, T.in, [[A.phoGate[0], A.phoGate[1]], [-8.5, GZ5 + 1.4], [-8.5, -6.6]], 1.55, restOf5('pho', t), Math.PI);
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
          else fmWalk(P, t, T.in + 0.4, [A.tonW, [-7.9, GZ5 - 0.3], [STATION.hunt.ton.x, STATION.hunt.ton.z]], 1.0, restOf5('ton', t), STATION.hunt.ton.ry);
          STICK5.carry(P); });
        whenReady(cast.jun, (P) => { if (t < T.in + 0.9) { put(P, A.junW[0], A.junW[1], 0.1); fmRest(P, 'jun', t); }
          else fmWalk(P, t, T.in + 0.9, [A.junW, [-8.9, GZ5 - 0.3], [-9.2, GZ5 + 3.0], [STATION.hunt.jun.x, STATION.hunt.jun.z]], 1.05, restOf5('jun', t), STATION.hunt.jun.ry);
          DUFFEL5.carry(P); });
        /* THE LENS: through the gate's bars to his doors, as they open and he comes; on the cut, him in the open gate, his
           greeting; walking in behind them, past the planters; his doors, the slippers; the room: him by his dining room,
           his three lines; his teacher's two; and the room the hunt begins in (its snapshot) */
        const KOH = () => fmHead(cast.koh, [A.kohRoom[0], 1.55, A.kohRoom[1]]), PHO = () => fmHead(cast.pho, [A.phoIn[0], 1.6, A.phoIn[1]]);
        fmTrack(t, [
          /* (R46: from the gate 2.6 m further from his doors, the lens narrowed by as much, so his doors and he coming stand as
             large as they stood: was 46/40 and 52/44) */
          { t: 0, name: 'gate', eye: A.gateEye, at: [-8.55, 1.25, -5.8], fp: 37, fd: 32 },
          { t: T.walk + 1.0, name: 'gate', eye: A.gateEye, at: [-8.5, 1.35, -8.5], fp: 44, fd: 37 },
          { t: T.cut1 - 0.05, name: 'gate', eye: [-8.2, EYE, GZ5 - 0.95], at: () => fmHead(cast.koh, [-7.82, 1.55, GZ5 + 0.68]), fp: 56, fd: 48 },
          /* (on the cut, the gate open: a single of him greeting, from beside his teacher, his face toward the lens and his
             eyes on Grandmaster Pho at the frame's right; aimed between them it cut him in half at a phone's edge, and from
             where the shot before stood it was a jump cut, the look 4.7 degrees: lensread.py) */
          { t: T.cut1, name: 'greet', eye: [-8.55, EYE, GZ5 - 0.6], at: () => fmHead(cast.koh, [-7.82, 1.5, GZ5 + 0.68]), fp: 42, fd: 38, cut: true },
          { t: T.in - 0.1, name: 'greet', eye: [-8.55, EYE, GZ5 - 0.6], at: () => fmHead(cast.koh, [-7.82, 1.5, GZ5 + 0.68]), fp: 40, fd: 36 },
          { t: T.in, name: 'court', eye: [-8.4, EYE, GZ5 - 0.55], at: [-8.5, 1.3, -6.5], fp: 66, fd: 58, cut: true },
          { t: T.slip - 0.05, name: 'court', eye: [-8.45, EYE, GZ5 + 2.1], at: [-8.5, 1.25, -5.8], fp: 66, fd: 58 },
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
      end() { fmLens(PLAYFOV5); lamp(LAMP_FLICK, 1); endPhase5('hunt'); }
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
        STICK5.to('tonWrap'); DUFFEL5.to('away'); STICK5.warm();                // (R65: its underside read now, on the film's first frame, not as he unwraps it)
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
          fmTalk(P, 'koh', t, T.ko5p1, SECS.ko5p1, 'Stand_and_Chat'); lookNow(P, fmHead(cast.pho, [-8.6, 1.6, -9]), 0.8, 0.75); });
        /* (R79, Chad: "his hand movement causes collision to ton, and because of that, ton jerks repeatedly to clear the
           collision but ends up vibrating": his question was asked with his hands thrown open, a step behind Ton, and each
           sweep of a hand into Ton moved Ton off it in that picture and back in the next. Asked with his chatting take, as
           his line in the Naga film is since R76, his hands stay by him; and the arms' move itself is eased now, c_nav.js) */
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

    /* ================================================================ TOGETHER (the plan's 5.5, stage 5; its clock is the film's
       own, FILMS5.together.tl()): the ONE film inside the fight, which cannot be skipped the first time (the forty-first seam:
       the fight plays it with kit.film('together', { noSkip: !ctx.sealedBefore(...) })). R47 (23 Nov 2026) made the Naga one
       of WATER: it spirals up out of the stick's head, comes down on the tall shape, and goes through the three, each one's
       fire put out in steam with a water sound.
       R63, R64, R69, R70 (23 Nov 2026, Chad: "the naga sequence is still not good enough. The camera framing and panning on
       both desktop and mobile does not properly frame it for the best cinematoc effect. Also it feels weak. When the naga
       pierces through each prai, there needs to be visual impact and physical feedback, with screen shake effect, and the sound
       effect needs to be much more powerful. Also somehow the ending of the naga part is very anticlimactic as it just stays
       there lingering in an awkward position, what was that for?"; "it needs to properly rearrange all the characters, prai,
       and the naga for proper staging for the cutscene so that the positions are always reliably fixed during the cutscene no
       matter how the player plays it ... this rearranging should not be seen by the player ... The camera should look at the
       naga head, and track it from different angles as it flies up high in the sky and go downwards to hit the prais, and as
       it hits each prai, look and pan and track from different angles for the most powerful cinematic effect. Be like a
       creative director."; "the way the naga circles around dont feel smooth enough ... it goes in weird boxy ways"; "show one
       part that zooms in on the naga head showing its eyes glow with energy and it lets out a naga sound, as it flies at high
       speed up into the air, before going down to hit the prais"). REBUILT as one film:
         THE STAGING IS FIXED (R64). It opens on the white of the press, and under it everyone is set at fixed marks: the two of
         them at the fight's own first places, facing the house; the tall shape over his student; the stick in his teacher's
         hand; the three's places fixed on an arc before them toward the house (FIGHT.NUM.laidAt). The fight's last stage
         begins from those same marks (c_fightrules.js, c_fightstage.js fsNagaGo), so nothing is seen to move.
         THE FLIGHT IS MADE OF CURVES MEANT TO BE SMOOTH (R69): out of the stick's head straight up, a widening spiral up over
         his teacher, one slow circle high over the court (above its walls) while he says his line, a stoop straight down
         onto the tall shape's head, a swoop round the west of the court, a long arc across the court's house side through the
         three, a climb into one wide ring round the whole court, a tightening spiral down, and INTO the stick's head (its
         body pours in after it): every piece sampled every 30 cm, each joined where its way meets the next (circles eased one
         into the next by their middles and their sizes, a cubic for the stoop and the swoop with its ends along the ways they
         join), and its pace a smooth function of how far it has flown, so it never turns a corner nor steps its speed.
         THE PICTURE (R63, R64, R70): from behind his teacher, low, facing the shape as he raises the stick and plants it; from
         the paving beside the stick as it bursts up out of its head; RIDING UP WITH ITS HEAD, below it and close, the night
         behind it, as its eyes kindle and it cries out; low behind his teacher looking up at it circling over the court while
         he says his line; down the stoop over its head; the shape bursting, from the court's east side; THE THREE PIERCES, each
         from its own side (beside the first as it goes through, head on at the second, from over the third), and at each A
         HIT: the moment held (the film's clock at a twelfth for 0.16 s), the screen flashed white-blue, shaken, the phone
         buzzed, a struck sound over the water and the hiss; the god's eye on its ring round the whole court; low by the stick
         as it spirals down and pours itself in, and the stick's head bursts with light: its guard kept, it goes home. Then
         Mr Koh at the doorway, and the fight's own picture again. */
    /* (R64: the film's fixed marks, in the court's frame (c_cast.js courtWorld): the two of them where the fight began
       (NUM.phoAt, NUM.zavAt), facing the house, and the three's places (NUM.laidAt): on an arc across the house side of the
       court, 1.89 m apart, each 2.4 m and more from his student and 3.2 from his teacher) */
    function nagaMarks5() {
      const F = fightStart(), n = (typeof FIGHT === 'object' && FIGHT.NUM) || {};
      const laid = n.laidAt && n.laidAt.length === 3 ? n.laidAt : [[-1.8, -1.12], [0, -1.7], [1.8, -1.12]];
      return { pho: { x: F.pho.x, z: F.pho.z, ry: COURT5.heading + Math.PI }, zav: { x: F.zav.x, z: F.zav.z }, spots: laid.map(q => q.slice()),
               spotsW: laid.map(q => courtWorld(q[0], q[1])), za: n.zavAt || [0, 0.7], pa: n.phoAt || [1.15, 2.0] };
    }
    /* (each pierce HELD: the film's story clock at a twelfth of its pace for 0.16 s of its real one) */
    /* (R122 idea 6, 25 Nov 2026, Chad: "slow motion as it pierces": each pierce in SLOW MOTION, the story clock's speed eased
       down to r and back up over H seconds of the real clock, never stepped (its speed 1 - (1 - r) sin^2 of the hold's own
       half turn): over d real seconds of it the story moves s(d) = d - (1 - r)(d/2 - H sin(2 pi d / H) / (4 pi)), H(1 + r)/2
       in all; the three holds never meet (the pierces stand 0.63 and 0.55 story seconds apart, a hold covers 0.52). z_tail.js
       TOG5_REAL is the same sum, checked against it every time the film plays) */
    const NAGA_HIT5 = { H: 0.9, r: 0.15 };
    const nagaS5 = (d) => { const { H, r } = NAGA_HIT5; return d - (1 - r) * (d / 2 - H * Math.sin(2 * Math.PI * d / H) / (4 * Math.PI)); };
    const nagaSInv5 = (s) => { let a = 0, b = NAGA_HIT5.H; for (let i = 0; i < 40; i++) { const m = 0.5 * (a + b); if (nagaS5(m) < s) a = m; else b = m; } return 0.5 * (a + b); };
    /* R122 idea 6 (25 Nov 2026, Chad: "Naga entrance like a summon"): THE NAGA'S NAME over the picture as it rides up.
       R126 (Chad: "Tone down the font design and look of the naga word", after R125: "The naga word looks very lame."): the
       painted gold lettering of builds 89 to 91 (engraved scales, a serpent flourish over painted water) is gone. The word is
       the game's own title face, Cormorant Garamond 600 as the chapter cards set it, in a pale ivory, widely spaced, with a
       faint warm glow and a hairline under it, drawn here on a canvas once the face has loaded (Georgia if it never does),
       its size fitted to the card from the word's own measure; made with the world, hidden, so the curtain waits for it and
       the warm uploads it before the film ever shows it (v14.15) */
    const TITLE5 = { sp: null };
    { const make = () => { if (!alive || TITLE5.sp) return;
        const [c, x] = canvas(1024, 256), word = [...'NAGA'], TRACK = 0.26, ivory = '#EADCB6';
        const face = (f) => { x.font = '600 ' + f.toFixed(1) + 'px "Cormorant Garamond", Georgia, serif'; };
        const across = (f) => word.reduce((q, ch) => q + x.measureText(ch).width, 0) + TRACK * f * (word.length - 1);
        face(100); const F = Math.min(150, 100 * 860 / Math.max(1, across(100))); face(F);
        const ws = word.map(ch => x.measureText(ch).width), wordW = across(F);
        const cap = x.measureText(word.join('')).actualBoundingBoxAscent || 0.63 * F, gap = 0.26 * F;
        const base = 128 - (cap + gap) / 2 + cap;
        const px = (1024 - wordW) / 2;
        /* (two passes of the same letters: a soft dark shadow, so the ivory still reads where it lies over the Naga's pale crest
           (build 92's pictures at 4.6 and 5.0 s), then the faint warm glow) */
        x.textBaseline = 'alphabetic'; x.fillStyle = ivory;
        for (const [shCol, shBlur] of [['rgba(2,6,18,0.62)', 18], ['rgba(255,226,170,0.32)', 12]]) {
          x.shadowColor = shCol; x.shadowBlur = shBlur; let qx = px;
          word.forEach((ch, i) => { x.fillText(ch, qx, base); qx += ws[i] + TRACK * F; });
        }
        x.shadowBlur = 0;
        const rw = wordW * 0.62, r0 = (1024 - rw) / 2, g = x.createLinearGradient(r0, 0, r0 + rw, 0);
        g.addColorStop(0, 'rgba(234,220,182,0)'); g.addColorStop(0.5, 'rgba(234,220,182,0.6)'); g.addColorStop(1, 'rgba(234,220,182,0)');
        x.fillStyle = g; x.fillRect(r0, Math.round(base + gap) - 1, rw, 2);
        const m = new THREE.SpriteMaterial({ map: tex(done(THREE, c, false)), transparent: true, depthWrite: false, depthTest: false, fog: false, toneMapped: false }); mats.push(m);
        const sp = new THREE.Sprite(m); sp.renderOrder = 9; sp.visible = false; sp.frustumCulled = false; sp.userData.ar = 1024 / 256; sp.userData.wf = wordW / 1024; world.add(sp); TITLE5.sp = sp; };
      parsePend++;
      const loaded = document.fonts && document.fonts.load ? document.fonts.load('600 132px "Cormorant Garamond"', 'NAGA').catch(() => null) : Promise.resolve(null);
      Promise.race([loaded, new Promise(r => setTimeout(r, 4000))]).then(make).catch(err => console.warn('R126: the NAGA title was not drawn (the film runs without it)', err))
        .finally(() => { setTimeout(() => { parsePend--; }, 0); });
    }
    const _ttP = new THREE.Vector3(), _ttF = new THREE.Vector3(), _ttU = new THREE.Vector3(), _ttQ5 = new THREE.Quaternion();
    /* (where the stick, planted, carries the Naga's way out: the top of its carved head, in its own frame, read from its file:
       the head's slices at 1.30 to 1.35 m up it stand 0.09 to 0.15 m to its -x) */
    const STICK_HEAD5 = [-0.11, 1.36, 0];
    FILMS5.together = {
      three: null, spots: null,
      /* ---- THE FLIGHT AND ITS CLOCK, made once a run (the staging is fixed, so it is the same in every run) */
      build() {
        if (this.B) return this.B;
        const M = nagaMarks5(), pz = M.pho, cwp = (q) => [COURT5.x - q[0], q[1], COURT5.z - q[2]];
        /* the stick, planted at his front right (as his cast brings it down: 0.38 m before him and 0.40 to his right), turned
           as the planted hold turns it; its carved head's top, in the court's frame */
        const fx = Math.sin(pz.ry), fz = Math.cos(pz.ry), sx = pz.x + fx * 0.38 - fz * 0.40, sz = pz.z + fz * 0.38 + fx * 0.40;
        const yw = (typeof PHOGRIP5 === 'object' && PHOGRIP5.plantYaw) ? PHOGRIP5.plantYaw(pz.ry) : pz.ry, cy = Math.cos(yw), sy = Math.sin(yw);
        const hx = sx + STICK_HEAD5[0] * cy + STICK_HEAD5[2] * sy, hz = sz - STICK_HEAD5[0] * sy + STICK_HEAD5[2] * cy;
        const S = [COURT5.x - hx, STICK_HEAD5[1], COURT5.z - hz];
        const Z = { x: M.za[0], z: M.za[1] }, sp = M.spots;
        const P = [], NM = {};
        const add = (q, nm) => { const L = P[P.length - 1]; if (!(L && Math.hypot(q[0] - L[0], q[1] - L[1], q[2] - L[2]) < 0.04)) P.push(q); if (nm) NM[nm] = P.length - 1; };
        const run = (f, len, nm0, nm1) => { const k = Math.max(2, Math.ceil(len / 0.3)); for (let i = 0; i <= k; i++) add(f(i / k), i === 0 ? nm0 : i === k ? nm1 : null); };
        const bez = (a, b, c, d) => (t) => { const u = 1 - t; return [0, 1, 2].map(k => u * u * u * a[k] + 3 * u * u * t * b[k] + 3 * u * t * t * c[k] + t * t * t * d[k]); };
        const lenOf = (f) => { let L = 0, p = f(0); for (let i = 1; i <= 64; i++) { const q = f(i / 64); L += Math.hypot(q[0] - p[0], q[1] - p[1], q[2] - p[2]); p = q; } return L; };
        const circ = (c, r, a, y) => [c.x + r * Math.sin(a), y, c.z + r * Math.cos(a)];        // (its way round: the angle falling, as everywhere here)
        const D2R = Math.PI / 180, sm = (u) => u * u * (3 - 2 * u);
        /* 1. OUT OF THE STICK'S HEAD, straight up 0.55 m, then A WIDENING SPIRAL round a line over his teacher (between him and the
           stick), a turn and a half, 0.45 m out at the start to 1.6 at the top, rising from 1.9 to 9.5 m (over the court's walls,
           8.85), level at its top; its turning begins from nothing, so it leaves the straight rise without a corner */
        const HA = { x: 1.35, z: 1.95 }, r0 = Math.hypot(S[0] - HA.x, S[2] - HA.z), a0 = Math.atan2(S[0] - HA.x, S[2] - HA.z), y0 = S[1] + 0.55, TURN = 3 * Math.PI;
        add(S, 's0'); add([S[0], S[1] + 0.55, S[2]], 'out');
        const helix = (u) => { const a = a0 - TURN * Math.pow(u, 1.5), r = r0 + (1.6 - r0) * u * u, y = y0 + (9.5 - y0) * (1 - (1 - u) * (1 - u)); return circ(HA, r, a, y); };
        run(helix, 16, null, 'top0'); NM.helixMid = NM.out + ((NM.top0 - NM.out) >> 1);
        /* 2. THE HIGH CIRCLE over the court (centre (1.0, -0.6), 2.2 m round, at 9.5 m), eased in from the spiral's top by its
           middle and its size over its first 120 degrees, round to its gate side, where its way is straight across the court */
        const a1 = a0 - TURN, TC = { x: 1.0, z: -0.6 }; let aE = 0; while (aE > a1) aE -= 2 * Math.PI;    // (the gate side, past the spiral's top)
        const top = (u) => { const a = a1 + (aE - a1) * u, k = sm(Math.min(1, (a1 - a) / (120 * D2R))); return circ({ x: HA.x + (TC.x - HA.x) * k, z: HA.z + (TC.z - HA.z) * k }, 1.6 + 0.6 * k, a, 9.5 + 0.15 * Math.sin(u * Math.PI)); };
        run(top, (a1 - aE) * 2.0, null, 'top1');
        /* 3. THE STOOP: over, and straight down onto the tall shape (its head through the shape's head at 2.6 m, over his
           student), pulled out level toward the west (a cubic each, its ends along the ways it joins) */
        const E = top(1), V = [Z.x + 0.4, 3.7, Z.z + 0.04], A = [Z.x - 0.3, 2.65, Z.z + 0.02];
        run(bez(E, [E[0] - 0.55, E[1], E[2]], [V[0], V[1] + 1.6, V[2]], V), lenOf(bez(E, [E[0] - 0.55, E[1], E[2]], [V[0], V[1] + 1.6, V[2]], V)), null, 'V');
        const st2 = bez(V, [V[0], V[1] - 0.6, V[2]], [A[0] + 0.5, A[1] + 0.03, A[2]], A); run(st2, lenOf(st2), null, 'A');
        /* 4. THE SWOOP round the west of the court (above his cage's bars, 2.05 m, until it is out past them) and down to the
           arc's start, low, its way along the arc */
        const RC = { x: Z.x, z: Z.z + 0.7 }, RR = Math.hypot(sp[1][0] - RC.x, sp[1][1] - RC.z);   // (the arc's circle: through the middle place)
        const phiOf = (q) => { const a = Math.atan2(q[0] - RC.x, q[1] - RC.z); return a < 0 ? a + 2 * Math.PI : a; };   // (0 to a full turn: the arc runs from 250 degrees down to 130)
        let aW = phiOf(sp[0]) + 34.5 * D2R; const W = circ(RC, RR, aW, 0.62), dW = [-Math.cos(aW), 0, Math.sin(aW)];
        /* (its first control 2.75 m up: where it crosses his cage's ring, 1.35 m out, its leading line stands 2.37 m up and its
           body's underside over the bars' 2.05) */
        const sw = bez(A, [A[0] - 1.4, 2.75, A[2]], [W[0] - dW[0] * 1.1, 0.62, W[2] - dW[2] * 1.1], W); run(sw, lenOf(sw), null, 'W');
        /* 5. THE ARC THROUGH THE THREE, low (its body's line 0.62 m up, its face through each one's chest), its face 0.95 m
           ahead of its leading point: each pierce is named where the leading point is 0.95 m short of its place */
        const LEAD = 0.95 / RR, a3e = phiOf(sp[2]) - 14.5 * D2R;
        const arc = (u) => circ(RC, RR, aW + (a3e - aW) * u, 0.62);
        run(arc, (aW - a3e) * RR, null, 'arcEnd');
        const nearA = (a) => { let best = -1, bd = 1e9; for (let i = NM.W; i <= NM.arcEnd; i++) { const d = Math.abs(phiOf([P[i][0], P[i][2]]) - a); if (d < bd) { bd = d; best = i; } } return best; };
        NM.p1 = nearA(phiOf(sp[0]) + LEAD); NM.p2 = nearA(phiOf(sp[1]) + LEAD); NM.p3 = nearA(phiOf(sp[2]) + LEAD);
        /* 6. UP INTO ONE WIDE RING round the whole court (centre (0.2, 2.2), 2.95 m round, at 4.5 m), eased in from the arc by its
           middle, its size and its height over 80 degrees, once round */
        const GC = { x: 0.2, z: 2.2 }, aR0 = a3e, aR1 = aR0 - 80 * D2R;
        const climb = (u) => { const k = sm(u), a = aR0 + (aR1 - aR0) * u; return circ({ x: RC.x + (GC.x - RC.x) * k, z: RC.z + (GC.z - RC.z) * k }, RR + (2.95 - RR) * k, a, 0.62 + (4.5 - 0.62) * k); };
        run(climb, 80 * D2R * 3.0 + 3.0, null, 'ringIn');
        const ring = (u) => circ(GC, 2.95, aR1 - 2 * Math.PI * u, 4.5 + 0.12 * Math.sin(u * 2 * Math.PI));
        run(ring, 2 * Math.PI * 2.95, null, 'ringOut');
        /* 7. HOME: a tightening spiral down round the stick's head (its middle drawn from the ring's to the stick's, its size to
           nothing, a turn and a quarter), arriving straight down, and into the stick's head; then on down inside it, its body
           pouring in after it */
        const aH0 = aR1 - 2 * Math.PI, HC = { x: S[0], z: S[2] };
        const spiral = (u) => { const k = sm(u), a = aH0 - 2.5 * Math.PI * u, r = 2.95 * Math.pow(1 - u, 1.5); return circ({ x: GC.x + (HC.x - GC.x) * k, z: GC.z + (HC.z - GC.z) * k }, r, a, 4.5 - (4.5 - (S[1] + 0.6)) * u); };
        run(spiral, 15, null, 'down');
        add([S[0], S[1], S[2]], 'home');
        for (let i = 1; i <= 24; i++) add([S[0], S[1] - i, S[2]], i === 24 ? 'end' : null);
        /* ---- ITS PACE, metres a second at the named places and eased between them by distance; its moment at every point is
           the distance over that pace, from its rise (the high circle's pace is its own: long enough for his line) */
        const cum = [0]; for (let i = 1; i < P.length; i++) cum.push(cum[i - 1] + Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1], P[i][2] - P[i - 1][2]));
        const vTop = (cum[NM.top1] - cum[NM.top0]) / 3.55;
        const KN = [['s0', 1.2], ['out', 5], ['helixMid', 9.5], ['top0', vTop], ['top1', vTop], ['V', 14], ['A', 12], ['W', 5], ['p1', 3.4], ['p2', 3.2], ['p3', 3.2],
                    ['arcEnd', 6], ['ringIn', 8.5], ['ringOut', 8.5], ['down', 10.5], ['home', 11], ['end', 11]].map(([k, v]) => [cum[NM[k]], v]);
        const vAt = (s) => { let j = 0; while (j < KN.length - 2 && s > KN[j + 1][0]) j++; const [s0, v0] = KN[j], [s1, v1] = KN[j + 1]; return v0 + (v1 - v0) * Math.max(0, Math.min(1, (s - s0) / Math.max(1e-6, s1 - s0))); };
        /* (R122 idea 6: the rise 1.4 s later, was 2.0: the summon's darkening first, the stick raised and planted in it) */
        const RISE = 3.4, tm = [RISE];
        for (let i = 1; i < P.length; i++) { const v = 0.5 * (vAt(cum[i - 1]) + vAt(cum[i])); tm.push(tm[i - 1] + (cum[i] - cum[i - 1]) / Math.max(0.2, v)); }
        /* the timing keys: every third point, and every named one */
        const keys = []; for (let i = 0; i < P.length; i++) if (i % 3 === 0 || Object.values(NM).includes(i) || i === P.length - 1) keys.push([tm[i], i]);
        /* the tall shape bursts as its face (0.95 m ahead of the leading point, its head riding over its line) passes over the
           shape's head, where the stoop pulls out over him */
        let iA = NM.V; { let bd = 1e9; for (let i = NM.V; i <= NM.W; i++) { let j = i; while (j < P.length - 1 && cum[j] - cum[i] < 0.95) j++; const d = Math.hypot(P[j][0] - Z.x, P[j][2] - Z.z); if (d < bd) { bd = d; iA = i; } } }
        const T = { plant: 1.6, rise: RISE, kindle: RISE + 0.55, cry: RISE + 0.75, top: tm[NM.top0], ph5c2: tm[NM.top0] + 0.12, stoop: tm[NM.top1], apart: tm[iA],
                    swoop: tm[NM.A], p1: tm[NM.p1], p2: tm[NM.p2], p3: tm[NM.p3], climb: tm[NM.arcEnd], ring: tm[NM.ringIn], ringOut: tm[NM.ringOut], home: tm[NM.home],
                    tail: tm[NM.home] + (NAGA5.bodyLen || 22) / 11 };
        /* (R122 idea 6: the stick strikes the paving 1.65 s into his cast; the gold NAGA as it rides up with its head) */
        T.strike = T.plant + 1.65; T.title = RISE + 0.75;
        T.low = T.p3 + 1.6; T.ko5c2 = T.tail + 2.6; T.back = T.ko5c2 + ((typeof SECS === 'object' && SECS.ko5c2) || 2.6) + 0.45; T.end = T.back + 1.6;
        this.B = { pts: P.map(cwp), keys, NM, T, S: cwp(S), Sc: S, M, RC, RR, GC, HA, spots: sp, spotsW: M.spotsW, foot: [sx, 0, sz],
                   dirAt: (i) => { const a = P[Math.max(0, i - 1)], b = P[Math.min(P.length - 1, i + 1)]; const d = [-(b[0] - a[0]), 0, -(b[2] - a[2])], l = Math.hypot(d[0], d[2]) || 1; return [d[0] / l, 0, d[2] / l]; } };
        return this.B;
      },
      /* the story clock against the real one: marks and the flight are in story seconds; a cue is laid at real ones */
      /* (build 90: each slow is CENTRED on its hit, slowest as the head goes through her. Build 89 began it at the hit, so its
         slowest came a quarter second of the story after, at or past the cut, on the next one's approach) */
      tl() { return this.build().T; },
      real(tau) { const T = this.tl(), H = NAGA_HIT5.H, SH = nagaS5(H); let add = 0;
        for (const p of [T.p1, T.p2, T.p3]) { const s0 = p - SH / 2; if (tau <= s0) break; const d = tau - s0; if (d < SH) return s0 + add + nagaSInv5(d); add += H - SH; } return tau + add; },
      story(t) { const T = this.tl(), H = NAGA_HIT5.H, SH = nagaS5(H); let sub = 0;
        for (const p of [T.p1, T.p2, T.p3]) { const s0 = p - SH / 2, h = s0 + sub; if (t <= h) break; const d = t - h; if (d < H) return s0 + nagaS5(d); sub += H - SH; } return t - sub; },
      begin(api, s) {
        FM5.once = new Set(); FM5.lit = ''; FM5.s = s;
        if (api && api.handsRoot) api.handsRoot.visible = false;
        const L = this.three && this.three.length === 3 ? this.three : PRAI5.list.map((P, i) => i).filter(i => PRAI5.list[i].group.visible).slice(-3);
        this.L = L.length === 3 ? L : [6, 7, 8];
        const B = this.build(); this.pho = B.M.pho; this.zav = B.M.zav; this.W = B.spotsW;
        this.planned = false; this.eyes = null;
        PRAI5.look('trance');
      },
      /* ITS LIGHT AT THE END: a burst of white and blue out of the stick's head as the last of it goes in (painted light, one
         card, drawn over all at its depth) */
      burst(t, T, at) {
        if (!this.bs) { const [c, x] = canvas(128, 128), gd = x.createRadialGradient(64, 64, 2, 64, 64, 63);
          gd.addColorStop(0, 'rgba(255,255,255,1)'); gd.addColorStop(0.25, 'rgba(190,240,255,0.85)'); gd.addColorStop(0.6, 'rgba(70,170,255,0.25)'); gd.addColorStop(1, 'rgba(40,120,255,0)');
          x.fillStyle = gd; x.fillRect(0, 0, 128, 128);
          const m = new THREE.SpriteMaterial({ map: tex(done(THREE, c, false)), transparent: true, depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending, fog: false, toneMapped: false }); mats.push(m);
          this.bs = new THREE.Sprite(m); this.bs.renderOrder = 4.5; this.bs.visible = false; world.add(this.bs); }
        const u = t - T.tail;
        if (u < -0.05 || u > 1.4) { this.bs.visible = false; return; }
        const k = u < 0 ? 0 : u < 0.12 ? u / 0.12 : Math.pow(1 - (u - 0.12) / 1.28, 2);
        this.bs.visible = k > 0.003; this.bs.position.set(at[0], at[1] + 0.05, at[2]); this.bs.scale.setScalar(0.4 + 3.2 * Math.sqrt(Math.max(0, u)));
        this.bs.material.opacity = Math.min(1, k);
      },
      frame(t) {
        const T = this.tl(), B = this.build(), tau = this.story(t), pz = this.pho, zz = this.zav, F = fightStart();
        /* (R75's debug, V9: its lamps' curve laid after TRANCE5.set, below, which set them back to 0.15 every frame) */
        fmLook('TRANCE'); const lampK = 0.15 + 0.25 * smo(c01((tau - T.rise) / 2)) + 0.6 * Math.max(0, 1 - Math.abs(tau - T.tail - 0.1) / 0.6);
        /* the court low under the trance; the smell of the tall shape until it comes apart */
        fmBeds({ court: 0.22, sour: 0.3 * (1 - smo(c01((tau - T.apart) / 2.5))) });
        /* the stick planted where his cast brings it down (B.S: its carved head) */
        const fx = Math.sin(pz.ry), fz = Math.cos(pz.ry), sx = pz.x + fx * 0.38 - fz * 0.40, sz = pz.z + fz * 0.38 + fx * 0.40;
        /* THE NAGA: its flight laid at this moment (first in the frame: every look and lens aims where this lays it) */
        if (!this.planned) { this.planned = true; NAGA5.plan({ stick: B.S, pts: B.pts, keys: B.keys, restSecs: 0, home: B.NM.home });
          const W = this.W; SPLASH5.set([T.p1, T.p2, T.p3].map((t0, j) => ({ t0, p: [W[j].x, 1.15, W[j].z], d: B.dirAt(B.NM['p' + (j + 1)]) })));
          SPLASH5.ring({ t0: T.strike, p: [sx, 0.04, sz], r: 0.5 }); }                // (R122 idea 6: the water rising round it as it strikes)
        const aN = smo(c01((tau - T.rise) / 0.5)) * (tau < T.tail + 0.05 ? 1 : 0);
        NAGA5.light(pz.x, 1.35, pz.z, 1); NAGA5.fly(tau, aN);
        /* ITS EYES (R70): kindled as it climbs (a swell past full as it cries), bright from then, flaring at each pierce */
        const flare = [T.p1, T.p2, T.p3, T.apart].reduce((m, p) => Math.max(m, Math.max(0, 1 - Math.abs(tau - p) / 0.35)), 0);
        const eyeK = smo(c01((tau - T.kindle) / 0.45)) * (1 + 0.7 * Math.max(0, 1 - Math.abs(tau - T.cry - 0.35) / 0.8)) + 0.6 * flare;
        NAGA5.eyeFrame(tau, eyeK);
        SPLASH5.frame(tau);
        this.burst(tau, T, B.S);
        const HEADAT = () => NAGA5.headAt() || [B.S[0], B.S[1], B.S[2]];
        whenReady(cast.pho, (P) => { put(P, pz.x, pz.z, pz.ry);
          /* (HELD ON THE STRIKE: his cast plays to the moment the stick strikes the paving (1.7 s of it) and all but stops there,
             his hand on the stick as the Naga rises out of it; then he is handed to his rest over 0.9 s) */
          const r = restOf5('pho', tau), out = smo(c01((tau - T.plant - 3.6) / 0.9)), ct = Math.max(0, tau - T.plant), cth = ct < 1.7 ? ct : 1.7 + (ct - 1.7) * 0.05;
          /* (R122: under the summon's darkening he stands at his rest, and goes into his cast over its last half second) */
          const pre = tau < T.plant ? 1 - smo(c01((tau - T.plant + 0.5) / 0.5)) : 0, wr = Math.max(out, pre);
          if (wr < 1) pose(P, 'Charged_Spell_Cast_1', cth, false, r[0], wr, r[1]); else fmRest(P, 'pho', tau);
          /* (R75's debug, V3: and back in his hand under the cut to the door (Mr Koh's line), so the film's last shot, the
             fight's own lens, and the last stage after it find it where his walk and his bag need it: it stood planted on
             the court through the whole last stage, and jumped into his hand on the bag-tied film's first frame) */
          if (tau < T.plant + 1.7 || tau >= T.ko5c2) STICK5.to('pho'); else STICK5.plant(sx, sz, pz.ry);
          /* (home: his eyes on the stick's head as the head goes in and its body pours after it; following the head on into
             the stick he looked at the lens, the lab's picture of the new home shot) */
          fmGaze(P, tau, [[0, B.S], [T.rise + 0.2, HEADAT], [T.home - 0.3, B.S], [T.tail + 1.2, [zz.x, 1.5, zz.z]]], 0.6, 0.7, 0.03, 0.8); });
        whenReady(cast.zav, (P) => { fmShow(P, true); put(P, zz.x, zz.z, COURT5.heading + Math.PI); const rt = zavRest(); if (rt) pose(P, rt, 2 + tau * 0.35, true); else pose(P, 'Walking', ZAV_STAND5); });
        /* the cage: cracked under the shape, whole again once it has come apart */
        const kc = tau < T.apart ? 0.55 : 0.55 + 0.45 * smo(c01((tau - T.apart - 0.4) / 2.0));
        CAGE5.set({ k: kc, x: zz.x, z: zz.z, t: tau, crack: tau < T.apart + 0.4 });
        TRANCE5.set(1, tau); TRANCE5.pools(zz, pz, 1, 1); TRANCE5.gold(1); courtLamps(lampK);
        /* THE THREE: the tall shape over him, leaning in; as the Naga stoops through it, it bursts and each is flung onto its
           place on the arc, landing burning; each struggles there until the Naga's head goes through it (struck, its fire out
           in steam, cool and dark and wet), then sinks low where the fight's last stage finds it */
        const tp = [T.p1, T.p2, T.p3], Wsp = this.W || F.laid;
        this.L.forEach((idx, j) => { const P = PRAI5.list[idx]; if (!P) return; whenReady(P, () => { fmShow(P, true);
          const kA = smo(c01((tau - T.apart - 0.05 - j * 0.1) / 0.85)), hop = Math.sin(Math.PI * kA) * 1.3 * (1 - kA * 0.2);
          const ox = [-0.18, 0.2, 0.0][j], oz = [0.25, 0.22, 0.45][j], to = Wsp[j] || { x: zz.x, z: zz.z };
          const x = lp(zz.x + ox, to.x, kA), z = lp(zz.z + oz, to.z, kA), sc = lp(1.55, 1.0, kA);
          const hit = tau - tp[j], kL = smo(c01((tau - T.low - j * 0.15) / 1.4));
          const d = B.dirAt(B.NM['p' + (j + 1)]);
          /* (R75's debug, B5: turned from the shape's middle to its laid heading over the last fifth of its flight, where it
             had turned 63 to 82 degrees in one frame as it landed, under the pierce's own shot) */
          { const hA = faceTo(x, z, zz.x, zz.z), hB = faceTo(to.x, to.z, to.x - d[0], to.z - d[2]), kh = smo(c01((kA - 0.8) / 0.2));
            put(P, x, z, hA + angTo(hA, hB) * kh); }
          P.group.position.y = hop * (kA < 1 ? 1 : 0);
          P.group.scale.setScalar(sc * (1 - 0.45 * kL)); P.group.rotation.x = lp(-0.35, 0, kA) + 0.55 * kL;
          if (hit >= 0 && hit < 1.6) pose(P, 'Hit_Reaction', 0.05 + hit * 0.85, false); else pose(P, hit >= 1.6 ? 'Idle_3' : 'Electrocution_Reaction', 2 + j * 0.7 + tau * 0.6, true);
          PRAI5.burn(P, 1 - smo(c01((hit - 0.02) / 0.5)));
          PRAI5.cool(P, smo(c01((hit - 0.06) / 0.8)));
          PRAI5.alpha(P, 1 - 0.35 * kL); }); });
        PRAI5.tick(0.016);
        /* Mr Koh, at the doorway behind the thread, at its end */
        /* (R76's limbs check: talking with his hands open, a step behind the two in his doorway, his hands went into Ton's thigh
           and Jun's arm (7 cm); his chatting take keeps them nearer him) */
        whenReady(cast.koh, (P) => { const s0 = STATION.fight.koh; put(P, s0.x, s0.z, s0.ry); fmTalk(P, 'koh', tau, T.ko5c2, SECS.ko5c2 || 2.6, 'Stand_and_Chat'); });
        /* (R75's debug: Ton and Jun held by the film's clock at their places in the doorway, as the films before and after it
           hold them: under it they ran on their own clocks, which a seek cannot lay, and the look laid on Ton below was
           undone by his own take before he was drawn, photographed: he still faced the lens) */
        whenReady(cast.ton, (P) => { const s0 = STATION.fight.ton; put(P, s0.x, s0.z, s0.ry); fmRest(P, 'ton', tau); });
        whenReady(cast.jun, (P) => { const s0 = STATION.fight.jun; put(P, s0.x, s0.z, s0.ry); fmRest(P, 'jun', tau); });
        /* (R75's debug: as he speaks, Mr Koh looks out to his teacher and the stick that burst with light, and Ton turns to Mr Koh,
           each carried over 0.6 s: neither film had directed them, so through the line Ton stared into the lens, smiling, and
           Mr Koh spoke to the floor at his left) */
        { const kl = smo(c01((tau - T.ko5c2 + 0.6) / 0.6));
          /* (his look held at 0.95 within 0.9 rad: at 0.75 within 0.7 his talking take swung his face away left as he spoke,
             behind the doorway's jamb from the lens, photographed at 22.5 s) */
          if (kl > 0.001) { whenReady(cast.koh, (P) => lookNow(P, fmHead(cast.pho, [pz.x, 1.5, pz.z]), 0.95 * kl, 0.9));
            whenReady(cast.ton, (P) => lookNow(P, fmHead(cast.koh, [STATION.fight.koh.x, 1.45, STATION.fight.koh.z]), kl, 0.95)); } }
        /* (R75's debug, build 62: Ton's turn to Mr Koh aimed at his eyes, 1.45 m, and carried 54 degrees: aimed at 1.6 m, 18 cm
           over Mr Koh's head, and held to 36, he turned his chin up and away into the room, read on a phone as gazing at the
           ceiling, measured by the films probe's face angle at 22.5 s) */
        /* THE LENS (its keys in story seconds: a held pierce holds the picture with it) */
        this.lens(tau, T, B, HEADAT);
        /* THE SHAKE: each pierce, the shape's burst and the last burst at the stick, on the real clock (a held moment still
           shakes): a few sines of their own, falling away over half a second */
        const hitsR = [[this.real(T.apart), 0.016], [this.real(T.p1), 0.03], [this.real(T.p2), 0.034], [this.real(T.p3), 0.042], [this.real(T.tail), 0.03]];
        let sh = 0; for (const [h, a] of hitsR) { const u = t - h; if (u >= 0 && u < 0.6) sh += a * Math.pow(1 - u / 0.6, 2); }
        if (sh > 1e-5) { pitch.rotation.x += sh * Math.sin(t * 71.0); yaw.rotation.y += sh * 0.8 * Math.sin(t * 53.0 + 1.3); camera.rotation.z += sh * 0.6 * Math.sin(t * 61.0 + 2.1); }
        /* (R122 idea 6: the bars drawn in as the court darkens, and given back once the title has gone: kit.bars, the
           seventy-ninth seam, a smooth function of the clock; then the gold NAGA over the picture) */
        if (kit && kit.bars) kit.bars(smo(c01((tau - 0.8) / 0.8)) * (1 - smo(c01((tau - T.title - 1.55) / 0.6))));
        this.title(tau, T);
      },
      /* THE NAGA'S NAME (R122 idea 6; R126: toned down): faded in over 0.4 s as it settles from a little larger, held, and
         gone by 1.5 s; in front of the lens at two metres, a fifth of the picture's height above its middle (the night behind
         the climbing head), the WORD itself (its card's share, wf) 0.55 of a phone's picture wide and never wider than half
         the picture's height (a desktop's: about 0.28 of its width); level on the screen whatever the lens's roll */
      title(tau, T) {
        const S = TITLE5.sp; if (!S) return;
        const u = tau - T.title;
        if (!(u >= 0 && u < 1.5)) { if (S.visible) S.visible = false; return; }
        const kin = smo(c01(u / 0.4)), kout = 1 - smo(c01((u - 1.1) / 0.4)), d = 2.0;
        camera.updateMatrixWorld(true);
        camera.getWorldPosition(_ttP); camera.getWorldDirection(_ttF); _ttU.set(0, 1, 0).applyQuaternion(camera.getWorldQuaternion(_ttQ5));
        const vh = 2 * d * Math.tan(camera.fov * Math.PI / 360), vw = vh * camera.aspect, ar = S.userData.ar || 2.3;
        const w = Math.min(vw * 0.55, vh * 0.5) / (S.userData.wf || 0.84) * (1.06 - 0.06 * kin + 0.02 * c01(u / 1.5));
        S.position.copy(_ttP).addScaledVector(_ttF, d).addScaledVector(_ttU, vh * 0.2);
        S.scale.set(w, w / ar, 1); S.material.opacity = kin * kout; S.material.rotation = 0; S.visible = true;
      },
      /* THE LENS, shot by shot (R63, R64, R70). Every place a lens stands is in the court (0.35 m in from its walls and the
         house), clear of everyone standing and of every point the Naga flies through during its shot (the lab's pictures and
         tools/probes/framecheck.mjs measure each on a phone and a desk) */
      lens(tau, T, B, HEADAT) {
        const cw = (x, y, z) => [COURT5.x - x, y, COURT5.z - z], Pc = B.M.pa, Sc = B.Sc, sp = B.spots;
        const F12 = new Float32Array(12);
        /* the ride (R70): close below its head on the spiral's inside, a little ahead, looking up into its face with the night
           behind it; the lens a smooth function of its frame, so it climbs and turns with it */
        const RIDE = () => { const f = NAGA5.pose(tau, F12); if (!f) return cw(Sc[0] + 0.9, 1.0, Sc[2]);
          const hx = COURT5.x - B.HA.x, hz = COURT5.z - B.HA.z; let ix = hx - f[0], iz = hz - f[2]; const il = Math.hypot(ix, iz) || 1; ix /= il; iz /= il;
          return [f[0] + ix * 1.05 + f[3] * 0.55, f[1] - 0.85, f[2] + iz * 1.05 + f[5] * 0.55]; };
        /* the stoop: over its head, behind it, looking down its way */
        const RIDER = () => { const f = NAGA5.pose(tau, F12); if (!f) return HEADAT(); return [f[0] - f[3] * 2.1 + f[6] * 0.55, f[1] - f[4] * 2.1 + f[7] * 0.55 + 0.25, f[2] - f[5] * 2.1 + f[8] * 0.55]; };
        const AHEAD = () => { const f = NAGA5.pose(tau, F12); if (!f) return HEADAT(); return [f[0] + f[3] * 4.0, f[1] + f[4] * 4.0, f[2] + f[5] * 4.0]; };
        const PHO_BACK = cw(Pc[0] + 0.85, 0.95, Pc[1] + 2.0), PHO_HEAD = cw(Pc[0], 1.7, Pc[1]), SHAPE = cw(B.M.za[0], 2.1, B.M.za[1]);
        /* (R122 idea 6: the summon opens wider and further back behind the two of them, the tall shape over his student, and
           pushes in on his teacher's back through the darkening as he raises the stick) */
        const PHO_WIDE = cw(Pc[0] + 1.15, 1.2, Pc[1] + 2.9);
        const UPTO = () => { const h = HEADAT(); return lp3(PHO_HEAD, h, 0.72); };
        const STICK_LOW = cw(Sc[0] + 1.05, 0.38, Sc[2] + 0.35);
        /* (build 91: THE STRIKE SEEN. R122's water rising round the stick was under every frame in build 90: at the strike the
           lens was at his shoulder at his head's height, and the paving's lens came in after it looking up above the drops.
           The paving's lens now comes in a tenth before the strike, on the stick's foot and the ring of water thrown up round
           it, and tilts up the stick in one move into the Naga's eruption and on to its head) */
        const STICK_FOOT = [B.foot[0], 0.42, B.foot[2]];
        const GOD = cw(B.GC.x, 16.0, B.GC.z - 0.2), GODAT = cw(B.GC.x, 0, B.GC.z - 0.4);
        const THREE_EYE = cw(-1.6, 4.4, 2.6), THREE_AT = cw(0, 0.35, -1.35);
        /* (R75's debug, V7: the three laid held 1.55 s, was 0.25, Mr Koh's line 1.1 s later for it; a phone's frame holds two of
           the three across 3.6 m at once, so its lens goes from the first two to the last two: a desktop's holds all three) */
        /* (and from 4.4 m up, behind his left shoulder: from 3.0 m the pan's end looked through his head at the third of them, his
           head and back in the middle of a phone's frame; from here he stands below the three on both shapes and out of a
           phone's first frame, measured by tools/probes/threeaim.mjs) */
        /* (B 0.65 m, was 1.0: photographed on a phone, the middle one by the door stood half out of its left edge at 1.0) */
        const THREE_A = cw(-1.0, 0.35, -1.45), THREE_B = cw(0.65, 0.35, -1.35);
        const BURST_EYE = cw(2.95, 1.05, 2.75), BURST_AT = cw(B.M.za[0] - 0.4, 1.4, B.M.za[1] - 0.3), SWOOP_AT = cw(-1.8, 0.9, 0.2);
        const B0 = boomAt({ x: this.pho.x, z: this.pho.z }, PULL5);
        /* (R75's lab, 23 Nov, each candidate photographed full size on a phone before it was written here: the three pierces
           were each from too close or through another body (the first from 1.45 m behind her back, its head cut at the
           frame's foot; the second with the third one in front of the lens; the third from over her, where the head seemed
           to pass beside her), and home looked up from under the stick with his teacher cut at the frame's edge. Now: the
           FIRST HEAD ON, the lens 1.6 m on along its way past her and 0.45 m out toward the house, low, so the head comes
           through her straight at it; the SECOND from a crane over the court's middle, her whole and the head coming in at
           her chest, the doorway behind; the THIRD from the paving before her, looking up past her at the head and then
           with it as it climbs away, the block's walkways and the night behind; HOME from before his teacher, him and the
           stick whole and the coil coming down out of the sky into its head) */
        const a0 = Math.atan2(sp[0][0] - B.RC.x, sp[0][1] - B.RC.z), d0 = [-Math.cos(a0), Math.sin(a0)], o0 = [Math.sin(a0), Math.cos(a0)];
        const P1EYE = cw(sp[0][0] + d0[0] * 1.6 + o0[0] * 0.45, 1.1, sp[0][1] + d0[1] * 1.6 + o0[1] * 0.45);
        const chestOf = (j) => cw(sp[j][0], 1.05, sp[j][1]);
        const P1AT = () => lp3(chestOf(0), HEADAT(), 0.25), P2AT = () => lp3(chestOf(1), HEADAT(), 0.3), P3AT = () => lp3(chestOf(2), HEADAT(), 0.2);
        const P2CRANE = cw(sp[1][0] - 1.3, 3.4, sp[1][1] + 1.9), P3LOW = cw(sp[2][0] - 0.15, 0.35, sp[2][1] - 1.34);
        const HOME_EYE = cw(Pc[0] + 0.75, 1.25, Pc[1] - 2.3), HOME_UP = cw(Pc[0] + 0.2, 2.6, Pc[1] - 0.2), HOME_AT = cw(Pc[0] + 0.23, 1.45, Pc[1] - 0.2);
        fmTrack(tau, [
          { t: 0, name: 'plant', eye: PHO_WIDE, at: lp3(PHO_HEAD, SHAPE, 0.5), fp: 66, fd: 56 },
          { t: T.strike - 0.11, name: 'plant', eye: lp3(PHO_BACK, PHO_HEAD, 0.12), at: lp3(PHO_HEAD, SHAPE, 0.4), fp: 60, fd: 50 },
          { t: T.strike - 0.1, name: 'erupt', eye: STICK_LOW, at: STICK_FOOT, fp: 74, fd: 64, cut: true },
          { t: T.strike + 0.03, name: 'erupt', eye: STICK_LOW, at: STICK_FOOT, fp: 74, fd: 64 },
          { t: T.rise + 0.55, name: 'erupt', eye: STICK_LOW, at: HEADAT, fp: 76, fd: 66 },
          { t: T.rise + 0.6, name: 'ride', eye: RIDE, at: HEADAT, fp: 58, fd: 50, cut: true },
          { t: T.top + 0.15, name: 'ride', eye: RIDE, at: HEADAT, fp: 58, fd: 50 },
          { t: T.top + 0.2, name: 'top', eye: PHO_BACK, at: UPTO, fp: 78, fd: 66, cut: true },
          { t: T.stoop + 0.1, name: 'top', eye: PHO_BACK, at: UPTO, fp: 76, fd: 64 },
          { t: T.stoop + 0.15, name: 'stoop', eye: RIDER, at: AHEAD, fp: 64, fd: 56, cut: true },
          { t: T.apart - 0.08, name: 'stoop', eye: RIDER, at: AHEAD, fp: 64, fd: 56 },
          { t: T.apart - 0.07, name: 'burst', eye: BURST_EYE, at: BURST_AT, fp: 66, fd: 56, cut: true },
          { t: T.p1 - 0.5, name: 'burst', eye: BURST_EYE, at: SWOOP_AT, fp: 64, fd: 54 },
          { t: T.p1 - 0.45, name: 'pierce1', eye: P1EYE, at: P1AT, fp: 62, fd: 54, cut: true },
          { t: T.p2 - 0.36, name: 'pierce1', eye: P1EYE, at: P1AT, fp: 62, fd: 54 },
          { t: T.p2 - 0.35, name: 'pierce2', eye: P2CRANE, at: P2AT, fp: 56, fd: 50, cut: true },
          { t: T.p3 - 0.36, name: 'pierce2', eye: P2CRANE, at: P2AT, fp: 56, fd: 50 },
          { t: T.p3 - 0.35, name: 'pierce3', eye: P3LOW, at: P3AT, fp: 62, fd: 54, cut: true },
          { t: T.p3 + 0.1, name: 'pierce3', eye: P3LOW, at: P3AT, fp: 62, fd: 54 },
          { t: T.p3 + 0.7, name: 'pierce3', eye: P3LOW, at: HEADAT, fp: 70, fd: 62 },
          { t: T.ring + 0.25, name: 'pierce3', eye: P3LOW, at: HEADAT, fp: 70, fd: 62 },
          { t: T.ring + 0.3, name: 'ring', eye: GOD, at: GODAT, fp: 64, fd: 50, cut: true },
          { t: T.ringOut + 0.2, name: 'ring', eye: [GOD[0], GOD[1] - 0.8, GOD[2]], at: GODAT, fp: 62, fd: 48 },
          { t: T.ringOut + 0.25, name: 'home', eye: HOME_EYE, at: HOME_UP, fp: 70, fd: 60, cut: true },
          { t: T.home, name: 'home', eye: HOME_EYE, at: HOME_AT, fp: 62, fd: 54 },
          { t: T.tail + 1.0, name: 'home', eye: HOME_EYE, at: HOME_AT, fp: 62, fd: 54 },
          { t: T.tail + 1.05, name: 'three', eye: THREE_EYE, at: THREE_A, fp: 56, fd: 50, cut: true },
          { t: T.ko5c2 - 0.05, name: 'three', eye: [THREE_EYE[0], THREE_EYE[1] - 0.2, THREE_EYE[2]], at: THREE_B, fp: 55, fd: 49 },
          /* (R75's debug: straight in, as it was: 0.35 m east, the doorway's east jamb covered half of him on a phone, photographed;
             his face was clear of Ton's head from here, and the two of them are now directed, below) */
          { t: T.ko5c2, name: 'door', eye: [-8.3, 1.62, -7.3], at: () => fmHead(cast.koh, [-8.5, 1.55, -4.7]), fp: 44, fd: 38, cut: true },
          { t: T.back - 0.05, name: 'door', eye: [-8.3, 1.62, -7.3], at: () => fmHead(cast.koh, [-8.5, 1.55, -4.7]), fp: 42, fd: 36 },
          { t: T.back, name: 'fightcam', eye: B0.eye, yaw: B0.heading, pitch: B0.pitch, fp: B0.fov, fd: B0.fov, cut: true },
          { t: T.end, name: 'fightcam', eye: B0.eye, yaw: B0.heading, pitch: B0.pitch, fp: B0.fov, fd: B0.fov }
        ]);
      },
      end() { fmLens(PLAYFOV5); SPLASH5.off(); NAGA5.hide(); if (this.bs) this.bs.visible = false; if (TITLE5.sp) TITLE5.sp.visible = false;
        /* what the last stage finds: the three laid at their places, small, dim and cool; the Naga home in the stick */
        const W = this.W || fightStart().laid;
        this.L && this.L.forEach((idx, j) => { const P = PRAI5.list[idx]; if (!P || !W[j]) return; put(P, W[j].x, W[j].z, P.group.rotation.y); P.group.position.y = 0; PRAI5.burn(P, 0); PRAI5.cool(P, 1); });
        this.B = null;
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
       eye of the dining room's shot and the one by the window stood inside the sofa, and Ton stood in it. R76's limbs check,
       23 Nov: at (-7.92, -4.0), in the 0.52 m between the sofa and the low table, his cast's right foot went 22 cm into the
       sofa; he stands east of the table now, between it and the television (0.34 m clear of each at his cast's widest), facing
       the room, the lens behind him in its south-east corner) */
    const BT5AT = { live: [-6.36, -3.62], dine: [-10.3, -1.5], terr: [-11.2, -3.6], eyeLive: [-5.5, EYE, -5.1], eyeDine: [-9.4, EYE, -2.8], eyeTerr: [-9.8, EYE, -4.6],
                    tie: [-7.28, -3.62], kohWin: [-10.5, -4.75], phoKoh: [-9.4, -4.4], eyeKoh: [-7.95, EYE, -3.3], tonKoh: [-8.0, -2.25],
                    /* (Ton and Jun beside his teacher, off the line he is looked at along: Ton's back filled the phone's frame: bagtied-00058) */
                    liftPho: [0.35, 0.05], liftTon: [-0.55, 0.45], liftJun: [-0.1, 0.8], liftEye: [-0.1, EYE, -1.55],
                    /* (R75's debug, F8: their places in the car, 1.6 by 1.5 m: Jun and Ton at its back, his teacher at the doors' right,
                       his own eye at their left, each 0.6 m and more from the next) */
                    inJun: [0.42, 2.45], inTon: [-0.42, 2.4], inPho: [0.38, 1.8], inEye: [-0.28, EYE, 1.72] };
    /* (R78, Chad: "there is one part in the cutscene with framing issue and the customer model is blocking pho as he sucks in
       the prais": through the three rooms Mr Koh stood at his place in the hunt, (-9.85, -2.25), 0.71 m in front of the
       dining room's eye and 12 degrees off its middle, on the same side as his teacher 1.58 m away at 7 degrees: his body
       filled the shot his teacher draws the smell into the bag in. He watches from the living room's east side now, by the
       armchair: behind the dining and terrace eyes, and in the living room's shot only on a desktop, 27 degrees out, beyond
       his teacher and clear of him) */
    const BT5KOH = [-6.3, -2.2];
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
        /* (R76: the lift's doors open to the routes while they stand open. R75's debug, B10: told before the walks below are
           routed, not after them: told last, both walks into the car were routed with the doors shut, missed, and fell back
           to their written lines) */
        navFilmOpen(LIFT_SHUT5, atLift && t >= T.doors + 0.7 && t < T.close + 0.5);
        fmLook(!inEyes ? 'TRANCE' : 'NIGHT');
        /* the court in the trance, then after dark with its lamp's buzz; his rooms and their clock, the smell thinning room
           by room and gone at the knot; the night air through the open window; the walkway at the lift */
        const sourLeft = 0.3 * (1 - smo(c01((t - T.room1 - 2.4) / 1.5)) * 0.35 - smo(c01((t - T.room2 - 2.4) / 1.5)) * 0.35 - smo(c01((t - T.room3 - 2.4) / 1.5)) * 0.3);
        fmBeds(atLift ? { walk: 0.35 } : !inEyes ? { court: 0.25, sour: 0.25 } : t < T.room1 ? { court: 0.5, buzz: 0.15, sour: 0.25 }
             : t < T.knot ? { room: 0.5, tick: 0.2, sour: Math.max(0, sourLeft) }
             : { room: 0.45, tick: 0.2, court: t >= T.window ? 0.32 : 0.12 });
        /* the court's lamps come back, one, then the other (R75's debug, V10: each by itself, where both had risen together in
           two half-steps; and held low under the trance, which raised them as it thinned: set after it, below) */
        if (inEyes && !atLift) { const k1 = smo(c01((t - T.lamp1) / 0.4)), k2 = smo(c01((t - T.lamp2) / 0.4)); courtLamp(0, 0.15 + 0.85 * k1); courtLamp(1, 0.15 + 0.85 * k2); }
        /* the cage thins; Master Zavier seen until the violet */
        const kc = 1 - smo(c01((t - T.thin) / 1.4));
        if (!inEyes) { whenReady(cast.zav, (P) => { fmShow(P, t < T.eyes); put(P, zz.x, zz.z, COURT5.heading + Math.PI); const rt = zavRest(); if (rt) pose(P, rt, 2 + t * 0.35, true); else pose(P, 'Walking', ZAV_STAND5); });
          CAGE5.set({ k: kc, x: zz.x, z: zz.z, t }); TRANCE5.set(1 - smo(c01((t - T.thin) / 2.0)), t); TRANCE5.pools(zz, pz, kc, kc); TRANCE5.gold(kc); }
        if (!inEyes) courtLamps(0.15);
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
          else if (t < T.room2) { put(P, A.live[0], A.live[1], faceTo(A.live[0], A.live[1], -8.3, -2.6)); pose(P, 'mage_soell_cast_3', fmRun(t, T.room1 + 0.4, T.room1 + 3.2, 0.2, 2.9)); }
          else if (t < T.room3) { put(P, A.dine[0], A.dine[1], faceTo(A.dine[0], A.dine[1], -11.6, 0.9)); pose(P, 'mage_soell_cast_3', fmRun(t, T.room2 + 0.3, T.room2 + 3.0, 0.2, 2.9)); }
          else if (t < T.knot) { put(P, A.terr[0], A.terr[1], faceTo(A.terr[0], A.terr[1], -12.4, -3.6)); pose(P, 'mage_soell_cast_3', fmRun(t, T.room3 + 0.3, T.room3 + 3.0, 0.2, 2.9)); }
          else if (!atLift) { put(P, A.phoKoh[0], A.phoKoh[1], faceTo(A.phoKoh[0], A.phoKoh[1], A.kohWin[0], A.kohWin[1]));
            /* (his three lines to Mr Koh one talk, never cut 0.1 s after each: R25) */
            fmSpeak(P, 'pho', t, [[T.ph5b1, SECS.ph5b1, 'Talk_with_Hands_Open'], [T.ph5b2, SECS.ph5b2, 'Talk_with_Hands_Open'], [T.ph5b3, SECS.ph5b3, 'Talk_with_Hands_Open']]);
            lookNow(P, fmHead(cast.koh, [A.kohWin[0], 1.55, A.kohWin[1]]), 0.8, 0.7); }
          else if (t > T.in + 0.9) fmWalk(P, t, T.in + 0.9, [A.liftPho, [0.1, 1.05], A.inPho], 0.8, restOf5('pho', t), Math.PI,
                                          { ry0: faceTo(A.liftPho[0], A.liftPho[1], A.liftEye[0], A.liftEye[2]) });   // (in after Ton, and turned to the doors: F8)
          else { put(P, A.liftPho[0], A.liftPho[1], faceTo(A.liftPho[0], A.liftPho[1], A.liftEye[0], A.liftEye[2]));
            fmSpeak(P, 'pho', t, [[T.ph5b4, SECS.ph5b4, 'Talk_with_Hands_Open'], [T.ph5b5, SECS.ph5b5, 'Talk_with_Hands_Open'], [T.ph5b6, SECS.ph5b6, 'Talk_with_Hands_Open']]);
            /* (to Jun for his news and back, each carried over 0.6 s) */
            fmGaze(P, t, [[0, 'lens'], [T.ju5b1 - 0.2, () => fmHead(cast.jun, [A.liftJun[0], 1.6, A.liftJun[1]])], [T.ph5b6, 'lens']], 0.8, 0.7, 0.03, 0.6); }
        });
        /* Ton: the stick in both hands behind his teacher, looking down at it; his line to him; at the lift */
        whenReady(cast.ton, (P) => {
          if (!inEyes) { const s0 = STATION.fight.ton; put(P, s0.x, s0.z, s0.ry); fmRest(P, 'ton', t); }
          /* (R75's debug, B11: the living room's place behind the sofa's back, fully inside a desktop's frame and fully outside a
             phone's, his stick's head too: on the old camera's spot, left when the camera moved at build 47, he stood cut in half
             at a desktop's right edge and his stick's head poked into a phone's corner; 0.74 m from Jun, 1.18 from Mr Koh) */
          else if (t < T.knot) { const at = t < T.room2 ? [-9.6, -3.4] : t < T.room3 ? [-9.1, -2.0] : [-10.5, -2.9];   // (behind his teacher, each clear of the furniture; R76: and of Mr Koh and Jun, whose places the second and third stood on)
            put(P, at[0], at[1], faceTo(at[0], at[1], at[0] - 0.5, at[1] + 1)); pose(P, 'give', 2.6 + 0.08 * Math.sin(t * 0.7)); giveFix5(P); STICK5.onPalms(P, 'stick');
            lookNow(P, [at[0], 0.8, at[1] + 0.5], 0.9, 0.8); }
          else if (!atLift) { put(P, A.tonKoh[0], A.tonKoh[1], faceTo(A.tonKoh[0], A.tonKoh[1], A.eyeKoh[0], A.eyeKoh[2])); pose(P, 'give', 2.6 + 0.08 * Math.sin(t * 0.7)); giveFix5(P); STICK5.onPalms(P, 'stick');
            /* (up to him for his line and back down to the stick, each carried over half a second) */
            fmGaze(P, t, [[0, [A.tonKoh[0], 0.8, A.tonKoh[1] - 0.4]], [T.tn5b1 + 0.6, 'lens'], [T.tn5b1 + SECS.tn5b1, [A.tonKoh[0], 0.8, A.tonKoh[1] - 0.4]]], 0.85, 0.8, 0.03, 0.5); }
          else { const ry0 = faceTo(A.liftTon[0], A.liftTon[1], A.liftPho[0], A.liftPho[1]);
            put(P, A.liftTon[0], A.liftTon[1], ry0); pose(P, 'give', 2.6 + 0.08 * Math.sin(t * 0.7));
            const walking = t > T.in + 0.45 && fmWalk(P, t, T.in + 0.45, [A.liftTon, [-0.02, 1.0], A.inTon], 0.9, ['give', 2.6, 0, false], Math.PI, { ry0 });
            giveFix5(P);
            /* (R75's debug, B2: from his palms to his right fist as he turns to walk, eased over a third of a second, and held so
               inside the car; at the walk's end his rest is the offering's again, the stick still upright in his fist) */
            const kc = t > T.in + 0.45 ? smo(c01((t - T.in - 0.45) / 0.35)) : 0;
            if (kc <= 0) STICK5.onPalms(P, 'stick');
            else if (kc >= 1) STICK5.carryUp(P);
            else { const g = things.nagaStaff; if (g) { STICK5.onPalms(P, 'stick'); const p0 = g.position.clone(), q0 = g.quaternion.clone();
              STICK5.carryUp(P); if (kc < 1) { g.position.lerpVectors(p0, g.position.clone(), kc); g.quaternion.slerpQuaternions(q0, g.quaternion.clone(), kc); } } }
            void walking; }
        });
        /* Mr Koh: behind the thread in the court; by his window, the curtain drawn back; his line, his bow; Jun with him */
        whenReady(cast.koh, (P) => {
          if (!inEyes) { const s0 = STATION.fight.koh; put(P, s0.x, s0.z, s0.ry); fmRest(P, 'koh', t); }
          else if (atLift) fmShow(P, false);
          else if (t < T.knot) { put(P, BT5KOH[0], BT5KOH[1], faceTo(BT5KOH[0], BT5KOH[1], A.live[0], A.live[1])); fmRest(P, 'koh', t);
            if (t < T.room2) lookNow(P, fmHead(cast.pho, [A.live[0], 1.55, A.live[1]]), 0.7, 0.7); }
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
            if (t > T.in) fmWalk(P, t, T.in, [A.liftJun, A.inJun], 0.9, restOf5('jun', t), Math.PI); }
        });
        /* the curtains of his front windows drawn back and a window open (night air) from the knot on; the lamp that
           flickers (the pendant: R42) flickers once, and holds */
        CURTAINS5.set(t >= T.knot ? 1 : 0);
        lamp(LAMP_FLICK, t > T.window + 0.6 && t < T.window + 1.0 ? 0.25 : 1);
        /* what is drawn out of each room's air into the bag: dark threads gathering to the bag's mouth before him */
        WISPS5.set(t, [[T.room1 + 0.6, A.live], [T.room2 + 0.5, A.dine], [T.room3 + 0.5, A.terr]]);
        /* the lift: the doors at the end */
        liftDoors(atLift ? smo(c01((t - T.doors) / 1.4)) * (1 - smo(c01((t - T.close) / 1.3))) : 0);
        /* (R76, limbread on build 44: Jun beside his teacher at x 0.6 stood in the walkway's railing and went round him into it
           (35 cm), and Ton and Jun went into the car through its jamb: Jun nearer the doors and in first, Ton after him, both
           marks clear of the railing and of each other; the doors open to the routes while they stand open) */
        /* THE LENS: from the boom, forward and down into his head (the violet), then his own eyes */
        const B0 = boomAt({ x: pz.x, z: pz.z }, PULL5), ZH = [zz.x, 1.66, zz.z];   // (R46: begun on the end's pulled-back lens)
        fmTrack(t, [
          { t: 0, name: 'fightcam', eye: B0.eye, yaw: B0.heading, pitch: B0.pitch, fp: B0.fov, fd: B0.fov },
          { t: T.violet + 0.3, name: 'into', eye: [ZH[0], ZH[1] + 0.35, ZH[2] - 0.9], at: [ZH[0], 1.4, ZH[2] + 2.5], fp: 60, fd: 54 },
          { t: T.eyes, name: 'eyes', eye: [ZH[0], EYE, ZH[2] + 0.02], at: [ZH[0], 1.05, ZH[2] + 1.6], fp: 62, fd: 56, cut: true },
          { t: T.room1 - 0.3, name: 'eyes', eye: [ZH[0], EYE, ZH[2] + 0.02], at: [-8.6, 1.4, -7.0], fp: 60, fd: 54 },
          { t: T.room1, name: 'living', eye: A.eyeLive, at: [A.live[0] - 1.4, 1.5, A.live[1] + 1.0], fp: 56, fd: 50, cut: true },
          { t: T.room2 - 0.05, name: 'living', eye: [A.eyeLive[0] - 0.1, EYE, A.eyeLive[2] + 0.1], at: [A.live[0] - 1.5, 1.45, A.live[1] + 1.1], fp: 54, fd: 48 },
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
          /* (R75's debug, F8: his eye goes after his teacher toward the doors, then, cut, he is in the car with them, turned to
             the doors as they close on the walkway: "The lift doors close on black", the plan's 4.6) */
          { t: T.in + 2.45, name: 'doors', eye: [-0.15, EYE, -0.35], at: [0.1, 1.45, 1.9], fp: 62, fd: 54 },
          /* (R75's debug: on to the doors while his teacher reaches his place and turns to them, and only then the cut:
             cut at 2.5 s, his teacher was still coming in past the lens, his bare shoulder a sliver at a phone's edge) */
          { t: T.in + 3.3, name: 'doors', eye: [-0.15, EYE, 0.5], at: [0.3, 1.5, 1.9], fp: 62, fd: 54 },
          { t: T.in + 3.35, name: 'in', eye: A.inEye, at: [A.inEye[0], 1.35, -1.6], fp: 66, fd: 58, cut: true },
          { t: T.end, name: 'in', eye: [A.inEye[0], EYE, A.inEye[2] + 0.05], at: [A.inEye[0], 1.33, -1.6], fp: 66, fd: 58 }
        ]);
      },
      end() { fmLens(PLAYFOV5); CURTAINS5.set(0); WISPS5.off(); liftDoors(0); lamp(LAMP_FLICK, 1);
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
    /* (R88: the drops leave his right hand as his seated cheer sweeps it down, measured on his body where he sits: the take
       at 1.7 s, the hand at (0.217, 1.109, 0.638) about the room's middle, the throw's release in its cycle (1.7). R89: the
       tied bag inside the cloth's top: at 0.22 and turned 0.5 its back stood 7 cm over the hanging drape) */
    const RITE_AT = { bag: [ROOM.cx + 0.05, ROOM.cz + 0.16], handFrom: [ROOM.cx + 0.217, 1.109, ROOM.cz + 0.638] };
    const _smk5 = new THREE.Vector3();             // (R90: where a piece's smoke rises from, in the endings)
    const presOf5 = () => (typeof pres !== 'undefined' ? pres : null);
    const BAGBLOB5 = { m: null, o: null };
    /* (each bag's own painted contact shadow, carried with it: the open bag on the low table at the knot read as floating,
       bagtied-phone 18.6 on deploy 10; made once, the first film that sets a bag down) */
    function bagBlobs5() { if (things.bagOpen && !BAGBLOB5.o) BAGBLOB5.o = blob(things.bagOpen, 0.3, 0.28);
      if (things.bagTied && !BAGBLOB5.m) BAGBLOB5.m = blob(things.bagTied, 0.34, 0.3); }
    FILMS5.ending = {
      begin(k, api, s) {
        FM5.once = new Set(); FM5.lit = ''; FM5.s = s; FM5.api = api; this.k = k;
        /* (R75's debug, V1: "Take your time. I am not going anywhere." answered while it is said was said on under the ending's
           first line, the same voice twice: it is brought down in a tenth of a second as the ending begins) */
        { const ps = typeof play === 'object' && play ? play.patSrc : null; if (ps) { play.patSrc = null;
          try { const c = ps.context, g = ps.__g && ps.__g.gain; if (g && c) { const t = c.currentTime; g.cancelScheduledValues(t); g.setValueAtTime(g.value, t); g.linearRampToValueAtTime(0.0001, t + 0.1); ps.stop(t + 0.12); } else ps.stop(); } catch (e) { } } }
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
        if (bag) { bag.visible = gathered; if (gathered) { bag.position.set(RITE_AT.bag[0], CLOTHY5(RITE_AT.bag[0]), RITE_AT.bag[1]); bag.rotation.set(0, 0.2, 0); } }
        RITE5.string(gathered ? smo(c01((tr - RT.string) / 0.6)) : 0, bag);
        /* the ending's own things (the case pushed across, the lid, the three), set before the presences, which ride on
           the three (R33) */
        const X = ENDS5[k];
        if (X.things) X.things(t, E, me);
        /* the presences (the play's own, c_play.js pres): crying out and coming away as the water reaches them, each
           lifting off its piece and leaving the table's light */
        const P5 = presOf5();
        if (P5) for (const [nm, i] of [['angry', 0], ['hungry', 1], ['energy', 2]]) { const q = P5[nm]; if (!q) continue;
          const u = smo(c01((tr - RT.away - i * 0.7) / 3.0));
          q.grp.visible = tr < RT.away + 3.6 + i * 0.7 && u < 0.999;
          /* (R33: each on its own piece where the piece now lies: ending C pushes the three across the cloth, threeAt5, and
             they stayed on its bare first places, 0.38 to 0.48 m from them) */
          const pk = things[TABLE5.P[nm].key], ph = threeHome5[TABLE5.P[nm].key];
          const hx = q.home.x + (pk && ph ? pk.position.x - ph.x : 0), hz = q.home.z + (pk && ph ? pk.position.z - ph.z : 0);
          if (q.grp.visible) { q.grp.position.set(hx + (hx - R.cx) * 2.2 * u, q.home.y + 1.1 * u * u, hz + 0.9 * u);
            if (q.fx) q.fx.set('uAlpha', 1 - u); }
          /* (R90: its smoke rises off the piece where the piece lies, and dies away as the water reaches it: carried off with
             the presence it read as two coloured blobs adrift over his teacher, build 66. R92: the doll's pale one too) */
          { _smk5.set(hx, q.home.y, hz); SMOKE5.frame(nm, t, _smk5, q.grp.visible ? 1 - u : 0, 0); } }
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
          const L = [[0, COLH]];
          for (const [key, at, to] of (E.pho || [])) if (to === 'me') { L.push([at - 0.2, 'lens']); L.push([at + (SECS[key] || 2) + 0.2, COLH]); }
          L.push([r0, CLOTH]); L.push([r0 + RT.end, COLH]); L.sort((a, b) => a[0] - b[0]);
          fmGaze(P, t, L, 0.7, 0.7, 0.03, 0.6); });
        if (tr > RT.dip && tr < RT.bag) { const ft = (tr - RT.dip) % 2.2; RITE5.throwAt(ft, 1.7, RITE_AT.handFrom, R.cx + 0.09, R.cz - 0.02, tr - RT.dip >= 2.2 ? 2.2 : 0); } else RITE5.dropsOff();
        /* the collector: his own story first; still through the rite; lighter after it; standing at the door, and gone */
        whenReady(cast.col, (P) => { const s0 = STATION.table.collector;
          const gone = E.gone != null && t >= E.gone;
          if (gone) { fmShow(P, false); return; }
          fmShow(P, true);
          /* (R25: his one seated take PLAYS through his lines, fmSpeak, where mixed with itself it sagged toward its bind pose
             at each line; at the door, standing, he talks with his hands for his line there) */
          if (E.door != null && t >= E.door) { put(P, -1.15, 237.95, faceTo(-1.15, 237.95, me[0], me[2]));
            fmSpeak(P, 'koh', t, Object.keys(E).filter(q => /^co5/.test(q) && E[q] >= E.door && SECS[q]).map(q => [E[q], SECS[q], 'Idle_3'])); }
          else { put(P, s0.x, s0.z, s0.ry, CUSHION_TOP);
            fmSpeak(P, 'col', t, (E.col || []).map(([key, at]) => [at, SECS[key] || 2, 'Sitting_Answering_Questions'])); }
          /* (his looks: the ending's own, then the cloth through the rite, then him: each carried 0.6 s) */
          const L = ENDS5[k].colLooks ? ENDS5[k].colLooks(E).slice() : [[0, 'lens']];
          L.push([r0, CLOTH]); L.push([r0 + RT.end, 'lens']); L.sort((a, b) => a[0] - b[0]);
          fmGaze(P, t, L, 0.75, 0.7, 0.03, 0.6); });
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
        if (tc >= 0 && bag) whenReady(cast.phoS, (P) => handTo(P, 'R', [RITE_AT.bag[0] - 0.02, CLOTHY5(RITE_AT.bag[0]) + 0.16, RITE_AT.bag[1] + 0.03], [0.05, -0.35, -0.93], [0, -1, 0.2], smo(c01(tc / 0.6)), { out: 0.22, down: 0.3 }));
      },
      end() { fmLens(PLAYFOV5); fmVisionOff(); RITE5.dropsOff(); if (FM5.api && FM5.api.handPose) FM5.api.handPose(null, 0); if (kit && kit.captions) kit.captions(null);
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
    function casePush5(t, t0, t1, to) { caseAt5(); const u = smo(c01((t - t0) / Math.max(0.05, t1 - t0))); caseAt5(lp(casePos0.x, to[0], u), lp(casePos0.z, to[1], u), lp(casePos0.ry, to[2], u)); }
    /* (R109, 24 Nov 2026: "when the black box slides over the table it clips into all the amulets": pushed to [0.14, 240.3]
       it crossed the twenty pieces' rows, x -0.135 to 0.135, and stood on the back row's three. It is pushed now along the
       cloth's free left side toward his teacher, turned a little square to the table: its right edge 5 cm off the left
       column's pieces at the end of the push and further off all the way there, its far edge 3 cm inside the cloth's) */
    const CASE_TO5 = [ROOM.cx - 0.40, ROOM.cz + 0.16, 8 * DEG];
    const THREE5 = ['w5wuathanu', 'w5rakyom', 'w5hunphayon'];
    const threeHome5 = {};
    function threeAt5(u) { for (const key of THREE5) { const g = things[key]; if (!g) continue; if (!threeHome5[key]) threeHome5[key] = g.position.clone();
      const h = threeHome5[key]; g.position.set(h.x, h.y, lp(h.z, 240.225, u)); } }
    /* (ending C) something small that his nose never caught, on a piece he has already packed: seen only in his sight, a
       pale smoke rising out of the case's foam (R98's ruling, 24 Nov: a smoke like the doll's, c_play.js SMOKE5's 'small';
       it was a pale sphere with a glowing rim, ctx.spirit) */
    const SMALL5 = (() => { const _sp = new THREE.Vector3();
      return { set(k, t) { const pc = things.padcase, x = pc ? pc.position.x : -0.36, z = pc ? pc.position.z : 239.95;
        _sp.set(x + 0.03, 0.43, z - 0.02); SMOKE5.frame('small', t, _sp, k, 0); } };
    })();
    const ENDS5 = {
      /* A · "None of them. Let them all go." (good): he flinches, then nods, too quickly; "All." He pushes the case over as
         a man pays a fine. After the rite, at the door, lighter, already asking where to buy good ones; the student has no
         answer ready; his teacher's two lines; his own thought */
      A: { shots: (me, COL, PHO, E) => [
             { t: 0, name: 'col', eye: me, at: COL, fp: 44, fd: 38 },
             { t: E.q5A1 + 0.4, name: 'col', eye: me, at: COL, fp: 42, fd: 36 },
             { t: E.push + 0.2, name: 'push', eye: [me[0] - 0.08, me[1] - 0.04, me[2]], at: [-0.33, 0.42, 240.0], fp: 52, fd: 44 },
             { t: E.rite - 0.05, name: 'push', eye: [me[0] - 0.08, me[1] - 0.04, me[2]], at: [-0.35, 0.42, 240.12], fp: 52, fd: 44 } ],
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
           things: (t, E) => casePush5(t, E.push, E.push + 1.4, CASE_TO5) },
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
             { t: E.lid + 0.4, name: 'lid', eye: [me[0] - 0.08, me[1] - 0.04, me[2]], at: [-0.33, 0.42, 240.0], fp: 52, fd: 44 },
             { t: E.rite - 0.05, name: 'lid', eye: [me[0] - 0.08, me[1] - 0.04, me[2]], at: [-0.35, 0.42, 240.12], fp: 52, fd: 44 } ],
           after: (me, COL, PHO, E) => [
             { t: E.door, name: 'door', eye: me, at: () => fmHead(cast.col, DOOR5), fp: 50, fd: 44, cut: true },
             /* (to his teacher on the cut BEFORE the collector goes, so he goes out of shot: on the door until his teacher's
                word, he vanished from the doorway in the shot at 40.0 s, e4c5filmread POP on deploy 12) */
             { t: E.gone - 0.15, name: 'door', eye: me, at: () => fmHead(cast.col, DOOR5), fp: 50, fd: 44 },
             { t: E.gone - 0.1, name: 'pho', eye: me, at: PHO, fp: 46, fd: 40, cut: true },
             /* (held on him to his line's last word: eased to the table from his first, the look left him all through it) */
             { t: E.ph5B1 + SECS.ph5B1 - 0.1, name: 'pho', eye: me, at: PHO, fp: 44, fd: 38 },
             { t: E.q5B2 + 0.6, name: 'table', eye: me, at: [0, 0.4, 240.0], fp: 52, fd: 46 } ],
           things: (t, E) => casePush5(t, E.lid + 0.8, E.lid + 2.0, CASE_TO5),
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
             { t: E.three + 0.5, name: 'three', eye: [me[0], me[1] - 0.04, me[2]], at: [0.045, 0.37, 240.14], fp: 42, fd: 36 },
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
