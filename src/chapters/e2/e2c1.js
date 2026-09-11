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
    bounds:    { minX: -5.7, maxX: 20.0, minZ: -3.7, maxZ: 7.2 },   // v9.2: out past the balcony onto the parade square, where the fall-in is now

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

    /* v8.3: `fbonosling` is gone from the chapter — the bunkmate wears the
       admin tee now and nobody else was ever the FBO without a rifle, so it
       stopped being downloaded (4.1 MB off e2c1's asset bill). The key stays
       in build.py for a later chapter. */
    assets: ['fbosling', 'admintee', 'botak', 'encik2', 'sleeper', 'sleepanim', 'ghostsoldier',
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
      /* v8.7: 'Lie down' was the hint for a toggle that no longer exists —
         and never did anything the chapter needed. The bed now names what
         it is, and the badge only appears when it has something to do. */
      act: 'E at your bed',
      actTouch: 'Tap your bed',
      interact: 'E at your bed',
      interactTouch: 'Tap your bed',
      presence: 'Something is in the block.',
      objArrive: 'Find your bed — bed one',
      objFallIn: 'FALL IN — on the yellow line',
      objLate: 'FALL IN — get to the line',
      objPunish: 'TWENTY PUSH-UPS — the whole section',
      objStandby: 'Back to your bed — standby bed',
      objStood: 'Stand by your bed — wait for orders',
      objBedTap: 'STANDBY BED — start it at your bed',
      objBed: 'STANDBY BED — sixty seconds',
      bedBrief: 'Eight items, one at a time. Tap each one the moment it is named. They come faster as you go, and anything you miss counts against you.',
      objFree: 'Look around the bunk before lights out',
      objWarn: 'Lights out is coming — get to your bed',
      objLights: 'Lights out',
      objFear: 'FEAR CONTROL — keep the beat',
      hotShower: 'Look into the shower block',
      hotBuddy: 'Talk to him',
      hotBoard: 'Read the notice board',
      hotBunkmate: 'Ask him about bed one',
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
                 e1knock: 7.31, e1backbunk: 4.44,

                 b1day: 3.08, b1sleep: 2.19, k1board: 3.0, k1three: 4.05 };

  function build(ctx) {
    const { THREE, GLTFLoader, cloneSkinned, scene, camera, yaw, pitch, LOW, kit, plantTrees,
            assetBytes, rescueTextures, redoShadows,
            cnv, makeSoftDot, makeGrass, makeConcrete,
            makeHellNote, getState, startDecision, worldSfx, warmSounds, HEAD_RE } = ctx;

    const SHRINE = new THREE.Vector3(DATA.shrine.x, 0, DATA.shrine.z);
    const owned = [];
    let alive = true;

    /* ------------------------------------------------------------- the map */
    const R = { x: 6.0, z: 4.0, h: 3.0, wall: 0.16 };
    const DOOR_IN = { x: 0, w: 1.0, h: 2.1 };                 // v9.1: the wall is solid; this is kept as the landmark the −z dressing is placed from
    const DOOR_WC = { x: -3.3, w: 0.9, h: 2.05 };              // the toilet-block door, +z wall
    const OPEN = { z0: -1.2, z1: 1.2, h: 2.2 };                // the balcony opening, +x wall
    const BLOCK = { x0: -6.0, x1: -0.5, z0: 4.0, z1: 7.5 };    // the shower block
    const BALC = { x0: 6.0, x1: 8.4, z0: -6.0, z1: 6.0, line: 7.6, parapet: 1.0 };
    const SQUARE = { x0: 8.4, x1: 46, z0: -25, z1: 25 };
    /* v9.2 · WHERE THE FALL-IN HAPPENS. Chad picked the distance: "go with
       x14". The line is 5.6 m past the balcony's edge and 19 m short of the
       other block; the two seniors stand in front of it, facing back down it
       at the section and at the bunk they all came out of. `slot` is the
       spacing of a single rank — eight men across 8.4 m. */
    const SQ = { line: 14.0, sgt: 18.8, enc: 17.6, slot: 1.2 };
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

    /* −z wall, SOLID (v9.1). Chad: "remove the dark red corridor and the
       corridor interaction since it looks useless and pointless. Make that a
       normal wall and fill it up." It was a doorway into a dark box with a
       hotspot that said "The corridor. Not tonight." and did nothing — a way
       out the chapter never lets you take, which is exactly what makes it
       read as pointless rather than as atmosphere. The doorway, the box, its
       doormat floor and the `out` hotspot are all gone; the wall runs the
       full width, so `blockers()` boxes one wall instead of three and the
       8 cm floor gap the doormat was covering cannot exist. The bunk's own
       fittings against it — the extinguisher, the bin, the notice board —
       stay where they were, and it is dressed below so a blank 12 m² of
       wall does not read as a missing room. */
    {
      const z = -R.z - R.wall / 2;
      wall(R.x * 2, R.h, R.wall, 0, R.h / 2, z);
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
       block (+z). A named swing contract, the v4.6 lesson.

       v9.1 (Chad): "can you also make the toilet door open the other way? It
       is colliding with the bed, and also affects the check the toilet
       cutscene." He was right and the comment above was WRONG — a POSITIVE
       rotation about y takes the leaf's +x arm toward −z, which is the BUNK,
       not the block. Measured on the shipped v9.0 build, the open leaf ran
       from its hinge at (−3.750, 4.080) to (−3.686, 3.182); his bed's frame
       spans x −5.55…−3.65 and z 2.55…3.45, so the last 27 cm of the door
       stood inside the bed. The angles are negative now, which swings it the
       other way — into the block, where the nearest thing is a cubicle
       partition 2.4 m further on — and AJAR goes with it, so the film's
       almost-shut door and scene A's swing are one motion in one direction
       rather than a door that opens through its own frame. */
    const doorPivot = new THREE.Group();
    doorPivot.position.set(DOOR_WC.x - DOOR_WC.w / 2, 0, R.z + R.wall / 2);
    world.add(doorPivot);
    const doorLeaf = new THREE.Mesh(new THREE.BoxGeometry(DOOR_WC.w, DOOR_WC.h, 0.05), matDoor);
    doorLeaf.position.set(DOOR_WC.w / 2, DOOR_WC.h / 2, 0);
    doorLeaf.castShadow = !LOW; doorLeaf.receiveShadow = true;
    doorPivot.add(doorLeaf);
    const DOOR_SHUT = 0, DOOR_AJAR = -0.35, DOOR_OPEN = -1.5;    // rotation.y, NEGATIVE swings into the block (measured, v9.1)
    /* v8.9 (Chad): "the toilet is very buggy. When i go in, i cannot find my
       way out. Why not just keep the toilet door open at all times so i can
       freely walk in and out without interacting with the toilet door?"
       The block was never sealed — measured at v7.5, every cell of it
       reachable, and `walktest` has asserted it since — so what trapped him
       was not collision but the LEAF: at 0.35 rad it hung across most of a
       0.9 m opening in an unlit block, and a doorway you cannot see is a
       wall. It stands fully open in play now (`DOOR_PLAY`), and the hotspot
       that used to swing it and step the player through is gone with it.
       The two cutscene beats that move the door are untouched: the film
       shuts it to AJAR at step(0) and scene A swings it open on `dooropen2`,
       both of which set the angle themselves. */
    const DOOR_PLAY = DOOR_OPEN;
    doorPivot.rotation.y = DOOR_PLAY;

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
    /* v9.0: painted at about half what it should read at, because the
       renderer is ACESFilmic at exposure 1.42 (v8.9's law). Against the
       model's olive mattress the old 0xe9e6dc came out as a sheet of light. */
    const matSheet = new THREE.MeshStandardMaterial({ color: 0xc2beb3, roughness: 0.92 });
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
          decks.highMesh = wm;
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
                  mesh: decks.highMesh, his: (x === HIS.x && z === HIS.z) };
      /* THE PARTS CHAD'S MODEL SUPERSEDES, named here where they are made
         rather than found later by a traverse.

         v9.0 hid the frame, the mattresses and the pillows and LEFT the
         bedding standing — and v9.1 is Chad looking at the result: "why is
         the old bed/mattress/pillow colliding and floating above the new 3d
         bed model? Remove the old ones." Photographed from his own eye at
         the foot of bed one, he is right: the primitive BEDSHEET is a pale
         slab 1.2 cm proud of an olive mattress that already has its own
         cover, the folded blanket is a green box standing on the guard rail
         at the end nearest the lens, and the WIRE BASE is a plane hanging
         1.5 cm under a mattress whose frame carries its own. All three are
         things the model brings, drawn twice.

         v9.2 takes the LAST piece of it — Chad: "why are there still green
         blocks floating on some of the beds?" The blanket pulled over a
         sleeper is a 1.28 x 0.20 x 0.84 BOX in blanket green, and measured on
         the shipped build its underside sat 1.6 cm clear of the model's
         mattress on exactly the four beds a breathing rig sleeps in — "some
         of the beds", precisely. A box floating over a man is not a blanket,
         and the sleeping models are clothed figures that read perfectly well
         without one, so it goes the way the sheet and the fold went.

         What stays is what the model does NOT carry and what does not pretend
         to be cloth: the BOOTS under the bed.

         The meshes are HIDDEN, never removed — `blockers()` boxes
         `low.mattress` and the bed's tap test raycasts it, and three.js does
         both to an invisible mesh exactly as it does to a visible one
         (checked, not assumed). They are the proxies the room is built on. */
      b.supersede = [...g.children.filter(o => o.geometry === bedGeo.post
                       || o.geometry === bedGeo.rail || o.geometry === bedGeo.railEnd
                       || o.geometry === bedGeo.mat || o.geometry === bedGeo.pillow
                       || o.geometry === bedGeo.sheet || o.geometry === bedGeo.blanketFold
                       || o.geometry === bedGeo.mesh || o.geometry === bedGeo.blanketOn)];
      /* v9.2: WHERE A MAN LIES. Everything that rests on the bottom bunk is
         placed from `deckTop` rather than from `BED.low`, and the bunk loader
         MEASURES that off Chad's model when it lands. The two are 1 mm apart
         by construction — what actually floated a sleeper was the `+ 0.02`
         each placement carried, which put every man in this room 2.0 cm off
         his mattress (measured, all eight). A thing registers itself with the
         offset it wants from the deck, and `settle()` re-places it, because
         the bunk model and the two sleeper files land in whatever order the
         network gives them. */
      b.deckTop = BED.low;
      b.restOn = [];
      beds.push(b);
      return b;
    }
    for (const rx of ROW_X) for (const rz of bedZs(rx)) mkBed(rx, rz, rx < 0 ? -1 : 1);
    const hisBed = beds.find(b => b.his);
    /* v9.2: everything that LIES on a bottom bunk registers itself here with
       the offset it wants from the deck, and this puts it there. It is called
       twice for the same man in the ordinary case — once when his own file
       lands, once when the bunk model lands and the deck is measured — and
       the order of those two is whatever the network gives, which is exactly
       why the offset is stored rather than baked into a position. */
    function restOnDeck(b, obj, dy) { b.restOn.push({ obj, dy }); obj.position.y = b.deckTop + dy; }
    function settleBed(b) { for (const r of b.restOn) r.obj.position.y = b.deckTop + r.dy; }

    /* ------------------------------------------- THE REAL BUNK BED (v9.0)
       Chad, with a Sketchfab model: "Replace all bunk beds you generated,
       with this 3d model bunk bed." A tubular army bunk — posts, guard rail,
       a ladder, two olive mattresses with a pillow on each — where nine beds
       of boxes and cylinders used to be.

       MEASURED BY `tools/prepbunk.mjs`, which prints these four numbers and
       asserts them, so nothing here is a guess:
         length (x) 2.004   width (z) 1.313   height (y) 1.710
         mattress tops at 0.592 and 1.575, and THE PILLOWS ARE AT THE −x END.

       THE FIT IS TO THE PRIMITIVE, not the other way round, and that is the
       whole reason this change is safe. Every number the room is built on —
       `blockers()`, `walktest`'s route, the bed zone, where a sleeper lies,
       which cells the fall-in can be reached through — comes off the
       primitive mattress, and the primitive mattress does not move. The model
       is scaled onto it:

         x  BED.len / 2.004 = 0.948     (1.90 m: barely anything)
         z  BED.wid / 1.313 = 0.685     (0.90 m: a real squeeze, and forced)
         y  so the two mattress TOPS land exactly on BED.low and BED.high,
            which is 1.017 with the frame sunk 5.2 cm into the floor

       The z squeeze is not a preference. The balcony row's beds are 1.15 m
       apart (`ROW_Z_BALC`), so a bed at the model's own 1.31 m would OVERLAP
       its neighbour; and scaling uniformly by width instead would leave a
       1.37 m bed for a 1.72 m man to lie on. Fitting the footprint keeps the
       room, the collision and the walk exactly as they are, and a tubular
       frame squeezed across its short axis reads as a narrower bed rather
       than as a distorted one.

       The y fit is EXACT rather than near, because the sheet, the pillow, the
       folded blanket and the sleeper's blanket all sit at `deck + a few
       centimetres` and a 2 cm error is a sheet floating over a mattress.
       Solving both decks at once gives the 5.2 cm sink; the feet go under the
       floor plane, where nothing can see them.

       THE PILLOW END is why the bed turns. The model's pillows are at its −x
       end and `headTowardWall` is −1 on the wall row and +1 on the balcony
       row, so the balcony row's beds are turned a half circle and both rows
       put a pillow against their own wall.

       It loads ASYNC over the primitives, which stay standing until the bytes
       land: a failed download costs a nicer bed, never the chapter. */
    const BUNK = { len: 2.004, wid: 1.313, deckLo: 0.592, deckHi: 1.575, botLo: 0.319, botHi: 1.302 };
    const BUNK_SX = BED.len / BUNK.len;
    const BUNK_SZ = BED.wid / BUNK.wid;
    const BUNK_SY = (BED.high - BED.low) / (BUNK.deckHi - BUNK.deckLo);
    const BUNK_DY = BED.low - BUNK.deckLo * BUNK_SY;
    assetBytes('bunkbed').then(BUF => new GLTFLoader().parse(BUF, '', (gltf) => {
      if (!alive) return;
      rescueTextures(gltf, BUF);
      const src = gltf.scene;
      src.traverse(o => { if (o.isMesh) { o.castShadow = !LOW; o.receiveShadow = true; } });
      beds.forEach((b, i) => {
        /* clone() shares geometry and material, so nine beds are one upload
           and nine draws — and each is its own object, so v8.4's culling
           drops the ones the lens is not pointed at, which is most of them */
        const m = i === 0 ? src : src.clone(true);
        m.scale.set(BUNK_SX, BUNK_SY, BUNK_SZ);
        m.position.set(0, BUNK_DY, 0);
        m.rotation.y = b.head > 0 ? Math.PI : 0;
        b.group.add(m);
        b.model = m;
        for (const o of b.supersede) o.visible = false;
        /* v9.2: the deck a man lies on, MEASURED off this bed's own model
           rather than assumed. The nominal fit puts the lower mattress top on
           BED.low exactly; the mesh's own top reads 0.549, a millimetre under,
           and a millimetre is the difference between resting and floating. */
        {
          /* THE MATRICES FIRST. `Box3.setFromObject` updates the object it is
             given and its DESCENDANTS — never its ancestors — so measuring a
             child of a model that was positioned and scaled a line ago reads
             the model's STALE matrix. Measured: without this the union came
             back at 0.591, which is the mattress top in the model's OWN
             coordinates (BUNK.deckLo 0.592), and every sleeper in the room
             went from 2.0 cm off his bed to 4.2. */
          m.updateWorldMatrix(true, true);
          const bb = new THREE.Box3();
          m.traverse(o => {
            if (!o.isMesh) return;
            const ob = new THREE.Box3().setFromObject(o);
            if (ob.max.y < 1.0 && ob.max.y > 0.3) bb.union(ob);   // the LOWER mattress: the only part topping out between the floor and the top deck
          });
          if (!bb.isEmpty()) b.deckTop = bb.max.y;
          settleBed(b);
        }
        /* v9.0 moved the primitive WIRE BASE down to 1.260 here, to sit just
           under the model's top mattress. v9.1 supersedes it instead (see
           mkBed): the model's frame carries its own base, and a second one
           hanging 1.5 cm below a mattress is one of the three leftovers Chad
           saw. It is hidden the moment the model lands, and if the download
           never lands the primitive bed stands untouched, base and all. */
      });
      redoShadows();                          // nine new shadow casters, as every other loader here does
    })).catch(() => {});                      // the primitives are already standing

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

      /* v9.1: what stands where the entrance used to be. Sealing the −z wall
         (above) left 12 m² of blank paint in the middle of the shot the film
         ends on, so the wall is dressed the way a bunk's is: a rail of hooks
         with two towels on it, and a first-aid box beside them. All
         primitives, no download, and all of it flat against the wall — the
         blockers box the WALL, so nothing here is walked into. */
      const matRail = new THREE.MeshStandardMaterial({ color: 0x8d949a, roughness: 0.5, metalness: 0.5 });
      const rail = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.035, 0.035), matRail);
      rail.position.set(0, 1.72, -R.z + 0.07); world.add(rail);
      for (const hx of [-0.6, -0.3, 0, 0.3, 0.6]) {
        const hook = new THREE.Mesh(new THREE.BoxGeometry(0.022, 0.09, 0.022), matRail);
        hook.position.set(hx, 1.67, -R.z + 0.10); world.add(hook);
      }
      const matTowel = [0x9fb0a4, 0x6f7f92];
      [-0.3, 0.3].forEach((tx, i) => {
        const tw = new THREE.Mesh(new THREE.BoxGeometry(0.30, 0.62, 0.045),
          new THREE.MeshStandardMaterial({ color: matTowel[i], roughness: 0.95 }));
        tw.position.set(tx, 1.35, -R.z + 0.10); tw.rotation.z = i ? 0.03 : -0.04; world.add(tw);
      });
      const aid = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.30, 0.13),
        new THREE.MeshStandardMaterial({ color: 0xe6e2d6, roughness: 0.7 }));
      aid.position.set(1.05, 1.62, -R.z + 0.08); world.add(aid);
      const cross = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.045, 0.01),
        new THREE.MeshStandardMaterial({ color: 0xb8241c, roughness: 0.6 }));
      cross.position.set(1.05, 1.62, -R.z + 0.145); world.add(cross);
      const crossV = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.16, 0.01),
        new THREE.MeshStandardMaterial({ color: 0xb8241c, roughness: 0.6 }));
      crossV.position.set(1.05, 1.62, -R.z + 0.145); world.add(crossV);
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
    /* v8.6: 0, and the light with it. Chad: "why is there a light shining at
       the analog clock? I dont think that one is needed." He is right, and it
       is a leftover: it was the RED of a digital display, and when v7.9 made
       the clock analog the light was kept on as "the small warm practical
       over the toilet door" — but there is no lamp fitting there, and a wall
       clock is not one. Held at zero rather than deleted, because ten call
       sites save, restore and cue it; `darkLights()` then drops it from the
       shader entirely, so it costs nothing at all. */
    const CLOCK_GLOW = 0;
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
      /* the wall the block shares with the bunk faces it in tile — WITH THE
         DOORWAY CUT OUT OF IT (v9.1). Chad: "when i walk into the toilet, and
         then turn back to my bed, i cannot see the entrance/door to get back
         to my bed." He was describing this plane exactly: it ran the full
         5.5 m of the shared wall at full height and covered the opening, so
         from inside the block the way out was a flat sheet of tile. It is not
         a blocker, so he could always WALK through it — which is worse, not
         better: the block had no visible exit and the one that worked was
         invisible. Three pieces now, left of the door, right of it, and the
         lintel over it, so the lit bunk shows through the hole. */
      {
        const bz = BLOCK.z0 + R.wall + 0.01;
        const dl = DOOR_WC.x - DOOR_WC.w / 2, dr = DOOR_WC.x + DOOR_WC.w / 2;
        const piece = (w, h, x, y) => {
          const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), matTile);
          m.position.set(x, y, bz); world.add(m);
        };
        piece(dl - BLOCK.x0, R.h, (BLOCK.x0 + dl) / 2, R.h / 2);
        piece(BLOCK.x1 - dr, R.h, (dr + BLOCK.x1) / 2, R.h / 2);
        piece(DOOR_WC.w, R.h - DOOR_WC.h, DOOR_WC.x, (R.h + DOOR_WC.h) / 2);
        /* and a jamb round the opening, so it still reads as a doorway when
           the bunk beyond it is dark */
        const matJamb = new THREE.MeshStandardMaterial({ color: 0x7f8a84, roughness: 0.7 });
        for (const jx of [dl, dr]) {
          const j = new THREE.Mesh(new THREE.BoxGeometry(0.05, DOOR_WC.h, 0.05), matJamb);
          j.position.set(jx, DOOR_WC.h / 2, bz - 0.03); world.add(j);
        }
        const head = new THREE.Mesh(new THREE.BoxGeometry(DOOR_WC.w + 0.1, 0.05, 0.05), matJamb);
        head.position.set(DOOR_WC.x, DOOR_WC.h, bz - 0.03); world.add(head);
      }
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
      /* v9.2: NO PARAPET. Chad: "remove the parapet entirely instead of just
         cutting a gate." It was a 1 m wall the whole length of the balcony
         and it was the only thing between the player and the square, which
         is where the fall-in happens now. Taking it out rather than cutting
         a gate in it costs nothing and buys something: the march code needs
         no new gate at all — `marchLegs` already routes through the bunk's
         own wall and then runs across open floor, and open floor is now
         everything from the bed row to the yellow line. The roof columns and
         the two end walls stay, so the balcony still reads as a storey. */
      // two columns holding the roof, at the ends
      for (const cz of [BALC.z0 + 0.3, BALC.z1 - 0.3]) {
        const col = new THREE.Mesh(new THREE.BoxGeometry(0.3, R.h, 0.3), matWall);
        col.position.set(BALC.x1 - 0.15, R.h / 2, cz); world.add(col); walls.push(col);
      }
      // the outer face of the bunk's +x wall is the balcony's inner wall; it is the same wall
      // the ends of the balcony: low walls so it reads as a storey, not a stage
      for (const ez of [BALC.z0, BALC.z1]) {
        const e = new THREE.Mesh(new THREE.BoxGeometry(BALC.x1 - BALC.x0, R.h, 0.2), matWall);
        e.position.set((BALC.x0 + BALC.x1) / 2, R.h / 2, ez); e.receiveShadow = true; world.add(e); walls.push(e);
      }
    }

    /* --------------------------------------------- THE PARADE SQUARE (v9.2)
       Chad: "instead of falling in at the yellow line at the balcony, i want
       everyone to fall in at the parade square with the carpark type ground.
       Everyone falls in at the parade square in a single line (with yellow
       line) and they are facing the other block."

       This square already existed — a flat tarmac plane from the parapet out
       to x 40, laid at v7.1 as something to LOOK at from the balcony. It is a
       PLACE now: the parapet is gone (above), the player's bounds reach x 20,
       and the whole fall-in happens out here.

       What makes a Tekong square read as a car park is not the asphalt, which
       it already had, but the PAINT — so it gets the v8.9 recipe's bays as
       real geometry: standard 2.5 m bays, 5.0 m deep, two rows back to back
       with a shared head line, in ONE InstancedMesh. Geometry rather than a
       texture for the same reason as v8.9: a 10 cm stripe on an 11.5 m tile is
       two texels and aliases to nothing.

       THE BAYS START AT x 21, which is past where anyone stands — the line is
       at 14 and the two seniors at 17.6 and 18.8 — so the inspection happens
       on clear tarmac with the car park behind it, which is what a square that
       is a car park six days a week actually looks like.                    */
    {
      const sq = new THREE.Mesh(new THREE.PlaneGeometry(SQUARE.x1 - SQUARE.x0, SQUARE.z1 - SQUARE.z0), matTarmac);
      sq.rotation.x = -Math.PI / 2; sq.position.set((SQUARE.x0 + SQUARE.x1) / 2, -0.02, 0); sq.receiveShadow = true;
      world.add(sq);
      // THE FALL-IN LINE, painted yellow, one line across the square
      const line = new THREE.Mesh(new THREE.PlaneGeometry(0.10, 12), matLine);
      line.rotation.x = -Math.PI / 2; line.position.set(SQ.line, -0.012, 0); world.add(line);
      /* the bays: dividers 5 m deep every 2.5 m across two rows, and the head
         line the two rows share. One draw call for the lot. */
      {
        const BAY_W = 2.5, BAY_D = 5.0, X0 = 21, ZN = 22;
        const divs = [];
        for (const xc of [X0 + BAY_D / 2, X0 + BAY_D * 1.5]) {
          for (let z = -ZN; z <= ZN + 0.01; z += BAY_W) divs.push({ x: xc, z, w: BAY_D, d: 0.10 });
        }
        divs.push({ x: X0 + BAY_D, z: 0, w: 0.10, d: ZN * 2 });          // the shared head line
        const bays = new THREE.InstancedMesh(new THREE.PlaneGeometry(1, 1),
          new THREE.MeshStandardMaterial({ color: 0x8e8f88, roughness: 0.95 }), divs.length);
        const mtx = new THREE.Matrix4(), q = new THREE.Quaternion();
        q.setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 2);
        divs.forEach((d, i) => {
          mtx.compose(new THREE.Vector3(d.x, -0.011, d.z), q, new THREE.Vector3(d.w, d.d, 1));
          bays.setMatrixAt(i, mtx);
        });
        bays.instanceMatrix.needsUpdate = true;
        bays.computeBoundingSphere();          // v8.6: so the stand culls like every other one
        world.add(bays);
      }
      /* THE OTHER BLOCK — what the line faces. Low and long and 19 m past the
         line, so it fills the eye without filling the sky: measured from the
         balcony it stands about 25 degrees tall, a building across a square
         rather than a wall at the end of one. */
      const bw = 46, bh = 11, bd = 10, bx = 38;
      const far = new THREE.Mesh(new THREE.BoxGeometry(bd, bh, bw), matWall);
      far.position.set(bx, bh / 2, 0); far.receiveShadow = true; world.add(far); walls.push(far);
      const cap = new THREE.Mesh(new THREE.BoxGeometry(bd + 0.7, 0.5, bw + 0.7),
        new THREE.MeshStandardMaterial({ color: 0x8a9a7c, roughness: 0.9 }));
      cap.position.set(bx, bh + 0.25, 0); world.add(cap);
      // its floor bands and windows, on the face the line looks at
      const matBand = new THREE.MeshStandardMaterial({ color: 0xd79a52, roughness: 0.9 });
      const matPane = new THREE.MeshStandardMaterial({ color: 0x2a3a44, roughness: 0.35, metalness: 0.3 });
      for (let f = 0; f < 3; f++) {
        const y = 2.4 + f * 3.3;
        const bnd = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.3, bw + 0.4), matBand);
        bnd.position.set(bx - bd / 2 - 0.05, y + 1.5, 0); world.add(bnd);
        for (let i = 0; i < 13; i++) {
          const w = new THREE.Mesh(new THREE.BoxGeometry(0.22, 1.3, 1.6), matPane);
          w.position.set(bx - bd / 2 - 0.08, y, -bw / 2 + 2.4 + i * 3.5); world.add(w);
        }
      }
      // the grass beyond, and under the trees
      const gr = new THREE.Mesh(new THREE.PlaneGeometry(160, 160), matGrass);
      gr.rotation.x = -Math.PI / 2; gr.position.set(56, -0.05, 0); gr.receiveShadow = true;
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
    /* v8.9: the pocket moved from (−70, −60) to (−70, −420), and the reason
       is the whole reason a pocket exists. v7.9 put it 92 m from the camp,
       which was fine while the sea was two vertical SHEETS 16 m off each
       side — they walled the camp out. Open the windows onto real water and
       the camp is simply there, on the horizon, in the middle of the Johor
       Strait: the first render of this build had the bunk block and its
       trees sitting on the sea. **The camera's far plane is 160 m**
       (`PerspectiveCamera(72, …, 0.08, 160)`), so a set parked past that
       from everything else cannot have anything of the world behind it —
       distance does the hiding, with no flags and nothing to remember to
       switch off. Camp 426 m away, jetty 461, parade 443; every piece of
       the ferry's own set is inside 155 m of the seat, and fog and the far
       plane are both measured from the CAMERA, so nothing else changes. */
    const FERRY = new THREE.Vector3(-70, 0, -420);
    const ferryRoot = new THREE.Group();
    ferryRoot.position.copy(FERRY);
    ferryRoot.visible = false;
    world.add(ferryRoot);
    const CAB = { hw: 1.82, h: 2.16, z0: -5.0, z1: 12.0 };
    const SEAT_X = [-1.32, -0.74, 0.74, 1.32];        // two, the aisle, two
    const SEAT_Z = [-3.4, -2.55, -1.7, -0.85, 0, 0.85, 1.7, 2.55, 3.4, 4.25, 5.1, 5.95, 6.8, 7.65];
    const PLAYER_SEAT = { x: 1.32, z: -0.85 };        // his window seat, on the +x side
    const CABL = CAB.z1 - CAB.z0, CABM = (CAB.z0 + CAB.z1) / 2;
    const FWIN = { sill: 0.86, head: 1.92, mid: 1.39 };      // v8.9: the ferry's window band, opened up (§3 below)
    /* ----------------------------------------------------- THE SEA (v8.9)
       Chad, on v7.9: "the ferry scene is too barebones and empty, sea does
       not look like sea." He was right, and the reason is structural rather
       than a matter of taste: v7.9's sea was a VERTICAL SHEET — one painted
       gradient with 220 white dashes on it, hung 16 m off each side of the
       cabin. A gradient standing up in front of a window has no perspective
       in it at all. Water recedes; a wall does not, so no amount of paint on
       that sheet could have made it read as water. Photographed on the phone
       crop at 13 s and 19 s it came out as a flat blue-green band with a few
       blurred dashes — the frames are in docs/V8.9-THE-SEA.md.

       So the sheet is gone and the sea is REAL GEOMETRY: a horizontal disc
       at the waterline under a sky dome. A horizontal plane gets its
       perspective for free — the same tile is metres across close to the
       hull and compresses to nothing at the horizon, which is exactly what
       makes water look like water — and it can then be SCROLLED, so the sea
       streams past a moving ferry instead of hanging there.

       Five layers, near to far:
         1. the hull side and its gunwale, so the water starts at a boat;
         2. the WAKE — a foam strip alongside, scrolling fastest (it is the
            nearest thing, so it carries most of the sense of speed);
         3. the WATER disc, a seamless crest tile repeated 80 times and
            scrolled slowly, with a second, larger, slower copy laid over it:
            two layers at different rates kill the tiling that one layer at
            this grazing angle always shows;
         4. the HAZE cylinder, which greys the far water into the sky — and
            also hides the disc's own rim, the trap the v7.7 ferry paid for
            once already (a sky bubble's back wall is a DEPTH surface, so
            everything must stand INSIDE its radius) — and every radius here
            is set by the CAMERA'S FAR PLANE of 160 m, not by taste: dome
            155, water 148, haze 136, shore 132, the furthest ship 128. The
            first pass used 420/400/388 and was simply CLIPPED, which put a
            hard edge across the sea at 160 m with the camp showing past it;
         5. the sky dome, the shore's tree line, and four ships out on it.
       Anisotropy is 8 on both water layers: a crown of leaves and a sheet of
       water are the same problem, all grazing angles (v6.16). */
    const SEA_Y = -2.45;                      // the waterline, under a saloon deck at 0
    const seaTex = paint(512, (ctx, S) => {
      ctx.fillStyle = '#2b5262'; ctx.fillRect(0, 0, S, S);
      /* every crest is drawn NINE times, at every wrap of the tile, so the
         texture is seamless by construction rather than by luck */
      const wrap = (fn) => { for (let ox = -1; ox <= 1; ox++) for (let oy = -1; oy <= 1; oy++) fn(ox * S, oy * S); };
      const crest = (i, k, wide, hi, alpha, col) => {
        const x = hash(i, k) * S, y = hash(i, k + 1) * S;
        const w = S * wide * (0.6 + hash(i, k + 2) * 0.8), h = w * hi;
        const a = (hash(i, k + 3) - 0.5) * 0.55;
        wrap((ox, oy) => {
          ctx.save(); ctx.translate(x + ox, y + oy); ctx.rotate(a);
          const g = ctx.createRadialGradient(0, 0, 0, 0, 0, w);
          g.addColorStop(0, `rgba(${col},${alpha})`); g.addColorStop(0.55, `rgba(${col},${alpha * 0.45})`);
          g.addColorStop(1, `rgba(${col},0)`);
          ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(0, 0, w, h, 0, 0, 7); ctx.fill(); ctx.restore();
        });
      };
      for (let i = 0; i < 70; i++) crest(i, 41, 0.20, 0.16, 0.22, '30,68,80');      // the troughs, darker
      for (let i = 0; i < 90; i++) crest(i, 51, 0.13, 0.13, 0.26, '130,163,171');   // the swell
      for (let i = 0; i < 120; i++) crest(i, 61, 0.055, 0.20, 0.26, '176,197,201'); // the chop on top of it
      for (let i = 0; i < 150; i++) {                                               // and the glint on a crest's edge
        const x = hash(i, 71) * S, y = hash(i, 72) * S;
        const w = S * (0.010 + hash(i, 73) * 0.030), h = Math.max(1.2, w * 0.16);
        wrap((ox, oy) => {
          ctx.fillStyle = `rgba(232,241,243,${0.08 + hash(i, 74) * 0.22})`;
          ctx.beginPath(); ctx.ellipse(x + ox, y + oy, w, h, (hash(i, 75) - 0.5) * 0.4, 0, 7); ctx.fill();
        });
      }
    }, [34, 34]);                        // 8.7 m of sea per tile; 80 was 3.7 and the near water read as carpet
    seaTex.anisotropy = 8;
    filmTex.push(seaTex);
    const seaTex2 = seaTex.clone();           // the same paint, laid over itself at a different scale and rate
    seaTex2.repeat.set(9, 9); seaTex2.anisotropy = 8; seaTex2.needsUpdate = true;   // 33 m — the long swell under the chop
    filmTex.push(seaTex2);
    const seaDisc = fmesh(ferryRoot, new THREE.CircleGeometry(148, 72),
      nbm({ map: seaTex, color: 0xa9bcbd }), 0, SEA_Y, 0, -Math.PI / 2);
    const seaDisc2 = fmesh(ferryRoot, new THREE.CircleGeometry(148, 72),
      nbm({ map: seaTex2, color: 0xc3cfcd, transparent: true, opacity: 0.38, depthWrite: false }), 0, SEA_Y + 0.02, 0, -Math.PI / 2);
    /* the wake: streaks that wrap, on a strip that starts where the hull
       ends. It scrolls four times faster than the sea, because it is four
       times closer — that difference IS the parallax the eye reads as way
       being made through water. */
    const foamTex = paint(256, (ctx, S) => {
      ctx.clearRect(0, 0, S, S);
      for (let i = 0; i < 170; i++) {
        const x = hash(i, 81) * S, y = hash(i, 82) * S;
        const w = S * (0.03 + hash(i, 83) * 0.20), h = 1 + hash(i, 84) * 4;
        for (let oy = -1; oy <= 1; oy++) {
          const g = ctx.createLinearGradient(x, 0, x + w, 0);
          g.addColorStop(0, 'rgba(255,255,255,0)');
          g.addColorStop(0.4, `rgba(255,255,255,${0.20 + hash(i, 85) * 0.55})`);
          g.addColorStop(1, 'rgba(255,255,255,0)');
          ctx.fillStyle = g; ctx.fillRect(x, y + oy * S, w, h);
        }
      }
      for (let i = 0; i < 900; i++) {                                  // the bubble field in the churn
        const x = hash(i, 91) * S, y = hash(i, 92) * S;
        ctx.fillStyle = `rgba(255,255,255,${0.05 + hash(i, 93) * 0.35})`;
        ctx.beginPath(); ctx.arc(x, y, 0.6 + hash(i, 94) * 1.9, 0, 7); ctx.fill();
      }
    }, [2, 14]);
    foamTex.anisotropy = 8;
    filmTex.push(foamTex);
    const wakes = [];
    for (const sgn of [-1, 1]) {
      /* densest against the hull and gone by 4 m out: the strip is drawn
         with its own falloff in the material's opacity rather than in the
         tile, so one painted tile serves both sides */
      wakes.push(fmesh(ferryRoot, new THREE.PlaneGeometry(4.2, 150),
        nbm({ map: foamTex, transparent: true, opacity: 0.62, depthWrite: false }),
        sgn * 4.2, SEA_Y + 0.05, 3.0, -Math.PI / 2));
    }
    /* the hull below the window band, and the gunwale that caps it — without
       them the water runs straight up to the cabin wall and the boat has no
       outside at all */
    /* THE GUNWALE MUST SIT UNDER THE SILL, and this is arithmetic rather
       than styling. The eye is 3.76 m over the water, so the sea it can see
       runs from the horizon down to whatever the boat's own side hides. The
       first pass capped the hull at y 1.12 — 0.19 m under the seated eye —
       and every ray steeper than **9.6 deg** then landed on the gunwale's
       deck instead of on water: a ten-degree strip of sea in a 72 deg lens,
       which is the flat blue band the frame came back with. Capped at 0.80,
       just under the new sill at 0.86, the same arithmetic gives **30.4 deg**
       of open water. Three times the sea, for one number. */
    const matHull = nbm({ color: 0xdfe4e8 });
    const matHullLow = nbm({ color: 0x2c4f74 });
    const HULL_TOP = 0.80;
    for (const sgn of [-1, 1]) {
      fbox(ferryRoot, 0.24, HULL_TOP + 1.10, CABL + 3.0, matHull, sgn * (CAB.hw + 0.16), (HULL_TOP - 1.10) / 2, CABM);
      fbox(ferryRoot, 0.30, 2.20, CABL + 3.0, matHullLow, sgn * (CAB.hw + 0.19), -1.45, CABM);
      fbox(ferryRoot, 0.30, 0.09, CABL + 3.2, matHull, sgn * (CAB.hw + 0.17), HULL_TOP - 0.045, CABM);   // the gunwale cap
      fbox(ferryRoot, 0.06, 0.05, CABL + 3.2, nbm({ color: 0x2c4f74 }), sgn * (CAB.hw + 0.31), HULL_TOP - 0.16, CABM);  // its rubbing strake
    }
    /* the sky: a painted morning, dome-wrapped, its horizon on the texture's
       equator and the dome centred at the SEATED EYE — which is where the
       horizon of a real sea always is, whatever the boat is doing */
    const skyTex = paint(1024, (ctx, S) => {
      /* PAINT A FILM SET AT HALF THE BRIGHTNESS YOU WANT ON SCREEN. The
         renderer is ACESFilmic at exposure 1.42, which scales linear
         radiance by 1.42/0.6 = 2.37 BEFORE the curve, and the curve then
         rolls everything bright toward white. Measured through the real
         transform: a sky painted #87b2d6 — a perfectly ordinary blue —
         arrives on screen as #d5eaf2, which is what the first pass of this
         build rendered and why the window looked out on a white void. The
         stops below are the INVERSE: #314c78 lands as a proper #4e8bc8.
         Nothing else in the set needed it, because everything else is dark
         (water, hull, tree line) and the curve is nearly linear down there. */
      const g = ctx.createLinearGradient(0, 0, 0, S * 0.5);
      g.addColorStop(0, '#314c78'); g.addColorStop(0.42, '#466891'); g.addColorStop(0.78, '#6e8a9c');
      g.addColorStop(1, '#8ca5a9');
      ctx.fillStyle = g; ctx.fillRect(0, 0, S, S * 0.5);
      ctx.fillStyle = '#7d9298'; ctx.fillRect(0, S * 0.5, S, S * 0.5);      // below the horizon, never seen
      /* clusters of soft puffs a third the size of one blob — v6.8's law,
         because a single big ellipse is 30 deg of sky and reads as a smear */
      for (let i = 0; i < 13; i++) {
        /* the band is 0.14–0.42 down the canvas, which on the dome is 65 deg
           of elevation down to 14 — the part of the sky a seated passenger
           can see out of a window. v8.9's first pass put them at 25–72 and
           the shot looked out at an empty white sky. */
        const cx = hash(i, 21) * S, cy = S * (0.14 + hash(i, 22) * 0.28), sc = 0.5 + hash(i, 23) * 1.1;
        for (let j = 0; j < 8; j++) {
          const dx = (hash(i * 13 + j, 24) - 0.5) * 150 * sc, dy = (hash(i * 13 + j, 25) - 0.5) * 34 * sc;
          const r = (8 + hash(i * 13 + j, 26) * 18) * sc;
          for (const ox of [-S, 0, S]) {
            const gg = ctx.createRadialGradient(cx + dx + ox, cy + dy, 0, cx + dx + ox, cy + dy, r);
            gg.addColorStop(0, `rgba(174,190,196,${0.16 + hash(i * 13 + j, 27) * 0.28})`);
            gg.addColorStop(1, 'rgba(174,190,196,0)');
            ctx.fillStyle = gg; ctx.beginPath(); ctx.arc(cx + dx + ox, cy + dy, r, 0, 7); ctx.fill();
          }
        }
      }
      const hz = ctx.createLinearGradient(0, S * 0.40, 0, S * 0.5);        // the haze the horizon sits in
      hz.addColorStop(0, 'rgba(150,168,170,0)'); hz.addColorStop(1, 'rgba(150,168,170,0.92)');
      ctx.fillStyle = hz; ctx.fillRect(0, S * 0.40, S, S * 0.10);
    });
    filmTex.push(skyTex);
    fmesh(ferryRoot, new THREE.SphereGeometry(155, 40, 24), nbm({ map: skyTex, side: THREE.BackSide }), 0, 1.30, 0);
    /* Tekong ahead: a tree line on the water, drawn rather than modelled —
       at 388 m one tree is under a pixel, and what reads is the SILHOUETTE */
    /* the cylinder is 24 m tall with its base 12 m under its centre, so its
       waterline is SEA_Y and one unit of v is 24 m at 132 m out. The shore
       is painted against that: the strand at v 0.10 (2.4 m over the water)
       and the canopy to v 0.36 (8.6 m), which at this range is 3.7 deg of
       tree above 1.0 of beach — an island seen from a boat's saloon deck. */
    const shoreTex = paint(1024, (ctx, S) => {
      ctx.clearRect(0, 0, S, S);
      const base = S * 0.90;                        // v 0.10, the waterline of the island
      for (let i = 0; i < 620; i++) {               // the canopy, clumped, never a single silhouette
        const x = hash(i, 31) * S, h = S * (0.09 + hash(i, 32) * 0.17), w = S * (0.007 + hash(i, 33) * 0.016);
        ctx.fillStyle = `rgba(${34 + hash(i, 34) * 22},${52 + hash(i, 35) * 26},${40 + hash(i, 36) * 18},0.92)`;
        ctx.beginPath(); ctx.ellipse(x, base - h * 0.5, w, h * 0.60, 0, 0, 7); ctx.fill();
      }
      ctx.fillStyle = 'rgba(38,50,44,0.95)'; ctx.fillRect(0, base - S * 0.012, S, S * 0.020);  // the tree line's own mass
      ctx.fillStyle = 'rgba(208,212,196,0.80)'; ctx.fillRect(0, base + S * 0.008, S, S * 0.007);  // and its beach
      const hz = ctx.createLinearGradient(0, S * 0.58, 0, base + S * 0.016);
      hz.addColorStop(0, 'rgba(150,166,166,0.12)'); hz.addColorStop(1, 'rgba(150,166,166,0.46)');
      ctx.fillStyle = hz; ctx.fillRect(0, S * 0.58, S, base + S * 0.016 - S * 0.58);   // distance, painted on
    }, [6, 1]);
    filmTex.push(shoreTex);
    fmesh(ferryRoot, new THREE.CylinderGeometry(132, 132, 24, 64, 1, true),
      nbm({ map: shoreTex, side: THREE.BackSide, transparent: true, depthWrite: false }), 0, SEA_Y + 12, 0);
    /* and the haze that takes the far water into it, which is also what
         hides the disc's own rim */
    const hazeTex = paint(64, (ctx, S) => {
      const g = ctx.createLinearGradient(0, S, 0, 0);
      g.addColorStop(0, 'rgba(147,165,165,1)'); g.addColorStop(0.30, 'rgba(147,165,165,0.62)');
      g.addColorStop(1, 'rgba(147,165,165,0)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, S, S);
    });
    filmTex.push(hazeTex);
    fmesh(ferryRoot, new THREE.CylinderGeometry(136, 136, 30, 48, 1, true),
      nbm({ map: hazeTex, side: THREE.BackSide, transparent: true, depthWrite: false }), 0, SEA_Y + 13, 0);
    /* four ships on it. A tanker at three hundred metres is a dark bar with
       a block on one end — anything more is detail nobody can resolve. */
    const matShip = nbm({ color: 0x38434c }), matShipTop = nbm({ color: 0xb8bfc4});
    for (const sh of [[116, 0.55, 0.42], [92, 1.25, 0.26], [128, -0.35, 0.50], [104, 2.30, 0.34]]) {
      const [d, ang, sc] = sh;
      const g = new THREE.Group();
      g.position.set(Math.sin(ang) * d, SEA_Y + 1.2 * sc, Math.cos(ang) * d);
      g.rotation.y = ang + 1.3;
      ferryRoot.add(g);
      fbox(g, 74 * sc, 7 * sc, 12 * sc, matShip, 0, 0, 0);
      fbox(g, 13 * sc, 11 * sc, 11 * sc, matShipTop, -26 * sc, 8 * sc, 0);
      fbox(g, 2.0 * sc, 9 * sc, 2.0 * sc, matShipTop, -26 * sc, 17 * sc, 0);
    }
    /* the cabin: a dark blue carpet, cream walls with a window band, a white
       ribbed ceiling with the long light box down the middle, chrome poles */
    /* v8.9: the cabin was FLAT — every surface one untextured colour, which
       on the phone crop read as a white corridor with blue boxes in it
       (Chad: "too barebones and empty"). Two painted tiles fix most of it:
       a speckled carpet and a woven seat cloth, both greyscale so one tile
       serves every colour the cabin uses through the material's own tint. */
    const carpetTex = paint(256, (ctx, S) => {
      ctx.fillStyle = '#d8d8dc'; ctx.fillRect(0, 0, S, S);
      for (let i = 0; i < 5200; i++) {
        const v = 170 + hash(i, 101) * 85;
        ctx.fillStyle = `rgba(${v},${v},${v + 4},${0.25 + hash(i, 102) * 0.5})`;
        ctx.fillRect(hash(i, 103) * S, hash(i, 104) * S, 1 + hash(i, 105) * 2, 1 + hash(i, 106) * 2);
      }
    }, [10, 34]);
    filmTex.push(carpetTex);
    const clothTex = paint(128, (ctx, S) => {
      /* NEAR-WHITE on purpose: a map multiplies the material's colour, so a
         mid-grey weave took the seats' blue down to a third of itself and the
         first render came back with black seats. The weave is in the alpha of
         the strokes, not in the base. */
      ctx.fillStyle = '#ececec'; ctx.fillRect(0, 0, S, S);
      for (let y = 0; y < S; y += 3) { ctx.fillStyle = 'rgba(255,255,255,0.55)'; ctx.fillRect(0, y, S, 1); }
      for (let x = 0; x < S; x += 3) { ctx.fillStyle = 'rgba(0,0,0,0.10)'; ctx.fillRect(x, 0, 1, S); }
      for (let i = 0; i < 1800; i++) {
        const v = 190 + hash(i, 111) * 60;
        ctx.fillStyle = `rgba(${v},${v},${v},0.45)`;
        ctx.fillRect(hash(i, 112) * S, hash(i, 113) * S, 1, 1);
      }
    }, [3, 3]);
    filmTex.push(clothTex);
    const matCarpet = nfm({ map: carpetTex, color: 0x2f3b60, roughness: 1 });
    const matPanel = nfm({ color: 0xc9d1d6, roughness: 0.75 });   // v8.9: see the tone-mapping note under skyTex
    const matRib = nfm({ color: 0xd6dcde, roughness: 0.6 });
    const matChrome = nfm({ color: 0xc8ced4, roughness: 0.25, metalness: 0.85 });
    const matPane = nbm({ color: 0xffffff, transparent: true, opacity: 0.10 });
    const matLight = nbm({ color: 0xfff4dc });
    fmesh(ferryRoot, new THREE.PlaneGeometry(CAB.hw * 2, CABL), matCarpet, 0, 0.01, CABM, -Math.PI / 2);
    fmesh(ferryRoot, new THREE.PlaneGeometry(CAB.hw * 2, CABL), matRib, 0, CAB.h, CABM, Math.PI / 2);
    for (let z = CAB.z0 + 0.5; z < CAB.z1; z += 0.6)                     // the ceiling's ribs
      fbox(ferryRoot, CAB.hw * 2, 0.03, 0.06, matPanel, 0, CAB.h - 0.02, z);
    fbox(ferryRoot, 0.92, 0.16, CABL - 1.6, matLight, 0, CAB.h - 0.10, CABM);
    for (const sgn of [-1, 1]) {
      /* the aperture: sill 0.86, head 1.92, 1.06 m of glass. v7.9 had 0.64
         between 1.06 and 1.70 — a letterbox, and the reason its window shot
         showed a strip. From the seated eye 0.64 m away this subtends 83 deg
         against a 72 deg lens, so the contemplative shot is ALL window. */
      fbox(ferryRoot, 0.10, FWIN.sill, CABL, matPanel, sgn * CAB.hw, FWIN.sill / 2, CABM);          // under the windows
      fbox(ferryRoot, 0.10, CAB.h - FWIN.head, CABL, matPanel, sgn * CAB.hw, (CAB.h + FWIN.head) / 2, CABM);   // over them
      fmesh(ferryRoot, new THREE.PlaneGeometry(CABL, FWIN.head - FWIN.sill), matPane, sgn * (CAB.hw - 0.05), FWIN.mid, CABM, 0, sgn > 0 ? -Math.PI / 2 : Math.PI / 2);
      fbox(ferryRoot, 0.16, 0.05, CABL, matPanel, sgn * (CAB.hw - 0.04), FWIN.sill + 0.02, CABM);  // the sill's own ledge
      for (let z = CAB.z0 + 1.7; z < CAB.z1; z += 1.7)                                // the mullions between the panes
        fbox(ferryRoot, 0.12, FWIN.head - FWIN.sill + 0.02, 0.09, matPanel, sgn * (CAB.hw - 0.01), FWIN.mid, z);
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
    const matSeatA = nfm({ map: clothTex, color: 0x4a70b4, roughness: 0.9 }),
          matSeatB = nfm({ map: clothTex, color: 0x389099, roughness: 0.9 });
    const matHead = nfm({ map: clothTex, color: 0xd8dde2, roughness: 0.92 });     // the antimacassar every ferry seat has
    const ferrySeats = [];
    SEAT_Z.forEach((z, r) => SEAT_X.forEach((x, i) => {
      const m = ((r + i) % 3 === 0) ? matSeatB : matSeatA;
      const g = new THREE.Group(); g.position.set(x, 0, z); ferryRoot.add(g);
      fmesh(g, seatGeo.pan, m, 0, 0.43, 0);
      fmesh(g, seatGeo.back, m, 0, 0.73, -0.20, -0.12);
      fmesh(g, seatGeo.head, m, 0, 1.06, -0.24, -0.12);
      /* the antimacassar is a THIN band on the crown, not the whole headrest:
         made pale all over, the seat in front of the lens filled the 9 s shot
         with a grey slab, because at a 1.31 m eye a headrest at 1.06 is what
         the camera is looking at. */
      fmesh(g, new THREE.BoxGeometry(0.47, 0.05, 0.14), matHead, 0, 1.135, -0.245, -0.12);
      for (const dx of [-0.19, 0.19]) fmesh(g, seatGeo.leg, matChrome, dx, 0.21, 0.05);
      ferrySeats.push(g);
    }));
    /* ------------------------------------- and the things IN a ferry cabin
       The shot is twenty seconds long and the eye has nothing to do in it
       but read the room, so the room has to have something to read. Nothing
       here is a model: it is all boxes, tubes and one painted notice, and
       all of it stands still, so it costs one pass of geometry that v8.4's
       culling drops the moment the lens turns away. */
    {
      /* NOT `matChrome`: a metal with no environment map has nothing to
         reflect and renders near black, which is what the first pass's grab
         rails did. A light dielectric reads as brushed steel here. */
      const matGrab = nfm({ color: 0xb9c0c6, roughness: 0.35, metalness: 0.12 });
      const matShelf = nfm({ color: 0xc8d0d4, roughness: 0.7 });
      const matRing = nbm({ color: 0xe8631f }), matRingW = nbm({ color: 0xf2f2ef });
      const matBag = nfm({ map: clothTex, color: 0x3d4a3a, roughness: 1 });
      const matRed = nfm({ color: 0xb32d22, roughness: 0.6 });
      const matDark = nfm({ color: 0x2e3742, roughness: 0.8 });
      /* a grab rail across the top of every row — what a standing passenger
         holds, and what makes a row of seats read as a row rather than a
         stack of boxes */
      const railGeo = new THREE.CylinderGeometry(0.018, 0.018, 1.18, 8);
      for (const z of SEAT_Z) for (const sgn of [-1, 1])
        fmesh(ferryRoot, railGeo, matGrab, sgn * 1.03, 1.17, z - 0.245, 0, 0, Math.PI / 2);
      /* the parcel shelf over the windows, both sides, with its lip */
      for (const sgn of [-1, 1]) {
        fbox(ferryRoot, 0.40, 0.04, CABL - 0.4, matShelf, sgn * (CAB.hw - 0.22), 1.99, CABM);
        fmesh(ferryRoot, new THREE.CylinderGeometry(0.014, 0.014, CABL - 0.4, 8), matGrab,
              sgn * (CAB.hw - 0.42), 2.06, CABM, Math.PI / 2, 0, 0);
        for (const zz of [-3.0, 0.6, 4.2, 7.4])                       // the bags people put up there
          fbox(ferryRoot, 0.30, 0.20, 0.46, matBag, sgn * (CAB.hw - 0.24), 2.11, zz);
        fbox(ferryRoot, 0.08, 0.16, CABL, nfm({ color: 0x59626b, roughness: 0.8 }), sgn * (CAB.hw - 0.03), 0.08, CABM);  // skirting
      }
      /* the forward bulkhead: two life rings, a notice, a muster sign */
      const ringGeo = new THREE.TorusGeometry(0.29, 0.075, 8, 22);
      for (const dx of [-1.16, 1.16]) {
        fmesh(ferryRoot, ringGeo, matRing, dx, 1.42, CAB.z1 - 0.12);
        for (let k = 0; k < 4; k++)                                   // its white quarters
          fmesh(ferryRoot, new THREE.TorusGeometry(0.29, 0.078, 8, 4, 0.52), matRingW, dx, 1.42, CAB.z1 - 0.12, 0, 0, k * Math.PI / 2 + 0.26);
      }
      const noticeTex = paint(512, (ctx, S) => {
        ctx.fillStyle = '#f2f3ee'; ctx.fillRect(0, 0, S, S);
        ctx.strokeStyle = '#22303c'; ctx.lineWidth = 7; ctx.strokeRect(10, 10, S - 20, S - 20);
        ctx.fillStyle = '#22303c'; ctx.textAlign = 'center';
        ctx.font = 'bold 62px sans-serif'; ctx.fillText('PASSENGERS', S / 2, 118);
        ctx.font = 'bold 150px sans-serif'; ctx.fillText('56', S / 2, 268);
        ctx.font = 'bold 44px sans-serif'; ctx.fillText('NO SMOKING', S / 2, 350);
        ctx.fillStyle = '#8d1f17';
        ctx.beginPath(); ctx.arc(S / 2, 420, 44, 0, 7); ctx.fill();
        ctx.fillStyle = '#f2f3ee'; ctx.fillRect(S / 2 - 30, 412, 60, 16);
      });
      filmTex.push(noticeTex);
      fmesh(ferryRoot, new THREE.PlaneGeometry(0.52, 0.52), nbm({ map: noticeTex }), 0, 1.48, CAB.z1 - 0.07, 0, Math.PI, 0);
      fbox(ferryRoot, 0.60, 0.18, 0.06, nbm({ color: 0x2c8b45 }), 0, 1.98, CAB.z1 - 0.10);   // the muster sign over it
      fbox(ferryRoot, 0.16, 0.40, 0.16, matRed, -1.60, 0.30, CAB.z1 - 0.18);                 // an extinguisher in the corner
      fbox(ferryRoot, 0.30, 0.70, 0.16, nbm({ color: 0xf0efe6 }), 1.58, 1.30, CAB.z1 - 0.14); // and a life-jacket locker
      fbox(ferryRoot, 0.60, 0.16, 0.06, nbm({ color: 0x2c8b45 }), 0, 1.98, CAB.z0 + 0.10);   // EXIT, behind him
      /* kit on the floor, because twenty recruits do not travel empty-handed */
      for (const [bx, bz, r] of [[-0.05, -2.2, 0.4], [0.06, 1.1, -0.9], [-0.02, 4.6, 0.2],
                                 [0.02, 6.9, 1.1], [-0.04, -4.2, -0.5]])
        fbox(ferryRoot, 0.34, 0.40, 0.52, matBag, bx, 0.20, bz, r);
      for (const [bx, bz] of [[-1.32, 2.55], [1.32, 5.95], [-0.74, -3.4]])   // and some on the spare seats
        fbox(ferryRoot, 0.30, 0.34, 0.42, matDark, bx, 0.63, bz, 0.3);
    }
    const ferryLight = new THREE.PointLight(0xfff2e0, 8, 26, 1.2); ferryLight.position.set(0, 2.0, 1.0); ferryRoot.add(ferryLight);
    const ferrySun = new THREE.PointLight(0xdfeaf6, 11, 30, 1.1); ferrySun.position.set(3.2, 1.5, 2.0); ferryRoot.add(ferrySun);
    let swellT = 0;
    const ferryTick = (dt) => {                     // the cabin breathing on a slow swell
      swellT += dt;
      ferryRoot.rotation.z = Math.sin(swellT * 0.62) * 0.008;
      ferryRoot.rotation.x = Math.sin(swellT * 0.83 + 1) * 0.005;
      ferryRoot.position.y = FERRY.y + Math.sin(swellT * 0.9) * 0.03;
      /* AND THE SEA RUNS. The ferry makes way in +z, so the water has to
         stream in −z relative to it. The plane is laid down with `rotation.x
         = −PI/2`, which maps the texture's +v onto world −z; raising
         `offset.y` samples further along +v, which slides the PATTERN the
         other way, toward +z. So the offsets go DOWN.
         Three rates, and the ratios are the point rather than the numbers:
         the wake is the nearest thing in frame and runs fastest, the fine
         sea layer next, the broad one slowest. Two layers moving at
         different speeds is also what breaks up the tiling that any single
         repeated sheet shows at this grazing an angle. */
      seaTex.offset.y -= dt * 0.085;
      seaTex2.offset.y -= dt * 0.026;
      foamTex.offset.y -= dt * 0.55;
      foamTex.offset.x = Math.sin(swellT * 0.4) * 0.03;
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
    /* THE GROUND (v8.9). Chad: "parade square ground should be like a
       ccarpark ground." It was one flat cream colour with three thin white
       lines on it, and on the phone crop it read as a white void the block
       and the ranks were standing in — the frame is in docs/V8.9-THE-SEA.md.
       A Tekong square IS a car park most of the week, so it gets what one
       has: asphalt with its aggregate, worn patches and joints, and a grid
       of painted bays over the half of it the camera pans across.
       Painted at HALF the brightness it should read at, like the sky — the
       renderer is ACES at exposure 1.42 (see the note under `skyTex`). */
    const sqTex = paint(512, (ctx, S) => {
      ctx.fillStyle = '#3c3e40'; ctx.fillRect(0, 0, S, S);
      for (let i = 0; i < 9000; i++) {                       // the aggregate
        const v = 42 + hash(i, 201) * 46;
        ctx.fillStyle = `rgba(${v},${v},${v + 3},${0.3 + hash(i, 202) * 0.6})`;
        ctx.fillRect(hash(i, 203) * S, hash(i, 204) * S, 1 + hash(i, 205) * 2, 1 + hash(i, 206) * 2);
      }
      for (let i = 0; i < 26; i++) {                         // patches, wrapped so the tile stays seamless
        const x = hash(i, 211) * S, y = hash(i, 212) * S, r = S * (0.04 + hash(i, 213) * 0.13);
        for (let ox = -1; ox <= 1; ox++) for (let oy = -1; oy <= 1; oy++) {
          const g = ctx.createRadialGradient(x + ox * S, y + oy * S, 0, x + ox * S, y + oy * S, r);
          const k = hash(i, 214) > 0.5 ? '86,88,88' : '50,52,53';
          g.addColorStop(0, `rgba(${k},${0.10 + hash(i, 215) * 0.16})`); g.addColorStop(1, `rgba(${k},0)`);
          ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x + ox * S, y + oy * S, r, 0, 7); ctx.fill();
        }
      }
      ctx.strokeStyle = 'rgba(30,31,32,0.55)'; ctx.lineWidth = 2;   // the seal joints, on the tile's own edges
      ctx.beginPath(); ctx.moveTo(0, 1); ctx.lineTo(S, 1); ctx.moveTo(1, 0); ctx.lineTo(1, S); ctx.stroke();
    }, [26, 21]);                                            // one tile ≈ 11.5 m of tarmac
    sqTex.anisotropy = 8;
    filmTex.push(sqTex);
    const matSq = nfm({ map: sqTex, color: 0xb9bdbd, roughness: 0.95 });
    const matCream = nfm({ color: 0xe9e0cc, roughness: 0.9 });
    const matOchre = nfm({ color: 0xd79a52, roughness: 0.9 });
    const matWin = nfm({ color: 0x2a3a44, roughness: 0.35, metalness: 0.3 });
    fmesh(paradeRoot, new THREE.PlaneGeometry(300, 240), matSq, 0, 0.01, 30, -Math.PI / 2);
    for (const lx of [-18, 0, 18]) fmesh(paradeRoot, new THREE.PlaneGeometry(0.12, 50), matWhite, lx, 0.02, 0, -Math.PI / 2);
    /* THE BAYS. Standard marking: a 2.5 m bay, 5.0 m deep, back-to-back in
       pairs with a 6.0 m aisle between pairs — a 16 m module, laid out from
       z −46 forward so the rows fall BEHIND and BESIDE the ranks rather than
       under them. One InstancedMesh for the whole grid (392 dividers and 8
       head lines), so a car park's worth of paint is ONE draw call; the
       lines are geometry rather than paint in the tile because a 10 cm
       stripe on an 11.5 m tile is two texels and would alias to nothing. */
    {
      const BAY_W = 2.5, BAY_D = 5.0, MOD = 16.0, X0 = -60, X1 = 60;
      const rows = [];                                   // [z of the bay's open end, direction]
      for (let m = 0; m < 4; m++) { const base = -46 + m * MOD; rows.push(base + BAY_D, base + BAY_D); }
      const divs = [];                                   // { x, z, len, horiz }
      for (let m = 0; m < 4; m++) {
        const base = -46 + m * MOD;
        for (const [z0, z1] of [[base, base + BAY_D], [base + BAY_D, base + 2 * BAY_D]]) {
          for (let x = X0; x <= X1 + 0.01; x += BAY_W) divs.push({ x, z: (z0 + z1) / 2, len: BAY_D, horiz: false });
          divs.push({ x: (X0 + X1) / 2, z: z1, len: X1 - X0, horiz: true });
        }
      }
      const bayGeo = new THREE.PlaneGeometry(1, 1);
      const bays = new THREE.InstancedMesh(bayGeo, nbm({ color: 0x8e8f88 }), divs.length);
      const mtx = new THREE.Matrix4(), q = new THREE.Quaternion()
        .setFromEuler(new THREE.Euler(-Math.PI / 2, 0, 0));
      const sc = new THREE.Vector3(), pos = new THREE.Vector3();
      divs.forEach((d, i) => {
        sc.set(d.horiz ? d.len : 0.11, d.horiz ? 0.11 : d.len, 1);
        pos.set(d.x, 0.02, d.z);
        mtx.compose(pos, q, sc);
        bays.setMatrixAt(i, mtx);
      });
      bays.instanceMatrix.needsUpdate = true;
      bays.frustumCulled = false;            // one object spanning 120 m; its own sphere is fine but this costs nothing
      paradeRoot.add(bays);
    }
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
    /* ---- v8.4: CULLING BACK ON, WITH BOUNDS THAT COVER THE ANIMATION ----

       Every skinned mesh in this chapter carried `frustumCulled = false`
       from v7.1, so all ten characters were submitted on EVERY frame
       whichever way the player faced. Measured on the shipped build at
       eight headings from his bed: a mean of 16% of the character
       triangles were actually on screen, so 84% of 475,210 triangles a
       frame — the chapter's single biggest cost, and the reason the phone
       cooks (661k tris a frame against chapter 1's 251k).

       The flag was hiding a real hazard rather than being lazy. three.js
       culls a skinned mesh by a bounding sphere, and `SkinnedMesh` carries
       its OWN `boundingSphere` which `Frustum.intersectsObject` prefers —
       computed ONCE, from whatever pose the man happens to be in at that
       first test, and then cached for ever. A push-up, a walk cycle or an
       arm swing then reaches outside it and the man BLINKS OUT at the edge
       of the screen. Setting only `geometry.boundingSphere` would not help:
       the object's own takes precedence.

       So the sphere is MEASURED, exhaustively and offline:
       `tools/clipbounds.mjs` loads each rig, plays every clip it owns,
       steps it across the whole length and skins the vertices at each
       step, reporting the sphere that contains every pose of every clip
       plus the bind pose. Those are the numbers below, each in ITS OWN
       FILE'S UNITS — `sleepanim` arrives through Mixamo's FBX path at
       x100, so its sphere is in centimetres, which is correct because
       three.js scales the sphere by the mesh's own matrixWorld.

       Measured, animated radius against what the bind pose alone claims:
         admintee 1.376 (bind 1.008, 1.36x)   fbosling 1.379 (1.052, 1.31x)
         encik2   1.253 (bind 1.034, 1.21x)   botak    1.176 (1.026, 1.15x)
         ghostsoldier 1.045 (bind 1.053)      sleepanim 130.851 (cm)

       MARGIN is deliberately generous. A bigger sphere culls very slightly
       less often — at six metres the difference is negligible — while a
       sphere a centimetre too small is a man vanishing in front of the
       player. It covers the vertex stride the tool samples at and any
       crossfade between two takes landing a hair outside both.            */
    const CULL_SPHERE = {
      admintee:     { x: 0.067, y: 0.870, z: 0.011, r: 1.376 },
      fbosling:     { x: 0.056, y: 0.837, z: 0.212, r: 1.379 },
      botak:        { x: 0.003, y: 0.858, z: -0.050, r: 1.176 },
      encik2:       { x: 0.015, y: 0.832, z: -0.037, r: 1.253 },
      ghostsoldier: { x: 0.001, y: 0.850, z: -0.010, r: 1.045 },
      sleepanim:    { x: 0.582, y: 85.062, z: 19.032, r: 130.851 },
    };
    const CULL_MARGIN = 1.25;
    /* A rigid mesh needs no table: its geometry sphere is already right and
       its node transform carries it. Only a SKINNED one has to be told. */
    function wideBounds(root, key) {
      const d = CULL_SPHERE[key];
      root.traverse(o => {
        if (!o.isMesh) return;
        o.frustumCulled = true;
        if (!d || !o.isSkinnedMesh) return;
        const sp = new THREE.Sphere(new THREE.Vector3(d.x, d.y, d.z), d.r * CULL_MARGIN);
        o.boundingSphere = sp.clone();            // the one the renderer reads
        if (o.geometry) o.geometry.boundingSphere = sp.clone();
      });
    }

    function mkCrowd(key, spots, clip, opts = {}) {
      const c = { group: new THREE.Group(), rigs: [], ready: false, key };
      (opts.parent || world).add(c.group);
      assetBytes(key).then(BUF => new GLTFLoader().parse(BUF, '', (gltf) => {
        if (!alive) return;
        rescueTextures(gltf, BUF);
        gltf.scene.traverse(o => { if (o.isMesh) { o.castShadow = false; o.receiveShadow = false; } });
        wideBounds(gltf.scene, key);              // v8.4: cull by the widest pose
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
          wideBounds(m, key);                     // v8.4: the copy gets it too
          g.add(m); c.group.add(g);
          const mixer = new THREE.AnimationMixer(m);
          const cl = gltf.animations.find(a => a.name === (sp.clip || clip)) || gltf.animations[0];
          const act = mixer.clipAction(cl);
          act.play();
          const parkAt = sp.at !== undefined ? sp.at : opts.at;
          if (parkAt !== undefined) { act.time = cl.duration * parkAt; act.paused = true; }
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
          /* v8.2: a copy could only ever hold the ONE action it was built
             with, which is why v8.1 said the six bunk recruits must stand:
             a man parked on a take has nothing to switch to. The clips and
             the built action are kept now, so `crowdPlay` can put the whole
             crowd on a different take and back — which is what lets them
             RUN out to the fall-in rather than be teleported to it. */
          c.rigs.push({ g, m, mixer, act, rest: act, dur: cl.duration, parkAt, acts: { [cl.name]: act } });
        });
        c.clips = gltf.animations;
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
    /* v8.2: put every copy of a crowd on a named take, or (name null) back on
       the one it was built with — the parked frame and the pause included, so
       the botak row returns to exactly the standing frame it holds. */
    function crowdPlay(c, name, fade = 0.25) {
      if (!c || !c.ready) return;
      for (const r of c.rigs) {
        let want = r.rest;
        if (name) {
          want = r.acts[name];
          if (!want) {
            const cl = (c.clips || []).find(a => a.name === name);
            if (!cl) continue;
            want = r.acts[name] = r.mixer.clipAction(cl);
          }
        }
        if (want === r.act) { want.paused = false; continue; }
        want.reset(); want.paused = false; want.enabled = true;
        want.setEffectiveWeight(1).fadeIn(fade).play();
        r.act.fadeOut(fade);
        r.act = want;
        /* the rest take may be a PARKED frame; put it back on its frame and
           stop it again once the fade has had its time */
        if (!name && r.parkAt !== undefined) setTimeout(() => {
          if (r.act === r.rest) { r.rest.time = r.dur * r.parkAt; r.rest.paused = true; }
        }, fade * 1000 + 40);
      }
    }
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
          o.castShadow = !LOW; o.receiveShadow = false;
          if (opts.tint) {
            const mats = Array.isArray(o.material) ? o.material : [o.material];
            for (const m of mats) { if (m.color) m.color.multiply(opts.tint); }
          }
        });
        wideBounds(g, key);                       // v8.4: cull by the widest pose
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
    /* THE BUNKMATE IS A RECRUIT, so he wears what a recruit wears (Chad,
       v8.3: "bunkmate is green admin tshirt not the fbo one"). He was the FBO
       without a rifle from v7.5, which put a man in full battle order —
       helmet, vest, field pack — standing about his own bunk at ten to ten at
       night; the sergeant wears it because he is on duty, and the bunkmate is
       not. The admin tee also carries `idle_to_push_up` / `push_up` /
       `push_up_to_idle` as its OWN takes, which is what lets him drop with
       the rest of the section (v8.3's punishment beat) — the FBO has no
       push-up take at all, and a retarget was measured and thrown away:
       `tools/retarget.mjs` carries rotations, not the hips' translation, so
       he would have done press-ups standing upright in mid-air.
       v7.9 (Chad): "The other sergeant should not be looking at the notice
       board." He stood at PI, nose to the board; he faces the room now,
       aimed at the same point the sergeant is. He also moved 0.8 m along
       the wall: at x 1.75 the two of them overlapped in the film's own
       shot of the pair (rendered at 52 s), one half behind the other. */
    const bunkmate = mkRig('admintee', { x: 2.55, z: -3.05, ry: -0.32, height: 1.70, idle: 'Idle_9' });
    /* v8.2 (Chad): "and also in the bunk alongside with the 2 soldiers in
       FBO, and also for the fall in. He will be used regularly throughout
       this entire episode." He stands on the other side of the entrance from
       the sergeant, facing down the room — clear of the notice board (x 2.0),
       the centre table (x ±1.80 at z 2.55, the far half) and both bed rows
       (|x| 3.65 and out). His own `Idle_9` is the rest take; his talk take is
       `Talk_with_Left_Hand_on_Hip`, which no other rig in the chapter has. */
    const ENC_DOOR = { x: -1.5, z: -3.05, ry: 0.16 };
    const ENC_LINE = { x: SQ.enc, z: -0.9, ry: -Math.PI / 2,            // v9.2: in front of the rank, beside the sergeant
                       via: [{ x: 9.6, z: -6.4 }, { x: SQ.enc, z: -6.4 }] };
    const encik = mkRig('encik2', { x: ENC_DOOR.x, z: ENC_DOOR.z, ry: ENC_DOOR.ry, height: 1.72, idle: 'Idle_9' });
    /* v8.2: he has TWO talking takes and uses both, alternating line by line —
       he is the one man in this episode who will do most of the talking, and a
       character who gestures the same way every time he opens his mouth reads
       as a loop rather than a person. Reset with the run so a replay tells it
       the same way. */
    const ENC_TALK = ['Talk_with_Left_Hand_on_Hip', 'Talk_with_Left_Hand_Raised'];
    let encTalkN = 0;
    const encSay = (name) => castSay(encik, name, ENC_TALK[encTalkN++ % ENC_TALK.length], 'Idle_9');
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

       They STAND, all six, which at v8.1 was a constraint — `mkCrowd` gave a
       copy ONE action, so there was nothing to switch a man to. v8.2's
       `crowdPlay` lifted that (they run out to the fall-in now) and v8.3
       spends it: the whole section drops for push-ups on one order.

       ONE model, the admin tee on its own `Idle_9`. `mkCrowd` seeds a
       looping idle at its own phase per copy, so six men do not breathe in
       step. Nothing new is downloaded: the file is already in this chapter.

       x = ±3.25 is the foot of the bed and 0.26 m clear of the blocker
       column `solid()` puts round the mattress (±3.51), so a recruit stands
       where the player can see him without standing in the walking lane;
       `walktest` is unchanged by them, since a rig is not a blocker.

       v8.9 (Chad: "why there are missing bunkmates now?"). Two of them
       carried `low: false` and a `.filter(m => !LOW || m.low)` dropped them
       on every PHONE — which is the only device he plays on, so the bunk he
       saw had four men in it and two made beds nobody owned. The filter is
       gone. It was written at v8.1 when a rig in this chapter was never
       culled at all; v8.4 gave every rig a real `CULL_SPHERE` covering every
       pose of every clip it can play, so a man the lens is NOT pointed at
       now costs nothing at all. Priced, rather than assumed: one of them in
       shot is 44,539 triangles, and the bunk looking straight down the −x
       bed row with all six built peaks at **255,161** — under the 297,872
       v8.6 already left this chapter at. The room did not get dearer than
       its own worst frame; it only stopped being half empty.

       v8.9, second half (Chad: "there are also 2 bunkmates facing the wrong
       way different from everyone else"). He was reading the room correctly:
       every other man in it turns toward the aisle, and the pair at z −3.00
       and −1.50 faced each OTHER along the room — v8.1's "conversation, told
       by where they stand". Measured on the shipped build, their world
       forward was (0.13, 1.04) and (0.15, −1.04) against the aisle-facing
       (±1.02, ~0.2) of the other four. The conversation survives as a LEAN:
       both are on the aisle now, each canted 0.35 rad toward the other, so
       they read as two men talking rather than as two men who have been
       stood the wrong way round. */
    /* v9.2: `line` is each man's place in the SINGLE RANK on the square, and
       the eight slots are dealt in the order the men STAND IN THE BUNK — the
       v8.2 law, which is what keeps two paths from crossing. Sorted by z the
       eight are: bunkmate −3.05, [0] −3.00, [3] −2.20, [1] −1.50, [2] 0.00,
       buddy 1.15, [4] 2.20, [5] 3.35 — so the slots run −4.2 … +4.2 in that
       order and the whole section fans out of one doorway without a swap. */
    const BUNK_MEN = [
      { x: -3.25, z: -3.00, ry: Math.PI / 2 - 0.35, kind: 'admintee', line: -3.0 },
      { x: -3.25, z: -1.50, ry: Math.PI / 2 + 0.35, kind: 'admintee', line: -0.6 },
      { x: -3.25, z:  0.00, ry: 1.35,               kind: 'admintee', line:  0.6 },
      { x:  3.25, z: -2.20, ry: -1.32,              kind: 'admintee', line: -1.8 },
      { x:  3.25, z:  2.20, ry: -1.78,              kind: 'admintee', line:  3.0 },
      { x:  3.25, z:  3.35, ry: -2.15,              kind: 'admintee', line:  4.2 },
    ];
    /* ONE MODEL, the green admin tee (Chad, v8.3: "i want all the bunkmates
       to be the same green admin tshirt one, not the blue botak one"). It is
       also what makes the punishment beat possible: the tee is the only rig
       in the chapter carrying `idle_to_push_up` / `push_up` /
       `push_up_to_idle`, so a bunk of six of him can all drop together. The
       botak keeps the ferry seats, the jetty and the parade square, where a
       different face in every chair is the point.
       (The FBO was in the mix for one pass at v8.1 and the photographs threw
       it out: full battle order in a bunk at ten to ten reads as a
       deployment. The sergeant wears it because he is on duty.) */
    const BUNK_KIND = {
      admintee: { clip: 'Idle_9',  height: 1.72 },
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
    /* v8.2: and they RUN it, rather than being teleported. A crowd copy is
       driven through `crowdMarch` (the same legs and the same lane as a rig's
       `marchTo`, over `r.g` instead of `rig.group`), and the whole crowd is
       put on `Running` for the length of the move and back on its own rest
       take when the last man arrives. `snap` is the resume and the reset:
       be there, no run. */
    const crowdRuns = new Set();
    function bunkCrowdPlace(onLine, snap, party) {
      for (const c of bunkCrowds) {
        if (!c.ready) continue;
        let moving = 0;
        c.rigs.forEach((r, i) => {
          const m = c.men[i]; if (!m) return;
          const to = onLine ? { x: SQ.line, z: m.line, ry: Math.PI / 2 }
                            : { x: m.x, z: m.z, ry: m.ry };
          crowdMarchStop(r);
          if (snap) { r.g.position.set(to.x, 0, to.z); r.g.rotation.y = to.ry; return; }
          party.push({ r, c, from: { x: r.g.position.x, z: r.g.position.z }, to, spd: RUN_SPD });
          moving++;
        });
        if (snap) { crowdRuns.delete(c); crowdPlay(c, null, 0); }
        else if (moving) { crowdRuns.add(c); crowdPlay(c, 'Running', 0.2); }
      }
    }
    const crowdMarchers = [];
    function crowdMarchStop(r) {
      for (let i = crowdMarchers.length - 1; i >= 0; i--) if (crowdMarchers[i].r === r) crowdMarchers.splice(i, 1);
    }
    function crowdMarchTick(d) {
      for (let i = crowdMarchers.length - 1; i >= 0; i--) {
        const m = crowdMarchers[i];
        if (m.wait > 0) { m.wait -= d; continue; }
        const g = m.r.g, leg = m.legs[m.i];
        const dx = leg.x - g.position.x, dz = leg.z - g.position.z, dist = Math.hypot(dx, dz);
        if (dist > 0.02) g.rotation.y = mixAngle(g.rotation.y, Math.atan2(dx, dz), Math.min(1, d * 6));
        const step = m.spd * d;
        if (step >= dist) {
          g.position.set(leg.x, 0, leg.z);
          if (++m.i >= m.legs.length) { g.rotation.y = m.to.ry; crowdMarchers.splice(i, 1); }
        } else { g.position.x += dx / dist * step; g.position.z += dz / dist * step; }
      }
      // a crowd goes back to its own take once its last man has arrived
      for (const c of [...crowdRuns]) {
        if (crowdMarchers.some(m => m.c === c)) continue;
        crowdRuns.delete(c); crowdPlay(c, null, 0.3);
      }
    }
    const bunkCrowdShow = (on) => { for (const c of bunkCrowds) c.group.visible = on; };

    /* THE SLEEPERS: eight men in the eight other bottom bunks — shown at
       lights out, hidden by day. The bed beside his is the buddy's.

       v9.1, Chad, on v9.0: "the 3am scene, all the bunkmates are sleeping the
       wrong way. You have to flip them so their head is on the pillow. Also i
       previously provided 2 types of sleeping model ... You have to mix both
       and distribute them, vary between them. The bunkmate sleeping next to
       the player must be the animated one."

       Both halves were real and both were MEASURED on the shipped v9.0 build
       before anything moved:

       · THE STATUE lies along its own z, and its head is at that model's −z
         end. Sliced into ten bins along it, the −z end is 0.80 m across and
         0.32 m tall (shoulders, with the arms up behind the head) and the +z
         end is 0.24 m across and the lowest thing in the file (feet). v7.1
         turned it by `+π/2 (+π when head < 0)`, which puts −z at +x on the
         balcony row and at −x on the wall row — the OPPOSITE of the pillow in
         both, so every statue in this bunk has slept with its feet on the
         pillow since the chapter shipped.
       · THE RIG was worse and nobody had looked: measured, its world box was
         0.58 m on x by 1.60 m on z — it lay ACROSS the bed, sticking a third
         of a metre into the aisle at one end and into the next bed at the
         other, with the head bone sitting over the middle of the mattress.
         v7.1's `if (size.x > size.z) m.rotation.y += Math.PI / 2` is the test
         inverted (the body must be turned when it is long on Z, not on X) and
         it was applied AFTER the centring, which the turn then invalidated.

       So the facing is not guessed here any more. The statue takes the one
       angle its measurement gives; the rig is turned by its own HEAD BONE —
       long axis to the bed's length, head toward the pillow — and only then
       scaled, centred and grounded, in the bed group's own frame, where the
       pillow is always at +x (that is what `g.rotation.y` is for).

       And the mix is FOUR AND FOUR, dealt so no two rigs share a wall: the
       wall row alternates statue, rig, statue, rig and the balcony row runs
       statue, rig, rig, statue. Index 3 is the bed beside his — Chad's "must
       be the animated one" — and it is also scene C's neighbour, the man who
       rolls over when the player whispers, which is the one sleeper in the
       chapter a cutscene points the camera at. The four rigs come from ONE
       parse and three `cloneSkinned` copies (shared geometry, one upload),
       each with its own mixer, its own take out of the file's three and its
       own rate, so four breathing men are four different men. */
    const sleepers = [];              // { bed, obj, rig? }
    const sleepBeds = beds.filter(b => !b.his);
    const RIGGED = [1, 3, 5, 6];      // which of the eight breathe (3 is the bed beside his)
    const NEIGHBOUR = 3;              // the bed beside the player's, and scene C's man
    /* WHICH TAKE EACH BREATHING MAN IS ON, keyed by his BED rather than by his
       place in the list, so re-dealing `RIGGED` cannot silently move a man's
       character. Chad, v9.2: "use the other sleeping animation for the
       bunkmate who is closest to the player's bed."
       Which one is "the other" was measured off the file rather than guessed —
       the summed spread of every rotation track across each clip:
         Sleep_Normally                 0.22   (a man breathing, and nothing else)
         Cough_While_Sleeping           2.29
         Groan_Holding_Stomach_in_Sleep 4.36   (twenty times Sleep_Normally)
       The neighbour was on `Cough`, which at 2.29 against 0.22 is a real
       difference on paper and a small one across a dark room. He takes the
       GROAN now — the most distinct take in the file, on the one sleeper the
       chapter ever puts a camera on, and the man scene C has roll over when
       the player whispers to him. */
    const SLEEP_TAKE = { 1: 'Sleep_Normally', [NEIGHBOUR]: 'Groan_Holding_Stomach_in_Sleep',
                         5: 'Sleep_Normally', 6: 'Cough_While_Sleeping' };
    const SLEEP_RATE = { 1: 0.85, [NEIGHBOUR]: 0.80, 5: 1.00, 6: 0.72 };
    const REST_TAKE = 'Sleep_Normally';   // the take every copy is measured on (see below)
    const sleeperRoot = new THREE.Group(); sleeperRoot.visible = false; world.add(sleeperRoot);
    assetBytes('sleeper').then(BUF => new GLTFLoader().parse(BUF, '', (gltf) => {
      if (!alive) return;
      rescueTextures(gltf, BUF);
      const src = gltf.scene;
      src.traverse(o => { if (o.isMesh) { o.castShadow = !LOW; o.receiveShadow = false; } });
      src.updateMatrixWorld(true);
      const box = new THREE.Box3().setFromObject(src);
      const size = box.getSize(new THREE.Vector3());
      /* the statue lies along its z with its HEAD at −z (measured, above); a
         bed's length is x and its pillow is at `b.head`. Turning local −z
         onto world +b.head·x is a quarter turn of −b.head. */
      const long = size.z >= size.x ? 'z' : 'x';
      const len = Math.max(size.x, size.z), sc = Math.min(1, (BED.len - 0.25) / len);
      sleepBeds.forEach((b, i) => {
        if (i >= 8 || RIGGED.includes(i)) return;
        const m = src.clone();
        m.scale.setScalar(sc);
        m.rotation.y = long === 'z' ? -b.head * Math.PI / 2 : (b.head > 0 ? Math.PI : 0);
        m.position.set(b.x, 0, b.z);
        sleeperRoot.add(m);
        restOnDeck(b, m, -box.min.y * sc);      // v9.2: ON the mattress, not 2 cm over it
        sleepers.push({ bed: b, obj: m });
      });
      redoShadows();
    }, (err) => console.warn('sleeper failed to load', err)))
      .catch(err => console.warn('sleeper failed to load', err));
    /* the breathing ones: ONE parse, three clones. `cloneSkinned` is the
       engine's SkeletonUtils clone (v4.8), so the four share geometry and
       material and each carries its own skeleton — which is what lets each
       run its own take on its own clock. */
    const sleepRigs = [];
    for (const i of RIGGED) {
      const b = sleepBeds[i]; if (!b) continue;
      const g = new THREE.Group();
      g.position.set(b.x, 0, b.z);
      g.rotation.y = (b.head < 0 ? Math.PI : 0);
      sleeperRoot.add(g);
      restOnDeck(b, g, 0);                      // v9.2: the group's origin IS the mattress top
      const rig = { bed: b, group: g, mixer: null, acts: null, ready: false,
                    take: SLEEP_TAKE[i] || REST_TAKE, rate: SLEEP_RATE[i] || 0.85 };
      sleepRigs.push(rig);
    }
    assetBytes('sleepanim').then(BUF => new GLTFLoader().parse(BUF, '', (gltf) => {
      if (!alive) return;
      rescueTextures(gltf, BUF);
      /* EVERY COPY IS MADE BEFORE ANY OF THEM IS TOUCHED. `cloneSkinned`
         copies transforms as well as bones, so cloning inside the loop would
         have taken each copy from the previous one AFTER it had been scaled,
         turned and grounded. */
      const copies = sleepRigs.map((_, n) => n === 0 ? gltf.scene : cloneSkinned(gltf.scene));
      const v = new THREE.Vector3();
      const skinBox = (m, g) => {
        m.updateMatrixWorld(true); g.updateMatrixWorld(true);
        const bb = new THREE.Box3();
        m.traverse(o => { if (o.isSkinnedMesh) {
          const p = o.geometry.attributes.position;
          for (let k = 0; k < p.count; k += 7) { o.getVertexPosition(k, v); v.applyMatrix4(o.matrixWorld); g.worldToLocal(v); bb.expandByPoint(v); }
        } });
        return bb;
      };
      const REST = REST_TAKE;
      copies.forEach((m, n) => {
        const rig = sleepRigs[n];
        m.traverse(o => { if (o.isMesh) { o.castShadow = !LOW; o.receiveShadow = false; } });
        wideBounds(m, 'sleepanim');             // v8.4: cull by the widest pose
        rig.group.add(m);
        m.rotation.y = 0;
        if (!gltf.animations.length) return;
        rig.mixer = new THREE.AnimationMixer(m);
        rig.acts = {};
        for (const clip of gltf.animations) rig.acts[clip.name] = rig.mixer.clipAction(clip);
        /* EVERY COPY IS PUT ON THE SAME TAKE FIRST, and it has to be: this
           rig's BIND pose is a Mixamo T-POSE STANDING UP, so a body measured
           before any take has been applied is 1.7 m TALL and half a metre
           wide — `max(size.x, size.z)` then reads a shoulder span as the
           length of a sleeping man and scales him to three times the bed.
           (Measured: widths of 2.9–3.1 m across a 0.9 m mattress. v7.1's code
           happened to avoid this by measuring after its own mixer update; the
           trap is in the order, not the arithmetic.) */
        (rig.acts[REST] || Object.values(rig.acts)[0]).play();
        rig.mixer.update(0.2);
      });
      /* THE SCALE AND THE TURN ARE MEASURED ONCE, on the first copy on the
         SHARED take, and given to all four. Measuring each man on his own
         take would scale them differently — a curled-up cough take is a
         shorter box, which asks for a bigger man — and the v5.05 law is that
         when new things are placed among existing things, the measure that
         matters is the one the existing things used. This rig is centimetres
         (the FBX family) and has no crown bone, so it is measured from the
         POSED SKIN (the v5.21 trap), in the bed group's own frame, which is
         the frame the pillow is always at +x in. */
      const g0 = sleepRigs[0].group, m0 = copies[0];
      const boxA = skinBox(m0, g0), sizeA = boxA.getSize(new THREE.Vector3());
      const SC = (BED.len - 0.3) / Math.max(sizeA.x, sizeA.z, 0.01);
      m0.scale.setScalar(SC);
      const boxB = skinBox(m0, g0), cB = boxB.getCenter(new THREE.Vector3()), sizeB = boxB.getSize(new THREE.Vector3());
      let headBone = null;
      m0.traverse(o => { if (!headBone && HEAD_RE.test(o.name)) headBone = o; });
      const hp = new THREE.Vector3();
      if (headBone) { headBone.getWorldPosition(hp); g0.worldToLocal(hp); } else { hp.copy(cB); hp.z -= 1; }
      const alongX = sizeB.x >= sizeB.z;
      const sign = Math.sign((alongX ? hp.x - cB.x : hp.z - cB.z)) || 1;
      // the long axis onto the bed's length, the HEAD toward the pillow at +x
      const TURN = alongX ? (sign > 0 ? 0 : Math.PI) : (sign > 0 ? Math.PI / 2 : -Math.PI / 2);
      sleepRigs.forEach((rig, n) => {
        const g = rig.group, b = rig.bed, m = copies[n];
        m.scale.setScalar(SC);
        m.rotation.y = TURN;
        // now each man takes his own take, at his own rate, at his own breath
        if (rig.acts) {
          const take = rig.acts[rig.take] || rig.acts[REST] || Object.values(rig.acts)[0];
          for (const k in rig.acts) if (rig.acts[k] !== take) rig.acts[k].stop();
          take.reset();
          take.setEffectiveTimeScale(rig.rate);
          take.play();
          rig.mixer.update(0.2 + n * 0.7);
        }
        // and only now centre him on the mattress and lay his back on it
        const boxC = skinBox(m, g), cC = boxC.getCenter(new THREE.Vector3());
        m.position.x -= cC.x; m.position.z -= cC.z;
        m.position.y -= boxC.min.y;             // g's own origin IS the mattress top
        rig.ready = true;
        sleepers.push({ bed: b, obj: m, rig });
      });
      redoShadows();
    }, (err) => console.warn('sleepanim failed to load', err)))
      .catch(err => console.warn('sleepanim failed to load', err));

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

    /* ================================================== v8.7: THE BED ZONE
       Chad: "when the current objective is to go to your bed, i want an
       unmissable circular glowing effect indicating the area of effect that
       the player must get to" — and, on the first attempt: "make it red and
       glowing, do u fucking understand what is GLOWING? the travelling
       circle is so jerky, i want it smooth like a radar expanding outwards."

       GLOWING means a soft RADIAL FALLOFF, not a flat ring with its opacity
       turned up and down. Everything here is a canvas gradient — white with
       an alpha curve, tinted red by the material and ADDED to the floor — so
       the light bleeds out past its own edge the way light does. Three
       layers: a HALO that reaches 0.9 m beyond the circle and has no hard
       edge anywhere, a FILL that says which floor is the area, and the radar.

       THE RADAR is three bands at a third of a period apart, so one is always
       travelling: each grows from the centre to the halo's rim on a smooth
       curve and fades as it goes. Its phase comes off WALL TIME, not the
       frame count and not the world clock, so it sweeps at the same speed
       whatever the frame rate.

       The circle IS the trigger: `ZONE_R` is both the radius the rim sits at
       and the radius `updateDay` tests. */
    const ZONE_R = 1.8;                  // what the player must stand inside
    const GLOW_R = 2.7;                  // how far the light bleeds past it
    /* a radial alpha curve, painted once. `stops` are [radius 0-1, alpha]. */
    function glowTex(stops) {
      /* 512, not 256: the plane is 5.4 m across, so a 256 texture gives 47
         pixels a metre and a 20 cm rim lands on nine of them — a blur, not
         an edge. */
      const sz = 512, [c, g2] = cnv(sz);
      g2.clearRect(0, 0, sz, sz);
      const g = g2.createRadialGradient(sz / 2, sz / 2, 0, sz / 2, sz / 2, sz / 2);
      for (const [r, a] of stops) g.addColorStop(Math.max(0, Math.min(1, r)), `rgba(255,255,255,${a})`);
      g2.fillStyle = g; g2.fillRect(0, 0, sz, sz);
      const t = new THREE.CanvasTexture(c);
      t.colorSpace = THREE.SRGBColorSpace;
      return t;
    }
    const RIM = ZONE_R / GLOW_R;         // where the circle's edge falls in the halo texture
    /* TWO BLENDS, and the reason is measured rather than chosen: the bunk
       floor is bright tile, and ADDING red light to something already at
       0.75 grey lands at (1.0, 0.9, 0.84) — white. The first pass did exactly
       that and read as a pale smear. So the colour is done by a NORMAL-blended
       red TINT, which is red on any floor however bright, and the glow is a
       separate ADDITIVE layer on top: a narrow hot crest at the rim and the
       radar bands. Tint carries the hue, additive carries the light. */
    // the ground inside: a steady wash that lifts toward the boundary
    const zoneFillTex = glowTex([[0, 0.26], [0.55, 0.36], [0.88, 0.72], [0.975, 0.95], [1, 0]]);
    /* the boundary: a THIN hot core with a long soft bleed outward, which is
       what makes it read as a light source rather than a painted line */
    const zoneRimTex  = glowTex([[0, 0], [RIM * 0.93, 0], [RIM * 0.975, 0.75], [RIM, 1],
                                 [RIM * 1.03, 0.62], [RIM * 1.10, 0.22],
                                 [RIM * 1.26, 0.07], [1, 0]]);
    // the radar band: narrow, with the leading edge harder than the trail
    const zoneWaveTex = glowTex([[0, 0], [0.80, 0], [0.905, 0.30], [0.965, 1],
                                 [0.99, 0.45], [1, 0]]);
    const RED_DEEP = 0xb3140b, RED_HOT = 0xff3a1c;

    const zone = new THREE.Group();
    zone.position.set(PILE_POS.x, 0.02, PILE_POS.z);
    zone.visible = false;
    world.add(zone);
    const zonePlane = (tex, r, op, col, add) => {
      const m = new THREE.Mesh(
        new THREE.PlaneGeometry(r * 2, r * 2),
        new THREE.MeshBasicMaterial({ map: tex, color: col, transparent: true, opacity: op,
          side: THREE.DoubleSide, depthWrite: false, fog: false,
          blending: add ? THREE.AdditiveBlending : THREE.NormalBlending }));
      m.rotation.x = -Math.PI / 2;
      m.renderOrder = add ? 4 : 3;
      m.userData.moves = true;      // v8.7: never frozen — see freezeStatic
      zone.add(m);
      return m;
    };
    const zoneFill = zonePlane(zoneFillTex, ZONE_R, 0.72, RED_DEEP, false);   // the ground turns red
    const zoneRim  = zonePlane(zoneRimTex, GLOW_R, 0.95, RED_HOT, true);      // and the edge burns
    const WAVES = 3;
    const zoneWaves = [];
    for (let i = 0; i < WAVES; i++) zoneWaves.push(zonePlane(zoneWaveTex, GLOW_R, 0.7, RED_HOT, true));
    let zoneFlare = 0;          // the blow-out on entry, decayed by the frame

    const _ndc = new THREE.Vector3(), _ray = new THREE.Raycaster(), _ptr = new THREE.Vector2();
    const syncCamera = () => {
      camera.updateWorldMatrix(true, false);
      camera.matrixWorldInverse.copy(camera.matrixWorld).invert();
    };
    function pileDist() { return Math.hypot(yaw.position.x - PILE_POS.x, yaw.position.z - PILE_POS.z); }
    /* v8.7: the point tested is a bunk's MIDDLE, not its mattress. A hotspot
       anchor has to sit near eye height or it is never offered (v7.5's law,
       which the bed itself was exempt from): standing in the circle beside
       his own bed, the mattress at 0.55 m is 60 degrees under the lens, so
       `inView()` said no and the badge for the standby bed never appeared. */
    function pileScreen() { syncCamera(); return _ndc.set(PILE_POS.x, BED.low + 0.45, PILE_POS.z).project(camera); }
    function pileInView() {
      /* v8.7: a bed with nothing to offer is not offered. The badge and the
         E key both come through here, so this is what keeps a press falling
         through to the hotspots rather than dying on the mattress. */
      if (bedWants() === BED_NOTHING) return false;
      /* Within arm's reach the bed IS what you are looking at, whichever way
         the head is turned — lying on it at three in the morning (where the
         mattress is under the lens and off screen entirely, which is how the
         decision became unreachable from the pillow) and standing in the
         circle beside it alike. */
      if (pileDist() < 1.3) return true;
      const n = pileScreen();
      return n.z < 1 && Math.abs(n.x) < 0.97 && Math.abs(n.y) < 0.97;
    }
    function pointerHitsPile(cx, cy) {
      if (pileDist() > INTERACT_R || bedWants() === BED_NOTHING) return false;   // v8.7
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
    const PLAY_LINES = ['b1day', 'b1sleep', 'e1backbunk', 'e1knock',   // v8.9: 'dooropen2' left with the door hotspot — it is scene A's cue now, and the film warms its own
      'k1board', 'k1three',
      'n1bedfail', 'n1bedok', 'n1board', 'n1fallin', 'n1hear', 'n1late',
      'n1lights', 'n1shower', 'n1wake', 'pushups', 's1again', 's1fallin',
      's1late', 's1lights', 's1standby', 'switchoff', 'whistle',
      'hudlock',                    // v8.8: the bed zone's own trigger
      'platoonmarch'];              // v9.2: the camp's pass-by, fired from ambientTick
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
       v8.2: and the retarget was RETIRED — Chad's new FBO files carry
       `Talk_with_Left_Hand_Raised` as their OWN take, authored against their
       own rest pose, which beats any transplant (v5.20's law).
       v8.3: and the bunkmate left the FBO rig entirely, so his line rides the
       admin tee's own `Talk_with_Hands_Open`. Every take named here is now a
       take its own rig actually ships — which matters more than it reads,
       because a rig sent to a take it does not have is a silent no-op, and
       that is the bug this whole comment was written about. */
    function castSay(rig, name, take, idle) {
      return sayLine(name, 1, () => {
        rig.play(take, 1, 0.3);
        after((SECS[name] || 2.5) + 0.2, () => { if (rig.cur === take) rig.play(idle, 1, 0.4); });
      });
    }
    const TALK_NOSL = 'Talk_with_Hands_Open';         // v8.3: the admin tee's own talking take
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
    /* v9.2, Chad: "Add more ambient music and sound effects throughout this
       entire ep2 chp1 chapter." Two of the three are BEDS and go here.

       `e2day` is the day's music, and it exists because `e2bed` is the
       NIGHT's: from the end of the film to lights out the chapter had no
       music at all, only room tone. It is the same shape as e2bed on the
       other side of `nightK`, so the two cross at lights out rather than one
       starting into silence — and it is pitched under e2bed (0.26 against
       0.30) because the day is the half of the chapter the boy narrates
       across, and a bed that has to be talked over is a bed that gets turned
       down. Its energy is below 120 Hz by measurement, which is the same
       masking reasoning as the v5.27 duck: out of the band his voice lives in.

       `campamb` is the camp OUTSIDE — wind across the tarmac, a treeline,
       a far building's hum. It is keyed to `outK` (below) rather than run
       flat, because the bunk is a room and the square is not: standing on
       the parade square with the same outdoor bed you had by your bed would
       say the two places sound alike, and the whole of the fall-in is the
       walk between them. It stays audible indoors (the bunk's windows are
       louvred and its balcony side is open) and thins at night. */
    let nightK = 0, showerVol = 0, outK = 0;
    function mixBeds() {
      DATA.ambience.beds = [
        ['bunkday', 0.24 * (1 - nightK)], ['bunknight', 0.22 * nightK],
        ['fanloop', 0.14 - 0.04 * nightK], ['clocktick', 0.06],
        ['e2bed', 0.30 * nightK], ['e2day', 0.26 * (1 - nightK)],
        ['campamb', (0.15 + 0.26 * outK) * (1 - 0.55 * nightK)],
        ['showerrun', showerVol]];
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
    /* v9.2: THE INSPECTION. Chad: "The encik and sergeant walks further front,
       and faces the line of fall-in bunkmates, which means they are facing in
       the direction of the bunk entrance." So both stand PAST the rank and
       turn back down it — `ry` −π/2 is facing −x, which is the line, the
       balcony and the bunk door behind it, exactly as the recruits' +π/2 is
       facing the other block.
       They go round the rank's flank rather than through it. Their path out
       would otherwise cross x 14 between z ±1, which is where two recruits are
       already standing by the time the seniors step off (they are `last`), so
       each carries a `via` down the −z flank at a lane of his own — 1.0 m
       apart — and comes in along the front of the line. */
    const SGT_LINE = { x: SQ.sgt, z: 0.9, ry: -Math.PI / 2,
                       via: [{ x: 9.6, z: -5.4 }, { x: SQ.sgt, z: -5.4 }] };
    const LINE_X = SQ.line - 0.35;                             // past this, he is on the line
    const LIE_Y = BED.low + 0.14, LIE_YAW = -Math.PI / 2;      // his eye on the pillow, looking along the bed to the aisle
    const ITEM_GLYPH = ['Pillow', 'Bedsheet', 'Blanket', 'Boots', 'Water bottle', 'Mug', 'Toothbrush', 'Locker'];   // which glyph, whatever the sheet calls it
    const BED_ITEMS = ITEM_GLYPH.map((g, i) => ({ label: DATA.words['item' + (i + 1)] || g, icon: itemIcon(cnv, g) }));

    /* v8.2: this SETS them — the reset, the resume, and the boot. Walking them
       is `fallOut`'s job, because the sergeant and the encik have to be in the
       same party as the recruits or they draw a lane somebody else is already
       standing in (measured: the encik and a recruit at 5.6, -0.84, 0.00 m
       apart). One sort, one lane deal, ten men. */
    function putSergeant(at, snap) {
      marchStop(sergeant);
      sergeant.group.position.set(at.x, 0, at.z);
      sergeant.group.rotation.y = at.ry;
      if (sergeant.play && sergeant.idle) sergeant.play(sergeant.idle, 1, 0);
      /* v8.2: the encik goes where the sergeant goes — to the parapet for the
         fall-in, back into the bunk after it. He is senior, so he stands
         BESIDE him rather than in the rank with the recruits, and he goes on
         his own two feet — `Walking`, at 1.35 m/s,
         down the same lane, because a man of his age and rank walks where a
         recruit runs. `snap` is the resume and the reset. */
      const e = (at === SGT_LINE) ? ENC_LINE : ENC_DOOR;
      marchTo(encik, e, 'Walking', WALK_SPD, true);
    }

    /* v8.7: REACHING THE BED IS A MOMENT. Chad: "have a nice trigger sound
       and flashing effect to show the player successfully entered the area
       and reached his bed. the camera view should then immediately lock
       towards facing the room and the fall in area, so the player knows
       whats going on next." Two sounds a frame apart (a confirm and a low
       thump under it), the kit's screen flash, the phone buzzing, and the
       circle blowing out — then the HUD's own two beats, which the engine
       plays for any objective that changes. */
    const camFace = (x, z, tx, tz) => Math.atan2(-(tx - x), -(tz - z));
    function reachedBed(kind) {
      flareAt = performance.now() / 1000;
      /* v8.8: `hudlock` — a sub thump, a metal latch and a chord ringing out,
         written for this moment. The first pass borrowed the menu's confirm
         beep and it sounded like one. */
      if (worldSfx) worldSfx('hudlock', 0.95);
      if (kit) { kit.flash({ color: '#FF2A18', secs: 0.6 }); kit.haptic([30, 45, 90]); }
      if (!kit) return;
      if (kind === 'arrive') { lookToRoom(); kit.objective(DATA.words.objStood); }
      else kit.objective(DATA.words.objBedTap);
    }
    /* The lens goes to the room and the balcony — where the whistle is about
       to come from. Over half a second rather than on one frame: a snap at
       this speed reads as a bug, and the player keeps the mouse throughout
       (the tween writes an absolute angle, so letting go of it hands control
       straight back). */
    function lookToRoom() {
      const yFrom = yaw.rotation.y;
      const yTo = camFace(yaw.position.x, yaw.position.z, LINE_X, 0);
      const d = Math.atan2(Math.sin(yTo - yFrom), Math.cos(yTo - yFrom));   // the short way round
      tween(() => 0, k => { yaw.rotation.y = yFrom + d * k; }, 1, 0.55);
      const pFrom = pitch.rotation.x;
      if (Math.abs(pFrom) > 0.01) tween(() => 0, k => { pitch.rotation.x = pFrom * (1 - k); }, 1, 0.55);
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
    function beginFallIn(snap) {
      setPhase('fallin');
      /* v7.3: on a RESUME the lateness is read back off the card rather than
         reset — the penalty is already banked, so a second run of the
         fall-in must not hand him the on-time bonus on top of it. */
      fallLate = bankedHas(DATA.words.noteLate);
      if (worldSfx) worldSfx('whistle', 0.9);
      /* The sergeant is not marched: he is ALREADY outside when the whistle
         sounds — that is what the player hears, and he is never seen leaving
         the room. The encik walks out after the section; a sergeant-major
         does not run for his own whistle. */
      fallOut(true, snap);      // v8.2: and everyone else goes out on foot
      after(1.2, () => sgtSay('s1fallin'));
      after(4.6, () => sayLine('n1fallin'));
      if (!kit) return;
      /* v8.7: `complete: false` — the whistle INTERRUPTS standing by, and
          being already late is not an order finished. The HUD must not
          congratulate a player for either. */
      kit.objective(fallLate ? DATA.words.objLate : DATA.words.objFallIn, { complete: false });
      kit.waypoint({ x: SQ.line, y: 1.0, z: 0 });
      if (fallLate) return;                       // the clock has already run out on him
      /* v9.2: 14 s became 17. Chad: "Since the player has to walk further
         distance to the parade square, add 3 more seconds to the timer." The
         line moved from x 7.25 to x 14 — about six metres further from the
         bed than the balcony's was. */
      fallTimer = kit.timer(17, () => {
        fallLate = true; fallTimer = null;
        sgtSay('s1late');
        after(3.6, () => sayLine('n1late'));
        bank({ s: -3, a: -2, note: DATA.words.noteLate });
        kit.objective(DATA.words.objLate, { complete: false });   // v8.7: the clock beat him
        /* v7.4: AND THE FALL-IN ENDS. Before this the timer paid out its
           penalty and then the chapter went on waiting for the line for
           ever — a player who was slow (or, before the gangway, any player
           at all) was stuck with nowhere the day could go. The sergeant has
           you now: the beat plays out and the day moves on.
           v8.3: the push-ups moved OUT of here and into `punishBeat`, which
           runs either way — the section is knocked down whether or not you
           made the line, so the penalty for being late is the sergeant's line
           and the numbers, not the exercise. */
        after(6.0, () => { if (phase === 'fallin') onTheLine(); });
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
    /* v8.3: THE WHOLE SECTION DROPS, not just the buddy (Chad: "They should
       all be doing push ups"). Every man in the bunk is the admin tee now, and
       the tee carries the three takes as its own, so the same three beats
       drive the two named rigs AND the crowd through `crowdPlay`. The clip
       lengths are the file's, measured: 2.71 s down, 1.63 s a rep, 3.21 s up.
       Returns how long the whole thing takes, so the beat that follows can be
       scheduled off it rather than off a number copied by hand. */
    const PU = { DOWN: 2.71, REP: 1.63, UP: 3.21, N: 3 };
    const PU_SECS = PU.DOWN + PU.REP * PU.N + PU.UP;
    function sectionPushUps() {
      const rigs = [buddy, bunkmate].filter(r => r && r.group && r.group.visible);
      const drop = (take, fade, once) => {
        for (const r of rigs) r.play(take, 1, fade, once);
        for (const c of bunkCrowds) crowdPlay(c, take, fade);
      };
      drop('idle_to_push_up', 0.3, true);
      after(PU.DOWN, () => drop('push_up', 0.15));
      after(PU.DOWN + PU.REP * PU.N, () => drop('push_up_to_idle', 0.2, true));
      after(PU_SECS, () => { for (const r of rigs) r.play('Idle_9', 1, 0.3); for (const c of bunkCrowds) crowdPlay(c, null, 0.3); });
      if (worldSfx) worldSfx('pushups', 0.9);
      return PU_SECS;
    }
    /* ------------------------------------------------- THEY GO ON FOOT (v8.2)

       v7.4 PLACED the section on the line, and said why: "neither rig carries
       a walk take (the file ships an idle and a talk and nothing else)".
       Chad's three new models end that — every one of them carries `Walking`
       and `Running`, and both are measured IN PLACE (the hips travel 0.02 to
       0.04 m over the cycle), which is exactly the shape ch5's tang-ki has
       walked on since v5.07: play the take, glide the group.

       THE ROUTE IS THE ONE THE ROOM HAS. A cast path obeys no collision
       (v5.03), so it is routed by hand rather than trusted:

         out of the bed row to the GANGWAY LANE at z 0 — the lane v7.4 cut
         through the balcony-side row, which is clear of a bed or a locker
         for z +/-1.10;
         east through the balcony opening (z +/-1.2 in the +x wall);
         then across the open balcony to his place on the yellow line.

       Nobody crosses the long table (z 2.55, x +/-1.80) or a bed row
       (x +/-4.6), in either direction, because the lane is z 0 and the
       turn out of it happens at the man's own x.

       Speed is casting, not physics: a recruit hearing that whistle RUNS
       (2.6 m/s, `Running`), and the sergeant-major who called it WALKS
       (1.35 m/s, `Walking`). The furthest man covers about 15 m, so he is
       formed up inside 6 s of a 14 s fall-in. The sergeant himself is not
       marched: he is already outside when the whistle sounds, which is
       what the player hears.                                              */
    /* Each man gets his OWN lane z rather than all sharing z 0: measured with
       one shared lane, the two recruits at x 3.25 turned into it from opposite
       sides and stood in the same place, 0.00 m apart. The spread stays well
       inside the window that is actually clear — the gangway is free of a bed
       or a locker for z +/-1.10 and the balcony opening is z +/-1.2 — so a
       lane at +/-0.45 crosses nothing, and three lanes plus the stagger read
       as a loose file rather than a column of one. */
    const GATE_OUT = 6.6, GATE_IN = 5.6, WALL_X = 6.0;
    /* Cycling three lanes was not enough: the two recruits who share x -3.25
       drew the same lane and stood on the same turn point 0.08 s apart. Every
       man gets his OWN lane instead — nine of them, 0.21 m apart, spanning
       +/-0.84, which stays inside both the gangway's clear window (z +/-1.10)
       and the balcony opening (z +/-1.2). Two men may still CROSS at speed;
       none of them ever stands where another is standing. */
    /* LANES ARE DEALT IN ORDER OF WHERE HE STANDS, not in dispatch order. A
       man deeper in -z is given a deeper -z lane, so two paths can never
       cross: measured with lanes dealt by dispatch order, the two recruits
       who share x 3.25 ran at each other's lane from opposite sides and
       passed through the same point, 0.04 m apart. Eleven lanes across
       +/-0.98, inside both the gangway's clear window (z +/-1.10) and the
       balcony opening (z +/-1.2). */
    const laneOf = (n, of) => {
      const N = Math.max(1, (of || 11) - 1);
      return -0.98 + 1.96 * (Math.min(n, N) / N);
    };
    const marchers = [];
    function marchLegs(from, to, lane = 0) {
      const legs = [];
      if ((from.x < WALL_X) === (to.x < WALL_X)) { legs.push({ x: to.x, z: to.z }); return legs; }
      const LANE_Z = lane;
      /* He only turns into his lane at his own x when he is INSIDE, where
         there are beds either side of him. Coming off the balcony he heads
         straight for the door across open floor — measured, that first
         turn-in-place leg put a man on the yellow line exactly where the
         next man was still standing. */
      if (from.x < WALL_X && Math.abs(from.z - LANE_Z) > 0.05) legs.push({ x: from.x, z: LANE_Z });
      legs.push({ x: from.x < WALL_X ? GATE_OUT : GATE_IN, z: LANE_Z });
      /* v9.2: a destination may name the way it wants to be reached. The two
         seniors use it to walk round the rank's flank instead of through it. */
      if (to.via) for (const v of to.via) legs.push({ x: v.x, z: v.z });
      /* Once he is THROUGH the wall the balcony is open floor, so he cuts
         straight to his place on the line. Routing that leg through
         {to.x, LANE_Z} as well put all eight men on the same point before
         they fanned out — a pile-up, measured. Coming back IN he still turns
         at his own x, because inside there are beds either side of him. */
      if (to.x < WALL_X && Math.abs(to.z - LANE_Z) > 0.05) legs.push({ x: to.x, z: LANE_Z });
      legs.push({ x: to.x, z: to.z });
      return legs;
    }
    function marchStop(rig) {
      for (let i = marchers.length - 1; i >= 0; i--) if (marchers[i].rig === rig) marchers.splice(i, 1);
    }
    /* `snap` puts him at the destination at once — the resume path, and any
       reset, where a man must simply BE where the phase says he is. */
    function marchTo(rig, to, take, spd, snap, wait, lane) {
      if (!rig || !rig.group) return;
      marchStop(rig);
      if (snap) {
        rig.group.position.set(to.x, 0, to.z); rig.group.rotation.y = to.ry;
        if (rig.play && rig.idle) rig.play(rig.idle, 1, 0);
        return;
      }
      const legs = marchLegs(rig.group.position, to, lane || 0);
      if (rig.play && take) rig.play(take, 1, 0.25);
      marchers.push({ rig, legs, i: 0, to, spd, wait: wait || 0, take });
    }
    function marchTick(d) {
      for (let i = marchers.length - 1; i >= 0; i--) {
        const m = marchers[i];
        if (m.wait > 0) { m.wait -= d; continue; }      // he has not stepped off yet
        const g = m.rig.group, leg = m.legs[m.i];
        let dx = leg.x - g.position.x, dz = leg.z - g.position.z;
        const dist = Math.hypot(dx, dz);
        if (dist > 0.02) g.rotation.y = mixAngle(g.rotation.y, Math.atan2(dx, dz), Math.min(1, d * 6));
        const step = m.spd * d;
        if (step >= dist) {
          g.position.set(leg.x, 0, leg.z);
          if (++m.i >= m.legs.length) {              // arrived: face the way the spot faces, stand
            g.rotation.y = m.to.ry;
            if (m.rig.play && m.rig.idle) m.rig.play(m.rig.idle, 1, 0.3);
            marchers.splice(i, 1);
          }
        } else {
          g.position.x += dx / dist * step;
          g.position.z += dz / dist * step;
        }
      }
    }
    // shortest-arc angle mix, so a man never turns the long way round
    function mixAngle(a, b, k) {
      let dd = (b - a) % (Math.PI * 2);
      if (dd > Math.PI) dd -= Math.PI * 2;
      if (dd < -Math.PI) dd += Math.PI * 2;
      return a + dd * k;
    }

    /* Speeds are casting, not physics: a recruit who hears that whistle RUNS,
       and the sergeant-major who blew it walks. STAGGER is what makes it read
       as eight men rather than one body — measured without it, all eight
       stepped off on the same frame and met at the same doorway. */
    const RUN_SPD = 2.6, WALK_SPD = 1.35, STAGGER = 0.22;
    const BUNK_AT = new Map();
    /* THE ORDER IS NEAREST-FIRST, and that is not a nicety. Measured with the
       party dispatched in declaration order, the recruit at the BACK of a bed
       column ran clean through the one in front of him, who had not stepped
       off yet — 0.01 m apart. A section files out the way a real one does:
       the man closest to the door goes first and the man behind him follows
       into the space he has just left. Sorting by route length gives exactly
       that, in both directions, with no special case for either. */
    function fallOut(on, snap) {
      const party = [];
      /* The two seniors WALK where the recruits run, and they are the last out
         and the last back — a sergeant-major does not race his own section. */
      for (const [r, at] of [[sergeant, on ? SGT_LINE : SGT_DOOR],
                             [encik, on ? ENC_LINE : ENC_DOOR]]) {
        if (!r || !r.group) continue;
        if (snap) { marchTo(r, at, 'Walking', WALK_SPD, true); continue; }
        party.push({ rig: r, from: { x: r.group.position.x, z: r.group.position.z },
                     to: at, spd: WALK_SPD, take: 'Walking', last: true });
      }
      for (const [r, at] of [[buddy, { x: SQ.line, z: 1.8, ry: Math.PI / 2 }],
                             [bunkmate, { x: SQ.line, z: -4.2, ry: Math.PI / 2 }]]) {
        if (!r || !r.group) continue;
        if (on) {
          if (!BUNK_AT.has(r)) BUNK_AT.set(r, { x: r.group.position.x, z: r.group.position.z, ry: r.group.rotation.y });
          if (snap) { marchTo(r, at, 'Running', RUN_SPD, true); continue; }
          party.push({ rig: r, from: { x: r.group.position.x, z: r.group.position.z }, to: at, spd: RUN_SPD, take: 'Running' });
        } else {
          const b = BUNK_AT.get(r); if (!b) continue;
          if (snap) { marchTo(r, b, 'Running', RUN_SPD, true); continue; }
          party.push({ rig: r, from: { x: r.group.position.x, z: r.group.position.z }, to: b, spd: RUN_SPD, take: 'Running' });
        }
      }
      bunkCrowdPlace(on, snap, party);   // v8.1: and so does everyone else in the room
      // the lane: by where he stands, so no two paths cross
      const byZ = [...party].sort((a, z) => a.from.z - z.from.z);
      byZ.forEach((m, i) => { m.lane = laneOf(i, byZ.length); });
      // the order of stepping off: nearest the door first, rank last
      party.sort((a, z) => (a.last ? 1 : 0) - (z.last ? 1 : 0)
                         || Math.hypot(a.to.x - a.from.x, a.to.z - a.from.z)
                          - Math.hypot(z.to.x - z.from.x, z.to.z - z.from.z));
      party.forEach((m, n) => {
        if (m.rig) { marchTo(m.rig, m.to, m.take, m.spd, false, STAGGER * n, m.lane); return; }
        crowdMarchers.push({ r: m.r, c: m.c, legs: marchLegs(m.from, m.to, m.lane),
                             i: 0, to: m.to, spd: m.spd, wait: STAGGER * n });
      });
    }
    function onTheLine() {
      if (fallTimer) { fallTimer.stop(); fallTimer = null; }
      if (!fallLate) bank({ a: 4, note: DATA.words.noteOnTime });
      punishBeat();
    }
    /* ---- the punishment: twenty push-ups, whoever you are (v8.3)

       Chad: "The encik should shout angrily 'ah take your time somemore!
       whole lot knock it down 20 push ups, go!' Even if player manages to
       fall in on time, i still want this to happen, before everyone returns
       to the bunk. When returning to bunk, encik should shout 'Now go back to
       your bunk! I want standby bed now!'"

       So it is not a penalty — it is the morning. Being on time still pays
       (+4 Awareness, banked above); being late still costs. What the encik
       does to the section is the same either way, which is the joke and also
       the truth about the place.

       Its own PHASE, so a Continue lands back in it rather than restarting
       the fall-in — the day's other six phases have been resumable since
       v7.3 and this one is no different. */
    /* they drop on "GO!", which is the shout's last word: the take is 7.31 s
       and the word lands in its final beat, so the order is heard in full
       before a man moves. */
    const PUNISH_LEAD = 6.9;
    function punishBeat(snap) {
      setPhase('punish');
      if (kit) { kit.objective(DATA.words.objPunish); kit.waypoint(null); }
      if (snap) { beginStandby(); return; }
      encSay('e1knock');
      after(PUNISH_LEAD, () => { if (phase === 'punish') sectionPushUps(); });
      after(PUNISH_LEAD + PU_SECS + 0.5, () => { if (phase === 'punish') encSay('e1backbunk'); });
      after(PUNISH_LEAD + PU_SECS + 0.5 + (SECS.e1backbunk || 2.5) + 0.4,
            () => { if (phase === 'punish') beginStandby(); });
    }
    /* ---- the standby bed: back to the bunk, then the sequence */
    let bedTries = 0, stoodBy = false;     // v8.7: has he reached the circle this time round
    function beginStandby() {
      setPhase('standby');
      stoodBy = false;
      after(0.6, () => fallOut(false));    // v8.3: the punishment beat has already played out
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
        /* v8.7 (Chad): "The minigame must give instructions first, before
           starting." Nothing runs until START is pressed — the first item
           used to be named and gone inside 1.3 s, while the player was
           still reading the panel it had arrived in. */
        /* v9.3 (Chad): "the minigames have no stakes, no damage, no
           repercussions ... every mistimed tap or click should have
           penalties or damage." This one had none of either: `sequence`
           counted ANY tap as a hit, and `lo: 0` meant a total failure cost
           nothing. Now each item opens a WINDOW (`lead` in, the rest of the
           slot across) and the press is graded on the engine's ladder;
           a bad press takes sanity on the spot. `zone` is the difficulty —
           the trial's LEARNING tier is 0.82 and this is a recruit's first
           standby bed, so 0.70: tighter than the trial's easiest, nowhere
           near its hardest. */
        kit.event({ kind: 'sequence', label: DATA.words.evBed, items: BED_ITEMS,
                    brief: DATA.words.bedBrief,
                    each: 1.45, lead: 0.34, accel: 0.88, minEach: 0.62, zone: 0.70,
                    penalty: { stat: 'sanity', per: 1 },
                    award: { stat: 'awareness', per: 1, lo: -10, hi: 10 } })
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
      if (kit) { kit.fade(0, 2.2); kit.objective(null, { complete: false }); }   // v8.7: waking is not an order finished
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
      /* v9.3: graded, and tighter. `win` was 0.19 s either side of the beat
         at 72 bpm — a quarter of the whole period, which is not timing, it
         is a nudge. 0.13 with the ladder's zone at 0.62 means only a press
         within ~25 ms of the beat reads PERFECT, and a press 90 ms out
         costs sanity where it used to cost nothing. */
      kit.event({ kind: 'heartbeat', label: DATA.words.evFear, n: 6, bpm: 72, win: 0.13, zone: 0.62,
                  penalty: { stat: 'sanity', per: 1 },
                  award: { stat: 'sanity', per: 1, lo: -14, hi: 6 } })
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
      if (p === 'fallin') { beginFallIn(true); return; }
      if (p === 'punish') { punishBeat(true); return; }   // v8.3: the shout is spent; go on to the bed
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

    /* v8.7: WHAT THE BED IS FOR, and nothing else. Chad: "the tap bed
       function serves absolutely no purpose, and it may make the player
       stuck." Both halves were true. Tapping the bed by day toggled the
       LYING POSE — a thing the chapter never needs the player to do (lights
       out lies him down itself) — and getting back up required the bed to be
       on screen while the bed was the thing under the lens, which is the trap
       v7.4 papered over rather than removed. It is gone.
       What is left is only what the bed can actually DO at that moment, and
       `bedWants()` below says so in one place: open the decision at three in
       the morning, begin the standby bed when the section has been sent back
       to it, and turn in early once the evening has been looked at. When the
       answer is "nothing", the badge is never offered at all (see
       pileInView), so a press falls through to the hotspots instead of
       being swallowed by a bed with nothing to say. */
    const BED_NOTHING = 0, BED_DECIDE = 1, BED_STANDBY = 2, BED_TURNIN = 3;
    function bedWants() {
      if (abed()) return BED_DECIDE;
      if (phase === 'standby') return BED_STANDBY;
      if (phase === 'free' && seen.size >= 2) return BED_TURNIN;
      return BED_NOTHING;      // 'standbybed' included: the event owns the screen
    }
    function interactPile() {
      if (getState() !== 'play' || pileDist() >= INTERACT_R) return false;
      switch (bedWants()) {
        case BED_DECIDE: startDecision(); return true;
        /* v8.7 (Chad): "the player must tap on his bed to officially begin
           and trigger the standby bed minigame". It used to start itself the
           moment he was within two metres of the bed, which is why walking
           back from the balcony could begin a timed test before the player
           had looked up. */
        case BED_STANDBY: setPhase('standbybed'); runStandbyBed(); return true;
        case BED_TURNIN: beginLightsOut(); return true;
        default: return false;
      }
    }
    if (kit) {
      kit.objective(DATA.words.objArrive);
      kit.waypoint({ x: PILE_POS.x, y: 1.0, z: PILE_POS.z });
      kit.setPhase('arrive');
    }

    /* --------------------------------------------------------- hotspots */
    const seen = new Set();
    /* v7.5 put a hotspot on the toilet door, because the leaf read as a wall
       and Chad got stuck behind it. v8.9 removes the hotspot instead of
       teaching the player to use it: the door simply stands open (see
       `DOOR_PLAY` above), so walking in and out needs no interaction at all —
       which is what he asked for, and is one fewer thing between him and the
       three things in that block he is actually meant to look at.
       v9.1 removes the ENTRANCE hotspot too, with the entrance itself (Chad:
       "remove the dark red corridor and the corridor interaction since it
       looks useless and pointless"). It offered a prompt and answered it by
       returning false — a thing to walk up to that does nothing — and the
       −z wall is solid now, so there is nothing there to ask about. */
    const hotspots = [
      /* the anchors sit at EYE height: a hotspot must be on screen to be offered, and a
         doorway's floor point is 44° under the lens from a metre away — outside the view */
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
            after((SECS.k1board || 2.5) + 0.2, () => { if (bunkmate.cur === TALK_NOSL) bunkmate.play('Idle_9', 1, 0.4); });
            after((SECS.k1board || 2.5) + 0.4, () => sayLine('n1board'));
          });
        } },
      { id: 'bunkmate', pos: { x: 1.75, y: 1.3, z: -3.15 }, radius: 2.0, prompt: DATA.words.hotBunkmate,
        enabled: () => phase === 'free' && bunkmate.group.visible && seen.has('board'),
        onInteract() {
          seen.add('bunkmate');
          return castSay(bunkmate, 'k1three', TALK_NOSL, 'Idle_9');
        } }
    ];

    /* ------------------------------------------------------ per frame --- */
    const _v = new THREE.Vector3();
    function updatePile(t) {
      if (getState() === 'cine') { pileRing.visible = false; zone.visible = false; return; }
      const near = THREE.MathUtils.clamp((6 - pileDist()) / (6 - INTERACT_R), 0, 1);
      pileRing.visible = near > 0.01 && phase !== 'lightsout';
      pileRing.material.opacity = near * (0.62 + 0.38 * Math.sin(t * 2.6)) * (abed() ? 0.7 : 0.45);
      drawZone();
    }
    /* v8.7: the glow breathes and the radar sweeps. WALL TIME drives both —
       not the frame count (which stutters) and not the world clock (which a
       cutscene or a slow box can stretch) — so the sweep runs at one real
       speed on every device. Three bands a third of a period apart means one
       is always on its way out; each eases from the centre and fades as it
       widens, which is what stops it reading as a ring that restarts. */
    const WAVE_SECS = 2.1;
    let flareAt = 0;
    function drawZone() {
      const on = zoneOn();
      if (zone.visible !== on) zone.visible = on;
      if (!on) return;
      const now = performance.now() / 1000;
      zoneFlare = Math.max(0, 1 - (now - flareAt) / 0.7);
      const br = 0.5 + 0.5 * Math.sin(now * 2.0);           // the slow breath
      zoneFill.material.opacity = 0.50 + 0.16 * br + 0.30 * zoneFlare;
      zoneRim.material.opacity = 0.70 + 0.28 * br + 0.9 * zoneFlare;
      for (let i = 0; i < WAVES; i++) {
        const k = (((now / WAVE_SECS) + i / WAVES) % 1);    // 0..1, one full sweep
        const e = k * (2 - k);                              // ease out: fast away, settling at the rim
        zoneWaves[i].scale.setScalar(Math.max(0.001, 0.06 + 0.94 * e));
        // up quickly out of the centre, then away to nothing at the edge
        zoneWaves[i].material.opacity = 0.75 * Math.min(1, k * 6) * (1 - k) * (1 - k);
      }
    }
    /* WHEN the bed is a place to get to: on arrival, when the section has
       been sent back to it, and once lights out has been called for. The
       minigame's own phase turns it off — the overlay owns the screen. */
    function zoneOn() {
      if (phase === 'arrive') return !arrivedAt;
      if (phase === 'standby') return true;
      if (phase === 'free') return freeWarned;
      return false;
    }
    /* ------------------------------------------------- v9.2 · the camp outside
       Chad: "Maybe ambient sound effects are other platoons marching
       outside." There are two halves to that and they are different things.

       THE BED is `campamb`, and what it is keyed to is `outK` — 0 at his own
       bed, 1 once he is out on the square. The ramp runs from the balcony
       door to the far side of the balcony rather than from the bunk's middle,
       because that is where the room stops: past BALC.x0 there is no wall
       between him and the camp. mixBeds() is called only when outK has
       actually moved a hundredth, because the mix is rewritten into
       DATA.ambience.beds and the engine's ambient frame re-asserts every
       declared volume every frame — writing the same numbers on every one of
       them would be work for nothing.

       THE PLATOON is `platoonmarch`, a 16-second pass-by: measured, it swells
       from -63 dBFS to -32 at six seconds and recedes to -71, which is a
       body of men marching past a long way off rather than a loop of boots.
       So it is fired as an EVENT, not laid in as a bed — occasionally, at a
       distance, louder when he is outside where he could actually hear it.
       It runs only in the DAY's phases: nobody marches a platoon at three in
       the morning, and the night belongs to the shower and to her.

       The interval is dealt from the chapter's own stream so a run is
       reproducible, and `marchAt` is stated in `dayClock` — which means
       reset() must clear it, the v8.1/v8.2/v8.7 law a fourth time. */
    const PLATOON_GAP = [46, 82];        // seconds between pass-bys
    let marchAt = 0, marchSeed = 7, marchN = 0;
    const DAY_PHASE = { arrive: 1, fallin: 1, punish: 1, standby: 1, standbybed: 1, free: 1 };
    function marchRand() {               // a deterministic stream, not Math.random
      marchSeed = (marchSeed * 1664525 + 1013904223) >>> 0;
      return marchSeed / 4294967296;
    }
    function ambientTick() {
      /* how far out of the room he is: 0 inside, 1 on the square */
      const k = Math.max(0, Math.min(1, (yaw.position.x - (R.x - 1.5)) / (BALC.x1 - (R.x - 1.5))));
      if (Math.abs(k - outK) > 0.01) { outK = k; mixBeds(); }
      if (!DAY_PHASE[phase]) { marchAt = 0; return; }
      if (!marchAt) { marchAt = dayClock.t + 16 + marchRand() * 14; return; }
      if (dayClock.t < marchAt) return;
      /* worldSfx hands back null when the sample has not decoded; try again
         shortly rather than losing the pass-by (the v8.0 law) */
      if (worldSfx && worldSfx('platoonmarch', 0.34 + 0.40 * outK)) {
        marchN++;
        marchAt = dayClock.t + PLATOON_GAP[0] + marchRand() * (PLATOON_GAP[1] - PLATOON_GAP[0]);
      } else marchAt = dayClock.t + 1.5;
    }

    /* the day's watchers, on the chapter's own clock */
    let dayLast = 0, lastFreeze = 0;
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
      /* v8.6: models arrive async long after build(), so the freeze is
         re-applied rather than done once — and only in PLAY, never under a
         cutscene, which owns the world (see freezeStatic). */
      if (dayClock.t > 2 && !frozen) freezeStatic(true);
      else if (frozen && dayClock.t - lastFreeze > 6) { lastFreeze = dayClock.t; refreeze(); }
      runTodo();
      runTweens(d);
      marchTick(d); crowdMarchTick(d);      // v8.2: the section, on real legs
      runSpeak();                 // v8.0: a held line, the moment its bytes land
      ambientTick();              // v9.2: the camp outside, and the platoons in it
      /* v7.2: reaching the bed used to fire the whistle on the same frame as
         his "That's mine. Bed one." — the line lands first now, then the
         whistle, then the sergeant */
      if (phase === 'arrive' && pileDist() < ZONE_R && !arrivedAt) {
        arrivedAt = dayClock.t;
        reachedBed('arrive');
        after(2.6, () => { if (phase === 'arrive') beginFallIn(); });
      }
      else if (phase === 'fallin' && yaw.position.x > LINE_X) onTheLine();
      /* v8.7 (Chad): "the player must tap on his bed to officially begin and
         trigger the standby bed minigame". Reaching the circle no longer
         STARTS it — it confirms the arrival and hands the player the press.
         Walking back from the balcony used to open a timed reaction test
         before anyone had looked up. */
      else if (phase === 'standby' && pileDist() < ZONE_R && !stoodBy) { stoodBy = true; reachedBed('standby'); }
      else if (phase === 'free' && freeTimer && !freeWarned && freeTimer.left() <= FREE_WARN) {
        freeWarned = true;
        if (kit) { kit.objective(DATA.words.objWarn, { complete: false }); kit.waypoint({ x: PILE_POS.x, y: 1.0, z: PILE_POS.z }); }
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
      /* v9.1: the folded blanket is Chad's model's now (superseded in mkBed),
         so a bed that is not slept in shows the model's own made mattress.
         Never write `.visible = true` here — that would resurrect a
         superseded mesh the next time the lights went out. */
      for (const b of beds) { if (!b.model) b.low.fold.visible = !on || b.his || !sleepers.find(s => s.bed === b); }
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
    /* ---- v8.6: THE STATIC MESHES STOP RECOMPUTING THEIR MATRIX -------

       A mesh with `matrixAutoUpdate` on composes its local matrix from
       position/quaternion/scale on EVERY frame, and that sets
       `matrixWorldNeedsUpdate`, which then forces every descendant to
       recompute its world matrix too. For a bed that has not moved since
       build() that is pure waste, and this chapter has a lot of them: 3,126
       objects in the scene, of which the film's three sets alone are 2,136.

       WHICH ONES ARE SAFE was MEASURED, not guessed (`dbg-movers.mjs`):
       every object's local matrix sampled 130 times across the whole opening
       film and a full day of play. 569 objects ever changed — and 552 of
       them are BONES, driven by the mixers. Of the seventeen that are not,
       every single one is a Group or an Object3D: a cast member's group, a
       crowd copy's group, the camera rig, the ferry's swell.

       NO MESH EVER MOVES, because this chapter animates by turning GROUPS:
       the fan is a Group whose blades are fixed inside it, the toilet door
       is a leaf parented to a rotating pivot, and the wall clock is a
       redrawn TEXTURE with no moving geometry at all. So the rule is simply
       "meshes freeze, groups and bones never" — safe by construction rather
       than by a list that could go stale. Skinned meshes are left alone too,
       though their nodes are static: they cost 108 composes against the
       thousands this saves, and their skinning is delicate.

       AND IT LIFTS FOR EVERY CUTSCENE. A scene may move anything it likes,
       so the freeze is released in snap() — which the engine calls when a
       cutscene takes the world — and re-applied in restore(). Play is long
       and a scene is short, so the saving is kept where it matters and the
       risk is removed where it would bite.                                */
    let frozen = false;
    function freezeStatic(on) {
      if (on === frozen) return;
      world.traverse(o => {
        if (!o.isMesh || o.isSkinnedMesh) return;
        /* v8.7: ...and never anything that MOVES. v8.6 froze every non-skinned
           mesh in the world, which is right for a wall and catastrophic for
           the bed zone's radar rings: their scale was written every frame and
           composed into a matrix only when `refreeze()` ran, six seconds
           apart, so the ring jumped in six visible steps instead of sweeping.
           A mesh that animates its own transform declares it. */
        if (o.userData.moves) { o.matrixAutoUpdate = true; return; }
        if (on) { o.updateMatrix(); o.matrixAutoUpdate = false; }
        else o.matrixAutoUpdate = true;
      });
      frozen = on;
    }
    /* Models arrive async long after build(), so the freeze is re-applied
       rather than done once: `refreeze()` thaws and re-freezes, and the day
       clock calls it a few seconds in and after each phase change. */
    function refreeze() { if (frozen) { freezeStatic(false); freezeStatic(true); } }

    function snap() {
      freezeStatic(false);          // v8.6: a scene may move anything it likes
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
      bunkCrowdShow(!s.night);
      fallOut(false, true);          // v8.2: a restored room is stood in, never run into         // v8.1
      for (const r of [sergeant, buddy, bunkmate, encik]) if (r.acts && r.idle) r.play(r.idle, 1, 0);
      freezeStatic(true);            // v8.6: the scene is done; the room goes still again
    }
    function reset() {
      freezeStatic(false);           // v8.6: thaw before a replay moves anything
      ferryRoot.visible = jettyRoot.visible = paradeRoot.visible = false;   // v7.9: the film's three sets, in case a film was cut before its own step hid them
      doorPivot.rotation.y = DOOR_PLAY; fanSpeed = 1; setShower(false);
      ghostFig.group.visible = false; water.material.opacity = 0.55; hisBed.low.on.visible = false;
      setNightRoom(false);                       // v7.5: leaves the evening lamps lit
      putSergeant(SGT_DOOR, true);               // v8.2: a reset stands them there, never walks them
      /* v8.2: AND THE SECTION COMES BACK IN. `fallOut(true)` puts eight men
         on the balcony and only `fallOut(false)` brings them back — which
         reset() never called, so a replay taken during or after the fall-in
         began the new morning with an empty bunk and the whole section
         already lined up outside. Measured on the shipped build: buddy,
         bunkmate and all six recruits still at x 7.40 after reset(). Safe
         before the first fall-in, because BUNK_AT is empty and the loop
         simply finds nothing to put back. */
      fallOut(false, true);
      dropTodo(); tweens.length = 0;
      nightK = 0; showerVol = 0; mixBeds();
      seen.clear(); bedTries = 0; fallLate = false; fallTimer = null; arrivedAt = 0;
      /* v8.7, the v8.1/v8.2 law again: anything a PHASE stated has to be
         cleared by whatever resets that phase, or the next run inherits it —
         a replay would begin with the bed already "reached". */
      stoodBy = false; zoneFlare = 0; flareAt = 0; zone.visible = false;
      booted = false; dayClock.t = 0;
      speakReset(); encTalkN = 0;      // v8.1: the mute window is in the clock that just went back to zero
      marchAt = 0; marchSeed = 7; marchN = 0; outK = 0;   // v9.2: the pass-by's next time is in that same clock
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
      /* v9.2, and it exists because a probe CANNOT see this any other way:
         `worldSfx` calls the engine's `snd()` directly and never touches
         `stingLog`, so the cue log is blind to the pass-by exactly as it is
         to the whistle and the push-ups. Reporting it here is the same move
         as v5.29's `seatStats()` — a claim about the mix that stays
         checkable instead of being taken on trust. */
      ambient: () => ({ outK: +outK.toFixed(3), marches: marchN,
                        nextMarchIn: marchAt ? +(marchAt - dayClock.t).toFixed(1) : null }),
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
