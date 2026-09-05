/* Chapter 1 · The Hell Note
   ---------------------------------------------------------------------------
   A chapter carries everything that is THIS chapter rather than the game: the
   words, the choices and their costs, the world it happens in, and the scenes
   that play out each decision. The engine owns what every chapter shares —
   the renderer, the player, the ghost, the hands, sound, UI — and calls in
   here through two entry points:

     build(ctx) -> stage    construct this chapter's world; returns the handle
                            the engine drives it through
     scenes[i](c, s, api)   the cutscene for choice i, written in the engine's
                            cutscene language (api), animating this chapter's
                            own props

   The whole file is one closure so that build() and the scenes can share the
   props between them (S) instead of passing a twenty-field bag back and forth.
   It is still a plain script, not a module: the same file has to work when it
   is fetched on the hosted site, concatenated into the single-file build, and
   opened over file:// by the harnesses, none of which agree about imports.

   Chapter 2 starts by copying this file.                                     */

(() => {
  'use strict';

  /* Filled by build(); the scenes below read their props off it. Null until
     the world exists, which is also the guard a scene needs if it is ever
     reached before build (it cannot be today — playCine only runs in play). */
  let S = null;

  const DATA = {
    id: 1,
    episode: 1,            // v6.0: the case file this chapter belongs to — docs/EPISODES-PLAN.md
    title: 'The Hell Note',

    // the black card shown between Start and the playable night
    cardLabel: 'Chapter 1',
    cardTitle: 'The Hell Note<br>I Should Never Have Taken',

    brief: 'Late. A void deck you have walked a hundred times. Tonight someone has been burning for the dead, and a single note has drifted away from the pile, right into your path.',
    prompt: 'The hell note is right at your feet. What do you do?',
    choices: [
      {
        k: 'A', text: 'Pick it up. It is only paper.',
        d: { sanity: -20, awareness: -10, wisdom: -15 },
        verdict: 'bad',
        say: 'You bend down and take it. The warmth on your face is suddenly gone.',
        teach: 'What is burned is already given. Take it away, and the debt returns in another form.'
      },
      {
        k: 'B', text: 'Kick it and laugh. Superstition is for other people.',
        d: { sanity: -30, awareness: -15, wisdom: -25 },
        verdict: 'worst',
        say: 'Your foot scuffs across the concrete. Behind you, something is on the chase.',
        teach: 'You do not have to believe in something to respect it. Disrespect may invite what belief never could.'
      },
      {
        k: 'C', text: 'Stop and look around before walking away.',
        d: { sanity: 5, awareness: 25, wisdom: 15 },
        verdict: 'good',
        say: 'Your intuition was right. This is not a place for you to be standing.',
        teach: 'Observation costs nothing and prevents the unintended. Awareness is the cheapest protection there is.'
      },
      {
        k: 'D', text: 'Recite a chant, then respectfully excuse yourself.',
        d: { sanity: 15, awareness: 15, wisdom: 25 },
        verdict: 'best',
        say: 'The lamp buzzes. A sense of peacefulness arise.',
        teach: 'Act wisely. Respect what you cannot see. It may matter more than you think.'
      }
    ],
    core: 'Never take what is not given.<br><i>Adinnādānā veramaṇī sikkhāpadaṃ samādiyāmi.</i>',

    // --- the stage ---------------------------------------------------------
    // Every world position build() and the engine parameterise on.
    spawn:     { x: 0,    y: 1.62, z: 17 },      // out on the grass, facing the block
    shrine:    { x: -1.0, z: -7.5 },             // the burner, inside the void deck
    ghostHome: { x: -2.5, z: -12.0 },            // where she waits
    bounds:    { minX: -21, maxX: 21, minZ: -18.6, maxZ: 26 },

    // --- what this chapter needs from the server ---------------------------
    // Keys into the engine's asset table. Anything every chapter uses (hands,
    // ghost, logo, music, the sound pack) is the engine's own; these are the
    // files that exist only because this chapter does.
    assets: ['hdb', 'voice', 'hellnote',
             /* v6.4 — THE PROLOGUE's actor and props: the rigged young master
                (preloaded; he is the first shot), the bear, the leaf, and the
                photograph of the five-dollar note (docs/V6.4-PROLOGUE.md) */
             'young', 'teddy', 'leaf', 'note5'],
    // the line he says a few seconds in; this one is about a void deck, so
    // it is this chapter's rather than the engine's
    voiceLine: 'voice',
    // his two lines about the heap, and the prefix of the four under the
    // outcome cards (vA..vD). Both are about hell notes, so both are this
    // chapter's rather than the engine's.
    lines: { near: 'vpile', close: 'vnote', nearAt: 8 },
    // the deck's night, and the burner's fire getting louder as you near it
    ambience: { beds: [['amb', 0.33]], atShrine: ['fire', 0.6, 16] },
    sayPrefix: 'v',
    // the asset key holding this chapter's note art; the engine loads it and
    // hands it back through setNoteTexture() once it lands
    noteArt: 'hellnote'
  };

  /* ====================================================================== */
  /* THE WORLD                                                              */
  /* ====================================================================== */

  function build(ctx) {
    const { THREE, GLTFLoader, scene, camera, yaw, LOW,
            assetBytes, rescueTextures, redoShadows,
            cnv, makeSoftDot, makeGround, makeGrass, makeConcrete, makeLacquer,
            makeHellNote, loadImageTexture, getState, startDecision, HEAD_RE } = ctx;

    // The burner and everything that belongs to it — light, smoke, embers,
    // notes, the trigger radius — are positioned from this one point, so the
    // shrine can be moved without hunting down a dozen coordinates.
    const SHRINE = new THREE.Vector3(DATA.shrine.x, 0, DATA.shrine.z);

    // things parented to the SCENE rather than to `world`; dispose() needs a
    // list because a scene-level light is not reachable from world.traverse
    const owned = [];
    let alive = true;         // a GLB that lands after dispose() must not build

  // The sodium lamps are built with their posts further down — see makeLamp().

  // candle / burner fire light (flickers)
  const fireLight = new THREE.PointLight(0xff7a26, 14, 16, 1.7);
  fireLight.position.set(SHRINE.x - 0.2, 0.95, SHRINE.z);
  scene.add(fireLight);

  /* ------------------------------------------------------------ materials */
  const gTex = makeGround();
  const grassTex = makeGrass();
  const cTex = makeConcrete();
  const lacquerTex = makeLacquer();
  const noteTex = makeHellNote();

  const matGround = new THREE.MeshStandardMaterial({
    map: gTex.map, roughnessMap: gTex.rough, roughness: 0.92, metalness: 0.02, color: 0xffffff
  });
  const matGrass = new THREE.MeshStandardMaterial({
    map: grassTex.map, roughnessMap: grassTex.rough, roughness: 0.98, metalness: 0
  });
  const matConcrete = new THREE.MeshStandardMaterial({
    map: cTex.map, roughnessMap: cTex.rough, roughness: 0.95, metalness: 0.0
  });
  const matLacquer = new THREE.MeshStandardMaterial({ map: lacquerTex, roughness: 0.42, metalness: 0.18 });
  const matMetal = new THREE.MeshStandardMaterial({ color: 0x39332c, roughness: 0.62, metalness: 0.85 });
  const matDarkWood = new THREE.MeshStandardMaterial({ color: 0x2a1c14, roughness: 0.78, metalness: 0.05 });
  const matGold = new THREE.MeshStandardMaterial({ color: 0xc79a3d, roughness: 0.3, metalness: 0.95 });

  /* --------------------------------------------------------------- world */
  const world = new THREE.Group();
  scene.add(world);

  // ground — grass everywhere outside the block
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(220, 220), matGrass);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  world.add(ground);

  /* ------------------------------------------------------------- the block */
  /* HDB.glb is a textured shell: its void deck is painted on the outside of a
     solid box, so there is nothing to walk into. The fix is to hide that box
     (Grd_Floor) and build a real corridor in the gap it leaves — floor, ceiling
     and pillars under the tower, which is how a void deck is actually put
     together anyway. The tower, roof, lift core and staircase are all the
     model's own.                                                              */

  const HDB_SCALE = 0.001;                        // the model is in millimetres
  const HDB_OFFSET = new THREE.Vector3(-4.706, 0, -4.30);   // tower centred, face at z=0
  const DECK = { w: 43.5, d: 19.8, zc: -9.8, clear: 3.0 };  // the corridor we build

  let hdbReady = false;
  assetBytes('hdb').then(HDB_BUF => new GLTFLoader().parse(HDB_BUF, '', (gltf) => {
    if (!alive) return;            // disposed while the bytes were in flight
    rescueTextures(gltf, HDB_BUF);
    const blk = gltf.scene;
    blk.scale.setScalar(HDB_SCALE);
    blk.position.copy(HDB_OFFSET);
    blk.traverse(o => {
      if (!o.isMesh) return;
      if (o.name.includes('Grd_Floor')) { o.visible = false; return; }  // the solid box
      o.castShadow = true;
      o.receiveShadow = true;
      const mats = Array.isArray(o.material) ? o.material : [o.material];
      for (const m of mats) { m.roughness = 0.94; m.metalness = 0; }
    });
    world.add(blk);
    hdbReady = true;
    redoShadows();                 // the block is most of what casts one
  }, (err) => console.warn('HDB failed to load', err)))
    .catch(err => console.warn('HDB failed to load', err));

  // --- the void deck we build underneath it
  const deckFloor = new THREE.Mesh(new THREE.PlaneGeometry(DECK.w, DECK.d), matGround);
  deckFloor.rotation.x = -Math.PI / 2;
  deckFloor.position.set(0, 0.012, DECK.zc);
  deckFloor.receiveShadow = true;
  world.add(deckFloor);

  const deckCeil = new THREE.Mesh(new THREE.BoxGeometry(DECK.w, 0.22, DECK.d), matConcrete);
  deckCeil.position.set(0, DECK.clear + 0.11, DECK.zc);
  deckCeil.castShadow = true; deckCeil.receiveShadow = true;
  world.add(deckCeil);

  const deckPillar = new THREE.BoxGeometry(0.6, DECK.clear, 0.6);
  // offset so the bay on the approach line is clear — a pillar dead ahead of
  // the spawn point makes the entrance read as blocked rather than inviting
  for (const px of [-21.75, -16.75, -11.75, -6.75, -1.75, 3.25, 8.25, 13.25, 18.25]) {
    for (const pz of [-1.2, -9.8, -18.2]) {
      const c = new THREE.Mesh(deckPillar, matConcrete);
      c.position.set(px, DECK.clear / 2, pz);
      c.castShadow = true; c.receiveShadow = true;
      world.add(c);
    }
  }

  const deckBack = new THREE.Mesh(new THREE.BoxGeometry(DECK.w, DECK.clear, 0.3), matConcrete);
  deckBack.position.set(0, DECK.clear / 2, -19.5);
  deckBack.castShadow = true; deckBack.receiveShadow = true;
  world.add(deckBack);

  /* ---------------------------------------------------------- street lamps */
  /* One post, arm and head per lamp, all sharing three geometries and one
     emissive material.

     Only two of them carry a real light. Every extra dynamic light is paid for
     on every lit pixel in the scene, which is the one cost a phone genuinely
     cannot absorb — so the lamps further out fake their pool of light with a
     flat additive disc on the grass instead. At that distance the difference
     is invisible and it costs nothing.                                        */
  const lampPostGeo = new THREE.CylinderGeometry(0.09, 0.12, 5.6, 8);
  const lampArmGeo = new THREE.BoxGeometry(0.9, 0.1, 0.1);
  const lampHeadGeo = new THREE.SphereGeometry(0.26, 12, 8);
  const lampPoolGeo = new THREE.CircleGeometry(1, 24);
  const lampHeadMat = new THREE.MeshStandardMaterial({
    color: 0xffc98a, emissive: 0xffb367, emissiveIntensity: 3.4, roughness: 0.4 });
  const lampPoolTex = makeSoftDot('rgba(255,166,84,0.70)', 'rgba(255,128,40,0)');
  lampPoolTex.colorSpace = THREE.SRGBColorSpace;   // otherwise the sodium reads grey
  const lampPoolMat = new THREE.MeshBasicMaterial({
    map: lampPoolTex, transparent: true, depthWrite: false,
    blending: THREE.AdditiveBlending
  });

  function makeLamp(x, z, aimX, aimZ, light) {
    const dx = aimX - x, dz = aimZ - z, len = Math.hypot(dx, dz) || 1;
    const ux = dx / len, uz = dz / len;              // the way the arm reaches

    const post = new THREE.Mesh(lampPostGeo, matMetal);
    post.position.set(x, 2.8, z); post.castShadow = true;
    world.add(post);

    const arm = new THREE.Mesh(lampArmGeo, matMetal);
    arm.position.set(x + ux * 0.45, 5.55, z + uz * 0.45);
    arm.rotation.y = Math.atan2(-uz, ux);            // box is long on +X
    arm.castShadow = true;
    world.add(arm);

    const hx = x + ux * 0.9, hz = z + uz * 0.9;
    const head = new THREE.Mesh(lampHeadGeo, lampHeadMat);
    head.position.set(hx, 5.5, hz);
    world.add(head);

    if (!light) {                                    // the painted-on version
      const pool = new THREE.Mesh(lampPoolGeo, lampPoolMat);
      pool.rotation.x = -Math.PI / 2;
      pool.position.set(x + ux * 2.6, 0.035, z + uz * 2.6);
      pool.scale.setScalar(3.9);
      world.add(pool);
      return null;
    }

    const sp = new THREE.SpotLight(0xffb367, light.power, 26, Math.PI / 4.4, 0.55, 1.4);
    sp.position.set(hx, 5.5, hz);
    sp.target.position.set(x + ux * 3.4, 0, z + uz * 3.4);
    if (light.shadow) {
      sp.castShadow = true;
      sp.shadow.mapSize.set(LOW ? 512 : 1024, LOW ? 512 : 1024);
      sp.shadow.bias = -0.002;
    }
    scene.add(sp, sp.target); owned.push(sp, sp.target);
    return sp;
  }

  // the entrance lamp keeps its shadow, the one behind the spawn point lights
  // the way in, and the three further out are painted
  makeLamp(8.0, 6.6, 5.5, 3.0, { power: 26, shadow: true });
  makeLamp(5.5, 20.5, 3.5, 18.2, { power: 17 });
  makeLamp(-11.5, 4.6, -9.2, 2.2, null);
  makeLamp(17.5, 12.5, 15.0, 10.2, null);
  makeLamp(-19.0, 16.5, -16.5, 14.0, null);

  /* --------------- the offering: the object of the encounter --------------- */
  const offering = new THREE.Group();
  offering.position.copy(SHRINE);
  world.add(offering);

  // paving square the offering sits on
  const mat = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.04, 1.8),
    new THREE.MeshStandardMaterial({ color: 0x1a1d22, roughness: 0.9 }));
  mat.position.y = 0.02; mat.receiveShadow = true;
  offering.add(mat);

  // metal burner drum
  const drum = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.38, 0.9, 16, 1, true), matMetal);
  drum.position.set(-0.2, 0.45, 0.0);
  drum.castShadow = true; drum.receiveShadow = true;
  drum.material.side = THREE.DoubleSide;
  offering.add(drum);
  // glowing ash inside
  const ash = new THREE.Mesh(new THREE.CircleGeometry(0.36, 16),
    new THREE.MeshBasicMaterial({ color: 0xff5a12 }));
  ash.rotation.x = -Math.PI / 2; ash.position.set(-0.2, 0.72, 0);
  offering.add(ash);

  // offering sets: a lacquer plate of oranges with joss sticks planted beside it.
  // Three of them, spaced around the drum at different angles, so the shrine
  // reads as something several people have added to rather than one tidy display.
  const orangeMat = new THREE.MeshStandardMaterial({ color: 0xd06a12, roughness: 0.72 });
  const jossTips = [];

  function offeringSet(px, pz, spin, scale = 1) {
    const set = new THREE.Group();
    set.position.set(px, 0, pz);
    set.rotation.y = spin;
    set.scale.setScalar(scale);
    offering.add(set);

    const plate = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.24, 0.05, 18), matLacquer);
    plate.position.y = 0.045;
    plate.castShadow = plate.receiveShadow = true;
    set.add(plate);

    for (const [ox, oz] of [[-0.07, -0.06], [0.07, 0.02], [0.0, 0.10]]) {
      const o = new THREE.Mesh(new THREE.SphereGeometry(0.085, 12, 10), orangeMat);
      o.position.set(ox, 0.15, oz);
      o.castShadow = true;
      set.add(o);
    }

    for (let i = 0; i < 3; i++) {
      const st = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.52, 5), matDarkWood);
      st.position.set(-0.17 + i * 0.09, 0.3, -0.30);
      st.rotation.z = (i - 1) * 0.06;
      set.add(st);
      const tip = new THREE.Mesh(new THREE.SphereGeometry(0.016, 6, 5),
        new THREE.MeshBasicMaterial({ color: 0xff6a1f }));
      tip.position.set(st.position.x + (i - 1) * 0.015, 0.56, -0.30);
      set.add(tip);
      jossTips.push(tip);
    }
    return set;
  }

  offeringSet(0.58, 0.30, -0.22);
  offeringSet(-0.80, 0.34, 0.55, 0.94);
  offeringSet(0.04, -0.58, 2.7, 0.88);

  // hell notes: hundreds of them, so one InstancedMesh rather than hundreds of
  // objects — the whole drift is a single draw call either way.
  /* The real note is 1.667 wide to 1 tall — banknote proportions, not the
     2:1 the drawn placeholder happened to be. The plane follows the ART, or
     every one of the five hundred is squashed by a sixth.

     `color` above 1 and a little emissive is not a cheat: a saturated print
     under this much darkness collapses to a dark tile, and the note ends up
     LESS readable than the flat card it replaced. Paper this bright catches
     firelight, and these are meant to be seen. */
  const noteMat = new THREE.MeshStandardMaterial({
    map: noteTex, roughness: 0.88, side: THREE.DoubleSide });
  const noteGeo = new THREE.PlaneGeometry(0.30, 0.18);

  const OFFER_X = SHRINE.x, OFFER_Z = SHRINE.z;   // the burner everything blew away from
  const _m = new THREE.Matrix4(), _q = new THREE.Quaternion();
  const _v = new THREE.Vector3(), _one = new THREE.Vector3(1, 1, 1), _ax = new THREE.Vector3();

  // --- settled on the ground, thickest near the drum and thinning outward.
  // The pile around the burner stays as dense as it was; past NEAR_R the
  // scatter is thinned out, so the eye still reads a source rather than
  // wallpaper. Positions are built first so the mesh is sized to what survives.
  const NEAR_R = 3.2;                        // "at the burner" ends here
  const FAR_KEEP = 0.6;                      // keep 60% of everything past it
  const GROUND_TRIES = LOW ? 300 : 525;
  const groundXforms = [];
  for (let i = 0; i < GROUND_TRIES; i++) {
    const r = 0.7 + 19 * Math.pow(Math.random(), 1.7);   // clustered near the source
    if (r > NEAR_R && Math.random() > FAR_KEEP) continue;
    const a = Math.random() * Math.PI * 2;
    groundXforms.push(new THREE.Matrix4().compose(
      new THREE.Vector3(
        THREE.MathUtils.clamp(OFFER_X + Math.cos(a) * r, -20.5, 20.5),
        0.004 + Math.random() * 0.012,                   // stacked a hair off the floor
        THREE.MathUtils.clamp(OFFER_Z + Math.sin(a) * r * 0.9, -18.5, 18)),
      new THREE.Quaternion().setFromEuler(new THREE.Euler(
        -Math.PI / 2 + (Math.random() - 0.5) * 0.16,     // not perfectly flat
        Math.random() * Math.PI * 2,
        (Math.random() - 0.5) * 0.2)),
      _one));
  }
  const grounded = new THREE.InstancedMesh(noteGeo, noteMat, groundXforms.length);
  grounded.receiveShadow = true;
  grounded.frustumCulled = false;
  groundXforms.forEach((m, i) => grounded.setMatrixAt(i, m));
  grounded.instanceMatrix.needsUpdate = true;
  world.add(grounded);

  // --- airborne, turning slowly on the updraft and drifting round the deck
  const FLY_N = LOW ? 54 : 115;
  const flying = new THREE.InstancedMesh(noteGeo, noteMat, FLY_N);
  flying.frustumCulled = false;
  world.add(flying);

  const airborne = [];
  const FAR_SHARE = 0.30;                              // how many drift out over the grass

  function seedNote(f, firstRun) {
    // Roughly a third of them ride out past the block, so the air is already
    // moving where you spawn instead of only around the burner.
    f.far = Math.random() < FAR_SHARE;
    do {                                               // distance from the burner,
      f.r = f.far ? 17 + Math.random() * 15            // thinned past NEAR_R to match
                  : 1.5 + Math.random() * 16;          // the ground scatter
    } while (!f.far && f.r > NEAR_R && Math.random() > FAR_KEEP);
    // the far ones keep to the open side — swung the other way they would just
    // orbit inside the block, where nothing can see them
    f.a = f.far ? Math.random() * Math.PI : Math.random() * Math.PI * 2;
    f.y = firstRun ? 0.2 + Math.random() * 7 : 0.15 + Math.random() * 0.5;
    f.top = 5.5 + Math.random() * 7;                     // height it fades out at
    f.rise = 0.16 + Math.random() * 0.62;              // updraft speed
    f.swirl = (0.05 + Math.random() * 0.22) * (Math.random() < 0.25 ? -1 : 1);
    f.wob = Math.random() * Math.PI * 2;               // per-note phase offset
    f.spin = 0.5 + Math.random() * 2.4;                // tumble rate
    f.axis = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5)
      .normalize();
    return f;
  }
  for (let i = 0; i < FLY_N; i++) airborne.push(seedNote({}, true));

  // 1 is the everyday drift; a cutscene can spin it up to a storm and back
  let noteStorm = 1;
  /* v6.4: and slow the WHOLE air down — the prologue's last beat is a note
     passing his face in slow motion, and a drift crawling while its tumble
     and wobble ran at full speed read as a glitch, not as time. `slowMo`
     scales the clock the notes, the smoke and the embers read; `noteT` is
     that clock. In play it is 1 and the chapter is exactly what it was. */
  let slowMo = 1, noteT = 0;

  function updateNotes(dt, t) {
    const sdt = dt * slowMo;
    noteT += sdt;
    for (let i = 0; i < FLY_N; i++) {
      const f = airborne[i];
      f.a += f.swirl * sdt * noteStorm * (3 / Math.max(f.r, 2));  // tighter orbits move faster
      f.y += f.rise * sdt * noteStorm;
      if (f.y > f.top) seedNote(f, false);             // recycle back to the ground
      const r = f.r + Math.sin(noteT * 0.45 + f.wob) * 0.9;
      _v.set(OFFER_X + Math.cos(f.a) * r,
             f.y + Math.sin(noteT * 1.1 + f.wob) * 0.18,
             OFFER_Z + Math.sin(f.a) * r);
      _q.setFromAxisAngle(_ax.copy(f.axis), noteT * f.spin + f.wob);
      flying.setMatrixAt(i, _m.compose(_v, _q, _one));
    }
    flying.instanceMatrix.needsUpdate = true;
  }

  // the note this chapter is actually about, lit and lying apart from the rest
  const heroNote = new THREE.Mesh(noteGeo, noteMat.clone());
  heroNote.rotation.x = -Math.PI / 2; heroNote.rotation.z = 0.4;
  heroNote.position.set(1.35, 0.05, 1.15);
  heroNote.receiveShadow = true;
  offering.add(heroNote);

  /* ------------------------------------------- the pile: an interactable ---
     The one thing in this scene you can act on, so it is built as a real
     object rather than scattered instances: a heap you can look at, walk up
     to and touch. It carries its own highlight — a ring on the floor and a
     soft shell around the heap — which comes up as you get near, so it reads
     as interactable without a word of UI. The notes are thin boxes, not
     planes, so the heap has volume from every angle.                        */

  const PILE_POS = new THREE.Vector3(SHRINE.x + 1.15, 0, SHRINE.z + 1.55);
  const PILE_R = 0.40;                       // footprint of the heap
  const INTERACT_R = 5.0;                    // close enough to act on it
  const HIGHLIGHT_R = 8.0;                   // close enough to notice it glowing

  const pile = new THREE.Group();
  pile.position.copy(PILE_POS);
  world.add(pile);

  const pileMat = new THREE.MeshStandardMaterial({ map: noteTex, roughness: 0.86 });
  const pileNoteGeo = new THREE.BoxGeometry(0.30, 0.009, 0.18);
  const pileNotes = [];
  for (let i = 0; i < 30; i++) {
    const r = Math.sqrt(Math.random()) * PILE_R;
    const a = Math.random() * Math.PI * 2;
    const n = new THREE.Mesh(pileNoteGeo, pileMat);
    n.position.set(Math.cos(a) * r,
                   0.008 + (1 - r / PILE_R) * 0.20 * Math.random(),   // a mound
                   Math.sin(a) * r * 0.88);
    n.rotation.set((Math.random() - 0.5) * 0.55,
                   Math.random() * Math.PI * 2,
                   (Math.random() - 0.5) * 0.55);
    n.castShadow = true; n.receiveShadow = true;
    pile.add(n);
    pileNotes.push(n);
  }

  // the highlight: a ring on the floor and a soft shell over the heap, both
  // additive so they read as light rather than as paint
  const pileRing = new THREE.Mesh(
    new THREE.RingGeometry(PILE_R + 0.10, PILE_R + 0.24, 44),
    new THREE.MeshBasicMaterial({ color: 0x63d6c8, transparent: true, opacity: 0,
      side: THREE.DoubleSide, blending: THREE.AdditiveBlending,
      depthWrite: false, fog: false }));
  pileRing.rotation.x = -Math.PI / 2;
  pileRing.position.y = 0.032;
  pileRing.visible = false;
  pile.add(pileRing);

  /* The border itself is drawn the way outlines have always been drawn: each
     note again, a little larger and inside out. Only the parts that poke out
     past the real note are ever seen, which is exactly a rim of light around
     the heap's silhouette. A glow volume was tried first and was worse — it
     sat over the paper and turned the whole heap milky grey.                */
  const pileOutlineMat = new THREE.MeshBasicMaterial({
    color: 0x63d6c8, transparent: true, opacity: 0, side: THREE.BackSide,
    blending: THREE.AdditiveBlending, depthWrite: false, fog: false });
  const pileOutline = new THREE.Group();
  pileOutline.visible = false;
  pile.add(pileOutline);
  for (const n of pileNotes) {
    const o = new THREE.Mesh(pileNoteGeo, pileOutlineMat);
    o.position.copy(n.position);
    o.rotation.copy(n.rotation);
    o.scale.set(1.09, 2.6, 1.14);        // the notes are thin: the edge needs the height
    pileOutline.add(o);
  }

  /* The mark. A ring on the floor says "this is a thing"; the exclamation says
     "and it is waiting for you". It carries further than the ring does — you
     should be able to pick it out from the deck entrance — and it bobs, so it
     reads as a marker rather than as part of the scene. A sprite, so it faces
     you from every angle without any work.                                    */
  const MARK_R = 15.0;                       // you can see it from this far out

  /* The glyph is drawn as shapes, not as text. A web font is still loading when
     this canvas is painted, so ctx.fillText('!') would silently come out in
     whatever the fallback happens to be — which is how you end up with a pale
     bar and no dot. A stem and a dot are three lines of geometry and always
     look like an exclamation mark.                                            */
  function makeMark() {
    const s = 256, [c, ctx] = cnv(s);
    const glyph = (fill, w) => {
      ctx.fillStyle = fill;
      ctx.beginPath();                       // tapered stem
      ctx.moveTo(s / 2 - w, 34);
      ctx.lineTo(s / 2 + w, 34);
      ctx.lineTo(s / 2 + w * 0.52, 156);
      ctx.lineTo(s / 2 - w * 0.52, 156);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();                       // and the dot
      ctx.arc(s / 2, 205, w * 0.95, 0, Math.PI * 2);
      ctx.fill();
    };
    ctx.shadowColor = 'rgba(99,214,200,0.95)';
    ctx.shadowBlur = 26;
    glyph('#06201C', 32);                    // dark rim, so it survives firelight
    ctx.shadowBlur = 0;
    glyph('#EFFFFB', 23);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }

  // sizeAttenuation off: a marker should be the same size on screen whether you
  // are across the deck or standing on it
  const pileMarkGlow = new THREE.Sprite(new THREE.SpriteMaterial({
    map: makeSoftDot('rgba(99,214,200,0.50)', 'rgba(99,214,200,0)'),
    transparent: true, depthWrite: false, fog: false, sizeAttenuation: false,
    blending: THREE.AdditiveBlending }));
  pileMarkGlow.scale.setScalar(0.34);
  const pileMark = new THREE.Sprite(new THREE.SpriteMaterial({
    map: makeMark(), transparent: true, depthWrite: false, fog: false,
    sizeAttenuation: false }));
  pileMark.scale.setScalar(0.115);

  const pileMarkRoot = new THREE.Group();
  pileMarkRoot.position.y = 1.15;
  pileMarkRoot.visible = false;
  pileMarkRoot.add(pileMarkGlow, pileMark);
  pile.add(pileMarkRoot);

  const _pileNdc = new THREE.Vector3();
  const _ray = new THREE.Raycaster();
  const _ptr = new THREE.Vector2();

  function pileDist() {
    return Math.hypot(yaw.position.x - PILE_POS.x, yaw.position.z - PILE_POS.z);
  }
  // The camera's world matrix is refreshed by the renderer, so anything asking
  // where a thing is on screen mid-frame would be answering for the previous
  // frame's orientation — one frame stale is enough to leave a prompt up after
  // you have turned away from what it refers to.
  function syncCamera() {
    camera.updateWorldMatrix(true, false);
    camera.matrixWorldInverse.copy(camera.matrixWorld).invert();
  }
  function pileScreen() {                     // normalised device coords of the heap
    syncCamera();
    return _pileNdc.set(PILE_POS.x, 0.15, PILE_POS.z).project(camera);
  }
  function pileInView() {
    const n = pileScreen();
    return n.z < 1 && Math.abs(n.x) < 0.97 && Math.abs(n.y) < 0.97;
  }

  // Is this screen point on the heap? A heap of paper is a small target on a
  // phone, so a tap that lands near it counts too — missing by ten pixels
  // should not mean nothing happens.
  function pointerHitsPile(cx, cy) {
    if (pileDist() > INTERACT_R) return false;
    syncCamera();
    _ptr.set((cx / innerWidth) * 2 - 1, -(cy / innerHeight) * 2 + 1);
    _ray.setFromCamera(_ptr, camera);
    if (_ray.intersectObjects(pileNotes, false).length) return true;
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
    // game furniture, not part of a film — everything off while a scene plays
    if (getState() === 'cine') {
      pileMarkRoot.visible = pileRing.visible = pileOutline.visible = false;
      pileMat.emissive.setRGB(0, 0, 0);
      return;
    }
    const dist = pileDist();

    // the mark carries further than the highlight, and keeps moving so it never
    // reads as a bit of scenery
    const mark = THREE.MathUtils.clamp(
      (MARK_R - dist) / (MARK_R - INTERACT_R) * 1.9, 0, 1);   // fully on well before you arrive
    pileMarkRoot.visible = mark > 0.01;
    if (pileMarkRoot.visible) {
      const beat = 0.72 + 0.28 * Math.sin(t * 3.1);
      pileMarkRoot.position.y = 1.22 + Math.sin(t * 1.9) * 0.10;
      pileMark.material.opacity = mark;
      pileMark.scale.setScalar(0.115 * (0.93 + beat * 0.11));
      pileMarkGlow.material.opacity = mark * beat * 0.55;
    }

    const near = THREE.MathUtils.clamp(
      (HIGHLIGHT_R - dist) / (HIGHLIGHT_R - INTERACT_R), 0, 1);
    const g = near * (0.62 + 0.38 * Math.sin(t * 2.6));
    const on = near > 0.01;
    pileRing.visible = pileOutline.visible = on;
    if (!on) { pileMat.emissive.setRGB(0, 0, 0); return; }
    // additive light goes white long before it goes bright, so these stay low
    // enough for the jade to survive against the fire
    pileRing.material.opacity = g * 0.58;
    pileOutlineMat.opacity = g * 0.44;
    pileMat.emissive.setRGB(0.015 * g, 0.055 * g, 0.05 * g);   // a hint, not a wash
  }

  /* ---------------------------------------- parked: cased amulet (.glb) ----
     Built and verified, kept out of this chapter. Flip SHOW_AMULET to true and
     the build step re-embeds amulet.glb; the loading code below is unchanged.   */
  const SHOW_AMULET = false;

  if (SHOW_AMULET) {
    const stand = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.028, 0.075), matDarkWood);
    stand.position.set(0.86, 0.055, 0.52);
    stand.castShadow = stand.receiveShadow = true;
    offering.add(stand);

    assetBytes('amulet').then(buf => new GLTFLoader().parse(buf, '', (gltf) => {
      const amulet = gltf.scene;
      amulet.scale.setScalar(2.2);
      amulet.position.set(0.86, 0.069, 0.52);
      amulet.rotation.set(-0.14, 0, 0);
      amulet.traverse(o => { if (o.isMesh) o.castShadow = o.receiveShadow = true; });
      offering.add(amulet);
      redoShadows();
    }, (err) => console.warn('amulet failed to load', err)))
      .catch(err => console.warn('amulet failed to load', err));
  }

  /* ---------------------------------------------------------- the tree line */
  /* Low-poly blobs on a trunk: a dozen of them cost less than one of the
     pillars. They stay out of the corridor between the spawn point and the
     void deck, so the way in still reads as open.                            */
  const trunkGeo = new THREE.CylinderGeometry(0.26, 0.42, 5.2, 9);
  // three canopy blobs, reused and jittered per instance rather than a fresh
  // geometry per leaf cluster — a hundred one-off geometries is a hundred
  // buffers to upload for no visible gain
  const leafGeo = [1.0, 1.22, 1.45].map(r => new THREE.IcosahedronGeometry(r, 0));
  const leafMat = new THREE.MeshStandardMaterial({ color: 0x1d2b1c, roughness: 1.0, flatShading: true });

  function makeTree(x, z, s = 1) {
    const g = new THREE.Group();
    g.position.set(x, 0, z);
    g.rotation.y = Math.random() * Math.PI * 2;
    g.scale.setScalar(s);
    // only trees the shadow camera actually covers pay for a shadow pass
    const shadowed = Math.abs(x) < 19 && Math.abs(z) < 19;
    const trunk = new THREE.Mesh(trunkGeo, matDarkWood);
    trunk.position.y = 2.6; trunk.castShadow = shadowed;
    g.add(trunk);
    const n = 6 + ((Math.random() * 3) | 0);
    for (let i = 0; i < n; i++) {
      const b = new THREE.Mesh(leafGeo[(Math.random() * leafGeo.length) | 0], leafMat);
      b.position.set((Math.random() - 0.5) * 2.4, 4.6 + Math.random() * 1.6, (Math.random() - 0.5) * 2.4);
      b.scale.setScalar(0.85 + Math.random() * 0.4);
      b.rotation.set(Math.random() * 3, Math.random() * 3, Math.random() * 3);
      b.castShadow = shadowed;
      g.add(b);
    }
    world.add(g);
    return g;
  }

  for (const [tx, tz, ts] of [
    [-13.5, 7.5, 1.00],    // the original, where it always was
    [-21.5, 12.5, 1.14],
    [-9.5, 18.5, 0.92],
    [-24.5, 3.5, 1.06],
    [11.5, 15.5, 1.04],
    [17.5, 6.0, 0.94],
    [23.5, 17.5, 1.18],
    [-15.0, 26.0, 1.10],
    [8.5, 26.5, 1.00],
    [-27.0, 20.5, 0.98],
    [26.0, 27.5, 1.12],
    [-4.5, 31.0, 0.90],
  ]) makeTree(tx, tz, ts);

  /* ---------------------------------------------------------- atmosphere */
  // drifting smoke from the burner
  const smokeTex = makeSoftDot('rgba(190,190,190,0.55)', 'rgba(190,190,190,0)');
  const SMOKE_N = LOW ? 70 : 130;
  const smokeGeo = new THREE.BufferGeometry();
  const sPos = new Float32Array(SMOKE_N * 3), sSeed = new Float32Array(SMOKE_N);
  for (let i = 0; i < SMOKE_N; i++) {
    sPos[i * 3] = SHRINE.x - 0.2 + (Math.random() - 0.5) * 0.9;
    sPos[i * 3 + 1] = 0.9 + Math.random() * 3.4;
    sPos[i * 3 + 2] = SHRINE.z + (Math.random() - 0.5) * 0.5;
    sSeed[i] = Math.random() * 100;
  }
  smokeGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3));
  const smoke = new THREE.Points(smokeGeo, new THREE.PointsMaterial({
    map: smokeTex, size: 2.4, transparent: true, opacity: 0.038,
    depthWrite: false, blending: THREE.NormalBlending, sizeAttenuation: true
  }));
  world.add(smoke);

  // embers rising from the drum
  const emberTex = makeSoftDot('rgba(255,170,60,1)', 'rgba(255,90,0,0)');
  const EM_N = LOW ? 26 : 48;
  const emGeo = new THREE.BufferGeometry();
  const ePos = new Float32Array(EM_N * 3);
  for (let i = 0; i < EM_N; i++) {
    ePos[i * 3] = SHRINE.x - 0.2 + (Math.random() - 0.5) * 0.4;
    ePos[i * 3 + 1] = 0.8 + Math.random() * 2.5;
    ePos[i * 3 + 2] = SHRINE.z + (Math.random() - 0.5) * 0.4;
  }
  emGeo.setAttribute('position', new THREE.BufferAttribute(ePos, 3));
  const embers = new THREE.Points(emGeo, new THREE.PointsMaterial({
    map: emberTex, size: 0.075, transparent: true, opacity: 0.6,
    depthWrite: false, blending: THREE.AdditiveBlending
  }));
  world.add(embers);

    /* ================================================================== */
    /* THE PROLOGUE SET (v6.4) — chapter 1's opening film lives here.       */
    /* Three memory POCKETS forty-four metres off the playable world, each   */
    /* a black bubble with its own light (chapter 4's flashback recipe); the */
    /* BOY — Chad's rigged young master — who walks through them and stands  */
    /* at the spawn point for the last beat; the LEAF, the BEAR and the      */
    /* folded NOTE he picks up; and the one hell note that passes his face.  */
    /* Everything here is hidden outside the film, and its lights sit under  */
    /* the hidden groups, so play pays nothing for any of it (an invisible   */
    /* subtree is never collected — the light count only changes on black). */
    /* docs/V6.4-PROLOGUE.md is the build's memory.                         */
    /* ================================================================== */
    const MEM = new THREE.Vector3(-44, 0, 6);          // memRoot, world
    const POCKET_Z = [0, -16, -32];                    // the three pockets, local z
    const memRoot = new THREE.Group();
    memRoot.position.copy(MEM);
    memRoot.visible = false;
    world.add(memRoot);
    const proRoot = new THREE.Group();                 // the present tense: the boy, the note, a fill
    proRoot.visible = false;
    world.add(proRoot);
    /* the pockets' concrete is a CLONE of the deck's material: blockers()
       collects every box that wears matConcrete, and a stairwell forty
       metres outside the bounds has no business in the collision list */
    const matPocketCon = matConcrete.clone();
    const matTarmac = new THREE.MeshStandardMaterial({ color: 0x1c1d20, roughness: 0.96 });
    const matPlaster = new THREE.MeshStandardMaterial({ color: 0xb9b3a4, roughness: 0.92 });
    const memLights = [];                              // [light, intensity when on]
    const memLight = (parent, color, on, dist, decay, x, y, z) => {
      const L = new THREE.PointLight(color, 0, dist, decay);
      L.position.set(x, y, z);
      parent.add(L);
      memLights.push([L, on]);
      return L;
    };
    const bubbleGeo = new THREE.SphereGeometry(6.5, 20, 12);
    const bubbleMat = new THREE.MeshBasicMaterial({ color: 0x0d0b16, side: THREE.BackSide, fog: false });
    const pocket = (z) => {
      const g = new THREE.Group();
      g.position.z = z;
      memRoot.add(g);
      g.add(new THREE.Mesh(bubbleGeo, bubbleMat));
      return g;
    };
    const P1 = pocket(POCKET_Z[0]), P2 = pocket(POCKET_Z[1]), P3 = pocket(POCKET_Z[2]);

    /* POCKET ONE · the verge — grass, a kerb, a footpath, a tree at the edge
       of frame, and a late afternoon that comes in low and gold from the
       side with a cool sky fill from the other. */
    {
      const lawn = new THREE.Mesh(new THREE.CircleGeometry(5.6, 28), matGrass);
      lawn.rotation.x = -Math.PI / 2; lawn.position.y = 0.02;
      P1.add(lawn);
      const kerb = new THREE.Mesh(new THREE.BoxGeometry(9, 0.14, 0.24), matPocketCon);
      kerb.position.set(0, 0.07, -2.0);
      P1.add(kerb);
      const path = new THREE.Mesh(new THREE.BoxGeometry(9, 0.10, 1.6), matPocketCon);
      path.position.set(0, 0.05, -3.0);
      P1.add(path);
      const trunk = new THREE.Mesh(trunkGeo, matDarkWood);
      trunk.position.set(-2.7, 2.6, -0.8);
      P1.add(trunk);
      for (let i = 0; i < 7; i++) {
        const b = new THREE.Mesh(leafGeo[i % 3], leafMat);
        b.position.set(-2.7 + ((i % 3) - 1) * 1.1, 4.5 + (i % 2) * 1.0, -0.8 + (((i * 7) % 5) - 2) * 0.5);
        b.scale.setScalar(0.9 + (i % 3) * 0.15);
        b.rotation.set(i * 0.7, i * 1.3, i * 0.4);
        P1.add(b);
      }
      memLight(P1, 0xffd2a0, 13.0, 13, 1.4, 2.4, 2.4, 1.8);     // the sun, low
      memLight(P1, 0x9fb8ff, 1.3, 11, 1.6, -2.2, 3.2, -2.6);  // the sky
    }
    /* POCKET TWO · the landing — a concrete floor, a plaster wall with a
       pipe down it, three steps up to a door that is not shown, a bin, a
       little litter, and one fluorescent tube that has gone green. */
    {
      const floor = new THREE.Mesh(new THREE.BoxGeometry(9, 0.04, 9), matPocketCon);
      floor.position.y = 0.0;
      P2.add(floor);
      const wall = new THREE.Mesh(new THREE.BoxGeometry(9, 3.0, 0.24), matPlaster);
      wall.position.set(0, 1.5, -3.2);
      P2.add(wall);
      const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 3.0, 8), matMetal);
      pipe.position.set(-1.6, 1.5, -3.02);
      P2.add(pipe);
      for (let i = 0; i < 3; i++) {                  // three steps rising toward +x
        const st = new THREE.Mesh(new THREE.BoxGeometry(0.34 * (3 - i) + 0.9, 0.17, 2.0), matPocketCon);
        st.position.set(2.2 + i * 0.17, 0.085 + i * 0.17, -2.2);
        P2.add(st);
      }
      const bin = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.22, 0.72, 12), matMetal);
      bin.position.set(-0.9, 0.36, -2.6);
      P2.add(bin);
      const litterMat = new THREE.MeshStandardMaterial({ color: 0xd8d0c0, roughness: 0.9, side: THREE.DoubleSide });
      for (const [lx, lz, ry] of [[-0.3, -1.9, 0.4], [0.9, -2.4, 1.9], [-1.4, -0.9, 2.6]]) {
        const l = new THREE.Mesh(new THREE.PlaneGeometry(0.16, 0.11), litterMat);
        l.rotation.set(-Math.PI / 2, 0, ry); l.position.set(lx, 0.024, lz);
        P2.add(l);
      }
      const tube = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.05, 0.08),
        new THREE.MeshBasicMaterial({ color: 0xd4ffe4, fog: false }));
      tube.position.set(0.2, 2.62, -1.4);
      P2.add(tube);
      memLight(P2, 0xcfffdf, 6.5, 9, 1.5, 0.2, 2.5, -1.4);     // the tube
      memLight(P2, 0x6a8fb0, 0.7, 9, 1.8, 3.2, 1.6, 1.8);      // a cold spill from the stair above
    }
    /* POCKET THREE · the pavement — a slab, a kerb, the road, a drain grating
       the note is caught against, and a sodium lamp over it all. */
    {
      const slab = new THREE.Mesh(new THREE.BoxGeometry(7, 0.12, 2.4), matPocketCon);
      slab.position.set(0, 0.06, 0.7);
      P3.add(slab);
      const kerb = new THREE.Mesh(new THREE.BoxGeometry(7, 0.14, 0.18), matPocketCon);
      kerb.position.set(0, 0.07, -0.55);
      P3.add(kerb);
      const road = new THREE.Mesh(new THREE.PlaneGeometry(9, 5), matTarmac);
      road.rotation.x = -Math.PI / 2; road.position.set(0, 0.005, -3.0);
      P3.add(road);
      const grate = new THREE.Group();
      grate.position.set(0.55, 0.121, 0.05);
      P3.add(grate);
      const grateFrame = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.02, 0.36), matMetal);
      grate.add(grateFrame);
      const slotMat = new THREE.MeshBasicMaterial({ color: 0x050505 });
      for (let i = 0; i < 6; i++) {
        const sl = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.024, 0.025), slotMat);
        sl.position.set(0, 0, -0.14 + i * 0.056);
        grate.add(sl);
      }
      const post = new THREE.Mesh(lampPostGeo, matMetal);
      post.position.set(1.1, 2.8, -1.3);
      P3.add(post);
      const arm = new THREE.Mesh(lampArmGeo, matMetal);
      arm.position.set(0.7, 5.55, -1.0); arm.rotation.y = -0.6;
      P3.add(arm);
      const head = new THREE.Mesh(lampHeadGeo, lampHeadMat);
      head.position.set(0.35, 5.5, -0.75);
      P3.add(head);
      memLight(P3, 0xffb367, 30.0, 14, 1.5, 0.35, 5.2, -0.7);   // the sodium lamp
      memLight(P3, 0x30405a, 0.5, 8, 1.8, -3.0, 1.2, 1.6);     // the night beyond its pool
    }

    /* THE THINGS HE FINDS. Each has two bodies: the one on the ground and
       an in-hand copy parented to his right hand bone, shown at the grab
       frame; restore() puts them back the way they were. The leaf is
       scaled to 11 cm — a birch leaf is four, and four vanishes in a 72°
       lens; the bear to 28 cm; the note is the real thing's size, folded. */
    const LEAF_AT = new THREE.Vector3(0, 0.04, 0);                  // P1 local, above the lawn's 0.02
    const BEAR_AT = new THREE.Vector3(0.3, 0.02, -1.0);             // P2 local
    const NOTE_AT = new THREE.Vector3(0.62, 0.142, 0.02);           // P3 local, on the grate
    const leafGround = new THREE.Group(), leafHand = new THREE.Group();
    leafGround.position.copy(LEAF_AT); P1.add(leafGround);
    const leafExtras = new THREE.Group(); P1.add(leafExtras);      // two more, not his
    const bearGround = new THREE.Group(), bearHand = new THREE.Group();
    bearGround.position.copy(BEAR_AT); P2.add(bearGround);
    const noteGround = new THREE.Group(), noteHand = new THREE.Group();
    noteGround.position.copy(NOTE_AT); P3.add(noteGround);
    leafHand.visible = bearHand.visible = noteHand.visible = false;
    // the folded five-dollar note: two hinged halves, each carrying half of the front
    const noteMat5 = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6, side: THREE.DoubleSide });
    loadImageTexture('note5').then(tex => {
      if (!alive || !tex) return;
      noteMat5.map = tex; noteMat5.needsUpdate = true;
    }).catch(() => {});
    function foldedNote() {
      const g = new THREE.Group();
      const half = (u0) => {
        const geo = new THREE.PlaneGeometry(0.066, 0.066);
        const uv = geo.attributes.uv;
        for (let i = 0; i < uv.count; i++) uv.setX(i, u0 + uv.getX(i) * 0.5);
        return new THREE.Mesh(geo, noteMat5);
      };
      const a = half(0); a.rotation.x = -Math.PI / 2; a.position.set(0, 0, 0.033);
      const hinge = new THREE.Group(); hinge.rotation.x = -0.42;   // sprung a little open
      const b = half(0.5); b.rotation.x = -Math.PI / 2; b.rotation.z = Math.PI; b.position.set(0, 0, -0.033);
      hinge.add(b);
      g.add(a, hinge);
      return g;
    }
    const noteFoldG = foldedNote(); noteFoldG.rotation.y = 0.35; noteFoldG.scale.setScalar(1.6); noteGround.add(noteFoldG);
    const noteFoldH = foldedNote(); noteFoldH.scale.setScalar(1.4); noteFoldH.position.set(0, 0.05, 0.02); noteFoldH.rotation.set(1.2, 0, 0.6); noteHand.add(noteFoldH);
    // the leaf and the bear arrive over nothing — a missing download costs a prop, never the film
    const fitTo = (g, height) => {
      const box = new THREE.Box3().setFromObject(g);
      const size = box.getSize(new THREE.Vector3());
      const s = height / Math.max(size.y, 1e-6);
      g.scale.multiplyScalar(s);                   // MULTIPLY: a clone of a fitted scene is already scaled
      g.updateMatrixWorld(true);
      const b2 = new THREE.Box3().setFromObject(g);
      g.position.y -= b2.min.y; g.position.x -= (b2.min.x + b2.max.x) / 2; g.position.z -= (b2.min.z + b2.max.z) / 2;
      return g;
    };
    assetBytes('leaf', true).then(BUF => new GLTFLoader().parse(BUF, '', (gltf) => {
      if (!alive) return;
      rescueTextures(gltf, BUF);
      gltf.scene.traverse(o => { if (o.isMesh) { o.material.side = THREE.DoubleSide; o.frustumCulled = false;
        if (o.material.map) { o.material.emissive.setScalar(0.35); o.material.emissiveMap = o.material.map; } o.material.needsUpdate = true; } });
      const mk = () => { const g = gltf.scene.clone(); g.rotation.x = -Math.PI / 2; g.scale.setScalar(2.2); return g; };
      const L = mk(); L.rotation.z = 0.6; L.position.y = 0.004; leafGround.add(L);
      const L2 = mk(); L2.rotation.z = 2.4; L2.position.set(-0.55, 0.04, 0.85); leafExtras.add(L2);
      const L3 = mk(); L3.rotation.z = -1.7; L3.position.set(0.9, 0.04, -0.35); L3.scale.setScalar(1.8); leafExtras.add(L3);
      /* in the hand: the bone's frame is nobody's guess — this pose was
         chosen from renders (docs/V6.4-PROLOGUE.md) */
      /* the hand bone's +y runs down the fingers (measured: 0.98 against the
         forearm-to-wrist line), so the props sit a few centimetres along it */
      const H = mk(); H.position.set(0.0, 0.075, 0.015); H.rotation.set(-0.5, 0.2, 1.3);
      leafHand.add(H);
    }, () => {})).catch(() => {});
    assetBytes('teddy', true).then(BUF => new GLTFLoader().parse(BUF, '', (gltf) => {
      if (!alive) return;
      rescueTextures(gltf, BUF);
      gltf.scene.traverse(o => { if (o.isMesh) { o.frustumCulled = false; o.castShadow = false;
        if (o.material.map) { o.material.emissive.setScalar(0.18); o.material.emissiveMap = o.material.map; o.material.needsUpdate = true; } } });
      const B = fitTo(gltf.scene, 0.28);
      const lie = new THREE.Group(); lie.add(B);
      lie.rotation.set(0, 0.9, Math.PI * 0.46);      // on its side on the concrete, face to the wall
      lie.position.y = 0.13;
      bearGround.add(lie);
      const held = new THREE.Group(); held.add(fitTo(gltf.scene.clone(), 0.28));
      held.position.set(0.09, 0.06, 0.0); held.rotation.set(0.2, 0.0, 1.57);
      bearHand.add(held);
    }, () => {})).catch(() => {});

    /* THE BOY. Chad's young master, rigged, five Mixamo takes baked in
       (walk, alert, walkpick, look, pick). Sized and grounded from POSED
       BONES to a head JOINT of 1.24 m — a crown of about 1.42, a boy of ten
       or eleven (the v5.07 lesson: the top bone is the head joint, not the
       crown). Hidden in play; the film shows him, and only the film.

       He is POSED BY TIME, never played: every take is parked at the frame
       the film asks for (`boyPose`), so a seek, a skip and a one-frame-a-
       second box all land on the same picture — the engine's whole rule
       ("a scene is a description of where things ARE at time t") applied
       to an actor. The head look-at is laid on AFTER the pose, inside the
       same call, so the order of the engine's frame cannot undo it.     */
    const BOY_H = 1.24;
    const boy = new THREE.Group();
    boy.position.set(0, 0, 17); boy.rotation.y = Math.PI;   // the spawn, facing the block
    proRoot.add(boy);
    let boyMixer = null, boyActs = null, boyHead = null, boyHand = null, boyReady = false, boyS = 1;
    const boyScale = () => boyS;
    const boyLook = { target: null, w: 0, x: 0, y: 0, last: 0 };
    const _lh = new THREE.Vector3();
    function boyLookApply() {
      if (!boyHead) return;
      const now = performance.now();
      const dt = Math.min(0.1, (now - (boyLook.last || now)) / 1000);
      boyLook.last = now;
      const T = boyLook.target, w = boyLook.w;
      let wy = 0, wx = 0;
      if (T && w > 0) {
        boyHead.getWorldPosition(_lh);
        const dx = T.x - _lh.x, dz = T.z - _lh.z, flat = Math.hypot(dx, dz);
        let dy = Math.atan2(dx, dz) - boy.rotation.y;
        dy = Math.atan2(Math.sin(dy), Math.cos(dy));
        /* the sign is MEASURED (a frame at the pass showed him turning
           away from the paper): on this rig a positive rotation.y turns
           the head to its own left, and dy is positive for a target on
           his right */
        wy = -THREE.MathUtils.clamp(dy, -1.15, 1.15) * w;
        wx = THREE.MathUtils.clamp(Math.atan2(T.y - _lh.y, Math.max(flat, 0.05)), -0.55, 0.75) * w;
      }
      const k = Math.min(1, dt * 4.5);
      boyLook.y += (wy - boyLook.y) * k;
      boyLook.x += (wx - boyLook.x) * k;
      boyHead.rotation.y += boyLook.y;
      boyHead.rotation.x += (-boyLook.x - boyHead.rotation.x) * Math.min(1, Math.abs(boyLook.x) * 6 + w * 0.9);
    }
    /* park `a` at time ta (and `b` at tb, blended by k); everything else off */
    function boyPose(a, ta, b, tb, k = 0) {
      if (!boyMixer || !boyActs) return;
      for (const [n, act] of Object.entries(boyActs)) {
        const use = n === a ? 1 - k : n === b ? k : 0;
        /* stop() unconditionally: a PAUSED action is not "running" but is
           still scheduled on the mixer at its old weight, and the first
           version of this asked isRunning() first — so the walk he arrived
           on never left the mix and every pick was half a walk (measured:
           the hand at 0.67 m at the grab frame, 0.16 once it was stopped) */
        if (use <= 0.001) { act.stop(); continue; }
        if (!act.isScheduled()) { act.reset(); act.play(); }
        act.paused = true;
        act.setEffectiveWeight(use);
        const d = act.getClip().duration, tt = n === a ? ta : tb;
        act.time = Math.max(0, Math.min(d - 1e-4, tt));
      }
      boyMixer.update(0);
      boyLookApply();
    }
    assetBytes('young').then(BUF => new GLTFLoader().parse(BUF, '', (gltf) => {
      if (!alive) return;
      rescueTextures(gltf, BUF);
      const g = gltf.scene;
      g.traverse(o => { if (o.isMesh) { o.castShadow = !LOW; o.frustumCulled = false; } });
      const NAMES = { Walking: 'walk', Alert: 'alert', Female_Walk_Pick_Put_In_Pocket: 'walkpick',
                      Look_Around_Dumbfounded: 'look', Male_Bend_Over_Pick_Up: 'pick' };
      if (gltf.animations && gltf.animations.length) {
        boyMixer = new THREE.AnimationMixer(g);
        const acts = {};
        for (const clip of gltf.animations) { const n = NAMES[clip.name]; if (n) acts[n] = boyMixer.clipAction(clip); }
        boyActs = acts;
        const st = acts.look || Object.values(acts)[0];
        if (st) { st.reset(); st.play(); st.paused = true; st.time = 2.6; boyMixer.update(0); }
      }
      g.updateMatrixWorld(true);
      const v = new THREE.Vector3();
      let toe = Infinity, head = -Infinity;
      g.traverse(o => {
        if (!o.isBone) return;
        o.getWorldPosition(v);
        if (/Toe|Foot/.test(o.name)) toe = Math.min(toe, v.y);
        if (HEAD_RE.test(o.name)) { head = Math.max(head, v.y); if (!boyHead) boyHead = o; }
        if (/RightHand$/.test(o.name) && !boyHand) boyHand = o;
      });
      if (isFinite(toe) && head > toe) {
        boyS = BOY_H / (head - toe);
        g.scale.setScalar(boyS);
        g.position.y = -toe * boyS;
      }
      if (boyHand) {
        boyHand.add(leafHand, bearHand, noteHand);
        /* the hand bone's frame is in the rig's own units (centimetres under
           a 0.01 root, times his sizing), so the in-hand groups undo the
           bone's WORLD scale and everything inside them is in metres */
        boy.add(g); g.updateMatrixWorld(true);
        const ws = new THREE.Vector3(); boyHand.getWorldScale(ws);
        for (const h of [leafHand, bearHand, noteHand]) h.scale.setScalar(1 / Math.max(ws.x, 1e-6));
      }
      if (g.parent !== boy) boy.add(g);
      boyReady = true;
      redoShadows();
    }, () => { boyReady = true; })).catch(() => { boyReady = true; });

    /* THE NOTE THAT COMES TO HIM — chapter 1's own note art on the chapter's
       own material, so setNoteTexture() brightens it with the rest */
    const flyNote = new THREE.Mesh(noteGeo, noteMat);
    flyNote.visible = false;
    proRoot.add(flyNote);
    // a warm fill on his face for the close-up, motivated by the deck's fire
    const faceFill = new THREE.PointLight(0xffb070, 0, 5, 1.6);
    faceFill.position.set(-0.55, 1.55, 16.25);
    proRoot.add(faceFill);

    function filmReset() {
      memRoot.visible = proRoot.visible = false;
      for (const [L] of memLights) L.intensity = 0;
      faceFill.intensity = 0;
      flyNote.visible = false;
      leafHand.visible = bearHand.visible = noteHand.visible = false;
      leafGround.visible = bearGround.visible = noteGround.visible = true;
      boyLook.target = null; boyLook.w = 0; boyLook.x = boyLook.y = 0;
      slowMo = 1;
      boy.position.set(0, 0, 17); boy.rotation.y = Math.PI;
    }

    /* ------------------------------------------------------ the frame ---
       Four separate calls rather than one, because the engine interleaves
       the ghost and the audio mix between them and the order is load-bearing:
       updatePile reads the state updateGhost may just have changed.        */
    function updateFire(t) {
      // during a cutscene the timeline owns the fire, so a scene can kill it
      // or knock it over without this fighting it every frame
      const fl = 0.75 + Math.sin(t * 11.3) * 0.14 + Math.sin(t * 27.7) * 0.09
                 + Math.random() * 0.08;
      if (getState() !== 'cine') {
        fireLight.intensity = 14 * fl;
        ash.material.color.setHSL(0.045, 1, 0.35 + fl * 0.16);
      }
      jossTips.forEach((tp, i) => {
        tp.material.color.setHSL(0.04, 1, 0.42 + Math.sin(t * 3 + i) * 0.1);
      });
    }

    /* Smoke and embers walk an array and re-upload a buffer, so the engine
       runs them at half rate on a phone and hands over the carried-over time
       — everything still drifts at the speed it always did.                */
    function updateSlow(sdt, t) {
      sdt *= slowMo;                              // v6.4: the prologue's slow motion
      const sp2 = smoke.geometry.attributes.position.array;
      for (let i = 0; i < SMOKE_N; i++) {
        sp2[i * 3 + 1] += sdt * (0.28 + (sSeed[i] % 1) * 0.3);
        sp2[i * 3] += Math.sin(t * 0.5 + sSeed[i]) * sdt * 0.12;
        if (sp2[i * 3 + 1] > 4.6) {
          sp2[i * 3 + 1] = 0.9;
          sp2[i * 3] = SHRINE.x - 0.2 + (Math.random() - 0.5) * 0.8;
          sp2[i * 3 + 2] = SHRINE.z + (Math.random() - 0.5) * 0.8;
        }
      }
      smoke.geometry.attributes.position.needsUpdate = true;

      const ep = embers.geometry.attributes.position.array;
      for (let i = 0; i < EM_N; i++) {
        ep[i * 3 + 1] += sdt * (0.7 + Math.random() * 0.5);
        ep[i * 3] += Math.sin(t * 1.7 + i) * sdt * 0.25;
        if (ep[i * 3 + 1] > 3.6) {
          ep[i * 3 + 1] = 0.8;
          ep[i * 3] = SHRINE.x - 0.2 + (Math.random() - 0.5) * 0.3;
          ep[i * 3 + 2] = SHRINE.z + (Math.random() - 0.5) * 0.3;
        }
      }
      embers.geometry.attributes.position.needsUpdate = true;
    }

    /* ---------------------------------------------------- cutscene state ---
       What a scene is allowed to borrow and must give back. The engine snaps
       the player, the ghost and the hands; this is the chapter's half.     */
    function snap() {
      return {
        drumPos: drum.position.clone(), drumRotZ: drum.rotation.z,
        ashVis: ash.visible, hero: heroNote.visible, storm: noteStorm,
        emberSize: embers.material.size, emberOp: embers.material.opacity
      };
    }
    function restore(s) {
      drum.position.copy(s.drumPos); drum.rotation.z = s.drumRotZ;
      ash.visible = s.ashVis;
      embers.material.size = s.emberSize; embers.material.opacity = s.emberOp;
      noteStorm = s.storm;
      heroNote.visible = s.hero;
      filmReset();                    // v6.4: the prologue's set goes back into the dark
    }

    // taken before a frame has run, so a restart gets the pristine values
    // however many times you go round
    const DRUM_REST = { pos: drum.position.clone(), rotZ: drum.rotation.z };
    function reset() {
      drum.position.copy(DRUM_REST.pos); drum.rotation.z = DRUM_REST.rotZ;
      ash.visible = true;
      heroNote.visible = true;
      noteStorm = 1;
      filmReset();
    }

    /* -------------------------------------------------------- collision ---
       The chapter knows its own walls. Concrete boxes at standing height are
       the deck's pillars, ceiling edge and back wall; the engine only needs
       the boxes.                                                            */
    function blockers() {
      const out = [];
      world.traverse(o => {
        if (o.isMesh && (o.material === matConcrete) && o.geometry.type === 'BoxGeometry') {
          o.updateWorldMatrix(true, false);
          const b = new THREE.Box3().setFromObject(o);
          b.expandByScalar(0.28);
          const h = b.max.y - b.min.y;
          if (b.min.y < 2.2 && h > 1.0) out.push(b);
        }
      });
      return out;
    }

    /* --------------------------------------------------------- teardown ---
       Advancing a chapter is dispose() then build(), never a page reload — a
       reload re-pays the GLB parse, the shader compile and the audio decode.
       So this has to give the GPU back everything build() took: geometries,
       materials and the textures hanging off them, which are NOT freed by
       removing the objects from the scene. Proven by leaktest, which builds
       and disposes fifty times and watches renderer.info.                  */
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
      for (const t of [gTex.map, gTex.rough, grassTex.map, grassTex.rough,
                       cTex.map, cTex.rough, lacquerTex, noteTex, lampPoolTex,
                       smokeTex, emberTex]) t?.dispose?.();
      world.clear();
      S = null;
    }

    return (S = {
      world, noteTex, blockers: blockers(),
      /* v6.4: the film's actor is preloaded and the black holds for him
         too (capped by whenWorldReady, so a lost download costs the boy,
         never the chapter) */
      ready: () => hdbReady && boyReady,
      pile: {
        pos: PILE_POS, radius: INTERACT_R, group: pile,
        dist: pileDist, screen: pileScreen, inView: pileInView,
        hits: pointerHitsPile, interact: interactPile,
        glow: () => pileRing.material.opacity
      },
      // the props the scenes animate
      drum, ash, embers, heroNote, smoke, flying, jossTips, fireLight,
      get noteStorm() { return noteStorm; },
      set noteStorm(v) { noteStorm = v; },
      /* v6.4 — what the prologue drives: the pockets and their lights, the
         boy (posed by time), the props, the note, the slow motion */
      MEM, POCKET_Z, memRoot, proRoot, memLights, faceFill, boy, flyNote,
      leafGround, leafHand, bearGround, bearHand, noteGround, noteHand,
      boyPose, boyLook, boyScale, boyHand: () => boyHand, boyHead: () => boyHead,
      boyActs: () => boyActs,
      get slowMo() { return slowMo; },
      set slowMo(v) { slowMo = v; },

      updateNotes, updatePile, updateFire, updateSlow,
      /* The drawn note is a placeholder. build() is synchronous and runs
         long before a download lands, so the world is made with the drawn
         one and the real art arrives here — every note, the pile, the hero
         note and (through the engine) the one in your hand, all at once.

         The brightening comes with the art, not before it: the print is
         saturated and dark, and at this light level it collapses into a
         tile unless the paper is lifted and given a little of its own
         glow. The drawn placeholder needs none of that. */
      setNoteTexture(tex) {
        if (!tex) return;
        for (const m of [noteMat, pileMat, heroNote.material]) {
          m.map = tex;
          m.color.setScalar(1.75);
          m.emissive.setScalar(0.20);
          m.emissiveMap = tex;
          m.needsUpdate = true;
        }
      },
      snap, restore, reset, dispose
    });
  }


  /* ====================================================================== */
  /* THE SCENES                                                             */
  /* ====================================================================== */
  /* One per choice, in the same order as DATA.choices. Each is handed the
     cine being built (c), the world snapshot taken as it started (s), and
     `api` — the engine's cutscene language: the verbs (tr/step/sfx/fade/
     camTo/yawTo/pitchTo/bob/ghostGlide/ghostFacePlayer), the easings, and
     the cast a scene may direct. This chapter's own props come through
     api.stage, which is the same handle build() returned.

     The engine re-derives every TRACK from absolute values each frame, so a
     scene is a description of where things ARE at time t, never a nudge —
     which is what makes skipping and seeking work at all (see LEARNINGS). */
  // where the burner drum stands in world space, for the kick scene
  const DRUM_W = { x: -1.2, z: -7.5 };
  /* A NOTE_POS = {x:0.35, z:-6.35} sat beside this in the engine and was read
     by nothing — a stale world-space copy of the hero note, which build()
     actually places relative to the offering group. Dropped in the v3.5 move
     rather than carried across, because a second answer to "where is the
     note" is worse than none.                                              */

function scPickUp(c, s, api) {                       /* A — you take it */
  const { tr, step, sfx, fade, camTo, yawTo, pitchTo, faceFrom, rawK, smoothK,
          stage, camera, ghost, ghostLight, ghostOpacity,
          handsRoot, armR, noteProp } = api;
    // the heap the player just tapped is what the hand goes to
    const P = { x: stage.pile.pos.x, y: 1.62, z: stage.pile.pos.z + 1.55 };
    // Her group origin sits a touch right of her face, so the staged spot
    // compensates — measured from a screenshot, not guessed.
    const FACE = { x: P.x - 0.14, z: P.z - 0.80 };

    camTo(0, 0.9, { x: s.yawPos.x, y: s.yawPos.y, z: s.yawPos.z }, P);
    yawTo(0, 0.9, s.yawRot, faceFrom(P.x, P.z, stage.pile.pos.x, stage.pile.pos.z));
    pitchTo(0, 0.9, s.pitchX, -0.58);

    // crouch toward it as the hand reaches forward into frame
    camTo(1.1, 2.5, P, { x: P.x, y: 1.12, z: P.z - 0.14 });
    pitchTo(1.1, 2.5, -0.58, -0.84);
    // Position comes from the root; the hand's ANGLE comes from armR itself.
    // Rotating the root would orbit the arm about the camera and swing it
    // clean out of frame — found the hard way, by an empty screenshot.
    tr(1.1, 2.5, k => {
      handsRoot.position.set(-0.15 * k, 0.185 * k, -0.09 * k);
      handsRoot.rotation.set(0, 0, 0);
      armR.rotation.set(0.50 - 0.48 * k, 0.28 - 0.13 * k, -0.48 + 0.28 * k);
    });
    // he stops breathing as the hand goes down. The scene had one noise in
    // its first three seconds and it was a page turning.
    sfx(1.15, 'breath', 0.55);
    step(2.5, () => { noteProp.visible = true; });
    sfx(2.5, 'take');

    // rise with it — and while you are looking at your hand, she arrives
    camTo(2.7, 3.9, { x: P.x, y: 1.12, z: P.z - 0.14 }, { x: P.x, y: 1.58, z: P.z });
    pitchTo(2.7, 3.9, -0.84, -0.34);
    tr(2.7, 3.9, k => {
      handsRoot.position.set(-0.15 + 0.05 * k, 0.185 - 0.07 * k, -0.09 + 0.09 * k);
      armR.rotation.set(0.02 + 0.60 * k, 0.15 - 0.05 * k, -0.20 - 0.05 * k);
    });
    /* She cannot be standing there early: at 0.8 m even a camera pitched hard
       at the floor still catches her gown, and the reveal dies. So she
       condenses DURING the look-up itself — position set as the sweep begins,
       opacity racing the pitch, fully there the instant the eyes arrive. */
    step(4.3, () => {
      ghost.position.set(FACE.x, 0, FACE.z);
      ghost.rotation.y = Math.atan2(P.x - FACE.x, P.z - FACE.z);
    });
    tr(4.35, 4.8, k => { ghostOpacity(k); ghostLight.intensity = 1.5 * k; }, rawK);
    tr(4.3, 5.2, k => { stage.fireLight.intensity = 14 - 11.5 * k; }, rawK);
    // the chord arrives with her, and the fire goes out under it
    sfx(4.22, 'strings', 0.85);
    sfx(4.30, 'firedie');

    // look up. she is already there.
    pitchTo(4.2, 5.1, -0.34, 0.03);
    camTo(4.2, 5.1, { x: P.x, y: 1.58, z: P.z }, P);
    tr(4.2, 5.1, k => { handsRoot.position.set(-0.10, 0.115 - 0.46 * k, 0); }, smoothK);
    sfx(4.75, 'boom');
    sfx(5.02, 'vgasp');            // his eyes arrive and she is already there
    tr(5.1, 6.6, k => { camera.rotation.z = 0.05 * k; }, rawK);
    tr(5.6, 6.6, k => { ghost.position.z = FACE.z + 0.17 * k; });   // one slow inch closer
    // three layers under the last approach, separated by register so they
    // stack instead of muddying: the bed low, her crying mid, the hit on top
    sfx(5.45, 'dread', 0.5);
    sfx(6.25, 'sobbing', 0.5);
    fade(6.6, 8.1, 0, 1);
    sfx(7.1, 'boom');

    c.endFade = 1;
  }

function scKick(c, s, api) {                         /* B — the burner goes over */
  const { tr, step, sfx, fade, camTo, yawTo, pitchTo, bob, ghostGlide,
          ghostFacePlayer, faceFrom, rawK, stage, camera, ghost, ghostLight,
          ghostOpacity, dirtyShadows } = api;
    const P = { x: 0.35, y: 1.62, z: -4.9 };
    const faceDrum = faceFrom(P.x, P.z, DRUM_W.x, DRUM_W.z);

    camTo(0, 0.8, { x: s.yawPos.x, y: s.yawPos.y, z: s.yawPos.z }, P);
    yawTo(0, 0.8, s.yawRot, faceDrum);
    pitchTo(0, 0.8, s.pitchX, -0.14);
    // she may already be stood right here from normal play — the scene owns
    // her now, and she is not part of this shot until the drum has gone over
    step(0, () => { ghostOpacity(0); });

    // the kick, told by its impact
    camTo(0.9, 1.2, P, { x: P.x - 0.32, y: 1.40, z: P.z - 0.55 }, rawK);
    pitchTo(0.9, 1.2, -0.14, -0.46, rawK);
    // the scoff lands before the boot does: the kick is a character beat,
    // and it was previously silent right up to the impact
    sfx(0.62, 'vscoff', 0.9);
    sfx(0.95, 'kick');
    sfx(1.15, 'clang');
    sfx(1.22, 'ashburst');         // the drum's insides across the concrete
    sfx(1.60, 'paperstorm');       // swelling exactly as noteStorm ramps
    step(1.15, () => { stage.ash.visible = false; });
    tr(1.15, 1.9, k => {
      stage.drum.rotation.z = 1.5 * k;
      stage.drum.position.set(-0.2 - 0.58 * k, 0.45 - 0.26 * k, 0.10 * k);
    });
  for (const at of [1.2, 1.45, 1.7, 2.0]) step(at, () => { dirtyShadows(2); });
    tr(1.15, 1.7, k => { stage.fireLight.intensity = 14 + 9 * Math.sin(Math.PI * k); }, rawK);
    tr(1.7, 2.6, k => { stage.fireLight.intensity = 14 - 12 * k; }, rawK);
    tr(1.15, 2.3, k => {
      stage.embers.material.size = 0.075 + 0.38 * Math.sin(Math.PI * k);
      stage.embers.material.opacity = 0.6 + 0.35 * Math.sin(Math.PI * k);
    }, rawK);
    tr(1.3, 3.2, k => { stage.noteStorm = 1 + 6.5 * k; });
    tr(3.2, 6.0, k => { stage.noteStorm = 7.5 - 5 * k; });

    // recover — and she is at the drum
    camTo(1.9, 2.5, { x: P.x - 0.32, y: 1.40, z: P.z - 0.55 }, P);
    pitchTo(1.9, 2.5, -0.46, -0.03);
    step(2.5, () => { ghost.position.set(-1.0, 0, -7.2); });
    tr(2.5, 2.85, k => { ghostOpacity(k); }, rawK);
    tr(2.9, 9.4, () => { ghostLight.intensity = 1.5; }, rawK);
    ghostFacePlayer(2.5, 9.4);
    ghostGlide(3.1, 3.55, { x: -1.0, z: -7.2 }, { x: 0.2, z: -5.9 });
    // was 'whoosh' — the old zip read as a cartoon. 'swoosh' is the same
    // sound the ghost already uses when she darts in normal play.
    sfx(3.15, 'swoosh');
    sfx(3.40, 'gwail', 0.9);       // and she comes after him, out loud
    c.ghostMix = t => (t < 2.5 || t > 9.4 ? 0 : t < 3.1 ? 0.7 : 2.4);

    // run
    yawTo(3.55, 4.25, faceDrum, Math.PI);
    const path1 = { x: P.x, y: 1.62, z: P.z }, path2 = { x: 0.75, y: 1.62, z: -0.9 },
          path3 = { x: 0.55, y: 1.62, z: 4.6 }, path4 = { x: 0.30, y: 1.62, z: 9.4 };
    camTo(4.25, 5.85, path1, path2, rawK);
    camTo(5.85, 7.4, path2, path3, rawK);
    bob(4.25, 7.4, 3.1, 0.055);
    for (let i = 0; i < 9; i++) sfx(4.35 + i * 0.34, 'step');
    sfx(4.60, 'vpant');            // his breath going, under the whole run
    ghostGlide(3.55, 5.85, { x: 0.2, z: -5.9 }, { x: 0.65, z: -1.6 });
    ghostGlide(5.85, 8.3, { x: 0.65, z: -1.6 }, { x: 0.45, z: 4.4 });

    // the look back — she is still coming
    camTo(7.4, 8.6, path3, path4, rawK);
    yawTo(7.4, 8.3, Math.PI, 0.28);
    pitchTo(7.4, 8.3, -0.03, -0.06);
    ghostGlide(8.3, 9.4, { x: 0.45, z: 4.4 }, { x: 0.33, z: 7.3 });
    sfx(7.55, 'dread', 0.7);       // under the look back
    sfx(8.5, 'boom');
    sfx(8.55, 'scream');           // him
    sfx(8.66, 'gscream', 0.85);    // and her, right behind it
    tr(8.6, 9.6, k => { camera.rotation.z = 0.05 * k; }, rawK);
    fade(8.8, 10.0, 0, 1);

    c.handsAuto = t => (t > 4.25 && t < 8.6 ? 4.3 : 0);
    c.endFade = 1;
  }

function scLeave(c, s, api) {                        /* C — you walk away */
  const { sfx, fade, camTo, yawTo, pitchTo, bob, faceFrom, rawK, SHRINE } = api;
    const P = { x: 0.15, y: 1.62, z: -4.3 };
    const faceShrine = faceFrom(P.x, P.z, SHRINE.x, SHRINE.z);

    camTo(0, 0.9, { x: s.yawPos.x, y: s.yawPos.y, z: s.yawPos.z }, P);
    yawTo(0, 0.9, s.yawRot, faceShrine);
    pitchTo(0, 0.9, s.pitchX, -0.16);

    // one long beat on the offerings: seen, considered, left alone
    camTo(1.0, 2.4, P, { x: P.x, y: 1.62, z: P.z - 0.35 });
    pitchTo(1.0, 2.4, -0.16, -0.24);

    yawTo(2.4, 3.7, faceShrine, Math.PI);
    pitchTo(2.4, 3.7, -0.24, -0.02);
    camTo(3.7, 6.9, { x: P.x, y: 1.62, z: P.z - 0.35 }, { x: 0.45, y: 1.62, z: 3.9 }, rawK);
    bob(3.7, 6.9, 2.1, 0.038);
    // Restraint is the point of this one — nothing happens, and that has to
    // be AUDIBLE rather than empty: a held breath, a low bed that never pays
    // off behind his turned back, and the exhale once he is clear.
    sfx(1.15, 'breath', 0.5);
    sfx(2.55, 'dread', 0.28);
    for (let i = 0; i < 6; i++) sfx(3.9 + i * 0.5, 'step');
    /* v5.18: 3.15, not 4.60. River's exhale runs 4.52 s where VALF's ran
       3.47, and from 4.60 it played a second and a half after the scene had
       handed over to the outcome card. From here it ends at 7.67, just
       inside the 7.7 the fade takes the picture out on, which is where an
       exhale belongs. */
    sfx(3.15, 'vrelief', 0.9);
    fade(6.1, 7.7, 0, 1);

    c.handsAuto = t => (t > 3.7 && t < 6.9 ? 2.3 : 0);
    c.endFade = 1;
  }

function scChant(c, s, api) {                        /* D — palms together */
  const { tr, step, sfx, camTo, yawTo, pitchTo, ghostGlide, ghostFacePlayer,
          faceFrom, rawK, SHRINE, THREE, stage, ghost, ghostOpacity, getReveal,
          buildPrayerArm, rightHand, setHandCurl, setHandPrayer,
          PRAYER_R, PRAYER_L, handWidth,
          handsRoot, armR, vmHemi, vmKey, vmFire } = api;
  // the mirrored left arm is built on the fly at 0.9 s; the tracks after
  // that read it, so the scene holds its own reference rather than
  // reaching back into the engine every frame
  let prayerArmL = null;
    const P = { x: 0.0, y: 1.62, z: -4.1 };
    const faceShrine = faceFrom(P.x, P.z, SHRINE.x, SHRINE.z);
    const HOME = { x: -1.05, z: -10.3 };

    camTo(0, 0.9, { x: s.yawPos.x, y: s.yawPos.y, z: s.yawPos.z }, P);
    yawTo(0, 0.9, s.yawRot, faceShrine);
    pitchTo(0, 0.9, s.pitchX, -0.10);
    ghostGlide(0, 0.9, { x: s.gPos.x, z: s.gPos.z }, HOME);
    ghostFacePlayer(0, 8.6);
  tr(0, 0.5, k => { ghostOpacity(Math.max(getReveal(), k)); }, rawK);

    // the hands rise into prayer
    step(0.9, () => {
      prayerArmL = buildPrayerArm();
      if (prayerArmL) prayerArmL.visible = true;
    });
    /* Into añjali: palms flat against each other, fingers straight up, the
       whole clasp centred in front of the chest. The orientations come from
       PRAYER_R / PRAYER_L — bases the engine derives from the hand's own
       axes — rather than from Euler triples, which is what left the first
       version splayed and facing the lens.

       The gap is half a palm's thickness either side of centre, taken from
       the measured hand so the palms MEET instead of overlapping or
       floating apart.                                                    */
    const half = handWidth() * 0.085;
    /* How high the clasp is held, and the ONE number that moves it — every
       height after this is derived from it, so the whole sequence stays
       consistent. Dropped 7 cm at v3.8: the arm rig's thumb sits higher off
       the fist than the old hand pack's did, and at the previous height its
       tip cleared the top of frame on its own, which reads as a stray finger
       rather than as hands. */
    const PRAY_Y = -0.235;
    const startR = armR.quaternion.clone();
    const startL = new THREE.Quaternion();
    let gotStartL = false;
    tr(0.9, 2.3, k => {
      const y = -0.46 + (PRAY_Y + 0.46) * k;
      armR.position.set(half, y, -0.375);
      armR.quaternion.slerpQuaternions(startR, PRAYER_R, k);
      if (prayerArmL) {
        if (!gotStartL) { startL.copy(prayerArmL.quaternion); gotStartL = true; }
        prayerArmL.position.set(-half, y, -0.375);
        prayerArmL.quaternion.slerpQuaternions(startL, PRAYER_L, k);
      }
      // straight AND closed — a straight-but-splayed hand is a wave
      if (rightHand()) setHandPrayer(rightHand(), k);
      if (prayerArmL) setHandPrayer(prayerArmL.userData.model, k);
      handsRoot.position.set(0, Math.sin(k * Math.PI) * 0.008, 0);
    });
    // the hands are the subject of this shot — light them like it
    tr(0.9, 2.0, k => {
      vmHemi.intensity = 0.55 + 0.55 * k;
      vmKey.intensity = 0.50 + 0.55 * k;
      vmFire.intensity = 2.4;
    }, rawK);
    sfx(0.85, 'bowl');             // struck as the palms come together
    sfx(1.0, 'chant');             // the chant itself, and nothing over it
    sfx(2.5, 'chime');
    tr(2.3, 8.6, () => { stage.fireLight.intensity = 9; }, rawK);

    // look up to her — and she lets go
    pitchTo(3.4, 4.3, -0.10, 0.11);
    // the hands sink a little as she is released, so you watch her go over them
    tr(4.3, 5.4, k => {
      const y = PRAY_Y - 0.10 * k;
      armR.position.y = y;
      if (prayerArmL) prayerArmL.position.y = y;
    });
    tr(4.3, 6.6, k => {
      ghostOpacity(1 - k);
      ghost.position.y = 0.5 * k;
    }, rawK);
    sfx(4.45, 'gsigh');            // she lets go, out loud
    sfx(5.3, 'chime');

    // hands come down; the night is ordinary again
    tr(6.6, 7.8, k => {
      const y = (PRAY_Y - 0.10) - 0.24 * k;
      armR.position.y = y;
      if (prayerArmL) prayerArmL.position.y = y;
    });
    /* A held beat of calm, with the eyes settling back to level so the shot
       is still moving while it waits. It ran to 10.4 s in v3.7 only to let a
       spoken chant line finish; that line is gone, so the beat is its old
       length again rather than two seconds of nothing. */
    pitchTo(7.8, 8.6, 0.11, -0.06);

    c.keep.ghostGone = true;
    c.endFade = 0;
  }


  /* ====================================================================== */
  /* THE PROLOGUE (v6.4) — the opening film                                  */
  /* ====================================================================== */
  /* He looks down at the world, and the world has never once looked back.
     Until it does. Three things picked up, in three pockets of light forty
     metres off the deck — a leaf on a verge in the afternoon, a bear on a
     stairwell landing under a green tube, a folded note by a drain in
     sodium light — with the lens at the level of the things and his face
     kept out of frame; then the deck at night, the close-up the film has
     withheld, one hell note passing his eyes in slow motion, his head
     turning to follow it, and the lens climbing after it to the moon.
     docs/V6.4-PROLOGUE.md is the beat sheet and the shot list.

     The boy is POSED BY TIME (stage.boyPose) from every track, so a seek
     lands on the right frame and a skip leaves no take running. Camera
     moves are `shot`s: the lens glides A -> B while it looks at P -> Q. */
  function intro(c, s, api) {
    const { tr, step, sfx, fade, faceFrom, rawK, smoothK, duck, stage,
            camera, yaw, pitch, ghostOpacity, handsRoot, armR, THREE } = api;
    const MEMX = stage.MEM.x, MEMZ = stage.MEM.z, PZ = stage.POCKET_Z;
    const at = (p, x, y, z) => ({ x: MEMX + x, y, z: MEMZ + PZ[p] + z });   // pocket-local -> world
    const lerp3 = (a, b, k) => ({ x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k, z: a.z + (b.z - a.z) * k });
    const aimAt = (cx, cy, cz, tx, ty, tz) => {
      yaw.position.set(cx, cy, cz);
      yaw.rotation.y = faceFrom(cx, cz, tx, tz);
      pitch.rotation.x = Math.atan2(ty - cy, Math.hypot(tx - cx, tz - cz));
    };
    const shot = (t0, t1, A, B, P, Q, ease) => tr(t0, t1, k => {
      const C = lerp3(A, B, k), T = lerp3(P, Q, k);
      aimAt(C.x, C.y, C.z, T.x, T.y, T.z);
    }, ease);
    const roll = (t0, t1, a, b) => tr(t0, t1, k => { camera.rotation.z = a + (b - a) * k; });
    /* a TAKE parked at the frame cine time asks for; it holds its last
       frame after t1 (the track holds), and a later take wins */
    const take = (t0, t1, name, rate = 1, off = 0, loopDur = 0) => tr(t0, t1, (k, t) => {
      let tt = off + (Math.min(t, t1) - t0) * rate;
      if (loopDur) tt = ((tt % loopDur) + loopDur) % loopDur;
      stage.boyPose(name, tt);
    }, rawK);
    const blend = (t0, t1, a, ta, b, tb) => tr(t0, t1, k => stage.boyPose(a, ta, b, tb, k));
    /* a GLIDE goes inert once it has delivered k = 1 (chapter 5's yawTr):
       a track holds after its end, and a held glide would win over every
       later step that moves him — he would stand in the verge for the
       whole film (v5.07's law, met again here) */
    const glide = (t0, t1, A, B, ease) => { let done = false; tr(t0, t1, k => {
      if (done) return;
      stage.boy.position.set(A.x + (B.x - A.x) * k, (A.y || 0) + ((B.y || 0) - (A.y || 0)) * k, A.z + (B.z - A.z) * k);
      if (k >= 1) done = true;
    }, ease); };
    // a shot that keeps its aim on his right HAND (plus an offset), wherever the take puts it
    const _hw = new THREE.Vector3();
    const shotHand = (t0, t1, A, B, off, ease) => tr(t0, t1, k => {
      const C = lerp3(A, B, k), h = stage.boyHand();
      if (h) { h.getWorldPosition(_hw); aimAt(C.x, C.y, C.z, _hw.x + off.x, _hw.y + off.y, _hw.z + off.z); }
    }, ease);
    const setLights = (p, k) => { for (const [L, on] of stage.memLights.slice(p * 2, p * 2 + 2)) L.intensity = on * k; };
    /* where he must STAND for a take's hand to land on a thing: the hand's
       offset in his own frame (measured on the takes, scaled to him), turned
       by his facing and taken away from the thing's position */
    const standFor = (T, ry, ox, oz) => ({
      x: T.x - (ox * Math.cos(ry) + oz * Math.sin(ry)), y: T.y > 0.1 ? 0.12 : 0,
      z: T.z - (-ox * Math.sin(ry) + oz * Math.cos(ry)) });
    const LEAF = at(0, 0, 0.014, 0), BEAR = at(1, 0.3, 0.02, -1.0), NOTE5 = at(2, 0.62, 0.135, 0.02);
    // pocket one: he faces -z with the leaf ahead; three metres of walk-in
    const RY1 = Math.PI, S1 = standFor(LEAF, RY1, -0.15, 0.33), W1 = { x: S1.x, y: 0, z: S1.z + 3.2 };
    // pocket two: from the top step, then from the step's foot to the bear
    const TOP2 = at(1, 2.35, 0.51, -2.2), FOOT2 = at(1, 1.75, 0, -1.55);
    const RY2a = Math.atan2(BEAR.x - TOP2.x, BEAR.z - TOP2.z);
    const RY2 = Math.atan2(BEAR.x - FOOT2.x, BEAR.z - FOOT2.z), S2 = standFor(BEAR, RY2, -0.15, 0.33);
    // pocket three: along the pavement toward +x; the walkpick take walks itself
    const RY3 = Math.PI / 2, S3 = standFor(NOTE5, RY3, 0.58, 1.16);
    const G3 = { x: S3.x + 0.15, y: 0.12, z: S3.z - 0.22 }, W3 = { x: G3.x - 1.9, y: 0.12, z: G3.z };
    const SP = { x: 0, y: 0, z: 17 };

    // ---- 0–4.4 BLACK. The day is heard before it is seen.
    step(0, () => {
      ghostOpacity(0); armR.visible = false; handsRoot.visible = false;
      stage.memRoot.visible = true; stage.proRoot.visible = true;
      stage.flyNote.visible = false;
      stage.boy.position.set(W1.x, 0, W1.z); stage.boy.rotation.y = RY1;
      duck('amb', 0.10); duck('fire', 0.10);
    });
    sfx(0.4, 'memday', 0.7);
    sfx(0.6, 'vpro1');

    // ---- 4.4–14.0 POCKET ONE · THE LEAF
    fade(4.4, 6.2, 1, 0);
    tr(4.4, 6.2, k => setLights(0, k), rawK);
    // 1a: a macro at the leaf, at ground level; his shoes arrive from behind it
    shot(4.4, 8.2, at(0, -0.06, 0.30, -0.40), at(0, -0.03, 0.27, -0.34),
                   LEAF, { x: LEAF.x - 0.06, y: 0.02, z: LEAF.z + 0.16 }, smoothK);
    take(4.4, 8.0, 'walk', 1.0, 0.2, 1.08);
    glide(4.6, 8.0, W1, { x: S1.x, y: 0, z: S1.z }, rawK);
    for (const st of [4.9, 5.5, 6.1, 6.7, 7.3]) sfx(st, 'step', 0.5);
    sfx(6.6, 'vpro2');
    // he stops, and bends
    blend(8.0, 8.4, 'walk', 0.2, 'pick', 0.0);
    take(8.4, 15.0, 'pick', 1.0, 0.0);                 // the grab at 8.4 + 1.45; the hand up from ~11.3
    step(9.85, () => { stage.leafGround.visible = false; stage.leafHand.visible = true; });
    sfx(9.85, 'leafpick', 0.7);
    // 1b: low three-quarter from behind the leaf, looking up; a push-in on the hand
    shotHand(8.2, 10.6, at(0, 0.78, 0.40, -1.0), at(0, 0.56, 0.34, -0.72), { x: 0, y: 0.04, z: 0 }, smoothK);
    shotHand(10.6, 14.0, at(0, 0.56, 0.34, -0.72), at(0, 0.30, 1.22, -0.40), { x: 0, y: 0.02, z: 0 }, smoothK);

    // ---- 14.0–25.2 POCKET TWO · THE TOY
    sfx(13.4, 'memday', 0.7);
    sfx(13.6, 'memwash', 0.6);
    fade(13.6, 14.2, 0, 1);
    tr(13.6, 14.2, k => setLights(0, 1 - k), rawK);
    step(14.2, () => {
      stage.leafHand.visible = false;
      stage.boy.position.set(TOP2.x, TOP2.y, TOP2.z); stage.boy.rotation.y = RY2a;
    });
    tr(14.2, 15.0, k => setLights(1, k), rawK);
    fade(14.4, 15.2, 1, 0);
    take(14.2, 19.0, 'alert', 1.0, 0.4);                // is anyone watching
    sfx(15.4, 'vpro3');
    // 2a: low, the bear large in the foreground, him small on the steps behind it
    shot(14.2, 19.0, at(1, -1.05, 0.22, -0.10), at(1, -0.85, 0.26, -0.22),
                     at(1, 0.9, 0.42, -1.45), at(1, 1.0, 0.48, -1.5), smoothK);
    roll(14.2, 19.0, 0.035, 0.035);
    // 2b: from ABOVE — he crosses to it, crouches, lifts it; the lens cranes down to his shoulder
    step(19.0, () => { stage.boy.position.set(FOOT2.x, 0, FOOT2.z); stage.boy.rotation.y = RY2; });
    roll(19.0, 19.05, 0.035, 0);
    take(19.0, 20.2, 'walk', 1.0, 0.3, 1.08);
    glide(19.0, 20.2, FOOT2, S2, rawK);
    sfx(19.3, 'step', 0.4); sfx(19.85, 'step', 0.4);
    blend(20.2, 20.5, 'walk', 0.5, 'pick', 0.0);
    take(20.5, 25.2, 'pick', 1.0, 0.0);                 // the grab at 21.95; held up from ~23.4
    step(21.95, () => { stage.bearGround.visible = false; stage.bearHand.visible = true; });
    sfx(21.9, 'toypick', 0.7);
    shot(19.0, 25.2, at(1, 0.9, 3.4, -0.5), at(1, -0.55, 1.35, 0.25),
                     at(1, 0.7, 0.0, -1.0), at(1, 0.55, 0.85, -0.85), smoothK);

    // ---- 25.2–36.2 POCKET THREE · THE MONEY
    sfx(24.4, 'memday', 0.7);
    sfx(24.8, 'memwash', 0.6);
    fade(24.8, 25.4, 0, 1);
    tr(24.8, 25.4, k => setLights(1, 1 - k), rawK);
    step(25.4, () => {
      stage.bearHand.visible = false;
      stage.boy.position.set(W3.x, 0.12, W3.z); stage.boy.rotation.y = RY3;
    });
    tr(25.4, 26.2, k => setLights(2, k), rawK);
    fade(25.6, 26.4, 1, 0);
    take(25.4, 27.4, 'walk', 1.0, 0.5, 1.08);
    glide(25.4, 27.4, W3, G3, rawK);
    for (const st of [25.6, 26.15, 26.7, 27.25]) sfx(st, 'step', 0.45);
    sfx(26.8, 'vpro4');
    /* the walk-pick-pocket take carries its own travel and starts with the
       hips off its origin, so the glide lands where its first frame stands
       and the group jumps back to the stand spot under it */
    step(27.4, () => { stage.boy.position.set(S3.x, 0.12, S3.z); });
    blend(27.4, 27.7, 'walk', 0.5, 'walkpick', 0.0);
    take(27.7, 36.2, 'walkpick', 1.0, 0.0);             // the stoop at 27.7 + 5.75
    // 3a: a TRACKING shot along the kerb that finds the note; his feet arrive
    shot(25.6, 31.5, at(2, -3.0, 0.34, -1.55), at(2, 0.25, 0.30, -1.25),
                     at(2, -1.6, 0.16, -0.10), NOTE5, smoothK);
    // 3b: from behind at hip height — the stoop, the pocket
    shot(31.5, 36.2, at(2, -1.7, 0.78, 0.95), at(2, -1.3, 0.72, 0.85),
                     at(2, 0.2, 0.45, 0.15), at(2, 0.5, 0.55, 0.20), smoothK);
    step(33.45, () => { stage.noteGround.visible = false; stage.noteHand.visible = true; });
    sfx(33.5, 'take', 0.55);

    // ---- 36.2–39.6 BLACK, held. The night comes up under the last line.
    sfx(35.4, 'memwash', 0.6);
    fade(35.4, 36.2, 0, 1);
    tr(35.4, 36.2, k => setLights(2, 1 - k), rawK);
    tr(35.6, 39.6, k => { duck('amb', 0.10 + 0.90 * k); duck('fire', 0.10 + 0.90 * k); }, rawK);
    step(36.2, () => {
      stage.memRoot.visible = false; stage.noteHand.visible = false;
      stage.boy.position.set(SP.x, 0, SP.z); stage.boy.rotation.y = Math.PI;
    });
    sfx(36.4, 'dread', 0.35);
    sfx(36.6, 'vpro5');

    // ---- 39.6–45.0 THE PRESENT · the wide: the block at night, him from behind
    fade(39.6, 41.2, 1, 0);
    shot(39.6, 45.0, { x: 1.9, y: 1.55, z: 21.6 }, { x: 0.75, y: 1.42, z: 18.7 },
                     { x: 0, y: 1.2, z: 12 }, { x: 0, y: 1.25, z: 15.5 }, smoothK);
    take(39.6, 45.0, 'look', 0.35, 2.4);

    // ---- 45.0–53.0 THE FACE · the world slows; the note comes to him
    tr(45.0, 46.2, k => { stage.slowMo = 1 - 0.88 * k; stage.noteStorm = 1 - 0.90 * k; }, smoothK);
    tr(45.0, 46.5, k => { duck('amb', 1 - 0.65 * k); duck('fire', 1 - 0.65 * k); }, rawK);
    tr(45.0, 47.0, k => { stage.faceFill.intensity = 2.4 * k; }, rawK);
    take(45.0, 59.0, 'look', 0.12, 4.3);
    sfx(45.0, 'noteslow', 0.8);
    step(45.0, () => { stage.flyNote.visible = true; });
    /* the note's path: keyframes in world space, a Catmull-Rom through them
       by TIME, and a flutter riding on top — in from frame left and low,
       nearest his eyes at 48.3, past his right shoulder, then up */
    const KEYS = [[45.0, -1.6, 1.00, 15.0], [47.0, -0.75, 1.24, 15.95], [48.3, -0.22, 1.39, 16.36],
                  [49.6, 0.30, 1.48, 16.58], [51.0, 0.75, 1.70, 16.55], [52.5, 1.00, 2.40, 16.2],
                  [54.0, 0.70, 4.4, 14.6], [55.5, -2.4, 7.9, 10.4], [57.0, -8.4, 12.0, 5.4], [59.0, -12.5, 16.5, 0.5]];
    const flyAt = (t) => {
      const K = KEYS, n = K.length;
      if (t <= K[0][0]) return { x: K[0][1], y: K[0][2], z: K[0][3] };
      if (t >= K[n - 1][0]) return { x: K[n - 1][1], y: K[n - 1][2], z: K[n - 1][3] };
      let i = 0; while (K[i + 1][0] < t) i++;
      const P0 = K[Math.max(0, i - 1)], P1 = K[i], P2 = K[i + 1], P3 = K[Math.min(n - 1, i + 2)];
      const h = P2[0] - P1[0], u = (t - P1[0]) / h, u2 = u * u, u3 = u2 * u;
      const out = { x: 0, y: 0, z: 0 };
      for (const [ax, j] of [['x', 1], ['y', 2], ['z', 3]]) {
        const m1 = (P2[j] - P0[j]) / (P2[0] - P0[0]) * h, m2 = (P3[j] - P1[j]) / (P3[0] - P1[0]) * h;
        out[ax] = (2 * u3 - 3 * u2 + 1) * P1[j] + (u3 - 2 * u2 + u) * m1 + (-2 * u3 + 3 * u2) * P2[j] + (u3 - u2) * m2;
      }
      const s2 = t - K[0][0], e = Math.min(1, s2 / 8);
      out.x += Math.sin(s2 * 6.1) * 0.03 * (1 - 0.6 * e);
      out.y += Math.sin(s2 * 9.7) * 0.02;
      return out;
    };
    const noteTarget = new THREE.Vector3();
    tr(45.0, 59.0, (k, t) => {
      const f = flyAt(t), s2 = t - 45.0;
      stage.flyNote.position.set(f.x, f.y, f.z);
      stage.flyNote.rotation.set(-Math.PI / 2 + Math.sin(s2 * 1.6) * 0.55, s2 * 0.55, 0.3 + Math.sin(s2 * 1.3) * 0.5);
      noteTarget.set(f.x, f.y, f.z);
      stage.boyLook.target = noteTarget;
      stage.boyLook.w = Math.min(1, Math.max(0, (t - 46.0) / 1.5));
    }, rawK);
    sfx(48.2, 'strings', 0.6);
    /* the ARC: the lens on a circle about his head, front-left to front-right
       through the pass, aimed at his face until the paper has crossed it,
       then handed to the paper and lifted after it */
    /* measured, not assumed: with the group at z 17 his head joint sits at
       (-0.08, 1.21, 16.71) and the face a hand's breadth forward of it */
    const HC = { x: -0.06, y: 1.28, z: 16.66 }, FACE = { x: -0.06, y: 1.29, z: 16.58 };
    tr(45.0, 57.5, (k, t) => {
      const u = Math.max(0, Math.min(1, (t - 45.0) / 8.0)), e = u * u * (3 - 2 * u);
      const a = -0.62 + 1.02 * e, r = 0.74;
      let cx = HC.x + Math.sin(a) * r, cy = 1.36 + 0.05 * e, cz = HC.z - Math.cos(a) * r;
      const v = Math.max(0, Math.min(1, (t - 53.0) / 4.5)), ev = v * v * (3 - 2 * v);
      cx += (0.35 - cx) * ev; cy += (3.2 - cy) * ev; cz += (16.9 - cz) * ev;
      const f = flyAt(t);
      const b = Math.max(0, Math.min(1, (t - 48.5) / 2.2)), eb = b * b * (3 - 2 * b);
      aimAt(cx, cy, cz, FACE.x + (f.x - FACE.x) * eb, FACE.y + (f.y - FACE.y) * eb, FACE.z + (f.z - FACE.z) * eb);
    }, rawK);
    roll(45.0, 53.0, 0.05, 0.0);

    // ---- 57.0–59.0 a fleck against the moon; black; the card
    fade(57.0, 59.0, 0, 1);
    sfx(58.2, 'boom', 0.4);
    step(59.0, () => { stage.proRoot.visible = false; armR.visible = true; handsRoot.visible = true; });

    c.keep.ghostGone = true;      // she is not standing there when play starts
    c.endFade = 1;
    c.keepFade = true;            // the chapter card comes up over this black
  }

  (window.__CHAPTERS__ = window.__CHAPTERS__ || {}).ch1 = Object.assign(DATA, {
    build,
    scenes: [scPickUp, scKick, scLeave, scChant],
    intro                          // v6.4: the prologue, before the chapter card
  });
})();
