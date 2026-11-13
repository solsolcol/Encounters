    /* ================================================================ THE OFFERING TABLES (photographs 10, 9, 4, 8)
       Three steps under white cloth, the lowest in front; a bright green satin skirt to the ground hung with swags of
       jasmine lattice and marigold. Everything that stands on them is a real model, made from a crop of his photograph. */
    const mCloth = M({ color: 0xf5f4ef, roughness: 0.86 });
    const mSkirt = surf('skirt', { tile: [0.9, 0.78], mirror: 'u', roughness: 0.38, side: THREE.DoubleSide });
    const SWAG = { w: 1.25, h: 0.6 };
    /* one garland swag hung from (x0, z0) to (x1, z1) at height y, facing the left of that way */
    function garland(x0, z0, x1, z1, y) {
      const len = Math.hypot(x1 - x0, z1 - z0), nx = -(z1 - z0) / len, nz = (x1 - x0) / len, o = 0.018;
      const g = new THREE.PlaneGeometry(len, SWAG.h * len / SWAG.w);
      const m = new THREE.Mesh(g, mSwagPlane); m.position.set((x0 + x1) / 2 + nx * o, y - SWAG.h * len / SWAG.w / 2 + 0.03, (z0 + z1) / 2 + nz * o);
      m.rotation.y = Math.atan2(nx, nz); world.add(m); owned.push(m);
    }
    /* (a plane's own UVs are 0..1 with v up, and an ImageBitmap's first row is its top: the picture is turned once here) */
    const mSwagPlane = B({ color: SURF.swag[0], alphaTest: 0.5, side: THREE.DoubleSide });
    surfLoad('swag').then(t0 => { if (!t0 || !alive) return; const t = t0.clone(); t.needsUpdate = true; madeTex.push(t);
      t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping; t.repeat.set(1, -1); t.offset.set(0, 1); mSwagPlane.map = t; mSwagPlane.color.set(0xffffff); mSwagPlane.needsUpdate = true; });
    function buildTables() {
      const T0 = TABLES, n = T0.tops.length;
      for (let k = 0; k < n; k++) {                                          // k 0 the front step
        const zf = T0.z1 - k * T0.step, zb = zf - T0.step, top = T0.tops[k];
        box(mCloth, (T0.x0 + T0.x1) / 2, top / 2, (zf + zb) / 2, T0.x1 - T0.x0, top, T0.step);
        /* the skirt down each side of this step, and a garland on it */
        wall(mSkirt, T0.x1 + 0.01, zf, T0.x1 + 0.01, zb, 0, top - 0.02); wall(mSkirt, T0.x0 - 0.01, zb, T0.x0 - 0.01, zf, 0, top - 0.02);
        garland(T0.x1 + 0.012, zf, T0.x1 + 0.012, zb, top - 0.03); garland(T0.x0 - 0.012, zb, T0.x0 - 0.012, zf, top - 0.03);
      }
      /* the skirt across the front, and four garlands along it */
      wall(mSkirt, T0.x0 - 0.01, T0.z1 + 0.01, T0.x1 + 0.01, T0.z1 + 0.01, 0, T0.tops[0] - 0.02);
      for (let k = 0; k < 4; k++) garland(T0.x0 + k * SWAG.w, T0.z1 + 0.012, T0.x0 + (k + 1) * SWAG.w, T0.z1 + 0.012, T0.tops[0] - 0.03);
      solidBox(T0.x1 - T0.x0 + 0.5, 1.5, T0.z1 - T0.z0 + 0.3, 0, 0.75, (T0.z0 + T0.z1) / 2);
    }
    /* WHAT STANDS ON AND ROUND THEM. Each list is places in the world: x, y (the step's top), z, and a turn. A thing is
       drawn once its model is in the build (`have`); until then its key is listed as waiting (stage.info). */
    function dressTables() {
      const [y0, y1, y2] = TABLES.tops, zf = -10.4, zm = -11.2, zb = -12.0;
      stand('w3wheel', WHEEL.x, y2, WHEEL.z, 0);                                                   // the great bai sri and its wheel of marigolds
      /* the orange and gold parasol over it (v26.2 debug: drawn a tenth larger, its canopy lifted clear of the wheel's top,
         which it touched at 2.72 m: measured) */
      stand('w3parasol', PARASOL.x, 0, PARASOL.z, 0, { s: 1.1 });
      many('w3naga', [{ x: 1.15, y: y2, z: -11.95, ry: -0.5 }, { x: 1.6, y: y2, z: -12.1, ry: -0.75 }, { x: 2.05, y: y2, z: -11.9, ry: -1.0 }], world, 0.8);
      many('w3tower', [{ x: -3.25, y: 0, z: -11.0, ry: 0.3 }, { x: 3.25, y: 0, z: -11.0, ry: 2.1 }], world, 2.8);
      /* (M8, the photographs laid beside the game: NO bai sri in a golden bowl stands on the offering tables in any of
         them (3, 4, 9, 10): those are the devotees' own, carried and presented. The six I stood here at M3 are gone, and
         the tables hold what the photographs show instead: white chrysanthemums in silver bowls either side of the
         fruit before the wheel and at the ends, roses at the front corners, soda in rows of red, green and orange) */
      many('w3chrys', [{ x: -0.92, y: y2, z: -11.86, ry: 0.4, s: 1.3 }, { x: 0.7, y: y2, z: -11.8, ry: 2.1, s: 1.3 }, { x: -2.08, y: y1, z: -11.22, ry: 1.2, s: 1.3 }, { x: 2.08, y: y1, z: -11.22, ry: 3.4, s: 1.3 }], world, 0.3);   // (a bunch is as wide as a fruit tray in photograph 9: the model at 1.3. Its full level is 36,700 triangles, Hunyuan's least, and all four are drawn if one is in view: the size given here brings it in inside 7 m, where the far level's dome would begin to show its facets)
      many('w3roses', [{ x: 2.14, y: y0, z: -10.46, ry: 0.25 }, { x: -2.2, y: y0, z: -10.46, ry: -0.3 }], world, 0.25);
      many('w3pewter', [{ x: -1.55, y: y2, z: zb - 0.05, ry: 0.7 }, { x: -0.45, y: y1, z: zm + 0.1, ry: 1.9 }, { x: 0.5, y: y1, z: zm + 0.1, ry: 0.3 }], world, 0.5);
      many('w3fruit', [{ x: -1.65, y: y1, z: zm + 0.16, ry: 0.2 }, { x: 0, y: y1, z: zm - 0.12, ry: 1.1 }, { x: 1.65, y: y1, z: zm + 0.16, ry: 2.4 }, { x: -0.4, y: y0, z: zf - 0.1, ry: 0.6 }, { x: 1.2, y: y1, z: zm - 0.12, ry: 1.7 }], world, 0.3);
      many('w3sweets', [{ x: -1.76, y: y0, z: zf - 0.1, ry: 0.3 }, { x: 0.5, y: y0, z: zf - 0.12, ry: 1.5 }, { x: -1.12, y: y2, z: -12.18, ry: 2.6 }], world, 0.2);
      many('w3khantok', [{ x: -1.1, y: y0, z: zf - 0.08, ry: 0.9 }, { x: 1.22, y: y0, z: zf - 0.06, ry: 2.0 }], world, 0.25);
      const talls = [{ x: -2.95, y: 0, z: -10.25, ry: 0.2 }, { x: 2.95, y: 0, z: -10.25, ry: 1.4 }, { x: -2.2, y: y2, z: -12.2, ry: 0 }, { x: 2.3, y: y2, z: -12.25, ry: 0.8 }];
      many('w3candle', talls, world, 1.25);
      many('w3purple', [{ x: -3.9, y: 0, z: -10.2, ry: 0.5 }, { x: 3.9, y: 0, z: -10.2, ry: 2.2 }], world, 1.1);
      for (const sx of [-1, 1]) solidBox(0.7, 1.5, 0.7, sx * 3.25, 0.75, -11.0);
      /* THE SMALLER OFFERINGS (photographs 9, 10, 3): small candles in pink and blue along the front edge; candles in
         clay pots between the bai sri; soda in rows of red, green and orange, and water; baskets of sticky rice; a
         boiled chicken on its plate; green coconuts; small bai sri of leaf and lotus bud. One model each: a colour is a
         turn of its hue, and where each stands is a seeded scatter of a hand's width, so no row is ruled */
      const rnd = rng(9126), j = (k = 0.03) => (rnd() - 0.5) * 2 * k, turn = () => rnd() * 6.283;
      const hued = (deg) => (made) => { for (const im of made) hueTurn(im.material, deg); };
      const smalls = []; for (let x = -2.31; x <= 2.32; x += 0.33) smalls.push({ x: x + j(0.02), y: y0, z: -10.09 + j(0.012), ry: turn() });
      many('w3candlesmall', smalls.filter((_, i) => i % 2 === 0), world, 0.24);                    // pink, as made
      many('w3candlesmall', smalls.filter((_, i) => i % 2 === 1), world, 0.24, hued(-118));        // and blue
      const mids = [-1.62, -0.82, 0.86, 1.64].map(x => ({ x: x + j(), y: y1, z: zm - 0.3 + j(), ry: turn() }))
        .concat([{ x: -0.5, y: y2, z: zb - 0.22, ry: 0 }, { x: 0.55, y: y2, z: zb - 0.2, ry: 1 }])
        /* (photograph 10: yellow candles of this height stand among everything on the front step too) */
        .concat([-1.9, -0.95, 0.25, 1.05].map(x => ({ x: x + j(0.015), y: y0, z: -10.72 + j(0.01), ry: turn() })));
      many('w3candlemid', mids, world, 0.66);
      /* (every candle's wick, for the night's flames: c_zfx.js. `s` is the flame's size on a candle of that size) */
      stageList.flames = talls.map(c => ({ x: c.x, y: c.y + 1.25, z: c.z, s: 1.7 })).concat(mids.map(c => ({ x: c.x, y: c.y + 0.66, z: c.z, s: 1.15 })), smalls.map(c => ({ x: c.x, y: c.y + 0.24, z: c.z, s: 0.7 })));
      const rows = (x0, zs, xs) => { const L = []; for (const z of zs) for (const dx of xs) L.push({ x: x0 + dx + j(0.006), y: y0, z: z + j(0.006), ry: turn() }); return L; };
      const sodaZ = [-10.33, -10.42, -10.51];
      const soda = [rows(0.02, sodaZ, [-0.09]), rows(0.02, sodaZ, [0]), rows(0.02, sodaZ, [0.09])];   // red, green, orange
      /* a row of six along a step's edge, two of each colour side by side (photograph 9: red red, green green, orange orange) */
      const sodaRow = (x0, y, z) => { for (let i = 0; i < 6; i++) soda[i >> 1].push({ x: x0 + i * 0.09 + j(0.006), y, z: z + j(0.008), ry: turn() }); };
      sodaRow(-1.58, y2, -11.68); sodaRow(0.78, y1, -10.88); sodaRow(-1.25, y1, -10.88); sodaRow(1.46, y0, -10.7);
      many('w3soda', soda[0], world, 0.22);                                                        // red
      many('w3soda', soda[1], world, 0.22, hued(112));                                             // green
      many('w3soda', soda[2], world, 0.22, hued(26));                                              // orange
      many('w3water', rows(0.86, [-10.34, -10.43], [-0.045, 0.045]), world, 0.21);
      many('w3kratip', [{ x: -0.78, y: y0, z: -10.36, ry: 0.4 }, { x: -0.7, y: y0, z: -10.5, ry: 2.0 }, { x: -0.8, y: y0, z: -10.62, ry: 4.1 },
                        { x: -1.76, y: y2, z: -11.7, ry: 1.1 }, { x: -0.12, y: y1, z: -10.9, ry: 3.0 }, { x: -0.24, y: y1, z: -10.98, ry: 5.2 }], world, 0.14);
      many('w3chicken', [{ x: 1.6, y: y0, z: -10.42, ry: 0.5 }], world, 0.3);
      many('w3coconut', [{ x: -1.5, y: y0, z: -10.36, ry: 0.3 }, { x: -1.44, y: y0, z: -10.6, ry: 2.6 }, { x: 0.36, y: y1, z: zm + 0.3, ry: 1.2 }], world, 0.19);
      many('w3smallbaisri', [{ x: -2.05, y: y2, z: -11.86, ry: 0.6 }, { x: -1.18, y: y1, z: -11.3, ry: 2.4 }], world, 0.38);
      /* the clay pot of sand on the gravel before the tables, where the spent sticks go (photograph 10) */
      many('w3claypot', [{ x: 0.85, y: 0, z: -9.68, ry: 0.7 }], world, 0.32);
      solidBox(0.5, 0.7, 0.5, 0.85, 0.35, -9.68);
      namesSheet();
    }
    /* THE SHEET ON THE WHEEL (photographs 4, 9, 10): a printed list clipped to the great bai sri's left side. In the
       photographs it is a list of names: nobody's name is copied (the repository is public, and they are real people),
       so it is drawn as what a phone sees of it at that distance, rows of grey that cannot be read (words drawn into
       the world are art: v14.5). A sheet of paper is a flat thing: this is its real shape, not a stand-in */
    function namesSheet() {
      const [c, x] = cnv(256); c.height = 362;
      x.fillStyle = '#f4f3ee'; x.fillRect(0, 0, 256, 362);
      x.fillStyle = '#3d5a86'; x.fillRect(18, 16, 220, 15);                                      // its heading: one bar
      const r = rng(5512);
      for (let i = 0; i < 24; i++) { const y = 40 + i * 12.6;
        x.fillStyle = i % 2 ? '#e3e6ec' : '#f4f3ee'; x.fillRect(18, y - 1.5, 220, 12.6);         // ruled rows, shaded in turn
        x.fillStyle = '#5a5d66'; x.fillRect(22, y + 2.5, 9, 5);                                    // a number
        x.fillStyle = '#44464e'; let px = 40; for (let w = 0, n = 2 + Math.floor(r() * 3); w < n; w++) { const len = 14 + r() * 30; x.fillRect(px, y + 2.5, len, 5); px += len + 5; } }
      const t = tex(new THREE.CanvasTexture(c)); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
      const m = new THREE.Mesh(new THREE.PlaneGeometry(0.297, 0.42), M({ map: t, roughness: 0.9, side: THREE.DoubleSide }));
      m.position.set(WHEEL.x - 0.37, TABLES.tops[2] + 0.7, WHEEL.z + 0.2); m.rotation.set(-0.12, 0.1, 0.17, 'YXZ');
      world.add(m); owned.push(m);
    }

    /* a plain folding table (a white top on blue steel legs: photographs 11, 12). A stand-in drawn in code until its
       model lands: it is furniture nobody looks at, under a dozen bai sri */
    const mBlueLeg = M({ color: 0x2b55a8, roughness: 0.5, metalness: 0.3 }), mTop = M({ color: 0xecebe6, roughness: 0.6 });
    function foldTable(x, z, ry, w = 1.8, d = 0.75, h = 0.75) {
      box(mTop, x, h - 0.02, z, w, 0.04, d, ry);
      const c = Math.cos(ry), s = Math.sin(ry);
      for (const [lx, lz] of [[-w / 2 + 0.08, -d / 2 + 0.08], [w / 2 - 0.08, -d / 2 + 0.08], [w / 2 - 0.08, d / 2 - 0.08], [-w / 2 + 0.08, d / 2 - 0.08]])
        post(mBlueLeg, x + lx * c + lz * s, z - lx * s + lz * c, 0.016, 0, h - 0.04, 6);
      solidBox(w + 0.1, 1.4, d + 0.1, x, 0.7, z, ry);
      return h;
    }
    const TON_TABLE = { x: -6.1, z: 8.3, ry: 0.0 }, WEST_TABLE = { x: -7.2, z: -6.5, ry: Math.PI / 2 };
    function buildBaiSriTables() {
      const rnd = rng(2611);
      const rows = (T0, n, key, size, own = -1) => {
        const h = foldTable(T0.x, T0.z, T0.ry), c = Math.cos(T0.ry), s = Math.sin(T0.ry), L = [];
        for (let i = 0; i < n; i++) { const lx = -0.72 + (i % (n / 2)) * (1.44 / (n / 2 - 1)), lz = i < n / 2 ? -0.17 : 0.18;
          L.push({ x: T0.x + lx * c + lz * s, y: h, z: T0.z - lx * s + lz * c, ry: rnd() * 6.28, s: size }); }
        many(key, L.filter((_, i) => i !== own), world, 0.6);
        return L;
      };
      stageList.tonBai = rows(TON_TABLE, 8, 'w3baisri', 0.85, 7)[7];           // Ton's group's, at the way in: one of them is his (the corner by Ton is his own: a thing by itself, c_zfx.js)
      rows(WEST_TABLE, 10, 'w3pewter', 1);                                     // the table by the west tents (photographs 11, 12)
    }
    const stageList = {};

    /* ================================================================ THE TENTS, AND WHAT IS UNDER THEM */
    const mCarpet = surf('carpet', { tile: [2.4, 1.6], clamp: true, roughness: 0.95 });
    const mMat = surf('mat', { tile: 1.1, mirror: 'uv', roughness: 0.9 });
    const mStripe = surf('mat', { tile: 0.8, mirror: 'uv', tint: 0xc8d8ff, roughness: 0.9 });
    /* (the turquoise mat with round flowers that lies by the hermit's sofa: photograph 12. One picture, one mat) */
    const mBlueMat = surf('bluemat', { tile: [1.9, 1.26], clamp: true, roughness: 0.92 });
    /* a rug or a mat lying on the turf: its long side `w` along its own x, turned ry */
    function rug(mat, x, z, w, d, ry, y = 0.007) {
      const c = Math.cos(ry), s = Math.sin(ry), P = (lx, lz) => [x + lx * c + lz * s, y, z - lx * s + lz * c];
      quad(mat, P(-w / 2, d / 2), P(w / 2, d / 2), P(w / 2, -d / 2), P(-w / 2, -d / 2));
    }
    function buildTents() {
      const opts = { valance: 0xf4f4f0, swagCols: [0x1ca548, 0xf4f4f0] };
      for (const T0 of [TENT_W1, TENT_W2, TENT_E]) { const C = tent(T0.x, T0.z, opts); for (const [x, z] of C) solidBox(0.16, 2.2, 0.16, x, 1.1, z); }
      /* west tent 1: the hermit in brown and the master in red on pale green sofas, facing east (a third sofa stands
         empty: the second master in white sits with Grandmaster Pho, photographs 1 and 5); straw mats and a striped
         mat before them */
      rug(mMat, -8.1, -1.0, 3.6, 1.8, Math.PI / 2); rug(mStripe, -7.0, -0.3, 1.9, 0.9, Math.PI / 2, 0.009);
      many('w3sofa', [{ x: -10.25, y: 0, z: -2.2, ry: Math.PI / 2 }, { x: -10.25, y: 0, z: -0.95, ry: Math.PI / 2 }, { x: -10.25, y: 0, z: 0.3, ry: Math.PI / 2 }], world, 0.9);
      solidBox(1.0, 1.4, 3.9, -10.3, 0.7, -0.95);
      many('w3petalsteel', [{ x: -9.1, y: 0, z: -1.6, ry: 0 }], world, 0.3);
      /* (12 Nov, the plan's lists read against the build: its "blue patterned mat" and "the small real things on the low
         tables: glasses, a roll of tissue" were never made. Photograph 12: a turquoise mat with round flowers lies by
         the hermit's sofa and under its end; a bottle of water and a glass of red soda stand by his bowl of petals) */
      rug(mBlueMat, -9.92, -2.6, 1.9, 1.26, 0, 0.0085);
      many('w3glass', [{ x: -9.32, y: 0.008, z: -1.92, ry: 0.6 }], world, 0.15);
      many('w3water', [{ x: -9.46, y: 0.008, z: -1.74, ry: 2.2 }], world, 0.21);
      /* (v26.2 debug: at (-7.0, 1.0) it stood on the tent's corner pole, which went up through it: Chad's picture, measured.
         Along the tent's open front now, 0.74 m from the pole, clear of those who kneel there at the blessing and of the
         stack of rolled mats ending A lays south of it; and a thing he walks round) */
      many('w3purple', [{ x: -6.75, y: 0, z: 0.3, ry: 1.0 }], world, 1.1); solidBox(0.62, 1.4, 0.62, -6.75, 0.7, 0.3);
      /* west tent 2: the hermit in the yellow shawl */
      rug(mMat, -8.1, 5.0, 3.2, 1.8, Math.PI / 2);
      many('w3sofa', [{ x: -10.25, y: 0, z: 5.0, ry: Math.PI / 2 }], world, 0.9);
      solidBox(1.0, 1.4, 1.5, -10.3, 0.7, 5.0);
      /* the east tent: the monks' row, the naga staff and the peacock fan, low round trays with coconuts and water */
      rug(mMat, 8.1, -2.0, 3.6, 1.8, Math.PI / 2);
      many('w3chair', MONKS.zs.map(z => ({ x: MONKS.chair, y: 0, z, ry: -Math.PI / 2, s: MONKS.s })), world, 1.28);   // (a tall carved armchair, drawn at 1.28 m: its seat 0.466 m up)
      /* (one blocker for the row, as it was: from the sitters' knees, half a metre ahead of their spots, to the chairs' backs) */
      { const x0 = MONKS.x - 0.5, x1 = MONKS.chair + MONKS.half; solidBox(x1 - x0, 1.4, 3.6, (x0 + x1) / 2, 0.7, -2.0); }
      many('w3khantok', [{ x: 9.2, y: 0, z: -2.6, ry: 0.4 }, { x: 9.2, y: 0, z: -1.2, ry: 1.9 }], world, 0.25);
      stand('w3nagastaff', 10.55, 0, -3.75, 0.3);
      /* (the fan 4 cm clear of the third monk's chair: at z -0.15 its grille's edge stood in the chair's back corner, v26.2) */
      stand('w3fan', 10.5, 0.02, -0.05, -1.2);
      /* THE CHIEF CANOPY (photographs 1, 5, 6): a dark top, a valance of gold and lime in swags, one pole wrapped in
         puffs of lime cloth; maroon carpets deep in petals; his bench, a carved chair, a low dark table */
      /* (its drapes are deep: photographs 5 and 6 are taken under them, and what fills their top is swags of lime, gold
         and orange satin, not the dark cloth over them) */
      const C = tent(CHIEF.x, CHIEF.z, { w: CHIEF.w, eave: CHIEF.eave, peak: CHIEF.peak, ry: CHIEF.ry, roof: satinRoof(0x2c4632, 0x1d2c22), valance: 0xf2c63c, wide: true, band: 0.4,
        swags: 3, swagCols: [0xb6d62e, 0xe2a61a, 0xf08a1c], swagDepth: 0.8, swagDrop: 0.36, swagStep: 1 });
      for (const [x, z] of C) solidBox(0.16, 2.2, 0.16, x, 1.1, z);
      /* THE LIME POLE (photographs 1, 5, 6): the canopy's front right pole, the one before the bench's right hand, wrapped
         from the ground to the eave in seven gathered tiers of lime cloth, each wider than it is tall and a little
         narrower than the one under it. The model is one puff of white satin (0.75 m tall, 0.52 across): each is drawn
         wider and pressed down to 0.46 m about its own foot, and tinted */
      /* (v26.2 debug: seven tiers 0.46 m tall on a rise of 0.31 reached 2.33 m, through the gold valance and the swags at
         the canopy's corner (measured: tools/probes/clipscan.mjs). Seven tiers 0.40 m tall on a rise of 0.245 end at
         1.88 m, under the valance, still overlapping so no pole shows between) */
      { const [px, pz] = C[0], tiers = [0, 1, 2, 3, 4, 5, 6].map(k => ({ x: px, y: 0.01 + k * 0.245, z: pz, ry: k * 1.9, s: 1.22 - k * 0.04 }));
        many('w3puff', tiers, world, 0.75, (made) => { const m4 = new THREE.Matrix4(), sq = new THREE.Matrix4();
          for (const im of made) { im.material.color.set(0xa6d82a);
            tiers.forEach((t, i) => { im.getMatrixAt(i, m4);
              sq.makeTranslation(0, t.y, 0).multiply(m4.clone().makeScale(1, 0.40 / (0.75 * t.s), 1)).multiply(new THREE.Matrix4().makeTranslation(0, -t.y, 0));
              im.setMatrixAt(i, sq.multiply(m4)); });
            im.instanceMatrix.needsUpdate = true; im.computeBoundingSphere(); } }); }
      /* his bench (brown hardwood: the model came lacquer red, its hue turned and darkened here), drawn 2.05 m long for
         two; the low table at his right hand's front with a bowl of petals and a bai sri set down on it; a carved chair
         beyond it; maroon carpets before the bench where people kneel; purple flowers at both ends */
      const BA = (a, b) => benchAt(a, b), along = BENCH.ry + Math.PI / 2;
      { const [x1, z1] = BA(0.15, 1.95), [x2, z2] = BA(-1.95, 1.8); rug(mCarpet, x1, z1, 2.4, 1.6, along); rug(mCarpet, x2, z2, 2.4, 1.6, along + 0.07, 0.009); }
      stand('w3bench', BENCH.x, 0, BENCH.z, BENCH.ry, { s: 1.1, done: (m) => { m.scale.x *= 1.24; m.traverse(q => { if (q.isMesh) { hueTurn(q.material, 17); q.material.color.multiplyScalar(0.72); } }); } });
      solidBox(2.2, 1.4, 0.8, BENCH.x, 0.7, BENCH.z, BENCH.ry);
      { const [x, z] = BA(2.25, -0.05); stand('w3chair', x, 0, z, BENCH.ry - 0.25, { s: 1.11 }); solidBox(0.9, 1.4, 0.9, x, 0.7, z, BENCH.ry); }
      /* (v26.2 debug, measured by tools/probes/clipscan.mjs: the low table, a metre square at (1.05, 1.1), stood in the lime
         pole's lowest puffs, under Grandmaster Pho's right foot and in the knee of the young man who kneels before him (and
         his bai sri, set on it at the last, stood in its glass). Drawn 0.7 m square now, a little to his right, every one of
         them 15 cm or more clear; and what stands on it is laid out on its smaller top, the bai sri's place left free) */
      const TB = BA(1.2, 0.95);
      stand('w3lowtable', TB[0], 0, TB[1], BENCH.ry + 0.12, { done: (m) => { m.scale.x *= 0.7; m.scale.z *= 0.7; } }); solidBox(0.74, 1.0, 0.74, TB[0], 0.5, TB[1], BENCH.ry);
      { const [bx, bz] = BA(1.36, 1.12), [gx, gz] = BA(0.1, 0.72), [wx, wz] = BA(1.38, 0.78);
        many('w3petalbowl', [{ x: bx, y: 0.38, z: bz, ry: 0 }, { x: gx, y: 0, z: gz, ry: 1 }], world, 0.3);
        many('w3pewter', [{ x: wx, y: 0.38, z: wz, ry: 0.8 }], world, 0.5); }
      { const [gx, gz] = BA(0.95, 1.2), [tx, tz] = BA(1.12, 1.22); many('w3glass', [{ x: gx, y: 0.38, z: gz, ry: 1.3 }], world, 0.15); many('w3tissue', [{ x: tx, y: 0.38, z: tz, ry: 0.4 }], world, 0.11); }
      { const [ax, az] = BA(-1.55, 0.15), [cx2, cz2] = BA(2.95, 0.7); many('w3purple', [{ x: ax, y: 0, z: az, ry: 2.0 }, { x: cx2, y: 0, z: cz2, ry: 0.4 }], world, 1.1);
        /* (v26.2 debug: he could walk into the flowers, the lens inside the bouquet: each a thing he walks round) */
        solidBox(0.62, 1.4, 0.62, ax, 0.7, az); solidBox(0.62, 1.4, 0.62, cx2, 0.7, cz2); }
    }

    /* ================================================================ THE BANNERS, THE POLE, THE FLAGS (photographs 8, 10)
       Long banners of cloth in tiers on tall bamboo: fourteen in a row behind the tables, four along the west side; six
       colours. Each is one picture of a tiered banner (white, cut out) crossed with itself and tinted, hung from the tip
       of its pole; they turn a little in the wind (frame: windTick). */
    const BANNER = { w: 0.36, h: 3.2, top: 4.85 };
    const BCOL = { white: 0xf4f2ec, yellow: 0xf3c11c, red: 0xd9323a, purple: 0x8e52cc, pink: 0xf08cb6, green: 0x62bd72 };
    const banners = { im: null, list: [] };
    function buildBanners() {
      const order = ['white', 'yellow', 'red', 'white', 'purple', 'yellow', 'pink', 'red', 'white', 'purple', 'pink', 'yellow', 'green', 'white'];
      const mBamboo = M({ color: 0x9a8a5c, roughness: 0.8 });
      const rnd = rng(8104);
      const put = (x, z, col, lean) => {
        const tipX = x + Math.sin(lean) * 0.5, tipZ = z + Math.cos(lean) * 0.5;
        bar(mBamboo, [x, 0, z], [x + Math.sin(lean) * 0.12, 4.2, z + Math.cos(lean) * 0.12], 0.028, 6);
        bar(mBamboo, [x + Math.sin(lean) * 0.12, 4.2, z + Math.cos(lean) * 0.12], [tipX, BANNER.top + 0.12, tipZ], 0.02, 6);
        banners.list.push({ x: tipX, y: BANNER.top, z: tipZ, col, ph: rnd() * 6.28, ry: rnd() * 3.14, k: 0.7 + rnd() * 0.6 });
      };
      /* (v26.2 debug, measured by tools/probes/clipscan.mjs and seen in Chad's pictures of 13 Nov 2026: the row behind the
         tables stood under the parasol's rim (and its west end under the open shed's roof); the west row's first hung
         through the shed's roof and beams on its bamboo, its last through the west tent's eave. The row stands 0.8 m
         further back; the west row between the shed and the first tent, and one between the two tents) */
      order.forEach((c, i) => put(-11 + i * (22 / 13), -15.3 + (rnd() - 0.5) * 0.5, c, 0.2 + rnd() * 0.5));
      [['pink', -6.9], ['white', -5.6], ['yellow', -4.3], ['red', 2.0]].forEach(([c, z]) => put(-11.5 + (rnd() - 0.5) * 0.3, z, c, 1.4 + rnd() * 0.4));
      /* EACH IS ONE CLOTH, hanging DOWN from its own origin (so a turn about the origin is a swing from the tip), turned to
         face the middle of the ground (v26.2 debug: the picture crossed with itself read as a square pillar close by, and
         from far off as a red or yellow block: Chad's pictures) */
      for (const b of banners.list) b.ry = Math.atan2(0 - b.x, 1.5 - b.z) + (b.ry - Math.PI / 2) * 0.25;
      const g = new THREE.BufferGeometry(), w = BANNER.w / 2, h = BANNER.h, P = [], U = [], N = [];
      for (const [ax, az] of [[1, 0]]) {
        const v = [[-w * ax, 0, -w * az, 0, 0], [w * ax, 0, w * az, 1, 0], [w * ax, -h, w * az, 1, 1], [-w * ax, -h, -w * az, 0, 1]];
        for (const k of [0, 2, 1, 0, 3, 2]) { P.push(v[k][0], v[k][1], v[k][2]); U.push(v[k][3], v[k][4]); N.push(az, 0, ax); }
      }
      g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(U, 2));
      g.setAttribute('normal', new THREE.Float32BufferAttribute(N, 3));
      const mBan = M({ color: 0xffffff, roughness: 0.85, alphaTest: 0.5, side: THREE.DoubleSide });
      surfLoad('banner').then(t0 => { if (!t0 || !alive) return; const t = t0.clone(); t.needsUpdate = true; madeTex.push(t);
        t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping; mBan.map = t; mBan.needsUpdate = true; });   // (v 0 at the tip: the picture's first row, its top)
      const im = new THREE.InstancedMesh(g, mBan, banners.list.length);
      const col = new THREE.Color();
      banners.list.forEach((b, i) => im.setColorAt(i, col.set(BCOL[b.col])));
      im.instanceColor.needsUpdate = true; im.frustumCulled = false;
      world.add(im); owned.push(im); banners.im = im;
      windTick(0);
    }
    const _wm = new THREE.Matrix4(), _wq = new THREE.Quaternion(), _we = new THREE.Euler(), _wp = new THREE.Vector3(), _ws = new THREE.Vector3(1, 1, 1);
    /* THE WIND (the plan's §3.7): the banners swing from their tips and turn a little. t is the clock that is running:
       the film's in a film (so a seek lands on the same picture, v6.4), the wall's in play */
    function windTick(t) {
      const im = banners.im; if (!im) return;
      banners.list.forEach((b, i) => {
        const a = Math.sin(t * 0.9 * b.k + b.ph), c = Math.sin(t * 0.53 * b.k + b.ph * 1.7);
        _we.set(0.045 * a + 0.02, b.ry + 0.5 * c, 0.035 * c, 'YXZ'); _wq.setFromEuler(_we);
        im.setMatrixAt(i, _wm.compose(_wp.set(b.x, b.y, b.z), _wq, _ws));
      });
      im.instanceMatrix.needsUpdate = true;
    }
    /* the pole wrapped in tiers of coloured satin, and the strings of small flags that run from its top (photograph 8) */
    const TOP = [POLE.x, POLE.h - 0.25, POLE.z];
    function buildPole() {
      const mPole = M({ color: 0x8c8474, roughness: 0.7 });
      post(mPole, POLE.x, POLE.z, 0.05, 0, POLE.h, 8, 0.035);
      const puff = (y, hh, r, hex) => {
        const pts = []; for (let i = 0; i <= 10; i++) { const k = i / 10; pts.push(new THREE.Vector2(0.05 + r * Math.pow(Math.sin(k * Math.PI), 0.6), k * hh)); }
        geo(satin(hex), new THREE.LatheGeometry(pts, 14), _gm.makeTranslation(POLE.x, y, POLE.z), 2.0, hh / 0.7);
      };
      /* from the top down, as photograph 10 shows it: teal, pink-white, yellow, yellow, red; then plainer ones below */
      puff(9.15, 0.75, 0.2, 0x16a698); puff(8.45, 0.72, 0.27, 0xf6dfe6); puff(7.8, 0.66, 0.3, 0xf5c81c); puff(7.2, 0.62, 0.29, 0xf2b616); puff(6.35, 0.86, 0.33, 0xd72a34);
      /* the strings: from the pole's top out to the trees, the tents, the hall and the sheds */
      /* (v26.2 debug: each string tied to a real thing. Two ran into the trees' crowns, their flags among the leaves, and one
         onto the shed's roof, its last flags through the tin (Chad's pictures; measured). They end now where each first
         meets its tree's leaves (tools/probes/stringend.mjs), on the tents' and the chief canopy's peaks, the two
         loudspeaker poles' tops, the shed's gable end, the hall's gable and the grey building's fascia) */
      const ends = [[-20.5, 6.9, -1.5], [14.25, 6.25, -16.35], [-9, 3.4, -1], [9, 3.4, -2], [5.47, 3.15, 9.85], [-9, 3.4, 5], [-9.7, 3.75, -9.35], [10.7, 3.75, -8.1], [0, 6.8, -20], [-13.25, 3.75, -7.45], [3, 4.15, 12.32], [-5, 4.15, 12.32]];
      const fl = [], lineP = [], rnd = rng(4410), FLAGS = [0x2fa64a, 0xf2c21c, 0x2f6fd0, 0xf07a1c, 0xf4f2ec, 0xe8528c];
      ends.forEach((e, si) => {
        const len = Math.hypot(e[0] - TOP[0], e[1] - TOP[1], e[2] - TOP[2]), n = Math.floor(len / 0.62), sag = len * 0.07;
        let prev = TOP;
        for (let i = 1; i <= n; i++) {
          const k = i / n, p = [lp(TOP[0], e[0], k), lp(TOP[1], e[1], k) - Math.sin(k * Math.PI) * sag, lp(TOP[2], e[2], k)];
          lineP.push(prev[0], prev[1], prev[2], p[0], p[1], p[2]); prev = p;
          if (i < n) fl.push({ p, ry: Math.atan2(e[0] - TOP[0], e[2] - TOP[2]) + Math.PI / 2 + (rnd() - 0.5) * 0.5, c: FLAGS[(i + si) % FLAGS.length], rz: (rnd() - 0.5) * 0.5 });
        }
      });
      const lg = new THREE.BufferGeometry(); lg.setAttribute('position', new THREE.Float32BufferAttribute(lineP, 3));
      const ln = new THREE.LineSegments(lg, new THREE.LineBasicMaterial({ color: 0x4a463e })); mats.push(ln.material); world.add(ln); owned.push(ln);
      const tg = new THREE.BufferGeometry();
      tg.setAttribute('position', new THREE.Float32BufferAttribute([-0.085, 0, 0, 0.085, 0, 0, 0, -0.24, 0], 3));
      tg.setAttribute('normal', new THREE.Float32BufferAttribute([0, 0, 1, 0, 0, 1, 0, 0, 1], 3));
      const fm = M({ color: 0xffffff, roughness: 0.8, side: THREE.DoubleSide });
      const fi = new THREE.InstancedMesh(tg, fm, fl.length), col = new THREE.Color();
      fl.forEach((f, i) => { _we.set(0, f.ry, f.rz, 'YXZ'); _wq.setFromEuler(_we); fi.setMatrixAt(i, _wm.compose(_wp.set(f.p[0], f.p[1], f.p[2]), _wq, _ws)); fi.setColorAt(i, col.set(f.c)); });
      fi.instanceMatrix.needsUpdate = true; fi.instanceColor.needsUpdate = true; fi.frustumCulled = false; world.add(fi); owned.push(fi);
      /* the power lines across the sky (photographs 8, 10), on two concrete poles beyond the ground */
      const wp = [];
      for (const dy of [0, 0.35, 0.7]) { const a = [15, 7.6 + dy, -24], b = [-20, 7.2 + dy, 17]; let pv = a;
        for (let i = 1; i <= 16; i++) { const k = i / 16, p = [lp(a[0], b[0], k), lp(a[1], b[1], k) - Math.sin(k * Math.PI) * 0.9, lp(a[2], b[2], k)]; wp.push(pv[0], pv[1], pv[2], p[0], p[1], p[2]); pv = p; } }
      const wg = new THREE.BufferGeometry(); wg.setAttribute('position', new THREE.Float32BufferAttribute(wp, 3));
      const wl = new THREE.LineSegments(wg, new THREE.LineBasicMaterial({ color: 0x23211f })); mats.push(wl.material); world.add(wl); owned.push(wl);
      post(mConcrete, 15, -24, 0.14, 0, 8.6, 8, 0.1); post(mConcrete, -20, 17, 0.14, 0, 8.2, 8, 0.1);
    }

    /* ================================================================ THE TREES
       Real models (v24.20: no tree is built in code): the rain tree and the mango of this episode's first chapter, the
       same countryside's trees (declared: reuseInEpisode). Far off, the line of trees is his kind of country's, a
       picture cut out and laid round the ground on a ring. */
    const TREES = [
      /* (the two that stand over the turf are the fuller level of each, whose crowns are leaves: the lighter level's are
         shards from close by, which is what Chad saw in chapter 1's yard at v24.27) */
      /* (v26.2 debug, Chad's pictures of 13 Nov 2026 and tools/probes/clipscan.mjs: the huge tree's trunk went up through the
         lower shed roof behind the west tents; the mango stood inside the red plank building behind the chief canopy, its
         crown through both roofs; the north-east tree's crown took in a power pole, the wires and a banner; and the four
         crowns met the groves' palms. Each stands now where its crown, at every height, clears every roof, wall, pole,
         wire, banner and other crown by 0.3 m (masters/v26.2/trees: the crowns measured from the files,
         tools/probes/treeprofile.mjs, and the nearest such place solved for each, the four first) */
      { key: 'e4raintreehd', x: -21.15, z: -1.1, h: 13.5, ry: 0.4 },     // the huge tree west of the turf (photograph 10)
      { key: 'e4mangohd', x: 13.75, z: 20.6, h: 9.5, ry: 2.1 },        // the tree behind the chief canopy's buildings
      { key: 'e4raintreehd', x: 23.4, z: -17.75, h: 10.5, ry: 3.0 },    // north-east (photograph 8)
      /* (v26.2 debug: this one at its fuller level too. Ending B looks up past the chief canopy into its crown from
         12 m, and the light file's crown, its leaves remeshed into big flat shards (v24.27), read there as crumpled foil.
         Its files are the same tree; the fuller one is already loaded for the tree over the turf) */
      { key: 'e4mango', x: -13.5, z: 16, h: 8.5, ry: 5.0 }         // south-west, by the way in
    ];
    /* LEAVES ARE NOT FOIL (v26.2 debug, Chad's picture of the tree behind the chief canopy, 13 Nov 2026: its crown shone like
       crumpled foil). The generated trees came with a metal-roughness sheet that reads their leaves as polished and partly
       metal (the v25.5 law for a generated body's paint, applied where it is drawn): metal off, a leaf's rough finish, their
       own colour and relief kept */
    function leafMatte(mt) { for (const m of [].concat(mt)) { if (!m || !('roughness' in m)) continue;
      m.metalnessMap = null; m.metalness = 0; m.roughnessMap = null; m.roughness = 0.88; m.needsUpdate = true; } }
    function buildTrees() {
      for (const T0 of TREES) stand(T0.key, T0.x, 0, T0.z, T0.ry, { h: T0.h, lift: 1, done: (m) => m.traverse(q => { if (q.isMesh) leafMatte(q.material); }) });
      const R = 64, Hh = 20;
      const g = new THREE.CylinderGeometry(R, R, Hh, 56, 1, true);
      const uv = g.attributes.uv; for (let k = 0; k < uv.count; k++) uv.setX(k, uv.getX(k) * 5);
      const mRing = B({ color: SURF.treeline[0], alphaTest: 0.5, side: THREE.BackSide, fog: true, transparent: false });
      surfLoad('treeline').then(t0 => { if (!t0 || !alive) return; const t = t0.clone(); t.needsUpdate = true; madeTex.push(t);
        t.wrapS = THREE.RepeatWrapping; t.wrapT = THREE.ClampToEdgeWrapping; t.repeat.set(1, -1); t.offset.set(0, 1); mRing.map = t; mRing.color.set(0xd8dcd4); mRing.needsUpdate = true; });
      const ring = new THREE.Mesh(g, mRing); ring.position.y = Hh / 2 - 1.2; ring.renderOrder = -5; world.add(ring); owned.push(ring);
      stageList.ring = ring;
      ring.visible = have('w3t_treeline');
    }

    /* ================================================================ PETALS ON THE GROUND
       Marigold petals by the handful lie where they were thrown: before each master's seat on day one; all over the
       turf by the next morning. One small cluster of petals (drawn: a few petals with holes between them) laid flat
       thousands of times, each turned its own way (a seeded scatter). */
    const petalMat = M({ color: 0xffffff, roughness: 0.75, alphaTest: 0.45, side: THREE.DoubleSide, map: tex(makePetals(THREE, cnv)) });
    function petalField(n, seed, where, parent) {
      const g = new THREE.PlaneGeometry(1, 1); g.rotateX(-Math.PI / 2);
      const im = new THREE.InstancedMesh(g, petalMat, n), rnd = rng(seed), col = new THREE.Color();
      for (let i = 0; i < n; i++) {
        const [x, z] = where(rnd), s = 0.07 + rnd() * 0.07;
        _we.set((rnd() - 0.5) * 0.25, rnd() * 6.283, (rnd() - 0.5) * 0.25, 'YXZ'); _wq.setFromEuler(_we);
        im.setMatrixAt(i, _wm.compose(_wp.set(x, 0.012 + rnd() * 0.01, z), _wq, _ws.set(s, s, s)));
        im.setColorAt(i, col.setHSL(0.105 + rnd() * 0.04, 0.98, 0.5 + rnd() * 0.06, THREE.SRGBColorSpace));   // (said in sRGB: three reads a bare HSL as linear light, and marigold came out cream)
      }
      _ws.set(1, 1, 1);
      im.instanceMatrix.needsUpdate = true; im.instanceColor.needsUpdate = true; im.frustumCulled = false; parent.add(im); owned.push(im);
      return im;
    }
    /* a scatter round a point: thick at its middle, thinning out (two of a stream's numbers averaged) */
    const around = (cx, cz, r) => (rnd) => { const a = rnd() * 6.283, d = r * (rnd() + rnd()) / 2; return [cx + Math.cos(a) * d, cz + Math.sin(a) * d]; };
    const mix = (...fs) => (rnd) => fs[Math.floor(rnd() * fs.length) % fs.length](rnd);
    function buildPetals() {
      /* day one: before the chief bench, before the two west tents and the east one, and at the tables' front */
      petalField(LOW ? 1500 : 2600, 5101, mix(around(5.7, 8.7, 2.6), around(5.7, 8.7, 1.5), around(-7.6, -0.8, 2.2), around(-7.6, 5.0, 1.7), around(7.6, -2.0, 2.0), around(0, -9.3, 2.6)), dayOne);
      /* (and a few at the way in, carried there on people's feet: what his eyes open on. Its own field and its own seed,
         so the field above is the scatter it was) */
      petalField(LOW ? 170 : 300, 5103, around(DATA.spawn.x, 10.6, 2.6), dayOne);
      /* day two: yesterday's petals everywhere, trodden into the turf */
      petalField(LOW ? 6500 : 11000, 5102, mix((rnd) => [TURF.x0 + rnd() * (TURF.x1 - TURF.x0), TURF.z0 + rnd() * (TURF.z1 - TURF.z0)],
        around(5.7, 8.7, 3.2), around(-7.6, -0.8, 2.8), around(7.6, -2.0, 2.6), around(0, -9.3, 3.0), around(0, 1.5, 6)), dayTwo);
    }

    /* ================================================================ PAINTED SHADOW (v9.3, v9.4)
       Nothing on a phone casts a shadow, and a hard sun with no shadows is a ground with nothing standing on it. So the
       shade is painted: one sheet over the whole ground, drawn from what stands on it and where the sun of the look is
       (SUNS), redrawn in the black when the look changes. A thing's shade is its outline at its height, slid along the
       ground away from the sun. */
    const SHADE = { x0: -14, x1: 14, z0: -15, z1: 14, px: 768 };
    const shade = { c: null, x: null, t: null, m: null, look: '' };
    function buildShade() {
      const [c, x] = cnv(SHADE.px); shade.c = c; shade.x = x;
      const t = tex(new THREE.CanvasTexture(c)); t.colorSpace = THREE.SRGBColorSpace; shade.t = t;
      const m = B({ map: t, transparent: true, depthWrite: false, color: 0xffffff });
      const g = new THREE.PlaneGeometry(SHADE.x1 - SHADE.x0, SHADE.z1 - SHADE.z0); g.rotateX(-Math.PI / 2);
      const mesh = new THREE.Mesh(g, m); mesh.position.set((SHADE.x0 + SHADE.x1) / 2, 0.016, (SHADE.z0 + SHADE.z1) / 2); mesh.renderOrder = 2;
      world.add(mesh); owned.push(mesh); shade.m = mesh;
    }
    function paintShade(look) {
      if (shade.look === look || !shade.x) return;
      shade.look = look;
      const S0 = SHADE, px = S0.px, sun = SUNS[look];
      shade.x.clearRect(0, 0, px, px);
      if (!sun) { shade.t.needsUpdate = true; return; }                       // night, dusk: no sun's shade
      const sx = -sun[0] / sun[1], sz = -sun[2] / sun[1];                      // how far a point one metre up throws its shade
      const X = (wx) => (wx - S0.x0) / (S0.x1 - S0.x0) * px, Z = (wz) => (wz - S0.z0) / (S0.z1 - S0.z0) * px;
      const long = Math.hypot(sx, sz);
      /* every shape is drawn SOLID on a sheet of its own first, so shade over shade is still one shade; the sheet is
         then laid down once, at the shade's own strength */
      const [cA, x] = cnv(px); x.clearRect(0, 0, px, px);
      x.fillStyle = 'rgb(8,16,10)'; x.strokeStyle = 'rgb(8,16,10)';
      /* a flat outline at height h */
      const poly = (pts, h) => { x.beginPath(); pts.forEach(([wx, wz], i) => { const u = X(wx + sx * h), v = Z(wz + sz * h); if (i) x.lineTo(u, v); else x.moveTo(u, v); }); x.closePath(); x.fill(); };
      /* a standing box: its foot, its top's shade, and the four sides between */
      const boxS = (x0, z0, x1, z1, h) => { const F = [[x0, z0], [x1, z0], [x1, z1], [x0, z1]]; poly(F, 0); poly(F, h);
        for (let i = 0; i < 4; i++) { const p = F[i], q = F[(i + 1) % 4]; x.beginPath(); x.moveTo(X(p[0]), Z(p[1])); x.lineTo(X(q[0]), Z(q[1])); x.lineTo(X(q[0] + sx * h), Z(q[1] + sz * h)); x.lineTo(X(p[0] + sx * h), Z(p[1] + sz * h)); x.closePath(); x.fill(); } };
      const tentS = (T0, w, e) => poly(tentCorners(T0.x, T0.z, w, T0.ry || 0), e + 0.3);
      for (const T0 of [TENT_W1, TENT_W2, TENT_E]) tentS(T0, TENT.w + 0.2, TENT.eave);
      tentS(CHIEF, CHIEF.w + 0.2, CHIEF.eave);
      boxS(TABLES.x0, TABLES.z0, TABLES.x1, TABLES.z1, 1.2);
      boxS(TON_TABLE.x - 0.9, TON_TABLE.z - 0.38, TON_TABLE.x + 0.9, TON_TABLE.z + 0.38, 0.75); boxS(WEST_TABLE.x - 0.38, WEST_TABLE.z - 0.9, WEST_TABLE.x + 0.38, WEST_TABLE.z + 0.9, 0.75);
      for (const sxx of [-1, 1]) boxS(sxx * 3.25 - 0.3, -11.3, sxx * 3.25 + 0.3, -10.7, 2.7);
      boxS(HALL.x0 - 1, HALL.z0, HALL.x1 + 1, HALL.z1 + 1, 4.2);
      boxS(HOUSE.x, HOUSE.z0, HOUSE.x + 6, HOUSE.z1, 4.0); boxS(PLANK.x0, PLANK.z, PLANK.x1, PLANK.z + 3, 3.6); boxS(GREY.x0 - 6, GREY.z, GREY.x1, GREY.z + 3, 4.2);
      poly([[SHED.x0 - 0.5, SHED.z0 - 0.5], [SHED.x1 + 0.6, SHED.z0 - 0.5], [SHED.x1 + 0.6, SHED.z1 + 0.5], [SHED.x0 - 0.5, SHED.z1 + 0.5]], 2.9);
      /* each banner: a thin bar of shade from its pole's foot to its tip's */
      x.lineWidth = Math.max(1.5, 0.2 / (S0.x1 - S0.x0) * px);
      for (const b of banners.list) { x.beginPath(); x.moveTo(X(b.x), Z(b.z)); x.lineTo(X(b.x + sx * 4.8), Z(b.z + sz * 4.8)); x.stroke(); }
      /* THE TREES' DAPPLE: each crown a cloud of leaves' shade with the sun coming through between */
      const rnd = rng(7707);
      for (const T0 of TREES) {
        const hh = T0.h * 0.72, r = T0.h * 0.42, cx = T0.x + sx * hh, cz = T0.z + sz * hh;
        for (let i = 0; i < 150; i++) { const an = rnd() * 6.283, d = r * Math.sqrt(rnd()) * 1.05, rr = 0.35 + rnd() * 0.75;
          x.beginPath(); x.ellipse(X(cx + Math.cos(an) * d), Z(cz + Math.sin(an) * d), rr * (1 + long * 0.3) / (S0.x1 - S0.x0) * px, rr / (S0.z1 - S0.z0) * px, Math.atan2(sz, sx), 0, 6.283); x.fill(); }
      }
      /* soften every edge (the sheet drawn at half size and back: a canvas filter is not everywhere), then lay it down
         at the shade's strength: a long low shade is a paler one */
      const [c2, x2] = cnv(px / 2); x2.clearRect(0, 0, px / 2, px / 2); x2.imageSmoothingEnabled = true; x2.drawImage(cA, 0, 0, px / 2, px / 2);
      const out = shade.x; out.imageSmoothingEnabled = true; out.globalAlpha = Math.min(0.5, 0.42 / Math.sqrt(Math.max(1, long)));
      out.drawImage(c2, 0, 0, px, px); out.globalAlpha = 1;
      shade.t.needsUpdate = true;
    }

    /* ================================================================ THE WORLD IS BUILT (every name a builder or a frame
       asks for is declared above: the v21.1 TDZ law) */
    buildGround();
    buildHall();
    buildSurround();
    buildTables();
    buildBaiSriTables();
    buildTents();
    buildBanners();
    buildPole();
    flush();
    dressTables(); dressHall();
    buildTrees();
    buildPetals();
    buildShade();
    paintShade('DAY1');

