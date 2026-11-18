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
    function track(t, K) {
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
    const S_EYE = [1.12, 1.62, 4.45];                                         // he stands at her front left, by her goddess's wall
    const R0 = { x: 2.45, z: 2.25 }, R1 = { x: 0.82, z: 3.42 };               // Ravi from the sofa's end to a step from her chair
    const MALA_T = { x: -0.55, z: 4.42 };                                     // Mala at her mother's right hand, before her
    const AMMA_FACE = [CHAIR.x, 1.02, CHAIR.z + 0.08];
    const RAVI_RY = faceTo(R0.x, R0.z, CHAIR.x, CHAIR.z);
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
    /* Grandmaster Pho behind her chair with his right palm on the crown of her head (crownTick's own hand, laid by the
       film each frame after his pose); k eases it on and off */
    function phoCrown(k) {
      const P = cast.phoB; if (!(k > 0.01) || !P.ready) return;
      const h = HER_HEAD(), g = P.group.position, fx0 = h[0] - g.x, fz0 = h[2] - g.z, fl = Math.hypot(fx0, fz0) || 1;
      handTo(P, 'R', [h[0] - fx0 / fl * 0.02, h[1] + 0.035, h[2] - fz0 / fl * 0.02], [fx0 / fl, -0.25, fz0 / fl], [0, -1, 0], k, { out: 0.32, down: 0.3 });
    }
    function phoStand(t) { const P = cast.phoB; if (!P.ready) return; P.group.visible = true; put(P, P.home.x, P.home.z, P.home.ry); pose(P, 'Sit_to_Stand_Transition_M', pingOf(t, 5.85, 0.25, PHO_BREATH)); }

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
        whenReady(cast.ravi, (P) => { put(P, R0.x, R0.z, RAVI_RY); });
        spiritsHome(); castSolid();
        filmBed.on = true; for (const k in filmBed) if (k !== 'on') filmBed[k] = 0; filmBed.dark = BED.dark;      // the dark room under every silence
      },
      frame(t) {
        fLook('DARK');
        /* her: the breath, the back straightening, the hands lifting; held trembling on the take's last stretch */
        whenReady(cast.amma, (P) => pose(P, 'trance', t < 9.9 ? t : pingOf(t - 9.9, 8.2, 1.5, 3.2)));
        phoStand(t); phoCrown(1);
        /* Mala: still, watching her mother; at her second line her palms meet before her chest (the end of her lamp's
           take: its own pressing of the palms and the small bow) */
        whenReady(cast.mala, (P) => { if (t < TR.ml2 - 0.4) { pose(P, 'Idle_3', 2 + t * 0.4); }
          else pose(P, 'lightlamp', runOf(t, TR.ml2 - 0.4, TR.ml2 + 1.4, 4.4, 5.6));
          lookNow(P, AMMA_FACE, 1, 0.9); });
        /* Ravi: still by the sofa's end until the cry, then his rush: three quick steps to a step from her chair */
        whenReady(cast.ravi, (P) => {
          if (t < TR.rush) { put(P, R0.x, R0.z, RAVI_RY); pose(P, 'Idle_3', 3 + t * 0.35); lookNow(P, AMMA_FACE, 1, 0.9); }
          else { const k = smo(c01((t - TR.rush) / 1.55)); put(P, lp(R0.x, R1.x, k), lp(R0.z, R1.z, k), RAVI_RY); pose(P, 'rush', Math.min(2.6, (t - TR.rush) * 1.05)); }
        });
        /* the one on her back: its cling, its claws at her shoulders as the light rises in her, then its cry */
        whenReady(spirits.oppress, (P) => {
          if (t < TR.claw) pose(P, 'cling', 2 + t * 0.3);
          else if (t < TR.cry) pose(P, 'claw', (t - TR.claw) * 0.9);
          else pose(P, 'cry', t - TR.cry < 4.4 ? t - TR.cry : pingOf(t - TR.cry - 4.4, 2.6, 1.6, 2.4)); });
        visionAt(t, TR.open, 1.6);
        goddess(smo(c01((t - TR.open - 0.6) / 6)));
        /* THE LENS: her face; a turn to Mala for her two lines; back to her as the vision opens; drawn to the shout; back */
        track(t, [
          { t: 0, name: 'her', eye: S_EYE, at: [CHAIR.x + 0.02, 0.98, CHAIR.z + 0.05], fp: 44, fd: 40 },
          { t: TR.ml1 - 0.5, name: 'her', eye: S_EYE, at: [CHAIR.x + 0.02, 1.0, CHAIR.z + 0.05], fp: 42, fd: 40 },
          { t: TR.ml1 + 0.3, name: 'mala', eye: S_EYE, at: [MALA_T.x + 0.1, 1.45, MALA_T.z - 0.05], fp: 44, fd: 42 },
          { t: TR.ml2 + 1.6, name: 'mala', eye: S_EYE, at: [MALA_T.x + 0.12, 1.42, MALA_T.z - 0.05], fp: 44, fd: 42 },
          { t: TR.open + 0.3, name: 'both', eye: S_EYE, at: [CHAIR.x + 0.05, 1.05, CHAIR.z - 0.05], fp: 56, fd: 50 },
          { t: TR.rush, name: 'both', eye: S_EYE, at: [CHAIR.x + 0.05, 1.08, CHAIR.z - 0.1], fp: 54, fd: 50 },
          { t: TR.rv + 0.25, name: 'ravi', eye: S_EYE, at: [lp(R0.x, R1.x, 0.45), 1.45, lp(R0.z, R1.z, 0.45)], fp: 58, fd: 54 },
          { t: TR.back, name: 'ravi', eye: S_EYE, at: [R1.x - 0.1, 1.35, R1.z + 0.05], fp: 60, fd: 56 },
          { t: TR.back + 0.9, name: 'all', eye: S_EYE, at: [(R1.x + CHAIR.x) / 2, 1.15, (R1.z + CHAIR.z) / 2], fp: 66, fd: 58 },
          { t: TR.end, name: 'all', eye: S_EYE, at: [(R1.x + CHAIR.x) / 2, 1.15, (R1.z + CHAIR.z) / 2], fp: 66, fd: 58 }
        ]);
      },
      /* the room as the decision finds it, held still while he chooses: Ravi a step from her, the cry, the light in her,
         his teacher's hand on her head, the vision open (the endings take it from here) */
      end() {
        fLens(PLAY_FOV); filmBed.on = false;
        whenReady(cast.ravi, (P) => { put(P, R1.x, R1.z, RAVI_RY); hold(P, 'rush', 2.45, 0.12, 0.2, 1.4); });
        whenReady(cast.amma, (P) => hold(P, 'trance', 8.2, 1.5, 0.3, 3.2));
        whenReady(cast.mala, (P) => hold(P, 'lightlamp', 5.4, 0.2, 0.3, 2.5));
        whenReady(spirits.oppress, (P) => hold(P, 'cry', 2.6, 1.6, 0.3, 2.4));
        if (kit && kit.vision) kit.vision({ r: VR, moving: false });
        handOnHead(cast.phoB, true); crownK = 1;
      }
    };

    /* ---------------------------------------------------------------- THE FOUR ENDINGS (§4.5) AND THE CLOSE
       Each ending begins on the trance's last frame (Ravi a step from her chair, the thing crying on her back, his
       teacher's hand on her head) and is a whole story: what he did, how it was answered, what it cost him, what he was
       told; then THE CLOSE, the same for all four: the release dedicated to all beings, the green shapes easing out of
       the room, her first steps to her altar, the sacred ash on her forehead, her palms together, his sight closing,
       and his teacher's word to the family. Every picture here is his eyes */
    const STAND = { x: CHAIR.x, z: CHAIR.z + 0.62 };                         // where her first steps take her, before her altar
    const MALA_C = { x: CHAIR.x - 0.42, z: CHAIR.z + 0.82 };                 // Mala at her right in the close
    const RAVI_C = { x: CHAIR.x + 0.48, z: CHAIR.z + 0.55 };                 // Ravi at her left in the close
    /* (the endings' clocks, EN, and the close's, CL, are the chapter's own, z_tail.js: chaptertest reads each scene's length
       from them) */
    /* her rise from the chair (§4.5: "she stands up out of the chair"), standing still after: the rise take run over its
       own five seconds, then held breathing on its end */
    function ammaRise(t, t0) { whenReady(cast.amma, (P) => { put(P, CHAIR.x, CHAIR.z, CHAIR.ry); pose(P, 'rise', t - t0 < 4.9 ? Math.max(0, t - t0) : pingOf(t - t0 - 4.9, 4.6, 0.3, 3.0)); }); }
    function ammaTrance(t) { whenReady(cast.amma, (P) => { put(P, CHAIR.x, CHAIR.z, CHAIR.ry); pose(P, 'trance', pingOf(t, 8.2, 1.5, 3.2)); }); }
    /* the one on her back: its cry, then torn from her (thrown back and gone in the light) */
    function oppressAt(t, cry, torn) {
      whenReady(spirits.oppress, (P) => {
        if (t >= torn + 1.2) { P.group.visible = false; return; }
        P.group.visible = true; put(P, OPP_AT.x, OPP_AT.z, CHAIR.ry, OPP_AT.y); P.group.rotation.x = OPP_TILT;
        if (t < cry) pose(P, 'cry', pingOf(t, 2.6, 1.6, 2.4));
        else if (t < torn) pose(P, 'cry', Math.min(4.4, 0.4 + (t - cry) * 1.1));
        else { pose(P, 'torn', Math.min(2.9, (t - torn) * 1.6)); const k = smo(c01((t - torn) / 1.1)); P.group.position.z -= 0.6 * k; P.group.position.y += 0.25 * k; }
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
        spiritsHome(); castSolid();
        filmBed.on = true; for (const q in filmBed) if (q !== 'on') filmBed[q] = 0; filmBed.dark = BED.dark;      // the dark room under every silence
      },
      frame(k, t, api) {
        fLook('DARK');
        const E = EN[k], c = t - E.close;
        if (c < 0) ENDS[k](t, E, api); else closeFrame(k, c, t);
      },
      end() { fLens(PLAY_FOV); goddess(0); filmBed.on = false; if (kit && kit.vision) kit.vision(null); }
    };
    const ENDS = {
      /* A · HE GRABS HIM AND HOLDS HIM BACK (worst). His arms round Ravi from the side, Ravi fighting him toward his
         mother, Mala screaming at them both; the cry peaks and the thing is torn from her in the light; she opens her
         eyes on a room of people struggling and stands, and her son is not beside her. Ravi goes still; then goes to her.
         His teacher, after; his own thought */
      A(t, E) {
        const RG = { x: R1.x + 0.05, z: R1.z - 0.05 };                       // Ravi, held
        ammaRise(t, E.rise); if (t < E.rise) ammaTrance(t);
        phoStand(t); phoCrown(1 - smo(c01((t - E.rise + 0.4) / 0.8)));
        oppressAt(t, E.cry, E.torn); goddess(t < E.torn ? 1 : 1 - smo(c01((t - E.torn) / 1.5)));
        whenReady(cast.ravi, (P) => {
          if (t < E.go) { put(P, RG.x, RG.z, RAVI_RY); pose(P, 'struggle', Math.min(5.9, t * (t < E.still ? 0.62 : 1.0))); }
          else { const u = smo(c01((t - E.go) / 1.8)); put(P, lp(RG.x, RAVI_C.x, u), lp(RG.z, RAVI_C.z, u), faceTo(RG.x, RG.z, CHAIR.x, CHAIR.z + 0.6));
            if (u < 1) pose(P, 'Walking', (t - E.go) * 1.0, true); else pose(P, 'Idle_3', 3 + (t - E.go) * 0.4);
            lookNow(P, AMMA_FACE, smo(c01((t - E.go - 1) / 1)), 0.9); } });
        whenReady(cast.mala, (P) => { if (t < E.scream) pose(P, 'lightlamp', 5.4); else pose(P, 'scream', Math.min(3.9, (t - E.scream) * 0.9)); lookNow(P, [RG.x, 1.5, RG.z], 0.7, 0.9); });
        visionAt(t, -1, 0.1);
        /* THE LENS: in on Ravi's shoulder as he is caught (his mother beyond him); held through the cry; the light; out
           to her standing; on his teacher for his word */
        track(t, [
          { t: 0, name: 'S', eye: S_EYE, at: [(R1.x + CHAIR.x) / 2, 1.15, (R1.z + CHAIR.z) / 2], fp: 66, fd: 58 },
          { t: 0.55, name: 'held', eye: [R1.x + 0.5, 1.6, R1.z + 0.3], at: [CHAIR.x + 0.1, 1.15, CHAIR.z - 0.05], fp: 64, fd: 56 },
          { t: E.open, name: 'held', eye: [R1.x + 0.5, 1.6, R1.z + 0.3], at: [CHAIR.x + 0.08, 1.1, CHAIR.z], fp: 62, fd: 56 },
          { t: E.rise + 3.5, name: 'her', eye: [R1.x + 0.55, 1.62, R1.z + 0.35], at: [CHAIR.x + 0.05, 1.3, CHAIR.z + 0.1], fp: 58, fd: 52 },
          { t: E.ph - 0.6, name: 'her', eye: [R1.x + 0.55, 1.62, R1.z + 0.35], at: [CHAIR.x + 0.1, 1.35, CHAIR.z + 0.1], fp: 58, fd: 52 },
          { t: E.ph + 0.4, name: 'pho', eye: [R1.x + 0.55, 1.62, R1.z + 0.35], at: [cast.phoB.home.x, 1.62, cast.phoB.home.z], fp: 46, fd: 42 },
          { t: E.close, name: 'pho', eye: [R1.x + 0.55, 1.62, R1.z + 0.35], at: [cast.phoB.home.x, 1.62, cast.phoB.home.z], fp: 46, fd: 42 }
        ]);
        phoTurn(t, E.ph);
      },
      /* B · HE THROWS THE WATER AT THE THING ON HER BACK (bad). The whole bowl at it: it lets go of her and comes at
         HIM, the vision filled with it, his heart stalling, the picture white. His teacher's hand leaves her head for the
         one moment it takes ("Go."); her trance falters; his hands return; the cry rises again and it is forced away.
         She opens her eyes and stands; he is on the floor. His teacher; his own thought */
      B(t, E) {
        ammaRise(t, E.rise); if (t < E.rise) ammaTrance(t);
        const off = t >= E.push && t < E.back;
        phoStand(t); phoCrown(off ? 1 - smo(c01((t - E.push) / 0.25)) : (t < E.push ? 1 : smo(c01((t - E.back) / 0.4))) * (1 - smo(c01((t - E.rise + 0.4) / 0.8))));
        /* the thing: off her back and at him (from her shoulder to a hand's breadth from his eyes), then back on her
           when his teacher's hand returns, its cry, and torn away */
        whenReady(spirits.oppress, (P) => {
          if (t >= E.torn + 1.2) { P.group.visible = false; return; }
          P.group.visible = true;
          const eye = [S_EYE[0], 1.1, S_EYE[2] - 0.45];
          if (t >= E.comes && t < E.back) {
            const u = smo(c01((t - E.comes) / 0.9)), w = smo(c01((t - E.go) / 0.5));
            const x = lp(lp(OPP_AT.x, eye[0], u), OPP_AT.x, w), z = lp(lp(OPP_AT.z, eye[2], u), OPP_AT.z, w), y = lp(lp(OPP_AT.y, eye[1] - 0.75, u), OPP_AT.y, w);
            put(P, x, z, faceTo(x, z, S_EYE[0], S_EYE[2]) * u, y); P.group.rotation.x = OPP_TILT * (1 - u); pose(P, 'claw', (t - E.comes) * 1.2);
          } else { put(P, OPP_AT.x, OPP_AT.z, CHAIR.ry, OPP_AT.y); P.group.rotation.x = OPP_TILT;
            if (t < E.comes) pose(P, 'cry', pingOf(t, 2.6, 1.6, 2.4));
            else if (t < E.torn) pose(P, 'cry', Math.min(4.4, 0.4 + (t - E.cry) * 1.1));
            else { pose(P, 'torn', Math.min(2.9, (t - E.torn) * 1.6)); const k = smo(c01((t - E.torn) / 1.1)); P.group.position.z -= 0.6 * k; P.group.position.y += 0.25 * k; } }
          if (P.fx) P.fx.set('uAlpha', t < E.torn ? 1 : 1 - smo(c01((t - E.torn - 0.3) / 0.9))); });
        goddess(t < E.falter ? 1 : t < E.back ? 0.35 : t < E.torn ? lp(0.35, 1, smo(c01((t - E.back) / 1.2))) : 1 - smo(c01((t - E.torn) / 1.5)));
        whenReady(cast.ravi, (P) => { put(P, R1.x, R1.z, RAVI_RY); pose(P, 'rush', 2.45 + 0.1 * Math.sin(t)); lookNow(P, AMMA_FACE, 1, 0.9); });
        whenReady(cast.mala, (P) => { if (t < E.splash) pose(P, 'lightlamp', 5.4); else pose(P, 'scream', Math.min(3.9, (t - E.splash) * 0.8)); lookNow(P, AMMA_FACE, 0.8, 0.9); });
        visionAt(t, -1, 0.1);
        /* THE LENS: the throw (a lurch at her); the thing filling his eyes; white; his teacher's push seen through the
           white; then he is on the floor, looking up at her standing, and at his teacher */
        track(t, [
          { t: 0, name: 'S', eye: S_EYE, at: [CHAIR.x + 0.0, 1.05, CHAIR.z - 0.1], fp: 60, fd: 54 },
          { t: E.throw + 0.25, name: 'throw', eye: [S_EYE[0] - 0.18, 1.58, S_EYE[2] - 0.12], at: [CHAIR.x - 0.05, 1.0, CHAIR.z - 0.2], fp: 58, fd: 52 },
          { t: E.comes + 0.9, name: 'it', eye: [S_EYE[0] - 0.12, 1.6, S_EYE[2] - 0.05], at: [S_EYE[0] - 0.2, 1.3, S_EYE[2] - 0.7], fp: 70, fd: 64 },
          { t: E.floor, name: 'down', eye: [S_EYE[0] - 0.08, 1.58, S_EYE[2]], at: [S_EYE[0] - 0.2, 1.25, S_EYE[2] - 0.7], fp: 68, fd: 62 },
          { t: E.floor + 0.6, name: 'floor', eye: [S_EYE[0] + 0.1, 0.42, S_EYE[2] + 0.2], at: [cast.phoB.home.x, 1.3, cast.phoB.home.z + 0.2], fp: 66, fd: 58, roll: 0.12 },
          { t: E.back + 0.6, name: 'floor', eye: [S_EYE[0] + 0.1, 0.42, S_EYE[2] + 0.2], at: [CHAIR.x + 0.2, 0.95, CHAIR.z], fp: 66, fd: 58, roll: 0.1 },
          { t: E.rise + 4.5, name: 'floor', eye: [S_EYE[0] + 0.1, 0.42, S_EYE[2] + 0.2], at: [CHAIR.x + 0.1, 1.2, CHAIR.z + 0.1], fp: 62, fd: 56, roll: 0.05 },
          { t: E.ph + 0.3, name: 'pho', eye: [S_EYE[0] + 0.1, 0.45, S_EYE[2] + 0.2], at: [cast.phoB.home.x, 1.55, cast.phoB.home.z], fp: 52, fd: 46 },
          { t: E.close, name: 'pho', eye: [S_EYE[0] + 0.1, 0.45, S_EYE[2] + 0.2], at: [cast.phoB.home.x, 1.55, cast.phoB.home.z], fp: 52, fd: 46 }
        ]);
        phoTurn(t, E.ph, true);
        /* his teacher's push: the right arm out at it and back (his cast's gesture), the hand off her head meanwhile */
        if (off) whenReady(cast.phoB, (P) => { pose(P, 'mage_soell_cast_8', Math.min(1.3, (t - E.push) * 1.1)); });
      },
      /* C · HE GOES TO HIM (best). Between Ravi and the chair, his hands open, low: "She's not being hurt. It's leaving
         her. Stay with her. Hold her hand." Ravi kneels by the chair and takes her hand; Mala comes to the other side.
         The cry; the thing forced from her back; she opens her eyes, looks at her son, and stands, holding his hand */
      C(t, E) {
        const KR = { x: CHAIR.x + 0.42, z: CHAIR.z + 0.12 }, KM = { x: CHAIR.x - 0.48, z: CHAIR.z + 0.2 };
        if (t < E.rise) ammaTrance(t); else ammaRise(t, E.rise);
        phoStand(t); phoCrown(1 - smo(c01((t - E.rise + 0.4) / 0.8)));
        oppressAt(t, E.cry, E.torn); goddess(t < E.torn ? 1 : 1 - smo(c01((t - E.torn) / 1.5)));
        whenReady(cast.ravi, (P) => {
          if (t < E.kneel) { put(P, R1.x, R1.z, RAVI_RY); pose(P, 'rush', 2.45 + 0.08 * Math.sin(t * 1.3)); lookNow(P, 'lens', smo(c01((t - 0.5) / 0.8)), 0.8); }
          else { const u = smo(c01((t - E.kneel) / 1.2)); put(P, lp(R1.x, KR.x, u), lp(R1.z, KR.z, u), lp(RAVI_RY, faceTo(KR.x, KR.z, CHAIR.x, CHAIR.z + 0.2), u));
            pose(P, 'kneelhold', t < E.rise ? Math.min(4.2, (t - E.kneel) * 1.0) : runOf(t, E.rise + 0.6, E.rise + 3.6, 4.2, 0.2));
            lookNow(P, AMMA_FACE, 1, 0.9); } });
        whenReady(cast.mala, (P) => {
          if (t < E.mala) { pose(P, 'lightlamp', 5.4); lookNow(P, AMMA_FACE, 1, 0.9); }
          else { const u = smo(c01((t - E.mala) / 1.2)); put(P, lp(MALA_T.x, KM.x, u), lp(MALA_T.z, KM.z, u), faceTo(KM.x, KM.z, CHAIR.x, CHAIR.z + 0.2));
            pose(P, 'kneelhold', t < E.rise ? Math.min(4.2, (t - E.mala) * 1.0) : runOf(t, E.rise + 0.8, E.rise + 3.8, 4.2, 0.2)); lookNow(P, AMMA_FACE, 1, 0.9); } });
        /* she looks at her son before she stands */
        if (t >= E.look) whenReady(cast.amma, (P) => lookNow(P, headOf(cast.ravi, [KR.x, 0.9, KR.z]), smo(c01((t - E.look) / 0.8)), 1.0));
        visionAt(t, -1, 0.1);
        track(t, [
          { t: 0, name: 'S', eye: S_EYE, at: [(R1.x + CHAIR.x) / 2, 1.15, (R1.z + CHAIR.z) / 2], fp: 66, fd: 58 },
          { t: 0.65, name: 'ravi', eye: [R1.x - 0.25, 1.6, R1.z + 0.62], at: [R1.x, 1.55, R1.z], fp: 50, fd: 46 },
          { t: E.kneel, name: 'ravi', eye: [R1.x - 0.25, 1.6, R1.z + 0.62], at: [R1.x, 1.52, R1.z], fp: 50, fd: 46 },
          { t: E.kneel + 1.6, name: 'kneel', eye: [R1.x - 0.05, 1.6, R1.z + 0.7], at: [CHAIR.x + 0.15, 0.95, CHAIR.z + 0.1], fp: 60, fd: 54 },
          { t: E.rise + 3.5, name: 'stand', eye: [R1.x - 0.05, 1.62, R1.z + 0.75], at: [CHAIR.x + 0.15, 1.3, CHAIR.z + 0.15], fp: 58, fd: 52 },
          { t: E.ph - 0.4, name: 'stand', eye: [R1.x - 0.05, 1.62, R1.z + 0.75], at: [CHAIR.x + 0.15, 1.32, CHAIR.z + 0.15], fp: 58, fd: 52 },
          { t: E.ph + 0.5, name: 'pho', eye: [R1.x - 0.05, 1.62, R1.z + 0.75], at: [cast.phoB.home.x, 1.62, cast.phoB.home.z], fp: 46, fd: 42 },
          { t: E.close, name: 'pho', eye: [R1.x - 0.05, 1.62, R1.z + 0.75], at: [cast.phoB.home.x, 1.62, cast.phoB.home.z], fp: 46, fd: 42 }
        ]);
        phoTurn(t, E.ph);
      },
      /* D · HE KEEPS HIS PLACE (good). The bowl steady, his sight shut, his eyes on his teacher. Ravi reaches the chair;
         his teacher, without looking up: "Ravi. Hold her hand." He does. The cry is heard; the light; she opens her eyes
         and stands. His teacher; his own thought */
      D(t, E) {
        const KR = { x: CHAIR.x + 0.42, z: CHAIR.z + 0.12 };
        if (t < E.rise) ammaTrance(t); else ammaRise(t, E.rise);
        phoStand(t); phoCrown(1 - smo(c01((t - E.rise + 0.4) / 0.8)));
        oppressAt(t, E.cry, E.torn); goddess(t < E.torn ? 1 : 1 - smo(c01((t - E.torn) / 1.5)));
        whenReady(cast.ravi, (P) => {
          if (t < E.kneel) { const u = smo(c01((t - E.reach) / 1.2)); put(P, lp(R1.x, R1.x - 0.12, u), lp(R1.z, R1.z + 0.18, u), RAVI_RY); pose(P, 'rush', 2.45 + 0.08 * Math.sin(t * 1.3)); lookNow(P, AMMA_FACE, 1, 0.9); }
          else { const u = smo(c01((t - E.kneel) / 1.2)); put(P, lp(R1.x - 0.12, KR.x, u), lp(R1.z + 0.18, KR.z, u), lp(RAVI_RY, faceTo(KR.x, KR.z, CHAIR.x, CHAIR.z + 0.2), u));
            pose(P, 'kneelhold', t < E.rise ? Math.min(4.2, (t - E.kneel) * 1.0) : runOf(t, E.rise + 0.6, E.rise + 3.6, 4.2, 0.2)); lookNow(P, AMMA_FACE, 1, 0.9); } });
        whenReady(cast.mala, (P) => { pose(P, 'lightlamp', 5.4); lookNow(P, AMMA_FACE, 1, 0.9); });
        /* his sight shut at the start: the wave home to him */
        visionAt(t, -10, 0.1, E.shut, 1.0);
        track(t, [
          { t: 0, name: 'S', eye: S_EYE, at: [(R1.x + CHAIR.x) / 2, 1.15, (R1.z + CHAIR.z) / 2], fp: 66, fd: 58 },
          { t: 1.2, name: 'pho', eye: S_EYE, at: [cast.phoB.home.x, 1.55, cast.phoB.home.z], fp: 52, fd: 48 },
          { t: E.kneel + 0.6, name: 'pho', eye: S_EYE, at: [cast.phoB.home.x, 1.5, cast.phoB.home.z], fp: 52, fd: 48 },
          { t: E.kneel + 2.0, name: 'hands', eye: S_EYE, at: [CHAIR.x + 0.2, 0.85, CHAIR.z + 0.05], fp: 56, fd: 52 },
          { t: E.rise + 3.5, name: 'stand', eye: S_EYE, at: [CHAIR.x + 0.12, 1.25, CHAIR.z], fp: 58, fd: 52 },
          { t: E.ph - 0.4, name: 'stand', eye: S_EYE, at: [CHAIR.x + 0.12, 1.28, CHAIR.z], fp: 58, fd: 52 },
          { t: E.ph + 0.5, name: 'pho', eye: S_EYE, at: [cast.phoB.home.x, 1.62, cast.phoB.home.z], fp: 46, fd: 42 },
          { t: E.close, name: 'pho', eye: S_EYE, at: [cast.phoB.home.x, 1.62, cast.phoB.home.z], fp: 46, fd: 42 }
        ]);
        phoTurn(t, E.ph);
      }
    };
    /* Grandmaster Pho turns his face to him for his word (and talks: his own talking take, the line's length) */
    function phoTurn(t, ph, low = false) {
      whenReady(cast.phoB, (P) => { if (t >= ph - 0.6) lookNow(P, low ? [S_EYE[0] + 0.1, 0.5, S_EYE[2] + 0.2] : 'lens', smo(c01((t - ph + 0.6) / 0.8)), 0.8, low ? 0 : 0.03); });
    }
    /* THE CLOSE (§4.5, every ending): from his place at her front left again */
    function closeFrame(k, c, tAll) {
      void EN;
      /* she stands (in every ending she has risen by now) and walks to her altar; the ash; her palms together */
      whenReady(cast.amma, (P) => {
        if (c < CL.steps) { put(P, CHAIR.x, CHAIR.z, CHAIR.ry); pose(P, 'rise', pingOf(c, 4.6, 0.3, 3.0)); }
        else if (c < CL.palms) { const u = smo(c01((c - CL.steps) / 3.0)); put(P, CHAIR.x, lp(CHAIR.z, STAND.z, u), CHAIR.ry); pose(P, 'steps', Math.min(3.4, (c - CL.steps) * 1.0)); }
        else { put(P, STAND.x, STAND.z, CHAIR.ry); pose(P, 'lamp', runOf(c, CL.palms, CL.palms + 2.6, 3.4, 5.6)); }
        lookNow(P, [ALTAR.x, 1.45, ALTAR.z], c < CL.palms ? smo(c01((c - CL.steps) / 1.5)) * 0.6 : 0, 0.6); });
      phoStand(tAll); phoCrown(0);
      whenReady(cast.phoB, (P) => { lookNow(P, c > CL.z1 - 1 ? [RAVI_C.x, 1.6, RAVI_C.z] : AMMA_FACE, 0.8, 0.8); });
      /* the family about her: Mala at her right hand (the ash), Ravi at her left */
      whenReady(cast.mala, (P) => { put(P, MALA_C.x, MALA_C.z, faceTo(MALA_C.x, MALA_C.z, STAND.x, STAND.z));
        pose(P, 'Idle_3', 3 + c * 0.3); lookNow(P, AMMA_FACE, 1, 0.9);
        if (c > CL.ash - 0.6 && c < CL.ash + 1.8) { const h = HER_HEAD(); handTo(P, 'R', [h[0] - 0.02, h[1] + 0.02, h[2] + 0.09], [0, 0, -1], [0, 0.3, -1], smo(c01((c - CL.ash + 0.6) / 0.6)) * (1 - smo(c01((c - CL.ash - 1.2) / 0.6))), { out: 0.25, down: 0.35 }); } });
      whenReady(cast.ravi, (P) => { put(P, RAVI_C.x, RAVI_C.z, faceTo(RAVI_C.x, RAVI_C.z, STAND.x, STAND.z)); pose(P, 'Idle_3', 5 + c * 0.3); lookNow(P, AMMA_FACE, 1, 0.9); });
      whenReady(spirits.oppress, (P) => { P.group.visible = false; });
      wanderersAt(c, CL.go);
      /* his sight: still open from the ending (but D's, shut already), closing after her palms */
      if (k !== 'D') visionAt(c, -10, 0.1, CL.shut, 1.0); else visionAt(c, 1e9);
      track(c, [
        { t: 0, name: 'close', eye: S_EYE, at: [CHAIR.x + 0.1, 1.3, CHAIR.z + 0.2], fp: 56, fd: 50, cut: true },
        { t: CL.steps, name: 'close', eye: S_EYE, at: [CHAIR.x + 0.05, 1.3, CHAIR.z + 0.25], fp: 56, fd: 50 },
        { t: CL.palms, name: 'altar', eye: S_EYE, at: [STAND.x, 1.35, STAND.z + 0.1], fp: 54, fd: 50 },
        { t: CL.z1 - 0.5, name: 'altar', eye: S_EYE, at: [STAND.x, 1.38, STAND.z + 0.1], fp: 54, fd: 50 },
        { t: CL.z1 + 0.5, name: 'family', eye: S_EYE, at: [lp(STAND.x, cast.phoB.home.x, 0.5), 1.5, lp(STAND.z, cast.phoB.home.z, 0.5)], fp: 62, fd: 56 },
        { t: CL.end, name: 'family', eye: S_EYE, at: [lp(STAND.x, cast.phoB.home.x, 0.5), 1.5, lp(STAND.z, cast.phoB.home.z, 0.5)], fp: 62, fd: 56 }
      ]);
    }
    /* what a scene reaches of the films (stage.films): the clocks, and each film's three hands */
    const filmsApi = {
      trance: FILMS.trance,
      begin: (k, c, api) => FILMS.ending.begin(k, api),
      frame: (k, t, api) => FILMS.ending.frame(k, t, api),
      end: () => FILMS.ending.end()
    };
