    /* ================================================================ THE HALL'S INSIDE (v26.18)
       Chad, 16 Nov 2026: the next morning's meeting with Grandmaster Pho is "inside the main hall that has the naga
       statues outside", its inside "exactly the same as the photos" (his eleven; the room's sheet with every size and
       place is on the working machine, masters/v26.0/ref/hall/notes/inventory.md, and the tracker describes it:
       docs/V26.18-E4C3-HALL.md). The room stands in place behind the real front, at its true size: 9.6 m wide, 16.8 m
       long, its ceiling 3.65 m; the altars at the north end, the two glass doors at the south.
       The sheet's coordinates are kept (hallAt): u metres east of the middle, v metres south of the north wall's inside
       face, h metres over the hall's floor.
       ITS LIGHT IS THE CHAPTER'S ONE SET OF LIGHTS (a preset of its own while he is inside: a_head.js HALL*), and what
       a lamp or a window gives besides is paint: each bulb a bright bead with a glow, its star on the tile; the glass
       bright by morning and dark by dusk (hallGlass).
       Nothing of it is drawn on day one (hallIn hidden; the west door's leaf shut): hallShow(). */
    const hallIn = new THREE.Group(); hallIn.visible = false; world.add(hallIn);
    const hin = { leaf: new THREE.Group(), leafSlide: 1.09, gates: [], bulbs: [], glows: [], solidsAt: [] };
    world.add(hin.leaf);
    const hRep = (t, tu, tv) => { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(1 / tu, 1 / tv); return t; };
    /* (bare brick: long thin bricks, about 0.23 by 0.05, in running bond; inside, under the lamps, the joints read
       darker than the brick, where outside in the sun they read pale) */
    const mInBrick = (() => { const [c, x] = cnv(512), r = rng(3186), W = 512, BW = 128, N = 18, BH = W / N;
      x.fillStyle = '#5a3a30'; x.fillRect(0, 0, W, W);
      for (let j = 0; j < N; j++) for (let i = -1; i < 5; i++) { const ox = (j % 2 ? BW / 2 : 0) + i * BW, k = 0.84 + r() * 0.3, g = 0.94 + r() * 0.12;
        x.fillStyle = 'rgb(' + Math.round(150 * k) + ',' + Math.round(82 * k * g) + ',' + Math.round(52 * k * g) + ')'; x.fillRect(ox + 1.5, j * BH + 2, BW - 3, BH - 4);
        x.fillStyle = 'rgba(255,220,190,' + (0.03 + r() * 0.05).toFixed(3) + ')'; x.fillRect(ox + 2, j * BH + 2.5, BW - 4, 3); }
      for (let i = 0; i < 2600; i++) { x.fillStyle = r() < 0.5 ? 'rgba(20,10,8,0.10)' : 'rgba(255,225,200,0.06)'; x.fillRect(r() * W, r() * W, 1 + r() * 3, 1 + r() * 2); }
      return M({ map: hRep(tex(done(THREE, c, true)), 0.92, 0.99), roughness: 0.94 }); })();
    /* (smooth plaster painted terracotta, brush-mottled, matt) */
    const mTerra = (() => { const [c, x] = cnv(512), r = rng(5521), W = 512;
      x.fillStyle = '#a86e4c'; x.fillRect(0, 0, W, W);
      for (let i = 0; i < 520; i++) { const px = r() * W, py = r() * W, rad = 26 + r() * 70, g = x.createRadialGradient(px, py, 0, px, py, rad), d = r() < 0.5;
        g.addColorStop(0, d ? 'rgba(104,66,48,0.16)' : 'rgba(176,124,92,0.14)'); g.addColorStop(1, d ? 'rgba(104,66,48,0)' : 'rgba(176,124,92,0)');
        x.fillStyle = g; for (const ox of [-W, 0, W]) for (const oy of [-W, 0, W]) { x.setTransform(1, 0, 0, 1, ox, oy); x.fillRect(px - rad, py - rad, rad * 2, rad * 2); } x.setTransform(1, 0, 0, 1, 0, 0); }
      return M({ map: hRep(tex(done(THREE, c, true)), 2.6, 2.6), roughness: 0.96 }); })();
    /* (the floor: glossy warm-white tiles 0.40 m square, a faint streak in each, joints two or three millimetres wide) */
    const mTile = (() => { const [c, x] = cnv(1024), r = rng(7740), W = 1024, T = 256;
      for (let j = 0; j < 4; j++) for (let i = 0; i < 4; i++) { const k = 0.975 + r() * 0.05;
        x.fillStyle = 'rgb(' + Math.round(216 * k) + ',' + Math.round(214 * k) + ',' + Math.round(206 * k) + ')'; x.fillRect(i * T, j * T, T, T);
        x.save(); x.beginPath(); x.rect(i * T, j * T, T, T); x.clip();
        for (let s = 0; s < 5; s++) { const y0 = j * T + r() * T, a = (r() - 0.5) * 0.5, w = 6 + r() * 26, g = x.createLinearGradient(0, y0 - w, 0, y0 + w);
          g.addColorStop(0, 'rgba(150,154,160,0)'); g.addColorStop(0.5, 'rgba(150,154,160,' + (0.05 + r() * 0.07).toFixed(3) + ')'); g.addColorStop(1, 'rgba(150,154,160,0)');
          x.setTransform(1, a, 0, 1, 0, -a * (i * T + T / 2)); x.fillStyle = g; x.fillRect(i * T, y0 - w, T, w * 2); x.setTransform(1, 0, 0, 1, 0, 0); }
        x.restore(); }
      x.strokeStyle = '#8f8a80'; x.lineWidth = 1.8; for (let i = 0; i <= 4; i++) { x.beginPath(); x.moveTo(i * T, 0); x.lineTo(i * T, W); x.stroke(); x.beginPath(); x.moveTo(0, i * T); x.lineTo(W, i * T); x.stroke(); }
      const t = hRep(tex(done(THREE, c, true)), 1.6, 1.6); t.anisotropy = 8;
      return M({ map: t, roughness: 0.28, metalness: 0 }); })();
    /* (the ceiling is unlit paint: a face that looks down takes only the ground's share of the chapter's light and drew
       as dark as wet earth, where his photographs have it pale grey and bright round each lamp: the pools are painted) */
    const mCeil = B({ color: 0x98938c });
    const mInPost = M({ color: 0x3d2830, roughness: 0.34 });
    const mInWhite = M({ color: 0xf1efe9, roughness: 0.6 });
    const mInDark = M({ color: 0x241f1d, roughness: 0.6 });
    const mAltarTop = M({ color: 0xd9d9d6, roughness: 0.32 });
    const mSkirtYellow = satin(0xe6c62e);
    const mSkirtOlive = surf('satin', { tile: [0.42, 0.3], mirror: 'u', tint: 0xa59b46, roughness: 0.4, side: THREE.DoubleSide });
    /* (the braid along each skirt's top: a gold zigzag on the lemon one; green and gold with sequins on the olive one) */
    const braid = (sequins) => { const [c, x] = cnv(128), W = 128;
      x.fillStyle = sequins ? '#2f6a3a' : '#8a6a1c'; x.fillRect(0, 0, W, W);
      x.strokeStyle = sequins ? '#d9b648' : '#f0d060'; x.lineWidth = 12; x.lineJoin = 'miter'; x.beginPath();
      for (let i = -1; i <= 4; i++) { x.lineTo(i * 32, 104); x.lineTo(i * 32 + 16, 24); } x.stroke();
      if (sequins) { const cols = ['#e86aa8', '#4c8fe0', '#58c070']; for (let i = 0; i < 8; i++) { x.fillStyle = cols[i % 3]; x.beginPath(); x.arc(i * 16 + 8, i % 2 ? 44 : 86, 6, 0, 7); x.fill(); x.fillStyle = 'rgba(255,255,255,0.7)'; x.beginPath(); x.arc(i * 16 + 6, (i % 2 ? 44 : 86) - 2, 2, 0, 7); x.fill(); } }
      const t = tex(done(THREE, c, true)); return M({ map: t, roughness: 0.45, metalness: sequins ? 0.1 : 0.3 }); };
    const mBraidGold = (() => { const m = braid(false); hRep(m.map, 0.12, 0.03); return m; })();
    const mBraidDais = (() => { const m = braid(true); hRep(m.map, 0.16, 0.04); return m; })();
    /* (GLASS: the windows' panes and the strips of glass blocks. Unlit, and one colour each for the hour: hallGlass) */
    const mPane = B({ color: 0xe8eef2 });
    const mBlocks = (() => { const [c, x] = cnv(128), W = 128;
      const g = x.createRadialGradient(64, 64, 6, 64, 64, 80); g.addColorStop(0, '#f4f8f4'); g.addColorStop(0.55, '#dbe6de'); g.addColorStop(1, '#b6c6bc');
      x.fillStyle = g; x.fillRect(0, 0, W, W);
      x.strokeStyle = 'rgba(255,255,255,0.55)'; x.lineWidth = 3; for (let i = 0; i < 5; i++) { x.beginPath(); x.moveTo(14, 20 + i * 22); x.bezierCurveTo(44, 8 + i * 22, 84, 32 + i * 22, 114, 20 + i * 22); x.stroke(); }
      x.strokeStyle = '#f6f6f2'; x.lineWidth = 9; x.strokeRect(0, 0, W, W);
      return B({ map: hRep(tex(done(THREE, c, true)), 0.19, 0.19), color: 0xffffff }); })();
    const mGlassIn = B({ color: 0xd4e4ee, transparent: true, opacity: 0.09, depthWrite: false });
    /* (a bulb, and its light as paint: a glow that faces the eye, a soft star on the tile under it) */
    const mBulb = B({ color: 0xffffff, fog: false });
    const glowTex = (() => { const [c, x] = cnv(128); const g = x.createRadialGradient(64, 64, 0, 64, 64, 64);
      g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.12, 'rgba(250,252,255,0.62)'); g.addColorStop(0.4, 'rgba(236,244,255,0.16)'); g.addColorStop(1, 'rgba(230,240,255,0)');
      x.fillStyle = g; x.fillRect(0, 0, 128, 128); return tex(done(THREE, c, false)); })();
    const mGlow = new THREE.SpriteMaterial({ map: glowTex, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, opacity: 0.6, fog: false }); mats.push(mGlow);
    const mStar = B({ map: glowTex, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, opacity: 0.2, fog: false });
    const mPool = B({ map: glowTex, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, opacity: 0.3, fog: false });
    const bandTex = (() => { const [c, x] = cnv(64); const g = x.createLinearGradient(0, 0, 0, 64); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.35, 'rgba(255,255,255,0.4)'); g.addColorStop(1, 'rgba(255,255,255,0)');
      x.clearRect(0, 0, 64, 64); x.fillStyle = g; x.fillRect(0, 0, 64, 64); return tex(done(THREE, c, false)); })();
    /* (the printed backdrop behind the second altar. Until its picture is made, from real references and after the
       research's second reader, this stands: the banner's own violet-grey mist in its navy border, and no figure) */
    const mBackdrop = (() => { const [c, x] = cnv(512), W = 512, r = rng(9112);
      const g = x.createLinearGradient(0, 0, 0, W); g.addColorStop(0, '#5a5c70'); g.addColorStop(0.5, '#79798e'); g.addColorStop(1, '#4d5060'); x.fillStyle = g; x.fillRect(0, 0, W, W);
      for (let i = 0; i < 60; i++) { const px = r() * W, py = r() * W, rad = 40 + r() * 110, q = x.createRadialGradient(px, py, 0, px, py, rad);
        q.addColorStop(0, 'rgba(170,170,190,0.10)'); q.addColorStop(1, 'rgba(170,170,190,0)'); x.fillStyle = q; x.fillRect(px - rad, py - rad, rad * 2, rad * 2); }
      x.strokeStyle = '#27334d'; x.lineWidth = 14; x.strokeRect(7, 7, W - 14, W - 14);
      return M({ map: tex(done(THREE, c, false)), roughness: 0.55 }); })();
    const HDOOR = { cx: -2.7, w: 2.3, h: 2.25, head: 1.95 };                    // the west door (buildHall's own numbers); its head inside
    const hallAtV = (u, v, h = 0) => new THREE.Vector3(u, HIN.floor + h, HIN.zN + v);

    /* THE FLOOR UNDER A POINT (the engine's twenty-first seam): the three steps across the hall's front, the landing
       before its doors and the room's own floor are 0.48 m up; everywhere else the ground is the ground */
    function hallGround(x, z) {
      const zf = HALL.z1, fl = HALL.floor;
      if (z < zf - 0.1) return Math.abs(x) < 5 && z > HALL.z0 ? fl : 0;
      if (Math.abs(x) > 5.6) return 0;
      return z <= zf + 0.9 ? fl : z <= zf + 1.2 ? fl * 2 / 3 : z <= zf + 1.5 ? fl / 3 : 0;
    }

    function buildHallIn() {
      const H = HIN, zN = H.zN, zS = H.zS, x0 = H.x0, x1 = H.x1, fy = H.floor, cy = fy + H.ceil, BAY = 4.2;
      const Z = (v) => zN + v, Y = (h) => fy + h;
      /* THE FLOOR, and THE CEILING with its stepped recess over the dais (two steps of a quarter metre, against the
         north and east walls) */
      floor(mTile, x0, zN, x1, zS, fy + 0.003);
      const down = (mat, ax, az, bx, bz, y) => quad(mat, [ax, y, az], [bx, y, az], [bx, y, bz], [ax, y, bz], ax, az);   // a piece that faces down (az north of bz)
      const RC = { u0: 1.3, v1: 4.2, in: 0.3, step: 0.25 };
      down(mCeil, x0, zN, RC.u0, zS, cy); down(mCeil, RC.u0, Z(RC.v1), x1, zS, cy);
      wall(mCeil, RC.u0, Z(RC.v1), RC.u0, zN, cy, cy + RC.step); wall(mCeil, x1, Z(RC.v1), RC.u0, Z(RC.v1), cy, cy + RC.step);                       // the first step's faces (west, south)
      down(mCeil, RC.u0, zN, RC.u0 + RC.in, Z(RC.v1), cy + RC.step); down(mCeil, RC.u0 + RC.in, Z(RC.v1 - RC.in), x1, Z(RC.v1), cy + RC.step);        // its ledge
      wall(mCeil, RC.u0 + RC.in, Z(RC.v1 - RC.in), RC.u0 + RC.in, zN, cy + RC.step, cy + 2 * RC.step); wall(mCeil, x1, Z(RC.v1 - RC.in), RC.u0 + RC.in, Z(RC.v1 - RC.in), cy + RC.step, cy + 2 * RC.step);
      down(mCeil, RC.u0 + RC.in, zN, x1, Z(RC.v1 - RC.in), cy + 2 * RC.step);
      /* THE WALLS: the north wall and the first bay of each side painted terracotta; bare brick south of the first posts */
      wall(mTerra, x0, zN, x1, zN, fy, cy); wall(mTerra, RC.u0, zN, x1, zN, cy, cy + 2 * RC.step);
      wall(mTerra, x1, zN, x1, Z(BAY), fy, cy); wall(mTerra, x1, zN, x1, Z(RC.v1), cy, cy + 2 * RC.step);
      wall(mInBrick, x1, Z(BAY), x1, zS, fy, cy);
      wall(mInBrick, x0, zS, x0, Z(BAY), fy, cy); wall(mTerra, x0, Z(BAY), x0, zN, fy, cy);
      /* the south wall: brick over the doors' heads (1.95 m inside) and three piers; each opening's reveal */
      const zo = HALL.z1 + 0.02;
      wall(mInBrick, x1, zS, x0, zS, Y(HDOOR.head), cy);
      for (const [a, b] of [[x1, 3.85], [1.55, -1.55], [-3.85, x0]]) wall(mInBrick, a, zS, b, zS, fy, Y(HDOOR.head));
      for (const [a, b] of [[-3.85, -1.55], [1.55, 3.85]]) { quad(mInBrick, [a, Y(HDOOR.head), zS], [b, Y(HDOOR.head), zS], [b, Y(HDOOR.head), zo], [a, Y(HDOOR.head), zo]);   // the head's underside (faces down)
        wall(mInBrick, a, zo, a, zS, fy, Y(HDOOR.head)); wall(mInBrick, b, zS, b, zo, fy, Y(HDOOR.head)); }
      bar(mInWhite, [x0, Y(HDOOR.head) + 0.035, zS - 0.014], [x1, Y(HDOOR.head) + 0.035, zS - 0.014], 0.016, 4);       // the white track line across the whole wall
      /* (the shut leaves' glass, seen from inside: a breath of sheen; the east door whole, the west door's fixed half) */
      wall(mGlassIn, 3.85, zo - 0.004, 1.55, zo - 0.004, fy + 0.02, Y(HDOOR.head)); wall(mGlassIn, HDOOR.cx, zo - 0.004, HDOOR.cx - HDOOR.w / 2, zo - 0.004, fy + 0.02, Y(HDOOR.head));
      /* a short yellow satin valance over the middle; the white electrical panel on the east pier */
      wall(mSkirtYellow, 1.2, zS - 0.03, -1.2, zS - 0.03, Y(2.42), Y(2.72));
      box(mInWhite, 4.25, Y(1.5), zS - 0.05, 0.3, 0.4, 0.09); bar(mInWhite, [4.25, Y(1.7), zS - 0.03], [4.25, cy, zS - 0.03], 0.012, 4);
      /* THE POSTS: one free post at the room's middle (round, 0.28 thick, a flared collar under the ceiling), and the
         same post half out of each wall: the middle of the north and south walls, each side wall at every bay, the corners */
      const PR = 0.14;
      post(mInPost, 0, Z(8.4), PR, fy, cy - 0.12, 14); post(mInPost, 0, Z(8.4), PR, cy - 0.12, cy, 14, PR + 0.07);
      for (const [u, v] of [[-0.15, 0.0], [0, 16.8], [x0, BAY], [x0, 2 * BAY], [x0, 3 * BAY], [x1, BAY], [x1, 2 * BAY], [x1, 3 * BAY], [x0, 0], [x1, 0], [x0, 16.8], [x1, 16.8]]) post(mInPost, u, Z(v), PR, fy, cy, 12);
      /* THE WHITE TRUNKING: round the room at 2.32 m, and across the ceiling at each line of posts, its bulbs under it */
      const ty = Y(2.32), tin = 0.02;
      for (const [a, b] of [[[x0 + tin, zN + tin], [x1 - tin, zN + tin]], [[x1 - tin, zN + tin], [x1 - tin, zS - tin]], [[x0 + tin, zS - tin], [x0 + tin, zN + tin]]]) box(mInWhite, (a[0] + b[0]) / 2, ty, (a[1] + b[1]) / 2, Math.abs(b[0] - a[0]) + 0.04, 0.04, Math.abs(b[1] - a[1]) + 0.04);
      const ROWS = [[BAY, [-3.2, -1.35, 0.65, 2.5]], [2 * BAY, [-4.3, -2.0, 0.4, 2.6]], [3 * BAY, [-4.3, -2.0, 0.4, 2.6]]];
      for (const [v, us] of ROWS) { box(mInWhite, 0, cy - 0.02, Z(v), x1 - x0 - 0.3, 0.04, 0.06);
        for (const u of us) hin.bulbs.push([u, H.ceil - 0.17, v, 1]); }
      for (const q of [[RC.u0 + RC.in + 0.03, H.ceil + 0.36, 2.0, 0.55], [x1 - 0.06, H.ceil + 0.36, 2.0, 0.55], [3.2, H.ceil + 0.19, RC.v1 - 0.04, 0.9]]) hin.bulbs.push(q);   // in the recess: its west face, its east face, the middle of its south lip
      for (const [u, h, v, k] of hin.bulbs) { geo(mInWhite, new THREE.CylinderGeometry(0.03, 0.035, 0.07, 8), _gm.makeTranslation(u, Y(h) + 0.105, Z(v)));
        geo(mBulb, new THREE.CapsuleGeometry(0.048 * (k < 1 ? 0.7 : 1), 0.09 * (k < 1 ? 0.6 : 1), 3, 8), _gm.makeTranslation(u, Y(h), Z(v))); }
      for (const u of [-3.4, -1.7]) box(mInWhite, u, cy - 0.09, Z(BAY) - 0.06, 0.07, 0.1, 0.07);                              // two small spot heads on the first trunking
      /* THE WINDOWS AND THE GLASS BLOCKS (each side wall, every bay south of the first posts): a strip of blocks from
         2.49 to 3.08 m, three rows of 0.19 m; under it a window from 1.00 to 2.07 m, dark frame, sliding panes, bars */
      const side = (sx, v0, v1, w0, w1) => { const xw = sx * (x1 - 0.006), dir = sx > 0 ? 1 : -1;
        const W2 = (mat, va, vb, ha, hb, off = 0) => (dir > 0 ? wall(mat, xw - off * dir, Z(va), xw - off * dir, Z(vb), Y(ha), Y(hb)) : wall(mat, xw - off * dir, Z(vb), xw - off * dir, Z(va), Y(ha), Y(hb)));
        /* (the blocks' sheet starts at the strip's own corner, so no block is cut: three rows, a whole number along) */
        if (dir > 0) quad(mBlocks, [xw, Y(2.51), Z(v0)], [xw, Y(2.51), Z(v1)], [xw, Y(3.08), Z(v1)], [xw, Y(3.08), Z(v0)]); else quad(mBlocks, [xw, Y(2.51), Z(v1)], [xw, Y(2.51), Z(v0)], [xw, Y(3.08), Z(v0)], [xw, Y(3.08), Z(v1)]);
        if (w0 == null) return;
        W2(mPane, w0, w1, 1.0, 2.07, 0.004);
        const fx = xw - 0.02 * dir;
        for (const hh of [1.0, 2.07]) box(mInDark, fx, Y(hh), Z((w0 + w1) / 2), 0.05, 0.06, w1 - w0 + 0.06);
        for (let i = 0; i <= 4; i++) box(mInDark, fx, Y(1.535), Z(w0 + (w1 - w0) * i / 4), 0.05, 1.07, i % 4 ? 0.035 : 0.06);
        for (const hh of [1.27, 1.535, 1.8]) box(mInDark, fx + 0.012 * dir, Y(hh), Z((w0 + w1) / 2), 0.012, 0.014, w1 - w0); };
      side(1, 4.5, 8.3, 5.4, 7.4); side(1, 9.55, 11.45, 9.5, 11.5); side(1, 13.75, 15.65, 13.7, 15.7);
      side(-1, 5.3, 7.2, 5.25, 7.25); side(-1, 9.55, 11.45, 9.5, 11.5); side(-1, 13.75, 15.65, 13.7, 15.7);
      /* THE DAIS (north-east): 3.4 m square, 0.28 high; glossy tile on top, a silver strip on its front edge, the
         olive-gold satin skirt in deep pleats on its two open sides, its braid along the top */
      const D = H.dais, dv = D.v1, dh = D.h;
      box(mAltarTop, (D.x0 + D.x1) / 2, Y(dh / 2), Z(dv / 2), D.x1 - D.x0, dh, dv, 0, mTile);
      wall(mSkirtOlive, D.x0 - 0.012, Z(dv) + 0.012, D.x1, Z(dv) + 0.012, fy, Y(dh)); wall(mSkirtOlive, D.x0 - 0.012, zN, D.x0 - 0.012, Z(dv) + 0.012, fy, Y(dh));                 // its south face (faces south), its west face (faces west)
      wall(mBraidDais, D.x0 - 0.016, Z(dv) + 0.016, D.x1, Z(dv) + 0.016, Y(dh - 0.045), Y(dh - 0.005)); wall(mBraidDais, D.x0 - 0.016, zN, D.x0 - 0.016, Z(dv) + 0.016, Y(dh - 0.045), Y(dh - 0.005));
      box(mSteel, (D.x0 + D.x1) / 2, Y(dh) + 0.003, Z(dv) - 0.01, D.x1 - D.x0, 0.008, 0.03);
      /* THE SECOND ALTAR (the west half of the north wall): 5.8 long, 2.2 deep, 0.65 high; its lemon-yellow gathered
         skirt to the floor with a gold zigzag braid; behind it the printed backdrop, 4.4 by 2.8 */
      const A = { x0: x0, x1: 1.0, v1: 2.2, h: 0.65 };
      box(mAltarTop, (A.x0 + A.x1) / 2, Y(A.h / 2), Z(A.v1 / 2), A.x1 - A.x0, A.h, A.v1);
      wall(mSkirtYellow, A.x0, Z(A.v1) + 0.012, A.x1 + 0.012, Z(A.v1) + 0.012, fy, Y(A.h)); wall(mSkirtYellow, A.x1 + 0.012, Z(A.v1) + 0.012, A.x1 + 0.012, zN, fy, Y(A.h));                 // its south face (faces south), its east end (faces east)
      wall(mBraidGold, A.x0, Z(A.v1) + 0.016, A.x1 + 0.016, Z(A.v1) + 0.016, Y(A.h - 0.035), Y(A.h - 0.005)); wall(mBraidGold, A.x1 + 0.016, Z(A.v1) + 0.016, A.x1 + 0.016, zN, Y(A.h - 0.035), Y(A.h - 0.005));
      { const bz = zN + 0.075, a = [-4.6, Y(0.8), bz], b = [-0.2, Y(0.8), bz], m = new THREE.Mesh(new THREE.PlaneGeometry(4.4, 2.8), mBackdrop);
        m.position.set((a[0] + b[0]) / 2, Y(0.8) + 1.4, bz); hallIn.add(m); owned.push(m); }
      /* WHAT HE CANNOT WALK THROUGH: the shell's walls (its south wall with the west door's gap), the two platforms and
         what stands on the floor between them, the free post, and the big things along the walls (each a column) */
      const col = (ua, va, ub, vb) => solidBox(Math.abs(ub - ua), 3, Math.abs(vb - va), (ua + ub) / 2, 1.5, Z((va + vb) / 2));
      col(-5.3, -0.4, -4.78, 17.2); col(4.78, -0.4, 5.3, 17.2); col(-5.3, -0.5, 5.3, -0.02);                                    // west, east and north walls
      const gap0 = HDOOR.cx + 0.05, gap1 = HDOOR.cx + HDOOR.w / 2 - 0.05;                                                       // the open leaf's place: x -2.65 to -1.6
      col(-5.3, 16.72, gap0, 17.05); col(gap1, 16.72, 5.3, 17.05);
      col(A.x0, 0, A.x1 + 0.1, A.v1 + 0.1); col(D.x0 - 0.1, 0, D.x1, dv + 0.1); col(A.x1, 0, 1.75, 4.5);                          // the second altar, the dais, the floor between them
      col(-0.16, 8.24, 0.16, 8.56);                                                                                             // the free post
      for (const q of [[-4.8, 2.9, -3.7, 4.1], [-3.95, 4.3, -3.25, 4.9], [-4.8, 5.4, -3.85, 8.6], [3.9, 4.9, 4.8, 7.7], [3.75, 9.35, 4.65, 10.25], [3.85, 11.1, 4.8, 13.5], [3.85, 13.7, 4.8, 15.5], [3.9, 15.6, 4.8, 16.8], [-0.1, 15.25, 2.3, 15.95]]) col(q[0], q[1], q[2], q[3]);
    }
    /* THE WEST DOOR'S MOVING LEAF (the half nearer the middle): built where it stands shut, in a group of its own, so
       sliding it open is the group moved west over the fixed half (hallShow). On day one it is shut and the hall looks
       as it always did */
    function buildHallLeaf() {
      const fl = HALL.floor, z = HALL.z1 + 0.02, a = HDOOR.cx, b = HDOOR.cx + HDOOR.w / 2;
      wall(mGlass, a, z, b, z, fl + 0.02, fl + HDOOR.h);
      box(mBronze, a + 0.03, fl + HDOOR.h / 2, z + 0.025, 0.05, HDOOR.h, 0.05); box(mBronze, b - 0.03, fl + HDOOR.h / 2, z + 0.025, 0.05, HDOOR.h, 0.05);
      bar(mSteel, [a + 0.13, fl + 0.85, z + 0.075], [a + 0.13, fl + 1.35, z + 0.075], 0.014, 6);
      wall(mGlassIn, b, z - 0.004, a, z - 0.004, fl + 0.02, fl + HDOOR.head);
    }
    /* (the bulbs' glows and their stars on the tile: not merged, each faces the eye or lies on the floor) */
    function dressHallIn() {
      const starG = new THREE.PlaneGeometry(1, 1); starG.rotateX(-Math.PI / 2);
      const poolG = new THREE.PlaneGeometry(1, 1); poolG.rotateX(Math.PI / 2);
      for (const [u, h, v, k] of hin.bulbs) { const p = hallAtV(u, v, h), s = new THREE.Sprite(mGlow); s.position.copy(p); s.scale.setScalar(0.95 * k); hallIn.add(s); owned.push(s); hin.glows.push(s);
        if (k < 1) continue;
        const f = new THREE.Mesh(starG, mStar); f.position.set(p.x, HIN.floor + 0.006, p.z); f.scale.setScalar(2.3); f.renderOrder = 2; hallIn.add(f); owned.push(f);
        const c = new THREE.Mesh(poolG, mPool); c.position.set(p.x, HIN.floor + HIN.ceil - 0.004, p.z); c.scale.setScalar(3.4); c.renderOrder = 2; hallIn.add(c); owned.push(c); }
      /* (what the gloss of the tile gives back of each skirt: a band of its colour lying before it, strongest at its foot) */
      for (const [ua, ub, v, col, len] of [[HIN.x0, 1.0, 2.2, 0xe2c23a, 1.5], [HIN.dais.x0, HIN.dais.x1, HIN.dais.v1, 0xa89c48, 0.9]]) { const g = new THREE.PlaneGeometry(ub - ua, len); g.rotateX(-Math.PI / 2);
        const mt = B({ map: bandTex, color: col, transparent: true, depthWrite: false, opacity: 0.5, fog: false }); const m = new THREE.Mesh(g, mt); m.position.set((ua + ub) / 2, HIN.floor + 0.005, HIN.zN + v + len / 2 + 0.02); m.renderOrder = 1; hallIn.add(m); owned.push(m); }
      /* the gates: the turf's north edge (he is kept on the ground of the Wai Kru until the morning's walk) and the
         west door's gap; each a column, lifted out of the way while the way is open */
      const gate = (xa, za, xb, zb) => { const b3 = new THREE.Box3(new THREE.Vector3(Math.min(xa, xb), 0, Math.min(za, zb)), new THREE.Vector3(Math.max(xa, xb), 3.2, Math.max(za, zb))); hin.gates.push({ box: b3, lo: 0, hi: 3.2 }); return b3; };
      gate(HLANE.x0, HLANE.z1 - 0.5, HLANE.x1, -9.8);
      gate(HDOOR.cx - 0.1, HALL.z1 - 0.3, HDOOR.cx + HDOOR.w / 2 + 0.1, HALL.z1 + 0.3);
    }
    /* THE WAY FROM THE TURF TO THE DOOR. He was kept on the turf by the chapter's one box; the box now reaches the
       hall's north wall, and what lies between is shut by columns (never drawn): the lawn west of the lane, the tables
       and the lawn east of it, the steps east of the door. The lane runs from the turf's gravel west of the tables to
       the steps before the west door, 2.35 m wide; one banner pole stands in it. */
    const HLANE = { x0: -5.3, x1: -2.95, z0: HALL.z1 + 1.5, z1: -9.94 };              // (z1: with a column's 0.14 m of padding, the turf's old north edge to the centimetre)
    function buildHallWay() {
      const b = (xa, za, xb, zb) => solidBox(Math.abs(xb - xa), 3, Math.abs(zb - za), (xa + xb) / 2, 1.5, (za + zb) / 2);
      b(-11.2, -40, HLANE.x0, HLANE.z1); b(HLANE.x1, HLANE.z0, 11.2, HLANE.z1);                    // west of the lane (all the way north); the tables and the lawn east of it
      b(-1.3, HALL.z1 - 0.1, 11.2, HLANE.z0); b(5.3, -40, 11.2, HALL.z1);                            // the steps east of the door; the lawn east of the hall
      b(-4.37, -15.7, -4.09, -15.0);                                                               // the banner pole that stands in the lane
    }
    const hallShown = { on: false, open: false };
    /* (on: the inside is drawn. open: the turf's gate and the west door stand open, its leaf slid west) */
    function hallShow(on, open = on) {
      hallShown.on = !!on; hallShown.open = !!open;
      hallIn.visible = !!on; hin.leaf.position.x = open ? -hin.leafSlide : 0; hin.leaf.position.z = open ? 0.045 : 0;
      for (const g of hin.gates) { g.box.min.y = open ? 60 : g.lo; g.box.max.y = open ? 61 : g.hi; }
    }
    /* THE GLASS BY THE HOUR: bright with the morning, yellow with the afternoon, dark at dusk (his photographs' own look) */
    const HGLASS = { MORNING: [0xe8eef2, 0xffffff, 0.09], OPEN: [0xfff6e0, 0xfffaf0, 0.09], NOON: [0xf6e2a8, 0xfff0c8, 0.09], DUSK: [0x0c0e12, 0x4a5456, 0.22], SHUT: [0xdfe2e2, 0xf4f6f4, 0.09] };
    function hallGlass(name) { const q = HGLASS[name] || HGLASS.MORNING; mPane.color.setHex(q[0]); mBlocks.color.setHex(q[1]); mGlassIn.opacity = q[2]; }
    /* MANY OF ONE MODEL INSIDE THE HALL: as the copied manyOf, in the room's own (u, v, h), with a scale an axis and a
       tint a place where the room needs one (a mat made for a square laid long; two of the four drum columns gold).
       A thing is asked for only once its file is in the build: until then nothing stands in its place */
    function hallMany(key, list, lift = 3) {
      if (!list.length) return;
      if (!have(key)) { waiting.add(key); return; }
      parseOnce(key).then(({ scene: src }) => {
        if (!alive) return;
        src.updateMatrixWorld(true);
        const e = new THREE.Euler(0, 0, 0, 'YXZ'), q = new THREE.Quaternion(), p = new THREE.Vector3(), sc = new THREE.Vector3(), m4 = new THREE.Matrix4(), col = new THREE.Color();
        const tinted = list.some(t => t.tint != null);
        src.traverse(o => {
          if (!o.isMesh || /_far$/.test(o.name)) return;
          const mat = o.material.clone(); mats.push(mat); bronzeLift({ material: mat }, lift);
          const im = new THREE.InstancedMesh(o.geometry, mat, list.length);
          list.forEach((it, i) => { const [x, y, z] = hallAt(it.u, it.v, it.h || 0); e.set(it.rx || 0, it.ry || 0, it.rz || 0, 'YXZ'); q.setFromEuler(e);
            const k = it.s || 1; sc.set(k * (it.sx || 1), k * (it.sy || 1), k * (it.sz || 1));
            m4.compose(p.set(x, y, z), q, sc).multiply(o.matrixWorld); im.setMatrixAt(i, m4);
            if (tinted) im.setColorAt(i, col.set(it.tint != null ? it.tint : 0xffffff)); });
          im.instanceMatrix.needsUpdate = true; if (im.instanceColor) im.instanceColor.needsUpdate = true;
          im.computeBoundingSphere(); im.castShadow = false; im.receiveShadow = false; im.name = 'hall:' + key;
          hallIn.add(im); owned.push(im);
        });
      });
    }
    /* WHAT STANDS IN THE ROOM (the sheet's codes in brackets). Each is a model made from a crop of his own photograph of
       the thing (masters/v26.0/props), or one of the chapter's own that the sheet names as the same thing. The sacred
       images are not here: each waits for its real references and the research's second reader. */
    function dressHallThings() {
      const DH = HIN.dais.h, AH = 0.65, E = Math.PI / 2, W = -Math.PI / 2;
      /* the dais: the master's seat and its pillows (D8, D9), the four columns of drums at the wall (D4: the inner two
         gold), the two gold bai sri and the peacock before the lotus (D10, D11), the thick candles (D13) */
      hallMany('w3hseat', [{ u: 2.1, v: 2.9, h: DH, sy: 0.5 }]);
      hallMany('w3hpillow', [{ u: 2.42, v: 2.26, h: DH, ry: 0.25 }, { u: 2.96, v: 2.2, h: DH, ry: -0.3 }]);
      hallMany('w3hdrums', [{ u: 1.7, v: 0.2, h: DH }, { u: 1.95, v: 0.2, h: DH, tint: 0xe8c060, ry: 1 }, { u: 4.3, v: 0.2, h: DH, tint: 0xe8c060, ry: 2 }, { u: 4.55, v: 0.2, h: DH, ry: 3 }], 4);
      hallMany('w3hgoldbaisri', [{ u: 2.75, v: 2.7, h: DH }, { u: 3.8, v: 2.7, h: DH, ry: 1.3 }]);
      hallMany('w3hpeacock', [{ u: 3.3, v: 2.85, h: DH }]);
      hallMany('w3candlemid', [{ u: 2.9, v: 2.2, h: DH, s: 0.68, tint: 0xf0a020 }, { u: 4.0, v: 2.0, h: DH, s: 0.68, tint: 0xf0a020 }, { u: 0.15, v: 2.0, h: AH, s: 0.53, tint: 0xf0a020 }]);
      hallMany('w3hgreencol', [{ u: 2.55, v: 0.4, h: DH }, { u: 4.15, v: 0.4, h: DH, ry: 2 }]);
      hallMany('w3hcanopy', [{ u: 3.35, v: 1.25, h: 3.2 }]);
      hallMany('w3hwheel', [{ u: 4.3, v: 2.2, h: DH, ry: -0.35 }]);
      hallMany('w3hbrownbaisri', [{ u: 2.95, v: 2.12, h: DH }, { u: 3.42, v: 2.05, h: DH, ry: 1 }, { u: 3.9, v: 2.14, h: DH, ry: 2 },
        ...[-2.2, -1.92, -1.64, -1.36, -1.08, -0.8, -0.52, -0.24].map((u, i) => ({ u, v: 1.95, h: AH, s: 0.67, ry: i * 1.1 }))]);
      hallMany('w3purple', [{ u: 4.3, v: 3.1, h: DH, s: 0.45 }, { u: -4.3, v: 1.5, h: AH, s: 0.41, ry: 1 }]);
      hallMany('w3hbooktable', [{ u: 1.68, v: 2.55, h: DH, ry: E }]);
      hallMany('w3hbroom', [{ u: 1.62, v: 3.12, h: DH, ry: 0.3 }, { u: 1.74, v: 3.2, h: DH, ry: 0.42 }]);
      hallMany('w3khantok', [{ u: 1.6, v: 2.95, h: DH, s: 1.1 }]);                       // (D17: the tray with its bottles, west of his seat)
      /* the second altar: the fan of leaf nagas (L2), the tall candles (L5, L10), the cone towers (L8), the bronze naga
         heads (L7), the swan (L6), the red table (L15), the bouquet (L22), the gold naga heads at its east end (L23) */
      hallMany('w3naga', [[-4.26, 1.34, 0.5, 0.2], [-4.1, 1.45, 0.28, 0.1], [-3.94, 1.5, 0, 0], [-3.78, 1.45, -0.28, -0.1], [-3.62, 1.34, -0.5, -0.2]].map(([u, s, ry, rz]) => ({ u, v: 0.55, h: AH, s, ry, rz })));
      hallMany('w3candle', [{ u: -3.35, v: 1.3, h: AH, s: 0.76 }, { u: -2.0, v: 1.3, h: AH, s: 0.72 }]);
      hallMany('w3hconetower', [{ u: -2.95, v: 0.9, h: AH }, { u: -2.15, v: 0.9, h: AH, ry: 1.5 }]);
      hallMany('w3hnagabronze', [{ u: -3.2, v: 1.0, h: AH }, { u: -1.55, v: 1.0, h: AH, ry: 0.4 }]);
      hallMany('w3hswan', [{ u: -3.1, v: 1.65, h: AH, ry: 0.5 }]);
      hallMany('w3hlotusvase', [{ u: -3.7, v: 1.35, h: AH, s: 0.73 }, { u: 0.34, v: 1.45, h: AH, s: 0.73, ry: 2 }]);
      hallMany('w3hredtable', [{ u: -0.12, v: 0.95, h: AH }]);
      hallMany('w3roses', [{ u: 0.66, v: 1.2, h: AH, s: 1.5 }]);
      hallMany('w3hnagagold', [{ u: 0.84, v: 1.85, h: AH, ry: 0.3 }]);
      hallMany('w3hstripemat', [{ u: 0.3, v: 2.62, h: 0 }]);
      /* the floor between the altars: the cloth sets (G3), the water (G5), the clay pot (G6), the tray (L24) */
      hallMany('w3hclothsets', [{ u: 1.26, v: 3.3, h: 0, ry: E }]);
      hallMany('w3water', [0, 1, 2, 3].flatMap(i => [0, 1, 2].map(j => ({ u: 1.14 + j * 0.068, v: 4.18 + i * 0.068, h: 0 }))));
      hallMany('w3claypot', [{ u: 1.47, v: 2.95, h: 0, s: 0.67 }]);
      /* the west wall: the naga group (W1), the fan on its tripod (W2), the beige sofa and its armchair (W3) */
      hallMany('w3hnagagroup', [{ u: -4.25, v: 3.5, h: 0, ry: E }]);
      hallMany('w3hpedfan', [{ u: -3.6, v: 4.6, h: 0, s: 0.78, ry: 2.4 }, { u: 4.2, v: 9.8, h: 0, ry: -1.9 }]);
      /* (the armchair of the set is the three-seater made narrow: the chapter's own sofa is green, and no tint makes it beige) */
      hallMany('w3hsofa3', [{ u: -4.3, v: 6.55, h: 0, ry: E }, { u: -4.3, v: 8.15, h: 0, ry: E, sx: 0.46 }, { u: 4.3, v: 12.3, h: 0, ry: W, tint: 0x86c4b0 }, { u: 4.3, v: 14.6, h: 0, ry: W, tint: 0xb8c070, s: 0.86 }]);
      /* the east wall: the strapped cushions (E1) and the grey mats (E2), the blue chairs stacked in the corner (E7) */
      hallMany('w3hcushions', [{ u: 4.3, v: 5.8, h: 0, ry: W }]);
      hallMany('w3hgreymats', [{ u: 4.3, v: 7.2, h: 0, ry: W }]);
      hallMany('w3pchair', [0, 1].flatMap(c => Array.from({ length: 9 }, (_, i) => ({ u: 4.32 - c * 0.62, v: 16.25, h: i * 0.062, ry: Math.PI, tint: 0x4f66d8 }))));
      /* the south wall: the bench with its folded mattresses (S1) */
      hallMany('w3bench', [{ u: 1.1, v: 15.6, h: 0, ry: Math.PI, s: 1.47 }]);
      hallMany('w3hmattresses', [{ u: 1.1, v: 15.6, h: 0.47, ry: Math.PI }]);
      /* THE MATS, laid in their grid (S3): four columns 1.7 m apart, five rows 1.8 m apart; the one before the master's
         seat is the one he is shown to, 2.2 m from Grandmaster Pho */
      const mats2 = []; for (const v of [5.1, 6.9, 8.7, 10.5, 12.3]) for (const u of [-2.55, -0.85, 0.85, 2.55]) mats2.push({ u: v === 5.1 && u === 2.55 ? HALLSEAT.x : u, v, h: 0, sz: 0.68, sy: 0.6 });
      hallMany('w3hmat', mats2);
      /* on the posts and the walls: two wall fans and two horns on the free post (2.3 and 2.05 m), a black box on each of
         the first wall posts, an exhaust fan a bay, the clock on the north wall's middle post */
      hallMany('w3hwallfan', [{ u: -0.12, v: 8.28, h: 2.1, ry: Math.PI + 0.75 }, { u: 0.12, v: 8.28, h: 2.1, ry: Math.PI - 0.75 }]);
      hallMany('w3hhorn', [{ u: -0.2, v: 8.4, h: 1.85, ry: W }, { u: 0.2, v: 8.4, h: 1.85, ry: E }]);
      hallMany('w3hpabox', [{ u: -4.62, v: 4.2, h: 2.28, ry: E + 0.5 }, { u: 4.62, v: 4.2, h: 2.28, ry: W - 0.5 }]);
      hallMany('w3hexhaust', [{ u: 4.76, v: 2.5, h: 2.31, ry: W }, { u: 4.76, v: 8.8, h: 2.31, ry: W }, { u: 4.76, v: 13.0, h: 2.31, ry: W }, { u: -4.76, v: 4.7, h: 2.31, ry: E }, { u: -4.76, v: 8.8, h: 2.31, ry: E }, { u: -4.76, v: 13.0, h: 2.31, ry: E }]);
      hallMany('w3hclock', [{ u: -0.15, v: 0.17, h: 2.185 }]);
    }
