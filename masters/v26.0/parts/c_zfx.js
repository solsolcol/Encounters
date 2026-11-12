    /* ================================================================ WHAT THE PLAY MOVES, AND ITS EFFECTS (the plan's §3.7)
       His bai sri (one thing all day: on Ton's table, in Ton's hands, in his own, on the mat before him, beside him on
       the carpet the next morning); the young man's; the place to kneel; a handful of petals thrown; the gold that is
       Grandmaster Pho's alone; the morning's ground mist. Everything here is built hidden, so the curtain warms it
       (v14.15), and every motion is a function of a clock it is handed (wall time in play, the film's in a film). */

    /* ---- THE BAI SRI. In the world it is the model at the size the tables wear it. IN HIS HANDS it is drawn in the
       hands' own pass, where a thing 51 cm tall at a carrying distance would fill a phone from edge to edge: it is drawn
       at BAI.hand of the model, which on a phone's frame is what a thing that size looks like held before the chest.
       HIS HANDS ARE UNDER THE FRAME'S FOOT, as they are in the photograph of one held up (7: the hands at its bowl, the
       picture cut at the wrists) and as his own would be to his own eyes (a bowl raised before the face hides the
       hands that hold it). Six ways of drawing two hands on its bowl were photographed on a phone and a desktop and
       refused: the rig's fingers cannot wrap a bowl, and an arm that points at the lens fills the screen. Chad's own
       ruling for a thing a hand cannot be made to grip is the same (v23.0: "just have the bottle animate itself"). So:
       carried, only the top of its cone stands in the frame's foot; raised, its ring of marigolds and the rim of its
       bowl. One size wherever one shot follows another is kept by never showing the two in one picture: it goes down
       under the frame's foot, and stands on the mat on the next look (v25.4).
       Each place is where its BASE stands in the hands' own frame (metres: +x right, +y up, -z ahead). */
    const BAI = { s: 0.85, hand: 0.55, yaw: 0.5, carry: [0, -0.4, -0.46], raise: [0, -0.305, -0.49], high: [0, -0.262, -0.4], down: [0, -0.62, -0.46] };
    const TON_BAI = stageList.tonBai;                                              // its place on Ton's table (b_world2.js keeps the corner by Ton free for it)
    const myBai = stand('w3baisri', TON_BAI.x, TON_BAI.y, TON_BAI.z, TON_BAI.ry, { s: BAI.s, moves: true });
    const ymBai = stand('w3baisri', 0, 0, 0, 0.6, { s: BAI.s, moves: true }); ymBai.visible = false;
    /* WHAT THOSE WHO WAIT HAVE BROUGHT (endings B and C): a small bai sri on its brass tray each, carried in both hands.
       The tray's foot is 0.19 m in radius as the model is made (tools/probes/bands.mjs), drawn here at WAIT_TRAY.s */
    const WAIT_TRAY = { s: 0.8, r: 0.19 * 0.8 };
    const waitBai = [0, 1, 2, 3].map(() => { const g = stand('w3smallbaisri', 0, 0, 0, 0, { s: WAIT_TRAY.s, moves: true }); g.visible = false; return g; });
    const handBaiHolder = new THREE.Group();                                       // (never in a scene: where the hands' copy waits when nobody holds it)
    const handBai = stand('w3baisri', 0, 0, 0, 0, { s: BAI.hand, near: true, parent: handBaiHolder });
    const baiPut = (g, x, y, z, ry) => { g.position.set(x, y, z); if (ry != null) g.rotation.y = ry; g.visible = true; };
    /* a bai sri stood on a person's two hands (the bowl's foot between the palms): where the hands are this frame */
    const _bhm = new THREE.Vector3();
    function baiOnHands(g, P, dy = -0.04) { const m = handsMid(P, _bhm); if (!m) return false; g.position.set(m.x, m.y + dy, m.z); g.visible = true; return true; }

    /* ---- THE PLACE TO KNEEL: a soft ring on the ground, breathing (white: gold is one man's) */
    const zone = (() => {
      const g = new THREE.Group(); g.visible = false; world.add(g);
      const flatM = (geo, o) => { const m = new THREE.Mesh(geo, B(Object.assign({ color: 0xffffff, transparent: true, depthWrite: false, fog: false, side: THREE.DoubleSide }, o))); m.rotation.x = -Math.PI / 2; m.renderOrder = 3; g.add(m); return m; };
      const disc = flatM(new THREE.CircleGeometry(0.4, 32), { opacity: 0.18 });
      const ring = flatM(new THREE.RingGeometry(0.36, 0.43, 40), { opacity: 0.85 }); ring.position.y = 0.003;
      const wave = flatM(new THREE.RingGeometry(0.38, 0.43, 40), { opacity: 0.7 }); wave.position.y = 0.005;
      return { g, disc, ring, wave };
    })();
    function zoneAt(p) { if (!p) { zone.g.visible = false; return; } zone.g.position.set(p.x, 0.03, p.z); zone.g.visible = true; }
    function zoneTick(now) {
      if (!zone.g.visible) return;
      const k = (now % 2) / 2;
      zone.wave.scale.setScalar(1 + k * 0.9); zone.wave.material.opacity = 0.7 * (1 - k);
      zone.ring.material.opacity = 0.62 + 0.26 * Math.sin(now * 3.1); zone.disc.material.opacity = 0.15 + 0.07 * Math.sin(now * 3.1);
    }

    /* ---- A HANDFUL OF PETALS, THROWN. One small cluster of petals drawn many times (the ground's own petal and its
       material, so no new program is compiled on screen: v15.1). Each rises from the hand, is slowed by the air, and
       flutters down to where it will lie; where it is at any age is a pure function of that age, so a film can slow a
       throw or seek through it, and play runs it on the wall clock. When it has all landed it lies there until the
       ground is reset or the day changes. */
    /* (a petal in the AIR is one petal, at its real size: the ground's cluster of sixteen, thrown past a close lens,
       was a bunch of yellow blades a hand long: photographed in the film of the festival, and refused) */
    const petalAirMat = M({ color: 0xffffff, roughness: 0.75, alphaTest: 0.45, side: THREE.DoubleSide, map: tex(makePetal(THREE, cnv)) });
    const BURSTS = 4, BURST_N = LOW ? 110 : 170;
    const bursts = [];
    { const g0 = new THREE.PlaneGeometry(1, 1);
      for (let b = 0; b < BURSTS; b++) { const im = new THREE.InstancedMesh(g0, petalAirMat, BURST_N); im.frustumCulled = false; im.visible = false; im.count = BURST_N;
        const col = new THREE.Color(); for (let i = 0; i < BURST_N; i++) { im.setMatrixAt(i, _wm.makeScale(0, 0, 0)); im.setColorAt(i, col.setRGB(1, 1, 1)); }
        im.instanceMatrix.needsUpdate = true; im.instanceColor.needsUpdate = true; world.add(im); owned.push(im);
        bursts.push({ im, on: false, t0: 0, P: [], end: 0 }); } }
    const _ptq = new THREE.Quaternion(), _pte = new THREE.Euler(), _ptp = new THREE.Vector3(), _pts = new THREE.Vector3(), _ptq2 = new THREE.Quaternion();
    const FLAT_Q = new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI / 2, 0, 0));
    let burstNext = 0;
    /* thrown from `from` [x, y, z] so that it falls round `to` [x, z] (`r`: how wide it lands; `s`: a petal's length, 3.4 cm
       unless said: a little over life, so a throw reads across the turf; a close lens asks for less); t0 on the clock it is run on.
       `n`: how many petals of the handful there are (a child's is a third of a master's); the rest of the mesh's copies are
       never shown. Unsaid, every copy is thrown and each lands where it always did */
    function petalBurst(from, to, t0, o = {}) {
      const Bu = bursts[burstNext++ % BURSTS], rnd = rng(o.seed || (7001 + burstNext * 131)), r = o.r != null ? o.r : 0.55, yg = o.ground != null ? o.ground : 0.014, col = new THREE.Color();
      const nShown = o.n != null ? Math.min(BURST_N, o.n) : BURST_N;
      Bu.P.length = 0; Bu.t0 = t0; Bu.on = true; Bu.end = 0; Bu.im.visible = true;
      for (let i = 0; i < BURST_N; i++) {
        if (i >= nShown) { Bu.P.push({ late: Infinity, land: 0 }); continue; }
        const an = rnd() * 6.283, d = r * Math.sqrt(rnd()), tx = to[0] + Math.cos(an) * d, tz = to[1] + Math.sin(an) * d;
        const p = { x0: from[0] + (rnd() - 0.5) * 0.08, y0: from[1] + (rnd() - 0.5) * 0.06, z0: from[2] + (rnd() - 0.5) * 0.08, tx, tz,
                    vy: (o.up != null ? o.up : 1.9) * (0.55 + rnd() * 0.9), vt: 0.75 + rnd() * 0.75, th: 0.42 + rnd() * 0.3, ty: 0.3 + rnd() * 0.12,
                    wob: 0.05 + rnd() * 0.08, wf: 2.2 + rnd() * 2.6, wp: rnd() * 6.283, sx: 1.6 + rnd() * 3.4, sz: 1.4 + rnd() * 3.2, ry: rnd() * 6.283,
                    s: (o.s != null ? o.s : 0.034) * (0.75 + rnd() * 0.6), late: rnd() * 0.22, land: 0, yg: yg + rnd() * 0.01 };
        /* when it lands: the age at which its height meets the ground (it only falls after its apex: bisected) */
        const yAt = (a) => p.y0 + p.vy * p.ty * (1 - Math.exp(-a / p.ty)) - p.vt * (a - p.ty * (1 - Math.exp(-a / p.ty)));
        let lo = 0, hi = 12; for (let k = 0; k < 22; k++) { const m = (lo + hi) / 2; if (yAt(m) > p.yg) lo = m; else hi = m; }
        p.land = hi; Bu.end = Math.max(Bu.end, hi + p.late + 0.4);
        Bu.P.push(p);
        Bu.im.setColorAt(i, col.setHSL(0.105 + rnd() * 0.04, 0.98, 0.5 + rnd() * 0.07, THREE.SRGBColorSpace));
      }
      Bu.im.instanceColor.needsUpdate = true;
      burstAt(Bu, t0);
      return Bu;
    }
    function burstAt(Bu, t) {
      if (!Bu.on) return;
      const age0 = t - Bu.t0;
      for (let i = 0; i < Bu.P.length; i++) { const p = Bu.P[i], a = Math.max(0, age0 - p.late), al = Math.min(a, p.land), kh = 1 - Math.exp(-al / p.th), ky = 1 - Math.exp(-al / p.ty);
        if (age0 < p.late) { Bu.im.setMatrixAt(i, _wm.makeScale(0, 0, 0)); continue; }
        const fl = c01((a - p.land) / 0.25 + 1) * (a >= p.land ? 1 : 0), air = a < p.land ? 1 : 0;
        const x = p.x0 + (p.tx - p.x0) * kh + Math.sin(al * p.wf + p.wp) * p.wob * air * kh, z = p.z0 + (p.tz - p.z0) * kh + Math.cos(al * p.wf * 0.8 + p.wp) * p.wob * air * kh;
        const y = a >= p.land ? p.yg : Math.max(p.yg, p.y0 + p.vy * p.ty * ky - p.vt * (al - p.ty * ky));
        _pte.set(al * p.sx, p.ry + al * 0.9, al * p.sz, 'YXZ'); _ptq.setFromEuler(_pte);
        if (a >= p.land) { _pte.set(-Math.PI / 2, 0, p.ry, 'YXZ'); _ptq2.setFromEuler(_pte); _ptq.slerp(_ptq2, smo(c01((a - p.land) / 0.18))); }
        Bu.im.setMatrixAt(i, _wm.compose(_ptp.set(x, y, z), _ptq, _pts.set(p.s, p.s, p.s))); }
      Bu.im.instanceMatrix.needsUpdate = true;
    }
    /* play's own clock runs them (a film calls burstAt with its own); one that has all landed is drawn once more and left */
    function burstsTick(t) { for (const Bu of bursts) { if (!Bu.on || Bu.film) continue; burstAt(Bu, t); if (t - Bu.t0 > Bu.end) Bu.on = false; } }
    function burstsClear() { for (const Bu of bursts) { Bu.on = false; Bu.film = false; Bu.im.visible = false; } }

    /* ---- THE GOLD (the plan's §3.4: his alone; chapter 2 kept its colours and strengths for him, CLAUDE.md). Painted
       light, never a lamp (v15.1): a soft light the shape of a man sitting, behind him, in two layers (the colour laid
       on as a colour and the glow added over it: added alone over a pale ground a colour sums to white, v8.8); a fan
       of rays turning slowly behind that; a pool of it on the carpet with one slow ring; and motes rising round him,
       behind him where they would cross his body. It breathes once in five seconds. `auraAt(k, t)`: its strength and
       the clock it is run on. */
    const AURA = { hue: 0xf0a41c, glow: 0xffc65a, mote: 0xffdc8c, motes: 64 };
    const AURA_K = { shade: 0.5, hue: 0.78, glow: 0.55, rays: 0.5, pool: 0.5, ring: 0.26, mote: 1 };
    const aura = (() => {
      const g = new THREE.Group(); g.position.set(PHO_AT[0], 0, PHO_AT[1]); g.rotation.y = BENCH.ry; g.visible = false; world.add(g);
      const tBody = tex(makeAuraBody(THREE, cnv)), tRays = tex(makeAuraRays(THREE, cnv)), tDot = tex(makeGlow(THREE, cnv)), tRing = tex(makeAuraRing(THREE, cnv));
      const sprite = (map, blending, w, h, y, z, order) => {
        const m = new THREE.SpriteMaterial({ map, transparent: true, opacity: 0, depthWrite: false, fog: false, blending }); mats.push(m);
        const s = new THREE.Sprite(m); s.scale.set(w, h, 1); s.position.set(0, y, z); s.renderOrder = order; g.add(s); return s;
      };
      /* behind them all a soft dark, because light is only seen against less light (v25.5) */
      const shade = sprite(tDot, THREE.NormalBlending, 4.6, 3.8, 1.25, -0.62, 0); shade.material.color.setHex(0x0b0906);
      const hue = sprite(tBody, THREE.NormalBlending, 2.1, 2.3, 1.18, -0.4, 1);
      const rays = sprite(tRays, THREE.AdditiveBlending, 3.0, 3.0, 1.28, -0.46, 2);
      const glow = sprite(tBody, THREE.AdditiveBlending, 1.8, 2.0, 1.05, -0.36, 3);
      const flat = (map, size, y) => { const m = B({ map, transparent: true, opacity: 0, depthWrite: false, fog: false, blending: THREE.AdditiveBlending });
        const o = new THREE.Mesh(new THREE.PlaneGeometry(size, size), m); o.rotation.x = -Math.PI / 2; o.position.set(0, y, 0.5); o.renderOrder = 3; g.add(o); return o; };
      const pool = flat(tDot, 3.2, 0.024), ring = flat(tRing, 1, 0.027);
      const N = AURA.motes, r = rng(9157), seed = [];
      for (let i = 0; i < N; i++) seed.push({ a: r() * 6.283, rad: 0.4 + r() * 0.7, T: 4.4 + r() * 3.6, ph: r(), sw: 0.4 + r() * 0.8, top: 1.5 + r() * 0.8 });
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(N * 3), 3)); geo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(N * 3), 3));
      const pm = new THREE.PointsMaterial({ map: tDot, size: 0.055, sizeAttenuation: true, transparent: true, depthWrite: false, fog: false, blending: THREE.AdditiveBlending, vertexColors: true }); mats.push(pm);
      const pts = new THREE.Points(geo, pm); pts.frustumCulled = false; pts.renderOrder = 4; g.add(pts); owned.push(pts);
      return { g, shade, hue, rays, glow, pool, ring, pts, seed, tm: new THREE.Color() };
    })();
    let auraK = 0;
    function auraAt(k, t) {
      const A = aura; auraK = k;
      A.g.visible = k > 0.002; if (!A.g.visible) return;
      const br = 0.86 + 0.14 * Math.sin(t * 2 * Math.PI / 5.2);
      A.shade.material.opacity = AURA_K.shade * k;
      A.hue.material.color.setHex(AURA.hue); A.hue.material.opacity = AURA_K.hue * k * br;
      A.glow.material.color.setHex(AURA.glow); A.glow.material.opacity = AURA_K.glow * k * (1.1 - 0.2 * br);
      A.rays.material.color.setHex(AURA.glow); A.rays.material.opacity = AURA_K.rays * k * br; A.rays.material.rotation = t * 0.06;
      A.pool.material.color.setHex(AURA.hue); A.pool.material.opacity = AURA_K.pool * k * br;
      { const u = (((t / 5.2) % 1) + 1) % 1, d = 1.5 + 1.3 * u; A.ring.scale.set(d, d, 1); A.ring.material.color.setHex(AURA.glow); A.ring.material.opacity = AURA_K.ring * k * Math.sin(Math.PI * u) * (1 - 0.5 * u); }
      const P = A.pts.geometry.attributes.position, V = A.pts.geometry.attributes.color; A.tm.setHex(AURA.mote);
      A.seed.forEach((s, i) => { const u = (((t / s.T + s.ph) % 1) + 1) % 1, a = s.a + s.sw * Math.sin(u * 4.4 + s.ph * 6.283), rr = s.rad * (1 - 0.3 * u);
        const mx = Math.cos(a) * rr, mz = Math.sin(a) * rr * 0.7;
        P.setXYZ(i, mx, 0.08 + s.top * u, mz > -0.05 && Math.abs(mx) < 0.55 ? -mz - 0.3 : mz - 0.1);     // (one that would rise before his body goes behind it: a mote on a face is a speck on a lip, v25.5)
        const al = AURA_K.mote * k * Math.pow(Math.sin(Math.PI * u), 1.4) * (0.55 + 0.45 * Math.sin(t * 3.1 + s.ph * 40));
        V.setXYZ(i, A.tm.r * al, A.tm.g * al, A.tm.b * al); });
      P.needsUpdate = true; V.needsUpdate = true;
    }

    /* ---- THE MORNING'S MIST (day two): a few wide soft sheets low over the turf, drifting; they thin as the light opens */
    const mist = (() => {
      const g = new THREE.Group(); dayTwo.add(g);
      const t0 = tex(makeGlow(THREE, cnv)), rnd = rng(6611), list = [];
      /* (seeded places over the turf, and eight said ones where the morning is looked at: before the chief bench, across
         the middle, by the west tents. The first fourteen were all seeded, faint, and none stood in the picture play
         begins the morning on: photographed three times, and not there) */
      const at = [[4.2, 6.0], [7.6, 6.6], [1.2, 8.4], [-3.2, 4.8], [-6.5, 8.6], [0.4, 0.2], [5.4, 1.0], [-5.2, -3.0]];
      for (let i = 0; i < (LOW ? 6 : 10); i++) at.push([TURF.x0 + rnd() * (TURF.x1 - TURF.x0), TURF.z0 + 2 + rnd() * (TURF.z1 - TURF.z0 - 3)]);
      for (const [x, z] of at) {
        const m = new THREE.SpriteMaterial({ map: t0, color: 0xffeccc, transparent: true, opacity: 0, depthWrite: false, fog: false }); mats.push(m);
        const s = new THREE.Sprite(m);
        s.scale.set(9 + rnd() * 7, 1.2 + rnd() * 0.9, 1); s.position.set(x, 0.34 + rnd() * 0.26, z); s.renderOrder = 2; g.add(s);
        list.push({ s, x, z, a: 0.5 + rnd() * 0.25, v: (rnd() - 0.5) * 0.12, ph: rnd() * 6.283 });
      }
      return { g, list };
    })();
    let mistK = 1;
    function mistTick(t) {
      if (!dayTwo.visible) return;
      for (const m of mist.list) { m.s.position.x = m.x + Math.sin(t * 0.05 + m.ph) * 1.4 + m.v * ((t % 40) - 20); m.s.material.opacity = m.a * mistK * (0.8 + 0.2 * Math.sin(t * 0.21 + m.ph)); }
    }

    /* ---- THE NIGHT'S FLAMES (§4.2: "the candles on the offering tables burning low in the dark"). One flame drawn on
       the wick of every candle that stands on the tables (their tops are the tables' own list: b_world2.js), each
       with its own flicker and lean, turned to the lens, and a soft glow round it. The light they give is the look's
       own key (NIGHT: warm and low, from before the tables), never a lamp a flame (v15.1). Drawn only at night. */
    const flames = (() => {
      const L = stageList.flames || [], n = L.length;
      const gF = new THREE.PlaneGeometry(1, 1); gF.translate(0, 0.5, 0);           // (a flame stands on its wick)
      const mF = B({ map: tex(makeFlame(THREE, cnv)), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false, side: THREE.DoubleSide });
      const mG = B({ map: tex(makeGlow(THREE, cnv)), color: 0xff9a3c, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false, opacity: 0.6, side: THREE.DoubleSide });
      const imF = new THREE.InstancedMesh(gF, mF, Math.max(1, n)), imG = new THREE.InstancedMesh(new THREE.PlaneGeometry(1, 1), mG, Math.max(1, n));
      imF.frustumCulled = false; imG.frustumCulled = false; imF.renderOrder = 4; imG.renderOrder = 3; imF.count = n; imG.count = n;
      nightG.add(imG); nightG.add(imF); owned.push(imF); owned.push(imG);
      const rnd = rng(7733), seed = L.map(() => ({ ph: rnd() * 6.283, f: 7 + rnd() * 6, g: 1.3 + rnd() * 1.4 }));
      return { L, imF, imG, seed };
    })();
    const _flp = new THREE.Vector3(), _fls = new THREE.Vector3(), _flc = new THREE.Vector3();
    function flamesTick(t) {
      if (!nightG.visible || !flames.L.length) return;
      camera.getWorldPosition(_flc);
      flames.L.forEach((c, i) => { const sd = flames.seed[i], fl = 0.82 + 0.12 * Math.sin(t * sd.f + sd.ph) + 0.06 * Math.sin(t * sd.f * 2.7 + sd.ph * 3);
        const ry = Math.atan2(_flc.x - c.x, _flc.z - c.z);
        _pte.set(0, ry, 0.07 * Math.sin(t * sd.g + sd.ph), 'YXZ'); _ptq.setFromEuler(_pte);
        flames.imF.setMatrixAt(i, _wm.compose(_flp.set(c.x, c.y - 0.004, c.z), _ptq, _fls.set(0.04 * c.s * (1.1 - 0.12 * fl), 0.095 * c.s * fl, 1)));
        const gs = 0.56 * c.s * (0.88 + 0.22 * fl);
        _pte.set(0, ry, 0, 'YXZ'); _ptq.setFromEuler(_pte);
        flames.imG.setMatrixAt(i, _wm.compose(_flp.set(c.x, c.y + 0.045 * c.s, c.z), _ptq, _fls.set(gs, gs, 1))); });
      flames.imF.instanceMatrix.needsUpdate = true; flames.imG.instanceMatrix.needsUpdate = true;
    }

    /* ---- THE RENTED ROOM (§4.2: "his bai sri on the sill of a rented room, beside his bag"): a window, its sill and the
       wall round it, and nothing else of a room: a pocket set far past the far plane, so the ground and the room never
       see one another (v8.9: distance does the hiding). His bai sri and his bag (chapter 2's own: reuseInEpisode) are
       the real models. Outside it is the real sky (the stage moves the sky there for the shot: skyAt), dark ground, a
       rain tree and the line of trees, dark against it. */
    const ROOM = { x: 300, z: 300, sill: 0.94, wall: 300 - 1.7, w: 0.92, h: 1.25 };
    const roomG = new THREE.Group(); world.add(roomG);
    const room = { ring: null, ringMat: null, ground: null, sync: null, tree: [] };
    function buildRoom() {
      const X = ROOM.x, Zw = ROOM.wall, sl = ROOM.sill, top = sl + ROOM.h, hw = ROOM.w / 2;
      const mWall = M({ color: 0xcfc6b2, roughness: 0.96 }), mWood = M({ color: 0x5c3d27, roughness: 0.72 });
      /* (the ground outside is a shape, not a lit surface: nothing lights a field before dawn) */
      const mGround = B({ color: 0x070a07 }); room.ground = mGround;
      /* the wall round the opening (narrow enough that a phone's frame holds both its sides), and the reveal's wood */
      box(mWall, X - hw - 1.0, 1.5, Zw, 2.0, 3.0, 0.16); box(mWall, X + hw + 1.0, 1.5, Zw, 2.0, 3.0, 0.16);
      box(mWall, X, sl / 2, Zw, ROOM.w, sl, 0.16); box(mWall, X, (top + 3.0) / 2, Zw, ROOM.w, 3.0 - top, 0.16);
      box(mWood, X - hw - 0.02, sl + ROOM.h / 2, Zw, 0.05, ROOM.h, 0.2); box(mWood, X + hw + 0.02, sl + ROOM.h / 2, Zw, 0.05, ROOM.h, 0.2); box(mWood, X, top + 0.02, Zw, ROOM.w + 0.09, 0.05, 0.2);
      /* the sill: a deep board, proud of the wall on the room's side */
      box(mWood, X, sl - 0.025, Zw + 0.13, ROOM.w + 0.2, 0.05, 0.5);
      /* two shutters, folded back against the wall outside */
      for (const sx of [-1, 1]) box(mWood, X + sx * (hw + 0.3), sl + ROOM.h / 2, Zw - 0.11, 0.46, ROOM.h, 0.035);
      /* the dark ground outside */
      floor(mGround, X - 90, ROOM.z - 110, X + 90, Zw - 0.2, -0.3);
      flush(roomG);
      /* his bai sri at the sill's inner edge; his bag behind it and to its right, against the reveal */
      stand('w3baisri', X - 0.15, sl, Zw + 0.21, 0.6, { s: BAI.s, near: true, parent: roomG });
      stand('e4bag', X + 0.2, sl, Zw + 0.05, -0.3, { parent: roomG });
      /* (the tree outside is a shape against the sky until the light comes: its own paint is held down, and let up as
         the window pales) */
      room.tree = [];
      stand('e4raintree', X - 3.6, -0.3, Zw - 27, 1.2, { h: 10.5, lift: 1, parent: roomG, done: (m) => m.traverse(q => { if (q.isMesh) { q.material.color.setScalar(0.05); room.tree.push(q.material); } }) });
      /* the line of trees round it: the ground's own ring again, low and far, its picture darkened to a shape against
         the sky (the ring's picture is laid on its material when it has loaded: this one takes it then) */
      if (stageList.ring) { const r0 = stageList.ring, mt = r0.material.clone(); mats.push(mt); mt.fog = false; mt.color.set(0x0b0f0b);
        const r2 = new THREE.Mesh(r0.geometry, mt); r2.scale.y = 0.5; r2.position.set(X, r0.position.y * 0.5 - 0.3, ROOM.z); r2.renderOrder = -5; roomG.add(r2); room.ring = r2; room.ringMat = mt;
        room.sync = () => { if (r0.material.map && mt.map !== r0.material.map) { mt.map = r0.material.map; mt.needsUpdate = true; } r2.visible = r0.visible; }; }
    }
    buildRoom();

    /* ---- THE ROLLED MATS (ending A: "New ones roll the mats, bro."): a stack by the west tents, one at each of the two
       who roll, the two on Ton's arms and the one the young man carries, and his own, carried in the hands' own pass
       and then laid on the stack. The model is one rolled reed mat, 1.2 m long along its own x, lying on the ground
       (made his way: a checked picture on white, then Meshy: masters/v26.0/make.sh) */
    const matsG = new THREE.Group(); world.add(matsG); matsG.visible = false;
    const MATS_AT = { x: -6.25, z: 1.9, ry: 0.32 };
    const rolled = { stack: [], own: null, ton: [], carry: null, rolls: [] };
    { const c = Math.cos(MATS_AT.ry), sn = Math.sin(MATS_AT.ry), rnd = rng(3391);
      const at = (dz, lvl, dx = 0) => { const lx = dx + (rnd() - 0.5) * 0.08; return stand('w3matroll', MATS_AT.x + lx * c + dz * sn, lvl * 0.128, MATS_AT.z - lx * sn + dz * c, MATS_AT.ry + (rnd() - 0.5) * 0.05, { parent: matsG }); };
      for (const [dz, lvl] of [[-0.16, 0], [0, 0], [0.16, 0], [-0.08, 1], [0.08, 1]]) rolled.stack.push(at(dz, lvl));
      rolled.own = at(0, 2); rolled.own.visible = false;                           // his own: the stack's top, once he has laid it there
      for (let i = 0; i < 2; i++) rolled.ton.push(stand('w3matroll', 0, 0, 0, 0, { parent: matsG, moves: true }));
      rolled.carry = stand('w3matroll', 0, 0, 0, 0, { parent: matsG, moves: true });
      for (let i = 0; i < 2; i++) rolled.rolls.push(stand('w3matroll', 0, 0, 0, 0, { parent: matsG, moves: true })); }
    const handMatHolder = new THREE.Group();
    const handMat = stand('w3matroll', 0, 0, 0, 0, { s: 0.8, near: true, parent: handMatHolder });
    /* a mat lying across a person's two forearms (`n`: the second lies on the first) */
    const _mtv = new THREE.Vector3();
    function matOnArms(g, P, n = 0) { const m = handsMid(P, _mtv); if (!m) return false; const ry = P.group.rotation.y;
      g.position.set(m.x - Math.sin(ry) * 0.13, m.y - 0.035 + n * 0.125, m.z - Math.cos(ry) * 0.13); g.rotation.set(0, ry + (n ? 0.07 : -0.04), 0); g.visible = true; return true; }

    /* ---- THE BULBS AT DUSK (ending B: "the bulbs under the shed's roof come on"): a string of bare bulbs along the eaves
       of the chief canopy and the three tents, each a small warm glow turned to the lens, and the pool of their light
       on the carpets before his bench. Painted light, never a lamp (v15.1). Drawn only at dusk. */
    const duskG = new THREE.Group(); world.add(duskG); duskG.visible = false;
    const bulbs = (() => {
      const L = [];
      const edge = (T0, w, e, ry, sides) => { const C = tentCorners(T0.x, T0.z, w, ry || 0);
        for (const k of sides) { const a = C[k], b = C[(k + 1) % 4], n = Math.max(2, Math.round(Math.hypot(b[0] - a[0], b[1] - a[1]) / 0.55));
          for (let i = 0; i <= n; i++) { const u = i / n, sag = Math.sin(Math.PI * ((u * 3) % 1)) * 0.05; L.push({ x: lp(a[0], b[0], u), y: e + 0.07 - sag, z: lp(a[1], b[1], u) }); } } };
      edge(CHIEF, CHIEF.w + 0.12, CHIEF.eave, CHIEF.ry, [0, 1, 2, 3]);
      for (const T0 of [TENT_W1, TENT_W2, TENT_E]) edge(T0, TENT.w + 0.12, TENT.eave, 0, [0, 1, 2, 3]);
      const n = L.length, mG = B({ map: tex(makeGlow(THREE, cnv)), color: 0xffb060, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false, side: THREE.DoubleSide });
      const im = new THREE.InstancedMesh(new THREE.PlaneGeometry(1, 1), mG, Math.max(1, n)); im.count = n; im.frustumCulled = false; im.renderOrder = 4; duskG.add(im); owned.push(im);
      /* the pool of their light: a soft warm disc on the ground under the chief canopy and before it */
      const mP = B({ map: mG.map, color: 0xffa050, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false, opacity: 0.3 });
      const g0 = new THREE.PlaneGeometry(1, 1); g0.rotateX(-Math.PI / 2);
      const [px, pz] = benchAt(0.2, 1.3), pool = new THREE.Mesh(g0, mP); pool.position.set(px, 0.022, pz); pool.scale.set(8.5, 1, 7); pool.renderOrder = 3; duskG.add(pool); owned.push(pool);
      const rnd = rng(8812), seed = L.map(() => rnd() * 6.283);
      return { L, im, seed };
    })();
    function bulbsTick(t) {
      if (!duskG.visible || !bulbs.L.length) return;
      camera.getWorldPosition(_flc);
      bulbs.L.forEach((c, i) => { const s = 0.3 * (0.94 + 0.06 * Math.sin(t * 2.3 + bulbs.seed[i]));
        _pte.set(0, Math.atan2(_flc.x - c.x, _flc.z - c.z), 0, 'YXZ'); _ptq.setFromEuler(_pte);
        bulbs.im.setMatrixAt(i, _wm.compose(_flp.set(c.x, c.y, c.z), _ptq, _fls.set(s, s, 1))); });
      bulbs.im.instanceMatrix.needsUpdate = true;
    }

    /* ---- HIS COUNTER AT NIGHT (the opening film, §4.0: "The laptop and notebook stand on a dark slice of his counter and
       nothing else of the shop is loaded"): a pocket set far past the far plane (v8.9), laid out as chapter 2's counter
       is (he sits on its -z side and looks +z): his laptop, its screen the forum's thread chapter 2 ended on (that
       chapter's own drawing and its own words, read from the chapter itself so the two can never differ); his notebook,
       its next page; his bag; a folded white shirt. One lamp: the look's own key (COUNTER) and a pool of it painted on
       the glass. */
    /* (along the glass, from his right hand to his left: his laptop, square to him; his notebook; then what he takes, the
       folded shirt before his bag, one behind the other so a phone's frame holds both) */
    const DESK = { x: -300, z: 300, top: 0.92, lap: [-0.2, 0.0], book: [0.3, -0.02], shirt: [0.73, -0.14], bag: [0.74, 0.2] };
    const LAP_UV = [0.99236, 0.60901, 0.003275, 0.19951];                       // the screen's own island on the model's sheet (measured for chapter 2: its LAP.uv)
    const deskG = new THREE.Group(); world.add(deskG); deskG.visible = false;
    const desk = { lapX: null, lapT: null, lapM: null, lapG: null, lapSig: '', fit: null, pageX: null, pageT: null, page: null, pageSig: '', bag: null, shirt: null, book: null };
    function buildDesk() {
      const X = DESK.x, Z = DESK.z, top = DESK.top;
      const mTop = M({ color: 0x2a1c12, roughness: 0.42 }), mEdge = M({ color: 0x191009, roughness: 0.7 }), mWall = M({ color: 0x15100c, roughness: 1 });
      box(mTop, X, top - 0.02, Z, 2.6, 0.04, 0.95); box(mEdge, X, (top - 0.04) / 2, Z + 0.1, 2.6, top - 0.04, 0.7);
      wall(mWall, X + 4, Z + 2.2, X - 4, Z + 2.2, 0, 3.4);                       // the dark of the shop behind it
      flush(deskG);
      /* the lamp's pool on the glass */
      { const mP = B({ map: tex(makeGlow(THREE, cnv)), color: 0xffb870, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false, opacity: 0.22 });
        const g0 = new THREE.PlaneGeometry(1, 1); g0.rotateX(-Math.PI / 2); const pool = new THREE.Mesh(g0, mP); pool.position.set(X + 0.1, top + 0.002, Z - 0.02); pool.scale.set(2.2, 1, 1.3); pool.renderOrder = 3; deskG.add(pool); owned.push(pool); }
      /* HIS LAPTOP: the model's own screen takes a drawn sheet (always mapped; only its colour lights it: v15.1) */
      { const [c, x] = cnv(1024); c.height = 720; x.fillStyle = '#000'; x.fillRect(0, 0, 1024, 720);
        const t = tex(new THREE.CanvasTexture(c)); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; t.repeat.set(LAP_UV[0], LAP_UV[1]); t.offset.set(LAP_UV[2], LAP_UV[3]);
        desk.lapX = x; desk.lapT = t; desk.lapM = B({ color: 0x050608, map: t });
        if (have('filmlaptop')) parseOnce('filmlaptop').then(({ scene: src }) => { if (!alive) return;
          const g = src.clone(true); g.position.set(X + DESK.lap[0], top, Z + DESK.lap[1]); g.rotation.y = -Math.PI / 2;
          g.traverse(o => { if (!o.isMesh) return; o.castShadow = false; const m = o.material; o.material = (m && m.name === 'screen') ? desk.lapM : m.clone(); if (o.material !== desk.lapM) mats.push(o.material); });
          deskG.add(g); desk.lapG = g; }).catch(err => { console.warn('filmlaptop failed to load', err); if (ctx.loadFail) ctx.loadFail('filmlaptop', err); });
        else waiting.add('filmlaptop'); }
      /* HIS NOTEBOOK, open, and its page: a drawn sheet laid ON the model's own pages (they bow up from the spine: a
         grid each of whose points is dropped onto the page under it, chapter 2's way) */
      { const bk = new THREE.Group(); bk.position.set(X + DESK.book[0], top, Z + DESK.book[1]); bk.rotation.y = 0.05; deskG.add(bk); desk.book = bk;
        const [c, x] = cnv(1024); c.height = 640; const t = tex(new THREE.CanvasTexture(c)); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
        const pg = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.28), M({ map: t, roughness: 0.85 })); pg.rotation.set(-Math.PI / 2, 0, Math.PI); pg.position.y = 0.0135; pg.visible = false; bk.add(pg); owned.push(pg);
        desk.pageX = x; desk.pageT = t; desk.page = pg;
        if (have('e4notebook')) parseOnce('e4notebook').then(({ scene: src }) => { if (!alive) return;
          const m = src.clone(true); m.rotation.set(0, Math.PI, 0); m.updateMatrixWorld(true);
          const bb = new THREE.Box3().setFromObject(m), sz = bb.getSize(new THREE.Vector3()); m.scale.setScalar(0.46 / sz.x); m.updateMatrixWorld(true); bb.setFromObject(m);
          m.position.set(-(bb.min.x + bb.max.x) / 2, -bb.min.y, -(bb.min.z + bb.max.z) / 2); m.traverse(o => { if (o.isMesh) o.castShadow = false; });
          bk.add(m); bk.updateWorldMatrix(true, true);
          const g = new THREE.PlaneGeometry(0.42, 0.28, 48, 8), pos = g.attributes.position, rc = new THREE.Raycaster(), meshes = []; m.traverse(q => { if (q.isMesh) meshes.push(q); });
          const o = new THREE.Vector3(), dn = new THREE.Vector3(0, -1, 0);
          for (let i = 0; i < pos.count; i++) { o.set(-pos.getX(i), 0.3, pos.getY(i)); bk.localToWorld(o); rc.set(o, dn);      // (the plane's (x, y) is the book's (-x, z))
            const hit = rc.intersectObjects(meshes, false)[0]; pos.setZ(i, (hit ? bk.worldToLocal(hit.point).y : 0.04) + 0.0015 - pg.position.y); }
          g.computeVertexNormals(); pg.geometry.dispose(); pg.geometry = g; pg.visible = true;
        }).catch(err => { console.warn('e4notebook failed to load', err); if (ctx.loadFail) ctx.loadFail('e4notebook', err); });
        else waiting.add('e4notebook'); }
      /* what he takes: his bag, and a folded white shirt */
      desk.bag = stand('e4bag', X + DESK.bag[0], top, Z + DESK.bag[1], 0.2, { parent: deskG });
      /* (the shirt was modelled standing, as its picture showed it: laid on its back here, its collar away from him) */
      desk.shirt = stand('w3shirt', X + DESK.shirt[0], top, Z + DESK.shirt[1], Math.PI - 0.12, { parent: deskG, done: (m) => { m.rotation.x = -Math.PI / 2; m.position.set(0, 0.026, 0.156); } }); desk.shirt.visible = false;
    }
    buildDesk();
    /* a point of the laptop's screen in the room, by where it is drawn on the screen's sheet (px of 1024 x 720): the
       screen is a flat piece of the model, so its own points and their places on the sheet give the plane (a least
       squares fit of place = A [u, v, 1], solved once the model has landed: chapter 2's lapPoint) */
    const _dkv = new THREE.Vector3();
    function deskScreen(cx, cy) {
      if (!desk.fit) { const g = desk.lapG; if (!g) return null;
        let mesh = null; g.traverse(o => { if (o.isMesh && o.material === desk.lapM) mesh = o; });
        const P = mesh && mesh.geometry.attributes.position, U = mesh && mesh.geometry.attributes.uv; if (!P || !U) return null;
        const Sm = [0, 0, 0, 0, 0, 0, 0, 0, 0], Bm = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
        for (let i = 0; i < P.count; i++) { const a = [U.getX(i), U.getY(i), 1], q = [P.getX(i), P.getY(i), P.getZ(i)];
          for (let r = 0; r < 3; r++) { for (let c2 = 0; c2 < 3; c2++) Sm[r * 3 + c2] += a[r] * a[c2]; for (let k = 0; k < 3; k++) Bm[r][k] += a[r] * q[k]; } }
        const m3 = new THREE.Matrix3().set(Sm[0], Sm[1], Sm[2], Sm[3], Sm[4], Sm[5], Sm[6], Sm[7], Sm[8]);
        if (Math.abs(m3.determinant()) < 1e-14) return null;
        const e = m3.invert().elements;                                         // (column-major: row r of column c at e[c * 3 + r])
        desk.fit = { mesh, X: [0, 1, 2].map(r => [0, 1, 2].map(k => e[r] * Bm[0][k] + e[3 + r] * Bm[1][k] + e[6 + r] * Bm[2][k])) }; }
      const u = (cx / 1024 - LAP_UV[2]) / LAP_UV[0], v = (1 - cy / 720 - LAP_UV[3]) / LAP_UV[1], Xf = desk.fit.X;
      desk.fit.mesh.updateWorldMatrix(true, false);
      desk.fit.mesh.localToWorld(_dkv.set(u * Xf[0][0] + v * Xf[1][0] + Xf[2][0], u * Xf[0][1] + v * Xf[1][1] + Xf[2][1], u * Xf[0][2] + v * Xf[1][2] + Xf[2][2]));
      return [_dkv.x, _dkv.y, _dkv.z];
    }
    /* a point of the notebook's page in the room, by where it is on the page's sheet (px of 1024 x 640) */
    function deskPage(cx, cy) { const pg = desk.page; if (!pg) return null; pg.updateWorldMatrix(true, false); pg.localToWorld(_dkv.set((cx / 1024 - 0.5) * 0.42, (0.5 - cy / 640) * 0.28, 0.012)); return [_dkv.x, _dkv.y, _dkv.z]; }
    /* THE SCREEN, drawn when what it shows changes: the thread chapter 2 ended on (its `post` page), and over its answer
       box what he has typed so far (n letters), the caret, and its button once it is sent; `on` 0 is a dark screen */
    function deskLap(on, n, caret, sent) {
      if (!desk.lapX) return;
      const sig = on ? [n, caret ? 1 : 0, sent ? 1 : 0].join('|') : 'off'; if (sig === desk.lapSig) return; desk.lapSig = sig;
      desk.lapM.color.setRGB(on ? 1 : 0.02, on ? 1 : 0.024, on ? 1 : 0.03);
      if (!on) return;
      const x = desk.lapX, C2 = (window.__CHAPTERS__ && window.__CHAPTERS__.e4c2) || {}, CW = FX1 - FX0;
      drawForum(x, { words: C2.words || {}, mode: 'post' });
      const rr = (px, py, w, h, r) => { x.beginPath(); x.moveTo(px + r, py); x.lineTo(px + w - r, py); x.quadraticCurveTo(px + w, py, px + w, py + r); x.lineTo(px + w, py + h - r);
        x.quadraticCurveTo(px + w, py + h, px + w - r, py + h); x.lineTo(px + r, py + h); x.quadraticCurveTo(px, py + h, px, py + h - r); x.lineTo(px, py + r); x.quadraticCurveTo(px, py, px + r, py); x.closePath(); };
      const F = (sz, w = '') => `${w} ${sz}px "Helvetica Neue", Helvetica, Arial, sans-serif`, txt = String(W.forumReply || '').slice(0, n);
      x.fillStyle = '#ffffff'; rr(FX0, 656, CW - 110, 40, 8); x.fill(); x.strokeStyle = sent ? '#d9e0e7' : '#7fa8d8'; x.lineWidth = 2; x.stroke();
      x.textAlign = 'left'; x.textBaseline = 'alphabetic';
      if (sent) { x.fillStyle = '#9aa6b2'; x.font = F(15); x.fillText('Write a reply…', FX0 + 16, 681);
        x.fillStyle = '#2f8a5a'; rr(FX1 - 98, 656, 98, 40, 8); x.fill(); x.fillStyle = '#ffffff'; x.font = F(15, 'bold'); x.textAlign = 'center'; x.fillText(W.forumSent || '', FX1 - 49, 681.5); x.textAlign = 'left';
        /* and his answer, the newest under the thread: over the count of replies */
        x.fillStyle = '#edf0f3'; x.fillRect(FX0, 484, 200, 20); x.fillStyle = '#6d7a88'; x.font = F(14, 'bold'); x.fillText('3 replies', FX0 + 4, 498); }
      else { x.fillStyle = '#1b2733'; x.font = F(21, 'bold'); x.fillText(txt + (caret ? '|' : ''), FX0 + 16, 683); }
      desk.lapT.needsUpdate = true;
    }
    /* THE PAGE, drawn when what it shows changes: his three questions in his own hand (art, not sheet strings: v14.5),
       each underlined by its k; `turn` 0 to 1 turns the leaf to a blank one */
    function deskLeaf(k1, k2, k3, turn) {
      if (!desk.pageX) return;
      const q = (v) => Math.round(c01(v) * 60), sig = [q(k1), q(k2), q(k3), q(turn)].join('|'); if (sig === desk.pageSig) return; desk.pageSig = sig;
      drawQuestions(desk.pageX, { k: [c01(k1), c01(k2), c01(k3)], turn: c01(turn) }); desk.pageT.needsUpdate = true;
    }

    /* ---- THE SANDALS LEFT AT THE TURF'S EDGE (the opening film: "green turf, yellow petals and rows of sandals"): Chad's
       own sandal (episode 3 chapter 1's: `reuse`), a left and a right of it a pair, a colour a pair, in two loose rows on
       the earth at the way in, his own way between them left clear. Nothing is drawn until the file is in. */
    (function sandals() {
      if (!have('slipper')) { waiting.add('slipper'); return; }
      const PAL = [0x1f2a4a, 0x1d1d1f, 0xb3261e, 0x2d6fb0, 0xd97aa5, 0x3f7a4c, 0xe8b830, 0x7a4a2a, 0xe6e1d6, 0xe0762a, 0x6a3aa0, 0x2a8a8a];
      const rnd = rng(1207), list = [];
      for (const z of [12.34, 12.74]) for (let x = -7.9; x <= -1.6; x += 0.36 + rnd() * 0.12) { if (Math.abs(x - DATA.spawn.x) < 0.3) continue; if (rnd() < 0.12) continue;
        list.push({ x: x + (rnd() - 0.5) * 0.06, z: z + (rnd() - 0.5) * 0.08, ry: Math.PI + (rnd() - 0.5) * 0.5, col: PAL[Math.floor(rnd() * PAL.length)] }); }
      list.push({ x: DATA.spawn.x + 0.02, z: 12.84, ry: Math.PI + 0.06, col: 0x1d1d1f });        // his own, where he steps out of them
      parseOnce('slipper').then((gltf) => { if (!alive) return;
        let one = null; gltf.scene.traverse(o => { if (o.isMesh && o.name === 'one') { const g = o.geometry.clone(); o.updateWorldMatrix(true, false); g.applyMatrix4(o.matrixWorld); g.computeVertexNormals(); one = g; } });
        if (!one) throw new Error('the sandal file has no single sandal');
        const right = one.clone(); right.scale(-1, 1, 1);
        if (right.index) { const ix = right.index.array; for (let i = 0; i < ix.length; i += 3) { const t = ix[i + 1]; ix[i + 1] = ix[i + 2]; ix[i + 2] = t; } right.index.needsUpdate = true; } right.computeVertexNormals();
        const mat = M({ color: 0xffffff, roughness: 0.62 }), d = new THREE.Object3D(), col = new THREE.Color();
        /* DRAWN IN SHORT LENGTHS OF A ROW (13 Nov; the same sandals in the same places, the picture bit for bit). They were
           two meshes for all fifty-odd, and a mesh is handed to the GPU whole if its sphere touches the view: the rows lie
           a step BEHIND where play begins, their one sphere (3.3 m) reached past the lens, and every frame he stood at
           the way in paid 152,768 triangles for sandals behind his back (counted by mesh: the spawn drew 1.12 million, 7 %
           over chapter 1's heaviest look, and I had put it down first to the bai sri and then to Ton's full model: both
           wrong). A length of a row is a metre and a half: its sphere no longer reaches a lens that looks away */
        const bins = new Map();
        for (const q of list) { const k = Math.floor((q.x + 8) / 1.6) + (q.z > 12.5 ? ':b' : ':a'); if (!bins.has(k)) bins.set(k, []); bins.get(k).push(q); }
        for (const part of bins.values()) for (const [g, off] of [[one, -0.056], [right, 0.056]]) { const im = new THREE.InstancedMesh(g, mat, part.length);
          part.forEach((q, i) => { d.position.set(q.x + off * Math.cos(q.ry), 0.004, q.z - off * Math.sin(q.ry)); d.rotation.set(0, q.ry, 0); d.updateMatrix(); im.setMatrixAt(i, d.matrix); im.setColorAt(i, col.setHex(q.col)); });
          im.instanceMatrix.needsUpdate = true; im.instanceColor.needsUpdate = true; im.computeBoundingSphere(); im.castShadow = false; world.add(im); owned.push(im); }
      }).catch(err => { console.warn('slipper failed to load', err); if (ctx.loadFail) ctx.loadFail('slipper', err); });
    })();

    /* ---- THE HAZE OVER THE OFFERING TABLES (day one; the plan's §3.7, look I: "a haze of incense and candle smoke that
       catches it"; photograph 3: thin smoke standing in the sun above the candles). A few tall soft sheets that rise
       slowly from the tables and from the pot of sand before them, lean with the air and thin as they climb: each a pure
       function of the clock it is handed. Faint: air that catches the light, not an effect (found missing by the audit
       of 13 Nov: the plan had it, the build did not) */
    const haze = (() => {
      const g = new THREE.Group(); dayOne.add(g);
      const t0 = tex(makeGlow(THREE, cnv)), rnd = rng(7741), list = [];
      for (const [x, z] of [[-1.7, -11.0], [-0.6, -11.5], [0.5, -10.9], [1.5, -11.4], [-0.1, -12.1], [2.1, -10.7], [-2.2, -11.8], [0.85, -9.7]]) {
        const m = new THREE.SpriteMaterial({ map: t0, color: 0xfff3e0, transparent: true, opacity: 0, depthWrite: false, fog: false }); mats.push(m);
        const sp = new THREE.Sprite(m); sp.renderOrder = 2; g.add(sp);
        list.push({ s: sp, x, z, w: 0.9 + rnd() * 0.8, T: 14 + rnd() * 9, ph: rnd(), a: 0.1 + rnd() * 0.06, dr: 0.5 + rnd() * 0.7, y0: z > -10 ? 0.4 : 1.5 });
      }
      return { g, list };
    })();
    function hazeTick(t) {
      if (!dayOne.visible) return;
      for (const h of haze.list) { const u = (((t / h.T + h.ph) % 1) + 1) % 1;
        h.s.position.set(h.x + h.dr * u * u + Math.sin(t * 0.23 + h.ph * 6.283) * 0.12 * (0.3 + u), h.y0 + 0.5 + 3.4 * u, h.z);
        h.s.scale.set(h.w * (0.7 + 1.1 * u), 1.3 + 1.6 * u, 1);
        h.s.material.opacity = h.a * Math.pow(Math.sin(Math.PI * Math.min(1, u * 1.15)), 1.2) * (1 - 0.35 * u); }
    }

    /* ---- THE PLASTIC CHAIRS AND THE LOUDSPEAKERS (the plan's §6.3; found unmade by the audit of 13 Nov).
       CHAIRS (photographs 5 and 6: white ones behind the master's bench, blue ones at its east side, people's things on
       them): one white model, the blue a tint of it (white times a colour is that colour). They are the day's: they
       stand with the crowd and are stacked away by the morning, so they are day one's group and their columns are the
       crowd's (lifted when the crowd is gone: crowdSolid). No far level: a chair's legs and slots ARE its outline. */
    (function chairsAndHorns() {
      const B2 = (a, b) => benchAt(a, b), to = benchAt(0.3, 2.2), r = 0.26;
      const seat = (a, b, turn) => { const [x, z] = B2(a, b); crowdBlock.push(new THREE.Box3(new THREE.Vector3(x - r, 0, z - r), new THREE.Vector3(x + r, 1.5, z + r)));
        return { x, y: 0, z, ry: faceTo(x, z, to[0], to[1]) + turn }; };
      /* (and two at the way in, by the tables of bai sri: the plan's §3.2, "plastic chairs in blue and white") */
      const at = (x, z, ry) => { crowdBlock.push(new THREE.Box3(new THREE.Vector3(x - r, 0, z - r), new THREE.Vector3(x + r, 1.5, z + r))); return { x, y: 0, z, ry }; };
      /* (each place its own mesh, 13 Nov: one mesh for the chairs at the bench AND the one at the way in had a sphere the
         width of the ground, so all of them were handed to the GPU wherever he looked. The same chairs, the same places) */
      const blue = (made) => { for (const im of made) im.material.color.set(0x2f62c8); };
      many('w3pchair', [seat(-1.7, -1.45, 0.12), seat(-0.6, -1.7, -0.08), seat(1.15, -1.55, 0.2)], dayOne, 0.8);
      many('w3pchair', [at(-9.2, 9.0, 1.45)], dayOne, 0.8);
      many('w3pchair', [seat(3.1, -0.75, -0.15), seat(3.6, -0.05, 0.1)], dayOne, 0.8, blue);
      many('w3pchair', [at(-9.25, 9.8, 1.7)], dayOne, 0.8, blue);
      /* LOUDSPEAKERS: a pair of grey horns on a steel pole at three corners of the ground, where the music and the
         chanting come from (the pole is a post: structure, like the tents' frames; the horns are the model) */
      const mPole = M({ color: 0x8b8e90, roughness: 0.55, metalness: 0.45 }), H = 4.1, list = [];
      for (const [x, z, ry] of [[-10.45, -9.2, 0.9], [10.7, -8.1, -0.8], [-9.5, 12.7, 2.3]]) {
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.04, H, 8), mPole); pole.position.set(x, H / 2, z); pole.matrixAutoUpdate = false; pole.updateMatrix();
        world.add(pole); owned.push(pole); solidBox(0.2, 2.2, 0.2, x, 1.1, z);
        list.push({ x, y: H - 0.3, z, ry });
      }
      /* (a pole a mesh: three poles at three corners of the ground made one sphere over all of it) */
      for (const horn of list) many('w3horns', [horn], world, 0.6);
    })();
