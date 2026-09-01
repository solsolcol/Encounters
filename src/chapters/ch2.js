/* Chapter 2 · The Presence
   ---------------------------------------------------------------------------
   Days after the void deck. The note came home — one way or another — and so
   did something else. A bedroom in an HDB flat, late eighties, and the whole
   chapter happens inside four walls you can cross in four steps.

   That smallness is the design. Chapter 1 was a deck you could run across and
   its terror was distance: she was over there, and then she was closer. Here
   there is nowhere to go. The terror is that the room is small, the door is
   ajar, and the gap between the bed and the wall is exactly wide enough.

   Written against the same contract as chapter 1 and the fixture:
     build(ctx) -> stage        this chapter's world, and the handle the
                                engine drives it through
     intro(c, s, api)           NEW: the opening film, run before the chapter
                                card. The engine plays it whenever a chapter
                                is entered at its start.
     scenes[i](c, s, api)       the cutscene for choice i

   The source is Master Z's own: docs/source/trial-game-chapters.md, episode
   one, chapter two. The four choices, their ranking and their teachings are
   his, verbatim. Only the delta MAGNITUDES are rescaled — the trial scores on
   a plus-or-minus twelve scale and this game runs at thirty — and the shape
   is untouched, which matters, because the shape is the lesson: the bravest
   option is the worst one.                                                  */

(() => {
  'use strict';

  let S = null;

  const DATA = {
    id: 2,
    title: 'The Presence',

    cardLabel: 'Chapter 2',
    cardTitle: 'The Presence<br>In My Own Room',

    brief: 'Days later. Your own bedroom, the fan turning, the streetlight coming through the louvres. Someone has been crying in this flat and it is not your mother. Tonight the room is not empty.',
    prompt: 'Something is in the gap between the bed and the wall. What do you do?',

    choices: [
      {
        k: 'A', text: 'Look behind the bed.',
        d: { sanity: -25, awareness: 25, wisdom: 5 },
        verdict: 'worst',
        say: 'You lean over the edge and look down into the dark. It is looking back, and it has been for a while.',
        teach: 'Awareness can reveal more, but investigation without preparation has a cost.'
      },
      {
        k: 'B', text: 'Call for your mother.',
        d: { sanity: 15, awareness: 12, wisdom: 25 },
        verdict: 'best',
        say: 'You shout. Nothing, for a long moment. Then a door, and slippers on the terrazzo, and the light.',
        teach: 'Seeking help is not weakness. Knowing your limits is part of wisdom.'
      },
      {
        k: 'C', text: 'Get out of the room.',
        d: { sanity: -8, awareness: 20, wisdom: 18 },
        verdict: 'good',
        say: 'You take the far side of the bed and go. At the door you look back, and the room looks ordinary.',
        teach: 'Creating distance can reduce exposure even when it does not solve the cause.'
      },
      {
        k: 'D', text: 'Stay silent and do not move.',
        d: { sanity: -12, awareness: 14, wisdom: 12 },
        verdict: 'bad',
        say: 'You lie still and count the fan going round. Beside your head, the mattress takes someone’s weight.',
        teach: 'Stillness may prevent escalation, but enduring fear indefinitely is not the same as solving the problem.'
      }
    ],
    core: 'Know the edge of what you can handle, and call across it.<br><i>Kalyāṇamittatā — admirable friendship is the whole of the holy life.</i>',

    /* --- the stage ------------------------------------------------------
       The room's interior is x from -1.9 to 1.9 and z from -2.2 to 2.2, with
       the ceiling at 2.6. Everything below is inside that.

       `bounds` is wider than the walls on purpose. The walls are what
       actually stop the player — they are blockers — and bounds is the
       backstop behind them, so it has to contain every point the chapter
       names, including the gap behind the bed, which is a place she stands
       and you never do.                                                    */
    spawn:     { x: 0.55, y: 1.62, z: 0.75 },   // standing, facing the window
    /* `shrine` is the engine's word for the thing SHE is attached to — the
       burner, in chapter 1. Here it is the gap, not the altar: her territory
       is measured from it, and anchoring it on the altar would have made the
       safest object in the room the source of the haunting, and the whole
       four metre room permanently inside it. */
    shrine:    { x: -1.62, z: -0.10 },          // the gap between bed and wall
    ghostHome: { x: -1.80, z: -1.15 },          // the gap, at the head end
    bounds:    { minX: -1.85, maxX: 1.72, minZ: -2.00, maxZ: 2.00 },

    /* Her reach, in a room four metres across. Every one of these was a
       void-deck number written into the engine until this chapter needed
       them: at the old minimum of 3.4 m she could not have come near you in
       here at all, and a flee would have clamped her eighteen metres away,
       through the wall.                                                    */
    ghost: {
      minDist: 1.15,          // close enough to be in the room with you
      /* Measured from the gap. Small enough that the far corner by the door
         is genuinely relief — in a room this size a generous radius means
         the haunt never lets up, and a sanity drain that never stops is not
         tension, it is a countdown. */
      appearAt: 2.0,
      near: 1.5, far: 3.0,    // where a spawn ahead of you can land
      cross: [1.7, 2.5],      // a crossing goes wall to wall, not deck to deck
      away: [1.3, 2.3],
      behind: 0.9,
      roam: { minX: -1.85, maxX: 1.70, minZ: -2.05, maxZ: 2.00 }
    },

    /* hdb is the block across the way, seen through the window — reused, not
       new, and the most Singaporean thing in the shot. hellnote is the note
       itself, sitting on the desk where he left it: the thread out of chapter
       one, and also what the engine's in-hand note prop is textured from. */
    assets: ['hdb', 'hellnote', 'mother', 'motheranim'],
    noteArt: 'hellnote',

    /* No `voiceLine`. Chapter 1 opens on silence and gives him a line three
       seconds in; this one opens on a film in which he says three, and a
       fourth the moment the black lifts would be crowding.

       `lines` are the two he says about the gap — on the first approach and
       at the first clear look at it — and `sayPrefix` picks the four that
       run under the outcome cards: v2A, v2B, v2C, v2D.                    */
    /* The room's own sound: the traffic four floors down, the fan, and a
       clock somewhere. No `atShrine` — the altar's candle is electric, and
       a crackling fire on a shelf beside a boy's bed would be nonsense. */
    ambience: { beds: [['amb', 0.20], ['fan', 0.30], ['clock', 0.10]],
                atShrine: null },
    /* The words that name the thing you can act on. Chapter 1's are about a
       heap of hell notes on a void deck; these are about a slot of dark
       beside a bed. */
    words: {
      approach: 'Something is not right in here...',
      act: 'E at the gap beside the bed',
      actTouch: 'tap the gap beside the bed',
      interact: 'Look into the gap beside the bed',
      interactTouch: 'the gap beside the bed'
    },
    lines: { near: 'v2near', close: 'v2gap', nearAt: 2.6 },
    sayPrefix: 'v2'
  };

  /* ====================================================================== */
  /* THE WORLD                                                              */
  /* ====================================================================== */

  function build(ctx) {
    const { THREE, GLTFLoader, scene, camera, yaw, LOW,
            assetBytes, rescueTextures, redoShadows,
            cnv, makeSoftDot, makeConcrete, makeLacquer,
            makeHellNote, getState, startDecision, HEAD_RE } = ctx;

    /* SHRINE is the engine's anchor for HER — chapter 1's burner, this
       chapter's gap. The altar is a different thing entirely and lives on
       the right wall: it is the one warm light in the room, and what the
       engine warms the player's hands from as they cross it. Keeping them
       apart matters, because the first pass had them share a position and
       the family's altar ended up floating over the bed. */
    const SHRINE = new THREE.Vector3(DATA.shrine.x, 0, DATA.shrine.z);
    const ALTAR = { x: 1.62, z: 1.25 };

    const owned = [];         // parented to the SCENE, so dispose() needs a list
    let alive = true;         // a GLB landing after dispose() must not build

    /* --------------------------------------------------------- the room */
    const R = {                       // interior half-extents and the ceiling
      x: 1.9, z: 2.2, h: 2.6, wall: 0.12
    };

    /* ------------------------------------------------------------ textures */
    const cTex = makeConcrete();
    const lacquerTex = makeLacquer();
    const noteTex = makeHellNote();
    const dotTex = makeSoftDot('rgba(255,240,214,0.9)', 'rgba(255,240,214,0)');

    // painted plaster: the concrete texture at a fine scale reads as the
    // orange-peel roll finish every one of these flats has
    const wallMap = cTex.map.clone(); wallMap.needsUpdate = true;
    wallMap.repeat.set(2.2, 1.6);
    const matWall = new THREE.MeshStandardMaterial({
      map: wallMap, color: 0x9aa2ac, roughness: 0.97, metalness: 0 });
    const matCeil = new THREE.MeshStandardMaterial({ color: 0xb9c0c8, roughness: 0.99 });

    // terrazzo, which is what these floors are: pale chips in grey
    const floorTex = makeTerrazzo(cnv);
    const matFloor = new THREE.MeshStandardMaterial({
      map: floorTex, roughness: 0.62, metalness: 0.02 });

    const matWood = new THREE.MeshStandardMaterial({ color: 0x53381f, roughness: 0.72, metalness: 0.03 });
    const matWoodDark = new THREE.MeshStandardMaterial({ color: 0x2e1f13, roughness: 0.8, metalness: 0.03 });
    const matSheet = new THREE.MeshStandardMaterial({ color: 0xb9b3a4, roughness: 0.94 });
    const matBlanket = new THREE.MeshStandardMaterial({ color: 0x4a5a6b, roughness: 0.95 });
    const matMetal = new THREE.MeshStandardMaterial({ color: 0x4a4f57, roughness: 0.5, metalness: 0.8 });
    const matPaint = new THREE.MeshStandardMaterial({ color: 0xd8d2c4, roughness: 0.7 });
    const matLacquer = new THREE.MeshStandardMaterial({ map: lacquerTex, roughness: 0.42, metalness: 0.18 });
    const matGlass = new THREE.MeshStandardMaterial({
      color: 0x1b2430, roughness: 0.18, metalness: 0.1, transparent: true, opacity: 0.35 });
    // the gap's own darkness: an unlit black that eats the streetlight
    const matVoid = new THREE.MeshBasicMaterial({ color: 0x000000, fog: false });

    const world = new THREE.Group();
    scene.add(world);

    /* ---------------------------------------------------------- the shell */
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(R.x * 2, R.z * 2), matFloor);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    world.add(floor);

    const ceil = new THREE.Mesh(new THREE.PlaneGeometry(R.x * 2, R.z * 2), matCeil);
    ceil.rotation.x = Math.PI / 2;
    ceil.position.y = R.h;
    world.add(ceil);

    /* The four walls, as boxes — which is also what blockers() looks for, so
       the room stops you by being a room rather than by an invisible cage.
       The window and the door are cut by building each of those walls in
       pieces around the opening; a hole in a box is not a thing three.js
       does, and three small boxes are cheaper than any way of faking it. */
    const walls = [];
    function wall(w, h, d, x, y, z) {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), matWall);
      m.position.set(x, y, z);
      m.castShadow = true; m.receiveShadow = true;
      world.add(m); walls.push(m);
      return m;
    }
    // left (the bed's wall) and right (the wardrobe's), both solid
    wall(R.wall, R.h, R.z * 2, -R.x - R.wall / 2, R.h / 2, 0);
    wall(R.wall, R.h, R.z * 2, R.x + R.wall / 2, R.h / 2, 0);

    // far wall, with the window: sill, head, and a jamb either side
    const WIN = { x: -0.10, w: 1.50, sill: 0.95, top: 2.10 };
    const zFar = -R.z - R.wall / 2;
    wall(R.x * 2, WIN.sill, R.wall, 0, WIN.sill / 2, zFar);                       // under
    wall(R.x * 2, R.h - WIN.top, R.wall, 0, (R.h + WIN.top) / 2, zFar);           // over
    /* The jambs are measured from the WINDOW, not from the wall's middle.
       The window is off centre (it is over the desk, not over the room), so
       splitting the leftover width in half put a slab of plaster across the
       glass and left a hole beside it. */
    const winL = WIN.x - WIN.w / 2, winR = WIN.x + WIN.w / 2;
    const lw = winL - (-R.x), rw = R.x - winR;
    wall(lw, WIN.top - WIN.sill, R.wall,
         -R.x + lw / 2, (WIN.sill + WIN.top) / 2, zFar);
    wall(rw, WIN.top - WIN.sill, R.wall,
         R.x - rw / 2, (WIN.sill + WIN.top) / 2, zFar);

    // near wall, with the door
    const DOOR = { x: 1.05, w: 0.86, h: 2.05 };
    const zNear = R.z + R.wall / 2;
    wall(R.x * 2, R.h - DOOR.h, R.wall, 0, (R.h + DOOR.h) / 2, zNear);            // over
    const leftRun = (DOOR.x - DOOR.w / 2) - (-R.x);
    wall(leftRun, DOOR.h, R.wall, -R.x + leftRun / 2, DOOR.h / 2, zNear);
    const rightRun = R.x - (DOOR.x + DOOR.w / 2);
    wall(rightRun, DOOR.h, R.wall, R.x - rightRun / 2, DOOR.h / 2, zNear);

    // skirting, because a room without one reads as a box
    const skirtMat = new THREE.MeshStandardMaterial({ color: 0x6d7480, roughness: 0.85 });
    for (const [w, d, x, z] of [[R.x * 2, 0.03, 0, -R.z + 0.015],
                                [R.x * 2, 0.03, 0, R.z - 0.015],
                                [0.03, R.z * 2, -R.x + 0.015, 0],
                                [0.03, R.z * 2, R.x - 0.015, 0]]) {
      const s = new THREE.Mesh(new THREE.BoxGeometry(w, 0.09, d), skirtMat);
      s.position.set(x, 0.045, z);
      world.add(s);
    }

    /* -------------------------------------------------- window and outside */
    const winGroup = new THREE.Group();
    winGroup.position.set(WIN.x, 0, -R.z - 0.02);
    world.add(winGroup);

    const glass = new THREE.Mesh(
      new THREE.PlaneGeometry(WIN.w, WIN.top - WIN.sill), matGlass);
    glass.position.set(0, (WIN.sill + WIN.top) / 2, 0);
    winGroup.add(glass);

    // louvres: the horizontal glass slats that cut the streetlight into bars
    const louvreGeo = new THREE.BoxGeometry(WIN.w - 0.06, 0.075, 0.02);
    for (let i = 0; i < 9; i++) {
      const l = new THREE.Mesh(louvreGeo, matGlass);
      l.position.set(0, WIN.sill + 0.09 + i * 0.125, 0.02);
      l.rotation.x = -0.42;
      winGroup.add(l);
    }
    // and the grille, which every one of these windows has
    const barGeo = new THREE.BoxGeometry(0.022, WIN.top - WIN.sill, 0.022);
    for (let i = 0; i < 6; i++) {
      const b = new THREE.Mesh(barGeo, matMetal);
      b.position.set(-WIN.w / 2 + 0.14 + i * ((WIN.w - 0.28) / 5),
                     (WIN.sill + WIN.top) / 2, 0.05);
      winGroup.add(b);
    }

    // the curtain, pushed to one side, and it moves when nothing does
    const curtain = new THREE.Mesh(
      new THREE.PlaneGeometry(0.52, WIN.top - WIN.sill + 0.34, 6, 1), matSheet);
    curtain.position.set(WIN.w / 2 - 0.16, (WIN.sill + WIN.top) / 2 - 0.1, 0.10);
    curtain.material.side = THREE.DoubleSide;
    winGroup.add(curtain);
    const curtainBase = curtain.geometry.attributes.position.array.slice();

    /* The block across the way. It is the same model chapter 1 stands under,
       put where a neighbouring block would be and seen only through a metre
       and a half of window — so it costs one already-downloaded file and
       gives the room an outside to be inside of. */
    let hdbReady = false;
    assetBytes('hdb').then(BUF => new GLTFLoader().parse(BUF, '', (gltf) => {
      if (!alive) return;                  // disposed while the bytes flew
      rescueTextures(gltf, BUF);
      const blk = gltf.scene;
      blk.scale.setScalar(0.001);
      blk.position.set(2.0, -1.0, -26.0);  // across the car park, and below us
      blk.rotation.y = 0.22;
      blk.traverse(o => {
        if (!o.isMesh) return;
        o.castShadow = false;              // nothing out there lights this room
        o.receiveShadow = false;
        const mats = Array.isArray(o.material) ? o.material : [o.material];
        for (const m of mats) { m.roughness = 0.95; m.metalness = 0; }
      });
      world.add(blk);
      hdbReady = true;
      redoShadows();
    }, (err) => console.warn('HDB failed to load', err)))
      .catch(err => console.warn('HDB failed to load', err));

    // a handful of lit windows over there, so the block is inhabited
    const litMat = new THREE.MeshBasicMaterial({ color: 0xffd9a0, fog: false });
    const litGeo = new THREE.PlaneGeometry(0.9, 0.7);
    for (const [lx, ly] of [[-2.2, 5.4], [1.6, 8.1], [4.4, 3.2], [-4.8, 11.0], [3.1, 13.6]]) {
      const w2 = new THREE.Mesh(litGeo, litMat);
      w2.position.set(lx, ly, -25.4);
      world.add(w2);
    }

    /* ------------------------------------------------------------ lighting */
    /* The sodium streetlight, well outside and low, so it comes through the
       louvres almost flat and lays the room out in bars. It is the only
       reason you can see anything, and it is the wrong colour for comfort. */
    const street = new THREE.SpotLight(0xffb267, LOW ? 26 : 44, 18, 0.68, 0.5, 1.1);
    street.position.set(WIN.x - 0.5, 3.0, -6.2);
    street.target.position.set(WIN.x + 0.6, 0.3, 1.2);
    street.castShadow = !LOW;
    if (street.shadow) {
      street.shadow.mapSize.set(LOW ? 512 : 1024, LOW ? 512 : 1024);
      street.shadow.camera.near = 1; street.shadow.camera.far = 22;
      street.shadow.bias = -0.0016;
    }
    scene.add(street); scene.add(street.target);
    owned.push(street, street.target);

    // the altar's red electric candle: small, warm, and the only kind light
    const fireLight = new THREE.PointLight(0xff5a30, 3.4, 4.0, 1.7);
    fireLight.position.set(ALTAR.x - 0.06, 1.80, ALTAR.z);
    scene.add(fireLight); owned.push(fireLight);

    // a floor bounce so the shadows are not pure black
    /* A room lit by one streetlight through louvres is nearly black in the
       corners, and nearly black is not the same as atmospheric: you have to
       be able to read the room you are trapped in. This lifts the shadows
       just enough to see furniture in, and stays cold so the altar's candle
       is still the only warm thing in here. */
    const bounce = new THREE.HemisphereLight(0x36435c, 0x121722, 0.62);
    scene.add(bounce); owned.push(bounce);

    // the strip of hallway past the door, which scene B floods and scene C
    // walks into. Off until a scene wants it.
    const hallLight = new THREE.PointLight(0xffd9a2, 0, 4.2, 1.6);
    hallLight.position.set(DOOR.x, 1.9, R.z + 0.75);
    scene.add(hallLight); owned.push(hallLight);

    /* ---------------------------------------------------------- the bed */
    /* Against the left wall but NOT against it: the 20 cm the frame stands
       off the plaster is the whole chapter. */
    const BED = { x: -1.22, z: -0.45, w: 0.95, len: 1.90, top: 0.50 };
    const bed = new THREE.Group();
    bed.position.set(BED.x, 0, BED.z);
    world.add(bed);

    const frame = new THREE.Mesh(new THREE.BoxGeometry(BED.w, 0.30, BED.len), matWoodDark);
    frame.position.y = 0.20;
    frame.castShadow = true; frame.receiveShadow = true;
    bed.add(frame);
    const mattress = new THREE.Mesh(
      new THREE.BoxGeometry(BED.w - 0.04, 0.18, BED.len - 0.06), matSheet);
    mattress.position.y = 0.44;
    mattress.castShadow = true; mattress.receiveShadow = true;
    bed.add(mattress);
    const blanket = new THREE.Mesh(
      new THREE.BoxGeometry(BED.w - 0.02, 0.07, BED.len * 0.62), matBlanket);
    blanket.position.set(0, 0.55, BED.len * 0.16);
    blanket.castShadow = true; blanket.receiveShadow = true;
    bed.add(blanket);
    const pillow = new THREE.Mesh(new THREE.BoxGeometry(BED.w - 0.22, 0.11, 0.34), matSheet);
    pillow.position.set(0, 0.585, -BED.len / 2 + 0.26);
    pillow.castShadow = true;
    bed.add(pillow);
    // headboard, at the window end
    const headboard = new THREE.Mesh(new THREE.BoxGeometry(BED.w, 0.62, 0.05), matWoodDark);
    headboard.position.set(0, 0.55, -BED.len / 2 - 0.02);
    headboard.castShadow = true;
    bed.add(headboard);

    /* -------------------------------------------------------- THE GAP ----
       The interactable, and the engine reaches it through the same
       `stage.pile.*` handle chapter 1's heap of notes uses. Fictionally it is
       a slot of darkness twenty centimetres wide; mechanically it is the one
       thing in this chapter you can act on.

       It is built as an unlit black plane standing in the slot, because a
       shadow is not dark enough — the streetlight rakes right along that wall
       and would light the floor of a real gap. This one takes no light at
       all, which is why your eye keeps going back to it.                  */
    const GAP = { x: -R.x + 0.10, z: -0.10 };
    const gap = new THREE.Group();
    gap.position.set(GAP.x, 0, GAP.z);
    world.add(gap);

    const gapDark = new THREE.Mesh(new THREE.PlaneGeometry(0.20, BED.len + 0.1), matVoid);
    gapDark.rotation.x = -Math.PI / 2;
    gapDark.position.set(0, 0.012, BED.z - GAP.z);
    gap.add(gapDark);
    const gapBack = new THREE.Mesh(new THREE.PlaneGeometry(BED.len + 0.1, 0.62), matVoid);
    gapBack.rotation.y = Math.PI / 2;
    gapBack.position.set(-0.09, 0.31, BED.z - GAP.z);
    gap.add(gapBack);

    /* the highlight, exactly as chapter 1 marks its heap: a ring on the
       floor for "this is a thing", and a mark above it that carries further
       and keeps moving, for "and it is waiting for you" */
    const gapRing = new THREE.Mesh(
      new THREE.RingGeometry(0.30, 0.44, 40),
      new THREE.MeshBasicMaterial({ color: 0x63d6c8, transparent: true, opacity: 0,
        side: THREE.DoubleSide, blending: THREE.AdditiveBlending,
        depthWrite: false, fog: false }));
    gapRing.rotation.x = -Math.PI / 2;
    gapRing.position.y = 0.03;
    gapRing.visible = false;
    gap.add(gapRing);

    const markGlow = new THREE.Sprite(new THREE.SpriteMaterial({
      map: makeSoftDot('rgba(99,214,200,0.50)', 'rgba(99,214,200,0)'),
      transparent: true, depthWrite: false, fog: false, sizeAttenuation: false,
      blending: THREE.AdditiveBlending }));
    markGlow.scale.setScalar(0.34);
    const mark = new THREE.Sprite(new THREE.SpriteMaterial({
      map: makeMark(cnv), transparent: true, depthWrite: false, fog: false,
      sizeAttenuation: false }));
    mark.scale.setScalar(0.115);
    const markRoot = new THREE.Group();
    markRoot.position.y = 1.05;
    markRoot.visible = false;
    markRoot.add(markGlow, mark);
    gap.add(markRoot);

    /* ------------------------------------------------------- the wardrobe */
    const WARD = { x: R.x - 0.31, z: -0.95, w: 0.60, len: 1.24, h: 2.05 };
    const wardrobe = new THREE.Group();
    wardrobe.position.set(WARD.x, 0, WARD.z);
    world.add(wardrobe);
    const wardBody = new THREE.Mesh(
      new THREE.BoxGeometry(WARD.w, WARD.h, WARD.len), matWood);
    wardBody.position.y = WARD.h / 2;
    wardBody.castShadow = true; wardBody.receiveShadow = true;
    wardrobe.add(wardBody);
    // the doors, and the left one is not quite shut
    const wardDoorGeo = new THREE.BoxGeometry(0.035, WARD.h - 0.14, WARD.len / 2 - 0.02);
    const wardDoorL = new THREE.Mesh(wardDoorGeo, matWoodDark);
    wardDoorL.position.set(-WARD.w / 2 - 0.018, WARD.h / 2, -WARD.len / 4);
    wardDoorL.castShadow = true;
    wardrobe.add(wardDoorL);
    const wardDoorR = new THREE.Mesh(wardDoorGeo, matWoodDark);
    wardDoorR.position.set(-WARD.w / 2 - 0.018, WARD.h / 2, WARD.len / 4);
    wardDoorR.castShadow = true;
    wardrobe.add(wardDoorR);
    // the slot of black where it stands open
    const wardGapMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(WARD.len / 2 - 0.06, WARD.h - 0.2), matVoid);
    wardGapMesh.rotation.y = -Math.PI / 2;
    wardGapMesh.position.set(-WARD.w / 2 + 0.005, WARD.h / 2, -WARD.len / 4);
    wardrobe.add(wardGapMesh);
    wardDoorL.rotation.y = -0.34;
    wardDoorL.position.z -= 0.10;
    wardDoorL.position.x += 0.05;

    /* ------------------------------------------------- desk, chair, books */
    const DESK = { x: 0.86, z: -1.86, w: 1.06, d: 0.52, top: 0.74 };
    const desk = new THREE.Group();
    desk.position.set(DESK.x, 0, DESK.z);
    world.add(desk);
    const deskTop = new THREE.Mesh(new THREE.BoxGeometry(DESK.w, 0.04, DESK.d), matWood);
    deskTop.position.y = DESK.top;
    deskTop.castShadow = true; deskTop.receiveShadow = true;
    desk.add(deskTop);
    const legGeo = new THREE.BoxGeometry(0.05, DESK.top, 0.05);
    for (const [lx, lz] of [[-0.47, -0.21], [0.47, -0.21], [-0.47, 0.21], [0.47, 0.21]]) {
      const l = new THREE.Mesh(legGeo, matWoodDark);
      l.position.set(lx, DESK.top / 2, lz);
      l.castShadow = true;
      desk.add(l);
    }
    // schoolbooks, stacked and slightly out of true
    const bookMats = [0x7a2f2a, 0x2c4a63, 0x6a5a2c].map(c =>
      new THREE.MeshStandardMaterial({ color: c, roughness: 0.9 }));
    for (let i = 0; i < 3; i++) {
      const b = new THREE.Mesh(new THREE.BoxGeometry(0.21, 0.028, 0.29), bookMats[i]);
      b.position.set(-0.30 + i * 0.012, DESK.top + 0.035 + i * 0.029, 0.02 + i * 0.008);
      b.rotation.y = (i - 1) * 0.07;
      b.castShadow = true;
      desk.add(b);
    }
    // and the hell note, flat on the desk where he left it
    const noteMat = new THREE.MeshStandardMaterial({
      map: noteTex, roughness: 0.88, side: THREE.DoubleSide });
    const heroNote = new THREE.Mesh(new THREE.PlaneGeometry(0.24, 0.144), noteMat);
    heroNote.rotation.set(-Math.PI / 2, 0, 0.34);
    heroNote.position.set(0.22, DESK.top + 0.024, -0.02);
    desk.add(heroNote);

    // the desk lamp, off — a shape in the dark, not a light
    const lampBase = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.08, 0.02, 12), matMetal);
    lampBase.position.set(0.44, DESK.top + 0.03, -0.12);
    desk.add(lampBase);
    const lampArm = new THREE.Mesh(new THREE.CylinderGeometry(0.011, 0.011, 0.34, 8), matMetal);
    lampArm.position.set(0.44, DESK.top + 0.20, -0.12);
    lampArm.rotation.z = 0.22;
    desk.add(lampArm);
    const lampHead = new THREE.Mesh(new THREE.ConeGeometry(0.085, 0.11, 14, 1, true), matMetal);
    lampHead.material.side = THREE.DoubleSide;
    lampHead.position.set(0.36, DESK.top + 0.36, -0.12);
    lampHead.rotation.set(2.5, 0, 0.5);
    desk.add(lampHead);

    const chair = new THREE.Group();
    chair.position.set(DESK.x - 0.06, 0, DESK.z + 0.62);
    chair.rotation.y = 0.24;
    world.add(chair);
    const seat = new THREE.Mesh(new THREE.BoxGeometry(0.40, 0.04, 0.40), matWood);
    seat.position.y = 0.45; seat.castShadow = true;
    chair.add(seat);
    const back = new THREE.Mesh(new THREE.BoxGeometry(0.40, 0.46, 0.035), matWood);
    back.position.set(0, 0.68, -0.18); back.castShadow = true;
    chair.add(back);
    for (const [lx, lz] of [[-0.17, -0.17], [0.17, -0.17], [-0.17, 0.17], [0.17, 0.17]]) {
      const l = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.45, 0.035), matWoodDark);
      l.position.set(lx, 0.225, lz);
      chair.add(l);
    }

    /* ------------------------------------------------------------ the door */
    const door = new THREE.Group();
    /* Hinged on the jamb at the low-x side, and it opens OUTWARD, into the
       corridor. That sign is the whole contract every scene here works to,
       so it is written down rather than left to be re-derived:

         rotation.y  0     shut, flush in the frame
                    -0.62  ajar, which is how the night starts
                    -1.38  wide open, the leaf flat against the corridor wall

       Positive would swing it into the bedroom, through the wardrobe. Both
       scenes that touch this door used to open it by adding a POSITIVE
       number to the ajar angle, which drove it toward shut — the mother
       arrived by closing the door in your face, and leaving the room meant
       walking into the leaf.                                             */
    door.position.set(DOOR.x - DOOR.w / 2, 0, R.z);
    world.add(door);
    const doorLeaf = new THREE.Mesh(
      new THREE.BoxGeometry(DOOR.w, DOOR.h, 0.04), matPaint);
    doorLeaf.position.set(DOOR.w / 2, DOOR.h / 2, 0);
    doorLeaf.castShadow = true; doorLeaf.receiveShadow = true;
    door.add(doorLeaf);
    const knob = new THREE.Mesh(new THREE.SphereGeometry(0.032, 10, 8), matMetal);
    knob.position.set(DOOR.w - 0.08, 1.02, -0.05);
    door.add(knob);
    const DOOR_AJAR = -0.62;                   // how far open the night starts
    const DOOR_OPEN = -1.38;                   // and how far it goes when it goes
    door.rotation.y = DOOR_AJAR;

    // the architrave, so the opening is a doorway and not a hole cut in a wall
    const jambMat = new THREE.MeshStandardMaterial({ color: 0xc8c2b4, roughness: 0.8 });
    /* Trim sits 6-8 mm CLEAR of the wall's cut faces. A jamb face in the
       same plane as the cut it wraps is two surfaces at one depth value,
       and that flickers as the camera moves; the sliver of reveal that
       shows plaster instead is invisible and stable. */
    for (const [w, h, x, y] of [[0.044, DOOR.h + 0.06, DOOR.x - DOOR.w / 2 - 0.028, (DOOR.h + 0.06) / 2],
                                [0.044, DOOR.h + 0.06, DOOR.x + DOOR.w / 2 + 0.028, (DOOR.h + 0.06) / 2],
                                [DOOR.w + 0.14, 0.052, DOOR.x, DOOR.h + 0.034]]) {
      const j = new THREE.Mesh(new THREE.BoxGeometry(w, h, R.wall + 0.02), jambMat);
      j.position.set(x, y, R.z + R.wall / 2);
      world.add(j);
    }

    /* ------------------------------------------------------ the corridor --
       What is on the other side of that door. It used to be a 2.6 m square of
       floor and one blank wall — enough while nobody ever went out there, and
       then scene C walked into it, turned the wrong way and spent four
       seconds looking at grey plaster. So it is a passage now: the one every
       flat of this age has, bedrooms off one side, the living room glowing at
       the far end, and a batten light nobody switches on at night.

       All of it is set dressing. `bounds` stop the player at z = 2.0, twenty
       centimetres short of the doorway, so nothing out here is ever walked on
       except by a cutscene — which is also why none of it is a blocker.   */
    /* `hz0` is the OUTSIDE face of this room's near wall — the plaster
       somebody standing in the corridor can put a hand on. The room's own
       wall is a box of depth R.wall CENTRED on R.z + R.wall/2, so it runs
       from R.z to R.z + R.wall, and the corridor starts where it stops.
       Half a wall out and everything hung on this face ends up buried in
       it, which is how the light switch spent its first draft inside the
       plaster with 8 mm of it poking into the bedroom.                   */
    const hz0 = R.z + R.wall;                   // the corridor's near face
    const HALL = { d: 1.56, x0: -3.4, x1: 3.6, z0: hz0, z1: hz0 + 1.56 };
    const hz1 = HALL.z1;                        // the inner face of its far wall
    const hallW = HALL.x1 - HALL.x0, hallMidX = (HALL.x0 + HALL.x1) / 2;

    const hallFloor = new THREE.Mesh(new THREE.PlaneGeometry(hallW, HALL.d + 0.1), matFloor);
    hallFloor.rotation.x = -Math.PI / 2;
    hallFloor.position.set(hallMidX, 0.004, (hz0 + hz1) / 2);
    hallFloor.receiveShadow = true;
    world.add(hallFloor);
    const hallCeil = new THREE.Mesh(new THREE.PlaneGeometry(hallW, HALL.d + 0.1), matCeil);
    hallCeil.rotation.x = Math.PI / 2;
    hallCeil.position.set(hallMidX, R.h, (hz0 + hz1) / 2);
    world.add(hallCeil);

    function hallWall(w, h, d, x, y, z) {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), matWall);
      m.position.set(x, y, z);
      m.receiveShadow = true;
      world.add(m);
      return m;
    }
    // the far side of the passage, and the two stretches of near wall either
    // side of this room — the room's own near wall closes the middle
    hallWall(hallW, R.h, R.wall, hallMidX, R.h / 2, hz1 + R.wall / 2);
    hallWall(-R.x - HALL.x0, R.h, R.wall, (HALL.x0 - R.x) / 2, R.h / 2, hz0 - R.wall / 2);
    hallWall(HALL.x1 - R.x, R.h, R.wall, (R.x + HALL.x1) / 2, R.h / 2, hz0 - R.wall / 2);
    // the far end is closed; the near end keeps going, to the living room
    hallWall(R.wall, R.h, HALL.d, HALL.x1 + R.wall / 2, R.h / 2, (hz0 + hz1) / 2);

    // skirting, the same 9 cm the room has, so the two floors read as one flat
    for (const [w, x, z] of [[hallW, hallMidX, hz1 - 0.015],
                             [-R.x - HALL.x0, (HALL.x0 - R.x) / 2, hz0 + 0.015],
                             [HALL.x1 - R.x, (R.x + HALL.x1) / 2, hz0 + 0.015]]) {
      const s = new THREE.Mesh(new THREE.BoxGeometry(w, 0.09, 0.03), skirtMat);
      s.position.set(x, 0.045, z);
      world.add(s);
    }

    /* Her door, shut, in the near wall past this room — which is the door
       heard opening in scene B, four seconds before she is. */
    const mumDoor = new THREE.Mesh(new THREE.BoxGeometry(0.80, 2.02, 0.04), matPaint);
    mumDoor.position.set(2.55, 1.01, hz0 + 0.0225); // back face just off the wall plane
    world.add(mumDoor);
    const mumKnob = new THREE.Mesh(new THREE.SphereGeometry(0.032, 10, 8), matMetal);
    mumKnob.position.set(2.22, 1.02, hz0 + 0.06);
    world.add(mumKnob);

    /* The batten light on the corridor ceiling. It is not a light — the hall
       light already is — it is what a lit corridor looks like it comes from,
       so its brightness is driven off hallLight every frame in updateFire. */
    const hallTube = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.06, 0.10),
      new THREE.MeshBasicMaterial({ color: 0x1a1c20, fog: false }));
    hallTube.position.set(DOOR.x + 0.30, R.h - 0.05, hz0 + HALL.d * 0.5);
    world.add(hallTube);

    // the switch by the door, and the family photograph opposite it: two
    // small things at eye height that say somebody lives here
    const plate = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.13, 0.012), jambMat);
    plate.position.set(DOOR.x - DOOR.w / 2 - 0.20, 1.28, hz0 + 0.008);
    world.add(plate);
    /* A calendar, the free kind from a provision shop. It is here for a
       composition reason as much as a decorating one: the shot at the end of
       scene C looks straight down this stretch of wall, and a metre of
       unbroken plaster in the corner of frame reads as an unfinished set. */
    const cal = new THREE.Mesh(new THREE.PlaneGeometry(0.22, 0.34),
      new THREE.MeshStandardMaterial({ color: 0xbfae90, roughness: 0.92 }));
    cal.position.set(0.06, 1.44, hz0 + 0.006);
    world.add(cal);
    const calTop = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.045, 0.014),
      new THREE.MeshStandardMaterial({ color: 0x8c2118, roughness: 0.85 }));
    calTop.position.set(0.06, 1.635, hz0 + 0.010);
    world.add(calTop);
    const photoFrame = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.26, 0.02), matWoodDark);
    photoFrame.position.set(DOOR.x + 0.90, 1.52, hz1 - 0.012);
    world.add(photoFrame);
    const photo = new THREE.Mesh(new THREE.PlaneGeometry(0.27, 0.19),
      new THREE.MeshStandardMaterial({ color: 0x6b6257, roughness: 0.9 }));
    photo.position.set(DOOR.x + 0.90, 1.52, hz1 - 0.0245); // proud of the frame face, or the print flickers against it
    photo.rotation.y = Math.PI;
    world.add(photo);

    /* The living room, off the near end of the passage and around a corner:
       a lamp somebody left on, four metres away and out of sight. It reaches
       the far end of the corridor and nothing else — the room's own night is
       a streetlight through louvres and stays that way.                   */
    const livingGlow = new THREE.PointLight(0xffc98e, LOW ? 0.5 : 0.8, 4.2, 1.8);
    livingGlow.position.set(HALL.x0 - 0.6, 1.55, hz0 + 0.9);
    scene.add(livingGlow); owned.push(livingGlow);

    /* ---------------------------------------------------------- the mother --
       The other person in this chapter, and the whole of its best answer. She
       waits out here from the moment the room is built, hidden, and only
       scene B ever shows her — which is why she is built and not spawned: a
       cutscene borrows props, it does not create them (and anything created
       inside a scene would outlive the scene and leak on rebuild).

       She is deliberately plain. For most of her time on screen she is a
       silhouette in a warm doorway with the corridor behind her, and a
       silhouette is the one thing a shape like this does well.

       Her scale is a person's: hem at knee height, shoulders at 1.36, the
       top of her head at 1.64 — a little shorter than the eye she is talking
       to, which is the difference between a mother and a figure.         */
    /* Where she waits, and it is not a free choice: it is 0.99 m from the
       door's hinge, outside the 0.86 m the leaf sweeps. Any nearer and the
       door OPENS THROUGH HER on its way — which the first pass did, by 1 cm,
       for a sixth of a second. Same reason her step back out ends where it
       does (1.16 m from the hinge): the door has to be able to shut in front
       of her without passing through her shoulder.                       */
    const MUM = { x: 1.36, z: 2.86 };            // in the corridor, at the door
    const matCoat = new THREE.MeshStandardMaterial({ color: 0x7d6f78, roughness: 0.94 });
    const matSkin = new THREE.MeshStandardMaterial({ color: 0xc9a184, roughness: 0.86 });
    const matHair = new THREE.MeshStandardMaterial({ color: 0x1c1a1c, roughness: 0.82 });
    const mother = new THREE.Group();
    {
      // the housecoat every auntie of this generation sleeps in
      const coat = new THREE.Mesh(new THREE.CylinderGeometry(0.175, 0.245, 0.94, 8), matCoat);
      coat.position.y = 0.89;
      coat.scale.set(1.06, 1, 0.86);
      coat.castShadow = !LOW;
      const shoulders = new THREE.Mesh(new THREE.BoxGeometry(0.355, 0.12, 0.19), matCoat);
      shoulders.position.y = 1.365;
      const armGeo = new THREE.BoxGeometry(0.075, 0.50, 0.105);
      const armL = new THREE.Mesh(armGeo, matCoat);
      armL.position.set(-0.205, 1.06, 0.01);
      const armR2 = new THREE.Mesh(armGeo, matCoat);
      armR2.position.set(0.205, 1.06, 0.01);
      const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.055, 0.085, 6), matSkin);
      neck.position.y = 1.455;
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.098, 12, 10), matSkin);
      head.position.y = 1.556;
      head.castShadow = !LOW;
      // hair: a cap tipped back off the face, and the bun it is gathered into
      const hair = new THREE.Mesh(new THREE.SphereGeometry(0.105, 12, 10,
        0, Math.PI * 2, 0, Math.PI * 0.58), matHair);
      hair.position.set(0, 1.556, -0.012);
      hair.rotation.x = -0.36;
      const bun = new THREE.Mesh(new THREE.SphereGeometry(0.058, 10, 8), matHair);
      bun.position.set(0, 1.545, -0.112);
      const calves = new THREE.Mesh(new THREE.BoxGeometry(0.235, 0.36, 0.135), matSkin);
      calves.position.y = 0.22;
      const slippers = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.05, 0.30),
        new THREE.MeshStandardMaterial({ color: 0x3a3f46, roughness: 0.9 }));
      slippers.position.set(0, 0.025, 0.035);
      mother.add(coat, shoulders, armL, armR2, neck, head, hair, bun, calves, slippers);
      mother.userData.head = head;
    }
    mother.position.set(MUM.x, 0, MUM.z);
    mother.rotation.y = Math.PI;                 // facing the room, as she will be
    mother.visible = false;                      // until scene B says otherwise
    world.add(mother);

    /* v4.7: the REAL her — a bought rigged model with an idle animation
       ("Casual Woman in brown dress", Sketchfab; the credits panel carries
       the attribution). It loads beside the primitive figure and swaps in
       when the bytes land; the primitives stay as the instant fallback, so
       a resume straight into the decision can never put an empty doorway on
       screen. The GROUP is the contract: every scene, snap and reset drives
       `mother`, and none of them knows or cares which body is inside it.

       Two lessons from the arms rig apply verbatim (see CLAUDE.md): the
       model's units are not to be trusted — this one comes through an FBX
       armature a hundred times life size — so it is scaled from its own
       measured bind-pose height to hers; and a skinned mesh's bounding box
       reports the BIND pose forever after, which is exactly why it is
       measured once now and never again, and why the meshes give up frustum
       culling (the bind-pose box is not where she is standing).          */
    let mumMixer = null, mumHead = null, mumTalk = 0;
    /* v5.02: the four RETARGETED clips (idle, talk, walkstart, walkstop),
       baked onto her own skeleton offline so playing one costs nothing but
       a mixer. Until they land she keeps the model's built-in idle and the
       procedural head-nod below — a failed download costs her walk, never
       the scene. `mumPlay` is the whole interface a cutscene needs.     */
    let mumActs = null, mumCur = null, mumIdleBuiltin = null;
    const mumLook = { x: 0, y: 0 };
    const _lookP = new THREE.Vector3(), _lookH = new THREE.Vector3();
    function mumPlay(name, ts = 1, fade = 0.34) {
      const nx = mumActs && mumActs[name];
      if (!nx || (nx === mumCur && nx.timeScale === ts)) return;
      nx.reset();
      nx.timeScale = ts;
      /* a reversed clip has to START at its end, or it plays one frame and
         sits on the clamp — this is how she walks BACKWARDS out of the room
         with her face still to camera, off a forwards take. */
      if (ts < 0) nx.time = nx.getClip().duration;
      nx.play();
      if (mumCur && mumCur !== nx) mumCur.crossFadeTo(nx, fade, false);
      else nx.setEffectiveWeight(1);
      mumCur = nx;
    }
    const mumPrims = [...mother.children];       // the fallback body
    assetBytes('mother').then(BUF => new GLTFLoader().parse(BUF, '', (gltf) => {
      if (!alive) return;                        // disposed while the bytes flew
      rescueTextures(gltf, BUF);
      const g = gltf.scene;
      // a first guess at scale, from the bind box; corrected from bones below
      const box = new THREE.Box3().setFromObject(g);
      const s = 1.60 / (box.max.y - box.min.y);
      g.scale.setScalar(s);
      g.traverse(o => {
        if (o.isMesh) { o.castShadow = !LOW; o.frustumCulled = false; }
      });

      /* The idle clip's first second and a half is a LEAD-IN: the pose
         easing out of the bind, with the root at a different offset. Played
         whole, she starts on the floor and then rides 0.8 m into the air
         the moment the real idle begins — and drops back every time the
         loop wraps. So the loop is CUT past the lead-in (mixamo's 30 fps,
         8.33 s take -> keep 1.6 s to 8.2 s), and it never plays.        */
      if (gltf.animations && gltf.animations.length) {
        const fps = 30;
        const clip = THREE.AnimationUtils.subclip(
          gltf.animations[0], 'idle', Math.round(1.6 * fps), Math.floor(8.2 * fps), fps);
        mumMixer = new THREE.AnimationMixer(g);
        mumIdleBuiltin = mumMixer.clipAction(clip);
        mumIdleBuiltin.play();
        mumMixer.update(0.001);                  // pose her before measuring
      }

      /* Ground and size her from BONES IN THE POSED SKELETON — the arms
         rig's lesson, which struck twice today: a skinned mesh's bounding
         box reports the bind pose forever, and this file's bind stands
         0.8 m below where its own idle stands. Feet to the terrazzo, and
         the crown (the Head match includes mixamo's HeadTop_End, the top
         of the skull) to 1.56 — a small, real woman.                    */
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

      /* HEAD_RE, not /Head$/: glTF sanitizes `mixamorig:Head_06` to
         `mixamorigHead_06`, so an anchored match finds NOTHING and her nods
         silently never happen. The optional _NN keeps a clean `...Head`
         working too, and the anchor still excludes HeadTop_End. */
      g.traverse(o => { if (o.isBone && HEAD_RE.test(o.name) && !mumHead) mumHead = o; });
      for (const c of mumPrims) c.visible = false;
      mother.add(g);
      redoShadows();

      /* Her clips ride on the SAME mixer and the same skeleton, and they
         arrive after her grounding has already been measured against the
         built-in idle — which is exactly why the block below measures it
         again. */
      assetBytes('motheranim').then(AB => new GLTFLoader().parse(AB, '', (an) => {
        if (!alive || !mumMixer) return;
        const acts = {};
        for (const clip of an.animations) acts[clip.name] = mumMixer.clipAction(clip);
        if (!acts.idle) return;                  // nothing usable; keep the built-in
        mumActs = acts;
        if (mumIdleBuiltin) mumIdleBuiltin.stop();
        mumPlay('idle');

        /* RE-GROUND, because the pose just changed under her. Her grounding
           was measured from the model's OWN idle, and that clip rides ~0.8 m
           above its bind (the lead-in note above is the same quirk seen from
           the other end). These takes are ordinary Mixamo and stand at bind
           height, so the old offset overshot and buried her to the neck —
           measured, not guessed: toes came out at -0.79 m.
           The law from CLAUDE.md holds either way: ground from the POSED
           bones. The pose is new, so the measurement is taken again.     */
        mumMixer.update(0.001);
        g.updateMatrixWorld(true);
        const v2 = new THREE.Vector3();
        let toe2 = Infinity;
        g.traverse(o => {
          if (!o.isBone) return;
          o.getWorldPosition(v2);
          if (/Toe|Foot/.test(o.name)) toe2 = Math.min(toe2, v2.y);
        });
        if (isFinite(toe2)) g.position.y -= toe2;
      }, () => {})).catch(() => {});
    }, (err) => console.warn('mother failed to load', err)))
      .catch(err => console.warn('mother failed to load', err));

    /* ----------------------------------------------------- the altar shelf */
    const altar = new THREE.Group();
    altar.position.set(ALTAR.x, 0, ALTAR.z);
    world.add(altar);
    const shelf = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.035, 0.46), matLacquer);
    shelf.position.y = 1.66;
    shelf.castShadow = true;
    altar.add(shelf);
    const candleBody = new THREE.Mesh(
      new THREE.CylinderGeometry(0.032, 0.036, 0.14, 12),
      new THREE.MeshStandardMaterial({ color: 0x8c1f18, roughness: 0.6 }));
    candleBody.position.set(-0.02, 1.75, 0);
    altar.add(candleBody);
    // the bulb: unlit material, so it glows without lighting anything twice
    const candleTip = new THREE.Mesh(new THREE.SphereGeometry(0.022, 10, 8),
      new THREE.MeshBasicMaterial({ color: 0xff6a2a, fog: false }));
    candleTip.position.set(-0.02, 1.835, 0);
    altar.add(candleTip);
    const jossTips = [candleTip];             // the engine's fire flicker drives these
    // two oranges, because there are always two
    const fruitMat = new THREE.MeshStandardMaterial({ color: 0xd8791c, roughness: 0.72 });
    for (const fz of [-0.13, 0.13]) {
      const f = new THREE.Mesh(new THREE.SphereGeometry(0.038, 12, 10), fruitMat);
      f.position.set(-0.02, 1.716, fz);
      f.scale.y = 0.88;
      altar.add(f);
    }

    /* ------------------------------------------------------ the ceiling fan */
    const fan = new THREE.Group();
    fan.position.set(0, R.h - 0.24, -0.20);
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

    /* -------------------------------------------------------------- dust ---
       In the bars of streetlight, and only there. The engine drives these
       through updateNotes(), which is the seam chapter 1 uses for its
       drifting hell notes — the same verb, a different weather.           */
    const DUST_N = LOW ? 60 : 130;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(DUST_N * 3);
    const dustSeed = new Float32Array(DUST_N);
    for (let i = 0; i < DUST_N; i++) {
      dustPos[i * 3] = (Math.random() - 0.5) * R.x * 1.9;
      dustPos[i * 3 + 1] = 0.3 + Math.random() * 2.0;
      dustPos[i * 3 + 2] = (Math.random() - 0.5) * R.z * 1.9;
      dustSeed[i] = Math.random() * 100;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    const dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({
      map: dotTex, size: 0.016, transparent: true, opacity: 0.34,
      depthWrite: false, blending: THREE.AdditiveBlending, fog: false }));
    world.add(dust);

    /* The engine expects a `flying` InstancedMesh and a `smoke`/`embers`
       pair — chapter 1's names for its own weather, and the fixture keeps
       them for the shape of the handle. This chapter has dust instead, so
       these are it: `flying` is the motes that catch the light near the
       window, and smoke/embers are the same cloud read at two scales. */
    const moteMat = new THREE.MeshBasicMaterial({
      color: 0xffe7c2, transparent: true, opacity: 0.5, fog: false,
      blending: THREE.AdditiveBlending, depthWrite: false });
    const FLY_N = LOW ? 14 : 30;
    const flying = new THREE.InstancedMesh(
      new THREE.PlaneGeometry(0.012, 0.012), moteMat, FLY_N);
    flying.frustumCulled = false;
    world.add(flying);
    const motes = [];
    for (let i = 0; i < FLY_N; i++) {
      motes.push({ x: WIN.x + (Math.random() - 0.5) * 1.5,
                   y: 0.4 + Math.random() * 1.7,
                   z: -R.z + 0.2 + Math.random() * 1.5,
                   rise: 0.03 + Math.random() * 0.05,
                   ph: Math.random() * 10 });
    }
    const smoke = dust, embers = dust;      // one cloud, named for the contract

    /* ================================================================== */
    /* THE THING YOU CAN ACT ON                                           */
    /* ================================================================== */
    const PILE_POS = new THREE.Vector3(GAP.x, 0, GAP.z);
    const INTERACT_R = 1.55;
    const HIGHLIGHT_R = 2.6;
    const MARK_R = 4.2;

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
      return _ndc.set(PILE_POS.x, 0.45, PILE_POS.z).project(camera);
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
      if (_ray.intersectObjects([gapDark, gapBack], false).length) return true;
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
        markRoot.visible = gapRing.visible = false;
        return;
      }
      const dist = pileDist();
      const m = THREE.MathUtils.clamp(
        (MARK_R - dist) / (MARK_R - INTERACT_R) * 1.9, 0, 1);
      markRoot.visible = m > 0.01;
      if (markRoot.visible) {
        const beat = 0.72 + 0.28 * Math.sin(t * 3.1);
        markRoot.position.y = 1.05 + Math.sin(t * 1.9) * 0.08;
        mark.material.opacity = m;
        mark.scale.setScalar(0.115 * (0.93 + beat * 0.11));
        markGlow.material.opacity = m * beat * 0.55;
      }
      const near = THREE.MathUtils.clamp(
        (HIGHLIGHT_R - dist) / (HIGHLIGHT_R - INTERACT_R), 0, 1);
      const on = near > 0.01;
      gapRing.visible = on;
      if (on) gapRing.material.opacity = near * (0.62 + 0.38 * Math.sin(t * 2.6)) * 0.58;
    }

    /* ================================================================== */
    /* WHAT MOVES                                                         */
    /* ================================================================== */
    let fanSpeed = 1;                 // scenes slow it and stop it
    let noteStorm = 1;                // the contract's name for "how much air"

    const _m4 = new THREE.Matrix4();
    function updateNotes(dt, t) {
      // the mother's idle, while she is on screen — a mixer is cheap, but a
      // mixer for somebody behind a shut door is still work for nothing
      if (mumMixer && mother.visible) mumMixer.update(dt);
      /* v4.8, the talking beat: the file ships one clip — a standing idle,
         no talk, no walk — so when she speaks the HEAD carries it: small
         nods laid on top of the idle after every mixer step. */
      /* THE LOOK (v5.03): she turns her head to the boy. Every camera that
         ever sees her in this chapter is his point of view — she only
         appears in scene B — so this needs no per-scene gate, unlike ch5
         where the film cuts to cameras that are nobody. Clamped to a neck's
         range, eased, laid on after the mixer. */
      if (mumHead) {
        camera.getWorldPosition(_lookP);
        mumHead.getWorldPosition(_lookH);
        const dx = _lookP.x - _lookH.x, dz = _lookP.z - _lookH.z;
        const flat = Math.hypot(dx, dz);
        let d = Math.atan2(dx, dz) - mother.rotation.y;
        d = Math.atan2(Math.sin(d), Math.cos(d));
        const w = mother.visible ? 1 : 0;
        const YAW = 0.75, PIT = 0.34;
        const wy = Math.abs(d) > YAW + 0.9 ? 0 : Math.max(-YAW, Math.min(YAW, d));
        const wx = flat < 0.05 ? 0
          : Math.max(-PIT, Math.min(PIT, Math.atan2(_lookP.y - _lookH.y, flat)));
        const k = Math.min(1, dt * 3.5);
        mumLook.y += (wy * w - mumLook.y) * k;
        mumLook.x += (wx * w - mumLook.x) * k;
        mumHead.rotation.y += mumLook.y;
        mumHead.rotation.x -= mumLook.x;
      }
      /* the procedural nod is the FALLBACK only: once the real talking clip
         is in, it animates the head itself and adding this on top doubles
         the motion into a twitch. */
      if (mumHead && mumTalk > 0 && mother.visible && !mumActs) {
        mumHead.rotation.x += (Math.sin(t * 8.3) * 0.05 + Math.sin(t * 12.7) * 0.022) * mumTalk;
        mumHead.rotation.y += Math.sin(t * 3.1) * 0.05 * mumTalk;
      }
      fan.rotation.y += dt * 2.1 * fanSpeed;

      // the curtain breathes, and a little more when the air does
      const cp = curtain.geometry.attributes.position.array;
      for (let i = 0; i < cp.length; i += 3) {
        const y = curtainBase[i + 1];
        cp[i + 2] = curtainBase[i + 2]
          + Math.sin(t * 1.4 + y * 2.2) * 0.02 * noteStorm
          + Math.sin(t * 0.6 + y) * 0.012 * noteStorm;
      }
      curtain.geometry.attributes.position.needsUpdate = true;

      // motes, turning over in the bars of light
      for (let i = 0; i < motes.length; i++) {
        const f = motes[i];
        f.y += dt * f.rise * noteStorm;
        if (f.y > 2.2) { f.y = 0.25; f.x = WIN.x + (Math.random() - 0.5) * 1.5; }
        _m4.makeRotationY(t * 0.6 + f.ph);
        _m4.setPosition(f.x + Math.sin(t * 0.5 + f.ph) * 0.09, f.y,
                        f.z + Math.cos(t * 0.4 + f.ph) * 0.07);
        flying.setMatrixAt(i, _m4);
      }
      flying.instanceMatrix.needsUpdate = true;
    }

    function updateFire(t) {
      /* The corridor batten is not a light, it is what the hall light looks
         like it comes from — so it is driven off that light rather than
         animated, and it is right in every scene without any scene saying
         so. Outside the cine guard on purpose: cutscenes are exactly when
         the hall light moves. */
      hallTube.material.color.setScalar(Math.min(0.92, 0.06 + hallLight.intensity * 0.24));
      // an electric candle does not flicker like a flame; it wavers, barely
      const fl = 0.88 + Math.sin(t * 2.3) * 0.07 + Math.sin(t * 7.1) * 0.03;
      if (getState() !== 'cine') {
        fireLight.intensity = 3.4 * fl;
        candleTip.material.color.setHSL(0.045, 1, 0.42 + fl * 0.1);
      }
    }

    function updateSlow(sdt, t) {
      const p = dust.geometry.attributes.position.array;
      for (let i = 0; i < DUST_N; i++) {
        p[i * 3 + 1] += sdt * (0.012 + (dustSeed[i] % 1) * 0.02) * noteStorm;
        p[i * 3] += Math.sin(t * 0.3 + dustSeed[i]) * sdt * 0.02;
        if (p[i * 3 + 1] > 2.45) {
          p[i * 3 + 1] = 0.15;
          p[i * 3] = (Math.random() - 0.5) * R.x * 1.9;
          p[i * 3 + 2] = (Math.random() - 0.5) * R.z * 1.9;
        }
      }
      dust.geometry.attributes.position.needsUpdate = true;
    }

    /* ------------------------------------------------------ cutscene state */
    function snap() {
      return {
        doorRot: door.rotation.y, fanSpeed, storm: noteStorm,
        hall: hallLight.intensity, street: street.intensity,
        candle: fireLight.intensity,
        blanketPos: blanket.position.clone(), blanketRot: blanket.rotation.x,
        mattressY: mattress.position.y, hero: heroNote.visible,
        // scene B walks her in and out; skipping it mid-stride must not
        // leave her standing in the bedroom for the rest of the night
        mumPos: mother.position.clone(), mumRot: mother.rotation.y,
        mumVis: mother.visible
      };
    }
    function restore(s) {
      door.rotation.y = s.doorRot;
      fanSpeed = s.fanSpeed; noteStorm = s.storm;
      hallLight.intensity = s.hall;
      street.intensity = s.street;
      fireLight.intensity = s.candle;
      blanket.position.copy(s.blanketPos); blanket.rotation.x = s.blanketRot;
      mattress.position.y = s.mattressY;
      heroNote.visible = s.hero;
      mother.position.copy(s.mumPos);
      mother.rotation.y = s.mumRot;
      mother.visible = s.mumVis;
      mumTalk = 0;
      mother.rotation.z = 0; mother.position.y = 0;
      mumPlay('idle');
    }

    // taken before a frame has run, so a restart gets the pristine values
    // however many times you go round
    const REST = {
      doorRot: door.rotation.y,
      street: street.intensity,
      blanketPos: blanket.position.clone(),
      mattressY: mattress.position.y
    };
    function reset() {
      door.rotation.y = REST.doorRot;
      street.intensity = REST.street;
      blanket.position.copy(REST.blanketPos);
      blanket.rotation.x = 0;
      mattress.position.y = REST.mattressY;
      hallLight.intensity = 0;
      fanSpeed = 1;
      noteStorm = 1;
      heroNote.visible = true;
      mother.position.set(MUM.x, 0, MUM.z);
      mother.rotation.y = Math.PI;
      mother.visible = false;
      mumTalk = 0;
      mother.rotation.z = 0; mother.position.y = 0;
      mumPlay('idle');
    }

    /* ------------------------------------------------------------ collision
       The room stops you by being a room: every wall is a box of matWall,
       and so are the pieces around the window and the door. The furniture
       you would walk through is added by hand — a bed and a wardrobe are
       solid, and there is not enough floor in here to be sloppy about it. */
    function blockers() {
      const out = [];
      const box = o => {
        o.updateWorldMatrix(true, false);
        const b = new THREE.Box3().setFromObject(o);
        b.expandByScalar(0.22);
        out.push(b);
      };
      for (const w of walls) box(w);
      box(frame); box(wardBody); box(deskTop); box(seat);
      return out;
    }

    /* ------------------------------------------------------------ teardown
       Advancing a chapter is dispose() then build(), never a page reload.
       This gives the GPU back everything build() took — geometries,
       materials, and the textures hanging off them, which removing objects
       from the scene does NOT free. Copied from chapter 1 deliberately:
       leaktest builds and disposes many times over and watches
       renderer.info, and the discipline is the only thing that passes it. */
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
      // the procedural sources, which no mesh points at directly
      for (const t of [cTex.map, cTex.rough, wallMap, lacquerTex, noteTex,
                       floorTex, dotTex]) t?.dispose?.();
      world.clear();
      S = null;
    }

    return (S = {
      world, noteTex, blockers: blockers(),
      ready: () => hdbReady,
      pile: {
        pos: PILE_POS, radius: INTERACT_R, group: gap,
        dist: pileDist, screen: pileScreen, inView: pileInView,
        hits: pointerHitsPile, interact: interactPile,
        glow: () => gapRing.material.opacity
      },

      /* The props the scenes borrow. The first row is the contract's own
         names — chapter 1 called them drum, ash, smoke and embers; here
         they are the door, the candle tip and the dust — and the second is
         this chapter's own cast.                                          */
      drum: door, ash: candleTip, embers, heroNote, smoke, flying,
      jossTips, fireLight,
      bed, mattress, blanket, pillow, gap, gapDark, wardrobe, wardDoorL,
      desk, chair, door, doorLeaf, curtain, fan, altar, candleTip,
      street, hallLight, hallTube, dust, mother,
      DOOR, BED, GAP, R, WIN, DOOR_AJAR, DOOR_OPEN, HALL, MUM,
      get fanSpeed() { return fanSpeed; },
      set fanSpeed(v) { fanSpeed = v; },
      get noteStorm() { return noteStorm; },
      set noteStorm(v) { noteStorm = v; },

      get mumTalk() { return mumTalk; },
      set mumTalk(v) { mumTalk = v; },
      mumPlay,
      updateNotes, updatePile, updateFire, updateSlow,
      setNoteTexture(tex) {
        if (!tex) return;
        noteMat.map = tex;
        noteMat.color.setScalar(1.75);
        noteMat.emissive.setScalar(0.20);
        noteMat.emissiveMap = tex;
        noteMat.needsUpdate = true;
      },
      snap, restore, reset, dispose
    });
  }

  /* ---------------------------------------------------------- textures ----
     Two the engine does not carry, because only this chapter is a room.   */

  // Terrazzo: the speckled floor every flat of this age has.
  function makeTerrazzo(cnv) {
    const s = 256, [c, ctx] = cnv(s);
    ctx.fillStyle = '#6f7178'; ctx.fillRect(0, 0, s, s);
    const chips = ['#9aa0a6', '#c9c4bb', '#4e5157', '#b8ada0', '#7d8a94'];
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

  // the interact mark, the same exclamation chapter 1 floats over its heap
  function makeMark(cnv) {
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

  /* Both of the above hand their canvas here rather than reaching for THREE
     themselves: build() has it from ctx, this scope does not. The reference
     is set on the first build and the makers are only ever called from
     inside one.                                                            */
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
  /* Written in the engine's cutscene language. Every TRACK is a description
     of where things ARE at time t — never a nudge — because the engine
     re-derives them from absolute values each frame, which is the only
     reason skipping and seeking work at all (see LEARNINGS).

     Where the camera lives in this room, in one place, so five scenes agree:  */
  const EYE = 1.62;                              // standing
  const PILLOW = { x: -1.22, y: 0.72, z: -1.20 };  // lying, head on the pillow
  const MIDROOM = { x: 0.45, y: EYE, z: 0.55 };
  const BEDSIDE = { x: -0.42, y: EYE, z: -0.20 };  // stood over the gap
  const DOORWAY = { x: 1.05, y: EYE, z: 1.85 };

  /* --------------------------------------------------------- THE OPENING --
     Runs before the chapter card, on a screen that is already black. It is
     the first thing anyone sees of chapter 2, and it has one job: put you in
     the bed, in this room, on this night, and make the gap the last thing
     you are looking at.

     Roughly: the ceiling, the room, the crying, the door, the silence, the
     thing in the gap. It ends on black and KEEPS it, so the chapter card
     comes up over the dark rather than over the room.                     */
  function intro(c, s, api) {
    const { tr, step, sfx, fade, camTo, yawTo, pitchTo, faceFrom, rawK, smoothK,
            stage, ghost, ghostOpacity, ghostLight, handsRoot, armR } = api;

    /* WHERE THE HEAD TURNS TO, derived rather than dialled in — and this is
       a fix, not a tidy-up. Until v4.6 the two turns below were hand-written
       angles with the wrong sign: at "the door, ajar" the door was 160°
       BEHIND the camera, and at "something moves in the gap" she faded in
       144° off screen, so the film's own climax played to a wardrobe. Both
       are now `faceFrom`, the same helper every choice scene uses, measured
       from the pillow he is lying on.                                     */
    const TO_DOOR = faceFrom(PILLOW.x, PILLOW.z, stage.DOOR.x, stage.R.z);
    const TO_GAP = faceFrom(PILLOW.x, PILLOW.z, stage.GAP.x, stage.BED.z - 0.20);

    // he is in bed, on his back. The hands have no business in this shot.
    step(0, () => {
      armR.visible = false;
      stage.fanSpeed = 1;
      stage.hallLight.intensity = 0;
      ghostOpacity(0);
      ghost.position.set(stage.GAP.x, 0, stage.BED.z - 0.35);
      ghost.rotation.y = Math.PI / 2;
    });

    // 0–3  black, and a clock somewhere in the flat
    sfx(0.35, 'clock', 0.8);
    sfx(0.9, 'v2wake1');                   // "It followed me home."
    camTo(0, 0.1, PILLOW, PILLOW);
    pitchTo(0, 0.1, 0.95, 0.95);           // flat on his back, looking up
    yawTo(0, 0.1, 0, 0);

    // 3–7  fade up on the ceiling. The fan turns, and that is the whole shot.
    fade(2.6, 5.2, 1, 0);
    sfx(3.0, 'fan', 0.7);
    tr(3.0, 9.0, (k, t2) => {
      handsRoot.position.set(0, Math.sin(t2 * 0.7) * 0.006, 0);
    }, rawK);

    // 7–12  the head rolls right: the room, laid out in bars of streetlight
    pitchTo(6.4, 10.4, 0.95, -0.05, smoothK);
    yawTo(6.4, 10.4, 0, -0.62, smoothK);
    sfx(7.6, 'breath', 0.5);

    // 10–15  and somewhere in the flat, a woman is crying. Not outside.
    sfx(10.2, 'sobbing', 0.75);
    sfx(10.4, 'dread', 0.45);
    yawTo(11.0, 14.2, -0.62, TO_DOOR, smoothK);   // he turns toward the sound
    pitchTo(11.0, 14.2, -0.05, 0.04, smoothK);

    // 14–18  the door, ajar, and nothing beyond it
    camTo(13.6, 17.0, PILLOW, { x: PILLOW.x + 0.10, y: PILLOW.y + 0.05, z: PILLOW.z + 0.06 });
    tr(15.0, 17.4, k => { stage.door.rotation.y = stage.DOOR_AJAR - 0.10 * k; });
    sfx(15.2, 'doorcreak', 0.55);

    // 18–22  the crying stops. The fan slows. The candle gives up.
    step(17.8, () => { stage.fanSpeed = 1; });
    tr(17.8, 21.4, k => {
      stage.fanSpeed = 1 - 0.72 * k;
      stage.fireLight.intensity = 3.4 * (1 - 0.72 * k);
      stage.candleTip.material.color.setHSL(0.045, 1, 0.5 - 0.28 * k);
    }, rawK);
    sfx(18.0, 'strings', 0.55);

    // 22–25  "...Ma?" — and nothing answers
    sfx(21.6, 'v2wake2', 0.95);
    tr(22.0, 25.0, () => {}, rawK);               // a held beat with nothing in it

    // 25–29  something moves in the gap. It is not seen. It is heard.
    sfx(24.9, 'bedcreak', 0.8);
    yawTo(24.9, 27.4, TO_DOOR, TO_GAP, smoothK);  // he looks left, at the gap
    pitchTo(24.9, 27.4, 0.04, -0.36, smoothK);
    camTo(24.9, 27.4, { x: PILLOW.x + 0.10, y: PILLOW.y + 0.05, z: PILLOW.z + 0.06 },
                      { x: PILLOW.x + 0.16, y: PILLOW.y + 0.10, z: PILLOW.z + 0.02 });
    sfx(26.2, 'boom');
    sfx(26.4, 'whisper', 0.4);
    // her, barely: an inch of her in the slot, and the light on her is wrong
    step(26.6, () => {
      ghost.position.set(stage.GAP.x - 0.02, 0, stage.BED.z - 0.20);
      ghost.rotation.y = Math.PI / 2;
    });
    tr(26.6, 28.6, k => {
      ghostOpacity(k * 0.34);
      ghostLight.intensity = 0.5 * k;
    }, rawK);

    // 28–33  "There's someone in the room." Then the dark takes it.
    sfx(28.2, 'v2wake3', 1);
    fade(29.6, 32.6, 0, 1);
    sfx(30.4, 'heart', 0.5);

    step(32.6, () => { armR.visible = true; });
    c.keep.ghostGone = true;      // she is not standing there when play starts
    c.endFade = 1;
    c.keepFade = true;            // the chapter card comes up over this black
  }

  /* ------------------------------------------------- A · LOOK BEHIND THE BED
     The worst answer, and the bravest, which is the teaching. He takes the
     edge of the mattress and puts his face over the slot, and the slot has
     been waiting for exactly that.                                        */
  function scLook(c, s, api) {
    const { tr, step, sfx, fade, camTo, yawTo, pitchTo, faceFrom, rawK, smoothK,
            stage, camera, ghost, ghostOpacity, ghostLight,
            handsRoot, armR } = api;
    const P = { x: BEDSIDE.x, y: EYE, z: BEDSIDE.z };
    const GAPW = { x: stage.GAP.x, z: stage.BED.z - 0.10 };

    camTo(0, 1.0, { x: s.yawPos.x, y: s.yawPos.y, z: s.yawPos.z }, P);
    yawTo(0, 1.0, s.yawRot, faceFrom(P.x, P.z, GAPW.x, GAPW.z));
    pitchTo(0, 1.0, s.pitchX, -0.30);
    step(0, () => { ghostOpacity(0); });

    // the hand goes down onto the mattress, and he leans out over the gap
    tr(1.2, 3.2, k => {
      handsRoot.position.set(-0.10 * k, 0.12 * k, -0.05 * k);
      armR.rotation.set(0.50 - 0.34 * k, 0.28 - 0.20 * k, -0.48 + 0.22 * k);
    });
    camTo(1.2, 3.4, P, { x: P.x - 0.52, y: 1.02, z: P.z - 0.06 });
    pitchTo(1.2, 3.4, -0.30, -0.86);
    sfx(1.3, 'bedcreak', 0.7);
    sfx(2.0, 'breath', 0.7);

    // she is IN the slot, face up, and she was there before he looked
    step(3.3, () => {
      ghost.position.set(stage.GAP.x - 0.03, 0, stage.BED.z - 0.05);
      ghost.rotation.y = Math.PI / 2;
    });
    tr(3.35, 3.9, k => { ghostOpacity(k); ghostLight.intensity = 2.2 * k; }, rawK);
    sfx(3.5, 'strings', 0.9);
    sfx(3.85, 'boom');
    sfx(4.0, 'vgasp');
    sfx(4.35, 'gscream', 0.9);

    // he goes backwards, and the room tilts with him
    camTo(4.0, 5.2, { x: P.x - 0.52, y: 1.02, z: P.z - 0.06 },
                    { x: P.x + 0.34, y: 1.50, z: P.z + 0.55 }, rawK);
    pitchTo(4.0, 5.2, -0.86, -0.14, rawK);
    tr(4.0, 6.2, k => { camera.rotation.z = 0.16 * Math.sin(k * Math.PI * 1.5); }, rawK);
    tr(4.0, 6.4, k => { stage.noteStorm = 1 + 5 * Math.sin(Math.PI * k); }, rawK);
    sfx(4.6, 'scream');
    sfx(5.4, 'dread', 0.7);
    fade(5.4, 7.0, 0, 1);
    sfx(6.0, 'boom');

    c.endFade = 1;
  }

  /* ----------------------------------------------------- B · CALL FOR MOTHER
     The best answer, and it is made of a long nothing. He shouts, and for
     four seconds the room does not care. Then a door down the hall, slippers
     on terrazzo, and the light arrives before she does.

     And then SHE arrives, which she did not use to. Until v4.6 this scene
     opened the door by rotating it toward SHUT, the room went warm because a
     point light does not care about a closed leaf, and the best answer in the
     chapter was a door closing in your face with a voice behind it. Now the
     door opens the way that door opens, she is in it, she comes in, she says
     her line to your face, and she goes out and shuts it behind her — which
     is Chad's ask, and also the teaching: you called across the edge of what
     you could handle, and somebody came.                                  */
  function scCall(c, s, api) {
    const { tr, step, sfx, camTo, yawTo, pitchTo, faceFrom, rawK, smoothK,
            stage, ghostOpacity, ghostLight, vmHemi, vmKey } = api;
    const P = { x: MIDROOM.x, y: EYE, z: MIDROOM.z };
    const doorAt = { x: stage.DOOR.x, z: stage.R.z };
    const mum = stage.mother;
    // where she stands: out in the corridor, then just inside the door
    const OUT = { x: stage.MUM.x, z: stage.MUM.z };
    const IN = { x: 1.10, z: 1.94 };
    const BACKOUT = { x: 1.42, z: 3.04 };        // clear of the closing leaf
    const mumAt = (x, z) => { mum.position.x = x; mum.position.z = z; };

    camTo(0, 0.9, { x: s.yawPos.x, y: s.yawPos.y, z: s.yawPos.z }, P);
    yawTo(0, 0.9, s.yawRot, faceFrom(P.x, P.z, doorAt.x, doorAt.z));
    pitchTo(0, 0.9, s.pitchX, -0.02);
    step(0, () => {
      ghostOpacity(0);
      mum.visible = false;
      mum.rotation.y = Math.PI;          // she faces the room the whole time
      mumAt(OUT.x, OUT.z);
    });

    // the shout
    sfx(1.0, 'v2call', 1);               // 4.7 s of it, and nothing under it
    tr(1.0, 1.5, k => { stage.noteStorm = 1 + 2 * Math.sin(Math.PI * k); }, rawK);

    /* And then nothing, for four seconds, which is the longest thing in this
       chapter. The camera does not cut and does not move; only the fan is
       still going round.                                                  */
    sfx(1.6, 'clock', 0.55);
    tr(1.5, 5.6, () => {}, rawK);
    sfx(3.2, 'breath', 0.6);

    // her own door, down the hall. Then slippers on terrazzo, coming.
    sfx(5.8, 'doorcreak', 0.6);
    sfx(6.4, 'hallsteps', 0.85);
    tr(6.4, 8.6, k => { stage.hallLight.intensity = 3.4 * k; }, rawK);

    /* The door swings OPEN — outward, into the corridor, the way it is hung —
       and she is standing in it before it has finished. The warm rectangle
       arrives first and she is a silhouette in it, which is what a doorway at
       night does to anybody standing in one.                              */
    tr(7.6, 9.0, k => {
      stage.door.rotation.y = stage.DOOR_AJAR + (stage.DOOR_OPEN - stage.DOOR_AJAR) * k;
    }, smoothK);
    step(7.9, () => { mum.visible = true; mumAt(OUT.x, OUT.z); });
    /* in, over four unhurried steps, and she stops an arm's length away.
       v5.02: those are now REAL steps. The glide covers 0.96 m in 1.8 s
       (0.53 m/s) and the clip's own take walks at 0.48 m/s, so her feet
       land within a tenth of the ground they cover and nothing skates.
       The group-level bob that used to fake this is GONE — the clip's hips
       carry it, and running both read as a limp.                       */
    step(8.2, () => { stage.mumPlay('walkstart', 1, 0.22); });
    /* and she STOPS, on the take that exists for stopping. Snapping from
       mid-stride to a standing idle is the thing that read as unnatural:
       the legs were still swinging and then they simply were not. The
       glide is one eased span, so it decelerates under the stop take. */
    step(9.5, () => { stage.mumPlay('walkstop', 1, 0.3); });
    tr(8.2, 10.2, k => {
      mumAt(OUT.x + (IN.x - OUT.x) * k, OUT.z + (IN.z - OUT.z) * k);
    }, smoothK);
    // the hall light reaches the hands too, because it reaches everything
    tr(7.6, 9.6, k => {
      vmHemi.intensity = 0.55 + 0.5 * k;
      vmKey.intensity = 0.50 + 0.4 * k;
    }, rawK);
    sfx(8.6, 'chime', 0.5);

    // and the cold goes out of the room with the dark
    tr(7.8, 10.4, k => {
      ghostOpacity(0);
      ghostLight.intensity = 0;
      stage.fireLight.intensity = 3.4 * (1 + 0.5 * k);
    }, rawK);

    step(10.6, () => { stage.mumPlay('idle', 1, 0.5); });   // settled, breathing
    // "What is it? Go back to sleep." — said to his face, five seconds of it
    sfx(10.6, 'v2ma', 0.95);
    /* v4.8 nodded her head procedurally; v5.02 gives her the real talking
       take, which moves her shoulders and hands too. mumTalk stays set so
       that a session where the clips never downloaded still gets the nod. */
    step(10.9, () => { stage.mumPlay('talk', 1, 0.45); });
    tr(10.5, 15.6, (k) => {
      stage.mumTalk = k < 0.08 ? k / 0.08 : (k > 0.92 ? (1 - k) / 0.08 : 1);
    }, rawK);
    step(10.2, () => { mum.position.y = 0; mum.rotation.z = 0; });

    /* She goes out backwards, which is what anybody does when they are still
       looking at you and reaching for the handle — and it keeps her face on
       screen instead of her back. */
    /* Backing out is the one move Mixamo has no take for. A walk run in
       REVERSE is one, though: `walkstop` is a walk settling to a halt, so
       played backwards it is a stand breaking into a backwards walk —
       exactly her, reaching for the handle without looking away.        */
    step(11.6, () => { stage.mumPlay('walkstop', -1, 0.3); });
    tr(11.6, 13.6, k => {
      mumAt(IN.x + (BACKOUT.x - IN.x) * k, IN.z + (BACKOUT.z - IN.z) * k);
    }, smoothK);
    sfx(13.0, 'hallsteps', 0.45);

    /* And she shuts it. The leaf swings back across her as it comes, so she
       is gone behind it before it lands — which is why she is hidden a beat
       AFTER the latch and not before it.                                  */
    tr(13.6, 15.2, k => {
      stage.door.rotation.y = stage.DOOR_OPEN * (1 - k);   // all the way to the latch
    }, smoothK);
    sfx(13.7, 'doorcreak', 0.7);
    sfx(15.1, 'clang', 0.35);
    step(15.3, () => { mum.visible = false; });
    // a line of light under a shut door, and the room is his again
    tr(14.6, 16.4, k => { stage.hallLight.intensity = 3.4 - 2.85 * k; }, rawK);

    // he looks at the gap once more. It is a gap.
    yawTo(15.6, 17.0, faceFrom(P.x, P.z, doorAt.x, doorAt.z),
                      faceFrom(P.x, P.z, stage.GAP.x, stage.BED.z));
    pitchTo(15.6, 17.0, -0.02, -0.26);
    sfx(16.2, 'vrelief', 0.9);           // starts after v2ma has finished, at 15.6
    tr(17.0, 19.7, () => {}, rawK);      // and the scene outlasts it: it runs to 19.5

    c.keep.ghostGone = true;
    c.endFade = 0;                       // this one does NOT end on black
  }

  /* ------------------------------------------------------ C · LEAVE THE ROOM
     Distance, taken calmly. Out the far side, three steps, the corridor. And
     at the threshold he turns back, and the room is perfectly ordinary —
     until the door closes itself.

     That is what it always said it did. What it did until v4.6 was push the
     door toward SHUT as he walked into it, step through into a 2.6 m square
     of nothing, and turn to face a blank wall for the last four seconds
     while the door swung closed behind his head, off camera. Three fixes,
     all of them geography: the door opens outward now, there is a corridor
     to come out into, and the turn is a turn BACK — so the shot the writing
     always described is the shot that plays.

     The standing spot matters and is not free: it is 1.24 m from the hinge,
     which is a clear 38 cm outside the leaf's swing, so the door that closes
     on the room does not close through the camera.                       */
  function scLeave(c, s, api) {
    const { tr, step, sfx, fade, camTo, yawTo, pitchTo, bob, faceFrom, rawK, smoothK,
            stage, ghostOpacity } = api;
    const P = { x: MIDROOM.x, y: EYE, z: MIDROOM.z };
    const doorAt = { x: stage.DOOR.x, z: stage.R.z };
    // out in the corridor, off to the latch side, looking back through the door
    const OUTSIDE = { x: 1.15, y: EYE, z: stage.HALL.z0 + 1.00 };
    const BACK = faceFrom(OUTSIDE.x, OUTSIDE.z, stage.DOOR.x, stage.HALL.z0);

    camTo(0, 0.9, { x: s.yawPos.x, y: s.yawPos.y, z: s.yawPos.z }, P);
    yawTo(0, 0.9, s.yawRot, faceFrom(P.x, P.z, doorAt.x, doorAt.z));
    pitchTo(0, 0.9, s.pitchX, -0.06);
    step(0, () => { ghostOpacity(0); });

    sfx(0.9, 'breath', 0.55);

    // he does not run. Three steps, and the door is right there — and it
    // goes open ahead of him rather than swinging into his face.
    camTo(1.4, 3.6, P, DOORWAY, rawK);
    bob(1.4, 3.6, 2.0, 0.030);
    for (let i = 0; i < 4; i++) sfx(1.6 + i * 0.52, 'step');
    tr(2.2, 3.5, k => {
      stage.door.rotation.y = stage.DOOR_AJAR + (stage.DOOR_OPEN - stage.DOOR_AJAR) * k;
    }, smoothK);
    tr(2.4, 4.6, k => { stage.hallLight.intensity = 1.6 * k; }, rawK);

    // out into the corridor, and at the threshold he turns back
    camTo(3.6, 5.2, DOORWAY, OUTSIDE, rawK);
    bob(3.6, 5.2, 1.9, 0.026);
    yawTo(4.0, 6.0, faceFrom(P.x, P.z, doorAt.x, doorAt.z), BACK, smoothK);
    pitchTo(4.0, 6.0, -0.06, -0.02);
    for (let i = 0; i < 2; i++) sfx(3.9 + i * 0.52, 'step');

    /* The room is ordinary. That is the shot, and now it is actually the
       shot: the bedroom framed in its own doorway, nothing in it, no music,
       the fan going round. Four seconds of it.                           */
    sfx(6.4, 'vrelief', 0.75);
    tr(6.2, 8.6, () => {}, rawK);

    // and then the door swings shut on it, gently, on nothing
    tr(8.6, 10.2, k => {
      stage.door.rotation.y = stage.DOOR_OPEN * (1 - k) - 0.04 * k;
    }, smoothK);
    sfx(8.7, 'doorcreak', 0.7);
    sfx(10.0, 'clang', 0.35);
    sfx(10.2, 'dread', 0.5);
    fade(10.2, 11.8, 0, 1);

    c.keep.ghostGone = true;
    c.endFade = 1;
  }

  /* ------------------------------------------------ D · STAY SILENT & STILL
     Endurance, which is not the same as a solution. He lies back and fixes
     on the fan, and time passes, and nothing is resolved — and beside his
     head the mattress takes someone's weight.                            */
  function scStill(c, s, api) {
    const { tr, step, sfx, fade, camTo, yawTo, pitchTo, rawK, smoothK,
            stage, camera, ghost, ghostOpacity, ghostLight, armR } = api;

    camTo(0, 1.4, { x: s.yawPos.x, y: s.yawPos.y, z: s.yawPos.z }, PILLOW, smoothK);
    yawTo(0, 1.4, s.yawRot, 0, smoothK);
    pitchTo(0, 1.4, s.pitchX, 0.95, smoothK);     // flat on his back
    step(0, () => { ghostOpacity(0); armR.visible = false; });
    sfx(0.6, 'bedcreak', 0.6);
    sfx(1.5, 'breath', 0.8);

    /* Time passing, told by the only two clocks in the room: the fan, and
       the bar of streetlight crawling across the ceiling. */
    sfx(2.0, 'clock', 0.7);
    sfx(2.2, 'fan', 0.55);
    tr(2.0, 9.0, k => {
      stage.street.intensity = REST_STREET * (1 - 0.45 * k);
      stage.street.position.x = stage.WIN.x - 0.6 + 1.9 * k;
    }, rawK);
    sfx(4.4, 'heart', 0.55);
    sfx(6.6, 'whisper', 0.35);

    // and beside his head, the mattress goes down
    sfx(8.6, 'bedcreak', 0.95);
    tr(8.6, 10.0, k => {
      stage.mattress.position.y = 0.44 - 0.035 * k;
      stage.blanket.position.y = 0.55 - 0.030 * k;
    }, smoothK);
    tr(9.0, 10.4, k => { camera.rotation.z = 0.05 * k; }, rawK);
    sfx(9.0, 'boom');
    sfx(9.3, 'gsigh', 0.7);

    // he does not look. The scene simply ends, which is the point of it.
    tr(10.4, 12.2, () => {}, rawK);
    sfx(11.0, 'dread', 0.6);
    fade(11.0, 13.0, 0, 1);
    step(13.0, () => { armR.visible = true; });

    c.endFade = 1;
  }

  // the streetlight's own intensity, read once so scene D can dim from it
  // rather than from a number that would drift if the light were re-tuned
  let REST_STREET = 20;

  (window.__CHAPTERS__ = window.__CHAPTERS__ || {}).ch2 = Object.assign(DATA, {
    build(ctx) {
      _THREE = ctx.THREE;
      const st = build(ctx);
      REST_STREET = st.street.intensity;
      return st;
    },
    intro,
    scenes: [scLook, scCall, scLeave, scStill]
  });
})();
