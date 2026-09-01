/* Chapter 5 · The Lesson
   ---------------------------------------------------------------------------
   The morning after the phone call. The SAME flat as chapter 4 — its room
   recipe copied here whole, because a chapter owns its world — but in full
   morning sun: Ma is home, the tea is poured, and the tang-ki from the
   tentage is standing in the living room reading the flat like a letter.
   In the opening film he finds what four chapters were built around: the
   hell note, taped under the seat of the dining chair.

   THE AXIS (the escalation contract): ch1 DISTANCE, ch2 SMALLNESS, ch3
   INVERSION, ch4 INTRUSION — and this is RELEASE. The debt is finally
   named, faced and paid; the episode ends with the note burned at the
   home altar and the daylight swelling. She is NEVER SEEN (the v4.91
   law), and `strings` is never cued: the tang-ki shows where she is by
   where HE looks. With him in the room, the flat HOLDS ITS BREATH — no
   poltergeist clock; the stillness after four chapters of wrongness is
   itself the tell.

   Same contract as every chapter: build(ctx) -> stage, intro(c,s,api),
   scenes[i](c,s,api). Source: docs/source/trial-game-chapters.md, episode
   one, chapter five (THE LESSON) — choices and teachings verbatim, deltas
   rescaled by the same ×2.73 as chapters 2-4.                            */

(() => {
  'use strict';

  let S = null;

  const DATA = {
    id: 5,
    title: 'The Lesson',

    cardLabel: 'Chapter 5',
    cardTitle: 'The Lesson<br>What It Was All For',

    brief: 'Morning. Ma is home, the tea is poured, and the tang-ki from the tentage is standing in the living room reading the flat like a letter. On the table: the hell note. It was here all along.',
    prompt: 'The tang-ki has read every room, and the note lies on the table between you. What do you ask of him?',

    choices: [
      {
        k: 'A', text: 'Seek experienced guidance.',
        d: { sanity: 16, awareness: 22, wisdom: 30 },
        verdict: 'good',
        say: 'You sit down with him and ask what you should learn from everything that happened. In daylight, the same hallway is examined calmly. Fear gives way to observation.',
        teach: 'Do not assume. Do not provoke. Observe, understand the circumstances and seek knowledge before acting.'
      },
      {
        k: 'B', text: 'Trust fear alone.',
        d: { sanity: -16, awareness: -14, wisdom: -22 },
        verdict: 'bad',
        say: 'You let the memory of the nights decide what everything means. Fear begins filling in the missing information before you verify what is actually there.',
        teach: 'Fear is a signal, not proof. Verify before deciding what something means.'
      },
      {
        k: 'C', text: 'Dismiss everything.',
        d: { sanity: 5, awareness: -19, wisdom: -19 },
        verdict: 'worst',
        say: 'You decide every experience must have been imagination and refuse to examine any of it further. You avoid the fear — and lose what it was trying to teach.',
        teach: 'Blind disbelief can be as unhelpful as blind belief. Discernment requires observation.'
      },
      {
        k: 'D', text: 'Learn and move forward.',
        d: { sanity: 19, awareness: 27, wisdom: 30 },
        verdict: 'best',
        say: 'You accept that you do not understand everything yet, and commit to learning without recklessness. The note is returned to the fire. The case becomes your first lesson.',
        teach: 'Wisdom grows when experience is combined with humility, observation and proper guidance.'
      }
    ],
    core: 'Do not assume. Do not provoke. Observe, and seek knowledge before acting.<br><i>The first case is closed. The lesson is yours to keep.</i>',

    /* --- the stage ------------------------------------------------------
       The same room as chapter 4: x -3.2..3.2, z -2.6 (the window wall)
       to +2.8 (the corridor wall), ceiling 2.6 — in MORNING sun. */
    spawn:     { x: -1.8, y: 1.62, z: 2.0 },     // in from the front door
    /* `shrine` is the engine's interactable anchor. Here it is THE
       TANG-KI's stand, mid-room between the table and the window: the
       chapter's one act is to go to him and ask. */
    shrine:    { x: 0.9, z: -0.4 },
    ghostHome: { x: -2.7, z: -1.4 },             // unused: ghost is null
    bounds:    { minX: -3.05, maxX: 3.05, minZ: -2.45, maxZ: 3.55 },

    /* The v4.91 law holds: she is never seen and `strings` never plays.
       With the tang-ki in the room there is no poltergeist clock either —
       the flat HOLDS ITS BREATH, and the stillness is the tell. */
    ghost: null,

    /* Morning: high white-gold sky, the sun well up, thin haze. The room
       needs no lamps — the first daytime interior of the whole game.    */
    daylight: {
      stops: [[0.00, '#f6e7c8'], [0.20, '#dcebf2'], [0.45, '#a8cfe8'],
              [0.75, '#7fb6de'], [1.00, '#6aa8d8']],
      bg: 0xa8cfe8,
      fog: [0xd8e4ea, 0.008],
      hemi: [0xeaf2f8, 0x8a8272, 0.85],
      key: [0xfff2d8, 0.95, 14, 20, -6],   // the morning sun, high east
      fill: [0xbcd4e6, 0.30],
      stars: 0, moon: 0,
      sun: 1, clouds: 0.5,
      vmHemi: [0xf2f6fa, 0x9a9284, 0.85],
      vmKey: [0xfff4dc, 0.7]               // the hands live in daylight
    },

    /* hdb is the block opposite — the fifth chapter at the same block,
       which is the point. seat is the red chair (a hall prop continuity).
       praying is the tang-ki, mother is Ma, hellnote is the REAL note art
       the engine hands back through setNoteTexture: the found note on the
       table carries the photograph, not the drawn card.                 */
    assets: ['hdb', 'seat', 'praying', 'mother', 'hellnote'],
    noteArt: 'hellnote',

    /* Morning sound: the estate awake, far off. The dread bed is all but
       silent — this chapter is the exhale.                              */
    musicVol: 0.15,
    ambience: { beds: [['v5room', 0.3], ['clock', 0.08]], atShrine: null },
    words: {
      approach: 'He walks the flat like he is reading it...',
      act: 'E — speak to the tang-ki',
      actTouch: 'tap the tang-ki',
      interact: 'Ask him what he saw',
      interactTouch: 'the tang-ki'
    },
    lines: { near: 'v5near', close: 'v5sit', nearAt: 2.6 },
    voiceLine: 'v5voice',
    sayPrefix: 'v5'
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
    const matSheet = new THREE.MeshStandardMaterial({ color: 0xcac2ae, roughness: 0.94, side: THREE.DoubleSide });
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
    // curtains at both edges, with base arrays so they can billow
    const curtainGeoL = new THREE.PlaneGeometry(0.6, WIN.top - WIN.sill + 0.3, 6, 1);
    const curtainL = new THREE.Mesh(curtainGeoL, matSheet);
    curtainL.position.set(-WIN.w / 2 + 0.22, (WIN.sill + WIN.top) / 2 - 0.08, 0.12);
    winGroup.add(curtainL);
    const curtainR = new THREE.Mesh(curtainGeoL.clone(), matSheet);
    curtainR.position.set(WIN.w / 2 - 0.22, (WIN.sill + WIN.top) / 2 - 0.08, 0.12);
    winGroup.add(curtainR);
    const curtLBase = curtainL.geometry.attributes.position.array.slice();
    const curtRBase = curtainR.geometry.attributes.position.array.slice();

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
    /* morning: nobody's window is lit — the evening quads stay dark */
    for (const w2 of litWins) w2.visible = false;

    /* ------------------------------------------------------------ lighting */
    /* Morning: the interior lights are OFF — the declared daylight does the
       work. The fixtures stay (the same flat), the altar's oil lamp still
       burns low, and scene D is the one that raises a light: the burn.  */
    const ceilLight = new THREE.PointLight(0xffe2b8, 0, 9.5, 1.35);
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
    const duskFill = new THREE.DirectionalLight(0xcfe0ee, 0.15);
    duskFill.position.set(-2, 4, -10);
    scene.add(duskFill); owned.push(duskFill);

    // the corridor outside the front door, for the film: dusk on concrete
    const outLight = new THREE.PointLight(0xdfe9f2, 0, 6.5, 1.6);
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
    // the third cup, poured for the tang-ki — v5voice: he hasn't touched his
    const cup3 = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.026, 0.05, 10), matCream);
    cup3.position.set(0.42, TABLE.top + 0.048, -0.22);
    table.add(cup3);

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
    /* THE CHAIR — chapter 4's thinking chair, in its exact spot: the film
       finds the note taped under THIS seat. Furniture now, not the
       interactable — the tang-ki is the thing you speak to.             */
    const CHAIR = { x: 1.3, z: 0.25 };
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
    for (const fz of [-0.1, -0.02]) {
      const f = new THREE.Mesh(new THREE.SphereGeometry(0.034, 12, 10), fruitMat4);
      f.position.set(0.02, 1.755, fz);
      f.scale.y = 0.88;
      homeAltar.add(f);
    }

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
    /* ------------------------------------------------ the morning's cast --
       THE TANG-KI (the praying man — ch3's load recipe verbatim: mixer
       FIRST, then size and ground from POSED BONES, never a box) stands
       mid-room at the interact anchor; his clip runs at half rate — a
       quiet standing sway, a man listening to a house. MA (ch2's mother
       recipe verbatim: the idle cut past its 1.6 s lead-in) waits by the
       kitchen doorway. Both are the film's actors; scenes glide the
       groups. Invisible proxies stand in while the GLBs fly and give the
       interact raycast something to hit.                                */
    const TANG_H = 1.68;
    const tangki = new THREE.Group();
    tangki.position.set(SHRINE.x, 0, SHRINE.z);
    tangki.rotation.y = 2.1;                     // reading the altar wall
    world.add(tangki);
    const tangProxy = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.30, 1.66, 10),
      new THREE.MeshStandardMaterial({ color: 0x6a5c4a, roughness: 0.9 }));
    tangProxy.position.y = 0.83;
    tangProxy.castShadow = true;
    tangki.add(tangProxy);
    let tangMixer = null, tangHead = null;
    let tangBow = 0;                             // scenes add this to the head, post-mixer
    assetBytes('praying').then(BUF => new GLTFLoader().parse(BUF, '', (gltf) => {
      if (!alive) return;
      rescueTextures(gltf, BUF);
      const g = gltf.scene;
      g.traverse(o => { if (o.isMesh) { o.castShadow = !LOW; o.frustumCulled = false; } });
      if (gltf.animations.length) {
        tangMixer = new THREE.AnimationMixer(g);
        tangMixer.clipAction(gltf.animations[0]).play();
        tangMixer.update(0.001);                 // pose him before measuring
      }
      g.updateMatrixWorld(true);
      const v = new THREE.Vector3();
      let lo = Infinity, hi = -Infinity;
      g.traverse(o => {
        if (!o.isBone) return;
        o.getWorldPosition(v);
        lo = Math.min(lo, v.y); hi = Math.max(hi, v.y);
        if (/Head$/.test(o.name) && !tangHead) tangHead = o;
      });
      if (isFinite(lo) && hi > lo) {
        const s = TANG_H / (hi - lo);
        g.scale.setScalar(s);
        g.position.y = -lo * s;
      }
      tangProxy.visible = false;
      tangki.add(g);
      redoShadows();
    }, () => {})).catch(() => {});

    const ma = new THREE.Group();
    ma.position.set(-2.45, 0, -0.85);            // by the kitchen doorway
    ma.rotation.y = 1.2;                         // half toward the room
    world.add(ma);
    const maProxy = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.26, 1.5, 10),
      new THREE.MeshStandardMaterial({ color: 0x7a5c50, roughness: 0.9 }));
    maProxy.position.y = 0.75;
    ma.add(maProxy);
    let maMixer = null;
    assetBytes('mother').then(BUF => new GLTFLoader().parse(BUF, '', (gltf) => {
      if (!alive) return;
      rescueTextures(gltf, BUF);
      const g = gltf.scene;
      const box = new THREE.Box3().setFromObject(g);
      const s = 1.60 / (box.max.y - box.min.y);  // first guess; bones correct it
      g.scale.setScalar(s);
      g.traverse(o => { if (o.isMesh) { o.castShadow = !LOW; o.frustumCulled = false; } });
      if (gltf.animations && gltf.animations.length) {
        const fps = 30;                          // the ch2 lesson: cut past the lead-in
        const clip = THREE.AnimationUtils.subclip(
          gltf.animations[0], 'idle', Math.round(1.6 * fps), Math.floor(8.2 * fps), fps);
        maMixer = new THREE.AnimationMixer(g);
        maMixer.clipAction(clip).play();
        maMixer.update(0.001);                   // pose her before measuring
      }
      g.updateMatrixWorld(true);
      const v = new THREE.Vector3();
      let toeY = Infinity, headY = -Infinity;
      g.traverse(o => {
        if (!o.isBone) return;
        o.getWorldPosition(v);
        if (/Toe|Foot/.test(o.name)) toeY = Math.min(toeY, v.y);
        if (/Head/.test(o.name)) headY = Math.max(headY, v.y);
      });
      if (isFinite(toeY) && headY > toeY) {
        const s2 = s * (1.56 / (headY - toeY));
        g.scale.setScalar(s2);
        g.position.y = -toeY * (s2 / s);
      }
      maProxy.visible = false;
      ma.add(g);
      redoShadows();
    }, () => {})).catch(() => {});

    /* THE NOTE — the found thing itself. build() puts it ON THE TABLE
       (play state = after the film's discovery; the film starts it under
       the chair seat and the engine's restore reseats it here). The drawn
       texture ships immediately; the photographed art arrives through
       setNoteTexture and swaps in brightened — the v3.8 lesson.         */
    const noteMat = new THREE.MeshStandardMaterial({
      map: noteTex, roughness: 0.85, side: THREE.DoubleSide });
    const note = new THREE.Mesh(new THREE.PlaneGeometry(0.15, 0.09), noteMat);
    const NOTE_HOME = {
      parent: table,
      pos: new THREE.Vector3(0.18, TABLE.top + 0.004, -0.05),
      rot: new THREE.Euler(-Math.PI / 2, 0, 0.5)
    };
    note.position.copy(NOTE_HOME.pos);
    note.rotation.copy(NOTE_HOME.rot);
    table.add(note);

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
    const PILE_POS = new THREE.Vector3(SHRINE.x, 0, SHRINE.z);
    const INTERACT_R = 1.6;
    const HIGHLIGHT_R = 2.6;
    const MARK_R = 4.4;

    const chairRing = new THREE.Mesh(
      new THREE.RingGeometry(0.34, 0.48, 40),
      new THREE.MeshBasicMaterial({ color: 0x63d6c8, transparent: true, opacity: 0,
        side: THREE.DoubleSide, blending: THREE.AdditiveBlending,
        depthWrite: false, fog: false }));
    chairRing.rotation.x = -Math.PI / 2;
    chairRing.position.set(SHRINE.x, 0.03, SHRINE.z);
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
    markRoot.position.set(SHRINE.x, 1.95, SHRINE.z);   // over his head
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
      if (_ray.intersectObject(tangki, true).length) return true;
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
    let billow = 0;                 // scene C throws the curtains

    const _m4 = new THREE.Matrix4();
    /* the cast breathes: his clip at half rate (a man standing quietly,
       listening to a house), hers at a domestic idle. tangBow is a scene's
       own addition, laid on the head bone AFTER the mixer each frame so it
       survives the clip — the ch3/v4.8 re-lay law.                      */
    function castUpdate(dt) {
      if (tangMixer) {
        tangMixer.update(dt * 0.5);
        if (tangHead && tangBow) tangHead.rotation.x += tangBow;
      }
      if (maMixer) maMixer.update(dt * 0.9);
    }

    function updateNotes(dt, t) {
      castUpdate(dt);
      fan.rotation.y += dt * 2.0 * fanSpeed;

      const air = 0.014 * noteStorm;
      const cpL = curtainL.geometry.attributes.position.array;
      const cpR = curtainR.geometry.attributes.position.array;
      for (let i = 0; i < cpL.length; i += 3) {
        const y = curtLBase[i + 1];
        const b = Math.max(0, (y + 0.6)) * billow;
        cpL[i + 2] = curtLBase[i + 2] + Math.sin(t * 1.2 + y * 2.0) * air
          + Math.sin(t * 7.0 + y * 3.0) * 0.10 * b;
        cpR[i + 2] = curtRBase[i + 2] + Math.sin(t * 1.35 + y * 2.1) * air
          + Math.sin(t * 6.4 + y * 2.7) * 0.10 * b;
      }
      curtainL.geometry.attributes.position.needsUpdate = true;
      curtainR.geometry.attributes.position.needsUpdate = true;

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
        fanSpeed, storm: noteStorm, billow,
        ceil: ceilLight.intensity, lamp: lampLight.intensity,
        alt: altLight.intensity, tvL: tvLight.intensity,
        tvCol: tvScreen.material.color.getHex(),
        doorRot: doorMain.rotation.y,
        hsPos: handset.position.clone(), hsRot: handset.rotation.clone(),
        hsParent: handset.parent,
        tangPos: tangki.position.clone(), tangRot: tangki.rotation.y,
        maPos: ma.position.clone(), maRot: ma.rotation.y,
        notePos: note.position.clone(), noteRot: note.rotation.clone(),
        noteParent: note.parent,
        dusk: duskFill.intensity, out: outLight.intensity,
        lateOp: lateMat.opacity,
        fog: scene.fog ? scene.fog.density : null
      };
    }
    function restore(s) {
      fanSpeed = s.fanSpeed; noteStorm = s.storm; billow = s.billow;
      ceilLight.intensity = s.ceil; lampLight.intensity = s.lamp;
      altLight.intensity = s.alt; tvLight.intensity = s.tvL;
      tvScreen.material.color.setHex(s.tvCol);
      doorMain.rotation.y = s.doorRot;
      if (s.hsParent && handset.parent !== s.hsParent) s.hsParent.add(handset);
      handset.visible = true;
      handset.position.copy(s.hsPos);
      handset.rotation.copy(s.hsRot);
      tangki.position.copy(s.tangPos); tangki.rotation.y = s.tangRot;
      ma.position.copy(s.maPos); ma.rotation.y = s.maRot;
      if (s.noteParent && note.parent !== s.noteParent) s.noteParent.add(note);
      note.position.copy(s.notePos);
      note.rotation.copy(s.noteRot);
      note.visible = true;
      tangBow = 0;
      if (s.dusk !== undefined) { duskFill.intensity = s.dusk; outLight.intensity = s.out; }
      lateMat.opacity = s.lateOp;
      if (scene.fog && s.fog !== null) scene.fog.density = s.fog;
    }

    const REST = {
      ceil: ceilLight.intensity, lamp: lampLight.intensity,
      alt: altLight.intensity,
      dusk: duskFill.intensity, out: outLight.intensity
    };
    function reset() {
      fanSpeed = 1; noteStorm = 1; billow = 0;
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
      tangki.position.set(SHRINE.x, 0, SHRINE.z);
      tangki.rotation.y = 2.1;
      ma.position.set(-2.45, 0, -0.85);
      ma.rotation.y = 1.2;
      table.add(note);
      note.position.copy(NOTE_HOME.pos);
      note.rotation.copy(NOTE_HOME.rot);
      note.visible = true;
      tangBow = 0;
      duskFill.intensity = REST.dusk; outLight.intensity = REST.out;
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
      for (const w of walls) box(w);
      box(tableTop); box(sofaBase); box(tvConsole); box(tvBody);
      box(ptTop); box(shoeRack); box(doorLeaf);
      box(tangProxy); box(maProxy);              // two people are solid
      for (const c of chairs) box(c.children[0]);
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

    return (S = {
      world, noteTex, blockers: blockers(),
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
      curtainL, curtainR, winGroup, kitDark, homeAltar, altTip, altLight,
      ceilLight, lampLight, duskFill, outLight, fan,
      hall, bedDoor, maDoor, lateMat, litWins,
      tangki, tangProxy, ma, note, NOTE_HOME, cup3,
      get tangBow() { return tangBow; },
      set tangBow(v) { tangBow = v; },
      CHAIR, TABLE, R, WIN, KDOOR, CORR,
      get fanSpeed() { return fanSpeed; },
      set fanSpeed(v) { fanSpeed = v; },
      get noteStorm() { return noteStorm; },
      set noteStorm(v) { noteStorm = v; },
      get billow() { return billow; },
      set billow(v) { billow = v; },
      updateNotes, updatePile, updateFire, updateSlow,
      /* scene B closes the fog a little — the fear in his head — and
         not washed to the fog colour; the engine's api does not hand a
         scene reference to cutscenes, so the fog crosses this seam */
      setFogDensity(d) { if (scene.fog) scene.fog.density = d; },
      getFogDensity() { return scene.fog ? scene.fog.density : null; },
      /* the engine downloads the photographed note and hands it here;
         brightened as it goes in — the v3.8 lesson: a saturated print at
         interior light collapses into a dark tile.                      */
      setNoteTexture(tex) {
        noteMat.map = tex;
        noteMat.color.setScalar(1.75);
        noteMat.emissive = new THREE.Color(0x1a1408);
        noteMat.needsUpdate = true;
      },
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
     Three knocks on a bright morning. Ma opens the door and the tang-ki
     from the tentage steps in — and reads the flat like a letter: the
     threshold, the kitchen doorway (a small bow to the empty dark), and
     then the dining chair, where his hand goes UNDER the seat and comes
     out with the hell note. His first words in the whole game land on the
     note held up in the morning light. Title card on that image.
     Every timing here is measured take length + gap, per the plan doc.  */
  function intro(c, s, api) {
    const { tr, step, sfx, fade, camTo, yawTo, pitchTo, faceFrom, rawK, smoothK,
            duck, stage, ghostOpacity, handsRoot } = api;

    const SOFA_END = { x: 2.3, y: EYE, z: 1.05 };
    const MIDPUSH = { x: 0.8, y: EYE, z: 1.7 };
    const DOORAT = { x: stage.DOORM.x, z: stage.R.zNear };
    const KD = { x: -stage.R.x, z: stage.KDOOR.z };
    const Y_DOOR = faceFrom(SOFA_END.x, SOFA_END.z, DOORAT.x, DOORAT.z);
    const Y_DOOR2 = faceFrom(MIDPUSH.x, MIDPUSH.z, DOORAT.x, DOORAT.z);
    const Y_KD = faceFrom(MIDPUSH.x, MIDPUSH.z, KD.x, KD.z);
    const CHX = 1.3, CHZ = 0.25;                 // the chair (the note's spot)
    const LOWCAM = { x: CHX - 0.95, y: 0.52, z: CHZ + 0.95 };
    const Y_LOW = faceFrom(LOWCAM.x, LOWCAM.z, CHX, CHZ);
    const INS_CAM = { x: CHX - 0.78, y: 1.34, z: CHZ + 0.78 };
    const INS_NOTE = { x: CHX - 0.38, y: 1.30, z: CHZ + 0.38 };
    const Y_INS = faceFrom(INS_CAM.x, INS_CAM.z, INS_NOTE.x, INS_NOTE.z);

    step(0, () => {
      handsRoot.visible = false;
      ghostOpacity(0);
      stage.doorMain.rotation.y = 0;
      duck('v5room', 0.5); duck('clock', 0.4);
      /* the note starts where four chapters left it: under the chair seat */
      stage.tangki.position.set(stage.DOORM.x, 0, stage.R.zNear + 0.85);
      stage.tangki.rotation.y = Math.PI;         // facing the door from outside
      stage.ma.position.set(-1.7, 0, 2.1);       // crossing to answer it
      stage.ma.rotation.y = faceFrom(-1.7, 2.1, DOORAT.x, DOORAT.z);
      const ch = stage.chairs[0];
      ch.add(stage.note);
      stage.note.position.set(0, 0.42, 0.02);
      stage.note.rotation.set(Math.PI / 2, 0, 0.4);
    });

    // 0-6.5 black: the morning, three knocks, Ma crossing, his line
    sfx(0.8, 'doorknock', 0.9);
    sfx(2.2, 'hallsteps', 0.5);
    sfx(3.5, 'v5wake1');                          // 1.72 s
    fade(6.5, 7.4, 1, 0);
    camTo(6.5, 16.0, SOFA_END, MIDPUSH, smoothK);
    yawTo(6.5, 16.0, Y_DOOR, Y_DOOR2, smoothK);
    pitchTo(6.5, 16.0, -0.02, -0.03, smoothK);

    // 7.2-10.2 the door opens on the morning corridor; Ma lets him in
    sfx(7.2, 'doorcreak', 0.7);
    tr(7.2, 9.0, k => { stage.doorMain.rotation.y = stage.DOORM_OPEN * k; }, smoothK);
    sfx(8.0, 'v5ma1');                            // 2.19 s
    // 10.5-13.5 he steps in and STOPS AT THE THRESHOLD; the house is read
    tr(10.5, 13.5, k => {
      stage.tangki.position.set(
        stage.DOORM.x + 0.35 * k, 0, stage.R.zNear + 0.85 - 1.55 * k);
    }, smoothK);
    step(13.5, () => { stage.tangki.rotation.y = 2.4; });   // a slow look left
    // Ma shuts the door behind him and withdraws toward the kitchen
    sfx(15.6, 'doorcreak', 0.4);
    tr(15.6, 17.2, k => { stage.doorMain.rotation.y = stage.DOORM_OPEN * (1 - k); }, smoothK);
    tr(15.0, 19.5, k => {
      stage.ma.position.set(-1.7 - 0.75 * k, 0, 2.1 - 2.95 * k);
    }, smoothK);
    step(19.5, () => { stage.ma.rotation.y = 1.2; });

    // 16-22 he crosses to the KITCHEN DOORWAY and BOWS to the empty dark
    yawTo(16.0, 19.0, Y_DOOR2, Y_KD, smoothK);
    tr(16.0, 19.6, k => {
      stage.tangki.position.set(
        stage.DOORM.x + 0.35 + (-2.15 - (stage.DOORM.x + 0.35)) * k, 0,
        stage.R.zNear - 0.7 + (stage.KDOOR.z + 0.6 - (stage.R.zNear - 0.7)) * k);
    }, smoothK);
    step(19.6, () => { stage.tangki.rotation.y = faceFrom(-2.15, stage.KDOOR.z + 0.6, KD.x, KD.z); });
    tr(20.0, 22.2, k => { stage.tangBow = 0.5 * Math.sin(Math.PI * k); }, rawK);
    sfx(18.5, 'v5wake2');                         // 2.19 s: "Why is he bowing..."

    // 22.5-27 he turns to the dining table; the camera goes LOW, under it
    tr(22.5, 25.8, k => {
      stage.tangki.position.set(
        -2.15 + (CHX - 0.55 - -2.15) * k, 0,
        stage.KDOOR.z + 0.6 + (CHZ + 0.4 - (stage.KDOOR.z + 0.6)) * k);
    }, smoothK);
    step(25.8, () => { stage.tangki.rotation.y = faceFrom(CHX - 0.55, CHZ + 0.4, CHX, CHZ); });
    camTo(24.2, 24.2, LOWCAM, LOWCAM);            // a hard cut down
    yawTo(24.2, 24.2, Y_LOW, Y_LOW);
    pitchTo(24.2, 26.0, 0.14, 0.10, smoothK);     // up, at the seat's underside

    // 26.5-28.5 the hand goes under the seat: the pull
    sfx(26.5, 'notepull', 0.9);
    step(27.3, () => {
      stage.chairs[0].remove?.(stage.note);
      stage.tangki.add(stage.note);               // in his hand as he rises
      stage.note.position.set(0.2, 1.05, 0.2);
      stage.note.rotation.set(0.3, 0.4, 0.2);
    });

    /* 28.5-40.5 THE INSERT: the note held up in the morning light — the
       real photographed art, a third of the frame. His first words in
       five chapters of game land here, and then the boy names it.       */
    step(28.5, () => {
      stage.tangki.remove?.(stage.note);
      stage.chairs[0].parent.add(stage.note);     // the world group
      stage.note.position.set(INS_NOTE.x, INS_NOTE.y, INS_NOTE.z);
      stage.note.rotation.set(-0.12, Y_INS + Math.PI, 0.06);
    });
    camTo(28.5, 40.5, INS_CAM,
      { x: INS_CAM.x - 0.05, y: INS_CAM.y + 0.02, z: INS_CAM.z - 0.05 }, smoothK);
    yawTo(28.5, 40.5, Y_INS, Y_INS);
    pitchTo(28.5, 40.5, -0.02, -0.02);
    sfx(29.0, 't5note');                          // 3.55 s: "Here. Under where you sit."
    sfx(33.5, 'v5wake3');                         // 6.84 s: "That's the note..."

    tr(40.3, 40.8, () => {}, rawK);
    fade(40.6, 42.6, 0, 1);
    step(42.5, () => { handsRoot.visible = true; });

    c.endFade = 1;
    c.keepFade = true;
  }

  /* ------------------------------------------- A · SEEK EXPERIENCED GUIDANCE
     The sit-down: chapter 4's chair, same framing, opposite light. His
     teaching lands slow across the table, and then the HALLWAY of every
     night scene is examined calmly, in daylight, exactly as the source
     says. Fear gives way to observation.                                */
  function scGuide(c, s, api) {
    const { tr, step, sfx, fade, camTo, yawTo, pitchTo, faceFrom, rawK, smoothK,
            duck, stage, ghostOpacity, handsRoot } = api;
    const Y_TANG = faceFrom(ATTABLE.x, ATTABLE.z, stage.tangki.position.x, stage.tangki.position.z);
    const RISEN = { x: 1.25, y: EYE, z: 1.3 };
    const HALLCAM = { x: 1.15, y: EYE, z: 2.2 };
    const HALLIN = { x: 1.9, y: EYE, z: 3.05 };
    const Y_HALL = faceFrom(HALLCAM.x, HALLCAM.z, 2.05, stage.R.zNear + 2.2);

    step(0, () => { ghostOpacity(0); handsRoot.visible = false; });
    sitDown(api, s);
    step(2.6, () => { handsRoot.visible = true; });   // his hands on the table
    yawTo(2.8, 4.0, 0, Y_TANG, smoothK);
    pitchTo(2.8, 4.0, -0.06, -0.03, smoothK);
    sfx(2.2, 'teaset', 0.6);
    tr(3.0, 5.0, k => { duck('v5room', 1 - 0.5 * k); }, rawK);

    // 5.0-19.8 the teaching (14.76 s), the tang-ki stepping a half-pace in
    sfx(5.0, 't5teachA');
    camTo(6.0, 19.0, ATTABLE,
      { x: ATTABLE.x - 0.08, y: ATTABLE.y + 0.02, z: ATTABLE.z - 0.10 }, smoothK);

    // 20.6-26 he turns for the corridor; the boy rises and follows
    step(20.5, () => { handsRoot.visible = false; });
    tr(21.0, 25.5, k => {
      const sx = 0.9 + (2.0 - 0.9) * k, sz = -0.4 + (2.3 - -0.4) * k;
      stage.tangki.position.set(sx, 0, sz);
    }, smoothK);
    step(25.5, () => { stage.tangki.rotation.y = Math.PI; });   // facing down the hall
    camTo(21.5, 26.5, ATTABLE, HALLCAM, smoothK);
    yawTo(21.5, 26.5, Y_TANG, Y_HALL, smoothK);
    pitchTo(21.5, 26.5, -0.03, 0.0, smoothK);

    /* 26.5-33.2 the hallway, calmly (6.69 s): the same corridor as every
       night, with the sun in it. The camera drifts INTO the mouth.      */
    sfx(26.5, 't5hallA');
    camTo(27.5, 33.5, HALLCAM, HALLIN, smoothK);

    // 34-38 back to the room; a soft close
    yawTo(34.5, 37.0, Y_HALL, faceFrom(HALLIN.x, HALLIN.z, 0.9, -0.4), smoothK);
    sfx(37.2, 'chime', 0.45);
    sfx(38.6, 'breath', 0.5);
    tr(38.5, 40.3, k => { duck('v5room', 0.5 + 0.5 * k); }, rawK);
    fade(40.5, 43.5, 0, 1);
    step(43.4, () => { handsRoot.visible = true; });

    c.endFade = 1;
  }

  /* ------------------------------------------------- B · TRUST FEAR ALONE
     The room in his head. He stares at the note and the morning drains:
     the day sounds die, the fog closes, and the poltergeist of chapter 4
     REPLAYS around him, loud and circling — while the bright room stands
     perfectly still. The tang-ki's voice cuts it, and everything releases
     at once. The scare is a lie told by fear, staged honestly.          */
  function scFear(c, s, api) {
    const { tr, step, sfx, fade, camTo, yawTo, pitchTo, faceFrom, rawK, smoothK,
            duck, stage, camera, ghostOpacity, handsRoot } = api;
    const AT_TABLE = { x: 0.55, y: EYE, z: 0.85 };
    const Y_NOTE = faceFrom(AT_TABLE.x, AT_TABLE.z, 1.45, -0.65);

    step(0, () => { ghostOpacity(0); handsRoot.visible = false; });
    camTo(0, 2.2, { x: s.yawPos.x, y: s.yawPos.y, z: s.yawPos.z }, AT_TABLE, smoothK);
    yawTo(0, 2.2, s.yawRot, Y_NOTE, smoothK);
    pitchTo(0, 2.2, s.pitchX, -0.35, smoothK);

    // 3-6 the morning drains
    tr(3.0, 6.0, k => {
      duck('v5room', 1 - 0.95 * k); duck('clock', 1 - k);
      stage.setFogDensity(0.008 + 0.006 * k);
    }, rawK);
    sfx(5.8, 'heart', 0.5);

    // 7-15.5 chapter 4's night, replayed by his own head, circling
    sfx(7.0, 'hallsteps', 0.85);
    sfx(10.0, 'chair', 0.8);
    sfx(12.5, 'hallsteps', 0.7);
    tr(7.0, 15.5, (k, t2) => {
      camera.rotation.z = Math.sin(t2 * 8.5) * 0.009 * k;
    }, rawK);
    sfx(15.3, 'boom', 0.6);

    /* 16.5-25.8 his voice cuts through (9.33 s). The first half lands in
       the fear; at 19.5 EVERYTHING releases at once and the second half
       lands in a bright, still, unchanged room.                         */
    sfx(16.5, 't5fearB');
    step(19.5, () => {
      duck('v5room', 1); duck('clock', 1);
      stage.setFogDensity(0.008);
      camera.rotation.z = 0;
    });
    pitchTo(19.5, 22.0, -0.35, -0.10, smoothK);

    // 27-30.6 the boy, shaky (3.55 s)
    sfx(27.0, 'v5fearB1');
    tr(30.8, 33.2, () => {}, rawK);
    fade(33.5, 36.5, 0, 1);
    step(36.4, () => { handsRoot.visible = true; });

    c.endFade = 1;
  }

  /* ------------------------------------------------ C · DISMISS EVERYTHING
     A short laugh, a turned back — and the flat declines to be dismissed:
     the curtains billow with no wind and the fan stops mid-turn. No ghost,
     no strings. He stops mid-step and does not turn around.             */
  function scDismiss(c, s, api) {
    const { tr, step, sfx, fade, camTo, yawTo, pitchTo, faceFrom, rawK, smoothK,
            duck, stage, ghostOpacity, handsRoot } = api;
    const AT_TABLE = { x: 0.5, y: EYE, z: 0.35 };
    const Y_NOTE = faceFrom(AT_TABLE.x, AT_TABLE.z, 1.45, -0.65);
    const TO_WIN = faceFrom(0.2, -0.9, stage.WIN.x, -stage.R.z);

    step(0, () => { ghostOpacity(0); handsRoot.visible = false; });
    camTo(0, 2.0, { x: s.yawPos.x, y: s.yawPos.y, z: s.yawPos.z }, AT_TABLE, smoothK);
    yawTo(0, 2.0, s.yawRot, Y_NOTE, smoothK);
    pitchTo(0, 2.0, s.pitchX, -0.30, smoothK);

    // 2.8-5.3 "Paper. It's just paper." (2.43 s)
    sfx(2.8, 'v5disC1');

    // 6.2-10 he turns his back on it and walks for the window
    yawTo(6.2, 8.2, Y_NOTE, TO_WIN, smoothK);
    pitchTo(6.2, 8.2, -0.30, -0.02, smoothK);
    camTo(6.2, 10.0, AT_TABLE, { x: 0.2, y: EYE, z: -0.9 }, smoothK);

    // 9.4-14.3 the tang-ki, quiet, behind him (4.91 s)
    sfx(9.4, 't5disC');

    /* 15.5-21 THE ANSWER, once: curtains billow with no wind; the fan
       stops mid-turn, holds, and resumes as if nothing happened.        */
    sfx(15.5, 'curtain', 0.8);
    tr(15.5, 18.5, k => { stage.billow = Math.sin(Math.PI * k) * 0.9; }, rawK);
    tr(15.5, 16.1, k => { stage.fanSpeed = 1 - k; }, rawK);
    tr(20.0, 21.0, k => { stage.fanSpeed = k; }, rawK);
    tr(15.5, 19.0, k => { duck('v5room', 1 - 0.7 * Math.sin(Math.PI * k)); }, rawK);
    pitchTo(15.8, 17.0, -0.02, -0.07, smoothK);   // the flinch, mid-step

    // 19-23 four held seconds, back still turned
    tr(19.0, 23.0, () => {}, rawK);
    fade(23.5, 26.5, 0, 1);
    step(26.4, () => { handsRoot.visible = true; });

    c.endFade = 1;
  }

  /* --------------------------------------------- D · LEARN AND MOVE FORWARD
     The burning. He takes the note to the home altar, strikes a match,
     and returns what was kept — one bell, the note curling to nothing,
     and the room lifting as if the flat had been holding its breath for
     five chapters. Ma says thank you. The episode ends here.            */
  function scLearn(c, s, api) {
    const { tr, step, sfx, fade, camTo, yawTo, pitchTo, faceFrom, rawK, smoothK,
            duck, stage, ghostOpacity, handsRoot } = api;
    const WATCH = { x: 0.35, y: EYE, z: 0.5 };
    const Y_TBL = faceFrom(WATCH.x, WATCH.z, 1.45, -0.65);
    const ALTCAM = { x: -1.45, y: EYE, z: -0.55 };
    const Y_ALT = faceFrom(ALTCAM.x, ALTCAM.z, -2.85, -2.15);

    step(0, () => { ghostOpacity(0); handsRoot.visible = false; });
    camTo(0, 2.4, { x: s.yawPos.x, y: s.yawPos.y, z: s.yawPos.z }, WATCH, smoothK);
    yawTo(0, 2.4, s.yawRot, Y_TBL, smoothK);
    pitchTo(0, 2.4, s.pitchX, -0.18, smoothK);

    // 2-5.3 the tang-ki comes to the table and takes the note up
    tr(2.0, 5.0, k => {
      stage.tangki.position.set(0.9 + (0.85 - 0.9) * k, 0, -0.4 + (0.05 - -0.4) * k);
    }, smoothK);
    sfx(4.8, 'notepull', 0.5);
    step(5.2, () => {
      stage.tangki.add(stage.note);
      stage.note.position.set(0.2, 1.12, 0.2);
      stage.note.rotation.set(0.4, 0.3, 0.1);
    });
    sfx(5.8, 't5learnD1');                        // 2.59 s: "We return what was kept."

    // 8.5-13 to the altar; Ma comes to stand at the edge of it
    tr(8.5, 12.5, k => {
      stage.tangki.position.set(0.85 + (-2.35 - 0.85) * k, 0, 0.05 + (-1.75 - 0.05) * k);
    }, smoothK);
    step(12.5, () => { stage.tangki.rotation.y = faceFrom(-2.35, -1.75, -2.85, -2.15); });
    tr(9.0, 13.0, k => {
      stage.ma.position.set(-2.45 + 0.35 * k, 0, -0.85 + (-0.5 - -0.85) * k * 2);
    }, smoothK);
    camTo(8.5, 12.5, WATCH, ALTCAM, smoothK);
    yawTo(8.5, 12.5, Y_TBL, Y_ALT, smoothK);
    pitchTo(8.5, 12.5, -0.18, -0.06, smoothK);

    // 13.8-27 the match, the burn, ONE bell — and the room lifts
    sfx(13.8, 'matchstrike', 0.85);
    tr(14.0, 15.0, k => { stage.altLight.intensity = 2.2 + 2.3 * k; }, rawK);
    sfx(15.2, 'noteburn', 0.85);                  // 12.04 s: the whole hold
    step(15.0, () => {
      stage.tangki.remove?.(stage.note);
      stage.homeAltar.add(stage.note);
      stage.note.position.set(0, 1.86, 0.12);
      stage.note.rotation.set(-0.5, 0, 0);
    });
    tr(15.2, 24.0, (k, t2) => {
      const sc = 1 - 0.85 * k;
      stage.note.scale.set(sc, sc, sc);
      stage.note.rotation.z = k * 0.6;
      stage.altLight.intensity = 4.5 * (0.85 + Math.sin(t2 * 9.5) * 0.15) * (1 - 0.35 * k);
    }, rawK);
    step(24.0, () => { stage.note.visible = false; stage.note.scale.set(1, 1, 1); });
    sfx(17.5, 'bellring', 0.7);
    /* the flat exhales: the room's fill light lifts through the burn */
    tr(16.0, 24.0, k => { stage.duskFill.intensity = 0.15 + 0.55 * k; }, smoothK);

    // 25-41 the three goodbyes, in turn, with real air between them
    sfx(25.0, 'v5ma2');                           // 2.12 s
    sfx(28.2, 't5learnD2');                       // 5.56 s
    sfx(35.0, 'v5learnD');                        // 5.15 s
    sfx(41.0, 'chime', 0.5);

    tr(41.5, 44.5, () => {}, rawK);
    fade(44.5, 47.5, 0, 1);
    step(47.4, () => { handsRoot.visible = true; });

    c.endFade = 1;
  }

  (window.__CHAPTERS__ = window.__CHAPTERS__ || {}).ch5 = Object.assign(DATA, {
    build(ctx) {
      _THREE = ctx.THREE;
      return build(ctx);
    },
    intro,
    scenes: [scGuide, scFear, scDismiss, scLearn]
  });
})();
