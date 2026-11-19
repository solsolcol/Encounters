    /* ================================================================ THE FILMS' PICTURES (M7; the plan's §4.4 to §4.5)
       Every film is HIS EYES (the grown Master Zavier is never seen: CLAUDE.md, v24.56): the lens stands where he
       stands, turns and narrows, and never moves through the people. Every picture is a pure function of the film's
       clock (v6.4): people are POSED at the moment the clock asks for (pose), a look laid on at once (lookNow), the
       vision's wave held at the radius the clock gives it (kit.vision({ r })), so a seek, a skip and a slow phone land on
       the same picture. A shot is a track of keys (track): a key's eye, its aim and its lens for a phone and a desk; a
       move between two keys is eased (a smooth function of the clock, v25.5), a key marked `cut` is a cut. A phone's
       frame is a third of a desk's width, so a group a desk holds is a phone's pan from one face to the next. */
    const FM = { key: '', once: new Set(), lit: '', must: null, endK: 0 };
    const PLAY_FOV = camera.fov;                                              // the lens play is seen through (a film that ends in the clear ends on it)
    const _ffv = new THREE.Vector3();
    function fLook(name, secs = 0) { if (FM.lit !== name) { FM.lit = name; lookAt0(name, secs); } }
    function onceAt(id, t, at, fn, span = 1.5) { if (t >= at && t < at + span && !FM.once.has(id)) { FM.once.add(id); fn(); } }
    function fLens(f) { if (Math.abs(camera.fov - f) > 1e-3) { camera.fov = f; camera.updateProjectionMatrix(); } }
    function camAt(p, q, roll = 0) {
      yaw.position.set(p[0], p[1], p[2]);
      const dx = q[0] - p[0], dy = q[1] - p[1], dz = q[2] - p[2];
      yaw.rotation.y = Math.atan2(-dx, -dz); pitch.rotation.x = Math.atan2(dy, Math.hypot(dx, dz));
      camera.rotation.z = roll;
      stockLod();                                  // (the levels of detail for THIS frame's lens, never the last one's: v24.22)
    }
    function headOf(P, fb) { if (P && P.ready && P.head && P.group.visible) { P.head.getWorldPosition(_ffv); return [_ffv.x, _ffv.y, _ffv.z]; } return fb; }
    function shot(eye, at, fPhone, fDesk, roll = 0) { fLens(isNarrow() ? fPhone : fDesk); camAt(eye, at, roll); }
    const v3 = (o) => (typeof o === 'function' ? o() : o);
    /* a track of keys: { t, eye, at, fp, fd, roll, cut }. Between two keys the lens eases from one to the next; a key
       marked `cut` is jumped to at its time (the one before it held until then) */
    /* (a shot's keys must run forward in time: the close's family shot ran 21.6 then 21.3 and never held, and nothing
       said so (18 Nov). Said now, once for each pair, as a console error every probe counts) */
    const keysBad = new Set();
    function track(t, K) {
      for (let j = 1; j < K.length; j++) if (K[j].t < K[j - 1].t) { const w = (K[j - 1].name || '') + '@' + K[j - 1].t.toFixed(2) + ' > ' + (K[j].name || '') + '@' + K[j].t.toFixed(2);
        if (!keysBad.has(w)) { keysBad.add(w); console.error('e4c4: a film\'s camera keys run backwards in time: ' + w); } }
      let i = 0; while (i < K.length - 1 && t >= K[i + 1].t) i++;
      const A = K[i], B = K[i + 1];
      if (!B || B.cut) { shot(v3(A.eye), v3(A.at), A.fp, A.fd, A.roll || 0); FM.shot = A.name || ''; return; }
      const u = smo(c01((t - A.t) / Math.max(1e-3, B.t - A.t)));
      const fl = lp(isNarrow() ? A.fp : A.fd, isNarrow() ? B.fp : B.fd, u);
      fLens(fl); camAt(lp3(v3(A.eye), v3(B.eye), u), lp3(v3(A.at), v3(B.at), u), lp(A.roll || 0, B.roll || 0, u));
      FM.shot = (A.name || '') + '>' + (B.name || '');
    }
    /* a take run between two of its own moments over a stretch of the film's clock (eased at both ends) */
    const runOf = (t, t0, t1, a, b) => lp(a, b, smo(c01((t - t0) / (t1 - t0))));
    /* a take held on a small stretch of itself, there and back on the film's clock (a stillness that breathes) */
    const pingOf = (t, from, len, secs) => from + len * (0.5 - 0.5 * Math.cos(Math.PI * 2 * t / secs));

    /* WHERE EVERYONE IS AT THE TURNING POINT (the trance's last frame is where every ending begins) */
    /* (18 Nov: from 1.12, 4.45 her face was a profile in every close shot of the trance; here she is three quarters to him,
       a pace from her left knee, clear of the lamp at the altar's foot and of Appa by his photograph) */
    const S_EYE = [0.55, 1.62, 4.42];                                         // he stands at her front left, by her goddess's wall
    /* where he watches the close from: her front left, before Appa's photograph and the master bedroom's door (18 Nov,
       photographed twice: from 1.12, 4.45 Ravi stood on the line from his eyes to her, his back filling every shot, and
       his teacher's word was a dark doorway and an arm; from 1.30, 4.93, against the wall, her altar's cabinet stood
       across the line to Mala and Appa stood a step from the lens). Here he is in front of the cabinet's face, Mala is
       seen at her right beyond her, Ravi kneels at her left below her face, and his teacher stands clear behind her */
    const CLOSE_EYE = [1.30, 1.62, 4.55];
    /* (ending B: where the thing comes to, a hand's breadth from his eyes, on the line from her back to him; and that line) */
    const TOWARD = (() => { const dx = CHAIR.x - S_EYE[0], dz = CHAIR.z - 0.3 - S_EYE[2], l = Math.hypot(dx, dz); return [dx / l, dz / l]; })();
    const COMES = [S_EYE[0] + TOWARD[0] * 0.36, 1.1, S_EYE[2] + TOWARD[1] * 0.36];
    /* RAVI'S RUSH IS THE TAKE'S OWN (its travel, 2.94 m, measured: tools/probes/takepath.mjs). His group stands where the
       take begins, at the room's edge in the passage to the kitchen, turned so the take's own line (8.5 degrees to his
       right of his front) ends a step from her chair, R1, clear of the armchair's back. (18 Nov: he was moved from the
       sofa's end to R1 while the take travelled too, so his body ran five metres and through the wall, and the armchair
       stood across that line; every hold of the take's end at R1 put him three metres past it) */
    const RS = { x: 3.70, z: 4.00, ry: -1.621 }, R1 = { x: 0.82, z: 3.42 };
    /* ENDING C'S LENSES (18 Nov, re-staged from its photographs: aimed at R1, his face came to a phone's edge; and once
       he knelt, from over his shoulder, his head hid her face through the cry, the light and her eyes opening). His head
       where the decision holds him, measured (tools/probes/e4c4who.mjs: 0.88, 1.44, 3.45); the eye he speaks to him from;
       and the two of them from her front left a step back, his head (where he kneels, KNEEL_R) and her face 16 degrees
       apart from there, inside a phone's 31 at 62 degrees of lens (to be read in the photographs) */
    const CR_HEAD = [0.88, 1.44, 3.45], CR_EYE = [0.57, 1.6, 4.04], CK_EYE = [0.95, 1.55, 4.75], CK_AT = [0.045, 0.97, 3.87];
    /* where Ravi kneels at her side in C and D: a little behind her left hand, so from her front left (C's two-shot) and
       from where he keeps his place (D) the kneeling son's head stands clear of her face (it hid it when he knelt level
       with her); and Grandmaster Pho's head as he bows over her with his hand on her head (measured: e4c4who.mjs) */
    const KNEEL_R = { x: CHAIR.x + 0.45, z: CHAIR.z - 0.05 }, PHO_BOW = [-0.13, 1.40, 3.51];
    /* (R80, Chad, 18 Nov: "in some outcome ending cutscenes, ravi's head blocks grandmaster pho when the camera tries to
       show pho talking with his voicelines". Stood where he had knelt, KNEEL_R, Ravi's head was 0.02 m from the line from
       ending D's lens to his teacher's face and 0.07 m from ending C's: mine, from builds 21p and 21q. Build 21t moved HIM
       to her side, and as he rose his head went through her waist (photographed, C at 18.5): a family round her chair
       leaves no standing place clear of both lenses and of her, the chair, the stool and the altar (searched on a 1 cm
       grid). So the LENS moves: each ending cuts, for his teacher's words, to a place that sees him past all three of
       them by 0.32 m, from his front right as he speaks to her (C_PHO_EYE, D_PHO_EYE)) */
    const C_PHO_EYE = [1.35, 1.55, 4.25], D_PHO_EYE = [1.01, 1.58, 3.97];
    /* (the rush take's hips over the floor, its own metres, every quarter second: tools/probes/takepath.mjs, 18 Nov) */
    const RUSH_HIPS = [[-0.01, -0.03], [-0.01, 0.0], [-0.02, 0.06], [-0.03, 0.22], [-0.08, 0.61], [-0.21, 1.22], [-0.35, 1.82], [-0.43, 2.24], [-0.43, 2.63], [-0.43, 2.82], [-0.44, 2.86], [-0.45, 2.89]];
    const RUSH_AT = (tk) => { const f = Math.max(0, Math.min(RUSH_HIPS.length - 1.001, tk / 0.25)), i = Math.floor(f), u = f - i, A = RUSH_HIPS[i], B = RUSH_HIPS[i + 1];
      return [lp(A[0], B[0], u) - RUSH_HIPS[0][0], lp(A[1], B[1], u) - RUSH_HIPS[0][1]]; };
    /* Ravi where his rush has carried him at the take's moment tk: his group moved along the travel taken out of his
       hips (c_scast.js, P.rushPath), turned with him; the take posed by the caller */
    function rushXZ(P, tk) {
      const R = P.rushPath; let ax = 0, az = 0;
      if (R) { const T = R.T, n = T.length; let i = 0; while (i < n - 2 && T[i + 1] <= tk) i++; const u = c01((tk - T[i]) / Math.max(1e-6, T[i + 1] - T[i])), k = Math.min(n - 1, i + 1);
        ax = lp(R.D[i * 2], R.D[k * 2], u); az = lp(R.D[i * 2 + 1], R.D[k * 2 + 1], u); }
      const c = Math.cos(RS.ry), sn = Math.sin(RS.ry);
      return { x: RS.x + ax * c + az * sn, z: RS.z - ax * sn + az * c };
    }
    function rushAt(P, tk, dx = 0, dz = 0) { const q = rushXZ(P, tk); put(P, q.x + dx, q.z + dz, RS.ry); }
    /* HELD WHERE HIS RUSH STOPPED (18 Nov, read through ending C by tools/probes/e4c4who.mjs): the decision holds him at
       the take's 2.5 s, straining (its 2.45 to 2.57 there and back in 1.4 s, c_ufilm.js trance end); the endings that
       hold him go on from exactly that, his group where the decision left it and only the strain in the take */
    function rushHeld(P, t) { rushAt(P, 2.5); pose(P, 'rush', pingOf(t, 2.45, 0.12, 1.4)); }
    const lpA = (a, b, k) => a + Math.atan2(Math.sin(b - a), Math.cos(b - a)) * k;
    /* TO HER SIDE AND DOWN ONTO THE KNEES (18 Nov, read through ending C: the kneel take is kneeling from its first
       frame, so at the beat Ravi's head dropped half a metre in one frame and he then slid 0.8 m over the floor on his
       knees to her side; Mala the same, 0.4 m; ending D's Ravi the same). Now: from where he stands at t0 a walk paced
       by the ground it covers (1.29 m a second of the walking take: ending A's measure) at a slow 0.62 m a second,
       turned out of his stance along the way and to her at its end, eased into a standing breath as he arrives; at
       `kneelAt` (or on arrival) down onto his knees, the stand eased into the kneel over `down` seconds while the kneel
       take runs from its start; `kt(td)` the kneel take's moment once down (its first 4.2 s by default). `from` is the
       take and moment he stands in before he goes, so the walk begins out of it */
    function walkKneel(P, t, t0, A, B, ryEnd, from, o = {}) {
      const L = Math.hypot(B.x - A.x, B.z - A.z), T = L > 0.02 ? Math.max(0.5, L / 0.62) : 0;
      const h = L > 0.02 ? faceTo(A.x, A.z, B.x, B.z) : ryEnd, tw = t - t0, down = o.down || 1.1;
      const kAt = o.kneelAt != null ? Math.max(o.kneelAt, t0 + T) : t0 + T, idleT = (q) => 3 + q * 0.4;
      if (tw < T) {
        const s = L * smo(c01(tw / T)), u = s / L, a0 = o.ry0 != null ? o.ry0 : h;
        put(P, lp(A.x, B.x, u), lp(A.z, B.z, u), lpA(lpA(a0, h, smo(c01(tw / 0.35))), ryEnd, smo(c01((tw - T + 0.35) / 0.35))));
        const into = smo(c01(tw / 0.4)), outOf = smo(c01((tw - T + 0.4) / 0.4));
        if (outOf <= 0) pose(P, 'Walking', s / 1.29, true, from[0], 1 - into, from[1]);
        else pose(P, 'Idle_3', idleT(tw), true, 'Walking', 1 - outOf, s / 1.29);
        return;
      }
      put(P, B.x, B.z, ryEnd);
      if (t < kAt) { pose(P, 'Idle_3', idleT(tw), true); return; }
      const td = t - kAt, k = smo(c01(td / down));
      pose(P, 'kneelhold', o.kt ? o.kt(td) : Math.min(4.2, td), false, 'Idle_3', 1 - k, idleT(kAt - t0));
    }
    const MALA_T = { x: -0.55, z: 4.42 };                                     // Mala at her mother's right hand, before her
    const MALA_TO_HER = faceTo(MALA_LAMP.x, MALA_LAMP.z, CHAIR.x, CHAIR.z);   // (R46: from her lamp, turned to her mother)
    const AMMA_FACE = [CHAIR.x, 1.02, CHAIR.z + 0.08];
    const RAVI_RY = RS.ry;
    /* the picture the decision opens over (the trance's last, every ending's first). A phone's frame is a third of a desk's
       width: from where he stands, Ravi at R1 is 67 degrees round from her face and cannot share it, so a phone holds
       her, the thing on her back and his teacher's bowed head over her (what he must choose about); a desk holds them all */
    const END_AIM = () => (isNarrow() ? [CHAIR.x - 0.05, 1.2, CHAIR.z - 0.13] : [lp(R1.x, CHAIR.x, 0.55), 1.15, lp(R1.z, CHAIR.z, 0.55)]);
    /* her goddess's light in her (§4.4: a light, never a figure): a dark blue glow laid over her own body in the vision,
       made once at the build so it is never compiled on screen, unseen (alpha 0) until a film raises it */
    let ammaAura = null;
    whenReady(cast.amma, (P) => { ammaAura = ctx.spiritAura ? ctx.spiritAura(P.model, { color: 0x2f4dff, fill: 0.0, rim: 1.3, flicker: 0.06, power: 2.0, xray: 0 }) : null;
      if (ammaAura) { ammaAura.set('uAlpha', 0); auras.push(ammaAura); } });
    function goddess(k) { if (ammaAura) { ammaAura.set('uAlpha', k > 0.001 ? 1 : 0); ammaAura.set('uFill', 0.16 * k); ammaAura.set('uRim', 0.4 + 1.1 * k); } }
    /* the vision held by a film's clock: out from his eyes over `secs` from `t0` (the engine's own curve), full after */
    const VR = 70;
    function visionAt(t, t0, secs = 1.6, t1 = Infinity, back = 1.0) {
      if (!kit || !kit.vision) return;
      if (t < t0) { kit.vision({ r: 0, moving: false }); return; }
      if (t < t0 + secs) { const u = (t - t0) / secs; kit.vision({ r: VR * (0.30 * u + 0.70 * u * u * u), moving: true }); return; }
      if (t < t1) { kit.vision({ r: VR, moving: false }); return; }
      if (t < t1 + back) { const u = 1 - (t - t1) / back; kit.vision({ r: VR * (0.30 * u + 0.70 * u * u * u), moving: true }); return; }
      kit.vision({ r: 0, moving: false });
    }
    /* Grandmaster Pho behind her chair with his right palm on the crown of her head (crownTick's own hand and bow,
       c_story.js), stood and posed by the film each frame: the bow is set before his pose (the mixer lays it on), the
       hand after; k eases both on and off */
    function phoBless(t, k) {
      const P = cast.phoB; if (!P.ready) return; P.group.visible = true; put(P, P.home.x, P.home.z, P.home.ry);
      const h = HER_CROWN();
      bowSet(P, k > 0.01 ? k * bowFor(P, h) : 0);
      pose(P, 'Sit_to_Stand_Transition_M', pingOf(t, 5.85, 0.25, PHO_BREATH));
      if (k > 0.01) crownHand(P, h, k);
    }

    const _obq = new THREE.Quaternion(), _ofq = new THREE.Quaternion(), _ofe = new THREE.Euler();
    const FILMS = {};
    /* ---------------------------------------------------------------- THE TRANCE (§4.4; its clock: TR)
       From his place at her front left: her deep breath, her back straightening, her eyes opening wide, her hands lifting
       open; Mala, at her right hand, knowing it before anyone ("It's Amman."); then his sight forced open, the wave out
       from him: the crimson thing on her back clawing at her shoulders and a dark blue light rising in her; its cry; and
       Ravi breaking from the sofa toward his mother, his eyes turned to him by the shout, and back to her. It ends on
       the live room: the decision opens over it */
    /* (its clock, TR, is the chapter's own, z_tail.js: chaptertest reads a film's length from it) */
    FILMS.trance = {
      begin(api) {
        if (api && api.handsRoot) api.handsRoot.visible = false;
        FM.once = new Set();
        whenReady(cast.pho, (P) => { P.group.visible = false; });
        whenReady(cast.mala, (P) => { put(P, MALA_T.x, MALA_T.z, faceTo(MALA_T.x, MALA_T.z, CHAIR.x, CHAIR.z)); });
        whenReady(cast.ravi, (P) => { rushAt(P, 0); });
        spiritsHome(); castSolid();
        filmBed.on = true; for (const k in filmBed) if (k !== 'on') filmBed[k] = 0; filmBed.dark = BED.dark;      // the dark room under every silence
      },
      frame(t) {
        fLook('DARK');
        /* her: the breath, the back straightening, the hands lifting; held trembling on the take's last stretch */
        whenReady(cast.amma, (P) => pose(P, 'trance', t < 9.9 ? t : pingOf(t - 9.9, 8.2, 1.5, 3.2)));
        phoBless(t, 1);
        /* Mala: still, watching her mother; at her second line her palms meet before her chest (the end of her lamp's
           take: its own pressing of the palms and the small bow) */
        whenReady(cast.mala, (P) => { if (t < TR.ml2 - 0.4) { pose(P, 'Idle_3', 2 + t * 0.4, true); }
          else pose(P, 'lightlamp', runOf(t, TR.ml2 - 0.4, TR.ml2 + 1.4, 4.4, 5.6));
          lookNow(P, AMMA_FACE, 1, 0.9); });
        /* Ravi: still at the room's edge until the cry, then his rush (the take carries him, from its standing start, eased
           out of his rest over its first 0.3 s): three quick steps to a step from her chair; his eyes to him at his
           shout, and back to her */
        whenReady(cast.ravi, (P) => {
          if (t < TR.rush) { rushAt(P, 0); pose(P, 'Idle_3', 3 + t * 0.35, true); lookNow(P, AMMA_FACE, 1, 0.9); }
          else { const b = smo(c01((t - TR.rush) / 0.3)), kL = smo(c01((t - TR.rv + 0.15) / 0.35)) * (1 - smo(c01((t - TR.back) / 0.9))), tk = Math.min(2.6, (t - TR.rush) * 1.05);
            rushAt(P, tk); pose(P, 'rush', tk, false, 'Idle_3', 1 - b, 3 + TR.rush * 0.35);
            lookNow(P, lp3(AMMA_FACE, S_EYE, kL), 1, 0.9); }
        });
        /* the one on her back: its cling, its claws at her shoulders as the light rises in her, then its cry */
        whenReady(spirits.oppress, (P) => { oppRide(P);
          if (t < TR.claw) pose(P, 'cling', 2 + t * 0.3);
          else if (t < TR.cry) pose(P, 'claw', (t - TR.claw) * 0.9);
          else pose(P, 'cry', t - TR.cry < 4.4 ? t - TR.cry : pingOf(t - TR.cry - 4.4, 2.6, 1.6, 2.4)); });
        visionAt(t, TR.open, 1.6);
        goddess(smo(c01((t - TR.open - 0.6) / 6)));
        /* THE LENS: her face (three quarters, a pace off); a turn to Mala for her two lines; back to her as the vision
           opens, wide enough for the thing on her back and his teacher's bowed head behind; drawn to the shout, Ravi
           caught at the room's edge and followed in to her chair; then all of them. (Ravi's marks are where the rush take
           puts his body at those moments: RS turned by RS.ry, its hips' own travel) */
        const RV = (tk, y) => { const h = RUSH_AT(tk); return [RS.x - 0.05 * h[0] - 0.9987 * h[1], y, RS.z + 0.9987 * h[0] - 0.05 * h[1]]; };
        track(t, [
          { t: 0, name: 'her', eye: S_EYE, at: [CHAIR.x - 0.01, 0.99, CHAIR.z - 0.05], fp: 46, fd: 40 },
          { t: TR.ml1 - 0.5, name: 'her', eye: S_EYE, at: [CHAIR.x - 0.015, 0.99, CHAIR.z], fp: 46, fd: 40 },
          { t: TR.ml1 + 0.3, name: 'mala', eye: S_EYE, at: [MALA_T.x + 0.01, 1.36, MALA_T.z + 0.09], fp: 46, fd: 42 },
          { t: TR.ml2 + 1.6, name: 'mala', eye: S_EYE, at: [MALA_T.x + 0.05, 1.37, MALA_T.z + 0.08], fp: 46, fd: 42 },
          { t: TR.open + 0.3, name: 'vision', eye: S_EYE, at: [CHAIR.x - 0.1, 1.04, CHAIR.z + 0.13], fp: 56, fd: 48 },
          { t: TR.cry + 0.4, name: 'vision', eye: S_EYE, at: [CHAIR.x - 0.1, 1.06, CHAIR.z + 0.11], fp: 58, fd: 50 },
          { t: TR.cry + 1.8, name: 'cry', eye: S_EYE, at: [CHAIR.x - 0.13, 1.32, CHAIR.z - 0.1], fp: 66, fd: 56 },
          { t: TR.rv - 0.1, name: 'cry', eye: S_EYE, at: [CHAIR.x - 0.13, 1.34, CHAIR.z - 0.13], fp: 66, fd: 56 },
          { t: TR.rv + 0.55, name: 'ravi', eye: S_EYE, at: RV(0.95, 1.32), fp: 60, fd: 54 },
          { t: TR.rush + 1.6, name: 'ravi', eye: S_EYE, at: RV(1.68, 1.25), fp: 60, fd: 54 },
          { t: TR.back, name: 'ravi', eye: S_EYE, at: [R1.x, 1.32, R1.z], fp: 60, fd: 56 },
          { t: TR.back + 1.0, name: 'end', eye: S_EYE, at: END_AIM, fp: 64, fd: 58 },
          { t: TR.end, name: 'end', eye: S_EYE, at: END_AIM, fp: PLAY_FOV, fd: PLAY_FOV }
        ]);
      },
      /* the room as the decision finds it, held still while he chooses: Ravi a step from her, the cry, the light in her,
         his teacher's hand on her head, the vision open (the endings take it from here) */
      end() {
        fLens(PLAY_FOV); filmBed.on = false;
        whenReady(cast.ravi, (P) => { rushAt(P, 2.5); hold(P, 'rush', 2.45, 0.12, 0.2, 1.4); });
        whenReady(cast.amma, (P) => hold(P, 'trance', 8.2, 1.5, 0.3, 3.2));
        whenReady(cast.mala, (P) => hold(P, 'lightlamp', 5.4, 0.2, 0.3, 2.5));
        whenReady(spirits.oppress, (P) => hold(P, 'cry', 2.6, 1.6, 0.3, 2.4));
        if (kit && kit.vision) kit.vision({ r: VR, moving: false });
        handOnHead(cast.phoB, true); crownK = 1;
      }
    };

    /* ---------------------------------------------------------------- HER LIFE RUNS OUT (its clock: LO, z_tail.js)
       Chad, 18 Nov: "If her health bar drops to 0, the player loses this game and chapter and has to restart again". The
       film the loss plays before its card (the fifty-third seam, kit.lose: c_story.js ammaLost). From his place at her front
       left, his sight forced open: the green ones on her, round her chair; her last cry; his teacher's hand lifted from her
       head, his chant already broken off; Mala's gasp at the lamp; Ravi's "Amma..."; her eyes turned to him; his sight shut,
       the wave home; the dark room; black. Every place a function of the film's clock (seven of them round her chair, each
       a fixed spot by its slot: v6.4) */
    const LOST_RING = [[0.62, -0.02], [-0.64, 0.04], [0.30, 0.68], [-0.36, 0.62], [0.54, -0.44], [-0.52, -0.42], [0.02, 0.90]];
    FILMS.lost = {
      begin(api) {
        if (api && api.handsRoot) api.handsRoot.visible = false;
        FM.once = new Set();
        whenReady(cast.pho, (P) => { P.group.visible = false; });
        whenReady(cast.mala, (P) => { put(P, MALA_LAMP.x, MALA_LAMP.z, 0); });
        whenReady(cast.ravi, (P) => { put(P, AT.ravi.x, AT.ravi.z, faceTo(AT.ravi.x, AT.ravi.z, CHAIR.x, CHAIR.z)); });
        spirits.wander.forEach((P, i) => whenReady(P, (Q) => {
          const R = LOST_RING[i]; Q.group.visible = !!R; Q.gone = !R; if (!R) return;
          const x = CHAIR.x + R[0], z = CHAIR.z + R[1]; put(Q, x, z, faceTo(x, z, CHAIR.x, CHAIR.z));
          Q.alpha = 1; if (Q.fx) { Q.fx.set('uAlpha', 1); Q.fx.set('uFill', SPIRIT.wander.fill); } }));
        whenReady(spirits.large, (P) => { P.group.visible = false; P.gone = true; });
        castSolid();
        filmBed.on = true; for (const k in filmBed) if (k !== 'on') filmBed[k] = 0; filmBed.dark = BED.dark;
      },
      frame(t) {
        fLook('DARK');
        whenReady(cast.amma, (P) => { put(P, CHAIR.x, CHAIR.z, CHAIR.ry); pose(P, 'wsit', pingOf(t, 2.0, 3.6, 12));
          if (t > LO.turn) lookNow(P, 'lens', smo(c01((t - LO.turn) / 1.6)), 0.85, 0.05); });                // (R82: a neck's reach)
        phoBless(t, 1 - smo(c01((t - LO.lift) / 0.8)));
        whenReady(cast.mala, (P) => { pose(P, 'kneelhold', pingOf(t, 2.5, 1.0, 6.0)); lookNow(P, AMMA_FACE, 1, 0.9); });
        whenReady(cast.ravi, (P) => { pose(P, 'Idle_3', 3 + t * 0.35, true); lookNow(P, AMMA_FACE, 1, 0.9); });
        whenReady(spirits.oppress, (P) => { oppRide(P); pose(P, 'cling', 2 + t * 0.3); });
        spirits.wander.forEach((P, i) => { if (LOST_RING[i]) whenReady(P, (Q) => pose(Q, i % 2 ? 'creep' : 'crawl', 0.37 * i + t * 0.9, true)); });
        goddess(0);
        visionAt(t, 0.05, 0.9, LO.shut, 1.0);
        /* (18 Nov, photographed on build 19: from S_EYE, 0.9 m off, the lens looked 10 to 17 cm past her face and a phone
           saw her chin and the green ones' backs; from CLOSE_EYE, as the close's own shots of her, at her head as it sits
           in the loss's take, the ring of them round her and her face both held) */
        track(t, [
          { t: 0, name: 'her', eye: CLOSE_EYE, at: [CHAIR.x - 0.04, 0.92, CHAIR.z - 0.02], fp: 60, fd: 50 },
          { t: LO.turn, name: 'her', eye: CLOSE_EYE, at: [CHAIR.x - 0.02, 0.97, CHAIR.z - 0.04], fp: 50, fd: 44 },
          { t: LO.shut + 1.0, name: 'her', eye: CLOSE_EYE, at: [CHAIR.x - 0.01, 0.99, CHAIR.z - 0.05], fp: 40, fd: 36 },
          { t: LO.end, name: 'her', eye: CLOSE_EYE, at: [CHAIR.x - 0.01, 0.99, CHAIR.z - 0.05], fp: 40, fd: 36 }
        ]);
      },
      end() {
        fLens(PLAY_FOV); filmBed.on = false;
        if (kit && kit.vision) kit.vision({ r: 0, moving: false });
        whenReady(cast.phoB, (P) => bowSet(P, 0));
      }
    };

    /* ---------------------------------------------------------------- THE FOUR ENDINGS (§4.5) AND THE CLOSE
       Each ending begins on the trance's last frame (Ravi a step from her chair, the thing crying on her back, his
       teacher's hand on her head) and is a whole story: what he did, how it was answered, what it cost him, what he was
       told; then THE CLOSE, the same for all four: the release dedicated to all beings, the green shapes easing out of
       the room, her first steps to her altar, the sacred ash on her forehead, her palms together, his sight closing,
       and his teacher's word to the family. Every picture here is his eyes */
    const STAND = { x: CHAIR.x, z: CHAIR.z + 0.62 };                         // where her first steps take her, before her altar
    /* ending A: his eyes as he holds Ravi from behind (pulled back with him as the struggle drags them both), and
       Ravi's way to her afterwards, round the stool's far side to her left */
    /* (18 Nov: from her side of him Ravi was 29 degrees out of a phone's frame, the struggle never seen: the eye is now
       behind his shoulder on the line from him to her, and is pulled back with him, against the armchair's end) */
    const A_EYE = [[R1.x + 0.58, 1.62, R1.z - 0.28], [R1.x + 0.68, 1.62, R1.z - 0.36]];
    const A_WALK = [{ x: R1.x + 0.32, z: R1.z + 0.42 }, { x: R1.x - 0.02, z: R1.z + 0.56 }];
    const STEPS_TK = 0.9;                                                     // her steps take run to here: 0.28 m by its own travel
    /* (R79, 18 Nov: at CHAIR + (-0.42, 0.82) her right shoulder stood 3 cm inside the end of her mother's altar, the cabinet
       that spans x -0.525 to 0.225 and z 4.69 to 5.15 from 1.15 m up (its file's own extent, placed): she stands 0.15 m
       back from it and a little to the wall, her right shoulder 8 cm clear of its end) */
    const MALA_C = { x: CHAIR.x - 0.47, z: CHAIR.z + 0.67 };                 // Mala at her right in the close
    /* Ravi KNEELS at her left in the close (his kneel's own take), looking up at her: on his knees his head is a third of
       a metre under her face from every place the close looks from, and clear of the chair, the lamp and her steps */
    /* (a step behind her left since 18 Nov: at her side he knelt on the line from the merit's eye to her palms, and the
       lamp's shot was the back of his head, photographed) */
    const RAVI_C = { x: CHAIR.x + 0.47, z: CHAIR.z + 0.40 };
    /* the last green shapes in the close (his sight opened again for the merit, every ending: R65): two of the night's wanderers going out by the
       room's open door as his teacher gives them a share of the merit, each crawling its own take's travel toward the
       doorway (its hips go 0.9 m in the 2.3 s it is seen, clear of the bowl, the TV and the sofa) and fading */
    const CLOSE_WANDER = [{ x: 0.60, z: 2.50 }, { x: 0.25, z: 0.72 }].map(W => ({ ...W, ry: faceTo(W.x, W.z, 0, -0.4) }));
    /* Appa in the close (seen while his sight is open for the merit, every ending: R65): standing in the room between the shapes' way out and her
       chair, turned to her, while the merit is given; he does not go with them. (18 Nov, photographed: by his photograph,
       his own place, he stood a step from the close's lens and laid himself over his teacher's shoulder) */
    const APPA_C = { x: 0.10, z: 1.64 };
    /* (the endings' clocks, EN, and the close's, CL, are the chapter's own, z_tail.js: chaptertest reads each scene's length
       from them) */
    /* her rise from the chair (§4.5: "she stands up out of the chair"), standing still after: the rise take run over its
       own five seconds, then held breathing on its end */
    /* (out of her trance's held breath over its first 0.4 s, so her body does not jump the 5 cm between the two takes'
       first moments) */
    /* HER RISE, FOLLOWED (19 Nov, photographed on build 28: the rise take leans her 0.6 m forward before she is up, her
       head sitting back 0.23 m first, and three endings' lenses held still on the chair lost her: from the floor in B her
       head left a phone's frame at 13.6 to 14.4 s, in D the frame held her back with her head at its edge, in C she
       went to its edge). Her head's path through the rise, measured where the films draw it (tools/probes/filmshots.mjs
       WHO, ending B, a tenth of a second at a time) and eased over a second (each point the mean of the half second
       either side, so the sit-back does not jerk the lens), every quarter second from the rise's start, from her chair;
       a lens that follows it holds her head inside a phone's frame through the whole of it (risefix/cam.py, the films'
       own track() carried through each lens: the head's edge at most 0.88 of the half-width in B, 0.78 in C, 0.68 in D,
       where it was 1.56, 0.97 and 1.34) */
    const RISE_HEAD = [[-0.011, 0.877, 0.038], [0.001, 0.899, -0.017], [0.014, 0.925, -0.05], [0.031, 0.939, -0.029], [0.042, 0.933, 0.073], [0.049, 0.925, 0.19], [0.053, 0.918, 0.298], [0.05, 0.928, 0.379], [0.042, 0.979, 0.415], [0.031, 1.065, 0.414], [0.02, 1.161, 0.391], [0.013, 1.246, 0.355], [0.012, 1.299, 0.322], [0.016, 1.319, 0.304], [0.023, 1.32, 0.299], [0.029, 1.318, 0.299], [0.032, 1.317, 0.297], [0.034, 1.316, 0.295], [0.035, 1.316, 0.291]];
    /* (where each ending's lens aims from her eased head: B's from the floor keeps her left of his teacher, C's and D's
       below and beside her face) */
    const RISE_OFF = { B: [0.40, -0.20, 0.20], C: [0.10, -0.20, -0.10], D: [0.15, 0.10, 0.05] };
    function riseAim(tau, off) {
      const f = Math.max(0, Math.min(RISE_HEAD.length - 1.001, tau / 0.25)), i = Math.floor(f), u = f - i, A = RISE_HEAD[i], B = RISE_HEAD[i + 1];
      return [CHAIR.x + lp(A[0], B[0], u) + off[0], lp(A[1], B[1], u) + off[1], CHAIR.z + lp(A[2], B[2], u) + off[2]];
    }
    function ammaRise(t, t0) { whenReady(cast.amma, (P) => { put(P, CHAIR.x, CHAIR.z, CHAIR.ry);
      pose(P, 'rise', t - t0 < 4.9 ? Math.max(0, t - t0) : pingOf(t - t0 - 4.9, 4.6, 0.3, 3.0), false, 'trance', 1 - smo(c01((t - t0) / 0.4)), pingOf(t, 8.2, 1.5, 3.2)); }); }
    /* (R82) a look past a neck's reach: she turns on the spot about her own hips by all but AMMA_NECK of it, eased by k
       (called after ammaRise has posed and placed her this frame, so nothing stacks) */
    const AMMA_NECK = 0.7, _atv = new THREE.Vector3();
    function ammaTurnTo(P, tg, k) {
      if (!P || !P.ready || !P.hips || !(k > 0)) return;
      P.group.updateWorldMatrix(true, true); P.hips.getWorldPosition(_atv); const hx = _atv.x, hz = _atv.z;
      const want = faceTo(hx, hz, tg[0], tg[2]), ry0 = P.group.rotation.y, d = Math.atan2(Math.sin(want - ry0), Math.cos(want - ry0));
      P.group.rotation.y = ry0 + Math.sign(d) * Math.max(0, Math.abs(d) - AMMA_NECK) * k;
      pinHips(P, hx, hz);
    }
    function ammaTrance(t) { whenReady(cast.amma, (P) => { put(P, CHAIR.x, CHAIR.z, CHAIR.ry); pose(P, 'trance', pingOf(t, 8.2, 1.5, 3.2)); }); }
    /* the one on her back: its cry, then torn from her (thrown back and gone in the light) */
    function oppressAt(t, cry, torn) {
      whenReady(spirits.oppress, (P) => {
        if (t >= torn + 1.2) { P.group.visible = false; return; }
        P.group.visible = true; oppRide(P);
        if (t < cry) pose(P, 'cry', pingOf(t, 2.6, 1.6, 2.4));
        else if (t < torn) pose(P, 'cry', Math.min(4.4, 0.4 + (t - cry) * 1.1));
        /* (torn away: its cry's own arch, the head thrown back and the arms flung wide, thrown back off her and up, and
           gone in the light. Its written `torn` begins three metres in the air and falls to the floor: measured 18 Nov,
           tools/probes/takepath.mjs, and not used) */
        else { const k = smo(c01((t - torn) / 1.1)); pose(P, 'cry', lp(1.0, 1.9, k)); P.group.position.z -= 0.6 * k; P.group.position.y += 0.25 * k; }
        if (P.fx) P.fx.set('uAlpha', t < torn ? 1 : 1 - smo(c01((t - torn - 0.3) / 0.9))); });
    }
    /* the green shapes still in the room ease and go as the merit is dedicated */
    function wanderersAt(t, go) {
      spirits.wander.forEach((P, i) => { if (!P.ready || !P.group.visible) return; const k = 1 - smo(c01((t - go - i * 0.6) / 2.2)); P.alpha = k; if (P.fx) P.fx.set('uAlpha', k); });
    }
    FILMS.ending = {
      begin(k, api) {
        if (api && api.handsRoot) api.handsRoot.visible = false;
        FM.once = new Set(); FM.key = k;
        whenReady(cast.pho, (P) => { P.group.visible = false; });
        whenReady(cast.mala, (P) => { put(P, MALA_T.x, MALA_T.z, faceTo(MALA_T.x, MALA_T.z, CHAIR.x, CHAIR.z)); });
        whenReady(cast.ravi, (P) => { put(P, R1.x, R1.z, RAVI_RY); });
        spiritsHome(); castSolid(); goHide();
        filmBed.on = true; for (const q in filmBed) if (q !== 'on') filmBed[q] = 0; filmBed.dark = BED.dark;      // the dark room under every silence
      },
      frame(k, t, api) {
        fLook('DARK');
        const E = EN[k], c = t - E.close;
        if (c < 0) ENDS[k](t, E, api); else closeFrame(k, c, t);
      },
      end() { fLens(PLAY_FOV); goddess(0); goHide(); filmBed.on = false; if (kit && kit.vision) kit.vision(null); }
    };
    /* (R67, Chad, 18 Nov evening: "for option b cutscene, when grandmaster pho suddenly shouts go! , there should be some
       special power effect coming out from him that hits the red spirit, along with a screen shake effect. Just make that
       moment more dramatic"). On "Go." his gold (his alone: v25.5) leaves his thrust hands as a stream of light and
       strikes the thing at his student's eyes (E.hit): a burst where it lands, the thing burned near white and flung back
       off him ON the hit (it had begun back at the word, before anything reached it), and the picture shaken by it. The
       stream and the halo are its hue laid over (a bright wall, or the sight's pale world, would sum an added gold to
       white: v8.8), the burst's core added. Every part a function of the film's clock, so a seek and a skip land on the
       same frame (v6.4) */
    const GOB = { fire: 0.14, n: 16, burst: 0.6, shake: 0.75, amp: 0.045, roll: 0.035, col: 0xffc860 };
    const goFx = { motes: null, burst: null };
    const _gbH = new THREE.Vector3(), _gbL = new THREE.Vector3(), _gbT = new THREE.Vector3();
    function goHide() { if (goFx.motes) for (const sp of goFx.motes.concat(goFx.burst)) sp.visible = false; }
    function goBlast(t, E) {
      if (!goFx.motes) { const tex = dipTex(); owned.push(tex);
        const mk = (add) => { const m = new THREE.SpriteMaterial({ map: tex, color: add ? 0xfff0c8 : GOB.col, transparent: true, depthWrite: false, depthTest: false,
            blending: add ? THREE.AdditiveBlending : THREE.NormalBlending, fog: false });
          mats.push(m); const sp = new THREE.Sprite(m); sp.visible = false; sp.renderOrder = 31; if (ctx.visionLayer != null) sp.layers.enable(ctx.visionLayer); world.add(sp); return sp; };
        goFx.motes = Array.from({ length: GOB.n }, () => mk(false)); goFx.burst = [mk(true), mk(false)]; }
      goHide();
      const t0 = E.go + GOB.fire, travel = E.hit - t0;
      if (t < t0 - 0.02 || t > E.hit + GOB.burst) return;
      /* from between his two hands as the thrust holds them out (his hand bones as this frame draws them); to the thing's
         chest (its head, less a hand's span) */
      const P = cast.phoB, rh = P.ready ? boneOfP(P, 'RightHand') : null, lh = P.ready ? boneOfP(P, 'LeftHand') : null;
      if (rh && lh) { P.group.updateWorldMatrix(true, true); rh.getWorldPosition(_gbH); lh.getWorldPosition(_gbL); _gbH.lerp(_gbL, 0.5); }
      else _gbH.set(P.home.x, 1.3, P.home.z);
      const O = spirits.oppress;
      if (O && O.ready && O.head && O.group.visible) { O.group.updateWorldMatrix(true, true); O.head.getWorldPosition(_gbT); _gbT.y -= 0.2; }
      else _gbT.set(COMES[0], 0.95, COMES[2]);
      /* the stream: motes leaving his hands one after another, each crossing in the bolt's time, the first the largest */
      if (t < E.hit + 0.1) goFx.motes.forEach((sp, i) => {
        const s = (t - t0 - i * 0.011) / travel; if (s < 0 || s > 1.2) return;
        const e = Math.min(1, s), j = ((i * 0.618) % 1) - 0.5;
        sp.position.copy(_gbH).lerp(_gbT, e); sp.position.y += j * 0.05 * (1 - e); sp.position.x += j * 0.04 * Math.sin(e * 3.1);
        sp.scale.setScalar((i === 0 ? 0.15 : 0.07) + 0.06 * Math.sin(Math.PI * e));
        sp.material.opacity = Math.min(1, s * 5) * (s > 1 ? Math.max(0, 1 - (s - 1) / 0.2) : 1) * (i === 0 ? 1 : 0.85); sp.visible = true; });
      /* the burst where it lands: a hot core and a wider halo of his gold, out fast and gone */
      const b = (t - E.hit) / GOB.burst;
      if (b >= 0 && b < 1) { const [core, halo] = goFx.burst, f = 1 - b;
        core.position.copy(_gbT); core.scale.setScalar(0.16 + 0.6 * Math.sqrt(b)); core.material.opacity = f * f; core.visible = true;
        halo.position.copy(_gbT); halo.scale.setScalar(0.35 + 1.7 * b); halo.material.opacity = 0.6 * f; halo.visible = true; }
    }
    /* the picture shaken by the hit: the lens knocked off its line and back, fast and dying away; laid on after the track
       has placed it this frame, so the shot itself never moves */
    function goShake(t, E) {
      const u = t - E.hit; if (u < 0 || u > GOB.shake) return;
      const k = Math.pow(1 - u / GOB.shake, 2), a = GOB.amp * k;
      yaw.position.x += a * (0.6 * Math.sin(u * 71) + 0.4 * Math.sin(u * 43 + 1.7));
      yaw.position.y += a * 0.7 * (0.6 * Math.sin(u * 83 + 0.4) + 0.4 * Math.sin(u * 37 + 2.1));
      camera.rotation.z += GOB.roll * k * Math.sin(u * 59 + 0.9);
    }
    /* the thing burned near white on the hit, settling back to its red over half a second (R60's flash, its own colours) */
    const GO_WHITE = new THREE.Color(0xfff1d8), _goC = new THREE.Color();
    function goFlash(P, t, E) { if (!P.fx) return; const u = t - E.hit;
      const k = u < 0 ? 0 : u < 0.05 ? u / 0.05 : Math.max(0, 1 - (u - 0.05) / 0.45);
      P.fx.set('uColor', _goC.set(SPIRIT.oppress.color).lerp(GO_WHITE, k)); P.fx.set('uFill', SPIRIT.oppress.fill + 2.0 * k); }

    /* NO BODY HELD ON ONE FRAME THROUGH A FILM (R66 and R68, Chad, 18 Nov evening: "for option a cutscene, the yellow
       female model is stuck in an awkward unnatural pose when she says 'stop it you two' , and continues getting stuck in
       that pose after saying it"; "for option d cutscene, the yellow female model is also stuck in a pose when the auntie
       stands up from the wheelchair"). Mala at her lamp breathes (a slow there-and-back over the take's still end, never its
       frame 5.4 held); her calls are her own talking takes for each line's measured length (the written scream that held a
       hand up beside her face is not used); after a line she eases into her stand, alive, and turns to her mother */
    const MALA_LAMPT = (t) => pingOf(t, 5.3, 0.15, 3.6);
    /* her talking take for a line: `into` and `out` 0..1 as it begins and ends, over her stand (or her lamp before it) */
    function malaCall(P, t, at, L, take, under, underT) {
      const into = smo(c01((t - at + 0.15) / 0.35)), out = smo(c01((t - at - L - 0.15) / 0.9)), k = into * (1 - out);
      if (k <= 0.001) return false;
      pose(P, take, Math.max(0, t - at + 0.15) * 1.05, true, under, 1 - k, underT);
      return true;
    }

    const ENDS = {
      /* A · HE GRABS HIM AND HOLDS HIM BACK (worst). His arms round Ravi from the side, Ravi fighting him toward his
         mother, Mala screaming at them both; the cry peaks and the thing is torn from her in the light; she opens her
         eyes on a room of people struggling and stands, and her son is not beside her. Ravi goes still; then goes to her.
         His teacher, after; his own thought */
      A(t, E) {
        const RG = { x: R1.x + 0.05, z: R1.z - 0.05 };                       // Ravi, held
        ammaRise(t, E.rise); if (t < E.rise) ammaTrance(t);
        /* standing, she looks back over her shoulder for her son: held back, behind her (her face turned to him and to
           us; a neck's reach, the rest of the turn is his to see), and calls him ("Ravi?" at E.call: 18 Nov, photographed,
           said at 10.7 it fell while she was still pushing up out of the chair, her face down; he goes still on her voice) */
        /* (R82, Chad, 18 Nov: "when amma turns her head, it looks unnatural as it is impossible for a neck to turn 90 degrees
           like that", with his photograph of this moment: her head alone turned 1.25 rad on top of her take's own turn.
           Now she turns on the spot to her son, about her own hips, by all of the turn but a neck's, and her head does
           the last of it) */
        if (t > E.call - 0.6) whenReady(cast.amma, (P) => { const tg = headOf(cast.ravi, [RG.x, 1.4, RG.z]), k = smo(c01((t - E.call + 0.6) / 1.4));
          ammaTurnTo(P, tg, k); lookNow(P, tg, k, AMMA_NECK, 0.04); });
        phoBless(t, 1 - smo(c01((t - E.rise + 0.4) / 0.8)));
        oppressAt(t, E.cry, E.torn); goddess(t < E.torn ? 1 : 1 - smo(c01((t - E.torn) / 1.5)));
        /* Ravi: fighting his hold until she rises (the take run to its end by then: it ran out and froze 3 s early);
           going still where the struggle has pulled him (his group drawn under him as the stand takes over, so his body
           stays put: the hips blend in a straight line between the two takes); then to her, round his teacher's stool by
           its far side, the walk paced by the ground it covers (1.29 m a second at its own rate, measured), and turned to
           her at the end */
        whenReady(cast.ravi, (P) => {
          const ds = hipsTravel(P, 'struggle', 5.9), c = Math.cos(RAVI_RY), sn = Math.sin(RAVI_RY);
          const DS = [ds[0] * c + ds[1] * sn, -ds[0] * sn + ds[1] * c], B0 = { x: RG.x + DS[0], z: RG.z + DS[1] };
          if (t < E.still) { put(P, RG.x, RG.z, RAVI_RY); pose(P, 'struggle', Math.min(5.9, t * 5.9 / E.still)); }
          else if (t < E.go) { const w = smo(c01((t - E.still) / 0.6)); put(P, RG.x + DS[0] * w, RG.z + DS[1] * w, RAVI_RY);
            pose(P, 'Idle_3', 3 + (t - E.still) * 0.4, true, 'struggle', 1 - w, 5.9); }
          else { const W1 = A_WALK[0], W2 = A_WALK[1], L1 = Math.hypot(W1.x - B0.x, W1.z - B0.z), L2 = Math.hypot(W2.x - W1.x, W2.z - W1.z), L = L1 + L2, T = L / 0.62;
            const sA = L * smo(c01((t - E.go) / T)), on1 = sA < L1, k1 = sA / Math.max(1e-3, L1), k2 = (sA - L1) / Math.max(1e-3, L2);
            const h1 = faceTo(B0.x, B0.z, W1.x, W1.z), h2 = faceTo(W1.x, W1.z, W2.x, W2.z), h3 = faceTo(W2.x, W2.z, CHAIR.x, CHAIR.z);
            const ry = sA < 0.25 ? lp(RAVI_RY, h1, smo(sA / 0.25)) : sA < L1 - 0.12 ? h1 : sA < L1 + 0.12 ? lp(h1, h2, smo((sA - L1 + 0.12) / 0.24)) : lp(h2, h3, smo(c01((sA - L + 0.25) / 0.25)));
            put(P, on1 ? lp(B0.x, W1.x, k1) : lp(W1.x, W2.x, k2), on1 ? lp(B0.z, W1.z, k1) : lp(W1.z, W2.z, k2), ry);
            const into = smo(c01((t - E.go) / 0.4)), outOf = smo(c01((t - E.go - T + 0.3) / 0.5));
            if (outOf <= 0) pose(P, 'Walking', sA / 1.29, true, 'Idle_3', 1 - into, 3 + (E.go - E.still) * 0.4);
            else pose(P, 'Idle_3', 3 + (t - E.go) * 0.4, true, 'Walking', 1 - outOf, sA / 1.29);
            lookNow(P, AMMA_FACE, smo(c01((t - E.go - 0.6) / 1)), 0.9); } });
        /* (R46, Chad, 18 Nov evening: "when the daughter model at the end tries to gesture with her hand to block the auntie,
           her hand clips into the altar": knelt at the lamp she faces the shrine's wall, and her scream's hand went out into
           her mother's altar. She turns on her knees to her mother as she cries out, so the hand goes out toward her) */
        /* (R66: at her lamp, breathing; on her cry turned to the two men, calling to them with her talking take, its right hand
           opened to them, for the line's length; then into her stand, turned back to her mother, her eyes on her as she rises) */
        whenReady(cast.mala, (P) => {
          const L = SECS.ml4A1 || 2.3, s1 = E.scream + L + 0.15, back = smo(c01((t - s1) / 1.2)), turn = smo(c01((t - E.scream + 0.15) / 0.45));
          const stand = smo(c01((t - E.scream + 0.15) / 0.35));
          if (!malaCall(P, t, E.scream, L, 'Talk_with_Right_Hand_Open', t < s1 ? 'lightlamp' : 'Idle_3', t < s1 ? MALA_LAMPT(t) : 2 + (t - s1) * 0.35)
              && !malaCall(P, t, E.Rm, SECS.ml4R1 || 3.5, 'Stand_and_Chat', 'Idle_3', 2 + Math.max(0, t - s1) * 0.35)) {
            if (stand <= 0.001) pose(P, 'lightlamp', MALA_LAMPT(t)); else pose(P, 'Idle_3', 2 + Math.max(0, t - s1) * 0.35, true); }
          P.group.rotation.y = lpA(lpA(0, faceTo(MALA_T.x, MALA_T.z, RG.x, RG.z), turn), MALA_TO_HER, back);
          lookNow(P, t < s1 ? [RG.x, 1.5, RG.z] : (t < E.rise ? AMMA_FACE : HER_HEAD()), t < s1 ? 0.8 : 0.9, 0.9); });
        visionAt(t, -1, 0.1, E.sight, E.sightFor);                       // (R55, R65: his sight home to him before she stands)
        /* THE LENS: in on Ravi's shoulder as he is caught (his mother beyond him); held through the cry; the light; out
           to her standing; on his teacher for his word */
        track(t, [
          { t: 0, name: 'S', eye: DEC_EYE, at: DEC_AT, fp: PLAY_FOV, fd: PLAY_FOV },
          { t: 0.55, name: 'held', eye: A_EYE[0], at: [CHAIR.x + 0.1, 1.15, CHAIR.z - 0.05], fp: 64, fd: 56 },
          { t: E.open, name: 'held', eye: A_EYE[1], at: [CHAIR.x + 0.08, 1.1, CHAIR.z], fp: 62, fd: 56 },
          { t: E.rise + 3.5, name: 'her', eye: A_EYE[1], at: [CHAIR.x, 1.4, CHAIR.z + 0.32], fp: 56, fd: 52 },
          { t: E.ph - 0.6, name: 'her', eye: A_EYE[1], at: [CHAIR.x + 0.02, 1.42, CHAIR.z + 0.32], fp: 56, fd: 52 },
          { t: E.ph + 0.4, name: 'pho', eye: A_EYE[1], at: [cast.phoB.home.x, 1.55, cast.phoB.home.z], fp: 46, fd: 42 },
          { t: E.close, name: 'pho', eye: A_EYE[1], at: [cast.phoB.home.x, 1.55, cast.phoB.home.z], fp: 46, fd: 42 }
        ]);
        phoTurn(t, E.ph, false, 'ph4A1');
      },
      /* B · HE THROWS THE WATER AT THE THING ON HER BACK (bad). The whole bowl at it: it lets go of her and comes at
         HIM, the vision filled with it, his heart stalling, the picture white. His teacher's hand leaves her head for the
         one moment it takes ("Go."); her trance falters; his hands return; the cry rises again and it is forced away.
         She opens her eyes and stands; he is on the floor. His teacher; his own thought */
      B(t, E) {
        const B_FLOOR = [S_EYE[0] + 0.1, 0.45, S_EYE[2] + 0.2];        // his eyes, on the floor
        ammaRise(t, E.rise);
        /* her trance falters while his hand is off her head (Mala's "Amma!"): her raised hands sink and her body gives
           toward her chair's rest, and comes back up as his hand returns */
        if (t < E.rise) { const f = smo(c01((t - E.falter) / 0.5)) * (1 - smo(c01((t - E.back) / 0.9)));
          if (f > 0.001) whenReady(cast.amma, (P) => { put(P, CHAIR.x, CHAIR.z, CHAIR.ry); pose(P, 'trance', pingOf(t, 8.2, 1.5, 3.2), false, 'wsit', 0.7 * f, 2.8); });
          else ammaTrance(t); }
        const off = t >= E.push && t < E.back;
        phoBless(t, off ? 1 - smo(c01((t - E.push) / 0.25)) : (t < E.push ? 1 : smo(c01((t - E.back) / 0.4))) * (1 - smo(c01((t - E.rise + 0.4) / 0.8))));
        /* the thing: off her back and at him (from her shoulder to a hand's breadth from his eyes), then back on her
           when his teacher's hand returns, its cry, and torn away */
        whenReady(spirits.oppress, (P) => {
          if (t >= E.torn + 1.2) { P.group.visible = false; return; }
          P.group.visible = true;
          const eye = COMES;
          if (t >= E.comes && t < E.back) {
            /* (off her back by m: from where it rides her to a hand's breadth from his eyes, turned to face him; back as
               his teacher's hand returns) */
            const u = smo(c01((t - E.comes) / 0.9)), w = smo(c01((t - E.hit) / 0.45)), m = u * (1 - w);      // (R67: flung back by the light)
            oppRide(P); _obq.copy(P.group.quaternion);
            const g = P.group.position, x = lp(g.x, eye[0], m), z = lp(g.z, eye[2], m), y = lp(g.y, eye[1] - 0.75, m);
            _ofq.setFromEuler(_ofe.set(0, faceTo(x, z, S_EYE[0], S_EYE[2]), 0));
            P.group.position.set(x, y, z); P.group.quaternion.slerpQuaternions(_obq, _ofq, m); pose(P, 'claw', (t - E.comes) * 1.2);
          } else { oppRide(P);
            if (t < E.comes) pose(P, 'cry', pingOf(t, 2.6, 1.6, 2.4));
            else if (t < E.torn) pose(P, 'cry', Math.min(4.4, 0.4 + (t - E.cry) * 1.1));
            else { const k = smo(c01((t - E.torn) / 1.1)); pose(P, 'cry', lp(1.0, 1.9, k)); P.group.position.z -= 0.6 * k; P.group.position.y += 0.25 * k; } }
          if (P.fx) P.fx.set('uAlpha', t < E.torn ? 1 : 1 - smo(c01((t - E.torn - 0.3) / 0.9)));
          goFlash(P, t, E); });
        goddess(t < E.falter ? 1 : t < E.back ? 0.35 : t < E.torn ? lp(0.35, 1, smo(c01((t - E.back) / 1.2))) : 1 - smo(c01((t - E.torn) / 1.5)));
        whenReady(cast.ravi, (P) => { rushHeld(P, t); lookNow(P, t < E.rise ? AMMA_FACE : HER_HEAD(), 1, 0.9); });
        /* Mala: crying out as the water hits her mother ("What are you doing?"), and at the falter ("Amma!"); her scream
           let go once her mother is up, and her eyes down to him on the floor ("Are you alright?") */
        /* (R68's law here too: her three lines each her talking take for its length, over her stand between them, alive;
           never the written scream held for eight seconds) */
        whenReady(cast.mala, (P) => {
          const st = smo(c01((t - E.splash + 0.15) / 0.35)), idle = 2 + Math.max(0, t - E.splash) * 0.35;
          if (!malaCall(P, t, E.splash, SECS.ml4B1 || 1.7, 'Talk_with_Right_Hand_Open', st < 1 ? 'lightlamp' : 'Idle_3', st < 1 ? MALA_LAMPT(t) : idle)
              && !malaCall(P, t, E.ml2, SECS.ml4B2 || 1.0, 'Talk_with_Right_Hand_Open', 'Idle_3', idle)
              && !malaCall(P, t, E.Rm, SECS.ml4R1 || 3.5, 'Stand_and_Chat', 'Idle_3', idle)
              && !malaCall(P, t, E.ok, SECS.ml4B3 || 1.6, 'Stand_and_Chat', 'Idle_3', idle)) {
            if (st <= 0.001) pose(P, 'lightlamp', MALA_LAMPT(t)); else pose(P, 'Idle_3', idle, true); }
          P.group.rotation.y = lpA(0, MALA_TO_HER, smo(c01((t - E.splash + 0.1) / 0.5)));           // (R46: to her mother, not into the altar)
          lookNow(P, lp3(t < E.rise ? AMMA_FACE : HER_HEAD(), B_FLOOR, smo(c01((t - E.ok + 0.5) / 0.6))), 0.8, 0.9); });
        visionAt(t, -1, 0.1, E.sight, E.sightFor);                       // (R55, R65: his sight home to him before she stands)
        /* THE LENS: the throw (a lurch at her); the thing filling his eyes; white; his teacher's push seen through the
           white; then he is on the floor, looking up at her standing, and at his teacher */
        track(t, [
          { t: 0, name: 'S', eye: DEC_EYE, at: DEC_AT, fp: PLAY_FOV, fd: PLAY_FOV },
          { t: E.throw + 0.25, name: 'throw', eye: [S_EYE[0] + TOWARD[0] * 0.2, 1.58, S_EYE[2] + TOWARD[1] * 0.2], at: [CHAIR.x - 0.05, 1.0, CHAIR.z - 0.2], fp: 58, fd: 52 },
          { t: E.comes + 0.9, name: 'it', eye: [S_EYE[0] - TOWARD[0] * 0.06, 1.6, S_EYE[2] - TOWARD[1] * 0.06], at: [COMES[0], 1.3, COMES[2]], fp: 70, fd: 64 },
          { t: E.floor, name: 'down', eye: [S_EYE[0] - TOWARD[0] * 0.1, 1.58, S_EYE[2] - TOWARD[1] * 0.1], at: [COMES[0], 1.25, COMES[2]], fp: 68, fd: 62 },
          { t: E.floor + 0.6, name: 'floor', eye: [S_EYE[0] + 0.1, 0.42, S_EYE[2] + 0.2], at: [cast.phoB.home.x, 1.3, cast.phoB.home.z + 0.2], fp: 66, fd: 58, roll: 0.12 },
          { t: E.back + 0.6, name: 'floor', eye: [S_EYE[0] + 0.1, 0.42, S_EYE[2] + 0.2], at: [CHAIR.x + 0.2, 0.95, CHAIR.z], fp: 66, fd: 58, roll: 0.1 },
          /* (19 Nov: her rise followed, RISE_HEAD: from the floor her head went off a phone's left edge as she leaned) */
          { t: E.rise, name: 'floor', eye: [S_EYE[0] + 0.1, 0.42, S_EYE[2] + 0.2], at: [CHAIR.x + 0.14, 1.10, CHAIR.z + 0.06], fp: 66, fd: 58, roll: 0.08 },
          { t: E.rise + 0.8, name: 'rise', eye: [S_EYE[0] + 0.1, 0.42, S_EYE[2] + 0.2], at: () => riseAim(t - E.rise, RISE_OFF.B), fp: 66, fd: 58, roll: 0.07 },
          { t: E.rise + 3.4, name: 'rise', eye: [S_EYE[0] + 0.1, 0.42, S_EYE[2] + 0.2], at: () => riseAim(t - E.rise, RISE_OFF.B), fp: 66, fd: 58, roll: 0.06 },
          { t: E.rise + 4.5, name: 'floor', eye: [S_EYE[0] + 0.1, 0.42, S_EYE[2] + 0.2], at: [CHAIR.x + 0.1, 1.2, CHAIR.z + 0.1], fp: 62, fd: 56, roll: 0.05 },
          { t: E.ph + 0.3, name: 'pho', eye: [S_EYE[0] + 0.1, 0.45, S_EYE[2] + 0.2], at: [cast.phoB.home.x, 1.55, cast.phoB.home.z], fp: 52, fd: 46 },
          { t: E.close, name: 'pho', eye: [S_EYE[0] + 0.1, 0.45, S_EYE[2] + 0.2], at: [cast.phoB.home.x, 1.55, cast.phoB.home.z], fp: 52, fd: 46 }
        ]);
        phoTurn(t, E.ph, true, 'ph4B1');
        /* his teacher's push: turned toward the thing that went for his student, both hands thrust out at it and held,
           then back to his stand as his hand goes back to her head (18 Nov, photographed: the cast that raises both arms
           threw his head back behind its own raised robe, and from the floor he read headless; this cast's thrust keeps
           his head up and forward, 1.34 m, over his hands: tools/probes/takepath.mjs) */
        if (t >= E.push - 0.05 && t < E.back) whenReady(cast.phoB, (P) => {
          const w = smo(c01((t - E.push) / 0.3)) * (1 - smo(c01((t - E.back + 0.45) / 0.45)));
          const d0 = faceTo(P.home.x, P.home.z, S_EYE[0], S_EYE[2]) - P.home.ry, d = Math.atan2(Math.sin(d0), Math.cos(d0));
          P.group.rotation.y = P.home.ry + d * w;
          /* (held at the take's 0.95: from 1.0 on it crosses both arms over his face, and from the floor, at its 1.32, he read
             headless again: build 13, photographed at 4.0) */
          pose(P, 'mage_soell_cast_3', runOf(t, E.push, E.push + 0.6, 0.5, 0.95), false, 'Sit_to_Stand_Transition_M', 1 - w, pingOf(t, 5.85, 0.25, PHO_BREATH)); });
        goBlast(t, E); goShake(t, E);                                     // (R67: his light at the thing, and the hit felt)
      },
      /* C · HE GOES TO HIM (best). Between Ravi and the chair, his hands open, low: "She's not being hurt. It's leaving
         her. Stay with her. Hold her hand." Ravi kneels by the chair and takes her hand; Mala comes to the other side.
         The cry; the thing forced from her back; she opens her eyes, looks at her son, and stands, holding his hand */
      C(t, E) {
        const KR = KNEEL_R, KM = { x: CHAIR.x - 0.48, z: CHAIR.z + 0.2 };
        if (t < E.rise) ammaTrance(t); else ammaRise(t, E.rise);
        phoBless(t, 1 - smo(c01((t - E.rise + 0.4) / 0.8)));
        oppressAt(t, E.cry, E.torn); goddess(t < E.torn ? 1 : 1 - smo(c01((t - E.torn) / 1.5)));
        /* (Ravi held where his rush stopped, his eyes on the one who stops him; on "Hold her hand" he goes to her side and
           kneels, his eyes turning from him to her; Mala comes round to her other side and kneels too: walkKneel) */
        whenReady(cast.ravi, (P) => {
          if (t < E.kneel) { rushHeld(P, t); lookNow(P, CR_EYE, smo(c01((t - 0.5) / 0.8)), 0.8); }
          else if (t > E.rise + 3.6) { put(P, KR.x, KR.z, faceTo(KR.x, KR.z, CHAIR.x, CHAIR.z + 0.2));        // (R68: stood again, alive)
            const it = 2 + (t - E.rise - 3.6) * 0.35;
            if (!malaCall(P, t, E.Rv, SECS.rv4R1 || 4.6, 'Stand_and_Chat', 'Idle_3', it))
              pose(P, 'Idle_3', it, true, 'kneelhold', 1 - smo(c01((t - E.rise - 3.6) / 0.8)), 0.2);
            lookNow(P, HER_HEAD(), 1, 0.9); }
          else { walkKneel(P, t, E.kneel, rushXZ(P, 2.5), KR, faceTo(KR.x, KR.z, CHAIR.x, CHAIR.z + 0.2), ['rush', pingOf(E.kneel, 2.45, 0.12, 1.4)],
              { ry0: RAVI_RY, kt: (td) => (t < E.rise ? (td < 4.2 ? td : pingOf(td - 4.2, 4.05, 0.15, 3.4)) : runOf(t, E.rise + 0.6, E.rise + 3.6, 4.2, 0.2)) });
            lookNow(P, lp3(CR_EYE, AMMA_FACE, smo(c01((t - E.kneel) / 0.5))), 1, 0.9); } });
        whenReady(cast.mala, (P) => {
          if (t < E.mala) { pose(P, 'lightlamp', MALA_LAMPT(t)); lookNow(P, AMMA_FACE, 1, 0.9); }
          else if (t > E.rise + 3.8) { put(P, KM.x, KM.z, faceTo(KM.x, KM.z, CHAIR.x, CHAIR.z + 0.2));        // (R68: stood again, alive)
            const it = 2 + (t - E.rise - 3.8) * 0.35;
            if (!malaCall(P, t, E.Rm, SECS.ml4R1 || 3.5, 'Stand_and_Chat', 'Idle_3', it))
              pose(P, 'Idle_3', it, true, 'kneelhold', 1 - smo(c01((t - E.rise - 3.8) / 0.8)), 0.2);
            lookNow(P, HER_HEAD(), 1, 0.9); }
          else { walkKneel(P, t, E.mala, MALA_T, KM, faceTo(KM.x, KM.z, CHAIR.x, CHAIR.z + 0.2), ['lightlamp', 5.4],
              { ry0: faceTo(MALA_T.x, MALA_T.z, CHAIR.x, CHAIR.z), kt: (td) => (t < E.rise ? (td < 4.2 ? td : pingOf(td - 4.2, 4.05, 0.15, 3.4)) : runOf(t, E.rise + 0.8, E.rise + 3.8, 4.2, 0.2)) });
            lookNow(P, AMMA_FACE, 1, 0.9); } });
        /* she looks at her son before she stands */
        /* (19 Nov, photographed on build 28 at 17.0 s: held on her kneeling son's head through her rise, the look turned
           her head down and sideways into her lap as she leaned forward to stand, a neck's reach on a body bent double.
           Now it eases off as she gathers herself, she looks where she is going through the lean, and back to him as she
           straightens, up to his standing face: R82's reach kept) */
        if (t >= E.look) whenReady(cast.amma, (P) => { const away = smo(c01((t - E.rise) / 0.5)) * (1 - smo(c01((t - E.rise - 2.6) / 0.9)));
          lookNow(P, headOf(cast.ravi, [KR.x, 0.9, KR.z]), smo(c01((t - E.look) / 0.8)) * (1 - away), 0.85); });   // (R82: a neck's reach)
        visionAt(t, -1, 0.1, E.sight, E.sightFor);                       // (R55, R65: his sight home to him before she stands)
        track(t, [
          { t: 0, name: 'S', eye: DEC_EYE, at: DEC_AT, fp: PLAY_FOV, fd: PLAY_FOV },
          { t: 0.65, name: 'ravi', eye: CR_EYE, at: CR_HEAD, fp: 58, fd: 50 },
          { t: E.kneel, name: 'ravi', eye: CR_EYE, at: CR_HEAD, fp: 58, fd: 50 },
          /* (19 Nov, photographed on build 28 at 6.0 s: the lens turned from his face to the two of them over 1.9 s while he
             walked to her in 1.04 (walkKneel: 0.64 m at 0.62 m a second), so it trailed him, his shoulder a blur at a
             phone's left edge, 16 degrees out where its half-width is 18.5, and the sofa held the frame. Now he is followed
             to her side: the look rides the line his head walks, over the walk's own time and ease (its head at his
             kneeling place, KNEEL_R), while his eyes step back out of his way; then down to the two of them as he kneels) */
          { t: E.kneel + 1.05, name: 'follow', eye: CK_EYE, at: [KNEEL_R.x, 1.42, KNEEL_R.z], fp: 60, fd: 52 },
          { t: E.kneel + 2.2, name: 'kneel', eye: CK_EYE, at: CK_AT, fp: 62, fd: 54 },
          { t: E.rise, name: 'kneel', eye: CK_EYE, at: CK_AT, fp: 62, fd: 54 },
          /* (19 Nov: her rise followed, RISE_HEAD; and once she stands the lens a few centimetres to its left, so the edge of
             her son's face is not sliced by a phone's right edge through his line, build 28 at 21.0 s) */
          { t: E.rise + 0.8, name: 'rise', eye: CK_EYE, at: () => riseAim(t - E.rise, RISE_OFF.C), fp: 62, fd: 54 },
          { t: E.rise + 3.4, name: 'rise', eye: CK_EYE, at: () => riseAim(t - E.rise, RISE_OFF.C), fp: 62, fd: 54 },
          { t: E.rise + 4.5, name: 'stand', eye: CK_EYE, at: [CHAIR.x, 1.22, CHAIR.z + 0.30], fp: 58, fd: 52 },
          { t: E.ph - 0.4, name: 'stand', eye: CK_EYE, at: [CHAIR.x, 1.28, CHAIR.z + 0.34], fp: 58, fd: 52 },
          { t: E.ph + 0.5, name: 'pho', eye: C_PHO_EYE, at: [cast.phoB.home.x, 1.58, cast.phoB.home.z], fp: 46, fd: 42, cut: true },   // (R80)
          { t: E.close, name: 'pho', eye: C_PHO_EYE, at: [cast.phoB.home.x, 1.58, cast.phoB.home.z], fp: 46, fd: 42 }
        ]);
        phoTurn(t, E.ph, false, 'ph4C1');
      },
      /* D · HE KEEPS HIS PLACE (good). The bowl steady, his sight shut, his eyes on his teacher. Ravi reaches the chair;
         his teacher, without looking up: "Ravi. Hold her hand." He does. The cry is heard; the light; she opens her eyes
         and stands. His teacher; his own thought */
      D(t, E) {
        const KR = KNEEL_R;
        if (t < E.rise) ammaTrance(t); else ammaRise(t, E.rise);
        phoBless(t, 1 - smo(c01((t - E.rise + 0.4) / 0.8)));
        oppressAt(t, E.cry, E.torn); goddess(t < E.torn ? 1 : 1 - smo(c01((t - E.torn) / 1.5)));
        /* (Ravi reaches the chair: a step out of his rush toward her, standing there while his teacher speaks to him; on
           "Hold her hand" round to her side and down onto his knees: walkKneel, its two legs) */
        whenReady(cast.ravi, (P) => {
          const RX = rushXZ(P, 2.5), R2 = { x: RX.x - 0.12, z: RX.z + 0.18 }, r2 = faceTo(R2.x, R2.z, CHAIR.x, CHAIR.z);
          if (t > E.rise + 3.6) { put(P, KR.x, KR.z, faceTo(KR.x, KR.z, CHAIR.x, CHAIR.z + 0.2));
            const it = 2 + (t - E.rise - 3.6) * 0.35;
            if (!malaCall(P, t, E.Rv, SECS.rv4R1 || 4.6, 'Stand_and_Chat', 'Idle_3', it))
              pose(P, 'Idle_3', it, true, 'kneelhold', 1 - smo(c01((t - E.rise - 3.6) / 0.8)), 0.2);
            lookNow(P, HER_HEAD(), 1, 0.9); return; }
          if (t < E.reach) rushHeld(P, t);
          else if (t < E.kneel) walkKneel(P, t, E.reach, RX, R2, r2, ['rush', pingOf(E.reach, 2.45, 0.12, 1.4)], { ry0: RAVI_RY, kneelAt: Infinity });
          else walkKneel(P, t, E.kneel, R2, KR, faceTo(KR.x, KR.z, CHAIR.x, CHAIR.z + 0.2), ['Idle_3', 3 + (E.kneel - E.reach) * 0.4],
            { ry0: r2, kt: (td) => (t < E.rise ? Math.min(4.2, td) : runOf(t, E.rise + 0.6, E.rise + 3.6, 4.2, 0.2)) });
          lookNow(P, AMMA_FACE, 1, 0.9); });
        /* (R68: at her lamp, breathing, through the cry and the light; as her mother's eyes open, into her stand and turned to
           her; her "Unbelievable... Amma, you're on your feet!" (R55) her talking take for its length; her eyes on her mother's face as it rises) */
        whenReady(cast.mala, (P) => {
          const k = smo(c01((t - E.open) / 0.9)), idle = 2 + Math.max(0, t - E.open) * 0.35;
          if (!malaCall(P, t, E.ml, SECS.ml4R1 || 3.5, 'Stand_and_Chat', 'Idle_3', idle)) {
            if (k <= 0.001) pose(P, 'lightlamp', MALA_LAMPT(t)); else pose(P, 'Idle_3', idle, true, 'lightlamp', 1 - k, MALA_LAMPT(E.open)); }
          if (k > 0) P.group.rotation.y = lpA(faceTo(MALA_T.x, MALA_T.z, CHAIR.x, CHAIR.z), MALA_TO_HER, k);
          lookNow(P, t < E.rise ? AMMA_FACE : HER_HEAD(), 1, 0.9); });
        /* his sight held open through the cry and the light, as in every ending (R59, Chad, 18 Nov evening: "i think
           option D outcome cutscene turns off spirit vision prematurely?": it closed at 0.2 s, and the thing torn from her
           back and the light were never seen), and home to him before she stands (R55, R65: "when auntie is about to stand
           up from her wheelchair, the vision should be turned off for that special moment") */
        visionAt(t, -10, 0.1, E.sight, E.sightFor);
        track(t, [
          { t: 0, name: 'S', eye: DEC_EYE, at: DEC_AT, fp: PLAY_FOV, fd: PLAY_FOV },
          { t: 1.2, name: 'pho', eye: S_EYE, at: PHO_BOW, fp: 52, fd: 48 },
          { t: E.kneel + 0.6, name: 'pho', eye: S_EYE, at: PHO_BOW, fp: 52, fd: 48 },
          { t: E.kneel + 2.0, name: 'her', eye: S_EYE, at: [CHAIR.x + 0.09, 0.92, CHAIR.z + 0.08], fp: 60, fd: 52 },
          { t: E.rise, name: 'her', eye: S_EYE, at: [CHAIR.x + 0.09, 0.92, CHAIR.z + 0.08], fp: 60, fd: 52 },
          /* (19 Nov: her rise followed, RISE_HEAD: from his place the frame held her back as she leaned, her head at its edge) */
          { t: E.rise + 0.8, name: 'rise', eye: S_EYE, at: () => riseAim(t - E.rise, RISE_OFF.D), fp: 60, fd: 52 },
          { t: E.rise + 3.4, name: 'rise', eye: S_EYE, at: () => riseAim(t - E.rise, RISE_OFF.D), fp: 60, fd: 52 },
          { t: E.rise + 4.5, name: 'stand', eye: S_EYE, at: [CHAIR.x + 0.04, 1.26, CHAIR.z + 0.26], fp: 58, fd: 52 },
          { t: E.ph - 0.4, name: 'stand', eye: S_EYE, at: [CHAIR.x + 0.04, 1.30, CHAIR.z + 0.28], fp: 58, fd: 52 },
          { t: E.ph + 0.5, name: 'pho', eye: D_PHO_EYE, at: [cast.phoB.home.x, 1.62, cast.phoB.home.z], fp: 46, fd: 42, cut: true },   // (R80)
          { t: E.close, name: 'pho', eye: D_PHO_EYE, at: [cast.phoB.home.x, 1.62, cast.phoB.home.z], fp: 46, fd: 42 }
        ]);
        phoTurn(t, E.ph, false, 'ph4D1');
      }
    };
    /* Grandmaster Pho turns his face to him for his word (and talks: his own talking take, the line's length) */
    /* (a man who talks to him turns his BODY to him, the head doing only the last of the turn, a neck's easy 26 degrees:
       the rule of v14.5. 18 Nov, photographed: ending A's eye is at his left, 93 degrees round; the head alone at its
       reach, over a talking take that turns his shoulders 15 degrees the other way, left him in profile looking away) */
    const _ptv = new THREE.Vector3();
    function phoTurn(t, ph, low = false, line = null) {
      phoTalk(t, ph, line);
      whenReady(cast.phoB, (P) => { if (t < ph - 0.6) return;
        const k = smo(c01((t - ph + 0.6) / 0.8)), to = low ? [S_EYE[0] + 0.1, 0.5, S_EYE[2] + 0.2] : null;
        if (to) _ptv.set(to[0], to[1], to[2]); else camera.getWorldPosition(_ptv);
        const h = P.home, d0 = faceTo(h.x, h.z, _ptv.x, _ptv.z) - h.ry, d = Math.atan2(Math.sin(d0), Math.cos(d0));
        P.group.rotation.y = h.ry + Math.sign(d) * Math.max(0, Math.abs(d) - 0.45) * k;
        lookNow(P, to || 'lens', k, 0.8, low ? 0 : 0.03); });
    }
    /* his talking take on the line's own start, eased in and out of his stand, for the line's measured length (the v11.4
       law: he talks while he speaks, and goes back to rest after); its head held (PHO_STAND_HEAD) */
    function phoTalk(t, at, line) {
      const L = line && SECS[line]; if (!L || t < at - 0.25 || t > at + L + 0.7) return;
      whenReady(cast.phoB, (P) => { const k = smo(c01((t - at + 0.25) / 0.4)) * (1 - smo(c01((t - at - L - 0.1) / 0.6)));
        pose(P, 'Talk_with_Hands_Open', Math.max(0, t - at), true, 'Sit_to_Stand_Transition_M', 1 - k, pingOf(t, 5.85, 0.25, PHO_BREATH)); });
    }
    /* THE CLOSE (§4.5, every ending): from his place at her front left again */
    /* her hips' place when the rise leaves her standing at her chair (its held end), measured once on her own body; and her
       group moved so her hips stand where a moment of her walk says (a function of the film's clock: seek-safe) */
    const _phv = new THREE.Vector3(), _rlv = new THREE.Vector3(), _rla = new THREE.Vector3(), _rlb = new THREE.Vector3();
    /* (R79) MALA'S HANDS IN THE CLOSE, on her words "Slowly, Amma. Slowly." (CL.slow, its own length): up before her, palms
       up; onto her mother's right arm as her mother reaches her altar (the steps end at CL.steps + STEPS_TK / 0.55); off
       before her mother's palms join (CL.palms). Her mother's arm is read from her own bones on the frame, after she is
       posed */
    const _msS = new THREE.Vector3(), _msE = new THREE.Vector3(), _msW = new THREE.Vector3();
    function malaSteady(P, c) {
      const k = smo(c01((c - CL.slow + 0.25) / 0.45)) * (1 - smo(c01((c - CL.palms + 0.9) / 0.6)));
      if (!(k > 0)) return;
      const ry = P.group.rotation.y, F = [Math.sin(ry), Math.cos(ry)], R = [-F[1], F[0]], M = P.group.position;
      const A = cast.amma && cast.amma.ready ? armsOf(cast.amma) : null, a = A && A.R;
      let on = smo(c01((c - (CL.steps + STEPS_TK / 0.55) + 0.35) / 0.7));
      if (!a) on = 0;
      for (const sd of ['L', 'R']) {
        const sg = sd === 'R' ? 1 : -1;
        /* before her: palms up and a little in, at her waist */
        let at = [M.x + F[0] * 0.30 + R[0] * 0.12 * sg, 1.02, M.z + F[1] * 0.30 + R[1] * 0.12 * sg],
            f = [F[0], -0.12, F[1]], n = [-R[0] * 0.3 * sg, 0.95, -R[1] * 0.3 * sg];
        if (on > 0) {
          a.up.getWorldPosition(_msS); a.fore.getWorldPosition(_msE); a.hand.getWorldPosition(_msW);
          const ar = cast.amma.group.rotation.y, AF = [Math.sin(ar), Math.cos(ar)];
          /* her left hand behind her mother's arm just above the elbow, its palm to the arm; her right on the front of her
             forearm below it: each hand's fingers along its reach, from her side */
          const p = sd === 'L' ? [lp(_msE.x, _msS.x, 0.25) - AF[0] * 0.04, lp(_msE.y, _msS.y, 0.25), lp(_msE.z, _msS.z, 0.25) - AF[1] * 0.04]
                               : [lp(_msE.x, _msW.x, 0.30) + AF[0] * 0.04, lp(_msE.y, _msW.y, 0.30), lp(_msE.z, _msW.z, 0.30) + AF[1] * 0.04];
          const sh = [M.x + R[0] * 0.17 * sg, M.z + R[1] * 0.17 * sg], rx = p[0] - sh[0], rz = p[2] - sh[1], rl = Math.hypot(rx, rz) || 1;
          const nn = sd === 'L' ? [AF[0], 0, AF[1]] : [-AF[0], 0, -AF[1]];
          at = lp3(at, p, on); f = lp3(f, [rx / rl, -0.1, rz / rl], on); n = lp3(n, nn, on);
        }
        handTo(P, sd, at, f, n, k, { out: 0.12, down: 0.40 });
      }
    }
    function standA(P) { if (!P._standA) { put(P, CHAIR.x, CHAIR.z, CHAIR.ry); pose(P, 'rise', 4.75); P.group.updateWorldMatrix(true, true); P.hips.getWorldPosition(_phv); P._standA = [_phv.x, _phv.z]; } return P._standA; }
    function pinHips(P, x, z) { if (!P.hips) return; P.group.updateWorldMatrix(true, true); P.hips.getWorldPosition(_phv); P.group.position.x += x - _phv.x; P.group.position.z += z - _phv.z; }
    function closeFrame(k, c, tAll) {
      void EN;
      /* she stands (in every ending she has risen by now) and walks to her altar; the ash; her palms together */
      whenReady(cast.amma, (P) => {
        /* (each take carries her body from its own first moment: the rise left her standing RISEN before the chair's
           middle, the steps take the rest of the way to the altar by its own travel, so her mark moves only between
           takes. 18 Nov: her mark slid to the altar under a walking take that also walked: she ended in its wall) */
        const sk = Math.min(STEPS_TK, (c - CL.steps) * 0.55), stepEnd = CL.steps + STEPS_TK / 0.55;
        if (c < CL.steps) { put(P, CHAIR.x, CHAIR.z, CHAIR.ry); pose(P, 'rise', pingOf(c, 4.6, 0.3, 3.0)); }
        else {
          /* (her HIPS held where her own takes carry them: where the rise leaves them standing at her chair (measured once
             on the rise's held end, standA), then on by the steps' own travel, then still, the lamp's own small sway kept.
             18 Nov, measured from the close's photographs: her mark moved for the steps while the rise was still blended in
             carried her 0.31 m forward in half a second as she began to walk, out of the shot; and the lamp take's own
             offset carried her 0.48 m back toward her chair as her palms joined, out of the lamp's shot) */
          const A = standA(P); let hx = A[0], hz = A[1];
          put(P, CHAIR.x, CHAIR.z, CHAIR.ry);
          if (c < stepEnd) { const S = hipsTravel(P, 'steps', sk); hx += S[0]; hz += S[1];
            pose(P, 'steps', sk, false, 'rise', 1 - smo(c01((c - CL.steps) / 0.5)), 4.75); }
          else { const S = hipsTravel(P, 'steps', STEPS_TK); hx += S[0]; hz += S[1];
            if (c < CL.palms) pose(P, 'rise', pingOf(c - stepEnd, 4.6, 0.3, 3.0), false, 'steps', 1 - smo(c01((c - stepEnd) / 0.6)), STEPS_TK);
            /* (her palms joined at her chest and held there, upright: the take's last half-second is a deep bow, 0.31 m from
               hips to head, and held for ten seconds she stood folded over: 18 Nov, photographed) */
            else { const lt = runOf(c, CL.palms, CL.palms + 2.2, 3.4, 4.8), wl = smo(c01((c - CL.palms) / 0.5)), L = hipsTravel(P, 'lamp', lt), L0 = hipsTravel(P, 'lamp', 3.4);
              hx += (L[0] - L0[0]) * wl; hz += (L[1] - L0[1]) * wl;
              pose(P, 'lamp', lt, false, 'rise', 1 - wl, 4.75); } }
          pinHips(P, hx, hz); }
        lookNow(P, [ALTAR.x, 1.45, ALTAR.z], c < CL.palms ? smo(c01((c - CL.steps) / 1.5)) * 0.6 : 0, 0.6); });
      phoBless(tAll, 0);
      phoTalk(c, CL.z1, 'ph4z1');
      /* (his dedication said with his eyes on her and a little lowered; his word to the family to her son. 18 Nov: every
         look in the close went to AMMA_FACE, her face SEATED, a chest's height once she stands) */
      whenReady(cast.phoB, (P) => { const h = HER_HEAD(); lookNow(P, c > CL.z1 - 1 ? headOf(cast.ravi, [RAVI_C.x, 1.6, RAVI_C.z]) : [h[0], h[1] - 0.25, h[2]], 0.8, 0.8); });
      /* the family about her: Mala at her right hand (the ash), Ravi at her left */
      whenReady(cast.mala, (P) => { put(P, MALA_C.x, MALA_C.z, faceTo(MALA_C.x, MALA_C.z, STAND.x, STAND.z));
        pose(P, 'Idle_3', 3 + c * 0.3, true); lookNow(P, HER_HEAD(), 1, 0.9);
        /* (the ash on her FOREHEAD, her daughter's fingers drawn across her brow from her right side: 18 Nov, photographed
           at her chin and then at her nose, the point guessed from the head bone; now her brow as her skin has it,
           HER_BROW (c_scast.js), and from the side the wrist is 0.11 m nearer her daughter) */
        /* (R79, Chad, 18 Nov: "the yellow woman model, when she tells the auntie slowly and her hands come up to stop the
           auntie, it clips into the altar, and also she should do that earlier so it syncs with her voiceline timing". Her
           right hand went up to her mother's brow three seconds after her words, its elbow out under her mother's altar.
           Now both hands come up WITH "Slowly", before her at her waist, palms up, ready for her; as her mother reaches her
           altar they go to her right arm, behind her elbow and on her forearm, and hold her until her palms join; every
           point below the altar's base, 1.15 m, and before its front) */
        malaSteady(P, c); });
      /* (Ravi turns his head to his teacher as he is spoken to: a neck's reach, his body still turned to her) */
      whenReady(cast.ravi, (P) => { put(P, RAVI_C.x, RAVI_C.z, faceTo(RAVI_C.x, RAVI_C.z, STAND.x, STAND.z)); pose(P, 'kneelhold', pingOf(c, 2.6, 0.8, 6.0));
        /* (R78, Chad, 18 Nov: "In all the ending cutscenes, ravi's head spins in an unnatural way just before the camera pans
           back to grandmaster pho": his look's POINT was slid in a straight line from her head to his teacher's, and passing
           close by his own head it swept his face round in a moment. Now the DIRECTION is turned, from her to his teacher,
           over 1.2 s, and his head goes only a neck's reach of it) */
        const h = HER_HEAD(), ph = cast.phoB.home, k = smo(c01((c - CL.z1 + 1.2) / 1.2));
        if (P.head) { P.group.updateWorldMatrix(true, true); P.head.getWorldPosition(_rlv);
          _rla.set(h[0], h[1], h[2]).sub(_rlv).normalize(); _rlb.set(ph.x, 1.55, ph.z).sub(_rlv).normalize(); _rla.lerp(_rlb, k).normalize();
          lookNow(P, [_rlv.x + _rla.x, _rlv.y + _rla.y, _rlv.z + _rla.z], 1, 0.85); } });
      whenReady(spirits.oppress, (P) => { P.group.visible = false; });
      whenReady(spirits.appa, (P) => { if (P.gone) return; put(P, APPA_C.x, APPA_C.z, faceTo(APPA_C.x, APPA_C.z, CHAIR.x, CHAIR.z + 0.3)); pose(P, 'Idle_3', 2 + c * 0.3, true); });
      spirits.wander.forEach((P, i) => whenReady(P, (Q) => { const W = CLOSE_WANDER[i]; if (!W) return;
        put(Q, W.x, W.z, W.ry); Q.group.visible = true; pose(Q, 'crawl', Math.max(0, c - CL.go + 1.0) * 0.6); }));
      wanderersAt(c, CL.go);
      /* his sight (R65, Chad, 18 Nov evening: "when grandmaster pho chants for the lingering spirits for them to get
         merits, the spirit vision needs to be turned on again to show them leaving the scene. Then turned off again once
         that is done"): shut since before her rise; opened again as his teacher begins the dedication, so the last green
         shapes are seen going out by the open door and her husband seen standing where he stood; home to him once they are
         gone, before the lens turns to her */
      visionAt(c, CL.see, CL.seeFor, CL.unsee, CL.unseeFor);
      /* THE LENS (18 Nov, re-staged): his teacher whole as he dedicates the merit, the last green shapes going out low
         past him; to her, risen at her chair; her steps to her altar; in on the ash between her and her daughter; her
         palms and her lamp; out to her family about her in the room's own colours; and over her
         son's shoulder to his teacher for his word. Every aim is where its subject stands (a phone's frame is 35 degrees:
         his teacher and the shapes share it, her family shares it, but not both) */
      /* (THE FAMILY, 18 Nov, re-staged: from the merit's eye they stood in one line from the lens, her son's head under her
         and her daughter behind the altar's post, and the shot's two keys ran backwards in time, so it never held. Now from
         behind and to their left, by his teacher's stool: the three before her altar, her lamp lit between them, her
         chair empty in the corner of the frame. Cut to and cut away: its own eye) */
      const ph = cast.phoB.home, FAM_EYE = [0.80, 1.55, 3.40], FAM = [-0.12, 1.12, 4.75];
      track(c, [
        { t: 0, name: 'merit', eye: CLOSE_EYE, at: [0.05, 1.09, 2.39], fp: 58, fd: 52, cut: true },
        { t: 6.6, name: 'merit', eye: CLOSE_EYE, at: [0.02, 1.13, 2.47], fp: 58, fd: 52 },
        { t: 9.8, name: 'her', eye: CLOSE_EYE, at: [CHAIR.x + 0.05, 1.30, CHAIR.z + 0.30], fp: 56, fd: 50 },
        { t: CL.steps + 0.2, name: 'her', eye: CLOSE_EYE, at: [CHAIR.x + 0.05, 1.30, CHAIR.z + 0.30], fp: 56, fd: 50 },
        { t: CL.steps + 1.6, name: 'her', eye: CLOSE_EYE, at: [STAND.x + 0.02, 1.34, STAND.z], fp: 54, fd: 50 },
        { t: CL.ash - 0.5, name: 'ash', eye: CLOSE_EYE, at: [lp(STAND.x, MALA_C.x, 0.4), 1.45, lp(STAND.z, MALA_C.z, 0.4)], fp: 48, fd: 44 },
        { t: CL.ash + 1.5, name: 'ash', eye: CLOSE_EYE, at: [lp(STAND.x, MALA_C.x, 0.4), 1.45, lp(STAND.z, MALA_C.z, 0.4)], fp: 48, fd: 44 },
        { t: CL.palms + 0.4, name: 'lamp', eye: CLOSE_EYE, at: [STAND.x + 0.02, 1.22, STAND.z + 0.16], fp: 54, fd: 50 },
        { t: CL.shut + 0.2, name: 'lamp', eye: CLOSE_EYE, at: [STAND.x + 0.02, 1.22, STAND.z + 0.16], fp: 54, fd: 50 },
        { t: CL.fam, name: 'family', eye: FAM_EYE, at: FAM, fp: 62, fd: 54, cut: true },
        { t: CL.z1 - 0.35, name: 'family', eye: FAM_EYE, at: [FAM[0] + 0.03, FAM[1] + 0.02, FAM[2]], fp: 60, fd: 52 },
        { t: CL.z1 - 0.3, name: 'pho', eye: CLOSE_EYE, at: [ph.x + 0.05, 1.5, ph.z + 0.05], fp: 50, fd: 46, cut: true },
        { t: CL.end, name: 'pho', eye: CLOSE_EYE, at: [ph.x + 0.05, 1.5, ph.z + 0.05], fp: 50, fd: 46 }
      ]);
    }
    /* what a scene reaches of the films (stage.films): the clocks, and each film's three hands */
    const filmsApi = {
      trance: FILMS.trance,
      lost: FILMS.lost,
      begin: (k, c, api) => FILMS.ending.begin(k, api),
      frame: (k, t, api) => FILMS.ending.frame(k, t, api),
      end: () => FILMS.ending.end()
    };

    /* ---------------------------------------------------------------- THE OPENING FILM (§4.0; its clock: OP, z_tail.js)
       Black, and his voice; the estate from her corridor at night; a lift's chime far off and the walk along the corridor
       to her gate, his teacher in white waiting at it, the kolam on the floor, the mango leaves over the door; Ravi at the
       grille, the latch; in the black the gate swung back; Ravi in her doorway, his welcome; in the black his teacher
       goes in before him; the room as he crosses it to her left side: the tube, the fan, her goddess on the wall, Amma in
       her wheelchair facing it, Mala beside her; the room's sound drops, his heart twice, and her head turns, slowly,
       not to his teacher, to HIM; and for a held breath his sight opens by itself (no training yet holds it shut): the
       crimson shape on her back, its face turned to him too. Black: the title.
       (The plan's §4.0 has the shape seen in a dark window's reflection; a reflection of the vision's own layer would need
       a mirror pass the engine does not have, so the same beat is his sight flickering open on its own: the tracker, D-list) */
    const KOLAM = (() => {
      const [c, x] = cnv(512); x.clearRect(0, 0, 512, 512);
      x.strokeStyle = '#ffffff'; x.fillStyle = '#ffffff'; x.lineCap = 'round'; x.lineJoin = 'round';
      const C = 256, n = 8;
      /* a lotus of eight petals round a ring of dots, and a square of loops round it: rice flour, drawn by a hand */
      x.lineWidth = 7;
      for (let i = 0; i < n; i++) { const a = i * Math.PI * 2 / n;
        x.save(); x.translate(C, C); x.rotate(a); x.beginPath(); x.moveTo(0, -40); x.quadraticCurveTo(52, -112, 0, -178); x.quadraticCurveTo(-52, -112, 0, -40); x.stroke(); x.restore(); }
      x.lineWidth = 6; x.beginPath(); x.arc(C, C, 34, 0, Math.PI * 2); x.stroke();
      for (let i = 0; i < n; i++) { const a = (i + 0.5) * Math.PI * 2 / n; x.beginPath(); x.arc(C + Math.sin(a) * 120, C - Math.cos(a) * 120, 9, 0, Math.PI * 2); x.fill(); }
      x.lineWidth = 5;
      for (let i = 0; i < 4; i++) { const a = i * Math.PI / 2 + Math.PI / 4;
        x.save(); x.translate(C, C); x.rotate(a); x.beginPath(); x.moveTo(-150, -150); x.quadraticCurveTo(0, -250, 150, -150); x.stroke();
        x.beginPath(); x.arc(0, -214, 16, 0, Math.PI * 2); x.stroke(); x.restore(); }
      x.lineWidth = 4; x.strokeRect(40, 40, 432, 432);
      for (let i = 0; i < 9; i++) for (const [px, py] of [[40 + i * 54, 20], [40 + i * 54, 492], [20, 40 + i * 54], [492, 40 + i * 54]]) { x.beginPath(); x.arc(px, py, 5, 0, Math.PI * 2); x.fill(); }
      const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
      const m = new THREE.MeshBasicMaterial({ map: t, transparent: true, depthWrite: false, color: 0xd8d4c8, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });
      const g = new THREE.PlaneGeometry(0.86, 0.86), me = new THREE.Mesh(g, m);
      me.rotation.x = -Math.PI / 2; me.position.set(0, FL.corr + 0.003, -0.78); me.renderOrder = 1;
      world.add(me); owned.push(g, t); mats.push(m);
      return me;
    })();
    void KOLAM;
    const PHO_GATE = { x: -0.42, z: -0.74 }, RAVI_DOOR = { x: 0.06, z: 0.26 }, PHO_IN = { x: 0.3, z: 4.18 }, RAVI_IN = { x: 1.55, z: 1.22 };
    const O_EYE = [0.98, 1.62, 3.32];                                         // where he stops, at her left side
    FILMS.open = {
      begin(api) {
        if (api && api.handsRoot) api.handsRoot.visible = false;
        FM.once = new Set(); FM.visHeld = false; castHome(); spiritsHome(); whenReady(cast.phoB, (P) => bowSet(P, 0));
        whenReady(cast.pho, (P) => { P.group.visible = false; });
        filmBed.on = true; for (const k in filmBed) if (k !== 'on') filmBed[k] = 0;
      },
      frame(t) {
        const T = OP, inside = t >= T.cut2;
        fLook('FLAT');
        /* the beds by place: the estate and the corridor outside, the room inside, and the room's sound dropping as she
           turns to him */
        filmBed.estate = t < T.cut1 ? BED.estate * (t < T.turn ? 1.2 : 0.8) : (inside ? BED.estate * 0.6 : BED.estate * 0.8);
        filmBed.corr = t < T.cut2 ? BED.corr : 0;
        filmBed.flat = inside ? BED.flat * (1 - 0.75 * smo(c01((t - T.drop) / 0.8))) : 0;
        /* her gate: shut until the first black, swung back (out of sight) after it */
        for (const g of (things.w4gate || []).slice(0, 1)) g.visible = t < T.cut1 + 0.3;
        /* his teacher: at her gate, then (in the second black) in the room before her, at her left */
        whenReady(cast.phoB, (P) => { P.group.visible = true;
          if (!inside) put(P, PHO_GATE.x, PHO_GATE.z, 0); else put(P, PHO_IN.x, PHO_IN.z, faceTo(PHO_IN.x, PHO_IN.z, CHAIR.x, CHAIR.z));
          pose(P, 'Sit_to_Stand_Transition_M', pingOf(t, 5.85, 0.25, PHO_BREATH));
          if (inside) lookNow(P, AMMA_FACE, 1, 0.8); });
        /* Ravi: behind the grille, then in her doorway, his welcome; then aside, in the room */
        whenReady(cast.ravi, (P) => {
          if (!inside) { put(P, RAVI_DOOR.x, t < T.cut1 ? RAVI_DOOR.z + 0.25 : RAVI_DOOR.z, Math.PI);
            if (t >= T.rv && t < T.rv + 2.7) pose(P, 'Talk_with_Hands_Open', (t - T.rv) * 1.0); else pose(P, 'Idle_3', 2 + t * 0.35, true);
            lookNow(P, t < T.cut1 ? [PHO_GATE.x, 1.7, PHO_GATE.z] : 'lens', 1, 0.8); }
          else { put(P, RAVI_IN.x, RAVI_IN.z, faceTo(RAVI_IN.x, RAVI_IN.z, CHAIR.x, CHAIR.z)); pose(P, 'Idle_3', 4 + t * 0.35, true); lookNow(P, AMMA_FACE, 1, 0.8); } });
        whenReady(cast.mala, (P) => { put(P, MALA_T.x, MALA_T.z, faceTo(MALA_T.x, MALA_T.z, CHAIR.x, CHAIR.z)); pose(P, 'Idle_3', 1 + t * 0.35, true); lookNow(P, inside && t > T.inside ? 'lens' : AMMA_FACE, inside && t > T.inside ? smo(c01((t - T.inside) / 1.2)) * 0.6 : 1, 0.8); });
        /* her: in her chair before her goddess; her head turning to him (past his teacher) as the room's sound drops */
        whenReady(cast.amma, (P) => { pose(P, 'wsit', pingOf(t, 2.0, 3.6, 12)); if (t > T.look) lookNow(P, 'lens', smo(c01((t - T.look) / 2.0)), 0.85, 0.05); });   // (R82: a neck's reach)
        /* the one on her back, seen only in the flicker; its face turned to him with hers */
        whenReady(spirits.oppress, (P) => { oppRide(P); pose(P, 'cling', 2 + t * 0.3); if (t > T.look) lookNow(P, 'lens', smo(c01((t - T.look - 0.4) / 1.6)), 1.3); });
        /* his sight, open for a held breath by itself. (R51: held ONLY round the flick. Held from the film's first frame at a
           radius of 0, it sent every frame of the film through the vision's own pass, the world drawn into its targets for
           nothing the picture showed: the heavier way to draw, and the way the curtain had not warmed) */
        if (kit && kit.vision) {
          const u = c01((t - T.flick) / (T.flickEnd - T.flick)), r = t < T.flick || t > T.flickEnd ? 0 : 7 * Math.sin(Math.PI * u);
          if (t >= T.flick - 0.3 && t <= T.flickEnd + 0.3) { kit.vision({ r, moving: r > 0.01 }); FM.visHeld = true; }
          else if (FM.visHeld) { kit.vision(null); FM.visHeld = false; }
        }
        /* THE LENS */
        track(t, [
          /* (R36, 18 Nov: the picture comes up after 2.6 s of black, not 7.6 (v7.7: no long black), on the sky over the
             estate, the block across's roof and the newer towers beyond; and comes down across the block's lit storeys
             while he speaks, to its middle, before he turns to the corridor) */
          { t: 0, name: 'sky', eye: [-6.0, 1.52, -1.35], at: [-20, 26, -60], fp: 54, fd: 48 },
          { t: T.est + 0.4, name: 'sky', eye: [-6.0, 1.52, -1.35], at: [-20, 26, -60], fp: 54, fd: 48 },
          { t: T.turn, name: 'estate', eye: [-6.0, 1.5, -1.3], at: [-2, 3.5, -42], fp: 52, fd: 46 },
          { t: T.walk, name: 'corridor', eye: [-6.0, 1.5, -1.05], at: [2, 1.35, -0.85], fp: 60, fd: 54 },
          /* (18 Nov, photographed on build 19: from behind his teacher's shoulder the gate and Ravi behind it were his
             back; from here, nearer the parapet and further back, his teacher stands at the right in profile and Ravi's
             face is behind the grille in the middle) */
          { t: T.at, name: 'gate', eye: [-2.0, 1.55, -1.6], at: [-0.15, 1.55, 0.0], fp: 58, fd: 52 },
          { t: T.cut1 + 0.6, name: 'door', eye: [0.48, 1.5, -1.05], at: [RAVI_DOOR.x, 1.6, RAVI_DOOR.z], fp: 50, fd: 46, cut: true },
          { t: T.cut2, name: 'door', eye: [0.48, 1.5, -1.05], at: [RAVI_DOOR.x, 1.6, RAVI_DOOR.z], fp: 50, fd: 46 },
          { t: T.cut2 + 0.5, name: 'in', eye: [0.1, 1.6, 0.45], at: [CHAIR.x, 1.1, CHAIR.z], fp: 62, fd: 56, cut: true },
          { t: T.inside, name: 'in', eye: [0.45, 1.62, 1.7], at: [CHAIR.x + 0.1, 1.05, CHAIR.z], fp: 62, fd: 56 },
          /* (18 Nov, photographed on build 19: aimed at 1.0 m over a point 10 cm before the chair's middle, a phone had her
             face at its right edge and Mala's head cut away above; her head as it sits in her chair is 5 cm behind the
             chair's middle: the loss's measure) */
          { t: T.look, name: 'her', eye: O_EYE, at: [CHAIR.x - 0.01, 0.99, CHAIR.z - 0.05], fp: 52, fd: 46 },
          { t: T.end, name: 'her', eye: O_EYE, at: [CHAIR.x - 0.01, 0.99, CHAIR.z - 0.05], fp: 47, fd: 43 }
        ]);
      },
      /* play begins in the history (historyBegin stages everyone again): her gate shut behind them, the beds play's */
      end() { fLens(PLAY_FOV); filmBed.on = false; for (const g of (things.w4gate || []).slice(0, 1)) g.visible = true; if (kit && kit.vision) kit.vision(null); FM.visHeld = false; }
    };
    filmsApi.open = FILMS.open;
