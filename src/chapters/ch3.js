/* Chapter 3 · The Gathering
   ---------------------------------------------------------------------------
   The night after the bedroom. Down in the car park at the foot of his own
   block, where the seventh-month tentage has been up since Monday: red and
   white canvas on a scaffold frame, fluorescent tubes wired to the poles,
   six rows of red plastic chairs, an altar at the front, and a man on a
   stool who has stopped being himself.

   THE DESIGN, IN ONE LINE. Chapter 1's terror was DISTANCE — she was over
   there, and then she was closer. Chapter 2's was SMALLNESS — a room you
   could cross in four steps and nowhere in it to go. This one's is COMPANY:
   you are standing in a crowd of forty people, she is sitting in row four
   facing the wrong way, and not one of them turns round.

   Everything below serves that. The crowd all faces front. The medium at
   the altar is not the threat and the staging never once says he is — he is
   a competent man doing a job he has done for thirty years, and the whole
   teaching of the best answer is that the frightening thing in this tent is
   not the unfamiliar one.

   Written against the same contract as chapters 1 and 2 and the fixture:
     build(ctx) -> stage        this chapter's world, and the handle the
                                engine drives it through
     intro(c, s, api)           the opening film, run before the chapter card
     scenes[i](c, s, api)       the cutscene for choice i

   The source is Master Z's own: docs/source/trial-game-chapters.md, episode
   one, chapter three. The four choices, their ranking and their teachings are
   his, verbatim. Only the delta MAGNITUDES are rescaled, by the same factor
   chapter 2 used, so one rank formula serves all three.

   docs/V4.1-CHAPTER3-PLAN.md is this build's memory — read it first.       */

(() => {
  'use strict';

  let S = null;

  const DATA = {
    id: 3,
    title: 'The Gathering',

    cardLabel: 'Chapter 3',
    cardTitle: 'The Gathering<br>Nobody Else Turned Round',

    brief: 'The tentage has been up all week in the car park under his block. This morning there is a drum, a crowd on red plastic chairs, and a man at the altar who has stopped being himself. Everyone is watching the front. Nobody is watching row four.',
    prompt: 'The medium has gone into trance at the altar. What do you do?',

    /* Source order — OBSERVE, JOIN, QUESTION, LEAVE — kept as Master Z wrote
       it. Ranked by wisdom that is C best, A good, D bad, B worst; A and D
       are one point apart in the trial and stay close here, because that is
       his judgement and not ours to widen. */
    choices: [
      {
        k: 'A', text: 'Stay at the edge and watch.',
        d: { sanity: 4, awareness: 28, wisdom: 22 },
        verdict: 'good',
        say: 'You stay at the back and let it happen in front of you. Four rows ahead, one chair is facing the wrong way.',
        teach: 'Observation before interpretation strengthens awareness.'
      },
      {
        k: 'B', text: 'Go up and join in.',
        d: { sanity: -22, awareness: 8, wisdom: -16 },
        verdict: 'worst',
        say: 'You go up with the others. The drum is inside your chest, the air goes thin, and someone takes your arm and walks you out of it.',
        teach: 'Participation increases exposure. Do not enter practices you do not yet understand.'
      },
      {
        k: 'C', text: 'Ask the auntie what is happening.',
        d: { sanity: 6, awareness: 22, wisdom: 30 },
        verdict: 'best',
        say: 'She does not laugh at you. She tells you what the man is doing, and what he is not. Then she tells you where not to sit.',
        teach: 'Questioning respectfully is part of discernment. Unusual does not automatically mean supernatural.'
      },
      {
        k: 'D', text: 'Leave while you still can.',
        d: { sanity: 10, awareness: 12, wisdom: 19 },
        verdict: 'bad',
        say: 'You are out and into the car park before the drum stops. It is quieter out here, and that turns out to be worse.',
        teach: 'Leaving can be appropriate when you lack the knowledge to engage safely.'
      }
    ],
    core: 'Look first. Name it after.<br><i>Ehipassiko — the teaching invites you to come and see.</i>',

    /* --- the stage ------------------------------------------------------
       The tent runs along z, altar at -z, entrance at +z, and the player
       walks in out of the dark car park exactly as chapter 1 walks in off
       the grass. Interior is x -6..6, z -9..9; eave at 2.9, ridge at 4.3.

       `bounds` is the backstop, wider than anywhere the player should get:
       the chairs and the tables are what actually stop them. It has to
       contain every point this chapter names, which is why maxZ is out in
       the car park where the film starts.                                 */
    spawn:     { x: 0.8, y: 1.62, z: 12.4 },    // out in the dark, facing the tent
    /* `shrine` is the engine's anchor for HER — chapter 1's burner, chapter
       2's gap, and here the MIDDLE OF THE SEATING. Not the altar: putting
       it there would say the ritual is the haunting, which is the exact
       opposite of this chapter's teaching, and would leave the entrance as
       the only ground she could not reach. In the crowd, her radius makes
       the altar pressure and the car park relief — so walking out is real
       relief and walking up to look is a real cost. */
    shrine:    { x: 0.0,  z: -0.9 },            // the middle of the seating
    ghostHome: { x: 2.7,  z: 2.6 },             // the back row, far side
    bounds:    { minX: -8.4, maxX: 8.4, minZ: -8.6, maxZ: 14.0 },

    /* NO HAUNTING. Chad's call at v4.3, and the chapter's thesis now: "it
       should not have the ghost at all, the focus is on the medium event."
       She appears exactly once, in the opening film, far out on the open
       tarmac in full sun, facing the tent — and she does not come in. The
       engine's play machinery (appearances, drain, the banner, her loops,
       the scare reactions) is off wholesale; the film drives her mesh
       directly, which the seam deliberately leaves alone. */
    ghost: null,

    /* MORNING. Chad's call, 31 Aug 2026: "the medium event should be in the
       morning instead of a night scene" — and he is right about the practice
       as well as the shot. A seventh-month tentage ceremony is a daytime
       event; the tang-ki goes into trance under a tent in the sun, with the
       traffic going past and half the block watching in slippers.

       It is also the better horror, which is the part worth writing down.
       Chapters 1 and 2 hide her in the dark because that is what the dark is
       for. There is nowhere to hide at ten in the morning: she is simply
       sitting in row four in broad daylight, in front of forty people, and
       not one of them turns round. Take the darkness away and the thing that
       is wrong has to be wrong in the open.

       Declared, not hard-coded, because the sky is the engine's — the tenth
       leak, fixed the same way as the other nine. Chapters 1 and 2 declare
       nothing and stay at midnight. */
    daylight: {
      // a hazy tropical morning: white at the horizon, thin blue overhead
      stops: [[0.00, '#d8dcd6'], [0.18, '#c3cfd4'], [0.45, '#a2bcd2'],
              [0.74, '#7fa5c9'], [1.00, '#6b95c4']],
      bg: 0xb9c6cc,
      fog: [0xc2cdd0, 0.0085],       // thinner than the night's, and pale
      hemi: [0xcfe0f2, 0x8a8272, 1.15],
      key: [0xfff2df, 1.85, 16, 26, 12],   // the sun, and it is already up
      fill: [0xa8bed8, 0.34],
      stars: 0, moon: 0,
      sun: 1, clouds: 0.6,
      /* the hands live under their own little rig, and until v4.3 it was
         hard-coded to midnight — which is why they read near-black against
         this chapter's bright sky. Neutral warm daylight, roughly doubled. */
      vmHemi: [0xdfe9f5, 0x8f8878, 1.10],
      vmKey: [0xfff2df, 0.85]
    },

    /* hdb is the block itself, standing over the car park — the third use of
       one already-downloaded file, and the thing that makes chapter 1's void
       deck, chapter 2's bedroom and this car park one place. hellnote is the
       note, which is on the altar table tonight where it should have been
       all along. */
    assets: ['hdb', 'hellnote', 'seat', 'cars', 'guangong', 'encik'],
    noteArt: 'hellnote',

    /* The tent's own sound, in FOUR beds since v4.3 — and the loudest is
       the point. Chad asked for "a constant tangki/medium taoist ceremonial
       music ongoing throughout the event", and `ceremony` is that: a
       thirty-second ensemble loop — dagu drum, gong cycle, cymbals, suona —
       under the whole chapter. `tentamb` stays the place (canvas, traffic),
       `crowdmur` is the forty people in it, `ritual` the priest's chant
       keeping time underneath. Scenes duck them as one band.

       No `atShrine` — the warm light in this chapter is the altar's. */
    ambience: { beds: [['tentamb', 0.30], ['crowdmur', 0.26],
                       ['ritual', 0.26], ['ceremony', 0.78],
                       /* v4.5, all Chad's asks: the ritual horns and the
                          qiang-qiang cymbals as their own looping layers,
                          and an audience that gasps, wows and softly
                          cheers at the performance */
                       ['hornloop', 0.30], ['cymloop', 0.26],
                       ['crowdreact', 0.30]],
                atShrine: null },
    /* the engine's explore music is the void deck's dark wash — someone
       else's soundtrack here. OFF for this chapter: the tang-ki band above
       IS the chapter's music (Chad: "That music should be the focus"). */
    musicVol: 0,
    voiceLine: 'v3play',   // "I feel better here... but why?" — a few seconds in

    /* The words that name the thing you can act on. Chapter 1's are about a
       heap of hell notes, chapter 2's about a slot of dark; these are about
       the front of a tent you have to walk up an aisle to see properly. */
    words: {
      approach: 'The whole tent is watching the front...',
      act: 'E at the altar',
      actTouch: 'tap the altar',
      interact: 'Watch the ritual at the altar',
      interactTouch: 'the altar'
    },
    lines: { near: 'v3near', close: 'v3altar', nearAt: 8.5 },
    sayPrefix: 'v3'
    /* No `voiceLine`: the opening film gives him four lines, and a fifth the
       moment the black lifts would be crowding them — chapter 2's reasoning,
       and it holds twice as hard for a film this long. */
  };

  /* ====================================================================== */
  /* THE WORLD                                                              */
  /* ====================================================================== */

  function build(ctx) {
    const { THREE, GLTFLoader, scene, camera, yaw, LOW,
            assetBytes, rescueTextures, redoShadows,
            cnv, makeSoftDot, makeGround, makeConcrete, makeLacquer,
            makeHellNote, getState, startDecision } = ctx;

    /* SHRINE is her anchor — the middle of the seating. The ALTAR is a
       different thing entirely, nine metres away at the front, and keeping
       them apart is the whole point (see the note in DATA). */
    const SHRINE = new THREE.Vector3(DATA.shrine.x, 0, DATA.shrine.z);
    const ALTAR = { x: 0, z: -7.4 };
    const MEDIUM = { x: 0, z: -5.6 };
    const BRAZ = { x: 5.2, z: -4.6 };
    const PAPER = { x: 5.0, z: -1.0 };

    /* v4.7: the bought models' orientation corrections, tuned by eye from
       screenshots — a bought file's forward axis is a fact about its
       exporter, not about this tent. */
    const SEAT_YAW = 0;               // the file already faces -z at identity
    const GG_YAW = 0;                 // Guan Gong faces the crowd
    const ENCIK_YAW = 0;              // he faces +z at identity, like figure()
    const ENCIK_Z = 0.22;             // slid back onto the seat pan

    const owned = [];         // parented to the SCENE, so dispose() needs a list
    let alive = true;         // a GLB landing after dispose() must not build

    /* --------------------------------------------------------- the tent */
    const T = { x: 6.0, z: 9.0, eave: 2.9, ridge: 4.3, pole: 0.055 };

    // the seating, laid out once and read by everything that needs it
    /* FOUR rows since v4.5 (Chad: down from six, with more space between
       them "so it is easier to walk through"). The pitch is 2.0 m against
       chair blockers 1.2 m deep, which leaves an 0.8 m walkway between any
       two rows — the engine collides a POINT, so that is a generous lane.
       Everything below (chairs, blockers, crowd fill, the odd chair's
       index) derives from this array and moves with it. */
    const ROW_Z = [-4.4, -2.4, -0.4, 1.6];
    const COL_X = [-3.6, -2.7, -1.8, -0.9, 0.9, 1.8, 2.7, 3.6];
    const ODD = { row: 3, col: 2 };     // row four — now also the back row
    const BACK = { row: 3, col: 5 };    // the far side of that same back row

    /* ------------------------------------------------------------ textures */
    const gTex = makeGround();
    const cTex = makeConcrete();
    const lacquerTex = makeLacquer();
    const noteTex = makeHellNote();
    const dotTex = makeSoftDot('rgba(255,236,206,0.9)', 'rgba(255,236,206,0)');
    const canvasTex = makeStripe(cnv);
    const floralTex = makeFloral(cnv);
    const goldTex = makeGoldPaper(cnv);

    /* CONCRETE, not chapter 1's ground texture. That map is 38-72 out of
       255 — it was built for a void deck at midnight, and no amount of
       tinting makes a 0.2 albedo look like a car park at ten in the morning.
       Concrete's base is 112-158 and this is a multi-storey deck anyway.
       Cloned so the repeat can be its own, and disposed in dispose() for the
       same reason. */
    const parkMap = cTex.map.clone(); parkMap.needsUpdate = true;
    parkMap.repeat.set(30, 30);
    const parkRough = cTex.rough.clone(); parkRough.needsUpdate = true;
    parkRough.repeat.set(30, 30);
    const matTarmac = new THREE.MeshStandardMaterial({
      map: parkMap, roughnessMap: parkRough, roughness: 0.95, metalness: 0.01,
      color: 0x9c9a94 });
    const matKerb = new THREE.MeshStandardMaterial({
      map: cTex.map, roughnessMap: cTex.rough, roughness: 0.95, metalness: 0 });
    /* Slightly emissive, and that is the whole trick of a tent in daylight:
       canvas is thin, so its underside is not a shadowed surface — it GLOWS,
       with the sun coming through from the other side. Lit as a plain
       shadowed material the tent reads as a dark box under a bright sky,
       which is exactly what it is not. */
    const matCanvas = new THREE.MeshStandardMaterial({
      map: canvasTex, roughness: 0.95, metalness: 0, side: THREE.DoubleSide,
      emissive: 0xffffff, emissiveMap: canvasTex, emissiveIntensity: 0.22 });
    const matPole = new THREE.MeshStandardMaterial({
      color: 0x9aa1a8, roughness: 0.45, metalness: 0.75 });
    const matPlastic = new THREE.MeshStandardMaterial({
      color: 0xa3211d, roughness: 0.42, metalness: 0.03 });
    const matChairLeg = new THREE.MeshStandardMaterial({
      color: 0x8c9298, roughness: 0.5, metalness: 0.6 });
    const matCloth = new THREE.MeshStandardMaterial({
      color: 0x8c1410, roughness: 0.86, metalness: 0.02 });
    const matGold = new THREE.MeshStandardMaterial({
      color: 0xc79a3d, roughness: 0.32, metalness: 0.9 });
    const matWood = new THREE.MeshStandardMaterial({
      color: 0x3d2a19, roughness: 0.78, metalness: 0.04 });
    const matLacquer = new THREE.MeshStandardMaterial({
      map: lacquerTex, roughness: 0.42, metalness: 0.18 });
    const matMetal = new THREE.MeshStandardMaterial({
      color: 0x3b3f45, roughness: 0.55, metalness: 0.8 });
    const matPaper = new THREE.MeshStandardMaterial({
      map: goldTex, roughness: 0.9, metalness: 0.05 });
    const matFloral = new THREE.MeshStandardMaterial({
      map: floralTex, roughness: 0.86, metalness: 0.02 });
    const matSkin = new THREE.MeshStandardMaterial({
      color: 0x8a6247, roughness: 0.78, metalness: 0 });
    const matHair = new THREE.MeshStandardMaterial({
      color: 0x241c17, roughness: 0.72, metalness: 0.05 });
    const matDark = new THREE.MeshStandardMaterial({
      color: 0x232830, roughness: 0.85, metalness: 0.03 });
    const matSash = new THREE.MeshStandardMaterial({
      color: 0xd0a11c, roughness: 0.6, metalness: 0.12 });
    // the tube's own glass, which is a light source and takes none
    const matTube = new THREE.MeshBasicMaterial({ color: 0xdfe9ff, fog: false });

    const world = new THREE.Group();
    scene.add(world);

    /* ------------------------------------------------------- the car park */
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(220, 220), matTarmac);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    world.add(ground);

    /* Parking lot lines. Four white strokes either side of the tent is the
       cheapest possible way to say "this is a car park and the tent is
       standing where the cars usually are". */
    /* The DIVIDERS between bays, so they run across the bay and repeat along
       it. The first pass had them 4.6 m long and 2.6 m apart down the same
       axis, which overlaps into one continuous stripe — a smear on the
       tarmac rather than a car park. */
    const matLine = new THREE.MeshBasicMaterial({ color: 0xb9b6a8, fog: true });
    const lineGeo = new THREE.PlaneGeometry(4.8, 0.10);
    for (const sx of [-1, 1]) {
      for (let i = 0; i < 7; i++) {
        const l = new THREE.Mesh(lineGeo, matLine);
        l.rotation.x = -Math.PI / 2;
        l.position.set(sx * (T.x + 3.2), 0.012, -6.0 + i * 2.4);
        world.add(l);
      }
    }
    // and a kerb along the far side, because a car park has an edge
    const kerb = new THREE.Mesh(new THREE.BoxGeometry(46, 0.13, 0.30), matKerb);
    kerb.position.set(0, 0.065, 16.5);
    kerb.receiveShadow = true;
    world.add(kerb);

    /* Two cars parked out at the edge of the light — boxes, seen at night
       from twenty metres, which is all they ever have to be. */
    const matCar = new THREE.MeshStandardMaterial({
      color: 0x2b3038, roughness: 0.35, metalness: 0.55 });
    const matWindscreen = new THREE.MeshStandardMaterial({
      color: 0x0d1218, roughness: 0.14, metalness: 0.2 });
    const boxCars = [];
    for (const [cx, cz, ry] of [[-9.6, 3.2, 0.06], [9.9, 6.4, -0.09]]) {
      const car = new THREE.Group();
      car.position.set(cx, 0, cz);
      car.rotation.y = ry;
      const body = new THREE.Mesh(new THREE.BoxGeometry(1.72, 0.62, 4.3), matCar);
      body.position.y = 0.60; body.castShadow = true;
      const cab = new THREE.Mesh(new THREE.BoxGeometry(1.60, 0.52, 2.1), matWindscreen);
      cab.position.set(0, 1.14, -0.15);
      car.add(body, cab);
      world.add(car);
      boxCars.push(car);      // v4.7: hidden when the real cars land
    }

    /* TREES — rain trees at the edge of the car park, because a Singapore
       car park without trees reads as a render, and this one read as empty
       (Chad's note). Built the way the chairs are: one trunk geometry and
       one canopy geometry, instanced — fourteen trees, two draw calls.
       Every spot is hand-picked OUTSIDE the play bounds, clear of the two
       parked cars, and clear of the corridor out to the middle of the car
       park, which the opening film needs empty for a reason.             */
    const TREE_AT = [
      [-13, -2], [-16, 6], [-14, 14], [-19, 22], [-12, 30],
      [13, 0], [16, 9], [14, 18], [19, 27], [12.5, 36],
      [-4, 40], [6, 44], [-9, 38], [16, 44]
    ];
    const trunkGeo = new THREE.CylinderGeometry(0.13, 0.22, 1, 7);
    const leafGeo = new THREE.IcosahedronGeometry(1, 1);
    const matTrunk = new THREE.MeshStandardMaterial({
      color: 0x6a563f, roughness: 0.95, metalness: 0 });
    const matLeaf = new THREE.MeshStandardMaterial({
      color: 0xffffff, roughness: 0.92, metalness: 0, flatShading: true });
    const trunkIM = new THREE.InstancedMesh(trunkGeo, matTrunk, TREE_AT.length);
    const leafIM = new THREE.InstancedMesh(leafGeo, matLeaf, TREE_AT.length * 3);
    {
      const m4 = new THREE.Matrix4(), q0 = new THREE.Quaternion(),
            sv = new THREE.Vector3(), pv = new THREE.Vector3();
      const GREENS = [0x5f7f4b, 0x546f45, 0x6a8a55].map(c => new THREE.Color(c));
      const PUFF = [[0, 0], [0.9, 0.5], [-0.8, 0.6]];
      TREE_AT.forEach(([tx, tz], i) => {
        const h = 2.6 + ((i * 37) % 10) * 0.11;        // 2.6-3.7 m, deterministic
        m4.compose(pv.set(tx, h / 2, tz), q0, sv.set(1, h, 1));
        trunkIM.setMatrixAt(i, m4);
        for (let b = 0; b < 3; b++) {
          const r = 1.5 + ((i * 7 + b * 13) % 9) * 0.13;
          m4.compose(pv.set(tx + PUFF[b][0], h + 0.55 + b * 0.28, tz + PUFF[b][1]),
                     q0, sv.set(r * 1.25, r * 0.8, r * 1.25));
          leafIM.setMatrixAt(i * 3 + b, m4);
          leafIM.setColorAt(i * 3 + b, GREENS[(i + b) % 3]);
        }
      });
      trunkIM.instanceMatrix.needsUpdate = true;
      leafIM.instanceMatrix.needsUpdate = true;
      if (leafIM.instanceColor) leafIM.instanceColor.needsUpdate = true;
    }
    world.add(trunkIM, leafIM);

    /* ------------------------------------------------------------ the block
       The same model chapter 1 stands under and chapter 2 sees through a
       window, put behind the altar end so the tent has something to be
       small underneath. Its ground floor stays solid this time — the player
       can never get within nine metres of it, and a painted void deck at
       that range, at night, past an altar, reads perfectly. */
    let hdbReady = false;
    assetBytes('hdb').then(BUF => new GLTFLoader().parse(BUF, '', (gltf) => {
      if (!alive) return;                  // disposed while the bytes flew
      rescueTextures(gltf, BUF);
      const blk = gltf.scene;
      blk.scale.setScalar(0.001);          // the model is in millimetres
      blk.position.set(-1.7, 0, -15.8);    // face at about z = -11.5, off centre
      blk.traverse(o => {
        if (!o.isMesh) return;
        o.castShadow = false;              // nothing up there lights this tent
        o.receiveShadow = false;
        const mats = Array.isArray(o.material) ? o.material : [o.material];
        for (const m of mats) {
          m.roughness = 0.94; m.metalness = 0;
          /* And DARK. The model's own textures are daylight-bright, and at
             twenty-five metres under the engine's moon the block was reading
             as a lit shopping mall behind the altar instead of the black
             cliff the whole shot is composed against. */
          /* Knocked back, not blacked out: the model is textured bright and
             a touch garish, and it stands twelve metres behind the altar in
             most of this chapter's shots. At 0.34 — the value the night
             version needed — it was a silhouette; a morning wants the
             building back. */
          m.color?.multiplyScalar(0.72);
          m.emissive?.setScalar(0);
        }
      });
      world.add(blk);
      /* TWO MORE BLOCKS, far off and hazy, because one building does not make
         an estate. Chad: "add more trees or duplicate hdb blocks in the far
         background to make the scene feel more alive. It's rather empty now."
         Clones SHARE the original's geometry and its already-darkened
         materials — placed after the traverse above on purpose, so nothing
         is darkened twice — which makes them almost free on the GPU and
         means dispose() cannot double-free anything the Set in dispose()
         would not have deduplicated anyway. One stands past the left edge of
         the car park, one off to the right, one behind the player's whole
         walk so turning round no longer faces an empty horizon. All three
         are far outside BOUNDS and deep in the morning haze.             */
      for (const [bx, bz, ry] of [[-54, -34, 0.95], [46, -48, -0.60], [20, 64, 2.75]]) {
        const far = blk.clone();
        far.position.set(bx, 0, bz);
        far.rotation.y = ry;
        world.add(far);
      }
      /* No fake lit windows. There were fourteen and they were wrong twice —
         first hand-placed into the sky above the roofline, then placed off
         the model's BOUNDING BOX, which spans x -21..27 and z -41..-3 because
         the export includes its podium, so they landed on a plane in front of
         the tent. The chapter is a morning now and a lit window at ten in the
         morning is not a thing. The block has its own facade. */
      hdbReady = true;
      redoShadows();
    }, (err) => console.warn('HDB failed to load', err)))
      .catch(err => console.warn('HDB failed to load', err));


    /* ================================================================== */
    /* THE TENTAGE                                                        */
    /* ================================================================== */
    const tent = new THREE.Group();
    world.add(tent);

    /* The frame. Uprights every four and a half metres down both sides, an
       eave beam along each, and a ridge beam down the middle — which is
       also what the canvas hangs off and what the tubes are wired to. */
    const poleGeo = new THREE.CylinderGeometry(T.pole, T.pole, T.eave, 8);
    const POLE_Z = [-T.z, -4.5, 0, 4.5, T.z];
    const poles = [];
    for (const sx of [-1, 1]) {
      for (const pz of POLE_Z) {
        const p = new THREE.Mesh(poleGeo, matPole);
        p.position.set(sx * T.x, T.eave / 2, pz);
        p.castShadow = !LOW;
        tent.add(p); poles.push(p);
      }
    }
    // the two centre uprights, at the ends only, holding the ridge up
    const ridgePoleGeo = new THREE.CylinderGeometry(T.pole, T.pole, T.ridge, 8);
    for (const pz of [-T.z, T.z]) {
      const p = new THREE.Mesh(ridgePoleGeo, matPole);
      p.position.set(0, T.ridge / 2, pz);
      tent.add(p); poles.push(p);
    }
    const beamGeo = new THREE.BoxGeometry(0.08, 0.08, T.z * 2);
    for (const [bx, by] of [[-T.x, T.eave], [T.x, T.eave], [0, T.ridge]]) {
      const b = new THREE.Mesh(beamGeo, matPole);
      b.position.set(bx, by, 0);
      tent.add(b);
    }
    /* The rafters: eave up to ridge, one at every bay. The sign is worth a
       word — a box lying along +X and rotated by +theta about Z lifts its
       +X end, and the LEFT rafter is the one that rises with x. */
    const braceGeo = new THREE.BoxGeometry(T.x, 0.055, 0.055);
    const pitch = Math.atan2(T.ridge - T.eave, T.x);
    for (const sx of [-1, 1]) {
      for (const pz of POLE_Z) {
        const b = new THREE.Mesh(braceGeo, matPole);
        b.position.set(sx * T.x / 2, T.eave + (T.ridge - T.eave) / 2, pz);
        b.rotation.z = -sx * pitch;
        tent.add(b);
      }
    }

    /* The canvas. ONE plane laid flat and folded along its own middle, not
       two panels rotated into place: a PlaneGeometry turned by -90° about X
       maps its local z straight onto world Y, so the ridge is a line of
       vertices pushed up and the whole roof — pitch, sag and the breathing
       in updateNotes — is one array of heights. Both ends are left open,
       which is how these actually go up and is also what lets you see the
       block rising behind the altar from anywhere in the aisle.          */
    const canvasGeo = new THREE.PlaneGeometry(T.x * 2, T.z * 2, 12, 10);
    {
      const p = canvasGeo.attributes.position.array;
      for (let i = 0; i < p.length; i += 3) {
        p[i + 2] = T.ridge - (Math.abs(p[i]) / T.x) * (T.ridge - T.eave);
      }
      canvasGeo.attributes.position.needsUpdate = true;
      canvasGeo.computeVertexNormals();
    }
    const canvasBase = canvasGeo.attributes.position.array.slice();
    const roof = new THREE.Mesh(canvasGeo, matCanvas);
    roof.rotation.x = -Math.PI / 2;
    roof.receiveShadow = true;
    tent.add(roof);

    /* The side skirts — a metre of canvas hanging off each eave, so the tent
       has walls that stop at chest height and the dark outside shows under
       them. It frames every shot in here. One geometry, both sides: they
       breathe together, which at opposite ends of a twelve metre tent reads
       as one breeze rather than as a copy. */
    const skirtGeo = new THREE.PlaneGeometry(T.z * 2, 1.0, 10, 1);
    const skirtBase = skirtGeo.attributes.position.array.slice();
    const skirtL = new THREE.Mesh(skirtGeo, matCanvas);
    skirtL.rotation.y = Math.PI / 2;
    skirtL.position.set(-T.x, T.eave - 0.5, 0);
    tent.add(skirtL);
    const skirtR = new THREE.Mesh(skirtGeo, matCanvas);
    skirtR.rotation.y = -Math.PI / 2;
    skirtR.position.set(T.x, T.eave - 0.5, 0);
    tent.add(skirtR);

    /* The fluorescent tubes. Twelve of them wired along the three beams —
       and four point lights, because twelve would be twelve, and four spread
       down the ridge give the same flat cold wash for a third of the cost.
       This is the chapter's key light and its whole signature: a white box
       standing in a blue night.                                           */
    const tubeGeo = new THREE.BoxGeometry(0.055, 0.055, 1.22);
    const tubes = [];
    for (const [tx, ty] of [[-T.x + 0.12, T.eave - 0.10],
                            [T.x - 0.12, T.eave - 0.10],
                            [0, T.ridge - 0.14]]) {
      for (const tz of [-6.4, -2.1, 2.1, 6.4]) {
        const tb = new THREE.Mesh(tubeGeo, matTube);
        tb.position.set(tx, ty, tz);
        tent.add(tb); tubes.push(tb);
      }
    }
    const tentLights = [];
    const LIT_Z = LOW ? [-4.2, 4.2] : [-6.4, -2.1, 2.1, 6.4];
    for (const lz of LIT_Z) {
      /* Tuned DOWN from the first pass, which lit the tent like a school
         fête: from outside it was the box of light it should be, but from
         inside everything was flat and washed and the canvas read as a
         circus. A cheap tube is not white either — the tint is the faint
         warm green every one of these has. */
      const l = new THREE.PointLight(0xdde6d8, LOW ? 6 : 3.6, 15, 1.55);
      l.position.set(0, T.ridge - 0.30, lz);
      tent.add(l); tentLights.push(l);
    }
    /* One of them casts, and only one. Shadows here are frozen after the
       first few frames (the engine redraws them on demand), so a static
       crowd under a static light costs one map and then nothing. */
    const key = new THREE.SpotLight(0xdfe8e2, LOW ? 0 : 9, 22, Math.PI / 3.1, 0.62, 1.5);
    key.position.set(0.4, T.ridge + 0.6, -1.0);
    key.target.position.set(0, 0, -3.0);
    key.castShadow = !LOW;
    if (!LOW) {
      key.shadow.mapSize.set(1024, 1024);
      key.shadow.bias = -0.0012;
      key.shadow.camera.near = 1; key.shadow.camera.far = 26;
    }
    tent.add(key, key.target);
    /* Into `owned` as well, exactly as chapter 1 does its sodium lamps:
       Light.dispose() is what frees a 1024x1024 shadow map, and
       world.traverse() never reaches a light, because a light has neither
       geometry nor material. renderer.info does not count render targets,
       so leaktest would not have caught this one. */
    owned.push(key, key.target);

    /* A little bounce off the canvas. A tent lit from inside is not a room
       with one lamp in it — the roof throws most of the light back down, and
       without this the crowd is a field of black silhouettes. */
    /* The light under the canvas, and in a morning it is most of what lights
       the crowd: sky above, hot tarmac below. */
    const bounce = new THREE.HemisphereLight(0xcadcf0, 0x9a9384, 0.72);
    bounce.position.set(0, T.eave, 0);
    tent.add(bounce);

    /* ================================================================== */
    /* THE ALTAR                                                          */
    /* ================================================================== */
    const altar = new THREE.Group();
    altar.position.set(ALTAR.x, 0, ALTAR.z);
    world.add(altar);

    const tableTop = new THREE.Mesh(new THREE.BoxGeometry(2.9, 0.08, 0.95), matWood);
    tableTop.position.y = 0.90;
    tableTop.castShadow = true; tableTop.receiveShadow = true;
    altar.add(tableTop);
    // the red cloth over it, hanging to the ground at the front
    const cloth = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.90, 1.02), matCloth);
    cloth.position.y = 0.45;
    cloth.receiveShadow = true;
    altar.add(cloth);
    const clothTrim = new THREE.Mesh(new THREE.BoxGeometry(3.02, 0.10, 1.04), matGold);
    clothTrim.position.y = 0.14;
    altar.add(clothTrim);

    /* What is on it. Three urns of joss, two pairs of candles, three plates
       of fruit and a stack of paper — the standard setting, and every one of
       them is a cylinder or a box because at this light level that is all
       any of them needs to be. */
    const urnGeo = new THREE.CylinderGeometry(0.13, 0.15, 0.20, 12);
    const jossTips = [];
    const jossGeo = new THREE.CylinderGeometry(0.005, 0.005, 0.42, 4);
    const tipGeo = new THREE.SphereGeometry(0.012, 6, 5);
    const matTip = new THREE.MeshBasicMaterial({ color: 0xff7a1e, fog: false });
    for (const ux of [-0.85, 0, 0.85]) {
      const urn = new THREE.Mesh(urnGeo, matLacquer);
      urn.position.set(ux, 1.04, 0);
      urn.castShadow = true;
      altar.add(urn);
      for (let i = 0; i < 7; i++) {
        const st = new THREE.Mesh(jossGeo, matWood);
        const a = (i / 7) * Math.PI * 2;
        st.position.set(ux + Math.cos(a) * 0.055, 1.30, Math.sin(a) * 0.055);
        st.rotation.z = Math.cos(a) * 0.10;
        st.rotation.x = -Math.sin(a) * 0.10;
        altar.add(st);
        const tip = new THREE.Mesh(tipGeo, matTip);
        tip.position.set(st.position.x * 1.02, 1.51, st.position.z * 1.02);
        altar.add(tip); jossTips.push(tip);
      }
    }
    const candleGeo = new THREE.CylinderGeometry(0.045, 0.05, 0.34, 10);
    const flameGeo = new THREE.ConeGeometry(0.028, 0.10, 6);
    const matFlame = new THREE.MeshBasicMaterial({ color: 0xffc247, fog: false });
    const flames = [];
    for (const cx of [-1.28, 1.28]) {
      const cd = new THREE.Mesh(candleGeo, matCloth);
      cd.position.set(cx, 1.11, 0.06);
      cd.castShadow = true;
      altar.add(cd);
      const fl = new THREE.Mesh(flameGeo, matFlame);
      fl.position.set(cx, 1.33, 0.06);
      altar.add(fl); flames.push(fl);
    }
    const plateGeo = new THREE.CylinderGeometry(0.16, 0.14, 0.05, 12);
    const fruitGeo = new THREE.SphereGeometry(0.055, 8, 6);
    const matFruit = new THREE.MeshStandardMaterial({ color: 0xc4761f, roughness: 0.66 });
    for (const px of [-0.45, 0.45]) {
      const pl = new THREE.Mesh(plateGeo, matGold);
      pl.position.set(px, 0.965, 0.30);
      altar.add(pl);
      for (let i = 0; i < 4; i++) {
        const fr = new THREE.Mesh(fruitGeo, matFruit);
        fr.position.set(px + (i % 2 ? 0.06 : -0.06), 1.03,
                        0.30 + (i < 2 ? 0.05 : -0.05));
        altar.add(fr);
      }
    }

    /* THE NOTE. The thread out of chapter one, lying on the corner of the
       altar table where it should have been put back a week ago — and also
       what the engine textures the player's in-hand note from. */
    const noteMat = new THREE.MeshStandardMaterial({
      map: noteTex, roughness: 0.85, side: THREE.DoubleSide });
    const heroNote = new THREE.Mesh(new THREE.PlaneGeometry(0.19, 0.095), noteMat);
    heroNote.rotation.x = -Math.PI / 2;
    heroNote.rotation.z = 0.24;
    heroNote.position.set(1.02, 0.945, 0.34);
    heroNote.receiveShadow = true;
    altar.add(heroNote);
    // and a loose stack of them beside it, because someone has been folding
    const stackGeo = new THREE.BoxGeometry(0.20, 0.035, 0.11);
    for (let i = 0; i < 3; i++) {
      const st = new THREE.Mesh(stackGeo, matPaper);
      st.position.set(-1.02, 0.955 + i * 0.033, 0.30);
      st.rotation.y = (Math.random() - 0.5) * 0.22;
      altar.add(st);
    }

    /* The effigy behind the altar. Da Shi Ye — the paper figure that stands
       over every seventh-month altar in Singapore. Stylised on purpose:
       tall, red and gold, mostly in silhouette against the block. Making it
       detailed would make it the subject of the shot, and it is not. */
    const effigy = new THREE.Group();
    effigy.position.set(0, 0, -0.75);
    altar.add(effigy);
    const eBody = new THREE.Mesh(
      new THREE.CylinderGeometry(0.34, 0.62, 1.85, 10), matCloth);
    eBody.position.y = 0.93;
    eBody.castShadow = true;
    effigy.add(eBody);
    /* The face is painted paper, not gold leaf: a flat pale mask with a gold
       crown over it. In the first pass the head was matGold, which caught the
       altar's flame at full strength and read as a lamp on a cone. */
    const matEffigyFace = new THREE.MeshStandardMaterial({
      color: 0x9c8f7a, roughness: 0.92, metalness: 0.02 });
    const eHead = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.40, 0.28), matEffigyFace);
    eHead.position.y = 2.06;
    eHead.castShadow = true;
    effigy.add(eHead);
    // the eyes and mouth, three dark slots, which is all a face needs at this range
    const matSlot = new THREE.MeshBasicMaterial({ color: 0x140f0c, fog: true });
    for (const [ex, ey, ew, eh] of [[-0.08, 2.12, 0.08, 0.035],
                                    [0.08, 2.12, 0.08, 0.035],
                                    [0, 1.96, 0.13, 0.03]]) {
      const sl = new THREE.Mesh(new THREE.PlaneGeometry(ew, eh), matSlot);
      sl.position.set(ex, ey, 0.145);
      effigy.add(sl);
    }
    const eCrown = new THREE.Mesh(new THREE.ConeGeometry(0.20, 0.30, 6), matGold);
    eCrown.position.y = 2.40;
    effigy.add(eCrown);
    for (const sx of [-1, 1]) {
      const arm = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.72, 0.10), matCloth);
      arm.position.set(sx * 0.42, 1.30, 0.06);
      arm.rotation.z = sx * 0.30;
      effigy.add(arm);
    }

    /* The two giant joss sticks, one either side of the altar. They are a
       metre taller than anyone here and their tips are the only orange in
       the front of the tent. */
    const bigJossGeo = new THREE.CylinderGeometry(0.055, 0.075, 2.6, 10);
    const bigTipGeo = new THREE.SphereGeometry(0.075, 8, 6);
    const bigTips = [];
    for (const bx of [-2.0, 2.0]) {
      const bj = new THREE.Mesh(bigJossGeo, matCloth);
      bj.position.set(bx, 1.30, 0.10);
      bj.castShadow = true;
      altar.add(bj);
      const bt = new THREE.Mesh(bigTipGeo, matTip);
      bt.position.set(bx, 2.62, 0.10);
      altar.add(bt); bigTips.push(bt); jossTips.push(bt);
    }

    /* The altar's own light — and the one the CONTRACT names `fireLight`,
       which is what the engine warms the player's hands from as they come up
       the aisle. Candles, joss and the paper on the table: it flickers,
       because all three of those do.                                      */
    // a candle in daylight is a candle, not a bonfire
    const fireLight = new THREE.PointLight(0xff8b33, 3.4, 9, 1.7);
    fireLight.position.set(ALTAR.x, 1.35, ALTAR.z + 0.30);
    scene.add(fireLight);
    owned.push(fireLight);

    /* ================================================================== */
    /* THE BRAZIER                                                        */
    /* ================================================================== */
    /* Out at the tent's edge, where it has to be. Chapter 1's burner idiom
       exactly: a drum, a hot mouth, embers going up. */
    const brazier = new THREE.Group();
    brazier.position.set(BRAZ.x, 0, BRAZ.z);
    world.add(brazier);
    const drum = new THREE.Mesh(
      new THREE.CylinderGeometry(0.46, 0.40, 0.86, 14, 1, true), matMetal);
    drum.position.y = 0.43;
    drum.material.side = THREE.DoubleSide;
    drum.castShadow = true; drum.receiveShadow = true;
    brazier.add(drum);
    const ash = new THREE.Mesh(
      new THREE.CylinderGeometry(0.40, 0.40, 0.05, 14),
      new THREE.MeshStandardMaterial({ color: 0x1b1512, roughness: 1 }));
    ash.position.y = 0.70;
    brazier.add(ash);
    const mouth = new THREE.Mesh(
      new THREE.CircleGeometry(0.38, 14),
      new THREE.MeshBasicMaterial({ color: 0xff6a12, fog: false }));
    mouth.rotation.x = -Math.PI / 2;
    mouth.position.y = 0.73;
    brazier.add(mouth);
    const brazLight = new THREE.PointLight(0xff7220, 2.8, 7, 1.8);
    brazLight.position.set(BRAZ.x, 1.05, BRAZ.z);
    scene.add(brazLight);
    owned.push(brazLight);

    /* ================================================================== */
    /* THE PAPER TABLE, AND THE AUNTIE AT IT                              */
    /* ================================================================== */
    const paperTable = new THREE.Group();
    paperTable.position.set(PAPER.x, 0, PAPER.z);
    world.add(paperTable);
    const ptTop = new THREE.Mesh(new THREE.BoxGeometry(0.90, 0.06, 1.80), matWood);
    ptTop.position.y = 0.76;
    ptTop.castShadow = true; ptTop.receiveShadow = true;
    paperTable.add(ptTop);
    for (const [lx, lz] of [[-0.36, -0.78], [0.36, -0.78], [-0.36, 0.78], [0.36, 0.78]]) {
      const lg = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.74, 0.06), matWood);
      lg.position.set(lx, 0.37, lz);
      paperTable.add(lg);
    }
    // the stacks she is working through
    for (let i = 0; i < 9; i++) {
      const st = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.09, 0.20), matPaper);
      st.position.set(-0.14 + (i % 3) * 0.16, 0.835,
                      -0.62 + Math.floor(i / 3) * 0.60);
      st.rotation.y = (Math.random() - 0.5) * 0.3;
      st.castShadow = true;
      paperTable.add(st);
    }

    /* ================================================================== */
    /* PEOPLE                                                             */
    /* ================================================================== */
    /* A figure is five boxes and a sphere. At this light level, under a
       fluorescent tube, at four metres and up, that is genuinely enough —
       and it means the named ones can be posed by a cutscene, which a
       bought model would not have let us do without a rig.               */
    function figure({ shirt, seated = false, h = 1.0 }) {
      const g = new THREE.Group();
      const hipY = seated ? 0.46 : 0.86;
      /* Slightly tapered and shallower than the first pass, which from three
         metres behind read as a row of filing cabinets with heads on. A
         cylinder with six sides is the same cost as a box and has corners
         that catch the light differently, which is most of the difference. */
      const torso = new THREE.Mesh(
        new THREE.CylinderGeometry(0.155, 0.185, 0.56, 6), shirt);
      torso.position.y = (hipY + 0.30) * h;
      torso.scale.set(1.14, 1, 0.78);
      torso.rotation.y = Math.PI / 6;
      torso.castShadow = !LOW;
      const shoulders = new THREE.Mesh(
        new THREE.BoxGeometry(0.42, 0.13, 0.20), shirt);
      shoulders.position.y = (hipY + 0.55) * h;
      const neck = new THREE.Mesh(
        new THREE.CylinderGeometry(0.055, 0.06, 0.09, 6), matSkin);
      neck.position.y = (hipY + 0.66) * h;
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.105, 10, 8), matSkin);
      head.position.y = (hipY + 0.775) * h;
      head.castShadow = !LOW;
      /* A cap of hair, TILTED BACK. A sphere-cap sitting flat on top of a
         head is a mushroom from behind and a bowl cut from the front; tipping
         it puts the coverage where hair actually is — the crown and the back
         of the skull — and leaves the face clear. */
      const hair = new THREE.Mesh(new THREE.SphereGeometry(0.113, 10, 8,
        0, Math.PI * 2, 0, Math.PI * 0.60), matHair);
      hair.position.y = (hipY + 0.775) * h;
      hair.position.z = -0.012;
      hair.rotation.x = -0.34;
      g.add(torso, shoulders, neck, head, hair);
      if (seated) {
        const thigh = new THREE.Mesh(new THREE.BoxGeometry(0.30, 0.13, 0.38), matDark);
        thigh.position.set(0, 0.44 * h, 0.16);
        const shin = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.42, 0.14), matDark);
        shin.position.set(0, 0.23 * h, 0.35);
        g.add(thigh, shin);
      } else {
        const legs = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.86, 0.20), matDark);
        legs.position.y = 0.43 * h;
        legs.castShadow = !LOW;
        g.add(legs);
      }
      g.userData.head = head;
      g.userData.hair = hair;
      g.userData.torso = torso;
      return g;
    }

    /* ------------------------------------------------------ the seating ---
       Forty-eight red plastic chairs in six rows of eight, split by a metre
       of aisle down the middle — instanced, so the whole audience's
       furniture is one draw call.

       The chair is four pieces so it can be four InstancedMeshes sharing one
       set of per-instance matrices. Merging them into a single geometry
       would be one call instead of four and would need BufferGeometryUtils,
       which the chapter contract does not hand a chapter. Four is fine. */
    const N_CHAIR = ROW_Z.length * COL_X.length;
    const seatIM = new THREE.InstancedMesh(
      new THREE.BoxGeometry(0.44, 0.045, 0.42), matPlastic, N_CHAIR);
    const backIM = new THREE.InstancedMesh(
      new THREE.BoxGeometry(0.44, 0.42, 0.045), matPlastic, N_CHAIR);
    const legIM = new THREE.InstancedMesh(
      new THREE.BoxGeometry(0.40, 0.42, 0.36), matChairLeg, N_CHAIR);
    for (const im of [seatIM, backIM, legIM]) {
      im.castShadow = !LOW;
      im.receiveShadow = true;
      im.frustumCulled = false;
      world.add(im);
    }

    const _m = new THREE.Matrix4(), _q = new THREE.Quaternion();
    const _e = new THREE.Euler(), _p = new THREE.Vector3(), _s = new THREE.Vector3(1, 1, 1);
    const chairRot = new Float32Array(N_CHAIR);      // so scenes can turn one
    const chairAt = [];                              // and know where it is

    function placeChair(i) {
      const at = chairAt[i];
      _e.set(0, chairRot[i], 0); _q.setFromEuler(_e);
      _p.set(at.x, 0.465, at.z);
      seatIM.setMatrixAt(i, _m.compose(_p, _q, _s));
      _p.set(at.x - Math.sin(chairRot[i]) * -0.19, 0.70,
             at.z - Math.cos(chairRot[i]) * -0.19);
      backIM.setMatrixAt(i, _m.compose(_p, _q, _s));
      _p.set(at.x, 0.23, at.z);
      legIM.setMatrixAt(i, _m.compose(_p, _q, _s));
      if (chairIM) {                 // the bought chair stands on its origin,
        _p.set(at.x, 0, at.z);       // orientation baked into its geometry
        chairIM.setMatrixAt(i, _m.compose(_p, _q, _s));
      }
    }
    let chairIM = null;              // v4.7: set when the real chair lands

    let ci = 0;
    for (let r = 0; r < ROW_Z.length; r++) {
      for (let c = 0; c < COL_X.length; c++) {
        chairAt.push({ x: COL_X[c], z: ROW_Z[r], row: r, col: c });
        /* Everyone faces the altar. Everyone except one: row four, third
           seat in, is turned right round — which is the chapter, in a
           single line of data. */
        chairRot[ci] = (r === ODD.row && c === ODD.col) ? Math.PI : 0;
        chairRot[ci] += (Math.random() - 0.5) * 0.16;   // nobody lines up neatly
        placeChair(ci);
        ci++;
      }
    }
    const ODD_I = ODD.row * COL_X.length + ODD.col;
    const BACK_I = BACK.row * COL_X.length + BACK.col;
    /* every place that says "the chair matrices moved" says it to THIS list,
       because v4.7 adds a fourth instanced mesh (the bought chair) to it at
       load time and none of those places should have to know */
    const chairIMs = [seatIM, backIM, legIM];
    for (const im of chairIMs) im.instanceMatrix.needsUpdate = true;

    /* ------------------------------------------------------- the audience
       Thirty-one of the forty-eight seats taken, scattered rather than
       filled front to back, because nobody sits in the front row until they
       have to. The odd chair is EMPTY, and so are the two either side of it.

       Individual groups rather than instances: thirty-one figures of six
       small meshes each is under two hundred objects, they need per-person
       colours and a per-person breathing offset anyway, and it keeps
       dispose() to one traverse. */
    const SHIRTS = [0x37424e, 0x4a443b, 0x2c343d, 0x554a40, 0x333c45,
                    0x453b34, 0x3b434f, 0x4b433a, 0x2f3843, 0x50483d];
    const shirtMats = SHIRTS.map(c => new THREE.MeshStandardMaterial({
      color: c, roughness: 0.86, metalness: 0.02 }));
    const crowd = [];
    const crowdRoot = new THREE.Group();
    world.add(crowdRoot);
    const TAKEN = new Set();
    {
      // a deterministic-ish scatter: skip the odd chair and its neighbours,
      // thin the front row out, and leave a few gaps everywhere else
      let n = 0;
      for (let i = 0; i < N_CHAIR; i++) {
        const at = chairAt[i];
        if (i === ODD_I || i === ODD_I - 1 || i === ODD_I + 1) continue;
        if (i === BACK_I) continue;
        if (at.row === 0 && at.col % 2 === 0) continue;
        if ((i * 7 + 3) % 5 === 0) continue;
        if (LOW && (i % 2)) continue;
        TAKEN.add(i);
        const f = figure({ shirt: shirtMats[n % shirtMats.length], seated: true,
                           h: 0.94 + (i % 5) * 0.022 });
        f.position.set(at.x, 0, at.z);
        f.rotation.y = chairRot[i] + Math.PI;   // facing the altar, like the chair
        f.userData.ph = (i * 1.37) % 6.28;
        f.userData.baseY = 0;
        crowdRoot.add(f);
        crowd.push(f);
        n++;
      }
    }

    /* Six standing at the edges — the ones who came late and the ones who
       never sit. Two of them are down by the brazier feeding it. */
    const standers = [];
    for (const [sx, sz, ry] of [[-4.9, 1.4, 0.15], [-4.9, -1.1, 0.05],
                                [4.9, 2.2, -0.2], [5.1, 0.6, -0.1],
                                [4.6, -3.9, -1.3], [3.9, -4.6, -1.0]]) {
      if (LOW && standers.length >= 3) break;
      const f = figure({ shirt: shirtMats[(standers.length * 3) % shirtMats.length],
                         h: 0.97 + (standers.length % 3) * 0.03 });
      f.position.set(sx, 0, sz);
      f.rotation.y = Math.PI + ry;
      f.userData.ph = standers.length * 1.9;
      crowdRoot.add(f);
      standers.push(f);
    }

    /* ------------------------------------------------------- the medium ---
       The tang-ki, on a stool in front of the altar, facing the crowd. Bare
       shoulders, a yellow sash, a flag in each hand. He is the unfamiliar
       thing in this tent and he is NOT the frightening one — the whole best
       answer turns on that, and nothing about how he is built or lit is
       allowed to argue otherwise. */
    const medium = figure({ shirt: matSkin, seated: true, h: 1.03 });
    medium.position.set(MEDIUM.x, 0, MEDIUM.z);
    medium.rotation.y = 0;                       // facing +z, at the crowd
    world.add(medium);
    // read off the figure rather than recomputed, so reset() puts his head
    // back where build() put it however the proportions are later tuned
    const MED_HEAD_Y = medium.userData.head.position.y;
    const sash = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.13, 0.26), matSash);
    sash.position.set(0, 0.90, 0);
    sash.rotation.z = 0.42;
    medium.add(sash);
    const stool = new THREE.Mesh(
      new THREE.CylinderGeometry(0.20, 0.22, 0.44, 10), matWood);
    stool.position.set(MEDIUM.x, 0.22, MEDIUM.z);
    stool.castShadow = true; stool.receiveShadow = true;
    world.add(stool);
    // the two flags, on short sticks, one in each hand
    const flags = [];
    for (const sx of [-1, 1]) {
      const fg = new THREE.Group();
      fg.position.set(sx * 0.40, 0.92, 0.16);
      const stick = new THREE.Mesh(
        new THREE.CylinderGeometry(0.012, 0.012, 0.52, 6), matWood);
      stick.position.y = 0.10;
      const cloth2 = new THREE.Mesh(new THREE.PlaneGeometry(0.30, 0.24), matCloth);
      cloth2.material = matCloth;
      cloth2.position.set(sx * 0.16, 0.28, 0);
      cloth2.rotation.y = sx * 0.4;
      fg.add(stick, cloth2);
      fg.rotation.z = -sx * 0.5;
      medium.add(fg);
      flags.push(fg);
    }

    /* ------------------------------------------------------- the priest ---
       Beside the altar with a hand drum and a stick. Older, in a dark robe,
       entirely unbothered. */
    const priest = figure({ shirt: matDark, h: 0.99 });
    priest.position.set(-1.75, 0, -6.5);
    priest.rotation.y = 0.25;
    world.add(priest);
    const robe = new THREE.Mesh(
      new THREE.CylinderGeometry(0.26, 0.40, 0.92, 10), matDark);
    robe.position.y = 0.46;
    priest.add(robe);
    const handDrum = new THREE.Group();
    handDrum.position.set(0.30, 1.20, 0.20);
    const drumBody = new THREE.Mesh(
      new THREE.CylinderGeometry(0.15, 0.15, 0.07, 12), matCloth);
    drumBody.rotation.x = Math.PI / 2;
    const drumStick = new THREE.Mesh(
      new THREE.CylinderGeometry(0.010, 0.010, 0.30, 6), matWood);
    drumStick.position.set(0.10, 0.14, 0.06);
    drumStick.rotation.z = 0.6;
    handDrum.add(drumBody, drumStick);
    priest.add(handDrum);

    /* -------------------------------------------------------- the auntie --
       At the paper table, folding, with her back three-quarters to the
       ritual because she has seen it a hundred times. She is the experienced
       practitioner the source names, and the reason the best answer is the
       best answer. */
    const auntie = figure({ shirt: matFloral, h: 0.95 });
    auntie.position.set(PAPER.x - 0.86, 0, PAPER.z - 0.10);
    auntie.rotation.y = -Math.PI / 2 + 0.25;      // facing the table
    world.add(auntie);
    const bun = new THREE.Mesh(new THREE.SphereGeometry(0.062, 8, 6), matHair);
    bun.position.set(0, 1.60, -0.10);
    auntie.add(bun);

    /* ================================================================== */
    /* v4.7 · THE BOUGHT MODELS                                            */
    /* ================================================================== */
    /* Chad's uploads, all Sketchfab (the credits panel carries the four
       attributions): the plastic chair, the low-poly cars, the EinScan
       Guan Gong, and Encik Lim Cheng Teck sitting, who is the audience now.

       All four load the way the block model always has — async, with the
       primitives standing in until the bytes land, so nothing here is ever
       on the first frame's critical path and a failed download costs a
       nicer prop, never the chapter. Each loader HIDES what it replaces
       rather than removing it: the primitives stay in `world`, so the one
       dispose() traverse still frees everything however far the downloads
       got, which is the contract leaktest holds this chapter to.

       Sizing is never trusted from the file (the arms rig's lesson): every
       model is measured and scaled to the real-world size of the thing it
       is, and orientation corrections are baked into GEOMETRY so that the
       code that places things keeps thinking in position + yaw only.     */
    const loadGLB = (key, fn) => {
      assetBytes(key).then(BUF => new GLTFLoader().parse(BUF, '', (gltf) => {
        if (!alive) return;                    // disposed while the bytes flew
        rescueTextures(gltf, BUF);
        fn(gltf);
        redoShadows();
      }, (err) => console.warn(key + ' failed to load', err)))
        .catch(err => console.warn(key + ' failed to load', err));
    };

    /* THE CHAIR — one 710-triangle mesh, instanced over every seat, and the
       three primitive instanced-meshes go dark. placeChair() already drives
       the fourth matrix set, so the odd chair, the turned chair and every
       scene that touches one keep working unchanged. */
    loadGLB('seat', (gltf) => {
      let src = null;
      gltf.scene.updateMatrixWorld(true);
      gltf.scene.traverse(o => { if (o.isMesh && !src) src = o; });
      if (!src) return;
      const geo = src.geometry.clone();
      geo.applyMatrix4(src.matrixWorld);       // the FBX wrapper's Z-up fix etc.
      geo.computeBoundingBox();
      const bb = geo.boundingBox;
      const s = 0.88 / (bb.max.y - bb.min.y);  // a real plastic chair's height
      geo.translate(-(bb.min.x + bb.max.x) / 2, -bb.min.y, -(bb.min.z + bb.max.z) / 2);
      geo.scale(s, s, s);
      geo.rotateY(SEAT_YAW);                   // face -z at rotation 0, like the old ones
      chairIM = new THREE.InstancedMesh(geo, src.material, N_CHAIR);
      chairIM.castShadow = !LOW;
      chairIM.receiveShadow = true;
      chairIM.frustumCulled = false;
      world.add(chairIM);
      chairIMs.push(chairIM);
      for (let i = 0; i < N_CHAIR; i++) placeChair(i);
      chairIM.instanceMatrix.needsUpdate = true;
      for (const im of [seatIM, backIM, legIM]) im.visible = false;
    });

    /* THE CARS — four in the file; each is re-centred onto its own origin,
       scaled to a sedan's length, and parked where the boxes were plus two
       more spots, nose-in and nose-out so the row reads parked rather than
       placed. All outside the player's bounds, same as the boxes.        */
    loadGLB('cars', (gltf) => {
      gltf.scene.updateMatrixWorld(true);
      const bodies = [];
      gltf.scene.traverse(o => { if (o.isMesh) bodies.push(o); });
      const spots = [[-9.6, 3.2, 0.10], [9.9, 6.4, 3.05],
                     [-10.4, 9.8, -0.06], [10.3, -1.6, 3.18]];
      bodies.slice(0, spots.length).forEach((m, i) => {
        const geo = m.geometry.clone();
        geo.applyMatrix4(m.matrixWorld);
        geo.computeBoundingBox();
        const bb = geo.boundingBox;
        const s = 4.35 / Math.max(bb.max.x - bb.min.x, bb.max.z - bb.min.z);
        geo.translate(-(bb.min.x + bb.max.x) / 2, -bb.min.y, -(bb.min.z + bb.max.z) / 2);
        geo.scale(s, s, s);
        const car = new THREE.Mesh(geo, m.material);
        car.castShadow = !LOW;
        car.receiveShadow = true;
        car.position.set(spots[i][0], 0, spots[i][1]);
        car.rotation.y = spots[i][2];
        world.add(car);
      });
      for (const c of boxCars) c.visible = false;
    });

    /* GUAN GONG — the scan, standing where the paper effigy stood, behind
       the altar and over it, facing the crowd. The effigy goes dark the
       moment he lands. */
    loadGLB('guangong', (gltf) => {
      const g = gltf.scene;
      g.updateMatrixWorld(true);
      let b1 = new THREE.Box3().setFromObject(g);
      if ((b1.max.z - b1.min.z) > (b1.max.y - b1.min.y) * 1.4) {
        g.rotation.x = -Math.PI / 2;           // a scan that arrived Z-up
        g.updateMatrixWorld(true);
        b1 = new THREE.Box3().setFromObject(g);
      }
      const s = 2.05 / (b1.max.y - b1.min.y);  // effigy height, statue's dignity
      g.scale.setScalar(s);
      g.updateMatrixWorld(true);
      const b2 = new THREE.Box3().setFromObject(g);
      g.position.set(-(b2.min.x + b2.max.x) / 2, -b2.min.y, -(b2.min.z + b2.max.z) / 2);
      const holder = new THREE.Group();
      holder.rotation.y = GG_YAW;              // face the crowd; tuned by eye
      holder.position.set(0, 0, -0.75);        // exactly the effigy's spot
      holder.add(g);
      altar.add(holder);
      /* On a plinth, the way a deity statue stands at one of these events —
         and for the same reason here as there: the altar table is 0.94 m of
         occlusion, and a floor-standing figure is legs-first furniture from
         every seat. 0.72 m of red box puts his head above the old effigy's
         shoulders and the whole statue above the tabletop. */
      const plinth = new THREE.Mesh(new THREE.BoxGeometry(1.10, 0.72, 0.85), matCloth);
      plinth.position.y = 0.36;
      plinth.castShadow = !LOW; plinth.receiveShadow = true;
      holder.add(plinth);
      const plinthTrim = new THREE.Mesh(new THREE.BoxGeometry(1.14, 0.09, 0.89), matGold);
      plinthTrim.position.y = 0.045;
      holder.add(plinthTrim);
      g.position.y += 0.72;
      g.traverse(o => { if (o.isMesh) { o.castShadow = !LOW; } });
      effigy.visible = false;
    });

    /* THE AUDIENCE — Encik Lim Cheng Teck, sitting. One skinned model would
       mean thirty skeletons; instead his sitting pose is BAKED into a plain
       geometry once, on arrival, and thirty tinted meshes share it. The
       primitives' seating plan (TAKEN), phases and sway contract carry over
       exactly — `crowd` still holds one group per person, `userData.head`
       still turns, crowdLife still freezes everybody dead.               */
    loadGLB('encik', (gltf) => {
      let src = null;
      gltf.scene.traverse(o => { if (o.isSkinnedMesh && !src) src = o; });
      if (!src) return;
      if (gltf.animations.length) {
        const mixer = new THREE.AnimationMixer(gltf.scene);
        mixer.clipAction(gltf.animations[0]).play();
        mixer.update(0.4);                     // one frame into the idle
      }
      gltf.scene.updateMatrixWorld(true);
      src.skeleton.update();
      const geo = src.geometry.clone();
      const pos = geo.attributes.position;
      const v = new THREE.Vector3();
      for (let i = 0; i < pos.count; i++) {
        v.fromBufferAttribute(pos, i);
        src.applyBoneTransform(i, v);          // the pose, in mesh space
        pos.setXYZ(i, v.x, v.y, v.z);
      }
      geo.deleteAttribute('skinIndex');
      geo.deleteAttribute('skinWeight');
      geo.applyMatrix4(src.matrixWorld);       // the FBX wrapper's scale
      geo.computeVertexNormals();
      geo.computeBoundingBox();
      const bb = geo.boundingBox;
      const s = 1.30 / (bb.max.y - bb.min.y);  // a seated man, floor to crown
      geo.translate(-(bb.min.x + bb.max.x) / 2, -bb.min.y, -(bb.min.z + bb.max.z) / 2);
      geo.scale(s, s, s);
      geo.rotateY(ENCIK_YAW);
      geo.translate(0, 0, ENCIK_Z);            // back onto the seat pan
      for (const f of crowd) f.visible = false;
      crowd.length = 0;
      for (const i of TAKEN) {
        const at = chairAt[i];
        const mat = src.material.clone();
        const k = 0.74 + ((i * 37) % 7) * 0.045;         // per-person light
        mat.color.setRGB(k, k * (0.95 + ((i * 13) % 3) * 0.028), k * (0.97 + ((i * 5) % 2) * 0.03));
        const inner = new THREE.Group();
        const body = new THREE.Mesh(geo, mat);
        body.castShadow = !LOW;
        const hs = 0.96 + ((i * 11) % 5) * 0.02;
        // every other one mirrored: the pose's asymmetry flips, which does
        // more against thirty-of-one-man than any tint can (the material is
        // double-sided in the file, so the flipped winding costs nothing)
        body.scale.set(((i * 7) % 3 === 0 ? -hs : hs), hs, hs);
        inner.add(body);
        const f = new THREE.Group();
        f.add(inner);
        f.position.set(at.x, 0, at.z);
        f.rotation.y = chairRot[i] + Math.PI;  // facing the altar, like the chair
        f.userData.ph = (i * 1.37) % 6.28;
        f.userData.head = inner;               // the sway loop turns this
        crowdRoot.add(f);
        crowd.push(f);
      }
    });

    /* ================================================================== */
    /* WEATHER — smoke, embers, and the haze this tent is full of          */
    /* ================================================================== */
    /* `flying` is the contract's name for a chapter's InstancedMesh of
       small drifting things. Chapter 1's is a hundred hell notes; this one's
       is embers off the brazier and ash out of the joss. */
    const emberMat = new THREE.MeshBasicMaterial({
      color: 0xff9a3c, transparent: true, opacity: 0.85, fog: false,
      blending: THREE.AdditiveBlending, depthWrite: false });
    const FLY_N = LOW ? 26 : 58;
    const flying = new THREE.InstancedMesh(
      new THREE.PlaneGeometry(0.022, 0.022), emberMat, FLY_N);
    flying.frustumCulled = false;
    world.add(flying);
    const sparks = [];
    for (let i = 0; i < FLY_N; i++) {
      const fromBraz = i % 3 !== 0;
      sparks.push({
        ox: fromBraz ? BRAZ.x : ALTAR.x + (Math.random() - 0.5) * 3.4,
        oz: fromBraz ? BRAZ.z : ALTAR.z + 0.1,
        x: 0, y: Math.random() * 2.2, z: 0,
        rise: 0.5 + Math.random() * 1.1,
        ph: Math.random() * 10, spread: fromBraz ? 0.30 : 0.10
      });
    }

    /* The haze. A tent with three urns and two giant joss sticks burning in
       it is not clear air, and the shafts under the tubes are most of why
       this place looks like anywhere. */
    const HAZE_N = LOW ? 90 : 220;
    const hazeGeo = new THREE.BufferGeometry();
    const hazePos = new Float32Array(HAZE_N * 3);
    const hazeSeed = new Float32Array(HAZE_N);
    for (let i = 0; i < HAZE_N; i++) {
      hazePos[i * 3] = (Math.random() - 0.5) * T.x * 1.95;
      hazePos[i * 3 + 1] = 0.3 + Math.random() * 3.4;
      hazePos[i * 3 + 2] = (Math.random() - 0.5) * T.z * 1.95;
      hazeSeed[i] = Math.random() * 100;
    }
    hazeGeo.setAttribute('position', new THREE.BufferAttribute(hazePos, 3));
    const haze = new THREE.Points(hazeGeo, new THREE.PointsMaterial({
      map: dotTex, size: 0.030, transparent: true, opacity: 0.34,
      depthWrite: false, blending: THREE.AdditiveBlending, fog: false }));
    world.add(haze);

    /* A column of smoke standing over the brazier, and one over the altar.
       Chapter 1's trick and it is still the cheapest good smoke there is:
       a stack of soft sprites that turn and never quite line up. */
    const smokeMat = new THREE.SpriteMaterial({
      map: dotTex, color: 0x9aa4b2, transparent: true, opacity: 0.10,
      depthWrite: false, fog: false });
    const smoke = new THREE.Group();
    world.add(smoke);
    const puffs = [];
    for (let i = 0; i < (LOW ? 8 : 16); i++) {
      const sp = new THREE.Sprite(smokeMat);
      const atBraz = i % 2 === 0;
      sp.position.set(atBraz ? BRAZ.x : ALTAR.x, 0.9 + i * 0.17,
                      atBraz ? BRAZ.z : ALTAR.z);
      const size = 0.6 + i * 0.13;
      sp.scale.setScalar(size);
      smoke.add(sp);
      puffs.push({ sp, ph: Math.random() * 10, atBraz, size,
                   base: 0.9 + i * 0.17 });
    }
    const embers = flying;      // the contract's other name for the same cloud

    /* ================================================================== */
    /* THE THING YOU CAN ACT ON                                           */
    /* ================================================================== */
    /* The altar, at the front, which you have to walk the whole aisle to get
       a proper look at. The radius stops you short of the ritual space — the
       medium's stool is a blocker — so the decision opens from the head of
       the aisle, which is exactly where a fifteen-year-old would actually
       be standing. */
    const PILE_POS = new THREE.Vector3(ALTAR.x, 0, ALTAR.z);
    /* Wide, because the RITUAL SPACE is walled off (see blockers) and the
       player is stopped at the head of the aisle, three and a half metres
       short of the altar. The first pass let them walk to within half a
       metre of the medium's back, which is both wrong about how anyone
       behaves at one of these and a bad shot: at that range he is an
       anonymous dark shape filling the frame. */
    const INTERACT_R = 4.0;
    const HIGHLIGHT_R = 6.6;
    const MARK_R = 13.0;

    const ringGeo = new THREE.RingGeometry(1.35, 1.85, 40);
    const altarRing = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({
      color: 0x63d6c8, transparent: true, opacity: 0, side: THREE.DoubleSide,
      depthWrite: false, fog: false }));
    altarRing.rotation.x = -Math.PI / 2;
    altarRing.position.set(0, 0.03, 0.55);
    altarRing.visible = false;
    altar.add(altarRing);

    const markGlow = new THREE.Sprite(new THREE.SpriteMaterial({
      map: makeSoftDot('rgba(99,214,200,0.85)', 'rgba(99,214,200,0)'),
      transparent: true, depthWrite: false, fog: false,
      blending: THREE.AdditiveBlending }));
    markGlow.scale.setScalar(0.9);
    const mark = new THREE.Sprite(new THREE.SpriteMaterial({
      map: makeMark(cnv), transparent: true, depthWrite: false, fog: false,
      sizeAttenuation: true }));
    mark.scale.setScalar(0.30);
    const markRoot = new THREE.Group();
    markRoot.position.set(0, 2.05, 0.30);
    markRoot.visible = false;
    markRoot.add(markGlow, mark);
    altar.add(markRoot);

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
      return _ndc.set(PILE_POS.x, 1.10, PILE_POS.z).project(camera);
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
      if (_ray.intersectObjects([tableTop, cloth, eBody], false).length) return true;
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
        markRoot.visible = altarRing.visible = false;
        return;
      }
      const dist = pileDist();
      const m = THREE.MathUtils.clamp(
        (MARK_R - dist) / (MARK_R - INTERACT_R) * 1.9, 0, 1);
      markRoot.visible = m > 0.01;
      if (markRoot.visible) {
        const beat = 0.72 + 0.28 * Math.sin(t * 3.1);
        markRoot.position.y = 2.05 + Math.sin(t * 1.9) * 0.10;
        mark.material.opacity = m;
        mark.scale.setScalar(0.30 * (0.93 + beat * 0.11));
        markGlow.material.opacity = m * beat * 0.5;
      }
      const near = THREE.MathUtils.clamp(
        (HIGHLIGHT_R - dist) / (HIGHLIGHT_R - INTERACT_R), 0, 1);
      const on = near > 0.01;
      altarRing.visible = on;
      if (on) altarRing.material.opacity = near * (0.62 + 0.38 * Math.sin(t * 2.6)) * 0.5;
    }

    /* ================================================================== */
    /* WHAT MOVES                                                         */
    /* ================================================================== */
    let noteStorm = 1;              // the contract's name for "how much air"
    let drumBeat = 1;               // scenes slow the ritual and stop it
    let crowdLife = 1;              // and can freeze the audience dead

    const _m4 = new THREE.Matrix4();
    function updateNotes(dt, t) {
      /* The canvas, breathing. A tentage in still air still moves, and it is
         the only thing above your head in this whole chapter. The panels
         nearest the eave move most, because that is the edge that is only
         tied down every four metres. */
      const cp = canvasGeo.attributes.position.array;
      for (let i = 0; i < cp.length; i += 3) {
        const u = canvasBase[i], v = canvasBase[i + 1];
        const edge = Math.abs(u) / T.x;                 // 0 at the ridge, 1 at the eave
        cp[i + 2] = canvasBase[i + 2]
          + (Math.sin(t * 0.9 + v * 0.42 + u * 0.3) * 0.055
           + Math.sin(t * 0.4 + v * 0.2) * 0.035) * noteStorm * (0.15 + edge);
      }
      canvasGeo.attributes.position.needsUpdate = true;
      const sp2 = skirtGeo.attributes.position.array;
      for (let i = 0; i < sp2.length; i += 3) {
        sp2[i + 2] = skirtBase[i + 2]
          + Math.sin(t * 1.3 + skirtBase[i] * 0.5) * 0.05 * noteStorm;
      }
      skirtGeo.attributes.position.needsUpdate = true;

      /* THE RITUAL, and a cutscene owns it outright while one is running.
         Without this, a scene that poses the medium or throws his flags up
         is overwritten by this function on the very same frame — the head
         survived only because nothing here writes head.rotation. */
      if (getState() === 'cine') return;

      // the priest keeps the beat, and the drum is the tent's pulse
      const swing = Math.sin(t * 2.4 * drumBeat);
      handDrum.rotation.z = swing * 0.16 * drumBeat;
      handDrum.children[1].rotation.z = 0.6 + Math.max(0, swing) * 0.5 * drumBeat;

      /* The medium. A slow tremor, and the flags turning over — enough that
         he is clearly not sitting still, never so much that he reads as a
         puppet. A cutscene takes this over by setting drumBeat to 0. */
      const md = medium.userData;
      md.head.position.x = Math.sin(t * 5.7) * 0.012 * drumBeat;
      md.torso.rotation.z = Math.sin(t * 1.7) * 0.05 * drumBeat;
      medium.rotation.z = Math.sin(t * 0.9) * 0.02 * drumBeat;
      for (let i = 0; i < flags.length; i++) {
        flags[i].rotation.z = (i ? 1 : -1) * (0.5 + Math.sin(t * 2.1 + i) * 0.35 * drumBeat);
      }

      // and the crowd, which breathes and does nothing else at all
      for (const f of crowd) {
        const ph = f.userData.ph;
        f.position.y = Math.sin(t * 1.1 + ph) * 0.008 * crowdLife;
        f.userData.head.rotation.y = Math.sin(t * 0.37 + ph) * 0.09 * crowdLife;
      }
      for (const f of standers) {
        const ph = f.userData.ph;
        f.position.y = Math.sin(t * 0.9 + ph) * 0.010 * crowdLife;
      }

      // embers, going up out of the brazier and the joss
      for (let i = 0; i < sparks.length; i++) {
        const s2 = sparks[i];
        s2.y += dt * s2.rise * noteStorm;
        if (s2.y > 3.6) { s2.y = 0.75; s2.ph = Math.random() * 10; }
        _m4.makeRotationY(t * 1.4 + s2.ph);
        _m4.setPosition(
          s2.ox + Math.sin(t * 1.1 + s2.ph) * s2.spread * (0.4 + s2.y * 0.3),
          s2.y,
          s2.oz + Math.cos(t * 0.9 + s2.ph) * s2.spread * (0.4 + s2.y * 0.3));
        flying.setMatrixAt(i, _m4);
      }
      flying.instanceMatrix.needsUpdate = true;

      /* The smoke columns. One shared material, so a puff cannot fade on its
         own — it grows instead, which at this opacity reads the same and
         costs one material rather than sixteen. */
      for (const p of puffs) {
        const rise = (t * 0.22 + p.ph) % 2.4;
        p.sp.position.y = p.base + rise;
        p.sp.position.x = (p.atBraz ? BRAZ.x : ALTAR.x)
          + Math.sin(t * 0.5 + p.ph) * 0.16 * (0.3 + rise / 2.4);
        p.sp.scale.setScalar(p.size * (0.55 + rise * 0.42));
      }
    }

    function updateFire(t) {
      const fl = 0.86 + Math.sin(t * 7.3) * 0.09 + Math.sin(t * 19.1) * 0.05;
      if (getState() !== 'cine') {
        fireLight.intensity = 3.4 * fl;
        brazLight.intensity = 2.8 * (0.82 + Math.sin(t * 5.1) * 0.14 + Math.random() * 0.05);
        mouth.material.color.setHSL(0.045, 1, 0.40 + fl * 0.13);
        for (const f of flames) f.scale.y = 0.86 + fl * 0.3;
      }
    }

    function updateSlow(sdt, t) {
      const p = haze.geometry.attributes.position.array;
      for (let i = 0; i < HAZE_N; i++) {
        p[i * 3 + 1] += sdt * (0.02 + (hazeSeed[i] % 1) * 0.035) * noteStorm;
        p[i * 3] += Math.sin(t * 0.24 + hazeSeed[i]) * sdt * 0.05;
        if (p[i * 3 + 1] > 3.9) {
          p[i * 3 + 1] = 0.2;
          p[i * 3] = (Math.random() - 0.5) * T.x * 1.95;
          p[i * 3 + 2] = (Math.random() - 0.5) * T.z * 1.95;
        }
      }
      haze.geometry.attributes.position.needsUpdate = true;
    }

    /* ------------------------------------------------------ cutscene state */
    function snap() {
      return {
        storm: noteStorm, beat: drumBeat, life: crowdLife,
        tent: tentLights.map(l => l.intensity),
        keyI: key.intensity, fire: fireLight.intensity, braz: brazLight.intensity,
        mediumRot: medium.rotation.clone(),
        mediumPos: medium.position.clone(),   // scene B borrows his body
        headRot: medium.userData.head.rotation.clone(),
        headPos: medium.userData.head.position.clone(),
        oddRot: chairRot[ODD_I], backRot: chairRot[BACK_I],
        auntieRot: auntie.rotation.y,
        hero: heroNote.visible, hazeOp: haze.material.opacity
      };
    }
    function restore(s) {
      noteStorm = s.storm; drumBeat = s.beat; crowdLife = s.life;
      tentLights.forEach((l, i) => { l.intensity = s.tent[i]; });
      key.intensity = s.keyI;
      fireLight.intensity = s.fire;
      brazLight.intensity = s.braz;
      medium.rotation.copy(s.mediumRot);
      medium.position.copy(s.mediumPos);
      medium.userData.head.rotation.copy(s.headRot);
      medium.userData.head.position.copy(s.headPos);
      chairRot[ODD_I] = s.oddRot; placeChair(ODD_I);
      chairRot[BACK_I] = s.backRot; placeChair(BACK_I);
      for (const im of chairIMs) im.instanceMatrix.needsUpdate = true;
      auntie.rotation.y = s.auntieRot;
      heroNote.visible = s.hero;
      haze.material.opacity = s.hazeOp;
    }

    // taken before a frame has run, so a restart gets the pristine values
    // however many times you go round
    const REST = {
      tent: tentLights.map(l => l.intensity),
      keyI: key.intensity,
      oddRot: chairRot[ODD_I], backRot: chairRot[BACK_I],
      auntieRot: auntie.rotation.y
    };
    function reset() {
      noteStorm = 1; drumBeat = 1; crowdLife = 1;
      tentLights.forEach((l, i) => { l.intensity = REST.tent[i]; });
      key.intensity = REST.keyI;
      medium.rotation.set(0, 0, 0);
      medium.position.set(MEDIUM.x, 0, MEDIUM.z);
      medium.userData.head.rotation.set(0, 0, 0);
      medium.userData.head.position.set(0, MED_HEAD_Y, 0);
      chairRot[ODD_I] = REST.oddRot; placeChair(ODD_I);
      chairRot[BACK_I] = REST.backRot; placeChair(BACK_I);
      for (const im of chairIMs) im.instanceMatrix.needsUpdate = true;
      auntie.rotation.y = REST.auntieRot;
      heroNote.visible = true;
      haze.material.opacity = 0.34;
    }

    /* ------------------------------------------------------------ collision
       There are no walls here, so the furniture is the level. The six
       seating blocks are built BY HAND rather than through
       Box3.setFromObject().expandByScalar(), and that is load-bearing:

         collide()   tests the player at y = 1.0
         lineClear() marches HER sightline at y = 1.4

       A box that tops out at 1.20 therefore stops you walking through the
       chairs and does NOT block her being seen over them — which is the
       entire staging of this chapter. An expanded box would reach 1.17+ from
       a 0.95 chair and start eating her appearances at random. */
    function blockers() {
      const out = [];
      const box = (x0, x1, y1, z0, z1) => out.push(new THREE.Box3(
        new THREE.Vector3(Math.min(x0, x1), -0.2, Math.min(z0, z1)),
        new THREE.Vector3(Math.max(x0, x1), y1, Math.max(z0, z1))));

      // the seating: two blocks a row, low enough to see over
      for (const rz of ROW_Z) {
        box(-4.10, -0.45, 1.20, rz - 0.60, rz + 0.60);
        box(0.45, 4.10, 1.20, rz - 0.60, rz + 0.60);
      }
      // and the things that are actually solid
      box(ALTAR.x - 1.75, ALTAR.x + 1.75, 2.60, ALTAR.z - 1.30, ALTAR.z + 0.75);
      /* THE RITUAL SPACE, not the man: the whole floor between the front row
         and the altar, which is the part of a tentage nobody walks into. It
         is what stops the player at the head of the aisle. */
      box(-1.35, 1.35, 1.60, -6.40, -4.05);
      box(-2.35, -1.15, 1.90, -7.10, -5.90);                       // the priest
      box(BRAZ.x - 0.75, BRAZ.x + 0.75, 1.20, BRAZ.z - 0.75, BRAZ.z + 0.75);
      box(PAPER.x - 1.35, PAPER.x + 0.75, 1.20, PAPER.z - 1.20, PAPER.z + 1.20);
      // the giant joss, which stands OUTSIDE the altar's own box
      for (const bx of [-2.0, 2.0]) {
        box(ALTAR.x + bx - 0.22, ALTAR.x + bx + 0.22, 2.60,
            ALTAR.z + 0.10 - 0.22, ALTAR.z + 0.10 + 0.22);
      }
      // the poles, so you cannot walk out through the frame — including the
      // two CENTRE uprights, one of which stands in the entrance itself
      for (const sx of [-1, 1]) {
        for (const pz of POLE_Z) {
          box(sx * T.x - 0.22, sx * T.x + 0.22, 2.90, pz - 0.22, pz + 0.22);
        }
      }
      for (const pz of [-T.z, T.z]) box(-0.22, 0.22, 2.90, pz - 0.22, pz + 0.22);
      // and the people standing at the edges, who were walk-through
      for (const f of standers) {
        box(f.position.x - 0.28, f.position.x + 0.28, 1.20,
            f.position.z - 0.24, f.position.z + 0.24);
      }
      return out;
    }

    /* ------------------------------------------------------------ teardown
       Advancing a chapter is dispose() then build(), never a page reload.
       This gives the GPU back everything build() took — geometries,
       materials, and the textures hanging off them, which removing objects
       from the scene does NOT free. Copied from chapter 2 exactly, plus the
       three InstancedMesh geometries, which world.traverse() does reach but
       which are worth naming here so nobody removes them by accident.
       leaktest builds and disposes many times over and watches
       renderer.info; this discipline is the only thing that passes it. */
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
      for (const im of [...chairIMs, flying, trunkIM, leafIM]) im.dispose?.();
      for (const g of geos) g.dispose();
      for (const m of mats) {
        for (const k of ['map', 'roughnessMap', 'normalMap', 'emissiveMap', 'alphaMap']) {
          m[k]?.dispose?.();
        }
        m.dispose();
      }
      // the procedural sources, which no mesh points at directly
      for (const t of [gTex.map, gTex.rough, cTex.map, cTex.rough,
                       parkMap, parkRough, lacquerTex,
                       noteTex, dotTex, canvasTex, floralTex, goldTex]) t?.dispose?.();
      world.clear();
      S = null;
    }

    return (S = {
      world, noteTex, blockers: blockers(),
      ready: () => hdbReady,
      pile: {
        pos: PILE_POS, radius: INTERACT_R, group: altar,
        dist: pileDist, screen: pileScreen, inView: pileInView,
        hits: pointerHitsPile, interact: interactPile,
        glow: () => altarRing.material.opacity
      },

      /* The contract's own prop names first — chapter 1 called them drum,
         ash, smoke and embers, and here the brazier really is a drum with
         ash in it — and then this chapter's cast, which its scenes direct. */
      drum, ash, embers, heroNote, smoke, flying, jossTips, fireLight,
      tent, tentLights, key, bounce, tubes, canvasGeo, roof, skirtL, skirtR,
      altar, tableTop, effigy, bigTips, flames, altarRing,
      medium, stool, flags, priest, handDrum, auntie, paperTable,
      brazier, brazLight, mouth, crowd, standers, crowdRoot, haze,
      seatIM, backIM, legIM, chairAt, chairRot, ODD_I, BACK_I,
      ALTAR, MEDIUM, BRAZ, PAPER, T, ROW_Z, COL_X,
      turnChair(i, ry) { chairRot[i] = ry; placeChair(i);
        for (const im of [seatIM, backIM, legIM]) im.instanceMatrix.needsUpdate = true; },
      get noteStorm() { return noteStorm; },
      set noteStorm(v) { noteStorm = v; },
      get drumBeat() { return drumBeat; },
      set drumBeat(v) { drumBeat = v; },
      get crowdLife() { return crowdLife; },
      set crowdLife(v) { crowdLife = v; },

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
     Four the engine does not carry, because only this chapter is a tent.   */

  // The canvas: the red-and-white vertical stripe every tentage in Singapore
  // is made of, dirtied down so it does not read as a circus.
  function makeStripe(cnv) {
    const s = 256, [c, ctx] = cnv(s);
    /* Dingy on purpose. The first pass used a clean near-white and a bright
       red at three stripes across, and from inside it read as a circus: this
       canvas has been up since Monday in the rain. */
    ctx.fillStyle = '#b0a99b'; ctx.fillRect(0, 0, s, s);
    ctx.fillStyle = '#8c2a25';
    for (let i = 0; i < 4; i++) ctx.fillRect(i * (s / 4) + s / 8, 0, s / 8, s);
    // grime, and the weave
    ctx.globalAlpha = 0.16;
    for (let i = 0; i < 1600; i++) {
      ctx.fillStyle = Math.random() < 0.5 ? '#000' : '#5a5348';
      ctx.fillRect(Math.random() * s, Math.random() * s, 2 + Math.random() * 7, 1.5);
    }
    // and the streaks that run down a canvas panel between its ties
    ctx.globalAlpha = 0.13;
    ctx.fillStyle = '#2a2620';
    for (let i = 0; i < 40; i++) {
      ctx.fillRect(Math.random() * s, 0, 1 + Math.random() * 3, s);
    }
    ctx.globalAlpha = 0.20;
    ctx.fillStyle = '#22211d';
    for (let y = 0; y < s; y += 3) ctx.fillRect(0, y, s, 1);
    ctx.globalAlpha = 1;
    const t = finishTex(c);
    t.repeat.set(4, 7);
    return t;
  }

  // Her top. A small floral print is the whole characterisation of an auntie
  // at a temple event, and it costs one canvas.
  function makeFloral(cnv) {
    const s = 128, [c, ctx] = cnv(s);
    ctx.fillStyle = '#2f4a4f'; ctx.fillRect(0, 0, s, s);
    const petals = ['#c98a9b', '#e0c07a', '#8fae92', '#d6d0c0'];
    for (let i = 0; i < 34; i++) {
      const x = Math.random() * s, y = Math.random() * s, r = 3 + Math.random() * 4;
      ctx.fillStyle = petals[(Math.random() * petals.length) | 0];
      for (let p = 0; p < 5; p++) {
        const a = (p / 5) * Math.PI * 2;
        ctx.beginPath();
        ctx.ellipse(x + Math.cos(a) * r * 0.7, y + Math.sin(a) * r * 0.7,
                    r * 0.5, r * 0.34, a, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    const t = finishTex(c);
    t.repeat.set(2, 2);
    return t;
  }

  // Joss paper: gold leaf squared onto rough yellow stock.
  function makeGoldPaper(cnv) {
    const s = 128, [c, ctx] = cnv(s);
    ctx.fillStyle = '#d8bd6e'; ctx.fillRect(0, 0, s, s);
    ctx.globalAlpha = 0.6;
    for (let i = 0; i < 260; i++) {
      ctx.fillStyle = Math.random() < 0.5 ? '#c4a556' : '#e8d792';
      ctx.fillRect(Math.random() * s, Math.random() * s, 2, 2);
    }
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#b8912f';
    ctx.fillRect(s * 0.30, s * 0.30, s * 0.40, s * 0.40);
    ctx.fillStyle = '#e8d792';
    ctx.fillRect(s * 0.34, s * 0.34, s * 0.32, s * 0.32);
    return finishTex(c);
  }

  // the interact mark, the same exclamation the other two chapters float
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

  /* All four hand their canvas here rather than reaching for THREE
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
  /* THE SCENES — appended below                                            */
  /* ====================================================================== */
  /* Written in the engine's cutscene language. Every TRACK is a description
     of where things ARE at time t — never a nudge — because the engine
     re-derives them from absolute values each frame, which is the only
     reason skipping and seeking work at all (see LEARNINGS).

     Where the camera lives in this tent, in one place, so five scenes agree: */
  const EYE = 1.62;
  const OUTSIDE  = { x: 0.90, y: EYE, z: 20.5 };   // out in the dark car park
  const GATE     = { x: 0.60, y: EYE, z: 9.60 };   // the tent's open back end
  const BACKROW  = { x: 0.30, y: EYE, z: 6.00 };   // behind the last row
  const WATCH    = { x: 0.00, y: EYE, z: 3.00 };   // in the aisle, watching
  const FRONT    = { x: 0.00, y: EYE, z: -4.75 };  // the head of the aisle
  const INSIDE   = { x: 0.00, y: EYE, z: -5.00 };  // in the ritual space itself
  const TABLE    = { x: 2.90, y: EYE, z: -0.55 };  // stood at the paper table
  const AWAY     = { x: 1.20, y: EYE, z: 15.5 };   // back out in the car park
  const FAR      = { x: 1.20, y: EYE, z: 19.5 };   // and still going

  /* --------------------------------------------------------- THE OPENING --
     Runs before the chapter card, on a screen that is already black. It is
     the first thing anyone sees of chapter 3 and it has three jobs: get him
     down from the flat to the car park, show him the tent from outside so
     the tent means something, and leave him looking at the one chair that
     is facing the wrong way.

     A MORNING, since Chad's note. The night version opened on a box of light
     in a black car park, which is a shot you simply cannot have at ten in
     the morning — so the equivalent is the other way up: fade in on the
     glare and the top of the block, then tilt DOWN and find the tent
     underneath, already full. Same job, opposite gesture.

     The sound is the spine of it either way. The tent's loops are already
     running when the film starts — the engine plays a chapter's beds through
     a cutscene — so the film DUCKS them to almost nothing while the camera
     is twenty metres out, brings them up on the same track as the walk in,
     and then kills the drum outright at twenty-two seconds. That silence is
     the shot, and it is the one beat daylight cannot touch.

     It ends on black and KEEPS it, so the chapter card comes up over the
     dark rather than over the tent.                                       */
  function intro(c, s, api) {
    const { tr, step, sfx, fade, camTo, yawTo, pitchTo, bob, faceFrom,
            rawK, smoothK, duck, stage, ghost, ghostOpacity, ghostLight,
            handsRoot, armR } = api;

    const ODDC = stage.chairAt[stage.ODD_I];
    /* HER mark: far out on the open tarmac, in the corridor the trees were
       deliberately kept out of, framed dead centre by the tent's open back.
       Not at the chair. Not in the tent. That is the entire revision. */
    const HER = { x: 2.3, z: 23.5 };

    step(0, () => {
      armR.visible = false;               // the hands have no business in this
      stage.drumBeat = 1;
      stage.crowdLife = 1;
      stage.noteStorm = 1;
      ghostOpacity(0);
      stage.turnChair(stage.ODD_I, Math.PI);   // one empty chair, facing out
    });

    /* 0-2.8  black, and the tent heard from a long way off. The loops are
       already running, so this is a duck and not a cue. */
    tr(0, 0.4, () => { duck('tentamb', 0.16); duck('ritual', 0.11);
                       duck('ceremony', 0.09); duck('crowdmur', 0.12);
                       duck('hornloop', 0.08); duck('cymloop', 0.08);
                       duck('crowdreact', 0.10); }, rawK);
    sfx(0.55, 'drum', 0.55);
    sfx(1.00, 'v3wake1');                 // "They put the tent up on Monday."
    camTo(0, 0.1, OUTSIDE, OUTSIDE);
    yawTo(0, 0.1, 0, 0);                  // yaw 0 is -z, which is the tent
    pitchTo(0, 0.1, 0.40, 0.40);          // positive is UP: the sky, and glare

    /* 2.6-5.4  fade up, and it is BRIGHT — the hazy top of the block, the sun
       somewhere off to the left, and nothing else in frame at all. */
    fade(2.6, 5.4, 1, 0);
    sfx(3.4, 'drum', 0.5);
    sfx(4.6, 'cymbal', 0.30);

    /* 4.4-9.6  and then the camera comes down off the sky, and the tent is
       underneath it, and it is already full of people. */
    pitchTo(4.4, 9.6, 0.40, -0.02, smoothK);

    /* 5.2-13.0  he walks in. The dolly and the sound come up on one track,
       which is the only way this ever sounds right. */
    camTo(5.2, 13.0, OUTSIDE, GATE, smoothK);
    bob(5.2, 13.0, 0.82, 0.030, EYE);
    tr(5.2, 13.0, k => {
      duck('tentamb', 0.16 + 0.84 * k);
      duck('ritual', 0.11 + 0.89 * k);
      duck('ceremony', 0.09 + 0.91 * k);   // the band arrives with the walk
      duck('crowdmur', 0.12 + 0.88 * k);
      duck('hornloop', 0.08 + 0.92 * k);
      duck('cymloop', 0.08 + 0.92 * k);
      duck('crowdreact', 0.10 + 0.90 * k);
    }, rawK);
    sfx(6.0, 'step', 0.30); sfx(6.9, 'step', 0.32);
    sfx(7.8, 'drum', 0.6);
    sfx(8.6, 'step', 0.30); sfx(9.5, 'step', 0.32);
    sfx(11.6, 'v3wake2');                 // "My mother told me not to come down."
    sfx(12.0, 'drum', 0.7);

    /* 13.0-17.4  inside the back of it now, and the detail goes past him: the
       brazier taking a bundle of paper, the auntie's table, the stacks. */
    camTo(13.0, 17.4, GATE, BACKROW, smoothK);
    bob(13.0, 17.4, 0.78, 0.026, EYE);
    yawTo(13.0, 16.0, 0, faceFrom(BACKROW.x, BACKROW.z, stage.PAPER.x, stage.PAPER.z),
          smoothK);
    pitchTo(13.0, 16.0, -0.02, -0.07, smoothK);
    // the brazier's smoke going straight up in the still morning air
    tr(13.0, 17.4, k => { stage.noteStorm = 1 + 0.5 * k; }, rawK);
    sfx(13.9, 'burn', 0.65);
    sfx(14.4, 'step', 0.30);
    sfx(15.4, 'drum', 0.7);
    sfx(16.2, 'step', 0.30);

    // 16.0-21.5  and back to the front, because that is where everyone is looking
    yawTo(16.0, 19.4, faceFrom(BACKROW.x, BACKROW.z, stage.PAPER.x, stage.PAPER.z),
          0, smoothK);
    pitchTo(16.0, 19.4, -0.07, -0.01, smoothK);
    camTo(17.4, 21.5, BACKROW, { x: 0.05, y: EYE, z: 4.60 }, smoothK);
    bob(17.4, 21.5, 0.70, 0.020, EYE);
    sfx(18.4, 'drum', 0.8);
    sfx(19.8, 'cymbal', 0.55);
    sfx(20.6, 'drum', 0.8);

    /* 21.9-22.6  THE DRUM STOPS. Forty people and nothing. This is the whole
       reason a cutscene can hold a chapter's loops down. */
    tr(21.9, 22.6, k => {
      duck('ritual', 1 - k);
      duck('ceremony', 1 - k);             // the whole band, not just the drum
      duck('hornloop', 1 - k);
      duck('cymloop', 1 - k);
      duck('crowdreact', 1 - 0.9 * k);     // and the audience holds its breath
      stage.drumBeat = 1 - k;
    }, rawK);

    /* 22.4-26.0  he leans in — and at the front the medium's head goes back,
       one hard wrong movement, and not one person in the tent reacts. */
    camTo(22.4, 26.0, { x: 0.05, y: EYE, z: 4.60 }, WATCH, smoothK);
    sfx(23.3, 'gong', 0.85);
    tr(23.3, 24.1, k => {
      stage.medium.userData.head.rotation.x = -0.85 * k;
      stage.medium.rotation.x = -0.20 * k;
      stage.flags[0].rotation.z = 0.5 + 1.3 * k;
      stage.flags[1].rotation.z = -0.5 - 1.3 * k;
    }, smoothK);
    sfx(23.9, 'cymbal', 0.9);
    step(24.2, () => { stage.crowdLife = 0.12; });   // nobody moves. nobody.
    sfx(24.6, 'breath', 0.55);
    sfx(25.0, 'v3wake3');                 // "Everyone seems fascinated by the performance..."

    /* 26.8-30.2  the camera comes off the front — slowly, the way you look
       when you do not want to — and finds the one chair that is facing the
       wrong way. It is EMPTY. Forty people watch the man at the altar; one
       red plastic chair in row four has been turned to face the open back
       of the tent and the car park beyond it, and nobody sits in it, and
       nobody looks at it. */
    /* the camera CRANES — up half a metre and over the back rows — because
       at eye height the crowd's heads swallow the one empty seat; from just
       above them a single unoccupied red chair, turned the wrong way in a
       full tent, reads instantly */
    const CRANE = { x: -0.35, y: 2.20, z: 4.60 };
    const LOOKCHAIR = faceFrom(CRANE.x, CRANE.z, ODDC.x, ODDC.z);
    camTo(26.8, 29.8, WATCH, CRANE, smoothK);
    yawTo(26.8, 29.8, 0, LOOKCHAIR, smoothK);
    pitchTo(26.8, 29.8, -0.01, -0.34, smoothK);
    sfx(27.4, 'chair', 0.5);
    /* ONE line at a time, everywhere in this film: wake3 ends at 28.97,
       this starts at 29.4, and everything after moves down to keep it so.
       Two James lines talking over each other was the first thing Chad
       heard in the shipped version, because of course it was. */
    sfx(29.4, 'v3chair');       // "There's one chair facing the wrong way. Just one."

    /* 30.4-34.2  and the camera LIFTS along the line the chair faces — out
       through the open back of the tent, into the glare — AND SHE IS OUT
       THERE. Twenty metres of empty tarmac, full sun, facing the tent.
       Utterly still. Not coming closer. NOT COMING IN.

       No sting under her, and no ghost sound anywhere in this chapter —
       the ceremony stopped its own drum a beat ago, so what plays under
       the reveal is a tent's worth of silence. In three chapters nothing
       has frightened her. The tent does. That is the shot. */
    step(34.2, () => {
      ghost.position.set(HER.x, 0, HER.z);
      ghost.rotation.y = Math.PI;        // facing the tent: forward is +z at 0
    });
    yawTo(34.4, 37.2, LOOKCHAIR, Math.PI + 0.094, smoothK);  // her, dead centre
    pitchTo(34.4, 37.2, -0.34, -0.005, smoothK);
    camTo(34.4, 37.2, CRANE, { x: 0.30, y: EYE, z: 2.30 }, smoothK);
    /* she RESOLVES out of the glare rather than fading in — full daylight,
       so she carries herself, and the light on her is nearly nothing */
    tr(35.6, 37.6, k => {
      ghostOpacity(0.88 * k);
      ghostLight.intensity = 0.12 * k;
    }, rawK);
    sfx(35.0, 'breath', 0.5);
    sfx(38.0, 'v3out1');        // "She's out there! Standing outside..."
    sfx(42.6, 'heart', 0.45);

    // 43.7  four words, and they change what the whole game has been about
    sfx(43.7, 'v3out2');        // "She's not coming in."
    fade(45.6, 47.6, 0, 1);
    // the drum starts again, alone, in the black — the tent does not care
    tr(46.2, 47.6, k => { duck('ritual', 0.55 * k); }, rawK);
    sfx(46.6, 'drum', 0.7);

    step(47.6, () => {
      armR.visible = true;
      stage.crowdLife = 1;
      stage.drumBeat = 1;
      stage.medium.userData.head.rotation.x = 0;
      stage.medium.rotation.x = 0;
    });
    c.keep.ghostGone = true;      // she is not standing there when play starts
    c.endFade = 1;
    c.keepFade = true;            // the chapter card comes up over this black
  }

  /* ------------------------------------------------- A · OBSERVE QUIETLY --
     The good answer, and the scene about NOT acting — so the camera barely
     moves and the RITUAL does all of the work. He backs off to the aisle
     and watches, and the trance climbs: the drum doubles, the bell, the
     flags, the horn over the top of it. And then the payoff of watching
     carefully, which is that something watches back: the medium's head
     comes up — not thrown back at the sky, LEVEL — and out of forty people
     he finds the one who is looking, and holds him, and lets him go.

     No scream and no chase. The good answer is paid in information and
     costs almost nothing, and a man looking at you with a god behind his
     face is worse than a jump.                                          */
  function scWatch(c, s, api) {
    const { tr, step, sfx, fade, camTo, yawTo, pitchTo, rawK, smoothK,
            duck, stage, camera } = api;

    // he goes back rather than forward, which is the choice, told as a move
    camTo(0, 2.0, { x: s.yawPos.x, y: s.yawPos.y, z: s.yawPos.z }, WATCH, smoothK);
    yawTo(0, 2.0, s.yawRot, 0, smoothK);
    pitchTo(0, 2.0, s.pitchX, -0.02, smoothK);
    sfx(0.4, 'step', 0.3); sfx(1.2, 'step', 0.3);

    /* 2.0-7.4  the trance climbs, one instrument at a time. Nothing here is
       a jump: it is five seconds of a ceremony finding a higher gear. */
    tr(2.0, 7.4, k => {
      stage.drumBeat = 1 + 1.9 * k;
      stage.noteStorm = 1 + 1.6 * k;
      duck('ceremony', 1 + 0.45 * k);          // the band leans IN
      duck('hornloop', 1 + 0.35 * k);
      duck('cymloop', 1 + 0.5 * k);
    }, rawK);
    sfx(2.3, 'drumroll', 0.8);
    sfx(3.6, 'bellring', 0.7);
    tr(3.2, 7.0, (k, t2) => {
      stage.flags[0].rotation.z = 0.5 + 0.9 * k * Math.sin(t2 * 6.4);
      stage.flags[1].rotation.z = -0.5 - 0.9 * k * Math.sin(t2 * 5.7);
    }, rawK);
    sfx(5.0, 'cymbal', 0.7);
    sfx(6.2, 'suona', 0.85);                   // the horn over the top of it

    /* 7.4-8.2  and everything stops AT ONCE — band, drum, forty paper fans —
       because the medium's head has come up. Not back. LEVEL. */
    tr(7.4, 8.2, k => {
      duck('ceremony', 1.45 * (1 - k));
      duck('ritual', 1 - k);
      duck('crowdmur', 1 - 0.85 * k);
      duck('hornloop', 1.35 * (1 - k));
      duck('cymloop', 1.5 * (1 - k));
      duck('crowdreact', 1 - k);
      stage.drumBeat = 2.9 * (1 - k);
      stage.crowdLife = 1 - 0.9 * k;
    }, rawK);
    tr(7.6, 8.4, k => {
      stage.medium.userData.head.rotation.x = 0.16 * k;   // tipped at the aisle
    }, smoothK);
    sfx(8.0, 'gongdeep', 0.55);

    /* 8.4-12.6  he is being looked at, from the front of the tent, by a man
       whose eyes the distance keeps him from seeing — and the shot just
       HOLDS, with one slow push-in, which is the scene. */
    camTo(8.4, 12.6, WATCH, { x: WATCH.x, y: EYE, z: WATCH.z - 0.55 }, smoothK);
    tr(8.4, 12.6, k => { camera.rotation.z = 0.014 * Math.sin(k * Math.PI); }, rawK);
    sfx(8.8, 'trancehum', 0.6);
    sfx(9.6, 'v3seen');       // "He looked at me. Out of all of them... he looked at me."

    /* 12.6-14.0  the head goes back to the altar as if nothing happened,
       and the band picks up mid-phrase, and not one person reacts. */
    tr(12.6, 13.4, k => {
      stage.medium.userData.head.rotation.x = 0.16 * (1 - k);
    }, smoothK);
    tr(12.8, 14.2, k => {
      duck('ceremony', k);
      duck('ritual', k);
      duck('crowdmur', 0.15 + 0.85 * k);
      duck('hornloop', k);
      duck('cymloop', k);
      duck('crowdreact', k);
      stage.drumBeat = k;
      stage.crowdLife = 0.1 + 0.9 * k;
    }, rawK);
    sfx(13.2, 'drum', 0.6);
    sfx(14.0, 'bellring', 0.4);

    // 15.2-19.6  and out, with the ceremony refusing to be interesting
    // again. v3seen's take runs 8.4 seconds; the fade waits for it.
    sfx(15.2, 'breath', 0.5);
    fade(17.6, 19.6, 0, 1);

    c.endFade = 1;
  }

  /* ---------------------------------------------------- B · JOIN THE RITUAL
     The worst answer, and the loudest scene in the game. He goes up with the
     others and puts his hands together, and the tent takes it badly: the
     drum crowds in, the tubes start to strobe, the chant doubles into
     something that is not language. Then one frame of nothing — and the
     MEDIUM is on the lens. The man from the altar, face to face, head
     tilted the wrong amount, eyes shut. Nothing in this tent is hers; what
     lives here answers to nobody's grief, and joining uninvited is how you
     meet it.

     It ends the way the source says it ends — an experienced practitioner
     notices and hauls him out of it. The last thing in the scene is a
     woman's hand on his arm.                                             */
  function scJoin(c, s, api) {
    const { tr, step, sfx, fade, camTo, yawTo, pitchTo, faceFrom,
            rawK, smoothK, duck, stage, camera,
            handsRoot, armR, PRAYER_R, PRAYER_L, setHandPrayer, handWidth,
            buildPrayerArm, rightHand, vmKey, vmHemi, vmFire, THREE } = api;

    // the mirrored left arm is built on the fly, and the tracks after that
    // read it, so the scene holds its own reference
    let prayerArmL = null;

    camTo(0, 2.6, { x: s.yawPos.x, y: s.yawPos.y, z: s.yawPos.z }, INSIDE, smoothK);
    yawTo(0, 2.6, s.yawRot, 0, smoothK);
    pitchTo(0, 2.6, s.pitchX, -0.04, smoothK);
    /* the viewmodel's rest levels are the CHAPTER's now (daylight reaches
       the hands since v4.3), so the brighten below starts from wherever
       this chapter put them rather than from midnight's constants */
    let H0 = 1.0, K0 = 0.8;
    step(0, () => { H0 = vmHemi.intensity; K0 = vmKey.intensity; armR.visible = true; });
    sfx(0.5, 'step', 0.34); sfx(1.3, 'step', 0.34); sfx(2.1, 'step', 0.34);
    sfx(0.9, 'drum', 0.7);

    /* 1.6-3.4  the hands go up into anjali, the same clasp chapter 1 uses to
       excuse itself politely — and here it is the wrong thing to do. */
    step(1.6, () => {
      prayerArmL = buildPrayerArm();
      if (prayerArmL) prayerArmL.visible = true;
    });
    const half = handWidth() * 0.085;
    /* How high the clasp is held, and the one number every height in this
       scene is derived from. Chapter 1 holds its añjali at -0.235; this one
       hangs 3 cm lower, and the reason is the THUMBS. In this pose they
       splay wide off the base of each hand, and at chapter 1's height their
       flesh sits within about 20 px of the bottom letterbox — close enough
       that the tremble below (which used to lift the hands 5 cm above this)
       swung two pale wedges up into shot that read as stray fingers rather
       than as hands.

       Measured, not guessed, and in fractions of frame height so it holds on
       a phone as well as a laptop (the viewmodel camera's 52° is a VERTICAL
       fov, so the visible band at this depth does not change with the shape
       of the screen). At the worst frame the topmost thumb BONE now sits at
       102% of frame height and its flesh reaches about 7% above that — a
       clear 6% below the 89% line where the letterbox starts. Push the clasp
       any lower and the trough of the tremble takes the fingertips out of
       shot with it; that is the other wall this number is between.       */
    const PRAY_Y = -0.265;
    const startR = armR.quaternion.clone();
    const startL = new THREE.Quaternion();
    let gotStartL = false;
    tr(1.6, 3.4, k => {
      const y = -0.46 + (PRAY_Y + 0.46) * k;
      armR.position.set(half, y, -0.375);
      armR.quaternion.slerpQuaternions(startR, PRAYER_R, k);
      if (prayerArmL) {
        if (!gotStartL) { startL.copy(prayerArmL.quaternion); gotStartL = true; }
        prayerArmL.position.set(-half, y, -0.375);
        prayerArmL.quaternion.slerpQuaternions(startL, PRAYER_L, k);
      }
      if (rightHand()) setHandPrayer(rightHand(), k);
      if (prayerArmL) setHandPrayer(prayerArmL.userData.model, k);
      handsRoot.position.set(0, Math.sin(k * Math.PI) * 0.008, 0);
    });
    tr(1.6, 3.2, k => {
      vmHemi.intensity = H0 + 0.40 * k;
      vmKey.intensity = K0 + 0.40 * k;
      vmFire.intensity = 2.4;
    }, rawK);
    sfx(2.4, 'bowl', 0.7);
    sfx(3.0, 'breath', 0.6);

    /* 3.4-8.4  and it goes wrong. The drum crowds in, the tubes lose their
       nerve, the air thickens, and the whole shot leans over. Nothing here
       is a jump: it is four seconds of getting steadily worse. */
    tr(3.4, 8.4, k => {
      duck('ritual', 1 + 1.6 * k);
      duck('ceremony', 1 + 1.1 * k);       // the band crowds in with the drum
      duck('hornloop', 1 + 0.8 * k);
      duck('cymloop', 1 + 1.5 * k);        // the cymbals most of all
      stage.drumBeat = 1 + 2.4 * k;
      stage.noteStorm = 1 + 4.5 * k;
      stage.haze.material.opacity = 0.34 + 0.34 * k;
    }, rawK);
    // the tubes: a bad ballast, then a worse one
    tr(4.2, 9.0, (k, t2) => {
      const fl = 1 - Math.pow(k, 1.4) * (0.55 + 0.45 * Math.sin(t2 * 31.0));
      for (const l of stage.tentLights) l.intensity = REST_TENT * Math.max(0.05, fl);
      stage.key.intensity = REST_KEY * Math.max(0.05, fl);
    }, rawK);
    camTo(3.4, 8.4, INSIDE, { x: -0.18, y: 1.54, z: -5.55 }, rawK);
    pitchTo(3.4, 8.4, -0.04, 0.06, rawK);
    tr(3.4, 8.4, k => { camera.rotation.z = 0.11 * Math.sin(k * Math.PI * 1.3); }, rawK);
    /* The hands shake as it goes wrong — but only half as far as they used
       to, and centred on the clasp's height rather than swinging 5 cm above
       it. The old amplitude put the thumbs in frame at every peak and took
       the clasp nearly out of it at every trough; this reads as a tremble
       instead of a bounce, and never leaves the safe band. */
    tr(4.0, 8.4, k => {
      const y = PRAY_Y + 0.020 * Math.sin(k * Math.PI * 4);
      armR.position.y = y;
      if (prayerArmL) prayerArmL.position.y = y;
    }, rawK);
    sfx(4.4, 'drum', 0.9);
    sfx(5.2, 'gong', 0.8);
    sfx(5.9, 'cymbal', 0.9);
    sfx(6.4, 'suona', 0.6);              // the horn, not her — nothing here is hers
    sfx(7.0, 'drum', 1);
    sfx(8.1, 'cymbal', 1);

    /* 8.4-8.9  everything stops. Half a second of a tent with nothing in it. */
    tr(8.4, 8.9, k => {
      duck('ritual', 2.6 * (1 - k) * (1 - k));
      duck('ceremony', 2.1 * (1 - k) * (1 - k));
      duck('hornloop', 1.8 * (1 - k) * (1 - k));
      duck('cymloop', 2.5 * (1 - k) * (1 - k));
      duck('tentamb', 1 - 0.9 * k);
      duck('crowdmur', 1 - 0.9 * k);
      duck('crowdreact', 1 - k);
      stage.drumBeat = 3.4 * (1 - k);
      stage.crowdLife = 1 - k;
      for (const l of stage.tentLights) l.intensity = REST_TENT * (0.05 + 0.35 * k);
      stage.key.intensity = REST_KEY * (0.05 + 0.35 * k);
    }, rawK);
    tr(8.4, 8.9, k => { camera.rotation.z = 0.11 * (1 - k); }, rawK);

    /* 8.9  and the MEDIUM is on the lens. Not her — nothing in this tent is
       hers. The man from the altar, face to face, close enough to touch,
       head tilted the way no one tilts a head, and his eyes are SHUT. The
       scene borrows his body: snap()/restore()/reset() carry his position
       since v4.3, so a skip cannot leave him standing in the aisle. */
    const MED0 = new THREE.Vector3();
    step(8.9, () => {
      MED0.copy(stage.medium.position);
      stage.medium.position.set(-0.18, 0, -6.42);   // right in front of the lens
      stage.medium.userData.head.rotation.x = 0.10;
      stage.medium.userData.head.rotation.z = 0.42;  // tilted, the wrong amount
    });
    sfx(8.92, 'boom');
    sfx(9.0, 'gongdeep', 0.9);
    sfx(9.1, 'trancehum', 0.8);
    sfx(9.25, 'suona', 0.9);

    /* 9.0-11.6  he goes over backwards, and the room goes with him — and the
       man's face does not follow him down. It stays exactly where it was. */
    camTo(9.0, 10.8, { x: -0.18, y: 1.54, z: -5.55 },
                     { x: 0.42, y: 1.06, z: -3.90 }, rawK);
    pitchTo(9.0, 10.8, 0.06, 0.46, rawK);
    /* Ends on sin(1.4*PI) = -0.95, so it would hold sixteen degrees of roll
       for as long as the scene runs. The settle below is pushed later and
       therefore wins. */
    tr(9.0, 11.6, k => { camera.rotation.z = 0.30 * Math.sin(k * Math.PI * 1.4); }, rawK);
    tr(11.6, 13.4, k => { camera.rotation.z = -0.285 * (1 - k); }, smoothK);
    tr(9.0, 10.4, k => {
      const y = PRAY_Y - 0.42 * k;
      armR.position.y = y;
      if (prayerArmL) prayerArmL.position.y = y;
      handsRoot.position.set(0.10 * k, -0.06 * k, 0);
    }, rawK);
    sfx(9.6, 'v3grip');     // "His eyes were shut. He was looking at me with
                            //  his eyes shut."
    tr(9.4, 12.4, k => {
      duck('tentamb', 0.1 + 0.9 * k);
      for (const l of stage.tentLights) l.intensity = REST_TENT * (0.4 + 0.6 * k);
      stage.key.intensity = REST_KEY * (0.4 + 0.6 * k);
      stage.crowdLife = k;
      stage.drumBeat = k;
      duck('ritual', k);
      duck('ceremony', k);
      duck('crowdmur', k);
      duck('hornloop', k);
      duck('cymloop', k);
      duck('crowdreact', k);
    }, rawK);

    /* 11.5-14.4  a hand on his arm, and the tent from a long way off. The
       camera is yanked toward the paper table — which is when the medium is
       put back at the altar, off-frame, as if he never moved. Because he
       never moved. Ask anyone in the tent. */
    camTo(11.5, 14.2, { x: 0.42, y: 1.06, z: -3.90 },
                      { x: 2.30, y: 1.48, z: -2.20 }, smoothK);
    yawTo(11.5, 14.2, 0, -0.95, smoothK);
    pitchTo(11.5, 14.2, 0.46, -0.02, smoothK);
    step(12.4, () => {
      stage.medium.position.copy(MED0);
      stage.medium.userData.head.rotation.x = 0;
      stage.medium.userData.head.rotation.z = 0;
    });
    sfx(14.6, 'v3aunt5');   // "Boy! Boy, come out. You cannot stand there."
    sfx(15.2, 'step', 0.4); sfx(15.8, 'step', 0.4);
    /* ONE voice at a time: the panting take runs 4.4 seconds, so it waits
       for the auntie to finish (17.9) and then trails into the black —
       breathing under a fade-out is the one thing allowed to be cut off */
    sfx(18.2, 'vpant', 0.7);
    sfx(19.4, 'gongdeep', 0.35);      // far off, the ceremony not caring
    fade(18.6, 20.6, 0, 1);

    c.endFade = 1;
  }

  /* --------------------------------------------- C · QUESTION WHAT YOU SEE
     The best answer, the longest scene, and the only conversation in the
     game. He turns AWAY from the ritual — the first time in the whole
     chapter the camera comes off the front — and goes to the paper table.

     The ritual ducks as he turns his back on it, which is what actually
     happens when you walk twelve metres away from a drum, and it is why the
     scene sounds like a different chapter for twenty seconds.

     She tells him two things. The first is that the man at the front is a
     man: unusual is not the same as supernatural, which is half the
     teaching. The second is that she can tell there is something in this
     tent, and where it is sitting — which is the other half, and the reason
     the best answer is paid in information rather than in safety.        */
  function scAsk(c, s, api) {
    const { tr, step, sfx, fade, camTo, yawTo, pitchTo, bob, faceFrom,
            rawK, smoothK, duck, stage, camera, armR } = api;

    const AUNT = { x: stage.auntie.position.x, z: stage.auntie.position.z };
    const BACKC = stage.chairAt[stage.BACK_I];
    const TO_AUNT = faceFrom(TABLE.x, TABLE.z, AUNT.x, AUNT.z);
    const TO_MED = faceFrom(TABLE.x, TABLE.z, stage.MEDIUM.x, stage.MEDIUM.z);
    const TO_BACK = faceFrom(TABLE.x, TABLE.z, BACKC.x, BACKC.z);
    const AUNT_REST = stage.auntie.rotation.y;

    // he walks out of the aisle and over to her, and the tent gets quieter
    camTo(0, 2.2, { x: s.yawPos.x, y: s.yawPos.y, z: s.yawPos.z }, TABLE, smoothK);
    bob(0, 2.2, 0.80, 0.024, EYE);
    yawTo(0, 2.2, s.yawRot, TO_AUNT, smoothK);
    pitchTo(0, 2.2, s.pitchX, -0.05, smoothK);
    tr(0, 2.2, k => {
      duck('ritual', 1 - 0.60 * k);
      duck('ceremony', 1 - 0.55 * k);   // twelve metres from a drum is quieter
      duck('crowdmur', 1 - 0.30 * k);
      duck('hornloop', 1 - 0.55 * k);
      duck('cymloop', 1 - 0.60 * k);
      duck('crowdreact', 1 - 0.45 * k);
    }, rawK);
    sfx(0.4, 'step', 0.32); sfx(1.2, 'step', 0.32); sfx(1.9, 'step', 0.30);

    // she looks up from the folding
    /* TO_AUNT is a CAMERA yaw (0 = -z). A figure's forward is +z at 0, so
       the two conventions are half a turn apart — and for her to look back
       along the line the camera is looking down, her yaw is TO_AUNT exactly.
       Adding PI, as this first did, faced her away from him for the whole
       conversation. */
    tr(2.2, 2.9, k => { stage.auntie.rotation.y = AUNT_REST + (TO_AUNT - AUNT_REST) * k; }, smoothK);
    sfx(2.4, 'take', 0.4);

    /* THE TIMINGS ARE THE LINE LENGTHS. The first pass had three of these
       starting before the previous one had finished — aunt1 runs 4.96 s,
       aunt2 4.96, ask 1.49, aunt3 6.35, aunt4 3.87 (measured, in the plan
       doc) — and two people talking over each other is the one thing a
       conversation scene cannot survive. Every gap below is about 0.4 s. */
    sfx(3.1, 'v3aunt1');   // "That one? He is the tang kee. The god borrows his body."
    sfx(8.5, 'v3aunt2');   // "He has done this for thirty years. Watch his hands, not his face."

    // and he does look, because she told him to
    yawTo(9.1, 10.5, TO_AUNT, TO_MED, smoothK);
    pitchTo(9.1, 10.5, -0.05, -0.03, smoothK);
    yawTo(10.5, 11.9, TO_MED, TO_AUNT, smoothK);
    sfx(9.8, 'drum', 0.45);

    sfx(13.9, 'v3ask');    // "Is it real, auntie?"
    sfx(15.8, 'v3aunt3');  // "Real, not real, I do not know. He drives a lorry."

    /* 22.6  and then she stops folding. Half a second, and the whole scene
       changes register without a single sound effect in it. */
    step(22.6, () => { stage.auntie.rotation.y = TO_AUNT + 0.62; });
    sfx(22.7, 'trancehum', 0.45);
    tr(22.6, 23.1, () => {}, rawK);
    sfx(23.1, 'v3aunt4');  // "Listen to me, boy. Do not sit in the back row tonight."

    /* 24.4-26.6  the camera turns, slowly, all the way round to the back of
       the tent — away from the ritual, which is where it has been pointing
       since the film started. */
    yawTo(24.4, 26.6, TO_AUNT, TO_BACK, smoothK);
    pitchTo(24.4, 26.6, -0.05, -0.10, smoothK);
    camTo(24.4, 27.0, TABLE, { x: TABLE.x - 0.30, y: EYE, z: TABLE.z + 0.20 }, smoothK);

    /* The back row, empty, in the sun — and beyond it, through the open
       back of the tent, the stretch of tarmac the opening film taught the
       player to be afraid of. NOTHING MOVES. The rattling chair the first
       version put here is gone, and it is gone on principle: nothing of
       hers is inside this tent. The wrongness of the shot is a warning
       about a chair, an exit, and what the player knows is out there. */
    sfx(26.4, 'bellring', 0.3);       // the ceremony carrying on regardless
    sfx(27.0, 'chime', 0.5);
    sfx(27.6, 'gongdeep', 0.35);
    fade(27.4, 29.4, 0, 1);
    step(29.4, () => { stage.auntie.rotation.y = AUNT_REST; });

    c.endFade = 1;
  }

  /* ------------------------------------------------ D · LEAVE THE GATHERING
     The bad answer, and the emptiest shot in the game. He walks out, and
     the ceremony falls away behind him exactly as far as he walks — and
     when he stops for one last look, THE DRUM STOPS MID-PATTERN. Forty
     people under a tent at ten in the morning, in total silence, and not
     one of them turns round, and nothing else happens at all.

     That nothing is the scene. He leaves with the question instead of the
     answer, and the band starts again behind him, quiet and complete and
     not for him. The teaching priced this choice, and this is what minus
     wisdom sounds like.                                                  */
  function scGo(c, s, api) {
    const { tr, step, sfx, fade, camTo, yawTo, pitchTo, bob, rawK, smoothK,
            duck, stage, camera } = api;

    // turn his back on it
    yawTo(0, 1.4, s.yawRot, Math.PI, smoothK);
    pitchTo(0, 1.4, s.pitchX, -0.01, smoothK);
    sfx(0.6, 'breath', 0.5);

    /* 1.4-9.4  out. The tent goes quiet behind him on the same track that
       carries him away from it, which is the only honest way to do this. */
    camTo(1.4, 9.4, { x: s.yawPos.x, y: s.yawPos.y, z: s.yawPos.z }, AWAY, smoothK);
    bob(1.4, 9.4, 0.88, 0.034, EYE);
    tr(1.4, 9.4, k => {
      duck('ritual', 1 - 0.86 * k);
      duck('ceremony', 1 - 0.80 * k);
      duck('crowdmur', 1 - 0.72 * k);
      duck('tentamb', 1 - 0.55 * k);
      duck('hornloop', 1 - 0.80 * k);
      duck('cymloop', 1 - 0.84 * k);
      duck('crowdreact', 1 - 0.78 * k);
    }, rawK);
    for (let i = 0; i < 7; i++) sfx(2.0 + i * 0.86, 'step', 0.32 - i * 0.02);
    sfx(4.4, 'drum', 0.4);
    sfx(7.2, 'bellring', 0.2);

    // 9.4-10.9  he stops, and turns round, and it is the opening shot again
    yawTo(9.4, 10.9, Math.PI, 0, smoothK);
    pitchTo(9.4, 10.9, -0.01, -0.02, smoothK);
    sfx(9.8, 'vrelief', 0.75);

    /* 10.9-11.5  and the drum stops. Mid-pattern. Not a decrescendo — a
       CUT, the way a room goes quiet about you, from fifteen metres. */
    tr(10.9, 11.5, k => {
      duck('ritual', 0.14 * (1 - k));
      duck('ceremony', 0.20 * (1 - k));
      duck('crowdmur', 0.28 * (1 - 0.7 * k));
      duck('hornloop', 0.20 * (1 - k));
      duck('cymloop', 0.16 * (1 - k));
      duck('crowdreact', 0.22 * (1 - k));
      stage.drumBeat = 1 - k;
      stage.crowdLife = 1 - 0.92 * k;
    }, rawK);
    sfx(11.3, 'breath', 0.55);

    /* 11.5-13.6  HOLD. The tent, tiny and bright and silent, forty people
       facing the front. Nothing else happens. Nothing else needs to. */
    tr(11.5, 13.6, k => { camera.rotation.z = 0.012 * Math.sin(k * Math.PI * 2); }, rawK);
    sfx(12.6, 'heart', 0.45);

    /* 13.6-14.4  he turns his back on it, and the band starts again behind
       him — quiet, complete, and not for him. */
    yawTo(13.6, 14.6, 0, Math.PI, smoothK);
    tr(13.8, 14.8, k => {
      duck('ceremony', 0.45 * k);
      duck('ritual', 0.35 * k);
      duck('crowdmur', 0.20 + 0.35 * k);
      duck('hornloop', 0.35 * k);
      duck('cymloop', 0.40 * k);
      duck('crowdreact', 0.30 * k);
      stage.drumBeat = 0.7 * k;
      stage.crowdLife = 0.08 + 0.92 * k;
    }, rawK);
    sfx(13.9, 'drum', 0.5);
    sfx(14.5, 'bellring', 0.25);

    /* 14.4-18.0  and away, toward the block, with the drum keeping its own
       time behind him all the way to the lift. Which is the line. */
    camTo(14.4, 17.6, AWAY, FAR, smoothK);
    bob(14.4, 17.6, 0.86, 0.030, EYE);
    sfx(14.8, 'v3left');    // "I could still hear the drum from the lift.
                            //  I told myself that was normal."
    sfx(15.2, 'step', 0.3); sfx(16.1, 'step', 0.28); sfx(17.0, 'step', 0.26);
    sfx(15.4, 'trancehum', 0.5);
    fade(19.4, 21.4, 0, 1);           // v3left ends at 20.9; the cut waits
    sfx(20.2, 'gongdeep', 0.3);       // the last thing: far off, behind him

    c.endFade = 1;
  }

  /* The values scenes dim FROM, read off the world once it is built rather
     than written twice — so re-tuning the tent's lights or nudging the back
     chair cannot leave a cutscene brightening to a number that no longer
     exists. */
  let REST_TENT = 9;
  let REST_KEY = 26;
  let REST_BACK = 0;

  (window.__CHAPTERS__ = window.__CHAPTERS__ || {}).ch3 = Object.assign(DATA, {
    build(ctx) {
      _THREE = ctx.THREE;
      const st = build(ctx);
      REST_TENT = st.tentLights[0] ? st.tentLights[0].intensity : 9;
      REST_KEY = st.key.intensity;
      REST_BACK = st.chairRot[st.BACK_I];
      return st;
    },
    intro,
    scenes: [scWatch, scJoin, scAsk, scGo]
  });
})();
