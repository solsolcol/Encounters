    /* ================================================================ THE FILMS' PICTURES (M6: each film's shots are
       written here; the cues are below the build) */
    /* Every film is HIS EYES (the grown Master Zavier is never seen: CLAUDE.md, v24.56): the lens stands where he
       kneels or stands, narrows and pans, and never moves through the people (the plan's §7). Every picture is a pure
       function of the film's clock (v6.4): people are POSED at the moment the clock asks for (pose), a look is laid on
       at once (lookNow), a throw of petals is where its age puts it (burstAt), so a seek, a skip and a slow phone land
       on the same picture. Whatever a film changes in the world is put back by the play that follows it (lineBegin,
       dawnBegin, toldBegin stage everything again), so a film skipped leaves what a film played leaves (v24.12). */
    const FL = { key: '', api: null, once: new Set(), must: null, lit: '', bursts: {}, vf: null, throwAt: null, throwPho: null, shot: '', sky: null, bai: false, wai: false, waiPos: null, waiQ: null, faces: {}, openK: 0, openOut: 0, litE: -1, litA: -1, goldMin: 0, tabled: false, rest0: null };
    const PLAY_FOV = camera.fov;                                              // the lens play is seen through (a film that ends in the clear ends on it)
    const _ffv = new THREE.Vector3();
    function fLook(name, secs = 0) { if (FL.lit !== name) { FL.lit = name; look(name, secs); } }
//@@COPY 3546-3559 :: function onceAt(id, t, at, fn, span = 1.5)
//@@COPY 3874-3874 :: function shot(eye, at, fPhone, fDesk, roll = 0)
//@@COPY 3883-3940 :: const FIT = { x: 0.84, y: 0.8, max: 74 };
    const E0 = [PLACE.x, KNEEL.y, PLACE.z];                                   // his eye, kneeling at his place
    const E2 = [-5.0, EYE, -1.55];                                            // his eye, standing among the people before the west tent
    /* the festival's second half: those who go up (the woman before the hermit in brown, the man before the hermit in
       the yellow shawl), her bai sri raised and then set down at her left knee, and where he is to see each: at the
       north end of the masters' row, kneeling among those who wait, the two of them side on (PN: from standing height
       the lens looked down on the tops of two heads); beside the yellow hermit's sofa, standing, onto the man's face
       (PM) */
    const GO_A = [-9.16, -2.2], GO_B = [-9.15, 5.0], BAI_UP = [-9.70, 0.70, -2.2], BAI_DOWN = [-9.5, 0.012, -1.76];
    const PN = [-9.9, 1.08, -4.5], PM = [-10.4, EYE, 3.6];
    /* and where he stands for the man in white: 7.5 m before the bench, on the line that passes between Ton and those
       who wait their turn (measured in the bench's own frame against every seat of the `bless` formation) */
    const E3 = (() => { const [x, z] = benchAt(-0.22, 7.5); return [x, EYE, z]; })();
    const FILMS = {};

    /* ---------------------------------------------------------------- THE FESTIVAL (§4.1 P3; its clock: FEST)
       The dance, watched from where he kneels; a cut; those who go up at the west tent, watched from where he stands
       with Ton's group; the lens along the masters, and its stop on the man in white. */
    /* a film's own throw of petals: made once when the film's clock reaches it, run by that clock (so a seek lands on
       the same petals), and gone with the film */
    function filmBurst(id, t, t0, from, to, o) {
      if (t >= t0 && !FL.bursts[id] && from) { const Bu = petalBurst(from, to, t0, o); Bu.film = true; FL.bursts[id] = Bu; }
      if (FL.bursts[id]) burstAt(FL.bursts[id], t);
    }
    function filmBurstsEnd() { for (const id in FL.bursts) { const Bu = FL.bursts[id]; Bu.film = false; Bu.on = false; Bu.im.visible = false; } FL.bursts = {}; }
    FILMS.festival = {
      begin(api) {
        if (api.handsRoot) api.handsRoot.visible = false;
        FL.bursts = {}; FL.throwPho = null;
        /* those who go up: the woman before the hermit in brown, the man before the hermit in the yellow shawl */
        whenReady(cast.goA, (A) => put(A, GO_A[0], GO_A[1], -Math.PI / 2));
        whenReady(cast.goB, (Bm) => put(Bm, GO_B[0], GO_B[1], -Math.PI / 2));
        FL.throwAt = null;
        dancersDance();                                                          // (in play they stand at the masters' side: the dance is danced on its places)
      },
      frame(t, api) {
        const T = FEST, second = t >= T.cut + 0.62;                            // (the formation changes inside the cut's black)
        if ((formNow === 'bless') !== second) {
          setFormation(second ? 'bless' : 'arrive');
          if (second) { put(cast.ton, TON_LINE.x, TON_LINE.z, faceTo(TON_LINE.x, TON_LINE.z, PHO_AT[0], PHO_AT[1])); cast.ton.rest.take = 'Idle_3'; cast.ton.rest.win = null; rest(cast.ton, 0);
            put(cast.aunt, AUNT_LINE.x, AUNT_LINE.z, AUNT_LINE.ry); myBai.visible = false; }
          else { put(cast.ton, TON_PLACE.x, TON_PLACE.z, faceTo(TON_PLACE.x, TON_PLACE.z, 0, -11.2)); put(cast.aunt, cast.aunt.home.x, cast.aunt.home.z, cast.aunt.home.ry); }
          castSolid();
        }
        danceG.visible = !second;
        for (const P of [cast.goA, cast.goB]) if (P.ready) P.group.visible = second;
        if (!second && dancersDir.ph !== 'dance') dancersDance();              // (a seek back over the cut: the formation has stood them by)
        if (!second) {
          /* THE DANCE: the two drivers posed from the film's clock, the first take given over to the second near its end */
          const k2 = sgk(t, 9.0, 9.9);
          for (const D of [dancers.A, dancers.B]) pose(D, 'dance1', Math.min(t, 9.9), false, k2 > 0 ? 'dance2' : null, k2, Math.max(0, t - 9.0));
          /* Ton, beside him, turns his head to say it */
          pose(cast.ton, 'seiza', 1.2 + 0.3 * Math.sin(t * 0.7), false);
          lookNow(cast.ton, 'lens', sgk(t, T.tn3d1 - 0.5, T.tn3d1 + 0.3) * (1 - sgk(t, T.q3m0 - 0.9, T.q3m0 - 0.2)), 1.2);
          const dc = [DANCE.c[0], 1.3, DANCE.c[1]], lead = [dancers.at[1][0], 1.36, dancers.at[1][1]];
          if (t < T.tn3d1 - 0.45) fitShot(E0, lp3([0.4, 1.3, -9.5], dc, smo(sgk(t, 0.1, 1.9))), 66, 56, dancers.at.map(p => [p[0], 1.65, p[1]]));
          else if (t < T.q3m0 - 0.75) shot(E0, [TON_PLACE.x, 0.98, TON_PLACE.z], 52, 42);
          else { const k = smo(sgk(t, T.q3m0 - 0.75, T.cut)); shot(E0, lead, lp(34, 25, k), lp(27, 20, k)); }
          auraAt(0, t);
        } else {
          const A = cast.goA, Bm = cast.goB, H = cast.hermitA, R = cast.red, HB = cast.hermitB, Ph = cast.pho, tm = t - T.masters;
          /* (where a hand lets its petals go: the take's own hand at its throw, measured once before the body is
             posed, so a seek and a play throw from one place) */
          if (!FL.throwAt && H.ready) { const v = handsAt(H, 'petals', 2.3, new THREE.Vector3(), 'R'); if (v) { H.group.localToWorld(v); FL.throwAt = [v.x, v.y + 0.05, v.z]; } }
          if (!FL.throwPho && Ph.ready) { const v = handsAt(Ph, 'Sit_Cheer_with_Left_Hand', 1.32, new THREE.Vector3(), 'R'); if (v) { Ph.group.localToWorld(v); FL.throwPho = [v.x, v.y + 0.08, v.z]; } }
          /* HER BAI SRI IS THE TRUTH, and the four hands go to it (handsTo): raised before her bowed head, riding her
             breath; then set down at her left knee (behind the cut to the man) */
          const kd = smo(sgk(t, T.low, T.low + 1.25)), bc = lp3(BAI_UP, BAI_DOWN, kd);
          bc[1] = lp(BAI_UP[1], BAI_DOWN[1], kd * kd) + 0.006 * Math.sin(tm * 1.3) * (1 - kd);
          baiPut(ymBai, bc[0], bc[1], bc[2], 0.4);
          /* the hermit in brown: from his rest both hands come onto it and lie there (photograph 5: the empowerment);
             then a handful of petals (his take from a little way in: the hand is already lifting); at rest again */
          const hs = 1.6 + 0.4 * Math.sin(tm * 0.9), idle = 9.6 + 0.3 * Math.sin(t * 0.5), kOn = smo(sgk(t, T.masters + 0.35, T.masters + 1.5)), tp = 0.6 + Math.max(0, t - T.pet);
          if (t < T.pet) pose(H, 'Chair_Sit_Idle_M', idle, false, 'handson', kOn, hs);
          else if (tp < 3.9) pose(H, 'handson', hs, false, 'petals', smo(sgk(t, T.pet, T.pet + 0.5)), tp);
          else pose(H, 'petals', 3.9, false, 'Chair_Sit_Idle_M', smo(sgk(tp, 3.9, 4.6)), idle);
          handsTo(H, baiGrip(bc, BAI.s, [H.group.position.x, H.group.position.z], 'on'), kOn * (1 - smo(sgk(t, T.pet - 0.1, T.pet + 0.45))));
          /* the woman: on her heels, her head bowed, the bowl raised in both hands; it is set down; she goes quite still */
          pose(A, 'seiza', 1.4 + 0.3 * Math.sin(tm * 0.7), false, 'sway', smo(sgk(t, T.low + 1.5, T.low + 2.8)), 0.3 + Math.max(0, t - T.low - 1.5) * 0.9);
          handsTo(A, baiGrip(bc, BAI.s, [A.group.position.x, A.group.position.z], 'under'), 1 - smo(sgk(t, T.low + 1.2, T.low + 1.8)));
          lookNow(A, [bc[0] - 0.25, 0.2, bc[2]], 0.75, 0.6, 0);
          if (A.ready) filmBurst('hermit', t, T.throw, FL.throwAt, [A.group.position.x - 0.12, A.group.position.z], { r: 0.5, up: 1.25, seed: 4471, s: 0.03 });
          /* the master in red speaks with those who kneel to him */
          pose(R, 'Sitting_Answering_Questions', 0.8 + tm, true);
          /* the hermit in the yellow shawl: his hand held out over the man; the man, heaped with petals, whose arms
             rise wide and whose face lifts (photograph 12) */
          pose(HB, 'palmover', 1.7 + 0.8 * (0.5 - 0.5 * Math.cos(tm * 0.5)), false);
          pose(Bm, 'armsup', 1.3 + (5.4 - 1.3) * smo(sgk(t, T.man + 0.3, T.man + 5.2)) + (t > T.man + 5.2 ? 0.1 * Math.sin((t - T.man - 5.2) * 1.1) : 0), false);
          lookNow(Bm, [GO_B[0] - 1.4, 2.5, GO_B[1]], 0.6 * smo(sgk(t, T.man + 0.6, T.man + 4.8)), 0.42, 0);
          if (t < T.man) {
            /* HANDS ON THE BAI SRI: from the row's end, kneeling among those who wait, the two of them side on with
               the bowl between them; a slow push as the hands are laid and the petals come */
            const k = smo(sgk(t, T.masters, T.man));
            fitShot(PN, [BAI_UP[0] + 0.02, lp(0.87, 0.84, k), BAI_UP[2]], lp(45, 40, k), lp(31, 26, k), [[-10.12, 1.24, -2.2], [GO_A[0] - 0.08, 1.0, GO_A[1]], [BAI_UP[0], BAI_UP[1] + 0.5, BAI_UP[2]], [BAI_UP[0], BAI_UP[1] - 0.05, BAI_UP[2]]]);
            auraAt(0, t);
          } else if (t < T.sweep) {
            /* THE TRANCE: from beside the hermit's sofa, the man's face and his arms as they rise */
            const k = smo(sgk(t, T.man, T.sweep));
            fitShot(PM, [GO_B[0], lp(0.92, 1.0, k), GO_B[1]], lp(50, 44, k), lp(34, 29, k), [[GO_B[0], 1.7, GO_B[1] - 0.72], [GO_B[0], 1.7, GO_B[1] + 0.72], [GO_B[0], 0.3, GO_B[1]]]);
            auraAt(0, t);
          } else if (t < T.pho) {
            /* THE LENS ALONG THE MASTERS: from the west tent (she kneels there still, her bai sri beside her) round by
               the north (the tables, the hall) and the east (the monks) to the gold canopy across the turf, where it
               slows, stops and begins to narrow. One move, eased at both ends; its lens a smooth function of the clock */
            const y0 = yawTo(E2[0], E2[2], -9.9, -1.6), y1 = yawTo(E2[0], E2[2], PHO_AT[0], PHO_AT[1]), ks = smo(sgk(t, T.sweep, T.sweep + 5.6));
            const ya = y0 + (y1 - y0) * ks, dPho = Math.hypot(PHO_AT[0] - E2[0], PHO_AT[1] - E2[2]), kz = smo(sgk(t, T.sweep + 4.4, T.pho));
            const ay = lp(lp(0.15, 1.45, smo(sgk(ks, 0, 0.3))), EYE + (1.45 - EYE) * 10 / dPho, smo(sgk(ks, 0.62, 1)));
            shot(E2, [E2[0] - Math.sin(ya) * 10, ay, E2[2] - Math.cos(ya) * 10], lp(58, 31, kz), lp(46, 24, kz));
            auraAt(0, t);
          } else {
            /* THE MAN IN WHITE: nearer, down the lane the line comes up, nothing between; the lens narrows on him. He
               is at his work: a handful of petals over those who kneel to him (photograph 1), then quite still, his
               eyes on them and never on the lens (that look is kept for the play: §4.1 P4). The gold comes up on him */
            const kc = smo(sgk(t, T.cheer, T.cheer + 0.45)) * (1 - smo(sgk(t, T.cheer + 2.25, T.cheer + 2.95)));
            pose(Ph, 'Sit_to_Stand_Transition_M', 0.16 + 0.13 * Math.sin(t * 0.8), false, 'Sit_Cheer_with_Left_Hand', kc, 0.15 + Math.max(0, t - T.cheer) * 0.9);
            { const [lx, lz] = benchAt(-1.2, 2.2); lookNow(Ph, [lx, 0.85, lz], 1, 0.45, 0.02); }
            { const [tx, tz] = benchAt(0.15, 1.7); filmBurst('pho', t, T.throw2, FL.throwPho, [tx, tz], { r: 0.95, up: 1.5, seed: 9127, s: 0.034 }); }
            const k = smo(sgk(t, T.pho, T.black)), [ax, az] = benchAt(0.52, 0.04);
            shot(E3, [ax, lp(1.0, 1.1, k), az], lp(27, 15, k), lp(19, 9.5, k));
            auraAt(0.4 * smo(sgk(t, T.q3w2 + 4.5, T.q3w3 + 3)), t);
          }
        }
      },
      /* (the dancers are the ground's again: where the formation has them, at rest; play's own frame shows them) */
      end() { danceG.visible = false; dancersForm(); for (const P of [cast.goA, cast.goB]) P.group.visible = false; filmBurstsEnd(); auraAt(0, 0); }
    };

    /* ---------------------------------------------------------------- THE OPENING FILM (§4.0; its clock: OPENT)
       His counter at night: the forum's thread, and his answer typed; his notebook; what he takes; then the turf. */
    const OPEN_IN = [DATA.spawn.x, EYE, 12.98];                                  // where his eyes open: on the earth at the turf's edge, his sandals just off
    FILMS.open = {
      begin(api) { if (api.handsRoot) api.handsRoot.visible = false; FL.shot = ''; },
      stage(n) {
        FL.shot = n;
        if (n === 'desk') { lit('COUNTER', ''); deskG.visible = true; desk.bag.visible = true; desk.shirt.visible = false; if (desk.book) desk.book.visible = true; }
        else if (n === 'pack1') { desk.shirt.visible = true; deskLap(0); }
        else if (n === 'pack2') { desk.shirt.visible = false; if (desk.book) desk.book.visible = false; }
        else if (n === 'turf') { deskG.visible = false; lit('DAY1', 'one'); mistK = 1; setFormation('arrive'); dayCast(true); tonHome(); castSolid(); }
      },
      frame(t, api) {
        const T = OPENT, X = DESK.x, Z = DESK.z, top = DESK.top;
        const n = t >= T.o4 - 0.5 ? 'turf' : t >= T.o3 + 2.4 ? 'pack2' : t >= T.o3 ? 'pack1' : 'desk';
        if (n !== FL.shot) { if (n !== 'desk' && !FL.shot) FILMS.open.stage('desk'); FILMS.open.stage(n); }
        /* where he sits to pack: before the shirt and the bag */
        const eyeP = [X + 0.74, 1.42, Z - 0.74], bx = X + DESK.bag[0], bz = Z + DESK.bag[1], sx = X + DESK.shirt[0], sz = Z + DESK.shirt[1];
        if (n === 'desk') {
          /* THE SCREEN: the thread; his answer typed a letter at a time as he says the first line; sent */
          const typ = String(W.forumReply || ''), t0 = T.q3o1 + 1.0, tSend = T.q3o1 + SECS['q3o1'] + 0.9;
          const nCh = Math.max(0, Math.min(typ.length, Math.floor((t - t0) / 0.13))), kOff = smo(sgk(t, T.o2 + 0.5, T.o2 + 1.3));
          deskLap(kOff < 0.999, nCh, Math.floor(t * 2.2) % 2 === 0, t >= tSend);
          if (kOff > 0 && kOff < 0.999) desk.lapM.color.setScalar(1 - kOff);                // (his laptop shut: the screen goes down to dark as his eyes leave it)
          /* THE PAGE: each question underlined as he asks it; the leaf turned on the last sentence */
          const u = (a, d) => sgk(t, a + 0.35, a + 0.35 + d), tTurn = T.q3o5 + SECS['q3o5'] - 1.9;
          deskLeaf(u(T.q3o2, 1.3), u(T.q3o3, 2.2), u(T.q3o4, 3.4), smo(sgk(t, tTurn, tTurn + 1.5)));
          /* HIS EYES. On the screen, square to it (a phone's frame holds the thread's column whole); a slow push onto
             the answers and the box he types in; then he LEANS to his notebook (the eye itself goes over it, so its page
             is read square and not from the side: photographed) and down the page with his questions */
          const Q = (L, f) => L.map(([a, b]) => f(a, b)), mid = (P4) => [(P4[0][0] + P4[2][0]) / 2, (P4[0][1] + P4[2][1]) / 2, (P4[0][2] + P4[2][2]) / 2];
          const col = Q([[FX0, 118], [FX1, 118], [FX1, 708], [FX0, 708]], deskScreen), low = Q([[FX0, 470], [FX1, 470], [FX1, 708], [FX0, 708]], deskScreen);
          const leaf = Q([[540, 60], [1000, 60], [1000, 470], [540, 470]], deskPage);
          if (!col[0] || !leaf[0]) { shot([X, 1.36, Z - 0.66], [X, top + 0.1, Z], 50, 40); return; }
          const kb = smo(sgk(t, T.o2, T.o2 + 1.8)), kp = smo(sgk(t, T.q3o1 + 0.3, tSend - 0.4)), kq = smo(sgk(t, T.q3o2, T.q3o5 + 6));
          const cS = mid(col), cL = mid(leaf), eye = lp3([cS[0], 1.36, Z - 0.68], [cL[0], 1.46, cL[2] - 0.4], kb), nar = isNarrow();
          const F1 = fit(eye, cS, nar ? 46 : 34, col), F2 = fit(eye, mid(low), nar ? 30 : 22, low), F3 = fit(eye, cL, nar ? lp(40, 36, kq) : lp(30, 27, kq), leaf);
          fLens(lp(lp(F1.fl, F2.fl, kp), F3.fl, kb)); camAt(eye, lp3(lp3(F1.at, F2.at, kp), F3.at, kb));
        } else if (n === 'pack1') {
          /* WHAT HE TAKES: a folded white shirt, before his open bag */
          const k = smo(sgk(t, T.o3, T.o3 + 2.4));
          fitShot(eyeP, [lp(sx, bx, 0.5), top + lp(0.07, 0.09, k), lp(sz, bz, 0.45)], lp(52, 48, k), lp(38, 35, k), [[sx - 0.19, top, sz - 0.25], [sx + 0.19, top, sz - 0.25], [bx - 0.2, top + 0.3, bz + 0.14], [bx + 0.2, top + 0.3, bz + 0.14]]);     // (named a hand's width past the shirt's hem and the bag's top: the fit's own margin reaches under the film's bars)
        } else if (n === 'pack2') {
          /* PACKED: the bag alone on the glass */
          const k = smo(sgk(t, T.o3 + 2.4, T.o4 - 0.5));
          fitShot(eyeP, [bx, top + lp(0.12, 0.14, k), bz], lp(40, 36, k), lp(30, 27, k), [[bx - 0.2, top, bz - 0.14], [bx + 0.2, top, bz - 0.14], [bx - 0.2, top + 0.26, bz + 0.14], [bx + 0.2, top + 0.26, bz + 0.14]]);
        } else {
          /* THE TURF: his eyes open on the earth, his own sandals, the rows of others' and the grass with its petals; he
             steps out of his own and onto it; and up, to all of it. It ends on the very spot, heading and lens play
             begins in */
          const k = smo(sgk(t, T.o4 + 1.3, T.q3o6 + 3.4)), kUp = smo(sgk(t, T.o4 + 2.3, T.q3o6 + 4.6));
          const ez = lp(OPEN_IN[2], DATA.spawn.z, k), step = Math.sin(Math.PI * c01(k * 2.2)) * (k < 0.46 ? 1 : 0);
          const e2 = [DATA.spawn.x, EYE - 0.035 * step + 0.012 * Math.sin((OPEN_IN[2] - ez) * 2 * Math.PI / 0.7) * (1 - kUp), ez];
          eyes(e2, 0, lp(-1.02, 0, kUp), PLAY_FOV, PLAY_FOV);
        }
      },
      end() { if (FL.shot !== 'turf') FILMS.open.stage('turf'); deskG.visible = false; FL.shot = ''; }
    };

    /* ---------------------------------------------------------------- THE NIGHT BETWEEN (§4.2; its clock: BETW)
       Five pictures, each staged in the black before it. */
    /* a film's light: a look by name, and which day's dressing stands under it said apart (the afternoon of DAY ONE is
       a film's own: play's AFTERNOON is day two's). Called in the black (v16.1). */
    function lit(name, day) {
      if (kit) kit.daylight(PRESETS[name] || null, 0);
      lookName = name; FL.lit = name;
      dayOne.visible = /one/.test(day); dayTwo.visible = /two/.test(day); nightG.visible = /night/.test(day); duskG.visible = name === 'DUSK';
      crowdSolid(dayOne.visible);
      paintShade(name);
      phoLook.level.value = PHO_LEVEL[name] != null ? PHO_LEVEL[name] : 1;
      mistK = 0;
    }
    /* HIS BAI SRI IN HIS HANDS, IN A FILM: exactly as play carries it (the hands' own pass, his hands under the frame's
       foot, play's own place for it: baiPlace), so it is the size on the screen it has been all day whatever the
       film's lens is. (Stood in the world before the lens instead, a narrow lens showed four incense sticks.) */
    function filmBai(on, p = 0) {
      const A = FL.api; if (!A || !A.armR) return;
      const rh = A.rightHand && A.rightHand();
      if (!on) { if (FL.bai) { FL.bai = false; handBaiHolder.add(handBai); if (rh) rh.visible = true; if (A.handsRoot) A.handsRoot.visible = false; } return; }
      if (!FL.bai) { FL.bai = true; A.armR.add(handBai); }
      if (A.handsRoot) A.handsRoot.visible = true;
      A.armR.visible = true; if (rh) rh.visible = false;
      const keep = play.baiP, pull = play.pull; play.baiP = p; play.pull = null; baiPlace(); play.baiP = keep; play.pull = pull;
    }
    /* where he is for each: at the side of the photograph; before the tables, looking up; before the tables at night,
       a little lower (he has sat down on the turf); in the room, a pace back from its window */
    const BW = { eye1: [-5.0, EYE, -1.7], eye2: [-2.4, EYE, -6.3], eye3: [0.95, 1.5, -7.6], eye4: [ROOM.x + 0.03, 1.2, ROOM.wall + 1.8] };
    FILMS.between = {
      begin(api) { if (api.handsRoot) api.handsRoot.visible = false; FL.shot = ''; FL.bai = false; },
      stage(n) {
        FL.shot = n; filmBai(n === 'n1');
        const row = [cast.hermitB, cast.red, cast.pho, cast.white, cast.hermitA];
        FL.sky = n === 'n4' ? { x: ROOM.x, z: ROOM.z } : null;
        if (n === 'n1') {
          /* THE PHOTOGRAPH (photograph 8), late in the afternoon of day one: twelve kneel in a row before the tables,
             hands joined, and the masters stand behind them, Grandmaster Pho in their middle */
          lit('AFTERNOON', 'one'); setFormation('photo'); dayCast(true);
          row.forEach((P, i) => put(P, -2.5 + i * 1.25, PHOTO.z - 1.1, (2 - i) * 0.06));
          put(cast.ton, PHOTO.x0 + 12 * PHOTO.dx + 0.06, PHOTO.z + 0.04, -0.1); put(cast.aunt, 5.3, -3.9, faceTo(5.3, -3.9, 0, PHOTO.z - 0.5));
          for (const P of [cast.ym, cast.goA, cast.goB]) if (P.ready) P.group.visible = false;
          ymBai.visible = false; myBai.visible = false; castSolid();
          return;
        }
        /* (everyone the photograph stood up or moved is back where the days keep him, and at rest) */
        for (const P of row) { if (P.home) put(P, P.home.x, P.home.z, P.home.ry); if (P.ready) rest(P, 0); }
        for (const P of [cast.ton, cast.aunt]) { put(P, P.home.x, P.home.z, P.home.ry); if (P.ready) rest(P, 0); }
        myBai.visible = false;
        if (n === 'n2') { lit('DUSK', 'two'); setFormation('bless'); dayCast(false); }
        else if (n === 'n3') { lit('NIGHT', 'two night'); dayCast(false); }
        else if (n === 'n4') { lit('ROOM0', ''); if (room.sync) room.sync(); }
        else if (n === 'n5') dawnStage();
        castSolid();
      },
      frame(t, api) {
        const T = BETW, n = t >= T.n5 ? 'n5' : t >= T.n4 ? 'n4' : t >= T.n3 ? 'n3' : t >= T.n2 ? 'n2' : t >= T.n1 ? 'n1' : '';
        if (!n) return;                                                         // (play's own picture, going to black)
        if (n !== FL.shot) FILMS.between.stage(n);
        if (n === 'n1') {
          const u = t - T.n1, k = smo(sgk(t, T.n1, T.n2));
          /* every kneeler's hands are joined; the five behind them stand at ease */
          DEVOTEES.forEach((key, i) => { const D = crowdDrivers[key]; pose(D.A, 'prostrate', 0.5 + 0.12 * Math.sin(u * 0.7 + i), false); pose(D.B, 'prostrate', 0.45 + 0.12 * Math.sin(u * 0.6 + i * 1.7), false); });
          [cast.hermitB, cast.red, cast.white, cast.hermitA].forEach((P, i) => pose(P, 'Idle_3', 1.5 + i * 2.1 + u, true));
          pose(cast.pho, 'Sit_to_Stand_Transition_M', 4.3 + 0.2 * Math.sin(u * 0.6), false);
          pose(cast.ton, 'seiza', 1.3 + 0.3 * Math.sin(u * 0.7), false); pose(cast.aunt, 'Idle_3', 2 + u, true);
          fitShot(BW.eye1, [lp(-0.2, 0.1, k), 1.12, PHOTO.z - 0.5], lp(58, 54, k), lp(40, 37, k),
            [[PHOTO.x0 - 0.45, 1.0, PHOTO.z], [PHOTO.x0 - 0.45, 0.1, PHOTO.z], [PHOTO.x0 + 12 * PHOTO.dx + 0.4, 1.0, PHOTO.z], [-2.5, 1.85, PHOTO.z - 1.1], [2.5, 1.85, PHOTO.z - 1.1]]);
          /* his own bai sri, still in his hands */
          filmBai(true, 0);
        } else if (n === 'n2') {
          /* THE BANNERS AGAINST A RED EVENING: he looks up, past the long banners to the pole in its tiers of satin
             and its strings of flags (looking west instead, the sky was behind a tree: photographed) */
          const k = smo(sgk(t, T.n2, T.n3)); shot(BW.eye2, [lp(0.2, 0.5, k), lp(4.6, 5.9, k), -13.9], 62, 50);
        } else if (n === 'n3') {
          /* THE OFFERING TABLES BY THEIR OWN CANDLES */
          const k = smo(sgk(t, T.n3, T.n4)); shot(BW.eye3, [lp(0.15, 0, k), lp(1.22, 1.36, k), -11.5], lp(48, 42, k), lp(36, 31, k));
        } else if (n === 'n4') {
          /* HIS BAI SRI ON THE SILL, BESIDE HIS BAG: the window pales behind it */
          const k = smo(sgk(t, T.n4 + 0.4, T.n5 - 0.3)), d = dayBlend(ROOM0, ROOM1, k);
          d.stars = lp(ROOM0.stars, ROOM1.stars, k); if (kit) kit.daylight(d, 0);
          if (room.ringMat) room.ringMat.color.setRGB(lp(0.01, 0.06, k), lp(0.014, 0.075, k), lp(0.012, 0.065, k));
          if (room.ground) room.ground.color.setRGB(lp(0.004, 0.022, k), lp(0.006, 0.03, k), lp(0.005, 0.022, k));
          for (const m of room.tree) m.color.setScalar(lp(0.04, 0.3, k));
          { const X = ROOM.x, Zw = ROOM.wall, sl = ROOM.sill, hw = ROOM.w / 2 + 0.06;
            fitShot(BW.eye4, [X, sl + lp(0.5, 0.46, k), Zw], lp(60, 54, k), lp(46, 41, k), [[X - hw, sl - 0.1, Zw], [X + hw, sl - 0.1, Zw], [X - hw, sl + 1.1, Zw], [X + hw, sl + 1.1, Zw]]); }
        } else {
          /* FIRST LIGHT ON THE TURF: his eyes come up from yesterday's petals to the bench across the turf, where one
             man sits; and Ton, beside him. It ends on the very picture play begins the morning in */
          const k = smo(sgk(t, T.n5 + 0.3, T.tn3n1 + 0.2)), ya = phoYawFrom(DAWN_AT), pi = lp(-0.6, -0.04, k), eye = [DAWN_AT.x, EYE, DAWN_AT.z];
          shot(eye, [eye[0] - Math.sin(ya) * Math.cos(pi) * 10, EYE + Math.sin(pi) * 10, eye[2] - Math.cos(ya) * Math.cos(pi) * 10], PLAY_FOV, PLAY_FOV);
          mistK = 1;
          /* Ton says it, and is at rest again before play has him */
          const tt = t - T.tn3n1, kt = smo(sgk(tt, -0.15, 0.25)) * (1 - smo(sgk(tt, SECS['tn3n1'] - 0.1, SECS['tn3n1'] + 0.55)));
          pose(cast.ton, 'Idle_3', 3 + (t - T.n5), true, 'Stand_and_Chat', kt, Math.max(0, tt));
          lookNow(cast.ton, 'lens', 1, 0.6);
        }
      },
      end() { if (FL.shot !== 'n5') FILMS.between.stage('n5'); filmBai(false); FL.shot = ''; FL.sky = null; myBai.visible = false; }
    };

    /* ---------------------------------------------------------------- THE TELLING AND THE ANSWERS (§4.3 P7, P8)
       He kneels before Grandmaster Pho and does not move: both films are ONE HELD LOOK from where he kneels, and every
       change in it is a move of his eyes (a push of the lens, a look away and back), never a cut on the man he is
       looking at (a lens that changes in one frame while the eye and its subject stay is a jolt: v25.5). The one place
       the lens changes unseen is behind his own eyelids, once, before the teaching. */
    const EK = [KNEEL2.x, KNEEL.y, KNEEL2.z], BOWL = benchAt(0.1, 0.72);        // (his eye, kneeling; the golden bowl of petals on the carpet by Grandmaster Pho's foot: b_world2.js)
    /* his eyes from a place: a heading and a tilt (up is positive), at a lens */
    function eyes(eye, ya, pi, fPhone, fDesk, roll = 0) { const c = Math.cos(pi); shot(eye, [eye[0] - Math.sin(ya) * c * 10, eye[1] + Math.sin(pi) * 10, eye[2] - Math.cos(ya) * c * 10], fPhone, fDesk, roll); }
    const aimOf = (eye, p) => [yawTo(eye[0], eye[2], p[0], p[2]), Math.atan2(p[1] - eye[1], Math.hypot(p[0] - eye[0], p[2] - eye[2]))];
    /* THE TILT THAT HOLDS A FACE WELL at a lens: a face at the middle of the picture leaves its top half to whatever is
       over the man's head (the canopy's dark cloth: photographed, nearly half the frame). So the look rests below the
       face by a fifth of what the lens sees there (the film's band is 0.776 of the screen's height on a phone and a
       desktop alike), and never by so much that his crown leaves the picture. A smooth function of the lens */
    function faceTilt(eye, F, fPhone, fDesk) {
      const d = Math.hypot(F[0] - eye[0], F[2] - eye[2]), vis = 2 * d * Math.tan(THREE.MathUtils.degToRad(isNarrow() ? fPhone : fDesk) / 2) * 0.776;
      const off = Math.max(0, Math.min(0.2 * vis, 0.5 * vis - 0.2));
      return Math.atan2(F[1] - off - eye[1], d);
    }
    /* 0 before a; up to 1 over `up` seconds; held; down to 0 over the `down` seconds before b */
    const bump = (t, a, b, up = 0.8, down = up) => smo(sgk(t, a, a + up)) * (1 - smo(sgk(t, b - down, b)));
    /* WHERE A FACE IS, measured once on the body at its rest and then held: a film's look rests on that place and never
       rides the living head (v25.5: a look locked to a talking head sways the whole picture behind it) */
    function faceAt(id, P, restTake, restT) {
      if (!FL.faces[id] && P && P.ready) { pose(P, restTake, restT, false); const h = headOf(P, null); if (h) FL.faces[id] = [h[0], h[1] + 0.06, h[2]]; }
      return FL.faces[id] || [P.group.position.x, 1.3, P.group.position.z];
    }
    /* A SEATED MASTER SPEAKS, in a film: his talking take under each of his lines (eased in at the line's start and out
       at its end; each line begins the take somewhere else, so no two begin with one gesture), his rest between */
    function speaks(P, t, T, lines) {
      let k = 0, tt = 0;
      lines.forEach((ln, i) => { if (T[ln] == null) return; const a = T[ln], d = SECS[ln] || 2.5, kk = smo(sgk(t, a - 0.12, a + 0.4)) * (1 - smo(sgk(t, a + d - 0.3, a + d + 0.5)));
        if (kk > k) { k = kk; tt = i * 2.9 + (t - a); } });
      const A = P.ready && P.acts[P.talkTake], d = A ? A.getClip().duration : 1;
      pose(P, P.rest.take, 0.16 + 0.13 * Math.sin(t * 0.7), false, P.talkTake, k, ((tt % d) + d) % d);
      return k;
    }
    /* HIS HANDS IN A FILM: the clasp risen from under the frame to play's own height (kUp), and out of it into the slow
       gesture his hands make by themselves, by g (the engine's own: handsPose, the twenty-fourth seam). The arm's own
       pose is kept and given back when they go down (chapter 2's waiAt) */
    function handsFilm(kUp, g = 0, tFlow = 0) {
      const A = FL.api; if (!A || !A.handsPose || !A.armR) return;
      if (kUp <= 0.001) {
        if (FL.wai) { FL.wai = false; A.armR.position.copy(FL.waiPos); A.armR.quaternion.copy(FL.waiQ); const L = A.prayerArm && A.prayerArm(); if (L) L.visible = false; if (A.handsRoot) A.handsRoot.visible = false; }
        return;
      }
      if (!FL.wai) { FL.wai = true; FL.waiPos = A.armR.position.clone(); FL.waiQ = A.armR.quaternion.clone(); }
      if (A.handsRoot) A.handsRoot.visible = true;
      A.handsPose(c01(g), tFlow, { y: lp(-0.72, -0.3, smo(c01(kUp))) });
    }
    /* HIS HAND AT REST, LIFTED INTO HIS SIGHT by k: the walking hand exactly as play draws it (its own turn, its own
       fingers), raised by half the frame's half-height at its own depth, so it stands over the foot of the picture
       where a caption is. The arm's own place is kept and given back */
    function handStill(k) {
      const A = FL.api; if (!A || !A.armR || !A.vmCam) return;
      if (k <= 0.001) { if (FL.rest0) { A.armR.position.copy(FL.rest0); FL.rest0 = null; if (A.handsRoot) A.handsRoot.visible = false; } return; }
      if (!FL.rest0) FL.rest0 = A.armR.position.clone();
      const halfH = Math.tan(THREE.MathUtils.degToRad(A.vmCam.fov / 2)) * Math.abs(FL.rest0.z);
      if (A.handsRoot) A.handsRoot.visible = true; A.armR.visible = true;
      A.armR.position.set(FL.rest0.x, FL.rest0.y + halfH * 0.5 * smo(c01(k)), FL.rest0.z);
    }
    const filmChill = (k, tint) => { if (kit && kit.chill) kit.chill(k, { secs: 0, cine: k > 0, tint: tint || null }); };
    FILMS.tell = {
      begin(api) { if (api.handsRoot) api.handsRoot.visible = false; FL.wai = false; },
      frame(t, api) {
        const T = TELL, Ph = cast.pho, F = faceAt('pho', Ph, 'Sit_to_Stand_Transition_M', 0.16), [yF, pF] = aimOf(EK, F);
        /* he listens: quite still, his eyes on the one who speaks */
        pose(Ph, 'Sit_to_Stand_Transition_M', 0.16 + 0.13 * Math.sin(t * 0.7), false);
        lookNow(Ph, 'lens', 1, 0.5, 0);
        pose(cast.aunt, 'Idle_3', 2 + t, true);
        /* the two looks away: down at his own hands as he says what they do (they begin to do it, and he closes them
           again); and as he says what he should not have done he cannot hold the old man's eyes: his own drop to the
           golden bowl of petals on the carpet by his teacher's foot. (The plan had him look up at the cloth overhead:
           photographed twice, it is the dark underside of a roof and an eave seen from below) */
        const kH = bump(t, T.q3t2 + 0.5, T.q3t2 + 5.6, 0.9, 1.0), kC = bump(t, T.q3t5 + 0.5, T.q3t5 + 5.6, 1.1, 1.2);
        const [yC, pC] = aimOf(EK, [BOWL[0], 0.24, BOWL[1]]);
        /* and the slow push on the old man's face through the whole telling */
        const kp = smo(sgk(t, 0, T.q3t8)), fP = lp(46, 25, kp), fD = lp(34, 18.5, kp), pT = faceTilt(EK, F, fP, fD);
        /* "something danced in my body": for that sentence his body remembers it, and the picture sways a little */
        const kS = bump(t, T.q3t3 + 1.6, T.q3t3 + 6.4, 1.4, 1.6), sway = kS * 0.03 * Math.sin((t - T.q3t3) * 1.7);
        eyes(EK, yF + (yC - yF) * kC + sway * 0.5, pT + (-0.6 - pT) * kH + (pC - pT) * kC, lp(lp(fP, 60, kH), 38, kC), lp(lp(fD, 46, kH), 28, kC), sway);
        handsFilm(kH, 0.36 * bump(t, T.q3t2 + 1.5, T.q3t2 + 5.0, 1.3, 1.3), t - T.q3t2);
        /* what two of the sentences remember, laid over his sight for as long as they are said: the cold of the piece
           in the shop; the fog */
        const kCold = 0.32 * bump(t, T.q3t4 + 2.0, T.q3t4 + SECS['q3t4'] + 0.6, 0.9, 1.1), kFog = 0.38 * bump(t, T.q3t6 + 1.0, T.q3t6 + SECS['q3t6'] + 0.4, 1.0, 1.1);
        filmChill(Math.max(kCold, kFog), kFog > kCold ? 'grey' : null);
      },
      end() { handsFilm(0); filmChill(0); }
    };
    FILMS.answers = {
      begin(api) { if (api.handsRoot) api.handsRoot.visible = false; FL.wai = false; },
      frame(t, api) {
        const T = ANSW, Ph = cast.pho, Au = cast.aunt;
        const G = faceAt('aunt', Au, 'Idle_3', 2), [yG, pG] = aimOf(EK, G); phoFace(); phoTalkFace();                  // (both his places measured before he is posed)
        const kTalk = speaks(Ph, t, T, ['ph3n1', 'ph3n2', 'ph3n3', 'ph3n4', 'ph3n5', 'ph3n6', 'ph3n7', 'ph3g2', 'ph3g3', 'ph3g4', 'ph3g5']);
        const F = phoF(kTalk), [yF, pF] = aimOf(EK, F);
        /* "It is lit for whoever is in the room": his eyes go to the woman who helps him, and so do the old man's; she
           looks back at him */
        const kA = bump(t, T.ph3n6 + 3.1, T.ph3n6 + SECS['ph3n6'] + 0.9, 1.3, 1.2);
        lookNow(Ph, 'lens', 1 - kA, 0.5, 0); if (kA > 0) lookNow(Ph, G, kA, 0.55, 0);
        pose(Au, 'Idle_3', 2 + t, true); lookNow(Au, 'lens', kA, 0.7);
        /* "The ink, the chanting, the pieces you held": his eyes go down to what he has carried since yesterday, his
           bai sri, standing on the carpet beside his knee (his own hands, risen into the picture in a clasp, were a
           bundle of fingertips at its foot: photographed, and refused) */
        const kH = bump(t, T.ph3n4 + 1.6, T.ph3n4 + 7.6, 1.0, 1.1), [yB, pB] = aimOf(EK, [BESIDE.x, 0.27, BESIDE.z]);
        /* THE LENS, one smooth line through the whole film (its knots: [second, phone, desktop]); a second line after
           his eyes have closed and opened */
        const first = t < T.blink + 0.33;
        const L = first ? [[0, 54, 40], [T.q3a1 + SECS['q3a1'], 41, 30], [T.ph3n1 + SECS['ph3n1'], 30, 22], [T.ph3n2 + 4.6, 17.5, 12.5], [T.ph3n3 + 1.5, 19, 13.5], [T.ph3n3 + SECS['ph3n3'], 31, 23],
                           [T.ph3n4 + 1.4, 31, 23], [T.ph3n5, 28, 20.5], [T.ph3n5 + SECS['ph3n5'], 23.5, 17], [T.ph3n6 + 2.6, 26, 19], [T.ph3n7, 27, 19.5], [T.blink, 22, 16]]
                        : [[T.blink, 17, 11.5], [T.ph3g2 + 2.2, 18, 12], [T.ph3g3 + SECS['ph3g3'], 33, 24], [T.ph3g4 + SECS['ph3g4'], 44, 33], [T.ph3g5 + 1.2, 46, 36], [T.end - 0.4, PLAY_FOV, PLAY_FOV]];
        let fP = L[0][1], fD = L[0][2];
        for (let i = 0; i < L.length - 1; i++) if (t >= L[i][0]) { const k = smo(sgk(t, L[i][0], L[i + 1][0])); fP = lp(L[i][1], L[i + 1][1], k); fD = lp(L[i][2], L[i + 1][2], k); }
        /* it ends on play's own picture: play's heading, tilt and lens from where he kneels */
        const kEnd = smo(sgk(t, T.ph3g5 + 1.2, T.end - 0.4)), yaP = phoYawFrom(KNEEL2), piP = 0.16;
        const kw = Math.max(kH, kA);
        const pT = faceTilt(EK, F, fP, fD), pA = faceTilt(EK, G, 36, 27);
        eyes(EK, lp(yF + (yB - yF) * kH + (yG - yF) * kA, yaP, kEnd), lp(pT + (pB - pT) * kH + (pA - pT) * kA, piP, kEnd), lp(fP, kA > kH ? 36 : 56, kw), lp(fD, kA > kH ? 27 : 42, kw));
        /* "everything walks through": for those words, a greyness at the edge of his sight */
        filmChill(0.22 * bump(t, T.ph3g3 + 8.6, T.ph3g3 + SECS['ph3g3'] + 0.7, 1.2, 1.2), 'grey');
        /* "you open when you choose. You close when you choose": the gold rises on him, and settles */
        auraAt(0.36 * bump(t, T.ph3g4 + 0.5, T.ph3g4 + SECS['ph3g4'] + 0.5, 1.6, 2.2), t);
      },
      end() { filmChill(0); auraAt(0, 0); }
    };

    /* ---------------------------------------------------------------- THE FOUR ENDINGS, AND THE CLOSE (§4.5, §4.6)
       Each ending is his eyes from where he kneels before his teacher, with one stretch of its own somewhere else on
       the ground (the mats; the edge of the turf until dusk; the people who wait; the middle of an emptied ground), and
       each comes back to that carpet for the close all four share. Pictures only: the cues are below the build. */
    const lensAt = (t, L) => { let fP = L[0][1], fD = L[0][2]; for (let i = 0; i < L.length - 1; i++) if (t >= L[i][0]) { const k = smo(sgk(t, L[i][0], L[i + 1][0])); fP = lp(L[i][1], L[i + 1][1], k); fD = lp(L[i][2], L[i + 1][2], k); } return [fP, fD]; };
    const yawMix = (a, b, k) => a + angTo(a, b) * k;                          // from heading a to heading b the short way, by k (angTo: the signed short turn)
    const phoFace = () => faceAt('pho', cast.pho, 'Sit_to_Stand_Transition_M', 0.16);
    /* WHERE HIS FACE IS WHILE HE TALKS: his talking take leans him forward and sets his head a hand lower than his rest
       does (from 1.3 m, in a narrow lens, his face fell out of the foot of the picture: photographed on "Tomorrow we
       begin."). A look still never rides a living head (v25.5), so the take's own MEAN place is measured once, and the
       look glides between the two places by how much he is talking (`speaks` answers it: a smooth function of the
       film's clock) */
    function phoTalkFace() {
      const P = cast.pho;
      if (!FL.faces.phoTalk && P.ready && P.acts[P.talkTake]) { const d = P.acts[P.talkTake].getClip().duration, s = [0, 0, 0]; let n = 0;
        for (let i = 0; i < 12; i++) { pose(P, P.talkTake, (i + 0.5) / 12 * d, false); const h = headOf(P, null); if (h) { s[0] += h[0]; s[1] += h[1] + 0.06; s[2] += h[2]; n++; } }
        if (n) FL.faces.phoTalk = [s[0] / n, s[1] / n, s[2] / n]; }
      return FL.faces.phoTalk || phoFace();
    }
    const phoF = (k = 0) => (k > 0.001 ? lp3(phoFace(), phoTalkFace(), c01(k)) : phoFace());
    /* his eyes on Grandmaster Pho from an eye: the heading, and the tilt that holds the face well at this lens (k: how
       much he is talking) */
    function toPho(eye, fP, fD, k = 0) { const F = phoF(k); return [aimOf(eye, F)[0], faceTilt(eye, F, fP, fD)]; }
    /* HE BOWS (his eyes): forward and down over his knees with his hands joined, and up again; u from 0 to 1 */
    function bowEyes(eye, ya, p0, u, fP, fD) {
      const k = Math.sin(Math.PI * smo(c01(u))), fx = -Math.sin(ya), fz = -Math.cos(ya);
      eyes([eye[0] + fx * 0.24 * k, eye[1] - 0.3 * k, eye[2] + fz * 0.24 * k], ya, lp(p0, -1.2, k), fP, fD);
      handsFilm(c01(Math.min(u / 0.14, (1 - u) / 0.16)), 0);
    }
    /* A THING CARRIED IN A FILM, in the hands' own pass, his hands under the frame's foot (filmBai's way, for anything):
       `at` is its place in that pass's frame, `rot` its turn there */
    const _fhq = new THREE.Quaternion(), _fhe = new THREE.Euler(), _fhv = new THREE.Vector3();
    function filmCarry(obj, holder, on, at, rot) {
      const A = FL.api; if (!A || !A.armR) return;
      const rh = A.rightHand && A.rightHand();
      if (!on) { if (obj.parent === A.armR) { holder.add(obj); if (rh) rh.visible = true; if (A.handsRoot) A.handsRoot.visible = false; } return; }
      if (obj.parent !== A.armR) A.armR.add(obj);
      if (A.handsRoot) A.handsRoot.visible = true;
      A.armR.visible = true; if (rh) rh.visible = false;
      _fhq.copy(A.armR.quaternion).invert();
      obj.position.copy(_fhv.set(at[0], at[1], at[2]).sub(A.armR.position).applyQuaternion(_fhq));
      obj.quaternion.copy(_fhq).multiply(_bqe.setFromEuler(_fhe.set(rot[0], rot[1], rot[2], 'YXZ')));
    }
    const _bqe = new THREE.Quaternion();
    /* where his hand lets a handful of petals go: his own take's hand at its throw, measured once */
    function phoThrow() { const Ph = cast.pho; if (!FL.throwPho && Ph.ready) { const v = handsAt(Ph, 'Sit_Cheer_with_Left_Hand', 1.32, new THREE.Vector3(), 'R'); if (v) { Ph.group.localToWorld(v); FL.throwPho = [v.x, v.y + 0.08, v.z]; } } return FL.throwPho; }

    const EKN = (() => { const [x, z] = benchAt(0.46, 1.3); return [x, KNEEL.y, z]; })();              // his eye, knelt nearer: where two pairs of hands meet on one bowl
    /* (v26.2 debug: the low table is smaller and a little to the right, clear of his foot, of the young man's knee and of
       the lime pole (b_world2.js TB); the bai sri is set on its front left, where nothing else stands, and the woman
       stands at its right) */
    const TABLE_BAI = (() => { const [x, z] = benchAt(1.03, 0.8); return [x, 0.38, z]; })();           // where his bai sri is set down at the last: the low table at the old man's right hand
    const AUNT_TABLE = (() => { const [x, z] = benchAt(1.95, 1.1); return { x, z, ry: faceTo(x, z, TABLE_BAI[0], TABLE_BAI[2]) }; })();
    /* each ending's light at the close: the look it arrives in; what OPEN widens it to; the look it is left in */
    const END_LOOK = { A: ['DAWN', 'OPENED', 'DAWN'], B: ['DUSK', 'DUSKOPEN', 'DUSK'], C: ['DAWN', 'OPENED', 'DAWN'], D: ['SHUT', 'OPENED', 'DAWN'] };
    const shadeOf = (name) => (name === 'OPENED' || name === 'SHUT' ? 'DAWN' : name === 'DUSKOPEN' ? 'DUSK' : name);
    /* THOSE WHO WAIT CARRY WHAT THEY BROUGHT: a small bai sri on its tray, in both hands at the waist (a hand's width
       under the elbow's height, measured from that body's own shoulder), the hands solved onto the tray's foot. Called
       after the body's take is posed, every frame it is seen */
    const _wc = new THREE.Vector3();
    function waitCarry(i) {
      const P = cast.wait[i], b = waitBai[i], A = P.ready && P.group.visible ? armsOf(P) : null;
      if (!A || !A.L || !A.R) { b.visible = false; return; }
      const g = P.group, ry = g.rotation.y, fx = Math.sin(ry), fz = Math.cos(ry);
      g.updateWorldMatrix(true, true); A.L.up.getWorldPosition(_wc);
      const c = [g.position.x + fx * 0.29, _wc.y - 0.345, g.position.z + fz * 0.29];
      b.position.set(c[0], c[1], c[2]); b.rotation.y = ry + i * 1.3; b.visible = true;
      handsTo(P, trayGrip(c, WAIT_TRAY.r, [g.position.x, g.position.z]), 1);
    }
    /* the world as play left it at the decision: the morning of day two, Grandmaster Pho on his bench, his bai sri on the
       carpet beside him; and everything an ending may stand, put away */
    function endStage() {
      lit('DAWN', 'two'); mistK = 0.6; dayCast(false);
      for (const P of [cast.pho, cast.aunt]) { put(P, P.home.x, P.home.z, P.home.ry); if (P.ready) P.group.visible = true; }
      put(cast.ton, TON_DAWN.x, TON_DAWN.z, faceTo(TON_DAWN.x, TON_DAWN.z, KNEEL2.x, KNEEL2.z)); if (cast.ton.ready) cast.ton.group.visible = true;
      for (const P of cast.wait) { if (P.ready) P.group.visible = false; put(P, P.home.x, P.home.z, P.home.ry); }
      for (const b of waitBai) b.visible = false;
      for (const P of [cast.ym, cast.goA, cast.goB]) if (P.ready) P.group.visible = false;
      matsG.visible = false; rolled.own.visible = false; ymBai.visible = false;
      for (const g of rolled.ton.concat(rolled.rolls, [rolled.carry])) g.visible = false;
      baiPut(myBai, BESIDE.x, 0.012, BESIDE.z, 0.6); myBai.visible = true;
      auraAt(0, 0); FL.openK = 0; FL.openOut = 0; FL.litE = -1; FL.litA = -1; FL.goldMin = 0; FL.shot = '';
      if (kit && kit.hush) kit.hush(0, { secs: 0 });
      castSolid();
    }
    function endTidy() {
      handsFilm(0); handStill(0); filmChill(0); filmBai(false); filmCarry(handMat, handMatHolder, false);
      for (const P of cast.wait) if (P.ready) P.group.visible = false;
      for (const b of waitBai) b.visible = false;
      matsG.visible = false; auraAt(0, 0); filmBurstsEnd();
      if (kit && kit.hush) kit.hush(0, { secs: 0 });
      if (kit && kit.captions) kit.captions(null);
    }

    /* THE CLOSE'S LIGHT: the ending's own look; widened by e (the breath's level while it is played, eased shut after);
       and for the one ending that arrives closed, let up into the morning afterwards (a) */
    function closeLight(k, e, a, t) {
      const [base, opn, aft] = END_LOOK[k];
      if (Math.abs(e - FL.litE) > 0.004 || Math.abs(a - FL.litA) > 0.004) { FL.litE = e; FL.litA = a;
        let d = e > 0.004 ? dayBlend(PRESETS[base], PRESETS[opn], e) : PRESETS[base];
        if (a > 0.004) d = dayBlend(d, PRESETS[aft], a);
        if (kit) kit.daylight(d, 0);
        phoLook.level.value = lp(lp(PHO_LEVEL[base], PHO_LEVEL.OPENED, e), PHO_LEVEL[aft], a); mistK = base === 'DUSK' ? 0 : 0.6 - 0.4 * e; }
      auraAt(Math.max(e * 0.95, FL.goldMin || 0), t);
    }
    function closeStage(k) {
      const [base] = END_LOOK[k];
      endTidy();
      lit(base, 'two'); paintShade(shadeOf(base)); mistK = base === 'DUSK' ? 0 : 0.6; dayCast(false);
      for (const P of [cast.pho, cast.aunt]) { put(P, P.home.x, P.home.z, P.home.ry); if (P.ready) P.group.visible = true; }
      put(cast.ton, TON_DAWN.x, TON_DAWN.z, faceTo(TON_DAWN.x, TON_DAWN.z, KNEEL2.x, KNEEL2.z));
      baiPut(myBai, BESIDE.x, 0.012, BESIDE.z, 0.6); myBai.visible = true;
      FL.litE = -1; FL.litA = -1; FL.goldMin = 0; FL.tabled = false;
      castSolid();
    }
    function closeFrame(tc, k, api) {
      const T = CLOSE, Ph = cast.pho, Au = cast.aunt;
      if (FL.shot !== 'close') { FL.shot = 'close'; closeStage(k); }
      /* THE EYE: from where he knelt, forward on his knees to where four hands can meet on one bowl */
      const kf = smo(sgk(tc, T.take + 1.3, T.take + 3.3)), eye = lp3(EK, EKN, kf);
      eye[1] += 0.016 * Math.abs(Math.sin(kf * Math.PI * 3));
      const F = phoFace(), yF = aimOf(eye, F)[0], fx = -Math.sin(yF), fz = -Math.cos(yF);
      /* THE LENS */
      /* (what this stretch must hold is TALL, not wide: his face over his two hands on the bowl, from 1.3 m. So a desktop is
         given nearly a phone's lens: at 50 it cut his brow at the top and his hands at the foot: photographed. And at 33
         and 30 his face from 1.3 m was brow to lip) */
      const [fP, fD] = lensAt(tc, [[0, 58, 46], [T.take + 3.3, 66, 64], [T.breath, 66, 64], [T.q3z1 + SECS['q3z1'], 60, 58], [T.give + 3.2, 60, 58], [T.ph3z2, 44, 40],
                                   [T.ph3z2 + SECS['ph3z2'] + 0.9, 40, 36], [T.q3K1 + 3.5, 48, 44], [T.black, 66, 62]]);
      /* THE LIGHT */
      const e = tc >= T.breath ? (FL.openOut || 0) * (1 - smo(sgk(tc, T.breath, T.breath + 1.7))) : 0;
      FL.goldMin = 0.24 * smo(sgk(tc, T.ph3z2, T.q3K1 + 2.5));
      closeLight(k, smo(c01(e / 0.9)), END_LOOK[k][0] !== END_LOOK[k][2] ? smo(sgk(tc, T.breath + 0.3, T.breath + 2.6)) : 0, tc);
      /* HIS BAI SRI: on the carpet beside him; taken up and raised before him in both hands; shaking as it rises in
         him; given into his teacher's hands; and, behind a bow of his head, on the table */
      const H = [eye[0] + fx * 0.6, eye[1] - 0.42 + 0.004 * Math.sin(tc * 1.3), eye[2] + fz * 0.6];
      const kl = smo(sgk(tc, T.take + 0.5, T.take + 2.5)), kg = smo(sgk(tc, T.give + 0.9, T.give + 2.0));
      const G1 = [PHO_AT[0] + Math.sin(BENCH.ry) * 0.5, 0.72, PHO_AT[1] + Math.cos(BENCH.ry) * 0.5];
      const tabled = tc >= T.give + 2.3;
      let bc = tabled ? TABLE_BAI.slice() : lp3(lp3([BESIDE.x, 0.012, BESIDE.z], H, kl), G1, kg);
      if (!tabled) { bc[1] += 0.1 * Math.sin(Math.PI * kl) * (1 - kl);                                 // (lifted in an arc, not dragged)
        const ks = smo(sgk(tc, T.petals + 2.2, T.breath)) * (1 - smo(sgk(tc, T.breath, T.breath + 0.8)));
        bc[0] += ks * 0.0035 * Math.sin(tc * 61); bc[1] += ks * 0.003 * Math.sin(tc * 53 + 1); bc[2] += ks * 0.0035 * Math.sin(tc * 47 + 2); }
      baiPut(myBai, bc[0], bc[1], bc[2], 0.6);
      /* GRANDMASTER PHO: he speaks; both his hands on the bowl; a handful of petals; his hands on it again to take it */
      phoFace(); phoTalkFace();
      let kTalk = 0;
      const kOn = bump(tc, T.hands, T.petals + 0.45, 1.3, 0.5), kTake = bump(tc, T.give + 0.2, T.give + 2.25, 0.9, 0.2);
      const kc = bump(tc, T.petals + 0.3, T.petals + 3.2, 0.45, 0.7), kh = Math.max(kOn, kTake);
      if (kh > 0.001) pose(Ph, 'Sit_to_Stand_Transition_M', 0.16, false, PHO_ON.take, kh, PHO_ON.from + 0.6 + 0.2 * Math.sin(tc * 0.8));
      else if (kc > 0.001) pose(Ph, 'Sit_to_Stand_Transition_M', 0.16, false, 'Sit_Cheer_with_Left_Hand', kc, 0.15 + Math.max(0, tc - T.petals - 0.3) * 0.9);
      else kTalk = speaks(Ph, tc, T, ['ph3z0', 'ph3z1']);                       // ("Tomorrow we begin." is said quite still: his rest, and his eyes)
      if (kh > 0.001 && !tabled) handsTo(Ph, baiGrip(bc, BAI.s, [Ph.group.position.x, Ph.group.position.z], 'on'), kh);
      /* (his eyes: on the one who kneels; on the bowl while his hands are on it) */
      const kpb = bump(tc, T.hands + 0.2, T.hands + 2.4, 0.7, 0.8);
      lookNow(Ph, 'lens', 1 - kpb, 0.5, 0); if (kpb > 0) lookNow(Ph, [bc[0], bc[1] + 0.3, bc[2]], kpb, 0.5, 0);
      const pt = phoThrow();
      filmBurst('close', tc, T.petals + 1.6, pt, [eye[0] + fx * 0.42, eye[2] + fz * 0.42], { r: 0.42, up: 1.15, seed: 5521, s: 0.03 });
      /* the woman at his bench: she takes it from him and sets it on the table (seen as her hands leave it) */
      if (tabled && !FL.tabled) { FL.tabled = true; put(Au, AUNT_TABLE.x, AUNT_TABLE.z, AUNT_TABLE.ry); castSolid(); }
      if (tabled) pose(Au, 'give', lp(3.7, 5.7, smo(sgk(tc, T.give + 2.4, T.give + 4.4))), false, 'Idle_3', smo(sgk(tc, T.give + 4.2, T.give + 5.4)), 2 + tc);
      else pose(Au, 'Idle_3', 2 + tc, true);
      /* HIS EYES: on his bai sri beside him; up to his teacher as he raises it; bowed a little while the old man's
         hands lie on it; to the table when it is set there; on the old man's face for "Tomorrow we begin."; and the
         whole of it at the last */
      const [yB, pB] = aimOf(eye, [BESIDE.x, 0.3, BESIDE.z]), kB = 1 - smo(sgk(tc, T.take + 1.4, T.take + 3.1));
      const pWide = Math.atan2(0.05, 1.2), pFace = faceTilt(eye, phoF(kTalk), fP, fD), kFace = smo(sgk(tc, T.give + 3.4, T.ph3z2)) * (1 - smo(sgk(tc, T.q3K1 + 3.5, T.black - 1)));
      const kBow = bump(tc, T.hands + 0.9, T.hands + 2.8, 0.8, 0.9) * 0.05, [yTb, pTb] = aimOf(eye, [TABLE_BAI[0], TABLE_BAI[1] + 0.34, TABLE_BAI[2]]);
      const kTb = tc >= T.give + 2.3 ? 1 - smo(sgk(tc, T.give + 3.5, T.ph3z2 - 0.1)) : 0;
      const ya = yawMix(yawMix(yF, yB, kB), yTb, kTb), pi = lp(lp(lp(pWide, pFace, kFace) - kBow, pB, kB), pTb, kTb);
      eyes(eye, ya, pi, fP, fD);
    }

    FILMS.A = {
      begin(api) { if (api.handsRoot) api.handsRoot.visible = false; FL.wai = false; FL.bai = false; endStage(); },
      frame(t, api) {
        const T = ENDT.A, Ph = cast.pho, Tn = cast.ton;
        if (t >= T.close) { closeFrame(t - T.close, 'A', api); return; }
        const [o60, w60, w40, yng] = cast.wait;
        if (t < T.mats) {
          if (FL.shot !== 'a1') { FL.shot = 'a1';
            /* Ton, behind him, with an armful of rolled mats; by the west tents the ground is being cleared */
            const [tx, tz] = benchAt(-1.7, 5.1); put(Tn, tx, tz, faceTo(tx, tz, KNEEL2.x, KNEEL2.z)); matsG.visible = true; castSolid(); }      // (3.5 m off: at 1.9 m a kneeling eye saw two mats and no face)
          phoFace(); phoTalkFace(); const kTalk = speaks(Ph, t, T, ['ph3A1', 'ph3A2']); lookNow(Ph, 'lens', 1, 0.5, 0);
          pose(cast.aunt, 'Idle_3', 2 + t, true);
          pose(Tn, 'give', 2.6 + 0.12 * Math.sin(t * 0.8), false); lookNow(Tn, 'lens', 1, 0.7);
          /* (v26.2 debug: ONE mat on his arms. Two, lying on his forearms as they now do and not through them, stood 0.44 m
             tall at his chest and hid his face from the kneeling eye: photographed. The second is not drawn) */
          matOnArms(rolled.ton[0], Tn, 0); rolled.ton[1].visible = false;
          /* the yes; the long moment he is looked at; what he says yes to; the bow; and the turn to Ton behind him */
          const [fP, fD] = lensAt(t, [[0, 44, 33], [T.q3A0 + SECS['q3A0'], 40, 30], [T.ph3A1, 24, 17.5], [T.q3A1, 27, 20], [T.q3A1 + SECS['q3A1'], 23, 17], [T.ph3A2 + SECS['ph3A2'], 34, 25], [T.bow, 46, 34]]);
          const [yF, pT] = toPho(EK, fP, fD, kTalk);
          if (t < T.bow) eyes(EK, yF, pT, fP, fD);
          else if (t < T.ton) bowEyes(EK, yF, pT, (t - T.bow) / (T.ton - T.bow), 46, 34);
          else { handsFilm(0); const kT = smo(sgk(t, T.ton, T.ton + 1.5)), [yN, pN] = aimOf(EK, [Tn.group.position.x, 1.02, Tn.group.position.z]);
            eyes(EK, yawMix(yF, yN, kT), lp(pT, pN, kT), lp(46, 50, kT), lp(34, 36, kT)); }
        } else {
          if (FL.shot !== 'a2') { FL.shot = 'a2'; handsFilm(0);
            /* THE MATS: Ton has set his down and stands by the stack; two kneel and roll, one carries; he walks up with
               one in his arms */
            put(Tn, MATS_AT.x - 1.35, MATS_AT.z + 0.55, faceTo(MATS_AT.x - 1.35, MATS_AT.z + 0.55, A_W1[0], A_W1[1]));
            for (const g of rolled.ton) g.visible = false;
            put(w60, -7.55, -0.35, -1.9); put(w40, -8.15, 1.25, -1.35); put(yng, -5.5, 0.15, faceTo(-5.5, 0.15, MATS_AT.x, MATS_AT.z)); put(o60, -8.9, 3.3, 1.2);
            for (const P of cast.wait) if (P.ready) P.group.visible = true;
            castSolid(); }
          /* those who work: two on their knees with their hands on a mat, rolling it; one walking it to the stack; the
             old man watching, his hands behind him */
          [w60, w40].forEach((P, i) => { pose(P, 'prostrate', 2.35 + 0.22 * Math.sin(t * 1.5 + i * 2), false);
            const ry = P.group.rotation.y, g = rolled.rolls[i]; g.position.set(P.group.position.x + Math.sin(ry) * 0.62, 0, P.group.position.z + Math.cos(ry) * 0.62); g.rotation.set(0, ry, 0); g.visible = true; });
          /* (the young man carries one before him in both hands: his body has no take that holds a thing out, so the
             mat is the truth and his hands are solved under its two ends. Posed by a take he does not have, he stood with
             his arms down and the mat hung in the air beside him: photographed on a desktop) */
          pose(yng, 'Idle_3', 1 + t, true);
          { const g = yng.group, ry = g.rotation.y, fx = Math.sin(ry), fz = Math.cos(ry), c = [g.position.x + fx * 0.3, 1.0, g.position.z + fz * 0.3], m = rolled.carry;
            /* (v26.2 debug: the mat's foot at his hands' bones had his palms and fingers inside its lower half, measured in the
               film by tools/probes/clipscan.mjs: it rests ON his palms now, a palm's thickness above his wrists' bones) */
            m.position.set(c[0], c[1] - 0.064 + 0.045, c[2]); m.rotation.set(0, ry, 0); m.visible = true;
            for (const [sd, sg] of [['L', 1], ['R', -1]]) handTo(yng, sd, [c[0] + fz * sg * 0.3, c[1] - 0.064, c[2] - fx * sg * 0.3], [fx, 0.1, fz], [0, 1, 0], 1, { out: 0.2, down: 0.4 }); }
          pose(o60, 'Idle_3', 1 + t, true);
          pose(Tn, 'Idle_3', 3 + t, true); lookNow(Tn, 'lens', 1, 0.7);
          pose(Ph, 'Sit_to_Stand_Transition_M', 0.16 + 0.13 * Math.sin(t * 0.7), false); pose(cast.aunt, 'Idle_3', 2 + t, true);
          /* HE WALKS, a mat in his arms: across the turf to the stack, his eyes on those who roll and then on the stack */
          const kw = smo(sgk(t, T.mats + 0.5, T.q3A3 + 0.5)), ex = lp(A_W0[0], A_W1[0], kw), ez = lp(A_W0[1], A_W1[1], kw), dist = 3.62 * kw;
          const eye = [ex, EYE + 0.02 * Math.sin(dist * 2 * Math.PI / 0.72) * Math.min(1, 6 * kw * (1 - kw)), ez], ts = t - T.q3A3;
          const [yR, pR] = aimOf(eye, [-7.7, 0.5, 0.3]), [yS, pS] = aimOf(eye, [MATS_AT.x, 0.25, MATS_AT.z]), [yT, pT] = aimOf(eye, [Tn.group.position.x, 1.5, Tn.group.position.z]);
          const [yP, pP] = aimOf(eye, phoFace());
          const k1 = smo(sgk(t, T.q3A2 + 2.6, T.q3A3 - 0.2)), k2 = smo(sgk(ts, 0.1, 1.0)) * (1 - smo(sgk(ts, 1.5, 2.3)));
          const ya0 = yawMix(yawMix(yR, yS, k1), yT, k2), pi0 = lp(lp(lp(pR, -0.12, 0.6), pS, k1 * smo(sgk(ts, 1.5, 2.4))), pT, k2);
          /* (his eyes come UP off the stack first, and then go round to the far bench: turned and lifted on one ease, the
             middle of the move was a frame of turf) */
          const kUp = smo(sgk(ts, 3.3, 4.5)), kRound = smo(sgk(ts, 3.9, 6.3)), kz = smo(sgk(ts, 5.6, 8.8));
          eyes(eye, yawMix(ya0, yP, kRound), lp(lp(pi0, 0.02, kUp), pP, kRound), lp(60, 13, kz), lp(46, 9.5, kz));
          /* his own mat: under his arm as he walks; lowered onto the stack while his eyes are on Ton; and there, on the
             top of it, when they drop */
          const kdn = smo(sgk(ts, 0.3, 1.2));
          /* (a roll under his arm, its end pointing ahead of him: held across his body, a phone's frame saw a quarter of
             its length, a flat band of stripes) */
          if (ts < 1.25) filmCarry(handMat, handMatHolder, true, [0.07, lp(-0.3, -0.72, kdn), -0.62], [0.1, 1.45, 0]);
          else { filmCarry(handMat, handMatHolder, false); rolled.own.visible = true; }
        }
      },
      end() { endTidy(); }
    };
    const A_W0 = [-1.7, 2.95], A_W1 = [-5.3, 2.55];

    /* B · CHALLENGE THE PATH: he is asked to tell again how he came there; he sits apart until the light goes; he comes back */
    const B_EDGE = (() => { const [x, z] = benchAt(-4.6, 7.2); return [x, 0.86, z]; })();              // where he sits apart: before the bench and well to its side, the old man seen between the canopy's two front poles
    FILMS.B = {
      begin(api) { if (api.handsRoot) api.handsRoot.visible = false; FL.wai = false; FL.bai = false; endStage(); },
      frame(t, api) {
        const T = ENDT.B, Ph = cast.pho;
        if (t >= T.close) { closeFrame(t - T.close, 'B', api); return; }
        const [o60, w60, w40] = cast.wait;
        if (t < T.edge) {
          phoFace(); phoTalkFace(); const kTalk = speaks(Ph, t, T, ['ph3B1', 'ph3B2', 'ph3B3']); lookNow(Ph, 'lens', 1, 0.5, 0); pose(cast.aunt, 'Idle_3', 2 + t, true);
          const [fP, fD] = lensAt(t, [[0, 44, 33], [T.q3B0 + SECS['q3B0'], 38, 28], [T.ph3B1, 29, 21], [T.ph3B2 + SECS['ph3B2'], 33, 24], [T.q3B1 + 1, 50, 38], [T.q3B1 + 13, 50, 38],
                                      [T.q3B1 + SECS['q3B1'], 31, 23], [T.ph3B3 + 1.2, 22, 16], [T.q3B2, 23, 17], [T.edge, 28, 20]]);
          const [yF, pT] = toPho(EK, fP, fD, kTalk);
          /* "Tell me again how you came to this mat. Slowly.": his eyes go down to it, and come up one step with each
             thing he names, to the old man's face at the last */
          const ts = t - T.q3B1, at = [0, 2.2, 3.5, 6.2, 10.2, 12.8, 15.6], p0 = -0.96, kd = smo(sgk(ts, -1.0, 0.2));
          let pi = lp(pT, p0, kd);
          for (let i = 1; i < at.length; i++) pi += (pT - p0) / (at.length - 1) * smo(sgk(ts, at[i] - 0.2, at[i] + 0.9));
          eyes(EK, yF, pi, fP, fD);
        } else if (t < T.dusk) {
          if (FL.shot !== 'b2') { FL.shot = 'b2';
            /* the afternoon, from where he sits apart: one kneels to him, two wait */
            lit('AFTERNOON', 'two'); mistK = 0; myBai.visible = true;
            if (cast.ton.ready) cast.ton.group.visible = false;                 // (Ton has gone to help clear the ground: where the morning stood him he filled this picture, his back to it: photographed)
            put(o60, KNEEL2.x, KNEEL2.z, faceTo(KNEEL2.x, KNEEL2.z, PHO_AT[0], PHO_AT[1])); put(w60, cast.wait[1].home.x, cast.wait[1].home.z, cast.wait[1].home.ry); put(w40, cast.wait[2].home.x, cast.wait[2].home.z, cast.wait[2].home.ry);
            for (const P of [o60, w60, w40]) if (P.ready) P.group.visible = true;
            castSolid(); }
          const u = t - T.edge;
          pose(o60, 'seiza', 1.2 + 0.3 * Math.sin(u * 0.6), false); pose(w60, 'Idle_3', 1 + u, true); pose(w40, 'Idle_3', 4 + u, true); pose(cast.aunt, 'Idle_3', 2 + t, true);
          waitCarry(1); waitCarry(2);
          /* he talks with the one who kneels, and never once looks this way */
          { const A2 = Ph.ready && Ph.acts[Ph.talkTake], d = A2 ? A2.getClip().duration : 1; pose(Ph, Ph.talkTake, (1.3 + u) % d, false); }
          lookNow(Ph, [KNEEL2.x, 0.95, KNEEL2.z], 1, 0.5, 0);
          const k = smo(sgk(t, T.edge, T.dusk)), F = phoFace();
          /* (both of them WHOLE: the old man's far shoulder and the kneeler's back are named, not only their middles: a
             fit is given the extent of what it must hold, v25.5. Named by their middles, each was cut by an edge:
             photographed) */
          const [s0x, s0z] = benchAt(-0.1, 0.1), [k0x, k0z] = benchAt(0.46, 2.85);
          fitShot(B_EDGE, [lp(F[0], KNEEL2.x, 0.45), 0.95, lp(F[2], KNEEL2.z, 0.45)], lp(31, 28, k), lp(22, 19.5, k), [[F[0], F[1] + 0.18, F[2]], [s0x, 1.2, s0z], [k0x, 0.7, k0z], [KNEEL2.x, 0.08, KNEEL2.z]]);
        } else if (t < T.back) {
          if (FL.shot !== 'b3') { FL.shot = 'b3';
            /* dusk: they have gone; the bulbs along the eaves are on; he sits there still */
            lit('DUSK', 'two'); for (const P of cast.wait) if (P.ready) P.group.visible = false; for (const b of waitBai) b.visible = false; castSolid(); }
          pose(Ph, 'Sit_to_Stand_Transition_M', 0.16 + 0.13 * Math.sin(t * 0.7), false); pose(cast.aunt, 'Idle_3', 2 + t, true);
          const k = smo(sgk(t, T.dusk, T.back)), F = phoFace();
          shot(B_EDGE, [F[0] - 0.3, lp(1.75, 1.5, k), F[2]], lp(46, 40, k), lp(34, 29, k));
        } else {
          if (FL.shot !== 'b4') { FL.shot = 'b4'; }
          phoFace(); phoTalkFace(); const kTalk = speaks(Ph, t, T, ['ph3B4']); lookNow(Ph, 'lens', 1, 0.5, 0); pose(cast.aunt, 'Idle_3', 2 + t, true);
          const [fP, fD] = lensAt(t, [[T.back, 46, 34], [T.q3B4 + SECS['q3B4'], 36, 27], [T.ph3B4 + SECS['ph3B4'], 28, 20], [T.close, 32, 24]]);
          const [yF, pT] = toPho(EK, fP, fD, kTalk); eyes(EK, yF, pT, fP, fD);
        }
      },
      end() { endTidy(); }
    };

    /* C · ASK WHY: he is given a better question, and shown who is waiting */
    /* WHERE THEY WAIT, for this ending: at the far edge of the second carpet, 4 m to his right as he kneels and a little
       ahead of him (he turns his head, and does not look behind him), in a loose row ACROSS his line of sight, so a
       phone's frame holds all four. (Stood where the morning's line stood, the first of them was two metres off and
       filled the picture, and hid the other three: photographed) */
    /* (and clear of the canopy's front left pole, which stood between the second of them and the third when they waited
       at the carpet's side: photographed. From where he kneels the pole is five degrees outside this row's end) */
    const WAIT_C = (() => { const [cx, cz] = benchAt(-3.4, 3.0), d = Math.hypot(cx - KNEEL2.x, cz - KNEEL2.z), ux = (cx - KNEEL2.x) / d, uz = (cz - KNEEL2.z) / d, dep = [0.14, -0.1, 0.18, -0.05];
      return [-0.84, -0.28, 0.28, 0.84].map((s, i) => [cx - uz * s + ux * dep[i], cz + ux * s + uz * dep[i]]); })();     // (0.56 m apart: at 0.67 a phone's widest lens cut the first of them down his middle: photographed)
    FILMS.C = {
      begin(api) { if (api.handsRoot) api.handsRoot.visible = false; FL.wai = false; FL.bai = false; endStage(); },
      frame(t, api) {
        const T = ENDT.C, Ph = cast.pho, Wt = cast.wait;
        if (t >= T.close) { closeFrame(t - T.close, 'C', api); return; }
        if (FL.shot !== 'c1') { FL.shot = 'c1';
          Wt.forEach((P, i) => { put(P, WAIT_C[i][0], WAIT_C[i][1], faceTo(WAIT_C[i][0], WAIT_C[i][1], PHO_AT[0], PHO_AT[1]) + [0.1, -0.12, 0.06, -0.08][i]); if (P.ready) P.group.visible = true; });
          if (cast.ton.ready) cast.ton.group.visible = false; castSolid(); }
        const mid = [(WAIT_C[1][0] + WAIT_C[2][0]) / 2, 1.0, (WAIT_C[1][1] + WAIT_C[2][1]) / 2];
        phoFace(); phoTalkFace(); const kTalk = speaks(Ph, t, T, ['ph3C1', 'ph3C2', 'ph3C3']); pose(cast.aunt, 'Idle_3', 2 + t, true);
        /* "For whom?": his own eyes go to them first */
        const kq = bump(t, T.ph3C2 + 1.6, T.backto + 0.6, 0.9, 1.0);
        lookNow(Ph, 'lens', 1 - kq, 0.5, 0); if (kq > 0) lookNow(Ph, mid, kq, 0.6, 0);
        /* those who wait: they stand, and look to the old man on his bench; the first of them meets his eye, and nods */
        Wt.forEach((P, i) => { pose(P, 'Idle_3', 1.5 + i * 2.3 + t, true); waitCarry(i); });
        const kn = bump(t, T.q3C1 + 2.2, T.q3C1 + 6.4, 0.9, 1.0);
        lookNow(Wt[0], 'lens', kn, 0.7, 0.02 + 0.06 * kn * Math.max(0, Math.sin((t - T.q3C1 - 3.2) * 2.4)));
        const kW = smo(sgk(t, T.turn, T.turn + 2.4)) * (1 - smo(sgk(t, T.backto, T.backto + 1.5)));
        const [fP, fD] = lensAt(t, [[0, 44, 33], [T.q3C0 + SECS['q3C0'], 38, 28], [T.ph3C1 + SECS['ph3C1'], 27, 20], [T.turn, 29, 21],
                                    [T.backto + 1.5, 32, 24], [T.ph3C3 + SECS['ph3C3'], 25, 18], [T.bow, 46, 34]]);
        const [yF, pT] = toPho(EK, fP, fD, kTalk);
        /* his head is turned: the four of them, whole, in one picture (a fit, for this screen); a slow drift along them
           as he says what he was shown */
        const pan = smo(sgk(t, T.turn + 2.0, T.q3C1 + SECS['q3C1'])), must = [];
        for (const [wx, wz] of WAIT_C) { must.push([wx, 1.72, wz]); must.push([wx, 0.05, wz]); }
        /* (and the row's two ends by their far SHOULDERS, not their middles: a fit is given the extent of what it holds, v25.5) */
        { const ex = WAIT_C[3][0] - WAIT_C[0][0], ez = WAIT_C[3][1] - WAIT_C[0][1], el = Math.hypot(ex, ez) || 1;
          must.push([WAIT_C[0][0] - ex / el * 0.32, 1.3, WAIT_C[0][1] - ez / el * 0.32]); must.push([WAIT_C[3][0] + ex / el * 0.32, 1.3, WAIT_C[3][1] + ez / el * 0.32]); }
        const Fw = fit(EK, [mid[0], 0.95, mid[2]], isNarrow() ? 50 : 34, must), [yW0, pW] = aimOf(EK, Fw.at), yW = yW0 + 0.03 * (pan - 0.5);
        if (t >= T.bow && t < T.q3C3) bowEyes(EK, yF, pT, (t - T.bow) / (T.q3C3 - T.bow), 46, 34);
        else { handsFilm(0); eyes(EK, yawMix(yF, yW, kW), lp(pT, pW, kW), lp(fP, Fw.fl, kW), lp(fD, Fw.fl, kW)); }
      },
      end() { endTidy(); }
    };

    /* D · ASK TO MAKE IT STOP: he is taught to close and stay closed; he sits in the quiet; the chanting comes, and
       nothing takes him */
    const D_SIT = [PLACE.x, KNEEL.y, PLACE.z];
    FILMS.D = {
      begin(api) { if (api.handsRoot) api.handsRoot.visible = false; FL.wai = false; FL.bai = false; endStage(); },
      frame(t, api) {
        const T = ENDT.D, Ph = cast.pho;
        if (t >= T.close) { closeFrame(t - T.close, 'D', api); return; }
        pose(cast.aunt, 'Idle_3', 2 + t, true);
        if (t < T.sit) {
          /* (his eyes close on "stay", and open on a plain world: the look changes behind them) */
          if (t >= T.shut + 1.15 && FL.shot !== 'd2') { FL.shot = 'd2'; lit('SHUT', 'two'); paintShade('DAWN'); mistK = 0; if (kit && kit.hush) kit.hush(0.85, { secs: 0.8 }); }
          phoFace(); phoTalkFace(); const kTalk = speaks(Ph, t, T, ['ph3D1', 'ph3D2', 'ph3D3']); lookNow(Ph, 'lens', 1, 0.5, 0);
          const [fP, fD] = lensAt(t, [[0, 44, 33], [T.q3D0 + SECS['q3D0'], 36, 27], [T.ph3D2 + SECS['ph3D2'], 28, 20], [T.shut, 25, 18], [T.shut + 1.15, 25, 18], [T.shut + 1.2, 48, 36], [T.sit, 44, 33]]);
          const [yF, pT] = toPho(EK, fP, fD, kTalk); eyes(EK, yF, pT, fP, fD);
        } else if (t < T.back) {
          if (FL.shot !== 'd3') { FL.shot = 'd3'; myBai.visible = false; if (cast.ton.ready) cast.ton.group.visible = false; castSolid(); }   // (Ton is clearing the ground: where the morning stood him, his back filled the far look at the bench: photographed)
          pose(Ph, 'Sit_to_Stand_Transition_M', 0.16 + 0.13 * Math.sin(t * 0.7), false);
          /* THE EMPTIED GROUND, from where he knelt yesterday: the tables, the pole, two people clearing up; then the
             chanting from across the fields, and his own hand, which is only his hand; then, far off, the old man */
          const ts = t - T.chant, [yN, pN] = aimOf(D_SIT, [1.2, 1.9, -9.5]), [yP, pP] = aimOf(D_SIT, phoFace());
          const kH = smo(sgk(ts, 0.9, 2.4)) * (1 - smo(sgk(t, T.q3D3 + 0.3, T.q3D3 + 2.2))), kP = smo(sgk(t, T.q3D3 + 0.6, T.q3D3 + 3.4)), kz = smo(sgk(t, T.q3D3 + 2.6, T.back - 0.6));
          const drift = 0.05 * Math.sin((t - T.sit) * 0.25);
          eyes(D_SIT, yawMix(yN + drift, yP, kP), lp(lp(pN, -0.52, kH), pP, kP), lp(62, 12.5, kz), lp(48, 9.5, kz));
          /* HIS OWN HAND, the one the player has had all game, at its own rest, lifted a little into his sight as his eyes
             go down to it: and it does not move. (Two other ways were photographed and refused: at its walking place the
             hand lay at the frame's foot under the chant's words; the engine's `reach` pose lifted clear of them was a
             limp hand hanging from a bent wrist, seen from the side it was never made to be seen from) */
          handStill(kH);
          if (ts >= 0.3 && !FL.once.has('chant')) { FL.once.add('chant');
            if (kit && kit.captions) kit.captions([1, 2, 3].map((n) => ({ at: CHANT.far[n - 1][0], end: CHANT.far[n - 1][1], text: W['cap' + n], sub: W['cap' + n + 'Sub'] }))); }
        } else {
          if (FL.shot !== 'd4') { FL.shot = 'd4'; handStill(0); if (api.handsRoot) api.handsRoot.visible = false; myBai.visible = true; if (kit && kit.captions) kit.captions(null); }
          phoFace(); phoTalkFace(); const kTalk = speaks(Ph, t, T, ['ph3D4']); lookNow(Ph, 'lens', 1, 0.5, 0);
          const [fP, fD] = lensAt(t, [[T.back, 46, 34], [T.q3D4 + SECS['q3D4'], 34, 25], [T.ph3D4 + SECS['ph3D4'], 27, 20], [T.close, 31, 23]]);
          const [yF, pT] = toPho(EK, fP, fD, kTalk); eyes(EK, yF, pT, fP, fD);
        }
      },
      end() { endTidy(); }
    };

    /* THE FILMS' OWN BEDS (M7): the ground's loops under each film, a pure function of the film's clock (the rest of a
       film's sound is its cues: z_tail.js). Each is a share of play's own level (BED), so a film that begins or ends on
       play's picture begins and ends on play's sound */
    function filmBeds(key, t) {
      let fest = 0, mus = 0, birds = 0, crick = 0, open = 0, shop = 0;
      if (key === 'open') { const T = OPENT, k4 = smo(sgk(t, T.o4 + 0.2, T.o4 + 1.8)), kf = smo(sgk(t, T.o4 + 1.8, T.o4 + 3.6));
        birds = 0.8 * k4 * (1 - 0.7 * kf); fest = kf; mus = 0.3 * kf;                      // his eyes open on the turf: birds, then the ground's noise comes up over them (its loudspeakers only a hint: the film's own music is still playing, and two musics at once are a clash; play begins on the ground's own)
        shop = smo(sgk(t, T.o1 + 0.3, T.o1 + 1.6)) * (1 - smo(sgk(t, T.o4 - 1.4, T.o4 - 0.3))); }   // and before it, his shop at night: its fridge, the street far off
      else if (key === 'festival') { const T = FEST, kc = smo(sgk(t, T.cut + 0.3, T.cut + 1.5)), kp = smo(sgk(t, T.sweep + 3.6, T.pho + 0.5));
        fest = lp(0.75, 1, kc) * (1 - 0.8 * kp); mus = kc * (1 - kp); }                    // the dance has its own piece (a cue); the ground's music comes back at the cut, and all of it falls away for the man in white
      else if (key === 'between') { const T = BETW;
        fest = 0.6 * (1 - smo(sgk(t, T.n1 + 0.5, T.n1 + 3.6)));                           // the day's noise falls away under the night's music
        crick = smo(sgk(t, T.n3 - 0.2, T.n3 + 0.8)) * (1 - smo(sgk(t, T.n5 - 0.5, T.n5 + 0.6)));
        birds = smo(sgk(t, T.n5, T.n5 + 1.5)); }                                          // first light: play's own morning
      else if (key === 'tell' || key === 'answers') birds = 0.45;
      else if (key === 'A' || key === 'B' || key === 'C' || key === 'D') {
        const T = ENDT[key]; birds = 0.5;
        if (key === 'B') { birds = (0.5 + 0.6 * bump(t, T.silence, T.edge - 0.4, 0.6, 0.5)) * (1 - smo(sgk(t, T.edge - 0.5, T.edge + 0.1)));   // the long silence is held by the birds; the afternoon has its own bed (a cue)
          crick = smo(sgk(t, T.dusk, T.dusk + 1.0)); }                                    // dusk, and on through the close
        if (key === 'D') birds = 0.5 * (1 - smo(sgk(t, T.shut + 0.3, T.shut + 1.2))) + 0.25 * smo(sgk(t, T.back, T.back + 1.5));   // the world closes; he comes back to a quieter morning
        if (t >= T.close) open = c01(FL.openK || 0);                                      // the close's one breath: the world heard open on its level
      }
      filmBed.on = true; filmBed.fest = BED.fest * fest; filmBed.mus = BED.mus * mus; filmBed.birds = BED.birds * birds; filmBed.crick = BED.crick * crick;
      filmBed.open = BED.open * open; filmBed.pull = 0; filmBed.shop = BED.shop * shop;
    }
    const films = {
      key: '',
      /* (the dancers: play has them on the ground all of day one; every film but the festival's was directed without
         them, so each begins with them put away, and play's frame shows them again) */
      begin(key, c, api) { FL.key = films.key = key; FL.api = api; FL.once.clear(); FL.lit = lookName; danceG.visible = false; burstsLand(); if (FILMS[key] && FILMS[key].begin) FILMS[key].begin(api); },
      /* (a film's own frame: play's frame does not run under it, so the levels are chosen here, from the film's lens: v24.22) */
      frame(key, t, api) { if (FILMS[key]) FILMS[key].frame(t, api);
        filmBeds(key, t);
        /* (a probe's viewfinder: tools/probes/e4c3beats.mjs tries a lens here before a shot is written; never set in play) */
        if (FL.vf) { fLens(FL.vf[6]); camAt([FL.vf[0], FL.vf[1], FL.vf[2]], [FL.vf[3], FL.vf[4], FL.vf[5]]); }
        peopleLevels(); lodTick(); },
      /* (HIS HANDS COME BACK when a film ends. Every film here hides them at its start, and the engine shows them again
         only after a film from play (v21.1): the opening film is not one, so play began with them hidden and the bai sri
         Ton hands him was never drawn until the festival's film had ended. Found at M8 by a photograph of it held) */
      end() { const F = FILMS[FL.key]; if (F && F.end) F.end(); if (FL.api && FL.api.handsRoot) FL.api.handsRoot.visible = true; FL.key = films.key = ''; FL.api = null; camera.rotation.z = 0; filmBed.on = false; },
      /* THE CLOSE'S ONE BREATH (§4.6: "One breath, played"): the film waits for it (eventWait). While it is played the
         world is laid on its level here, because the film's own frame is standing still; when it ends the film runs on
         and eases the light shut from where he left it */
      breathOpts(k) {
        return { kind: 'gate', low: true, title: W.breathTitle, prompt: W.breathTitle, label: W.breathTitle,
          brief: TOUCHY ? W.breathBrief : W.breathBriefKey, whereWord: TOUCHY ? W.breathWhere : W.breathWhereKey,
          openWord: W.breathOpen, closeWord: W.breathClose, restWord: '', breaths: [{ enough: 2.2, edge: 6.0, lead: 0.5 }], gain: 0, cost: 0, idle: 14, at: { sx: 0.5, sy: 0.74 },
          onLevel: (lv, held, i, st, gk) => { FL.openK = Math.max(lv, GATE_WORLD * (gk || 0)); if (FL.key === k) closeLight(k, smo(c01(FL.openK / 0.9)), 0, wallNow()); } };
      },
      breathDone(r) { FL.openOut = r && r.skipped ? 0 : FL.openK; }
    };

    /* ---------------------------------------------------------------- the stage's life */
    function snap() { return { phase }; }
    function restore() {}
    function reset() {
      films.end();
      dropTodo(); speakReset(); lineQ.length = 0; heard.clear(); turns.length = 0; ambReset();
      booted = false; preplaced = ''; dayClock.t = 0; lastWall = 0; lastWall0 = 0; pausedAt = 0;
      decOpen = false;
      for (const h of hotspots) { h.done = false; h.dwellT = 0; }
      /* everything a run changes is put back (v8.1: a same-chapter replay never runs build() again) */
      play.run++;
      Object.assign(play, { busy: false, turning: null, bow: null, bai: false, baiP: 0, baiTo: 0, baiSecs: 1, knelt: false, homage: false, pull: null, looked: false,
                            checked: false, bowed: false, breath: null, lookEase: null, tonGive: null, ymCarry: false, ymSet: null, pull3: 0, ymHands: null, away: false, chanting: false });
      play.asked = new Set(); open.k = 0; open.shown = -1; open.over = 0; open.i = -1; open.st = '';
      if (kit) {
        if (kit.abortEvent) kit.abortEvent();
        kit.objective(null, { complete: false });
        kit.root(false); kit.pose('standing', { secs: 0.05 });
        if (kit.hold) kit.hold(null);
        if (kit.pray) kit.pray(false, { secs: 0 });
        if (kit.tremble) kit.tremble(0, { secs: 0 });
        if (kit.pulse) kit.pulse(null);
        if (kit.chill) kit.chill(0, { secs: 0 });
        if (kit.smear) kit.smear(0, { secs: 0 });
        if (kit.hush) kit.hush(0, { secs: 0 });
        if (kit.lens) kit.lens(null, { secs: 0 });
        kit.presence(0);
        kit.daylight(null, 0);
        kit.setPhase('arrive');
        if (kit.captions) kit.captions(null);
        kit.waypoint(null);
      }
      handBaiHolder.add(handBai);
      phase = 'arrive';
      for (const P of people) { if (P.driver || !P.ready) continue; P.span = null; P.gaze = null; P.gazeK = 0; P.lay = null; P.layK = 0; armsBack(P); }
      whenReady(cast.pho, (P) => { P.rest.take = 'Sit_to_Stand_Transition_M'; });
      whenReady(cast.ym, (P) => { P.rest.take = 'seiza'; });
      /* (v8.1: "takes a scene set". Whoever a film or a beat left in a take of its own is back in the one he was built
         in: the man whose arms rose in the festival, the old man who knelt in an ending, both put away and both still
         in those takes when the run was read after a Retry (tools/probes/e4c3replay.mjs, 12 Nov). One who is still in
         his own is left alone, so his clock runs on and nobody on the bench falls into step with his neighbour. And
         every body's level is chosen afresh, as a first run chooses it: Grandmaster Pho has no middle body, and on a
         second run he was drawn in his full one from the spawn, held there by the band that stops a level flickering) */
      for (const P of people) { if (P.driver || !P.ready) continue; P.lvNow = -1; if (P.cur !== P.rest.take) rest(P, 0); }
      for (const M0 of crowd) M0.lvNow = -1;
      dayOneStage(); setFormation('arrive'); tonHome();
      baiPut(myBai, TON_BAI.x, TON_BAI.y, TON_BAI.z, TON_BAI.ry);
    }
    function blockers() {
      const out = [];
      const solid = (o, pad = 0.14) => { o.updateWorldMatrix(true, false); const bb = new THREE.Box3().setFromObject(o); bb.expandByScalar(pad); bb.min.y = 0; bb.max.y = Math.max(bb.max.y, 1.40); out.push(bb); };
      for (const s of solids) solid(s);
      for (const b of crowdBlock) out.push(b);                                   // the crowd, a column a person (lifted out of his way when they are gone: crowdSolid)
      for (const b of dawnBlock) out.push(b);                                    // the two who clear up on day two
      for (const b of danceBlock) out.push(b);                                   // the six dancers, wherever they stand or walk (c_crowd.js)
      for (const k in castBlock) out.push(castBlock[k]);                         // and those of the cast who stand on the turf (each follows its person: castSolid)
      return out;
    }
    function dispose() {
      alive = false;
      const geos = new Set(), ms = new Set(), skels = new Set();
      world.traverse(o => {
        if (o.isSkinnedMesh && o.skeleton) skels.add(o.skeleton);                  // each skin's bone sheet is a texture of its own
        if (o.geometry) geos.add(o.geometry);
        if (o.material) for (const m of (Array.isArray(o.material) ? o.material : [o.material])) ms.add(m);
      });
      for (const p of parsedGlb.values()) p.then(({ scene: sc }) => sc.traverse(o => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) for (const m of (Array.isArray(o.material) ? o.material : [o.material])) {
          for (const k of ['map', 'roughnessMap', 'metalnessMap', 'normalMap', 'emissiveMap', 'alphaMap']) m[k]?.dispose?.();
          m.dispose();
        }
      })).catch(() => {});
      scene.remove(world);
      for (const o of owned) { if (o.parent) o.parent.remove(o); o.dispose?.(); }
      owned.length = 0;
      for (const g of geos) g.dispose();
      for (const k of skels) k.dispose();
      for (const m of ms) {
        for (const k of ['map', 'roughnessMap', 'metalnessMap', 'normalMap', 'emissiveMap', 'alphaMap']) m[k]?.dispose?.();
        m.dispose();
      }
      for (const m of mats) m.dispose();
      for (const t of madeTex) t?.dispose?.();
      world.clear();
      S = null;
    }

    return (S = {
      world, noteTex, blockers: blockers(),
      ready: () => true,
      pile: { pos: PILE_POS, radius: INTERACT_R, group: pile,
              dist: pileDist, screen: pileScreen, inView: pileInView,
              hits: pointerHitsPile, interact: interactPile,
              glow: () => 0 },
      drum: null, ash: null, embers: null, heroNote: null, smoke: null, flying: null,
      jossTips: [], fireLight: null,
      skyAt: () => FL.sky,                                                      // (the sky stands over the turf; a film's pocket set asks for it over itself)
      stepSound: stepNext,                                                      // his own feet on the grass: he left his sandals at the turf's edge (d_play.js STEPS_GRASS, v26.1)
      /* walktest: where play puts him besides the spawn, and the ground he must STAY on (v25.5): the turf, the gravel
         before the tables and the tents' fronts. He cannot leave it */
      /* (walktest reads the collision of the FIRST frame: the gathering, its people kneeling where the next morning
         finds him. So the morning's own arrival is not named here, where it would be tried against yesterday's crowd
         (it failed so the day the chapter was first put on walktest's list, 12 Nov): tools/probes/e4c3walk.mjs walks
         each of the chapter's three grounds in its own collision, from where each phase puts him) */
      arrivals: [{ what: 'in the line at his bench', x: LINE_AT.x, z: LINE_AT.z },
                 { what: 'kneeling at his place', x: PLACE.x, z: PLACE.z }, { what: 'kneeling before Grandmaster Pho', x: KNEEL2.x, z: KNEEL2.z }],
      keepIn: { what: 'the ground of the Wai Kru', minX: DATA.bounds.minX, maxX: DATA.bounds.maxX, minZ: DATA.bounds.minZ, maxZ: DATA.bounds.maxZ },
      get phase() { return phase; },
      setPhase, applyPhase, after, dayClock, sayLine, queueLine, queueFn, queueGap,
      look, presets: PRESETS, films, crowdStats, setFormation,
      /* for the probes (tools/probes/e4c3drive.mjs): the play's own state and its beats by name */
      dbg: { viewfinder(v) { FL.vf = v || null; }, clocks: { A: ENDT.A, B: ENDT.B, C: ENDT.C, D: ENDT.D, CLOSE, FEST, BETW, TELL, ANSW, OPEN: OPENT }, armsOf, handTo, handsTo, restHands, baiGrip, baiPut, play, open, cast, bursts, BAI, handBai, myBai, ymBai, petalBurst, auraAt, baiHands, baiRaise, lineBegin, dawnBegin, breathBegin, places: { PLACE, LINE_AT, KNEEL2, DAWN_AT, TABLES_AT }, dancers, dancersDir, danceBlock, dancerSpot, kids, kidsDir, kidPath, taper, extrasHeard, people, headDampLay },
      who: () => people.filter(P => !P.driver).map(P => ({ key: P.key, ready: P.ready, take: P.cur, skin: P.lvShown, skins: P.lv.map(v => (v ? 1 : 0)).join('') })),
      plan: { TURF, TABLES, HALL, TENT_W1, TENT_W2, TENT_E, CHIEF, BENCH, POLE, TON_TABLE, WEST_TABLE },
      /* the ground's own noises (ambTick): how many have sounded, and the last (a probe counts them over a stretch of play) */
      amb: () => ({ n: ambN, last: ambLast, next: +ambAt.toFixed(2), beds: Object.assign({}, bedMix), pan: +musPan.toFixed(3) }),
      /* Grandmaster Pho's look, for a probe that brackets it (tools/probes/e4c3beats.mjs: eval E.stage.phoLook.lift.value = 0.4) */
      phoLook,
      info: () => ({ phase, t: +dayClock.t.toFixed(2), queued: lineQ.length, heard: [...heard], until: +speak.until.toFixed(2),
                     pending: speak.pending ? speak.pending.name : null, decOpen, look: lookName, busy: play.busy, applied: booted,
                     waiting: [...waiting].sort(), mends: twinMends }),
      /* how much the world draws, by counting the thing itself (v25.5): meshes, triangles, and the pictures' memory */
      census: () => {
        let meshes = 0, tris = 0; const texs = new Set();
        world.traverse(o => { if (!o.isMesh && !o.isLine && !o.isLineSegments) return; let v = true; for (let q = o; q; q = q.parent) if (!q.visible) { v = false; break; }
          if (!v) return; meshes++;
          const g = o.geometry, n = g.index ? g.index.count / 3 : (g.attributes.position ? g.attributes.position.count / 3 : 0);
          tris += n * (o.isInstancedMesh ? o.count : 1);
          for (const m of [].concat(o.material)) for (const k of ['map', 'normalMap', 'roughnessMap', 'metalnessMap', 'emissiveMap']) if (m && m[k] && m[k].image) texs.add(m[k].source || m[k]); });
        let mb = 0; for (const s of texs) { const im = s.data || s.image; if (im && im.width) mb += im.width * im.height * 4 * 1.33 / 1048576; }
        return { meshes, tris: Math.round(tris), textures: texs.size, texMB: +mb.toFixed(1) };
      },
      hotspots,
      updateNotes, updatePile, updateFire, updateSlow,
      snap, restore, reset, dispose
    });
  }

