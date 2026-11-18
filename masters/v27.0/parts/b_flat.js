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
    /* THE BLOCK ACROSS: thirteen storeys of an HDB slab at night, its corridors a white line each storey, its flats'
       windows lit warm and cool or dark, painted at the storey's own size so a metre is a metre (no picture is copied) */
    const mAcross = (() => { const W = 1024, H = 1024, [c, x] = cnv(W), r = rng(130013), ST = 13, SH = H / ST, UW = W / 8;
      x.fillStyle = '#2a2a30'; x.fillRect(0, 0, W, H);
      for (let s = 0; s < ST; s++) { const y0 = s * SH;
        x.fillStyle = '#3a3a40'; x.fillRect(0, y0 + SH * 0.62, W, SH * 0.08);                         // the parapet's band
        x.fillStyle = 'rgba(235,242,255,0.95)'; x.fillRect(0, y0 + SH * 0.06, W, SH * 0.035);          // the corridor's battens
        for (let u = 0; u < 8; u++) { const lit = r(), xx = u * UW;
          x.fillStyle = lit < 0.35 ? '#ffd69a' : lit < 0.55 ? '#dfeaff' : lit < 0.62 ? '#ffb87a' : '#141418';
          x.fillRect(xx + UW * 0.12, y0 + SH * 0.18, UW * 0.32, SH * 0.36); x.fillRect(xx + UW * 0.56, y0 + SH * 0.18, UW * 0.3, SH * 0.36);
          x.fillStyle = 'rgba(30,30,34,0.9)'; x.fillRect(xx + UW * 0.47, y0 + SH * 0.12, UW * 0.06, SH * 0.5); } }
      const t = tex(done(THREE, c, true)); rep(t, 8 * 10.2 / 8, ACROSS.storeys * ACROSS.storey);
      return B({ map: t, fog: true }); })();
    const mAcrossEnd = M({ color: 0x23232a, roughness: 1 });
    const mGround = M({ color: 0x15161a, roughness: 1 });
    const mRoad = M({ color: 0x1b1c20, roughness: 0.9 });
    const mLamp = B({ color: 0xf4f8ff });

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
      /* the corridor's face of the facade continues past her flat to her neighbours' (their doors and windows painted
         shut: their own lives behind them), and up to the soffit */
      wallX(mWallOut, fz, F.face, CORR.x0, F.x0, [], 0, CORR.soffit, false); wallX(mWallOut, fz, F.face, F.x1, CORR.x1, [], 0, CORR.soffit, false);
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
      /* the battens: a 1.2 m LED tube under the soffit every 7 m */
      for (let x = -24.5; x <= 24.5; x += 7) box(mBatten, x, c.soffit - 0.03, -0.9, 1.2, 0.03, 0.06);
      /* her neighbours' doors: the door and the gate are the models hers are (c_props.js NEIGHBOURS); here a window
         beside each (shut, dark) */
      for (const nx of NEIGHBOURS) glass.push({ x0: nx + 0.6, x1: nx + 2.8, y0: 0.9, y1: 2.1, z: -0.01 });
      /* the corridor's own collision (the opening film walks it; play never does: the gate is shut behind them) */
      solidBox(c.x1 - c.x0, 1.2, 0.15, (c.x0 + c.x1) / 2, 0.5, c.para + 0.075);
    }

    /* ================================================================ THE ESTATE
       The block across (forty metres out, thirteen storeys, its corridors' lights in rows), the ground far below with a
       road and its white street lamps, and her own block's facade below her storey. A painted world: the night hides it
       to its shapes and lights, and nothing in it is walked */
    function buildEstate() {
      const A = ACROSS, top = GROUND_Y + A.storeys * A.storey;
      /* its face (toward her block: +z), its two ends and its roof's edge */
      quad(mAcross, [A.x0, GROUND_Y, A.z], [A.x1, GROUND_Y, A.z], [A.x1, top, A.z], [A.x0, top, A.z], 0, 0);
      box(mAcrossEnd, A.x0 - 0.1, (GROUND_Y + top) / 2, A.z - A.d / 2, 0.2, top - GROUND_Y, A.d);
      box(mAcrossEnd, A.x1 + 0.1, (GROUND_Y + top) / 2, A.z - A.d / 2, 0.2, top - GROUND_Y, A.d);
      box(mAcrossEnd, (A.x0 + A.x1) / 2, top + 0.6, A.z - A.d / 2, A.x1 - A.x0 + 0.4, 1.2, A.d);
      /* the ground, a road along the blocks, its lamps (a pole and a white head, every 30 m: painted light) */
      floor(mGround, -120, -110, 120, 40, GROUND_Y);
      floor(mRoad, -120, -24, 120, -16, GROUND_Y + 0.01);
      for (let x = -105; x <= 105; x += 30) {
        post(mAcrossEnd, x, -16.6, 0.07, GROUND_Y, GROUND_Y + 8);
        box(mLamp, x, GROUND_Y + 8.02, -17.3, 0.35, 0.08, 1.2);
      }
      /* her own block's corridor face below her storey (each storey's band and its battens' line), so the view down
         from the corridor is the block's own */
      for (let s = 1; s <= 7; s++) { const y = -s * 2.85;
        box(mWallOut, 0, y + 0.45, CORR.para + 0.1, CORR.x1 - CORR.x0, 0.9, 0.18);
        box(mBatten, 0, y + 2.5, CORR.para + 0.6, CORR.x1 - CORR.x0, 0.02, 0.02); }
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
