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
      const flatM = (geo, o) => { const m = new THREE.Mesh(geo, B(Object.assign({ color: 0xffffff, transparent: true, depthWrite: false, fog: false, side: THREE.DoubleSide, forceSinglePass: ONEPASS }, o))); m.rotation.x = -Math.PI / 2; m.renderOrder = 3; g.add(m); return m; };
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
    /* (v26.1: THE CHILDREN'S OWN HANDFULS, a pool of their own so their throws at every stop of their chase never take a
       master's handful off the carpet. Each is a third of a master's; what they throw lies on the turf a while and sinks
       into it (`sink`), so the pool is never taken back from a handful still to be seen) */
    const KIDB = 6, KID_N = 48, kidPool = [];
    { const g0 = new THREE.PlaneGeometry(1, 1);
      for (let b = 0; b < KIDB; b++) { const im = new THREE.InstancedMesh(g0, petalAirMat, KID_N); im.frustumCulled = false; im.visible = false; im.count = KID_N;
        const col = new THREE.Color(); for (let i = 0; i < KID_N; i++) { im.setMatrixAt(i, _wm.makeScale(0, 0, 0)); im.setColorAt(i, col.setRGB(1, 1, 1)); }
        im.instanceMatrix.needsUpdate = true; im.instanceColor.needsUpdate = true; world.add(im); owned.push(im);
        kidPool.push({ im, on: false, t0: 0, P: [], end: 0, n: KID_N }); } }
    let kidNext = 0;
    const _ptq = new THREE.Quaternion(), _pte = new THREE.Euler(), _ptp = new THREE.Vector3(), _pts = new THREE.Vector3(), _ptq2 = new THREE.Quaternion();
    const FLAT_Q = new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI / 2, 0, 0));
    let burstNext = 0;
    const PETAL_SINK = 3;                                                     // (how long a child's petal takes to go into the turf)
    /* thrown from `from` [x, y, z] so that it falls round `to` [x, z] (`r`: how wide it lands; `s`: a petal's length, 3.4 cm
       unless said: a little over life, so a throw reads across the turf; a close lens asks for less); t0 on the clock it is run on.
       `n`: how many petals of the handful there are (a child's is a third of a master's); the rest of the mesh's copies are
       never shown. Unsaid, every copy is thrown and each lands where it always did */
    function petalBurst(from, to, t0, o = {}) {
      const kid = o.pool === kidPool, CAP = kid ? KID_N : BURST_N;
      const Bu = kid ? kidPool[kidNext++ % KIDB] : bursts[burstNext++ % BURSTS], rnd = rng(o.seed || (7001 + burstNext * 131)), r = o.r != null ? o.r : 0.55, yg = o.ground != null ? o.ground : 0.014, col = new THREE.Color();
      const nShown = o.n != null ? Math.min(CAP, o.n) : CAP;
      Bu.P.length = 0; Bu.t0 = t0; Bu.on = true; Bu.end = 0; Bu.im.visible = true; Bu.sink = o.sink || 0;
      for (let i = 0; i < CAP; i++) {
        if (i >= nShown) { Bu.P.push({ late: Infinity, land: 0 }); continue; }
        const an = rnd() * 6.283, d = r * Math.sqrt(rnd()), tx = to[0] + Math.cos(an) * d, tz = to[1] + Math.sin(an) * d;
        const p = { x0: from[0] + (rnd() - 0.5) * 0.08, y0: from[1] + (rnd() - 0.5) * 0.06, z0: from[2] + (rnd() - 0.5) * 0.08, tx, tz,
                    vy: (o.up != null ? o.up : 1.9) * (0.55 + rnd() * 0.9), vt: 0.75 + rnd() * 0.75, th: 0.42 + rnd() * 0.3, ty: 0.3 + rnd() * 0.12,
                    wob: 0.05 + rnd() * 0.08, wf: 2.2 + rnd() * 2.6, wp: rnd() * 6.283, sx: 1.6 + rnd() * 3.4, sz: 1.4 + rnd() * 3.2, ry: rnd() * 6.283,
                    s: (o.s != null ? o.s : 0.034) * (0.75 + rnd() * 0.6), late: rnd() * 0.22, land: 0, yg: yg + rnd() * 0.01 };
        /* when it lands: the age at which its height meets the ground (it only falls after its apex: bisected) */
        const yAt = (a) => p.y0 + p.vy * p.ty * (1 - Math.exp(-a / p.ty)) - p.vt * (a - p.ty * (1 - Math.exp(-a / p.ty)));
        let lo = 0, hi = 12; for (let k = 0; k < 22; k++) { const m = (lo + hi) / 2; if (yAt(m) > p.yg) lo = m; else hi = m; }
        p.land = hi; Bu.end = Math.max(Bu.end, hi + p.late + (Bu.sink ? Bu.sink + PETAL_SINK + 0.1 : 0.4));
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
        let y = a >= p.land ? p.yg : Math.max(p.yg, p.y0 + p.vy * p.ty * ky - p.vt * (al - p.ty * ky));
        /* (a child's petal, `sink` seconds after it lands, goes down into the turf over PETAL_SINK seconds and is not drawn after) */
        if (Bu.sink && a > p.land + Bu.sink) { const ks = (a - p.land - Bu.sink) / PETAL_SINK; if (ks >= 1) { Bu.im.setMatrixAt(i, _wm.makeScale(0, 0, 0)); continue; } y = p.yg - 0.03 * smo(ks); }
        _pte.set(al * p.sx, p.ry + al * 0.9, al * p.sz, 'YXZ'); _ptq.setFromEuler(_pte);
        if (a >= p.land) { _pte.set(-Math.PI / 2, 0, p.ry, 'YXZ'); _ptq2.setFromEuler(_pte); _ptq.slerp(_ptq2, smo(c01((a - p.land) / 0.18))); }
        Bu.im.setMatrixAt(i, _wm.compose(_ptp.set(x, y, z), _ptq, _pts.set(p.s, p.s, p.s))); }
      Bu.im.instanceMatrix.needsUpdate = true;
    }
    /* play's own clock runs them (a film calls burstAt with its own); one that has all landed is drawn once more and left */
    function burstsTick(t) { for (const Bu of bursts) { if (!Bu.on || Bu.film) continue; burstAt(Bu, t); if (t - Bu.t0 > Bu.end) Bu.on = false; }
      for (const Bu of kidPool) { if (!Bu.on) continue; burstAt(Bu, t); if (t - Bu.t0 > Bu.end) { Bu.on = false; Bu.im.visible = false; } } }
    function burstsClear() { for (const Bu of bursts) { Bu.on = false; Bu.film = false; Bu.im.visible = false; }
      for (const Bu of kidPool) { Bu.on = false; Bu.im.visible = false; } }
    /* (v26.2 debug) PLAY'S PETALS COME TO REST WHEN A FILM BEGINS. Play's clock throws them (burstsTick) and play's frame
       does not run under a film, so a handful still in the air when a film began hung there for the whole film: the
       festival's showed petals stuck on a kneeling man's hair and down his thigh, the same in every shot. At a film's
       first frame (its cut) each is laid where it would come to rest: a grown hand's on the turf, a child's gone into it */
    function burstsLand() {
      for (const Bu of bursts) { if (!Bu.on || Bu.film) continue; burstAt(Bu, Bu.t0 + Bu.end); Bu.on = false; }
      for (const Bu of kidPool) { if (!Bu.on) continue; burstAt(Bu, Bu.t0 + Bu.end); Bu.on = false; Bu.im.visible = false; }
    }

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
    /* ---- HIS OWN LIGHT, IN THE CLOSE (v26.8, Chad, 13 Nov 2026: "the second minigame part, instead of playing the
       minigame, just show the player hands vibrating while a glow surronding him and his hands and his bai sri. all
       around his silohuette, to show that the player is now in control while vibrating"). He is never seen (every shot
       is his eyes: v24.56), so the glow round his silhouette is drawn as he would see it: a light all round the edge of
       his sight, a sheet laid over the hands' pass and fitted to its lens each frame; and a halo round the bai sri he
       holds up, shaking in his hands. WHITE, faint warm: the gold is Grandmaster Pho's alone (v25.5). `youGlowAt(k, t,
       at, vm)`: its strength, the film's clock, where the bai sri stands, and the film's hands' pass (or null) */
    const youGlow = (() => {
      const [c, x] = cnv(256), gr = x.createRadialGradient(128, 128, 54, 128, 128, 182);
      gr.addColorStop(0, 'rgba(255,255,255,0)'); gr.addColorStop(0.5, 'rgba(255,251,242,0.16)'); gr.addColorStop(0.82, 'rgba(255,248,234,0.62)'); gr.addColorStop(1, 'rgba(255,246,228,0.95)');
      x.fillStyle = gr; x.fillRect(0, 0, 256, 256);
      const tEdge = tex(new THREE.CanvasTexture(c)); tEdge.colorSpace = THREE.SRGBColorSpace;
      const edge = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), B({ map: tEdge, transparent: true, opacity: 0, depthTest: false, depthWrite: false, fog: false, blending: THREE.AdditiveBlending, toneMapped: false }));
      edge.renderOrder = 999; edge.frustumCulled = false; edge.visible = false; world.add(edge); owned.push(edge);
      const hm = new THREE.SpriteMaterial({ map: tex(makeGlow(THREE, cnv)), color: 0xfff7ea, transparent: true, opacity: 0, depthTest: false, depthWrite: false, fog: false, blending: THREE.AdditiveBlending }); mats.push(hm);
      const halo = new THREE.Sprite(hm); halo.renderOrder = 998; halo.visible = false; world.add(halo);
      return { edge, halo };
    })();
    function youGlowAt(k, t, at, vm) {
      const G = youGlow, on = k > 0.002;
      G.halo.visible = on; G.edge.visible = on && !!vm;
      if (!on) { if (G.edge.parent !== world) world.add(G.edge); return; }
      const br = 0.84 + 0.16 * Math.sin(t * 2 * Math.PI / 1.7);                  // (it breathes, a little faster than his teacher's)
      if (at) { G.halo.position.set(at[0], at[1] + 0.2, at[2]); G.halo.scale.set(0.95, 1.05, 1); }
      G.halo.material.opacity = 0.62 * k * br;
      /* (v26.8: the edge is laid before the film's OWN lens, in the world's pass, just past its near plane (0.08 m). It
         was laid in the hands' pass, which the engine skips while no hand of his is drawn, and a film hides his hands:
         photographed at its brightest, no light at the edge at all) */
      if (vm) {
        if (G.edge.parent !== camera) camera.add(G.edge);
        const d = 0.1, h = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * d;
        G.edge.position.set(0, 0, -d); G.edge.quaternion.identity(); G.edge.scale.set(h * camera.aspect * 1.04, h * 1.04, 1);
        G.edge.material.opacity = 0.7 * k * br;
      }
    }
    /* ---- HIS OWN HANDS ON HIS BAI SRI IN THE CLOSE (v26.8, row M). Chad, 13 Nov 2026, of the close: "just show the player
       hands vibrating while a glow surronding him and his hands and his bai sri. all around his silohuette, to show that the
       player is now in control while vibrating." v26.8 drew the bai sri shaking and the light, and not his hands: they were
       under the frame's foot, where play carries it (BAI above: six ways of drawing two hands of the hands' pass on its
       bowl were refused at v26.0, none of them touching it, for the hands' pass is drawn over the world and its arm is
       one rigid piece). So they are drawn IN THE WORLD here, where the bowl is, and a finger behind the bowl is behind it:
       his own arms (the engine's rig, arms.glb: both arms, with their elbows; the engine draws the right alone and shrinks
       the left away, and this copy gives the left back), stood at his shoulders under his eyes and solved onto the bowl
       as the chapter solves a master's hands (armsOf, handTo: two bones, the elbow down and out). The hold is his
       photograph 7's, the bai sri held up in two hands as its holder sees it: the forearms rising from the frame's lower
       corners, the palms on the bowl's sides under its swell, the fingers round them, the young man's offering in
       photograph 5 (baiGrip 'under'). `myArmsAt(api, eye, ya, c, k, glow, t)`: the film's api (the hands' model is the
       engine's, api.rightHand()), his eye, the way his body faces (a heading as eyes() takes it), the bai sri's foot in
       the world (or null), how far his hands are on it (0 under the frame, 1 on it), the glow, the film's clock */
    const MYARMS = { P: null, made: false, G: null, halos: [], left: null, petal: null };
    const SHOULD = { drop: 0.21, back: 0.05, reach: 0.6, lean: 0.16 };   // (his shoulders' middle against his eye; how far he leans to a bowl beyond reach)
    /* (MYGRIP: each finger's two nearer joints bent so far round the bowl's curve, the end joint 0.7 of it: c_cast.js
       curlFingers. MYARMS_SHOW: how far his hands must be on their way to the bowl before they are drawn) */
    const MYGRIP = 0.45, MYARMS_SHOW = 0.15;
    function myArmsMake(api) {
      if (MYARMS.made) return MYARMS.P; MYARMS.made = true;
      const src = api && api.rightHand && api.rightHand(); if (!src) { console.warn('his arms: the hands model is not here'); return null; }
      const m = cloneSkinned(src), bone = {};
      m.traverse(o => { if (o.isBone) bone[o.name] = o; if (o.isMesh) { o.material = o.material.clone(); o.frustumCulled = false; } });
      for (const n of ['upper_armL', 'handL']) if (bone[n]) bone[n].scale.setScalar(1);          // (the left the engine shrinks away, given back)
      const skins = []; m.traverse(o => { if (o.isSkinnedMesh) skins.push(o); });
      const piv = new THREE.Group(), G = new THREE.Group(); piv.add(m); G.add(piv); world.add(G); G.visible = false;
      /* (the rig's own frame, measured from its bones as they stand: across from the right shoulder to the left, forward
         from the shoulders to the hands; turned so its forward is the group's +z and its left +x, as a person's is) */
      G.updateMatrixWorld(true);
      /* (each hand given to its forearm: the rig carries both hands as children of its armature, beside the arms, because
         the engine moves the hand and its arm as one rigid piece and never bends an elbow. Bent here, a hand left with the
         armature stays where it was drawn and the skin of the wrist is drawn out to it in a long tube: photographed, the
         first build. Each hand stands at its forearm's end in the file (0.0 mm apart), so it is attached keeping where it
         is, and the arm carries it) */
      for (const sd of ['L', 'R']) { const fa = bone['forearm' + sd], hd = bone['hand' + sd]; if (fa && hd && hd.parent !== fa) fa.attach(hd); }
      const at = (n) => bone[n] ? bone[n].getWorldPosition(new THREE.Vector3()) : null;
      const sL = at('upper_armL'), sR = at('upper_armR'), hL = at('handL'), hR = at('handR');
      if (!sL || !sR || !hL || !hR) { console.warn('his arms: the rig has not the bones it should'); return null; }
      const mid = sL.clone().add(sR).multiplyScalar(0.5), xa = sL.clone().sub(sR).normalize(), za = hL.clone().add(hR).multiplyScalar(0.5).sub(mid);
      za.addScaledVector(xa, -za.dot(xa)).normalize(); const ya = new THREE.Vector3().crossVectors(za, xa).normalize();
      const R = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(xa, ya, za)).invert();
      piv.quaternion.copy(R); piv.position.copy(mid).applyQuaternion(R).negate();
      const map = { Arm: 'upper_arm', ForeArm: 'forearm', Hand: 'hand' }, fin = { Index: 'f_index0', Middle: 'f_middle0', Ring: 'f_ring0', Pinky: 'f_pinky0', Thumb: 'thumb0' };
      const P = { key: 'hisarms', ready: true, group: G, bone: {}, lv: { 1: skins } };
      for (const [sd, S0] of [['L', 'Left'], ['R', 'Right']]) {
        for (const k in map) P.bone[S0 + k] = bone[map[k] + sd];
        for (const k in fin) for (let i = 1; i <= 3; i++) P.bone[S0 + 'Hand' + k + i] = bone[fin[k] + i + sd]; }
      /* (his fingers, both hands: side by side, as a hand holding a bowl keeps them: the engine's prayer pose, the four
         straight and together. The rig ships them fanned, and the walking curl, laid about one axis across a fanned hand,
         bent every middle joint sideways, 28 to 37 degrees: measured on the first build (jointscan). The thumb as the
         walking hand holds it, out from the palm and a little curled. Curled round the bowl each frame (curlFingers, in
         myArmsAt). The left's copied over from the right by mirror, joint for joint, so the two are one hand twice) */
      if (api.setHandCurl) api.setHandCurl(m, 1);
      const th0 = {}; for (const nm in bone) if (/^thumb0[123]R$/.test(nm)) th0[nm] = bone[nm].quaternion.clone();
      if (api.setHandPrayer) api.setHandPrayer(m, 1);
      for (const nm in th0) bone[nm].quaternion.copy(th0[nm]);
      for (const nm in bone) { const r = /^(f_(index|middle|ring|pinky)|thumb)0([123])R$/.exec(nm); if (!r) continue;
        const bl = bone[nm.slice(0, -1) + 'L'], br = bone[nm]; if (bl) bl.quaternion.set(br.quaternion.x, -br.quaternion.y, -br.quaternion.z, br.quaternion.w); }
      const hm = new THREE.SpriteMaterial({ map: tex(makeGlow(THREE, cnv)), color: 0xfff7ea, transparent: true, opacity: 0, depthTest: false, depthWrite: false, fog: false, blending: THREE.AdditiveBlending }); mats.push(hm);
      for (let i = 0; i < 2; i++) { const sp = new THREE.Sprite(hm); sp.renderOrder = 998; sp.visible = false; world.add(sp); MYARMS.halos.push(sp); }
      MYARMS.left = bone.upper_armL || null;                                  // (v26.12: shrunk away again while his right hand is open alone: myOpenHand)
      MYARMS.G = G; MYARMS.P = P; return P;
    }
    /* HIS GRIP, as his photograph 7 holds a bai sri up before the eyes: each palm on the bowl's lower body under its swell,
       a little to his side of its middle (GRIP.round, in radians round from the side toward him), turned in to it; the
       fingers up its side and round it; so each thumb lies across the side toward him and the backs of his hands are what
       he sees, as in the photograph. The elbows low and in, under the bowl, the forearms rising to it. (baiGrip's
       'under', the one who offers a bai sri to a master seen from beside, set the fingers forward along the bowl: from
       his own eyes that put both hands behind it) */
    /* (the fingers point up the bowl's side only as it is raised before his eyes; held at his chest, below the frame, they
       point forward along it as a bowl held there is held: with the raised hold's fingers at his chest the joint scan read
       his wrists 36 to 55 degrees toward the thumb, which no wrist does. `raised`, 0 at his chest to 1 at his eyes) */
    const GRIP = { round: 0.42, up: 0.115, fUp: 0.82, fFwd: 0.38, fUp0: 0.3, fFwd0: 0.95, nUp: 0.18, out: 0.1, down: 0.46 };
    function myGrip(c, s, from, raised = 1) {
      const fx = c[0] - from[0], fz = c[2] - from[1], d = Math.hypot(fx, fz) || 1, F = [fx / d, fz / d], Lf = [F[1], -F[0]], out = {};
      const r = 0.112 * s, y = GRIP.up * s, ca = Math.cos(GRIP.round), sa = Math.sin(GRIP.round), kr = smo(c01(raised));
      const fu = lp(GRIP.fUp0, GRIP.fUp, kr), ff = lp(GRIP.fFwd0, GRIP.fFwd, kr);
      for (const [sd, sg] of [['L', 1], ['R', -1]]) {
        const rx = Lf[0] * sg * ca - F[0] * sa, rz = Lf[1] * sg * ca - F[1] * sa;          // (from the bowl's axis out to his palm)
        out[sd] = { at: [c[0] + rx * r, c[1] + y, c[2] + rz * r],
                    f: [F[0] * ff, fu, F[1] * ff], n: [-rx, GRIP.nUp, -rz], out: GRIP.out, down: GRIP.down };
      }
      return out;
    }
    function myArmsAt(api, eye, ya, c, k, glow, t, held, raised = 1) {
      /* (`held`: drawn from the close's first frame, under the frame's foot where nothing of them is seen, so the phone
         builds their shading under the close's black and not in the picture as his hands come up) */
      /* (and drawn only while they are on the bowl or near it: on their way down to his sides, below the frame, the hand
         turned for the bowl read the wrist 56 degrees toward the thumb (jointscan), so there they are not drawn at all) */
      const drawn = !!c && (k > MYARMS_SHOW || !!held);
      const P = drawn ? myArmsMake(api) : MYARMS.P;
      if (!P || !drawn) { if (MYARMS.G) MYARMS.G.visible = false; for (const sp of MYARMS.halos) sp.visible = false; return; }
      armsBack(P);
      if (MYARMS.left) MYARMS.left.scale.setScalar(1);
      const G = MYARMS.G, fx = -Math.sin(ya), fz = -Math.cos(ya), lx = -Math.cos(ya), lz = Math.sin(ya);
      /* (held and not on the bowl: drawn 1.2 m behind his eyes, where no look of his can see them) */
      if (!(k > MYARMS_SHOW)) { G.position.set(eye[0] - fx * 1.2, eye[1] - SHOULD.drop, eye[2] - fz * 1.2); G.rotation.set(0, ya + Math.PI, 0); G.visible = true;
        for (const sp of MYARMS.halos) sp.visible = false; return; }
      let gx = eye[0] - fx * SHOULD.back, gy = eye[1] - SHOULD.drop, gz = eye[2] - fz * SHOULD.back;
      /* (a bowl beyond his reach, on the carpet beside his knee: he leans to it, so far and no further) */
      { const dx = c[0] - gx, dy = c[1] + 0.09 - gy, dz = c[2] - gz, d = Math.hypot(dx, dy, dz), ex = Math.min(SHOULD.lean, Math.max(0, d - SHOULD.reach)) * smo(c01(k));
        if (ex > 0) { gx += dx / d * ex; gy += dy / d * ex; gz += dz / d * ex; } }
      G.position.set(gx, gy, gz); G.rotation.set(0, ya + Math.PI, 0); G.visible = true; G.updateMatrixWorld(true);
      const gr = myGrip(c, BAI.s, [eye[0], eye[2]], raised), ke = smo(c01(k));
      const palm = {};
      for (const sd of ['L', 'R']) { const g = gr[sd], sg = sd === 'L' ? 1 : -1;
        /* (from under the frame: below his chest and to his side, eased up onto the bowl) */
        const lo = [eye[0] + fx * 0.3 + lx * sg * 0.17, eye[1] - 0.62, eye[2] + fz * 0.3 + lz * sg * 0.17];
        palm[sd] = [lp(lo[0], g.at[0], ke), lp(lo[1], g.at[1], ke), lp(lo[2], g.at[2], ke)];
        handTo(P, sd, palm[sd], g.f, g.n, 1, g);
        curlFingers(P, sd, MYGRIP * ke); }
      /* the light round his hands as round the bai sri (it breathes with it): on each palm where it lies on the bowl (on
         the wrist it stood off at the frame's corners: photographed) */
      const on = glow > 0.002, br = 0.84 + 0.16 * Math.sin(t * 2 * Math.PI / 1.7);
      MYARMS.halos.forEach((sp, i) => { sp.visible = on; if (!on) return; const q = palm[i ? 'R' : 'L']; sp.position.set(q[0], q[1], q[2]); sp.scale.set(0.3, 0.3, 1); sp.material.opacity = 0.42 * glow * br; });
    }
    /* (v26.12, his answer of 14 Nov to the close's last image, "Petal on his hand") ONE PETAL LEFT ON HIS OPEN HAND, then
       black: one of the marigold petals his teacher threw over him, kept on his palm. His right hand, open and palm up, held
       before his lower chest as a man holds a hand to look into it, LEARNED from two reference pictures before it was built
       (masters/v26.12/make.sh: from his own eyes, and from his side): the upper arm hanging close to his side, the elbow
       bent about 120 degrees, the forearm rising some 30 degrees forward, the wrist straight but for a little lift (the
       fingers rise some 15 degrees, the forearm 30), the fingers on along the forearm's line and some 20 degrees in toward
       his middle, gently curved, the thumb relaxed out from the palm; the palm some 0.42 m from his eye, a little right of
       his middle. The left arm is shrunk away as the engine shrinks it in play: it is in no picture of this.
       OPENHAND: the palm's middle forward of his eye, below it, to his right; the fingers' way (in, up, against forward 1);
       the palm's facing (back toward him, in toward his middle, against up 1); the elbow's side (out, down, aft: the
       upper arm hanging); the fingers' curl at each joint (radians); the petal's length, how far it lies off the palm and
       how far its length is turned from the fingers' line. (Its first build, photographed: the palm stood nearly face on to
       his eye, where the reference's is seen aslant: the fingers now rise some 8 degrees where they rose 15, and the wrist
       is read again by the joint scan) */
    const OPENHAND = { fwd: 0.28, down: 0.31, right: 0.05, fIn: 0.36, fUp: 0.15, nBack: 0.15, nIn: 0.18, out: 0.1, edown: 0.5, aft: 0.06,
                       curl: 0.24, petal: 0.032, lift: 0.004, turn: 0.7 };
    const _ohP = new THREE.Vector3(), _ohQ = new THREE.Quaternion(), _ohF = new THREE.Vector3(), _ohN = new THREE.Vector3(), _ohA = new THREE.Vector3(),
          _ohY = new THREE.Vector3(), _ohS = new THREE.Vector3(), _ohM = new THREE.Matrix4();
    /* (where the palm is held, for his eyes too: they look at where it is held, never chase it as it comes up) */
    function openHandAt(eye, ya) {
      const fx = -Math.sin(ya), fz = -Math.cos(ya), rx = Math.cos(ya), rz = -Math.sin(ya);
      return [eye[0] + fx * OPENHAND.fwd + rx * OPENHAND.right, eye[1] - OPENHAND.down, eye[2] + fz * OPENHAND.fwd + rz * OPENHAND.right];
    }
    /* `myOpenHand(api, eye, ya, k)`: k 0 below the frame's foot (nothing drawn: his arms are then myArmsAt's), 1 held open
       before him. Called after myArmsAt in the same frame, which has hidden his arms by then once the bowl is given */
    function myOpenHand(api, eye, ya, k) {
      if (!eye || !(k > 0.001)) { if (MYARMS.petal) MYARMS.petal.visible = false; return; }
      const P = myArmsMake(api); if (!P) return;
      armsBack(P);
      if (MYARMS.left) MYARMS.left.scale.setScalar(1e-4);
      for (const sp of MYARMS.halos) sp.visible = false;
      const G = MYARMS.G, fx = -Math.sin(ya), fz = -Math.cos(ya), lx = -Math.cos(ya), lz = Math.sin(ya);
      G.position.set(eye[0] - fx * SHOULD.back, eye[1] - SHOULD.drop, eye[2] - fz * SHOULD.back); G.rotation.set(0, ya + Math.PI, 0); G.visible = true; G.updateMatrixWorld(true);
      /* (from under the frame, below his chest and to his right, as myArmsAt brings his hands up, eased to where it is held) */
      const ke = smo(c01(k)), at = openHandAt(eye, ya), lo = [eye[0] + fx * 0.3 - lx * 0.17, eye[1] - 0.62, eye[2] + fz * 0.3 - lz * 0.17];
      const pt = [lp(lo[0], at[0], ke), lp(lo[1], at[1], ke), lp(lo[2], at[2], ke)];
      const f = [fx + lx * OPENHAND.fIn, OPENHAND.fUp, fz + lz * OPENHAND.fIn], n = [-fx * OPENHAND.nBack + lx * OPENHAND.nIn, 1, -fz * OPENHAND.nBack + lz * OPENHAND.nIn];
      handTo(P, 'R', pt, f, n, 1, { out: OPENHAND.out, down: OPENHAND.edown, aft: OPENHAND.aft });
      /* (the fingers curled from the engine's prayer pose, which holds them side by side: the joint scan reads them 2 to 7
         degrees apart on the palm. The gaps a picture shows between them are the hand model's own thin fingers, spaced at its
         knuckles: measured, not a spread) */
      curlFingers(P, 'R', OPENHAND.curl);
      /* THE PETAL: one of the handful's own (the same picture, the same marigold, the same shading: a copy of the handfuls'
         drawing, so no new program is built on screen), lying on the middle of his palm, from the hand as it is drawn */
      if (!MYARMS.petal) { const im = new THREE.InstancedMesh(new THREE.PlaneGeometry(1, 1), petalAirMat, 1); im.frustumCulled = false; im.count = 1;
        im.setColorAt(0, new THREE.Color().setHSL(0.12, 0.98, 0.53, THREE.SRGBColorSpace)); im.instanceColor.needsUpdate = true; world.add(im); MYARMS.petal = im; }
      const a = armsOf(P) && armsOf(P).R; if (!a) { MYARMS.petal.visible = false; return; }
      a.hand.updateWorldMatrix(true, false); a.hand.getWorldPosition(_ohP); a.hand.getWorldQuaternion(_ohQ);
      _ohF.copy(a.fL).applyQuaternion(_ohQ).normalize(); _ohN.copy(a.nL).applyQuaternion(_ohQ).normalize();
      _ohP.addScaledVector(_ohF, a.palm * 0.95).addScaledVector(_ohN, 0.022 + OPENHAND.lift);
      _ohA.copy(_ohF).applyAxisAngle(_ohN, OPENHAND.turn); _ohY.crossVectors(_ohN, _ohA).normalize(); _ohA.crossVectors(_ohY, _ohN).normalize();
      _ohM.makeBasis(_ohA, _ohY, _ohN).scale(_ohS.set(OPENHAND.petal, OPENHAND.petal, 1)).setPosition(_ohP);
      MYARMS.petal.setMatrixAt(0, _ohM); MYARMS.petal.instanceMatrix.needsUpdate = true; MYARMS.petal.visible = true;
    }
    /* (his arms are a copy of the engine's own hand: its shape and its pictures are the engine's, drawn in every
       chapter's play, and never this chapter's to dispose. dispose() takes them out of the world before it disposes
       what is left there, and gives back only what this copy made: its materials and its bone sheet) */
    function myArmsDrop() {
      /* (the petal on his palm: its own sheet of places and its own square; its drawing is the handfuls', never this one's to dispose) */
      if (MYARMS.petal) { const im = MYARMS.petal; if (im.parent) im.parent.remove(im); im.geometry.dispose(); im.dispose(); MYARMS.petal = null; }
      MYARMS.left = null;
      const G = MYARMS.G; if (!G) return;
      if (G.parent) G.parent.remove(G);
      G.traverse(o => { if (o.isSkinnedMesh && o.skeleton) o.skeleton.dispose(); if (o.isMesh) for (const m of [].concat(o.material)) m.dispose(); });
      MYARMS.G = null; MYARMS.P = null; MYARMS.made = false;
    }
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
      /* (v26.2 debug: a roll is 0.232 m thick (tools/probes/glbbox.mjs w3matroll); laid 0.16 apart and 0.128 a level they
         sank into one another, the stack a solid bank of stripes. Side by side now, each level in the hollow between two
         below it: 0.24 apart, 0.2 a level. Then 0.27 apart: each roll's own small turn (up to 0.05 between two) brought
         two 0.232 rolls together at their ends, measured in ending A by tools/probes/clipscan.mjs; the hollow above two
         0.27 apart is 0.19 up, so 0.2 a level still rests each on the two below) */
      const at = (dz, lvl, dx = 0) => { const lx = dx + (rnd() - 0.5) * 0.08; return stand('w3matroll', MATS_AT.x + lx * c + dz * sn, lvl * 0.2, MATS_AT.z - lx * sn + dz * c, MATS_AT.ry + (rnd() - 0.5) * 0.05, { parent: matsG }); };
      for (const [dz, lvl] of [[-0.27, 0], [0, 0], [0.27, 0], [-0.135, 1], [0.135, 1]]) rolled.stack.push(at(dz, lvl));
      rolled.own = at(0, 2); rolled.own.visible = false;                           // his own: the stack's top, once he has laid it there
      for (let i = 0; i < 2; i++) rolled.ton.push(stand('w3matroll', 0, 0, 0, 0, { parent: matsG, moves: true }));
      rolled.carry = stand('w3matroll', 0, 0, 0, 0, { parent: matsG, moves: true });
      for (let i = 0; i < 2; i++) rolled.rolls.push(stand('w3matroll', 0, 0, 0, 0, { parent: matsG, moves: true })); }
    const handMatHolder = new THREE.Group();
    const handMat = stand('w3matroll', 0, 0, 0, 0, { s: 0.8, near: true, parent: handMatHolder });
    /* a mat lying across a person's two forearms (`n`: the second lies on the first). v26.2 debug (Chad's picture of ending
       A, 13 Nov 2026: Ton's cupped hands stood out of the front of his two mats, the mats sunk through his forearms and into
       each other): they LIE on his arms now. A mat's foot is its model's origin; it is set on his forearms' tops where it
       crosses them, 13 cm back from his wrists (each forearm's bone line there, from its elbow to its wrist, raised by a
       forearm's half-thickness), and the second on the first, 0.226 m up (a roll is 0.232 thick: the upper sits 6 mm into
       the one below, as one soft roll does on another). Read off his own bones on
       every frame, so his take's breathing carries them */
    const _mtv = new THREE.Vector3(), _mte = new THREE.Vector3(), _mtw = new THREE.Vector3();
    const FOREARMS = { L: /^(mixamorig:?)?LeftForeArm$/, R: /^(mixamorig:?)?RightForeArm$/ };
    function matOnArms(g, P, n = 0) { const m = handsMid(P, _mtv); if (!m) return false; const ry = P.group.rotation.y;
      if (!P.foreL) for (const k in P.bone) { if (FOREARMS.L.test(k)) P.foreL = P.bone[k]; if (FOREARMS.R.test(k)) P.foreR = P.bone[k]; }
      let top = m.y;
      if (P.foreL && P.foreR && P.handL && P.handR) { let y = 0;
        for (const [fb, hb] of [[P.foreL, P.handL], [P.foreR, P.handR]]) { fb.getWorldPosition(_mte); hb.getWorldPosition(_mtw);
          const k = Math.min(1, 0.13 / Math.max(0.05, _mte.distanceTo(_mtw))); y += _mtw.y + (_mte.y - _mtw.y) * k; }
        top = y / 2; }
      g.position.set(m.x - Math.sin(ry) * 0.13, top + 0.04 + n * 0.226, m.z - Math.cos(ry) * 0.13); g.rotation.set(0, ry + (n ? 0.07 : -0.04), 0); g.visible = true; return true; }

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
        /* DRAWN IN SHORT LENGTHS OF A ROW (12 Nov; the same sandals in the same places, the picture bit for bit). They were
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
       of 12 Nov: the plan had it, the build did not) */
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

    /* ---- THE PLASTIC CHAIRS AND THE LOUDSPEAKERS (the plan's §6.3; found unmade by the audit of 12 Nov).
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
      /* (each place its own mesh, 12 Nov: one mesh for the chairs at the bench AND the one at the way in had a sphere the
         width of the ground, so all of them were handed to the GPU wherever he looked. The same chairs, the same places) */
      const blue = (made) => { for (const im of made) im.material.color.set(0x2f62c8); };
      many('w3pchair', [seat(-1.7, -1.45, 0.12), seat(-0.6, -1.7, -0.08), seat(1.15, -1.55, 0.2)], dayOne, 0.8);
      many('w3pchair', [at(-9.2, 9.0, 1.45)], dayOne, 0.8);
      many('w3pchair', [seat(3.1, -0.75, -0.15), seat(3.6, -0.05, 0.1)], dayOne, 0.8, blue);
      many('w3pchair', [at(-9.25, 9.8, 1.7)], dayOne, 0.8, blue);
      /* LOUDSPEAKERS: a pair of grey horns on a steel pole at three corners of the ground, where the music and the
         chanting come from (the pole is a post: structure, like the tents' frames; the horns are the model) */
      const mPole = M({ color: 0x8b8e90, roughness: 0.55, metalness: 0.45 }), H = 4.1, list = [];
      /* (v26.2 debug: the north-west pole stood at -10.45, under the open shed's eave, and went up through its roof (Chad's
         picture of the corner by the fence); it stands clear of the eave now, outside the fence's corner) */
      for (const [x, z, ry] of [[-9.7, -9.35, 0.9], [10.7, -8.1, -0.8], [-9.5, 12.7, 2.3]]) {
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.04, H, 8), mPole); pole.position.set(x, H / 2, z); pole.matrixAutoUpdate = false; pole.updateMatrix();
        world.add(pole); owned.push(pole); solidBox(0.2, 2.2, 0.2, x, 1.1, z);
        list.push({ x, y: H - 0.3, z, ry });
      }
      /* (a pole a mesh: three poles at three corners of the ground made one sphere over all of it) */
      for (const horn of list) many('w3horns', [horn], world, 0.6);
    })();
