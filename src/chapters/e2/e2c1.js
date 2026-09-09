/* Episode 2 · Chapter 1 · "The Worst Bed"
   ---------------------------------------------------------------------------
   Hawk Company's bunk on Tekong, day one of Basic Military Training. Twenty
   recruits to a room, two rows of double-deck beds, and his is the bottom
   bunk nearest the toilet door — bed one, the one nobody wanted. The day
   (fall in, the standby bed, the bunk), lights out, and at three in the
   morning the shower in the block beside his bed turns itself on.

   The first chapter built on the PLAY KIT (v7.0): a timed fall-in, a
   reaction test for the standby bed, hotspots round the bunk, lying down in
   play, the sky tweened from morning to night, presence without a ghost
   mesh, conduct on the card, a saved phase. Episode 2's axis is EXPOSURE —
   a dormitory of strangers, a sound nobody else reacts to, and a rule (no
   talking after lights out) that makes the human answer cost something.

   Built against the same contract as chapters 1–5 and the fixture:
   build(ctx) -> stage, scenes[i](c, s, api), intro(c, s, api). The plan
   this chapter was built from, checkpoint by checkpoint, is
   docs/V7.1-E2C1-PLAN.md; the models are docs/E2-SOLDIER-MODELS.md.

   ENGINE SEAMS TOUCHED: none. Every verb here is v7.0's kit.              */

(() => {
  'use strict';

  let S = null;

  const DATA = {
    id: 1,
    episode: 2,
    title: 'The Worst Bed',
    cardLabel: 'Chapter 1',
    cardTitle: 'The Worst Bed<br>Bed One, Next To The Toilet',
    brief: 'Day one of Basic Military Training. Twenty recruits to a bunk, and yours is the bottom bed nearest the toilet door. Nobody wanted it. Get through the day; then get through the night.',
    prompt: 'Three in the morning. The shower in the block next to your bed has turned itself on. What do you do?',
    choices: [
      { k: 'A', text: 'Get up and open the toilet door.',
        d: { sanity: 0, awareness: 15, wisdom: 6 }, verdict: 'good',
        say: 'I got up and looked. I found water, and nothing else, and a corridor I did not like.',
        teach: 'Investigating can provide information, but moving straight toward uncertainty is not automatically the wisest first step.' },
      { k: 'B', text: 'Stay still and listen.',
        d: { sanity: 9, awareness: 18, wisdom: 18 }, verdict: 'best',
        say: 'I stayed still and listened. What I heard was a sound. What it meant, I did not know yet.',
        teach: 'Hearing something frightening is an observation. Deciding what caused it is an interpretation.' },
      { k: 'C', text: 'Whisper to your bunkmate — "You awake?"',
        d: { sanity: 6, awareness: 15, wisdom: 15 }, verdict: 'good',
        say: 'I asked the one person who could tell me. He heard nothing. That was worth knowing.',
        teach: 'Check simple human explanations before building a more complicated interpretation.' },
      { k: 'D', text: 'It\'s a ghost — blanket over your head.',
        d: { sanity: -15, awareness: -9, wisdom: -18 }, verdict: 'worst', critical: true,
        say: 'I decided what it was before I knew anything. Under the blanket, the water kept running.',
        teach: 'Fear is a signal, not proof.' }
    ],
    core: 'A sound is a fact. What made it is a story you have not checked.<br><i>Sati — bare attention, before the mind adds its tale.</i>',

    /* units metres, y up. The bunk is one long room (x −6…6, z −4…4); the
       shower block is off its +z end; a balcony runs along +x with the parade
       square past its parapet. docs/V7.1-E2C1-PLAN.md §6 has the map. */
    spawn:     { x: 0, y: 1.62, z: -3.4 },        // just inside the entrance, looking down the room
    shrine:    { x: -4.6, z: 3.0 },               // the engine's anchor: his bed
    ghostHome: { x: -3.6, z: 6.0 },               // unused (ghost: null): the block's corridor
    bounds:    { minX: -5.7, maxX: 8.1, minZ: -3.7, maxZ: 7.2 },

    /* the eleventh leak (v4.3): NO haunting from the engine. The presence in
       this chapter is the kit's — a bar that drains while the shower runs —
       and one figure for one frame in scene A, a chapter prop. */
    ghost: null,

    /* a flat overcast Tekong morning: pale sky, soft high hemisphere, the key
       from +x (the balcony side, so the light comes in through the opening),
       no stars, no moon, a weak sun, thin cloud. NIGHT (below) is what the
       kit tweens to at lights out. */
    daylight: {
      stops: [[0.00, '#e9e4d6'], [0.22, '#d5dde2'], [0.48, '#b7c9d6'],
              [0.76, '#98b3c8'], [1.00, '#86a6c0']],
      bg: 0xb7c9d6,
      fog: [0xcfd8dc, 0.010],
      hemi: [0xe6eaee, 0x8a8478, 0.95],
      key: [0xfff1dc, 0.75, 20, 16, 4],
      fill: [0xbfcdd8, 0.32],
      stars: 0, moon: 0,
      sun: 0.35, clouds: 0.6,
      vmHemi: [0xeef1f4, 0x9a9488, 0.9],
      vmKey: [0xfff2dc, 0.65]
    },

    assets: ['fbosling', 'admintee', 'sleeper', 'sleepanim', 'ghostsoldier',
             'tree1', 'tree2', 'tree3', 'tree4', 'hdb'],

    /* the explore music bed is chapter 1's title theme and has no place in a
       bunk; this chapter's own bed (e2bed) is a loop the night starts. */
    musicVol: 0,
    ambience: { beds: [['bunkday', 0.24], ['fanloop', 0.14], ['clocktick', 0.06]] },

    words: {
      approach: 'your bed',
      act: 'Lie down', actTouch: 'Lie down',
      interact: 'E at the bed', interactTouch: 'Tap the bed',
      presence: 'Something is in the block.'
    },
    lines: { near: 'n1near', close: 'n1near', nearAt: 2.4, act: 'n1act' },
    voiceLine: 'n1voice',
    sayPrefix: 'n1'
  };

  /* lights out: the sky the kit tweens to. Darker than chapter 1's midnight
     in the fog (the room's own tubes are what go dark; outside is a camp
     with a few sodium lamps) and no moon disc — the balcony faces a square. */
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

  /* the measured length of every line this chapter says outside a cutscene
     (src/voicelines.js is the registry; the chapter cannot import it), so a
     line in play never starts over another */
  const SECS = { n1shower: 4.52, n1board: 2.27, n1late: 2.93, n1bedok: 4.91, n1bedfail: 4.21,
                 n1fallin: 1.96, n1lights: 2.77, n1wake: 1.41, n1hear: 6.03,
                 s1fallin: 3.16, s1late: 3.4, s1standby: 3.08, s1again: 1.96, s1lights: 2.27,
                 b1day: 3.08, b1sleep: 2.19, k1board: 3.0, k1three: 4.05 };

  function build(ctx) {
    const { THREE, GLTFLoader, scene, camera, yaw, LOW, kit, plantTrees,
            assetBytes, rescueTextures, redoShadows,
            cnv, makeSoftDot, makeGrass, makeConcrete,
            makeHellNote, getState, startDecision, worldSfx, HEAD_RE } = ctx;

    const SHRINE = new THREE.Vector3(DATA.shrine.x, 0, DATA.shrine.z);
    const owned = [];
    let alive = true;

    /* ------------------------------------------------------------- the map */
    const R = { x: 6.0, z: 4.0, h: 3.0, wall: 0.16 };
    const DOOR_IN = { x: 0, w: 1.0, h: 2.1 };                 // the entrance, −z wall
    const DOOR_WC = { x: -3.3, w: 0.9, h: 2.05 };              // the toilet-block door, +z wall
    const OPEN = { z0: -1.2, z1: 1.2, h: 2.2 };                // the balcony opening, +x wall
    const BLOCK = { x0: -6.0, x1: -0.5, z0: 4.0, z1: 7.5 };    // the shower block
    const BALC = { x0: 6.0, x1: 8.4, z0: -6.0, z1: 6.0, line: 7.6, parapet: 1.0 };
    const SQUARE = { x0: 8.4, x1: 40, z0: -25, z1: 25 };
    const BED = { len: 1.9, wid: 0.9, low: 0.55, high: 1.55, post: 1.9 };
    const ROW_X = [-4.6, 4.6], ROW_Z = [-3.0, -1.5, 0, 1.5, 3.0];
    const HIS = { x: -4.6, z: 3.0 };

    /* ----------------------------------------------------------- textures */
    const cTex = makeConcrete();
    const grassTex = makeGrass();
    const noteTex = makeHellNote();            // the contract wants one; nothing here uses it
    const dotTex = makeSoftDot('rgba(255,244,220,0.9)', 'rgba(255,244,220,0)');

    const wallMap = cTex.map.clone(); wallMap.needsUpdate = true;
    wallMap.repeat.set(4.0, 1.5);
    const tileTex = makeTiles(THREE, cnv);
    const tarmacTex = makeTarmac(THREE, cnv);
    const boardTex = makeBoard(THREE, cnv);
    const clock = makeClock(THREE, cnv);       // { tex, set(text) }
    const terrazzoTex = makeTerrazzo(THREE, cnv);

    const matWall = new THREE.MeshStandardMaterial({ map: wallMap, color: 0xd9d1bc, roughness: 0.96 });
    const matCeil = new THREE.MeshStandardMaterial({ color: 0xd6d2c8, roughness: 0.99 });
    const matFloor = new THREE.MeshStandardMaterial({ map: terrazzoTex, roughness: 0.55, metalness: 0.02 });
    const matTile = new THREE.MeshStandardMaterial({ map: tileTex, roughness: 0.35, metalness: 0.04 });
    const matTileFloor = new THREE.MeshStandardMaterial({ map: tileTex.clone(), color: 0xb9bcb8, roughness: 0.5 });
    matTileFloor.map.needsUpdate = true; matTileFloor.map.repeat.set(8, 6);
    const matTarmac = new THREE.MeshStandardMaterial({ map: tarmacTex, roughness: 0.95 });
    const matGrass = new THREE.MeshStandardMaterial({ map: grassTex.map, roughnessMap: grassTex.rough, color: 0x9fb37a, roughness: 1 });
    const matMetal = new THREE.MeshStandardMaterial({ color: 0x5a6068, roughness: 0.45, metalness: 0.75 });
    const matLocker = new THREE.MeshStandardMaterial({ color: 0x8a8f8a, roughness: 0.6, metalness: 0.5 });
    const matMattress = new THREE.MeshStandardMaterial({ color: 0x2f4a3c, roughness: 0.95 });
    const matBlanket = new THREE.MeshStandardMaterial({ color: 0x3a5a48, roughness: 0.98 });
    const matPillow = new THREE.MeshStandardMaterial({ color: 0xe8e2d2, roughness: 0.95 });
    const matBlade = new THREE.MeshStandardMaterial({ color: 0xe0dccf, roughness: 0.7 });
    const matTube = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xfff6e6, emissiveIntensity: 1.6, roughness: 0.4 });
    const matBoard = new THREE.MeshStandardMaterial({ map: boardTex, roughness: 0.9 });
    const matClock = new THREE.MeshBasicMaterial({ map: clock.tex, fog: false });
    const matLine = new THREE.MeshStandardMaterial({ color: 0xe6c53a, roughness: 0.8 });
    const matWhite = new THREE.MeshStandardMaterial({ color: 0xe8e8e2, roughness: 0.85 });
    const matDrain = new THREE.MeshStandardMaterial({ color: 0x1a1c1e, roughness: 0.4, metalness: 0.6 });
    const matDoor = new THREE.MeshStandardMaterial({ color: 0x6f7a72, roughness: 0.7 });
    const matProxy = new THREE.MeshStandardMaterial({ color: 0x3b4238, roughness: 0.9 });

    const world = new THREE.Group();
    scene.add(world);

    /* ---------------------------------------------------------- the shell */
    const walls = [];
    function wall(w, h, d, x, y, z, mat = matWall) {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
      m.position.set(x, y, z);
      m.castShadow = !LOW; m.receiveShadow = true;
      world.add(m); walls.push(m);
      return m;
    }
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(R.x * 2, R.z * 2), matFloor);
    floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true;
    world.add(floor);
    const ceil = new THREE.Mesh(new THREE.PlaneGeometry(R.x * 2 + 0.4, R.z * 2), matCeil);
    ceil.rotation.x = Math.PI / 2; ceil.position.set(0, R.h, 0);
    world.add(ceil);

    // −z wall with the entrance (a doorway, no leaf: the corridor outside is dark)
    {
      const z = -R.z - R.wall / 2, l = DOOR_IN.x - DOOR_IN.w / 2, r = DOOR_IN.x + DOOR_IN.w / 2;
      wall(l + R.x, R.h, R.wall, (-R.x + l) / 2, R.h / 2, z);
      wall(R.x - r, R.h, R.wall, (r + R.x) / 2, R.h / 2, z);
      wall(DOOR_IN.w, R.h - DOOR_IN.h, R.wall, DOOR_IN.x, (R.h + DOOR_IN.h) / 2, z);
      // the corridor beyond: a dark box, so the doorway reads as a way out
      const dark = new THREE.Mesh(new THREE.BoxGeometry(DOOR_IN.w + 0.6, R.h, 2.4),
        new THREE.MeshStandardMaterial({ color: 0x0c0d0f, roughness: 1, side: THREE.BackSide }));
      dark.position.set(DOOR_IN.x, R.h / 2, z - 1.3);
      world.add(dark);
    }
    // +z wall with the toilet-block door
    {
      const z = R.z + R.wall / 2, l = DOOR_WC.x - DOOR_WC.w / 2, r = DOOR_WC.x + DOOR_WC.w / 2;
      wall(l + R.x, R.h, R.wall, (-R.x + l) / 2, R.h / 2, z);
      wall(R.x - r, R.h, R.wall, (r + R.x) / 2, R.h / 2, z);
      wall(DOOR_WC.w, R.h - DOOR_WC.h, R.wall, DOOR_WC.x, (R.h + DOOR_WC.h) / 2, z);
    }
    // −x wall, solid
    wall(R.wall, R.h, R.z * 2, -R.x - R.wall / 2, R.h / 2, 0);
    // +x wall with the balcony opening (a lintel above it)
    {
      const x = R.x + R.wall / 2;
      wall(R.wall, R.h, OPEN.z0 + R.z, x, R.h / 2, (-R.z + OPEN.z0) / 2);
      wall(R.wall, R.h, R.z - OPEN.z1, x, R.h / 2, (OPEN.z1 + R.z) / 2);
      wall(R.wall, R.h - OPEN.h, OPEN.z1 - OPEN.z0, x, (R.h + OPEN.h) / 2, (OPEN.z0 + OPEN.z1) / 2);
    }

    /* the toilet-block door leaf, hinged on the −x side, swinging INTO the
       block (+z). A named swing contract, the v4.6 lesson. */
    const doorPivot = new THREE.Group();
    doorPivot.position.set(DOOR_WC.x - DOOR_WC.w / 2, 0, R.z + R.wall / 2);
    world.add(doorPivot);
    const doorLeaf = new THREE.Mesh(new THREE.BoxGeometry(DOOR_WC.w, DOOR_WC.h, 0.05), matDoor);
    doorLeaf.position.set(DOOR_WC.w / 2, DOOR_WC.h / 2, 0);
    doorLeaf.castShadow = !LOW; doorLeaf.receiveShadow = true;
    doorPivot.add(doorLeaf);
    const DOOR_SHUT = 0, DOOR_AJAR = 0.35, DOOR_OPEN = 1.5;      // rotation.y, positive = into the block
    doorPivot.rotation.y = DOOR_AJAR;

    /* ------------------------------------------------------------ the beds */
    const beds = [];                 // { x, z, group, low, high, his, sleeperAt }
    const bedGeo = {
      post: new THREE.BoxGeometry(0.05, BED.post, 0.05),
      rail: new THREE.BoxGeometry(BED.len, 0.05, 0.05),
      railEnd: new THREE.BoxGeometry(0.05, 0.05, BED.wid),
      mat: new THREE.BoxGeometry(BED.len - 0.04, 0.14, BED.wid - 0.04),
      pillow: new THREE.BoxGeometry(0.42, 0.09, 0.62),
      blanketFold: new THREE.BoxGeometry(0.50, 0.12, 0.62),
      blanketOn: new THREE.BoxGeometry(BED.len - 0.5, 0.09, BED.wid - 0.1)
    };
    function mkBed(x, z, headTowardWall) {
      const g = new THREE.Group();
      g.position.set(x, 0, z);
      world.add(g);
      const hx = BED.len / 2, hz = BED.wid / 2;
      for (const [px, pz] of [[-hx, -hz], [hx, -hz], [-hx, hz], [hx, hz]]) {
        const p = new THREE.Mesh(bedGeo.post, matMetal); p.position.set(px, BED.post / 2, pz); p.castShadow = !LOW; g.add(p);
      }
      const decks = {};
      for (const [name, y] of [['low', BED.low], ['high', BED.high]]) {
        for (const pz of [-hz, hz]) { const r = new THREE.Mesh(bedGeo.rail, matMetal); r.position.set(0, y - 0.1, pz); g.add(r); }
        for (const px of [-hx, hx]) { const r = new THREE.Mesh(bedGeo.railEnd, matMetal); r.position.set(px, y - 0.1, 0); g.add(r); }
        const m = new THREE.Mesh(bedGeo.mat, matMattress); m.position.set(0, y - 0.07, 0);
        m.castShadow = !LOW; m.receiveShadow = true; g.add(m);
        // the pillow at the wall end
        const pw = new THREE.Mesh(bedGeo.pillow, matPillow);
        pw.position.set(headTowardWall * (hx - 0.28), y + 0.045, 0); g.add(pw);
        // a blanket folded at the foot (the standby bed's shape)
        const bl = new THREE.Mesh(bedGeo.blanketFold, matBlanket);
        bl.position.set(-headTowardWall * (hx - 0.32), y + 0.06, 0); g.add(bl);
        // and one pulled over a sleeper, hidden by day
        const on = new THREE.Mesh(bedGeo.blanketOn, matBlanket);
        on.position.set(-headTowardWall * 0.15, y + 0.12, 0); on.visible = false; g.add(on);
        decks[name] = { mattress: m, pillow: pw, fold: bl, on, y };
      }
      const b = { x, z, group: g, low: decks.low, high: decks.high, head: headTowardWall,
                  his: (x === HIS.x && z === HIS.z) };
      beds.push(b);
      return b;
    }
    for (const rx of ROW_X) for (const rz of ROW_Z) mkBed(rx, rz, rx < 0 ? -1 : 1);
    const hisBed = beds.find(b => b.his);

    // lockers between the beds, against the wall
    const lockers = [];
    const lockerGeo = new THREE.BoxGeometry(0.5, 1.8, 0.5);
    for (const rx of ROW_X) for (const lz of [-2.25, -0.75, 0.75, 2.25]) {
      const l = new THREE.Mesh(lockerGeo, matLocker);
      l.position.set(rx < 0 ? -R.x + 0.27 : R.x - 0.27, 0.9, lz);
      l.castShadow = !LOW; l.receiveShadow = true;
      world.add(l); lockers.push(l);
      // a door seam
      const seam = new THREE.Mesh(new THREE.PlaneGeometry(0.02, 1.7),
        new THREE.MeshStandardMaterial({ color: 0x2a2d2a, roughness: 0.9 }));
      seam.position.set(rx < 0 ? -R.x + 0.53 : R.x - 0.53, 0.9, lz);
      seam.rotation.y = rx < 0 ? Math.PI / 2 : -Math.PI / 2;
      world.add(seam);
    }

    /* ---------------------------------------------------- fans and tubes */
    const fans = [];
    let fanSpeed = 1;
    for (const fz of [-2.4, 0, 2.4]) {
      const f = new THREE.Group(); f.position.set(0, R.h - 0.16, fz);
      const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.12, 12), matMetal);
      f.add(hub);
      const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.16, 8), matMetal);
      rod.position.y = 0.12; f.add(rod);
      for (let i = 0; i < 3; i++) {
        const bl = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.012, 0.11), matBlade);
        bl.position.set(Math.cos(i * 2.094) * 0.36, -0.02, Math.sin(i * 2.094) * 0.36);
        bl.rotation.y = -i * 2.094; bl.rotation.z = 0.12;
        f.add(bl);
      }
      world.add(f); fans.push(f);
    }
    const tubes = [];
    for (const [tx, tz] of [[-2.6, -2.4], [2.6, -2.4], [-2.6, 2.0], [2.6, 2.0]]) {
      const t = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.05, 0.10), matTube);
      t.position.set(tx, R.h - 0.05, tz); world.add(t); tubes.push(t);
    }
    /* the room's light: two points along the aisle (the phone gets one), a
       warm-white the tubes give; `setLights(k)` is the switch */
    const tubeLights = [];
    for (const lz of (LOW ? [0] : [-2.2, 2.0])) {
      const L = new THREE.PointLight(0xfff3df, 0, 15, 1.6);
      L.position.set(0, R.h - 0.35, lz);
      scene.add(L); owned.push(L); tubeLights.push(L);
    }
    const TUBE_I = LOW ? 22 : 13;
    let lightK = 1;
    function setLights(k) {
      lightK = k;
      for (const L of tubeLights) L.intensity = TUBE_I * k;
      matTube.emissiveIntensity = 1.6 * k;
      matTube.color.setScalar(0.55 + 0.45 * k);
    }
    setLights(1);
    // the block's own tube, always on (the tiles read under it in scene A)
    const blockLight = new THREE.PointLight(0xe9f0ff, LOW ? 12 : 8, 9, 1.7);
    blockLight.position.set(-3.2, R.h - 0.3, 5.6);
    scene.add(blockLight); owned.push(blockLight);
    const blockTube = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.05, 0.10), matTube.clone());
    blockTube.position.set(-3.2, R.h - 0.05, 5.6); world.add(blockTube);
    // the clock's red on the wall at night, and the balcony's sodium spill
    const clockGlow = new THREE.PointLight(0xff2a1a, 0, 3.5, 2.2);
    clockGlow.position.set(DOOR_WC.x, 2.35, R.z - 0.3);
    scene.add(clockGlow); owned.push(clockGlow);
    const balcLight = new THREE.PointLight(0xffb060, 0, 14, 1.5);
    balcLight.position.set(BALC.x1 - 0.4, 2.6, 0);
    scene.add(balcLight); owned.push(balcLight);

    /* ---------------------------------------------- the board, the clock */
    const board = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 0.95), matBoard);
    board.position.set(2.0, 1.55, -R.z + 0.01);
    world.add(board);
    const clockFace = new THREE.Mesh(new THREE.PlaneGeometry(0.62, 0.24), matClock);
    clockFace.position.set(DOOR_WC.x, 2.55, R.z - 0.01);
    clockFace.rotation.y = Math.PI;
    world.add(clockFace);
    clock.set('21:58');

    /* ------------------------------------------------------ the block ---- */
    const blockWalls = [];
    function bwall(w, h, d, x, y, z, mat = matTile) {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
      m.position.set(x, y, z); m.receiveShadow = true;
      world.add(m); blockWalls.push(m);
      return m;
    }
    {
      const bx = (BLOCK.x0 + BLOCK.x1) / 2, bw = BLOCK.x1 - BLOCK.x0, bd = BLOCK.z1 - BLOCK.z0, bz = (BLOCK.z0 + BLOCK.z1) / 2;
      const f = new THREE.Mesh(new THREE.PlaneGeometry(bw, bd), matTileFloor);
      f.rotation.x = -Math.PI / 2; f.position.set(bx, 0.002, bz); f.receiveShadow = true; world.add(f);
      const c = new THREE.Mesh(new THREE.PlaneGeometry(bw, bd), matCeil);
      c.rotation.x = Math.PI / 2; c.position.set(bx, R.h, bz); world.add(c);
      bwall(R.wall, R.h, bd, BLOCK.x0 - R.wall / 2, R.h / 2, bz);            // −x
      bwall(R.wall, R.h, bd, BLOCK.x1 + R.wall / 2, R.h / 2, bz);            // +x (the partition)
      bwall(bw + R.wall * 2, R.h, R.wall, bx, R.h / 2, BLOCK.z1 + R.wall / 2); // far wall
      // the wall the block shares with the bunk faces it in tile
      const back = new THREE.Mesh(new THREE.PlaneGeometry(bw, R.h), matTile);
      back.position.set(bx, R.h / 2, BLOCK.z0 + R.wall + 0.01); world.add(back);
      // four cubicles along the far wall, a low partition each, a shower head each
      for (let i = 0; i < 3; i++) {
        bwall(0.06, 2.0, 1.1, BLOCK.x0 + 1.35 * (i + 1) - 0.02, 1.0, BLOCK.z1 - 0.55);
      }
      for (let i = 0; i < 4; i++) {
        const hx = BLOCK.x0 + 0.65 + 1.35 * i;
        const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.9, 6), matMetal);
        pipe.position.set(hx, 1.7, BLOCK.z1 - 0.06); world.add(pipe);
        const head = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.03, 0.06, 10), matMetal);
        head.position.set(hx, 2.15, BLOCK.z1 - 0.14); head.rotation.x = 0.9; world.add(head);
      }
      // a drain in the corridor, a timer tap on the partition
      const drain = new THREE.Mesh(new THREE.CircleGeometry(0.11, 12), matDrain);
      drain.rotation.x = -Math.PI / 2; drain.position.set(-3.2, 0.004, 5.2); world.add(drain);
      const tap = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.18, 8), matMetal);
      tap.rotation.z = Math.PI / 2; tap.position.set(BLOCK.x1 - 0.1, 1.05, 5.0); world.add(tap);
    }
    /* THE WATER: the far cubicle's shower, a sheet of falling drops that the
       night turns on. Points, cheap, hidden until then. */
    const WATER_N = LOW ? 60 : 140;
    const WATER_AT = { x: BLOCK.x0 + 0.65 + 1.35 * 3, z: BLOCK.z1 - 0.18 };
    const waterGeo = new THREE.BufferGeometry();
    const waterPos = new Float32Array(WATER_N * 3);
    for (let i = 0; i < WATER_N; i++) {
      waterPos[i * 3] = WATER_AT.x + (Math.random() - 0.5) * 0.22;
      waterPos[i * 3 + 1] = Math.random() * 2.1;
      waterPos[i * 3 + 2] = WATER_AT.z + (Math.random() - 0.5) * 0.18;
    }
    waterGeo.setAttribute('position', new THREE.BufferAttribute(waterPos, 3));
    const water = new THREE.Points(waterGeo, new THREE.PointsMaterial({
      map: dotTex, color: 0xd8e8ff, size: 0.05, transparent: true, opacity: 0.55, depthWrite: false }));
    water.visible = false;
    world.add(water);
    let showerOn = false;
    function setShower(on) { showerOn = !!on; water.visible = showerOn; }

    /* ----------------------------------------------------- the balcony --- */
    {
      const bf = new THREE.Mesh(new THREE.PlaneGeometry(BALC.x1 - BALC.x0, BALC.z1 - BALC.z0), matFloor.clone());
      bf.material.color.setHex(0xb8b4a8);
      bf.rotation.x = -Math.PI / 2; bf.position.set((BALC.x0 + BALC.x1) / 2, 0.001, 0); bf.receiveShadow = true; world.add(bf);
      const roof = new THREE.Mesh(new THREE.BoxGeometry(BALC.x1 - BALC.x0 + 0.2, 0.25, BALC.z1 - BALC.z0), matCeil);
      roof.position.set((BALC.x0 + BALC.x1) / 2, R.h + 0.12, 0); roof.castShadow = !LOW; world.add(roof);
      const par = new THREE.Mesh(new THREE.BoxGeometry(0.2, BALC.parapet, BALC.z1 - BALC.z0), matWall);
      par.position.set(BALC.x1 - 0.1, BALC.parapet / 2, 0); par.castShadow = !LOW; par.receiveShadow = true;
      world.add(par); walls.push(par);
      // two columns holding the roof, at the ends
      for (const cz of [BALC.z0 + 0.3, BALC.z1 - 0.3]) {
        const col = new THREE.Mesh(new THREE.BoxGeometry(0.3, R.h, 0.3), matWall);
        col.position.set(BALC.x1 - 0.15, R.h / 2, cz); world.add(col); walls.push(col);
      }
      // the outer face of the bunk's +x wall is the balcony's inner wall; it is the same wall
      // THE FALL-IN LINE, painted yellow
      const line = new THREE.Mesh(new THREE.PlaneGeometry(0.08, 10), matLine);
      line.rotation.x = -Math.PI / 2; line.position.set(BALC.line, 0.004, 0); world.add(line);
      // the ends of the balcony: low walls so it reads as a storey, not a stage
      for (const ez of [BALC.z0, BALC.z1]) {
        const e = new THREE.Mesh(new THREE.BoxGeometry(BALC.x1 - BALC.x0, R.h, 0.2), matWall);
        e.position.set((BALC.x0 + BALC.x1) / 2, R.h / 2, ez); e.receiveShadow = true; world.add(e); walls.push(e);
      }
    }

    /* ------------------------------------------------------ the square --- */
    {
      const sq = new THREE.Mesh(new THREE.PlaneGeometry(SQUARE.x1 - SQUARE.x0, SQUARE.z1 - SQUARE.z0), matTarmac);
      sq.rotation.x = -Math.PI / 2; sq.position.set((SQUARE.x0 + SQUARE.x1) / 2, -0.02, 0); sq.receiveShadow = true;
      world.add(sq);
      // white lines: a long edge line and cross-marks every ten metres
      for (const lx of [10, 20, 30]) {
        const l = new THREE.Mesh(new THREE.PlaneGeometry(0.12, 40), matWhite);
        l.rotation.x = -Math.PI / 2; l.position.set(lx, -0.01, 0); world.add(l);
      }
      const l2 = new THREE.Mesh(new THREE.PlaneGeometry(30, 0.12), matWhite);
      l2.rotation.x = -Math.PI / 2; l2.position.set(24, -0.01, 8); world.add(l2);
      // the grass beyond, and under the trees
      const gr = new THREE.Mesh(new THREE.PlaneGeometry(140, 140), matGrass);
      gr.rotation.x = -Math.PI / 2; gr.position.set(40, -0.05, 0); gr.receiveShadow = true;
      world.add(gr);
    }
    /* the trees along the far edge of the square, dealt from seed 7 (the
       v6.15/v6.17 kit) — Chad's three files, four kinds */
    const TREE_AT = [
      [34, -22], [36, -18], [33, -14], [37, -10], [35, -6], [38, -2], [34, 2], [36, 6],
      [33, 10], [37, 14], [35, 18], [38, 22], [42, -20], [44, -12], [43, -4], [45, 4],
      [42, 12], [44, 20], [30, -26], [31, 27], [48, -26], [49, 26]
    ];
    const treeStand = plantTrees(world, TREE_AT.map(([x, z], i) => ({ x, z, h: 6.4 + ((i * 29) % 9) * 0.3 })),
      { seed: 7, tint: new THREE.Color(0.92, 0.96, 0.88), roughness: 0.94, lowKeep: 0.55 });

    // the block far off, the same model every chapter has stood under
    let hdbReady = false;
    assetBytes('hdb').then(BUF => new GLTFLoader().parse(BUF, '', (gltf) => {
      if (!alive) return;
      rescueTextures(gltf, BUF);
      const blk = gltf.scene;
      blk.scale.setScalar(0.001);
      blk.position.set(52, -4.0, 6);
      blk.rotation.y = Math.PI / 2 + 0.12;
      blk.traverse(o => {
        if (!o.isMesh) return;
        o.castShadow = false; o.receiveShadow = false;
        const mats = Array.isArray(o.material) ? o.material : [o.material];
        for (const m of mats) { m.roughness = 0.95; m.metalness = 0; }
      });
      world.add(blk);
      hdbReady = true;
      redoShadows();
    }, (err) => console.warn('HDB failed to load', err)))
      .catch(err => console.warn('HDB failed to load', err));

    /* --------------------------------------------------------- the cast --- */
    /* One loader for every rigged human in the room. A model is SIZED AND
       GROUNDED FROM ITS POSED BONES (the arms rig's law, twice over) to a
       named crown height, never from a box or the file's units; a proxy
       stands in until the bytes land, so a slow download costs a nicer
       recruit and never a chapter. `play(name, ts, fade, once, at)` is
       chapter 5's take player, verbatim in shape. */
    function mkRig(key, opts) {
      const group = new THREE.Group();
      group.position.set(opts.x, 0, opts.z);
      group.rotation.y = opts.ry || 0;
      world.add(group);
      const proxy = new THREE.Mesh(new THREE.CapsuleGeometry(0.2, opts.height - 0.4, 4, 8), matProxy);
      proxy.position.y = opts.height / 2; proxy.castShadow = !LOW;
      group.add(proxy);
      const rig = { key, group, proxy, model: null, mixer: null, acts: null, cur: null, head: null,
                    ready: false, height: opts.height, tint: opts.tint || null };
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
        rescueTextures(gltf, BUF, opts.tint ? (m) => { m.color.multiply(opts.tint); } : undefined);
        const g = gltf.scene;
        g.traverse(o => {
          if (!o.isMesh) return;
          o.castShadow = !LOW; o.receiveShadow = false; o.frustumCulled = false;
          if (opts.tint) {
            const mats = Array.isArray(o.material) ? o.material : [o.material];
            for (const m of mats) { if (m.color) m.color.multiply(opts.tint); }
          }
        });
        group.add(g);
        rig.model = g;
        if (gltf.animations && gltf.animations.length) {
          rig.mixer = new THREE.AnimationMixer(g);
          rig.acts = {};
          for (const clip of gltf.animations) rig.acts[clip.name] = rig.mixer.clipAction(clip);
          if (opts.idle && rig.acts[opts.idle]) { rig.play(opts.idle, opts.idleRate || 1, 0); rig.mixer.update(0.001); }
        }
        /* size and ground from the POSED bones */
        g.updateMatrixWorld(true);
        const v = new THREE.Vector3();
        let lo = Infinity, hi = -Infinity, crown = false;
        g.traverse(o => {
          if (!o.isBone) return;
          o.getWorldPosition(v);
          lo = Math.min(lo, v.y); hi = Math.max(hi, v.y);
          if (/HeadTop_End/.test(o.name)) crown = true;
          if (HEAD_RE.test(o.name) && !rig.head) rig.head = o;
        });
        if (isFinite(lo) && hi > lo) {
          // a rig with no crown bone tops out at the head JOINT, ~11 cm under the crown
          const span = (hi - lo) / (crown ? 1 : 0.935);
          const s = opts.height / span * (group.scale.x || 1);
          g.scale.setScalar(s);
          g.updateMatrixWorld(true);
          let lo2 = Infinity;
          g.traverse(o => { if (o.isBone) { o.getWorldPosition(v); lo2 = Math.min(lo2, v.y); } });
          g.position.y += -(lo2 - group.position.y);
        }
        proxy.visible = false;
        rig.ready = true;
        redoShadows();
        if (opts.onReady) opts.onReady(rig);
      }, (err) => { console.warn(key + ' failed to load', err); rig.ready = true; }))
        .catch(err => { console.warn(key + ' failed to load', err); rig.ready = true; });
      return rig;
    }

    /* the sergeant by the entrance, rifle slung; the buddy beside the next
       bed; a bunkmate reading the board. Their heights are the plan's (a
       sergeant of 1.74, recruits of 1.70). */
    const sergeant = mkRig('fbosling', { x: 1.3, z: -2.9, ry: -0.9, height: 1.74, idle: 'Idle_3' });
    const buddy = mkRig('admintee', { x: -3.05, z: 1.15, ry: 1.2, height: 1.70, idle: 'Idle_9' });
    const bunkmate = mkRig('admintee', { x: 1.75, z: -3.15, ry: Math.PI, height: 1.68, idle: 'Idle_9',
                                          tint: new THREE.Color(0.86, 0.90, 0.98) });
    /* the figure at the corridor's end — scene A's one frame. A stand-in
       (Chad supplies the ghost); the ghost treatment is the engine's own:
       grey, transparent, no shadow. */
    const ghostFig = mkRig('ghostsoldier', { x: BLOCK.x0 + 0.65 + 1.35 * 3, z: BLOCK.z1 - 0.55, ry: Math.PI, height: 1.72, idle: 'Idle_6',
      onReady: (rig) => {
        rig.model.traverse(o => {
          if (!o.isMesh) return;
          o.castShadow = false;
          const mats = Array.isArray(o.material) ? o.material : [o.material];
          for (const m of mats) { m.transparent = true; m.opacity = 0.55; m.color.setScalar(0.35); m.emissive?.setHex(0x0a0c14); m.depthWrite = false; }
        });
      } });
    ghostFig.group.visible = false;
    ghostFig.proxy.visible = false;

    /* THE SLEEPERS: six statues (the lying model, cloned) and two rigs on
       their own sleeping takes, in eight of the nine other bottom bunks —
       shown at lights out, hidden by day. The buddy's bed is the one beside
       his; he becomes its sleeper. */
    const sleepers = [];              // { bed, obj, rig? }
    const sleepBeds = beds.filter(b => !b.his);
    const RIGGED = new Set([1, 6]);   // which of the eight get a breathing take
    const sleeperRoot = new THREE.Group(); sleeperRoot.visible = false; world.add(sleeperRoot);
    assetBytes('sleeper').then(BUF => new GLTFLoader().parse(BUF, '', (gltf) => {
      if (!alive) return;
      rescueTextures(gltf, BUF);
      const src = gltf.scene;
      src.traverse(o => { if (o.isMesh) { o.castShadow = !LOW; o.receiveShadow = false; o.frustumCulled = false; } });
      src.updateMatrixWorld(true);
      const box = new THREE.Box3().setFromObject(src);
      const size = box.getSize(new THREE.Vector3());
      /* the statue lies along its z; a bed's length is x — a quarter turn,
         centred on the mattress, its back on the mattress top */
      const long = size.z >= size.x ? 'z' : 'x';
      const len = Math.max(size.x, size.z), sc = Math.min(1, (BED.len - 0.25) / len);
      sleepBeds.forEach((b, i) => {
        if (i >= 8 || RIGGED.has(i)) return;
        const m = src.clone();
        m.scale.setScalar(sc);
        m.rotation.y = (long === 'z' ? Math.PI / 2 : 0) + (b.head < 0 ? Math.PI : 0);
        m.position.set(b.x, b.low.y + 0.02 - box.min.y * sc, b.z);
        sleeperRoot.add(m);
        b.low.on.visible = true;
        sleepers.push({ bed: b, obj: m });
      });
      redoShadows();
    }, (err) => console.warn('sleeper failed to load', err)))
      .catch(err => console.warn('sleeper failed to load', err));
    // the two breathing ones, each its own parse (two skeletons, two clocks)
    const sleepRigs = [];
    for (const i of RIGGED) {
      const b = sleepBeds[i]; if (!b) continue;
      const g = new THREE.Group();
      g.position.set(b.x, b.low.y + 0.02, b.z);
      g.rotation.y = (b.head < 0 ? Math.PI : 0);
      sleeperRoot.add(g);
      const rig = { bed: b, group: g, mixer: null, acts: null, ready: false };
      sleepRigs.push(rig);
      assetBytes('sleepanim').then(BUF => new GLTFLoader().parse(BUF, '', (gltf) => {
        if (!alive) return;
        rescueTextures(gltf, BUF);
        const m = gltf.scene;
        m.traverse(o => { if (o.isMesh) { o.castShadow = !LOW; o.receiveShadow = false; o.frustumCulled = false; } });
        g.add(m);
        if (gltf.animations.length) {
          rig.mixer = new THREE.AnimationMixer(m);
          rig.acts = {};
          for (const clip of gltf.animations) rig.acts[clip.name] = rig.mixer.clipAction(clip);
          const take = rig.acts.Sleep_Normally || Object.values(rig.acts)[0];
          take.setEffectiveTimeScale(0.85 + 0.2 * (i % 2)); take.play();
          rig.mixer.update(0.2);
        }
        /* this rig is centimetres (the FBX family) and has no crown bone —
           measured from the posed skin, the v5.21 trap. Scale so the lying
           body spans the mattress; then ground its lowest bone on the
           mattress top. */
        m.updateMatrixWorld(true);
        const box = new THREE.Box3();
        const v = new THREE.Vector3();
        m.traverse(o => { if (o.isSkinnedMesh) {
          const p = o.geometry.attributes.position;
          for (let k = 0; k < p.count; k += 7) { o.getVertexPosition(k, v); v.applyMatrix4(o.matrixWorld); box.expandByPoint(v); }
        } });
        const size = box.getSize(new THREE.Vector3());
        const len = Math.max(size.x, size.z, 0.01), sc = (BED.len - 0.3) / len;
        m.scale.setScalar(sc);
        m.updateMatrixWorld(true);
        const box2 = new THREE.Box3();
        m.traverse(o => { if (o.isSkinnedMesh) {
          const p = o.geometry.attributes.position;
          for (let k = 0; k < p.count; k += 7) { o.getVertexPosition(k, v); v.applyMatrix4(o.matrixWorld); box2.expandByPoint(v); }
        } });
        const c = box2.getCenter(new THREE.Vector3());
        // centre on the mattress in the bed's own frame, back on the mattress top
        g.worldToLocal(c);
        m.position.x -= c.x; m.position.z -= c.z;
        m.position.y -= (box2.min.y - g.position.y);
        if (size.x > size.z) m.rotation.y += Math.PI / 2;
        b.low.on.visible = true;
        rig.ready = true;
        sleepers.push({ bed: b, obj: m, rig });
        redoShadows();
      }, (err) => console.warn('sleepanim failed to load', err)))
        .catch(err => console.warn('sleepanim failed to load', err));
    }

    /* ------------------------------------------------------------ the pile
       His bed is the thing the chapter turns on: by day it is where he lies
       down (the kit's pose); at three in the morning it is the decision.
       The engine reads exactly the fixture's shape. */
    const PILE_POS = new THREE.Vector3(HIS.x + 0.5, 0, HIS.z);
    const INTERACT_R = 2.2;
    const pile = new THREE.Group();
    pile.position.copy(PILE_POS);
    world.add(pile);
    const pileRing = new THREE.Mesh(
      new THREE.RingGeometry(0.55, 0.70, 24),
      new THREE.MeshBasicMaterial({ color: 0x63d6c8, transparent: true, opacity: 0,
        side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false, fog: false }));
    pileRing.rotation.x = -Math.PI / 2;
    pileRing.position.y = BED.low + 0.01;
    pileRing.visible = false;
    pile.add(pileRing);

    const _ndc = new THREE.Vector3(), _ray = new THREE.Raycaster(), _ptr = new THREE.Vector2();
    const syncCamera = () => {
      camera.updateWorldMatrix(true, false);
      camera.matrixWorldInverse.copy(camera.matrixWorld).invert();
    };
    function pileDist() { return Math.hypot(yaw.position.x - PILE_POS.x, yaw.position.z - PILE_POS.z); }
    function pileScreen() { syncCamera(); return _ndc.set(PILE_POS.x, BED.low, PILE_POS.z).project(camera); }
    function pileInView() {
      const n = pileScreen();
      return n.z < 1 && Math.abs(n.x) < 0.97 && Math.abs(n.y) < 0.97;
    }
    function pointerHitsPile(cx, cy) {
      if (pileDist() > INTERACT_R) return false;
      syncCamera();
      _ptr.set((cx / innerWidth) * 2 - 1, -(cy / innerHeight) * 2 + 1);
      _ray.setFromCamera(_ptr, camera);
      if (_ray.intersectObject(hisBed.low.mattress, false).length) return true;
      const n = pileScreen();
      if (n.z > 1) return false;
      const sx = (n.x * 0.5 + 0.5) * innerWidth, sy = (-n.y * 0.5 + 0.5) * innerHeight;
      return Math.hypot(cx - sx, cy - sy) < Math.min(innerWidth, innerHeight) * 0.12;
    }

    /* ------------------------------------------------------------ the day
       The chapter's clock, phase by phase (docs/V7.1-E2C1-PLAN.md §8).
       `kit.setPhase` is the bookmark the save keeps; `applyPhase` re-derives
       the room from it on a resume. CP3 stands the room up and opens the
       bunk; the whistle, the standby bed and the night arrive with CP5. */
    let phase = 'arrive';
    const speak = { until: 0 };
    function sayLine(name, vol = 1) {
      if (!worldSfx) return false;
      const now = performance.now() / 1000;
      if (now < speak.until) return false;
      speak.until = now + (SECS[name] || 2.5) + 0.25;
      worldSfx(name, vol);
      return true;
    }
    function setPhase(p) {
      phase = p;
      if (kit) kit.setPhase(p);
    }
    function interactPile() {
      if (getState() !== 'play' || pileDist() >= INTERACT_R) return false;
      if (phase === 'night') { startDecision(); return true; }
      if (!kit) return false;
      if (kit.getPose() === 'lying') kit.pose('standing');
      else kit.pose('lying', { y: BED.low + 0.12, yaw: Math.PI / 2, span: 1.2 });
      return true;
    }
    if (kit) {
      kit.objective('Find your bed — bed one');
      kit.waypoint({ x: PILE_POS.x, y: 1.0, z: PILE_POS.z });
      kit.setPhase('arrive');
    }
    const arriveWatch = { done: false };

    /* --------------------------------------------------------- hotspots */
    const seen = new Set();
    const hotspots = [
      { id: 'shower', pos: { x: DOOR_WC.x, y: 1.0, z: R.z + 0.6 }, radius: 2.0, prompt: 'Look into the shower block',
        enabled: () => phase === 'free',
        onInteract() { seen.add('shower'); return sayLine('n1shower'); } },
      { id: 'buddy', pos: { x: -3.05, y: 1.3, z: 1.15 }, radius: 2.2, prompt: 'Talk to him',
        enabled: () => phase === 'free' && buddy.group.visible,
        onInteract() {
          seen.add('buddy');
          if (!sayLine('b1day')) return false;
          buddy.play('Talk_with_Hands_Open', 1, 0.3);
          setTimeout(() => { if (alive && buddy.cur === 'Talk_with_Hands_Open') buddy.play('Idle_9', 1, 0.4); }, SECS.b1day * 1000);
          return true;
        } },
      { id: 'board', pos: { x: 2.0, y: 1.5, z: -R.z + 0.3 }, radius: 2.2, prompt: 'Read the notice board',
        enabled: () => phase === 'free',
        onInteract() {
          seen.add('board');
          if (!sayLine('k1board')) return false;
          bunkmate.play('mixamo.com', 1, 0.3);
          setTimeout(() => { if (alive && bunkmate.cur === 'mixamo.com') bunkmate.play('Idle_9', 1, 0.4); }, SECS.k1board * 1000);
          setTimeout(() => { if (alive) sayLine('n1board'); }, (SECS.k1board + 0.4) * 1000);
          return true;
        } },
      { id: 'bunkmate', pos: { x: 1.75, y: 1.3, z: -3.15 }, radius: 2.0, prompt: 'Ask him about bed one',
        enabled: () => phase === 'free' && bunkmate.group.visible && seen.has('board'),
        onInteract() {
          seen.add('bunkmate');
          if (!sayLine('k1three')) return false;
          bunkmate.play('mixamo.com', 1, 0.3);
          setTimeout(() => { if (alive && bunkmate.cur === 'mixamo.com') bunkmate.play('Idle_9', 1, 0.4); }, SECS.k1three * 1000);
          return true;
        } }
    ];

    /* ------------------------------------------------------ per frame --- */
    const _v = new THREE.Vector3();
    function updatePile(t) {
      if (getState() === 'cine') { pileRing.visible = false; return; }
      const near = THREE.MathUtils.clamp((6 - pileDist()) / (6 - INTERACT_R), 0, 1);
      pileRing.visible = near > 0.01;
      pileRing.material.opacity = near * (0.62 + 0.38 * Math.sin(t * 2.6)) * (phase === 'night' ? 0.7 : 0.45);
      // CP3: reaching the bed opens the bunk (CP5 puts the whistle here)
      if (!arriveWatch.done && phase === 'arrive' && pileDist() < 1.8) {
        arriveWatch.done = true;
        setPhase('free');
        if (kit) { kit.objective('Look around the bunk before lights out'); kit.waypoint(null); }
      }
    }
    function updateNotes(dt, t) {
      /* the CLOCKS run in every state (v5.19): a cutscene owns the poses,
         never the mixers */
      for (const r of [sergeant, buddy, bunkmate, ghostFig]) if (r.mixer && r.group.visible) r.mixer.update(dt);
      for (const r of sleepRigs) if (r.mixer && sleeperRoot.visible) r.mixer.update(dt);
      for (const f of fans) f.rotation.y += dt * 7.5 * fanSpeed;
      if (showerOn) {
        const a = waterGeo.attributes.position.array;
        for (let i = 0; i < WATER_N; i++) {
          a[i * 3 + 1] -= dt * (2.6 + (i % 5) * 0.3);
          if (a[i * 3 + 1] < 0.02) a[i * 3 + 1] = 2.1;
        }
        waterGeo.attributes.position.needsUpdate = true;
      }
      if (getState() === 'cine') return;
    }
    function updateFire(t) {
      // a fluorescent tube's faint flicker, the room's only "fire"
      if (getState() !== 'cine' && lightK > 0.02) {
        const fl = 1 - (Math.random() < 0.02 ? 0.08 : 0);
        for (const L of tubeLights) L.intensity = TUBE_I * lightK * fl;
      }
    }
    function updateSlow(sdt, t) {}

    /* ------------------------------------------------------ the switches */
    function setNightRoom(on) {
      // the day cast leaves, the sleepers arrive, the tubes go dark
      sergeant.group.visible = !on;
      buddy.group.visible = !on;
      bunkmate.group.visible = !on;
      sleeperRoot.visible = on;
      for (const b of beds) { b.low.fold.visible = !on || b.his || !sleepers.find(s => s.bed === b); }
      setLights(on ? 0 : 1);
      clockGlow.intensity = on ? 2.2 : 0;
      balcLight.intensity = on ? 6 : 0;
      clock.set(on ? '03:00' : '21:58');
    }

    /* --------------------------------------------- snap / restore / reset */
    function snap() {
      return { door: doorPivot.rotation.y, fan: fanSpeed, lightK, shower: showerOn,
               night: sleeperRoot.visible, ghost: ghostFig.group.visible,
               clockGlow: clockGlow.intensity, balc: balcLight.intensity,
               water: water.material.opacity, blanketHis: hisBed.low.on.visible };
    }
    function restore(s) {
      doorPivot.rotation.y = s.door; fanSpeed = s.fan; setLights(s.lightK); setShower(s.shower);
      sleeperRoot.visible = s.night; ghostFig.group.visible = s.ghost;
      clockGlow.intensity = s.clockGlow; balcLight.intensity = s.balc;
      water.material.opacity = s.water; hisBed.low.on.visible = s.blanketHis;
      sergeant.group.visible = buddy.group.visible = bunkmate.group.visible = !s.night;
      for (const r of [sergeant, buddy, bunkmate]) if (r.acts) r.play(r.key === 'fbosling' ? 'Idle_3' : 'Idle_9', 1, 0);
    }
    function reset() {
      doorPivot.rotation.y = DOOR_AJAR; fanSpeed = 1; setShower(false);
      ghostFig.group.visible = false; water.material.opacity = 0.55; hisBed.low.on.visible = false;
      setNightRoom(false);
      arriveWatch.done = false;
      seen.clear();
      setPhase('arrive');
      if (kit) { kit.objective('Find your bed — bed one'); kit.waypoint({ x: PILE_POS.x, y: 1.0, z: PILE_POS.z }); }
    }

    /* ------------------------------------------------------------ blockers */
    function blockers() {
      const out = [];
      const box = (o, pad = 0.20) => {
        o.updateWorldMatrix(true, false);
        const b = new THREE.Box3().setFromObject(o);
        b.expandByScalar(pad);
        out.push(b);
      };
      // furniture is a COLUMN, floor to above the probe (v5.03)
      const solid = (o) => {
        o.updateWorldMatrix(true, false);
        const b = new THREE.Box3().setFromObject(o);
        b.expandByScalar(0.14);
        b.min.y = 0; b.max.y = Math.max(b.max.y, 1.40);
        out.push(b);
      };
      for (const w of walls) box(w);
      for (const w of blockWalls) box(w, 0.16);
      for (const b of beds) solid(b.low.mattress);
      for (const l of lockers) solid(l);
      return out;
    }

    /* ------------------------------------------------------------ teardown */
    function dispose() {
      alive = false;
      treeStand.userData.disposeTrees?.();      // BEFORE the sweep: the kit's maps are shared (v6.15)
      const geos = new Set(), mats = new Set();
      world.traverse(o => {
        if (o.geometry) geos.add(o.geometry);
        if (o.material) for (const m of (Array.isArray(o.material) ? o.material : [o.material])) mats.add(m);
      });
      scene.remove(world);
      for (const o of owned) { o.parent?.remove(o); o.dispose?.(); }
      owned.length = 0;
      for (const r of [sergeant, buddy, bunkmate, ghostFig]) r.mixer?.stopAllAction();
      for (const r of sleepRigs) r.mixer?.stopAllAction();
      for (const g of geos) g.dispose();
      for (const m of mats) {
        for (const k of ['map', 'roughnessMap', 'normalMap', 'emissiveMap', 'alphaMap']) m[k]?.dispose?.();
        m.dispose();
      }
      for (const t of [cTex.map, cTex.rough, grassTex.map, grassTex.rough, wallMap, noteTex, dotTex,
                       tileTex, tarmacTex, boardTex, clock.tex, terrazzoTex]) t?.dispose?.();
      world.clear();
      S = null;
    }

    const readyAt = performance.now();
    return (S = {
      world, noteTex, blockers: blockers(),
      // the film shows the sergeant and the buddy: wait for them, but never past twelve seconds
      ready: () => (sergeant.ready && buddy.ready) || performance.now() - readyAt > 12000,
      pile: { pos: PILE_POS, radius: INTERACT_R, group: pile,
              dist: pileDist, screen: pileScreen, inView: pileInView,
              hits: pointerHitsPile, interact: interactPile,
              glow: () => pileRing.material.opacity },
      // the contract's names, then this chapter's own
      drum: doorPivot, ash: null, embers: null, heroNote: null, smoke: null, flying: null,
      jossTips: [], fireLight: tubeLights[0],
      get noteStorm() { return 1; },
      set noteStorm(v) {},
      beds, hisBed, lockers, fans, tubes, tubeLights, board, clockFace, clock,
      doorPivot, doorLeaf, DOOR_SHUT, DOOR_AJAR, DOOR_OPEN, DOOR_WC, DOOR_IN, OPEN, BLOCK, BALC, R, BED, WATER_AT,
      water, setShower, setLights, setNightRoom, blockLight, clockGlow, balcLight,
      sergeant, buddy, bunkmate, ghostFig, sleepers, sleepRigs, sleeperRoot,
      sayLine, seen,
      get phase() { return phase; },
      setPhase,
      get fanSpeed() { return fanSpeed; },
      set fanSpeed(v) { fanSpeed = v; },
      updateNotes, updatePile, updateFire, updateSlow,
      setNoteTexture() {},          // no hell note in this chapter
      snap, restore, reset, dispose,
      hotspots
    });
  }

  /* ---------------------------------------------------------- textures ---- */
  function makeTiles(THREE, cnv) {
    const s = 256, [c, ctx] = cnv(s);
    ctx.fillStyle = '#9da39e'; ctx.fillRect(0, 0, s, s);
    const n = 4, t = s / n;
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
      const v = 226 + ((x * 7 + y * 13) % 5) * 4;
      ctx.fillStyle = `rgb(${v},${v + 2},${v - 2})`;
      ctx.fillRect(x * t + 3, y * t + 3, t - 6, t - 6);
    }
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.repeat.set(6, 3);
    return tex;
  }
  function makeTarmac(THREE, cnv) {
    const s = 256, [c, ctx] = cnv(s);
    ctx.fillStyle = '#4c4e50'; ctx.fillRect(0, 0, s, s);
    for (let i = 0; i < 2600; i++) {
      const v = 60 + Math.random() * 40;
      ctx.fillStyle = `rgb(${v},${v},${v + 3})`;
      ctx.fillRect(Math.random() * s, Math.random() * s, 2, 2);
    }
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.repeat.set(24, 36);
    return tex;
  }
  function makeTerrazzo(THREE, cnv) {
    const s = 256, [c, ctx] = cnv(s);
    ctx.fillStyle = '#b9b3a4'; ctx.fillRect(0, 0, s, s);
    for (let i = 0; i < 900; i++) {
      const v = 120 + Math.random() * 90;
      ctx.fillStyle = `rgba(${v},${v - 6},${v - 14},0.9)`;
      ctx.fillRect(Math.random() * s, Math.random() * s, 1 + Math.random() * 3, 1 + Math.random() * 3);
    }
    ctx.strokeStyle = 'rgba(60,60,60,0.35)'; ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, s - 2, s - 2);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.repeat.set(10, 7);
    return tex;
  }
  function makeBoard(THREE, cnv) {
    const s = 512, [c, ctx] = cnv(s);
    ctx.fillStyle = '#3d5a3a'; ctx.fillRect(0, 0, s, s);           // green baize
    ctx.fillStyle = '#7a5a34'; ctx.fillRect(0, 0, s, 14); ctx.fillRect(0, s - 14, s, 14);
    ctx.fillRect(0, 0, 14, s); ctx.fillRect(s - 14, 0, 14, s);
    const sheet = (x, y, w, h, rot, lines) => {
      ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
      ctx.fillStyle = '#efe9d8'; ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#222'; ctx.font = 'bold 22px sans-serif';
      lines.forEach((l, i) => ctx.fillText(l, 14, 34 + i * 28));
      ctx.fillStyle = '#c33'; ctx.beginPath(); ctx.arc(w / 2, 8, 5, 0, 7); ctx.fill();
      ctx.restore();
    };
    sheet(40, 40, 210, 170, -0.04, ['HAWK COY', 'WEEK 2', 'LIVE FIRING', 'RANGE 0700']);
    sheet(280, 60, 190, 140, 0.05, ['DUTY ROSTER', 'BUNK 3', 'LIGHTS OUT', '2200']);
    sheet(70, 260, 180, 160, 0.03, ['STANDBY BED', '1 PILLOW', '1 BLANKET', 'BOOTS UNDER']);
    sheet(300, 250, 170, 200, -0.06, ['NO TALKING', 'AFTER', 'LIGHTS OUT', '', '- PLT SGT']);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }
  function makeClock(THREE, cnv) {
    const w = 256, h = 96;
    const [c, ctx] = cnv(w);
    c.width = w; c.height = h;
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    const set = (text) => {
      ctx.fillStyle = '#0a0a0a'; ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#ff2a1a'; ctx.font = 'bold 72px monospace';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.shadowColor = '#ff3a2a'; ctx.shadowBlur = 14;
      ctx.fillText(text, w / 2, h / 2 + 4);
      ctx.shadowBlur = 0;
      tex.needsUpdate = true;
    };
    return { tex, set };
  }

  /* ---------------------------------------------------------- the scenes
     CP3 stands the world up; the four scenes of docs/V7.1-E2C1-PLAN.md §10
     land at CP6. These placeholders hold the contract's shape meanwhile. */
  function placeholder(seconds) {
    return (c, s, api) => {
      const { fade, pitchTo, sfx } = api;
      pitchTo(0, seconds * 0.6, s.pitchX, -0.2);
      sfx(0.2, 'dread');
      fade(seconds * 0.7, seconds, 0, 1);
      c.endFade = 1;
    };
  }

  (window.__CHAPTERS__ = window.__CHAPTERS__ || {}).e2c1 = Object.assign(DATA, {
    build,
    scenes: [placeholder(2.4), placeholder(2.4), placeholder(2.2), placeholder(2.4)]
  });
})();
