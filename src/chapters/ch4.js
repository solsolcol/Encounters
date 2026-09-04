/* Chapter 4 · Back Home
   ---------------------------------------------------------------------------
   The evening after the tentage. He walked around outside until the sun went
   down, because the flat was the one place he did not want to be — and then
   there was nowhere else left to go. A living room at dusk: dining table,
   sofa, a CRT that is off, a 90s house phone, and a corridor with two doors
   deeper into the flat. Ma is working late. The flat is empty. The chapter
   is him at the dining table with three nights laid out in front of him.

   THE AXIS (the escalation contract): ch1 was DISTANCE, ch2 SMALLNESS, ch3
   INVERSION — she would not come into the tent. This is INTRUSION: he walked
   past her to get home, and home is no longer neutral ground. The haunting
   is ON again, gentle interior numbers, her ground the kitchen doorway and
   the corridor mouth — the dark parts of his own flat.

   Chad's direction, verbatim constraints: evening; 'connect the patterns'
   is a FLASHBACK montage; 'ask for help' is a call to Ma on the old house
   phone and she promises the tang-ki will come TOMORROW (chapter 5's
   setup); the interactable is a dining chair — sit down and think; and the
   hell note is NOWHERE in this chapter. The tang-ki finds it in chapter 5.

   Same contract as every chapter: build(ctx) -> stage, intro(c,s,api),
   scenes[i](c,s,api). Source: docs/source/trial-game-chapters.md, episode
   one, chapter four — choices and teachings verbatim, deltas rescaled to
   the game's thirty-scale like chapters 2 and 3 before it.               */

(() => {
  'use strict';

  let S = null;

  const DATA = {
    id: 4,
    title: 'Back Home',

    cardLabel: 'Chapter 4',
    cardTitle: 'Back Home<br>It Knows Where I Live',

    brief: 'The evening after the tentage. You stayed out all day, and now the sun is down and there is nowhere left to go but home. Ma is working late. The flat is empty, the lights are on, and none of that helps.',
    prompt: 'You know something is following you. What do you do about it, tonight?',

    choices: [
      {
        k: 'A', text: 'Connect the dots.',
        d: { sanity: 3, awareness: 30, wisdom: 27 },
        verdict: 'good',
        say: 'You review the sequence. A pattern begins to emerge. The events no longer feel random.',
        teach: 'Look for patterns before jumping to conclusions. Context matters.'
      },
      {
        k: 'B', text: 'Ignore it and sleep.',
        d: { sanity: -20, awareness: -6, wisdom: -11 },
        verdict: 'bad',
        say: 'You convince yourself nothing is wrong and try to sleep. You wake later to the same unsettling atmosphere.',
        teach: 'Dismissal is not discernment. Repeated warning signs deserve careful assessment.'
      },
      {
        k: 'C', text: 'Provoke the presence.',
        d: { sanity: -30, awareness: 3, wisdom: -30 },
        verdict: 'worst',
        say: 'The environment reacts violently. Provocation added danger without giving understanding.',
        teach: 'Never provoke what you do not understand merely to prove that it exists.'
      },
      {
        k: 'D', text: 'Ask for help again.',
        d: { sanity: 16, awareness: 16, wisdom: 30 },
        verdict: 'best',
        say: 'You stop trying to handle this alone. Help is coming tomorrow. Tonight, mom\'s voice is enough.',
        teach: 'Knowing when to seek qualified guidance is a form of wisdom.'
      }
    ],
    core: 'A pattern seen clearly is half the answer.<br><i>Yoniso manasikāra — wise attention to how things arise.</i>',

    /* --- the stage ------------------------------------------------------
       The living/dining room is x -3.2..3.2, z -2.6 (the window wall) to
       +2.8 (the corridor wall), ceiling 2.6. The corridor stub runs on
       past +z, and the flashback sets live forty metres off at -x where
       the fog and the dark keep them until scene A raises their lights. */
    spawn:     { x: -1.1, y: 1.62, z: 1.6 },     // just in from the front door
    /* `shrine` is the engine's anchor for HER territory. Here it is the
       dining chair — the place the chapter asks you to sit, which is also
       the middle of her ground: thinking it through means staying inside
       the flat with her. */
    shrine:    { x: 1.3, z: 0.25 },              // the chair he thinks on
    ghostHome: { x: -2.7, z: -1.4 },             // the dark kitchen doorway
    bounds:    { minX: -3.05, maxX: 3.05, minZ: -2.45, maxZ: 3.55 },

    /* v4.91, Chad's call: she is NEVER SEEN in this chapter — not in play,
       not in a scene, and her string leitmotif is never cued. The haunting
       is the flat itself: footsteps in the kitchen, a light that dips, a
       chair dragged in an empty room (the poltergeist timer in build()).
       That is creepier, and it loads chapter 5: whatever followed him home
       does not need to be visible to be HERE. */
    ghost: null,

    /* dusk: amber dying at the horizon, violet over it, the first stars.
       The sun is below the roofline, so the key is a last low ember and
       the room's own lights carry the interior. */
    daylight: {
      stops: [[0.00, '#e08a4e'], [0.16, '#b45f4c'], [0.34, '#7e4a5e'],
              [0.58, '#453360'], [0.80, '#2a2547'], [1.00, '#191c33']],
      bg: 0x2a2547,
      fog: [0x372f4e, 0.010],
      hemi: [0x8a7bb0, 0x3a3226, 0.50],
      key: [0xff9a5e, 0.50, -20, 3, -8],   // the west, going out
      fill: [0x5a6a9c, 0.20],
      stars: 0.35, moon: 0,
      sun: 0, clouds: 0.35,
      vmHemi: [0xc9b8d8, 0x4a4034, 0.60],
      vmKey: [0xffd9a8, 0.55]              // the hands live in lamp light
    },

    /* hdb is the block opposite, out the living room window — the fourth
       chapter to reuse it, which is the point: all of this happens at one
       block. seat is chapter 3's red plastic chair, back for one shot in
       the flashback. NO hellnote: it is not seen in this chapter.        */
    assets: ['hdb', 'seat', 'altar', 'sofa'],

    /* The room's own sound: an evening, not a night — crickets and traffic
       far down, the clock, the fan. The explore music sits a little lower
       than midnight's; the room is meant to feel almost safe.            */
    musicVol: 0.8,
    ambience: { beds: [['v4room', 0.22], ['clock', 0.10], ['fan', 0.16]],
                atShrine: null },
    words: {
      approach: 'The flat is too quiet tonight...',
      act: 'E at the dining chair',
      actTouch: 'tap the dining chair',
      interact: 'Sit down and think it through',
      interactTouch: 'the dining chair'
    },
    lines: { near: 'v4near', close: 'v4sit', nearAt: 3.2 },
    voiceLine: 'v4voice',
    sayPrefix: 'v4'
  };

  /* ====================================================================== */
  /* THE WORLD                                                              */
  /* ====================================================================== */

  function build(ctx) {
    const { THREE, GLTFLoader, scene, camera, yaw, LOW,
            assetBytes, rescueTextures, redoShadows,
            cnv, makeSoftDot, makeConcrete, makeLacquer,
            makeHellNote, getState, startDecision, worldSfx } = ctx;

    const SHRINE = new THREE.Vector3(DATA.shrine.x, 0, DATA.shrine.z);

    const owned = [];
    let alive = true;

    const R = { x: 3.2, z: 2.6, zNear: 2.8, h: 2.6, wall: 0.12 };

    /* ------------------------------------------------------------ textures */
    const cTex = makeConcrete();
    const lacquerTex = makeLacquer();
    const noteTex = makeHellNote();      // the contract wants one; no mesh uses it
    const dotTex = makeSoftDot('rgba(255,240,214,0.9)', 'rgba(255,240,214,0)');

    const wallMap = cTex.map.clone(); wallMap.needsUpdate = true;
    wallMap.repeat.set(3.0, 1.6);
    const matWall = new THREE.MeshStandardMaterial({
      map: wallMap, color: 0xb0a693, roughness: 0.96, metalness: 0 });
    const matCeil = new THREE.MeshStandardMaterial({ color: 0xcac4b6, roughness: 0.99 });
    const floorTex = makeTerrazzo4(cnv);
    const matFloor = new THREE.MeshStandardMaterial({
      map: floorTex, roughness: 0.6, metalness: 0.02 });

    const matWood = new THREE.MeshStandardMaterial({ color: 0x5d4023, roughness: 0.7, metalness: 0.03 });
    const matWoodDark = new THREE.MeshStandardMaterial({ color: 0x33241a, roughness: 0.8 });
    const matFabric = new THREE.MeshStandardMaterial({ color: 0x4f6156, roughness: 0.96 });
    const matCushion = new THREE.MeshStandardMaterial({ color: 0x5d7266, roughness: 0.95 });
    const matMetal = new THREE.MeshStandardMaterial({ color: 0x4a4f57, roughness: 0.5, metalness: 0.8 });
    const matPaint = new THREE.MeshStandardMaterial({ color: 0xd8d2c4, roughness: 0.7 });
    const matCream = new THREE.MeshStandardMaterial({ color: 0xe4ddcb, roughness: 0.65 });
    const matLacquer = new THREE.MeshStandardMaterial({ map: lacquerTex, roughness: 0.42, metalness: 0.18 });
    const matGlass = new THREE.MeshStandardMaterial({
      color: 0x2a3040, roughness: 0.15, metalness: 0.1, transparent: true, opacity: 0.30 });
    const matVoid = new THREE.MeshBasicMaterial({ color: 0x000000, fog: false });
    const matScreen = new THREE.MeshBasicMaterial({ color: 0x0a0c0e, fog: false });

    const world = new THREE.Group();
    scene.add(world);

    /* ---------------------------------------------------------- the shell */
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(R.x * 2, R.z + R.zNear), matFloor);
    floor.rotation.x = -Math.PI / 2;
    floor.position.z = (R.zNear - R.z) / 2;
    floor.receiveShadow = true;
    world.add(floor);
    const ceil = new THREE.Mesh(
      new THREE.PlaneGeometry(R.x * 2, R.z + R.zNear), matCeil);
    ceil.rotation.x = Math.PI / 2;
    ceil.position.set(0, R.h, (R.zNear - R.z) / 2);
    world.add(ceil);

    const walls = [];
    function wall(w, h, d, x, y, z, mat = matWall) {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
      m.position.set(x, y, z);
      m.castShadow = true; m.receiveShadow = true;
      world.add(m); walls.push(m);
      return m;
    }

    // window wall (-z): a wide living room window with a low sill
    const WIN = { x: -0.4, w: 3.6, sill: 0.90, top: 2.20 };
    const zFar = -R.z - R.wall / 2;
    wall(R.x * 2, WIN.sill, R.wall, 0, WIN.sill / 2, zFar);
    wall(R.x * 2, R.h - WIN.top, R.wall, 0, (R.h + WIN.top) / 2, zFar);
    const winL = WIN.x - WIN.w / 2, winR = WIN.x + WIN.w / 2;
    const lwRun = winL - (-R.x), rwRun = R.x - winR;
    wall(lwRun, WIN.top - WIN.sill, R.wall, -R.x + lwRun / 2, (WIN.sill + WIN.top) / 2, zFar);
    wall(rwRun, WIN.top - WIN.sill, R.wall, R.x - rwRun / 2, (WIN.sill + WIN.top) / 2, zFar);

    /* kitchen wall (-x), with the dark doorway near the window corner —
       her mouth of the flat. The stub behind it is four surfaces and a
       fridge shape in blackness. */
    const KDOOR = { z: -1.4, w: 1.0, h: 2.05 };
    const xKit = -R.x - R.wall / 2;
    wall(R.wall, R.h, (KDOOR.z - KDOOR.w / 2) - (-R.z),
         xKit, R.h / 2, ((KDOOR.z - KDOOR.w / 2) + (-R.z)) / 2);
    wall(R.wall, R.h, R.zNear - (KDOOR.z + KDOOR.w / 2),
         xKit, R.h / 2, (R.zNear + KDOOR.z + KDOOR.w / 2) / 2);
    wall(R.wall, R.h - KDOOR.h, KDOOR.w, xKit, (R.h + KDOOR.h) / 2, KDOOR.z);
    // the stub: floor, walls, and a fridge you can barely make out
    const kit = new THREE.Group();
    kit.position.set(-R.x - 1.0, 0, KDOOR.z);
    world.add(kit);
    const kitFloor = new THREE.Mesh(new THREE.PlaneGeometry(2.0, 2.2), matFloor);
    kitFloor.rotation.x = -Math.PI / 2;
    kit.add(kitFloor);
    const kitBack = new THREE.Mesh(new THREE.PlaneGeometry(2.2, R.h), matWall);
    kitBack.rotation.y = Math.PI / 2;
    kitBack.position.set(-1.0, R.h / 2, 0);
    kit.add(kitBack);
    const fridge = new THREE.Mesh(new THREE.BoxGeometry(0.6, 1.5, 0.55), matCream);
    fridge.position.set(-0.6, 0.75, 0.6);
    kit.add(fridge);
    /* the stub is ENCLOSED — sides and ceiling — because an open box forty
       degrees of violet dusk pours through is not a dark kitchen, it is a
       hole in the set. Lightless and walled, it goes black on its own. */
    for (const kz of [-1.1, 1.1]) {
      const kw = new THREE.Mesh(new THREE.BoxGeometry(2.0, R.h, 0.1), matWall);
      kw.position.set(0, R.h / 2, kz);           // flush: back wall to main wall
      kit.add(kw);
    }
    const kitCeil = new THREE.Mesh(new THREE.PlaneGeometry(2.0, 2.3), matCeil);
    kitCeil.rotation.x = Math.PI / 2;
    kitCeil.position.set(0, R.h - 0.02, 0);
    kit.add(kitCeil);
    const kitDark = kit;                       // the cast name the scenes use

    // right wall (+x), solid — the sofa's wall
    wall(R.wall, R.h, R.z + R.zNear, R.x + R.wall / 2, R.h / 2, (R.zNear - R.z) / 2);

    /* corridor wall (+z): the mouth of the corridor at x 1.6..2.5, and the
       front door at x -2.2. Everything between is plaster. */
    const CORR = { x0: 1.6, x1: 2.5, h: 2.05 };
    const DOORM = { x: -2.2, w: 0.90, h: 2.05 };
    const zNear2 = R.zNear + R.wall / 2;
    wall(R.x * 2, R.h - CORR.h, R.wall, 0, (R.h + CORR.h) / 2, zNear2);
    wall((DOORM.x - DOORM.w / 2) - (-R.x), CORR.h, R.wall,
         (-R.x + DOORM.x - DOORM.w / 2) / 2, CORR.h / 2, zNear2);
    wall(CORR.x0 - (DOORM.x + DOORM.w / 2), CORR.h, R.wall,
         (DOORM.x + DOORM.w / 2 + CORR.x0) / 2, CORR.h / 2, zNear2);
    wall(R.x - CORR.x1, CORR.h, R.wall, (CORR.x1 + R.x) / 2, CORR.h / 2, zNear2);

    // skirting all round
    const skirtMat = new THREE.MeshStandardMaterial({ color: 0x7d7466, roughness: 0.85 });
    for (const [w, d, x, z] of [[R.x * 2, 0.03, 0, -R.z + 0.015],
                                [R.x * 2, 0.03, 0, R.zNear - 0.015],
                                [0.03, R.z + R.zNear, -R.x + 0.015, (R.zNear - R.z) / 2],
                                [0.03, R.z + R.zNear, R.x - 0.015, (R.zNear - R.z) / 2]]) {
      const s = new THREE.Mesh(new THREE.BoxGeometry(w, 0.09, d), skirtMat);
      s.position.set(x, 0.045, z);
      world.add(s);
    }

    /* ------------------------------------------------ the corridor beyond */
    const hall = new THREE.Group();
    world.add(hall);
    const hz0 = R.zNear + R.wall, hz1 = hz0 + 3.0;
    /* the floor runs 25 cm back INTO the doorway so the wall-thickness strip
       between the flat's floor and the hall's is covered — without the overlap
       the skydome shines up through that seam as a pink line at the threshold */
    const hallFloor = new THREE.Mesh(new THREE.PlaneGeometry(CORR.x1 - CORR.x0 + 1.4, 3.25), matFloor);
    hallFloor.rotation.x = -Math.PI / 2;
    hallFloor.position.set((CORR.x0 + CORR.x1) / 2, 0.001, hz0 + 1.375);
    hall.add(hallFloor);
    const hallCeil = new THREE.Mesh(new THREE.PlaneGeometry(CORR.x1 - CORR.x0 + 1.4, 3.0), matCeil);
    hallCeil.rotation.x = Math.PI / 2;
    hallCeil.position.set((CORR.x0 + CORR.x1) / 2, R.h - 0.15, hz0 + 1.5);
    hall.add(hallCeil);
    const hallWallL = new THREE.Mesh(new THREE.BoxGeometry(R.wall, R.h, 3.0), matWall);
    hallWallL.position.set(CORR.x0 - 0.35, R.h / 2, hz0 + 1.5);
    hall.add(hallWallL); walls.push(hallWallL);
    const hallWallR = new THREE.Mesh(new THREE.BoxGeometry(R.wall, R.h, 3.0), matWall);
    hallWallR.position.set(CORR.x1 + 0.35, R.h / 2, hz0 + 1.5);
    hall.add(hallWallR); walls.push(hallWallR);
    const hallEnd = new THREE.Mesh(new THREE.BoxGeometry(CORR.x1 - CORR.x0 + 1.4, R.h, R.wall), matWall);
    hallEnd.position.set((CORR.x0 + CORR.x1) / 2, R.h / 2, hz1);
    hall.add(hallEnd); walls.push(hallEnd);
    /* his bedroom door in the left corridor wall, AJAR at chapter 2's own
       angle — the same door seen from the other side of the flat — and
       Ma's, shut, further down. Set dressing; the corridor is bounded. */
    const bedDoor = new THREE.Mesh(new THREE.BoxGeometry(0.05, 1.96, 0.80), matPaint);
    bedDoor.position.set(CORR.x0 - 0.28, 0.98, hz0 + 0.85);
    bedDoor.rotation.y = 0.62;                    // ajar, hinged upstream
    hall.add(bedDoor);
    const maDoor = new THREE.Mesh(new THREE.BoxGeometry(0.05, 1.96, 0.80), matPaint);
    maDoor.position.set(CORR.x0 - 0.285, 0.98, hz0 + 2.3);
    hall.add(maDoor);
    const calendar = new THREE.Mesh(new THREE.PlaneGeometry(0.30, 0.42),
      new THREE.MeshStandardMaterial({ color: 0xd9d2bf, roughness: 0.9 }));
    calendar.rotation.y = -Math.PI / 2;
    calendar.position.set(CORR.x1 + 0.285, 1.5, hz0 + 1.2);
    hall.add(calendar);
    const calBar = new THREE.Mesh(new THREE.PlaneGeometry(0.30, 0.07),
      new THREE.MeshStandardMaterial({ color: 0x8c1f18, roughness: 0.8 }));
    calBar.rotation.y = -Math.PI / 2;
    calBar.position.set(CORR.x1 + 0.282, 1.68, hz0 + 1.2);
    hall.add(calBar);

    /* ------------------------------------------------------ the front door */
    /* Hinged at its low-x jamb and it opens INWARD, into the flat. The sign
       contract, written down (chapter 2's lesson, twice over):
         rotation.y   0     shut, flush in the frame
                     -1.45  wide open, the leaf along the inside wall
       Positive would swing it through the corridor outside.              */
    const doorMain = new THREE.Group();
    doorMain.position.set(DOORM.x - DOORM.w / 2, 0, R.zNear);
    world.add(doorMain);
    const DOORM_OPEN = -1.45;
    const doorLeaf = new THREE.Mesh(new THREE.BoxGeometry(DOORM.w, DOORM.h - 0.04, 0.05), matWoodDark);
    doorLeaf.geometry.translate(DOORM.w / 2, 0, 0);
    doorLeaf.position.set(0, (DOORM.h - 0.04) / 2, 0);
    doorLeaf.castShadow = true;
    doorMain.add(doorLeaf);
    const knobM = new THREE.Mesh(new THREE.SphereGeometry(0.035, 10, 8), matMetal);
    knobM.position.set(DOORM.w - 0.09, 1.02, -0.06);
    doorMain.add(knobM);
    // the gate every flat has, folded open against the outside wall: bars
    const gate = new THREE.Group();
    gate.position.set(DOORM.x + DOORM.w / 2 + 0.06, 0, R.zNear + 0.10);
    world.add(gate);
    for (let i = 0; i < 5; i++) {
      const b = new THREE.Mesh(new THREE.BoxGeometry(0.016, DOORM.h - 0.1, 0.016), matMetal);
      b.position.set(0.02, (DOORM.h - 0.1) / 2, i * 0.05);
      gate.add(b);
    }
    // mat and shoe rack, inside
    const doorMat = new THREE.Mesh(new THREE.PlaneGeometry(0.66, 0.4),
      new THREE.MeshStandardMaterial({ color: 0x5d4a35, roughness: 1 }));
    doorMat.rotation.x = -Math.PI / 2;
    doorMat.position.set(DOORM.x, 0.005, R.zNear - 0.45);
    world.add(doorMat);
    const shoeRack = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.34, 0.26), matWoodDark);
    shoeRack.position.set(DOORM.x + 1.0, 0.17, R.zNear - 0.22);
    shoeRack.castShadow = true;
    world.add(shoeRack);

    /* -------------------------------- outside the front door (film set) --
       A sliver of common corridor: floor, parapet, and the dusk over it.
       Only the opening film stands out here. */
    const outCorr = new THREE.Group();
    world.add(outCorr);
    const ocFloor = new THREE.Mesh(new THREE.PlaneGeometry(6.0, 2.15), matFloor);
    ocFloor.rotation.x = -Math.PI / 2;
    ocFloor.position.set(DOORM.x + 1.0, 0.0005, R.zNear + 0.925);
    outCorr.add(ocFloor);
    const parapet = new THREE.Mesh(new THREE.BoxGeometry(6.0, 1.05, 0.14), matWall);
    parapet.position.set(DOORM.x + 1.0, 0.525, R.zNear + 1.95);
    outCorr.add(parapet); walls.push(parapet);
    const ocCeil = new THREE.Mesh(new THREE.PlaneGeometry(6.0, 1.9), matCeil);
    ocCeil.rotation.x = Math.PI / 2;
    ocCeil.position.set(DOORM.x + 1.0, R.h - 0.05, R.zNear + 1.05);
    outCorr.add(ocCeil);
    /* the corridor keeps going past the flat's west edge — without this the
       film's opening shot has open dusk sky a metre left of the door */
    const facadeExt = new THREE.Mesh(new THREE.PlaneGeometry(4.4, R.h), matWall);
    facadeExt.position.set(-R.x - 2.2, R.h / 2, R.zNear + 0.001);
    outCorr.add(facadeExt);
    const ocFloorW = new THREE.Mesh(new THREE.PlaneGeometry(4.4, 2.15), matFloor);
    ocFloorW.rotation.x = -Math.PI / 2;
    ocFloorW.position.set(-R.x - 2.2, 0.0005, R.zNear + 0.925);
    outCorr.add(ocFloorW);
    const parapetW = new THREE.Mesh(new THREE.BoxGeometry(4.4, 1.05, 0.14), matWall);
    parapetW.position.set(-R.x - 2.2, 0.525, R.zNear + 1.95);
    outCorr.add(parapetW);
    const ocCeilW = new THREE.Mesh(new THREE.PlaneGeometry(4.4, 1.9), matCeil);
    ocCeilW.rotation.x = Math.PI / 2;
    ocCeilW.position.set(-R.x - 2.2, R.h - 0.05, R.zNear + 1.05);
    outCorr.add(ocCeilW);

    /* -------------------------------------------------- window and outside */
    const winGroup = new THREE.Group();
    winGroup.position.set(WIN.x, 0, -R.z - 0.02);
    world.add(winGroup);
    const glass = new THREE.Mesh(new THREE.PlaneGeometry(WIN.w, WIN.top - WIN.sill), matGlass);
    glass.position.set(0, (WIN.sill + WIN.top) / 2, 0);
    winGroup.add(glass);
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x8a8578, roughness: 0.6, metalness: 0.4 });
    for (const fx of [-WIN.w / 2, -WIN.w / 6, WIN.w / 6, WIN.w / 2]) {
      const f = new THREE.Mesh(new THREE.BoxGeometry(0.035, WIN.top - WIN.sill, 0.04), frameMat);
      f.position.set(fx, (WIN.sill + WIN.top) / 2, 0.01);
      winGroup.add(f);
    }
    const barGeo = new THREE.BoxGeometry(0.02, WIN.top - WIN.sill, 0.02);
    for (let i = 0; i < 9; i++) {
      const b = new THREE.Mesh(barGeo, matMetal);
      b.position.set(-WIN.w / 2 + 0.2 + i * ((WIN.w - 0.4) / 8),
                     (WIN.sill + WIN.top) / 2, 0.05);
      winGroup.add(b);
    }
    /* v5.24: NO CURTAINS. Chad's call — "remove all curtains from the
       living room windows" — so the window is glass, frame and grille, and
       the evening comes through it unfiltered. What went with them: their
       billow, which nothing else drove, and the `billow` seam that only
       ever moved them (scene C's cloth moment is now carried by the fan,
       the dim and the boom that always ran beside it).                  */

    // the block opposite, and its windows coming on for the evening
    let hdbReady = false;
    assetBytes('hdb').then(BUF => new GLTFLoader().parse(BUF, '', (gltf) => {
      if (!alive) return;
      rescueTextures(gltf, BUF);
      const blk = gltf.scene;
      blk.scale.setScalar(0.001);
      blk.position.set(-3.5, -4.0, -21.0);
      blk.rotation.y = -0.14;
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

    const litMat = new THREE.MeshBasicMaterial({ color: 0xffd9a0, fog: false });
    const litGeo = new THREE.PlaneGeometry(0.9, 0.7);
    const litWins = [];
    for (const [lx, ly] of [[-5.2, 3.4], [-1.6, 6.1], [2.4, 2.2], [-7.8, 9.0],
                            [1.1, 11.6], [4.3, 7.4], [-3.3, 13.2]]) {
      const w2 = new THREE.Mesh(litGeo, litMat);
      w2.position.set(lx - 2.0, ly - 2.0, -20.4);
      world.add(w2); litWins.push(w2);
    }
    /* a few more that come on DURING the opening film — evening is other
       people getting home too. Off (invisible) until the film raises them. */
    const lateMat = new THREE.MeshBasicMaterial({
      color: 0xffd9a0, fog: false, transparent: true, opacity: 0 });
    const lateWins = [];
    for (const [lx, ly] of [[-6.4, 5.2], [0.2, 8.8], [3.2, 4.6]]) {
      const w2 = new THREE.Mesh(litGeo, lateMat);
      w2.position.set(lx - 2.0, ly - 2.0, -20.4);
      world.add(w2); lateWins.push(w2);
    }

    /* ------------------------------------------------------------ lighting */
    /* The room's own lights carry this chapter: a warm ceiling centre, the
       standing lamp by the sofa, the altar's red point. Evening comes in
       the window as a cool fill so the glass reads as outside.           */
    const ceilLight = new THREE.PointLight(0xffe2b8, LOW ? 2.4 : 3.2, 9.5, 1.35);
    ceilLight.position.set(0.5, R.h - 0.28, 0.2);
    ceilLight.castShadow = !LOW;
    if (ceilLight.shadow) {
      ceilLight.shadow.mapSize.set(LOW ? 256 : 512, LOW ? 256 : 512);
      ceilLight.shadow.bias = -0.0022;
    }
    scene.add(ceilLight); owned.push(ceilLight);
    // its fixture: a shallow dome and a tube that reads as the source
    const ceilFix = new THREE.Mesh(
      new THREE.CylinderGeometry(0.16, 0.20, 0.09, 16),
      new THREE.MeshStandardMaterial({ color: 0xd8d2c4, roughness: 0.6 }));
    ceilFix.position.set(0.5, R.h - 0.06, 0.2);
    world.add(ceilFix);
    const ceilTube = new THREE.Mesh(new THREE.CylinderGeometry(0.145, 0.185, 0.03, 16),
      new THREE.MeshBasicMaterial({ color: 0xfff2d8, fog: false }));
    ceilTube.position.set(0.5, R.h - 0.105, 0.2);
    world.add(ceilTube);

    const lampLight = new THREE.PointLight(0xffc98a, 1.7, 5.0, 1.6);
    lampLight.position.set(2.55, 1.42, 2.15);
    scene.add(lampLight); owned.push(lampLight);
    const lampPole = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.02, 1.34, 8), matMetal);
    lampPole.position.set(2.55, 0.67, 2.15);
    world.add(lampPole);
    const lampShade = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.2, 14, 1, true),
      new THREE.MeshStandardMaterial({ color: 0xd9b98a, roughness: 0.8, side: THREE.DoubleSide }));
    lampShade.position.set(2.55, 1.44, 2.15);
    world.add(lampShade);

    // the home altar's red bulb, high in the kitchen corner
    const altLight = new THREE.PointLight(0xff5a30, 2.2, 3.4, 1.7);
    altLight.position.set(-2.85, 1.85, -2.15);
    scene.add(altLight); owned.push(altLight);

    // the evening through the window: a broad cool fill that owns the glass
    const duskFill = new THREE.DirectionalLight(0x7a6ba8, 0.5);
    duskFill.position.set(-2, 4, -10);
    scene.add(duskFill); owned.push(duskFill);

    // the corridor outside the front door, for the film: dusk on concrete
    const outLight = new THREE.PointLight(0xc9a8ff, 0.9, 6.5, 1.6);
    outLight.position.set(DOORM.x + 0.8, 2.1, R.zNear + 1.0);
    scene.add(outLight); owned.push(outLight);

    /* ------------------------------------------------------ dining set --- */
    const TABLE = { x: 1.3, z: -0.6, w: 1.5, d: 0.9, top: 0.75 };
    const table = new THREE.Group();
    table.position.set(TABLE.x, 0, TABLE.z);
    world.add(table);
    const tableTop = new THREE.Mesh(new THREE.BoxGeometry(TABLE.w, 0.045, TABLE.d), matWood);
    tableTop.position.y = TABLE.top;
    tableTop.castShadow = true; tableTop.receiveShadow = true;
    table.add(tableTop);
    for (const [lx, lz] of [[-0.66, -0.36], [0.66, -0.36], [-0.66, 0.36], [0.66, 0.36]]) {
      const l = new THREE.Mesh(new THREE.BoxGeometry(0.06, TABLE.top, 0.06), matWoodDark);
      l.position.set(lx, TABLE.top / 2, lz);
      l.castShadow = true;
      table.add(l);
    }
    // a teapot and two cups: somebody lives here
    const pot = new THREE.Mesh(new THREE.SphereGeometry(0.075, 12, 10), matCream);
    pot.scale.y = 0.8;
    pot.position.set(-0.3, TABLE.top + 0.085, 0.1);
    pot.castShadow = true;
    table.add(pot);
    for (const cx of [-0.08, 0.10]) {
      const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.026, 0.05, 10), matCream);
      cup.position.set(cx, TABLE.top + 0.048, 0.16);
      table.add(cup);
    }

    function diningChair(x, z, ry) {
      const g = new THREE.Group();
      g.position.set(x, 0, z);
      g.rotation.y = ry;
      const seat = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.045, 0.42), matWood);
      seat.position.y = 0.46; seat.castShadow = true;
      g.add(seat);
      const back = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.5, 0.04), matWood);
      back.position.set(0, 0.73, -0.19); back.castShadow = true;
      g.add(back);
      for (const [lx, lz] of [[-0.18, -0.18], [0.18, -0.18], [-0.18, 0.18], [0.18, 0.18]]) {
        const l = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.46, 0.04), matWoodDark);
        l.position.set(lx, 0.23, lz);
        g.add(l);
      }
      world.add(g);
      return g;
    }
    /* THE CHAIR — the interactable — pulled a little out from the table on
       its window side, facing the window: he sits facing the block where
       all three nights happened. The other three tucked in. */
    const CHAIR = { x: DATA.shrine.x, z: DATA.shrine.z };
    const chairTh = diningChair(CHAIR.x, CHAIR.z, Math.PI);   // back to +z
    const chairs = [chairTh,
      diningChair(TABLE.x - 0.45, TABLE.z - 0.62, 0),
      diningChair(TABLE.x + 0.45, TABLE.z - 0.62, 0),
      diningChair(TABLE.x + 0.62, TABLE.z + 0.55, Math.PI + 0.14)];

    /* ------------------------------------------------------------- sofa -- */
    const sofa = new THREE.Group();
    sofa.position.set(2.62, 0, 1.15);
    sofa.rotation.y = -Math.PI / 2;             // facing -x, at the TV
    world.add(sofa);
    const sofaBase = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.42, 0.85), matFabric);
    sofaBase.position.y = 0.21;
    sofaBase.castShadow = true; sofaBase.receiveShadow = true;
    sofa.add(sofaBase);
    const sofaBack = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.52, 0.24), matFabric);
    sofaBack.position.set(0, 0.66, -0.30);
    sofaBack.castShadow = true;
    sofa.add(sofaBack);
    for (const ax of [-0.95, 0.95]) {
      const arm = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.30, 0.85), matFabric);
      arm.position.set(ax, 0.55, 0);
      arm.castShadow = true;
      sofa.add(arm);
    }
    for (const cx of [-0.62, 0, 0.62]) {
      const cu = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.1, 0.6), matCushion);
      cu.position.set(cx, 0.47, 0.05);
      sofa.add(cu);
    }

    /* CHAD'S SOFA — v5.24, Sketchfab, replacing the boxes above. 3.4 MB and
       13,984 triangles down to 331 KB and 6,292, with every map but base
       colour dropped (the CSP-safe rescueTextures only ever restores base
       colour, so a normal or AO map is pure download).

       It needs no fitting numbers of its own, which is the nice part: the
       file is 80 x 39 x 38 in its own units, and scaled uniformly so its
       LENGTH is the primitive's 1.9 m it comes out 0.93 deep and 0.90 high
       against the boxes' 0.85 and 0.92. So one scalar, measured from the
       file rather than guessed, and no per-axis squashing.

       Its length runs along its own z and the group's runs along local x
       (the group is turned a quarter about Y to face the TV), so it is
       turned a quarter the other way inside the group. That also puts its
       BACK where the primitive's back is: the model's backrest is at +x of
       its own centre, which a quarter turn sends to local -z, exactly where
       sofaBack sat.

       The primitive stays in the group, hidden: `sofaBase` is what
       `blockers()` boxes for the collision column, and a download that
       never lands must still leave something to sit on.                */
    assetBytes('sofa').then(BUF => new GLTFLoader().parse(BUF, '', (gltf) => {
      if (!alive) return;
      rescueTextures(gltf, BUF);
      const g = gltf.scene;
      g.updateMatrixWorld(true);
      let b = new THREE.Box3().setFromObject(g);
      const sz = new THREE.Vector3(); b.getSize(sz);
      if (!(sz.x > 0 && sz.y > 0 && sz.z > 0)) return;
      const s = 1.90 / Math.max(sz.x, sz.z);     // its longest floor axis IS its length
      g.scale.setScalar(s);
      g.rotation.y = Math.PI / 2;                // length onto the group's local x
      g.updateMatrixWorld(true);
      b = new THREE.Box3().setFromObject(g);
      g.position.set(-(b.min.x + b.max.x) / 2, -b.min.y, -(b.min.z + b.max.z) / 2);
      g.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
      for (const c of [...sofa.children]) c.visible = false;
      sofa.add(g);
      redoShadows();
    }, () => {})).catch(() => {});

    /* ------------------------------------------------------ TV and console */
    const tvConsole = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.42, 1.1), matWoodDark);
    tvConsole.position.set(-2.85, 0.21, 0.4);
    tvConsole.castShadow = true; tvConsole.receiveShadow = true;
    world.add(tvConsole);
    const tv = new THREE.Group();
    tv.position.set(-2.82, 0.42, 0.4);
    tv.rotation.y = Math.PI / 2;                // facing +x, at the sofa
    world.add(tv);
    const tvBody = new THREE.Mesh(new THREE.BoxGeometry(0.66, 0.52, 0.5),
      new THREE.MeshStandardMaterial({ color: 0x2b2b30, roughness: 0.55 }));
    tvBody.position.set(0, 0.26, -0.12);
    tvBody.castShadow = true;
    tv.add(tvBody);
    const tvScreen = new THREE.Mesh(new THREE.PlaneGeometry(0.54, 0.40), matScreen);
    tvScreen.position.set(0, 0.27, 0.132);
    tv.add(tvScreen);
    // the static's own light, so the burst strobes the room; off until C
    const tvLight = new THREE.PointLight(0xcfd8e8, 0, 5.0, 1.5);
    tvLight.position.set(-2.4, 0.8, 0.4);
    scene.add(tvLight); owned.push(tvLight);

    /* ----------------------------------------------- the 90s house phone -- */
    const phoneTable = new THREE.Group();
    phoneTable.position.set(-0.4, 0, R.zNear - 0.24);
    world.add(phoneTable);
    const ptTop = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.035, 0.36), matWood);
    ptTop.position.y = 0.78;
    ptTop.castShadow = true; ptTop.receiveShadow = true;
    phoneTable.add(ptTop);
    for (const [lx, lz] of [[-0.24, -0.14], [0.24, -0.14], [-0.24, 0.14], [0.24, 0.14]]) {
      const l = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.78, 0.04), matWoodDark);
      l.position.set(lx, 0.39, lz);
      phoneTable.add(l);
    }
    const phone = new THREE.Group();
    phone.position.set(0, 0.7975, 0.02);
    phoneTable.add(phone);
    const matPhone = new THREE.MeshStandardMaterial({ color: 0x8c2f2a, roughness: 0.5 });
    const phoneBase = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.075, 0.24), matPhone);
    phoneBase.geometry.translate(0, 0.0375, 0);
    phoneBase.castShadow = true;
    phone.add(phoneBase);
    // twelve buttons in a keypad
    const keyMat = new THREE.MeshStandardMaterial({ color: 0xe8e2d2, roughness: 0.6 });
    for (let r2 = 0; r2 < 4; r2++) for (let cc = 0; cc < 3; cc++) {
      const k = new THREE.Mesh(new THREE.BoxGeometry(0.026, 0.012, 0.02), keyMat);
      k.position.set(-0.032 + cc * 0.032, 0.078, -0.02 + r2 * 0.032);
      k.rotation.x = -0.16;
      phone.add(k);
    }
    /* the HANDSET, its own group so scene C can leave it hanging: home
       transform written down, because a prop a scene moves must have a
       truth to be put back to. */
    const handset = new THREE.Group();
    const HANDSET_HOME = { pos: new THREE.Vector3(0, 0.115, -0.084), rot: new THREE.Euler(0, 0, 0) };
    handset.position.copy(HANDSET_HOME.pos);
    phone.add(handset);
    const hsBar = new THREE.Mesh(new THREE.BoxGeometry(0.052, 0.03, 0.19), matPhone);
    hsBar.castShadow = true;
    handset.add(hsBar);
    for (const hz of [-0.082, 0.082]) {
      const cupHS = new THREE.Mesh(new THREE.CylinderGeometry(0.031, 0.026, 0.035, 10), matPhone);
      cupHS.position.set(0, -0.012, hz);
      handset.add(cupHS);
    }
    // the coiled cord: a helix from the handset's end to the base
    const coilPts = [];
    for (let i = 0; i <= 60; i++) {
      const u = i / 60;
      coilPts.push(new THREE.Vector3(
        0.055 + Math.cos(u * Math.PI * 14) * 0.012,
        0.1 - u * 0.06,
        -0.06 + u * 0.1 + Math.sin(u * Math.PI * 14) * 0.012));
    }
    const cord = new THREE.Mesh(
      new THREE.TubeGeometry(new THREE.CatmullRomCurve3(coilPts), 90, 0.004, 6),
      new THREE.MeshStandardMaterial({ color: 0x6b201c, roughness: 0.6 }));
    phone.add(cord);
    // the notepad and pencil beside it
    const pad = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.008, 0.15),
      new THREE.MeshStandardMaterial({ color: 0xe8e0cc, roughness: 0.9 }));
    pad.position.set(0.16, 0.802 - 0.7975, 0.04);
    phone.add(pad);

    // the wall clock over the phone table
    const clockFace = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.03, 20),
      new THREE.MeshStandardMaterial({ color: 0xe8e2d2, roughness: 0.7 }));
    clockFace.rotation.x = Math.PI / 2;
    clockFace.position.set(-0.4, 1.95, R.zNear - 0.03);
    world.add(clockFace);
    const clockRim = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.014, 8, 24), matWoodDark);
    clockRim.position.copy(clockFace.position);
    world.add(clockRim);
    const handM = new THREE.Mesh(new THREE.BoxGeometry(0.008, 0.11, 0.006), matWoodDark);
    handM.geometry.translate(0, 0.05, 0);
    handM.position.set(-0.4, 1.95, R.zNear - 0.048);
    world.add(handM);
    const handH = new THREE.Mesh(new THREE.BoxGeometry(0.010, 0.075, 0.006), matWoodDark);
    handH.geometry.translate(0, 0.033, 0);
    handH.position.set(-0.4, 1.95, R.zNear - 0.046);
    handH.rotation.z = -2.1;                     // just past seven, evening
    world.add(handH);

    /* -------------------------------------------------- the home altar ---- */
    const homeAltar = new THREE.Group();
    homeAltar.position.set(-2.98, 0, -2.15);
    world.add(homeAltar);
    const altShelf = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.035, 0.4), matLacquer);
    altShelf.position.y = 1.7;
    altShelf.castShadow = true;
    homeAltar.add(altShelf);
    const altBody = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.034, 0.12, 10),
      new THREE.MeshStandardMaterial({ color: 0x8c1f18, roughness: 0.6 }));
    altBody.position.set(0, 1.78, 0.05);
    homeAltar.add(altBody);
    const altTip = new THREE.Mesh(new THREE.SphereGeometry(0.02, 10, 8),
      new THREE.MeshBasicMaterial({ color: 0xff6a2a, fog: false }));
    altTip.position.set(0, 1.855, 0.05);
    homeAltar.add(altTip);
    const jossTips = [altTip];
    const fruitMat4 = new THREE.MeshStandardMaterial({ color: 0xd8791c, roughness: 0.72 });
    const altFruit = [];
    for (const fz of [-0.1, -0.02]) {
      const f = new THREE.Mesh(new THREE.SphereGeometry(0.034, 12, 10), fruitMat4);
      f.position.set(0.02, 1.755, fz);
      f.scale.y = 0.88;
      homeAltar.add(f);
      altFruit.push(f);
    }

    /* v5.08: CHAD'S VIETNAMESE ALTAR (Sketchfab) replaces the shelf — both
       tiers: the cabinet on the floor against the kitchen-corner wall, the
       shrine hung above it. It loads over the primitives; on arrival the
       slab hides, and the lamp, its flame and the oranges are RE-SEATED on
       the lower tier's top surface, measured from the model rather than
       assumed. Which mesh is which tier is measured too: the one whose
       centre sits lower is the cabinet. Its box joins the blockers, by
       reference, so the player cannot walk through a piece of furniture
       that arrived after the walls were counted. */
    const ALT_H = 2.15;                          // floor to the top of the shrine
    const ALT_YAW = Math.PI / 2;                 // the file's +z front turned to +x, into the room
    assetBytes('altar').then(BUF => new GLTFLoader().parse(BUF, '', (gltf) => {
      if (!alive) return;
      rescueTextures(gltf, BUF);
      const g = gltf.scene;
      const meshes = [];
      g.traverse(o => { if (o.isMesh) { o.castShadow = !LOW; o.receiveShadow = true; meshes.push(o); } });
      g.rotation.y = ALT_YAW;
      g.updateMatrixWorld(true);
      const box = new THREE.Box3().setFromObject(g);
      const size = box.getSize(new THREE.Vector3());
      if (!(size.y > 0)) return;
      const s = ALT_H / size.y;
      g.scale.setScalar(s);
      g.updateMatrixWorld(true);
      const b2 = new THREE.Box3().setFromObject(g);
      /* ground it, back it to the wall, centre it on the old shelf's z —
         all in WORLD terms, then into the group's own frame */
      const wall = -R.x + R.wall * 0.5;
      g.position.set(wall - b2.min.x - homeAltar.position.x, -b2.min.y,
                     -2.15 - (b2.min.z + b2.max.z) / 2 - homeAltar.position.z);
      homeAltar.add(g);
      g.updateMatrixWorld(true);
      // the tiers, by height
      const tiers = meshes.map(m => ({ m, box: new THREE.Box3().setFromObject(m) }))
        .sort((a, b) => (a.box.min.y + a.box.max.y) - (b.box.min.y + b.box.max.y));
      const lower = tiers[0].box;
      const topY = lower.max.y;                  // the cabinet's top, world
      const fx = lower.max.x - 0.14 - homeAltar.position.x;   // near the front edge
      const fz = (lower.min.z + lower.max.z) / 2 - homeAltar.position.z;
      altShelf.visible = false;
      altBody.position.set(fx, topY + 0.06, fz + 0.06);
      altTip.position.set(fx, topY + 0.135, fz + 0.06);
      altFruit[0].position.set(fx + 0.02, topY + 0.03, fz - 0.10);
      altFruit[1].position.set(fx + 0.02, topY + 0.03, fz - 0.02);
      // the cabinet is furniture: a column the walk cannot enter
      const bb = new THREE.Box3(
        new THREE.Vector3(lower.min.x - 0.10, 0, lower.min.z - 0.10),
        new THREE.Vector3(lower.max.x + 0.14, 1.40, lower.max.z + 0.10));
      BLK.push(bb);
      redoShadows();
    }, () => {})).catch(() => {});

    /* ------------------------------------------------------ the ceiling fan */
    const fan = new THREE.Group();
    fan.position.set(1.2, R.h - 0.24, -0.5);
    world.add(fan);
    const fanRod = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.22, 8), matMetal);
    fanRod.position.y = 0.13;
    fan.add(fanRod);
    const fanHub = new THREE.Mesh(new THREE.CylinderGeometry(0.10, 0.12, 0.07, 14), matMetal);
    fan.add(fanHub);
    const bladeGeo = new THREE.BoxGeometry(0.72, 0.012, 0.17);
    for (let i = 0; i < 3; i++) {
      const b = new THREE.Mesh(bladeGeo, matWoodDark);
      const a = (i / 3) * Math.PI * 2;
      b.position.set(Math.cos(a) * 0.42, -0.015, Math.sin(a) * 0.42);
      b.rotation.y = -a;
      b.rotation.z = 0.09;
      b.castShadow = !LOW;
      fan.add(b);
    }

    /* ================================================================== */
    /* THE MEMORY SETS — scene A's flashbacks, offstage at x -40           */
    /* Three small dressed stages in the dark: a patch of the void deck, a
       corner of the bedroom, one red chair from the tent. Each owns its
       lights, all at zero until the montage raises them; between films
       they are forty metres of night and fog away and never seen.       */
    /* ================================================================== */
    const memRoot = new THREE.Group();
    memRoot.position.set(-40, 0, 0);
    memRoot.visible = false;   // only scene A's flashbacks may show these —
                               // at any liveable fog the sets read from the flat
    world.add(memRoot);
    /* each memory floats inside its own black-box theatre: a dark bubble
       that swallows the dusk skydome, the flat forty metres off, and the
       NEIGHBOURING memories — without these, every flashback frame has a
       purple horizon and someone else's set floating in it */
    for (const bz of [0, -14, -28]) {
      const bubble = new THREE.Mesh(
        new THREE.SphereGeometry(6.5, 20, 12),
        new THREE.MeshBasicMaterial({ color: 0x0d0b16, side: THREE.BackSide, fog: false }));
      bubble.position.set(0, 0, bz);
      memRoot.add(bubble);
    }

    /* MEM1 · CHAPTER 1's shrine, rebuilt to its own recipe (v4.91 — Chad:
       the flashbacks "must look exactly like back in chapter 1, 2 and 3").
       The metal drum, the glowing ash, the lacquer plate of oranges, the
       joss sticks with lit tips, the drifted hell notes, the void deck
       pillars: every dimension and colour is chapter 1's own. */
    const mem1 = new THREE.Group();
    memRoot.add(mem1);
    const m1Floor = new THREE.Mesh(new THREE.PlaneGeometry(7, 7), matFloor);
    m1Floor.rotation.x = -Math.PI / 2;
    mem1.add(m1Floor);
    const m1Ceil = new THREE.Mesh(new THREE.PlaneGeometry(7, 7),
      new THREE.MeshStandardMaterial({ color: 0x4e4a42, roughness: 0.95 }));
    m1Ceil.rotation.x = Math.PI / 2;
    m1Ceil.position.y = 2.9;
    mem1.add(m1Ceil);
    for (const [px, pz] of [[-1.5, -0.9], [1.8, -1.1]]) {
      const p = new THREE.Mesh(new THREE.BoxGeometry(0.55, 2.9, 0.55), matWall);
      p.position.set(px, 1.45, pz);
      mem1.add(p);
    }
    const m1MatMetal = new THREE.MeshStandardMaterial({
      color: 0x39332c, roughness: 0.62, metalness: 0.85, side: THREE.DoubleSide });
    const m1Mat = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.04, 1.8),
      new THREE.MeshStandardMaterial({ color: 0x1a1d22, roughness: 0.9 }));
    m1Mat.position.set(0.2, 0.02, 0.2);
    mem1.add(m1Mat);
    const m1Drum = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.38, 0.9, 16, 1, true), m1MatMetal);
    m1Drum.position.set(0.0, 0.45, 0.2);
    mem1.add(m1Drum);
    const m1Ash = new THREE.Mesh(new THREE.CircleGeometry(0.36, 16),
      new THREE.MeshBasicMaterial({ color: 0xff5a12, fog: false }));
    m1Ash.rotation.x = -Math.PI / 2;
    m1Ash.position.set(0.0, 0.72, 0.2);
    mem1.add(m1Ash);
    {  // one of chapter 1's offering sets, to its own recipe
      const set = new THREE.Group();
      set.position.set(0.85, 0, 0.55);
      set.rotation.y = 0.6;
      mem1.add(set);
      const plate = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.24, 0.05, 18), matLacquer);
      plate.position.y = 0.045;
      set.add(plate);
      const orangeMat = new THREE.MeshStandardMaterial({ color: 0xd06a12, roughness: 0.72 });
      for (const [ox, oz] of [[-0.07, -0.06], [0.07, 0.02], [0.0, 0.10]]) {
        const o = new THREE.Mesh(new THREE.SphereGeometry(0.085, 12, 10), orangeMat);
        o.position.set(ox, 0.15, oz);
        set.add(o);
      }
      const m1Stick = new THREE.MeshStandardMaterial({ color: 0x2a1c14, roughness: 0.78 });
      for (let i = 0; i < 3; i++) {
        const st = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.52, 5), m1Stick);
        st.position.set(-0.17 + i * 0.09, 0.3, -0.30);
        st.rotation.z = (i - 1) * 0.06;
        set.add(st);
        const tip = new THREE.Mesh(new THREE.SphereGeometry(0.016, 6, 5),
          new THREE.MeshBasicMaterial({ color: 0xff6a1f, fog: false }));
        tip.position.set(st.position.x + (i - 1) * 0.015, 0.56, -0.30);
        set.add(tip);
      }
    }
    {  // the drifted notes — the chapter's own art, scattered where they fell
      const noteMat = new THREE.MeshStandardMaterial({
        map: noteTex, roughness: 0.85, side: THREE.DoubleSide });
      const noteGeo = new THREE.PlaneGeometry(0.15, 0.09);
      for (const [nx, nz, ry] of [[-0.5, 0.9, 0.4], [-0.75, 0.55, 2.1], [-0.3, 1.25, 1.2],
                                  [0.45, 1.05, 2.8], [-0.95, 1.0, 0.9]]) {
        const n = new THREE.Mesh(noteGeo, noteMat);
        n.rotation.set(-Math.PI / 2 + 0.05, 0, ry);
        n.position.set(nx, 0.015, nz);
        mem1.add(n);
      }
    }
    const mem1Light = new THREE.PointLight(0xff7a26, 0, 7.5, 1.5);
    mem1Light.position.set(0.0, 1.1, 0.2);
    mem1.add(mem1Light);

    /* MEM2 · CHAPTER 2's bedroom, rebuilt to its own recipe: the bed with
       its dark frame, pale mattress, slate blanket and pillow; the wall a
       hand-span away with THE GAP between; the louvred window glowing the
       streetlight's amber; the ceiling fan overhead. */
    const mem2 = new THREE.Group();
    mem2.position.set(0, 0, -14);
    memRoot.add(mem2);
    const m2MatWood = new THREE.MeshStandardMaterial({ color: 0x2e1f13, roughness: 0.8, metalness: 0.03 });
    const m2MatSheet = new THREE.MeshStandardMaterial({ color: 0xb9b3a4, roughness: 0.94 });
    const m2MatBlanket = new THREE.MeshStandardMaterial({ color: 0x4a5a6b, roughness: 0.95 });
    const m2Floor = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), matFloor);
    m2Floor.rotation.x = -Math.PI / 2;
    mem2.add(m2Floor);
    const m2Wall = new THREE.Mesh(new THREE.BoxGeometry(0.12, 2.6, 4.2), matWall);
    m2Wall.position.set(-1.0, 1.3, 0);
    mem2.add(m2Wall);
    const m2Bed = new THREE.Group();
    m2Bed.position.set(-0.42, 0, 0);
    mem2.add(m2Bed);
    const m2Frame = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.30, 1.90), m2MatWood);
    m2Frame.position.y = 0.20;
    m2Bed.add(m2Frame);
    const m2Mattress = new THREE.Mesh(new THREE.BoxGeometry(0.91, 0.18, 1.84), m2MatSheet);
    m2Mattress.position.y = 0.44;
    m2Bed.add(m2Mattress);
    const m2Blanket = new THREE.Mesh(new THREE.BoxGeometry(0.93, 0.07, 1.18), m2MatBlanket);
    m2Blanket.position.set(0, 0.56, 0.30);
    m2Bed.add(m2Blanket);
    const m2Pillow = new THREE.Mesh(new THREE.BoxGeometry(0.73, 0.11, 0.34), m2MatSheet);
    m2Pillow.position.set(0, 0.58, -0.68);
    m2Bed.add(m2Pillow);
    const m2Head = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.62, 0.05), m2MatWood);
    m2Head.position.set(0, 0.55, -0.93);
    m2Bed.add(m2Head);
    const m2GapDark = new THREE.Mesh(new THREE.PlaneGeometry(0.2, 2.0), matVoid);
    m2GapDark.rotation.x = -Math.PI / 2;
    m2GapDark.position.set(-0.87, 0.012, 0);
    mem2.add(m2GapDark);
    {  // the louvred window, glowing the streetlight's amber (ch2's louvres)
      const wFrame = new THREE.Mesh(new THREE.BoxGeometry(1.3, 1.25, 0.06), m2MatWood);
      wFrame.position.set(0.7, 1.55, -2.05);
      mem2.add(wFrame);
      const louvreMat = new THREE.MeshStandardMaterial({
        color: 0x8a6a3a, roughness: 0.3, metalness: 0.1,
        emissive: 0xffb267, emissiveIntensity: 0.55 });
      const louvreGeo = new THREE.BoxGeometry(1.18, 0.075, 0.02);
      for (let i = 0; i < 9; i++) {
        const l = new THREE.Mesh(louvreGeo, louvreMat);
        l.position.set(0.7, 1.02 + 0.09 + i * 0.125, -2.01);
        l.rotation.x = -0.42;
        mem2.add(l);
      }
    }
    {  // chapter 2's ceiling fan, to its own recipe
      const m2Fan = new THREE.Group();
      m2Fan.position.set(0.3, 2.36, -0.2);
      mem2.add(m2Fan);
      const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.22, 8), m1MatMetal);
      rod.position.y = 0.13;
      m2Fan.add(rod);
      const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.10, 0.12, 0.07, 14), m1MatMetal);
      m2Fan.add(hub);
      const bladeGeo = new THREE.BoxGeometry(0.72, 0.012, 0.17);
      for (let i = 0; i < 3; i++) {
        const b = new THREE.Mesh(bladeGeo, m2MatWood);
        const a = (i / 3) * Math.PI * 2;
        b.position.set(Math.cos(a) * 0.42, -0.015, Math.sin(a) * 0.42);
        b.rotation.y = -a;
        b.rotation.z = 0.09;
        m2Fan.add(b);
      }
      mem2.userData.fan = m2Fan;      // scene A spins it while the memory holds
    }
    // the streetlight: chapter 2's amber, low and sideways through the window
    const mem2Light = new THREE.SpotLight(0xffb267, 0, 9, 0.5, 0.55, 1.2);
    mem2Light.position.set(2.4, 2.1, -2.6);
    mem2Light.target.position.set(-0.6, 0.4, 0.2);
    mem2.add(mem2Light); mem2.add(mem2Light.target);
    // the fan's sweep: a slow shadow bar that crosses the light
    const m2Blade = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.02, 0.24),
      new THREE.MeshBasicMaterial({ color: 0x000000, fog: false }));
    m2Blade.position.set(0.6, 2.25, 0.5);
    m2Blade.visible = false;
    mem2.add(m2Blade);

    /* MEM3 · CHAPTER 3's tentage: a ROW of the real red plastic chairs
       under the white canvas glow, three of them facing the altar the way
       everyone sat — and ONE turned the wrong way, facing you. That single
       image is the whole of chapter 3's dread, replayed. */
    const mem3 = new THREE.Group();
    mem3.position.set(0, 0, -28);
    memRoot.add(mem3);
    const m3Floor = new THREE.Mesh(new THREE.PlaneGeometry(6, 6),
      new THREE.MeshStandardMaterial({ color: 0x6b6f74, roughness: 0.9 }));
    m3Floor.rotation.x = -Math.PI / 2;
    mem3.add(m3Floor);
    const m3Canvas = new THREE.Mesh(new THREE.PlaneGeometry(4.6, 4.6),
      new THREE.MeshStandardMaterial({
        color: 0xf3efe6, roughness: 0.95, side: THREE.DoubleSide,
        emissive: 0xfff6e2, emissiveIntensity: 0.28 }));
    m3Canvas.rotation.x = Math.PI / 2;
    m3Canvas.position.y = 2.7;
    mem3.add(m3Canvas);
    const matRed = new THREE.MeshStandardMaterial({ color: 0xb01a12, roughness: 0.5 });
    /* four chair anchors in one row; index 2 is the wrong-way one. The
       geometry faces -z at rotation 0, chapter 3's own convention. */
    const m3Chairs = [];
    for (let i = 0; i < 4; i++) {
      const g = new THREE.Group();
      g.position.set(-0.95 + i * 0.62, 0, 0);
      g.rotation.y = (i === 2) ? 0 : Math.PI;    // 2 faces the camera; the rest, the altar
      mem3.add(g);
      m3Chairs.push(g);
      const cSeat = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.05, 0.4), matRed);
      cSeat.position.y = 0.44;
      g.add(cSeat);
      const cBack = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.44, 0.05), matRed);
      cBack.position.set(0, 0.68, 0.19);
      g.add(cBack);
      for (const [lx, lz] of [[-0.17, -0.15], [0.17, -0.15], [-0.17, 0.15], [0.17, 0.15]]) {
        const l = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.44, 0.04), matRed);
        l.position.set(lx, 0.22, lz);
        g.add(l);
      }
    }
    const m3Chair = m3Chairs[2];                 // the cast name the scene aims at
    assetBytes('seat').then(BUF => new GLTFLoader().parse(BUF, '', (gltf) => {
      if (!alive) return;
      rescueTextures(gltf, BUF);
      let src = null;
      gltf.scene.updateMatrixWorld(true);
      gltf.scene.traverse(o => { if (o.isMesh && !src) src = o; });
      if (!src) return;
      const geo = src.geometry.clone();
      geo.applyMatrix4(src.matrixWorld);
      geo.computeBoundingBox();
      const bb = geo.boundingBox;
      const sc = 0.88 / (bb.max.y - bb.min.y);
      geo.translate(-(bb.min.x + bb.max.x) / 2, -bb.min.y, -(bb.min.z + bb.max.z) / 2);
      geo.scale(sc, sc, sc);
      geo.rotateY(Math.PI);                      // face -z, like chapter 3's
      for (const g of m3Chairs) {
        for (const c of [...g.children]) c.visible = false;
        g.add(new THREE.Mesh(geo, src.material));
      }
    }, () => {})).catch(() => {});
    const mem3Light = new THREE.SpotLight(0xffffff, 0, 8, 0.62, 0.5, 1.1);
    mem3Light.position.set(0, 4.4, -1.2);
    mem3Light.target.position.set(0, 0.4, 0);
    mem3.add(mem3Light); mem3.add(mem3Light.target);
    const mem3Wash = new THREE.PointLight(0xd23a28, 0, 6, 1.8);
    mem3Wash.position.set(0, 0.4, 1.6);
    mem3.add(mem3Wash);

    /* ------------------------------------------------------- dust and motes */
    const DUST_N = LOW ? 50 : 110;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(DUST_N * 3);
    const dustSeed = new Float32Array(DUST_N);
    for (let i = 0; i < DUST_N; i++) {
      dustPos[i * 3] = (Math.random() - 0.5) * R.x * 1.8;
      dustPos[i * 3 + 1] = 0.3 + Math.random() * 2.0;
      dustPos[i * 3 + 2] = -R.z + Math.random() * (R.z + R.zNear) * 0.92;
      dustSeed[i] = Math.random() * 100;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    const dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({
      map: dotTex, size: 0.015, transparent: true, opacity: 0.28,
      depthWrite: false, blending: THREE.AdditiveBlending, fog: false }));
    world.add(dust);

    const moteMat = new THREE.MeshBasicMaterial({
      color: 0xffe7c2, transparent: true, opacity: 0.45, fog: false,
      blending: THREE.AdditiveBlending, depthWrite: false });
    const FLY_N = LOW ? 12 : 26;
    const flying = new THREE.InstancedMesh(
      new THREE.PlaneGeometry(0.012, 0.012), moteMat, FLY_N);
    flying.frustumCulled = false;
    world.add(flying);
    const motes = [];
    for (let i = 0; i < FLY_N; i++) {
      motes.push({ x: 2.0 + (Math.random() - 0.5) * 1.6,
                   y: 0.4 + Math.random() * 1.6,
                   z: 1.6 + (Math.random() - 0.5) * 1.6,
                   rise: 0.03 + Math.random() * 0.05,
                   ph: Math.random() * 10 });
    }
    const smoke = dust, embers = dust;

    /* ================================================================== */
    /* THE THING YOU CAN ACT ON — the chair                                */
    /* ================================================================== */
    const PILE_POS = new THREE.Vector3(CHAIR.x, 0, CHAIR.z);
    const INTERACT_R = 1.5;
    const HIGHLIGHT_R = 2.6;
    const MARK_R = 4.4;

    const chairRing = new THREE.Mesh(
      new THREE.RingGeometry(0.34, 0.48, 40),
      new THREE.MeshBasicMaterial({ color: 0x63d6c8, transparent: true, opacity: 0,
        side: THREE.DoubleSide, blending: THREE.AdditiveBlending,
        depthWrite: false, fog: false }));
    chairRing.rotation.x = -Math.PI / 2;
    chairRing.position.set(CHAIR.x, 0.03, CHAIR.z);
    chairRing.visible = false;
    world.add(chairRing);

    const markGlow = new THREE.Sprite(new THREE.SpriteMaterial({
      map: makeSoftDot('rgba(99,214,200,0.50)', 'rgba(99,214,200,0)'),
      transparent: true, depthWrite: false, fog: false, sizeAttenuation: false,
      blending: THREE.AdditiveBlending }));
    markGlow.scale.setScalar(0.34);
    const mark = new THREE.Sprite(new THREE.SpriteMaterial({
      map: makeMark4(cnv), transparent: true, depthWrite: false, fog: false,
      sizeAttenuation: false }));
    mark.scale.setScalar(0.115);
    const markRoot = new THREE.Group();
    markRoot.position.set(CHAIR.x, 1.35, CHAIR.z);
    markRoot.visible = false;
    markRoot.add(markGlow, mark);
    world.add(markRoot);

    const _ndc = new THREE.Vector3(), _ray = new THREE.Raycaster(), _ptr = new THREE.Vector2();
    const syncCamera = () => {
      camera.updateWorldMatrix(true, false);
      camera.matrixWorldInverse.copy(camera.matrixWorld).invert();
    };
    function pileDist() {
      return Math.hypot(yaw.position.x - PILE_POS.x, yaw.position.z - PILE_POS.z);
    }
    function pileScreen() {
      syncCamera();
      return _ndc.set(PILE_POS.x, 0.6, PILE_POS.z).project(camera);
    }
    function pileInView() {
      const n = pileScreen();
      return n.z < 1 && Math.abs(n.x) < 0.97 && Math.abs(n.y) < 0.97;
    }
    function pointerHitsPile(cx, cy) {
      if (pileDist() > INTERACT_R) return false;
      syncCamera();
      _ptr.set((cx / innerWidth) * 2 - 1, -(cy / innerHeight) * 2 + 1);
      _ray.setFromCamera(_ptr, camera);
      if (_ray.intersectObject(chairTh, true).length) return true;
      const n = pileScreen();
      if (n.z > 1) return false;
      const sx = (n.x * 0.5 + 0.5) * innerWidth, sy = (-n.y * 0.5 + 0.5) * innerHeight;
      return Math.hypot(cx - sx, cy - sy) < Math.min(innerWidth, innerHeight) * 0.11;
    }
    function canInteract() { return getState() === 'play' && pileDist() < INTERACT_R; }
    function interactPile() {
      if (!canInteract()) return false;
      startDecision();
      return true;
    }

    function updatePile(t) {
      if (getState() === 'cine') {
        markRoot.visible = chairRing.visible = false;
        return;
      }
      const dist = pileDist();
      const m = THREE.MathUtils.clamp(
        (MARK_R - dist) / (MARK_R - INTERACT_R) * 1.9, 0, 1);
      markRoot.visible = m > 0.01;
      if (markRoot.visible) {
        const beat = 0.72 + 0.28 * Math.sin(t * 3.1);
        markRoot.position.y = 1.35 + Math.sin(t * 1.9) * 0.08;
        mark.material.opacity = m;
        mark.scale.setScalar(0.115 * (0.93 + beat * 0.11));
        markGlow.material.opacity = m * beat * 0.55;
      }
      const near = THREE.MathUtils.clamp(
        (HIGHLIGHT_R - dist) / (HIGHLIGHT_R - INTERACT_R), 0, 1);
      const on = near > 0.01;
      chairRing.visible = on;
      if (on) chairRing.material.opacity = near * (0.62 + 0.38 * Math.sin(t * 2.6)) * 0.55;
    }

    /* ================================================================== */
    /* WHAT MOVES                                                         */
    /* ================================================================== */
    let fanSpeed = 1;
    let noteStorm = 1;              // the contract's word for "how much air"

    const _m4 = new THREE.Matrix4();
    /* ------------------------------------------- the unseen haunting ----
       v4.91, Chad's call: she is never shown in this chapter. What the flat
       has instead is a poltergeist clock — every half minute or so of PLAY,
       one thing happens that should not: slippered footsteps cross a room
       nobody is in, the ceiling light dips and steadies, a chair is dragged
       a hand-span, the front door is tried. The sounds are the other
       chapters' own (her slippers are ch2's, the chair is ch3's), because
       what followed him home brought its rooms with it. */
    let polterClock = 0;
    let polterNext = 26 + Math.random() * 12;    // the room settles first
    let dipT = -1, dipBase = 3.2;
    function polterUpdate(dt) {
      if (getState() !== 'play') return;
      if (dipT >= 0) {                           // a light-dip in progress
        dipT += dt;
        const k = Math.min(1, dipT / 1.7);
        const flick = 0.28 + Math.abs(Math.sin(dipT * 21)) * 0.22;
        ceilLight.intensity = dipBase * (k < 0.65 ? flick : flick + (k - 0.65) / 0.35 * (1 - flick));
        if (k >= 1) { ceilLight.intensity = dipBase; dipT = -1; }
      }
      polterClock += dt;
      if (polterClock < polterNext) return;
      polterClock = 0;
      polterNext = 24 + Math.random() * 20;
      const pan = Math.random() < 0.5 ? -0.7 : 0.6;
      const r = Math.random();
      if (!worldSfx) return;                     // older engine: quietly nothing
      if (r < 0.34) worldSfx('hallsteps', 0.42, 1, pan);
      else if (r < 0.60) { dipT = 0; dipBase = ceilLight.intensity || 3.2; worldSfx('lightbuzz', 0.28); }
      else if (r < 0.84) worldSfx('chair', 0.38, 1, pan);
      else worldSfx('doorcreak', 0.28, 1.12, -0.4);
    }

    function updateNotes(dt, t) {
      polterUpdate(dt);
      fan.rotation.y += dt * 2.0 * fanSpeed;

      for (let i = 0; i < motes.length; i++) {
        const f = motes[i];
        f.y += dt * f.rise * noteStorm;
        if (f.y > 2.2) { f.y = 0.3; }
        _m4.makeRotationY(t * 0.6 + f.ph);
        _m4.setPosition(f.x + Math.sin(t * 0.5 + f.ph) * 0.08, f.y,
                        f.z + Math.cos(t * 0.4 + f.ph) * 0.06);
        flying.setMatrixAt(i, _m4);
      }
      flying.instanceMatrix.needsUpdate = true;
    }

    function updateFire(t) {
      // the ceiling tube glows exactly as bright as its light says it is —
      // which is what makes the film's switch-on beat land with no extra code
      ceilTube.material.color.setScalar(Math.min(1, 0.05 + ceilLight.intensity * 0.30));
      const fl = 0.88 + Math.sin(t * 2.3) * 0.07 + Math.sin(t * 7.1) * 0.03;
      if (getState() !== 'cine') {
        altLight.intensity = 2.2 * fl;
        altTip.material.color.setHSL(0.045, 1, 0.42 + fl * 0.1);
      }
    }

    function updateSlow(sdt, t) {
      const p = dust.geometry.attributes.position.array;
      for (let i = 0; i < DUST_N; i++) {
        p[i * 3 + 1] += sdt * (0.012 + (dustSeed[i] % 1) * 0.02) * noteStorm;
        p[i * 3] += Math.sin(t * 0.3 + dustSeed[i]) * sdt * 0.02;
        if (p[i * 3 + 1] > 2.45) {
          p[i * 3 + 1] = 0.15;
          p[i * 3] = (Math.random() - 0.5) * R.x * 1.8;
          p[i * 3 + 2] = -R.z + Math.random() * (R.z + R.zNear) * 0.92;
        }
      }
      dust.geometry.attributes.position.needsUpdate = true;
    }

    /* ------------------------------------------------------ cutscene state */
    function snap() {
      return {
        fanSpeed, storm: noteStorm,
        ceil: ceilLight.intensity, lamp: lampLight.intensity,
        alt: altLight.intensity, tvL: tvLight.intensity,
        tvCol: tvScreen.material.color.getHex(),
        doorRot: doorMain.rotation.y,
        hsPos: handset.position.clone(), hsRot: handset.rotation.clone(),
        hsParent: handset.parent,
        m1: mem1Light.intensity, m2: mem2Light.intensity,
        m3: mem3Light.intensity, m3w: mem3Wash.intensity,
        dusk: duskFill.intensity, out: outLight.intensity,
        lateOp: lateMat.opacity,
        fog: scene.fog ? scene.fog.density : null
      };
    }
    function restore(s) {
      fanSpeed = s.fanSpeed; noteStorm = s.storm;
      ceilLight.intensity = s.ceil; lampLight.intensity = s.lamp;
      altLight.intensity = s.alt; tvLight.intensity = s.tvL;
      tvScreen.material.color.setHex(s.tvCol);
      doorMain.rotation.y = s.doorRot;
      if (s.hsParent && handset.parent !== s.hsParent) s.hsParent.add(handset);
      handset.visible = true;
      handset.position.copy(s.hsPos);
      handset.rotation.copy(s.hsRot);
      mem1Light.intensity = s.m1; mem2Light.intensity = s.m2;
      mem3Light.intensity = s.m3; mem3Wash.intensity = s.m3w;
      m2Blade.visible = false;
      memRoot.visible = false;
      if (s.dusk !== undefined) { duskFill.intensity = s.dusk; outLight.intensity = s.out; }
      lateMat.opacity = s.lateOp;
      if (scene.fog && s.fog !== null) scene.fog.density = s.fog;
    }

    const REST = {
      ceil: ceilLight.intensity, lamp: lampLight.intensity,
      alt: altLight.intensity
    };
    function reset() {
      fanSpeed = 1; noteStorm = 1;
      ceilLight.intensity = REST.ceil;
      lampLight.intensity = REST.lamp;
      altLight.intensity = REST.alt;
      tvLight.intensity = 0;
      tvScreen.material.color.setHex(0x0a0c0e);
      doorMain.rotation.y = 0;
      phone.add(handset);
      handset.visible = true;
      handset.position.copy(HANDSET_HOME.pos);
      handset.rotation.set(0, 0, 0);
      mem1Light.intensity = mem2Light.intensity = 0;
      mem3Light.intensity = mem3Wash.intensity = 0;
      m2Blade.visible = false;
      memRoot.visible = false;
      duskFill.intensity = 0.5; outLight.intensity = 0.9;
      lateMat.opacity = 0;
    }

    /* ------------------------------------------------------------ collision */
    function blockers() {
      const out = [];
      const box = o => {
        o.updateWorldMatrix(true, false);
        const b = new THREE.Box3().setFromObject(o);
        b.expandByScalar(0.20);
        out.push(b);
      };
      /* FURNITURE IS A COLUMN, and that needs saying out loud, because the
         reason it was walk-through is a two-centimetre miss. `collide()`
         samples ONE point, at y = 1.0. A tabletop sits at 0.75 and is thin,
         so even with the wall padding its box tops out at 0.98 — just under
         the probe. The sofa (0.62) and the chair seats (0.68) miss by more.
         Every one of them was solid in the list and solid nowhere else.
         A piece of furniture obstructs you at whatever height you meet it,
         so its blocker runs FLOOR TO ABOVE THE PROBE. The padding is
         smaller than a wall's: you brush past a chair, never past a wall. */
      const solid = o => {
        o.updateWorldMatrix(true, false);
        const b = new THREE.Box3().setFromObject(o);
        b.expandByScalar(0.14);
        b.min.y = 0;
        b.max.y = Math.max(b.max.y, 1.40);
        out.push(b);
      };
      for (const w of walls) box(w);
      solid(tableTop); solid(sofaBase); solid(tvConsole); solid(tvBody);
      solid(ptTop); solid(shoeRack); box(doorLeaf);
      for (const c of chairs) solid(c);          // the whole chair, not the seat slab
      return out;
    }

    /* ------------------------------------------------------------ teardown */
    function dispose() {
      alive = false;
      const geos = new Set(), mats = new Set();
      world.traverse(o => {
        if (o.geometry) geos.add(o.geometry);
        if (o.material) for (const m of (Array.isArray(o.material) ? o.material : [o.material])) mats.add(m);
        if (o.isSprite && o.material) mats.add(o.material);
      });
      scene.remove(world);
      for (const o of owned) { o.parent?.remove(o); o.dispose?.(); }
      owned.length = 0;
      for (const g of geos) g.dispose();
      for (const m of mats) {
        for (const k of ['map', 'roughnessMap', 'normalMap', 'emissiveMap', 'alphaMap']) {
          m[k]?.dispose?.();
        }
        m.dispose();
      }
      for (const t of [cTex.map, cTex.rough, wallMap, lacquerTex, noteTex,
                       floorTex, dotTex]) t?.dispose?.();
      world.clear();
      S = null;
    }

    const BLK = blockers();                    // by reference: the altar adds its box on arrival
    return (S = {
      world, noteTex, blockers: BLK,
      ready: () => hdbReady,
      pile: {
        pos: PILE_POS, radius: INTERACT_R, group: chairTh,
        dist: pileDist, screen: pileScreen, inView: pileInView,
        hits: pointerHitsPile, interact: interactPile,
        glow: () => chairRing.material.opacity
      },

      /* the contract's own names first, then this chapter's cast.
         fireLight is the home altar's oil-lamp glow — the chapter's one
         flame; the engine reads its position to warm the hands near it. */
      drum: doorMain, ash: altTip, embers, heroNote: null, smoke, flying,
      jossTips, fireLight: altLight,
      table, chairTh, chairs, sofa, tv, tvScreen, tvLight, tvConsole,
      phone, phoneTable, handset, HANDSET_HOME, cord,
      doorMain, doorLeaf, DOORM, DOORM_OPEN, gate,
      winGroup, kitDark, homeAltar, altTip, altLight,
      ceilLight, lampLight, duskFill, outLight, fan,
      hall, bedDoor, maDoor, lateMat, litWins,
      mem1, mem2, mem3, mem1Light, mem2Light, mem3Light, mem3Wash,
      m2Blade, m3Chair, memRoot,
      CHAIR, TABLE, R, WIN, KDOOR, CORR,
      get fanSpeed() { return fanSpeed; },
      set fanSpeed(v) { fanSpeed = v; },
      get noteStorm() { return noteStorm; },
      set noteStorm(v) { noteStorm = v; },
      updateNotes, updatePile, updateFire, updateSlow,
      /* scene A thins the fog so the memory sets forty metres out are
         not washed to the fog colour; the engine's api does not hand a
         scene reference to cutscenes, so the fog crosses this seam */
      setFogDensity(d) { if (scene.fog) scene.fog.density = d; },
      getFogDensity() { return scene.fog ? scene.fog.density : null; },
      setNoteTexture() {},          // no hell note in this chapter — chapter 5's
      snap, restore, reset, dispose
    });
  }

  /* ---------------------------------------------------------- textures ---- */
  function makeTerrazzo4(cnv) {
    const s = 256, [c, ctx] = cnv(s);
    ctx.fillStyle = '#7d766b'; ctx.fillRect(0, 0, s, s);
    const chips = ['#a49c8e', '#cdc5b4', '#57524a', '#b8a890', '#8d9188'];
    for (let i = 0; i < 900; i++) {
      ctx.fillStyle = chips[(Math.random() * chips.length) | 0];
      ctx.globalAlpha = 0.5 + Math.random() * 0.5;
      const r = 1 + Math.random() * 3.4;
      ctx.beginPath();
      ctx.ellipse(Math.random() * s, Math.random() * s, r, r * (0.5 + Math.random()),
                  Math.random() * Math.PI, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    return finishTex(c);
  }
  function makeMark4(cnv) {
    const s = 128, [c, ctx] = cnv(s);
    ctx.clearRect(0, 0, s, s);
    ctx.fillStyle = '#dffaf4';
    ctx.shadowColor = 'rgba(99,214,200,0.95)';
    ctx.shadowBlur = 16;
    ctx.beginPath();
    ctx.moveTo(s * 0.5 - s * 0.075, s * 0.16);
    ctx.lineTo(s * 0.5 + s * 0.075, s * 0.16);
    ctx.lineTo(s * 0.5 + s * 0.045, s * 0.60);
    ctx.lineTo(s * 0.5 - s * 0.045, s * 0.60);
    ctx.closePath(); ctx.fill();
    ctx.beginPath();
    ctx.arc(s * 0.5, s * 0.76, s * 0.072, 0, Math.PI * 2);
    ctx.fill();
    return finishTex(c);
  }
  let _THREE = null;
  function finishTex(canvas) {
    const t = new _THREE.CanvasTexture(canvas);
    t.colorSpace = _THREE.SRGBColorSpace;
    t.wrapS = t.wrapT = _THREE.RepeatWrapping;
    t.anisotropy = 4;
    return t;
  }

  /* ====================================================================== */
  /* THE SCENES                                                             */
  /* ====================================================================== */
  /* Where the camera lives in this flat, in one place, so six scenes agree: */
  const EYE = 1.62;                                  // standing
  const SEATED = 1.18;                               // on the dining chair
  const ATTABLE = { x: 1.3, y: SEATED, z: 0.55 };    // seated, facing the window
  const MIDROOM = { x: 0.1, y: EYE, z: 0.9 };
  const SOFAPT = { x: 2.35, y: EYE, z: 1.15 };      // standing at the sofa
  const LYING = { x: 2.55, y: 0.72, z: 1.15 };      // head on the sofa arm
  const PHONEPT = { x: -0.4, y: EYE, z: 1.55 };     // a step off the phone table —
                                                    // close enough to hold the
                                                    // handset, far enough that the
                                                    // phone can actually be SEEN
  /* the sit-down, shared by every scene that begins at the chair: the same
     two seconds, so the player always sees themselves sit before the
     thinking goes wherever it goes */
  function sitDown(api, s) {
    const { tr, camTo, yawTo, pitchTo, sfx, faceFrom, smoothK } = api;
    const start = { x: s.yawPos.x, y: s.yawPos.y, z: s.yawPos.z };
    camTo(0, 1.8, start, ATTABLE, smoothK);
    yawTo(0, 1.8, s.yawRot, 0, smoothK);          // facing -z: the window
    pitchTo(0, 1.8, s.pitchX, -0.06, smoothK);
    sfx(1.1, 'sitdown', 0.8);
    tr(1.8, 2.4, () => {}, api.rawK);             // the settle
  }

  /* --------------------------------------------------------- THE OPENING --
     Keys in a lock at dusk. The door opens on a dark flat, the lights come
     on, and the room is fine — which is the point. The film's one job is to
     make "home, lit, ordinary" feel like held breath.                     */
  function intro(c, s, api) {
    const { tr, step, sfx, fade, camTo, yawTo, pitchTo, faceFrom, rawK, smoothK,
            duck, stage, ghostOpacity, handsRoot, armR } = api;

    const OUTSIDE = { x: stage.DOORM.x + 0.55, y: EYE, z: stage.R.zNear + 1.15 };
    const INDOOR = { x: stage.DOORM.x + 0.35, y: EYE, z: stage.R.zNear - 0.75 };
    const BYTABLE = { x: 0.15, y: EYE, z: 0.75 };

    step(0, () => {
      armR.visible = false;
      ghostOpacity(0);
      stage.ceilLight.intensity = 0;        // the flat is dark; he is not home yet
      stage.lampLight.intensity = 0;
      stage.doorMain.rotation.y = 0;
      duck('v4room', 0.4); duck('clock', 0); duck('fan', 0);
    });

    // the door from outside, the room and window from inside — every yaw
    // below is faceFrom'd at a named thing (the v4.6 law: derived, never
    // guessed; the first draft faced the parapet and filmed the sky)
    const DOORAT = { x: stage.DOORM.x, z: stage.R.zNear };
    const Y_OUT = faceFrom(OUTSIDE.x, OUTSIDE.z, DOORAT.x, DOORAT.z);
    const Y_ROOM = faceFrom(INDOOR.x, INDOOR.z, 0.6, 0.2);       // the room's middle
    const Y_TABLE = faceFrom(BYTABLE.x, BYTABLE.z, stage.TABLE.x, stage.TABLE.z);
    const Y_WIN = faceFrom(BYTABLE.x, BYTABLE.z, stage.WIN.x, -stage.R.z);

    // 0–4.5 black. Keys, and the day's last light when it lifts.
    sfx(0.5, 'doorkeys', 0.85);
    sfx(1.2, 'v4wake1');
    camTo(0, 0.1, OUTSIDE, OUTSIDE);
    yawTo(0, 0.1, Y_OUT, Y_OUT);
    pitchTo(0, 0.1, 0.02, 0.02);
    fade(4.2, 6.4, 1, 0);

    // 6–9.5 the common corridor at dusk: the door, the last light behind him
    camTo(6.0, 9.0, OUTSIDE, { x: OUTSIDE.x, y: EYE, z: OUTSIDE.z - 0.35 }, smoothK);
    sfx(7.8, 'doorcreak', 0.7);
    tr(7.8, 9.6, k => { stage.doorMain.rotation.y = stage.DOORM_OPEN * k; }, smoothK);

    // 9.5–13 through the door into the dark flat
    camTo(9.4, 12.4, { x: OUTSIDE.x, y: EYE, z: OUTSIDE.z - 0.35 }, INDOOR, smoothK);
    yawTo(9.4, 12.4, Y_OUT, Y_ROOM, smoothK);
    sfx(11.6, 'doorcreak', 0.4);
    tr(11.6, 13.0, k => { stage.doorMain.rotation.y = stage.DOORM_OPEN * (1 - k); }, smoothK);

    // 13–16 the switch. The room arrives all at once, warm.
    sfx(13.3, 'switch4', 0.9);
    tr(13.3, 14.1, k => {
      stage.ceilLight.intensity = 3.2 * k;
      stage.lampLight.intensity = 1.7 * k;
    }, rawK);
    step(13.4, () => { duck('v4room', 1); duck('clock', 1); duck('fan', 1); });
    sfx(14.6, 'v4wake2');

    // 16–23 a slow look across his own living room, ending on the table
    yawTo(16.0, 22.6, Y_ROOM, Y_TABLE, smoothK);
    camTo(16.0, 22.6, INDOOR, BYTABLE, smoothK);
    pitchTo(16.0, 22.6, 0.02, -0.02, smoothK);

    // 23–29 the window: the block opposite, its windows coming on
    yawTo(23.0, 26.0, Y_TABLE, Y_WIN, smoothK);
    tr(23.5, 28.0, k => { stage.lateMat.opacity = k; }, smoothK);
    sfx(24.0, 'v4wake3');
    tr(26.0, 29.4, () => {}, rawK);               // the held beat

    // 29.5–32 down, and out
    fade(29.6, 32.0, 0, 1);
    step(32.0, () => { armR.visible = true; });

    c.endFade = 1;
    c.keepFade = true;
  }

  /* ----------------------------------------------- A · CONNECT THE LOCATIONS
     The flashbacks. He sits, closes his eyes, and the film goes where he
     goes: three memories on three black stages, each lit its own wrong
     colour, each ending a beat before he is ready to leave it. The realise
     line lands on the third, and the drum stops mid-strike.              */
  function scThink(c, s, api) {
    const { tr, step, sfx, fade, camTo, yawTo, pitchTo, faceFrom, rawK, smoothK,
            duck, stage, ghostOpacity, handsRoot } = api;
    const M1 = { x: -41.6, y: 1.28, z: 1.9 };     // in the void deck memory
    const M2 = { x: -38.6, y: 1.05, z: -12.6 };   // at the foot of the bed
    const M3 = { x: -39.71, y: 1.30, z: -30.4 };  // before the wrong-way chair

    step(0, () => { ghostOpacity(0); handsRoot.visible = false; });
    sitDown(api, s);

    // 2.5–5.5 stillness at the table; the room hushes around him
    sfx(3.0, 'v4sit', 0.95);
    tr(3.0, 5.5, k => {
      duck('v4room', 1 - 0.85 * k); duck('clock', 1 - 0.9 * k);
      duck('fan', 1 - 0.9 * k);
    }, rawK);
    step(5.2, () => { stage.setFogDensity(0.0016); stage.memRoot.visible = true; });

    // 5.5–14 MEMORY ONE · the void deck. Ember light, the burner, the dark.
    sfx(5.5, 'memwash', 0.8);
    fade(5.5, 6.1, 0, 1);
    step(6.1, () => { stage.mem1Light.intensity = 3.0; });
    fade(6.2, 7.0, 1, 0);
    sfx(6.3, 'mem1', 0.9);
    const M1A = { x: M1.x - 0.9, y: M1.y, z: M1.z + 1.4 };
    const M1B = { x: M1.x + 0.5, y: M1.y - 0.1, z: M1.z - 1.2 };
    camTo(6.2, 13.6, M1A, M1B, smoothK);
    // the drum sits at world (-40.0, 0.2); both ends of the push face it
    yawTo(6.2, 13.6, faceFrom(M1A.x, M1A.z, -40.0, 0.2),
                     faceFrom(M1B.x, M1B.z, -40.0, 0.2), smoothK);
    pitchTo(6.2, 13.6, -0.05, -0.16, smoothK);
    tr(6.2, 13.6, (k, t2) => {
      stage.mem1Light.intensity = 3.0 * (0.85 + Math.sin(t2 * 7.1) * 0.1 + Math.sin(t2 * 2.3) * 0.08);
    }, rawK);
    sfx(8.0, 'v4thinkA1');

    // 14–23 MEMORY TWO · the bedroom. Cold blue, the fan's sweep, the gap.
    sfx(13.6, 'memwash', 0.8);
    fade(13.6, 14.2, 0, 1);
    step(14.2, () => {
      stage.mem1Light.intensity = 0;
      stage.mem2Light.intensity = 5.5;
      stage.m2Blade.visible = true;
    });
    fade(14.3, 15.1, 1, 0);
    sfx(14.4, 'mem2', 0.9);
    const M2A = { x: M2.x + 1.1, y: M2.y, z: M2.z + 0.4 };
    const M2B = { x: M2.x - 0.3, y: M2.y - 0.15, z: M2.z - 1.1 };
    camTo(14.3, 22.6, M2A, M2B, smoothK);
    // the GAP is at world (-40.87, -14); the slide keeps it framed
    yawTo(14.3, 22.6, faceFrom(M2A.x, M2A.z, -40.87, -14),
                      faceFrom(M2B.x, M2B.z, -40.87, -14), smoothK);
    pitchTo(14.3, 22.6, -0.10, -0.34, smoothK);
    tr(14.3, 22.6, (k, t2) => {
      stage.m2Blade.rotation.y = t2 * 2.2;        // the sweep across the light
      const f = stage.mem2.userData.fan;          // and the fan itself, turning
      if (f) f.rotation.y = t2 * 5.0;
    }, rawK);
    sfx(17.0, 'v4thinkA2');

    // 23–33.5 MEMORY THREE · one red chair in white light, facing him.
    sfx(22.6, 'memwash', 0.8);
    fade(22.6, 23.2, 0, 1);
    step(23.2, () => {
      stage.mem2Light.intensity = 0;
      stage.m2Blade.visible = false;
      stage.mem3Light.intensity = 6.5;
      stage.mem3Wash.intensity = 1.6;
    });
    fade(23.3, 24.0, 1, 0);
    sfx(23.4, 'mem3', 0.95);
    camTo(23.3, 34.9, { x: M3.x, y: M3.y, z: M3.z + 0.2 },
                      { x: M3.x, y: M3.y - 0.08, z: M3.z + 1.55 }, smoothK);
    // dead on: the wrong-way chair at world (-39.71, -28), facing him out
    // of the row that faces the altar — chapter 3's whole image, replayed
    yawTo(23.3, 34.9, faceFrom(M3.x, M3.z + 0.2, -39.71, -28),
                      faceFrom(M3.x, M3.z + 1.55, -39.71, -28), smoothK);
    pitchTo(23.3, 34.9, -0.08, -0.14, smoothK);
    sfx(25.0, 'v4thinkA3');           // 9.87 s measured: it OWNS the shot

    // 35 the drum stops MID-STRIKE, and the memory goes with it
    step(35.0, () => {
      stage.mem3Light.intensity = 0;
      stage.mem3Wash.intensity = 0;
    });
    fade(34.9, 35.4, 0, 1);
    sfx(35.05, 'boom');

    // 36.4–41.4 back at the table, evening, his own hands. The room returns.
    step(36.4, () => { stage.setFogDensity(0.010); stage.memRoot.visible = false; });
    fade(36.4, 37.6, 1, 0);
    camTo(36.4, 41.4, ATTABLE, ATTABLE);
    yawTo(36.4, 41.4, 0, 0);
    pitchTo(36.4, 39.4, -0.06, -0.18, smoothK);   // down, at the table edge
    tr(36.4, 39.9, k => {
      duck('v4room', 0.15 + 0.85 * k); duck('clock', 0.1 + 0.9 * k);
      duck('fan', 0.1 + 0.9 * k);
    }, rawK);
    sfx(38.6, 'chime', 0.5);
    tr(41.4, 43.0, () => {}, rawK);
    fade(43.0, 46.5, 0, 1);
    step(46.4, () => { handsRoot.visible = true; });

    c.endFade = 1;
  }

  /* --------------------------------------------------- B · IGNORE AND SLEEP
     He gives up on thinking, takes the sofa, and the flat lets him drift
     off — then hands him back at three in the morning with the clock gone
     and the kitchen doorway open. Nothing touches him. Nothing needs to. */
  function scSleep(c, s, api) {
    const { tr, step, sfx, fade, camTo, yawTo, pitchTo, faceFrom, rawK, smoothK,
            duck, stage, ghostOpacity, handsRoot } = api;

    step(0, () => { ghostOpacity(0); handsRoot.visible = false; });
    // 0–3.5 he pushes off toward the sofa
    camTo(0, 2.6, { x: s.yawPos.x, y: s.yawPos.y, z: s.yawPos.z }, SOFAPT, smoothK);
    yawTo(0, 2.6, s.yawRot, Math.PI / 2, smoothK);
    pitchTo(0, 2.6, s.pitchX, 0, smoothK);
    sfx(1.0, 'v4tired');

    // 3.5–7 down onto it, on his back, the fan overhead
    sfx(4.6, 'sofacreak', 0.85);
    camTo(4.4, 6.4, SOFAPT, LYING, smoothK);
    pitchTo(4.4, 6.4, 0, 0.95, smoothK);          // face up
    yawTo(4.4, 6.4, Math.PI / 2, Math.PI / 2, smoothK);

    // 7–12 the lights go, one by one, and the clock walks him down into sleep
    tr(7.0, 9.0, k => { stage.lampLight.intensity = 1.7 * (1 - k); }, smoothK);
    tr(8.5, 10.5, k => { stage.ceilLight.intensity = 3.2 * (1 - k); }, smoothK);
    // the dusk itself has died while he slept: by 3 a.m. the window gives
    // almost nothing, and the doorway needs every bit of that dark
    tr(8.5, 12.0, k => {
      stage.duskFill.intensity = 0.5 * (1 - 0.85 * k);
      stage.outLight.intensity = 0.9 * (1 - 0.85 * k);
    }, smoothK);
    tr(8.0, 12.0, k => {
      duck('v4room', 1 - 0.9 * k); duck('fan', 1 - 0.8 * k);
    }, rawK);
    fade(9.5, 12.5, 0, 1);

    // 12.5–16.5 black, the clock alone, and then not even that
    step(14.6, () => { duck('clock', 0); });
    sfx(15.2, 'nightsilence', 0.9);

    // 16.5–21 three a.m. Same ceiling, wrong light, no clock.
    fade(16.5, 18.5, 1, 0);
    sfx(18.0, 'v4wake3am', 1);
    camTo(16.5, 21.0, LYING, LYING);
    pitchTo(16.5, 21.0, 0.95, 0.95);
    yawTo(16.5, 21.0, Math.PI / 2, Math.PI / 2);

    /* 21–29.5 the head turns. The kitchen doorway is a black he can feel —
       and NOTHING shows in it. What there is instead (v4.91, Chad's call:
       she is never seen): slippered footsteps crossing the kitchen tiles,
       and a chair leg dragged one hand-span over terrazzo, in a flat with
       one person in it. He watches an empty doorway while the sounds move. */
    const TO_KITCH = faceFrom(LYING.x, LYING.z, -stage.R.x, stage.KDOOR.z);
    pitchTo(21.0, 24.5, 0.95, 0.10, smoothK);
    yawTo(21.0, 24.5, Math.PI / 2, TO_KITCH, smoothK);
    sfx(24.0, 'heart', 0.55);
    sfx(24.6, 'hallsteps', 0.75);              // in the kitchen. Slippers. Hers.
    sfx(27.6, 'chair', 0.8);                   // a chair moves where no one is

    // 29.5–33 he sits up hard; the lamp crawls back on; the room is empty
    sfx(29.5, 'boom');
    camTo(29.5, 30.6, LYING, { x: SOFAPT.x, y: 1.25, z: SOFAPT.z }, rawK);
    pitchTo(29.5, 30.6, 0.10, -0.05, rawK);
    tr(29.7, 31.2, (k, t2) => {
      stage.lampLight.intensity = 1.7 * k * (0.6 + Math.abs(Math.sin(t2 * 23)) * 0.4);
    }, rawK);
    sfx(29.9, 'lightbuzz', 0.6);
    sfx(31.4, 'breath', 0.8);
    tr(31.5, 34.0, () => {}, rawK);
    fade(34.0, 37.5, 0, 1);
    step(37.5, () => { handsRoot.visible = true; });

    c.endFade = 1;
  }

  /* --------------------------------------------------- C · PROVOKE THE PRESENCE
     He stands up and dares it — and the flat answers with everything it
     has, in order, and then stops all at once, which is worse. The phone
     rings by itself; when the silence comes, the handset is off the hook.
     He never sees her. He is not given even that much.                   */
  function scProvoke(c, s, api) {
    const { tr, step, sfx, fade, camTo, yawTo, pitchTo, faceFrom, rawK, smoothK,
            duck, stage, camera, ghostOpacity, handsRoot } = api;
    const CENTRE = { x: 0.2, y: EYE, z: 0.5 };
    const TO_PHONE = faceFrom(CENTRE.x, CENTRE.z, -0.4, stage.R.zNear - 0.3);
    const TO_TV = faceFrom(CENTRE.x, CENTRE.z, -2.8, 0.4);
    const nz = t2 => Math.abs(Math.sin(t2 * 91.7) * 43758.5) % 1;   // deterministic static

    step(0, () => { ghostOpacity(0); handsRoot.visible = false; });
    // 0–3 up from the chair, hard — the chair legs bark on the terrazzo
    sfx(0.4, 'sitdown', 1);
    camTo(0, 2.2, { x: s.yawPos.x, y: s.yawPos.y, z: s.yawPos.z }, CENTRE, smoothK);
    yawTo(0, 2.2, s.yawRot, 0.2, smoothK);
    pitchTo(0, 2.2, s.pitchX, 0.02, smoothK);

    // 3–8 the shout, thrown at the whole flat
    sfx(2.6, 'v4taunt');
    tr(2.6, 3.4, k => { camera.rotation.z = 0.02 * Math.sin(k * Math.PI); }, rawK);

    // 8–11 the answer is silence: everything ducks to nothing at once
    tr(8.0, 8.6, k => {
      duck('v4room', 1 - k); duck('clock', 1 - k); duck('fan', 1 - k);
    }, rawK);
    tr(8.6, 11.0, () => {}, rawK);                // three seconds of nothing

    // 11–13.5 the ceiling light stutters
    sfx(11.0, 'lightbuzz', 0.9);
    tr(11.0, 13.4, (k, t2) => {
      stage.ceilLight.intensity = 3.2 * (nz(t2 * 3.1) > 0.42 ? 1 : 0.22);
    }, rawK);

    // 13.5–17 the TV snaps itself on to static, strobing the room
    sfx(13.5, 'tvstatic', 0.95);
    tr(13.5, 24.0, (k, t2) => {
      const n = nz(t2);
      stage.tvScreen.material.color.setScalar(0.25 + n * 0.6);
      stage.tvLight.intensity = 2.2 + n * 2.4;
    }, rawK);
    yawTo(13.6, 15.0, 0.2, TO_TV, smoothK);       // he whips to the screen

    // 17–21.5 the phone rings by itself, and he whips the other way
    sfx(17.0, 'phonebell', 1);
    yawTo(17.2, 18.4, TO_TV, TO_PHONE, smoothK);
    pitchTo(17.2, 18.4, 0.02, -0.30, smoothK);    // down: the phone, not the clock
    camTo(17.2, 19.4, CENTRE, { x: 0.0, y: EYE, z: 1.1 }, smoothK);
    /* v5.24: the cloth beat is gone with the curtains (Chad removed them
       from this window). The BOOM was always the punctuation under it and
       it still lands here on its own. */
    sfx(22.5, 'boom');

    // 24–28 everything at once: heart, strobe, the room pushing him —
    // and her leitmotif NEVER plays in this chapter (v4.91)
    sfx(24.8, 'heart', 0.8);
    tr(24.0, 28.0, (k, t2) => {
      camera.rotation.z = 0.05 * Math.sin(t2 * 9) * k;
    }, rawK);
    camTo(24.0, 28.0, { x: 0.0, y: EYE, z: 1.1 }, { x: 1.6, y: EYE - 0.1, z: 1.0 }, smoothK);

    // 28 IT ALL STOPS. Dead. The cut is the scare.
    step(28.0, () => {
      stage.tvLight.intensity = 0;
      stage.tvScreen.material.color.setHex(0x0a0c0e);
      stage.ceilLight.intensity = 0.9;            // dim, steady, wrong
    });
    tr(28.0, 30.0, () => { camera.rotation.z = 0; }, rawK);

    // 30–35 in the silence, a dial tone: the handset hangs off its cord
    step(30.0, () => {
      stage.handset.position.set(0.16, -0.35, 0.12);
      stage.handset.rotation.set(0.4, 0.3, 1.45);
    });
    tr(30.0, 38.0, (k, t2) => {
      stage.handset.position.x = 0.16 + Math.sin(t2 * 1.7) * 0.025;
      stage.handset.rotation.z = 1.45 + Math.sin(t2 * 1.7) * 0.14;
    }, rawK);
    sfx(30.2, 'dialtone', 0.55);
    camTo(30.2, 33.0, { x: 1.6, y: EYE - 0.1, z: 1.0 }, { x: 0.3, y: 1.3, z: 1.6 }, smoothK);
    yawTo(30.2, 33.0, TO_PHONE, faceFrom(0.3, 1.6, -0.4, stage.R.zNear - 0.3), smoothK);
    pitchTo(30.2, 33.0, -0.30, -0.42, smoothK);   // on the hanging handset
    sfx(33.5, 'v4regret', 1);
    tr(36.0, 38.0, () => {}, rawK);
    fade(38.0, 43.0, 0, 1);
    step(42.9, () => { handsRoot.visible = true; });

    c.endFade = 1;
  }

  /* --------------------------------------------------- D · ASK FOR HELP AGAIN
     The best answer is a boy dialing a number he has known his whole life.
     Ma answers on the second ring. The scene is her voice in a quiet room,
     and the promise that carries chapter 5: tomorrow, the tang-ki comes to
     the house. He hangs up and the flat is 10 percent warmer.            */
  function scCall(c, s, api) {
    const { tr, step, sfx, fade, camTo, yawTo, pitchTo, faceFrom, rawK, smoothK,
            duck, stage, ghostOpacity, handsRoot } = api;
    const TO_PHONE = faceFrom(PHONEPT.x, PHONEPT.z, -0.4, stage.R.zNear - 0.24);
    const TO_WIN = faceFrom(PHONEPT.x, PHONEPT.z, -0.4, -stage.R.z);
    const TO_HALL = faceFrom(PHONEPT.x, PHONEPT.z, 2.05, stage.R.zNear + 0.8);

    step(0, () => { ghostOpacity(0); });
    // 0–3.5 up, and across the room to the phone table
    camTo(0, 3.0, { x: s.yawPos.x, y: s.yawPos.y, z: s.yawPos.z }, PHONEPT, smoothK);
    yawTo(0, 3.0, s.yawRot, TO_PHONE, smoothK);
    pitchTo(0, 3.0, s.pitchX, -0.62, smoothK);    // down at the phone — from a
                                                  // metre back it sits low

    // 3.5–12.5 pickup, dial tone, seven beeps, and the ring
    sfx(3.6, 'phonepick', 0.9);
    step(3.7, () => {
      /* the handset rides the viewmodel: parented into the hands rig it
         breathes and sways with him, held up at the right of frame — the
         phone GRABBED IN HIS HAND while he speaks (v4.91, Chad's call).
         stage.restore() re-seats it on the cradle whatever happens. */
      handsRoot.add(stage.handset);
      stage.handset.position.set(0.26, -0.12, -0.48);
      stage.handset.rotation.set(0.45, -0.6, 1.15);
    });
    pitchTo(3.7, 4.6, -0.62, -0.40, smoothK);     // lifts a shade as the handset does
    sfx(4.3, 'dialtone', 0.5);
    sfx(5.6, 'dialbeep', 0.8);
    sfx(8.4, 'ringtone', 0.75);
    tr(8.4, 12.4, k => { duck('v4room', 1 - 0.5 * k); }, rawK);

    // 12.9–17.7 click. Her voice, small and filtered and enough. (4.75 s)
    sfx(12.9, 'v4ma1', 1);
    pitchTo(12.9, 14.0, -0.40, -0.50, smoothK);   // head bows into her voice
    tr(12.9, 17.7, () => {}, rawK);

    /* 18.6–28.4 his side of it — shaky, honest (5.96 s, then 3.08 s). The
       gaps between turns are REAL phone gaps (v4.91: 0.35 s cuts read as
       people talking over each other; ~1 s reads as listening). */
    sfx(18.6, 'v4call1', 1);
    pitchTo(18.6, 20.1, -0.50, -0.32, smoothK);   // lifts as he finds the words
    sfx(25.3, 'v4call2', 1);

    // 29.3–38.3 the promise (8.99 s). While she talks he drifts to the
    // window: the block opposite, floor after floor of other evenings.
    sfx(29.3, 'v4ma2', 1);
    yawTo(30.5, 36.0, TO_PHONE, TO_WIN, smoothK);
    camTo(30.5, 36.0, PHONEPT, { x: -0.2, y: EYE, z: 1.0 }, smoothK);
    pitchTo(30.5, 36.0, -0.32, 0.02, smoothK);

    // 39.2–43.3 lock the door. Leave the light on. I'm coming home. (4.05 s)
    sfx(39.2, 'v4ma3', 1);
    tr(39.2, 43.2, () => {}, rawK);

    // 43.3–49.5 hang up; the exhale; the lamp comes up a shade warmer
    yawTo(43.3, 44.6, TO_WIN, TO_PHONE, smoothK);
    camTo(43.3, 44.6, { x: -0.2, y: EYE, z: 1.0 }, PHONEPT, smoothK);
    pitchTo(43.3, 44.6, 0.02, -0.55, smoothK);    // down, to cradle it
    sfx(44.7, 'phonedown', 0.85);
    step(44.8, () => {
      stage.phone.add(stage.handset);             // back on the cradle
      stage.handset.visible = true;
      stage.handset.position.copy(stage.HANDSET_HOME.pos);
      stage.handset.rotation.set(0, 0, 0);
    });
    sfx(45.6, 'vrelief', 0.85);
    tr(45.6, 48.0, k => {
      stage.lampLight.intensity = 1.7 + 0.5 * k;
      duck('v4room', 0.5 + 0.5 * k);
    }, smoothK);

    // 48.2–51.2 he looks down the corridor: the two doors. Home, with help coming.
    yawTo(48.2, 50.0, TO_PHONE, TO_HALL, smoothK);
    pitchTo(48.2, 50.0, -0.55, 0.0, smoothK);
    tr(50.0, 51.0, () => {}, rawK);
    fade(49.7, 51.2, 0, 1);

    c.endFade = 1;
  }

  (window.__CHAPTERS__ = window.__CHAPTERS__ || {}).ch4 = Object.assign(DATA, {
    build(ctx) {
      _THREE = ctx.THREE;
      return build(ctx);
    },
    intro,
    scenes: [scThink, scSleep, scProvoke, scCall]
  });
})();
