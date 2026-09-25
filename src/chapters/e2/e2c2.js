/* Episode 2 · Chapter 2 · "Nobody There"
   ---------------------------------------------------------------------------
   The nights between. Night after night the shower in the block beside bed
   one turns itself on, and it always starts at three. This morning, at the
   cookhouse, he has decided to say something: ask three of the men who sleep
   in that room what they heard, then tell the encik — who is standing in the
   corner watching the recruits eat, the way he always is.

   Two sets in one chapter. The FILM is THE BUNK at night — since v10.1 the
   whole room of chapter 1, rebuilt to its own numbers eighty metres off the
   cookhouse (the nine bunks, the lockers, the long table, the block and its
   far cubicle, and the eight men asleep in it, four statues and four who
   breathe), because Chad's note on v10.0 was exact: "must look exactly to
   how it was built in ep2 chp1 with the bunkmates sleeping on the beds".
   PLAY is the COOKHOUSE: pink laminate tables on steel frames, attached
   benches, trays, Chad's food warmers on the servery and his cafe staff
   behind it, both long sides OPEN onto the camp — the parade square on one
   side, the bunk blocks on the other, trees round both — under a proper
   morning sky. Six admintee doze over breakfast; the encik is the chapter's
   PILE, so this costs the engine nothing.

   Built against the same contract as chapters 1–5, the fixture and e2c1:
   build(ctx) -> stage, scenes[i](c, s, api), intro(c, s, api). The plan is
   docs/V10.0-E2C2-PLAN.md (§7 is v10.1).

   ENGINE SEAMS TOUCHED: none.                                              */

(() => {
  'use strict';

  let S = null;

  const DATA = {
    id: 2,
    episode: 2,
    title: 'Nobody There',
    cardLabel: 'Chapter 2',
    cardTitle: 'Nobody There',
    brief: 'Night after night, at three in the morning, the shower beside bed one turns itself on. This morning you have decided to say something. Ask three bunkmates what they heard. Then tell the encik.',
    prompt: 'The encik is watching the recruits eat. You have asked three men. Now you are standing in front of him. What do you say?',
    choices: [
      { k: 'A', text: '"Encik, something happened. I don\'t know what."',
        d: { sanity: 18, awareness: 24, wisdom: 30 }, verdict: 'best',
        say: 'I told him what I knew, and only that. He didn\'t laugh.',
        teach: 'Document before interpreting. Wisdom can include: I don\'t know yet.' },
      { k: 'B', text: '"Encik, the bunk is haunted. I\'m sure."',
        d: { sanity: -12, awareness: -9, wisdom: -30 }, verdict: 'worst', critical: true,
        say: 'I said I was sure. I wasn\'t. Now nobody will listen.',
        teach: 'Confirmation bias can make ordinary events feel like proof.' },
      { k: 'C', text: '"Never mind encik, I think I was just tired."',
        d: { sanity: 9, awareness: -21, wisdom: -21 }, verdict: 'bad',
        say: 'I called it nothing. It wasn\'t nothing. Three a.m. knew that.',
        teach: 'Scepticism is not the same as dismissal.' },
      { k: 'D', text: '"Encik, what do you think it is?"',
        d: { sanity: 15, awareness: 21, wisdom: 30 }, verdict: 'good',
        say: 'He gave me three answers and one rule. The rule was the answer.',
        teach: 'Good guidance expands your thinking; it does not replace your judgement.' }
    ],
    core: '"Haunted, I\'m sure" and "it was nothing" are the same grip on opposite sides. "Something happened, I don\'t know what" is the mind held open until it has enough.<br><i>Diṭṭhupādāna — clinging to a view. Either certainty stops you looking.</i>',

    /* units metres, y up. The cookhouse hall is x −9…9, z −7…7; the servery
       runs along the −x wall, BOTH long sides (±z) are open to the camp
       between pillars, the encik's corner is +x, −z. The parade square lies
       out past the +z side, the bunk blocks past the −z side. The night
       pocket for the film stands eighty metres off at z −80, outside the
       bounds and behind the blocks. */
    spawn:     { x: -5.0, y: 1.62, z: 0, rot: -Math.PI / 2 },   // by the servery, facing down the middle aisle
    shrine:    { x: 7.6, z: -5.6 },                            // the engine's anchor: the encik's corner
    ghostHome: { x: 7.6, z: -5.6 },                            // unused (ghost: null)
    bounds:    { minX: -8.6, maxX: 8.6, minZ: -6.6, maxZ: 6.6 },

    /* the eleventh leak (v4.3): no haunting from the engine. This chapter's
       haunting is the film's, and the memory of it. */
    ghost: null,

    /* v10.1: A PROPER MORNING SKY (Chad: "Sky should be properly done"). A
       Tekong morning at seven: a blue that deepens to the zenith, a warm
       haze on the horizon, the sun up and clouds over it, a light fog so the
       far block and the trees sit in air rather than cut out of it. The
       hands are lit warm from above — outdoors, not under tubes. */
    daylight: {
      stops: [[0.00, '#c9d9e6'], [0.10, '#9dbde0'], [0.30, '#6a9fd8'],
              [0.60, '#4a86cc'], [1.00, '#2f6fbd']],
      bg: 0x8fb4d8,
      fog: [0xb4cadf, 0.0055],
      hemi: [0xdce9f5, 0x8a8a78, 1.0],
      key: [0xfff0d8, 0.95, 14, 20, 8],
      fill: [0xbfd3e6, 0.35],
      stars: 0, moon: 0,
      sun: 0.8, clouds: 0.5,
      vmHemi: [0xf1f4f8, 0x9a9488, 0.95],
      vmKey: [0xfff2dc, 0.7]
    },

    /* v10.1: the bunk pocket is the whole room, so it needs the room's
       models — the bunks, the two sleeper files — and the trees outside;
       the cookhouse gets Chad's staff and his food warmers. */
    assets: ['admintee', 'encik2', 'bunkbed', 'sleeper', 'sleepanim',
             'tree1', 'tree2', 'tree3', 'tree4', 'cafestaff', 'foodwarmer'],

    /* v10.1: the cookhouse is LOUD. Four loops layered over the room tone —
       the men talking (`cookchat`), the kitchen behind the hatch
       (`kitchen`, keyed to how close the player stands to the servery), a
       (v10.1–v10.3 a morning bed, `cookmusic`, ran here too; retired at v10.4
       — the episode's dread bed IS the chapter's music now, at 0.85, Chad's
       "same loud eerie music ... throughout this entire chapter") — and the
       episode's dread under everything. `showerrun` and `clocktick` are the film's
       and scene C's, written up by the chapter (a loop at 0 is never decoded
       until it is asked for). The four hall loops are DUCKED to nothing in
       every cut to the bunk. */
    musicVol: 0,
    /* v10.4, Chad: "For ep 2 chp 2 playable scene and throughout this entire
       chapter, i want the same loud eerie music in the background." The
       cookhouse's morning bed (`cookmusic`, v10.1/v10.2) is retired and the
       dread runs at chapter 1's level, keyed to nothing — film, hall, scenes. */
    ambience: { beds: [['cookamb', 0.26], ['cookchat', 0.30], ['kitchen', 0.24],
                       ['e2dread', 1.0], ['showerrun', 0], ['clocktick', 0]] },   // v10.7: the dread at full (was 0.85), and its file levelled by RMS

    words: {
      /* v13.0 (Chad: "the 'the encik' label still appears when player is near
         to him and looking at him. I dont think this serves any real purpose").
         An EMPTY approach word means no floating label at all — the engine
         shows the prompt only when a chapter has given it something to say,
         which is the sheet's own rule for an empty cell. */
      approach: '',
      act: 'E to speak to the encik',
      actTouch: 'Tap to speak to the encik',
      interact: 'E to speak to the encik',
      interactTouch: 'Tap to speak to the encik',
      presence: 'Something followed you here.',
      objAsk: 'Ask three bunkmates what they heard · {n}/3',
      objEncik: 'Tell the encik',
      hotBunkmate: 'Ask your bunkmate',
      hotRecruit: 'Ask him',
      hotRecruit2: 'Ask the recruit beside him'
    },
    sayPrefix: 'n2'
  };

  /* the night the FILM is shot in — e2c1's NIGHT */
  const NIGHT = {
    stops: [[0.00, '#1a1714'], [0.20, '#121420'], [0.45, '#0b1020'],
            [0.75, '#060912'], [1.00, '#03050a']],
    bg: 0x070a10,
    fog: [0x090d14, 0.020],
    hemi: [0x2c3652, 0x0f1114, 0.55],
    key: [0x8fa4c8, 0.35, 20, 16, 4],
    fill: [0x4e6086, 0.18],
    stars: 0.9, moon: 0,
    sun: 0, clouds: 0.25,
    vmHemi: [0x2e3a58, 0x0c0e12, 0.5],
    vmKey: [0x8ea3cc, 0.42]
  };

  /* the measured length of every line said outside a cutscene. v10.1: the
     "it starts at 3am" line is `r2hear` (David, a Singaporean Chinese voice —
     Chad's ask), said by a fourth recruit; `b2hear` stays in the pack unused. */
  const SECS = { r2hear: 5.25, k2three: 4.64, r2siao: 3.2, n2known: 3.0, e2hurry: 2.93 };

  const hash = (i, s) => { const x = Math.sin(i * 127.1 + s * 311.7) * 43758.5453; return x - Math.floor(x); };

  function build(ctx) {
    const { THREE, GLTFLoader, cloneSkinned, scene, camera, yaw, LOW, kit, plantTrees,
            assetBytes, rescueTextures, redoShadows, cnv, makeHellNote, makeConcrete, makeGrass,
            getState, startDecision, worldSfx, warmSounds, HEAD_RE } = ctx;

    const owned = [];
    let alive = true;

    /* ------------------------------------------------------------- the map */
    const H = { x: 9.0, z: 7.0, h: 4.2, wall: 0.18 };
    const ROW_Z = [-4.6, -1.55, 1.55, 4.6];
    const TBL = { x0: -2.9, x1: 4.1, w: 0.80, top: 0.76, bench: 0.68, seat: 0.46, benchW: 0.32 };
    const OURS = 2;                                    // the section's table
    const ENC = { x: 7.6, z: -5.6 };                    // his corner
    ENC.ry = Math.atan2(1.0 - ENC.x, 0 - ENC.z);        // a model faces +z at ry 0: aimed at the hall's middle
    const COUNTER = { x: -7.4, d: 0.8, z0: -4.2, z1: 4.2, h: 0.92 };
    const PK = { x: 0, z: -80 };                        // the night pocket's origin

    /* ----------------------------------------------------------- textures */
    const noteTex = makeHellNote();                     // the contract wants one
    const terrazzo = makeTerrazzo(THREE, cnv);
    const pinkTex = makeLaminate(THREE, cnv);
    const menuTex = makeMenu(THREE, cnv);
    const clock = makeClock(THREE, cnv);
    const signTex = makeSign(THREE, cnv, 'RETURN YOUR TRAYS HERE', '#1d3a5f');
    const wasteTex = makeSign(THREE, cnv, 'TAKE WHAT YOU EAT · NO WASTAGE', '#8a2a1e');
    const grassTex = makeGrass ? makeGrass() : null;
    const cTex = makeConcrete ? makeConcrete() : null;
    const tarmacTex = makeTarmac(THREE, cnv);
    const tileTex = makeTiles(THREE, cnv);
    const boardTex = makeBoard(THREE, cnv);
    const streakTex = makeStreaks(THREE, cnv);
    const winView = makeWinView(THREE, cnv);
    const dotTex = ctx.makeSoftDot ? ctx.makeSoftDot('rgba(255,244,220,0.9)', 'rgba(255,244,220,0)') : null;
    const paint = (S, fn, repeat) => {
      const [c, cx] = cnv(S); fn(cx, S);
      const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
      if (repeat) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(repeat[0], repeat[1]); }
      return t;
    };
    const madeTex = [noteTex, terrazzo, pinkTex, menuTex, clock.tex, signTex, wasteTex, tarmacTex, tileTex, boardTex, streakTex, winView];

    const matWall = new THREE.MeshStandardMaterial({ color: 0xe6dfcd, roughness: 0.96 });
    const matDado = new THREE.MeshStandardMaterial({ color: 0x6f8f6a, roughness: 0.9 });
    const matCeil = new THREE.MeshStandardMaterial({ color: 0xd9d6cc, roughness: 0.99 });
    const matFloor = new THREE.MeshStandardMaterial({ map: terrazzo, roughness: 0.55, metalness: 0.02 });
    const matPink = new THREE.MeshStandardMaterial({ map: pinkTex, roughness: 0.35, metalness: 0.02 });
    const matSteel = new THREE.MeshStandardMaterial({ color: 0x9aa0a6, roughness: 0.35, metalness: 0.85 });
    const matFrame = new THREE.MeshStandardMaterial({ color: 0x4d5257, roughness: 0.5, metalness: 0.7 });
    const matBench = new THREE.MeshStandardMaterial({ color: 0xc46f86, roughness: 0.5 });
    const matTray = new THREE.MeshStandardMaterial({ color: 0x8a5a3a, roughness: 0.7 });
    const matPlate = new THREE.MeshStandardMaterial({ color: 0xf0ede4, roughness: 0.4 });
    const matFood = new THREE.MeshStandardMaterial({ color: 0xb8863c, roughness: 0.9 });
    const matCup = new THREE.MeshStandardMaterial({ color: 0x2f5f9a, roughness: 0.5 });
    const matTube = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xfff6e6, emissiveIntensity: 1.4, roughness: 0.4 });
    const matPillar = new THREE.MeshStandardMaterial({ color: 0xd8d2c0, roughness: 0.95 });
    const matRoof = new THREE.MeshStandardMaterial({ color: 0x8e5a48, roughness: 0.85 });
    const matGrass = new THREE.MeshStandardMaterial(grassTex ? { map: grassTex.map, roughnessMap: grassTex.rough, color: 0x9fb37a, roughness: 1 } : { color: 0x7d9a5c, roughness: 1 });
    const matBlock = new THREE.MeshStandardMaterial({ color: 0xd9d1bc, roughness: 0.95 });
    const matTarmac = new THREE.MeshStandardMaterial({ map: tarmacTex, roughness: 0.95 });
    const matMenu = new THREE.MeshStandardMaterial({ map: menuTex, roughness: 0.9 });
    const matSign = new THREE.MeshStandardMaterial({ map: signTex, roughness: 0.85 });
    const matWaste = new THREE.MeshStandardMaterial({ map: wasteTex, roughness: 0.85 });
    const matGlass = new THREE.MeshStandardMaterial({ color: 0xcfe6ee, transparent: true, opacity: 0.28, roughness: 0.1, metalness: 0.1 });
    const matWhite = new THREE.MeshStandardMaterial({ color: 0xe8e8e2, roughness: 0.85 });
    const matProxy = new THREE.MeshStandardMaterial({ color: 0x3b4238, roughness: 0.9 });

    const world = new THREE.Group();
    scene.add(world);

    /* ---------------------------------------------------------- the shell */
    const walls = [], solids = [], wallFans = [];
    const box = (w, h, d, x, y, z, mat, parent = world) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
      m.position.set(x, y, z); m.castShadow = !LOW; m.receiveShadow = true;
      parent.add(m); return m;
    };
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(H.x * 2, H.z * 2), matFloor);
    floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; world.add(floor);
    const ceil = new THREE.Mesh(new THREE.PlaneGeometry(H.x * 2, H.z * 2), matCeil);
    ceil.rotation.x = Math.PI / 2; ceil.position.y = H.h; world.add(ceil);
    // two solid END walls (−x behind the servery, +x behind the encik) with a painted dado
    walls.push(box(H.wall, H.h, H.z * 2, -H.x - H.wall / 2, H.h / 2, 0, matWall));
    walls.push(box(H.wall, H.h, H.z * 2, H.x + H.wall / 2, H.h / 2, 0, matWall));
    box(0.02, 1.1, H.z * 2, H.x - 0.01, 0.55, 0, matDado);
    box(0.02, 1.1, H.z * 2, -H.x + 0.01, 0.55, 0, matDado);
    /* v10.1: BOTH LONG SIDES ARE OPEN (Chad: "The side walls should mostly be
       open"). A Tekong cookhouse is a roof on pillars: a low parapet you can
       lean on, a pillar every three metres, a beam, and the roof reaching
       out over a walkway. The parapets are the blockers, so the bounds and
       walktest do not move. */
    for (const side of [-1, 1]) {
      const z = side * (H.z + 0.125);
      const parapet = box(H.x * 2, 1.05, 0.25, 0, 0.525, z, matPillar);
      walls.push(parapet);
      box(H.x * 2 + 0.1, 0.06, 0.34, 0, 1.08, z, matWhite);                  // a capping
      for (let x = -H.x; x <= H.x + 0.01; x += 3.0) solids.push(box(0.36, H.h, 0.36, x, H.h / 2, z, matPillar));
      box(H.x * 2 + 0.4, 0.5, 0.4, 0, H.h - 0.25, z, matPillar);            // the beam
      // the roof's overhang and its fascia, over the walkway outside
      const ov = box(H.x * 2 + 1.2, 0.18, 2.4, 0, H.h + 0.12, side * (H.z + 1.3), matRoof);
      ov.rotation.x = side * 0.06;
      box(H.x * 2 + 1.2, 0.34, 0.06, 0, H.h - 0.02, side * (H.z + 2.5), matWhite);
      // v10.1: a wall fan on every second pillar, blowing along the hall
      for (const x of [-6, 0, 6]) {
        const f = new THREE.Group(); f.position.set(x, 2.55, side * (H.z - 0.25)); f.rotation.y = side > 0 ? Math.PI : 0; world.add(f);
        box(0.08, 0.08, 0.22, 0, 0, 0.1, matFrame, f);
        const cage = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.012, 6, 24), matFrame); cage.position.z = 0.22; f.add(cage);
        const blades = new THREE.Group(); blades.position.z = 0.19; f.add(blades);
        for (let i = 0; i < 3; i++) { const b = box(0.06, 0.2, 0.01, 0, 0.11, 0, matWhite, blades); const w = new THREE.Group(); w.rotation.z = i * Math.PI * 2 / 3; w.add(b); blades.add(w); }
        blades.userData.moves = true;
        wallFans.push(blades);
      }
    }
    const roofTop = box(H.x * 2 + 1.2, 0.2, H.z * 2 + 0.4, 0, H.h + 0.2, 0, matRoof);
    roofTop.receiveShadow = false;

    /* fluorescent fittings: three rows of four, on the ceiling */
    const tubes = [], tubeLights = [];
    const TUBE_I = LOW ? 8 : 5;                         // v10.1: daylight floods the hall from both sides; the tubes are fill
    for (const z of [-4.2, 0, 4.2]) for (const x of [-6.5, -2.2, 2.2, 6.5]) {
      box(1.3, 0.08, 0.2, x, H.h - 0.06, z, matFrame);
      const t = box(1.2, 0.03, 0.06, x, H.h - 0.11, z, matTube);
      tubes.push(t);
      if (Math.abs(x) < 3 && z === 0) {                  // two lights, not twelve: the sky does the rest
        const L = new THREE.PointLight(0xfff3e0, TUBE_I, 9, 1.6);
        L.position.set(x, H.h - 0.3, z); world.add(L); tubeLights.push(L);
      }
    }

    /* ------------------------------------------------------- the servery
       v10.1: Chad's BUFFET WARMERS take the counter — "Replace the food with
       this food models at the food serve station" — five steel warmers with
       their lids up, a dish in each (the food is a photograph on a plane
       inside the tray, which is what a bain-marie looks like from above),
       and two stacks of plates at the end. MEASURED off the file
       (dbg-food.mjs): it spans 5.83 m along its own x, 1.06 m across, and
       stands with its base at y 1.737 — modelled on a counter that is not in
       the file — so it is turned a quarter to run along the counter's z,
       and dropped by 1.737 − COUNTER.h so its feet land on the steel. The
       primitive wells stay hidden underneath as the proxy in case the bytes
       never come. */
    const counter = box(COUNTER.d, COUNTER.h, COUNTER.z1 - COUNTER.z0, COUNTER.x, COUNTER.h / 2, 0, matSteel);
    solids.push(counter);
    box(COUNTER.d + 0.1, 0.04, COUNTER.z1 - COUNTER.z0 + 0.1, COUNTER.x, COUNTER.h + 0.02, 0, matSteel);
    const wells = [];
    for (let z = COUNTER.z0 + 0.6; z < COUNTER.z1 - 0.3; z += 0.75) {
      wells.push(box(0.5, 0.02, 0.6, COUNTER.x, COUNTER.h + 0.05, z, matFrame));
      wells.push(box(0.42, 0.06, 0.52, COUNTER.x, COUNTER.h + 0.08, z, [matFood, matPlate, matCup][Math.floor(hash(z * 10, 3) * 3)]));
    }
    const FOOD_BASE = 1.737, FOOD_CX = -1.19;            // the model's own floor and the x-centre of its span (−4.10…1.72)
    let foodModel = null;
    assetBytes('foodwarmer').then(BUF => new GLTFLoader().parse(BUF, '', (gltf) => {
      if (!alive) return;
      rescueTextures(gltf, BUF);
      const m = gltf.scene;
      m.traverse(o => { if (o.isMesh) { o.castShadow = !LOW; o.receiveShadow = true; } });
      m.rotation.y = Math.PI / 2;                       // its length (x) along the counter (z); its +x end lands at −z
      m.position.set(COUNTER.x, COUNTER.h + 0.04 - FOOD_BASE, FOOD_CX);
      world.add(m); foodModel = m;
      for (const w of wells) w.visible = false;
      redoShadows();
    })).catch(() => {});
    // the sneeze guard and its posts
    box(0.02, 0.45, COUNTER.z1 - COUNTER.z0, COUNTER.x + 0.3, COUNTER.h + 0.62, 0, matGlass);
    for (const z of [COUNTER.z0, 0, COUNTER.z1]) box(0.03, 0.62, 0.03, COUNTER.x + 0.3, COUNTER.h + 0.45, z, matFrame);
    // the kitchen wall behind: a hatch and the menu board, a sink, a shelf of pots
    box(3.2, 1.6, 0.06, -H.x + 0.04, 1.75, -1.0, matFrame);
    box(3.0, 1.4, 0.02, -H.x + 0.08, 1.75, -1.0, new THREE.MeshStandardMaterial({ color: 0x1c1f22, roughness: 0.9 }));
    const menu = new THREE.Mesh(new THREE.PlaneGeometry(2.0, 1.2), matMenu);
    menu.position.set(-H.x + 0.02, 2.2, 2.4); menu.rotation.y = Math.PI / 2; world.add(menu);
    const waste = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.4), matWaste);
    waste.position.set(-H.x + 0.02, 1.35, 2.4); waste.rotation.y = Math.PI / 2; world.add(waste);
    box(1.2, 0.9, 0.6, -H.x + 0.32, 0.45, -3.2, matSteel);                    // the sink unit
    box(1.1, 0.06, 0.5, -H.x + 0.32, 0.93, -3.2, matFrame);
    box(0.03, 0.3, 0.03, -H.x + 0.32, 1.1, -3.2, matSteel);                  // its tap
    box(0.02, 1.6, 0.02, -H.x + 0.06, 1.7, -4.4, matFrame);                  // stacked pots on a shelf
    box(0.5, 0.04, 2.0, -H.x + 0.3, 2.4, -3.6, matFrame);
    for (let i = 0; i < 4; i++) { const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.15, 0.22, 12), matSteel); pot.position.set(-H.x + 0.3, 2.53, -4.4 + i * 0.45); world.add(pot); }
    // a stack of trays, a water dispenser, a bin
    box(0.5, 0.35, 0.36, -6.6, 0.175 + COUNTER.h, -4.6, matTray);
    solids.push(box(0.45, 1.5, 0.45, -8.4, 0.75, 6.0, matSteel));
    solids.push(box(0.5, 0.8, 0.5, 8.4, 0.4, 6.2, matFrame));
    /* v10.1: THE QUEUE RAIL in front of the servery — steel posts and a rail
       the section files along — and a TRAY-RETURN RACK by the +x end with
       its sign, which is what every cookhouse has and this one did not */
    const RAIL_X = COUNTER.x + 1.35;
    for (const z of [-4.0, -2.0, 0, 2.0, 4.0]) {
      const p = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.95, 8), matSteel); p.position.set(RAIL_X, 0.475, z); world.add(p); solids.push(p);
      const ft = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.13, 0.03, 10), matSteel); ft.position.set(RAIL_X, 0.015, z); world.add(ft);
    }
    box(0.03, 0.03, 8.0, RAIL_X, 0.95, 0, matSteel);
    box(0.03, 0.03, 8.0, RAIL_X, 0.55, 0, matSteel);
    /* v10.8 (Chad): "the return tray shelf doesnt look like a shelf, make it look
       like a shelf with layers. And have 2 return stations to fill up the empty
       space." The v10.1 rack was a solid box with four slabs drawn INSIDE it, so
       from the hall it read as a cabinet. Each station is open steel shelving
       now — four posts, five shelves you can see between, a lip on every
       shelf's front, trays stacked on the middle levels — and the BLOCKER is an
       invisible box of the same footprint (`blockers()` boxes an invisible mesh
       exactly as a visible one, v9.0). The second station stands down the same
       wall at z −2.2, clear of the notice board (z 0.6) and the encik's corner. */
    const matShelfPost = new THREE.MeshStandardMaterial({ color: 0x8f9396, roughness: 0.45, metalness: 0.6 });
    function mkReturn(z) {
      const RX = 8.4, W = 0.6, D = 1.6;
      const blk = box(W, 1.8, D, RX, 0.9, z, matFrame); blk.visible = false; solids.push(blk);
      for (const sx of [-1, 1]) for (const sz of [-1, 1]) box(0.04, 1.78, 0.04, RX + sx * (W / 2 - 0.02), 0.89, z + sz * (D / 2 - 0.02), matShelfPost);
      const LEVELS = [0.22, 0.6, 0.98, 1.36, 1.74];
      LEVELS.forEach((y, li) => {
        box(W, 0.025, D, RX, y, z, matSteel);                                 // the shelf
        box(0.02, 0.05, D, RX - W / 2 + 0.01, y + 0.03, z, matShelfPost);    // its lip, hall side
        if (li === 0 || li === 4) return;
        // trays on the working levels: two stacks of two or three, a loose one
        const n = 2 + (li % 2);
        for (let k = 0; k < n; k++) {
          const tz = z - D / 2 + 0.28 + k * 0.5 + (hash(li * 3 + k, 17) - 0.5) * 0.06;
          const stack = 1 + Math.floor(hash(li + k * 5, 19) * 3);
          for (let t = 0; t < stack; t++) box(0.42, 0.02, 0.30, RX - 0.03, y + 0.025 + t * 0.022, tz, matTray);
        }
      });
      const sg = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 0.35), matSign);
      sg.position.set(H.x - 0.02, 2.1, z); sg.rotation.y = -Math.PI / 2; world.add(sg);
    }
    mkReturn(4.0);
    mkReturn(-2.2);
    // a notice board and the hall clock on the encik's wall, condiments on the tables
    const board = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 0.95), new THREE.MeshStandardMaterial({ map: boardTex, roughness: 0.9 }));
    board.position.set(H.x - 0.02, 1.6, 0.6); board.rotation.y = -Math.PI / 2; world.add(board);
    const hallClock = makeClock(THREE, cnv); madeTex.push(hallClock.tex); hallClock.set('07:10');
    const hallClockFace = new THREE.Mesh(new THREE.PlaneGeometry(0.34, 0.34), new THREE.MeshStandardMaterial({ map: hallClock.tex, transparent: true, roughness: 0.85 }));
    hallClockFace.position.set(H.x - 0.02, 3.0, -2.2); hallClockFace.rotation.y = -Math.PI / 2; world.add(hallClockFace);

    /* v10.1: CHAD'S CAFE STAFF behind the counter — "Add this cafe staff
       behind the food serve station as a staff". It is a scan (no rig, no
       clips: a person standing, 1.9 m from sole to crown, centred on the
       origin), so it stands as a scan does — feet on the floor behind the
       warmers, turned to face the hall — where the serving is done from.
       Two of them, one at each end of the servery, so the line has someone
       to be served by wherever it stops. A capsule proxy stands there until
       the bytes land. */
    const STAFF_AT = [{ x: COUNTER.x - 0.75, z: -1.9 }, { x: COUNTER.x - 0.75, z: 1.7 }];
    const staff = { ready: false, group: new THREE.Group(), models: [] };
    world.add(staff.group);
    const staffProxies = STAFF_AT.map(p => { const c = new THREE.Mesh(new THREE.CapsuleGeometry(0.2, 1.2, 4, 8), matProxy); c.position.set(p.x, 0.9, p.z); staff.group.add(c); return c; });
    assetBytes('cafestaff').then(BUF => new GLTFLoader().parse(BUF, '', (gltf) => {
      if (!alive) return;
      rescueTextures(gltf, BUF);
      const src = gltf.scene;
      src.traverse(o => { if (o.isMesh) { o.castShadow = !LOW; o.receiveShadow = true; } });
      src.updateMatrixWorld(true);
      const bb = new THREE.Box3().setFromObject(src);
      const h = bb.max.y - bb.min.y;
      const s = 1.72 / (h || 1.9);                      // a Singaporean cook, not a 1.9 m portrait
      STAFF_AT.forEach((p, i) => {
        const m = i === 0 ? src : src.clone(true);
        m.scale.setScalar(s);
        m.position.set(p.x, -bb.min.y * s, p.z);
        m.rotation.y = Math.PI / 2 + (i ? -0.25 : 0.2); // the scan faces its own +z; a quarter turn puts that on +x, into the hall
        staff.group.add(m); staff.models.push(m);
        staffProxies[i].visible = false;
      });
      staff.ready = true; redoShadows();
    }, (err) => { console.warn('cafestaff failed', err); staff.ready = true; }))
      .catch(err => { console.warn('cafestaff failed', err); staff.ready = true; });

    /* ---------------------------------------------------------- the tables
       Chad's photograph: pink laminate tops on a steel frame with the benches
       attached. Four rows along x; the section's is ROW_Z[OURS]. */
    const tables = [];
    const trays = [];
    function mkTray(x, z, ry, dressed) {
      const g = new THREE.Group();
      g.position.set(x, TBL.top + 0.01, z); g.rotation.y = ry;
      box(0.42, 0.02, 0.30, 0, 0.01, 0, matTray, g);
      if (dressed) {
        const pl = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.09, 0.02, 14), matPlate);
        pl.position.set(-0.08, 0.03, 0.02); g.add(pl);
        const fd = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 6), matFood);
        fd.scale.set(1, 0.5, 1); fd.position.set(-0.08, 0.05, 0.02); g.add(fd);
        const cp = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.03, 0.09, 10), matCup);
        cp.position.set(0.13, 0.06, -0.06); g.add(cp);
        const sp = box(0.12, 0.006, 0.02, 0.10, 0.025, 0.08, matSteel, g);
        sp.rotation.y = 0.3;
      }
      world.add(g); trays.push(g); return g;
    }
    ROW_Z.forEach((z, ri) => {
      const cx = (TBL.x0 + TBL.x1) / 2, len = TBL.x1 - TBL.x0;
      const top = box(len, 0.04, TBL.w, cx, TBL.top - 0.02, z, matPink);
      const frame = new THREE.Group(); world.add(frame);
      for (const x of [TBL.x0 + 0.35, cx, TBL.x1 - 0.35]) {
        box(0.05, TBL.top - 0.04, 0.05, x, (TBL.top - 0.04) / 2, z - 0.25, matFrame, frame);
        box(0.05, TBL.top - 0.04, 0.05, x, (TBL.top - 0.04) / 2, z + 0.25, matFrame, frame);
        box(0.05, 0.05, TBL.bench * 2 + 0.2, x, 0.12, z, matFrame, frame);        // the foot rail the benches hang off
        for (const s of [-1, 1]) box(0.05, TBL.seat - 0.12, 0.05, x, (TBL.seat + 0.12) / 2, z + s * TBL.bench, matFrame, frame);
      }
      for (const s of [-1, 1]) box(len, 0.04, TBL.benchW, cx, TBL.seat, z + s * TBL.bench, matBench);
      tables.push({ top, z });
      // v10.1: condiments in the middle of every table — a chilli bottle, a soy bottle, a tissue box
      box(0.07, 0.18, 0.07, cx - 0.1, TBL.top + 0.09, z, new THREE.MeshStandardMaterial({ color: 0xc0341c, roughness: 0.5 }));
      box(0.06, 0.2, 0.06, cx + 0.02, TBL.top + 0.10, z + 0.05, new THREE.MeshStandardMaterial({ color: 0x2a1a10, roughness: 0.4 }));
      box(0.16, 0.09, 0.1, cx + 0.16, TBL.top + 0.045, z - 0.06, matWhite);
      // trays: every seat at ours, a scatter elsewhere
      for (const s of [-1, 1]) for (const x of [-1.6, 0.6, 2.8]) {
        const ours = ri === OURS || (ri === 1 && x === 0.6);   // v10.8: the two extra diners' seats at the next table get real trays too
        if (ours || hash(ri * 7 + x, 11) < 0.45) mkTray(x + (ours ? 0 : (hash(x, ri) - 0.5) * 0.3), z - s * 0.22, s > 0 ? Math.PI : 0, ours || hash(x, ri + 5) < 0.6);
      }
    });

    /* -------------------------------------------------- the seated section
       Six on `Sit_and_Doze_Off` (the take with no fold — v8.0's law), three
       a side, hips on the bench. One parse, six clones. A man who is asked
       SITS UP: his take crosses to `Chair_Sit_Idle_M` parked inside its
       upright window for the length of his line, then back to dozing. */
    const SEAT_X = [-1.6, 0.6, 2.8];
    const OURS_Z = ROW_Z[OURS];
    const SEATS = [];                                   // { x, z, ry, id }
    for (const [i, x] of SEAT_X.entries()) SEATS.push({ x, z: OURS_Z - TBL.bench, ry: 0, i });            // facing +z, into the table
    for (const [i, x] of SEAT_X.entries()) SEATS.push({ x, z: OURS_Z + TBL.bench, ry: Math.PI, i: i + 3 });
    /* v10.8 (Chad): "add 2 more bunkmates seated on another table at the
       cookhouse, with their food as well, same configuration as the rest.
       Since we are supposed to have 9 people in total including the player."
       Two at the next table toward the servery (row 1, z −1.55), facing each
       other across it — the same dozing take, the same trays, dealt by the
       same loop. Six at ours + these two + him = nine. */
    SEATS.push({ x: 0.6, z: ROW_Z[1] - TBL.bench, ry: 0, i: 6 });
    SEATS.push({ x: 0.6, z: ROW_Z[1] + TBL.bench, ry: Math.PI, i: 7 });
    /* v10.1: which seat is whose. The buddy keeps seat 0 but the "3am" line
       is a FOURTH recruit's now (r2hear, David), at seat 1 beside him; the
       old ids ride in saved phase strings and are simply ignored. */
    const WHO = { recruit4: 1, recruit3: 2, bunkmate: 4 };
    const DOZE = 'Sit_and_Doze_Off';   // v13.0: the sit-up take is gone — see sitUp()
    const CULL_SPHERE = {
      admintee:  { x: 0.067, y: 0.870, z: 0.011, r: 1.376 },
      encik2:    { x: 0.015, y: 0.832, z: -0.037, r: 1.253 },
      fbosling:  { x: 0.056, y: 0.833, z: 0.121, r: 1.439 },   // v10.8: the flagpole ghost (e2c1's table; v11.2: the nine-take file)
      sleepanim: { x: 0.582, y: 85.062, z: 19.032, r: 130.851 },
    };
    function wideBounds(root, key) {
      const d = CULL_SPHERE[key];
      root.traverse(o => {
        if (!o.isMesh) return;
        o.frustumCulled = true;
        if (!d || !o.isSkinnedMesh) return;
        const sp = new THREE.Sphere(new THREE.Vector3(d.x, d.y, d.z), d.r * 1.25);
        o.boundingSphere = sp.clone();
        if (o.geometry) o.geometry.boundingSphere = sp.clone();
      });
    }
    const seated = { rigs: [], ready: false, group: new THREE.Group() };
    world.add(seated.group);
    const proxies = SEATS.map(sp => {
      const p = new THREE.Mesh(new THREE.CapsuleGeometry(0.2, 0.7, 4, 8), matProxy);
      p.position.set(sp.x, 0.75, sp.z); p.castShadow = !LOW; seated.group.add(p); return p;
    });
    assetBytes('admintee').then(BUF => new GLTFLoader().parse(BUF, '', (gltf) => {
      if (!alive) return;
      rescueTextures(gltf, BUF);
      gltf.scene.traverse(o => { if (o.isMesh) { o.castShadow = !LOW; o.receiveShadow = false; } });
      wideBounds(gltf.scene, 'admintee');
      gltf.scene.updateMatrixWorld(true);
      const v = new THREE.Vector3(); let lo = Infinity, hi = -Infinity, crown = false;
      gltf.scene.traverse(o => { if (!o.isBone) return; o.getWorldPosition(v); lo = Math.min(lo, v.y); hi = Math.max(hi, v.y); if (/HeadTop_End/.test(o.name)) crown = true; });
      const s = 1.70 / (((hi - lo) / (crown ? 1 : 0.935)) || 1.7);
      const dozeClip = gltf.animations.find(a => a.name === DOZE) || gltf.animations[0];
      SEATS.forEach((sp, i) => {
        const g = new THREE.Group();
        g.position.set(sp.x, 0, sp.z); g.rotation.y = sp.ry; g.scale.setScalar(s);
        const m = cloneSkinned(gltf.scene);
        wideBounds(m, 'admintee');
        g.add(m); seated.group.add(g);
        const mixer = new THREE.AnimationMixer(m);
        const doze = mixer.clipAction(dozeClip);
        let hd = null; m.traverse(o => { if (o.isBone && !hd && HEAD_RE.test(o.name)) hd = o; });
        doze.play(); doze.time = dozeClip.duration * hash(i, 4);
        mixer.update(0.0001);
        /* hips on the bench: a seated take's legs fold under, so the man is
           grounded by his HIPS to the seat, not by his feet to the floor */
        m.updateMatrixWorld(true);
        let hip = null; m.traverse(o => { if (o.isBone && !hip && /Hips/.test(o.name)) hip = o; });
        if (hip) { hip.getWorldPosition(v); m.position.y += (TBL.seat + 0.10 - (v.y - g.position.y)) / s; }
        proxies[i].visible = false;
        seated.rigs.push({ g, m, mixer, doze, up: false, rate: 0.85 + hash(i, 9) * 0.3,
                           head: hd, group: g,
                           look: { want: 0, w: 0, x: 0, y: 0, saved: new THREE.Quaternion(), hasSaved: false } });
        doze.setEffectiveTimeScale(seated.rigs[i].rate);
      });
      seated.ready = true;
      redoShadows();
      try { dressHim(gltf, s); } catch (e) { console.warn('the sleeping admin tee failed', e); }   // v14.9 (a throw in a loader callback is silent — v12.2)
    }, (err) => { console.warn('admintee failed', err); seated.ready = true; }))
      .catch(err => { console.warn('admintee failed', err); seated.ready = true; });
    /* v13.0 (Chad: "when player talks to each bunkmate, their body position
       twitches and causes their legs to cut into the bench"). He is right and
       the cause is one clip change, measured on the shipped asset:

         Sit_and_Doze_Off    hips 0.641-0.647   lowest vertex 0.071 @ z 0.23
         Chair_Sit_Idle_M    hips 0.708-0.719   lowest vertex 0.100 @ z 0.02

       So the cut LIFTED THE WHOLE MAN 7.0 cm — that is the twitch — and pulled
       his feet 21 cm back under him into the bench he is sitting at. And a
       third defect neither of us had seen: Chair_Sit_Idle_M's head sits 0.52 m
       over its hips only in its first and last sixth and COLLAPSES to 0.26 in
       between (v8.0 measured this and called the take "not an idle"), so at
       rate 0.55 a line longer than ~2.9 s had him folding his head to his
       knees mid-sentence.

       Three defects, one cause, so the cure is to stop changing the clip. The
       doze take holds the hips rock-steady and the feet out where no bench is;
       a man who is asked ANSWERS WITH HIS HEAD — he turns it to the player for
       the length of his line, which is chapter 3's kneeling man (v11.4) — and
       stirs, because `rate` now nudges the doze rather than starting a second
       take. The API, the call sites and every timeline are unchanged. */
    function sitUp(i, secs, rate) {
      const r = seated.rigs[i];
      if (!r) return;
      r.look.want = 1;
      r.doze.setEffectiveTimeScale(r.rate * (1 + (rate || 0.55) * 0.5));
      r.up = true;
      if (secs > 0) after(secs, () => { if (r.up) sitDown(i); });
    }
    function sitDown(i) {
      const r = seated.rigs[i];
      if (!r) return;
      r.look.want = 0;
      r.doze.setEffectiveTimeScale(r.rate);
      r.up = false;
    }
    function allSitDown() { seated.rigs.forEach((r, i) => { if (r.up) sitDown(i); }); }
    /* v13.0: the answer, as a head turn. Ported from chapter 3's kneeling man
       (v11.4) with v11.5's law: a mixer only writes a bone when the value
       CHANGES, so last frame's offset has to be undone before the mixer runs
       or the additive turn stacks and the head spins. */
    const _lookP = new THREE.Vector3(), _lookH = new THREE.Vector3();
    function headUndo(r) { if (r.look.hasSaved && r.head) r.head.quaternion.copy(r.look.saved); }
    function headLook(r, dt) {
      const head = r.head; if (!head) return;
      r.look.saved.copy(head.quaternion); r.look.hasSaved = true;
      camera.getWorldPosition(_lookP); head.getWorldPosition(_lookH);
      const dx = _lookP.x - _lookH.x, dz = _lookP.z - _lookH.z, flat = Math.hypot(dx, dz);
      let dy = Math.atan2(dx, dz) - r.group.rotation.y; dy = Math.atan2(Math.sin(dy), Math.cos(dy));
      const YAW = 0.85, PIT = 0.36, EYE_UP = 0.11, DOWN_BIAS = 0.08;
      const w = r.look.w;
      const wy = Math.abs(dy) > YAW + 0.9 ? 0 : Math.max(-YAW, Math.min(YAW, dy));
      const wx = flat < 0.05 ? 0 : Math.max(-PIT, Math.min(PIT, Math.atan2(_lookP.y - (_lookH.y + EYE_UP), flat) - DOWN_BIAS));
      const k = Math.min(1, dt * 3.5);
      r.look.y += (wy * w - r.look.y) * k; r.look.x += (wx * w - r.look.x) * k;
      head.rotation.y += r.look.y;
      head.rotation.x += (-r.look.x - head.rotation.x) * 0.88 * w;
    }
    function seatLooks(dt) {
      for (const r of seated.rigs) {
        r.look.w += (r.look.want - r.look.w) * Math.min(1, dt * 2.4);
        if (r.look.w > 0.002 || Math.abs(r.look.y) > 0.002 || Math.abs(r.look.x) > 0.002) headLook(r, dt);
        else r.look.hasSaved = false;
      }
    }

    /* ----------------------------------------------------------- the encik */
    function mkRig(key, opts) {
      const group = new THREE.Group();
      group.position.set(opts.x, 0, opts.z); group.rotation.y = opts.ry || 0;
      world.add(group);
      const proxy = new THREE.Mesh(new THREE.CapsuleGeometry(0.2, opts.height - 0.4, 4, 8), matProxy);
      proxy.position.y = opts.height / 2; proxy.castShadow = !LOW; group.add(proxy);
      const rig = { key, group, proxy, model: null, mixer: null, acts: null, cur: null, head: null,
                    ready: false, height: opts.height, idle: opts.idle || null };
      rig.play = (name, ts = 1, fade = 0.34, once = false, at) => {
        if (!rig.mixer || !rig.acts || !rig.acts[name]) return false;
        if (rig.cur === name && at === undefined) return true;
        const nx = rig.acts[name], old = rig.cur && rig.cur !== name && rig.acts[rig.cur];
        nx.reset(); nx.setEffectiveTimeScale(ts); nx.setEffectiveWeight(1);
        nx.setLoop(once ? THREE.LoopOnce : THREE.LoopRepeat, Infinity);
        nx.clampWhenFinished = once;
        if (at !== undefined) {
          nx.play(); nx.time = nx.getClip().duration * at; nx.paused = true;
          for (const a of Object.values(rig.acts)) if (a !== nx) a.stop();
          rig.mixer.update(0);
        } else if (fade > 0) {
          nx.paused = false; nx.fadeIn(fade).play();
          if (old) old.fadeOut(fade);
        } else {
          nx.paused = false; nx.play();
          for (const a of Object.values(rig.acts)) if (a !== nx) a.stop();
          rig.mixer.update(0.0001);
        }
        rig.cur = name;
        return true;
      };
      assetBytes(key).then(BUF => new GLTFLoader().parse(BUF, '', (gltf) => {
        if (!alive) return;
        rescueTextures(gltf, BUF);
        const g = gltf.scene;
        g.traverse(o => { if (o.isMesh) { o.castShadow = !LOW; o.receiveShadow = false; } });
        wideBounds(g, key);
        group.add(g); rig.model = g;
        if (gltf.animations && gltf.animations.length) {
          rig.mixer = new THREE.AnimationMixer(g);
          rig.acts = {};
          for (const clip of gltf.animations) rig.acts[clip.name] = rig.mixer.clipAction(clip);
          if (opts.idle && rig.acts[opts.idle]) { rig.play(opts.idle, 1, 0); rig.mixer.update(0.001); }
        }
        g.updateMatrixWorld(true);
        const v = new THREE.Vector3(); let lo = Infinity, hi = -Infinity, crown = false;
        g.traverse(o => {
          if (!o.isBone) return;
          o.getWorldPosition(v); lo = Math.min(lo, v.y); hi = Math.max(hi, v.y);
          if (/HeadTop_End/.test(o.name)) crown = true;
          if (HEAD_RE.test(o.name) && !rig.head) rig.head = o;
        });
        if (isFinite(lo) && hi > lo) {
          const span = (hi - lo) / (crown ? 1 : 0.935);
          const s = opts.height / span;
          g.scale.setScalar(s); g.updateMatrixWorld(true);
          let lo2 = Infinity;
          g.traverse(o => { if (o.isBone) { o.getWorldPosition(v); lo2 = Math.min(lo2, v.y); } });
          g.position.y += -(lo2 - group.position.y);
        }
        proxy.visible = false; rig.ready = true; redoShadows();
        if (opts.onReady) opts.onReady(rig);                 // v10.8: the flagpole ghost takes its treatment the moment its bytes land
      }, (err) => { console.warn(key + ' failed to load', err); rig.ready = true; }))
        .catch(err => { console.warn(key + ' failed to load', err); rig.ready = true; });
      return rig;
    }
    const encik = mkRig('encik2', { x: ENC.x, z: ENC.z, ry: ENC.ry, height: 1.72, idle: 'Idle_9' });
    const ENC_TALK = ['Talk_with_Left_Hand_on_Hip', 'Talk_with_Left_Hand_Raised'];
    const putEncik = () => {
      encik.group.position.set(ENC.x, 0, ENC.z); encik.group.rotation.y = ENC.ry;
      if (encik.acts && encik.idle) encik.play(encik.idle, 1, 0);
    };

    /* ------------------------------------------- the ghost at the flagpole
       v10.8 (Chad): "add the ghostly soldier at the parade square flag pole,
       standing alone and looking into the cookhouse." The tenth man from
       chapter 1 — the same asset (`fbosling`, so no new download) and the
       same v9.6 look — stands on the tarmac 0.55 m in front of the flag
       stand's kerb (the kerb's front edge is z 36.75), just off the flag's
       own pole line, turned to face DOWN the square at the hall (a Mixamo rig
       faces +z at ry 0; the hall is at −z). He is simply there, all day, at
       the treatment's own alpha: a ghost who fades in under your eye is a
       special effect, one who is already there is the beat (v9.5). */
    /* At thirty metres a 1.74 m man is three degrees of a 72° lens — about
       twenty-five pixels on a phone — and the chapter 1 treatment (grey 0.62,
       alpha 0.55) photographed as a smudge against the block. This one is
       PALER and MORE OPAQUE (`look.alpha`), self-lit in the same cold blue-grey,
       so what survives the distance is a pale upright figure and not a stain. */
    const GHOST_A = 0.55;
    function ghostify(rig, look) {
      const grey = look && look.grey !== undefined ? look.grey : 0.35;
      const glow = look && look.glow !== undefined ? look.glow : 0x0a0c14;
      rig.ghostBase = look && look.alpha !== undefined ? look.alpha : GHOST_A;
      const mats = [];
      rig.model.traverse(o => {
        if (!o.isMesh) return;
        o.castShadow = false;
        for (const m of (Array.isArray(o.material) ? o.material : [o.material])) {
          m.transparent = true; m.opacity = rig.ghostBase; m.color.setScalar(grey);
          m.emissive?.setHex(glow); m.depthWrite = false;
          mats.push(m);
        }
      });
      rig.ghostMats = mats;
      if (rig.ghostA !== undefined) ghostAlpha(rig, rig.ghostA);
    }
    function ghostAlpha(rig, k) {
      rig.ghostA = k;
      if (rig.ghostMats) for (const m of rig.ghostMats) m.opacity = (rig.ghostBase || GHOST_A) * k;
      const on = k > 0.002;
      if (rig.group.visible !== on) rig.group.visible = on;
    }
    const FLAG_GHOST = { x: 0.9, z: 36.2, ry: Math.PI };
    const ghostFlag = mkRig('fbosling', { x: FLAG_GHOST.x, z: FLAG_GHOST.z, ry: FLAG_GHOST.ry, height: 1.74, idle: 'Idle_3',
      onReady: (r) => ghostify(r, { grey: 0.92, glow: 0x4a5c80, alpha: 0.82 }) });
    ghostFlag.proxy.visible = false;                     // never a green pill on the square while the bytes are in flight
    ghostFlag.ghostA = 1;

    /* ------------------------------------------------- OUTSIDE (v10.1) ---
       Chad: "should maybe show the parade square the same way it was built
       in ep 2 chp 1. The outside should have trees too." Past the +z parapet
       is THE PARADE SQUARE to chapter 1's recipe — tarmac, the bays as real
       geometry (v8.9's law: a 10 cm stripe on a tarmac tile is two texels),
       the far block with its bands and windows and stair tower, the flag
       stand with the drawn Singapore flag and its two unit flags, six
       street lights — turned so it lies along z from the hall. Past the −z
       parapet is the walkway, a grass verge and the BUNK BLOCKS: three
       storeys of balconies, the one the chapter's bunk is in. Everything
       out here is beyond the bounds, so none of it needs a blocker. */
    const nfm = (o) => new THREE.MeshStandardMaterial(Object.assign({}, o));
    const SQ = { z0: H.z + 1.6, z1: 52, w: 60 };
    {
      const walk = new THREE.Mesh(new THREE.PlaneGeometry(H.x * 2 + 8, 3.0), new THREE.MeshStandardMaterial({ map: terrazzo, color: 0xb8b4a8, roughness: 0.7 }));
      walk.rotation.x = -Math.PI / 2; walk.position.set(0, -0.005, H.z + 1.5); walk.receiveShadow = true; world.add(walk);
      const gr = new THREE.Mesh(new THREE.PlaneGeometry(220, 220), matGrass);
      gr.rotation.x = -Math.PI / 2; gr.position.set(0, -0.06, 20); gr.receiveShadow = true; world.add(gr);
      const sq = new THREE.Mesh(new THREE.PlaneGeometry(SQ.w, SQ.z1 - SQ.z0), matTarmac);
      sq.rotation.x = -Math.PI / 2; sq.position.set(0, -0.02, (SQ.z0 + SQ.z1) / 2); sq.receiveShadow = true; world.add(sq);
      // the bays: two rows back to back, one InstancedMesh, from z 20 on
      {
        const BAY_W = 2.5, BAY_D = 5.0, Z0 = 20, XN = 25;
        const divs = [];
        for (const zc of [Z0 + BAY_D / 2, Z0 + BAY_D * 1.5]) for (let x = -XN; x <= XN + 0.01; x += BAY_W) divs.push({ x, z: zc, w: 0.10, d: BAY_D });
        divs.push({ x: 0, z: Z0 + BAY_D, w: XN * 2, d: 0.10 });
        const bays = new THREE.InstancedMesh(new THREE.PlaneGeometry(1, 1), nfm({ color: 0x8e8f88, roughness: 0.95 }), divs.length);
        const mtx = new THREE.Matrix4(), q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 2);
        divs.forEach((d, i) => { mtx.compose(new THREE.Vector3(d.x, -0.011, d.z), q, new THREE.Vector3(d.w, d.d, 1)); bays.setMatrixAt(i, mtx); });
        bays.instanceMatrix.needsUpdate = true; bays.computeBoundingSphere(); world.add(bays);
      }
      // the far block the square ends on, 46 m wide, three storeys, a stair tower
      const bw = 46, bh = 11, bd = 10, bz = 46;
      const far = new THREE.Mesh(new THREE.BoxGeometry(bw, bh, bd), matBlock); far.position.set(0, bh / 2, bz); far.receiveShadow = true; world.add(far);
      const cap = new THREE.Mesh(new THREE.BoxGeometry(bw + 0.7, 0.5, bd + 0.7), nfm({ color: 0x8a9a7c, roughness: 0.9 })); cap.position.set(0, bh + 0.25, bz); world.add(cap);
      const tower = new THREE.Mesh(new THREE.BoxGeometry(9, bh + 3.2, bd + 0.6), matBlock); tower.position.set(-8, (bh + 3.2) / 2, bz); world.add(tower);
      const matBand = nfm({ color: 0xd79a52, roughness: 0.9 }), matPane = nfm({ color: 0x2a3a44, roughness: 0.35, metalness: 0.3 });
      for (let f = 0; f < 3; f++) {
        const y = 2.4 + f * 3.3;
        const bnd = new THREE.Mesh(new THREE.BoxGeometry(bw + 0.4, 0.3, 0.35), matBand); bnd.position.set(0, y + 1.5, bz - bd / 2 - 0.05); world.add(bnd);
        for (let i = 0; i < 13; i++) { const w = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.3, 0.22), matPane); w.position.set(-bw / 2 + 2.4 + i * 3.5, y, bz - bd / 2 - 0.08); world.add(w); }
      }
      const crest = new THREE.Mesh(new THREE.BoxGeometry(2.6, 1.8, 0.2), nfm({ color: 0xb03a34, roughness: 0.8 })); crest.position.set(-8, bh - 1.2, bz - bd / 2 - 0.16); world.add(crest);
    }
    /* THE FLAG STAND (v9.3/v9.4's recipe, turned): a stepped plinth in front
       of the block, the Singapore flag drawn, two unit flags flanking it,
       every flag waving by its own vertices. */
    const sqFlags = [], sqLampMats = [], sqPools = [];
    {
      const SG_RED = '#ee2536';
      const flagTex = (fn) => { const t = paint(256, fn, null); madeTex.push(t); return t; };
      const sgFlag = flagTex((cx, S) => {
        const W = S, Hh = S * 2 / 3, y0 = (S - Hh) / 2;
        cx.fillStyle = '#0b0b0b'; cx.fillRect(0, 0, S, S);
        cx.fillStyle = '#ffffff'; cx.fillRect(0, y0, W, Hh);
        cx.fillStyle = SG_RED;   cx.fillRect(0, y0, W, Hh / 2);
        const cy = y0 + Hh / 4, k = W / 384;
        cx.fillStyle = '#ffffff'; cx.beginPath(); cx.arc(62 * k, cy, 42 * k, 0, Math.PI * 2); cx.fill();
        cx.fillStyle = SG_RED;    cx.beginPath(); cx.arc(80 * k, cy, 35 * k, 0, Math.PI * 2); cx.fill();
        cx.fillStyle = '#ffffff';
        for (let i = 0; i < 5; i++) {
          const a = -Math.PI / 2 + i * Math.PI * 2 / 5, sx = 110 * k + Math.cos(a) * 22 * k, sy = cy + Math.sin(a) * 22 * k;
          cx.beginPath();
          for (let j = 0; j < 10; j++) { const r = (j % 2 ? 4.6 : 10.5) * k, t = -Math.PI / 2 + j * Math.PI / 5; const px = sx + Math.cos(t) * r, py = sy + Math.sin(t) * r; j ? cx.lineTo(px, py) : cx.moveTo(px, py); }
          cx.closePath(); cx.fill();
        }
      });
      const unitFlag = (field) => flagTex((cx, S) => {
        const Hh = S * 2 / 3, y0 = (S - Hh) / 2;
        cx.fillStyle = '#0b0b0b'; cx.fillRect(0, 0, S, S);
        cx.fillStyle = field; cx.fillRect(0, y0, S, Hh);
        cx.fillStyle = '#c8a23c'; cx.fillRect(S - S * 0.055, y0, S * 0.055, Hh);
      });
      const matPoleF = nfm({ color: 0xe8e8e2, roughness: 0.5, metalness: 0.2 });
      const matFinial = nfm({ color: 0xc8a23c, roughness: 0.4, metalness: 0.7 });
      const matIsland = nfm({ color: 0xbdbcb2, roughness: 0.95 });
      const PLINTH = { x: 0, z: 38.5, step: 0.19, top: 0.34 };
      const kerb = new THREE.Mesh(new THREE.BoxGeometry(6.2, PLINTH.step, 3.5), matIsland); kerb.position.set(PLINTH.x, PLINTH.step / 2, PLINTH.z); world.add(kerb);
      const deck = new THREE.Mesh(new THREE.BoxGeometry(5.0, PLINTH.top - PLINTH.step, 2.5), nfm({ color: 0xc9c8bd, roughness: 0.9 })); deck.position.set(PLINTH.x, (PLINTH.step + PLINTH.top) / 2, PLINTH.z); world.add(deck);
      const POLES = [{ x: -1.35, h: 8.6, fw: 2.45, tex: null }, { x: 0, h: 9.4, fw: 2.70, tex: sgFlag }, { x: 1.35, h: 8.6, fw: 2.45, tex: null }];
      POLES.forEach((P, pi) => {
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.052, 0.082, P.h, 8), matPoleF); pole.position.set(P.x, PLINTH.top + P.h / 2, PLINTH.z); world.add(pole);
        const fin = new THREE.Mesh(new THREE.SphereGeometry(0.10, 8, 6), matFinial); fin.position.set(P.x, PLINTH.top + P.h + 0.09, PLINTH.z); world.add(fin);
        /* v10.2 (Chad): only the Singapore flag flies — the two flanking
           poles keep their finials and stand bare, the same in both squares */
        if (pi !== 1) return;
        const fh = P.fw * 2 / 3;
        const geo = new THREE.PlaneGeometry(P.fw, fh, 14, 4); geo.translate(P.fw / 2, 0, 0);
        const fm = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ map: P.tex, roughness: 0.85, side: THREE.DoubleSide, emissive: new THREE.Color(0xffffff), emissiveMap: P.tex, emissiveIntensity: 0.25 }));
        fm.position.set(P.x, PLINTH.top + P.h - 0.28 - fh / 2, PLINTH.z);
        fm.rotation.y = 0;                                // its face across the square, toward the hall
        fm.userData.moves = true;
        world.add(fm);
        sqFlags.push({ mesh: fm, w: P.fw, base: geo.attributes.position.array.slice(), ph: pi * 1.7 });
      });
      // the street lights: two rows of three, heads over the square (dark by day; their pools painted faint)
      const matLampPole = nfm({ color: 0x9aa0a2, roughness: 0.6, metalness: 0.35 });
      for (const lx of [-12, 12]) {
        const inward = lx > 0 ? -1 : 1;
        for (const lz of [14, 22, 30]) {
          const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.13, 7.0, 8), matLampPole); pole.position.set(lx, 3.5, lz); world.add(pole);
          const base = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.28, 0.30, 8), matIsland); base.position.set(lx, 0.15, lz); world.add(base);
          const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.7, 6), matLampPole); arm.position.set(lx + inward * 0.80, 6.92, lz); arm.rotation.z = -Math.PI / 2 + inward * 0.18; world.add(arm);
          const headMat = nfm({ color: 0x8d9294, roughness: 0.5, emissive: new THREE.Color(0xffd089), emissiveIntensity: 0 });
          const head = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.16, 0.34), headMat); head.position.set(lx + inward * 1.58, 6.78, lz); world.add(head);
          sqLampMats.push(headMat);
        }
      }
    }
    /* THE BUNK BLOCKS past the −z side: the storeys of balconies the men
       sleep behind — cream, ochre bands, the balcony rails, a stair tower —
       with a water tank on the roof and a verge in front. */
    {
      const bz = -26, bw = 44, bh = 12.5, bd = 12;
      const blk = new THREE.Mesh(new THREE.BoxGeometry(bw, bh, bd), matBlock); blk.position.set(2, bh / 2, bz); blk.receiveShadow = true; world.add(blk);
      const matBand = nfm({ color: 0xd79a52, roughness: 0.9 }), matRail = nfm({ color: 0x6a7076, roughness: 0.6, metalness: 0.4 });
      for (let f = 0; f < 3; f++) {
        const y = 0.2 + f * 4.0;
        const slab = new THREE.Mesh(new THREE.BoxGeometry(bw, 0.25, 2.4), matBlock); slab.position.set(2, y + 3.9, bz + bd / 2 + 1.2); world.add(slab);
        const rail = new THREE.Mesh(new THREE.BoxGeometry(bw, 1.0, 0.12), matRail); rail.position.set(2, y + 4.5, bz + bd / 2 + 2.35); world.add(rail);
        const bnd = new THREE.Mesh(new THREE.BoxGeometry(bw + 0.3, 0.3, 0.3), matBand); bnd.position.set(2, y + 2.2, bz + bd / 2 + 0.05); world.add(bnd);
        for (let i = 0; i < 11; i++) { const w = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.3, 0.2), nfm({ color: 0x2a3a44, roughness: 0.35 })); w.position.set(2 - bw / 2 + 2.5 + i * 4.0, y + 1.6 + 3.9 - 3.9, bz + bd / 2 + 0.05); w.position.y = y + 2.9 - 1.3; world.add(w); }
      }
      const tower = new THREE.Mesh(new THREE.BoxGeometry(8, bh + 3, bd + 3), matBlock); tower.position.set(-16, (bh + 3) / 2, bz); world.add(tower);
      const tank = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.6, 2.2, 14), nfm({ color: 0xcfd4d6, roughness: 0.5, metalness: 0.3 })); tank.position.set(12, bh + 1.1, bz); world.add(tank);
      const walk = new THREE.Mesh(new THREE.PlaneGeometry(H.x * 2 + 8, 3.0), new THREE.MeshStandardMaterial({ map: terrazzo, color: 0xb8b4a8, roughness: 0.7 }));
      walk.rotation.x = -Math.PI / 2; walk.position.set(0, -0.005, -H.z - 1.5); walk.receiveShadow = true; world.add(walk);
      const road = new THREE.Mesh(new THREE.PlaneGeometry(70, 6), matTarmac); road.rotation.x = -Math.PI / 2; road.position.set(0, -0.02, -14); world.add(road);
    }
    /* THE TREES: Chad's kit (v6.15/v6.17), dealt from seed 11 — along both
       sides of the square, round the far block's ends, along the road and
       the ends of the hall. Every spot is outside the far block's box
       (x −23…23, z 41…51), the bunk block's (x −20…24, z −32…−20) and the
       hall's own walkways. */
    const TREE_AT = [
      [-28, 14], [-28, 22], [-29, 30], [-28, 38], [-27, 46], [28, 14], [28, 22], [29, 30], [28, 38], [27, 46],
      [-31, 52], [31, 52], [-24, 56], [24, 56], [0, 58], [-12, 57], [12, 57],
      [-14, -12], [-8, -13], [8, -13], [14, -12], [-24, -12], [26, -10], [-30, -22], [30, -22], [-28, -35], [30, -36],
      [-14, 5], [-14, -3], [14, 5], [14, -3], [-16, 10], [16, 10], [-26, 8]
    ];
    const treeStand = plantTrees ? plantTrees(world, TREE_AT.map(([x, z], i) => ({ x, z, h: 6.6 + ((i * 29) % 9) * 0.3 })),
      { seed: 11, tint: new THREE.Color(0.96, 1.0, 0.92), roughness: 0.94, lowKeep: 0.55 }) : null;

    /* ------------------------------------------------ THE NIGHT POCKET
       v10.1: THE WHOLE BUNK. Chad, on v10.0: "The intro cutscene of ep2 chp2
       flashback scenes must look exactly to how it was built in ep2 chp1
       with the bunkmates sleeping on the beds, right now it looks completely
       different." v10.0 had built a corner — one bed, two walls, a door —
       and shot it from four angles, and from the pillow a corner is a
       different room. So the room is chapter 1's, TO ITS OWN NUMBERS
       (`R`, `DOOR_WC`, `OPEN`, `BLOCK`, `BED`, the two bed rows, the locker
       rows, `HIS`), rebuilt eighty metres off the cookhouse and outside the
       bounds: nine of Chad's bunks with the pillows to their walls, the
       lockers with the packs on top, the long table with the chairs stacked
       on it, the five windows, the three fans, the paired tubes (dark), the
       board, the clock over the block door, the dressing on the −z wall,
       the tiled block with its cubicles and the far shower — and the eight
       men asleep in it, four statues and four who breathe, dealt exactly as
       chapter 1 deals them. Every material is fog-free (the memory-bubble
       recipe), because the film shoots it under NIGHT fog from eighty
       metres out. What is NOT here is what nobody sleeping can see: the
       parade square outside the balcony, and the day cast. */
    const pocket = new THREE.Group();
    pocket.position.set(PK.x, 0, PK.z);
    pocket.visible = false;
    world.add(pocket);
    const nf = (o) => new THREE.MeshStandardMaterial(Object.assign({ fog: false }, o));
    const R = { x: 6.0, z: 4.0, h: 3.0, wall: 0.16 };
    const DOOR_WC = { x: -3.3, w: 0.9, h: 2.05 };
    const OPEN = { z0: -1.2, z1: 1.2, h: 2.2 };
    const BLOCK = { x0: -6.0, x1: -0.5, z0: 4.0, z1: 7.5 };
    const BALC = { x0: 6.0, x1: 8.4, z0: -6.0, z1: 6.0 };
    const BED = { len: 1.9, wid: 0.9, low: 0.55, high: 1.55, post: 1.9 };
    const ROW_X = [-4.6, 4.6], ROW_Z_W = [-3.0, -1.5, 0, 1.5, 3.0], ROW_Z_BALC = [-3.35, -2.2, 2.2, 3.35];
    const LOCK_Z = [-2.25, -0.75, 0.75, 2.25], LOCK_Z_BALC = [-1.5, 1.5];
    const bedZs = rx => (rx < 0 ? ROW_Z_W : ROW_Z_BALC);
    const lockZs = rx => (rx < 0 ? LOCK_Z : LOCK_Z_BALC);
    const HIS = { x: -4.6, z: 3.0 };
    const wallMap = cTex ? cTex.map.clone() : null; if (wallMap) { wallMap.needsUpdate = true; wallMap.repeat.set(4.0, 1.5); }
    const pWall = nf(wallMap ? { map: wallMap, color: 0xd9d1bc, roughness: 0.96 } : { color: 0xbdb6a4, roughness: 0.96 });
    const pCeil = nf({ color: 0xd6d2c8, roughness: 0.99 });
    const pFloor = nf({ map: terrazzo, color: 0x8a8a86, roughness: 0.6 });
    const pTile = nf({ map: tileTex, roughness: 0.35, metalness: 0.04 });
    const pTileFloor = nf({ map: tileTex.clone(), color: 0xb9bcb8, roughness: 0.5 }); pTileFloor.map.needsUpdate = true; pTileFloor.map.repeat.set(8, 6); madeTex.push(pTileFloor.map);
    const pMetal = nf({ color: 0x5a6068, roughness: 0.45, metalness: 0.75 });
    const pLocker = nf({ color: 0x8a8f8a, roughness: 0.6, metalness: 0.5 });
    const pMattress = nf({ color: 0x2f4a3c, roughness: 0.95 });
    const pBlanket = nf({ color: 0x3a5a48, roughness: 0.98 });
    const pPillow = nf({ color: 0xe8e2d2, roughness: 0.95 });
    const pBlade = nf({ color: 0xe0dccf, roughness: 0.7 });
    const pTube = nf({ color: 0xffffff, emissive: 0xfff6e6, emissiveIntensity: 0, roughness: 0.4 });
    const pDoor = nf({ color: 0x6f7a72, roughness: 0.7 });
    const pDrain = nf({ color: 0x1a1c1e, roughness: 0.4, metalness: 0.6 });
    const pClock = nf({ map: clock.tex, emissiveMap: clock.tex, emissive: 0xffffff, emissiveIntensity: 0.30, roughness: 0.85, transparent: true });
    const pBoard = nf({ map: boardTex, roughness: 0.9 });
    const pGlass = nf({ map: winView, emissiveMap: winView, color: 0x0b1220, emissive: 0x14203a, emissiveIntensity: 0.35, roughness: 0.3 });
    const pFrame = nf({ color: 0x22262a, roughness: 0.55, metalness: 0.35 });
    const pbox = (w, h, d, x, y, z, mat, parent = pocket) => box(w, h, d, x, y, z, mat, parent);
    // floor, ceiling, the four walls
    const pf = new THREE.Mesh(new THREE.PlaneGeometry(R.x * 2, R.z * 2), pFloor); pf.rotation.x = -Math.PI / 2; pf.receiveShadow = true; pocket.add(pf);
    const pc = new THREE.Mesh(new THREE.PlaneGeometry(R.x * 2 + 0.4, R.z * 2), pCeil); pc.rotation.x = Math.PI / 2; pc.position.y = R.h; pocket.add(pc);
    pbox(R.x * 2, R.h, R.wall, 0, R.h / 2, -R.z - R.wall / 2, pWall);                                     // −z, solid
    { const z = R.z + R.wall / 2, l = DOOR_WC.x - DOOR_WC.w / 2, r = DOOR_WC.x + DOOR_WC.w / 2;             // +z with the block door
      pbox(l + R.x, R.h, R.wall, (-R.x + l) / 2, R.h / 2, z, pWall);
      pbox(R.x - r, R.h, R.wall, (r + R.x) / 2, R.h / 2, z, pWall);
      pbox(DOOR_WC.w, R.h - DOOR_WC.h, R.wall, DOOR_WC.x, (R.h + DOOR_WC.h) / 2, z, pWall); }
    pbox(R.wall, R.h, R.z * 2, -R.x - R.wall / 2, R.h / 2, 0, pWall);                                     // −x, solid
    { const x = R.x + R.wall / 2;                                                                          // +x with the balcony opening
      pbox(R.wall, R.h, OPEN.z0 + R.z, x, R.h / 2, (-R.z + OPEN.z0) / 2, pWall);
      pbox(R.wall, R.h, R.z - OPEN.z1, x, R.h / 2, (OPEN.z1 + R.z) / 2, pWall);
      pbox(R.wall, R.h - OPEN.h, OPEN.z1 - OPEN.z0, x, (R.h + OPEN.h) / 2, (OPEN.z0 + OPEN.z1) / 2, pWall); }
    // the block door, hinged on the −x side; NEGATIVE swings into the block (v9.1's measurement)
    const doorPivot = new THREE.Group();
    doorPivot.position.set(DOOR_WC.x - DOOR_WC.w / 2, 0, R.z + R.wall / 2); pocket.add(doorPivot);
    pbox(DOOR_WC.w, DOOR_WC.h, 0.05, DOOR_WC.w / 2, DOOR_WC.h / 2, 0, pDoor, doorPivot);
    const DOOR_AJAR = -0.14, DOOR_OPEN = -0.62;
    doorPivot.rotation.y = DOOR_AJAR;
    /* THE BEDS — chapter 1's mkBed, primitives hidden the moment the model
       lands, `deckTop` measured off the model, everything that lies on a
       deck registered on `restOn` so the loaders may land in any order. */
    const beds = [];
    const bedGeo = { post: new THREE.BoxGeometry(0.05, BED.post, 0.05), rail: new THREE.BoxGeometry(BED.len, 0.05, 0.05), railEnd: new THREE.BoxGeometry(0.05, 0.05, BED.wid),
                     mat: new THREE.BoxGeometry(BED.len - 0.04, 0.14, BED.wid - 0.04), pillow: new THREE.BoxGeometry(0.42, 0.09, 0.62) };
    function mkBed(x, z, head) {
      const g = new THREE.Group(); g.position.set(x, 0, z); pocket.add(g);
      const hx = BED.len / 2, hz = BED.wid / 2;
      const sup = [];
      for (const [px, pz] of [[-hx, -hz], [hx, -hz], [-hx, hz], [hx, hz]]) { const p = new THREE.Mesh(bedGeo.post, pMetal); p.position.set(px, BED.post / 2, pz); g.add(p); sup.push(p); }
      const decks = {};
      for (const [name, y] of [['low', BED.low], ['high', BED.high]]) {
        for (const pz of [-hz, hz]) { const r = new THREE.Mesh(bedGeo.rail, pMetal); r.position.set(0, y - 0.1, pz); g.add(r); sup.push(r); }
        for (const px of [-hx, hx]) { const r = new THREE.Mesh(bedGeo.railEnd, pMetal); r.position.set(px, y - 0.1, 0); g.add(r); sup.push(r); }
        const m = new THREE.Mesh(bedGeo.mat, pMattress); m.position.set(0, y - 0.07, 0); m.receiveShadow = true; g.add(m); sup.push(m);
        const pw = new THREE.Mesh(bedGeo.pillow, pPillow); pw.position.set(head * (hx - 0.28), y + 0.045, 0); g.add(pw); sup.push(pw);
        decks[name] = { mattress: m, pillow: pw, y };
      }
      // v13.0: no boots under the beds — the room this pocket copies has none
      const b = { x, z, group: g, low: decks.low, high: decks.high, head, his: (x === HIS.x && z === HIS.z), supersede: sup, deckTop: BED.low, restOn: [], model: null };
      beds.push(b); return b;
    }
    for (const rx of ROW_X) for (const rz of bedZs(rx)) mkBed(rx, rz, rx < 0 ? -1 : 1);
    const hisBed = beds.find(b => b.his);
    function restOnDeck(b, obj, dy) { b.restOn.push({ obj, dy }); obj.position.y = b.deckTop + dy; }
    function settleBed(b) { for (const r of b.restOn) r.obj.position.y = b.deckTop + r.dy; }
    // the blanket over HIM, from the pillow, for the shots from his pillow
    const blanket = pbox(0.95, 0.06, BED.wid - 0.06, -hisBed.head * 0.32, 0, 0, pBlanket, hisBed.group);
    blanket.visible = false; restOnDeck(hisBed, blanket, 0.07);
    /* v14.9 HIM, ASLEEP IN BED ONE — for the FILM only (Chad: "all the
       various camera angles, should also have a sleeping admin tee model on
       bed one. This is to illustrate the player being bothered by it every
       night"). The admin tee, one more clone of the cookhouse's parse (made
       in its loader, `dressHim`), parked on its standing idle and laid on his
       back, head on the pillow, and NO blanket (Chad: "No need for blanket,
       it looks weird") — the flat one hides while he shows. `himRoot`
       is at the pocket's origin so the painted shadow can share it; nothing
       but the film shows it — scene C's cut back to three in the morning is
       shot FROM his pillow, where a body would be around the lens. */
    const HIM_TILT = 0.06, HIM_CROWN = 0.10, HIM_SINK = 0.04;   // head a touch up the pillow; crown 10 cm off the bed's end
    const himRoot = new THREE.Group(); himRoot.visible = false; pocket.add(himRoot);
    const himBody = new THREE.Group(); himBody.position.set(HIS.x, 0, HIS.z); himRoot.add(himBody);
    restOnDeck(hisBed, himBody, 0);
    const him = { model: null, mixer: null, body: himBody };
    function showHim(on) { himRoot.visible = !!on; blanket.visible = !on && pocket.visible; }   // the flat blanket would lie through him
    function dressHim(gltf, s) {
      if (!alive) return;
      const m = cloneSkinned(gltf.scene);
      wideBounds(m, 'admintee');
      m.traverse(o => {
        if (!o.isMesh) return;
        o.castShadow = !LOW; o.receiveShadow = false;
        o.material = Array.isArray(o.material) ? o.material.map(mm => { const c = mm.clone(); c.fog = false; return c; })
                                               : Object.assign(o.material.clone(), { fog: false });
      });
      const turn = new THREE.Group(); turn.rotation.y = -hisBed.head * Math.PI / 2; turn.scale.setScalar(s);
      turn.add(m); himBody.add(turn);
      /* the standing idle's first frame, applied ONCE and never ticked again */
      const idle = gltf.animations.find(a => a.name === 'Idle_9');
      if (idle) { him.mixer = new THREE.AnimationMixer(m); him.mixer.clipAction(idle).play(); him.mixer.update(0); }
      /* laid down BY THE HIPS: a skinned body is drawn from its bones, so the
         turn goes on the root bone, never on a group above the mesh. A
         Mixamo rig stands on +y facing +z; −π/2 about the turn's own x puts
         his face to the ceiling and his head toward −z, and the turn about y
         takes that end to the pillow (−x on this row). */
      himBody.updateWorldMatrix(true, true);
      let hips = null; m.traverse(o => { if (!hips && o.isBone && /Hips/.test(o.name)) hips = o; });
      if (hips) {
        const Q = THREE.Quaternion;
        const axis = new THREE.Vector3(1, 0, 0).applyQuaternion(turn.getWorldQuaternion(new Q()));
        const qLie = new Q().setFromAxisAngle(axis, -Math.PI / 2 + HIM_TILT);
        const qw = hips.getWorldQuaternion(new Q());
        const pq = hips.parent.getWorldQuaternion(new Q()).invert();
        hips.quaternion.copy(pq.multiply(qLie.multiply(qw)));
      }
      /* measured on the POSED skin (never a box — v5.21), in the bed's frame.
         `updateMatrixWorld`, NOT `updateWorldMatrix`: only the former reaches
         SkinnedMesh's override that refreshes `bindMatrixInverse`, and with it
         stale `getVertexPosition` answers in the frame the clone was MADE in —
         the first placement put him eighty metres off, at the cookhouse. */
      himBody.updateWorldMatrix(true, false); himBody.updateMatrixWorld(true);
      const v = new THREE.Vector3(), bb = new THREE.Box3();
      m.traverse(o => { if (!o.isSkinnedMesh) return; const pa = o.geometry.attributes.position; for (let k = 0; k < pa.count; k += 5) { o.getVertexPosition(k, v); v.applyMatrix4(o.matrixWorld); himBody.worldToLocal(v); bb.expandByPoint(v); } });
      const crown = hisBed.head < 0 ? bb.min.x : bb.max.x;
      turn.position.set(hisBed.head * (BED.len / 2 - HIM_CROWN) - crown, -bb.min.y - HIM_SINK, -(bb.min.z + bb.max.z) / 2);
      him.model = m; him.box = { len: +(bb.max.x - bb.min.x).toFixed(3), wid: +(bb.max.z - bb.min.z).toFixed(3), thick: +(bb.max.y - bb.min.y).toFixed(3) };
      himBody.updateMatrixWorld(true);
      sleepShade(himRoot, himBody, hisBed);
      redoShadows();
    }
    const BUNK = { len: 2.004, wid: 1.313, deckLo: 0.592, deckHi: 1.575 };
    const BUNK_SX = BED.len / BUNK.len, BUNK_SZ = BED.wid / BUNK.wid;
    const BUNK_SY = (BED.high - BED.low) / (BUNK.deckHi - BUNK.deckLo);
    const BUNK_DY = BED.low - BUNK.deckLo * BUNK_SY;
    assetBytes('bunkbed').then(BUF => new GLTFLoader().parse(BUF, '', (gltf) => {
      if (!alive) return;
      rescueTextures(gltf, BUF);
      const src = gltf.scene;
      src.traverse(o => { if (o.isMesh) { o.castShadow = !LOW; o.receiveShadow = true; for (const mm of (Array.isArray(o.material) ? o.material : [o.material])) mm.fog = false; } });
      beds.forEach((b, i) => {
        const m = i === 0 ? src : src.clone(true);
        m.scale.set(BUNK_SX, BUNK_SY, BUNK_SZ); m.position.set(0, BUNK_DY, 0); m.rotation.y = b.head > 0 ? Math.PI : 0;
        b.group.add(m); b.model = m;
        for (const o of b.supersede) o.visible = false;
        m.updateWorldMatrix(true, true);                 // v9.2: the matrices first, or the child reads a stale parent
        const bb = new THREE.Box3();
        m.traverse(o => { if (!o.isMesh) return; const ob = new THREE.Box3().setFromObject(o); if (ob.max.y < 1.0 && ob.max.y > 0.3) bb.union(ob); });   // the pocket sits at y 0, so world y IS local y
        if (!bb.isEmpty()) b.deckTop = bb.max.y;
        settleBed(b);
      });
      redoShadows();
    })).catch(() => {});
    // lockers between the beds (v13.0: no pack on top — see e2c1)
    for (const rx of ROW_X) for (const lz of lockZs(rx)) {
      const lx = rx < 0 ? -R.x + 0.27 : R.x - 0.27;
      pbox(0.5, 1.8, 0.5, lx, 0.9, lz, pLocker);
      const seam = new THREE.Mesh(new THREE.PlaneGeometry(0.02, 1.7), nf({ color: 0x2a2d2a, roughness: 0.9 }));
      seam.position.set(rx < 0 ? -R.x + 0.53 : R.x - 0.53, 0.9, lz); seam.rotation.y = rx < 0 ? Math.PI / 2 : -Math.PI / 2; pocket.add(seam);
    }
    // the long table down the middle with three stacks of chairs (v7.9)
    { const TAB = { x: 0, z: 2.55, len: 3.60, dep: 0.75, top: 0.735 };
      const pTable = nf({ color: 0xd7cfbb, roughness: 0.7 }), pChair = nf({ color: 0xb08a52, roughness: 0.8 });
      pbox(TAB.len, 0.05, TAB.dep, TAB.x, TAB.top, TAB.z, pTable);
      for (const lx of [-TAB.len / 2 + 0.18, TAB.len / 2 - 0.18]) for (const lz of [-0.27, 0.27]) { const lg = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.71, 8), pMetal); lg.position.set(TAB.x + lx, 0.355, TAB.z + lz); pocket.add(lg); }
      for (const sx of [-1.15, 0, 1.15]) {
        for (const cx of [-0.17, 0.17]) for (const cz of [-0.17, 0.17]) pbox(0.035, 0.42, 0.035, TAB.x + sx + cx, 0.97, TAB.z + cz, pMetal);
        for (let i = 0; i < 3; i++) {
          const st = pbox(0.40, 0.035, 0.40, TAB.x + sx + 0.012 * i, 1.18 + i * 0.085, TAB.z, pChair); st.rotation.y = 0.025 * i;
          const bk = pbox(0.40, 0.36, 0.035, TAB.x + sx + 0.012 * i, 1.38 + i * 0.085, TAB.z + 0.185, pChair); bk.rotation.y = 0.025 * i; bk.rotation.x = 0.12;
        }
      }
    }
    // the five windows on the −x wall, dark glass with the night's blue in it
    { const WIN = { w: 1.30, h: 1.30, y: 1.72 };
      for (const wz of ROW_Z_W) {
        const gl = new THREE.Mesh(new THREE.PlaneGeometry(WIN.w, WIN.h), pGlass); gl.position.set(-R.x + 0.012, WIN.y, wz); gl.rotation.y = Math.PI / 2; pocket.add(gl);
        for (const dy of [-WIN.h / 2, WIN.h / 2]) pbox(0.04, 0.06, WIN.w + 0.09, -R.x + 0.02, WIN.y + dy, wz, pFrame);
        for (const dz of [-WIN.w / 2, WIN.w / 2]) pbox(0.04, WIN.h + 0.09, 0.06, -R.x + 0.02, WIN.y, wz + dz, pFrame);
        pbox(0.03, 0.045, WIN.w, -R.x + 0.02, WIN.y + 0.10, wz, pFrame);
        pbox(0.03, WIN.h, 0.045, -R.x + 0.02, WIN.y, wz, pFrame);
      }
    }
    // the −z wall's dressing (v9.1): a rail of hooks, two towels, a first-aid box; the extinguisher and the bin
    { const pRail = nf({ color: 0x8d949a, roughness: 0.5, metalness: 0.5 });
      pbox(1.5, 0.035, 0.035, 0, 1.72, -R.z + 0.07, pRail);
      for (const hx of [-0.6, -0.3, 0, 0.3, 0.6]) pbox(0.022, 0.09, 0.022, hx, 1.67, -R.z + 0.10, pRail);
      [[-0.3, 0x9fb0a4], [0.3, 0x6f7f92]].forEach(([tx, c], i) => { const tw = pbox(0.30, 0.62, 0.045, tx, 1.35, -R.z + 0.10, nf({ color: c, roughness: 0.95 })); tw.rotation.z = i ? 0.03 : -0.04; });
      pbox(0.34, 0.30, 0.13, 1.05, 1.62, -R.z + 0.08, nf({ color: 0xe6e2d6, roughness: 0.7 }));
      pbox(0.16, 0.045, 0.01, 1.05, 1.62, -R.z + 0.145, nf({ color: 0xb8241c, roughness: 0.6 }));
      pbox(0.045, 0.16, 0.01, 1.05, 1.62, -R.z + 0.145, nf({ color: 0xb8241c, roughness: 0.6 }));
      const ext = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.5, 12), nf({ color: 0xb8241c, roughness: 0.45, metalness: 0.3 })); ext.position.set(-0.85, 0.95, -R.z + 0.14); pocket.add(ext);
      const bin = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.15, 0.56, 14), nf({ color: 0x4a5a4e, roughness: 0.7 })); bin.position.set(-1.4, 0.28, -R.z + 0.36); pocket.add(bin);
      const bucket = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.13, 0.28, 12), nf({ color: 0xd9b23a, roughness: 0.6 })); bucket.position.set(DOOR_WC.x + 0.85, 0.14, R.z - 0.3); pocket.add(bucket);
      const brd = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 0.95), pBoard); brd.position.set(2.0, 1.55, -R.z + 0.01); pocket.add(brd);
    }
    // three fans, the paired tubes (off — it is three in the morning), the clock over the block door
    const fanBlades = [];
    for (const fz of [-2.4, 0, 2.4]) {
      const f = new THREE.Group(); f.position.set(0, R.h - 0.16, fz); pocket.add(f);
      const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.12, 12), pMetal); f.add(hub);
      const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.16, 8), pMetal); rod.position.y = 0.12; f.add(rod);
      const bl = new THREE.Group(); f.add(bl); bl.userData.moves = true;
      for (let i = 0; i < 3; i++) { const b = pbox(0.62, 0.012, 0.11, Math.cos(i * 2.094) * 0.36, -0.02, Math.sin(i * 2.094) * 0.36, pBlade, bl); b.rotation.y = -i * 2.094; b.rotation.z = 0.12; }
      fanBlades.push(bl);
    }
    for (const [tx, tz] of [[-2.6, -2.4], [2.6, -2.4], [-2.6, 2.0], [2.6, 2.0]]) {
      pbox(1.3, 0.035, 0.30, tx, R.h - 0.012, tz, nf({ color: 0xdedad0, roughness: 0.8 }));
      for (const dz of [-0.075, 0.075]) pbox(1.2, 0.05, 0.09, tx, R.h - 0.055, tz + dz, pTube);
    }
    const clockFace = new THREE.Mesh(new THREE.PlaneGeometry(0.30, 0.30), pClock);
    clockFace.position.set(DOOR_WC.x, 2.55, R.z - 0.01); clockFace.rotation.y = Math.PI; pocket.add(clockFace);
    // the balcony beyond the +x opening: a slab, a roof, the columns, dark beyond it
    { const bfl = new THREE.Mesh(new THREE.PlaneGeometry(BALC.x1 - BALC.x0, BALC.z1 - BALC.z0), nf({ map: terrazzo, color: 0x6a6862, roughness: 0.7 }));
      bfl.rotation.x = -Math.PI / 2; bfl.position.set((BALC.x0 + BALC.x1) / 2, 0.001, 0); pocket.add(bfl);
      pbox(BALC.x1 - BALC.x0 + 0.2, 0.25, BALC.z1 - BALC.z0, (BALC.x0 + BALC.x1) / 2, R.h + 0.12, 0, pCeil);
      for (const cz of [BALC.z0 + 0.3, BALC.z1 - 0.3]) pbox(0.3, R.h, 0.3, BALC.x1 - 0.15, R.h / 2, cz, pWall);
      for (const ez of [BALC.z0, BALC.z1]) pbox(BALC.x1 - BALC.x0, R.h, 0.2, (BALC.x0 + BALC.x1) / 2, R.h / 2, ez, pWall);
      pbox(0.2, 8, 30, BALC.x1 + 6, 3, 0, nf({ color: 0x05070c, roughness: 1 }));   // the night past the balcony
    }
    /* THE BLOCK: tile floor and walls, the doorway cut through the shared
       wall (v9.1), three partitions, four shower heads, the drain, and the
       far cubicle's WATER — drops, a streak sheet, a puddle — hidden until
       the night turns it on. */
    const WATER_AT = { x: BLOCK.x0 + 0.65 + 1.35 * 3, z: BLOCK.z1 - 0.18 };
    { const bx = (BLOCK.x0 + BLOCK.x1) / 2, bw = BLOCK.x1 - BLOCK.x0, bd = BLOCK.z1 - BLOCK.z0, bz2 = (BLOCK.z0 + BLOCK.z1) / 2;
      const wz0 = BLOCK.z0 + R.wall, wd = BLOCK.z1 - wz0, wz = (wz0 + BLOCK.z1) / 2;
      const f = new THREE.Mesh(new THREE.PlaneGeometry(bw, bd), pTileFloor); f.rotation.x = -Math.PI / 2; f.position.set(bx, 0.002, bz2); f.receiveShadow = true; pocket.add(f);
      const c = new THREE.Mesh(new THREE.PlaneGeometry(bw, bd), pCeil); c.rotation.x = Math.PI / 2; c.position.set(bx, R.h, bz2); pocket.add(c);
      pbox(R.wall, R.h, wd, BLOCK.x0 - R.wall / 2, R.h / 2, wz, pTile);
      pbox(R.wall, R.h, wd, BLOCK.x1 + R.wall / 2, R.h / 2, wz, pTile);
      pbox(bw + R.wall * 2, R.h, R.wall, bx, R.h / 2, BLOCK.z1 + R.wall / 2, pTile);
      const tz = BLOCK.z0 + R.wall + 0.01, dl = DOOR_WC.x - DOOR_WC.w / 2, dr = DOOR_WC.x + DOOR_WC.w / 2;
      const piece = (w, h, x, y) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), pTile); m.position.set(x, y, tz); pocket.add(m); };
      piece(dl - BLOCK.x0, R.h, (BLOCK.x0 + dl) / 2, R.h / 2); piece(BLOCK.x1 - dr, R.h, (dr + BLOCK.x1) / 2, R.h / 2); piece(DOOR_WC.w, R.h - DOOR_WC.h, DOOR_WC.x, (R.h + DOOR_WC.h) / 2);
      for (let i = 0; i < 3; i++) pbox(0.06, 2.0, 1.1, BLOCK.x0 + 1.35 * (i + 1) - 0.02, 1.0, BLOCK.z1 - 0.55, pTile);
      for (let i = 0; i < 4; i++) {
        const hx = BLOCK.x0 + 0.65 + 1.35 * i;
        const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.9, 6), pMetal); pipe.position.set(hx, 1.7, BLOCK.z1 - 0.06); pocket.add(pipe);
        const head = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.03, 0.06, 10), pMetal); head.position.set(hx, 2.15, BLOCK.z1 - 0.14); head.rotation.x = 0.9; pocket.add(head);
      }
      const drain = new THREE.Mesh(new THREE.CircleGeometry(0.11, 12), pDrain); drain.rotation.x = -Math.PI / 2; drain.position.set(-3.2, 0.004, 5.2); pocket.add(drain);
      pbox(1.2, 0.05, 0.10, -3.2, R.h - 0.05, 5.6, pTube);
    }
    const WATER_N = LOW ? 60 : 140;
    const waterGeo = new THREE.BufferGeometry();
    const waterPos = new Float32Array(WATER_N * 3);
    for (let i = 0; i < WATER_N; i++) { waterPos[i * 3] = WATER_AT.x + (hash(i, 31) - 0.5) * 0.22; waterPos[i * 3 + 1] = hash(i, 32) * 2.1; waterPos[i * 3 + 2] = WATER_AT.z + (hash(i, 33) - 0.5) * 0.18; }
    waterGeo.setAttribute('position', new THREE.BufferAttribute(waterPos, 3));
    const water = new THREE.Points(waterGeo, new THREE.PointsMaterial({ map: dotTex || undefined, color: 0xdde8ff, size: 0.085, transparent: true, opacity: 0.8, depthWrite: false, fog: false }));
    water.visible = false; pocket.add(water);
    const streak = new THREE.Mesh(new THREE.PlaneGeometry(0.26, 2.1), new THREE.MeshBasicMaterial({ map: streakTex, color: 0x9fb6d0, transparent: true, opacity: 0.7, side: THREE.DoubleSide, depthWrite: false, fog: false }));
    streak.position.set(WATER_AT.x, 1.05, WATER_AT.z + 0.02); streak.visible = false; pocket.add(streak);
    const puddle = new THREE.Mesh(new THREE.CircleGeometry(0.3, 16), nf({ color: 0x6f7c86, roughness: 0.15, metalness: 0.1, transparent: true, opacity: 0.55 }));
    puddle.rotation.x = -Math.PI / 2; puddle.position.set(WATER_AT.x, 0.006, WATER_AT.z - 0.1); puddle.visible = false; pocket.add(puddle);
    // the night's lights, all children of the pocket so they go with it
    const showerLight = new THREE.PointLight(0xa8bce0, 0, 3.4, 2.0); showerLight.position.set(WATER_AT.x, 1.6, WATER_AT.z - 0.4); pocket.add(showerLight);
    const blockLight = new THREE.PointLight(0xe9f0ff, 0, 9, 1.7); blockLight.position.set(-3.2, R.h - 0.3, 5.6); pocket.add(blockLight);
    const nightLight = new THREE.PointLight(0x7f94c4, 0, 11, 1.6); nightLight.position.set(-2.4, 2.6, 1.6); pocket.add(nightLight);
    const nbLight = new THREE.PointLight(0x9fb2d8, 0, 4.2, 1.8); nbLight.position.set(HIS.x + 0.55, 2.3, 1.5); pocket.add(nbLight);
    const balcLight = new THREE.PointLight(0xffb060, 0, 14, 1.5); balcLight.position.set(BALC.x1 - 0.4, 2.6, 0); pocket.add(balcLight);
    const doorLight = blockLight;                        // the light under the door IS the block's tube
    let showerOn = false, blockFlicker = 0;
    function setShowerFx(on) { showerOn = !!on; water.visible = streak.visible = puddle.visible = showerOn; showerLight.intensity = showerOn ? 2.4 : 0; }

    /* ------------------------------------------------ THE SLEEPERS (v10.1)
       Chapter 1's deal, exactly: eight beds that are not his, four STATUES
       (`sleeper`, measured and turned by its long axis, head to the pillow)
       and four who BREATHE (`sleepanim`, one parse and three cloneSkinned
       copies, measured ONCE on the shared rest take and turned by the head
       bone), index 3 the bed beside his, every man sunk `SLEEP_SINK` into
       his mattress with a painted contact shadow under him, all of it on the
       bed's own `restOn` list so the bunk model and the sleeper files may
       land in any order. `sleeperRoot` shows only at night. */
    const SLEEP_SINK = 0.085;
    const sleepers = [];
    const sleepBeds = beds.filter(b => !b.his);
    const RIGGED = [1, 3, 5, 6];
    const NEIGHBOUR = 3;
    const SLEEP_TAKE = { 1: 'Sleep_Normally', [NEIGHBOUR]: 'Sleep_Normally', 5: 'Sleep_Normally', 6: 'Cough_While_Sleeping' };
    const SLEEP_RATE = { 1: 0.85, [NEIGHBOUR]: 0.90, 5: 1.00, 6: 0.72 };
    const REST_TAKE = 'Sleep_Normally';
    const sleeperRoot = new THREE.Group(); sleeperRoot.visible = false; pocket.add(sleeperRoot);
    let shadeTex = null;
    function sleepShade(parent, obj, bed) {
      if (!shadeTex) {
        shadeTex = paint(128, (cx, S) => { const g = cx.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2); g.addColorStop(0, 'rgba(0,0,0,0.85)'); g.addColorStop(0.5, 'rgba(0,0,0,0.42)'); g.addColorStop(1, 'rgba(0,0,0,0)'); cx.fillStyle = g; cx.fillRect(0, 0, S, S); });
        madeTex.push(shadeTex);
      }
      obj.updateWorldMatrix(true, true);
      const bb = new THREE.Box3(); let skinned = false; const vv = new THREE.Vector3();
      obj.traverse(o => { if (!o.isSkinnedMesh) return; skinned = true; const pa = o.geometry.attributes.position; for (let k = 0; k < pa.count; k += 7) { o.getVertexPosition(k, vv); vv.applyMatrix4(o.matrixWorld); bb.expandByPoint(vv); } });
      if (!skinned) bb.setFromObject(obj);
      bb.min.z -= PK.z; bb.max.z -= PK.z; bb.min.x -= PK.x; bb.max.x -= PK.x;   // into the pocket's frame
      const w = Math.max(0.5, bb.max.x - bb.min.x) * 1.06, d = Math.max(0.4, bb.max.z - bb.min.z) * 1.30;
      const sh = new THREE.Mesh(new THREE.PlaneGeometry(w, d), new THREE.MeshBasicMaterial({ map: shadeTex, transparent: true, opacity: 0.62, depthWrite: false, fog: false }));
      sh.rotation.x = -Math.PI / 2; sh.position.set((bb.min.x + bb.max.x) / 2, 0, (bb.min.z + bb.max.z) / 2); sh.renderOrder = 2;
      parent.add(sh); restOnDeck(bed, sh, 0.004); return sh;
    }
    const nfTraverse = (root) => root.traverse(o => { if (o.isMesh) { o.castShadow = !LOW; o.receiveShadow = false; for (const mm of (Array.isArray(o.material) ? o.material : [o.material])) mm.fog = false; } });
    assetBytes('sleeper').then(BUF => new GLTFLoader().parse(BUF, '', (gltf) => {
      if (!alive) return;
      rescueTextures(gltf, BUF);
      const src = gltf.scene; nfTraverse(src); src.updateMatrixWorld(true);
      const bx = new THREE.Box3().setFromObject(src), size = bx.getSize(new THREE.Vector3());
      const long = size.z >= size.x ? 'z' : 'x';
      const len = Math.max(size.x, size.z), sc = Math.min(1, (BED.len - 0.25) / len);
      sleepBeds.forEach((b, i) => {
        if (i >= 8 || RIGGED.includes(i)) return;
        const m = src.clone(); m.scale.setScalar(sc);
        m.rotation.y = long === 'z' ? -b.head * Math.PI / 2 : (b.head > 0 ? Math.PI : 0);
        m.position.set(b.x, 0, b.z); sleeperRoot.add(m);
        restOnDeck(b, m, -bx.min.y * sc - SLEEP_SINK);
        sleepShade(sleeperRoot, m, b);
        sleepers.push({ bed: b, obj: m });
      });
      redoShadows();
    }, (err) => console.warn('sleeper failed to load', err))).catch(err => console.warn('sleeper failed to load', err));
    const sleepRigs = [];
    for (const i of RIGGED) {
      const b = sleepBeds[i]; if (!b) continue;
      const g = new THREE.Group(); g.position.set(b.x, 0, b.z); g.rotation.y = (b.head < 0 ? Math.PI : 0); sleeperRoot.add(g);
      restOnDeck(b, g, -SLEEP_SINK);
      sleepRigs.push({ bed: b, group: g, mixer: null, acts: null, ready: false, take: SLEEP_TAKE[i] || REST_TAKE, rate: SLEEP_RATE[i] || 0.85, idx: i });
    }
    assetBytes('sleepanim').then(BUF => new GLTFLoader().parse(BUF, '', (gltf) => {
      if (!alive) return;
      rescueTextures(gltf, BUF);
      const copies = sleepRigs.map((_, n) => n === 0 ? gltf.scene : cloneSkinned(gltf.scene));   // EVERY copy before ANY is touched
      const v = new THREE.Vector3();
      const skinBox = (m, g) => { m.updateMatrixWorld(true); g.updateMatrixWorld(true); const bb = new THREE.Box3(); m.traverse(o => { if (o.isSkinnedMesh) { const p = o.geometry.attributes.position; for (let k = 0; k < p.count; k += 7) { o.getVertexPosition(k, v); v.applyMatrix4(o.matrixWorld); g.worldToLocal(v); bb.expandByPoint(v); } } }); return bb; };
      copies.forEach((m, n) => {
        const rig = sleepRigs[n]; nfTraverse(m); wideBounds(m, 'sleepanim'); rig.group.add(m); m.rotation.y = 0;
        if (!gltf.animations.length) return;
        rig.mixer = new THREE.AnimationMixer(m); rig.acts = {};
        for (const clip of gltf.animations) rig.acts[clip.name] = rig.mixer.clipAction(clip);
        (rig.acts[REST_TAKE] || Object.values(rig.acts)[0]).play(); rig.mixer.update(0.2);   // the bind pose is a T-pose STANDING UP: measure on a take
      });
      const g0 = sleepRigs[0].group, m0 = copies[0];
      const boxA = skinBox(m0, g0), sizeA = boxA.getSize(new THREE.Vector3());
      const SC = (BED.len - 0.3) / Math.max(sizeA.x, sizeA.z, 0.01);
      m0.scale.setScalar(SC);
      const boxB = skinBox(m0, g0), cB = boxB.getCenter(new THREE.Vector3()), sizeB = boxB.getSize(new THREE.Vector3());
      let headBone = null; m0.traverse(o => { if (!headBone && HEAD_RE.test(o.name)) headBone = o; });
      const hp = new THREE.Vector3();
      if (headBone) { headBone.getWorldPosition(hp); g0.worldToLocal(hp); } else { hp.copy(cB); hp.z -= 1; }
      const alongX = sizeB.x >= sizeB.z;
      const sign = Math.sign((alongX ? hp.x - cB.x : hp.z - cB.z)) || 1;
      const TURN = alongX ? (sign > 0 ? 0 : Math.PI) : (sign > 0 ? Math.PI / 2 : -Math.PI / 2);
      sleepRigs.forEach((rig, n) => {
        const g = rig.group, b = rig.bed, m = copies[n];
        m.scale.setScalar(SC); m.rotation.y = TURN;
        if (rig.acts) {
          const take = rig.acts[rig.take] || rig.acts[REST_TAKE] || Object.values(rig.acts)[0];
          for (const k in rig.acts) if (rig.acts[k] !== take) rig.acts[k].stop();
          take.reset(); take.setEffectiveTimeScale(rig.rate); take.play(); rig.mixer.update(0.2 + n * 0.7);
        }
        const boxC = skinBox(m, g), cC = boxC.getCenter(new THREE.Vector3());
        m.position.x -= cC.x; m.position.z -= cC.z; m.position.y -= boxC.min.y;
        sleepShade(sleeperRoot, m, b);
        rig.ready = true; sleepers.push({ bed: b, obj: m, rig });
      });
      redoShadows();
    }, (err) => console.warn('sleepanim failed to load', err))).catch(err => console.warn('sleepanim failed to load', err));

    /* --------------------------------------------------------- the mix ---
       The pocket's loops and the hall's are written into the chapter's
       declared beds. `hallK` is what a cut to the bunk takes to zero;
       `kitchenK` follows the player toward the servery. */
    let showerVol = 0, tickVol = 0, hallK = 1, kitchenK = 0.5;
    function mixBeds() {
      for (const b of DATA.ambience.beds) {
        if (b[0] === 'showerrun') b[1] = showerVol;
        if (b[0] === 'clocktick') b[1] = tickVol;
        if (b[0] === 'cookamb') b[1] = 0.26 * hallK;
        if (b[0] === 'cookchat') b[1] = 0.30 * hallK;
        if (b[0] === 'kitchen') b[1] = (0.10 + 0.22 * kitchenK) * hallK;
      }
    }
    function setNight(on) {
      pocket.visible = on;
      sleeperRoot.visible = on;
      blanket.visible = on;
      if (!on) showHim(false);
      nightLight.intensity = on ? 1.8 : 0;
      blockLight.intensity = on ? 1.6 : 0;
      nbLight.intensity = on ? 1.4 : 0;
      balcLight.intensity = on ? 6 : 0;
      if (!on) setShowerFx(false);
      for (const L of tubeLights) L.intensity = on ? 0 : TUBE_I;
      for (const t of tubes) t.material.emissiveIntensity = on ? 0 : 1.4;
      hallK = on ? 0 : 1; showerVol = 0; tickVol = on ? 0.35 : 0; mixBeds();
      clock.set('03:00');
    }
    function setShower(on, vol = 0.6) { showerVol = on ? vol : 0; setShowerFx(on && vol > 0.05); mixBeds(); }

    /* ----------------------------------------------------------- the pile
       The encik IS the pile: walk up, act, four choices. Offered only once
       the three men have been asked. */
    const PILE_POS = new THREE.Vector3(ENC.x, 0, ENC.z);
    const INTERACT_R = 2.6;
    const pile = new THREE.Group(); pile.position.copy(PILE_POS); world.add(pile);
    const pileRing = new THREE.Mesh(
      new THREE.RingGeometry(0.55, 0.70, 24),
      new THREE.MeshBasicMaterial({ color: 0x63d6c8, transparent: true, opacity: 0,
        side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false, fog: false }));
    pileRing.rotation.x = -Math.PI / 2; pileRing.position.y = 0.02; pileRing.visible = false;
    pile.add(pileRing);
    const _ndc = new THREE.Vector3();
    const syncCamera = () => { camera.updateWorldMatrix(true, false); camera.matrixWorldInverse.copy(camera.matrixWorld).invert(); };
    function pileDist() { return Math.hypot(yaw.position.x - PILE_POS.x, yaw.position.z - PILE_POS.z); }
    function pileScreen() { syncCamera(); return _ndc.set(PILE_POS.x, 1.45, PILE_POS.z).project(camera); }
    function pileInView() {
      if (phase !== 'encik') return false;
      if (pileDist() < 1.5) return true;
      const n = pileScreen();
      return n.z < 1 && Math.abs(n.x) < 0.97 && Math.abs(n.y) < 0.97;
    }
    function pointerHitsPile(cx, cy) {
      if (phase !== 'encik' || pileDist() > INTERACT_R) return false;
      const n = pileScreen();
      if (n.z > 1) return false;
      const sx = (n.x * 0.5 + 0.5) * innerWidth, sy = (-n.y * 0.5 + 0.5) * innerHeight;
      return Math.hypot(cx - sx, cy - sy) < Math.min(innerWidth, innerHeight) * 0.16;
    }
    function interactPile() {
      if (getState() !== 'play' || phase !== 'encik' || pileDist() >= INTERACT_R) return false;
      startDecision();
      return true;
    }

    /* ------------------------------------------------------------- the day
       Two phases: `ask` (the three men, in any order) and `encik`. The men
       already asked ride in the phase string — `ask:recruit4,recruit3` — so
       a resume lands on the same count (v7.3's law). */
    let phase = 'ask';
    let booted = false;
    const dayClock = { t: 0 };
    let lastWall = 0;
    const todo = [];
    function after(secs, fn) { todo.push({ at: dayClock.t + secs, fn }); todo.sort((a, b) => a.at - b.at); }
    function runTodo() { while (todo.length && todo[0].at <= dayClock.t) todo.shift().fn(); }
    function dropTodo() { todo.length = 0; }
    const asked = new Set();
    const ASK_ORDER = ['recruit4', 'bunkmate', 'recruit3'];

    const speak = { until: 0, pending: null };
    function speakReset() { speak.until = 0; speak.pending = null; }
    function sayLine(name, vol = 1, onStart) {
      if (!worldSfx) return false;
      if (dayClock.t < speak.until) return false;
      const start = () => { speak.until = dayClock.t + (SECS[name] || 2.5) + 0.25; if (onStart) onStart(); };
      if (worldSfx(name, vol)) { start(); return true; }
      speak.pending = { name, vol, start, give: dayClock.t + 3 };
      speak.until = dayClock.t + 0.2;
      return true;
    }
    function runSpeak() {
      const q = speak.pending;
      if (!q || dayClock.t < speak.until) return;
      if (dayClock.t > q.give) { speak.pending = null; return; }
      if (worldSfx(q.name, q.vol)) { speak.pending = null; q.start(); }
      else speak.until = dayClock.t + 0.2;
    }
    if (warmSounds) warmSounds(['r2hear', 'k2three', 'r2siao', 'marchcall', 'n2known', 'e2hurry',
                                'e2A', 'e2saw', 'e2cock', 'e2ok', 'e2hmm', 'n2sigh', 'n2alone', 'e2D1', 'e2D2']);   // v10.2: the encik's six as well, belt and braces
    /* v10.2: A QUEUE OF LINES, in order, each waiting for the one before it
       (the v9.5 count-off's shape): `sayLine` refuses a line while another
       speaks, and on a slow box several `after` slots flush in one tick, so
       two lines laid out by hand would lose the second. An entry is a line
       (with what to do on the frame it starts) or a function to run once
       the queue reaches it. */
    const lineQ = [];
    function queueLine(name, onStart) { lineQ.push({ name, onStart }); }
    function queueFn(fn) { lineQ.push({ fn }); }
    function queueGap(secs) { lineQ.push({ gap: secs }); }
    function runQueue() {
      if (!lineQ.length || speak.pending || dayClock.t < speak.until) return;
      const q = lineQ[0];
      if (q.fn) { lineQ.shift(); q.fn(); return; }
      if (q.gap) { lineQ.shift(); speak.until = dayClock.t + q.gap; return; }
      lineQ.shift();
      sayLine(q.name, 1, q.onStart);
    }

    /* v10.1: A PLATOON GOES PAST (Chad: "Outside environment should sometimes
       have soldiers marching sound with 'left, left, left right left...'").
       `marchcall` is the sergeant's cadence over the boots, mixed as a
       pass-by (masters/v10.1/mk.py). It is an EVENT on the chapter's own
       deterministic stream — first between 12 and 24 s into play, then every
       42–78 s — louder the nearer the player stands to the open +z side,
       where the square is, and only by day: the pocket's night never hears
       it. `reset()` clears it (the v8.1/v9.2 law). */
    let marchAt = 0, marchSeed = 0, marchN = 0, outK = 0;
    function marchBook(first) {
      marchN++;
      const r = hash(marchN, 71 + marchSeed);
      marchAt = dayClock.t + (first ? 12 + 12 * r : 42 + 36 * r);
    }
    function marchTick() {
      if (!marchAt) marchBook(true);
      if (dayClock.t < marchAt || pocket.visible) return;
      if (worldSfx) worldSfx('marchcall', 0.42 + 0.30 * outK);
      marchBook(false);
    }

    function setPhase(p) { phase = p; if (kit) kit.setPhase(p === 'ask' ? 'ask:' + [...asked].join(',') : p); }
    function objAsk() {
      if (!kit) return;
      kit.objective(DATA.words.objAsk.replace('{n}', String(asked.size)));
      kit.waypoint(null);
    }
    function objEncik() {
      if (!kit) return;
      kit.objective(DATA.words.objEncik);
      kit.waypoint({ x: ENC.x - 0.6, y: 1.2, z: ENC.z + 0.6 });
    }
    function askOne(id, line) {
      const seat = WHO[id];
      const ok = sayLine(line, 1, () => sitUp(seat, (SECS[line] || 3) + 0.6));
      if (!ok) return false;
      if (asked.has(id)) return true;
      asked.add(id);
      setPhase('ask');
      objAsk();                                  // 1/3, 2/3, 3/3 — each a beat
      if (asked.size >= 3) afterThree();
      return true;
    }
    /* v10.2 (Chad): "The player should also have an internal voiceline that
       says 'I think I'm not the only one who knows about this...' right after
       talking to 3 bunkmates ... first before the encik shouting voiceline
       plays" — then the encik: "Hurry up and eat, fall in soon!" The third
       man's own line finishes first (the queue waits on the same window his
       line booked), his thought lands, the encik shouts on his raised-hand
       take, and only then does the objective turn to him. A resume into
       three-asked lands on `encik` directly: the beat is spent. */
    function afterThree() {
      queueGap(0.6);
      queueLine('n2known');
      queueGap(0.5);
      queueLine('e2hurry', () => {
        encik.play(ENC_TALK[1], 1, 0.3);
        after((SECS.e2hurry || 2.5) + 0.2, () => { if (encik.cur === ENC_TALK[1]) encik.play('Idle_9', 1, 0.4); });
      });
      queueGap(0.4);
      queueFn(() => { if (phase === 'ask') { setPhase('encik'); objEncik(); } });
    }
    function applyPhase(p) {
      asked.clear();
      if (typeof p === 'string' && p.startsWith('ask:')) {
        for (const id of p.slice(4).split(',')) if (WHO[id] !== undefined) asked.add(id);
      }
      if (p === 'encik' || asked.size >= 3) { for (const id of ASK_ORDER) asked.add(id); setPhase('encik'); objEncik(); return; }
      setPhase('ask'); objAsk();
    }

    /* ------------------------------------------------------------ hotspots */
    const hotspots = [
      { id: 'recruit4', pos: { x: SEATS[WHO.recruit4].x, y: 1.15, z: SEATS[WHO.recruit4].z }, radius: 2.0, prompt: DATA.words.hotRecruit2,
        enabled: () => phase === 'ask' && !asked.has('recruit4'),
        onInteract() { return askOne('recruit4', 'r2hear'); } },
      { id: 'bunkmate', pos: { x: SEATS[WHO.bunkmate].x, y: 1.15, z: SEATS[WHO.bunkmate].z }, radius: 2.0, prompt: DATA.words.hotBunkmate,
        enabled: () => phase === 'ask' && !asked.has('bunkmate'),
        onInteract() { return askOne('bunkmate', 'k2three'); } },
      { id: 'recruit3', pos: { x: SEATS[WHO.recruit3].x, y: 1.15, z: SEATS[WHO.recruit3].z }, radius: 2.0, prompt: DATA.words.hotRecruit,
        enabled: () => phase === 'ask' && !asked.has('recruit3'),
        onInteract() { return askOne('recruit3', 'r2siao'); } }
    ];

    /* ---------------------------------------------------------- per frame */
    function updateNotes(dt, t) {
      // the mixers run in every state (v5.19): a cutscene owns the poses, never the clocks
      for (const r of seated.rigs) headUndo(r);                     // v13.0, the v11.5 law
      for (const r of seated.rigs) if (r.mixer && seated.group.visible) r.mixer.update(dt);
      if (seated.group.visible) seatLooks(dt);                      // v13.0: laid on after the mixer
      if (encik.mixer && encik.group.visible) encik.mixer.update(dt);
      if (ghostFlag.mixer && ghostFlag.group.visible) ghostFlag.mixer.update(dt);
      if (pocket.visible) {
        for (const f of fanBlades) f.rotation.y += dt * 6.5;
        for (const r of sleepRigs) if (r.mixer) r.mixer.update(dt);
        if (showerOn) {
          const pa = water.geometry.attributes.position;
          for (let i = 0; i < WATER_N; i++) { let y = pa.array[i * 3 + 1] - dt * 3.2; if (y < 0) y += 2.1; pa.array[i * 3 + 1] = y; }
          pa.needsUpdate = true;
          streak.material.map.offset.y -= dt * 1.6;
        }
        blockFlicker += dt;
        blockLight.intensity = (pocket.visible ? 1.6 : 0) * (0.85 + 0.15 * Math.sin(blockFlicker * 37) * Math.sin(blockFlicker * 5.3));
      } else {
        for (const f of wallFans) f.rotation.z += dt * 9;
        for (const f of sqFlags) {
          const a = f.mesh.geometry.attributes.position, arr = a.array, b = f.base;
          for (let i = 0; i < arr.length; i += 3) { const x = b[i], grip = x / f.w; arr[i + 2] = b[i + 2] + Math.sin(x * 3.4 - t * 2.6 + f.ph) * 0.16 * grip * grip; arr[i + 1] = b[i + 1] - 0.05 * grip * grip; }
          a.needsUpdate = true;
        }
      }
      if (getState() !== 'play') { lastWall = 0; return; }
      // the chapter's clock runs on WALL time (v7.1's law), only in play
      const now = performance.now() / 1000;
      if (lastWall) dayClock.t += Math.min(0.5, now - lastWall);   // capped at half a second a frame, as e2c1's is, so a stalled tab never skips a beat
      lastWall = now;
      if (!booted) { booted = true; applyPhase(kit ? kit.getPhase() : null); }
      // the kitchen is louder by the servery; the square is louder by the open side
      kitchenK = THREE.MathUtils.clamp(1 - (yaw.position.x - COUNTER.x - 0.6) / 9, 0, 1);
      outK = THREE.MathUtils.clamp((yaw.position.z + 1) / 7.5, 0, 1);
      mixBeds();
      runTodo(); runSpeak(); runQueue(); marchTick();
    }
    function updatePile(t) {
      if (getState() === 'cine') { pileRing.visible = false; return; }
      const on = phase === 'encik';
      const near = THREE.MathUtils.clamp((7 - pileDist()) / (7 - INTERACT_R), 0, 1);
      pileRing.visible = on && near > 0.01;
      pileRing.material.opacity = near * (0.5 + 0.3 * Math.sin(t * 2.6));
    }
    function updateFire(t) {
      if (getState() === 'cine' || pocket.visible) return;
      const fl = 1 - (Math.random() < 0.015 ? 0.08 : 0);
      for (const L of tubeLights) L.intensity = TUBE_I * fl;
    }
    function updateSlow() {}

    /* ---------------------------------------------------------- lifecycle */
    function snap() {
      return { night: pocket.visible, door: doorPivot.rotation.y, showerVol, tickVol, up: seated.rigs.map(r => r.up) };
    }
    function restore(s) {
      setNight(!!s.night);
      doorPivot.rotation.y = s.door;
      showerVol = s.showerVol || 0; tickVol = s.tickVol || 0; mixBeds();
      allSitDown();
      putEncik();
      encik.group.visible = true;
    }
    function reset() {
      setNight(false); doorPivot.rotation.y = DOOR_AJAR;
      allSitDown(); putEncik(); encik.group.visible = true;
      dropTodo(); speakReset(); lineQ.length = 0;
      asked.clear(); booted = false; dayClock.t = 0; lastWall = 0;
      marchAt = 0; marchN = 0; marchSeed = (marchSeed + 1) % 97; outK = 0; kitchenK = 0.5; mixBeds();
      if (kit) { kit.daylight(null, 0); kit.presence(0); kit.setPhase('ask:'); }
      phase = 'ask';
    }
    function blockers() {
      const out = [];
      const b = (o, pad = 0.20) => { o.updateWorldMatrix(true, false); const bb = new THREE.Box3().setFromObject(o); bb.expandByScalar(pad); out.push(bb); };
      const solid = (o, pad = 0.14) => { o.updateWorldMatrix(true, false); const bb = new THREE.Box3().setFromObject(o); bb.expandByScalar(pad); bb.min.y = 0; bb.max.y = Math.max(bb.max.y, 1.40); out.push(bb); };
      for (const w of walls) b(w);
      for (const s of solids) solid(s);
      // a table and its two benches are one column
      for (const tb of tables) {
        out.push(new THREE.Box3(new THREE.Vector3(TBL.x0 - 0.14, 0, tb.z - TBL.bench - TBL.benchW / 2 - 0.14),
                                new THREE.Vector3(TBL.x1 + 0.14, 1.40, tb.z + TBL.bench + TBL.benchW / 2 + 0.14)));
      }
      // the encik: nobody walks through him
      out.push(new THREE.Box3(new THREE.Vector3(ENC.x - 0.42, 0, ENC.z - 0.42), new THREE.Vector3(ENC.x + 0.42, 1.8, ENC.z + 0.42)));
      return out;
    }
    function dispose() {
      alive = false;
      if (treeStand) treeStand.userData.disposeTrees?.();   // BEFORE the sweep: the kit's maps are shared (v6.15)
      const geos = new Set(), mats = new Set();
      world.traverse(o => {
        if (o.geometry) geos.add(o.geometry);
        if (o.material) for (const m of (Array.isArray(o.material) ? o.material : [o.material])) mats.add(m);
      });
      scene.remove(world);
      for (const o of owned) { o.parent?.remove(o); o.dispose?.(); }
      owned.length = 0;
      encik.mixer?.stopAllAction();
      ghostFlag.mixer?.stopAllAction();
      for (const r of seated.rigs) r.mixer?.stopAllAction();
      for (const r of sleepRigs) r.mixer?.stopAllAction();
      him.mixer?.stopAllAction();
      for (const g of geos) g.dispose();
      for (const m of mats) {
        for (const k of ['map', 'roughnessMap', 'normalMap', 'emissiveMap', 'alphaMap']) m[k]?.dispose?.();
        m.dispose();
      }
      for (const t of madeTex) t?.dispose?.();
      if (wallMap) wallMap.dispose();
      world.clear();
      S = null;
    }

    const readyAt = performance.now();
    return (S = {
      world, noteTex, blockers: blockers(),
      ready: () => (encik.ready && seated.ready) || performance.now() - readyAt > 12000,
      pile: { pos: PILE_POS, radius: INTERACT_R, group: pile,
              dist: pileDist, screen: pileScreen, inView: pileInView,
              hits: pointerHitsPile, interact: interactPile,
              glow: () => pileRing.material.opacity },
      drum: doorPivot, ash: null, embers: null, heroNote: null, smoke: null, flying: null,
      jossTips: [], fireLight: tubeLights[0],
      get noteStorm() { return 1; },
      set noteStorm(v) {},
      // the chapter's own
      H, TBL, ROW_Z, OURS, SEATS, WHO, ENC, PK, R, BED, HIS, DOOR_WC, BLOCK, DOOR_AJAR, DOOR_OPEN, WATER_AT,
      encik, ENC_TALK, seated, sitUp, sitDown, allSitDown, staff, ghostFlag, FLAG_GHOST,
      pocket, setNight, setShower, showHim, him, himInfo: () => ({ shown: himRoot.visible, ready: !!him.model, box: him.box || null, y: +himBody.position.y.toFixed(3) }), doorPivot, doorLight, nightLight, blockLight, clock, clockFace, blanket, fanBlades,
      beds, hisBed, sleepers, sleepRigs, sleeperRoot, foodModel: () => foodModel,
      tubeLights, tubes,
      sayLine, asked, after, dayClock,
      get phase() { return phase; },
      setPhase, applyPhase,
      askInfo: () => ({ phase, asked: [...asked], obj: kit && kit.getPhase ? kit.getPhase() : null }),
      speakInfo: () => ({ t: +dayClock.t.toFixed(2), until: +speak.until.toFixed(2), pending: speak.pending ? speak.pending.name : null, queued: lineQ.length }),
      ambient: () => ({ hallK, kitchenK, outK, marchAt: +marchAt.toFixed(1), marchN, beds: DATA.ambience.beds.map(b => [b[0], +b[1].toFixed(3)]) }),
      sleepInfo: () => sleepers.map(s => { const bb = new THREE.Box3().setFromObject(s.obj); return { bed: [s.bed.x, s.bed.z], rig: !!s.rig, deck: +s.bed.deckTop.toFixed(3), lo: +bb.min.y.toFixed(3), x: [+bb.min.x.toFixed(2), +bb.max.x.toFixed(2)], z: [+(bb.min.z - PK.z).toFixed(2), +(bb.max.z - PK.z).toFixed(2)] }; }),
      updateNotes, updatePile, updateFire, updateSlow,
      setNoteTexture() {},
      snap, restore, reset, dispose,
      hotspots
    });
  }

  /* ---------------------------------------------------------- textures ---- */
  function makeTerrazzo(THREE, cnv) {
    const s = 512, [c, ctx] = cnv(s);
    ctx.fillStyle = '#b9b3a4'; ctx.fillRect(0, 0, s, s);
    for (let i = 0; i < 2600; i++) {
      const v = 120 + Math.floor(hash(i, 1) * 90);
      ctx.fillStyle = `rgba(${v},${v - 6},${v - 14},0.9)`;
      ctx.fillRect(hash(i, 2) * s, hash(i, 3) * s, 1 + hash(i, 4) * 3, 1 + hash(i, 5) * 3);
    }
    ctx.strokeStyle = 'rgba(60,60,60,0.35)'; ctx.lineWidth = 2; ctx.strokeRect(1, 1, s - 2, s - 2);
    const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(18, 14);
    t.colorSpace = THREE.SRGBColorSpace; return t;
  }
  function makeLaminate(THREE, cnv) {
    const s = 256, [c, ctx] = cnv(s);
    ctx.fillStyle = '#d98ba1'; ctx.fillRect(0, 0, s, s);
    for (let i = 0; i < 900; i++) {
      ctx.fillStyle = `rgba(255,255,255,${0.04 + hash(i, 21) * 0.08})`;
      ctx.fillRect(hash(i, 22) * s, hash(i, 23) * s, 2, 2);
    }
    const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(6, 1);
    t.colorSpace = THREE.SRGBColorSpace; return t;
  }
  function makeMenu(THREE, cnv) {
    const s = 512, [c, ctx] = cnv(s);
    ctx.fillStyle = '#f4f1e6'; ctx.fillRect(0, 0, s, s);
    ctx.strokeStyle = '#22303c'; ctx.lineWidth = 8; ctx.strokeRect(12, 12, s - 24, s - 24);
    ctx.fillStyle = '#22303c'; ctx.textAlign = 'center';
    ctx.font = 'bold 54px sans-serif'; ctx.fillText('BREAKFAST', s / 2, 96);
    ctx.font = '38px sans-serif';
    ['Bee hoon · Egg', 'Bread · Kaya', 'Milo · Coffee', '0600 – 0700'].forEach((l, i) => ctx.fillText(l, s / 2, 190 + i * 72));
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
  }
  /* v10.1: a one-line sign in a coloured frame, for the tray return and the wastage notice */
  function makeSign(THREE, cnv, text, colour) {
    const w = 512, [c, ctx] = cnv(w);
    ctx.fillStyle = '#f2efe6'; ctx.fillRect(0, 0, w, w);
    ctx.fillStyle = colour; ctx.fillRect(0, w * 0.36, w, w * 0.28);
    ctx.strokeStyle = colour; ctx.lineWidth = 10; ctx.strokeRect(5, w * 0.33, w - 10, w * 0.34);
    ctx.fillStyle = '#ffffff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.font = 'bold 34px sans-serif'; ctx.fillText(text, w / 2, w / 2);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
    t.repeat.set(1, 0.34); t.offset.set(0, 0.33); return t;
  }
  function makeTarmac(THREE, cnv) {
    const s = 256, [c, ctx] = cnv(s);
    ctx.fillStyle = '#4c4e50'; ctx.fillRect(0, 0, s, s);
    for (let i = 0; i < 2600; i++) { const v = 60 + hash(i, 41) * 40; ctx.fillStyle = `rgb(${v},${v},${v + 3})`; ctx.fillRect(hash(i, 42) * s, hash(i, 43) * s, 2, 2); }
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(24, 18); return t;
  }
  function makeTiles(THREE, cnv) {
    const s = 256, [c, ctx] = cnv(s);
    ctx.fillStyle = '#9da39e'; ctx.fillRect(0, 0, s, s);
    const n = 4, t = s / n;
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) { const v = 226 + ((x * 7 + y * 13) % 5) * 4; ctx.fillStyle = `rgb(${v},${v + 2},${v - 2})`; ctx.fillRect(x * t + 3, y * t + 3, t - 6, t - 6); }
    const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.repeat.set(6, 3); return tex;
  }
  function makeBoard(THREE, cnv) {
    const s = 512, [c, ctx] = cnv(s);
    ctx.fillStyle = '#3d5a3a'; ctx.fillRect(0, 0, s, s);
    ctx.fillStyle = '#7a5a34'; ctx.fillRect(0, 0, s, 14); ctx.fillRect(0, s - 14, s, 14); ctx.fillRect(0, 0, 14, s); ctx.fillRect(s - 14, 0, 14, s);
    for (let i = 0; i < 7; i++) {
      const x = 30 + hash(i, 51) * 300, y = 30 + hash(i, 52) * 300, w = 90 + hash(i, 53) * 70, h = 110 + hash(i, 54) * 60;
      ctx.save(); ctx.translate(x, y); ctx.rotate((hash(i, 55) - 0.5) * 0.12);
      ctx.fillStyle = i % 3 ? '#efe9d8' : '#f6d98a'; ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = 'rgba(40,40,40,0.55)'; for (let l = 0; l < 6; l++) ctx.fillRect(8, 12 + l * 15, w - 16 - hash(i * 7 + l, 56) * 30, 3);
      ctx.fillStyle = '#c0392b'; ctx.beginPath(); ctx.arc(w / 2, 6, 4, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
  }
  function makeStreaks(THREE, cnv) {
    const s = 128, [c, ctx] = cnv(s);
    ctx.clearRect(0, 0, s, s);
    for (let i = 0; i < 26; i++) {
      const x = (i * 37) % s, len = 24 + (i * 53) % 60, y0 = (i * 71) % s;
      const g = ctx.createLinearGradient(0, y0, 0, y0 + len);
      g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(0.5, 'rgba(255,255,255,0.85)'); g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = g; ctx.fillRect(x, y0, 2, len);
      if (y0 + len > s) ctx.fillRect(x, y0 - s, 2, len);
    }
    const tex = new THREE.CanvasTexture(c); tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.repeat.set(1, 3); return tex;
  }
  /* the bunk's window panes at night: the tree line as a black cut-out under a blue-black sky */
  function makeWinView(THREE, cnv) {
    const w = 256, [c, ctx] = cnv(w);
    const sky = ctx.createLinearGradient(0, 0, 0, w);
    sky.addColorStop(0, '#0c1428'); sky.addColorStop(0.6, '#13203a'); sky.addColorStop(1, '#0a1020');
    ctx.fillStyle = sky; ctx.fillRect(0, 0, w, w);
    for (let i = 0; i < 26; i++) { const x = (i * 47 % 280) - 12, y = 176 + ((i * 31) % 26), r = 26 + ((i * 17) % 22); ctx.fillStyle = 'rgba(6,10,14,0.96)'; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); }
    ctx.fillStyle = '#05080c'; ctx.fillRect(0, 232, w, w - 232);
    const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; return tex;
  }
  /* an analog wall clock whose set('HH:MM') parses the string into hand angles */
  function makeClock(THREE, cnv) {
    const w = 256, [c, ctx] = cnv(w);
    const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace;
    const cx = w / 2, cy = w / 2, R = w / 2;
    const hand = (a, len, wid, col, back) => {
      ctx.strokeStyle = col; ctx.lineWidth = wid; ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(cx - Math.sin(a) * back, cy + Math.cos(a) * back);
      ctx.lineTo(cx + Math.sin(a) * len, cy - Math.cos(a) * len);
      ctx.stroke();
    };
    const set = (text) => {
      const m = /^(\d{1,2}):(\d{2})$/.exec(String(text || '')) || [0, 0, 0];
      const hh = (+m[1] || 0) % 12, mm = +m[2] || 0;
      ctx.clearRect(0, 0, w, w);
      ctx.fillStyle = '#20242a'; ctx.beginPath(); ctx.arc(cx, cy, R - 3, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#f2efe6'; ctx.beginPath(); ctx.arc(cx, cy, R - 14, 0, Math.PI * 2); ctx.fill();
      for (let i = 0; i < 60; i++) {
        const a = i / 60 * Math.PI * 2, big = i % 5 === 0;
        const r0 = R - 22, r1 = r0 - (big ? 16 : 7);
        ctx.strokeStyle = big ? '#1b1f24' : '#8b8f95'; ctx.lineWidth = big ? 5 : 2;
        ctx.beginPath(); ctx.moveTo(cx + Math.sin(a) * r0, cy - Math.cos(a) * r0); ctx.lineTo(cx + Math.sin(a) * r1, cy - Math.cos(a) * r1); ctx.stroke();
      }
      ctx.fillStyle = '#1b1f24'; ctx.font = 'bold 26px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      for (let n = 1; n <= 12; n++) { const a = n / 12 * Math.PI * 2, r = R - 52; ctx.fillText(String(n), cx + Math.sin(a) * r, cy - Math.cos(a) * r + 1); }
      hand((hh + mm / 60) / 12 * Math.PI * 2, R - 92, 11, '#1b1f24', 16);
      hand(mm / 60 * Math.PI * 2, R - 40, 8, '#1b1f24', 20);
      hand(Math.PI * 1.2, R - 34, 3, '#c0392b', 24);
      ctx.fillStyle = '#1b1f24'; ctx.beginPath(); ctx.arc(cx, cy, 8, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#c0392b'; ctx.beginPath(); ctx.arc(cx, cy, 4, 0, Math.PI * 2); ctx.fill();
      tex.needsUpdate = true;
    };
    set('03:00');
    return { tex, set };
  }

  /* ------------------------------------------------------------ THE FILM
     Fifty seconds. The same room, four nights, four angles — from his
     pillow along the bed row to the block door, from the floor across the
     room, from the ceiling's corner down over the sleepers, and the clock
     itself — every one at three in the morning, with the water starting on
     the hour. v10.1: shot in THE BUNK (chapter 1's room, rebuilt in the
     pocket) with the seven men asleep in it. Then black, his line, and the
     cookhouse in daylight with the section already at the table. It begins
     on BLACK and lifts on its own fade (cinetest's contract). v14.9: HE is in
     every night of it, asleep in bed one; not one shot moved for him. */
  const pk = (stage, x, y, z) => ({ x: stage.PK.x + x, y, z: stage.PK.z + z });
  function shots(stage, faceFrom) {
    const DOOR = pk(stage, stage.DOOR_WC.x, 1.0, stage.R.z);
    const CLOCK = pk(stage, stage.DOOR_WC.x, 2.55, stage.R.z);
    const PILLOW = pk(stage, stage.HIS.x - 0.62, stage.BED.low + 0.36, stage.HIS.z);
    const ROOM = pk(stage, 2.0, 0.9, 0.6);            // where the pillow shot opens: down the room, past the table, to the far row
    const FLOOR = pk(stage, 1.9, 0.34, -0.9);
    const HIGH = pk(stage, 4.0, 2.65, 3.2);
    const ATCLOCK = pk(stage, stage.DOOR_WC.x, 2.5, stage.R.z - 0.8);
    const BEDAT = pk(stage, stage.HIS.x, 0, stage.HIS.z);
    return { DOOR, CLOCK, PILLOW, FLOOR, HIGH, ATCLOCK, BEDAT,
      Y_PIL: faceFrom(PILLOW.x, PILLOW.z, DOOR.x, DOOR.z), Y_ROOM: faceFrom(PILLOW.x, PILLOW.z, ROOM.x, ROOM.z), Y_FLOOR: faceFrom(FLOOR.x, FLOOR.z, DOOR.x, DOOR.z),
      Y_HIGH: faceFrom(HIGH.x, HIGH.z, BEDAT.x, BEDAT.z), Y_HIGH2: faceFrom(HIGH.x, HIGH.z, DOOR.x, DOOR.z),
      Y_CLOCK: faceFrom(ATCLOCK.x, ATCLOCK.z, CLOCK.x, CLOCK.z) };
  }
  function intro(c, s, api) {
    const { tr, step, sfx, fade, camTo, yawTo, pitchTo, faceFrom, rawK, smoothK, stage, armR, kit } = api;
    const T = shots(stage, faceFrom);
    const SPAWN = { x: DATA.spawn.x, y: 1.62, z: DATA.spawn.z };
    const Y_HALL = DATA.spawn.rot;

    step(0, () => {
      armR.visible = false;
      if (kit) kit.daylight(NIGHT, 0);
      stage.setNight(true);
      stage.showHim(true);                       // v14.9: him, asleep in bed one, every night of the film
      stage.doorPivot.rotation.y = stage.DOOR_AJAR;
      stage.clock.set('03:00');
    });
    fade(0.0, 0.3, 1, 1);
    /* NIGHT ONE (0.3–10.2) — from his pillow, along the beds, the men
       asleep, to the block door. The water starts at five. */
    fade(0.3, 2.6, 1, 0);
    /* v10.4, Chad: "there needs to be some narration at the start" — his
       words, in two takes so the second can be TIMED: `n2pro2`'s "3am" ends
       3.64 s into the take (measured, the pause before "Surely"), so cued at
       27.56 it lands on the frame the clock turns and the water starts (31.2). */
    sfx(3.0, 'n2pro1');                          // "Night after night, this kept happening." 2.43 s -> 5.4
    camTo(0, 10.2, T.PILLOW, T.PILLOW, rawK);
    yawTo(0, 10.2, T.Y_ROOM, T.Y_PIL + 0.10, smoothK);   // the room first, the door last: the +z wall is a metre from his pillow
    pitchTo(0, 10.2, 0.02, 0.05, smoothK);
    step(5.0, () => stage.setShower(true, 0.55));
    sfx(5.0, 'drip', 0.5);
    sfx(6.6, 'bunkcreak', 0.35);
    fade(9.3, 10.2, 0, 1);
    /* NIGHT TWO (10.2–19.0) — from the floor across the room: the light
       under the door, the water already running, a man coughing in the dark. */
    step(10.2, () => { stage.setShower(true, 0.7); stage.blockLight.intensity = 2.4; });
    camTo(10.2, 19.0, T.FLOOR, { x: T.FLOOR.x - 0.25, y: T.FLOOR.y, z: T.FLOOR.z + 0.1 }, smoothK);
    yawTo(10.2, 19.0, T.Y_FLOOR, T.Y_FLOOR, rawK);
    pitchTo(10.2, 19.0, 0.10, 0.06, smoothK);
    fade(10.2, 11.4, 1, 0);
    sfx(14.5, 'drip', 0.45);
    fade(18.0, 19.0, 0, 1);
    /* NIGHT THREE (19.0–27.6) — from the ceiling's corner, down over the
       sleepers to the door, which opens a hand's width by itself. */
    step(19.0, () => { stage.setShower(true, 0.5); stage.blockLight.intensity = 1.6; stage.doorPivot.rotation.y = stage.DOOR_AJAR; });
    camTo(19.0, 27.6, T.HIGH, T.HIGH, rawK);
    yawTo(19.0, 27.6, T.Y_HIGH, T.Y_HIGH2, smoothK);
    pitchTo(19.0, 27.6, -0.62, -0.30, smoothK);
    fade(19.0, 20.2, 1, 0);
    sfx(22.6, 'dooropen2', 0.32);
    tr(22.6, 25.0, k => { stage.doorPivot.rotation.y = stage.DOOR_AJAR + (stage.DOOR_OPEN - stage.DOOR_AJAR) * 0.55 * k; }, smoothK);
    sfx(24.4, 'dread', 0.5);
    fade(26.6, 27.6, 0, 1);
    /* NIGHT FOUR (27.6–35.0) — the clock over the block door, full frame.
       02:59; the minute hand moves; the water starts on the hour. */
    step(27.6, () => { stage.setShower(false); stage.doorPivot.rotation.y = stage.DOOR_AJAR; stage.blockLight.intensity = 1.2; stage.clock.set('02:59'); });
    camTo(27.6, 35.0, T.ATCLOCK, { x: T.ATCLOCK.x, y: T.ATCLOCK.y, z: T.ATCLOCK.z + 0.12 }, smoothK);
    yawTo(27.6, 35.0, T.Y_CLOCK, T.Y_CLOCK, rawK);
    pitchTo(27.6, 35.0, 0.03, 0.03, rawK);
    fade(27.6, 28.8, 1, 0);
    sfx(27.56, 'n2pro2');                        // "I noticed it only starts when the clock hits 3am... Surely, this is not just my imagination..." 7.71 s -> 35.3; "3am" at 31.2
    step(31.2, () => { stage.clock.set('03:00'); stage.setShower(true, 0.8); });
    sfx(31.2, 'boom', 0.28);
    sfx(31.4, 'dread', 0.7);
    fade(34.0, 35.0, 0, 1);
    /* 35–43 black: the water fades, his line. */
    tr(35.0, 37.5, k => { stage.setShower(true, 0.8 * (1 - k)); }, rawK);
    sfx(38.4, 'n2pro');                          // 6.72 s → 45.1 (v10.8: +2.2 s of black first — Chad: "the voicelines are too close to each other")
    /* 45.4 THE COOKHOUSE, in daylight, the section already at the table (v10.8: every time here is +2.2) */
    step(45.4, () => {
      stage.setNight(false);
      if (kit) kit.daylight(null, 0);
    });
    camTo(45.4, 51.6, SPAWN, { x: SPAWN.x + 0.9, y: 1.62, z: SPAWN.z }, smoothK);
    yawTo(45.4, 51.6, Y_HALL + 0.18, Y_HALL - 0.06, smoothK);
    pitchTo(45.4, 51.6, -0.02, -0.02, rawK);
    fade(45.4, 47.6, 1, 0);
    fade(50.8, 52.4, 0, 1);
    step(52.6, () => { armR.visible = true; });
    c.endFade = 1;
    c.keepFade = true;
  }

  /* ---------------------------------------------------------- the scenes
     All four from where the player stands in front of the encik, whose line
     rides one of his two talk takes. The hands go away (the v4.91 rule) and
     come back on the last step. His ask is the first cue of every scene. */
  const P = (s) => ({ x: s.yawPos.x, y: s.yawPos.y, z: s.yawPos.z });
  /* v10.2: the encik's talk take rides his line. The CUE ITSELF is written
     as a literal cue with its name quoted in every scene, never passed through this
     helper — the engine finds a scene's cues by reading its source
     (`CUE_RE`), and v10.0's helper hid the six encik lines from that scan,
     so on the FIRST decision of a fresh load none of them had decoded and he
     mouthed his answer in silence (Chad: "the encik voiceline does not play
     when i choose the option for the first time, it only plays when i
     replay the chapter"). */
  const encTalk = (stage, step, at, secs, take) => {
    step(at, () => { stage.encik.play(take, 1, 0.3); });
    step(at + secs + 0.2, () => { if (stage.encik.cur === take) stage.encik.play('Idle_9', 1, 0.4); });
  };

  /* A · "ENCIK, SOMETHING HAPPENED. I DON'T KNOW WHAT." (19.5 s) He doesn't
     laugh. His answer, and then he walks off along the wall; the table is
     still noisy behind you. Nothing changed, which is the point. */
  function scTell(c, s, api) {
    const { tr, step, sfx, fade, yawTo, pitchTo, faceFrom, rawK, smoothK, duck, stage, handsRoot, yaw } = api;
    const P0 = P(s);
    const E = stage.ENC;
    /* v10.8 (Chad: "his legs collides into the chair"): the walk ran at z −5.4,
       which is INSIDE the −z bench of the −4.6 row (its slab spans −5.44…−5.12
       for x −2.9…4.1). He keeps to the wall now — z −6.35, 0.9 m clear of the
       bench's edge and 0.4 m off the parapet's face. */
    const AWAY = { x: E.x - 5.6, z: E.z - 0.75 };
    const Y_E = faceFrom(P0.x, P0.z, E.x, E.z);
    step(0, () => { handsRoot.visible = false; });
    yawTo(0, 1.0, s.yawRot, Y_E, smoothK);
    pitchTo(0, 1.0, s.pitchX, 0.04, smoothK);
    sfx(0.5, 'n2askA');                          // 3.52 s → 4.0
    sfx(4.6, 'e2A'); encTalk(stage, step, 4.6, 9.92, stage.ENC_TALK[0]);   // → 14.5
    /* 14.9 he goes: a turn, then the walk take along the wall, out of the corner */
    step(14.9, () => { stage.encik.play('Walking', 1, 0.3); });
    tr(14.9, 18.6, k => {
      const g = stage.encik.group;
      g.position.x = E.x + (AWAY.x - E.x) * k; g.position.z = E.z + (AWAY.z - E.z) * k;
      g.rotation.y = Math.atan2(AWAY.x - E.x, AWAY.z - E.z);
    }, rawK);
    /* the lens FOLLOWS him — his bearing from the player is not linear in
       the walk, so the yaw is read off his real position every frame */
    tr(14.9, 18.6, () => { const g = stage.encik.group.position; yaw.rotation.y = faceFrom(P0.x, P0.z, g.x, g.z); }, rawK);
    tr(12.0, 18.0, k => { duck('cookchat', 1 + 0.25 * k); }, rawK);     // the table has not noticed anything
    fade(17.6, 19.0, 0, 1);
    step(19.3, () => { handsRoot.visible = true; });
    c.endFade = 1;
  }

  /* B · "ENCIK, THE BUNK IS HAUNTED. I'M SURE." (17.5 s, critical) "You saw?"
     "No, but—" "Don't talk cock! Go back and eat your breakfast!" The whole
     table has gone quiet — every head up, turned. His line to himself. */
  function scSure(c, s, api) {
    const { tr, step, sfx, fade, yawTo, pitchTo, faceFrom, rawK, smoothK, duck, stage, handsRoot } = api;
    const P0 = P(s);
    const E = stage.ENC;
    const T = { x: 0.6, z: stage.ROW_Z[stage.OURS] };
    const Y_E = faceFrom(P0.x, P0.z, E.x, E.z), Y_T = faceFrom(P0.x, P0.z, T.x, T.z);
    step(0, () => { handsRoot.visible = false; });
    yawTo(0, 1.0, s.yawRot, Y_E, smoothK);
    pitchTo(0, 1.0, s.pitchX, 0.04, smoothK);
    sfx(0.5, 'n2askB');                          // 2.32 s → 2.8
    sfx(3.4, 'e2saw'); encTalk(stage, step, 3.4, 0.88, stage.ENC_TALK[1]);     // → 4.3
    sfx(4.8, 'n2nobut');                         // 1.68 s → 6.5
    sfx(6.6, 'e2cock'); encTalk(stage, step, 6.6, 3.04, stage.ENC_TALK[0]);    // → 9.6
    /* the room hears it: the talk dies, the kitchen goes on, six heads come up */
    tr(7.4, 9.2, k => { duck('cookchat', 1 - 0.95 * k); duck('cookamb', 1 - 0.7 * k); }, rawK);
    step(8.2, () => { for (let i = 0; i < stage.SEATS.length; i++) stage.sitUp(i, 0, 0.35 + (i % 3) * 0.1); });
    yawTo(9.8, 12.8, Y_E, Y_T, smoothK);          // a half turn: the table is behind him
    pitchTo(9.8, 12.8, 0.04, -0.06, smoothK);
    sfx(11.8, 'n2B1');                           // 2.72 s → 14.5
    fade(15.4, 16.9, 0, 1);
    step(17.3, () => { handsRoot.visible = true; stage.allSitDown(); });
    c.endFade = 1;
  }

  /* C · "NEVER MIND ENCIK, I THINK I WAS JUST TIRED." (20.8 s) He looks at
     you a beat too long. "Ok." Cut to three in the morning: it starts again,
     and you are awake, and you know you were not tired. */
  function scNever(c, s, api) {
    const { step, sfx, fade, camTo, yawTo, pitchTo, faceFrom, rawK, smoothK, stage, handsRoot, kit } = api;
    const P0 = P(s);
    const E = stage.ENC;
    const dx = E.x - P0.x, dz = E.z - P0.z, d = Math.hypot(dx, dz);
    const NEAR = { x: E.x - dx / d * 1.05, y: 1.60, z: E.z - dz / d * 1.05 };
    const Y_E = faceFrom(P0.x, P0.z, E.x, E.z);
    const T = shots(stage, faceFrom);
    step(0, () => { handsRoot.visible = false; });
    yawTo(0, 1.0, s.yawRot, Y_E, smoothK);
    pitchTo(0, 1.0, s.pitchX, 0.04, smoothK);
    sfx(0.5, 'n2askC');                          // 2.96 s → 3.5
    /* the look: a push in on him, and then not a verdict but a "hmmmm...". v10.8
       (Chad): "the delay before encik says 'ok' is way too long, shorten it, and
       make the encik go 'hmmmm.... okay...' in a more contemplative tone" — the
       push-in is 2.6 s where it was 4.4, and the take is 1.92 s of thinking. */
    camTo(3.6, 6.2, P0, NEAR, smoothK);
    pitchTo(3.6, 6.2, 0.04, 0.10, smoothK);
    sfx(6.0, 'e2hmm'); encTalk(stage, step, 6.0, 1.92, stage.ENC_TALK[1]);     // "Hmmmm.... okay..." → 7.9
    fade(8.6, 9.6, 0, 1);
    /* 9.6 THREE IN THE MORNING, from his pillow: a defeated sigh, the line, and
       what backing down bought him (v10.8: "a 'defeated sigh' sound, before his
       voiceline of 'i should've just told him...' Also have a voiceline after
       that says 'Now, I'm alone with facing this every single night...'") */
    step(9.6, () => {
      if (kit) kit.daylight(NIGHT, 0);
      stage.setNight(true);
      stage.doorPivot.rotation.y = stage.DOOR_AJAR;
      stage.clock.set('03:00');
    });
    camTo(9.6, 26.0, T.PILLOW, T.PILLOW, rawK);
    yawTo(9.6, 26.0, T.Y_ROOM + 0.3, T.Y_PIL + 0.10, smoothK);
    pitchTo(9.6, 26.0, 0.02, 0.04, smoothK);
    fade(9.6, 11.0, 1, 0);
    step(12.0, () => stage.setShower(true, 0.7));
    sfx(12.0, 'dread', 0.6);
    sfx(13.2, 'n2sigh');                         // 2.56 s → 15.8 — the sigh
    sfx(16.2, 'n2C1');                           // 1.76 s → 18.0 — "I should have just told him..."
    sfx(18.8, 'n2alone');                        // 4.64 s → 23.4 — "Now I'm alone with this... every single night."
    sfx(24.0, 'drip', 0.5);
    fade(24.6, 26.0, 0, 1);
    step(26.4, () => { handsRoot.visible = true; stage.setNight(false); if (kit) kit.daylight(null, 0); });
    c.endFade = 1;
  }

  /* D · "ENCIK, WHAT DO YOU THINK IT IS?" (16.0 s) His non-answer in his two
     talking takes, and then the shrug: the episode's whole lesson, said early,
     by a man with twenty years. */
  function scAsk(c, s, api) {
    const { step, sfx, fade, yawTo, pitchTo, faceFrom, smoothK, stage, handsRoot } = api;
    const P0 = P(s);
    const E = stage.ENC;
    const Y_E = faceFrom(P0.x, P0.z, E.x, E.z);
    step(0, () => { handsRoot.visible = false; });
    yawTo(0, 1.0, s.yawRot, Y_E, smoothK);
    pitchTo(0, 1.0, s.pitchX, 0.04, smoothK);
    sfx(0.5, 'n2askD');                          // 1.92 s → 2.4
    sfx(3.0, 'e2D1'); encTalk(stage, step, 3.0, 3.92, stage.ENC_TALK[0]);     // → 6.9
    sfx(7.6, 'e2D2'); encTalk(stage, step, 7.6, 6.24, stage.ENC_TALK[1]);     // → 13.8
    fade(14.4, 15.8, 0, 1);
    step(16.0, () => { handsRoot.visible = true; });
    c.endFade = 1;
  }

  (window.__CHAPTERS__ = window.__CHAPTERS__ || {}).e2c2 = Object.assign(DATA, {
    build,
    intro,
    scenes: [scTell, scSure, scNever, scAsk]
  });
})();
