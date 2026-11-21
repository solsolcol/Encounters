  function build(ctx) {
//@@COPY 309-451 :: const { THREE, GLTFLoader, cloneSkinned, scene, camera, yaw, pitch, LOW, kit, cnv, loadImageTexture,

    /* ================================================================ THE WORLD (the tracker's M6; the plan's 8.1, 8.2, 9.4)
       docs/V28.0-WORLD.md has every number below written out with its reason. Units metres, y up. THE ORIGIN is the middle
       of the lift's doors on the walkway's floor, where the opening film puts him down: the walkway runs from there along
       -z (a turn of 0 looks down it), turns to -x at its end, and reaches Mr Koh's gate; his court runs from the gate along
       +z to his front doors; his living and dining room is behind them. Case three's room is a pocket world 240 m along
       +z, past the lens's far plane (160 m) from everything of the home, so neither is ever drawn from the other (v8.9).
       Every thing in it is a real model made for this chapter (masters/v28.0/props/RECORD.md), placed by its own size;
       what is painted here is only what a builder pours or paints (floors, walls, slabs, glass, the estate's faces). No
       lamp is added on screen (v15.1): the lamps' light is painted. */
    const WALK = { x0: -0.95, x1: 0.95, z0: -15.9, z1: 1.2, turnZ: -14.0, endX: -12.3, soffit: 2.75, slab: 0.20, edge: 1.0 };
    /* the walkway is a block's third storey (a storey 2.95 m): the estate's ground 5.9 m below its floor */
    const STOREY = 2.95, GROUND_Y = -2 * STOREY;
    /* HIS COURT (the plan's 8.1: 5.2 m by 8.4 m, open to the sky; the fight's ground, its 5.6) */
    const COURT = { x0: -11.1, x1: -5.9, z0: -14.0, z1: -5.6, wallTop: 3.0 * STOREY };
    const GATE = { x: -8.5, w: 1.248, h: 1.40, post: 0.417, frontH: 1.5 };
    /* HIS HOUSE: the front wall on the court's far side; the L-shaped living and dining room behind it (7.2 m across) */
    const HOUSE = { face: -5.6, ceil: 2.70, wall: 0.12 };
    const LIVING = { x0: -12.3, x1: -5.1, z0: -5.5, z1: -1.6 };
    const DINING = { x0: -12.3, x1: -8.5, z0: -1.6, z1: 1.6 };
    const DOOR_FRONT = { x0: -8.9, x1: -8.1, h: 2.10 };
    const WIN_A = { x0: -10.95, x1: -10.0, sill: 0.85, head: 2.10 };    // the front windows on the court, either side of the door
    const WIN_B = { x0: -7.0, x1: -6.05, sill: 0.85, head: 2.10 };      // (narrow, so the shoe cabinet stands between WIN_A and the door)
    const TERRACE = { z0: -4.7, z1: -2.6, h: 2.15, out: -13.8 };         // the terrace doors in the living room's west wall
    /* CASE THREE'S ROOM (the plan's 8.2): about 4 m by 5 m, upstairs, in daylight */
    const ROOM = { x0: -2.0, x1: 2.0, z0: 237.5, z1: 242.5, ceil: 2.80, cx: 0, cz: 240.0 };
    const LIFT = { x0: -0.8, x1: 0.8, z0: 1.35, z1: 2.85, h: 2.35, door: 0.45 };
    const EYE = 1.62;

    const world = new THREE.Group(); world.name = 'e4c5'; scene.add(world);
    const solids = [];
    const matProxy = M({ color: 0x8d7a66, roughness: 0.9 });
    /* a thing he cannot walk through: a box, never drawn (collision is a column from the floor: v5.03) */
    const solidBox = (w, h, d, x, y, z, ry = 0) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), matProxy);
      m.position.set(x, y, z); m.rotation.y = ry; m.visible = false; world.add(m); solids.push(m); return m;
    };
    /* a solid by its two corners on the floor */
    const solidXZ = (x0, z0, x1, z1, h = 2.2) => solidBox(Math.abs(x1 - x0), h, Math.abs(z1 - z0), (x0 + x1) / 2, h / 2, (z0 + z1) / 2);

    /* ------------------------------------------------- one parse per asset, many of one, a model stood (chapter 3's own,
       as chapter 4 copied them), and the merged pieces of what never moves */
//@@COPY 519-897 :: function parseOnce(key) {

    /* ================================================================ THE SURFACES (painted: each at its real size, so a
       metre of wall is a metre of its picture; the merged pieces' UVs are metres) */
    const rep = (t, tu, tv) => { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(1 / tu, 1 / tv); return t; };
    /* a quad whose picture is laid on it once, whole (a plate, a sign): UVs 0..1 */
    function quadUV(mat, a, b, c, d) { const Bt = batchOf(mat); let nx = (b[1] - a[1]) * (d[2] - a[2]) - (b[2] - a[2]) * (d[1] - a[1]), ny = (b[2] - a[2]) * (d[0] - a[0]) - (b[0] - a[0]) * (d[2] - a[2]), nz = (b[0] - a[0]) * (d[1] - a[1]) - (b[1] - a[1]) * (d[0] - a[0]);
      const nl = Math.hypot(nx, ny, nz) || 1; const P = [a, b, c, a, c, d], U = [[0, 0], [1, 0], [1, 1], [0, 0], [1, 1], [0, 1]];
      for (let i = 0; i < 6; i++) { Bt.p.push(P[i][0], P[i][1], P[i][2]); Bt.n.push(nx / nl, ny / nl, nz / nl); Bt.u.push(U[i][0], U[i][1]); } }
    const canvas = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return [c, c.getContext('2d')]; };
    const pic = (c, tu, tv, aniso = 8) => { const t = tex(done(THREE, c, true)); rep(t, tu, tv); t.anisotropy = aniso; return t; };
    /* square tiles: `n` a side in the picture, their colour varied a little, their grout */
    function tiles(W, n, base, grout, seed, vary = 0.08, speck = 0) {
      const [c, x] = canvas(W, W), r = rng(seed), T = W / n, [R, G, Bl] = base;
      x.fillStyle = grout; x.fillRect(0, 0, W, W);
      for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
        const k = 1 - vary / 2 + r() * vary;
        x.fillStyle = `rgb(${(R * k) | 0},${(G * k) | 0},${(Bl * k) | 0})`; x.fillRect(i * T + 1.5, j * T + 1.5, T - 3, T - 3);
        for (let s = 0; s < speck; s++) { x.fillStyle = r() < 0.5 ? 'rgba(60,55,50,0.22)' : 'rgba(255,255,250,0.22)';
          x.fillRect(i * T + 2 + r() * (T - 4), j * T + 2 + r() * (T - 4), 1 + r() * 1.5, 1 + r() * 1.5); }
      }
      return c;
    }
    /* plaster painted: even, a few soft spots under 1 % (chapter 4's R36 measure: more read as damp) */
    function paint(hex, seed) {
      const [c, x] = canvas(256, 256), r = rng(seed);
      x.fillStyle = hex; x.fillRect(0, 0, 256, 256);
      for (let s = 0; s < 110; s++) { const cx = r() * 256, cy = r() * 256, q = 8 + r() * 26, dark = r() < 0.5;
        const g = x.createRadialGradient(cx, cy, 0, cx, cy, q); g.addColorStop(0, dark ? 'rgba(0,0,0,0.008)' : 'rgba(255,255,255,0.01)'); g.addColorStop(1, 'rgba(0,0,0,0)');
        x.fillStyle = g; x.fillRect(cx - q, cy - q, q * 2, q * 2); }
      return c;
    }
    /* the walkway's floor: 300 mm homogeneous tiles, a warm grey, speckled (a 1980s condominium's common corridor) */
    const mWalkFloor = M({ map: pic(tiles(512, 4, [176, 166, 152], '#6e665c', 28501, 0.07, 500), 1.2, 1.2), roughness: 0.55 });
    /* the walkway's slab over it, its edge and the parapets' faces: the block's paint, a warm white with a grey band */
    const mSoffit = M({ color: 0xd9d4c8, roughness: 0.95 });
    const mFace = M({ map: pic(paint('#e7e1d3', 28502), 1.4, 1.4), roughness: 0.92 });
    const mBand = M({ color: 0x8f8a82, roughness: 0.85 });
    /* the court's paving: 400 mm concrete pavers, grey-beige, a darker path of 300 mm pavers down its middle */
    const mPave = M({ map: pic(tiles(512, 4, [168, 160, 146], '#5a554e', 28503, 0.12, 900), 1.6, 1.6), roughness: 0.9 });
    const mPath = M({ map: pic(tiles(512, 4, [138, 128, 116], '#4c463f', 28504, 0.10, 700), 1.2, 1.2), roughness: 0.85 });
    /* the court's walls: his own and his neighbours', the block's paint */
    const mCourtWall = M({ map: pic(paint('#ddd5c4', 28505), 1.4, 1.4), roughness: 0.93 });
    /* inside: 600 mm polished beige marble-look tiles (the period's), walls a pale warm paint, a plaster ceiling */
    const mFloorIn = (() => { const [c, x] = canvas(512, 512), r = rng(28506);
      x.fillStyle = '#6d6052'; x.fillRect(0, 0, 512, 512);
      for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) { const k = 0.95 + r() * 0.08;
        x.fillStyle = `rgb(${(214 * k) | 0},${(200 * k) | 0},${(178 * k) | 0})`; x.fillRect(i * 256 + 1.5, j * 256 + 1.5, 253, 253);
        for (let v = 0; v < 14; v++) { x.strokeStyle = `rgba(${150 + r() * 40},${130 + r() * 30},${110 + r() * 20},${0.10 + r() * 0.12})`; x.lineWidth = 0.6 + r() * 1.6;
          x.beginPath(); let px = i * 256 + r() * 256, py = j * 256 + r() * 256; x.moveTo(px, py);
          for (let s = 0; s < 6; s++) { px += (r() - 0.3) * 60; py += (r() - 0.5) * 50; x.lineTo(Math.max(i * 256 + 2, Math.min(i * 256 + 254, px)), Math.max(j * 256 + 2, Math.min(j * 256 + 254, py))); }
          x.stroke(); } }
      return M({ map: pic(c, 1.2, 1.2), roughness: 0.32 }); })();
    const mWallIn = M({ map: pic(paint('#e3d9c6', 28507), 1.4, 1.4), roughness: 0.92, emissive: 0x2a2014 });   // (lamp-lit: painted light, v9.4)
    const mCeil = M({ color: 0xe8e4da, roughness: 0.95, emissive: 0x262420 });
    const mSkirt = M({ color: 0x5a4636, roughness: 0.6 });
    const mVeneer = (() => { const [c, x] = canvas(128, 256), r = rng(28508);
      x.fillStyle = '#7d5a3e'; x.fillRect(0, 0, 128, 256);
      for (let i = 0; i < 80; i++) { x.strokeStyle = `rgba(${30 + r() * 30},${18 + r() * 14},10,${0.18 + r() * 0.2})`; x.lineWidth = 1 + r() * 2;
        const xx = r() * 128; x.beginPath(); x.moveTo(xx, 0); x.bezierCurveTo(xx + r() * 8 - 4, 80, xx + r() * 8 - 4, 170, xx + r() * 6 - 3, 256); x.stroke(); }
      return M({ map: pic(c, 0.9, 2.1), roughness: 0.55 }); })();
    const mAlu = M({ color: 0xb9bcbd, roughness: 0.4, metalness: 0.5 });
    /* GLASS: see-through, with the sky's faint reflection laid on it (a picture: brighter at its head, a soft diagonal
       sheen, nearly clear at its foot), so a pane reads as glass from any side and what is behind it reads as behind it */
    const reflTex = (() => { const [c, x] = canvas(128, 256);
      const g = x.createLinearGradient(0, 0, 0, 256); g.addColorStop(0, 'rgba(235,240,250,0.95)'); g.addColorStop(0.45, 'rgba(210,220,236,0.42)'); g.addColorStop(1, 'rgba(190,200,215,0.18)');
      x.fillStyle = g; x.fillRect(0, 0, 128, 256);
      x.globalCompositeOperation = 'lighter';
      const s2 = x.createLinearGradient(0, 40, 128, 150); s2.addColorStop(0, 'rgba(255,255,255,0)'); s2.addColorStop(0.5, 'rgba(255,255,255,0.22)'); s2.addColorStop(1, 'rgba(255,255,255,0)');
      x.fillStyle = s2; x.beginPath(); x.moveTo(20, 0); x.lineTo(70, 0); x.lineTo(128, 120); x.lineTo(128, 200); x.closePath(); x.fill();
      return tex(done(THREE, c, false)); })();
    const mGlass = M({ color: 0xb4c2d2, map: reflTex, roughness: 0.06, metalness: 0.1, transparent: true, opacity: 0.30, depthWrite: false });
    const mGlassDay = M({ color: 0xdce8f2, map: reflTex, roughness: 0.05, metalness: 0.1, transparent: true, opacity: 0.22, depthWrite: false });
    /* the lift: brushed steel, its floor a grey rubber, its ceiling a lit panel (painted light) */
    const mSteel = (() => { const [c, x] = canvas(256, 256), r = rng(28509);
      x.fillStyle = '#9da2a6'; x.fillRect(0, 0, 256, 256);
      for (let i = 0; i < 900; i++) { x.fillStyle = `rgba(${r() < 0.5 ? '255,255,255' : '40,44,48'},${0.04 + r() * 0.06})`; x.fillRect(0, r() * 256, 256, 1); }
      return M({ map: pic(c, 0.6, 0.6), roughness: 0.4, metalness: 0.15 }); })();
    const mRubber = M({ map: pic(tiles(128, 8, [70, 72, 74], '#3c3e40', 28510, 0.05), 0.4, 0.4), roughness: 0.9 });
    const mLit = B({ color: 0xf6f3ea });
    /* the receiving room: pale grey vinyl planks, white walls, a white ceiling */
    const mRoomFloor = (() => { const [c, x] = canvas(512, 512), r = rng(28511);
      x.fillStyle = '#7a776f'; x.fillRect(0, 0, 512, 512);
      /* (each row of planks is laid round the picture's width and drawn again one width over, so the picture repeats
         with no seam: the first floor's rows ended at its edge, a line down the room's middle) */
      for (let j = 0; j < 8; j++) { const px0 = -r() * 300; let px = px0; while (px < px0 + 512) { const L = Math.min(180 + r() * 260, px0 + 512 - px), k = 0.93 + r() * 0.1;
        const col = `rgb(${(188 * k) | 0},${(182 * k) | 0},${(170 * k) | 0})`, grain = [];
        for (let s = 0; s < 6; s++) grain.push([`rgba(120,112,100,${0.08 + r() * 0.08})`, j * 64 + 6 + r() * 52, (r() - 0.5) * 4]);
        for (const off of [0, 512, -512]) { const qx = px + off; x.fillStyle = col; x.fillRect(qx + 1, j * 64 + 1, L - 2, 62);
          for (const [st, yy, dy] of grain) { x.strokeStyle = st; x.beginPath(); x.moveTo(qx + 2, yy); x.lineTo(qx + L - 2, yy + dy); x.stroke(); } }
        px += L; } }
      return M({ map: pic(c, 1.6, 1.6), roughness: 0.6 }); })();
    const mRoomWall = M({ map: pic(paint('#ecebe5', 28512), 1.4, 1.4), roughness: 0.93 });

    /* ---------------------------------------------- walls with their openings (chapter 4's wallX / wallZ: a wall's
       thickness drawn, so an opening shows its reveal; each piece a solid where it stands on walkable floor) */
    function wallX(mat, zc, d, x0, x1, opens = [], y0 = 0, y1 = 2.7, solid = true) {
      const cuts = opens.slice().sort((a, b) => a.x0 - b.x0); let at = x0;
      const piece = (a, b, ya, yb, sol) => { if (b - a < 0.005 || yb - ya < 0.005) return;
        box(mat, (a + b) / 2, (ya + yb) / 2, zc, b - a, yb - ya, d, 0, mat, false);
        if (sol && solid) solidBox(b - a, Math.max(1.2, yb - ya), d, (a + b) / 2, Math.max(0.6, (ya + yb) / 2), zc); };
      for (const o of cuts) { piece(at, o.x0, y0, y1, true); piece(o.x0, o.x1, y0, o.y0, o.y0 > 0.6); piece(o.x0, o.x1, o.y1, y1, false); at = o.x1; }
      piece(at, x1, y0, y1, true);
    }
    function wallZ(mat, xc, d, z0, z1, opens = [], y0 = 0, y1 = 2.7, solid = true) {
      const cuts = opens.slice().sort((a, b) => a.z0 - b.z0); let at = z0;
      const piece = (a, b, ya, yb, sol) => { if (b - a < 0.005 || yb - ya < 0.005) return;
        box(mat, xc, (ya + yb) / 2, (a + b) / 2, d, yb - ya, b - a, 0, mat, false);
        if (sol && solid) solidBox(d, Math.max(1.2, yb - ya), b - a, xc, Math.max(0.6, (ya + yb) / 2), (a + b) / 2); };
      for (const o of cuts) { piece(at, o.z0, y0, y1, true); piece(o.z0, o.z1, y0, o.y0, o.y0 > 0.6); piece(o.z0, o.z1, o.y1, y1, false); at = o.z1; }
      piece(at, z1, y0, y1, true);
    }
    /* a window's aluminium frame and its glass, in a wall along x (z its middle) or along z (x its middle) */
    const glass = [];
    function windowX(o, zc, d, mat = mGlass) {
      const w = o.x1 - o.x0, h = o.head - o.sill, fr = 0.04, xm = (o.x0 + o.x1) / 2;
      box(mAlu, xm, o.sill + fr / 2, zc, w, fr, d * 0.6); box(mAlu, xm, o.head - fr / 2, zc, w, fr, d * 0.6);
      box(mAlu, o.x0 + fr / 2, (o.sill + o.head) / 2, zc, fr, h, d * 0.6); box(mAlu, o.x1 - fr / 2, (o.sill + o.head) / 2, zc, fr, h, d * 0.6);
      box(mAlu, xm, (o.sill + o.head) / 2, zc, 0.035, h, d * 0.5);
      glass.push({ mat, a: [o.x0, o.sill, zc], b: [o.x1, o.sill, zc], c: [o.x1, o.head, zc], d: [o.x0, o.head, zc] });
    }
    function windowZ(o, xc, d, mat = mGlass) {
      const w = o.z1 - o.z0, h = o.head - o.sill, fr = 0.04, zm = (o.z0 + o.z1) / 2;
      box(mAlu, xc, o.sill + fr / 2, zm, d * 0.6, fr, w); box(mAlu, xc, o.head - fr / 2, zm, d * 0.6, fr, w);
      box(mAlu, xc, (o.sill + o.head) / 2, o.z0 + fr / 2, d * 0.6, h, fr); box(mAlu, xc, (o.sill + o.head) / 2, o.z1 - fr / 2, d * 0.6, h, fr);
      box(mAlu, xc, (o.sill + o.head) / 2, zm, d * 0.5, h, 0.035);
      glass.push({ mat, a: [xc, o.sill, o.z1], b: [xc, o.sill, o.z0], c: [xc, o.head, o.z0], d: [xc, o.head, o.z1] });
    }

    /* A HOME'S WINDOW SEEN FROM OUTSIDE (the storeys over his home, the court's side walls): in the wall's opening its
       aluminium frame and mullion, its glass (the sky's reflection), a ledge under it, and the room behind: a curtain
       drawn 0.32 m in, lit warm, lit by a television, or dark (ROOMS, four kinds dealt by a seeded stream). `axis` 'x':
       a wall along x whose outer face is at z = face, `n` the way it faces (+1 / -1 in z); 'z': along z, face at x. */
    const ROOMS = (() => { const [c, x] = canvas(512, 512), r = rng(28525);
      const kinds = [['#efc68a', '#f8dcae', 0.95], ['#9fb2d8', '#c9d6ee', 0.75], ['#3a3632', '#4c4640', 0.0], ['#e8d2a8', '#fbe8c4', 0.85]];
      kinds.forEach(([a, b2, glow], k) => { const ox = (k % 2) * 256, oy = ((k / 2) | 0) * 256;
        const g = x.createLinearGradient(ox, oy, ox + 256, oy); for (let i = 0; i <= 12; i++) g.addColorStop(i / 12, i % 2 ? a : b2);
        x.fillStyle = g; x.fillRect(ox, oy, 256, 256);
        for (let i = 0; i < 26; i++) { x.fillStyle = `rgba(0,0,0,${0.03 + r() * 0.05})`; x.fillRect(ox + r() * 256, oy, 2 + r() * 6, 256); }
        if (glow) { const rg = x.createRadialGradient(ox + 128, oy + 60, 10, ox + 128, oy + 60, 200); rg.addColorStop(0, `rgba(255,248,230,${0.35 * glow})`); rg.addColorStop(1, 'rgba(0,0,0,0.18)'); x.fillStyle = rg; x.fillRect(ox, oy, 256, 256); }
        x.fillStyle = 'rgba(0,0,0,0.25)'; x.fillRect(ox, oy, 256, 10); });
      const t = tex(done(THREE, c, false)); t.anisotropy = 4; return B({ map: t }); })();
    function quadSub(mat, a, b, c, d, u0, v0, u1, v1) { const Bt = batchOf(mat); let nx = (b[1] - a[1]) * (d[2] - a[2]) - (b[2] - a[2]) * (d[1] - a[1]), ny = (b[2] - a[2]) * (d[0] - a[0]) - (b[0] - a[0]) * (d[2] - a[2]), nz = (b[0] - a[0]) * (d[1] - a[1]) - (b[1] - a[1]) * (d[0] - a[0]);
      const nl = Math.hypot(nx, ny, nz) || 1, P = [a, b, c, a, c, d], U = [[u0, v0], [u1, v0], [u1, v1], [u0, v0], [u1, v1], [u0, v1]];
      for (let i = 0; i < 6; i++) { Bt.p.push(P[i][0], P[i][1], P[i][2]); Bt.n.push(nx / nl, ny / nl, nz / nl); Bt.u.push(U[i][0], U[i][1]); } }
    const roomRng = rng(28526);
    function homeWin(axis, face, n, a0, a1, sill, head, kind = -1) {
      const w = a1 - a0, h = head - sill, fr = 0.05, am = (a0 + a1) / 2, k = kind >= 0 ? kind : Math.floor(roomRng() * 4);
      const u0 = (k % 2) * 0.5, v1 = 1 - ((k / 2) | 0) * 0.5, v0 = v1 - 0.5;
      /* a point at `a` along the wall, height y, `d` outward from the face */
      const P = (a, y, d) => axis === 'x' ? [a, y, face + n * d] : [face + n * d, y, a];
      const bx = (a, y, d, la, ly, ld, mat) => { const c = P(a, y, d); if (axis === 'x') box(mat, c[0], c[1], c[2], la, ly, ld); else box(mat, c[0], c[1], c[2], ld, ly, la); };
      bx(am, sill + fr / 2, -0.06, w, fr, 0.07, mAlu); bx(am, head - fr / 2, -0.06, w, fr, 0.07, mAlu);
      bx(a0 + fr / 2, (sill + head) / 2, -0.06, fr, h, 0.07, mAlu); bx(a1 - fr / 2, (sill + head) / 2, -0.06, fr, h, 0.07, mAlu);
      bx(am, (sill + head) / 2, -0.06, 0.04, h, 0.06, mAlu);
      bx(am, sill - 0.035, 0.04, w + 0.14, 0.07, 0.14, mBand);                                  // the ledge under it
      /* (the order of the corners makes each quad face out: a from the far end along the wall to b) */
      const flip = (axis === 'x') === (n < 0);
      const [aa, ab] = flip ? [a1, a0] : [a0, a1];
      glass.push({ mat: mGlass, a: P(aa, sill, -0.07), b: P(ab, sill, -0.07), c: P(ab, head, -0.07), d: P(aa, head, -0.07) });
      quadSub(ROOMS, P(aa, sill - 0.05, -0.32), P(ab, sill - 0.05, -0.32), P(ab, head + 0.05, -0.32), P(aa, head + 0.05, -0.32), u0, v0, u0 + 0.5, v1);
    }
    const mPipe = M({ color: 0xbdb8ac, roughness: 0.6 });
    /* a downpipe from the ground to the roof, its brackets at every storey */
    function downpipe(x, z, top) { bar(mPipe, [x, 0, z], [x, top, z], 0.045, 8); for (let y = 0.4; y < top; y += STOREY) box(mPipe, x, y + 1.6, z, 0.12, 0.05, 0.12); }

    /* ================================================================ THE WALKWAY (the plan's 4.1 and 8.1)
       An open walkway along the block's face, 1.9 m wide, covered by the storey above's slab (its soffit 2.75 m), open
       on its outer side over the estate behind a balustrade (w5rail, 2 m sections stretched to fit each run), its lights
       on the soffit every 4 m (w5walklight); along its inner side the other homes' walls and gates. It begins at the lift's
       doors in its end wall, runs 15.2 m along -z, turns to -x and runs 9.5 m to his gate. A drain's grating at its outer
       edge 8.7 m from the lift, where water has stood (the decoy of 4.1). */
    function buildWalkway() {
      const W = WALK, s = W.soffit;
      /* the floor of both runs, to the slab's outer edge (the balustrade stands on it) */
      floor(mWalkFloor, W.x0, W.z0 + 0.0, W.edge, W.z1);
      floor(mWalkFloor, W.endX, W.z0, W.x0, W.turnZ);
      /* the soffit (the storey above's walkway) and the slab's edge outside the balustrade; and the slab's underside seen
         from the estate below */
      const ceilQ = (x0, z0, x1, z1, y) => quad(mSoffit, [x0, y, z0], [x1, y, z0], [x1, y, z1], [x0, y, z1]);
      ceilQ(W.x0, W.z0, W.edge, W.z1, s); ceilQ(W.endX, W.z0, W.x0, W.turnZ, s);
      box(mFace, W.edge + 0.06, s + 0.1, (W.z0 + W.z1) / 2 - 0.03, 0.12, 0.4, W.z1 - W.z0 + 0.06);           // the slab's edge above, run 1
      box(mFace, (W.endX + W.edge) / 2 + 0.03, s + 0.1, W.z0 - 0.06, W.edge - W.endX + 0.06, 0.4, 0.12);       // and run 2
      box(mBand, W.edge + 0.06, -0.15, (W.z0 + W.z1) / 2 - 0.03, 0.12, 0.3, W.z1 - W.z0 + 0.06);              // this storey's slab edge below
      box(mBand, (W.endX + W.edge) / 2 + 0.03, -0.15, W.z0 - 0.06, W.edge - W.endX + 0.06, 0.3, 0.12);
      /* the walkway's own collision: the balustrade's line and the walkway's ends */
      solidXZ(W.edge - 0.20, W.z0 - 0.3, W.edge + 0.3, W.z1 + 0.2);
      solidXZ(W.endX - 0.3, W.z0 - 0.3, W.edge + 0.3, W.z0 + 0.10);
      /* THE INNER SIDE of run 1 (x -0.95): the neighbours' homes, a wall of the block's paint with one other home's gate
         and its court's low wall (the condominium's pattern: every home behind its own court) */
      wallZ(mFace, W.x0 - 0.1, 0.2, W.turnZ, W.z1, [{ z0: -6.6, z1: -5.35, y0: 0, y1: 1.4 }], 0, s);
      /* (a neighbour's gate, shut: painted iron bars in its opening; its court is not walked) */
      for (let z = -6.55; z < -5.4; z += 0.12) bar(mBand, [W.x0 - 0.1, 0.02, z], [W.x0 - 0.1, 1.38, z], 0.009, 5);
      for (const y of [0.1, 0.7, 1.35]) bar(mBand, [W.x0 - 0.1, y, -6.6], [W.x0 - 0.1, y, -5.35], 0.012, 5);
      solidXZ(W.x0 - 0.2, -6.6, W.x0, -5.35);
      /* (behind it, its court: a strip of its paving and its far wall in shade, so the bars stand against a place) */
      floor(mPave, W.x0 - 2.4, -6.6, W.x0 - 0.2, -5.35, -0.002);
      wallZ(M({ color: 0x9a9284, roughness: 0.95 }), W.x0 - 2.4, 0.1, -6.7, -5.25, [], 0, 2.6, false);
      wallX(mCourtWall, -6.65, 0.1, W.x0 - 2.4, W.x0 - 0.2, [], 0, 2.6, false); wallX(mCourtWall, -5.3, 0.1, W.x0 - 2.4, W.x0 - 0.2, [], 0, 2.6, false);
      /* THE INNER SIDE of run 2 (z -14.0): the corner's wall, the neighbours' court wall, his gate between its posts, his
         court's low front wall, and the end wall */
      wallX(mFace, W.turnZ + 0.1, 0.2, COURT.x1 + 0.1, W.x0 - 0.2, [{ x0: -3.8, x1: -2.55, y0: 0, y1: 1.4 }], 0, s);   // (x0 < x1: the walk test found it missing)
      /* (a second neighbour's gate in it, shut: its bars, and its court's strip behind) */
      for (let x = -3.75; x < -2.6; x += 0.12) bar(mBand, [x, 0.02, W.turnZ + 0.1], [x, 1.38, W.turnZ + 0.1], 0.009, 5);
      for (const y of [0.1, 0.7, 1.35]) bar(mBand, [-3.8, y, W.turnZ + 0.1], [-2.55, y, W.turnZ + 0.1], 0.012, 5);
      solidXZ(-3.8, W.turnZ, -2.55, W.turnZ + 0.2);
      floor(mPave, -3.8, W.turnZ + 0.2, -2.55, W.turnZ + 2.4, -0.002);
      wallX(M({ color: 0x9a9284, roughness: 0.95 }), W.turnZ + 2.4, 0.1, -3.9, -2.45, [], 0, 2.6, false);
      wallZ(mCourtWall, -3.85, 0.1, W.turnZ + 0.2, W.turnZ + 2.4, [], 0, 2.6, false); wallZ(mCourtWall, -2.5, 0.1, W.turnZ + 0.2, W.turnZ + 2.4, [], 0, 2.6, false);
      wallX(mFace, W.turnZ + 0.1, 0.2, W.endX - 0.2, COURT.x0 - 0.1, [], 0, s);
      const gp = GATE.w / 2 + GATE.post / 2 + 0.005;
      const gl = GATE.x - gp - GATE.post / 2, gr = GATE.x + gp + GATE.post / 2;
      wallX(mCourtWall, W.turnZ + 0.1, 0.2, COURT.x0 - 0.1, gl, [], 0, GATE.frontH);
      wallX(mCourtWall, W.turnZ + 0.1, 0.2, gr, COURT.x1 + 0.1, [], 0, GATE.frontH);
      box(mBand, (COURT.x0 + gl) / 2 - 0.05, GATE.frontH + 0.03, W.turnZ + 0.1, gl - COURT.x0 + 0.1, 0.06, 0.26);      // the copings
      box(mBand, (gr + COURT.x1) / 2 + 0.05, GATE.frontH + 0.03, W.turnZ + 0.1, COURT.x1 - gr + 0.1, 0.06, 0.26);
      /* above his court's low wall the walkway is open to the court: the storey above's slab ends at the court's line */
      wallZ(mFace, W.endX - 0.1, 0.2, W.z0, W.turnZ + 0.2, [], 0, s);                                          // the walkway's west end
      /* the end wall at the lift (z 1.2): the lift's doors in it (LIFT.door each side of the middle) */
      wallX(mFace, W.z1 + 0.075, 0.15, W.x0 - 0.2, W.edge + 0.12, [{ x0: -LIFT.door, x1: LIFT.door, y0: 0, y1: 2.1 }], 0, s);
      solidXZ(-LIFT.door, W.z1, LIFT.door, W.z1 + 0.15);                                                         // the doors, shut in play
      /* the lift's hall: its call button and the storey's number over the doors (painted, as a builder's plate is) */
      const plate = (() => { const [c, x] = canvas(256, 128); x.fillStyle = '#9aa0a5'; x.fillRect(0, 0, 256, 128);
        x.fillStyle = '#1e2024'; x.fillRect(84, 14, 88, 100); x.fillStyle = '#d65b2c'; x.font = 'bold 80px Arial, Helvetica, sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('3', 128, 66);
        return B({ map: tex(done(THREE, c, false)) }); })();
      quadUV(plate, [0.25, 2.18, W.z1 - 0.002], [-0.25, 2.18, W.z1 - 0.002], [-0.25, 2.43, W.z1 - 0.002], [0.25, 2.43, W.z1 - 0.002]);
      box(mSteel, 0.66, 1.15, W.z1 - 0.01, 0.09, 0.16, 0.02);
      box(B({ color: 0xffe9b0 }), 0.66, 1.17, W.z1 - 0.022, 0.03, 0.03, 0.006);
      /* the storeys below, seen over the balustrade: each a band of parapet and the slab's edge */
      for (let st = 1; st <= 2; st++) { const y = -st * STOREY;
        box(mFace, W.edge + 0.06, y + 0.5, (W.z0 + W.z1) / 2, 0.15, 1.3, W.z1 - W.z0);
        box(mFace, (W.endX + W.edge) / 2, y + 0.5, W.z0 - 0.06, W.edge - W.endX, 1.3, 0.15);
        box(mBand, W.edge + 0.07, y - 0.15, (W.z0 + W.z1) / 2, 0.13, 0.3, W.z1 - W.z0);
        box(mBand, (W.endX + W.edge) / 2, y - 0.15, W.z0 - 0.07, W.edge - W.endX, 0.3, 0.13); }
      /* and the storeys above: their parapets over the slab's edge, to the roof (a six-storey block) */
      for (let st = 1; st <= 3; st++) { const y = st * STOREY;
        box(mFace, W.edge + 0.06, y + 0.5, (W.z0 + W.z1) / 2, 0.15, 1.1, W.z1 - W.z0);
        box(mFace, (W.endX + W.edge) / 2, y + 0.5, W.z0 - 0.06, W.edge - W.endX, 1.1, 0.15);
        box(mBand, W.edge + 0.07, y + 1.1, (W.z0 + W.z1) / 2, 0.16, 0.06, W.z1 - W.z0);
        box(mBand, (W.endX + W.edge) / 2, y + 1.1, W.z0 - 0.07, W.edge - W.endX, 0.06, 0.16);
        if (st < 3) { box(mFace, W.edge + 0.06, y + STOREY - 0.1, (W.z0 + W.z1) / 2, 0.12, 0.4, W.z1 - W.z0);
          box(mFace, (W.endX + W.edge) / 2, y + STOREY - 0.1, W.z0 - 0.06, W.edge - W.endX, 0.4, 0.12); } }
      /* THE WALKWAYS ABOVE, as built: each storey's slab over both runs (its underside the soffit of the walkway below
         it), and where the walkway passes his court a balustrade on the court's side too (it runs there as a bridge
         between the court and the outside); the homes' walls along their inner side. From his court, between the
         storeys, the eye meets railings, slabs and soffits, and past them the estate */
      const mSlabTop = M({ color: 0xa69e90, roughness: 0.8 });
      for (let st = 1; st <= 3; st++) { const y = st * STOREY;
        box(mSoffit, (W.x0 - 0.2 + W.edge + 0.12) / 2, y - 0.095, (W.z0 + W.z1) / 2 - 0.06, W.edge + 0.32 - W.x0, 0.19, W.z1 - W.z0 + 0.12, 0, mSlabTop, st === 1);
        box(mSoffit, (W.endX + W.x0 - 0.2) / 2, y - 0.095, (W.z0 + W.turnZ) / 2 - 0.06, W.x0 - 0.2 - W.endX, 0.19, W.turnZ - W.z0 + 0.12, 0, mSlabTop, st === 1);
        if (st < 3) {
          wallZ(mFace, W.x0 - 0.1, 0.2, W.turnZ, W.z1, [], y, y + STOREY - 0.2, false);
          wallX(mFace, W.turnZ + 0.1, 0.2, COURT.x1 + 0.1, W.x0 - 0.2, [], y, y + STOREY - 0.2, false);
          wallX(mFace, W.turnZ + 0.1, 0.2, W.endX - 0.2, COURT.x0 - 0.1, [], y, y + STOREY - 0.2, false);
          box(mBand, (COURT.x0 + COURT.x1) / 2, y + STOREY - 0.32, W.turnZ - 0.06, COURT.x1 - COURT.x0, 0.24, 0.12);   // the slab's edge over the court
        } }
      { const R2 = [], n = 3, L = (COURT.x1 - COURT.x0) / n;
        for (let st = 1; st <= 2; st++) for (let i = 0; i < n; i++) R2.push({ x: COURT.x0 + (i + 0.5) * L, y: st * STOREY, z: W.turnZ - 0.09, ry: 0, sx: L / 2.0 });
        manyX('w5rail', R2, 3); }
    }

    /* ================================================================ HIS COURT AND HIS HOUSE (the plan's 4.2, 4.3, 8.1) */
    function buildCourt() {
      const C = COURT, H = HOUSE;
      /* the paving, and its path from the gate to the door (300 mm pavers, a shade darker) */
      floor(mPave, C.x0, C.z0, C.x1, C.z1);
      floor(mPath, GATE.x - 0.6, C.z0 + 0.05, GATE.x + 0.6, C.z1 - 0.05, 0.004);
      /* THE COURT'S SIDE WALLS, his (west: his bedroom wing) and his neighbour's (east), to the block's roof (the court is
         open to the sky): the block's paint over a tiled dado, a slab band at every storey, and the homes' windows that
         look into the court (his bedroom's at the ground storey behind its grille; two a storey above) */
      const SW = [{ z0: -12.4, z1: -11.2 }, { z0: -8.8, z1: -7.6 }];
      /* (storey by storey: wallZ takes openings in order along the wall, and the ground window and an upper one overlap
         in z: built as one, the upper one's cut drew a wall over the ground window. The ground storey is solid) */
      for (let st = 0; st <= 2; st++) { const y = st * STOREY, y1 = st === 2 ? C.wallTop : y + STOREY;
        const up = st ? SW.map(q => ({ z0: q.z0, z1: q.z1, y0: y + 0.9, y1: y + 2.1 })) : [];
        wallZ(mCourtWall, C.x0 - 0.1, 0.2, C.z0, H.face, st ? up : [{ z0: -9.1, z1: -7.7, y0: 1.0, y1: 2.15 }], y, y1, st === 0);
        wallZ(mCourtWall, C.x1 + 0.1, 0.2, C.z0, H.face, up, y, y1, st === 0); }
      homeWin('z', C.x0, 1, -9.1, -7.7, 1.0, 2.15, 0);
      for (let gz = -9.06; gz < -7.72; gz += 0.11) bar(M({ color: 0xe6e6e0, roughness: 0.5 }), [C.x0 + 0.05, 1.0, gz], [C.x0 + 0.05, 2.15, gz], 0.008, 5);
      for (let st = 1; st <= 2; st++) for (const q of SW) { homeWin('z', C.x0, 1, q.z0, q.z1, st * STOREY + 0.9, st * STOREY + 2.1); homeWin('z', C.x1, -1, q.z0, q.z1, st * STOREY + 0.9, st * STOREY + 2.1); }
      for (let st = 1; st <= 2; st++) { const y = st * STOREY;
        box(mBand, C.x0 + 0.03, y - 0.02, (C.z0 + H.face) / 2, 0.06, 0.22, H.face - C.z0 - 0.05);
        box(mBand, C.x1 - 0.03, y - 0.02, (C.z0 + H.face) / 2, 0.06, 0.22, H.face - C.z0 - 0.05); }
      /* THE STOREYS OVER HIS HOME: the block's face over his front wall, to the roof, built as it stands: two windows a
         storey, each with its frame, glass and ledge and a home behind it, the air-conditioner's ledge between them behind
         its louvred screen, the slab band at each floor, the downpipes at the court's corners, the roof's parapet */
      const FZ = H.face - 0.2;
      const UW = [{ x0: -10.45, x1: -9.25 }, { x0: -7.75, x1: -6.55 }];
      for (let st = 1; st <= 2; st++) { const y = st * STOREY;
        wallX(mCourtWall, H.face - 0.1, 0.2, C.x0, C.x1, UW.map(q => ({ x0: q.x0, x1: q.x1, y0: y + 0.9, y1: y + 2.1 })), y, y + STOREY, false);
        for (const q of UW) homeWin('x', FZ, -1, q.x0, q.x1, y + 0.9, y + 2.1);
        box(mBand, (C.x0 + C.x1) / 2, y - 0.02, FZ - 0.03, C.x1 - C.x0, 0.22, 0.06);
        /* the air-conditioner's ledge: a concrete shelf, its two cheeks and its screen of aluminium louvres */
        const ax = (UW[0].x1 + UW[1].x0) / 2;
        box(mFace, ax, y + 0.32, FZ - 0.3, 0.92, 0.08, 0.6, 0, mFace, false);
        for (const sx of [-0.45, 0.45]) box(mFace, ax + sx, y + 0.8, FZ - 0.3, 0.04, 0.96, 0.6);
        for (let k = 0; k < 8; k++) box(mAlu, ax, y + 0.44 + k * 0.105, FZ - 0.58, 0.88, 0.022, 0.07); }
      downpipe(C.x0 + 0.12, FZ - 0.07, C.wallTop); downpipe(C.x1 - 0.12, FZ - 0.07, C.wallTop);
      /* the roof's parapet over his home's face */
      box(mFace, (C.x0 + C.x1) / 2, C.wallTop + 0.45, FZ + 0.05, C.x1 - C.x0, 0.9, 0.2);
      /* THE DADO: 150 mm ceramic tiles to 0.8 m round the court (its walls, his front wall either side of the door, the
         low front wall's inside), over the plinth, 4 mm proud */
      const mDado = M({ map: pic(tiles(256, 4, [176, 168, 152], '#7c7468', 28527, 0.06, 60), 0.6, 0.6), roughness: 0.35 });
      const dy0 = 0.15, dy1 = 0.8;
      quad(mDado, [C.x0 + 0.004, dy0, H.face], [C.x0 + 0.004, dy0, C.z0 + 0.2], [C.x0 + 0.004, dy1, C.z0 + 0.2], [C.x0 + 0.004, dy1, H.face], 0, dy0);
      quad(mDado, [C.x1 - 0.004, dy0, C.z0 + 0.2], [C.x1 - 0.004, dy0, H.face], [C.x1 - 0.004, dy1, H.face], [C.x1 - 0.004, dy1, C.z0 + 0.2], 0, dy0);
      quad(mDado, [DOOR_FRONT.x0 - 0.06, dy0, FZ - 0.004], [C.x0, dy0, FZ - 0.004], [C.x0, dy1, FZ - 0.004], [DOOR_FRONT.x0 - 0.06, dy1, FZ - 0.004], 0, dy0);
      quad(mDado, [C.x1, dy0, FZ - 0.004], [DOOR_FRONT.x1 + 0.06, dy0, FZ - 0.004], [DOOR_FRONT.x1 + 0.06, dy1, FZ - 0.004], [C.x1, dy1, FZ - 0.004], 0, dy0);
      quad(mDado, [C.x0, dy0, C.z0 + 0.204], [GATE.x - 0.84 - 0.21, dy0, C.z0 + 0.204], [GATE.x - 0.84 - 0.21, dy1, C.z0 + 0.204], [C.x0, dy1, C.z0 + 0.204], 0, dy0);
      quad(mDado, [GATE.x + 0.84 + 0.21, dy0, C.z0 + 0.204], [C.x1, dy0, C.z0 + 0.204], [C.x1, dy1, C.z0 + 0.204], [GATE.x + 0.84 + 0.21, dy1, C.z0 + 0.204], 0, dy0);
      /* the roof's coping round the court's top, against the sky */
      box(mBand, C.x0 - 0.1, C.wallTop + 0.1, (C.z0 + H.face) / 2, 0.3, 0.2, H.face - C.z0);
      box(mBand, C.x1 + 0.1, C.wallTop + 0.1, (C.z0 + H.face) / 2, 0.3, 0.2, H.face - C.z0);
      box(mBand, (C.x0 + C.x1) / 2, C.wallTop + 0.1, H.face - 0.1, C.x1 - C.x0 + 0.4, 0.2, 0.3);
      /* HIS FRONT WALL (z -5.6): the door in the middle, a window either side, curtains drawn behind both */
      wallX(mCourtWall, H.face - 0.1, 0.2, LIVING.x0 - 0.1, LIVING.x1 + 0.1, [
        { x0: WIN_A.x0, x1: WIN_A.x1, y0: WIN_A.sill, y1: WIN_A.head },
        { x0: DOOR_FRONT.x0, x1: DOOR_FRONT.x1, y0: 0, y1: DOOR_FRONT.h },
        { x0: WIN_B.x0, x1: WIN_B.x1, y0: WIN_B.sill, y1: WIN_B.head }], 0, STOREY);
      windowX(WIN_A, H.face - 0.1, 0.2); windowX(WIN_B, H.face - 0.1, 0.2);
      /* the lamps' light through the drawn curtains: a soft warm glow between the glass and the cloth (seen from the court
         it is the cloth lit from behind; from the room it is behind the cloth and hidden) */
      { const [c, x] = canvas(128, 128); const g = x.createRadialGradient(64, 48, 4, 64, 64, 80); g.addColorStop(0, 'rgba(255,226,170,0.9)'); g.addColorStop(0.6, 'rgba(255,206,140,0.35)'); g.addColorStop(1, 'rgba(255,200,130,0.05)');
        x.fillStyle = g; x.fillRect(0, 0, 128, 128);
        const mBack = new THREE.MeshBasicMaterial({ map: tex(done(THREE, c, false)), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.45 }); mats.push(mBack);
        for (const Wn of [WIN_A, WIN_B]) quadUV(mBack, [Wn.x1, Wn.sill, H.face + 0.02], [Wn.x0, Wn.sill, H.face + 0.02], [Wn.x0, Wn.head, H.face + 0.02], [Wn.x1, Wn.head, H.face + 0.02]); }
      /* the walls' feet: a grey plinth 15 cm high round the court (a builder's waterproof band), standing 1 cm proud */
      box(mBand, C.x0 + 0.005, 0.075, (C.z0 + H.face) / 2, 0.03, 0.15, H.face - C.z0 - 0.2);
      box(mBand, C.x1 - 0.005, 0.075, (C.z0 + H.face) / 2, 0.03, 0.15, H.face - C.z0 - 0.2);
      box(mBand, (C.x0 + DOOR_FRONT.x0) / 2, 0.075, H.face - 0.205, DOOR_FRONT.x0 - C.x0, 0.15, 0.03);
      box(mBand, (DOOR_FRONT.x1 + C.x1) / 2, 0.075, H.face - 0.205, C.x1 - DOOR_FRONT.x1, 0.15, 0.03);
      box(mBand, (C.x0 + C.x1) / 2, 0.075, C.z0 + 0.205, C.x1 - C.x0, 0.15, 0.03);
      /* on his neighbour's wall (the east) at the ground storey, a high louvred vent (painted: seen across the court) */
      const vent = (() => { const [c, x] = canvas(128, 64); x.fillStyle = '#9e978a'; x.fillRect(0, 0, 128, 64);
        for (let j = 0; j < 7; j++) { x.fillStyle = '#3a3630'; x.fillRect(6, 6 + j * 8, 116, 4); x.fillStyle = '#c9c2b2'; x.fillRect(6, 10 + j * 8, 116, 2); }
        return B({ map: tex(done(THREE, c, false)) }); })();
      quadUV(vent, [C.x1 - 0.012, 2.2, -10.4], [C.x1 - 0.012, 2.2, -9.4], [C.x1 - 0.012, 2.7, -9.4], [C.x1 - 0.012, 2.7, -10.4]);
      /* the door's frame: its jambs and head in dark timber, 7 cm wide on the court's face, covering the leaf's edges
         (the leaf's hinge edge came back ragged: the frame covers it, RECORD.md 8) */
      const mJamb = M({ color: 0x3a2618, roughness: 0.6 });
      box(mJamb, DOOR_FRONT.x0 + 0.02, DOOR_FRONT.h / 2, H.face - 0.215, 0.11, DOOR_FRONT.h, 0.035);
      box(mJamb, DOOR_FRONT.x1 - 0.02, DOOR_FRONT.h / 2, H.face - 0.215, 0.11, DOOR_FRONT.h, 0.035);
      box(mJamb, (DOOR_FRONT.x0 + DOOR_FRONT.x1) / 2, DOOR_FRONT.h + 0.03, H.face - 0.215, DOOR_FRONT.x1 - DOOR_FRONT.x0 + 0.14, 0.09, 0.035);
      box(mJamb, (DOOR_FRONT.x0 + DOOR_FRONT.x1) / 2, 0.012, H.face - 0.1, DOOR_FRONT.x1 - DOOR_FRONT.x0, 0.024, 0.22);   // the threshold
      /* the step of the house's floor over the court's is none: one level (the walk test floods it whole) */
    }

    function buildHouse() {
      const H = HOUSE, L = LIVING, D = DINING, t = H.wall, h = H.ceil;
      floor(mFloorIn, L.x0, L.z0, L.x1, L.z1); floor(mFloorIn, D.x0, D.z0, D.x1, D.z1);
      floor(mFloorIn, DOOR_FRONT.x0, H.face - 0.2, DOOR_FRONT.x1, L.z0, 0.001);
      const ceilQ = (x0, z0, x1, z1) => quad(mCeil, [x0, h, z0], [x1, h, z0], [x1, h, z1], [x0, h, z1]);
      ceilQ(L.x0, L.z0 - 0.1, L.x1, L.z1); ceilQ(D.x0, D.z0, D.x1, D.z1);
      /* the front wall's inside face (its paint) round the openings */
      const zi = L.z0 + 0.002, skin = (x0, x1, y0, y1) => quad(mWallIn, [x0, y0, zi], [x1, y0, zi], [x1, y1, zi], [x0, y1, zi], x0, y0);
      skin(L.x0, WIN_A.x0, 0, h); skin(WIN_A.x1, DOOR_FRONT.x0, 0, h); skin(DOOR_FRONT.x1, WIN_B.x0, 0, h); skin(WIN_B.x1, L.x1, 0, h);
      skin(WIN_A.x0, WIN_A.x1, 0, WIN_A.sill); skin(WIN_A.x0, WIN_A.x1, WIN_A.head, h); skin(WIN_B.x0, WIN_B.x1, 0, WIN_B.sill); skin(WIN_B.x0, WIN_B.x1, WIN_B.head, h);
      skin(DOOR_FRONT.x0, DOOR_FRONT.x1, DOOR_FRONT.h, h);
      /* the living room's east wall (x -5.1), its north wall (z -1.6) with the bedrooms' door (shut), the dining room's
         east wall (x -8.5) with the kitchen's door (shut), its north wall (z 1.6), and the west wall (x -12.3) with the
         terrace doors in the living room's part and a window in the dining room's */
      wallZ(mWallIn, L.x1 + t / 2, t, L.z0 - 0.1, L.z1 + t / 2, [], 0, h);
      wallX(mWallIn, L.z1 + t / 2, t, D.x1 - t / 2, L.x1 + t, [{ x0: -6.15, x1: -5.35, y0: 0, y1: 2.1 }], 0, h);
      wallZ(mWallIn, D.x1 + t / 2, t, L.z1, D.z1 + t, [{ z0: 0.25, z1: 1.05, y0: 0, y1: 2.1 }], 0, h);
      wallX(mWallIn, D.z1 + t / 2, t, D.x0 - t, D.x1 + t, [], 0, h);
      const WIN_D = { z0: -0.75, z1: 0.75, sill: 0.9, head: 2.1 };
      wallZ(mWallIn, L.x0 - t / 2, t, L.z0 - 0.1, D.z1 + t, [
        { z0: TERRACE.z0, z1: TERRACE.z1, y0: 0, y1: TERRACE.h },
        { z0: WIN_D.z0, z1: WIN_D.z1, y0: WIN_D.sill, y1: WIN_D.head }], 0, h);
      windowZ(WIN_D, L.x0 - t / 2, t);
      /* the shut doors: a veneer leaf in each opening (painted; nobody opens them), and what stops him there */
      box(mVeneer, -5.75, 1.05, L.z1 + 0.005, 0.8, 2.1, 0.04); solidXZ(-6.15, L.z1 - 0.05, -5.35, L.z1 + 0.1);
      box(mVeneer, D.x1 + 0.005, 1.05, 0.65, 0.04, 2.1, 0.8); solidXZ(D.x1 - 0.05, 0.25, D.x1 + 0.1, 1.05);
      /* THE TERRACE DOORS: two sliding glass leaves in aluminium; the terrace beyond (1.5 m, its parapet), never walked */
      { const xc = L.x0 - t / 2, z0 = TERRACE.z0, z1 = TERRACE.z1, hh = TERRACE.h;
        box(mAlu, xc, hh - 0.02, (z0 + z1) / 2, t * 0.7, 0.04, z1 - z0); box(mAlu, xc, 0.02, (z0 + z1) / 2, t * 0.7, 0.04, z1 - z0);
        box(mAlu, xc, hh / 2, z0 + 0.02, t * 0.7, hh, 0.04); box(mAlu, xc, hh / 2, z1 - 0.02, t * 0.7, hh, 0.04); box(mAlu, xc, hh / 2, (z0 + z1) / 2, t * 0.7, hh, 0.05);
        glass.push({ mat: mGlass, a: [xc, 0.04, z1], b: [xc, 0.04, z0], c: [xc, hh - 0.04, z0], d: [xc, hh - 0.04, z1] });
        solidXZ(xc - 0.1, z0, xc + 0.06, z1);
        floor(mWalkFloor, TERRACE.out, z0 - 0.6, xc - t / 2, z1 + 0.6, -0.02);
        box(mFace, TERRACE.out - 0.08, 0.5, (z0 + z1) / 2, 0.15, 1.0, z1 - z0 + 1.2);
        box(mFace, (TERRACE.out + xc) / 2, 0.5, z0 - 0.6, xc - TERRACE.out, 1.0, 0.15);
        box(mFace, (TERRACE.out + xc) / 2, 0.5, z1 + 0.6, xc - TERRACE.out, 1.0, 0.15);
        quad(mSoffit, [TERRACE.out, h + 0.05, z1 + 0.6], [xc, h + 0.05, z1 + 0.6], [xc, h + 0.05, z0 - 0.6], [TERRACE.out, h + 0.05, z0 - 0.6]); }
      /* the skirting (100 mm of dark timber) round the rooms' walls */
      const sk = (a, b) => wall(mSkirt, a[0], a[1], b[0], b[1], 0, 0.1);
      sk([L.x1 - 0.006, L.z0], [L.x1 - 0.006, L.z1 - 0.006]); sk([L.x1 - 0.006, L.z1 - 0.006], [-5.35, L.z1 - 0.006]);
      sk([-6.15, L.z1 - 0.006], [D.x1 + 0.006, L.z1 - 0.006]);
      /* the house's outer faces seen from the estate past the terrace (its west end): the block's paint, to the roof */
      box(mFace, TERRACE.out - 0.08, h + 0.3 + (STOREY * 3 - h) / 2, (TERRACE.z0 + TERRACE.z1) / 2, 0.15, STOREY * 3 - h, TERRACE.z1 - TERRACE.z0 + 1.2);   // the terrace above's parapets, to the roof
      box(mBand, (TERRACE.out + L.x0) / 2, h + 0.15, (TERRACE.z0 + TERRACE.z1) / 2, L.x0 - TERRACE.out + 0.2, 0.3, TERRACE.z1 - TERRACE.z0 + 1.2);
    }

    /* ================================================================ THE ESTATE ROUND THE BLOCK (seen past the
       balustrade and from the terrace): its ground 5.9 m below, its lawn, its pool, its paths, the other blocks of the
       same condominium round it (six storeys, the same paint, every home's windows its own: lit warm, cool, or dark at
       dusk), and the city's haze. Painted light only (v9.4). Seeded (v6.15): the same estate every run. */
    function buildEstate() {
      const G = GROUND_Y;
      const mGrass = B({ fog: true, map: (() => { const [c, x] = canvas(256, 256), r = rng(28530);
        x.fillStyle = '#3d4a28'; x.fillRect(0, 0, 256, 256);
        for (let s = 0; s < 4000; s++) { x.fillStyle = `rgba(${50 + r() * 40},${70 + r() * 40},${28 + r() * 20},0.5)`; x.fillRect(r() * 256, r() * 256, 2, 2); }
        return pic(c, 5, 5); })() });
      const mDeck = B({ color: 0x8e8574, fog: true });
      const mPool = B({ fog: true, map: (() => { const [c, x] = canvas(256, 256), r = rng(28531);
        const g = x.createLinearGradient(0, 0, 256, 256); g.addColorStop(0, '#3f7f98'); g.addColorStop(1, '#2d6a86'); x.fillStyle = g; x.fillRect(0, 0, 256, 256);
        for (let s = 0; s < 60; s++) { x.strokeStyle = `rgba(230,240,255,${0.05 + r() * 0.08})`; x.beginPath(); const yy = r() * 256; x.moveTo(0, yy); x.bezierCurveTo(80, yy + 8, 170, yy - 8, 256, yy + 4); x.stroke(); }
        return pic(c, 6, 6); })() });
      floor(mGrass, -90, -80, 80, 40, G);
      floor(mDeck, 4, -40, 28, -18, G + 0.02); floor(mPool, 7, -37, 25, -24, G + 0.04);
      floor(mDeck, -40, -26, 4, -21, G + 0.02); floor(mDeck, 4, -18, 8, 20, G + 0.02);
      /* the block itself, seen from below and beyond: its body under the walkway down to the ground, its void deck */
      box(mFace, -6, (G - 0.35) / 2, -6, 10, -G - 0.35, 16);
      /* the other blocks: a six-storey slab of homes, each storey's band and its windows, from an atlas of households */
      const NW = 8, atlas = (() => { const [c, x] = canvas(1024, 1024), r = rng(28532), cw = 1024 / 4, ch = 1024 / 4;
        x.fillStyle = '#e2dccd'; x.fillRect(0, 0, 1024, 1024);
        for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) { const ox = i * cw, oy = j * ch;
          x.fillStyle = '#8f8a82'; x.fillRect(ox, oy + ch - 26, cw, 26);                                         // the slab's band
          x.fillStyle = '#cfc8b8'; x.fillRect(ox, oy + ch - 70, cw, 44);                                         // the balcony's parapet
          for (const wx of [0.12, 0.56]) { const lit = r(), col = lit < 0.35 ? '#f0c27a' : lit < 0.5 ? '#c9d8ec' : lit < 0.58 ? '#7f97d6' : '#2a2e36';
            x.fillStyle = '#5f5a52'; x.fillRect(ox + wx * cw - 3, oy + 34, cw * 0.32 + 6, ch * 0.5 + 6);
            x.fillStyle = col; x.fillRect(ox + wx * cw, oy + 37, cw * 0.32, ch * 0.5);
            if (lit < 0.58) { x.fillStyle = 'rgba(0,0,0,0.18)'; for (let k = 0; k < 6; k++) x.fillRect(ox + wx * cw + k * cw * 0.055, oy + 37, 3, ch * 0.5); }
            x.fillStyle = '#b9bcbd'; x.fillRect(ox + wx * cw + cw * 0.155, oy + 37, 3, ch * 0.5); } }
        const t = tex(done(THREE, c, false)); t.anisotropy = 8; return B({ map: t, fog: true }); })();
      const BAYW = 7.0, mFaceD = B({ color: 0xcfc8b8, fog: true, side: THREE.DoubleSide });
      const slab = (x0, z0, x1, z1, storeys, seed) => {
        const r = rng(seed), L = Math.hypot(x1 - x0, z1 - z0), ax = (x1 - x0) / L, az = (z1 - z0) / L, nb = Math.max(1, Math.round(L / BAYW)), bw = L / nb;
        const P = (u, y, w = 0) => [x0 + ax * u + az * w, y, z0 + az * u - ax * w];
        for (let st = 0; st < storeys; st++) for (let i = 0; i < nb; i++) { const y = G + st * STOREY, k = (r() * 16) | 0, ci = k % 4, cj = (k / 4) | 0;
          const u0 = ci / 4, u1 = (ci + 1) / 4, v0 = 1 - (cj + 1) / 4, v1 = 1 - cj / 4;
          const a = P(i * bw, y), b = P((i + 1) * bw, y), c = P((i + 1) * bw, y + STOREY), d = P(i * bw, y + STOREY), Bt = batchOf(atlas);
          const PP = [a, b, c, a, c, d], U = [[u0, v0], [u1, v0], [u1, v1], [u0, v0], [u1, v1], [u0, v1]];
          for (let q = 0; q < 6; q++) { Bt.p.push(PP[q][0], PP[q][1], PP[q][2]); Bt.n.push(-az, 0, ax); Bt.u.push(U[q][0], U[q][1]); } }
        const top = G + storeys * STOREY, dp = 12;
        /* (the face's depth: each storey's balcony slab standing 0.5 m out of it, and a fin between every second pair of
           homes, ground to roof: seen across the estate a real block's ledges and shadows, not a picture of one) */
        const along = Math.abs(ax) > 0.5, bxAt = (u, y, w, la, h, ld) => { const c = P(u, y, w); box(mBand, c[0], c[1], c[2], along ? la : ld, h, along ? ld : la); };
        for (let st = 1; st < storeys; st++) bxAt(L / 2, G + st * STOREY + 0.05, -0.25, L, 0.16, 0.5);
        for (let i = 0; i <= nb; i += 2) bxAt(Math.min(L - 0.1, Math.max(0.1, i * bw)), G + (top - G) / 2, -0.25, 0.22, top - G, 0.5);
        const e0 = P(0, 0), e1 = P(L, 0), b0 = P(0, 0, dp), b1 = P(L, 0, dp);
        quad(mFaceD, [b0[0], G, b0[2]], [e0[0], G, e0[2]], [e0[0], top, e0[2]], [b0[0], top, b0[2]]);
        quad(mFaceD, [e1[0], G, e1[2]], [b1[0], G, b1[2]], [b1[0], top, b1[2]], [e1[0], top, e1[2]]);
        quad(mFaceD, [e0[0], top, e0[2]], [e1[0], top, e1[2]], [b1[0], top, b1[2]], [b0[0], top, b0[2]]);
        const c0 = P(-0.3, top - 0.1, 0.3), c1 = P(L + 0.3, top - 0.1, 0.3);
        box(mBand, (c0[0] + c1[0]) / 2, top + 0.5, (c0[2] + c1[2]) / 2, Math.abs(c1[0] - c0[0]) || 0.4, 1.2, Math.abs(c1[2] - c0[2]) || 0.4);
      };
      /* (each slab's face turned toward the walkway: P's w is out of its face) */
      slab(36, -30, 36, 22, 6, 28541);          // east, across the pool, its face to the west
      slab(-30, -52, 26, -52, 6, 28542);        // south, beyond the deck
      slab(-44, 12, -44, -40, 6, 28543);        // west, seen from the terrace
      /* the estate's trees on the lawn (chapter 4's real models of Singapore's street trees: declared, reuseInEpisode) */
      /* (each a model of ~28,000 triangles: a few where they are seen, past the balustrade and the terrace, in cells of
         24 m, each cell its own instanced mesh culled by its own sphere: the phone's budget, the plan's 13) */
      const TREES = [], PALMS = [], tr = rng(28544);
      for (const [x, z] of [[17, -11], [24, -4], [18, 9], [30, 4], [-14, -30], [-28, -24], [6, -46], [-34, 2]])
        TREES.push({ x: x + (tr() - 0.5) * 2, y: G, z: z + (tr() - 0.5) * 2, ry: tr() * 6.28, s: 0.75 + tr() * 0.25 });
      for (const [x, z] of [[5, -20], [27, -21], [5, -41], [27, -41], [-20, -22]])
        PALMS.push({ x, y: G, z, ry: tr() * 6.28, s: 0.85 + tr() * 0.2 });
      const cells = (list) => { const m = new Map(); for (const it of list) { const k = Math.floor(it.x / 24) + ',' + Math.floor(it.z / 24); if (!m.has(k)) m.set(k, []); m.get(k).push(it); } return [...m.values()]; };
      for (const c of cells(TREES)) many('w4angsana', c, world, 0.03);
      for (const c of cells(PALMS)) many('w4foxpalm', c, world, 0.03);
    }

    /* ================================================================ THE LIFT CAR (the opening film: through his eyes,
       no chapter has stood him in one). Behind the walkway's end wall: brushed steel, a grey rubber floor, a lit panel
       over, the car's panel of buttons (w5liftpanel) on its right wall, and its two doors, which slide (liftDoors) */
    const liftDoorL = new THREE.Group(), liftDoorR = new THREE.Group();
    function buildLift() {
      const Lf = LIFT;
      floor(mRubber, Lf.x0, Lf.z0 - 0.15, Lf.x1, Lf.z1);
      quad(mLit, [Lf.x0 + 0.25, Lf.h - 0.01, Lf.z0 + 0.25], [Lf.x1 - 0.25, Lf.h - 0.01, Lf.z0 + 0.25], [Lf.x1 - 0.25, Lf.h - 0.01, Lf.z1 - 0.25], [Lf.x0 + 0.25, Lf.h - 0.01, Lf.z1 - 0.25]);
      quad(mSteel, [Lf.x0, Lf.h, Lf.z0 - 0.15], [Lf.x1, Lf.h, Lf.z0 - 0.15], [Lf.x1, Lf.h, Lf.z1], [Lf.x0, Lf.h, Lf.z1]);
      wall(mSteel, Lf.x0, Lf.z1, Lf.x0, Lf.z0 - 0.15, 0, Lf.h);
      wall(mSteel, Lf.x1, Lf.z0 - 0.15, Lf.x1, Lf.z1, 0, Lf.h);
      wall(mSteel, Lf.x1, Lf.z1, Lf.x0, Lf.z1, 0, Lf.h);
      /* its handrail on the back wall */
      bar(mSteel, [Lf.x0 + 0.1, 0.92, Lf.z1 - 0.06], [Lf.x1 - 0.1, 0.92, Lf.z1 - 0.06], 0.02, 8);
      /* the doors: two steel leaves in the end wall's opening, each LIFT.door wide; liftDoors(k) slides them apart */
      for (const [g, s] of [[liftDoorL, -1], [liftDoorR, 1]]) {
        const m = new THREE.Mesh(new THREE.BoxGeometry(LIFT.door - 0.004, 2.1, 0.04), mSteel); m.position.set(s * LIFT.door / 2, 1.05, 0); g.add(m);
        g.position.set(0, 0, WALK.z1 + 0.06); world.add(g); owned.push(m.geometry); }
      stand('w5liftpanel', Lf.x1 - 0.03, 0.55, Lf.z0 + 0.35, -Math.PI / 2);
    }
    function liftDoors(k) { const s = Math.max(0, Math.min(1, k)) * (LIFT.door + 0.02); liftDoorL.position.x = -s; liftDoorR.position.x = s; }

    /* ================================================================ CASE THREE'S ROOM (the plan's 4.7 and 8.2)
       Where Grandmaster Pho receives people when he is in Singapore: a plain upstairs room, 4 m by 5 m, in daylight. A low
       table covered with a white cloth in its middle (w5clothtable, 1.2 m by 0.70 m), Grandmaster Pho's cushion behind it
       with the empty altar shelf on the wall behind him (w5altarshelf), the collector's at its west end, the student's
       across from his teacher; one window on its east wall (the afternoon in it: the street's shophouses across); a
       ceiling fan over the table (w5ceilfan); the door in its south wall, shut. */
    function buildRoom() {
      const R = ROOM, h = R.ceil, t = 0.12;
      floor(mRoomFloor, R.x0, R.z0, R.x1, R.z1);
      quad(M({ color: 0xf2f0ea, roughness: 0.95, emissive: 0x3a3a36 }), [R.x0, h, R.z0], [R.x1, h, R.z0], [R.x1, h, R.z1], [R.x0, h, R.z1]);
      const WIN = { z0: 239.0, z1: 241.0, sill: 0.95, head: 2.15 };
      wallZ(mRoomWall, R.x1 + t / 2, t, R.z0 - t, R.z1 + t, [{ z0: WIN.z0, z1: WIN.z1, y0: WIN.sill, y1: WIN.head }], 0, h);
      windowZ(WIN, R.x1 + t / 2, t, mGlassDay);
      wallZ(mRoomWall, R.x0 - t / 2, t, R.z0 - t, R.z1 + t, [], 0, h);
      wallX(mRoomWall, R.z1 + t / 2, t, R.x0 - t, R.x1 + t, [], 0, h);
      wallX(mRoomWall, R.z0 - t / 2, t, R.x0 - t, R.x1 + t, [{ x0: -1.6, x1: -0.75, y0: 0, y1: 2.1 }], 0, h);
      box(mVeneer, -1.175, 1.05, R.z0 - 0.005, 0.85, 2.1, 0.04); solidXZ(-1.6, R.z0 - 0.12, -0.75, R.z0 + 0.04);
      const sk = (a, b) => wall(mSkirt, a[0], a[1], b[0], b[1], 0, 0.08);
      sk([R.x0 + 0.006, R.z1 - 0.006], [R.x0 + 0.006, R.z0 + 0.006]); sk([R.x1 - 0.006, R.z0 + 0.006], [R.x1 - 0.006, R.z1 - 0.006]);
      sk([R.x1 - 0.006, R.z1 - 0.006], [R.x0 + 0.006, R.z1 - 0.006]);
      sk([R.x0 + 0.006, R.z0 + 0.006], [-1.6, R.z0 + 0.006]); sk([-0.75, R.z0 + 0.006], [R.x1 - 0.006, R.z0 + 0.006]);
      /* a plaster cornice round the ceiling, the door's casing, the window's inside sill, and the afternoon's light on the
         floor under the window (painted: v9.4) */
      const mCorn = M({ color: 0xf0eee8, roughness: 0.9 });
      box(mCorn, R.x0 + 0.03, h - 0.04, (R.z0 + R.z1) / 2, 0.06, 0.08, R.z1 - R.z0); box(mCorn, R.x1 - 0.03, h - 0.04, (R.z0 + R.z1) / 2, 0.06, 0.08, R.z1 - R.z0);
      box(mCorn, (R.x0 + R.x1) / 2, h - 0.04, R.z0 + 0.03, R.x1 - R.x0, 0.08, 0.06); box(mCorn, (R.x0 + R.x1) / 2, h - 0.04, R.z1 - 0.03, R.x1 - R.x0, 0.08, 0.06);
      const mCase = M({ color: 0x6a4c34, roughness: 0.6 });
      box(mCase, -1.63, 1.07, R.z0 + 0.012, 0.07, 2.14, 0.025); box(mCase, -0.72, 1.07, R.z0 + 0.012, 0.07, 2.14, 0.025); box(mCase, -1.175, 2.14, R.z0 + 0.012, 0.98, 0.07, 0.025);
      box(mCorn, R.x1 - 0.06, WIN.sill - 0.02, (WIN.z0 + WIN.z1) / 2, 0.14, 0.04, WIN.z1 - WIN.z0 + 0.1);
      { const [c, x] = canvas(256, 128); const g = x.createLinearGradient(256, 0, 0, 0); g.addColorStop(0, 'rgba(255,246,222,0.5)'); g.addColorStop(1, 'rgba(255,246,222,0)');
        x.fillStyle = g; x.beginPath(); x.moveTo(256, 18); x.lineTo(0, 0); x.lineTo(0, 128); x.lineTo(256, 110); x.closePath(); x.fill();
        const mSun = new THREE.MeshBasicMaterial({ map: tex(done(THREE, c, false)), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.55, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }); mats.push(mSun);
        quadUV(mSun, [R.x1 - 1.9, 0.003, WIN.z1 + 0.35], [R.x1 - 0.02, 0.003, WIN.z1 + 0.05], [R.x1 - 0.02, 0.003, WIN.z0 - 0.05], [R.x1 - 1.9, 0.003, WIN.z0 - 0.35]); }
      /* the afternoon in the window: a row of shophouses across the street, 14 m off, and the sky over them (geometry
         with perspective, never a painted sheet on the glass: v8.9) */
      const shop = (() => { const [c, x] = canvas(1024, 512), r = rng(28550);
        const cols = ['#e9d7a9', '#cfe0d6', '#f0c7b4', '#dfe3ea', '#e8d0e0', '#f2e6c8'];
        for (let i = 0; i < 6; i++) { const ox = i * 170.67; x.fillStyle = cols[i]; x.fillRect(ox, 0, 171, 512);
          x.fillStyle = 'rgba(0,0,0,0.12)'; x.fillRect(ox, 0, 4, 512);
          for (const wx of [0.18, 0.62]) { x.fillStyle = '#6d4b33'; x.fillRect(ox + wx * 171, 60, 44, 120); x.fillStyle = '#2b2d30'; x.fillRect(ox + wx * 171 + 5, 66, 34, 108);
            x.fillStyle = '#6d4b33'; for (let k = 0; k < 6; k++) x.fillRect(ox + wx * 171 + 5, 70 + k * 18, 34, 3); }
          x.fillStyle = '#7f8188'; x.fillRect(ox, 236, 171, 30);
          x.fillStyle = '#3a3532'; x.fillRect(ox + 10, 270, 151, 242); x.fillStyle = '#b84a2c'; x.fillRect(ox, 0, 171, 14); }
        const tt = tex(done(THREE, c, false)); tt.anisotropy = 8; return B({ map: tt, fog: true }); })();
      const SX = R.x1 + 14;
      quad(shop, [SX, -6, 252], [SX, -6, 228], [SX, 7.0, 228], [SX, 7.0, 252]);
      box(B({ color: 0x8e3a26, fog: true }), SX - 0.2, 7.25, 240, 0.8, 0.5, 24);
      floor(B({ color: 0x55565a, fog: true }), R.x1 + 0.2, 226, SX, 254, -6.0);
      box(mRoomWall, R.x1 + 0.2, -3.0, 240, 0.2, 6.0, 5.2);
    }

    /* the glass of every window, drawn last (see-through: after the opaque) */
    function buildGlass() { for (const g of glass) quadUV(g.mat, g.a, g.b, g.c, g.d); }

    buildWalkway();
    buildCourt();
    buildHouse();
    buildEstate();
    buildLift();
    buildRoom();
    buildGlass();
    flush(world);

    /* ================================================================ THE THINGS (masters/v28.0/props/RECORD.md: each one
       made once, prepared in metres on its base's middle, its front along +z; every number is a place). With the mends
       taken here at no credits (Chad's rule: keep, mend here, or pay for another; mending here is the default): */
    const DEG = Math.PI / 180;
    const C3 = new THREE.Color();
    /* THE ROSEWOOD, darkened at runtime (RECORD.md: every "dark rosewood" thing came back a bright saturated red): the
       picture's own colour turned 16 degrees toward orange about the grey axis (hueTurn) and darkened, so its grain and
       wear stay and its red becomes a dark reddish brown. His files untouched (v12.4 holds it for his; it costs nothing) */
    function rosewood(m) { m.traverse(q => { if (!q.isMesh) return; for (const mt of [].concat(q.material)) { if (!mt || !mt.color) continue;
      mt.color.multiply(C3.set(0xa88c7e)); hueTurn(mt, 16); } }); }
    /* the case's foam (RECORD.md 7): its pits drew as black mirrors. Matte: no shine and no metal, the whole case */
    function matte(m) { m.traverse(q => { if (!q.isMesh) return; for (const mt of [].concat(q.material)) { if (!mt) continue;
      if ('metalness' in mt) { mt.metalness = 0; mt.metalnessMap = null; } if ('roughness' in mt) { mt.roughness = 0.92; mt.roughnessMap = null; } mt.needsUpdate = true; } }); }
    /* a model stood and SCALED on its own axes (a table to its plan's size), then mended */
    function place(key, x, y, z, ry, o = {}) {
      const g = stand(key, x, y, z, ry, { done: (m) => { if (o.wood) rosewood(m); if (o.matte) matte(m); if (o.done) o.done(m); } });
      if (o.sx || o.sy || o.sz) g.scale.set(o.sx || 1, o.sy || 1, o.sz || 1);
      if (o.name) g.name = o.name;
      return g;
    }
    /* MANY OF ONE THING, each stretched along its own x (the balustrade's 2 m sections fitted to each run): manyOf's own
       way (one InstancedMesh a mesh of the file, the file's transform folded in), with a scale per instance */
    function manyX(key, list, chunk = 3) {
      if (!have(key)) { waiting.add(key); return; }
      parseOnce(key).then(({ scene: src }) => {
        if (!alive) return;
        src.updateMatrixWorld(true);
        src.traverse(o => { if (!o.isMesh) return;
          const mat = o.material.clone(); mats.push(mat);
          /* (in pieces of `chunk`, each culled by its own sphere: one mesh for both runs was all of them in every frame) */
          for (let c0 = 0; c0 < list.length; c0 += chunk) { const part = list.slice(c0, c0 + chunk);
          const im = new THREE.InstancedMesh(o.geometry, mat, part.length);
          part.forEach((it, i) => { _me.set(0, it.ry || 0, 0, 'YXZ'); _mq.setFromEuler(_me);
            _mm.compose(_mp.set(it.x, it.y, it.z), _mq, _ms.set(it.sx || 1, 1, 1)).multiply(o.matrixWorld); im.setMatrixAt(i, _mm); });
          im.instanceMatrix.needsUpdate = true; im.computeBoundingSphere(); im.name = 'stock:' + key;
          world.add(im); owned.push(im); } });
      }).catch(err => { console.warn(key + ' failed to load', err); if (ctx.loadFail) ctx.loadFail(key, err); });
    }
    const things = {};
    /* --- the walkway: the balustrade along both runs (each run's sections stretched to fill it: run 1 nine of 1.883 m,
       run 2 seven of 1.871 m), its lights on the soffit every 4 m (as they came: the rim up against the soffit, the ribbed
       dome below it), the drain's grating at the edge (as it came: put to Chad) */
    { const R = [], W = WALK, rz0 = W.z0 + 0.15, rz1 = W.z1, n1 = 9, L1 = (rz1 - rz0) / n1;
      for (let i = 0; i < n1; i++) R.push({ x: W.edge - 0.09, y: 0, z: rz1 - (i + 0.5) * L1, ry: -Math.PI / 2, sx: L1 / 2.0 });
      const rx0 = W.endX, rx1 = W.edge - 0.16, n2 = 7, L2 = (rx1 - rx0) / n2;
      for (let i = 0; i < n2; i++) R.push({ x: rx0 + (i + 0.5) * L2, y: 0, z: W.z0 + 0.09, ry: 0, sx: L2 / 2.0 });
      manyX('w5rail', R); }
    { const L = [];
      for (let z = -0.8; z > WALK.z0 + 0.5; z -= 4.0) L.push({ x: 0.0, y: WALK.soffit - 0.168, z, ry: 0 });
      for (let x = -3.2; x > WALK.endX + 0.5; x -= 4.0) L.push({ x, y: WALK.soffit - 0.168, z: (WALK.z0 + WALK.turnZ) / 2, ry: 0 });
      many('w5walklight', L, world, 0.2); things.walkLights = L; }
    const DRAIN = { x: WALK.edge - 0.42, z: -8.7 };                      // (clear of the balustrade's plinth: clipscan)
    things.grating = place('w5grating', DRAIN.x, 0.0, DRAIN.z, Math.PI / 2, { name: 'grating' });
    /* --- his gate between its posts (the gate swings on its left post into the court: shut on the walkway, open from the
       hunt on: gateOpen); the posts' caps a bright terracotta, as made */
    const gp = GATE.w / 2 + GATE.post / 2 + 0.005;
    place('w5gatepost', GATE.x - gp, 0, WALK.turnZ + 0.1, 0);
    place('w5gatepost', GATE.x + gp, 0, WALK.turnZ + 0.1, 0);
    solidXZ(GATE.x - gp - 0.21, WALK.turnZ - 0.11, GATE.x - gp + 0.21, WALK.turnZ + 0.31);
    solidXZ(GATE.x + gp - 0.21, WALK.turnZ - 0.11, GATE.x + gp + 0.21, WALK.turnZ + 0.31);
    const gateHinge = new THREE.Group(); gateHinge.position.set(GATE.x - GATE.w / 2, 0, WALK.turnZ + 0.1); world.add(gateHinge);
    things.gate = place('w5gate', GATE.w / 2, 0, 0, 0, { name: 'gate' });
    world.remove(things.gate); gateHinge.add(things.gate);
    const gateShut = solidXZ(GATE.x - GATE.w / 2, WALK.turnZ, GATE.x + GATE.w / 2, WALK.turnZ + 0.2);
    const gateOpenLeaf = solidXZ(GATE.x - GATE.w / 2 - 0.08, WALK.turnZ + 0.15, GATE.x - GATE.w / 2 + 0.12, WALK.turnZ + 0.15 + GATE.w);
    function gateOpen(k) { gateHinge.rotation.y = -Math.max(0, Math.min(1, k)) * 92 * DEG; }
    /* --- the court: the two planters along its sides near the gate (each 2 m long, turned to run along the court),
       SUNK into the paving until their ragged bottoms are hidden (RECORD.md 3: the first 15 cm, the second 25 cm); the
       two wall lamps either side of his door; a pair of slippers by it */
    const PLANT_Z = -11.7;
    place('w5planter', COURT.x1 - 0.373 - 0.02, -0.15, PLANT_Z, Math.PI / 2, { name: 'planterL' });        // (his LEFT, walking in)
    place('w5planter2', COURT.x0 + 0.413 + 0.02, -0.25, PLANT_Z, -Math.PI / 2, { name: 'planterR' });
    solidXZ(COURT.x1 - 0.76, PLANT_Z - 1.0, COURT.x1, PLANT_Z + 1.0, 1.4);
    solidXZ(COURT.x0, PLANT_Z - 1.0, COURT.x0 + 0.84, PLANT_Z + 1.0, 1.4);
    place('w5walllamp', DOOR_FRONT.x0 - 0.38, 1.55, HOUSE.face - 0.2 - 0.074, Math.PI, { name: 'courtLampL' });
    place('w5walllamp', DOOR_FRONT.x1 + 0.38, 1.55, HOUSE.face - 0.2 - 0.074, Math.PI, { name: 'courtLampR' });
    place('w5slippers', DOOR_FRONT.x0 - 0.12, 0.0, HOUSE.face - 0.55, Math.PI + 12 * DEG, { name: 'slippers' });
    /* --- his front door, hung in its frame: the leaf's hinge edge (its +x, ragged) on the frame's west jamb, which covers
       it; shut on the walkway, open from the hunt (doorOpen) */
    /* (hinged at the wall's inner face, so it swings into the room clear of the wall: clipscan found the leaf, hinged in the
       wall's middle, back through the wall and into the shoe cabinet) */
    const doorHinge = new THREE.Group(); doorHinge.position.set(DOOR_FRONT.x0 + 0.005, 0, LIVING.z0 - 0.05); world.add(doorHinge);
    { const mStop = M({ color: 0x3a2618, roughness: 0.6 }), zs = LIVING.z0 - 0.115;      // the door stops, on the court side of the leaf: 3.5 cm over each edge
      box(mStop, DOOR_FRONT.x0 + 0.035, DOOR_FRONT.h / 2, zs, 0.07, DOOR_FRONT.h, 0.03); box(mStop, DOOR_FRONT.x1 - 0.035, DOOR_FRONT.h / 2, zs, 0.07, DOOR_FRONT.h, 0.03);
      box(mStop, (DOOR_FRONT.x0 + DOOR_FRONT.x1) / 2, DOOR_FRONT.h - 0.035, zs, DOOR_FRONT.x1 - DOOR_FRONT.x0, 0.07, 0.03); }
    things.door = place('w5frontdoor', 0.395, 0, 0, Math.PI, { name: 'frontdoor', wood: true });
    world.remove(things.door); doorHinge.add(things.door);
    function doorOpen(k) { doorHinge.rotation.y = -Math.max(0, Math.min(1, k)) * 90 * DEG; }
    solidXZ(DOOR_FRONT.x0 - 0.05, LIVING.z0 - 0.05, DOOR_FRONT.x0 + 0.07, LIVING.z0 + 0.75);                 // the leaf, open, along the wall                 // the leaf, open, along the wall
    /* --- inside, by the door: the shoe cabinet against the front wall, west of the door, scaled to 0.35 m deep and
       darkened (RECORD.md 4; its ragged edges stay); the place under it is the first stain's */
    const SHOE = { x: (WIN_A.x1 + DOOR_FRONT.x0) / 2, z: LIVING.z0 + 0.175 + 0.01 };
    place('w5shoecab', SHOE.x, 0, SHOE.z, 0, { name: 'shoecab', wood: true, sz: 0.35 / 0.53 });
    solidXZ(SHOE.x - 0.45, LIVING.z0, SHOE.x + 0.45, SHOE.z + 0.18, 1.06);
    /* --- the curtains: drawn over both front windows, each window two curtains a little apart and one a hand behind
       the other (RECORD.md 1: the cloth's two slits are each covered by the other's cloth), their rails 5 cm under the
       ceiling; and one gathered beside the terrace doors, pushed to the side */
    /* (a drawn curtain is lit from the room: its back glows a little in the lamps' warmth, seen from the court at dusk) */
    const lamplit = (m) => m.traverse(q => { if (q.isMesh) for (const mt of [].concat(q.material)) if (mt && mt.emissive) { mt.emissive.set(0x2a2824); if (mt.map) mt.emissiveMap = mt.map; } });
    for (const Wn of [WIN_A, WIN_B]) { const xm = (Wn.x0 + Wn.x1) / 2;
      /* (clipscan: 10 cm apart in z the two cloths crossed; each is 0.195 deep, so 0.22 apart) */
      place('w5curtain', xm - 0.04, HOUSE.ceil - 2.40 - 0.05 + 0.04, LIVING.z0 + 0.10, 0, { sx: 0.72, done: lamplit });
      place('w5curtain', xm + 0.04, HOUSE.ceil - 2.40 - 0.05, LIVING.z0 + 0.32, 0, { sx: 0.70, done: lamplit }); }
    place('w5curtain', LIVING.x0 + 0.2, HOUSE.ceil - 2.40 - 0.05, TERRACE.z1 + 0.42, Math.PI / 2, { sx: 0.55 });
    /* --- the living room: the sofa facing the television across the low table, the old armchair at the table's north
       end (where his nose is once behind the truth: 4.3), the floor lamp by the sofa's end, the television's console on
       the east wall with a table lamp at each end, the wall clock and a framed picture on the north wall */
    const SOFA = { x: -8.62, z: -3.62 }, TV = { x: LIVING.x1 - 0.36, z: -3.62 }, TABLE = { x: -7.28, z: -3.62 }, ARM = { x: -7.25, z: -2.18 };
    things.sofa = place('w5sofa', SOFA.x, 0, SOFA.z, Math.PI / 2, { name: 'sofa' });
    solidXZ(SOFA.x - 0.44, SOFA.z - 1.05, SOFA.x + 0.44, SOFA.z + 1.05, 0.8);
    place('w5lowtable', TABLE.x, 0, TABLE.z, Math.PI / 2, { name: 'lowtable', wood: true });
    solidXZ(TABLE.x - 0.38, TABLE.z - 0.6, TABLE.x + 0.38, TABLE.z + 0.6, 0.36);
    place('w5tvconsole', TV.x, 0, TV.z, -Math.PI / 2, { name: 'tvconsole', wood: true });
    solidXZ(TV.x - 0.36, TV.z - 0.9, LIVING.x1, TV.z + 0.9, 1.2);
    things.armchair = place('w5oldchair', ARM.x, 0, ARM.z, Math.PI, { name: 'armchair' });
    solidXZ(ARM.x - 0.47, ARM.z - 0.42, ARM.x + 0.47, ARM.z + 0.42, 0.82);
    things.floorLamp = place('w5floorlamp', SOFA.x - 0.05, 0, SOFA.z + 1.38, 0, { name: 'floorlamp' });
    solidXZ(SOFA.x - 0.3, SOFA.z + 1.12, SOFA.x + 0.2, SOFA.z + 1.64, 1.5);
    /* (the console's top is 0.45 and its television fills it to 0.65 m either side of its middle, measured from the file:
       no table lamp fits on it. The armchair's reading lamp stands beside it; the table lamp is on the sideboard) */
    const ARMLAMP = { x: ARM.x + 0.78, z: ARM.z + 0.12 };
    things.floorLamp2 = place('w5floorlamp', ARMLAMP.x, 0, ARMLAMP.z, 0, { name: 'floorlamp2' });
    solidXZ(ARMLAMP.x - 0.25, ARMLAMP.z - 0.25, ARMLAMP.x + 0.25, ARMLAMP.z + 0.25, 1.5);
    place('w5wallclock', -6.15, 1.42, LIVING.z1 - 0.06 - 0.062, Math.PI, { name: 'wallclock', wood: true });
    /* --- the dining room: the table (scaled to 0.75 m tall) and four chairs round it, the pendant over it, the sideboard
       against its north wall, a framed picture over it */
    const DT = { x: -10.4, z: -0.15 };
    place('w5dintable', DT.x, 0, DT.z, 0, { name: 'dintable', wood: true, sy: 0.75 / 0.873 });
    solidXZ(DT.x - 0.75, DT.z - 0.75, DT.x + 0.75, DT.z + 0.75, 0.75);
    for (const [dx, dz, ry] of [[0, -0.80, 0], [0, 0.70, Math.PI], [-0.80, 0, Math.PI / 2], [0.80, 0, -Math.PI / 2]])
      place('w5dinchair', DT.x + dx, 0, DT.z + dz, ry, { wood: true });
    things.pendant = place('w5pendant', DT.x, HOUSE.ceil - 0.45 - 0.35, DT.z, 0, { name: 'pendant' });
    const SB = { x: -10.4, z: DINING.z1 - 0.06 - 0.283, top: 0.77 };
    place('w5sideboard', SB.x, 0, SB.z, Math.PI, { name: 'sideboard', wood: true });
    /* the table lamp at its east end, clear of the vase (the sideboard's top 0.77 m: the file's measure; turned, its own -x is the world's +x) */
    things.tableLamp = place('w5tablelamp', SB.x + 0.62, SB.top, SB.z + 0.02, 0, { name: 'tablelamp' });
    solidXZ(SB.x - 0.85, DINING.z1 - 0.65, SB.x + 0.85, DINING.z1, 1.0);
    /* the pictures in their frames (w5frame's white card is the chapter's to fill): ink landscapes, mountains and water,
       painted here (a Chinese home of the period; nobody in them: no face is drawn into the world) */
    function inkLandscape(seed) {
      const [c, x] = canvas(512, 340), r = rng(seed);
      x.fillStyle = '#efe7d4'; x.fillRect(0, 0, 512, 340);
      for (let layer = 0; layer < 4; layer++) { const base = 120 + layer * 55, a = 0.18 + layer * 0.16;
        x.fillStyle = `rgba(40,42,44,${a})`; x.beginPath(); x.moveTo(0, 340);
        for (let px = 0; px <= 512; px += 16) x.lineTo(px, base - Math.abs(Math.sin(px * 0.011 * (layer + 1) + r() * 0.4)) * (90 - layer * 14) - r() * 10);
        x.lineTo(512, 340); x.fill(); }
      x.fillStyle = 'rgba(160,40,30,0.85)'; x.fillRect(452, 30, 22, 30);
      return B({ map: tex(done(THREE, c, false)) });
    }
    function framed(x, y, z, ry, seed) {
      place('w5frame', x, y, z, ry, { wood: false });
      const g = new THREE.Group(); g.position.set(x, y, z); g.rotation.y = ry; world.add(g);
      const m = new THREE.Mesh(new THREE.PlaneGeometry(0.54, 0.33), inkLandscape(seed)); m.position.set(0, 0.2305, 0.0255); g.add(m); owned.push(m.geometry);
    }
    framed(ARM.x, 1.45, LIVING.z1 - 0.06 - 0.024, Math.PI, 28561);
    framed(SB.x, 1.5, DINING.z1 - 0.06 - 0.024, Math.PI, 28562);
    /* --- THE RITE'S THINGS, made ready and put away (the films and the play show them where their story puts them; each
       a handle on the stage: stage.things): the black bag open and tied, the reel of white thread (set down on its ball:
       RECORD.md 6, its loose end into the paving), the wrapped staff, its cloth, the Naga stick, Jun's duffel */
    const away = (key, name, o = {}) => { const g = place(key, 0, 0, 0, 0, Object.assign({ name }, o)); g.visible = false; things[name] = g; return g; };
    away('w5bagopen', 'bagOpen'); away('w5bagtied', 'bagTied'); away('w5threadreel', 'threadReel');
    things.threadReel.userData.sink = -0.015;
    away('w5staffwrap', 'staffWrap'); away('w5staffcloth', 'staffCloth'); away('w5nagastaff', 'nagaStaff'); away('w5duffel', 'duffel');
    /* where each is set when it is set down (the plan's 4.4): the bag on the paving before the doorway, the reel beside it */
    const RITE = { bag: { x: GATE.x + 0.35, z: HOUSE.face - 1.35 }, reel: { x: GATE.x - 0.35, z: HOUSE.face - 1.2 }, duffel: { x: DOOR_FRONT.x1 + 0.9, z: HOUSE.face - 0.45 } };
    function setDown(name, at, ry = 0) { const g = things[name]; if (!g) return; g.position.set(at.x, g.userData.sink || 0, at.z); g.rotation.y = ry; g.visible = true; }
    /* --- case three's room: the table and its cloth (scaled to 0.70 m deep), the collector's padded case on it (matte),
       the cushions, the altar shelf (empty, as asked) on the wall behind Grandmaster Pho, the ceiling fan */
    const R = ROOM;
    place('w5clothtable', R.cx, 0, R.cz, 0, { name: 'clothtable', sz: 0.70 / 0.976 });
    solidXZ(R.cx - 0.66, R.cz - 0.40, R.cx + 0.66, R.cz + 0.40, 0.34);
    things.padcase = place('w5padcase', R.cx - 0.36, 0.34, R.cz - 0.05, 18 * DEG, { name: 'padcase', matte: true });
    const SEAT = { pho: { x: R.cx, z: R.cz + 0.78 }, him: { x: R.cx, z: R.cz - 0.80 }, collector: { x: R.cx - 0.98, z: R.cz - 0.05 } };
    place('w5cushion', SEAT.pho.x, 0, SEAT.pho.z, 0); place('w5cushion', SEAT.him.x, 0, SEAT.him.z, 0); place('w5cushion', SEAT.collector.x, 0, SEAT.collector.z, 0);
    place('w5altarshelf', R.cx, 1.55, R.z1 - 0.2, Math.PI, { name: 'altarshelf', wood: true });
    things.fan = place('w5ceilfan', R.cx, R.ceil - 0.52, R.cz, 0, { name: 'ceilfan' });

    /* ================================================================ THE LAMPS' LIGHT (painted: v9.4, v15.1)
       Each lamp's glow (a soft card over its shade, drawn over what stands at its depth: v25.5) and its pool on the floor,
       wall or ceiling; lamp(i, k) sets one by k (0 off, 1 on: the fourth lamp of 4.2 flickers by the play's hand); the
       court's two wall lamps are lit for the night (courtLamps(k)) */
    const glowTex = (() => { const [c, x] = canvas(128, 128); const g = x.createRadialGradient(64, 64, 2, 64, 64, 62);
      g.addColorStop(0, 'rgba(255,236,196,1)'); g.addColorStop(0.35, 'rgba(255,214,150,0.45)'); g.addColorStop(1, 'rgba(255,200,130,0)');
      x.fillStyle = g; x.fillRect(0, 0, 128, 128); return tex(done(THREE, c, false)); })();
    const lights = [];
    function lightAt(x, y, z, size, pool) {
      const mat = new THREE.SpriteMaterial({ map: glowTex, color: 0xffe2b4, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.85 }); mats.push(mat);
      const sp = new THREE.Sprite(mat); sp.position.set(x, y, z); sp.scale.set(size, size, 1); world.add(sp);
      let pm = null;
      if (pool) { pm = new THREE.MeshBasicMaterial({ map: glowTex, color: 0xffd9a0, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.32, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }); mats.push(pm);
        const q = new THREE.Mesh(new THREE.PlaneGeometry(pool.w, pool.h), pm); q.position.set(pool.x, pool.y, pool.z); q.rotation.set(pool.rx || 0, pool.ry || 0, 0); world.add(q); owned.push(q.geometry); }
      const L = { sp, mat, pm, k: 1, o0: mat.opacity, p0: pm ? pm.opacity : 0 }; lights.push(L); return L;
    }
    lightAt(SOFA.x - 0.05, 1.42, SOFA.z + 1.38, 0.55, { x: SOFA.x, y: 0.006, z: SOFA.z + 1.2, w: 2.4, h: 2.4, rx: -Math.PI / 2 });
    lightAt(ARMLAMP.x, 1.42, ARMLAMP.z, 0.55, { x: ARMLAMP.x - 0.2, y: 0.006, z: ARMLAMP.z - 0.1, w: 2.2, h: 2.2, rx: -Math.PI / 2 });
    lightAt(SB.x + 0.62, SB.top + 0.38, SB.z + 0.02, 0.42, { x: SB.x + 0.62, y: 1.4, z: DINING.z1 - 0.062, w: 1.4, h: 1.4, ry: Math.PI });
    lightAt(DT.x, HOUSE.ceil - 0.62, DT.z, 0.6, { x: DT.x, y: 0.758, z: DT.z, w: 1.6, h: 1.6, rx: -Math.PI / 2 });
    const courtL = [lightAt(DOOR_FRONT.x0 - 0.38, 1.86, HOUSE.face - 0.3, 0.38, { x: DOOR_FRONT.x0 - 0.38, y: 1.6, z: HOUSE.face - 0.212, w: 1.6, h: 1.6, ry: Math.PI }),
                    lightAt(DOOR_FRONT.x1 + 0.38, 1.86, HOUSE.face - 0.3, 0.38, { x: DOOR_FRONT.x1 + 0.38, y: 1.6, z: HOUSE.face - 0.212, w: 1.6, h: 1.6, ry: Math.PI })];
    function lamp(i, k) { const L = lights[i]; if (!L) return; L.k = k; L.mat.opacity = L.o0 * k; if (L.pm) L.pm.opacity = L.p0 * k; L.sp.visible = k > 0.01; }
    function courtLamps(k) { for (const L of courtL) { L.mat.opacity = L.o0 * k; if (L.pm) L.pm.opacity = L.p0 * k; L.sp.visible = k > 0.01; } }

    /* ================================================================ WHERE EACH PHASE PUTS THINGS AND PEOPLE
       (the plan's 4: each phase a save, and a Continue lands at its start). Every place is named here, so a film, the
       play and the walk test read one table. `at` is where he stands at the phase's start (and where a film hands him
       back); a person's station is where that person stands while that phase is played. Mr Koh's and Jun's are cast by
       the world (b_xpeople.js); Grandmaster Pho's, Ton's and the collector's are MARKED for their builders. */
    const STATION = {
      walk:  { at: { x: 0, z: 0.25, ry: 0 },
               /* (the PLAY helper's measure: from the spawn Ton must be in a phone's view, v12.3; each clears the balustrade (x 0.8),
                  the inner wall (x -0.95) and the others by 0.7 m or more) */
               pho: { x: 0.0, z: -3.2, ry: Math.PI }, ton: { x: -0.3, z: -2.0, ry: 0.13 }, jun: { x: 0.32, z: -2.35, ry: -0.12 },
               koh: { x: -9.0, z: -4.4, ry: Math.PI } },
      hunt:  { at: { x: -7.9, z: -5.05, ry: Math.PI + 0.2 },
               pho: { x: -9.6, z: -4.6, ry: -Math.PI / 2 }, ton: { x: -7.4, z: -12.6, ry: Math.PI }, jun: { x: -9.4, z: -8.4, ry: 0.4 },
               koh: { x: -9.85, z: -2.25, ry: Math.PI * 0.85 } },
      /* the cleansing: he in the court (the fight's own start is the fight's), the three in the doorway behind the thread */
      fight: { at: { x: -8.5, z: -10.6, ry: Math.PI },
               pho: { x: -8.0, z: -11.4, ry: Math.PI }, ton: { x: -9.12, z: -4.95, ry: Math.PI }, jun: { x: -7.88, z: -4.95, ry: Math.PI },
               koh: { x: -8.5, z: -4.7, ry: Math.PI } },
      /* case three: seated across the table from his teacher (the play seats him) */
      table: { at: { x: SEAT.him.x, z: SEAT.him.z, ry: Math.PI },
               pho: { x: SEAT.pho.x, z: SEAT.pho.z, ry: Math.PI }, collector: { x: SEAT.collector.x, z: SEAT.collector.z, ry: Math.PI / 2 },
               jun: { x: 1.45, z: 238.15, ry: -0.8 }, koh: null, ton: null }
    };
    STATION.ask = STATION.table;
    const DRAIN_SPOT = DRAIN;
