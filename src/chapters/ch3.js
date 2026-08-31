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

    brief: 'The tentage has been up all week in the car park under his block. Tonight there is a drum, a crowd on red plastic chairs, and a man at the altar who has stopped being himself. Everyone is watching the front. Nobody is watching row four.',
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

    /* Her reach, in a tent twelve metres across and eighteen deep — between
       the void deck's numbers and the bedroom's. `roam.minZ` stops at -5.0
       so she never stands in the ritual space between the front row and the
       altar: she belongs in the chairs, with everyone else. */
    ghost: {
      minDist: 2.4,
      appearAt: 9.0,          // measured from the seating, so outside is relief
      near: 3.5, far: 8.0,
      cross: [4, 7],
      away: [4, 8],
      behind: 2.2,
      roam: { minX: -5.6, maxX: 5.6, minZ: -5.0, maxZ: 9.6 }
    },

    /* hdb is the block itself, standing over the car park — the third use of
       one already-downloaded file, and the thing that makes chapter 1's void
       deck, chapter 2's bedroom and this car park one place. hellnote is the
       note, which is on the altar table tonight where it should have been
       all along. */
    assets: ['hdb', 'hellnote'],
    noteArt: 'hellnote',

    /* The tent's own sound, in two beds. `tentamb` is the place — canvas,
       shuffling, the traffic on the road behind. `ritual` is what is being
       done in it: the priest's chanting over a wooden fish with the hand
       drum keeping time, ONE loop rather than two, so a cutscene that wants
       the ritual to stop can stop all of it on a single track. `drum` is a
       separate single struck hit, for accents.

       No `atShrine` — the warm light in this chapter is the altar's, and it
       is most of a tent away from where she stands. */
    ambience: { beds: [['tentamb', 0.34], ['ritual', 0.30]],
                atShrine: null },

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

    const owned = [];         // parented to the SCENE, so dispose() needs a list
    let alive = true;         // a GLB landing after dispose() must not build

    /* --------------------------------------------------------- the tent */
    const T = { x: 6.0, z: 9.0, eave: 2.9, ridge: 4.3, pole: 0.055 };

    // the seating, laid out once and read by everything that needs it
    const ROW_Z = [-4.4, -3.0, -1.6, -0.2, 1.2, 2.6];
    const COL_X = [-3.6, -2.7, -1.8, -0.9, 0.9, 1.8, 2.7, 3.6];
    const ODD = { row: 3, col: 2 };     // row four, and it faces the wrong way
    const BACK = { row: 5, col: 5 };    // the one still rocking at the end of C

    /* ------------------------------------------------------------ textures */
    const gTex = makeGround();
    const cTex = makeConcrete();
    const lacquerTex = makeLacquer();
    const noteTex = makeHellNote();
    const dotTex = makeSoftDot('rgba(255,236,206,0.9)', 'rgba(255,236,206,0)');
    const canvasTex = makeStripe(cnv);
    const floralTex = makeFloral(cnv);
    const goldTex = makeGoldPaper(cnv);

    const matTarmac = new THREE.MeshStandardMaterial({
      map: gTex.map, roughnessMap: gTex.rough, roughness: 0.93, metalness: 0.02,
      color: 0x9fa3ad });
    const matKerb = new THREE.MeshStandardMaterial({
      map: cTex.map, roughnessMap: cTex.rough, roughness: 0.95, metalness: 0 });
    const matCanvas = new THREE.MeshStandardMaterial({
      map: canvasTex, roughness: 0.95, metalness: 0, side: THREE.DoubleSide });
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
    }

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
          m.color?.multiplyScalar(0.34);
          m.emissive?.setScalar(0);
        }
      });
      world.add(blk);

      /* The lit windows go on AFTER the block, measured against its real
         bounding box. Placed by hand they were scattered from y=5 to y=25 at
         a guessed z, and about two thirds of them ended up hanging in the
         night sky above the roofline — clearly visible from the car park,
         which is the shot the chapter opens on. */
      const bb = new THREE.Box3().setFromObject(blk);
      const winGeo = new THREE.PlaneGeometry(0.95, 1.15);
      const face = bb.max.z + 0.06;
      for (let i = 0; i < 14; i++) {
        const w = new THREE.Mesh(winGeo, matWin);
        w.position.set(
          THREE.MathUtils.lerp(bb.min.x + 1.5, bb.max.x - 1.5, Math.random()),
          THREE.MathUtils.lerp(bb.min.y + 4.0, bb.max.y - 2.0, Math.random()),
          face);
        world.add(w);
      }

      hdbReady = true;
      redoShadows();
    }, (err) => console.warn('HDB failed to load', err)))
      .catch(err => console.warn('HDB failed to load', err));

    // a scatter of lit windows, so the block is inhabited at 1 AM. They are
    // placed in the GLB's callback above, against its measured bounds.
    const matWin = new THREE.MeshBasicMaterial({ color: 0xffdca0, fog: true });

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
      const l = new THREE.PointLight(0xdde6d8, LOW ? 10 : 6.2, 15, 1.55);
      l.position.set(0, T.ridge - 0.30, lz);
      tent.add(l); tentLights.push(l);
    }
    /* One of them casts, and only one. Shadows here are frozen after the
       first few frames (the engine redraws them on demand), so a static
       crowd under a static light costs one map and then nothing. */
    const key = new THREE.SpotLight(0xdfe8e2, LOW ? 0 : 17, 22, Math.PI / 3.1, 0.62, 1.5);
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
    const bounce = new THREE.HemisphereLight(0x9aa8bd, 0x24262c, 0.32);
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
    const fireLight = new THREE.PointLight(0xff8b33, 9, 11, 1.7);
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
    const brazLight = new THREE.PointLight(0xff7220, 7, 8, 1.8);
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
    }

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
    for (const im of [seatIM, backIM, legIM]) im.instanceMatrix.needsUpdate = true;

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
      map: dotTex, size: 0.030, transparent: true, opacity: 0.26,
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
        fireLight.intensity = 9 * fl;
        brazLight.intensity = 7 * (0.82 + Math.sin(t * 5.1) * 0.14 + Math.random() * 0.05);
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
      medium.userData.head.rotation.copy(s.headRot);
      medium.userData.head.position.copy(s.headPos);
      chairRot[ODD_I] = s.oddRot; placeChair(ODD_I);
      chairRot[BACK_I] = s.backRot; placeChair(BACK_I);
      for (const im of [seatIM, backIM, legIM]) im.instanceMatrix.needsUpdate = true;
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
      medium.userData.head.rotation.set(0, 0, 0);
      medium.userData.head.position.set(0, MED_HEAD_Y, 0);
      chairRot[ODD_I] = REST.oddRot; placeChair(ODD_I);
      chairRot[BACK_I] = REST.backRot; placeChair(BACK_I);
      for (const im of [seatIM, backIM, legIM]) im.instanceMatrix.needsUpdate = true;
      auntie.rotation.y = REST.auntieRot;
      heroNote.visible = true;
      haze.material.opacity = 0.26;
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
      for (const im of [seatIM, backIM, legIM, flying]) im.dispose?.();
      for (const g of geos) g.dispose();
      for (const m of mats) {
        for (const k of ['map', 'roughnessMap', 'normalMap', 'emissiveMap', 'alphaMap']) {
          m[k]?.dispose?.();
        }
        m.dispose();
      }
      // the procedural sources, which no mesh points at directly
      for (const t of [gTex.map, gTex.rough, cTex.map, cTex.rough, lacquerTex,
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

     The sound is the spine of it. The tent's loops are already running when
     the film starts — the engine plays a chapter's beds through a cutscene —
     so the film DUCKS them to almost nothing while the camera is twenty
     metres out, brings them up on the same track as the walk in, and then
     kills the drum outright at twenty-two seconds. That silence is the shot.

     It ends on black and KEEPS it, so the chapter card comes up over the
     dark rather than over the tent.                                       */
  function intro(c, s, api) {
    const { tr, step, sfx, fade, camTo, yawTo, pitchTo, bob, faceFrom,
            rawK, smoothK, duck, stage, ghost, ghostOpacity, ghostLight,
            handsRoot, armR } = api;

    const ODDC = stage.chairAt[stage.ODD_I];
    const HER = { x: ODDC.x, z: ODDC.z + 0.42 };   // stood at the turned chair

    step(0, () => {
      armR.visible = false;               // the hands have no business in this
      stage.drumBeat = 1;
      stage.crowdLife = 1;
      stage.noteStorm = 1;
      ghostOpacity(0);
      ghost.position.set(HER.x, 0, HER.z);
      ghost.rotation.y = 0;               // facing +z. Everyone else faces -z.
      stage.turnChair(stage.ODD_I, Math.PI);
    });

    /* 0-2.8  black, and the tent heard from a long way off. The loops are
       already running, so this is a duck and not a cue. */
    tr(0, 0.4, () => { duck('tentamb', 0.16); duck('ritual', 0.11); }, rawK);
    sfx(0.55, 'drum', 0.55);
    sfx(1.00, 'v3wake1');                 // "They put the tent up on Monday."
    camTo(0, 0.1, OUTSIDE, OUTSIDE);
    yawTo(0, 0.1, 0, 0);                  // yaw 0 is -z, which is the tent
    pitchTo(0, 0.1, -0.02, -0.02);

    // 2.6-5.4  fade up on a box of white light in the middle of a black night
    fade(2.6, 5.4, 1, 0);
    sfx(3.4, 'drum', 0.5);
    sfx(4.6, 'cymbal', 0.30);

    /* 5.2-13.0  he walks in. The dolly and the sound come up on one track,
       which is the only way this ever sounds right. */
    camTo(5.2, 13.0, OUTSIDE, GATE, smoothK);
    bob(5.2, 13.0, 0.82, 0.030, EYE);
    tr(5.2, 13.0, k => {
      duck('tentamb', 0.16 + 0.84 * k);
      duck('ritual', 0.11 + 0.89 * k);
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
    sfx(25.0, 'breath', 0.55);
    sfx(26.5, 'v3wake3');                 // "Nobody is scared. Why is nobody scared?"

    /* 29.0-32.4  something is in the corner of the eye, so the camera comes
       off the front — slowly, the way you look when you do not want to. */
    yawTo(29.0, 32.4, 0, faceFrom(WATCH.x, WATCH.z, HER.x, HER.z), smoothK);
    pitchTo(29.0, 32.4, -0.01, -0.09, smoothK);
    sfx(29.4, 'strings', 0.6);
    sfx(30.6, 'chair', 0.45);             // and the turned chair says where
    tr(31.4, 33.4, k => {
      ghostOpacity(k * 0.34);             // a third of her, and no more
      ghostLight.intensity = 0.7 * k;
    }, rawK);
    sfx(31.9, 'boom');
    sfx(32.2, 'whisper', 0.45);

    // 33.5-37.4  the last line, and then the dark takes it
    sfx(33.6, 'v3wake4');                 // "...that one is looking at me."
    sfx(34.4, 'heart', 0.5);
    fade(35.2, 37.4, 0, 1);
    // the drum starts again, alone, in the black — the tent does not care
    tr(36.0, 37.4, k => { duck('ritual', 0.55 * k); }, rawK);
    sfx(36.4, 'drum', 0.7);

    step(37.4, () => {
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
     moves and the world does all of the work. He backs off to the aisle and
     watches, and twice he looks away at the turned chair, and each time he
     looks BACK at the front she is nearer than she was.

     No scream and no chase. The good answer is paid in information and costs
     almost nothing, and a thing that simply stands there while forty people
     face the other way is worse than a jump.                              */
  function scWatch(c, s, api) {
    const { tr, step, sfx, fade, camTo, yawTo, pitchTo, faceFrom, rawK, smoothK,
            duck, stage, camera, ghost, ghostOpacity, ghostLight, armR } = api;

    const ODDC = stage.chairAt[stage.ODD_I];
    const LOOK = faceFrom(WATCH.x, WATCH.z, ODDC.x, ODDC.z);

    // he goes back rather than forward, which is the choice, told as a move
    camTo(0, 2.0, { x: s.yawPos.x, y: s.yawPos.y, z: s.yawPos.z }, WATCH, smoothK);
    yawTo(0, 2.0, s.yawRot, 0, smoothK);
    pitchTo(0, 2.0, s.pitchX, -0.02, smoothK);
    step(0, () => { ghostOpacity(0); ghostLight.intensity = 0; });
    sfx(0.4, 'step', 0.3); sfx(1.2, 'step', 0.3);

    // 2.0-3.6  the front, doing what the front does
    sfx(2.2, 'cymbal', 0.5);
    sfx(2.9, 'drum', 0.6);

    // 3.6-4.9  the first look away: the chair is turned, and it is empty
    yawTo(3.6, 4.9, 0, LOOK, smoothK);
    pitchTo(3.6, 4.9, -0.02, -0.08, smoothK);
    sfx(4.0, 'whisper', 0.35);

    // and she is up the aisle when he looks back, faint, between him and it
    // facing him, not facing wherever play happened to leave her
    step(4.9, () => { ghost.position.set(0.22, 0, -3.60); ghost.rotation.y = 0; });
    yawTo(4.9, 6.2, LOOK, 0, smoothK);
    pitchTo(4.9, 6.2, -0.08, -0.02, smoothK);
    tr(5.6, 6.8, k => { ghostOpacity(0.30 * k); ghostLight.intensity = 0.7 * k; }, rawK);
    sfx(5.8, 'strings', 0.5);
    sfx(6.4, 'dread', 0.4);

    // 6.8-8.9  a held beat. She is standing in the aisle and nobody reacts.
    tr(6.8, 8.9, () => {}, rawK);
    sfx(7.6, 'drum', 0.55);

    // 8.9-10.1  the second look away, and she is gone from the aisle
    yawTo(8.9, 10.1, 0, LOOK, smoothK);
    /* A TRACK, not a step. Every track keeps running once t passes its t0 —
       clamped at k=1, forever — so the 5.6-6.8 fade-in above is still
       writing 0.30 on every frame at t = 10. A step() fires once, is
       overwritten on the very next frame, and she blinks straight back in.
       Pushed after that fade-in and before the reveal below, so it beats the
       one and loses to the other, which is the whole of the ordering. */
    tr(9.4, 10.1, () => { ghostOpacity(0); ghostLight.intensity = 0; }, rawK);
    sfx(9.2, 'whisper', 0.4);

    /* 10.1-11.6  and back — and this time she is four metres away, solid,
       facing him, with the whole tent still watching the other direction. */
    step(10.1, () => { ghost.position.set(0.14, 0, -0.70); ghost.rotation.y = 0; });
    yawTo(10.1, 11.4, LOOK, 0, smoothK);
    tr(10.9, 11.5, k => { ghostOpacity(k); ghostLight.intensity = 2.0 * k; }, rawK);
    sfx(11.0, 'boom');
    sfx(11.1, 'strings', 0.85);
    sfx(11.4, 'vgasp');

    // 11.6-15.0  he does not run. He does not look away. Neither does she.
    camTo(11.6, 15.0, WATCH, { x: WATCH.x + 0.10, y: EYE, z: WATCH.z + 0.34 }, smoothK);
    tr(11.6, 15.0, k => { camera.rotation.z = 0.020 * Math.sin(k * Math.PI); }, rawK);
    tr(11.8, 15.0, k => { duck('ritual', 1 - 0.55 * k); }, rawK);
    sfx(12.0, 'heart', 0.6);
    sfx(13.2, 'whisper', 0.4);
    sfx(14.2, 'dread', 0.55);
    fade(13.6, 15.6, 0, 1);

    c.keep.ghostGone = true;
    c.endFade = 1;
  }

  /* ---------------------------------------------------- B · JOIN THE RITUAL
     The worst answer, and the loudest scene in the game. He goes up with the
     others and puts his hands together, and the tent takes it badly: the
     drum crowds in, the tubes start to strobe, the chant doubles into
     something that is not language. Then one frame of nothing, and she is
     on the lens.

     It ends the way the source says it ends — an experienced practitioner
     notices and hauls him out of it. The last thing in the scene is not the
     ghost. It is a woman's hand on his arm.                               */
  function scJoin(c, s, api) {
    const { tr, step, sfx, fade, camTo, yawTo, pitchTo, faceFrom,
            rawK, smoothK, duck, stage, camera, ghost, ghostOpacity, ghostLight,
            handsRoot, armR, PRAYER_R, PRAYER_L, setHandPrayer, handWidth,
            buildPrayerArm, rightHand, vmKey, vmHemi, vmFire, THREE } = api;

    // the mirrored left arm is built on the fly, and the tracks after that
    // read it, so the scene holds its own reference
    let prayerArmL = null;

    camTo(0, 2.6, { x: s.yawPos.x, y: s.yawPos.y, z: s.yawPos.z }, INSIDE, smoothK);
    yawTo(0, 2.6, s.yawRot, 0, smoothK);
    pitchTo(0, 2.6, s.pitchX, -0.04, smoothK);
    step(0, () => { ghostOpacity(0); ghostLight.intensity = 0; armR.visible = true; });
    sfx(0.5, 'step', 0.34); sfx(1.3, 'step', 0.34); sfx(2.1, 'step', 0.34);
    sfx(0.9, 'drum', 0.7);

    /* 1.6-3.4  the hands go up into anjali, the same clasp chapter 1 uses to
       excuse itself politely — and here it is the wrong thing to do. */
    step(1.6, () => {
      prayerArmL = buildPrayerArm();
      if (prayerArmL) prayerArmL.visible = true;
    });
    const half = handWidth() * 0.085;
    const PRAY_Y = -0.235;
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
      vmHemi.intensity = 0.55 + 0.45 * k;
      vmKey.intensity = 0.50 + 0.45 * k;
      vmFire.intensity = 2.4;
    }, rawK);
    sfx(2.4, 'bowl', 0.7);
    sfx(3.0, 'breath', 0.6);

    /* 3.4-8.4  and it goes wrong. The drum crowds in, the tubes lose their
       nerve, the air thickens, and the whole shot leans over. Nothing here
       is a jump: it is four seconds of getting steadily worse. */
    tr(3.4, 8.4, k => {
      duck('ritual', 1 + 1.6 * k);
      stage.drumBeat = 1 + 2.4 * k;
      stage.noteStorm = 1 + 4.5 * k;
      stage.haze.material.opacity = 0.26 + 0.34 * k;
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
    tr(4.0, 8.4, k => {
      const y = PRAY_Y + 0.05 * Math.sin(k * Math.PI * 4);
      armR.position.y = y;
      if (prayerArmL) prayerArmL.position.y = y;
    }, rawK);
    sfx(4.4, 'drum', 0.9);
    sfx(5.2, 'gong', 0.8);
    sfx(5.9, 'cymbal', 0.9);
    sfx(6.4, 'gwail', 0.55);
    sfx(7.0, 'drum', 1);
    sfx(7.6, 'vpant', 0.9);
    sfx(8.1, 'cymbal', 1);

    /* 8.4-8.9  everything stops. Half a second of a tent with nothing in it. */
    tr(8.4, 8.9, k => {
      duck('ritual', 2.6 * (1 - k) * (1 - k));
      duck('tentamb', 1 - 0.9 * k);
      stage.drumBeat = 3.4 * (1 - k);
      stage.crowdLife = 1 - k;
      for (const l of stage.tentLights) l.intensity = REST_TENT * (0.05 + 0.35 * k);
      stage.key.intensity = REST_KEY * (0.05 + 0.35 * k);
    }, rawK);
    tr(8.4, 8.9, k => { camera.rotation.z = 0.11 * (1 - k); }, rawK);

    // 8.9  and she is on the lens
    step(8.9, () => {
      ghost.position.set(-0.10, 0, -6.10);
      ghost.rotation.y = 0;
      ghostOpacity(1);
      ghostLight.intensity = 2.6;
    });
    sfx(8.92, 'boom');
    sfx(8.98, 'strings', 1);
    sfx(9.15, 'gscream', 0.95);
    sfx(9.35, 'scream');

    /* 9.0-10.8  he goes over backwards, and the room goes with him. */
    camTo(9.0, 10.8, { x: -0.18, y: 1.54, z: -5.55 },
                     { x: 0.42, y: 1.06, z: -3.90 }, rawK);
    pitchTo(9.0, 10.8, 0.06, 0.46, rawK);
    /* Ends on sin(1.4*PI) = -0.95, so it holds sixteen degrees of roll for
       as long as the scene runs — right through the auntie pulling him out.
       The settle below is pushed later and therefore wins. */
    tr(9.0, 11.6, k => { camera.rotation.z = 0.30 * Math.sin(k * Math.PI * 1.4); }, rawK);
    tr(11.6, 13.4, k => { camera.rotation.z = -0.285 * (1 - k); }, smoothK);
    tr(9.0, 10.4, k => {
      const y = PRAY_Y - 0.42 * k;
      armR.position.y = y;
      if (prayerArmL) prayerArmL.position.y = y;
      handsRoot.position.set(0.10 * k, -0.06 * k, 0);
    }, rawK);
    tr(9.0, 11.0, k => { ghostOpacity(1 - k * 0.85); ghostLight.intensity = 2.6 * (1 - k); }, rawK);
    tr(9.0, 12.0, k => {
      duck('tentamb', 0.1 + 0.9 * k);
      for (const l of stage.tentLights) l.intensity = REST_TENT * (0.4 + 0.6 * k);
      stage.key.intensity = REST_KEY * (0.4 + 0.6 * k);
      stage.crowdLife = k;
      stage.drumBeat = k;
      duck('ritual', k);
    }, rawK);

    /* 10.8-14.4  and then a hand on his arm, and the tent from a long way
       off, and an auntie who has seen this before telling him to get out. */
    camTo(10.8, 13.6, { x: 0.42, y: 1.06, z: -3.90 },
                      { x: 2.30, y: 1.48, z: -2.20 }, smoothK);
    yawTo(10.8, 13.6, 0, -0.95, smoothK);
    pitchTo(10.8, 13.6, 0.46, -0.02, smoothK);
    sfx(10.9, 'v3aunt5');                 // "Boy! Boy, come out. You cannot stand there."
    sfx(11.4, 'step', 0.4); sfx(12.0, 'step', 0.4);
    sfx(12.6, 'vpant', 0.8);
    sfx(13.6, 'dread', 0.6);
    fade(12.8, 14.8, 0, 1);

    c.keep.ghostGone = true;
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
            rawK, smoothK, duck, stage, camera, ghost, ghostOpacity, ghostLight,
            armR } = api;

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
    step(0, () => { ghostOpacity(0); ghostLight.intensity = 0; });
    tr(0, 2.2, k => { duck('ritual', 1 - 0.60 * k); }, rawK);
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
    sfx(22.7, 'dread', 0.5);
    tr(22.6, 23.1, () => {}, rawK);
    sfx(23.1, 'v3aunt4');  // "Listen to me, boy. Do not sit in the back row tonight."

    /* 24.4-26.6  the camera turns, slowly, all the way round to the back of
       the tent — away from the ritual, which is where it has been pointing
       since the film started. */
    yawTo(24.4, 26.6, TO_AUNT, TO_BACK, smoothK);
    pitchTo(24.4, 26.6, -0.05, -0.10, smoothK);
    camTo(24.4, 27.0, TABLE, { x: TABLE.x - 0.30, y: EYE, z: TABLE.z + 0.20 }, smoothK);
    sfx(24.8, 'whisper', 0.35);

    // one chair in the back row, empty, and still going
    sfx(26.2, 'chair', 0.75);
    tr(26.2, 28.4, (k, t2) => {
      stage.turnChair(stage.BACK_I,
        REST_BACK + Math.sin(t2 * 7.4) * 0.14 * (1 - k));
    }, rawK);
    sfx(27.0, 'chime', 0.5);
    sfx(27.6, 'dread', 0.6);
    fade(27.4, 29.4, 0, 1);
    step(29.4, () => { stage.auntie.rotation.y = AUNT_REST; });

    c.keep.ghostGone = true;
    c.endFade = 1;
  }

  /* ------------------------------------------------ D · LEAVE THE GATHERING
     The bad answer, and the widest shot in the game. He walks out, and the
     tent's light and noise fall off behind him until he is standing in the
     dark car park looking at exactly the frame the opening film started on.

     Then: forty people, all facing the front. Except one, at the back of the
     seating, standing, facing out. Facing him.

     And when he keeps backing away she does not get smaller — the glide
     moves her at the same rate the camera does, so her size on screen never
     changes. That is the whole scene, and it costs two tracks.           */
  function scGo(c, s, api) {
    const { tr, step, sfx, fade, camTo, yawTo, pitchTo, bob, rawK, smoothK,
            duck, stage, camera, ghost, ghostOpacity, ghostLight, armR } = api;

    const HER0 = { x: 1.60, z: 4.40 };
    const HER1 = { x: 1.60, z: 8.40 };

    // turn his back on it
    yawTo(0, 1.4, s.yawRot, Math.PI, smoothK);
    pitchTo(0, 1.4, s.pitchX, -0.01, smoothK);
    step(0, () => { ghostOpacity(0); ghostLight.intensity = 0; });
    sfx(0.6, 'breath', 0.5);

    /* 1.4-9.4  out. The tent goes quiet behind him on the same track that
       carries him away from it, which is the only honest way to do this. */
    camTo(1.4, 9.4, { x: s.yawPos.x, y: s.yawPos.y, z: s.yawPos.z }, AWAY, smoothK);
    bob(1.4, 9.4, 0.88, 0.034, EYE);
    tr(1.4, 9.4, k => {
      duck('ritual', 1 - 0.86 * k);
      duck('tentamb', 1 - 0.55 * k);
    }, rawK);
    for (let i = 0; i < 7; i++) sfx(2.0 + i * 0.86, 'step', 0.32 - i * 0.02);
    sfx(4.4, 'drum', 0.4);
    sfx(7.2, 'cymbal', 0.22);

    // 9.4-10.9  he stops, and turns round, and it is the opening shot again
    yawTo(9.4, 10.9, Math.PI, 0, smoothK);
    pitchTo(9.4, 10.9, -0.01, -0.02, smoothK);
    sfx(9.8, 'vrelief', 0.75);

    // 10.9  one of them is standing up, at the back, facing out
    step(10.9, () => {
      ghost.position.set(HER0.x, 0, HER0.z);
      /* FACING HIM. A figure's forward is +z at rotation 0 — the same
         convention ghostFacePlayer uses (atan2(px-gx, pz-gz) is 0 for a
         player straight ahead in +z) — and the camera is out at z = 15.5.
         This said Math.PI, and turned her back on the one shot the whole
         scene exists for. */
      ghost.rotation.y = 0;
      ghostOpacity(0);
    });
    tr(11.0, 12.2, k => { ghostOpacity(0.88 * k); ghostLight.intensity = 0.9 * k; }, rawK);
    sfx(11.1, 'strings', 0.6);
    sfx(11.6, 'boom', 0.8);
    sfx(12.0, 'vgasp', 0.9);

    /* 12.4-16.0  he keeps going backwards. So does she, at exactly the same
       speed, so she never gets any smaller. */
    camTo(12.4, 16.0, AWAY, FAR, rawK);
    tr(12.4, 16.0, k => {
      ghost.position.set(HER0.x + (HER1.x - HER0.x) * k, 0,
                         HER0.z + (HER1.z - HER0.z) * k);
    }, rawK);
    tr(12.4, 16.4, k => { camera.rotation.z = 0.03 * Math.sin(k * Math.PI * 2); }, rawK);
    sfx(12.9, 'dread', 0.6);
    sfx(13.6, 'heart', 0.55);
    sfx(14.6, 'whisper', 0.4);
    sfx(15.6, 'gsigh', 0.5);
    fade(14.8, 16.8, 0, 1);

    c.keep.ghostGone = true;
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
