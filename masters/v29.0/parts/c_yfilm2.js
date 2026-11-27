    /* ================================================================ THE BARRIER, THE FOUR ENDINGS AND THE DAWN: THEIR PICTURES
       (masters/v29.0/parts/c_yfilm2.js: helper FILMS-2's from M7; the plan's 9.7 to 9.11, its 4.4 the camera's grammar, its
       12 the effects; masters/v29.0/ENDINGS.md writes every number below out with its reason). Their clocks are y_endings.js
       (EN2: each ending's own beginning, then THE BARRIER, then THE DAWN), built by tl() from SECS; what each frame of them
       shows is drawn here as a PURE FUNCTION OF THAT CLOCK (v6.4): the lens, his hands and what is in them, the thread laid
       round him, the gold, the red threads and their burning, the pressure on the picture, Spirit Vision held by the film,
       the things of his flat. A seek, a skip and a slow phone land on the same picture; nothing here keeps a timer.
       THE ONE THING THAT IS NOT THE CLOCK'S is CLOSE THE CIRCLE: the film's clock stands still on its event (eventWait) while
       the player lays the thread, so while it is open the thread and the lens follow how far round it is (the event's own
       progress, eased on the wall so a finger's stop and start never jerk the picture); once it has resolved (or the film
       was skipped past it) the circle stands closed.
       FIRST PERSON THROUGHOUT (v24.56): the grown Master Zavier is never seen; his hands are the game's own viewmodel (kit.hold,
       api.handPose). His legs in the circle are framed out, not drawn: the game has no take of his body (p5zavier) sitting
       cross-legged, and a take retargeted from another body is a new motion that must pass the body rules before it is
       shown; so the lens looks out over the floor beyond his knees, where the thread is laid, never straight down at them. */
    const F2 = { api: null, s: null, k: null, E: null, on: false, shot: '', look: null, vis: false, cirK: 0, cirShow: 0, cirDone: false,
                 cirWall: 0, closeSaid: false, last: -1, p0: 0.5, held: null, heldHand: null, bedsSet: false, said: new Set() };
    const F2HX = HX;
    /* the places of his flat the films use (HIS, FILMPLACE, LIV and the rest are WORLD's: masters/v29.0/WORLD.md 3) */
    const F2P = {
      table:   { x: STATION.ask.at.x, z: STATION.ask.at.z, ry: STATION.ask.at.ry },   // where the decision leaves him (PLAY.md 2)
      bag:     { x: HIS.bag.x, z: HIS.bag.z },                                          // his bag by his front door
      bagAt:   { x: HIS.bag.x + 0.3, z: HIS.bag.z + 0.64 },                            // where he crouches to it, the bag at his feet ahead
      circle:  { x: HIS.circle.x, z: HIS.circle.z, r: HIS.circle.r },
      door:    { x: HIS.door.x, z: LIV.z0 },                                            // his front door, its foot
      sofa:    { x: HIS.sofa.x, z: HIS.sofa.z, seat: HIS.sofa.seat },
      kitchen: { x: FILMPLACE.kitchen.x, z: FILMPLACE.kitchen.z },
      tap:     { x: F2HX + 0.95, z: LIV.z0 + 0.31 - 0.24 },
      balc:    { x: FILMPLACE.balconyAt.x, z: FILMPLACE.balconyAt.z },
      oven:    { x: HIS.oven.x, y: HIS.oven.y, z: HIS.oven.z }
    };
    /* THE BARRIER'S WALKS (ENDINGS.md 2): from where each ending leaves him to where he crouches at his bag (the sofa, 2.1 m
       long at x HX-3.35..HX-1.25, z -1.4..-0.5, passed behind; the dining table and the kitchen counter cleared by half a
       metre), and from the bag round the sofa's far end, past his altar, to the middle of the room */
    const F2PATH = {
      A: [[F2HX + 0.4, 0.65], [F2HX - 0.7, 0.1], [F2HX - 0.95, -1.6], [F2HX - 2.6, -1.62]],
      B: [[F2HX - 0.3, 0.35], [F2HX - 0.75, -0.6], [F2HX - 1.0, -1.62], [F2HX - 2.6, -1.62]],
      C: [[F2HX - 2.55, -0.3], [F2HX - 3.65, -0.6], [F2HX - 3.5, -1.55], [F2HX - 2.7, -1.56]],
      D: [[F2HX - 0.25, 2.0], [F2HX - 0.7, 0.6], [F2HX - 0.8, -0.5], [F2HX - 1.0, -1.62], [F2HX - 2.6, -1.62]],
      on: [[F2HX - 2.7, -1.56], [F2HX - 3.6, -1.5], [F2HX - 3.7, -0.2], [F2HX - 3.0, 0.6], [F2HX - 2.2, 0.95]]
    };
    const F2EYE = { stand: EYE, sofa: HIS.sofa.seat + 0.66, floor: 0.82, crouch: 1.0, knees: 1.12, crawl: 0.5, lie: 0.17 };
    const F2SIT = { x: F2P.circle.x, y: F2EYE.floor, z: F2P.circle.z - 0.05 };          // his eye sitting in the circle (his hips at its middle)
    const F2RED = 0xff2233;                                                             // the spell's red, the play's own (PLAY.md 4)
    const F2GOLD = 0xffc24a;                                                            // Grandmaster Pho's gold (v25.5: his alone)
    const f2Narrow = () => camera.aspect < 1;
    const f2smo = (k) => { k = c01(k); return k * k * (3 - 2 * k); };
    const f2s5 = (k) => { k = c01(k); return k * k * k * (k * (6 * k - 15) + 10); };
    const f2win = (t, a, b) => c01((t - a) / Math.max(1e-3, b - a));
    const f2bell = (t, a, b, c, d) => f2smo(f2win(t, a, b)) * (1 - f2smo(f2win(t, c, d)));

    /* ---------------------------------------------------------------- THE LENS
       A shot is a list of KEYS { t, e: [x, y, z] the eye, a: [x, y, z] what it looks at, fp, fd the lens (vertical degrees,
       phone / desk: the plan's 4.4), roll, cut, stop }. Between keys the eye, the aim, the lens and the roll pass through
       each key at a speed taken from the keys either side (a cubic on the clock with Catmull-Rom's tangents, episode 4
       chapter 5's `flow`), so a move never stops at a key and its speed never steps; it rests only at a key marked `stop`,
       at the run's ends and either side of a CUT (a key marked `cut` begins a new shot on its own clock moment). */
    const _f2v = new THREE.Vector3();
    function f2Aim(e, a, roll) {
      yaw.position.set(e[0], e[1], e[2]);
      const dx = a[0] - e[0], dy = a[1] - e[1], dz = a[2] - e[2];
      yaw.rotation.y = Math.atan2(-dx, -dz);
      pitch.rotation.x = Math.atan2(dy, Math.hypot(dx, dz));
      camera.rotation.z = roll || 0;
    }
    function f2Lens(fov) { if (Math.abs(camera.fov - fov) > 1e-4) { camera.fov = fov; camera.updateProjectionMatrix(); } }
    /* (a key's eye or aim may be a function of nothing, read each frame: a look that follows a person who walks, read from
       where the film stands him, never from his living head: v25.5) */
    const f2Val = (K, nar) => { const e = typeof K.e === 'function' ? K.e() : K.e, a = typeof K.a === 'function' ? K.a() : K.a;
      return [e[0], e[1], e[2], a[0], a[1], a[2], nar ? K.fp : K.fd, K.roll || 0]; };
    function f2Keys(K, t) {
      const nar = f2Narrow();
      if (!K.length) return null;
      let i = 0; while (i < K.length - 1 && t >= K[i + 1].t) i++;
      const A = K[i], B = K[i + 1];
      if (!B || B.cut || t <= A.t) { const v = f2Val(A, nar); F2.shot = A.n || ''; return v; }
      const vA = f2Val(A, nar), vB = f2Val(B, nar), dt = Math.max(1e-3, B.t - A.t), n = vA.length;
      const P0 = (!A.cut && !A.stop && K[i - 1]) ? K[i - 1] : null, P3 = (!B.stop && K[i + 2] && !K[i + 2].cut) ? K[i + 2] : null;
      const m0 = new Array(n).fill(0), m1 = new Array(n).fill(0);
      if (P0) { const v0 = f2Val(P0, nar), d = Math.max(1e-3, B.t - P0.t); for (let j = 0; j < n; j++) m0[j] = (vB[j] - v0[j]) / d; }
      if (P3) { const v3 = f2Val(P3, nar), d = Math.max(1e-3, P3.t - A.t); for (let j = 0; j < n; j++) m1[j] = (v3[j] - vA[j]) / d; }
      const s = c01((t - A.t) / dt), s2 = s * s, s3 = s2 * s, h00 = 2 * s3 - 3 * s2 + 1, h10 = s3 - 2 * s2 + s, h01 = 3 * s2 - 2 * s3, h11 = s3 - s2;
      F2.shot = (A.n || '') + '>' + (B.n || '');
      return vA.map((a, j) => h00 * a + h10 * dt * m0[j] + h01 * vB[j] + h11 * dt * m1[j]);
    }
    /* HANDHELD (the plan's 4.4: "handheld drift in the films, a smooth function of the clock, never noise"): sums of slow
       sines at unrelated rates, laid on the aim and the eye by `amp` (1: about a degree either way) */
    function f2Drift(v, t, amp) {
      if (!(amp > 0)) return v;
      const yw = amp * (0.0105 * Math.sin(0.71 * t + 0.3) + 0.0062 * Math.sin(1.37 * t + 1.1) + 0.003 * Math.sin(2.3 * t + 2.0));
      const pt = amp * (0.0085 * Math.sin(0.93 * t + 0.4) + 0.005 * Math.sin(1.71 * t + 2.3));
      const dx = v[3] - v[0], dz = v[5] - v[2], d = Math.max(0.2, Math.hypot(dx, dz)), c = Math.cos(yw), sn = Math.sin(yw);
      const rx = dx * c - dz * sn, rz = dx * sn + dz * c;
      v[3] = v[0] + rx; v[5] = v[2] + rz; v[4] += pt * d;
      v[0] += amp * 0.004 * Math.sin(0.83 * t + 0.7); v[1] += amp * 0.003 * Math.sin(1.13 * t + 0.5); v[2] += amp * 0.004 * Math.sin(0.67 * t + 1.9);
      v[7] += amp * 0.004 * Math.sin(0.61 * t + 0.8);
      return v;
    }
    /* A WALK on his own feet from point to point ([x, z]...), as a run of keys: the eye at `y`, looking `ahead` metres along the
       path (and at `a` over its last metre when given), arriving at `t1`; the head's bob is laid on in the frame (f2Bob) */
    function f2PathLen(P) { let L = 0; for (let i = 1; i < P.length; i++) L += Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]); return L; }
    function f2PathAt(P, s) { for (let i = 1; i < P.length; i++) { const a = P[i - 1], b = P[i], l = Math.hypot(b[0] - a[0], b[1] - a[1]);
      if (s <= l || i === P.length - 1) { const u = l > 1e-6 ? c01(s / l) : 1; return [lp(a[0], b[0], u), lp(a[1], b[1], u)]; } s -= l; } return P[0].slice(); }
    function f2WalkKeys(P, t0, t1, y, o = {}) {
      const L = f2PathLen(P), n = Math.max(2, Math.ceil(L / 0.7)), out = [], ahead = o.ahead || 1.4, aY = o.aY != null ? o.aY : y - 0.12;
      for (let i = 0; i <= n; i++) {
        const u = i / n, s = L * u, p = f2PathAt(P, s), q = f2PathAt(P, Math.min(L, s + ahead)), qq = (q[0] === p[0] && q[1] === p[1]) ? f2PathAt(P, L) : q;
        let dx = qq[0] - p[0], dz = qq[1] - p[1]; const dl = Math.hypot(dx, dz) || 1; dx /= dl; dz /= dl;
        let a = [p[0] + dx * 2.5, aY, p[1] + dz * 2.5];
        /* (o.look(s, L): a thing to look at while he walks, by how far along he is, eased in over his first metre (o.lookIn): a
           man crossing his room looks where he is going TO, not 2.5 m along his own feet's line, which met his bare walls) */
        if (o.look) { const q = o.look(s, L); if (q) { const w = f2smo(c01(s / (o.lookIn || 1.0))); a = [lp(a[0], q[0], w), lp(a[1], q[1], w), lp(a[2], q[2], w)]; } }
        if (o.a && s > L - 1.0) { const w = f2smo((s - (L - 1.0)) / 1.0); a = [lp(a[0], o.a[0], w), lp(a[1], o.a[1], w), lp(a[2], o.a[2], w)]; }
        /* (the time at each key: eased away from his first step and into his last, a constant pace between) */
        const ease = Math.min(0.3, 0.5 * 1.0 / Math.max(1, L));
        const tu = u < ease ? Math.sqrt(u * ease) : u > 1 - ease ? 1 - Math.sqrt((1 - u) * ease) : u;
        out.push({ t: lp(t0, t1, tu), e: [p[0], y, p[1]], a, fp: o.fp || 64, fd: o.fd || 56, n: o.n || 'walk' });
      }
      out[0].stop = !!o.stopStart; out[out.length - 1].stop = o.stopEnd !== false;
      return out;
    }
    /* the head's bob as he walks: down at each footfall, `rate` steps a second, by how fast the eye is going (so it is still
       when he stands), a smooth function of the clock */
    function f2Bob(v, t, speed, rate = 1.7) { const k = c01(speed / 0.7); v[1] -= 0.018 * k * (0.5 - 0.5 * Math.cos(2 * Math.PI * rate * t)); v[7] += 0.006 * k * Math.sin(Math.PI * rate * t); return v; }

    /* ---------------------------------------------------------------- THE THINGS IN HIS HANDS AND ON HIS FLOOR
       Every one a real model (v25.2): his own phone (`e4phone`, the play's copy of it, its screen drawn: PLAY.md 2), his white
       thread's spool (`w51threadreel`), the strip of pills (`w51pills`), a cushion (`w5cushion`), Grandmaster Pho's breakfast
       (`w51breakfast`). Each is unpacked under the curtain (parseOnce) and cloned once, so nothing loads on screen (v14.15) */
    const F2M = { phone: null, phoneFloor: null, spool: null, spoolFloor: null, pills: null, cushion: null };
    const F2SCR = (() => { const cv = document.createElement('canvas'); cv.width = 256; cv.height = 512; return { cv, x: cv.getContext('2d'), sig: '' }; })();
    const F2SCRTEX = tex(new THREE.CanvasTexture(F2SCR.cv)); F2SCRTEX.colorSpace = THREE.SRGBColorSpace;
    /* THE CALL ON HIS SCREEN (words drawn into the world are art: v14.5): the decision's 3:03 and his teacher's name, then the
       call ringing, then the call itself with its seconds */
    function f2Screen(mode, secs, clock) {
      const sig = mode + '|' + (mode === 'call' ? Math.floor(secs) : '') + '|' + (clock || '');
      if (sig === F2SCR.sig) return; F2SCR.sig = sig;
      const x = F2SCR.x; x.fillStyle = mode === 'off' ? '#020305' : '#070b12'; x.fillRect(0, 0, 256, 512); x.textAlign = 'center';
      if (mode === 'off') { /* (its screen gone dark: the call over) */ }
      else if (mode === 'home') {
        x.fillStyle = '#dfe8f4'; x.font = '300 74px sans-serif'; x.fillText(clock || '3:03', 128, 150);
        x.font = '22px sans-serif'; x.fillStyle = '#9fb0c6'; x.fillText('Grandmaster Pho', 128, 300);
        x.fillStyle = '#2f9e5a'; x.beginPath(); x.arc(128, 420, 34, 0, Math.PI * 2); x.fill();
      } else {
        x.fillStyle = '#9fb0c6'; x.font = '22px sans-serif'; x.fillText(clock || '3:03', 128, 46);
        x.fillStyle = '#26364c'; x.beginPath(); x.arc(128, 150, 54, 0, Math.PI * 2); x.fill();
        x.fillStyle = '#dfe8f4'; x.font = '44px sans-serif'; x.fillText('P', 128, 166);
        x.font = '26px sans-serif'; x.fillText('Grandmaster Pho', 128, 250);
        x.font = '22px sans-serif'; x.fillStyle = '#9fb0c6';
        if (mode === 'ring') x.fillText('Calling…', 128, 290);
        else { const s = Math.max(0, Math.floor(secs)); x.fillText(String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0'), 128, 290); }
        x.fillStyle = '#3a4a60'; x.beginPath(); x.arc(70, 400, 26, 0, Math.PI * 2); x.fill();
        x.fillStyle = '#5a92d8'; x.beginPath(); x.arc(128, 400, 26, 0, Math.PI * 2); x.fill();
        x.fillStyle = '#d8483e'; x.beginPath(); x.arc(186, 400, 26, 0, Math.PI * 2); x.fill();
      }
      F2SCRTEX.needsUpdate = true;
    }
    const F2SCRMAT = B({ map: F2SCRTEX, toneMapped: false });
    /* the phone as the play holds it (c_play.js holdPhone, PLAY.md 2: its model's clone turned up to his eyes, the screen laid
       over its glass), so the first frame of every ending is the decision's own */
    function f2PhoneGroup() {
      const g = new THREE.Group(); g.name = 'his phone (the endings)';
      /* (the screen laid ON the phone's glass: the model, turned up, stands from -6 to +5 mm about the group's middle, and a
         screen at its middle was drawn under the model's own black glass: photographed, build 2) */
      const scr = new THREE.Mesh(new THREE.PlaneGeometry(0.068, 0.136), F2SCRMAT); owned.push(scr.geometry); scr.position.z = 0.0062; g.add(scr);
      const src = things.hisPhone && things.hisPhone.userData.model;
      if (src) { const m = src.clone(true); m.traverse(q => { if (q.isMesh) q.frustumCulled = false; }); m.rotation.x = Math.PI / 2; m.position.z = -0.006; g.add(m); }
      return g;
    }
    const F2HELD = () => (S && S.plan && S.plan.PHONEHELD) || { pos: [-0.045, 0.06, -0.035], rot: [0.35, 0.25, 0] };
    /* HIS PHONE HELD UP TO CALL (the endings' own hold: the play's at the decision, the hand at rest, shows the phone's back
       to the lens, its screen turned down: measured, its screen's normal (0.31, -0.77, 0.56) in the lens's frame; said in
       ENDINGS.md). The library's `place` grip at 0.4 turns the same hold's screen up to his eyes, low before him, the table
       or the floor beyond it (photographed, build 2: "3:03" and his teacher's name read on a phone); `face` can turn the
       screen to the lens whatever the arm (f2PhoneFace), unused by default. `F2TUNE` is a probe's handle on these numbers
       (tools/probes/e5c1ends.mjs TUNE: many tries photographed from one boot) */
    const F2TUNE = { phone: { arm: [0, 0, 0], tilt: 0.42, roll: 0.12, pose: 'place', k: 0.4, face: 0, pos: null }, chairY: 0, tieArm: [0, 0, 0], cam: null };
    const F2CALL = () => F2TUNE.phone;
    /* the phone in his right hand turned so its screen faces his eyes, whatever the arm's own turn: its turn in the world of
       the hands' pass laid from the lens's (the screen's normal toward the lens, tilted up by `tilt`, rolled by `roll`),
       so his hand carries it and its face is always his (a person holds a phone so that its screen faces him). `k` eases
       from the play's hold (its turn as kit.hold laid it) to this */
    const _phQ = new THREE.Quaternion(), _phQ2 = new THREE.Quaternion(), _phE = new THREE.Euler(), _phQ0 = new THREE.Quaternion();
    function f2PhoneFace(k) {
      const A = F2.api, g = F2M.phone; if (!A || !A.armR || !A.vmCam || !g || g.parent !== A.armR) return;
      const H = F2HELD(), C = F2CALL();
      _phQ0.setFromEuler(_phE.set(H.rot[0], H.rot[1], H.rot[2]));
      A.vmCam.updateMatrixWorld(); A.armR.updateWorldMatrix(true, false);
      A.vmCam.getWorldQuaternion(_phQ); _phQ.multiply(_phQ2.setFromEuler(_phE.set(-C.tilt, 0, C.roll)));   // (the screen is the group's +z, the lens's own +z toward the eye: tilted up by `tilt`)
      A.armR.getWorldQuaternion(_phQ2); _phQ.premultiply(_phQ2.invert());
      g.quaternion.copy(_phQ0).slerp(_phQ, c01(k));
    }
    /* the phone on the floor of the circle in front of him, on the speaker: the same phone face up, its call lit */
    const f2FloorPhone = new THREE.Group(); f2FloorPhone.name = 'his phone on the floor (the barrier)'; f2FloorPhone.visible = false; hisSideG.add(f2FloorPhone);
    {
      const scr = new THREE.Mesh(new THREE.PlaneGeometry(0.068, 0.136), F2SCRMAT); owned.push(scr.geometry); scr.rotation.x = -Math.PI / 2; scr.position.y = 0.0115; f2FloorPhone.add(scr);
      const glowQ = pool(0, 0.004, 0, 0.5, 0.6, 0x9fb8e0, 0.16, { parent: f2FloorPhone, look: null });   // its light on the floor round it
      F2M.phoneGlow = glowQ;
    }
    /* a model cloned for a film (unpacked under the curtain) */
    function f2Clone(key, done) { if (!have(key)) { waiting.add(key); return; }
      parseOnce(key).then(({ scene: src }) => { if (!alive) return; const m = src.clone(true);
        m.traverse(q => { if (q.isMesh) { q.castShadow = false; q.receiveShadow = false; q.frustumCulled = false; q.material = q.material.clone(); mats.push(q.material); } });
        done(m); }).catch(err => { console.warn(key + ' failed to load', err); if (ctx.loadFail) ctx.loadFail(key, err); }); }
    /* (his phone's model lands through the world: the copies are made when the first film asks for them) */
    const f2PhoneFloorDress = () => { if (F2M.phoneFloor || !(things.hisPhone && things.hisPhone.userData.model)) return;
      const m = things.hisPhone.userData.model.clone(true); m.traverse(q => { if (q.isMesh) q.frustumCulled = false; }); f2FloorPhone.add(m); F2M.phoneFloor = m; };
    /* THE SPOOL OF WHITE THREAD (`w51threadreel`): in his hand (a held copy) and, the thread laid, set down on the floor by him */
    const f2SpoolHand = new THREE.Group(); f2SpoolHand.name = 'the spool in his hand';
    const f2SpoolFloor = new THREE.Group(); f2SpoolFloor.name = 'the spool on the floor'; f2SpoolFloor.visible = false; hisSideG.add(f2SpoolFloor);
    f2Clone('w51threadreel', (m) => { m.scale.setScalar(0.62); f2SpoolHand.add(m); F2M.spool = m; const m2 = m.clone(true); m2.scale.setScalar(0.62); f2SpoolFloor.add(m2); F2M.spoolFloor = m2; });
    /* THE STRIP OF PILLS (ending C), in his right hand */
    const f2Pills = new THREE.Group(); f2Pills.name = 'the strip of pills';
    f2Clone('w51pills', (m) => { f2Pills.add(m); F2M.pills = m; });
    /* THE CUSHION over his eyes (ending C): a cushion of the sofa's held against his face, its weave filling the lens */
    const f2Cushion = new THREE.Group(); f2Cushion.name = 'the cushion over his eyes';
    f2Clone('w5cushion', (m) => { m.scale.set(0.9, 0.9, 0.9); f2Cushion.add(m); F2M.cushion = m; });

    /* ---------------------------------------------------------------- THE WHITE THREAD ROUND HIM (the plan's 9.7, 12)
       A cotton thread on his floor in a circle of 0.75 m round where he sits, laid from in front of him (toward his glass) to
       his right, behind him, his left and round to the front again, where its ends meet in a small white spark. Drawn as a
       tube a few millimetres thick that lies on the tiles with a hand's irregularity, laid by how far round it is (its draw
       range); in Spirit Vision a white glow of its own (spiritAura), since the vision draws the world as a negative */
    const F2C = { N: 180, R: 6, r: 0.0026, y: 0.0035 };
    const f2Circle = (() => {
      const curve = new THREE.Curve(); curve.getPoint = (u, out = new THREE.Vector3()) => { const C = F2P.circle, a = 2 * Math.PI * u,
        rr = C.r * (1 + 0.018 * Math.sin(a * 3 + 0.7) + 0.012 * Math.sin(a * 7 + 2.1));
        /* (from in front of him, +z, round to his right: facing his glass his right is -x) */
        return out.set(C.x - Math.sin(a) * rr, F2C.y + 0.0012 * Math.sin(a * 6.4), C.z + Math.cos(a) * rr); };
      const g = new THREE.TubeGeometry(curve, F2C.N, F2C.r, F2C.R, false); owned.push(g);
      const m = new THREE.Mesh(g, M({ color: 0xf2f0e8, roughness: 0.85, emissive: 0x34342e })); m.name = 'the white thread round him'; m.frustumCulled = false;
      m.visible = false; hisSideG.add(m);
      const aura = ctx.spiritAura ? ctx.spiritAura(m, { color: 0xffffff, fill: 0.5, rim: 1.0, power: 1.6, flicker: 0.05, xray: 1 }) : null;
      return { m, g, curve, aura, per: F2C.R * 6 };
    })();
    /* ITS SHADOW AT DAWN: the white thread on the pale floor in the low sun all but vanished (photographed, the circle a hairline
       at the picture's foot), and no light casts on a phone (v9.3), so a contact shadow is painted: a flat dark band twice the
       thread's width laid under it on the side away from his glass, drawn only at dawn; a child of the thread, so it is wound
       in with it and laid as far round as it is */
    const f2CircleShade = (() => {
      const g = new THREE.TubeGeometry(f2Circle.curve, F2C.N, F2C.r * 2.1, F2C.R, false); owned.push(g);
      const m = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ color: 0x4a3c2c, transparent: true, opacity: 0.3, depthWrite: false })); mats.push(m.material);
      m.name = "the white thread's painted shadow (the dawn)"; m.scale.set(1, 0.12, 1); m.position.set(0, -0.0002, -0.0035); m.frustumCulled = false; m.visible = false;
      m.renderOrder = -1; f2Circle.m.add(m); return { m, g };
    })();
    function f2CircleLay(u) { const n = Math.max(0, Math.min(F2C.N, Math.round(F2C.N * c01(u)))); f2Circle.g.setDrawRange(0, n * f2Circle.per); f2CircleShade.g.setDrawRange(0, n * f2Circle.per); f2Circle.m.visible = n > 0; }
    /* the spark where its ends meet */
    const f2Spark = glow(F2P.circle.x, 0.02, F2P.circle.z + F2P.circle.r, 0.16, 0xffffff, 0.0, hisSideG, null);

    /* ---------------------------------------------------------------- THE GOLD (the plan's 12; Grandmaster Pho's alone, v25.5)
       Rings of gold rise from the white thread into a dome round him: each ring a thin band of light that climbs from the
       floor and narrows to the dome's crown; behind them the dome's own skin, faint, brightest where it is seen edgewise; its
       warmth laid on the floor inside it. Drawn as light on the world (additive, no lamp: v9.4) and, while his sight is open,
       as a glow of its own in the vision (spiritAura: the vision draws the world as a negative) */
    const F2G = { rings: 7, R0: F2P.circle.r + 0.03, H: 1.32 };
    const f2GoldRingMat = B({ color: F2GOLD, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false });
    const f2GoldRingGeo = new THREE.TorusGeometry(1, 0.006, 6, 120); f2GoldRingGeo.rotateX(Math.PI / 2); owned.push(f2GoldRingGeo);
    const f2Gold = new THREE.Group(); f2Gold.name = 'the gold round him'; f2Gold.position.set(F2P.circle.x, 0, F2P.circle.z); f2Gold.visible = false; hisSideG.add(f2Gold);
    const f2Rings = [];
    for (let i = 0; i < F2G.rings; i++) { const m = new THREE.Mesh(f2GoldRingGeo, f2GoldRingMat.clone()); mats.push(m.material); m.frustumCulled = false; f2Gold.add(m); f2Rings.push(m); }
    /* the dome's skin: an upper half of a sphere stretched to the rings' crown, lit by a picture of light made in its own small
       program (light only, no lamp): brightest edgewise, bands climbing it */
    const f2DomeMat = new THREE.ShaderMaterial({
      uniforms: { uK: { value: 0 }, uT: { value: 0 }, uCol: { value: new THREE.Color(F2GOLD) }, uPush: { value: 0 } },
      vertexShader: 'varying vec3 vN; varying vec3 vV; varying float vY; void main() { vec4 w = modelMatrix * vec4(position, 1.0); vY = position.y;'
        + ' vN = normalize(mat3(modelMatrix) * normal); vV = normalize(cameraPosition - w.xyz); gl_Position = projectionMatrix * viewMatrix * w; }',
      fragmentShader: 'uniform float uK; uniform float uT; uniform vec3 uCol; uniform float uPush; varying vec3 vN; varying vec3 vV; varying float vY;'
        + ' void main() { float f = 1.0 - abs(dot(vN, vV)); float rim = pow(f, 2.2);'
        + ' float bands = 0.5 + 0.5 * sin(vY * 26.0 - uT * 3.2); bands = pow(bands, 6.0);'
        + ' float a = uK * (0.10 + 0.55 * rim + 0.22 * bands * (0.4 + uPush)) * (1.0 - smoothstep(0.92, 1.0, vY));'
        + ' gl_FragColor = vec4(uCol * a, 1.0); }',
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, toneMapped: false
    });
    mats.push(f2DomeMat);
    const f2DomeGeo = new THREE.SphereGeometry(1, 64, 20, 0, Math.PI * 2, 0, Math.PI / 2); owned.push(f2DomeGeo);
    const f2Dome = new THREE.Mesh(f2DomeGeo, f2DomeMat); f2Dome.name = 'the gold dome'; f2Dome.scale.set(F2G.R0, F2G.H, F2G.R0); f2Dome.frustumCulled = false; f2Gold.add(f2Dome);
    const f2GoldPool = pool(F2P.circle.x, 0.006, F2P.circle.z, 2.2, 2.2, F2GOLD, 0.0, { parent: hisSideG, look: null });
    const f2GoldCeil = pool(F2P.circle.x, FLAT.ceil - 0.01, F2P.circle.z, 3.4, 3.4, 0xffb850, 0.0, { rx: Math.PI / 2, parent: hisSideG, look: null });
    /* in the vision: the rings and the dome's skin as glows of the vision's own (Grandmaster Pho's gold in it, as chapter 5
       lays his) */
    const f2GoldAura = ctx.spiritAura ? ctx.spiritAura(f2Gold, { color: F2GOLD, fill: 0.08, rim: 1.25, power: 2.0, flicker: 0.12, xray: 1 }) : null;

    /* ---------------------------------------------------------------- THE RED THREADS (the plan's 12): fine filaments of
       red that come in under his front door and through his glass, feeling along the floor, following his footsteps toward
       him; a dry, slow growth, never a face, never a hand. In Spirit Vision only (ctx.spirit: the vision's layer, nowhere
       else), as the play draws them at three o'clock (PLAY.md 4: its red, its thickness). Each is a tube re-laid every frame
       from where its tail is to where its head has got to along its own way (a pure function of the clock); where its head
       meets the gold it BURNS: sparks, and the thread burning back from the tip toward where it came in, curls of it going
       to ash. */
    const F2T = { M: 44, R: 5, r: 0.0045 };
    function f2TubeGeo() {
      const nv = (F2T.M + 1) * F2T.R, pos = new Float32Array(nv * 3), nor = new Float32Array(nv * 3), idx = [];
      for (let i = 0; i < F2T.M; i++) for (let j = 0; j < F2T.R; j++) { const a = i * F2T.R + j, b = i * F2T.R + (j + 1) % F2T.R, c = (i + 1) * F2T.R + j, d = (i + 1) * F2T.R + (j + 1) % F2T.R; idx.push(a, c, b, b, c, d); }
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('normal', new THREE.BufferAttribute(nor, 3)); g.setIndex(idx);
      g.boundingSphere = new THREE.Sphere(new THREE.Vector3(F2HX, 0, 0), 60); owned.push(g); return g;
    }
    const _tA = new THREE.Vector3(), _tB = new THREE.Vector3(), _tT = new THREE.Vector3(), _tN = new THREE.Vector3(), _tBi = new THREE.Vector3(), _tUp = new THREE.Vector3(0, 1, 0);
    /* lay a tube along `at(s)` from s0 to s1 (metres along its way), its thickness `r` thinning to nothing at its head */
    function f2TubeLay(g, at, s0, s1, r, taper = 0.06) {
      const P = g.attributes.position.array, Nn = g.attributes.normal.array, L = Math.max(1e-4, s1 - s0);
      for (let i = 0; i <= F2T.M; i++) {
        const s = s0 + L * i / F2T.M; at(s, _tA); at(Math.min(s1, s + 0.01) === s ? s - 0.01 : s + 0.01, _tB);
        _tT.subVectors(_tB, _tA); if (Math.min(s1, s + 0.01) === s) _tT.negate(); _tT.normalize();
        _tN.crossVectors(_tT, _tUp); if (_tN.lengthSq() < 1e-6) _tN.set(1, 0, 0); _tN.normalize(); _tBi.crossVectors(_tN, _tT).normalize();
        const head = c01((s1 - s) / taper), rr = r * (0.25 + 0.75 * head);
        for (let j = 0; j < F2T.R; j++) { const a = j / F2T.R * Math.PI * 2, cx = Math.cos(a), sy = Math.sin(a), k = (i * F2T.R + j) * 3;
          const nx = _tN.x * cx + _tBi.x * sy, ny = _tN.y * cx + _tBi.y * sy, nz = _tN.z * cx + _tBi.z * sy;
          P[k] = _tA.x + nx * rr; P[k + 1] = _tA.y + ny * rr; P[k + 2] = _tA.z + nz * rr; Nn[k] = nx; Nn[k + 1] = ny; Nn[k + 2] = nz; }
      }
      g.attributes.position.needsUpdate = true; g.attributes.normal.needsUpdate = true;
    }
    /* each thread's way: from where it comes in, along the floor, to the gold's edge. `from` 'door' (under his front door, out
       of the corridor) or 'glass' (through his glass from the night outside: in at a height, down the pane, onto the floor),
       its points, and the lateral feel of it (a slow sideways wave, the thread searching) */
    const F2DOME_EDGE = F2G.R0 + 0.07;
    function f2Way(from, x0, z0, aim, seed) {
      const C = F2P.circle, pts = [];
      if (from === 'door') { pts.push([x0, 0.006, LIV.z0 - 0.6], [x0, 0.006, LIV.z0 + 0.05]); }
      else { pts.push([x0, 1.5, LIV.z1 + 1.4], [x0, 0.6, LIV.z1 + 0.25], [x0 + 0.05, 0.03, LIV.z1 - 0.15]); }
      /* across the floor to the gold's edge, at the angle `aim` (radians about the circle's middle, 0 toward +z) */
      const ex = C.x + Math.sin(aim) * F2DOME_EDGE, ez = C.z + Math.cos(aim) * F2DOME_EDGE, last = pts[pts.length - 1];
      const mx = lp(last[0], ex, 0.5) + Math.sin(seed * 3.1) * 0.35, mz = lp(last[2], ez, 0.5) + Math.cos(seed * 2.3) * 0.3;
      pts.push([mx, 0.008, mz], [ex, 0.01, ez]);
      const curve = new THREE.CatmullRomCurve3(pts.map(p => new THREE.Vector3(p[0], p[1], p[2])), false, 'centripetal');
      return { curve, L: curve.getLength(), seed };
    }
    /* THE THREADS AT HIS FEET (endings B and C, before the barrier: the plan's "the threads are already at his feet"): the same
       threads from the same places (under his front door, through his glass) to his sofa, where he sits (B) or lies (C):
       ended a stride in front of it, spread along it; those from his door come round his sofa's far end, never under it */
    function f2WayNear(from, x0, i, seed) {
      const pts = [], S = HIS.sofa, ex = S.x - 0.55 + 0.18 * i, ez = S.z + 0.62 + 0.06 * Math.sin(i * 2.1);
      if (from === 'door') pts.push([x0, 0.006, LIV.z0 - 0.6], [x0, 0.006, LIV.z0 + 0.05], [S.x - 1.2, 0.007, S.z - 0.62], [S.x - 1.25, 0.008, S.z + 0.45]);
      else pts.push([x0, 1.5, LIV.z1 + 1.4], [x0, 0.6, LIV.z1 + 0.25], [x0 + 0.05, 0.03, LIV.z1 - 0.15],
                    [lp(x0, ex, 0.5) + Math.sin(seed * 3.1) * 0.3, 0.008, lp(LIV.z1 - 0.15, ez, 0.5) + Math.cos(seed * 2.3) * 0.25]);
      pts.push([ex, 0.01, ez]);
      const curve = new THREE.CatmullRomCurve3(pts.map(p => new THREE.Vector3(p[0], p[1], p[2])), false, 'centripetal');
      return { curve, L: curve.getLength(), seed };
    }
    function f2WayAt(W, s, t, out) {
      const u = c01(s / W.L); W.curve.getPointAt(u, out);
      /* (the search: a sideways wave along it, travelling with the head, smaller near where it came in and at the gold) */
      const k = Math.sin(Math.PI * u) * 0.06, w = Math.sin(s * 5.1 - t * 1.3 + W.seed * 7.0) * k;
      W.curve.getTangentAt(Math.min(0.999, u), _tT); out.x += -_tT.z * w; out.z += _tT.x * w;
      if (out.y < 0.006) out.y = 0.006;
      return out;
    }
    const F2THREADS = [
      { from: 'door', x: HIS.door.x - 0.22, aim: Math.PI + 0.55, t0: 0.0, v: 0.55 },
      { from: 'door', x: HIS.door.x + 0.08, aim: Math.PI + 0.2, t0: 0.7, v: 0.5 },
      { from: 'door', x: HIS.door.x + 0.3, aim: Math.PI - 0.35, t0: 1.5, v: 0.58 },
      { from: 'glass', x: F2P.circle.x - 1.1, aim: -0.55, t0: 0.4, v: 0.5 },
      { from: 'glass', x: F2P.circle.x + 0.25, aim: 0.25, t0: 1.0, v: 0.45 },
      { from: 'glass', x: F2P.balc.x - 0.2, aim: 1.0, t0: 0.2, v: 0.6 },
      { from: 'glass', x: F2P.circle.x + 2.9, aim: 1.6, t0: 1.8, v: 0.62 }
    ].map((T, i) => {
      const W = f2Way(T.from, T.x, 0, T.aim, i + 1), Wn = f2WayNear(T.from, T.x, i, i + 1), g = f2TubeGeo(), m = new THREE.Mesh(g, new THREE.MeshBasicMaterial());
      m.name = 'a red thread (the barrier)'; m.frustumCulled = false; m.visible = false; hisSideG.add(m);
      const sp = ctx.spirit ? ctx.spirit(m, { color: F2RED, fill: 0.6, rim: 1.2, flicker: 0.35, xray: 0.6 }) : null;
      return Object.assign({}, T, { W, Wn, g, m, sp, i });
    });
    /* THE SPARKS where a thread burns on the gold, and its ash: small motes in the vision (ctx.spirit on an instanced mote),
       each a pure function of the clock (born at a moment, flying out and falling, fading) */
    const F2S = { n: 160 };
    const f2SparkGeo = new THREE.OctahedronGeometry(0.011, 0);   // (twice the first build's: at 0.0055 a spark was a pixel on a phone, photographed) owned.push(f2SparkGeo);
    const f2Sparks = new THREE.InstancedMesh(f2SparkGeo, new THREE.MeshBasicMaterial(), F2S.n); f2Sparks.name = 'the sparks (the barrier)';
    f2Sparks.frustumCulled = false; f2Sparks.visible = false; owned.push(f2Sparks); hisSideG.add(f2Sparks); f2Sparks.position.set(F2P.circle.x, 0, F2P.circle.z);
    const f2SparksSp = ctx.spirit ? ctx.spirit(f2Sparks, { color: 0xffb04a, fill: 1.4, rim: 0.6, flicker: 0.6, xray: 1 }) : null;
    const f2Ash = new THREE.InstancedMesh(f2SparkGeo, new THREE.MeshBasicMaterial(), F2S.n); f2Ash.name = 'the ash (the barrier)';
    f2Ash.frustumCulled = false; f2Ash.visible = false; owned.push(f2Ash); hisSideG.add(f2Ash); f2Ash.position.set(F2P.circle.x, 0, F2P.circle.z);
    const f2AshSp = ctx.spirit ? ctx.spirit(f2Ash, { color: 0x8a3a30, fill: 0.7, rim: 0.4, flicker: 0.1, xray: 1 }) : null;
    const _sM = new THREE.Matrix4(), _sQ = new THREE.Quaternion(), _sP = new THREE.Vector3(), _sS = new THREE.Vector3(), _sE = new THREE.Euler();
    const f2Hash = (n) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

    /* ---------------------------------------------------------------- THE FOOTSTEPS OF ENDING C (the plan's 9.8 C: "the red
       footsteps end at the sofa"): his steps of the night after the decision, from his table to the kitchen drawer and the
       tap, and to the sofa, red in Spirit Vision as the play's are (PLAY.md 4); the play's own from his door to his bed are
       the play's and stay as it lays them */
    const f2Feet = [];
    { const fg = new THREE.CircleGeometry(1, 16); fg.rotateX(-Math.PI / 2); owned.push(fg);
      const W = [[F2P.table.x, F2P.table.z], [F2P.table.x - 0.1, F2P.table.z - 0.9], [F2P.kitchen.x + 0.2, F2P.kitchen.z + 0.3], [F2P.kitchen.x, F2P.kitchen.z],
                 [F2P.kitchen.x + 0.7, F2P.kitchen.z + 0.05], [F2P.kitchen.x - 0.4, F2P.kitchen.z + 0.7], [F2P.sofa.x + 1.2, F2P.sofa.z + 0.75], [F2P.sofa.x + 0.2, F2P.sofa.z + 0.62]];
      const L = f2PathLen(W), n = Math.round(L / 0.36);
      for (let i = 0; i <= n; i++) { const s = L * i / n, p = f2PathAt(W, s), q = f2PathAt(W, Math.min(L, s + 0.2)), ang = Math.atan2(q[0] - p[0], q[1] - p[1]), side = (i % 2 ? 1 : -1) * 0.1;
        const m = new THREE.Mesh(fg, new THREE.MeshBasicMaterial()); m.scale.set(0.05, 1, 0.12); m.name = 'his footstep (ending C)';
        m.position.set(p[0] + Math.cos(ang) * side, 0.012, p[1] - Math.sin(ang) * side); m.rotation.y = ang; m.frustumCulled = false; m.visible = false; hisSideG.add(m);
        /* (not seen through things: drawn through his sofa's seat as he lay on it, the steps walked across its cushions,
           photographed) */
        f2Feet.push({ m, sp: ctx.spirit ? ctx.spirit(m, { color: F2RED, fill: 1.1, rim: 0.4, flicker: 0.2, xray: 0 }) : null }); } }

    /* ---------------------------------------------------------------- HIS WRIST (the plan's 9.8 D, 9.9): the band of red light
       a thread wraps round his left wrist at the balcony's door (ending D), burned off by the gold in a white flash, the red
       mark it leaves, and the white thread his teacher ties over the same wrist at dawn. Each a ring laid round the left
       hand's wrist bone in the hands' own pass (the left hand is the mirrored copy of the right: buildPrayerArm) */
    const F2W = { band: null, mark: null, thread: null, flash: null, on: false, knot: null, fit: null };
    /* THE WAY ROUND HIS WRIST, laid on his own skin (the hands' model, measured once). The hand bone hangs from the model's
       armature, whose own units are not metres (the file's armature carries a hundred times, and the model is sized to a
       real hand by a scale of its own), so the rings sized in metres inside that frame stood far out round his wrist, off
       every picture, never seen in any ending, and the measure taken in the hand bone's frame read the whole arm (0.0042 of
       its units: run 8's reading). Measured in the hands' own world instead: the forearm's line from the skin itself (its
       middle 3 to 9 cm behind the wrist's joint), a slice of the skin across that line `back` metres up the arm, and round
       the slice, every 7.5 degrees, the furthest skin from its middle (so the loop never sinks into it), smoothed, then `gap`
       metres out; a tube `th` thick, carried by the armature in that frame's own units (the forearm's skin moves with it:
       the hand turns on its own bone) */
    function f2WristLoop(L, wr, back, gap, th) {
      const fa = wr.parent; L.updateWorldMatrix(true, true);
      const O = new THREE.Vector3(), Yh = new THREE.Vector3(), v = new THREE.Vector3(), Cf = new THREE.Vector3(), ax = new THREE.Vector3();
      wr.getWorldPosition(O); Yh.setFromMatrixColumn(wr.matrixWorld, 1).normalize();
      const near = [];
      L.traverse(o => { if (!o.isSkinnedMesh || !o.geometry || !o.geometry.attributes.position) return;
        if (o.skeleton) o.skeleton.update();
        const pos = o.geometry.attributes.position;
        for (let i = 0; i < pos.count; i++) { o.getVertexPosition(i, v); v.applyMatrix4(o.matrixWorld); if (v.distanceToSquared(O) < 0.0144) near.push(v.clone()); } });
      let nf = 0; for (const p of near) { const a = v.copy(p).sub(O).dot(Yh); if (a < -0.03 && a > -0.09) { Cf.add(p); nf++; } }
      if (nf > 20) ax.copy(O).sub(Cf.multiplyScalar(1 / nf)).normalize(); else ax.copy(Yh);
      const c0 = O.clone().addScaledVector(ax, -back);
      const e1 = new THREE.Vector3(0, 1, 0).addScaledVector(ax, -ax.y); if (e1.lengthSq() < 1e-6) e1.set(1, 0, 0).addScaledVector(ax, -ax.x); e1.normalize();
      const e2 = new THREE.Vector3().crossVectors(ax, e1).normalize();
      const sl = []; for (const p of near) { v.copy(p).sub(c0); const a = v.dot(ax); if (Math.abs(a) < 0.005) sl.push([v.dot(e1), v.dot(e2)]); }
      const N = 48, rb = new Array(N).fill(0);
      let cx = 0, cy = 0;
      if (sl.length >= 16) { let x0 = 9, x1 = -9, y0 = 9, y1 = -9; for (const [x, y] of sl) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
        cx = (x0 + x1) / 2; cy = (y0 + y1) / 2;
        for (const [x, y] of sl) { const r = Math.hypot(x - cx, y - cy), b = ((Math.floor((Math.atan2(y - cy, x - cx) + Math.PI) / (2 * Math.PI) * N) % N) + N) % N; if (r > rb[b]) rb[b] = r; }
        for (let pass = 0; pass < N && rb.some(r => !r); pass++) { const c = rb.slice(); for (let i = 0; i < N; i++) if (!c[i]) rb[i] = Math.max(c[(i + N - 1) % N], c[(i + 1) % N]); } }
      else rb.fill(0.032);
      const dl = rb.map((r, i) => Math.max(r, rb[(i + N - 1) % N], rb[(i + 1) % N]));
      const R = dl.map((r, i) => (dl[(i + N - 1) % N] + 2 * r + dl[(i + 1) % N]) / 4 + gap);
      const sp = new THREE.Vector3().setFromMatrixColumn(fa.matrixWorld, 1).length() || 1;
      const pts = R.map((r, i) => { const a = (i + 0.5) / N * 2 * Math.PI - Math.PI;
        return fa.worldToLocal(c0.clone().addScaledVector(e1, cx + r * Math.cos(a)).addScaledVector(e2, cy + r * Math.sin(a))); });
      const g = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, true, 'centripetal'), 96, th / sp, 8, true); owned.push(g);
      return { g, pts, sp, n: sl.length, rx: (Math.max(...R) - gap), rn: (Math.min(...R) - gap), axLocal: fa.worldToLocal(O.clone()).sub(fa.worldToLocal(O.clone().addScaledVector(ax, -0.05))).normalize() };
    }
    function f2WristDress() {
      if (F2W.band || !F2.api || !F2.api.buildPrayerArm) return !!F2W.band;
      const L = F2.api.buildPrayerArm(); if (!L || !L.userData || !L.userData.model) return false;
      const wr = L.userData.model.getObjectByName('handR'); if (!wr || !wr.parent) return false;
      const mk = (back, gap, th, color, add, op) => { const fit = f2WristLoop(L, wr, back, gap, th);
        const m = new THREE.Mesh(fit.g, new THREE.MeshBasicMaterial({ color, transparent: true, opacity: op, depthWrite: !add, blending: add ? THREE.AdditiveBlending : THREE.NormalBlending, toneMapped: false })); mats.push(m.material);
        m.visible = false; m.frustumCulled = false; m.renderOrder = 3; m.userData.fit = fit; wr.parent.add(m); return m; };
      /* (metres: the red band of ending D standing off the skin and glowing, its haze, the mark it leaves as a welt, and the
         white thread's two turns side by side a little up from the wrist's crease, 2.4 mm thick, a cotton cord's) */
      F2W.band = mk(0.018, 0.005, 0.0045, F2RED, true, 0.9);
      F2W.band2 = mk(0.018, 0.008, 0.009, 0xff5040, true, 0.35);
      F2W.mark = mk(0.018, -0.0011, 0.0026, 0xb04a46, false, 0.85);
      F2W.thread = mk(0.016, 0.0016, 0.0012, 0xf4f2ea, false, 1.0);
      F2W.thread2 = mk(0.021, 0.0016, 0.0012, 0xf4f2ea, false, 1.0);
      const f = F2W.thread.userData.fit; F2W.fit = { slice: f.n, rMax: +f.rx.toFixed(4), rMin: +f.rn.toFixed(4), unit: +f.sp.toFixed(3) };
      /* the knot: a small knot and its two cut ends, laid each frame on the turn's side his eye sees */
      const sp = f.sp, kg = new THREE.IcosahedronGeometry(0.0026 / sp, 1), tg = new THREE.CylinderGeometry(0.0008 / sp, 0.0007 / sp, 0.014 / sp, 6, 1); tg.translate(0, 0.007 / sp, 0); owned.push(kg, tg);
      const km = new THREE.MeshBasicMaterial({ color: 0xeeebe2, toneMapped: false }); mats.push(km);
      const K = new THREE.Group(); K.add(new THREE.Mesh(kg, km)); const t1 = new THREE.Mesh(tg, km), t2 = new THREE.Mesh(tg, km); K.add(t1, t2);
      K.traverse(o => { o.frustumCulled = false; o.renderOrder = 3; }); K.visible = false; wr.parent.add(K);
      F2W.knot = { K, t1, t2, wr };
      /* IN SPIRIT VISION THE BAND IS A SPIRIT: the vision draws his hands black and white with the world (everything but the
         entities: its rule since episode 4 chapter 4), so the red band in the hands' pass read there as a grey ring (run 7's
         photograph at the barrier). Its twin in the world's vision layer is laid each frame exactly where the hands' pass
         draws the band (every point of the hands' camera at depth z stands on this lens at z / s, s = tan(f/2) / tan(26), as
         f2WristAt), and glows red with the threads round the wrist's edge (the hands are laid over the spirits) */
      const fitS = f2WristLoop(L, wr, 0.018, 0.009, 0.007), bm = new THREE.MeshBasicMaterial(); mats.push(bm);
      const sm = new THREE.Mesh(fitS.g, bm); sm.matrixAutoUpdate = false; sm.visible = false; sm.frustumCulled = false; world.add(sm);
      F2W.bandSp = { m: sm, fa: wr.parent, h: ctx.spirit ? ctx.spirit(sm, { color: F2RED, fill: 1.3, rim: 0.9, flicker: 0.25, xray: 1 }) : null };
      return true;
    }
    const _bsS = new THREE.Matrix4(), _bsM = new THREE.Matrix4(), _bsP = new THREE.Matrix4(), _bsRed = new THREE.Color(F2RED), _bsWhite = new THREE.Color(0xffffff);
    function f2BandSpirit(on, alpha, white) {
      const B = F2W.bandSp, A = F2.api; if (!B) return;
      B.m.visible = !!(on && B.h && A && A.vmCam); if (!B.m.visible) return;
      const s = Math.tan(camera.fov * Math.PI / 360) / Math.tan(A.vmCam.fov * Math.PI / 360);
      camera.updateMatrixWorld(); A.vmCam.updateMatrixWorld(); B.fa.updateWorldMatrix(true, false);
      _bsM.copy(camera.matrixWorld).multiply(_bsS.makeScale(1, 1, 1 / s)).multiply(A.vmCam.matrixWorldInverse).multiply(B.fa.matrixWorld);
      B.m.parent.updateWorldMatrix(true, false); B.m.matrix.copy(_bsP.copy(B.m.parent.matrixWorld).invert().multiply(_bsM)); B.m.matrixWorldNeedsUpdate = true;
      B.h.set('uAlpha', c01(alpha)); B.h.set('uColor', white ? _bsWhite : _bsRed);
    }
    /* the knot on the side of the first turn nearest his eye (the hands' lens: the wrist turns with the arm), its two ends
       out from it, a little apart, toward the hand */
    const _kc = new THREE.Vector3(), _kn = new THREE.Vector3(), _kt = new THREE.Vector3(), _kd = new THREE.Vector3(), _kup = new THREE.Vector3(0, 1, 0);
    function f2KnotLay(on) {
      const Kn = F2W.knot; if (!Kn) return; Kn.K.visible = !!on; if (!on) return;
      const A = F2.api, fit = F2W.thread.userData.fit, fa = Kn.wr.parent; if (!A || !A.vmCam) return;
      A.vmCam.updateMatrixWorld(); A.vmCam.getWorldPosition(_kc); fa.updateWorldMatrix(true, false); fa.worldToLocal(_kc);
      let best = 0, bd = Infinity; for (let i = 0; i < fit.pts.length; i++) { const d = fit.pts[i].distanceToSquared(_kc); if (d < bd) { bd = d; best = i; } }
      const p = fit.pts[best], c = _kd.set(0, 0, 0); for (const q of fit.pts) c.add(q); c.multiplyScalar(1 / fit.pts.length);
      const ax = fit.axLocal; _kn.copy(p).sub(c); _kn.addScaledVector(ax, -_kn.dot(ax)).normalize();
      Kn.K.position.copy(p).addScaledVector(_kn, 0.0012 / fit.sp);
      _kt.crossVectors(ax, _kn).normalize();
      const lay = (m, s) => { _kd.copy(_kn).multiplyScalar(0.55).addScaledVector(_kt, 0.6 * s).addScaledVector(ax, 0.55).normalize(); m.quaternion.setFromUnitVectors(_kup, _kd); };
      lay(Kn.t1, 1); lay(Kn.t2, -1);
    }
    function f2WristShow(band, mark, thread, flash) {
      if (!f2WristDress()) return;
      /* (in Spirit Vision the band is its spirit twin's, red: the hands' pass would draw it grey) */
      const sp = !!F2.vis && (band > 0.001 || flash > 0.001);
      F2W.band.visible = band > 0.001 && !sp; F2W.band.material.opacity = 0.9 * band; F2W.band2.visible = (band > 0.001 || flash > 0.001) && !sp;
      f2BandSpirit(sp, Math.max(band, flash), flash > band);
      /* (the burn's flash a soft warm light that opens out from the wrist as it fades, about the ring's own middle: drawn
         white at 0.9 it stood as a solid white bangle, photographed) */
      F2W.band2.material.opacity = 0.35 * band + 0.5 * flash; F2W.band2.material.color.setHex(flash > band ? 0xfff0d6 : 0xff5040);
      { const f = F2W.band2.userData.fit, kx = flash > 0.001 && band < 0.5 ? 1 + 0.6 * (1 - flash) : 1;
        if (!f.mid) { f.mid = new THREE.Vector3(); for (const q of f.pts) f.mid.add(q); f.mid.multiplyScalar(1 / f.pts.length); }
        F2W.band2.scale.setScalar(kx); F2W.band2.position.copy(f.mid).multiplyScalar(1 - kx); }
      F2W.mark.visible = mark > 0.001; F2W.mark.material.opacity = 0.85 * mark;
      F2W.thread.visible = thread > 0.5; F2W.thread2.visible = thread > 1.5;
      f2KnotLay(thread > 0.5);
    }

    /* ---------------------------------------------------------------- THE FILMS' FRAME, AND WHAT EACH ONE OWNS
       begin(k, api, s, E) at the scene's first frame; frame(t) every frame of it; end() at its last (and on a skip). What a film
       changes it puts back at its end: the things it moved, the press, the vision, his hands, the lens's roll */
    function f2Beds(o) { if (S && S.beds) S.beds.film = o; }
    /* the beds the play would have at pressure p in his flat at night (PLAY.md 5, c_play.js bedsTick), so a film's night is the
       play's night */
    function f2NightBeds(p, vision, extra) {
      const o = { night: 0.5 * Math.max(0, 1 - p * 1.4), three: 0.55 * Math.min(1, p * 1.6), m6a: p >= 0.2 ? 0.32 : 0, m6b: p >= 0.5 ? 0.3 * c01((p - 0.5) / 0.1) : 0,
                  m6c: p >= 0.8 ? 0.3 * c01((p - 0.8) / 0.08) : 0, tin: p > 0.6 ? 0.16 * (p - 0.6) / 0.4 : 0, brth: 0.32 * (0.4 + 0.6 * p), threads: vision ? 0.3 : 0 };
      if (extra) Object.assign(o, extra);
      return o;
    }
    /* SPIRIT VISION held by the film's clock (the engine's own curve out from his eyes over `secs` from `t0`, full until `t1`,
       home over `back`), held only round the moments it is open (a held radius of 0 draws every frame through the vision's
       pass for nothing: episode 4 chapter 5's R51) */
    const F2VR = 70, f2VisCurve = (u) => 0.30 * u + 0.70 * u * u * u;
    function f2VisionR(t, t0, secs, t1, back) {
      if (t >= t0 && t < t0 + secs) return [F2VR * f2VisCurve((t - t0) / secs), true];
      if (t >= t0 + secs && t < t1) return [F2VR, false];
      if (t >= t1 && t < t1 + back) return [F2VR * f2VisCurve(1 - (t - t1) / back), true];
      return [0, false];
    }
    function f2Vision(r, mv, t) {
      if (!kit || !kit.vision) return;
      if (r > 0.001 || mv) { kit.vision({ r, moving: !!mv }); F2.vis = true; F2.visT = t; F2.visZero = 0; }
      /* (shut: held at nothing for three drawn frames and a third of a second, so the vision's own radius is nothing when it
         is let go; let go while it stood open, it runs home by itself over its own 1.6 s, across a cut: the oven's clock was
         photographed inverted a second after B's cut, where a seek had jumped the third of a second) */
      else if (F2.vis) { kit.vision({ r: 0, moving: false }); F2.visZero = (F2.visZero || 0) + 1;
        if (F2.visZero > 3 && !(t != null && t - (F2.visT || 0) < 0.3 && t >= (F2.visT || 0))) { kit.vision(null); F2.vis = false; } }
    }
    function f2Look(name) { if (F2.look === name) return; F2.look = name; if (kit && kit.daylight && PRESETS[name]) kit.daylight(PRESETS[name], 0); }
    function f2Press(k) { if (kit && kit.press) kit.press(c01(k), { secs: 0, cine: true }); F2.press = k; }
    /* a thing held in his hand for the film (kit.hold: drawn in the hands' pass), or let go; `hand` 'left' or right */
    function f2Hold(obj, o) {
      const key = obj ? obj.uuid + (o && o.hand || '') : null;
      if (key === F2.held) return; F2.held = key;
      if (!kit || !kit.hold) return;
      kit.hold(null);
      if (obj) kit.hold(obj, o || {});
    }
    /* the hands: shown or not, and in which library pose at what share (api.handPose draws the pose at exactly k) */
    function f2Hands(show, pose, k, o) {
      const A = F2.api; if (!A) return;
      if (A.handsRoot) A.handsRoot.visible = !!show;
      if (!show) return;
      if (A.handPose) A.handPose(pose || null, pose ? c01(k) : 0, o || {});
    }
    /* THE STRIP OF PILLS HELD UP TO HIS EYE (ending C): pinched between his thumb and the side of his first finger, standing
       out of his loose fist toward the room with its tablets turned to his eye (held at the palm, it lay under his hand, palm
       down in the library's place, never seen: run 7's photographs). Found from the hand's own bones with the pose laid whole
       (as the tie's wrist is: laid, read, and left for the frame to lay its own), then carried by the arm */
    const F2PILL = { g: null };
    function f2PillsGeo() {
      const A = F2.api, asp = A && A.vmCam ? A.vmCam.aspect : camera.aspect;
      if (F2PILL.g && Math.abs(F2PILL.g.asp - asp) < 1e-4) return F2PILL.g;
      if (!A || !A.armR || !A.vmCam || !A.handPose) return null;
      f2Hands(true, 'place', 1, { p: 0 });
      const R = A.armR; R.updateWorldMatrix(true, true);
      const th = R.getObjectByName('thumb03R'), ix = R.getObjectByName('f_index02R');
      if (!th || !ix) return null;
      const T = th.getWorldPosition(new THREE.Vector3()), I = ix.getWorldPosition(new THREE.Vector3());
      /* (standing UP out of the pinch, held up to be read: along the fingers it hung down under the fist, the fist's grip
         curling them down, and was seen as a sliver under it, photographed) */
      A.vmCam.updateMatrixWorld(); const eye = A.vmCam.getWorldPosition(new THREE.Vector3()), up = new THREE.Vector3().setFromMatrixColumn(A.vmCam.matrixWorld, 1).normalize();
      const Q = T.clone().add(I).multiplyScalar(0.5), C = Q.clone().addScaledVector(up, 0.06);
      const n = eye.clone().sub(C).normalize(), u = up.clone().addScaledVector(n, -up.dot(n)).normalize();
      C.addScaledVector(n, 0.02);
      const zx = new THREE.Vector3().crossVectors(u, n).normalize(), qW = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(u, n, zx));
      const rq = R.getWorldQuaternion(new THREE.Quaternion()).invert().multiply(qW), pl = R.worldToLocal(C.clone()), e = new THREE.Euler().setFromQuaternion(rq);
      F2PILL.g = { asp, pos: [pl.x, pl.y, pl.z], rot: [e.x, e.y, e.z] };
      return F2PILL.g;
    }
    /* the left hand placed as the right one's mirror (the library's poses lay most things in the right; a left hand on a door's
       frame or held out to his teacher is the right one's pose turned over), the right one hidden */
    function f2MirrorLeft(on) {
      const A = F2.api; if (!A || !A.armR) return;
      const L = A.buildPrayerArm ? A.buildPrayerArm() : null; if (!L) return;
      if (!on) { L.visible = false; A.armR.visible = true; return; }
      L.visible = true; L.position.set(-A.armR.position.x, A.armR.position.y, A.armR.position.z);
      const q = A.armR.quaternion; L.quaternion.set(q.x, -q.y, -q.z, q.w);
      A.armR.visible = false;
    }
    /* where a world point stands on this screen (NDC), for a hand laid over it */
    function f2Ndc(p) { camera.updateMatrixWorld(); return _f2v.set(p.x, p.y, p.z).project(camera); }
    /* his own bottle of holy water on his altar, trembling with each wave and still the moment the barrier holds (the plan's 9.7) */
    let f2BottleRest = null;
    function f2Bottle(shake, t) {
      const b = things.bottle; if (!b) return;
      if (!f2BottleRest) f2BottleRest = { x: b.position.x, z: b.position.z, ry: b.rotation.y };
      const k = c01(shake);
      b.position.x = f2BottleRest.x + 0.0016 * k * Math.sin(t * 61); b.position.z = f2BottleRest.z + 0.0014 * k * Math.sin(t * 53 + 1);
      b.rotation.z = 0.012 * k * Math.sin(t * 47 + 2); b.rotation.x = 0.01 * k * Math.sin(t * 43);
    }
    function f2BottleRestore() { const b = things.bottle; if (!b || !f2BottleRest) return; b.position.x = f2BottleRest.x; b.position.z = f2BottleRest.z; b.rotation.set(0, f2BottleRest.ry, 0); }

    /* ================================================================ THE BARRIER'S PICTURE (the plan's 9.7), from `b` its
       start on the ending's clock; B its own marks (y_endings.js BAR2 on the ending's clock), `from` the view the ending leaves
       him in. Returns the lens [eye, aim, lens, roll] for the frame */
    function f2BarrierCam(t, Bm, from) {
      const C = F2P.circle, eyeSit = [F2SIT.x, F2SIT.y, F2SIT.z], glassA = [C.x, 0.55, LIV.z1 + 2.0];
      if (!F2.barKeys || F2.barKeysFor !== Bm) {
        const K = [];
        K.push({ t: Bm.b0, e: from.e.slice(), a: from.a.slice(), fp: from.fp, fd: from.fd, n: 'bar:call', stop: true });
        K.push({ t: Bm.walk0, e: from.e.slice(), a: [lp(from.a[0], F2P.bagAt.x, 0.25), lp(from.a[1], 1.2, 0.3), lp(from.a[2], F2P.bagAt.z, 0.25)], fp: from.fp, fd: from.fd, n: 'bar:turn' });
        /* to the bag, around his sofa's near end: up from where the ending left him first if he was down */
        const path1 = F2PATH[F2.k] || F2PATH.A, rise = Bm.rise1 || 0;
        if (rise > 0) K.push({ t: Bm.walk0 + rise, e: [path1[0][0], F2EYE.stand, path1[0][1]], a: [path1[1][0], 1.3, path1[1][1]], fp: 64, fd: 56, n: 'bar:rise' });
        /* (to his front door and the bag on the floor beside it: what he goes for, the whole way) */
        const doorAim = [HIS.door.x + 0.3, 1.0, LIV.z0 + 0.05];
        f2WalkKeys(path1, Bm.walk0 + rise, Bm.bag, F2EYE.stand, { a: [F2P.bag.x, 0.2, F2P.bag.z], look: () => doorAim, fp: 64, fd: 56, n: 'bar:tobag' }).slice(1).forEach(k => K.push(k));
        /* down to the bag: his right hand into it (the zip, the spool), and up again */
        K.push({ t: Bm.bag + 0.9, e: [F2P.bagAt.x, F2EYE.crouch, F2P.bagAt.z], a: [F2P.bag.x, 0.15, F2P.bag.z + 0.05], fp: 62, fd: 54, n: 'bar:bag', stop: true });
        K.push({ t: Bm.spool, e: [F2P.bagAt.x, F2EYE.crouch, F2P.bagAt.z], a: [F2P.bag.x + 0.02, 0.18, F2P.bag.z + 0.08], fp: 62, fd: 54, n: 'bar:spool', stop: true });
        /* (up again facing along the wall, the way he goes round his sofa's end: risen facing the room, the sofa's back stood
           a hand's breadth before the lens and filled the frame, photographed) */
        K.push({ t: Bm.spool + 0.9, e: [F2P.bagAt.x - 0.05, F2EYE.stand, F2P.bagAt.z + 0.02], a: [F2PATH.on[1][0] - 0.9, 1.3, F2PATH.on[1][1] + 0.35], fp: 64, fd: 56, n: 'bar:up' });
        const path2 = F2PATH.on;
        /* (round his sofa's end past his altar, its candle, his teacher's photograph and the bottle on it trembling, then out to
           the middle of the room and his glass) */
        const altarAim = [HIS.altar.x + 0.05, 1.12, HIS.altar.z - 0.05];
        const altarThen = (s, L) => { const w = f2smo(c01((s - (L - 2.6)) / 1.8)); return [lp(altarAim[0], glassA[0], w), lp(altarAim[1], glassA[1], w), lp(altarAim[2], glassA[2], w)]; };
        f2WalkKeys(path2, Bm.spool + 0.9, Bm.sit0, F2EYE.stand, { a: glassA, look: altarThen, fp: 66, fd: 58, n: 'bar:tocircle' }).slice(1).forEach(k => K.push(k));
        /* he sits down, in the middle of the room, facing his glass (a pained sit, eased over 1.6 s) */
        K.push({ t: Bm.sit0 + 0.8, e: [F2SIT.x, 1.2, F2SIT.z - 0.06], a: [C.x, 0.95, C.z + 3.0], fp: 68, fd: 60, n: 'bar:sit' });
        K.push({ t: Bm.circle - 0.7, e: eyeSit, a: [C.x, 0.62, C.z + 3.0], fp: 70, fd: 62, n: 'bar:seated', stop: true });
        K.push({ t: Bm.circle, e: eyeSit, a: [C.x, 0.02, C.z + 1.5], fp: 70, fd: 62, n: 'bar:down', stop: true });
        F2.barKeys = K; F2.barKeysFor = Bm;
      }
      /* (the keys run up to the circle's moment and not onto it: while the event is open the film's clock stands EXACTLY on
         Bm.circle (the engine's wall, eventWait), and a test that took that moment as the keys' kept his head still while
         the thread went round him) */
      if (t < Bm.circle - 1e-3) return f2Keys(F2.barKeys, t);
      /* CLOSE THE CIRCLE (the film's clock stands at Bm.circle while it is open): his head follows the thread as it is laid,
         within a neck's reach (to his right as it goes round to his right, back to the front while it passes behind him, to his
         left as it comes round, and to the front where its ends meet), looking at the floor beyond his knees */
      if (t < Bm.after) {
        const u = F2.cirShow, turn = 1.05 * Math.sin(Math.PI * c01(u / 0.5)) * (u < 0.5 ? -1 : 0) + 1.05 * Math.sin(Math.PI * c01((u - 0.5) / 0.5)) * (u >= 0.5 ? 1 : 0);
        const yw = Math.PI + turn, d = 1.5, nar = f2Narrow();
        const a = [C.x - Math.sin(yw) * d, 0.02 + 0.08 * Math.abs(Math.sin(turn)), C.z - Math.cos(yw) * d];
        const v = [eyeSit[0], eyeSit[1], eyeSit[2], a[0], a[1], a[2], nar ? 70 : 62, 0];
        /* after it closes, the eye lifts to level for his teacher's words */
        const lift = f2smo(f2win(t, Bm.circle + 0.05, Bm.after));
        return v.map((q, j) => (j === 4 ? lp(q, 0.75, lift) : q));
      }
      /* THE CHANT (the plan's 9.7, 26-40 s, the measured take): low, from the floor inside the circle, looking out to his glass
         and the balcony's door; a slow turn of 40 degrees as the threads come; an insert of the foot of his front door as they
         come in under it; the eye rising a little as he breathes out at the break */
      if (!F2.chantKeys || F2.chantKeysFor !== Bm) {
        const K = [], c0 = Bm.chant, Y0 = Math.PI - 0.15, Y1 = Math.PI - 0.15 - 0.7;
        const at = (yw, h, d = 2.2) => [C.x - Math.sin(yw) * d, h, C.z - Math.cos(yw) * d];
        K.push({ t: Bm.after, e: eyeSit, a: at(Math.PI, 0.75), fp: 66, fd: 58, n: 'bar:level', stop: true });
        K.push({ t: c0 + 0.5, e: eyeSit, a: at(Math.PI - 0.05, 0.62), fp: 66, fd: 58, n: 'bar:gold' });
        K.push({ t: Bm.door0 - 0.01, e: [eyeSit[0], 0.78, eyeSit[2]], a: at(Y0, 0.55), fp: 66, fd: 58, n: 'bar:gold2', stop: true });
        /* the insert: the foot of his front door, the red threads slipping in under it (a cut to a thing: v21.30) */
        K.push({ t: Bm.door0, e: [F2P.door.x + 0.75, 0.32, F2P.door.z + 1.35], a: [F2P.door.x + 0.05, 0.03, F2P.door.z + 0.02], fp: 40, fd: 34, n: 'bar:door', cut: true });
        K.push({ t: Bm.door1, e: [F2P.door.x + 0.7, 0.28, F2P.door.z + 1.25], a: [F2P.door.x + 0.1, 0.03, F2P.door.z + 0.2], fp: 38, fd: 32, n: 'bar:door2', stop: true });
        K.push({ t: Bm.door1 + 0.001, e: [eyeSit[0], 0.76, eyeSit[2]], a: at(Y0, 0.42), fp: 66, fd: 58, n: 'bar:low', cut: true });
        K.push({ t: Bm.touch + 1.6, e: [eyeSit[0], 0.74, eyeSit[2]], a: at(lp(Y0, Y1, 0.45), 0.36), fp: 66, fd: 58, n: 'bar:turn' });
        K.push({ t: Bm.surge, e: [eyeSit[0], 0.73, eyeSit[2]], a: at(Y1, 0.38), fp: 64, fd: 56, n: 'bar:surge', stop: true });
        K.push({ t: Bm.brk + 1.4, e: [eyeSit[0], 0.8, eyeSit[2]], a: at(Y1 + 0.2, 0.72), fp: 66, fd: 58, n: 'bar:break' });
        if (F2.k === 'D' && Bm.wrist0 != null) {
          K.push({ t: Bm.wrist0 + 0.6, e: [eyeSit[0], 0.81, eyeSit[2]], a: at(Math.PI - 0.2, 0.35, 1.4), fp: 64, fd: 56, n: 'bar:wrist', stop: true });
          K.push({ t: Bm.burn + 0.8, e: [eyeSit[0], 0.8, eyeSit[2]], a: at(Math.PI - 0.22, 0.32, 1.4), fp: 64, fd: 56, n: 'bar:burnt', stop: true });
        }
        K.push({ t: Bm.calm, e: [eyeSit[0], 0.82, eyeSit[2]], a: at(Math.PI - 0.3, 0.78), fp: 66, fd: 58, n: 'bar:quiet', stop: true });
        /* he lies down inside the circle on his back, his knees up: the ceiling, the city's glow on it */
        K.push({ t: Bm.lie, e: [eyeSit[0], 0.82, eyeSit[2]], a: at(Math.PI - 0.3, 0.9), fp: 66, fd: 58, n: 'bar:quiet2', stop: true });
        K.push({ t: Bm.lie + 0.8, e: [C.x, 0.5, C.z - 0.3], a: [C.x, 1.8, C.z + 1.6], fp: 66, fd: 58, n: 'bar:down' });
        K.push({ t: Bm.lie + 1.8, e: [C.x, F2EYE.lie, C.z - 0.5], a: [C.x + 0.05, FLAT.ceil, C.z + 0.6], fp: 66, fd: 58, n: 'bar:ceiling', stop: true });
        K.push({ t: Bm.end, e: [C.x, F2EYE.lie, C.z - 0.5], a: [C.x + 0.07, FLAT.ceil, C.z + 0.62], fp: 64, fd: 56, n: 'bar:ceiling2', stop: true });
        F2.chantKeys = K; F2.chantKeysFor = Bm;
      }
      return f2Keys(F2.chantKeys, t);
    }
    /* how hard the picture is pressed in the barrier, from the ending's own pressure at its start (`p0`) */
    function f2BarrierPress(t, Bm, p0) {
      if (t < Bm.chant) {
        const wave = Math.max(0, Math.sin((t - Bm.b0) * 2 * Math.PI / 8.0 - 0.4)) * 0.12;
        const sit = f2smo(f2win(t, Bm.circle, Bm.after)) * 0.08;
        return Math.min(0.95, p0 + wave - sit);
      }
      const rise = 0.12 * f2smo(f2win(t, Bm.chant, Bm.touch)) + 0.18 * f2smo(f2win(t, Bm.touch, Bm.surge)) + 0.12 * f2smo(f2win(t, Bm.surge - 0.6, Bm.surge + 0.4));
      const k = Math.min(1, p0 - 0.08 + rise);
      return t < Bm.brk ? k : k * (1 - f2s5(f2win(t, Bm.brk, Bm.brk + 0.55)));
    }
    /* THE BARRIER'S THINGS AND EFFECTS at its time t (Bm its marks; `push` the gold pushing harder, B's; `band` the band on his
       wrist, D's) */
    function f2BarrierFx(t, Bm, o) {
      const C = F2P.circle;
      /* the phone: in his hand through the call and the walk, then on the floor in front of him (set down as he sits, out of
         the lens's sight) */
      const onFloor = t >= Bm.sit0 + 1.0;
      f2PhoneFloorDress();
      f2FloorPhone.visible = onFloor && t < Bm.end + 1; f2FloorPhone.position.set(C.x + 0.12, 0, C.z + 0.62); f2FloorPhone.rotation.y = Math.PI + 0.35;
      if (F2M.phoneGlow) F2M.phoneGlow.m.opacity = 0.16 * (1 - 0.6 * f2smo(f2win(t, Bm.brk, Bm.calm)));
      /* the thread: laid by the event (or closed past it) */
      const lay = t < Bm.circle - 1e-3 ? 0 : (t >= Bm.after - 1e-3 || F2.cirDone) ? 1 : F2.cirShow;
      f2CircleLay(lay);
      if (f2Circle.aura) f2Circle.aura.set('uAlpha', 1);
      const spark = lay >= 1 ? Math.max(0, 1 - (t - Bm.circle) / 0.9) : 0;
      f2Spark.q.visible = spark > 0.01; f2Spark.m.opacity = spark; f2Spark.q.scale.setScalar(0.08 + 0.2 * spark);
      /* the spool set down by him, the thread laid */
      f2SpoolFloor.visible = t >= Bm.circle && lay >= 1 && t < Bm.end + 1; f2SpoolFloor.position.set(C.x + C.r - 0.06, 0.0, C.z + 0.25); f2SpoolFloor.rotation.set(Math.PI / 2, 0, 0.4);
      /* THE GOLD: rings rising from the thread over the chant's first verse, building the dome; it holds and pushes as the
         threads burn on it; at the break it settles into the thread and fades */
      const c0 = Bm.chant, up = f2smo(f2win(t, c0 + 0.3, c0 + 6.5)), fadeG = 1 - f2smo(f2win(t, Bm.brk + 1.5, Bm.calm + 1.2)), push = (o.push ? 0.45 : 0) + 0.55 * f2bell(t, Bm.touch - 0.5, Bm.touch + 1.0, Bm.surge, Bm.brk + 0.4);
      const gk = up * fadeG;
      f2Gold.visible = gk > 0.002;
      f2DomeMat.uniforms.uK.value = gk * (0.85 + 0.4 * push) * (1 - 0.6 * f2smo(f2win(t, Bm.brk, Bm.brk + 1.0)));
      f2DomeMat.uniforms.uT.value = t; f2DomeMat.uniforms.uPush.value = push;
      for (let i = 0; i < f2Rings.length; i++) {
        /* each ring climbs from the floor to the crown over 4.4 s, one every 0.9 s from the chant's start, then round again */
        const ph = ((t - c0 - 0.3 - i * 0.9) / 4.4), cyc = ph - Math.floor(ph), born = t >= c0 + 0.3 + i * 0.9;
        const h = F2G.H * Math.pow(cyc, 0.85), rr = F2G.R0 * Math.sqrt(Math.max(0, 1 - Math.pow(h / F2G.H, 2)));
        const m = f2Rings[i]; m.position.y = Math.max(0.004, h); m.scale.set(Math.max(0.02, rr), 1, Math.max(0.02, rr));
        const fadeTop = 1 - f2smo(c01((cyc - 0.78) / 0.22)), fadeBot = f2smo(c01(cyc / 0.06));
        m.material.opacity = born ? gk * fadeTop * fadeBot * (0.75 + 0.35 * push) : 0; m.visible = m.material.opacity > 0.002;
      }
      if (f2GoldAura) f2GoldAura.set('uAlpha', gk * (0.8 + 0.4 * push));
      f2GoldPool.m.opacity = 0.2 * gk * (0.8 + 0.4 * push); f2GoldPool.q.visible = f2GoldPool.m.opacity > 0.002;
      f2GoldCeil.m.opacity = 0.07 * gk; f2GoldCeil.q.visible = f2GoldCeil.m.opacity > 0.002;
      /* THE RED THREADS: in from the door and the glass from the vision's opening, to the gold; each meets it and burns back */
      const tv = Bm.vis0 + 0.4, burnK = 0.9, te = (F2.E && F2.E.slow) ? F2.E.slow(t) : t;
      let sparkN = 0, ashN = 0;
      for (const T of F2THREADS) {
        const t0 = tv + T.t0 * (o.near ? 0.4 : 1), grow = Math.max(0, te - t0), Lhit = T.W.L;
        /* (ending B and C: the threads are already at his feet: they begin most of the way along) */
        const start = o.near ? Lhit * 0.72 : 0;
        const tHit = t0 + (Lhit - start) / T.v, tTouch = Math.max(tHit, Bm.touch + T.i * 0.32);
        let head = Math.min(Lhit, start + grow * T.v), tail = 0;
        /* held off by the gold until its moment to touch it (the first touch is the slow motion's: Bm.touch) */
        if (te < tTouch) head = Math.min(head, Lhit - 0.02 - 0.03 * Math.sin(te * 2.0 + T.i));
        const burnT = te - tTouch;
        let alive = 1;
        if (burnT > 0) { head = Math.max(0, Lhit - burnT * burnK * (1 + 0.15 * T.i)); alive = head > 0.02 ? 1 : 0; }
        const shown = te >= t0 && head > tail + 0.01 && alive && t < Bm.calm + 2;
        T.m.visible = shown;
        if (shown) { f2TubeLay(T.g, (s, out) => f2WayAt(T.W, s, te, out), tail, head, F2T.r); if (T.sp) T.sp.set('uAlpha', 0.85); }
        /* its sparks: where it burns, a few motes a tenth of a second, born at the burning head */
        if (burnT > -0.05 && head > 0.02) {
          for (let j = 0; j < 7 && sparkN < F2S.n; j++) {
            const born = Math.floor((te - tTouch) * 10 - j) / 10, age = te - tTouch - born; if (born < 0 || age < 0 || age > 0.7) continue;
            const sb = Math.max(0, Lhit - born * burnK * (1 + 0.15 * T.i)); f2WayAt(T.W, sb, tTouch + born, _sP);
            const h1 = f2Hash(T.i * 97 + born * 31 + j), h2 = f2Hash(T.i * 13 + born * 71 + j * 3), h3 = f2Hash(T.i * 41 + born * 17 + j * 7);
            _sP.x += (h1 - 0.5) * 0.5 * age; _sP.z += (h2 - 0.5) * 0.5 * age; _sP.y += 0.35 * age * (0.6 + h3) - 1.2 * age * age;
            if (_sP.y < 0.005) _sP.y = 0.005;
            const sc = (1 - age / 0.7) * (0.7 + h3);
            _sP.x -= F2P.circle.x; _sP.z -= F2P.circle.z;
            _sS.setScalar(sc); _sE.set(h1 * 6, h2 * 6, h3 * 6); _sQ.setFromEuler(_sE); _sM.compose(_sP, _sQ, _sS); f2Sparks.setMatrixAt(sparkN++, _sM);
          }
        }
        /* its ash: curls of it lying where it burned, fading over 2.5 s */
        if (burnT > 0) {
          const step = 0.16;
          for (let s = Lhit; s > head && ashN < F2S.n; s -= step) {
            const bt = (Lhit - s) / (burnK * (1 + 0.15 * T.i)), age = burnT - bt; if (age < 0 || age > 2.5) continue;
            f2WayAt(T.W, s, tTouch + bt, _sP); _sP.y = 0.006 + 0.01 * f2Hash(s * 9 + T.i); _sP.x -= F2P.circle.x; _sP.z -= F2P.circle.z;
            const sc = 1.3 * (1 - age / 2.5);
            _sS.set(sc * 1.6, sc * 0.5, sc); _sE.set(0, f2Hash(s * 3 + T.i) * 6, 0); _sQ.setFromEuler(_sE); _sM.compose(_sP, _sQ, _sS); f2Ash.setMatrixAt(ashN++, _sM);
          }
        }
      }
      f2Sparks.count = sparkN; f2Sparks.visible = sparkN > 0; f2Sparks.instanceMatrix.needsUpdate = true;
      f2Ash.count = ashN; f2Ash.visible = ashN > 0; f2Ash.instanceMatrix.needsUpdate = true;
      /* D: the band of red light round his left wrist until the gold burns it off (a white flash), the red mark it leaves */
      if (o.band) { const fl = f2bell(t, Bm.burn - 0.12, Bm.burn, Bm.burn + 0.1, Bm.burn + 0.45);
        f2WristShow(t < Bm.burn ? 1 : 0, t >= Bm.burn ? 1 : 0, 0, fl); }
      /* the bottle on his altar: trembling with the pressure, still the moment the barrier holds */
      f2Bottle(t < Bm.brk ? 0.6 + 0.4 * Math.max(0, Math.sin((t - Bm.b0) * 2 * Math.PI / 8.0 - 0.4)) : 0, t);
    }
    /* THE THREADS AT HIS FEET (endings B and C, before the barrier): the barrier's threads, most of the way along their ways,
       held off the gold's edge (there is no gold yet), searching */
    function f2ThreadsAt(t, te, o) {
      for (const T of F2THREADS) {
        const W = T.Wn, L = W.L, start = L * 0.55, grow = Math.max(0, te - o.t0 - T.t0 * 0.4);
        const head = Math.min(L - 0.04 - 0.05 * Math.sin(te * 1.7 + T.i), start + grow * T.v);
        T.m.visible = head > 0.05;
        if (T.m.visible) { f2TubeLay(T.g, (s2, out) => f2WayAt(W, s2, te, out), 0, head, F2T.r); if (T.sp) T.sp.set('uAlpha', 0.85); }
      }
    }
    /* ENDING D'S THREADS: streaming in from the dark beyond the city's lights, all from one direction, across his balcony and
       in at the open door; one turns the way a head turns and lunges at the wrist of his hand on the frame (where that wrist
       is on this screen, laid out into the world a hand's reach before the lens) */
    const F2D = { n: 6 };
    const f2DT = [];
    for (let i = 0; i < F2D.n; i++) { const g = f2TubeGeo(), m = new THREE.Mesh(g, new THREE.MeshBasicMaterial()); m.name = 'a red thread (ending D)'; m.frustumCulled = false; m.visible = false; hisSideG.add(m);
      f2DT.push({ g, m, sp: ctx.spirit ? ctx.spirit(m, { color: F2RED, fill: 0.6, rim: 1.2, flicker: 0.35, xray: 0.6 }) : null, i }); }
    const _dA = new THREE.Vector3(), _dB = new THREE.Vector3(), _dW = new THREE.Vector3();
    /* the outdoor way of ending D's red threads, at q (0 out in the dark over the city, 1 at the end it is given, d0 metres out
       from his glass on his balcony's floor): from 9 m up 70 m out, down over the city to his balcony's rail and OVER it (the
       rail 1.1 m up, 1.56 m out: b_world.js BALC; the first way passed it 0.14 m up, through its glass, read from its own
       numbers), then down onto the balcony's floor; sampled thickest near his door (the distance out goes as (1 - q) cubed,
       so the few metres he sees are drawn smooth) */
    function f2DOut(q, x0, z0, d0, i, t, out) {
      const d = d0 + (70 - d0) * Math.pow(1 - q, 3), k = (d - d0) / (70 - d0), rail = 1.56;
      const y = d < rail ? 0.01 + 1.21 * f2smo(c01((d - 0.6) / (rail - 0.6))) : 1.22 + 7.78 * Math.pow((d - rail) / (70 - rail), 0.7);
      return out.set(x0 + 22 * k + Math.sin(k * 9 + t * 0.9 + i) * 0.25 * k, y, z0 + d);
    }
    function f2DThreads(t, E) {
      const bl = F2P.balc, door = [bl.x - 0.08, LIV.z1];
      for (const D of f2DT) {
        /* (already there when his sight opens: he follows them; grown in over four seconds from the city, they reached his
           door only as he got there, and his first look down met a bare floor, photographed) */
        const show = F2.vis && t >= E.vis && t < E.wrap + 0.05;
        D.m.visible = show; if (!show) continue;
        const i = D.i, lunge = i === 2, sp = (i - (F2D.n - 1) / 2) * 0.07;
        /* each from far away out in the dark, low over the city, in at the door and over his floor to his feet at the table
           (the one that will turn ends just inside the door, where he will stand) */
        const grow = 1, feet = [F2P.table.x - 0.2 + sp * 2.5, F2P.table.z - 0.1 + Math.abs(sp)];
        const at = (s, out) => {
          const u = s;
          if (lunge) {
            /* the one that turns, its own way the whole time (from the city to the balcony's floor just outside his door, where
               he will look along it): its head lifts off the floor like a head turning, then lunges at the wrist */
            const tu = t >= E.turn ? f2smo(f2win(t, E.turn, E.lunge)) : 0, lu = t >= E.lunge ? f2s5(f2win(t, E.lunge, E.wrap)) : 0;
            const base = f2DOut(u, door[0], door[1], 0.3, i, t, _dA);
            const lift = Math.sin(Math.PI * c01((u - 0.82) / 0.18)) * 0.45 * tu;
            base.y += lift;
            if (lu > 0 && u > 0.7) { camera.updateMatrixWorld(); const W2 = f2WristAt(_dW) || f2WristWorld(_dW);
              if (W2) { const w = f2smo((u - 0.7) / 0.3) * lu; base.lerp(W2, w); } }
            return out.copy(base);
          }
          if (u <= 0.8) return f2DOut(u / 0.8, door[0] + sp, door[1], 0, i, t, out);
          const r = (u - 0.8) / 0.2;
          return out.set(lp(door[0] + sp, feet[0], r) + Math.sin(r * 5 + t * 1.1 + i) * 0.06 * Math.sin(Math.PI * r), lp(0.01, 0.03, r), lp(door[1], feet[1], r));
        };
        f2TubeLay(D.g, at, 0.0, Math.max(0.02, grow), F2T.r * 1.3, 0.02);
        if (D.sp) D.sp.set('uAlpha', 0.9);
      }
    }
    /* where his left wrist is in the world, for a thread to reach it: the wrist bone of the left hand as the hands' lens draws
       it, laid out along the world lens's own ray at 0.42 m */
    const _wv = new THREE.Vector3();
    function f2WristWorld(out) {
      const A = F2.api; if (!A || !A.buildPrayerArm || !A.vmCam) return null;
      const L = A.buildPrayerArm(); if (!L || !L.visible || !L.userData.model) return null;
      const wr = L.userData.model.getObjectByName('handR'); if (!wr) return null;
      wr.updateWorldMatrix(true, false); wr.getWorldPosition(_wv);
      if (A.handsRoot) { A.handsRoot.updateWorldMatrix(true, false); }
      _wv.project(A.vmCam);
      out.set(_wv.x, _wv.y, 0.5).unproject(camera).sub(camera.getWorldPosition(_dB)).normalize().multiplyScalar(0.42).add(_dB);
      return out;
    }
    /* ending B: his phone face down on his table (the play's own copy of it, turned over) */
    const f2TablePhone = new THREE.Group(); f2TablePhone.name = 'his phone face down (ending B)'; f2TablePhone.visible = false; hisSideG.add(f2TablePhone);
    f2TablePhone.position.set(FILMPLACE.phoneAt.x + 0.05, FILMPLACE.phoneAt.y - 0.002, FILMPLACE.phoneAt.z + 0.08); f2TablePhone.rotation.set(0, 0.5, Math.PI);
    const f2TablePhoneDress = () => { if (f2TablePhone.children.length || !(things.hisPhone && things.hisPhone.userData.model)) return;
      const m = things.hisPhone.userData.model.clone(true); m.traverse(q => { if (q.isMesh) q.frustumCulled = false; }); m.position.y = -0.011; f2TablePhone.add(m); };
    /* ending C: the water from his tap (a thin stream, light on it) */
    const f2TapMat = B({ color: 0xc8d8e8, transparent: true, opacity: 0.5, depthWrite: false });
    const f2Tap = new THREE.Mesh(new THREE.CylinderGeometry(0.0045, 0.006, 0.27, 8, 1, true), f2TapMat); owned.push(f2Tap.geometry);
    f2Tap.name = 'the water from his tap (ending C)'; f2Tap.position.set(F2HX + 0.95, 1.2 - 0.135 - 0.01, LIV.z0 + 0.31 - 0.06); f2Tap.visible = false; hisSideG.add(f2Tap);
    /* ending C: the cushion held over his eyes, close before the lens in the hands' own pass (so a wall never cuts it), its
       lower edge leaving a sliver of the room */
    function f2CushionAt(k, t) {
      const A = F2.api; if (!A || !A.handsRoot) return;
      if (k > 0.001 && f2Cushion.parent !== A.handsRoot.parent) { A.handsRoot.parent.add(f2Cushion); }
      f2Cushion.visible = k > 0.001;
      if (!f2Cushion.visible) return;
      /* (it comes up from under the lens and settles over his eyes, slipping down off them as his sight opens) */
      /* (its lower edge 4.5 cm under the lens's middle at 17 cm, the picture's lowest fifth left to the room: at 3.5 cm over it
         the cushion filled the whole picture for nearly four seconds, a blank grey, photographed) */
      f2Cushion.position.set(0.0, -0.32 * (1 - k) + 0.09, -0.17);
      f2Cushion.rotation.set(Math.PI / 2 - 0.25, 0, 0.05 * Math.sin(t * 0.7));
      f2Cushion.scale.setScalar(0.62);
    }
    function worldOven(text) { if (F2.oven !== text) { F2.oven = text; WORLD.ovenClock(text); } }
    /* what is held in his hands in the barrier, and how (his phone, then the spool, then nothing: the lens looks out) */
    function f2BarrierHands(t, Bm) {
      const A = F2.api; if (!A) return;
      /* (his phone before him on the speaker through his teacher's two lines; then down out of the frame as he goes to his
         bag, the call still open: it is on the floor before him once he sits) */
      if (t < Bm.walk0 + 0.6) { f2PhoneIn(1, 1); if (A.armR) A.armR.position.y -= 0.34 * f2smo(f2win(t, Bm.walk0 - 0.2, Bm.walk0 + 0.6)); return; }
      if (t < Bm.bag + 0.3) { f2Hold(null); f2Hands(false); return; }
      /* at the bag: his right hand reaches into it, and comes back with the spool */
      if (t < Bm.spool + 1.2) {
        const into = f2smo(f2win(t, Bm.bag + 0.3, Bm.bag + 0.9)) * (1 - f2smo(f2win(t, Bm.zip + 0.6, Bm.zip + 1.0))) + f2smo(f2win(t, Bm.spool - 0.25, Bm.spool + 0.1)) * (1 - f2smo(f2win(t, Bm.spool + 0.7, Bm.spool + 1.2)));
        f2Hold(t >= Bm.spool - 0.3 ? f2SpoolHand : null, { pos: [0.01, -0.07, -0.15], rot: [0.2, 0.4, 0.2] });
        f2Hands(into > 0.01, 'reach', into); f2MirrorLeft(false); return;
      }
      if (t < Bm.circle - 1e-3) { f2Hands(false); return; }
      /* CLOSE THE CIRCLE: the spool in his right hand while the thread goes round to his right, in his left as it comes round
         from behind him (passed behind his back), each hand reaching low where the thread is laid (the library's reach) */
      if (t < Bm.after) {
        const u = F2.cirDone ? 1 : F2.cirShow, right = u < 0.3, left = u > 0.68 && u < 1;
        if (right || left) {
          const k = right ? f2smo(c01(u / 0.05)) * (1 - f2smo(c01((u - 0.24) / 0.06))) : f2smo(c01((u - 0.68) / 0.06)) * (1 - f2smo(c01((u - 0.96) / 0.04)));
          f2Hold(f2SpoolHand, left ? { hand: 'left', pos: [-0.01, -0.07, -0.15], rot: [0.2, -0.4, -0.2] } : { pos: [0.01, -0.07, -0.15], rot: [0.2, 0.4, 0.2] });
          f2Hands(k > 0.01, 'reach', k * 0.92, { p: 0 });
          if (k > 0.01) f2MirrorLeft(left);
        } else { f2Hold(null); f2Hands(false); f2MirrorLeft(false); }
        return;
      }
      /* D: once his sight has gone, he lifts his left hand: the band still round its wrist; the gold burns it off */
      /* (held up until the barrier is calm and let down after, so the red mark the band leaves is seen for a second and a half
         after the flash: let down before it, the wrist left the picture 0.9 s after the flash, photographed) */
      if (F2.k === 'D' && Bm.wrist0 != null && t >= Bm.wrist0 && t < Bm.calm + 0.7) {
        const up = f2smo(f2win(t, Bm.wrist0, Bm.wrist0 + 0.7)) * (1 - f2smo(f2win(t, Bm.calm, Bm.calm + 0.7)));
        /* (held up in the library's place, turned over, its wrist and the band inside the picture: lifted in the reach and
           turned, the forearm crossed the picture and the wrist, the band and its burning stood off its edge, photographed) */
        f2Hold(null); f2Hands(up > 0.01, 'place', up, { p: 0 });
        if (up > 0.01 && A.armR) { A.armR.position.y += 0.03 * up; A.armR.position.z += 0.02 * up; }
        if (up > 0.01) f2MirrorLeft(true); else f2MirrorLeft(false);
        return;
      }
      f2Hold(null); f2MirrorLeft(false); f2Hands(false);
    }

    /* ================================================================ THE ENDINGS' OWN BEGINNINGS (the plan's 9.8), each a pure
       function of its clock: E its marks (y_endings.js EN2[k]) */
    /* where the decision left him (the engine's snapshot: the first key of every ending is the play's last view) */
    function f2From(s) {
      if (!s || !s.yawPos) return { e: [F2P.table.x, EYE, F2P.table.z], a: [FILMPLACE.phoneAt.x, 0.7, FILMPLACE.phoneAt.z], fp: 72, fd: 72 };
      const yw = s.yawRot, pt = s.pitchX, d = 2.0;
      return { e: [s.yawPos.x, s.yawPos.y, s.yawPos.z], a: [s.yawPos.x - Math.sin(yw) * Math.cos(pt) * d, s.yawPos.y + Math.sin(pt) * d, s.yawPos.z - Math.cos(yw) * Math.cos(pt) * d], fp: 72, fd: 72 };
    }
    function f2EndKeys(k, E, s) {
      const F = f2From(s), K = [], tb = F2P.table, C = F2P.circle;
      K.push({ t: 0, e: F.e, a: F.a, fp: F.fp, fd: F.fd, n: k + ':decision', stop: true });
      const ph = FILMPLACE.phoneAt, sf = F2P.sofa, kn = F2P.kitchen, bl = F2P.balc;
      if (k === 'A') {
        /* A · he lifts his phone and his thumb finds his teacher's name (its screen to him: "Calling…", two rings, the call);
           as it connects he turns to his glass, the phone held before him on the speaker, the city's lights beyond it, the
           pressure on him; "My head... it's like something's crushing it from every side." (60 / 52). The turn goes round
           by his altar's side, an aim at each quarter, so the look never passes through his own eye (a turn of 160 degrees
           eased over 2.4 s) */
        K.push({ t: 1.4, e: [tb.x, EYE - 0.03, tb.z], a: [tb.x - 0.25, 0.55, tb.z - 1.1], fp: 58, fd: 50, n: 'A:phone' });
        K.push({ t: E.connect - 0.1, e: [tb.x, EYE - 0.04, tb.z], a: [tb.x - 0.27, 0.53, tb.z - 1.12], fp: 58, fd: 50, n: 'A:ring', stop: true });
        K.push({ t: E.connect + 0.9, e: [tb.x - 0.02, EYE - 0.04, tb.z + 0.02], a: [tb.x - 2.2, 0.95, tb.z - 0.6], fp: 59, fd: 51, n: 'A:turn' });
        K.push({ t: E.connect + 1.7, e: [tb.x - 0.04, EYE - 0.04, tb.z + 0.06], a: [tb.x - 2.0, 1.0, tb.z + 1.6], fp: 60, fd: 52, n: 'A:turn2' });
        K.push({ t: E.connect + 2.5, e: [tb.x - 0.05, EYE - 0.04, tb.z + 0.1], a: [tb.x - 0.9, 1.05, LIV.z1 + 3.0], fp: 60, fd: 52, n: 'A:glass', stop: true });
        K.push({ t: E.zv51A1 + 0.3, e: [tb.x - 0.05, EYE - 0.06, tb.z + 0.12], a: [tb.x - 0.95, 0.98, LIV.z1 + 3.0], fp: 58, fd: 50, n: 'A:speak' });
        K.push({ t: E.b0, e: [tb.x - 0.06, EYE - 0.07, tb.z + 0.14], a: [tb.x - 1.0, 0.95, LIV.z1 + 3.0], fp: 60, fd: 52, n: 'A:listen', stop: true });
      } else if (k === 'B') {
        /* B · the phone set face down on his table; to his sofa as he says it; sitting, his palms together; two waves, the lens
           narrowing with them; his sight forced open on the threads at his feet; then the oven's clock (3:41); on the floor
           against the sofa, the picture a slit; he crawls to his table and calls from his knees */
        const seat = [sf.x + 0.05, F2EYE.sofa, sf.z + 0.2], fl = [sf.x + 0.1, 0.86, sf.z + 0.78], knee = [F2HX - 0.3, F2EYE.knees, 0.35];
        K.push({ t: E.down, e: [tb.x, EYE - 0.03, tb.z], a: [ph.x, 0.72, ph.z], fp: 60, fd: 52, n: 'B:down' });
        K.push({ t: E.walk, e: [tb.x, EYE - 0.03, tb.z], a: [tb.x - 1.6, 1.15, tb.z - 0.9], fp: 62, fd: 54, n: 'B:turn' });
        /* (to his sofa looking at his altar across the room, its candle, his teacher's photograph: as he says he will not
           wake him; in its last metre to his glass, where he sits facing it) */
        f2WalkKeys([[tb.x, tb.z], [F2HX - 0.5, 0.35], [F2HX - 1.5, 0.05], [seat[0] + 0.05, -0.25]], E.walk + 0.35, E.sit, EYE, { a: [seat[0], 1.05, 2.5], look: () => [HIS.altar.x, 1.12, HIS.altar.z], lookIn: 0.5, fp: 62, fd: 54, n: 'B:tosofa' }).slice(1).forEach(q => K.push(q));
        K.push({ t: E.sit + 1.1, e: seat, a: [seat[0], 1.0, 2.6], fp: 64, fd: 56, n: 'B:sit', stop: true });
        K.push({ t: E.wave1, e: seat, a: [seat[0] + 0.05, 0.98, 2.6], fp: 64, fd: 56, n: 'B:pray', stop: true });
        K.push({ t: E.wave2, e: [seat[0], seat[1] - 0.02, seat[2] + 0.02], a: [seat[0] + 0.1, 0.92, 2.6], fp: 56, fd: 50, n: 'B:wave' });
        K.push({ t: E.forced + 0.2, e: [seat[0], seat[1] - 0.05, seat[2] + 0.06], a: [seat[0] + 0.1, 0.55, 2.4], fp: 50, fd: 46, n: 'B:narrow' });
        K.push({ t: E.forced + 1.6, e: [seat[0], seat[1] - 0.08, seat[2] + 0.1], a: [seat[0] + 0.15, 0.0, seat[2] + 1.15], fp: 52, fd: 46, n: 'B:feet', stop: true });
        K.push({ t: E.cut - 0.01, e: [seat[0], seat[1] - 0.09, seat[2] + 0.11], a: [seat[0] + 0.2, 0.0, seat[2] + 1.2], fp: 52, fd: 46, n: 'B:feet2', stop: true });
        /* the oven's clock: an insert of a thing (v21.30), its digits 3:41 */
        const ov = F2P.oven;
        /* (a little wider, and turned onto the clock's last figure's side: on a phone the 1 of 3:41 touched the picture's edge,
           photographed) */
        K.push({ t: E.cut, e: [ov.x - 0.12, ov.y + 0.1, ov.z + 0.55], a: [ov.x + 0.008, ov.y, ov.z], fp: 29, fd: 22, n: 'B:oven', cut: true });
        K.push({ t: E.floor - 0.01, e: [ov.x - 0.11, ov.y + 0.09, ov.z + 0.5], a: [ov.x + 0.008, ov.y, ov.z], fp: 28, fd: 21, n: 'B:oven2', stop: true });
        K.push({ t: E.floor, e: fl, a: [fl[0] + 2.4, 0.72, fl[2] + 0.1], fp: 52, fd: 46, n: 'B:floor', cut: true });
        K.push({ t: E.crawl, e: [fl[0] + 0.05, fl[1] - 0.04, fl[2]], a: [ph.x, 0.7, ph.z + 0.3], fp: 52, fd: 46, n: 'B:floor2', stop: true });
        K.push({ t: E.crawl + 1.0, e: [fl[0] + 0.5, F2EYE.crawl, fl[2] + 0.2], a: [ph.x, 0.5, ph.z + 0.4], fp: 56, fd: 50, n: 'B:crawl' });
        K.push({ t: E.reach - 0.6, e: [knee[0] - 0.3, F2EYE.crawl + 0.05, knee[2] + 0.05], a: [ph.x, 0.62, ph.z], fp: 56, fd: 50, n: 'B:crawl2' });
        K.push({ t: E.reach + 0.2, e: knee, a: [ph.x, 0.7, ph.z], fp: 56, fd: 50, n: 'B:table', stop: true });
        /* (on his knees at the table with the call open, he turns his back to it and to the kitchen's wall, toward his glass:
           the city's lights over the phone held before him, as his teacher talks) */
        K.push({ t: E.connect, e: [knee[0], knee[1] - 0.02, knee[2]], a: [knee[0] - 0.4, 0.72, knee[2] - 1.5], fp: 58, fd: 52, n: 'B:call' });
        K.push({ t: E.connect + 1.0, e: [knee[0] - 0.02, knee[1] - 0.03, knee[2] + 0.02], a: [knee[0] - 2.1, 0.85, knee[2] + 0.2], fp: 59, fd: 52, n: 'B:turn2' });
        K.push({ t: E.connect + 2.0, e: [knee[0] - 0.03, knee[1] - 0.04, knee[2] + 0.05], a: [knee[0] - 0.7, 0.9, LIV.z1 + 2.8], fp: 60, fd: 52, n: 'B:glass', stop: true });
        K.push({ t: E.b0, e: [knee[0] - 0.03, knee[1] - 0.05, knee[2] + 0.06], a: [knee[0] - 0.75, 0.85, LIV.z1 + 2.8], fp: 60, fd: 52, n: 'B:listen', stop: true });
      } else if (k === 'C') {
        /* C · to the kitchen as he says it: the drawer, the pills, the tap; to his sofa; he lies back with a cushion over his
           eyes; a wave, the glass doors ticking; his sight opens on its own as the cushion slides off: his red footsteps end
           at the sofa, the threads at his feet; he calls */
        const dr = [kn.x, EYE - 0.04, kn.z], tp = [F2P.tap.x - 0.05, EYE - 0.04, kn.z + 0.05], lie = [sf.x - 0.75, 0.66, sf.z + 0.02];
        K.push({ t: E.walk, e: [tb.x, EYE - 0.02, tb.z], a: [tb.x - 0.9, 1.25, tb.z - 1.8], fp: 62, fd: 54, n: 'C:turn' });
        f2WalkKeys([[tb.x, tb.z], [F2HX - 0.45, 0.35], [F2HX - 0.4, -0.95], [kn.x, kn.z]], E.walk + 0.3, E.drawer, EYE, { a: [kn.x, 0.72, LIV.z0 + 0.3], fp: 62, fd: 54, n: 'C:tokitchen' }).slice(1).forEach(q => K.push(q));
        /* (at his counter looking along its top and the wall over it, his hand going down to the drawer under the picture's
           foot and coming up with the strip: looking down at the drawer's front, the picture was the cupboards' black, with a
           fist, photographed) */
        K.push({ t: E.drawer + 0.5, e: dr, a: [kn.x, 0.92, LIV.z0 + 0.4], fp: 60, fd: 52, n: 'C:drawer', stop: true });
        K.push({ t: E.tap - 0.1, e: [dr[0] + 0.05, dr[1], dr[2]], a: [kn.x + 0.1, 0.95, LIV.z0 + 0.3], fp: 60, fd: 52, n: 'C:pills', stop: true });
        K.push({ t: E.tap + 0.9, e: tp, a: [F2P.tap.x, 0.95, F2P.tap.z], fp: 58, fd: 50, n: 'C:tap', stop: true });
        K.push({ t: E.sofa0, e: [tp[0] - 0.05, tp[1], tp[2] + 0.05], a: [F2P.tap.x, 0.93, F2P.tap.z], fp: 58, fd: 50, n: 'C:tap2', stop: true });
        f2WalkKeys([[tp[0], tp[2]], [F2HX - 0.6, -0.65], [F2HX - 1.6, -0.25], [lie[0] + 0.8, -0.3]], E.sofa0 + 0.4, E.lie, EYE, { a: [lie[0] - 0.6, 0.6, sf.z], fp: 62, fd: 54, n: 'C:tosofa' }).slice(1).forEach(q => K.push(q));
        K.push({ t: E.lie + 0.7, e: [lie[0] + 0.35, 1.05, lie[2] + 0.25], a: [lie[0] - 0.3, 1.4, lie[2] + 0.6], fp: 64, fd: 56, n: 'C:sit' });
        /* (his head on the sofa's arm, turned a little toward his glass: under the cushion the picture's lowest fifth is the top of
           his glass doors and the city's night through them; looking straight up, it was his ceiling, as dark as the cushion,
           and the whole picture one grey for four seconds, photographed) */
        K.push({ t: E.cushion, e: lie, a: [lie[0] + 0.1, lie[1] + 2.0, lie[2] + 2.07], fp: 64, fd: 56, n: 'C:lie', stop: true });
        K.push({ t: E.forced, e: lie, a: [lie[0] + 0.12, lie[1] + 1.96, lie[2] + 2.12], fp: 62, fd: 54, n: 'C:lie2', stop: true });
        K.push({ t: E.forced + 1.4, e: [lie[0] + 0.05, lie[1] + 0.14, lie[2]], a: [sf.x + 1.4, 0.25, sf.z + 0.9], fp: 60, fd: 52, n: 'C:feet' });
        K.push({ t: E.phone, e: [lie[0] + 0.06, lie[1] + 0.16, lie[2]], a: [sf.x + 2.6, 0.1, sf.z + 0.6], fp: 60, fd: 52, n: 'C:steps', stop: true });
        /* (he sits up as the call connects, the phone before him, and listens facing his glass, the city's lights over the
           phone, as in A and B: lying, he had the ceiling for ten seconds, a dark grey picture, photographed) */
        const up = [lie[0] + 0.35, F2EYE.sofa - 0.02, lie[2] + 0.14];
        K.push({ t: E.connect + 0.9, e: up, a: [lie[0] + 0.6, 1.0, LIV.z1 + 3.0], fp: 60, fd: 52, n: 'C:up' });
        K.push({ t: E.connect + 1.6, e: [up[0], up[1] - 0.01, up[2] + 0.01], a: [lie[0] + 0.62, 0.98, LIV.z1 + 3.0], fp: 60, fd: 52, n: 'C:call', stop: true });
        K.push({ t: E.b0, e: [up[0], up[1] - 0.03, up[2] + 0.03], a: [lie[0] + 0.66, 0.95, LIV.z1 + 3.0], fp: 60, fd: 52, n: 'C:listen', stop: true });
      } else if (k === 'D') {
        /* D · his sight opened on purpose; he follows the threads to his balcony's door and slides it open; the night's air;
           in the doorway, his left hand on its frame (never past it; the rail never near), he looks along them out over the
           city; one turns like a head and lunges: a band of red light round his wrist, the pressure doubled, the picture
           crushed to a slit and the lens narrowing (64 to 48 / 56 to 42), pulled half a step; he tears himself back inside,
           the door slides shut in the wind; on his knees, he calls */
        const out = [bl.x - 0.1, 1.5, LIV.z1 + 40], knees = [bl.x - 0.1, F2EYE.knees, bl.z - 0.15];
        /* (his sight opened, his eyes go down to his feet: the threads end there, come in over his floor from his glass) */
        K.push({ t: E.vis, e: [tb.x, EYE - 0.02, tb.z], a: [tb.x - 0.25, 0.0, tb.z + 0.15], fp: 64, fd: 56, n: 'D:look' });
        K.push({ t: E.walk, e: [tb.x, EYE - 0.02, tb.z], a: [tb.x - 0.6, 0.35, tb.z + 1.6], fp: 64, fd: 56, n: 'D:turn' });
        /* (a step back from the glass, its sliding leaf's edge and handle before him as he draws it aside: from half a metre,
           looking down through it, the picture was the floor and his hand, the door never in it, photographed) */
        K.push({ t: E.door, e: [bl.x - 0.2, EYE - 0.02, LIV.z1 - 0.95], a: [bl.x + 0.2, 1.0, LIV.z1], fp: 64, fd: 56, n: 'D:door', stop: true });
        K.push({ t: E.slide + 1.2, e: [bl.x - 0.06, EYE - 0.02, LIV.z1 - 0.45], a: [bl.x - 0.1, 0.9, LIV.z1 + 3], fp: 64, fd: 56, n: 'D:open' });
        K.push({ t: E.step + 0.9, e: [bl.x - 0.08, EYE - 0.02, LIV.z1 - 0.12], a: out, fp: 64, fd: 56, n: 'D:doorway' });
        K.push({ t: E.turn, e: [bl.x - 0.08, EYE - 0.03, LIV.z1 - 0.12], a: [out[0] + 1.2, 1.0, out[2]], fp: 64, fd: 56, n: 'D:along', stop: true });
        K.push({ t: E.lunge, e: [bl.x - 0.08, EYE - 0.04, LIV.z1 - 0.12], a: [bl.x + 0.4, 1.1, LIV.z1 + 2.0], fp: 62, fd: 54, n: 'D:turns' });
        K.push({ t: E.wrap + 0.45, e: [bl.x - 0.05, EYE - 0.08, LIV.z1 - 0.04], a: [bl.x + 0.5, 0.95, LIV.z1 + 1.6], fp: 48, fd: 42, n: 'D:pulled' });
        K.push({ t: E.tear - 0.1, e: [bl.x - 0.05, EYE - 0.1, LIV.z1 - 0.05], a: [bl.x + 0.45, 0.9, LIV.z1 + 1.8], fp: 48, fd: 42, n: 'D:held', stop: true });
        K.push({ t: E.slam, e: [bl.x - 0.12, EYE - 0.3, bl.z - 0.25], a: [bl.x - 0.05, 0.6, LIV.z1 + 1.0], fp: 54, fd: 48, n: 'D:back' });
        K.push({ t: E.knees + 0.8, e: knees, a: [bl.x - 0.1, 0.35, LIV.z1 + 0.6], fp: 58, fd: 50, n: 'D:knees', stop: true });
        K.push({ t: E.connect, e: [knees[0], knees[1] - 0.02, knees[2]], a: [bl.x - 0.6, 0.6, bl.z - 1.6], fp: 60, fd: 52, n: 'D:call' });
        K.push({ t: E.b0, e: [knees[0], knees[1] - 0.03, knees[2]], a: [bl.x - 1.0, 0.55, bl.z - 1.8], fp: 60, fd: 52, n: 'D:listen', stop: true });
      }
      return K;
    }
    /* the view each ending hands the barrier (its last key), for the barrier's first */
    function f2EndFrom(K) { const L = K[K.length - 1]; return { e: L.e, a: L.a, fp: L.fp, fd: L.fd }; }

    const END2 = {
      begin(k, api, s, E) {
        F2.api = api; F2.s = s; F2.k = k; F2.E = E; F2.on = true; F2.look = null; F2.cirK = 0; F2.cirShow = 0; F2.cirDone = false; F2.cirWall = 0;
        F2.closeSaid = false; F2.held = null; F2.barKeys = null; F2.chantKeys = null; F2.said = new Set(); f2BottleRest = null;
        F2.p0 = (S && S.info && S.info().story && Number.isFinite(S.info().story.pressure)) ? S.info().story.pressure : 0.55;
        if (!(F2.p0 > 0.2)) F2.p0 = 0.55;
        F2.keys = f2EndKeys(k, E, s); F2.from = f2EndFrom(F2.keys); F2.dawnKeys = f2DawnKeys(E.dawn, k);
        F2.pB = f2EndPress(E.b0 - 1e-3, E, k);
        F2.phoLv = (typeof phoLook === 'object' && phoLook && phoLook.level) ? phoLook.level.value : null;
        f2CircleWound(0); f2CircleLay(0);
        if (!F2M.phone) F2M.phone = f2PhoneGroup();
        f2TablePhoneDress(); f2PhoneFloorDress(); F2.oven = null;
        if (things.hisPhone) things.hisPhone.visible = false;
        f2Look('NIGHT');
        if (api.duck) for (const n of ['u51bdawn', 'u51bbalc']) api.duck(n, 0);
      },
      frame(t) {
        if (!F2.on) return;
        const E = F2.E, k = F2.k, Bm = E.bar, nar = f2Narrow();
        f2Look(t < E.d0 - 0.02 ? 'NIGHT' : 'DAWN');
        f2CircleShade.m.visible = t >= E.d0;
        if (t >= Bm.circle - 1e-3 && t < Bm.after) END2.circleTick();
        /* THE LENS */
        const camAt = (q) => (q < E.b0 ? f2Keys(F2.keys, q) : q < E.d0 ? f2BarrierCam(q, Bm, F2.from) : f2Keys(F2.dawnKeys, q - E.d0));
        let v = camAt(t);
        if (!v) return;
        /* (a probe's lens laid over the film's, to see a moment from beside it: F2TUNE.cam { e, a, f }, null in the game) */
        if (F2TUNE.cam) { const Cm = F2TUNE.cam; v = [Cm.e[0], Cm.e[1], Cm.e[2], Cm.a[0], Cm.a[1], Cm.a[2], Cm.f || 50, 0]; }
        /* (how fast his eye goes over the floor, for the head's bob: the same lens a twentieth of a second either side) */
        let speed = 0;
        if (t < E.d0 && !(t >= Bm.circle - 0.05 && t < Bm.after)) { const a = camAt(Math.max(0, t - 0.05)), b = camAt(t + 0.05); if (a && b) speed = Math.hypot(b[0] - a[0], b[2] - a[2]) / 0.1; camAt(t); }
        /* handheld at night (the plan's 4.4: tight), still in the circle once it is closed, level and still at dawn */
        const night = t < E.d0, amp = night ? (t < Bm.circle ? 0.9 + 0.5 * c01(F2.p0) : t < Bm.brk ? 0.55 : 0.25 * (1 - f2smo(f2win(t, Bm.calm, Bm.end)))) : 0;
        f2Drift(v, t, amp);
        if (speed > 0.05) f2Bob(v, t, speed);
        f2Lens(v[6]); f2Aim([v[0], v[1], v[2]], [v[3], v[4], v[5]], v[7]);
        /* (the levels of the people and the things for THIS frame's lens: a film's frame is its own, v24.22) */
        camera.updateMatrixWorld(true); lodTick(); peopleLevels();
        /* THE PRESSURE, the vision, the beds, the things */
        let p = 0, vr = [0, false];
        if (t < E.b0) { p = f2EndPress(t, E, k); vr = f2EndVision(t, E, k); }
        else if (t < E.d0) { p = f2BarrierPress(t, Bm, F2.pB); vr = f2VisionR(t, Bm.vis0, 2.2, Bm.vis1, 1.6); }
        f2Press(p);
        f2Vision(vr[0], vr[1], t);
        if (t < E.d0) f2Beds(f2NightBeds(t < E.b0 ? p : Math.min(p, t < Bm.chant ? 1 : 0.4), vr[0] > 0.5, t >= Bm.chant ? { m6a: 0, m6b: 0, m6c: 0, tin: 0, brth: t < Bm.brk ? 0.22 : 0.1, night: t >= Bm.brk ? 0.32 : 0.05 } : null));
        else f2Beds({ night: 0, three: 0 });
        /* the screen of his phone: the decision's, the call ringing, the call with its seconds */
        /* (its home screen at the decision's 3:03 until the ending's own time has come: in B the oven's 3:41 after the cut, in C
           and D the minutes he lost before he picks it up; photographed, B's phone said 3:03 forty minutes on) */
        if (t < E.ring) f2Screen('home', 0, (k === 'B' ? t >= E.cut : E.phone != null && t >= E.phone - 0.6) ? E.clock : '3:03');
        else if (t < E.connect) f2Screen('ring', 0, E.clock);
        /* (the call ends with his teacher's last words, as he lies down; dark on the floor at dawn: it read 01:36 of a call
           still going at seven in the morning, photographed) */
        else if (t < E.bar.lie) f2Screen('call', t - E.connect, E.clock);
        else f2Screen('off');
        if (t >= E.b0 && t < E.d0) { f2BarrierFx(t, Bm, { push: k === 'B', near: k === 'B' || k === 'C', band: k === 'D' }); f2BarrierHands(t, Bm); }
        else if (t < E.b0) { f2CircleLay(0); f2EndFx(t, E, k); f2EndHands(t, E, k); }
        else { f2DawnFx(t - E.d0, E.dawn, k); }
        /* (the circle scaled only by the dawn's winding: before it, whole) */
        if (t < E.d0) { f2Circle.m.scale.set(1, 1, 1); f2Circle.m.position.set(0, 0, 0); f2DustAt(0, 0); f2DawnOff(); }
      },
      end() {
        if (!F2.on) return;
        F2.on = false;
        f2Press(0); if (kit && kit.press) kit.press(0, { secs: 0, cine: false });
        if (F2.vis && kit && kit.vision) kit.vision(null); F2.vis = false;
        if (kit && kit.captions) kit.captions(null);
        f2Hold(null); f2MirrorLeft(false);
        if (F2.api && F2.api.handsRoot) { F2.api.handsRoot.visible = true; F2.api.handsRoot.position.set(0, 0, 0); }
        if (F2.api && F2.api.handPose) F2.api.handPose(null, 0);
        f2Beds(null);
        f2BottleRestore();
        f2FloorPhone.visible = false; f2SpoolFloor.visible = false; f2Circle.m.visible = false; f2Gold.visible = false;
        for (const T of F2THREADS) T.m.visible = false; f2Sparks.visible = false; f2Ash.visible = false;
        for (const f of f2Feet) f.m.visible = false;
        f2GoldPool.q.visible = false; f2GoldCeil.q.visible = false; f2Spark.q.visible = false;
        if (F2W.band) f2WristShow(0, 0, 0, 0);
        f2TablePhone.visible = false; f2Tap.visible = false; f2CushionAt(0, 0); for (const D of f2DT) D.m.visible = false;
        if (F2.k === 'D') WORLD.balconyDoor(0);
        if (things.hisPhone) things.hisPhone.visible = true;
        /* the dawn's: his teacher standing and seated put away (the play's own frame stands the seated one again where a
           phase asks), his bag dropped where the films keep it, the breakfast and the spools gone, his door shut as play
           keeps it, the circle whole again, the look's level as it was */
        { const H = FILMSAPI.helpers, PS = FILMSAPI.phoStand, PC = cast.pho, bag = FILMSAPI.props.phoBag;
          H.show(PS, false); H.show(PC, false); if (PC && PC.home) put(PC, PC.home.x, PC.home.z, PC.home.ry, PC.home.y);
          if (bag) { bag.visible = false; H.drop(bag, 0, -50, 0); } }
        F2M.food.visible = false; F2M.spoolPho.visible = false; F2M.spoolTable.visible = false; f2Lift.m.visible = false; F2DUST.pts.visible = false;
        WORLD.hisDoor(0); f2CircleWound(0); f2Circle.m.scale.set(1, 1, 1); f2Circle.m.position.set(0, 0, 0);
        if (F2.phoLv != null) f2PhoLevel(F2.phoLv);
        camera.rotation.z = 0;
      },
      /* CLOSE THE CIRCLE's event (the plan's 9.7: the hands-on kind's circling step, its own picture `circle`, briefed with
         START, never failed): its options, and what it tells the film */
      circleOpts() {
        const Wd = DATA.words;
        return { kind: 'craft', label: Wd.evCircleTitle, brief: TOUCHY ? Wd.evCircleTouch : Wd.evCircleKey, demo: 'circle',
                 steps: [{ g: 'twist', turns: 1, fast: 1e9, word: Wd.evCircleTitle }],
                 at: () => ({ sx: 0.5, sy: 0.56 }),
                 onProgress: (i, k) => { F2.cirK = Math.max(F2.cirK, c01(k)); },
                 onStep: () => { F2.cirK = 1; } };
      },
      circleDone() { F2.cirK = 1; F2.cirDone = true; F2.cirShow = 1; },
      /* the chant's captions on its breaths, the Pali as chanted over its meaning (CHANTS.ph51jina; kit.captions on wall time
         from this call, so they work muted: v21.31) */
      chantOn() {
        const E = F2.E; if (!kit || !kit.captions || !E || !E.jina) return;
        const C = CHANTS.ph51jina || [];
        kit.captions(E.jina.map((v, i) => ({ at: v[0], end: v[1] + 0.35, text: C[i] ? C[i][0] : '', sub: C[i] ? C[i][1] : '' })).filter(q => q.text));
      },
      /* the chant's captions taken down when it ends (they run on the wall from its start: a film sought or held must never
         carry them on into the quiet and the morning, photographed at the dawn's first second) */
      chantOff() { if (kit && kit.captions) kit.captions(null); },
      /* the laid thread follows the event's progress, eased on the wall (a finger's stop and start never jerk the picture),
         and "Close it." is said as it nears its end (once) */
      circleTick() {
        const now = performance.now() / 1000, dt = F2.cirWall ? Math.min(0.1, now - F2.cirWall) : 0; F2.cirWall = now;
        const to = F2.cirDone ? 1 : F2.cirK;
        F2.cirShow += (to - F2.cirShow) * (1 - Math.exp(-dt / 0.18));
        if (Math.abs(to - F2.cirShow) < 0.002) F2.cirShow = to;
        if (!F2.closeSaid && F2.cirK >= 0.78 && !F2.cirDone) { F2.closeSaid = true; if (worldSfx && !(soundOff && soundOff())) worldSfx('ph51x3tel', 1, 1, 0); }
      },
      /* (a probe's) */
      marks: () => F2.E,
      tune: F2TUNE,
      tie: () => { const c = f2TieCam(); return { geo: Object.assign({}, f2TieGeo()), aim: c.aim.slice(), W: c.W.slice(), wrist: F2W.fit }; },
      /* (a probe's reading of his teacher's fingers at the tie: how many joints the curl found on each hand and how far each
         first joint is bent from the hand's own line, degrees) */
      curl: () => { const P = FILMSAPI.phoStand, As = P && P.ready ? armsOf(P) : null, o = { arms: !!As }; if (!As) return o;
        for (const sd of ['L', 'R']) { const a = As[sd]; if (!a) continue; const L = a.f2fing || [], F = L[0];
          o[sd] = { n: L.length, fingers: a.fingers };
          if (F) { const h = a.hand.getWorldQuaternion(new THREE.Quaternion()), f = a.fL.clone().applyQuaternion(h), p0 = F.b.getWorldPosition(new THREE.Vector3()), c = F.b.children.find(x => x.isBone);
            if (c) { const d = c.getWorldPosition(new THREE.Vector3()).sub(p0).normalize(); o[sd].bend = +(Math.acos(Math.max(-1, Math.min(1, d.dot(f)))) * 180 / Math.PI).toFixed(1); } } }
        return o; },
      state: () => ({ on: F2.on, k: F2.k, shot: F2.shot, cirK: F2.cirK, cirShow: F2.cirShow, cirDone: F2.cirDone, look: F2.look, press: F2.press, vis: F2.vis }),
      subjects() {
        const C = F2P.circle, o = { circle: [C.x, 0.0, C.z + C.r, 1], door: [F2P.door.x, 0.05, F2P.door.z, 1], bag: [F2P.bag.x, 0.15, F2P.bag.z, 1],
                   glass: [C.x, 1.0, LIV.z1, 1], altarBottle: [HIS.altar.x + 0.14, 1.05, HIS.altar.z - 0.08, 1] };
        return o;
      }
    };
    /* the pressure of each ending's own beginning, from the play's (F2.p0); waves of it (the plan's 8.3: one every 7 to 9 s) */
    function f2Wave(t, at, len = 1.5) { const u = (t - at) / len; return u < 0 ? 0 : u < 1 ? f2smo(u) : Math.max(0, 1 - (u - 1) / 2.5); }
    function f2EndPress(t, E, k) {
      const p0 = F2.p0;
      if (k === 'A') return Math.min(0.95, p0 + 0.1 * f2Wave(t, 1.2));
      if (k === 'B') {
        if (t < E.cut) return Math.min(0.97, p0 + 0.12 * f2Wave(t, E.wave1) + 0.14 * f2Wave(t, E.wave2) + 0.1 * f2smo(f2win(t, E.forced, E.forced + 1.0)));
        /* forty minutes on: the picture a slit, easing a little as he reaches the phone */
        return 0.95 - 0.1 * f2smo(f2win(t, E.reach, E.connect + 2.0)) + 0.06 * f2Wave(t, E.crawl + 1.2);
      }
      if (k === 'C') return Math.min(0.95, p0 + 0.1 * f2Wave(t, E.drawer - 0.5) + 0.16 * f2Wave(t, E.wave) + 0.08 * f2smo(f2win(t, E.forced, E.forced + 1.0)) - 0.05 * f2smo(f2win(t, E.connect, E.connect + 3)));
      if (k === 'D') {
        const base = p0 + 0.1 * f2smo(f2win(t, E.vis, E.vis + 2.0)) + 0.05 * f2smo(f2win(t, E.door, E.step));
        if (t < E.wrap) return Math.min(0.9, base);
        /* the band round his wrist: the pressure doubled, the picture crushed to a slit; less once he is back inside */
        return Math.min(0.99, 0.99 - 0.12 * f2smo(f2win(t, E.tear, E.knees + 0.6)) - 0.08 * f2smo(f2win(t, E.connect, E.connect + 3)));
      }
      return p0;
    }
    function f2EndVision(t, E, k) {
      if (k === 'B') return t < E.cut ? f2VisionR(t, E.forced, 0.9, E.cut, 0.0) : [0, false];
      if (k === 'C') return f2VisionR(t, E.forced, 1.0, E.phone + 0.3, 1.4);
      if (k === 'D') return t < E.wrap + 0.05 ? f2VisionR(t, E.vis, 2.2, E.wrap, 0.0) : [0, false];
      return [0, false];
    }
    /* the play's footsteps and threads at three o'clock (c_play.js fx, PLAY.md 4) stand as it laid them; these are the
       endings' own: ending C's steps of the night, the threads at his feet in B and C, the threads streaming in from the
       dark at his balcony's door in D */
    function f2EndFx(t, E, k) {
      const visOpen = F2.vis;
      for (const f of f2Feet) f.m.visible = k === 'C' && t >= E.walk && visOpen;
      if (k === 'C') { const lit = f2smo(f2win(t, E.forced, E.forced + 1.6)); f2Feet.forEach((f, i) => { if (f.sp) f.sp.set('uAlpha', lit * c01((lit * f2Feet.length - (f2Feet.length - 1 - i) * 0.5) / 2) * (0.75 + 0.25 * Math.sin(t * 2 + i))); }); }
      /* B and C: the threads at his feet the moment his sight is forced open */
      const near = (k === 'B' && t < E.cut) || k === 'C';
      if (near && visOpen) f2ThreadsAt(t, t, { near: true, t0: k === 'B' ? E.forced - 1.0 : E.forced - 1.0, hold: true });
      else if (k !== 'D') for (const T of F2THREADS) T.m.visible = false;
      /* B: the phone face down on his table from when he lays it there until he takes it again */
      /* (taken from the table as his hand closes on it: one phone, never two) */
      f2TablePhone.visible = k === 'B' && t >= E.flat && t < E.reach + 0.22;
      if (k === 'B') worldOven(t >= E.cut ? '3:41' : '3:03');
      /* C: the tap's water */
      f2Tap.visible = k === 'C' && t >= E.tap + 0.25 && t < E.sofa0 + 0.2;
      if (f2Tap.visible) { f2Tap.scale.y = 1 + 0.03 * Math.sin(t * 40); f2TapMat.opacity = 0.5 + 0.1 * Math.sin(t * 23); }
      /* D: his balcony's door, the threads streaming in from the dark, the one that turns and lunges, the band */
      if (k === 'D') {
        WORLD.balconyDoor(f2smo(f2win(t, E.slide, E.slide + 1.2)) * (1 - f2smo(f2win(t, E.slam - 0.25, E.slam + 0.2))));
        f2DThreads(t, E);
        f2WristShow(t >= E.wrap ? 1 : 0, 0, 0, 0);
      }
    }
    /* his phone in his right hand: kit.hold once (the play's numbers), the arm raised toward the frame's foot by k
       (F2TUNE.phone.arm), the screen turned to him by k, lowered before him by `low` (on the speaker) */
    function f2PhoneIn(k, low = 0) {
      f2Hold(F2M.phone, { pos: F2HELD().pos, rot: F2HELD().rot });
      const A = F2.api, C = F2CALL(), kk = c01(k);
      /* (his hand closed round it in the library's grip as it comes up: C.pose at C.k) */
      f2Hands(true, C.pose && kk > 0.01 ? C.pose : null, (C.k || 0) * kk); f2MirrorLeft(false);
      if (A && A.armR) { A.armR.position.x += C.arm[0] * kk; A.armR.position.y += C.arm[1] * kk - 0.07 * c01(low); A.armR.position.z += C.arm[2] * kk; }
      const g = F2M.phone; if (g && C.pos) { const H = F2HELD().pos; g.position.set(lp(H[0], C.pos[0], kk), lp(H[1], C.pos[1], kk), lp(H[2], C.pos[2], kk)); }
      f2PhoneFace(kk * (C.face || 0));
    }
    function f2EndHands(t, E, k) {
      const A = F2.api;
      if (k === 'A') {
        /* the phone lifted from the play's hold into his sight, its screen to him, as his thumb finds the name; lowered a
           little before him on the speaker as he turns to his glass */
        f2PhoneIn(f2smo(f2win(t, 0.1, 1.3)), f2smo(f2win(t, E.connect + 0.4, E.connect + 2.4)));
        return;
      }
      if (k === 'B') {
        if (t < E.flat) { f2Hold(F2M.phone, { pos: F2HELD().pos, rot: F2HELD().rot }); const d = f2smo(f2win(t, E.down, E.flat));
          f2Hands(true, d > 0.01 ? 'place' : null, d); return; }
        if (t < E.flat + 0.6) { f2Hold(null); f2Hands(true, 'place', 1 - f2smo(f2win(t, E.flat, E.flat + 0.6))); return; }
        /* (his palms together at the height that keeps the thumbs out of the picture: the engine's own default, chapter 1's
           -0.235, shows them, as e3c2 found at v16.5 and v18.4; -0.33 is that chapter's, photographed with his thumbs at the
           middle of a phone's picture at -0.235) */
        if (t >= E.pray - 0.2 && t < E.cut) { f2Hold(null); f2Hands(true, 'pray', f2smo(f2win(t, E.pray - 0.2, E.pray + 0.8)) * (1 - 0.15 * f2smo(f2win(t, E.forced, E.forced + 1))), { y: -0.33 }); return; }
        if (t >= E.reach - 0.3 && t < E.reach + 0.6) { f2Hold(t >= E.reach + 0.25 ? F2M.phone : null, { pos: F2HELD().pos, rot: F2HELD().rot }); f2Hands(true, 'reach', f2bell(t, E.reach - 0.3, E.reach + 0.1, E.reach + 0.2, E.reach + 0.6));
          if (t >= E.reach + 0.25) f2PhoneFace(1); return; }
        if (t >= E.reach + 0.6) { f2PhoneIn(f2smo(f2win(t, E.reach + 0.6, E.ring + 0.2)), f2smo(f2win(t, E.connect + 0.5, E.connect + 2.0))); return; }
        f2Hold(null); f2Hands(false); return;
      }
      if (k === 'C') {
        if (t < E.walk + 0.5) { f2Hold(F2M.phone, { pos: F2HELD().pos, rot: F2HELD().rot }); f2Hands(true, null, 0); if (A && A.armR) A.armR.position.y -= 0.12 * f2smo(f2win(t, E.walk, E.walk + 0.5)); return; }
        if (t >= E.drawer - 0.2 && t < E.sofa0 + 0.3) {
          /* the drawer (his hand down to it, out of the picture's foot), the strip of pills brought up before him where he can
             see it (the library's place: its hand a third of the way down the picture; in the reach the strip rode the
             picture's foot, never seen, photographed), one to his mouth, his hand under the tap; one pose at a time, each
             let back to rest before the next (two poses' shares never meet) */
          const r = f2bell(t, E.drawer - 0.2, E.drawer + 0.3, E.pills - 0.45, E.pills - 0.2), pl = f2bell(t, E.pills - 0.2, E.pills + 0.15, E.pills + 0.55, E.pills + 0.8);
          const m = f2bell(t, E.pills + 0.8, E.pills + 1.05, E.tap - 0.2, E.tap + 0.1);
          const tp = f2bell(t, E.tap + 0.1, E.tap + 0.5, E.sofa0 - 0.5, E.sofa0 - 0.1), m2 = f2bell(t, E.sofa0 - 0.4, E.sofa0 - 0.1, E.sofa0, E.sofa0 + 0.3);
          const pg = t >= E.pills - 0.2 && t < E.tap - 0.15 ? f2PillsGeo() : null;
          f2Hold(t >= E.pills - 0.2 && t < E.tap - 0.15 ? f2Pills : null, pg ? { pos: pg.pos, rot: pg.rot } : { pos: [0.0, -0.06, -0.14], rot: [0.0, 0.3, 1.4] });
          if (m > 0.01) f2Hands(true, 'mouth', m); else if (m2 > 0.01) f2Hands(true, 'mouth', m2); else if (tp > 0.01) f2Hands(true, 'reach', tp);
          else if (pl > 0.01) f2Hands(true, 'place', pl); else f2Hands(r > 0.01, 'reach', r);
          return;
        }
        if (t >= E.cushion - 0.6 && t < E.forced + 0.9) {
          /* the cushion over his eyes, its lower edge a sliver of the room; it slides off as his sight opens */
          f2Hold(null); f2Hands(false);
          const on = f2smo(f2win(t, E.cushion - 0.6, E.cushion)) * (1 - f2smo(f2win(t, E.forced + 0.1, E.forced + 0.9)));
          f2CushionAt(on, t);
          return;
        }
        f2CushionAt(0, t);
        if (t >= E.phone) { f2PhoneIn(f2smo(f2win(t, E.phone, E.phone + 0.8)), f2smo(f2win(t, E.connect + 0.5, E.connect + 2.0))); return; }
        f2Hold(null); f2Hands(false); return;
      }
      if (k === 'D') {
        if (t < E.walk + 0.3) { f2Hold(F2M.phone, { pos: F2HELD().pos, rot: F2HELD().rot }); f2Hands(true, null, 0); if (A && A.armR) A.armR.position.y -= 0.12 * f2smo(f2win(t, E.walk - 0.2, E.walk + 0.3)); return; }
        /* his left hand: on the door's handle as he slides it, then on its frame; the band round its wrist */
        if (t >= E.slide - 0.3 && t < E.tear + 0.2) {
          const k2 = f2smo(f2win(t, E.slide - 0.3, E.slide + 0.1)) * (1 - f2smo(f2win(t, E.tear - 0.1, E.tear + 0.2)));
          /* (held up in the library's place, turned over, as at the dawn's tie: its wrist inside the picture, where the band of
             red light goes; in the reach the wrist stood at the picture's foot and the band was never seen, photographed) */
          f2Hold(null); f2Hands(k2 > 0.01, 'place', k2, { p: 0 });
          if (k2 > 0.01 && A && A.armR) {
            /* (on the frame at his left: nearer the frame's edge on screen; drawn out away from him as the band pulls, and in
               toward the picture's middle, where the band is seen: drawn out to the left too, its wrist and the band stood
               at a phone's left edge, half cut off, photographed) */
            const onFrame = f2smo(f2win(t, E.step, E.step + 0.8)), pull = f2bell(t, E.wrap, E.wrap + 0.2, E.tear - 0.4, E.tear);
            A.armR.position.x += 0.02 * onFrame - 0.035 * pull; A.armR.position.y += 0.02 * onFrame - 0.01 * pull; A.armR.position.z -= 0.04 * pull;
          }
          if (k2 > 0.01) f2MirrorLeft(true);
          return;
        }
        f2MirrorLeft(false);
        if (t >= E.phone) { f2PhoneIn(f2smo(f2win(t, E.phone, E.phone + 0.8)), f2smo(f2win(t, E.connect + 0.5, E.connect + 2.0))); return; }
        f2Hold(null); f2Hands(false); return;
      }
    }
    /* ================================================================ THE DAWN (the plan's 9.9; its marks are y_endings.js
       dawn2's, D, from d0 on the ending's clock; here `u` is seconds from d0). 7:10 AM in his flat, the low sun in through
       his glass. Five shots, all his eyes (v24.56), each change of where his teacher is made on a CUT (v24.12: the
       standing body and the seated one are never both drawn: FILMSAPI.phoStand standing and at the table, the seated
       cast.pho on the floor):
         WAKE   on his back inside the circle where he lay down; the ceiling in the warm light; his head to the glass; he
                sits up, the thread still round him on the floor in the sun; the knock, and his head turns to it
         DOOR   (a cut: he has crossed to his door) the door drawn open on Grandmaster Pho in white in the corridor, his
                cloth bag on his shoulder, the breakfast in his hand: "Eat first. You fought all night, even sitting
                still."; he comes in past him
         WIND   (a cut) his teacher sitting on the floor at the circle's edge, cross-legged as he always sits, winding the
                white thread back onto its spool: the loop drawn in across the floor to his hands
         TABLE  (a cut) the dining table, his teacher across it, the kopi and the toast between them, the spool by his
                hand; "I only held the water.", his teacher's answer and the ending's own line; a slow push on him
         TIE    his own left wrist held out across the table, his teacher's hands tying the white thread round it and
                knotting it twice (the narrow lens of an insert: v6.12, his eyes looking down), then his eyes up to his
                teacher's face for the last words; his thought; the picture and the music go down together (v15.3).
       (The plan's "kneels" to wind the thread: Grandmaster Pho has no kneel in his file, and on the floor he always sits
       cross-legged (chapters 3 to 5, and here at her table): so he sits to it. ENDINGS.md says so.) */
    const F2DW = (() => {
      const C = F2P.circle, dn = HIS.dining, TOP = 0.693;
      return {
        C, TOP,
        /* inside his door, in the middle of its opening (his teacher framed in it: from the side its jamb hid half of him,
           photographed), clear of its leaf's swing (0.8 m round its hinge at the door's -x side: 0.9 m off); and where he steps
           back and aside to let him in, behind the middle of his sofa: 1.7 m off his teacher's way in, so he is seen whole as
           he comes through the door (0.65 m off, and then 1.2, he passed the lens close enough to fill the picture and cut
           off his head: photographed both times) */
        doorEye: [HIS.door.x + 0.05, EYE, LIV.z0 + 0.78],
        asideEye: [HIS.door.x + 1.7, EYE, LIV.z0 + 0.55],
        phoDoor: { x: HIS.door.x + 0.05, z: LIV.z0 - 0.74 },
        /* (in past him on the door's side, between his altar and his sofa's end toward the circle: his student stands 0.5 m
           to his right) */
        phoIn: [[HIS.door.x + 0.05, LIV.z0 - 0.74], [HIS.door.x + 0.02, LIV.z0 + 0.3], [HIS.door.x + 0.1, LIV.z0 + 1.3], [HIS.door.x + 0.15, LIV.z0 + 2.2]],
        /* on the floor at the circle's front, where its two ends met, facing in across it */
        /* (0.46 m behind the point where the thread leaves the floor: at 0.34 that point lay under his crossed knees and the
           thread came up out of his lap, photographed) */
        wind: { x: C.x + 0.03, z: C.z + C.r + 0.46, ry: Math.PI },
        windEye: [C.x - 0.28, EYE - 0.03, C.z - 0.62],
        pick: [C.x, F2C.y, C.z + C.r],
        /* his chair (WORLD's dawn seat: FILMPLACE.dawnSeat), his teacher's across the table */
        tableEye: [HIS.chair1.x, 1.17, HIS.chair1.z + 0.06],
        phoChair: { x: HIS.chair2.x, z: HIS.chair2.z, ry: 0 },
        /* (WORLD's chairs face the table: w51dinchair's back stands at its -z, measured 0.245 m behind its middle, its seat's top
           0.50 m, its seat from 0.23 m behind its middle to 0.30 m before it; so `chair2` at ry 0 faces him. His teacher's hips
           are set there whatever his take (f2SeatHips): over the seat's back half, 0.08 m before its back (0.15 m put his knees
           at the table's far edge, 0.727 m, and his robe through its top: read and photographed), the hip joint 0.14 m over the
           seat in his rest and 0.19 m in his talk, as each take stands its own feet on the floor (read: the talk's sat 4.9 cm
           into the floor at 0.64), eased by how far the talk is on) */
        phoHips: [HIS.chair2.x, 0.64, HIS.chair2.z - 0.105],
        /* (the breakfast at the table's end on his teacher's right, clear of the middle where the wrist is held out to be tied
           (at the middle it stood between the lens and the tie, photographed) and of his teacher's right hand as he talks (0.4
           m in, it went through the bag: clipscan, 291 crossings); the spool set down on the other side) */
        food: [dn.x - 0.60, TOP + 0.003, dn.z - 0.05, 0.5],
        spoolT: [dn.x + 0.22, TOP + 0.002, dn.z - 0.25]
      };
    })();
    /* the dawn's own things: the breakfast set (w51breakfast: the paper bag, two cups of kopi, the wrapped toast), the spool
       in his teacher's hand as he winds (a clone of w51threadreel) and set on the table after, the short length of thread
       from the floor up to it */
    F2M.food = stand('w51breakfast', F2DW.food[0], F2DW.food[1], F2DW.food[2], F2DW.food[3], { parent: hisSideG }); F2M.food.visible = false;
    F2M.spoolPho = stand('w51threadreel', 0, -50, 0, 0, { parent: world, s: 0.62 }); F2M.spoolPho.visible = false;
    F2M.spoolTable = stand('w51threadreel', F2DW.spoolT[0], F2DW.spoolT[1], F2DW.spoolT[2], 0.6, { parent: hisSideG, s: 0.62 }); F2M.spoolTable.visible = false;
    const f2Lift = (() => { const g = f2TubeGeo(), m = new THREE.Mesh(g, M({ color: 0xf2f0e8, roughness: 0.85, emissive: 0x34342e })); m.name = 'the thread drawn up to his hands (the dawn)';
      m.frustumCulled = false; m.visible = false; hisSideG.add(m); return { g, m }; })();
    const _dwA = new THREE.Vector3();
    function f2PhoLevel(v) { if (typeof phoLook === 'object' && phoLook && phoLook.level) phoLook.level.value = v; }
    /* THE DAWN'S LENS, a shot of keys a dawn (u from d0) */
    function f2DawnKeys(D, k) {
      const C = F2DW.C, lieE = [C.x, F2EYE.lie, C.z - 0.5], sitE = [F2SIT.x, F2SIT.y, F2SIT.z], dE = F2DW.doorEye, wE = F2DW.windEye, tE = F2DW.tableEye;
      const u = (q) => q - D.d0, phoFace = [F2DW.phoDoor.x, 1.58, F2DW.phoDoor.z], wFace = [F2DW.wind.x, 0.86, F2DW.wind.z - 0.05];
      const across = [F2DW.phoChair.x, 1.12, F2DW.phoChair.z - 0.05];
      /* (where his teacher's head is as he walks in: the film's own place for him (his group), never his living head: v25.5) */
      const phoAt = (h) => () => { const P = FILMSAPI.phoStand; if (P && P.ready && P.group.visible) { const g = P.group.position; return [g.x, g.y + h, g.z]; } return [F2DW.phoIn[1][0], h, F2DW.phoIn[1][1]]; };
      const K = [
        /* WAKE: on his back where he lay down in the circle, his eyes down along himself to his glass: the white thread on
           the floor round him in the low sun, the city outside washed clean; he sits up, the thread round him; the knock, and
           his head turns to it over his shoulder */
        { t: 0, e: lieE, a: [C.x + 0.03, 0.42, C.z + 2.4], fp: 64, fd: 56, n: 'dawn:wake', stop: true },
        { t: u(D.sit) - 0.05, e: [lieE[0], lieE[1] + 0.02, lieE[2] + 0.02], a: [C.x + 0.04, 0.38, C.z + 2.3], fp: 64, fd: 56, n: 'dawn:wake2', stop: true },
        /* (low enough that the thread round him is in the lower third and his glass above it: at 18 degrees down, and again at
           21, the thread lay along the picture's foot, photographed; 32 degrees down now) */
        { t: u(D.sit) + 1.3, e: sitE, a: [C.x + 0.05, 0.05, C.z + 1.25], fp: 66, fd: 58, n: 'dawn:sat', stop: true },
        { t: u(D.knock) + 0.25, e: sitE, a: [C.x + 0.05, 0.1, C.z + 1.3], fp: 66, fd: 58, n: 'dawn:sat2', stop: true },
        /* (over his left shoulder toward his front door, as far round as a head turns: the door is behind him at 155 degrees;
           aimed 66 degrees round, his look went to his glass's corner, photographed) */
        { t: u(D.door) - 0.05, e: [sitE[0], sitE[1] + 0.02, sitE[2]], a: [C.x - 2.0, 1.0, C.z - 0.9], fp: 66, fd: 58, n: 'dawn:toknock', stop: true },
        /* DOOR (a cut): the door drawn open on his teacher, framed in its middle */
        { t: u(D.door), e: dE, a: [F2DW.phoDoor.x, 1.36, F2DW.phoDoor.z + 0.2], fp: 58, fd: 50, n: 'dawn:door', cut: true },
        { t: u(D.door) + 1.1, e: dE, a: [phoFace[0], 1.4, phoFace[2]], fp: 56, fd: 48, n: 'dawn:pho', stop: true },
        { t: u(D.inside) - 0.35, e: [dE[0], dE[1], dE[2] - 0.04], a: [phoFace[0], 1.38, phoFace[2] + 0.05], fp: 54, fd: 46, n: 'dawn:pho2', stop: true },
        /* he comes in past him: his look goes with him (the place the film walks him), into the room */
        { t: u(D.inside) + 1.1, e: F2DW.asideEye, a: phoAt(1.15), fp: 62, fd: 54, n: 'dawn:in' },
        { t: u(D.wind) - 0.05, e: F2DW.asideEye, a: phoAt(1.1), fp: 62, fd: 54, n: 'dawn:in2', stop: true },
        /* WIND (a cut): his teacher on the floor at the circle's edge, the loop drawn in to his hands; the sun behind him */
        { t: u(D.wind), e: wE, a: [wFace[0], 0.62, wFace[2] - 0.15], fp: 58, fd: 50, n: 'dawn:wind', cut: true },
        { t: u(D.table) - 0.05, e: [wE[0] + 0.03, wE[1] - 0.04, wE[2] + 0.12], a: [wFace[0], 0.6, wFace[2] - 0.2], fp: 54, fd: 46, n: 'dawn:wind2', stop: true },
        /* TABLE (a cut): across the table, a slow push on him over the talk (0.3 m) */
        { t: u(D.table), e: tE, a: across, fp: 50, fd: 42, n: 'dawn:table', cut: true },
        { t: u(D.tie) - 0.05, e: [tE[0], tE[1] - 0.06, tE[2] - 0.3], a: [across[0], across[1] - 0.02, across[2]], fp: 48, fd: 40, n: 'dawn:table2', stop: true },
        /* TIE (a cut, an insert from his eyes): his wrist held out across the table, his teacher's hands; then his eyes up */
        /* (turned so his held wrist, which the hands' pass draws low on the left, stands where his teacher's hands reach it:
           f2TieCam; held still through the two knots) */
        { t: u(D.tie), e: F2DW.tieEye, a: () => f2TieCam().aim, fp: F2DW.tieFov[0], fd: F2DW.tieFov[1], n: 'dawn:tie', cut: true },
        { t: u(D.up) - 0.05, e: F2DW.tieEye, a: () => f2TieCam().aim, fp: F2DW.tieFov[0], fd: F2DW.tieFov[1], n: 'dawn:tie2', stop: true },
        /* (a cut up to his teacher's face: drawn as a move, the insert's 20 degrees opened to 50 in a second and a half as the
           look rose, a zoom no eye makes) */
        { t: u(D.up), e: [tE[0], tE[1] - 0.05, tE[2] - 0.2], a: [across[0], across[1] + 0.02, across[2]], fp: 50, fd: 42, n: 'dawn:face', cut: true },
        { t: u(D.black) + 1.6, e: [tE[0], tE[1] - 0.05, tE[2] - 0.24], a: [across[0], across[1] + 0.02, across[2]], fp: 48, fd: 40, n: 'dawn:face2', stop: true }
      ];
      return K;
    }
    /* THE TIE'S INSERT (ENDINGS.md 3). His own hand is drawn in the hands' pass: a lens of its own (52 degrees) and a place
       fixed on the screen (the library's place, turned over for the left: a third of the way down, on the left). On the
       world's lens f the same picture is a
       hand whose depth along the lens is zv / s, s = tan(f/2) / tan(vm/2), at the same sideways and upward metres (xv, yv)
       as in the hands' camera: so on a narrow lens (an insert's, v6.12) his hand is as big as a hand twice as far off, and
       his wrist IS at E + R (xv, yv, -zv / s), R the lens's turn. The insert's lens is TURNED (no roll) so that point lies
       where his teacher can reach across the table, the direction from his eye given by `tieWant` (over the table's middle,
       a hand's breadth and more over its top, in front of his teacher's chest); his teacher's hands go to it (f2TieW). The
       lens's angle stays the insert's own, so how far off the wrist stands is the hand's own depth's (read: ENDINGS.md 6) */
    /* (20 degrees on both screens: at 22 the wrist the lens's depth sets lay 0.88 m from his eye, 0.55 and 0.60 m from his
       teacher's shoulders, past an arm of about 0.50 m: his hands stopped 10 cm short of it, over the back of the held hand,
       run 8's reading and photographs; at 21 on a desk it lay 4 cm nearer him than on a phone, 0.49 m from the left shoulder) */
    F2DW.tieFov = [20, 20];
    /* (his left hand held out in the library's `place`, turned over: its hand stands a third of the way down the picture, so
       its wrist, where the thread goes, is inside it; the reach's hand stood two thirds down, its wrist at the picture's
       foot and the back of the hand filling the bottom of a phone's picture, photographed) */
    F2DW.tiePose = 'place';
    /* (his eye for it leaning in over the table's near edge, as a man holding his wrist out across a table leans: 0.28 m on and
       0.09 m down from where he sits, 9 cm behind the edge; and the wrist held lower, 15 cm over the table's top, past its
       middle toward his teacher, so it lies 0.41 and 0.45 m from his teacher's shoulders with his hands at its two sides,
       his arms bent at the elbow) */
    F2DW.tieEye = [F2DW.tableEye[0], F2DW.tableEye[1] - 0.09, F2DW.tableEye[2] - 0.28];
    F2DW.tieWant = [HIS.chair1.x - 0.02, F2DW.TOP + 0.15, HIS.dining.z - 0.37];
    const F2TIE = { geo: null }, _wa = new THREE.Vector3();
    /* his held left wrist in the hands' camera at the reach the tie holds it at (metres; the place the hands' pass draws it,
       measured once for this screen's shape: the pose is laid, read and left for the frame to lay its own) */
    function f2TieGeo() {
      const A = F2.api, asp = A && A.vmCam ? A.vmCam.aspect : camera.aspect;
      if (F2TIE.geo && Math.abs(F2TIE.geo.asp - asp) < 1e-4) return F2TIE.geo;
      let g = null;
      if (A && A.buildPrayerArm && A.vmCam && A.handPose && A.armR) {
        f2Hands(true, F2DW.tiePose, 1, { p: 0 });
        const T = F2TUNE.tieArm; if (T) { A.armR.position.x += T[0]; A.armR.position.y += T[1]; A.armR.position.z += T[2]; }
        f2MirrorLeft(true);
        const L = A.buildPrayerArm(), wr = L && L.userData.model ? L.userData.model.getObjectByName('handR') : null;
        if (wr) { L.updateWorldMatrix(true, true); wr.getWorldPosition(_wa); A.vmCam.updateMatrixWorld(); _wa.applyMatrix4(A.vmCam.matrixWorldInverse);
          if (-_wa.z > 0.05) g = { asp, xv: _wa.x, yv: _wa.y, zv: -_wa.z, vm: A.vmCam.fov, measured: true }; }
      }
      /* (before the hands have landed: the pose's own numbers, HPOSE.place turned over) */
      if (!g) { const zv = 0.348, h = zv * Math.tan(26 * Math.PI / 180); g = { asp, xv: -0.296 * h * asp, yv: -0.319 * h, zv, vm: 52, measured: false }; }
      if (g.measured) F2TIE.geo = g;
      return g;
    }
    /* the insert's turn: pitch phi and yaw psi taking (xv, yv, -zv/s) onto the wanted direction at its own length */
    const _tc = { aim: [0, 0, 0], W: [0, 0, 0] };
    function f2TieCam() {
      const g = f2TieGeo(), E = F2DW.tieEye, f = f2Narrow() ? F2DW.tieFov[0] : F2DW.tieFov[1];
      const s = Math.tan(f * Math.PI / 360) / Math.tan(g.vm * Math.PI / 360), vz = g.zv / s, D = Math.hypot(g.xv, g.yv, vz);
      const want = F2DW.tieWant, dx = want[0] - E[0], dy = want[1] - E[1], dz = want[2] - E[2], L = Math.hypot(dx, dy, dz) || 1;
      const w = [dx / L * D, dy / L * D, dz / L * D];
      const rho = Math.hypot(g.yv, vz), del = Math.atan2(vz, g.yv), phi = del - Math.acos(Math.max(-1, Math.min(1, w[1] / rho)));
      const z1 = g.yv * Math.sin(phi) - vz * Math.cos(phi), psi = Math.atan2(w[0], w[2]) - Math.atan2(g.xv, z1);
      _tc.aim[0] = E[0] - Math.cos(phi) * Math.sin(psi); _tc.aim[1] = E[1] + Math.sin(phi); _tc.aim[2] = E[2] - Math.cos(phi) * Math.cos(psi);
      _tc.W[0] = E[0] + w[0]; _tc.W[1] = E[1] + w[1]; _tc.W[2] = E[2] + w[2];
      return _tc;
    }
    /* where his held wrist is for his teacher's hands (the insert's, whatever lens the frame has: before the cut his teacher
       is already reaching to where it will be) */
    const f2TieW = () => f2TieCam().W.slice();
    /* WHERE HIS HELD LEFT WRIST IS IN THE WORLD under THIS frame's lens (ending D's band reaches it): the wrist bone as the
       hands' pass draws it, at its sideways and upward metres in the hands' camera and at the depth zv / s along this lens */
    function f2WristAt(out) {
      const A = F2.api; if (!A || !A.buildPrayerArm || !A.vmCam) return null;
      const L = A.buildPrayerArm(); if (!L || !L.visible || !L.userData.model) return null;
      const wr = L.userData.model.getObjectByName('handR'); if (!wr) return null;
      wr.updateWorldMatrix(true, false); wr.getWorldPosition(_wa);
      A.vmCam.updateMatrixWorld(); _wa.applyMatrix4(A.vmCam.matrixWorldInverse);
      const zv = Math.max(0.05, -_wa.z), s = Math.tan(camera.fov * Math.PI / 360) / Math.tan(A.vmCam.fov * Math.PI / 360);
      camera.updateMatrixWorld();
      return out.set(_wa.x, _wa.y, -zv / s).applyMatrix4(camera.matrixWorld);
    }

    /* the people of the dawn (his teacher standing, sitting on the floor, at the table) and their things, at u */
    function f2DawnPeople(u, D, k) {
      const PS = FILMSAPI.phoStand, PC = cast.pho, H = FILMSAPI.helpers, bag = FILMSAPI.props.phoBag;
      const uDoor = D.door - D.d0, uIn = D.inside - D.d0, uWind = D.wind - D.d0, uTable = D.table - D.d0, uTie = D.tie - D.d0;
      const rest = H.phoRest(u);
      /* (nobody before the door opens: he is alone until the knock) */
      const standing = u >= uDoor && u < uWind, winding = u >= uWind && u < uTable, atTable = u >= uTable;
      H.show(PS, standing || atTable); H.show(PC, winding); F2.pcShown = winding;
      if (bag) bag.visible = false;
      if (standing && PS.ready) {
        /* (2 cm up: at 3 cm up his lowest skin stood 1.1 cm over the floor, run 9's reading, so at 0 it was 1.9 cm under it;
           feetscan's 3.2 cm under stood the same with him lifted 3 cm or not, so it does not read him against this floor) */
        if (u < uIn) { put(PS, F2DW.phoDoor.x, F2DW.phoDoor.z, 0, 0.02);
          H.speak(PS, u, rest, [[D.ph51w1 - D.d0, SECS.ph51w1, 'Talk_with_Hands_Open', 0.35]]);
          H.gaze(PS, u, [[uDoor + 0.3, 'lens', 0.6]], 0.8, 0.7, 0.02); }
        else { H.walk(PS, u, uIn, F2DW.phoIn, 0.85, rest, 0.9, { y: 0.02, ry0: 0 });
          H.gaze(PS, u, [[uIn, 'lens', 0.4], [uIn + 0.9, [F2DW.C.x, 0.3, F2DW.C.z + 0.3], 0.8]], 0.7, 0.6, 0.02); }
        f2PhoBag(PS);
      }
      if (!winding) F2M.spoolPho.visible = false;
      if (winding && PC.ready) f2Wind(u, uWind, uTable, PC);
      if (atTable && PS.ready) f2AtTable(u, uTable, uTie, D, k, PS);
      /* the thread and the spool: round him on the floor until his teacher winds it in; on the table after */
      const w = winding ? f2s5(f2win(u, uWind - 1.6, uTable + 0.4)) : (atTable ? 1 : 0);
      f2CircleWound(w); f2CircleLay(w < 0.999 ? 1 : 0);
      f2SpoolFloor.visible = u < uWind; F2M.spoolTable.visible = atTable; F2M.food.visible = atTable;
      f2Lift.m.visible = winding && w < 0.995;
    }
    /* the loop drawn in to his hands: the circle scaled about the point where it leaves the floor, so what is left of it
       lies where it lay, slides in toward him and is gone (a pure function of how much is wound, w 0..1) */
    function f2CircleWound(w) {
      const m = f2Circle.m, P = F2DW.pick, s = Math.max(0.0001, 1 - w);
      m.scale.set(s, 1, s); m.position.set(P[0] * (1 - s), 0, P[2] * (1 - s));
    }
    /* (a bone by its name, the rig's prefix with or without its colon: glTF strips it, mixamorigSpine2: v3.8) */
    const f2Bone = (P, nm) => { if (!P || !P.bone) return null; const re = new RegExp('^(mixamorig:?)?' + nm + '$'); for (const n in P.bone) if (re.test(n)) return P.bone[n]; return null; };
    /* HIS FINGERS CLOSED A LITTLE ON THE THREAD: the library's curlFingers asks for RightHandIndex1 or mixamorig:RightHandIndex1,
       and his standing body's bones are named mixamorigRightHandIndex1 (glTF takes the colon out), so it found none and his
       fingers stood straight and spread at the tie (photographed). The same turn about the hand's across line, the bones found
       either way; the turn is laid on what the take wrote this frame, and where the take writes no finger it is laid on the
       fingers as they stood before it, so it never gathers frame on frame (th 0: the fingers given back) */
    const _f2cq = new THREE.Quaternion(), _f2cq2 = new THREE.Quaternion(), _f2cf = new THREE.Vector3(), _f2cn = new THREE.Vector3(), _f2ca = new THREE.Vector3();
    function f2Curl(P, sd, th) {
      const As = P && P.ready ? armsOf(P) : null, a = As && As[sd]; if (!a || !a.hand || !a.fL || !a.nL) return;
      if (!a.f2fing) { a.f2fing = []; const S0 = sd === 'L' ? 'Left' : 'Right';
        for (const f of ['Index', 'Middle', 'Ring', 'Pinky']) for (let i = 1; i <= 3; i++) { const b = f2Bone(P, S0 + 'Hand' + f + i); if (b) a.f2fing.push({ b, i, base: new THREE.Quaternion(), last: null }); } }
      for (const F of a.f2fing) { if (F.last && F.b.quaternion.equals(F.last)) F.b.quaternion.copy(F.base); else F.base.copy(F.b.quaternion); }
      if (th > 0.001) {
        a.hand.getWorldQuaternion(_f2cq); _f2cf.copy(a.fL).applyQuaternion(_f2cq); _f2cn.copy(a.nL).applyQuaternion(_f2cq); _f2ca.crossVectors(_f2cf, _f2cn).normalize();
        for (const F of a.f2fing) { _f2cq.setFromAxisAngle(_f2ca, th * (F.i === 3 ? 0.7 : 1)); F.b.parent.getWorldQuaternion(_f2cq2);
          F.b.quaternion.premultiply(_f2cq2).premultiply(_f2cq).premultiply(_f2cq2.invert()); } }
      for (const F of a.f2fing) (F.last || (F.last = new THREE.Quaternion())).copy(F.b.quaternion);
      return a.f2fing.length;
    }
    /* his cloth bag hung at his right hip by its strap (FILMS-1 hangs it 0.2 m out from his spine, 0.52 m under his chest's
       bone: c_yfilm.js phoBagOn1); here 0.25 m out, 0.08 m behind his hip's line and 0.55 m down, so his right arm hangs and
       swings before it: at FILMS-1's place its strap and side went through his arm and side, clipscan 1,639 crossings at the
       door and 2,234 coming in */
    function f2PhoBag(P) {
      const g = FILMSAPI.props.phoBag; if (!g || !P.ready || !P.group.visible) { if (g) g.visible = false; return; }
      const sh = f2Bone(P, 'Spine2') || f2Bone(P, 'Spine1') || P.hips; if (!sh) return;
      P.group.updateWorldMatrix(true, true); sh.getWorldPosition(_dwA);
      const ry = P.group.rotation.y;
      if (g.parent !== world) world.attach(g);
      g.position.set(_dwA.x - Math.cos(ry) * 0.25 - Math.sin(ry) * 0.08, _dwA.y - 0.55, _dwA.z + Math.sin(ry) * 0.25 - Math.cos(ry) * 0.08);
      g.rotation.set(0, ry + Math.PI / 2, 0.08); g.scale.setScalar(1); g.visible = true;
    }
    /* WIND: on the floor at the circle's edge, seated as he sits at her table (cast.pho, CROSS). His seated body has no finger
       bones (his standing copy, p5pho, has them: c_cast.js), so nothing is gripped: the spool stands on his open right palm,
       held up before his belly, and his left hand, palm down, circles over it winding the thread round it, the thread coming
       up from the floor to his left hand's fingers and onto the spool, the spool turning with each round (both hands laid by
       handTo after his seated rest, as FILMS-1 lays his at her table; measured: jointscan). Facing -z here: before him is -z,
       his right +x. (The first build closed his fingers round the spool by curlFingers, which a body with no finger bones
       leaves flat: the spool stood beside a flat hand, photographed) */
    function f2Wind(u, u0, u1, P) {
      const W = F2DW.wind;
      /* (1 cm up: at 2 cm up his lowest skin stood 1.2 cm over the floor, run 9's reading, so at 0 it was 0.8 cm under it;
         feetscan's 2.2 cm under stood the same with him lifted 2 cm or not, so it does not read him against this floor) */
      put(P, W.x, W.z, W.ry, 0.01);
      pose(P, 'Sit_to_Stand_Transition_M', 0.02 + 0.008 * Math.sin(u * 0.9), false);
      const ph = (u - u0) * 2 * Math.PI * 0.55;
      /* the spool's foot on his right palm (w51threadreel 0.084 m tall at 0.62: 0.052), before his belly */
      const S = [W.x + 0.03, 0.40, W.z - 0.27];
      handTo(P, 'R', [S[0] + 0.01, S[1] - 0.004, S[2] + 0.01], [-0.35, 0.05, -0.94], [0, 1, 0], 1, { out: 0.2, down: 0.32 });
      /* his left hand's fingers round the spool's top, a round each turn of the clock's 0.55 a second */
      const Lc = [S[0] - 0.005 + 0.045 * Math.cos(ph), S[1] + 0.085, S[2] + 0.045 * Math.sin(ph)];
      /* (its fingers nearer the forearm's own line: pointed down over the spool its wrist bent 73.6 degrees, jointscan) */
      handTo(P, 'L', Lc, [0.62, -0.08, -0.78], [0.08, -0.99, 0.06], 1, { out: 0.24, down: 0.28 });
      const g = F2M.spoolPho;
      if (g) { if (g.parent !== world) world.attach(g); g.position.set(S[0], S[1], S[2]); g.rotation.set(0, -ph, 0); g.scale.setScalar(1); g.visible = true; }
      /* the thread from where it leaves the floor STRAIGHT UP before his knees to above his lap, then in over it to his left
         hand's fingers and round onto the spool's side (drawn straight from the floor to his hand it went through his knees
         and robe: clipscan, 45 crossings) */
      const pk = F2DW.pick, Sx = [S[0] + 0.03 * Math.cos(ph + 0.6), S[1] + 0.03, S[2] + 0.03 * Math.sin(ph + 0.6)], up = [pk[0], 0.33, pk[2] - 0.03];
      f2TubeLay(f2Lift.g, (s, out) => {
        if (s < 0.45) { const q = s / 0.45; return out.set(lp(pk[0], up[0], q), lp(pk[1], up[1], q), lp(pk[2], up[2], q * q)); }
        if (s < 0.88) { const q = (s - 0.45) / 0.43; return out.set(lp(up[0], Lc[0], q), lp(up[1], Lc[1] - 0.02, Math.sqrt(q)), lp(up[2], Lc[2], q)); }
        const q = (s - 0.88) / 0.12; return out.set(lp(Lc[0], Sx[0], q), lp(Lc[1] - 0.02, Sx[1], q), lp(Lc[2], Sx[2], q)); }, 0, 1, F2C.r * 1.1, 0.001);
    }
    /* HIS HIPS ON THE SEAT, whatever the take: his rest (the first moment of his rise) and his talk carry their hips at
       different places from the body's own, so in the rest he sat behind the chair's back and in the talk before it
       (photographed); after each pose the body is moved under its hips to the seat's own place (the take's root laid off,
       v16.8), before his look and his hands are laid */
    const _sh = new THREE.Vector3();
    function f2SeatHips(P, at) {
      if (!P || !P.ready || !P.hips) return;
      P.group.updateWorldMatrix(true, true); P.hips.getWorldPosition(_sh);
      P.group.position.x += at[0] - _sh.x; P.group.position.y += at[1] - _sh.y; P.group.position.z += at[2] - _sh.z;
      P.group.updateWorldMatrix(true, true);
    }
    /* TABLE: seated across from him on the other chair (the end of his rise played back to its start: a man on a chair),
       his forearms laid on the table's edge, his look on his student; then, for the tie, both hands to the held wrist */
    function f2AtTable(u, u0, uTie, D, k, P) {
      const ch = F2DW.phoChair, H = FILMSAPI.helpers;
      put(P, ch.x, ch.z, ch.ry, 0);
      const sitT = 0.05 + 0.02 * Math.sin(u * 0.7);
      const talk = [[D.ph51w2 - D.d0, SECS.ph51w2, 'Sitting_Answering_Questions', 0.55]];
      const own = { A: ['ph51A3'], B: ['ph51B4'], C: ['ph51C3'], D: ['ph51D3', 'ph51D4'] }[k] || [];
      for (const n of own) if (D[n] != null) talk.push([D[n] - D.d0, SECS[n], 'Sitting_Answering_Questions', 0.5]);
      if (u < uTie - 0.4) H.speak(P, u, ['Sit_to_Stand_Transition_M', sitT, 0, false], talk);
      else pose(P, 'Sit_to_Stand_Transition_M', sitT, false);
      /* (how far his talk is on, as f1Speak eases it: in over 0.35 s from a line's start, out over the 0.45 s after its end, to
         its share) */
      let tk = 0; for (const [t0, secs, , w] of talk) tk = Math.max(tk, f2smo(c01((u - t0) / 0.35)) * (1 - f2smo(c01((u - t0 - secs) / 0.45))) * (w || 1));
      if (!(u < uTie - 0.4)) tk = 0;
      const hp = F2DW.phoHips, ty = F2TUNE.chairY || 0;
      f2SeatHips(P, [hp[0], hp[1] + 0.05 * c01(tk / 0.55) + ty, hp[2]]);
      /* (his look on his student; in D down to the red mark on his wrist as he names it, and back; to the wrist for the tie,
         and up to him for the last words) */
      const G = [[u0, 'lens', 0.3]];
      if (k === 'D' && D.ph51D3 != null) G.push([D.ph51D3 - D.d0 - 0.4, f2TieW, 0.7], [D.ph51D4 - D.d0 - 0.2, 'lens', 0.7]);
      G.push([uTie - 0.2, f2TieW, 0.6], [D.up - D.d0, 'lens', 0.8]);
      H.gaze(P, u, G, 0.75, 0.65, 0.02);
      /* the tie: both hands to his wrist (f2TieW: where the insert draws it), the thread drawn round and knotted twice */
      const uK2 = D.knot2 - D.d0, kT = f2smo(f2win(u, uTie - 0.5, uTie + 0.5)) * (1 - f2smo(f2win(u, uK2 + 0.4, uK2 + 1.1)));
      if (kT > 0.001) {
        /* (facing +z here, his right hand at -x of the wrist and his left at +x, a little over it and toward himself, the
           palms turned in to face each other across the wrist, the fingers forward along it and a little in, holding the
           thread's two ends at its sides; drawn apart at each knot. Palms down with the fingers in across it, they lay over
           the back of his hand, photographed) */
        const w = f2TieW();
        const pull = f2bell(u, D.knot1 - D.d0 - 0.35, D.knot1 - D.d0, D.knot1 - D.d0 + 0.05, D.knot1 - D.d0 + 0.4) + f2bell(u, D.knot2 - D.d0 - 0.35, D.knot2 - D.d0, D.knot2 - D.d0 + 0.05, D.knot2 - D.d0 + 0.4);
        /* (5 cm to each side of the wrist's middle: at 7 cm, on a phone's insert, 16 cm wide where the wrist is, his palms stood
           at the picture's two edges, photographed) */
        const sx = 0.05 + 0.02 * pull;
        handTo(P, 'R', [w[0] - sx, w[1] + 0.01, w[2] - 0.03], [0.3, -0.25, 0.92], [0.94, -0.3, -0.1], kT, { out: 0.24, down: 0.3 });
        handTo(P, 'L', [w[0] + sx, w[1] + 0.01, w[2] - 0.03], [-0.3, -0.25, 0.92], [-0.94, -0.3, -0.1], kT, { out: 0.24, down: 0.3 });
      }
      f2Curl(P, 'R', 0.6 * kT); f2Curl(P, 'L', 0.6 * kT);
    }
    /* the hands' pass at dawn: none until the tie, then his left hand held out, palm down, across the table (the right one's
       reach turned over: f2MirrorLeft), the white thread laid round its wrist and knotted twice, over the red mark in D */
    function f2DawnHands(u, D, k) {
      const A = F2.api; if (!A) return;
      const uTie = D.tie - D.d0, uK2 = D.knot2 - D.d0;
      /* (held out for the tie; drawn down out of the picture once it is knotted, before his eyes rise to his teacher's face) */
      /* (drawn back out of the insert after the second knot, gone by the cut up to his teacher's face) */
      /* (it comes up into the insert from the cut, into his teacher's waiting hands: brought up in the table's wide shot, it
         stood near him while his teacher reached for the table's middle) */
      const uUp = D.up - D.d0, inK = f2smo(f2win(u, uTie, uTie + 0.45)), outK = f2smo(f2win(u, uK2 + 0.3, uUp - 0.05)), out = inK * (1 - outK);
      f2Hold(null);
      if (inK > 0.01 && outK < 0.995) { f2Hands(true, F2DW.tiePose, inK, { p: 0 });
        /* (the held hand placed for the insert before the left is laid as its mirror: F2TUNE.tieArm, metres in the hands' pass) */
        const T = F2TUNE.tieArm; if (A.armR && T) { A.armR.position.x += T[0] * inK; A.armR.position.y += T[1] * inK - 0.36 * outK; A.armR.position.z += T[2] * inK; }
        f2MirrorLeft(true); }
      else { f2Hands(false); f2MirrorLeft(false); }
      const thread = u >= D.knot1 - D.d0 ? (u >= D.knot2 - D.d0 ? 2 : 1) : 0;
      /* (in D the red mark the band left stays on his wrist, the white thread tied over it) */
      f2WristShow(0, k === 'D' && out > 0.01 ? 1 : 0, out > 0.01 ? thread : 0, 0);
      if (F2W.thread) { F2W.thread.visible = out > 0.01 && u >= uTie + 0.6; }
    }
    /* DUST IN THE MORNING LIGHT (the plan's 12: "Dawn: long light through the glass, dust in it"): motes in the low sun inside
       his glass, each drifting slowly up and aside and twinkling as it turns in the light, a pure function of the clock;
       drawn as light (additive, no lamp: v9.4) */
    const F2DUST = (() => {
      const n = 120, pos = new Float32Array(n * 3), base = [];
      for (let i = 0; i < n; i++) { const h1 = f2Hash(i * 3.1 + 1), h2 = f2Hash(i * 7.7 + 2), h3 = f2Hash(i * 1.3 + 3);
        base.push([HIS.circle.x - 2.2 + 6.4 * h1, 0.25 + 2.1 * h2, LIV.z1 - 0.15 - 1.7 * h3, f2Hash(i * 5.9 + 4) * 6.28]); }
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.boundingSphere = new THREE.Sphere(new THREE.Vector3(HIS.circle.x, 1, 1.5), 6); owned.push(g);
      const m = new THREE.PointsMaterial({ map: glowTex, color: 0xffe0b0, size: 0.016, sizeAttenuation: true, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending });
      mats.push(m); const pts = new THREE.Points(g, m); pts.name = 'dust in the morning light'; pts.frustumCulled = false; pts.visible = false; hisSideG.add(pts);
      return { n, pos, base, g, m, pts };
    })();
    function f2DustAt(u, k) {
      const Dd = F2DUST; Dd.pts.visible = k > 0.001; if (!Dd.pts.visible) return;
      Dd.m.opacity = 0.55 * k;
      for (let i = 0; i < Dd.n; i++) { const b = Dd.base[i], ph = b[3];
        Dd.pos[i * 3] = b[0] + 0.05 * Math.sin(0.21 * u + ph); Dd.pos[i * 3 + 1] = b[1] + 0.06 * Math.sin(0.17 * u + ph * 1.7) + 0.004 * u; Dd.pos[i * 3 + 2] = b[2] + 0.04 * Math.sin(0.13 * u + ph * 0.6); }
      Dd.g.attributes.position.needsUpdate = true;
    }
    /* (before the dawn nothing of it stands: a pure function of the clock, so a film sought back from the morning to the
       night draws the night) */
    function f2DawnOff() {
      const H = FILMSAPI.helpers, PS = FILMSAPI.phoStand, bag = FILMSAPI.props.phoBag;
      if (PS && !PS.hidden) H.show(PS, false); if (F2.pcShown) { H.show(cast.pho, false); F2.pcShown = false; }
      if (bag && bag.visible && F2.on) bag.visible = false;
      F2M.food.visible = false; F2M.spoolPho.visible = false; F2M.spoolTable.visible = false; f2Lift.m.visible = false;
    }
    function f2DawnFx(u, D, k) {
      f2DustAt(u, f2smo(f2win(u, 0.0, 1.5)));
      f2Gold.visible = false; f2GoldPool.q.visible = false; f2GoldCeil.q.visible = false;
      for (const T of F2THREADS) T.m.visible = false; f2Sparks.visible = false; f2Ash.visible = false;
      f2FloorPhone.visible = u < D.door - D.d0; f2Spark.q.visible = false;
      f2PhoLevel(1);
      /* (the cut lands on the door all but open, 81 of its 95 degrees, its leaf by the wall at the picture's left, and it
         comes the last of the way in 0.4 s: opened from shut, and then from half way (45 degrees), its dark leaf stood
         between his eye and the doorway and filled the picture, photographed three times; the latch and the door are heard) */
      WORLD.hisDoor(u >= D.door - D.d0 && u < D.wind - D.d0 ? lp(0.85, 1, f2smo(f2win(u, D.door - D.d0, D.door - D.d0 + 0.4))) : 0);
      f2DawnPeople(u, D, k);
      f2DawnHands(u, D, k);
    }

    Object.assign(FILMSAPI, { ends2: END2 });
