/* Episode 3 · Chapter 4 · "The Pieces That Answered"
   ---------------------------------------------------------------------------
   THE FOURTH CHAPTER OF CASE FILE 3, "How It All Began" — S1·09, "When I
   Started Seeking Answers". A period of trying to understand what was
   happening to him: a Yin amulet of a young woman who died tragically —
   numbness up the arm, then an intense cold — put down with "I will not
   bring you home, but I will make merits under your name", and merit made
   for her at a temple; a Hanuman amulet at another shop — a roar in the
   mind, an urge for something to come in — let go at once, and the shop
   left in a hurry; and a shop owner he visited often, who noticed the
   sensitivity and handed him pieces to hold, "Lersi, Hanuman, all sorts",
   and every time he let his mind open, something seemed to respond.

   THE EPISODE'S AXIS IS CONTROL. Chapter 1 was ASKING, chapter 2 HANDS,
   chapter 3 VOICE. This is OPENING: he learns he can open the door himself,
   and does — once without choosing, once he lets go in time, and then three
   times on purpose, each answer staying behind him.

   THREE SHOPS (Chad, 23 Oct 2026: "Every amulet should be in a different
   shop, but the hanuman one can be the same shop that was in ep 3 chp 3. The
   other amulets should be totally different shops with totally different
   interior. The yin one should be an eerie looking shop with eerie sounding
   music, and the whole experience needs to be scary, haunting, eerie and
   dramatic"):
   - WORLD Y, x 0: the Yin shop, at the far end of an old mall's top floor.
   - WORLD H, x +250: chapter 3's shop at Golden Mile, an ordinary afternoon.
   - WORLD T, x −250: an old Chinatown shophouse of antiques and amulets.
   The far plane is 160 m (v8.9): none is ever drawn from another. Between Y
   and H, a film (`kit.film('merit')`): the temple, the envelope, kruat nam.
   Between H and T, the run out of the mall (`kit.film('runout')`).

   docs/V22.0-E3C4-PLAN.md is the build's memory, checkpoint by checkpoint. */

(() => {
  'use strict';

  let S = null;

  const DATA = {
    id: 4,
    episode: 3,
    title: 'The Pieces That Answered',
    cardLabel: 'Chapter 4',
    cardTitle: 'The Pieces That Answered',
    brief: 'You go looking for answers in amulet shops. Look around, listen to the people who keep them, and notice what the pieces do to you.',
    prompt: 'The owner holds out one more piece — one even he cannot name. What do you do?',
    /* four different KINDS of answer (v21.30): surrender, possession alone, withdrawal, guidance */
    choices: [
      { k: 'A', text: 'Take it, and open yourself — see what comes.',
        d: { sanity: -18, awareness: -9, wisdom: -27 }, verdict: 'worst', critical: true,
        say: 'I opened the door to prove it was there. It came in.',
        teach: 'Opening yourself to an unknown piece is the one experiment you cannot take back. Curiosity is not a reason to surrender control.' },
      { k: 'B', text: 'Buy it, and try it at home on your own.',
        d: { sanity: -9, awareness: 6, wisdom: -12 }, verdict: 'bad',
        say: 'I brought it home, and broke the promise I made to her.',
        teach: 'Testing in private is still testing — and alone, with no one to guide you, it is more dangerous, not less.' },
      { k: 'C', text: 'Put it down, thank him, and go.',
        d: { sanity: 9, awareness: 12, wisdom: 15 }, verdict: 'good',
        say: 'I put it down. I still didn\'t understand.',
        teach: 'Stopping is wise. But putting it down is only half of it: what you were doing still needs a proper answer.' },
      { k: 'D', text: 'Refuse to test it, and ask him who could teach you properly.',
        d: { sanity: 15, awareness: 24, wisdom: 30 }, verdict: 'best',
        say: 'I stopped testing, and asked for a teacher.',
        teach: 'Discernment, respect and proper guidance. You do not need to invite something in just to prove that something is there.' }
    ],
    /* S1·09's own lesson, in the second person and short (the v21.8 shape); no Pali tag (THE LESSON LINE) */
    core: 'Never deliberately test spiritual items by opening yourself up to see what comes in. Without proper knowledge and guidance you cannot be certain what you are experiencing — the danger is not the object, but surrendering control to something you cannot identify. You do not need to invite something in just to prove that something is there.',

    /* units metres, y up. WORLD Y (x 0): the Yin shop's inner faces x −2.4…2.4,
       z −8 (its back) … 0 (its door onto the corridor); the corridor z 0…5.
       WORLD H (x +250): chapter 3's shop, its own numbers under a group offset.
       WORLD T (x −250): the shophouse, z −9 … 0, the five-foot way z 0…2.2. */
    spawn:     { x: 0.25, y: 1.62, z: -0.95, rot: 0 },
    shrine:    { x: 1.3, z: -2.4 },          // the engine's anchor: the Yin shop's counter (ghost: null)
    ghostHome: { x: 1.3, z: -2.4 },
    bounds:    { minX: -262, maxX: 266, minZ: -11, maxZ: 6 },

    /* NO HAUNTING (the eleventh leak): nothing hunts him here — the pieces answer */
    ghost: null,

    /* WORLD Y's light: a dim unit at the end of a dim floor — a red altar
       lamp, one tube; the cold, the Hanuman's gold and the tray's presences
       are tweens away from the three worlds' own (kit.daylight) */
    daylight: {
      stops: [[0.00, '#2a2228'], [0.30, '#221a20'], [0.60, '#1a1418'], [1.00, '#120e10']],
      bg: 0x120e10,
      fog: [0x1c1416, 0.022],
      hemi: [0xffd9cc, 0x2a1810, 0.46],
      key: [0xffcab4, 0.36, 1, 6, 2],
      fill: [0xff8c72, 0.22],
      stars: 0, moon: 0,
      sun: 0, clouds: 0,
      vmHemi: [0xffd9cc, 0x2a1810, 0.62],
      vmKey: [0xffcab4, 0.5]
    },

    assets: ['granny', 'yinghost', 'yinwall', 'yingirl'],
    items: [],

    musicVol: 0,
    /* the beds, mixed every frame by where he is (mixBedsY): the cassette on the counter's shelf playing HER (its
       volume by distance, its pan by bearing, its RATE — the fourth value, main.js's loopRate — sagging with the
       cold and running down to a stop when he sets her down), the drone under the shop, the dead floor outside */
    ambience: { beds: [['y4song', 0, 0, 1], ['y4dread', 0], ['y4mall', 0]] },
    voiceLine: null,

    words: {
      approach: '',
      act: 'E to act',
      actTouch: 'Tap to act',
      interact: 'E to choose what you do',
      interactTouch: 'Tap to choose what you do',
      actLine: 'Press E to choose what you do',
      actLineTouch: 'Tap to choose what you do',
      // THE YIN SHOP
      objLook: 'Look around the shop · {n}/3',
      objKeeper: 'Talk to the shopkeeper',
      objPick: 'Pick up the amulet',
      objLeave: 'Leave the shop',
      lookBottles: 'The bottles of oil',
      lookPhotos: 'The old photographs',
      lookAltar: 'The small altar',
      hotKeeper: 'Talk to the shopkeeper',
      hotLocket: 'Pick up the amulet',
      evSteady: 'Steady',
      evSteadyBrief: 'Your hand is shaking. Keep her steady, and set her down gently: drag to hold the amulet inside the ring.',
      presenceCold: 'It is so cold.',
      noteSteady: 'Held her gently, and set her down with respect.',
      noteSlip: 'Let her slip from your hand.',
      noteMerit: 'Promised to make merit in her name, and did.',
      // THE MERIT FILM — the Yathā vārivahā verse, the Pali as it is chanted over what it means (checked at CP6)
      yatha1: 'Yathā vārivahā pūrā paripūrenti sāgaraṁ,',
      yatha1en: 'As rivers, when full, fill the ocean full,',
      yatha2: 'evam-eva ito dinnaṁ petānaṁ upakappati.',
      yatha2en: 'even so does what is given here benefit the dead.',
      // THE HANUMAN SHOP
      objOwner: 'See what the owner has for you',
      objHanuman: 'Pick up the Hanuman',
      hotOwner: 'Talk to the owner',
      hotHanuman: 'Pick up the Hanuman',
      evLetGo: 'Let go',
      evLetGoBrief: 'Something wants to come in. When the roar breaks, let go of it at once: wait for LET GO, then tap.',
      evLetGoWait: 'Hold…',
      evLetGoGo: 'LET GO',
      presenceIn: 'Something wants to come in.',
      noteLetGo: 'Let go of the Hanuman piece at once.',
      noteLate: 'Held on to the Hanuman piece too long.',
      // THE TRAY SHOP
      objSit: 'Sit at the counter',
      objPieces: 'Hold the pieces · {n}/3',
      hotStool: 'Sit at the counter',
      hotLersi: 'Hold the Lersi',
      hotWess: 'Hold the Thao Wessuwan',
      hotNaga: 'Hold the Phaya Naga',
      notePieces: 'Let your mind open to three pieces, one after another.'
    },
    sayPrefix: 'z4'
  };

  /* every line's measured length (ffprobe of the shipped take, masters/v22.0/secs.json) — the line queue books its
     window by it, so a voice never starts over another. The names are QUOTED on purpose: build.py gives a sound to a
     chapter's own pack only when the chapter names it in quotes, and a line it cannot attribute goes to the SHARED
     pack every player downloads at boot (measured: unquoted, the shared Opus pack grew 5.35 -> 7.29 MB) */
  const SECS = {
    /* the film */ 'z4pro1': 7.97, 'z4pro2': 7.08, 'z4pro3': 5.72, 'z4pro4': 5.41,
    /* the Yin shop */ 'z4look1': 7.47, 'z4look2': 7.47, 'z4look3': 5.64, 'yk4hello': 2.69, 'yk4show': 13.61, 'z4ask': 1.8, 'yk4gentle': 6.64, 'z4numb': 3.24, 'z4cold': 4.23, 'z4beside': 4.13, 'z4yin': 5.64, 'yk4heard': 1.96, 'yk4merit': 4.55,
    /* the merit film */ 'z4tem1': 4.13, 'z4dedicate': 7.24, 'mk4yatha': 12.12, 'z4tem2': 2.85, 'z4han0': 4.05,
    /* the Hanuman */ 'ow4hello': 4.75, 'z4fine': 4.52, 'ow4new': 5.88, 'z4roar': 4.83, 'z4urge': 3.74, 'ow4ok': 3.55, 'z4go': 3.63, 'sm4what': 2.43, 'z4hide': 6.69, 'z4tray0': 6.43,
    /* the tray */ 'to4hello': 3.37, 'to4notice': 8.33, 'z4sense': 1.78, 'to4tray': 4.52, 'z4lersi': 6.77, 'to4lersi': 3.84, 'z4wess': 4.13, 'to4wess': 4.49, 'z4naga': 5.41, 'to4naga': 3.47, 'to4unknown': 7.39, 'to4clock': 3.53, 'z4feel': 3.63,
    /* A */ 'z4A1': 6.19, 'z4A1b': 3.55, 'to4A1': 2.8, 'z4A2b': 1.96, 'to4A3': 6.37, 'z4A2': 4.13, 'to4A2': 5.07, 'z4A3': 10.27, 'z4A4': 5.64,
    /* B */ 'z4B1': 2.51, 'to4B1': 5.43, 'z4B1b': 2.43, 'z4B2': 7.39, 'z4B3': 7.03, 'z4B5': 3.47, 'to4B2': 3.97, 'z4B4': 5.56,
    /* C */ 'z4C1': 3.71, 'to4C1': 3.79, 'to4C2': 2.85, 'z4C2': 4.91, 'z4C3': 7.08, 'z4C4': 7.89,
    /* D */ 'z4D1': 8.2, 'to4D1': 6.9, 'z4D2': 4.52, 'to4D2': 7.05, 'z4D5': 1.88, 'to4D3': 3.89, 'z4D3': 8.36, 'z4D4': 6.19,
    /* the cards */ 'z4A': 4.91, 'z4B': 3.4, 'z4C': 3.87, 'z4D': 2.69
  };

  const hash = (i, s) => { const x = Math.sin(i * 127.1 + s * 311.7) * 43758.5453; return x - Math.floor(x); };
  const smooth = k => k * k * (3 - 2 * k);
  const cl01 = x => Math.max(0, Math.min(1, x));

  function build(ctx) {
    const { THREE, GLTFLoader, cloneSkinned, scene, camera, yaw, pitch, LOW, kit, plantTrees,
            assetBytes, rescueTextures, redoShadows, cnv, makeSoftDot, loadImageTexture,
            getState, startDecision, worldSfx, warmSounds, soundOff, HEAD_RE, unifySkeletons } = ctx;

    const owned = [];
    const treeStands = [];
    let alive = true;
    const parsedGlb = new Map();
    const madeTex = [];
    const tex = (t) => { madeTex.push(t); return t; };

    /* ------------------------------------------------------------- the map */
    const HX = 250, TX = -250;                            // WORLD H's and WORLD T's x
    const YSHOP = { x0: -2.4, x1: 2.4, z0: -8.0, z1: 0.0, H: 2.6 };
    const YMALL = { x0: -24.0, x1: 6.0, z0: 0.0, z1: 5.0, H: 3.2 };   // the corridor; the atrium void beyond z 5
    const YVOID = { z0: 5.0, z1: 11.0, floor: -4.6, sky: 6.4 };       // the void, the floor below, the skylight
    const YDOOR = { x0: -0.55, x1: 0.55, h: 2.15 };       // the Yin shop's door, onto the corridor
    const YCNT  = { x0: 0.95, x1: 1.55, zf: -1.45, zb: -3.75, top: 0.95 };   // the keeper's counter, front right, its face to −x
    const KEEP  = { x: 2.02, z: -2.62 };                  // the keeper, standing behind it, facing −x
    const YBOX  = { x: 1.18, z: -2.62 };                  // the velvet box on the counter, in front of her
    const YALT  = { x: 0.35, z: -7.62, w: 1.5, d: 0.62, h: 0.78 };   // the spirit altar against the back wall
    const YGIRL = { z: -5.95, y: 1.52 };                  // her portrait on the right wall, the flowers under it
    const HSHOP = { x0: -4.5, x1: 4.5, z0: -7.0, z1: 0.0, H: 2.9 };       // chapter 3's shop (local to WORLD H)
    const HMALL = { x0: -14, x1: 14, z0: 0.0, z1: 5.0, H: 3.6 };
    const HARRIVE = { x: HX + 0.0, z: -0.95 };
    const TSHOP = { x0: -3.0, x1: 3.0, z0: -9.0, z1: 0.0, H: 3.6 };       // the shophouse (local to WORLD T)
    const TWAY  = { z0: 0.0, z1: 2.2 };                   // its five-foot way
    const TCNT  = { x0: -1.2, x1: 2.2, z: -6.0, d: 0.62, top: 0.98 };     // the counter, across the shop
    const TARRIVE = { x: TX + 0.4, z: -1.2 };
    const TSTOOL = { x: TX + 0.55, z: -5.0 };             // his stool, at the counter's middle
    const TOWN = { x: TX + 0.55, z: -6.85 };              // the owner, behind it
    const PILE_POS = new THREE.Vector3(TX + 0.55, 0, -5.82);   // the fourth piece, on the counter in front of him

    /* ----------------------------------------------------------- materials */
    const mats = [];
    const M = (o) => { const m = new THREE.MeshStandardMaterial(o); mats.push(m); return m; };
    const matTerr   = M({ color: 0x8a8478, roughness: 0.5 });       // WORLD H's corridor floor (CP7 replaces with chapter 3's)
    const matWallC  = M({ color: 0xb8b0a0, roughness: 0.92 });
    const matWallH  = M({ color: 0xf1ece2, roughness: 0.92 });      // WORLD H (CP7 replaces with chapter 3's shop)
    const matFloorH = M({ color: 0xd8d0c0, roughness: 0.35 });
    const matWallT  = M({ color: 0xe2d6bc, roughness: 0.92 });      // WORLD T (CP8)
    const matFloorT = M({ color: 0x7a5236, roughness: 0.55 });
    const matCeilT  = M({ color: 0xd6ccb4, roughness: 0.95 });
    const matWood   = M({ color: 0x3e2414, roughness: 0.5 });
    const matWoodL  = M({ color: 0x8a5a34, roughness: 0.55 });
    const matDark   = M({ color: 0x15100e, roughness: 0.8 });
    const matRed    = M({ color: 0x8e1d14, roughness: 0.42 });
    const matGold   = M({ color: 0xd9a63c, roughness: 0.3, metalness: 0.55, emissive: 0x3a2406, emissiveIntensity: 0.6 });
    const matProxy  = M({ color: 0x8d7a66, roughness: 0.9 });

    const world = new THREE.Group();
    scene.add(world);
    const worldY = new THREE.Group(); world.add(worldY);
    const worldH = new THREE.Group(); worldH.position.x = HX; world.add(worldH);   // its own numbers, offset
    const worldT = new THREE.Group(); worldT.position.x = TX; world.add(worldT);

    const walls = [], solids = [];
    const box = (w, h, d, x, y, z, mat, parent = world, cast = true) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
      m.position.set(x, y, z); m.castShadow = cast && !LOW; m.receiveShadow = true;
      parent.add(m); return m;
    };
    const cyl = (r0, r1, h, x, y, z, mat, seg = 14, parent = world) => {
      const m = new THREE.Mesh(new THREE.CylinderGeometry(r0, r1, h, seg), mat);
      m.position.set(x, y, z); m.castShadow = !LOW; m.receiveShadow = true;
      parent.add(m); return m;
    };
    const plane = (w, h, mat, x, y, z, ry = 0, parent = world) => {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat);
      m.position.set(x, y, z); m.rotation.y = ry; m.receiveShadow = true;
      parent.add(m); return m;
    };
    const floorAt = (w, d, x, z, mat, parent) => {
      const f = new THREE.Mesh(new THREE.PlaneGeometry(w, d), mat);
      f.rotation.x = -Math.PI / 2; f.position.set(x, 0, z); f.receiveShadow = true; parent.add(f); return f;
    };
    const ceilAt = (w, d, x, y, z, mat, parent) => {
      const c = new THREE.Mesh(new THREE.PlaneGeometry(w, d), mat);
      c.rotation.x = Math.PI / 2; c.position.set(x, y, z); parent.add(c); return c;
    };
    /* an invisible box that is only a blocker (collision reads it drawn or not) */
    const hidBox = (w, h, d, x, y, z, parent) => { const m = box(w, h, d, x, y, z, matProxy, parent, false); m.visible = false; return m; };

    /* ------------------------------------------------- one parse per asset */
    function parseOnce(key) {
      if (!parsedGlb.has(key)) {
        parsedGlb.set(key, assetBytes(key).then(BUF => new Promise((res, rej) =>
          new GLTFLoader().parse(BUF, '', (gltf) => {
            rescueTextures(gltf, BUF);
            if (unifySkeletons) unifySkeletons(gltf.scene);
            res({ scene: gltf.scene, animations: gltf.animations });
          }, rej))));
      }
      return parsedGlb.get(key);
    }

    /* ============================================== WORLD Y · THE YIN SHOP (CP4)
       An old mall's top floor one afternoon: a dead corridor of shutters along an atrium void, its escalator taped
       off, and at the far end the one unit still open — a narrow shop lit red, an old song on a cassette. Lamps are
       emissive and painted (the v15.1 law: a light count never changes in play): a red bulb on the spirit altar,
       one tube that flickers, candles; every pool of light on a wall or the floor is an additive plane. What moves
       (the flames, the tube, the beads, the back curtain, the dust, the smoke) is driven from yTick each frame. */
    const yLive = { flames: [], tube: null, tubeGlow: [], beads: [], curtain: null, motes: null, smoke: [], redGlow: [], k: 1, flameK: 1, redK: 1, smokeK: 1 };

    /* ------------------------------------------------------------------ WORLD Y, built
       (a function declaration: hoisted, and CALLED BELOW the people's own declarations — it makes the keeper with
       mkPerson, which reads `people` and its scratch vectors at call time: the v21.1 dead-zone law) */
    function buildWorldY() {
      const G = worldY;
      const W = YSHOP.x1 - YSHOP.x0, D = YSHOP.z1 - YSHOP.z0, cz = (YSHOP.z0 + YSHOP.z1) / 2, H = YSHOP.H;
      /* ---- textures and materials (drawn; nothing downloaded but the two photographs) */
      const tFloor = tex(makeYinFloor(THREE, cnv));
      const tPlaster = tex(makeYinPlaster(THREE, cnv));
      const tWood = tex(makeYinWood(THREE, cnv));
      const tCeil = tex(makeYinCeil(THREE, cnv));
      const tRedCloth = tex(makeYinRedCloth(THREE, cnv));
      const tYant = tex(makeYinYant(THREE, cnv, 3));
      const tYant2 = tex(makeYinYant(THREE, cnv, 7));
      const tCurtain = tex(makeYinCurtain(THREE, cnv));
      const tLace = tex(makeYinLace(THREE, cnv));
      const tShutter = tex(makeYinShutter(THREE, cnv));
      const tTerr = tex(makeYinTerrazzo(THREE, cnv));
      const tCeilC = tex(makeYinCeilC(THREE, cnv));
      const tGlassWords = tex(makeYinGlassWords(THREE, cnv));
      const tCal = tex(makeYinCalendar(THREE, cnv));
      const tRadio = tex(makeYinRadio(THREE, cnv));
      const tFlame = tex(makeYinFlame(THREE, cnv));
      const tSmoke = tex(makeYinSmoke(THREE, cnv));
      const tGlow = tex(makeYinGlow(THREE, cnv));
      yLive.tSmoke = tSmoke; yLive.tGlow = tGlow;       // CP5: his breath's puffs and the static's glow
      const tSky = tex(makeYinSkylight(THREE, cnv));
      const tSigns = tex(makeYinSigns(THREE, cnv));
      const tToLet = tex(makeYinToLet(THREE, cnv));
      const tExit = tex(makeYinExit(THREE, cnv));
      const tLabel = tex(makeYinLabel(THREE, cnv));
      const repeatTex = (t, rx, ry) => { const c = t.clone(); c.wrapS = c.wrapT = THREE.RepeatWrapping; c.repeat.set(rx, ry); c.needsUpdate = true; madeTex.push(c); return c; };
      const mFloor   = M({ map: tFloor, roughness: 0.62, metalness: 0.0 });
      const mPlaster = M({ map: tPlaster, color: 0xd9c6ae, roughness: 0.96 });
      const mWood    = M({ map: tWood, color: 0x8c5a3c, roughness: 0.48 });
      const mWoodDk  = M({ map: tWood, color: 0x4a2c1c, roughness: 0.42 });
      const mCeil    = M({ map: tCeil, color: 0xc8baa4, roughness: 0.95 });
      const mRed     = M({ map: tRedCloth, color: 0xffffff, roughness: 0.82 });
      const mCurtain = M({ map: tCurtain, roughness: 0.9, side: THREE.DoubleSide });
      const mLace    = M({ map: tLace, color: 0xf0e6d6, roughness: 0.9, transparent: true, alphaTest: 0.35, side: THREE.DoubleSide });
      const mGlass   = M({ color: 0xbfd4cf, roughness: 0.06, metalness: 0.2, transparent: true, opacity: 0.12, depthWrite: false });
      const mGlassDirty = M({ color: 0x9aa59c, roughness: 0.3, metalness: 0.1, transparent: true, opacity: 0.22, depthWrite: false });
      const mAlu     = M({ color: 0x8e9294, roughness: 0.4, metalness: 0.7 });
      const mBrass   = M({ color: 0xb08a3e, roughness: 0.36, metalness: 0.8 });
      const mGilt    = M({ color: 0xb8913a, roughness: 0.4, metalness: 0.7, emissive: 0x241604, emissiveIntensity: 0.4 });
      const mWhiteWax = M({ color: 0xf1ead8, roughness: 0.55 });
      const mVelvet  = M({ color: 0x4a0d14, roughness: 0.92 });
      const mSatin   = M({ color: 0xe6d8bc, roughness: 0.45 });
      const mPaper   = M({ color: 0xe9dcc0, roughness: 0.92 });
      const mYant    = M({ map: tYant, roughness: 0.9 });
      const mYant2   = M({ map: tYant2, roughness: 0.9 });
      const mBlack   = M({ color: 0x0b0908, roughness: 0.9 });
      const mShutter = M({ map: repeatTex(tShutter, 2, 1), color: 0xa9adb0, roughness: 0.55, metalness: 0.45 });
      const mTerr    = M({ map: repeatTex(tTerr, (YMALL.x1 - YMALL.x0) / 2.5, (YMALL.z1 - YMALL.z0) / 2.5), color: 0x9c988e, roughness: 0.38 });
      const mCeilC   = M({ map: repeatTex(tCeilC, (YMALL.x1 - YMALL.x0) / 2.4, (YMALL.z1 - YMALL.z0) / 2.4), color: 0x9c968c, roughness: 0.95 });
      const mPillar  = M({ color: 0xcfc8ba, roughness: 0.6 });
      const mSteel   = M({ color: 0x9aa0a4, roughness: 0.32, metalness: 0.85 });
      const mRubber  = M({ color: 0x141414, roughness: 0.6 });
      const mDarkUnit = M({ color: 0x0d0c0c, roughness: 0.95 });
      const mSlab    = M({ color: 0x8a8478, roughness: 0.9 });
      const mHazard  = M({ map: tex(makeYinHazard(THREE, cnv)), roughness: 0.6 });
      const addMat = (map, color, op) => { const m = new THREE.MeshBasicMaterial({ map, color, transparent: true, opacity: op, depthWrite: false, blending: THREE.AdditiveBlending, fog: false, toneMapped: false }); mats.push(m); return m; };
      const glowPlane = (w, h, color, op, x, y, z, rx = 0, ry = 0) => {
        const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), addMat(tGlow, color, op));
        m.position.set(x, y, z); m.rotation.set(rx, ry, 0); m.renderOrder = 3; m.userData.op = op; G.add(m); return m;
      };
      /* a plane whose texture repeats once per `per` metres (the wall planes; boxes would stretch it) */
      const tiled = (w, h, mat, per, x, y, z, ry = 0, rx = 0) => {
        const geo = new THREE.PlaneGeometry(w, h), uv = geo.attributes.uv;
        for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * w / per, uv.getY(i) * h / per);
        const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.rotation.set(rx, ry, 0); m.receiveShadow = true; G.add(m); return m;
      };
      const matRep = (base, t) => { const m = base.clone(); m.map = t; mats.push(m); return m; };
      /* a box whose texture repeats once per `per` metres on every face (BoxGeometry's faces: +x −x +y −y +z −z) */
      const boxT = (w, h, d, x, y, z, mat, per) => {
        const geo = new THREE.BoxGeometry(w, h, d), uv = geo.attributes.uv;
        const span = [[d, h], [d, h], [w, d], [w, d], [w, h], [w, h]];
        for (let f = 0; f < 6; f++) for (let k = 0; k < 4; k++) { const i = f * 4 + k; uv.setXY(i, uv.getX(i) * span[f][0] / per, uv.getY(i) * span[f][1] / per); }
        const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.receiveShadow = true; G.add(m); return m;
      };
      const mPlasterR = matRep(mPlaster, repeatTex(tPlaster, 1, 1));
      const mWoodR = matRep(mWood, repeatTex(tWood, 1, 1));
      const mWoodDkR = matRep(mWoodDk, repeatTex(tWood, 1, 1));

      /* ---- the shell. The CP1 boxes stay as the BLOCKERS, drawn no more; what is seen is planes and trims. */
      { const f = floorAt(W, D, 0, cz, mFloor, G);
        const uv = f.geometry.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * W / 1.2, uv.getY(i) * D / 1.2); }
      { const c = ceilAt(W, D, 0, H, cz, mCeil, G);
        const uv = c.geometry.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * W / 2.4, uv.getY(i) * D / 2.4);
        c.material = matRep(mCeil, repeatTex(tCeil, 1, 1)); }
      // a missing ceiling panel over the back corner: the dark above it
      { const hole = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 0.6), mBlack); hole.rotation.x = Math.PI / 2; hole.position.set(-1.5, H - 0.003, -6.9); G.add(hole); }
      const blockerOnly = (w, h, d, x, y, z) => { const m = hidBox(w, h, d, x, y, z, G); walls.push(m); return m; };
      blockerOnly(W + 0.4, H, 0.2, 0, H / 2, YSHOP.z0 - 0.1);
      blockerOnly(0.2, H, D, YSHOP.x0 - 0.1, H / 2, cz);
      blockerOnly(0.2, H, D, YSHOP.x1 + 0.1, H / 2, cz);
      const lw = YDOOR.x0 - YSHOP.x0, rw = YSHOP.x1 - YDOOR.x1;
      blockerOnly(lw, H, 0.2, YSHOP.x0 + lw / 2, H / 2, 0.1);
      blockerOnly(rw, H, 0.2, YDOOR.x1 + rw / 2, H / 2, 0.1);
      // the walls as they are seen: a dark wainscot to 0.95 m, a rail, stained plaster above
      const WAIN = 0.95;
      const wallRun = (len, cx, cz2, ry) => {
        tiled(len, H - WAIN, mPlasterR, 2.2, cx, WAIN + (H - WAIN) / 2, cz2, ry);
        tiled(len, WAIN, mWoodDkR, 1.1, cx, WAIN / 2, cz2, ry);
        const rail = new THREE.Mesh(new THREE.BoxGeometry(len, 0.045, 0.03), mWood);
        rail.position.set(cx, WAIN, cz2); rail.rotation.y = ry; G.add(rail);
        const skirting = new THREE.Mesh(new THREE.BoxGeometry(len, 0.09, 0.02), mWoodDk);
        skirting.position.set(cx, 0.045, cz2); skirting.rotation.y = ry; G.add(skirting);
      };
      wallRun(W, 0, YSHOP.z0 + 0.001, 0);                          // the back wall, facing +z
      wallRun(D, YSHOP.x0 + 0.001, cz, Math.PI / 2);              // the left wall, facing +x
      wallRun(D, YSHOP.x1 - 0.001, cz, -Math.PI / 2);             // the right wall, facing −x
      // a cornice where the walls meet the ceiling
      for (const [len, x, z, ry] of [[W, 0, YSHOP.z0 + 0.03, 0], [D, YSHOP.x0 + 0.03, cz, Math.PI / 2], [D, YSHOP.x1 - 0.03, cz, Math.PI / 2]]) {
        const c = new THREE.Mesh(new THREE.BoxGeometry(len, 0.07, 0.06), mPlaster); c.position.set(x, H - 0.035, z); c.rotation.y = ry; G.add(c);
      }

      /* ---- the front: glass either side of the door on a tiled sill, a header, the door frame, the beads */
      const SILL = 0.78, GL = YDOOR.h;
      for (const [x0, x1] of [[YSHOP.x0, YDOOR.x0], [YDOOR.x1, YSHOP.x1]]) {
        const w = x1 - x0, cx = (x0 + x1) / 2;
        box(w, SILL, 0.2, cx, SILL / 2, 0.1, mWoodDk, G, false);
        box(w, 0.05, 0.26, cx, SILL + 0.025, 0.1, mWood, G, false);
        const g1 = new THREE.Mesh(new THREE.PlaneGeometry(w, GL - SILL), mGlassDirty); g1.position.set(cx, (SILL + GL) / 2, 0.1); g1.renderOrder = 2; G.add(g1);
        // aluminium mullions: either end and one in the middle
        for (const mx of [x0 + 0.02, cx, x1 - 0.02]) box(0.04, GL - SILL, 0.06, mx, (SILL + GL) / 2, 0.1, mAlu, G, false);
        box(w, 0.05, 0.08, cx, GL + 0.025, 0.1, mAlu, G, false);
        // old lace, half drawn, just inside the glass
        const lace = new THREE.Mesh(new THREE.PlaneGeometry(w * 0.62, (GL - SILL) * 0.72), mLace);
        lace.position.set(x0 < 0 ? x0 + w * 0.31 : x1 - w * 0.31, SILL + (GL - SILL) * 0.62, -0.04); G.add(lace);
        const rod = cyl(0.008, 0.008, w, cx, SILL + (GL - SILL) * 0.99, -0.04, mBrass, 6, G); rod.rotation.z = Math.PI / 2;
      }
      boxT(W, H - GL, 0.2, 0, (H + GL) / 2, 0.1, mPlasterR, 2.2);           // the header over door and glass
      // the painted words on the right-hand glass, read from the corridor (and backwards from inside)
      { const p = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 0.5), new THREE.MeshStandardMaterial({ map: tGlassWords, transparent: true, depthWrite: false, roughness: 0.5, side: THREE.DoubleSide }));
        mats.push(p.material); p.position.set((YDOOR.x1 + YSHOP.x1) / 2, 1.62, 0.205); G.add(p); }
      // the door frame, and the door itself folded back against the inside of the left glass
      box(0.07, GL, 0.24, YDOOR.x0 - 0.035, GL / 2, 0.1, mWoodDk, G, false);
      box(0.07, GL, 0.24, YDOOR.x1 + 0.035, GL / 2, 0.1, mWoodDk, G, false);
      box(YDOOR.x1 - YDOOR.x0 + 0.14, 0.08, 0.24, 0, GL + 0.04, 0.1, mWoodDk, G, false);
      { const leaf = new THREE.Group(); leaf.position.set(YDOOR.x0 - 0.02, 0, -0.02); leaf.rotation.y = Math.PI * 0.94; G.add(leaf);
        box(0.92, 0.06, 0.05, 0.46, 0.03, 0, mWoodDk, leaf, false); box(0.92, 0.06, 0.05, 0.46, GL - 0.06, 0, mWoodDk, leaf, false);
        box(0.06, GL - 0.06, 0.05, 0.03, GL / 2, 0, mWoodDk, leaf, false); box(0.06, GL - 0.06, 0.05, 0.89, GL / 2, 0, mWoodDk, leaf, false);
        const lg = new THREE.Mesh(new THREE.PlaneGeometry(0.8, GL - 0.12), mGlass); lg.position.set(0.46, GL / 2, 0); leaf.add(lg); }
      // the door's brass bell, inside, above the opening
      { const arm = box(0.02, 0.02, 0.16, 0.3, GL + 0.02, -0.12, mBrass, G, false);
        yLive.bell = cyl(0.0, 0.035, 0.05, 0.3, GL - 0.04, -0.19, mBrass, 10, G); }
      // the bead curtain in the doorway: strings of red and dark wood beads, swaying from the wall clock
      { const n = 15, bead = new THREE.SphereGeometry(0.011, 6, 4);
        const per = 34, total = n * per;
        const red = new THREE.InstancedMesh(bead, M({ color: 0x8a1c14, roughness: 0.35, metalness: 0.1 }), Math.ceil(total / 2));
        const dark = new THREE.InstancedMesh(bead, M({ color: 0x3b2414, roughness: 0.45 }), Math.ceil(total / 2));
        red.frustumCulled = dark.frustumCulled = false;
        G.add(red); G.add(dark);
        yLive.beads = { red, dark, n, per, x0: YDOOR.x0 + 0.04, x1: YDOOR.x1 - 0.04, top: GL - 0.02, step: 0.055, z: 0.12, t: 0, push: 0 };
        const rail = box(YDOOR.x1 - YDOOR.x0, 0.03, 0.03, 0, GL - 0.005, 0.12, mWoodDk, G, false); }

      /* ---- the LEFT wall: three tall cabinets of spirit amulets (the oil bottles in the middle one) */
      const CAB = { x0: YSHOP.x0, x1: YSHOP.x0 + 0.46, h: 2.12, base: 0.56 };
      const cabZ = [[-1.18, -2.38], [-2.48, -3.68], [-3.78, -4.98]];
      const SHELF = [0.62, 0.98, 1.34, 1.7, 2.04];
      const glows = [];
      cabZ.forEach(([za, zb], ci) => {
        const w = za - zb, cz2 = (za + zb) / 2, xd = CAB.x1 - CAB.x0, xc = (CAB.x0 + CAB.x1) / 2;
        solids.push(box(xd, CAB.base, w, xc, CAB.base / 2, cz2, mWood, G, false));          // the cupboard under it (solid)
        box(xd, 0.04, w, xc, CAB.h, cz2, mWoodDk, G, false);                                   // its top
        box(xd, 0.08, w + 0.04, xc, CAB.h + 0.06, cz2, mWood, G, false);                      // a cornice
        box(0.02, CAB.h - CAB.base, w, CAB.x0 + 0.01, (CAB.h + CAB.base) / 2, cz2, mRed, G, false);   // back: old red baize
        for (const zz of [za, zb]) box(xd, CAB.h, 0.04, xc, CAB.h / 2, zz, mWood, G, false);     // its sides
        for (const sy of SHELF.slice(1)) {
          const s = new THREE.Mesh(new THREE.BoxGeometry(xd - 0.03, 0.008, w - 0.06), mGlass); s.position.set(xc, sy, cz2); s.renderOrder = 2; G.add(s);
        }
        // the glass front in two doors, a brass lock between them
        const gf = new THREE.Mesh(new THREE.PlaneGeometry(w - 0.06, CAB.h - CAB.base - 0.04), mGlass);
        gf.rotation.y = Math.PI / 2; gf.position.set(CAB.x1 + 0.002, (CAB.h + CAB.base) / 2, cz2); gf.renderOrder = 2; G.add(gf);
        box(0.03, CAB.h - CAB.base, 0.03, CAB.x1, (CAB.h + CAB.base) / 2, cz2, mWood, G, false);
        box(0.02, 0.05, 0.02, CAB.x1 + 0.02, 1.25, cz2, mBrass, G, false);
        // the cupboard doors' panels and knobs
        for (const dz of [-w / 4, w / 4]) {
          box(0.012, CAB.base - 0.12, w / 2 - 0.08, CAB.x1 + 0.006, CAB.base / 2, cz2 + dz, mWoodDk, G, false);
          cyl(0.012, 0.012, 0.02, CAB.x1 + 0.016, CAB.base * 0.6, cz2 + dz * 0.25, mBrass, 8, G).rotation.z = Math.PI / 2;
        }
        // a dim warm strip under each cabinet's top (its own light, painted)
        const strip = box(0.02, 0.012, w - 0.1, CAB.x1 - 0.06, CAB.h - 0.03, cz2, new THREE.MeshBasicMaterial({ color: 0xffb070 }), G, false);
        mats.push(strip.material);
        glows.push(glowPlane(w * 1.2, 1.3, 0xff7a40, 0.10, CAB.x0 + 0.03, 1.5, cz2, 0, Math.PI / 2));
      });
      /* the cabinets' contents, instanced: bottles of oil with something inside, lockets, takrut on red cord, folded
         cloth yants, wrapped bundles, white candles */
      { const r = (() => { let s = 7; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; })();
        const mtx = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), sc = new THREE.Vector3(), p = new THREE.Vector3();
        const put = (list, x, y, z, ry = 0, s = 1, rx = 0, rz = 0) => list.push([x, y, z, ry, s, rx, rz]);
        const bottles = [], caps = [], cores = [], labels = [], lockets = [], takrut = [], cords = [], yants = [], bundles = [], candles = [], stands = [];
        cabZ.forEach(([za, zb], ci) => {
          const zc = (za + zb) / 2, w = za - zb;
          SHELF.slice(0, 4).forEach((sy, si) => {
            const y = sy + 0.006;
            if (ci === 1) {                                          // the oil bottles, two rows a shelf
              for (let k = 0; k < 9; k++) for (const row of [0, 1]) {
                const z = zb + 0.08 + k * (w - 0.16) / 8 + (row ? 0.05 : 0), x = CAB.x0 + 0.14 + row * 0.13 + (r() - 0.5) * 0.02;
                const s = 0.8 + r() * 0.5;
                put(bottles, x, y, z, r() * 6, s); put(caps, x, y + 0.072 * s, z, 0, s);
                put(cores, x, y + 0.028 * s, z, r() * 6, s * (0.7 + r() * 0.5), r() * 0.6, r() * 0.6);
                if (r() < 0.6) put(labels, x + 0.017 * s, y + 0.035 * s, z, Math.PI / 2, s);
              }
            } else if (ci === 0) {
              if (si === 0 || si === 2) {                            // cloth yants, folded, stacked
                for (let k = 0; k < 4; k++) { const z = zb + 0.15 + k * (w - 0.3) / 3; for (let h = 0; h < 3; h++) put(yants, CAB.x0 + 0.24, y + 0.006 + h * 0.012, z, (r() - 0.5) * 0.3, 1); }
              } else {                                               // takrut on red cord, laid in rows
                for (let k = 0; k < 10; k++) { const z = zb + 0.1 + k * (w - 0.2) / 9; put(takrut, CAB.x0 + 0.22, y + 0.008, z, Math.PI / 2 + (r() - 0.5) * 0.4, 0.8 + r() * 0.5); put(cords, CAB.x0 + 0.22, y + 0.003, z, r() * 6, 1); }
              }
            } else {
              if (si % 2 === 0) {                                    // lockets on little stands
                for (let k = 0; k < 6; k++) { const z = zb + 0.12 + k * (w - 0.24) / 5, x = CAB.x0 + 0.26; put(stands, x, y, z, 0, 1); put(lockets, x + 0.006, y + 0.05, z, Math.PI / 2, 0.9 + r() * 0.3, -0.25); }
              } else {                                               // wrapped bundles in red and saffron cloth
                for (let k = 0; k < 5; k++) { const z = zb + 0.14 + k * (w - 0.28) / 4; put(bundles, CAB.x0 + 0.22, y + 0.035, z, r() * 0.8, 0.8 + r() * 0.5); }
              }
            }
          });
          // two white candles on the top shelf of each cabinet, unlit
          for (const dz of [-0.3, 0.3]) put(candles, CAB.x0 + 0.24, SHELF[4] + 0.006, zc + dz, 0, 1);
        });
        const mk = (geo, mat, list, cast = false) => {
          if (!list.length) return null;
          const im = new THREE.InstancedMesh(geo, mat, list.length);
          list.forEach(([x, y, z, ry, s, rx, rz], i) => { e.set(rx || 0, ry, rz || 0); q.setFromEuler(e); sc.setScalar(s); p.set(x, y, z); mtx.compose(p, q, sc); im.setMatrixAt(i, mtx); });
          im.instanceMatrix.needsUpdate = true; im.castShadow = cast && !LOW; im.computeBoundingSphere(); G.add(im); return im;
        };
        const bottleGeo = new THREE.CylinderGeometry(0.016, 0.019, 0.07, 10); bottleGeo.translate(0, 0.035, 0);
        mk(bottleGeo, M({ color: 0xc9a060, roughness: 0.08, metalness: 0.1, transparent: true, opacity: 0.55, depthWrite: false }), bottles);
        const capGeo = new THREE.CylinderGeometry(0.008, 0.009, 0.016, 8); capGeo.translate(0, 0.008, 0);
        mk(capGeo, M({ color: 0x3a1410, roughness: 0.5 }), caps);
        const coreGeo = new THREE.IcosahedronGeometry(0.01, 0); coreGeo.scale(0.8, 1.4, 0.7);
        mk(coreGeo, M({ color: 0x2a140c, roughness: 0.9 }), cores);
        const labelGeo = new THREE.PlaneGeometry(0.022, 0.026);
        mk(labelGeo, M({ map: tLabel, roughness: 0.9 }), labels);
        const locketGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.006, 16); locketGeo.rotateX(Math.PI / 2);
        mk(locketGeo, mGilt, lockets);
        const standGeo = new THREE.BoxGeometry(0.03, 0.05, 0.04); standGeo.translate(0, 0.025, 0);
        mk(standGeo, mVelvet, stands);
        const takGeo = new THREE.CylinderGeometry(0.005, 0.005, 0.05, 8); takGeo.rotateZ(Math.PI / 2);
        mk(takGeo, M({ color: 0x8d7d5c, roughness: 0.35, metalness: 0.7 }), takrut);
        const cordGeo = new THREE.TorusGeometry(0.035, 0.0018, 4, 18); cordGeo.rotateX(Math.PI / 2);
        mk(cordGeo, M({ color: 0x9a1a14, roughness: 0.7 }), cords);
        const yantGeo = new THREE.BoxGeometry(0.12, 0.01, 0.16);
        mk(yantGeo, mYant, yants);
        const bundleGeo = new THREE.BoxGeometry(0.07, 0.06, 0.09);
        mk(bundleGeo, M({ color: 0x9a3a14, roughness: 0.85 }), bundles.filter((_, i) => i % 2 === 0));
        mk(bundleGeo, M({ color: 0xc8861c, roughness: 0.85 }), bundles.filter((_, i) => i % 2 === 1));
        const candleGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.14, 10); candleGeo.translate(0, 0.07, 0);
        mk(candleGeo, mWhiteWax, candles);
      }

      /* ---- the BACK: the spirit altar on red cloth, the covered mirror, the red bulb; the back room's curtain */
      { const A = YALT, top = A.h;
        solids.push(box(A.w, top, A.d, A.x, top / 2, A.z, mRed, G, false));
        // the cloth's front drape and its gold fringe
        const drape = new THREE.Mesh(new THREE.PlaneGeometry(A.w + 0.04, top - 0.04), mRed); drape.position.set(A.x, top / 2, A.z + A.d / 2 + 0.006); G.add(drape);
        box(A.w + 0.04, 0.03, 0.012, A.x, 0.02, A.z + A.d / 2 + 0.008, mGilt, G, false);
        // the upper tier against the wall
        const t2 = { w: 1.12, d: 0.3, y: top + 0.36 };
        box(t2.w, 0.36, t2.d, A.x, top + 0.18, YSHOP.z0 + t2.d / 2 + 0.01, mWood, G, false);
        box(t2.w + 0.06, 0.03, t2.d + 0.04, A.x, t2.y + 0.015, YSHOP.z0 + t2.d / 2 + 0.01, mRed, G, false);
        const ty = top + 0.005, uy = t2.y + 0.03;
        // red soda with straws: the drink one leaves for the young dead
        const sodaG = new THREE.CylinderGeometry(0.024, 0.026, 0.2, 12); sodaG.translate(0, 0.1, 0);
        const neckG = new THREE.CylinderGeometry(0.011, 0.02, 0.05, 10); neckG.translate(0, 0.225, 0);
        const strawG = new THREE.CylinderGeometry(0.003, 0.003, 0.2, 5); strawG.translate(0, 0.1, 0);
        const mSoda = M({ color: 0xb4121e, roughness: 0.1, metalness: 0.1, transparent: true, opacity: 0.86 });
        const mStraw = M({ color: 0xf2e6c8, roughness: 0.5 });
        [[-0.5, 0.12], [-0.36, 0.2], [0.42, 0.18], [0.55, 0.1], [-0.18, -0.02]].forEach(([dx, dz], i) => {
          const b = new THREE.Group(); b.position.set(A.x + dx, ty, A.z + dz); G.add(b);
          b.add(new THREE.Mesh(sodaG, mSoda)); b.add(new THREE.Mesh(neckG, mSoda));
          const st = new THREE.Mesh(strawG, mStraw); st.position.y = 0.17; st.rotation.z = 0.18 * (i % 2 ? 1 : -1); b.add(st);
        });
        // a bowl of rice, a cup of water, a small plate of sweets
        cyl(0.07, 0.045, 0.05, A.x + 0.05, ty + 0.025, A.z + 0.16, M({ color: 0xe8e2d6, roughness: 0.3 }), 16, G);
        const rice = new THREE.Mesh(new THREE.SphereGeometry(0.066, 14, 6, 0, Math.PI * 2, 0, Math.PI / 2), M({ color: 0xf4f0e4, roughness: 0.9 }));
        rice.position.set(A.x + 0.05, ty + 0.045, A.z + 0.16); rice.scale.y = 0.45; G.add(rice);
        cyl(0.03, 0.025, 0.06, A.x + 0.24, ty + 0.03, A.z + 0.22, mGlass, 12, G);
        cyl(0.08, 0.08, 0.012, A.x - 0.62, ty + 0.006, A.z + 0.2, M({ color: 0xd8c8a8, roughness: 0.4 }), 16, G);
        for (let k = 0; k < 5; k++) { const s = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.02, 0.03), M({ color: [0xe86a8a, 0x7ac84a, 0xf2d24a][k % 3], roughness: 0.6 })); s.position.set(A.x - 0.62 + (k - 2) * 0.03, ty + 0.022, A.z + 0.2 + (k % 2) * 0.02); G.add(s); }
        // a young woman's things: a small hand mirror, a comb, a lipstick, a bottle of perfume
        { const mir = new THREE.Group(); mir.position.set(A.x + 0.3, ty + 0.006, A.z - 0.02); mir.rotation.y = -0.4; G.add(mir);
          const fr = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.008, 18), M({ color: 0xd8a0a8, roughness: 0.4 })); fr.position.y = 0.004; mir.add(fr);
          const gl = new THREE.Mesh(new THREE.CircleGeometry(0.042, 18), M({ color: 0x8a96a0, roughness: 0.05, metalness: 0.9 })); gl.rotation.x = -Math.PI / 2; gl.position.y = 0.0085; mir.add(gl);
          const hd = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.008, 0.08), fr.material); hd.position.set(0, 0.004, 0.085); mir.add(hd); }
        box(0.11, 0.008, 0.035, A.x + 0.15, ty + 0.004, A.z - 0.12, M({ color: 0x2a1a12, roughness: 0.5 }), G, false);
        cyl(0.007, 0.007, 0.05, A.x + 0.02, ty + 0.025, A.z - 0.1, M({ color: 0xb01c2a, roughness: 0.3, metalness: 0.4 }), 8, G);
        cyl(0.018, 0.022, 0.06, A.x - 0.08, ty + 0.03, A.z - 0.14, M({ color: 0xe0b8c8, roughness: 0.1, transparent: true, opacity: 0.7 }), 10, G);
        // jasmine garlands: rings of white buds with a red tassel, over the tier and on the cloth
        { const budG = new THREE.SphereGeometry(0.009, 6, 4), mBud = M({ color: 0xf7f4ea, roughness: 0.7 });
          const rings = [[A.x - 0.28, uy, YSHOP.z0 + 0.16, 0.09], [A.x + 0.28, uy, YSHOP.z0 + 0.16, 0.09], [A.x + 0.62, ty, A.z - 0.05, 0.08]];
          const n = rings.length * 26;
          const im = new THREE.InstancedMesh(budG, mBud, n); let i = 0;
          const mtx = new THREE.Matrix4();
          for (const [x, y, z, R] of rings) for (let k = 0; k < 26; k++) { const a = k / 26 * Math.PI * 2; mtx.makeTranslation(x + Math.cos(a) * R, y + 0.01, z + Math.sin(a) * R * 0.55); im.setMatrixAt(i++, mtx); }
          im.instanceMatrix.needsUpdate = true; im.computeBoundingSphere(); G.add(im);
          for (const [x, y, z, R] of rings) { const tas = cyl(0.008, 0.016, 0.07, x, y + 0.035, z + R * 0.55 + 0.01, M({ color: 0xc8241c, roughness: 0.8 }), 6, G); } }
        // candles on the altar, lit
        for (const [dx, dz, h] of [[-0.66, -0.12, 0.16], [0.68, -0.14, 0.13], [-0.1, -0.24, 0.1]]) {
          const c = cyl(0.015, 0.016, h, A.x + dx, ty + h / 2, A.z + dz, mWhiteWax, 10, G);
          yLive.flames.push({ x: A.x + dx, y: ty + h + 0.025, z: A.z + dz, s: 0.05 });
        }
        // the incense pot and its sticks (their tips glow; the smoke rises from them)
        cyl(0.07, 0.055, 0.08, A.x - 0.36, uy + 0.04, YSHOP.z0 + 0.15, mBrass, 14, G);
        for (let k = 0; k < 5; k++) {
          const st = cyl(0.0018, 0.0018, 0.24, A.x - 0.36 + (k - 2) * 0.012, uy + 0.18, YSHOP.z0 + 0.15 + (k % 2) * 0.01, M({ color: 0x8a2a1c, roughness: 0.7 }), 4, G);
          st.rotation.z = (k - 2) * 0.04;
          const tip = new THREE.Mesh(new THREE.SphereGeometry(0.003, 4, 3), new THREE.MeshBasicMaterial({ color: 0xff5a20 })); mats.push(tip.material);
          tip.position.set(A.x - 0.36 + (k - 2) * 0.012 - Math.sin((k - 2) * 0.04) * 0.12, uy + 0.3, YSHOP.z0 + 0.15 + (k % 2) * 0.01); G.add(tip);
        }
        yLive.smokeAt = new THREE.Vector3(A.x - 0.36, uy + 0.31, YSHOP.z0 + 0.16);
        // the covered mirror on the wall above the tier (a mirror is covered for the dead), and a cloth yant beside it
        { const fr = box(0.42, 0.56, 0.03, A.x + 0.18, 1.86, YSHOP.z0 + 0.02, mWood, G, false);
          const cloth = new THREE.Mesh(new THREE.PlaneGeometry(0.46, 0.5), mRed); cloth.position.set(A.x + 0.18, 1.88, YSHOP.z0 + 0.04); G.add(cloth);
          const cl2 = new THREE.Mesh(new THREE.PlaneGeometry(0.46, 0.12), mRed); cl2.position.set(A.x + 0.18, 1.6, YSHOP.z0 + 0.05); cl2.rotation.x = -0.35; G.add(cl2); }
        { const y = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.56), mYant2); y.position.set(A.x - 0.42, 1.88, YSHOP.z0 + 0.012); G.add(y); }
        // the red bulb in its little cage on a bracket: the shop's own colour
        box(0.03, 0.03, 0.14, A.x - 0.12, 2.16, YSHOP.z0 + 0.07, mBrass, G, false);
        const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.045, 14, 10), new THREE.MeshBasicMaterial({ color: 0xff2a1a })); mats.push(bulb.material);
        bulb.position.set(A.x - 0.12, 2.08, YSHOP.z0 + 0.14); G.add(bulb); yLive.bulb = bulb;
        yLive.redGlow.push(glowPlane(2.6, 2.0, 0xff2a14, 0.55, A.x, 1.75, YSHOP.z0 + 0.02));          // on the back wall
        yLive.redGlow.push(glowPlane(3.6, 3.0, 0xff2414, 0.26, A.x, 0.012, A.z + 1.3, -Math.PI / 2));   // on the floor before it
        yLive.redGlow.push(glowPlane(0.7, 0.7, 0xff5030, 0.9, A.x - 0.12, 2.08, YSHOP.z0 + 0.18));      // the bulb's own halo
        // a woven mat before the altar
        const mat = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 0.7), M({ color: 0x8a6a3a, roughness: 0.95 })); mat.rotation.x = -Math.PI / 2; mat.position.set(A.x, 0.004, A.z + 0.85); G.add(mat);
      }
      // the back room: a dark doorway in the back-left corner, an old floral curtain that moves on a draught
      { const dx0 = YSHOP.x0 + 0.25, dx1 = dx0 + 0.86, dh = 2.05;
        box(0.06, dh, 0.1, dx0 - 0.03, dh / 2, YSHOP.z0 + 0.02, mWoodDk, G, false);
        box(0.06, dh, 0.1, dx1 + 0.03, dh / 2, YSHOP.z0 + 0.02, mWoodDk, G, false);
        box(dx1 - dx0 + 0.12, 0.08, 0.1, (dx0 + dx1) / 2, dh + 0.04, YSHOP.z0 + 0.02, mWoodDk, G, false);
        const dark = new THREE.Mesh(new THREE.PlaneGeometry(dx1 - dx0, dh), mBlack); dark.position.set((dx0 + dx1) / 2, dh / 2, YSHOP.z0 + 0.004); G.add(dark);
        const cg = new THREE.PlaneGeometry(dx1 - dx0 + 0.04, dh - 0.06, 10, 16);
        const cur = new THREE.Mesh(cg, mCurtain); cur.position.set((dx0 + dx1) / 2, (dh - 0.06) / 2 + 0.03, YSHOP.z0 + 0.07); G.add(cur);
        yLive.curtain = { mesh: cur, base: Float32Array.from(cg.attributes.position.array), w: dx1 - dx0 + 0.04, h: dh - 0.06, gust: 0 };
        const rod = cyl(0.01, 0.01, dx1 - dx0 + 0.2, (dx0 + dx1) / 2, dh - 0.02, YSHOP.z0 + 0.07, mBrass, 6, G); rod.rotation.z = Math.PI / 2;
      }

      /* ---- the RIGHT wall, back half: the faces of the departed, and hers with fresh white flowers under it */
      const PX = YSHOP.x1 - 0.012;
      const frameOn = (w, h, z, y, mFrame, depth = 0.03) => {
        const g = new THREE.Group(); g.position.set(PX - depth / 2, y, z); g.rotation.y = -Math.PI / 2; G.add(g);
        const fw = Math.min(w, h) * 0.12;
        box(w + fw * 2, fw, depth, 0, h / 2 + fw / 2, 0, mFrame, g, false);
        box(w + fw * 2, fw, depth, 0, -h / 2 - fw / 2, 0, mFrame, g, false);
        box(fw, h, depth, -w / 2 - fw / 2, 0, 0, mFrame, g, false);
        box(fw, h, depth, w / 2 + fw / 2, 0, 0, mFrame, g, false);
        box(w, h, 0.004, 0, 0, -depth / 2 + 0.002, mBlack, g, false);
        return g;
      };
      const photoMat = new THREE.MeshStandardMaterial({ color: 0xd8ccb4, roughness: 0.7, visible: false }); mats.push(photoMat);
      const girlMat = new THREE.MeshStandardMaterial({ color: 0xe0d4bc, roughness: 0.6, visible: false }); mats.push(girlMat);
      yLive.girlMat = girlMat;
      // the photographs: 24 faces in one sheet, 4 x 6 cells of 256 x 192 px; each frame shows the middle of one
      const cell = (geo, ci, ri) => {
        const uv = geo.attributes.uv, x0 = ci * 256 + 62, x1 = ci * 256 + 194, y0 = ri * 192 + 8, y1 = ri * 192 + 186;
        for (let i = 0; i < uv.count; i++) uv.setXY(i, (x0 + uv.getX(i) * (x1 - x0)) / 1024, (y1 - uv.getY(i) * (y1 - y0)) / 1152);
      };
      const PORTRAITS = [
        // [z, y, w, h, cell, frame]
        [-4.42, 2.18, 0.17, 0.23, 0, 0], [-4.75, 1.86, 0.2, 0.27, 5, 1], [-4.45, 1.5, 0.16, 0.21, 9, 0], [-4.78, 1.16, 0.18, 0.24, 14, 0],
        [-5.12, 2.24, 0.15, 0.2, 2, 1], [-5.18, 1.18, 0.16, 0.21, 19, 1], [-6.72, 2.22, 0.19, 0.25, 7, 0], [-6.38, 1.18, 0.17, 0.22, 12, 1],
        [-6.75, 1.86, 0.15, 0.2, 21, 0], [-7.05, 1.5, 0.21, 0.28, 3, 1], [-7.38, 2.12, 0.16, 0.21, 16, 0], [-7.36, 1.16, 0.17, 0.23, 10, 0],
        [-5.55, 2.26, 0.14, 0.19, 23, 0], [-6.32, 2.26, 0.14, 0.19, 6, 1], [-5.12, 1.62, 0.17, 0.22, 17, 0], [-6.75, 1.5, 0.16, 0.21, 20, 1]
      ];
      const mFrames = [M({ map: tWood, color: 0x3a2214, roughness: 0.5 }), mGilt];
      for (const [z, y, w, h, ci, fi] of PORTRAITS) {
        const g = frameOn(w, h, z, y, mFrames[fi]);
        const geo = new THREE.PlaneGeometry(w, h); cell(geo, ci % 4, Math.floor(ci / 4));
        const ph = new THREE.Mesh(geo, photoMat); ph.position.z = 0.004; g.add(ph);
        g.rotation.z = (((ci * 37) % 7) - 3) * 0.006;        // hung by hand: none quite level
      }
      // hers, larger, in a gilt frame, and under it a small ledge with fresh white flowers, a cup, a burnt-down candle
      { const g = frameOn(0.3, 0.34, YGIRL.z, YGIRL.y, mGilt, 0.035);
        const ph = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 0.34), girlMat);
        const uv = ph.geometry.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setY(i, 1 - uv.getY(i));
        ph.position.z = 0.006; g.add(ph);
        const ly = YGIRL.y - 0.31;
        box(0.12, 0.025, 0.46, YSHOP.x1 - 0.06, ly, YGIRL.z, mWood, G, false);
        box(0.02, 0.07, 0.02, YSHOP.x1 - 0.02, ly - 0.045, YGIRL.z - 0.18, mWood, G, false);
        box(0.02, 0.07, 0.02, YSHOP.x1 - 0.02, ly - 0.045, YGIRL.z + 0.18, mWood, G, false);
        // the vase and its white flowers
        cyl(0.03, 0.024, 0.13, YSHOP.x1 - 0.07, ly + 0.078, YGIRL.z - 0.1, M({ color: 0x5f7a86, roughness: 0.1, metalness: 0.1, transparent: true, opacity: 0.6 }), 12, G);
        const stemM = M({ color: 0x3e6a2a, roughness: 0.8 }), petal = M({ color: 0xfbf8f0, roughness: 0.65 }), core = M({ color: 0xe8d070, roughness: 0.6 });
        for (let k = 0; k < 7; k++) {
          const a = k / 7 * Math.PI * 2, rr = 0.035 + (k % 2) * 0.025;
          const fx = YSHOP.x1 - 0.07 + Math.cos(a) * rr * 0.6, fz = YGIRL.z - 0.1 + Math.sin(a) * rr, fy = ly + 0.2 + (k % 3) * 0.03;
          const st = cyl(0.002, 0.002, 0.12, fx, fy - 0.06, fz, stemM, 4, G); st.rotation.z = Math.cos(a) * 0.2; st.rotation.x = Math.sin(a) * 0.2;
          const head = new THREE.Mesh(new THREE.SphereGeometry(0.022, 10, 6), petal); head.scale.y = 0.55; head.position.set(fx, fy, fz); G.add(head);
          const cc = new THREE.Mesh(new THREE.SphereGeometry(0.007, 6, 4), core); cc.position.set(fx - 0.004, fy + 0.008, fz); G.add(cc);
        }
        cyl(0.022, 0.018, 0.05, YSHOP.x1 - 0.07, ly + 0.038, YGIRL.z + 0.06, mGlass, 10, G);
        const cnd = cyl(0.012, 0.012, 0.035, YSHOP.x1 - 0.07, ly + 0.03, YGIRL.z + 0.15, mWhiteWax, 10, G);
        yLive.flames.push({ x: YSHOP.x1 - 0.07, y: ly + 0.062, z: YGIRL.z + 0.15, s: 0.035 });
        yLive.girlFlower = glowPlane(0.8, 0.8, 0xffc890, 0.10, YSHOP.x1 - 0.015, ly + 0.25, YGIRL.z, 0, -Math.PI / 2);
      }
      // the photographs arrive when their bytes do (a failed download costs the faces, never the room)
      loadImageTexture('yinwall', 'image/jpeg').then(t => { if (!alive || !t) return; madeTex.push(t); photoMat.map = t; photoMat.color.set(0xffffff); photoMat.visible = true; photoMat.needsUpdate = true; }).catch(() => {});
      loadImageTexture('yingirl', 'image/jpeg').then(t => {
        if (!alive || !t) return; madeTex.push(t); yLive.girlTex = t;
        girlMat.map = t; girlMat.color.set(0xffffff); girlMat.visible = true; girlMat.needsUpdate = true;
        if (yLive.locketFace) { yLive.locketFace.material.map = t; yLive.locketFace.material.visible = true; yLive.locketFace.material.needsUpdate = true; }
      }).catch(() => {});

      /* ---- the keeper's corner: the counter, the shelves behind it, the stock in front of it */
      { const C = YCNT, cw = C.x1 - C.x0, cd = C.zf - C.zb, ccx = (C.x0 + C.x1) / 2, ccz = (C.zf + C.zb) / 2;
        solids.push(box(cw, 0.74, cd, ccx, 0.37, ccz, mWood, G, false));
        box(cw + 0.04, 0.03, cd + 0.04, ccx, 0.755, ccz, mWoodDk, G, false);
        // a glass showcase on top: velvet inside, a few old pieces and cards
        const gs = new THREE.Mesh(new THREE.BoxGeometry(cw - 0.04, 0.17, cd - 0.06), mGlass); gs.position.set(ccx, 0.86, ccz); gs.renderOrder = 2; G.add(gs);
        box(cw - 0.06, 0.006, cd - 0.08, ccx, 0.776, ccz, mVelvet, G, false);
        box(cw + 0.04, 0.025, cd + 0.04, ccx, C.top - 0.0125, ccz, mWoodDk, G, false);
        for (let k = 0; k < 7; k++) { const p = cyl(0.016, 0.016, 0.005, ccx + ((k * 0.37) % 0.3 - 0.15), 0.782, C.zf - 0.25 - k * 0.27, mGilt, 12, G); }
        // its front panels
        for (let k = 0; k < 3; k++) box(0.012, 0.56, cd / 3 - 0.06, C.x0 - 0.006, 0.36, C.zf - cd / 6 - k * cd / 3, mWoodDk, G, false);
        // on top: the velvet box (shut until she opens it), a brass bell, a paper fan, a ledger
        const vb = new THREE.Group(); vb.position.set(YBOX.x, C.top, YBOX.z); G.add(vb);
        box(0.16, 0.05, 0.12, 0, 0.025, 0, mVelvet, vb, false);
        const lid = new THREE.Group(); lid.position.set(0.08, 0.05, 0); vb.add(lid);          // hinged at its +x edge (her side)
        box(0.16, 0.035, 0.12, -0.08, 0.0175, 0, mVelvet, lid, false);
        box(0.13, 0.004, 0.095, 0, 0.051, 0, mSatin, vb, false);
        yLive.box = { group: vb, lid, open: 0 };
        // the locket inside: a round gold locket on a fine chain, her photograph under its glass
        const lk = new THREE.Group(); lk.position.set(0, 0.058, 0); vb.add(lk);
        const rim = new THREE.Mesh(new THREE.TorusGeometry(0.021, 0.0035, 6, 24), mGilt); rim.rotation.x = -Math.PI / 2; lk.add(rim);
        const back = new THREE.Mesh(new THREE.CylinderGeometry(0.021, 0.021, 0.004, 24), mGilt); lk.add(back);
        const faceMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4, visible: false }); mats.push(faceMat);
        const fgeo = new THREE.CircleGeometry(0.018, 24), fuv = fgeo.attributes.uv;
        for (let i = 0; i < fuv.count; i++) fuv.setXY(i, 0.28 + fuv.getX(i) * 0.44, 1 - (0.08 + (1 - fuv.getY(i)) * 0.4));
        const face = new THREE.Mesh(fgeo, faceMat); face.rotation.x = -Math.PI / 2; face.position.y = 0.0025; lk.add(face);
        yLive.locketFace = face;
        const lens = new THREE.Mesh(new THREE.CircleGeometry(0.018, 24), mGlass); lens.rotation.x = -Math.PI / 2; lens.position.y = 0.0035; lk.add(lens);
        const bail = new THREE.Mesh(new THREE.TorusGeometry(0.004, 0.0012, 4, 10), mGilt); bail.position.set(0, 0, -0.025); bail.rotation.y = Math.PI / 2; lk.add(bail);
        const chainG = new THREE.TorusGeometry(0.003, 0.0008, 3, 6), mChain = mGilt;
        for (let k = 0; k < 14; k++) { const ln = new THREE.Mesh(chainG, mChain); const a = k / 14 * Math.PI * 1.6 + 2.0; ln.position.set(Math.cos(a) * 0.045, 0, -0.03 + Math.sin(a) * 0.03); ln.rotation.y = a; lk.add(ln); }
        yLive.locket = lk;
        // the brass bell, the fan, the ledger
        cyl(0.03, 0.035, 0.035, C.x0 + 0.2, C.top + 0.0175, C.zf - 0.2, mBrass, 14, G);
        { const fan = new THREE.Mesh(new THREE.CircleGeometry(0.14, 16, 0, Math.PI), M({ map: tYant, color: 0xe8d8b8, roughness: 0.9, side: THREE.DoubleSide }));
          fan.rotation.x = -Math.PI / 2; fan.position.set(C.x1 - 0.2, C.top + 0.004, C.zb + 0.35); fan.rotation.z = 0.6; G.add(fan); }
        box(0.2, 0.025, 0.28, C.x1 - 0.18, C.top + 0.0125, C.zb + 0.75, M({ color: 0x5a1c14, roughness: 0.8 }), G, false);
        // the wall behind her: a shelf, the cassette radio playing its song, a thermos, a calendar
        const sy = 1.48;
        box(0.24, 0.025, 2.1, YSHOP.x1 - 0.12, sy, -2.6, mWood, G, false);
        for (const zz of [-1.7, -3.5]) box(0.03, 0.12, 0.03, YSHOP.x1 - 0.02, sy - 0.07, zz, mWood, G, false);
        const radio = new THREE.Group(); radio.position.set(YSHOP.x1 - 0.12, sy + 0.0125, -2.2); radio.rotation.y = -Math.PI / 2; G.add(radio);
        { const body = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.17, 0.1), [mAlu, mAlu, mAlu, mAlu, M({ map: tRadio, roughness: 0.5, metalness: 0.4 }), mAlu]);
          body.position.y = 0.085; radio.add(body);
          const handle = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.008, 6, 18, Math.PI), mBlack); handle.position.y = 0.17; radio.add(handle);
          const ant = cyl(0.002, 0.002, 0.34, 0.15, 0.32, 0, mAlu, 4, radio); ant.rotation.z = -0.5; }
        yLive.radioAt = new THREE.Vector3(YSHOP.x1 - 0.12, sy + 0.1, -2.2);
        cyl(0.04, 0.04, 0.26, YSHOP.x1 - 0.12, sy + 0.14, -3.1, M({ color: 0xb02020, roughness: 0.4, metalness: 0.3 }), 14, G);
        cyl(0.05, 0.05, 0.1, YSHOP.x1 - 0.12, sy + 0.06, -2.85, mBrass, 14, G);
        { const cal = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 0.45), M({ map: tCal, roughness: 0.9 })); cal.position.set(YSHOP.x1 - 0.006, 2.0, -2.9); cal.rotation.y = -Math.PI / 2; G.add(cal); }
        // the stock in front of her corner: an open shelf unit facing the shop — cartons, stacks of yellow paper
        // offerings, joss in bundles, red candles in packets (a hidden blocker keeps its footprint solid)
        { const hb = hidBox(0.8, 1.86, 1.05, 2.0, 0.93, -0.83, G); solids.push(hb);
          const SX0 = 1.62, SX1 = 2.38, SZ0 = -1.35, SZ1 = -0.31, SH = 1.86, sxc = (SX0 + SX1) / 2;
          box(SX1 - SX0, SH, 0.03, sxc, SH / 2, SZ0 + 0.015, mWoodDk, G, false);              // its two sides
          box(SX1 - SX0, SH, 0.03, sxc, SH / 2, SZ1 - 0.015, mWoodDk, G, false);
          box(0.02, SH, SZ1 - SZ0, SX1 - 0.01, SH / 2, (SZ0 + SZ1) / 2, mWoodDk, G, false);   // its back, on the wall
          box(SX1 - SX0 + 0.02, 0.04, SZ1 - SZ0 + 0.02, sxc, SH + 0.02, (SZ0 + SZ1) / 2, mWood, G, false);
          const cartons = M({ color: 0x8a6c48, roughness: 0.92 }), yellow = M({ color: 0xd2ac34, roughness: 0.85 }),
                pink = M({ color: 0xc8607a, roughness: 0.8 }), redP = M({ color: 0xa8201a, roughness: 0.6 }), joss = M({ color: 0x8a3a1c, roughness: 0.8 });
          const rs = yRng(211);
          for (let k = 0; k < 5; k++) {
            const sy = 0.06 + k * 0.42;
            box(SX1 - SX0 - 0.03, 0.02, SZ1 - SZ0 - 0.06, sxc, sy, (SZ0 + SZ1) / 2, mWood, G, false);
            if (k === 4) break;
            let z = SZ0 + 0.06;
            while (z < SZ1 - 0.12) {
              const kind = (rs() * 5) | 0, w = 0.12 + rs() * 0.16;
              if (z + w > SZ1 - 0.05) break;
              const zc = z + w / 2, xd = SX0 + 0.06 + rs() * 0.06;
              if (kind === 0) box(0.34, 0.2 + rs() * 0.1, w, xd + 0.17, sy + 0.12, zc, cartons, G, false);
              else if (kind === 1) for (let q = 0; q < 5; q++) box(0.24, 0.02, w * 0.9, xd + 0.14, sy + 0.02 + q * 0.021, zc, q % 2 ? yellow : M({ color: 0xe0c050, roughness: 0.85 }), G, false);
              else if (kind === 2) for (let q = 0; q < 3; q++) { const c = cyl(0.025, 0.025, 0.3, xd + 0.06 + q * 0.05, sy + 0.16, zc, joss, 8, G); }
              else if (kind === 3) box(0.2, 0.1, w, xd + 0.12, sy + 0.06, zc, redP, G, false);
              else box(0.22, 0.16, w, xd + 0.13, sy + 0.09, zc, pink, G, false);
              z += w + 0.02;
            }
          }
        }
        // and behind her, at the end of the counter, a low cabinet with a dead lamp on it (closes her corner)
        solids.push(box(0.8, 0.86, 0.32, 2.0, 0.43, -4.02, mWood, G, false));
        cyl(0.06, 0.08, 0.04, 2.1, 0.88, -4.02, mBrass, 12, G);
        cyl(0.01, 0.01, 0.3, 2.1, 1.05, -4.02, mBrass, 6, G);
        cyl(0.08, 0.14, 0.14, 2.1, 1.22, -4.02, M({ color: 0x7a2a1c, roughness: 0.7, side: THREE.DoubleSide }), 14, G);
      }

      /* ---- the ceiling's one fitting: two tubes, one dead, one that flickers; the pool it paints on the floor */
      { const fz = -3.6, fy = H - 0.05;
        box(0.26, 0.06, 1.3, 0, fy, fz, M({ color: 0xd8d6d0, roughness: 0.5 }), G, false);
        const tubeOn = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 1.2, 10), new THREE.MeshBasicMaterial({ color: 0xe8f2ff })); mats.push(tubeOn.material);
        tubeOn.rotation.x = Math.PI / 2; tubeOn.position.set(-0.06, fy - 0.04, fz); G.add(tubeOn);
        const tubeOff = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 1.2, 10), M({ color: 0x8a8a84, roughness: 0.3 }));
        tubeOff.rotation.x = Math.PI / 2; tubeOff.position.set(0.06, fy - 0.04, fz); G.add(tubeOff);
        yLive.tube = tubeOn;
        yLive.tubeGlow.push(glowPlane(3.2, 4.2, 0xbcd6ff, 0.16, 0, 0.013, fz, -Math.PI / 2));
        yLive.tubeGlow.push(glowPlane(1.0, 2.2, 0xd8e8ff, 0.32, 0, H - 0.008, fz, Math.PI / 2));
      }
      // an old ceiling fan over the back of the shop, turning slowly; the cold (CP5) slows it to a stop
      { const fan = new THREE.Group(); fan.position.set(0.2, H, -5.7); G.add(fan);
        cyl(0.012, 0.012, 0.32, 0, -0.16, 0, mBrass, 8, fan);
        cyl(0.09, 0.07, 0.1, 0, -0.36, 0, M({ color: 0x5a4a3a, roughness: 0.4, metalness: 0.5 }), 16, fan);
        const rot = new THREE.Group(); rot.position.y = -0.42; fan.add(rot);
        const blade = M({ map: tWood, color: 0x6a4630, roughness: 0.5 });
        for (let k = 0; k < 3; k++) { const b = box(0.56, 0.008, 0.11, 0.33, 0, 0, blade, rot, false); const a = new THREE.Group(); a.rotation.y = k / 3 * Math.PI * 2; a.add(b); rot.add(a);
          box(0.06, 0.012, 0.03, 0.08, 0.004, 0, mBrass, a, false); }
        yLive.fan = { rot, speed: 1.35, k: 1 }; }
      // a string of small cloth yants hung across the shop near the altar, sagging, stirring on the draught
      { const z = -6.9, n = 9, y0 = 2.44, sag = 0.18, x0 = YSHOP.x0 + 0.08, x1 = YSHOP.x1 - 0.08;
        const pts = []; for (let i = 0; i <= 24; i++) { const u = i / 24, xx = x0 + (x1 - x0) * u; pts.push(new THREE.Vector3(xx, y0 - sag * 4 * u * (1 - u), z)); }
        const cord = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 24, 0.003, 4, false), M({ color: 0x9a1a14, roughness: 0.7 })); G.add(cord);
        const flagGeo = new THREE.PlaneGeometry(0.13, 0.17); flagGeo.translate(0, -0.085, 0);
        const mF1 = M({ map: tYant, roughness: 0.9, side: THREE.DoubleSide }), mF2 = M({ map: tYant2, roughness: 0.9, side: THREE.DoubleSide });
        yLive.flags = [];
        for (let i = 0; i < n; i++) { const u = (i + 0.5) / n, xx = x0 + (x1 - x0) * u;
          const f = new THREE.Mesh(flagGeo, i % 2 ? mF2 : mF1); f.position.set(xx, y0 - sag * 4 * u * (1 - u) - 0.004, z); G.add(f); yLive.flags.push({ f, seed: i * 1.37 }); } }
      // the candles' flames: billboards, each with a small warm pool on whatever is under it
      const fMat = new THREE.SpriteMaterial({ map: tFlame, color: 0xffd8a0, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false });
      mats.push(fMat);
      for (const f of yLive.flames) {
        const sp = new THREE.Sprite(fMat); sp.position.set(f.x, f.y, f.z); sp.scale.set(f.s * 0.5, f.s, 1); G.add(sp); f.sprite = sp;
        f.pool = glowPlane(f.s * 6, f.s * 6, 0xffa050, 0.28, f.x, f.y - 0.01, f.z); f.pool.material = f.pool.material.clone(); mats.push(f.pool.material);
        f.seed = f.x * 13.7 + f.z * 7.1;
      }
      // dust in the red air
      { const n = LOW ? 70 : 140, pos = new Float32Array(n * 3);
        for (let i = 0; i < n; i++) { pos[i * 3] = YSHOP.x0 + 0.2 + ((i * 0.6180339) % 1) * (W - 0.4); pos[i * 3 + 1] = 0.3 + ((i * 0.381966) % 1) * 2.1; pos[i * 3 + 2] = YSHOP.z0 + 0.3 + ((i * 0.7548776) % 1) * (D - 0.6); }
        const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        const pm = new THREE.PointsMaterial({ color: 0xffb8a0, size: 0.012, transparent: true, opacity: 0.55, depthWrite: false, blending: THREE.AdditiveBlending, map: tGlow, fog: false });
        mats.push(pm);
        const pts = new THREE.Points(geo, pm); pts.frustumCulled = false; G.add(pts);
        yLive.motes = { pts, base: Float32Array.from(pos), n };
      }
      // incense smoke: a few soft puffs climbing from the sticks, recycled
      { const sm = new THREE.SpriteMaterial({ map: tSmoke, color: 0xd8c8c0, transparent: true, opacity: 0.0, depthWrite: false, fog: false });
        mats.push(sm);
        for (let k = 0; k < 6; k++) { const m = sm.clone(); mats.push(m); const sp = new THREE.Sprite(m); sp.position.copy(yLive.smokeAt); G.add(sp); yLive.smoke.push({ sp, t: k / 6, k: k * 1.7 }); } }

      /* ---- the CORRIDOR: terrazzo, a ceiling of dead fittings, the shutters, the railing over the void */
      { const X0 = YMALL.x0, X1 = YMALL.x1, CW = X1 - X0, ccx = (X0 + X1) / 2, CH = YMALL.H;
        floorAt(CW, YMALL.z1 - YMALL.z0, ccx, (YMALL.z0 + YMALL.z1) / 2, mTerr, G);
        const ceil = ceilAt(CW, YMALL.z1 - YMALL.z0, ccx, CH, (YMALL.z0 + YMALL.z1) / 2, mCeilC, G);
        // the ends of the corridor (blockers, and seen)
        walls.push(box(0.2, CH, 5.2, X0 - 0.1, CH / 2, 2.5, mPillar, G, false));
        walls.push(box(0.2, CH, 5.2, X1 + 0.1, CH / 2, 2.5, mPillar, G, false));
        // the shopfronts along z 0, either side of hers: shutters down, one half up on a dark unit, one TO LET
        const units = [[X0, -18.6, 'shut'], [-18.6, -13.2, 'glass'], [-13.2, -7.8, 'half'], [-7.8, -2.65, 'shut'], [2.65, X1, 'shut']];
        units.forEach(([a, b, kind], ui) => {
          const w = b - a, cx = (a + b) / 2;
          walls.push(hidBox(w, CH, 0.2, cx, CH / 2, -0.1, G));
          const fasc = new THREE.Mesh(new THREE.PlaneGeometry(w - 0.1, 0.5), M({ map: tSigns, roughness: 0.8 }));
          { const uv = fasc.geometry.attributes.uv; const row = ui % 4; for (let i = 0; i < uv.count; i++) uv.setY(i, (row + uv.getY(i)) / 4); }
          fasc.position.set(cx, 2.86, 0.02); G.add(fasc);
          if (kind === 'shut') {
            tiled(w - 0.1, 2.6, mShutter, 2.6, cx, 1.3, 0.01);
            box(w - 0.1, 0.06, 0.06, cx, 0.03, 0.03, mSteel, G, false);
          } else if (kind === 'half') {
            tiled(w - 0.1, 1.5, mShutter, 2.6, cx, 1.85, 0.01);
            box(w - 0.1, 0.06, 0.06, cx, 1.1, 0.03, mSteel, G, false);
            const dk = new THREE.Mesh(new THREE.PlaneGeometry(w - 0.1, 1.1), mDarkUnit); dk.position.set(cx, 0.55, -0.4); G.add(dk);
            floorAt(w - 0.1, 0.4, cx, -0.2, mDarkUnit, G);
          } else {
            const dk = new THREE.Mesh(new THREE.PlaneGeometry(w - 0.1, 2.6), mDarkUnit); dk.position.set(cx, 1.3, -0.6); G.add(dk);
            const gl = new THREE.Mesh(new THREE.PlaneGeometry(w - 0.1, 2.5), mGlassDirty); gl.position.set(cx, 1.3, 0.0); gl.renderOrder = 2; G.add(gl);
            for (const px of [cx - w * 0.25, cx + w * 0.22]) { const p = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.56), M({ map: tToLet, roughness: 0.9 })); p.position.set(px, 1.45, 0.012); G.add(p); }
          }
        });
        // pillars between the units, tiled; and either side of her door
        const mPillarT = matRep(mPillar, repeatTex(tPlaster, 1, 1)); mPillarT.color.set(0xb4ada2);
        for (const px of [-18.6, -13.2, -7.8, -2.65, 2.65]) boxT(0.5, CH, 0.5, px, CH / 2, 0.25, mPillarT, 1.6);
        // her own fascia: an old red board, gold border, no name left on it
        { const sign = new THREE.Mesh(new THREE.PlaneGeometry(4.9, 0.52), M({ color: 0x5a1612, roughness: 0.7, emissive: 0x1a0402, emissiveIntensity: 1 }));
          sign.position.set(0, 2.88, 0.205); G.add(sign);
          box(4.95, 0.03, 0.03, 0, 3.15, 0.21, mGilt, G, false); box(4.95, 0.03, 0.03, 0, 2.61, 0.21, mGilt, G, false); }
        // the tube fittings along the corridor: all dead but one far down, and the one outside her door, dim
        for (let x = X0 + 2; x < X1 - 1; x += 4) {
          box(0.24, 0.05, 1.22, x, CH - 0.03, 2.4, M({ color: 0xbfbcb4, roughness: 0.5 }), G, false);
        }
        { const t = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 1.15, 8), new THREE.MeshBasicMaterial({ color: 0xcfe0ff })); mats.push(t.material);
          t.rotation.x = Math.PI / 2; t.position.set(-10, CH - 0.07, 2.4); G.add(t); yLive.farTube = t;
          yLive.farPool = glowPlane(3.0, 4.0, 0xb8ccff, 0.10, -10, 0.012, 2.4, -Math.PI / 2); }
        // the railing over the void: a steel handrail, balusters, glass panels; a gap where the escalator lands,
        // taped off with a barrier
        const RZ = YMALL.z1, GAP0 = -14.2, GAP1 = -12.4;
        for (const [a, b] of [[X0, GAP0], [GAP1, X1]]) {
          const w = b - a, cx = (a + b) / 2;
          walls.push(box(w, 1.05, 0.06, cx, 0.525, RZ, mGlassDirty, G, false));
          box(w, 0.05, 0.08, cx, 1.07, RZ, mSteel, G, false);
          box(w, 0.06, 0.1, cx, 0.03, RZ, mSteel, G, false);
          for (let x = a + 0.05; x < b; x += 1.2) box(0.04, 1.05, 0.04, x, 0.525, RZ, mSteel, G, false);
        }
        // the barrier across the escalator's landing (a blocker: nobody rides it today)
        walls.push(hidBox(GAP1 - GAP0, 1.4, 0.3, (GAP0 + GAP1) / 2, 0.7, RZ));
        for (const bx of [GAP0 + 0.25, GAP1 - 0.25]) { box(0.05, 0.95, 0.05, bx, 0.475, RZ + 0.05, mHazard, G, false); }
        box(GAP1 - GAP0 - 0.3, 0.12, 0.03, (GAP0 + GAP1) / 2, 0.82, RZ + 0.06, mHazard, G, false);
        box(GAP1 - GAP0 - 0.3, 0.12, 0.03, (GAP0 + GAP1) / 2, 0.42, RZ + 0.06, mHazard, G, false);
        // the corridor slab's edge, the void, the floor below with a few lit units, the far side, the skylight
        box(CW, 0.42, 0.25, ccx, -0.21, RZ + 0.12, mSlab, G, false);
        const vz = (YVOID.z0 + YVOID.z1) / 2, vd = YVOID.z1 - YVOID.z0;
        floorAt(CW, vd + 2, ccx, vz, mTerr, G).position.y = YVOID.floor;
        { const lowFront = new THREE.Mesh(new THREE.PlaneGeometry(CW, 4.2), mDarkUnit); lowFront.position.set(ccx, YVOID.floor + 2.1, RZ + 0.3); G.add(lowFront);
          for (const lx of [-17, -6, 1.5]) glowPlane(3.2, 2.2, 0xffd8a0, 0.14, lx, YVOID.floor + 1.3, RZ + 0.32); }
        // the far walkway (z 11 → 14): its slab, railing, floor, shutters, ceiling
        box(CW, 0.42, 0.25, ccx, -0.21, YVOID.z1 - 0.12, mSlab, G, false);
        floorAt(CW, 3, ccx, YVOID.z1 + 1.5, mTerr, G);
        box(CW, 0.05, 0.08, ccx, 1.07, YVOID.z1, mSteel, G, false);
        { const gl = new THREE.Mesh(new THREE.PlaneGeometry(CW, 1.05), mGlassDirty); gl.position.set(ccx, 0.525, YVOID.z1); gl.renderOrder = 2; G.add(gl); }
        tiled(CW, 2.6, mShutter, 2.6, ccx, 1.3, YVOID.z1 + 3, Math.PI);
        { const fs = new THREE.Mesh(new THREE.PlaneGeometry(CW, 0.5), M({ map: tSigns, roughness: 0.8 })); fs.rotation.y = Math.PI; fs.position.set(ccx, 2.86, YVOID.z1 + 2.98); G.add(fs); }
        ceilAt(CW, 3, ccx, CH, YVOID.z1 + 1.5, mCeilC, G);
        // bulkheads up to the skylight on both sides of the void, and the skylight: dirty glass, a grey afternoon
        for (const bz of [RZ, YVOID.z1]) { const b = new THREE.Mesh(new THREE.PlaneGeometry(CW, YVOID.sky - CH), mSlab); b.position.set(ccx, (CH + YVOID.sky) / 2, bz); b.rotation.y = bz === RZ ? Math.PI : 0; G.add(b); }
        { const sky = new THREE.Mesh(new THREE.PlaneGeometry(CW, vd), new THREE.MeshBasicMaterial({ map: repeatTex(tSky, CW / 4, 1), color: 0x8a96a0, fog: false }));
          mats.push(sky.material); sky.rotation.x = Math.PI / 2; sky.position.set(ccx, YVOID.sky, vz); G.add(sky); }
        // the escalator, rising out of the floor below to the taped-off landing (the opening film rides it)
        { const e0 = new THREE.Vector3(-21.2, YVOID.floor, 6.25), e1 = new THREE.Vector3(GAP0 + 0.3, 0, 6.25);
          const len = e0.distanceTo(e1), ang = Math.atan2(e1.y - e0.y, e1.x - e0.x), mid = e0.clone().lerp(e1, 0.5);
          const truss = new THREE.Group(); truss.position.copy(mid); truss.rotation.z = ang; G.add(truss);
          box(len, 0.5, 1.1, 0, -0.35, 0, M({ color: 0x5e6266, roughness: 0.5, metalness: 0.6 }), truss, false);
          for (const sz of [-0.58, 0.58]) { box(len, 0.9, 0.06, 0, 0.35, sz, mGlassDirty, truss, false); box(len, 0.06, 0.1, 0, 0.82, sz, mRubber, truss, false); }
          const stepG = new THREE.BoxGeometry(0.4, 0.2, 1.0), nS = Math.floor(len / 0.4);
          const steps = new THREE.InstancedMesh(stepG, mSteel, nS); const mtx = new THREE.Matrix4();
          for (let k = 0; k < nS; k++) { const t = (k + 0.5) / nS; const x = e0.x + (e1.x - e0.x) * t, y = e0.y + (e1.y - e0.y) * t; mtx.makeTranslation(x, y - 0.06, 6.25); steps.setMatrixAt(k, mtx); }
          steps.instanceMatrix.needsUpdate = true; steps.computeBoundingSphere(); G.add(steps);
          box(1.8, 0.03, 1.2, GAP0 + 0.9 + 0.3, 0.015, 6.25, mSteel, G, false);
          yLive.escalator = { e0, e1 };
        }
        // the EXIT at the corridor's west end, green over a shut fire door
        { const d = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 2.1), M({ color: 0x5a5e58, roughness: 0.6 })); d.rotation.y = Math.PI / 2; d.position.set(X0 + 0.01, 1.05, 2.5); G.add(d);
          const ex = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.16), new THREE.MeshBasicMaterial({ map: tExit, toneMapped: false })); mats.push(ex.material);
          ex.rotation.y = Math.PI / 2; ex.position.set(X0 + 0.02, 2.4, 2.5); G.add(ex);
          glowPlane(1.4, 0.8, 0x40ff80, 0.18, X0 + 0.03, 2.35, 2.5, 0, Math.PI / 2); }
      }

      /* ---- the people: the keeper behind her counter; the woman at the edge of the frame (hidden until CP5 calls) */
      yLive.keeper = mkPerson('granny', { x: KEEP.x, z: KEEP.z, ry: -Math.PI / 2, height: 1.56, idle: 'Stand_and_Chat', talk: 'Talk_Passionately', idleRate: 0.42, talkRate: 0.8, talkWeight: 0.55, look: 0.8 });
      yLive.girl = mkPerson('yinghost', { x: -1.2, z: -5.6, ry: Math.PI / 2, height: 1.6, idle: 'Idle_9', idleRate: 0.25, hidden: true, ghost: true });
    }

    /* ---------------------------------------------------------- the people of this chapter
       Sized from POSED BONES and grounded on the lowest (the v3.8/v4.7 law), each take's foot centre measured so a
       crossfade between two takes authored apart never walks her through her counter (ch3's granny, v5.22), culled by
       a sphere round the posed skin (v18.5's law), the head's look laid on after the mixer and put back before it runs
       again (the v11.5 law). A failed download leaves the place empty, never a block of a person (v21.16). */
    const people = [];
    const _pv = new THREE.Vector3(), _pq = new THREE.Quaternion(), _pe = new THREE.Euler(), _hp = new THREE.Vector3(), _cp = new THREE.Vector3();
    function mkPerson(key, o) {
      const group = new THREE.Group(); group.position.set(o.x, 0, o.z); group.rotation.y = o.ry || 0; worldY.add(group);
      const P = { key, group, model: null, mixer: null, idle: null, talk: null, head: null, headWrote: null, ready: false, o,
                  talkUntil: 0, talkW: 0, lookYaw: 0, lookPitch: 0, look: o.look || 0, rootIdle: new THREE.Vector3(), rootTalk: new THREE.Vector3(),
                  inner: null, alpha: o.hidden ? 0 : 1, mats: [] };
      if (o.hidden) group.visible = false;
      parseOnce(key).then((gltf) => {
        if (!alive) return;
        const g = cloneSkinned(gltf.scene);
        g.traverse(m => { if (m.isMesh) { m.castShadow = !LOW && !o.ghost; m.receiveShadow = false;
          if (o.ghost) { m.material = m.material.clone(); m.material.transparent = true; m.material.depthWrite = false; m.material.opacity = 1; P.mats.push(m.material); mats.push(m.material); } } });
        g.traverse(b => { if (b.isBone && HEAD_RE.test(b.name) && !P.head) P.head = b; });
        const mx = new THREE.AnimationMixer(g);
        const clip = (n) => gltf.animations.find(a => a.name === n);
        const idleC = clip(o.idle) || gltf.animations[0], talkC = o.talk ? clip(o.talk) : null;
        const footOf = (c) => {
          const a = mx.clipAction(c); a.reset().setEffectiveWeight(1).play(); mx.update(0); g.updateMatrixWorld(true);
          const s = new THREE.Vector3(); let n = 0;
          g.traverse(b => { if (b.isBone && /Foot(_\d+)?$/i.test(b.name)) { b.getWorldPosition(_pv); s.add(_pv); n++; } });
          a.stop(); return n ? s.divideScalar(n) : s;
        };
        if (idleC) P.rootIdle.copy(footOf(idleC));
        if (talkC) P.rootTalk.copy(footOf(talkC)); else P.rootTalk.copy(P.rootIdle);
        // height from the posed bones across the idle take; the floor from its lowest frame
        let lo = Infinity, hi = -Infinity;
        if (idleC) {
          const a = mx.clipAction(idleC); a.reset().setEffectiveWeight(1).play();
          for (let k = 0; k < 6; k++) {
            mx.setTime(idleC.duration * k / 6); g.updateMatrixWorld(true);
            g.traverse(b => { if (!b.isBone) return; b.getWorldPosition(_pv); lo = Math.min(lo, _pv.y); hi = Math.max(hi, _pv.y); });
          }
          a.stop();
        }
        if (!(hi > lo)) { console.warn(key + ': no bones to size by'); return; }
        const crown = (() => { let c = false; g.traverse(b => { if (b.isBone && /HeadTop_End|head_end|headtop/i.test(b.name)) c = true; }); return c; })();
        const s = o.height / ((hi - lo) / (crown ? 1 : 0.935));
        const inner = new THREE.Group(); inner.scale.setScalar(s); inner.position.y = -lo * s + 0.005; inner.add(g); group.add(inner);
        P.inner = inner; P.model = g; P.mixer = mx; P.scale = s;
        if (idleC) { P.idle = mx.clipAction(idleC); P.idle.reset().setEffectiveTimeScale(o.idleRate || 1).setEffectiveWeight(1).play(); }
        if (talkC) { P.talk = mx.clipAction(talkC); P.talk.reset().setEffectiveTimeScale(o.talkRate || 1).setEffectiveWeight(0).play(); }
        mx.update(0.0001);
        P.ready = true;
        // the culling sphere round the posed skin, world space, generous
        group.updateMatrixWorld(true);
        const bb = new THREE.Box3();
        g.traverse(m => { if (!m.isSkinnedMesh) return; m.skeleton.update(); const n = m.geometry.attributes.position.count, st = Math.max(1, Math.floor(n / 3000));
          for (let i = 0; i < n; i += st) { m.getVertexPosition(i, _pv); _pv.applyMatrix4(m.matrixWorld); bb.expandByPoint(_pv); } });
        if (!bb.isEmpty()) {
          const sph = bb.getBoundingSphere(new THREE.Sphere()); sph.radius = Math.max(sph.radius * 1.4, 1.2);
          g.traverse(m => { if (!m.isSkinnedMesh) return; m.frustumCulled = true; const inv = m.matrixWorld.clone().invert(), k = m.matrixWorld.getMaxScaleOnAxis() || 1;
            m.boundingSphere = new THREE.Sphere(sph.center.clone().applyMatrix4(inv), sph.radius / k); });
        }
        owned.push({ dispose: () => mx.stopAllAction() });
        redoShadows();
      }).catch(err => { console.warn(key + ' failed to load', err); ctx.loadFail && ctx.loadFail(key, err); });
      people.push(P);
      return P;
    }
    /* she speaks: the talking take eased in over her idle for the line's length, on WALL time */
    function personTalk(P, secs) { if (P) P.talkUntil = performance.now() / 1000 + secs; }
    function peopleTick(wdt) {
      for (const P of people) {
        if (!P.ready || !P.group.visible || Math.abs(P.o.x - yaw.position.x) > 80) continue;
        if (P.head && P.headWrote) P.head.quaternion.copy(P.headWrote);
        const want = performance.now() / 1000 < P.talkUntil ? (P.o.talkWeight || 1) : 0;
        P.talkW += (want - P.talkW) * (1 - Math.exp(-wdt * 3.2));
        if (P.talk) { P.talk.setEffectiveWeight(P.talkW); P.idle && P.idle.setEffectiveWeight(1 - P.talkW * 0.85); }
        P.mixer.update(wdt);
        // the two takes stand her in different places: keep her feet where the idle puts them
        if (P.talk) { _pv.copy(P.rootTalk).sub(P.rootIdle).multiplyScalar(P.talkW); P.model.position.set(-_pv.x, 0, -_pv.z); }
        if (P.head) {
          if (!P.headWrote) P.headWrote = new THREE.Quaternion();
          P.headWrote.copy(P.head.quaternion);
          let ty = 0, tp = 0;
          if (P.look > 0 && getState() === 'play') {
            P.head.getWorldPosition(_hp); camera.getWorldPosition(_cp);
            const dx = _cp.x - _hp.x, dz = _cp.z - _hp.z, dy = _cp.y - _hp.y;
            const a = Math.atan2(dx, dz) - P.group.rotation.y, yawTo = Math.atan2(Math.sin(a), Math.cos(a));
            if (Math.abs(yawTo) < 1.7 && Math.hypot(dx, dz) < 7) { ty = THREE.MathUtils.clamp(yawTo, -0.9, 0.9); tp = THREE.MathUtils.clamp(-Math.atan2(dy, Math.hypot(dx, dz)), -0.35, 0.3); }
          }
          const k = 1 - Math.exp(-wdt * 2.4);
          P.lookYaw += (ty * P.look - P.lookYaw) * k; P.lookPitch += (tp * P.look - P.lookPitch) * k;
          if (Math.abs(P.lookYaw) + Math.abs(P.lookPitch) > 1e-4) { _pe.set(P.lookPitch, P.lookYaw, 0, 'YXZ'); _pq.setFromEuler(_pe); P.head.quaternion.multiply(_pq); }
        }
      }
    }

    /* ---------------------------------------------------------- WORLD Y, alive
       Every moving thing in the shop on WALL time (the v7.4 law), in every state — a film shows the shop too. `k` is
       the shop's light (CP5's cold takes it down), `flameK` the candles', `redK` the altar's red, `smokeK` the joss's;
       nothing runs while he is in another world. */
    let yT = 0, tubeNext = 4, tubeStut = 0;
    const _bm = new THREE.Matrix4();
    function yTick(wdt) {
      if (Math.abs(yaw.position.x) > 60 || wdt <= 0) return;
      yT += wdt;
      const L = yLive.k;
      // the tube: steady but for a stutter every 5–13 s (on and off at sixteen a second), a faint shimmer under it
      tubeNext -= wdt;
      if (tubeNext <= 0) { tubeStut = 0.25 + hash(yT, 3) * 0.45; tubeNext = 5 + hash(yT, 7) * 8; }
      let tk = 1;
      if (tubeStut > 0) { tubeStut -= wdt; tk = hash(Math.floor(yT * 16), 11) < 0.45 ? 0.12 : 1; }
      tk *= 0.95 + 0.05 * Math.sin(yT * 31);
      if (yLive.tube) yLive.tube.material.color.setRGB(0.06 + 0.85 * tk * L, 0.06 + 0.89 * tk * L, 0.07 + 0.93 * tk * L);
      for (const g of yLive.tubeGlow) g.material.opacity = g.userData.op * tk * L;
      // the far tube down the corridor: dimmer, and dying
      if (yLive.farTube) {
        const fk = hash(Math.floor(yT * 7), 5) < 0.12 ? 0.18 : 0.72 + 0.28 * Math.sin(yT * 0.4);
        yLive.farTube.material.color.setRGB(0.81 * fk, 0.88 * fk, fk); yLive.farPool.material.opacity = yLive.farPool.userData.op * fk;
      }
      // the altar's red: a slow throb you only notice when it stops
      const rk = yLive.redK * (0.93 + 0.07 * Math.sin(yT * 0.9));
      for (const g of yLive.redGlow) g.material.opacity = g.userData.op * rk;
      if (yLive.bulb) yLive.bulb.material.color.setRGB(Math.min(1, rk), 0.165 * rk, 0.1 * rk);
      // the candles
      // (CP5: a candle guttering is a DIP that shrinks every flame for a moment and gives them back)
      yLive.flameDip = Math.max(0, (yLive.flameDip || 0) - wdt * 0.9);
      const gut = 1 - 0.7 * Math.sin(Math.PI * Math.min(1, yLive.flameDip)) * (0.6 + 0.4 * Math.sin(yT * 31));
      for (const f of yLive.flames) {
        if (!f.sprite) continue;
        const fl = 1 + 0.13 * Math.sin(yT * 9.1 + f.seed) + 0.07 * Math.sin(yT * 23.7 + f.seed * 2) + 0.05 * Math.sin(yT * 3.3 + f.seed);
        const fk = yLive.flameK * gut;
        f.sprite.scale.set(f.s * 0.5 * (0.92 + 0.08 * fl) * Math.max(0.15, fk), f.s * fl * fk, 1);
        f.sprite.position.set(f.x + Math.sin(yT * 2.1 + f.seed) * 0.0015, f.y + (fl - 1) * f.s * 0.3 * fk - (1 - fk) * f.s * 0.4, f.z);
        f.pool.material.opacity = f.pool.userData.op * (0.82 + 0.18 * fl) * fk;
      }
      if (yLive.girlFlower) yLive.girlFlower.material.opacity = yLive.girlFlower.userData.op * (0.8 + 0.2 * Math.sin(yT * 0.5)) * yLive.flameK;
      if (yLive.fan) yLive.fan.rot.rotation.y += yLive.fan.speed * yLive.fan.k * wdt;
      if (yLive.flags) for (const fl of yLive.flags) fl.f.rotation.x = Math.sin(yT * 0.9 + fl.seed) * 0.12 + Math.sin(yT * 2.3 + fl.seed * 2) * 0.03;
      // the bead curtain: each string a spring; his head and shoulders part them as he passes, a draught stirs them
      const B = yLive.beads;
      if (B && B.red) {
        if (!B.off) { B.off = new Float32Array(B.n); B.vel = new Float32Array(B.n); B.offZ = new Float32Array(B.n); B.velZ = new Float32Array(B.n); B.lastZ = yaw.position.z; }
        const px = yaw.position.x, pz = yaw.position.z, near = Math.max(0, 1 - Math.abs(pz - B.z) / 0.55);
        const vz = (pz - B.lastZ) / wdt; B.lastZ = pz;
        const stepX = (B.x1 - B.x0) / (B.n - 1);
        const sub = Math.max(1, Math.ceil(wdt / 0.02)), h = wdt / sub;
        let moved = 0, ri = 0, di = 0;
        for (let s = 0; s < B.n; s++) {
          const sx = B.x0 + s * stepX, dx = sx - px, w = near * Math.exp(-(dx * dx) / 0.05);
          const tx = (dx >= 0 ? 1 : -1) * 0.3 * w + Math.sin(yT * 0.8 + s * 0.7) * 0.006;
          const tz = THREE.MathUtils.clamp(vz * 0.12, -0.25, 0.25) * w;
          for (let q = 0; q < sub; q++) {
            B.vel[s] += ((tx - B.off[s]) * 38 - B.vel[s] * 6.5) * h; B.off[s] += B.vel[s] * h;
            B.velZ[s] += ((tz - B.offZ[s]) * 30 - B.velZ[s] * 5) * h; B.offZ[s] += B.velZ[s] * h;
          }
          moved += Math.abs(B.vel[s]) + Math.abs(B.velZ[s]);
          for (let k = 0; k < B.per; k++) {
            const f = Math.pow((k + 1) / B.per, 0.85), o = B.off[s] * f;
            _bm.makeTranslation(sx + o, B.top - (k + 0.5) * B.step + Math.abs(o) * 0.12, B.z + B.offZ[s] * f);
            if (k % 2 === 0) B.red.setMatrixAt(ri++, _bm); else B.dark.setMatrixAt(di++, _bm);
          }
        }
        B.red.instanceMatrix.needsUpdate = true; B.dark.instanceMatrix.needsUpdate = true;
        B.push = moved;                                  // CP5 rattles them by this
      }
      // the back room's curtain: a draught from behind it, and CP5's gust
      const C = yLive.curtain;
      if (C) {
        C.gust = Math.max(0, C.gust - wdt * 0.5);
        const pos = C.mesh.geometry.attributes.position, b = C.base;
        for (let i = 0; i < pos.count; i++) {
          const x0 = b[i * 3], hang = (C.h / 2 - b[i * 3 + 1]) / C.h;
          const wave = Math.sin(x0 * 9 + yT * 1.1) * 0.012 + Math.sin(x0 * 23 - yT * 1.9) * 0.005;
          pos.setZ(i, Math.sin(x0 * 30) * 0.012 + (wave + C.gust * 0.14 * (0.5 + 0.5 * Math.sin(yT * 3 + x0 * 4))) * hang);
        }
        pos.needsUpdate = true; C.mesh.geometry.computeVertexNormals();
      }
      // dust in the red air, and the joss's smoke
      const Mo = yLive.motes;
      if (Mo) {
        const p = Mo.pts.geometry.attributes.position, b = Mo.base;
        for (let i = 0; i < Mo.n; i++) p.setXYZ(i, b[i * 3] + Math.sin(yT * 0.11 + i) * 0.25, b[i * 3 + 1] + Math.sin(yT * 0.07 + i * 2.1) * 0.18, b[i * 3 + 2] + Math.cos(yT * 0.09 + i * 1.3) * 0.25);
        p.needsUpdate = true;
      }
      for (const sm of yLive.smoke) {
        sm.t = (sm.t + wdt / 5.5) % 1;
        const t = sm.t, a = yLive.smokeAt;
        sm.sp.position.set(a.x + Math.sin(t * 5 + sm.k) * 0.04 * t, a.y + t * 0.95, a.z + Math.cos(t * 4 + sm.k) * 0.03 * t + t * 0.05);
        const sc = 0.05 + t * 0.32; sm.sp.scale.set(sc, sc, 1);
        sm.sp.material.opacity = Math.sin(Math.PI * t) * 0.22 * yLive.smokeK;
        sm.sp.material.rotation = t * 1.5 + sm.k;
      }
    }

    buildWorldY();                                   // here: after everything it reads at call time (above)

    /* ============================================== WORLD H · CHAPTER 3'S SHOP
       CP1: a lit room at chapter 3's numbers (CP7 copies the shop itself) */
    {
      const W = HSHOP.x1 - HSHOP.x0, D = HSHOP.z1 - HSHOP.z0, cz = (HSHOP.z0 + HSHOP.z1) / 2;
      floorAt(W, D, 0, cz, matFloorH, worldH);
      ceilAt(W, D, 0, HSHOP.H, cz, matWallH, worldH);
      walls.push(box(W + 0.4, HSHOP.H, 0.2, 0, HSHOP.H / 2, HSHOP.z0 - 0.1, matWallH, worldH, false));
      walls.push(box(0.2, HSHOP.H, D, HSHOP.x0 - 0.1, HSHOP.H / 2, cz, matWallH, worldH, false));
      walls.push(box(0.2, HSHOP.H, D, HSHOP.x1 + 0.1, HSHOP.H / 2, cz, matWallH, worldH, false));
      const lw = -0.62 - HSHOP.x0, rw = HSHOP.x1 - 0.62;
      walls.push(box(lw, HSHOP.H, 0.2, HSHOP.x0 + lw / 2, HSHOP.H / 2, 0.1, matWallH, worldH, false));
      walls.push(box(rw, HSHOP.H, 0.2, 0.62 + rw / 2, HSHOP.H / 2, 0.1, matWallH, worldH, false));
      const CW = HMALL.x1 - HMALL.x0, CD = HMALL.z1 - HMALL.z0, ccz = (HMALL.z0 + HMALL.z1) / 2;
      floorAt(CW, CD, 0, ccz, matTerr, worldH);
      walls.push(box(CW, HMALL.H, 0.2, 0, HMALL.H / 2, HMALL.z1 + 0.1, matWallC, worldH, false));
      walls.push(box(0.2, HMALL.H, CD, HMALL.x0 - 0.1, HMALL.H / 2, ccz, matWallC, worldH, false));
      walls.push(box(0.2, HMALL.H, CD, HMALL.x1 + 0.1, HMALL.H / 2, ccz, matWallC, worldH, false));
      solids.push(box(0.6, 1.0, 2.9, 3.2, 0.5, -2.45, matWood, worldH));           // the owner's counter (chapter 3's RCNT)
    }

    /* ============================================== WORLD T · THE SHOPHOUSE
       CP1: the room, the five-foot way, the counter (CP8 dresses them) */
    {
      const W = TSHOP.x1 - TSHOP.x0, D = TSHOP.z1 - TSHOP.z0, cz = (TSHOP.z0 + TSHOP.z1) / 2;
      floorAt(W, D, 0, cz, matFloorT, worldT);
      ceilAt(W, D, 0, TSHOP.H, cz, matCeilT, worldT);
      walls.push(box(W + 0.4, TSHOP.H, 0.2, 0, TSHOP.H / 2, TSHOP.z0 - 0.1, matWallT, worldT, false));
      walls.push(box(0.2, TSHOP.H, D, TSHOP.x0 - 0.1, TSHOP.H / 2, cz, matWallT, worldT, false));
      walls.push(box(0.2, TSHOP.H, D, TSHOP.x1 + 0.1, TSHOP.H / 2, cz, matWallT, worldT, false));
      // the five-foot way: its floor, closed at both ends and along the kerb (he does not walk into the road)
      floorAt(W + 2, TWAY.z1 - TWAY.z0, 0, (TWAY.z0 + TWAY.z1) / 2, matFloorT, worldT);
      walls.push(box(0.2, TSHOP.H, TWAY.z1, TSHOP.x0 - 1.1, TSHOP.H / 2, TWAY.z1 / 2, matWallT, worldT, false));
      walls.push(box(0.2, TSHOP.H, TWAY.z1, TSHOP.x1 + 1.1, TSHOP.H / 2, TWAY.z1 / 2, matWallT, worldT, false));
      hidBox(W + 2.4, 1.4, 0.2, 0, 0.7, TWAY.z1 + 0.1, worldT);
      walls.push(worldT.children[worldT.children.length - 1]);
      // the counter across the shop
      solids.push(box(TCNT.x1 - TCNT.x0, TCNT.top, TCNT.d, (TCNT.x0 + TCNT.x1) / 2, TCNT.top / 2, TCNT.z, matWoodL, worldT));
    }

    /* ------------------------------------------------------------ light
       (lamps are emissive and painted; a light count never changes in play —
       the v15.1 law) */
    const H_DAY = {
      stops: [[0.00, '#cfe2f2'], [0.10, '#b9d4ec'], [0.30, '#8fb8e0'], [0.60, '#6a9ad0'], [1.00, '#4a7cbc']],
      bg: 0xb8cde0, fog: [0xd8d2c4, 0.004],
      hemi: [0xfff4e2, 0x6a5a48, 0.95], key: [0xfff0dc, 0.85, 2, 8, 4], fill: [0xcfe0ff, 0.35],
      stars: 0, moon: 0, sun: 0, clouds: 0,
      vmHemi: [0xfff2e0, 0x6a5a48, 0.95], vmKey: [0xfff0dc, 0.80]
    };
    const T_DAY = {
      stops: [[0.00, '#f2dcb8'], [0.12, '#e8cfa8'], [0.35, '#bcd0e0'], [0.65, '#8fb2d4'], [1.00, '#5f8cc0']],
      bg: 0xd8c8a8, fog: [0xd8c8a8, 0.006],
      hemi: [0xfff0d8, 0x6a5038, 0.85], key: [0xffe0b0, 0.95, -3, 6, 8], fill: [0xd8e4ff, 0.3],
      stars: 0, moon: 0, sun: 0, clouds: 0,
      vmHemi: [0xfff0d8, 0x6a5038, 0.9], vmKey: [0xffe0b0, 0.8]
    };

    /* ------------------------------------------------------ the chapter clock */
    const PHASES = ['yin', 'yinKeeper', 'yinHold', 'yinDone', 'han', 'hanHold', 'tray', 'trayHold', 'decide'];
    let phase = 'yin';
    let booted = false;
    const dayClock = { t: 0 };
    let lastWall = 0;
    const todo = [];
    function after(secs, fn) { todo.push({ at: dayClock.t + secs, fn }); todo.sort((a, b) => a.at - b.at); }
    function runTodo() { while (todo.length && todo[0].at <= dayClock.t) todo.shift().fn(); }
    function dropTodo() { todo.length = 0; }
    const heard = new Set();

    const speak = { until: 0, pending: null };
    function speakReset() { speak.until = 0; speak.pending = null; }
    /* A LINE IS A BEAT, HEARD OR NOT (e3c3's law): a muted game speaks it
       silently on its own length, and a line whose bytes have not landed is
       held a moment (v8.0) and then spoken silently, so a beat chained on a
       line's start never stops the chapter */
    function sayLine(name, vol = 1, onStart, pan) {
      if (dayClock.t < speak.until) return false;
      const start = () => { speak.until = dayClock.t + (SECS[name] || 2.5) + 0.25; heard.add(name); if (onStart) onStart(); };
      if ((soundOff && soundOff()) || !worldSfx) { start(); return true; }
      if (worldSfx(name, vol, 1, pan)) { start(); return true; }
      speak.pending = { name, vol, start, pan, give: dayClock.t + 1.6 };
      speak.until = dayClock.t + 0.2;
      return true;
    }
    function runSpeak() {
      const q = speak.pending;
      if (!q || dayClock.t < speak.until) return;
      if (dayClock.t > q.give || (soundOff && soundOff())) { speak.pending = null; q.start(); return; }
      if (worldSfx(q.name, q.vol, 1, q.pan)) { speak.pending = null; q.start(); }
      else speak.until = dayClock.t + 0.2;
    }
    /* one voice at a time, in order, never dropped (the v9.5 queue) */
    const lineQ = [];
    function queueLine(name, onStart, vol = 1, pan = 0) { lineQ.push({ name, onStart, vol, pan }); }
    function queueGap(secs) { lineQ.push({ gap: secs }); }
    function queueFn(fn) { lineQ.push({ fn }); }
    function runQueue() {
      if (!lineQ.length || speak.pending || dayClock.t < speak.until) return;
      const q = lineQ.shift();
      if (q.fn) { q.fn(); return; }
      if (q.gap) { speak.until = dayClock.t + q.gap; return; }
      sayLine(q.name, q.vol, q.onStart, q.pan);
    }
    function panAt(x, z) {
      const dx = x - yaw.position.x, dz = z - yaw.position.z;
      const a = Math.atan2(dx, -dz) + yaw.rotation.y;
      return THREE.MathUtils.clamp(Math.sin(a) * 0.75, -0.75, 0.75);
    }
    const quiet = () => !lineQ.length && !speak.pending && dayClock.t >= speak.until;

    /* only the lines said IN PLAY are warmed here (each decoded buffer is ~1 MB a five seconds on a phone): the films
       warm their own cues (kit.film), the endings and the cards are warmed by startDecision */
    const PLAY_LINES = ['z4look1', 'z4look2', 'z4look3', 'yk4hello', 'yk4show', 'z4ask', 'yk4gentle', 'z4numb', 'z4cold',
      'z4beside', 'z4yin', 'yk4heard', 'yk4merit', 'ow4hello', 'z4fine', 'ow4new', 'z4roar', 'z4urge', 'ow4ok', 'z4go',
      'to4hello', 'to4notice', 'z4sense', 'to4tray', 'z4lersi', 'to4lersi', 'z4wess', 'to4wess', 'z4naga', 'to4naga',
      'to4unknown', 'to4clock', 'z4feel', 'z4han0', 'z4tray0'];   // the last two under the kit's black between worlds
    if (warmSounds) warmSounds(PLAY_LINES);

    /* ------------------------------------------------------------ the phases */
    const W = DATA.words;
    const worldOf = (x) => x > 100 ? 'H' : x < -100 ? 'T' : 'Y';
    const looked = new Set();                  // the Yin shop's three looks
    const held = new Set();                    // the tray's three pieces
    const LOOK_N = 3, PIECE_N = 3;
    let worldRun = 0;                          // a world change's run token (a reset or a second change cancels the first)
    function setPhase(p, tag) {
      phase = p;
      if (kit) kit.setPhase(tag ? p + ':' + tag : p);
      objectiveFor(p);
    }
    function objectiveFor(p) {
      if (!kit) return;
      const o = {
        yin: W.objLook.replace('{n}', looked.size), yinKeeper: W.objKeeper, yinHold: W.objPick, yinDone: W.objLeave,
        han: W.objOwner, hanHold: W.objHanuman, tray: W.objSit, trayHold: W.objPieces.replace('{n}', held.size), decide: null
      }[p];
      kit.objective(o || null);
    }

    /* ------------------------------------------------------- the Yin shop */
    function lookAt(k) {
      if (phase !== 'yin' || looked.has(k)) return false;
      looked.add(k);
      setPhase('yin', [...looked].join(','));
      /* each look is answered by the shop (the plan's §4.1): the bottles by the tube stuttering over them, the
         photographs by the door's bell ringing once with nobody there, the altar by the back room's curtain */
      queueLine({ bottles: 'z4look1', photos: 'z4look2', altar: 'z4look3' }[k], () => after(1.6, () => lookAnswer(k)));
      if (looked.size >= LOOK_N) queueFn(() => keeperSpeaks());
      return true;
    }
    function lookAnswer(k) {
      if (!worldSfx || worldOf(yaw.position.x) !== 'Y') return;
      if (k === 'bottles') { tubeStut = 0.9; tubeNext = 9; worldSfx('y4tube', 0.5, 1, panAt(0, -4.0)); }
      else if (k === 'photos') { yin.bellSwing = 1; worldSfx('y4bell', 0.42, 1, panAt(DOORBELL.x, DOORBELL.z)); }
      else if (k === 'altar') { if (yLive.curtain) yLive.curtain.gust = 1.4; worldSfx('y4curtain', 0.55, 1, panAt(BACKROOM.x, BACKROOM.z)); }
    }
    function keeperSpeaks() {
      if (phase !== 'yin') return;
      queueGap(0.6);
      queueLine('yk4hello', () => setPhase('yinKeeper'));
    }
    function keeperShows() {
      if (phase !== 'yinKeeper') return false;
      // she opens the velvet box as she begins (the lid eases up in yinTick) and talks through her two lines
      queueLine('yk4show', () => {
        personTalk(yLive.keeper, SECS.yk4show);
        after(0.5, () => { if (yLive.box) yLive.box.open = 1; if (worldSfx) worldSfx('y4box', 0.55, 1, panAt(YBOX.x, YBOX.z)); });
      });
      queueLine('z4ask');
      queueLine('yk4gentle', () => { personTalk(yLive.keeper, SECS.yk4gentle); setPhase('yinHold'); });
      return true;
    }
    function pickLocket() {
      if (phase !== 'yinHold' || yin.on) return false;
      yinStart();
      return true;
    }
    function leaveYin() {
      if (phase !== 'yinDone' || !kit) return;
      setPhase('yinDone');
      if (kit.waypoint) kit.waypoint(null);
      if (!kit.film || !kit.film('merit', { onDone: () => toWorld('H', false) })) toWorld('H', false);
    }

    /* ============================================== THE YIN EXPERIENCE (CP5)
       S1·09: "an electric-like numbness travelling up my arm, followed by an intense cold". On the chapter's clock
       from the press, his look his own: the locket in his hand (kit.hold) with static crawling from it up his arm and
       the hand trembling (kit.tremble); then the cold — frost growing in from the edges of his sight, his breath
       fogging, the shop's red draining to a cold blue-white, the candles shrinking, the fan running down, the tape on
       the counter sagging (the song's own source slowing: the bed RATE, main.js's loopRate); then a young woman at
       the very edge of his sight who is gone before his eyes reach her, and her humming beside him — the tape's
       voice, without the tape; then STEADY (the thirty-first seam): keep her steady and set her down gently. The
       set-down: the tape runs down and stops with a click, a sigh at his ear, the warmth back over four seconds, the
       candles straightening, his promise. Every number below is on WALL time or the chapter's clock (the v7.4 law). */
    const Y_COLD = {
      stops: [[0.00, '#1c2630'], [0.30, '#18202a'], [0.60, '#141a22'], [1.00, '#0e1218']],
      bg: 0x0e1218, fog: [0x141c24, 0.03],
      hemi: [0xcfe4ff, 0x10161e, 0.5], key: [0xd8ecff, 0.42, 1, 6, 2], fill: [0x9cc4ff, 0.26],
      stars: 0, moon: 0, sun: 0, clouds: 0,
      vmHemi: [0xcfe4ff, 0x10161e, 0.62], vmKey: [0xd8ecff, 0.55]
    };
    const RADIO = { x: YSHOP.x1 - 0.12, z: -2.2 }, BACKROOM = { x: YSHOP.x0 + 0.68, z: YSHOP.z0 + 0.3 }, DOORBELL = { x: 0.3, z: -0.19 };
    const Y_SOUNDS = ['y4song', 'y4dread', 'y4mall', 'y4hum', 'y4tapeclick', 'y4zap', 'y4frost', 'y4shiver', 'y4breath', 'y4sigh',
                      'y4bell', 'y4tube', 'y4beads', 'y4curtain', 'y4candle', 'y4creak', 'y4box', 'y4setdown', 'y4clatter', 'y4sting', 'y4radio'];
    if (warmSounds) warmSounds(Y_SOUNDS);
    const yin = { on: false, run: 0, setDown: false, cold: 0, coldTo: 0, numb: 0, numbTo: 0, puffT: 0,
                  rate: 1, gain: 1, stopping: false, stopped: false, clicked: false, bellSwing: 0, radioDip: 0,
                  girl: { a: 0, to: 0, shows: 0, side: 1, placed: false, nextAt: 0 } };
    /* the frost: a plane on the lens (a child of the camera, past its 8 cm near plane), its alphaTest lowered as the
       cold comes so the ferns grow inward from the edges (makeYinFrost draws its alpha by distance from the edge) */
    const frostMat = new THREE.MeshBasicMaterial({ map: tex(makeYinFrost(THREE, cnv)), transparent: true, opacity: 0, alphaTest: 0.999,
                                                    depthTest: false, depthWrite: false, fog: false, toneMapped: false });
    mats.push(frostMat);
    const frostMesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), frostMat);
    frostMesh.renderOrder = 9990; frostMesh.frustumCulled = false; frostMesh.visible = false; frostMesh.position.set(0, 0, -0.105);
    camera.add(frostMesh);
    owned.push({ dispose: () => { camera.remove(frostMesh); frostMesh.geometry.dispose(); } });
    /* his breath: three puffs that fog in front of him and drift away (world sprites, recycled) */
    const puffs = [];
    for (let i = 0; i < 3; i++) {
      const m = new THREE.SpriteMaterial({ map: yLive.tSmoke, color: 0xe4eef6, transparent: true, opacity: 0, depthWrite: false, fog: false }); mats.push(m);
      const sp = new THREE.Sprite(m); sp.visible = false; worldY.add(sp); puffs.push({ sp, t: 1, v: new THREE.Vector3() });
    }
    /* the locket in his hand, and the static crawling from it up his arm — drawn in the hands' pass (kit.hold makes
       it a child of the right arm). Its frame is turned to undo the arm's rest (0.50, 0.28, −0.48), so +z faces the
       lens. */
    const yinHeld = new THREE.Group(); yinHeld.visible = false;
    const ARM_UP = new THREE.Vector3(0.42, -0.5, 0.76).normalize();      // up the forearm, in the held frame
    const arcs = [];
    let heldFace = null;
    {
      const gold = M({ color: 0xd2a640, roughness: 0.32, metalness: 0.85, emissive: 0x2a1a04, emissiveIntensity: 0.5 });
      const lk = new THREE.Group(); lk.scale.setScalar(1.35); yinHeld.add(lk);
      const rim = new THREE.Mesh(new THREE.TorusGeometry(0.021, 0.0035, 8, 28), gold); lk.add(rim);
      const back = new THREE.Mesh(new THREE.CylinderGeometry(0.021, 0.021, 0.004, 28), gold); back.rotation.x = Math.PI / 2; back.position.z = -0.002; lk.add(back);
      const fm = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4, visible: false }); mats.push(fm);
      const fg = new THREE.CircleGeometry(0.018, 28), fuv = fg.attributes.uv;
      for (let i = 0; i < fuv.count; i++) fuv.setXY(i, 0.28 + fuv.getX(i) * 0.44, 1 - (0.08 + (1 - fuv.getY(i)) * 0.4));
      heldFace = new THREE.Mesh(fg, fm); heldFace.position.z = 0.0015; lk.add(heldFace);
      const glass = new THREE.Mesh(new THREE.CircleGeometry(0.018, 28), M({ color: 0xbfd4cf, roughness: 0.05, metalness: 0.2, transparent: true, opacity: 0.16, depthWrite: false }));
      glass.position.z = 0.0025; lk.add(glass);
      const bail = new THREE.Mesh(new THREE.TorusGeometry(0.004, 0.0012, 4, 10), gold); bail.position.set(0, 0.025, 0); lk.add(bail);
      // the chain, slipping down between his fingers
      const chainG = new THREE.TorusGeometry(0.003, 0.0008, 3, 6);
      for (let k = 0; k < 16; k++) {
        const ln = new THREE.Mesh(chainG, gold), u = k / 15;
        ln.position.set(0.006 * Math.sin(u * 5), 0.028 + u * 0.05, -0.004 - u * 0.012); ln.rotation.set(u * 2, k % 2 ? Math.PI / 2 : 0, 0); lk.add(ln);
      }
      // the static: jagged threads from the locket up the arm, re-drawn every 50 ms (additive, over the skin)
      const arcMat = new THREE.LineBasicMaterial({ color: 0xa8dcff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthTest: false, depthWrite: false, fog: false, toneMapped: false });
      mats.push(arcMat);
      for (let i = 0; i < 6; i++) {
        const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(11 * 3), 3));
        const ln = new THREE.Line(geo, arcMat); ln.renderOrder = 50; ln.frustumCulled = false; yinHeld.add(ln); arcs.push(ln);
      }
      const gm = new THREE.SpriteMaterial({ map: yLive.tGlow, color: 0x7cc4ff, transparent: true, opacity: 0, depthTest: false, depthWrite: false, blending: THREE.AdditiveBlending, fog: false });
      mats.push(gm);
      yin.glow = new THREE.Sprite(gm); yin.glow.scale.set(0.09, 0.09, 1); yin.glow.renderOrder = 51; yinHeld.add(yin.glow);
      yin.arcMat = arcMat;
      owned.push({ dispose: () => {
        if (kit && kit.holding && kit.holding() === yinHeld) kit.hold(null);
        yinHeld.traverse(o => { if (o.geometry) o.geometry.dispose(); });
      } });
    }
    const ARM_INV = new THREE.Euler().setFromQuaternion(new THREE.Quaternion().setFromEuler(new THREE.Euler(0.50, 0.28, -0.48)).invert());
    function heldShow(on) {
      yinHeld.visible = !!on;
      if (!kit || !kit.hold) return;
      if (on) {
        if (yLive.girlTex && heldFace) { heldFace.material.map = yLive.girlTex; heldFace.material.visible = true; heldFace.material.needsUpdate = true; }
        kit.hold(yinHeld, { pos: [0.004, -0.02, -0.178], rot: [ARM_INV.x - 0.25, ARM_INV.y, ARM_INV.z] });
      } else if (kit.holding && kit.holding() === yinHeld) kit.hold(null);
    }
    let arcNext = 0;
    const _as = new THREE.Vector3(), _au = new THREE.Vector3(), _ap = new THREE.Vector3();
    function arcsTick(wdt) {
      const k = yin.numb;
      yin.arcMat.opacity = Math.min(1, k * 1.2) * (0.6 + 0.4 * hash(Math.floor(yT * 30), 17));
      yin.glow.material.opacity = k * (0.35 + 0.25 * Math.sin(yT * 14));
      if (k < 0.02) { for (const ln of arcs) ln.visible = false; return; }
      arcNext -= wdt; if (arcNext > 0) return;
      arcNext = 0.05;
      _as.set(0, 0, 1).cross(ARM_UP).normalize(); _au.copy(ARM_UP).cross(_as).normalize();
      let seed = Math.floor(yT * 20) * 13;
      const rnd = () => hash(++seed, 29);
      for (const ln of arcs) {
        const a = ln.geometry.attributes.position, len = (0.05 + rnd() * 0.16) * (0.5 + 0.5 * k), j = 0.006 + 0.006 * k;
        const ox = (rnd() - 0.5) * 0.02, oy = (rnd() - 0.5) * 0.02;
        for (let i = 0; i < 11; i++) {
          const u = i / 10;
          _ap.copy(ARM_UP).multiplyScalar(u * len).addScaledVector(_as, ox + (rnd() - 0.5) * j).addScaledVector(_au, oy + (rnd() - 0.5) * j);
          a.setXYZ(i, _ap.x, _ap.y, _ap.z);
        }
        a.needsUpdate = true;
        ln.visible = rnd() < 0.35 + 0.6 * k;
      }
    }
    /* THE GIRL at the edge of the frame — of THIS screen (a phone's half-width is ~19°, a desktop's ~49°): put where
       the frame ends, held there in the world, and gone the moment his look turns toward her (before it arrives).
       Twice at most, the second time on the other side. */
    const _gd = new THREE.Vector3(), _gp = new THREE.Vector3(), _gq = new THREE.Vector3();
    function halfFovH() { return Math.atan(Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2) * camera.aspect); }
    function girlFree(x, z) {
      if (x < YSHOP.x0 + 0.35 || x > YSHOP.x1 - 0.35 || z < YSHOP.z0 + 0.4 || z > YSHOP.z1 - 0.5) return false;
      for (const b of (S && S.blockers) || []) if (b.max.y > 0.5 && x > b.min.x - 0.12 && x < b.max.x + 0.12 && z > b.min.z - 0.12 && z < b.max.z + 0.12) return false;
      return true;
    }
    function girlPlace() {
      const G = yin.girl, P = yLive.girl; if (!P || !P.ready) return false;
      camera.getWorldDirection(_gd); _gd.y = 0; _gd.normalize(); camera.getWorldPosition(_gp);
      const e = halfFovH() * 0.97;
      for (const side of [G.side, -G.side]) for (const d of [1.3, 1.05, 0.85]) {
        const a = side * e, ca = Math.cos(a), sa = Math.sin(a);
        // turn the view direction by a (positive = to his right, the screen's +x)
        const dx = _gd.x * ca + _gd.z * sa, dz = -_gd.x * sa + _gd.z * ca;
        const x = _gp.x + dx * d, z = _gp.z + dz * d;
        if (!girlFree(x, z)) continue;
        P.group.position.set(x, 0, z); P.group.rotation.y = Math.atan2(_gp.x - x, _gp.z - z);
        G.side = side; G.placed = true;
        return true;
      }
      return false;
    }
    function girlTick(wdt) {
      const G = yin.girl, P = yLive.girl; if (!P || !P.ready) return;
      if (G.to > 0 && !G.placed && dayClock.t >= G.nextAt && getState() === 'play') {
        if (girlPlace()) {
          G.shows++; G.a = 0;
          if (worldSfx) {
            const pan = G.side * 0.75;
            if (G.shows === 1) worldSfx('y4sting', 0.4, 1, pan);
            worldSfx('y4breath', 0.62, 1, pan);
            worldSfx('y4hum', 0.66, 1, pan);
          }
        } else G.nextAt = dayClock.t + 0.4;
      }
      if (G.placed) {
        // is his look turning onto her? (the angle off his view's centre, against this screen's half-width)
        camera.getWorldDirection(_gd); _gd.y = 0; _gd.normalize(); camera.getWorldPosition(_gp);
        _gq.copy(P.group.position).sub(_gp); _gq.y = 0; _gq.normalize();
        const off = Math.acos(THREE.MathUtils.clamp(_gd.dot(_gq), -1, 1)), edge = halfFovH();
        const want = G.to > 0 && off > edge * 0.62 ? 0.72 : 0;
        G.a += (want - G.a) * (1 - Math.exp(-wdt * (want > G.a ? 2.2 : 14)));
        if (want === 0 && G.a < 0.02) {
          G.placed = false; G.a = 0;
          if (G.to > 0 && G.shows < 2) { G.side = -G.side; G.nextAt = dayClock.t + 2.6; } else G.to = 0;
        }
      }
      for (const m of P.mats) { m.opacity = G.a; if (m.color) m.color.setRGB(0.82 + 0.1 * G.a, 0.86 + 0.08 * G.a, 0.95); if (m.emissive) m.emissive.setRGB(0.05 * G.a, 0.07 * G.a, 0.11 * G.a); }
      P.group.visible = G.a > 0.01;
    }
    /* the frost, the breath, the static, the light, the lid, the bell — every frame (the shop lives in every state) */
    function yinTick(wdt) {
      if (wdt <= 0) return;
      const ease = (v, to, s) => v + (to - v) * (1 - Math.exp(-wdt / s));
      yin.cold = ease(yin.cold, yin.coldTo, yin.coldTo > yin.cold ? 1.6 : 1.4);
      yin.numb = ease(yin.numb, yin.numbTo, 0.5);
      yin.bellSwing *= Math.exp(-wdt * 1.6); yin.radioDip *= Math.exp(-wdt * 2.2);
      if (yLive.bell) yLive.bell.rotation.z = Math.sin(yT * 14) * 0.5 * yin.bellSwing;
      // the tape: a sag and a wow with the cold; running down when he sets her down, then the stop key
      let rateTo = 1 - 0.14 * yin.cold;
      if (yin.stopping) {
        yin.rate = ease(yin.rate, 0.02, 0.42);
        if (yin.rate < 0.1 && !yin.clicked) {
          yin.clicked = true; yin.stopped = true;
          if (worldSfx && worldOf(yaw.position.x) === 'Y') worldSfx('y4tapeclick', 0.5, 1, panAt(RADIO.x, RADIO.z));
        }
      } else yin.rate = ease(yin.rate, rateTo, 0.9);
      // the frost on the lens
      const fk = yin.cold;
      frostMesh.visible = fk > 0.01 && worldOf(yaw.position.x) === 'Y';
      if (frostMesh.visible) {
        const h = 2 * 0.105 * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2);
        frostMesh.scale.set(h * camera.aspect * 1.04, h * 1.04, 1);
        frostMat.alphaTest = Math.max(0.05, 0.999 - 0.82 * fk);
        frostMat.opacity = Math.min(0.92, fk * 1.25);
      }
      // the velvet box's lid
      if (yLive.box) yLive.box.lid.rotation.z += (-1.9 * yLive.box.open - yLive.box.lid.rotation.z) * (1 - Math.exp(-wdt * 3));
      // his breath, every 2.4 s while it is cold
      if (fk > 0.35 && yin.on) {
        yin.puffT -= wdt;
        if (yin.puffT <= 0) {
          yin.puffT = 2.4;
          const p = puffs.find(q => q.t >= 1);
          if (p) {
            camera.getWorldPosition(_gp); camera.getWorldDirection(_gd);
            p.sp.position.copy(_gp).addScaledVector(_gd, 0.26); p.sp.position.y -= 0.13;
            p.v.copy(_gd).multiplyScalar(0.22); p.v.y += 0.05; p.t = 0; p.sp.visible = true;
            if (worldSfx && hash(Math.floor(yT * 3), 23) < 0.6) worldSfx('y4shiver', 0.36, 1, 0);
          }
        }
      }
      for (const p of puffs) {
        if (p.t >= 1) { p.sp.visible = false; continue; }
        p.t = Math.min(1, p.t + wdt / 1.7);
        p.sp.position.addScaledVector(p.v, wdt);
        const sc = 0.08 + p.t * 0.32; p.sp.scale.set(sc, sc, 1);
        p.sp.material.opacity = Math.sin(Math.PI * Math.min(1, p.t * 1.4)) * 0.32 * (1 - p.t * 0.5);
      }
      // the shop's own lamps follow the cold: the red down, the candles small, the joss's smoke thin, the fan running down
      yLive.redK = 1 - 0.68 * fk;
      yLive.flameK = 1 - 0.6 * fk;
      if (yLive.fan) yLive.fan.k = 1 - 0.88 * fk;
      yLive.smokeK = 1 - 0.7 * fk;
      arcsTick(wdt);
      girlTick(wdt);
    }

    /* the experience itself, beat by beat on the chapter clock (a reset or a second start cancels the first: `run`) */
    function yinStart() {
      if (yin.on || !kit) return;
      const run = ++yin.run;
      const at = (t, fn) => after(t, () => { if (run === yin.run && yin.on) fn(); });
      yin.on = true; yin.setDown = false;
      kit.root(true);
      kit.objective(null);
      if (yLive.locket) yLive.locket.visible = false;              // from her box into his hand
      heldShow(true);
      setPhase('yinHold', 'held');
      kit.objective(null);
      at(0.5, () => { yin.numbTo = 1; kit.tremble(0.35, { secs: 0.8 }); if (worldSfx) worldSfx('y4zap', 0.55, 1, 0.4); });
      at(1.4, () => queueLine('z4numb'));
      at(1.9, () => { kit.tremble(0.5, { secs: 1.0 }); if (worldSfx) worldSfx('y4zap', 0.4, 0.9, 0.5); });
      at(3.0, () => {
        yin.coldTo = 1;
        kit.daylight(Y_COLD, 3.0);
        W.presence = W.presenceCold; kit.presence(0.55);
        kit.tremble(0.65, { secs: 1.5 });
        if (worldSfx) worldSfx('y4frost', 0.65, 1, 0);
      });
      at(5.0, () => queueLine('z4cold'));
      at(6.6, () => { const G = yin.girl; G.to = 1; G.shows = 0; G.nextAt = dayClock.t; G.side = hash(yin.run, 31) < 0.5 ? 1 : -1; });
      at(7.4, () => queueLine('z4beside'));
      at(7.4 + (SECS.z4beside || 4.1) + 0.9, () => queueFn(() => yinSteady(run)));
    }
    function yinSteady(run) {
      if (run !== yin.run || !yin.on || !kit) return;
      let tugs = 0;
      kit.event({
        kind: 'steady', label: W.evSteady, brief: W.evSteadyBrief, demo: 'steady',
        secs: 8, ring: 0.16, grace: 1.3, pass: 0.6,
        onBegin: () => { if (worldSfx) worldSfx('y4sting', 0.3, 0.8, 0); },
        onDrift: (k) => { kit.tremble(0.45 + 0.75 * Math.min(1, k), { secs: 0.15 }); yin.numbTo = 0.6 + 0.4 * Math.min(1, k); },
        onTug: () => { tugs++; if (worldSfx) worldSfx(tugs % 2 ? 'y4breath' : 'y4zap', 0.42, 1, (tugs % 2 ? -1 : 1) * 0.6); }
      }).then(r => { if (run === yin.run && yin.on) yinSetDown(!!(r && r.ok)); });
    }
    function yinSetDown(ok) {
      if (yin.setDown || !kit) return;
      yin.setDown = true;
      heldShow(false);
      if (yLive.locket) yLive.locket.visible = true;               // back on her satin
      if (worldSfx) worldSfx(ok ? 'y4setdown' : 'y4clatter', ok ? 0.6 : 0.7, 1, panAt(YBOX.x, YBOX.z));
      if (ok) kit.conduct({ s: 3, note: W.noteSteady });
      else {
        kit.award('sanity', -6, { minigame: true });
        kit.conduct({ note: W.noteSlip });
        if (kit.flash) kit.flash({ color: 'rgba(170,205,255,0.28)', secs: 0.5 });
      }
      // the tape runs down and stops; a sigh at his ear; the cold leaves over four seconds
      yin.stopping = true;
      after(1.1, () => { if (worldSfx) worldSfx('y4sigh', 0.62, 1, -yin.girl.side * 0.6); });
      yin.girl.to = 0;
      yin.coldTo = 0; yin.numbTo = 0;
      kit.daylight(null, 4.0);
      kit.presence(0); W.presence = undefined;
      kit.tremble(0, { secs: 1.6 });
      queueGap(2.2);
      queueLine('z4yin');
      queueFn(() => { yin.bellSwing = 0.6; if (worldSfx) worldSfx('y4bell', 0.3, 1, panAt(DOORBELL.x, DOORBELL.z)); });
      queueGap(1.2);
      queueLine('yk4heard', () => personTalk(yLive.keeper, SECS.yk4heard));
      queueLine('yk4merit', () => { personTalk(yLive.keeper, SECS.yk4merit); yinDone(); });
    }
    function yinDone() {
      yin.on = false;
      setPhase('yinDone');
      if (!kit) return;
      kit.root(false);
      if (kit.waypoint) kit.waypoint({ x: 0, y: 1.3, z: 0.1 });
    }
    /* the small wrong things while he browses — each ONCE, on the chapter clock, never under a voice */
    const WRONG = ['radio', 'candle', 'creak', 'beads'];
    let wrongAt = 0, wrongI = 0;
    function wrongThing(k) {
      if (!worldSfx) return;
      if (k === 'radio') { worldSfx('y4radio', 0.5, 1, panAt(RADIO.x, RADIO.z)); yin.radioDip = 1; }
      else if (k === 'candle') { worldSfx('y4candle', 0.5, 1, panAt(YALT.x, YALT.z)); yLive.flameDip = 1; }
      else if (k === 'creak') worldSfx('y4creak', 0.55, 1, panAt(BACKROOM.x, BACKROOM.z));
      else if (k === 'beads') {
        worldSfx('y4beads', 0.45, 1, panAt(0, 0.1));
        const B = yLive.beads; if (B && B.vel) for (let s2 = 0; s2 < B.n; s2++) B.vel[s2] += (hash(s2, 3) - 0.5) * 1.6;
      }
    }
    function wrongTick() {
      if (!(phase === 'yin' || phase === 'yinKeeper') || worldOf(yaw.position.x) !== 'Y') return;
      if (!wrongAt) { wrongAt = dayClock.t + 9; return; }
      if (wrongI >= WRONG.length || dayClock.t < wrongAt || !quiet()) return;
      wrongThing(WRONG[wrongI++]);
      wrongAt = dayClock.t + 10 + hash(wrongI, 13) * 7;
    }
    /* the beds: the cassette from the radio (by distance, panned by its bearing, its rate the tape's), the drone
       under everything in the shop, the mall's emptiness outside — eased, so a door walked through is a fade */
    const mixK = { dread: 0, mall: 0, song: 0 };
    function mixBedsY(wdt, st) {
      const B = DATA.ambience.beds, inY = worldOf(yaw.position.x) === 'Y';
      const live = inY && (st === 'play' || st === 'unlock' || st === 'choose' || st === 'menu');
      const d = Math.hypot(yaw.position.x - RADIO.x, yaw.position.z - RADIO.z);
      const outside = yaw.position.z > 0.15;
      const att = (1 / (1 + (d / 2.6) ** 2)) * (outside ? 0.45 : 1);
      const humDuck = yin.girl.placed ? 0.55 : 1;
      const song = live && !yin.stopped ? 0.55 * att * (1 - 0.6 * yin.radioDip) * humDuck : 0;
      const k = (s) => 1 - Math.exp(-wdt / s);
      mixK.song += (song - mixK.song) * k(yin.stopped ? 0.05 : 0.5);
      B[0][1] = mixK.song; B[0][2] = panAt(RADIO.x, RADIO.z);
      B[0][3] = yin.rate * (1 + 0.012 * yin.cold * Math.sin(yT * 2 * Math.PI * 0.6));
      const dread = live ? (outside ? 0.12 : 0.22 + 0.18 * yin.cold) * (yin.stopped && !yin.on ? 0.7 : 1) : 0;
      mixK.dread += (dread - mixK.dread) * k(1.5);
      B[1][1] = mixK.dread;
      const mall = live ? (outside ? 0.42 : 0.1) : 0;
      mixK.mall += (mall - mixK.mall) * k(0.8);
      B[2][1] = mixK.mall;
    }
    function yinReset() {
      yin.run++;
      yin.on = false; yin.setDown = false; yin.cold = yin.coldTo = 0; yin.numb = yin.numbTo = 0; yin.puffT = 0;
      yin.rate = 1; yin.stopping = false; yin.stopped = false; yin.clicked = false; yin.bellSwing = 0; yin.radioDip = 0;
      Object.assign(yin.girl, { a: 0, to: 0, shows: 0, side: 1, placed: false, nextAt: 0 });
      if (yLive.girl) yLive.girl.group.visible = false;
      heldShow(false);
      if (yLive.locket) yLive.locket.visible = true;
      if (yLive.box) { yLive.box.open = 0; yLive.box.lid.rotation.z = 0; }
      frostMesh.visible = false;
      for (const p of puffs) { p.t = 1; p.sp.visible = false; }
      yLive.redK = 1; yLive.flameK = 1; yLive.smokeK = 1; if (yLive.fan) yLive.fan.k = 1;
      W.presence = undefined;
      wrongAt = 0; wrongI = 0;
      mixK.song = mixK.dread = mixK.mall = 0;
    }

    /* ------------------------------------------------------- the Hanuman shop */
    function ownerShows() {
      if (phase !== 'han') return false;
      queueLine('ow4new', () => setPhase('hanHold'));
      return true;
    }
    function pickHanuman() {
      if (phase !== 'hanHold') return false;
      // CP7: the whole Hanuman experience. CP1: the release, his words, the run.
      queueLine('z4roar');
      queueLine('ow4ok');
      queueLine('z4go', () => after(SECS.z4go + 0.3, () => runOut()));
      return true;
    }
    function runOut() {
      if (phase !== 'hanHold' || !kit) return;
      if (!kit.film || !kit.film('runout', { onDone: () => toWorld('T', false) })) toWorld('T', false);
    }

    /* ------------------------------------------------------- the tray shop */
    function sitDown() {
      if (phase !== 'tray') return false;
      queueLine('to4notice');
      queueLine('z4sense');
      queueLine('to4tray', () => setPhase('trayHold', ''));
      return true;
    }
    function holdPiece(k) {
      if (phase !== 'trayHold' || held.has(k)) return false;
      held.add(k);
      setPhase('trayHold', [...held].join(','));
      queueLine({ lersi: 'z4lersi', wess: 'z4wess', naga: 'z4naga' }[k]);
      queueLine({ lersi: 'to4lersi', wess: 'to4wess', naga: 'to4naga' }[k]);
      if (held.size >= PIECE_N) queueFn(() => theUnknown());
      return true;
    }
    function theUnknown() {
      queueGap(0.8);
      queueLine('to4unknown');
      queueLine('z4feel', () => { setPhase('decide'); after(SECS.z4feel + 0.4, () => openWhenClear(dayClock.t)); });
    }
    function openWhenClear(t0) {
      if (phase !== 'decide' || getState() !== 'play') return;
      if (kit && kit.getFade && kit.getFade() > 0.03 && dayClock.t - t0 < 6) { after(0.1, () => openWhenClear(t0)); return; }
      startDecision();
    }

    /* ------------------------------------------------------- between worlds
       Under the kit's black: the player put down in the next world, its light,
       a warm of everything (kit.warm — the curtain's own), then the black
       lifts (e3c3's toShrine shape) */
    function placeIn(w) {
      const p = w === 'H' ? HARRIVE : w === 'T' ? TARRIVE : { x: DATA.spawn.x, z: DATA.spawn.z };
      yaw.position.x = p.x; yaw.position.z = p.z;
      yaw.rotation.y = 0; pitch.rotation.x = -0.02;
      if (kit) { kit.daylight(w === 'H' ? H_DAY : w === 'T' ? T_DAY : null, 0); kit.pose('standing', { secs: 0.05 }); }
    }
    function toWorld(w, resumed, at) {
      const run = ++worldRun;
      if (kit) { kit.root(true); kit.presence(0); kit.fade(1, 0.01); }
      placeIn(w);
      setPhase(at || (w === 'H' ? 'han' : 'tray'), at === 'trayHold' ? [...held].join(',') : undefined);
      const warmed = kit && kit.warm ? kit.warm() : Promise.resolve(0);
      warmed.then(() => {
        if (!alive || run !== worldRun) return;
        if (!resumed) {
          if (w === 'H') { queueLine('z4han0', () => after(SECS.z4han0 * 0.6, () => { if (kit) kit.fade(0, 1.6); })); queueGap(0.6); queueLine('ow4hello'); queueLine('z4fine'); }
          else { queueLine('z4tray0', () => after(SECS.z4tray0 * 0.6, () => { if (kit) kit.fade(0, 1.6); })); queueGap(0.6); queueLine('to4hello'); }
          queueFn(() => { if (kit) kit.root(false); });
        } else if (kit) { kit.fade(0, 1.2); kit.root(false); }
      });
    }

    /* ------------------------------------------------------- the decision */
    const _ndc = new THREE.Vector3();
    const INTERACT_R = 2.4;
    const pile = new THREE.Group(); pile.position.copy(PILE_POS); world.add(pile);
    const pileLive = () => phase === 'decide' && worldOf(yaw.position.x) === 'T';
    function pileDist() { return Math.hypot(yaw.position.x - PILE_POS.x, yaw.position.z - PILE_POS.z); }
    function pileScreen() { camera.updateMatrixWorld(); return _ndc.set(PILE_POS.x, 1.0, PILE_POS.z).project(camera); }
    function pileInView() {
      if (!pileLive()) return false;
      const n = pileScreen();
      return n.z < 1 && Math.abs(n.x) < 1.1 && Math.abs(n.y) < 1.1;
    }
    function pointerHitsPile() { return pileLive() && pileDist() < INTERACT_R; }
    function interactPile() {
      if (!pileLive()) return false;
      startDecision();
      return true;
    }

    /* ------------------------------------------------------------- hotspots
       Anchors at EYE height on the thing itself (the v7.5 law); the looks are
       PRESSED, never timed (v21.9's pressAim) */
    const _tapRay = new THREE.Raycaster(), _tapPtr = new THREE.Vector2(), _tapHit = new THREE.Vector3();
    const tapBox = (x0, y0, z0, x1, y1, z1) => {
      const bb = new THREE.Box3(new THREE.Vector3(x0, y0, z0), new THREE.Vector3(x1, y1, z1));
      return (cx, cy) => {
        camera.updateMatrixWorld();
        _tapPtr.set((cx / innerWidth) * 2 - 1, -(cy / innerHeight) * 2 + 1);
        _tapRay.setFromCamera(_tapPtr, camera);
        return !!_tapRay.ray.intersectBox(bb, _tapHit);
      };
    };
    const hotspots = [
      { id: 'lkBottles', lookKey: 'bottles', pos: { x: YSHOP.x0 + 0.3, y: 1.3, z: -3.08 }, radius: 6, aim: 0.30, pressAim: true, once: true, markFar: 6, prompt: W.lookBottles,
        enabled: () => phase === 'yin' && quiet(), onInteract() { return lookAt('bottles'); } },
      { id: 'lkPhotos', lookKey: 'photos', pos: { x: YSHOP.x1 - 0.1, y: 1.7, z: -5.9 }, radius: 6, aim: 0.30, pressAim: true, once: true, markFar: 6, prompt: W.lookPhotos,
        enabled: () => phase === 'yin' && quiet(), onInteract() { return lookAt('photos'); } },
      { id: 'lkAltar', lookKey: 'altar', pos: { x: YALT.x, y: 1.15, z: YALT.z + 0.15 }, radius: 7, aim: 0.30, pressAim: true, once: true, markFar: 7, prompt: W.lookAltar,
        enabled: () => phase === 'yin' && quiet(), onInteract() { return lookAt('altar'); } },
      { id: 'keeper', pos: { x: KEEP.x, y: 1.35, z: KEEP.z }, radius: 2.6, prompt: W.hotKeeper, markY: 0.3,
        enabled: () => phase === 'yinKeeper' && quiet(), onInteract() { return keeperShows(); } },
      { id: 'locket', pos: { x: YBOX.x, y: YCNT.top + 0.1, z: YBOX.z }, radius: 2.2, prompt: W.hotLocket, markY: 0.2,
        enabled: () => phase === 'yinHold' && !yin.on && quiet(), onInteract() { return pickLocket(); } },
      { id: 'owner', pos: { x: HX + 3.98, y: 1.45, z: -2.45 }, radius: 2.7, prompt: W.hotOwner, markY: 0.3,
        enabled: () => phase === 'han' && quiet(), onInteract() { return ownerShows(); } },
      { id: 'hanuman', pos: { x: HX + 3.1, y: 1.2, z: -2.45 }, radius: 2.2, prompt: W.hotHanuman, markY: 0.2,
        enabled: () => phase === 'hanHold' && quiet(), onInteract() { return pickHanuman(); } },
      { id: 'stool', pos: { x: TSTOOL.x, y: 0.95, z: TSTOOL.z }, radius: 1.8, prompt: W.hotStool, markY: 0.15,
        enabled: () => phase === 'tray' && quiet(), onInteract() { return sitDown(); } },
      { id: 'pcLersi', pos: { x: TSTOOL.x - 0.3, y: TCNT.top + 0.1, z: TCNT.z + 0.15 }, radius: 2.0, prompt: W.hotLersi, markY: 0.15,
        enabled: () => phase === 'trayHold' && !held.has('lersi') && quiet(), onInteract() { return holdPiece('lersi'); } },
      { id: 'pcWess', pos: { x: TSTOOL.x, y: TCNT.top + 0.1, z: TCNT.z + 0.15 }, radius: 2.0, prompt: W.hotWess, markY: 0.15,
        enabled: () => phase === 'trayHold' && held.has('lersi') && !held.has('wess') && quiet(), onInteract() { return holdPiece('wess'); } },
      { id: 'pcNaga', pos: { x: TSTOOL.x + 0.3, y: TCNT.top + 0.1, z: TCNT.z + 0.15 }, radius: 2.0, prompt: W.hotNaga, markY: 0.15,
        enabled: () => phase === 'trayHold' && held.has('wess') && !held.has('naga') && quiet(), onInteract() { return holdPiece('naga'); } }
    ];

    /* ---------------------------------------------------------- per frame */
    function watchTick() {
      const x = yaw.position.x, z = yaw.position.z;
      if (phase === 'yinDone' && worldOf(x) === 'Y' && z > -0.2 && Math.abs(x) < 0.7 && quiet()) leaveYin();
    }
    const wallNow = () => performance.now() / 1000;
    let lastFrame = 0;
    function updateNotes(dt, t) {
      const now = wallNow();
      const wdt = lastFrame ? Math.min(0.5, now - lastFrame) : 0; lastFrame = now;
      yTick(wdt); peopleTick(wdt);
      const st = getState();
      yinTick(wdt); mixBedsY(wdt, st);
      const live = st === 'play' || st === 'unlock' || st === 'choose';
      if (!live) { lastWall = 0; return; }
      if (lastWall) dayClock.t += Math.min(0.5, now - lastWall);
      lastWall = now;
      if (!booted) {
        booted = true;
        applyPhase(kit ? kit.getPhase() : null);
      }
      runTodo(); runSpeak(); runQueue();
      if (st !== 'play') return;
      watchTick(); wrongTick();
    }
    function updatePile() {}
    function updateFire() {}
    function updateSlow() {}

    /* ------------------------------------------------------------ a resume
       A Continue lands on the order still open, in its world: a look spent is
       spent, a piece held is held; an experience is begun again from its
       pickup (never resumed half-way). */
    function applyPhase(p) {
      const tag = String(p || '').split(':');
      p = tag[0];
      if (!PHASES.includes(p)) p = 'yin';
      const at = PHASES.indexOf(p);
      if (at >= PHASES.indexOf('tray')) {
        if (p === 'trayHold' && tag[1]) for (const k of tag[1].split(',')) if (['lersi', 'wess', 'naga'].includes(k)) held.add(k);
        if (p === 'decide') { held.add('lersi'); held.add('wess'); held.add('naga'); }
        toWorld('T', true, p === 'decide' ? 'trayHold' : p);
        if (p === 'decide' || held.size >= PIECE_N) queueFn(() => theUnknown());
        return;
      }
      if (at >= PHASES.indexOf('han')) { toWorld('H', true, p); return; }
      if (p === 'yin' && tag[1]) for (const k of tag[1].split(',')) if (['bottles', 'photos', 'altar'].includes(k)) looked.add(k);
      for (const h of hotspots) if (h.lookKey && looked.has(h.lookKey)) h.done = true;
      if (p === 'yin' && looked.size >= LOOK_N) p = 'yinKeeper';
      /* the experience is begun again from its pickup (yinHold: the box open, the locket in it); after it, the box
         stays open, the tape stopped, and the door waits */
      if (p === 'yinHold' || p === 'yinDone') { if (yLive.box) { yLive.box.open = 1; yLive.box.lid.rotation.z = -1.9; } }
      if (p === 'yinDone') { yin.stopped = true; yin.clicked = true; yin.rate = 0.02; }
      setPhase(p, p === 'yin' && looked.size ? [...looked].join(',') : undefined);
      if (p === 'yinDone' && kit && kit.waypoint) kit.waypoint({ x: 0, y: 1.3, z: 0.1 });
    }

    /* ---------------------------------------------------------- lifecycle */
    function snap() { return { phase }; }
    function restore() {}
    function reset() {
      dropTodo(); speakReset(); lineQ.length = 0; heard.clear();
      booted = false; dayClock.t = 0; lastWall = 0;
      looked.clear(); held.clear();
      worldRun++;
      yinReset();
      for (const h of hotspots) { h.done = false; h.dwellT = 0; }
      if (kit) {
        kit.root(false); kit.pose('standing', { secs: 0.05 });
        if (kit.pray) kit.pray(false, { secs: 0 });
        if (kit.hands) kit.hands(0, { secs: 0 });
        kit.presence(0);
        kit.daylight(null, 0);
        kit.setPhase('yin');
      }
      phase = 'yin';
    }
    function lateSolid(o) {
      if (!S || !S.blockers) { solids.push(o); return; }
      o.updateWorldMatrix(true, false);
      const bb = new THREE.Box3().setFromObject(o); bb.expandByScalar(0.14); bb.min.y = 0; bb.max.y = Math.max(bb.max.y, 1.40);
      S.blockers.push(bb);
    }
    function blockers() {
      const out = [];
      const b = (o, pad = 0.20) => { o.updateWorldMatrix(true, false); const bb = new THREE.Box3().setFromObject(o); bb.expandByScalar(pad); out.push(bb); };
      const solid = (o, pad = 0.14) => { o.updateWorldMatrix(true, false); const bb = new THREE.Box3().setFromObject(o); bb.expandByScalar(pad); bb.min.y = 0; bb.max.y = Math.max(bb.max.y, 1.40); out.push(bb); };
      for (const w of walls) b(w);
      for (const s of solids) solid(s);
      return out;
    }
    function dispose() {
      alive = false;
      for (const g of treeStands) g && g.userData.disposeTrees?.();
      treeStands.length = 0;
      const geos = new Set(), ms = new Set();
      world.traverse(o => {
        if (o.geometry) geos.add(o.geometry);
        if (o.material) for (const m of (Array.isArray(o.material) ? o.material : [o.material])) ms.add(m);
      });
      scene.remove(world);
      for (const o of owned) { if (o.parent) o.parent.remove(o); o.dispose?.(); }
      owned.length = 0;
      for (const g of geos) g.dispose();
      for (const m of ms) {
        for (const k of ['map', 'roughnessMap', 'normalMap', 'emissiveMap', 'alphaMap']) m[k]?.dispose?.();
        m.dispose();
      }
      for (const m of mats) m.dispose();
      for (const t of madeTex) t?.dispose?.();
      world.clear();
      S = null;
    }

    return (S = {
      world, blockers: blockers(),
      ready: () => true,
      pile: { pos: PILE_POS, radius: INTERACT_R, group: pile,
              dist: pileDist, screen: pileScreen, inView: pileInView,
              hits: pointerHitsPile, interact: interactPile,
              glow: () => 0 },
      drum: null, ash: null, embers: null, heroNote: null, smoke: null, flying: null,
      jossTips: [], fireLight: null,
      get noteStorm() { return 1; },
      set noteStorm(v) {},
      film: { HX, TX, YSHOP, HSHOP, TSHOP, HARRIVE, TARRIVE },
      pileVia: { what: 'the tray shop\'s counter (two films carry him there)', x: TSTOOL.x, z: TSTOOL.z },
      arrivals: [{ what: 'the Hanuman shop (the merit film puts him at its door)', x: HARRIVE.x, z: HARRIVE.z },
                 { what: 'the tray shop (the run-out film puts him inside its door)', x: TARRIVE.x, z: TARRIVE.z }],
      get phase() { return phase; },
      setPhase, applyPhase, after, dayClock, sayLine,
      info: () => ({ phase, t: +dayClock.t.toFixed(2), queued: lineQ.length, heard: [...heard], looked: [...looked], held: [...held],
                     until: +speak.until.toFixed(2), pending: speak.pending ? speak.pending.name : null, world: worldOf(yaw.position.x),
                     yin: { on: yin.on, cold: +yin.cold.toFixed(2), numb: +yin.numb.toFixed(2), rate: +yin.rate.toFixed(3), stopped: yin.stopped,
                            girl: { placed: yin.girl.placed, a: +yin.girl.a.toFixed(2), shows: yin.girl.shows, side: yin.girl.side },
                            beds: DATA.ambience.beds.map(b => b.map(v => typeof v === 'number' ? +v.toFixed(3) : v)), wrong: wrongI } }),
      hotspots,
      updateNotes, updatePile, updateFire, updateSlow,
      snap, restore, reset, dispose
    });
  }

  /* ============================================================ WORLD Y's SURFACES
     Drawn on canvases (CSP-safe, nothing downloaded): the Yin shop is old, stained and red; the corridor outside it
     an old mall's dead top floor. The words on its signs are world art, not the sheet's (the jetty sign's precedent,
     v14.5): a shop is called what its board says. */
  function yRng(seed) { let s = seed >>> 0 || 1; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
  function yDone(THREE, c, rep) {
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
    if (rep) { t.wrapS = t.wrapT = THREE.RepeatWrapping; }
    return t;
  }
  function ySized(cnv, W, H) { const [c, x] = cnv(W); c.height = H; return [c, x]; }
  /* a blob drawn nine times, so a stain that crosses an edge comes back on the far side (a tile that wraps) */
  function yBlob(x, S, px, py, rad, col) {
    for (const ox of [-S, 0, S]) for (const oy of [-S, 0, S]) {
      const cx = px + ox, cy = py + oy;
      if (cx + rad < 0 || cy + rad < 0 || cx - rad > S || cy - rad > S) continue;
      const g = x.createRadialGradient(cx, cy, 0, cx, cy, rad); g.addColorStop(0, col); g.addColorStop(1, 'rgba(0,0,0,0)');
      x.fillStyle = g; x.fillRect(cx - rad, cy - rad, rad * 2, rad * 2);
    }
  }
  function yGrain(x, W, H, amt, r) {
    const img = x.getImageData(0, 0, W, H), d = img.data;
    for (let i = 0; i < d.length; i += 4) { const n = (r() - 0.5) * amt; d[i] += n; d[i + 1] += n; d[i + 2] += n; }
    x.putImageData(img, 0, 0);
  }
  /* Khom-style letters, as e3c1 draws them (v19.1): strokes in a 10 x 10 box, y down */
  const YKHOM = [
    'M2.3 7.6m-0.9 0a0.9 0.9 0 1 0 1.8 0a0.9 0.9 0 1 0-1.8 0M3.2 7.6V3.6Q3.2 2.2 4.6 2.2Q6 2.2 6 3.6V8.4M6 3.6Q6 2.2 7.3 2.2Q8.6 2.2 8.6 3.6V8.2Q8.6 9.2 9.4 8.8',
    'M3 3.3m-0.9 0a0.9 0.9 0 1 1 1.8 0a0.9 0.9 0 1 1-1.8 0M2.1 3.6Q2.4 8.4 5.2 8.4Q8 8.4 8 5.2V2.4Q8 1.4 9 1.8',
    'M2.6 7.4m-0.8 0a0.8 0.8 0 1 0 1.6 0a0.8 0.8 0 1 0-1.6 0M3.4 7.4V2.6M3.4 7.6Q5 9.2 6.6 7.4Q7.8 6 7.8 2.6V8.6',
    'M3.4 4.4m-0.8 0a0.8 0.8 0 1 1 1.6 0a0.8 0.8 0 1 1-1.6 0M2.6 4.6Q2.6 8.4 5.4 8.4Q8.2 8.4 8.2 5.4Q8.2 2 5.4 2Q3.6 2 3.4 3.6',
    'M2.8 3.2m-0.8 0a0.8 0.8 0 1 1 1.6 0a0.8 0.8 0 1 1-1.6 0M3.6 3.4Q3.4 5.2 2.6 5.6Q2.2 8.4 5.2 8.4Q8 8.4 8 5.4V2.2',
    'M2.4 2.6Q5 1.4 7.6 2.6Q4.6 3.6 4.4 5.4Q4.4 6.6 6 6.6Q7.4 6.8 6.6 8.6Q6 9.4 4.6 9',
    'M2.6 7.4m-0.8 0a0.8 0.8 0 1 0 1.6 0a0.8 0.8 0 1 0-1.6 0M3.4 7.4V3.8Q3.4 2.2 5 2.2Q6.6 2.2 6.6 3.8V7.6Q6.6 8.6 7.6 8.4Q8.6 8.2 8.4 6.8Q8.2 6 7.6 6.4',
    'M5 3.6m-1 0a1 1 0 1 1 2 0a1 1 0 1 1-2 0M5 7.2m-1 0a1 1 0 1 1 2 0a1 1 0 1 1-2 0',
    'M2.2 6.2Q3.4 2.8 5.2 4.8Q6.4 6.4 7.4 3.6Q7.8 2.4 8.8 2.8',
    'M2.6 7.4m-0.8 0a0.8 0.8 0 1 0 1.6 0a0.8 0.8 0 1 0-1.6 0M3.4 7.4V2.6M3.4 7.6Q5 9.2 6.6 7.4V2.4Q6.6 1.6 7.6 1.8L8.8 1.2',
    'M2.6 3.4m-0.8 0a0.8 0.8 0 1 1 1.6 0a0.8 0.8 0 1 1-1.6 0M3.4 3.4V7.4Q3.4 8.4 4.6 8Q6 7.4 6 5.6V7.6Q6 8.6 7.4 8.4Q8.4 8 8.4 2.4',
    'M2.4 2.4V7.2Q2.4 8.4 3.6 8L5 5.4L6.4 8Q7.6 8.4 7.6 7.2V2.4M7.6 2.4m-0.8 0a0.8 0.8 0 1 1 1.6 0a0.8 0.8 0 1 1-1.6 0',
    'M2.6 3m-0.8 0a0.8 0.8 0 1 1 1.6 0a0.8 0.8 0 1 1-1.6 0M3.4 3.2Q3.6 5 2.8 5.4Q2.4 8.4 4.2 8.4Q5.6 8.4 5.6 6.4V3.4Q5.6 2.2 7 2.2Q8.4 2.2 8.4 3.6V8.6',
    'M2.6 7.2m-0.8 0a0.8 0.8 0 1 0 1.6 0a0.8 0.8 0 1 0-1.6 0M3.4 7.2V3.8Q3.4 2.2 5.4 2.2Q7.6 2.2 7.6 4.4V8.4Q7.6 9.6 6.4 9.8',
    'M3 4Q3 2 5 2Q7.6 2 7.6 4.8Q7.6 8.4 5 8.4Q3 8.4 3 6.6Q3 5.6 4.2 5.6Q5.2 5.8 5 6.8',
    'M3.2 4.6m-0.8 0a0.8 0.8 0 1 1 1.6 0a0.8 0.8 0 1 1-1.6 0M4 4.6Q5.6 5 6.4 4Q7.8 2.4 7 1.8M6.4 4Q7.4 6.6 6.4 8.4Q5.6 9.2 4.4 8.6'
  ];
  let yKhomP = null;
  function yKhom(x, cx, cy, size, n, rot = 0) {
    if (!yKhomP) yKhomP = YKHOM.map(d => new Path2D(d));
    const j1 = ((Math.abs(n) * 37) % 11 - 5) / 5, j2 = ((Math.abs(n) * 53) % 7 - 3) / 3;
    const k = size / 10 * (1 + j2 * 0.07);
    x.save(); x.translate(cx, cy); x.rotate(rot + j1 * 0.09); x.scale(k, k); x.translate(-5, -5);
    x.lineWidth = 1.15; x.lineCap = 'round'; x.lineJoin = 'round';
    x.stroke(yKhomP[Math.abs(n) % YKHOM.length]);
    x.restore();
  }
  function yKhomRow(x, x0, x1, y, size, seed) {
    const n = Math.max(1, Math.floor((x1 - x0) / (size * 0.92))), step = (x1 - x0) / n;
    for (let i = 0; i < n; i++) yKhom(x, x0 + step * (i + 0.5), y, size, seed + i * 5);
  }
  /* an unalome: a curl at its root, switchbacks narrowing, then the straight line (e3c1's, v19.1) */
  function yUnalome(x, bx, by, h, w) {
    x.save(); x.translate(bx, by); x.scale(1, -1); x.lineCap = 'round'; x.lineJoin = 'round';
    const r0 = w * 0.32; x.beginPath();
    for (let i = 0; i <= 40; i++) { const t = i / 40, a = -Math.PI / 2 + t * Math.PI * 2 * 1.6, rr = r0 * (0.25 + 0.75 * t); const px = Math.cos(a) * rr, py = r0 + Math.sin(a) * rr; i ? x.lineTo(px, py) : x.moveTo(px, py); }
    let y = r0 * 2.1;
    for (let i = 0; i < 5; i++) { const a = (w / 2) * (1 - i / 6), dy = w * 0.36 * (1 - i * 0.08), sx = i % 2 ? -1 : 1;
      x.quadraticCurveTo(sx * a * 1.25, y + dy * 0.2, sx * a * 0.2, y + dy * 0.75); x.quadraticCurveTo(-sx * a * 0.6, y + dy * 0.95, 0, y + dy); y += dy; }
    x.lineTo(0, Math.max(y + w * 0.3, h)); x.stroke(); x.restore();
  }

  /* the floor: 300 mm glazed tiles in oxblood and brown, worn dull, the grout gone dark; one texture is 1.2 m */
  function makeYinFloor(THREE, cnv) {
    const S = 512, [c, x] = cnv(S), r = yRng(41), n = 4, T = S / n;
    const tones = [[104, 50, 38], [92, 46, 34], [114, 60, 44], [84, 44, 34]];
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
      const b = tones[(i * 3 + j * 5 + ((i + j) % 2) * 2) % tones.length], v = (r() - 0.5) * 14;
      x.fillStyle = `rgb(${b[0] + v | 0},${b[1] + v * 0.6 | 0},${b[2] + v * 0.5 | 0})`; x.fillRect(i * T, j * T, T, T);
      for (let k = 0; k < 70; k++) {
        x.fillStyle = `rgba(${r() < 0.55 ? '36,18,12' : '168,108,78'},${0.03 + r() * 0.06})`;
        x.beginPath(); x.ellipse(i * T + r() * T, j * T + r() * T, 2 + r() * 12, 2 + r() * 9, r() * 3, 0, Math.PI * 2); x.fill();
      }
      const g = x.createLinearGradient(i * T, j * T, i * T + T, j * T + T);
      g.addColorStop(0, 'rgba(255,214,190,0.06)'); g.addColorStop(0.45, 'rgba(255,214,190,0)'); g.addColorStop(1, 'rgba(0,0,0,0.08)');
      x.fillStyle = g; x.fillRect(i * T, j * T, T, T);
      // a chipped corner on some
      if (r() < 0.3) { x.fillStyle = 'rgba(60,40,30,0.8)'; x.beginPath(); const cx = i * T + (r() < 0.5 ? 3 : T - 3), cy = j * T + (r() < 0.5 ? 3 : T - 3); x.moveTo(cx, cy); x.lineTo(cx + (cx > i * T + T / 2 ? -9 : 9), cy); x.lineTo(cx, cy + (cy > j * T + T / 2 ? -7 : 7)); x.fill(); }
    }
    x.strokeStyle = 'rgba(22,12,8,0.6)'; x.lineWidth = 1.2;
    for (const [ti, tj] of [[1, 2], [3, 0], [2, 3]]) { x.beginPath(); let px = ti * T + 10 + r() * (T - 20), py = tj * T + 2; x.moveTo(px, py); for (let q = 0; q < 6; q++) { px += (r() - 0.5) * 26; py += T / 6.2; x.lineTo(px, py); } x.stroke(); }
    x.fillStyle = '#251812'; for (let k = 0; k <= n; k++) { x.fillRect(k * T - 2, 0, 4, S); x.fillRect(0, k * T - 2, S, 4); }
    yBlob(x, S, S * 0.72, S * 0.3, 160, 'rgba(26,14,10,0.20)');
    yBlob(x, S, S * 0.2, S * 0.8, 120, 'rgba(26,14,10,0.14)');
    return yDone(THREE, c, true);
  }
  /* the plaster: cream gone tea-coloured, damp creeping down from the ceiling, hairline cracks; one texture is 2.2 m */
  function makeYinPlaster(THREE, cnv) {
    const S = 512, [c, x] = cnv(S), r = yRng(43);
    x.fillStyle = '#cab59a'; x.fillRect(0, 0, S, S);
    for (let i = 0; i < 70; i++) yBlob(x, S, r() * S, r() * S, 18 + r() * 90, `rgba(${r() < 0.55 ? '118,94,68' : '220,206,182'},${0.07 + r() * 0.1})`);
    // damp running down: tide lines that end in a darker edge
    for (let i = 0; i < 7; i++) {
      const px = r() * S, w = 18 + r() * 70, h = 90 + r() * 280, py = r() * S;
      for (const ox of [-S, 0, S]) for (const oy of [-S, 0, S]) {
        if (px + ox > S || px + ox + w < 0 || py + oy > S || py + oy + h < 0) continue;
        const g = x.createLinearGradient(0, py + oy, 0, py + oy + h);
        g.addColorStop(0, 'rgba(104,80,52,0)'); g.addColorStop(0.75, 'rgba(104,80,52,0.15)'); g.addColorStop(0.96, 'rgba(84,60,38,0.3)'); g.addColorStop(1, 'rgba(84,60,38,0)');
        x.fillStyle = g; x.fillRect(px + ox, py + oy, w, h);
      }
    }
    yGrain(x, S, S, 14, r);
    x.strokeStyle = 'rgba(70,52,36,0.35)'; x.lineWidth = 1;
    for (let i = 0; i < 6; i++) { x.beginPath(); let px = 20 + r() * (S - 40), py = 20 + r() * (S - 40); x.moveTo(px, py); for (let q = 0; q < 7; q++) { px += (r() - 0.5) * 36; py += (r() - 0.3) * 28; x.lineTo(px, py); } x.stroke(); }
    return yDone(THREE, c, true);
  }
  /* old varnished wood: the grain along the board (u), periodic so it wraps */
  function makeYinWood(THREE, cnv) {
    const S = 512, [c, x] = cnv(S), r = yRng(47), TAU = Math.PI * 2;
    x.fillStyle = '#9a6a48'; x.fillRect(0, 0, S, S);
    for (let i = 0; i < 170; i++) {
      const y0 = r() * S, a = 0.05 + r() * 0.13, dark = r() < 0.62, f1 = 1 + (i % 3), f2 = 3 + (i % 4), p1 = r() * TAU, p2 = r() * TAU;
      x.strokeStyle = dark ? `rgba(58,28,14,${a})` : `rgba(196,146,104,${a * 0.7})`; x.lineWidth = 1 + r() * 3;
      for (const oy of [-S, 0, S]) {
        x.beginPath();
        for (let px = 0; px <= S; px += 8) { const py = y0 + oy + Math.sin(px / S * TAU * f1 + p1) * 7 + Math.sin(px / S * TAU * f2 + p2) * 2.5; px ? x.lineTo(px, py) : x.moveTo(px, py); }
        x.stroke();
      }
    }
    for (let k = 0; k < 3; k++) { const kx = r() * S, ky = r() * S; for (let q = 6; q > 0; q--) { x.strokeStyle = `rgba(60,30,14,${0.08 + q * 0.02})`; x.lineWidth = 1.5; x.beginPath(); x.ellipse(kx, ky, q * 5, q * 2.2, 0, 0, Math.PI * 2); x.stroke(); } }
    yGrain(x, S, S, 10, r);
    return yDone(THREE, c, true);
  }
  /* the shop's ceiling: 600 mm boards in a T-bar grid, yellowed, rings of old leaks; one texture is 2.4 m */
  function makeYinCeil(THREE, cnv) {
    const S = 512, [c, x] = cnv(S), r = yRng(53), n = 4, T = S / n;
    x.fillStyle = '#ddd2bc'; x.fillRect(0, 0, S, S);
    for (let i = 0; i < 2600; i++) { x.fillStyle = `rgba(110,100,84,${0.04 + r() * 0.1})`; x.fillRect(r() * S, r() * S, 1 + r() * 2, 1); }
    for (const [ti, tj] of [[0, 1], [2, 3], [3, 1]]) {
      const cx = ti * T + T * (0.3 + r() * 0.4), cy = tj * T + T * (0.3 + r() * 0.4);
      for (let q = 0; q < 3; q++) { x.strokeStyle = `rgba(120,86,46,${0.22 - q * 0.05})`; x.lineWidth = 3 - q; x.beginPath(); x.ellipse(cx, cy, 22 + q * 13, 16 + q * 10, r(), 0, Math.PI * 2); x.stroke(); }
      yBlob(x, S, cx, cy, 34, 'rgba(140,104,60,0.22)');
    }
    x.fillStyle = '#8a8478'; for (let k = 0; k <= n; k++) { x.fillRect(k * T - 3, 0, 6, S); x.fillRect(0, k * T - 3, S, 6); }
    return yDone(THREE, c, true);
  }
  /* old red cloth: a deep red weave, worn paler along its folds */
  function makeYinRedCloth(THREE, cnv) {
    const S = 512, [c, x] = cnv(S), r = yRng(59);
    x.fillStyle = '#8c1a14'; x.fillRect(0, 0, S, S);
    for (let y = 0; y < S; y += 2) { x.fillStyle = `rgba(0,0,0,${0.05 + r() * 0.05})`; x.fillRect(0, y, S, 1); }
    for (let xx = 0; xx < S; xx += 2) { x.fillStyle = `rgba(255,120,100,${0.02 + r() * 0.03})`; x.fillRect(xx, 0, 1, S); }
    for (let i = 0; i < 9; i++) { const px = r() * S; const g = x.createLinearGradient(px - 30, 0, px + 30, 0); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(0.5, `rgba(${r() < 0.5 ? '255,140,120,0.08' : '20,0,0,0.16'})`); g.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = g; x.fillRect(px - 30, 0, 60, S); }
    for (let i = 0; i < 30; i++) yBlob(x, S, r() * S, r() * S, 20 + r() * 50, `rgba(40,4,2,${0.04 + r() * 0.06})`);
    return yDone(THREE, c, true);
  }
  /* a cloth yant: black ink and red on unbleached cloth, its border red. seed 3 — the square of script cells under
     three unalomes; seed 7 — the round one, letters running round its rings */
  function makeYinYant(THREE, cnv, seed) {
    const [c, x] = ySized(cnv, 384, 512), r = yRng(seed * 97);
    x.fillStyle = '#e4d6b4'; x.fillRect(0, 0, 384, 512);
    for (let i = 0; i < 40; i++) yBlob(x, 384, r() * 384, r() * 512, 20 + r() * 60, `rgba(150,110,60,${0.05 + r() * 0.07})`);
    x.strokeStyle = '#a8241c'; x.lineWidth = 7; x.strokeRect(14, 14, 356, 484); x.lineWidth = 2; x.strokeRect(26, 26, 332, 460);
    x.strokeStyle = '#1c1410'; x.fillStyle = '#1c1410';
    if (seed % 2) {
      const cx = 192, top = 150, cell = 52, cols = 5, rows = 5, x0 = cx - cols * cell / 2;
      x.lineWidth = 2.4;
      for (let i = 0; i <= cols; i++) { x.beginPath(); x.moveTo(x0 + i * cell, top); x.lineTo(x0 + i * cell, top + rows * cell); x.stroke(); }
      for (let j = 0; j <= rows; j++) { x.beginPath(); x.moveTo(x0, top + j * cell); x.lineTo(x0 + cols * cell, top + j * cell); x.stroke(); }
      x.beginPath(); x.moveTo(x0, top); x.lineTo(x0 + cols * cell, top + rows * cell); x.moveTo(x0 + cols * cell, top); x.lineTo(x0, top + rows * cell); x.stroke();
      x.lineWidth = 1.6;
      for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) { x.lineWidth = 1.5; yKhom(x, x0 + (i + 0.5) * cell, top + (j + 0.5) * cell, cell * 0.62, seed * 11 + i * 3 + j * 7); }
      x.lineWidth = 3;
      for (const [ux, uh] of [[cx - 80, 70], [cx, 100], [cx + 80, 70]]) yUnalome(x, ux, top - 4, uh, 30);
      x.lineWidth = 1.6; yKhomRow(x, 50, 334, top + rows * cell + 34, 26, seed * 5); yKhomRow(x, 70, 314, top + rows * cell + 70, 24, seed * 9);
      x.lineWidth = 2; x.strokeStyle = '#a8241c'; x.beginPath(); x.arc(cx, 452, 16, 0, Math.PI * 2); x.stroke(); yKhom(x, cx, 452, 20, seed);
    } else {
      const cx = 192, cy = 280;
      x.lineWidth = 2.6;
      for (const R of [150, 116, 82]) { x.beginPath(); x.arc(cx, cy, R, 0, Math.PI * 2); x.stroke(); }
      x.lineWidth = 1.5;
      for (const [R0, n0, sz] of [[133, 24, 20], [99, 16, 18]]) for (let i = 0; i < n0; i++) { const a = i / n0 * Math.PI * 2; yKhom(x, cx + Math.cos(a) * R0, cy + Math.sin(a) * R0, sz, seed * 13 + i * 3, a + Math.PI / 2); }
      x.lineWidth = 2.2;
      for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2; x.beginPath(); x.moveTo(cx + Math.cos(a) * 30, cy + Math.sin(a) * 30); x.quadraticCurveTo(cx + Math.cos(a + 0.4) * 70, cy + Math.sin(a + 0.4) * 70, cx + Math.cos(a) * 82, cy + Math.sin(a) * 82); x.quadraticCurveTo(cx + Math.cos(a - 0.4) * 70, cy + Math.sin(a - 0.4) * 70, cx + Math.cos(a) * 30, cy + Math.sin(a) * 30); x.stroke(); }
      x.strokeStyle = '#a8241c'; x.lineWidth = 2.4; x.beginPath(); x.arc(cx, cy, 26, 0, Math.PI * 2); x.stroke(); x.lineWidth = 1.6; yKhom(x, cx, cy, 30, seed * 3);
      x.strokeStyle = '#1c1410'; x.lineWidth = 3; yUnalome(x, cx, cy - 152, 100, 34);
      x.lineWidth = 1.6; yKhomRow(x, 50, 334, 466, 24, seed * 7);
    }
    // the gold leaf pressed on by the devout, and the cloth's age
    for (let i = 0; i < 4; i++) { x.fillStyle = `rgba(214,170,70,${0.5 + r() * 0.3})`; x.beginPath(); x.ellipse(100 + r() * 184, 140 + r() * 260, 8 + r() * 10, 6 + r() * 8, r() * 3, 0, Math.PI * 2); x.fill(); }
    yGrain(x, 384, 512, 18, r);
    return yDone(THREE, c, false);
  }
  /* the back room's curtain: an old floral print, maroon ground, cream and olive blooms, sun-faded */
  function makeYinCurtain(THREE, cnv) {
    const S = 512, [c, x] = cnv(S), r = yRng(61);
    x.fillStyle = '#5a1e1c'; x.fillRect(0, 0, S, S);
    const bloom = (px, py, R) => {
      for (const ox of [-S, 0, S]) for (const oy of [-S, 0, S]) {
        const cx = px + ox, cy = py + oy; if (cx + R * 2 < 0 || cy + R * 2 < 0 || cx - R * 2 > S || cy - R * 2 > S) continue;
        x.fillStyle = 'rgba(96,104,52,0.75)';
        for (let k = 0; k < 3; k++) { const a = r() * Math.PI * 2; x.beginPath(); x.ellipse(cx + Math.cos(a) * R * 1.3, cy + Math.sin(a) * R * 1.3, R * 0.75, R * 0.3, a, 0, Math.PI * 2); x.fill(); }
        for (let k = 0; k < 6; k++) { const a = k / 6 * Math.PI * 2; x.fillStyle = k % 2 ? 'rgba(228,206,170,0.92)' : 'rgba(206,176,140,0.92)'; x.beginPath(); x.ellipse(cx + Math.cos(a) * R * 0.55, cy + Math.sin(a) * R * 0.55, R * 0.55, R * 0.32, a, 0, Math.PI * 2); x.fill(); }
        x.fillStyle = 'rgba(170,96,40,0.9)'; x.beginPath(); x.arc(cx, cy, R * 0.22, 0, Math.PI * 2); x.fill();
      }
    };
    for (let i = 0; i < 7; i++) bloom(r() * S, r() * S, 26 + r() * 22);
    for (let i = 0; i < 18; i++) bloom(r() * S, r() * S, 8 + r() * 6);
    const g = x.createLinearGradient(0, 0, S, 0); g.addColorStop(0, 'rgba(255,230,200,0.10)'); g.addColorStop(0.5, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(255,230,200,0.10)');
    x.fillStyle = g; x.fillRect(0, 0, S, S);
    yGrain(x, S, S, 16, r);
    return yDone(THREE, c, true);
  }
  /* old lace: a fine net, rows of small flowers, a scalloped hem (transparent between the threads); one texture is the
     panel — 2.5 mm a pixel, the net's mesh 2 cm */
  function makeYinLace(THREE, cnv) {
    const S = 512, [c, x] = cnv(S), r = yRng(63);
    x.clearRect(0, 0, S, S);
    x.strokeStyle = 'rgba(255,255,255,0.55)'; x.lineWidth = 1;
    for (let i = -S; i < S * 2; i += 8) { x.beginPath(); x.moveTo(i, 0); x.lineTo(i + S, S); x.stroke(); x.beginPath(); x.moveTo(i, S); x.lineTo(i + S, 0); x.stroke(); }
    for (let row = 0; row < 5; row++) for (let i = 0; i < 9; i++) {
      const cx = 30 + i * 56 + (row % 2) * 28, cy = 70 + row * 84;
      x.fillStyle = 'rgba(255,255,255,0.85)';
      for (let k = 0; k < 5; k++) { const a = k / 5 * Math.PI * 2 + row; x.beginPath(); x.ellipse(cx + Math.cos(a) * 6, cy + Math.sin(a) * 6, 5.5, 3.6, a, 0, Math.PI * 2); x.fill(); }
      x.fillStyle = 'rgba(0,0,0,1)'; x.globalCompositeOperation = 'destination-out'; x.beginPath(); x.arc(cx, cy, 2.2, 0, Math.PI * 2); x.fill(); x.globalCompositeOperation = 'source-over';
      x.strokeStyle = 'rgba(255,255,255,0.7)'; x.lineWidth = 1.2; x.beginPath(); x.moveTo(cx + 9, cy + 3); x.quadraticCurveTo(cx + 20, cy + 14, cx + 28, cy + 6); x.stroke();
    }
    x.globalCompositeOperation = 'destination-out';
    for (let i = 0; i < 16; i++) { x.beginPath(); x.arc(16 + i * 32, S + 8, 18, 0, Math.PI * 2); x.fill(); }
    x.globalCompositeOperation = 'source-over';
    x.fillStyle = 'rgba(255,255,255,0.9)'; x.fillRect(0, 0, S, 7);
    for (let i = 0; i < 16; i++) { x.strokeStyle = 'rgba(255,255,255,0.8)'; x.lineWidth = 2; x.beginPath(); x.arc(16 + i * 32, S + 8, 20, Math.PI * 1.05, Math.PI * 1.95); x.stroke(); }
    return yDone(THREE, c, false);
  }
  /* a roller shutter: steel slats, rust running down from the lock and the guide rails */
  function makeYinShutter(THREE, cnv) {
    const S = 256, [c, x] = cnv(S), r = yRng(67);
    for (let y = 0; y < S; y += 16) {
      const g = x.createLinearGradient(0, y, 0, y + 16);
      g.addColorStop(0, '#8e9498'); g.addColorStop(0.45, '#bcc1c4'); g.addColorStop(0.55, '#70767a'); g.addColorStop(1, '#4e5256');
      x.fillStyle = g; x.fillRect(0, y, S, 16);
    }
    for (let i = 0; i < 46; i++) { x.fillStyle = `rgba(116,60,26,${0.05 + r() * 0.14})`; x.fillRect(r() * S, r() * S, 2 + r() * 3, 12 + r() * 60); }
    for (let i = 0; i < 20; i++) yBlob(x, S, r() * S, r() * S, 10 + r() * 30, `rgba(40,36,30,${0.06 + r() * 0.08})`);
    return yDone(THREE, c, true);
  }
  /* the corridor's terrazzo, older and dirtier than chapter 3's: grey-cream, chips, a brass strip; one texture is 2.5 m */
  function makeYinTerrazzo(THREE, cnv) {
    const S = 512, [c, x] = cnv(S), r = yRng(71);
    x.fillStyle = '#a69e90'; x.fillRect(0, 0, S, S);
    const cols = ['#8a8478', '#6e4a3a', '#4a4640', '#c8c0b2', '#9a9080', '#8a5a40'];
    for (let i = 0; i < 9000; i++) { x.fillStyle = cols[(r() * cols.length) | 0]; x.globalAlpha = 0.22 + r() * 0.4; const w = 0.6 + r() * 2.6, h = 0.6 + r() * 2.2; x.beginPath(); x.ellipse(r() * S, r() * S, w, h, r() * 3, 0, Math.PI * 2); x.fill(); }
    x.globalAlpha = 1;
    for (let i = 0; i < 16; i++) yBlob(x, S, r() * S, r() * S, 40 + r() * 100, `rgba(60,52,40,${0.05 + r() * 0.08})`);
    x.fillStyle = '#8c7244'; x.fillRect(0, 0, S, 3); x.fillRect(0, 0, 3, S);
    return yDone(THREE, c, true);
  }
  /* the corridor's T-bar ceiling: grey tiles, some stained, one in nine gone (black above); one texture is 2.4 m */
  function makeYinCeilC(THREE, cnv) {
    const S = 512, [c, x] = cnv(S), r = yRng(73), n = 4, T = S / n;
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
      const v = 200 + (r() - 0.5) * 16 | 0;
      x.fillStyle = (i === 2 && j === 1) ? '#0c0a09' : `rgb(${v},${v - 4},${v - 12})`; x.fillRect(i * T, j * T, T, T);
      if (!(i === 2 && j === 1)) { for (let k = 0; k < 160; k++) { x.fillStyle = `rgba(100,94,84,${0.05 + r() * 0.1})`; x.fillRect(i * T + r() * T, j * T + r() * T, 1 + r() * 2, 1); }
        if (r() < 0.3) yBlob(x, S, i * T + T / 2, j * T + T / 2, 40, 'rgba(120,90,50,0.22)'); }
    }
    x.fillStyle = '#7a766e'; for (let k = 0; k <= n; k++) { x.fillRect(k * T - 3, 0, 6, S); x.fillRect(0, k * T - 3, S, 6); }
    return yDone(THREE, c, true);
  }
  /* the words painted on her glass in old gold, read from the corridor: Thai, Chinese, English, half of it flaked */
  function makeYinGlassWords(THREE, cnv) {
    const [c, x] = ySized(cnv, 1024, 342), r = yRng(79);
    x.clearRect(0, 0, 1024, 342);
    const gold = x.createLinearGradient(0, 0, 0, 342); gold.addColorStop(0, '#e8c070'); gold.addColorStop(0.5, '#b88a36'); gold.addColorStop(1, '#8a6224');
    x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = gold;
    x.font = 'bold 82px sans-serif'; x.fillText('พระเครื่อง · ของเก่า', 512, 78);
    x.font = 'bold 62px serif'; x.fillText('佛 牌 · 古 物', 512, 178);
    x.font = 'bold 50px serif'; x.fillText('AMULETS · CURIOS', 512, 270);
    x.globalCompositeOperation = 'destination-out';
    for (let i = 0; i < 260; i++) { x.fillStyle = `rgba(0,0,0,${0.5 + r() * 0.5})`; x.beginPath(); x.ellipse(r() * 1024, r() * 342, 2 + r() * 9, 1 + r() * 5, r() * 3, 0, Math.PI * 2); x.fill(); }
    x.globalCompositeOperation = 'source-over';
    return yDone(THREE, c, false);
  }
  /* a tear-off day calendar, red at the top, its page a day long gone */
  function makeYinCalendar(THREE, cnv) {
    const [c, x] = ySized(cnv, 256, 384), r = yRng(83);
    x.fillStyle = '#f0e6d0'; x.fillRect(0, 0, 256, 384);
    x.fillStyle = '#b81c18'; x.fillRect(0, 0, 256, 92);
    x.fillStyle = '#ffe9a8'; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.font = 'bold 34px serif'; x.fillText('一九九八', 128, 34); x.font = 'bold 22px sans-serif'; x.fillText('戊寅年 · 1998', 128, 70);
    x.fillStyle = '#b81c18'; x.font = 'bold 150px serif'; x.fillText('15', 128, 196);
    x.fillStyle = '#2a201a'; x.font = 'bold 26px sans-serif'; x.fillText('七月 · JULY', 128, 290);
    x.font = '20px serif'; x.fillText('农历六月廿二', 128, 324); x.fillText('星期三', 128, 352);
    for (let i = 0; i < 20; i++) yBlob(x, 256, r() * 256, r() * 384, 16 + r() * 40, `rgba(140,110,60,${0.05 + r() * 0.08})`);
    x.strokeStyle = 'rgba(80,60,40,0.4)'; x.lineWidth = 2; for (let k = 0; k < 6; k++) { x.beginPath(); x.moveTo(0, 96 + k * 1.5); x.lineTo(256, 96 + k * 1.5); x.stroke(); }
    return yDone(THREE, c, false);
  }
  /* the cassette radio's face: a speaker grille, the tape window, the tuning strip, the counter */
  function makeYinRadio(THREE, cnv) {
    const [c, x] = ySized(cnv, 512, 228);
    x.fillStyle = '#2a2a2c'; x.fillRect(0, 0, 512, 228);
    x.fillStyle = '#121214'; x.beginPath(); x.arc(110, 120, 82, 0, Math.PI * 2); x.fill();
    x.fillStyle = '#4a4a4e'; for (let i = -80; i <= 80; i += 9) for (let j = -80; j <= 80; j += 9) if (i * i + j * j < 78 * 78) { x.beginPath(); x.arc(110 + i, 120 + j, 2.2, 0, Math.PI * 2); x.fill(); }
    x.fillStyle = '#b8bcc0'; x.fillRect(222, 22, 268, 40);
    x.fillStyle = '#202022'; x.font = '15px sans-serif'; x.textBaseline = 'middle';
    ['88', '92', '96', '100', '104', '108'].forEach((t, i) => x.fillText(t, 230 + i * 44, 34));
    x.fillStyle = '#c81c14'; x.fillRect(318, 24, 3, 36);
    x.fillStyle = '#18181a'; x.fillRect(240, 84, 236, 104);
    x.fillStyle = '#5a4430'; x.fillRect(262, 108, 192, 58);
    x.fillStyle = '#2c2420'; for (const cx of [312, 404]) { x.beginPath(); x.arc(cx, 137, 20, 0, Math.PI * 2); x.fill(); }
    x.fillStyle = '#d8d0c0'; for (const cx of [312, 404]) { x.beginPath(); x.arc(cx, 137, 8, 0, Math.PI * 2); x.fill(); }
    x.fillStyle = '#e8e0c8'; x.fillRect(300, 112, 116, 14); x.fillStyle = '#7a1a14'; x.font = 'bold 11px sans-serif'; x.fillText('ลูกทุ่ง · OLD SONGS', 306, 119);
    x.fillStyle = '#a8acb0'; x.font = 'bold 13px sans-serif'; x.fillText('STEREO RADIO CASSETTE', 240, 206);
    x.fillStyle = '#ff3a1a'; x.beginPath(); x.arc(470, 206, 4, 0, Math.PI * 2); x.fill();
    return yDone(THREE, c, false);
  }
  /* a candle flame: white at its root, gold, an orange skin, nothing at its tip */
  function makeYinFlame(THREE, cnv) {
    const [c, x] = ySized(cnv, 64, 128);
    x.clearRect(0, 0, 64, 128);
    x.save(); x.translate(32, 92); x.scale(1, 2.6);
    const g = x.createRadialGradient(0, 0, 0, 0, 0, 30); g.addColorStop(0, 'rgba(255,255,240,1)'); g.addColorStop(0.25, 'rgba(255,226,140,0.95)'); g.addColorStop(0.55, 'rgba(255,140,40,0.55)'); g.addColorStop(1, 'rgba(255,90,10,0)');
    x.fillStyle = g; x.beginPath(); x.arc(0, 0, 30, 0, Math.PI * 2); x.fill(); x.restore();
    const b = x.createRadialGradient(32, 110, 0, 32, 110, 10); b.addColorStop(0, 'rgba(120,150,255,0.6)'); b.addColorStop(1, 'rgba(120,150,255,0)');
    x.fillStyle = b; x.fillRect(16, 96, 32, 30);
    return yDone(THREE, c, false);
  }
  /* a soft curl of smoke */
  function makeYinSmoke(THREE, cnv) {
    const S = 128, [c, x] = cnv(S), r = yRng(89);
    x.clearRect(0, 0, S, S);
    for (let i = 0; i < 14; i++) { const px = 64 + (r() - 0.5) * 40, py = 64 + (r() - 0.5) * 50, R = 14 + r() * 20; const g = x.createRadialGradient(px, py, 0, px, py, R); g.addColorStop(0, 'rgba(255,255,255,0.18)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(px - R, py - R, R * 2, R * 2); }
    return yDone(THREE, c, false);
  }
  /* painted light: a soft round glow, white (each plane's colour tints it) */
  function makeYinGlow(THREE, cnv) {
    const S = 128, [c, x] = cnv(S);
    const g = x.createRadialGradient(64, 64, 0, 64, 64, 64); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.3, 'rgba(255,255,255,0.5)'); g.addColorStop(0.65, 'rgba(255,255,255,0.12)'); g.addColorStop(1, 'rgba(255,255,255,0)');
    x.fillStyle = g; x.fillRect(0, 0, S, S);
    return yDone(THREE, c, false);
  }
  /* the atrium's skylight: dirty panes in a steel grid, a grey afternoon, leaves dead on the glass */
  function makeYinSkylight(THREE, cnv) {
    const [c, x] = ySized(cnv, 256, 384), r = yRng(97);
    const g = x.createLinearGradient(0, 0, 0, 384); g.addColorStop(0, '#c4ccd0'); g.addColorStop(1, '#9aa4aa');
    x.fillStyle = g; x.fillRect(0, 0, 256, 384);
    for (let i = 0; i < 30; i++) yBlob(x, 256, r() * 256, r() * 384, 14 + r() * 40, `rgba(70,64,52,${0.08 + r() * 0.12})`);
    for (let i = 0; i < 26; i++) { x.fillStyle = `rgba(${60 + r() * 40 | 0},${44 + r() * 20 | 0},${24},0.7)`; x.beginPath(); x.ellipse(r() * 256, r() * 384, 3 + r() * 5, 1.5 + r() * 2, r() * 3, 0, Math.PI * 2); x.fill(); }
    x.fillStyle = '#3a3c3e'; for (const px of [0, 128]) x.fillRect(px - 3, 0, 6, 384); for (const py of [0, 128, 256]) x.fillRect(0, py - 3, 256, 6);
    return yDone(THREE, c, true);
  }
  /* the dead shops' fascias, four boards down a 1024 x 512 sheet: faded, a letter or two gone */
  function makeYinSigns(THREE, cnv) {
    const [c, x] = ySized(cnv, 1024, 512), r = yRng(101);
    const boards = [['好运裁缝', 'LUCKY TAILOR & ALTERATIONS', '#1e3a6a', '#e8dcc0'], ['美景照相', 'MAY KING PHOTO STUDIO', '#e8e2d4', '#8a1a14'],
                    ['金禾旅游', 'GOLDEN HARVEST TRAVEL', '#7a1410', '#e8c060'], ['新发钟表', 'SIN HUAT WATCH & CLOCK', '#141414', '#d8b058']];
    x.textAlign = 'center'; x.textBaseline = 'middle';
    boards.forEach(([zh, en, bg, fg], i) => {
      const y = i * 128;
      x.fillStyle = bg; x.fillRect(0, y, 1024, 128);
      x.fillStyle = fg; x.font = 'bold 54px serif'; x.fillText(zh, 512, y + 46); x.font = 'bold 30px sans-serif'; x.fillText(en, 512, y + 98);
      // sun and years
      for (let k = 0; k < 40; k++) yBlob(x, 1024, r() * 1024, y + r() * 128, 10 + r() * 40, `rgba(${r() < 0.5 ? '255,250,240' : '30,24,20'},${0.06 + r() * 0.1})`);
      x.globalCompositeOperation = 'source-atop';
      for (let k = 0; k < 3; k++) { x.fillStyle = bg; x.fillRect(200 + r() * 600, y + 12 + r() * 90, 18 + r() * 20, 30 + r() * 20); }
      x.globalCompositeOperation = 'source-over';
      x.fillStyle = 'rgba(0,0,0,0.35)'; x.fillRect(0, y, 1024, 4); x.fillRect(0, y + 124, 1024, 4);
    });
    return yDone(THREE, c, false);
  }
  /* a TO LET notice, taped on the inside of the glass, years old */
  function makeYinToLet(THREE, cnv) {
    const [c, x] = ySized(cnv, 256, 342), r = yRng(103);
    x.fillStyle = '#f0e8d4'; x.fillRect(0, 0, 256, 342);
    x.fillStyle = '#c41a14'; x.fillRect(12, 12, 232, 120);
    x.fillStyle = '#fff4e0'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.font = 'bold 66px sans-serif'; x.fillText('TO LET', 128, 74);
    x.fillStyle = '#1a1a1a'; x.font = 'bold 30px sans-serif'; x.fillText('招 租', 128, 168);
    x.font = 'bold 22px sans-serif'; x.fillText('Unit #04-', 128, 214); x.fillText('Call 9 1 3 7 · 4 2 0 8', 128, 252);
    for (let i = 0; i < 24; i++) yBlob(x, 256, r() * 256, r() * 342, 14 + r() * 30, `rgba(150,120,70,${0.06 + r() * 0.1})`);
    x.fillStyle = 'rgba(230,226,200,0.7)'; x.fillRect(100, 0, 56, 14); x.fillRect(100, 330, 56, 12);
    return yDone(THREE, c, false);
  }
  /* the green EXIT box over the fire door (a sign's pictogram is a prop) */
  function makeYinExit(THREE, cnv) {
    const [c, x] = ySized(cnv, 256, 98);
    x.fillStyle = '#0a8a3a'; x.fillRect(0, 0, 256, 98);
    x.fillStyle = '#e8fff0'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.font = 'bold 50px sans-serif'; x.fillText('EXIT', 150, 42); x.font = 'bold 22px sans-serif'; x.fillText('出 口', 150, 80);
    x.fillStyle = '#e8fff0'; x.fillRect(20, 16, 50, 66); x.fillStyle = '#0a8a3a'; x.fillRect(28, 24, 34, 52);
    return yDone(THREE, c, false);
  }
  /* a bottle's label: yellowed paper, a red rule, two lines of script */
  function makeYinLabel(THREE, cnv) {
    const [c, x] = ySized(cnv, 128, 152), r = yRng(107);
    x.fillStyle = '#e6d6a6'; x.fillRect(0, 0, 128, 152);
    x.strokeStyle = '#a81c14'; x.lineWidth = 6; x.strokeRect(6, 6, 116, 140);
    x.strokeStyle = '#7a120c'; x.lineWidth = 1.6; yKhomRow(x, 14, 114, 52, 24, 3); yKhomRow(x, 18, 110, 98, 22, 11);
    for (let i = 0; i < 8; i++) yBlob(x, 128, r() * 128, r() * 152, 10 + r() * 20, `rgba(120,80,30,${0.08 + r() * 0.1})`);
    return yDone(THREE, c, false);
  }
  /* THE FROST on the lens (CP5): ice ferns growing in from every edge. Its ALPHA is how near the edge a texel is,
     broken by the ferns, so the material's alphaTest — lowered as the cold comes — grows the frost INWARD rather than
     fading it in; its colour is the white-blue of the crystals */
  function makeYinFrost(THREE, cnv) {
    const S = 512, [c, x] = cnv(S), r = yRng(131);
    x.clearRect(0, 0, S, S);
    // the base: alpha by distance from the nearest edge (1 at the edge, 0 a third of the way in), a little noise
    const img = x.createImageData(S, S), d = img.data;
    for (let j = 0; j < S; j++) for (let i = 0; i < S; i++) {
      const e = Math.min(i, j, S - 1 - i, S - 1 - j) / (S * 0.36);
      const n = (Math.sin(i * 0.11 + j * 0.07) + Math.sin(i * 0.031 - j * 0.053) * 1.3) * 0.08;
      const a = Math.max(0, Math.min(1, 1 - e + n));
      const k = (j * S + i) * 4;
      d[k] = 214; d[k + 1] = 232; d[k + 2] = 246; d[k + 3] = Math.round(255 * a * a * 0.7);
    }
    x.putImageData(img, 0, 0);
    // the ferns: branching strokes from the edges inward, their alpha ABOVE the base so they lead the growth
    x.lineCap = 'round';
    const fern = (px, py, ang, len, w, depth) => {
      if (depth > 4 || len < 4) return;
      const ex = px + Math.cos(ang) * len, ey = py + Math.sin(ang) * len;
      x.strokeStyle = `rgba(240,248,255,${0.5 + 0.12 * (4 - depth)})`; x.lineWidth = w;
      x.beginPath(); x.moveTo(px, py); x.lineTo(ex, ey); x.stroke();
      const n = 3 + (r() * 3 | 0);
      for (let k = 1; k <= n; k++) {
        const t = k / (n + 1), bx = px + (ex - px) * t, by = py + (ey - py) * t;
        for (const sgn of [-1, 1]) fern(bx, by, ang + sgn * (0.7 + r() * 0.35), len * (0.32 + r() * 0.18) * (1 - t * 0.4), Math.max(0.6, w * 0.6), depth + 1);
      }
    };
    for (let i = 0; i < 26; i++) {
      const side = i % 4, u = r() * S;
      const [px, py, ang] = side === 0 ? [u, 0, Math.PI / 2] : side === 1 ? [u, S, -Math.PI / 2] : side === 2 ? [0, u, 0] : [S, u, Math.PI];
      fern(px, py, ang + (r() - 0.5) * 0.9, 70 + r() * 90, 2.2, 0);
    }
    // a frosted bloom in each corner
    for (const [cx, cy] of [[0, 0], [S, 0], [0, S], [S, S]]) {
      const g = x.createRadialGradient(cx, cy, 0, cx, cy, S * 0.42); g.addColorStop(0, 'rgba(235,245,255,0.95)'); g.addColorStop(1, 'rgba(235,245,255,0)');
      x.fillStyle = g; x.fillRect(0, 0, S, S);
    }
    return yDone(THREE, c, false);
  }
  /* the barrier across the escalator's landing: black and yellow */
  function makeYinHazard(THREE, cnv) {
    const S = 128, [c, x] = cnv(S);
    x.fillStyle = '#e8b818'; x.fillRect(0, 0, S, S);
    x.fillStyle = '#141414';
    for (let i = -S; i < S * 2; i += 32) { x.beginPath(); x.moveTo(i, 0); x.lineTo(i + 16, 0); x.lineTo(i + 16 - S, S); x.lineTo(i - S, S); x.closePath(); x.fill(); }
    return yDone(THREE, c, true);
  }

  /* ============================================================ THE FILMS FROM PLAY
     CP6 and CP7 build them; until then each is its black and its hand-off. */
  function meritFilm(c, s, api) {
    const { fade, step } = api;
    c.keepFade = true;
    fade(0, 0.8, 0, 1);
    step(2.0, () => {});
  }
  function runoutFilm(c, s, api) {
    const { fade, step } = api;
    c.keepFade = true;
    fade(0, 0.8, 0, 1);
    step(2.0, () => {});
  }

  /* ============================================================ THE ENDINGS
     CP9 builds them (docs/V22.0-E3C4-PLAN.md §4.6). */
  function scOpen(c, s, api) { const { fade, step } = api; fade(0, 1.5, 0, 1); step(2.0, () => {}); }
  function scHome(c, s, api) { const { fade, step } = api; fade(0, 1.5, 0, 1); step(2.0, () => {}); }
  function scDown(c, s, api) { const { fade, step } = api; fade(0, 1.5, 0, 1); step(2.0, () => {}); }
  function scTeacher(c, s, api) { const { fade, step } = api; fade(0, 1.5, 0, 1); step(2.0, () => {}); }

  (window.__CHAPTERS__ = window.__CHAPTERS__ || {}).e3c4 = Object.assign(DATA, {
    build,
    scenes: [scOpen, scHome, scDown, scTeacher],
    films: { merit: meritFilm, runout: runoutFilm }
  });
})();
