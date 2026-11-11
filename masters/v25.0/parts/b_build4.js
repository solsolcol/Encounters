
    /* ================================================================ (v25.0) THE BUILDERS RUN — every name they or a
       frame ask for is declared above (the v21.1 TDZ law); blockers are in their array before build() returns (v24.0) */
    buildShop();
    buildProps();
    buildCast();
    /* the shop was a film set in chapter 1 (World S, never walked): here he walks it, so what stands on its floor blocks
       him as drawn — the cabinets down both walls, the altar's cabinet and the two units beside it on the back wall, his
       stool and the customers' two (v5.03: columns from the floor) */
    for (const sx of [-1, 1]) solids.push(hidBox(0.44, 2.05, 2.8, sx * 2.17, 1.02, 0.7, worldS));
    solids.push(hidBox(SHRINE.w, SHRINE.h, SHRINE.d, 0, SHRINE.h / 2, SHOP.z0 + SHRINE.d / 2, worldS));
    for (const sx of [-1, 1]) solids.push(hidBox(BU.x1 - BU.x0, BU.H, BU.d, sx * (BU.x0 + BU.x1) / 2, BU.H / 2, SHOP.z0 + BU.d / 2, worldS));
    for (const [x, z] of [[STOOL.x, STOOL.z], [-1.15, PSTOOL.z], [PSTOOL.x, PSTOOL.z]]) solids.push(hidBox(0.4, 0.72, 0.4, x, 0.36, z, worldS));
    /* (v25.5, Chad: "do not allow the player to exit the shop in the gameplay, i was able to walk out of the shop into other
       shops") THE SHOP'S OPEN FRONT stops him in play: a wall across it, just outside the shutter's line (nothing drawn;
       the films walk the corridor on their own paths, which obey no collision, v5.03). The chapter's bounds still reach
       the corridor's far side, where the films stand */
    solids.push(hidBox(SHOP.x1 - SHOP.x0 + 0.6, 2.4, 0.2, 0, 1.2, SHOP.z1 + 0.24, worldS));
    /* Lersi Chin on his mat: a blocker only while he sits there (its box emptied otherwise — the engine holds the same
       boxes, so the one box is opened and closed, never added) */
    const lcBlock = new THREE.Box3();
    const lcBlockOn = (on) => { if (on) { lcBlock.min.set(LC.x - 0.42, 0, LC.z - 0.4); lcBlock.max.set(LC.x + 0.42, 1.4, LC.z + 0.36); } else lcBlock.makeEmpty(); };
    lcBlockOn(false);

//@@COPY 6777-6906

    /* ---- (v25.0) THE MALL'S PEOPLE on a film's clock: each walks its line through its shot and is hidden either side of
       it (and in every shot that is not theirs), so a skip, a seek or a replay lands the same corridor; at noon in play
       they pass on the wall clock, two of them on their own rounds (Chad, 2 Nov: "show real people walking past") */
    const MALL = { open: [['mallA', [[6.4, 4.4], [-6.4, 4.4]], 0.8, 10.0], ['mallB', [[-6.4, 6.6], [6.4, 6.6]], 19.6, 28.8]],
                   A: [['mallA', [[6.4, 4.5], [-6.4, 4.5]], END.A.days, END.A.days + 9.2], ['mallB', [[-6.4, 6.7], [6.4, 6.7]], END.A.call + 9.0, END.A.call + 18.2]],
                   D: [['mallA', [[-6.4, 4.6], [6.4, 4.6]], END.D.last - 1.2, END.D.last + 8.0], ['mallB', [[6.4, 6.8], [-6.4, 6.8]], END.D.last + 0.4, END.D.last + 9.6]] };
    function mallPass(scene, t) {
      for (const k of ['mallA', 'mallB']) {
        const P = cast[k]; if (!P) continue;
        const row = (MALL[scene] || []).find(rw => rw[0] === k && t >= rw[2] && t <= rw[3]);
        if (!row || !P.ready) { if (P.group) P.group.visible = false; P.filmWalk = 0; continue; }
        fWalk(P, row[1], row[2], row[3], t, { linear: true });
      }
    }
    const MALL_PLAY = { mallA: { per: 19, walk: 10.5, line: [[6.4, 4.3], [-6.4, 4.3]], off: 3 }, mallB: { per: 26, walk: 11.5, line: [[-6.4, 6.7], [6.4, 6.7]], off: 11 } };
    function mallPlay(now, on) {
      for (const k in MALL_PLAY) {
        const P = cast[k], R = MALL_PLAY[k]; if (!P || !P.ready) continue;
        const u = ((now + R.off) % R.per);
        if (!on || u > R.walk) { P.group.visible = false; P.filmWalk = 0; continue; }
        fWalk(P, R.line, 0, R.walk, u, { linear: true });
      }
    }
    /* who is speaking a line of the film's at t: his talking take, read off the film's own cues (a chant is not talk) */
    const SPEAKS = { pg: 'pong', lc: 'lersi', cu: 'woman' };   // (v25.5: 'cu' is the customers'; the man of ending A is only heard, and nobody stands for him)
    const CHANTS = new Set(['lc2om']);
    function speakerNow(who) {
      const P = cast[who]; if (!P || !P.ready) return null;
      let vis = P.group.visible; for (let q = P.group.parent; vis && q && q !== world; q = q.parent) vis = q.visible;
      return vis ? P : null;
    }
    function fTalk(t) {
      for (const s of FL.stings) {
        const sp = SPEAKS[String(s.kind).slice(0, 2)]; if (!sp || CHANTS.has(s.kind) || /^pg2c|^pg2A/.test(s.kind)) continue;   // (Pong on the phone is not in the room)
        const d = SECS[s.kind]; if (!d || t < s.at || t > s.at + d) continue;
        const P = speakerNow(sp); if (!P) continue;
        /* (v25.2) his talking take is a man sat back answering questions: while his hands or his back are in an action it
           pulled his shoulders back from what his hands were on (as he said "Drink. A little." they stopped 9-11 cm short of
           the bowl's sides, measured; on the line's end they reached it), so he speaks without it then */
        if (P === cast.lersi && lcBusy()) continue;
        P.talkUntil = wallNow() + 0.25;
      }
    }

    /* (the look at the lens, a thing in his right hand, letting go, his wai — chapter 1's, as they were) */
//@@COPY 7014-7021
//@@COPY 7027-7064
//@@COPY 7080-7106

    /* ---------------------------------------------------------------- (v25.0) the films' own helpers */
    const KN_EYE = [CL.x, KNEEL.y, CL.z];                               // his eye kneeling before Lersi Chin
    /* (v25.5) A WALK THAT BEGINS AND ENDS AT REST, at a pace: the ground covered at t by a walk begun at t0 along a path L
       long: up to the pace v over `acc` seconds, on at v, and down to rest over `acc` at the path's end. Answers
       [metres, the pace now, the seconds it takes], a pure function of the film's clock (chapter 1's walkS never
       stops: its walks are cut away from). With walkOn a person is carried along a smooth curve by it (his gait at the
       pace he is moving), and stands at each end turned the way the path goes */
    function walkArc(t, t0, L, v = 0.85, acc = 0.9) {
      const vv = Math.min(v, L / acc), T = L / vv + acc, u = t - t0;
      if (u <= 0) return [0, 0, T];
      if (u >= T) return [L, 0, T];
      if (u < acc) return [vv * u * u / (2 * acc), vv * u / acc, T];
      if (u > T - acc) { const r = T - u; return [L - vv * r * r / (2 * acc), vv * r / acc, T]; }
      return [vv * (u - acc / 2), vv, T];
    }
    const headAt = (pts, s) => { const f = pathAhead(pts, s, 0.5), b = pathAt(pts, Math.max(0, s - 0.5)); return Math.atan2(f[0] - b[0], f[1] - b[1]); };
    function walkPace(P, pts, t, t0, v, acc = 0.9) {
      if (!P || !P.ready) return [0, 0, 0];
      const L = pathLen(pts), A = walkArc(t, t0, L, v, acc);
      if (A[1] > 0.02) walkOn(P, pts, A[0], A[1]);
      else { const a = pathAt(pts, A[0]); fPut(P, a[0], a[1], headAt(pts, A[0]), { y: 0, seated: false }); }
      return A;
    }
    /* (v25.5) nothing is held in his own hand in this chapter's films any more (Chad, of the piece taken off its shelf
       and of ending D's amulet: "the animation just looks awkward" ... "the arms and hands ends up looking awkward"): the
       grip's measures (v25.1 F7), the piece in his fist (v25.4) and the hand's own clone of it went with the two shots
       that used them */
    /* (v25.4) the middle of the piece where it stands on its shelf: what the films that look at it aim at (the shelf's
       own middle was the aim while every piece was a few centimetres tall and stood there) */
    function shelfPiece() {
      const F = PIECE_FIT[play.piece] || PIECE_FIT.nangkwak, pc = props.pieces[play.piece];
      return [SHELF.x + F.at[0], SHELF.y + ((pc && pc.userData.fitY) || 0.08) * 0.5, SHELF.z + F.at[1]];
    }
    const _pbb = new THREE.Box3();                                     // (v25.4) the piece's own box, for the shot that must hold it
    /* (v25.4) THE TWO THAT LIE, ON THE MASTER'S PALMS: laid across the MIDDLE of his two palms, 3 cm toward his fingers
       from the tray's own point (the heels of his hands, where the seated figure's base stands). At that point a 20 cm
       tube read through the film's lens as balanced on his wrists, his palms empty before it (photographed) */
    const _pfA = new THREE.Vector3(), _pfB = new THREE.Vector3();
    function palmsMiddle(obj) {
      const W = cast.lersi && cast.lersi.waiHand; if (!W || !W.Left || !W.Right || !obj.parent) return;
      let dx = 0, dy = 0, dz = 0;
      for (const H of [W.Left, W.Right]) {
        handPoint(H, H.palm[0], H.palm[1], _pfA); handPoint(H, H.palm[0] + 0.03 / H.mpu, H.palm[1], _pfB);
        dx += _pfB.x - _pfA.x; dy += _pfB.y - _pfA.y; dz += _pfB.z - _pfA.z;
      }
      obj.parent.updateWorldMatrix(true, false); obj.getWorldPosition(_pfA); _pfA.x += dx / 2; _pfA.y += dy / 2; _pfA.z += dz / 2;
      obj.position.copy(obj.parent.worldToLocal(_pfA));
    }
    const BUDDHA_AT = [BUDDHA.x, BUDDHA.y, BUDDHA.z];
    const O_TRAY = [-0.75, DISPLAY.floor, COUNTER.z - 0.04];              // the compartment she asks about, under the glass
    /* (v25.2) HIS BODY IN THE FILMS (lcBody, b_build3): his look eased onto what he looks at. (v25.3) The joined hands'
       three places (at his brow, his head bowed to them: the Buddha's and his teachers'; before his chest: a greeting
       answered; lower, at the foot of his chest, for the long verses), the two palms a tray before his chest and raised
       to his brow, and the bowl cradled */
    const W_BROW = { wai: 'brow' }, W_CHEST = { wai: 'chest' }, W_LOW = { wai: 'low' };
    const C_CHEST = { cup: 'chest' }, C_BROW = { cup: 'brow' }, H_BOWL = { bowl: 1 };
    /* his look through keys [[t0, t1, target], ...] (target: 'lens', a point [x, y, z], or null for his take's own), each
       change eased from the one before between its two times: the head turns over a human time onto what he looks at (in
       v25.0 a look switched on in one frame, and his head turned there in it) */
    const _lkA = new THREE.Vector3(), _lkB = new THREE.Vector3();
    function lookPt(tg, out) {
      if (tg === 'lens') { camera.updateWorldMatrix(true, false); return camera.getWorldPosition(out); }
      return out.set(tg[0], tg[1], tg[2]);
    }
    /* (v25.5) anyone's look by keys (the woman at his counter looks by them too): each person's own target point, so two
       may be given a look in one frame */
    function pLook(P, t, keys, neck = 1.1) {
      if (!P) return;
      const T = P.lookV || (P.lookV = new THREE.Vector3());
      let from = null, to = null, u = 1;
      for (const [a, b, tg] of keys) { if (t < a) break; from = to; to = tg; u = ezk(t, a, b); }
      if (u >= 1) from = to;
      if (!from && !to) { P.lookAt = null; P.lookK = 0; P.neck = null; return; }
      if (from && to) { lookPt(from, _lkA); lookPt(to, _lkB); T.lerpVectors(_lkA, _lkB, u); }
      else lookPt(to || from, T);
      P.lookAt = T; P.lookK = from && to ? 1 : to ? u : 1 - u; P.neck = neck;
    }
    const lcLook = (t, keys, neck = 1.1) => pLook(cast.lersi, t, keys, neck);
    /* his head's bow and his back's lean through keys, from the film's clock (set straight, so a seek lands on them) */
    function lcBow(P, v) { if (P) P.bow = P.bowNow = v; }
    const LC_HEAD = () => faceOf(cast.lersi, [LC.x, 0.74, LC.z]);
    const PG_HEAD = () => faceOf(cast.pong, [PSTOOL.x, 1.42, PSTOOL.z]);
    const UNDER = [0.3, 1.0, SHOP.z1 + 0.6];                             // under the shutter's edge, the corridor's light
    const top0 = COUNTER.h + 0.046;                                      // the counter's glass
    /* (v25.5) his own way out behind the two of them in ending D: from where he stands aside on the cut (B's and C's
       own place, GO_EYE) into the master's wake, and after them to the shutter; when he sets off (from the cut), his
       pace, and the share of his look that goes to Pong once the shutter is up */
    const D_EYE = walkCurve([[-1.6, 0.2], [-0.9, 0.45], [-0.1, 0.9], [0.4, 1.7], [0.42, 2.6], [0.15, 3.3]]);
    const D_OUT = { at: 2.4, v: 0.8, share: 0.4 };
    function shot(eye, at, fPhone, fDesk, roll = 0) { fLens(isNarrow() ? fPhone : fDesk); camAt(eye, at, roll); }
    /* (v25.2, Chad: "On a phone screen, there are many things i cannot see in the intro cutscenes, the gameplay section, and
       the intermediate cutscenes, and the ending cutscenes. Its not well optimized for mobile aspect ratio") A SHOT NAMES
       WHAT IT MUST HOLD (the camera rules: a portrait phone sees about a third of a desktop's width). fit(eye, at, fl, must)
       answers the aim and the lens for THIS screen: on a desktop exactly what was asked; on a phone, the aim turned the least
       that brings every point in `must` (and the shot's own aim) inside the frame's safe part (NDC |x| <= FIT.x, |y| <= FIT.y:
       the skip button, the captions and the frame's edges kept clear), and the lens widened only as far as that still needs
       (to FIT.max at most). Every point is projected exactly, as the camera will draw it. A pure function of its arguments
       (a seek lands where play does). The last shot's points and where they fell are kept for the probe (FL.must) */
    const FIT = { x: 0.84, y: 0.8, max: 74 };
    const _fitV = new THREE.Vector3();
    function fitProject(eye, psi, th, fov, P) {
      const cp = Math.cos(th), sp = Math.sin(th), cy = Math.cos(psi), sy = Math.sin(psi);
      _fitV.set(P[0] - eye[0], P[1] - eye[1], P[2] - eye[2]);
      const zc = -_fitV.x * cp * sy + _fitV.y * sp - _fitV.z * cp * cy;                  // along the look
      const xc = _fitV.x * cy - _fitV.z * sy;                                            // to the right
      const yc = _fitV.x * sp * sy + _fitV.y * cp + _fitV.z * sp * cy;                     // up
      const tv = Math.tan(fov * Math.PI / 360);
      return zc > 1e-3 ? [xc / (zc * tv * camera.aspect), yc / (zc * tv), xc, yc, zc] : [9, 9, xc, yc, zc];
    }
    function fit(eye, at, fl, must) {
      const dx = at[0] - eye[0], dy = at[1] - eye[1], dz = at[2] - eye[2];
      let psi = Math.atan2(-dx, -dz), th = Math.atan2(dy, Math.hypot(dx, dz)), fov = fl;
      const pts = (must || []).filter(Boolean);
      if (isNarrow() && pts.length) {
        const all = pts.concat([at]), psi0 = psi, th0 = th;
        /* (v25.5, Chad: "at the final last part when camera zooms into the call pong note, the camera bounces several
           times") THE LENS IS SOLVED, NOT STEPPED. v25.2 widened it two degrees at a time until the points fitted, one
           turn of the aim to each step: as a shot pushed in, the lens it was asked for narrowed smoothly and the lens it
           was given jumped back out by a step each time the points stopped fitting (measured on the note's push at a
           phone's size: twelve jumps of about 1.5 degrees in three seconds). Now, for one lens, the aim is turned until
           it settles (`aimFor`), and the lens is the narrowest that then holds every point, found by halving between
           the lens asked for and FIT.max: a smooth function of the eye, the aim and the lens asked for, so a push is
           one move. Where the asked lens already holds them, it is the asked lens exactly */
        const aimFor = (fv) => {
          let p = psi0, h = th0;
          const tv = Math.tan(fv * Math.PI / 360), AX = Math.atan(FIT.x * tv * camera.aspect), AY = Math.atan(FIT.y * tv);
          for (let it = 0; it < 40; it++) {
            /* each point's bearing and height from the look, in angles; the turn that centres their spread where it overflows */
            let a0 = Infinity, a1 = -Infinity, b0 = Infinity, b1 = -Infinity;
            for (const P of all) { const q = fitProject(eye, p, h, fv, P), ax = Math.atan2(q[2], q[4]), ay = Math.atan2(q[3], Math.hypot(q[2], q[4]));
              a0 = Math.min(a0, ax); a1 = Math.max(a1, ax); b0 = Math.min(b0, ay); b1 = Math.max(b1, ay); }
            const sx = a1 - a0 <= 2 * AX ? Math.min(Math.max(0, a1 - AX), a0 + AX) : (a0 + a1) / 2;
            const sy = b1 - b0 <= 2 * AY ? Math.min(Math.max(0, b1 - AY), b0 + AY) : (b0 + b1) / 2;
            p -= sx; h += sy;
            if (Math.abs(sx) + Math.abs(sy) < 1e-6) break;
          }
          let over = 0;                                                  // how far the worst point stands outside the safe part
          for (const P of all) { const q = fitProject(eye, p, h, fv, P); over = Math.max(over, Math.abs(q[0]) - FIT.x, Math.abs(q[1]) - FIT.y); }
          return { p, h, out: over > 1e-3 };
        };
        let A = aimFor(fov);
        if (A.out && fov < FIT.max) {
          const top = aimFor(FIT.max);
          if (top.out) { A = top; fov = FIT.max; }
          else { let lo = fov, hi = FIT.max; A = top;
            for (let it = 0; it < 22; it++) { const mid = (lo + hi) / 2, M = aimFor(mid); if (M.out) lo = mid; else { hi = mid; A = M; } }
            fov = hi; }
        }
        psi = A.p; th = A.h;
      }
      FL.must = pts.map(P => { const q = fitProject(eye, psi, th, fov, P); return [+q[0].toFixed(3), +q[1].toFixed(3)]; });
      const cp = Math.cos(th);
      return { at: [eye[0] - Math.sin(psi) * cp * 10, eye[1] + Math.sin(th) * 10, eye[2] - Math.cos(psi) * cp * 10], fl: fov };
    }
    /* a shot that must hold `must` on every screen: fit, then the lens and the aim */
    function fitShot(eye, at, fPhone, fDesk, must, roll = 0) { const F = fit(eye, at, isNarrow() ? fPhone : fDesk, must); fLens(F.fl); camAt(eye, F.at, roll); }
    /* the fog in a film: the cold's blur and grey, laid over a scene (kit.chill's `cine`) — a film draws no smear */
    function fogFilm(k) { if (kit && kit.chill) kit.chill(FOG.cine * c01(k), { secs: 0.01, cine: true, tint: 'grey' }); }
    /* a prop's moving part, set absolute (a film's picture is a function of its clock, v6.4) */
    function propsAt(o) {
      for (const k of ['till', 'bag', 'jacket', 'fridge']) if (o[k] != null) { props[k + 'K'] = o[k]; props[k + 'To'] = o[k]; }
      if (o.mat != null) { props.matK = o.mat; props.matTo = o.mat; }
    }
    function shopAt(o) {
      if (o.u != null) { shop.t1 = 0; shop.u = o.u; shop.uTo = o.u; }
      if (o.led != null) { shop.l1 = 0; shop.ledK = o.led; shop.ledTo = o.led; }
      if (o.ceil != null) { props.c1 = 0; props.ceilK = o.ceil; props.ceilTo = o.ceil; }
      if (o.night != null && props.night !== !!o.night) shopCtl.night(o.night);
    }
    /* who is in the shop for a shot (each set every frame, so a cut or a seek lands on the same room) */
    function castVis(o) {
      for (const k in o) { const P = cast[k]; if (P && P.ready) P.group.visible = !!o[k]; }
      if (o.lersi != null) lcBlockOn(!!o.lersi && cast.lersi && cast.lersi.seated);
    }
    /* Lersi Chin seated on his mat, as play keeps him */
    function lcSeated() { const P = cast.lersi; if (!P || !P.ready) return; fPut(P, LC.x, LC.z, 0, { y: 0, seated: true }); }
    function pongSeated() { const P = cast.pong; if (!P || !P.ready) return; fPut(P, PSTOOL.x, PSTOOL.z, PONG_RY, { y: 0, seated: true }); }
    /* Pong at the shutter (P8: "Bro, I wait outside"), turned into the shop */
    const PONG_DOOR = { x: 0.9, z: 2.5 };
    function pongDoor() { const P = cast.pong; if (!P || !P.ready) return; fPut(P, PONG_DOOR.x, PONG_DOOR.z, faceTo(PONG_DOOR.x, PONG_DOOR.z, CL.x, CL.z), { y: 0, seated: false }); }
    /* (v25.5, Chad: "in the scene where he calls pong, why does the phone fly away to the corner of the screen and
       disappear? whats the purpose in that? can you improve the presentation?") HIS PHONE STAYS ON THE GLASS: the call is
       on its speaker, its screen in the picture whenever his eyes come back to it. The phone that was put in his hand
       for the call (v25.0; its own body and a second screen) is gone: it was raised "to his ear" by sending it to the
       frame's top corner, which read as a phone flying away. Where it lies, and its glass's four corners (a shot of it
       must hold them on a phone's screen) */
    const PHONE_RY = -0.3;                                             // (buildShop's turn of it on the glass, toward his place)
    const phoneAt = () => (shop.phone ? [shop.phone.base.x, top0 + 0.009, shop.phone.base.z] : [0.48, top0 + 0.009, COUNTER.z + 0.04]);
    function phoneCorners() {
      const p = phoneAt(), c = Math.cos(PHONE_RY), s = Math.sin(PHONE_RY);
      return [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([a, d]) => [p[0] + 0.041 * a * c + 0.083 * d * s, p[1], p[2] - 0.041 * a * s + 0.083 * d * c]);
    }
    /* the piece in Lersi Chin's hands (raised and honoured): a clone of the one on the shelf, made the first time it is
       wanted (the model is in by then; the curtain waits for it) */
    const held = { lc: null };
    function pieceClone(slot) {
      const src = props.pieces[play.piece]; if (!src) return null;
      if (!held[slot] || held[slot].userData.piece !== play.piece) {
        if (held[slot] && held[slot].parent) held[slot].parent.remove(held[slot]);
        const c = src.clone(true); c.visible = false; c.userData.piece = play.piece; c.userData.dyn = true; world.add(c); held[slot] = c;
        /* (v25.4) in a hand it is as his file has it: the glow is the shelf's (pieceLit, b_build2); and it stands on its
           own foot, at no turn of the shelf's */
        pieceLit(c, false); c.userData.lit = false; c.position.set(0, 0, 0); c.rotation.set(0, 0, 0);
      }
      return held[slot];
    }
    /* (v25.5) a cased amulet from his tray, LAID ON THE GLASS between him and the woman who asks about it (ending D): on
       its back, its head away from him (it reads the right way up from his side, where the lens is), turned a little.
       One of his own stock's models whole (the tray's are its far level), lifted by half its own thickness */
    const AMU_AT = [-0.3, top0 + 0.006, COUNTER.z + 0.18], AMU_RY = Math.PI + 0.3, AMU_H = 0.062;
    const amuletTop = (() => {
      const g = new THREE.Group(); g.position.set(AMU_AT[0], top0 + 0.0004, AMU_AT[2]); g.rotation.y = AMU_RY; g.visible = false; g.userData.dyn = true; worldS.add(g);
      const lay = new THREE.Group(); lay.rotation.x = -Math.PI / 2; lay.position.set(0, 0.0056, AMU_H / 2); g.add(lay);
      fitModel('e4somdej', lay, AMU_H, 'y', 0, 0).then(m => { if (m && alive) lay.position.y = m.userData.fit.z / 2 + 0.0004; });
      return g;
    })();
    function amuletCorners() {
      const c = Math.cos(AMU_RY), s = Math.sin(AMU_RY);
      return [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([a, d]) => [AMU_AT[0] + 0.024 * a * c + 0.036 * d * s, AMU_AT[1], AMU_AT[2] - 0.024 * a * s + 0.036 * d * c]);
    }
    /* HIS NOTEBOOK on the counter, open: the masters he has checked, some crossed out (the coda) — a drawn page laid on
       the shop's own book, drawn only when what it shows changes */
    /* (v25.1 F3) laid with its top AWAY from him, so it reads upright from his place (laid flat by x alone, the page's
       top came toward him and every word in the coda stood upside down) */
    const nBook = (() => {
      if (!shop.ledger) return null;
      const [c, x] = sized(cnv, 1024, 640), t = tex(done(THREE, c, false));
      const pg = new THREE.Mesh(new THREE.PlaneGeometry(0.44, 0.29), M({ map: t, roughness: 0.85 })); pg.rotation.set(-Math.PI / 2, 0, Math.PI); pg.position.y = 0.0135; pg.visible = false;
      shop.ledger.add(pg);
      /* (v25.2) on the real notebook (its pages bow up from the spine), the page is laid ON its pages: a grid each of
         whose points is dropped onto the page below it, a millimetre and a half over it (a flat sheet floated over the
         dip at the spine). Done once, when the model lands, under the curtain */
      const onBook = (m) => {
        const bk = shop.ledger; bk.updateWorldMatrix(true, true);
        const g = new THREE.PlaneGeometry(0.42, 0.28, 48, 8), pos = g.attributes.position, rc = new THREE.Raycaster();
        const meshes = []; m.traverse(c => { if (c.isMesh) meshes.push(c); });
        const o = new THREE.Vector3(), dn = new THREE.Vector3(0, -1, 0);
        for (let i = 0; i < pos.count; i++) {
          o.set(-pos.getX(i), 0.3, pos.getY(i)); bk.localToWorld(o); rc.set(o, dn);   // the plane's (x, y) is the book's (-x, z)
          const hit = rc.intersectObjects(meshes, false)[0];
          pos.setZ(i, (hit ? bk.worldToLocal(hit.point).y : 0.04) + 0.0015 - pg.position.y);
        }
        g.computeVertexNormals(); pg.geometry.dispose(); pg.geometry = g;
      };
      if (shop.ledger.userData.book) onBook(shop.ledger.userData.book); else shop.ledger.userData.onBook = onBook;
      return { pg, x, t, sig: '' };
    })();
    function namesAt(n) {
      if (!nBook) return;
      nBook.pg.visible = n >= 0;
      const sig = String(n); if (sig === nBook.sig || n < 0) return; nBook.sig = sig;
      drawNames(nBook.x, { n, words: DATA.words }); nBook.t.needsUpdate = true;
    }
    /* (v25.5) a point of the notebook's drawn page in the room, by where it is on the page's sheet (px of 1024 x 640): the
       page is a plane of 0.42 x 0.28 m laid on the book (its sheet's left at the plane's -x, its top at +y) */
    const _nbv = new THREE.Vector3();
    function pagePoint(cx, cy) {
      if (!nBook) return null;
      nBook.pg.updateWorldMatrix(true, false);
      nBook.pg.localToWorld(_nbv.set((cx / 1024 - 0.5) * 0.42, (0.5 - cy / 640) * 0.28, 0.012));
      return [_nbv.x, _nbv.y, _nbv.z];
    }
    /* (v25.5) A POINT OF HIS LAPTOP'S SCREEN IN THE ROOM, by where it is drawn on the screen's sheet (px of 1024 x 720), so
       a shot can be asked to hold what the screen shows (the forum's middle column on a phone). The screen is a flat
       piece of the laptop's model: its own points and their places on the sheet give the plane (a least-squares fit of
       place = A [u, v, 1], solved once the model has landed); null until then, and for the drawn stand-in */
    let lapFit = null;
    const _lpv = new THREE.Vector3();
    function lapPoint(cx, cy) {
      if (!lapFit) {
        const g = shop.lapG; if (!g || !shop.lap) return null;
        let mesh = null; g.traverse(o => { if (o.isMesh && o.material === shop.lap.m) mesh = o; });
        const P = mesh && mesh.geometry.attributes.position, U = mesh && mesh.geometry.attributes.uv; if (!P || !U) return null;
        const Sm = [0, 0, 0, 0, 0, 0, 0, 0, 0], Bm = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
        for (let i = 0; i < P.count; i++) { const a = [U.getX(i), U.getY(i), 1], p = [P.getX(i), P.getY(i), P.getZ(i)];
          for (let r = 0; r < 3; r++) { for (let c2 = 0; c2 < 3; c2++) Sm[r * 3 + c2] += a[r] * a[c2]; for (let k = 0; k < 3; k++) Bm[r][k] += a[r] * p[k]; } }
        const m3 = new THREE.Matrix3().set(Sm[0], Sm[1], Sm[2], Sm[3], Sm[4], Sm[5], Sm[6], Sm[7], Sm[8]);
        if (Math.abs(m3.determinant()) < 1e-14) return null;
        const e = m3.invert().elements;                                  // (column-major: row r of column c at e[c * 3 + r])
        lapFit = { mesh, X: [0, 1, 2].map(r => [0, 1, 2].map(k => e[r] * Bm[0][k] + e[3 + r] * Bm[1][k] + e[6 + r] * Bm[2][k])) };
      }
      /* the sheet's point as the model's own (u, v): the screen's island is laid over the whole sheet (LAP.uv), its top at v 1 */
      const u = (cx / 1024 - LAP.uv[2]) / LAP.uv[0], v = (1 - cy / 720 - LAP.uv[3]) / LAP.uv[1], X = lapFit.X;
      lapFit.mesh.updateWorldMatrix(true, false);
      lapFit.mesh.localToWorld(_lpv.set(u * X[0][0] + v * X[1][0] + X[2][0], u * X[0][1] + v * X[1][1] + X[2][1], u * X[0][2] + v * X[1][2] + X[2][2]));
      return [_lpv.x, _lpv.y, _lpv.z];
    }
    /* the forum's middle column (c_tail: FX0..FX1), top to foot: what a phone's picture of the screen must hold */
    function lapColumn() { const q = [[FX0, 8], [FX1, 8], [FX1, 712], [FX0, 712]].map(([a, d]) => lapPoint(a, d)); return q[0] ? q : null; }

    /* (v25.5, Chad: "when lersi chin is chanting, you can make him have a special effect like a golden aura glow around him
       as he chants and blesses the player. also, when he is concentrating/meditating to find the problem (the item), can
       also have a special effect, maybe a white aura glow? make these effects look good.") THE MASTER'S AURA, painted
       light (no lamp, v15.1), every value a function of the film's clock (auraAt): a soft light the shape of a man
       sitting, behind him, in two layers (the colour laid on as a colour, and the glow added over it: added alone, a
       colour over the pale counter behind him sums to white, v8.8); a fan of rays turning slowly behind that; a pool
       of the light on the mat round him, with rings going out across it; and motes rising round him, some before him
       and some behind (the scene's own depth sorts them). It breathes once in five seconds. Built hidden here, so
       the curtain warms it (v14.15).
       (11 Nov 2026, Chad, with v25.5 on his phone: "maybe dont use golden aura and glow for lersi chin, use only white,
       and make the white glow more subtle. For both the meditation part and also the chanting and blessing part.
       Golden will be used for grandmaster pho only.") LERSI CHIN'S AURA IS WHITE, AND QUIET, in both films: as he sits
       in the stillness and finds the piece (the examination) and as he chants and gives the water (the clearing),
       cool, its rings slow ripples, at about half of what the white stood at (AURA_K). GOLD IS GRANDMASTER PHO'S
       ALONE (a standing rule, CLAUDE.md): its colours and its strengths, set from photographs on 10 Nov, are kept
       here for chapter 3 to lift, and no film of this chapter asks for it (auraAt's first number is 0 everywhere) */
    const AURA = { gold: { hue: 0xf0a41c, glow: 0xffc65a, mote: 0xffdc8c }, white: { hue: 0xbfd2f4, glow: 0xeef4ff, mote: 0xffffff }, motes: 64, rings: 3 };
    const aura = (() => {
      const g = new THREE.Group(); g.position.set(LC.x, 0, LC.z); g.visible = false; g.userData.dyn = true; worldS.add(g);
      const tBody = tex(makeAuraBody(THREE, cnv)), tRays = tex(makeAuraRays(THREE, cnv)), tDot = tex(makeGlow(THREE, cnv)), tRing = tex(makeAuraRing(THREE, cnv));
      const sprite = (map, blending, w, h, y, z, order) => {
        const m = new THREE.SpriteMaterial({ map, transparent: true, opacity: 0, depthWrite: false, fog: false, blending }); mats.push(m);
        const s = new THREE.Sprite(m); s.scale.set(w, h, 1); s.position.set(0, y, z); s.renderOrder = order; s.userData.dyn = true; g.add(s); return s;
      };
      /* (v25.5) and behind them all, a soft DARK round the place where he sits: light is only seen against less light,
         and the counter behind him is nearly white (a white light laid on it was all but nothing, and the gold a pale
         yellow: photographed) */
      const shade = sprite(tDot, THREE.NormalBlending, 4.2, 3.4, 1.0, -0.56, 0);
      shade.material.color.setHex(0x06070b);
      const hue = sprite(tBody, THREE.NormalBlending, 1.9, 1.9, 0.95, -0.34, 1);
      const rays = sprite(tRays, THREE.AdditiveBlending, 2.4, 2.4, 0.98, -0.4, 2);
      const glow = sprite(tBody, THREE.AdditiveBlending, 1.62, 1.64, 0.82, -0.3, 3);
      const flat = (map, size, y) => { const m = B({ map, transparent: true, opacity: 0, depthWrite: false, fog: false, blending: THREE.AdditiveBlending });
        const o = new THREE.Mesh(new THREE.PlaneGeometry(size, size), m); o.rotation.x = -Math.PI / 2; o.position.y = y; o.renderOrder = 1; o.userData.dyn = true; g.add(o); return o; };
      const pool = flat(tDot, 2.4, MAT_TOP + 0.006);
      const rings = []; for (let i = 0; i < AURA.rings; i++) rings.push(flat(tRing, 1, MAT_TOP + 0.008 + i * 0.0015));
      const N = AURA.motes, r = rng(9157), seed = [];
      for (let i = 0; i < N; i++) seed.push({ a: r() * 6.283, rad: 0.32 + r() * 0.6, T: 4.4 + r() * 3.6, ph: r(), sw: 0.4 + r() * 0.8, top: 1.1 + r() * 0.6 });
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(N * 3), 3)); geo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(N * 3), 3));
      const pm = new THREE.PointsMaterial({ map: tDot, size: 0.05, sizeAttenuation: true, transparent: true, depthWrite: false, fog: false, blending: THREE.AdditiveBlending, vertexColors: true }); mats.push(pm);
      const pts = new THREE.Points(geo, pm); pts.frustumCulled = false; pts.renderOrder = 4; pts.userData.dyn = true; g.add(pts);
      return { g, shade, hue, rays, glow, pool, rings, pts, seed, tm: new THREE.Color(), tDot, tRing };
    })();
    function auraAt(kGold, kWhite, t) {
      const A = aura, k = Math.max(kGold, kWhite);
      A.g.visible = k > 0.002; if (!A.g.visible) return;
      const white = kWhite > kGold, C = white ? AURA.white : AURA.gold, K = white ? AURA_K.white : AURA_K.gold;
      const br = 0.86 + 0.14 * Math.sin(t * 2 * Math.PI / 5.2);
      A.shade.material.opacity = K.shade * k;
      A.hue.material.color.setHex(C.hue); A.hue.material.opacity = K.hue * k * br;
      A.glow.material.color.setHex(C.glow); A.glow.material.opacity = K.glow * k * (1.1 - 0.2 * br);
      A.rays.material.color.setHex(C.glow); A.rays.material.opacity = K.rays * k * br; A.rays.material.rotation = t * (white ? 0.035 : 0.06);
      A.pool.material.color.setHex(C.hue); A.pool.material.opacity = K.pool * k * br;
      A.rings.forEach((R, i) => { const per = white ? 3.8 : 5.2, on = white || i === 0, u = (((t / per + i / A.rings.length) % 1) + 1) % 1;
        const d = white ? 0.7 + 2.0 * u : 1.3 + 1.0 * u; R.scale.set(d, d, 1); R.visible = on;
        R.material.color.setHex(C.glow); R.material.opacity = on ? K.ring * k * Math.sin(Math.PI * u) * (1 - 0.5 * u) : 0; });
      const P = A.pts.geometry.attributes.position, V = A.pts.geometry.attributes.color; A.tm.setHex(C.mote);
      A.seed.forEach((s, i) => { const u = (((t / s.T + s.ph) % 1) + 1) % 1, a = s.a + s.sw * Math.sin(u * 4.4 + s.ph * 6.283), rr = s.rad * (1 - 0.3 * u);
        /* (round him and behind him; one that would rise before his body goes behind it instead: a mote in front of his
           face was a bright speck on his lip, by photograph; beside his knees they may stand before him) */
        const mx = Math.cos(a) * rr, mz = Math.sin(a) * rr * 0.7;
        P.setXYZ(i, mx, 0.06 + s.top * u, mz > -0.05 && Math.abs(mx) < 0.5 ? -mz - 0.22 : mz - 0.08);
        const al = K.mote * k * Math.pow(Math.sin(Math.PI * u), 1.4) * (0.55 + 0.45 * Math.sin(t * 3.1 + s.ph * 40));
        V.setXYZ(i, A.tm.r * al, A.tm.g * al, A.tm.b * al); });
      P.needsUpdate = true; V.needsUpdate = true;
      A.pts.material.size = white ? 0.04 : 0.05;
    }
    /* how strong each layer is, set from photographs on a phone's shape and a desktop's (masters/v25.5). (11 Nov) the
       white at about half of its first strengths (shade 0.7, hue 0.6, glow 0.56, rays 0.5, pool 0.36, ring 0.4, mote 1):
       Chad's "more subtle"; the gold as it was photographed, kept for Grandmaster Pho */
    const AURA_K = { gold: { shade: 0.66, hue: 0.78, glow: 0.55, rays: 0.5, pool: 0.5, ring: 0.26, mote: 1 }, white: { shade: 0.34, hue: 0.3, glow: 0.3, rays: 0.2, pool: 0.2, ring: 0.2, mote: 0.55 } };

    /* (v25.5, 11 Nov, Chad: "He chants it 3 times only, show the white energy gathering as he chants it, and then it flies
       to the player and creates a clearing effect and the whole screen flashes and fades white quickly for a moment,
       before being fully cleared") THE POWER, GATHERED AND SENT. Painted light (no lamp, v15.1), white only (gold is
       Grandmaster Pho's), every value a function of the clearing's clock (powerAt), built hidden here so the curtain
       warms it (v14.15):
         the light at his joined hands: a small hard core in a soft halo, a step brighter and larger with each saying
           of the mantra (it does not swell evenly: it comes with the words, and holds through each breath);
         the gathering itself: motes drawn in to his hands from round the room, along curved ways, more of them with
           each saying; and a ring going out from his hands as each saying ends;
         the sending: the light leaves his hands for the lens, slowly and then fast, growing as it comes;
         the white: the film's own fade, in white (the engine's forty-third seam, v25.5: `fade(.., '#ffffff')` in
           clearFilm). A white drawn in the room was tried first and photographed: the game's vignette lies over the
           picture, so it came out an oval with grey sides, and his own joined hands stood on top of it. The fade lies
           over the picture, the hands' pass and the vignette alike;
         the clearing: a ring across the floor from where he kneels, out through the shop, and the last of the light
           rising and going out round the room, under the white as it thins. */
    const POWER = { motes: 96, drift: 54, core: 0xffffff, halo: 0xdfe8ff, mote: 0xeef3ff };
    const power = (() => {
      const g = new THREE.Group(); g.visible = false; g.userData.dyn = true; worldS.add(g);
      /* (the light's three sprites are drawn over whatever stands at their depth: a sprite is a flat card, and his bowed
         face came through the halo's card along a hard curved edge, a pale veil over his chin and none on his brow: by
         photograph) */
      const sprite = (map, blending, order) => {
        const m = new THREE.SpriteMaterial({ map, transparent: true, opacity: 0, depthWrite: false, depthTest: false, fog: false, blending }); mats.push(m);
        const s = new THREE.Sprite(m); s.renderOrder = order; s.userData.dyn = true; s.frustumCulled = false; g.add(s); return s;
      };
      const halo = sprite(aura.tDot, THREE.AdditiveBlending, 6), core = sprite(aura.tDot, THREE.AdditiveBlending, 7), pulse = sprite(aura.tRing, THREE.AdditiveBlending, 6);
      halo.material.color.setHex(POWER.halo); core.material.color.setHex(POWER.core); pulse.material.color.setHex(POWER.halo);
      const sweep = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), B({ map: aura.tRing, transparent: true, opacity: 0, depthWrite: false, fog: false, blending: THREE.AdditiveBlending, color: POWER.halo }));
      sweep.rotation.x = -Math.PI / 2; sweep.position.set(CL.x, 0.012, CL.z); sweep.renderOrder = 2; sweep.userData.dyn = true; g.add(sweep);
      const points = (n, size, order) => {
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(n * 3), 3)); geo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(n * 3), 3));
        const pm = new THREE.PointsMaterial({ map: aura.tDot, size, sizeAttenuation: true, transparent: true, depthWrite: false, fog: false, blending: THREE.AdditiveBlending, vertexColors: true }); mats.push(pm);
        const p = new THREE.Points(geo, pm); p.frustumCulled = false; p.renderOrder = order; p.userData.dyn = true; g.add(p); return p;
      };
      const motes = points(POWER.motes, 0.06, 5), drift = points(POWER.drift, 0.055, 5);
      const r = rng(4417), mseed = [], dseed = [];
      /* a mote's way in: from a point of a shell round his hands (the room's upper half and its sides, never from under the
         floor or from behind the lens), turning a little round his hands as it comes */
      for (let i = 0; i < POWER.motes; i++) mseed.push({ az: r() * 6.283, el: -0.15 + r() * 1.25, R: 0.75 + r() * 1.0, T: 1.25 + r() * 1.1, ph: r(), turn: (r() - 0.5) * 2.4, rank: r(), fl: r() * 40 });
      for (let i = 0; i < POWER.drift; i++) dseed.push({ a: r() * 6.283, rad: 0.3 + r() * 2.1, y: 0.15 + r() * 1.3, wait: r() * 0.9, life: 1.3 + r() * 1.5, up: 0.1 + r() * 0.22, out: 0.1 + r() * 0.4, fl: r() * 40 });
      return { g, halo, core, pulse, sweep, motes, drift, mseed, dseed, tm: new THREE.Color(POWER.mote), at: new THREE.Vector3(), H: new THREE.Vector3(), E: new THREE.Vector3(), d: new THREE.Vector3() };
    })();
    /* how far the light has gathered at a moment (0..1): a third with each saying, held through each breath */
    function gathered(t) { const K = CLEARF; let s = 0; for (const [a, b] of OM_REPS) s += ezk(t, K.om + a, K.om + b); return s / OM_REPS.length; }
    const _pwA = new THREE.Vector3(), _pwB = new THREE.Vector3();
    /* `t` on the clearing's clock, `eye` this frame's lens (the light is sent to it); null puts it all away */
    function powerAt(t, eye) {
      const P = power, K = CLEARF;
      if (t == null || t < K.om - 0.1 || t > K.clear + 2.4) { P.g.visible = false; return; }
      P.g.visible = true;
      /* where his joined palms are, and the lens */
      const L = cast.lersi, W = L && L.ready && L.waiHand;
      if (W && W.Left && W.Right) { handPoint(W.Left, W.Left.palm[0], W.Left.palm[1], _pwA); handPoint(W.Right, W.Right.palm[0], W.Right.palm[1], _pwB); P.H.addVectors(_pwA, _pwB).multiplyScalar(0.5); }
      else P.H.set(LC.x, 0.6, LC.z + 0.24);
      P.E.set(eye[0], eye[1], eye[2]); P.d.subVectors(P.E, P.H).normalize();
      P.H.addScaledVector(P.d, 0.07).y += 0.035;                     // before his fingers, a little over their roots: the light is seen, not hidden in his hands
      const gk = gathered(t), u = c01((t - K.fly) / (K.flash - K.fly)), fl = Math.pow(u, 2.3), sent = t >= K.flash;
      const sh = 1 + 0.07 * Math.sin(t * 7.3) + 0.04 * Math.sin(t * 13.1), br = 0.9 + 0.1 * Math.sin(t * 2 * Math.PI / 2.9);
      /* the light: at his hands while it gathers; on its way to the lens (to a hand's breadth before the near plane) */
      P.at.copy(P.H).lerp(_pwA.copy(P.E).addScaledVector(P.d, -0.24), fl); P.at.y += 0.05 * Math.sin(Math.PI * u) * (1 - u);
      const on = sent ? 0 : 1;
      P.core.position.copy(P.at); P.halo.position.copy(P.at);
      const cs = (0.05 + 0.19 * gk) * sh * (1 + 0.5 * u), hs = (0.3 + 0.85 * gk) * br * (1 + 0.9 * u);
      P.core.scale.set(cs, cs, 1); P.halo.scale.set(hs, hs, 1);
      P.core.material.opacity = on * Math.min(1, 0.25 + 0.95 * gk); P.halo.material.opacity = on * (0.16 + 0.56 * gk) * br;
      /* a ring from his hands as each saying ends; and, as the white thins, one ring out from where the light struck
         him to past the frame's edges: the clearing, seen going through the room */
      let pv = -1; for (const [, b] of OM_REPS) { const v = (t - (K.om + b - 0.1)) / 1.0; if (v >= 0 && v <= 1) pv = v; }
      /* (it crosses the frame while the white is thinning, not under it at its full: from the middle to past a phone's
         edges and a desktop's in a second and a half, fast and then slower) */
      const wv = (t - (K.flash + 0.55)) / 1.5;
      if (wv >= 0 && wv <= 1) {
        P.pulse.position.copy(P.E).addScaledVector(P.d, -0.7); const ws = 0.08 + 1.2 * (1 - (1 - wv) * (1 - wv)); P.pulse.scale.set(ws, ws, 1);
        P.pulse.material.opacity = 0.55 * Math.sin(Math.PI * Math.min(1, wv * 1.15)) * (1 - 0.4 * wv);
      } else {
        P.pulse.position.copy(P.H); const ps = 0.16 + 1.25 * (pv < 0 ? 0 : ez5(pv)); P.pulse.scale.set(ps, ps, 1);
        P.pulse.material.opacity = pv < 0 ? 0 : 0.5 * Math.sin(Math.PI * pv) * (1 - 0.45 * pv);
      }
      /* the motes drawn in: a mote's whole way lies inside the gathering, and there are more of them as it builds */
      { const A = P.motes.geometry.attributes.position, C = P.motes.geometry.attributes.color, t0 = K.om + 0.15, t1 = K.fly + 0.15;
        P.mseed.forEach((s, i) => {
          const q = (t - t0) / s.T + s.ph, n = Math.floor(q), w = q - n, born = t0 + (n - s.ph) * s.T;
          let al = 0;
          if (born >= t0 - 0.02 && born + s.T <= t1 && s.rank <= 0.3 + 0.7 * gathered(born + s.T * 0.6)) {
            const k = Math.pow(1 - w, 1.7), az = s.az + s.turn * w, ce = Math.cos(s.el), rr = s.R * k;
            /* (never between his hands and the lens in the last of its way: it would cross his face) */
            A.setXYZ(i, P.H.x + Math.cos(az) * ce * rr, Math.max(0.05, P.H.y + Math.sin(s.el) * rr), P.H.z + Math.sin(az) * ce * rr * 0.8 - 0.06 * (1 - k));
            al = Math.pow(Math.sin(Math.PI * Math.min(1, w * 1.12)), 0.8) * (0.7 + 0.3 * Math.sin(t * 5.3 + s.fl)) * (0.75 + 0.25 * gk);
          } else A.setXYZ(i, P.H.x, P.H.y, P.H.z);
          C.setXYZ(i, P.tm.r * al, P.tm.g * al, P.tm.b * al); });
        A.needsUpdate = true; C.needsUpdate = true; }
      /* the clearing: the ring across the floor from where he kneels, and the last of the light rising round the room */
      { const v = (t - (K.flash + 0.1)) / 1.7, ok = v >= 0 && v <= 1, d = 0.5 + 9 * (ok ? ez5(v) : 0);
        P.sweep.scale.set(d, d, 1); P.sweep.material.opacity = ok ? 0.5 * Math.sin(Math.PI * v) * (1 - 0.5 * v) : 0;
        const A = P.drift.geometry.attributes.position, C = P.drift.geometry.attributes.color;
        P.dseed.forEach((s, i) => { const w = (t - (K.flash + 0.25) - s.wait) / s.life; let al = 0;
          if (w >= 0 && w <= 1) { const rr = s.rad + s.out * w; A.setXYZ(i, CL.x + Math.cos(s.a) * rr, s.y + s.up * w * s.life, CL.z - 0.6 + Math.sin(s.a) * rr * 0.8);
            al = Math.pow(Math.sin(Math.PI * w), 1.2) * (0.6 + 0.4 * Math.sin(t * 4.1 + s.fl)) * 0.85; }
          else A.setXYZ(i, CL.x, 0.5, CL.z - 0.6);
          C.setXYZ(i, P.tm.r * al, P.tm.g * al, P.tm.b * al); });
        A.needsUpdate = true; C.needsUpdate = true; }
    }

    /* ================================================================ THE FILMS' PICTURES (§4), each a pure function of
       its own clock: every shot his eyes (he is never seen, Chad 9 Nov), named by what it must hold */

    /* (v25.5, Chad: "when the female customer asks a question, there is no female customer in that cut scene, can you add
       one?") THE WOMAN AT HIS COUNTER (cast.woman: a stand-in until his model for her, declared). She stands across the
       glass from him, at the tray she asks about, from the film's first frame (a customer looking: on a wide screen she
       is at the edge of the first shot). Her feet are behind the counter from his eyes while she stands there. In the
       opening film she asks, waits, gives up and goes (W_OUT: she turns where she stands, then walks out and away along
       the corridor); in ending D she is back, at the piece that lies on the glass (D_WOMAN) */
    const O_WOMAN = { x: -0.65, z: -0.92 }, D_WOMAN = { x: -0.36, z: -0.93 };
    const D_END = { past: 0.55 };                                      // ending D's last look on a phone: how far past her it goes (endD)
    const W_OUT = walkCurve([[O_WOMAN.x, O_WOMAN.z], [-0.45, 0.3], [0.05, 2.0], [0.5, 3.3], [2.2, 4.3], [5.6, 4.5]], 96);
    /* her turn from the counter to her way out (over `secs` from t0), then her walk at a customer's pace */
    function womanGoes(t, t0, secs = 0.9, v = 1.15) {
      const P = cast.woman; if (!P || !P.ready) return;
      const A = walkPace(P, W_OUT, t, t0 + secs * 0.7, v);
      if (A[0] <= 0 && A[1] <= 0.02) P.group.rotation.y = Math.PI + angTo(Math.PI, headAt(W_OUT, 0)) * ezk(t, t0, t0 + secs);
    }

    /* O · THE FOG (§4.0): noon, the cases full, the grey on everything; a customer he cannot follow; his pockets; the
       note in his own hand */
    function openFrame(t) {
      const O = OPEN;
      fLook('DAY'); fogFilm(1);
      shopAt({ u: 1, led: 1, ceil: 1, night: false });
      propsAt({ till: 0, bag: 0, jacket: 0, fridge: 0 });
      shop.lapOn = 1; shop.lapMode = 'sales'; shop.phoneOn = 0;
      castVis({ goldman: true, lersi: false, pong: false, woman: t < O.o3 });
      mallPass('open', t);
      /* her, on the film's clock: at the tray until she has said she will come back another day, then out. Her eyes: on
         the piece she asks about; up to him at "Who blessed it?", and on him while he does not answer; away as she turns */
      const Wm = cast.woman, tGo = O.cu2a1b + 1.5;
      if (Wm && Wm.ready && t < O.o3) {
        womanGoes(t, tGo);
        pLook(Wm, t, [[-1, 0, O_TRAY], [O.cu2a1 + 2.5, O.cu2a1 + 3.2, 'lens'], [tGo - 0.5, tGo + 0.2, null]], 1.0);
      }
      const eye = [HIS.x + 0.12, 1.6, HIS.z + 0.18];
      if (t < O.o2) {
        /* O1 · from his place: along the right-hand cabinet's stock, full now, to the open front and the corridor — slow */
        const k = smo(sgk(t, 0.4, O.o2 - 0.2));
        shot(eye, aimEase(eye, [1.9, 1.15, -0.4], [0.5, 1.3, 4.8], k), 60, 52);
        return;
      }
      if (t < O.o3) {
        /* O2 · (v25.5) SHE IS SEEN, AND HE CANNOT FOLLOW HER: his eyes are on her as she begins; they go down to the piece
           she points at under the glass, and stay there after her question has ended (the fog: v25.0 kept them on the
           tray for the whole of it, and nobody stood there); at "Sorry... can you say again?" they come back up to
           her, and hold on her as she gives up; at "I could not think properly" they follow her out to the corridor */
        /* (v25.0 CP8) from the till's end of his place, the tray at his left hand: the laptop in front of him and the note
           by his phone both stay out of the frame on every screen (from his own place the laptop filled half a phone's) */
        const e1 = [HIS.x - 0.2, 1.56, HIS.z + 0.28];
        const face = faceOf(Wm, [O_WOMAN.x, 1.44, O_WOMAN.z]);
        const kDn = smo(sgk(t, O.cu2a1 + 0.9, O.cu2a1 + 2.2)) * (1 - smo(sgk(t, O.q2o2b - 0.25, O.q2o2b + 0.75)));
        const kOut = smo(sgk(t, O.q2o2 - 0.3, O.q2o2 + 2.4));
        /* (a point of her that rides no step once she walks: her head's bone bobs) */
        const gone = Wm && Wm.ready && t > tGo ? [Wm.group.position.x, 1.36, Wm.group.position.z] : face;
        let at = aimEase(e1, aimEase(e1, face, gone, smo(sgk(t, tGo, tGo + 1.2))), O_TRAY, kDn * 0.92);
        if (kOut > 0) at = aimEase(e1, at, [0.6, 1.5, 5.2], kOut);
        fLens(lp(isNarrow() ? 50 : 42, isNarrow() ? 44 : 36, sgk(t, O.o2, O.o3)));
        camAt([e1[0] - 0.05 * sgk(t, O.o2, O.o3), e1[1], e1[2]], at);
        return;
      }
      if (t < O.o4) {
        /* O3 · the counter's corner where his wallet always lies, by the calculator — empty; his pockets heard; then his
           bag on the floor at the counter's end */
        const spot = [0.2, top0, COUNTER.z - 0.06], bag = [BAG.x, 0.16, BAG.z];
        const kB = smo(sgk(t, O.o3 + 4.2, O.o3 + 6.0));
        const e2 = [HIS.x + 0.15, 1.55, HIS.z + 0.25];
        fLens(lp(isNarrow() ? 54 : 46, isNarrow() ? 50 : 42, smo(sgk(t, O.o3, O.o3 + 4.0))));
        camAt(e2, aimEase(e2, spot, bag, kB));
        return;
      }
      /* O4 · the note on the glass beside his phone, in his own hand: CALL PONG — pushed in on, the lens narrowing. (v25.2)
         On a phone the phone it says to use is kept in the frame beside it (fit): at the push's end a portrait frame held
         the note alone, the phone off its edge (measured, tools/probes/framecheck.mjs) */
      const note = [NOTE.x, top0 + 0.001, NOTE.z], k = smo(sgk(t, O.o4, O.black));
      const E0 = [HIS.x + 0.3, 1.5, HIS.z + 0.32], e3 = lp3(E0, [NOTE.x - 0.02, 1.36, NOTE.z - 0.3], k);
      /* the note's four corners (its words never cut: held by its middle alone it stood half off a phone's edge at the
         push's end, by photograph) and the phone's middle (masters/v25.2/fitsim.js: the note whole at 0.25-0.81 of the
         frame's half-width at the end, the phone's middle at -0.81) */
      const pb = shop.phone ? shop.phone.base : null, nc = Math.cos(NOTE.ry) * 0.038, ns = Math.sin(NOTE.ry) * 0.038;
      const must = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([a, b]) => [NOTE.x + nc * a + ns * b, top0 + 0.001, NOTE.z - ns * a + nc * b]);
      /* (v25.5, Chad: "at the final last part when camera zooms into the call pong note, the camera bounces several
         times") ON A PHONE THE PUSH IS A PUSH. Measured at a phone's size: to keep his phone in the picture to the
         shot's end, the fit widened the lens the whole way in (50 to 74 degrees, in the jumps he saw), and the note it
         was closing on got SMALLER (139 px wide down to 113) while the eye went from 0.67 m to 0.44 m of it. Now the
         first picture is the one it always was (the note and the phone it says to use: `F0`, the fit of both from
         where the push begins, a constant), the aim slides from there onto the note while the lens narrows as it was
         asked to, and the push ends on the note alone, whole (its four corners held) and twice the size. A desktop's
         frame is as it was */
      if (isNarrow()) {
        const F0 = fit(E0, note, 50, pb ? must.concat([[pb.x, top0 + 0.005, pb.z]]) : must);
        const s = (top0 - E0[1]) / (F0.at[1] - E0[1]);                 // where that first look meets the glass
        const P0 = [E0[0] + (F0.at[0] - E0[0]) * s, top0, E0[2] + (F0.at[2] - E0[2]) * s];
        fitShot(e3, lp3(P0, note, smo(c01(k / 0.7))), lp(50, 36, k), 0, must);
        return;
      }
      if (pb) must.push([pb.x, top0 + 0.005, pb.z]);
      fitShot(e3, note, lp(50, 36, k), lp(42, 28, k), must);
    }

    /* P3 · THE CALL (a film from play, §4.1): his phone on the glass, calling; Pong on its speaker; the dark shop while
       they talk; "Bring him." (v25.5) He stands over his phone for the whole of it: bent to it while it calls (its screen
       read close: "Calling", the ring's pulse, CALL PONG in his own hand beside it), up as Pong answers (the call's own
       clock running, the speaker's button lit), and down to it again at "trust me" */
    const CALL_STAND = [0.45, 1.6, HIS.z + 0.3];                       // where he stands, by his phone
    function callFrame(t) {
      const C = CALL, lit = play.how === 'light';
      fLook(lit ? 'LIT' : 'NIGHT'); fogFilm(1);
      shopAt({ u: 0.42, led: lit ? 1 : 0.28, ceil: lit ? 1 : 0, night: true });
      castVis({ goldman: false, lersi: false, pong: false, mallA: false, mallB: false });
      handFree();
      /* the screen, a function of the film's clock: dark; calling from his tap; the call's own clock from Pong's answer */
      if (t < C.pick) { shop.phoneOn = 0; shop.phoneSecs = null; }
      else { shop.phoneMode = t < C.ans ? 'calling' : 'call'; shop.phoneOn = wallNow() - (t - C.pick) - 0.001; shop.phoneSecs = t < C.ans ? t - C.pick : t - C.ans; }
      const ph = phoneAt(), ax = [Math.sin(PHONE_RY), Math.cos(PHONE_RY)];   // the phone's own length, along the glass
      /* bent over it: a third of a metre back along its own length (its screen upright in the picture), his eye lowered */
      const lean = [ph[0] - ax[0] * 0.3, 1.44, ph[2] - ax[1] * 0.3];
      const up = smo(sgk(t, C.ans + 0.9, C.ans + 2.4));                 // straightening as Pong's first words come
      const back = smo(sgk(t, C.q2c2 - 0.5, C.q2c2 + 0.9)) * (1 - smo(sgk(t, C.pg2c3 + 0.9, C.pg2c3 + 2.6)));   // down to it at "trust me"
      const eye = lp3(lean, CALL_STAND, Math.min(up, 1 - 0.7 * back));
      /* while they talk: the shop in the dark — the stand by the door (flowers now), then round by the shop's left to his
         altar's lamp under Pong's offer, back round and down to the phone at "trust me", up to the door at "I was there
         with my mother", and on the shutter's lit edge for "Bring him." */
      const door = [STAND.x - 0.1, 1.45, STAND.z], altar = [0, 1.55, SHOP.z0 + 0.2];
      let at;
      if (t < C.offer) at = aimEase(eye, ph, door, smo(sgk(t, C.ans + 0.9, C.ans + 3.4)));
      else if (t < C.q2c2 - 0.5) at = aimTurn(eye, door, altar, smo(sgk(t, C.offer + 1.5, C.offer + 6.5)), -1);
      else if (t < C.pg2c3 + 0.9) at = aimTurn(eye, altar, ph, smo(sgk(t, C.q2c2 - 0.5, C.q2c2 + 1.2)), 1);
      else if (t < C.q2c3) at = aimEase(eye, ph, door, smo(sgk(t, C.pg2c3 + 0.9, C.pg2c3 + 3.6)));
      else at = aimEase(eye, door, UNDER, smo(sgk(t, C.q2c3 - 0.2, C.q2c3 + 1.2)));
      /* (v25.0 CP4) a slow push in on each held subject, eased back out as his eyes move on: the stand while he tells
         Pong, the altar under Pong's offer (held still for 7-8 s each, the frame read as frozen) */
      const pushA = smo(sgk(t, C.q2c1 + 2.0, C.offer + 1.0)) * (1 - smo(sgk(t, C.offer + 1.0, C.offer + 3.5)));
      const pushB = smo(sgk(t, C.offer + 6.0, C.q2c2 - 0.5)) * (1 - smo(sgk(t, C.q2c2 - 0.5, C.q2c2 + 1.2)));
      /* on the phone: a narrow lens, pushed in a little while it calls; a phone's screen holds its glass whole (fit) */
      const onPh = Math.max(1 - smo(sgk(t, C.ans + 0.9, C.ans + 2.0)), back);
      const wide = (isNarrow() ? 58 : 50) - 8 * pushA - 10 * pushB;
      const near = (isNarrow() ? 40 : 30) - 3 * smo(sgk(t, 0, C.ans));
      const fl = lp(wide, near, onPh);
      /* on a wide screen the close shot holds CALL PONG, in his own hand, beside the phone that is calling him */
      if (onPh > 0 && !isNarrow()) at = aimEase(eye, at, [lp(ph[0], NOTE.x, 0.42), ph[1], lp(ph[2], NOTE.z, 0.42)], onPh);
      if (onPh > 0.5 && isNarrow()) {
        /* (v25.5, Chad: "It also bounces one time when calling pong, and the camera pans into the phone") THE FIT IS OF
           THE PHONE, not of wherever the pan has got to. v25.2 fitted the turning aim and the phone's four corners
           together: at "trust me" his eyes are a third of the way round from his altar when the fit begins, the two
           stood wide apart, and the lens was thrown out to hold them both and pulled back in as the pan arrived
           (measured on a phone: 45 degrees to 70 and back to 37 in under a second). Fitted on the phone itself, the
           lens only ever narrows onto it, and the pan is eased onto that aim */
        const Fp = fit(eye, ph, fl, phoneCorners()), w = smo(sgk(onPh, 0.5, 0.95));   // eased into the fit and out of it
        fLens(lp(fl, Fp.fl, w)); camAt(eye, aimEase(eye, at, Fp.at, w));
        return;
      }
      fLens(fl);
      camAt(eye, at);
    }

    /* THE VISIT (§4.2, a film): the next evening, the shutter lifted for them; the Lersi master looks along the cases and
       up at the altar, and wais the Buddha before anyone; Pong's word; "New shop... tired owner"; his mat laid */
    const V_EYE = [-0.95, 1.62, -2.2];                                   // he waits behind the counter's left end, his altar to his right
    const LC_STANDS = { x: 0, z: -0.35 };                                // where Lersi Chin stops, before the counter
    /* (v25.3) how far he bows into a wai at his brow, standing (the visit) and sitting (the clearing): his back, his
       neck and his head, each its share, set looking at him from beside him */
    const VW = { lean: 0.26, neck: 0.16, bow: 0.28 }, SW = { lean: 0.16, neck: 0.14, bow: 0.26 };
    const PG_STANDS = { x: 0.9, z: -0.25 };
    const _lv = new THREE.Vector3();
    /* (v25.5, Chad: "lersi chin and pong stand for too long at the shop entrance before walking into the shop in the
       cutscene, just start with them walking into the shop. No need to stand and wait outside") THEY ARE WALKING IN AS THE
       BLACK LIFTS: each walk begins before the film's first frame, out in the corridor, so both are in their stride when
       the picture comes (Pong a pace or two ahead, as the one who knows the shop), the shutter's last rattle under the
       black and its curtain coming to rest over them. Each walks a smooth curve at a pace (walkPace: Pong 0.85 m a
       second, the master 0.72) and comes to rest where he stood before. His eyes follow the master on a point of his
       body that does not bob (his head's bone, which the lens followed, rides every step) */
    const V_IN_P = walkCurve([[0.5, 4.6], [0.6, 2.0], [0.85, 0.4], [PG_STANDS.x, PG_STANDS.z]]);
    const V_IN_L = walkCurve([[-0.35, 5.2], [-0.32, 3.4], [-0.15, 0.9], [LC_STANDS.x, LC_STANDS.z]]);
    const V_PACE = { p: 0.85, l: 0.72 };
    function visitFrame(t) {
      const V = VISIT_T;
      fLook('VISIT'); fogFilm(1);
      shopAt({ u: lp(0.66, 0.86, smo(sgk(t, 0, 1.7))), led: 0.9, ceil: 0, night: true });
      castVis({ goldman: false, mallA: false, mallB: false, lersi: true, pong: true });
      const L = cast.lersi, P = cast.pong;
      const matT = V.mat + 2.1;                                          // the cut to him seated
      props.lcThings.visible = t >= V.mat;
      for (const f of props.flames) f.material.opacity = 0;
      if (t < V.mat) {
        /* in under the shutter: Pong first, then Lersi Chin, unhurried; his eyes along the cases as he comes */
        const tPin = V.in + 5.0, tLin = V.altar - 0.2;                   // when each has come to rest (as before)
        if (P && P.ready) {
          const A = walkPace(P, V_IN_P, t, tPin - walkArc(0, 0, pathLen(V_IN_P), V_PACE.p)[2], V_PACE.p);
          /* he turns to the one whose shop it is as he stops, over most of a second */
          if (A[1] <= 0.02 && t >= tPin) { const r0 = headAt(V_IN_P, A[0]); P.group.rotation.y = r0 + angTo(r0, faceTo(PG_STANDS.x, PG_STANDS.z, V_EYE[0], V_EYE[2])) * ezk(t, tPin, tPin + 0.9); }
          if (t > V.intro - 0.3 && t < V.turn + 0.4) gaze(P, true); else { P.lookAt = t > V.in + 5 ? (L && L.head) || null : null; P.neck = null; }
        }
        if (L && L.ready) {
          const A = walkPace(L, V_IN_L, t, tLin - walkArc(0, 0, pathLen(V_IN_L), V_PACE.l)[2], V_PACE.l);
          /* he comes to rest facing the altar; at the turn, to the one whose shop it is */
          if (A[1] <= 0.02 && t >= tLin) { const r0 = headAt(V_IN_L, A[0]), r1 = r0 + angTo(r0, Math.PI) * ezk(t, tLin, tLin + 0.8);
            L.group.rotation.y = r1 + angTo(r1, faceTo(LC_STANDS.x, LC_STANDS.z, V_EYE[0], V_EYE[2])) * smo(sgk(t, V.turn - 0.3, V.turn + 0.9)); }
          /* his look: the left cabinet, the right, then up to the Buddha; at the turn, the one whose shop it is (v25.2: each
             eased over most of a second; v25.0 jumped from one to the next in a frame) */
          L.look = 0;
          const A0 = V.altar, I0 = V.intro;
          /* (v25.5) while he walks his neck turns a glance's worth (0.7): at 1.1 the look took his chest round with it,
             and he came in shoulder first with his arms swinging wide (photographed); the full turn once he stands */
          lcLook(t, [[V.in + 2.2, V.in + 2.9, [-2.0, 1.3, 0.9]], [V.in + 4.0, V.in + 4.8, [2.0, 1.25, 0.2]],
                     [A0 - 1.3, A0 - 0.4, BUDDHA_AT], [A0 + 0.9, A0 + 1.6, null], [I0 - 1.5, I0 - 0.8, BUDDHA_AT],
                     [V.turn - 0.3, V.turn + 0.5, 'lens']], lp(0.7, 1.1, ezk(t, A0 - 1.3, A0 - 0.4)));
          /* (v25.2) his wai to the Buddha; a nod to the one whose shop it is as he turns to him (v25.0 gave a full wai there
             and another a breath later: an elder greeting first, and twice); and his answer to the client's wai, at his
             chest, his head inclined, held into the cut. (v25.3) The wai as it is made: his hands joined before his chest,
             then raised to his brow as his back, his neck and his head bow to MEET them (the thumbs to the brow, his eyes
             lowered), held, and down the same way, his eyes back up to the Buddha. v25.2 stood his hands before an upright
             face (Chad, with it on his phone: "Look at how ridiculous this looks"). Each change over a human time */
          const wH = handKeys(t, [[A0 + 0.1, A0 + 0.9, W_CHEST], [A0 + 1.0, A0 + 1.8, W_BROW], [I0 - 1.6, I0 - 0.9, W_CHEST],
                                  [I0 - 0.85, I0 - 0.1, null], [V.wai + 0.25, V.wai + 1.15, W_CHEST]]);
          const lean = keyed(t, 0, [[A0 + 1.0, A0 + 1.8, VW.lean], [I0 - 1.6, I0 - 0.9, 0], [V.wai + 0.5, V.wai + 1.25, 0.07]]);
          const neck = keyed(t, 0, [[A0 + 1.0, A0 + 1.8, VW.neck], [I0 - 1.6, I0 - 0.9, 0], [V.wai + 0.5, V.wai + 1.25, 0.08]]);
          lcBow(L, keyed(t, 0, [[A0 + 1.0, A0 + 1.8, VW.bow], [I0 - 1.6, I0 - 0.9, 0],
                                [V.turn + 0.3, V.turn + 0.75, 0.16], [V.turn + 0.85, V.turn + 1.45, 0], [V.wai + 0.5, V.wai + 1.2, 0.16]]));
          lcBody(wH || lean ? { R: wH, L: wH, lean, neck } : null);
        }
        /* his own wai to the master (one wai; three bows are only for the Buddha) */
        waiAt(smo(sgk(t, V.wai, V.wai + 0.5)) * (1 - smo(sgk(t, V.wai + 1.3, V.mat - 0.05))));
        let at;
        /* the two of them coming in (the point between them, toward the master), then the master alone as Pong steps
           aside: a point of his body 1.42 m up, which rides no step; eased up onto his head once he stands (the altar,
           his wai) */
        const bL = L && L.ready ? [L.group.position.x, 1.42, L.group.position.z] : [0, 1.42, 2.0];
        const bP = P && P.ready ? [P.group.position.x, 1.42, P.group.position.z] : bL;
        if (t < V.intro) { const both = lp3(bP, bL, 0.62), kL = smo(sgk(t, 1.8, 4.6)), kH = smo(sgk(t, tLin - 0.6, tLin + 0.8));
          const hL = headOf(L, bL).slice(); hL[1] = Math.max(bL[1], hL[1] - 0.15);
          at = aimEase(V_EYE, aimEase(V_EYE, both, bL, kL), hL, kH); }
        if (t >= V.intro && t < V.turn) at = aimEase(V_EYE, headOf(L, [0, 1.5, -0.35]), headOf(P, [PG_STANDS.x, 1.6, PG_STANDS.z]), smo(sgk(t, V.intro - 0.2, V.intro + 0.9)));
        if (t >= V.turn) at = aimEase(V_EYE, headOf(P, [PG_STANDS.x, 1.6, PG_STANDS.z]), faceOf(L, [0, 1.55, -0.35]), smo(sgk(t, V.turn - 0.1, V.turn + 1.0)));
        const fl = t < V.turn ? (isNarrow() ? 52 : 44) : lp(isNarrow() ? 52 : 44, isNarrow() ? 44 : 36, smo(sgk(t, V.turn, V.wai)));
        /* (v25.2) Pong's word, introducing him: on a phone both their faces held in the frame (fit), eased in and out of it
           (the lens on Pong as he spoke had the master off the frame's edge; measured, tools/probes/framecheck.mjs) */
        const wF = ezk(t, V.intro - 0.5, V.intro + 0.3) * (1 - ezk(t, V.turn + 0.1, V.turn + 0.9));
        if (wF > 0 && isNarrow()) {
          const F = fit(V_EYE, at, fl, [faceOf(L, [0, 1.55, -0.35]), faceOf(P, [PG_STANDS.x, 1.6, PG_STANDS.z])]);
          fLens(lp(fl, F.fl, wF)); camAt(V_EYE, aimEase(V_EYE, at, F.at, wF));
          return;
        }
        fLens(fl);
        camAt(V_EYE, at);
        return;
      }
      waiAt(0);
      if (t < matT) {
        /* the mat unrolled on the shop floor before the counter, from where he stands at its head */
        if (L && L.ready) { fPut(L, 0, MAT.z - MAT.d / 2 - 0.2, 0, { y: 0, seated: false }); L.lookAt = _lv.set(0, 0, 0.6); L.lookK = 1; L.neck = null; lcBow(L, 0.35); }
        lcBody(null);
        if (P && P.ready) { fPut(P, PG_STANDS.x, PG_STANDS.z, faceTo(PG_STANDS.x, PG_STANDS.z, 0, 0.3), { y: 0, seated: false }); P.lookAt = null; }
        propsAt({ mat: smo(sgk(t, V.mat + 0.15, V.mat + 1.9)) });
        for (const o of [props.bowl, props.cloth, props.khan, props.yaam]) if (o) o.visible = false;
        const e = [-0.95, 1.6, 1.4];
        shot(e, [0, 0.0, lp(-0.6, 0.6, smo(sgk(t, V.mat, matT)))], 58, 50);
        return;
      }
      /* seated now, his things set out; Pong on his stool; the master looks up at him */
      propsAt({ mat: 1 });
      for (const o of [props.bowl, props.cloth, props.khan, props.yaam]) if (o) o.visible = true;
      lcSeated(); pongSeated(); lcBlockOn(true);
      /* (v25.2) his eyes on his things, then up to the client, eased */
      if (L) { lcBow(L, 0); lcLook(t, [[matT - 0.01, matT, [LC.x, 0.1, LC.z + 0.33]], [matT + 0.45, matT + 1.15, 'lens']], 1.1); }
      if (P) { P.lookAt = L && L.head ? L.head : null; P.neck = null; }
      const e = [-0.95, 1.62, 1.25];
      shot(e, LC_HEAD(), 54, 46);
    }

    /* P6 · THE EXAMINATION (§4.3, watched): his wrist, the ordinary questions, the doctor; the stillness; the piece by the
       door; a temple for it; what he believes, and what he did not say */
    /* (v25.2) HIS BODY in the examination, one choreography on the film's clock apart from the shots (examShots): both his
       hands to the client's wrist, his right over it and his left under, as he leans in from the waist to meet it, his
       eyes down to it and back up to the client's face; the stillness, his head lowered and his back easing over; his
       look to the shelf by the door. (v25.3) The piece comes back to him on both his upturned palms (a thing honoured
       is carried so; v25.2 pinched it between pressed hands, where it could not be seen): he raises it before his brow
       and bows his head to it, lowers it to speak of it, and bends to the clean cloth with it in both hands; the cut
       lays it there. Each change over a human time */
    /* (v25.5, Chad: "When lersi chin says give me your hand and asks questions, his arms clips into his robe") THE WRIST
       IS MET OVER HIS LAP, NOT INSIDE IT. Measured on his seated body (every point of him that is not arm, in 5 cm cells):
       the cloth over his crossed legs stands 0.36-0.40 m high from 0.15 to 0.37 m before him, and v25.0 sent his hands
       to a point 0.30 m high and 0.40 m out: both forearms went through his lap from the elbow down (by photograph,
       from the lens and from his side). The wrist is met 0.47 m up and 0.44 m out, past the lap's edge; he leans a
       little further in to it, his elbows out to his sides (the pole: with a reach's own, down and back, a bent elbow
       drops into the lap), so his forearms pass a hand's breadth over the cloth. And the picture closes on him while he
       has it: the look lifted and the lens a little tighter, so his hands (on a wrist the film never draws) stay
       under the frame's foot on a phone and a desktop both, as they did when the point was lower */
    const EX_WR = [LC.x + 0.02, 0.47, LC.z + 0.44];                    // the client's wrist, met between them, under the frame's foot
    const EXH = { lean: 0.4, up: 0.09, tight: [8, 5], pole: [0.85, -0.35, -0.2] };   // the hold: his lean in to it; the look's lift (metres at his head) and the lens's tightening (degrees: phone, desktop) while it lasts; his elbows' side
    /* (v25.5, Chad: "when the player takes down the item from the shelf, there is no need to have his hand try to take it
       down as the animation just looks awkward, just show the item being removed from the shelf and go straight to the
       next scene/frame") THE PIECE OFF ITS SHELF: his look holds on it where it stands; a blink (the film's own, a sixth
       of a second: examFilm) and the shelf is empty, its red gone with it; then the cut to it on the master's palms.
       EX_TAKE the blink, EX_BACK the cut, both from `fetch` and written beside the film's times (his rising, his walk to
       it, his hand's reach and grip, and his way back were 3.9 s of it) */
    function examBody(t) {
      const X = EXAM, L = cast.lersi; if (!L || !L.ready) return;
      const tBack = X.fetch + EX_BACK, tCloth = X.lc2e8 + SECS.lc2e8 * 0.86;
      const pl2 = pieceClone('lc'), c0 = props.cloth.position, shelf = shelfPiece();
      const toCloth = { cup: [c0.x + 0.12, props.clothTop + 0.15, c0.z + 0.07] };
      /* (v25.4) a tall piece is carried lower before his chest, by nine tenths of what it stands over the 8 cm the tray
         was set for: on his palms at his chest the 19 cm Nang Kwak stood before his mouth through the line he says of
         it (photographed) */
      const pcH = (props.pieces[play.piece] && props.pieces[play.piece].userData.fitY) || 0.08;
      const cChest = pcH > 0.09 ? { cup: 'chest', dy: -0.9 * (pcH - 0.08) } : C_CHEST;
      /* (the piece is back with him 2.3 s before he speaks of it: raised over 0.9 s, held a breath, lowered over 0.8 s as
         his head comes up; the raise and the lowering never overlap, or the hands would jump from one to the other) */
      /* (v25.4) AND HE SITS BACK UP. Since v25.2 nothing took his hands, his lean and his turn off the cloth once the
         piece was laid: he spoke "According to my practice, I believe..." and every line after it bent down to his right
         over the cloth, his hands still out to it (mine; found photographing the cloth's shot for the bigger piece). His
         hands come home and his back straightens over a second from the cut, done before he speaks */
      const two = [[tBack - 0.01, tBack, cChest], [tBack + 0.3, tBack + 1.2, C_BROW], [X.lc2e8 - 0.8, X.lc2e8, cChest],
                   [tCloth - 1.3, tCloth - 0.1, toCloth], [tCloth + 0.1, tCloth + 1.1, null]];
      const R = handKeys(t, [[X.lc2e1 + 0.3, X.lc2e1 + 1.45, { palm: [EX_WR[0] - 0.01, EX_WR[1] + 0.035, EX_WR[2]], aim: 'down', pole: EXH.pole }],
                             [X.lc2e6 - 0.1, X.lc2e6 + 1.0, null]].concat(two));
      const Lh = handKeys(t, [[X.lc2e1 + 0.45, X.lc2e1 + 1.6, { palm: [EX_WR[0] + 0.03, EX_WR[1] - 0.035, EX_WR[2] - 0.01], aim: 'under', pole: EXH.pole }],
                              [X.lc2e6 - 0.2, X.lc2e6 + 0.85, null]].concat(two));
      const lean = keyed(t, 0, [[X.lc2e1 + 0.2, X.lc2e1 + 1.4, EXH.lean], [X.lc2e6 - 0.1, X.lc2e6 + 1.0, 0],
                                [X.still + 0.4, X.still + 2.0, 0.08], [X.eyes - 1.2, X.eyes - 0.2, 0],
                                [tBack + 0.4, tBack + 1.2, 0.1], [X.lc2e8 - 0.8, X.lc2e8, 0.03], [tCloth - 1.3, tCloth - 0.1, 0.4],
                                [tCloth + 0.15, tCloth + 1.25, 0]]);
      const side = keyed(t, 0, [[tCloth - 1.3, tCloth - 0.1, -0.14], [tCloth + 0.15, tCloth + 1.25, 0]]);
      const twist = keyed(t, 0, [[tCloth - 1.3, tCloth - 0.1, -0.28], [tCloth + 0.15, tCloth + 1.25, 0]]);
      const neck = keyed(t, 0, [[tBack + 0.4, tBack + 1.2, 0.16], [X.lc2e8 - 0.8, X.lc2e8, 0]]);
      const hold = t >= tBack && t < tCloth ? pl2 : null;
      if (pl2) pl2.visible = !!hold;
      lcBody({ R, L: Lh, lean, side, twist, neck, hold, holdBy: 'cup', holdAt: PIECE_FIT[play.piece] && PIECE_FIT[play.piece].round ? palmsMiddle : null });
      lcLook(t, [[X.lc2e1 + 0.35, X.lc2e1 + 1.1, EX_WR], [X.lc2e1 + 1.6, X.lc2e1 + 2.3, 'lens'],
                 [X.still - 0.3, X.still + 0.6, null], [X.eyes - 0.1, X.eyes + 0.9, shelf],
                 [tBack - 0.01, tBack, [LC.x, 0.5, LC.z + 0.28]], [tBack + 0.3, tBack + 1.0, null], [X.lc2e8 - 0.5, X.lc2e8 + 0.2, 'lens'],
                 [tCloth - 1.3, tCloth - 0.5, [c0.x, c0.y, c0.z]], [X.believe - 0.01, X.believe, 'lens']], 1.1);
      lcBow(L, keyed(t, 0, [[X.still + 0.2, X.still + 1.5, 0.24], [X.eyes - 1.0, X.eyes - 0.15, 0],
                            [tBack - 0.01, tBack, 0.1], [tBack + 0.4, tBack + 1.2, 0.34], [X.lc2e8 - 0.8, X.lc2e8, 0],
                            [tCloth - 1.2, tCloth - 0.3, 0.12], [X.believe - 0.01, X.believe, 0]]));
      L.look = 1;
    }
    function examFrame(t) { examShots(t); examBody(t); }
    function examShots(t) {
      const X = EXAM;
      fLook('VISIT'); fogFilm(1);
      shopAt({ u: 0.42, led: 0.9, ceil: 0, night: true });
      castVis({ goldman: false, mallA: false, mallB: false, lersi: true, pong: true });
      lcSeated(); pongSeated();
      props.lcThings.visible = true; propsAt({ mat: 1 });
      const L = cast.lersi, P = cast.pong;
      if (P) { P.lookAt = L && L.head ? L.head : null; P.neck = null; }
      /* (v25.5) the white light round him through the stillness, gone as his eyes open on the piece */
      auraAt(0, ezk(t, X.still + 0.5, X.still + 2.4) * (1 - ezk(t, X.eyes - 0.5, X.eyes + 0.6)), t);
      const shelf = shelfPiece();
      /* the piece: on the shelf until it is taken; in the master's hands; on the cloth */
      const tTake = X.fetch + EX_TAKE, tBack = X.fetch + EX_BACK, tCloth = X.lc2e8 + SECS.lc2e8 * 0.86;
      pieceShow(t < tTake); clothPiece(t >= tCloth);
      handFree();
      if (t < X.still) {
        /* the wrist taken (his hands out of the frame's foot) while the questions are asked (his body: examBody) */
        const down = smo(sgk(t, X.q2e3 - 0.1, X.q2e3 + 0.3)) * (1 - smo(sgk(t, X.lc2e5 - 0.3, X.lc2e5 + 0.3)));   // "...Yes." — his eyes drop
        const at = LC_HEAD(); at[1] -= 0.25 * down;
        const hold = smo(sgk(t, X.lc2e1 + 0.3, X.lc2e1 + 1.6)) * (1 - smo(sgk(t, X.lc2e6 - 0.2, X.lc2e6 + 1.0)));   // while he has the wrist
        at[1] += EXH.up * hold;
        fLens(lp(isNarrow() ? 52 : 44, isNarrow() ? 48 : 40, smo(sgk(t, 0, X.still))) - EXH.tight[isNarrow() ? 0 : 1] * hold);
        camAt(KN_EYE, at);
        return;
      }
      if (t < X.eyes) {
        /* "Now, quiet." — his eyes shut, his head lowered: the stillness, pushed in on; over his shoulder, the altar's
           Buddha; back */
        const k = smo(sgk(t, X.still + 1.2, X.still + 3.6)) * (1 - smo(sgk(t, X.eyes - 2.0, X.eyes - 0.2)));
        fLens(lp(isNarrow() ? 48 : 40, isNarrow() ? 42 : 34, smo(sgk(t, X.still, X.eyes))));
        /* (v25.5) his eyes rise a little toward the Buddha over him and stay on the master: the light round him is this
           shot (they went most of the way up to the altar, and all of him but the top of his head left the picture) */
        camAt(KN_EYE, aimEase(KN_EYE, LC_HEAD(), BUDDHA_AT, k * 0.26));
        return;
      }
      if (t < tBack) {
        /* his eyes open on the door: "That one... from there?" — the look follows his, round to the shelf by the door,
           and holds there: the piece on its shelf, then (the blink) the shelf without it */
        const k = smo(sgk(t, X.lc2e7 + 0.4, X.lc2e7 + 2.2));
        /* (v25.1 F11) narrowed onto the shelf as the look arrives: at 40/32 the piece was a few pixels on a dark bracket,
           2.8 m off and seen from below (photographed, both screens); (v25.5) and a breath further in while it is held */
        const push = smo(sgk(t, X.fetch - 0.4, tBack));
        fLens(lp(isNarrow() ? 50 : 42, isNarrow() ? 22 : 17, smo(sgk(t, X.q2e5, X.fetch))) - (isNarrow() ? 2 : 1.5) * push);
        camAt(KN_EYE, aimTurn(KN_EYE, LC_HEAD(), shelf, k, 1));
        return;
      }
      /* back on the mat: the piece in the master's hands, wai'd; "a temple" — and set on the clean cloth */
      if (t < tCloth) {
        fLens(isNarrow() ? 50 : 42);
        camAt(KN_EYE, LC_HEAD());
        return;
      }
      if (t < X.believe) {
        /* the piece on the cloth, the candles' light on it */
        const c0 = props.cloth.position;
        /* (v25.0 CP7) closer: the piece, not his bag */
        /* (v25.4) from the cloth's OUTER side, and holding the whole piece: the lens stood between the cloth and his
           knee, so his flat hand lay across the frame in front of the piece with his robe filling its right half, and
           aimed at the cloth it cut the bigger piece off at the top (photographed). From his far right the piece stands
           clear on its cloth, his hands leaving the frame's edge as he sits back; the piece's own box is what the shot
           must hold, whichever piece and whichever screen */
        const pc = props.pieces[play.piece], must = [];
        let mid = [c0.x, c0.y + 0.03, c0.z];
        if (pc && pc.visible) { pc.updateWorldMatrix(true, true); _pbb.setFromObject(pc);
          const a = _pbb.min, b = _pbb.max; mid = [(a.x + b.x) / 2, (a.y + b.y) / 2, (a.z + b.z) / 2];
          for (const x of [a.x, b.x]) for (const z of [a.z, b.z]) must.push([x, b.y + 0.015, z], [x, a.y, z]); }
        fitShot([c0.x - 0.36, 0.4, c0.z + 0.52], mid, 36, 30, must);
        return;
      }
      /* "According to my practice, I believe..." — pushed in; "By him?" — "I didn't say that. I said on you." */
      fLens(lp(isNarrow() ? 50 : 42, isNarrow() ? 42 : 34, smo(sgk(t, X.believe, X.q2e6))));
      camAt(KN_EYE, LC_HEAD());
    }

    /* P7 · THE CLEARING (§4.3, watched; unskippable the first time): his hands together, his eyes down; the homage to his
       teachers; Namo tassa three times; the three Sakkatvā verses (captioned, the Pali over its meaning); the fog lifting
       under the second and third; the water; the advice. (v25.3, Chad, 10 Nov 2026: "There is no need for lersi chin to
       sprinkle water with the leaf thing and no need for the tieing of string": the leaves' flicks, their drops and the
       thread at his wrist are out, with the bundle and the skein that served only them) */
    /* THE CLEARING, HIS BODY: one choreography on the film's clock apart from the shots (clearShots). (v25.2, Chad: "his
       wai pose, he spraying water and taking water bowl, etc is all extremely bad ... the actions are all very abrupt and
       sudden and not natural") (v25.3, the same day, of v25.2's answer: "i find it unacceptable that you find his poses
       natural, it clearly is not") The homage: his hands joined before his chest, raised to his brow as his back, his neck
       and his head bow to meet them, held a breath, and down to his chest for Namo tassa; lower, at the foot of his
       chest, for the long verses (hands held at the brow through a seventeen-second chant are a pose, not a man). The
       water: his joined hands part and go down to the bowl as he bends to it, each palm under the curve of its belly; he
       lifts it (up, then out), holds it out and tips it to the client, brings it back (in, then down), sets it on the
       mat and sits up, his hands home to his lap. His look and his head go with each */
    /* (v25.5, Chad: "When lersi chin hands the water for player to drink, his arms and hands cuts through his robes in a
       clipping manner, improve that please") HE NO LONGER BENDS TO THE MAT. To put his palms under a bowl standing on the
       mat he folded 39 degrees over his own lap (v25.2's LEAN_MAT, 0.68): the robe across his knees stretched into a
       sheet, his forearms came out through it and a fold of it dipped into the bowl; with less bend his hands cannot
       reach under it at all (9 to 11 cm short at 0, 0.15 and 0.3, measured). So the bowl is taken up and set down where
       the picture does not see it: his eyes go down and his hands leave the frame's foot (the lens close on his face:
       clearShots), the bowl comes up into the picture already in his palms, from his lap (CB_LAP), he holds it out
       (CB_OFF) with the small lean an offering has, and it goes back the same way. The bowl itself changes places on
       frames that cannot see it (v24.12): from the mat to his lap at W + 0.35, and home at W + 5.2 */
    const CB_OFF = [LC.x, 0.44, LC.z + 0.4];                           // the bowl held out to the client
    const CB_LAP = [LC.x, 0.27, LC.z + 0.24];                          // and in his palms over his lap, well under the frame's foot (at 0.34 its rim stood on the frame's edge as it changed places: photographed)
    const CB_T = { up: 0.35, down: 5.2 };                              // from `water`: in his hands from, and home again at
    /* the bowl: on the mat; in his palms over his lap; held out; tipped to him; brought back (placed before the shots,
       which look at it) */
    function clearBowl(t) {
      const K = CLEARF, W = K.water;
      const B0 = props.bowl.userData.home || (props.bowl.userData.home = props.bowl.position.clone());
      if (t < W + CB_T.up || t >= W + CB_T.down) { props.bowl.position.copy(B0); props.bowl.rotation.x = 0; return; }
      const out = ezk(t, W + 0.95, W + 2.0) * (1 - ezk(t, W + 3.95, W + 4.95));
      props.bowl.position.set(lp(CB_LAP[0], CB_OFF[0], out), lp(CB_LAP[1], CB_OFF[1], out), lp(CB_LAP[2], CB_OFF[2], out));
      props.bowl.rotation.x = 0.35 * ezk(t, W + 2.25, W + 2.9) * (1 - ezk(t, W + 3.4, W + 3.95));
    }
    function clearBody(t) {
      const K = CLEARF, L = cast.lersi, W = K.water, H0 = K.homage;
      if (!L || !L.ready) return;
      const lap = [CB_LAP[0], CB_LAP[1] - 0.04, CB_LAP[2]];
      /* (v25.5, 11 Nov) the mantra is said with his hands joined before his chest, where the light gathers between his
         palms and the kneeling eye sees it under his face (the long verses were chanted with them lower, at the foot
         of his chest: `W_LOW`, no longer asked for here) */
      const h = handKeys(t, [[H0 + 1.3, H0 + 2.1, W_CHEST], [H0 + 2.2, H0 + 3.0, W_BROW], [H0 + 4.0, H0 + 4.8, W_CHEST],
                             [W + 0.3, W + 1.2, H_BOWL], [W + 5.0, W + 6.0, null]]);
      const lean = keyed(t, 0, [[H0 + 2.2, H0 + 3.0, SW.lean], [H0 + 4.0, H0 + 4.8, 0.03],
                                [W + 0.6, W + 1.9, 0.3], [W + 4.0, W + 5.2, 0]]);
      const neck = keyed(t, 0, [[H0 + 2.2, H0 + 3.0, SW.neck], [H0 + 4.0, H0 + 4.8, 0.05], [W - 0.1, W + 0.6, 0.1], [W + 1.1, W + 1.8, 0],
                                [W + 4.2, W + 4.8, 0.1], [W + 5.2, W + 5.9, 0]]);
      lcBody({ R: h, L: h, lean, neck });
      /* (v25.5) his head a little bowed over his hands through the mantra; up, his eyes on him, as he sends it */
      lcLook(t, [[K.fly - 0.5, K.fly + 0.2, 'lens'], [W - 0.2, W + 0.5, lap], [W + 1.2, W + 1.9, 'lens'], [W + 4.1, W + 4.7, lap],
                 [W + 5.2, W + 5.9, 'lens']], 1.1);
      lcBow(L, keyed(t, 0.08, [[H0 + 2.2, H0 + 3.0, SW.bow], [H0 + 4.0, H0 + 4.8, 0.1], [K.om - 0.2, K.om + 1.0, 0.13],
                               [K.fly - 0.5, K.fly + 0.2, 0.02],
                               [W - 0.1, W + 0.6, 0.14], [W + 1.2, W + 1.9, 0], [W + 4.1, W + 4.7, 0.12], [W + 5.2, W + 5.9, 0]]));
      L.look = 1;
    }
    const W_TIGHT = [36, 30];                                          // the lens close on his face (a phone's, a desktop's)
    function clearFrame(t) { clearBowl(t); clearShots(t); clearBody(t); }
    function clearShots(t) {
      const K = CLEARF;
      /* (v25.5, 11 Nov) THE CLEARING IS THE WHITE. The grey thins a little as the light gathers and is blown off as it
         comes at him; under the white (a tenth of a second into it, the picture all white) the room becomes the room
         cleared: its colour and its warmth back, the fog gone, the lens where the water's shot begins. v25.0 lifted
         the grey over twenty seconds of the second and third verses */
      const gk = gathered(t), cut = K.flash + 0.1, lift = t < cut ? 0 : 1;
      fogFilm(lift ? 0 : (1 - 0.22 * gk) * (1 - ezk(t, K.fly + 0.45, K.flash - 0.06)));
      fLook(lift ? 'CLEAR' : 'VISIT', 0);
      shopAt({ u: 0.42, led: lp(0.9, 1, lift), ceil: 0, night: true });
      castVis({ goldman: false, mallA: false, mallB: false, lersi: true, pong: true });
      lcSeated(); pongSeated();
      props.lcThings.visible = true; propsAt({ mat: 1 });
      pieceShow(false); clothPiece(true);
      const L = cast.lersi, P = cast.pong;
      if (P) { P.lookAt = L && L.head ? L.head : null; P.neck = null; }
      /* the candles and the incense lit for the homage */
      const fl = smo(sgk(t, K.homage + 0.4, K.homage + 1.4));
      for (const f of props.flames) f.material.opacity = fl;
      /* (v25.5) the light round him from the chant's first words to the water given, gone as he sits back (white, and
         quiet, since 11 Nov: gold is Grandmaster Pho's) */
      auraAt(0, ezk(t, K.om - 0.3, K.om + 3.0) * (1 - ezk(t, K.water + 4.3, K.water + 5.8)), t);
      /* his own hands: together from "Hands together", down for the water */
      const handsK = smo(sgk(t, K.lc2k0 + 0.6, K.lc2k0 + 1.4)) * (1 - smo(sgk(t, K.water - 0.6, K.water)));
      waiAt(handsK);
      /* (v25.0 CP13) his own hands are drawn only while a clasp holds them: hidden in every other frame, so a seek lands
         on the same picture */
      if (handsK <= 0.001 && FL.api && FL.api.handsRoot) FL.api.handsRoot.visible = false;
      /* (his eyes "closed" are the film's own fade track, dimmed and never black: clearFilm) */
      /* the master: his wai to his teachers over the tray, the chant, the bowl */
      let at = LC_HEAD();
      if (t < K.water) {
        /* (his body: clearBody) the verses chanted with his hands joined at the foot of his chest, over the bowl: joined
           higher, his fingers stood before his face from the kneeling eye (v25.0 CP13, by photograph) */
        /* his eyes down on his hands and the mat (the tray, the candles' light at the top of the frame); up as it lifts */
        const down = [CL.x, 0.25, CL.z - 0.65];                         // (v25.2) with the tray, 10 cm nearer him than v25.0's
        /* (v25.0 CP7) not one still frame for forty seconds: a slow push in on the tray's candles under Namo tassa, his
           eyes drawn up to the master's joined hands as the verses begin (v25.3: the leaves are gone), up to his face as
           the grey lifts; a breath under it all */
        /* (v25.5, 11 Nov) THE MANTRA'S SHOT: his eyes come up from the tray as the mantra begins, to the master's joined
           hands and his face over them (the light between his palms at the picture's middle, his face over it, both
           whole on a phone and a desktop), and the lens closes on them slowly through the three sayings; held as the
           light comes. Under the white the lens is the cleared room's, on his face, and closes to the water's as before */
        const eyeNow = [KN_EYE[0], KN_EYE[1] + 0.004 * Math.sin(t * 2 * Math.PI / 4.6), KN_EYE[2]];
        const toHands = smo(sgk(t, K.om - 0.7, K.om + 1.9)), push = smo(sgk(t, K.homage + 1.0, K.om)) * (1 - toHands);
        const face = LC_HEAD(), hands = [LC.x, face[1] - 0.2, LC.z + 0.2];
        const closeIn = ezk(t, K.om + 1.2, K.fly);
        let aim, fl;
        if (!lift) {
          aim = aimEase(KN_EYE, down, [lp(hands[0], face[0], 0.42), lp(hands[1], face[1], 0.42), lp(hands[2], face[2], 0.42)], toHands);
          /* (a desktop's frame is short: closed in as far as a phone's, his topknot left its top as his head came up) */
          fl = (isNarrow() ? 54 : 46) - 8 * push - (isNarrow() ? 9 : 4.5) * toHands * closeIn - 1.5 * toHands;
        } else {
          aim = face;
          fl = lp(isNarrow() ? 50 : 42, isNarrow() ? W_TIGHT[0] : W_TIGHT[1], ezk(t, K.water - 1.6, K.water + 0.25));
        }
        fLens(fl); camAt(eyeNow, aim);
        powerAt(t, eyeNow);
        return;
      }
      if (t < K.advice) {
        /* "Drink. A little." — the bowl lifted in both his palms and held out to him; he leans in to it; a sip; the bowl
           set down, the master sitting up (his body and the bowl: clearBody, clearBowl). (v25.2) The bowl is where his hands
           can hold it out, half a metre before him, so the client leans in to drink, and the lens goes with him. (v25.3)
           ONE shot from the water to the advice: his eyes go to the bowl with it and come back to the master's face as he
           sits up, where the advice's own lens takes over with no jump (the leaves' shot and the thread's stood between
           them; without them a cut from his face to his face a degree wider would have read as a fault) */
        /* (v25.5) The lens is close on his face while the bowl is taken up and while it is put back (his eyes go down to
           it and his hands leave the frame's foot: the bowl changes places under the frame, clearBowl), and opens to the
           bowl only while it is in his palms: coming up from his lap, held out, tipped, drawn back */
        const W = K.water, lean = ezk(t, W + 1.1, W + 2.1) * (1 - ezk(t, W + 3.6, W + 4.5));
        const e = [KN_EYE[0], KN_EYE[1] - 0.14 * lean, KN_EYE[2] - 0.3 * lean], bw = props.bowl.position;
        const open = ezk(t, W + 1.0, W + 1.9) * (1 - ezk(t, W + 3.95, W + 4.75));
        const tight = isNarrow() ? W_TIGHT[0] : W_TIGHT[1], wide = isNarrow() ? 54 : 46, rest = isNarrow() ? 52 : 44;
        const fl0 = lp(wide, tight, ezk(t, W - 1.6, W + 0.25));                       // (the chant's shot hands over mid-ease)
        fLens(lp(lp(fl0, wide, open), rest, ezk(t, W + CB_T.down + 0.05, K.advice - 0.05)));
        const aimW = aimEase(e, LC_HEAD(), [bw.x, bw.y + 0.1, bw.z], 0.75 * open);
        camAt(e, aimW);
        powerAt(t, e);                                                 // (the last of the light, going out round the room)
        return;
      }
      /* "Go to a temple this week..." — his face, the colour back, warm */
      fLens(lp(isNarrow() ? 52 : 44, isNarrow() ? 48 : 40, smo(sgk(t, K.advice, K.end))));
      camAt(KN_EYE, at);
    }

    /* ================================================================ THE FOUR ENDINGS (§4.5) and THE CODA (§4.6) */
    /* the shared beats: kneeling before him (as the decision leaves him), Pong at the shutter, the two going out */
    function kneelShot(t, fl0 = 50, fl1 = 44, push = [0, 1]) {
      fLens(lp(isNarrow() ? fl0 + 8 : fl0, isNarrow() ? fl1 + 8 : fl1, smo(sgk(t, push[0], push[1]))));
      camAt(KN_EYE, LC_HEAD());
    }
    function pongShot() { fLens(isNarrow() ? 50 : 42); camAt(KN_EYE, aimEase(KN_EYE, LC_HEAD(), PG_HEAD(), 1)); }
    /* (v25.5) where "Don't take Pong's word." falls in the master's re-said line (lc2B2's own word times, measured:
       "Don't" at 4.88 s, "word" ended by 6.9, "Check his teacher" from 7.2): the look to Pong at the shutter */
    const B_PONG = [4.7, 7.0];
    /* Lersi Chin and Pong go out under the shutter (B, C, D): he stands (on a cut, his bag taken), Pong turns to the
       shutter and lifts it, and the two walk out. */
    /* (v25.0 CP9) round him on his right, a metre off, not through where he knelt: the back of the master's head filled
       the frame from 0.45 m as he passed (by photograph) */
    /* (v25.5, Chad, of endings B and C: "when lersi chin walks away, the camera movement is very jerky and weird and they
       walk away too fast") Measured: 5 m in 3.5 s (1.4 m a second, a robed master leaving a small shop at a commuter's
       pace) along a path of straight legs, the lens locked to his HEAD's bone from a metre off as he passed: every step's
       bob, and 80 degrees a second at the pass. Now each walks a smooth curve at a pace, from rest (walkPace): the
       master 0.85 m a second, Pong 0.9, Pong a few steps ahead once the shutter is up; out under it, and away along the
       corridor to the left until the shop's own front hides them. goShot is where it is watched from in B and C: a
       still eye, stood back by the left-hand cases (he has got up and stepped aside for them, on the cut), 2.2 m from
       the nearest point of the master's way, its look on a point of his body that rides no step, eased onto the doorway
       as he reaches it and resting there as they go */
    const OUT_L = walkCurve([[LC.x, LC.z + 0.25], [0.5, 0.5], [0.58, 1.5], [0.45, 2.6], [0.15, 3.35], [-1.0, 3.95], [-3.0, 4.3]], 96);
    const OUT_P = walkCurve([[PONG_DOOR.x, PONG_DOOR.z], [0.7, 3.25], [-0.5, 4.05], [-3.0, 4.6]], 64);
    const OUT_V = { l: 0.85, p: 0.9, lAt: 0.5, pAt: 2.4 };                // their paces, and when each sets off (from the cut)
    const GO_EYE = [-1.6, 1.62, 0.2], GO_DOOR = [0.25, 1.25, 3.1];
    function goOut(t, t0) {
      const L = cast.lersi, P = cast.pong;
      if (L && L.ready) { walkPace(L, OUT_L, t, t0 + OUT_V.lAt, OUT_V.l); L.lookAt = null; L.look = 0; L.bow = 0; }
      if (P && P.ready) {
        const A = walkPace(P, OUT_P, t, t0 + OUT_V.pAt, OUT_V.p);
        /* before he sets off: from the client (where the decision leaves him looking) round to the shutter he lifts */
        if (A[0] <= 0 && A[1] <= 0.02) { const r0 = faceTo(PONG_DOOR.x, PONG_DOOR.z, CL.x, CL.z), r1 = headAt(OUT_P, 0);
          P.group.rotation.y = r0 + angTo(r0, r1) * ezk(t, t0 + 0.1, t0 + 1.0); }
        P.lookAt = null; P.neck = null;
      }
      lcPose(null, 0); lcBlockOn(false);
      props.lcThings.visible = false;                                    // his things packed and gone with him
      shopAt({ u: lp(0.42, 0.86, smo(sgk(t, t0 + 0.5, t0 + 2.2))) });
    }
    function goShot(t, t0) {
      const L = cast.lersi;
      const body = L && L.ready ? [L.group.position.x, 1.3, L.group.position.z] : GO_DOOR;
      const s = walkArc(t, t0 + OUT_V.lAt, pathLen(OUT_L), OUT_V.l)[0];
      fLens(isNarrow() ? 58 : 50);
      camAt(GO_EYE, aimEase(GO_EYE, body, GO_DOOR, smo(sgk(s, 1.7, 3.5))));   // (by the ground he has covered: the doorway is 3 m along)
    }

    /* (v25.5, Chad: "when player is choosing options, lersi chin is in a very strange super hunchback position, dont make
       him so hunchback, and his head does not face to look up every few seconds, the look is a bit strange and
       unnatural") WHILE HE CHOOSES, THE MASTER SITS AS HE SITS: his own seat (the take his file has, breathing), his
       eyes lowered to his things on the mat before him, his head a little inclined. v25.2 bent him to the bowl to show
       the decision's words ("packing his things": the same 39-degree fold the water had, held for as long as the player
       reads) and v25.3 lifted his head to the lens every eleven seconds from down there: both are out, and the words
       were changed to what is seen (DATA.prompt). REST_AT is where his eyes rest; endRest opens B and C from it, his
       eyes coming up to the one who speaks over most of a second */
    const REST_AT = [LC.x, 0.1, LC.z + 0.5], REST_BOW = 0.07;
    function endRest(t, t0) {
      const L = cast.lersi; if (!L || !L.ready) return;
      lcBody(null);
      lcLook(t, [[-1, 0, REST_AT], [t0 + 0.2, t0 + 1.1, 'lens']], 1.1);
      lcBow(L, keyed(t, REST_BOW, [[t0, t0 + 1.0, 0]]));
      L.look = 1;
    }
    /* THE DECISION, IN PLAY (v25.2: play's own; a film's frame sets his body itself, and films.end and reset() give it
       back): his eyes eased down to his things from when it opens; a Continue lands with them there */
    const PACK_LOOK = new THREE.Vector3(), _pkB = new THREE.Vector3();
    function packTick(now) {
      if (FL.key || phase !== 'decide' || !play.packAt) return;
      const L = cast.lersi; if (!L || !L.ready || !L.group.visible) return;
      const k = ezk(now - play.packAt, 0.4, 2.0);
      lcBody(null);
      camera.getWorldPosition(PACK_LOOK); PACK_LOOK.lerp(_pkB.set(REST_AT[0], REST_AT[1], REST_AT[2]), k);
      L.lookAt = PACK_LOOK; L.lookK = null; L.neck = 1.1;
      L.bow = REST_BOW * k;
    }
    /* (v25.2) his wai as they go (B, C): up over most of a second, his head bowing into it, held into the cut; (v25.3) at
       his chest, his back and his neck inclined with his head */
    function endWai(t, t0) {
      const L = cast.lersi; if (!L || !L.ready) return;
      const w = handKeys(t, [[t0 + 0.05, t0 + 0.95, W_CHEST]]);
      lcBody(w ? { R: w, L: w, lean: keyed(t, 0, [[t0 + 0.35, t0 + 1.05, 0.07]]), neck: keyed(t, 0, [[t0 + 0.35, t0 + 1.05, 0.08]]) } : null);
      lcBow(L, keyed(t, 0, [[t0 + 0.35, t0 + 1.05, 0.16]]));
      lcLook(t, [[-1, 0, 'lens']], 1.1); L.look = 1;
    }

    /* (v25.5) a shot of his laptop's screen: on a phone it holds the forum's middle column whole (fit) */
    function lapShot(eye, at, fl) {
      const col = isNarrow() ? lapColumn() : null;
      if (col) { const Fc = fit(eye, at, fl, col); fLens(Fc.fl); camAt(eye, Fc.at); return; }
      fLens(fl); camAt(eye, at);
    }
    /* A · WORD GETS AROUND (worst): that night he posts it; days later the thread; Pong's call; a customer who has read it */
    const A_REPLY = [-9, 1.4, 2.6, 3.7, 4.9];                             // when each answer comes, from `days`
    function endA(t) {
      const T = END.A;
      lcBlockOn(false); lcPose(null, 0);
      castVis({ lersi: false, pong: false, goldman: t >= T.days, mallA: false, mallB: false });
      props.lcThings.visible = false; clothPiece(false); pieceShow(false);
      const eye = [HIS.x + 0.1, 1.52, HIS.z + 0.3], lap = [LAP.x + 0.04, top0 + 0.11, LAP.z + 0.06];
      if (t < T.days) {
        /* that night, alone, the shutter down: the forum, his post typed and sent */
        fLook('VISIT'); fogFilm(0);
        shopAt({ u: 0, led: 0.9, ceil: 0, night: true });
        shop.phoneOn = 0; shop.phoneSecs = null;
        shop.lapOn = 1; shop.lapMode = 'compose';
        const W2 = DATA.words, n = (W2.postTitle || '').length + (W2.postBody || '').length;
        shop.lapO = { chars: Math.floor(n * c01((t - 0.9) / 5.6)), post: t > T.q2A1 + SECS.q2A1 + 0.5, caret: Math.floor(t * 2.4) % 2 };
        lapShot(eye, lap, lp(isNarrow() ? 54 : 46, isNarrow() ? 48 : 40, smo(sgk(t, 0.4, T.days))));
        return;
      }
      fLook('LATER'); fogFilm(0);
      shopAt({ u: 1, led: 1, ceil: 1, night: false });
      mallPass('A', t);
      if (t < T.call) {
        /* days later, by day: the thread grown under it, reply after reply */
        /* (v25.5) each answer slides in on its own sound (the pings at 1.4, 2.6, 3.7 and 4.9 s; the first is there already) */
        shop.lapOn = 1; shop.lapMode = 'thread'; shop.lapO = { n: A_REPLY.reduce((s, at) => s + c01((t - T.days - at) / 0.3), 0) };
        shop.phoneOn = t > T.call - 1.6 ? wallNow() - (t - (T.call - 1.6)) - 0.001 : 0; shop.phoneMode = 'ringing'; shop.phoneSecs = t > T.call - 1.6 ? t - (T.call - 1.6) : null;
        const k = smo(sgk(t, T.call - 1.6, T.call - 0.6));
        fLens(isNarrow() ? 52 : 44);
        camAt(eye, aimEase(eye, lap, [0.48, top0, COUNTER.z + 0.04], k));
        return;
      }
      shop.lapOn = 1; shop.lapMode = 'thread'; shop.lapO = { n: 5 };
      /* (v25.5) Pong's call taken on the speaker, as his own call was: the phone lies where it rang, the call's clock
         on it while they talk, dark again once it is over (it went dark the moment he answered, with a pick-up heard) */
      if (t < T.pg2A2 + SECS.pg2A2 + 0.6) { shop.phoneMode = 'call'; shop.phoneOn = wallNow() - (t - T.call) - 0.001; shop.phoneSecs = t - T.call; }
      else { shop.phoneOn = 0; shop.phoneSecs = null; }
      if (t < T.cust) {
        /* Pong on the phone (heard): the replies on the screen under his eyes; at "You saw. You don't know." up to the mall
           going by outside */
        const kUp = smo(sgk(t, T.pg2A2 - 0.2, T.pg2A2 + 1.6));
        fLens(isNarrow() ? 54 : 46);
        camAt(eye, aimEase(eye, lap, [0.5, 1.4, 5.0], kUp));
        return;
      }
      if (t < T.last + SECS.q2A3 * 0.5) {
        /* a customer at the counter, heard: his eyes stay on the tray */
        const tray = [-0.4, DISPLAY.floor, COUNTER.z + 0.05];
        fLens(isNarrow() ? 54 : 46);
        camAt([HIS.x - 0.05, 1.56, HIS.z + 0.2], tray);
        return;
      }
      /* "...never sure enough to say it about him." — back to the screen: his post, and everything under it */
      const k = smo(sgk(t, T.last + SECS.q2A3 * 0.5, T.coda - 0.6));
      lapShot(eye, lap, lp(isNarrow() ? 54 : 46, isNarrow() ? 44 : 36, k));
    }

    /* B · NOT MY ROAD (good): he asks to be taught; the honest answer; Pong; the two go; the shop in clear colour */
    function endB(t) {
      const T = END.B;
      fLook('CLEAR'); fogFilm(0);
      shopAt({ u: 0.42, led: 1, ceil: 0, night: true });
      castVis({ goldman: false, mallA: false, mallB: false, lersi: t < T.empty, pong: t < T.empty });
      clothPiece(true); pieceShow(false);
      const L = cast.lersi, P = cast.pong;
      if (t < T.go) {
        lcSeated(); pongDoor(); props.lcThings.visible = true; lcBlockOn(true);
        /* his eyes on his things until he is asked; then up to the one who asks, and the long look */
        endRest(t, T.q2B1 + 0.5);
        if (P) { P.lookAt = t > T.pg2B1 - 0.4 && t < T.go ? camera : L && L.head ? L.head : null; P.neck = 1.0; }
        waiAt(smo(sgk(t, T.q2B1, T.q2B1 + 0.5)) * (1 - smo(sgk(t, T.q2B1 + SECS.q2B1 - 0.4, T.q2B1 + SECS.q2B1 + 0.3))));
        /* "Don't take Pong's word" — a look to Pong at the shutter; and his "This time we check first" */
        const onP = (t > T.lc2B2 + B_PONG[0] && t < T.lc2B2 + B_PONG[1]) || (t > T.pg2B1 - 0.2 && t < T.go - 0.2);
        if (onP) pongShot(); else kneelShot(t, 50, 40, [T.look, T.lc2B2 + B_PONG[0] - 0.1]);
        return;
      }
      /* he wais; up (a cut), and the two go out under the shutter, Pong lifting it; (v25.5) watched from one still eye
         until they are gone, which then turns back into the shop: the right-hand cases, round to the altar */
      const tw = T.go + 1.5;
      if (t < tw) { lcSeated(); pongDoor(); props.lcThings.visible = true;
        const w = smo(sgk(t, T.go, T.go + 0.5)) * (1 - smo(sgk(t, tw - 0.4, tw)));
        endWai(t, T.go); waiAt(w); kneelShot(t, 46, 46); return; }
      waiAt(0);
      const kT = smo(sgk(t, T.q2B2 + 2.0, T.q2B2 + 6.0));
      if (t < T.empty) {
        goOut(t, tw);
        if (kT <= 0) { goShot(t, tw); return; }
      } else { castVis({ lersi: false, pong: false }); lcPose(null, 0); lcBlockOn(false); props.lcThings.visible = false; shopAt({ u: 0.86 }); }
      /* the shop in clear colour, theirs gone: from the door, round to the altar (they pass out of the frame's left as it
         turns right, and are put away once it cannot see them: `empty`) */
      fLens(lp(isNarrow() ? 58 : 50, isNarrow() ? 56 : 48, kT));
      camAt(GO_EYE, aimTurn(GO_EYE, GO_DOOR, BUDDHA_AT, kT, 1));
    }

    /* C · SEND IT BACK (bad): he asks for the harm to be sent back; the kind refusal; the two go; alone, the shutter down,
       and the grey coming back in at the edges while he holds on */
    function endC(t) {
      const T = END.C;
      castVis({ goldman: false, mallA: false, mallB: false, lersi: t < T.alone, pong: t < T.alone });
      clothPiece(t < T.go); pieceShow(false);
      const L = cast.lersi, P = cast.pong;
      if (t < T.alone) { fLook('CLEAR'); fogFilm(0); shopAt({ u: 0.42, led: 1, ceil: 0, night: true }); }
      if (t < T.go) {
        lcSeated(); pongDoor(); props.lcThings.visible = true; lcBlockOn(true);
        /* his eyes on his things when he is asked; they come up; the long look, not unkind */
        endRest(t, T.stop - 0.7);
        if (P) { P.lookAt = t > T.pg2C1 - 0.3 && t < T.q2C2 + 0.4 ? camera : L && L.head ? L.head : null; P.neck = 1.0; }
        if (t > T.pg2C1 - 0.2 && t < T.q2C2 - 0.1) pongShot(); else kneelShot(t, 50, 40, [T.stop, T.lc2C3]);
        return;
      }
      if (t < T.alone) {
        const tw = T.go + 1.4;
        if (t < tw) { lcSeated(); pongDoor(); props.lcThings.visible = true;
          endWai(t, T.go); kneelShot(t, 46, 46); return; }
        goOut(t, tw); goShot(t, tw);
        return;
      }
      /* alone at the counter, the shutter down; the shelf by the door where the piece stood, empty; the grey creeping in */
      castVis({ lersi: false, pong: false }); lcPose(null, 0); lcBlockOn(false); props.lcThings.visible = false;
      /* (v25.0 CP9) inside the door: the shutter brought down as its sound says (x2shutter, T.alone + 0.1), then his eyes to
         the little shelf beside it where the piece stood, empty, the grey creeping in. From behind the counter the left
         wall's cabinet hid the shelf (by photograph), and the shutter was already down under its own sound */
      const down = smo(sgk(t, T.alone + 0.1, T.alone + 3.3));
      fLook('VISIT'); shopAt({ u: lp(0.86, 0, down), led: 0.85, ceil: 0, night: true });
      const creep = smo(sgk(t, T.alone + 1.2, T.coda - 1.0));
      if (kit && kit.chill) kit.chill(0.36 * creep, { secs: 0.01, cine: true, tint: 'grey' });
      const e = [-1.0, 1.6, 1.55], shelf = [SHELF.x + 0.04, SHELF.y, SHELF.z];
      fLens(lp(isNarrow() ? 56 : 48, isNarrow() ? 44 : 36, smo(sgk(t, T.alone + 3.0, T.coda))));
      camAt(e, aimEase(e, [0.0, 1.0, 3.0], shelf, smo(sgk(t, T.alone + 3.0, T.alone + 5.0))));
    }

    /* D · ENOUGH (best): thank you; go well; out under the shutter together; the next morning in full colour — the stand
       gone, the envelope for the temple, the wallet where it should be; a customer's question followed and answered */
    function endD(t) {
      const T = END.D;
      const L = cast.lersi, P = cast.pong;
      clothPiece(t < T.go); pieceShow(false);
      if (t < T.morning) {
        fLook('CLEAR'); fogFilm(0); shopAt({ led: 1, ceil: 0, night: true });
        castVis({ goldman: false, mallA: false, mallB: false, lersi: true, pong: true });
        if (t < T.go) {
          shopAt({ u: 0.42 });
          lcSeated(); pongDoor(); props.lcThings.visible = true; lcBlockOn(true);
          const w = smo(sgk(t, T.q2D1, T.q2D1 + 0.5)) * (1 - smo(sgk(t, T.lc2D1 + SECS.lc2D1 * 0.6, T.lc2D1 + SECS.lc2D1)));
          waiAt(w);
          /* (v25.2) his wai answering the client's thanks: up over a second, his head bowing into it, down as his words end */
          const wl = handKeys(t, [[T.lc2D1 - 0.5, T.lc2D1 + 0.45, W_CHEST], [T.lc2D1 + SECS.lc2D1 * 0.6, T.lc2D1 + SECS.lc2D1 + 0.25, null]]);
          lcBody(wl ? { R: wl, L: wl, neck: keyed(t, 0, [[T.lc2D1 - 0.15, T.lc2D1 + 0.55, 0.08], [T.lc2D1 + SECS.lc2D1 * 0.5, T.lc2D1 + SECS.lc2D1 * 0.5 + 0.6, 0]]) } : null);
          lcBow(L, keyed(t, 0, [[T.lc2D1 - 0.15, T.lc2D1 + 0.55, 0.15], [T.lc2D1 + SECS.lc2D1 * 0.5, T.lc2D1 + SECS.lc2D1 * 0.5 + 0.6, 0]]));
          if (L) { L.look = 1; gaze(L, true, 1.1); }
          if (P) { P.lookAt = t > T.pg2D1 - 0.4 ? camera : L && L.head ? L.head : null; P.neck = 1.0; }
          if (t > T.pg2D1 - 0.2) pongShot(); else kneelShot(t, 48, 44, [0, T.pg2D1]);
          return;
        }
        /* out under the shutter with them, into the corridor at night */
        waiAt(0);
        goOut(t, T.go);
        /* (v25.5) HIS OWN WAY OUT BEHIND THEM. At the master's calmer pace the eye this shot had (from where he knelt,
           on the door until the master was a step or two ahead, then following) showed a phone a doorway for four of
           its six seconds, the two of them slivers at its edges (photographed). Now it begins as B's and C's does, on
           the cut: on his feet, stepped aside by the left-hand cases, his look on the master's body (a point that rides
           no step); as the master passes he falls in behind the two of them along a curve, two metres back, a share of
           his look going to Pong, so a phone's frame holds both (simulated second by second, then photographed) */
        const Ae = walkArc(t, T.go + D_OUT.at, pathLen(D_EYE), D_OUT.v);
        const e = walkEye(D_EYE, Ae[0], Ae[1], () => 0);
        fLens(isNarrow() ? 62 : 50);
        const bL = L && L.ready ? [L.group.position.x, 1.3, L.group.position.z] : GO_DOOR;
        const bP = P && P.ready ? [P.group.position.x, 1.3, P.group.position.z] : bL;
        camAt(e, aimEase(e, bL, bP, D_OUT.share * smo(sgk(t, T.go + 1.0, T.go + 2.8))));
        return;
      }
      /* the next morning, in full colour (chapter 1's dawn shop again, clear this time) */
      fLook('MORNING'); fogFilm(0);
      /* (v25.5) his hands are down by morning whatever frame came before (v6.4: a picture is a function of the film's
         clock; a seek from his thanks straight to the morning left his wai in front of the piece, in the lab) */
      waiAt(0);
      /* (v25.5, Chad: "when customer asks about the amulet, there is no customer, add the customer") she comes back up to
         his counter as her heels say (unseen: his eyes are on the envelope, well to her right), and stands at the piece
         on the glass; her eyes on it, up to him as she asks, and back to it as he tells her */
      const Wm = cast.woman, wOn = t >= T.cu2a2 - 0.9;
      castVis({ lersi: false, pong: false, goldman: true, woman: wOn }); lcPose(null, 0); lcBlockOn(false); props.lcThings.visible = false;
      if (Wm && Wm.ready && wOn) {
        fPut(Wm, D_WOMAN.x, D_WOMAN.z, Math.PI, { y: 0, seated: false });
        pLook(Wm, t, [[-1, 0, AMU_AT], [T.cu2a2 + 1.1, T.cu2a2 + 1.8, 'lens'], [T.q2D2 + 0.9, T.q2D2 + 1.7, AMU_AT]], 1.0);
      }
      if (props.stand) props.stand.visible = false;                      // the dried stand taken away at last
      props.envelope.visible = true; amuletTop.visible = true;
      mallPass('D', t);
      if (t < T.morning + 2.6) {
        /* the shutter rising on the shop, from the corridor, as he opens — the bookend of chapter 1's dawn */
        shopAt({ u: smo(sgk(t, T.morning + 0.2, T.morning + 2.6)), led: 1, ceil: 1, night: false });
        const kk = smo(sgk(t, T.morning, T.morning + 2.6));
        fLens(isNarrow() ? 64 : 56);
        camAt(lp3([0.25, 1.2, 6.2], [0.18, 1.3, 5.4], kk), lp3([0, 1.45, 3.0], [0, 1.35, 0.4], kk));
        return;
      }
      shopAt({ u: 1, led: 1, ceil: 1, night: false });
      handFree();
      const eye = [HIS.x + 0.1, 1.55, HIS.z + 0.28];
      if (t < T.cu2a2 - 0.3) {
        /* the envelope on the counter, For the temple; his pocket, and the wallet in it */
        /* (v25.0 CP9) its words read on a phone */
        shot(eye, [props.envelope.position.x, top0, props.envelope.position.z], 36, 30);
        return;
      }
      /* (v25.5, Chad: "no need for his hands to try and take the amulet because the arms and hands ends up looking awkward.
         Just have the camera look at the amulet placed on the top of the glass cabinet") HER QUESTION FOLLOWED, AND
         ANSWERED, with no hand in it: a cut up to her as she asks (the piece she means lies on the glass between them);
         at "This one?" his eyes go down to it, bent to it, the lens close (a phone's screen holds it whole: fit); and at
         "I had enough to decide." up, past her, to the shop's open front, the mall going by in clear morning light */
      const face = faceOf(Wm, [D_WOMAN.x, 1.44, D_WOMAN.z]);
      const dn = smo(sgk(t, T.q2D2 - 0.35, T.q2D2 + 1.0)) * (1 - smo(sgk(t, T.last - 0.3, T.last + 1.2)));
      const out = smo(sgk(t, T.last - 0.2, T.last + 3.0));
      const e = lp3(eye, [AMU_AT[0] + 0.03, 1.4, AMU_AT[2] - 0.38], dn);
      /* (v25.5, the woman in green) ON A PHONE HIS EYES STOP SHORT OF PASSING HER. The look up and out ends on the
         corridor's point (D_END.past 1) on a wide screen, where she stands whole at the picture's right all the way. A
         phone's frame is a third as wide: taken all the way, it put her head across its right edge (half a face, by
         photograph; with the auntie before her, an arm in its corner). It stops at D_END.past of the way: the morning
         mall across the left of the picture, his customer whole at its right, still at the piece */
      const at = aimEase(e, aimEase(e, face, AMU_AT, dn), [0.4, 1.4, 5.2], out * (isNarrow() ? D_END.past : 1));
      /* (v25.5) a desktop's lens on the piece is 14 (21: its wide frame took in her two hands hanging at her sides,
         cut off at its edges beside the piece, by photograph; a phone's frame never reached them) */
      const fl = lp(lp(isNarrow() ? 54 : 46, isNarrow() ? 26 : 14, dn), isNarrow() ? 58 : 50, out);
      if (dn > 0.5 && isNarrow()) {
        const Fa = fit(e, at, fl, amuletCorners()), w = smo(sgk(dn, 0.5, 0.95));
        fLens(lp(fl, Fa.fl, w)); camAt(e, aimEase(e, at, Fa.at, w));
        return;
      }
      fLens(fl);
      camAt(e, at);
    }

    /* THE CODA — "LF>" (every ending): months later, after closing; the forum on his laptop, his notebook beside it with
       the names he has checked; the case file's last paragraph; a new thread at the top; his finger opens it */
    const _bk = new THREE.Vector3();
    function codaFrame(t, k) {
      const C = CODA;
      fLook('VISIT'); fogFilm(0);
      if (kit && kit.chill && k === 'C') kit.chill(0.12, { secs: 0.01, cine: true, tint: 'grey' });   // (what he kept holding, still at the edges)
      shopAt({ u: 0, led: 0.8, ceil: 0, night: true });
      castVis({ lersi: false, pong: false, goldman: false, mallA: false, mallB: false }); lcPose(null, 0); lcBlockOn(false);
      props.lcThings.visible = false; clothPiece(false); pieceShow(false); props.envelope.visible = false;
      if (props.stand) props.stand.visible = k !== 'D';
      handFree();
      shop.lapOn = 1;
      /* (v25.5, Chad: "when the player scrolls the forum, it is very slow and jerky, and the selected thread is visually cut
         off") THE SCREEN, ON THE FILM'S CLOCK. He reads the board down in three flicks of his finger (each eased, a
         third of a second and more, in pixels and fractions of them: 350 px in all; it crept 60 px in fifteen seconds,
         four whole pixels a second), and comes back up to the top before the new thread arrives, so it lands in a list
         that stands where it begins: whole, at the head of the column. The pointer goes to it, the card lights under
         it, he clicks, the page's bar runs, and the thread opens with its own words */
      const tOpen = C.open + 0.5, open = t >= tOpen;
      shop.lapMode = open ? 'post' : 'list';
      if (open) shop.lapO = { fade: ezk(t, tOpen, tOpen + 0.35) };
      else { const go = ezk(t, C.open - 1.6, C.open - 0.35);
        shop.lapO = { scroll: 120 * ezk(t, 3.9, 4.55) + 110 * ezk(t, 5.4, 6.05) + 120 * ezk(t, 7.5, 8.15) - 350 * ezk(t, C.thread - 4.6, C.thread - 3.5),
                      newK: ezk(t, C.thread, C.thread + 0.7), cx: lp(690, 470, go), cy: lp(548, 214, go) + 5 * (1 - go) * Math.sin(t * 0.9),
                      hover: ezk(t, C.open - 0.75, C.open - 0.45), click: c01((t - C.open) / 0.3), load: c01((t - C.open) / 0.5) }; }
      const eye = [HIS.x + 0.1, 1.5, HIS.z + 0.3], lap = [LAP.x + 0.04, top0 + 0.11, LAP.z + 0.06];
      const bk = shop.ledger ? shop.ledger.getWorldPosition(_bk) : _bk.set(BOOK_AT.x, top0, BOOK_AT.z);
      const tPage = C.q2K2 + 1.4 * 2.6;                                  // the names reach the right-hand page
      namesAt(t >= C.q2K2 - 0.4 ? Math.min(7, 2 + Math.floor((t - C.q2K2) / 1.4)) : 2);
      if (t >= C.q2K2 - 0.4 && t < C.q2K3 - 0.2) {
        /* "I research a master's lineage thoroughly..." — his notebook: the names checked, some crossed out. (v25.5) On a
           phone the picture holds a page: the left one's writing, then across to the right one as the names reach it
           (it held the book's middle: the spine, and half of each line either side of it) */
        const eb = [bk.x - 0.12, 1.42, bk.z - 0.42], mid = [bk.x, bk.y + 0.012, bk.z + 0.02], fl = isNarrow() ? 50 : 42;
        if (isNarrow() && pagePoint(0, 0)) {
          const box = (x0, x1, y1) => [[x0, 14], [x1, 14], [x1, y1], [x0, y1]].map(([a, d]) => pagePoint(a, d));
          const Fl = fit(eb, mid, fl, box(22, 500, 580)), Fr = fit(eb, mid, fl, box(524, 1002, 470)), k = ezk(t, tPage - 0.6, tPage + 0.8);
          fLens(lp(Fl.fl, Fr.fl, k)); camAt(eb, aimEase(eb, Fl.at, Fr.at, k));
          return;
        }
        fLens(fl);
        camAt(eb, mid);
        return;
      }
      /* the forum: the list read down; the new thread arriving at the top; pushed in as it is opened. (v25.0 CP9: on a
         phone the push ended at 46, so the new thread's title read whole) (v25.5) and a phone's picture holds the
         forum's middle column whole, whatever the lens (fit, on the screen's own corners) */
      const kIn = smo(sgk(t, C.thread, C.black)), e = lp3(eye, [LAP.x + 0.02, 1.36, LAP.z - 0.36], kIn * 0.6);
      const col = isNarrow() ? lapColumn() : null;
      if (col) { const Fc = fit(e, lap, lp(54, 44, kIn), col); fLens(Fc.fl); camAt(e, Fc.at); return; }
      fLens(lp(isNarrow() ? 54 : 46, isNarrow() ? 46 : 32, kIn));
      camAt(e, lap);
    }

    /* (v25.0 CP11) THE ROOM UNDER EACH FILM, a pure function of its clock: the mall muffled at noon in the opening, the
       shop at night under the call, the visit, the examination and the clearing (the room's sound fuller once the fog has
       lifted, from the white), each ending's night and its daylight (A's "days later", D's morning: the mall heard clear),
       C's air-con alone after the shutter comes down, and the coda's night. mixBeds eases to it. */
    function filmBedAt(key, t) {
      const B = { mall: 0, night: 0, mallclear: 0, whisper: 0 };
      const seg = (a, b) => Math.min(1, Math.max(0, (t - a) / (b - a)));      // 0 before a, 1 after b
      if (key === 'open') B.mall = 0.55 * (1 - seg(OPEN.black - 1.0, OPEN.end));               // out with the picture
      else if (key === 'call') B.night = 0.5 * (1 - seg(CALL.black - 0.6, CALL.end));          // to the next evening's black
      else if (key === 'visit') B.night = 0.45 * seg(0, 1.0);                                   // and in from it
      else if (key === 'exam') { B.night = 0.45;
        /* (v25.4) the piece's whisper under the look that finds it, nearer as the look closes on it, (v25.5) gone the
           moment it is off its shelf */
        const tTake = EXAM.fetch + EX_TAKE;
        B.whisper = WHISPER.vol * (0.36 * seg(EXAM.lc2e7 + 0.2, EXAM.lc2e7 + 1.6) + 0.56 * seg(EXAM.fetch - 1.0, EXAM.fetch + 0.5)) * (1 - seg(tTake - 0.2, tTake)); }
      else if (key === 'clear') B.night = t < CLEARF.flash ? 0.4 : 0.5;
      else if (END[key]) {
        const T = END[key];
        if (t >= T.coda) B.night = 0.42 * (1 - seg(T.coda + CODA.black - 0.6, T.coda + CODA.end));
        else if (key === 'A' && t >= T.days - 0.3) B.mallclear = 0.5 * (1 - seg(T.coda - 1.0, T.coda));
        else if (key === 'D' && t >= T.morning - 0.3) B.mallclear = 0.5 * (1 - seg(T.coda - 1.0, T.coda));
        else if (key === 'C' && t >= T.alone) B.night = 0.62;                                   // the air-con, all that is left
        else B.night = 0.45;
      }
      return B;
    }
    /* (v25.1 F5) HIS LAPTOP PUT AWAY for the master's visit: the counter cleared from the visit on, through the clearing,
       the decision and endings B, C and D, and back where it stood for ending A's night (he opens it to post) and the coda.
       Its lid's back is the model's own near-black paint, and it stood as a flat black slab before the altar in every
       kneeling shot (the lid and the base's underside are one mesh in the file, so it cannot be closed). A change made on
       a cut: the visit opens out of the black, and A and the coda open on their own nights */
    function lapAway(away) {
      const g = shop.lapG || shop.lapOld;
      if (g) g.visible = !away;
    }
    function lapTick() {
      if (!FL.key) lapAway(phase === 'visit' || phase === 'clearing' || phase === 'decide');
    }
    const films = {
      begin(key, c, api) {
        FL.key = key; FL.lit = ''; FL.api = api; FL.stings = (c && c.stings) || []; FL.once = new Set();
        /* his hands are not in the films but for what he holds and his wai (chapter 1's law); end() gives them back */
        if (api && api.handsRoot) { FL.hands = api.handsRoot; api.handsRoot.visible = false; }
        kneelZone.visible = false;
        for (const k of ['lersi', 'pong']) if (cast[k]) cast[k].lookFilm = key !== 'open' && key !== 'call';
      },
      frame(key, t, api) {
        if (FL.key !== key) films.begin(key, null, api);
        lapAway(key === 'visit' || key === 'exam' || key === 'clear' || (!!END[key] && key !== 'A' && t < END[key].coda));
        Object.assign(filmBed, filmBedAt(key, t)); filmBed.on = true;
        /* (v25.5) what only some shots have is away unless this frame's shot brings it (a seek lands on the same picture):
           the woman at his counter, the piece on the glass, the master's aura, the coda's page */
        if (cast.woman && cast.woman.ready) { cast.woman.group.visible = false; cast.woman.filmWalk = 0; }
        amuletTop.visible = false; auraAt(0, 0, t); powerAt(null);
        if (END[key] && t < END[key].coda) namesAt(-1);
        /* (v25.5) and his own hands are down at the laptop whatever frame came before (a seek from his wai at an
           ending's start straight into its coda left them pressed over the keys: the lab's photograph) */
        else if (END[key] && END[key].coda != null) waiAt(0);
        fTalk(t);
        if (key === 'open') openFrame(t);
        else if (key === 'call') callFrame(t);
        else if (key === 'visit') visitFrame(t);
        else if (key === 'exam') examFrame(t);
        else if (key === 'clear') clearFrame(t);
        else if (END[key]) {
          const T = END[key];
          if (t < T.coda) ({ A: endA, B: endB, C: endC, D: endD })[key](t);
          else codaFrame(t - T.coda, key);
        }
      },
      /* the films leave nothing behind them: the props home, the people where play keeps them, the light and the lens
         play's (a scene's own end, a skip, a Retry) — the fog back on if play goes on in it */
      end() {
        const key = FL.key, fogBack = (key === 'call' || key === 'visit' || key === 'exam') && !play.cleared;
        waiAt(0); handFree(); lcPose(null, 0);
        /* (v25.1 F4) the coda's page put away, so a replay (reset() runs this) never opens on the months-later notebook */
        namesAt(-1);
        amuletTop.visible = false; auraAt(0, 0, 0); powerAt(null);
        if (held.lc) held.lc.visible = false;
        shop.phoneOn = 0; shop.phoneSecs = null;
        if (props.bowl && props.bowl.userData.home) { props.bowl.position.copy(props.bowl.userData.home); props.bowl.rotation.x = 0; }
        if (props.stand) props.stand.visible = true;
        for (const P of people) P.filmWalk = 0;
        for (const P of [cast.lersi, cast.pong, cast.woman]) if (P) { P.lookAt = null; P.neck = null; P.bow = 0; P.lookK = null; P.lookFilm = false; P.look = P.o.look || 0; }
        for (const k of ['mallA', 'mallB', 'woman']) if (cast[k] && cast[k].group) cast[k].group.visible = false;
        if (kit && kit.chill) kit.chill(fogBack ? FOG.chill : 0, { secs: 0.01, cine: false, tint: fogBack ? 'grey' : null });
        if (kit && kit.smear) kit.smear(fogBack ? FOG.smear : 0, { secs: 0.01 });
        camera.rotation.z = 0;
        if (FL.hands) { FL.hands.visible = true; FL.hands = null; }
        FL.key = ''; FL.lit = ''; FL.stings = []; FL.api = null;
        filmBed.on = false;
        if (kit && kit.captions) kit.captions(null);
      }
    };

    /* ---------------------------------------------------------- lifecycle */
    function snap() { return { phase }; }
    function restore() {}
    function reset() {
      films.end();
      dropTodo(); speakReset(); lineQ.length = 0; heard.clear();
      booted = false; preplaced = ''; dayClock.t = 0; lastWall = 0; pausedAt = 0; castLast = 0;
      worldRun++; wDark = false; decOpen = false;
      for (const h of hotspots) { h.done = false; h.dwellT = 0; }
      if (kit) {
        if (kit.abortEvent) kit.abortEvent();
        kit.objective(null, { complete: false });
        kit.root(false); kit.pose('standing', { secs: 0.05 });
        if (kit.pray) kit.pray(false, { secs: 0 });
        kit.presence(0);
        kit.daylight(null, 0);
        kit.setPhase('shop');
        if (kit.captions) kit.captions(null);
        kit.waypoint(null);
        if (kit.chill) kit.chill(0, { secs: 0.01, cine: false, tint: null });
        if (kit.smear) kit.smear(0, { secs: 0.01 });
      }
      lookName = 'DAY';
      for (const k in bedMix) bedMix[k] = 0;
      phase = 'shop';
      /* THE PLAY, BACK TO ITS FIRST FRAME (the v8.1 law: whatever a beat stated is cleared by whatever resets it) */
      play.run++;
      play.busy = false; play.searched.clear(); play.wallet = false; play.objBlur = false;
      play.shapeSeen = false; play.revealed = false; play.how = ''; play.watchAt = 0; play.noteOn = false; play.called = false;
      play.knelt = false; play.bowed = false; play.bow = null; play.asked = false; play.told = ''; play.examined = false; play.cleared = false; play.warned = false;
      play.turning = null; play.piece = 'nangkwak'; play.packAt = 0;
      kneelZone.visible = false; lcBlockOn(false);
      /* the shop as the day began */
      propsAt({ till: 0, bag: 0, jacket: 0, fridge: 0, mat: 1 });
      props.wallet.visible = true; props.note.visible = true; props.envelope.visible = false; props.sway = 0;
      for (const f of props.flames) f.material.opacity = 0;
      clothPiece(false); pieceShow(true);
      props.lcThings.visible = false;
      for (const o of [props.bowl, props.cloth, props.khan, props.yaam]) if (o) o.visible = true;
      shopCtl.night(false); shopCtl.shutter(1, 0); shopCtl.lights(1, 0); shopCtl.ceiling(1, 0); shopCtl.lap('sales'); shopCtl.phone('');
      props.tillTo = props.bagTo = props.jacketTo = props.fridgeTo = 0;
      /* the people where the day began: Lersi Chin and Pong not yet come, the goldsmith's man at his counter */
      for (const P of people) { P.walk = null; P.lookAt = null; P.neck = null; P.talkUntil = 0; P.turnTo = null; P.bow = 0; P.lookK = null; P.gripK = 0; P.grip = null; P.waiOn = false; P.holdObj = null; if (P.one) P.one.until = 0; }
      lcBody(null);                                       // (v25.2) his body's lean and hands given back to his take
      whenReady(cast.lersi, (P) => { P.group.visible = false; personPut(P, LC.x, LC.z, 0, 0); seatNow(P, true); });
      whenReady(cast.pong, (P) => { P.group.visible = false; personPut(P, PSTOOL.x, PSTOOL.z, PONG_RY, 0); seatNow(P, true); });
      whenReady(cast.goldman, (P) => { P.group.visible = true; });
      for (const k of ['mallA', 'mallB', 'woman']) whenReady(cast[k], (P) => { P.group.visible = false; P.filmWalk = 0; });
    }
    function blockers() {
      const out = [];
      const b = (o, pad = 0.20) => { o.updateWorldMatrix(true, false); const bb = new THREE.Box3().setFromObject(o); bb.expandByScalar(pad); out.push(bb); };
      const solid = (o, pad = 0.14) => { o.updateWorldMatrix(true, false); const bb = new THREE.Box3().setFromObject(o); bb.expandByScalar(pad); bb.min.y = 0; bb.max.y = Math.max(bb.max.y, 1.40); out.push(bb); };
      for (const w of walls) b(w);
      for (const s of solids) solid(s);
      out.push(lcBlock);                                                // (opened and closed by lcBlockOn)
      return out;
    }
    function dispose() {
      alive = false;
      const geos = new Set(), ms = new Set();
      world.traverse(o => {
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
      skyAt: () => null,
      /* walktest: where play puts him besides the spawn (closing time at his altar; the clearing's first step) */
      arrivals: [{ what: 'his altar at closing time', x: HIS.x, z: HIS.z - 0.25 }, { what: 'the shop floor before the mat', x: -0.95, z: 1.25 }],
      get phase() { return phase; },
      setPhase, applyPhase, after, dayClock, sayLine, queueLine, queueFn, queueGap,
      look, presets: PRESETS, shop: shopCtl, shopState: shop, props, films,
      film: { SX, SHOP, COR, COUNTER, HIS, TILL, BAG, STOOL, FRIDGE, NOTE, SWITCH, SHELF, STAND, LC, CL, PSTOOL, MAT, KNEEL, worldS },
      cast, person: { talk: personTalk, do: personDo, rest: personRest, walk: personWalk, put: personPut, sit: personSit, ready: whenReady, pose: lcPose },
      play: { state: play, search, fridgeOpen, reveal, watch, callPong, kneel, bow, tellIt, bowHead, kneelZone, pieces: PIECES },
      castInfo: () => Object.fromEntries(Object.entries(cast).map(([k, P]) => [k, P && { ready: P.ready, diag: P.diag || null,
        pos: [+P.group.position.x.toFixed(2), +P.group.position.y.toFixed(2), +P.group.position.z.toFixed(2)], vis: P.group.visible,
        faceToLens: (() => { if (!P.ready || !P.head || !P.faceLocal) return null;
          const hq = new THREE.Quaternion(), hp = new THREE.Vector3(), cp = new THREE.Vector3();
          P.head.updateWorldMatrix(true, false); P.head.getWorldQuaternion(hq); P.head.getWorldPosition(hp); camera.getWorldPosition(cp);
          return +THREE.MathUtils.radToDeg(P.faceLocal.clone().applyQuaternion(hq).angleTo(cp.sub(hp).normalize())).toFixed(1); })(),
        looking: P.lookAt === camera ? 'lens' : P.lookAt ? 'thing' : (P.look > 0 ? 'play' : null), lookW: +P.lookW.toFixed(2),
        grip: (P.gripK || 0) > 0.001 ? 'solved' : null, gripK: +(P.gripK || 0).toFixed(2),
        /* (v25.2) how far a hand stopped short of where it was sent (m); (v25.3) each wrist's bend, the hand's line off the
           forearm's (degrees, left then right): his own takes bend it to 57 */
        miss: P.miss != null ? +P.miss.toFixed(3) : null,
        wrist: k === 'lersi' ? [HS.Left, HS.Right].map(h => Math.round(h.bend * 57.3)) : null }])),
      /* (v25.2) a probe's measure (tools/probes/framecheck.mjs): named points of what a shot may be about, in the room,
         each with whether it is drawn — the people's faces and hands, his things, the shop's — so a film's frames can be
         measured on a phone and a desktop by the same names */
      subjects: () => {
        const out = {}, v = new THREE.Vector3();
        const drawn = (o) => { for (let q = o; q; q = q.parent) if (!q.visible) return 0; return 1; };
        const put = (k, o, dy = 0) => { if (!o) return; o.updateWorldMatrix(true, false); o.getWorldPosition(v); out[k] = [+v.x.toFixed(3), +(v.y + dy).toFixed(3), +v.z.toFixed(3), drawn(o)]; };
        for (const [k, P] of Object.entries(cast)) if (P && P.ready) {
          put(k + '.face', P.head || P.group, P.head ? 0.08 : 1.5);
          if (P.waiHand) { put(k + '.handL', P.waiHand.Left && P.waiHand.Left.bone); put(k + '.handR', P.waiHand.Right && P.waiHand.Right.bone); }
        }
        for (const k of ['bowl', 'cloth', 'khan', 'yaam', 'wallet', 'note', 'envelope', 'till', 'bag', 'jacket', 'fridge', 'sw', 'shelf', 'stand'])
          put(k, props[k]);
        put('phone', shop.phone && shop.phone.g); put('notebook', shop.ledger); put('laptop', shop.lapG);
        put('piece', props.pieces && props.pieces[play.piece]); put('heldPiece', held.lc); put('amulet', amuletTop);
        return out;
      },
      info: () => ({ phase, t: +dayClock.t.toFixed(2), queued: lineQ.length, heard: [...heard], until: +speak.until.toFixed(2),
                     pending: speak.pending ? speak.pending.name : null, decOpen, look: lookName, mark: mark(), busy: play.busy,
                     beds: Object.fromEntries(Object.entries(bedMix).map(([k, v]) => [k, +v.toFixed(3)])) }),
      hotspots,
      updateNotes, updatePile, updateFire, updateSlow,
      snap, restore, reset, dispose
    });
  }
