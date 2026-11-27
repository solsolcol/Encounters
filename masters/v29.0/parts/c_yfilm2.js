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
    const f2Val = (K, nar) => [K.e[0], K.e[1], K.e[2], K.a[0], K.a[1], K.a[2], nar ? K.fp : K.fd, K.roll || 0];
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
      const x = F2SCR.x; x.fillStyle = '#070b12'; x.fillRect(0, 0, 256, 512); x.textAlign = 'center';
      if (mode === 'home') {
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
      const scr = new THREE.Mesh(new THREE.PlaneGeometry(0.068, 0.136), F2SCRMAT); owned.push(scr.geometry); g.add(scr);
      const src = things.hisPhone && things.hisPhone.userData.model;
      if (src) { const m = src.clone(true); m.traverse(q => { if (q.isMesh) q.frustumCulled = false; }); m.rotation.x = Math.PI / 2; m.position.z = -0.006; g.add(m); }
      return g;
    }
    const F2HELD = () => (S && S.plan && S.plan.PHONEHELD) || { pos: [-0.045, 0.06, -0.035], rot: [0.35, 0.25, 0] };
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
    function f2CircleLay(u) { const n = Math.max(0, Math.min(F2C.N, Math.round(F2C.N * c01(u)))); f2Circle.g.setDrawRange(0, n * f2Circle.per); f2Circle.m.visible = n > 0; }
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
      const W = f2Way(T.from, T.x, 0, T.aim, i + 1), g = f2TubeGeo(), m = new THREE.Mesh(g, new THREE.MeshBasicMaterial());
      m.name = 'a red thread (the barrier)'; m.frustumCulled = false; m.visible = false; hisSideG.add(m);
      const sp = ctx.spirit ? ctx.spirit(m, { color: F2RED, fill: 0.6, rim: 1.2, flicker: 0.35, xray: 0.6 }) : null;
      return Object.assign({}, T, { W, g, m, sp, i });
    });
    /* THE SPARKS where a thread burns on the gold, and its ash: small motes in the vision (ctx.spirit on an instanced mote),
       each a pure function of the clock (born at a moment, flying out and falling, fading) */
    const F2S = { n: 160 };
    const f2SparkGeo = new THREE.OctahedronGeometry(0.0055, 0); owned.push(f2SparkGeo);
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
        f2Feet.push({ m, sp: ctx.spirit ? ctx.spirit(m, { color: F2RED, fill: 1.1, rim: 0.4, flicker: 0.2, xray: 0.8 }) : null }); } }

    /* ---------------------------------------------------------------- HIS WRIST (the plan's 9.8 D, 9.9): the band of red light
       a thread wraps round his left wrist at the balcony's door (ending D), burned off by the gold in a white flash, the red
       mark it leaves, and the white thread his teacher ties over the same wrist at dawn. Each a ring laid round the left
       hand's wrist bone in the hands' own pass (the left hand is the mirrored copy of the right: buildPrayerArm) */
    const F2W = { band: null, mark: null, thread: null, flash: null, on: false };
    function f2WristDress() {
      if (F2W.band || !F2.api || !F2.api.buildPrayerArm) return !!F2W.band;
      const L = F2.api.buildPrayerArm(); if (!L || !L.userData || !L.userData.model) return false;
      const wr = L.userData.model.getObjectByName('handR'); if (!wr || !wr.parent) return false;
      const mk = (r, th, color, add, op) => { const g = new THREE.TorusGeometry(r, th, 6, 40); owned.push(g);
        const m = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ color, transparent: true, opacity: op, depthWrite: !add, blending: add ? THREE.AdditiveBlending : THREE.NormalBlending, toneMapped: false })); mats.push(m.material);
        m.position.copy(wr.position); m.quaternion.copy(wr.quaternion); m.rotateX(Math.PI / 2); m.visible = false; m.frustumCulled = false; m.renderOrder = 3; wr.parent.add(m); return m; };
      F2W.band = mk(0.034, 0.006, F2RED, true, 0.9);
      F2W.band2 = mk(0.036, 0.011, 0xff5040, true, 0.35);
      F2W.mark = mk(0.0335, 0.0042, 0xb04a46, false, 0.85);
      F2W.thread = mk(0.0345, 0.0016, 0xf4f2ea, false, 1.0);
      F2W.thread2 = mk(0.0345, 0.0016, 0xf4f2ea, false, 1.0); F2W.thread2.translateZ(0.004);
      return true;
    }
    function f2WristShow(band, mark, thread, flash) {
      if (!f2WristDress()) return;
      F2W.band.visible = band > 0.001; F2W.band.material.opacity = 0.9 * band; F2W.band2.visible = band > 0.001 || flash > 0.001;
      F2W.band2.material.opacity = 0.35 * band + 0.9 * flash; F2W.band2.material.color.setHex(flash > band ? 0xffffff : 0xff5040);
      F2W.mark.visible = mark > 0.001; F2W.mark.material.opacity = 0.85 * mark;
      F2W.thread.visible = thread > 0.5; F2W.thread2.visible = thread > 1.5;
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
      if (r > 0.001 || mv) { kit.vision({ r, moving: !!mv }); F2.vis = true; F2.visT = t; }
      /* (shut: held at nothing for a third of a second, so the vision's own radius is nothing when it is let go; let go while
         it stood open, it would run home by itself over its own 1.6 s, across a cut) */
      else if (F2.vis) { if (t != null && t - (F2.visT || 0) < 0.3 && t >= (F2.visT || 0)) kit.vision({ r: 0, moving: false }); else { kit.vision({ r: 0, moving: false }); kit.vision(null); F2.vis = false; } }
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
        f2WalkKeys(path1, Bm.walk0 + rise, Bm.bag, F2EYE.stand, { a: [F2P.bag.x, 0.2, F2P.bag.z], fp: 64, fd: 56, n: 'bar:tobag' }).slice(1).forEach(k => K.push(k));
        /* down to the bag: his right hand into it (the zip, the spool), and up again */
        K.push({ t: Bm.bag + 0.9, e: [F2P.bagAt.x, F2EYE.crouch, F2P.bagAt.z], a: [F2P.bag.x, 0.15, F2P.bag.z + 0.05], fp: 62, fd: 54, n: 'bar:bag', stop: true });
        K.push({ t: Bm.spool, e: [F2P.bagAt.x, F2EYE.crouch, F2P.bagAt.z], a: [F2P.bag.x + 0.02, 0.18, F2P.bag.z + 0.08], fp: 62, fd: 54, n: 'bar:spool', stop: true });
        K.push({ t: Bm.spool + 0.9, e: [F2P.bagAt.x + 0.05, F2EYE.stand, F2P.bagAt.z + 0.1], a: [F2P.bagAt.x + 0.9, 1.3, F2P.bagAt.z + 1.8], fp: 64, fd: 56, n: 'bar:up' });
        const path2 = F2PATH.on;
        f2WalkKeys(path2, Bm.spool + 0.9, Bm.sit0, F2EYE.stand, { a: glassA, fp: 66, fd: 58, n: 'bar:tocircle' }).slice(1).forEach(k => K.push(k));
        /* he sits down, in the middle of the room, facing his glass (a pained sit, eased over 1.6 s) */
        K.push({ t: Bm.sit0 + 0.8, e: [F2SIT.x, 1.2, F2SIT.z - 0.06], a: [C.x, 0.95, C.z + 3.0], fp: 68, fd: 60, n: 'bar:sit' });
        K.push({ t: Bm.circle - 0.7, e: eyeSit, a: [C.x, 0.62, C.z + 3.0], fp: 70, fd: 62, n: 'bar:seated', stop: true });
        K.push({ t: Bm.circle, e: eyeSit, a: [C.x, 0.02, C.z + 1.5], fp: 70, fd: 62, n: 'bar:down', stop: true });
        F2.barKeys = K; F2.barKeysFor = Bm;
      }
      if (t < Bm.circle + 0.001) return f2Keys(F2.barKeys, t);
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
      /* the bottle on his altar: trembling with the pressure, still the moment the barrier holds */
      f2Bottle(t < Bm.brk ? 0.6 + 0.4 * Math.max(0, Math.sin((t - Bm.b0) * 2 * Math.PI / 8.0 - 0.4)) : 0, t);
    }
    /* THE THREADS AT HIS FEET (endings B and C, before the barrier): the barrier's threads, most of the way along their ways,
       held off the gold's edge (there is no gold yet), searching */
    function f2ThreadsAt(t, te, o) {
      for (const T of F2THREADS) {
        const L = T.W.L, start = L * 0.6, grow = Math.max(0, te - o.t0 - T.t0 * 0.4);
        const head = Math.min(L - 0.04 - 0.05 * Math.sin(te * 1.7 + T.i), start + grow * T.v);
        T.m.visible = head > 0.05;
        if (T.m.visible) { f2TubeLay(T.g, (s2, out) => f2WayAt(T.W, s2, te, out), 0, head, F2T.r); if (T.sp) T.sp.set('uAlpha', 0.85); }
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
    function f2DThreads(t, E) {
      const bl = F2P.balc, door = [bl.x - 0.08, LIV.z1], src = [bl.x + 22, 9.0, LIV.z1 + 70];
      for (const D of f2DT) {
        const show = F2.vis && t >= E.vis + 0.6 && t < E.wrap + 0.05;
        D.m.visible = show; if (!show) continue;
        const i = D.i, lunge = i === 2, sp = (i - (F2D.n - 1) / 2) * 0.07;
        /* each from far away out in the dark, low over the city, in at the door and onto his floor toward where he stands */
        const grow = c01((t - E.vis - 0.6 - i * 0.25) / 4.0);
        const at = (s, out) => {
          const u = s;
          if (lunge && t >= E.turn) {
            /* the one that turns: its head lifts off the floor like a head turning, then lunges at the wrist */
            const tu = f2smo(f2win(t, E.turn, E.lunge)), lu = f2s5(f2win(t, E.lunge, E.wrap));
            camera.updateMatrixWorld(); const W2 = f2WristWorld(_dW);
            const base = _dA.set(lp(src[0], door[0], u), lp(src[1], 0.03, Math.pow(u, 0.6)), lp(src[2], door[1] + 0.3, u));
            const lift = Math.sin(Math.PI * c01((u - 0.82) / 0.18)) * 0.45 * tu;
            base.y += lift;
            if (W2 && u > 0.7) { const w = f2smo((u - 0.7) / 0.3) * lu; base.lerp(W2, w); }
            return out.copy(base);
          }
          return out.set(lp(src[0], door[0] + sp, u) + Math.sin(u * 9 + t * 0.9 + i) * 0.25 * (1 - u), lp(src[1], 0.03, Math.pow(u, 0.6)), lp(src[2], door[1] - 0.6 * u * u, u) + sp * 0.5);
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
      f2Cushion.position.set(0.0, -0.32 * (1 - k) + 0.035, -0.17);
      f2Cushion.rotation.set(Math.PI / 2 - 0.25, 0, 0.05 * Math.sin(t * 0.7));
      f2Cushion.scale.setScalar(0.62);
    }
    function worldOven(text) { if (F2.oven !== text) { F2.oven = text; WORLD.ovenClock(text); } }
    /* what is held in his hands in the barrier, and how (his phone, then the spool, then nothing: the lens looks out) */
    function f2BarrierHands(t, Bm) {
      const A = F2.api; if (!A) return;
      if (t < Bm.walk0 + 0.6) { f2Hold(F2M.phone, { pos: F2HELD().pos, rot: F2HELD().rot }); f2MirrorLeft(false); f2Hands(true, null, 0); return; }
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
        /* A · his thumb on his teacher's name; the call; the lens close on the phone and up as he speaks (60 / 52) */
        K.push({ t: 1.6, e: [tb.x, EYE - 0.02, tb.z], a: [tb.x - 0.35, 1.0, tb.z - 1.6], fp: 60, fd: 52, n: 'A:phone' });
        K.push({ t: E.zv51A1, e: [tb.x + 0.02, EYE - 0.03, tb.z + 0.02], a: [tb.x - 0.6, 1.35, tb.z - 1.9], fp: 60, fd: 52, n: 'A:speak' });
        K.push({ t: E.b0, e: [tb.x + 0.03, EYE - 0.04, tb.z + 0.03], a: [tb.x - 0.9, 1.25, tb.z - 1.7], fp: 62, fd: 54, n: 'A:listen', stop: true });
      } else if (k === 'B') {
        /* B · the phone set face down on his table; to his sofa as he says it; sitting, his palms together; two waves, the lens
           narrowing with them; his sight forced open on the threads at his feet; then the oven's clock (3:41); on the floor
           against the sofa, the picture a slit; he crawls to his table and calls from his knees */
        const seat = [sf.x + 0.05, F2EYE.sofa, sf.z + 0.2], fl = [sf.x + 0.1, 0.86, sf.z + 0.78], knee = [F2HX - 0.3, F2EYE.knees, 0.35];
        K.push({ t: E.down, e: [tb.x, EYE - 0.03, tb.z], a: [ph.x, 0.72, ph.z], fp: 60, fd: 52, n: 'B:down' });
        K.push({ t: E.walk, e: [tb.x, EYE - 0.03, tb.z], a: [tb.x - 1.6, 1.15, tb.z - 0.9], fp: 62, fd: 54, n: 'B:turn' });
        f2WalkKeys([[tb.x, tb.z], [F2HX - 0.5, 0.35], [F2HX - 1.5, 0.05], [seat[0] + 0.05, -0.25]], E.walk + 0.35, E.sit, EYE, { a: [seat[0], 1.05, 2.5], fp: 62, fd: 54, n: 'B:tosofa' }).slice(1).forEach(q => K.push(q));
        K.push({ t: E.sit + 1.1, e: seat, a: [seat[0], 1.0, 2.6], fp: 64, fd: 56, n: 'B:sit', stop: true });
        K.push({ t: E.wave1, e: seat, a: [seat[0] + 0.05, 0.98, 2.6], fp: 64, fd: 56, n: 'B:pray', stop: true });
        K.push({ t: E.wave2, e: [seat[0], seat[1] - 0.02, seat[2] + 0.02], a: [seat[0] + 0.1, 0.92, 2.6], fp: 56, fd: 50, n: 'B:wave' });
        K.push({ t: E.forced + 0.2, e: [seat[0], seat[1] - 0.05, seat[2] + 0.06], a: [seat[0] + 0.1, 0.55, 2.4], fp: 50, fd: 46, n: 'B:narrow' });
        K.push({ t: E.forced + 1.6, e: [seat[0], seat[1] - 0.08, seat[2] + 0.1], a: [seat[0] + 0.15, 0.0, seat[2] + 1.15], fp: 52, fd: 46, n: 'B:feet', stop: true });
        K.push({ t: E.cut - 0.01, e: [seat[0], seat[1] - 0.09, seat[2] + 0.11], a: [seat[0] + 0.2, 0.0, seat[2] + 1.2], fp: 52, fd: 46, n: 'B:feet2', stop: true });
        /* the oven's clock: an insert of a thing (v21.30), its digits 3:41 */
        const ov = F2P.oven;
        K.push({ t: E.cut, e: [ov.x - 0.12, ov.y + 0.1, ov.z + 0.55], a: [ov.x, ov.y, ov.z], fp: 26, fd: 22, n: 'B:oven', cut: true });
        K.push({ t: E.floor - 0.01, e: [ov.x - 0.11, ov.y + 0.09, ov.z + 0.5], a: [ov.x, ov.y, ov.z], fp: 25, fd: 21, n: 'B:oven2', stop: true });
        K.push({ t: E.floor, e: fl, a: [fl[0] + 2.4, 0.72, fl[2] + 0.1], fp: 52, fd: 46, n: 'B:floor', cut: true });
        K.push({ t: E.crawl, e: [fl[0] + 0.05, fl[1] - 0.04, fl[2]], a: [ph.x, 0.7, ph.z + 0.3], fp: 52, fd: 46, n: 'B:floor2', stop: true });
        K.push({ t: E.crawl + 1.0, e: [fl[0] + 0.5, F2EYE.crawl, fl[2] + 0.2], a: [ph.x, 0.5, ph.z + 0.4], fp: 56, fd: 50, n: 'B:crawl' });
        K.push({ t: E.reach - 0.6, e: [knee[0] - 0.3, F2EYE.crawl + 0.05, knee[2] + 0.05], a: [ph.x, 0.62, ph.z], fp: 56, fd: 50, n: 'B:crawl2' });
        K.push({ t: E.reach + 0.2, e: knee, a: [ph.x, 0.7, ph.z], fp: 56, fd: 50, n: 'B:table', stop: true });
        K.push({ t: E.connect, e: [knee[0], knee[1] - 0.02, knee[2]], a: [knee[0] - 0.4, 0.75, knee[2] - 1.6], fp: 58, fd: 52, n: 'B:call' });
        K.push({ t: E.b0, e: [knee[0], knee[1] - 0.04, knee[2]], a: [knee[0] - 0.9, 0.8, knee[2] - 1.4], fp: 60, fd: 52, n: 'B:listen', stop: true });
      } else if (k === 'C') {
        /* C · to the kitchen as he says it: the drawer, the pills, the tap; to his sofa; he lies back with a cushion over his
           eyes; a wave, the glass doors ticking; his sight opens on its own as the cushion slides off: his red footsteps end
           at the sofa, the threads at his feet; he calls */
        const dr = [kn.x, EYE - 0.04, kn.z], tp = [F2P.tap.x - 0.05, EYE - 0.04, kn.z + 0.05], lie = [sf.x - 0.75, 0.66, sf.z + 0.02];
        K.push({ t: E.walk, e: [tb.x, EYE - 0.02, tb.z], a: [tb.x - 0.9, 1.25, tb.z - 1.8], fp: 62, fd: 54, n: 'C:turn' });
        f2WalkKeys([[tb.x, tb.z], [F2HX - 0.45, 0.35], [F2HX - 0.4, -0.95], [kn.x, kn.z]], E.walk + 0.3, E.drawer, EYE, { a: [kn.x, 0.72, LIV.z0 + 0.3], fp: 62, fd: 54, n: 'C:tokitchen' }).slice(1).forEach(q => K.push(q));
        K.push({ t: E.drawer + 0.5, e: dr, a: [kn.x, 0.66, LIV.z0 + 0.36], fp: 60, fd: 52, n: 'C:drawer', stop: true });
        K.push({ t: E.tap - 0.1, e: [dr[0] + 0.05, dr[1], dr[2]], a: [kn.x + 0.1, 0.78, LIV.z0 + 0.5], fp: 60, fd: 52, n: 'C:pills', stop: true });
        K.push({ t: E.tap + 0.9, e: tp, a: [F2P.tap.x, 0.95, F2P.tap.z], fp: 58, fd: 50, n: 'C:tap', stop: true });
        K.push({ t: E.sofa0, e: [tp[0] - 0.05, tp[1], tp[2] + 0.05], a: [F2P.tap.x, 0.93, F2P.tap.z], fp: 58, fd: 50, n: 'C:tap2', stop: true });
        f2WalkKeys([[tp[0], tp[2]], [F2HX - 0.6, -0.65], [F2HX - 1.6, -0.25], [lie[0] + 0.8, -0.3]], E.sofa0 + 0.4, E.lie, EYE, { a: [lie[0] - 0.6, 0.6, sf.z], fp: 62, fd: 54, n: 'C:tosofa' }).slice(1).forEach(q => K.push(q));
        K.push({ t: E.lie + 0.7, e: [lie[0] + 0.35, 1.05, lie[2] + 0.25], a: [lie[0] - 0.3, 1.4, lie[2] + 0.6], fp: 64, fd: 56, n: 'C:sit' });
        K.push({ t: E.cushion, e: lie, a: [lie[0] + 0.25, FLAT.ceil, lie[2] + 0.15], fp: 64, fd: 56, n: 'C:lie', stop: true });
        K.push({ t: E.forced, e: lie, a: [lie[0] + 0.28, FLAT.ceil, lie[2] + 0.12], fp: 62, fd: 54, n: 'C:lie2', stop: true });
        K.push({ t: E.forced + 1.4, e: [lie[0] + 0.05, lie[1] + 0.14, lie[2]], a: [sf.x + 1.4, 0.25, sf.z + 0.9], fp: 60, fd: 52, n: 'C:feet' });
        K.push({ t: E.phone, e: [lie[0] + 0.06, lie[1] + 0.16, lie[2]], a: [sf.x + 2.6, 0.1, sf.z + 0.6], fp: 60, fd: 52, n: 'C:steps', stop: true });
        K.push({ t: E.connect, e: [lie[0] + 0.08, lie[1] + 0.12, lie[2]], a: [lie[0] + 0.6, FLAT.ceil * 0.75, lie[2] + 0.9], fp: 62, fd: 54, n: 'C:call' });
        K.push({ t: E.b0, e: [lie[0] + 0.08, lie[1] + 0.1, lie[2]], a: [lie[0] + 0.5, FLAT.ceil * 0.8, lie[2] + 1.1], fp: 62, fd: 54, n: 'C:listen', stop: true });
      } else if (k === 'D') {
        /* D · his sight opened on purpose; he follows the threads to his balcony's door and slides it open; the night's air;
           in the doorway, his left hand on its frame (never past it; the rail never near), he looks along them out over the
           city; one turns like a head and lunges: a band of red light round his wrist, the pressure doubled, the picture
           crushed to a slit and the lens narrowing (64 to 48 / 56 to 42), pulled half a step; he tears himself back inside,
           the door slides shut in the wind; on his knees, he calls */
        const dr = [bl.x, EYE - 0.02, bl.z - 0.15], out = [bl.x - 0.1, 1.5, LIV.z1 + 40], knees = [bl.x - 0.1, F2EYE.knees, bl.z - 0.15];
        K.push({ t: E.vis, e: [tb.x, EYE - 0.02, tb.z], a: [tb.x - 0.5, 0.2, tb.z - 0.4], fp: 64, fd: 56, n: 'D:look' });
        K.push({ t: E.walk, e: [tb.x, EYE - 0.02, tb.z], a: [tb.x - 0.6, 0.35, tb.z + 1.6], fp: 64, fd: 56, n: 'D:turn' });
        K.push({ t: E.door, e: dr, a: [bl.x - 0.05, 0.6, LIV.z1 + 1.2], fp: 64, fd: 56, n: 'D:door', stop: true });
        K.push({ t: E.slide + 1.2, e: [dr[0] - 0.02, dr[1], dr[2] + 0.02], a: [bl.x - 0.1, 0.9, LIV.z1 + 3], fp: 64, fd: 56, n: 'D:open' });
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
        F2.keys = f2EndKeys(k, E, s); F2.from = f2EndFrom(F2.keys);
        F2.pB = f2EndPress(E.b0 - 1e-3, E, k);
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
        if (t >= Bm.circle - 1e-3 && t < Bm.after) END2.circleTick();
        /* THE LENS */
        const camAt = (q) => (q < E.b0 ? f2Keys(F2.keys, q) : q < E.d0 ? f2BarrierCam(q, Bm, F2.from) : f2DawnCam(q - E.d0, E));
        const v = camAt(t);
        if (!v) return;
        /* (how fast his eye goes over the floor, for the head's bob: the same lens a twentieth of a second either side) */
        let speed = 0;
        if (t < E.d0 && !(t >= Bm.circle - 0.05 && t < Bm.after)) { const a = camAt(Math.max(0, t - 0.05)), b = camAt(t + 0.05); if (a && b) speed = Math.hypot(b[0] - a[0], b[2] - a[2]) / 0.1; camAt(t); }
        /* handheld at night (the plan's 4.4: tight), still in the circle once it is closed, level and still at dawn */
        const night = t < E.d0, amp = night ? (t < Bm.circle ? 0.9 + 0.5 * c01(F2.p0) : t < Bm.brk ? 0.55 : 0.25 * (1 - f2smo(f2win(t, Bm.calm, Bm.end)))) : 0;
        f2Drift(v, t, amp);
        if (speed > 0.05) f2Bob(v, t, speed);
        f2Lens(v[6]); f2Aim([v[0], v[1], v[2]], [v[3], v[4], v[5]], v[7]);
        /* THE PRESSURE, the vision, the beds, the things */
        let p = 0, vr = [0, false];
        if (t < E.b0) { p = f2EndPress(t, E, k); vr = f2EndVision(t, E, k); }
        else if (t < E.d0) { p = f2BarrierPress(t, Bm, F2.pB); vr = f2VisionR(t, Bm.vis0, 2.2, Bm.vis1, 1.6); }
        f2Press(p);
        f2Vision(vr[0], vr[1], t);
        if (t < E.d0) f2Beds(f2NightBeds(t < E.b0 ? p : Math.min(p, t < Bm.chant ? 1 : 0.4), vr[0] > 0.5, t >= Bm.chant ? { m6a: 0, m6b: 0, m6c: 0, tin: 0, brth: t < Bm.brk ? 0.22 : 0.1, night: t >= Bm.brk ? 0.32 : 0.05 } : null));
        else f2Beds({ night: 0, three: 0 });
        /* the screen of his phone: the decision's, the call ringing, the call with its seconds */
        if (t < E.ring) f2Screen('home', 0, '3:03');
        else if (t < E.connect) f2Screen('ring', 0, E.clock);
        else f2Screen('call', t - E.connect, E.clock);
        if (t >= E.b0 && t < E.d0) { f2BarrierFx(t, Bm, { push: k === 'B', near: k === 'B' || k === 'C', band: k === 'D' }); f2BarrierHands(t, Bm); }
        else if (t < E.b0) { f2EndFx(t, E, k); f2EndHands(t, E, k); }
        else { f2DawnFx(t - E.d0, E); }
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
      f2TablePhone.visible = k === 'B' && t >= E.flat && t < E.reach + 0.55;
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
    function f2EndHands(t, E, k) {
      const A = F2.api;
      if (k === 'A') {
        /* the phone in his right hand as the play held it: lifted a little to his eyes as he calls, and lowered as he listens */
        f2Hold(F2M.phone, { pos: F2HELD().pos, rot: F2HELD().rot });
        f2Hands(true, null, 0);
        if (A && A.armR) { const lift = f2smo(f2win(t, 0.2, 1.2)) * (1 - 0.5 * f2smo(f2win(t, E.connect + 0.5, E.connect + 2.0)));
          A.armR.position.y += 0.03 * lift; A.armR.position.x -= 0.012 * lift; }
        return;
      }
      if (k === 'B') {
        if (t < E.flat) { f2Hold(F2M.phone, { pos: F2HELD().pos, rot: F2HELD().rot }); const d = f2smo(f2win(t, E.down, E.flat));
          f2Hands(true, d > 0.01 ? 'place' : null, d); return; }
        if (t < E.flat + 0.6) { f2Hold(null); f2Hands(true, 'place', 1 - f2smo(f2win(t, E.flat, E.flat + 0.6))); return; }
        if (t >= E.pray - 0.2 && t < E.cut) { f2Hold(null); f2Hands(true, 'pray', f2smo(f2win(t, E.pray - 0.2, E.pray + 0.8)) * (1 - 0.15 * f2smo(f2win(t, E.forced, E.forced + 1)))); return; }
        if (t >= E.reach - 0.3 && t < E.reach + 0.6) { f2Hold(t >= E.reach + 0.25 ? F2M.phone : null, { pos: F2HELD().pos, rot: F2HELD().rot }); f2Hands(true, 'reach', f2bell(t, E.reach - 0.3, E.reach + 0.1, E.reach + 0.2, E.reach + 0.6)); return; }
        if (t >= E.reach + 0.6) { f2Hold(F2M.phone, { pos: F2HELD().pos, rot: F2HELD().rot }); f2Hands(true, null, 0); return; }
        f2Hold(null); f2Hands(false); return;
      }
      if (k === 'C') {
        if (t < E.walk + 0.5) { f2Hold(F2M.phone, { pos: F2HELD().pos, rot: F2HELD().rot }); f2Hands(true, null, 0); if (A && A.armR) A.armR.position.y -= 0.12 * f2smo(f2win(t, E.walk, E.walk + 0.5)); return; }
        if (t >= E.drawer - 0.2 && t < E.sofa0 + 0.3) {
          /* the drawer, the strip of pills in his hand, one to his mouth, his hand under the tap */
          const r = f2bell(t, E.drawer - 0.2, E.drawer + 0.4, E.pills + 0.5, E.pills + 0.9), m = f2bell(t, E.pills + 0.6, E.pills + 1.0, E.tap - 0.2, E.tap + 0.1);
          const tp = f2bell(t, E.tap + 0.1, E.tap + 0.5, E.sofa0 - 0.5, E.sofa0 - 0.1), m2 = f2bell(t, E.sofa0 - 0.4, E.sofa0 - 0.1, E.sofa0, E.sofa0 + 0.3);
          f2Hold(t >= E.pills && t < E.tap ? f2Pills : null, { pos: [0.0, -0.06, -0.14], rot: [0.0, 0.3, 1.4] });
          if (m > 0.01) f2Hands(true, 'mouth', m); else if (m2 > 0.01) f2Hands(true, 'mouth', m2); else if (tp > 0.01) f2Hands(true, 'reach', tp); else f2Hands(r > 0.01, 'reach', r);
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
        if (t >= E.phone) { f2Hold(F2M.phone, { pos: F2HELD().pos, rot: F2HELD().rot }); f2Hands(true, null, 0); if (A && A.armR) A.armR.position.y += 0.04 - 0.14 * (1 - f2smo(f2win(t, E.phone, E.phone + 0.7))); return; }
        f2Hold(null); f2Hands(false); return;
      }
      if (k === 'D') {
        if (t < E.walk + 0.3) { f2Hold(F2M.phone, { pos: F2HELD().pos, rot: F2HELD().rot }); f2Hands(true, null, 0); if (A && A.armR) A.armR.position.y -= 0.12 * f2smo(f2win(t, E.walk - 0.2, E.walk + 0.3)); return; }
        /* his left hand: on the door's handle as he slides it, then on its frame; the band round its wrist */
        if (t >= E.slide - 0.3 && t < E.tear + 0.2) {
          const k2 = f2smo(f2win(t, E.slide - 0.3, E.slide + 0.1)) * (1 - f2smo(f2win(t, E.tear - 0.1, E.tear + 0.2)));
          f2Hold(null); f2Hands(k2 > 0.01, 'reach', k2 * 0.85, { p: 0 });
          if (k2 > 0.01 && A && A.armR) {
            /* (on the frame at his left: the hand a little higher than the reach lays it, nearer the frame's edge on screen) */
            const onFrame = f2smo(f2win(t, E.step, E.step + 0.8)), pull = f2bell(t, E.wrap, E.wrap + 0.2, E.tear - 0.4, E.tear);
            A.armR.position.x += 0.02 * onFrame + 0.03 * pull; A.armR.position.y += 0.07 * onFrame - 0.02 * pull; A.armR.position.z -= 0.04 * pull;
          }
          if (k2 > 0.01) f2MirrorLeft(true);
          return;
        }
        f2MirrorLeft(false);
        if (t >= E.phone) { f2Hold(F2M.phone, { pos: F2HELD().pos, rot: F2HELD().rot }); f2Hands(true, null, 0); if (A && A.armR) A.armR.position.y += 0.03 - 0.14 * (1 - f2smo(f2win(t, E.phone, E.phone + 0.7))); return; }
        f2Hold(null); f2Hands(false); return;
      }
    }
    /* ================================================================ THE DAWN (the plan's 9.9) */
    function f2DawnCam(t, E) {
      const C = F2P.circle;
      return [C.x, 0.82, C.z - 0.05, C.x, 0.9, C.z + 2.0, 66, 58].concat([]).slice(0, 7).concat([0]);
    }
    function f2DawnFx(t, E) {
      f2CircleLay(1); f2Gold.visible = false; f2GoldPool.q.visible = false; f2GoldCeil.q.visible = false;
      for (const T of F2THREADS) T.m.visible = false; f2Sparks.visible = false; f2Ash.visible = false;
      f2FloorPhone.visible = false; f2SpoolFloor.visible = true;
      f2Hold(null); f2Hands(false);
    }

    Object.assign(FILMSAPI, { ends2: END2 });
