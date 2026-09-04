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
    episode: 1,            // v6.0: the case file this chapter belongs to — docs/EPISODES-PLAN.md
    title: 'The Lesson',

    cardLabel: 'Chapter 5',
    cardTitle: 'The Lesson<br>What It Was All For',

    brief: 'Morning. Ma is home, the tea is poured, and the tang-ki from the tentage is standing in the living room reading the flat like a letter. On the table: the hell note. It was here all along.',
    prompt: 'The tang-ki has read every room, and the hellnote lies on the table. What do you ask of him?',

    choices: [
      {
        k: 'A', text: 'Seek his guidance.',
        d: { sanity: 16, awareness: 22, wisdom: 30 },
        verdict: 'good',
        say: 'You sit down with him and ask what you should learn from everything that happened. Fear has given way to wisdom.',
        teach: 'Do not assume. Do not provoke. Observe, understand the situation and seek guidance before acting.'
      },
      {
        k: 'B', text: 'Ignore him and trust your fear alone.',
        d: { sanity: -16, awareness: -14, wisdom: -22 },
        verdict: 'bad',
        say: 'Fear begins filling in the missing information before you verify what is actually there.',
        teach: 'Always verify before deciding what something means.'
      },
      {
        k: 'C', text: 'Dismiss everything.',
        d: { sanity: 5, awareness: -19, wisdom: -19 },
        verdict: 'worst',
        say: 'You decide it must have been imagination and refuse to examine further. You lose what it was trying to teach.',
        teach: 'Blind disbelief can be as unhelpful as blind belief. Discernment requires real observation and an open mind.'
      },
      {
        k: 'D', text: 'Ask him to settle the presence.',
        d: { sanity: 19, awareness: 27, wisdom: 30 },
        verdict: 'best',
        say: 'You accept that you do not understand everything yet, and commit to learning without recklessness. The note is returned to the fire. The case becomes your first lesson.',
        teach: 'Wisdom grows when experience is combined with humility, observation and proper guidance.'
      }
    ],
    core: 'Do not dismiss. Do not provoke. Observe, and seek knowledge before acting.<br><i>The first case is closed. The lesson is yours to keep.</i>',

    /* --- the stage ------------------------------------------------------
       The same room as chapter 4: x -3.2..3.2, z -2.6 (the window wall)
       to +2.8 (the corridor wall), ceiling 2.6 — in MORNING sun. */
    spawn:     { x: -1.8, y: 1.62, z: 2.0 },     // in from the front door
    /* `shrine` is the engine's interactable anchor. Here it is THE
       TANG-KI's stand, at the HEAD of the dining table: the chapter's one
       act is to go to him and ask. (0.9,-0.4) was inside the table's own
       footprint — the 1.5 x 0.9 top is centred at (1.3,-0.6) — so he
       stood in the furniture and his robe hid the note from every scene
       camera. The head of the table is his, and it is clear floor.      */
    shrine:    { x: 0.35, z: -0.55 },
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
       tangki is the tang-ki (+ his clips), mother is Ma, hellnote is the note art
       the engine hands back through setNoteTexture: the found note on the
       table carries the photograph, not the drawn card.                 */
    assets: ['hdb', 'seat', 'tangki', 'tangkianim', 'mother', 'motheranim', 'hellnote', 'altar', 'sofa'],
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
            makeHellNote, getState, startDecision, worldSfx, HEAD_RE } = ctx;

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
    /* deeper than ch4's sheet: in full morning hemi a pale flat plane reads
       as a glowing white board, not a curtain */
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


    /* v5.30 — GRASS under the block (Chad: "add some grass to the ground for
       the HDB flat outside the window"). Until now nothing stood under the
       block at all: it rose out of the fog gradient with no ground, which
       reads as floating the moment the eye drops below the sill. A field
       from just past the outer wall to well beyond the block, drawn in
       code — thousands of short strokes in three greens over a base — so
       it costs no download and passes the strict CSP (a canvas, never a
       blob or a data URL). Its top sits a hair under the block's own
       ground slab so the two never fight for the same pixels.           */
    {
      const cv = document.createElement('canvas');
      cv.width = cv.height = 256;
      const g2 = cv.getContext('2d');
      g2.fillStyle = '#3d6a2c';
      g2.fillRect(0, 0, 256, 256);
      let gs = 0x7F4A7C15 >>> 0;
      const gr = () => { gs = (Math.imul(gs, 1664525) + 1013904223) >>> 0; return gs / 4294967296; };
      const greens = ['#527d33', '#2e5122', '#6a8e3a', '#446d2a'];
      for (let i = 0; i < 4200; i++) {
        const x = gr() * 256, y = gr() * 256, a = (gr() - 0.5) * 1.2, len = 2 + gr() * 5;
        g2.strokeStyle = greens[(gr() * greens.length) | 0];
        g2.lineWidth = 0.6 + gr() * 0.9;
        g2.beginPath(); g2.moveTo(x, y); g2.lineTo(x + Math.sin(a) * len, y - Math.cos(a) * len); g2.stroke();
      }
      const grassTex = new THREE.CanvasTexture(cv);
      grassTex.wrapS = grassTex.wrapT = THREE.RepeatWrapping;
      grassTex.repeat.set(34, 30);
      grassTex.colorSpace = THREE.SRGBColorSpace;
      grassTex.anisotropy = 4;
      const grass = new THREE.Mesh(new THREE.PlaneGeometry(140, 120),
        new THREE.MeshStandardMaterial({ map: grassTex, roughness: 1, metalness: 0 }));
      grass.rotation.x = -Math.PI / 2;
      grass.position.set(-3.5, -4.125, -66);    // the block's base is at -4.118
      grass.receiveShadow = false;
      world.add(grass);
    }

    /* v5.30 — THE LIT WINDOWS ARE NOT ADDED TO THE WORLD ANY MORE. Chad:
       "the HDB flat outside the window has some glitchy white boxes". They
       were these: flat pale planes at one depth (z -20.4) in front of a
       block whose facade is not at that depth, so some hung in the air
       ahead of the wall and some poked through it, none on its window
       grid — and the block's own texture already carries lit windows, so
       they were never needed. The meshes, the material and the handles
       stay (the snapshot, the restore and the film's raise of `lateMat`
       all still touch them, harmlessly); they simply never enter the scene.
       Rendered and checked from the sill, the table and the film's window
       shot before this was written. */
    const litMat = new THREE.MeshBasicMaterial({ color: 0xffd9a0, fog: false });
    const litGeo = new THREE.PlaneGeometry(0.9, 0.7);
    const litWins = [];
    for (const [lx, ly] of [[-5.2, 3.4], [-1.6, 6.1], [2.4, 2.2], [-7.8, 9.0],
                            [1.1, 11.6], [4.3, 7.4], [-3.3, 13.2]]) {
      const w2 = new THREE.Mesh(litGeo, litMat);
      w2.position.set(lx - 2.0, ly - 2.0, -20.4);
      litWins.push(w2);                        // v5.30: never added to the world (above)
    }
    /* a few more that come on DURING the opening film — evening is other
       people getting home too. Off (invisible) until the film raises them. */
    const lateMat = new THREE.MeshBasicMaterial({
      color: 0xffd9a0, fog: false, transparent: true, opacity: 0 });
    const lateWins = [];
    for (const [lx, ly] of [[-6.4, 5.2], [0.2, 8.8], [3.2, 4.6]]) {
      const w2 = new THREE.Mesh(litGeo, lateMat);
      w2.position.set(lx - 2.0, ly - 2.0, -20.4);
      lateWins.push(w2);                       // v5.30: never added to the world (above)
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
    /* 0.9, not ch4's 2.2: at ten in the morning the altar lamp is an ember
       in a bright room, not the room's light source — 2.2 washed the whole
       ceiling corner sunset-orange. Scene D still takes it to 4.5.       */
    const altLight = new THREE.PointLight(0xff5a30, 0.9, 3.4, 1.7);
    altLight.position.set(-2.85, 1.85, -2.15);
    scene.add(altLight); owned.push(altLight);

    // the evening through the window: a broad cool fill that owns the glass
    const duskFill = new THREE.DirectionalLight(0xcfe0ee, 0.15);
    duskFill.position.set(-2, 4, -10);
    scene.add(duskFill); owned.push(duskFill);

    // the corridor outside the front door, for the film: dusk on concrete
    /* lit from build: the film opens this door on a MORNING corridor, and in
       play the door is shut, so a lit corridor costs nothing              */
    const outLight = new THREE.PointLight(0xdfe9f2, 0.85, 6.5, 1.6);
    outLight.position.set(DOORM.x + 0.8, 2.1, R.zNear + 1.0);
    scene.add(outLight); owned.push(outLight);

    /* the internal corridor gets its share of the morning: without this it
       reads as a black mouth in a bright flat, and scene A's line about
       "the sun in it" plays over darkness */
    const corrLight = new THREE.PointLight(0xfff1dc, 1.4, 5.0, 1.5);
    corrLight.position.set(2.05, 1.9, R.zNear + 1.1);
    scene.add(corrLight); owned.push(corrLight);

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
    /* ------------------------------------------------ the morning's cast --
       THE TANG-KI (Chad's rigged Taoist master — ch3's load recipe
       verbatim: size and ground from POSED BONES, never a box; his clips
       come in a second file and the grounding is taken again) stands
       mid-room at the interact anchor; his clip runs at half rate — a
       quiet standing sway, a man listening to a house. MA (ch2's mother
       recipe verbatim: the idle cut past its 1.6 s lead-in) waits by the
       kitchen doorway. Both are the film's actors; scenes glide the
       groups. Invisible proxies stand in while the GLBs fly and give the
       interact raycast something to hit.                                */
    /* v5.07: floor to HEAD JOINT (his topmost bone); 1.68 there made a
       2.09 m man once the topknot was counted — measured, with Ma's mesh
       top at 1.585 beside him. 1.50 lands his skull at ~1.63 and the
       hairpin at ~1.88. The same number as ch3's PRAY_H, on purpose. */
    const TANG_H = 1.50;
    const tangki = new THREE.Group();
    tangki.position.set(SHRINE.x, 0, SHRINE.z);
    /* the models are +z-forward: visual front = (sin ry, cos ry). -0.85
       faces him at the spawn/door corner — he greets the player's approach.
       (`faceFrom` is CAMERA-convention (-z forward); a model facing set
       from it needs + Math.PI. Every scene below does this.)            */
    tangki.rotation.y = -0.85;
    world.add(tangki);
    const tangProxy = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.30, 1.66, 10),
      new THREE.MeshStandardMaterial({ color: 0x6a5c4a, roughness: 0.9 }));
    tangProxy.position.y = 0.83;
    tangProxy.castShadow = true;
    tangki.add(tangProxy);
    let tangMixer = null, tangHead = null;
    let tangBow = 0;                             // scenes add this to the head, post-mixer
    let tangActs = null, tangCur = '';
    let tangHand = null;                         // v5.07: his right hand bone, for the note
    /* the model carries its own props — a signboard and paper talismans on
       a second material — skinned to the same hands. The insert holds the
       NOTE up in that hand, so the props step out of it for the shot. */
    const tangProps = [];
    const setTangProps = (v) => { for (const m of tangProps) m.visible = v; };
    /* `fade` 0 is a HARD CUT that bakes the pose at once (the ch3 precedent);
       `once` plays a take through and holds its last frame — the torch grab
       ends on the hand raised, and that is the pose the burning holds. */
    const tangPlay = (name, ts = 1, fade = 0.34, once = false, at) => {
      if (!tangMixer || !tangActs || !tangActs[name]) return;
      if (tangCur === name && at === undefined) return;
      const nx = tangActs[name], old = tangCur && tangCur !== name && tangActs[tangCur];
      nx.reset(); nx.setEffectiveTimeScale(ts); nx.setEffectiveWeight(1);
      nx.setLoop(once ? THREE.LoopOnce : THREE.LoopRepeat, Infinity);
      nx.clampWhenFinished = once;
      if (at !== undefined) {
        /* a FROZEN FRAME: the take parked at a fraction of its length and
           held there — the insert holds the note up on one frame of the
           magic take, where the hand is exactly where the shot wants it */
        nx.play(); nx.time = nx.getClip().duration * at; nx.paused = true;
        for (const a of Object.values(tangActs)) if (a !== nx) a.stop();
        tangMixer.update(0);
      } else if (fade > 0) {
        nx.paused = false;
        nx.fadeIn(fade).play();
        if (old) old.fadeOut(fade);
      } else {
        nx.paused = false;
        nx.play();
        /* a HARD cut stops every other take, not only the current one: a
           crossfade still running from two steps ago would otherwise keep
           its weight through the cut, and a pose read on the same frame
           (the insert aims the note from the hand) would be a blend */
        for (const a of Object.values(tangActs)) if (a !== nx) a.stop();
        tangMixer.update(0.0001);
      }
      tangCur = name;
    };
    assetBytes('tangki').then(BUF => new GLTFLoader().parse(BUF, '', (gltf) => {
      if (!alive) return;
      rescueTextures(gltf, BUF);
      const g = gltf.scene;
      g.traverse(o => {
        if (!o.isMesh) return;
        o.castShadow = !LOW; o.frustumCulled = false;
        /* the prop material is the file's second one ('df397071'); the
           mesh name is the fallback if a re-export renames it */
        const mat = Array.isArray(o.material) ? o.material[0] : o.material;
        if ((mat && mat.name === 'df397071') || /1bbfac30/.test(o.name)) tangProps.push(o);
      });
      g.updateMatrixWorld(true);
      const v = new THREE.Vector3();
      let lo = Infinity, hi = -Infinity;
      g.traverse(o => {
        if (!o.isBone) return;
        o.getWorldPosition(v);
        lo = Math.min(lo, v.y); hi = Math.max(hi, v.y);
        if (HEAD_RE.test(o.name) && !tangHead) tangHead = o;
        if (/RightHand$/.test(o.name) && !tangHand) tangHand = o;
      });
      if (isFinite(lo) && hi > lo) {
        const s = TANG_H / (hi - lo);
        g.scale.setScalar(s);
        g.position.y = -lo * s;
      }
      tangProxy.visible = false;
      tangki.add(g);
      redoShadows();

      /* His clips arrive in a SEPARATE file — the model ships none, so
         without them he stands in his bind pose with his arms out. Same
         two-file dance as the mother, re-grounding included: the law is to
         ground from the POSED bones, and the pose changes when they land. */
      assetBytes('tangkianim').then(AB => new GLTFLoader().parse(AB, '', (an) => {
        if (!alive || !an.animations.length) return;
        tangMixer = new THREE.AnimationMixer(g);
        const acts = {};
        for (const clip of an.animations) acts[clip.name] = tangMixer.clipAction(clip);
        if (!acts.idle) return;
        tangActs = acts;
        tangPlay('idle');
        tangMixer.update(0.001);
        g.updateMatrixWorld(true);
        const v2 = new THREE.Vector3();
        let lo2 = Infinity;
        g.traverse(o => {
          if (!o.isBone) return;
          o.getWorldPosition(v2);
          lo2 = Math.min(lo2, v2.y);
        });
        if (isFinite(lo2)) g.position.y -= lo2;
      }, () => {})).catch(() => {});
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
    /* her four retargeted clips (see ch2 for the bake). Same tiny interface:
       a scene names a clip, a negative rate runs it backwards. */
    let maActs = null, maCur = null, maIdleBuiltin = null, maHead = null;
    function maPlay(name, ts = 1) {
      const nx = maActs && maActs[name];
      if (!nx || (nx === maCur && nx.timeScale === ts)) return;
      nx.reset();
      nx.timeScale = ts;
      if (ts < 0) nx.time = nx.getClip().duration;
      nx.play();
      if (maCur && maCur !== nx) maCur.crossFadeTo(nx, 0.28, false);
      else nx.setEffectiveWeight(1);
      maCur = nx;
    }
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
        maIdleBuiltin = maMixer.clipAction(clip);
        maIdleBuiltin.play();
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

      /* v5.02: her four retargeted clips, same as ch2 — and the same
         RE-GROUNDING with them, because the model's built-in idle rides
         ~0.8 m above bind and the offset just measured is tuned to it.
         Skip that and she is buried to the neck (ch2 measured -0.79 m). */
      assetBytes('motheranim').then(AB => new GLTFLoader().parse(AB, '', (an) => {
        if (!alive || !maMixer) return;
        const acts = {};
        for (const clip of an.animations) acts[clip.name] = maMixer.clipAction(clip);
        if (!acts.idle) return;
        maActs = acts;
        if (maIdleBuiltin) maIdleBuiltin.stop();
        maPlay('idle');
        maMixer.update(0.001);
        g.updateMatrixWorld(true);
        const v2 = new THREE.Vector3();
        let toe2 = Infinity;
        g.traverse(o => {
          if (!o.isBone) return;
          o.getWorldPosition(v2);
          if (/Toe|Foot/.test(o.name)) toe2 = Math.min(toe2, v2.y);
        });
        if (isFinite(toe2)) g.position.y -= toe2;
        g.traverse(o => { if (o.isBone && HEAD_RE.test(o.name) && !maHead) maHead = o; });
      }, () => {})).catch(() => {});
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
      /* -0.28, not 0.18: the note sits at the tang-ki's END of the table.
         He stands at the head of it, and at the old spot he had to WALK to
         the note — a walk with no clean lane, because the dining set is
         ringed by its own four chairs and every route clipped one. Moving
         the paper 46 cm is the fix that removes the problem instead of
         steering around it: he reaches it from where he already stands. */
      /* local (-0.32, +0.33) = world (0.98, -0.27): his end of the table AND
         its room-facing edge. Both matter. West so he reaches it from the
         head of the table without a walk the chairs leave no lane for;
         room-side so the player can SEE it — parked deeper in it sat behind
         the teapot from every angle anyone approaches from. Clear of the
         pot (0.23) and both cups (0.29). */
      /* +0.026, not +0.004. TABLE.top is the slab's CENTRE and the slab is
         45 mm thick, so its surface is at TABLE.top + 0.0225 — the note has
         been sitting 19 mm INSIDE the wood since this chapter shipped, which
         is why "the note lies on the table between you" was a line about an
         object nobody could see. The cups (+0.048) and the pot (+0.085)
         cleared it by luck of being taller things. */
      pos: new THREE.Vector3(-0.32, TABLE.top + 0.026, 0.33),
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

    const _m4 = new THREE.Matrix4();
    /* the cast breathes: his clip at half rate (a man standing quietly,
       listening to a house), hers at a domestic idle. tangBow is a scene's
       own addition, laid on the head bone AFTER the mixer each frame so it
       survives the clip — the ch3/v4.8 re-lay law.                      */
    /* THE LOOK (v5.03). A person whose head never moves is the deadest
       thing in a room, and both of these stand still for minutes at a time.
       In PLAY the camera IS the boy, so they track it: yaw and pitch on the
       head, clamped to what a neck actually does, eased so it follows
       instead of snapping, and laid on AFTER the mixer like every other
       additive here. Past the clamp plus a margin — the player behind her —
       it returns to neutral rather than craning, because a head screwed
       round backwards is worse than a still one.
       CUTSCENES DEFAULT TO OFF and opt in per scene: a film cuts to cameras
       that are not a person, and this chapter's own hard cut goes UNDER the
       dining table. A head that snapped to look at that would be a horror
       of a different kind.                                              */
    const _lookP = new THREE.Vector3(), _lookH = new THREE.Vector3();
    let lookOverride = null;            // a scene may force it on (1) or off (0)
    const lookWeight = () =>
      lookOverride !== null ? lookOverride : (getState() === 'play' ? 1 : 0);
    function headLook(head, group, st, dt, w) {
      if (!head) return;
      camera.getWorldPosition(_lookP);
      head.getWorldPosition(_lookH);
      const dx = _lookP.x - _lookH.x, dz = _lookP.z - _lookH.z;
      const flat = Math.hypot(dx, dz);
      let dy = Math.atan2(dx, dz) - group.rotation.y;
      dy = Math.atan2(Math.sin(dy), Math.cos(dy));        // wrap to +-PI
      /* AIM FROM THE EYES, AND SET PITCH ABSOLUTELY. Two errors compounded
         here and the result was a chin pointed at the player. The Mixamo
         head BONE sits at the base of the skull, ~11 cm under the eyes, so
         aiming it at a 1.62 m camera asks for far more lift than a look
         needs. And the clips carry their own head pitch — measured at
         -0.16 rad of chin-up — which an ADDITIVE offset piles onto instead
         of replacing: the total came to -0.247.
         So the origin rises to eye level, and pitch is driven to an
         ABSOLUTE target (yaw stays additive — the clips barely turn the
         head, 0.07 at rest). The small downward bias is deliberate: a face
         angled a few degrees down reads as attention, a face angled up
         reads as disdain, and she is shorter than him either way. */
      const YAW = 0.75, PIT = 0.34, EYE_UP = 0.11, DOWN_BIAS = 0.14;
      const wy = Math.abs(dy) > YAW + 0.9 ? 0 : Math.max(-YAW, Math.min(YAW, dy));
      const wx = flat < 0.05 ? 0 : Math.max(-PIT, Math.min(PIT,
        Math.atan2(_lookP.y - (_lookH.y + EYE_UP), flat) - DOWN_BIAS));
      const k = Math.min(1, dt * 3.5);
      st.y += (wy * w - st.y) * k;
      st.x += (wx * w - st.x) * k;
      head.rotation.y += st.y;
      head.rotation.x += (-st.x - head.rotation.x) * 0.88 * w;
    }
    const tangLook = { x: 0, y: 0 }, maLook = { x: 0, y: 0 };

    function castUpdate(dt) {
      const w = lookWeight();
      if (tangMixer) {
        /* full rate since v5.06. The half rate was tuned for the praying
           man's slow, wide prayer loop; a Mixamo standing idle is already
           small (measured: 1.8 mm of hand travel over two seconds at 0.5x),
           and halving it again left him reading as a photograph. */
        tangMixer.update(dt);
        if (tangHead && tangBow) tangHead.rotation.x += tangBow;
        headLook(tangHead, tangki, tangLook, dt, w);
      }
      if (maMixer) {
        maMixer.update(dt * 0.9);
        headLook(maHead, ma, maLook, dt, w);
      }
    }

    function updateNotes(dt, t) {
      castUpdate(dt);
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
        altLight.intensity = 0.9 * fl;
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
      fanSpeed = s.fanSpeed; noteStorm = s.storm;
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
      maPlay('idle');
      tangPlay('idle', 1, 0);                    // v5.07: a skipped scene leaves no walk running
      setTangProps(true);
      lookOverride = null;
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
      tangki.position.set(SHRINE.x, 0, SHRINE.z);
      tangki.rotation.y = -0.85;
      tangPlay('idle', 1, 0);
      setTangProps(true);
      ma.position.set(-2.45, 0, -0.85);
      ma.rotation.y = 1.2;
      maPlay('idle');
      lookOverride = null;
      tangLook.x = tangLook.y = maLook.x = maLook.y = 0;
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
      box(tangProxy); box(maProxy);              // two people are solid
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
      tangki, tangProxy, ma, note, NOTE_HOME, cup3, maPlay,
      get maClip() { return maCur ? maCur.getClip().name : null; },
      tangPlay,                                  // v5.07: his takes, by name
      get tangClip() { return tangCur || null; },
      get tangActs() { return tangActs; },       // read-only: probes seek a take by .time
      get tangHand() { return tangHand; },       // the bone the note rides in
      setTangProps,                              // his signboard and talismans, on or off
      set castLook(v) { lookOverride = v; },
      get castLook() { return lookOverride; },
      get tangBow() { return tangBow; },
      set tangBow(v) { tangBow = v; },
      CHAIR, TABLE, R, WIN, KDOOR, CORR,
      get fanSpeed() { return fanSpeed; },
      set fanSpeed(v) { fanSpeed = v; },
      get noteStorm() { return noteStorm; },
      set noteStorm(v) { noteStorm = v; },
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
  /* v5.07: A REAL TURN. Chad's catwalk take (Walk Start Turn 180 Right)
     rotates his HIPS a half turn to the right over TURN_DUR seconds while
     the group holds still — so the group's yaw is walked from ry0 to
     (ry1 + PI) across the take, and when it ends the take is cut for `then`
     (whose hips carry no yaw) with the group snapped to ry1. The visible
     facing is continuous through the cut: (ry1+PI) + (-PI) before it, ry1 + 0
     after. The group's share is wrapped to the short way round, so a turn
     that is not exactly a half turn absorbs the difference as a slow drift
     under the take rather than a second spin. `ts` speeds the take up for
     turns that happen at the start of a walk (the glides are eased, so the
     first second of one barely moves him).

     A TRACK HOLDS: the cutscene engine re-applies every `tr` at k = 1 on
     every frame after its end (there is no cut-off past t1, and later
     tracks win), so a track that writes rotation.y would pin the yaw
     forever and every later `step` on it would lose. `yawTr` below is the
     one-shot form: it writes until it has delivered k = 1 once, then goes
     inert and leaves the property to whoever writes it next. Found by
     measurement — he walked to the altar facing backwards. */
  const TURN_DUR = 2.92;                          // measured on the baked clip
  const wrapA = a => { while (a > Math.PI) a -= 2 * Math.PI; while (a < -Math.PI) a += 2 * Math.PI; return a; };
  const yawTr = (tr, ease, t0, t1, fn) => {
    let done = false;
    tr(t0, t1, k => { if (done) return; fn(k); if (k >= 0.999) done = true; }, ease);
  };
  function mkTurn(api) {
    const { tr, step, stage, smoothK } = api;
    return (t0, ry0, ry1, ts = 1, then = 'walk', thenTs = 1) => {
      const dur = TURN_DUR / ts;
      const share = wrapA(ry1 + Math.PI - ry0);
      step(t0, () => { stage.tangki.rotation.y = ry0; stage.tangPlay('turn', ts, 0.12, true); });
      yawTr(tr, smoothK, t0, t0 + dur, k => { stage.tangki.rotation.y = ry0 + share * k; });
      /* v5.30: a HARD cut into `then`, not a 0.15 s crossfade. The group
         snaps by -PI on this frame; the take's hips carry -PI and the next
         take's carry 0, so the two cancel only if the hips change on the
         SAME frame. A crossfade let the group snap first and the hips
         blend after, and for 0.15 s he faced the wrong way and whipped
         round — Chad: "a double spin after he turns around". The law was
         already in LEARNINGS (v5.07: a fade of 0 is a hard cut that bakes
         the pose); this is the one place that had not been held to it. */
      step(t0 + dur, () => { stage.tangki.rotation.y = ry1; stage.tangPlay(then, thenTs, 0); });
    };
  }

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
    /* THE REVEAL geometry — v5.25, Chad's call: "i want the tangki to walk
       to the table and the next shot immediately zooms in on the table
       surface with the hellnote placed on it, instead of showing the
       tangki trying to hold it up in his hand."

       So the note is not held up any more. He takes it from under the
       seat, carries it the short step to the table, SETS IT DOWN, and the
       film cuts to the wood.

       Where it lands is not a new number: it is NOTE_HOME, the spot the
       chapter's play state already puts the note in — his end of the
       table, on the room-facing edge, clear of the pot and both cups. So
       the film now ends with the note exactly where the chapter begins
       with it, instead of somewhere the engine has to move it from.

       Where he STANDS to reach it is measured against the furniture the
       v5.03 audit boxed: (0.72, 0.28) is 0.37 m off the table's near edge,
       0.11 m clear of the thinking chair's box, and 0.61 m from the note —
       a reach with a lean, not a walk through the dining set.           */
    const PLACE = { x: 0.72, z: 0.28 };            // where he sets it down from
    /* 1.6 m back, not 0.9: at 0.9 his robe was most of the frame and the
       table he is walking to was not in it. */
    const MIDCAM = { x: -0.25, y: 1.50, z: 1.55 };  // the room-side view of that
    const Y_MID = faceFrom(MIDCAM.x, MIDCAM.z, PLACE.x, PLACE.z);
    /* the insert: over the table's far side looking back across the note,
       so the wood fills the frame and his robe stands beyond it. 0.54 m
       from a 15 cm note is a third of frame. */
    const TBL_NOTE = { x: stage.TABLE.x - 0.32,
                       y: stage.TABLE.top + 0.026,
                       z: stage.TABLE.z + 0.33 };  // = NOTE_HOME, in the world
    const TBL_CAM = { x: 1.28, y: 1.00, z: -0.66 };
    const Y_TBL = faceFrom(TBL_CAM.x, TBL_CAM.z, TBL_NOTE.x, TBL_NOTE.z);
    const turnTo = mkTurn(api);
    /* seat the note in the palm: along the finger axis of the hand bone
       (measured as (-0.69, 0.72, 0) in bone space), a centimetre off the
       palm, its face turned out; scaled back to world size because the
       bone carries the model's ~95x scale */
    const noteToHand = () => {
      const h = stage.tangHand;
      if (!h) return false;
      const ws = h.getWorldScale(new stage.note.position.constructor());
      stage.note.parent?.remove(stage.note);
      h.add(stage.note);
      stage.note.visible = true;
      stage.note.scale.setScalar(1 / ws.x);
      stage.note.position.set(-0.69 * 0.11 / ws.x, 0.72 * 0.11 / ws.x, 0.05 / ws.x);
      stage.note.rotation.set(0, 0, 0.76);
      return true;
    };
    /* v5.25: the solver that aimed the note at the lens INSIDE his hand is
       gone with the shot it existed for. `noteToHand` stays — he still
       carries the note from the chair to the table — but nothing has to
       make a plane in a bone's frame face a camera any more, because the
       camera now looks at a table.                                      */
    /* the note comes back off the hand at full size: noteToHand divides it
       down by the bone's ~95x world scale to survive being parented there */
    const noteToTable = () => {
      stage.note.parent?.remove(stage.note);
      stage.NOTE_HOME.parent.add(stage.note);
      stage.note.scale.setScalar(1);
      stage.note.position.copy(stage.NOTE_HOME.pos);
      stage.note.rotation.copy(stage.NOTE_HOME.rot);
      stage.note.visible = true;
    };

    step(0, () => {
      handsRoot.visible = false;
      ghostOpacity(0);
      stage.doorMain.rotation.y = 0;
      duck('v5room', 0.5); duck('clock', 0.4);
      /* the note starts where four chapters left it: under the chair seat */
      stage.tangki.position.set(stage.DOORM.x, 0, stage.R.zNear + 0.85);
      stage.tangki.rotation.y = Math.PI;         // facing the door from outside
      /* she answered during the black and stands ASIDE, clear of the leaf's
         swing and of his entry line - (-1.7,2.1) was exactly where his
         threshold stop lands, and the two meshes stood inside each other */
      stage.ma.position.set(-1.45, 0, 1.55);
      stage.ma.rotation.y = faceFrom(-1.45, 1.55, DOORAT.x, DOORAT.z) + Math.PI;
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
    step(10.5, () => { stage.tangPlay('walk', 0.45); });    // v5.07: on real feet
    step(13.5, () => { stage.tangPlay('idle'); });
    tr(10.5, 13.5, k => {
      stage.tangki.position.set(
        stage.DOORM.x + 0.35 * k, 0, stage.R.zNear + 0.85 - 1.55 * k);
    }, smoothK);
    // a slow look into the flat's heart: the table, the room he was called for
    step(13.5, () => { stage.tangki.rotation.y = faceFrom(-1.85, 1.9, 0.9, 0.0) + Math.PI; });
    // the door swings shut behind him while every eye is on his stillness
    sfx(13.9, 'doorcreak', 0.4);
    tr(13.8, 15.2, k => { stage.doorMain.rotation.y = stage.DOORM_OPEN * (1 - k); }, smoothK);

    // 16-22 he crosses to the KITCHEN DOORWAY and BOWS to the empty dark
    yawTo(16.0, 19.0, Y_DOOR2, Y_KD, smoothK);
    step(16.0, () => {
      stage.tangki.rotation.y = faceFrom(-1.85, 1.9, -2.15, -0.8) + Math.PI;
      stage.tangPlay('walk', 0.65);              // 2.7 m in 3.6 s
    });
    step(19.6, () => { stage.tangPlay('idle'); });
    tr(16.0, 19.6, k => {
      stage.tangki.position.set(
        stage.DOORM.x + 0.35 + (-2.15 - (stage.DOORM.x + 0.35)) * k, 0,
        stage.R.zNear - 0.7 + (stage.KDOOR.z + 0.6 - (stage.R.zNear - 0.7)) * k);
    }, smoothK);
    step(19.6, () => { stage.tangki.rotation.y = faceFrom(-2.15, stage.KDOOR.z + 0.6, KD.x, KD.z) + Math.PI; });
    tr(20.0, 22.2, k => { stage.tangBow = 0.5 * Math.sin(Math.PI * k); }, rawK);
    sfx(18.5, 'v5wake2');                         // 2.19 s: "Why is he bowing..."

    // 22.5-27 he turns to the dining table; the camera pans with him, then
    // HARD CUTS low, under it. Only now, with his path clear, does Ma
    // withdraw to her place by the kitchen - off-frame, behind the pan.
    /* the one true turnaround of the film: from the kitchen dark, 177
       degrees round to the chair — the catwalk take, quickened, under the
       eased start of the walk */
    turnTo(22.5, faceFrom(-2.15, stage.KDOOR.z + 0.6, KD.x, KD.z) + Math.PI,
           faceFrom(-2.15, -0.8, CHX - 0.55, CHZ + 0.4) + Math.PI, 1.6, 'walk', 0.85);
    step(25.8, () => { stage.tangPlay('idle'); });
    tr(22.5, 25.8, k => {
      stage.tangki.position.set(
        -2.15 + (CHX - 0.55 - -2.15) * k, 0,
        stage.KDOOR.z + 0.6 + (CHZ + 0.4 - (stage.KDOOR.z + 0.6)) * k);
    }, smoothK);
    yawTo(22.3, 24.2, Y_KD, faceFrom(MIDPUSH.x, MIDPUSH.z, CHX - 0.55, CHZ + 0.4), smoothK);
    step(23.0, () => {
      /* she turns the way she is about to travel, and WALKS it: 2.6 m over
         4 s is 0.65 m/s, a shade brisker than the take's own 0.48, which
         at this distance and behind the pan reads as unhurried. */
      stage.ma.rotation.y = faceFrom(-1.45, 1.55, -2.45, -0.85) + Math.PI;
      stage.maPlay('walkstart');
    });
    tr(23.0, 27.0, k => {
      stage.ma.position.set(-1.45 + (-2.45 - -1.45) * k, 0, 1.55 + (-0.85 - 1.55) * k);
    }, smoothK);
    step(26.0, () => { stage.maPlay('walkstop'); });   // she arrives, she stops
    step(27.4, () => { stage.ma.rotation.y = 1.2; stage.maPlay('idle'); });
    step(25.8, () => { stage.tangki.rotation.y = faceFrom(CHX - 0.55, CHZ + 0.4, CHX, CHZ) + Math.PI; });
    camTo(24.2, 24.2, LOWCAM, LOWCAM);            // a hard cut down
    yawTo(24.2, 24.2, Y_LOW, Y_LOW);
    pitchTo(24.2, 26.0, 0.14, 0.10, smoothK);     // up, at the seat's underside

    // 26.5-28.5 the hand goes under the seat: the pull
    sfx(26.5, 'notepull', 0.9);
    step(27.3, () => {
      stage.chairs[0].remove?.(stage.note);
      stage.setTangProps(false);                  // the signboard leaves the hand the note takes
      if (!noteToHand()) {                        // no bone yet: the old fixed spot
        stage.tangki.add(stage.note);
        stage.note.position.set(0.2, 1.05, 0.2);
        stage.note.rotation.set(0.3, 0.4, 0.2);
      }
    });

    /* 28.4-30.2 HE STANDS AND TAKES IT TO THE TABLE. The camera comes up
       off the floor with him — the low shot was for the hand under the
       seat, and holding it while he walks away would be a shot of his
       ankles. He crosses the 0.37 m to the table's edge on real feet.  */
    camTo(28.4, 30.2, LOWCAM, MIDCAM, smoothK);
    yawTo(28.4, 30.2, Y_LOW, Y_MID, smoothK);
    pitchTo(28.4, 30.2, 0.10, -0.274, smoothK);
    step(28.4, () => { stage.tangPlay('walk', 0.5); });
    tr(28.4, 29.9, k => {
      stage.tangki.position.set(CHX - 0.55 + (PLACE.x - (CHX - 0.55)) * k, 0,
                                CHZ + 0.4 + (PLACE.z - (CHZ + 0.4)) * k);
    }, smoothK);
    tr(28.4, 29.9, k => {
      const a = faceFrom(CHX - 0.55, CHZ + 0.4, CHX, CHZ) + Math.PI;
      const b = faceFrom(PLACE.x, PLACE.z, TBL_NOTE.x, TBL_NOTE.z) + Math.PI;
      let d = b - a; d = Math.atan2(Math.sin(d), Math.cos(d));   // the short way
      stage.tangki.rotation.y = a + d * k;
    }, smoothK);
    step(29.9, () => { stage.tangPlay('idle'); });
    // he leans over the table to set it down, and straightens after
    tr(29.9, 30.3, k => { stage.tangBow = 0.22 * k; }, smoothK);
    tr(30.5, 31.4, k => { stage.tangBow = 0.22 * (1 - k); }, smoothK);

    /* 30.2 THE PLACEMENT — the note leaves his hand for the wood, at
       NOTE_HOME, and the sound is the reveal (Chad: "a sound effect to
       show that the hellnote was placed on the table"). */
    step(30.2, () => { noteToTable(); });
    sfx(30.2, 'noteset', 0.95);

    /* 30.4-41.5 THE INSERT: the TABLE SURFACE, the note lying on it in the
       morning light — the real photographed art, a third of the frame, and
       his robe beyond the near edge. A hard cut, then the slowest push in
       the film. His first words in five chapters of game land here, and
       then the boy names what he is looking at.                        */
    camTo(30.4, 30.4, TBL_CAM, TBL_CAM);          // the hard cut across
    yawTo(30.4, 30.4, Y_TBL, Y_TBL);
    pitchTo(30.4, 30.4, -0.427, -0.427);
    camTo(30.4, 41.5, TBL_CAM,
      { x: TBL_CAM.x - 0.05, y: TBL_CAM.y - 0.04, z: TBL_CAM.z + 0.08 }, smoothK);
    yawTo(30.4, 41.5, Y_TBL, Y_TBL);
    pitchTo(30.4, 41.5, -0.427, -0.427);
    // the black takes him back to his idle; restore() re-homes the note
    step(41.8, () => { stage.tangPlay('idle', 1, 0); stage.setTangProps(true); });
    sfx(31.2, 't5note');                          // 3.55 s: "Here. Under where you sit."
    sfx(35.4, 'v5wake3');                         // 5.15 s: "That's the hell note..."

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
    const HALLIN = { x: 2.05, y: EYE, z: 3.4 };   // corridor CENTRE, half a metre in
    const Y_HALL = faceFrom(HALLCAM.x, HALLCAM.z, 2.05, stage.R.zNear + 2.2);

    step(0, () => { ghostOpacity(0); handsRoot.visible = false; });
    sitDown(api, s);
    // he turns to the boy who just sat down at his table
    step(2.6, () => {
      handsRoot.visible = true;                       // his hands on the table
      stage.tangki.rotation.y = faceFrom(
        stage.tangki.position.x, stage.tangki.position.z,
        ATTABLE.x, ATTABLE.z) + Math.PI;
    });
    yawTo(2.8, 4.0, 0, Y_TANG, smoothK);
    pitchTo(2.8, 4.0, -0.06, -0.03, smoothK);
    sfx(2.2, 'teaset', 0.6);
    tr(3.0, 5.0, k => { duck('v5room', 1 - 0.5 * k); }, rawK);

    /* 5.0-15.1 the teaching (10.11 s since v5.15), the tang-ki stepping a
       half-pace in. v5.30: everything after it moved 4.5 s EARLIER — the
       tail was authored for the 14.76 s take this line used to be, so
       since v5.15 the room sat in silence for five seconds after "that is
       why this morning is quiet" (Chad: "a big gap of silence"). One
       breath of air is what the moment wants, not five. */
    sfx(5.0, 't5teachA');
    camTo(6.0, 15.0, ATTABLE,
      { x: ATTABLE.x - 0.08, y: ATTABLE.y + 0.02, z: ATTABLE.z - 0.10 }, smoothK);

    // 16-21.5 he turns for the corridor; the boy rises and follows
    step(16.0, () => { handsRoot.visible = false; });
    /* two legs, because the straight line from the head of the table to the
       corridor mouth clips the table's corner */
    const Y_L1 = faceFrom(0.35, -0.55, 0.3, 0.6) + Math.PI;
    const Y_L2 = faceFrom(0.3, 0.6, 1.55, 2.35) + Math.PI;
    step(16.5, () => { stage.tangki.rotation.y = Y_L1; stage.tangPlay('walk', 0.45); });
    tr(16.5, 18.7, k => {
      stage.tangki.position.set(0.35 + (0.3 - 0.35) * k, 0, -0.55 + (0.6 - -0.55) * k);
    }, smoothK);
    /* v5.07: the corner is WALKED — 38 degrees of yaw eased over the first
       stride of the second leg, feet still going. The turnaround take is
       for turnarounds; on a corner it would spin him past and back. */
    step(18.7, () => { stage.tangPlay('walk', 0.8); });
    yawTr(tr, smoothK, 18.7, 19.4, k => { stage.tangki.rotation.y = Y_L1 + wrapA(Y_L2 - Y_L1) * k; });
    tr(18.7, 21.0, k => {
      stage.tangki.position.set(0.3 + (1.55 - 0.3) * k, 0, 0.6 + (2.35 - 0.6) * k);
    }, smoothK);
    // beside the corridor mouth, looking down the hall
    step(21.0, () => {
      stage.tangki.rotation.y = faceFrom(1.55, 2.35, 2.05, stage.R.zNear + 2.2) + Math.PI;
      stage.tangPlay('idle');
    });
    camTo(17.0, 22.0, ATTABLE, HALLCAM, smoothK);
    yawTo(17.0, 22.0, Y_TANG, Y_HALL, smoothK);
    pitchTo(17.0, 22.0, -0.03, 0.0, smoothK);

    /* 22-28.7 the hallway, calmly (6.69 s): the same corridor as every
       night, with the sun in it. The camera drifts INTO the mouth.      */
    sfx(22.0, 't5hallA');
    /* enter EARLY - by 30 the camera stands inside the mouth, so most of the
       6.7 s line plays over the down-hall view, not over the approach wall.
       The aim also straightens as it enters: Y_HALL was computed from
       HALLCAM and, held from inside, turned half the frame into the
       corridor's right wall at grazing angle.                            */
    camTo(22.5, 25.5, HALLCAM, HALLIN, smoothK);
    const Y_HALLIN = faceFrom(HALLIN.x, HALLIN.z, 2.05, stage.R.zNear + 2.2);
    yawTo(22.5, 25.5, Y_HALL, Y_HALLIN, smoothK);

    // 30-33.5 back to the room; a soft close
    yawTo(30.0, 32.5, Y_HALLIN, faceFrom(HALLIN.x, HALLIN.z, 1.3, -0.6), smoothK);
    sfx(32.7, 'chime', 0.45);
    sfx(34.1, 'breath', 0.5);
    tr(34.0, 35.8, k => { duck('v5room', 0.5 + 0.5 * k); }, rawK);
    fade(36.0, 39.0, 0, 1);
    step(38.9, () => { handsRoot.visible = true; });

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
    /* from the SOFA side: the old spot (0.55, 0.85) had the tang-ki dead on
       the line to the note, and his robe hid the scene's whole subject */
    const AT_TABLE = { x: 1.85, y: EYE, z: 0.75 };
    const Y_NOTE = faceFrom(AT_TABLE.x, AT_TABLE.z, 0.98, -0.27);

    step(0, () => { ghostOpacity(0); handsRoot.visible = false; });
    // he was already watching before you decided anything
    step(0.4, () => {
      stage.tangki.rotation.y = faceFrom(0.35, -0.55, AT_TABLE.x, AT_TABLE.z) + Math.PI;
    });
    camTo(0, 2.2, { x: s.yawPos.x, y: s.yawPos.y, z: s.yawPos.z }, AT_TABLE, smoothK);
    yawTo(0, 2.2, s.yawRot, Y_NOTE, smoothK);
    pitchTo(0, 2.2, s.pitchX, -0.54, smoothK);

    /* 3-6 the morning drains: the world outside whites into the fog, the
       room's fill dies, the altar ember goes out. Sound first, then light. */
    tr(3.0, 6.0, k => {
      duck('v5room', 1 - 0.95 * k); duck('clock', 1 - k);
      stage.setFogDensity(0.008 + 0.042 * k);
      stage.duskFill.intensity = 0.15 - 0.11 * k;
      stage.altLight.intensity = 0.9 - 0.75 * k;
    }, rawK);
    sfx(5.8, 'heart', 0.5);

    /* 7-15.5 chapter 4's night, replayed by his own head, circling.
       v5.30 (Chad: "make the camera shake more and footsteps louder"):
       the steps come up 3 dB and closer, the chair with them, and the roll
       is two and a half times what it was with a faster tremor riding on
       it — a head that cannot hold still, not a boat. */
    sfx(7.0, 'hallsteps', 1.2);
    sfx(10.0, 'chair', 1.0);
    sfx(12.5, 'hallsteps', 1.1);
    tr(7.0, 15.5, (k, t2) => {
      camera.rotation.z = (Math.sin(t2 * 8.5) * 0.022 + Math.sin(t2 * 23.0) * 0.006) * k;
    }, rawK);
    sfx(15.3, 'boom', 0.6);

    /* 16.5-23.0 his voice cuts through (6.53 s since v5.15). The first
       half lands in the fear; at 19.5 EVERYTHING releases at once and the
       second half lands in a bright, still, unchanged room.             */
    sfx(16.5, 't5fearB');
    step(19.5, () => {
      duck('v5room', 1); duck('clock', 1);
      stage.setFogDensity(0.008);
      stage.duskFill.intensity = 0.15;
      stage.altLight.intensity = 0.9;
      camera.rotation.z = 0;
    });
    pitchTo(19.5, 22.0, -0.54, -0.10, smoothK);

    /* 24.3-29.9 the boy, shaky (5.64 s). v5.30: 27.0 -> 24.3 — the old cue
       waited on a 9.33 s take that has been 6.53 s since v5.15, so four
       seconds of nothing sat between "you did wrong" and his answer
       (Chad: "a gap of silence"). 1.3 s of air is a person taking that in. */
    sfx(24.3, 'v5fearB1');
    tr(30.2, 32.6, () => {}, rawK);
    fade(32.9, 35.9, 0, 1);
    step(35.8, () => { handsRoot.visible = true; });

    c.endFade = 1;
  }

  /* ------------------------------------------------ C · DISMISS EVERYTHING
     A short laugh, a turned back — and the flat declines to be dismissed:
     the room itself dims and the fan stops mid-turn. No ghost, no strings.
     He stops mid-step and does not turn around. (Until v5.24 the curtains
     billowed with no wind as well; Chad took the curtains out of this
     window, so the dim, the stopped fan and his own flinch are the whole
     answer now.)                                                        */
  function scDismiss(c, s, api) {
    const { tr, step, sfx, fade, camTo, yawTo, pitchTo, faceFrom, rawK, smoothK,
            duck, stage, camera, ghostOpacity, handsRoot, yaw, pitch, mixAngle } = api;
    const AT_TABLE = { x: 1.7, y: EYE, z: 0.6 };  // sofa side: the note in the clear
    const Y_NOTE = faceFrom(AT_TABLE.x, AT_TABLE.z, 0.98, -0.27);
    const TO_WIN = faceFrom(0.2, -0.9, stage.WIN.x, -stage.R.z);

    step(0, () => { ghostOpacity(0); handsRoot.visible = false; });
    // he watches the dismissal without a word
    step(0.4, () => {
      stage.tangki.rotation.y = faceFrom(0.35, -0.55, AT_TABLE.x, AT_TABLE.z) + Math.PI;
    });
    camTo(0, 2.0, { x: s.yawPos.x, y: s.yawPos.y, z: s.yawPos.z }, AT_TABLE, smoothK);
    yawTo(0, 2.0, s.yawRot, Y_NOTE, smoothK);
    pitchTo(0, 2.0, s.pitchX, -0.50, smoothK);

    // 2.8-5.3 "Paper. It's just paper." (2.43 s)
    sfx(2.8, 'v5disC1');

    // 6.2-10 he turns his back on it and walks for the window
    yawTo(6.2, 8.2, Y_NOTE, TO_WIN, smoothK);
    pitchTo(6.2, 8.2, -0.50, -0.02, smoothK);
    camTo(6.2, 10.0, AT_TABLE, { x: 0.2, y: EYE, z: -0.9 }, smoothK);

    // 9.4-15.4 the tang-ki, quiet, behind him (5.96 s since v5.15)
    sfx(9.4, 't5disC');

    /* 16.3-22.6 THE ANSWER — v5.30, to Chad's spec: "after the tangki says
       'caught in its fire', i want the single hellnote to fly off from
       the table with wind physics/movement, and cinematically fly out of
       the window by its own as the camera tracks the hellnote, to end
       that scene, instead of a big gap of nothing right now."

       He has his back to the table, facing the window. The note lifts off
       the wood behind him, trembles up to shoulder height, sails past his
       RIGHT shoulder into frame, and goes out through the window into the
       morning while the camera turns to catch it and follows it out. The
       fan still stops mid-turn and the room still dims for the length of
       it (the v5.15 answer) — the flat answers "just paper" by sending the
       paper away. The path is authored in WORLD space and written into the
       note's table-local frame (the table sits unrotated at TABLE.x/z);
       stage.restore() puts the note back at NOTE_HOME, so nothing here has
       to be undone. `noteflight` is a new sound: one sheet lifting,
       flapping and a low gust, 6.5 s, made for this shot.              */
    const NW = { x: stage.TABLE.x, z: stage.TABLE.z };     // world -> table-local
    const CAM_C = { x: 0.2, y: EYE, z: -0.9 };             // where he stands, facing the window
    const CAM_D = { x: -0.05, y: EYE, z: -1.55 };          // the step after it
    const FLY0 = 16.4, FLY1 = 22.6;
    const flyAt = (t) => {                                  // the note's world position at cine time t
      const u = Math.max(0, Math.min(1, (t - FLY0) / (FLY1 - FLY0)));
      const e = u * u * (3 - 2 * u);
      // three legs: lift off the table, past the shoulder to the glass, out and away
      let x, y, z;
      if (u < 0.22) { const k = u / 0.22, kk = k * k;
        x = 0.98 - 0.18 * k; y = 0.776 + 0.57 * kk; z = -0.27 - 0.18 * k; }
      else if (u < 0.62) { const k = (u - 0.22) / 0.40;
        x = 0.80 - 1.00 * k; y = 1.35 + 0.20 * Math.sin(Math.PI * k) + 0.10 * k; z = -0.45 - 2.15 * k; }
      else { const k = (u - 0.62) / 0.38;
        x = -0.20 - 0.70 * k; y = 1.55 + 0.55 * k * k; z = -2.60 - 4.90 * k; }
      const s2 = t - FLY0;                                  // the flutter riding on the path
      x += Math.sin(s2 * 7.3) * 0.045 * (1 - 0.5 * e);
      y += Math.sin(s2 * 11.0) * 0.03;
      return { x, y, z, s2 };
    };
    sfx(16.3, 'noteflight', 0.75);
    tr(FLY0, FLY1, (k, t) => {
      const f = flyAt(t);
      stage.note.position.set(f.x - NW.x, f.y, f.z - NW.z);
      // tumbling: a sheet never flies flat
      stage.note.rotation.set(-Math.PI / 2 + Math.sin(f.s2 * 5.1) * 0.9,
                              f.s2 * 2.3,
                              0.5 + Math.sin(f.s2 * 3.7) * 0.8);
    }, rawK);
    // the fan and the dim, as before — the room's answer is now visible too
    tr(16.5, 17.1, k => { stage.fanSpeed = 1 - k; }, rawK);
    tr(21.0, 22.0, k => { stage.fanSpeed = k; }, rawK);
    tr(16.5, 20.0, k => {
      duck('v5room', 1 - 0.7 * Math.sin(Math.PI * k));
      stage.duskFill.intensity = 0.15 - 0.12 * Math.sin(Math.PI * k);
    }, rawK);
    /* the camera: on the window until the paper is in the air behind him,
       then it turns to catch it as it comes past the shoulder and follows
       it out — yaw and pitch aimed at the note every frame, blended in
       from the window heading over the first second so the turn reads as
       a head turn, not a cut. Then a step toward the window after it.   */
    const aimAt = (cam, n) => ({
      yaw: faceFrom(cam.x, cam.z, n.x, n.z),
      pitch: Math.atan2(n.y - cam.y, Math.hypot(n.x - cam.x, n.z - cam.z)) });
    camTo(19.6, 22.6, CAM_C, CAM_D, smoothK);
    tr(17.4, 22.6, (k, t) => {
      const kc = Math.max(0, Math.min(1, (t - 19.6) / 3.0)), ec = kc * kc * (3 - 2 * kc);
      const cam = { x: CAM_C.x + (CAM_D.x - CAM_C.x) * ec, y: EYE, z: CAM_C.z + (CAM_D.z - CAM_C.z) * ec };
      const a = aimAt(cam, flyAt(t));
      const kb = Math.max(0, Math.min(1, (t - 17.4) / 1.0)), eb = kb * kb * (3 - 2 * kb);
      yaw.rotation.y = mixAngle(TO_WIN, a.yaw, eb);
      pitch.rotation.x = -0.02 + (a.pitch - -0.02) * eb;
    }, rawK);
    // the kicked horizon lands as the paper passes his shoulder
    tr(18.3, 19.6, k => { camera.rotation.z = 0.035 * (1 - k); }, rawK);
    step(19.7, () => { camera.rotation.z = 0; });

    // 22.6-24.4 it is gone; he is left looking at the window it went out of
    yawTo(22.6, 24.2, faceFrom(CAM_D.x, CAM_D.z, -0.90, -7.5), TO_WIN, smoothK);
    pitchTo(22.6, 24.2, Math.atan2(2.1 - EYE, Math.hypot(-0.90 - CAM_D.x, -7.5 - CAM_D.z)), 0.02, smoothK);
    tr(24.2, 24.5, () => {}, rawK);
    fade(24.5, 27.5, 0, 1);
    step(27.4, () => { handsRoot.visible = true; });

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
    const Y_TBL = faceFrom(WATCH.x, WATCH.z, 0.98, -0.27);
    const ALTCAM = { x: -1.45, y: EYE, z: -0.55 };
    const Y_ALT = faceFrom(ALTCAM.x, ALTCAM.z, -2.85, -2.15);

    const turnTo = mkTurn(api);
    step(0, () => { ghostOpacity(0); handsRoot.visible = false; });
    camTo(0, 2.4, { x: s.yawPos.x, y: s.yawPos.y, z: s.yawPos.z }, WATCH, smoothK);
    yawTo(0, 2.4, s.yawRot, Y_TBL, smoothK);
    pitchTo(0, 2.4, s.pitchX, -0.18, smoothK);

    /* 2-5.3 he takes the note from where he stands. There is no walk here
       and there must not be: the dining set is ringed by its own four
       chairs, and every lane to the old note spot went through one of them
       or through the tabletop. The note lies at his end (NOTE_HOME), 0.68 m
       away — a lean, which is what taking something off a table is.
       v5.07 (Chad): the note is GONE from the table at the bottom of the
       lean and is never seen again — not in his hand, not at the altar.
       "Just show the hell note disappearing from the table when the medium
       approaches the table ... there is no need to show the hell note
       being burnt at the altar because it looks very fake." */
    step(2.0, () => {
      stage.tangki.rotation.y = faceFrom(0.35, -0.55, 0.98, -0.27) + Math.PI;
    });
    tr(2.0, 4.6, k => { stage.tangBow = 0.20 * Math.sin(Math.PI * k); }, rawK);
    sfx(4.8, 'notepull', 0.5);
    step(5.2, () => {
      stage.tangBow = 0;
      stage.note.visible = false;                 // taken; the table is bare
    });
    sfx(5.8, 't5learnD1');                        // 2.59 s: "We return what was kept."

    /* 8.5-13 to the altar, round the near side of the table - the straight
       line runs THROUGH the tabletop. Ma steps up to the edge of the rite,
       frame-left of the altar camera, where her thank-you can land on
       someone the player can see.                                       */
    const Y_D1 = faceFrom(0.35, -0.55, 0.2, 0.15) + Math.PI;
    const Y_D2 = faceFrom(0.2, 0.15, -2.35, -1.75) + Math.PI;
    step(8.5, () => { stage.tangki.rotation.y = Y_D1; stage.tangPlay('walk', 0.3); });
    tr(8.5, 10.6, k => {
      stage.tangki.position.set(0.35 + (0.2 - 0.35) * k, 0, -0.55 + (0.15 - -0.55) * k);
    }, smoothK);
    /* the corner at the table's near end is 115 degrees — a turnaround by
       any honest measure, so the catwalk take carries it, quickened under
       the eased start of the second leg (3.2 m in 2.4 s) */
    turnTo(10.6, Y_D1, Y_D2, 1.6, 'walk', 1.1);
    tr(10.6, 13.0, k => {
      stage.tangki.position.set(0.2 + (-2.35 - 0.2) * k, 0, 0.15 + (-1.75 - 0.15) * k);
    }, smoothK);
    step(13.0, () => {
      stage.tangki.rotation.y = faceFrom(-2.35, -1.75, -2.85, -2.15) + Math.PI;
      stage.tangPlay('idle');
    });
    step(9.0, () => { stage.maPlay('walkstart'); });
    tr(9.0, 13.0, k => {
      stage.ma.position.set(-2.45 + (-2.5 - -2.45) * k, 0, -0.85 + (-1.15 - -0.85) * k);
    }, smoothK);
    step(13.0, () => {
      stage.ma.rotation.y = faceFrom(-2.5, -1.15, -2.85, -2.15) + Math.PI;
      stage.maPlay('idle');                      // she settles to watch the rite
    });
    // and she says her thank-you on the talking take, not standing frozen
    step(24.8, () => { stage.maPlay('talk'); });
    step(27.6, () => { stage.maPlay('idle'); });
    camTo(8.5, 12.5, WATCH, ALTCAM, smoothK);
    yawTo(8.5, 12.5, Y_TBL, Y_ALT, smoothK);
    pitchTo(8.5, 12.5, -0.18, 0.05, smoothK);

    /* 13.6-27 THE RITE AT THE ALTAR — v5.07, to Chad's spec. He reaches
       up to the altar with the torch take (Unarmed Grab Torch From Wall,
       4.58 s, played once and HELD on its last frame: the hand up, holding
       the flame), the match strikes into the reach, the fire takes with a
       12-second crackle (`noteburn` is exactly that sound), and the altar
       light lives with it. No paper is shown burning: "it looks very
       fake". The bell, the room lifting, and Ma's thank-you are as before. */
    step(13.6, () => { stage.tangPlay('torch', 1, 0.25, true); });
    sfx(13.8, 'matchstrike', 0.85);
    tr(14.0, 15.0, k => { stage.altLight.intensity = 0.9 + 3.6 * k; }, rawK);
    sfx(15.2, 'noteburn', 0.85);                  // 12.04 s of fire, the whole hold
    pitchTo(15.0, 16.5, 0.05, 0.12, smoothK);     // the eye rises with the flame
    tr(15.2, 24.0, (k, t2) => {
      stage.altLight.intensity = 4.5 * (0.85 + Math.sin(t2 * 9.5) * 0.15) * (1 - 0.35 * k);
    }, rawK);
    // the hand comes down once the fire has taken
    step(21.5, () => { stage.tangPlay('idle', 1, 0.6); });
    sfx(17.5, 'bellring', 0.7);
    /* the flat exhales: the room's fill light lifts through the burn */
    tr(16.0, 24.0, k => { stage.duskFill.intensity = 0.15 + 0.55 * k; }, smoothK);
    // the blaze settles to an ember once the paper is gone
    tr(24.0, 26.5, k => { stage.altLight.intensity = 2.9 + (1.1 - 2.9) * k; }, smoothK);
    pitchTo(26.0, 29.0, 0.12, 0.05, smoothK);

    /* 25-41 the three goodbyes, in turn, with real air between them. He
       turns from the altar to the boy for the lesson, and the camera leans
       slowly in for the length of it - twenty static seconds was a wall. */
    sfx(25.0, 'v5ma2');                           // 2.12 s
    // he turns from the altar to the boy — the whole way round, on the take
    turnTo(27.5, faceFrom(-2.35, -1.75, -2.85, -2.15) + Math.PI,
           faceFrom(-2.35, -1.75, ALTCAM.x, ALTCAM.z) + Math.PI, 1, 'idle');
    camTo(28.0, 44.5, ALTCAM, { x: -1.62, y: EYE - 0.02, z: -0.74 }, smoothK);
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
