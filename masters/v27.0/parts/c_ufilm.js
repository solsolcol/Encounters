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
    /* (the rush take's hips over the floor, its own metres, every quarter second: tools/probes/takepath.mjs, 18 Nov) */
    const RUSH_HIPS = [[-0.01, -0.03], [-0.01, 0.0], [-0.02, 0.06], [-0.03, 0.22], [-0.08, 0.61], [-0.21, 1.22], [-0.35, 1.82], [-0.43, 2.24], [-0.43, 2.63], [-0.43, 2.82], [-0.44, 2.86], [-0.45, 2.89]];
    const RUSH_AT = (tk) => { const f = Math.max(0, Math.min(RUSH_HIPS.length - 1.001, tk / 0.25)), i = Math.floor(f), u = f - i, A = RUSH_HIPS[i], B = RUSH_HIPS[i + 1];
      return [lp(A[0], B[0], u) - RUSH_HIPS[0][0], lp(A[1], B[1], u) - RUSH_HIPS[0][1]]; };
    /* Ravi where his rush has carried him at the take's moment tk: his group moved along the travel taken out of his
       hips (c_scast.js, P.rushPath), turned with him; the take posed by the caller */
    function rushAt(P, tk, dx = 0, dz = 0) {
      const R = P.rushPath; let ax = 0, az = 0;
      if (R) { const T = R.T, n = T.length; let i = 0; while (i < n - 2 && T[i + 1] <= tk) i++; const u = c01((tk - T[i]) / Math.max(1e-6, T[i + 1] - T[i])), k = Math.min(n - 1, i + 1);
        ax = lp(R.D[i * 2], R.D[k * 2], u); az = lp(R.D[i * 2 + 1], R.D[k * 2 + 1], u); }
      const c = Math.cos(RS.ry), sn = Math.sin(RS.ry);
      put(P, RS.x + ax * c + az * sn + dx, RS.z - ax * sn + az * c + dz, RS.ry);
    }
    const MALA_T = { x: -0.55, z: 4.42 };                                     // Mala at her mother's right hand, before her
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
          { t: TR.end, name: 'end', eye: S_EYE, at: END_AIM, fp: 64, fd: 58 }
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
          if (t > LO.turn) lookNow(P, 'lens', smo(c01((t - LO.turn) / 1.6)), 1.35, 0.05); });
        phoBless(t, 1 - smo(c01((t - LO.lift) / 0.8)));
        whenReady(cast.mala, (P) => { pose(P, 'kneelhold', pingOf(t, 2.5, 1.0, 6.0)); lookNow(P, AMMA_FACE, 1, 0.9); });
        whenReady(cast.ravi, (P) => { pose(P, 'Idle_3', 3 + t * 0.35, true); lookNow(P, AMMA_FACE, 1, 0.9); });
        whenReady(spirits.oppress, (P) => { oppRide(P); pose(P, 'cling', 2 + t * 0.3); });
        spirits.wander.forEach((P, i) => { if (LOST_RING[i]) whenReady(P, (Q) => pose(Q, i % 2 ? 'creep' : 'crawl', 0.37 * i + t * 0.9, true)); });
        goddess(0);
        visionAt(t, 0.05, 0.9, LO.shut, 1.0);
        track(t, [
          { t: 0, name: 'her', eye: S_EYE, at: [CHAIR.x - 0.08, 0.92, CHAIR.z + 0.12], fp: 62, fd: 54 },
          { t: LO.turn, name: 'her', eye: S_EYE, at: [CHAIR.x - 0.04, 1.0, CHAIR.z + 0.06], fp: 54, fd: 48 },
          { t: LO.shut + 1.0, name: 'her', eye: S_EYE, at: [CHAIR.x - 0.02, 1.02, CHAIR.z + 0.06], fp: 48, fd: 43 },
          { t: LO.end, name: 'her', eye: S_EYE, at: [CHAIR.x - 0.02, 1.02, CHAIR.z + 0.06], fp: 48, fd: 43 }
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
    const MALA_C = { x: CHAIR.x - 0.42, z: CHAIR.z + 0.82 };                 // Mala at her right in the close
    /* Ravi KNEELS at her left in the close (his kneel's own take), looking up at her: on his knees his head is a third of
       a metre under her face from every place the close looks from, and clear of the chair, the lamp and her steps */
    /* (a step behind her left since 18 Nov: at her side he knelt on the line from the merit's eye to her palms, and the
       lamp's shot was the back of his head, photographed) */
    const RAVI_C = { x: CHAIR.x + 0.47, z: CHAIR.z + 0.40 };
    /* the last green shapes in the close (A, B, C: his sight still open): two of the night's wanderers going out by the
       room's open door as his teacher gives them a share of the merit, each crawling its own take's travel toward the
       doorway (its hips go 0.9 m in the 2.3 s it is seen, clear of the bowl, the TV and the sofa) and fading */
    const CLOSE_WANDER = [{ x: 0.60, z: 2.50 }, { x: 0.25, z: 0.72 }].map(W => ({ ...W, ry: faceTo(W.x, W.z, 0, -0.4) }));
    /* Appa in the close (his sight still open in A, B, C): standing in the room between the shapes' way out and her
       chair, turned to her, while the merit is given; he does not go with them. (18 Nov, photographed: by his photograph,
       his own place, he stood a step from the close's lens and laid himself over his teacher's shoulder) */
    const APPA_C = { x: 0.10, z: 1.64 };
    /* (the endings' clocks, EN, and the close's, CL, are the chapter's own, z_tail.js: chaptertest reads each scene's length
       from them) */
    /* her rise from the chair (§4.5: "she stands up out of the chair"), standing still after: the rise take run over its
       own five seconds, then held breathing on its end */
    /* (out of her trance's held breath over its first 0.4 s, so her body does not jump the 5 cm between the two takes'
       first moments) */
    function ammaRise(t, t0) { whenReady(cast.amma, (P) => { put(P, CHAIR.x, CHAIR.z, CHAIR.ry);
      pose(P, 'rise', t - t0 < 4.9 ? Math.max(0, t - t0) : pingOf(t - t0 - 4.9, 4.6, 0.3, 3.0), false, 'trance', 1 - smo(c01((t - t0) / 0.4)), pingOf(t, 8.2, 1.5, 3.2)); }); }
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
        /* standing, she looks back over her shoulder for her son: held back, behind her (her face turned to him and to
           us; a neck's reach, the rest of the turn is his to see), and calls him ("Ravi?" at E.call: 18 Nov, photographed,
           said at 10.7 it fell while she was still pushing up out of the chair, her face down; he goes still on her voice) */
        if (t > E.call - 0.6) whenReady(cast.amma, (P) => lookNow(P, headOf(cast.ravi, [RG.x, 1.4, RG.z]), smo(c01((t - E.call + 0.6) / 1.0)), 1.25, 0.04));
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
        whenReady(cast.mala, (P) => { if (t < E.scream) pose(P, 'lightlamp', 5.4); else pose(P, 'scream', Math.min(3.9, (t - E.scream) * 0.9)); lookNow(P, [RG.x, 1.5, RG.z], 0.7, 0.9); });
        visionAt(t, -1, 0.1);
        /* THE LENS: in on Ravi's shoulder as he is caught (his mother beyond him); held through the cry; the light; out
           to her standing; on his teacher for his word */
        track(t, [
          { t: 0, name: 'S', eye: S_EYE, at: END_AIM, fp: 64, fd: 58 },
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
            const u = smo(c01((t - E.comes) / 0.9)), w = smo(c01((t - E.go) / 0.5)), m = u * (1 - w);
            oppRide(P); _obq.copy(P.group.quaternion);
            const g = P.group.position, x = lp(g.x, eye[0], m), z = lp(g.z, eye[2], m), y = lp(g.y, eye[1] - 0.75, m);
            _ofq.setFromEuler(_ofe.set(0, faceTo(x, z, S_EYE[0], S_EYE[2]), 0));
            P.group.position.set(x, y, z); P.group.quaternion.slerpQuaternions(_obq, _ofq, m); pose(P, 'claw', (t - E.comes) * 1.2);
          } else { oppRide(P);
            if (t < E.comes) pose(P, 'cry', pingOf(t, 2.6, 1.6, 2.4));
            else if (t < E.torn) pose(P, 'cry', Math.min(4.4, 0.4 + (t - E.cry) * 1.1));
            else { const k = smo(c01((t - E.torn) / 1.1)); pose(P, 'cry', lp(1.0, 1.9, k)); P.group.position.z -= 0.6 * k; P.group.position.y += 0.25 * k; } }
          if (P.fx) P.fx.set('uAlpha', t < E.torn ? 1 : 1 - smo(c01((t - E.torn - 0.3) / 0.9))); });
        goddess(t < E.falter ? 1 : t < E.back ? 0.35 : t < E.torn ? lp(0.35, 1, smo(c01((t - E.back) / 1.2))) : 1 - smo(c01((t - E.torn) / 1.5)));
        whenReady(cast.ravi, (P) => { const tk = 2.45 + 0.1 * Math.sin(t); rushAt(P, tk); pose(P, 'rush', tk); lookNow(P, AMMA_FACE, 1, 0.9); });
        /* Mala: crying out as the water hits her mother ("What are you doing?"), and at the falter ("Amma!"); her scream
           let go once her mother is up, and her eyes down to him on the floor ("Are you alright?") */
        whenReady(cast.mala, (P) => { if (t < E.splash) pose(P, 'lightlamp', 5.4);
          else { const r = smo(c01((t - E.rise - 1.2) / 1.4)); pose(P, 'scream', Math.min(3.9, (t - E.splash) * 0.8), false, 'Idle_3', r, 3 + t * 0.35); }
          lookNow(P, lp3(AMMA_FACE, B_FLOOR, smo(c01((t - E.ok + 0.5) / 0.6))), 0.8, 0.9); });
        visionAt(t, -1, 0.1);
        /* THE LENS: the throw (a lurch at her); the thing filling his eyes; white; his teacher's push seen through the
           white; then he is on the floor, looking up at her standing, and at his teacher */
        track(t, [
          { t: 0, name: 'S', eye: S_EYE, at: END_AIM, fp: 64, fd: 58 },
          { t: E.throw + 0.25, name: 'throw', eye: [S_EYE[0] + TOWARD[0] * 0.2, 1.58, S_EYE[2] + TOWARD[1] * 0.2], at: [CHAIR.x - 0.05, 1.0, CHAIR.z - 0.2], fp: 58, fd: 52 },
          { t: E.comes + 0.9, name: 'it', eye: [S_EYE[0] - TOWARD[0] * 0.06, 1.6, S_EYE[2] - TOWARD[1] * 0.06], at: [COMES[0], 1.3, COMES[2]], fp: 70, fd: 64 },
          { t: E.floor, name: 'down', eye: [S_EYE[0] - TOWARD[0] * 0.1, 1.58, S_EYE[2] - TOWARD[1] * 0.1], at: [COMES[0], 1.25, COMES[2]], fp: 68, fd: 62 },
          { t: E.floor + 0.6, name: 'floor', eye: [S_EYE[0] + 0.1, 0.42, S_EYE[2] + 0.2], at: [cast.phoB.home.x, 1.3, cast.phoB.home.z + 0.2], fp: 66, fd: 58, roll: 0.12 },
          { t: E.back + 0.6, name: 'floor', eye: [S_EYE[0] + 0.1, 0.42, S_EYE[2] + 0.2], at: [CHAIR.x + 0.2, 0.95, CHAIR.z], fp: 66, fd: 58, roll: 0.1 },
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
      },
      /* C · HE GOES TO HIM (best). Between Ravi and the chair, his hands open, low: "She's not being hurt. It's leaving
         her. Stay with her. Hold her hand." Ravi kneels by the chair and takes her hand; Mala comes to the other side.
         The cry; the thing forced from her back; she opens her eyes, looks at her son, and stands, holding his hand */
      C(t, E) {
        const KR = { x: CHAIR.x + 0.42, z: CHAIR.z + 0.12 }, KM = { x: CHAIR.x - 0.48, z: CHAIR.z + 0.2 };
        if (t < E.rise) ammaTrance(t); else ammaRise(t, E.rise);
        phoBless(t, 1 - smo(c01((t - E.rise + 0.4) / 0.8)));
        oppressAt(t, E.cry, E.torn); goddess(t < E.torn ? 1 : 1 - smo(c01((t - E.torn) / 1.5)));
        whenReady(cast.ravi, (P) => {
          if (t < E.kneel) { const tk = 2.45 + 0.08 * Math.sin(t * 1.3); rushAt(P, tk); pose(P, 'rush', tk); lookNow(P, 'lens', smo(c01((t - 0.5) / 0.8)), 0.8); }
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
          { t: 0, name: 'S', eye: S_EYE, at: END_AIM, fp: 64, fd: 58 },
          { t: 0.65, name: 'ravi', eye: [R1.x - 0.25, 1.6, R1.z + 0.62], at: [R1.x, 1.55, R1.z], fp: 50, fd: 46 },
          { t: E.kneel, name: 'ravi', eye: [R1.x - 0.25, 1.6, R1.z + 0.62], at: [R1.x, 1.52, R1.z], fp: 50, fd: 46 },
          { t: E.kneel + 1.6, name: 'kneel', eye: [R1.x - 0.05, 1.6, R1.z + 0.7], at: [CHAIR.x + 0.15, 0.95, CHAIR.z + 0.1], fp: 60, fd: 54 },
          { t: E.rise + 3.5, name: 'stand', eye: [R1.x - 0.05, 1.62, R1.z + 0.75], at: [CHAIR.x + 0.15, 1.3, CHAIR.z + 0.15], fp: 58, fd: 52 },
          { t: E.ph - 0.4, name: 'stand', eye: [R1.x - 0.05, 1.62, R1.z + 0.75], at: [CHAIR.x + 0.15, 1.32, CHAIR.z + 0.15], fp: 58, fd: 52 },
          { t: E.ph + 0.5, name: 'pho', eye: [R1.x - 0.05, 1.62, R1.z + 0.75], at: [cast.phoB.home.x, 1.62, cast.phoB.home.z], fp: 46, fd: 42 },
          { t: E.close, name: 'pho', eye: [R1.x - 0.05, 1.62, R1.z + 0.75], at: [cast.phoB.home.x, 1.62, cast.phoB.home.z], fp: 46, fd: 42 }
        ]);
        phoTurn(t, E.ph, false, 'ph4C1');
      },
      /* D · HE KEEPS HIS PLACE (good). The bowl steady, his sight shut, his eyes on his teacher. Ravi reaches the chair;
         his teacher, without looking up: "Ravi. Hold her hand." He does. The cry is heard; the light; she opens her eyes
         and stands. His teacher; his own thought */
      D(t, E) {
        const KR = { x: CHAIR.x + 0.42, z: CHAIR.z + 0.12 };
        if (t < E.rise) ammaTrance(t); else ammaRise(t, E.rise);
        phoBless(t, 1 - smo(c01((t - E.rise + 0.4) / 0.8)));
        oppressAt(t, E.cry, E.torn); goddess(t < E.torn ? 1 : 1 - smo(c01((t - E.torn) / 1.5)));
        whenReady(cast.ravi, (P) => {
          if (t < E.kneel) { const u = smo(c01((t - E.reach) / 1.2)), tk = 2.45 + 0.08 * Math.sin(t * 1.3); rushAt(P, tk, -0.12 * u, 0.18 * u); pose(P, 'rush', tk); lookNow(P, AMMA_FACE, 1, 0.9); }
          else { const u = smo(c01((t - E.kneel) / 1.2)); put(P, lp(R1.x - 0.12, KR.x, u), lp(R1.z + 0.18, KR.z, u), lp(RAVI_RY, faceTo(KR.x, KR.z, CHAIR.x, CHAIR.z + 0.2), u));
            pose(P, 'kneelhold', t < E.rise ? Math.min(4.2, (t - E.kneel) * 1.0) : runOf(t, E.rise + 0.6, E.rise + 3.6, 4.2, 0.2)); lookNow(P, AMMA_FACE, 1, 0.9); } });
        whenReady(cast.mala, (P) => { pose(P, 'lightlamp', 5.4); lookNow(P, AMMA_FACE, 1, 0.9); });
        /* his sight shut at the start: the wave home to him */
        visionAt(t, -10, 0.1, E.shut, 1.0);
        track(t, [
          { t: 0, name: 'S', eye: S_EYE, at: END_AIM, fp: 64, fd: 58 },
          { t: 1.2, name: 'pho', eye: S_EYE, at: [cast.phoB.home.x, 1.55, cast.phoB.home.z], fp: 52, fd: 48 },
          { t: E.kneel + 0.6, name: 'pho', eye: S_EYE, at: [cast.phoB.home.x, 1.5, cast.phoB.home.z], fp: 52, fd: 48 },
          { t: E.kneel + 2.0, name: 'hands', eye: S_EYE, at: [CHAIR.x + 0.2, 0.85, CHAIR.z + 0.05], fp: 56, fd: 52 },
          { t: E.rise + 3.5, name: 'stand', eye: S_EYE, at: [CHAIR.x + 0.12, 1.25, CHAIR.z], fp: 58, fd: 52 },
          { t: E.ph - 0.4, name: 'stand', eye: S_EYE, at: [CHAIR.x + 0.12, 1.28, CHAIR.z], fp: 58, fd: 52 },
          { t: E.ph + 0.5, name: 'pho', eye: S_EYE, at: [cast.phoB.home.x, 1.62, cast.phoB.home.z], fp: 46, fd: 42 },
          { t: E.close, name: 'pho', eye: S_EYE, at: [cast.phoB.home.x, 1.62, cast.phoB.home.z], fp: 46, fd: 42 }
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
    const _phv = new THREE.Vector3();
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
        if (c > CL.ash - 0.6 && c < CL.ash + 1.8) { const h = HER_BROW(); handTo(P, 'R', [h[0] - 0.02, h[1], h[2]], [1, 0, 0], [0, 0, -1], smo(c01((c - CL.ash + 0.6) / 0.6)) * (1 - smo(c01((c - CL.ash - 1.2) / 0.6))), { out: 0.25, down: 0.35 }); } });
      /* (Ravi turns his head to his teacher as he is spoken to: a neck's reach, his body still turned to her) */
      whenReady(cast.ravi, (P) => { put(P, RAVI_C.x, RAVI_C.z, faceTo(RAVI_C.x, RAVI_C.z, STAND.x, STAND.z)); pose(P, 'kneelhold', pingOf(c, 2.6, 0.8, 6.0));
        const h = HER_HEAD(), ph = cast.phoB.home, k = smo(c01((c - CL.z1 + 0.9) / 0.9));
        lookNow(P, [lp(h[0], ph.x, k), lp(h[1], 1.55, k), lp(h[2], ph.z, k)], 1, 1.0); });
      whenReady(spirits.oppress, (P) => { P.group.visible = false; });
      whenReady(spirits.appa, (P) => { if (P.gone) return; put(P, APPA_C.x, APPA_C.z, faceTo(APPA_C.x, APPA_C.z, CHAIR.x, CHAIR.z + 0.3)); pose(P, 'Idle_3', 2 + c * 0.3, true); });
      spirits.wander.forEach((P, i) => whenReady(P, (Q) => { const W = CLOSE_WANDER[i]; if (!W) return;
        put(Q, W.x, W.z, W.ry); Q.group.visible = true; pose(Q, 'crawl', Math.max(0, c - CL.go + 1.0) * 0.6); }));
      wanderersAt(c, CL.go);
      /* his sight: still open from the ending (but D's, shut already), closing after her palms */
      if (k !== 'D') visionAt(c, -10, 0.1, CL.shut, 1.0); else visionAt(c, 1e9);
      /* THE LENS (18 Nov, re-staged): his teacher whole as he dedicates the merit, the last green shapes going out low
         past him; to her, risen at her chair; her steps to her altar; in on the ash between her and her daughter; her
         palms and her lamp; his sight closing on her; out to her family about her in the room's own colours; and over her
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
        FM.once = new Set(); castHome(); spiritsHome(); whenReady(cast.phoB, (P) => bowSet(P, 0));
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
        whenReady(cast.amma, (P) => { pose(P, 'wsit', pingOf(t, 2.0, 3.6, 12)); if (t > T.look) lookNow(P, 'lens', smo(c01((t - T.look) / 2.0)), 1.35, 0.05); });
        /* the one on her back, seen only in the flicker; its face turned to him with hers */
        whenReady(spirits.oppress, (P) => { oppRide(P); pose(P, 'cling', 2 + t * 0.3); if (t > T.look) lookNow(P, 'lens', smo(c01((t - T.look - 0.4) / 1.6)), 1.3); });
        /* his sight, open for a held breath by itself */
        if (kit && kit.vision) {
          const u = c01((t - T.flick) / (T.flickEnd - T.flick)), r = t < T.flick || t > T.flickEnd ? 0 : 7 * Math.sin(Math.PI * u);
          kit.vision({ r, moving: r > 0.01 });
        }
        /* THE LENS */
        track(t, [
          { t: 0, name: 'estate', eye: [-6.0, 1.5, -1.3], at: [-14, 5, -42], fp: 52, fd: 46 },
          { t: T.turn, name: 'estate', eye: [-6.0, 1.5, -1.3], at: [-2, 4.5, -42], fp: 52, fd: 46 },
          { t: T.walk, name: 'corridor', eye: [-6.0, 1.5, -1.05], at: [2, 1.35, -0.85], fp: 60, fd: 54 },
          { t: T.at, name: 'gate', eye: [-1.25, 1.5, -1.1], at: [0.15, 1.25, -0.2], fp: 58, fd: 52 },
          { t: T.cut1 + 0.6, name: 'door', eye: [0.48, 1.5, -1.05], at: [RAVI_DOOR.x, 1.6, RAVI_DOOR.z], fp: 50, fd: 46, cut: true },
          { t: T.cut2, name: 'door', eye: [0.48, 1.5, -1.05], at: [RAVI_DOOR.x, 1.6, RAVI_DOOR.z], fp: 50, fd: 46 },
          { t: T.cut2 + 0.5, name: 'in', eye: [0.1, 1.6, 0.45], at: [CHAIR.x, 1.1, CHAIR.z], fp: 62, fd: 56, cut: true },
          { t: T.inside, name: 'in', eye: [0.45, 1.62, 1.7], at: [CHAIR.x + 0.1, 1.05, CHAIR.z], fp: 62, fd: 56 },
          { t: T.look, name: 'her', eye: O_EYE, at: [CHAIR.x + 0.02, 1.0, CHAIR.z + 0.05], fp: 50, fd: 46 },
          { t: T.end, name: 'her', eye: O_EYE, at: [CHAIR.x + 0.02, 1.0, CHAIR.z + 0.05], fp: 46, fd: 44 }
        ]);
      },
      /* play begins in the history (historyBegin stages everyone again): her gate shut behind them, the beds play's */
      end() { fLens(PLAY_FOV); filmBed.on = false; for (const g of (things.w4gate || []).slice(0, 1)) g.visible = true; if (kit && kit.vision) kit.vision(null); }
    };
    filmsApi.open = FILMS.open;
