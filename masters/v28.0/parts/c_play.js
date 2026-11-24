    /* ================================================================ THE PLAY'S OWN MACHINERY (the tracker's M7; the plan's
       4.1 the walkway, 4.3 the hunt, 4.7 the collector's table). The phases' logic, their orders and their lines are in
       c_story.js; what they stand on is here: SMELL (the chapter's own button, kit.button: the sixty-first seam) and the
       threads it shows; the two followers and their teacher walking the walkway with him; Spirit Vision's strain (chapter
       4's, as it behaved there); the stains, the nine and the three presences, each seen only through Spirit Vision.
       THE PEOPLE are the chapter's shared cast (c_cast.js: cast.pho standing, cast.phoS seated in case three, cast.ton,
       prai[0..8]; Mr Koh and Jun are the world's, b_xpeople.js): the play only places them for its own phases and moves
       them on the walkway. Every one is asked for through `castOf`, so a body that is not cast yet costs its moves and
       never the play. */
    const TOUCH5 = !!((window.matchMedia && matchMedia('(pointer: coarse)').matches) || 'ontouchstart' in window);
    const castOf = (n) => (typeof cast === 'object' && cast && cast[n] && cast[n].group) ? cast[n] : null;
    /* (the nine: c_cast.js's, as cast.prai; none until they are cast) */
    const praiOf = () => (cast && Array.isArray(cast.prai)) ? cast.prai : [];
    const _pv5 = new THREE.Vector3(), _pw5 = new THREE.Vector3(), _hv5 = new THREE.Vector3();
    /* a mark that is pressed by a tap on it on a phone (v12.5): within a share of the screen of the point or of its mark */
    const markHit5 = (posF, frac = 0.1) => function (x, y) {
      const p = posF(), r = Math.min(innerWidth, innerHeight) * frac;
      camera.updateMatrixWorld();
      const pts = [[p.x, p.y, p.z]];
      if (this && this.pos) pts.push([this.pos.x, (this.pos.y ?? 1.0) + (this.markY ?? 0.55), this.pos.z]);
      return pts.some(([px, py, pz]) => { _hv5.set(px, py, pz).project(camera);
        return _hv5.z < 1 && Math.hypot(x - (_hv5.x * 0.5 + 0.5) * innerWidth, y - (-_hv5.y * 0.5 + 0.5) * innerHeight) < r; });
    };
    const myX = () => yaw.position.x, myZ = () => yaw.position.z;
    const distTo = (x, z) => Math.hypot(yaw.position.x - x, yaw.position.z - z);
    const inCourt = (x = myX(), z = myZ(), pad = 0) => x > COURT.x0 - pad && x < COURT.x1 + pad && z > COURT.z0 - pad && z < HOUSE.face + pad;

    /* ---------------------------------------------------------------- THE WALKWAY'S ONE LINE (the plan's 4.1): where
       along it he is (`s`, metres from the lift's doors, round the one turn to his gate) and a point on it, `lat` metres
       toward the inner wall from its middle. The followers walk it in single file on the wall side; the trail runs it */
    /* (R46: read from the walkway itself, its second run's middle line WAY_Z; was -14.95, turnS 15.2) */
    const WAY_Z = (WALK.z0 + WALK.turnZ) / 2;
    /* THE TURN IS ROUND (R76, Chad, 23 Nov 2026: "Pathfinding at the start of the chapter at the corridor is still too tight
       and characters are clipping into the edge of the wall"). The line was two straight runs meeting at a point: a
       follower's lane `lat` in from the middle ran on past the corner's inside to the second run's middle line and then
       JUMPED 0.78 m back to start the second run (its target leapt behind him), and a follower walked straight at a target
       round the corner, through the wall's inside edge. The middle line now turns round the inside corner (WALK.x0,
       WALK.turnZ) on a quarter circle of its own distance from both inner walls (WAY_RHO, 0.95 m), so a lane `lat` in from
       it keeps its distance from the inner walls the whole way round (a lane of 0.55 passes the corner 0.40 m off); and
       the followers walk the lane itself (walkLane), never a straight line across it. `s` is unchanged along the first
       run; the second run's is the arc's length shorter than the corner's two legs were (gateS is still x -8.5) */
    const WAY_C = { x: WALK.x0, z: WALK.turnZ }, WAY_RHO = (WALK.x0 + WALK.x1) / 2 - WALK.x0;
    const WAY_SA = 0.25 - WAY_C.z, WAY_SB = WAY_SA + WAY_RHO * Math.PI / 2;
    const WAY = { turnS: WAY_SA + WAY_RHO * Math.PI / 4, arcS: [WAY_SA, WAY_SB], gateS: WAY_SB + (WAY_C.x + 8.5) };
    function wayS(x, z) {
      if (z >= WAY_C.z) return Math.max(0, 0.25 - z);
      if (x <= WAY_C.x) return WAY_SB + (WAY_C.x - x);
      return WAY_SA + WAY_RHO * Math.max(0, Math.min(Math.PI / 2, Math.atan2(WAY_C.z - z, x - WAY_C.x)));
    }
    const wayLat = (x, z) => z >= WAY_C.z ? -x : x <= WAY_C.x ? z - WAY_Z : WAY_RHO - Math.hypot(x - WAY_C.x, z - WAY_C.z);
    function wayAt(s, lat, out) {
      if (s <= WAY_SA) return out.set(-lat, 0, 0.25 - s);
      if (s >= WAY_SB) return out.set(WAY_C.x - (s - WAY_SB), 0, WAY_Z + lat);
      const th = (s - WAY_SA) / WAY_RHO, rr = WAY_RHO - lat;
      return out.set(WAY_C.x + rr * Math.cos(th), 0, WAY_C.z - rr * Math.sin(th));
    }
    /* the walkway's heading at `s`, the way `s` grows (down the first run, round the turn, along the second) */
    const wayHead = (s) => s <= WAY_SA ? Math.PI : s >= WAY_SB ? -Math.PI / 2 : (() => { const th = (s - WAY_SA) / WAY_RHO; return Math.atan2(-Math.sin(th), -Math.cos(th)); })();
    /* (R76: the outer side's line, `lat` from the middle: the balustrade's solid stands at x 0.80 on the first run and z
       -18.40 on the second, 0.80 and 0.85 out from the middle; the nearer is kept) */
    const WAY_OUT = 0.80;

    /* ================================================================ SMELL (the plan's 4.1: one press; he breathes in,
       the edges of the picture darken a little, for about three seconds dark threads drift in the air FROM where the
       smell comes, thicker where it is stronger; then he breathes out, two and a half seconds before the next. It costs
       nothing). The button is the chapter's (seam 61), in the right-hand column under the eye, a nose; N on a desktop */
    const SMELL = { threads: 3.4, fade: 0.9, gap: 2.5 };
    SMELL.cycle = SMELL.threads + SMELL.fade + SMELL.gap;
    const smell = { shown: false, t: -1, presses: 0, waitDrawn: -1, pulse: false, onPress: null };
    const noseIcon = (() => { const c = document.createElement('canvas'); c.width = c.height = 96; const x = c.getContext('2d');
      x.strokeStyle = '#f2ece0'; x.lineWidth = 6; x.lineCap = 'round'; x.lineJoin = 'round';
      x.beginPath(); x.moveTo(38, 14); x.bezierCurveTo(36, 34, 26, 50, 22, 60); x.bezierCurveTo(18, 70, 28, 76, 38, 74);
      x.bezierCurveTo(42, 80, 50, 80, 54, 74); x.stroke();
      x.lineWidth = 4.5;
      for (let i = 0; i < 3; i++) { const y0 = 34 + i * 16; x.beginPath(); x.moveTo(62, y0); x.bezierCurveTo(70, y0 - 7, 76, y0 + 7, 86, y0); x.stroke(); }
      return c; })();
    function smellButton(on, o = {}) {
      if (!kit || !kit.button) return;
      if (!on) { if (smell.shown) kit.button('smell', null); smell.shown = false; smell.pulse = false; smell.waitDrawn = -1; return; }
      if (!smell.shown) { smell.shown = true; smell.waitDrawn = -1;
        kit.button('smell', { icon: noseIcon, label: W.btnSmell, key: 'KeyN', wait: 0, pulse: false, onPress: () => { smellPress(); } }); }
      if (o.pulse !== undefined && o.pulse !== smell.pulse) { smell.pulse = !!o.pulse; kit.button('smell', { pulse: smell.pulse }); }
    }
    function smellBusy() { return smell.t >= 0 && smell.t < SMELL.cycle; }
    function smellPress() {
      if (smellBusy() || getState() !== 'play') return false;
      smell.t = 0; smell.presses++;
      if (smell.pulse) smellButton(true, { pulse: false });
      if (kit && kit.chill) kit.chill(0.3, { secs: 0.5, tint: 'sour' });
      sniffIn();
      threadsSpawn();
      if (smell.onPress) smell.onPress();
      return true;
    }
    function smellTick(wdt) {
      if (smell.t < 0) return;
      const t0 = smell.t; smell.t += wdt;
      if (t0 < SMELL.threads && smell.t >= SMELL.threads) { if (kit && kit.chill) kit.chill(0, { secs: 1.2 }); sniffOut(); }
      if (smell.t >= SMELL.cycle) smell.t = -1;
      if (smell.shown && kit && kit.button) { const w = smell.t < 0 ? 0 : 1 - smell.t / SMELL.cycle;
        if (Math.abs(w - smell.waitDrawn) > 0.012 || (w === 0 && smell.waitDrawn !== 0)) { smell.waitDrawn = w; kit.button('smell', { wait: w }); } }
    }

    /* ---------------------------------------------------------------- THE THREADS: one ribbon a thread, all of them one
       mesh drawn in one call, each a pure function of its own age (a thread flows along its line from its source, its
       tail behind it, a slow wave across it). Spawned at a press, from the places the phase smells of (smellSources) */
    const TH = { N: 170, SEG: 10 };
    const thPos = new Float32Array(TH.N * TH.SEG * 2 * 3), thCol = new Float32Array(TH.N * TH.SEG * 2 * 4);
    const thIdx = [];
    for (let t = 0; t < TH.N; t++) for (let i = 0; i < TH.SEG - 1; i++) { const a = (t * TH.SEG + i) * 2; thIdx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
    const thGeo = new THREE.BufferGeometry();
    thGeo.setAttribute('position', new THREE.BufferAttribute(thPos, 3).setUsage(THREE.DynamicDrawUsage));
    thGeo.setAttribute('color', new THREE.BufferAttribute(thCol, 4).setUsage(THREE.DynamicDrawUsage));
    thGeo.setIndex(thIdx);
    const thMat = new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, depthWrite: false, side: THREE.DoubleSide, fog: false });
    const thMesh = new THREE.Mesh(thGeo, thMat); thMesh.frustumCulled = false; thMesh.visible = false; thMesh.renderOrder = 3; thMesh.name = 'smell threads';
    world.add(thMesh);
    const threads = [];
    let thRng = rng(28701);
    /* the colours: the true smell grey-black; the drain's brown; the pieces' smoke grey */
    const TH_COL = { dark: [0.045, 0.04, 0.035, 0.88], drain: [0.16, 0.09, 0.03, 0.85], smoke: [0.14, 0.13, 0.12, 0.7] };
    /* THE TRUE TRAIL (4.1): grey-black and long along the floor, from his court out between the gate's posts, along run 2
       and round the turn, back up run 1 toward the lift; stronger the nearer the gate */
    const TRAIL = [[0.12, 1.0], [0.12, WAY_Z + 0.5], [-0.35, WAY_Z + 0.03], [-8.15, WAY_Z + 0.03], [-8.5, WAY_Z + 0.5], [-8.5, WALK.turnZ + 0.8]];   // (R46: on the walkway's own line)
    const trailLen = []; { let L = 0; trailLen.push(0); for (let i = 1; i < TRAIL.length; i++) { L += Math.hypot(TRAIL[i][0] - TRAIL[i - 1][0], TRAIL[i][1] - TRAIL[i - 1][1]); trailLen.push(L); } }
    const TRAIL_L = trailLen[trailLen.length - 1];
    function trailAt(s, out) {
      s = Math.max(0, Math.min(TRAIL_L, s)); let i = 1; while (i < TRAIL.length - 1 && trailLen[i] < s) i++;
      const a = TRAIL[i - 1], b = TRAIL[i], k = (s - trailLen[i - 1]) / Math.max(1e-6, trailLen[i] - trailLen[i - 1]);
      return out.set(a[0] + (b[0] - a[0]) * k, 0, a[1] + (b[1] - a[1]) * k);
    }
    function trailNear(x, z) { let best = 0, bd = 1e9; for (let s = 0; s <= TRAIL_L; s += 0.25) { trailAt(s, _pw5); const d = Math.hypot(_pw5.x - x, _pw5.z - z); if (d < bd) { bd = d; best = s; } } return best; }
    const trailStrength = (s) => 0.16 + 0.84 * Math.pow(Math.max(0, Math.min(1, s / TRAIL_L)), 1.6);
    function addThread(o) { if (threads.length < TH.N) threads.push(Object.assign({ age: -(o.delay || 0), life: 2.2, w: 0.018, a: 0.05, f: 1.6, ph: thRng() * 6.28, col: TH_COL.dark }, o)); }
    /* the places this phase smells of: [{ x, y, z, k, kind, ... }] (k its strength) */
    function threadsSpawn() {
      threads.length = 0; thRng = rng(28701 + smell.presses * 7);
      const R = thRng, me = [myX(), myZ()], src = smellSources(), lean = [];
      let total = 0;
      for (const S0 of src) { S0.wt = S0.k * Math.pow(Math.max(0, 1 - Math.hypot(S0.x - me[0], S0.z - me[1]) / (S0.reach || 11)), 1.3); total += S0.wt; }
      if (phase === 'walk' && play.found.has('t') && play.found.has('j')) {
        /* the trail: threads laid where he can see them, more and darker the nearer the gate */
        const sp = trailNear(me[0], me[1]), k = trailStrength(sp + 4);
        const n = Math.round(46 + 90 * k);
        for (let i = 0; i < n; i++) {
          const s = Math.max(0.3, Math.min(TRAIL_L - 0.2, sp - 2.5 + R() * 13.5)), ks = trailStrength(s);
          if (R() > 0.35 + 0.65 * ks) continue;
          addThread({ trail: true, s0: s + 1.2, v: 0.55 + R() * 0.35, L: 1.3 + R() * 2.0 * ks, lat: (R() - 0.5) * 1.0, h: 0.05 + R() * R() * 0.9,
                      delay: R() * 1.6, life: 1.9 + R() * 0.9, w: 0.026 + 0.03 * ks, a: 0.06 + R() * 0.08, alpha: 0.55 + 0.45 * ks });
        }
      }
      for (const S0 of src) {
        const n = Math.round(Math.min(90, S0.wt * (S0.n || 60)));
        for (let i = 0; i < n; i++) {
          const ox = S0.x + (R() - 0.5) * 2 * (S0.rx || 0.25), oz = S0.z + (R() - 0.5) * 2 * (S0.rz || 0.25), oy = (S0.y || 0) + R() * (S0.ry || 0.05);
          addThread({ O: [ox, oy, oz], D: S0.d || [0, 1, 0], v: (S0.v || 0.25) * (0.75 + R() * 0.5), L: (S0.L || 0.5) * (0.7 + R() * 0.6), delay: R() * 1.5,
                      life: (S0.life || 2.2) * (0.8 + R() * 0.4), w: (S0.w || 0.028) * (0.8 + R() * 0.5), a: S0.a == null ? 0.04 : S0.a, f: S0.f || 1.6,
                      col: S0.col || TH_COL.dark, alpha: Math.min(1, 0.45 + 0.55 * S0.k), grow: S0.grow || 0, anchor: !!S0.anchor });
        }
      }
      /* A WRONG TAP IS STILL A DIRECTION (4.3): where nothing is near, the threads about him come FROM the nearest place
         not yet found, and lean toward it */
      if (total < 0.14 && phase !== 'walk') {
        const q = nearestUnfound();
        if (q) { const dx = me[0] - q.x, dz = me[1] - q.z, L = Math.hypot(dx, dz) || 1, ux = dx / L, uz = dz / L;
          for (let i = 0; i < 34; i++) { const back = 1.2 + R() * 3.2, side = (R() - 0.5) * 2.4;
            addThread({ O: [me[0] - ux * back - uz * side, 0.15 + R() * 1.1, me[1] - uz * back + ux * side], D: [ux, 0.05, uz], v: 0.45 + R() * 0.3, L: 0.7 + R() * 0.6,
                        delay: R() * 1.4, life: 1.8 + R() * 0.6, w: 0.012, alpha: 0.45 }); } }
      }
      thMesh.visible = threads.length > 0;
    }
    function smellSources() {
      if (phase === 'walk') {
        /* the decoy (4.1): a drain's grating at the walkway's edge where water has stood; its threads brown, short, and
           staying where they are */
        return [{ x: FLOOR.DRAIN.x, y: 0.02, z: FLOOR.DRAIN.z, k: 0.8, reach: 8, n: 70, rx: 0.42, rz: 0.2, ry: 0.04, d: [0, 1, 0], v: 0.08, L: 0.3, a: 0.04, f: 2.2, col: TH_COL.drain, life: 2.4, w: 0.022, anchor: true }];
      }
      if (phase === 'hunt') {
        const f = (c) => play.found.has(c) ? 0.35 : 1;
        return [
          /* under the shoe cabinet by the doors: threads pooling out from under it */
          { x: HUNT5.s1.x, y: 0.02, z: HUNT5.s1.z + 0.12, k: 0.85 * f('s1'), reach: 7, n: 55, rx: 0.32, rz: 0.12, d: [0.0, 0.18, 0.98], v: 0.22, L: 0.45, a: 0.035 },
          /* the court, at the left planter's foot: rising along it */
          { x: HUNT5.s2.x, y: 0.02, z: HUNT5.s2.z, k: 0.85 * f('s2'), reach: 9, n: 60, rx: 0.06, rz: 0.95, d: [-0.12, 0.99, 0], v: 0.26, L: 0.55, a: 0.04, anchor: true },
          /* between the gate posts: the thickest of all, running to his door */
          { x: HUNT5.s3.x, y: 0.02, z: HUNT5.s3.z, k: 1.0 * f('s3'), reach: 11, n: 90, rx: 0.55, rz: 0.18, d: [0, 0.12, 0.99], v: 0.5, L: 1.2, a: 0.05, w: 0.034 },
          /* the old armchair: threads standing thick over it (his nose is once behind the truth) */
          { x: HUNT5.arm.x, y: 0.5, z: HUNT5.arm.z, k: 0.9 * (play.found.has('a') ? 0.35 : 1), reach: 7, n: 55, rx: 0.28, rz: 0.26, ry: 0.15, d: [0, 1, 0], v: 0.25, L: 0.8, a: 0.05, anchor: true }
        ];
      }
      if (phase === 'table' || phase === 'ask') {
        /* the pieces themselves, all of them, like smoke from snuffed candles (4.7) */
        const out = [], at = TABLE5.pieces.map(P => ({ x: P.x, z: P.z }));
        for (const q of (PIECES5.list || [])) at.push({ x: q.x, z: q.z });
        for (const q of at) out.push({ x: q.x, y: TABLE5.P.angry.y + 0.02, z: q.z, k: 1, reach: 4, n: 5, rx: 0.008, rz: 0.008, d: [0, 1, 0], v: 0.12, L: 0.26, a: 0.012, f: 1.3, grow: 0.05, col: TH_COL.smoke, life: 2.8, w: 0.0065, anchor: true });
        out.push({ x: TABLE5.caseAt.x, y: TABLE5.caseAt.y, z: TABLE5.caseAt.z, k: 1, reach: 4, n: 10, rx: 0.12, rz: 0.07, d: [0, 1, 0], v: 0.12, L: 0.24, a: 0.012, f: 1.3, grow: 0.05, col: TH_COL.smoke, life: 2.8, w: 0.0065, anchor: true });
        return out;
      }
      return [];
    }
    function nearestUnfound() {
      if (phase !== 'hunt') return null;
      let best = null, bd = 1e9;
      for (const c of STAINS) if (!play.found.has(c)) { const q = HUNT5[c], d = distTo(q.x, q.z); if (d < bd) { bd = d; best = Object.assign({ c }, q); } }
      return best;
    }
    const _ta = new THREE.Vector3(), _tb = new THREE.Vector3(), _tt = new THREE.Vector3(), _tc = new THREE.Vector3(), _ts = new THREE.Vector3(), _tp = new THREE.Vector3(), _tq = new THREE.Vector3();
    function threadPoint(T, u, out) {
      const age = Math.max(0, T.age);
      if (T.trail) {
        const s = T.s0 - T.v * age + u * T.L; trailAt(s, out);
        trailAt(s + 0.05, _tq); const tx = _tq.x - out.x, tz = _tq.z - out.z, tl = Math.hypot(tx, tz) || 1;
        const wv = Math.sin(T.f * age * 1.7 + u * 5.5 + T.ph) * T.a;
        out.x += (-tz / tl) * (T.lat + wv); out.z += (tx / tl) * (T.lat + wv);
        out.y = T.h + Math.sin(T.f * age + u * 4 + T.ph * 1.3) * T.a * 0.7 + u * 0.03;
        return out;
      }
      /* (the head runs ahead of its source and the tail starts at it: a thread never reaches back under the floor) */
      /* (an ANCHORED one stands on its source and grows up from it, smoke from a snuffed candle: its tail never leaves it) */
      const D = T.D, d = T.anchor ? (1 - u) * Math.min(T.L, T.v * age + 0.04) : T.v * age + (1 - u) * T.L;
      out.set(T.O[0] + D[0] * d, T.O[1] + D[1] * d, T.O[2] + D[2] * d);
      /* the wave across it, in the two directions square to its flow, growing along a rising smoke's length */
      const amp = T.a * (1 + (T.grow || 0) * 20 * Math.max(0, d));
      const w1 = Math.sin(T.f * age * 1.6 + u * 5.0 + T.ph) * amp, w2 = Math.cos(T.f * age * 1.2 + u * 4.0 + T.ph * 0.7) * amp * 0.7;
      if (Math.abs(D[1]) > 0.9) { out.x += w1; out.z += w2; }                   // (a rising one: it sways both ways)
      else { const hl = Math.hypot(D[0], D[2]) || 1; out.x += (-D[2] / hl) * w1; out.z += (D[0] / hl) * w1; out.y += w2 * 0.6; }
      return out;
    }
    function threadsFrame(wdt, st) {
      if (!thMesh.visible) return;
      if (st === 'cine' || smell.t < 0 || !threads.length) { thMesh.visible = false; threads.length = 0; return; }
      const E = smell.t < 0.45 ? smell.t / 0.45 : smell.t < SMELL.threads ? 1 : Math.max(0, 1 - (smell.t - SMELL.threads) / SMELL.fade);
      camera.getWorldPosition(_tc);
      let vi = 0, ci = 0;
      for (let t = 0; t < TH.N; t++) {
        const T = threads[t];
        if (T) T.age += wdt;
        const on = T && T.age > 0 && T.age < T.life;
        const env = on ? Math.min(1, T.age / 0.45) * Math.min(1, (T.life - T.age) / 0.7) * E : 0;
        for (let i = 0; i < TH.SEG; i++) {
          if (!on || env <= 0.002) { for (let k = 0; k < 6; k++) thPos[vi + k] = 0; vi += 6; for (let k = 0; k < 8; k++) thCol[ci + k] = 0; ci += 8; continue; }
          const u = i / (TH.SEG - 1);
          threadPoint(T, u, _ta); threadPoint(T, Math.min(1, u + 0.06), _tb);
          _tt.subVectors(_tb, _ta); _ts.subVectors(_tc, _ta);
          _tp.crossVectors(_tt, _ts); const pl = _tp.length() || 1; const hw = T.w * (1 - 0.55 * u) * 0.5 / pl; _tp.multiplyScalar(hw);
          thPos[vi] = _ta.x + _tp.x; thPos[vi + 1] = _ta.y + _tp.y; thPos[vi + 2] = _ta.z + _tp.z;
          thPos[vi + 3] = _ta.x - _tp.x; thPos[vi + 4] = _ta.y - _tp.y; thPos[vi + 5] = _ta.z - _tp.z; vi += 6;
          const a = env * (T.alpha == null ? 1 : T.alpha) * T.col[3] * Math.pow(Math.sin(Math.PI * Math.min(1, 0.08 + u * 0.92)), 0.6);
          for (let k = 0; k < 2; k++) { thCol[ci] = T.col[0]; thCol[ci + 1] = T.col[1]; thCol[ci + 2] = T.col[2]; thCol[ci + 3] = a; ci += 4; }
        }
      }
      thGeo.attributes.position.needsUpdate = true; thGeo.attributes.color.needsUpdate = true;
    }

    /* ================================================================ THE WALKWAY'S THREE (4.1): Ton, Jun and their
       teacher walk with him, in single file along the wall side, never solid to him (the walkway is 1.9 m wide: a solid
       follower would box him in); they step to the wall as he comes, and when he walks on they follow at a walking pace
       and come to HIM, so he is never sent back. Each walks his own take at the pace of the ground he covers (v7.1).
       Past 40 s of nothing done, his teacher walks on ahead and waits at the gate. */
    const FOLLOW = { gap: 1.5, step: 1.05, wall: 0.55, slack: 0.7 };
    const PHO_GATE = { x: -7.75, z: WAY_Z + 0.45 };   // (R46: at the gate, wherever it stands; was z -14.5)
    const walkers = { list: [], ahead: false };
    function walkersInit() {
      walkers.list = []; walkers.ahead = false;
      const add = (n, st, rank) => { const P = castOf(n); if (!P) return;
        walkers.list.push({ n, P, rank, s: wayS(st.x, st.z), lat: -st.x, v: 0, moving: false, ahead: false }); };
      add('pho', STATION.walk.pho, 0); add('ton', STATION.walk.ton, 1); add('jun', STATION.walk.jun, 2);
    }
    function walkerMove(W0, tx, tz, wdt, pace) {
      const P = W0.P, g = P.group.position, dx = tx - g.x, dz = tz - g.z, d = Math.hypot(dx, dz);
      if (d < 0.06) { if (W0.moving) { W0.moving = false; W0.v = 0; P.rate = 1; rest(P, 0.35); } return false; }
      if (!W0.moving) { W0.moving = true; P.actN++; take(P, 'Walking', 0.3); gaze(P, null, { secs: 0.5 }); }
      /* (a line said while he walks does not stop his feet: his talk's take, and the rest after it, slid him along the
         walkway standing (the motion probe: Grandmaster Pho walking on ahead while his "SMELL." was said). He walks on;
         the voice is heard) */
      else if (P.cur !== 'Walking') { P.actN++; take(P, 'Walking', 0.3); }
      const want = Math.min(pace, 0.6 + d * 1.2);
      W0.v += (want - W0.v) * Math.min(1, wdt * 3.5);
      const st = Math.min(d, W0.v * wdt); g.x += dx / d * st; g.z += dz / d * st;
      P.group.rotation.y += angTo(P.group.rotation.y, Math.atan2(dx, dz)) * Math.min(1, wdt * 5.5);
      P.rate = Math.max(0.5, Math.min(1.35, W0.v / pace));
      return true;
    }
    /* A FOLLOWER WALKS THE LANE (R76): his step is taken along the walkway's line (`s`) and across it (`lat`) and laid back on
       the walkway by wayAt, so every step keeps the lane's distance from the inner walls, round the turn as well (a
       straight line at a target round the corner went through the wall's inside edge); he faces the way his feet go. The
       walk's take, its pace and its rate as walkerMove's; the walkable map is told he walks and which way (navTellWalk) */
    function walkLane(W0, ts, tl, wdt, pace) {
      const P = W0.P, g = P.group.position;
      const s0 = wayS(g.x, g.z), l0 = wayLat(g.x, g.z), ds = ts - s0, dl = tl - l0, d = Math.hypot(ds, dl);
      /* (R76, build 46's walk: a man standing does not take a step for a few centimetres; Grandmaster Pho, five short of his
         lane, walked sideways at the wall and his hand went into it. Once walking, he walks on to his mark) */
      const small = !W0.moving && Math.abs(ds) < 0.1 && Math.abs(dl) < 0.15;
      if (d < 0.06 || small) { if (W0.moving) { W0.moving = false; W0.v = 0; P.rate = 1; rest(P, 0.35); W0.still = 0; } W0.still = (W0.still || 0) + wdt; navTellWalk(P, false); return false; }
      W0.still = 0;
      if (!W0.moving) { W0.moving = true; P.actN++; take(P, 'Walking', 0.3); gaze(P, null, { secs: 0.5 }); }
      else if (P.cur !== 'Walking') { P.actN++; take(P, 'Walking', 0.3); }
      const want = Math.min(pace, 0.6 + d * 1.2);
      W0.v += (want - W0.v) * Math.min(1, wdt * 3.5);
      const st = Math.min(d, W0.v * wdt);
      wayAt(s0 + ds / d * st, l0 + dl / d * st, _pw5);
      const mx = _pw5.x - g.x, mz = _pw5.z - g.z;
      g.x = _pw5.x; g.z = _pw5.z;
      /* (R76, the walkway walked by the real keys on build 45: a follower stepping aside turned his whole body to face the
         inner wall and walked at it, his stride's front toe 0.50 m before his hips, into the wall (Jun 11.4 cm, Grandmaster
         Pho 6.4). A man who steps aside in a corridor keeps his body along it: his heading is the walkway's (whichever way
         along it is nearer the way he goes, or, for a step straight across, nearer the way he already faces), turned at most
         20 degrees toward his step (35 on build 46 still swung a hand into the wall) */
      if (mx * mx + mz * mz > 1e-10) {
        const hm = Math.atan2(mx, mz); let ax = wayHead(s0);
        const across = Math.abs(Math.cos(angTo(ax, hm))) < 0.35, ref = across ? P.group.rotation.y : hm;
        if (Math.abs(angTo(ax, ref)) > Math.PI / 2) ax += Math.PI;
        const want = ax + Math.max(-0.35, Math.min(0.35, angTo(ax, hm)));
        P.group.rotation.y += angTo(P.group.rotation.y, want) * Math.min(1, wdt * 5.5);
      }
      /* (R75's debug, B4: his walk's rate from the ground his feet really cover: the step is taken along the walkway's middle
         line, and round the turn's inside that line's metre is 0.42 to 0.54 of his, so a rate read from it had his feet
         sliding 0.7 m a second for a second and more. v7.1: a body moved on wall time takes its walk's rate from the ground) */
      const cov = wdt > 0 ? Math.hypot(mx, mz) / wdt : 0;
      P.rate = Math.max(0.5, Math.min(1.35, cov / pace));
      wayAt(s0 + Math.sign(ds || 1) * Math.min(Math.abs(ds), 0.6), tl, _pw5);
      navTellWalk(P, true, _pw5.x, _pw5.z);
      return true;
    }
    function walkersTick(wdt) {
      if (phase !== 'walk' || !walkers.list.length) return;
      const sp = wayS(myX(), myZ());
      /* the order of the file along the way: whoever is furthest along goes first (no two in one place) */
      const lst = walkers.list.filter(W0 => W0.P.ready && !W0.ahead).sort((a, b) => b.s - a.s);
      let cap = Infinity, front = null;
      for (const W0 of lst) {
        const g = W0.P.group.position;
        W0.s = wayS(g.x, g.z);
        let ts = W0.s, tl = W0.lat;
        const near = Math.abs(sp - W0.s) < 1.1 && Math.abs(wayLat(myX(), myZ()) - W0.lat) < 0.9;
        /* he has walked on past: follow, a step and a half behind him and a step behind the one in front */
        if (sp > W0.s + FOLLOW.gap + FOLLOW.slack) { ts = sp - FOLLOW.gap; tl = FOLLOW.wall; W0.side = null; }
        else if (near) {
          /* (he comes up to him: a step aside. R76: to the side he already stands on from him, kept until he has passed:
             Jun, on the rail's side of him, crossed the walkway in front of him to the wall's) */
          if (W0.side == null) W0.side = wayLat(g.x, g.z) >= wayLat(myX(), myZ()) - 0.05 ? 1 : -1;
          tl = W0.side > 0 ? FOLLOW.wall : -(WAY_OUT - footOf(W0.P).a - 0.10);
        } else W0.side = null;
        /* (R76: never nearer the inner wall than his own half-width and a hand's swing: Grandmaster Pho's robe is 0.37 either
           side; nor nearer the rail's side. 0.06 on build 46: a walking arm still reached the wall) */
        tl = Math.max(-(WAY_OUT - footOf(W0.P).a - 0.14), Math.min(tl, WAY_RHO - footOf(W0.P).a - 0.14));
        ts = Math.min(ts, cap);
        /* (R75's debug, B4: and the step kept on the ground between them, not only along the middle line: round the turn's
           inside the file's 1.05 m along the line was 0.42 to 0.54 m between two bodies, inside two walking reaches) */
        if (front) for (let k = 0; k < 8; k++) { wayAt(ts, tl, _pw5); const dd = Math.hypot(_pw5.x - front.x, _pw5.z - front.z);
          if (dd >= FOLLOW.step - 0.02) break; const nt = Math.max(Math.min(ts, W0.s), ts - (FOLLOW.step - dd)); if (nt >= ts - 1e-4) break; ts = nt; }   // (never a step back: he waits)
        cap = ts - FOLLOW.step; front = { x: g.x, z: g.z };
        const pace = (W0.P.pace && W0.P.pace.Walking) || 1.2;
        const moving = walkLane(W0, ts, tl, wdt, pace);
        /* (his turn to the one he walks with waits until his feet have come together under him: turned in the half second
           after a stop, a stride across the walkway's width put a foot in the wall, build 46's walk) */
        if (!moving && (W0.still || 0) > 0.45 && distTo(g.x, g.z) < 7) {
          /* standing, he turns to the one he walks with (his whole body: v14.5), and looks at him */
          const want = faceTo(g.x, g.z, myX(), myZ()), d0 = angTo(W0.P.group.rotation.y, want);
          if (Math.abs(d0) > 0.5 || W0.turning) { W0.turning = Math.abs(d0) > 0.05; W0.P.group.rotation.y += d0 * Math.min(1, wdt * 2.5); }
          if (!W0.looking) { W0.looking = true; gaze(W0.P, 'lens', { secs: 0.8, reach: 0.7 }); } }
        if (moving) W0.looking = false;
        W0.lat = tl;
      }
      /* his teacher walks on ahead and waits at the gate */
      const ph = walkers.list.find(W0 => W0.n === 'pho' && W0.ahead);
      if (ph && ph.P.ready) { const P = ph.P, pace = (P.pace && P.pace.Walking) || 1.1, g = P.group.position;
        /* (R76: along the lane to the gate, its last point PHO_GATE itself: wayAt(gateS - 0.75, 0.45)) */
        const s = wayS(g.x, g.z), ts = Math.min(WAY.gateS - 0.75, s + 2.0);
        /* arrived, he turns to face him, his whole body eased round as the followers turn (v14.5: a turn, never a snap; set in
           one frame, it swung him up to half a circle while the player watched him go), and looks at him */
        if (!walkLane(ph, ts, Math.min(s > WAY.turnS - 0.5 ? 0.45 : FOLLOW.wall, WAY_RHO - footOf(P).a - 0.14), wdt, pace) && (ph.still || 0) > 0.45) {
          const d0 = angTo(P.group.rotation.y, faceTo(g.x, g.z, myX(), myZ()));
          if (!ph.turned) { ph.turned = true; ph.turning = true; gaze(P, 'lens', { secs: 1, reach: 0.7 }); }
          if (ph.turning || Math.abs(d0) > 0.5) { ph.turning = Math.abs(d0) > 0.05; P.group.rotation.y += d0 * Math.min(1, wdt * 2.5); } } }
    }
    function phoWalksAhead() { const W0 = walkers.list.find(w => w.n === 'pho'); if (W0 && !W0.ahead) { W0.ahead = true; W0.turned = false; } }

    /* ================================================================ SPIRIT VISION'S STRAIN (chapter 4's, as it behaved
       there: R95, R96, R128, R129): his heart climbs while his sight is open and settles while it is shut; the ring on
       the eye fills with it, red from its mark, where the eye asks to close; once it is empty after a shut with strain in
       it, the eye asks to open again. Nothing here charges him for looking (4.3: "dread, not damage") */
    const HEAT5 = { up: 1 / 32, down: 1 / 2.8 }, WARN5 = 0.85;
    const sight = { heat: 0, was: false, shutPeak: 0, topArmed: true, restSaid: true, step: -1 };
    const visOpen = () => { const v = kit && kit.vision ? kit.vision() : null; return !!(v && v.on && !v.held); };
    function strainTick(wdt) {
      if (!kit || !kit.vision) return;
      const live = phase === 'hunt' || phase === 'table';
      const v = kit.vision(); if (!v) return;
      const open = v.on && !v.held;
      if (sight.was && !open) { sight.shutPeak = sight.heat; sight.restSaid = false; }
      if (!open || sight.heat < WARN5) sight.topArmed = true;
      sight.was = open;
      sight.heat = Math.max(0, Math.min(1, sight.heat + (open ? HEAT5.up : -HEAT5.down) * wdt));
      const step = !open ? 0 : sight.heat >= 1 ? 3 : sight.heat >= 0.75 ? 2 : sight.heat >= 0.45 ? 1 : 0;
      if (open && step !== sight.step && kit.pulse) { sight.step = step; kit.pulse(step === 3 ? { bpm: 160, secs: 1.2, erratic: 0.4 } : step === 2 ? { bpm: 142, secs: 2 } : step === 1 ? { bpm: 128, secs: 2.5 } : { bpm: 114, secs: 2.4 }); }
      if (!open) sight.step = -1;
      if (kit.visionStrain) kit.visionStrain(live ? sight.heat : null, { warn: WARN5 });
      if (!live || play.busy) return;
      /* (R128, R129) "You're losing control, close your Spirit Vision, and re-open it again." at the top; "When you feel
         better, open your Spirit Vision again." once the ring of a shut made with strain in it is empty, while there is
         still something to look at */
      if (open && sight.heat >= 1 && sight.topArmed && !lineBusy()) { sight.topArmed = false; say('ph5v1'); }
      if (!open && !sight.restSaid && sight.shutPeak >= WARN5 && sight.heat <= 0.02 && sightNeeded() && !lineBusy()) { sight.restSaid = true; say('ph5v2'); }
    }
    /* THE EYE ASKS (chapter 4's two colours): to CLOSE while the ring is red; to OPEN while the order is to look */
    let urgeNow = null;
    function urgeTick() {
      if (!kit || !kit.visionUrge) return;
      const open = visOpen();
      let u = false;
      if (phase === 'hunt' || phase === 'table') {
        if (open && sight.heat >= WARN5) u = 'close';
        else if (!open && sightAsk() && sight.heat <= 0.05 && !play.busy) u = 'open';
      }
      if (u !== urgeNow) { urgeNow = u; kit.visionUrge(u); }
    }

    /* ================================================================ THE HUNT'S PLACES (4.3), each seen only through
       Spirit Vision (ctx.spirit: drawn in the vision's layer, nowhere else): what his sight shows at each of the three
       places the smell is strongest, and nothing at the armchair. The patches are a spill's shape on the floor with a
       faint sheen moving on it; the threshold's with spots in a trail across the court to his doors. */
    const HUNT5 = {
      s1: { x: -9.45, z: -5.12 },                                   // under the shoe cabinet by the doors (inside)
      s2: { x: COURT.x1 - 0.92, z: PLANT_Z },                       // the court, at the left planter's foot (his left as he comes in; R37: its z is the planter's; R46: its x too, was -6.82)
      s3: { x: GATE.x, z: WALK.turnZ + 0.28 },                      // the threshold between the gate posts (R46: was -13.72)
      arm: { x: -7.25, z: -2.18 }                                   // the old armchair
    };
    const stainFx = [];
    function spillShape(seed, rx, rz) {
      const r = rng(seed), sh = new THREE.Shape(), n = 40;
      const ks = []; for (let i = 0; i < n; i++) ks.push(0.8 + r() * 0.3);
      for (let i = 0; i <= n; i++) { const a = (i % n) / n * Math.PI * 2, j = i % n, k = (ks[(j + n - 1) % n] + 2 * ks[j] + ks[(j + 1) % n]) / 4 + 0.12 * Math.sin(a * 3 + ks[0] * 5);
        const x = Math.cos(a) * rx * k, z = Math.sin(a) * rz * k; if (i === 0) sh.moveTo(x, z); else sh.lineTo(x, z); }
      return sh;
    }
    function stainMesh(seed, x, z, rx, rz, ry = 0, y = 0.03) {
      /* (laid flat facing UP: turned the other way it faced the floor, and from above it was culled and never drawn) */
      const g = new THREE.ShapeGeometry(spillShape(seed, rx, rz), 2); g.rotateX(-Math.PI / 2);
      const m = new THREE.Mesh(g, matProxy); m.position.set(x, y, z); m.rotation.y = ry; world.add(m); return m;
    }
    function stainsBuild() {
      const grp = new THREE.Group(); grp.name = 'the hunt\'s stains (Spirit Vision only)'; world.add(grp);
      const add = (m) => { world.remove(m); grp.add(m); };
      add(stainMesh(28711, HUNT5.s1.x, HUNT5.s1.z - 0.06, 0.42, 0.26));
      add(stainMesh(28712, HUNT5.s2.x, HUNT5.s2.z, 0.16, 1.0));
      add(stainMesh(28713, HUNT5.s3.x, HUNT5.s3.z, 0.85, 0.3));
      /* the spots in a trail from the threshold across the court to his doors */
      const r = rng(28714);
      for (let z = WALK.turnZ + 0.9; z < HOUSE.face - 0.3; z += 0.55 + r() * 0.35) add(stainMesh(28720 + ((z * 10) | 0), GATE.x + (r() - 0.5) * 0.55, z, 0.07 + r() * 0.07, 0.06 + r() * 0.06, r() * 3));
      grp.visible = false;
      /* seen only through his sight, LAID ON its white negative by its own strength (vision.js: never added), so a dark
         colour reads as a dark spill, with a slow sheen (its flicker) moving on it; 3 cm over the floor, so the pass's
         depth test does not hide it in the floor */
      const fx = ctx.spirit ? ctx.spirit(grp, STAIN_LOOK) : null;
      return { grp, fx };
    }
    const STAIN_LOOK = { color: 0x1c2410, fill: 0.6, rim: 0.3, flicker: 0.35, power: 1.6, xray: 0 };
    const stains5 = stainsBuild();
    /* (drawn only in the hunt; the vision draws it only where his sight's wave has reached) */
    function stainsTick(st) { stains5.grp.visible = phase === 'hunt' && st !== 'cine'; }
    /* THE NINE, in the court from the moment he arrives (4.3): still, heads bowed, all facing the doors of the house,
       standing between where he has been walking: the chapter's cast puts them at their places (c_cast.js PRAI5.home),
       the play bows their heads */
    /* (where they stand all evening, in the world's metres: the cast's places, read by the films too: c_yfilm.js NINE5) */
    const NINE_AT = PRAI_STAND.map(a => { const w = courtWorld(a[0], a[1]); return [w.x, w.z]; });
    const nineAt = () => NINE_AT;
    let nineOn = false;
    function nineStand(on) {
      if (on === nineOn && !on) return;
      nineOn = on;
      if (!on) { if (castPhaseNow === 'hunt') PRAI5.home('walk'); return; }
      PRAI5.home('hunt');
      for (const P of praiOf()) whenReady(P, (Q) => { if (!nineOn) return; const g = Q.group.position, ry = Q.group.rotation.y;
        gaze(Q, [g.x + Math.sin(ry) * 1.1, 0.0, g.z + Math.cos(ry) * 1.1], { secs: 0.1, reach: 0.9, down: 0 }); });
    }
    /* whether any of the nine is in the picture within reach: the wave runs out and they are there (4.3: seen the first
       time his sight is open in the court, or with them in front of him through the open door). Only where his eyes reach
       them: from inside his house by a line through the front door's opening, clear of its open leaf (the walls stop his
       sight's wave, 4.3; the windows' curtains are drawn, 4.2), never through the wall, as the frustum alone let it (the
       beat was said in the living room turned to the front wall); from the walkway not at all (the plan's one road is the
       court, where his teacher can be beside him) */
    const _ce5 = new THREE.Vector3();
    function nineSightFrom(e, x, z) {
      if (inCourt(e.x, e.z)) return true;
      if (e.z < HOUSE.face || e.x < LIVING.x0 || e.x > LIVING.x1) return false;
      const u = (HOUSE.face - e.z) / (z - e.z), wx = e.x + (x - e.x) * u;
      if (!(wx > DOOR_FRONT.x0 + 0.05 && wx < DOOR_FRONT.x1 - 0.05)) return false;
      const L = DOOR_LEAF, lx = (L.x0 + L.x1) / 2;
      if ((e.x - lx) * (wx - lx) < 0) { const zl = e.z + (HOUSE.face - e.z) * (lx - e.x) / (wx - e.x); if (zl > L.z0 && zl < L.z1) return false; }
      return true;
    }
    function nineInView() {
      camera.updateMatrixWorld(); camera.getWorldPosition(_ce5);
      for (const a of nineAt()) { if (distTo(a[0], a[1]) > 9) continue; _hv5.set(a[0], 1.1, a[1]).project(camera);
        if (_hv5.z < 1 && Math.abs(_hv5.x) < 0.95 && Math.abs(_hv5.y) < 0.95 && nineSightFrom(_ce5, a[0], a[1])) return true; }
      return false;
    }

    /* ================================================================ THE COLLECTOR'S TABLE (4.7): his pieces on the white
       cloth, and on three of them the three presences, each a look answered by a press (v21.9). Which presence sits on
       which piece is the game's own picture (docs/research/V28.0-PIECES.md): the ANGRY knot on the charging bull (Wua
       Thanu), the HUNGRY reaching shape on the bottle of oil (Rak Yom), the one LOOKING FOR ENERGY on the bound effigy (Hun
       Phayon). The three are placed here (stage.things by key: the films move and show them, c_yfilm.js PIECES5, THREE5) */
    /* (R89, Chad, 24 Nov: "the amulets on the table are not arranged properly and some are floating outside". MEASURED on
       the live build (the cloth's own triangles, a line down through every corner of every piece): the cloth's flat top
       runs x -0.50..0.50 and z -0.28..0.28 about the room's middle, at 0.3369 to 0.3388 m (higher toward the case, by 4.3
       mm a metre); the front row stood at z -0.30, its pieces' fronts over the hanging drape, 7 to 29 cm above the cloth
       under them, two more past the ends; and every piece stood at 0.345, 6.5 mm over the top. Now: twenty in a grid of
       four by five inside the top by 4 cm or more and clear of the case (GRID5), each set on the cloth where it stands
       (CLOTHY5, sunk half a millimetre), the collector's pieces grouped by kind and turned to him, the three that carry
       the presences in the back row; the bowl and the tied bag inside the top too) */
    const CLOTHY5 = (x) => 0.3383 - 0.0043 * x;
    /* (centred on his line of sight, 9 cm apart: off-centre at 11.5 cm its fourth column stood half out of a phone's frame at
       the near rows; the case's east edge, x -0.178, keeps 1.8 cm from the nearest) */
    const GRID5 = { xs: [-0.135, -0.045, 0.045, 0.135], zs: [-0.20, -0.11, -0.02, 0.07, 0.16] };
    const TABLE5 = (() => {
      const R = ROOM, G = GRID5, at = (i, j) => ({ x: R.cx + G.xs[i], y: CLOTHY5(R.cx + G.xs[i]), z: R.cz + G.zs[j] });
      const P = { angry: Object.assign(at(1, 4), { key: 'w5wuathanu', ry: Math.PI + 0.5 }),
                  hungry: Object.assign(at(2, 4), { key: 'w5rakyom', ry: Math.PI }),
                  energy: Object.assign(at(3, 4), { key: 'w5hunphayon', ry: Math.PI - 0.2 }) };
      return { P, pieces: [P.angry, P.hungry, P.energy], caseAt: { x: R.cx - 0.36, y: 0.345 + 0.06, z: R.cz - 0.05 } };
    })();
    FLOOR.pieces = TABLE5;
    for (const k of ['angry', 'hungry', 'energy']) { const q = TABLE5.P[k];
      if (!things[q.key]) things[q.key] = place(q.key, q.x, q.y, q.z, q.ry, { name: q.key }); }
    /* the presences: no body and no face (they are not people: a knot, a reaching thinness, a small pale warmth) */
    const PRES_LOOK = {
      angry:  { color: 0xff3a2c, fill: 0.08, rim: 2.2, flicker: 0.45, power: 1.8, xray: 0 },
      hungry: { color: 0x9cff54, fill: 0.05, rim: 2.0, flicker: 0.2, power: 2.0, xray: 0 },
      energy: { color: 0xe4ecff, fill: 0.18, rim: 1.4, flicker: 0.08, power: 2.2, xray: 0 }
    };
    const pres = {};
    (function presencesBuild() {
      const q = TABLE5.P;
      /* ANGRY: a tight, jagged knot that flinches when it is looked at */
      { const g = new THREE.IcosahedronGeometry(0.03, 2), p = g.attributes.position, r = rng(28731);
        for (let i = 0; i < p.count; i++) { const k = 0.7 + r() * 0.65; p.setXYZ(i, p.getX(i) * k, p.getY(i) * k, p.getZ(i) * k); }
        g.computeVertexNormals(); const m = new THREE.Mesh(g, matProxy); const grp = new THREE.Group(); grp.add(m); grp.position.set(q.angry.x, q.angry.y + 0.06, q.angry.z); world.add(grp);
        pres.angry = { grp, m, home: grp.position.clone(), flinch: 0 }; }
      /* HUNGRY: a thin shape bent over its piece, reaching toward the collector's hands (he sits at the table's west end) */
      { const C = new THREE.CatmullRomCurve3([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0.0, 0.11, 0.01), new THREE.Vector3(-0.05, 0.16, 0.0), new THREE.Vector3(-0.13, 0.13, -0.02), new THREE.Vector3(-0.2, 0.07, -0.03)]);
        const g = new THREE.TubeGeometry(C, 24, 0.011, 6, false), t = g.attributes.position;
        /* (thinning to its reaching end) */
        for (let i = 0; i < t.count; i++) { const seg = Math.floor(i / 7) / 24, k = 1 - 0.75 * seg; const c0 = C.getPoint(Math.min(1, seg)); t.setXYZ(i, c0.x + (t.getX(i) - c0.x) * k, c0.y + (t.getY(i) - c0.y) * k, c0.z + (t.getZ(i) - c0.z) * k); }
        g.computeVertexNormals(); const m = new THREE.Mesh(g, matProxy); const grp = new THREE.Group(); grp.add(m); grp.position.set(q.hungry.x, q.hungry.y + 0.02, q.hungry.z); world.add(grp);
        pres.hungry = { grp, m, home: grp.position.clone() }; }
      /* LOOKING FOR ENERGY: small and pale, drifting toward whoever is nearest: toward HIM as he leans in */
      { const g = new THREE.SphereGeometry(0.032, 16, 12); const m = new THREE.Mesh(g, matProxy); const grp = new THREE.Group(); grp.add(m); grp.position.set(q.energy.x, q.energy.y + 0.12, q.energy.z); world.add(grp);
        pres.energy = { grp, m, home: grp.position.clone() }; }
      for (const k in pres) { pres[k].grp.visible = false; pres[k].fx = ctx.spirit ? ctx.spirit(pres[k].grp, PRES_LOOK[k]) : null; }
      /* (R90, Chad, 24 Nov: "the green and red effects seen in spirit vision on the amulets look very strange, can you change
         it to something simple, like red and green smoke coming out from the amulet". The angry knot and the hungry tube are
         hidden (their groups kept: the marks, the taps and the films ride on them) and each piece gives off SMOKE5 in its own
         colour; the pale one on the effigy, which he did not name, is as it was) */
      pres.angry.m.visible = false; pres.hungry.m.visible = false;
      /* (R92, Chad, 24 Nov: "Change the doll to smoke too": the pale sphere over the effigy hidden as well, and the doll
         gives off a pale smoke of its own) */
      pres.energy.m.visible = false;
    })();
    /* R90: A THIN SMOKE IN EACH PRESENCE'S COLOUR, rising off its piece and fading: soft puffs drawn only through his sight
       (the vision's own layer, laid on as its spirits are: premultiplied and added, so the compositor reads the colour
       true), each a pure function of the clock it is given (play's wall clock, a film's own), so a seek lands on the same
       smoke. The red rises quick and restless (the angry one, shaking more as it flinches), the green slow and leaning
       toward the collector's hands at the table's west end (the hungry one reaching) */
    const SMOKE5 = (() => {
      const NP = 34, _db = new THREE.Vector2();
      const mk = (color, seed, o) => {
        const g = new THREE.BufferGeometry(), pos = new Float32Array(NP * 3), siz = new Float32Array(NP), alp = new Float32Array(NP), rot = new Float32Array(NP);
        const at = (a, n) => { const b = new THREE.BufferAttribute(a, n); b.setUsage(THREE.DynamicDrawUsage); return b; };
        g.setAttribute('position', at(pos, 3)); g.setAttribute('aS', at(siz, 1)); g.setAttribute('aA', at(alp, 1)); g.setAttribute('aR', at(rot, 1)); owned.push(g);
        const m = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, depthTest: false, fog: false, toneMapped: false,
          blending: THREE.CustomBlending, blendSrc: THREE.OneFactor, blendDst: THREE.OneFactor, blendEquation: THREE.AddEquation,
          blendSrcAlpha: THREE.OneFactor, blendDstAlpha: THREE.OneFactor, blendEquationAlpha: THREE.AddEquation,
          uniforms: { uColor: { value: new THREE.Color(color) }, uScale: { value: 400 } },
          vertexShader: 'attribute float aS; attribute float aA; attribute float aR; varying float vA; varying float vR; uniform float uScale; void main(){ vA = aA; vR = aR; vec4 mv = modelViewMatrix * vec4(position, 1.0); gl_PointSize = aS * uScale / max(0.05, -mv.z); gl_Position = projectionMatrix * mv; }',
          fragmentShader: 'uniform vec3 uColor; varying float vA; varying float vR; void main(){ vec2 p = gl_PointCoord - 0.5; float c = cos(vR), s = sin(vR); p = vec2(c * p.x - s * p.y, s * p.x + c * p.y); float d = length(p) * 2.0; if (d > 1.0) discard; float n = 0.72 + 0.28 * sin(p.x * 12.0 + vR * 3.0) * sin(p.y * 10.0 - vR * 2.0); float a = clamp(pow(1.0 - d, 1.6) * n * vA, 0.0, 1.0); gl_FragColor = vec4(uColor * a, a); }' });
        mats.push(m);
        const pts = new THREE.Points(g, m); pts.frustumCulled = false; pts.visible = false; pts.renderOrder = 3;
        if (ctx.visionLayer != null) pts.layers.set(ctx.visionLayer);
        /* (a point's size in the target it is drawn into: the vision draws its spirits at half the screen) */
        pts.onBeforeRender = (r, sc, cam) => { const tg = r.getRenderTarget(), h = tg ? tg.height : r.getDrawingBufferSize(_db).y;
          m.uniforms.uScale.value = h * 0.5 / Math.tan(((cam && cam.fov) || 50) * Math.PI / 360); };
        world.add(pts);
        const r = rng(seed), P = Array.from({ length: NP }, (q, i) => ({ life: o.life * (0.85 + 0.3 * r()), ph: i / NP + 0.04 * r(), sw: r() * 6.28, sw2: r() * 6.28, rr: r() * 6.28, h: o.rise * (0.8 + 0.4 * r()), s1: o.size * (0.85 + 0.3 * r()) }));
        return {
          pts,
          /* the smoke at clock t, off the point b (its piece's top), at strength k (0 none), shaken by `agit` (0..1): each puff
             leaves the top at once, at its brightest there, and rises at an even pace, widening and thinning as it goes (build
             67's puffs, eased up fast and brightest half way, were seen only 15 cm over their pieces: no smoke came OUT of
             anything) */
          frame(t, b, k, agit, lv) {
            pts.visible = k > 0.002; if (!pts.visible) return;
            /* (its lean over its whole rise: the emitter's own along x, or `lv` where the caller leans it: R92's toward him) */
            const lx = lv ? lv.x : o.lean, lz = lv ? lv.z : 0;
            for (let i = 0; i < NP; i++) { const q = P[i], a = ((t / q.life + q.ph) % 1 + 1) % 1, up = a;
              const amp = (o.sway + 0.03 * a) * (1 + 1.6 * agit), w = t * o.wob;
              pos[i * 3] = b.x + Math.sin(w + q.sw) * amp + lx * up; pos[i * 3 + 1] = b.y + q.h * up; pos[i * 3 + 2] = b.z + Math.cos(w * 0.8 + q.sw2) * amp * 0.7 + lz * up;
              siz[i] = q.s1 * (0.5 + 1.1 * a); alp[i] = o.alpha * k * Math.min(1, a / 0.04) * Math.pow(1 - a, 1.1) * (1 + 0.5 * agit); rot[i] = q.rr + a * o.turn; }
            const A = g.attributes; A.position.needsUpdate = true; A.aS.needsUpdate = true; A.aA.needsUpdate = true; A.aR.needsUpdate = true; }
        };
      };
      /* (a thin column, photographed on a phone on build 66: puffs of 8.5 to 9.5 cm read as two large soft blobs over his
         teacher's robe; now 2 to 7 cm, more of them. Build 68's, faint at 0.36 to 0.4 and thinning fast, hardly showed in
         a phone's picture: brighter now, densest where it leaves the piece, under the look's own mark) */
      const S = { angry: mk(0xff2c1e, 28771, { life: 1.8, rise: 0.20, sway: 0.007, wob: 5.5, lean: 0.0, size: 0.042, alpha: 0.75, turn: 2.4 }),
                  hungry: mk(0x84ff42, 28772, { life: 2.8, rise: 0.24, sway: 0.006, wob: 1.6, lean: -0.05, size: 0.048, alpha: 0.7, turn: 1.2 }),
                  /* (R92: the one looking for energy, pale and slow, its lean given by the caller: toward him) */
                  energy: mk(0xe4ecff, 28773, { life: 2.6, rise: 0.20, sway: 0.006, wob: 1.2, lean: 0.0, size: 0.045, alpha: 0.6, turn: 0.9 }) };
      /* WHERE EACH RISES FROM: the top of its own piece, wherever the piece is (laid out, pushed across, set in the rite),
         its height over its foot measured once from its drawn meshes when they have landed (4 cm until then); without the
         piece, under the presence's own place over it */
      const off = { angry: -0.02, hungry: 0.03, energy: -0.10 }, PIECE = { angry: 'w5wuathanu', hungry: 'w5rakyom', energy: 'w5hunphayon' }, top = {};
      const _bx = new THREE.Box3(), _bm = new THREE.Box3(), _wp = new THREE.Vector3(), _b = { x: 0, y: 0, z: 0 };
      const topOf = (k, o) => {
        if (top[k] != null) return top[k];
        o.updateWorldMatrix(true, true); _bx.makeEmpty();
        o.traverse(m => { if (!m.isMesh || !m.visible || !m.geometry) return; if (!m.geometry.boundingBox) m.geometry.computeBoundingBox();
          _bm.copy(m.geometry.boundingBox).applyMatrix4(m.matrixWorld); _bx.union(_bm); });
        if (_bx.isEmpty()) return 0.04;
        const h = _bx.max.y - o.getWorldPosition(_wp).y; if (h > 0.005 && h < 0.4) { top[k] = h; return h; } return 0.04; };
      return { S, frame(k, t, gp, strength, agit, lv) { const e = S[k]; if (!e) return; const o = things[PIECE[k]];
                 if (o) { const h = topOf(k, o); o.getWorldPosition(_wp); _b.x = _wp.x; _b.y = _wp.y + h - 0.004; _b.z = _wp.z; }
                 else { _b.x = gp.x; _b.y = gp.y + off[k]; _b.z = gp.z; }
                 e.frame(t, _b, strength, agit || 0, lv); },
               off() { for (const k in S) S[k].pts.visible = false; } };
    })();
    const _lv5 = { x: 0, z: 0 };                     // (R92: the pale smoke's lean toward him)
    function presTick(wdt) {
      if (getState() === 'cine') return;                      // (a film directs them itself: the rite's endings)
      const on = phase === 'table' || phase === 'ask';
      for (const k in pres) pres[k].grp.visible = on;
      if (!on) { SMOKE5.off(); return; }
      const t = wallClock.t;
      /* (R90: the smoke off each piece, from where its presence sits at home: not the knot's shaking place) */
      SMOKE5.frame('angry', t, pres.angry.home, 1, pres.angry.flinch); SMOKE5.frame('hungry', t, pres.hungry.home, 1, 0);
      const A = pres.angry; A.flinch = Math.max(0, A.flinch - wdt * 1.6);
      const j = 0.006 + 0.02 * A.flinch;
      A.grp.position.set(A.home.x + Math.sin(t * 23) * j, A.home.y + Math.sin(t * 17 + 1) * j - 0.02 * A.flinch, A.home.z + Math.cos(t * 19) * j);
      A.grp.rotation.set(t * 0.7, t * 1.3, Math.sin(t * 3) * 0.4); A.grp.scale.setScalar(1 - 0.25 * A.flinch);
      const H = pres.hungry; H.grp.rotation.y = 0.15 * Math.sin(t * 0.8); H.grp.rotation.z = 0.1 * Math.sin(t * 1.1 + 0.5);
      /* the one looking for energy drifts toward the nearest warmth: him, and nearer the more he leans in */
      const E = pres.energy; camera.getWorldPosition(_pv5);
      const to = _pw5.set(_pv5.x - E.home.x, _pv5.y - E.home.y, _pv5.z - E.home.z), L = to.length() || 1, k = Math.min(0.16, 0.42 / Math.max(0.5, L)) * 0.6;
      E.grp.position.set(E.home.x + to.x / L * k + Math.sin(t * 0.9) * 0.01, E.home.y + to.y / L * k * 0.5 + Math.sin(t * 1.3) * 0.012, E.home.z + to.z / L * k);
      /* (R92: its smoke leans toward him over its rise, further the nearer he leans in: 6.7 cm from his seat, 10 at most) */
      const hl = Math.hypot(to.x, to.z) || 1, lean = Math.min(0.10, 0.06 / Math.max(0.4, L));
      _lv5.x = to.x / hl * lean; _lv5.z = to.z / hl * lean;
      SMOKE5.frame('energy', t, E.home, 1, 0, _lv5);
    }
    /* each presence's own place on the screen, for its mark and its tap */
    const presAt = (k) => () => { const g = pres[k].grp.position; return { x: g.x, y: g.y, z: g.z }; };

    /* ================================================================ WHO STANDS WHERE IN THE PLAY'S PHASES (each change
       made as a phase begins, under the film or the curtain that hands to it: v24.12). Grandmaster Pho stands for the
       walkway and the hunt and sits for the table; Ton is with him until the table; the nine stand in the court from the
       hunt on (the fight's own from its brief) */
    let castPhaseNow = null;
    function castPhase(p) {
      castPhaseNow = p;
      const st = STATION[p] || STATION.walk, pho = castOf('pho'), phoS = castOf('phoS'), ton = castOf('ton'), col = castOf('col');
      const show = (P, on, at) => { if (!P) return; if (at) put(P, at.x, at.z, at.ry, at.y != null ? at.y : undefined);
        if (on) { if (P.ready) P.group.visible = true; else whenReady(P, (Q) => { Q.group.visible = true; }); } else P.group.visible = false;
        if (on) { rest(P, 0); gaze(P, null); P.rate = 1; } };
      if (p === 'walk' || p === 'hunt') { show(pho, true, st.pho); show(ton, true, st.ton); show(phoS, false); show(col, false); }
      /* case three: his teacher cross-legged on his cushion, the collector seated at the table's west end (c_cast.js casts
         each seated on his own body: put back at his home, at his rest) */
      else if (p === 'table' || p === 'ask') { show(pho, false); show(ton, false); show(phoS, true, phoS && phoS.home); show(col, true, col && col.home);
        PIECES5.set(true); }                                   // (his pieces laid out on the cloth: the film in lays them there, c_yfilm.js)
      /* (the nine stand in the court for the hunt; the fight places its own; in every other phase of the play they are put
         away, so nothing a fight left stands there on a Continue or a phase set: clipscan found them by the door at the table) */
      if (p === 'hunt') nineStand(true); else { nineOn = false; if (p !== 'fight') PRAI5.home(p); }
      if (p === 'walk') walkersInit(); else walkers.list = [];
      /* the things they carry, as the film that hands to each phase leaves them (c_yfilm.js endPhase5), so a Continue lands
         on what play shows (v22.2: after a Continue Ton had no staff and Jun no bag): Ton's wrapped staff on the walkway and
         in the hunt, Jun's duffel on the walkway, both put away from the fight on (the fight's stick is the fight's: fightOpen) */
      if (p === 'walk' || p === 'hunt') { STICK5.to('tonWrap'); DUFFEL5.to(p === 'walk' ? 'jun' : 'away'); }
      else { DUFFEL5.to('away'); if (p !== 'fight') STICK5.to('away'); }
      carryNow(true);
    }
    /* THE THINGS THEY CARRY IN PLAY (4.0: Ton with the long thing wrapped in cloth, Jun with the duffel), in the carrier's
       hand every frame of the walkway and the hunt, by the films' own hold (c_cast.js STICK5.carry, c_yfilm.js DUFFEL5.carry):
       only the films carried them, so in play they hung where the opening left them while their carriers walked on (the
       build's clipscan: "Jun's duffel through his body in the walk"). Drawn only while its carrier is, never where he is not.
       Each hold is made ONCE from its carrier's standing rest (handHold5), a measure that leaves his pose as the mixer
       writes it; `made` lays only a hold already made (after the people's tick, whose own laying the measure would undo for
       the frame), and a hold not yet made (a Continue, with no film before it) is made at the frame's start, carryPrime */
    function carryNow(made) {
      if (phase !== 'walk' && phase !== 'hunt') return;
      const one = (g, held, P, has, fn) => { if (!g || !held) return;
        if (P && P.ready && P.group.visible && (has || !made)) fn(P); else g.visible = false; };
      one(things.staffWrap, STICK5.who === 'tonWrap', castOf('ton'), !!STICK5.wrapOff, (P) => STICK5.carry(P));
      one(things.duffel, DUFFEL5.who === 'jun', castOf('jun'), !!DUFFEL5.off, (P) => DUFFEL5.carry(P));
    }
    /* (d_play.js: carryPrime before the people's tick, carryTick after the play's frame and the settle that may move a body
       in it, c_nav.js's wrap of playFrame; a film carries them itself) */
    function carryPrime(st) {
      if (st !== 'cine' && ((STICK5.who === 'tonWrap' && !STICK5.wrapOff) || (DUFFEL5.who === 'jun' && !DUFFEL5.off))) carryNow(false);
    }
    function carryTick(st) { if (st !== 'cine') carryNow(true); }
    /* his teacher, quietly, already beside him (4.3: "Nine Prai."): a step behind his shoulder, out of the picture, where
       the court has room (a change made where no shot sees it: v24.12) */
    function phoBeside() {
      const P = castOf('pho'); if (!P) return;
      const ry = yaw.rotation.y, fx = -Math.sin(ry), fz = -Math.cos(ry);           // (a turn of 0 looks toward -z)
      for (const side of [1, -1]) {
        const x = myX() + fx * -0.45 + fz * 1.05 * side, z = myZ() + fz * -0.45 - fx * 1.05 * side;
        if (inCourt(x, z, -0.3)) { put(P, x, z, faceTo(x, z, x + fx, z + fz)); return; }
      }
    }

    /* ================================================================ THE PLAY'S FRAME and its reset (d_play.js calls
       both) */
    function playFrame(wdt, st) {
      threadsFrame(wdt, st);
      bedsTick(wdt, st);
      presTick(wdt);
      stainsTick(st);
      if (nineOn && st !== 'cine') PRAI5.tick(wdt);
      if (st !== 'play') return;
      smellTick(wdt);
      walkersTick(wdt);
      strainTick(wdt);
      urgeTick();
      ambTick5();
    }
    function playReset() {
      smell.t = -1; smell.presses = 0; smell.shown = false; smell.pulse = false; smell.waitDrawn = -1;
      threads.length = 0; thMesh.visible = false;
      walkers.list = []; urgeNow = null;
      Object.assign(sight, { heat: 0, was: false, shutPeak: 0, topArmed: true, restSaid: true, step: -1 });
      stains5.grp.visible = false; nineOn = false; castPhaseNow = null;
      pres.angry.flinch = 0;
      soundReset5();
    }
