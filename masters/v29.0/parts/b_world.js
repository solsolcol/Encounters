  /* ================================================================ THE WORLD'S PLAN (WORLD, the tracker's M5; the plan's
     4.3, 5, 8, 9 and 12). Read before build(): the numbers the chapter's data and every other part take from the places.
     masters/v29.0/WORLD.md writes every one of them out for PLAY and FILMS.
     TWO POCKET WORLDS, each past the lens's far plane (160 m) from the other (v8.9):
       HER PLACE at the origin: the shophouse row at blue hour, its street and the row opposite (the opening's crane), the
                 five-foot way and the coffee shop closing below her, the narrow stair from the street door to the landing,
                 and her rented flat on the upper floor, its floor at y 0, the street 3.85 m below it (the plan's 5.1 to 5.3)
       HIS HOME 300 m along +x: a high-floor condominium flat (its floor at y 0, the ground 78 m below), its corridor, the
                 city outside his glass as built towers with lit and dark windows, the expressway's lights and the pool
                 far below (the plan's 5.4)
     ONE CHANGE TO THE SKELETON'S DATA, made here because the places decide it (said in WORLD.md): the spawn is where the
     opening film leaves him, kneeling at his place by her windows; the decision's anchor (the engine's pile) is his phone
     on his dining table; the bounds hold the two flats he walks in; and the models the places stand are declared with
     the chapter's own (every reuse with its reason: v17.4). */
  const HX = 300.0;                                    // his flat's pocket: its living room's middle on x
  const WORLD_AT = {
    kneel: { x: 1.45, z: 1.9, ry: 0.41 },               // his place by her windows, at Grandmaster Pho's right (looking at Grace)
    phone: { x: HX + 0.15, y: 0.758, z: -0.2 }          // his phone on its charger, on his dining table's near end
  };
  Object.assign(DATA.spawn, { x: WORLD_AT.kneel.x, z: WORLD_AT.kneel.z, rot: WORLD_AT.kneel.ry });
  Object.assign(DATA.shrine, { x: WORLD_AT.phone.x, z: WORLD_AT.phone.z });
  Object.assign(DATA.ghostHome, { x: WORLD_AT.phone.x, z: WORLD_AT.phone.z });
  Object.assign(DATA.bounds, { minX: -6.2, maxX: HX + 8.6, minZ: -4.6, maxZ: 4.4 });
  /* the models the places stand that the game already has (each met before in episode 4; none of episodes 1 to 3), and
     why each is the thing itself: props/RECORD.md's survey, and the places' own */
  const WORLD_REUSE = {
    w5ceilfan: "the ceiling fan over her front room: episode 4 chapter 5's (Mr Koh's living room), a plain white fan",
    w4tubelight: "the stair's one fluorescent tube, and the coffee shop's: episode 4 chapter 4's batten",
    w4gate: "her door's metal gate, folded back on the landing: episode 4 chapter 4's grille gate",
    w4doorleaf: "her timber front door, the street door to her stair and her bedroom door: episode 4 chapter 4's timber leaf",
    w5frontdoor: "his front door and his neighbours' on the corridor, tinted a dark veneer here: episode 4 chapter 5's door",
    w5slippers: "her shoes by her door on the landing: episode 4 chapter 5's slippers",
    w4corrpots: "the plant on her landing: episode 4 chapter 4's corridor pots",
    w3dracaena: "the plant in her front room's corner and on his balcony: episode 4 chapter 3's dracaena",
    w5tablelamp: "her table lamp on the bookshelf and his bedside lamp: episode 4 chapter 5's (props/RECORD.md)",
    w5cushion: "Grandmaster Pho's cushion, his own and her floor cushions: episode 4 chapter 5's (props/RECORD.md)",
    w4fridge: "the fridge in her kitchenette: episode 4 chapter 4's (props/RECORD.md: it fits her flat better than his)",
    w4dintable: "her small dining table in the back room: episode 4 chapter 4's",
    w4dinechair: "her two dining chairs: episode 4 chapter 4's",
    w4streetlamp: "the street lamps of the shophouse row: episode 4 chapter 4's",
    e4sedan: "the taxi that brings them (tinted a taxi's blue, no name on it: v9.3): episode 4 chapter 1's sedan",
    e4sedanfar: "a car parked across the street (its light level): episode 4 chapter 1's",
    e4suvfar: "a car parked up the street (its light level): episode 4 chapter 1's",
    e4moto: "a motorbike parked at the kerb: episode 4 chapter 1's",
    w3pchair: "the coffee shop's chairs stacked for the night, and his balcony chairs: episode 4 chapter 3's plastic chair",
    e4buddha: "the small Buddha image on his altar: Chad's own (props/RECORD.md)",
    w4framesmall: "his teacher's framed photograph on his altar: episode 4 chapter 4's frame (props/RECORD.md)",
    e4bag: "his own grey canvas bag by his front door, the white thread in it (the plan's 9.7): episode 4 chapter 2's, his",
    e4phone: "his own phone on his dining table: episode 4 chapter 2's, the same man's (props/RECORD.md)",
    w3candlesmall: "the candles on her cloth and on his altar (props/RECORD.md)",
    w4bigbowl: "Grandmaster Pho's own bowl for the holy water (props/RECORD.md)",
    w4clothesrack: "the clothes rack on his balcony (props/RECORD.md)",
    w5walllamp: "the wall lights of his corridor: episode 4 chapter 5's walkway lamps",
    w5frame: "the two pictures in his passage that tap the wall at three o'clock: episode 4 chapter 5's wall frame"
  };
  for (const k of Object.keys(WORLD_REUSE)) if (!DATA.assets.includes(k)) DATA.assets.push(k);
  Object.assign(DATA.reuseInEpisode, WORLD_REUSE);
  /* the new things of the plan's 7 the places stand, by the keys they land under (props/TABLE.txt): each placed now with
     an invisible stand-in for its collision, drawn the moment its file is in the build (keys.py adds it to `assets`),
     so nothing moves when it lands (v4.7) */
  const WORLD_NEW = ['w51clock', 'w51aircon', 'w51kettle', 'w51jasmine', 'w51incense', 'w51plate', 'w51lighter', 'w51jug', 'w51glass', 'w51ctable', 'w51gsofa', 'w51rattan', 'w51shelf', 'w51laptop', 'w51takeaway', 'w51sofa', 'w51dintable',
                     'w51dinchair', 'w51bed', 'w51altarcab', 'w51bag', 'w51keepsake', 'w51bottle', 'w51threadreel'];

  function build(ctx) {
    /* ================================================================ THE MACHINERY, COPIED (masters/v29.0/assemble.py
       pins episode 4 chapter 5's file by its sha1; chapters are copied, not bundled: v6.11). Its build's head: the engine's
       kit taken from ctx, the TDZ law's declarations, the speed-ups' switches (v26.11), the small helpers */
//@@COPY 617-759 :: const { THREE, GLTFLoader, cloneSkinned, scene, camera, yaw, pitch, LOW, kit, cnv, loadImageTexture,

    /* ================================================================ THE PLACES (WORLD, M5: the plan's 5; masters/v29.0/
       WORLD.md every number below). Units metres, y up; a Mixamo body at a turn of 0 faces +z, the lens at 0 looks -z.
       HER PLACE (the origin). Her flat is the upper floor of a shophouse unit whose front is on the street at +x:
         FRONT  her front room, x -2.75..2.75 (her front wall's inside face at 2.75, the street beyond), z -3.0..3.0, the
                ceiling at 3.4; two tall timber windows in the front wall (A z -2.2..-0.6, B z 0.6..2.2), louvred shutters
                inside them; her front door in the back wall (x -2.75) at z -2.85..-1.9, off the landing
         BACK   past a half wall (x -2.75, z -1.6..1.9; open above it and beside it), her back room x -5.6..-2.9,
                z -1.6..3.0: a small dining table, the kitchenette along the +z wall, the fridge, the bedroom door (shut)
         LOBBY  the landing outside her door, x -4.1..-2.9, z -3.0..-1.75, and the stair's top (z -4.3..-3.15)
         STAIR  the stair bay beside her flat, z -4.3..-3.15: nineteen risers from the street door (in the shop front's
                line, x 1.15) up to the landing at x -3.28
         STREET the five-foot way (x 1.15..3.0) at y -3.85 under her floor, the drain and the kerb, the road (x 3.55..13.55),
                the row opposite (its front at x 14.1), both rows along z -40..40; the coffee shop below her (x -4..1.15)
       HIS HOME (x 300 + the numbers here): living and dining room x -4.6..3.0, z -2.5..2.5, the ceiling 2.8, his glass on
         +z with the balcony beyond (z 2.62..4.1), his front door in the -z wall at x -4.2..-3.4 off the corridor
         (z -4.3..-2.62); the kitchen counter along the -z wall; the passage x 3.0..4.4, z 0.2..1.8; the bedroom x 4.4..8.2,
         z -1.0..2.5 (its glass on +z); the bathroom x 4.4..6.4, z -2.5..-1.12; the ground 78 m below */
    const ROOM = { x0: -5.6, x1: 2.75, z0: -3.0, z1: 3.0, ceil: 3.4, cx: 0, cz: 0 };      // her whole flat (keepIn), its front wall's inside face at x1
    const FRONT = { x0: -2.75, x1: 2.75, z0: -3.0, z1: 3.0, ceil: 3.4 };                  // her front room
    const BACKR = { x0: -5.6, x1: -2.9, z0: -1.6, z1: 3.0 };                              // her back room
    const LOBBY = { x0: -4.1, x1: -2.9, z0: -3.0, z1: -1.75 };                            // the landing outside her door
    const STAIR = { z0: -4.3, z1: -3.15, x0: -3.28, x1: 0.95, door: 1.15, risers: 19, top: -4.1 };   // the stair bay
    const GY = -3.85;                                                                      // the five-foot way's floor (the street's level)
    const STREET = { x0: -6, x1: 24, z0: -40, z1: 40, cx: 6.0, cz: 0, y: GY, kerb: 3.55, road: [3.55, 13.55], across: 14.1, shop: 1.15, face: 3.0 };
    const FLAT = { x0: HX - 4.6, x1: HX + 8.2, z0: -2.5, z1: 2.5, ceil: 2.8, cx: HX, cz: 0 };   // his flat (keepIn)
    const LIV = { x0: HX - 4.6, x1: HX + 3.0, z0: -2.5, z1: 2.5 };                        // his living and dining room
    const BED = { x0: HX + 4.4, x1: HX + 8.2, z0: -1.0, z1: 2.5 };                        // his bedroom
    const BATH = { x0: HX + 4.4, x1: HX + 6.4, z0: -2.5, z1: -1.12 };                     // his bathroom
    const PASS = { x0: HX + 3.0, x1: HX + 4.4, z0: 0.2, z1: 1.8 };                        // the passage to his bedroom
    const CORR = { x0: HX - 9.5, x1: HX + 3.0, z0: -4.3, z1: -2.62 };                     // his corridor
    const BALC = { x0: HX - 4.6, x1: HX + 3.0, z0: 2.62, z1: 4.1, rail: 1.1 };            // his balcony
    const GH = -78.0;                                                                      // the ground under his block
    const EYE = 1.62;
    const KNEEL_EYE = 1.12;                                                                // his eye kneeling at her table (the reflection is measured from it)
    const world = new THREE.Group(); world.name = 'e5c1'; scene.add(world);
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
       as chapters 4 and 5 copied them), and the merged pieces of what never moves */
//@@COPY 808-1186 :: function parseOnce(key) {

    /* ================================================================ THE PEOPLE: chapter 3's machinery, as chapters 4 and
       5 copied it and mended it (one skeleton and several skins a person, the takes at weights, the films' poses by the
       clock, the feet set down by their own lowest contact, the head's and the shoulders' restraint, the hands laid by
       numbers, the levels by the lens), and its posture laws for a body sat or stood up straight. Every one of its laws
       was learned on those chapters' bodies; see its own notes. The one change (assemble.py EDITS): the bodies drawn
       without mipmaps are this chapter's (p51) and its stand-ins' as their own chapters drew them. */
//@@COPY 2355-4477 :: /* ================================================================ THE PEOPLE (the plan's §3.3, §6.1; the tracker's §5)

    /* ---------------------------------------------- the ground: her flat and his flat are each one level (the walk test
       floods them whole); the street below her is 3.85 m down and his city's ground 78 m down (nobody walks there in play:
       a film's lens and a probe stand there) */
    function flatGround(x, z) {
      if (x > 100) return 0;
      if (x > STREET.shop && x < STREET.x1) return x > STREET.kerb ? GY - 0.15 : GY;
      if (z < STAIR.z1 && z > STAIR.z0 && x > STAIR.x0 && x < STREET.shop) return GY + Math.max(0, Math.min(STAIR.risers, Math.floor((STAIR.x1 - x) / 0.235) + 1)) * (-GY / STAIR.risers);
      return 0;
    }

    /* ================================================================ THE SURFACES (painted, each at its real size: a metre
       of wall is a metre of its picture; the merged pieces' UVs are metres). No lamp is added (v15.1): a surface a lamp
       warms carries that warmth as its own emissive light (v9.4) */
    const wCanvas = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return [c, c.getContext('2d')]; };
    const wPic = (c, tu, tv, aniso = 8) => { const t = tex(done(THREE, c, true)); t.repeat.set(1 / tu, 1 / tv); t.anisotropy = aniso; return t; };
    /* plaster painted: an even colour with a few soft spots, repeating with no seam (chapter 5's) */
    function wPaint(hex, seed, spots = 110, k = 0.01) {
      const [c, x] = wCanvas(256, 256), r = rng(seed);
      x.fillStyle = hex; x.fillRect(0, 0, 256, 256);
      for (let s = 0; s < spots; s++) { const cx0 = r() * 256, cy0 = r() * 256, q = 8 + r() * 26, dark = r() < 0.5;
        for (const ox of [-256, 0, 256]) for (const oy of [-256, 0, 256]) { const cx = cx0 + ox, cy = cy0 + oy;
          if (cx + q < 0 || cx - q > 256 || cy + q < 0 || cy - q > 256) continue;
          const g = x.createRadialGradient(cx, cy, 0, cx, cy, q); g.addColorStop(0, dark ? `rgba(0,0,0,${k})` : `rgba(255,255,255,${k * 1.2})`); g.addColorStop(1, 'rgba(0,0,0,0)');
          x.fillStyle = g; x.fillRect(cx - q, cy - q, q * 2, q * 2); } }
      return c;
    }
    /* square tiles, `n` a side in the picture, each a little varied, their grout */
    function wTiles(W, n, base, grout, seed, vary = 0.08, speck = 0) {
      const [c, x] = wCanvas(W, W), r = rng(seed), T = W / n, [R, G, Bl] = base;
      x.fillStyle = grout; x.fillRect(0, 0, W, W);
      for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
        const k = 1 - vary / 2 + r() * vary;
        x.fillStyle = `rgb(${(R * k) | 0},${(G * k) | 0},${(Bl * k) | 0})`; x.fillRect(i * T + 1.5, j * T + 1.5, T - 3, T - 3);
        for (let s = 0; s < speck; s++) { x.fillStyle = r() < 0.5 ? 'rgba(50,48,44,0.25)' : 'rgba(255,255,250,0.22)';
          x.fillRect(i * T + 2 + r() * (T - 4), j * T + 2 + r() * (T - 4), 1 + r() * 1.6, 1 + r() * 1.6); }
      }
      return c;
    }
    /* floorboards along u: old timber, each board its own shade, a dark joint between, the grain drawn with each */
    function wBoards(seed, base, bw = 32, wrapW = 512) {
      const [c, x] = wCanvas(wrapW, 512), r = rng(seed), [R, G, Bl] = base;
      x.fillStyle = '#2a1c12'; x.fillRect(0, 0, wrapW, 512);
      for (let j = 0; j * bw < 512; j++) { let px = -r() * 200; const px0 = px;
        while (px < px0 + wrapW) { const L = Math.min(150 + r() * 260, px0 + wrapW - px), k = 0.86 + r() * 0.2, gr = [];
          for (let s = 0; s < 5; s++) gr.push([j * bw + 3 + r() * (bw - 6), (r() - 0.5) * 3, 0.08 + r() * 0.1]);
          for (const off of [0, wrapW, -wrapW]) { const qx = px + off;
            x.fillStyle = `rgb(${(R * k) | 0},${(G * k) | 0},${(Bl * k) | 0})`; x.fillRect(qx + 1, j * bw + 1, L - 2, bw - 2);
            for (const [yy, dy, a] of gr) { x.strokeStyle = `rgba(40,24,12,${a})`; x.lineWidth = 1; x.beginPath(); x.moveTo(qx + 2, yy); x.lineTo(qx + L - 2, yy + dy); x.stroke(); } }
          px += L; } }
      return c;
    }
    /* terrazzo: chips of marble in a cement ground */
    function wTerrazzo(seed, ground, chips) {
      const [c, x] = wCanvas(256, 256), r = rng(seed);
      x.fillStyle = ground; x.fillRect(0, 0, 256, 256);
      for (let i = 0; i < 1400; i++) { const s = 1 + r() * 3.2, col = chips[(r() * chips.length) | 0];
        const cx = r() * 256, cy = r() * 256;
        for (const ox of [-256, 0, 256]) for (const oy of [-256, 0, 256]) { if (cx + ox + s < 0 || cx + ox - s > 256 || cy + oy + s < 0 || cy + oy - s > 256) continue;
          x.fillStyle = col; x.beginPath(); x.ellipse(cx + ox, cy + oy, s, s * (0.6 + r() * 0.5), r() * 3, 0, Math.PI * 2); x.fill(); } }
      return c;
    }
    /* THE FIVE-FOOT WAY'S TILES: 150 mm encaustic tiles in a plain four-part geometric pattern of the kind laid in old
       shophouse walkways (none copied from a real one), worn */
    function wEncaustic(seed) {
      const [c, x] = wCanvas(256, 256), r = rng(seed), T = 64;
      for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) {
        const ox = i * T, oy = j * T, w = 0.9 + r() * 0.1;
        x.fillStyle = `rgb(${(214 * w) | 0},${(204 * w) | 0},${(184 * w) | 0})`; x.fillRect(ox, oy, T, T);
        x.fillStyle = `rgb(${(122 * w) | 0},${(58 * w) | 0},${(44 * w) | 0})`;
        x.beginPath(); x.moveTo(ox + T / 2, oy + 6); x.lineTo(ox + T - 6, oy + T / 2); x.lineTo(ox + T / 2, oy + T - 6); x.lineTo(ox + 6, oy + T / 2); x.closePath(); x.fill();
        x.fillStyle = `rgb(${(46 * w) | 0},${(70 * w) | 0},${(78 * w) | 0})`;
        for (const [a, b] of [[0, 0], [T, 0], [0, T], [T, T]]) { x.beginPath(); x.arc(ox + a, oy + b, 13, 0, Math.PI * 2); x.fill(); }
        x.fillStyle = `rgb(${(214 * w) | 0},${(204 * w) | 0},${(184 * w) | 0})`; x.beginPath(); x.arc(ox + T / 2, oy + T / 2, 9, 0, Math.PI * 2); x.fill();
        x.strokeStyle = 'rgba(40,36,30,0.55)'; x.lineWidth = 1.4; x.strokeRect(ox + 0.7, oy + 0.7, T - 1.4, T - 1.4);
      }
      for (let i = 0; i < 260; i++) { x.fillStyle = `rgba(30,26,22,${0.05 + r() * 0.1})`; x.fillRect(r() * 256, r() * 256, 1 + r() * 3, 1 + r() * 2); }
      return c;
    }
    /* asphalt, with its patches */
    function wAsphalt(seed) {
      const [c, x] = wCanvas(256, 256), r = rng(seed);
      x.fillStyle = '#34363a'; x.fillRect(0, 0, 256, 256);
      for (let i = 0; i < 4200; i++) { const v = 30 + r() * 50; x.fillStyle = `rgba(${v},${v},${v + 4},${0.25 + r() * 0.3})`; x.fillRect(r() * 256, r() * 256, 1, 1); }
      return c;
    }
    /* clay roof tiles in courses, seen from below the eaves and from the crane */
    function wRoofTiles(seed) {
      const [c, x] = wCanvas(256, 256), r = rng(seed);
      x.fillStyle = '#5a2e22'; x.fillRect(0, 0, 256, 256);
      for (let j = 0; j < 16; j++) for (let i = 0; i < 12; i++) { const k = 0.8 + r() * 0.3, ox = (j % 2) * 10.7;
        x.fillStyle = `rgb(${(150 * k) | 0},${(74 * k) | 0},${(52 * k) | 0})`; x.fillRect(i * 21.3 + ox - 21.3, j * 16 + 1, 19, 13);
        x.fillStyle = `rgb(${(150 * k) | 0},${(74 * k) | 0},${(52 * k) | 0})`; x.fillRect(i * 21.3 + ox + 234, j * 16 + 1, 19, 13);
        x.fillStyle = 'rgba(0,0,0,0.25)'; x.fillRect(i * 21.3 + ox - 21.3, j * 16 + 12, 19, 2); }
      return c;
    }
    /* corrugated steel: a roller shutter, a coffee shop's back */
    function wCorrugate(base) {
      const [c, x] = wCanvas(64, 256);
      for (let j = 0; j < 256; j++) { const k = 0.72 + 0.28 * Math.sin(j / 256 * Math.PI * 2 * 16); const [R, G, Bl] = base;
        x.fillStyle = `rgb(${(R * k) | 0},${(G * k) | 0},${(Bl * k) | 0})`; x.fillRect(0, j, 64, 1); }
      return c;
    }
    /* louvres: a timber shutter's slats, each lit along its top, dark in its gap */
    function wLouvre(base) {
      const [c, x] = wCanvas(64, 256), [R, G, Bl] = base;
      for (let j = 0; j < 256; j++) { const u = (j % 16) / 16, k = u < 0.12 ? 0.35 : 0.8 + 0.35 * (1 - u);
        x.fillStyle = `rgb(${Math.min(255, R * k) | 0},${Math.min(255, G * k) | 0},${Math.min(255, Bl * k) | 0})`; x.fillRect(0, j, 64, 1); }
      return c;
    }
    /* a carpet's weave and a quiet border pattern (the condominium's corridor) */
    function wCarpet(seed) {
      const [c, x] = wCanvas(256, 256), r = rng(seed);
      x.fillStyle = '#4a4e5a'; x.fillRect(0, 0, 256, 256);
      for (let i = 0; i < 6000; i++) { const v = r(); x.fillStyle = v < 0.5 ? 'rgba(30,32,40,0.3)' : 'rgba(110,114,126,0.22)'; x.fillRect(r() * 256, r() * 256, 1, 1); }
      x.strokeStyle = 'rgba(150,140,120,0.35)'; x.lineWidth = 3;
      for (let k = 0; k < 2; k++) { x.beginPath(); x.moveTo(0, 64 + k * 128); for (let u = 0; u <= 256; u += 32) x.lineTo(u, 64 + k * 128 + ((u / 32) % 2 ? -10 : 10)); x.stroke(); }
      return c;
    }
    /* a radial pool of light (a lamp's on a ceiling, a street lamp's on the road): drawn as a picture, never a light */
    const poolTex = (() => { const [c, x] = wCanvas(128, 128);
      const g = x.createRadialGradient(64, 64, 0, 64, 64, 64); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.35, 'rgba(255,255,255,0.45)'); g.addColorStop(1, 'rgba(255,255,255,0)');
      x.fillStyle = g; x.fillRect(0, 0, 128, 128); return tex(done(THREE, c, false)); })();
    const glowTex = (() => { const [c, x] = wCanvas(64, 64);
      const g = x.createRadialGradient(32, 32, 0, 32, 32, 32); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.18, 'rgba(255,255,255,0.7)'); g.addColorStop(1, 'rgba(255,255,255,0)');
      x.fillStyle = g; x.fillRect(0, 0, 64, 64); return tex(done(THREE, c, false)); })();

    /* her place's surfaces */
    const mBoards = M({ map: wPic(wBoards(51001, [124, 82, 52]), 2.4, 1.2), roughness: 0.62, emissive: 0x140c06 });
    const mHerWall = M({ map: wPic(wPaint('#e6dcc6', 51002), 1.4, 1.4), roughness: 0.94, emissive: 0x2a1e12 });
    const mHerCeil = M({ color: 0xeee6d8, roughness: 0.96, emissive: 0x2e2416 });
    const mSkirtTimber = M({ color: 0x4a3222, roughness: 0.6 });
    const mTimber = M({ color: 0x5a3a26, roughness: 0.58 });                        // her windows' frames and the half wall's cap
    const mTimberDark = M({ color: 0x3a2618, roughness: 0.6 });
    const mLouvre = M({ map: wPic(wLouvre([150, 104, 70]), 0.5, 0.55), roughness: 0.7 });
    const mTerrazzoGreen = M({ map: wPic(wTerrazzo(51003, '#8a8e84', ['#f0eee6', '#5a6058', '#c4c0b0', '#2e322e', '#a8b098']), 0.6, 0.6), roughness: 0.5 });
    const mStairGreen = M({ map: wPic(wPaint('#5f7e68', 51004, 140, 0.02), 1.2, 1.2), roughness: 0.6 });     // old green gloss to the dado
    const mStairWhite = M({ map: wPic(wPaint('#d8d6c8', 51005, 160, 0.025), 1.4, 1.4), roughness: 0.92 });
    const mKitchen = M({ color: 0xe8e4da, roughness: 0.45 });                        // her kitchenette's cabinet fronts
    const mWorktop = M({ map: wPic(wTerrazzo(51006, '#6a6660', ['#d8d4ca', '#3a3834', '#a09a90']), 0.5, 0.5), roughness: 0.35 });
    const mSteelSink = M({ color: 0xaab0b4, roughness: 0.3, metalness: 0.6 });
    /* the shophouse row's faces: plaster in the row's pastels, white mouldings, the five-foot way */
    const facade = (hex, seed) => M({ map: wPic(wPaint(hex, seed, 150, 0.03), 1.6, 1.6), roughness: 0.92 });
    const mFacades = [facade('#c8d8c0', 51010), facade('#e8d6b4', 51011), facade('#d8c0b8', 51012), facade('#c4ccd8', 51013), facade('#e6e0c8', 51014)];
    const mMoulding = M({ color: 0xece8dc, roughness: 0.85 });
    const mFiveFoot = M({ map: wPic(wEncaustic(51015), 0.6, 0.6), roughness: 0.6 });
    const mSoffit = M({ color: 0xcfcabb, roughness: 0.95 });
    const mAsphalt = M({ map: wPic(wAsphalt(51016), 3, 3), roughness: 0.92 });
    const mKerb = M({ color: 0x8a8a84, roughness: 0.9 });
    const mGrate = M({ map: wPic((() => { const [c, x] = wCanvas(64, 64); x.fillStyle = '#2a2c2e'; x.fillRect(0, 0, 64, 64); x.fillStyle = '#0c0d0e'; for (let i = 0; i < 8; i++) x.fillRect(i * 8 + 2, 0, 4, 64); return c; })(), 0.25, 0.25), roughness: 0.7, metalness: 0.3 });
    const mRoof = M({ map: wPic(wRoofTiles(51017), 1.6, 1.2), roughness: 0.85 });
    const mShutter = M({ map: wPic(wCorrugate([150, 152, 150]), 0.5, 1.0), roughness: 0.55, metalness: 0.25 });
    const mShopFloor = M({ map: wPic(wTiles(256, 4, [176, 170, 160], '#6a6660', 51018, 0.08, 120), 1.2, 1.2), roughness: 0.55 });
    const mShopWall = M({ map: wPic(wPaint('#e8e6dc', 51019), 1.4, 1.4), roughness: 0.9, emissive: 0x161616 });
    const mLine = B({ color: 0xd8d2a0 });                                            // the road's painted lines
    const mYellow = B({ color: 0xb8902a });
    const mDarkRoom = B({ color: 0x1c1e24 });                                        // a room behind a window, in shadow (R108: nothing painted)
    const mLitRoom = B({ color: 0xa07a48 });                                         // a lit room behind closed louvres, the light only
    const mSign = (() => { const [c, x] = wCanvas(512, 96);
      x.fillStyle = '#7a1e18'; x.fillRect(0, 0, 512, 96); x.strokeStyle = '#d8b86a'; x.lineWidth = 4; x.strokeRect(6, 6, 500, 84);
      x.fillStyle = '#f0dca0'; x.font = 'bold 50px serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('咖 啡 店   KOPI', 256, 50);
      const t = tex(done(THREE, c, false)); return M({ map: t, roughness: 0.8, emissive: 0x1a0a06 }); })();
    /* glass: her windows' panes, dark at night (what they reflect is built behind them: the reflection below); a shop's */
    const mPaneNight = M({ color: 0x0c1220, roughness: 0.05, metalness: 0.2, transparent: true, opacity: 0.58, depthWrite: false, side: THREE.DoubleSide });
    const mPaneOut = M({ color: 0x1a2236, roughness: 0.08, metalness: 0.3, transparent: true, opacity: 0.55, depthWrite: false, side: THREE.DoubleSide });
    /* his place's surfaces */
    const mPorcelain = M({ map: wPic(wTiles(512, 2, [196, 190, 180], '#8a847a', 51020, 0.05, 60), 1.2, 1.2), roughness: 0.38 });
    const mHisWall = M({ map: wPic(wPaint('#ecebe6', 51021), 1.4, 1.4), roughness: 0.93 });
    const mHisCeil = M({ color: 0xeeeeea, roughness: 0.96 });
    const mHisSkirt = M({ color: 0xd8d6d0, roughness: 0.6 });
    const mVeneer = M({ color: 0x6a4a34, roughness: 0.5 });
    const mGloss = M({ color: 0xf2f0ea, roughness: 0.25 });                          // his kitchen's fronts
    const mStoneTop = M({ color: 0x3a3a3c, roughness: 0.28 });
    const mAlu = M({ color: 0x9ea2a6, roughness: 0.4, metalness: 0.5 });
    const mGlassHis = M({ color: 0x9fb2c8, roughness: 0.05, metalness: 0.2, transparent: true, opacity: 0.18, depthWrite: false, side: THREE.DoubleSide });
    const mCarpet = M({ map: wPic(wCarpet(51022), 1.6, 1.6), roughness: 0.95 });
    const mCorrWall = M({ map: wPic(wPaint('#d8cdb8', 51023), 1.4, 1.4), roughness: 0.92, emissive: 0x161208 });
    const mBathTile = M({ map: wPic(wTiles(256, 4, [232, 232, 228], '#b8b8b0', 51024, 0.03), 0.6, 0.6), roughness: 0.25, emissive: 0x3a3a36 });
    const mSlab = M({ color: 0x9a9890, roughness: 0.9 });                              // his block's own concrete
    const mTower = [M({ color: 0x3c4048, roughness: 0.9 }), M({ color: 0x4a4a46, roughness: 0.9 }), M({ color: 0x34383e, roughness: 0.9 }), M({ color: 0x504c48, roughness: 0.9 })];
    const mGround = M({ color: 0x1c2024, roughness: 1.0 });
    const mRoadFar = M({ color: 0x24262a, roughness: 1.0 });
    const mDeck = M({ color: 0x8a8478, roughness: 0.9 });
    const mPool = B({ color: 0x3ad0d8 });                                            // the pool's water, lit from inside (painted)

    /* ---------------------------------------------- a wall's piece with its picture laid by the world's own metres on every
       face (chapter 5's boxW): `faces` 1 +z, 2 -z, 4 +x, 8 -x, 16 top, 32 bottom */
    function boxW(mat, cx, cy, cz, w, h, d, faces = 63) {
      const hw = w / 2, hh = h / 2, hd = d / 2, y0 = cy - hh, y1 = cy + hh;
      if (faces & 1) quad(mat, [cx - hw, y0, cz + hd], [cx + hw, y0, cz + hd], [cx + hw, y1, cz + hd], [cx - hw, y1, cz + hd], cx - hw, y0);
      if (faces & 2) quad(mat, [cx + hw, y0, cz - hd], [cx - hw, y0, cz - hd], [cx - hw, y1, cz - hd], [cx + hw, y1, cz - hd], -(cx + hw), y0);
      if (faces & 4) quad(mat, [cx + hw, y0, cz + hd], [cx + hw, y0, cz - hd], [cx + hw, y1, cz - hd], [cx + hw, y1, cz + hd], -(cz + hd), y0);
      if (faces & 8) quad(mat, [cx - hw, y0, cz - hd], [cx - hw, y0, cz + hd], [cx - hw, y1, cz + hd], [cx - hw, y1, cz - hd], cz - hd, y0);
      if (faces & 16) quad(mat, [cx - hw, y1, cz + hd], [cx + hw, y1, cz + hd], [cx + hw, y1, cz - hd], [cx - hw, y1, cz - hd], cx - hw, -(cz + hd));
      if (faces & 32) quad(mat, [cx - hw, y0, cz - hd], [cx + hw, y0, cz - hd], [cx + hw, y0, cz + hd], [cx - hw, y0, cz + hd], cx - hw, cz - hd);
    }
    /* A VERTICAL QUAD in the plane x = X (from z0 to z1, y0 to y1) facing +x (f 1) or -x (f -1), or in the plane z = Z
       (x0 to x1) facing +z or -z; its picture in metres (u along it, v up), or laid once whole (`once`); a CEILING quad
       facing down */
    function vquadX(mat, X, z0, z1, y0, y1, f, once = false) {
      const a = f > 0 ? [X, y0, z1] : [X, y0, z0], b = f > 0 ? [X, y0, z0] : [X, y0, z1], c = f > 0 ? [X, y1, z0] : [X, y1, z1], d = f > 0 ? [X, y1, z1] : [X, y1, z0];
      if (once) quadUV(mat, a, b, c, d); else quad(mat, a, b, c, d, f > 0 ? -z1 : z0, y0);
    }
    function vquadZ(mat, Z, x0, x1, y0, y1, f, once = false) {
      const a = f > 0 ? [x0, y0, Z] : [x1, y0, Z], b = f > 0 ? [x1, y0, Z] : [x0, y0, Z], c = f > 0 ? [x1, y1, Z] : [x0, y1, Z], d = f > 0 ? [x0, y1, Z] : [x1, y1, Z];
      if (once) quadUV(mat, a, b, c, d); else quad(mat, a, b, c, d, f > 0 ? x0 : -x1, y0);
    }
    const ceilQ = (mat, x0, z0, x1, z1, y) => quad(mat, [x0, y, z1], [x0, y, z0], [x1, y, z0], [x1, y, z1], z0, x0);
    /* a quad whose picture is laid on it once, whole (a sign, a clock's face): UVs 0..1 */
    function quadUV(mat, a, b, c, d) {
      const Bt = batchOf(mat); let nx = (b[1] - a[1]) * (d[2] - a[2]) - (b[2] - a[2]) * (d[1] - a[1]), ny = (b[2] - a[2]) * (d[0] - a[0]) - (b[0] - a[0]) * (d[2] - a[2]), nz = (b[0] - a[0]) * (d[1] - a[1]) - (b[1] - a[1]) * (d[0] - a[0]);
      const nl = Math.hypot(nx, ny, nz) || 1, P = [a, b, c, a, c, d], U = [[0, 0], [1, 0], [1, 1], [0, 0], [1, 1], [0, 1]];
      for (let i = 0; i < 6; i++) { Bt.p.push(P[i][0], P[i][1], P[i][2]); Bt.n.push(nx / nl, ny / nl, nz / nl); Bt.u.push(U[i][0], U[i][1]); }
    }
    /* A WALL along x (its middle at z = mid, `d` thick) or along z (at x = mid), from a0 to a1, y0 to y1, with openings
       [{ a0, a1, y0, y1 }] cut through it, each with its reveals; every piece solid where it stands on the floor he walks
       (v5.03). o: solid (true), sides (3: 1 the +z / +x face, 2 the -z / -x face), mat2 (the second side's paint),
       reveals (true) */
    function wallRun(mat, along, mid, d, a0, a1, y0, y1, opens = [], o = {}) {
      const solid = o.solid !== false, sides = o.sides || 3, mat2 = o.mat2 || mat, reveals = o.reveals !== false;
      const cuts = opens.slice().sort((p, q) => p.a0 - q.a0); let at = a0; const hd = d / 2;
      const piece = (a, b, ya, yb, sol) => { if (b - a < 0.005 || yb - ya < 0.005) return;
        const c = (a + b) / 2, h = yb - ya, yc = (ya + yb) / 2;
        if (along === 'x') {
          if (sides & 1) boxW(mat, c, yc, mid, b - a, h, d, 1); if (sides & 2) boxW(mat2, c, yc, mid, b - a, h, d, 2); boxW(mat, c, yc, mid, b - a, h, d, 16 | 32);
          if (sol && solid) solidBox(b - a, Math.max(1.2, h), d, c, Math.max(0.6, yc), mid); }
        else {
          if (sides & 1) boxW(mat, mid, yc, c, d, h, b - a, 4); if (sides & 2) boxW(mat2, mid, yc, c, d, h, b - a, 8); boxW(mat, mid, yc, c, d, h, b - a, 16 | 32);
          if (sol && solid) solidBox(d, Math.max(1.2, h), b - a, mid, Math.max(0.6, yc), c); } };
      /* a reveal faces into its opening: +along at the opening's low end, -along at its high end */
      const reveal = (a, ya, yb, f) => { if (!reveals || yb - ya < 0.005) return;
        if (along === 'x') vquadX(mat, a, mid - hd, mid + hd, ya, yb, f); else vquadZ(mat, a, mid - hd, mid + hd, ya, yb, f); };
      for (const op of cuts) {
        piece(at, op.a0, y0, y1, true); piece(op.a0, op.a1, y0, op.y0, op.y0 > 0.3); piece(op.a0, op.a1, op.y1, y1, false);
        const ya = Math.max(y0, op.y0), yb = Math.min(y1, op.y1); reveal(op.a0, ya, yb, 1); reveal(op.a1, ya, yb, -1);
        at = op.a1; }
      piece(at, a1, y0, y1, true);
    }
    /* a flat card of painted light lying on a surface or standing in the air (never a light: v9.4) */
    const pools = [];
    function pool(x, y, z, w, h, color, opacity, o = {}) {
      const m = new THREE.MeshBasicMaterial({ map: o.map || poolTex, color, transparent: true, opacity, depthWrite: false, blending: o.add === false ? THREE.NormalBlending : THREE.AdditiveBlending, fog: o.fog !== false });
      if (ONEPASS) m.forceSinglePass = true; mats.push(m);
      const q = new THREE.Mesh(new THREE.PlaneGeometry(w, h), m); owned.push(q.geometry);
      q.position.set(x, y, z);
      if (o.rx != null) q.rotation.x = o.rx; else q.rotation.x = -Math.PI / 2;
      if (o.ry != null) q.rotation.y = o.ry; if (o.rz != null) q.rotation.z = o.rz;
      q.renderOrder = 2; (o.parent || world).add(q);
      const rec = { q, m, o0: opacity, look: o.look || null }; pools.push(rec); return rec;
    }
    /* a glow round a bulb or a flame, always facing the lens */
    function glow(x, y, z, s, color, opacity, parent = world, look = null) {
      const m = new THREE.SpriteMaterial({ map: glowTex, color, transparent: true, opacity, depthWrite: false, blending: THREE.AdditiveBlending });
      mats.push(m); const sp = new THREE.Sprite(m); sp.position.set(x, y, z); sp.scale.set(s, s, 1); parent.add(sp);
      const rec = { q: sp, m, o0: opacity, look }; pools.push(rec); return rec;
    }

    /* ---------------------------------------------- the groups: what the reflection copies (her flat's fabric and its
       things), what it must not (her front wall, which IS the mirror's plane), and each place's own */
    const herFlatG = new THREE.Group(); herFlatG.name = 'her flat'; world.add(herFlatG);
    const herThingsG = new THREE.Group(); herThingsG.name = 'her things'; world.add(herThingsG);
    const frontWallG = new THREE.Group(); frontWallG.name = 'her front wall'; world.add(frontWallG);
    const streetG = new THREE.Group(); streetG.name = 'the shophouse row'; world.add(streetG);
    const hisG = new THREE.Group(); hisG.name = 'his flat'; world.add(hisG);
    const cityG = new THREE.Group(); cityG.name = 'his city'; world.add(cityG);

    /* ================================================================ HER FLAT (the plan's 5.3) */
    const FLOOR_T = 0.3;                                   // her floor slab (the five-foot way's ceiling under it at -0.3)
    {
      const F = FRONT, H = F.ceil;
      /* the floors: old timber boards through the front room and the back room, terrazzo on the landing */
      floor(mBoards, F.x0 - 0.15, F.z0, F.x1, F.z1, 0);
      floor(mBoards, BACKR.x0, BACKR.z0, BACKR.x1 + 0.15, BACKR.z1, 0);
      floor(mTerrazzoGreen, LOBBY.x0, LOBBY.z0, LOBBY.x1, LOBBY.z1, 0);
      floor(mTerrazzoGreen, STAIR.top, STAIR.z0, STAIR.x0, STAIR.z1, 0);
      floor(mTerrazzoGreen, LOBBY.x0, STAIR.z1, STAIR.x0, LOBBY.z0, 0);                    // the landing's step through the party wall
      /* the ceilings (seen from inside) */
      ceilQ(mHerCeil, F.x0 - 0.15, F.z0, F.x1, F.z1, H);
      ceilQ(mHerCeil, BACKR.x0, BACKR.z0, BACKR.x1 + 0.15, BACKR.z1, H);
      ceilQ(mStairWhite, LOBBY.x0, STAIR.z1, LOBBY.x1, LOBBY.z1, H);
      /* her side walls (party walls: plain, their insides painted) */
      wallRun(mHerWall, 'x', F.z1 + 0.075, 0.15, BACKR.x0 - 0.15, F.x1, 0, H, [], { sides: 2 });          // +z (shared with the next unit)
      wallRun(mHerWall, 'x', F.z0 - 0.075, 0.15, LOBBY.x1, F.x1, 0, H, [], { sides: 3, mat2: mStairWhite });                  // -z (the stair bay beyond)
      /* THE BACK WALL of the front room (x -2.75..-2.9): her front door (z -2.85..-1.9), then the half wall (z -1.6..1.9,
         1.05 high, a timber cap), then the way through to the back room (z 1.9..3.0) */
      wallRun(mHerWall, 'z', F.x0 - 0.075, 0.15, F.z0, -1.6, 0, H, [{ a0: -2.85, a1: -1.9, y0: 0, y1: 2.12 }], { sides: 3, mat2: mStairWhite });
      wallRun(mHerWall, 'z', F.x0 - 0.075, 0.15, -1.6, 1.4, 0, 1.05, []);
      boxW(mTimber, F.x0 - 0.075, 1.07, -0.1, 0.22, 0.04, 3.0);
      wallRun(mHerWall, 'z', F.x0 - 0.075, 0.15, -1.6, 3.0, 2.55, H, [], { solid: false });                    // the bulkhead over the half wall and the way through
      /* the back room's walls: the back (x -5.6, the bedroom door at z -1.3..-0.36), its -z wall to the lobby and the
         bedroom beyond */
      wallRun(mHerWall, 'z', BACKR.x0 - 0.075, 0.15, BACKR.z0 - 0.15, BACKR.z1 + 0.15, 0, H, [{ a0: -1.3, a1: -0.36, y0: 0, y1: 2.12 }], { sides: 1 });
      wallRun(mHerWall, 'x', BACKR.z0 - 0.075, 0.15, BACKR.x0, BACKR.x1 + 0.15, 0, H, [], { sides: 3, mat2: mStairWhite });
      /* the lobby: its far end (x -4.1) and its wall to the stair bay (z -3.0..-3.15), open where the stair arrives */
      wallRun(mStairWhite, 'z', LOBBY.x0 - 0.075, 0.15, STAIR.z0 - 0.15, BACKR.z0 - 0.15, 0, H, [], { sides: 1 });
      wallRun(mStairWhite, 'x', F.z0 - 0.075, 0.15, STAIR.x0, LOBBY.x1, 0, H, []);
      /* the dado: the lobby's and the stair's old green gloss to 1.2 m, the white above (a band laid over the plain wall) */
      boxW(mStairGreen, LOBBY.x0 + 0.002, 0.6, (LOBBY.z0 + LOBBY.z1) / 2 - 0.6, 0.004, 1.2, LOBBY.z1 - LOBBY.z0 + 1.2, 4);
      boxW(mStairGreen, (LOBBY.x0 + LOBBY.x1) / 2, 0.6, BACKR.z0 - 0.152, LOBBY.x1 - LOBBY.x0, 1.2, 0.004, 2);
      boxW(mStairGreen, F.x0 - 0.152, 0.6, (LOBBY.z0 + LOBBY.z1) / 2, 0.004, 1.2, LOBBY.z1 - LOBBY.z0, 8);
      /* the skirting round the front room and the back room */
      boxW(mSkirtTimber, (F.x0 + F.x1) / 2, 0.05, F.z1 - 0.006, F.x1 - F.x0, 0.1, 0.012, 2);
      boxW(mSkirtTimber, (F.x0 + F.x1) / 2, 0.05, F.z0 + 0.006, F.x1 - F.x0, 0.1, 0.012, 1);
      /* her kitchenette along the back room's +z wall: base cabinets, a terrazzo worktop with a steel sink and a two-ring
         hob (the cabinet doors' lines drawn as their own thin pieces), wall cabinets over it */
      const KX0 = -4.8, KX1 = -3.3;
      boxW(mKitchen, (KX0 + KX1) / 2, 0.43, BACKR.z1 - 0.3, KX1 - KX0, 0.86, 0.58, 1 | 4 | 8);
      boxW(mWorktop, (KX0 + KX1) / 2, 0.88, BACKR.z1 - 0.31, KX1 - KX0 + 0.04, 0.04, 0.62, 63);
      for (let x = KX0 + 0.46; x < KX1 - 0.1; x += 0.46) boxW(mTimberDark, x, 0.43, BACKR.z1 - 0.008 - 0.58, 0.008, 0.8, 0.006, 1);
      boxW(mSteelSink, -3.75, 0.895, BACKR.z1 - 0.32, 0.6, 0.012, 0.42, 16);
      boxW(mKitchen, (KX0 + KX1) / 2, 1.85, BACKR.z1 - 0.18, KX1 - KX0, 0.7, 0.34, 1 | 4 | 8 | 32);
      solidXZ(KX0 - 0.05, BACKR.z1 - 0.62, KX1 + 0.02, BACKR.z1, 1.4);
      flush(herFlatG);
    }
    /* HER FRONT WALL: the façade's inside, its two tall timber windows (casements of glass, a fanlight over each) and their
       louvred shutters inside them; drawn apart from the rest (the reflection is built behind its glass, so a copy of it
       would lie on its own face). The shutters are the reflection's measure: the one nearest him, half closed, keeps the
       glass from ever having to show him, Grandmaster Pho, the cloth's candles or the lamp (the plan's 12) */
    const WIN = { A: { z0: -2.2, z1: -0.6 }, B: { z0: 0.6, z1: 2.2 }, sill: 0.42, head: 2.95, fan: 0.45 };
    const shutterLeaves = [];
    {
      const X = FRONT.x1, H = FRONT.ceil, T = 0.25;
      const opens = [WIN.A, WIN.B].map(w => ({ a0: w.z0, a1: w.z1, y0: WIN.sill, y1: WIN.head }));
      /* the wall, its inside painted, its outside the row's plaster (the façade is built in the street below) */
      wallRun(mHerWall, 'z', X + T / 2, T, FRONT.z0 - 0.15, FRONT.z1 + 0.15, 0, H, opens, { sides: 2 });
      for (const w of [WIN.A, WIN.B]) {
        const zm = (w.z0 + w.z1) / 2, fw = w.z1 - w.z0, fr = 0.06, xm = X + 0.12;
        /* the frame, the casements' meeting stile, the transom under the fanlight, and a sill board inside */
        boxW(mTimber, xm, WIN.sill + fr / 2, zm, 0.1, fr, fw, 63); boxW(mTimber, xm, WIN.head - fr / 2, zm, 0.1, fr, fw, 63);
        boxW(mTimber, xm, (WIN.sill + WIN.head) / 2, w.z0 + fr / 2, 0.1, WIN.head - WIN.sill, fr, 63); boxW(mTimber, xm, (WIN.sill + WIN.head) / 2, w.z1 - fr / 2, 0.1, WIN.head - WIN.sill, fr, 63);
        boxW(mTimber, xm, (WIN.sill + WIN.head - WIN.fan) / 2 + 0.0, zm, 0.09, WIN.head - WIN.fan - WIN.sill, 0.05, 63);
        boxW(mTimber, xm, WIN.head - WIN.fan, zm, 0.1, 0.06, fw, 63);
        boxW(mTimber, X - 0.03, WIN.sill - 0.02, zm, 0.1, 0.04, fw + 0.1, 63);
        /* the panes: the casements' glass (night: dark, the reflection behind), the fanlight's */
        quad(mPaneNight, [xm - 0.01, WIN.sill + fr, w.z1 - fr], [xm - 0.01, WIN.sill + fr, w.z0 + fr], [xm - 0.01, WIN.head - fr, w.z0 + fr], [xm - 0.01, WIN.head - fr, w.z1 - fr]);
        solidBox(0.12, 2.4, fw, xm, 1.2, zm);
      }
      flush(frontWallG);
      /* THE SHUTTERS: four louvred timber leaves (each 0.8 wide, hinged at the window's sides, folding into the room).
         A's two stand open (its -z leaf against the corner wall, its +z one at 75 degrees); B's -z leaf against the pier;
         B's +z leaf HALF CLOSED at 48 degrees: from where he kneels it covers B from z 1.4 to its end, so his reflection
         (it would fall at z 1.9 on the glass), Grandmaster Pho's (1.75..2.05) and the cloth's (1.5..1.7) are behind it,
         and the open glass from 0.6 to 1.4 holds the door corner, Marcus and Grace on the sofa (WORLD.md, the measure) */
      const leaf = (hz, sign, deg, name) => {
        const piv = new THREE.Group(); piv.position.set(X - 0.035, 0, hz); piv.name = 'shutter ' + name; frontWallG.add(piv);
        const g = new THREE.Group(); piv.add(g);
        const L = 0.8, h0 = WIN.sill + 0.02, h1 = WIN.head - WIN.fan - 0.02;
        const fr = new THREE.Mesh(new THREE.BoxGeometry(0.03, h1 - h0, L), mTimber); fr.position.set(-0.015, (h0 + h1) / 2, sign * L / 2); g.add(fr); owned.push(fr.geometry);
        const sl = new THREE.Mesh(new THREE.PlaneGeometry(L - 0.08, h1 - h0 - 0.12), mLouvre); sl.rotation.y = -Math.PI / 2; sl.position.set(-0.032, (h0 + h1) / 2, sign * L / 2); g.add(sl); owned.push(sl.geometry);
        const sl2 = sl.clone(); sl2.rotation.y = Math.PI / 2; sl2.position.x = 0.002; g.add(sl2);
        piv.rotation.y = sign * deg * Math.PI / 180;
        shutterLeaves.push({ name, piv, sign, deg });
        return piv;
      };
      leaf(WIN.A.z0, 1, 172, 'A-');  leaf(WIN.A.z1, -1, 75, 'A+');
      leaf(WIN.B.z0, 1, 172, 'B-');  leaf(WIN.B.z1, -1, 48, 'B+');
    }

    /* ================================================================ THE STAIR AND THE LANDING (the plan's 5.2): a narrow
       straight terrazzo stair from the street door up to her landing, one fluorescent tube, old green paint */
    const STAIR_RISE = -GY / STAIR.risers, STAIR_RUN = 0.235;
    {
      const Z0 = STAIR.z0, Z1 = STAIR.z1;
      for (let i = 1; i < STAIR.risers; i++) {
        const xa = STAIR.x1 - (i - 1) * STAIR_RUN, xb = STAIR.x1 - i * STAIR_RUN, y = GY + i * STAIR_RISE;
        boxW(mTerrazzoGreen, (xa + xb) / 2 - 0.01, y - 0.02, (Z0 + Z1) / 2, STAIR_RUN + 0.02, 0.04, Z1 - Z0, 16);
        quad(mTerrazzoGreen, [xa, y - STAIR_RISE, Z1], [xa, y - STAIR_RISE, Z0], [xa, y, Z0], [xa, y, Z1], Z0, y - STAIR_RISE);   // the riser (faces +x, down the stair)
        boxW(mTerrazzoGreen, (xa + xb) / 2, y - 0.04, Z1 - 0.002, STAIR_RUN, 0.08, 0.004, 2);
      }
      quad(mTerrazzoGreen, [STAIR.x0, -STAIR_RISE, Z1], [STAIR.x0, -STAIR_RISE, Z0], [STAIR.x0, 0, Z0], [STAIR.x0, 0, Z1]);
      /* the underside of the flight (seen from the street door) */
      quad(mStairWhite, [STAIR.x1, GY, Z0], [STAIR.x1, GY, Z1], [STAIR.x0, -0.25, Z1], [STAIR.x0, -0.25, Z0]);
      /* the bay's two walls, green to the dado and white above, from the street's level to her ceiling */
      wallRun(mStairWhite, 'x', Z0 - 0.075, 0.15, STAIR.top - 0.15, FRONT.x1, GY, FRONT.ceil, [], { solid: false, sides: 1 });
      wallRun(mStairWhite, 'x', Z1 + 0.075, 0.15, STAIR.x0, STREET.shop, GY, 0, [], { solid: false, sides: 2 });
      for (let i = 0; i < 4; i++) { const xa = STREET.shop - i * 1.1, xb = Math.max(STAIR.x0 - 0.8, xa - 1.1), ya = GY + Math.max(0, (STAIR.x1 - xa) / STAIR_RUN) * STAIR_RISE, yb = GY + Math.max(0, (STAIR.x1 - xb) / STAIR_RUN) * STAIR_RISE;
        quad(mStairGreen, [xb, yb, Z0 + 0.003], [xa, ya, Z0 + 0.003], [xa, ya + 1.2, Z0 + 0.003], [xb, yb + 1.2, Z0 + 0.003]);   // (faces +z: into the bay)
        quad(mStairGreen, [xa, ya, Z1 - 0.003], [xb, yb, Z1 - 0.003], [xb, yb + 1.2, Z1 - 0.003], [xa, ya + 1.2, Z1 - 0.003]); }
      boxW(mStairGreen, STAIR.top + 0.003, 0.6, (Z0 + Z1) / 2, 0.006, 1.2, Z1 - Z0, 4);

      /* the stairwell's front over the shop front's line: a wall with a small window onto the street, and the slab over the
         flight's foot (the five-foot way's ceiling beyond it) */
      wallRun(mStairWhite, 'z', FRONT.x1 + 0.125, 0.25, Z0 - 0.15, Z1, 0, FRONT.ceil, [{ a0: Z0 + 0.25, a1: Z1 - 0.25, y0: 0.9, y1: 2.3 }], { solid: false, sides: 2 });
      quad(mPaneOut, [FRONT.x1 + 0.12, 0.9, Z0 + 0.25], [FRONT.x1 + 0.12, 0.9, Z1 - 0.25], [FRONT.x1 + 0.12, 2.3, Z1 - 0.25], [FRONT.x1 + 0.12, 2.3, Z0 + 0.25]);
      floor(mTerrazzoGreen, STREET.shop, Z0, FRONT.x1, Z1, 0);                                  // the bay's floor over the five-foot way, behind its window
      vquadX(mStairWhite, STREET.shop, Z0, Z1, -0.3, 0, 1);                                        // the slab's edge over the flight's foot
      ceilQ(mStairWhite, STAIR.top, Z0, FRONT.x1, Z1, FRONT.ceil);
      /* the street door's frame in the shop front's line (its leaf is a model: below) */
      boxW(mTimberDark, STREET.shop, GY + 1.07, STAIR.z0 + 0.03, 0.14, 2.14, 0.06); boxW(mTimberDark, STREET.shop, GY + 1.07, STAIR.z1 - 0.03, 0.14, 2.14, 0.06);
      boxW(mTimberDark, STREET.shop, GY + 2.17, (Z0 + Z1) / 2, 0.14, 0.08, Z1 - Z0);
      boxW(mStairWhite, STREET.shop, (GY + 2.21 - 0.3) / 2, (Z0 + Z1) / 2, 0.15, -0.3 - (GY + 2.21), Z1 - Z0, 1 | 2 | 4 | 8 | 32);
      /* her door's frame on the landing side */
      boxW(mTimberDark, FRONT.x0 - 0.16, 1.06, -2.88, 0.04, 2.14, 0.06); boxW(mTimberDark, FRONT.x0 - 0.16, 1.06, -1.87, 0.04, 2.14, 0.06);
      boxW(mTimberDark, FRONT.x0 - 0.16, 2.15, -2.375, 0.04, 0.06, 1.07);
      boxW(mTimberDark, FRONT.x0 + 0.005, 1.06, -2.88, 0.02, 2.14, 0.06); boxW(mTimberDark, FRONT.x0 + 0.005, 1.06, -1.87, 0.02, 2.14, 0.06);
      boxW(mTimberDark, FRONT.x0 + 0.005, 2.15, -2.375, 0.02, 0.06, 1.07);
      flush(herFlatG);
    }

    /* ================================================================ THE SHOPHOUSE ROW AND ITS STREET AT BLUE HOUR (the
       plan's 5.1): built deep enough for the opening's one crane shot (9.1: from 7 m up and 6 m out down to the five-foot
       way at Marcus). Generic signs only (v9.3); every window real: glass, a frame, and behind it either closed louvres
       or a plain dark room (R108) */
    const UNIT = 6.0;                                                    // a unit's frontage up and down the row
    const UNITS = [];                                                    // [{ z0, z1, her }] her unit -4.45..3.15
    { let z = -4.45; while (z > -40) { UNITS.unshift({ z0: z - UNIT, z1: z }); z -= UNIT; }
      UNITS.push({ z0: -4.45, z1: 3.15, her: true });
      z = 3.15; while (z < 40) { UNITS.push({ z0: z, z1: z + UNIT }); z += UNIT; } }
    const SIDE = { near: { face: STREET.face, n: 1, shop: STREET.shop, back: -12 }, far: { face: STREET.across, n: -1, shop: STREET.across + 1.85, back: 24 } };
    const UP_TOP = FRONT.ceil + 0.5;                                     // the façade's cornice over the upper floor
    {
      const rr = rng(51040);
      /* THE ROAD: asphalt between the kerbs, its lines (a broken centre line, double yellow kerb lines: no stopping) */
      floor(mAsphalt, STREET.kerb, -40, STREET.across - 0.55, 40, GY - 0.15);
      for (let z = -40; z < 40; z += 6) boxW(mLine, (STREET.road[0] + STREET.road[1]) / 2, GY - 0.148, z + 1.5, 0.12, 0.004, 3.0, 16);
      for (const xo of [0.25, 0.4]) { boxW(mYellow, STREET.kerb + xo, GY - 0.148, 0, 0.08, 0.004, 80, 16); boxW(mYellow, STREET.road[1] - xo, GY - 0.148, 0, 0.08, 0.004, 80, 16); }
      for (const S0 of [SIDE.near, SIDE.far]) {
        const n = S0.n, F0 = S0.face;
        /* the drain and the kerb in front of the five-foot way (a grating over the drain), the five-foot way, its soffit */
        const kx0 = n > 0 ? F0 : STREET.road[1], kx1 = n > 0 ? STREET.kerb : F0;
        floor(mGrate, kx0, -40, kx1, 40, GY - 0.03);
        vquadX(mKerb, n > 0 ? kx1 : kx0, -40, 40, GY - 0.15, GY - 0.03, n);
        const fx0 = n > 0 ? S0.shop : F0, fx1 = n > 0 ? F0 : S0.shop;
        floor(mFiveFoot, fx0, -40, fx1, 40, GY);
        ceilQ(mSoffit, fx0, -40, fx1, 40, -0.3);
        for (const U of UNITS) {
          const mat = U.her && n > 0 ? mFacades[0] : mFacades[(rr() * mFacades.length) | 0];
          const zc = (U.z0 + U.z1) / 2, wz = U.z1 - U.z0;
          /* the pillar at each unit's end, from the five-foot way up to the cornice */
          const px = F0 - n * 0.225;
          boxW(mat, px, (GY + UP_TOP) / 2, U.z0, 0.45, UP_TOP - GY, 0.5, n > 0 ? (4 | 1 | 2) : (8 | 1 | 2));
          /* the upper façade (its outside), with its windows' openings; the cornice and a string course */
          if (!(U.her && n > 0)) {
            const wins = [{ a0: zc - wz * 0.36, a1: zc - wz * 0.1 }, { a0: zc + wz * 0.1, a1: zc + wz * 0.36 }];
            const opens = wins.map(w => ({ a0: w.a0, a1: w.a1, y0: WIN.sill, y1: WIN.head }));
            const xmid = F0 - n * 0.125;
            /* the face toward the street only (the inside of a neighbour's room is never seen) */
            wallRun(mat, 'z', xmid, 0.25, U.z0 + 0.25, U.z1 - 0.25, -0.3, UP_TOP, opens, { solid: false, sides: n > 0 ? 1 : 2 });
            for (const w of wins) {
              const zm = (w.a0 + w.a1) / 2, ww = w.a1 - w.a0, inX = F0 - n * 0.2, kind = rr();
              vquadX(mPaneOut, inX, w.a0, w.a1, WIN.sill, WIN.head, n);
              const backX = F0 - n * (kind < 0.55 ? 0.24 : 0.55);
              const m2 = kind < 0.55 ? (kind < 0.12 ? mLitRoom : mLouvre) : mDarkRoom;
              vquadX(m2, backX, w.a0, w.a1, WIN.sill, WIN.head, n);
              boxW(mMoulding, F0 + n * 0.03, WIN.sill - 0.05, zm, 0.06, 0.1, ww + 0.2, 63);
              boxW(mMoulding, F0 + n * 0.03, WIN.head + 0.08, zm, 0.06, 0.16, ww + 0.2, 63);
            }
          }
          boxW(mMoulding, F0 + n * 0.08, UP_TOP - 0.2, zc, 0.22, 0.4, wz, 63);
          boxW(mMoulding, F0 + n * 0.04, -0.15, zc, 0.12, 0.3, wz, 63);
          /* the shop front under it: a roller shutter down (closed for the night), its box over it; her coffee shop has its
             own front, below */
          if (!(U.her && n > 0)) {
            const sx = S0.shop, a = U.z0 + 0.25, b = U.z1 - 0.25;
            vquadX(mShutter, sx, a, b, GY, -0.55, n);
            boxW(mFacades[(rr() * 5) | 0], sx + n * 0.12, -0.42, zc, 0.24, 0.26, wz - 0.5, 63);
            vquadX(mat, sx, a, b, -0.55, -0.3, n);
          }
        }
        /* the roof: clay tiles from the cornice back to the ridge, a parapet's top */
        const rx0 = F0 - n * 0.3, rx1 = F0 - n * 6.5, ridge = UP_TOP + 2.6;
        quad(mRoof, [rx0, UP_TOP - 0.05, n > 0 ? 40 : -40], [rx0, UP_TOP - 0.05, n > 0 ? -40 : 40], [rx1, ridge, n > 0 ? -40 : 40], [rx1, ridge, n > 0 ? 40 : -40]);
        quad(mRoof, [rx1, ridge, n > 0 ? 40 : -40], [rx1, ridge, n > 0 ? -40 : 40], [F0 - n * 13, UP_TOP - 0.6, n > 0 ? -40 : 40], [F0 - n * 13, UP_TOP - 0.6, n > 0 ? 40 : -40]);
      }
      /* HER UNIT'S UPPER FAÇADE, outside: its plaster round her two windows (their frames and panes are her front wall's,
         above), the stair bay's small window, the mouldings */
      {
        const F0 = STREET.face, mat = mFacades[0];
        wallRun(mat, 'z', F0 - 0.01, 0.02, -4.2, 2.9, -0.3, UP_TOP, [WIN.A, WIN.B].map(w => ({ a0: w.z0, a1: w.z1, y0: WIN.sill, y1: WIN.head })).concat([{ a0: STAIR.z0 + 0.25, a1: STAIR.z1 - 0.25, y0: 0.9, y1: 2.3 }]), { solid: false, sides: 1, reveals: false });
        for (const w of [WIN.A, WIN.B, { z0: STAIR.z0 + 0.25, z1: STAIR.z1 - 0.25 }]) {
          const zm = (w.z0 + w.z1) / 2, ww = w.z1 - w.z0, top = w === WIN.A || w === WIN.B ? WIN.head : 2.3, bot = w === WIN.A || w === WIN.B ? WIN.sill : 0.9;
          boxW(mMoulding, F0 + 0.03, bot - 0.05, zm, 0.06, 0.1, ww + 0.2, 63);
          boxW(mMoulding, F0 + 0.03, top + 0.08, zm, 0.06, 0.16, ww + 0.2, 63);
        }
        /* the stair bay's window from outside: a dark stairwell behind it (lit by the tube when it is on: painted) */
        /* (the bay behind it is built: its floor, its walls, its ceiling, the tube's light on them) */
      }
      /* THE COFFEE SHOP BELOW HER (x -4.0..1.15, z -3.0..3.0), CLOSING: its roller shutter half down, the floor tiles, a
         plain counter at the back, its walls; its chairs stacked for the night and its tube light (models, below); the sign
         over the five-foot way */
      {
        const X0 = -4.0, X1 = STREET.shop, Z0 = -3.0, Z1 = 3.0, Y = GY;
        floor(mShopFloor, X0, Z0, X1, Z1, Y);
        ceilQ(mShopWall, X0, Z0, X1, Z1, -0.3);
        wallRun(mShopWall, 'z', X0 - 0.075, 0.15, Z0, Z1, Y, -0.3, [], { solid: false, sides: 1 });
        wallRun(mShopWall, 'x', Z0 - 0.075, 0.15, X0, X1, Y, -0.3, [], { solid: false, sides: 1 });
        wallRun(mShopWall, 'x', Z1 + 0.075, 0.15, X0, X1, Y, -0.3, [], { solid: false, sides: 2 });
        boxW(mKitchen, X0 + 0.45, Y + 0.5, 0.2, 0.6, 1.0, 3.6, 63);                       // the drinks counter
        boxW(mWorktop, X0 + 0.45, Y + 1.02, 0.2, 0.66, 0.04, 3.66, 63);
        /* the roller shutter: half down over the open front, its box */
        vquadX(mShutter, X1 + 0.02, Z0 + 0.1, Z1 - 0.1, Y + 1.55, -0.55, 1);
        boxW(mShutter, X1 + 0.02, Y + 1.53, 0, 0.05, 0.05, Z1 - Z0 - 0.2, 63);
        boxW(mFacades[0], X1 + 0.14, -0.42, 0, 0.24, 0.26, Z1 - Z0, 63);
        vquadX(mSign, STREET.face + 0.02, Z0 + 0.3, Z1 - 0.3, -0.28, 0.32, 1, true);
      }
      /* the blocks that close the street's two ends (a cross street's corner), their windows real */
      for (const zE of [-44, 44]) { const f = zE < 0 ? 1 : -1, mat = mFacades[zE < 0 ? 3 : 1];
        boxW(mat, 8.6, GY + 7.5, zE - f * 4, 30, 15, 8, 63);
        for (let i = 0; i < 7; i++) for (let j = 0; j < 3; j++) { const x0 = -5.5 + i * 4.2, y0 = GY + 4.2 + j * 3.4;
          vquadZ(rr() < 0.25 ? mLitRoom : mDarkRoom, zE + f * 0.02, x0, x0 + 1.6, y0, y0 + 1.9, f);
          boxW(mMoulding, x0 + 0.8, y0 - 0.06, zE + f * 0.05, 1.8, 0.1, 0.1, 63); } }
      flush(streetG);
    }

    /* ================================================================ HIS HOME (the plan's 5.4): a high-floor condominium
       flat at night and at dawn. New on purpose: episode 3 chapter 5's night was his HDB bedroom, and this must not look
       like it */
    {
      const H = FLAT.ceil;
      /* the floors: large porcelain tiles through the flat, the bathroom's own tiles, the corridor's carpet, the balcony */
      floor(mPorcelain, LIV.x0, LIV.z0, LIV.x1, LIV.z1, 0);
      floor(mPorcelain, PASS.x0, PASS.z0, PASS.x1, PASS.z1, 0);
      floor(mPorcelain, BED.x0, BED.z0, BED.x1, BED.z1, 0);
      floor(mBathTile, BATH.x0, BATH.z0, BATH.x1, BATH.z1, 0);
      floor(mCarpet, CORR.x0, CORR.z0, CORR.x1, CORR.z1, 0);
      floor(mPorcelain, BALC.x0, BALC.z0, BALC.x1, BALC.z1, -0.05);
      /* the ceilings */
      for (const R of [LIV, PASS, BED]) ceilQ(mHisCeil, R.x0, R.z0, R.x1, R.z1, H);
      ceilQ(mBathTile, BATH.x0, BATH.z0, BATH.x1, BATH.z1, 2.4);
      ceilQ(mCorrWall, CORR.x0, CORR.z0, CORR.x1, CORR.z1, 2.6);
      ceilQ(mSlab, BALC.x0, BALC.z0, BALC.x1, BALC.z1, H);
      /* THE LIVING ROOM'S WALLS: -x (the altar's), -z with his front door (x -4.2..-3.4) and the kitchen along it, +x with
         the passage's opening (z 0.2..1.8); the glass on +z is below */
      wallRun(mHisWall, 'z', LIV.x0 - 0.075, 0.15, LIV.z0 - 0.15, LIV.z1, 0, H, [], { sides: 1 });
      wallRun(mHisWall, 'x', LIV.z0 - 0.075, 0.15, LIV.x0 - 0.15, LIV.x1 + 0.15, 0, H, [{ a0: HX - 4.2, a1: HX - 3.4, y0: 0, y1: 2.12 }], { sides: 3, mat2: mCorrWall });
      wallRun(mHisWall, 'z', LIV.x1 + 0.075, 0.15, LIV.z0 - 0.15, LIV.z1, 0, H, [{ a0: PASS.z0, a1: PASS.z1, y0: 0, y1: 2.3 }], { sides: 2 });
      /* the passage's walls, the bedroom's: -x with its door (z 0.75..1.65), -z to the bathroom (its door x 5.1..5.8,
         open on the light), +x the bed's wall */
      wallRun(mHisWall, 'x', PASS.z0 - 0.075, 0.15, PASS.x0, PASS.x1, 0, H, [], { sides: 1 });
      wallRun(mHisWall, 'x', PASS.z1 + 0.075, 0.15, PASS.x0, PASS.x1, 0, H, [], { sides: 2 });
      wallRun(mHisWall, 'z', BED.x0 - 0.075, 0.15, BED.z0 - 0.15, BED.z1, 0, H, [{ a0: 0.75, a1: 1.65, y0: 0, y1: 2.12 }], { sides: 3 });
      wallRun(mHisWall, 'x', BED.z0 - 0.075, 0.15, BED.x0 - 0.15, BED.x1 + 0.15, 0, H, [{ a0: HX + 5.1, a1: HX + 5.8, y0: 0, y1: 2.12 }], { sides: 3, mat2: mBathTile });
      wallRun(mHisWall, 'z', BED.x1 + 0.075, 0.15, BED.z0 - 0.15, BED.z1, 0, H, [], { sides: 2 });
      wallRun(mBathTile, 'z', BATH.x0 - 0.075, 0.15, BATH.z0, BATH.z1, 0, H, [], { sides: 1 });
      wallRun(mBathTile, 'z', BATH.x1 + 0.075, 0.15, BATH.z0, BATH.z1, 0, H, [], { sides: 2 });
      wallRun(mBathTile, 'x', BATH.z0 - 0.075, 0.15, BATH.x0, BATH.x1, 0, H, [], { sides: 1 });
      boxW(mGlassHis, HX + 5.0, 1.0, BATH.z0 + 0.55, 0.01, 2.0, 1.1, 4 | 8);              // the shower's glass
      /* the skirting */
      boxW(mHisSkirt, (LIV.x0 + LIV.x1) / 2, 0.04, LIV.z0 + 0.006, LIV.x1 - LIV.x0, 0.08, 0.012, 1);
      boxW(mHisSkirt, LIV.x0 + 0.006, 0.04, 0, 0.012, 0.08, LIV.z1 - LIV.z0, 4);
      /* THE KITCHEN COUNTER along the -z wall (x -0.5..2.9): gloss fronts, a dark stone top, a sink and its tap, a built-in
         oven with its clock (ending B reads 3:41 on it: `ovenClock`), the drawer the pills are in (ending C), the wall
         cabinets; a tall cabinet at its end (the fridge built in) */
      const KX0 = HX - 0.5, KX1 = HX + 2.3, KZ = LIV.z0 + 0.31;
      boxW(mGloss, (KX0 + KX1) / 2, 0.44, KZ, KX1 - KX0, 0.88, 0.6, 1 | 4 | 8);
      boxW(mStoneTop, (KX0 + KX1) / 2, 0.9, KZ, KX1 - KX0 + 0.02, 0.04, 0.64, 63);
      for (let x = KX0 + 0.6; x < KX1 - 0.1; x += 0.6) boxW(mAlu, x, 0.44, KZ + 0.302, 0.006, 0.82, 0.004, 1);
      boxW(mAlu, HX + 0.1, 0.76, KZ + 0.302, 0.5, 0.012, 0.004, 1);                        // the drawer's pull (ending C's drawer, its front x -0.2..0.4)
      boxW(mSteelSink, HX + 0.95, 0.925, KZ, 0.55, 0.01, 0.4, 16);
      bar(mAlu, [HX + 0.95, 0.92, KZ - 0.24], [HX + 0.95, 1.2, KZ - 0.24], 0.012);
      bar(mAlu, [HX + 0.95, 1.2, KZ - 0.24], [HX + 0.95, 1.2, KZ - 0.06], 0.012);
      boxW(mStoneTop, HX + 1.75, 0.5, KZ + 0.3, 0.58, 0.58, 0.01, 1);                          // the oven's glass door
      boxW(mGloss, (KX0 + KX1) / 2, 1.95, LIV.z0 + 0.18, KX1 - KX0, 0.7, 0.34, 1 | 4 | 8 | 32);
      boxW(mGloss, HX + 2.62, 1.2, KZ, 0.62, 2.4, 0.6, 1 | 4 | 8 | 16);
      boxW(mAlu, HX + 2.36, 1.2, KZ + 0.302, 0.012, 0.5, 0.004, 1);
      solidXZ(KX0 - 0.02, LIV.z0, HX + 2.95, LIV.z0 + 0.62, 1.4);
      /* HIS GLASS on +z: floor-to-ceiling panes in aluminium, the sliding door to the balcony (x -0.7..0.8, its moving
         panel the -x one: `balconyDoor`), the bedroom's glass the same */
      for (const [x0, x1] of [[LIV.x0, LIV.x1], [BED.x0, BED.x1]]) {
        boxW(mAlu, (x0 + x1) / 2, 0.03, LIV.z1, x1 - x0, 0.06, 0.12, 63); boxW(mAlu, (x0 + x1) / 2, H - 0.03, LIV.z1, x1 - x0, 0.06, 0.12, 63);
        for (let x = x0; x <= x1 + 1e-6; x += (x1 - x0) / Math.round((x1 - x0) / 1.25)) boxW(mAlu, x, H / 2, LIV.z1, 0.06, H, 0.1, 63);
      }
      boxW(mHisWall, (LIV.x1 + BED.x0) / 2, H / 2, LIV.z1 - 0.075 + 0.075, BED.x0 - LIV.x1, H, 0.3, 1 | 16);   // the wall between his two glass walls (the passage's end)
      /* the balcony: its slab's edge, the glass balustrade and its rail, the slab's soffit seen from below by nobody */
      boxW(mSlab, (BALC.x0 + BALC.x1) / 2, -0.2, BALC.z1, BALC.x1 - BALC.x0, 0.3, 0.12, 63);
      boxW(mAlu, (BALC.x0 + BALC.x1) / 2, BALC.rail, BALC.z1 - 0.04, BALC.x1 - BALC.x0, 0.05, 0.06, 63);
      boxW(mGlassHis, (BALC.x0 + BALC.x1) / 2, BALC.rail / 2, BALC.z1 - 0.04, BALC.x1 - BALC.x0, BALC.rail - 0.05, 0.01, 1 | 2);
      wallRun(mCorrWall, 'x', LIV.z0 - 0.075, 0.15, CORR.x0, LIV.x0 - 0.15, 0, 2.6, [], { solid: false, sides: 2 });   // the corridor's near wall past his flat
      for (const x of [BALC.x0, BALC.x1]) boxW(mSlab, x, H / 2, (BALC.z0 + BALC.z1) / 2, 0.25, H + 0.3, BALC.z1 - BALC.z0 + 0.12, 63);
      solidXZ(LIV.x0, LIV.z1 - 0.06, BED.x1, LIV.z1 + 0.06, 2.6);                            // the glass is solid in play (ending D's door is a film's)
      /* THE CORRIDOR: the carpet, its walls, the window at its end over the city, his neighbours' doors (models) */
      wallRun(mCorrWall, 'x', CORR.z0 - 0.075, 0.15, CORR.x0, CORR.x1, 0, 2.6, [], { solid: false, sides: 1 });
      wallRun(mCorrWall, 'z', CORR.x1 + 0.075, 0.15, CORR.z0, CORR.z1, 0, 2.6, [], { solid: false, sides: 2 });
      wallRun(mCorrWall, 'z', CORR.x0 - 0.075, 0.15, CORR.z0, CORR.z1, 0, 2.6, [{ a0: CORR.z0 + 0.3, a1: CORR.z1 - 0.3, y0: 0.8, y1: 2.3 }], { solid: false, sides: 1 });
      quad(mGlassHis, [CORR.x0 - 0.075, 0.8, CORR.z0 + 0.3], [CORR.x0 - 0.075, 0.8, CORR.z1 - 0.3], [CORR.x0 - 0.075, 2.3, CORR.z1 - 0.3], [CORR.x0 - 0.075, 2.3, CORR.z0 + 0.3]);
      boxW(mVeneer, HX - 3.8, 2.16, LIV.z0 - 0.15, 0.92, 0.08, 0.04, 63);                   // his door's head
      boxW(mAlu, HX - 3.32, 1.05, LIV.z0 - 0.16, 0.06, 0.12, 0.02, 63);                     // the keycard reader beside it
      /* HIS BLOCK'S FACE round his windows (the neighbours' balconies beside and over and under his, the tower's walls),
         seen from his balcony and along his glass */
      for (let k = -3; k <= 3; k++) {
        const y = k * 3.0;
        for (const [x0, x1] of [[HX - 16, HX - 4.85], [HX + 8.45, HX + 18], [BALC.x0, BALC.x1]]) {
          if (k === 0 && x0 === BALC.x0) continue;
          boxW(mSlab, (x0 + x1) / 2, y - 0.2, (BALC.z0 + BALC.z1) / 2, x1 - x0, 0.3, BALC.z1 - BALC.z0, 63);
          boxW(mAlu, (x0 + x1) / 2, y + BALC.rail, BALC.z1 - 0.04, x1 - x0, 0.05, 0.06, 63);
          boxW(mGlassHis, (x0 + x1) / 2, y + BALC.rail / 2, BALC.z1 - 0.04, x1 - x0, BALC.rail - 0.05, 0.01, 1);
          if (k !== 0) boxW(mDarkRoom, (x0 + x1) / 2, y + 1.4, LIV.z1 + 0.02, x1 - x0, 2.8, 0.02, 1);
        }
        if (k !== 0) boxW(mDarkRoom, (BED.x0 + BED.x1) / 2, y + 1.4, LIV.z1 + 0.02, BED.x1 - BED.x0, 2.8, 0.02, 1);
      }
      boxW(mSlab, HX - 4.75, 0, 3.0, 0.3, 24, 3.0, 63); boxW(mSlab, HX + 8.35, 0, 3.0, 0.3, 24, 3.0, 63);
      flush(hisG);
    }

    /* ================================================================ HIS CITY (the plan's 5.4; R108: no painted windows).
       Towers as built slabs with every window its own pane (one instanced mesh: a pane each, lit warm, lit cool or dark,
       how many lit set by the look), an expressway far below with its lamps and its moving lights, the pool's glow at the
       foot of his block, the ground. All inside 155 m of his glass (the far plane, v8.9) */
    const towerWins = [];                                                // [x, y, z, ry, w, h] of every window pane
    const TOWERS = [];
    {
      const r = rng(51050);
      const sites = [];
      for (let i = 0; i < 26; i++) {
        let x, z, ok = false;
        for (let tries = 0; tries < 30 && !ok; tries++) {
          x = HX + (r() * 2 - 1) * 118; z = 24 + r() * 108;
          ok = Math.hypot(x - HX, z) < 150 && sites.every(s => Math.hypot(s[0] - x, s[1] - z) > 26);
        }
        if (!ok) continue;
        sites.push([x, z]);
      }
      /* (and a few to his corridor's west, seen through its end window) */
      for (const [dx, dz] of [[-60, -18], [-92, 12], [-74, 40]]) sites.push([HX + dx, dz]);
      for (const [x, z] of sites) {
        const w = 18 + r() * 14, d = 16 + r() * 12, top = -10 + r() * 70, ry = (r() - 0.5) * 0.5;
        TOWERS.push({ x, z, w, d, top, ry });
        const mat = mTower[(r() * mTower.length) | 0];
        /* the slab (its faces drawn turned by its own turn) */
        const c = Math.cos(ry), s = Math.sin(ry), hw = w / 2, hd = d / 2, P = (lx, y, lz) => [x + lx * c + lz * s, y, z - lx * s + lz * c];
        const ya = GH, yb = top;
        quad(mat, P(-hw, ya, hd), P(hw, ya, hd), P(hw, yb, hd), P(-hw, yb, hd));
        quad(mat, P(hw, ya, hd), P(hw, ya, -hd), P(hw, yb, -hd), P(hw, yb, hd));
        quad(mat, P(hw, ya, -hd), P(-hw, ya, -hd), P(-hw, yb, -hd), P(hw, yb, -hd));
        quad(mat, P(-hw, ya, -hd), P(-hw, ya, hd), P(-hw, yb, hd), P(-hw, yb, -hd));
        quad(mat, P(-hw, yb, hd), P(hw, yb, hd), P(hw, yb, -hd), P(-hw, yb, -hd));
        /* its windows: 1.5 x 1.7 panes on a 3.2 x 3.0 m grid, on every face, a hair proud of it */
        const faces = [[0, hd, 0], [Math.PI / 2, hw, 1], [Math.PI, hd, 0], [-Math.PI / 2, hw, 1]];
        for (const [fr, off, side] of faces) {
          const span = side ? d : w, cols = Math.floor((span - 2) / 3.2), rows = Math.floor((yb - ya - 6) / 3.0);
          for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
            const u = -((cols - 1) * 3.2) / 2 + i * 3.2, y = ya + 4.5 + j * 3.0;
            const lx = fr === 0 ? u : fr === Math.PI ? -u : (fr > 0 ? off + 0.03 : -off - 0.03), lz = fr === 0 ? off + 0.03 : fr === Math.PI ? -off - 0.03 : (fr > 0 ? -u : u);
            const p = P(lx, y, lz); towerWins.push([p[0], p[1], p[2], ry + fr, 1.5, 1.7]);
          }
        }
        /* a red aviation lamp on the tallest roofs (painted) */
        if (top > 30) glow(x, top + 1.2, z, 2.2, 0xff2a20, 0.9, cityG, 'city');
      }
      /* the ground under the city, and his block's own foot: the pool (lit from inside), its deck, a path */
      floor(mGround, HX - 160, -20, HX + 160, 160, GH);
      floor(mDeck, HX - 9, 9, HX + 13, 27, GH + 0.02);
      /* THE EXPRESSWAY far below: a raised deck crossing the view (z 72..90), its parapets */
      const EZ = 78, EY = GH + 7.5;
      floor(mRoadFar, HX - 150, EZ - 9, HX + 150, EZ + 9, EY);
      boxW(mSlab, HX, EY - 0.6, EZ - 9, 300, 1.2, 0.4, 63); boxW(mSlab, HX, EY - 0.6, EZ + 9, 300, 1.2, 0.4, 63);
      for (let x = HX - 140; x <= HX + 140; x += 28) boxW(mSlab, x, (GH + EY) / 2, EZ, 3, EY - GH, 8, 63);
      flush(cityG);
      const pg = new THREE.Mesh(new THREE.PlaneGeometry(18, 8), mPool); pg.rotation.x = -Math.PI / 2; pg.position.set(HX + 2, GH + 0.05, 18); cityG.add(pg); owned.push(pg.geometry);
      pool(HX + 2, GH + 0.08, 18, 26, 14, 0x5ae0e8, 0.5, { parent: cityG, look: 'night' });
      /* the expressway's lamps (orange, both edges, every 30 m) */
      for (let x = HX - 140; x <= HX + 140; x += 30) for (const z of [EZ - 8.6, EZ + 8.6]) glow(x, EY + 9, z, 5.0, 0xffa040, 0.85, cityG, 'night');
    }
    /* THE TOWERS' WINDOWS: every pane one instance (two triangles a window, one draw for the whole city) */
    const winGeo = new THREE.PlaneGeometry(1, 1); owned.push(winGeo);
    const winMat = B({ color: 0xffffff });
    const winIM = new THREE.InstancedMesh(winGeo, winMat, towerWins.length); winIM.name = 'the city windows'; owned.push(winIM);
    {
      const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), p = new THREE.Vector3(), sc = new THREE.Vector3(), up = new THREE.Vector3(0, 1, 0);
      towerWins.forEach(([x, y, z, ry, w, h], i) => { q.setFromAxisAngle(up, ry); m4.compose(p.set(x, y, z), q, sc.set(w, h, 1)); winIM.setMatrixAt(i, m4); });
      winIM.instanceMatrix.needsUpdate = true; winIM.frustumCulled = false; cityG.add(winIM);
    }
    const winSeed = towerWins.map((_, i) => { let s = (i * 2654435761) >>> 0; s ^= s >>> 13; s = (s * 1274126177) >>> 0; return (s >>> 8) / 16777216; });
    const winKind = towerWins.map((_, i) => ((i * 40503) >>> 0) % 7);
    const _wc = new THREE.Color();
    /* how many of the city's windows are lit, and in which colours, by the look: a quarter at 11:52, one in nine at three,
       none at dawn (the glass then the morning's pale) */
    function cityWindows(look) {
      const lit = look === 'HOME' ? 0.27 : look === 'NIGHT' ? 0.11 : look === 'DAWN' ? 0 : 0.22;
      for (let i = 0; i < towerWins.length; i++) {
        const on = winSeed[i] < lit;
        if (look === 'DAWN') _wc.setHex(winKind[i] < 3 ? 0x9cb0c4 : 0x8496aa);
        else if (on) _wc.setHex(winKind[i] < 4 ? 0xe8b878 : winKind[i] < 6 ? 0xd8dcd8 : 0x9fc0e8).multiplyScalar(0.55 + 0.45 * winSeed[(i * 7) % towerWins.length]);
        else _wc.setHex(0x14181f);
        winIM.setColorAt(i, _wc);
      }
      if (winIM.instanceColor) winIM.instanceColor.needsUpdate = true;
    }
    cityWindows('HOME');
    /* THE EXPRESSWAY'S LIGHTS moving: heads (white, toward -x) on its near side, tails (red, toward +x) on its far side,
       each a small card; their places a function of the wall clock (an ambient thing: no story waits on them) */
    const carGeo = new THREE.PlaneGeometry(1.4, 0.5); owned.push(carGeo);
    const carMat = B({ color: 0xffffff, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false });
    const CARS = 56, carIM = new THREE.InstancedMesh(carGeo, carMat, CARS); carIM.frustumCulled = false; owned.push(carIM); cityG.add(carIM);
    const carLane = [], carRng = rng(51060);
    for (let i = 0; i < CARS; i++) { const dir = i % 2 ? 1 : -1; carLane.push({ dir, x0: carRng() * 300, v: 18 + carRng() * 10, z: 78 + (dir > 0 ? 3 + carRng() * 4 : -3 - carRng() * 4) });
      carIM.setColorAt(i, _wc.setHex(dir > 0 ? 0xff3020 : 0xfff2d8)); }
    if (carIM.instanceColor) carIM.instanceColor.needsUpdate = true;
    const _cm = new THREE.Matrix4(), _cq = new THREE.Quaternion().setFromEuler(new THREE.Euler(-0.6, 0, 0)), _cp = new THREE.Vector3(), _cs = new THREE.Vector3(1, 1, 1);
    function carsTick(t) {
      for (let i = 0; i < CARS; i++) { const L = carLane[i], u = ((L.x0 + L.dir * L.v * t) % 300 + 300) % 300;
        _cm.compose(_cp.set(HX - 150 + u, -78 + 7.6, L.z), _cq, _cs); carIM.setMatrixAt(i, _cm); }
      carIM.instanceMatrix.needsUpdate = true;
    }
    carsTick(0);

    /* ================================================================ THE THINGS (the plan's 7; props/RECORD.md): every one a
       real model, stood by its key; a new one not landed yet stands as an invisible stand-in for its collision only, and is
       drawn the moment its file is in the build (v4.7) */
    const DEG = Math.PI / 180;
    const things = {};
    /* a model at a place, its collision a stand-in box from the floor (w on its own x, d on its own z) that stays whether
       the model has landed or not, so nothing moves when it does */
    function place(name, key, x, y, z, ry, o = {}) {
      const g = stand(key, x, y, z, ry, Object.assign({ parent: o.parent || world }, o));
      g.name = name; things[name] = g;
      if (o.solid) { const [w, d, h] = o.solid; solidBox(w, h || 1.2, d, x, (h || 1.2) / 2, z, ry); }
      return g;
    }
    /* a reused model's paint darkened, warmed or turned (its file untouched: v12.4), the moment it lands */
    const tint = (hex, k = 1) => (m) => m.traverse(q => { if (!q.isMesh) return; for (const mt of [].concat(q.material)) { if (!mt || !mt.color) continue;
      mt.color.multiply(new THREE.Color(hex)).multiplyScalar(k); } });
    const matteOf = (m) => m.traverse(q => { if (!q.isMesh) return; for (const mt of [].concat(q.material)) if (mt && 'roughness' in mt) { mt.roughness = Math.max(mt.roughness, 0.6); mt.metalness = Math.min(mt.metalness, 0.1); } });

    /* ---------------------------------------------- HER FRONT ROOM, set for the evening (the plan's 5.3 and 8.1) */
    const HER = {
      table:  { x: 0.5, z: 1.15, w: 1.0, d: 0.54, h: 0.40 },          // the coffee table under the white cloth
      pho:    { x: 0.5, z: 1.87, ry: Math.PI },                       // Grandmaster Pho on his cushion, facing the door across the room
      him:    { x: WORLD_AT.kneel.x, z: WORLD_AT.kneel.z, ry: WORLD_AT.kneel.ry },   // he kneels at Pho's right, by her windows
      sofa:   { x: 0.5, z: -0.35, w: 1.5, d: 0.87, seat: 0.44, ry: 0 },   // her two-seat sofa, its back to the door
      grace:  { x: 0.42, z: -0.32, ry: 0 },                           // where she sits on it (her right-hand seat, facing him and Pho)
      rattan: { x: -1.55, z: -0.95, ry: 0.77, seat: 0.45 },           // the rattan chair by the door, turned to the table: Marcus
      door:   { x: FRONT.x0, z: -2.375, w: 0.95, hingeZ: -2.85 },     // her front door, in the back wall off the landing
      shelf:  { x: -1.6, z: 2.78, ry: Math.PI },                      // the bookshelf against the +z wall
      fan:    { x: 0.45, z: 0.75 },                                   // the ceiling fan over the table
      bag:    { x: 1.02, y: 0.44, z: -0.33 },                         // her open bag on the sofa beside her, the packet in it
      plant:  { x: 2.25, z: -2.55 }
    };
    /* on the cloth when play begins (the plan's 8.1): the bowl, two candles, the jug and the lighter beside his knee (the
       jug, the lighter, the incense and the small white plate have no model yet: their spots are kept for them) */
    const CLOTH_Y = HER.table.h + 0.012;
    const ON_CLOTH = {
      bowl:     { x: 0.78, y: CLOTH_Y, z: 1.22 },
      candle1:  { x: 0.18, y: CLOTH_Y, z: 1.34 },
      candle2:  { x: 0.30, y: CLOTH_Y, z: 0.98 },
      plate:    { x: 0.08, y: CLOTH_Y, z: 0.96 },                     // the small white plate's corner, apart from everything (9.2)
      lighter:  { x: 0.95, y: CLOTH_Y, z: 1.36 },
      incense:  { x: 0.52, y: CLOTH_Y, z: 1.38 },
      jug:      { x: 1.18, y: 0, z: 1.58 }                            // on the floor at his knee
    };
    {
      const T = HER.table;
      place('ctable', 'w51ctable', T.x, 0, T.z, 0, { solid: [T.w, T.d, 0.6] });
      place('gsofa', 'w51gsofa', HER.sofa.x, 0, HER.sofa.z, HER.sofa.ry, { solid: [HER.sofa.w, HER.sofa.d, 0.9] });
      place('rattan', 'w51rattan', HER.rattan.x, 0, HER.rattan.z, HER.rattan.ry, { solid: [0.66, 0.66, 0.9] });
      place('shelf', 'w51shelf', HER.shelf.x, 0, HER.shelf.z, HER.shelf.ry, { solid: [0.82, 0.34, 1.4],
        done: (m, g) => { g.updateWorldMatrix(true, true); const bb = new THREE.Box3().setFromObject(m); if (things.herLamp) things.herLamp.position.y = Math.max(0.5, bb.max.y - g.position.y); } });
      things.herLamp = place('herLamp', 'w5tablelamp', 0.18, 1.39, 0, 0, { parent: things.shelf });
      place('phoCushion', 'w5cushion', HER.pho.x, 0, HER.pho.z, 0);
      place('hisCushion', 'w5cushion', HER.him.x, 0, HER.him.z - 0.05, 0.2);
      place('cushionA', 'w5cushion', -0.75, 0, 2.35, 0.4); place('cushionB', 'w5cushion', -1.05, 0.11, 2.42, 0.9);
      place('plant', 'w3dracaena', HER.plant.x, 0, HER.plant.z, 0.6, { solid: [0.6, 0.6, 1.5] });
      place('ceilFan', 'w5ceilfan', HER.fan.x, FRONT.ceil - 0.52, HER.fan.z, 0);
      place('bag', 'w51bag', HER.bag.x, HER.bag.y, HER.bag.z, -0.25);
      place('keepsake', 'w51keepsake', HER.bag.x + 0.02, HER.bag.y + 0.07, HER.bag.z, 0.4);
      place('holyBowl', 'w4bigbowl', ON_CLOTH.bowl.x, ON_CLOTH.bowl.y, ON_CLOTH.bowl.z, 0, { lift: 3, done: tint(0xffd9a0, 1.0) });   // (a warm tint: the plan's brass, its silver file untouched)
      place('candle1', 'w3candlesmall', ON_CLOTH.candle1.x, ON_CLOTH.candle1.y, ON_CLOTH.candle1.z, 0);
      place('candle2', 'w3candlesmall', ON_CLOTH.candle2.x, ON_CLOTH.candle2.y, ON_CLOTH.candle2.z, 0);
      /* the ritual's small things (props: made by THINGS, drawn when keyed): the white plate, the lighter, the jug */
      place('plate', 'w51plate', ON_CLOTH.plate.x, ON_CLOTH.plate.y, ON_CLOTH.plate.z, 0);
      place('lighter', 'w51lighter', ON_CLOTH.lighter.x, ON_CLOTH.lighter.y, ON_CLOTH.lighter.z, 0.6);
      place('jug', 'w51jug', ON_CLOTH.jug.x, ON_CLOTH.jug.y, ON_CLOTH.jug.z, -0.4);
      place('incense', 'w51incense', ON_CLOTH.incense.x, ON_CLOTH.incense.y, ON_CLOTH.incense.z, 0.3);
      /* the back room: her small table (its laptop closed on it), two chairs, the fridge, her takeaway boxes on the counter */
      place('dintable', 'w4dintable', -4.25, 0, 0.75, Math.PI / 2, { solid: [1.2, 0.85, 0.8], h: 0.74, done: matteOf });
      place('dinchairA', 'w4dinechair', -4.25, 0, 1.45, Math.PI, { solid: [0.48, 0.5, 0.9] });
      place('dinchairB', 'w4dinechair', -4.6, 0, 0.0, 0.1, { solid: [0.48, 0.5, 0.9] });
      place('laptop', 'w51laptop', -4.1, 0.745, 0.65, 0.3);
      place('fridge', 'w4fridge', -5.18, 0, 2.6, Math.PI, { solid: [0.76, 0.76, 1.7] });
      place('takeaway', 'w51takeaway', -3.3, 0.9, 2.72, 0.4);
      /* her doors: the front door (open in the opening film, shut in play: `herDoor`), the bedroom's, the street's */
      const hp = new THREE.Group(); hp.position.set(FRONT.x0 - 0.075, 0, HER.door.hingeZ); hp.name = 'her front door'; herFlatG.add(hp); things.herDoorPivot = hp;
      stand('w4doorleaf', 0, 0, 0.47, Math.PI / 2, { parent: hp, done: matteOf });
      things.herDoorSolid = solidBox(0.1, 2.1, 0.95, FRONT.x0 - 0.075, 1.05, HER.door.z);
      stand('w4doorleaf', BACKR.x0 - 0.075, 0, -0.83, Math.PI / 2, { parent: herFlatG, done: matteOf });       // the bedroom door, shut
      solidBox(0.1, 2.1, 0.94, BACKR.x0 - 0.075, 1.05, -0.83);
      const sp = new THREE.Group(); sp.position.set(STREET.shop, GY, STAIR.z1); sp.name = 'the street door'; streetG.add(sp); things.streetDoorPivot = sp;
      stand('w4doorleaf', 0, 0, -0.5, Math.PI / 2, { parent: sp, done: matteOf });
      /* on the landing: the metal gate folded back against the lobby's wall, her shoes by the door, a plant */
      const gp = new THREE.Group(); gp.position.set(FRONT.x0 - 0.2, 0, -1.86); gp.name = 'her gate'; herFlatG.add(gp); things.gatePivot = gp;
      stand('w4gate', -0.48, 0, 0.0, 0, { parent: gp, lift: 1.5 });
      place('shoes1', 'w5slippers', -3.22, 0, -2.62, 1.4, { parent: herFlatG }); place('shoes2', 'w5slippers', -3.46, 0, -2.56, 1.75, { parent: herFlatG });
      place('landingPlant', 'w4corrpots', -3.94, 0, -2.25, Math.PI / 2, { parent: herFlatG, s: 0.6 });
      /* the stair's one tube, on the bay's far wall over the flight; the coffee shop's, inside its shutter */
      place('stairTube', 'w4tubelight', -1.6, 1.75, STAIR.z0 + 0.11, 0, { lift: 1.5 }); things.stairTube.rotation.x = -Math.PI / 2;
      place('shopTube', 'w4tubelight', -1.2, -0.42, 0.2, Math.PI / 2, { lift: 1.5 });
      /* the coffee shop's chairs, stacked four high in three stacks for the night */
      const stacks = []; for (const [x, z] of [[-1.6, -1.6], [-1.15, -1.2], [-2.3, 1.4]]) for (let k = 0; k < 4; k++) stacks.push({ x, y: GY + k * 0.09, z, ry: 0.2 * k });
      many('w3pchair', stacks, world, 0.5);
      /* the street: lamps on both kerbs (sodium, painted), the taxi at her kerb (the opening's: `taxi`), a car parked across
         the street and one up it, a motorbike at the kerb */
      for (const z of [-24, 9.5, 30]) { place('lampN' + z, 'w4streetlamp', STREET.kerb + 0.25, GY - 0.03, z, Math.PI / 2, { lift: 1.5 }); }
      for (const z of [-10, 15]) { place('lampF' + z, 'w4streetlamp', STREET.road[1] - 0.25, GY - 0.03, z, -Math.PI / 2, { lift: 1.5 }); }
      place('taxi', 'e4sedan', 4.55, GY - 0.15, -1.6, Math.PI, { lift: 2, done: tint(0x6a8cc8, 1.0) });
      place('parkedA', 'e4sedanfar', 12.4, GY - 0.15, 9.5, 0, { lift: 2 });
      place('parkedB', 'e4suvfar', 4.6, GY - 0.15, 16.0, Math.PI, { lift: 2 });
      place('moto', 'e4moto', 3.95, GY - 0.15, -9.0, Math.PI + 0.25, { lift: 2 });
    }

    /* ---------------------------------------------- HIS HOME's things (the plan's 5.4, 9.4, 9.8, 9.9) */
    const HIS = {
      door:    { x: HX - 3.8, z: LIV.z0, w: 0.8, hingeX: HX - 4.2 },     // his front door (the corridor's side at -z)
      altar:   { x: HX - 4.28, z: 0.35, ry: Math.PI / 2, top: 0.9 },    // the altar cabinet on the living room's left wall
      sofa:    { x: HX - 2.3, z: -0.95, ry: 0, seat: 0.45 },            // his sofa, facing his glass
      circle:  { x: HX - 2.2, z: 1.0, r: 0.75 },                         // the middle of the room's floor: the thread's circle (9.7)
      dining:  { x: HX + 0.75, z: -0.25, w: 1.6, d: 0.9, h: 0.75, ry: 0 },   // his dining table
      chair1:  { x: HX + 0.75, z: 0.45, ry: Math.PI },                  // his chair (the +z side, his back to his glass)
      chair2:  { x: HX + 0.75, z: -0.95, ry: 0 },                       // the other chair (the kitchen's side: Pho's at dawn)
      bed:     { x: HX + 7.15, z: 0.8, ry: -Math.PI / 2, w: 1.7, l: 2.1, top: 0.55 },   // his bed, its head on the +x wall
      bedside: { x: HX + 7.95, z: 2.05 },
      getUp:   { x: HX + 6.7, z: -0.48 },                                // where he stands up from it (the bed's -z side)
      bedDoor: { x: BED.x0, z: 1.2, hingeZ: 1.65 },                      // the bedroom door, ajar
      clock:   { x: HX + 7.79, y: 0.5, z: 2.16, ry: -Math.PI / 2 - 0.5 },   // the alarm clock on his bedside, turned to the bed
      aircon:  { x: BED.x1 - 0.12, y: 2.25, z: 0.8, ry: -Math.PI / 2 },   // the wall unit over his bed's head, on the +x wall
      kettle:  { x: HX + 2.0, z: LIV.z0 + 0.3 },                       // on the kitchen counter
      bag:     { x: HX - 3.0, z: LIV.z0 + 0.3, ry: 0.2 },              // his bag on the floor inside his front door
      balcony: { x: HX + 0.05, z: LIV.z1, w: 1.5 },                      // the sliding door (x -0.7..0.8)
      frames:  [{ x: PASS.x0 + 0.45, y: 1.45, z: PASS.z1 - 0.01 }, { x: PASS.x0 + 1.05, y: 1.55, z: PASS.z1 - 0.01 }],
      oven:    { x: HX + 1.75, y: 0.86, z: LIV.z0 + 0.62 }
    };
    {
      place('altarcab', 'w51altarcab', HIS.altar.x, 0, HIS.altar.z, HIS.altar.ry, { solid: [0.9, 0.42, 1.0] });
      /* on the altar: the Buddha image, his teacher's photograph, a candle, the flowers, and where the bottle goes */
      place('buddha', 'e4buddha', HIS.altar.x + 0.02, HIS.altar.top, HIS.altar.z, HIS.altar.ry, { lift: 3 });
      place('photo', 'w4framesmall', HIS.altar.x - 0.05, HIS.altar.top, HIS.altar.z + 0.3, HIS.altar.ry + 0.25);
      place('altarCandle', 'w3candlesmall', HIS.altar.x + 0.12, HIS.altar.top, HIS.altar.z - 0.24, 0);
      place('jasmine', 'w51jasmine', HIS.altar.x - 0.04, HIS.altar.top, HIS.altar.z - 0.34, 0);
      place('bottle', 'w51bottle', HIS.altar.x + 0.14, HIS.altar.top, HIS.altar.z - 0.08, 0); things.bottle.visible = false;   // set down by the film of home (9.4)
      place('hisSofa', 'w51sofa', HIS.sofa.x, 0, HIS.sofa.z, HIS.sofa.ry, { solid: [2.1, 0.9, 0.9] });
      place('dining', 'w51dintable', HIS.dining.x, 0, HIS.dining.z, HIS.dining.ry, { solid: [HIS.dining.w, HIS.dining.d, 0.9] });
      place('chair1', 'w51dinchair', HIS.chair1.x, 0, HIS.chair1.z, HIS.chair1.ry, { solid: [0.5, 0.5, 0.9] });
      place('chair2', 'w51dinchair', HIS.chair2.x, 0, HIS.chair2.z, HIS.chair2.ry, { solid: [0.5, 0.5, 0.9] });
      place('hisPhone', 'e4phone', WORLD_AT.phone.x, WORLD_AT.phone.y, WORLD_AT.phone.z, 0.2);
      place('bed', 'w51bed', HIS.bed.x, 0, HIS.bed.z, HIS.bed.ry, { solid: [HIS.bed.w, HIS.bed.l, 0.7] });
      place('bedLamp', 'w5tablelamp', HIS.bedside.x + 0.09, 0.5, HIS.bedside.z, 0, { s: 0.8 });
      place('bedGlass', 'w51glass', HIS.bedside.x - 0.14, 0.5, HIS.bedside.z - 0.13, 0);            // the glass of water that trembles (8.3)
      place('altarGlass', 'w51glass', HIS.altar.x + 0.1, HIS.altar.top, HIS.altar.z + 0.12, 0);
      boxW(mVeneer, HIS.bedside.x, 0.25, HIS.bedside.z, 0.45, 0.5, 0.4, 63); solidXZ(HIS.bedside.x - 0.23, HIS.bedside.z - 0.2, HIS.bedside.x + 0.23, HIS.bedside.z + 0.2, 0.6);   // (a bedside cabinet: his bed's own set lands with w51bed if it has one)
      place('bedClock', 'w51clock', HIS.clock.x, HIS.clock.y, HIS.clock.z, HIS.clock.ry);            // the alarm clock on his bedside (9.4's insert: 11:58, 3:00)
      place('aircon', 'w51aircon', HIS.aircon.x, HIS.aircon.y, HIS.aircon.z, HIS.aircon.ry);
      place('kettle', 'w51kettle', HIS.kettle.x, 0.92, HIS.kettle.z, 0.4);
      place('hisBag', 'e4bag', HIS.bag.x, 0, HIS.bag.z, HIS.bag.ry);                                // his grey canvas bag by the door, the white thread in it (9.7)
      HIS.frames.forEach((f, i) => place('frame' + i, 'w5frame', f.x, f.y, f.z, Math.PI, { s: 0.55 }));
      /* the balcony: two plastic chairs, his clothes rack, a plant */
      place('bchair1', 'w3pchair', HX - 3.4, -0.05, 3.3, 0.3); place('bchair2', 'w3pchair', HX - 2.6, -0.05, 3.4, -0.2);
      place('rack', 'w4clothesrack', HX + 1.9, -0.05, 3.35, 0, { done: tint(0xd8d8d8) });
      place('bplant', 'w3dracaena', HX + 2.6, -0.05, 3.6, 1.2);
      /* his doors: the front door (shut in play, `hisDoor`), the bedroom's (ajar at bedtime, open in play), the sliding glass */
      const dp = new THREE.Group(); dp.position.set(HIS.door.hingeX, 0, LIV.z0 - 0.075); dp.name = 'his front door'; hisG.add(dp); things.hisDoorPivot = dp;
      stand('w5frontdoor', 0.4, 0, 0, 0, { parent: dp, done: tint(0x5a4a40, 0.55) });
      things.hisDoorSolid = solidBox(0.8, 2.1, 0.1, HIS.door.x, 1.05, LIV.z0 - 0.075);
      const bp = new THREE.Group(); bp.position.set(BED.x0 - 0.075, 0, HIS.bedDoor.hingeZ); bp.name = 'his bedroom door'; hisG.add(bp); things.bedDoorPivot = bp;
      stand('w4doorleaf', 0, 0, -0.45, Math.PI / 2, { parent: bp, done: (m) => { matteOf(m); tint(0xd8d2c8, 1.2)(m); } });
      bp.rotation.y = -82 * DEG;                                                   // open into the bedroom, against its wall
      solidBox(0.85, 2.0, 0.06, BED.x0 + 0.38, 1.0, HIS.bedDoor.hingeZ + 0.06);
      /* the sliding panel of his balcony door (glass in an aluminium frame): `balconyDoor(k)` slides it open */
      const sd = new THREE.Group(); sd.name = 'the balcony door'; hisG.add(sd); things.balconySlide = sd;
      { const fr = 0.05, w = 0.78, h = FLAT.ceil - 0.08, x0 = HX - 0.7;
        for (const [cx, cy, bw, bh] of [[x0 + w / 2, 0.06, w, fr], [x0 + w / 2, h, w, fr], [x0 + fr / 2, h / 2, fr, h], [x0 + w - fr / 2, h / 2, fr, h]]) {
          const m = new THREE.Mesh(new THREE.BoxGeometry(bw, bh, 0.05), mAlu); m.position.set(cx, cy, LIV.z1 - 0.035); sd.add(m); owned.push(m.geometry); }
        const gm = new THREE.Mesh(new THREE.PlaneGeometry(w - 2 * fr, h - fr), mGlassHis); gm.position.set(x0 + w / 2, h / 2 + 0.03, LIV.z1 - 0.035); sd.add(gm); owned.push(gm.geometry); }
      /* the corridor: its wall lights, his neighbours' doors */
      for (const x of [HX - 8.2, HX - 5.4, HX - 2.4, HX + 0.6]) place('corrLamp' + x, 'w5walllamp', x, 1.85, CORR.z0 + 0.02, 0, { lift: 1.5 });
      stand('w5frontdoor', HX - 6.8, 0, CORR.z0 + 0.04, 0, { parent: hisG, done: tint(0x5a4a40, 0.55) });
      stand('w5frontdoor', HX + 1.8, 0, CORR.z0 + 0.04, 0, { parent: hisG, done: tint(0x5a4a40, 0.55) });
    }

    /* ================================================================ HER WHITE CLOTH over the coffee table (the plan's
       5.3 and 9.1: Grandmaster Pho spreads it in the opening film; `cloth(k)` lays it, 0 folded away, 1 laid): a sheet of
       plain cotton that hangs a hand's breadth over the table's edges in soft folds, drawn as its own surface */
    const mCloth = M({ map: wPic((() => { const [c, x] = wCanvas(128, 128), r = rng(51070); x.fillStyle = '#f2efe6'; x.fillRect(0, 0, 128, 128);
      for (let i = 0; i < 1800; i++) { x.fillStyle = r() < 0.5 ? 'rgba(200,196,184,0.25)' : 'rgba(255,255,255,0.3)'; x.fillRect(r() * 128, r() * 128, 1, 1); } return c; })(), 0.3, 0.3), roughness: 0.95, side: THREE.DoubleSide });
    const clothG = new THREE.Group(); clothG.name = 'the white cloth'; herThingsG.add(clothG);
    {
      const T = HER.table, W = T.w + 0.34, D = T.d + 0.34, NX = 28, NZ = 18;
      const g = new THREE.PlaneGeometry(W, D, NX, NZ); g.rotateX(-Math.PI / 2); const pa = g.attributes.position;
      for (let i = 0; i < pa.count; i++) {
        const x = pa.getX(i), z = pa.getZ(i), ox = Math.max(0, Math.abs(x) - T.w / 2), oz = Math.max(0, Math.abs(z) - T.d / 2), o = Math.max(ox, oz);
        const fold = 0.012 * Math.sin(x * 23) * Math.min(1, o / 0.05) + 0.008 * Math.sin(z * 31) * Math.min(1, o / 0.05);
        pa.setY(i, o > 0 ? -o * 0.96 : 0);
        if (ox > 0) pa.setX(i, Math.sign(x) * (T.w / 2 + ox * 0.18 + fold)); if (oz > 0) pa.setZ(i, Math.sign(z) * (T.d / 2 + oz * 0.18 + fold));
      }
      g.computeVertexNormals(); owned.push(g);
      const cm = new THREE.Mesh(g, mCloth); cm.position.set(T.x, T.h + 0.006, T.z); clothG.add(cm);
    }
    function cloth(k) { clothG.visible = k > 0.001; clothG.scale.set(1, 1, Math.max(0.02, Math.min(1, k))); }

    /* ================================================================ THE REFLECTION (the plan's 12): her window at night
       shows a faint mirror of the room's door corner. It is BUILT BEHIND THE GLASS: a mirrored copy of her flat (its
       fabric, its door, its things) and of whoever stands or sits in it, each drawn through the mirror about her front wall's
       inside face (x 2.75), every frame where its original is, dimmed; the dark pane laid over it. Measured from his
       kneeling eye (WORLD.md): the half-closed shutter keeps his own reflection, Pho's, the cloth's candles and the lamp's
       off the open glass, so the mirror never has to hold what has no body (he is never seen: v24.56).
       It is drawn only while the lens is inside her flat (from the street, the copy would stand in the air over it).
       THE HOOK for the films and the play (WORLD.reflect, ROOMTHINGS.reflect):
         reflect.add(id, P, o)    a person P (a mkPerson body) mirrored into the glass: o.face (a turn the reflection faces in
                                  the room, radians, Mixamo's: 0 faces +z; null follows the real one) or o.turn (radians
                                  added to the real one's), o.k (0..1, how strongly it shows; 1)
         reflect.set(id, o)       change those at any time (a film sets them from its clock: a pure function, v6.4)
         reflect.remove(id)
         reflect.strength(k)      the whole reflection's strength 0..1 (the glass's; 1 by default)
         reflect.state()          { on, k, people: { id: { face, turn, k, twins } } } (a probe's) */
    const MIRROR_X = FRONT.x1;
    const MIRROR = new THREE.Matrix4().set(-1, 0, 0, 2 * MIRROR_X, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
    const mirrorG = new THREE.Group(); mirrorG.name = 'the reflection'; mirrorG.visible = false; world.add(mirrorG);
    const REFL_K = 0.36;                                                // how bright the room is in the glass, before the pane
    const reflMats = new Map();
    function reflMat(mt) {
      if (!mt) return mt;
      let r = reflMats.get(mt); if (r) return r;
      r = mt.clone(); mats.push(r);
      if (r.color) r.color.multiplyScalar(REFL_K);
      if (r.emissive) r.emissive.multiplyScalar(REFL_K);
      if ('envMapIntensity' in r) r.envMapIntensity = (r.envMapIntensity || 1) * REFL_K;
      r.userData.reflOf = mt; reflMats.set(mt, r); return r;
    }
    const reflRoots = [];                                               // { root, twins: Map(src -> twin), people: P|null, o }
    function twinOf(src) {
      let t;
      if (src.isInstancedMesh) { t = new THREE.InstancedMesh(src.geometry, Array.isArray(src.material) ? src.material.map(reflMat) : reflMat(src.material), src.count); t.instanceMatrix = src.instanceMatrix; }
      else if (src.isSkinnedMesh) { t = new THREE.SkinnedMesh(src.geometry, Array.isArray(src.material) ? src.material.map(reflMat) : reflMat(src.material));
        t.bindMode = 'detached'; t.bind(src.skeleton, src.bindMatrix); }
      else t = new THREE.Mesh(src.geometry, Array.isArray(src.material) ? src.material.map(reflMat) : reflMat(src.material));
      t.matrixAutoUpdate = false; t.matrixWorldAutoUpdate = false; t.frustumCulled = false; t.castShadow = t.receiveShadow = false;
      t.renderOrder = src.renderOrder; t.name = 'refl:' + (src.name || src.type);
      mirrorG.add(t); return t;
    }
    function reflTrack(root, o = {}) { const R = { root, twins: new Map(), person: o.person || null, o, n: -1 }; reflRoots.push(R); return R; }
    const _rT = new THREE.Matrix4(), _rR = new THREE.Matrix4(), _rM = new THREE.Matrix4(), _rP = new THREE.Vector3();
    const drawnUp = (o) => { for (let a = o; a; a = a.parent) { if (!a.visible) return false; if (a === world) return true; } return true; };
    function reflScan(R) {
      const list = []; R.root.traverse(q => { if ((q.isMesh || q.isInstancedMesh) && !q.isSprite && !(q.userData && q.userData.noRefl)) list.push(q); });
      if (list.length === R.n) return; R.n = list.length;
      for (const q of list) if (!R.twins.has(q)) {
        const mt = [].concat(q.material)[0];
        if (!mt || mt.visible === false || (mt.transparent && mt.blending === THREE.AdditiveBlending) || mt === matProxy) continue;
        R.twins.set(q, twinOf(q));
      }
    }
    let reflScanAt = 0, reflAuto = false;
    function reflTick(now) {
      /* (Grace and Marcus are in the glass from the first frame, following their bodies: the films and the play turn them) */
      if (!reflAuto && typeof cast === 'object' && cast) { reflAuto = true; if (cast.grace) reflect.add('grace', cast.grace); if (cast.marcus) reflect.add('marcus', cast.marcus); }
      const rescan = now - reflScanAt > 0.5; if (rescan) reflScanAt = now;
      for (const R of reflRoots) {
        if (rescan) reflScan(R);
        const P = R.person, o = R.o;
        let turn = 0;
        if (P) { const ry = P.group.rotation.y; turn = o.face != null ? angTo(ry, o.face) : (o.turn || 0); P.group.getWorldPosition(_rP); }
        const kOn = P ? (o.k == null ? 1 : o.k) > 0.02 : true;
        for (const [src, tw] of R.twins) {
          tw.visible = kOn && drawnUp(src);
          if (!tw.visible) continue;
          if (src.isSkinnedMesh) _rM.copy(src.bindMatrix); else { src.updateWorldMatrix(true, false); _rM.copy(src.matrixWorld); }
          if (turn) { _rT.makeTranslation(_rP.x, 0, _rP.z); _rR.makeRotationY(turn); _rM.premultiply(_rT.clone().invert()).premultiply(_rR).premultiply(_rT); }
          tw.matrix.copy(MIRROR).multiply(_rM); tw.matrixWorld.copy(tw.matrix);
        }
      }
    }
    /* what is mirrored from the first frame: her flat's fabric, its things, the cloth and her door's leaf */
    reflTrack(herFlatG); reflTrack(herThingsG);
    const herThingNames = ['ctable', 'gsofa', 'rattan', 'shelf', 'phoCushion', 'hisCushion', 'cushionA', 'cushionB', 'plant', 'ceilFan', 'bag', 'keepsake', 'dintable', 'dinchairA', 'dinchairB', 'laptop', 'fridge', 'takeaway'];
    for (const n of herThingNames) if (things[n]) reflTrack(things[n]);
    let reflStrength = 1;
    const reflPeople = new Map();
    const reflect = {
      add(id, P, o = {}) { if (!P || !P.group) return false; this.remove(id); const R = reflTrack(P.group, Object.assign({ face: null, turn: 0, k: 1 }, o, { person: P })); R.person = P; reflPeople.set(id, R); return true; },
      set(id, o) { const R = reflPeople.get(id); if (!R) return false; Object.assign(R.o, o); return true; },
      remove(id) { const R = reflPeople.get(id); if (!R) return false; for (const tw of R.twins.values()) mirrorG.remove(tw); reflRoots.splice(reflRoots.indexOf(R), 1); reflPeople.delete(id); return true; },
      strength(k) { reflStrength = Math.max(0, Math.min(1, k)); return reflStrength; },
      state() { const people = {}; for (const [id, R] of reflPeople) people[id] = { face: R.o.face, turn: R.o.turn, k: R.o.k, twins: R.twins.size };
        return { on: mirrorG.visible, k: reflStrength, roots: reflRoots.length, twins: mirrorG.children.length, people }; }
    };
    /* the pane's darkness carries the strength: at 1 the room shows at about a quarter of its brightness through it */
    const PANE_O = mPaneNight.opacity;
    function insideHer(p) { return p.x < FRONT.x1 - 0.02 && p.x > ROOM.x0 - 0.2 && p.z > FRONT.z0 - 0.02 && p.z < FRONT.z1 + 0.02 && p.y > -0.5 && p.y < FRONT.ceil + 0.1; }

    /* ================================================================ THE PAINTED LIGHT (v9.4: no lamp is added): each a
       picture of light where a lamp, a candle, a tube or the sun would lay it, shown by the look it belongs to */
    {
      /* her table lamp on the bookshelf: its glow, the warmth it throws on the ceiling and the wall behind it */
      const L = HER.shelf;
      glow(L.x - 0.18, 1.72, L.z - 0.02, 0.9, 0xffc88a, 0.55, herThingsG, 'lamp');
      pool(L.x, FRONT.ceil - 0.01, L.z - 0.5, 3.4, 3.0, 0xffb874, 0.22, { rx: Math.PI / 2, parent: herThingsG, look: 'lamp' });
      pool(L.x, 1.6, FRONT.z1 - 0.01, 2.6, 2.2, 0xffb874, 0.2, { rx: 0, ry: Math.PI, parent: herThingsG, look: 'lamp' });
      /* THE FAN'S SHADOW turning on the ceiling (the plan's 4.3 and 9.1): the lamp throws the blades up onto the plaster,
         offset from the fan away from the lamp; drawn as a soft dark picture of four blades turned with the fan */
      const sh = (() => { const [c, x] = wCanvas(256, 256); x.translate(128, 128);
        for (let i = 0; i < 4; i++) { x.rotate(Math.PI / 2); const g = x.createLinearGradient(0, 0, 118, 0); g.addColorStop(0, 'rgba(0,0,0,0.5)'); g.addColorStop(1, 'rgba(0,0,0,0.18)');
          x.fillStyle = g; x.beginPath(); x.moveTo(10, -8); x.quadraticCurveTo(70, -26, 120, -16); x.quadraticCurveTo(126, 0, 120, 16); x.quadraticCurveTo(70, 26, 10, 8); x.closePath(); x.fill(); }
        x.filter = 'blur(6px)'; return tex(done(THREE, c, false)); })();
      const fs = pool(HER.fan.x + 0.62, FRONT.ceil - 0.012, HER.fan.z - 0.7, 1.85, 1.85, 0xffffff, 0.3, { map: sh, add: false, rx: Math.PI / 2, parent: herThingsG, look: 'lamp' });
      things.fanShadow = fs.q;
      /* the two candles' warmth on the cloth (their flames are the films' and the play's: `candleLit`) */
      for (const n of ['candle1', 'candle2']) { const c = ON_CLOTH[n];
        things[n + 'Glow'] = glow(c.x, c.y + 0.27, c.z, 0.28, 0xffb060, 0.9, herThingsG, n);
        things[n + 'Pool'] = pool(c.x, c.y + 0.003, c.z, 0.7, 0.7, 0xffa050, 0.3, { parent: herThingsG, look: n }); }
      /* the stair's tube: its own glow and the light it lays on the treads and the walls (`stairTube(k)` dims it, flickers it) */
      things.tubeGlow = glow(-1.6, 1.74, STAIR.z0 + 0.12, 1.4, 0xe8f4ff, 0.6, world, 'tube');
      things.tubePool = [pool(-1.6, GY + (STAIR.x1 + 1.6) / STAIR_RUN * STAIR_RISE + 0.03, (STAIR.z0 + STAIR.z1) / 2, 3.2, 1.1, 0xdfeeff, 0.18, { look: 'tube', rx: -Math.PI / 2, ry: Math.atan2(STAIR_RISE, STAIR_RUN) }),
                         pool(-1.6, 1.4, STAIR.z1 - 0.004, 3.2, 2.6, 0xdfeeff, 0.12, { rx: 0, ry: Math.PI, look: 'tube' })];
      /* the coffee shop's tube inside its half-shut shutter, and the light it spills under it onto the five-foot way */
      glow(-1.2, -0.45, 0.2, 1.6, 0xe8f4ff, 0.45, world, 'street');
      pool(0.0, GY + 0.004, 0.0, 4.4, 6.6, 0xd8e8ff, 0.12, { look: 'street' });
      pool(STREET.shop + 0.9, GY + 0.006, 0.0, 1.8, 5.6, 0xd8e8ff, 0.1, { look: 'street' });
      /* the street lamps' sodium on the road and the five-foot way's edge */
      for (const z of [-24, 9.5, 30]) { glow(STREET.kerb + 1.9, GY + 6.6, z, 1.8, 0xffa040, 0.9, world, 'street'); pool(STREET.kerb + 2.2, GY - 0.145, z, 9, 9, 0xff9030, 0.32, { look: 'street' }); }
      for (const z of [-10, 15]) { glow(STREET.road[1] - 1.9, GY + 6.6, z, 1.8, 0xffa040, 0.9, world, 'street'); pool(STREET.road[1] - 2.2, GY - 0.145, z, 9, 9, 0xff9030, 0.32, { look: 'street' }); }
      /* his altar's candle: a small warm point in his dark flat, and its light on the wall behind */
      things.altarGlow = glow(HIS.altar.x + 0.12, HIS.altar.top + 0.27, HIS.altar.z - 0.24, 0.32, 0xffb060, 0.85, hisG, 'altar');
      things.altarPool = pool(LIV.x0 + 0.01, 1.3, HIS.altar.z, 1.6, 1.4, 0xffa050, 0.16, { rx: 0, ry: Math.PI / 2, parent: hisG, look: 'altar' });
      /* the corridor's lamps */
      for (const x of [HX - 8.2, HX - 5.4, HX - 2.4, HX + 0.6]) { glow(x, 2.0, CORR.z0 + 0.12, 0.5, 0xffd8a0, 0.6, hisG, 'corr'); pool(x, 1.8, CORR.z0 + 0.003, 1.6, 1.8, 0xffd8a0, 0.2, { rx: 0, parent: hisG, look: 'corr' }); }
      /* the bathroom's light, spilling out of its open door into the bedroom (9.4: the shower; `bathLight(k)`) */
      things.bathPool = pool(HX + 5.45, 0.004, -0.4, 1.4, 1.6, 0xfff2e0, 0.35, { parent: hisG, look: 'bath' });
      /* DAWN's sun through his glass: long warm patches across his floor (their mullions' gaps between) */
      things.sunPatches = [];
      for (let x = LIV.x0 + 0.1; x < LIV.x1 - 0.5; x += 1.25) things.sunPatches.push(pool(x + 0.62, 0.005, 1.25, 1.1, 2.6, 0xffc070, 0.4, { add: true, parent: hisG, look: 'dawn', rz: 0.32 }));
    }
    /* THE LOOKS of the world (the head's PRESETS, by name): what each shows of the painted light. `worldLook(name)` sets
       it; the world's own tick follows the sky on its own when the scene's background is a preset's (the play and the
       films ask kit.daylight; nothing else is needed) */
    const LOOKS_ON = {
      BLUE:  { lamp: 1, candle1: 0, candle2: 0, tube: 1, street: 1, altar: 0, corr: 0, bath: 0, dawn: 0, city: 1, night: 1 },
      LAMP:  { lamp: 1, candle1: 1, candle2: 0, tube: 1, street: 1, altar: 0, corr: 0, bath: 0, dawn: 0, city: 1, night: 1 },
      HOME:  { lamp: 0, candle1: 0, candle2: 0, tube: 0, street: 0, altar: 1, corr: 1, bath: 0, dawn: 0, city: 1, night: 1 },
      NIGHT: { lamp: 0, candle1: 0, candle2: 0, tube: 0, street: 0, altar: 1, corr: 1, bath: 0, dawn: 0, city: 1, night: 1 },
      DAWN:  { lamp: 0, candle1: 0, candle2: 0, tube: 0, street: 0, altar: 0, corr: 1, bath: 0, dawn: 1, city: 0, night: 0 }
    };
    let lookNameW = 'LAMP';
    const lookOver = {};                                                // a film's or the play's own setting of one light: { candle: 0 }
    function worldLook(name) {
      if (!LOOKS_ON[name]) return false;
      if (name !== lookNameW) { lookNameW = name; cityWindows(name); }
      const L = LOOKS_ON[name];
      for (const p of pools) if (p.look) { const k = lookOver[p.look] != null ? lookOver[p.look] : (L[p.look] != null ? L[p.look] : 1);
        p.m.opacity = p.o0 * k; p.q.visible = k > 0.001; }
      return true;
    }
    /* a light of the world set by a film or the play (0..1; null gives it back to the look): candle, tube, bath, altar, ... */
    function worldLight(what, k) { if (k == null) delete lookOver[what]; else lookOver[what] = k; worldLook(lookNameW); }
    const BG_OF = Object.fromEntries(Object.entries(PRESETS).map(([n, P]) => [P.bg, n]));

    /* ================================================================ THE WORLD'S OWN TICK: run by the renderer before each
       drawing of the scene (the scene's onBeforeRender, chained to whatever stood there and given back when the chapter is
       left), so it sees the lens the frame is drawn from, in play and in a film alike. It holds: the reflection (on only
       with the lens inside her flat; each copy where its original is), the fan turning, the expressway's lights, and the
       look following the sky */
    let fanAng = 0, lastTick = 0;
    const _camW = new THREE.Vector3();
    function worldTick(cam) {
      const now = performance.now() / 1000, dt = lastTick ? Math.min(0.1, Math.max(0, now - lastTick)) : 0; lastTick = now;
      cam.getWorldPosition(_camW);
      const inside = insideHer(_camW);
      mirrorG.visible = inside && reflStrength > 0.001;
      if (mirrorG.visible) { reflTick(now); mPaneNight.opacity = 1 - (1 - PANE_O) * reflStrength; } else mPaneNight.opacity = PANE_O;
      fanAng += dt * 7.2;                                               // (about 1.15 turns a second: her fan on its middle setting)
      if (things.ceilFan) things.ceilFan.rotation.y = fanAng;
      if (things.fanShadow) things.fanShadow.rotation.z = fanAng;
      if (_camW.x > 100) carsTick(now);
      const bg = scene.background && scene.background.isColor ? scene.background.getHex() : null;
      if (bg != null && BG_OF[bg] && BG_OF[bg] !== lookNameW) worldLook(BG_OF[bg]);
    }
    const prevBR = scene.onBeforeRender;
    scene.onBeforeRender = function (r, s, cam, rt) {
      if (!alive) { if (scene.onBeforeRender !== prevBR) scene.onBeforeRender = prevBR; return prevBR.call(this, r, s, cam, rt); }
      try { worldTick(cam); } catch (e) { console.warn('e5c1 worldTick', e); }
      return prevBR.call(this, r, s, cam, rt);
    };
    worldLook('LAMP');

    /* ---------------------------------------------- the things the films and the play turn (each a pure setting of its
       argument, so a film's track can drive it from its own clock: v6.4) */
    const doorTo = (piv, deg) => { if (piv) piv.rotation.y = deg * DEG; };
    function herDoor(k) { doorTo(things.herDoorPivot, k * 92); things.herDoorSolid.position.y = k > 0.05 ? -5 : 1.05; }   // open into her room, toward its -z wall
    function streetDoor(k) { doorTo(things.streetDoorPivot, k * 95); }
    function hisDoor(k) { doorTo(things.hisDoorPivot, -k * 95); things.hisDoorSolid.position.y = k > 0.05 ? -5 : 1.05; }    // open into his flat
    function bedDoor(k) { doorTo(things.bedDoorPivot, -k * 82); }                                                         // 0 shut, 1 against the wall (play), 0.15 ajar
    function balconyDoor(k) { things.balconySlide.position.x = -Math.max(0, Math.min(1, k)) * 0.72; }                     // slides behind the fixed pane
    function shutter(name, deg) { const L = shutterLeaves.find(l => l.name === name); if (L) L.piv.rotation.y = L.sign * deg * DEG; }
    function stairTube(k) { worldLight('tube', k); }
    function bathLight(k) { worldLight('bath', k); }
    function candleLit(n, on) { worldLight(n, on == null ? null : on ? 1 : 0); }
    /* the oven's clock, the digits a picture (ending B: 3:41) */
    const ovenC = wCanvas(128, 48); const ovenTex = tex(done(THREE, ovenC[0], false));
    const ovenMat = B({ map: ovenTex, color: 0xffffff }); const ovenQ = new THREE.Mesh(new THREE.PlaneGeometry(0.16, 0.06), ovenMat); owned.push(ovenQ.geometry);
    ovenQ.position.set(HIS.oven.x, HIS.oven.y, HIS.oven.z - 0.005); hisG.add(ovenQ);
    function ovenClock(text) { const x = ovenC[1]; x.fillStyle = '#060808'; x.fillRect(0, 0, 128, 48); x.fillStyle = '#58e0a0'; x.font = 'bold 34px monospace'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(text, 64, 26); ovenTex.needsUpdate = true; }
    ovenClock('11:52');
    cloth(1); herDoor(0); streetDoor(0); hisDoor(0); bedDoor(1); balconyDoor(0);

    /* ================================================================ WHERE EACH PHASE PUTS HIM AND THE PEOPLE (the
       plan's 8: each phase a save, a Continue lands at its start). `at` is where he stands at the phase's start (the play
       kneels him or lays him down); a person's station is where that person is while the phase is played */
    const STATION = {
      room:  { at: { x: HER.him.x, z: HER.him.z, ry: HER.him.ry },
               pho: { x: HER.pho.x, z: HER.pho.z, ry: HER.pho.ry }, grace: { x: HER.grace.x, z: HER.grace.z, ry: HER.grace.ry, y: HER.sofa.seat },
               marcus: { x: HER.rattan.x, z: HER.rattan.z, ry: HER.rattan.ry, y: HER.rattan.seat } },
      night: { at: { x: HIS.getUp.x, z: HIS.getUp.z, ry: 2.17 } }
    };
    STATION.breaking = STATION.room;
    STATION.ask = { at: { x: WORLD_AT.phone.x + 0.25, z: WORLD_AT.phone.z + 0.85, ry: 0.3 } };
    /* the opening's and the films' places (WORLD.md, the plan's 9) */
    const FILMPLACE = {
      crane:    { from: { x: 9.6, y: GY + 7.0, z: -6.2 }, to: { x: 4.2, y: GY + 1.6, z: -3.6 }, look: { x: 1.6, y: GY + 1.2, z: -3.3 } },   // 9.1: 7 m up, 6 m out, down to 1.6 m
      marcus0:  { x: 1.75, z: -3.0, ry: Math.PI / 2 + 0.3 },        // Marcus waiting by the stair door on the five-foot way
      taxi:     { x: 4.55, z: -1.6, ry: Math.PI, door: { x: 3.7, z: -1.15 } },   // the taxi's stop at her kerb; its kerbside rear door
      out:      { x: 3.05, z: -1.4 },                              // where he steps onto the five-foot way
      stairFoot: { x: 1.3, y: GY, z: -3.72 }, stairTop: { x: STAIR.x0, y: 0, z: -3.72 },
      landing:  { x: -3.55, z: -2.7, ry: -Math.PI / 2 },            // the top of the stair, turned toward her door
      herDoorOut: { x: -3.35, z: -2.375 }, herDoorIn: { x: -2.35, z: -2.375 },
      glass:    { x: MIRROR_X, y: 1.45, z: 1.0 },                   // the point of her window where the door corner is reflected from his place
      corridor: { from: { x: HX - 8.6, z: -3.45 }, to: { x: HX - 3.8, z: -3.2 } },   // 9.4: his walk to his door
      hisDoorIn: { x: HX - 3.8, z: -1.9 },
      altarFront: { x: HX - 3.55, z: HIS.altar.z, ry: Math.PI / 2 }, // standing at his altar
      phoneAt:  { x: WORLD_AT.phone.x, y: WORLD_AT.phone.y, z: WORLD_AT.phone.z },
      bedEdge:  { x: HX + 6.55, y: 0.55, z: 0.15 }, bedHead: { x: HX + 7.85, y: 0.62, z: 0.8 },
      sofaSeat: { x: HIS.sofa.x, y: HIS.sofa.seat, z: HIS.sofa.z + 0.1 },
      kitchen:  { x: HX + 0.1, z: LIV.z0 + 0.95 },                   // at the drawer and the tap (ending C)
      balconyAt: { x: HIS.balcony.x - 0.2, z: LIV.z1 - 0.35 },       // ending D: the doorway's frame, never past it
      circle:   { x: HIS.circle.x, z: HIS.circle.z, r: HIS.circle.r },
      dawnSeat: { him: { x: HIS.chair1.x, z: HIS.chair1.z }, pho: { x: HIS.chair2.x, z: HIS.chair2.z } },
      /* his footsteps from his front door to his bed, as the film of home walked them (8.3: lit red in Spirit Vision) */
      steps:    [[HX - 3.8, -2.2], [HX - 3.6, -1.3], [HX - 3.55, -0.2], [HX - 3.1, 0.2], [HX - 2.0, -0.05], [HX - 0.8, 0.1], [HX + 0.2, 0.55],
                 [HX + 1.4, 0.75], [HX + 2.6, 0.95], [HX + 3.7, 1.05], [HX + 4.6, 1.15], [HX + 5.6, 0.6], [HX + 6.4, 0.05]]
    };
    const ROOMTHINGS = Object.assign({ ON_CLOTH, CLOTH_Y, WIN, MIRROR_X, KNEEL_EYE, GY, STAIR, LOBBY, FRONT, BACKR, UNITS, FILMPLACE, reflect, things }, HER);
    const FLATTHINGS = Object.assign({ LIV, BED, BATH, PASS, CORR, BALC, GH, TOWERS: TOWERS.length, windows: towerWins.length }, HIS);
    /* THE WORLD'S HANDLES for the films and the play (ROOMTHINGS.api, d_play's stage.plan): each a setting, never a timer */
    const WORLD = { things, reflect, look: worldLook, light: worldLight, cloth, herDoor, streetDoor, hisDoor, bedDoor, balconyDoor, shutter,
                    stairTube, bathLight, candleLit, ovenClock, cityWindows, insideHer, state: () => ({ look: lookNameW, over: Object.assign({}, lookOver), refl: reflect.state(), waiting: [...waiting] }) };
    ROOMTHINGS.api = WORLD; FLATTHINGS.api = WORLD;

    /* ====================================================== THE DRAWN SURFACES' HELPERS (chapter 3's own, as chapters 4
       and 5 have them) */
//@@COPY 4604-4610 :: function rng(seed)
