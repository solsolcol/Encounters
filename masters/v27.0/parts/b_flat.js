  function build(ctx) {
//@@COPY 439-581 :: const { THREE, GLTFLoader, cloneSkinned, scene, camera, yaw, pitch, LOW, kit, cnv, loadImageTexture,

    /* ------------------------------------------------------------- HER FLAT'S PLAN (docs/research/V27.0-HDB.md)
       The build sheet's Plan A: HDB's 4-room Model A corridor unit of 1993 to 96 (107 m2). The origin is the middle of
       her main door's opening on the corridor's face; +z into the flat, +x to the right of someone walking in, y up; her
       floor at 0, the corridor's at -0.10. Every place in this chapter is one of these numbers. */
    const FL = { x0: -3.65, x1: 6.55, z0: 0, z1: 10.10, ceil: 2.55, face: 0.18, wall: 0.12, corr: -0.10 };
    const ROOMS = {
      living:  { x0: -0.80, x1: 2.85, z0: 0, z1: 5.15 },     // her altar on its far wall, her chair before it
      hers:    { x0: 2.85, x1: 6.55, z0: 0, z1: 3.55 },      // her bed, behind a folding partition folded open
      passage: { x0: 2.85, x1: 6.55, z0: 3.55, z1: 5.10 },
      dining:  { x0: 3.05, x1: 6.55, z0: 5.10, z1: 10.10 },  // the table, the cabinet, the kitchen at its back
      master:  { x0: -0.80, x1: 3.05, z0: 5.15, z1: 10.10 }, // shut
      bed3:    { x0: -3.65, x1: -0.80, z0: 0, z1: 4.25 },    // shut (its door eases open a hand's width: a scare)
      nook:    { x0: -1.75, x1: -0.80, z0: 4.25, z1: 5.40 },
      store:   { x0: -3.65, x1: -1.75, z0: 4.25, z1: 5.40 },
      bed2:    { x0: -3.65, x1: -0.80, z0: 5.40, z1: 10.10 },
      bath2:   { x0: 3.05, x1: 4.60, z0: 8.45, z1: 11.00 }
    };
    /* the openings: doors (x or z along their wall, their width) and windows (with their sill and head) */
    const DOOR_MAIN = { x0: -0.50, x1: 0.50, h: 2.10 };
    const DOOR_BED3 = { z0: 2.70, z1: 3.60, h: 2.10 };       // in the living room's left wall (x -0.80)
    const DOOR_MASTER = { x0: 1.55, x1: 2.35, h: 2.10 };     // in its back wall (z 5.15)
    const DOOR_STORE = { z0: 4.45, z1: 5.25, h: 2.10 };      // in the nook's left side (x -1.75)
    const DOOR_BED2 = { x0: -1.75, x1: -0.95, h: 2.10 };     // in the nook's back (z 5.40)
    const DOOR_BATH2 = { x0: 3.35, x1: 4.10, h: 2.10 };      // in bath 2's front (z 8.45), from the kitchen
    const WIN_LIVING = { x0: 0.62, x1: 2.80, sill: 0.90, head: 2.10 };
    const WIN_HERS = { x0: 2.95, x1: 6.40, sill: 0.90, head: 2.10 };
    const WIN_BED3 = { x0: -3.45, x1: -1.00, sill: 0.90, head: 2.10 };
    const WIN_KITCHEN = { x0: 4.65, x1: 6.45, sill: 1.00, head: 2.10 };
    /* THE CORRIDOR (HDB's access balcony): 1.75 m wide, its floor 0.10 below hers, a parapet 1.0 m high at its edge, its
       ceiling the floor above's slab; her neighbours' doors every 10.2 m; the lift lobby along it to the west */
    const CORR = { z0: -1.75, z1: 0, x0: -26, x1: 26, para: -1.90, paraTop: 0.90, soffit: 2.65 };
    const LOBBY = { x0: -21.5, x1: -16.5 };
    /* her neighbours' doors along the corridor (every 10.2 m; the one where the lift lobby opens has none) */
    const NEIGHBOURS = [-20.4, -10.2, 10.2, 20.4].filter(nx => !(nx > LOBBY.x0 - 0.6 && nx < LOBBY.x1 + 0.6));
    /* THE ESTATE: her block on the 8th storey (her floor 20.4 m above the ground); the next block across, 40 m out */
    const GROUND_Y = -20.4;
    const ACROSS = { z: -42, x0: -60, x1: 45, d: 12, storeys: 13, storey: 2.85 };
    /* where people and things stand (c_people.js, c_props.js read these): her chair before her altar, a metre and a bit
       out; Grandmaster Pho's stool at her right; his bowl on the floor at the chair's foot */
    const ALTAR = { x: -0.15, z: 5.15, shelf: 1.50 };
    const CHAIR = { x: -0.15, z: 3.85, ry: 0 };             // she faces her altar (+z): a body and a thing at a turn of 0 face +z
    const STOOL = { x: 0.62, z: 3.55 };
    const BOWL = { x: 0.35, z: 3.20 };
    /* her kuthu vilakku on the floor beside her shrine's right end, below Appa's photograph: where Mala kneels to light it
       (18 Nov, measured: her kneeling take's right hand rides 0.085 m to her right and 0.30 before her, 0.57 m up, so it
       stands over the lamp's wick at 0.43; set before the shrine's middle, her knees were in her mother's footrest) */
    const VILAKKU = { x: 0.32, z: 4.80 };

    const world = new THREE.Group();
    scene.add(world);
    const solids = [];
    const matProxy = M({ color: 0x8d7a66, roughness: 0.9 });
    /* a thing he cannot walk through: a box, never drawn (collision is a column from the floor: v5.03) */
    const solidBox = (w, h, d, x, y, z, ry = 0) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), matProxy);
      m.position.set(x, y, z); m.rotation.y = ry; m.visible = false; world.add(m); solids.push(m); return m;
    };

    /* ------------------------------------------------- one parse per asset (chapter 3's own, copied) */
//@@COPY 655-833 :: function parseOnce(key) {

    /* ------------------------------------------------- the flat's surfaces (none from a picture yet: every one is
       painted below; the table stays so the copied loaders read their own) */
    const SURF = {};
//@@COPY 849-1042 :: const surfTex = new Map();

    /* ================================================================ HER FLAT'S SURFACES
       Painted here (cnv: a canvas, done: its texture), each at its own real size so a metre on the wall is a metre of
       its picture (the batched quads' UVs are metres). A 1990s HDB flat: homogeneous ceramic floor tiles in the living
       rooms and her room, small white wall tiles in the kitchen, painted plaster walls, a tiled skirting, a plaster
       ceiling. The colours are an old flat's: the paint a tired cream, the tiles a speckled beige. */
    const rep = (t, tu, tv) => { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(1 / tu, 1 / tv); return t; };
    /* the floor: 300 mm speckled beige ceramic tiles, their grout a little darker, a few worn paler */
    const mFloor = (() => { const W = 512, T = 128, [c, x] = cnv(W), r = rng(41207);
      x.fillStyle = '#bba78c'; x.fillRect(0, 0, W, W);
      for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) {
        const k = 0.92 + r() * 0.12, base = [196 * k, 178 * k, 150 * k];
        x.fillStyle = `rgb(${base[0] | 0},${base[1] | 0},${base[2] | 0})`; x.fillRect(i * T + 2, j * T + 2, T - 4, T - 4);
        for (let s = 0; s < 700; s++) { const v = r(); x.fillStyle = v < 0.5 ? 'rgba(120,96,70,0.28)' : 'rgba(250,240,220,0.3)';
          x.fillRect(i * T + 2 + r() * (T - 4), j * T + 2 + r() * (T - 4), 1 + r() * 1.6, 1 + r() * 1.6); }
      }
      x.strokeStyle = 'rgba(90,76,60,0.55)'; x.lineWidth = 3;
      for (let i = 0; i <= 4; i++) { x.beginPath(); x.moveTo(i * T, 0); x.lineTo(i * T, W); x.stroke(); x.beginPath(); x.moveTo(0, i * T); x.lineTo(W, i * T); x.stroke(); }
      const t = tex(done(THREE, c, true)); rep(t, 1.2, 1.2); t.anisotropy = 8;
      return M({ map: t, roughness: 0.42, metalness: 0 }); })();
    /* the kitchen's floor: smaller terracotta-red quarry tiles (150 mm) */
    const mKitFloor = (() => { const W = 256, T = 64, [c, x] = cnv(W), r = rng(7713);
      x.fillStyle = '#6e3a2a'; x.fillRect(0, 0, W, W);
      for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) { const k = 0.9 + r() * 0.16;
        x.fillStyle = `rgb(${(150 * k) | 0},${(78 * k) | 0},${(56 * k) | 0})`; x.fillRect(i * T + 2, j * T + 2, T - 4, T - 4); }
      const t = tex(done(THREE, c, true)); rep(t, 0.6, 0.6); return M({ map: t, roughness: 0.6 }); })();
    /* the walls: plaster painted a tired cream, only faintly uneven (18 Nov, photographed: 1600 blotches of up to 12 px
       laid over one another read as a speckled wallpaper under the tube, which an HDB wall's paint is not; now a few
       hundred soft ones, fainter) */
    const wallPaint = (hex, seed) => { const W = 256, [c, x] = cnv(W), r = rng(seed);
      x.fillStyle = hex; x.fillRect(0, 0, W, W);
      /* (soft round spots, a radial fall each: squares, however faint, read as tiles of a pattern) */
      /* (18 Nov, photographed on a phone: 260 of them at 2 % read as damp stains on every wall; a painted HDB wall is even:
         a few, at under 1 %, so it is paint and not a flat colour) */
      for (let s = 0; s < 120; s++) { const cx = r() * W, cy = r() * W, q = 8 + r() * 26, dark = r() < 0.5;
        const g = x.createRadialGradient(cx, cy, 0, cx, cy, q); g.addColorStop(0, dark ? 'rgba(0,0,0,0.007)' : 'rgba(255,255,255,0.009)'); g.addColorStop(1, 'rgba(0,0,0,0)');
        x.fillStyle = g; x.fillRect(cx - q, cy - q, q * 2, q * 2); }
      const t = tex(done(THREE, c, true)); rep(t, 1.4, 1.4); return t; };
    const mWall = M({ map: wallPaint('#d9cdb4', 3301), roughness: 0.92 });
    const mWallHers = M({ map: wallPaint('#cfd8c8', 3302), roughness: 0.92 });      // her room a pale green, as she chose it once
    const mWallOut = M({ map: wallPaint('#c9c2b2', 3303), roughness: 0.95 });      // the corridor's face: HDB's grey-cream
    const mCeil = M({ color: 0xe6e4de, roughness: 0.95, emissive: 0x2c2b28 });   // (a ceiling under its own tube is lit: painted light)
    /* the skirting: a strip of the floor's tile, 100 mm high, round every wall */
    const mSkirt = M({ color: 0x9c8a72, roughness: 0.5 });
    /* the kitchen's walls: white 150 mm tiles to 1.5 m, paint above */
    const mKitTile = (() => { const W = 256, T = 64, [c, x] = cnv(W);
      x.fillStyle = '#d8dcd8'; x.fillRect(0, 0, W, W); x.fillStyle = '#f2f3f0';
      for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) x.fillRect(i * T + 2, j * T + 2, T - 4, T - 4);
      const t = tex(done(THREE, c, true)); rep(t, 0.6, 0.6); return M({ map: t, roughness: 0.25 }); })();
    /* a door's leaf where no model stands (a bedroom's, a bath's, her neighbours'): a veneer of brown timber */
    const mVeneer = (() => { const W = 128, H = 256, c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d'), r = rng(9921);
      x.fillStyle = '#7a5434'; x.fillRect(0, 0, W, H);
      for (let i = 0; i < 90; i++) { x.strokeStyle = `rgba(${40 + r() * 30},${22 + r() * 16},${10},${0.18 + r() * 0.2})`; x.lineWidth = 1 + r() * 2;
        const xx = r() * W; x.beginPath(); x.moveTo(xx, 0); x.bezierCurveTo(xx + r() * 8 - 4, H * 0.3, xx + r() * 8 - 4, H * 0.7, xx + r() * 6 - 3, H); x.stroke(); }
      const t = tex(new THREE.CanvasTexture(c)); t.colorSpace = THREE.SRGBColorSpace; rep(t, 0.9, 2.1);
      return M({ map: t, roughness: 0.55 }); })();
    const mFrame = M({ color: 0xcfd2d4, roughness: 0.4, metalness: 0.5 });          // the windows' aluminium
    const mGrille = M({ color: 0xe4e4de, roughness: 0.6, metalness: 0.2 });         // the grilles, painted white
    /* the glass at night: dark, holding a faint picture of the room (nothing is mirrored for real) */
    const mGlassNight = M({ color: 0x0a0d14, roughness: 0.08, metalness: 0.2, transparent: true, opacity: 0.32, depthWrite: false });
    /* the corridor's floor: grey terrazzo with darker chips; its parapet and soffit painted */
    const mCorrFloor = (() => { const W = 256, [c, x] = cnv(W), r = rng(5150);
      x.fillStyle = '#8f8d88'; x.fillRect(0, 0, W, W);
      for (let s = 0; s < 2600; s++) { const v = r(); x.fillStyle = v < 0.4 ? 'rgba(50,50,48,0.5)' : v < 0.8 ? 'rgba(200,198,190,0.5)' : 'rgba(140,110,80,0.5)'; const q = 1 + r() * 3; x.fillRect(r() * W, r() * W, q, q); }
      const t = tex(done(THREE, c, true)); rep(t, 1.0, 1.0); return M({ map: t, roughness: 0.5 }); })();
    const mSoffit = M({ color: 0xbab6ac, roughness: 0.95 });
    /* the corridor's LED battens: the light itself, unlit and bright (painted light: v9.4) */
    const mBatten = B({ color: 0xf2f6ff });

    /* ================================================================ THE SHELL
       Walls are boxes (a wall's thickness drawn, so an opening shows its reveal), split round their openings: below a
       window's sill, above its head and between, above a door's head. Each piece is also a SOLID where it stands on
       walkable floor (collision is a column from the floor: v5.03). */
    /* a wall along x (z fixed at its middle `zc`, thickness d) from x0 to x1, with openings [{x0, x1, y0, y1}] */
    function wallX(mat, zc, d, x0, x1, opens = [], y0 = 0, y1 = FL.ceil, solid = true) {
      const cuts = opens.slice().sort((a, b) => a.x0 - b.x0); let at = x0;
      const piece = (a, b, ya, yb, sol) => { if (b - a < 0.005 || yb - ya < 0.005) return;
        box(mat, (a + b) / 2, (ya + yb) / 2, zc, b - a, yb - ya, d, 0, mat, false);
        if (sol && solid) solidBox(b - a, Math.max(1.2, yb - ya), d, (a + b) / 2, Math.max(0.6, (ya + yb) / 2), zc); };
      for (const o of cuts) { piece(at, o.x0, y0, y1, true); piece(o.x0, o.x1, y0, o.y0, o.y0 > 0.6); piece(o.x0, o.x1, o.y1, y1, false); at = o.x1; }
      piece(at, x1, y0, y1, true);
    }
    /* a wall along z (x fixed at `xc`, thickness d) from z0 to z1, with openings [{z0, z1, y0, y1}] */
    function wallZ(mat, xc, d, z0, z1, opens = [], y0 = 0, y1 = FL.ceil, solid = true) {
      const cuts = opens.slice().sort((a, b) => a.z0 - b.z0); let at = z0;
      const piece = (a, b, ya, yb, sol) => { if (b - a < 0.005 || yb - ya < 0.005) return;
        box(mat, xc, (ya + yb) / 2, (a + b) / 2, d, yb - ya, b - a, 0, mat, false);
        if (sol && solid) solidBox(d, Math.max(1.2, yb - ya), b - a, xc, Math.max(0.6, (ya + yb) / 2), (a + b) / 2); };
      for (const o of cuts) { piece(at, o.z0, y0, y1, true); piece(o.z0, o.z1, y0, o.y0, o.y0 > 0.6); piece(o.z0, o.z1, o.y1, y1, false); at = o.z1; }
      piece(at, z1, y0, y1, true);
    }
    /* a window in a wall along x: its aluminium frame, its glass (two sliding panes) and, where it looks on the corridor,
       its grille of white bars */
    function windowX(o, zc, d, grille) {
      const w = o.x1 - o.x0, h = o.head - o.sill, zf = zc;                               // in the wall's middle
      const fr = 0.04;
      box(mFrame, (o.x0 + o.x1) / 2, o.sill + fr / 2, zf, w, fr, d * 0.6);
      box(mFrame, (o.x0 + o.x1) / 2, o.head - fr / 2, zf, w, fr, d * 0.6);
      box(mFrame, o.x0 + fr / 2, (o.sill + o.head) / 2, zf, fr, h, d * 0.6);
      box(mFrame, o.x1 - fr / 2, (o.sill + o.head) / 2, zf, fr, h, d * 0.6);
      const n = Math.max(2, Math.round(w / 0.9));
      for (let i = 1; i < n; i++) box(mFrame, o.x0 + (w * i) / n, (o.sill + o.head) / 2, zf, 0.035, h, d * 0.5);
      glass.push({ x0: o.x0, x1: o.x1, y0: o.sill, y1: o.head, z: zf });
      if (grille) { const gz = zc - d / 2 - 0.05;                                          // on the corridor's side
        for (let gx = o.x0 + 0.11; gx < o.x1 - 0.05; gx += 0.12) bar(mGrille, [gx, o.sill, gz], [gx, o.head, gz], 0.008, 6);
        for (const gy of [o.sill + 0.02, (o.sill + o.head) / 2, o.head - 0.02]) bar(mGrille, [o.x0, gy, gz], [o.x1, gy, gz], 0.01, 6); }
    }
    const glass = [];
    /* (R36) the rooms behind her neighbours' corridor windows: six cells, curtains lit warm or cool, a television's blue,
       two dark; painted light (an unlit picture: v9.4) */
    function nbRooms() {
      const n = 6, W = 256, H = 128, c = document.createElement('canvas'); c.width = W; c.height = H * n; const x = c.getContext('2d'), rr = rng(5512);
      const looks = [['#e7b46c', 0.9], ['#f0d6a4', 0.85], ['#cfdbe8', 0.8], ['#7a92d4', 0.75], ['#15161b', 0], ['#1b1a1f', 0]];
      looks.forEach(([col, glow], i) => { const y0 = i * H;
        x.fillStyle = col; x.fillRect(0, y0, W, H);
        if (glow) { for (let px = 0; px < W; px += 6) { x.fillStyle = `rgba(0,0,0,${0.04 + 0.08 * Math.abs(Math.sin(px * 0.7 + i))})`; x.fillRect(px, y0, 3, H); }
          const g = x.createRadialGradient(W * 0.5, y0 + H * 0.2, 4, W * 0.5, y0 + H * 0.2, W * 0.7); g.addColorStop(0, 'rgba(255,255,240,0.35)'); g.addColorStop(1, 'rgba(0,0,0,0.15)');
          x.fillStyle = g; x.fillRect(0, y0, W, H); }
        else { x.fillStyle = 'rgba(120,130,150,0.08)'; x.fillRect(W * 0.2, y0 + 10, W * 0.15, H - 20); } });
      const t = tex(done(THREE, c, false)); const m = B({ map: t });
      const at = (mat, a, b, cc, d, k) => {
        const Bt = batchOf(mat), v0 = 1 - (k + 1) / n + 0.002, v1 = 1 - k / n - 0.002;
        const P = [a, b, cc, a, cc, d], U = [[0, v0], [1, v0], [1, v1], [0, v0], [1, v1], [0, v1]];
        for (let i = 0; i < 6; i++) { Bt.p.push(P[i][0], P[i][1], P[i][2]); Bt.n.push(0, 0, -1); Bt.u.push(U[i][0], U[i][1]); } };
      return { m, at, n };
    }
    function buildShell() {
      const F = FL, h = F.ceil, t = F.wall, R = ROOMS;
      /* the floors: tiles in the living rooms, her room and the passage; quarry tiles in the kitchen; the corridor's
         terrazzo 0.10 down. (Each floor is laid under its walls, so no seam shows at a wall's foot) */
      floor(mFloor, R.living.x0, F.face, R.living.x1, R.living.z1);
      floor(mFloor, R.hers.x0, F.face, R.hers.x1, R.passage.z1);
      floor(mFloor, R.nook.x0, R.nook.z0, R.nook.x1, R.nook.z1);
      /* the dining room is the living room's tile; the kitchen at its back (from z 7.6, where its tiled walls begin) its
         own red quarry tile (18 Nov, photographed: the whole dining room had been laid in the kitchen's) */
      floor(mFloor, R.dining.x0, R.dining.z0, R.dining.x1, 7.6);
      floor(mKitFloor, R.dining.x0, 7.6, R.dining.x1, R.dining.z1);
      floor(mCorrFloor, CORR.x0, CORR.z0, CORR.x1, CORR.z1 + 0.002, F.corr);
      /* the ceilings (over everything walked, and over the corridor: the floor above) */
      const ceil = (x0, z0, x1, z1, y) => quad(mCeil, [x0, y, z0], [x1, y, z0], [x1, y, z1], [x0, y, z1]);
      ceil(R.living.x0, F.face, R.living.x1, R.living.z1, h); ceil(R.hers.x0, F.face, R.hers.x1, R.passage.z1, h);
      ceil(R.dining.x0, R.dining.z0, R.dining.x1, R.dining.z1, h); ceil(R.nook.x0, R.nook.z0, R.nook.x1, R.nook.z1, h);
      quad(mSoffit, [CORR.x0, CORR.soffit, CORR.para], [CORR.x1, CORR.soffit, CORR.para], [CORR.x1, CORR.soffit, F.face], [CORR.x0, CORR.soffit, F.face]);
      /* THE FRONT FACADE (z 0 to 0.18): her door, the living room's window, her room's, bedroom 3's (on the corridor) */
      const fz = F.face / 2;
      wallX(mWallOut, fz, F.face, F.x0, F.x1, [
        { x0: WIN_BED3.x0, x1: WIN_BED3.x1, y0: WIN_BED3.sill, y1: WIN_BED3.head },
        { x0: DOOR_MAIN.x0, x1: DOOR_MAIN.x1, y0: 0, y1: DOOR_MAIN.h },
        { x0: WIN_LIVING.x0, x1: WIN_LIVING.x1, y0: WIN_LIVING.sill, y1: WIN_LIVING.head },
        { x0: WIN_HERS.x0, x1: WIN_HERS.x1, y0: WIN_HERS.sill, y1: WIN_HERS.head }]);
      windowX(WIN_LIVING, fz, F.face, true); windowX(WIN_HERS, fz, F.face, true); windowX(WIN_BED3, fz, F.face, true);
      /* the corridor's face of the facade continues past her flat to her neighbours', and up to the soffit: each flat its
         own plan's three windows on the corridor (bedroom 3's, the living room's, the main bedroom's), framed and grilled
         as hers are, a lit room or a dark one behind each (R36, 18 Nov: the walk to her gate passed blank walls) */
      const nbWins = [];
      for (const nx of NEIGHBOURS) for (const [a, b] of [[WIN_BED3.x0, WIN_BED3.x1], [WIN_LIVING.x0, WIN_LIVING.x1], [WIN_HERS.x0, WIN_HERS.x1]]) {
        const x0 = Math.max(CORR.x0 + 0.3, nx + a), x1 = Math.min(CORR.x1 - 0.3, nx + b); if (x1 - x0 < 0.8) continue;
        nbWins.push({ x0, x1, sill: 0.9, head: 2.1 }); }
      const opens = (ws) => ws.map(w => ({ x0: w.x0, x1: w.x1, y0: w.sill, y1: w.head }));
      wallX(mWallOut, fz, F.face, CORR.x0, F.x0, opens(nbWins.filter(w => w.x1 <= F.x0)), 0, CORR.soffit, false);
      wallX(mWallOut, fz, F.face, F.x1, CORR.x1, opens(nbWins.filter(w => w.x0 >= F.x1)), 0, CORR.soffit, false);
      { const rooms = nbRooms(), nr = rng(5511);
        nbWins.forEach((w, i) => { windowX(w, fz, F.face, true);
          const k = (nr() * rooms.n) | 0, z = F.face + 0.28;                       // the room behind it: its curtains, lit or not
          rooms.at(rooms.m, [w.x1 + 0.1, w.sill - 0.1, z], [w.x0 - 0.1, w.sill - 0.1, z], [w.x0 - 0.1, w.head + 0.1, z], [w.x1 + 0.1, w.head + 0.1, z], k); }); }
      box(mWallOut, (F.x0 + F.x1) / 2, (h + CORR.soffit) / 2, fz, F.x1 - F.x0, CORR.soffit - h, F.face);
      /* THE BACK FACADE (z 10.10): the kitchen's casement window over the laundry poles */
      wallX(mWall, F.z1 + 0.09, 0.18, R.dining.x0 + 1.55, R.dining.x1, [{ x0: WIN_KITCHEN.x0, x1: WIN_KITCHEN.x1, y0: WIN_KITCHEN.sill, y1: WIN_KITCHEN.head }]);
      windowX(WIN_KITCHEN, F.z1 + 0.09, 0.18, false);
      /* THE PARTY WALLS (x -3.65 and 6.55), on the walked side only */
      wallZ(mWallHers, R.hers.x1 + 0.09, 0.18, F.face, R.passage.z1);
      wallZ(mWall, R.dining.x1 + 0.09, 0.18, R.dining.z0, F.z1);
      /* THE LIVING ROOM: its left wall (bedroom 3's, its door shut but for a hand's width), its back wall (her altar's,
         and the main bedroom's door, shut), the nook open to it */
      wallZ(mWall, R.living.x0 - t / 2, t, F.face, R.bed3.z1 + t / 2, [{ z0: DOOR_BED3.z0, z1: DOOR_BED3.z1, y0: 0, y1: DOOR_BED3.h }]);
      wallX(mWall, R.living.z1 + t / 2, t, R.living.x0 - t, R.master.x1 + t / 2, [{ x0: DOOR_MASTER.x0, x1: DOOR_MASTER.x1, y0: 0, y1: DOOR_MASTER.h }]);
      /* the nook: bedroom 3's back wall over it, the store's door at its west end, bedroom 2's at its back */
      wallX(mWall, R.bed3.z1 + t / 2, t, R.nook.x0 - t / 2, R.living.x0 - t / 2);
      wallZ(mWall, R.nook.x0 - t / 2, t, R.nook.z0, R.nook.z1 + t / 2, [{ z0: DOOR_STORE.z0, z1: DOOR_STORE.z1, y0: 0, y1: DOOR_STORE.h }]);
      wallX(mWall, R.nook.z1 + t / 2, t, R.nook.x0 - t / 2, R.living.x0, [{ x0: DOOR_BED2.x0, x1: DOOR_BED2.x1, y0: 0, y1: DOOR_BED2.h }]);
      wallZ(mWall, R.living.x0 - t / 2, t, R.nook.z1, R.living.z1 + t);                    // the main bedroom's west wall at the nook
      /* HER ROOM: its back wall to the passage (the folding partition stands open at x 2.85: c_props.js) */
      wallX(mWallHers, R.hers.z1 + t / 2, t, R.hers.x0 + 0.95, R.hers.x1);
      /* the main bedroom's east wall along the dining room, and bath 2's walls with its door (shut) */
      wallZ(mWall, R.dining.x0 - t / 2, t, R.passage.z1, F.z1);
      wallX(mKitTile, R.bath2.z0 - t / 2, t, R.bath2.x0, R.bath2.x1 + t / 2, [{ x0: DOOR_BATH2.x0, x1: DOOR_BATH2.x1, y0: 0, y1: DOOR_BATH2.h }]);
      wallZ(mKitTile, R.bath2.x1 + t / 2, t, R.bath2.z0, F.z1);
      /* the kitchen's tiled skin over the back walls to 1.5 m (inside the dining room's back third) */
      quad(mKitTile, [R.dining.x1 - 0.002, 0, 7.6], [R.dining.x1 - 0.002, 0, F.z1], [R.dining.x1 - 0.002, 1.5, F.z1], [R.dining.x1 - 0.002, 1.5, 7.6], 7.6, 0);
      /* the doors that stay shut: each doorway's leaf is the door's own model (c_props.js DOORS; bedroom 3's stands a
         hand's width open); here only what stops him walking through */
      solidBox(DOOR_MASTER.x1 - DOOR_MASTER.x0, 2.1, 0.1, (DOOR_MASTER.x0 + DOOR_MASTER.x1) / 2, 1.05, R.living.z1 + 0.05);
      solidBox(0.1, 2.1, DOOR_STORE.z1 - DOOR_STORE.z0, R.nook.x0 - 0.05, 1.05, (DOOR_STORE.z0 + DOOR_STORE.z1) / 2);
      solidBox(DOOR_BED2.x1 - DOOR_BED2.x0, 2.1, 0.1, (DOOR_BED2.x0 + DOOR_BED2.x1) / 2, 1.05, R.nook.z1 + 0.05);
      solidBox(DOOR_BATH2.x1 - DOOR_BATH2.x0, 2.1, 0.1, (DOOR_BATH2.x0 + DOOR_BATH2.x1) / 2, 1.05, R.bath2.z0 - 0.05);
      solidBox(0.1, 2.1, DOOR_BED3.z1 - DOOR_BED3.z0, R.living.x0 - 0.06, 1.05, (DOOR_BED3.z0 + DOOR_BED3.z1) / 2);
      /* the skirting round the walked rooms (100 mm of the tile, standing 6 mm proud of the paint) */
      const sk = (a, b) => wall(mSkirt, a[0], a[1], b[0], b[1], 0, 0.1);
      sk([R.living.x0 + 0.006, F.face + 0.006], [R.living.x0 + 0.006, R.living.z1 - 0.006]);
      sk([R.living.x1 - 1.2, R.living.z1 - 0.006], [R.living.x0 + 0.006, R.living.z1 - 0.006]);
      sk([R.hers.x1 - 0.006, F.face + 0.006], [R.hers.x1 - 0.006, R.passage.z1]);
    }

    /* ================================================================ OUTSIDE HER DOOR
       The corridor: her neighbours' doors and gates every 10.2 m (painted: their leaves are veneer and their grilles bars),
       the battens over it, its parapet at its edge; the lift lobby to the west (the opening film, M7). */
    function buildCorridor() {
      const c = CORR, y0 = FL.corr;
      /* the parapet: a wall 0.15 thick, a coping on top, from end to end but where the lift lobby opens */
      box(mWallOut, (c.x0 + c.x1) / 2, (y0 + c.paraTop) / 2, c.para + 0.075, c.x1 - c.x0, c.paraTop - y0, 0.15, 0, mWallOut, false);
      box(mSoffit, (c.x0 + c.x1) / 2, c.paraTop + 0.03, c.para + 0.075, c.x1 - c.x0, 0.06, 0.24);
      /* the slab's edge above, and the floor's edge below (the facade's bands, seen from across) */
      box(mWallOut, (c.x0 + c.x1) / 2, c.soffit + 0.2, c.para + 0.1, c.x1 - c.x0, 0.4, 0.2);
      box(mWallOut, (c.x0 + c.x1) / 2, y0 - 0.25, c.para + 0.1, c.x1 - c.x0, 0.3, 0.2);
      /* the battens: a 1.2 m LED fitting under the soffit every 7 m, its body and its lit diffuser, and the light it
         throws: a pool on the soffit round it, on the wall and the floor under it, on the parapet across (R36, 18 Nov:
         the corridor's lights were slivers in an evenly lit tunnel) */
      const mFix = M({ color: 0xd8d8d2, roughness: 0.6, metalness: 0.2 });
      const poolTex = (() => { const W = 128, cv = document.createElement('canvas'); cv.width = cv.height = W; const x = cv.getContext('2d');
        const g = x.createRadialGradient(W / 2, W / 2, 1, W / 2, W / 2, W / 2); g.addColorStop(0, 'rgba(255,250,238,0.42)'); g.addColorStop(0.45, 'rgba(255,250,238,0.14)'); g.addColorStop(1, 'rgba(255,250,238,0)');
        x.fillStyle = g; x.fillRect(0, 0, W, W); return tex(done(THREE, cv, false)); })();
      const mPoolC = new THREE.MeshBasicMaterial({ map: poolTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }); mats.push(mPoolC);
      const pool = (cx, cy, cz, w, h, ax) => {           // a pool laid on a surface: 'y' a ceiling or floor, '-z' the wall, '+z' the parapet
        const hw = w / 2, hh = h / 2, Bt = batchOf(mPoolC);
        const P = ax === 'yd' ? [[cx - hw, cy, cz - hh], [cx + hw, cy, cz - hh], [cx + hw, cy, cz + hh], [cx - hw, cy, cz + hh]]
                : ax === 'yu' ? [[cx - hw, cy, cz + hh], [cx + hw, cy, cz + hh], [cx + hw, cy, cz - hh], [cx - hw, cy, cz - hh]]
                : ax === '-z' ? [[cx + hw, cy - hh, cz], [cx - hw, cy - hh, cz], [cx - hw, cy + hh, cz], [cx + hw, cy + hh, cz]]
                : [[cx - hw, cy - hh, cz], [cx + hw, cy - hh, cz], [cx + hw, cy + hh, cz], [cx - hw, cy + hh, cz]];
        const U = [[0, 0], [1, 0], [1, 1], [0, 0], [1, 1], [0, 1]], I = [0, 1, 2, 0, 2, 3];
        const nn = ax === 'yd' ? [0, -1, 0] : ax === 'yu' ? [0, 1, 0] : ax === '-z' ? [0, 0, -1] : [0, 0, 1];
        for (let i = 0; i < 6; i++) { const q = P[I[i]]; Bt.p.push(q[0], q[1], q[2]); Bt.n.push(nn[0], nn[1], nn[2]); Bt.u.push(U[i][0], U[i][1]); } };
      for (let x = -24.5; x <= 24.5; x += 7) {
        box(mFix, x, c.soffit - 0.024, -0.9, 1.26, 0.048, 0.09);
        box(mBatten, x, c.soffit - 0.052, -0.9, 1.2, 0.008, 0.06);
        pool(x, c.soffit - 0.004, -0.9, 3.6, 1.7, 'yd');
        pool(x, 1.45, -0.004, 4.2, 2.6, '-z');
        pool(x, y0 + 0.004, -0.85, 3.2, 1.6, 'yu');
        pool(x, 0.5, c.para + 0.155, 3.4, 1.1, '+z');
      }
      /* the town gas pipe along the corridor's wall under the soffit, yellow, on its brackets; each flat's electricity
         meter box by its door and its number over it; the corridor's two ends: a wall of vent blocks before the stair */
      const mGas = M({ color: 0xd2b031, roughness: 0.55, metalness: 0.1 }), mBox = M({ color: 0x8d8b84, roughness: 0.5, metalness: 0.35 });
      bar(mGas, [c.x0, 2.38, -0.07], [c.x1, 2.38, -0.07], 0.022, 8);
      for (let gx = c.x0 + 0.6; gx < c.x1; gx += 1.6) box(mBox, gx, 2.38, -0.04, 0.03, 0.07, 0.08);
      const plates = (() => { const W = 512, H = 64, cv = document.createElement('canvas'); cv.width = W; cv.height = H * 4; const x = cv.getContext('2d');
        x.fillStyle = '#e8e5dc'; x.fillRect(0, 0, W, H * 4); x.fillStyle = '#1e1e22'; x.font = 'bold 44px Arial, Helvetica, sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle';
        ['#08-210', '#08-212', '#08-214', '#08-216'].forEach((t, i) => x.fillText(t, W / 2, H * i + H / 2));
        return B({ map: tex(done(THREE, cv, false)) }); })();
      const doors = [0, ...NEIGHBOURS].sort((a, b) => a - b);
      doors.forEach((dx, i) => {
        box(mBox, dx - 0.75, 1.62, -0.055, 0.3, 0.42, 0.11);
        const k = Math.min(3, i), v0 = 1 - (k + 1) / 4 + 0.01, v1 = 1 - k / 4 - 0.01, Bt = batchOf(plates);
        const P = [[dx + 0.16, 2.2, -0.006], [dx - 0.16, 2.2, -0.006], [dx - 0.16, 2.26, -0.006], [dx + 0.16, 2.26, -0.006]], U = [[1, v0], [0, v0], [0, v1], [1, v1]], I = [0, 1, 2, 0, 2, 3];
        for (let j = 0; j < 6; j++) { const q = P[I[j]]; Bt.p.push(q[0], q[1], q[2]); Bt.n.push(0, 0, -1); Bt.u.push(U[I[j]][0], U[I[j]][1]); }
      });
      const mVent = B({ map: (() => { const W = 256, cv = document.createElement('canvas'); cv.width = cv.height = W; const x = cv.getContext('2d');
        x.fillStyle = '#8f8a80'; x.fillRect(0, 0, W, W);
        for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) { x.fillStyle = '#23242a'; x.fillRect(i * 32 + 5, j * 32 + 5, 22, 22);
          x.fillStyle = 'rgba(220,214,190,0.22)'; x.fillRect(i * 32 + 9, j * 32 + 9, 14, 14); }
        const t = tex(done(THREE, cv, true)); rep(t, 0.9, 0.9); return t; })() });
      quad(mVent, [c.x1 - 0.02, y0, c.z1], [c.x1 - 0.02, y0, c.para + 0.15], [c.x1 - 0.02, c.soffit, c.para + 0.15], [c.x1 - 0.02, c.soffit, c.z1]);
      quad(mVent, [c.x0 + 0.02, y0, c.para + 0.15], [c.x0 + 0.02, y0, c.z1], [c.x0 + 0.02, c.soffit, c.z1], [c.x0 + 0.02, c.soffit, c.para + 0.15]);
      /* the corridor's own collision (the opening film walks it; play never does: the gate is shut behind them) */
      solidBox(c.x1 - c.x0, 1.2, 0.15, (c.x0 + c.x1) / 2, 0.5, c.para + 0.075);
    }

    /* ================================================================ THE ESTATE AT NIGHT
       (Chad, 18 Nov: "i think the intro cutscene can be improved much further, for example the hdb blocks at the start look
       way too basic and need to be improved much more. See how you can improve the intro cutscene without being too draggy.
       Improve the environment, props, assets, etc where needed.")
       What the opening film sees from her corridor on the 8th storey, built as a real estate is (docs/research/V27.0-HDB.md
       §2.3). THE BLOCK ACROSS, 40 m out: a thirteen-storey corridor slab of the early 1990s, as hers is, its corridor side to
       her. A void deck under it, lit by its tubes; on each of twelve storeys an access corridor 1.9 m deep with its parapet,
       the slab's edge under it and the next slab over it, an LED batten every 7 m and the light it throws on the ceiling,
       the wall and the floor; behind each parapet a row of flats of her own plan (bedroom 3's window, the door behind its
       grille gate, the living room's window, the main bedroom's), each a household of its own: lit warm, cool or by a
       television, or dark; the gate shut or the door open on a lit room; shoes, pots, a bicycle, a red altar lamp by a
       door, the unit's number. The party walls stand out of the face as fins; a lift core with its lobby lit brighter and
       its motor room above the roof, the block's number painted on it; a stair tower at each end; on the roof its frame,
       its tanks and its masts. Below: a road with its markings, the footpaths and the grass, the estate's trees and its
       street lamps (real models, made for this chapter), their light on the ground, a covered walkway lit by its tubes.
       Beyond and between: the blocks of the estate round it and the taller blocks of a newer one, every corridor a lit line
       and every window its own, fading into the haze; the city's glow low in the sky. Painted light throughout (v9.4: no
       light is added), every size true. Seeded (v6.15): the same estate on every run. */
    function buildEstate() {
      const A = ACROSS, G = GROUND_Y, SH = A.storey, NS = A.storeys, TOP = G + NS * SH;
      const WZ = A.z, PZ = A.z + 1.9, PO = PZ + 0.15;            // the flats' corridor wall; the parapet's inner and outer faces
      const BAY = 10.2, LIFT = { x0: -16.6, x1: -11.4 };          // a unit's frontage; the lift lobby's width in the corridor
      const r = rng(270042);
      const canvas = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return [c, c.getContext('2d')]; };
      const lit = (c, rx, ry) => { const t = tex(done(THREE, c, true)); if (rx) rep(t, rx, ry); t.anisotropy = 8; return t; };
      /* a quad whose UVs are given (an atlas's cell), not metres */
      function quadUV(mat, a, b, c, d, u0, v0, u1, v1) {
        const Bt = batchOf(mat);
        const ax = b[0] - a[0], ay = b[1] - a[1], az = b[2] - a[2], dx = d[0] - a[0], dy = d[1] - a[1], dz = d[2] - a[2];
        let nx = ay * dz - az * dy, ny = az * dx - ax * dz, nz = ax * dy - ay * dx; const nl = Math.hypot(nx, ny, nz) || 1; nx /= nl; ny /= nl; nz /= nl;
        const P = [a, b, c, a, c, d], U = [[u0, v0], [u1, v0], [u1, v1], [u0, v0], [u1, v1], [u0, v1]];
        for (let i = 0; i < 6; i++) { Bt.p.push(P[i][0], P[i][1], P[i][2]); Bt.n.push(nx, ny, nz); Bt.u.push(U[i][0], U[i][1]); }
      }

      /* ---------------------------------------------- THE FLATS BEHIND THE PARAPETS: an atlas of households
         Twelve frontages of her plan, 10.2 m by 2.6 m each at 100 px a metre, every one a different household under the
         corridor's light; drawn on the corridor wall bay by bay, a seeded deal so no two neighbours are the same. A lobby
         cell for the lift's storeys. */
      const NV = 12, PXM = 100, CW = 1024, CH = 260, [ac, ax] = canvas(CW, CH * (NV + 1));
      const WALLC = ['#a49a87', '#a8a08e', '#9f9888', '#aaa290', '#a19786'];
      const CURT = ['#f0c27e', '#e8b070', '#f4d39a', '#d99a7a', '#e7c6a0', '#c8d6e6', '#e2e6ee', '#d6c2e0', '#b9d3a8', '#f2dcb6'];
      const DOORC = ['#5c3b27', '#6d4a30', '#7b2b23', '#3f5a4a', '#4b3a2e', '#6b5a48', '#2f3f5a'];
      function windowAt(x, ox, oy, rr, x0, x1, sill, head, look) {
        const X = (m) => ox + m * PXM, Y = (m) => oy + CH - m * PXM;
        const L = X(x0), R = X(x1), T = Y(head), Bm = Y(sill);
        /* the opening's reveal and its aluminium frame */
        x.fillStyle = '#5b5850'; x.fillRect(L - 4, T - 4, R - L + 8, Bm - T + 8);
        if (look === 'dark') {
          const g = x.createLinearGradient(L, T, R, Bm); g.addColorStop(0, '#1d1f27'); g.addColorStop(0.55, '#121319'); g.addColorStop(1, '#191a20');
          x.fillStyle = g; x.fillRect(L, T, R - L, Bm - T);
          x.fillStyle = 'rgba(160,170,190,0.10)'; x.fillRect(L + (R - L) * 0.15, T + 4, (R - L) * 0.12, Bm - T - 8);   // a reflection
        } else {
          const base = look === 'tv' ? '#7f97d8' : look === 'cool' ? '#dbe4ef' : CURT[(rr() * CURT.length) | 0];
          x.fillStyle = base; x.fillRect(L, T, R - L, Bm - T);
          /* curtains' folds, a gap between the two halves where the room shows brighter */
          const gap = L + (R - L) * (0.3 + rr() * 0.4), gw = rr() < 0.5 ? 0 : 6 + rr() * 26;
          for (let px = L; px < R; px += 5) { x.fillStyle = `rgba(0,0,0,${0.05 + 0.07 * Math.abs(Math.sin(px * 0.9 + rr()))})`; x.fillRect(px, T, 2.5, Bm - T); }
          if (gw) { x.fillStyle = look === 'tv' ? 'rgba(200,215,255,0.8)' : 'rgba(255,244,220,0.85)'; x.fillRect(gap, T, gw, Bm - T); }
          const g = x.createLinearGradient(0, T, 0, Bm); g.addColorStop(0, 'rgba(255,255,255,0.18)'); g.addColorStop(1, 'rgba(0,0,0,0.18)');
          x.fillStyle = g; x.fillRect(L, T, R - L, Bm - T);
        }
        /* louvres (the older blocks' corridor windows) or two sliding panes */
        if (rr() < 0.55) { x.fillStyle = 'rgba(40,40,44,0.55)'; for (let py = T + 9; py < Bm; py += 10) x.fillRect(L, py, R - L, 1.6); }
        else { x.fillStyle = '#6a675f'; x.fillRect((L + R) / 2 - 2, T, 4, Bm - T); }
        /* a grille over it, white or dark (fitted by owners: most have one) */
        if (rr() < 0.85) { x.fillStyle = rr() < 0.6 ? 'rgba(222,222,214,0.95)' : 'rgba(40,40,42,0.95)';
          for (let px = L + 6; px < R - 2; px += 12) x.fillRect(px, T - 2, 2.4, Bm - T + 4);
          x.fillRect(L - 3, (T + Bm) / 2 - 1.5, R - L + 6, 3); }
        /* the sill */
        x.fillStyle = '#8a8476'; x.fillRect(L - 8, Bm, R - L + 16, 5);
      }
      function household(x, ox, oy, rr, v) {
        const X = (m) => ox + m * PXM, Y = (m) => oy + CH - m * PXM;
        /* the wall, lit from the battens over the corridor: brighter near the ceiling, a little dimmer down to the floor */
        x.fillStyle = WALLC[v % WALLC.length]; x.fillRect(ox, oy, CW, CH);
        const g = x.createLinearGradient(0, oy, 0, oy + CH); g.addColorStop(0, 'rgba(255,248,232,0.16)'); g.addColorStop(0.45, 'rgba(255,248,232,0.04)'); g.addColorStop(1, 'rgba(0,0,0,0.26)');
        x.fillStyle = g; x.fillRect(ox, oy, CW, CH);
        for (let s = 0; s < 220; s++) { x.fillStyle = `rgba(${rr() < 0.5 ? '0,0,0' : '255,255,255'},0.03)`; x.fillRect(ox + rr() * CW, oy + rr() * CH, 3 + rr() * 9, 3 + rr() * 9); }
        /* its skirting, a tiled dado on some */
        x.fillStyle = 'rgba(70,64,56,0.55)'; x.fillRect(ox, Y(0.12), CW, 0.12 * PXM);
        /* the downpipe at the party wall, the gas riser by it */
        x.fillStyle = '#6f6c66'; x.fillRect(X(10.02), oy, 9, CH); x.fillStyle = '#c9b33c'; x.fillRect(X(9.86), Y(2.6), 4, CH);
        /* bedroom 3's window, the living room's, the main bedroom's (her plan's places, from the bay's left) */
        const looks = ['warm', 'warm', 'cool', 'tv', 'dark', 'dark', 'warm', 'cool', 'dark', 'warm'];
        const pick = () => looks[(rr() * looks.length) | 0];
        windowAt(x, ox, oy, rr, 0.2, 2.65, 0.9, 2.1, pick());
        windowAt(x, ox, oy, rr, 4.27, 6.45, 0.9, 2.1, pick());
        windowAt(x, ox, oy, rr, 6.6, 10.0, 0.9, 2.1, pick());
        /* the door: its frame, the leaf or, open, the lit room behind; the grille gate in front of it */
        const open = rr() < 0.28, DL = X(3.65), DR = X(4.55), DT = Y(2.1), DB = Y(0);
        x.fillStyle = '#4a463f'; x.fillRect(DL - 5, DT - 5, DR - DL + 10, DB - DT + 5);
        if (open) { const gg = x.createLinearGradient(0, DT, 0, DB); gg.addColorStop(0, '#f6d9a2'); gg.addColorStop(1, '#b98d5a');
          x.fillStyle = gg; x.fillRect(DL, DT, DR - DL, DB - DT);
          x.fillStyle = 'rgba(60,40,28,0.55)'; x.fillRect(DL + 10, Y(1.0), DR - DL - 20, 0.45 * PXM);        // a sofa's back in the room
        } else { x.fillStyle = DOORC[(rr() * DOORC.length) | 0]; x.fillRect(DL, DT, DR - DL, DB - DT);
          x.fillStyle = 'rgba(255,255,255,0.08)'; x.fillRect(DL + 4, DT + 4, 4, DB - DT - 8);
          x.fillStyle = '#c8a24a'; x.fillRect(DR - 14, Y(1.05), 8, 3); }
        x.fillStyle = rr() < 0.7 ? 'rgba(36,36,38,0.96)' : 'rgba(210,210,204,0.95)';
        for (let px = DL + 3; px < DR; px += 8) x.fillRect(px, DT + 14, 2.2, DB - DT - 14);
        x.fillRect(DL - 2, DT + 4, DR - DL + 4, 10); x.fillRect(DL - 2, Y(1.05), DR - DL + 4, 3); x.fillRect((DL + DR) / 2 - 1.5, DT + 4, 3, DB - DT - 4);
        /* by the door: the unit's number, the meter box, and on some a red altar lamp (Chinese households) or the mango
           leaves over the door (Indian ones) */
        x.fillStyle = '#e8e4d8'; x.fillRect(DR + 8, Y(1.75), 20, 9);
        x.fillStyle = '#7d7a72'; x.fillRect(DL - 46, Y(1.75), 30, 38);
        const deity = rr();
        if (deity < 0.3) { const gl = x.createRadialGradient(DL - 22, Y(1.05), 1, DL - 22, Y(1.05), 22); gl.addColorStop(0, 'rgba(255,60,40,0.95)'); gl.addColorStop(1, 'rgba(255,40,20,0)');
          x.fillStyle = gl; x.fillRect(DL - 46, Y(1.05) - 24, 48, 48); x.fillStyle = '#ff6a4a'; x.fillRect(DL - 26, Y(1.1), 8, 10); }
        else if (deity < 0.42) { x.fillStyle = '#2f6a2a'; for (let i = 0; i < 9; i++) { x.beginPath(); x.ellipse(DL + 4 + i * 10, DT + 6, 3.5, 8, 0, 0, Math.PI * 2); x.fill(); } }
        /* along the wall: a shoe rack, pots, a bicycle (most hidden by the parapet from her storey; seen on the lower ones) */
        if (rr() < 0.8) { const sx = X(rr() < 0.5 ? 2.75 : 4.7); x.fillStyle = '#3a3a3c'; x.fillRect(sx, Y(0.5), 0.8 * PXM, 0.5 * PXM);
          for (let i = 0; i < 9; i++) { x.fillStyle = ['#2b2b2b', '#6a4a30', '#a0a0a0', '#2c4a7a', '#8a2a2a'][(rr() * 5) | 0]; x.fillRect(sx + 4 + (i % 4) * 18, Y(0.12 + ((i / 4) | 0) * 0.17), 14, 5); } }
        const pots = (rr() * 4) | 0;
        for (let i = 0; i < pots; i++) { const px = X(0.4 + rr() * 9.2), h = 0.35 + rr() * 0.6;
          x.fillStyle = ['#7a4a2e', '#2a3a2a', '#9a9a92'][(rr() * 3) | 0]; x.fillRect(px - 9, Y(0.28), 18, 0.28 * PXM);
          x.fillStyle = `rgb(${40 + rr() * 30},${80 + rr() * 50},${40 + rr() * 25})`;
          for (let k = 0; k < 7; k++) { x.beginPath(); x.ellipse(px + (rr() - 0.5) * 30, Y(0.28 + rr() * h), 6 + rr() * 9, 5 + rr() * 8, 0, 0, Math.PI * 2); x.fill(); } }
        if (rr() < 0.18) { const bx = X(5.2 + rr() * 3); x.strokeStyle = '#1e1e20'; x.lineWidth = 3;
          for (const wx of [bx, bx + 105]) { x.beginPath(); x.arc(wx, Y(0.33), 31, 0, Math.PI * 2); x.stroke(); }
          x.beginPath(); x.moveTo(bx, Y(0.33)); x.lineTo(bx + 45, Y(0.85)); x.lineTo(bx + 105, Y(0.33)); x.moveTo(bx + 45, Y(0.85)); x.lineTo(bx + 30, Y(0.33)); x.stroke(); }
      }
      for (let v = 0; v < NV; v++) household(ax, 0, v * CH, rng(9100 + v * 37), v);
      /* the lift lobby's cell: tiled walls under bright tubes, two stainless lift doors, the call button, the floor's number */
      { const ox = 0, oy = NV * CH, X = (m) => ox + m * PXM, Y = (m) => oy + CH - m * PXM;
        ax.fillStyle = '#c9c8bf'; ax.fillRect(ox, oy, CW, CH);
        ax.strokeStyle = 'rgba(120,118,108,0.5)'; ax.lineWidth = 1;
        for (let px = 0; px < CW; px += 15) { ax.beginPath(); ax.moveTo(px, oy); ax.lineTo(px, oy + CH); ax.stroke(); }
        for (let py = oy; py < oy + CH; py += 15) { ax.beginPath(); ax.moveTo(0, py); ax.lineTo(CW, py); ax.stroke(); }
        for (const lx of [1.1, 3.0]) { const g = ax.createLinearGradient(X(lx), 0, X(lx + 1.1), 0); g.addColorStop(0, '#9ea2a6'); g.addColorStop(0.5, '#d9dde0'); g.addColorStop(1, '#8e9296');
          ax.fillStyle = '#5a5c5e'; ax.fillRect(X(lx) - 6, Y(2.15) - 6, 1.1 * PXM + 12, 2.15 * PXM + 6);
          ax.fillStyle = g; ax.fillRect(X(lx), Y(2.15), 1.1 * PXM, 2.15 * PXM); ax.fillStyle = '#4a4c4e'; ax.fillRect(X(lx + 0.55) - 1, Y(2.15), 2, 2.15 * PXM);
          ax.fillStyle = '#ff5a3a'; ax.fillRect(X(lx + 0.4), Y(2.4), 0.3 * PXM, 0.12 * PXM); }
        ax.fillStyle = '#e8e8e0'; ax.fillRect(X(2.6), Y(1.25), 10, 16);
        ax.fillStyle = 'rgba(255,255,255,0.12)'; ax.fillRect(ox, oy, CW, CH * 0.4); }
      const atlasT = lit(ac); atlasT.wrapS = atlasT.wrapT = THREE.ClampToEdgeWrapping;
      const mFlats = B({ map: atlasT, fog: true });

      /* ---------------------------------------------- the corridor's ceiling and floor, lit by its battens (7 m apart) */
      const strip = (W, Hh, base, hot, edge, seed, terr) => { const [c, x] = canvas(W, Hh), rr = rng(seed);
        x.fillStyle = base; x.fillRect(0, 0, W, Hh);
        if (terr) for (let s = 0; s < 2600; s++) { const v = rr(); x.fillStyle = v < 0.5 ? 'rgba(30,30,28,0.35)' : 'rgba(220,216,206,0.25)'; x.fillRect(rr() * W, rr() * Hh, 1 + rr() * 2, 1 + rr() * 2); }
        const g = x.createRadialGradient(W / 2, Hh * 0.5, 4, W / 2, Hh * 0.5, W * 0.48); g.addColorStop(0, hot); g.addColorStop(0.35, edge); g.addColorStop(1, 'rgba(0,0,0,0)');
        x.globalCompositeOperation = 'lighter'; x.fillStyle = g; x.fillRect(0, 0, W, Hh); x.globalCompositeOperation = 'source-over';
        return c; };
      /* (these and every atlas below are laid with their own UVs, quadUV: one picture a tile, so no repeat is set on them) */
      const mCeil7 = B({ map: lit(strip(512, 128, '#55524b', 'rgba(255,250,236,0.62)', 'rgba(255,250,236,0.18)', 7101)), fog: true });
      const mFloor7 = B({ map: lit(strip(512, 128, '#3a3833', 'rgba(255,248,230,0.42)', 'rgba(255,248,230,0.12)', 7102, true)), fog: true });
      const mBat = B({ color: 0xf6f9ff, fog: true });
      /* the parapet's outer face (its paint, its accent band, a coping catching the corridor's light on its edge, rain
         streaks under it), the slab's edge under it: a 5 m tile */
      const ACC = '#5b3a30';
      const mPara = B({ fog: true, map: lit((() => { const [c, x] = canvas(512, 160), rr = rng(7103);
        x.fillStyle = '#56534c'; x.fillRect(0, 0, 512, 160);
        x.fillStyle = ACC; x.fillRect(0, 60, 512, 22);                                   // the block's band of colour
        x.fillStyle = '#8f8a7e'; x.fillRect(0, 0, 512, 7);                               // the coping's lit edge
        x.fillStyle = '#34322e'; x.fillRect(0, 7, 512, 6);                               // its shadow
        x.fillStyle = '#2c2a27'; x.fillRect(0, 128, 512, 32);                            // the slab's edge
        for (let s = 0; s < 70; s++) { const sx = rr() * 512, sw = 2 + rr() * 6, sl = 20 + rr() * 90;
          const g = x.createLinearGradient(0, 13, 0, 13 + sl); g.addColorStop(0, 'rgba(20,18,16,0.35)'); g.addColorStop(1, 'rgba(20,18,16,0)');
          x.fillStyle = g; x.fillRect(sx, 13, sw, sl); }
        return c; })()) });
      const mParaIn = B({ color: 0x6e695f, fog: true });                                // its inner face and top, in the corridor's light
      const mFin = B({ fog: true, map: lit((() => { const [c, x] = canvas(64, 512);
        const g = x.createLinearGradient(0, 0, 0, 512); g.addColorStop(0, '#2c2b2e'); g.addColorStop(0.7, '#3a3834'); g.addColorStop(1, '#5a554c');
        x.fillStyle = g; x.fillRect(0, 0, 64, 512); x.fillStyle = 'rgba(255,255,255,0.05)'; x.fillRect(0, 0, 6, 512); return c; })()) });
      const mDark = B({ color: 0x24242a, fog: true });                                  // ends and backs, in the night
      const mRoofEdge = B({ color: 0x302f34, fog: true });

      /* ---------------------------------------------- THE BLOCK ACROSS, storey by storey */
      const bays = []; for (let bx = A.x0 + 4.4; bx + BAY <= A.x1 - 4.4 + 0.01; bx += BAY) bays.push(bx);
      const deal = rng(4404);
      for (let s = 1; s < NS; s++) {
        const fl = G + s * SH, ce = fl + SH - 0.25;
        /* the floor slab's edge and the parapet (outer face, inner face, top), end to end */
        quadUV(mPara, [A.x0, fl - 0.30, PO], [A.x1, fl - 0.30, PO], [A.x1, fl + 1.0, PO], [A.x0, fl + 1.0, PO], 0, 0, (A.x1 - A.x0) / 5, 1);
        quad(mParaIn, [A.x1, fl, PZ], [A.x0, fl, PZ], [A.x0, fl + 1.0, PZ], [A.x1, fl + 1.0, PZ]);
        quad(mParaIn, [A.x0, fl + 1.0, PO + 0.03], [A.x1, fl + 1.0, PO + 0.03], [A.x1, fl + 1.0, PZ], [A.x0, fl + 1.0, PZ]);
        /* the corridor's floor and ceiling, its battens */
        quadUV(mFloor7, [A.x0, fl + 0.01, PZ], [A.x1, fl + 0.01, PZ], [A.x1, fl + 0.01, WZ], [A.x0, fl + 0.01, WZ], 0, 0, (A.x1 - A.x0) / 7, 1);
        quadUV(mCeil7, [A.x0, ce, WZ], [A.x1, ce, WZ], [A.x1, ce, PZ], [A.x0, ce, PZ], 0, 0, (A.x1 - A.x0) / 7, 1);
        for (let bx = A.x0 + 3.5; bx < A.x1; bx += 7) box(mBat, bx, ce - 0.03, (WZ + PZ) / 2, 1.2, 0.04, 0.08);
        /* the flats behind it, bay by bay (and the lift lobby's cell where the lobby is) */
        for (const bx of bays) {
          const lobby = bx < LIFT.x1 && bx + BAY > LIFT.x0;
          const v = lobby ? NV : (deal() * NV) | 0, flip = deal() < 0.5;
          const v0 = 1 - (v + 1) / (NV + 1), v1 = 1 - v / (NV + 1), u0 = flip ? 1 : 0, u1 = flip ? 0 : 1;
          quadUV(mFlats, [bx, fl, WZ], [bx + BAY, fl, WZ], [bx + BAY, ce, WZ], [bx, ce, WZ], u0, v0 + 0.0004, u1, v1 - 0.0004);
        }
      }
      /* the ends past the first and last bays: the stair towers (their vents lit dimly, the stair's lamp in each) */
      const stairT = lit((() => { const [c, x] = canvas(128, 512), rr = rng(7105);
        x.fillStyle = '#2e2d30'; x.fillRect(0, 0, 128, 512);
        for (let s = 0; s < 13; s++) { const y = 512 - (s + 1) * 512 / 13;
          for (let i = 0; i < 6; i++) for (let j = 0; j < 4; j++) { x.fillStyle = s ? `rgba(230,220,190,${0.25 + rr() * 0.25})` : 'rgba(40,40,40,1)'; x.fillRect(22 + i * 15, y + 8 + j * 8, 9, 5); } }
        return c; })());
      const mStair = B({ map: stairT, fog: true });
      for (const sx of [A.x0 + 2.2, A.x1 - 2.2]) {
        quadUV(mStair, [sx - 2.2, G, PO + 1.02], [sx + 2.2, G, PO + 1.02], [sx + 2.2, TOP + 1.4, PO + 1.02], [sx - 2.2, TOP + 1.4, PO + 1.02], 0, 0, 1, 1);
        box(mDark, sx, (G + TOP + 1.4) / 2, (WZ + PO + 1.0) / 2 - 3, 4.4, TOP + 1.4 - G, PO + 1.0 - WZ + 6);
      }
      /* the party walls standing out of the face as fins, ground to roof, between every two flats */
      for (let i = 0; i <= bays.length; i++) { const fx = (i < bays.length ? bays[i] : bays[bays.length - 1] + BAY);
        quadUV(mFin, [fx - 0.2, G, PO + 0.35], [fx + 0.2, G, PO + 0.35], [fx + 0.2, TOP + 0.6, PO + 0.35], [fx - 0.2, TOP + 0.6, PO + 0.35], 0, 0, 1, 1);
        quad(mDark, [fx - 0.2, G, WZ], [fx - 0.2, G, PO + 0.35], [fx - 0.2, TOP + 0.6, PO + 0.35], [fx - 0.2, TOP + 0.6, WZ]);
        quad(mDark, [fx + 0.2, G, PO + 0.35], [fx + 0.2, G, WZ], [fx + 0.2, TOP + 0.6, WZ], [fx + 0.2, TOP + 0.6, PO + 0.35]); }
      /* the block's body behind its corridor face, its roof slab and parapet against the sky */
      box(mDark, (A.x0 + A.x1) / 2, (G + SH + TOP) / 2, WZ - 0.02 - (A.d - 0.02) / 2, A.x1 - A.x0, TOP - G - SH, A.d - 0.02);
      quad(mDark, [A.x0, G, WZ - A.d], [A.x1, G, WZ - A.d], [A.x1, G + SH, WZ - A.d], [A.x0, G + SH, WZ - A.d]);   // the void deck's back
      { const zb = WZ - A.d - 0.2, zf = PO - 0.02;                                       // the roof's parapet round its slab
        box(mRoofEdge, (A.x0 + A.x1) / 2, TOP + 0.4, (zb + zf) / 2, A.x1 - A.x0 + 0.4, 1.4, zf - zb); }
      quadUV(mPara, [A.x0, TOP - 0.3, PO + 0.01], [A.x1, TOP - 0.3, PO + 0.01], [A.x1, TOP + 1.1, PO + 0.01], [A.x0, TOP + 1.1, PO + 0.01], 0, 0, (A.x1 - A.x0) / 5, 1);
      /* THE LIFT CORE: its shaft above the roof, the motor room, the block's number on it, the lobby's tubes brighter */
      const LX = (LIFT.x0 + LIFT.x1) / 2;
      const numT = lit((() => { const [c, x] = canvas(256, 512);
        x.fillStyle = '#3a3633'; x.fillRect(0, 0, 256, 512); x.fillStyle = '#6b3f31'; x.fillRect(0, 0, 256, 30);
        x.fillStyle = '#e9e2d0'; x.font = 'bold 132px Arial, Helvetica, sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle';
        x.fillText('2', 128, 118); x.fillText('3', 128, 262); x.fillText('6', 128, 406);
        return c; })());
      const mNum = B({ map: numT, fog: true });
      quadUV(mNum, [LX - 2.4, TOP + 0.2, PO + 0.62], [LX + 2.4, TOP + 0.2, PO + 0.62], [LX + 2.4, TOP + 6.6, PO + 0.62], [LX - 2.4, TOP + 6.6, PO + 0.62], 0, 0, 1, 1);
      box(mDark, LX, TOP + 3.4, (WZ + PO + 0.6) / 2 - 1.5, 4.8, 6.4, PO + 0.6 - WZ + 3);
      box(mRoofEdge, LX, TOP + 6.75, (WZ + PO + 0.6) / 2 - 1.5, 5.4, 0.3, PO + 0.6 - WZ + 3.6);
      /* the roof's frame (the period's pitched concrete frames over the roof) and its water tanks and masts */
      for (const fx of [A.x0 + 12, A.x0 + 34, A.x1 - 30, A.x1 - 10]) {
        for (const dz of [-1, 1]) bar(mRoofEdge, [fx - 4, TOP + 1.1, WZ - A.d / 2 + dz * 4], [fx, TOP + 4.2, WZ - A.d / 2 + dz * 4], 0.18, 4);
        for (const dz of [-1, 1]) bar(mRoofEdge, [fx + 4, TOP + 1.1, WZ - A.d / 2 + dz * 4], [fx, TOP + 4.2, WZ - A.d / 2 + dz * 4], 0.18, 4);
        bar(mRoofEdge, [fx, TOP + 4.2, WZ - A.d / 2 - 4], [fx, TOP + 4.2, WZ - A.d / 2 + 4], 0.16, 4);
      }
      box(mDark, LX + 7, TOP + 2.2, WZ - A.d / 2, 6, 2.2, 4);
      for (const mx of [A.x0 + 22, A.x1 - 22, LX - 9]) post(mRoofEdge, mx, WZ - A.d / 2 + 2, 0.04, TOP + 1.1, TOP + 6.5, 5);
      /* THE VOID DECK: open under the block, its columns, the tubes on its ceiling and their light on the floor, the
         letter boxes' lit panel by the lift */
      const mVoidCeil = B({ map: lit(strip(512, 256, '#4a4842', 'rgba(255,250,236,0.75)', 'rgba(255,250,236,0.22)', 7106)), fog: true });
      const mVoidFloor = B({ map: lit(strip(512, 256, '#2e2d2a', 'rgba(255,248,230,0.45)', 'rgba(255,248,230,0.10)', 7107, true)), fog: true });
      quadUV(mVoidCeil, [A.x0, G + SH - 0.3, WZ - A.d], [A.x1, G + SH - 0.3, WZ - A.d], [A.x1, G + SH - 0.3, PO], [A.x0, G + SH - 0.3, PO], 0, 0, (A.x1 - A.x0) / 5.1, (PO - WZ + A.d) / 5);
      quadUV(mVoidFloor, [A.x0, G + 0.02, PO], [A.x1, G + 0.02, PO], [A.x1, G + 0.02, WZ - A.d], [A.x0, G + 0.02, WZ - A.d], 0, 0, (A.x1 - A.x0) / 5.1, (PO - WZ + A.d) / 5);
      for (let cx = A.x0 + 4.4; cx <= A.x1 - 4.3; cx += 5.1) for (const cz of [PO - 0.4, WZ - A.d + 0.5]) box(mParaIn, cx, G + SH / 2, cz, 0.6, SH, 0.6);
      for (let tx = A.x0 + 6.95; tx < A.x1 - 4; tx += 5.1) for (const tz of [WZ - 2, WZ - 7]) box(mBat, tx, G + SH - 0.34, tz, 1.2, 0.04, 0.1);
      { const [c, x] = canvas(256, 128); x.fillStyle = '#8c8a80'; x.fillRect(0, 0, 256, 128); x.fillStyle = '#5c5a52';
        for (let i = 0; i < 16; i++) for (let j = 0; j < 6; j++) x.fillRect(4 + i * 15.8, 6 + j * 20, 13, 17);
        quadUV(B({ map: lit(c), fog: true }), [LX - 2.2, G + 0.4, WZ - 0.9], [LX + 2.2, G + 0.4, WZ - 0.9], [LX + 2.2, G + 2.0, WZ - 0.9], [LX - 2.2, G + 2.0, WZ - 0.9], 0, 0, 1, 1); }

      /* ---------------------------------------------- THE GROUND between the blocks and round them */
      const mGrass = B({ fog: true, map: lit((() => { const [c, x] = canvas(256, 256), rr = rng(7108);
        x.fillStyle = '#16200f'; x.fillRect(0, 0, 256, 256);
        for (let s = 0; s < 3000; s++) { x.fillStyle = `rgba(${30 + rr() * 30},${50 + rr() * 40},${20 + rr() * 20},0.5)`; x.fillRect(rr() * 256, rr() * 256, 2, 2); }
        return c; })(), 6, 6) });
      const mRoad = B({ color: 0x1b1c1f, fog: true });
      const mPath = B({ color: 0x3c3a36, fog: true });
      const mLine = B({ color: 0x8c8a82, fog: true });
      const mKerb = B({ color: 0x55534d, fog: true });
      floor(mGrass, -160, -150, 160, 60, G);
      floor(mRoad, -160, -35.2, 160, -28.0, G + 0.02);                                    // the road along the block across
      for (let lx = -150; lx < 150; lx += 6) floor(mLine, lx, -31.68, lx + 3, -31.52, G + 0.03);
      floor(mPath, -160, -38.6, 160, -35.2, G + 0.025); floor(mPath, -160, -28.0, 160, -25.6, G + 0.025);   // its footpaths
      box(mKerb, 0, G + 0.08, -35.2, 320, 0.16, 0.18); box(mKerb, 0, G + 0.08, -28.0, 320, 0.16, 0.18);
      floor(mPath, -160, -6.0, 160, -3.2, G + 0.025);                                     // the path under her own block
      /* the covered walkway along her block's foot: its roof on posts, the tubes under it lit (seen over the parapet) */
      const WK = { z: -12.5, w: 3.0, h: 3.0 };
      box(mDark, 0, G + WK.h + 0.08, WK.z, 120, 0.16, WK.w);
      quad(B({ color: 0xcfc9b8, fog: true }), [-60, G + WK.h, WK.z + WK.w / 2], [60, G + WK.h, WK.z + WK.w / 2], [60, G + WK.h, WK.z - WK.w / 2], [-60, G + WK.h, WK.z - WK.w / 2]);
      for (let px = -58; px <= 58; px += 6) for (const pz of [WK.z - 1.35, WK.z + 1.35]) post(mParaIn, px, pz, 0.06, G, G + WK.h, 6);
      floor(mPath, -60, WK.z - WK.w / 2, 60, WK.z + WK.w / 2, G + 0.03);
      /* the street lamps' light on the ground (painted pools: their heads are the models') */
      const poolT = lit((() => { const [c, x] = canvas(128, 128); const g = x.createRadialGradient(64, 64, 2, 64, 64, 62);
        g.addColorStop(0, 'rgba(255,246,226,0.55)'); g.addColorStop(0.4, 'rgba(255,240,215,0.22)'); g.addColorStop(1, 'rgba(255,240,215,0)');
        x.fillStyle = g; x.fillRect(0, 0, 128, 128); return c; })());
      const mPool = new THREE.MeshBasicMaterial({ map: poolT, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: true }); mats.push(mPool);
      const LAMPS = [];
      for (let lx = -96; lx <= 96; lx += 24) LAMPS.push({ x: lx, z: -27.3, ry: Math.PI });
      for (let lx = -84; lx <= 84; lx += 24) LAMPS.push({ x: lx, z: -38.9, ry: 0 });
      for (const L of LAMPS) { const pz = L.z + (L.ry ? -1.6 : 1.6);
        quadUV(mPool, [L.x - 7, G + 0.05, pz + 7], [L.x + 7, G + 0.05, pz + 7], [L.x + 7, G + 0.05, pz - 7], [L.x - 7, G + 0.05, pz - 7], 0, 0, 1, 1); }
      many('w4streetlamp', LAMPS.map(L => ({ x: L.x, y: G, z: L.z, ry: L.ry })), world, 0.02);
      /* the estate's trees: angsanas along the road and the paths, foxtail palms in the gaps */
      const TREES = [], PALMS = [], tr = rng(7110);
      for (let tx = -84; tx <= 84; tx += 16) { if (tr() < 0.15) continue; TREES.push({ x: tx + (tr() - 0.5) * 4, y: G, z: -23.2 + (tr() - 0.5) * 2, ry: tr() * 6.28, s: 0.85 + tr() * 0.3 }); }
      for (const [tx, tz] of [[-68, -36], [-74, -50], [54, -33], [61, -47], [-30, -8.5], [-13, -9], [16, -8.5], [33, -9]]) TREES.push({ x: tx, y: G, z: tz, ry: tr() * 6.28, s: 0.8 + tr() * 0.3 });
      for (let tx = -90; tx <= 90; tx += 13) { if (tr() < 0.35) continue; PALMS.push({ x: tx + (tr() - 0.5) * 3, y: G, z: -17.5 + (tr() - 0.5) * 3, ry: tr() * 6.28, s: 0.9 + tr() * 0.2 }); }
      many('w4angsana', TREES, world, 0.03);
      many('w4foxpalm', PALMS, world, 0.03);

      /* ---------------------------------------------- THE BLOCKS ROUND THEM, and the newer estate's taller ones beyond:
         each its corridor lines and its windows, painted at a storey's true size, fading into the haze */
      const farT = (seed, cols, rows) => { const [c, x] = canvas(512, 512), rr = rng(seed), cw = 512 / cols, rh = 512 / rows;
        x.fillStyle = '#1d1d23'; x.fillRect(0, 0, 512, 512);
        for (let j = 0; j < rows; j++) { const y0 = j * rh;
          x.fillStyle = 'rgba(205,214,232,0.55)'; x.fillRect(0, y0 + rh * 0.08, 512, Math.max(1.5, rh * 0.07));      // the corridor's lit line
          x.fillStyle = '#2a2a30'; x.fillRect(0, y0 + rh * 0.66, 512, rh * 0.1);                                         // the parapet's band
          for (let i = 0; i < cols; i++) { const v = rr(); if (v > 0.62) continue;
            x.fillStyle = v < 0.3 ? '#e9c487' : v < 0.48 ? '#d7e0ea' : v < 0.54 ? '#8ea4dc' : '#f0b878';
            x.fillRect(i * cw + cw * 0.2, y0 + rh * 0.22, cw * 0.55, rh * 0.36); } }
        return c; };
      const FAR = [[7120, 24, 13], [7121, 20, 30], [7122, 28, 16]].map(([sd, cols, rows]) => ({ m: B({ map: lit(farT(sd, cols, rows)), fog: true }), W: cols * 3.4, H: rows * 2.85 }));
      const [mFarA, mFarB, mFarC] = FAR;
      const slab = (F, x0, z0, x1, z1, h, d = 12) => {               // a block from (x0, z0) to (x1, z1), its lit face toward her
        const nx = z1 - z0, nz = -(x1 - x0), nl = Math.hypot(nx, nz), ox = nx / nl * d, oz = nz / nl * d;
        quadUV(F.m, [x0, G, z0], [x1, G, z1], [x1, G + h, z1], [x0, G + h, z0], 0, 0, nl / F.W, h / F.H);
        quad(mDark, [x0 + ox, G, z0 + oz], [x0, G, z0], [x0, G + h, z0], [x0 + ox, G + h, z0 + oz]);
        quad(mDark, [x1, G, z1], [x1 + ox, G, z1 + oz], [x1 + ox, G + h, z1 + oz], [x1, G + h, z1]);
        quad(mRoofEdge, [x0, G + h, z0], [x1, G + h, z1], [x1 + ox, G + h, z1 + oz], [x0 + ox, G + h, z0 + oz]);
      };
      slab(mFarA, -128, -8, -74, -46, 37.05);                          // a block turned toward her, west of the one across
      slab(mFarA, 66, -52, 118, -20, 37.05);                           // and one east of it
      slab(mFarC, -150, -112, -60, -128, 45.6);                        // the next row behind, three storeys taller
      slab(mFarC, 40, -120, 140, -104, 45.6);
      /* (the newer estate's towers, 34 to 40 storeys: from her storey they must rise past the block across's roof, 21.6
         degrees up, to be seen over it at 150 to 200 m) */
      slab(mFarB, -46, -150, -8, -158, 108.3, 14);
      slab(mFarB, 18, -176, 52, -182, 114.0, 14);
      slab(mFarB, -96, -190, -64, -200, 102.6, 14);
      slab(mFarB, 84, -168, 112, -176, 96.9, 14);
      /* her own block's corridor face below her storey (each storey's band, its lit line and the parapet) */
      for (let s = 1; s <= 7; s++) { const y = -s * 2.85;
        const zo = CORR.para - 0.075;
        quadUV(mPara, [CORR.x1, y - 0.3, zo], [CORR.x0, y - 0.3, zo], [CORR.x0, y + 1.0, zo], [CORR.x1, y + 1.0, zo], 0, 0, (CORR.x1 - CORR.x0) / 5, 1);
        box(mBat, 0, y + 2.5, CORR.para + 0.6, CORR.x1 - CORR.x0, 0.02, 0.02); }
    }

    /* the glass of every window, drawn last (see-through: after the opaque) */
    function buildGlass() {
      for (const g of glass) quad(mGlassNight, [g.x0, g.y0, g.z], [g.x1, g.y0, g.z], [g.x1, g.y1, g.z], [g.x0, g.y1, g.z]);
    }

    /* ---------------------------------------------- the ground under him: her floor, the corridor 0.10 below it */
    function flatGround(x, z) { return z < FL.face * 0.5 ? FL.corr : 0; }

    buildShell();
    buildCorridor();
    buildEstate();
    buildGlass();
    flush(world);
