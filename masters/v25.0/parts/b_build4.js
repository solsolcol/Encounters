
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
    const SPEAKS = { pg: 'pong', lc: 'lersi' };
    const CHANTS = new Set(['lc2namo', 'lc2sak1', 'lc2sak2', 'lc2sak3']);
    function speakerNow(who) {
      const P = cast[who]; if (!P || !P.ready) return null;
      let vis = P.group.visible; for (let q = P.group.parent; vis && q && q !== world; q = q.parent) vis = q.visible;
      return vis ? P : null;
    }
    function fTalk(t) {
      for (const s of FL.stings) {
        const sp = SPEAKS[String(s.kind).slice(0, 2)]; if (!sp || CHANTS.has(s.kind) || /^pg2c|^pg2A/.test(s.kind)) continue;   // (Pong on the phone is not in the room)
        const d = SECS[s.kind]; if (!d || t < s.at || t > s.at + d) continue;
        const P = speakerNow(sp); if (P) P.talkUntil = wallNow() + 0.25;
      }
    }

    /* (the look at the lens, a thing in his right hand, letting go, his wai — chapter 1's, as they were) */
//@@COPY 7014-7021
//@@COPY 7027-7064
//@@COPY 7080-7106

    /* ---------------------------------------------------------------- (v25.0) the films' own helpers */
    const KN_EYE = [CL.x, KNEEL.y, CL.z];                               // his eye kneeling before Lersi Chin
    /* (v25.0 CP13) the thread: how far he leans in (down, forward), where his eyes go (over the mat, his wrist below
       them), the hand's own lowering (`place`'s p), the master's lean to meet it, and the lens on a phone and a desktop */
    /* (v25.1 F6) pN: on a narrow screen the hand held lower and further off (`place`'s own p: 8 cm down, 6 cm away a unit):
       at p 0 it was a dark shape over half a phone, a pointing finger at its tip, the master's right hand behind it; at 0.3
       both his hands rest on it and the thread still shows at the wrist (at 0.5 and over, the wrist leaves the frame's
       foot; photographed at 0.3, 0.5, 0.7 and 1) */
    /* (v25.2) dz 0.4: he leans in further so his wrist comes within the master's reach (at 0.28 the master's hands, leaning
       to it, stopped 10 cm short of the wrist, measured) */
    const TIE = { dy: 0.06, dz: 0.4, aim: [0.03, 0.6, 0.05], p: 0, pN: 0.3, bow: 0.3, flN: 60, flD: 50 };
    /* (v25.1 F7) a small piece held IN his hand: the place grip lowered (its p) and the piece's foot at the top of the fist,
       this far off its palm in the lens's frame, so the fingers close on its lower edge and its face shows above them (at
       the palm itself the fist hid it whole; with the walking hand it stood behind a pointing finger; photographed, twelve
       ways) */
    const AMU_P = 1, AMU_HELD = [0.0, 0.07, -0.01];
    const BUDDHA_AT = [BUDDHA.x, BUDDHA.y, BUDDHA.z];
    /* (v25.2) HIS BODY IN THE FILMS (lcBody, b_build3): the wai's three heights (the brow, the breastbone, the chest), his
       look eased onto what he looks at, the bundle carried in the bowl as the bowl is lifted and tipped */
    const VW_HI = { wai: 1 }, VW_LO = { wai: 0.12 }, VW_0 = { wai: 0 };
    /* his look through keys [[t0, t1, target], ...] (target: 'lens', a point [x, y, z], or null for his take's own), each
       change eased from the one before between its two times: the head turns over a human time onto what he looks at (in
       v25.0 a look switched on in one frame, and his head turned there in it) */
    const _lkA = new THREE.Vector3(), _lkB = new THREE.Vector3(), _lkT = new THREE.Vector3();
    function lookPt(tg, out) {
      if (tg === 'lens') { camera.updateWorldMatrix(true, false); return camera.getWorldPosition(out); }
      return out.set(tg[0], tg[1], tg[2]);
    }
    function lcLook(t, keys, neck = 1.1) {
      const P = cast.lersi; if (!P) return;
      let from = null, to = null, u = 1;
      for (const [a, b, tg] of keys) { if (t < a) break; from = to; to = tg; u = ezk(t, a, b); }
      if (u >= 1) from = to;
      if (!from && !to) { P.lookAt = null; P.lookK = 0; P.neck = null; return; }
      if (from && to) { lookPt(from, _lkA); lookPt(to, _lkB); _lkT.lerpVectors(_lkA, _lkB, u); }
      else lookPt(to || from, _lkT);
      P.lookAt = _lkT; P.lookK = from && to ? 1 : to ? u : 1 - u; P.neck = neck;
    }
    /* his head's bow and his back's lean through keys, from the film's clock (set straight, so a seek lands on them) */
    function lcBow(P, v) { if (P) P.bow = P.bowNow = v; }
    const LC_HEAD = () => faceOf(cast.lersi, [LC.x, 0.74, LC.z]);
    const PG_HEAD = () => faceOf(cast.pong, [PSTOOL.x, 1.42, PSTOOL.z]);
    const UNDER = [0.3, 1.0, SHOP.z1 + 0.6];                             // under the shutter's edge, the corridor's light
    const top0 = COUNTER.h + 0.046;                                      // the counter's glass
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
        const all = pts.concat([at]);
        for (let it = 0; it < 24; it++) {
          /* each point's bearing and height from the look, in angles; the turn that centres their spread where it overflows */
          let a0 = Infinity, a1 = -Infinity, b0 = Infinity, b1 = -Infinity;
          for (const P of all) { const q = fitProject(eye, psi, th, fov, P), ax = Math.atan2(q[2], q[4]), ay = Math.atan2(q[3], Math.hypot(q[2], q[4]));
            a0 = Math.min(a0, ax); a1 = Math.max(a1, ax); b0 = Math.min(b0, ay); b1 = Math.max(b1, ay); }
          const tv = Math.tan(fov * Math.PI / 360), AX = Math.atan(FIT.x * tv * camera.aspect), AY = Math.atan(FIT.y * tv);
          const sx = a1 - a0 <= 2 * AX ? Math.min(Math.max(0, a1 - AX), a0 + AX) : (a0 + a1) / 2;
          const sy = b1 - b0 <= 2 * AY ? Math.min(Math.max(0, b1 - AY), b0 + AY) : (b0 + b1) / 2;
          psi -= sx; th += sy;
          let out = false;
          for (const P of all) { const q = fitProject(eye, psi, th, fov, P); if (Math.abs(q[0]) > FIT.x + 1e-3 || Math.abs(q[1]) > FIT.y + 1e-3) { out = true; break; } }
          if (!out || fov >= FIT.max) break;
          fov = Math.min(FIT.max, fov + 2);
        }
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
    /* his phone IN HIS HAND (the call, ending A): its own body, the counter phone's screen (one material, so the same
       drawing lights both); the counter's phone goes dark and away while this one is held */
    const handPhone = (() => {
      const g = new THREE.Group(); g.visible = false; g.userData.dyn = true; world.add(g);
      const body = new THREE.Mesh(new THREE.BoxGeometry(0.076, 0.158, 0.009), M({ color: 0x18181c, roughness: 0.25, metalness: 0.4 })); g.add(body);
      if (shop.phone) { const sc = new THREE.Mesh(new THREE.PlaneGeometry(0.068, 0.148), shop.phone.scr); sc.position.z = 0.0048; g.add(sc);
        /* (v25.2) the phone itself (the counter's model: a checked picture on white, then Meshy), standing up in his hand, its
           glass to the lens and the drawn screen laid on it; the box stands in until it lands */
        const hp = new THREE.Group(); hp.rotation.x = Math.PI / 2; g.add(hp);
        fitModel('e4phone', hp, 0.158, 'z', 0, 0).then(m => { if (!m || !alive) return; body.visible = false;
          hp.position.z = -m.userData.fit.y / 2; sc.position.z = m.userData.fit.y / 2 + 0.0004; }); }
      return g;
    })();
    /* the piece in his hand (the examination's fetch) and in Lersi Chin's (his wai over it): clones of the one on the
       shelf, made the first time they are wanted (the model is in by then; the curtain waits for it) */
    const held = { hand: null, lc: null, amulet: null };
    function pieceClone(slot) {
      const src = props.pieces[play.piece]; if (!src) return null;
      if (!held[slot] || held[slot].userData.piece !== play.piece) {
        if (held[slot] && held[slot].parent) held[slot].parent.remove(held[slot]);
        const c = src.clone(true); c.visible = false; c.userData.piece = play.piece; c.userData.dyn = true; world.add(c); held[slot] = c;
      }
      return held[slot];
    }
    /* a cased amulet from his tray (ending D: the customer's question answered) */
    const amuletHand = (() => { const g = new THREE.Group(); g.visible = false; g.userData.dyn = true; world.add(g); fitModel('e4somdej', g, 0.062, 'y', 0, 0); return g; })();
    /* the holy water from the mayom's leaves: a few drops falling through his view, a pure function of the film's clock */
    const drops = (() => {
      const g = new THREE.Group(); g.visible = false; g.userData.dyn = true; world.add(g);
      const m = B({ color: 0xe8f2f8, transparent: true, opacity: 0.55, depthWrite: false, fog: false });
      const geo = new THREE.PlaneGeometry(0.004, 0.05);
      for (let i = 0; i < 14; i++) { const d = new THREE.Mesh(geo, m); d.userData.seed = i; g.add(d); }
      return g;
    })();
    /* (v25.2) the drops leave the leaves on each flick's snap (`flicks`: the snaps' times; null: none), each drop's numbers
       drawn in one fixed order (v25.0 drew a hidden drop's three fewer, so every drop after it jumped when another came or
       went) */
    function dropsAt(t, flicks, eye) {
      if (!flicks) { drops.visible = false; return; }
      drops.visible = true;
      const r = rng(9917);
      drops.children.forEach((d, i) => {
        const flick = flicks[i % flicks.length] + r() * 0.08, ox = (r() - 0.5) * 0.7, oy = r() * 0.1, oz = r() * 0.25, u = t - flick;
        if (u < 0 || u > 0.9) { d.visible = false; return; }
        d.visible = true;
        d.position.set(eye[0] + ox, eye[1] + 0.35 - u * u * 4.9 - oy, eye[2] - 0.3 - oz);
        d.lookAt(camera.position.x, d.position.y, camera.position.z);
      });
    }
    /* the white thread on his wrist (the clearing's last gesture): a cotton loop on the right arm, drawn in the hands' pass */
    const wristThread = (() => {
      const g = new THREE.Group(); g.visible = false; g.userData.dyn = true;
      /* (v25.0 CP13) three turns ROUND the wrist: a torus's axis is its own z, and the arm runs along the arm's z (its fingers
         to −z), so the turns lie flat in the arm's xy and step along its z; turned a quarter about y, their axis lay across
         the wrist and they ran lengthwise through it, hidden inside the arm (found by drawing them red, thick and over
         everything, and reading their place off the arm) */
      for (let k = 0; k < 3; k++) { const tr = new THREE.Mesh(new THREE.TorusGeometry(0.033, 0.0022, 6, 32), M({ color: 0xf6f4ec, roughness: 0.85 }));
        tr.position.z = (k - 1) * 0.0055; g.add(tr); }
      return g;
    })();
    const WRIST = [0.012, -0.03, -0.075];                                // the wrist, in the arm's own frame (a little behind the palm)
    /* (v25.0 CP7) the mayom bundle set in one of its two resting places ('bowl' or 'mat'), as each film and phase needs */
    function mayomAt(w) {
      const g = props.mayom; if (!g || !g.userData.bowlP) return;
      g.position.copy(w === 'mat' ? g.userData.matP : g.userData.bowlP); g.rotation.copy(w === 'mat' ? g.userData.matR : g.userData.bowlR);
    }
    /* (v25.2) the bundle standing in the water, carried with the bowl as he lifts and tips it: its place in the bowl turned
       and moved as the bowl is (the bowl turns about its own foot) */
    const _bwq = new THREE.Quaternion(), _X1 = new THREE.Vector3(1, 0, 0);
    function stemInBowl(out) {
      const g = props.mayom, B0 = props.bowl.userData.home || (props.bowl.userData.home = props.bowl.position.clone());
      _bwq.setFromAxisAngle(_X1, props.bowl.rotation.x);
      return out.copy(g.userData.bowlP).sub(B0).applyQuaternion(_bwq).add(props.bowl.position);
    }
    function mayomInBowl() {
      const g = props.mayom; if (!g || !g.userData.bowlP) return;
      stemInBowl(g.position);
      g.quaternion.setFromEuler(g.userData.bowlR).premultiply(_bwq);
    }
    const _lpv = new THREE.Vector3();
    /* (v25.0 CP7) a held thing turned so its +x runs along `ax` and its +y (the mayom's face) as near `up` as that allows;
       (v25.2) let go, the film puts it back itself (the mayom stood in the water: mayomInBowl) */
    const _ox = new THREE.Vector3(), _oy = new THREE.Vector3(), _oz = new THREE.Vector3(), _om = new THREE.Matrix4();
    function orient(obj, ax, up) {
      _ox.set(ax[0], ax[1], ax[2]).normalize();
      _oy.set(up[0], up[1], up[2]); _oy.addScaledVector(_ox, -_oy.dot(_ox)).normalize();
      _oz.crossVectors(_ox, _oy);
      obj.quaternion.setFromRotationMatrix(_om.makeBasis(_ox, _oy, _oz));
    }
    /* (v25.0 CP7) the world point at a share (fx, fy) of the lens's frame, d metres out, for a lens of fovDeg — where a
       hand the engine places by its share of the frame (HPOSE) stands on THIS screen */
    function lensPoint(fx, fy, d, fovDeg) {
      camera.updateWorldMatrix(true, false);
      const hh = d * Math.tan(fovDeg * Math.PI / 360), hw = hh * camera.aspect;
      _lpv.set(fx * hw, fy * hh, -d); camera.localToWorld(_lpv);
      return [_lpv.x, _lpv.y, _lpv.z];
    }
    /* (v25.0 CP13) where his wrist IS on this screen: the hands are drawn in a scene of their own through their own lens
       (main.js's vmCam, 52° and at that scene's origin, whatever the film's lens), so the wrist is read off his arm there and
       given as its share of that frame and its depth — lensPoint then finds the room's point under it */
    const VM_FOV = 52;
    function wristShare() {
      const A = FL.api; if (!A || !A.armR) return null;
      A.armR.updateWorldMatrix(true, false);
      _lpv.set(WRIST[0], WRIST[1], WRIST[2]); A.armR.localToWorld(_lpv);
      const d = -_lpv.z; if (!(d > 0.05)) return null;
      const hh = d * Math.tan(VM_FOV * Math.PI / 360);
      return [_lpv.x / (hh * camera.aspect), _lpv.y / hh, d];
    }
    /* (v25.2) any point of his right arm, in the arm's own frame, as its share of the frame and its depth (wristShare's
       measure, for the wrist's line as well as its place) */
    function armShare(p) {
      const A = FL.api; if (!A || !A.armR) return null;
      A.armR.updateWorldMatrix(true, false);
      _lpv.set(p[0], p[1], p[2]); A.armR.localToWorld(_lpv);
      const d = -_lpv.z; if (!(d > 0.05)) return null;
      const hh = d * Math.tan(VM_FOV * Math.PI / 360);
      return [_lpv.x / (hh * camera.aspect), _lpv.y / hh, d];
    }
    function threadOn(on) {
      const A = FL.api; if (!A || !A.armR) return;
      if (on) { if (wristThread.parent !== A.armR) A.armR.add(wristThread); wristThread.position.set(WRIST[0], WRIST[1], WRIST[2]); wristThread.visible = true;
                if (A.handsRoot) A.handsRoot.visible = true; A.armR.visible = true; }
      else if (wristThread.parent) { wristThread.parent.remove(wristThread); wristThread.visible = false; }
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

    /* ================================================================ THE FILMS' PICTURES (§4), each a pure function of
       its own clock: every shot his eyes (he is never seen, Chad 9 Nov), named by what it must hold */

    /* O · THE FOG (§4.0): noon, the cases full, the grey on everything; a customer heard and never seen; his pockets; the
       note in his own hand */
    function openFrame(t) {
      const O = OPEN;
      fLook('DAY'); fogFilm(1);
      shopAt({ u: 1, led: 1, ceil: 1, night: false });
      propsAt({ till: 0, bag: 0, jacket: 0, fridge: 0 });
      shop.lapOn = 1; shop.lapMode = 'sales'; shop.phoneOn = 0;
      castVis({ goldman: true, lersi: false, pong: false });
      mallPass('open', t);
      const eye = [HIS.x + 0.12, 1.6, HIS.z + 0.18];
      if (t < O.o2) {
        /* O1 · from his place: along the right-hand cabinet's stock, full now, to the open front and the corridor — slow */
        const k = smo(sgk(t, 0.4, O.o2 - 0.2));
        shot(eye, aimEase(eye, [1.9, 1.15, -0.4], [0.5, 1.3, 4.8], k), 60, 52);
        return;
      }
      if (t < O.o3) {
        /* O2 · his eyes on the tray while she asks (never on her): the compartments under the glass; at "say again" they
           lift to the counter's front edge and fall back; at "I could not think properly" up to where she went */
        /* (v25.0 CP8) from the till's end of his place, the tray at his left hand: the laptop in front of him and the note
           by his phone both stay out of the frame on every screen (from his own place the laptop filled half a phone's) */
        const e1 = [HIS.x - 0.2, 1.56, HIS.z + 0.28];
        const tray = [-0.75, DISPLAY.floor, COUNTER.z - 0.04], edge = [-0.6, top0, COUNTER.z + COUNTER.d / 2];
        const kU = smo(sgk(t, O.q2o2b - 0.2, O.q2o2b + 0.8)) * (1 - smo(sgk(t, O.cu2a1b + 0.3, O.cu2a1b + 1.6)));
        const kOut = smo(sgk(t, O.q2o2 - 0.3, O.q2o2 + 2.4));
        let at = aimEase(e1, tray, edge, kU * 0.75);
        if (kOut > 0) at = aimEase(e1, at, [0.6, 1.35, 5.2], kOut);
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
      const e3 = lp3([HIS.x + 0.3, 1.5, HIS.z + 0.32], [NOTE.x - 0.02, 1.36, NOTE.z - 0.3], k);
      const pb = shop.phone ? shop.phone.base : null;
      fitShot(e3, note, lp(50, 36, k), lp(42, 28, k), [note, pb ? [pb.x, top0 + 0.005, pb.z] : null]);
    }

    /* P3 · THE CALL (a film from play, §4.1): his phone up, ringing; Pong; the dark shop while they talk; "Bring him." */
    function callFrame(t) {
      const C = CALL, lit = play.how === 'light';
      fLook(lit ? 'LIT' : 'NIGHT'); fogFilm(1);
      shopAt({ u: 0.42, led: lit ? 1 : 0.28, ceil: lit ? 1 : 0, night: true });
      castVis({ goldman: false, lersi: false, pong: false, mallA: false, mallB: false });
      const eye = [HIS.x + 0.15, 1.6, HIS.z + 0.35];
      if (t < C.ans + 0.7) {
        /* the phone from the counter into his hand, its screen calling; at the answer, up to his ear and out of the frame */
        shop.phoneMode = 'calling'; shop.phoneOn = wallNow() - t; shop.phoneSecs = null;
        if (shop.phone) shop.phone.g.visible = false;
        const kUp = smo(sgk(t, C.ans, C.ans + 0.6));
        handHold(handPhone, { screen: [lp(0.12, 0.9, kUp), lp(-0.28, 0.5, kUp), 0.42], face: true, tilt: -0.25 });
        shot(eye, lp3([0.1, top0, COUNTER.z - 0.1], [0.4, 1.2, 1.8], smo(sgk(t, C.ans - 0.2, C.ans + 0.8))), 56, 48);
        return;
      }
      handFree();
      shop.phoneMode = 'call'; shop.phoneSecs = t - C.ans;
      /* while they talk: the shop in the dark — the stand by the door (flowers now), then round to his altar's lamp under
         Pong's offer, down to the glass at "trust me", back up to the door at "I was there with my mother", and on the
         shutter's lit edge for "Bring him." */
      const door = [STAND.x - 0.1, 1.45, STAND.z], altar = [0, 1.55, SHOP.z0 + 0.2], glass = [0.0, top0, COUNTER.z + 0.1];
      let at;
      if (t < C.offer) at = aimEase(eye, [0.6, 1.3, 1.2], door, smo(sgk(t, C.ans + 0.7, C.q2c1 + 2.0)));
      else if (t < C.q2c2) at = aimTurn(eye, door, altar, smo(sgk(t, C.offer + 1.5, C.offer + 6.5)), 1);
      else if (t < C.pg2c3) at = aimTurn(eye, altar, glass, smo(sgk(t, C.q2c2 - 0.4, C.q2c2 + 1.4)), -1);
      else if (t < C.q2c3) at = aimEase(eye, glass, door, smo(sgk(t, C.pg2c3 + 1.0, C.pg2c3 + 4.0)));
      else at = aimEase(eye, door, UNDER, smo(sgk(t, C.q2c3 - 0.2, C.q2c3 + 1.2)));
      /* (v25.0 CP4) a slow push in on each held subject, eased back out as his eyes move on: the stand while he tells
         Pong, the altar under Pong's offer (held still for 7-8 s each, the frame read as frozen) */
      const pushA = smo(sgk(t, C.q2c1 + 2.0, C.offer + 1.0)) * (1 - smo(sgk(t, C.offer + 1.0, C.offer + 3.5)));
      const pushB = smo(sgk(t, C.offer + 6.0, C.q2c2)) * (1 - smo(sgk(t, C.q2c2 - 0.4, C.q2c2 + 1.4)));
      fLens((isNarrow() ? 58 : 50) - 8 * pushA - 10 * pushB);
      camAt(eye, at);
    }

    /* THE VISIT (§4.2, a film): the next evening, the shutter lifted for them; the Lersi master looks along the cases and
       up at the altar, and wais the Buddha before anyone; Pong's word; "New shop... tired owner"; his mat laid */
    const V_EYE = [-0.95, 1.62, -2.2];                                   // he waits behind the counter's left end, his altar to his right
    const LC_STANDS = { x: 0, z: -0.35 };                                // where Lersi Chin stops, before the counter
    const PG_STANDS = { x: 0.9, z: -0.25 };
    const _lv = new THREE.Vector3();
    function visitFrame(t) {
      const V = VISIT_T;
      fLook('VISIT'); fogFilm(1);
      const uLift = lp(0.42, 0.86, smo(sgk(t, V.lift, V.lift + 1.9)));
      shopAt({ u: uLift, led: 0.9, ceil: 0, night: true });
      castVis({ goldman: false, mallA: false, mallB: false, lersi: true, pong: true });
      const L = cast.lersi, P = cast.pong;
      const matT = V.mat + 2.1;                                          // the cut to him seated
      props.lcThings.visible = t >= V.mat;
      for (const f of props.flames) f.material.opacity = 0;
      if (t < V.mat) {
        /* outside the shutter, then in: Pong first, then Lersi Chin, unhurried; his eyes along the cases as he comes */
        if (P && P.ready) {
          if (t < V.in) fPut(P, 0.45, 3.4, Math.PI, { y: 0, seated: false });
          else fWalk(P, [[0.45, 3.4], [0.6, 2.0], [0.85, 0.4], [PG_STANDS.x, PG_STANDS.z]], V.in + 0.2, V.in + 5.0, t, { ry: faceTo(PG_STANDS.x, PG_STANDS.z, V_EYE[0], V_EYE[2]) });
          if (t > V.intro - 0.3 && t < V.turn + 0.4) gaze(P, true); else { P.lookAt = t > V.in + 5 ? (L && L.head) || null : null; P.neck = null; }
        }
        if (L && L.ready) {
          const lcRy = t < V.turn ? Math.PI : lp(Math.PI, Math.PI + angTo(Math.PI, faceTo(LC_STANDS.x, LC_STANDS.z, V_EYE[0], V_EYE[2])), smo(sgk(t, V.turn - 0.3, V.turn + 0.9)));
          if (t < V.in + 1.0) fPut(L, -0.35, 3.85, Math.PI, { y: 0, seated: false });
          else fWalk(L, [[-0.35, 3.85], [-0.3, 2.4], [-0.15, 0.9], [LC_STANDS.x, LC_STANDS.z]], V.in + 1.0, V.altar - 0.2, t, { ry: lcRy });
          if (t >= V.altar - 0.2) L.group.rotation.y = lcRy;
          /* his look: the left cabinet, the right, then up to the Buddha; at the turn, the one whose shop it is (v25.2: each
             eased over most of a second; v25.0 jumped from one to the next in a frame) */
          L.look = 0;
          lcLook(t, [[V.in + 2.2, V.in + 2.9, [-2.0, 1.3, 0.9]], [V.in + 4.0, V.in + 4.8, [2.0, 1.25, 0.2]],
                     [V.altar - 1.3, V.altar - 0.4, BUDDHA_AT], [V.turn - 0.3, V.turn + 0.5, 'lens']], 1.1);
          /* (v25.2) his wai to the Buddha, to the brow: the hands up over a second, his head and shoulders bowing into them
             a little after, held, the head up before the hands come down; a nod to the one whose shop it is as he turns to
             him (v25.0 gave a full wai there and another a breath later: an elder greeting first, and twice); and his answer
             to the client's wai, to the chest, held into the cut. Each change over a human time, never in a frame */
          const wH = handKeys(t, [[V.altar + 0.1, V.altar + 1.1, VW_HI], [V.intro - 0.95, V.intro - 0.05, null],
                                  [V.wai + 0.25, V.wai + 1.15, VW_LO]]);
          const lean = keyed(t, 0, [[V.altar + 0.45, V.altar + 1.3, 0.12], [V.intro - 1.15, V.intro - 0.3, 0], [V.wai + 0.5, V.wai + 1.25, 0.06]]);
          lcBow(L, keyed(t, 0, [[V.altar + 0.45, V.altar + 1.3, 0.3], [V.intro - 1.15, V.intro - 0.35, 0],
                                [V.turn + 0.3, V.turn + 0.75, 0.16], [V.turn + 0.85, V.turn + 1.45, 0], [V.wai + 0.5, V.wai + 1.2, 0.16]]));
          lcBody(wH || lean ? { R: wH, L: wH, lean } : null);
        }
        /* his own wai to the master (one wai; three bows are only for the Buddha) */
        waiAt(smo(sgk(t, V.wai, V.wai + 0.5)) * (1 - smo(sgk(t, V.wai + 1.3, V.mat - 0.05))));
        let at;
        if (t < V.in) at = [0.1, 0.75, 3.1];                             // the shutter's edge, their feet under it, then them as it rises
        if (t >= V.lift && t < V.in) at = lp3([0.1, 0.75, 3.1], [0.1, 1.35, 3.6], smo(sgk(t, V.lift, V.in)));
        if (t >= V.in && t < V.intro) { const h = headOf(L, [0, 1.6, 2.0]); at = [h[0], h[1] - 0.15, h[2]]; }
        if (t >= V.intro && t < V.turn) at = aimEase(V_EYE, headOf(L, [0, 1.5, -0.35]), headOf(P, [PG_STANDS.x, 1.6, PG_STANDS.z]), smo(sgk(t, V.intro - 0.2, V.intro + 0.9)));
        if (t >= V.turn) at = aimEase(V_EYE, headOf(P, [PG_STANDS.x, 1.6, PG_STANDS.z]), faceOf(L, [0, 1.55, -0.35]), smo(sgk(t, V.turn - 0.1, V.turn + 1.0)));
        const fl = t < V.in ? (isNarrow() ? 56 : 48) : t < V.turn ? (isNarrow() ? 52 : 44) : lp(isNarrow() ? 52 : 44, isNarrow() ? 44 : 36, smo(sgk(t, V.turn, V.wai)));
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
        for (const o of [props.bowl, props.mayom, props.thread, props.cloth, props.khan, props.yaam]) if (o) o.visible = false;
        const e = [-0.95, 1.6, 1.4];
        shot(e, [0, 0.0, lp(-0.6, 0.6, smo(sgk(t, V.mat, matT)))], 58, 50);
        return;
      }
      /* seated now, his things set out; Pong on his stool; the master looks up at him */
      propsAt({ mat: 1 });
      for (const o of [props.bowl, props.mayom, props.thread, props.cloth, props.khan, props.yaam]) if (o) o.visible = true;
      mayomAt('bowl');
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
       hands to the client's wrist, his right over it and his left under, as he leans in from the waist to meet it (v25.0's
       right arm, straight out from an upright back, stopped short of a wrist 0.8 m off and hung in the air), his eyes down
       to it and back up to the client's face; the stillness, his head lowered and his back easing over; his look to the
       shelf by the door; the piece in his joined hands, raised to his brow and bowed over (in v25.0 the piece in his hands
       was never shown); his left hand home and his right laying it on the clean cloth, bending to it. Each change over a
       human time */
    const EX_WR = [LC.x + 0.02, 0.3, LC.z + 0.4];                      // the client's wrist, met between them, under the frame's foot
    const EX_PW0 = { wai: 0.15 }, EX_PW1 = { wai: 0.6 };
    function examBody(t) {
      const X = EXAM, L = cast.lersi; if (!L || !L.ready) return;
      const tBack = X.fetch + 3.9, tCloth = X.lc2e8 + SECS.lc2e8 * 0.86;
      const pl2 = pieceClone('lc'), c0 = props.cloth.position, shelf = [SHELF.x + 0.02, SHELF.y + 0.04, SHELF.z];
      const onCloth = { palm: [c0.x + 0.01, props.clothTop + 0.045, c0.z + 0.01], aim: 'down', pole: 'floor' };
      const R = handKeys(t, [[X.lc2e1 + 0.3, X.lc2e1 + 1.45, { palm: [EX_WR[0] - 0.01, EX_WR[1] + 0.035, EX_WR[2]], aim: 'down', pole: 'reach' }],
                             [X.lc2e6 - 0.1, X.lc2e6 + 1.0, null],
                             [tBack - 0.01, tBack, EX_PW0], [tBack + 0.25, tBack + 1.25, EX_PW1],
                             [tCloth - 1.35, tCloth - 0.15, onCloth]]);
      const Lh = handKeys(t, [[X.lc2e1 + 0.45, X.lc2e1 + 1.6, { palm: [EX_WR[0] + 0.03, EX_WR[1] - 0.035, EX_WR[2] - 0.01], aim: 'under', pole: 'reach' }],
                              [X.lc2e6 - 0.2, X.lc2e6 + 0.85, null],
                              [tBack - 0.01, tBack, EX_PW0], [tBack + 0.25, tBack + 1.25, EX_PW1],
                              [tCloth - 1.6, tCloth - 0.75, null]]);
      const lean = keyed(t, 0, [[X.lc2e1 + 0.2, X.lc2e1 + 1.4, 0.32], [X.lc2e6 - 0.1, X.lc2e6 + 1.0, 0],
                                [X.still + 0.4, X.still + 2.0, 0.08], [X.eyes - 1.2, X.eyes - 0.2, 0],
                                [tBack + 0.4, tBack + 1.3, 0.1], [tCloth - 1.35, tCloth - 0.2, 0.3]]);
      const side = keyed(t, 0, [[tCloth - 1.35, tCloth - 0.2, -0.18]]), twist = keyed(t, 0, [[tCloth - 1.35, tCloth - 0.2, -0.2]]);
      const hold = t >= tBack && t < tCloth ? pl2 : null;
      if (pl2) pl2.visible = !!hold;
      lcBody({ R, L: Lh, lean, side, twist, hold, holdBy: 'wai', holdMix: ezk(t, tCloth - 1.6, tCloth - 0.9) });
      lcLook(t, [[X.lc2e1 + 0.35, X.lc2e1 + 1.1, EX_WR], [X.lc2e1 + 1.6, X.lc2e1 + 2.3, 'lens'],
                 [X.still - 0.3, X.still + 0.6, null], [X.eyes - 0.1, X.eyes + 0.9, shelf],
                 [tBack - 0.01, tBack, [LC.x, 0.55, LC.z + 0.22]], [X.lc2e8 - 0.5, X.lc2e8 + 0.2, 'lens'],
                 [tCloth - 1.35, tCloth - 0.55, [c0.x, c0.y, c0.z]], [X.believe - 0.01, X.believe, 'lens']], 1.1);
      lcBow(L, keyed(t, 0, [[X.still + 0.2, X.still + 1.5, 0.24], [X.eyes - 1.0, X.eyes - 0.15, 0],
                            [tBack - 0.01, tBack, 0.12], [tBack + 0.4, tBack + 1.3, 0.26], [X.lc2e8 - 0.6, X.lc2e8, 0],
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
      props.lcThings.visible = true; propsAt({ mat: 1 }); mayomAt('bowl');
      const L = cast.lersi, P = cast.pong;
      if (P) { P.lookAt = L && L.head ? L.head : null; P.neck = null; }
      const shelf = [SHELF.x + 0.02, SHELF.y + 0.04, SHELF.z];
      /* the piece: on the shelf until he takes it; in his hand to the mat; in the master's hands; on the cloth */
      const tTake = X.fetch + 2.2, tBack = X.fetch + 3.9, tCloth = X.lc2e8 + SECS.lc2e8 * 0.86;
      pieceShow(t < tTake); clothPiece(t >= tCloth);
      const ph = pieceClone('hand');
      if (t < X.still) {
        /* the wrist taken (his hands out of the frame's foot) while the questions are asked (his body: examBody) */
        const down = smo(sgk(t, X.q2e3 - 0.1, X.q2e3 + 0.3)) * (1 - smo(sgk(t, X.lc2e5 - 0.3, X.lc2e5 + 0.3)));   // "...Yes." — his eyes drop
        const at = LC_HEAD(); at[1] -= 0.25 * down;
        fLens(lp(isNarrow() ? 52 : 44, isNarrow() ? 48 : 40, smo(sgk(t, 0, X.still))));
        camAt(KN_EYE, at);
        return;
      }
      if (t < X.eyes) {
        /* "Now, quiet." — his eyes shut, his head lowered: the stillness, pushed in on; over his shoulder, the altar's
           Buddha; back */
        const k = smo(sgk(t, X.still + 1.2, X.still + 3.6)) * (1 - smo(sgk(t, X.eyes - 2.0, X.eyes - 0.2)));
        fLens(lp(isNarrow() ? 48 : 40, isNarrow() ? 42 : 34, smo(sgk(t, X.still, X.eyes))));
        camAt(KN_EYE, aimEase(KN_EYE, LC_HEAD(), BUDDHA_AT, k * 0.85));
        return;
      }
      if (t < X.fetch) {
        /* his eyes open on the door: "That one... from there?" — the look follows his, round to the shelf by the door */
        const k = smo(sgk(t, X.lc2e7 + 0.4, X.lc2e7 + 2.2));
        /* (v25.1 F11) narrowed onto the shelf as the look arrives: at 40/32 the piece was a few pixels on a dark bracket,
           2.8 m off and seen from below (photographed, both screens) */
        fLens(lp(isNarrow() ? 50 : 42, isNarrow() ? 22 : 17, smo(sgk(t, X.q2e5, X.fetch))));
        camAt(KN_EYE, aimTurn(KN_EYE, LC_HEAD(), shelf, k, 1));
        return;
      }
      if (t < tBack) {
        /* up, to the shelf; his hand takes it */
        const kw = smo(sgk(t, X.fetch, X.fetch + 2.0));
        const e = [lp(CL.x, SHELF.x + 0.62, kw), lp(KNEEL.y, 1.6, smo(sgk(t, X.fetch, X.fetch + 0.8))), lp(CL.z, SHELF.z - 0.42, kw)];
        /* (v25.0 CP7) narrowed as he arrives: the piece large enough to know */
        fLens(lp(isNarrow() ? 56 : 48, isNarrow() ? 40 : 34, kw));
        /* (v25.1 F7) and his eyes go down to his hand as it closes: the piece leaves the shelf above the frame and is seen
           in his hand (aimed at the shelf throughout, it jumped from the shelf into a fist half a frame below it) */
        const dn = smo(sgk(t, tTake - 0.6, tTake + 0.2));
        camAt(e, [shelf[0], shelf[1] - 0.05 * kw - 0.5 * dn, shelf[2]]);
        /* (v25.1 F7) his hand reaches for it (the place grip, eased in before he takes it) and holds it by its foot (placed
           at a point of the screen, it hung in the air before the shelf with his open hand below it, by photograph) */
        const A = FL.api, gk = smo(sgk(t, tTake - 0.8, tTake));
        if (gk > 0.001 && A && A.handPose) { A.handPose('place', gk, { p: AMU_P }); FL.grip = true; if (A.handsRoot) { A.handsRoot.visible = true; A.armR.visible = true; } }
        if (t >= tTake && ph) handHold(ph, { lens: AMU_HELD, face: true, tilt: -0.2 });
        else if (gk <= 0.001) handFree();
        return;
      }
      handFree();
      if (ph) ph.visible = false;
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
        shot([c0.x + 0.17, 0.5, c0.z + 0.42], [c0.x, c0.y + 0.03, c0.z], 36, 30);
        return;
      }
      /* "According to my practice, I believe..." — pushed in; "By him?" — "I didn't say that. I said on you." */
      fLens(lp(isNarrow() ? 50 : 42, isNarrow() ? 42 : 34, smo(sgk(t, X.believe, X.q2e6))));
      camAt(KN_EYE, LC_HEAD());
    }

    /* P7 · THE CLEARING (§4.3, watched; unskippable the first time): his hands together, his eyes down; the homage to his
       teachers; Namo tassa three times; the three Sakkatvā verses (captioned, the Pali over its meaning); the fog lifting
       under the second and third; the water; the leaves; the thread at his wrist; the advice */
    /* (v25.2) THE CLEARING, HIS BODY: one choreography on the film's clock apart from the shots (clearShots). Chad, 10 Nov
       2026: "his wai pose, he spraying water and taking water bowl, etc is all extremely bad ... the actions are all very
       abrupt and sudden and not natural". The homage: his hands rise to a wai at his brow over a second, his head and back
       bowing into it, and come down joined to the foot of his chest for the verses (v25.0 dropped them to his lap and
       raised them again). The water: his joined hands part and go down to the bowl's sides as he bends to it; he lifts it,
       the bundle standing in it, holds it out and tips it to the client, brings it back and sets it down (v25.0 slid the
       bowl through the air ahead of hands that never reached it). The leaves: his right hand lifts the bundle from the
       water, dips it once, raises it before his shoulder and flicks it three times, each a short cock and a quick snap of
       the wrist, the water leaving the leaves on the snap (v25.0 waved it in slow circles, and the drops fell on their own
       beat); the bundle stood back in the bowl. The thread: both hands to the client's wrist, the right winding the thread
       round it and the knot pulled twice, then home. His look and his head go with each. The bowl is before him on the
       mat now, in his reach (on his left, at v25.0's place, his right hand could not reach the bundle standing in it) */
    const CB_HI = { wai: 0.7 }, CB_LO = { wai: -0.5 }, CB_BOWL = { bowl: 1 };
    /* (v25.2) his back's lean to the bowl on the mat, his hands on its sides (both, or the right alone): measured, the wrists
       land on the rim with nothing to spare — the clearing's lift and set-down, ending B's packing and the decision's */
    const LEAN_MAT = 0.65;
    const CB_OFF = [LC.x, 0.42, LC.z + 0.46];                          // the bowl held out to the client
    const CB_FL = [LC.x - 0.06, 0.8, LC.z + 0.24];                     // his right palm raised for the flicks
    const _cg = new THREE.Vector3(), _cw = new THREE.Vector3(), _cu = new THREE.Vector3(), _cv = new THREE.Vector3(), _cf = new THREE.Vector3(), _ce = new THREE.Vector3();
    const _cqH = new THREE.Quaternion(), _cqB = new THREE.Quaternion(), _cF = new THREE.Vector3(), _cN = new THREE.Vector3(), _cA = new THREE.Vector3();
    function clearSnaps() { const S = CLEARF.sprinkle; return [S + 2.4, S + 3.05, S + 3.7]; }
    /* a value through the flicks: at rest, cocked just before each snap, snapped, and back */
    function flickK(t, rest, cock, snap) {
      const keys = [];
      for (const s of clearSnaps()) keys.push([s - 0.32, s - 0.04, cock], [s - 0.04, s + 0.1, snap], [s + 0.1, s + 0.45, rest]);
      return keyed(t, rest, keys);
    }
    /* the bowl: on the mat; lifted with the bundle standing in it and held out; tipped to him; set down again (placed
       before the shots, which look at it) */
    function clearBowl(t) {
      const K = CLEARF, W = K.water, S = K.sprinkle;
      const B0 = props.bowl.userData.home || (props.bowl.userData.home = props.bowl.position.clone());
      const bu = ezk(t, W + 0.6, W + 1.8) * (1 - ezk(t, W + 4.0, W + 5.1));
      props.bowl.position.set(lp(B0.x, CB_OFF[0], bu), lp(B0.y, CB_OFF[1], bu), lp(B0.z, CB_OFF[2], bu));
      props.bowl.rotation.x = 0.35 * ezk(t, W + 2.2, W + 2.85) * (1 - ezk(t, W + 3.4, W + 3.95));
      if (!(t >= S + 0.5 && t < S + 4.9)) mayomInBowl();
    }
    function clearBody(t) {
      const K = CLEARF, L = cast.lersi, W = K.water, S = K.sprinkle, T = K.thread;
      const B0 = props.bowl.userData.home;
      const held = t >= S + 0.5 && t < S + 4.9;
      if (!L || !L.ready || !B0) return;
      /* his right palm where it takes the bundle standing in the water (the tie then lies in it where it stood) */
      stemInBowl(_cg);
      const grab = (dy) => ({ palm: [_cg.x - 0.012, _cg.y + dy, _cg.z], aim: 'stem', pole: 'floor' });
      /* the flicks: the palm a little up and back as the wrist cocks, down and forward as it snaps; the fingers' pitch with it */
      const fy = flickK(t, -0.35, 0.05, -0.75), dy = flickK(t, 0, 0.03, -0.04), dz = flickK(t, 0, -0.02, 0.05);
      const fl = { palm: [CB_FL[0], CB_FL[1] + dy, CB_FL[2] + dz], aim: { f: [0.05, fy, 0.94], n: [1, 0, 0] }, pole: 'flick' };
      /* the thread: the client's wrist where his hand is drawn, the line of his forearm, and the two ways round it */
      let tieR = null, tieL = null;
      if (t >= T - 0.1 && t < K.advice) {
        const fov = camera.fov, w1 = armShare(WRIST), w2 = armShare([WRIST[0], WRIST[1], WRIST[2] - 0.08]);
        const hw = w1 ? lensPoint(w1[0], w1[1], w1[2], fov) : lensPoint(0.296, -0.319, 0.42, fov);
        const hh = w2 ? lensPoint(w2[0], w2[1], w2[2], fov) : [hw[0], hw[1], hw[2] - 0.08];
        _cw.set(hw[0], hw[1], hw[2]); _cu.set(hh[0] - hw[0], hh[1] - hw[1], hh[2] - hw[2]).normalize();
        camera.getWorldPosition(_ce); _cv.copy(_cw).sub(_ce); _cv.addScaledVector(_cu, -_cv.dot(_cu)).normalize();   // the far side
        _cf.crossVectors(_cu, _cv).normalize(); if (_cf.y < 0) _cf.negate();                                        // over the top
        /* the right hand on the wrist, winding to and fro over its far side three times; the left under it; the knot
           pulled twice along it */
        const u = (t - (T + 1.45)) / 1.9, amp = ez5(u / 0.15) * (1 - ez5((u - 0.85) / 0.15));
        const th = 0.7 + 0.6 * Math.sin(2 * Math.PI * 3 * Math.max(0, Math.min(1, u))) * amp;
        const pull = 0.025 * Math.abs(Math.sin(2 * Math.PI * Math.max(0, Math.min(1, (t - (T + 3.45)) / 0.65))));
        const r = 0.042, pr = [hw[0] + r * (Math.cos(th) * _cf.x + Math.sin(th) * _cv.x) + _cu.x * pull,
                               hw[1] + r * (Math.cos(th) * _cf.y + Math.sin(th) * _cv.y) + _cu.y * pull,
                               hw[2] + r * (Math.cos(th) * _cf.z + Math.sin(th) * _cv.z) + _cu.z * pull];
        tieR = { palm: pr, aim: 'tie', pole: 'tie' };
        tieL = { palm: [hw[0] - 0.036 * _cf.x + 0.012 * _cv.x - _cu.x * pull, hw[1] - 0.036 * _cf.y + 0.012 * _cv.y - _cu.y * pull,
                        hw[2] - 0.036 * _cf.z + 0.012 * _cv.z - _cu.z * pull], aim: 'under', pole: 'tie' };
      }
      const R = handKeys(t, [[K.homage + 1.4, K.homage + 2.5, CB_HI], [K.sak - 0.6, K.sak + 0.8, CB_LO],
                             [W - 0.5, W + 0.5, CB_BOWL],
                             [S - 0.2, S + 0.5, grab(0)], [S + 0.55, S + 0.95, grab(0.12)], [S + 1.0, S + 1.3, grab(0.025)],
                             [S + 1.35, S + 2.15, fl], [S + 4.15, S + 4.9, grab(0)], [S + 4.95, S + 5.7, null],
                             [T + 0.3, T + 1.4, tieR], [T + 4.15, T + 4.95, null]]);
      const Lh = handKeys(t, [[K.homage + 1.4, K.homage + 2.5, CB_HI], [K.sak - 0.6, K.sak + 0.8, CB_LO],
                              [W - 0.5, W + 0.5, CB_BOWL], [S - 0.25, S + 0.55, null],
                              [T + 0.4, T + 1.45, tieL], [T + 4.1, T + 4.9, null]]);
      const lean = keyed(t, 0, [[K.homage + 1.8, K.homage + 2.7, 0.12], [K.sak - 0.4, K.sak + 0.6, 0.05],
                                [W - 0.5, W + 0.5, LEAN_MAT], [W + 0.6, W + 1.8, 0.3], [W + 4.0, W + 5.1, LEAN_MAT], [S - 0.2, S + 0.5, 0.55],
                                [S + 1.35, S + 2.15, 0.08], [S + 4.15, S + 4.9, 0.55], [S + 4.95, S + 5.7, 0],
                                [T + 0.2, T + 1.3, 0.6], [T + 4.1, T + 4.95, 0]]);
      const twist = keyed(t, 0, [[S + 1.35, S + 2.15, 0.1], [S + 4.15, S + 4.9, 0]]);
      /* the bundle in his hand: its leaves up out of his fist, swung back as the wrist cocks and down at the client as it
         snaps; turned there from the way it stood in the water as he takes it, and back as he stands it in it again */
      const swing = flickK(t, 0.25, -0.35, 1.4) + 0.95 * ezk(t, S + 1.0, S + 1.15) * (1 - ezk(t, S + 1.2, S + 1.35));
      const toHand = ezk(t, S + 0.5, S + 0.95) * (1 - ezk(t, S + 4.45, S + 4.9));
      const holdAt = (obj, H) => {
        H.bone.getWorldQuaternion(_cqH); _cF.copy(H.fL).applyQuaternion(_cqH); _cN.copy(H.nL).applyQuaternion(_cqH);
        _cA.crossVectors(_cF, _cN).multiplyScalar(Math.cos(swing)).addScaledVector(_cF, Math.sin(swing));
        orient(obj, [_cA.x, _cA.y, _cA.z], [_cN.x, _cN.y, _cN.z]); _cqH.copy(obj.quaternion);
        stemInBowl(_ce); _cqB.setFromEuler(obj.userData.bowlR).premultiply(_bwq);
        obj.quaternion.slerpQuaternions(_cqB, _cqH, toHand);
      };
      lcBody({ R, L: Lh, lean, twist, hold: held ? props.mayom : null, holdBy: 'R', holdAt });
      lcLook(t, [[W - 0.5, W + 0.2, [B0.x, 0.12, B0.z]], [W + 1.3, W + 2.0, 'lens'], [W + 3.9, W + 4.5, [B0.x, 0.12, B0.z]],
                 [S + 1.35, S + 2.0, [CL.x, 1.0, CL.z]], [S + 4.1, S + 4.6, [B0.x, 0.12, B0.z]], [S + 5.0, S + 5.6, 'lens'],
                 [T + 0.2, T + 0.9, tieR ? tieR.palm : 'lens'], [K.advice - 0.01, K.advice, 'lens']], 1.1);
      lcBow(L, keyed(t, 0.08, [[K.homage + 1.8, K.homage + 2.7, 0.24], [K.sak - 0.4, K.sak + 0.6, 0.1], [K.lift + 0.5, K.lift + 2.5, 0.06],
                               [W - 0.4, W + 0.4, 0.16], [W + 1.2, W + 1.9, 0], [W + 3.9, W + 4.5, 0.14], [W + 5.0, W + 5.6, 0.1],
                               [S + 1.4, S + 2.1, -0.04], [S + 4.1, S + 4.6, 0.14], [S + 5.0, S + 5.8, 0],
                               [T + 0.3, T + 1.3, TIE.bow], [T + 4.1, T + 4.9, 0]]));
      L.look = 1;
    }
    function clearFrame(t) { clearBowl(t); clearShots(t); clearBody(t); }
    function clearShots(t) {
      const K = CLEARF;
      /* the lift: grey to colour over the second and third verses (≈ 20 s), his eyes coming up as it goes */
      const lift = smo(sgk(t, K.lift, K.water - 0.6));
      fogFilm(1 - lift);
      fLook(t < K.lift ? 'VISIT' : 'CLEAR', t < K.lift ? 0 : K.water - K.lift);
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
      /* his own hands: together from "Hands together", down for the water and the thread, up again for the advice */
      const handsK = smo(sgk(t, K.lc2k0 + 0.6, K.lc2k0 + 1.4)) * (1 - smo(sgk(t, K.water - 0.6, K.water)));
      waiAt(handsK);
      /* (v25.0 CP13) his own right hand is drawn only while a clasp holds it and for the thread: hidden in every other frame
         before it, so a seek lands on the same picture */
      if (handsK <= 0.001 && t < K.thread && FL.api && FL.api.handsRoot) FL.api.handsRoot.visible = false;
      /* (his eyes "closed" are the film's own fade track, dimmed and never black: clearFilm) */
      /* the master: his wai to his teachers over the tray, the chant, the mayom, the bowl, the thread */
      let at = LC_HEAD();
      if (t < K.water) {
        /* (his body: clearBody) (v25.0 CP7) the verses chanted with his hands joined over the bowl, the mayom standing in
           its water (an open hand raised by his face to hold it read as "stop"; held between his palms, its leaves covered
           his face — both by photograph); (v25.0 CP13) his wrists at the foot of his chest: at lift 0.3 the joined fingers
           stood before his face from the kneeling eye, the wrists being what is carried to the point (by photograph) */
        /* his eyes down on his hands and the mat (the tray, the candles' light at the top of the frame); up as it lifts */
        const down = [CL.x, 0.25, CL.z - 0.65];                         // (v25.2) with the tray, 10 cm nearer him than v25.0's
        /* (v25.0 CP7) not one still frame for forty seconds: a slow push in on the tray's candles under Namo tassa, his
           eyes drawn up to the master's joined hands and the leaves as the verses begin, up to his face as the grey
           lifts; a breath under it all */
        const toHands = smo(sgk(t, K.sak - 1.0, K.sak + 3.0)), push = smo(sgk(t, K.homage + 1.0, K.sak)) * (1 - toHands);
        const base = aimEase(KN_EYE, down, [LC.x, 0.5, LC.z + 0.22], toHands * 0.75);
        fLens((isNarrow() ? 54 : 46) - 8 * push - 4 * toHands * (1 - lift));
        camAt([KN_EYE[0], KN_EYE[1] + 0.004 * Math.sin(t * 2 * Math.PI / 4.6), KN_EYE[2]], aimEase(KN_EYE, base, LC_HEAD(), 0.15 + 0.85 * lift));
        return;
      }
      if (t < K.sprinkle) {
        /* "Drink. A little." — the bowl lifted and held out to him in both hands; he leans in to it; a sip (his body and
           the bowl: clearBody). (v25.2) The bowl is where his hands can hold it out, half a metre before him, so the client
           leans in to drink, and the lens goes with him */
        const lean = ezk(t, K.water + 1.1, K.water + 2.1) * (1 - ezk(t, K.water + 3.6, K.water + 4.5));
        const e = [KN_EYE[0], KN_EYE[1] - 0.14 * lean, KN_EYE[2] - 0.3 * lean], bw = props.bowl.position;
        fLens(isNarrow() ? 54 : 46);
        camAt(e, aimEase(e, LC_HEAD(), [bw.x, bw.y + 0.1, bw.z], 0.25 + 0.5 * ezk(t, K.water + 0.4, K.water + 1.6) * (1 - ezk(t, K.water + 3.8, K.water + 4.8))));
        return;
      }
      if (t < K.thread) {
        /* the leaves dipped and flicked toward him: the drops falling through his view on each snap (his body: clearBody) */
        dropsAt(t, clearSnaps().map(s => s + 0.04), KN_EYE);
        fLens(isNarrow() ? 56 : 48);
        camAt(KN_EYE, [LC_HEAD()[0], LC_HEAD()[1] + 0.15, LC_HEAD()[2]]);
        return;
      }
      dropsAt(t, null, KN_EYE);
      if (t < K.advice) {
        /* "Your wrist." — his right hand out, the white thread tied round it in the master's hands */
        /* (v25.0 CP7) his right hand held out INTO the frame (an engine pose, `place`: its palm at that share of the frame
           on every screen; with `reach`'s, two thirds down, his wrist and the thread lay under the frame's edge, by
           photograph) */
        /* (v25.0 CP13) and he LEANS IN to it, his eyes going down from the master's face to his own wrist, the master
           leaning to meet it: from where he knelt, his hand (drawn 35 cm from his eye) filled a phone from its middle down
           and hid the master's face, and the master's hands, a metre off in the room, met it only on the screen (by
           photograph). They go to the wrist where it is drawn (wristShare) */
        const A = FL.api, lean = smo(sgk(t, K.thread, K.thread + 1.4));
        if (A && A.handPose) A.handPose('place', smo(sgk(t, K.thread, K.thread + 0.9)), { p: isNarrow() ? TIE.pN : TIE.p });
        if (A && A.handsRoot) { A.handsRoot.visible = true; A.armR.visible = true; }
        const fl = lp(isNarrow() ? 56 : 48, isNarrow() ? TIE.flN : TIE.flD, lean);
        fLens(fl);
        const e = [KN_EYE[0], KN_EYE[1] - TIE.dy * lean, KN_EYE[2] - TIE.dz * lean], h0 = LC_HEAD();
        camAt(e, aimEase(e, [h0[0], h0[1] + 0.15, h0[2]], TIE.aim, lean));
        /* (his hands at the wrist: clearBody) the thread seen once his hands have wound it the first time */
        threadOn(t > K.thread + 1.95);
        return;
      }
      /* (v25.0 CP13) the advice opens on a cut back to his face, the hand and its thread put down in the cut (eased down
         under the camera, `place` went back to the WALKING rest, still in the frame, by photograph) */
      { const A = FL.api;
        threadOn(false);
        if (A && A.handsRoot) A.handsRoot.visible = false; }
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
    /* Lersi Chin and Pong go out under the shutter (B, C, D): he stands (on a cut, his bag taken), the two walk out, the
       shutter lifted by Pong as they reach it; `eye` where he watches from */
    /* (v25.0 CP9) round him on his right, a metre off, not through where he knelt: the back of the master's head filled
       the frame from 0.45 m as he passed (by photograph) */
    const OUT_L = [[LC.x, LC.z + 0.25], [0.55, 0.45], [0.6, 1.5], [0.45, 2.6], [0.4, 3.6], [0.6, 4.6]];
    const OUT_P = [[PONG_DOOR.x, PONG_DOOR.z], [0.95, 3.2], [1.1, 4.2], [1.4, 5.0]];
    function goOut(t, t0, t1) {
      const L = cast.lersi, P = cast.pong;
      if (L && L.ready) { fWalk(L, OUT_L, t0 + 0.4, t1, t); L.lookAt = null; L.look = 0; L.bow = 0; }
      if (P && P.ready) fWalk(P, OUT_P, t0 + 1.4, t1 + 0.4, t);
      lcPose(null, 0); lcBlockOn(false);
      props.lcThings.visible = false;                                    // his things packed and gone with him
      shopAt({ u: lp(0.42, 0.86, smo(sgk(t, t0 + 1.0, t0 + 2.4))) });
    }

    /* (v25.2) at the start of B and C, packing: his right hand on what he puts away (the bowl, the thread), bent to it,
       until he is asked; then he lets it be and sits up, his eyes from it to the client — over a second and more, where
       v25.0 lifted a straight arm back from a point in the air */
    function endPack(t, t0, t1, what) {
      const L = cast.lersi; if (!L || !L.ready) return;
      const B0 = props.bowl.userData.home || props.bowl.position, th = props.thread.position, bowl = what === 'bowl';
      const R = bowl ? { bowl: 1 } : { palm: [th.x, 0.045, th.z], aim: 'down', pole: 'floor' };
      lcBody({ R: handKeys(t, [[-1, 0, R], [t0, t1, null]]), lean: keyed(t, bowl ? LEAN_MAT : 0.6, [[t0, t1 + 0.1, 0]]),
               side: keyed(t, bowl ? 0 : -0.15, [[t0, t1 + 0.1, 0]]) });
      lcLook(t, [[-1, 0, bowl ? [B0.x, 0.1, B0.z] : [th.x, 0.03, th.z]], [t0 + 0.2, t0 + 1.0, 'lens']], 1.1);
      lcBow(L, keyed(t, 0.12, [[t0, t1, 0]]));
      L.look = 1;
    }
    /* (v25.2) THE DECISION, IN PLAY: he begins to pack, as its words say ("Lersi Chin is packing his things"; v25.0 left
       him sitting idle under them) — bent to the bowl, his right hand on its side, his eyes on it: the pose ending B opens
       on. Eased in over a second and a half of wall time from when it opens; a Continue lands with him already there.
       Play's own: a film's frame sets his body itself, and films.end and reset() give it back */
    const PACK_LOOK = new THREE.Vector3();
    function packTick(now) {
      if (FL.key || phase !== 'decide' || !play.packAt) return;
      const L = cast.lersi; if (!L || !L.ready || !L.group.visible) return;
      const B0 = props.bowl.userData.home || props.bowl.position, u = now - play.packAt;
      lcBody({ R: handKeys(u, [[0.35, 1.95, { bowl: 1 }]]), lean: keyed(u, 0, [[0.2, 1.9, LEAN_MAT]]) });
      L.lookAt = PACK_LOOK.set(B0.x, 0.1, B0.z); L.lookK = null; L.neck = 1.1;
      L.bow = u > 0.3 ? 0.12 : 0;
    }
    /* (v25.2) his wai as they go (B, C): up over most of a second, his head bowing into it, held into the cut */
    function endWai(t, t0) {
      const L = cast.lersi; if (!L || !L.ready) return;
      const w = handKeys(t, [[t0 + 0.05, t0 + 0.95, VW_0]]);
      lcBody(w ? { R: w, L: w } : null);
      lcBow(L, keyed(t, 0, [[t0 + 0.35, t0 + 1.05, 0.16]]));
      lcLook(t, [[-1, 0, 'lens']], 1.1); L.look = 1;
    }

    /* A · WORD GETS AROUND (worst): that night he posts it; days later the thread; Pong's call; a customer who has read it */
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
        shop.lapOn = 1; shop.lapMode = 'compose';
        const W2 = DATA.words, n = (W2.postTitle || '').length + (W2.postBody || '').length;
        shop.lapO = { chars: Math.floor(n * c01((t - 0.9) / 5.6)), post: t > T.q2A1 + SECS.q2A1 + 0.5 };
        fLens(lp(isNarrow() ? 54 : 46, isNarrow() ? 48 : 40, smo(sgk(t, 0.4, T.days))));
        camAt(eye, lap);
        return;
      }
      fLook('LATER'); fogFilm(0);
      shopAt({ u: 1, led: 1, ceil: 1, night: false });
      mallPass('A', t);
      if (t < T.call) {
        /* days later, by day: the thread grown under it, reply after reply */
        shop.lapOn = 1; shop.lapMode = 'thread'; shop.lapO = { n: Math.min(5, Math.floor((t - T.days - 0.6) / 1.15) + 1) };
        shop.phoneOn = t > T.call - 1.6 ? wallNow() - (t - (T.call - 1.6)) : 0; shop.phoneMode = 'ringing';
        const k = smo(sgk(t, T.call - 1.6, T.call - 0.6));
        fLens(isNarrow() ? 52 : 44);
        camAt(eye, aimEase(eye, lap, [0.48, top0, COUNTER.z + 0.04], k));
        return;
      }
      shop.lapOn = 1; shop.lapMode = 'thread'; shop.lapO = { n: 5 };
      shop.phoneOn = 0;
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
      fLens(lp(isNarrow() ? 54 : 46, isNarrow() ? 44 : 36, k));
      camAt(eye, lap);
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
        lcSeated(); pongDoor(); props.lcThings.visible = true; mayomAt('bowl'); lcBlockOn(true);
        /* packing (his hand on the bowl) until he is asked; then he lets it be, and the long look */
        endPack(t, T.q2B1 + 0.9, T.q2B1 + 2.1, 'bowl');
        if (P) { P.lookAt = t > T.pg2B1 - 0.4 && t < T.go ? camera : L && L.head ? L.head : null; P.neck = 1.0; }
        waiAt(smo(sgk(t, T.q2B1, T.q2B1 + 0.5)) * (1 - smo(sgk(t, T.q2B1 + SECS.q2B1 - 0.4, T.q2B1 + SECS.q2B1 + 0.3))));
        /* "Don't take Pong's word" — a look to Pong at the shutter; and his "This time we check first" */
        const onP = (t > T.lc2B2 + 3.9 && t < T.lc2B2 + 5.6) || (t > T.pg2B1 - 0.2 && t < T.go - 0.2);
        if (onP) pongShot(); else kneelShot(t, 50, 40, [T.look, T.lc2B2 + 3.8]);
        return;
      }
      if (t < T.empty) {
        /* he wais; up (a cut), and the two go out under the shutter — Pong lifting it as they reach it */
        const tw = T.go + 1.5;
        if (t < tw) { lcSeated(); pongDoor(); props.lcThings.visible = true; mayomAt('bowl');
          const w = smo(sgk(t, T.go, T.go + 0.5)) * (1 - smo(sgk(t, tw - 0.4, tw)));
          endWai(t, T.go); waiAt(w); kneelShot(t, 46, 46); return; }
        waiAt(0);
        goOut(t, tw, T.empty - 0.2);
        const e = [-0.35, 1.62, 0.9];
        fLens(isNarrow() ? 58 : 50);
        camAt(e, headOf(L, [0.3, 1.5, 2.6]) || [0.3, 1.5, 2.6]);
        return;
      }
      /* the shop in clear colour, theirs gone: the door, then the altar */
      castVis({ lersi: false, pong: false }); lcPose(null, 0); lcBlockOn(false); props.lcThings.visible = false;
      shopAt({ u: 0.42 });
      const e = [-0.35, 1.62, 0.9], k = smo(sgk(t, T.q2B2 + 2.0, T.q2B2 + 6.0));
      fLens(isNarrow() ? 56 : 48);
      camAt(e, aimTurn(e, UNDER, BUDDHA_AT, k, -1));
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
        lcSeated(); pongDoor(); props.lcThings.visible = true; mayomAt('bowl'); lcBlockOn(true);
        /* the thread going into his bag when he is asked; he stops; sits back; the long look, not unkind */
        endPack(t, T.stop - 0.5, T.stop + 0.8, 'thread');
        if (P) { P.lookAt = t > T.pg2C1 - 0.3 && t < T.q2C2 + 0.4 ? camera : L && L.head ? L.head : null; P.neck = 1.0; }
        if (t > T.pg2C1 - 0.2 && t < T.q2C2 - 0.1) pongShot(); else kneelShot(t, 50, 40, [T.stop, T.lc2C3]);
        return;
      }
      if (t < T.alone) {
        const tw = T.go + 1.4;
        if (t < tw) { lcSeated(); pongDoor(); props.lcThings.visible = true; mayomAt('bowl');
          endWai(t, T.go); kneelShot(t, 46, 46); return; }
        goOut(t, tw, T.alone - 0.2);
        const e = [-0.35, 1.62, 0.9];
        fLens(isNarrow() ? 58 : 50);
        camAt(e, headOf(P, [0.9, 1.5, 3.0]) || [0.9, 1.5, 3.0]);
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
          lcSeated(); pongDoor(); props.lcThings.visible = true; mayomAt('bowl'); lcBlockOn(true);
          const w = smo(sgk(t, T.q2D1, T.q2D1 + 0.5)) * (1 - smo(sgk(t, T.lc2D1 + SECS.lc2D1 * 0.6, T.lc2D1 + SECS.lc2D1)));
          waiAt(w);
          /* (v25.2) his wai answering the client's thanks: up over a second, his head bowing into it, down as his words end */
          const wl = handKeys(t, [[T.lc2D1 - 0.5, T.lc2D1 + 0.45, VW_0], [T.lc2D1 + SECS.lc2D1 * 0.6, T.lc2D1 + SECS.lc2D1 + 0.25, null]]);
          lcBody(wl ? { R: wl, L: wl } : null);
          lcBow(L, keyed(t, 0, [[T.lc2D1 - 0.15, T.lc2D1 + 0.55, 0.15], [T.lc2D1 + SECS.lc2D1 * 0.5, T.lc2D1 + SECS.lc2D1 * 0.5 + 0.6, 0]]));
          if (L) { L.look = 1; gaze(L, true, 1.1); }
          if (P) { P.lookAt = t > T.pg2D1 - 0.4 ? camera : L && L.head ? L.head : null; P.neck = 1.0; }
          if (t > T.pg2D1 - 0.2) pongShot(); else kneelShot(t, 48, 44, [0, T.pg2D1]);
          return;
        }
        /* out under the shutter with them, into the corridor at night */
        waiAt(0);
        goOut(t, T.go, T.morning + 0.6);
        const path = [[CL.x, CL.z], [0.0, 1.6], [0.2, 2.7], [0.3, 3.6], [0.4, 4.3]];
        /* (v25.0 CP9) two metres behind him (started at 1.6 s he walked at the master's ear) */
        const s = walkS(t, T.go + 2.8, 1.1), v = walkV(t, T.go + 2.8, 1.1);
        const y0 = lp(KNEEL.y, 1.62, smo(sgk(t, T.go, T.go + 1.2)));
        const e = walkEye(path, s, v, () => 0); e[1] = Math.min(e[1], y0 + (e[1] - 1.62));
        fLens(isNarrow() ? 60 : 52);
        /* (v25.0 CP9) his eyes on the door until the master is a step or two ahead, then on him: tracking his head as he rose
           and passed put it a half metre from the lens, by photograph */
        const hL = headOf(L, [0.4, 1.55, 3.2]) || [0.4, 1.55, 3.2];
        camAt(e, aimEase(e, [0.45, 1.45, 3.2], hL, smo(sgk(Math.hypot(hL[0] - e[0], hL[2] - e[2]), 1.0, 1.8))));
        return;
      }
      /* the next morning, in full colour (chapter 1's dawn shop again, clear this time) */
      fLook('MORNING'); fogFilm(0);
      castVis({ lersi: false, pong: false, goldman: true }); lcPose(null, 0); lcBlockOn(false); props.lcThings.visible = false;
      if (props.stand) props.stand.visible = false;                      // the dried stand taken away at last
      props.envelope.visible = true;
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
      const eye = [HIS.x + 0.1, 1.55, HIS.z + 0.28];
      if (t < T.cu2a2) {
        /* the envelope on the counter, For the temple; his pocket, and the wallet in it */
        /* (v25.0 CP9) its words read on a phone */
        shot(eye, [props.envelope.position.x, top0, props.envelope.position.z], 36, 30);
        return;
      }
      if (t < T.last) {
        /* her question followed, and answered: a piece from the tray in his hand, turned to her */
        const tray = [0.35, DISPLAY.floor + 0.02, COUNTER.z + 0.02];
        const up = smo(sgk(t, T.q2D2 + 0.4, T.q2D2 + 1.6));
        /* (v25.1 F7) held IN his hand: the place grip eased in with the lift, the piece at its palm, turned to the lens
           (placed at a point of the screen it stood in the air above an open hand, by photograph); handFree lets go */
        const A = FL.api;
        if (up > 0.001) {
          if (A && A.handPose) { A.handPose('place', up, { p: AMU_P }); FL.grip = true; }
          handHold(amuletHand, { lens: AMU_HELD, face: true, tilt: -0.2 });
        } else handFree();
        fLens(isNarrow() ? 54 : 46);
        camAt(eye, aimEase(eye, tray, [0.3, top0 + 0.1, COUNTER.z + 0.4], up * 0.6));
        return;
      }
      handFree();
      /* "I had enough to decide." — up to the shop's open front, the mall going by in clear morning light */
      const k = smo(sgk(t, T.last - 0.2, T.last + 3.0));
      fLens(isNarrow() ? 58 : 50);
      camAt(eye, aimEase(eye, [0.3, top0 + 0.1, COUNTER.z + 0.4], [0.4, 1.4, 5.2], k));
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
      const open = t >= C.open + 0.6;
      shop.lapMode = open ? 'post' : 'list';
      shop.lapO = { scroll: c01((t - C.q2K1) / (C.thread - C.q2K1)), newK: smo(sgk(t, C.thread, C.thread + 0.8)), cursor: smo(sgk(t, C.open - 1.2, C.open)), click: open ? 1 : 0 };
      const eye = [HIS.x + 0.1, 1.5, HIS.z + 0.3], lap = [LAP.x + 0.04, top0 + 0.11, LAP.z + 0.06];
      const bk = shop.ledger ? shop.ledger.getWorldPosition(_bk) : _bk.set(BOOK_AT.x, top0, BOOK_AT.z);
      namesAt(t >= C.q2K2 - 0.4 ? Math.min(7, 2 + Math.floor((t - C.q2K2) / 1.4)) : 2);
      if (t >= C.q2K2 - 0.4 && t < C.q2K3 - 0.2) {
        /* "I research a master's lineage thoroughly..." — his notebook: the names checked, some crossed out */
        fLens(isNarrow() ? 50 : 42);
        camAt([bk.x - 0.12, 1.42, bk.z - 0.42], [bk.x, bk.y + 0.012, bk.z + 0.02]);
        return;
      }
      /* the forum: the list read down; the new thread arriving at the top; pushed in as it is opened */
      const kIn = smo(sgk(t, C.thread, C.black));
      /* (v25.0 CP9) on a phone the push ends at 46, so the new thread's title reads whole (at 40 it lost a letter each side) */
      fLens(lp(isNarrow() ? 54 : 46, isNarrow() ? 46 : 32, kIn));
      camAt(lp3(eye, [LAP.x + 0.02, 1.36, LAP.z - 0.36], kIn * 0.6), lap);
    }

    /* (v25.0 CP11) THE ROOM UNDER EACH FILM, a pure function of its clock: the mall muffled at noon in the opening, the
       shop at night under the call, the visit, the examination and the clearing (the room's sound fuller once the fog has
       lifted, from K.lift), each ending's night and its daylight (A's "days later", D's morning: the mall heard clear),
       C's air-con alone after the shutter comes down, and the coda's night. mixBeds eases to it. */
    function filmBedAt(key, t) {
      const B = { mall: 0, night: 0, mallclear: 0 };
      const seg = (a, b) => Math.min(1, Math.max(0, (t - a) / (b - a)));      // 0 before a, 1 after b
      if (key === 'open') B.mall = 0.55 * (1 - seg(OPEN.black - 1.0, OPEN.end));               // out with the picture
      else if (key === 'call') B.night = 0.5 * (1 - seg(CALL.black - 0.6, CALL.end));          // to the next evening's black
      else if (key === 'visit') B.night = 0.45 * seg(0, 1.0);                                   // and in from it
      else if (key === 'exam') B.night = 0.45;
      else if (key === 'clear') B.night = t < CLEARF.lift ? 0.4 : 0.5;
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
        waiAt(0); handFree(); threadOn(false); lcPose(null, 0);
        /* (v25.1 F4) the coda's page put away, so a replay (reset() runs this) never opens on the months-later notebook */
        namesAt(-1);
        handPhone.visible = false; amuletHand.visible = false; drops.visible = false;
        for (const s of ['hand', 'lc']) if (held[s]) held[s].visible = false;
        if (shop.phone) shop.phone.g.visible = true;
        shop.phoneOn = 0; shop.phoneSecs = null;
        if (props.bowl && props.bowl.userData.home) { props.bowl.position.copy(props.bowl.userData.home); props.bowl.rotation.x = 0; }
        if (props.stand) props.stand.visible = true;
        for (const P of people) P.filmWalk = 0;
        for (const P of [cast.lersi, cast.pong]) if (P) { P.lookAt = null; P.neck = null; P.bow = 0; P.lookK = null; P.lookFilm = false; P.look = P.o.look || 0; }
        for (const k of ['mallA', 'mallB']) if (cast[k] && cast[k].group) cast[k].group.visible = false;
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
      for (const o of [props.bowl, props.mayom, props.thread, props.cloth, props.khan, props.yaam]) if (o) o.visible = true;
      shopCtl.night(false); shopCtl.shutter(1, 0); shopCtl.lights(1, 0); shopCtl.ceiling(1, 0); shopCtl.lap('sales'); shopCtl.phone('');
      props.tillTo = props.bagTo = props.jacketTo = props.fridgeTo = 0;
      /* the people where the day began: Lersi Chin and Pong not yet come, the goldsmith's man at his counter */
      for (const P of people) { P.walk = null; P.lookAt = null; P.neck = null; P.talkUntil = 0; P.turnTo = null; P.bow = 0; P.lookK = null; P.gripK = 0; P.grip = null; P.waiOn = false; P.holdObj = null; if (P.one) P.one.until = 0; }
      lcBody(null);                                       // (v25.2) his body's lean and hands given back to his take
      whenReady(cast.lersi, (P) => { P.group.visible = false; personPut(P, LC.x, LC.z, 0, 0); seatNow(P, true); });
      whenReady(cast.pong, (P) => { P.group.visible = false; personPut(P, PSTOOL.x, PSTOOL.z, PONG_RY, 0); seatNow(P, true); });
      whenReady(cast.goldman, (P) => { P.group.visible = true; });
      for (const k of ['mallA', 'mallB']) whenReady(cast[k], (P) => { P.group.visible = false; P.filmWalk = 0; });
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
      threadOn(false);
      const geos = new Set(), ms = new Set();
      world.traverse(o => {
        if (o.geometry) geos.add(o.geometry);
        if (o.material) for (const m of (Array.isArray(o.material) ? o.material : [o.material])) ms.add(m);
      });
      for (const o of [wristThread]) o.traverse(q => { if (q.geometry) geos.add(q.geometry); if (q.material) ms.add(q.material); });
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
        grip: P.grip ? Object.keys(P.grip).join('+') : null, gripK: +(P.gripK || 0).toFixed(2),
        miss: P.miss != null ? +P.miss.toFixed(3) : null }])),                // (v25.2) how far a hand stopped short of where it was sent (m)
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
        for (const k of ['bowl', 'mayom', 'cloth', 'khan', 'thread', 'yaam', 'wallet', 'note', 'envelope', 'till', 'bag', 'jacket', 'fridge', 'sw', 'shelf', 'stand'])
          put(k, props[k]);
        put('phone', shop.phone && shop.phone.g); put('handPhone', handPhone); put('notebook', shop.ledger); put('laptop', shop.lapG);
        put('piece', props.pieces && props.pieces[play.piece]); put('heldPiece', held.lc); put('amulet', amuletHand);
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
