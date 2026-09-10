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
    spawn:     { x: 0, y: 1.62, z: -3.4, rot: Math.PI },   // just inside the entrance, FACING down the room (v7.5: rot)
    shrine:    { x: -4.6, z: 3.0 },               // the engine's anchor: his bed
    ghostHome: { x: -3.6, z: 6.0 },               // unused (ghost: null): the block's corridor
    bounds:    { minX: -5.7, maxX: 8.1, minZ: -3.7, maxZ: 7.2 },

    /* the eleventh leak (v4.3): NO haunting from the engine. The presence in
       this chapter is the kit's — a bar that drains while the shower runs —
       and one figure for one frame in scene A, a chapter prop. */
    ghost: null,

    /* v7.5: THE EVENING. The wall clock says 21:58 when play begins, and
       until now the sky outside said ten in the morning — the film crossed
       a day and then handed back a morning, which Chad saw as "the intro
       cinematic suddenly turn into night, and then gameplay is morning
       again". Play begins in the evening the film ends on: dusk gone to a
       deep blue, the square under sodium lamps, the room lit by its own
       tubes (so the HANDS are lit warm, not by the sky). MORNING (below) is
       what the film opens in; NIGHT is what lights out goes to. */
    daylight: {
      stops: [[0.00, '#2a2420'], [0.20, '#1a1e30'], [0.45, '#111a30'],
              [0.75, '#0a1224'], [1.00, '#060b18']],
      bg: 0x0d1424,
      fog: [0x10161f, 0.016],
      hemi: [0x3a4664, 0x1a1a18, 0.75],
      key: [0x9fb0d0, 0.32, 20, 16, 4],
      fill: [0x556890, 0.22],
      stars: 0.55, moon: 0,
      sun: 0, clouds: 0.3,
      vmHemi: [0xeef1f4, 0x6a6660, 0.9],
      vmKey: [0xfff2dc, 0.62]
    },

    assets: ['fbosling', 'fbonosling', 'admintee', 'botak', 'encik2', 'sleeper', 'sleepanim', 'ghostsoldier',
             'tree1', 'tree2', 'tree3', 'tree4', 'hdb'],

    /* the explore music bed is chapter 1's title theme and has no place in a
       bunk; this chapter's own bed (e2bed) is a loop the night starts. */
    musicVol: 0,
    ambience: { beds: [['bunkday', 0.24], ['fanloop', 0.14], ['clocktick', 0.06]] },

    /* every word this chapter puts on the screen outside a card: the five
       the engine names the pile by, the presence banner, and (v7.1) the
       kit's words — objectives, hotspot prompts, event titles, conduct
       notes, the standby bed's eight items. All of them reach the sheet. */
    words: {
      approach: 'your bed',
      act: 'Lie down',
      actTouch: 'Lie down',
      interact: 'E at the bed',
      interactTouch: 'Tap the bed',
      presence: 'Something is in the block.',
      objArrive: 'Find your bed — bed one',
      objFallIn: 'FALL IN — on the yellow line',
      objLate: 'FALL IN — get to the line',
      objStandby: 'Back to your bed — standby bed',
      objBed: 'STANDBY BED — sixty seconds',
      objFree: 'Look around the bunk before lights out',
      objWarn: 'Lights out is coming — get to your bed',
      objLights: 'Lights out',
      objFear: 'FEAR CONTROL — keep the beat',
      hotShower: 'Look into the shower block',
      hotBuddy: 'Talk to him',
      hotBoard: 'Read the notice board',
      hotBunkmate: 'Ask him about bed one',
      hotDoor: 'Open the door',
      hotOut: 'The corridor. Not tonight.',
      evBed: 'STANDBY BED',
      evFear: 'FEAR CONTROL',
      noteOnTime: 'Fell in on time.',
      noteLate: 'Late to fall in. Push-ups.',
      noteBedOk: 'A good standby bed.',
      noteBedFail: 'The bunk did it again because of you.',
      item1: 'Pillow',
      item2: 'Bedsheet',
      item3: 'Blanket',
      item4: 'Boots',
      item5: 'Water bottle',
      item6: 'Mug',
      item7: 'Toothbrush',
      item8: 'Locker'
    },
    lines: { near: 'n1near', close: 'n1near', nearAt: 2.4, act: 'n1act' },
    voiceLine: 'n1voice',
    sayPrefix: 'n1'
  };

  /* lights out: the sky the kit tweens to. Darker than chapter 1's midnight
     in the fog (the room's own tubes are what go dark; outside is a camp
     with a few sodium lamps) and no moon disc — the balcony faces a square. */
  /* v7.5: the morning the FILM opens in (the declaration until v7.4): a
     flat overcast Tekong morning, the key from the balcony side. */
  const MORNING = {
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
  };
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
  const SECS = { n1shower: 4.05, n1board: 2.12, n1late: 2.77, n1bedok: 3.08, n1bedfail: 2.85,
                 n1fallin: 1.8, n1lights: 2.04, n1wake: 1.72, n1hear: 4.44,
                 s1fallin: 3.16, s1late: 3.4, s1standby: 3.08, s1again: 1.96, s1lights: 2.27,
                 b1day: 3.08, b1sleep: 2.19, k1board: 3.0, k1three: 4.05 };

  function build(ctx) {
    const { THREE, GLTFLoader, cloneSkinned, scene, camera, yaw, LOW, kit, plantTrees,
            assetBytes, rescueTextures, redoShadows,
            cnv, makeSoftDot, makeGrass, makeConcrete,
            makeHellNote, getState, startDecision, worldSfx, warmSounds, HEAD_RE } = ctx;

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
    /* v7.4: THE BALCONY-SIDE ROW IS NOT THE WALL-SIDE ROW. The +x wall
       carries the door to the balcony, and until now a bed and two lockers
       stood across it: the fall-in line was UNREACHABLE ON FOOT. Measured on
       the shipped build, the furthest a player could walk was x 5.74 and the
       line is at 7.25 — 4274 walkable cells out there, none of them reached.
       A bunk with a door in it has a GANGWAY to that door. The +x row is
       four beds and two lockers, all clear of z ±1.10, so 2.2 m of open
       floor leads from the middle aisle straight out onto the balcony. The
       −x row (and HIS bed, at −4.6, 3.0) is untouched. */
    const ROW_Z_BALC = [-3.35, -2.2, 2.2, 3.35];
    const LOCK_Z = [-2.25, -0.75, 0.75, 2.25], LOCK_Z_BALC = [-1.5, 1.5];
    const bedZs  = rx => (rx < 0 ? ROW_Z : ROW_Z_BALC);
    const lockZs = rx => (rx < 0 ? LOCK_Z : LOCK_Z_BALC);
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
    /* v7.9: the dial is a lit object, not a lamp — the map lights normally
       and a low emissive copy of it keeps the face readable after lights
       out without turning a wall clock into a light source. */
    const matClock = new THREE.MeshStandardMaterial({ map: clock.tex, emissiveMap: clock.tex,
      emissive: 0xffffff, emissiveIntensity: 0.30, roughness: 0.85, transparent: true, fog: false });
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
      /* v7.2: and a floor of its own, run 24 cm into the room as a rubber
         DOORMAT — the bunk's floor ends at the wall's inner face and the
         corridor's began at its outer one, and the square's grass plane
         showed through the 8 cm between them as a green sliver */
      const darkFloor = new THREE.Mesh(new THREE.PlaneGeometry(DOOR_IN.w + 0.6, 2.9),
        new THREE.MeshStandardMaterial({ color: 0x141614, roughness: 1 }));
      darkFloor.rotation.x = -Math.PI / 2; darkFloor.position.set(DOOR_IN.x, 0.012, z - 1.3 + 0.16);
      world.add(darkFloor);
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
      /* v7.2: the blanket over a SLEEPER covers him from the chest to the
         foot of the bed at a body's height — the flat slab it was lay
         hidden under the statue, and eight men slept uncovered */
      blanketOn: new THREE.BoxGeometry(BED.len - 0.62, 0.20, BED.wid - 0.06),
      sheet: new THREE.BoxGeometry(BED.len - 0.16, 0.012, BED.wid - 0.12),
      boot: new THREE.BoxGeometry(0.28, 0.11, 0.11),
      mesh: new THREE.PlaneGeometry(BED.len - 0.06, BED.wid - 0.06)
    };
    const meshTex = makeMesh(THREE, cnv);
    const matSheet = new THREE.MeshStandardMaterial({ color: 0xe9e6dc, roughness: 0.92 });
    const matBoot = new THREE.MeshStandardMaterial({ color: 0x2a2622, roughness: 0.55, metalness: 0.05 });
    const matMesh = new THREE.MeshStandardMaterial({ map: meshTex, transparent: true, alphaTest: 0.35,
      color: 0x9aa0a8, roughness: 0.5, metalness: 0.6, side: THREE.DoubleSide });
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
        // v7.2: the bedsheet on the mattress (one of the standby bed's eight items, never seen before)
        const sh = new THREE.Mesh(bedGeo.sheet, matSheet); sh.position.set(0, y + 0.006, 0); sh.receiveShadow = true; g.add(sh);
        // and the wire mesh under the top deck — what the film's last shot and two scenes look up at
        if (name === 'high') {
          const wm = new THREE.Mesh(bedGeo.mesh, matMesh); wm.rotation.x = Math.PI / 2; wm.position.set(0, y - 0.155, 0); g.add(wm);
        }
        // the pillow at the wall end
        const pw = new THREE.Mesh(bedGeo.pillow, matPillow);
        pw.position.set(headTowardWall * (hx - 0.28), y + 0.045, 0); g.add(pw);
        // a blanket folded at the foot (the standby bed's shape)
        const bl = new THREE.Mesh(bedGeo.blanketFold, matBlanket);
        bl.position.set(-headTowardWall * (hx - 0.32), y + 0.06, 0); g.add(bl);
        // and one pulled over a sleeper, hidden by day
        const on = new THREE.Mesh(bedGeo.blanketOn, matBlanket);
        on.position.set(-headTowardWall * 0.29, y + 0.115, 0); on.visible = false; on.castShadow = !LOW; g.add(on);
        decks[name] = { mattress: m, pillow: pw, fold: bl, on, y };
      }
      // v7.2: a pair of boots under the bed at the aisle end
      for (const bz of [-0.09, 0.09]) {
        const bt = new THREE.Mesh(bedGeo.boot, matBoot);
        bt.position.set(-headTowardWall * (hx - 0.2), 0.055, bz); bt.castShadow = !LOW; g.add(bt);
      }
      const b = { x, z, group: g, low: decks.low, high: decks.high, head: headTowardWall,
                  his: (x === HIS.x && z === HIS.z) };
      beds.push(b);
      return b;
    }
    for (const rx of ROW_X) for (const rz of bedZs(rx)) mkBed(rx, rz, rx < 0 ? -1 : 1);
    const hisBed = beds.find(b => b.his);

    // lockers between the beds, against the wall
    const lockers = [];
    const lockerGeo = new THREE.BoxGeometry(0.5, 1.8, 0.5);
    const packGeo = new THREE.BoxGeometry(0.42, 0.26, 0.34);
    const matPack = new THREE.MeshStandardMaterial({ color: 0x3d4a3a, roughness: 0.95 });
    for (const rx of ROW_X) for (const lz of lockZs(rx)) {
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
      // v7.2: a field pack on top of each locker
      const pk = new THREE.Mesh(packGeo, matPack);
      pk.position.set(rx < 0 ? -R.x + 0.27 : R.x - 0.27, 1.8 + 0.13, lz + (lz > 0 ? -0.04 : 0.04));
      pk.rotation.y = (lz * 0.7) % 0.5; pk.castShadow = !LOW; world.add(pk);
    }

    /* v7.2: LOUVRED WINDOWS along the −x wall, one above each bed head — a
       Tekong bunk is lit from both long sides, and this room was a box lit
       from one. The glass is a pale overcast sky by day and goes to the
       night's blue-black with the room (`setWindows(k)`, k = nightK). */
    /* v7.9 (Chad's Tekong photograph): A LONG TABLE DOWN THE MIDDLE with the
       chairs stacked on it. It runs along X — the room is 12 m across and 8
       deep, its two bed rows face each other over the x axis, so the long
       axis of the open floor is x, not z — and it stands in the FAR half, at
       z 2.55. Both of those are forced. The entrance is at x 0 on the −z
       wall and the spawn is 0.6 m inside it, so a table down the z axis
       stood a stack of chairs in the doorway (rendered from the spawn: a
       black wall a metre from the lens); and the balcony opening is z ±1.2
       with v7.4's gangway running through it, which the far half clears by
       a metre. `walktest` proves the gangway, the toilet, the doors and the
       corridor still work. */
    const tables = [];
    {
      const TAB = { x: 0, z: 2.55, len: 3.60, dep: 0.75, top: 0.735 };
      const matTable = new THREE.MeshStandardMaterial({ color: 0xd7cfbb, roughness: 0.7 });
      const matChair = new THREE.MeshStandardMaterial({ color: 0xb08a52, roughness: 0.8 });
      const top = new THREE.Mesh(new THREE.BoxGeometry(TAB.len, 0.05, TAB.dep), matTable);
      top.position.set(TAB.x, TAB.top, TAB.z); top.castShadow = !LOW; top.receiveShadow = true;
      world.add(top); tables.push(top);
      for (const lx of [-TAB.len / 2 + 0.18, TAB.len / 2 - 0.18]) for (const lz of [-0.27, 0.27]) {
        const lg = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.71, 8), matMetal);
        lg.position.set(TAB.x + lx, 0.355, TAB.z + lz); world.add(lg);
      }
      /* three stacks of three, backs to the wall. Only the BOTTOM chair
         carries legs — that is what a stack looks like: the ones above nest
         into it, the seat rising 8.5 cm at a time. */
      const seatGeo = new THREE.BoxGeometry(0.40, 0.035, 0.40);
      const backGeo = new THREE.BoxGeometry(0.40, 0.36, 0.035);
      const clegGeo = new THREE.BoxGeometry(0.035, 0.42, 0.035);
      for (const sx of [-1.15, 0, 1.15]) {
        for (const cx of [-0.17, 0.17]) for (const cz of [-0.17, 0.17]) {
          const lg = new THREE.Mesh(clegGeo, matMetal);
          lg.position.set(TAB.x + sx + cx, 0.97, TAB.z + cz); world.add(lg);
        }
        for (let i = 0; i < 3; i++) {
          const st = new THREE.Mesh(seatGeo, matChair);
          st.position.set(TAB.x + sx + 0.012 * i, 1.18 + i * 0.085, TAB.z); st.rotation.y = 0.025 * i;
          st.castShadow = !LOW; world.add(st);
          const bk = new THREE.Mesh(backGeo, matChair);
          bk.position.set(TAB.x + sx + 0.012 * i, 1.38 + i * 0.085, TAB.z + 0.185); bk.rotation.y = 0.025 * i;
          bk.rotation.x = 0.12; bk.castShadow = !LOW; world.add(bk);
        }
      }
    }

    /* v7.9 (Chad's Tekong photograph): the windows are BIG and their frames
       are BLACK, and there are trees behind them. The wall is one box and
       cutting a real opening through it would move the blockers, so the view
       is PAINTED into the pane (`winView`, the memory-pocket trick) — sky
       over a tree line over a far block — and the pane keeps lerping to
       night with the room exactly as it did. */
    const winView = makeWinView(THREE, cnv);
    const matGlass = new THREE.MeshStandardMaterial({ map: winView, emissiveMap: winView,
      color: 0xcfdfe8, emissive: 0xdfe9ef, emissiveIntensity: 0.9, roughness: 0.3 });
    const matFrame = new THREE.MeshStandardMaterial({ color: 0x22262a, roughness: 0.55, metalness: 0.35 });
    const WIN = { w: 1.30, h: 1.30, y: 1.72 };
    const winGeo = { glass: new THREE.PlaneGeometry(WIN.w, WIN.h), slat: new THREE.BoxGeometry(0.02, 0.05, WIN.w - 0.05),
                     frameV: new THREE.BoxGeometry(0.04, WIN.h + 0.09, 0.06), frameH: new THREE.BoxGeometry(0.04, 0.06, WIN.w + 0.09),
                     mullV: new THREE.BoxGeometry(0.03, WIN.h, 0.045), mullH: new THREE.BoxGeometry(0.03, 0.045, WIN.w) };
    for (const wzz of ROW_Z) {
      const gl = new THREE.Mesh(winGeo.glass, matGlass);
      gl.position.set(-R.x + 0.012, WIN.y, wzz); gl.rotation.y = Math.PI / 2; world.add(gl);
      for (const dy of [-WIN.h / 2, WIN.h / 2]) { const fr = new THREE.Mesh(winGeo.frameH, matFrame); fr.position.set(-R.x + 0.02, WIN.y + dy, wzz); world.add(fr); }
      for (const dz of [-WIN.w / 2, WIN.w / 2]) { const fr = new THREE.Mesh(winGeo.frameV, matFrame); fr.position.set(-R.x + 0.02, WIN.y, wzz + dz); world.add(fr); }
      // the panes: one bar across, one up the middle
      const mh = new THREE.Mesh(winGeo.mullH, matFrame); mh.position.set(-R.x + 0.02, WIN.y + 0.10, wzz); world.add(mh);
      const mv = new THREE.Mesh(winGeo.mullV, matFrame); mv.position.set(-R.x + 0.02, WIN.y, wzz); world.add(mv);
      // the top light's louvres, tilted open
      for (let i = 0; i < 3; i++) {
        const sl = new THREE.Mesh(winGeo.slat, matFrame);
        sl.position.set(-R.x + 0.045, WIN.y + 0.24 + i * 0.16, wzz); sl.rotation.z = 0.55; world.add(sl);
      }
    }
    let winK = 0;
    const GLASS_DAY = { c: new THREE.Color(0xcfdfe8), e: new THREE.Color(0xdfe9ef), i: 0.9 };
    const GLASS_NIGHT = { c: new THREE.Color(0x0b1220), e: new THREE.Color(0x14203a), i: 0.35 };
    function setWindows(k) {
      winK = Math.max(0, Math.min(1, k));
      matGlass.color.copy(GLASS_DAY.c).lerp(GLASS_NIGHT.c, winK);
      matGlass.emissive.copy(GLASS_DAY.e).lerp(GLASS_NIGHT.e, winK);
      matGlass.emissiveIntensity = GLASS_DAY.i + (GLASS_NIGHT.i - GLASS_DAY.i) * winK;
    }
    setWindows(1);            // v7.5: play begins at 21:58 — dark glass; only the film's dusk drives this 0 -> 1

    /* v7.2: the dressing a bunk has and a render does not — an extinguisher
       and a bin by the entrance, a broom in the corner, a bucket by the
       block door */
    {
      const ext = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.5, 12),
        new THREE.MeshStandardMaterial({ color: 0xb8241c, roughness: 0.45, metalness: 0.3 }));
      // on the far side of the door from the sergeant (his stand is x 1.3; the first try put it in his back)
      ext.position.set(DOOR_IN.x - 0.85, 0.95, -R.z + 0.14); world.add(ext);
      const extTop = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.12, 8), matMetal);
      extTop.position.set(DOOR_IN.x - 0.85, 1.26, -R.z + 0.14); world.add(extTop);
      const bracket = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.06, 0.06), matMetal);
      bracket.position.set(DOOR_IN.x - 0.85, 0.75, -R.z + 0.09); world.add(bracket);
      const bin = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.15, 0.56, 14),
        new THREE.MeshStandardMaterial({ color: 0x4a5a4e, roughness: 0.7 }));
      bin.position.set(DOOR_IN.x - 1.4, 0.28, -R.z + 0.36); bin.castShadow = !LOW; world.add(bin);
      const broom = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 1.3, 6),
        new THREE.MeshStandardMaterial({ color: 0x8a6a3a, roughness: 0.8 }));
      broom.position.set(-R.x + 0.16, 0.66, R.z - 0.42); broom.rotation.z = -0.14; broom.rotation.x = 0.06; world.add(broom);
      const head = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.12, 0.3),
        new THREE.MeshStandardMaterial({ color: 0x5a4a2a, roughness: 0.95 }));
      head.position.set(-R.x + 0.25, 0.06, R.z - 0.4); world.add(head);
      const bucket = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.13, 0.28, 12),
        new THREE.MeshStandardMaterial({ color: 0xd9b23a, roughness: 0.6 }));
      bucket.position.set(DOOR_WC.x + 0.85, 0.14, R.z - 0.3); world.add(bucket);
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
    /* v7.9: PAIRED tubes, as in Chad's photograph — two lamps in one fitting
       under a backing plate, not four lonely singles. The `tubes` array is
       still every glowing lamp, so setLights and the flicker are untouched. */
    const tubes = [];
    const tubeGeo = new THREE.BoxGeometry(1.2, 0.05, 0.09);
    const trayGeo = new THREE.BoxGeometry(1.3, 0.035, 0.30);
    const matTray = new THREE.MeshStandardMaterial({ color: 0xdedad0, roughness: 0.8 });
    for (const [tx, tz] of [[-2.6, -2.4], [2.6, -2.4], [-2.6, 2.0], [2.6, 2.0]]) {
      const tray = new THREE.Mesh(trayGeo, matTray);
      tray.position.set(tx, R.h - 0.012, tz); world.add(tray);
      for (const dz of [-0.075, 0.075]) {
        const t = new THREE.Mesh(tubeGeo, matTube);
        t.position.set(tx, R.h - 0.055, tz + dz); world.add(t); tubes.push(t);
      }
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
    let blockBase = LOW ? 12 : 8, blockFlicker = false, flickT = 0;
    const blockLight = new THREE.PointLight(0xe9f0ff, blockBase, 9, 1.7);
    blockLight.position.set(-3.2, R.h - 0.3, 5.6);
    scene.add(blockLight); owned.push(blockLight);
    const blockTube = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.05, 0.10), matTube.clone());
    blockTube.position.set(-3.2, R.h - 0.05, 5.6); world.add(blockTube);
    // the clock's red on the wall at night, and the balcony's sodium spill
    /* v7.2: 0.55 at 2.2 m — at 1.3 over 3.2 m it painted the whole door
       wall and the block's doorway red in every night frame; the digits
       are unlit and stay bright on their own */
    const CLOCK_GLOW = 0.55;
    /* v7.9: was the red of a digital display; the clock is analog now, so
       this is the small warm practical over the toilet door instead */
    const clockGlow = new THREE.PointLight(0xffd9a8, 0, 2.2, 2.4);
    clockGlow.position.set(DOOR_WC.x, 2.35, R.z - 0.3);
    scene.add(clockGlow); owned.push(clockGlow);
    const balcLight = new THREE.PointLight(0xffb060, 0, 14, 1.5);
    balcLight.position.set(BALC.x1 - 0.4, 2.6, 0);
    scene.add(balcLight); owned.push(balcLight);
    // and what the night leaves in the room: a cold spill over his end of it
    const nightLight = new THREE.PointLight(0x7f94c4, 0, 11, 1.6);
    nightLight.position.set(-2.4, 2.6, 1.6);
    scene.add(nightLight); owned.push(nightLight);
    // v7.2: a light over the NEXT bed for scene C — he was a dark shape beside a white pillow
    const nbLight = new THREE.PointLight(0x9fb2d8, 0, 4.2, 1.8);
    nbLight.position.set(HIS.x + 0.55, 2.3, 1.5);
    scene.add(nbLight); owned.push(nbLight);

    /* ---------------------------------------------- the board, the clock */
    const board = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 0.95), matBoard);
    board.position.set(2.0, 1.55, -R.z + 0.01);
    world.add(board);
    const clockFace = new THREE.Mesh(new THREE.PlaneGeometry(0.30, 0.30), matClock);
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
      /* v7.2: the side walls begin at the bunk wall's BACK face — begun at
         its inner face (z = 4.0) they were coplanar with it and fought it
         for the pixels: a white stripe down the far wall in every shot */
      const wz0 = BLOCK.z0 + R.wall, wd = BLOCK.z1 - wz0, wz = (wz0 + BLOCK.z1) / 2;
      const f = new THREE.Mesh(new THREE.PlaneGeometry(bw, bd), matTileFloor);
      f.rotation.x = -Math.PI / 2; f.position.set(bx, 0.002, bz); f.receiveShadow = true; world.add(f);
      const c = new THREE.Mesh(new THREE.PlaneGeometry(bw, bd), matCeil);
      c.rotation.x = Math.PI / 2; c.position.set(bx, R.h, bz); world.add(c);
      bwall(R.wall, R.h, wd, BLOCK.x0 - R.wall / 2, R.h / 2, wz);            // −x
      bwall(R.wall, R.h, wd, BLOCK.x1 + R.wall / 2, R.h / 2, wz);            // +x (the partition)
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
      map: dotTex, color: 0xdde8ff, size: 0.085, transparent: true, opacity: 0.8, depthWrite: false }));
    water.visible = false;
    world.add(water);
    /* and a falling SHEET behind the drops — white drops vanish against
       white tile (the scene frames showed a dry cubicle with the loop
       running), a scrolling streak plane does not */
    const streakTex = makeStreaks(THREE, cnv);
    const streak = new THREE.Mesh(new THREE.PlaneGeometry(0.26, 2.1),
      new THREE.MeshBasicMaterial({ map: streakTex, color: 0x9fb6d0, transparent: true, opacity: 0.7,
        side: THREE.DoubleSide, depthWrite: false, fog: false }));
    streak.position.set(WATER_AT.x, 1.05, WATER_AT.z + 0.02);
    streak.visible = false;
    world.add(streak);
    const puddle = new THREE.Mesh(new THREE.CircleGeometry(0.3, 16),
      new THREE.MeshStandardMaterial({ color: 0x6f7c86, roughness: 0.15, metalness: 0.1, transparent: true, opacity: 0.55 }));
    puddle.rotation.x = -Math.PI / 2; puddle.position.set(WATER_AT.x, 0.006, WATER_AT.z - 0.1);
    puddle.visible = false;
    world.add(puddle);
    const showerLight = new THREE.PointLight(0xa8bce0, 0, 3.4, 2.0);
    showerLight.position.set(WATER_AT.x, 1.6, WATER_AT.z - 0.4);
    scene.add(showerLight); owned.push(showerLight);
    let showerOn = false;
    function setShower(on) { showerOn = !!on; water.visible = streak.visible = puddle.visible = showerOn; showerLight.intensity = showerOn ? 2.4 : 0; }

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

    /* ------------------------------------ the film's three sets (v7.9) ---
       Chad, on v7.7: "I dont want to see the outside of the ferry and the
       sea, it should show first person pov within inside the ferry itself
       ... the player's POV is being seated inside the ferry at one of the
       seats, while looking at other recruits seating at other seats"; then
       "briefly show the scene of walking into Tekong, with the words
       'Welcome to Pulau Tekong'"; then "the Tekong bunk blocks, panning
       across the parade square ... recruits are all standing still ... with
       the encik model facing them". Three sets, each parked far outside the
       playable world in its own pocket (chapter 1's memory-pocket recipe —
       every material fog-free, because the chapter's fog eats anything that
       far out), each hidden except while the film shows it, and all three
       hidden again by reset() in case a film is cut before its own step. */
    const nfm = (o) => new THREE.MeshStandardMaterial(Object.assign({ fog: false }, o));
    const nbm = (o) => new THREE.MeshBasicMaterial(Object.assign({ fog: false }, o));
    const fmesh = (parent, geo, mat, x, y, z, rx = 0, ry = 0, rz = 0) => {
      const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.rotation.set(rx, ry, rz); parent.add(m); return m;
    };
    const fbox = (parent, w, h, d, mat, x, y, z, ry = 0) => fmesh(parent, new THREE.BoxGeometry(w, h, d), mat, x, y, z, 0, ry, 0);
    const hash = (i, k) => { const x = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453; return x - Math.floor(x); };
    /* a canvas painted onto a plane — the ferry's window light, the jetty's
       sign, the parade square's sky. `cnv` is the engine's CSP-safe one. */
    const paint = (S, fn, repeat) => {
      const [c, ctx] = cnv(S); fn(ctx, S);
      const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
      if (repeat) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(repeat[0], repeat[1]); }
      return t;
    };
    const filmTex = [];                       // every canvas made here, for dispose()

    /* ----------------------------------------------- ONE · the ferry cabin */
    const FERRY = new THREE.Vector3(-70, 0, -60);
    const ferryRoot = new THREE.Group();
    ferryRoot.position.copy(FERRY);
    ferryRoot.visible = false;
    world.add(ferryRoot);
    const CAB = { hw: 1.82, h: 2.16, z0: -5.0, z1: 12.0 };
    const SEAT_X = [-1.32, -0.74, 0.74, 1.32];        // two, the aisle, two
    const SEAT_Z = [-3.4, -2.55, -1.7, -0.85, 0, 0.85, 1.7, 2.55, 3.4, 4.25, 5.1, 5.95, 6.8, 7.65];
    const PLAYER_SEAT = { x: 1.32, z: -0.85 };        // his window seat, on the +x side
    /* the sea and the sky OUTSIDE, seen only through the window band: a
       bright morning haze over open water, painted once and hung on both
       sides far enough out that the band never shows its edges */
    const seaWall = paint(512, (ctx, S) => {
      const g = ctx.createLinearGradient(0, 0, 0, S);
      g.addColorStop(0, '#8fb0d0'); g.addColorStop(0.30, '#b9cee2'); g.addColorStop(0.46, '#dde7ee'); g.addColorStop(0.52, '#eef1f0');
      g.addColorStop(0.545, '#6d93a4'); g.addColorStop(0.75, '#4d7d92'); g.addColorStop(1, '#3d6b80');
      ctx.fillStyle = g; ctx.fillRect(0, 0, S, S);
      ctx.fillStyle = 'rgba(60,80,90,0.55)';                       // the far shore, a thin line
      ctx.fillRect(0, S * 0.529, S, S * 0.008);
      for (let i = 0; i < 220; i++) {                              // glitter on the water
        const y = S * (0.56 + hash(i, 3) * 0.42), w = 4 + hash(i, 4) * 26;
        ctx.fillStyle = `rgba(255,255,255,${0.05 + hash(i, 5) * 0.18})`;
        ctx.fillRect(hash(i, 6) * S, y, w, 1.5);
      }
    }, [3, 1]);
    filmTex.push(seaWall);
    const matSea = nbm({ map: seaWall });
    /* MEASURED, not guessed: the window aperture is 0.64 m tall and the
       eye sits 0.45 m from it, so it subtends ~70 deg — nearly the whole
       of the lens's 72. A 11 m sheet at 21 m covers 30, which is why the
       contemplative shot out of the window showed the sea as a BAND with
       the void above and below it. 50 m at 15 covers 119. The horizon is
       0.529 down the sheet, so the centre is placed to put it at the
       seated eye: 1.30 + 0.029 * 50. */
    for (const sgn of [-1, 1]) fmesh(ferryRoot, new THREE.PlaneGeometry(120, 50), matSea, sgn * 16, 2.75, 3.0, 0, sgn > 0 ? -Math.PI / 2 : Math.PI / 2);
    /* the cabin: a dark blue carpet, cream walls with a window band, a white
       ribbed ceiling with the long light box down the middle, chrome poles */
    const matCarpet = nfm({ color: 0x2b3550, roughness: 1 });
    const matPanel = nfm({ color: 0xe8eef1, roughness: 0.75 });
    const matRib = nfm({ color: 0xf4f7f8, roughness: 0.6 });
    const matChrome = nfm({ color: 0xc8ced4, roughness: 0.25, metalness: 0.85 });
    const matPane = nbm({ color: 0xffffff, transparent: true, opacity: 0.10 });
    const matLight = nbm({ color: 0xfff4dc });
    const CABL = CAB.z1 - CAB.z0, CABM = (CAB.z0 + CAB.z1) / 2;
    fmesh(ferryRoot, new THREE.PlaneGeometry(CAB.hw * 2, CABL), matCarpet, 0, 0.01, CABM, -Math.PI / 2);
    fmesh(ferryRoot, new THREE.PlaneGeometry(CAB.hw * 2, CABL), matRib, 0, CAB.h, CABM, Math.PI / 2);
    for (let z = CAB.z0 + 0.5; z < CAB.z1; z += 0.6)                     // the ceiling's ribs
      fbox(ferryRoot, CAB.hw * 2, 0.03, 0.06, matPanel, 0, CAB.h - 0.02, z);
    fbox(ferryRoot, 0.92, 0.16, CABL - 1.6, matLight, 0, CAB.h - 0.10, CABM);
    for (const sgn of [-1, 1]) {
      fbox(ferryRoot, 0.10, 1.06, CABL, matPanel, sgn * CAB.hw, 0.53, CABM);          // under the windows
      fbox(ferryRoot, 0.10, 0.46, CABL, matPanel, sgn * CAB.hw, 1.93, CABM);          // over them
      fmesh(ferryRoot, new THREE.PlaneGeometry(CABL, 0.64), matPane, sgn * (CAB.hw - 0.05), 1.38, CABM, 0, sgn > 0 ? -Math.PI / 2 : Math.PI / 2);
      for (let z = CAB.z0 + 1.7; z < CAB.z1; z += 1.7)                                // the mullions between the panes
        fbox(ferryRoot, 0.12, 0.66, 0.09, matPanel, sgn * (CAB.hw - 0.01), 1.38, z);
      for (let z = CAB.z0 + 2.0; z < CAB.z1; z += 3.0)                                // the poles at the aisle
        fmesh(ferryRoot, new THREE.CylinderGeometry(0.035, 0.035, CAB.h, 10), matChrome, sgn * 0.42, CAB.h / 2, z);
    }
    fbox(ferryRoot, CAB.hw * 2, CAB.h, 0.12, matPanel, 0, CAB.h / 2, CAB.z1);         // the forward bulkhead
    fbox(ferryRoot, CAB.hw * 2, CAB.h, 0.12, matPanel, 0, CAB.h / 2, CAB.z0);         // and the one behind him
    /* the seats: a pan, a raked back, a headrest and a chrome frame, blue and
       teal alternating down the rows as the photograph has them */
    /* measured against the photograph and the lens: the seated eye is at
       1.30 and a seat back tops out at 1.14, so the rows READ as rows —
       backs, heads over them, the window band clear above. A back that
       reaches 1.21 (v7.9's first pass) filled the whole frame with blue. */
    const seatGeo = { pan: new THREE.BoxGeometry(0.50, 0.09, 0.46), back: new THREE.BoxGeometry(0.50, 0.56, 0.11),
                      head: new THREE.BoxGeometry(0.46, 0.16, 0.13), leg: new THREE.CylinderGeometry(0.022, 0.022, 0.42, 8) };
    const matSeatA = nfm({ color: 0x3f63a8, roughness: 0.85 }), matSeatB = nfm({ color: 0x2f7f86, roughness: 0.85 });
    const ferrySeats = [];
    SEAT_Z.forEach((z, r) => SEAT_X.forEach((x, i) => {
      const m = ((r + i) % 3 === 0) ? matSeatB : matSeatA;
      const g = new THREE.Group(); g.position.set(x, 0, z); ferryRoot.add(g);
      fmesh(g, seatGeo.pan, m, 0, 0.43, 0);
      fmesh(g, seatGeo.back, m, 0, 0.73, -0.20, -0.12);
      fmesh(g, seatGeo.head, m, 0, 1.06, -0.24, -0.12);
      for (const dx of [-0.19, 0.19]) fmesh(g, seatGeo.leg, matChrome, dx, 0.21, 0.05);
      ferrySeats.push(g);
    }));
    const ferryLight = new THREE.PointLight(0xfff2e0, 12, 26, 1.2); ferryLight.position.set(0, 2.0, 1.0); ferryRoot.add(ferryLight);
    const ferrySun = new THREE.PointLight(0xdfeaf6, 16, 30, 1.1); ferrySun.position.set(3.2, 1.5, 2.0); ferryRoot.add(ferrySun);
    let swellT = 0;
    const ferryTick = (dt) => {                     // the cabin breathing on a slow swell
      swellT += dt;
      ferryRoot.rotation.z = Math.sin(swellT * 0.62) * 0.008;
      ferryRoot.rotation.x = Math.sin(swellT * 0.83 + 1) * 0.005;
      ferryRoot.position.y = FERRY.y + Math.sin(swellT * 0.9) * 0.03;
    };

    /* ------------------------------------------- TWO · the Tekong walkway */
    const JETTY = new THREE.Vector3(-70, 0, 40);
    const jettyRoot = new THREE.Group();
    jettyRoot.position.copy(JETTY);
    jettyRoot.visible = false;
    world.add(jettyRoot);
    const matWalk = nfm({ color: 0xc9c4b6, roughness: 0.92 });
    const matGreen = nfm({ color: 0x2f6b4f, roughness: 0.6, metalness: 0.3 });
    const matRoofJ = nfm({ color: 0xe6e6e0, roughness: 0.85 });
    const matRail = nfm({ color: 0xdadfe0, roughness: 0.5, metalness: 0.4 });
    fmesh(jettyRoot, new THREE.PlaneGeometry(7.0, 44), matWalk, 0, 0.01, 8, -Math.PI / 2);
    for (const sgn of [-1, 1]) {
      for (let z = -12; z <= 28; z += 4) {                                   // the columns
        fbox(jettyRoot, 0.22, 3.5, 0.22, matGreen, sgn * 3.1, 1.75, z);
        fbox(jettyRoot, 0.14, 0.14, 6.4, matGreen, sgn * 2.9, 3.42, z, 0);   // the trusses across
      }
      for (let z = -12; z <= 28; z += 1.6) fbox(jettyRoot, 0.05, 1.0, 0.05, matRail, sgn * 3.0, 0.5, z);
      for (const y of [0.55, 1.0]) fbox(jettyRoot, 0.06, 0.06, 42, matRail, sgn * 3.0, y, 8);
      fbox(jettyRoot, 0.7, 0.12, 44, matRoofJ, sgn * 3.1, 3.62, 8, 0);
    }
    fbox(jettyRoot, 7.0, 0.14, 44, matRoofJ, 0, 3.70, 8);                    // the roof itself
    for (let z = -12; z <= 28; z += 2.0) fbox(jettyRoot, 6.6, 0.05, 0.10, matGreen, 0, 3.60, z);
    /* the sign across the beam, in the photograph's black capitals */
    const signTex = paint(1024, (ctx, S) => {
      ctx.fillStyle = '#eceae2'; ctx.fillRect(0, 0, S, S);
      ctx.fillStyle = '#1b1b1b'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      /* the board is 5.0 x 1.7 and the canvas is SQUARE, so one texel is
         2.94x wider than it is tall. Type drawn straight onto it comes out
         stretched — and 'PULAU TEKONG' at 0.20 S ran off both ends of the
         canvas before it was ever stretched ("ELCOME T / LAU TEKO" on the
         first render). It is compressed by that ratio and then FITTED to the
         board by measurement, never by a guessed point size. */
      const K = 1.7 / 5.0;
      const line = (text, y) => {
        let px = Math.round(S * 0.26);
        ctx.font = 'bold ' + px + 'px Georgia, serif';
        const w = ctx.measureText(text).width * K;
        if (w > S * 0.88) { px = Math.floor(px * (S * 0.88) / w); ctx.font = 'bold ' + px + 'px Georgia, serif'; }
        ctx.save(); ctx.translate(S / 2, y); ctx.scale(K, 1); ctx.fillText(text, 0, 0); ctx.restore();
      };
      line('WELCOME TO', S * 0.34);
      line('PULAU TEKONG', S * 0.66);
    });
    filmTex.push(signTex);
    fmesh(jettyRoot, new THREE.PlaneGeometry(5.0, 1.7), nbm({ map: signTex }), 0, 2.92, 10.0, 0, Math.PI, 0);
    fbox(jettyRoot, 5.4, 1.9, 0.10, matRoofJ, 0, 2.92, 10.08);
    /* a bright morning behind it, and the island's trees over the rail */
    const skyJ = paint(512, (ctx, S) => {
      const g = ctx.createLinearGradient(0, 0, 0, S);
      g.addColorStop(0, '#8fb4d8'); g.addColorStop(0.55, '#cfe0ee'); g.addColorStop(1, '#eef2f0');
      ctx.fillStyle = g; ctx.fillRect(0, 0, S, S);
    });
    filmTex.push(skyJ);
    fmesh(jettyRoot, new THREE.PlaneGeometry(120, 50), nbm({ map: skyJ }), 0, 18, 46, 0, Math.PI, 0);
    const jettyTrees = plantTrees(jettyRoot, [
      [-14, 20], [-11, 26], [-8, 33], [12, 22], [15, 28], [9, 34], [-17, 30], [18, 34],
    ].map(([x, z], i) => ({ x, z, h: 6.5 + hash(i, 8) * 3 })),
      { seed: 31, fog: false, tint: new THREE.Color(0.7, 0.8, 0.68), roughness: 0.95, lowKeep: 0.6 });
    const jettyLight = new THREE.PointLight(0xffffff, 14, 60, 1.0); jettyLight.position.set(0, 6, 6); jettyRoot.add(jettyLight);

    /* --------------------------------------- THREE · the parade square */
    /* v7.9: the square moved OUT to x -200, not up. Its ground has to run
       to the horizon or the shot shows the void past its edge, and a plane
       that big at the old x 60 lay inside the camp's own terrain. Out here
       it overlaps only the other two FILM sets, which are never on screen
       at the same time. (Lifting it 40 m was tried first and broke the
       crowd: `mkCrowd` grounds a copy from a WORLD bone position against
       the group's LOCAL y, so every recruit went 40 m under the tarmac.) */
    const PARADE = new THREE.Vector3(-200, 0, 0);
    const paradeRoot = new THREE.Group();
    paradeRoot.position.copy(PARADE);
    paradeRoot.visible = false;
    world.add(paradeRoot);
    const matSq = nfm({ color: 0xcfcabb, roughness: 0.95 });
    const matCream = nfm({ color: 0xe9e0cc, roughness: 0.9 });
    const matOchre = nfm({ color: 0xd79a52, roughness: 0.9 });
    const matWin = nfm({ color: 0x2a3a44, roughness: 0.35, metalness: 0.3 });
    fmesh(paradeRoot, new THREE.PlaneGeometry(300, 240), matSq, 0, 0.01, 30, -Math.PI / 2);
    for (const lx of [-18, 0, 18]) fmesh(paradeRoot, new THREE.PlaneGeometry(0.12, 50), matWhite, lx, 0.02, 0, -Math.PI / 2);
    /* the block: four storeys of cream with ochre bands and a stair tower,
       the photograph's own proportions (a long face, a raised centre) */
    const BLK = { w: 46, h: 15.5, d: 11 };
    fbox(paradeRoot, BLK.w, BLK.h, BLK.d, matCream, 0, BLK.h / 2, 22);
    fbox(paradeRoot, 9.0, BLK.h + 3.2, BLK.d + 0.6, matCream, -2.0, (BLK.h + 3.2) / 2, 22);      // the stair tower
    fbox(paradeRoot, 9.4, 0.6, BLK.d + 1.0, matGreen, -2.0, BLK.h + 3.4, 22);                    // its green cap
    for (let f = 0; f < 4; f++) {
      const y = 2.4 + f * 3.6;
      fbox(paradeRoot, BLK.w + 0.5, 0.35, 0.4, matOchre, 0, y + 1.5, 22 - BLK.d / 2 - 0.05);     // the floor bands
      for (let i = 0; i < 13; i++) {
        const x = -BLK.w / 2 + 2.2 + i * 3.5;
        if (Math.abs(x + 2.0) < 4.6) continue;                                                    // the tower's own face
        fbox(paradeRoot, 1.7, 1.5, 0.25, matWin, x, y, 22 - BLK.d / 2 - 0.1);
      }
    }
    fbox(paradeRoot, 2.6, 1.8, 0.2, nfm({ color: 0xb03a34, roughness: 0.8 }), -2.0, BLK.h - 1.2, 22 - BLK.d / 2 - 0.16);  // the crest plate
    const paradeSky = paint(512, (ctx, S) => {
      const g = ctx.createLinearGradient(0, 0, 0, S);
      g.addColorStop(0, '#7ea8d4'); g.addColorStop(0.6, '#c6d9e8'); g.addColorStop(1, '#e8eef0');
      ctx.fillStyle = g; ctx.fillRect(0, 0, S, S);
    });
    filmTex.push(paradeSky);
    /* a BUBBLE, not a sheet — chapter 1's memory-pocket recipe. A flat sky
       200 m out still left the world's own dome showing as a pale arc in
       the corner of the pan; a 260 m sphere on BackSide wraps the whole
       set, and everything in it (the block at 22, the trees at 34, the
       ground's far corner at 212) stands inside that radius. */
    fmesh(paradeRoot, new THREE.SphereGeometry(260, 32, 20), nbm({ map: paradeSky, side: THREE.BackSide }), 0, 0, 0);
    const paradeTrees = plantTrees(paradeRoot, [
      [-34, 30], [-28, 34], [30, 30], [36, 33], [-40, 24], [42, 26],
    ].map(([x, z], i) => ({ x, z, h: 7 + hash(i, 12) * 3 })),
      { seed: 17, fog: false, tint: new THREE.Color(0.72, 0.82, 0.7), roughness: 0.95, lowKeep: 0.6 });
    const paradeLight = new THREE.PointLight(0xffffff, 18, 90, 1.0); paradeLight.position.set(0, 14, -6); paradeRoot.add(paradeLight);

    /* ------------------------------------------------------- the extras ---
       One model, many copies: the admin-tee recruit is loaded ONCE and the
       copies share his skeleton's clips through the engine's `cloneSkinned`
       (v4.8's law, the crowd of chapter 3). Each copy carries its own mixer
       so a pose can be PARKED per copy — a seated man on a ferry does not
       breathe in step with the man across the aisle. */
    const crowds = [];
    function mkCrowd(key, spots, clip, opts = {}) {
      const c = { group: new THREE.Group(), rigs: [], ready: false, key };
      (opts.parent || world).add(c.group);
      assetBytes(key).then(BUF => new GLTFLoader().parse(BUF, '', (gltf) => {
        if (!alive) return;
        rescueTextures(gltf, BUF);
        gltf.scene.traverse(o => { if (o.isMesh) { o.castShadow = false; o.receiveShadow = false; o.frustumCulled = false; } });
        /* the height is measured ONCE, from the POSED bones of the source */
        gltf.scene.updateMatrixWorld(true);
        const v = new THREE.Vector3(); let lo = Infinity, hi = -Infinity, crown = false;
        gltf.scene.traverse(o => { if (!o.isBone) return; o.getWorldPosition(v); lo = Math.min(lo, v.y); hi = Math.max(hi, v.y); if (/HeadTop_End/.test(o.name)) crown = true; });
        const span = (hi - lo) / (crown ? 1 : 0.935);
        const s = (opts.height || 1.70) / (span || 1.7);
        spots.forEach((sp, i) => {
          const g = new THREE.Group();
          g.position.set(sp.x, 0, sp.z); g.rotation.y = sp.ry || 0; g.scale.setScalar(s);
          const m = cloneSkinned(gltf.scene);
          g.add(m); c.group.add(g);
          const mixer = new THREE.AnimationMixer(m);
          const cl = gltf.animations.find(a => a.name === (sp.clip || clip)) || gltf.animations[0];
          const act = mixer.clipAction(cl);
          act.play();
          if (sp.at !== undefined || opts.at !== undefined) { act.time = cl.duration * (sp.at !== undefined ? sp.at : opts.at); act.paused = true; }
          else act.time = cl.duration * hash(i, 2);
          mixer.update(0.0001);
          /* ground the copy: on its own posed feet, or — for a SEATED take,
             whose legs fold under because a retarget carries rotations and
             not the hips' translation — by putting the HIPS on the seat pan */
          m.updateMatrixWorld(true);
          if (opts.hipY !== undefined) {
            let hip = null; m.traverse(o => { if (o.isBone && !hip && /Hips/.test(o.name)) hip = o; });
            if (hip) { hip.getWorldPosition(v); m.position.y += (opts.hipY - (v.y - g.position.y)) / s; }
          } else {
            let lo2 = Infinity; m.traverse(o => { if (o.isBone) { o.getWorldPosition(v); lo2 = Math.min(lo2, v.y); } });
            if (isFinite(lo2)) m.position.y += -(lo2 - g.position.y) / s;
          }
          c.rigs.push({ g, m, mixer, act, dur: cl.duration });
        });
        c.ready = true;
      }, (err) => { console.warn(key + ' crowd failed', err); c.ready = true; }))
        .catch(err => { console.warn(key + ' crowd failed', err); c.ready = true; });
      crowds.push(c);
      return c;
    }
    /* the recruits in the other seats — the pose PARKED, each at his own
       frame; the seat in front hides the legs the sitting take folds under.
       v8.0: Chad's BOTAK recruit, and his file's own two sitting takes rather
       than one retargeted `Sit` — `Chair_Sit_Idle_M` sits up with the hands
       on the knees, `Sit_and_Doze_Off` slumps, so a cabin of ten reads as ten
       men and not one man copied. Dealt alternately down the rows. */
    /* WHERE IN A SITTING TAKE A MAN IS ACTUALLY SITTING UP, measured rather
       than assumed — and the first pass got it wrong, which is the lesson.
       `Chair_Sit_Idle_M` is not an idle: sampled 40 times, the head sits
       0.58 m above the hips for the first eighth and the last sixth of it and
       COLLAPSES to 0.27 in between — he folds right over, head down at his
       knees, for more than half the clip. Ten riders parked on evenly spread
       fractions therefore put seven of them face-down below the seat backs,
       and the cabin rendered empty. `Sit_and_Doze_Off` has no such fold: it
       holds 0.53-0.55 the whole way through. So each take carries its own
       UPRIGHT WINDOW and a rider is parked inside his take's, never across
       the clip at large. */
    const SIT_TAKES = [
      { name: 'Chair_Sit_Idle_M', win: [[0.00, 0.12], [0.83, 1.00]] },
      { name: 'Sit_and_Doze_Off', win: [[0.00, 1.00]] },
    ];
    const sitAt = (take, k) => {                 // k in 0..1 across the take's own upright time
      const w = take.win, span = w.reduce((n, [a, b]) => n + (b - a), 0);
      let want = k * span;
      for (const [a, b] of w) { if (want <= b - a) return a + want; want -= b - a; }
      return w[w.length - 1][1];
    };
    const ferryRiders = mkCrowd('botak', [
      { x: SEAT_X[2], z: SEAT_Z[6] }, { x: SEAT_X[0], z: SEAT_Z[5] },
      { x: SEAT_X[1], z: SEAT_Z[5] }, { x: SEAT_X[3], z: SEAT_Z[6] },
      { x: SEAT_X[0], z: SEAT_Z[7] }, { x: SEAT_X[2], z: SEAT_Z[7] },
      { x: SEAT_X[1], z: SEAT_Z[8] }, { x: SEAT_X[3], z: SEAT_Z[9] },
      { x: SEAT_X[0], z: SEAT_Z[3] }, { x: SEAT_X[1], z: SEAT_Z[2] },
    ].map((s, i) => {
      const take = SIT_TAKES[i % 2];
      return { ...s, ry: 0, clip: take.name, at: sitAt(take, hash(i, 4)) };
    }), SIT_TAKES[0].name, { parent: ferryRoot, height: 1.70, hipY: 0.60 });
    /* the file walking in under the sign — the walk take runs, and the whole
       group is carried forward by the film (jettyWalk) */
    const jettyWalkers = mkCrowd('botak', [
      { x: -0.9, z: 1.0 }, { x: 0.5, z: 2.2 }, { x: -1.6, z: 3.6 }, { x: 1.2, z: 4.4 },
      { x: -0.4, z: 5.8 }, { x: 1.7, z: 7.0 }, { x: -1.9, z: 8.2 }, { x: 0.8, z: 9.4 },
      { x: -1.1, z: 10.8 }, { x: 1.5, z: 12.2 },
    ].map(s => ({ ...s, ry: 0 })), 'Walking', { parent: jettyRoot, height: 1.70 });
    /* the ranks on the square, standing still, facing the encik */
    /* v8.0: the botak recruit has no standing idle — his file carries a walk,
       a run and two sittings, and its `restpose` is an A-pose with the arms
       held out, which is not a man standing on a parade square. So the STAND
       is a PARKED frame of his walk, and which frame is measured rather than
       picked: sampling the 1.04 s cycle sixty times, t = 0.122 puts his feet
       0.136 m apart (the closest they come) with his hands at their lowest
       (0.880 m) — a man standing with his feet together and his arms down.
       0.122 / 1.04 = 0.117 as a fraction of the clip. Every rank stands on the
       SAME frame, because men at attention are meant to match; the life comes
       from a few centidegrees of yaw, not from four rows of different strides. */
    const STAND_AT = 0.117;
    const paradeRanks = [];
    for (let r = 0; r < 4; r++) for (let i = 0; i < 7; i++)
      paradeRanks.push({ x: -6.6 + i * 2.2, z: 2.0 + r * 2.0,
                         ry: Math.PI + (hash(r * 7 + i, 9) - 0.5) * 0.06, at: STAND_AT });
    const paradeCrowd = mkCrowd('botak', paradeRanks, 'Walking', { parent: paradeRoot, height: 1.70 });
    /* v8.2 (Chad): "He should also be at the parade square in the intro
       cutscene". Until now the man facing the ranks was `fbosling` — the
       SERGEANT's model in full battle order — because `encik2` was registered
       in build.py and never loaded by anything. Chad's encik is in No. 4s with
       a green beret, which is what a man taking a parade actually wears, and
       he is TALKING here rather than standing: the take loops (no `at`), so
       the shot of the square is a man addressing a company, not a statue in
       front of one. `Talk_with_Left_Hand_on_Hip` is his, and only his — the
       sergeant talks with the other take, so the two men never share a
       gesture. */
    const paradeEncik = mkCrowd('encik2', [{ x: 0.0, z: -3.2, ry: 0 }], 'Talk_with_Left_Hand_on_Hip',
                                { parent: paradeRoot, height: 1.74 });
    let walkT = 0;
    const jettyWalk = (dt) => {                    // the file carried up the walkway
      walkT += dt;
      for (const r of jettyWalkers.rigs) { r.g.position.z += dt * 1.25; if (r.g.position.z > 16) r.g.position.z -= 17; }
    };
    const crowdTick = (dt, root) => {
      for (const c of crowds) {
        if (!c.ready || !c.group.parent || !c.group.visible) continue;
        let vis = c.group, on = true;
        while (vis) { if (!vis.visible) { on = false; break; } vis = vis.parent; }
        if (!on) continue;
        for (const r of c.rigs) if (!r.act.paused) r.mixer.update(dt);
      }
    };

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
                    ready: false, height: opts.height, tint: opts.tint || null,
                    idle: opts.idle || null };        // v7.5: each rig's own rest take
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
    /* v7.9 (Chad): "The 2 sergeants should both face the POV of the player."
       Both rigs are aimed at where the film's camera watches them from —
       AISLE_MID (1.234, 0.724), the point the yaw holds on while the
       sergeant speaks. A MODEL's facing is faceFrom(...) + PI (the v5.0
       law), which from his spot comes out at -0.018: square down the room,
       into the lens. Play sees the same thing, which is what a sergeant
       standing at the entrance should look like anyway. */
    const sergeant = mkRig('fbosling', { x: 1.3, z: -2.9, ry: -0.02, height: 1.74, idle: 'Idle_3' });   // square down the room, at the camera
    const buddy = mkRig('admintee', { x: -3.05, z: 1.15, ry: 1.2, height: 1.70, idle: 'Idle_9' });
    /* v7.5: the bunkmate is Chad's FBO without the rifle. Until now he was a
       tinted second copy of the buddy's model, and that model shipped with a
       torn arm — one broken file, two characters. This one has no talking
       take (the FBO pair carry Idle_6 and field takes), so his lines play
       over his rest; `rig.play` of a take he lacks is a no-op by design.
       v7.9 (Chad): "The other sergeant should not be looking at the notice
       board." He stood at PI, nose to the board; he faces the room now,
       aimed at the same point the sergeant is. He also moved 0.8 m along
       the wall: at x 1.75 the two of them overlapped in the film's own
       shot of the pair (rendered at 52 s), one half behind the other. */
    const bunkmate = mkRig('fbonosling', { x: 2.55, z: -3.05, ry: -0.32, height: 1.70, idle: 'Idle_6' });
    /* v8.2 (Chad): "and also in the bunk alongside with the 2 soldiers in
       FBO, and also for the fall in. He will be used regularly throughout
       this entire episode." He stands on the other side of the entrance from
       the sergeant, facing down the room — clear of the notice board (x 2.0),
       the centre table (x ±1.80 at z 2.55, the far half) and both bed rows
       (|x| 3.65 and out). His own `Idle_9` is the rest take; his talk take is
       `Talk_with_Left_Hand_on_Hip`, which no other rig in the chapter has. */
    const ENC_DOOR = { x: -1.5, z: -3.05, ry: 0.16 };
    const ENC_LINE = { x: BALC.x1 - 0.5, z: 1.2, ry: -Math.PI / 2 };   // beside the sergeant at the parapet
    const encik = mkRig('encik2', { x: ENC_DOOR.x, z: ENC_DOOR.z, ry: ENC_DOOR.ry, height: 1.72, idle: 'Idle_9' });
    const encSay = (name) => castSay(encik, name, 'Talk_with_Left_Hand_on_Hip', 'Idle_9');
    /* the figure at the corridor's end — scene A's one frame. A stand-in
       (Chad supplies the ghost); the ghost treatment is the engine's own:
       grey, transparent, no shadow. */
    const ghostFig = mkRig('ghostsoldier', { x: BLOCK.x0 + 0.45, z: 5.3, ry: Math.PI / 2, height: 1.72, idle: 'Idle_6',
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

    /* ------------------------------------------------- A MAN AT EVERY BED
       v8.1 (Chad): "there needs to be a bunkmate for every bed in the bunk."
       The room says twenty of us and had three men in it — the sergeant at
       the door, the buddy and the bunkmate — with six made beds nobody
       owned. Every bed but HIS now has a recruit standing at its foot.

       They STAND, all six, and that is a constraint rather than a
       preference: the whistle empties the bunk onto the balcony (v7.4), and
       a man parked on a seated take cannot be teleported into a rank
       without sitting in mid-air — `mkCrowd` gives a copy ONE action, so
       there is nothing to switch him to. Standing men fall in.

       Two models and two different standing poses (which kinds, and why not
       three, is the note under the table): the admin tee on its own `Idle_9`,
       and the botak — which has no standing idle at all — on `Walking` PARKED
       at t = 0.122, the frame the parade square is built on (feet closest,
       hands lowest). `mkCrowd` seeds a looping idle at its own phase per
       copy, so the three admin tees do not breathe in step. Nothing new is
       downloaded: both files are already in this chapter.

       x = ±3.25 is the foot of the bed and 0.26 m clear of the blocker
       column `solid()` puts round the mattress (±3.51), so a recruit stands
       where the player can see him without standing in the walking lane;
       `walktest` is unchanged by them, since a rig is not a blocker.
       The pair at z −3.00 and −1.50 face each other across 1.5 m — that is
       the conversation, told by where they stand rather than by a talking
       take nobody can hear. */
    const BUNK_MEN = [
      { x: -3.25, z: -3.00, ry: 0.12,             kind: 'admintee', line: -1.70, low: true },
      { x: -3.25, z: -1.50, ry: Math.PI - 0.14,   kind: 'botak',    line: -0.85, low: false },
      { x: -3.25, z:  0.00, ry: 1.35,             kind: 'botak',    line:  0.00, low: true },
      { x:  3.25, z: -2.20, ry: -1.32,            kind: 'admintee', line:  2.55, low: false },
      { x:  3.25, z:  2.20, ry: -1.78,            kind: 'admintee', line:  3.40, low: true },
      { x:  3.25, z:  3.35, ry: -2.15,            kind: 'botak',    line:  4.25, low: true },
    ].filter(m => !LOW || m.low);
    /* the two TEE models only, and that is casting rather than convenience:
       the FBO wears full battle order — helmet, vest, field pack — and six of
       him standing about a bunk at ten to ten at night reads as a deployment.
       The sergeant wears it because he is on duty and the bunkmate has worn
       it since v7.5; everyone else is in what a recruit wears in his own
       bunk. Photographed with the FBO in the mix first, which is how the
       dress problem showed up at all. */
    const BUNK_KIND = {
      admintee: { clip: 'Idle_9',  height: 1.72 },
      botak:    { clip: 'Walking', height: 1.70, at: 0.122 },
    };
    const bunkCrowds = Object.keys(BUNK_KIND).map(kind => {
      const men = BUNK_MEN.filter(m => m.kind === kind);
      if (!men.length) return null;
      const k = BUNK_KIND[kind];
      const c = mkCrowd(kind, men.map(m => ({ x: m.x, z: m.z, ry: m.ry, at: k.at })),
                        k.clip, { height: k.height });
      c.men = men;
      return c;
    }).filter(Boolean);
    /* where each of them is, on the two occasions the chapter moves them:
       at his bed, and in the rank on the balcony's yellow line */
    function bunkCrowdPlace(onLine) {
      for (const c of bunkCrowds) c.rigs.forEach((r, i) => {
        const m = c.men[i]; if (!m) return;
        if (onLine) { r.g.position.set(BALC.line - 0.2, 0, m.line); r.g.rotation.y = Math.PI / 2; }
        else { r.g.position.set(m.x, 0, m.z); r.g.rotation.y = m.ry; }
      });
    }
    const bunkCrowdShow = (on) => { for (const c of bunkCrowds) c.group.visible = on; };

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
        /* v7.2: NO blanket on a statue — measured, he lies with his knees up
           and his arms behind his head, 0.53 m off the mattress, and any box
           that covers him buries him; the two breathing rigs lie flat and
           take one */
        b.low.on.visible = false;
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

    /* THE BLANKET OVER HIS HEAD (scene D): a weave 11 cm from the lens — the
       world's near plane is 8 cm (v6.12) — on the camera itself, hidden
       until the scene pulls it up. A chapter prop, like chapter 1's note. */
    const weaveTex = makeWeave(THREE, cnv);
    const blanketCam = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 0.42),
      new THREE.MeshBasicMaterial({ map: weaveTex, color: 0x5e6e62, transparent: true, opacity: 0, fog: false, depthTest: false }));
    blanketCam.position.set(0, -0.02, -0.11);
    blanketCam.renderOrder = 990;
    blanketCam.visible = false;
    camera.add(blanketCam); owned.push(blanketCam);

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
    pileRing.position.y = BED.low + 0.022;      // v7.2: above the bedsheet, which sits 12 mm proud of the mattress
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
      /* lying IN the bed at night, the mattress is under him and out of the
         lens — the bed is still the thing he acts on (the probe found the
         decision unreachable from the pillow) */
      if ((abed() || lying()) && pileDist() < 1.3) return true;
      const n = pileScreen();
      return n.z < 1 && Math.abs(n.x) < 0.97 && Math.abs(n.y) < 0.97;
    }
    function pointerHitsPile(cx, cy) {
      if (pileDist() > INTERACT_R) return false;
      if ((abed() || lying()) && pileDist() < 1.3) return true;
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
       The chapter's clock, phase by phase (docs/V7.1-E2C1-PLAN.md §8):
       arrive → fallin → standby → free → lightsout → night → the decision.
       `kit.setPhase` is the bookmark the save keeps; `applyPhase` re-derives
       the room from it on a resume. Everything timed runs on the chapter's
       own clock, which advances only in play, so a menu, a cutscene or a
       card never lets a step fire behind the player's back. */
    let phase = 'arrive';
    let arrivedAt = 0;                 // v7.2: the moment he reached the bed; the whistle waits on it
    let booted = false;
    const dayClock = { t: 0 };
    const todo = [];
    function after(secs, fn) { todo.push({ at: dayClock.t + secs, fn }); todo.sort((a, b) => a.at - b.at); }
    function runTodo() { while (todo.length && todo[0].at <= dayClock.t) todo.shift().fn(); }
    function dropTodo() { todo.length = 0; }
    /* THE LINE THAT WOULD NOT PLAY (v8.0). Chad: "when talking to the soldiers
       or recruits, nothing happen, and i have to click many times to get their
       voicelines to play. And it is not always playing." Measured on the
       shipped v7.9 build, at the first frame of play: 46 samples decoded, and
       `b1day`, `k1board`, `k1three`, `n1shower` and `n1board` — every line a
       hotspot can ask for — decoded NONE of them. `snd()` returns null for a
       sample that has not decoded, so the FIRST press was silent by
       construction; and this function then booked `speak.until` for the whole
       length of the line it had not played, so every press for the next four
       seconds was refused as well. Press, silence; press, silence; press, and
       by then the bytes had landed. Exactly the report.

       Three changes, and the first one alone is the fix:
       - the window is booked only if the sound actually STARTED (worldSfx
         hands back the source, or null);
       - a cold press is HELD rather than dropped — the decode is already
         running, so the line fires the moment it lands (up to three seconds,
         after which the press is let go rather than arriving out of nowhere);
       - and what a line was going to make happen — a talk take, a follow-up —
         rides with it as `onStart`, so the animation and the voice cannot come
         apart when one of them waits.
       `kit.warmSounds` above makes the held path rare rather than routine. */
    /* and the decodes themselves, kicked the moment the chapter is built. The
       film's cues are warmed by the engine; the DAY's were not, which is what
       made the first press of E silent. Named rather than globbed, so a new
       line has to be added here on purpose — the same discipline as the cue
       table: a sound nobody warms is a press that waits. */
    const PLAY_LINES = ['b1day', 'b1sleep', 'dooropen2', 'k1board', 'k1three',
      'n1bedfail', 'n1bedok', 'n1board', 'n1fallin', 'n1hear', 'n1late',
      'n1lights', 'n1shower', 'n1wake', 'pushups', 's1again', 's1fallin',
      's1late', 's1lights', 's1standby', 'switchoff', 'whistle'];
    if (warmSounds) warmSounds(PLAY_LINES);

    /* v8.1: and it is CLEARED by reset(), because it is stated in the
       chapter's own clock and that clock goes back to zero on a replay.
       Chad: "replaying the chapter disables the interactions with the
       bunkmates, and sergeants, why?" — measured on the shipped v8.0
       build, sayLine('b1day') returned true before a reset and false
       after it, because `until` still held a time from the run just
       finished and the new day had to catch up to it. A real playthrough
       banks a minute or two of day, so the whole replayed chapter was
       mute. `speakReset` is what reset() calls; nothing else may write
       these two from outside. */
    const speak = { until: 0, pending: null };
    function speakReset() { speak.until = 0; speak.pending = null; }
    function sayLine(name, vol = 1, onStart) {
      if (!worldSfx) return false;
      if (dayClock.t < speak.until) return false;
      const start = () => {
        speak.until = dayClock.t + (SECS[name] || 2.5) + 0.25;
        if (onStart) onStart();
      };
      if (worldSfx(name, vol)) { start(); return true; }
      speak.pending = { name, vol, start, give: dayClock.t + 3 };
      speak.until = dayClock.t + 0.2;            // a breath, not the line's length
      return true;
    }
    /* the frame's half of the above: retry a held line until it lands */
    function runSpeak() {
      const q = speak.pending;
      if (!q || dayClock.t < speak.until) return;
      if (dayClock.t > q.give) { speak.pending = null; return; }
      if (worldSfx(q.name, q.vol)) { speak.pending = null; q.start(); }
      else speak.until = dayClock.t + 0.2;
    }
    /* the sergeant's lines ride his talk take; the buddy's and the
       bunkmate's ride theirs.
       v8.1: the bunkmate's take was `mixamo.com` and `assets/fbonosling.glb`
       HAS NO CLIP OF THAT NAME — it ships Running, Walking,
       Gesture_with_Hand_on_Gun, Gun_Hold_Left_Turn, Idle_6 and
       Rifle_Charge_inplace and nothing else. `mixamo.com` was the FOUR-
       animation admin tee's own FBX name, and it was left behind at v7.5
       when the bunkmate stopped being the admin tee and became the FBO
       without a rifle; `rig.play` of a take a rig does not have is a no-op
       by design, so from v7.5 to v8.0 he stood dead still through both of
       his lines. The FBO carries no talking take at all — its one gesture,
       `Gesture_with_Hand_on_Gun`, is a CROUCH (photographed) — so
       `Talk_with_Left_Hand_Raised` is retargeted onto him from `fbosling`,
       whose skeleton is the same 27 mixamorig bones but whose REST pose is
       up to 22 degrees away at the forearms and feet: measured, which is why
       this went through `tools/retarget.mjs` in world space and not
       `borrowclips`.
       v8.2: and the retarget is RETIRED — Chad's new FBO files carry
       `Talk_with_Left_Hand_Raised` as their OWN take, authored against their
       own rest pose, which beats any transplant (v5.20's law). Both soldiers
       name it now. `Talk_with_Left_Hand_on_Hip` survives only on the ENCIK
       model, which is why the sergeant moved OFF it here rather than keeping
       it: a rig sent to a take it does not have is a silent no-op, and that
       is the bug this very comment was written about. */
    function castSay(rig, name, take, idle) {
      return sayLine(name, 1, () => {
        rig.play(take, 1, 0.3);
        after((SECS[name] || 2.5) + 0.2, () => { if (rig.cur === take) rig.play(idle, 1, 0.4); });
      });
    }
    const TALK_NOSL = 'Talk_with_Left_Hand_Raised';   // v8.1: retargeted onto the FBO rig, see above
    const TALK_SLING = 'Talk_with_Left_Hand_Raised';  // v8.2: the sling FBO's own take
    const sgtSay = (name) => castSay(sergeant, name, TALK_SLING, 'Idle_3');
    function setPhase(p) {
      phase = p;
      if (kit) kit.setPhase(p);
    }
    /* v7.3: THE DAY IS RESUMABLE, so every award it hands out must be
       idempotent. `kitConduct` dedupes the NOTES and never the numbers, so a
       Continue in the middle of the day banked the same +4 a second time.
       Each of the day's awards carries its own note, and the note is the
       receipt: if it is already on the card, the award has been paid. */
    function bankedHas(note) {
      if (!kit || !kit.getConduct || !note) return false;
      return kit.getConduct().notes.indexOf(String(note)) >= 0;
    }
    function bank(d) {
      if (!kit || !d) return;
      if (d.note && bankedHas(d.note)) return;
      kit.conduct(d);
    }
    /* lying in bed at three in the morning, before the decision and while it
       is open — the bed is the thing he acts on in both */
    const abed = () => phase === 'night' || phase === 'decide';
    /* v7.4: and LYING DOWN AT ALL, whichever phase. Getting up needs the bed
       to be the thing you act on, and the bed is what you are lying on — it
       is under the lens and off screen, so `inView()` said no and there was
       no way to stand up again. v7.1 special-cased three in the morning and
       never the daytime, which made the bed a TRAP by day. */
    const lying = () => !!(kit && kit.getPose && kit.getPose() === 'lying');

    /* THE BEDS are the chapter's, and the night changes them: the day's room
       tone crosses to the night's, the episode's bed comes in under it,
       and the shower is a loop the block turns on. `DATA.ambience.beds` is
       what the engine reads every frame, so the chapter writes the mix
       there — a loop at 0 is never even decoded. */
    let nightK = 0, showerVol = 0;
    function mixBeds() {
      DATA.ambience.beds = [
        ['bunkday', 0.24 * (1 - nightK)], ['bunknight', 0.22 * nightK],
        ['fanloop', 0.14 - 0.04 * nightK], ['clocktick', 0.06],
        ['e2bed', 0.30 * nightK], ['showerrun', showerVol]];
    }
    mixBeds();
    const tweens = [];                       // { get, set, to, t, secs }
    function tween(get, set, to, secs) { tweens.push({ from: get(), to, t: 0, secs: Math.max(0.01, secs), set }); }
    function runTweens(dt) {
      for (let i = tweens.length - 1; i >= 0; i--) {
        const w = tweens[i]; w.t = Math.min(1, w.t + dt / w.secs);
        const k = w.t * w.t * (3 - 2 * w.t);
        w.set(w.from + (w.to - w.from) * k);
        if (w.t >= 1) tweens.splice(i, 1);
      }
    }

    const SGT_DOOR = { x: 1.3, z: -2.9, ry: -0.02 };           // by the entrance, square down the room (v7.9)
    /* v7.5: the fall-in is staged IN VIEW of the opening (z ±1.2), not
       behind the wall segment — that is why the sergeant "went missing" at
       the whistle. He stands at the parapet end facing the section; the
       recruits line up on the yellow line facing the square. */
    const SGT_LINE = { x: BALC.x1 - 0.5, z: -0.5, ry: -Math.PI / 2 };
    const LINE_X = BALC.line - 0.35;                           // past this, he is on the line
    const LIE_Y = BED.low + 0.14, LIE_YAW = -Math.PI / 2;      // his eye on the pillow, looking along the bed to the aisle
    const ITEM_GLYPH = ['Pillow', 'Bedsheet', 'Blanket', 'Boots', 'Water bottle', 'Mug', 'Toothbrush', 'Locker'];   // which glyph, whatever the sheet calls it
    const BED_ITEMS = ITEM_GLYPH.map((g, i) => ({ label: DATA.words['item' + (i + 1)] || g, icon: itemIcon(cnv, g) }));

    function putSergeant(at) {
      sergeant.group.position.set(at.x, 0, at.z);
      sergeant.group.rotation.y = at.ry;
      /* v8.2: the encik goes where the sergeant goes — to the parapet for the
         fall-in, back into the bunk after it. He is senior, so he stands
         BESIDE him rather than in the rank with the recruits. */
      const e = (at === SGT_LINE) ? ENC_LINE : ENC_DOOR;
      encik.group.position.set(e.x, 0, e.z);
      encik.group.rotation.y = e.ry;
    }

    /* ---- arrive: find bed one */
    function beginArrive() {
      setPhase('arrive');
      if (!kit) return;
      kit.objective(DATA.words.objArrive);
      kit.waypoint({ x: PILE_POS.x, y: 1.0, z: PILE_POS.z });
    }
    /* ---- fall in: the whistle, the line, the count */
    let fallTimer = null, fallLate = false;
    function beginFallIn() {
      setPhase('fallin');
      /* v7.3: on a RESUME the lateness is read back off the card rather than
         reset — the penalty is already banked, so a second run of the
         fall-in must not hand him the on-time bonus on top of it. */
      fallLate = bankedHas(DATA.words.noteLate);
      if (worldSfx) worldSfx('whistle', 0.9);
      putSergeant(SGT_LINE);
      fallOut(true);            // v7.4: everyone else is already on the line
      after(1.2, () => sgtSay('s1fallin'));
      after(4.6, () => sayLine('n1fallin'));
      if (!kit) return;
      kit.objective(fallLate ? DATA.words.objLate : DATA.words.objFallIn);
      kit.waypoint({ x: BALC.line, y: 1.0, z: 0 });
      if (fallLate) return;                       // the clock has already run out on him
      fallTimer = kit.timer(14, () => {
        fallLate = true; fallTimer = null;
        sgtSay('s1late');
        after(3.4, buddyPushUps);
        after(3.6, () => { sayLine('n1late'); if (worldSfx) worldSfx('pushups', 0.8); });
        bank({ s: -3, a: -2, note: DATA.words.noteLate });
        kit.objective(DATA.words.objLate);
        /* v7.4: AND THE FALL-IN ENDS. Before this the timer paid out its
           penalty and then the chapter went on waiting for the line for
           ever — a player who was slow (or, before the gangway, any player
           at all) was stuck with nowhere the day could go. The sergeant has
           you now: the push-ups beat plays out and the day moves on. */
        after(9.0, () => { if (phase === 'fallin') onTheLine(); });
      });
    }
    /* v7.4: the rest of the section falls in TOO. Chad, playing: "shouldnt
       you make all the bunkmates run outside to fall in too? why are they
       stuck in the bunk?" — they were, because the whistle only ever moved
       the sergeant. Neither rig carries a walk take (the file ships an idle
       and a talk and nothing else), so they are PLACED rather than walked:
       on the whistle the bunk empties behind you and the squad is already
       forming up, which is also the truth the chapter tells out loud when
       you are last. `BUNK_AT` remembers where each stood so they go back. */
    /* v8.0: AND SOMEBODY ACTUALLY DOES THEM. Chad, on v7.1: "suddenly it says
       you the last one with 20 push ups, and there is push up sounds, but im
       not actually doing anything on my screen." The sound had nothing to look
       at because no rig in the chapter carried the take; Chad's nine-animation
       admin tee does, as three of them — down, the reps, and back up. The buddy
       drops on the line beside you while the sergeant's line lands. Measured
       against the beat it has to fit inside: the take is 2.71 s down, 1.63 s a
       rep and 3.21 s up, so three reps is 10.8 s, and the fall-in ends 9.0 s
       after the penalty with the squad sent back 6.5 s after that — 15.5 s of
       room. `fallOut(false)` puts him back on his idle whatever happened, so a
       skipped phase can never leave a man face-down in the bunk. */
    function buddyPushUps() {
      if (!buddy || !buddy.play('idle_to_push_up', 1, 0.3, true)) return;
      const DOWN = 2.71, REP = 1.63, UP = 3.21, N = 3;
      after(DOWN, () => buddy.play('push_up', 1, 0.15));
      after(DOWN + REP * N, () => buddy.play('push_up_to_idle', 1, 0.2, true));
      after(DOWN + REP * N + UP, () => buddy.play('Idle_9', 1, 0.3));
    }
    const BUNK_AT = new Map();
    function fallOut(on) {
      for (const [r, at] of [[buddy, { x: BALC.line - 0.2, z: 0.85, ry: Math.PI / 2 }],
                             [bunkmate, { x: BALC.line - 0.2, z: 1.7, ry: Math.PI / 2 }]]) {
        if (!r || !r.group) continue;
        if (on) {
          if (!BUNK_AT.has(r)) BUNK_AT.set(r, { x: r.group.position.x, z: r.group.position.z, ry: r.group.rotation.y });
          r.group.position.set(at.x, 0, at.z); r.group.rotation.y = at.ry;
        } else {
          const b = BUNK_AT.get(r); if (!b) continue;
          r.group.position.set(b.x, 0, b.z); r.group.rotation.y = b.ry;
          if (r.idle) r.play(r.idle, 1, 0.25);      // v8.0: never back on his hands
        }
      }
      bunkCrowdPlace(on);          // v8.1: and so does everyone else in the room
    }
    function onTheLine() {
      if (fallTimer) { fallTimer.stop(); fallTimer = null; }
      if (!fallLate) bank({ a: 4, note: DATA.words.noteOnTime });
      beginStandby();
    }
    /* ---- the standby bed: back to the bunk, then the sequence */
    let bedTries = 0;
    function beginStandby() {
      setPhase('standby');
      after(fallLate ? 6.5 : 1.0, () => { putSergeant(SGT_DOOR); fallOut(false); });
      if (!kit) return;
      kit.objective(DATA.words.objStandby);
      kit.waypoint({ x: PILE_POS.x, y: 1.0, z: PILE_POS.z });
    }
    function runStandbyBed() {
      if (!kit) { beginFree(); return; }
      /* v7.3: a resume lands back at the bed, and the sequence's award is the
         engine's, not a note — so the receipt is checked before it re-runs.
         Standing it up again after it was already passed would pay twice. */
      if (bankedHas(DATA.words.noteBedOk)) { beginFree(); return; }
      kit.waypoint(null);
      kit.objective(DATA.words.objBed);
      sgtSay('s1standby');
      after(3.4, () => {
        kit.event({ kind: 'sequence', label: DATA.words.evBed, items: BED_ITEMS,
                    each: 1.3, accel: 0.86, minEach: 0.5,
                    award: { stat: 'awareness', lo: 0, hi: 8 } })
          .then(r => {
            if (!alive) return;
            bedTries++;
            if (r && r.ok) {
              sayLine('n1bedok');
              bank({ a: 3, note: DATA.words.noteBedOk });
              after(SECS.n1bedok + 0.6, beginFree);
            } else if (bedTries < 2 && !(r && (r.skipped || r.aborted))) {
              sgtSay('s1again');
              after(2.3, () => sayLine('n1bedfail'));
              bank({ s: -4, note: DATA.words.noteBedFail });
              after(2.3 + SECS.n1bedfail + 0.5, runStandbyBed);
            } else {
              after(0.5, beginFree);
            }
          });
      });
    }
    /* ---- free: the bunk before lights out ---------------------------------
       v8.1 (Chad): "there should be a clear timer HUD on screen to show how
       many more minutes or seconds till lights out, so player knows whats
       going on." The section always ran on a 70-second clock; it just ran it
       PRIVATELY, off `dayClock` with nothing on screen, so the lights went
       out with no warning anyone could read. It runs on `kit.timer` now —
       the same seam the fall-in has used since v7.1, which paints M:SS beside
       the objective and turns it red under ten seconds — and the timer is
       what ENDS the phase, so what the player reads is what the chapter
       obeys rather than a second clock beside it. The warning is the last
       25 seconds. Going to bed early still cuts it short (`beginLightsOut`
       clears it), and `applyPhase('free')` restarts it, so a Continue in the
       middle of the evening comes back with a countdown rather than none. */
    const FREE_SECS = 70, FREE_WARN = 25;
    let freeWarned = false, freeTimer = null;
    function beginFree() {
      setPhase('free');
      freeWarned = false;
      if (!kit) return;
      kit.objective(DATA.words.objFree);
      kit.waypoint(null);
      freeTimer = kit.timer(FREE_SECS, () => { freeTimer = null; beginLightsOut(); });
    }
    /* ---- lights out: the switch, the sky, the beds, and to bed */
    function beginLightsOut() {
      setPhase('lightsout');
      if (freeTimer) { freeTimer.stop(); freeTimer = null; }   // v8.1: to bed early stops the countdown
      dropTodo();
      if (kit) { kit.objective(DATA.words.objLights); kit.waypoint(null); }
      sgtSay('s1lights');
      after(2.6, () => { if (worldSfx) worldSfx('switchoff', 0.9); });
      after(2.7, () => {
        tween(() => lightK, v => setLights(v), 0, 0.7);
        tween(() => nightK, v => { nightK = v; mixBeds(); }, 1, 3.0);   // v7.5: the glass is already night
        if (kit) kit.daylight(NIGHT, 3.0);
        clockGlow.intensity = CLOCK_GLOW; balcLight.intensity = 5;
      });
      after(3.8, () => sayLine('n1lights'));
      after(7.0, () => sayLine('b1sleep'));
      after(9.6, () => { if (kit) kit.fade(1, 1.6); });
      after(11.4, () => {
        // in the dark: to bed, the day cast gone, the sleepers in, three in the morning
        yaw.position.x = HIS.x + 0.35; yaw.position.z = HIS.z; yaw.rotation.y = LIE_YAW;
        if (kit) kit.pose('lying', { y: LIE_Y, yaw: LIE_YAW, span: 1.2, secs: 0.05 });
        setNightRoom(true);
        clock.set('03:00');
        setPhase('night');
      });
      after(14.6, () => beginNight());
    }
    /* ---- 03:00 */
    function beginNight() {
      setPhase('night');
      if (kit) { kit.fade(0, 2.2); kit.objective(null); }
      after(2.6, () => sayLine('n1wake'));
      after(6.6, () => {
        setShower(true);
        tween(() => showerVol, v => { showerVol = v; mixBeds(); }, 0.55, 1.6);
      });
      after(8.2, () => sayLine('n1hear'));
      after(8.2, () => { if (kit) kit.presence(0.35); });
      after(8.2 + SECS.n1hear + 0.6, runFear);
    }
    /* the fear itself, on its own so a RESUME at three in the morning can run
       it too. Before v7.3 a Continue into the night restored the room and
       nothing else: no objective, no challenge, and a player lying in the
       dark with no idea what the game wanted. `decide` is the bookmark for
       after it, so the heartbeat's sanity award can never be paid twice. */
    function runFear() {
      if (!kit) { startDecision(); return; }
      kit.objective(DATA.words.objFear);
      kit.event({ kind: 'heartbeat', label: DATA.words.evFear, n: 5, bpm: 72, win: 0.19,
                  award: { stat: 'sanity', lo: -8, hi: 2 } })
        .then(r => {
          if (!alive) return;
          kit.objective(null); setPhase('decide');
          after(0.4, () => { if (getState() === 'play') startDecision(); });
        });
    }
    /* ---- a resume lands in the right part of the day */
    function applyPhase(p) {
      /* v7.3: THE WHOLE DAY, not three of its phases. Everything that fell
         through to `beginArrive()` used to restart the morning — the walk to
         the bed, the whistle, the fall-in and the standby bed all over
         again, every award banked a second time. Each phase now resumes
         where it stood; the awards are idempotent above, so the parts that
         DO re-run (the fall-in call, an unfinished bed) cost nothing. */
      if (p === 'fallin') { beginFallIn(); return; }
      if (p === 'standby' || p === 'standbybed') { beginStandby(); return; }
      if (p === 'free') { beginFree(); return; }
      if (p === 'lightsout' || p === 'night' || p === 'decide') {
        nightK = 1; showerVol = 0.55; mixBeds();
        setLights(0); setNightRoom(true); setShower(true); clock.set('03:00');
        clockGlow.intensity = CLOCK_GLOW; balcLight.intensity = 5;
        if (kit) {
          kit.daylight(NIGHT, 0);
          yaw.position.x = HIS.x + 0.35; yaw.position.z = HIS.z; yaw.rotation.y = LIE_YAW;
          kit.pose('lying', { y: LIE_Y, yaw: LIE_YAW, span: 1.2, secs: 0.05 });
          kit.presence(0.35); kit.objective(null); kit.waypoint(null);
        }
        setPhase('night');
        /* he wakes into the fear he went to sleep in — unless the decision
           was already open when the run was saved, in which case the bed is
           simply his to act on again */
        if (p === 'decide') setPhase('decide');
        else after(1.4, () => { if (phase === 'night') runFear(); });
        return;
      }
      beginArrive();
    }

    function interactPile() {
      if (getState() !== 'play' || pileDist() >= INTERACT_R) return false;
      if (abed()) { startDecision(); return true; }
      if (phase === 'standby') { runStandbyBed(); setPhase('standbybed'); return true; }
      if (phase === 'free' && kit && kit.getPose() !== 'lying' && seen.size >= 2) { beginLightsOut(); return true; }
      if (!kit) return false;
      if (kit.getPose() === 'lying') kit.pose('standing');
      else kit.pose('lying', { y: LIE_Y, yaw: LIE_YAW, span: 1.2 });
      return true;
    }
    if (kit) {
      kit.objective(DATA.words.objArrive);
      kit.waypoint({ x: PILE_POS.x, y: 1.0, z: PILE_POS.z });
      kit.setPhase('arrive');
    }

    /* --------------------------------------------------------- hotspots */
    const seen = new Set();
    /* v7.5: THE DOORS. Chad, from inside the block: "im suddenly stuck there
       with no way to get out ... make the door interactable with E or tap so
       that the player can be moved outside or into a different area". The
       block was never sealed (measured: every cell of it reachable) — the
       leaf hung across the opening and nothing could be touched, so it READ
       as a wall. The door is a hotspot now: it swings fully open with its
       sound and steps you through to the other side, from either side. The
       entrance is a hotspot too, so the corridor answers when asked. */
    function useDoor() {
      if (worldSfx) worldSfx('dooropen2', 0.8);
      tween(() => doorPivot.rotation.y, v => { doorPivot.rotation.y = v; }, DOOR_OPEN, 0.45);
      const inBlock = yaw.position.z > R.z;
      yaw.position.x = DOOR_WC.x;
      yaw.position.z = inBlock ? R.z - 0.95 : R.z + 0.95;
      return true;
    }
    const hotspots = [
      /* the anchors sit at EYE height: a hotspot must be on screen to be offered, and a
         doorway's floor point is 44° under the lens from a metre away — outside the view */
      { id: 'wcdoor', pos: { x: DOOR_WC.x, y: 1.5, z: R.z }, radius: 2.3, prompt: DATA.words.hotDoor,
        enabled: () => phase !== 'lightsout' && !lying(),
        onInteract() { return useDoor(); } },
      { id: 'out', pos: { x: DOOR_IN.x, y: 1.5, z: -R.z + 0.35 }, radius: 1.6, prompt: DATA.words.hotOut,
        enabled: () => phase !== 'lightsout' && !lying(),
        onInteract() { return false; } },
      { id: 'shower', pos: { x: DOOR_WC.x + 0.4, y: 1.0, z: R.z + 2.2 }, radius: 1.8, prompt: DATA.words.hotShower,
        enabled: () => phase === 'free',
        onInteract() { seen.add('shower'); return sayLine('n1shower'); } },
      /* v8.0: every one of these went through `castSay`-shaped code that
         started the talk take BEFORE knowing whether the line would play, and
         hung its tail on `setTimeout` rather than the day clock. The take now
         rides the line's own `onStart`, so a held line brings its animation
         with it and a refused one moves nothing. */
      { id: 'buddy', pos: { x: -3.05, y: 1.3, z: 1.15 }, radius: 2.2, prompt: DATA.words.hotBuddy,
        enabled: () => phase === 'free' && buddy.group.visible,
        onInteract() {
          seen.add('buddy');
          return castSay(buddy, 'b1day', 'Talk_with_Hands_Open', 'Idle_9');
        } },
      { id: 'board', pos: { x: 2.0, y: 1.5, z: -R.z + 0.3 }, radius: 2.2, prompt: DATA.words.hotBoard,
        enabled: () => phase === 'free',
        onInteract() {
          seen.add('board');
          return sayLine('k1board', 1, () => {
            bunkmate.play(TALK_NOSL, 1, 0.3);
            after((SECS.k1board || 2.5) + 0.2, () => { if (bunkmate.cur === TALK_NOSL) bunkmate.play('Idle_6', 1, 0.4); });
            after((SECS.k1board || 2.5) + 0.4, () => sayLine('n1board'));
          });
        } },
      { id: 'bunkmate', pos: { x: 1.75, y: 1.3, z: -3.15 }, radius: 2.0, prompt: DATA.words.hotBunkmate,
        enabled: () => phase === 'free' && bunkmate.group.visible && seen.has('board'),
        onInteract() {
          seen.add('bunkmate');
          return castSay(bunkmate, 'k1three', TALK_NOSL, 'Idle_6');
        } }
    ];

    /* ------------------------------------------------------ per frame --- */
    const _v = new THREE.Vector3();
    function updatePile(t) {
      if (getState() === 'cine') { pileRing.visible = false; return; }
      const near = THREE.MathUtils.clamp((6 - pileDist()) / (6 - INTERACT_R), 0, 1);
      pileRing.visible = near > 0.01 && phase !== 'lightsout';
      pileRing.material.opacity = near * (0.62 + 0.38 * Math.sin(t * 2.6)) * (abed() ? 0.7 : 0.45);
    }
    /* the day's watchers, on the chapter's own clock */
    let dayLast = 0;
    function updateDay() {
      if (getState() !== 'play') { dayLast = 0; return; }
      if (!booted) { booted = true; applyPhase(kit ? kit.getPhase() : null); }
      /* WALL time, not the frame's dt: the engine clamps dt to 0.05 s, so on a
         box drawing one frame a second a chapter clock on dt would run at a
         twentieth of real time (the probe found it: 3.4 s of day took 68 s).
         Capped at half a second a frame so a stalled tab never skips a beat. */
      const now = performance.now() / 1000;
      const d = dayLast ? Math.min(0.5, now - dayLast) : 0;
      dayLast = now;
      dayClock.t += d;
      runTodo();
      runTweens(d);
      runSpeak();                 // v8.0: a held line, the moment its bytes land
      /* v7.2: reaching the bed used to fire the whistle on the same frame as
         his "That's mine. Bed one." — the line lands first now, then the
         whistle, then the sergeant */
      if (phase === 'arrive' && pileDist() < 1.8 && !arrivedAt) { arrivedAt = dayClock.t; after(2.6, () => { if (phase === 'arrive') beginFallIn(); }); }
      else if (phase === 'fallin' && yaw.position.x > LINE_X) onTheLine();
      else if (phase === 'standby' && pileDist() < 2.0) { setPhase('standbybed'); runStandbyBed(); }
      else if (phase === 'free' && freeTimer && !freeWarned && freeTimer.left() <= FREE_WARN) {
        freeWarned = true;
        if (kit) { kit.objective(DATA.words.objWarn); kit.waypoint({ x: PILE_POS.x, y: 1.0, z: PILE_POS.z }); }
      }
    }
    function updateNotes(dt, t) {
      updateDay();
      /* the CLOCKS run in every state (v5.19): a cutscene owns the poses,
         never the mixers */
      for (const r of [sergeant, buddy, bunkmate, encik, ghostFig]) if (r.mixer && r.group.visible) r.mixer.update(dt);
      for (const r of sleepRigs) if (r.mixer && sleeperRoot.visible) r.mixer.update(dt);
      for (const f of fans) f.rotation.y += dt * 7.5 * fanSpeed;
      if (showerOn) {
        streakTex.offset.y -= dt * 1.6;
        const a = waterGeo.attributes.position.array;
        for (let i = 0; i < WATER_N; i++) {
          a[i * 3 + 1] -= dt * (2.6 + (i % 5) * 0.3);
          if (a[i * 3 + 1] < 0.02) a[i * 3 + 1] = 2.1;
        }
        waterGeo.attributes.position.needsUpdate = true;
      }
      if (ferryRoot.visible) ferryTick(dt);
      if (jettyRoot.visible) jettyWalk(dt);
      crowdTick(dt);
      if (getState() === 'cine') return;
    }
    function updateFire(t) {
      // a fluorescent tube's faint flicker, the room's only "fire"
      if (getState() !== 'cine' && lightK > 0.02) {
        const fl = 1 - (Math.random() < 0.02 ? 0.08 : 0);
        for (const L of tubeLights) L.intensity = TUBE_I * lightK * fl;
      }
      /* v7.2: the block's tube at night — a slow breathing dip and, now
         and then, a stutter that nearly goes out; runs in every state (a
         scene in the block wants it) on the base the snapshot keeps */
      if (blockFlicker) {
        flickT = flickT > 0 ? flickT - 1 : (Math.random() < 0.012 ? 2 + Math.floor(Math.random() * 4) : 0);
        const breathe = 0.92 + 0.08 * Math.sin(t * 1.7) * Math.sin(t * 0.43);
        const k = breathe * (flickT > 0 ? 0.35 + Math.random() * 0.3 : 1);
        blockLight.intensity = blockBase * k;
        blockTube.material.emissiveIntensity = 1.6 * (0.55 + 0.45 * k);
      }
    }
    function updateSlow(sdt, t) {}

    /* ------------------------------------------------------ the switches */
    function setNightRoom(on) {
      // the day cast leaves, the sleepers arrive, the tubes go dark
      sergeant.group.visible = !on;
      buddy.group.visible = !on;
      bunkmate.group.visible = !on;
      encik.group.visible = !on;       // v8.2
      bunkCrowdShow(!on);              // v8.1: the six at their beds go with the rest of the day cast
      sleeperRoot.visible = on;
      for (const b of beds) { b.low.fold.visible = !on || b.his || !sleepers.find(s => s.bed === b); }
      setLights(on ? 0 : 1);
      clockGlow.intensity = CLOCK_GLOW;          // v7.5: the clock's red is on all evening
      balcLight.intensity = on ? 6 : 5;          // and so is the balcony's sodium lamp
      nightLight.intensity = on ? 1.8 : 0;
      /* v7.2: 1.6 at night (3.2 blew the tiles to white), and the tube
         FLICKERS from here — a dying fluorescent is the block's own unease */
      blockBase = on ? 1.6 : (LOW ? 12 : 8);
      blockLight.intensity = blockBase;
      blockFlicker = on;
      setWindows(1);
      clock.set(on ? '03:00' : '21:58');
    }

    /* --------------------------------------------- snap / restore / reset */
    function snap() {
      return { door: doorPivot.rotation.y, fan: fanSpeed, lightK, shower: showerOn, showerVol, nightK,
               night: sleeperRoot.visible, ghost: ghostFig.group.visible,
               clockGlow: clockGlow.intensity, balc: balcLight.intensity,
               water: water.material.opacity, blanketHis: hisBed.low.on.visible,
               nightL: nightLight.intensity, blockL: blockLight.intensity, showerL: showerLight.intensity,
               blanketCam: blanketCam.visible, sleepRot: sleepers.map(o => [o.obj.rotation.x, o.obj.rotation.y, o.obj.rotation.z]),
               winK, blockBase, blockFlicker, nbL: nbLight.intensity };
    }
    function restore(s) {
      doorPivot.rotation.y = s.door; fanSpeed = s.fan; setLights(s.lightK); setShower(s.shower);
      showerVol = s.showerVol; nightK = s.nightK; mixBeds();
      sleeperRoot.visible = s.night; ghostFig.group.visible = s.ghost;
      clockGlow.intensity = s.clockGlow; balcLight.intensity = s.balc;
      water.material.opacity = s.water; hisBed.low.on.visible = s.blanketHis;
      blanketCam.visible = s.blanketCam; blanketCam.material.opacity = 0;
      nightLight.intensity = s.nightL; blockLight.intensity = s.blockL; showerLight.intensity = s.showerL;
      if (s.winK !== undefined) setWindows(s.winK);
      nbLight.intensity = s.nbL || 0;
      if (s.blockBase !== undefined) { blockBase = s.blockBase; blockFlicker = !!s.blockFlicker; blockLight.intensity = blockBase; blockTube.material.emissiveIntensity = 1.6; }
      if (s.sleepRot) sleepers.forEach((o, i) => { const r = s.sleepRot[i]; if (r) o.obj.rotation.set(r[0], r[1], r[2]); });
      sergeant.group.visible = buddy.group.visible = bunkmate.group.visible = !s.night;
      encik.group.visible = !s.night;  // v8.2
      bunkCrowdShow(!s.night);         // v8.1
      for (const r of [sergeant, buddy, bunkmate, encik]) if (r.acts && r.idle) r.play(r.idle, 1, 0);
    }
    function reset() {
      ferryRoot.visible = jettyRoot.visible = paradeRoot.visible = false;   // v7.9: the film's three sets, in case a film was cut before its own step hid them
      doorPivot.rotation.y = DOOR_AJAR; fanSpeed = 1; setShower(false);
      ghostFig.group.visible = false; water.material.opacity = 0.55; hisBed.low.on.visible = false;
      setNightRoom(false);                       // v7.5: leaves the evening lamps lit
      putSergeant(SGT_DOOR);
      dropTodo(); tweens.length = 0;
      nightK = 0; showerVol = 0; mixBeds();
      seen.clear(); bedTries = 0; fallLate = false; fallTimer = null; arrivedAt = 0;
      booted = false; dayClock.t = 0;
      speakReset();                    // v8.1: the mute window is in the clock that just went back to zero
      freeWarned = false; freeTimer = null;    // and the evening's countdown belongs to the run that just ended
      if (kit) { kit.daylight(null, 0); kit.presence(0); kit.fade(0, 0.05); }
      beginArrive();
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
      for (const t of tables) solid(t);        // v7.9: the centre table, clear of the gangway and the door
      return out;
    }

    /* ------------------------------------------------------------ teardown */
    function dispose() {
      alive = false;
      treeStand.userData.disposeTrees?.();      // BEFORE the sweep: the kit's maps are shared (v6.15)
      jettyTrees.userData.disposeTrees?.();
      paradeTrees.userData.disposeTrees?.();
      for (const t of filmTex) t.dispose?.();
      const geos = new Set(), mats = new Set();
      world.traverse(o => {
        if (o.geometry) geos.add(o.geometry);
        if (o.material) for (const m of (Array.isArray(o.material) ? o.material : [o.material])) mats.add(m);
      });
      scene.remove(world);
      for (const o of owned) { o.parent?.remove(o); o.dispose?.(); }
      owned.length = 0;
      for (const r of [sergeant, buddy, bunkmate, encik, ghostFig]) r.mixer?.stopAllAction();
      for (const r of sleepRigs) r.mixer?.stopAllAction();
      for (const g of geos) g.dispose();
      for (const m of mats) {
        for (const k of ['map', 'roughnessMap', 'normalMap', 'emissiveMap', 'alphaMap']) m[k]?.dispose?.();
        m.dispose();
      }
      for (const t of [cTex.map, cTex.rough, grassTex.map, grassTex.rough, wallMap, noteTex, dotTex,
                       tileTex, tarmacTex, boardTex, clock.tex, winView, terrazzoTex, weaveTex, streakTex, meshTex]) t?.dispose?.();
      world.clear();
      S = null;
    }

    const readyAt = performance.now();
    return (S = {
      world, noteTex, blockers: blockers(),
      // the film shows the sergeant and the buddy — and, since v7.9, opens on a
      // cabin full of seated recruits: wait for them, but never past twelve seconds
      ready: () => (sergeant.ready && buddy.ready && ferryRiders.ready) || performance.now() - readyAt > 12000,
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
      water, setShower, setLights, setNightRoom, setWindows, blockLight, clockGlow, CLOCK_GLOW, balcLight, nbLight, blanketCam,
      ferryRoot, jettyRoot, paradeRoot, paradeEncik, paradeCrowd, FERRY, JETTY, PARADE, PLAYER_SEAT, CAB, SEAT_X, SEAT_Z,
      sergeant, buddy, bunkmate, encik, encSay, ghostFig, sleepers, sleepRigs, sleeperRoot,
      sayLine, seen, after, dayClock,
      bunkCrowds, bunkReady: () => bunkCrowds.every(c => c.ready),   // v8.1, for the probes
      get phase() { return phase; },
      setPhase, applyPhase, beginFallIn, beginStandby, runStandbyBed, beginFree, beginLightsOut, beginNight,
      LIE_Y, LIE_YAW, LINE_X, BED_ITEMS,
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
  /* a 64 px glyph for the standby-bed sequence: a shape per item, the
     initial over it, drawn in code (no download, no sheet) */
  function itemIcon(cnv, label) {
    const s = 64, [c, ctx] = cnv(s);
    ctx.clearRect(0, 0, s, s);
    ctx.fillStyle = '#e8e2d2';
    const shapes = {
      Pillow: () => { ctx.beginPath(); ctx.roundRect(8, 20, 48, 26, 12); ctx.fill(); },
      Bedsheet: () => { ctx.fillRect(8, 16, 48, 34); ctx.fillStyle = '#3a5a48'; ctx.fillRect(8, 16, 48, 6); },
      Blanket: () => { ctx.fillStyle = '#3a5a48'; ctx.fillRect(10, 22, 44, 12); ctx.fillRect(10, 36, 44, 12); },
      Boots: () => { ctx.fillStyle = '#2a2622'; ctx.fillRect(14, 12, 14, 40); ctx.fillRect(14, 40, 36, 12); },
      'Water bottle': () => { ctx.fillStyle = '#4c7a55'; ctx.fillRect(24, 14, 16, 40); ctx.fillRect(27, 8, 10, 8); },
      Mug: () => { ctx.fillRect(16, 20, 30, 30); ctx.beginPath(); ctx.arc(48, 35, 8, -1.2, 1.2); ctx.lineWidth = 5; ctx.strokeStyle = '#e8e2d2'; ctx.stroke(); },
      Toothbrush: () => { ctx.fillRect(12, 28, 40, 8); ctx.fillStyle = '#c33'; ctx.fillRect(44, 22, 10, 14); },
      Locker: () => { ctx.fillStyle = '#8a8f8a'; ctx.fillRect(18, 8, 28, 48); ctx.fillStyle = '#2a2d2a'; ctx.fillRect(31, 8, 2, 48); }
    };
    (shapes[label] || (() => { ctx.beginPath(); ctx.arc(32, 32, 20, 0, 7); ctx.fill(); }))();
    return c;
  }
  function makeStreaks(THREE, cnv) {
    const s = 128, [c, ctx] = cnv(s);
    ctx.clearRect(0, 0, s, s);
    for (let i = 0; i < 26; i++) {
      const x = (i * 37) % s, len = 24 + (i * 53) % 60, y0 = (i * 71) % s;
      const g = ctx.createLinearGradient(0, y0, 0, y0 + len);
      g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(0.5, 'rgba(255,255,255,0.85)'); g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = g; ctx.fillRect(x, y0, 2, len);
      if (y0 + len > s) ctx.fillRect(x, y0 - s, 2, len);     // wraps, so the scroll is seamless
    }
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.repeat.set(1, 3);
    return tex;
  }
  /* v7.2: the wire mesh under a top bunk — a diamond lattice, transparent
     between the wires, so the mattress above shows through it */
  function makeMesh(THREE, cnv) {
    const s = 64, [c, ctx] = cnv(s);
    ctx.clearRect(0, 0, s, s);
    ctx.strokeStyle = 'rgba(210,214,220,1)'; ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, s / 2); ctx.lineTo(s / 2, 0); ctx.lineTo(s, s / 2); ctx.lineTo(s / 2, s); ctx.closePath();
    ctx.moveTo(0, 0); ctx.lineTo(0, s / 2); ctx.moveTo(s, 0); ctx.lineTo(s, s / 2);
    ctx.stroke();
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.repeat.set(16, 8);
    return tex;
  }
  function makeWeave(THREE, cnv) {
    const s = 128, [c, ctx] = cnv(s);
    ctx.fillStyle = '#2a3a30'; ctx.fillRect(0, 0, s, s);
    for (let i = 0; i < s; i += 4) {
      ctx.fillStyle = (i / 4) % 2 ? '#3d5044' : '#1a2620';
      ctx.fillRect(i, 0, 2, s); ctx.fillRect(0, i, s, 2);
    }
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.repeat.set(6, 4);
    return tex;
  }
  /* v7.9: what is outside the bunk's windows in Chad's photograph — an
     overcast Tekong sky, a tree line, and a far block behind it. Painted
     into the pane because the wall is one box and cutting an opening in it
     would move the blockers the whole chapter is walked against. */
  function makeWinView(THREE, cnv) {
    const w = 256;
    const [c, ctx] = cnv(w);
    c.width = w; c.height = w;
    const sky = ctx.createLinearGradient(0, 0, 0, w);
    sky.addColorStop(0, '#cfe0ea'); sky.addColorStop(0.55, '#e6eef2'); sky.addColorStop(1, '#dfe6e2');
    ctx.fillStyle = sky; ctx.fillRect(0, 0, w, w);
    // a far block, low and pale
    ctx.fillStyle = 'rgba(196,198,188,0.75)';
    ctx.fillRect(24, 128, 104, 60);
    ctx.fillStyle = 'rgba(168,170,162,0.55)';
    for (let r = 0; r < 4; r++) for (let k = 0; k < 6; k++) ctx.fillRect(32 + k * 16, 136 + r * 14, 9, 8);
    // the tree line
    const puff = (x, y, r, g0, g1) => {
      const gr = ctx.createRadialGradient(x, y, 1, x, y, r);
      gr.addColorStop(0, g0); gr.addColorStop(1, g1);
      ctx.fillStyle = gr;
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
    };
    for (let i = 0; i < 26; i++) {
      const x = (i * 47 % 280) - 12, y = 176 + ((i * 31) % 26), r = 26 + ((i * 17) % 22);
      puff(x, y, r, 'rgba(86,118,68,0.96)', 'rgba(70,100,58,0.10)');
    }
    for (let i = 0; i < 18; i++) {
      const x = (i * 71 % 290) - 14, y = 204 + ((i * 23) % 22), r = 30 + ((i * 13) % 18);
      puff(x, y, r, 'rgba(64,94,54,0.98)', 'rgba(52,80,46,0.12)');
    }
    ctx.fillStyle = '#4e6c46'; ctx.fillRect(0, 232, w, w - 232);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }
  /* v7.9 (Chad): "the clock, change it to an analog one, not digital." The
     dial is drawn at 256 square — a white face in a dark rim, twelve marks
     with the quarters heavier, the twelve numerals, black hour and minute
     hands and a thin red second hand. `set` keeps taking 'HH:MM', so every
     call site (build, lights-out, 03:00, the restore) is untouched; the
     string is parsed into hand angles instead of printed. */
  function makeClock(THREE, cnv) {
    const w = 256;
    const [c, ctx] = cnv(w);
    c.width = w; c.height = w;
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    const R = w / 2, cx = R, cy = R;
    const hand = (ang, len, wid, col, back) => {
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(ang);
      ctx.strokeStyle = col; ctx.lineWidth = wid; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(0, back || 0); ctx.lineTo(0, -len); ctx.stroke();
      ctx.restore();
    };
    const set = (text) => {
      const m = /^(\d{1,2}):(\d{2})$/.exec(String(text || '')) || [0, 0, 0];
      const hh = (+m[1] || 0) % 12, mm = +m[2] || 0;
      ctx.clearRect(0, 0, w, w);
      // the case, then the face
      ctx.fillStyle = '#20242a';
      ctx.beginPath(); ctx.arc(cx, cy, R - 3, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#f2efe6';
      ctx.beginPath(); ctx.arc(cx, cy, R - 14, 0, Math.PI * 2); ctx.fill();
      // the marks
      for (let i = 0; i < 60; i++) {
        const a = i / 60 * Math.PI * 2, big = i % 5 === 0;
        const r0 = R - 22, r1 = r0 - (big ? 16 : 7);
        ctx.strokeStyle = big ? '#1b1f24' : '#8b8f95';
        ctx.lineWidth = big ? 5 : 2;
        ctx.beginPath();
        ctx.moveTo(cx + Math.sin(a) * r0, cy - Math.cos(a) * r0);
        ctx.lineTo(cx + Math.sin(a) * r1, cy - Math.cos(a) * r1);
        ctx.stroke();
      }
      // the numerals
      ctx.fillStyle = '#1b1f24'; ctx.font = 'bold 26px sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      for (let n = 1; n <= 12; n++) {
        const a = n / 12 * Math.PI * 2, r = R - 52;
        ctx.fillText(String(n), cx + Math.sin(a) * r, cy - Math.cos(a) * r + 1);
      }
      // the hands
      const aM = mm / 60 * Math.PI * 2;
      const aH = (hh + mm / 60) / 12 * Math.PI * 2;
      hand(aH, R - 92, 11, '#1b1f24', 16);
      hand(aM, R - 40, 8, '#1b1f24', 20);
      hand(Math.PI * 1.2, R - 34, 3, '#c0392b', 24);            // the second hand, parked
      ctx.fillStyle = '#1b1f24';
      ctx.beginPath(); ctx.arc(cx, cy, 8, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#c0392b';
      ctx.beginPath(); ctx.arc(cx, cy, 4, 0, Math.PI * 2); ctx.fill();
      tex.needsUpdate = true;
    };
    return { tex, set };
  }

  /* ------------------------------------------------------------ THE FILM
     Sixty seconds, docs/V7.1-E2C1-PLAN.md §9. It begins on BLACK and stays
     there for fourteen seconds of sound — the ferry, the gates, the boots —
     under his first two lines; lifts on the balcony over the square; comes
     in through the opening to the sergeant with the clipboard; tracks down
     the aisle to bed one as he names it; pans onto the toilet door and the
     clock; and at the switch the tubes die, the fans keep turning, and the
     camera settles at his pillow looking up at the bunk above. His fourth
     line, then black, then the card. Every yaw is faceFrom'd at a named
     thing (the v4.6 law). The film's theme is `e2film`; the day's beds
     are held down under it and come up with the room. */
  function intro(c, s, api) {
    const { tr, step, sfx, fade, camTo, yawTo, pitchTo, faceFrom, rawK, smoothK,
            duck, stage, armR, kit } = api;
    const EYE = 1.62;
    const BAL = { x: stage.BALC.line - 0.3, y: EYE, z: 0.4 };            // at the parapet's line
    const OPENING = { x: stage.R.x - 0.6, y: EYE, z: 0.0 };              // just inside the opening
    const AISLE = { x: 2.4, y: EYE, z: 0.4 };                            // where the sergeant is seen from
    const AISLE2 = { x: 0.6, y: EYE, z: 0.9 };
    const BYBED = { x: -2.3, y: 1.22, z: 2.2 };                          // bed one from the aisle, low
    const PILLOW = { x: stage.hisBed.x + 0.1, y: stage.BED.low + 0.34, z: stage.hisBed.z };   // his pillow end, but clear of the bunk's shadow
    const SGT = { x: stage.sergeant.group.position.x, z: stage.sergeant.group.position.z };
    const BEDAT = { x: stage.hisBed.x, z: stage.hisBed.z };
    const DOORAT = { x: stage.DOOR_WC.x, z: stage.R.z };

    const Y_SQUARE = faceFrom(BAL.x, BAL.z, 30, 0);
    const Y_IN = faceFrom(OPENING.x, OPENING.z, 0, 0);
    const Y_SGT = faceFrom(AISLE.x, AISLE.z, SGT.x, SGT.z);
    const Y_SGT2 = faceFrom(AISLE2.x, AISLE2.z, SGT.x, SGT.z);
    /* v7.2: where the camera IS at 27.6 (0.6 of the 24–30 glide, smoothed) —
       the yaw holds on the sergeant from there until his line ends; turning
       toward the bed from 27.0 had him at the phone crop's left edge mid-word */
    const MIDK = 0.648, AISLE_MID = { x: AISLE.x + (AISLE2.x - AISLE.x) * MIDK, z: AISLE.z + (AISLE2.z - AISLE.z) * MIDK };
    const Y_SGT_MID = faceFrom(AISLE_MID.x, AISLE_MID.z, SGT.x, SGT.z);
    const Y_BED = faceFrom(BYBED.x, BYBED.z, BEDAT.x, BEDAT.z);
    const Y_DOOR = faceFrom(BYBED.x, BYBED.z, DOORAT.x, DOORAT.z);
    const Y_UP = faceFrom(PILLOW.x, PILLOW.z, 0, 2.4);                   // toward the room's middle fan

    step(0, () => {
      armR.visible = false;
      stage.doorPivot.rotation.y = stage.DOOR_AJAR;
      stage.setLights(1);
      duck('bunkday', 0); duck('fanloop', 0); duck('clocktick', 0);
      stage.clock.set('21:58');
      /* v7.5: the film OPENS in the morning of the ferry and ENDS on the
         evening play begins in; the chapter's declaration is that evening,
         so the morning is the film's own and is put on here */
      if (kit) kit.daylight(MORNING, 0);
      stage.setWindows(0);
      stage.clockGlow.intensity = 0; stage.balcLight.intensity = 0;
      stage.ferryRoot.visible = true;
    });
    // the film's own music, under everything
    sfx(0.0, 'e2film', 1);

    /* ===================== 0–20.6 INSIDE THE FERRY (v7.9) =================
       Chad, on v7.7: "it should show first person pov within inside the
       ferry itself ... seated inside the ferry at one of the seats, while
       looking at other recruits seating at other seats ... The camera moves
       around to look at other recruits, then looks towards the side windows
       out into the sea in a contemplative way." He has a window seat on the
       starboard side; the cabin's rows run ahead of him. The film's own fade
       lifts at 0.3 (cinetest asks that a film open on black and be SEEN by
       five). His long first line is 17.79 s and runs 1.6 → 19.4. */
    const SEAT = { x: stage.FERRY.x + stage.PLAYER_SEAT.x, y: stage.FERRY.y + 1.30, z: stage.FERRY.z + stage.PLAYER_SEAT.z };
    const Y_FWD = faceFrom(SEAT.x, SEAT.z, SEAT.x, SEAT.z + 30);          // up the aisle, over the seat backs
    const Y_WIN = faceFrom(SEAT.x, SEAT.z, SEAT.x + 30, SEAT.z + 7);      // out of the window, a little forward
    step(0, () => { stage.ferryRoot.visible = true; });
    camTo(0, 9.0, { x: SEAT.x, y: SEAT.y, z: SEAT.z }, { x: SEAT.x - 0.07, y: SEAT.y, z: SEAT.z + 0.12 }, smoothK);
    yawTo(0, 4.6, Y_FWD - 0.44, Y_FWD + 0.34, smoothK);                   // across the aisle, over the others
    pitchTo(0, 4.6, 0.02, -0.03, smoothK);
    yawTo(4.6, 9.0, Y_FWD + 0.34, Y_FWD - 0.12, smoothK);
    fade(0.0, 0.3, 1, 1);                     // the black the film opens on is ITS OWN (a seek back before 0.3 lands on it)
    fade(0.3, 2.0, 1, 0);
    /* and then away from them, out of the window, and held there */
    yawTo(9.0, 13.0, Y_FWD - 0.12, Y_WIN, smoothK);
    pitchTo(9.0, 13.0, -0.03, 0.00, smoothK);
    /* he leans BACK from the glass over the hold, not into it: at 0.27 m
       the aperture subtends 70 deg against the lens's 72 and the shot is
       a full frame of sea with no ferry in it at all. At 0.75 the sill,
       the head panel and a mullion stay in frame and it reads as a boy
       looking out of a window. */
    camTo(9.0, 20.6, { x: SEAT.x - 0.07, y: SEAT.y, z: SEAT.z + 0.12 }, { x: SEAT.x - 0.30, y: SEAT.y + 0.02, z: SEAT.z + 0.20 }, smoothK);
    yawTo(13.0, 20.6, Y_WIN, Y_WIN + 0.07, smoothK);
    pitchTo(13.0, 20.6, 0.00, 0.03, smoothK);
    sfx(0.2, 'seawash', 0.85);
    sfx(1.0, 'ferryhorn', 0.7);
    sfx(1.6, 'n1pro1');                       // 17.79 s → 19.4

    /* 19.6–21.0 a dip to black, and the cabin is struck in the dark */
    fade(19.6, 20.6, 0, 1);
    step(21.0, () => { stage.ferryRoot.visible = false; stage.jettyRoot.visible = true; });

    /* ============== 21.0–28.0 WALKING IN UNDER THE SIGN ===================
       Chad: "briefly show the scene of walking into Tekong, with the words
       'Welcome to Pulau Tekong' at the top ... Recruits are all walking in a
       row, in front of the player POV ... enough time to show this walking
       scene, then fade out." Seven seconds, no narration over it. */
    const WALKIN = { x: stage.JETTY.x, y: stage.JETTY.y + 1.62, z: stage.JETTY.z - 3.6 };
    const Y_IN_J = faceFrom(WALKIN.x, WALKIN.z, WALKIN.x, WALKIN.z + 30);
    camTo(21.0, 28.0, WALKIN, { x: WALKIN.x + 0.10, y: WALKIN.y, z: WALKIN.z + 3.4 }, smoothK);
    yawTo(21.0, 28.0, Y_IN_J - 0.05, Y_IN_J + 0.04, smoothK);
    pitchTo(21.0, 24.0, 0.11, -0.02, smoothK);      // the sign overhead, then down to the file ahead
    pitchTo(24.0, 28.0, -0.02, -0.04, smoothK);
    fade(21.0, 22.4, 1, 0);
    sfx(21.2, 'bootsmarch', 0.7);
    sfx(25.4, 'gates', 0.45);

    /* 27.0–28.4 a dip, and the walkway is struck */
    fade(27.0, 28.0, 0, 1);
    step(28.4, () => { stage.jettyRoot.visible = false; stage.paradeRoot.visible = true; });

    /* ================ 28.4–37.0 THE PARADE SQUARE ========================
       Chad: "the Tekong bunk blocks, panning across the parade square ...
       recruits are all standing still at the parade square. With the encik
       model facing them." His line here is the sorting into companies, so
       the bunk half no longer needs to say Hawk Company at all. */
    const SQV = { x: stage.PARADE.x - 13.0, y: stage.PARADE.y + 1.62, z: stage.PARADE.z - 15.0 };
    const SQV2 = { x: stage.PARADE.x + 7.0, y: stage.PARADE.y + 1.62, z: stage.PARADE.z - 12.0 };
    const Y_SQ1 = faceFrom(SQV.x, SQV.z, stage.PARADE.x - 2.0, stage.PARADE.z + 16.0);
    const Y_SQ2 = faceFrom(SQV2.x, SQV2.z, stage.PARADE.x - 1.0, stage.PARADE.z + 2.0);
    camTo(28.4, 37.0, SQV, SQV2, smoothK);
    yawTo(28.4, 37.0, Y_SQ1, Y_SQ2, smoothK);
    pitchTo(28.4, 32.4, 0.07, 0.00, smoothK);
    pitchTo(32.4, 37.0, 0.00, -0.03, smoothK);
    fade(28.4, 29.8, 1, 0);
    sfx(28.6, 'bootsrun', 0.32);
    sfx(29.8, 'n1pro1b');                     // 5.49 s → 35.3

    /* 36.0–37.6 a dip, the square is struck, and the bunk half begins */
    fade(36.0, 37.0, 0, 1);
    step(37.0, () => { stage.paradeRoot.visible = false; });

    /* 37.6–44.6 the balcony: the square, the trees, the far block, flat morning
       light; then in through the opening. The beds come up with the light.
       (v7.7: up from 14.0 — the first glide is two seconds longer and
       nothing after 17.2 moved.) */
    fade(37.6, 40, 1, 0);
    sfx(38.6, 'n1pro2');                      // "Twenty of us to a bunk…" — 6.69 s → 45.3 (v7.9: the Hawk Coy half of it is the parade square's line now)
    tr(37.6, 40, k => { duck('bunkday', 0.55 * k); duck('fanloop', 0.4 * k); }, rawK);
    camTo(37.6, 42.8, BAL, { x: BAL.x - 0.4, y: EYE, z: BAL.z }, smoothK);
    camTo(42.8, 46, { x: BAL.x - 0.4, y: EYE, z: BAL.z }, OPENING, smoothK);
    yawTo(42.8, 46, Y_SQUARE, Y_IN, smoothK);
    pitchTo(42.8, 46, -0.12, 0.0, smoothK);

    /* 39.5–50 the bunk: the rows, the fans, the sergeant by the entrance. He
       talks with the hand-on-gun take under his line; the camera tracks
       down the aisle toward bed one as he names it. */
    camTo(46, 48.8, OPENING, AISLE, smoothK);
    yawTo(46, 48.8, Y_IN, Y_SGT, smoothK);
    step(47.6, () => { stage.sergeant.play('Talk_with_Left_Hand_Raised', 1, 0.3); });   // v8.2: his own talking take
    sfx(48, 's1bed');                       // 4.91 s → 27.3
    step(53.2, () => { stage.sergeant.play('Idle_3', 1, 0.4); });
    camTo(49.6, 55.6, AISLE, AISLE2, smoothK);
    yawTo(49.6, 53.2, Y_SGT, Y_SGT_MID, smoothK);
    camTo(55.6, 59.6, AISLE2, BYBED, smoothK);
    yawTo(53.2, 58.6, Y_SGT_MID, Y_BED, smoothK);
    tr(49.6, 59.6, k => { duck('bunkday', 0.55 + 0.25 * k); duck('clocktick', 0.5 * k); }, rawK);

    /* 30–44 bed one: the locker beside it, the toilet door, the clock over
       it. His third line over the pan onto the door. */
    sfx(56.2, 'lockerdoor', 0.7);
    pitchTo(58.6, 61.6, 0.0, -0.30, smoothK);
    yawTo(61.6, 66.1, Y_BED, Y_DOOR, smoothK);
    pitchTo(61.6, 66.1, -0.30, 0.06, smoothK);
    sfx(62.6, 'n1pro3');                      // 6.27 s → 43.3
    pitchTo(66.1, 69.6, 0.06, 0.34, smoothK);  // up to the clock

    /* 44–54 DUSK (v7.5). The day goes out of the windows and the sky over
       four seconds while the tubes stay on — lights out is PLAY's own beat,
       not the film's; putting the switch here was what handed a night to a
       morning. The balcony lamp and the clock's red come on with the dark;
       his fourth line; the camera settles at his pillow, looking up at the
       underside of the bunk above, lit. */
    step(69.8, () => { if (kit) kit.daylight(null, 5); stage.clockGlow.intensity = stage.CLOCK_GLOW; stage.balcLight.intensity = 5; });
    tr(69.8, 73.6, k => { stage.setWindows(k); }, smoothK);
    tr(69.8, 72.6, k => { duck('bunkday', 0.8 * (1 - k)); duck('fanloop', 0.4 + 0.2 * k); }, rawK);
    sfx(71.6, 'n1pro4');                      // 5.15 s → 51.2
    camTo(71.6, 77.6, BYBED, PILLOW, smoothK);
    yawTo(71.6, 77.6, Y_DOOR, Y_UP, smoothK);
    pitchTo(71.6, 77.6, 0.34, 0.68, smoothK);     // to the bunk's edge, the mesh under it, the ceiling and the fan (v7.2: 0.80 looked into a slab)
    sfx(76.4, 'bunkcreak', 0.6);

    /* 74.5–78.5 down, and out. Whatever the film did to the day is handed back
       on its last frame (a skip runs every step, so this one too). */
    fade(79.6, 83.6, 0, 1);
    tr(79.6, 83.6, k => { duck('fanloop', 0.6 * (1 - k)); duck('clocktick', 0.5 * (1 - k)); }, rawK);
    step(83.6, () => {
      armR.visible = true;
      if (kit) kit.daylight(null, 0);
      stage.clockGlow.intensity = stage.CLOCK_GLOW; stage.balcLight.intensity = 5;
      stage.setLights(1); stage.setWindows(1);
      duck('bunkday', 1); duck('fanloop', 1); duck('clocktick', 1);
    });
    c.endFade = 1;
    c.keepFade = true;
  }

  /* ---------------------------------------------------------- the scenes
     Four, docs/V7.1-E2C1-PLAN.md §10, every one from the pillow at three in
     the morning with the shower running in the block. The hands go away
     (the v4.91 rule) and come back on the last step; the engine restores
     the bed, the door, the water and the sleepers from stage.snap(). */
  const P = (s) => ({ x: s.yawPos.x, y: s.yawPos.y, z: s.yawPos.z });

  /* A · GET UP AND OPEN THE TOILET DOOR (24.4 s). Up off the pillow, to
     the door, in; the tiles under one tube; the shower running in the far
     cubicle; the water stops by itself as he reaches it; nobody; a drop;
     and turning back, for a tenth of a second at the corridor's end, the
     figure — then black and his line. */
  function scOpen(c, s, api) {
    const { tr, step, sfx, fade, camTo, yawTo, pitchTo, faceFrom, rawK, smoothK,
            duck, stage, handsRoot } = api;
    const P0 = P(s);
    const STAND = { x: stage.hisBed.x + 1.0, y: 1.62, z: stage.hisBed.z + 0.3 };
    const ATDOOR = { x: stage.DOOR_WC.x, y: 1.62, z: stage.R.z - 0.7 };
    const INSIDE = { x: stage.DOOR_WC.x, y: 1.62, z: 5.1 };
    const NEAR = { x: stage.WATER_AT.x, y: 1.58, z: 5.65 };      // in the far cubicle's own lane: from beside it the partition hides the water
    const END = { x: stage.BLOCK.x0 + 0.45, z: 5.3 };
    const Y_DOOR = faceFrom(STAND.x, STAND.z, stage.DOOR_WC.x, stage.R.z);
    const Y_IN = faceFrom(INSIDE.x, INSIDE.z, stage.WATER_AT.x, stage.WATER_AT.z);
    const Y_NEAR = faceFrom(NEAR.x, NEAR.z, stage.WATER_AT.x, stage.WATER_AT.z);
    const Y_END = faceFrom(NEAR.x, NEAR.z, END.x, END.z);
    step(0, () => { handsRoot.visible = false; stage.ghostFig.group.visible = false; });
    // 0–2.6 up off the bed
    sfx(0.6, 'bunkcreak', 0.6);
    camTo(0.3, 2.6, P0, STAND, smoothK);
    yawTo(0.3, 2.6, s.yawRot, Y_DOOR, smoothK);
    pitchTo(0.3, 2.6, s.pitchX, 0.0, smoothK);
    // 2.8–6.0 to the door, soft
    sfx(2.8, 'bootsrun', 0.32);
    camTo(2.8, 6.0, STAND, ATDOOR, smoothK);
    // 6.2 the door, into the block
    sfx(6.2, 'dooropen2', 0.8);
    tr(6.2, 7.4, k => { stage.doorPivot.rotation.y = stage.DOOR_AJAR + (stage.DOOR_OPEN - stage.DOOR_AJAR) * k; }, smoothK);
    camTo(7.2, 10.5, ATDOOR, INSIDE, smoothK);
    yawTo(7.2, 10.5, Y_DOOR, Y_IN, smoothK);
    tr(7.0, 9.0, k => { duck('showerrun', 1 + 0.6 * k); }, rawK);
    // 10.5–15 down the corridor toward the water
    camTo(10.5, 15.0, INSIDE, NEAR, smoothK);
    yawTo(10.5, 15.0, Y_IN, Y_NEAR, smoothK);
    sfx(11.0, 'n1A1');                          // 3.55 s → 14.6
    // 15.0 it stops. By itself.
    sfx(15.0, 'showeroff', 0.9);
    step(15.0, () => { stage.setShower(false); });
    tr(15.0, 16.0, k => { duck('showerrun', 1.6 * (1 - k)); }, rawK);
    sfx(17.6, 'drip', 0.8);
    // 18.6–21 turning back down the corridor — and the figure at its end
    yawTo(18.6, 20.8, Y_NEAR, Y_END, smoothK);
    pitchTo(18.6, 20.8, 0.0, 0.02, smoothK);
    sfx(20.8, 'dread', 0.9);
    step(20.95, () => { stage.ghostFig.group.visible = true; });
    step(21.1, () => { stage.ghostFig.group.visible = false; });
    fade(21.1, 22.2, 0, 1);
    sfx(21.6, 'n1A2');                          // 2.51 s → 24.1
    step(24.4, () => { handsRoot.visible = true; });
    c.endFade = 1;
  }

  /* B · STAY STILL AND LISTEN (22.6 s). The ceiling, the fan turning, the
     clock's red on the wall; the shower held at the block's distance; his
     line; at fourteen the water stops — by itself; his second line; the
     long hold; a drop. */
  function scListen(c, s, api) {
    const { tr, step, sfx, fade, yawTo, pitchTo, rawK, smoothK, duck, stage, handsRoot } = api;
    step(0, () => { handsRoot.visible = false; });
    yawTo(0, 3.0, s.yawRot, stage.LIE_YAW, smoothK);
    pitchTo(0, 3.0, s.pitchX, 0.95, smoothK);      // v7.2: 1.15 looked into the top bunk's slab; the fan and the clock's spill share this frame
    tr(0, 4.0, k => { duck('showerrun', 1 - 0.35 * k); }, rawK);
    sfx(2.0, 'n1B1');                           // 4.13 s → 6.1
    sfx(14.0, 'showeroff', 0.7);
    step(14.0, () => { stage.setShower(false); });
    tr(14.0, 15.0, k => { duck('showerrun', 0.65 * (1 - k)); }, rawK);
    sfx(15.4, 'n1B2');                          // 2.51 s → 17.9
    sfx(19.5, 'drip', 0.7);
    fade(20.6, 22.4, 0, 1);
    step(22.6, () => { handsRoot.visible = true; });
    c.endFade = 1;
  }

  /* C · WHISPER TO YOUR BUNKMATE (18.2 s). The head turns to the next bed;
     the whisper; a beat; his blanket shifts; "Huh? ...what? Go sleep lah."
     He rolls over. The shower runs on. Back to the ceiling. */
  function scWhisper(c, s, api) {
    const { tr, step, sfx, fade, yawTo, pitchTo, faceFrom, smoothK, stage, handsRoot } = api;
    const P0 = P(s);
    const nb = stage.sleepers.find(o => o.bed.x < 0 && Math.abs(o.bed.z - 1.5) < 0.01) || null;
    const Y_NEXT = faceFrom(P0.x, P0.z, stage.hisBed.x, 1.5);
    const ry0 = nb ? nb.obj.rotation.y : 0, rz0 = nb ? nb.obj.rotation.z : 0;
    step(0, () => { handsRoot.visible = false; });
    tr(0.5, 2.4, k => { stage.nbLight.intensity = 2.8 * k; }, smoothK);     // v7.2: so the man he whispers to can be seen
    yawTo(0.5, 2.0, s.yawRot, Y_NEXT, smoothK);
    pitchTo(0.5, 2.0, s.pitchX, -0.06, smoothK);
    sfx(2.2, 'n1C1');                           // the whisper, 1.65 s → 3.9
    sfx(5.6, 'blanket', 0.7);
    tr(5.6, 7.2, k => { if (nb) nb.obj.rotation.z = rz0 + 0.22 * Math.sin(k * Math.PI); }, smoothK);
    sfx(7.2, 'b1huh');                          // 3.4 s → 10.6
    sfx(8.8, 'blanket', 0.5);
    tr(8.8, 10.8, k => { if (nb) { nb.obj.rotation.y = ry0 + 0.35 * k; nb.obj.rotation.z = rz0 + 0.30 * k; } }, smoothK);
    yawTo(12.0, 15.0, Y_NEXT, stage.LIE_YAW, smoothK);
    pitchTo(12.0, 15.0, -0.06, 0.95, smoothK);
    fade(16.2, 18.0, 0, 1);
    step(18.2, () => { handsRoot.visible = true; });
    c.endFade = 1;
  }

  /* D · IT'S A GHOST — BLANKET OVER YOUR HEAD (19.8 s, critical). The
     blanket up; weave-dark; "It's nothing" twice, the second time quieter;
     the shower does NOT stop — it comes up, closer; the presence climbs;
     the boom; black. The −15 is the choice's own delta. */
  function scBlanket(c, s, api) {
    const { tr, step, sfx, fade, pitchTo, rawK, smoothK, duck, stage, handsRoot, kit } = api;
    const bl = stage.blanketCam;
    step(0, () => { handsRoot.visible = false; });
    sfx(1.0, 'blanket', 0.9);
    tr(1.0, 2.2, k => { bl.visible = true; bl.material.opacity = 0.985 * k; }, smoothK);
    pitchTo(1.0, 2.2, s.pitchX, 0.3, smoothK);
    sfx(2.8, 'n1D1', 1.0);                      // 2.43 s → 5.2
    sfx(8.0, 'n1D1', 0.55);
    tr(2.0, 14.0, k => { duck('showerrun', 1 + 0.9 * k); }, rawK);
    tr(0, 15.0, k => { if (kit) kit.presence(0.35 + 0.45 * k); }, rawK);
    tr(4.0, 15.0, k => { bl.position.z = -0.11 + 0.012 * Math.sin(k * 31); }, rawK);   // his breathing against the cloth
    sfx(15.0, 'boom', 0.9);
    fade(15.0, 16.6, 0, 1);
    step(19.6, () => { handsRoot.visible = true; bl.visible = false; bl.material.opacity = 0; bl.position.z = -0.11; if (kit) kit.presence(0.35); });
    c.endFade = 1;
  }

  (window.__CHAPTERS__ = window.__CHAPTERS__ || {}).e2c1 = Object.assign(DATA, {
    build,
    intro,
    scenes: [scOpen, scListen, scWhisper, scBlanket]
  });
})();
