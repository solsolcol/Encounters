    /* ================================================================ THE SKY: CLOUDS, THE SUN'S GLARE, RAYS (v26.1)
       Chad, 12 Nov 2026: "I think the overall environment can be improved further with much more details ... and i think
       the skybox can be added and improved with much better detail, especially adding clouds, sun, rays, etc." The
       engine's sky is a gradient dome with its sun disc and a thin layer of cloud; over it now, painted (v15.1: no lamp):
       1. CLOUDS: photographic cards (GPT Image at its best, a transparent ground: masters/v26.1/env/refs, looked at over a
          blue before use) stood round the horizon above the line of the trees, each turned to face the middle of the
          ground: a long low bank of fair-weather cumulus in four places, tall and flat ones higher between them, a cluster
          of small ones, and wisps of cirrus higher still. A cloud lit from its upper right is turned round where the sun
          stands on the left of it, so every cloud is lit from the sun's side;
       2. THE SUN'S GLARE: a soft halo and a bright core where the hour's key light comes from, drawn additively and hidden
          by whatever stands before it;
       3. RAYS: shafts of light slanting down through the crowns of the two great trees along the sun's line, each turned
          about its own length to face the lens, breathing a little as leaves move.
       All of it follows the hour (the look, d_play.js `look`, y_stage.js `lit`): white at the late morning, warm at dawn,
       rose at dusk; no rays in the flat light of ending D or after the sun is down; nothing at night or indoors. The sky
       stands where the stage's sky stands (`skyAt`: a film's pocket set has its own). Its far side is inside the far plane
       (160 m) from anywhere on the ground. */
    Object.assign(SURF, { cloudbank: [0xffffff, 'image/webp'], cloudtall: [0xffffff, 'image/webp'], cloudflat: [0xffffff, 'image/webp'],
                          cloudthree: [0xffffff, 'image/webp'], cirrus: [0xffffff, 'image/webp'] });
    const SKY_R = 110;
    /* each card: its azimuth (degrees from north, toward the east), the elevation of its middle and its width (degrees, as
       seen from the middle of the ground), its picture and that picture's height for its width */
    const SKY_CARDS = [
      { az: 15, el: 17, w: 70, key: 'cloudbank', hw: 878 / 2048 }, { az: 105, el: 16, w: 66, key: 'cloudbank', hw: 878 / 2048 },
      { az: 196, el: 17.5, w: 72, key: 'cloudbank', hw: 878 / 2048 }, { az: 287, el: 16.5, w: 68, key: 'cloudbank', hw: 878 / 2048 },
      { az: 62, el: 25, w: 30, key: 'cloudtall', hw: 764 / 1024 }, { az: 248, el: 26, w: 32, key: 'cloudtall', hw: 764 / 1024 },
      { az: 160, el: 29, w: 38, key: 'cloudflat', hw: 579 / 1024 }, { az: 334, el: 28, w: 36, key: 'cloudflat', hw: 579 / 1024 },
      { az: 136, el: 22, w: 22, key: 'cloudthree', hw: 764 / 1024 }, { az: 302, el: 21, w: 24, key: 'cloudthree', hw: 764 / 1024 },
      { az: 38, el: 40, w: 60, key: 'cirrus', hw: 579 / 1024 }, { az: 214, el: 42, w: 58, key: 'cirrus', hw: 579 / 1024 }
    ];
    /* the hour's sky: the clouds' colour and strength, the glare's colour and strength, the rays' strength */
    const SKY_LOOK = {
      DAY1: { cloud: [1, 1, 1, 1], sun: [1, 0.95, 0.84, 1], rays: 0.15 },
      DAWN: { cloud: [1, 0.87, 0.76, 0.95], sun: [1, 0.76, 0.46, 1], rays: 0.17 },
      OPENED: { cloud: [1, 0.9, 0.8, 1], sun: [1, 0.82, 0.55, 1], rays: 0.19 },
      SHUT: { cloud: [0.82, 0.84, 0.88, 0.9], sun: null, rays: 0 },
      AFTERNOON: { cloud: [1, 0.95, 0.86, 1], sun: [1, 0.88, 0.66, 1], rays: 0.13 },
      DUSK: { cloud: [0.96, 0.64, 0.52, 0.85], sun: [1, 0.55, 0.3, 0.75], rays: 0 },
      DUSKOPEN: { cloud: [1, 0.7, 0.56, 0.9], sun: [1, 0.6, 0.34, 0.85], rays: 0 }
    };
    const skyFx = { g: new THREE.Group(), cards: [], halo: null, core: null, burst: null, rays: [], rayMat: null, look: '', dir: new THREE.Vector3(0, 1, 0) };
    /* the sun's own rays: thin streaks of light out from its core, of seeded lengths and strengths, each soft along its
       length and across it (a picture drawn once; it turns very slowly, so the streaks are never quite still) */
    function makeSunBurst() {
      const N = 512, [c, x] = cnv(N); x.clearRect(0, 0, N, N); x.globalCompositeOperation = 'lighter';
      const rnd = rng(5309), cx = N / 2;
      for (let i = 0; i < 26; i++) {
        const a = (i / 26) * 6.283 + (rnd() - 0.5) * 0.18, len = cx * (0.45 + 0.55 * rnd()), wd = 0.010 + 0.022 * rnd(), k = 0.25 + 0.75 * rnd();
        x.save(); x.translate(cx, cx); x.rotate(a);
        const g = x.createLinearGradient(0, 0, len, 0); g.addColorStop(0, `rgba(255,250,235,${(0.55 * k).toFixed(3)})`); g.addColorStop(0.35, `rgba(255,246,225,${(0.22 * k).toFixed(3)})`); g.addColorStop(1, 'rgba(255,240,215,0)');
        x.fillStyle = g; x.beginPath(); x.moveTo(0, 0); x.lineTo(len, -len * wd); x.lineTo(len, len * wd); x.closePath(); x.fill(); x.restore();
      }
      return tex(done(THREE, c, false));
    }
    function makeRay() {
      const [c, x] = cnv(64, 256); x.clearRect(0, 0, 64, 256);
      const img = x.createImageData(64, 256), rnd = rng(9137), streak = [];
      for (let i = 0; i < 64; i++) streak.push(0.75 + 0.25 * rnd());
      for (let v = 0; v < 256; v++) for (let u = 0; u < 64; u++) {
        const k = v / 255, across = (u - 31.5) / 31.5, side = Math.exp(-across * across * 3.2), along = Math.pow(1 - k, 1.6) * c01(k / 0.08);
        const a = 255 * side * along * streak[u], o = (v * 64 + u) * 4; img.data[o] = img.data[o + 1] = img.data[o + 2] = 255; img.data[o + 3] = a; }
      x.putImageData(img, 0, 0);
      return tex(done(THREE, c, false));
    }
    function buildSky() {
      skyFx.g.name = 'v26.1 sky'; world.add(skyFx.g); owned.push(skyFx.g);
      const d2r = Math.PI / 180, sunAz = Math.atan2(17, -10);                   // (DAY1's key, east-south-east: which side a card is lit from)
      for (const C of SKY_CARDS) {
        const az = C.az * d2r, w = 2 * SKY_R * Math.tan(C.w * d2r / 2), h = w * C.hw;
        const m = B({ color: 0xffffff, transparent: true, depthWrite: false, fog: false, opacity: 0 });
        const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), m);
        mesh.position.set(Math.sin(az) * SKY_R, 1.6 + Math.tan(C.el * d2r) * SKY_R, -Math.cos(az) * SKY_R);
        mesh.lookAt(0, mesh.position.y, 0); mesh.renderOrder = -4; mesh.frustumCulled = false; skyFx.g.add(mesh);
        /* (lit from its upper right in its picture: turned round where the sun is to the left of it as it is looked at) */
        const flip = Math.sin(sunAz - az) < 0;
        surfLoad(C.key).then(t0 => { if (!t0 || !alive) return; const t = t0.clone(); t.needsUpdate = true; madeTex.push(t);
          t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping; t.repeat.set(flip ? -1 : 1, -1); t.offset.set(flip ? 1 : 0, 1); m.map = t; m.needsUpdate = true; C.ready = true; });
        skyFx.cards.push({ mesh, m, C });
      }
      const glow = tex(makeGlow(THREE, cnv));
      const sm = (s) => { const m = new THREE.SpriteMaterial({ map: glow, color: 0xffffff, transparent: true, depthWrite: false, fog: false, blending: THREE.AdditiveBlending, opacity: 0 }); mats.push(m);
        const sp = new THREE.Sprite(m); sp.scale.set(s, s, 1); sp.renderOrder = -3; sp.frustumCulled = false; skyFx.g.add(sp); return sp; };
      skyFx.halo = sm(SKY_R * 0.62); skyFx.core = sm(SKY_R * 0.14);
      { const m = new THREE.SpriteMaterial({ map: makeSunBurst(), color: 0xffffff, transparent: true, depthWrite: false, fog: false, blending: THREE.AdditiveBlending, opacity: 0 }); mats.push(m);
        const sp = new THREE.Sprite(m); sp.scale.set(SKY_R * 0.95, SKY_R * 0.95, 1); sp.renderOrder = -3; sp.frustumCulled = false; skyFx.g.add(sp); skyFx.burst = sp; }
      /* the rays: under the two great trees' crowns (b_world2.js TREES: the rain tree west of the turf, the mango behind
         the chief canopy), each from a place in the crown, seeded */
      skyFx.rayMat = B({ map: makeRay(), color: 0xfff1d6, transparent: true, depthWrite: false, fog: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, opacity: 0 });
      const rnd = rng(4129), g0 = new THREE.PlaneGeometry(1, 1); g0.translate(0, -0.5, 0);
      for (const [T0, n] of [[TREES[0], 10], [TREES[1], 6]]) for (let i = 0; i < n; i++) {
        const an = rnd() * 6.283, r = T0.h * (0.12 + 0.3 * Math.sqrt(rnd())), y = T0.h * (0.55 + 0.22 * rnd());
        const mesh = new THREE.Mesh(g0, skyFx.rayMat); mesh.frustumCulled = false; mesh.renderOrder = 3; world.add(mesh); owned.push(mesh);
        skyFx.rays.push({ mesh, at: new THREE.Vector3(T0.x + Math.cos(an) * r, y, T0.z + Math.sin(an) * r), w: 0.3 + 0.6 * rnd(), ph: rnd() * 6.283, f: 0.35 + 0.5 * rnd() });
      }
    }
    const _skC = new THREE.Vector3(), _skX = new THREE.Vector3(), _skV = new THREE.Vector3(), _skZ = new THREE.Vector3(), _skM = new THREE.Matrix4();
    /* every frame, in play and in a film (d_play.js updateNotes): where the sky stands, the hour's colours when the hour
       changes, and the rays turned to the lens */
    function skyTick(t) {
      const at = FL.sky; skyFx.g.position.set(at ? at.x : 0, 0, at ? at.z : 0);
      const L = SKY_LOOK[lookName] || null;
      if (skyFx.look !== lookName) {
        skyFx.look = lookName;
        const P0 = PRESETS[lookName], k = P0 && P0.key; if (k) skyFx.dir.set(k[2], k[3], k[4]).normalize();
        for (const c of skyFx.cards) { c.m.visible = !!L; if (L) { c.m.color.setRGB(L.cloud[0], L.cloud[1], L.cloud[2]); c.m.opacity = L.cloud[3]; } }
        for (const s of [skyFx.halo, skyFx.core, skyFx.burst]) { s.visible = !!(L && L.sun); if (L && L.sun) { s.material.color.setRGB(L.sun[0], L.sun[1], L.sun[2]); s.position.copy(skyFx.dir).multiplyScalar(SKY_R * 0.98); } }
        skyFx.halo.material.opacity = L && L.sun ? 0.42 * L.sun[3] : 0; skyFx.core.material.opacity = L && L.sun ? 0.9 * L.sun[3] : 0;
        skyFx.burst.material.opacity = L && L.sun ? 0.5 * L.sun[3] : 0;
        skyFx.rayMat.opacity = L ? L.rays : 0;
        for (const r of skyFx.rays) r.mesh.visible = !!(L && L.rays > 0 && skyFx.dir.y > 0.12);
      }
      if (skyFx.burst.visible) skyFx.burst.material.rotation = t * 0.012;
      if (!(L && L.rays > 0 && skyFx.dir.y > 0.12)) return;
      camera.getWorldPosition(_skC);
      const d = skyFx.dir;
      /* (light scattered out of a shaft is seen most looking toward the light and hardly at all looking away: in the first
         photographs a shaft seen with the sun behind him lay across the grey wall as a pale smear) */
      camera.getWorldDirection(_skV); const toward = c01((_skV.dot(d) - 0.25) / 0.6);
      skyFx.rayMat.opacity = L.rays * toward * toward * (3 - 2 * toward);
      for (const r of skyFx.rays) {
        const len = Math.min(16, (r.at.y - 0.05) / d.y);
        _skV.copy(_skC).sub(r.at); _skX.crossVectors(d, _skV); if (_skX.lengthSq() < 1e-8) continue; _skX.normalize(); _skZ.crossVectors(_skX, d);
        _skM.makeBasis(_skX, d, _skZ); r.mesh.quaternion.setFromRotationMatrix(_skM);
        const breathe = 0.72 + 0.28 * Math.sin(t * r.f + r.ph);
        r.mesh.position.copy(r.at); r.mesh.scale.set(r.w * breathe, len, 1);
      }
    }
    buildSky();

    /* ================================================================ THE GROUND'S EDGES FILLED, ITS BUILDINGS FINISHED (v26.1)
       Chad, 12 Nov 2026: "i can find many empty spaces at the peripheral background, and the side buildings all have very
       basic and simple details ... Add more trees, fill out empty spaces, improve the overall environment much further."
       His photograph 10 is a ground ringed by big trees, tin roofs and houses, and from the middle of the game's ground the
       bare earth ran out to the painted ring of trees 64 m away on every side. Now:
       1. GROVES: the trees of this country stood round the ground between 16 and 45 m out, each kind one InstancedMesh a
          part (manyOf): his coconut palms and his banana (reuseInEpisode), the episode's rain tree and mango, a second
          banana and a frangipani made for this chapter (a checked picture on white, then Meshy at its highest settings:
          masters/v26.1/env);
       2. a stilt house of the district out past the way in, its water tank and a motorbike by it; a motorbike and a tank at
          the way in; the compressors of the grey building's cooling on its wall;
       3. THE GREY BUILDING as his photographs 5 and 6 show it: rendered walls with their weather streaks (a picture made
          for it: masters/v26.1/env/refs/render.png, made seamless), the louvred windows in dark frames on concrete sills,
          a plinth, a deep eave in shadow, a dark tin roof with its gable, a fascia, a gutter and its downpipe;
       4. THE RED HOUSE east of the turf finished: its back slope and both gables, a soffit and a fascia under the eave,
          trims, and its windows given open shutters and curtains; the red plank building behind the chief canopy and the
          white building behind the west tents given windows of their own.
       Nothing here stands on ground he can walk (stage.keepIn), so nothing here needs a blocker. */
    const R26 = rng(2611), turn26 = () => R26() * 6.283;
    /* [x, z, height in metres] (east, south) */
    const GROVES = {
      /* (his palms at their full level within 32 m of the middle, where the light level's fronds came out soft against
         the sky in the first photographs; at the light level beyond) */
      e4palm1: [[-23, -12, 13], [-27, 4, 14.5], [26, -3, 14], [0, 24.5, 14], [7, 27, 13]],
      e4palm1far: [[-35, -4, 15], [-8, -36, 14], [13, -33, 12], [-28, 28, 13], [-31, 13, 12]],
      e4palm2: [[-18, -19, 12.5], [27, -12, 13.5], [25, 8, 12.5], [16, 19, 12], [-6, 28, 12.5]],
      e4palm2far: [[-29, -18, 13.5], [6, -38, 13], [-16, 31, 12.5]],
      e4banana: [[-19, -3, 4.2], [-18.5, 9.5, 3.8], [-21, 12, 4.4], [-24, -6, 4.0], [17, -11, 4.0], [14.5, 16, 4.0], [-2, 22, 3.8], [-15, 20.5, 4.2]],
      w3banana2: [[-20.5, 1.5, 3.6], [-22.5, 7, 3.4], [-26, -1, 3.8], [23.5, 3, 3.6], [3, 21.5, 3.4], [-26.5, 19.5, 3.8]],
      e4raintree: [[-38, 8, 12], [-24, -27, 11], [19, -40, 12], [33, 2, 13], [-3, 36, 12]],
      e4mango: [[-33, 22, 9], [-2, -42, 10], [22, -22, 9.5], [22, 24, 9]],
      w3frangipani: [[-9.2, 17.6, 4.4], [11.6, 17.4, 4.6], [14.4, -9.6, 4.2]]
    };
    /* a grove: every copy fitted to its height by the file's own height, its foot on the ground, turned its own seeded way;
       the lift a tree standing alone is given (stand: lift 1) */
    function grove(key, list) {
      if (!list.length) return;
      if (!have(key)) { waiting.add(key); return; }
      const turns = list.map(() => turn26());
      parseOnce(key).then(({ scene: src }) => {
        if (!alive) return;
        src.updateMatrixWorld(true);
        const bb = new THREE.Box3().setFromObject(src), H0 = Math.max(1e-3, bb.max.y - bb.min.y);
        manyOf(key, list.map(([x, z, h], i) => { const s = h / H0; return { x, y: -bb.min.y * s, z, ry: turns[i], s }; }), world, 1,
          (made) => { for (const im of made) bronzeLift(im, 1); });
      }).catch(err => { console.warn(key + ' failed to load', err); if (ctx.loadFail) ctx.loadFail(key, err); });
    }
    /* the things by the houses: [key, x, y, z, turn] (a turn of 0 faces the model's own front to the south, +z; the
       compressors' wall plates are behind them, so turned round they hang on the grey wall, 0.3 m up on their brackets) */
    const EDGE_THINGS = [
      ['w3isanhouse', -24, 0, 26.5, Math.atan2(24, -26.5)],          // its front toward the middle of the ground
      ['w3tank', -19.4, 0, 24.2, 0.6], ['w3scooter', -20.6, 0, 21.4, 2.2],
      ['w3tank', -7.3, 0, 15.6, -1.2], ['w3scooter', -7.9, 0, 13.9, 1.25],
      ['w3aircon', 3.0, 0.3, GREY.z - 0.21, Math.PI], ['w3aircon', -4.75, 0.3, GREY.z - 0.21, Math.PI]
    ];
    /* a cloth hung inside a window: soft folds down it, a little lighter at its hem (one picture, every curtain) */
    function makeCurtain() {
      const [c, x] = cnv(64, 128); const g = x.createLinearGradient(0, 0, 64, 0);
      for (let i = 0; i <= 8; i++) { const k = i / 8, f = 0.5 + 0.5 * Math.cos(k * Math.PI * 6); g.addColorStop(k, `rgb(${Math.round(196 + 44 * f)},${Math.round(200 + 40 * f)},${Math.round(204 + 38 * f)})`); }
      x.fillStyle = g; x.fillRect(0, 0, 64, 128);
      x.fillStyle = 'rgba(255,255,255,0.18)'; x.fillRect(0, 116, 64, 12);
      /* (one curtain is about 0.3 m by 1.1 m, and a quad's UVs are metres: the picture spread over one) */
      const t = tex(done(THREE, c, false)); t.wrapS = THREE.RepeatWrapping; t.repeat.set(1 / 0.3, 1 / 1.1); return t;
    }
    /* the shadow a deep eave lays on the wall under it: darkest under the eave, gone 0.8 m down */
    function makeEaveShade() {
      const [c, x] = cnv(4, 64); const g = x.createLinearGradient(0, 0, 0, 64);
      g.addColorStop(0, 'rgba(18,16,14,0.55)'); g.addColorStop(0.45, 'rgba(18,16,14,0.22)'); g.addColorStop(1, 'rgba(18,16,14,0)');
      x.fillStyle = g; x.fillRect(0, 0, 4, 64);
      return tex(done(THREE, c, false));
    }
    function buildEdges() {
      for (const key of Object.keys(GROVES)) grove(key, GROVES[key]);
      /* (the tank's steel came from the generator fully metal: with nothing round it to reflect it drew black (v11.3). It is
         read as a brushed steel's paint here, its own silver showing, the v25.5 law applied where it is drawn) */
      const steel = (m) => m.traverse(q => { if (q.isMesh) for (const mt of [].concat(q.material)) if ('metalness' in mt) { mt.metalness = 0.35; mt.roughness = 0.55; mt.needsUpdate = true; } });
      for (const [key, x, y, z, ry] of EDGE_THINGS) stand(key, x, y, z, ry, { lift: 1, done: key === 'w3tank' ? steel : null });
      const mAlu = M({ color: 0x4a4f53, roughness: 0.55, metalness: 0.35 }), mSill = M({ color: 0xd2d0c8, roughness: 0.9 });
      const mPlinth = surf('render', { tile: 3, roughness: 0.95, tint: 0x8f8f8a }), mRender = surf('render', { tile: 3, roughness: 0.95 });
      const mTinBrown = surf('tin', { tile: 1.8, roughness: 0.7, side: THREE.DoubleSide, tint: 0x7a5546 });
      const mCurtain = M({ map: makeCurtain(), roughness: 0.9 }), mCurtainRose = M({ map: mCurtain.map, color: 0xf1c9c4, roughness: 0.9 });
      const mSoffit = M({ color: 0xe8e2d4, roughness: 0.9, side: THREE.DoubleSide });
      /* ---- 3. THE GREY BUILDING: its front faces north (the turf), its face at z = GREY.z */
      const zf = GREY.z, gx0 = GREY.x0 - 6, gx1 = GREY.x1;
      for (const x of [6.6, 4.2, 1.8, -0.6, -3.0]) {
        const w = 1.1, h = 1.3, y = 1.95, fr = 0.055, pd = 0.045;
        box(mAlu, x, y + h / 2 + fr / 2, zf - pd / 2, w + 2 * fr, fr, pd); box(mAlu, x, y - h / 2 - fr / 2, zf - pd / 2, w + 2 * fr, fr, pd);
        box(mAlu, x - w / 2 - fr / 2, y, zf - pd / 2, fr, h, pd); box(mAlu, x + w / 2 + fr / 2, y, zf - pd / 2, fr, h, pd);
        box(mAlu, x, y, zf - 0.02, 0.04, h, 0.03);
        box(mSill, x, y - h / 2 - fr - 0.035, zf - 0.075, w + 0.28, 0.07, 0.15);
        box(mRender, x, y + h / 2 + fr + 0.08, zf - 0.012, w + 0.34, 0.14, 0.024);
      }
      box(mPlinth, (gx0 + gx1) / 2, 0.23, zf - 0.016, gx1 - gx0, 0.46, 0.032);
      box(mPlinth, gx0 - 0.016, 0.23, zf + 3, 0.032, 0.46, 6);
      /* its roof: a gable along its length, the north slope over the turf, the eave 0.9 m out */
      const eY = 4.22, rY = 5.95, eZ = zf - 0.9, rZ = zf + 3, bZ = zf + 6.9, rx0 = gx0 - 0.6, rx1 = gx1 + 0.1;
      quad(mTinBrown, [rx1, eY, eZ], [rx0, eY, eZ], [rx0, rY, rZ], [rx1, rY, rZ]);
      quad(mTinBrown, [rx0, eY, bZ], [rx1, eY, bZ], [rx1, rY, rZ], [rx0, rY, rZ]);
      /* its gable ends and its back, the gables up under the roof's own line (4.58 m where the slopes cross the walls) */
      planar(mRender, [[gx0, GREY.h, zf], [gx0, GREY.h, zf + 6], [gx0, 4.58, zf + 6], [gx0, rY - 0.04, rZ], [gx0, 4.58, zf]]);
      planar(mRender, [[gx1, GREY.h, zf + 6], [gx1, GREY.h, zf], [gx1, 4.58, zf], [gx1, rY - 0.04, rZ], [gx1, 4.58, zf + 6]]);
      wall(mRender, gx1, zf + 6, gx1, zf, 0, GREY.h); wall(mRender, gx0, zf + 6, gx1, zf + 6, 0, GREY.h);
      quad(mSoffit, [rx0, eY - 0.06, eZ + 0.02], [rx1, eY - 0.06, eZ + 0.02], [rx1, GREY.h - 0.02, zf - 0.005], [rx0, GREY.h - 0.02, zf - 0.005]);
      box(mWhite, (rx0 + rx1) / 2, eY - 0.08, eZ - 0.02, rx1 - rx0, 0.2, 0.04);
      bar(mAlu, [rx0 + 0.1, eY - 0.2, eZ - 0.09], [rx1, eY - 0.2, eZ - 0.09], 0.055, 8);
      bar(mAlu, [gx0 + 0.25, eY - 0.22, eZ - 0.09], [gx0 + 0.25, eY - 0.6, zf - 0.07], 0.04, 6);
      post(mAlu, gx0 + 0.25, zf - 0.07, 0.04, 0.05, eY - 0.6, 6);
      /* the shadow of that eave on the wall */
      const shadeM = B({ map: makeEaveShade(), transparent: true, depthWrite: false, fog: true });
      const shM = new THREE.Mesh(new THREE.PlaneGeometry(gx1 - gx0, 0.85), shadeM);
      shM.position.set((gx0 + gx1) / 2, GREY.h - 0.425, zf - 0.006); shM.rotation.y = Math.PI; shM.renderOrder = 1; world.add(shM); owned.push(shM);
      /* ---- 4. THE RED HOUSE east of the turf (it faces west, its face at x = HOUSE.x) */
      const Hh = HOUSE, xf = Hh.x, zA = Hh.z0 - 0.6, zB = Hh.z1 + 0.6, ridgeX = Hh.x + 4.5;
      quad(mTin, [ridgeX, Hh.h, zA], [ridgeX, Hh.h, zB], [Hh.x + 9.8, Hh.h - 1.55, zB], [Hh.x + 9.8, Hh.h - 1.55, zA]);
      tri(mRedPlank, [Hh.x + 9, Hh.h - 1.4, Hh.z0], [Hh.x, Hh.h - 1.4, Hh.z0], [ridgeX, Hh.h - 0.06, Hh.z0]);
      tri(mRedPlank, [Hh.x, Hh.h - 1.4, Hh.z1], [Hh.x + 9, Hh.h - 1.4, Hh.z1], [ridgeX, Hh.h - 0.06, Hh.z1]);
      wall(mRedPlank, Hh.x + 9, Hh.z1, Hh.x + 9, Hh.z0, 0, Hh.h - 1.4);
      quad(mSoffit, [Hh.x - 0.78, Hh.h - 1.6, zB], [Hh.x - 0.78, Hh.h - 1.6, zA], [Hh.x, Hh.h - 1.4, zA], [Hh.x, Hh.h - 1.4, zB]);
      box(mWhite, Hh.x - 0.8, Hh.h - 1.64, (zA + zB) / 2, 0.04, 0.2, zB - zA);
      box(mWhite, xf - 0.022, 0.72, (Hh.z0 + Hh.z1) / 2, 0.03, 0.08, Hh.z1 - Hh.z0);
      for (const z of [Hh.z0 + 0.07, Hh.z1 - 0.07]) box(mWhite, xf - 0.022, (0.7 + Hh.h - 1.4) / 2, z, 0.03, Hh.h - 2.1, 0.14);
      for (const [i, z] of [-4.5, -1.5, 1.5, 4.2].entries()) {
        /* two shutters of red planks in white frames, swung open flat against the planks beside the window */
        for (const s of [-1, 1]) {
          const cz = z + s * 0.83;
          box(mRedPlank, xf - 0.05, 2.05, cz, 0.03, 1.08, 0.48);
          for (const dz of [-0.225, 0.225]) box(mWhite, xf - 0.068, 2.05, cz + dz, 0.012, 1.08, 0.035);
          for (const dy of [-0.52, 0.52]) box(mWhite, xf - 0.068, 2.05 + dy, cz, 0.012, 0.04, 0.48);
        }
        /* curtains drawn to each side inside */
        for (const s of [-1, 1]) {
          const m = i % 2 ? mCurtainRose : mCurtain, cz = z + s * 0.33;
          quad(m, [xf - 0.016, 1.52, cz - 0.15], [xf - 0.016, 1.52, cz + 0.15], [xf - 0.016, 2.58, cz + 0.15], [xf - 0.016, 2.58, cz - 0.15]);
        }
      }
      /* the red plank building behind the chief canopy: its window's curtains, the fascia of its eave */
      const P0 = PLANK;
      for (const s of [-1, 1]) quad(mCurtain, [10.8 + s * 0.36 + 0.14, 1.27, P0.z - 0.016], [10.8 + s * 0.36 - 0.14, 1.27, P0.z - 0.016], [10.8 + s * 0.36 - 0.14, 2.43, P0.z - 0.016], [10.8 + s * 0.36 + 0.14, 2.43, P0.z - 0.016]);
      box(mWhite, (P0.x0 - 0.4 + P0.x1 + 2) / 2, 3.47, P0.z - 0.72, P0.x1 + 2 - (P0.x0 - 0.4), 0.17, 0.04);
      /* the white building behind the west tents (photograph 10): its windows, dark glass in black frames */
      const mBlack = M({ color: 0x1b1c1d, roughness: 0.6 }), mGlass = M({ color: 0x23292c, roughness: 0.15, metalness: 0.6 });
      for (const z of [-3.6, 1.9, 7.2]) {
        wall(mGlass, -12.365, z + 0.55, -12.365, z - 0.55, 1.22, 2.12);
        box(mBlack, -12.35, 2.15, z, 0.04, 0.05, 1.2); box(mBlack, -12.35, 1.19, z, 0.04, 0.05, 1.2);
        for (const dz of [-0.575, 0, 0.575]) box(mBlack, -12.35, 1.67, z + dz, 0.04, 0.92, 0.045);
      }
      flush();
    }
    buildEdges();
