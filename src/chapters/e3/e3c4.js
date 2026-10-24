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
    brief: 'You go looking for answers in amulet shops. Look around, listen to the people who keep them, and notice what you are doing each time you pick one up.',
    prompt: 'The owner has unwrapped one more piece — one even he cannot name. What do you do?',
    /* four different KINDS of answer (v21.30): surrender, possession alone, withdrawal, guidance */
    choices: [
      { k: 'A', text: 'Take it, and open yourself — see what comes.',
        d: { sanity: -18, awareness: -9, wisdom: -27 }, verdict: 'worst', critical: true,
        say: 'I opened the door to prove it was there. It came in.',
        teach: 'Opening yourself to an unknown piece is the one experiment you cannot take back. Curiosity is not a reason to surrender control.' },
      { k: 'B', text: 'Buy it, and try it at home on your own.',
        d: { sanity: -9, awareness: 6, wisdom: -12 }, verdict: 'bad',
        say: 'I brought it home, and broke the promise I made to her.',
        teach: 'Testing in private is still testing — and buying it carried something no one could name into your own home.' },
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

    /* WORLD Y's light: an ordinary shop on an old mall's top floor one
       afternoon — the ceiling's tubes on, the warmth of the wood and the
       altar's red bulb. CP5a, Chad: "No shop will deliberately make itself
       dark and rundown, it makes no sense" and "it doesn't have to be
       rundown ... This world is not binary": not a showroom either. What is
       eerie here is what the shop SELLS. The cold, the Hanuman's gold and
       the tray's presences are tweens away from the three worlds' own
       (kit.daylight) */
    daylight: {
      stops: [[0.00, '#3c3a37'], [0.30, '#34322f'], [0.60, '#2c2a28'], [1.00, '#242220']],
      bg: 0x242220,
      fog: [0x2c2926, 0.010],
      hemi: [0xf6f2ea, 0x4a3e34, 0.78],
      key: [0xfff4e4, 0.58, 1, 6, 2],
      fill: [0xffd6c0, 0.24],
      stars: 0, moon: 0,
      sun: 0, clouds: 0,
      vmHemi: [0xf6f2ea, 0x4a3e34, 0.9],
      vmKey: [0xfff4e4, 0.66]
    },

    assets: ['yinkeeper', 'yinghost', 'yinptg', 'yingirl', 'yinamulet', 'yinamuletlod', 'yinshelf', 'yinshelflod', 'yinskull',
             /* the merit film's temple (CP6): chapter 3's monk, Chad's Buddha, the Thai kit, the estate's block */
             'monkshop', 'buddhahd', 'buddhalod', 'thaikit', 'hdb',
             /* World H (CP7): chapter 3's shop by its own models (an asset is shared by key; its code is copied), CHAD'S
                Hanuman amulet on the owner's stand, the shop's people and the corridor's shopper, and the Hanuman he sees */
             'altarrow', 'altarrowfar', 'amushelf', 'traynear', 'trayfar', 'lersimask', 'hanuamulet', 'hanuamuletlod',
             'mstr_lpthuad', 'mstr_lptimpray', 'mstr_somdejtoh', 'mstr_lptimbench', 'mstr_achanmun', 'mstr_lpphiboon',
             'owner', 'staffman', 'granny', 'botak', 'admintee', 'hanuman',
             /* World T (CP8): the street's parked cars, CHAD'S lersi amulet, his Thao Wessuwan as the tray's second piece,
                his naga coiled inside the third, the crystal ball (v22.1) — and the presences they call — the towkay */
             'cars', 'lersiamulet', 'lersiamuletlod', 'wessred', 'naga', 'towkay',
             /* the opening film (CP10): his desk at night in e3c1's office, Chad's Mersus Office */
             'filmoffice'],
    items: [],

    musicVol: 0,
    /* the beds, mixed every frame by where he is (mixBedsY): the cassette on the counter's shelf playing HER (its
       volume by distance, its pan by bearing, its RATE — the fourth value, main.js's loopRate — sagging with the
       cold and running down to a stop when he sets her down), the drone under the shop, the dead floor outside */
    ambience: { beds: [['y4song', 0, 0, 1], ['y4dread', 0], ['y4mall', 0], ['m4dusk', 0],   // m4dusk: the merit film's evening (mixBedsM)
                       /* CP7 · the Hanuman shop (mixBedsH): chapter 3's air, corridor, mall and radio, its own copies (h4*, the
                          v4.2 split) — the radio's third value its pan */
                       ['h4air', 0], ['h4walla', 0], ['h4mall', 0], ['h4radio', 0, 0],
                       /* CP8 · the tray shop (mixBedsT): the street through the open front (its third value its pan), the ceiling
                          fans, the forest under the Lersi, the water under the naga, and the music under the pieces */
                       ['x4street', 0, 0], ['x4fan', 0], ['x4forest', 0], ['x4water', 0], ['x4tension', 0],
                       /* CP9 · the endings (mixBedsE): the street at dusk and in the evening, his room at night */
                       ['x4dusk', 0], ['x4room', 0]] },
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
      lookPhotos: 'The paintings on the wall',
      lookAltar: 'The small altar',
      hotKeeper: 'Talk to the shopkeeper',
      hotLocket: 'Pick up the amulet',
      evSteady: 'Steady',
      evSteadyBrief: 'Your hand is shaking. Keep her steady, and set her down gently: drag to hold the amulet inside the ring.',
      presenceCold: 'It is so cold.',
      noteSteady: 'Knew your energy was not compatible with hers, and set her down gently, with respect.',
      noteSlip: 'Let her slip from your hand.',
      noteMerit: 'Promised to make merit in her name, and did.',
      // THE MERIT FILM — the Yathā vārivahā verse in its four lines as the monk chants them, each over what it means
      // (Thanissaro Bhikkhu, A Chanting Guide, the Anumodanā: dhammatalks.org/books/ChantingGuide/Section0077.html)
      yatha1: 'Yathā vārivahā pūrā',
      yatha1en: 'Just as rivers full of water',
      yatha2: 'Paripūrenti sāgaraṁ,',
      yatha2en: 'fill the ocean full,',
      yatha3: 'Evam-eva ito dinnaṁ',
      yatha3en: 'even so does that here given',
      yatha4: 'Petānaṁ upakappati.',
      yatha4en: 'benefit the dead (the hungry ghosts).',
      // THE HANUMAN SHOP
      objOwner: 'See what the owner has for you',
      objHanuman: 'Pick up the Hanuman',
      hotOwner: 'Talk to the owner',
      hotHanuman: 'Pick up the Hanuman',
      evLetGo: 'Let go',
      evLetGoBrief: 'Something wants to come in. When the roar breaks, let go of it at once: wait for LET GO, then tap it (or click it).',
      evLetGoWait: 'Hold…',
      evLetGoGo: 'LET GO',
      noteLetGo: 'Let go of the Hanuman piece at once.',
      noteLate: 'Held on to the Hanuman piece too long.',
      // THE TRAY SHOP
      objSit: 'Sit at the counter',
      objPieces: 'Hold the pieces · {n}/3',
      hotStool: 'Sit at the counter',
      hotLersi: 'Hold the Lersi',
      hotWess: 'Hold the Thao Wessuwan',
      hotNaga: 'Hold the naga crystal ball',
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
    /* the Yin shop */ 'z4look1': 7.47, 'z4look2': 12.56, 'z4look3': 5.64, 'yk4hello': 2.69, 'yk4show': 13.61, 'z4ask': 1.8, 'yk4gentle': 6.64, 'z4numb': 3.24, 'z4cold': 4.23, 'z4beside': 4.13, 'z4yin': 5.64, 'yk4heard': 1.96, 'yk4merit': 4.55,
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
    /* CHAD'S yin amulet (v22.0 CP5), shared by her velvet box and his hand: the near cut (every triangle) and the far
       cut wearing the near one's own material; its frame is old silver-gold, so its metal takes the room's reflection
       a little (none and it reads black, v8.9; the whole of it and it reads pale, v18.8) */
    let yinAm = null;
    function yinAmulet() {
      if (!yinAm) yinAm = Promise.all([parseOnce('yinamulet'), parseOnce('yinamuletlod')]).then(([n, f]) => {
        let mat = null; n.scene.traverse(m => { if (m.isMesh && !mat) mat = m.material; });
        if (mat) { mat.envMapIntensity = 0.35; for (const k of ['map', 'normalMap', 'roughnessMap', 'metalnessMap']) if (mat[k]) mat[k].anisotropy = 8; }
        f.scene.traverse(m => { if (m.isMesh) m.material = mat; });
        for (const sc of [n.scene, f.scene]) sc.traverse(m => { if (m.isMesh) { m.castShadow = false; m.receiveShadow = false; } });
        return { near: n.scene, far: f.scene, mat };
      });
      return yinAm;
    }
    const yinChainMat = M({ color: 0x8e7c5e, roughness: 0.38, metalness: 0.85 });   // its chain: the frame's old metal
    /* THE THAI KIT (v16.6's file) and CHAD'S BUDDHA (v18.8), e3c3's own helpers, copied for the merit film's temple
       (CP6 — a chapter imports nothing): one parse, every piece a clone; the PRINCIPAL image (`hd`) is the full statue
       while it is big on screen, a lighter cut beyond */
    const BUDDHA_H = 0.527, BUDDHA_ENV = 0.15, _bMat = new Map();
    function buddhaMat(m) {
      let c = _bMat.get(m);
      if (!c) { c = m.clone(); c.envMap = scene.environment || null; c.envMapIntensity = BUDDHA_ENV; _bMat.set(m, c); owned.push({ dispose: () => c.dispose() }); }
      return c;
    }
    function chadBuddha(g, o) {
      Promise.all([parseOnce('buddhahd'), parseOnce('buddhalod')]).then(([hd, lo]) => {
        if (!alive) return;
        const bb = new THREE.Box3().setFromObject(hd.scene), k = BUDDHA_H / (bb.max.y - bb.min.y), h = BUDDHA_H * (o.s || 1);
        const lod = new THREE.LOD();
        const level = (src, d) => {
          const w = new THREE.Group(); w.scale.setScalar(k); w.position.y = -bb.min.y * k;
          const m = src.clone(true); w.add(m);
          m.traverse(q => { if (!q.isMesh) return; q.castShadow = o.cast !== false && !LOW; q.receiveShadow = true; q.material = buddhaMat(q.material); });
          lod.addLevel(w, d);
        };
        if (o.hd) { level(hd.scene, 0); level(lo.scene.getObjectByName('buddha_mid'), (o.hdAt || 4) * h); }
        else level(lo.scene.getObjectByName('buddha_mid'), 0);
        level(lo.scene.getObjectByName('buddha_far'), (o.hd ? 12 : 4) * h);
        g.add(lod);
        if (o.then) o.then(g, lod);
      }).catch(err => { console.warn('buddha failed to load', err); ctx.loadFail && ctx.loadFail('buddhahd', err); });
      return g;
    }
    function thai(name, x, y, z, o = {}) {
      const g = new THREE.Group(); g.position.set(x, y, z); g.rotation.y = o.ry || 0;
      if (o.s) g.scale.setScalar(o.s);
      (o.parent || world).add(g);
      if (name === 'buddha') return chadBuddha(g, o);
      parseOnce('thaikit').then(gltf => {
        if (!alive) return;
        const src = gltf.scene.getObjectByName('thai_' + name);
        if (!src) throw new Error('thaikit has no thai_' + name);
        const m = src.clone(true);
        m.position.set(0, 0, 0);
        m.traverse(q => {
          if (!q.isMesh) return;
          q.castShadow = o.cast !== false && !LOW; q.receiveShadow = true;
          if (o.tint) { q.material = q.material.clone(); q.material.color.multiply(new THREE.Color(o.tint)); owned.push({ dispose: () => q.material.dispose() }); }
        });
        g.add(m);
        if (o.then) o.then(g, m);
      }).catch(err => { console.warn('thaikit failed to load', err); ctx.loadFail && ctx.loadFail('thaikit', err); });
      return g;
    }

    /* ============================================== WORLD Y · THE YIN SHOP (CP4)
       An old mall's top floor one afternoon: a dead corridor of shutters along an atrium void, its escalator running
       up out of the floor below (CP10), and at the far end the one unit still open — a narrow shop lit red, an old song on a cassette. Lamps are
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
      const mGlassDirty = M({ color: 0xaab4ae, roughness: 0.22, metalness: 0.1, transparent: true, opacity: 0.15, depthWrite: false });   // CP5a: glass, not grime
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
      // (CP5a: the missing ceiling panel over the back corner is gone — a shop that is open mends its ceiling)
      const blockerOnly = (w, h, d, x, y, z) => { const m = hidBox(w, h, d, x, y, z, G); walls.push(m); return m; };
      blockerOnly(W + 0.4, H, 0.2, 0, H / 2, YSHOP.z0 - 0.1);
      blockerOnly(0.2, H, D, YSHOP.x0 - 0.1, H / 2, cz);
      blockerOnly(0.2, H, D, YSHOP.x1 + 0.1, H / 2, cz);
      const lw = YDOOR.x0 - YSHOP.x0, rw = YSHOP.x1 - YDOOR.x1;
      blockerOnly(lw, H, 0.2, YSHOP.x0 + lw / 2, H / 2, 0.1);
      blockerOnly(rw, H, 0.2, YDOOR.x1 + rw / 2, H / 2, 0.1);
      // the walls as they are seen: a dark wainscot to 0.95 m, a rail, painted plaster above (CP5a: plain paint
      // with the ordinary marks of a shop in use — no damp, no cracks)
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

      /* ---- the LEFT wall: three tall cabinets of spirit amulets (the oil bottles in the middle one) — drawn, and
         standing only until CHAD'S yin amulet shelf lands in their place (below, after their contents) */
      const CAB = { x0: YSHOP.x0, x1: YSHOP.x0 + 0.46, h: 2.12, base: 0.56 };
      const cabZ = [[-1.18, -2.38], [-2.48, -3.68], [-3.78, -4.98]];
      const SHELF = [0.62, 0.98, 1.34, 1.7, 2.04];
      const YSHELF = { d: 0.322, w: 1.228, h: 2.0, gap: 0.01 };     // Chad's shelf, measured (masters/v22.0/yinmodels)
      const glows = [];
      const cabStart = G.children.length;
      cabZ.forEach(([za, zb], ci) => {
        const w = za - zb, cz2 = (za + zb) / 2, xd = CAB.x1 - CAB.x0, xc = (CAB.x0 + CAB.x1) / 2;
        box(xd, CAB.base, w, xc, CAB.base / 2, cz2, mWood, G, false);                         // the cupboard under it
        // its collision is the SHELF's footprint, drawn cabinet or shelf: padded 0.14 it stands 0.47 off the wall, in
        // front of the drawn glass (0.46) and 0.14 short of the shelf's face, its full height (it hides her, girlSeen)
        solids.push(hidBox(YSHELF.d, YSHELF.h, YSHELF.w, CAB.x0 + YSHELF.gap + YSHELF.d / 2, YSHELF.h / 2, cz2, G));
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
      const cabParts = G.children.slice(cabStart);
      /* CHAD'S yin amulet shelf (v22.0 CP5: "this is the yin amulet shelf in the yin shop, replace your generated ones
         with this model"): a dark wooden cabinet of yin stock — lockets, prai oil, kuman thong, takrut cases, two skulls
         — three along the wall where the drawn cabinets stood, each a THREE.LOD: the near cut within 3.2 m (2.4 on a
         phone), the far cut beyond wearing the near one's own material (v21.8). The middle one is MIRRORED, so the wall
         is not one shelf stamped three times. The drawn cabinets stand until both cuts land (a failed download costs the
         nicer shelf, never the wall, v4.7) and go on the frame they do. */
      Promise.all([parseOnce('yinshelf'), parseOnce('yinshelflod')]).then(([near, far]) => {
        if (!alive) return;
        let nearMat = null;
        near.scene.traverse(m => { if (m.isMesh && !nearMat) nearMat = m.material; });
        if (!nearMat) return;
        for (const k of ['map', 'normalMap', 'roughnessMap', 'metalnessMap']) if (nearMat[k]) nearMat[k].anisotropy = 8;
        cabZ.forEach(([za, zb], ci) => {
          const lod = new THREE.LOD();
          const n = near.scene.clone(true), f = far.scene.clone(true);
          f.traverse(m => { if (m.isMesh) m.material = nearMat; });
          for (const o of [n, f]) o.traverse(m => { if (m.isMesh) { m.castShadow = false; m.receiveShadow = true; } });
          lod.addLevel(n, 0); lod.addLevel(f, LOW ? 2.4 : 3.2);
          lod.position.set(CAB.x0 + YSHELF.gap + YSHELF.d / 2, 0, (za + zb) / 2);
          lod.rotation.y = Math.PI / 2;                       // its face (+z in the file) to the shop (+x)
          if (ci === 1) lod.scale.x = -1;
          G.add(lod);
        });
        for (const o of cabParts) o.visible = false;
        yLive.shelves = true;
      }).catch(err => { console.warn('yinshelf failed to load', err); ctx.loadFail && ctx.loadFail('yinshelf', err); });

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
        // a young woman's things: a small hand mirror, a comb, a lipstick, a bottle of perfume (CP5c: the comb, the lipstick,
        // the perfume and one candle had been laid INSIDE the upper tier's box — it covers the top's back 0.31 m — and are on
        // the open cloth in front of it now)
        { const mir = new THREE.Group(); mir.position.set(A.x + 0.3, ty + 0.006, A.z - 0.02); mir.rotation.y = -0.4; G.add(mir);
          const fr = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.008, 18), M({ color: 0xd8a0a8, roughness: 0.4 })); fr.position.y = 0.004; mir.add(fr);
          const gl = new THREE.Mesh(new THREE.CircleGeometry(0.042, 18), M({ color: 0x8a96a0, roughness: 0.05, metalness: 0.9 })); gl.rotation.x = -Math.PI / 2; gl.position.y = 0.0085; mir.add(gl);
          const hd = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.008, 0.08), fr.material); hd.position.set(0, 0.004, 0.085); mir.add(hd); }
        box(0.11, 0.008, 0.035, A.x + 0.15, ty + 0.004, A.z + 0.03, M({ color: 0x2a1a12, roughness: 0.5 }), G, false);
        cyl(0.007, 0.007, 0.05, A.x + 0.02, ty + 0.025, A.z + 0.0, M({ color: 0xb01c2a, roughness: 0.3, metalness: 0.4 }), 8, G);
        cyl(0.018, 0.022, 0.06, A.x - 0.08, ty + 0.03, A.z + 0.01, M({ color: 0xe0b8c8, roughness: 0.1, transparent: true, opacity: 0.7 }), 10, G);
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
        for (const [dx, dz, h] of [[-0.66, -0.12, 0.16], [0.68, -0.14, 0.13], [-0.27, -0.03, 0.1]]) {
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

      /* ---- the RIGHT wall, back half: what a Yin shop hangs (Chad: "Usually it is female ghosts, sometimes the portraits
         look like demons" — and the demon is PHRA NGAN, "you should generate something that looks like a phra ngan"),
         and between them hers, a photograph, with fresh white flowers under it */
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
      const ptgMat = new THREE.MeshStandardMaterial({ color: 0xd8ccb4, roughness: 0.72, visible: false }); mats.push(ptgMat);
      const girlMat = new THREE.MeshStandardMaterial({ color: 0xe0d4bc, roughness: 0.6, visible: false }); mats.push(girlMat);
      yLive.girlMat = girlMat;
      /* the paintings: one sheet (masters/v22.0/cp5/paintings.sh), 1088 x 1536 — Phra Ngan seated with his whiskey,
         cigarettes and photographs of women at his feet, Phra Ngan close, Mae Nak in her doorway, Nang Tani at her banana
         tree. Each rect is in the sheet's pixels, top-down (the texture is not flipped, as the photographs' was not). */
      const ptgCell = (geo, x0, y0, x1, y1) => {
        const uv = geo.attributes.uv;
        for (let i = 0; i < uv.count; i++) uv.setXY(i, (x0 + uv.getX(i) * (x1 - x0)) / 1088, (y1 - uv.getY(i) * (y1 - y0)) / 1536);
      };
      const PAINTINGS = [
        // [z, y, w, h, [x0, y0, x1, y1] in the sheet, frame (0 dark wood, 1 gilt), a hand's tilt]
        [-4.78, 1.70, 0.46, 0.69, [0, 0, 512, 768], 1, 0.008],        // Phra Ngan, seated, his offerings at his feet
        [-5.40, 1.74, 0.40, 0.60, [0, 768, 512, 1536], 0, -0.006],     // Mae Nak in her doorway
        [-6.50, 1.74, 0.40, 0.60, [512, 768, 1024, 1536], 0, 0.005],   // Nang Tani at her banana tree
        [-7.22, 1.70, 0.42, 0.56, [512, 0, 1088, 768], 1, -0.009]      // Phra Ngan, close, his eyes
      ];
      const mFrames = [M({ map: tWood, color: 0x3a2214, roughness: 0.5 }), mGilt];
      yLive.paintings = [];
      for (const [z, y, w, h, r, fi, tilt] of PAINTINGS) {
        const g = frameOn(w, h, z, y, mFrames[fi], 0.035);
        const geo = new THREE.PlaneGeometry(w, h); ptgCell(geo, r[0], r[1], r[2], r[3]);
        const ph = new THREE.Mesh(geo, ptgMat); ph.position.z = 0.004; g.add(ph);
        g.rotation.z = tilt;                                  // hung by hand: none quite level
        yLive.paintings.push(g);
      }
      // hers, larger, in a gilt frame, and under it a small ledge with fresh white flowers, a cup, a burnt-down candle
      // (CP5: her photograph is the portrait under the glass of Chad's yin amulet, in an old oval mat —
      // masters/v22.0/yinmodels/matphoto.py — so the wall and the locket in his hand are the same woman)
      { const g = frameOn(0.28, 0.37, YGIRL.z, YGIRL.y, mGilt, 0.035);
        const ph = new THREE.Mesh(new THREE.PlaneGeometry(0.28, 0.37), girlMat);
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
      // the paintings arrive when their bytes do (a failed download costs the pictures, never the room: until then
      // each frame holds its dark backing)
      // (CP5a: the paintings are dark by nature — night, smoke, a god in shadow — so their own colours are lent a little
      // light, v21.11's recipe for the Ming painting, or under ordinary shop light they read as four dark boards)
      loadImageTexture('yinptg', 'image/jpeg').then(t => { if (!alive || !t) return; madeTex.push(t); ptgMat.map = t; ptgMat.color.set(0xffffff);
        ptgMat.emissive.set(0xffffff); ptgMat.emissiveMap = t; ptgMat.emissiveIntensity = 0.22; ptgMat.visible = true; ptgMat.needsUpdate = true; }).catch(() => {});
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
        const chainG = new THREE.TorusGeometry(0.003, 0.0008, 3, 6), mChain = yinChainMat;
        for (let k = 0; k < 14; k++) { const ln = new THREE.Mesh(chainG, mChain); const a = k / 14 * Math.PI * 1.6 + 2.0; ln.position.set(Math.cos(a) * 0.045, 0, -0.03 + Math.sin(a) * 0.03); ln.rotation.y = a; lk.add(ln); }
        yLive.locket = lk;
        /* CHAD'S yin amulet (v22.0 CP5: "this is the yin amulet that the player holds") on her satin: 7 cm with its
           bail, lying face up, its bail to her side so the portrait reads the right way up from his side of the
           counter; every triangle within 1.6 m (an amulet ships at full detail, v14.14), the far cut beyond. The drawn
           locket stands until it lands; its chain stays, coiled round it. */
        { const drawn = [rim, back, face, lens, bail];
          yinAmulet().then(A => {
            if (!alive) return;
            const lod = new THREE.LOD(), turn = new THREE.Group(); turn.rotation.y = -Math.PI / 2;
            const lay = new THREE.Group(); lay.rotation.x = -Math.PI / 2; lay.scale.setScalar(0.07); lay.position.y = 0.0031;
            lod.addLevel(A.near.clone(true), 0); lod.addLevel(A.far.clone(true), 1.6);
            lay.add(lod); turn.add(lay); lk.add(turn);
            for (const o of drawn) o.visible = false;
          }).catch(() => {});
        }
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
        // and behind her, at the end of the counter, a low cabinet with her table lamp on it, lit (closes her corner;
        // CP5a: a lamp in an open shop is on — the shade glows, a warm pool on the cabinet and the wall)
        solids.push(box(0.8, 0.86, 0.32, 2.0, 0.43, -4.02, mWood, G, false));
        cyl(0.06, 0.08, 0.04, 2.1, 0.88, -4.02, mBrass, 12, G);
        cyl(0.01, 0.01, 0.3, 2.1, 1.05, -4.02, mBrass, 6, G);
        cyl(0.08, 0.14, 0.14, 2.1, 1.22, -4.02, M({ color: 0x8a3422, roughness: 0.7, side: THREE.DoubleSide, emissive: 0xff8a4a, emissiveIntensity: 0.55 }), 14, G);
        glowPlane(0.9, 0.9, 0xffb070, 0.22, 2.1, 0.865, -4.02, -Math.PI / 2);
        glowPlane(1.1, 1.0, 0xffb070, 0.14, YSHOP.x1 - 0.004, 1.3, -4.02, 0, -Math.PI / 2);
      }

      /* ---- CP5c: SKULLS, and the shop's other occult things (Chad: "there are usually many skulls or occult items all
         over, that is the real eerie part"). The skull is a REAL scan (tools/prepskull.mjs: Khronos's ScatteringSkull,
         CC0, made bone from its own ambient occlusion), cloned where a yin shop keeps them — the middle of her altar's
         upper tier, the counter beside the velvet box between two black candles, small carved ones in the counter's
         showcase, the keeper's shelf, the top of the stock, the tops of the yin shelves, her lamp cabinet — each with
         its own finish (bone, smoked, black lacquer). Nothing stands in for one until it lands (v21.16). Lengths in
         metres, brow to back; `ry` turns the face (+z in the file) to the room. */
      const SKULLS = [
        [YALT.x, 1.17, YSHOP.z0 + 0.16, 0, 0.20, 'bone'],                          // her altar's upper tier, in the middle
        [YALT.x + 0.47, 1.17, YSHOP.z0 + 0.15, -0.3, 0.09, 'black'],               // a small black one at its end
        [1.22, YCNT.top, -2.05, -Math.PI / 2 + 0.12, 0.20, 'smoke'],               // the counter, by the velvet box
        [1.36, 0.779, -1.84, -Math.PI / 2 + 0.3, 0.045, 'bone'],                   // carved ones in the showcase
        [1.12, 0.779, -2.40, -Math.PI / 2 - 0.2, 0.04, 'black'],
        [1.35, 0.779, -3.18, -Math.PI / 2, 0.05, 'smoke'],
        [YSHOP.x1 - 0.12, 1.4925, -1.85, -Math.PI / 2 - 0.15, 0.18, 'bone'],       // her shelf, behind her
        [2.0, 1.90, -0.62, -Math.PI / 2 + 0.25, 0.20, 'smoke'],                    // on top of the stock
        [CAB.x0 + 0.17, YSHELF.h, -1.62, Math.PI / 2 - 0.2, 0.18, 'bone'],         // on the yin shelves
        [CAB.x0 + 0.17, YSHELF.h, -4.52, Math.PI / 2 + 0.25, 0.20, 'black'],
        [1.78, 0.86, -3.88, -Math.PI / 2 - 0.4, 0.12, 'smoke']                     // her lamp cabinet
      ];
      parseOnce('yinskull').then(k => {
        if (!alive) return;
        let base = null; k.scene.traverse(m => { if (m.isMesh && !base) base = m.material; });
        if (!base) return;
        const tint = (c, o = {}) => { const m = base.clone(); m.color.set(c); Object.assign(m, o); mats.push(m); return m; };
        const fin = { bone: base, smoke: tint(0x8f8070, { roughness: 0.7 }), black: tint(0x2c2622, { roughness: 0.3, metalness: 0.1 }) };
        for (const [x, y, z, ry, len, f] of SKULLS) {
          const s = k.scene.clone(true); s.scale.setScalar(len / 0.2); s.position.set(x, y, z); s.rotation.y = ry;
          s.traverse(m => { if (m.isMesh) { m.material = fin[f]; m.castShadow = false; m.receiveShadow = true; } });
          G.add(s);
        }
      }).catch(err => { console.warn('yinskull failed to load', err); ctx.loadFail && ctx.loadFail('yinskull', err); });
      // two black candles beside the counter's skull (one lit), and a black one burning on her altar's tier
      { const mBlackWax = M({ color: 0x17120f, roughness: 0.55 });
        for (const [x, z, h, lit] of [[1.40, -1.86, 0.15, true], [1.43, -2.24, 0.10, false]]) {
          cyl(0.016, 0.017, h, x, YCNT.top + h / 2, z, mBlackWax, 10, G);
          if (lit) yLive.flames.push({ x, y: YCNT.top + h + 0.025, z, s: 0.05 });
        }
        cyl(0.014, 0.015, 0.12, YALT.x - 0.18, 1.17 + 0.06, YSHOP.z0 + 0.12, mBlackWax, 10, G);
        yLive.flames.push({ x: YALT.x - 0.18, y: 1.17 + 0.145, z: YSHOP.z0 + 0.12, s: 0.045 }); }
      // a small coffin (a lok song) bound in red cord on the stock's top, and a meed mor — a ritual knife, its handle
      // wound in red — laid on her shelf
      { const cof = new THREE.Group(); cof.position.set(2.02, 1.90, -1.05); cof.rotation.y = 0.2; G.add(cof);
        const mCof = M({ color: 0x3a2116, roughness: 0.6 }), mCord = M({ color: 0x9c1a14, roughness: 0.7 });
        const lidG = new THREE.CylinderGeometry(0.035, 0.035, 0.16, 6, 1); lidG.rotateZ(Math.PI / 2); lidG.scale(1, 0.7, 1);
        const body = new THREE.Mesh(lidG, mCof); body.position.y = 0.025; cof.add(body);
        for (const dx of [-0.045, 0.045]) { const t = new THREE.Mesh(new THREE.TorusGeometry(0.031, 0.002, 4, 14), mCord); t.rotation.y = Math.PI / 2; t.position.set(dx, 0.025, 0); cof.add(t); }
        const kn = new THREE.Group(); kn.position.set(YSHOP.x1 - 0.13, 1.4925, -3.42); kn.rotation.y = 0.5; G.add(kn);
        box(0.13, 0.003, 0.024, 0.065, 0.004, 0, M({ color: 0xb8bcc0, roughness: 0.25, metalness: 0.9 }), kn, false);
        const hd = cyl(0.009, 0.01, 0.09, -0.045, 0.01, 0, M({ color: 0x1a1210, roughness: 0.5 }), 8, kn); hd.rotation.z = Math.PI / 2;
        for (let i = 0; i < 6; i++) { const w = new THREE.Mesh(new THREE.TorusGeometry(0.0105, 0.0016, 4, 10), mCord); w.rotation.y = Math.PI / 2; w.position.set(-0.08 + i * 0.013, 0.01, 0); kn.add(w); } }

      /* ---- the ceiling's fittings: two, each two tubes, both working (CP5a: an open shop keeps its lights on);
         the front one is the one the shop makes stutter when a look is answered (lookAnswer's bottles), and the
         back one over the altar end is steady. Each paints its pool on the floor and its spill on the ceiling. */
      const fitting = (fz, mat, glows) => {
        const fy = H - 0.05;
        box(0.26, 0.06, 1.3, 0, fy, fz, M({ color: 0xd8d6d0, roughness: 0.5 }), G, false);
        for (const tx of [-0.06, 0.06]) {
          const t = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 1.2, 10), mat);
          t.rotation.x = Math.PI / 2; t.position.set(tx, fy - 0.04, fz); G.add(t);
        }
        glows.push(glowPlane(3.4, 4.4, 0xdce8ff, 0.14, 0, 0.013, fz, -Math.PI / 2));
        glows.push(glowPlane(1.2, 2.4, 0xeef4ff, 0.30, 0, H - 0.008, fz, Math.PI / 2));
      };
      { const mTube = new THREE.MeshBasicMaterial({ color: 0xeef4ff }); mats.push(mTube);
        fitting(-3.6, mTube, yLive.tubeGlow);            // over the middle, where the bottles stand
        yLive.tube = { material: mTube };                // the stutter writes this one material: both its tubes
        const mTube2 = new THREE.MeshBasicMaterial({ color: 0xeef4ff }); mats.push(mTube2);
        yLive.tubeGlow2 = []; fitting(-6.5, mTube2, yLive.tubeGlow2); yLive.tube2 = { material: mTube2 }; }   // behind the fan
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
      // a little dust where the light falls (CP5a: a shop's ordinary dust, not a red haze)
      { const n = LOW ? 20 : 40, pos = new Float32Array(n * 3);
        for (let i = 0; i < n; i++) { pos[i * 3] = YSHOP.x0 + 0.2 + ((i * 0.6180339) % 1) * (W - 0.4); pos[i * 3 + 1] = 0.3 + ((i * 0.381966) % 1) * 2.1; pos[i * 3 + 2] = YSHOP.z0 + 0.3 + ((i * 0.7548776) % 1) * (D - 0.6); }
        const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        const pm = new THREE.PointsMaterial({ color: 0xfff0e0, size: 0.01, transparent: true, opacity: 0.28, depthWrite: false, blending: THREE.AdditiveBlending, map: tGlow, fog: false });
        mats.push(pm);
        const pts = new THREE.Points(geo, pm); pts.frustumCulled = false; G.add(pts);
        yLive.motes = { pts, base: Float32Array.from(pos), n };
      }
      // incense smoke: a few soft puffs climbing from the sticks, recycled
      { const sm = new THREE.SpriteMaterial({ map: tSmoke, color: 0xd8c8c0, transparent: true, opacity: 0.0, depthWrite: false, fog: false });
        mats.push(sm);
        for (let k = 0; k < 6; k++) { const m = sm.clone(); mats.push(m); const sp = new THREE.Sprite(m); sp.position.copy(yLive.smokeAt); G.add(sp); yLive.smoke.push({ sp, t: k / 6, k: k * 1.7 }); } }

      /* ---- the CORRIDOR: terrazzo, the ceiling and its fittings, the shutters, the railing over the void */
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
        // her own fascia: a red board, a gold border, and what she sells in gold letters (CP5a: an open shop says
        // what it is; the words are world art — the jetty sign's precedent — and name no real business)
        { const sign = new THREE.Mesh(new THREE.PlaneGeometry(4.9, 0.52), M({ map: tex(makeYinFascia(THREE, cnv)), roughness: 0.6, emissive: 0x2a0a04, emissiveIntensity: 0.6 }));
          sign.position.set(0, 2.88, 0.205); G.add(sign);
          box(4.95, 0.03, 0.03, 0, 3.15, 0.21, mGilt, G, false); box(4.95, 0.03, 0.03, 0, 2.61, 0.21, mGilt, G, false); }
        // the tube fittings along the corridor, every four metres, lit (CP5a: an old mall on a quiet afternoon keeps
        // its lights on); one far down is out, as one always is (not binary). One material for every lit tube.
        { const mFit = M({ color: 0xbfbcb4, roughness: 0.5 }), mCorTube = new THREE.MeshBasicMaterial({ color: 0xe6eef8 }); mats.push(mCorTube);
          const tubeGeo = new THREE.CylinderGeometry(0.014, 0.014, 1.15, 8);
          for (let x = X0 + 2; x < X1 - 1; x += 4) {
            box(0.24, 0.05, 1.22, x, CH - 0.03, 2.4, mFit, G, false);
            if (x === X0 + 6) continue;                    // the one that is out
            const fl = x === X0 + 18 ? (yLive.flick = []) : null;   // CP10: the one the opening film's walk comes to, stuttering
            for (const tx of [-0.055, 0.055]) { const t = new THREE.Mesh(tubeGeo, mCorTube); t.rotation.x = Math.PI / 2; t.position.set(x + tx, CH - 0.07, 2.4); G.add(t); if (fl) fl.push(t); }
            const g1 = glowPlane(3.2, 4.2, 0xdce6f4, 0.10, x, 0.012, 2.4, -Math.PI / 2);
            const g2 = glowPlane(1.6, 2.8, 0xeef4ff, 0.16, x, CH - 0.006, 2.4, Math.PI / 2);
            if (fl) fl.push(g1, g2);
          } }
        // the railing over the void: a steel handrail, balusters, glass panels; a gap where the escalator lands
        const RZ = YMALL.z1, GAP0 = -14.2, GAP1 = -12.4;
        for (const [a, b] of [[X0, GAP0], [GAP1, X1]]) {
          const w = b - a, cx = (a + b) / 2;
          walls.push(box(w, 1.05, 0.06, cx, 0.525, RZ, mGlassDirty, G, false));
          box(w, 0.05, 0.08, cx, 1.07, RZ, mSteel, G, false);
          box(w, 0.06, 0.1, cx, 0.03, RZ, mSteel, G, false);
          for (let x = a + 0.05; x < b; x += 1.2) box(0.04, 1.05, 0.04, x, 0.525, RZ, mSteel, G, false);
        }
        // the escalator's landing: an UP escalator, so its blocker is the one way nobody goes (CP10: the tape that
        // said "nobody rides it today" went when the opening film began to ride it up)
        walls.push(hidBox(GAP1 - GAP0, 1.4, 0.3, (GAP0 + GAP1) / 2, 0.7, RZ));
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
        // its fittings, lit like this side's, and two of its units open (their light on the walkway's floor and out
        // across the void — CP5a: a quiet floor, not an abandoned one)
        { const mFit2 = M({ color: 0xbfbcb4, roughness: 0.5 }), mT2 = new THREE.MeshBasicMaterial({ color: 0xe6eef8 }); mats.push(mT2);
          const tg = new THREE.CylinderGeometry(0.014, 0.014, 1.15, 8), fz = YVOID.z1 + 1.5;
          for (let x = X0 + 4; x < X1 - 1; x += 5) {
            box(0.24, 0.05, 1.22, x, CH - 0.03, fz, mFit2, G, false);
            for (const tx of [-0.055, 0.055]) { const t = new THREE.Mesh(tg, mT2); t.rotation.x = Math.PI / 2; t.position.set(x + tx, CH - 0.07, fz); G.add(t); }
            glowPlane(3.0, 3.0, 0xdce6f4, 0.09, x, 0.012, fz, -Math.PI / 2);
          }
          for (const ux of [-16.5, -5.0]) {
            glowPlane(3.6, 2.3, 0xffe2b8, 0.20, ux, 1.25, YVOID.z1 + 2.97, 0, Math.PI);
            glowPlane(3.4, 2.2, 0xffd8a8, 0.10, ux, 0.013, YVOID.z1 + 2.0, -Math.PI / 2);
          } }
        // bulkheads up to the skylight on both sides of the void, and the skylight: an afternoon through its panes
        for (const bz of [RZ, YVOID.z1]) { const b = new THREE.Mesh(new THREE.PlaneGeometry(CW, YVOID.sky - CH), mSlab); b.position.set(ccx, (CH + YVOID.sky) / 2, bz); b.rotation.y = bz === RZ ? Math.PI : 0; G.add(b); }
        { const sky = new THREE.Mesh(new THREE.PlaneGeometry(CW, vd), new THREE.MeshBasicMaterial({ map: repeatTex(tSky, CW / 4, 1), color: 0xc4ced6, fog: false }));
          mats.push(sky.material); sky.rotation.x = Math.PI / 2; sky.position.set(ccx, YVOID.sky, vz); G.add(sky); }
        /* CP10 · the void's two ENDS were open: down the atrium from the railing, and straight ahead up the escalator the
           opening film rides, there was nothing — the night behind the set. Each end is a wall now from the floor below to
           the skylight, banded where the floors are, and keeps what an old mall keeps there: at the far (east) end, the
           floor's number painted big, a cloth banner letting the empty units, a lightbox with a sale nobody took down (one
           tube dead), a lit unit on the floor below; at the west end, an older banner, the number again, a shutter below.
           The far walkway's two ends are walled too, and the floor below has a far side (dark units, two lit). */
        { const tLease = tex(makeYinLease(THREE, cnv)), tLevel = tex(makeYinLevel(THREE, cnv));
          const mLease = M({ map: tLease, roughness: 0.92, side: THREE.DoubleSide });
          const mLevel = M({ map: tLevel, roughness: 0.9, transparent: true, depthWrite: false });
          const endWall = (x, ry, sgn) => {
            tiled(vd, YVOID.sky - YVOID.floor, mPillarT, 2.4, x, (YVOID.sky + YVOID.floor) / 2, vz, ry);
            tiled(3, CH, mPillarT, 2.4, x, CH / 2, YVOID.z1 + 1.5, ry);                       // the far walkway's end
            box(0.06, 0.42, vd, x + sgn * 0.03, -0.21, vz, mSlab, G, false);                    // the floor's slab edge
            box(0.05, 0.16, vd, x + sgn * 0.025, CH + 0.08, vz, mSlab, G, false);               // the ceiling line
            box(0.05, 0.42, vd, x + sgn * 0.025, YVOID.floor + 3.4, vz, mSlab, G, false);       // the floor below's
          };
          endWall(X1, -Math.PI / 2, -1);
          endWall(X0, Math.PI / 2, 1);
          // the east end: the number, the banner on its rod and wires, the lightbox, the lit unit below
          { const lv = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 1.25), mLevel); lv.rotation.y = -Math.PI / 2; lv.position.set(X1 - 0.012, 4.25, 6.2); G.add(lv);
            const bn = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 4.9), mLease); bn.rotation.y = -Math.PI / 2; bn.position.set(X1 - 0.08, 3.65, 10.0); G.add(bn);
            box(0.035, 0.035, 1.56, X1 - 0.08, 6.12, 10.0, mSteel, G, false);
            for (const wz of [9.35, 10.65]) box(0.008, 0.28, 0.008, X1 - 0.08, 6.26, wz, mSteel, G, false);
            const tSale = tex(makeYinSaleBox(THREE, cnv));
            box(0.18, 1.47, 3.72, X1 - 0.09, 1.375, 7.1, M({ color: 0x3c4044, roughness: 0.5, metalness: 0.6 }), G, false);
            const face = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 1.35), new THREE.MeshBasicMaterial({ map: tSale, color: 0xc8d0d0 }));
            mats.push(face.material); face.rotation.y = -Math.PI / 2; face.position.set(X1 - 0.185, 1.375, 7.1); G.add(face);
            glowPlane(4.4, 2.2, 0xd8eef0, 0.07, X1 - 0.19, 1.375, 7.3, 0, -Math.PI / 2);
            const lu = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 2.6), mDarkUnit); lu.rotation.y = -Math.PI / 2; lu.position.set(X1 - 0.02, YVOID.floor + 1.3, 7.6); G.add(lu);
            glowPlane(3.6, 2.2, 0xffd8a0, 0.14, X1 - 0.04, YVOID.floor + 1.3, 7.6, 0, -Math.PI / 2); }
          // the west end: an older banner, the number, a shutter on the floor below
          { const bn = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 4.9), mLease); bn.rotation.y = Math.PI / 2; bn.position.set(X0 + 0.08, 3.4, 6.9); G.add(bn);
            bn.material = mLease.clone(); bn.material.color.set(0xd4c4b8); mats.push(bn.material);
            box(0.035, 0.035, 1.56, X0 + 0.08, 5.87, 6.9, mSteel, G, false);
            for (const wz of [6.25, 7.55]) box(0.008, 0.52, 0.008, X0 + 0.08, 6.14, wz, mSteel, G, false);
            const lv = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 1.25), mLevel); lv.rotation.y = Math.PI / 2; lv.position.set(X0 + 0.012, 4.25, 9.6); G.add(lv);
            tiled(5.0, 2.6, mShutter, 2.6, X0 + 0.02, YVOID.floor + 1.3, 8.4, Math.PI / 2); }
          // the floor below's far side, under the far walkway: dark units, two of them lit
          { const fl = new THREE.Mesh(new THREE.PlaneGeometry(CW, 4.18), mDarkUnit); fl.rotation.y = Math.PI; fl.position.set(ccx, YVOID.floor + 2.09, YVOID.z1 - 0.3); G.add(fl);
            for (const lx of [-12, -1.5]) glowPlane(3.2, 2.2, 0xffd8a0, 0.12, lx, YVOID.floor + 1.3, YVOID.z1 - 0.32, 0, Math.PI); } }
        /* CP10 · and the corridor's own east end, which the film's walk looks down the whole way to her door, was a bare
           white wall: the stair door with its sign and EXIT over it, the hose reel in its red cabinet, a notice board, a bin */
        { const ex = X1 - 0.01, mDoor = M({ color: 0x6c706a, roughness: 0.55, metalness: 0.2 });
          box(0.04, 2.22, 1.14, X1 - 0.02, 1.11, 3.9, M({ color: 0x3e403e, roughness: 0.5 }), G, false);
          const dr = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 2.1), mDoor); dr.rotation.y = -Math.PI / 2; dr.position.set(X1 - 0.045, 1.05, 3.9); G.add(dr);
          const win = new THREE.Mesh(new THREE.PlaneGeometry(0.24, 0.5), mDarkUnit); win.rotation.y = -Math.PI / 2; win.position.set(X1 - 0.048, 1.55, 3.9); G.add(win);
          box(0.035, 0.04, 0.78, X1 - 0.075, 1.0, 3.9, mSteel, G, false);
          const tHose = tex(makeYinHoseSign(THREE, cnv)), sgn = (lo, w, h, y, z) => {
            const g2 = new THREE.PlaneGeometry(w, h), uv = g2.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setY(i, lo + uv.getY(i) * 0.5);
            const m = new THREE.Mesh(g2, M({ map: tHose, roughness: 0.6 })); m.rotation.y = -Math.PI / 2; m.position.set(ex - 0.01, y, z); G.add(m); return m; };
          sgn(0, 0.62, 0.155, 2.33, 3.9);                                                    // STAIRCASE
          const exS = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.16), new THREE.MeshBasicMaterial({ map: tExit, toneMapped: false })); mats.push(exS.material);
          exS.rotation.y = -Math.PI / 2; exS.position.set(ex - 0.02, 2.62, 3.9); G.add(exS);
          glowPlane(1.4, 0.8, 0x40ff80, 0.16, ex - 0.03, 2.6, 3.9, 0, -Math.PI / 2);
          // the hose reel: a red cabinet, its glass, the reel inside
          { const mCab = M({ color: 0xa8241c, roughness: 0.45 });
            box(0.04, 0.9, 0.75, X1 - 0.02, 1.25, 1.25, mCab, G, false);                       // its back
            for (const dy of [-0.435, 0.435]) box(0.22, 0.03, 0.75, X1 - 0.11, 1.25 + dy, 1.25, mCab, G, false);
            for (const dz of [-0.36, 0.36]) box(0.22, 0.9, 0.03, X1 - 0.11, 1.25, 1.25 + dz, mCab, G, false); }
          const reel = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.05, 8, 20), M({ color: 0xc02a20, roughness: 0.5 })); reel.rotation.y = Math.PI / 2; reel.position.set(X1 - 0.11, 1.25, 1.25); G.add(reel);
          const gl = new THREE.Mesh(new THREE.PlaneGeometry(0.68, 0.82), mGlass); gl.rotation.y = -Math.PI / 2; gl.position.set(X1 - 0.215, 1.25, 1.25); gl.renderOrder = 2; G.add(gl);
          sgn(0.5, 0.6, 0.15, 1.86, 1.25);                                                   // FIRE HOSE REEL
          walls.push(hidBox(0.3, 1.4, 0.85, X1 - 0.15, 0.7, 1.25, G));
          // the notice board, a few sheets pinned to it, and the bin under it
          box(0.03, 0.66, 0.92, X1 - 0.015, 1.45, 2.55, M({ color: 0x9a7650, roughness: 0.95 }), G, false);
          [[1.6, 2.32, 0.22, 0.3, 0xece4d2], [1.52, 2.62, 0.2, 0.26, 0xf2e8a8], [1.3, 2.78, 0.18, 0.22, 0xe6e0d4], [1.28, 2.42, 0.24, 0.18, 0xdcd6e2]]
            .forEach(([y, z, w, h, col]) => { const p = new THREE.Mesh(new THREE.PlaneGeometry(w, h), M({ color: col, roughness: 0.9 })); p.rotation.y = -Math.PI / 2; p.position.set(X1 - 0.033, y, z); G.add(p); });
          cyl(0.19, 0.17, 0.62, X1 - 0.28, 0.31, 2.55, M({ color: 0x4e5e52, roughness: 0.6 }), 16, G);
          walls.push(hidBox(0.45, 1.0, 0.45, X1 - 0.28, 0.5, 2.55, G)); }
        // the escalator, rising out of the floor below to its landing (the opening film rides it)
        { const e0 = new THREE.Vector3(-21.2, YVOID.floor, 6.25), e1 = new THREE.Vector3(GAP0 + 0.3, 0, 6.25);
          const len = e0.distanceTo(e1), ang = Math.atan2(e1.y - e0.y, e1.x - e0.x), mid = e0.clone().lerp(e1, 0.5);
          const truss = new THREE.Group(); truss.position.copy(mid); truss.rotation.z = ang; G.add(truss);
          box(len, 0.5, 1.1, 0, -0.35, 0, M({ color: 0x5e6266, roughness: 0.5, metalness: 0.6 }), truss, false);
          for (const sz of [-0.58, 0.58]) { box(len, 0.9, 0.06, 0, 0.35, sz, mGlassDirty, truss, false); box(len, 0.06, 0.1, 0, 0.82, sz, mRubber, truss, false); }
          // CP10 (the opening film rides it, and on a phone its steps were black slabs): steel skirts beside the steps, the
          // balustrade's light under each handrail (painted: an emissive strip, no lamp — v15.1). (The handrails' curl at
          // each end was tried and taken out: on a stair with no level run at its head, the curl stood tilted with the
          // incline and read from the step as two black horns.)
          { const mLightStrip = new THREE.MeshBasicMaterial({ color: 0xd2e2ee }); mats.push(mLightStrip);
            for (const sz of [-0.51, 0.51]) box(len, 0.24, 0.02, 0, 0.02, sz, mSteel, truss, false);
            for (const sz of [-0.545, 0.545]) box(len, 0.022, 0.012, 0, 0.73, sz, mLightStrip, truss, false); }
          // the steps: a grooved tread with its yellow nose and sides, a cleated riser, steel elsewhere (BoxGeometry's
          // groups: +x −x +y −y +z −z)
          const mTread = M({ map: tex(makeYinTread(THREE, cnv)), roughness: 0.42, metalness: 0.6 });
          const mRiser = M({ map: tex(makeYinRiser(THREE, cnv)), roughness: 0.5, metalness: 0.55 });
          const stepG = new THREE.BoxGeometry(0.4, 0.2, 1.0), nS = Math.floor(len / 0.4);
          const steps = new THREE.InstancedMesh(stepG, [mSteel, mRiser, mTread, mSteel, mSteel, mSteel], nS); const mtx = new THREE.Matrix4();
          for (let k = 0; k < nS; k++) { const t = (k + 0.5) / nS; const x = e0.x + (e1.x - e0.x) * t, y = e0.y + (e1.y - e0.y) * t; mtx.makeTranslation(x, y - 0.06, 6.25); steps.setMatrixAt(k, mtx); }
          steps.instanceMatrix.needsUpdate = true; steps.computeBoundingSphere(); G.add(steps);
          // its head's landing: a slab of the floor reaching out from the corridor's edge to the stair (CP10: a 3 cm plate
          // alone over the void read, from the last step, as a table), steel on top, glass on its two open sides, and a
          // short panel closing the railing's gap down to the landing's width
          { const lx0 = e1.x, lx1 = GAP1 + 0.3, lz0 = RZ, lz1 = 6.85, lcx = (lx0 + lx1) / 2, lcz = (lz0 + lz1) / 2, lw = lx1 - lx0, ld = lz1 - lz0;
            box(lw, 0.42, ld, lcx, -0.21, lcz, mSlab, G, false);
            box(lw, 0.012, ld, lcx, 0.006, lcz, mSteel, G, false);
            for (const [w, d, x, z] of [[lw, 0.06, lcx, lz1], [0.06, ld, lx1, lcz], [lx0 - GAP0, 0.06, (GAP0 + lx0) / 2, RZ]]) {
              box(w, 1.05, d, x, 0.525, z, mGlassDirty, G, false);
              box(Math.max(w, 0.08), 0.05, Math.max(d, 0.08), x, 1.07, z, mSteel, G, false);
            } }
          // the comb plates at its head and foot, yellow where the steps go under; the foot's own landing on the floor below
          { const mComb = M({ color: 0xd2ac26, roughness: 0.45, metalness: 0.4 });
            box(0.08, 0.02, 0.98, e1.x + 0.04, e1.y + 0.022, 6.25, mComb, G, false);
            box(1.6, 0.03, 1.2, e0.x - 0.8, e0.y + 0.015, 6.25, mSteel, G, false);
            box(0.08, 0.02, 0.98, e0.x - 0.04, e0.y + 0.035, 6.25, mComb, G, false); }
          yLive.escalator = { e0, e1, steps, nS, z: 6.25, v: 0.6 };    // (CP10: running up, 0.6 m a second — yTick; the opening film rides it)
        }
        // the EXIT at the corridor's west end, green over a shut fire door
        { const d = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 2.1), M({ color: 0x5a5e58, roughness: 0.6 })); d.rotation.y = Math.PI / 2; d.position.set(X0 + 0.01, 1.05, 2.5); G.add(d);
          const ex = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.16), new THREE.MeshBasicMaterial({ map: tExit, toneMapped: false })); mats.push(ex.material);
          ex.rotation.y = Math.PI / 2; ex.position.set(X0 + 0.02, 2.4, 2.5); G.add(ex);
          glowPlane(1.4, 0.8, 0x40ff80, 0.18, X0 + 0.03, 2.35, 2.5, 0, Math.PI / 2); }
      }

      /* ---- the people: the keeper behind her counter; the woman at the edge of the frame (hidden until CP5 calls) */
      // the keeper is CHAD'S Yin shop owner (v22.0: "use this model to become the shop owner of the yin amulet shop"),
      // on a retargeted standing idle and her own talking take (masters/v22.0/owners/make.sh)
      yLive.keeper = mkPerson('yinkeeper', { x: KEEP.x, z: KEEP.z, ry: -Math.PI / 2, height: 1.57, idle: 'Idle_9', talk: 'Talk_with_Left_Hand_on_Hip', idleRate: 0.8, talkRate: 0.9, talkWeight: 0.85, look: 0.8 });
      /* the woman at the edge of his sight: CHAD'S ghost ("Horror Ghost Character - Blood Stained Spirit", adhamasalah,
         Sketchfab, CC BY 4.0 — "You can use this female ghost model, if you need to show a ghost literally appearing in
         the scene"): long black hair down over her face, a white dress stained with blood, barefoot; standing still */
      yLive.girl = mkPerson('yinghost', { x: -1.2, z: -5.6, ry: Math.PI / 2, height: 1.6, still: true, hidden: true, ghost: true });
    }

    /* ---------------------------------------------------------- the people of this chapter
       Sized from POSED BONES and grounded on the lowest (the v3.8/v4.7 law), each take's foot centre measured so a
       crossfade between two takes authored apart never walks her through her counter (ch3's granny, v5.22), culled by
       a sphere round the posed skin (v18.5's law), the head's look laid on after the mixer and put back before it runs
       again (the v11.5 law). A failed download leaves the place empty, never a block of a person (v21.16). */
    const people = [];
    const _pv = new THREE.Vector3(), _pq = new THREE.Quaternion(), _pe = new THREE.Euler(), _hp = new THREE.Vector3(), _cp = new THREE.Vector3();
    function mkPerson(key, o) {
      /* (CP7: `o.parent` — a person may stand in another world's group, World H's at x +250; `wx` is where he stands in the
         world, which peopleTick compares with the player's x, so a world he is not in is not animated. `o.at` parks the
         idle take on one frame — a man who stands still on a take that walks; `o.then(P)` once he has landed; and
         `o.armFix`, chapter 3's stand-in shoulders, armsPost) */
      const parent = o.parent || worldY;
      const group = new THREE.Group(); group.position.set(o.x, 0, o.z); group.rotation.y = o.ry || 0; parent.add(group);
      let wx = o.x; for (let p = parent; p && p !== world; p = p.parent) wx += p.position.x;
      const P = { key, group, wx, model: null, mixer: null, idle: null, talk: null, head: null, headWrote: null, ready: false, o,
                  talkUntil: 0, talkW: 0, lookYaw: 0, lookPitch: 0, look: o.look || 0, rootIdle: new THREE.Vector3(), rootTalk: new THREE.Vector3(),
                  inner: null, alpha: o.hidden ? 0 : 1, mats: [] };
      if (o.hidden) group.visible = false;
      /* a STILL figure (`o.still`): a scan with no rig — Chad's ghost (tools/prepstatic.mjs: one mesh, in metres, the
         face to +z, the hem on y 0). As a ghost she is drawn in TWO passes, both in the transparent queue so the shop
         behind her is already painted: her depth first (no colour), then her colour on that depth only — so at 0.72
         she is one pale figure with her own hair in front of her own face, never a blend of her back through her
         front (v12.4: one baked mesh through the plain transparent path lost whole parts of the cyclist) */
      if (o.still) {
        parseOnce(key).then((gltf) => {
          if (!alive) return;
          const g = gltf.scene.clone(true);
          const bb = new THREE.Box3().setFromObject(g), s = o.height / Math.max(0.01, bb.max.y - bb.min.y);
          const inner = new THREE.Group(); inner.scale.setScalar(s); inner.position.y = -bb.min.y * s + 0.004; inner.add(g); group.add(inner);
          const pres = [];
          g.traverse(m => { if (!m.isMesh) return;
            m.castShadow = !LOW && !o.ghost; m.receiveShadow = false;
            for (const mm of [].concat(m.material)) { const t = mm && mm.map;       // a generated scan's atlas: no mipmaps (v19.8)
              if (t && t.generateMipmaps !== false) { t.generateMipmaps = false; t.minFilter = THREE.LinearFilter; t.needsUpdate = true; } }
            if (o.ghost) {
              const col = m.material.clone(); col.transparent = true; col.depthWrite = false; col.depthFunc = THREE.LessEqualDepth; col.opacity = 1;
              m.material = col; m.renderOrder = 41; P.mats.push(col); mats.push(col);
              const pre = new THREE.MeshBasicMaterial({ colorWrite: false, depthWrite: true, transparent: true, opacity: 1,
                polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 2 }); mats.push(pre);   // a hair behind: her colour always passes it
              const pm = new THREE.Mesh(m.geometry, pre); pm.renderOrder = 40;
              pm.position.copy(m.position); pm.quaternion.copy(m.quaternion); pm.scale.copy(m.scale); pres.push([m.parent, pm]);
            } });
          for (const [par, pm] of pres) par.add(pm);
          P.inner = inner; P.model = g; P.mixer = null; P.scale = s; P.ready = true;
        }).catch(err => { console.warn(key + ' failed to load', err); ctx.loadFail && ctx.loadFail(key, err); });
        people.push(P);
        return P;
      }
      parseOnce(key).then((gltf) => {
        if (!alive) return;
        const g = cloneSkinned(gltf.scene);
        g.traverse(m => { if (m.isMesh) { m.castShadow = !LOW && !o.ghost; m.receiveShadow = false;
          /* these are Meshy scans (Chad's people): black hair packed flush against white cloth in the atlas, so every
             shrunken copy of the sheet greys the hair — drawn without mipmaps, e3c2's v19.8 law (zavNoMip, v5.11);
             the photographs had the girl as a grey mannequin at the edge of the frame */
          for (const mm of [].concat(m.material)) { const t = mm && mm.map;
            if (t && t.generateMipmaps !== false) { t.generateMipmaps = false; t.minFilter = THREE.LinearFilter; t.needsUpdate = true; } }
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
          const ts = o.at != null ? [o.at] : [0, 1, 2, 3, 4, 5].map(k => idleC.duration * k / 6);   // a parked take: sized and grounded on its one frame
          for (const tt of ts) {
            mx.setTime(tt); g.updateMatrixWorld(true);
            g.traverse(b => { if (!b.isBone) return; b.getWorldPosition(_pv); lo = Math.min(lo, _pv.y); hi = Math.max(hi, _pv.y); });
          }
          a.stop();
        }
        if (!(hi > lo)) { console.warn(key + ': no bones to size by'); return; }
        const crown = (() => { let c = false; g.traverse(b => { if (b.isBone && /HeadTop_End|head_end|headtop/i.test(b.name)) c = true; }); return c; })();
        const s = o.height / ((hi - lo) / (crown ? 1 : 0.935));
        const inner = new THREE.Group(); inner.scale.setScalar(s); inner.position.y = -lo * s + 0.005; inner.add(g); group.add(inner);
        P.inner = inner; P.model = g; P.mixer = mx; P.scale = s;
        if (idleC) { P.idle = mx.clipAction(idleC); P.idle.reset().setEffectiveTimeScale(o.idleRate || 1).setEffectiveWeight(1).play();
                     if (o.at != null) { P.idle.time = o.at; P.idle.setEffectiveTimeScale(0); } }
        g.traverse(b => { if (b.isBone && /Hips(_\d+)?$/.test(b.name) && !P.hips) P.hips = b; });
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
        if (o.then) o.then(P);
        redoShadows();
      }).catch(err => { console.warn(key + ' failed to load', err); ctx.loadFail && ctx.loadFail(key, err); });
      people.push(P);
      return P;
    }
    /* CHAPTER 3's STAND-IN SHOULDERS (its armsPre/armsPost, v21.1): a take retargeted onto a rig from another carries
       the source's shoulders a little shrugged and its arms ~14° out — each shoulder and upper arm is turned toward the
       body's own down by a few degrees after the mixer, and put back before it writes again (the v11.5 law) */
    const _amA = new THREE.Vector3(), _amB = new THREE.Vector3(), _amD = new THREE.Vector3(), _amQ = new THREE.Quaternion(), _amP = new THREE.Quaternion();
    function armsPre(P) { if (P.armWrote) P.armBones.forEach((b, i) => b.quaternion.copy(P.armWrote[i])); }
    function armsPost(P) {
      const F = P.o.armFix; if (!F || !P.model || !P.hips) return;
      if (!P.armBones) {
        const find = (re) => { let q = null; P.model.traverse(b => { if (!q && b.isBone && re.test(b.name)) q = b; }); return q; };
        P.armBones = [find(/LeftShoulder(_\d+)?$/), find(/RightShoulder(_\d+)?$/), find(/LeftArm(_\d+)?$/), find(/RightArm(_\d+)?$/)];
        P.armNeck = find(/Neck(_\d+)?$/);
        if (P.armBones.some(b => !b) || !P.armNeck) { P.o.armFix = null; P.armBones = null; return; }
        P.armWrote = P.armBones.map(b => b.quaternion.clone());
      }
      P.armBones.forEach((b, i) => P.armWrote[i].copy(b.quaternion));
      P.model.updateMatrixWorld(true);
      P.hips.getWorldPosition(_amA); P.armNeck.getWorldPosition(_amB); _amD.subVectors(_amA, _amB).normalize();   // the body's own down
      P.armBones.forEach((b, i) => {
        const ch = b.children.find(c => c.isBone); if (!ch) return;
        b.getWorldPosition(_amA); ch.getWorldPosition(_amB);
        _amB.sub(_amA).normalize(); _amA.crossVectors(_amB, _amD);
        if (_amA.lengthSq() < 1e-8) return;
        _amA.normalize(); b.parent.getWorldQuaternion(_amP); _amA.applyQuaternion(_amP.invert());
        b.quaternion.premultiply(_amQ.setFromAxisAngle(_amA, THREE.MathUtils.degToRad(i < 2 ? F.sh : F.arm)));
        b.updateMatrixWorld(true);
      });
    }
    /* she speaks: the talking take eased in over her idle for the line's length, on WALL time */
    function personTalk(P, secs) { if (P) P.talkUntil = performance.now() / 1000 + secs; }
    function peopleTick(wdt) {
      for (const P of people) {
        if (!P.ready || !P.group.visible || Math.abs(P.wx - yaw.position.x) > 80) continue;
        if (P.head && P.headWrote) P.head.quaternion.copy(P.headWrote);
        armsPre(P);
        const want = performance.now() / 1000 < P.talkUntil ? (P.o.talkWeight || 1) : 0;
        P.talkW += (want - P.talkW) * (1 - Math.exp(-wdt * 3.2));
        if (P.talk) { P.talk.setEffectiveWeight(P.talkW); P.idle && P.idle.setEffectiveWeight(1 - P.talkW * 0.85); }
        if (P.mixer) P.mixer.update(wdt);                         // (a still figure has none)
        // the two takes stand her in different places: keep her feet where the idle puts them
        if (P.talk) { _pv.copy(P.rootTalk).sub(P.rootIdle).multiplyScalar(P.talkW); P.model.position.set(-_pv.x, 0, -_pv.z); }
        armsPost(P);
        if (P.head) {
          if (!P.headWrote) P.headWrote = new THREE.Quaternion();
          P.headWrote.copy(P.head.quaternion);
          let ty = 0, tp = 0;
          const filmLook = (hLive.look && P.wx > 100) || (endLive.on && P.wx < -100)    // CP7: the run-out film's stares; CP9: the endings;
                        || (oLive.on && oLive.where === 'mall' && Math.abs(P.wx) < 100);   // CP10: the keeper, as he comes in
          if (P.look > 0 && (getState() === 'play' || filmLook)) {
            P.head.getWorldPosition(_hp); camera.getWorldPosition(_cp);
            const dx = _cp.x - _hp.x, dz = _cp.z - _hp.z, dy = _cp.y - _hp.y;
            const a = Math.atan2(dx, dz) - P.group.rotation.y, yawTo = Math.atan2(Math.sin(a), Math.cos(a));
            if (Math.abs(yawTo) < 1.7 && Math.hypot(dx, dz) < (filmLook ? 12 : 7)) { ty = THREE.MathUtils.clamp(yawTo, -0.9, 0.9); tp = THREE.MathUtils.clamp(-Math.atan2(dy, Math.hypot(dx, dz)), -0.35, 0.3); }
          }
          const k = 1 - Math.exp(-wdt * 2.4);
          P.lookYaw += (ty * P.look - P.lookYaw) * k; P.lookPitch += (tp * P.look - P.lookPitch) * k;
          if (Math.abs(P.lookYaw) + Math.abs(P.lookPitch) > 1e-4) { _pe.set(P.lookPitch, P.lookYaw, 0, 'YXZ'); _pq.setFromEuler(_pe); P.head.quaternion.multiply(_pq); }
          // CP10: a head shaken "no" (the opening film's Golden Mile owner), on the film's own clock
          if (P.shakeAmp > 1e-4) { _pe.set(0, P.shakeAmp * Math.sin((P.shakeT || 0) * 11.0), 0, 'YXZ'); _pq.setFromEuler(_pe); P.head.quaternion.multiply(_pq); }
        }
      }
    }

    /* ---------------------------------------------------------- WORLD Y, alive
       Every moving thing in the shop on WALL time (the v7.4 law), in every state — a film shows the shop too. `k` is
       the shop's light (CP5's cold takes it down), `flameK` the candles', `redK` the altar's red, `smokeK` the joss's;
       nothing runs while he is in another world. */
    let yT = 0, tubeStut = 0;
    const _bm = new THREE.Matrix4();
    function yTick(wdt) {
      if (Math.abs(yaw.position.x) > 60 || wdt <= 0) return;
      yT += wdt;
      const L = yLive.k;
      // the tubes: steady, with the faint shimmer a fluorescent tube has (CP5a: they no longer stutter by
      // themselves — a working shop's lights work); the front fitting stutters only when the shop ANSWERS a look
      // (lookAnswer's bottles: on and off at sixteen a second for 0.9 s)
      let tk = 1;
      if (tubeStut > 0) { tubeStut -= wdt; tk = hash(Math.floor(yT * 16), 11) < 0.45 ? 0.12 : 1; }
      tk *= 0.97 + 0.03 * Math.sin(yT * 31);
      if (yLive.tube) yLive.tube.material.color.setRGB(0.06 + 0.87 * tk * L, 0.06 + 0.9 * tk * L, 0.07 + 0.93 * tk * L);
      for (const g of yLive.tubeGlow) g.material.opacity = g.userData.op * tk * L;
      { const t2 = 0.97 + 0.03 * Math.sin(yT * 29 + 1.3);
        if (yLive.tube2) yLive.tube2.material.color.setRGB(0.06 + 0.87 * t2 * L, 0.06 + 0.9 * t2 * L, 0.07 + 0.93 * t2 * L);
        for (const g of yLive.tubeGlow2 || []) g.material.opacity = g.userData.op * t2 * L; }
      // (CP5a: the corridor's far tube no longer dies down by itself; the corridor's fittings are steady)
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
      // CP10 · the escalator up out of the floor below, running (an UP escalator: its landing's blocker is the one way
      // nobody goes — down it); the opening film stands him on a step of it, at its own speed
      const ES = yLive.escalator;
      if (ES && ES.steps) {
        const L = ES.e0.distanceTo(ES.e1), sh = ((yT * ES.v) % (L / ES.nS)) / L;
        for (let k = 0; k < ES.nS; k++) {
          let u = (k + 0.5) / ES.nS + sh; if (u > 1) u -= 1;
          _bm.makeTranslation(ES.e0.x + (ES.e1.x - ES.e0.x) * u, ES.e0.y + (ES.e1.y - ES.e0.y) * u - 0.06, ES.z); ES.steps.setMatrixAt(k, _bm);
        }
        ES.steps.instanceMatrix.needsUpdate = true;
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
      // the dust, and the joss's smoke
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

    /* ============================================== THE TEMPLE AT SUNSET (CP6 · the merit film)
       S1·09: "Later I went to a temple and made a contribution dedicated to her." A Thai temple in Singapore at
       sunset, built for the one film that shows it: a courtyard of slabs with its bell in a little pavilion and a
       bodhi tree on a white plinth, the hall on its base with three stepped gables against the glow (chapter 2's
       recipes: slab roofs with tiles, gilt edges, naga bargeboards and chofa), the city's blocks beyond the wall, and
       inside — polished floor, red columns, Chad's Buddha at the back, Chad's monk on his dais by the east wall, the
       donation box by the door, the silver bowl and the brass vessel for kruat nam. 250 m from every world (the far
       plane is 160 m, v8.9) under a sky of its own (the engine's is centred on the origin, v21.0). Nobody walks here:
       it is drawn only while its film runs (worldM.visible), so play never pays for it, and the chapter's entry curtain
       has already drawn it once, forced visible, so nothing in it compiles or uploads on screen (v14.15/v15.1).
       Lit by the film's own daylight (M_DUSK outside, M_HALL in) — never a new light (v15.1). */
    const MZ = 250;
    const MHALL = { x0: -6, x1: 6, z0: -16, z1: -2, F: 0.45, H: 5.0, T: 0.3 };   // its floor on a 0.45 base; walls 5 m over it
    const MDOOR = { hw: 1.2, h: 3.2 };
    const MDAIS = { x: 5.0, z: -8.6, w: 1.4, d: 2.6, h: 0.45 };     // the monk's dais against the east wall; he faces −x
    const MKNEEL = { x: 3.2, z: -8.6 };                               // where he kneels before it, facing +x
    const MBOWL = { x: 3.78, z: -8.42 };                              // the bowl on the floor before his knees
    const MBOX = { x: -3.1, z: -3.5 };                                // the donation box, inside the door on the left
    const MTREE = { x: 9.4, z: 6.2, r: 1.75, h: 0.42 };               // the bodhi on its plinth, east of the hall's front
    const MBELL = { x: -9.0, z: 4.6 };                                // the bell in its pavilion, west of the path
    const MALT = { z: -15.25, w: 3.6, d: 1.3 };                       // the Buddha's altar against the back wall
    const worldM = new THREE.Group(); worldM.position.z = MZ; worldM.visible = false; world.add(worldM);
    const mLive = { on: false, shot: '', dusk: 0, duskTo: 0, flames: [], smoke: [], motes: [], petals: [], drops: [], ripples: [],
                    stream: null, streamOut: null, water: null, wet: null, mote: null, trail: [], bell: null, envelope: null, envIn: null,
                    vessel: null, bowl: null, bowl2: null, shafts: [], t: 0 };
    const merit = { monk: { model: null, bones: [], head: null, neck: null, rest: null, ready: false } };
    function buildWorldM() {
      const G = worldM, F = MHALL.F;
      const tSky = tex(makeMSky(THREE, cnv)), tSlab = tex(makeMSlabs(THREE, cnv)), tPlaster = tex(makeMPlaster(THREE, cnv));
      const tFloor = tex(makeMFloor(THREE, cnv)), tTile = tex(makeMTiles(THREE, cnv, '#c4622a', '#5a240e')), tTile2 = tex(makeMTiles(THREE, cnv, '#a8321c', '#561208'));
      const tEarth = tex(makeMEarth(THREE, cnv)), tGrass = tex(makeMGrass(THREE, cnv)), tWin = tex(makeMWindow(THREE, cnv));
      const tScreen = tex(makeMScreen(THREE, cnv)), tBox = tex(makeMBoxFront(THREE, cnv)), tEnv = tex(makeMEnvelope(THREE, cnv));
      const tPetal = tex(makeMLeaf(THREE, cnv)), tRip = tex(makeMRipple(THREE, cnv)), tStream = tex(makeMStream(THREE, cnv));
      const tGlow = yLive.tGlow || tex(makeYinGlow(THREE, cnv)), tFlame = yLive.tFlame || tex(makeYinFlame(THREE, cnv)), tSmoke = yLive.tSmoke || tex(makeYinSmoke(THREE, cnv));
      const mSlab = M({ map: tSlab, roughness: 0.88, color: 0xc8beb0 }); tSlab.repeat.set(16, 16);
      const mPlaster = M({ map: tPlaster, roughness: 0.9 }); tPlaster.repeat.set(3, 1);
      const mWhite = M({ color: 0xece6da, roughness: 0.85 });
      const mFloor = M({ map: tFloor, roughness: 0.22, metalness: 0.05 }); tFloor.repeat.set(6, 7);
      const mLac = M({ color: 0x7e140c, roughness: 0.32, metalness: 0.05 });
      const mLacD = M({ color: 0x4e0c06, roughness: 0.4 });
      const mTeak = M({ color: 0x4a2a16, roughness: 0.55 });
      const mSoffit = M({ color: 0x4a2c1a, roughness: 0.85 });
      const mEarth = M({ map: tEarth, roughness: 1 }); tEarth.repeat.set(2, 2);
      const mGrass = M({ map: tGrass, roughness: 1, color: 0xa8b090 }); tGrass.repeat.set(8, 8);
      const mWinGlow = new THREE.MeshBasicMaterial({ map: tWin, fog: false }); mats.push(mWinGlow);
      const mSilver = M({ color: 0xd8dadc, roughness: 0.18, metalness: 0.9 });
      const mBrass = M({ color: 0xc89a48, roughness: 0.26, metalness: 0.85 });
      const mSaffron = M({ color: 0xc8701c, roughness: 0.85 });
      const mCarpet = M({ color: 0x8a1c14, roughness: 0.95 });
      const gold = matGold;

      /* ---- the sky: a dome of its own, the sun low behind the hall and a little to its west (makeMSky) */
      { const sky = new THREE.Mesh(new THREE.SphereGeometry(138, 48, 24), new THREE.MeshBasicMaterial({ map: tSky, side: THREE.BackSide, fog: false, depthWrite: false }));
        mats.push(sky.material); sky.renderOrder = -5; sky.frustumCulled = false; G.add(sky); }

      /* ---- the ground: the courtyard's slabs, grass beyond the walls, the path's kerbs */
      { const yard = new THREE.Mesh(new THREE.PlaneGeometry(30, 28), mSlab); yard.rotation.x = -Math.PI / 2; yard.position.set(0, 0, 8); yard.receiveShadow = true; G.add(yard);
        const lawn = new THREE.Mesh(new THREE.PlaneGeometry(260, 260), mGrass); lawn.rotation.x = -Math.PI / 2; lawn.position.set(0, -0.02, 0); G.add(lawn);
        const under = new THREE.Mesh(new THREE.PlaneGeometry(14, 16), mSlab); under.rotation.x = -Math.PI / 2; under.position.set(0, 0.004, -9); G.add(under); }
      // the courtyard wall, white with gilt-capped piers; the gate at the south
      { const wallH = 1.7;
        const seg = (x0, z0, x1, z1) => { const L = Math.hypot(x1 - x0, z1 - z0), a = Math.atan2(z1 - z0, x1 - x0);
          const w = box(L, wallH, 0.24, (x0 + x1) / 2, wallH / 2, (z0 + z1) / 2, mWhite, G, false); w.rotation.y = -a;
          box(L + 0.08, 0.08, 0.32, (x0 + x1) / 2, wallH + 0.04, (z0 + z1) / 2, mLac, G, false).rotation.y = -a;
          for (let s = 0; s <= L + 0.01; s += 3.2) { const px = x0 + (x1 - x0) * s / L, pz = z0 + (z1 - z0) * s / L;
            box(0.42, wallH + 0.3, 0.42, px, (wallH + 0.3) / 2, pz, mWhite, G, false);
            const bud = new THREE.Mesh(new THREE.SphereGeometry(0.13, 10, 8), gold); bud.scale.y = 1.6; bud.position.set(px, wallH + 0.5, pz); G.add(bud); } };
        seg(-15, -20, -15, 22); seg(15, -20, 15, 22); seg(-15, 22, -2.2, 22); seg(2.2, 22, 15, 22); seg(-15, -20, 15, -20); }

      /* ---- THE HALL: its base, walls, door, windows; roofs in three steps; gables with naga and chofa */
      { const cx = 0, cz = (MHALL.z0 + MHALL.z1) / 2, W = MHALL.x1 - MHALL.x0, D = MHALL.z1 - MHALL.z0, T = MHALL.T, top = F + MHALL.H;
        box(W + 0.8, F, D + 0.8, cx, F / 2, cz, mWhite, G, false);                                      // the base
        box(W + 0.86, 0.06, D + 0.86, cx, F - 0.03, cz, gold, G, false);                                // its gilt lip
        for (let i = 0; i < 3; i++) box(3.4, 0.15, 0.4, 0, 0.075 + i * 0.15, MHALL.z1 + 1.2 - i * 0.4, mWhite, G, false);   // the steps
        // the walls: the back, the two sides, and the front in three pieces round the door
        const wall = (w, h, d, x, y, z) => box(w, h, d, x, y, z, mPlaster, G, false);
        wall(W, MHALL.H, T, cx, F + MHALL.H / 2, MHALL.z0 - T / 2);
        wall(T, MHALL.H, D + 2 * T, MHALL.x0 - T / 2, F + MHALL.H / 2, cz);
        wall(T, MHALL.H, D + 2 * T, MHALL.x1 + T / 2, F + MHALL.H / 2, cz);
        const side = (W / 2 - MDOOR.hw);
        wall(side, MHALL.H, T, MHALL.x0 + side / 2, F + MHALL.H / 2, MHALL.z1 + T / 2);
        wall(side, MHALL.H, T, MHALL.x1 - side / 2, F + MHALL.H / 2, MHALL.z1 + T / 2);
        wall(MDOOR.hw * 2, MHALL.H - MDOOR.h, T, 0, F + MDOOR.h + (MHALL.H - MDOOR.h) / 2, MHALL.z1 + T / 2);
        // the door's gilt frame and its pointed crown, outside and in; the two leaves folded back against the wall inside
        for (const zf of [MHALL.z1 + T + 0.01, MHALL.z1 - 0.01]) {
          for (const s of [-1, 1]) box(0.14, MDOOR.h, 0.05, s * (MDOOR.hw + 0.07), F + MDOOR.h / 2, zf, gold, G, false);
          box(MDOOR.hw * 2 + 0.28, 0.14, 0.05, 0, F + MDOOR.h + 0.07, zf, gold, G, false);
          const cr = new THREE.Mesh(new THREE.ShapeGeometry(mCrown(THREE, MDOOR.hw * 2 + 0.5, 1.2)), gold); cr.position.set(0, F + MDOOR.h + 0.14, zf); if (zf < MHALL.z1) cr.rotation.y = Math.PI; G.add(cr);
        }
        for (const s of [-1, 1]) { const leaf = box(MDOOR.hw, MDOOR.h - 0.05, 0.06, s * (MDOOR.hw + MDOOR.hw / 2 + 0.02), F + MDOOR.h / 2, MHALL.z1 - 0.06, mLac, G, false);
          box(MDOOR.hw * 0.7, 0.04, 0.02, leaf.position.x, F + 2.2, MHALL.z1 - 0.1, gold, G, false); box(MDOOR.hw * 0.7, 0.04, 0.02, leaf.position.x, F + 0.9, MHALL.z1 - 0.1, gold, G, false); }
        // windows: framed, crowned, glowing with the sunset from inside (painted, never a light)
        const winAt = [];
        for (const z of [-4.6, -12.4]) for (const s of [-1, 1]) winAt.push({ x: s > 0 ? MHALL.x1 : MHALL.x0, z, s });
        for (const w of winAt) {
          const xi = w.x - w.s * 0.005, xo = w.x + w.s * (T + 0.012);
          const glow = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 2.0), mWinGlow); glow.position.set(xi, F + 2.0, w.z); glow.rotation.y = w.s > 0 ? -Math.PI / 2 : Math.PI / 2; G.add(glow);
          const dark = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 2.0), mLacD); dark.position.set(xo, F + 2.0, w.z); dark.rotation.y = w.s > 0 ? Math.PI / 2 : -Math.PI / 2; G.add(dark);
          for (const xx of [xi - w.s * 0.03, xo]) {
            for (const dz of [-1, 1]) box(0.06, 2.12, 0.08, xx, F + 2.0, w.z + dz * 0.64, gold, G, false);
            box(0.06, 0.08, 1.36, xx, F + 0.96, w.z, gold, G, false);
            const cr = new THREE.Mesh(new THREE.ShapeGeometry(mCrown(THREE, 1.5, 0.8)), gold); cr.position.set(xx, F + 3.04, w.z);
            cr.rotation.y = (xx === xo) === (w.s > 0) ? Math.PI / 2 : -Math.PI / 2; G.add(cr);
          }
          mLive.shafts.push({ x: xi, z: w.z, s: w.s });
        }
        // the ceiling: dark teak boards and beams; the interior's dado
        const ce = new THREE.Mesh(new THREE.PlaneGeometry(W, D), mTeak); ce.rotation.x = Math.PI / 2; ce.position.set(cx, top - 0.01, cz); G.add(ce);
        for (let z = MHALL.z0 + 1.6; z < MHALL.z1; z += 2.4) box(W, 0.22, 0.18, cx, top - 0.12, z, mLacD, G, false);
        for (const s of [-1, 1]) { box(0.02, 0.9, D, s * (W / 2 - 0.01), F + 0.45, cz, mLac, G, false); box(0.03, 0.05, D, s * (W / 2 - 0.015), F + 0.92, cz, gold, G, false); }
        box(W, 0.9, 0.02, cx, F + 0.45, MHALL.z0 + 0.01, mLac, G, false);
        // the floor: polished stone; a red runner from the door to the altar
        const fl = new THREE.Mesh(new THREE.PlaneGeometry(W, D), mFloor); fl.rotation.x = -Math.PI / 2; fl.position.set(cx, F + 0.002, cz); fl.receiveShadow = true; G.add(fl);
        const run = new THREE.Mesh(new THREE.PlaneGeometry(1.4, D - 2.2), mCarpet); run.rotation.x = -Math.PI / 2; run.position.set(0, F + 0.006, cz + 0.6); G.add(run);
        for (const s of [-1, 1]) { const e = new THREE.Mesh(new THREE.PlaneGeometry(0.06, D - 2.2), gold); e.rotation.x = -Math.PI / 2; e.position.set(s * 0.73, F + 0.007, cz + 0.6); G.add(e); }
        // two rows of red-lacquered columns, gilt bands and lotus capitals
        const capG = new THREE.LatheGeometry([[0.2, 0], [0.24, 0.06], [0.3, 0.16], [0.34, 0.26], [0.36, 0.3]].map(([a, b]) => new THREE.Vector2(a, b)), 12);
        for (const s of [-1, 1]) for (const z of [-5.6, -10.4, -13.8]) {
          const x = s * 2.45;
          cyl(0.2, 0.2, MHALL.H - 0.35, x, F + (MHALL.H - 0.35) / 2, z, mLac, 14, G);
          for (const by of [0.5, 1.4, MHALL.H - 0.8]) cyl(0.215, 0.215, 0.07, x, F + by, z, gold, 14, G);
          const cap = new THREE.Mesh(capG, gold); cap.position.set(x, F + MHALL.H - 0.35, z); G.add(cap);
        }
        // the roofs in three steps, as chapter 2's: the hall's two tiers, then the porch's stepping forward over the steps
        const tileFor = (t0, slope, len) => { const t = t0.clone(); t.repeat.set(slope / 2.8, len / 2.8); t.needsUpdate = true; madeTex.push(t); return M({ map: t, roughness: 0.6 }); };
        const roofPair = (z0, z1, hw, eave, ridge, tt) => {
          const rise = ridge - eave, slope = Math.hypot(rise, hw), ang = Math.atan2(rise, hw), len = z1 - z0, tile = tileFor(tt, slope, len);
          for (const s of [-1, 1]) {
            const p = new THREE.Mesh(new THREE.BoxGeometry(slope, 0.16, len), [gold, gold, tile, mSoffit, gold, gold]);
            p.rotation.z = -s * ang; p.position.set(s * hw / 2, (eave + ridge) / 2 - 0.08 / Math.cos(ang), (z0 + z1) / 2); G.add(p);
          }
          box(0.24, 0.26, len, 0, ridge + 0.06, (z0 + z1) / 2, gold, G, false);
          return { ang };
        };
        const fins = [], finD = new THREE.Object3D();
        const nagaEdge = (x0, y0, x1, y1, z, s) => {
          const L = Math.hypot(x1 - x0, y1 - y0), nx = (y1 - y0) / L * s, ny = Math.abs(x1 - x0) / L, th = Math.atan2(-nx, ny);
          for (let d = 0.35; d < L - 0.2; d += 0.32) { const k = d / L;
            finD.position.set(x0 + (x1 - x0) * k + nx * 0.1, y0 + (y1 - y0) * k + ny * 0.1, z); finD.rotation.set(0, 0, th + s * 0.35); finD.scale.set(1, 1, 0.35); finD.updateMatrix(); fins.push(finD.matrix.clone()); }
          const g = new THREE.Group(); g.position.set(x0 + s * 0.05, y0 + 0.02, z); G.add(g);
          g.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(0, 0, 0), new THREE.Vector3(s * 0.16, 0.06, 0), new THREE.Vector3(s * 0.24, 0.26, 0), new THREE.Vector3(s * 0.2, 0.44, 0)]), 10, 0.05, 6, false), gold));
          const hd = new THREE.Mesh(new THREE.SphereGeometry(0.075, 10, 8), gold); hd.scale.set(1.3, 0.85, 0.8); hd.position.set(s * 0.25, 0.47, 0); g.add(hd);
          for (let c = 0; c < 3; c++) { const cr = new THREE.Mesh(new THREE.ConeGeometry(0.022, 0.14 - c * 0.02, 5), gold); cr.position.set(s * (0.2 - c * 0.05), 0.56 - c * 0.02, 0); cr.rotation.z = s * (0.3 + c * 0.25); g.add(cr); }
          g.scale.setScalar(1.6);
        };
        const gableFront = (z, hw, eave, ridge) => {
          const rise = ridge - eave, ang = Math.atan2(rise, hw), slope = Math.hypot(rise, hw);
          const carve = M({ map: tex(makeMGable(THREE, cnv, hw * 2, rise)), roughness: 0.5, metalness: 0.2, side: THREE.DoubleSide });
          const tg = new THREE.ShapeGeometry(mTri(THREE, hw * 1.9, rise * 0.95)), tu = tg.attributes.uv, tp = tg.attributes.position;
          for (let i = 0; i < tu.count; i++) tu.setXY(i, tp.getX(i) / (hw * 1.9) + 0.5, tp.getY(i) / (rise * 0.95));
          const tri = new THREE.Mesh(tg, carve); tri.position.set(0, eave, z); G.add(tri);
          box(hw * 1.9, 0.26, 0.14, 0, eave + 0.05, z + 0.05, gold, G, false);
          box(hw * 1.9, 0.12, 0.16, 0, eave + 0.24, z + 0.06, mLac, G, false);
          for (const s of [-1, 1]) { const b = box(slope + 0.35, 0.22, 0.12, s * hw / 2, (eave + ridge) / 2 + 0.1, z + 0.06, gold, G, false); b.rotation.z = -s * ang; nagaEdge(s * (hw + 0.1), eave + 0.05, 0, ridge + 0.15, z + 0.08, s); }
          const cf = []; for (let i = 0; i <= 10; i++) { const k = i / 10; cf.push(new THREE.Vector3(0, ridge + k * 1.3, z + k * k * 0.75)); }
          G.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(cf), 16, 0.08, 6, false), gold));
        };
        const RW = W + 2 * T, WT = top;
        const A = { hw: RW / 2 + 1.2, ridge: 12.4, z0: MHALL.z0 - T - 0.9, z1: MHALL.z1 + T + 0.9 };
        A.eave = (WT + 0.08 - 1.2 * A.ridge / A.hw) / (1 - 1.2 / A.hw);
        const lowerY = (d) => A.eave + (A.hw - d) * (A.ridge - A.eave) / A.hw;
        const B = { hw: A.hw - 1.5, ridge: 14.6, z0: A.z0 + 1.6, z1: A.z1 - 1.6 }; B.eave = lowerY(B.hw) + 0.6;
        roofPair(A.z0, A.z1, A.hw, A.eave, A.ridge, tTile);
        const rB = roofPair(B.z0, B.z1, B.hw, B.eave, B.ridge, tTile2);
        for (const s of [-1, 1]) { const dx = B.hw - 0.45, y0 = lowerY(dx) - 0.15, y1 = B.eave + 0.45 * Math.tan(rB.ang) - 0.1;
          box(0.12, y1 - y0, B.z1 - B.z0 - 0.4, s * dx, (y0 + y1) / 2, (B.z0 + B.z1) / 2, mWhite, G, false); }
        gableFront(A.z1, A.hw, A.eave, A.ridge); gableFront(B.z1, B.hw, B.eave, B.ridge);
        for (const t2 of [A, B]) { const tri = new THREE.Mesh(new THREE.ShapeGeometry(mTri(THREE, t2.hw * 1.9, (t2.ridge - t2.eave) * 0.95)), gold); tri.position.set(0, t2.eave, t2.z0); tri.rotation.y = Math.PI; G.add(tri); }
        // the porch: its own roof stepping forward over the steps, on two white pillars and a lacquered beam
        const P = { hw: 3.6, eave: 4.3, ridge: 6.9, z0: MHALL.z1 + T, z1: MHALL.z1 + 2.2 };
        roofPair(P.z0, P.z1, P.hw, P.eave, P.ridge, tTile); gableFront(P.z1, P.hw, P.eave, P.ridge);
        for (const s of [-1, 1]) { const px = s * 2.7, pz = MHALL.z1 + 1.9;
          box(0.62, 0.3, 0.62, px, 0.15, pz, mWhite, G, false); box(0.4, 4.0, 0.4, px, 0.3 + 2.0, pz, mWhite, G, false);
          for (const by of [0.7, 2.4, 3.9]) box(0.43, 0.07, 0.43, px, by, pz, gold, G, false);
          const cap = new THREE.Mesh(capG, gold); cap.scale.setScalar(1.05); cap.position.set(px, 4.25, pz); G.add(cap); }
        box(6.2, 0.3, 0.36, 0, 4.5, MHALL.z1 + 1.9, mLac, G, false);
        { const bladeIM = new THREE.InstancedMesh(new THREE.ConeGeometry(0.075, 0.24, 3), gold, fins.length);
          fins.forEach((m, i) => bladeIM.setMatrixAt(i, m)); bladeIM.instanceMatrix.needsUpdate = true; bladeIM.computeBoundingSphere(); G.add(bladeIM); }
        // little bells under the eaves
        { const hang = []; for (const s of [-1, 1]) for (let z = A.z1 - 0.6; z > A.z0 + 0.5; z -= 1.6) hang.push([s * (A.hw - 0.05), A.eave - 0.08, z]);
          const bellG = new THREE.LatheGeometry([[0, 0.09], [0.005, 0.09], [0.005, 0.0], [0.03, -0.005], [0.045, -0.04], [0.06, -0.1], [0.064, -0.11], [0, -0.11]].map(([a, b]) => new THREE.Vector2(a, b)), 10);
          const im = new THREE.InstancedMesh(bellG, gold, hang.length), d = new THREE.Object3D();
          hang.forEach(([x, y, z], i) => { d.position.set(x, y, z); d.rotation.set(0, i * 0.7, (hash(i, 77) - 0.5) * 0.12); d.scale.setScalar(1.6); d.updateMatrix(); im.setMatrixAt(i, d.matrix); });
          im.instanceMatrix.needsUpdate = true; im.computeBoundingSphere(); G.add(im); }
      }

      /* ---- inside: the altar, the Buddha, candles, flowers, incense; the monk's dais; the box; the bowl and vessel */
      { // the Buddha's altar: a red-and-gold screen on the back wall, three stepped tiers
        const scr = new THREE.Mesh(new THREE.PlaneGeometry(4.4, 4.2), M({ map: tScreen, roughness: 0.55, metalness: 0.15 })); scr.position.set(0, F + 2.2, MHALL.z0 + 0.03); G.add(scr);
        for (let i = 0; i < 3; i++) { const w = MALT.w - i * 0.6, d = MALT.d - i * 0.3, h = 0.42;
          box(w, h, d, 0, F + h / 2 + i * h, MALT.z - 0.15 + i * 0.15, i % 2 ? mLac : gold, G, false);
          box(w + 0.04, 0.03, d + 0.04, 0, F + (i + 1) * h, MALT.z - 0.15 + i * 0.15, gold, G, false); }
        const altTop = F + 3 * 0.42;
        thai('buddha', 0, altTop, MALT.z + 0.15, { s: 4.0, hd: true, hdAt: 2.5, parent: G, cast: false });
        for (const s of [-1, 1]) {
          thai('candle', s * 0.9, F + 2 * 0.42, MALT.z + 0.05, { parent: G, s: 1.4 });
          thai('orchid', s * 1.35, F + 0.42, MALT.z - 0.2, { parent: G, s: 1.3 });
          thai('lotusbowl', s * 0.55, F + 2 * 0.42, MALT.z + 0.1, { parent: G, s: 0.8 });
        }
        thai('incense', 0, F + 2 * 0.42, MALT.z + 0.3, { parent: G, s: 1.0 });
        // the flames on the altar and the dais, and the incense's smoke (painted; never a light)
        for (const [x, y, z] of [[-0.9, F + 2 * 0.42 + 0.34, MALT.z + 0.05], [0.9, F + 2 * 0.42 + 0.34, MALT.z + 0.05], [MDAIS.x - 0.55, F + MDAIS.h + 0.26, MDAIS.z + 1.0]]) {
          const fm = new THREE.SpriteMaterial({ map: tFlame, color: 0xffd090, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }); mats.push(fm);
          const fl = new THREE.Sprite(fm); fl.scale.set(0.05, 0.11, 1); fl.position.set(x, y, z); G.add(fl);
          const hm = new THREE.SpriteMaterial({ map: tGlow, color: 0xff9a40, transparent: true, opacity: 0.35, depthWrite: false, blending: THREE.AdditiveBlending }); mats.push(hm);
          const halo = new THREE.Sprite(hm); halo.scale.set(0.5, 0.5, 1); halo.position.set(x, y, z); G.add(halo);
          mLive.flames.push({ fl, halo, k: Math.random() * 6, y });
        }
        for (let i = 0; i < 6; i++) { const m = new THREE.SpriteMaterial({ map: tSmoke, color: 0xe8e0d8, transparent: true, opacity: 0, depthWrite: false }); mats.push(m);
          const sp = new THREE.Sprite(m); G.add(sp); mLive.smoke.push({ sp, t: i / 6, k: i * 1.7 }); }
        mLive.smokeAt = new THREE.Vector3(0, F + 2 * 0.42 + 0.3, MALT.z + 0.3);

        // the monk's dais: carpeted, gilt-edged, its back panel on the wall; a backrest cushion; a phan of flowers
        const dx = MDAIS.x, dz = MDAIS.z, dw = MDAIS.w, dd = MDAIS.d, dh = MDAIS.h;
        box(dw, dh, dd, dx, F + dh / 2, dz, mLac, G, false);
        box(dw + 0.04, 0.04, dd + 0.04, dx, F + dh, dz, gold, G, false);
        const top = new THREE.Mesh(new THREE.PlaneGeometry(dw - 0.1, dd - 0.1), mCarpet); top.rotation.x = -Math.PI / 2; top.position.set(dx, F + dh + 0.022, dz); G.add(top);
        const panel = new THREE.Mesh(new THREE.PlaneGeometry(dd, 2.6), M({ map: tScreen, roughness: 0.55, metalness: 0.15 })); panel.position.set(MHALL.x1 - 0.03, F + dh + 1.3, dz); panel.rotation.y = -Math.PI / 2; G.add(panel);
        thai('cushtri', MHALL.x1 - 0.32, F + dh, dz, { parent: G, ry: -Math.PI / 2, s: 1.0 });
        thai('phan', dx - 0.55, F + dh, dz - 0.95, { parent: G, s: 0.9 });
        thai('candle', dx - 0.55, F + dh, dz + 1.0, { parent: G, s: 0.9 });
        thai('reedmat', MKNEEL.x - 0.05, F, MKNEEL.z, { parent: G, ry: Math.PI / 2, s: 1.0 });
        // a ceremonial fan (talapat) standing in its holder beside him: a gilt-rimmed leaf on a lacquered pole
        { const fan = new THREE.Group(); fan.position.set(dx + 0.15, F + dh, dz - 0.95); G.add(fan);
          cyl(0.012, 0.012, 1.5, 0, 0.75, 0, mLacD, 8, fan);
          const leaf = new THREE.Mesh(new THREE.CircleGeometry(0.26, 24), M({ color: 0x8a1810, roughness: 0.6, side: THREE.DoubleSide })); leaf.scale.y = 1.25; leaf.position.y = 1.2; leaf.rotation.y = -Math.PI / 2; fan.add(leaf);
          const rim = new THREE.Mesh(new THREE.TorusGeometry(0.26, 0.012, 6, 32), gold); rim.scale.y = 1.25; rim.position.y = 1.2; rim.rotation.y = -Math.PI / 2; fan.add(rim); }

        // the donation box by the door: a lacquered stand, a teak box with its slot and its sign
        { const g = new THREE.Group(); g.position.set(MBOX.x, F, MBOX.z); G.add(g);
          box(0.72, 0.74, 0.5, 0, 0.37, 0, mLac, g, false); box(0.76, 0.03, 0.54, 0, 0.75, 0, gold, g, false);
          box(0.56, 0.44, 0.38, 0, 0.77 + 0.22, 0, mTeak, g, false);
          const fr = new THREE.Mesh(new THREE.PlaneGeometry(0.54, 0.42), M({ map: tBox, roughness: 0.6 })); fr.position.set(0, 0.99, 0.191); g.add(fr);
          box(0.58, 0.02, 0.4, 0, 1.22, 0, mTeak, g, false);                               // the lid, teak
          for (const [w, d, x, z] of [[0.6, 0.016, 0, 0.2], [0.6, 0.016, 0, -0.2], [0.016, 0.4, 0.29, 0], [0.016, 0.4, -0.29, 0]]) box(w, 0.024, d, x, 1.221, z, gold, g, false);   // its gilt edge
          box(0.30, 0.004, 0.064, 0, 1.232, 0, gold, g, false);                               // the brass slot plate
          const slot = new THREE.Mesh(new THREE.PlaneGeometry(0.24, 0.012), matDark); slot.rotation.x = -Math.PI / 2; slot.position.set(0, 1.2345, 0); g.add(slot); }   // the slot, flush (CP6: a raised black bar read as a block on the lid)
        // the envelope in the box's slot (the insert) and his own (the hand): the same drawn front
        { const mE = M({ map: tEnv, roughness: 0.85 }), mEb = M({ color: 0xf2ede0, roughness: 0.9 });
          const mk = () => { const e = new THREE.Group();
            const f = new THREE.Mesh(new THREE.PlaneGeometry(0.17, 0.095), mE); f.position.z = 0.0011; e.add(f);
            const b = new THREE.Mesh(new THREE.BoxGeometry(0.17, 0.095, 0.002), mEb); e.add(b);
            return e; };
          mLive.envelope = mk(); mLive.envelope.visible = false;                         // his, for kit.hold
          const ins = mk(); ins.rotation.set(0, 0, 0); ins.position.set(MBOX.x, F + 1.235 + 0.05, MBOX.z); ins.visible = false; G.add(ins); mLive.envIn = ins;
          owned.push({ dispose: () => mLive.envelope.traverse(o => { if (o.geometry) o.geometry.dispose(); }) }); }
        // the silver bowl and the brass vessel for kruat nam, on the floor before his knees
        { const bowl = new THREE.Group(); bowl.position.set(MBOWL.x, F, MBOWL.z); G.add(bowl);
          const prof = [[0.0, 0.0], [0.05, 0.0], [0.055, 0.012], [0.075, 0.03], [0.088, 0.055], [0.094, 0.075], [0.098, 0.082], [0.094, 0.082], [0.088, 0.074], [0.08, 0.05], [0.06, 0.026], [0.0, 0.016]];
          const bg = new THREE.LatheGeometry(prof.map(([a, b]) => new THREE.Vector2(a, b)), 40);
          const b = new THREE.Mesh(bg, mSilver); bowl.add(b);
          const ring = new THREE.Mesh(new THREE.TorusGeometry(0.096, 0.003, 6, 40), mSilver); ring.rotation.x = Math.PI / 2; ring.position.y = 0.082; bowl.add(ring);
          // its water: a disc whose level rises as it fills (mTick), with the ripples on it
          const wm = new THREE.MeshStandardMaterial({ color: 0x9fb6c0, roughness: 0.05, metalness: 0.1, transparent: true, opacity: 0.72 }); mats.push(wm);
          const water = new THREE.Mesh(new THREE.CircleGeometry(0.08, 32), wm); water.rotation.x = -Math.PI / 2; water.position.y = 0.022; water.visible = false; bowl.add(water);
          mLive.water = water; mLive.bowl = bowl;
          for (let i = 0; i < 5; i++) { const rm = new THREE.MeshBasicMaterial({ map: tRip, transparent: true, opacity: 0, depthWrite: false, color: 0xfff4e8 }); mats.push(rm);
            const r = new THREE.Mesh(new THREE.PlaneGeometry(0.05, 0.05), rm); r.rotation.x = -Math.PI / 2; r.position.y = 0.0225; bowl.add(r); mLive.ripples.push({ r, t: i / 5 }); }
          // the vessel: a small brass kendi — round body, a neck, a spout — held from above the frame, tipping
          const v = new THREE.Group(); G.add(v); mLive.vessel = v;
          const vb = new THREE.LatheGeometry([[0, 0], [0.035, 0.002], [0.055, 0.02], [0.062, 0.05], [0.055, 0.08], [0.03, 0.1], [0.018, 0.115], [0.02, 0.15], [0.026, 0.158], [0.0, 0.158]].map(([a, b]) => new THREE.Vector2(a, b)), 28);
          const body = new THREE.Mesh(vb, mBrass); v.add(body);
          const sp = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([new THREE.Vector3(0.04, 0.05, 0), new THREE.Vector3(0.08, 0.07, 0), new THREE.Vector3(0.11, 0.095, 0)]), 8, 0.007, 8, false), mBrass); v.add(sp);
          v.userData.spout = new THREE.Vector3(0.112, 0.096, 0);
          v.visible = false; }
        // the water itself: a thin stream (a tube re-shaped every frame from the spout to the surface) with its flow
        { const sm = new THREE.MeshBasicMaterial({ map: tStream, color: 0xe8f4ff, transparent: true, opacity: 0.7, depthWrite: false, side: THREE.DoubleSide }); mats.push(sm);
          tStream.wrapS = tStream.wrapT = THREE.RepeatWrapping;
          mLive.streamMat = sm; mLive.streamGeo = null;
          const st = new THREE.Mesh(new THREE.BufferGeometry(), sm); st.visible = false; st.frustumCulled = false; G.add(st); mLive.stream = st;
          for (let i = 0; i < 10; i++) { const gm = new THREE.SpriteMaterial({ map: tGlow, color: 0xfff0d8, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }); mats.push(gm);
            const s = new THREE.Sprite(gm); s.scale.set(0.012, 0.012, 1); s.visible = false; G.add(s); mLive.drops.push({ s, t: i / 10 }); } }
        // light through the west windows: slanted shafts of the sunset, dust turning in them (painted)
        for (const w of mLive.shafts) {
          if (w.s > 0) continue;
          const shm = new THREE.MeshBasicMaterial({ map: tex(makeMShaft(THREE, cnv)), color: 0xffc890, transparent: true, opacity: 0.22, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, fog: false }); mats.push(shm);
          const sh = new THREE.Mesh(new THREE.PlaneGeometry(5.2, 1.3), shm);
          sh.position.set(w.x + 2.3, F + 1.25, w.z + 0.9); sh.rotation.set(0, -0.62, -0.42); G.add(sh); w.mesh = sh;
        }
      }

      /* ---- the courtyard: the bell in its pavilion, the bodhi on its plinth, lamps, a spirit house, plants */
      { // the bell pavilion: four red posts, a small two-step roof, the bronze bell hanging with its striker
        const g = new THREE.Group(); g.position.set(MBELL.x, 0, MBELL.z); g.rotation.y = 0.5; G.add(g);
        box(2.6, 0.3, 2.6, 0, 0.15, 0, mWhite, g, false);
        for (const sx of [-1, 1]) for (const sz of [-1, 1]) { cyl(0.09, 0.09, 2.9, sx * 1.05, 0.3 + 1.45, sz * 1.05, mLac, 10, g); cyl(0.1, 0.1, 0.06, sx * 1.05, 0.9, sz * 1.05, gold, 10, g); }
        box(2.5, 0.16, 2.5, 0, 3.25, 0, mLac, g, false);
        const roof = new THREE.Mesh(new THREE.ConeGeometry(2.1, 1.2, 4, 1), M({ map: tTile, roughness: 0.6 })); roof.rotation.y = Math.PI / 4; roof.position.y = 3.95; g.add(roof);
        const roof2 = new THREE.Mesh(new THREE.ConeGeometry(1.1, 0.9, 4, 1), M({ map: tTile2, roughness: 0.6 })); roof2.rotation.y = Math.PI / 4; roof2.position.y = 4.75; g.add(roof2);
        const fin = new THREE.Mesh(new THREE.ConeGeometry(0.08, 1.0, 8), gold); fin.position.y = 5.6; g.add(fin);
        const swing = new THREE.Group(); swing.position.set(0, 3.15, 0); g.add(swing);
        cyl(0.012, 0.012, 0.4, 0, -0.2, 0, mLacD, 6, swing);
        const bg = new THREE.LatheGeometry([[0, 0.0], [0.04, 0.0], [0.07, -0.03], [0.12, -0.2], [0.17, -0.45], [0.22, -0.62], [0.24, -0.66], [0.0, -0.66]].map(([a, b]) => new THREE.Vector2(a, b)), 28);
        const bell = new THREE.Mesh(bg, M({ color: 0x8a6a34, roughness: 0.35, metalness: 0.8 })); bell.position.y = -0.4; swing.add(bell);
        mLive.bell = { swing, t: -9 };
        const striker = cyl(0.05, 0.05, 1.0, 0.5, 2.3, 0, mTeak, 8, g); striker.rotation.z = Math.PI / 2;
      }
      { // the bodhi's plinth: a white ring wall with a gilt lip, earth inside; the cloth round the trunk once it lands
        const t = MTREE;
        const ringO = new THREE.Mesh(new THREE.CylinderGeometry(t.r, t.r, t.h, 40, 1, true), mWhite); ringO.position.set(t.x, t.h / 2, t.z); G.add(ringO);
        const lip = new THREE.Mesh(new THREE.TorusGeometry(t.r, 0.06, 6, 48), gold); lip.rotation.x = Math.PI / 2; lip.position.set(t.x, t.h, t.z); G.add(lip);
        const earth = new THREE.Mesh(new THREE.CircleGeometry(t.r - 0.03, 40), mEarth); earth.rotation.x = -Math.PI / 2; earth.position.set(t.x, t.h - 0.02, t.z); G.add(earth);
        // the wet patch the water makes (a darker, glossier disc that grows), and the bowl that pours it (the insert)
        const wm = new THREE.MeshStandardMaterial({ color: 0x1c120a, roughness: 0.25, transparent: true, opacity: 0, depthWrite: false, alphaMap: tex(makeMWet(THREE, cnv)) }); mats.push(wm);
        const wet = new THREE.Mesh(new THREE.CircleGeometry(0.34, 28), wm); wet.rotation.x = -Math.PI / 2; wet.position.set(t.x - 0.62, t.h - 0.012, t.z + 0.42); G.add(wet); mLive.wet = wet;
        const b2 = mLive.bowl.clone(true); b2.visible = false; G.add(b2); mLive.bowl2 = b2;
        b2.traverse(o => { if (o === b2) return; if (o.material && o.material.transparent) o.visible = false; });   // (its own water hidden: the stream leaves it)
        // fallen bodhi leaves on the earth, lying flat, one instanced mesh (CP6: drawn roots, thick or thin, read as worms
        // and as cut cigars at the insert's distance; a planter under a bodhi has its leaves, not its roots, on show)
        { const lm = new THREE.MeshStandardMaterial({ map: tPetal, alphaTest: 0.45, side: THREE.DoubleSide, roughness: 0.85 }); mats.push(lm);
          const LN = 70, leaves = new THREE.InstancedMesh(new THREE.PlaneGeometry(0.075, 0.095), lm, LN);
          const lmx = new THREE.Matrix4(), lq = new THREE.Quaternion(), le = new THREE.Euler(), lc = new THREE.Color();
          for (let i = 0; i < LN; i++) {
            const a = hash(i, 51) * Math.PI * 2, rr = 0.35 + Math.sqrt(hash(i, 53)) * (t.r - 0.45);
            le.set(-Math.PI / 2 + (hash(i, 55) - 0.5) * 0.25, 0, hash(i, 57) * Math.PI * 2, 'XZY'); lq.setFromEuler(le);
            const s = 0.75 + hash(i, 59) * 0.5;
            lmx.compose(new THREE.Vector3(t.x + Math.cos(a) * rr, t.h - 0.016 + hash(i, 61) * 0.004, t.z + Math.sin(a) * rr), lq, new THREE.Vector3(s, s, s));
            leaves.setMatrixAt(i, lmx);
            leaves.setColorAt(i, lc.set([0xb8a060, 0x8a6a3a, 0xc8b070, 0x7a8a40, 0x9a7a44][i % 5]));
          }
          leaves.receiveShadow = true; leaves.computeBoundingSphere(); G.add(leaves); }
        // the warm glow the light is born in, on the wet earth (painted, additive)
        { const gg = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.9), new THREE.MeshBasicMaterial({ map: tGlow, color: 0xffd8a0, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, fog: false }));
          mats.push(gg.material); gg.rotation.x = -Math.PI / 2; gg.position.set(t.x - 0.62, t.h - 0.004, t.z + 0.42); gg.visible = false; G.add(gg); mLive.groundGlow = gg; }
        // bodhi leaves let go by the breeze (CP6: frangipani petals drew as white stars against the dusk), and the
        // light that rises from the water
        for (let i = 0; i < 18; i++) { const pm = new THREE.SpriteMaterial({ map: tPetal, color: [0xffffff, 0xe8e0a0, 0xc8d890][i % 3], transparent: true, opacity: 0, depthWrite: false }); mats.push(pm);
          const s = new THREE.Sprite(pm); s.visible = false; G.add(s); mLive.petals.push({ s, i }); }
        const mm = new THREE.SpriteMaterial({ map: tGlow, color: 0xfff6e0, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, fog: false }); mats.push(mm);
        mLive.mote = new THREE.Sprite(mm); mLive.mote.visible = false; G.add(mLive.mote);
        const hm = new THREE.SpriteMaterial({ map: tGlow, color: 0xffd8a0, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, fog: false }); mats.push(hm);
        mLive.moteHalo = new THREE.Sprite(hm); mLive.moteHalo.visible = false; G.add(mLive.moteHalo);
        for (let i = 0; i < 14; i++) { const tm = new THREE.SpriteMaterial({ map: tGlow, color: 0xfff0d0, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, fog: false }); mats.push(tm);
          const s = new THREE.Sprite(tm); s.visible = false; G.add(s); mLive.trail.push({ s, i }); }
      }
      // lamps along the path (warm, just lit: painted), a spirit house, potted plants and the kit's pieces
      for (const [x, z] of [[-2.6, 8], [2.6, 8], [-2.6, 14], [2.6, 14], [-2.6, 20], [2.6, 20]]) {
        cyl(0.05, 0.07, 2.4, x, 1.2, z, mLacD, 8, G);
        const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.16, 12, 10), new THREE.MeshBasicMaterial({ color: 0xffd8a0, fog: false })); mats.push(lamp.material); lamp.position.set(x, 2.5, z); G.add(lamp);
        const hm = new THREE.SpriteMaterial({ map: tGlow, color: 0xffb060, transparent: true, opacity: 0.4, depthWrite: false, blending: THREE.AdditiveBlending }); mats.push(hm);
        const h = new THREE.Sprite(hm); h.scale.set(1.3, 1.3, 1); h.position.set(x, 2.5, z); G.add(h);
      }
      thai('spirit', -11.5, 0, 14.5, { parent: G, ry: Math.PI / 2, s: 1.2 });
      for (const [x, z, k, s] of [[-4.2, 0.4, 'lotusbowl', 1.4], [4.2, 0.4, 'lotusbowl', 1.4], [-7.6, -1.5, 'travpalm', 1.6], [7.6, -1.5, 'travpalm', 1.6], [12.5, 15, 'banana', 1.5], [-12.6, 9, 'fern', 1.6], [6.6, 13.5, 'urnclay', 1.3], [-6.4, 13.2, 'waterjar', 1.2]])
        thai(k, x, 0, z, { parent: G, s, ry: hash(x, z) * 6 });
      // a small white chedi on the west, its spire gilt
      { const cg = new THREE.Group(); cg.position.set(-11.5, 0, -10); G.add(cg);
        for (let i = 0; i < 4; i++) box(3.2 - i * 0.7, 0.5, 3.2 - i * 0.7, 0, 0.25 + i * 0.5, 0, mWhite, cg, false);
        const bell = new THREE.Mesh(new THREE.SphereGeometry(0.9, 20, 14, 0, Math.PI * 2, 0, Math.PI / 2), mWhite); bell.scale.y = 1.4; bell.position.y = 2.0; cg.add(bell);
        const spire = new THREE.Mesh(new THREE.ConeGeometry(0.32, 3.4, 16), gold); spire.position.y = 4.9; cg.add(spire);
        for (let i = 0; i < 6; i++) { const r = new THREE.Mesh(new THREE.TorusGeometry(0.3 - i * 0.04, 0.04, 6, 16), gold); r.rotation.x = Math.PI / 2; r.position.y = 3.4 + i * 0.22; cg.add(r); } }
      // trees: the bodhi itself (always — the film is built on its roots), and the city's trees beyond the wall
      if (plantTrees) {
        treeStands.push(plantTrees(G, [{ x: MTREE.x, y: MTREE.h - 0.02, z: MTREE.z, h: 12.5, always: true, kind: 0 }], { seed: 271, tint: 0xf0c8a0, shadow: false }));
        treeStands.push(plantTrees(G, [[-13, 18], [13, 19], [-13.4, -4], [13.6, -6], [-20, 6], [20, 8], [-24, -14], [22, -20], [-6, 30], [8, 32], [-30, 24], [30, 26], [0, -30], [-16, -32], [16, -30]]
          .map(([x, z], i) => ({ x, z, h: 7 + (i % 4) * 1.4 })), { seed: 277, tint: 0xd8b090, lowKeep: 0.6 }));
      }
      // the city beyond: HDB blocks round the temple, their windows coming on (chapter 3's estate recipe, the game's block)
      parseOnce('hdb').then(gl => {
        if (!alive) return;
        const est = new THREE.Group(); G.add(est);
        for (const [x, z, ry] of [[-46, -62, 0.2], [-8, -78, -0.1], [34, -66, 0.35], [70, -30, 1.4], [-74, -18, -1.3], [62, 40, 0.9], [-60, 52, -0.6], [10, 92, 0.05]]) {
          const b = gl.scene.clone(true); b.scale.setScalar(0.001); b.rotation.y = ry; b.updateMatrixWorld(true);
          const bb = new THREE.Box3().setFromObject(b); b.position.set(x - (bb.min.x + bb.max.x) / 2, -bb.min.y, z - (bb.min.z + bb.max.z) / 2); est.add(b);
        }
        est.traverse(o => { if (o.isMesh) { o.castShadow = false; o.receiveShadow = false; } });
      }).catch(err => { console.warn('hdb failed to load', err); ctx.loadFail && ctx.loadFail('hdb', err); });

      /* ---- Chad's monk on his dais (chapter 3's shop monk, the same file): seated cross-legged on his own floor take,
         grounded on his posed skin, his hands joined by a two-bone solve with the palms measured off his own skin
         (e3c3's monkPray), his head a little bowed; while the chant runs his head dips on each of its four phrases */
      { const mk = merit.monk;
        const g0 = new THREE.Group(); g0.position.set(MDAIS.x + 0.12, F + MDAIS.h, MDAIS.z); g0.rotation.y = -Math.PI / 2; G.add(g0); mk.group = g0;
        const cush = box(0.72, 0.06, 0.68, 0, 0.03, 0.05, mSaffron, g0, false);
        parseOnce('monkshop').then((gltf) => {
          if (!alive) return;
          const g = cloneSkinned(gltf.scene);
          g.traverse(o => { if (o.isBone) mk.bones.push(o); if (o.isMesh) { o.castShadow = false; o.receiveShadow = false; } });
          g0.add(g); mk.model = g;
          g.updateMatrixWorld(true);
          let lo = Infinity, hi = -Infinity;
          for (const b of mk.bones) { b.getWorldPosition(_mv); lo = Math.min(lo, _mv.y); hi = Math.max(hi, _mv.y); }
          const crown = mk.bones.some(b => /HeadTop_End|head_end/.test(b.name));
          if (isFinite(lo) && hi > lo) g.scale.multiplyScalar(1.70 / ((hi - lo) / (crown ? 1 : 0.935)));
          const clip = (gltf.animations || []).find(c => c.name === 'Sit_Cross_Legged_on_Floor');
          if (clip) { const mixer = new THREE.AnimationMixer(g), act = mixer.clipAction(clip);
            act.play(); act.time = clip.duration * 0.3; act.paused = true; mixer.update(0);
            owned.push({ dispose: () => mixer.stopAllAction() }); }
          g.updateMatrixWorld(true);
          let sl = Infinity, seat = Infinity;
          g.traverse(o => {
            if (!o.isSkinnedMesh) return;
            o.skeleton.update();
            const hb = o.skeleton.bones.map(b => /hips|pelvis/i.test(b.name));
            const sI = o.geometry.attributes.skinIndex, sW = o.geometry.attributes.skinWeight, n = o.geometry.attributes.position.count;
            for (let i = 0; i < n; i += 7) {
              o.getVertexPosition(i, _mv); _mv.applyMatrix4(o.matrixWorld); if (_mv.y < sl) sl = _mv.y;
              if (sI && sW) { let w = 0; for (let k = 0; k < 4; k++) if (hb[sI.getComponent(i, k)]) w += sW.getComponent(i, k); if (w > 0.5 && _mv.y < seat) seat = _mv.y; }
            }
          });
          const cushTop = g0.position.y + 0.06;
          if (isFinite(sl)) g.position.y += (isFinite(seat) ? Math.max(cushTop - 0.008 - seat, cushTop - 0.045 - sl) : cushTop + 0.012 - sl) / g0.scale.y;
          g.updateMatrixWorld(true);
          mk.head = mkBone(mk, /(^|[^A-Za-z])Head(_\d+)?$|mixamorigHead(_\d+)?$/);
          if (mk.head) {
            const tp0 = mk.head.children.find(ch => ch.isBone && /HeadTop|head_end/i.test(ch.name)) || mk.head.children.find(ch => ch.isBone);
            if (tp0) { const fwd = new THREE.Vector3(-1, 0, 0), hp = mk.head.getWorldPosition(new THREE.Vector3()), tp = tp0.getWorldPosition(new THREE.Vector3());
              mkAim(mk.head, tp.sub(hp).normalize(), new THREE.Vector3(0, 1, 0).multiplyScalar(Math.cos(0.2)).addScaledVector(fwd, Math.sin(0.2)).normalize()); g.updateMatrixWorld(true); }
          }
          mkPray(mk, new THREE.Vector3(-1, 0, 0));
          mk.rest = mk.head ? mk.head.quaternion.clone() : null;
          g.updateMatrixWorld(true);
          // his culling sphere round his posed skin (v18.5's law), generous
          const bb = new THREE.Box3();
          g.traverse(o => { if (!o.isSkinnedMesh) return; o.skeleton.update(); const n = o.geometry.attributes.position.count, st = Math.max(1, Math.floor(n / 3000));
            for (let i = 0; i < n; i += st) { o.getVertexPosition(i, _mv); _mv.applyMatrix4(o.matrixWorld); bb.expandByPoint(_mv); } });
          if (!bb.isEmpty()) { const sph = bb.getBoundingSphere(new THREE.Sphere()); sph.radius = Math.max(sph.radius * 1.4, 1.1);
            g.traverse(o => { if (!o.isSkinnedMesh) return; o.frustumCulled = true; const inv = o.matrixWorld.clone().invert(), k = o.matrixWorld.getMaxScaleOnAxis() || 1;
              o.boundingSphere = new THREE.Sphere(sph.center.clone().applyMatrix4(inv), sph.radius / k); }); }
          mk.ready = true;
        }).catch(err => { console.warn('monk failed to load', err); ctx.loadFail && ctx.loadFail('monkshop', err); });
      }
    }
    /* the monk's bones and his añjali, e3c3's own (mAim, mPalmOf, mPalmTo, mPalmReach, monkPray), copied — a chapter
       imports nothing: turn a bone so a world direction `from` becomes `to`; find a hand's palm off its own skin; turn
       the palm to the other hand; solve each arm twice so the wrists stand the palms' thickness apart */
    const _mq = new THREE.Quaternion(), _mq2 = new THREE.Quaternion(), _mv = new THREE.Vector3();
    const mkBone = (mk, re) => mk.bones.find(b => re.test(b.name)) || null;
    function mkAim(bone, from, to) {
      _mq.setFromUnitVectors(from, to);
      bone.getWorldQuaternion(_mq2); _mq2.premultiply(_mq);
      const pq = bone.parent ? bone.parent.getWorldQuaternion(new THREE.Quaternion()) : new THREE.Quaternion();
      bone.quaternion.copy(pq.invert().multiply(_mq2));
    }
    function mkPalmOf(mk, hand, tip, S) {
      mk.model.updateMatrixWorld(true);
      const pts = [];
      mk.model.traverse(o => {
        if (!o.isSkinnedMesh || !o.skeleton) return;
        const bi = o.skeleton.bones.indexOf(hand), ti = tip ? o.skeleton.bones.indexOf(tip) : -1;
        const sI = o.geometry.attributes.skinIndex, sW = o.geometry.attributes.skinWeight;
        if (bi < 0 || !sI || !sW) return;
        o.skeleton.update();
        const n = o.geometry.attributes.position.count;
        for (let i = 0; i < n; i++) {
          let w = 0; for (let k = 0; k < 4; k++) { const j = sI.getComponent(i, k); if (j === bi || (ti >= 0 && j === ti)) w += sW.getComponent(i, k); }
          if (w < 0.6) continue;
          o.getVertexPosition(i, _mv); _mv.applyMatrix4(o.matrixWorld);
          pts.push(hand.worldToLocal(_mv.clone()));
        }
      });
      if (pts.length < 30) return null;
      const f = (tip ? tip.position.clone() : new THREE.Vector3(0, 1, 0)).normalize();
      const m = new THREE.Vector3(); for (const q of pts) m.add(q); m.multiplyScalar(1 / pts.length);
      const e1 = new THREE.Vector3(1, 0, 0); if (Math.abs(e1.dot(f)) > 0.9) e1.set(0, 0, 1);
      e1.addScaledVector(f, -e1.dot(f)).normalize();
      const e2 = new THREE.Vector3().crossVectors(f, e1), d = new THREE.Vector3();
      let saa = 0, sab = 0, sbb = 0;
      for (const q of pts) { d.subVectors(q, m); const a = d.dot(e1), b = d.dot(e2); saa += a * a; sab += a * b; sbb += b * b; }
      const th = 0.5 * Math.atan2(2 * sab, saa - sbb);
      const w = e1.clone().multiplyScalar(Math.cos(th)).addScaledVector(e2, Math.sin(th));
      let s3 = 0; for (const q of pts) { const x = d.subVectors(q, m).dot(w); s3 += x * x * x; }
      const thumb = w.clone().multiplyScalar(s3 < 0 ? -1 : 1);
      const palm = S === 'Left' ? new THREE.Vector3().crossVectors(f, thumb) : new THREE.Vector3().crossVectors(thumb, f);
      return { pts: pts.filter((_, i) => i % 2 === 0), f, palm: palm.normalize() };
    }
    function mkPalmTo(hand, pl, inward) {
      const hq = hand.getWorldQuaternion(new THREE.Quaternion());
      const Fv = pl.f.clone().applyQuaternion(hq).normalize();
      const N = pl.palm.clone().applyQuaternion(hq), Tv = inward.clone();
      N.addScaledVector(Fv, -N.dot(Fv)); Tv.addScaledVector(Fv, -Tv.dot(Fv));
      if (N.lengthSq() < 1e-8 || Tv.lengthSq() < 1e-8) return;
      N.normalize(); Tv.normalize();
      const ang = Math.atan2(new THREE.Vector3().crossVectors(N, Tv).dot(Fv), N.dot(Tv));
      _mq.setFromAxisAngle(Fv, ang);
      hand.getWorldQuaternion(_mq2); _mq2.premultiply(_mq);
      const pq = hand.parent ? hand.parent.getWorldQuaternion(new THREE.Quaternion()) : new THREE.Quaternion();
      hand.quaternion.copy(pq.invert().multiply(_mq2));
    }
    function mkPalmReach(hand, pl, inward) {
      hand.updateWorldMatrix(true, false);
      const wr = hand.getWorldPosition(new THREE.Vector3()), q = [];
      for (const pt of pl.pts) q.push(_mv.copy(pt).applyMatrix4(hand.matrixWorld).sub(wr).dot(inward));
      q.sort((x, y) => x - y);
      return Math.max(0.005, q[Math.floor(q.length * 0.97)] || 0);
    }
    function mkPray(mk, fwd) {
      const g = mk.model; g.updateMatrixWorld(true);
      const side = new THREE.Vector3(fwd.z, 0, -fwd.x), up = new THREE.Vector3(0, 1, 0);
      const chestB = mkBone(mk, /LeftShoulder(_\d+)?$/), chest = chestB && chestB.parent;
      if (!chest) return;
      const C = chest.getWorldPosition(new THREE.Vector3());
      for (const sd of [1, -1]) {
        const S = sd > 0 ? 'Left' : 'Right';
        const arm = mkBone(mk, new RegExp(S + 'Arm(_\\d+)?$')), fore = mkBone(mk, new RegExp(S + 'ForeArm(_\\d+)?$')), hand = mkBone(mk, new RegExp(S + 'Hand(_\\d+)?$'));
        if (!arm || !fore || !hand) continue;
        const tip = hand.children.find(ch => ch.isBone);
        const pl = mkPalmOf(mk, hand, tip, S), inward = side.clone().multiplyScalar(-sd);
        const solve = (spread) => {
          const sh = arm.getWorldPosition(new THREE.Vector3()), el = fore.getWorldPosition(new THREE.Vector3()), wr = hand.getWorldPosition(new THREE.Vector3());
          const a = sh.distanceTo(el), b = el.distanceTo(wr);
          const T0 = C.clone().addScaledVector(fwd, 0.10 + a * 0.55).addScaledVector(up, -0.09).addScaledVector(side, sd * spread);
          const dvec = T0.clone().sub(sh); let dl = dvec.length();
          dl = Math.min(Math.max(dl, Math.abs(a - b) + 0.01), a + b - 0.005);
          const dir = dvec.normalize();
          const pole = up.clone().multiplyScalar(-1).addScaledVector(side, sd * 0.55).addScaledVector(fwd, -0.15).normalize();
          const n = pole.addScaledVector(dir, -pole.dot(dir)).normalize();
          const cosA = (a * a + dl * dl - b * b) / (2 * a * dl), sinA = Math.sqrt(Math.max(0, 1 - cosA * cosA));
          const elbow = sh.clone().addScaledVector(dir, a * cosA).addScaledVector(n, a * sinA);
          mkAim(arm, el.clone().sub(sh).normalize(), elbow.clone().sub(sh).normalize());
          g.updateMatrixWorld(true);
          const el2 = fore.getWorldPosition(new THREE.Vector3()), wr2 = hand.getWorldPosition(new THREE.Vector3());
          const T1 = sh.clone().addScaledVector(dir, dl);
          mkAim(fore, wr2.clone().sub(el2).normalize(), T1.clone().sub(el2).normalize());
          g.updateMatrixWorld(true);
          const el3 = fore.getWorldPosition(new THREE.Vector3()), wr3 = hand.getWorldPosition(new THREE.Vector3());
          const hdir = tip ? tip.getWorldPosition(new THREE.Vector3()).sub(wr3).normalize() : wr3.clone().sub(el3).normalize();
          mkAim(hand, hdir, up.clone().multiplyScalar(0.92).addScaledVector(fwd, 0.25).addScaledVector(side, pl ? 0 : -sd * 0.12).normalize());
          g.updateMatrixWorld(true);
          if (pl) { mkPalmTo(hand, pl, inward); g.updateMatrixWorld(true); }
        };
        solve(0.035);
        if (pl) solve(mkPalmReach(hand, pl, inward) + 0.002);
      }
    }

    buildWorldY();                                   // here: after everything it reads at call time (above)
    buildWorldM();                                   // the merit film's temple (CP6): after World Y, whose painted flame, smoke and glow it borrows

    /* ============================================== WORLD H · CHAPTER 3'S SHOP, ON AN ORDINARY AFTERNOON (CP7)
       Chad: "the hanuman one can be the same shop that was in ep 3 chp 3". Chapter 3's World A by its own code —
       its map, its materials, the shop, the mall's corridor and its neighbours, from e3c3.js at v21.32, COPIED
       (a chapter never imports another; e3c2's film copied chapter 4's flat the same way) — under World H's group at
       x +250, less what Buddha Day put in it: no flags and lanterns over the room, no mats, no monk, the candles not
       lit, the clock at twenty past three; and the Luang Phu Tim's stand on the owner's counter EMPTY until the owner
       sets the new Hanuman on it. Everything between here and the people is chapter 3's, line for line and with its
       own comments, unless a comment says (World H: ...). The diners its kitchen bay lists are not seated here:
       chapter 3 seats them on baked stills of the shrine's sitters, which this chapter does not load (the place is
       left empty rather than drawn — v21.16). */
    function buildWorldH() {
      const world = worldH;                                // (chapter 3's World A stood at the origin; this one at x +250)
      /* ------------------------------------------------------------- the map
         WORLD A, THE SHOP: inner faces x -4.5…4.5, z -7 (the altar's wall) … 0
         (the glass front onto the mall), a 2.9 m T-bar ceiling. Glass counters
         down both sides — the staff's on the left, the OWNER's on the right
         with the LP Tim in its own case on top — wall cabinets of framed
         amulets behind the left, the old masters' photographs behind the
         right, the altar against the back wall and the celebration's mats in
         front of it. The mall's corridor runs past the glass, z 0…5. */
      const SHOP = { x0: -4.5, x1: 4.5, z0: -7.0, z1: 0.0, H: 2.9 };
      const MALL = { x0: -14, x1: 14, z0: 0.0, z1: 5.0, H: 3.6 };
      const SHR = { x: -250, z: 0 };                       // WORLD B's origin
      const SHRINE_IN = { x0: SHR.x - 4.5, x1: SHR.x + 4.5, z0: -10.0, z1: 0.0, H: 3.4 };
      /* v21.8 (Chad: "Add a monk to the front of the altar area ... The other customers/audience should be moved
         slightly behind the monk instead of being seated in the same row"): the monk sits ALONE before the altar
         (MONK), on his own cushion in front of a low step of offerings (STEP), and both rows of mats are 0.95 m
         further back than they were — the woman and the man in white kneel behind him, not beside him (0.7 was tried
         first: photographed from the side, the man in white knelt with his knees at the monk's back) */
      const ROWS_BACK = 0.95;
      const MAT = { x: -0.9, z: -4.6 + ROWS_BACK };        // his mat at the celebration
      const DOOR = { x0: -0.62, x1: 0.62, h: 2.25 };       // the glass double door (shut in play)
      const LCNT = { x0: -3.5, x1: -2.9, z0: -0.9, z1: -4.1, top: 1.0 };   // the staff's counter, its glass face to +x
      const RCNT = { x0: 2.9, x1: 3.5, z0: -1.0, z1: -3.9, top: 1.0 };     // the OWNER's counter, its face to -x
      const ALTAR = { x: 0, z: -6.65, w: 2.3, d: 0.70, h: 0.92 };         // the altar cabinet, its back to the wall (v21.8: 0.70 deep, the statue row's own depth)
      const FRONT = -5.5 + ROWS_BACK, SECOND = -4.6 + ROWS_BACK;           // the two rows of mats
      const MATS = [{ x: -1.6, z: FRONT }, { x: -0.55, z: FRONT }, { x: 0.55, z: FRONT }, { x: 1.6, z: FRONT },
                    { x: MAT.x, z: MAT.z }, { x: 0.35, z: SECOND }];
      const STEP = { w: 1.5, d: 0.24, h: 0.6, z: ALTAR.z + ALTAR.d / 2 + 0.12 };   // v21.8: the offerings' step before the cabinet
      const MONK = { x: 0, z: -5.6, ry: Math.PI };         // v21.8: the monk who leads the chant, facing the altar (Chad's pick), his back to the room
      const OWN = { x: 3.98, z: -2.45 };                   // the owner, behind his counter
      const STAFF = { x: -3.92, z: -2.35 };                // the staff man, behind the other
      const LPT = { x: 3.1, z: -2.0 };                     // the LP Tim's case on the owner's counter
      const MSTR = { y0: 1.90, h: 0.50, z: -2.5 };           // v21.9: the old masters' one row on the owner's wall (its lowest edge, its height, its middle)
      const CLOCK = { x: 0, y: 2.56, z: -0.06 };           // over the door, inside, facing the shop

      /* ----------------------------------------------------------- materials */
      const tileTex = tex(makeShopTiles(THREE, cnv)); tileTex.repeat.set((SHOP.x1 - SHOP.x0) / 1.2, (SHOP.z1 - SHOP.z0) / 1.2);
      const terrTex = tex(makeTerrazzo(THREE, cnv)); terrTex.repeat.set((MALL.x1 - MALL.x0) / 1.2, (MALL.z1 - MALL.z0) / 1.2);
      const ceilTex = tex(makeCeilGrid(THREE, cnv)); ceilTex.repeat.set((SHOP.x1 - SHOP.x0) / 1.2, (SHOP.z1 - SHOP.z0) / 1.2);
      const mallCeilTex = tex(makeCeilGrid(THREE, cnv)); mallCeilTex.repeat.set((MALL.x1 - MALL.x0) / 1.2, (MALL.z1 - MALL.z0) / 1.2);
      const matFloor  = new THREE.MeshStandardMaterial({ map: tileTex, roughness: 0.32, metalness: 0.05 });
      const matTerr   = new THREE.MeshStandardMaterial({ map: terrTex, roughness: 0.45, metalness: 0.04 });
      const matCeil   = new THREE.MeshStandardMaterial({ map: ceilTex, roughness: 0.95 });
      const matMallCeil = new THREE.MeshStandardMaterial({ map: mallCeilTex, roughness: 0.95 });
      const matWall   = new THREE.MeshStandardMaterial({ color: 0xf1ece2, roughness: 0.92 });
      const matWallB  = new THREE.MeshStandardMaterial({ color: 0xe6dccb, roughness: 0.92 });   // the mall's
      const matDark   = new THREE.MeshStandardMaterial({ color: 0x15100e, roughness: 0.8 });
      const matRed    = new THREE.MeshStandardMaterial({ color: 0x8e1d14, roughness: 0.42 });
      const matRedD   = new THREE.MeshStandardMaterial({ color: 0x5a1009, roughness: 0.55 });
      const matGold   = new THREE.MeshStandardMaterial({ color: 0xd9a63c, roughness: 0.3, metalness: 0.55, emissive: 0x3a2406, emissiveIntensity: 0.6 });
      const matWood   = new THREE.MeshStandardMaterial({ color: 0x3e2414, roughness: 0.5 });
      const matWoodL  = new THREE.MeshStandardMaterial({ color: 0x8a5a34, roughness: 0.55 });
      const matSteel  = new THREE.MeshStandardMaterial({ color: 0xb8bcc2, roughness: 0.3, metalness: 0.7 });
      /* the shutters' roller boxes, painted steel: in polished steel they mirrored the sky's environment and read as a
         glowing lavender strip across the top of every shutter (VB-7) */
      const matBoxSteel = new THREE.MeshStandardMaterial({ color: 0x5c6066, roughness: 0.62, metalness: 0.3 });
      const matAlu    = new THREE.MeshStandardMaterial({ color: 0xc9ccd0, roughness: 0.35, metalness: 0.6 });
      const matChrome = new THREE.MeshStandardMaterial({ color: 0xe8ecf0, roughness: 0.12, metalness: 0.9 });
      const matCream  = new THREE.MeshStandardMaterial({ color: 0xe9dfc8, roughness: 0.9 });
      const matBlack  = new THREE.MeshStandardMaterial({ color: 0x1a1a1c, roughness: 0.45 });
      const matWhite  = new THREE.MeshStandardMaterial({ color: 0xf4f2ec, roughness: 0.6 });
      const matProxy  = new THREE.MeshStandardMaterial({ color: 0x8d7a66, roughness: 0.9 });
      const matGlass  = new THREE.MeshStandardMaterial({ color: 0xd8e6ee, roughness: 0.06, metalness: 0.1, transparent: true, opacity: 0.13,
                                                          depthWrite: false, side: THREE.DoubleSide });
      const matGlassS = new THREE.MeshStandardMaterial({ color: 0xe8f0f4, roughness: 0.05, metalness: 0.1, transparent: true, opacity: 0.22,
                                                          depthWrite: false, side: THREE.DoubleSide });   // a shelf's, seen edge-on
      const matPanel  = new THREE.MeshBasicMaterial({ color: 0xf6f8ff });                                 // an LED ceiling panel
      const matTube   = new THREE.MeshBasicMaterial({ color: 0xeef4ff });
      const matLED    = new THREE.MeshBasicMaterial({ color: 0xfff4e0 });
      const matFlame  = new THREE.MeshBasicMaterial({ color: 0xffc46a, transparent: true, opacity: 0.95, depthWrite: false, blending: THREE.AdditiveBlending });

      const shopG = new THREE.Group(); world.add(shopG);      // WORLD A
      const doorLeaves = [];                                  // (World H: the shop door's two leaves, which open)
      const mallG = new THREE.Group(); world.add(mallG);      // the corridor past the glass
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
      const texMat = (t, o = {}) => new THREE.MeshStandardMaterial({ map: tex(t), roughness: 0.8, ...o });
      /* an invisible box that is only a blocker (collision reads it whether it
         is drawn or not) */
      const hidBox = (w, h, d, x, y, z, parent = shopG) => { const m = box(w, h, d, x, y, z, matProxy, parent, false); m.visible = false; return m; };

      /* ============================================== WORLD A · THE SHOP
         ------------------------------------------------- floor, ceiling, walls */
      {
        const W = SHOP.x1 - SHOP.x0, D = SHOP.z1 - SHOP.z0;
        const fl = new THREE.Mesh(new THREE.PlaneGeometry(W, D), matFloor);
        fl.rotation.x = -Math.PI / 2; fl.position.set(0, 0, (SHOP.z0 + SHOP.z1) / 2); fl.receiveShadow = true; shopG.add(fl);
        const ce = new THREE.Mesh(new THREE.PlaneGeometry(W, D), matCeil);
        ce.rotation.x = Math.PI / 2; ce.position.set(0, SHOP.H, (SHOP.z0 + SHOP.z1) / 2); shopG.add(ce);
        walls.push(box(W + 0.4, SHOP.H, 0.2, 0, SHOP.H / 2, SHOP.z0 - 0.1, matWall, shopG, false));
        walls.push(box(0.2, SHOP.H, D, SHOP.x0 - 0.1, SHOP.H / 2, (SHOP.z0 + SHOP.z1) / 2, matWall, shopG, false));
        walls.push(box(0.2, SHOP.H, D, SHOP.x1 + 0.1, SHOP.H / 2, (SHOP.z0 + SHOP.z1) / 2, matWall, shopG, false));
        // a skirting all round, dark wood
        box(W, 0.1, 0.02, 0, 0.05, SHOP.z0 + 0.01, matWood, shopG, false);
        box(0.02, 0.1, D, SHOP.x0 + 0.01, 0.05, (SHOP.z0 + SHOP.z1) / 2, matWood, shopG, false);
        box(0.02, 0.1, D, SHOP.x1 - 0.01, 0.05, (SHOP.z0 + SHOP.z1) / 2, matWood, shopG, false);
        // six LED panels in the grid and a downlight over each counter's run
        for (const px of [-1.5, 1.5]) for (const pz of [-1.2, -3.0, -4.8]) {
          const p = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 1.2), matPanel);
          p.rotation.x = Math.PI / 2; p.position.set(px, SHOP.H - 0.005, pz); shopG.add(p);
        }
        for (const [dx, dz] of [[-3.2, -1.4], [-3.2, -2.6], [-3.2, -3.8], [3.2, -1.5], [3.2, -2.6], [3.2, -3.6], [0, -6.2]]) {
          const d = new THREE.Mesh(new THREE.CircleGeometry(0.07, 16), matLED);
          d.rotation.x = Math.PI / 2; d.position.set(dx, SHOP.H - 0.006, dz); shopG.add(d);
        }
        // the split air-conditioner over the staff's side, and its trunking
        box(0.95, 0.3, 0.24, -4.36, 2.55, -5.2, matWhite, shopG, false).rotation.y = Math.PI / 2;
        box(0.02, 0.04, 0.6, -4.25, 2.4, -5.2, matDark, shopG, false);
      }

      /* ---------------------------------------------------- the glass front
         Aluminium mullions, a transom at the door's head, a solid bulkhead over
         it (the clock hangs there), the door's long chrome pulls and its brass
         bell, the shop's name in gold leaf on the glass. The front is ONE
         blocker the whole width: the door is shut in play. */
      {
        const yT = DOOR.h, bulk = SHOP.H - yT;
        /* (World H: the door OPENS — he runs out through it, the run-out film — so the glass is two side panes and the
           doorway's two leaves, each hung on its outer stile, glass in an aluminium frame with its pull inside and out,
           swinging OUT into the corridor; in play the doorway is shut by an invisible blocker across the whole front, as
           chapter 3's one glass box was) */
        for (const s of [-1, 1]) box(SHOP.x1 - DOOR.x1, SHOP.H, 0.12, s * (DOOR.x1 + SHOP.x1) / 2, SHOP.H / 2, 0.06, matGlass, shopG, false);
        walls.push(hidBox(SHOP.x1 - SHOP.x0, SHOP.H, 0.12, 0, SHOP.H / 2, 0.06));
        for (const s of [-1, 1]) {
          const hinge = new THREE.Group(); hinge.position.set(s * DOOR.x1, 0, 0.06); shopG.add(hinge);
          const w = DOOR.x1 - 0.01, cx = -s * w / 2;                     // from its hinge to the middle, where the two meet
          box(w - 0.08, yT - 0.24, 0.012, cx, 0.18 + (yT - 0.24) / 2, 0, matGlass, hinge, false);
          for (const ex of [0.025, w - 0.025]) box(0.05, yT - 0.02, 0.05, -s * ex, (yT - 0.02) / 2, 0, matAlu, hinge, false);   // the stiles
          box(w, 0.06, 0.05, cx, yT - 0.05, 0, matAlu, hinge, false);   // the head rail
          box(w, 0.18, 0.05, cx, 0.09, 0, matAlu, hinge, false);        // the kick rail
          // its long chrome pull, inside and out, 0.1 m from where the two leaves meet (chapter 3's pulls, carried on the leaf)
          for (const fz of [-0.06, 0.06]) {
            const p = cyl(0.014, 0.014, 0.9, -s * (w - 0.1), 1.05, fz, matChrome, 8, hinge); p.castShadow = false;
            for (const py of [1.48, 0.62]) cyl(0.01, 0.01, 0.06, -s * (w - 0.1), py, fz / 2, matChrome, 6, hinge).rotation.x = Math.PI / 2;
          }
          doorLeaves.push({ hinge, s });
          if (s < 0) {                                                 // the OPEN sign hangs in the left leaf, on its cord
            const openM = texMat(makeSignTxt(THREE, cnv, 'OPEN  营业中', '#1f6a3a', '#fff6d0', 3.2), { emissive: 0xffffff, emissiveIntensity: 0.12 });
            openM.emissiveMap = openM.map; plane(0.36, 0.12, openM, 0.62 - 0.3, 1.72, -0.08, 0, hinge);
            plane(0.36, 0.12, texMat(makeSignTxt(THREE, cnv, 'THANK YOU  谢谢', '#1f6a3a', '#fff6d0', 3.2)), 0.62 - 0.3, 1.72, -0.082, Math.PI, hinge);
            for (const sx of [-1, 1]) box(0.003, yT - 1.78, 0.003, 0.62 - 0.3 + sx * 0.15, (yT + 1.78) / 2, -0.081, matBlack, hinge, false);
          }
        }
        box(SHOP.x1 - SHOP.x0, bulk, 0.16, 0, yT + bulk / 2, 0.02, matWall, shopG, false);           // the bulkhead
        box(SHOP.x1 - SHOP.x0, 0.06, 0.1, 0, yT, 0.03, matAlu, shopG, false);                         // the transom
        box(SHOP.x1 - SHOP.x0, 0.06, 0.1, 0, 0.03, 0.03, matAlu, shopG, false);                       // the sill
        for (const mx of [SHOP.x0 + 0.04, -2.6, DOOR.x0, DOOR.x1, 2.6, SHOP.x1 - 0.04]) box(0.06, yT, 0.1, mx, yT / 2, 0.03, matAlu, shopG, false);
        // (World H: the middle mullion and the door's pulls are the leaves' own now, above) its bell
        const bell = cyl(0.02, 0.045, 0.07, DOOR.x1 - 0.12, yT - 0.08, -0.05, matGold, 12, shopG); bell.castShadow = false;
        // the name in gold leaf, twice: on the left pane and the right (it reads backwards from inside, as it should)
        const nameM = new THREE.MeshBasicMaterial({ map: tex(makeGlassName(THREE, cnv)), transparent: true, depthWrite: false, side: THREE.DoubleSide });
        for (const sx of [-1.6, 1.6]) plane(1.8, 0.675, nameM, sx, 1.62, 0.005, 0, shopG);
        // (World H: the OPEN sign hangs in the left leaf now, above)
      }

      /* -------------------------------------- CHAD'S AMULET DISPLAY TRAY (v21.8)
         (Chad: "Use these 2 models to replace all of your generated rows of
         amulet displays in the shop, both the horizontal ones and vertical
         ones, as well as the standing shelves at the wall" — and then: "you
         removed too much detail from the amulet display trays and shelf. I
         wanted it as real 3d, not just texture".) Every tray in the shop is his
         scan, REAL 3D, at three levels picked by how far it is from the eye:
         within 1.25 m his scan cut to 6 % with its own maps (47.5k triangles —
         photographed at the closest a player can stand over a counter it reads
         as the full 792k scan); out to 2.4 m, and beyond it, the same geometry
         at 6k and 1.6k, its UV seams taken away by projecting the tray's own
         front view onto it (a scan's atlas will not cut that far with its
         seams in, and a cut across them smears one amulet's colour into the
         next — photographed). Two trays to a level-of-detail group, so the
         ones under the player's hands are full and the ones across the room
         are light. The drawn velvet and framed rows each group replaces stay
         drawn until both files have landed: a failed download costs the nicer
         prop, never the shop (the v4.7 rule). */
      const TRAY = { w: 1.9036, h: 1.0973, d: 0.0973 };          // the scan's own board, in its units: x centred, y 0..h, face +z
      const TRAY_ENV = 0.3;                                       // the room's reflection on its gilt frames (bracketed by photograph)
      const TRAY_NEAR = 1.25, TRAY_MID = 2.4;                      // where a pair goes to its next lighter level (m, from the pair's middle)
      const trayGroups = [];                                      // { lists: [tray placements], standIns, parent }
      let trayLevels = null;                                      // [{ geo, mat, node }] near, mid, far, once both files have landed
      const _trayMat = new Map();
      const trayMat = (m) => { let c = _trayMat.get(m); if (!c) { c = m.clone(); c.envMap = scene.environment || null; c.envMapIntensity = TRAY_ENV; _trayMat.set(m, c); owned.push({ dispose: () => c.dispose() }); } return c; };
      /* one group of trays: `list` is [x, y, z, euler, scale] per tray (the tray's middle), in pairs; `standIns` are the
         drawn things it replaces */
      function trayGroup(list, standIns, parent = shopG) {
        const g = { list, standIns, parent };
        trayGroups.push(g);
        if (trayLevels) trayBuild(g);
      }
      function trayBuild(g) {
        const q = new THREE.Quaternion(), v = new THREE.Vector3(), sv = new THREE.Vector3(), m4 = new THREE.Matrix4();
        const lift = new THREE.Matrix4().makeTranslation(0, -TRAY.h / 2, 0);   // the file stands on its base: its middle to the origin
        for (let k = 0; k < g.list.length; k += 2) {
          const pair = g.list.slice(k, k + 2), c = new THREE.Vector3();
          for (const [x, y, z] of pair) c.add(v.set(x, y, z));
          c.multiplyScalar(1 / pair.length);
          const lod = new THREE.LOD(); lod.position.copy(c); g.parent.add(lod);
          trayLevels.forEach((L, li) => {
            const I = new THREE.InstancedMesh(L.geo, L.mat, pair.length);
            pair.forEach(([x, y, z, e, sc], i) => {
              q.setFromEuler(e);
              m4.compose(v.set(x - c.x, y - c.y, z - c.z), q, sv.set(sc, sc, sc)).multiply(lift).multiply(L.node);
              I.setMatrixAt(i, m4);
            });
            I.instanceMatrix.needsUpdate = true; I.computeBoundingSphere();
            I.castShadow = false; I.receiveShadow = true;
            lod.addLevel(I, [0, TRAY_NEAR, TRAY_MID][li]);
          });
        }
        for (const o of g.standIns) o.visible = false;
      }
      Promise.all([parseOnce('traynear'), parseOnce('trayfar')]).then(([nearG, farG]) => {
        if (!alive) return;
        /* each level's geometry, material and the matrix of its node (the quantization's own scale and offset live on
           the node, and an instanced copy must carry them) */
        const level = (root, name) => {
          root.updateMatrixWorld(true);
          let mesh = null; root.traverse(o => { if (o.isMesh && (!name || o.name === name) && !mesh) mesh = o; });
          if (!mesh) throw new Error('tray file has no ' + (name || 'mesh'));
          return { geo: mesh.geometry, mat: trayMat(mesh.material), node: mesh.matrixWorld.clone() };
        };
        trayLevels = [level(nearG.scene), level(farG.scene, 'tray_mid'), level(farG.scene, 'tray_far')];
        for (const g of trayGroups) trayBuild(g);
      }).catch(err => { console.warn('the amulet trays failed to load', err); ctx.loadFail && ctx.loadFail('traynear', err); });

      /* ------------------------------------------------- a glass counter
         A dark-wood plinth, a glass box over velvet trays (two levels), chrome
         edges, an LED strip under the top's customer edge. `face` is the side
         the customer stands on (+1 = +x, -1 = -x).
         v21.8: the trays are Chad's — two rows across and as many as fit along,
         at both levels, each one's amulets standing up the right way for the
         customer (their tops away from him). */
      const trayTex = [0, 1, 2, 3].map(i => tex(makeVelvetTray(THREE, cnv, 11 + i * 7)));
      function counter(c, face, seed) {
        const g = new THREE.Group(); shopG.add(g);
        const w = c.x1 - c.x0, L = c.z0 - c.z1, cx = (c.x0 + c.x1) / 2, cz = (c.z0 + c.z1) / 2;
        box(w, 0.36, L, cx, 0.18, cz, matWood, g);
        box(w + 0.02, 0.03, L + 0.02, cx, 0.375, cz, matChrome, g, false);
        const vel = new THREE.MeshStandardMaterial({ map: trayTex[seed % 4], roughness: 0.9 });
        const vel2 = new THREE.MeshStandardMaterial({ map: trayTex[(seed + 1) % 4], roughness: 0.9 });
        const t1 = new THREE.Mesh(new THREE.PlaneGeometry(L - 0.06, w - 0.08), vel); t1.rotation.set(-Math.PI / 2, 0, face > 0 ? Math.PI / 2 : -Math.PI / 2);
        t1.position.set(cx, 0.4, cz); g.add(t1);
        box(w - 0.04, 0.012, L - 0.04, cx, 0.68, cz, matGlassS, g, false);                               // the glass shelf
        const t2 = t1.clone(); t2.material = vel2; t2.position.y = 0.69; g.add(t2);
        {
          /* Chad's trays at real size (an amulet ~4 cm across): two rows across the counter, `n` along it, lying on the
             velvet at both levels; the drawn amulets on the velvet go when they land, and the velvet stays as the floor
             they lie on */
          const S = 0.225, tw = TRAY.w * S, th = TRAY.h * S, tt = TRAY.d * S, gap = 0.012;
          const n = Math.floor((L - 0.05 + gap) / (tw + gap)), e = new THREE.Euler(-Math.PI / 2, face > 0 ? Math.PI / 2 : -Math.PI / 2, 0, 'YXZ');
          const list = [];
          for (const y0 of [0.401, 0.691]) for (let i = 0; i < n; i++) for (const a of [-1, 1])         // in pairs, across
            list.push([cx + a * (th / 2 + 0.012), y0 + tt / 2, cz + (i - (n - 1) / 2) * (tw + gap), e, S]);
          const plain = new THREE.MeshStandardMaterial({ color: 0x4e0a0d, roughness: 0.92 });
          owned.push({ dispose: () => plain.dispose() });
          /* the stand-in here is the drawn amulets, not the velvet: "hiding" it gives both levels the plain velvet (and
             hands the drawn materials to dispose(), which no longer meets them on a mesh) */
          const swap = { set visible(v) { if (!v && t1.material !== plain) { owned.push({ dispose: () => { vel.dispose(); vel2.dispose(); } }); t1.material = plain; t2.material = plain; } }, get visible() { return true; } };
          trayGroup(list, [swap], g);
        }
        // the glass: front, back, ends, top — the top a touch thicker, with a chrome rim
        box(0.012, 0.62, L, face > 0 ? c.x1 : c.x0, 0.69, cz, matGlass, g, false);
        box(0.012, 0.62, L, face > 0 ? c.x0 : c.x1, 0.69, cz, matGlass, g, false);
        for (const zz of [c.z0, c.z1]) box(w, 0.62, 0.012, cx, 0.69, zz, matGlass, g, false);
        box(w, 0.016, L, cx, c.top, cz, matGlassS, g, false);
        for (const zz of [c.z0, c.z1]) box(w + 0.02, 0.022, 0.02, cx, c.top, zz, matChrome, g, false);
        for (const xx of [c.x0, c.x1]) box(0.02, 0.022, L + 0.02, xx, c.top, cz, matChrome, g, false);
        for (const zz of [c.z0, c.z1]) for (const xx of [c.x0, c.x1]) box(0.022, 0.62, 0.022, xx, 0.69, zz, matChrome, g, false);
        const led = box(0.01, 0.012, L - 0.08, face > 0 ? c.x1 - 0.03 : c.x0 + 0.03, c.top - 0.03, cz, matLED, g, false);
        led.castShadow = false;
        solids.push(box(w, c.top, L, cx, c.top / 2, cz, matProxy, g, false)); g.children[g.children.length - 1].visible = false;
        return g;
      }
      counter(LCNT, 1, 0);
      counter(RCNT, -1, 2);
      /* the strips behind the counters are the staff's: between a counter's
         padded back and the cabinets' (0.30 m, open at both ends) the lens could
         walk in and stand inside the man there — a thin box fills each */
      solids.push(hidBox(0.02, 1.4, 3.2, -3.79, 0.7, (LCNT.z0 + LCNT.z1) / 2));
      solids.push(hidBox(0.02, 1.4, 3.0, 3.80, 0.7, (RCNT.z0 + RCNT.z1) / 2));

      /* -------------------------------------------- the owner's working end
         A wooden top at the back of his counter: the loupe, the lamp, the till,
         a receipt book, a calculator, his phone, his tea. */
      {
        const z = RCNT.z1 + 0.42, x = (RCNT.x0 + RCNT.x1) / 2, y = RCNT.top + 0.008;
        box(0.62, 0.02, 0.8, x, y, z, matWoodL, shopG);
        box(0.3, 0.16, 0.26, x + 0.08, y + 0.09, z - 0.2, matBlack, shopG);                   // the till
        box(0.22, 0.02, 0.18, x + 0.08, y + 0.18, z - 0.2, matDark, shopG).rotation.x = -0.4;
        box(0.12, 0.012, 0.16, x - 0.12, y + 0.016, z + 0.12, matDark, shopG);                 // the calculator
        box(0.16, 0.012, 0.22, x - 0.1, y + 0.014, z - 0.1, matCream, shopG);                  // the receipt book
        box(0.075, 0.008, 0.15, x + 0.14, y + 0.012, z + 0.22, matBlack, shopG).rotation.y = 0.3;   // his phone
        cyl(0.035, 0.03, 0.07, x + 0.18, y + 0.045, z + 0.04, matWhite, 12, shopG);            // his tea
        const lamp = new THREE.Group(); lamp.position.set(x + 0.2, y, z + 0.34); shopG.add(lamp);
        cyl(0.06, 0.07, 0.02, 0, 0.01, 0, matBlack, 14, lamp); cyl(0.008, 0.008, 0.34, 0, 0.18, 0, matChrome, 6, lamp);
        const sh = cyl(0.03, 0.07, 0.08, -0.06, 0.34, 0, matBlack, 14, lamp); sh.rotation.z = 0.7;
        const loupe = new THREE.Group(); loupe.position.set(x - 0.18, y + 0.01, z + 0.32); shopG.add(loupe);
        cyl(0.02, 0.02, 0.018, 0, 0.009, 0, matBlack, 14, loupe);
        cyl(0.018, 0.018, 0.004, 0, 0.02, 0, matGlassS, 14, loupe);
      }

      /* ----------------------------------- THE LP TIM, on its own stand (WORLD H: the stand empty — he gave the
         Luang Phu Tim away in chapter 3 — until the owner sets the new Hanuman on it; CHAD'S hanuman amulet in place
         of the scan below, the same two cuts and the same glow. Chapter 3's comment follows.)
         On a red velvet cushion at the front of his counter: "he never lets
         anyone hold that one". It is CHAD'S model — the light copy (timkplod)
         from across the shop, the full one (timkp) within 1.4 m, the v14.14
         rule (every amulet at full quality up close).
         v21.8 (Chad: "there is no need to have a glass box cover it. Remove the
         glass box. Also add a nice glowing effect to the amulet"): the acrylic
         lid is gone and the amulet stands OPEN on its cushion, leaning back a
         little to the eye on a small easel behind it, and it GLOWS — chapter
         3's recipe (v14.7): a warm halo round it that breathes, a ring of light
         on the counter round its stand, motes rising, and the amulet's own
         colours lit from within (lpGlowTick). The glow is the amulet's, not a
         game's marker: it is there whenever the amulet stands there, and goes
         with it into the owner's hand (lpHalo, the whole glow, hides with it). */
      const lpCase = new THREE.Group(); lpCase.position.set(LPT.x, RCNT.top + 0.01, LPT.z); shopG.add(lpCase);
      box(0.13, 0.03, 0.13, 0, 0.015, 0, matWood, lpCase);
      box(0.11, 0.012, 0.11, 0, 0.036, 0, new THREE.MeshStandardMaterial({ color: 0x7a0c12, roughness: 0.95 }), lpCase);
      const LP_H = 0.075, LP_TILT = -0.2;                     // its height on the stand; leaning back, its face up to a standing eye
      /* the tilt pivots at its foot on the cushion; the face (+z of the scan) turned to -x, the shop floor */
      const lpTilt = new THREE.Group(); lpTilt.position.set(0, 0.042, 0); lpTilt.rotation.set(LP_TILT, -Math.PI / 2, 0, 'YXZ'); lpCase.add(lpTilt);
      box(0.026, 0.05, 0.005, 0, 0.025, -0.014, matWood, lpTilt, false);                       // the easel, hidden behind it from the front
      const lpAmulet = new THREE.LOD(); lpAmulet.position.set(0, LP_H / 2, 0); lpTilt.add(lpAmulet);   // (the scan is baked centred on a unit height: its foot on the cushion)
      const lpProxy = box(0.05, 0.065, 0.012, 0, LP_H / 2, 0, matGold, lpTilt, false);          // stands until the models land
      lpProxy.visible = false; lpAmulet.visible = false;     // (World H: nothing on the stand until the owner sets it there)
      const lpMats = [];                                      // the scan's own materials, lit from within (lpGlowTick)
      /* THE GLOW, one group (lpHalo — the name every toggle already used): the halo, the ring, the motes. Additive
         light over the white counter top sums to white (the v8.8 law), so the halo is small and warm, a glow ROUND
         the amulet (ch3's: its first, 40 cm halo blew the paper behind it out) */
      const lpHalo = new THREE.Group(); lpCase.add(lpHalo);
      lpHalo.visible = false;                                // (World H: and no glow until then)
      const lpDot = (a, b) => { const t = makeSoftDot(a, b); madeTex.push(t); return t; };
      const lpHaloS = new THREE.Sprite(new THREE.SpriteMaterial({ map: lpDot('rgba(255,190,92,0.75)', 'rgba(255,150,40,0)'),
        transparent: true, depthWrite: false, fog: false, blending: THREE.AdditiveBlending }));
      lpHaloS.position.set(0.012, 0.042 + LP_H * 0.5, 0); lpHaloS.scale.setScalar(0.19); lpHalo.add(lpHaloS);   // a hair behind it
      const lpRing = new THREE.Mesh(new THREE.RingGeometry(0.085, 0.125, 40), new THREE.MeshBasicMaterial({
        color: 0xffc65a, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false, fog: false, blending: THREE.AdditiveBlending }));
      lpRing.rotation.x = -Math.PI / 2; lpRing.position.y = -0.006; lpHalo.add(lpRing);          // on the counter's glass round the stand
      const lpMoteM = new THREE.SpriteMaterial({ map: lpDot('rgba(255,236,178,1)', 'rgba(255,200,90,0)'), color: 0xffffff,
        transparent: true, depthWrite: false, fog: false, blending: THREE.AdditiveBlending });
      const lpMotes = [];
      for (let i = 0; i < 7; i++) { const sp = new THREE.Sprite(lpMoteM); sp.userData.ph = i / 7; sp.userData.a = i * 2.39; lpHalo.add(sp); lpMotes.push(sp); }
      function lpGlowTick(t) {
        const show = lpAmulet.visible && lpHalo.visible;
        for (const mt of lpMats) {
          // under the strict CSP the sheet arrives after the parse (rescueTextures)
          if (!mt.emissiveMap && mt.map) { mt.emissiveMap = mt.map; mt.needsUpdate = true; }
          if (!show) mt.emissiveIntensity = 0;
        }
        if (!show) return;
        const beat = 0.5 + 0.5 * Math.sin(t * 2.6);
        /* (v21.8: a shade brighter and wider than first built — photographed, the first glow read as a stain behind it) */
        lpHaloS.material.opacity = 0.46 + 0.36 * beat;
        lpHaloS.scale.setScalar(0.2 + 0.07 * beat);
        lpRing.material.opacity = 0.16 + 0.3 * beat;
        for (const mt of lpMats) mt.emissiveIntensity = 0.2 + 0.32 * beat;
        for (const sp of lpMotes) {
          const k = (t * 0.26 + sp.userData.ph) % 1, a = sp.userData.a + t * 0.6;
          const r = 0.045 + 0.025 * Math.sin(sp.userData.a * 3 + t);
          sp.position.set(Math.cos(a) * r * 0.6, 0.06 + k * 0.3, Math.sin(a) * r);
          sp.scale.setScalar(0.026 * Math.sin(Math.PI * k));
        }
      }
      Promise.all([parseOnce('hanuamuletlod'), parseOnce('hanuamulet')]).then(([lo, hd]) => {
        if (!alive) return;
        let nearMat = null;                                   // (World H: the far cut is geometry only — it wears the near one's lit material, v21.8)
        for (const [src, d] of [[hd.scene, 0], [lo.scene, 1.4]]) {
          const m = src.clone(true); m.scale.setScalar(LP_H);
          m.traverse(q => {
            if (!q.isMesh) return;
            q.castShadow = false; q.receiveShadow = false;
            if (d > 0 && nearMat) { q.material = nearMat; return; }
            /* its own copy of each material, so lighting it from within touches no other use of the scan (the bag's
               views and the unlock splash draw the same file) */
            q.material = (Array.isArray(q.material) ? q.material : [q.material]).map(mt => {
              if (!mt || !mt.emissive) return mt;
              const c = mt.clone(); c.emissive.set(0xffffff); c.emissiveIntensity = 0; c.emissiveMap = c.map || null;
              lpMats.push(c); owned.push({ dispose: () => c.dispose() }); return c;
            });
            if (q.material.length === 1) q.material = q.material[0];
            if (!nearMat) nearMat = q.material;
          });
          lpAmulet.addLevel(m, d);
        }
        lpProxy.visible = false;
      }).catch(err => { console.warn('the Hanuman amulet failed to load', err); ctx.loadFail && ctx.loadFail('hanuamulet', err); });

      /* ----------------------------------------------- CHAD'S DISPLAY SHELF (v21.8)
         His shelf of images — twenty on five shelves, Buddhas, monks, deities
         and hermits, 1.082 x 1.899 x 0.32 m, baked on its base centre facing +z
         — stands on the staff's wall behind the staff man (Chad: "the shelf
         behind the man was supposed to be the shelf i provided you") — three
         of them (the back-left corner's pair went for the lersi masks, later in
         v21.8). THREE levels in the one file, three index lists
         over one set of vertices (tools/lodpair.mjs LEVELS): EVERY triangle of
         his scan (594k) within 1.5 m of a shelf's middle (Chad: "you removed
         too much detail from the amulet display trays and shelf"), a 178k cut
         to 2.6 m, a 40k cut beyond — the same images across the shop. The
         images' gilt takes the room's reflection as the Buddha's does. */
      const SHELF = { w: 1.082, d: 0.32, mid: 0.95 };
      /* (CP8: `parent` — the tray shop stands two of them against its own wall, in World T) */
      function displayShelf(x, z, ry, standIn, parent = shopG) {
        parseOnce('amushelf').then(g => {
          if (!alive) return;
          const src = g.scene.clone(true), lod = new THREE.LOD();
          lod.position.set(x, SHELF.mid, z); lod.rotation.y = ry;
          for (const [name, d] of [['amushelf_near', 0], ['amushelf_mid', 1.5], ['amushelf_far', 2.6]]) {
            const n = src.getObjectByName(name);
            if (!n) throw new Error('amushelf has no ' + name);
            const w = new THREE.Group(); w.position.y = -SHELF.mid; w.add(n);
            w.traverse(q => { if (!q.isMesh) return; q.castShadow = false; q.receiveShadow = true; q.material = buddhaMat(q.material); });
            lod.addLevel(w, d);
          }
          parent.add(lod);
          if (standIn) standIn.visible = false;
        }).catch(err => { console.warn('the display shelf failed to load', err); ctx.loadFail && ctx.loadFail('amushelf', err); });
      }

      /* ------------------------------------------------ the staff's wall
         Three of his shelves, their backs to the wall, facing into the shop
         where three tall glass cabinets of framed amulets stood; the cabinets
         stand in until the shelf lands (a failed download costs the nicer
         prop, never the shop — v4.7). */
      const atlas = tex(makeAmuletAtlas(THREE, cnv));
      const kindMats = Array.from({ length: 8 }, (_, k) => {
        const t = atlas.clone(); t.needsUpdate = true; t.repeat.set(0.25, 0.5); t.offset.set((k % 4) * 0.25, k < 4 ? 0.5 : 0); madeTex.push(t);
        return new THREE.MeshStandardMaterial({ map: t, roughness: 0.6 });
      });
      {
        const CAB = { x: SHOP.x0 + 0.22, d: 0.4, h: 2.1, zs: [-0.95, -2.25, -3.55], w: 1.2 };
        const cabG = new THREE.Group(); shopG.add(cabG);                  // the stand-in: the old cabinets and their rows
        const frames = [], faces = Array.from({ length: 8 }, () => []);
        let n = 0;
        for (const cz of CAB.zs) {
          box(CAB.d, 0.24, CAB.w, CAB.x, 0.12, cz, matWood, cabG);                                    // plinth
          box(CAB.d, 0.06, CAB.w, CAB.x, CAB.h, cz, matWood, cabG);                                   // crown
          box(0.02, CAB.h - 0.24, CAB.w, CAB.x - CAB.d / 2 + 0.01, 0.24 + (CAB.h - 0.24) / 2, cz, matRedD, cabG, false);   // back
          for (const s of [-1, 1]) box(CAB.d, CAB.h - 0.24, 0.03, CAB.x, 0.24 + (CAB.h - 0.24) / 2, cz + s * CAB.w / 2, matWood, cabG, false);
          box(0.012, CAB.h - 0.3, CAB.w - 0.04, CAB.x + CAB.d / 2, 0.24 + (CAB.h - 0.24) / 2, cz, matGlass, cabG, false);   // the glass doors
          box(0.012, CAB.h - 0.3, 0.012, CAB.x + CAB.d / 2 + 0.006, 0.24 + (CAB.h - 0.24) / 2, cz, matChrome, cabG, false);
          for (let sh = 0; sh < 5; sh++) {
            const y = 0.32 + sh * 0.34;
            box(CAB.d - 0.04, 0.012, CAB.w - 0.06, CAB.x, y, cz, matGlassS, cabG, false);
            box(0.008, 0.01, CAB.w - 0.1, CAB.x + CAB.d / 2 - 0.03, y + 0.31, cz, matLED, cabG, false);
            for (let i = 0; i < 8; i++) {
              const zz = cz - CAB.w / 2 + 0.1 + i * 0.143, k = (i * 3 + sh * 5 + n) % 8;
              frames.push([CAB.x - 0.08, y + 0.075, zz]);
              faces[k].push([CAB.x - 0.0715, y + 0.075, zz]);
            }
          }
          solids.push(hidBox(CAB.d, CAB.h, CAB.w, CAB.x, CAB.h / 2, cz));
          n++;
        }
        const fG = new THREE.BoxGeometry(0.016, 0.12, 0.095), m4 = new THREE.Matrix4();
        const fI = new THREE.InstancedMesh(fG, matGold, frames.length); frames.forEach((p, i) => fI.setMatrixAt(i, m4.makeTranslation(...p)));
        fI.castShadow = false; cabG.add(fI);
        const pG = new THREE.PlaneGeometry(0.08, 0.105), rot = new THREE.Matrix4().makeRotationY(Math.PI / 2);
        faces.forEach((list, k) => {
          if (!list.length) return;
          const I = new THREE.InstancedMesh(pG, kindMats[k], list.length);
          list.forEach((p, i) => I.setMatrixAt(i, new THREE.Matrix4().makeTranslation(...p).multiply(rot)));
          I.castShadow = false; cabG.add(I);
        });
        /* his shelves on the cabinets' own spots: the back 1 cm off the wall, the front (+z in the file) turned to +x */
        for (const cz of CAB.zs) displayShelf(SHOP.x0 + SHELF.d / 2 + 0.012, cz, Math.PI / 2, cabG);
      }

      /* ------------------------------------------- the owner's wall: THE OLD MASTERS
         Over a low cabinet behind his counter, the shop's Thai calendar beside
         them, a shelf of boxed cases under.
         v21.8 · CHAD'S FIVE (Chad: "For the monk portraits in the amulet shop,
         replace all your generated ones with these 5. Credits are the URLs
         provided. Please use them cleanly in the game, with no alterations.
         This is important in respect to these masters"). The nine drawn
         likenesses are gone. Each photograph is its source's own bytes
         (masters/v21.8/portraits/SOURCES.md: the page, the file, its sha1),
         drawn UNLIT and outside tone mapping, so the screen shows each one's
         own colour; never cropped, scaled only as a whole, at its own aspect.
         Luang Phu Tim's two — the master of the shop's prized amulet — in
         plain gilt frames built ROUND the photographs; Luang Pu Thuad, Somdej
         Toh and Ajahn Mun, whose pictures carry their own gold frames, hang as
         they are (their corners are the file's own transparency). Since v21.9
         all five hang in ONE ROW high on the wall, over the owner's head (the
         row's own note, below). Credited in the panel, one row a page.
         v21.10 · A SIXTH (Chad: "Please add lp phiboon attached image here as
         one additional monk portrait to be on the same row as existing monk
         portraits on the wall in the amulet shop. Frame it nicely"): LP
         Phiboon, the photograph Chad attached, byte for byte, in a FINE frame —
         a two-step gilt moulding, a crimson velvet liner, gilt corner blocks
         with a rosette each — at the row's door end. */
      {
        const wx = SHOP.x1 - 0.012;
        /* v21.10: the fine frame's border (moulding + liner) and its liner, and its two materials */
        const FINE_B = 0.062, FINE_L = 0.028;
        const matVelvet = new THREE.MeshStandardMaterial({ color: 0x6a0e14, roughness: 0.96 });
        const matGoldHi = new THREE.MeshStandardMaterial({ color: 0xf2c86e, roughness: 0.24, metalness: 0.6, emissive: 0x4a3008, emissiveIntensity: 0.65 });
        /* an ImageBitmap upload ignores UNPACK_FLIP_Y (the WebGL rule), so the photograph's first row arrives at v = 0:
           the plane's own v is turned round to stand it upright — the picture itself is never touched */
        const portrait = (key, mime, w, h, y, z, frame) => {
          const g = new THREE.Group(); g.position.set(wx - 0.004, y, z); g.rotation.y = -Math.PI / 2; shopG.add(g);
          const fine = frame === 'fine';
          // a soft shadow on the wall, a little under it, so it hangs ON the wall rather than being painted into it
          const sw = fine ? (w + 2 * FINE_B) * 1.06 : w * 1.12, shh = fine ? (h + 2 * FINE_B) * 1.06 : h * 1.1;
          const sh = new THREE.Mesh(new THREE.PlaneGeometry(sw, shh), new THREE.MeshBasicMaterial({
            map: (() => { const t = makeSoftDot('rgba(0,0,0,0.55)', 'rgba(0,0,0,0)'); madeTex.push(t); return t; })(),
            transparent: true, depthWrite: false, fog: false }));
          sh.position.set(0.006, -0.018, -0.002); g.add(sh);
          if (fine) {
            /* v21.10 · THE FINE FRAME (LP Phiboon's — "Frame it nicely"): from the back, a dark board, a crimson velvet
               liner FINE_L wide round the photograph with a thin gilt slip at its inner edge, then a gilt moulding
               FINE_M wide in two steps — a broad flat and a raised bead along its inner edge, so the light catches a
               line round the picture — and a gilt block at each corner carrying a small rosette. The photograph itself
               is never touched: it lies on the velvet, inside the slip. */
            const L = FINE_L, M = FINE_B - FINE_L, W = w + 2 * FINE_B, H = h + 2 * FINE_B;
            box(W, H, 0.008, 0, 0, 0.004, matDark, g, false);                                   // the board
            box(w + 2 * L, h + 2 * L, 0.004, 0, 0, 0.010, matVelvet, g, false);                // the liner
            const sl = 0.006;                                                                    // the slip
            box(w + 2 * sl, sl, 0.006, 0, h / 2 + sl / 2, 0.013, matGoldHi, g, false);
            box(w + 2 * sl, sl, 0.006, 0, -h / 2 - sl / 2, 0.013, matGoldHi, g, false);
            box(sl, h, 0.006, -w / 2 - sl / 2, 0, 0.013, matGoldHi, g, false);
            box(sl, h, 0.006, w / 2 + sl / 2, 0, 0.013, matGoldHi, g, false);
            const iw = w + 2 * L, ih = h + 2 * L;                                              // the moulding's inner edge
            box(W, M, 0.026, 0, ih / 2 + M / 2, 0.013, matGold, g, false);                      // the broad flat, round
            box(W, M, 0.026, 0, -ih / 2 - M / 2, 0.013, matGold, g, false);
            box(M, ih, 0.026, -iw / 2 - M / 2, 0, 0.013, matGold, g, false);
            box(M, ih, 0.026, iw / 2 + M / 2, 0, 0.013, matGold, g, false);
            const bd = 0.009;                                                                    // the bead along it
            box(iw + 2 * bd, bd, 0.034, 0, ih / 2 + bd / 2, 0.017, matGoldHi, g, false);
            box(iw + 2 * bd, bd, 0.034, 0, -ih / 2 - bd / 2, 0.017, matGoldHi, g, false);
            box(bd, ih, 0.034, -iw / 2 - bd / 2, 0, 0.017, matGoldHi, g, false);
            box(bd, ih, 0.034, iw / 2 + bd / 2, 0, 0.017, matGoldHi, g, false);
            const cb = M + 0.012, rG = new THREE.CylinderGeometry(0.011, 0.013, 0.008, 16);   // the corner blocks
            for (const sx of [-1, 1]) for (const sy of [-1, 1]) {
              const cx = sx * (W / 2 - cb / 2 + 0.004), cy = sy * (H / 2 - cb / 2 + 0.004);
              box(cb, cb, 0.036, cx, cy, 0.018, matGold, g, false);
              const ro = new THREE.Mesh(rG, matGoldHi); ro.rotation.x = Math.PI / 2; ro.position.set(cx, cy, 0.039); g.add(ro);
            }
          } else if (frame) {                                  // a gilt moulding round it, standing proud of the picture, and a dark board behind
            const fw = 0.032, fd = 0.026;
            box(w + 2 * fw, fw, fd, 0, h / 2 + fw / 2, fd / 2, matGold, g, false);
            box(w + 2 * fw, fw, fd, 0, -h / 2 - fw / 2, fd / 2, matGold, g, false);
            box(fw, h, fd, -w / 2 - fw / 2, 0, fd / 2, matGold, g, false);
            box(fw, h, fd, w / 2 + fw / 2, 0, fd / 2, matGold, g, false);
            box(w, h, 0.006, 0, 0, 0.003, matDark, g, false);
          }
          const geo = new THREE.PlaneGeometry(w, h), uv = geo.attributes.uv;
          for (let i = 0; i < uv.count; i++) uv.setY(i, 1 - uv.getY(i));
          const mat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: !frame, alphaTest: frame ? 0 : 0.02, toneMapped: false, fog: false });
          const m = new THREE.Mesh(geo, mat); m.position.z = fine ? 0.0125 : frame ? 0.0075 : 0.004; m.visible = false; g.add(m);
          loadImageTexture(key, mime).then(t => {
            if (!alive || !t) return;
            madeTex.push(t); mat.map = t; mat.needsUpdate = true; m.visible = true;
          }).catch(() => {});
          return g;
        };
        /* Luang Phu Tim at prayer (250 x 333) and on his bench (450 x 600), both 3:4; the three mybuddha108 portraits
           320 x 418. Left to right as seen from the shop floor (+z is the viewer's right on this wall).
           v21.9 · ONE ROW, AT THE TOP (Chad: "the shop owner standing is covering the monk portraits behind. I want the
           monk portraits to all be in a single row at the top so that they are not covered"). Until v21.9 Luang Phu
           Tim's two hung over the other three, and those three (1.0–1.4 m) were behind the owner's back. He is 1.66 m
           tall, 0.51 m off this wall, and from anywhere the counter lets the player stand his head covers nothing on
           it above 1.70 m — the row's lowest edge is MSTR.y0, 1.90. All five the same height on the wall (MSTR.h, the
           gilt mouldings included), each at its own aspect, never cropped; in the order the two rows had: Luang Pu
           Thuad, Luang Phu Tim at prayer, Somdej Toh in the middle under the shelf-shrine, Luang Phu Tim on his bench,
           Ajahn Mun.
           v21.10: and LP Phiboon at the door end (+z) — his photograph 318 x 500, in the fine frame (FINE_B a side), so
           the row keeps its rhythm of framed portraits and photographs; six, recentred on the shelf-shrine, whose
           middle now falls in the gap between Somdej Toh and Luang Phu Tim on his bench */
        const FWD = 0.032, GAP = 0.12, RH = MSTR.h, RY = MSTR.y0 + MSTR.h / 2;   // (FWD: the moulding portrait() builds round a photograph)
        const border = fr => fr === 'fine' ? FINE_B : fr ? FWD : 0;
        const row = [
          ['mstr_lpthuad', 'image/png', RH * 320 / 418, RH, false],
          ['mstr_lptimpray', 'image/jpeg', (RH - 2 * FWD) * 250 / 333, RH - 2 * FWD, true],
          ['mstr_somdejtoh', 'image/png', RH * 320 / 418, RH, false],
          ['mstr_lptimbench', 'image/jpeg', (RH - 2 * FWD) * 450 / 600, RH - 2 * FWD, true],
          ['mstr_achanmun', 'image/png', RH * 320 / 418, RH, false],
          ['mstr_lpphiboon', 'image/jpeg', (RH - 2 * FINE_B) * 318 / 500, RH - 2 * FINE_B, 'fine']
        ];
        const outer = row.map(([, , w, , fr]) => w + 2 * border(fr));
        const rowLen = outer.reduce((a, b) => a + b, 0) + GAP * (row.length - 1);
        MSTR.half = rowLen / 2;                                // (the row's half-length: its tap box, lkMasters)
        let rz = MSTR.z - rowLen / 2;
        row.forEach(([key, mime, w, h, fr], i) => { portrait(key, mime, w, h, RY, rz + outer[i] / 2, fr); rz += outer[i] + GAP; });
        /* the shelf-shrine's brackets, a quarter-metre either side of its middle. Until v21.10 they stood down the gaps
           either side of Somdej Toh, the row's middle; with six the middle is a gap, so they stand OVER the two
           portraits beside it, their struts stopping 4 cm above the frames' tops (MSTR.y0 + MSTR.h) */
        const BRZ = 0.25, BRY0 = MSTR.y0 + MSTR.h + 0.04;
        box(0.4, 0.86, 2.8, SHOP.x1 - 0.2, 0.43, -2.45, matWood, shopG);                             // the low cabinet
        box(0.42, 0.03, 2.82, SHOP.x1 - 0.2, 0.875, -2.45, matWoodL, shopG);
        const br = texMat(makeBoxRow(THREE, cnv));
        /* v21.8: the low cabinet's front shows Chad's trays — two to a panel in a gilt frame, where the drawn boxes stood
           (they stay, standing in, until the trays land) */
        const boxRows = [], lowTrays = [], LS = 0.24, lw = TRAY.w * LS, lh = TRAY.h * LS, lt = TRAY.d * LS, le = new THREE.Euler(0, -Math.PI / 2, 0);
        for (const zz of [-1.6, -3.3]) {
          boxRows.push(plane(1.1, 0.27, br, SHOP.x1 - 0.405, 0.6, zz, -Math.PI / 2, shopG));
          for (const a of [-1, 1]) lowTrays.push([SHOP.x1 - 0.4 - lt / 2 - 0.002, 0.6, zz + a * (lw / 2 + 0.008), le, LS]);
          const fx = SHOP.x1 - 0.4 - 0.011, fw = 0.018, W2 = lw * 2 + 0.016 + 2 * fw, H2 = lh + 2 * fw;
          const rim = new THREE.Group(); rim.visible = false; shopG.add(rim);
          box(0.022, fw, W2, fx, 0.6 + H2 / 2 - fw / 2, zz, matGold, rim, false);
          box(0.022, fw, W2, fx, 0.6 - H2 / 2 + fw / 2, zz, matGold, rim, false);
          for (const a of [-1, 1]) box(0.022, H2, fw, fx, 0.6, zz + a * (W2 / 2 - fw / 2), matGold, rim, false);
          boxRows.push({ set visible(v) { rim.visible = !v; }, get visible() { return !rim.visible; } });
        }
        trayGroup(lowTrays, boxRows);
        plane(0.42, 0.63, texMat(makeCalendar(THREE, cnv)), wx - 0.002, 1.55, -4.45, -Math.PI / 2, shopG);   // (v21.10: 0.3 m back, clear of the longer row's end)
        solids.push(hidBox(0.4, 0.9, 2.8, SHOP.x1 - 0.2, 0.45, -2.45));
        // a small shelf-shrine over the photographs: a Buddha, a garland, two candles
        /* (on two gilt brackets, with a gold lip along its front: seen from the counter it was a dark-red slab floating
           on nothing behind the SANITY row — VP-9) */
        box(0.28, 0.03, 0.7, SHOP.x1 - 0.14, 2.62, -2.5, matRed, shopG);
        box(0.012, 0.045, 0.7, SHOP.x1 - 0.282, 2.62, -2.5, matGold, shopG, false);
        for (const dz of [-BRZ, BRZ]) {
          box(0.2, 0.025, 0.03, SHOP.x1 - 0.1, 2.59, -2.5 + dz, matGold, shopG, false);
          const st = box(0.02, 2.6 - BRY0, 0.03, SHOP.x1 - 0.02, (2.6 + BRY0) / 2, -2.5 + dz, matGold, shopG, false);
          const dg = box(0.018, 0.24, 0.025, SHOP.x1 - 0.09, 2.52, -2.5 + dz, matGold, shopG, false); dg.rotation.z = 0.78;
          st.castShadow = dg.castShadow = false;
        }
        thai('buddha', SHOP.x1 - 0.15, 2.635, -2.5, { s: 0.42, ry: -Math.PI / 2, parent: shopG, cast: false });
      }

      /* ---------------------------------------------------- the clock
         Over the door, inside. Its hands are meshes, so the trance's fifteen
         minutes can pass on it (stage.clockTo). */
      const clockG = new THREE.Group(); clockG.position.set(CLOCK.x, CLOCK.y, CLOCK.z); clockG.rotation.y = Math.PI; shopG.add(clockG);
      {
        const face = new THREE.Mesh(new THREE.CircleGeometry(0.17, 32), texMat(makeClockFace(THREE, cnv), { roughness: 0.6 }));
        face.position.z = 0.012; clockG.add(face);
        const rim = new THREE.Mesh(new THREE.TorusGeometry(0.175, 0.012, 8, 32), matBlack); rim.position.z = 0.012; clockG.add(rim);
      }
      const hourHand = new THREE.Group(), minHand = new THREE.Group();
      for (const [hand, L, wd] of [[hourHand, 0.09, 0.012], [minHand, 0.13, 0.008]]) {
        const b = new THREE.Mesh(new THREE.BoxGeometry(wd, L, 0.004), matBlack); b.position.set(0, L / 2 - 0.015, 0); hand.add(b);
        hand.position.z = 0.02; clockG.add(hand);
      }
      function clockTo(h, m) {
        minHand.rotation.z = -(m / 60) * Math.PI * 2;
        hourHand.rotation.z = -((h % 12) + m / 60) / 12 * Math.PI * 2;
      }
      clockTo(15, 20);                                      // (World H: twenty past three, an ordinary afternoon)

      /* ------------------------------------------------------- THE ALTAR
         A red-lacquer cabinet with gilt rims against the back wall, the red
         board of gilt lattice behind; candles, fruit and orchids on the
         cabinet's two ends; lilies in tall vases either side, a red valance over
         the whole, and a strip of warm light washing the board.
         v21.8 (Chad: "For the altar area, use the row of altar statues that was
         used in the sakyant ajahn room in ep 3 chp 1, so it looks more like a
         real amulet shop"): the three tiers and their three Buddhas are gone,
         and CHAD'S ROW OF ALTAR STATUES stands on the cabinet — the Buddha in
         his gilt arch at its middle, the hermits, the old masters and the
         guardians round him (e3c1's `altarrow`, its own facing, its base cloth
         a few mm off the gilt top, the v19.3 law). The cabinet is 0.70 deep now,
         the row's own depth at its scale. Before it a LOW STEP carries the
         incense pot and the offering trays (the tiers' front used to), and the
         monk who leads the chant sits before the step on his cushion (MONK). */
      const altarG = new THREE.Group(); shopG.add(altarG);
      const flames = [];                                     // lit at the celebration: the staff man the left, the owner the right (v21.8)
      const flameGlowTex = tex(makeGlowTex(THREE, cnv, [255, 196, 120]));
      let radioLed = null;
      const ALT_TOP = ALTAR.h, ALT_TOPY = ALT_TOP + 0.02;     // the gilt slab's top: what things stand ON
      /* the row at 0.74: its base 1.904 x 0.889 and 1.111 tall at 1 (measured, dbg-rowgrid), so 1.41 x 0.66, 0.82 tall;
         its back 3 cm off the red board. The Buddha at its middle has his face 0.74 up the scan and 0.13 in front of
         its centre (the grid photographs, front and side) */
      const ROW_S = 0.74, ROW_D = 0.889 * ROW_S, ROW_Z = SHOP.z0 + 0.042 + ROW_D / 2;
      const ROW_FACE = { x: ALTAR.x, y: ALT_TOPY + 0.003 + 0.74 * ROW_S, z: ROW_Z - 0.13 * ROW_S };
      {
        const { x, z, w, d, h } = ALTAR;
        box(w, h, d, x, h / 2, z, matRed, altarG);
        box(w + 0.04, 0.04, d + 0.04, x, h, z, matGold, altarG);
        box(w + 0.04, 0.08, d + 0.04, x, 0.04, z, matGold, altarG);
        for (const s of [-1, 1]) {                                     // drawer and cupboard fronts with gilt pulls
          box(w * 0.42, 0.2, 0.012, x + s * w * 0.23, h - 0.16, z + d / 2 + 0.006, matRedD, altarG, false);
          box(w * 0.42, 0.5, 0.012, x + s * w * 0.23, 0.38, z + d / 2 + 0.006, matRedD, altarG, false);
          cyl(0.012, 0.012, 0.04, x + s * w * 0.23, h - 0.16, z + d / 2 + 0.02, matGold, 8, altarG).rotation.x = Math.PI / 2;
        }
        solids.push(hidBox(w, 1.4, d, x, 0.7, z));
        // the board behind
        plane(2.5, 1.9, texMat(makeAltarScreen(THREE, cnv), { roughness: 0.5, emissive: 0x3a0804, emissiveIntensity: 0.3 }), x, 1.92, SHOP.z0 + 0.012, 0, altarG);
        // a red valance with a gilt fringe across the ceiling over it
        box(2.9, 0.22, 0.04, x, SHOP.H - 0.11, z + 0.1, matRed, altarG, false);
        box(2.9, 0.03, 0.05, x, SHOP.H - 0.225, z + 0.1, matGold, altarG, false);
        /* THE ROW. A gold Buddha stands in for it until the scan lands (a failed download costs the row, never the
           altar — v4.7) */
        const standIn = thai('buddha', x, ALT_TOPY, ROW_Z - 0.05, { s: 1.4, parent: altarG, cast: false });
        /* TWO LEVELS (the shop is seen across a room): the full row (419k triangles) within 2.6 m of its middle, and
           beyond it a permissive cut of 126k that wears the full row's own maps (tools/permcut.mjs NOTEX=1) —
           photographed side by side at 1.3 m only the steps under the principal image differ, and from the mats on.
           (Chad: "why is the row of altar statues all in gold colour? what happened to the original texture and
           colours?" — the cut had lost its UVs: prune() drops a vertex attribute no texture reads, and NOTEX had taken
           the textures, so beyond 2.6 m the whole row sampled one gilt texel. permcut keeps them now, and the file
           was cut again: the same 125,622 triangles, with their UVs) */
        Promise.all([parseOnce('altarrow'), parseOnce('altarrowfar')]).then(([gltf, farG]) => {
          if (!alive) return;
          const RH = 1.111 * ROW_S, lod = new THREE.LOD();
          lod.position.set(x, ALT_TOPY + 0.003 + RH / 2, ROW_Z); altarG.add(lod);
          let mat = null;
          const level = (src, d) => {
            const m = src.clone(true); m.scale.setScalar(ROW_S); m.position.y = -RH / 2;
            m.traverse(o => { if (!o.isMesh) return; o.castShadow = false; o.receiveShadow = true;
              if (!mat) mat = o.material; else o.material = mat; });
            lod.addLevel(m, d);
          };
          level(gltf.scene, 0); level(farG.scene, 2.6);
          standIn.visible = false;
        }).catch(err => { console.warn('altarrow failed to load', err); ctx.loadFail && ctx.loadFail('altarrow', err); });
        /* the cabinet's two ends (the row leaves 0.45 m each side): a candle at the front corner, the fruit behind it,
           an orchid at the back */
        const orange = new THREE.MeshStandardMaterial({ color: 0xf08a1e, roughness: 0.6 }), apple = new THREE.MeshStandardMaterial({ color: 0xb8241a, roughness: 0.4 });
        for (const s of [-1, 1]) {
          const ex = x + s * 0.93;
          thai('candle', ex, ALT_TOPY, z + 0.23, { s: 0.55, cast: false, parent: altarG });
          thai('orchid', x + s * 1.0, ALT_TOPY, z - 0.25, { s: 0.38, cast: false, parent: altarG });
          cyl(0.11, 0.095, 0.02, ex, ALT_TOPY + 0.01, z - 0.02, matGold, 18, altarG);
          for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2;
            const f = new THREE.Mesh(new THREE.SphereGeometry(0.034, 12, 10), i % 2 ? apple : orange);
            f.position.set(ex + Math.cos(a) * 0.058, ALT_TOPY + 0.054, z - 0.02 + Math.sin(a) * 0.058); altarG.add(f); }
          const top = new THREE.Mesh(new THREE.SphereGeometry(0.036, 12, 10), orange); top.position.set(ex, ALT_TOPY + 0.1, z - 0.02); altarG.add(top);
        }
        // the candle flames (painted light), over the candles' wicks
        for (const s of [-1, 1]) {
          const g = new THREE.Group(); g.position.set(x + s * 0.93, ALT_TOPY + 0.25, z + 0.23); g.visible = false; altarG.add(g);
          const f = new THREE.Mesh(new THREE.SphereGeometry(0.012, 8, 6), matFlame); f.scale.set(1, 2.2, 1); g.add(f);
          const glow = new THREE.Mesh(new THREE.PlaneGeometry(0.17, 0.17), new THREE.MeshBasicMaterial({ map: flameGlowTex, transparent: true, depthWrite: false,
            blending: THREE.AdditiveBlending, opacity: 0.75 }));
          g.add(glow); g.userData = { core: f, glow };
          flames.push(g);
        }
        /* THE STEP before the cabinet: red lacquer under a gilt slab, the incense pot at its middle, two trays of
           offerings, the shop's small bell (v21.8: what the tiers' front carried) */
        box(STEP.w, STEP.h, STEP.d, x, STEP.h / 2, STEP.z, matRed, altarG);
        box(STEP.w + 0.03, 0.025, STEP.d + 0.03, x, STEP.h, STEP.z, matGold, altarG);
        box(STEP.w + 0.03, 0.06, STEP.d + 0.03, x, 0.03, STEP.z, matGold, altarG);
        solids.push(hidBox(STEP.w, STEP.h, STEP.d, x, STEP.h / 2, STEP.z));
        const STY = STEP.h + 0.0125;
        thai('incense', x, STY, STEP.z, { s: 0.42, cast: false, parent: altarG });
        for (const s of [-1, 1]) thai('phan', x + s * 0.42, STY, STEP.z, { s: 0.42, cast: false, parent: altarG });
        const bellM = cyl(0.03, 0.05, 0.07, x - 0.66, STY + 0.035, STEP.z, matGold, 14, altarG); bellM.castShadow = false;
        /* lilies either side (the two lotus bowls that stood in front of them are
           gone: the staff man lit the candles and switched on the radio standing
           IN them, and the owner's stool stood against one) */
        for (const s of [-1, 1]) { thai('lily', x + s * 1.48, 0, z + 0.05, { s: 0.8, parent: altarG }); solids.push(hidBox(0.3, 1.0, 0.3, x + s * 1.48, 0.5, z + 0.05)); }   // (walked through until v21.1 — GF-7)
        // the warm wash on the board (painted: no light)
        const wash = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 1.6), new THREE.MeshBasicMaterial({ map: tex(makeGlowTex(THREE, cnv, [255, 190, 110])),
          transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.32 }));
        wash.position.set(x, 1.95, SHOP.z0 + 0.03); altarG.add(wash);
        /* the radio on its own little table (v21.2: Thai traditional music, not a chant). v21.8: it plays while he
           browses, and the OWNER turns it off on his way to his stool — a monk leads the chant now, and nobody chants
           over the radio */
        box(0.42, 0.62, 0.36, x + 1.95, 0.31, z + 0.02, matWood, altarG);
        const radio = box(0.32, 0.16, 0.14, x + 1.95, 0.7, z + 0.02, matBlack, altarG);
        for (const s of [-1, 1]) { const sp = new THREE.Mesh(new THREE.CircleGeometry(0.045, 16), matDark); sp.position.set(x + 1.95 + s * 0.1, 0.7, z + 0.095); altarG.add(sp); }
        radioLed = new THREE.Mesh(new THREE.CircleGeometry(0.007, 10), new THREE.MeshBasicMaterial({ color: 0x6aff8a }));
        radioLed.position.set(x + 1.95, 0.755, z + 0.093); radioLed.visible = true; altarG.add(radioLed);
        solids.push(hidBox(0.42, 0.8, 0.36, x + 1.95, 0.4, z + 0.02));
        void radio;
      }

      /* ------------------------------------------ the back corners
         Left: the lersi masks over their cabinet. Right: the water dispenser, a
         standing fan, and the curtained way to the back room. */
      {
        /* v21.8 (Chad: "why are there the shelves right next to the altar? Replace them with row of lersi masks instead,
           those from the sakyant ajahn room. Make sure all the original colours and textures make it through
           correctly"): the corner beside the altar is CHAD'S ROW OF LERSI MASKS — e3c1's `lersimask`, as it hangs over
           Ajahn Krukai: its own two shelves on their brackets, its back on the back wall, every mask in its own paint
           (the scan drawn exactly as it comes: its maps, its material, untouched; no cut, no LOD). Its lower shelf at
           1.25 m, its spires 0.25 m under the ceiling; under it a low cabinet in the altar's red lacquer and gilt, its
           candles and incense pot before the masks (e3c1's ledge carried the same). Two red boards stand in until it
           lands (a failed download costs the masks, never the corner — v4.7) */
        const sx = -3.0, MS = 1.0, MY = 1.25, CAB_H = 0.9, cz = SHOP.z0 + 0.24;
        const maskStand = [box(2.0, 0.05, 0.32, sx, MY + 0.05, SHOP.z0 + 0.17, matRed, shopG, false),
                           box(2.0, 0.05, 0.32, sx, MY + 0.75, SHOP.z0 + 0.17, matRed, shopG, false)];
        parseOnce('lersimask').then(gltf => {
          if (!alive) return;
          const m = gltf.scene.clone(true);
          m.scale.setScalar(MS); m.position.set(sx, MY, SHOP.z0 + 0.012 + 0.308 * MS);   // (its back, z −0.308 at 1, on the wall)
          m.traverse(o => { if (o.isMesh) { o.castShadow = false; o.receiveShadow = true; } });
          shopG.add(m);
          for (const h of maskStand) h.visible = false;
        }).catch(err => { console.warn('lersimask failed to load', err); ctx.loadFail && ctx.loadFail('lersimask', err); });
        box(2.0, CAB_H, 0.46, sx, CAB_H / 2, cz, matRed, shopG);
        box(2.04, 0.04, 0.5, sx, CAB_H, cz, matGold, shopG);
        box(2.04, 0.08, 0.5, sx, 0.04, cz, matGold, shopG);
        for (const s of [-1, 1]) {
          box(0.86, 0.6, 0.012, sx + s * 0.46, 0.44, cz + 0.236, matRedD, shopG, false);
          cyl(0.012, 0.012, 0.04, sx + s * 0.08, 0.5, cz + 0.25, matGold, 8, shopG).rotation.x = Math.PI / 2;
          thai('candle', sx + s * 0.78, CAB_H + 0.02, cz + 0.05, { s: 0.55, cast: false, parent: shopG });
        }
        thai('incense', sx, CAB_H + 0.02, cz + 0.06, { s: 0.42, cast: false, parent: shopG });
        solids.push(hidBox(2.0, 1.4, 0.56, sx, 0.7, SHOP.z0 + 0.28));
        // the water dispenser, its blue bottle, the cups
        box(0.32, 1.0, 0.32, 3.95, 0.5, -6.6, matWhite, shopG);
        cyl(0.13, 0.13, 0.42, 3.95, 1.21, -6.6, new THREE.MeshStandardMaterial({ color: 0x7ab4e6, roughness: 0.15, transparent: true, opacity: 0.75 }), 16, shopG);
        solids.push(hidBox(0.36, 1.4, 0.36, 3.95, 0.7, -6.6));
        thai('standfan', 3.2, 0, -6.55, { s: 0.9, ry: -0.6, parent: shopG }); solids.push(hidBox(0.4, 1.2, 0.4, 3.2, 0.6, -6.55));   // (GF-7)
        // the back room's doorway on the right wall, a maroon curtain in it
        box(0.04, 2.15, 1.0, SHOP.x1 - 0.02, 1.075, -5.6, matWood, shopG, false);
        plane(0.92, 2.0, new THREE.MeshStandardMaterial({ color: 0x6a1420, roughness: 0.95, side: THREE.DoubleSide }), SHOP.x1 - 0.05, 1.0, -5.6, -Math.PI / 2, shopG);
      }


      /* v21.18 · GOLDEN MILE'S SHOPS, BUILT (Chad: "Now for the row of shops inside golden mile itself, these shops now
         look too basic, and they can all be improved much further with more detail"). Each neighbour was ONE painted
         plane — a band, a name, a few rectangles for goods — flat from every angle the shop's glass and the film's walk
         see it from. Each is a SHOP now: a recess 2.4 m deep with its back and side walls, a ceiling with its lit
         panels, a floor of its own; an aluminium front with glass and its doors folded open; a lightbox on a fascia
         over it; and inside and out what that kind of shop holds — a grocer's shelves, fridge and crates of fruit at the
         door, a travel agent's desk, brochures and A-board, a kitchen's counter, tables and menu, a massage parlour's
         recliners and curtain, a goldsmith's lit cases, a phone shop's counter and wall of cases, a money changer's
         rates, a coach agency's departures and luggage, a snack shop, a unit shuttered TO LET. Lit by World A's own
         light and by painted glows (no lamp: the v15.1 law); nothing casts or takes a shadow; and MERGED — a batch a
         material and the goods instanced, a dozen draws for the corridor. A bay is built in its own frame (x across it
         to the viewer's right, z out toward the corridor, its front at z 0) and the frame turns it to face its row's
         way. The film's podium on Beach Road takes the same builder (v21.19). */
      const SHOP_SIGNS = tex(makeMallSigns(THREE, cnv)), SHOP_POSTERS = tex(makeMallPosters(THREE, cnv));
      const SHOP_SEATED = [];      // the diners a row lists: seated further down, once the baked stills exist (sitterStill)
      const SIGN_CELL = (i) => [0.004, 1 - (i + 1) * 128 / 1280 + 0.004, 0.996, 1 - i * 128 / 1280 - 0.004];
      const POST_CELL = (i) => { const cx = i % 4, cy = Math.floor(i / 4); return [cx / 4 + 0.004, 1 - (cy + 1) / 4 + 0.004, (cx + 1) / 4 - 0.004, 1 - cy / 4 - 0.004]; };
      const PC = (k) => POST_CELL(MALL_POSTER[k]);
      /* a kind: its sign (a row of the signs' atlas), its walls, floor and light, how it is dressed, its goods' colours */
      const SHOP_KINDS = {
        travel:  { sign: 0, wall: 0xe6edf4, floor: 0xb9c0c8, lamp: 0xf4f8ff, dress: 'travel' },
        grocery: { sign: 1, wall: 0xf0efe6, floor: 0xc4c2b4, lamp: 0xf6fbff, dress: 'grocery', pal: [0xd8261c, 0xf2b81c, 0x2a8a3a, 0x1e5aa8, 0xe86a1a, 0xf4f0e6, 0x8a2ad8, 0xc8a46a] },
        snack:   { sign: 9, wall: 0xf6eedc, floor: 0xc8bca4, lamp: 0xfff6e6, dress: 'grocery', pal: [0xf2b81c, 0xe84a8a, 0xd8261c, 0x7ac83a, 0xf2783a, 0x8a4a2a, 0xfff2c8, 0x3ab4d8], noFridge: true },
        food:    { sign: 2, wall: 0xf4e6d0, floor: 0xa89a86, lamp: 0xfff2dc, dress: 'food' },
        massage: { sign: 3, wall: 0xf0d6c8, floor: 0x8a6a56, lamp: 0xffe6cc, dress: 'massage' },
        gold:    { sign: 4, wall: 0x8a1610, floor: 0xd8cfc0, lamp: 0xfff2d8, dress: 'gold' },
        phone:   { sign: 5, wall: 0xeef0f2, floor: 0xb4b8bc, lamp: 0xf0f6ff, dress: 'phone', pal: [0x1a1a1a, 0xe8e8e8, 0xd8261c, 0x1e5aa8, 0xf2b81c, 0x2a8a3a, 0xe84a8a, 0x8a2ad8] },
        money:   { sign: 7, wall: 0xe4ece6, floor: 0xb0b4ae, lamp: 0xf2fff6, dress: 'money' },
        tickets: { sign: 8, wall: 0xf4ecd8, floor: 0xb8b0a0, lamp: 0xfff8e8, dress: 'tickets' },
        shut:    { sign: 6, dress: 'shut' } };
      const _sm4 = new THREE.Matrix4(), _sq4 = new THREE.Quaternion(), _se4 = new THREE.Euler(0, 0, 0, 'YXZ'), _sv4 = new THREE.Vector3(), _ss4 = new THREE.Vector3(), _sn3 = new THREE.Matrix3(), _sc4 = new THREE.Color();
      /* a batch, World A's (buildStreet's shape): every piece posed in the current bay's frame, merged into one mesh */
      function shopBatch(parent) {
        const P = [], N = [], C = [], U = [], I = []; let FR = null;
        const B = {
          frame(m) { FR = m; return B; },
          add(geo, x, y, z, col, o = {}) {
            _se4.set(o.rx || 0, o.ry || 0, o.rz || 0, 'YXZ'); _sq4.setFromEuler(_se4);
            _sm4.compose(_sv4.set(x, y, z), _sq4, _ss4.set(1, 1, 1)).premultiply(FR); _sn3.getNormalMatrix(_sm4);
            _sc4.set(col);
            const pa = geo.attributes.position, na = geo.attributes.normal, ua = geo.attributes.uv, base = P.length / 3;
            for (let i = 0; i < pa.count; i++) {
              _sv4.fromBufferAttribute(pa, i).applyMatrix4(_sm4); P.push(_sv4.x, _sv4.y, _sv4.z);
              _sv4.fromBufferAttribute(na, i).applyMatrix3(_sn3).normalize(); N.push(_sv4.x, _sv4.y, _sv4.z);
              C.push(_sc4.r, _sc4.g, _sc4.b);
              if (o.cell) { const q = o.cell; U.push(q[0] + ua.getX(i) * (q[2] - q[0]), q[1] + ua.getY(i) * (q[3] - q[1])); }
              else U.push(ua.getX(i), ua.getY(i));
            }
            if (geo.index) for (let i = 0; i < geo.index.count; i++) I.push(base + geo.index.getX(i));
            else for (let i = 0; i < pa.count; i++) I.push(base + i);
            geo.dispose();
            return B;
          },
          box(w, h, d, x, y, z, col, o) { return B.add(new THREE.BoxGeometry(w, h, d), x, y, z, col, o); },
          quad(w, h, x, y, z, col, o) { return B.add(new THREE.PlaneGeometry(w, h), x, y, z, col, o); },
          cyl(r, h, x, y, z, col, o = {}) { return B.add(new THREE.CylinderGeometry(o.r1 ?? r, r, h, o.seg || 12), x, y, z, col, o); },
          build(mat) {
            if (!I.length) return null;
            const g = new THREE.BufferGeometry();
            g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3));
            g.setAttribute('normal', new THREE.Float32BufferAttribute(N, 3));
            g.setAttribute('color', new THREE.Float32BufferAttribute(C, 3));
            g.setAttribute('uv', new THREE.Float32BufferAttribute(U, 2));
            g.setIndex(P.length / 3 > 65535 ? new THREE.Uint32BufferAttribute(I, 1) : new THREE.Uint16BufferAttribute(I, 1));
            g.computeBoundingSphere();
            const m = new THREE.Mesh(g, mat); m.castShadow = false; m.receiveShadow = false;
            parent.add(m); return m;
          },
        };
        return B;
      }
      /* a row of bays: [{ x, z, ry, kind, seed }], each a whole shop; o.H the ceiling it stands under (the fascia
         reaches it), o.fascia its colour, o.mats to share one set of materials between rows */
      function shopRow(parent, bays, o = {}) {
        const lit = shopBatch(parent), metal = shopBatch(parent), glow = shopBatch(parent), post = shopBatch(parent),
              bright = shopBatch(parent), sign = shopBatch(parent), glass = shopBatch(parent), shut = shopBatch(parent);
        const goods = [], cans = [], fruit = [], gold = [];
        const FR = new THREE.Matrix4(); let BAY = null;
        const HW = 1.94, D = 2.4, CH = 2.75, MH = o.H || 3.6, ALU = 0xc4c8cc, STEEL = 0x9aa0a6;
        const put = (list, x, y, z, sx, sy, sz, col, ry = 0, rx = 0) => {
          _se4.set(rx, ry, 0, 'YXZ'); _sq4.setFromEuler(_se4);
          list.push({ m: new THREE.Matrix4().compose(_sv4.set(x, y, z), _sq4, _ss4.set(sx, sy, sz)).premultiply(FR), col });
        };
        /* goods along a shelf board from u0 to u1 (x when along x, z when along z), standing on height y, against `back`
           (the wall side's coordinate): packets, cans and bottles, a little gap between, dealt from the bay's own stream */
        const stock = (rnd, pal, along, u0, u1, y, back, depth, face, maxH = 0.32) => {
          let u = u0 + 0.02;
          while (u < u1 - 0.06) {
            const kind = rnd(), col = pal[Math.floor(rnd() * pal.length)];
            if (kind < 0.55) {                                         // a packet or a box
              const w = 0.07 + rnd() * 0.1, h = Math.min(maxH, 0.1 + rnd() * 0.24), d = Math.min(depth - 0.04, 0.1 + rnd() * 0.12);
              if (u + w > u1) break;
              const c = back + face * (d / 2 + 0.02);
              if (along === 'x') put(goods, u + w / 2, y + h / 2, c, w, h, d, col); else put(goods, c, y + h / 2, u + w / 2, d, h, w, col);
              u += w + 0.012;
            } else {                                                   // a row of cans or bottles, front to back
              const tall = rnd() < 0.4, r = tall ? 0.034 : 0.032, h = tall ? Math.min(maxH, 0.26) : 0.12;
              for (let k = 0; k < 2; k++) {
                const c = back + face * (0.06 + k * 0.08);
                if (along === 'x') put(cans, u + r, y + h / 2, c, r * 2, h, r * 2, col); else put(cans, c, y + h / 2, u + r, r * 2, h, r * 2, col);
              }
              u += r * 2 + 0.01;
            }
          }
        };
        /* an open steel shelf unit against a wall: uprights, boards, stock on every board */
        const shelfX = (rnd, pal, x0, x1, zBack, depth, tiers) => {
          for (const x of [x0, x1]) metal.box(0.04, tiers[tiers.length - 1] + 0.1, depth, x, (tiers[tiers.length - 1] + 0.1) / 2, zBack + depth / 2, STEEL);
          tiers.forEach((y, i) => { metal.box(x1 - x0, 0.025, depth, (x0 + x1) / 2, y, zBack + depth / 2, i % 2 ? 0xd8dadc : 0xcfd2d6);
            if (i < tiers.length - 1) stock(rnd, pal, 'x', x0 + 0.03, x1 - 0.03, y + 0.013, zBack, depth, 1, Math.min(0.32, tiers[i + 1] - y - 0.06)); });
          lit.quad(x1 - x0, tiers[tiers.length - 1], (x0 + x1) / 2, tiers[tiers.length - 1] / 2, zBack + 0.004, 0xdedcd4);   // its back panel
        };
        const shelfZ = (rnd, pal, z0, z1, xBack, depth, tiers, face) => {     // face −1: against the right wall, facing −x
          for (const z of [z0, z1]) metal.box(depth, tiers[tiers.length - 1] + 0.1, 0.04, xBack + face * depth / 2, (tiers[tiers.length - 1] + 0.1) / 2, z, STEEL);
          tiers.forEach((y, i) => { metal.box(depth, 0.025, z1 - z0, xBack + face * depth / 2, y, (z0 + z1) / 2, i % 2 ? 0xd8dadc : 0xcfd2d6);
            if (i < tiers.length - 1) stock(rnd, pal, 'z', z0 + 0.03, z1 - 0.03, y + 0.013, xBack, depth, face, Math.min(0.32, tiers[i + 1] - y - 0.06)); });
        };
        const chair = (x, z, col, ry = 0) => {                           // a plastic chair: seat, back, four legs
          const c = Math.cos(ry), s = Math.sin(ry), at = (dx, dz) => [x + dx * c + dz * s, z - dx * s + dz * c];
          let p = at(0, 0); lit.box(0.42, 0.05, 0.42, p[0], 0.45, p[1], col, { ry });
          p = at(0, 0.2); lit.box(0.42, 0.4, 0.04, p[0], 0.68, p[1], col, { ry, rx: 0.12 });
          for (const [dx, dz] of [[-0.18, -0.18], [0.18, -0.18], [-0.18, 0.18], [0.18, 0.18]]) { p = at(dx, dz); metal.box(0.025, 0.44, 0.025, p[0], 0.22, p[1], 0x444444); }
        };
        const aBoard = (x, z, cell, frame = 0x2a2a2a) => {                  // an A-board on the corridor's floor
          lit.box(0.54, 0.86, 0.03, x, 0.44, z, frame, { rx: -0.16 });
          post.quad(0.48, 0.48, x, 0.56, z, 0xffffff, { rx: -0.16, cell });
          lit.box(0.54, 0.86, 0.03, x, 0.44, z - 0.14, frame, { rx: 0.16 });
        };
        const pot = (x, z, h = 0.34) => {                                  // a potted palm: a pot, a fan of leaves
          lit.cyl(0.15, h, x, h / 2, z, 0xa8582a, { r1: 0.19, seg: 12 });
          for (let k = 0; k < 7; k++) put(goods, x + Math.cos(k * 0.9) * 0.12, h + 0.32, z + Math.sin(k * 0.9) * 0.12, 0.05, 0.62, 0.16, 0x2f7a32, k * 0.9, 0.35);
        };
        const DRESS = {
          grocery(K, rnd) {
            shelfX(rnd, K.pal, -1.86, 1.86, -D + 0.02, 0.42, [0.1, 0.5, 0.9, 1.3, 1.7, 2.06]);
            shelfZ(rnd, K.pal, -1.92, -0.62, HW - 0.02, 0.36, [0.1, 0.48, 0.86, 1.24, 1.62], -1);
            if (!K.noFridge) {                                             // the drinks fridge on the left: open-fronted behind glass, lit inside
              const fx = -HW + 0.36, fz = -1.25;
              lit.box(0.05, 2.0, 0.64, -HW + 0.035, 1.0, fz, 0xe6e6e8);
              for (const s of [-1, 1]) lit.box(0.7, 2.0, 0.04, fx, 1.0, fz + s * 0.3, 0xe6e6e8);
              lit.box(0.7, 0.16, 0.64, fx, 0.08, fz, 0xe6e6e8); lit.box(0.72, 0.24, 0.66, fx, 2.12, fz, 0xc8201a);
              glow.quad(0.56, 1.72, -HW + 0.062, 1.02, fz, 0xdcecff, { ry: Math.PI / 2 });
              for (let r = 0; r < 4; r++) {
                metal.box(0.6, 0.02, 0.56, fx + 0.02, 0.28 + r * 0.43, fz, 0xd0d4d8);
                for (let k = 0; k < 6; k++) for (let j = 0; j < 2; j++) put(cans, -HW + 0.34 + j * 0.16, 0.42 + r * 0.43, fz - 0.22 + k * 0.088, 0.062, 0.25, 0.062, K.pal[(r * 3 + k + j) % K.pal.length]);
              }
              glass.quad(0.6, 1.76, -HW + 0.712, 1.02, fz, 0xffffff, { ry: Math.PI / 2 });
            } else shelfZ(rnd, K.pal, -1.92, -0.62, -HW + 0.02, 0.36, [0.1, 0.48, 0.86, 1.24, 1.62], 1);
            // the till by the door
            lit.box(0.86, 0.95, 0.46, 1.25, 0.475, -0.5, 0xd8d0c0); lit.box(0.92, 0.04, 0.52, 1.25, 0.97, -0.5, 0x3a3a3a);
            lit.box(0.3, 0.16, 0.22, 1.2, 1.07, -0.55, 0x1a1a1a); glow.quad(0.2, 0.1, 1.2, 1.12, -0.437, 0x7ad8ff);
            // at the door: produce in crates on a stepped stand, sacks of rice
            lit.box(1.5, 0.42, 0.5, -1.0, 0.21, 0.4, 0x6a4a2a); lit.box(1.5, 0.3, 0.32, -1.0, 0.57, 0.3, 0x6a4a2a);
            const cr = [[-1.37, 0.47, 0.5, 0xf2b81c], [-0.63, 0.47, 0.5, 0x6ab42a], [-1.37, 0.77, 0.3, 0xd8201a], [-0.63, 0.77, 0.3, 0xf28a1c]];
            for (const [x, y, z, col] of cr) {
              lit.box(0.66, 0.14, 0.32, x, y, z, rnd() < 0.5 ? 0x2a6a3a : 0x9a6a3a);
              for (let k = 0; k < 18; k++) put(fruit, x - 0.27 + (k % 6) * 0.11 + rnd() * 0.02, y + 0.08 + (k > 11 ? 0.06 : 0), z - 0.1 + Math.floor(k / 6) % 2 * 0.1, 0.1, 0.09, 0.1, col);
            }
            for (let k = 0; k < 3; k++) { lit.box(0.44, 0.22, 0.62, 1.32, 0.11 + k * 0.22, 0.36, 0xf4f0e2, { ry: k * 0.08 }); }
            post.quad(0.4, 0.3, 1.32, 0.55, 0.672, 0xffffff, { cell: PC('rice') });
            post.quad(0.5, 0.5, -1.3, 1.5, -0.025, 0xffffff, { cell: PC('noodles') });
          },
          travel(K, rnd) {
            lit.box(2.3, 0.75, 0.6, -0.15, 0.375, -1.78, 0xe8eef4); lit.box(2.4, 0.04, 0.66, -0.15, 0.77, -1.78, 0x2a4a7a);
            for (const x of [-0.75, 0.45]) { lit.box(0.5, 0.33, 0.04, x, 1.04, -1.9, 0x121214); glow.quad(0.46, 0.29, x, 1.04, -1.878, 0x9ad0ff); metal.box(0.04, 0.12, 0.04, x, 0.85, -1.9, 0x333333); }
            chair(-0.75, -2.15, 0x2a2a2e, Math.PI); chair(-0.6, -1.12, 0x1e5aa8); chair(0.45, -1.12, 0x1e5aa8);
            [['bangkok', -1.2], ['phuket', 0], ['hatyai', 1.2]].forEach(([k, x]) => { lit.box(0.68, 0.68, 0.02, x, 1.78, -D + 0.012, 0xf2f2f2); post.quad(0.62, 0.62, x, 1.78, -D + 0.024, 0xffffff, { cell: PC(k) }); });
            // the brochure rack on the right wall, the departures on the left
            lit.box(0.04, 1.2, 1.1, HW - 0.04, 1.3, -1.0, 0xd8d8d8);
            for (let r = 0; r < 4; r++) for (let k = 0; k < 4; k++) put(goods, HW - 0.09, 0.86 + r * 0.29, -1.38 + k * 0.25, 0.03, 0.22, 0.16, [0x1e5aa8, 0xf2b81c, 0xd8261c, 0x2a8a3a, 0xe84a8a][(r + k * 2) % 5], 0, 0.18);
            bright.quad(0.9, 0.9, -HW + 0.02, 1.6, -1.2, 0xffffff, { ry: Math.PI / 2, cell: PC('timetable') });
            aBoard(1.3, 0.55, PC('coach'));
            // a brochure stand at the door
            metal.box(0.04, 1.2, 0.04, -1.35, 0.6, 0.42, 0x555555); metal.box(0.4, 0.03, 0.3, -1.35, 0.02, 0.42, 0x555555);
            for (let k = 0; k < 3; k++) put(goods, -1.35, 0.55 + k * 0.28, 0.5, 0.36, 0.22, 0.03, [0x2a8a3a, 0x1e5aa8, 0xe86a1a][k], 0, -0.2);
            post.quad(0.48, 0.48, 1.32, 1.45, -0.025, 0xffffff, { cell: PC('phuket') });
          },
          food(K, rnd) {
            metal.box(3.72, 0.92, 0.62, 0, 0.46, -D + 0.33, 0xc0c4c8); metal.box(3.76, 0.04, 0.66, 0, 0.94, -D + 0.33, 0xdadde0);
            for (let k = 0; k < 4; k++) put(cans, -1.3 + k * 0.85, 1.08, -D + 0.3, 0.32, 0.26, 0.32, 0xb8bcc0);         // the pots
            glass.quad(3.6, 0.3, 0, 1.12, -D + 0.66, 0xffffff);
            for (let k = 0; k < 6; k++) put(goods, -1.5 + k * 0.6, 0.985, -D + 0.52, 0.42, 0.05, 0.22, [0xd8501c, 0xe8c040, 0x3a8a2a, 0x7a3a1a, 0xc8642a, 0xf0e0b0][k]);
            bright.quad(1.5, 0.75, -0.55, 1.88, -D + 0.012, 0xffffff, { cell: PC('menu') });
            post.quad(0.8, 0.8, 1.15, 1.85, -D + 0.012, 0xffffff, { cell: PC('tomyum') });
            for (const x of [-0.95, 0.85]) {                               // two tables, stools round them
              lit.box(0.64, 0.03, 0.64, x, 0.74, -1.05, 0xe6dcc8); metal.box(0.05, 0.72, 0.05, x, 0.37, -1.05, 0x6a6a6a); metal.box(0.4, 0.02, 0.4, x, 0.01, -1.05, 0x6a6a6a);
              for (const [dx, dz] of [[-0.45, 0], [0.45, 0], [0, 0.42]]) lit.cyl(0.15, 0.45, x + dx, 0.225, -1.05 + dz, (dx + dz) > 0 ? 0xd8261c : 0x1e5aa8, { r1: 0.13 });
            }
            /* two at lunch, one at each table, turned to it (real seated people baked to a still — the v21.16 rule; a
               phone seats the one) */
            const dine = (who, lx, lz, fx, fz, low) => {
              const v = new THREE.Vector3(lx, 0.45, lz).applyMatrix4(FR);
              SHOP_SEATED.push({ who, parent, x: v.x, y: v.y, z: v.z, ry: (BAY.ry || 0) + Math.atan2(fx, fz), low });
            };
            dine('sitman', -1.4, -1.05, 1, 0, true);
            dine('sitwoman', 1.3, -1.05, -1, 0, false);
            // outside: a table for two and the menu on an easel
            lit.box(0.6, 0.03, 0.6, -1.25, 0.74, 0.5, 0xe6dcc8); metal.box(0.05, 0.72, 0.05, -1.25, 0.37, 0.5, 0x6a6a6a);
            for (const dx of [-0.42, 0.42]) lit.cyl(0.15, 0.45, -1.25 + dx, 0.225, 0.5, 0x1e5aa8, { r1: 0.13 });
            aBoard(1.32, 0.5, PC('menu'), 0x5a2a0a);
            post.quad(0.46, 0.46, 1.32, 1.5, -0.025, 0xffffff, { cell: PC('tomyum') });
          },
          massage(K, rnd) {
            lit.box(1.0, 0.95, 0.46, 1.28, 0.475, -0.62, 0x6a2a3a); lit.box(1.06, 0.04, 0.52, 1.28, 0.97, -0.62, 0xe8d8c8);
            lit.cyl(0.07, 0.14, 1.45, 1.06, -0.62, 0xf4f2ee);                                                                    // an orchid on the desk
            for (let k = 0; k < 6; k++) put(fruit, 1.45 + Math.sin(k) * 0.08, 1.25 + k * 0.05, -0.62 + Math.cos(k) * 0.05, 0.07, 0.05, 0.07, k % 2 ? 0xd85aa8 : 0xf4e6f4);
            for (const x of [-1.25, -0.12]) {                               // two foot-massage recliners
              lit.box(0.64, 0.36, 1.0, x, 0.18, -1.72, 0x4a1414); lit.box(0.62, 0.12, 0.6, x, 0.42, -1.82, 0x7a2424);
              lit.box(0.62, 0.78, 0.14, x, 0.78, -2.18, 0x7a2424, { rx: -0.34 });
              for (const s of [-1, 1]) lit.box(0.1, 0.2, 0.62, x + s * 0.33, 0.56, -1.86, 0x4a1414);
              lit.box(0.4, 0.3, 0.4, x, 0.15, -0.92, 0x7a2424); put(goods, x, 0.31, -0.92, 0.36, 0.02, 0.36, 0xf2f0ea);
            }
            metal.box(1.5, 0.03, 0.03, 1.15, 2.28, -1.45, 0xc8b89a);        // the curtain on its rail
            for (let k = 0; k < 8; k++) lit.box(0.19, 2.04, 0.02, 0.48 + k * 0.19, 1.24, -1.45 + (k % 2) * 0.05, 0xd8b88a, { ry: k % 2 ? 0.32 : -0.32 });
            post.quad(0.7, 0.7, -0.7, 1.72, -D + 0.012, 0xffffff, { cell: PC('massage') });
            lit.box(0.66, 0.66, 0.02, 0.62, 1.78, -D + 0.012, 0xc89a3a); post.quad(0.6, 0.6, 0.62, 1.78, -D + 0.024, 0xffffff, { cell: PC('elephant') });
            // outside: the price list on an easel, a palm
            for (const s of [-1, 1]) metal.box(0.03, 1.3, 0.03, -1.3 + s * 0.22, 0.62, 0.52, 0x5a3a1a, { rz: s * -0.12 });
            post.quad(0.52, 0.52, -1.3, 1.02, 0.56, 0xffffff, { rx: -0.12, cell: PC('massage') });
            pot(1.55, 0.38);
          },
          gold(K, rnd) {
            const cases = [[0, -1.98, 3.5, 0.55], [-1.58, -1.12, 0.5, 1.0], [1.58, -1.12, 0.5, 1.0]];
            for (const [x, z, w, d] of cases) {                              // the lit glass cases: a red base, a bright bed, gold on it, glass over
              lit.box(w, 0.86, d, x, 0.43, z, 0x5a0a08); glow.quad(w - 0.06, d - 0.06, x, 0.865, z, 0xfff0c8, { rx: -Math.PI / 2 });
              glass.box(w, 0.3, d, x, 1.02, z, 0xffffff);
              metal.box(w + 0.02, 0.025, d + 0.02, x, 1.18, z, 0xd8b04a);
              const n = Math.round(w * d * 26);
              for (let k = 0; k < n; k++) {
                const gx = x + (rnd() - 0.5) * (w - 0.12), gz = z + (rnd() - 0.5) * (d - 0.12);
                if (rnd() < 0.5) put(gold, gx, 0.885, gz, 0.11, 0.015, 0.11, 0xffc84a, rnd() * 3); else put(gold, gx, 0.9, gz, 0.04, 0.05, 0.16, 0xffd86a, rnd() * 3);
              }
            }
            lit.box(1.0, 1.0, 0.02, 0, 1.78, -D + 0.012, 0xd8a83a); bright.quad(0.92, 0.92, 0, 1.78, -D + 0.024, 0xffffff, { cell: PC('goldrate') });
            lit.box(0.6, 0.9, 0.55, -1.5, 0.45, -2.05, 0x3a3a3c); metal.box(0.08, 0.08, 0.04, -1.45, 0.6, -1.76, 0xd8b04a);   // the safe
            for (const x of [-1.2, 1.2]) put(fruit, x, 2.35, -1.2, 0.26, 0.32, 0.26, 0xd8201a);                                // two red lanterns
            for (const s of [-1, 1]) for (let k = 0; k < 6; k++) metal.box(0.025, 2.2, 0.025, s * (HW - 0.12 - k * 0.06), 1.1, -0.06, 0x8a8e92);   // the grille, folded back
          },
          phone(K, rnd) {
            lit.box(2.6, 0.95, 0.5, -0.4, 0.475, -1.22, 0x2a2a2e); glass.box(2.6, 0.04, 0.5, -0.4, 0.97, -1.22, 0xffffff);
            for (let k = 0; k < 9; k++) { const x = -1.55 + k * 0.29; put(goods, x, 0.93, -1.22, 0.075, 0.012, 0.15, 0x111111, 0.1); glow.quad(0.06, 0.12, x, 0.937, -1.22, [0x3a9ae8, 0xe84a8a, 0x3ad88a][k % 3], { rx: -Math.PI / 2, rz: 0.1 }); }
            lit.box(3.6, 1.62, 0.03, 0, 1.46, -D + 0.016, 0xdcdcd4);                                                          // the wall of cases
            for (let r = 0; r < 6; r++) for (let c = 0; c < 8; c++) put(goods, -1.47 + c * 0.42, 0.86 + r * 0.25, -D + 0.05, 0.13, 0.2, 0.025, K.pal[(r * 5 + c * 3) % K.pal.length]);
            lit.box(0.04, 0.52, 0.88, HW - 0.04, 1.95, -1.4, 0x111111); glow.quad(0.82, 0.46, HW - 0.065, 1.95, -1.4, 0x3a8ae8, { ry: -Math.PI / 2 });
            chair(-0.4, -1.9, 0x2a2a2e, Math.PI);
            aBoard(1.32, 0.5, PC('sim'), 0x0a1a4a);
            post.quad(0.46, 0.46, -1.32, 1.45, -0.025, 0xffffff, { cell: PC('sim') });
          },
          money(K, rnd) {
            lit.box(3.8, 1.02, 0.5, 0, 0.51, -0.95, 0x1e3a2e); lit.box(3.84, 0.04, 0.56, 0, 1.04, -0.95, 0xc8ccc4);
            glass.quad(3.8, 1.2, 0, 1.66, -0.95, 0xffffff); metal.box(3.84, 0.04, 0.04, 0, 2.27, -0.95, ALU);
            for (const x of [-1.0, 1.0]) { lit.box(0.4, 0.06, 0.24, x, 1.07, -0.85, 0x2a2a2a); metal.box(0.03, 1.2, 0.03, x * 0.5, 1.66, -0.95, ALU); }
            bright.quad(1.5, 1.5, 0.3, 1.55, -D + 0.012, 0xffffff, { cell: PC('rates') });
            lit.box(0.6, 0.9, 0.55, -1.45, 0.45, -2.05, 0x3a3a3c);
            post.quad(0.4, 0.4, -1.35, 1.6, -0.025, 0xffffff, { cell: PC('rates') });     // (on the left pane: on the right it stood over the big board)
          },
          tickets(K, rnd) {
            lit.box(1.9, 0.95, 0.56, -0.7, 0.475, -1.6, 0xd8261c); lit.box(1.96, 0.04, 0.6, -0.7, 0.97, -1.6, 0xf4f0e6);
            lit.box(0.48, 0.32, 0.04, -0.9, 1.12, -1.75, 0x121214); glow.quad(0.44, 0.28, -0.9, 1.12, -1.728, 0x9ad0ff);
            chair(-0.7, -2.05, 0x2a2a2e, Math.PI); chair(-0.9, -0.95, 0xd8261c);
            bright.quad(1.2, 1.2, 0.95, 1.7, -D + 0.012, 0xffffff, { cell: PC('timetable') });
            post.quad(0.7, 0.7, -0.8, 1.85, -D + 0.012, 0xffffff, { cell: PC('coach') });
            post.quad(0.6, 0.6, -HW + 0.012, 1.7, -0.9, 0xffffff, { ry: Math.PI / 2, cell: PC('hatyai') });
            lit.box(0.42, 0.62, 0.24, 1.3, 0.31, -0.55, 0x2a4a8a); metal.box(0.2, 0.2, 0.02, 1.3, 0.72, -0.55, 0x333333);        // luggage, waiting
            lit.box(0.38, 0.55, 0.22, 1.62, 0.275, -0.85, 0x8a2a2a);
            for (let k = 0; k < 3; k++) lit.box(0.5, 0.36, 0.4, -1.55 + (k % 2) * 0.06, 0.18 + k * 0.36, -0.45, 0xb88a5a, { ry: k * 0.1 });
            aBoard(-1.3, 0.55, PC('hatyai'), 0x8e0e08);
            post.quad(0.46, 0.46, 1.32, 1.5, -0.025, 0xffffff, { cell: PC('coach') });
          },
        };
        for (const bay of bays) {
          FR.makeRotationY(bay.ry || 0).setPosition(bay.x, 0, bay.z); BAY = bay;
          for (const b of [lit, metal, glow, post, bright, sign, glass, shut]) b.frame(FR);
          const K = SHOP_KINDS[bay.kind], rnd = rng(bay.seed || 2118);
          // the fascia over the front and its lightbox (every bay, the shut one's long dark)
          lit.quad(2 * HW + 0.24, MH - CH, 0, CH + (MH - CH) / 2, 0.004, o.fascia || 0xe2d8c6);
          lit.box(3.74, 0.64, 0.12, 0, CH + 0.43, 0.064, 0x1c1c1e);
          sign.quad(3.64, 0.56, 0, CH + 0.43, 0.126, K.dress === 'shut' ? 0x8a8a8a : 0xffffff, { cell: SIGN_CELL(K.sign) });
          if (K.dress === 'shut') {                                        // a roller shutter down, a poster on it
            shut.quad(2 * HW, CH, 0, CH / 2, -0.02, 0xcfd2d0);
            lit.box(2 * HW, 0.2, 0.24, 0, CH - 0.1, -0.06, 0x5c6066);
            post.quad(0.62, 0.62, 0.7, 1.45, -0.012, 0xffffff, { cell: PC('tolet') });
            post.quad(0.5, 0.5, -0.9, 1.3, -0.012, 0xf0e8e0, { cell: PC('calendar'), rz: 0.04 });
            continue;
          }
          // the shell: floor, back and side walls, ceiling and its lit panels, the skirting
          lit.quad(2 * HW, D, 0, 0.006, -D / 2, K.floor, { rx: -Math.PI / 2 });
          lit.quad(2 * HW, CH, 0, CH / 2, -D, K.wall);
          lit.quad(D, CH, -HW, CH / 2, -D / 2, K.wall, { ry: Math.PI / 2 });
          lit.quad(D, CH, HW, CH / 2, -D / 2, K.wall, { ry: -Math.PI / 2 });
          lit.quad(2 * HW, D, 0, CH, -D / 2, 0xeeece6, { rx: Math.PI / 2 });
          for (const sx of [-0.95, 0.95]) glow.quad(0.56, 1.12, sx, CH - 0.008, -D * 0.52, K.lamp, { rx: Math.PI / 2 });
          lit.box(2 * HW, 0.09, 0.012, 0, 0.045, -D + 0.006, 0x5a5450);
          // the front: aluminium posts, the door's mullions, a transom, a sill; glass in the sides and over the door
          for (const s of [-1, 1]) metal.box(0.07, CH, 0.09, s * (HW - 0.035), CH / 2, 0, ALU);
          for (const s of [-1, 1]) metal.box(0.05, 2.25, 0.08, s * 0.6, 1.125, 0, ALU);
          metal.box(2 * HW, 0.06, 0.09, 0, 2.25, 0, ALU); metal.box(2 * HW, 0.05, 0.1, 0, 0.025, 0, ALU);
          for (const s of [-1, 1]) glass.quad(HW - 0.66, 2.16, s * (0.6 + (HW - 0.6) / 2), 1.13, -0.012, 0xffffff);
          glass.quad(2 * HW - 0.1, 0.42, 0, 2.5, -0.012, 0xffffff);
          /* the two door leaves folded back into the shop: glass in an aluminium FRAME — two stiles, a head rail, a kick
             rail and a pull bar on each face (the first build drew each leaf as one solid aluminium slab, and every front
             read as two grey boards standing in its doorway) */
          for (const s of [-1, 1]) {
            const lx = s * 0.57;
            for (const z of [-0.06, -0.56]) metal.box(0.035, 2.18, 0.045, lx, 1.11, z, ALU);
            metal.box(0.035, 0.07, 0.54, lx, 2.165, -0.31, ALU); metal.box(0.035, 0.18, 0.54, lx, 0.11, -0.31, ALU);
            for (const f of [-1, 1]) {
              metal.box(0.018, 0.46, 0.018, lx + f * 0.05, 1.08, -0.47, 0xdfe2e4);
              for (const y of [0.88, 1.28]) metal.box(0.04, 0.014, 0.014, lx + f * 0.03, y, -0.47, 0xdfe2e4);
            }
            glass.quad(0.5, 2.1, lx, 1.11, -0.31, 0xffffff, { ry: s * Math.PI / 2 });
          }
          lit.box(1.1, 0.012, 0.56, 0, 0.012, -0.34, 0x34302e);          // the doormat
          DRESS[K.dress](K, rnd);
        }
        // built: one mesh a material, the goods instanced (a material nothing ended up using is let go at once)
        const M = {
          lit: new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.78 }),
          metal: new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.32, metalness: 0.55 }),
          glow: new THREE.MeshBasicMaterial({ vertexColors: true }),
          post: new THREE.MeshStandardMaterial({ map: SHOP_POSTERS, vertexColors: true, roughness: 0.55, emissive: 0xffffff, emissiveMap: SHOP_POSTERS, emissiveIntensity: 0.22 }),
          bright: new THREE.MeshBasicMaterial({ map: SHOP_POSTERS, vertexColors: true }),
          sign: new THREE.MeshBasicMaterial({ map: SHOP_SIGNS, vertexColors: true }),
          glass: new THREE.MeshStandardMaterial({ color: 0xdfeaf0, roughness: 0.05, metalness: 0.1, transparent: true, opacity: 0.12, depthWrite: false, side: THREE.DoubleSide }),
          shut: (() => { const t = tex(makeShutter(THREE, cnv)); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(4, 2.6); return new THREE.MeshStandardMaterial({ map: t, vertexColors: true, roughness: 0.6, metalness: 0.3 }); })(),
          goods: new THREE.MeshStandardMaterial({ roughness: 0.55 }),
          gold: new THREE.MeshStandardMaterial({ roughness: 0.25, metalness: 0.6, emissive: 0x5a3a08, emissiveIntensity: 0.55 }) };
        const out = [lit.build(M.lit), metal.build(M.metal), glow.build(M.glow), post.build(M.post),
                     bright.build(M.bright), sign.build(M.sign), glass.build(M.glass), shut.build(M.shut)];
        const inst = (list, geo, mat) => {
          if (!list.length) { geo.dispose(); return null; }
          const im = new THREE.InstancedMesh(geo, mat, list.length);
          list.forEach((g, i) => { im.setMatrixAt(i, g.m); im.setColorAt(i, _sc4.set(g.col)); });
          im.instanceMatrix.needsUpdate = true; im.instanceColor.needsUpdate = true;
          im.computeBoundingSphere(); im.castShadow = false; im.receiveShadow = false; parent.add(im); return im;
        };
        out.push(inst(goods, new THREE.BoxGeometry(1, 1, 1), M.goods),
                 inst(cans, new THREE.CylinderGeometry(0.5, 0.5, 1, 10), M.goods),
                 inst(fruit, new THREE.SphereGeometry(0.5, 10, 8), M.goods),
                 inst(gold, new THREE.BoxGeometry(1, 1, 1), M.gold));
        const used = new Set(out.filter(Boolean).map(m => m.material));
        for (const m of Object.values(M)) if (!used.has(m)) m.dispose();
        return out.filter(Boolean);
      }

      /* ============================================== THE MALL, past the glass
         Golden Mile Complex's corridor (v21.2: Chad names the mall): terrazzo, a
         low ceiling of fluorescent troughs, square columns clad in tile, the
         neighbours' fronts on both sides. Nothing out here is walkable in
         play — it is what the glass looks onto, and the film's way in. */
      {
        const W = MALL.x1 - MALL.x0, D = MALL.z1 - MALL.z0, mz = (MALL.z0 + MALL.z1) / 2;
        const fl = new THREE.Mesh(new THREE.PlaneGeometry(W, D), matTerr); fl.rotation.x = -Math.PI / 2; fl.position.set(0, 0, mz); fl.receiveShadow = true; mallG.add(fl);
        /* the ceiling runs 0.3 m into both walls, and a solid wall stands behind the far side's shopfronts: the fronts
           are 2.95 m planes under a 3.6 m ceiling, and the first film's walk showed the SKY over every one of them */
        const ce = new THREE.Mesh(new THREE.PlaneGeometry(W, D + 0.6), matMallCeil); ce.rotation.x = Math.PI / 2; ce.position.set(0, MALL.H, mz); mallG.add(ce);
        box(W, MALL.H, 0.2, 0, MALL.H / 2, MALL.z1 + 2.55, matWallB, mallG, false);   // (v21.18: behind the far side's shops, which are built now)
        for (let i = 0; i < 7; i++) { const t = box(2.4, 0.04, 0.12, -12 + i * 4, MALL.H - 0.02, mz, matTube, mallG, false); t.castShadow = false; }
        /* the neighbours (v21.18: BUILT, shopRow above — they were one painted plane each): across the corridor
           facing it (−z), the shop's glass looking onto the kitchen, the massage parlour and the goldsmith; and on our
           side facing +z, the film's walk passing the coach agency and the money changer */
        shopRow(mallG, [
          { x: -12, z: MALL.z1, ry: Math.PI, kind: 'travel', seed: 11 }, { x: -8, z: MALL.z1, ry: Math.PI, kind: 'grocery', seed: 12 },
          { x: -4, z: MALL.z1, ry: Math.PI, kind: 'food', seed: 13 },    { x: 0, z: MALL.z1, ry: Math.PI, kind: 'massage', seed: 14 },
          { x: 4, z: MALL.z1, ry: Math.PI, kind: 'gold', seed: 15 },     { x: 8, z: MALL.z1, ry: Math.PI, kind: 'phone', seed: 16 },
          { x: 12, z: MALL.z1, ry: Math.PI, kind: 'shut', seed: 17 },
          { x: -11.5, z: MALL.z0, ry: 0, kind: 'shut', seed: 21 },       { x: -7.5, z: MALL.z0, ry: 0, kind: 'snack', seed: 22 },
          { x: 7.5, z: MALL.z0, ry: 0, kind: 'money', seed: 23 },        { x: 11.5, z: MALL.z0, ry: 0, kind: 'tickets', seed: 24 }]);
        // the piers between the far side's shops, and on our side the wall where no shop is
        for (let i = 1; i < 7; i++) box(0.2, MALL.H, 0.3, MALL.x0 + i * 4, MALL.H / 2, MALL.z1 + 0.06, matWallB, mallG, false);
        for (const s of [-1, 1]) {
          box(1.06, MALL.H, 0.2, s * 5.03, MALL.H / 2, -0.14, matWallB, mallG, false);
          box(0.2, MALL.H, 0.3, s * 9.5, MALL.H / 2, -0.1, matWallB, mallG, false);
          box(0.56, MALL.H, 0.2, s * 13.72, MALL.H / 2, -0.14, matWallB, mallG, false);
        }
        box(SHOP.x1 - SHOP.x0, MALL.H - SHOP.H, 0.2, 0, SHOP.H + (MALL.H - SHOP.H) / 2, 0.04, matWallB, mallG, false);
        for (const s of [-1, 1]) box(0.2, MALL.H, D + 0.4, s * MALL.x1, MALL.H / 2, mz, matWallB, mallG, false);
        /* v21.18 · THE CORRIDOR'S END, where the film's walk looks (on a phone, the middle of the picture: it was a bare
           wall): a lift lobby — two lift doors in steel frames, a floor lamp over each, the call buttons — the mall's
           directory between them, and the green EXIT hung from the ceiling before it */
        { const ex = -MALL.x1 + 0.1;                                  // the end wall's inner face
          const steel = new THREE.MeshStandardMaterial({ color: 0xc2c8ce, roughness: 0.26, metalness: 0.55 }),
                frameS = new THREE.MeshStandardMaterial({ color: 0x8c9298, roughness: 0.35, metalness: 0.5 }),
                lamp = new THREE.MeshBasicMaterial({ color: 0xffb648 }), dark = new THREE.MeshStandardMaterial({ color: 0x15171a, roughness: 0.5 });
          for (const z of [1.05, 3.95]) {
            box(0.06, 2.42, 1.3, ex + 0.03, 1.21, z, frameS, mallG, false);
            for (const sd of [-1, 1]) box(0.04, 2.24, 0.56, ex + 0.08, 1.12, z + sd * 0.285, steel, mallG, false);
            box(0.05, 0.02, 0.012, ex + 0.1, 1.12, z, dark, mallG, false);
            box(0.04, 0.18, 0.52, ex + 0.05, 2.62, z, dark, mallG, false); plane(0.16, 0.08, lamp, ex + 0.075, 2.62, z, Math.PI / 2, mallG);
            box(0.03, 0.26, 0.11, ex + 0.05, 1.12, z + (z < 2.5 ? 0.82 : -0.82), frameS, mallG, false);
            for (const y of [1.07, 1.17]) plane(0.034, 0.034, lamp, ex + 0.068, y, z + (z < 2.5 ? 0.82 : -0.82), Math.PI / 2, mallG);
          }
          box(0.05, 1.5, 1.0, ex + 0.025, 1.5, 2.5, dark, mallG, false);
          plane(0.92, 1.38, new THREE.MeshBasicMaterial({ map: tex(makeMallDirectory(THREE, cnv)), color: 0xe6e6e6 }), ex + 0.055, 1.5, 2.5, Math.PI / 2, mallG);
          box(0.08, 0.3, 0.7, ex + 1.6, MALL.H - 0.42, 2.5, new THREE.MeshStandardMaterial({ color: 0xe8e8e2, roughness: 0.5 }), mallG, false);
          for (const sd of [-1, 1]) plane(0.64, 0.24, new THREE.MeshBasicMaterial({ map: tex(makeExitSign(THREE, cnv)) }), ex + 1.6 + sd * 0.041, MALL.H - 0.42, 2.5, sd * Math.PI / 2, mallG);
          for (const sd of [-0.25, 0.25]) box(0.012, 0.27, 0.012, ex + 1.6, MALL.H - 0.135, 2.5 + sd, frameS, mallG, false);
        }
        // the shop's own lightbox over its front
        const lbM = new THREE.MeshBasicMaterial({ map: tex(makeLightbox(THREE, cnv)) });
        plane(4.2, 0.6, lbM, 0, SHOP.H + 0.36, 0.15, 0, mallG);
        // two columns clad in small tiles
        for (const s of [-1, 1]) box(0.6, MALL.H, 0.6, s * 7.0, MALL.H / 2, 3.2, new THREE.MeshStandardMaterial({ color: 0xcfc6b4, roughness: 0.6 }), mallG);
        /* (v21.2: the HAPPY VESAK DAY banner that hung across the corridor is gone — Buddha Day is an uposatha day) */
      }

      return { shopG, mallG, SHOP, MALL, DOOR, LCNT, RCNT, ALTAR, OWN, STAFF, LPT, MSTR, CLOCK,
               lpCase, lpTilt, lpAmulet, lpHalo, lpMats, lpGlowTick, clockTo, flames, doorLeaves,
               trayGroup, displayShelf };   // (CP8: the tray shop dresses its own cabinet and counter with Chad's trays and shelves)
    }
    const H = buildWorldH();
    const H_SHELF = H.displayShelf, H_TRAYS = H.trayGroup;   // (World T builds with these: its own `H` is the shophouse's height)
    /* ============================================== WORLD H, ALIVE (CP7, docs/V22.0-E3C4-PLAN.md §4.3)
       The shop on an ordinary afternoon — its people, its door, its sound — and the owner's new Hanuman: set on his
       stand, picked up, and what it does to him; then the run out of the mall (the run-out film). Everything that moves
       is driven from hTick on WALL time (the v7.4 law) and nothing in World H runs while he is in another world.
       Every name below is used at RUN time only by the functions that follow (the chapter clock, the phase machine and
       the words are declared further down): nothing here reads them while build() is still running. */
    const BASE_FOV = 72;                                   // the engine's CAM_FOV: the world's lens in play (borrowed here, always given back)
    const hLive = { t: 0, owner: null, staff: null, cust: [], walker: null, walkDur: 0, look: false };
    const RADIO_H = { x: 1.95, z: -6.63 };                 // the shop's radio on its little table by the altar (chapter 3's)
    /* the shop's light when the piece surges: the same tubes gone to gold, the air thick with it (kit.daylight eases
       the chapter's own light into this and back) */
    const H_GOLD = {
      stops: [[0.00, '#ffd27a'], [0.30, '#f0a64a'], [0.60, '#c8742a'], [1.00, '#8a4a1a']],
      bg: 0xd89a4a, fog: [0xe2a656, 0.016],
      hemi: [0xffd88a, 0x8a5020, 1.2], key: [0xffc060, 1.15, 2, 8, 4], fill: [0xffa040, 0.5],
      stars: 0, moon: 0, sun: 0, clouds: 0,
      vmHemi: [0xffd88a, 0x8a5020, 1.15], vmKey: [0xffc060, 1.0]
    };

    /* ---- THE PEOPLE. CHAD'S owner behind his counter (v21.32's model on its retargeted standing idle and his own
       talking take, his shoulders eased toward his body — chapter 3's armFix); the staff man behind the other; two
       customers — Chad's granny at the staff's counter, chatting, and a young man in a blue tee at the far end of the
       owner's, looking into the glass (the botak recruit on his Walking take parked at 0.122, the frame where his feet
       are together — e2c1's stand, v8.1); and a shopper in a green tee walking the corridor past the glass. Every one a
       real model (v21.16): a file that fails to land leaves its place empty. The customers' columns stop him walking
       through them. */
    hLive.owner = mkPerson('owner', { parent: H.shopG, x: H.OWN.x, z: H.OWN.z, ry: -Math.PI / 2, height: 1.66, idle: 'Idle_9',
      talk: 'Talk_with_Hands_Open', talkWeight: 0.85, look: 1, armFix: { sh: 6, arm: 7 } });
    hLive.staff = mkPerson('staffman', { parent: H.shopG, x: H.STAFF.x, z: H.STAFF.z, ry: Math.PI / 2, height: 1.73, idle: 'Idle_9',
      talk: 'Talk_with_Hands_Open', talkWeight: 0.85, look: 0.6, armFix: { sh: 6, arm: 7 } });
    const CUST = [{ x: -2.3, z: -3.25, ry: -Math.PI / 2 }, { x: 2.3, z: -3.6, ry: Math.PI / 2 }];
    hLive.cust.push(mkPerson('granny', { parent: H.shopG, x: CUST[0].x, z: CUST[0].z, ry: CUST[0].ry, height: 1.55, idle: 'Stand_and_Chat', idleRate: 0.85, look: 0.45 }));
    hLive.cust.push(mkPerson('botak', { parent: H.shopG, x: CUST[1].x, z: CUST[1].z, ry: CUST[1].ry, height: 1.72, idle: 'Walking', at: 0.122, look: 0.5 }));
    for (const c of CUST) { const m = box(0.44, 1.6, 0.44, c.x, 0.8, c.z, matProxy, H.shopG, false); m.visible = false; solids.push(m); }
    /* the shopper: up and down the corridor's far side at a stroll, turning round at each end (a quarter of a second of
       stepping in place); his take's rate from the ground he covers, so his feet never skate (the v9.3 law: STRIDE is
       the Walking take's own, measured at e2c1 — 1.33–1.44 m a cycle for a man of 1.72) */
    const WALK = { z: 4.05, x0: -11.5, x1: 11.5, v: 1.15, stride: 1.38, turn: 0.8 };
    const walk = { x: -8.5, dir: 1, turnT: 0 };
    hLive.walker = mkPerson('admintee', { parent: H.mallG, x: walk.x, z: WALK.z, ry: Math.PI / 2, height: 1.74, idle: 'Walking', look: 0,
      then: (P) => { hLive.walkDur = P.idle ? P.idle.getClip().duration : 0;
                     P.model.traverse(o => { if (o.isMesh) o.castShadow = false; }); } });   // a walker's shadow would redraw the maps every frame
    function walkerTick(wdt) {
      const P = hLive.walker; if (!P || !P.ready || runLive.on) return;
      const rate = hLive.walkDur ? WALK.v * hLive.walkDur / WALK.stride : 1;
      if (walk.turnT > 0) {
        walk.turnT = Math.max(0, walk.turnT - wdt);
        const k = smooth(1 - walk.turnT / WALK.turn), r0 = (walk.dir > 0 ? -1 : 1) * Math.PI / 2, r1 = -r0;
        P.group.rotation.y = r0 + (r1 - r0) * k;                       // through facing the far shops, never the glass
        if (P.idle) P.idle.setEffectiveTimeScale(rate * 0.55);
      } else {
        walk.x += walk.dir * WALK.v * wdt;
        if (walk.x > WALK.x1 || walk.x < WALK.x0) { walk.x = THREE.MathUtils.clamp(walk.x, WALK.x0, WALK.x1); walk.dir = -walk.dir; walk.turnT = WALK.turn; }
        else P.group.rotation.y = walk.dir > 0 ? Math.PI / 2 : -Math.PI / 2;
        if (P.idle) P.idle.setEffectiveTimeScale(rate);
      }
      P.group.position.set(walk.x, 0, WALK.z);
    }

    /* ---- THE DOOR: its two leaves on their outer stiles, swinging OUT into the corridor (the run-out film opens them;
       in play the doorway is shut by its blocker, as chapter 3's was) */
    function doorsTo(k) { for (const L of H.doorLeaves) L.hinge.rotation.y = L.s * 1.38 * k; }

    /* ---- THE NEW HANUMAN ON HIS STAND. Chapter 3's stand on the owner's counter is EMPTY on an ordinary day (the Luang
       Phu Tim went with him on Buddha Day), and the owner brings the new piece up from under his counter as he calls him
       over: it rises onto the red velvet, half a second, and its glow comes up round it (chapter 3's v21.8 glow,
       lpGlowTick). CHAD'S Hanuman amulet, every triangle within 1.4 m (the v14.14 rule). */
    const LP_Y0 = H.lpAmulet.position.y;
    const stand = { k: 0, to: 0 };
    function standShow(on, now) { stand.to = on ? 1 : 0; if (now) stand.k = stand.to; }
    function standTick(wdt) {
      stand.k += (stand.to - stand.k) * (1 - Math.exp(-wdt / 0.16));
      if (Math.abs(stand.to - stand.k) < 0.003) stand.k = stand.to;
      const on = stand.k > 0.002, e = smooth(stand.k);
      H.lpAmulet.visible = H.lpHalo.visible = on;
      H.lpAmulet.position.y = LP_Y0 - 0.05 * (1 - e);
      H.lpAmulet.scale.setScalar(0.6 + 0.4 * e);
      H.lpHalo.scale.setScalar(Math.max(0.01, e));
    }
    /* where it falls when he lets it go: lying on the counter's glass in front of its stand, at every triangle up close
       and the light cut beyond (the stand's own two levels, the far one wearing the near one's material) */
    const hDrop = new THREE.LOD(); hDrop.visible = false;
    hDrop.position.set(H.LPT.x - 0.17, H.RCNT.top + 0.008, H.LPT.z + 0.12); hDrop.rotation.set(-Math.PI / 2, 0, 0.6); H.shopG.add(hDrop);
    Promise.all([parseOnce('hanuamuletlod'), parseOnce('hanuamulet')]).then(([lo, hd]) => {
      if (!alive) return;
      let nearMat = null;
      for (const [src, d] of [[hd.scene, 0], [lo.scene, 1.4]]) {
        const m = src.clone(true); m.scale.setScalar(0.075);
        m.traverse(q => { if (!q.isMesh) return; q.castShadow = false; q.receiveShadow = true;
          if (d > 0 && nearMat) q.material = nearMat; else if (!nearMat) nearMat = q.material; });
        hDrop.addLevel(m, d);
      }
    }).catch(() => {});
    function dropShow(on) { hDrop.visible = !!on; }

    /* ---- THE HANUMAN IN HIS HAND: CHAD'S amulet at every triangle, 9 cm, its face to the lens (the Yin locket's own
       place above the fingertip, CP5e), with its own copy of the materials so its gold can be lit from within as it
       surges; a glint in its eyes, embers rising off it, the ring the roar sends out of it — additive, in the hands'
       pass (kit.hold makes it a child of the right arm). When the urge comes he closes both hands round it, the way a
       piece is held to feel it, and it rides into the clasp over the clasp's own 0.9 s. */
    const hanHeld = new THREE.Group(); hanHeld.visible = false;
    const hanAm = new THREE.Group(); hanHeld.add(hanAm);
    const hanMats = [];
    parseOnce('hanuamulet').then(hd => {
      if (!alive) return;
      const m = hd.scene.clone(true); m.scale.setScalar(0.09);
      m.traverse(q => {
        if (!q.isMesh) return;
        q.castShadow = false; q.receiveShadow = false;
        q.material = (Array.isArray(q.material) ? q.material : [q.material]).map(mt => {
          if (!mt || !mt.emissive) return mt;
          const c = mt.clone(); c.emissive.set(0xffb347); c.emissiveIntensity = 0; c.emissiveMap = c.map || null;
          hanMats.push(c); mats.push(c); return c;
        });
        if (q.material.length === 1) q.material = q.material[0];
      });
      hanAm.add(m);
    }).catch(err => { console.warn('the Hanuman amulet failed to load', err); ctx.loadFail && ctx.loadFail('hanuamulet', err); });
    const hGlowTex = tex(makeGlowTex(THREE, cnv, [255, 214, 140]));
    const hSprite = (color, ro) => {
      const m = new THREE.SpriteMaterial({ map: hGlowTex, color, transparent: true, opacity: 0, depthTest: false, depthWrite: false,
        blending: THREE.AdditiveBlending, fog: false }); mats.push(m);
      const sp = new THREE.Sprite(m); sp.renderOrder = ro; sp.visible = false; return sp;
    };
    const glint = hSprite(0xffffff, 52); glint.position.set(0.003, 0.021, 0.008); hanHeld.add(glint);
    // the light that leaks from between his palms once they have closed round it (CP7: the piece itself, turned
    // edge-on to fit the gap, read as a gold stick standing between his hands)
    const claspGlow = hSprite(0xffc463, 54); claspGlow.position.set(0, 0.012, 0.03); hanHeld.add(claspGlow);
    const hEmb = [];
    for (let i = 0; i < 14; i++) {
      const sp = hSprite(i % 3 ? 0xffa83a : 0xffd27a, 51); hanHeld.add(sp);
      hEmb.push({ sp, ph: i / 14, a: hash(i, 71) * Math.PI * 2, r: 0.006 + 0.022 * hash(i, 73), rise: 0.7 + 0.6 * hash(i, 79) });
    }
    const hRing = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex(makeShockRing(THREE, cnv)), color: 0xffc860, transparent: true, opacity: 0,
      depthTest: false, depthWrite: false, blending: THREE.AdditiveBlending, fog: false }));
    hRing.renderOrder = 53; hRing.visible = false; hanHeld.add(hRing); mats.push(hRing.material);
    owned.push({ dispose: () => { if (kit && kit.holding && kit.holding() === hanHeld) kit.hold(null); } });
    const HELD_POS = [0.02, 0.0, -0.19];
    const hold = { mode: '', k: 1, p0: new THREE.Vector3(), q0: new THREE.Quaternion(), p1: new THREE.Vector3(), q1: new THREE.Quaternion() };
    /* (CP7, photographed: at HELD_POS — the Yin locket's place, "above the fingertip" — it floated over the finger on a
       desktop and sat BEHIND the finger on a phone; neither read as held.) It hangs from his fingertip by its loop now,
       the way a piece is held up to be looked at: the index's last joint, carried on past itself to the tip, measured
       off the rig in the arm's own frame each time it is taken (so a re-laid phone frame cannot leave it in the air);
       the loop a few millimetres over the tip, the piece hanging under it, a centimetre nearer the lens than the finger
       so it hangs in front of it. HOLD_TUNE is for a probe (stage.han.tune). */
    const HOLD_TUNE = { up: 0.006, near: 0.012, side: 0, tilt: -0.25 };
    const _ft2 = new THREE.Vector3(), _ft3 = new THREE.Vector3(), _ftd = new THREE.Vector3();
    function fingertipIn(arm) {
      let b2 = null, b3 = null;
      arm.traverse(o => { if (!o.isBone) return; if (o.name === 'f_index02R') b2 = o; else if (o.name === 'f_index03R') b3 = o; });
      if (!b2 || !b3) return null;
      arm.updateMatrixWorld(true);
      b2.getWorldPosition(_ft2); b3.getWorldPosition(_ft3);
      _ftd.subVectors(_ft3, _ft2);
      return arm.worldToLocal(_ft3.addScaledVector(_ftd, 0.85));
    }
    function hangFromTip() {
      const arm = hanHeld.parent, tip = arm ? fingertipIn(arm) : null;
      if (!tip) return false;
      hanHeld.rotation.set(ARM_INV.x + HOLD_TUNE.tilt, ARM_INV.y, ARM_INV.z);
      _ftd.set(HOLD_TUNE.side, -(0.045 - HOLD_TUNE.up), HOLD_TUNE.near).applyQuaternion(hanHeld.quaternion);
      hanHeld.position.copy(tip).add(_ftd);
      return true;
    }
    function hanHeldShow(mode) {
      if (!kit || !kit.hold) return;
      if (!mode) { hanHeld.visible = false; hold.mode = ''; if (!kit.holding || kit.holding() === hanHeld) kit.hold(null); return; }
      hanHeld.visible = true;
      if (mode === 'hand') {
        kit.hold(hanHeld, { pos: HELD_POS, rot: [ARM_INV.x - 0.25, ARM_INV.y, ARM_INV.z] });
        hangFromTip();
        hold.mode = 'hand'; hold.k = 1; hanAm.scale.setScalar(1); hanAm.rotation.y = 0; hanAm.visible = true; claspGlow.visible = false;
      } else {
        // the clasp's place and turn are kit.hold's own (between the palms): read them, then ease there from the hand's
        hold.p0.copy(hanHeld.position); hold.q0.copy(hanHeld.quaternion);
        kit.hold(hanHeld, { clasp: true, lift: 0.012 });
        hold.p1.copy(hanHeld.position); hold.q1.copy(hanHeld.quaternion);
        hanHeld.position.copy(hold.p0); hanHeld.quaternion.copy(hold.q0);
        hold.mode = 'clasp'; hold.k = 0;
      }
    }

    /* ---- THE VISION. Chad's Hanuman (chapter 3's file), HUGE — 4.6 m — in translucent gold fire, standing before him
       wherever he looks: a vision is in his mind, not in the room, so it is drawn OVER everything (the depth buffer is
       cleared under it once the shop is drawn: `clearer`, the first thing drawn after every room surface) and it keeps
       to his line of sight a step behind his turning. Out of the floor, leaning toward the lens. Two layers as in
       chapter 3 — one solid body of light (its depth laid first, then its colour on that depth only, so its near arm
       hides its far side: the Yin ghost's two passes, v22.0 CP5) and a thin additive shell — over a halo that breathes,
       embers round it. Unlit and additive: no light, so the light count never changes (v15.1).
       (CP7, photographed: stood on the floor 6.8 m out, its FACE landed under the stat bars on a phone and above the
       frame on a desktop — the shot was its costume. Now its face is put where the eye goes: the base is solved every
       frame from the lens as it is — its fov AND its pitch — so the face sits in the middle, a little above centre
       (`ndc`: 32 % of the way from the middle to the top — clear of the stat bars on a phone, its crown included, at
       the urge's narrowest lens), and the figure sinks into the floor as far as that takes — a vision rises out of the
       ground, it does not stand on it. `lean`: the metres its face comes nearer as it leans in. FACE is the
       forward-most part at head height, in heights, measured off the scan: masters/v22.0/cp7/hanuslices.mjs) */
    const VIS = { d: 8.5, h: 4.6, ndc: 0.32, lean: 0.6 };
    const FACE = { x: -0.14, y: 0.78, z: 0.42 };
    const hanVis = new THREE.Group(); hanVis.visible = false; hanVis.rotation.order = 'YXZ'; world.add(hanVis);
    const visMats = [];
    let visReady = false;
    { const cm = new THREE.MeshBasicMaterial({ colorWrite: false, depthWrite: false, depthTest: false, transparent: true }); mats.push(cm);
      const clearer = new THREE.Mesh(new THREE.PlaneGeometry(0.01, 0.01), cm);
      clearer.renderOrder = 899; clearer.frustumCulled = false; clearer.onBeforeRender = (r) => r.clearDepth(); hanVis.add(clearer); }
    parseOnce('hanuman').then(gl => {
      if (!alive) return;
      const src = gl.scene; src.updateMatrixWorld(true);
      const bb = new THREE.Box3().setFromObject(src), k = VIS.h / (bb.max.y - bb.min.y);
      const pre = new THREE.MeshBasicMaterial({ colorWrite: false, depthWrite: true, transparent: true }); mats.push(pre);
      for (const [color, op, blend, sc, ro] of [[0xffd27a, 0.74, THREE.NormalBlending, 1.0, 901], [0xffa83a, 0.34, THREE.AdditiveBlending, 1.025, 902]]) {
        const m = src.clone(true), pres = [];
        m.traverse(o => {
          if (!o.isMesh) return;
          const mt = new THREE.MeshBasicMaterial({ map: o.material.map || null, color, transparent: true, opacity: 0, depthWrite: false,
            depthFunc: THREE.LessEqualDepth, blending: blend, fog: false, side: THREE.FrontSide });
          mt.userData.peak = op; visMats.push(mt); mats.push(mt);
          o.material = mt; o.castShadow = false; o.receiveShadow = false; o.renderOrder = ro; o.frustumCulled = false;
          if (blend === THREE.NormalBlending) {          // the body's depth, laid first
            const pm = new THREE.Mesh(o.geometry, pre); pm.renderOrder = 900; pm.frustumCulled = false;
            pm.position.copy(o.position); pm.quaternion.copy(o.quaternion); pm.scale.copy(o.scale); pres.push([o.parent, pm]);
          }
        });
        for (const [par, pm] of pres) par.add(pm);
        const w = new THREE.Group(); w.scale.setScalar(k * sc); w.position.y = -bb.min.y * k * sc; w.add(m); hanVis.add(w);
      }
      visReady = true;
    }).catch(err => { console.warn('hanuman failed to load', err); ctx.loadFail && ctx.loadFail('hanuman', err); });
    const visHalo = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: hGlowTex, color: 0xffb04a, transparent: true, opacity: 0,
      depthTest: false, depthWrite: false, blending: THREE.AdditiveBlending, fog: false }));
    visHalo.renderOrder = 898; visHalo.frustumCulled = false; world.add(visHalo); visHalo.visible = false; mats.push(visHalo.material);
    const VEMB = 80, visEmbGeo = new THREE.BufferGeometry(), visEmbSeed = [];
    for (let i = 0; i < VEMB; i++) visEmbSeed.push([hash(i, 3) * Math.PI * 2, 0.5 + hash(i, 5) * 1.3, hash(i, 7), 0.4 + hash(i, 11) * 0.8, (hash(i, 13) - 0.5) * 2]);
    visEmbGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(VEMB * 3), 3));
    const visEmbMat = new THREE.PointsMaterial({ map: hGlowTex, color: 0xffd090, size: 0.16, sizeAttenuation: true, transparent: true, opacity: 0,
      depthTest: false, depthWrite: false, blending: THREE.AdditiveBlending, fog: false }); mats.push(visEmbMat);
    const visEmb = new THREE.Points(visEmbGeo, visEmbMat); visEmb.frustumCulled = false; visEmb.renderOrder = 905; visEmb.visible = false; world.add(visEmb);

    /* ---- THE EXPERIENCE'S STATE, every number eased on wall time; `run` cancels a beat a reset or a second start
       has made stale (the Yin's shape) */
    const hanX = { on: false, run: 0, released: false, tries: 0, uw: 0, uwTo: 0, gold: 0, goldTo: 0, emb: 0, embTo: 0,
                   glintT: -1, ring: -1, fovK: 0, fovTo: 0, kick: 0, kickWas: 0, silent: 0,
                   vis: { on: false, t: 0, placed: false, burst: 0, base: new THREE.Vector3() } };
    const _hq = new THREE.Quaternion(), _hu = new THREE.Vector3(), _hv = new THREE.Vector3(), _hc = new THREE.Vector3(), _hw = new THREE.Vector3();
    const _vt = new THREE.Vector3(), _vo = new THREE.Vector3();
    function visShow(on) { const V = hanX.vis; V.on = !!on; if (on) { V.t = 0; V.placed = false; V.burst = 0; } }
    // (for the probes: where its face is on the screen, as NDC — CP7's framing is checked by number, not only by eye)
    function visFaceNdc() {
      if (!hanVis.visible) return null;
      _hw.set(FACE.x * VIS.h, FACE.y * VIS.h, FACE.z * VIS.h).applyMatrix4(hanVis.matrixWorld).project(camera);
      return [+_hw.x.toFixed(3), +_hw.y.toFixed(3)];
    }
    function visTick(wdt) {
      const V = hanX.vis;
      if (!V.on || !visReady) { hanVis.visible = visHalo.visible = visEmb.visible = false; return; }
      V.t += wdt;
      const rise = smooth(cl01(V.t / 1.5)), lean = smooth(cl01((V.t - 0.8) / 2.4));
      if (V.burst > 0) V.burst = Math.min(1, V.burst + wdt / 0.55);
      const b = V.burst, k = rise * (1 - b);
      hanVis.visible = k > 0.003;
      // ITS FACE'S PLACE ON THIS FRAME: on the ray through (0, VIS.ndc) of the lens as it IS — its pitch included. (CP7,
      // photographed: he takes the piece looking DOWN at its stand, 16° under the level, and a face solved on the level
      // rode up behind the stat bars on a phone and off the top of a desktop's frame — worse as the lens drew in on the
      // urge.) It comes VIS.lean metres nearer as it leans in, so the lean reads as an approach, not a change of pose.
      // The base is solved back from that face through the vision's own turn and lean, and eased after it, so it follows
      // his eyes the way a thing in the mind does — never glued to the glass.
      camera.getWorldPosition(_hc);
      const tanH = Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2), D = VIS.d - FACE.z * VIS.h - VIS.lean * lean;
      _vt.set(0, VIS.ndc * tanH * D, -D); camera.localToWorld(_vt);
      // turned to him: from where it stands once it is placed, and on its first frame from his own heading (where it
      // stood last time is no guide)
      if (!V.placed) camera.getWorldDirection(_hv);
      const yaw = V.placed ? Math.atan2(_hc.x - hanVis.position.x, _hc.z - hanVis.position.z) : Math.atan2(-_hv.x, -_hv.z);
      hanVis.rotation.set(0.13 * lean, yaw, 0, 'YXZ');
      const sc = 1 + 0.35 * smooth(b);
      _vo.set(FACE.x * VIS.h * sc, FACE.y * VIS.h * sc, FACE.z * VIS.h * sc).applyEuler(hanVis.rotation);
      _vt.sub(_vo);
      if (!V.placed) { V.base.copy(_vt); V.placed = true; } else V.base.lerp(_vt, 1 - Math.exp(-wdt * 2.2));
      hanVis.position.copy(V.base); hanVis.position.y -= VIS.h * 0.55 * (1 - rise);
      hanVis.scale.setScalar(sc);
      hanVis.updateMatrixWorld(true);
      const flick = 0.86 + 0.14 * Math.sin(hLive.t * 9.3) * Math.sin(hLive.t * 5.7 + 1.3), beat = 0.5 + 0.5 * Math.sin(hLive.t * (hanX.fovTo > 0 ? 13.4 : 7.0));
      for (const m of visMats) m.opacity = m.userData.peak * k * (m.blending === THREE.AdditiveBlending ? flick * (0.85 + 0.35 * beat) : 1);
      // the halo behind its head and shoulders, and its embers: drawn up into it as it rises, flung out of it when it bursts
      _hw.set(FACE.x * VIS.h, VIS.h * 0.66, 0).applyMatrix4(hanVis.matrixWorld);
      visHalo.visible = visEmb.visible = k > 0.003 || (b > 0 && b < 1);
      visHalo.position.copy(_hw); camera.getWorldQuaternion(visHalo.quaternion);
      visHalo.scale.setScalar((5.2 + 0.4 * Math.sin(hLive.t * 6.0)) * (1 + 0.6 * b));
      visHalo.material.opacity = 0.5 * k * flick * (0.8 + 0.4 * beat);
      const EP = visEmbGeo.attributes.position;
      for (let i = 0; i < VEMB; i++) {
        const [a0, r0, ph, rs, sp] = visEmbSeed[i], u = (hLive.t * rs * 0.3 + ph) % 1, a = a0 + hLive.t * sp * 0.5;
        const rr = (r0 * (1.2 - 0.6 * rise) + 0.2) * (1 + 6 * b * b);
        EP.setXYZ(i, _hw.x + Math.cos(a) * rr, _hw.y - VIS.h * 0.45 + u * VIS.h * 1.05 + 3 * b * (ph - 0.3), _hw.z + Math.sin(a) * rr);
      }
      EP.needsUpdate = true;
      visEmbMat.opacity = Math.min(1, 0.9 * (k + (b > 0 ? 1.2 * (1 - b) : 0)));
      if (b >= 1) { V.on = false; hanVis.visible = visHalo.visible = visEmb.visible = false; }
    }
    function hanTick(wdt) {
      const ease = (v, to, s) => v + (to - v) * (1 - Math.exp(-wdt / s));
      hanX.uw = ease(hanX.uw, hanX.uwTo, hanX.uwTo > hanX.uw ? 0.12 : 0.9);
      hanX.gold = ease(hanX.gold, hanX.goldTo, hanX.goldTo > hanX.gold ? 0.3 : 0.5);
      hanX.emb = ease(hanX.emb, hanX.embTo, 0.4);
      const beat = 0.5 + 0.5 * Math.sin(hLive.t * (hanX.fovTo > 0 ? 13.4 : 7.0));
      for (const m of hanMats) {
        if (!m.emissiveMap && m.map) { m.emissiveMap = m.map; m.needsUpdate = true; }
        m.emissiveIntensity = hanX.gold * (0.35 + 0.45 * beat);
      }
      // the glint in its eyes, once, at the weight of it
      if (hanX.glintT >= 0) {
        hanX.glintT += wdt; const k = hanX.glintT / 0.45;
        glint.visible = k < 1; glint.material.opacity = k < 1 ? Math.sin(Math.PI * k) : 0;
        glint.scale.setScalar(0.01 + 0.035 * Math.sin(Math.PI * Math.min(1, k)));
        if (k >= 1) hanX.glintT = -1;
      }
      // the embers rising off it — up the vm scene's own up, carried into the held frame
      if (hanHeld.visible && hanX.emb > 0.01) {
        hanHeld.getWorldQuaternion(_hq); _hu.set(0, 1, 0).applyQuaternion(_hq.invert());
        for (const e of hEmb) {
          e.ph = (e.ph + wdt * 0.55 * e.rise) % 1;
          const u = e.ph, a = e.a + hLive.t * 1.3;
          e.sp.position.set(Math.cos(a) * e.r, 0, Math.sin(a) * e.r * 0.5).addScaledVector(_hu, 0.012 + u * 0.17);
          const sc = 0.006 + 0.013 * Math.sin(Math.PI * u); e.sp.scale.set(sc, sc, 1);
          e.sp.material.opacity = Math.sin(Math.PI * u) * hanX.emb * 0.85; e.sp.visible = true;
        }
      } else for (const e of hEmb) e.sp.visible = false;
      // the ring the roar sends out of it, past the edges of the frame
      if (hanX.ring >= 0) {
        hanX.ring += wdt; const k = hanX.ring / 0.7;
        hRing.visible = k < 1; hRing.scale.setScalar(0.03 + 1.9 * smooth(Math.min(1, k))); hRing.material.opacity = 0.95 * Math.max(0, 1 - k);
        if (k >= 1) hanX.ring = -1;
      }
      // into the clasp, over the clasp's own 0.9 s: the piece goes in between his palms and is gone from sight (it is
      // held, not shown), and the gold leaks out between them — breathing with the heart, brightest as the urge pulls
      if (hold.mode === 'clasp') {
        if (hold.k < 1) {
          hold.k = Math.min(1, hold.k + wdt / 0.9); const e = smooth(hold.k);
          hanHeld.position.lerpVectors(hold.p0, hold.p1, e); hanHeld.quaternion.slerpQuaternions(hold.q0, hold.q1, e);
          hanAm.scale.setScalar(Math.max(0.001, 1 - e)); hanAm.visible = e < 0.98;
        }
        const g = smooth(hold.k) * (0.45 + 0.55 * hanX.gold) * (0.7 + 0.3 * beat);
        claspGlow.visible = g > 0.01; claspGlow.material.opacity = Math.min(1, g);
        claspGlow.scale.setScalar(0.05 + 0.03 * beat + 0.04 * hanX.fovK);
      }
      visTick(wdt);
      // the lens drawn in toward it (being pulled), and the kick of the roar — both laid on the look the player owns
      const st = getState();
      hanX.fovK = ease(hanX.fovK, hanX.fovTo, hanX.fovTo > hanX.fovK ? 2.2 : 0.6);
      if (st === 'play') {
        const fov = hanX.fovK < 0.002 && hanX.fovTo === 0 ? BASE_FOV : BASE_FOV - 14 * hanX.fovK;
        if (Math.abs(camera.fov - fov) > 0.005 && (hanX.on || hanX.fovK > 0.0001 || camera.fov < BASE_FOV)) { camera.fov = fov; camera.updateProjectionMatrix(); }
        pitch.rotation.x += hanX.kick - hanX.kickWas; hanX.kickWas = hanX.kick;
        hanX.kick *= Math.exp(-wdt * 5.5); if (hanX.kick < 1e-4) { pitch.rotation.x -= hanX.kickWas; hanX.kick = hanX.kickWas = 0; }
      }
    }

    /* ---- THE MALL AROUND THE SHOP: chapter 3's seven small sounds of a Golden Mile afternoon (h4*, its own copies), one
       at a time on the chapter's clock from a seeded stream, panned from where each comes from — a neighbour's shutter,
       a trolley, a phone next door, a till, a plastic bag, a child, slippers. Only while he browses; never under the
       experience; reset() rewinds the stream (the v8.1 law) */
    const H_AMB = [
      { n: 'h4shutter', v: 0.30, at: () => ({ x: hSide(6, 12), z: 2.5 }) },
      { n: 'h4trolley', v: 0.30, at: () => ({ x: hSide(0, 10), z: 2.5 }) },
      { n: 'h4phone', v: 0.14, at: () => ({ x: hSide(6, 7), z: -3.0 }) },
      { n: 'h4cash', v: 0.18, at: () => ({ x: hSide(6, 7), z: -2.0 }) },
      { n: 'h4bag', v: 0.26, at: () => ({ x: hSide(0, 4), z: 1.0 }) },
      { n: 'h4child', v: 0.18, at: () => ({ x: hSide(2, 9), z: 2.5 }) },
      { n: 'h4slippers', v: 0.30, at: () => ({ x: hSide(0, 6), z: 1.5 }) }
    ];
    const hAmb = { at: 0, seed: 0 };
    const hRand = () => hash(++hAmb.seed, 97);
    const hSide = (lo, hi) => (hRand() < 0.5 ? -1 : 1) * (lo + hRand() * (hi - lo));
    function hAmbTick() {
      if (worldOf(yaw.position.x) !== 'H' || !(phase === 'han' || phase === 'hanHold') || hanX.on || getState() !== 'play') return;
      if (!hAmb.at) { hAmb.at = dayClock.t + 6; return; }
      if (dayClock.t < hAmb.at) return;
      const a = H_AMB[Math.floor(hRand() * H_AMB.length) % H_AMB.length], p = a.at();
      if (worldSfx) worldSfx(a.n, a.v * (quiet() ? 1 : 0.66), 1, panAt(HX + p.x, p.z));
      hAmb.at = dayClock.t + 8 + hRand() * 10;
    }
    /* the shop's beds, by where he stands (chapter 3's v21.13 levels): the A/C and its fans, the corridor's people
       through the glass (louder at the front), the mall's own air, and the radio by the altar (its pan its bearing);
       under the roar every one of them goes under water, and for the 0.4 s after he lets go, nothing at all */
    const mixH = { air: 0, walla: 0, mall: 0, radio: 0 };
    function mixBedsH(wdt, st) {
      const B = DATA.ambience.beds, inH = worldOf(yaw.position.x) === 'H';
      const z = yaw.position.z, front = cl01((z + 4.5) / 4.0), out = z > 0.15;
      const live = inH && st !== 'result' && st !== 'complete';
      const sink = (1 - 0.82 * hanX.uw) * (1 - hanX.silent);
      const dR = Math.hypot(yaw.position.x - (HX + RADIO_H.x), z - RADIO_H.z);
      const radio = live ? (out ? 0.07 : 0.3 * (0.55 + 0.45 / (1 + (dR / 3.0) ** 2))) * sink * (1 - 0.6 * hanX.uw) : 0;
      const air = live ? (out ? 0.03 : 0.11) * sink : 0;
      const walla = live ? (out ? 0.8 : 0.36 + 0.44 * front) * sink : 0;
      const mall = live ? (out ? 0.34 : 0.12 + 0.2 * front) * sink : 0;
      const k = 1 - Math.exp(-wdt / (hanX.silent ? 0.05 : 0.8));
      mixH.radio += (radio - mixH.radio) * k; mixH.air += (air - mixH.air) * k;
      mixH.walla += (walla - mixH.walla) * k; mixH.mall += (mall - mixH.mall) * k;
      B[4][1] = mixH.air; B[5][1] = mixH.walla; B[6][1] = mixH.mall; B[7][1] = mixH.radio;
      B[7][2] = inH ? panAt(HX + RADIO_H.x, RADIO_H.z) : 0;
    }
    function hTick(wdt) {
      if (wdt <= 0) return;
      if (Math.abs(yaw.position.x - HX) > 60 && !hanX.on) return;
      hLive.t += wdt;
      H.lpGlowTick(hLive.t);
      standTick(wdt);
      walkerTick(wdt);
      hanTick(wdt);
    }

    /* ============================================== WORLD T · THE TRAY SHOP (CP8, docs/V22.0-E3C4-PLAN.md §4.4)
       An old Chinatown shophouse one afternoon, its whole front folded open onto the five-foot way and a street in the
       sun: Chad's amulet shelves down the right wall and a teak cabinet of framed amulets, open shelves of antiques down
       the left (blue-and-white porcelain, clay teapots, brass, old clocks) under calligraphy, a long teak counter across
       the shop with its glass top over the velvet and a clay tea set, the pendulum clock on the back wall over the owner,
       the Buddha on a red altar in the back corner, the stair going up. Lamps are emissive and painted (the v15.1 law);
       the afternoon comes in at the front as a painted patch of sun on the tiles. Everything that moves (the fans, the
       pendulum, the lamps on their cords, the incense, the steam off the tea, the dust in the sun) is driven from tTick
       on wall time (the v7.4 law), and nothing in World T runs while he is in another world. */
    const TFRONT = { pier: 0.38, head: 2.78, way: 3.4 };          // the opening's piers, the header's underside, the five-foot way's ceiling
    const TSTAIR = { x0: 2.30, x1: 2.98, zFoot: -5.80, zTop: -8.88, n: 13 };   // the stair up, along the right wall behind the counter
    const TCLOCK = { x: 0.55, y: 2.30, z: -8.86 };                // the pendulum clock on the back wall, over the owner
    const TALTAR = { x: -2.02, z: -8.64, w: 1.30, d: 0.46, h: 0.92 };   // the Buddha's altar, the back wall's left
    const TTRAY  = { x: 0.55, z: -5.90, w: 0.44, d: 0.24 };      // the velvet tray on the counter, before his stool (local)
    const TSEAT  = { y: 0.64, eye: 1.38 };                        // his stool's seat; his eye, seated on it (0.74 m over the seat)
    const tLive = { t: 0, fans: [], fanK: 1, pend: null, swing: 0, clockOn: true, tickAt: 0, tickK: 1, lamps: [], lampSwing: 0, lampPh: 0,
                    smoke: [], steam: null, steamK: 0, motes: null, sun: null, shade: null, owner: null, walkers: [], cups: [],
                    glows: [], bulbs: [], amber: 0, red: 0, teal: 0, built: false };
    /* the endings' own state (CP9): declared here, before World T's per-frame functions that read it (bundlePlace and
       presTick run while build() does), so it is never in a `const`'s dead zone (the v21.1 trap) */
    const endLive = { on: '', where: 'shop', tension: 0, presOwn: false, presVis: false, halos: true, day: null, t0: null, holdBone: null,
                      holdPend: null, owner0: null, pres0: null, bundleAt: null, dusk: 0, room: 0, spilt: false };
    function buildWorldT() {
      const G = worldT;
      const W = TSHOP.x1 - TSHOP.x0, D = TSHOP.z1 - TSHOP.z0, cz = (TSHOP.z0 + TSHOP.z1) / 2, H = TSHOP.H;
      /* ---- textures and materials (drawn; nothing downloaded but the models) */
      const tTeak = tex(makeTeak(THREE, cnv, 4123)), tTeak2 = tex(makeTeak(THREE, cnv, 4131));
      const tTiles = tex(makeCementTilesT(THREE, cnv)), tPlaster = tex(makeShopPlasterT(THREE, cnv));
      const tFret = tex(makeFretwork(THREE, cnv)), tSign = tex(makeTraySign(THREE, cnv)), tAltarB = tex(makeAltarBackT(THREE, cnv));
      const tPorc = [4141, 4143, 4147].map(s => tex(makePorcelain(THREE, cnv, s)));
      const tShade = tex(makeShadeT(THREE, cnv)), tSun = tex(makeSunPatchT(THREE, cnv)), tClock = tex(makeOldClockFace(THREE, cnv));
      const tCal = tex(makeCalendarT(THREE, cnv)), tGlow = tex(makeYinGlow(THREE, cnv)), tSmoke = tex(makeYinSmoke(THREE, cnv)), tFlame = tex(makeYinFlame(THREE, cnv));
      const tFfw = tex(makePeranakanTiles(THREE, cnv));
      const tScrolls = ['福祿壽', '平安', '招財進寶', '和氣生財'].map((w, i) => tex(makeScroll(THREE, cnv, w, 4151 + i * 7)));
      tLive.tGlow = tGlow; tLive.tSmoke = tSmoke;
      const mTeak    = M({ map: tTeak, color: 0xc08a5c, roughness: 0.48 });
      const mTeakDk  = M({ map: tTeak2, color: 0x7a5032, roughness: 0.42 });
      const mTiles   = M({ map: tTiles, roughness: 0.5 });
      const mPlaster = M({ map: tPlaster, color: 0xf2e8d2, roughness: 0.95 });
      const mFfw     = M({ map: tFfw, roughness: 0.55 });
      const mGlass   = M({ color: 0xd4e4de, roughness: 0.05, metalness: 0.1, transparent: true, opacity: 0.13, depthWrite: false });
      const mBrass   = M({ color: 0xb48a3c, roughness: 0.32, metalness: 0.85 });
      const mGilt    = M({ color: 0xc89a3e, roughness: 0.35, metalness: 0.7, emissive: 0x2a1a04, emissiveIntensity: 0.4 });
      const mRedLac  = M({ color: 0x8c1a12, roughness: 0.34 });
      const mBlkLac  = M({ color: 0x1c100a, roughness: 0.3 });
      const mEnamel  = M({ color: 0x2f5a46, roughness: 0.38, metalness: 0.15, side: THREE.DoubleSide });
      const mEnamelIn = M({ color: 0xf2eee2, roughness: 0.5, side: THREE.BackSide });
      const mVelvet  = M({ color: 0x6e0c12, roughness: 0.94 });
      const mClay    = M({ color: 0x7a3a22, roughness: 0.6 });
      const mClayDk  = M({ color: 0x4a2216, roughness: 0.55 });
      const mPaper   = M({ color: 0xe9dcc0, roughness: 0.92 });
      const mWhiteW  = M({ color: 0xf2ead6, roughness: 0.55 });
      const mOrange  = M({ color: 0xe8862a, roughness: 0.55 });
      const mIron    = M({ color: 0x2c2a28, roughness: 0.6, metalness: 0.5 });
      const mCeilT   = M({ map: tTeak2, color: 0x8a6444, roughness: 0.8 });
      const mPorc    = tPorc.map(t => M({ map: t, roughness: 0.16 }));
      const mClockF  = M({ map: tClock, roughness: 0.5 });
      const mBulb    = new THREE.MeshBasicMaterial({ color: 0xffe0a0 }); mats.push(mBulb);
      const addMat = (map, color, op) => { const m = new THREE.MeshBasicMaterial({ map, color, transparent: true, opacity: op, depthWrite: false, blending: THREE.AdditiveBlending, fog: false, toneMapped: false }); mats.push(m); return m; };
      const glowPlane = (w, h, color, op, x, y, z, rx = 0, ry = 0, parent = G) => {
        const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), addMat(tGlow, color, op));
        m.position.set(x, y, z); m.rotation.set(rx, ry, 0); m.renderOrder = 3; m.userData.op = op; parent.add(m); tLive.glows.push(m); return m;
      };
      /* a plane whose texture repeats once per `per` metres (wall planes; a box would stretch it) */
      const tiled = (w, h, mat, per, x, y, z, ry = 0, rx = 0, parent = G) => {
        const geo = new THREE.PlaneGeometry(w, h), uv = geo.attributes.uv;
        for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * w / per, uv.getY(i) * h / per);
        const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.rotation.set(rx, ry, 0); m.receiveShadow = true; parent.add(m); return m;
      };
      /* a box whose texture repeats once per `per` metres on every face (BoxGeometry's faces: +x −x +y −y +z −z) */
      const boxT = (w, h, d, x, y, z, mat, per, parent = G) => {
        const geo = new THREE.BoxGeometry(w, h, d), uv = geo.attributes.uv;
        const span = [[d, h], [d, h], [w, d], [w, d], [w, h], [w, h]];
        for (let f = 0; f < 6; f++) for (let k = 0; k < 4; k++) { const i = f * 4 + k; uv.setXY(i, uv.getX(i) * span[f][0] / per, uv.getY(i) * span[f][1] / per); }
        const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.castShadow = !LOW; m.receiveShadow = true; parent.add(m); return m;
      };
      const lathe = (pts, mat, x, y, z, s = 1, seg = 18, parent = G) => {
        const m = new THREE.Mesh(new THREE.LatheGeometry(pts.map(([r, h]) => new THREE.Vector2(r * s, h * s)), seg), mat);
        m.position.set(x, y, z); m.castShadow = false; m.receiveShadow = true; parent.add(m); return m;
      };
      const blockerOnly = (w, h, d, x, y, z) => { const m = hidBox(w, h, d, x, y, z, G); walls.push(m); return m; };
      const solidOnly = (w, h, d, x, y, z) => { const m = hidBox(w, h, d, x, y, z, G); solids.push(m); return m; };

      /* ---- THE SHELL. Blockers first (hidden; collision reads them drawn or not), then what is seen. */
      blockerOnly(W + 0.4, H, 0.2, 0, H / 2, TSHOP.z0 - 0.1);                        // the back wall
      blockerOnly(0.2, H, D, TSHOP.x0 - 0.1, H / 2, cz);                              // the left wall
      blockerOnly(0.2, H, D, TSHOP.x1 + 0.1, H / 2, cz);                              // the right wall
      for (const s of [-1, 1]) {
        blockerOnly(1.1, H, 0.2, s * 3.55, H / 2, -0.1);                              // the neighbours' shutters either side
        blockerOnly(0.2, H, TWAY.z1, s * 4.1, H / 2, TWAY.z1 / 2);                    // the five-foot way, closed at both ends
      }
      blockerOnly(8.4, 1.4, 0.2, 0, 0.7, TWAY.z1 + 0.15);                            // the kerb: he does not walk into the road
      // the floor: old cement tiles, 0.2 m, one sheet to every 0.8 m
      { const f = floorAt(W, D, 0, cz, mTiles, G), uv = f.geometry.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * W / 0.8, uv.getY(i) * D / 0.8); }
      // the walls: lime plaster over a teak dado to 1.0 m, a rail, a skirting
      const DADO = 1.0;
      const wallRun = (len, cx, cz2, ry) => {
        tiled(len, H - DADO, mPlaster, 2.6, cx, DADO + (H - DADO) / 2, cz2, ry);
        tiled(len, DADO, mTeakDk, 1.2, cx, DADO / 2, cz2, ry);
        const rail = new THREE.Mesh(new THREE.BoxGeometry(len, 0.05, 0.035), mTeak); rail.position.set(cx, DADO, cz2); rail.rotation.y = ry; G.add(rail);
      };
      wallRun(W, 0, TSHOP.z0 + 0.001, 0);                                             // the back wall, facing +z
      wallRun(D, TSHOP.x0 + 0.001, cz, Math.PI / 2);                                  // the left, facing +x
      wallRun(D, TSHOP.x1 - 0.001, cz, -Math.PI / 2);                                 // the right, facing −x
      // the ceiling: the floor above on its joists, the boards dark with age
      { const c = ceilAt(W, D, 0, H, cz, mCeilT, G), uv = c.geometry.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * W / 1.6, uv.getY(i) * D / 1.6); }
      for (let z = TSHOP.z0 + 0.45; z < -0.3; z += 0.75) boxT(W, 0.16, 0.1, 0, H - 0.08, z, mTeakDk, 1.2);
      for (const x of [TSHOP.x0 + 0.06, TSHOP.x1 - 0.06]) boxT(0.12, 0.22, D, x, H - 0.11, cz, mTeakDk, 1.2);   // the wall plates

      /* ---- THE FRONT, folded open: two plaster piers, a header with a carved gilt fretwork panel over the opening (both
         faces), the old folding timber doors stacked back against the piers, and a granite sill across the threshold */
      const OW = W - TFRONT.pier * 2;                                                 // the opening's width
      for (const s of [-1, 1]) boxT(TFRONT.pier, H, 0.3, s * (W / 2 - TFRONT.pier / 2), H / 2, -0.05, mPlaster, 2.6);
      boxT(OW, H - TFRONT.head, 0.3, 0, (H + TFRONT.head) / 2, -0.05, mPlaster, 2.6);
      for (const [z, ry] of [[-0.205, Math.PI], [0.105, 0]]) {
        const fr = new THREE.Mesh(new THREE.PlaneGeometry(OW, 0.56), M({ map: tFret, roughness: 0.4, metalness: 0.2 }));
        // the inner face looks into the shop (−z), the outer one onto the five-foot way (+z)
        fr.position.set(0, TFRONT.head + 0.3, z); fr.rotation.y = ry; G.add(fr);
      }
      box(OW + 0.1, 0.04, 0.36, 0, TFRONT.head - 0.02, -0.05, mTeakDk, G, false);      // the header's timber lintel
      box(OW, 0.05, 0.34, 0, 0.025, -0.02, M({ color: 0x8a8682, roughness: 0.7 }), G, false);   // the granite sill
      // the folding doors: four leaves each side, folded in a zigzag against the inside of each pier
      { const leafMat = M({ map: tTeak, color: 0x5a3a26, roughness: 0.5 }), panelMat = M({ map: tTeak2, color: 0x8a5a38, roughness: 0.55 });
        for (const s of [-1, 1]) {
          const x0 = s * (OW / 2 - 0.03);
          for (let i = 0; i < 4; i++) {
            const g = new THREE.Group(); g.position.set(x0 - s * (i % 2 ? 0.16 : 0.0), 0, -0.22 - i * 0.07); g.rotation.y = s * (i % 2 ? -1.15 : 1.15); G.add(g);
            box(0.035, 2.66, 0.42, 0, 1.36, 0.0, leafMat, g, false);
            for (const py of [0.75, 1.95]) box(0.04, 0.8, 0.3, 0, py, 0.0, panelMat, g, false);
            box(0.045, 0.06, 0.05, 0, 1.36, -0.16, mBrass, g, false);
          }
        }
      }

      /* ---- THE FIVE-FOOT WAY: Peranakan tiles, its ceiling (the floor above), the street's own pillars stand at its edge */
      { const L = 8.2, f = new THREE.Mesh(new THREE.PlaneGeometry(L, TWAY.z1 - TWAY.z0), mFfw), uv = f.geometry.attributes.uv;
        for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * L / 0.4, uv.getY(i) * (TWAY.z1 - TWAY.z0) / 0.4);
        f.rotation.x = -Math.PI / 2; f.position.set(0, 0.003, (TWAY.z0 + TWAY.z1) / 2); f.receiveShadow = true; G.add(f); }
      { const c = new THREE.Mesh(new THREE.PlaneGeometry(W + 0.02, TWAY.z1 - TWAY.z0), M({ color: 0xd4cab8, roughness: 0.9, emissive: 0x4a4236 }));   // (the street's, buildStreetT)
        // (12 mm under the way's own line: the fascia over the shop's opening has its underside there, and the street's
        // ceilings either side 10 mm under it — v22.2, one plane each, so nothing flickers)
        c.rotation.x = Math.PI / 2; c.position.set(0, TFRONT.way - 0.012, (TWAY.z0 + TWAY.z1) / 2); G.add(c); }
      // the shop's signboard: on the fascia over the five-foot way, to the street — and a second over the counter, inside
      { const sg = new THREE.Mesh(new THREE.PlaneGeometry(4.4, 0.69), M({ map: tSign, roughness: 0.4, metalness: 0.15 }));
        sg.position.set(0, 3.7, TWAY.z1 + 0.012); G.add(sg);
        const si = new THREE.Mesh(new THREE.PlaneGeometry(2.3, 0.36), M({ map: tSign, roughness: 0.4, metalness: 0.15 }));
        si.position.set(TCLOCK.x, 3.26, TSHOP.z0 + 0.03); G.add(si);
        box(2.4, 0.42, 0.03, TCLOCK.x, 3.26, TSHOP.z0 + 0.012, mBlkLac, G, false); }
      // the afternoon on the floor inside the door (painted), the shade at the back (painted), dust turning in the sun
      tLive.sun = new THREE.Mesh(new THREE.PlaneGeometry(OW - 0.2, 2.6), new THREE.MeshBasicMaterial({ map: tSun, transparent: true, opacity: 0.32, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false, fog: false }));
      mats.push(tLive.sun.material); tLive.sun.rotation.x = -Math.PI / 2; tLive.sun.position.set(0.2, 0.006, -1.2); tLive.sun.renderOrder = 2; G.add(tLive.sun);
      tLive.shade = new THREE.Mesh(new THREE.PlaneGeometry(W - 0.02, D), new THREE.MeshBasicMaterial({ map: tShade, transparent: true, opacity: 0.85, depthWrite: false, toneMapped: false, fog: false }));
      mats.push(tLive.shade.material); tLive.shade.rotation.x = -Math.PI / 2; tLive.shade.rotation.z = Math.PI; tLive.shade.position.set(0, 0.005, cz); tLive.shade.renderOrder = 2; G.add(tLive.shade);
      { const n = LOW ? 70 : 140, geo = new THREE.BufferGeometry(), pos = new Float32Array(n * 3), r = rng(4171);
        for (let i = 0; i < n; i++) { pos[i * 3] = -2.2 + r() * 4.4; pos[i * 3 + 1] = 0.2 + r() * 2.5; pos[i * 3 + 2] = -3.2 + r() * 3.1; }
        geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        const pm = new THREE.PointsMaterial({ map: tGlow, color: 0xffe2b0, size: 0.03, transparent: true, opacity: 0.55, depthWrite: false, blending: THREE.AdditiveBlending, fog: false });
        mats.push(pm); tLive.motes = new THREE.Points(geo, pm); tLive.motes.frustumCulled = false; tLive.motes.userData.base = pos.slice(); G.add(tLive.motes); }

      /* ---- THE LEFT WALL: open teak shelves of antiques, three bays, five boards, and the calligraphy over them */
      const SH = { x0: TSHOP.x0, d: 0.4, h: 2.3, boards: [0.08, 0.5, 0.94, 1.38, 1.82, 2.26] };
      const bays = [[-0.75, -2.35], [-2.45, -4.05], [-4.15, -5.6]];
      const shelfX = SH.x0 + SH.d / 2;
      const r = rng(4173);
      bays.forEach(([za, zb]) => {
        const w = za - zb, zc = (za + zb) / 2;
        for (const y of SH.boards) boxT(SH.d, 0.035, w, shelfX, y, zc, mTeak, 1.0);
        for (const zz of [za, zb]) boxT(SH.d, SH.h, 0.04, shelfX, SH.h / 2, zz, mTeakDk, 1.0);
        solids.push(hidBox(SH.d, SH.h, w, shelfX, SH.h / 2, zc, G));
      });
      /* the antiques: porcelain on lathes (a ginger jar, a vase, a bowl on a stand), clay teapots, brass censers, a mantel
         clock, stacked old books — dealt along the boards from one seed so the wall is the same wall every time */
      const JAR = [[0, 0], [0.07, 0.01], [0.1, 0.05], [0.11, 0.12], [0.1, 0.18], [0.07, 0.21], [0.055, 0.215], [0.06, 0.24], [0.0, 0.245]];
      const VASE = [[0, 0], [0.05, 0.0], [0.06, 0.03], [0.09, 0.12], [0.085, 0.2], [0.045, 0.27], [0.035, 0.34], [0.05, 0.38], [0.0, 0.38]];
      const BOWL = [[0, 0], [0.05, 0], [0.05, 0.015], [0.1, 0.05], [0.12, 0.09], [0.11, 0.09], [0.09, 0.055], [0.0, 0.05]];
      const CENSER = [[0, 0], [0.05, 0.03], [0.08, 0.06], [0.085, 0.1], [0.07, 0.12], [0.04, 0.125], [0.0, 0.125]];
      const POT = [[0, 0], [0.05, 0], [0.065, 0.03], [0.07, 0.06], [0.06, 0.085], [0.03, 0.095], [0.02, 0.105], [0.0, 0.105]];
      const mBooks = [0x5a2a1a, 0x2a3a4a, 0x6a5a3a, 0x3a2a2a].map(c => M({ color: c, roughness: 0.85 }));
      const place = (y, zc, w, fn) => { let z = zc - w / 2 + 0.12; while (z < zc + w / 2 - 0.12) { const used = fn(z, y); z += used + 0.06 + r() * 0.08; } };
      const AG = new THREE.Group(); G.add(AG);                                    // merged by material once built
      bays.forEach(([za, zb]) => {
        const w = za - zb, zc = (za + zb) / 2;
        SH.boards.slice(0, 5).forEach((y0, bi) => {
          const y = y0 + 0.018;
          place(y, zc, w, (z) => {
            const k = r(), x = shelfX + (r() - 0.5) * 0.08;
            if (k < 0.24) { lathe(JAR, mPorc[(r() * 3) | 0], x, y, z, 0.9 + r() * 0.5, 18, AG); return 0.24; }
            if (k < 0.40) { lathe(VASE, mPorc[(r() * 3) | 0], x, y, z, 0.8 + r() * 0.5, 18, AG); return 0.18; }
            if (k < 0.52) { box(0.12, 0.03, 0.12, x, y + 0.015, z, mBlkLac, AG, false); lathe(BOWL, mPorc[(r() * 3) | 0], x, y + 0.03, z, 1.0, 18, AG); return 0.24; }
            if (k < 0.68) { const pm = r() < 0.5 ? mClay : mClayDk; lathe(POT, pm, x, y, z, 1.0 + r() * 0.4, 18, AG);
                            const sp = cyl(0.008, 0.012, 0.07, x - 0.08, y + 0.06, z, pm, 6, AG); sp.rotation.z = 0.9;
                            box(0.02, 0.025, 0.07, x + 0.075, y + 0.06, z, pm, AG, false); return 0.2; }
            if (k < 0.80) { lathe(CENSER, mBrass, x, y + 0.03, z, 1.0 + r() * 0.3, 18, AG);
                            for (let l = 0; l < 3; l++) { const a = l * 2.094; cyl(0.008, 0.006, 0.035, x + Math.cos(a) * 0.05, y + 0.017, z + Math.sin(a) * 0.05, mBrass, 5, AG); } return 0.2; }
            if (k < 0.90 && bi > 0) {                                                  // a mantel clock, stopped long ago
              boxT(0.14, 0.2, 0.22, x, y + 0.1, z, mTeakDk, 0.5, AG);
              const f = new THREE.Mesh(new THREE.CircleGeometry(0.065, 20), mClockF); f.position.set(x + 0.071, y + 0.12, z); f.rotation.y = Math.PI / 2; AG.add(f);
              return 0.26;
            }
            for (let b = 0, n = 2 + ((r() * 3) | 0); b < n; b++)                       // a stack of old books
              box(0.2 - r() * 0.04, 0.035, 0.15, x, y + 0.018 + b * 0.036, z, mBooks[(r() * 4) | 0], AG, false);
            return 0.18;
          });
        });
      });
      // the calligraphy over the shelves, and a big floor jar of rolled scrolls by the door
      tScrolls.forEach((t, i) => {
        const s = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 1.2), M({ map: t, roughness: 0.9 })); s.position.set(TSHOP.x0 + 0.012, 2.95, -1.3 - i * 1.25); s.rotation.y = Math.PI / 2; G.add(s);
        cyl(0.01, 0.01, 0.38, TSHOP.x0 + 0.02, 2.33, -1.3 - i * 1.25, mTeakDk, 6, G).rotation.x = Math.PI / 2;
      });
      { const j = lathe([[0, 0], [0.16, 0.0], [0.2, 0.08], [0.24, 0.3], [0.22, 0.52], [0.15, 0.62], [0.13, 0.66], [0.15, 0.7], [0.0, 0.7]], mPorc[0], -2.45, 0, -0.45, 1.0, 22);
        for (let k = 0; k < 6; k++) { const a = k * 1.05; const sc = cyl(0.022, 0.022, 0.5, -2.45 + Math.cos(a) * 0.06, 0.82, -0.45 + Math.sin(a) * 0.06, mPaper, 8, G); sc.rotation.set(Math.sin(a) * 0.14, 0, Math.cos(a) * 0.14); }
        solids.push(hidBox(0.5, 0.8, 0.5, -2.45, 0.4, -0.45, G)); void j; }

      /* ---- THE RIGHT WALL: two of CHAD'S amulet shelves, backs to the wall, and between the stair and them a teak cabinet
         of framed amulets behind glass (Chad's trays standing up in it) — the drawn stand-ins stand until each lands */
      const RX = TSHOP.x1;
      for (const z of [-1.55, -3.0]) {
        const standIn = boxT(0.32, 1.9, 1.08, RX - 0.17, 0.95, z, mTeakDk, 1.0); standIn.visible = false;   // invisible from its first frame (v21.16)
        solids.push(hidBox(0.34, 1.9, 1.1, RX - 0.17, 0.95, z, G));
        H_SHELF(RX - 0.172, z, -Math.PI / 2, standIn, G);
      }
      { const cw = 1.1, cd = 0.42, ch = 2.1, zc = -4.5, xc = RX - cd / 2;
        boxT(cd, 0.62, cw, xc, 0.31, zc, mTeakDk, 1.0);                               // the cupboard under it
        boxT(cd, 0.05, cw + 0.04, xc, ch + 0.025, zc, mTeak, 1.0);                     // its top
        for (const zz of [zc - cw / 2, zc + cw / 2]) boxT(cd, ch - 0.62, 0.04, xc, (ch + 0.62) / 2, zz, mTeak, 1.0);
        box(0.02, ch - 0.62, cw, RX - 0.01, (ch + 0.62) / 2, zc, mVelvet, G, false);      // its back: red velvet
        for (const y of [1.1, 1.58]) box(cd - 0.04, 0.012, cw - 0.06, xc, y, zc, mGlass, G, false);
        const gf = new THREE.Mesh(new THREE.PlaneGeometry(cw - 0.04, ch - 0.66), mGlass); gf.rotation.y = -Math.PI / 2; gf.position.set(RX - cd - 0.002, (ch + 0.62) / 2, zc); gf.renderOrder = 2; G.add(gf);
        box(0.03, ch - 0.62, 0.03, RX - cd, (ch + 0.62) / 2, zc, mTeak, G, false);
        // Chad's framed trays, standing up on the shelves inside, their faces to the shop (−x)
        const S = 0.2, list = [], e = new THREE.Euler(0, -Math.PI / 2, 0, 'YXZ');
        for (const [y0, n] of [[0.64, 2], [1.12, 2], [1.6, 2]]) for (let i = 0; i < n; i++) list.push([xc + 0.02, y0 + 1.0973 * S / 2, zc + (i - 0.5) * 0.46, e, S]);
        H_TRAYS(list, [], G);
        solids.push(hidBox(cd, ch, cw, xc, ch / 2, zc, G));
        const strip = box(0.02, 0.012, cw - 0.1, RX - cd + 0.06, ch - 0.03, zc, new THREE.MeshBasicMaterial({ color: 0xffd6a0 }), G, false); mats.push(strip.material);
        glowPlane(cw * 1.2, 1.4, 0xffa860, 0.08, RX - 0.03, 1.35, zc, 0, -Math.PI / 2);
      }

      /* ---- THE COUNTER: teak, its glass top over red velvet and Chad's trays (the shop's best), a clay tea set, a brass
         bell, a ledger and an abacus; two stools on the customer's side (his and one more) */
      const CW = TCNT.x1 - TCNT.x0, CX = (TCNT.x0 + TCNT.x1) / 2, CZf = TCNT.z + TCNT.d / 2;
      /* (the first build laid the frame as one solid slab, so the velvet and Chad's trays under the glass were inside it
         and never seen, and the glass's top sat 18 mm under TCNT.top, where every cup stood in the air: the case's top is
         a frame of four rails round a velvet bed now, the trays lie on the bed, and the glass is let into the rails with
         its top at TCNT.top) */
      const RIM = 0.05, CAS = 0.07;                                                   // the rails' width; the case's depth under the glass
      boxT(CW, TCNT.top - CAS, TCNT.d, CX, (TCNT.top - CAS) / 2, TCNT.z, mTeakDk, 1.2);
      box(CW - 0.02, 0.01, TCNT.d - 0.02, CX, TCNT.top - CAS + 0.005, TCNT.z, mVelvet, G, false);      // the velvet bed
      for (const s of [-1, 1]) {
        box(CW + 0.06, CAS, RIM, CX, TCNT.top - CAS / 2, TCNT.z + s * (TCNT.d / 2 + 0.03 - RIM / 2), mTeak, G, false);   // the long rails
        box(RIM, CAS, TCNT.d + 0.06 - 2 * RIM, CX + s * (CW / 2 + 0.03 - RIM / 2), TCNT.top - CAS / 2, TCNT.z, mTeak, G, false);   // the ends
      }
      box(CW + 0.06 - 2 * RIM, 0.008, TCNT.d + 0.06 - 2 * RIM, CX, TCNT.top - 0.004, TCNT.z, mGlass, G, false);   // the glass, let in
      solids.push(hidBox(CW, TCNT.top, TCNT.d, CX, TCNT.top / 2, TCNT.z, G));
      for (let i = 0; i < 6; i++) box(0.02, TCNT.top - 0.12, 0.02, TCNT.x0 + 0.3 + i * (CW - 0.6) / 5, (TCNT.top - 0.12) / 2 + 0.03, CZf + 0.002, mTeak, G, false);   // the face's mouldings
      { const S = 0.16, list = [], e = new THREE.Euler(-Math.PI / 2, Math.PI, 0, 'YXZ'), n = Math.floor((CW - 0.2) / (1.9036 * S + 0.02));
        for (let i = 0; i < n; i++) for (const a of [-1, 1]) {
          const x = CX + (i - (n - 1) / 2) * (1.9036 * S + 0.02);
          if (Math.abs(x - TTRAY.x) < 0.3) continue;                                   // not under his own tray
          list.push([x, TCNT.top - CAS + 0.01 + 0.0973 * S / 2, TCNT.z + a * (1.0973 * S / 2 + 0.01), e, S]);   // lying on the velvet bed
        }
        if (list.length % 2) list.pop();
        H_TRAYS(list, [], G); }
      // the tea set on the counter's left, the bell and the ledger on its right
      thai('teaset', CX - 1.05, TCNT.top, TCNT.z - 0.05, { s: 0.55, parent: G, cast: false, ry: 0.4 });
      box(0.3, 0.025, 0.22, CX + 1.05, TCNT.top + 0.012, TCNT.z - 0.04, mPaper, G, false);
      box(0.3, 0.03, 0.22, CX + 1.05, TCNT.top + 0.04, TCNT.z - 0.04, M({ color: 0x5a1a12, roughness: 0.8 }), G, false);
      { const ab = new THREE.Group(); ab.position.set(CX + 0.62, TCNT.top + 0.012, TCNT.z - 0.1); ab.rotation.y = 0.2; G.add(ab);
        box(0.32, 0.02, 0.13, 0, 0, 0, mTeakDk, ab, false);
        for (let i = 0; i < 9; i++) for (let k = 0; k < 6; k++) { const b = new THREE.Mesh(new THREE.SphereGeometry(0.009, 6, 4), mBlkLac); b.position.set(-0.13 + i * 0.033, 0.012, -0.05 + k * 0.02 + (k > 0 ? 0.015 : 0)); b.scale.y = 0.6; ab.add(b); } }
      { const bl = lathe([[0, 0], [0.035, 0.0], [0.03, 0.02], [0.02, 0.04], [0.008, 0.05], [0.0, 0.052]], mBrass, CX + 1.42, TCNT.top, TCNT.z + 0.05, 1.0); void bl; }
      // the two cups of tea at his place (CP8b pours them), one before him, one before the owner
      tLive.cups = [[TTRAY.x - 0.36, CZf - 0.1], [TTRAY.x - 0.25, TCNT.z - 0.18]].map(([x, z]) => {
        const c = lathe([[0, 0], [0.024, 0], [0.028, 0.006], [0.033, 0.04], [0.031, 0.04], [0.026, 0.008], [0.0, 0.006]], mWhiteW, x, TCNT.top, z, 1.0);
        const t = new THREE.Mesh(new THREE.CircleGeometry(0.029, 16), M({ color: 0x8a5a1e, roughness: 0.15 })); t.rotation.x = -Math.PI / 2; t.position.set(x, TCNT.top + 0.032, z); t.visible = false; G.add(t);
        return { cup: c, tea: t };
      });
      // his stool and the other, round teak seats on four legs
      for (const x of [TSTOOL.x - TX, TSTOOL.x - TX - 1.1]) {
        const sg = new THREE.Group(); sg.position.set(x, 0, TSTOOL.z); G.add(sg);
        if (x === TSTOOL.x - TX) tLive.stool = sg;                                   // (an ending knocks it over)
        cyl(0.17, 0.17, 0.04, 0, TSEAT.y - 0.02, 0, mTeak, 18, sg);
        for (let l = 0; l < 4; l++) { const a = l * Math.PI / 2 + Math.PI / 4, lg = cyl(0.018, 0.022, TSEAT.y - 0.04, Math.cos(a) * 0.12, (TSEAT.y - 0.04) / 2, Math.sin(a) * 0.12, mTeakDk, 6, sg); lg.rotation.set(Math.sin(a) * 0.08, 0, -Math.cos(a) * 0.08); }
        for (let l = 0; l < 4; l++) { const a = l * Math.PI / 2 + Math.PI / 4, rg = box(0.012, 0.012, 0.2, Math.cos(a) * 0.1, 0.22, Math.sin(a) * 0.1, mTeakDk, sg, false); rg.rotation.y = -a; }
        if (x !== TSTOOL.x - TX) solids.push(hidBox(0.36, 0.7, 0.36, x, 0.35, TSTOOL.z, G));
      }

      /* ---- THE BACK: the pendulum clock over the owner, the Buddha's altar in the left corner, the stair up on the right,
         a calendar, stock in paper on a rack */
      { const C = new THREE.Group(); C.position.set(TCLOCK.x, TCLOCK.y, TCLOCK.z); G.add(C);
        boxT(0.42, 0.98, 0.16, 0, 0, 0.0, mTeakDk, 0.6, C);                             // the case
        box(0.46, 0.06, 0.2, 0, 0.52, 0.0, mTeak, C, false); box(0.46, 0.06, 0.2, 0, -0.52, 0.0, mTeak, C, false);
        const face = new THREE.Mesh(new THREE.CircleGeometry(0.16, 32), M({ map: tClock, roughness: 0.45 })); face.position.set(0, 0.24, 0.082); C.add(face);
        const hands = new THREE.Group(); hands.position.set(0, 0.24, 0.086); C.add(hands);
        const hh = box(0.012, 0.08, 0.004, 0, 0.035, 0, mBlkLac, hands, false), mh = box(0.008, 0.12, 0.004, 0, 0.055, 0.002, mBlkLac, hands, false);
        hh.parent.remove(hh); mh.parent.remove(mh);
        const hG = new THREE.Group(), mG = new THREE.Group(); hands.add(hG); hands.add(mG); hG.add(hh); mG.add(mh);
        hG.rotation.z = -(4 + 25 / 60) / 12 * Math.PI * 2; mG.rotation.z = -25 / 60 * Math.PI * 2;   // twenty-five past four, an afternoon
        const glassDoor = new THREE.Mesh(new THREE.PlaneGeometry(0.34, 0.5), mGlass); glassDoor.position.set(0, -0.18, 0.083); glassDoor.renderOrder = 2; C.add(glassDoor);
        box(0.36, 0.5, 0.004, 0, -0.18, 0.02, mRedLac, C, false);                       // the case's back, red
        const pend = new THREE.Group(); pend.position.set(0, 0.06, 0.05); C.add(pend);
        box(0.008, 0.36, 0.004, 0, -0.18, 0, mBrass, pend, false);
        const bob = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.01, 22), mBrass); bob.rotation.x = Math.PI / 2; bob.position.y = -0.38; pend.add(bob);
        tLive.pend = pend; tLive.clockHands = { hG, mG }; }
      { const al = new THREE.Group(); al.position.set(TALTAR.x, 0, TALTAR.z); G.add(al);
        boxT(TALTAR.w, TALTAR.h, TALTAR.d, 0, TALTAR.h / 2, 0, mRedLac, 0.8, al);
        box(TALTAR.w + 0.06, 0.04, TALTAR.d + 0.06, 0, TALTAR.h + 0.02, 0, mGilt, al, false);
        box(0.5, 0.18, 0.3, 0, TALTAR.h + 0.13, -0.05, mRedLac, al, false);            // the step the image sits on
        box(0.54, 0.02, 0.34, 0, TALTAR.h + 0.23, -0.05, mGilt, al, false);
        const back = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 1.2), M({ map: tAltarB, roughness: 0.8 })); back.position.set(0, TALTAR.h + 0.75, -TALTAR.d / 2 + 0.01); al.add(back);
        thai('buddha', 0, TALTAR.h + 0.24, -0.05, { s: 0.9, parent: al, cast: false });
        for (const sx of [-1, 1]) {
          thai('candle', sx * 0.38, TALTAR.h + 0.04, 0.08, { s: 0.45, parent: al, cast: false });
          const fl = new THREE.Mesh(new THREE.PlaneGeometry(0.03, 0.06), new THREE.MeshBasicMaterial({ map: tFlame, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false, fog: false }));
          mats.push(fl.material); fl.position.set(sx * 0.38, TALTAR.h + 0.2, 0.08); fl.userData.base = fl.position.clone(); al.add(fl); tLive.bulbs.push(fl);
          thai('orchid', sx * 0.55, TALTAR.h + 0.04, -0.08, { s: 0.36, parent: al, cast: false });
        }
        thai('incense', 0, TALTAR.h + 0.04, 0.12, { s: 0.42, parent: al, cast: false });
        // a plate of oranges, five, for the afternoon
        const plate = lathe([[0, 0], [0.09, 0], [0.11, 0.015], [0.0, 0.012]], mPorc[1], -0.22, TALTAR.h + 0.04, 0.1, 1.0, 18, al);
        for (const [ox, oz, oy] of [[0, 0, 0.04], [0.045, 0.02, 0.04], [-0.04, 0.025, 0.04], [0.01, -0.04, 0.04], [0.005, 0.0, 0.085]]) {
          const o = new THREE.Mesh(new THREE.SphereGeometry(0.038, 12, 8), mOrange); o.position.set(-0.22 + ox, TALTAR.h + 0.04 + oy, 0.1 + oz); al.add(o); }
        void plate;
        // a red bulb over it in a small brass lamp, its glow painted on the wall
        const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.035, 10, 8), new THREE.MeshBasicMaterial({ color: 0xff5a3c })); mats.push(lamp.material);
        lamp.position.set(0, TALTAR.h + 1.45, -TALTAR.d / 2 + 0.08); al.add(lamp);
        glowPlane(1.1, 1.1, 0xff4a2a, 0.22, TALTAR.x, TALTAR.h + 1.2, TALTAR.z - TALTAR.d / 2 + 0.03);
        // the incense smoke: three wisps rising off the pot
        for (let i = 0; i < 3; i++) {
          const sm = new THREE.Mesh(new THREE.PlaneGeometry(0.16, 0.5), new THREE.MeshBasicMaterial({ map: tSmoke, transparent: true, opacity: 0, depthWrite: false, color: 0xd8d0c4, fog: false }));
          mats.push(sm.material); sm.position.set(TALTAR.x + (i - 1) * 0.02, TALTAR.h + 0.3, TALTAR.z + 0.12); sm.userData.ph = i / 3; G.add(sm); tLive.smoke.push(sm);
        }
        solids.push(hidBox(TALTAR.w, 1.2, TALTAR.d, TALTAR.x, 0.6, TALTAR.z, G)); }
      { const st = new THREE.Group(); G.add(st);
        const n = TSTAIR.n, run = (TSTAIR.zFoot - TSTAIR.zTop) / n, rise = H / n, w = TSTAIR.x1 - TSTAIR.x0, xc = (TSTAIR.x0 + TSTAIR.x1) / 2;
        for (let i = 0; i < n; i++) {
          const z = TSTAIR.zFoot - (i + 0.5) * run, y = (i + 1) * rise;
          boxT(w, 0.04, run + 0.04, xc, y - 0.02, z, mTeak, 0.9, st);                      // the tread
          boxT(w, rise - 0.04, 0.025, xc, y - rise / 2 - 0.02, z + run / 2, mTeakDk, 0.9, st);   // the riser
        }
        // its stringer on the open side, the banister and its balusters
        const len = Math.hypot(H, TSTAIR.zFoot - TSTAIR.zTop), ang = Math.atan2(H, TSTAIR.zFoot - TSTAIR.zTop);
        const sgr = boxT(0.05, 0.28, len, TSTAIR.x0 - 0.02, H / 2 - 0.1, (TSTAIR.zFoot + TSTAIR.zTop) / 2, mTeakDk, 0.9, st); sgr.rotation.x = ang;
        const rail = boxT(0.05, 0.06, len, TSTAIR.x0 - 0.02, H / 2 + 0.85, (TSTAIR.zFoot + TSTAIR.zTop) / 2, mTeak, 0.9, st); rail.rotation.x = ang;
        for (let i = 1; i < n; i += 1) { const z = TSTAIR.zFoot - (i + 0.5) * run, y = (i + 1) * rise; cyl(0.015, 0.015, 0.86, TSTAIR.x0 - 0.02, y + 0.43, z, mTeakDk, 6, st); }
        cyl(0.04, 0.04, 1.1, TSTAIR.x0 - 0.02, 0.55, TSTAIR.zFoot, mTeak, 8, st);         // the newel
        solids.push(hidBox(w + 0.05, 1.4, TSTAIR.zFoot - TSTAIR.zTop, xc, 0.7, (TSTAIR.zFoot + TSTAIR.zTop) / 2, G));
        // the dark opening it climbs into
        const hole = new THREE.Mesh(new THREE.PlaneGeometry(w, 1.6), M({ color: 0x0c0806, roughness: 1 })); hole.rotation.x = Math.PI / 2; hole.position.set(xc, H - 0.002, TSTAIR.zTop + 0.8); G.add(hole); }
      { const cal = new THREE.Mesh(new THREE.PlaneGeometry(0.34, 0.51), M({ map: tCal, roughness: 0.85 })); cal.position.set(-0.7, 1.75, TSHOP.z0 + 0.012); G.add(cal); }
      // the owner's side of the counter: a low cabinet of stock in paper packets and a stool he never sits on
      boxT(1.6, 0.9, 0.4, -0.15, 0.45, TSHOP.z0 + 0.22, mTeakDk, 1.0);
      for (let i = 0; i < 9; i++) box(0.14, 0.05 + r() * 0.06, 0.1, -0.85 + i * 0.17, 0.93 + r() * 0.02, TSHOP.z0 + 0.22, [mPaper, mVelvet, mRedLac][i % 3], G, false);
      solids.push(hidBox(1.6, 0.9, 0.4, -0.15, 0.45, TSHOP.z0 + 0.22, G));

      /* ---- THE FANS and THE LAMPS: two ceiling fans turning slowly (the kit's own), three green enamel pendants on their
         cords over the counter and one in the middle of the shop, their bulbs lit and their pools painted */
      for (const [x, z] of [[0, -2.6], [0.55, -7.1]]) {
        const pivot = new THREE.Group(); pivot.position.set(x, H - 0.67, z); G.add(pivot);
        thai('ceilfan', 0, 0, 0, { s: 0.55, parent: pivot, cast: false });
        tLive.fans.push(pivot);
      }
      for (const [x, z, y] of [[-0.45, -6.0, 2.42], [0.55, -6.0, 2.42], [1.55, -6.0, 2.42], [0.0, -3.4, 2.6]]) {
        const cord = cyl(0.004, 0.004, H - y, 0, -(H - y) / 2, 0, mIron, 4);              // hung from a pivot at the ceiling, so it can swing
        cord.parent.remove(cord);
        const pv = new THREE.Group(); pv.position.set(x, H, z); G.add(pv); pv.add(cord);
        const shade = new THREE.Mesh(new THREE.ConeGeometry(0.17, 0.12, 20, 1, true), mEnamel); shade.position.y = -(H - y) - 0.02; pv.add(shade);
        const inner = new THREE.Mesh(new THREE.ConeGeometry(0.168, 0.118, 20, 1, true), mEnamelIn); inner.position.copy(shade.position); pv.add(inner);
        const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.035, 10, 8), mBulb); bulb.position.y = -(H - y) - 0.06; pv.add(bulb);
        const pool = glowPlane(z > -5 ? 2.2 : 1.1, z > -5 ? 2.2 : 1.1, 0xffc070, z > -5 ? 0.1 : 0.16, x, z > -5 ? 0.012 : TCNT.top + 0.004, z > -5 ? z : TCNT.z, -Math.PI / 2);
        tLive.lamps.push({ pv, bulb, pool, ph: x * 1.7 + z });
      }

      /* ---- THE STREET OUTSIDE (chapter 3's lorong, by day): the row across the road, our own row either side of the
         shop, the five-foot ways, the road and its kerbs, the planting strip and its trees, the cars at the kerb, the
         blocks over the roofs. chapter 3's batch builder as it was (every piece posed in its UNIT's own frame: x across
         it, y up, z into the building, the street at −z; the far row as it is, ours turned round), its paint lit by
         THIS afternoon (a standard material on the vertex colour) where chapter 3's was lit by painted street lamps */
      function buildStreetT() {
        const rS = rng(4108);
        const SG = new THREE.Group(); G.add(SG);
        const dayMat = (map, o = {}) => { const m = new THREE.MeshStandardMaterial({ vertexColors: true, map: map || null, roughness: 0.92, metalness: 0, ...o }); mats.push(m); return m; };
        const unlitMat = (map, o = {}) => { const m = new THREE.MeshBasicMaterial({ vertexColors: true, map: map || null, ...o }); mats.push(m); return m; };
        const FR = new THREE.Matrix4(), _M = new THREE.Matrix4(), _L = new THREE.Matrix4(), _NM = new THREE.Matrix3(),
              _Q = new THREE.Quaternion(), _E = new THREE.Euler(0, 0, 0, 'YXZ'), _V = new THREE.Vector3(), _S1 = new THREE.Vector3(1, 1, 1), _c = new THREE.Color();
        const setFrame = (xc, zf, flip) => { FR.makeRotationY(flip ? Math.PI : 0).setPosition(xc, 0, zf); };
        const ident = () => FR.identity();
        function batch() {
          const P = [], N = [], C = [], U = [], I = [];
          const B = {
            add(geo, x, y, z, col, o = {}) {
              _E.set(o.rx || 0, o.ry || 0, 0, 'YXZ'); _Q.setFromEuler(_E);
              _L.compose(_V.set(x, y, z), _Q, _S1); _M.multiplyMatrices(FR, _L); _NM.getNormalMatrix(_M);
              _c.set(col); const k = o.k || 1;
              const pa = geo.attributes.position, na = geo.attributes.normal, ua = geo.attributes.uv, base = P.length / 3, ws = o.ws || 1;
              for (let i = 0; i < pa.count; i++) {
                _V.fromBufferAttribute(pa, i).applyMatrix4(_M); const px = _V.x, py = _V.y, pz = _V.z; P.push(px, py, pz);
                _V.fromBufferAttribute(na, i).applyMatrix3(_NM).normalize(); N.push(_V.x, _V.y, _V.z);
                C.push(_c.r * k, _c.g * k, _c.b * k);
                if (o.cell) { const q = o.cell; U.push(q[0] + ua.getX(i) * (q[2] - q[0]), q[1] + ua.getY(i) * (q[3] - q[1])); }
                else if (o.uv) U.push(ua.getX(i) * o.uv[0], ua.getY(i) * o.uv[1]);
                else {
                  const ax = Math.abs(_V.x), ay = Math.abs(_V.y), az = Math.abs(_V.z);
                  if (ay >= ax && ay >= az) U.push(px / ws, pz / ws); else if (ax >= az) U.push(pz / ws, py / ws); else U.push(px / ws, py / ws);
                }
              }
              if (geo.index) for (let i = 0; i < geo.index.count; i++) I.push(base + geo.index.getX(i));
              else for (let i = 0; i < pa.count; i++) I.push(base + i);
              geo.dispose();
              return B;
            },
            box(w, h, d, x, y, z, col, o) { return B.add(new THREE.BoxGeometry(w, h, d), x, y, z, col, o); },
            quad(w, h, x, y, z, col, o) { return B.add(new THREE.PlaneGeometry(w, h), x, y, z, col, o); },
            build(mat) {
              if (!I.length) return null;
              const g = new THREE.BufferGeometry();
              g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3));
              g.setAttribute('normal', new THREE.Float32BufferAttribute(N, 3));
              g.setAttribute('color', new THREE.Float32BufferAttribute(C, 3));
              g.setAttribute('uv', new THREE.Float32BufferAttribute(U, 2));
              g.setIndex(P.length / 3 > 65535 ? new THREE.Uint32BufferAttribute(I, 1) : new THREE.Uint16BufferAttribute(I, 1));
              g.computeBoundingSphere();
              const m = new THREE.Mesh(g, mat); m.castShadow = false; m.receiveShadow = true;
              SG.add(m); return m;
            },
          };
          return B;
        }
        const winTex = tex(makeStreetWindows(THREE, cnv)), signTex = tex(makeStreetSigns(THREE, cnv)), fanTex = tex(makeFanlight(THREE, cnv)),
              baluTex = tex(makeBalustrade(THREE, cnv)), acTex = tex(makeAcFront(THREE, cnv)), bladeTex = tex(makeBladeSigns(THREE, cnv)),
              roofTex = tex(makePanTiles(THREE, cnv)), vergeTex = tex(makeVerge(THREE, cnv)), hdbTex = tex(makeHdbDay(THREE, cnv)),
              shutTex = tex(makeShutter(THREE, cnv)), ffwTex = tex(makePeranakanTiles(THREE, cnv));
        const bPl = batch(), bWin = batch(), bSign = batch(), bFan = batch(), bBalu = batch(), bAC = batch(), bBlade = batch(),
              bRoof = batch(), bFloor = batch(), bVerge = batch(), bShut = batch(), bIn = batch(), bHdb = batch(), bRoad = batch(), bCeil = batch();
        const WCELL = (i) => [i / 8 + 0.002, 0.004, (i + 1) / 8 - 0.002, 0.996];
        const SCELL = (i) => { const cc = i % 2, rr = Math.floor(i / 2); return [cc * 0.5 + 0.003, 1 - (rr + 1) * 80 / 1024 + 0.002, (cc + 1) * 0.5 - 0.003, 1 - rr * 80 / 1024 - 0.002]; };
        const BCELL = (i) => [i * 0.5 + 0.004, 0.004, (i + 1) * 0.5 - 0.004, 0.996];
        // by day: shutters shut or open, glass, a grille, curtains — never a lit room (chapter 3's night cells 1-3)
        const WIN = { shut: 0, glass: 4, open: 5, curtain: 6, grille: 7 };
        const PAL = [0xa6d4c0, 0xe8b6ba, 0xefd89a, 0xa8c6e4, 0xece0c6, 0xefc4a0, 0xc8b8da, 0x9ccec8, 0xe6e4dc, 0xd4e0a6, 0xf2d0c4, 0xb8dcd8];
        const TRIMS = [0xf6f2e8, 0xfaf7ee, 0xe8dfcc];
        const LOUV = [0x3e6c4c, 0x5c3c28, 0x34526c, 0x7c2c24, 0x4c5c3c, 0x2c5a5a];
        const CLOTH = [0xc8302a, 0x2a5aa8, 0xf0ece0, 0xe8c040, 0x4a8a5a, 0xd87aa0, 0x5a4a8a];
        const pick = (a) => a[(rS() * a.length) | 0];
        let lastSign = -1;
        const dealSign = () => { let s; do { s = 2 + ((rS() * 14) | 0); } while (s === lastSign); lastSign = s; return s; };

        let nRoof = 0;
        function shophouse(x0, x1, far, kind) {
          const w = x1 - x0, xc = (x0 + x1) / 2;
          const Gw = far ? 3.9 : 3.4, F = far ? 2.0 : 2.2, fy = far ? 0.15 : 0;
          setFrame(xc, far ? 16.0 : 2.2, !far);
          const shop = kind === 'kopi' || kind === 'mart', upper = kind === 'upper';
          const roll = rS();
          const nUp = shop || upper ? 2 : roll < 0.16 ? 1 : roll < 0.82 ? 2 : 3;
          const sr = rS(), style = upper ? 'early' : sr < 0.36 ? 'early' : sr < 0.6 ? 'deco' : 'late';
          const wallC = upper ? 0xe9d8b4 : pick(PAL), trim = pick(TRIMS), louv = upper ? 0x3e6c4c : pick(LOUV);
          const Y1 = Gw + 0.6, FH = 3.2, T = Y1 + nUp * FH;
          bPl.box(w - 0.01, T - Y1, 8.6, 0, (Y1 + T) / 2, 0.25 + 4.3, wallC, { k: 0.8 });
          const nw = w > 5.5 ? 3 : 2, A = w - 0.6, slot = A / nw, ww = Math.min(1.05, slot - 0.55);
          for (let f = 0; f < nUp; f++) {
            const y0 = Y1 + f * FH, y1 = y0 + FH, french = style === 'late' && f === 0;
            const wh = style === 'deco' ? 1.75 : 2.05, sill = y0 + (french ? 0.12 : 0.62), top = sill + wh;
            bPl.box(w, sill - y0, 0.25, 0, (y0 + sill) / 2, 0.125, wallC);
            bPl.box(w, y1 - top, 0.25, 0, (top + y1) / 2, 0.125, wallC);
            let xl = -w / 2;
            for (let i = 0; i <= nw; i++) {
              const xr = i < nw ? -A / 2 + slot * (i + 0.5) - ww / 2 : w / 2;
              bPl.box(xr - xl, wh, 0.25, (xl + xr) / 2, sill + wh / 2, 0.125, wallC);
              xl = xr + ww;
            }
            if (f > 0) bPl.box(w, 0.2, 0.14, 0, y0, -0.07, trim);
            for (let i = 0; i < nw; i++) {
              const cx = -A / 2 + slot * (i + 0.5), r0 = rS();
              const st = upper ? WIN.shut : r0 < 0.46 ? WIN.shut : r0 < 0.64 ? WIN.glass : r0 < 0.74 ? WIN.grille : r0 < 0.88 ? WIN.curtain : WIN.open;
              bWin.quad(ww, wh, cx, sill + wh / 2, 0.2, st === WIN.shut ? louv : 0xffffff, { ry: Math.PI, cell: WCELL(st) });
              bPl.box(ww + 0.2, 0.07, 0.18, cx, sill - 0.035, -0.07, trim);
              if (style === 'deco') bPl.box(ww + 0.36, 0.06, 0.34, cx, top + 0.1, -0.15, trim);
              else if (style === 'early') bPl.box(ww + 0.26, 0.12, 0.1, cx, top + 0.15, -0.05, trim);
              else {
                const fr = Math.min(ww / 2, y1 - top - 0.14);
                bPl.add(new THREE.CircleGeometry(fr + 0.07, 14, 0, Math.PI), cx, top + 0.02, -0.004, trim, { ry: Math.PI });
                bFan.add(new THREE.CircleGeometry(fr, 14, 0, Math.PI), cx, top + 0.02, -0.008, 0xffffff, { ry: Math.PI });
              }
              if (french) {
                bBalu.quad(ww + 0.06, 0.62, cx, sill + 0.31, -0.07, 0xffffff, { ry: Math.PI });
                bPl.box(ww + 0.3, 0.06, 0.32, cx, sill - 0.01, -0.16, trim);
              }
              if (!upper && rS() < 0.22 && (slot - ww) / 2 > 0.5) {
                const ax = cx + (i % 2 ? -1 : 1) * (ww / 2 + 0.5), ay = sill + 0.45;
                bPl.box(0.8, 0.56, 0.3, ax, ay, -0.16, 0xdcdad2);
                bAC.quad(0.46, 0.46, ax + 0.1, ay, -0.312, 0xffffff, { ry: Math.PI, uv: [1, 1] });
              }
              if (!french && !upper && rS() < 0.16) {
                const py = top - 0.18;
                bPl.box(0.035, 0.035, 2.1, cx, py, -1.05, 0x9a8a64);
                for (let j = 0, nj = 2 + ((rS() * 3) | 0); j < nj; j++) {
                  const gz = -0.45 - j * 0.55, gh = 0.5 + rS() * 0.35, gc = pick(CLOTH);
                  bPl.quad(0.46, gh, cx + 0.002, py - gh / 2 - 0.02, gz, gc, { ry: Math.PI / 2 });
                  bPl.quad(0.46, gh, cx - 0.002, py - gh / 2 - 0.02, gz, gc, { ry: -Math.PI / 2 });
                }
              }
            }
          }
          for (const s of [-1, 1]) {
            bPl.box(0.2, T - Y1, 0.12, s * (w / 2 - 0.1), (Y1 + T) / 2, -0.06, trim);
            bPl.box(0.26, 0.2, 0.2, s * (w / 2 - 0.13), T - 0.34, -0.1, trim);
          }
          bPl.box(w, 0.14, 0.3, 0, T - 0.05, -0.1, trim);
          bPl.box(w, 0.3, 0.55, 0, T + 0.15, -0.16, trim);
          if (style === 'deco') {
            bPl.box(w - 0.02, 1.05, 0.22, 0, T + 0.3 + 0.525, 0.0, wallC);
            bPl.box(w * 0.38, 0.5, 0.24, 0, T + 1.35 + 0.25, 0.0, wallC);
            bPl.box(w * 0.2, 0.3, 0.26, 0, T + 1.85 + 0.15, 0.0, wallC);
            bPl.box(w, 0.08, 0.3, 0, T + 1.35, -0.02, trim);
            bSign.quad(w * 0.34, 0.36, 0, T + 0.86, -0.113, 0xffffff, { ry: Math.PI, cell: SCELL(16 + ((rS() * 3) | 0)) });
          } else {
            const lift = style === 'late' ? 0.5 : 0;
            if (lift) bPl.box(w, 0.5, 0.2, 0, T + 0.3 + 0.25, 0.0, wallC);
            /* v22.2 (Chad: "the shophouses with the roof, the roof does not look complete"): the roof was its FRONT slope
               alone, a slab that stopped in mid-air half-way back over the house's flat top, open underneath at both ends —
               so wherever a neighbour stands lower, and at each row's last house, the street saw the sky through the roof.
               A whole pitched roof now: the front slope up to a ridge over the middle of the house, the back slope down to
               its rear eave, a capping along the ridge, a gable wall closing each end under the slopes, and a strip of wall
               along the back under the rear eave. Every other house sets its roof 12 mm higher, so two neighbours of one
               height never lay their 1.5 cm overhangs in the same plane (which would flicker). */
            const yb = T + 0.3 + lift + (nRoof++ % 2) * 0.012, z0 = -0.32, z2 = 9.17, zr = (z0 + z2) / 2, rise = 1.75;
            const run = zr - z0, len = Math.hypot(run, rise), ang = Math.atan2(rise, run);
            bRoof.box(w + 0.03, 0.1, len, 0, yb + rise / 2, (z0 + zr) / 2, 0xa05a3e, { rx: -ang, ws: 0.5 });
            bRoof.box(w + 0.03, 0.1, len, 0, yb + rise / 2, (zr + z2) / 2, 0xa05a3e, { rx: ang, ws: 0.5 });
            bRoof.box(w + 0.03, 0.12, 0.26, 0, yb + rise + 0.03, zr, 0x8a4a32, { ws: 0.5 });
            // the gables: the house's sides from its flat top up under the slopes (2 cm under the slabs' centre line, so the
            // join is inside the tiles), set 2 cm in from the side so they never share a plane with the house below them
            const sl = (z) => yb - 0.02 + rise * (z <= zr ? (z - z0) / run : (z2 - z) / run);
            const gs = new THREE.Shape([new THREE.Vector2(0, T - 0.02), new THREE.Vector2(8.85, T - 0.02), new THREE.Vector2(8.85, sl(8.85)),
                                        new THREE.Vector2(zr, sl(zr)), new THREE.Vector2(0, sl(0))]);
            for (const s of [-1, 1]) bPl.add(new THREE.ExtrudeGeometry(gs, { depth: 0.12, bevelEnabled: false }), s > 0 ? w / 2 - 0.02 : -w / 2 + 0.14, 0, 0, wallC, { ry: -Math.PI / 2, k: 0.8 });
            bPl.box(w - 0.04, sl(8.85) - T + 0.02, 0.2, 0, (T + sl(8.85)) / 2, 8.75, wallC, { k: 0.8 });
          }
          if (upper) { bPl.box(w, Y1 - Gw, 0.45, 0, (Gw + Y1) / 2, 0.225, wallC, { k: 0.92 }); return; }   // the shop's own fascia, its sign hung on it by buildWorldT
          bPl.box(w, Y1 - Gw, 0.45, 0, (Gw + Y1) / 2, 0.225, wallC, { k: 0.92 });
          const sg = kind === 'kopi' ? 0 : kind === 'mart' ? 1 : dealSign();
          bSign.quad(w - 0.75, 0.5, 0, (Gw + Y1) / 2, -0.006, 0xffffff, { ry: Math.PI, cell: SCELL(sg) });
          // (1 cm under the fascia's underside: in its plane, the two faces fought for the same pixels and the strip along
          // the way's street edge flickered as he walked — v22.2, Chad: "a texture on the ceiling of the corridor that
          // flickers and glitches as player walks")
          bCeil.quad(w, F, 0, Gw - 0.01, F / 2, 0xd4cab8, { rx: Math.PI / 2 });
          if (sg === 10 || sg === 3) {
            const bx = -w / 2 + 0.3, by = Y1 + 1.3;
            bPl.box(0.1, 1.95, 0.72, bx, by, -0.42, 0x2a2420);
            for (const s of [-1, 1]) bBlade.quad(0.62, 1.82, bx + s * 0.052, by, -0.42, 0xffffff, { ry: s * Math.PI / 2, cell: BCELL(sg === 10 ? 0 : 1) });
          }
          const sw = w - 0.9;
          if (!shop) {
            // a shutter half up on some by day (a dark shop behind it), right down on the rest
            const up = rS() < 0.35 ? 1.2 : 0;
            bShut.quad(sw, 3.0 - up, 0, fy + 1.5 + up / 2, F - 0.02, 0xd8dadc, { ry: Math.PI });
            if (up) bIn.quad(sw, up, 0, fy + up / 2, F + 0.05, 0x2a2622, { ry: Math.PI, k: 0.55 });
            bPl.box(sw + 0.1, 0.3, 0.32, 0, fy + 3.15, F - 0.16, 0x4a4e54);
            bPl.box(w, Gw - fy - 3.3, 0.2, 0, (fy + 3.3 + Gw) / 2, F + 0.1, wallC, { k: 0.85 });
            for (const s of [-1, 1]) bPl.box(0.45, 3.3, 0.2, s * (w / 2 - 0.225), fy + 1.65, F + 0.1, wallC, { k: 0.85 });
            if (rS() < 0.5) {
              const px = (rS() < 0.5 ? -1 : 1) * (w / 2 - 0.55);
              bPl.add(new THREE.CylinderGeometry(0.2, 0.15, 0.36, 8), px, fy + 0.18, 0.75, 0x8a5a3a);
              bPl.add(new THREE.IcosahedronGeometry(0.32, 1), px, fy + 0.6, 0.75, 0x35552c);
              (tLive.pots || (tLive.pots = [])).push(new THREE.Vector3(px, 0, 0.75).applyMatrix4(FR));   // CP9: an ending's walk bends round it
            }
            return;
          }
          const oh = 3.1, Dd = 6.0, warm = kind === 'kopi';
          bPl.box(w, Gw - fy - oh, 0.2, 0, (fy + oh + Gw) / 2, F + 0.1, wallC, { k: 0.85 });
          for (const s of [-1, 1]) bPl.box(0.45, oh, 0.2, s * (w / 2 - 0.225), fy + oh / 2, F + 0.1, wallC, { k: 0.85 });
          const wallIn = warm ? 0xe8d4b0 : 0xe6eef4, floorIn = warm ? 0xbca88c : 0xd4d8da, ceilIn = warm ? 0xf0e2c8 : 0xf4f6f8;
          bIn.quad(sw, Dd, 0, fy + 0.002, F + Dd / 2, floorIn, { rx: -Math.PI / 2, k: 0.48 });
          bIn.quad(sw, Dd, 0, fy + oh, F + Dd / 2, ceilIn, { rx: Math.PI / 2, k: 0.4 });
          bIn.quad(Dd, oh, -sw / 2, fy + oh / 2, F + Dd / 2, wallIn, { ry: Math.PI / 2, k: 0.5 });
          bIn.quad(Dd, oh, sw / 2, fy + oh / 2, F + Dd / 2, wallIn, { ry: -Math.PI / 2, k: 0.5 });
          for (const z of [1.2, 3.2, 5.0]) for (const x of [-sw / 4, sw / 4]) bIn.box(1.2, 0.05, 0.08, x, fy + oh - 0.04, F + z, 0xffffff, { k: 1.4 });
          const back = new THREE.Mesh(new THREE.PlaneGeometry(sw, oh), unlitMat(tex(warm ? makeKopiBack(THREE, cnv) : makeMartBack(THREE, cnv)), { vertexColors: false, color: warm ? 0xc8c0b0 : 0xc8ccd0 }));
          back.applyMatrix4(_M.multiplyMatrices(FR, _L.compose(_V.set(0, fy + oh / 2, F + Dd), _Q.setFromEuler(_E.set(0, Math.PI, 0)), _S1)));
          SG.add(back);
          if (warm) {
            bIn.box(sw * 0.7, 1.05, 0.6, 0, fy + 0.525, F + Dd - 0.55, 0x6a3a1e, { k: 0.6 });
            for (const x of [-1.3, 1.3]) {
              bIn.box(0.8, 0.04, 0.8, x, fy + 0.75, F + 2.6, 0xe8e4dc, { k: 0.85 });
              bIn.box(0.06, 0.72, 0.06, x, fy + 0.37, F + 2.6, 0x2a2420, { k: 0.7 });
            }
            bIn.box(0.7, 1.8, 0.55, sw / 2 - 0.5, fy + 0.9, F + Dd - 0.6, 0xd8ecff, { k: 1.05 });
          } else {
            for (const x of [-1.4, 0, 1.4]) {
              bIn.box(0.55, 1.6, 3.2, x, fy + 0.8, F + 3.3, 0xc8ccd0, { k: 0.75 });
              for (let k = 0; k < 4; k++) bIn.box(0.57, 0.2, 3.1, x, fy + 0.35 + k * 0.38, F + 3.3, pick([0xc8302a, 0x2a6ac8, 0xe8c040, 0x3a9a5a, 0xe87a2a]), { k: 0.8 });
            }
            bIn.box(1.4, 1.0, 0.6, -sw / 2 + 0.9, fy + 0.5, F + 0.9, 0x8a8e92, { k: 0.8 });
          }
        }

        const fill = (a, b) => {
          const L = b - a, n = Math.max(1, Math.round(L / 5.25)), ws = []; let s = 0;
          for (let i = 0; i < n; i++) { const v = 0.84 + rS() * 0.34; ws.push(v); s += v; }
          const out = []; let x = a; for (const v of ws) { const w = L * v / s; out.push([x, x + w]); x += w; } return out;
        };
        const farRow = [...fill(-74, -20.5), [-20.5, -14.6, 'kopi'], ...fill(-14.6, 9.4), [9.4, 14.6, 'mart'], ...fill(14.6, 74)];
        const ourRow = [...fill(-72, -8.6), [-8.6, -3.0], [-3.0, 3.0, 'upper'], [3.0, 8.8], ...fill(8.8, 72)];
        for (const [x0, x1, kind] of farRow) shophouse(x0, x1, true, kind);
        for (const [x0, x1, kind] of ourRow) shophouse(x0, x1, false, kind);
        ident();
        const edges = (row) => [...new Set(row.flatMap(([a, b]) => [a, b]).map(v => +v.toFixed(3)))];
        for (const x of edges(farRow)) {
          bPl.box(0.45, 3.9 - 0.15, 0.45, x, 0.15 + 3.75 / 2, 16.225, 0xf2eee4);
          bPl.box(0.56, 0.32, 0.56, x, 0.15 + 0.16, 16.225, 0xe2dccc);
        }
        for (const x of edges(ourRow)) {
          bPl.box(0.4, 3.4, 0.4, x, 1.7, 2.0, 0xe6d9bf);
          bPl.box(0.5, 0.3, 0.5, x, 0.15, 2.0, 0xd6c9af);
        }
        bFloor.box(148, 0.15, 2.0, 0, 0.075, 17.0, 0xb0aaa0, { ws: 0.4 });
        bVerge.box(180, 0.1, 0.86, 0, 0.05, 15.57, 0xffffff, { ws: 1.5 });
        const ROAD_L = 180;
        bRoad.quad(ROAD_L, 12.2, 0, -0.03, 8.66, 0xffffff, { rx: -Math.PI / 2, ws: 6 });
        // our own five-foot way's tiles on either side of the shop's (buildWorldT lays the shop's)
        for (const s of [-1, 1]) bFloor.quad(68.9, 2.2, s * (4.1 + 34.45), 0.003, 1.1, 0xb0aaa0, { rx: -Math.PI / 2, ws: 0.4 });
        // the road's paint: a broken white line down the middle, double yellow along both kerbs
        for (let x = -88; x < 88; x += 6) bPl.box(3.0, 0.004, 0.12, x + 1.5, -0.02, 8.66, 0xf2f0e8);
        for (const z of [2.86, 3.0, 14.32, 14.46]) bPl.box(ROAD_L, 0.004, 0.09, 0, -0.02, z, 0xe8c63a);
        // over the roofs: blocks of flats, by day
        for (const [x, z, w, h] of [[-48, 52, 36, 46], [-10, 62, 32, 54], [26, 50, 34, 40], [54, 60, 30, 50], [-30, -60, 40, 48], [30, -58, 36, 42]]) {
          bHdb.box(w, h, 12, x, h / 2, z, 0xffffff, { uv: [w / 24, h / 44.8] });
          bPl.box(6, 3.2, 5, x - w * 0.22, h + 1.6, z, 0x9a9690);
          bPl.add(new THREE.CylinderGeometry(1.3, 1.3, 2.2, 10), x + w * 0.25, h + 1.1, z, 0x9a9690);
        }
        bPl.build(dayMat(null));
        /* the five-foot ways' ceilings: painted plaster, and lit — from below by the street and the tiles, which no light
           here does (a downward face takes only the hemisphere's dark ground colour), so the bounce is an emissive warm
           grey (CP11: dark paint lit that way drew every walk along the shops with a black void for its top third) */
        bCeil.build(dayMat(null, { emissive: 0x4a4236, emissiveIntensity: 1 }));
        bWin.build(dayMat(winTex));
        bSign.build(dayMat(signTex, { roughness: 0.6 }));
        bFan.build(dayMat(fanTex));
        bBalu.build(dayMat(baluTex));
        bAC.build(dayMat(acTex));
        bBlade.build(dayMat(bladeTex, { roughness: 0.6 }));
        bRoof.build(dayMat(roofTex));
        bFloor.build(dayMat(ffwTex, { roughness: 0.6 }));
        bVerge.build(dayMat(vergeTex));
        bShut.build(dayMat(shutTex, { roughness: 0.55, metalness: 0.2 }));
        bIn.build(unlitMat(null));
        bHdb.build(dayMat(hdbTex));
        bRoad.build(dayMat(tex(makeDayAsphalt(THREE, cnv))));
        // the kerbs and the drain along ours
        const kerbM = M({ color: 0xb8b4aa, roughness: 0.85 });
        box(ROAD_L, 0.16, 0.16, 0, 0.08, 15.06, kerbM, SG, false);
        box(ROAD_L, 0.16, 0.2, 0, 0.08, 2.5, kerbM, SG, false);
        { const dm = M({ color: 0x1a1a1c, roughness: 0.96 }); const d = new THREE.Mesh(new THREE.PlaneGeometry(ROAD_L, 0.3), dm);
          d.rotation.x = -Math.PI / 2; d.position.set(0, -0.02, 2.75); SG.add(d); }
        if (plantTrees) treeStands.push(plantTrees(SG, [-60, -47, -34.5, -22, -5.5, 4.5, 17.5, 27, 39, 55, 66]
          .map((x, i) => ({ x, y: 0.1, z: 15.55, h: 7.4 + (i % 3) * 0.9 })), { seed: 181, tint: 0xd8e0c8, lowKeep: 0.65 }));
        parseOnce('cars').then(gl => {
          if (!alive) return;
          gl.scene.updateMatrixWorld(true);
          const bodies = []; gl.scene.traverse(o => { if (o.isMesh) bodies.push(o); });
          [[-36.5, 14.6], [-27.5, 14.6], [3.5, 14.6], [23.5, 14.6], [33.0, 14.6], [-16.0, 3.4], [21.0, 3.4]].forEach(([x, kz], i) => {
            const src = bodies[i % bodies.length]; if (!src) return;
            const geo = src.geometry.clone(); geo.applyMatrix4(src.matrixWorld); geo.computeBoundingBox();
            let bb = geo.boundingBox;
            if (bb.max.z - bb.min.z > bb.max.x - bb.min.x) { geo.rotateY(Math.PI / 2); geo.computeBoundingBox(); bb = geo.boundingBox; }
            const s = 4.3 / (bb.max.x - bb.min.x);
            geo.translate(-(bb.min.x + bb.max.x) / 2, -bb.min.y, -(bb.min.z + bb.max.z) / 2); geo.scale(s, s, s);
            geo.computeBoundingBox();
            const wd = geo.boundingBox.max.z - geo.boundingBox.min.z;
            const car = new THREE.Mesh(geo, src.material);
            car.position.set(x, -0.02, kz > 8 ? kz - wd / 2 : kz + wd / 2); car.rotation.y = i % 2 ? Math.PI : 0;
            car.castShadow = false; car.receiveShadow = false;
            SG.add(car); owned.push({ dispose: () => geo.dispose() });
          });
        }).catch(e => { console.warn('e3c4: the parked cars did not load', e); ctx.loadFail && ctx.loadFail('cars', e); });
        return SG;
      }
      buildStreetT();
      mergeByMaterial(AG);
      tLive.built = true;
    }
    /* the tray shop, alive: its fans, its clock, its lamps, its smoke and its dust (wall time) */
    function tTick(wdt) {
      if (!tLive.frozen) tLive.t += wdt;                                              // when the clock stops, everything does
      const t = tLive.t;
      for (const f of tLive.fans) f.rotation.y -= wdt * 2.6 * tLive.fanK;
      if (tLive.pend) {                                                                // the pendulum: a second each way while the clock runs
        if (tLive.clockOn) tLive.swing += wdt * Math.PI * tLive.tickK;
        tLive.pend.rotation.z = Math.sin(tLive.swing) * 0.16 * (tLive.clockOn ? 1 : 0) + (tLive.clockOn ? 0 : tLive.stopA || 0);
      }
      tLive.lampPh += wdt;
      for (const L of tLive.lamps) {                                                   // the cords: the air from the fans, and a giant's step when it comes
        const a = 0.012 * Math.sin(t * 0.9 + L.ph) + tLive.lampSwing * Math.sin(t * 3.1 + L.ph * 2);
        L.pv.rotation.set(a, 0, 0.6 * a);
      }
      for (const sm of tLive.smoke) {
        const u = (t * 0.12 + sm.userData.ph) % 1;
        sm.position.y = TALTAR.h + 0.3 + u * 0.9; sm.material.opacity = 0.32 * Math.sin(Math.PI * u); sm.scale.set(1 + u * 1.6, 1 + u * 0.5, 1);
        sm.rotation.z = Math.sin(t * 0.7 + sm.userData.ph * 6) * 0.25;
        camera.getWorldQuaternion(sm.quaternion);
      }
      for (const fl of tLive.bulbs) { const k = 0.85 + 0.15 * Math.sin(t * 13 + fl.userData.base.x * 9) * Math.sin(t * 7.3); fl.scale.set(k, 0.9 + 0.2 * k, 1); fl.material.opacity = 0.9 * k; }
      if (tLive.motes) {
        const P = tLive.motes.geometry.attributes.position, B = tLive.motes.userData.base;
        for (let i = 0; i < P.count; i++) P.setXYZ(i, B[i * 3] + Math.sin(t * 0.21 + i) * 0.12, B[i * 3 + 1] + ((t * 0.03 + i * 0.13) % 1) * 0.3, B[i * 3 + 2] + Math.cos(t * 0.17 + i * 1.3) * 0.1);
        P.needsUpdate = true;
      }
    }
    /* static meshes merged by material, one geometry each (the tray shop's two hundred antiques on their shelves: one
       draw a material, not one a pot) — positions and normals baked through each mesh's matrix into the group's frame */
    function mergeByMaterial(group) {
      group.updateMatrixWorld(true);
      const inv = new THREE.Matrix4().copy(group.matrixWorld).invert(), m4 = new THREE.Matrix4(), nm = new THREE.Matrix3(), v = new THREE.Vector3();
      const by = new Map();
      group.traverse(o => { if (o.isMesh) { if (!by.has(o.material)) by.set(o.material, []); by.get(o.material).push(o); } });
      for (const [mat, list] of by) {
        if (list.length < 2) continue;
        const P = [], N = [], U = [], I = [];
        for (const o of list) {
          const g = o.geometry, pa = g.attributes.position, na = g.attributes.normal, ua = g.attributes.uv;
          if (!pa || !na) continue;
          m4.multiplyMatrices(inv, o.matrixWorld); nm.getNormalMatrix(m4);
          const base = P.length / 3;
          for (let i = 0; i < pa.count; i++) {
            v.fromBufferAttribute(pa, i).applyMatrix4(m4); P.push(v.x, v.y, v.z);
            v.fromBufferAttribute(na, i).applyMatrix3(nm).normalize(); N.push(v.x, v.y, v.z);
            U.push(ua ? ua.getX(i) : 0, ua ? ua.getY(i) : 0);
          }
          if (g.index) for (let i = 0; i < g.index.count; i++) I.push(base + g.index.getX(i));
          else for (let i = 0; i < pa.count; i++) I.push(base + i);
          o.parent.remove(o); g.dispose();
        }
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.Float32BufferAttribute(P, 3));
        geo.setAttribute('normal', new THREE.Float32BufferAttribute(N, 3));
        geo.setAttribute('uv', new THREE.Float32BufferAttribute(U, 2));
        geo.setIndex(P.length / 3 > 65535 ? new THREE.Uint32BufferAttribute(I, 1) : new THREE.Uint16BufferAttribute(I, 1));
        geo.computeBoundingSphere();
        const m = new THREE.Mesh(geo, mat); m.castShadow = false; m.receiveShadow = true; group.add(m);
      }
    }
    buildWorldT();

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
    let booted = false, preplaced = '';       // preplaced: the world a Continue was put in under the chapter card (CP11)
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
    // CP7 · the Hanuman shop's sounds in play: the piece set down, the experience, the mall's small noises
    if (warmSounds) warmSounds(['y4setdown', 'h4rumble', 'h4surge', 'h4rattle', 'h4embers', 'h4roarin', 'h4ring', 'h4pull', 'h4clatter', 'h4burst',
                                'h4shutter', 'h4trolley', 'h4phone', 'h4cash', 'h4bag', 'h4child', 'h4slippers']);
    // CP8 · the tray shop's: the clock, the tea, the pieces picked up and set down, each answer's sounds, the fourth piece,
    // the clock stopping, the street's small noises
    if (warmSounds) warmSounds(['x4tick', 'x4tea', 'x4cup', 'x4pick', 'x4set', 'x4om', 'x4leaves', 'x4rattle', 'x4dust', 'x4clockstop',
                                'x4scooter', 'x4bicycle', 'x4passers', 'x4shimmer', 'x4unwrap', 'x4step', 'x4giant', 'x4hiss', 'x4turn', 'x4pressure']);

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
      objectiveFor(p, tag);
    }
    function objectiveFor(p, tag) {
      if (!kit) return;
      // the Hanuman in his hand, or let go and lying on the glass: no order to pick it up (a Continue into either
      // restored "Pick up the Hanuman" over a piece already let go)
      // (and the Yin: her in his hand, or set down — CP11: the pickup played COMPLETE, a blank order, COMPLETE)
      if ((p === 'hanHold' || p === 'yinHold') && (tag === 'held' || tag === 'done' || tag === 'down')) { kit.objective(null); return; }
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
      if (k === 'bottles') { tubeStut = 0.9; worldSfx('y4tube', 0.5, 1, panAt(0, -4.0)); }
      else if (k === 'photos') { yin.bellSwing = 1; worldSfx('y4bell', 0.42, 1, panAt(DOORBELL.x, DOORBELL.z)); }
      else if (k === 'altar') { if (yLive.curtain) yLive.curtain.gust = 1.4; worldSfx('y4curtain', 0.55, 1, panAt(BACKROOM.x, BACKROOM.z)); }
    }
    function keeperSpeaks() {
      if (phase !== 'yin') return;
      queueGap(0.6);
      queueLine('yk4hello', () => setPhase('yinKeeper'));
    }
    function keeperShows() {
      if (phase !== 'yinKeeper' || yin.showing) return false;
      yin.showing = true;                                        // once: a double tap inside one frame queued her show twice (CP11)
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
    /* a conduct note banked once: if the card already carries it, nothing is paid again (v7.3's receipt) — the merit
       film and the third piece can both be reached again by a Continue (CP11: both notes were written at CP1 and
       never banked, so "What you did" never showed the chapter's central good act) */
    function bankOnce(d) {
      if (!kit || !kit.conduct) return;
      const had = kit.getConduct ? kit.getConduct().notes : [];
      if (d.note && had.includes(String(d.note))) return;
      kit.conduct(d);
    }
    function leaveYin() {
      if (phase !== 'yinDone' || !kit) return;
      setPhase('yinDone');
      if (kit.waypoint) kit.waypoint(null);
      /* the merit film (CP6): its end hands its black to World H. A skip lands on its last frame, so its world is put
         away here either way (meritEnd: the pocket hidden, the lens's width back, the envelope out of his hand, the
         captions cleared — captions run on wall time and outlive a skipped film) */
      const done = () => { meritEnd(); bankOnce({ s: 3, note: W.noteMerit }); toWorld('H', false); };
      if (!kit.film || !kit.film('merit', { onDone: done })) done();
    }

    /* ============================================== THE YIN EXPERIENCE (CP5)
       S1·09: "an electric-like numbness travelling up my arm, followed by an intense cold". On the chapter's clock
       from the press, his look his own: the locket in his hand (kit.hold) with static crawling from it up his arm and
       the hand trembling (kit.tremble), his heart jumping (kit.pulse, heard and on the monitor); then the cold — what
       it does to HIM, not ice on a lens (Chad: "Why the frost effect has snowflakes? It makes no sense"): the edges of
       his sight blurring and going blue and the world dimming (kit.chill), the picture lagging behind his eyes
       (kit.smear), his heart slowing and missing and jumping while the monitor goes wild, his breath fogging, the
       shop's red draining to a cold blue-white, the candles shrinking, the fan running down, the tape on the
       counter sagging (the song's own source slowing: the bed RATE, main.js's loopRate); then a young woman at
       the very edge of his sight who is gone before his eyes reach her, and her humming beside him — the tape's
       voice, without the tape; then STEADY (the thirty-first seam): keep her steady and set her down gently. The
       set-down: the tape runs down and stops with a click, a sigh at his ear, the warmth back over four seconds, the
       candles straightening, his promise. Every number below is on WALL time or the chapter's clock (the v7.4 law). */
    /* the cold's light: the same tubes gone thin and blue, the room a third darker (CP5a re-derived it from the
       brighter shop; the edge blur, the grey and the dimming on the picture are kit.chill's, on top) */
    const Y_COLD = {
      stops: [[0.00, '#24303c'], [0.30, '#1e2833'], [0.60, '#18202a'], [1.00, '#12181f']],
      bg: 0x12181f, fog: [0x1a222c, 0.02],
      hemi: [0xd6e6ff, 0x1c2430, 0.52], key: [0xdcecff, 0.4, 1, 6, 2], fill: [0x9cc4ff, 0.24],
      stars: 0, moon: 0, sun: 0, clouds: 0,
      vmHemi: [0xd6e6ff, 0x1c2430, 0.66], vmKey: [0xdcecff, 0.5]
    };
    const RADIO = { x: YSHOP.x1 - 0.12, z: -2.2 }, BACKROOM = { x: YSHOP.x0 + 0.68, z: YSHOP.z0 + 0.3 }, DOORBELL = { x: 0.3, z: -0.19 };
    const Y_SOUNDS = ['y4song', 'y4dread', 'y4mall', 'y4hum', 'y4tapeclick', 'y4zap', 'y4heart', 'y4shiver', 'y4breath', 'y4sigh',
                      'y4bell', 'y4tube', 'y4beads', 'y4curtain', 'y4candle', 'y4creak', 'y4box', 'y4setdown', 'y4clatter', 'y4sting', 'y4radio', 'y4cry'];
    if (warmSounds) warmSounds(Y_SOUNDS);
    const yin = { on: false, run: 0, setDown: false, cold: 0, coldTo: 0, numb: 0, numbTo: 0, puffT: 0,
                  rate: 1, gain: 1, stopping: false, stopped: false, clicked: false, bellSwing: 0, radioDip: 0,
                  girl: { a: 0, to: 0, shows: 0, side: 1, placed: false, nextAt: 0 } };
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
      const heldLinks = [];
      const rim = new THREE.Mesh(new THREE.TorusGeometry(0.021, 0.0035, 8, 28), gold); lk.add(rim);
      const back = new THREE.Mesh(new THREE.CylinderGeometry(0.021, 0.021, 0.004, 28), gold); back.rotation.x = Math.PI / 2; back.position.z = -0.002; lk.add(back);
      const fm = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4, visible: false }); mats.push(fm);
      const fg = new THREE.CircleGeometry(0.018, 28), fuv = fg.attributes.uv;
      for (let i = 0; i < fuv.count; i++) fuv.setXY(i, 0.28 + fuv.getX(i) * 0.44, 1 - (0.08 + (1 - fuv.getY(i)) * 0.4));
      heldFace = new THREE.Mesh(fg, fm); heldFace.position.z = 0.0015; lk.add(heldFace);
      const glass = new THREE.Mesh(new THREE.CircleGeometry(0.018, 28), M({ color: 0xbfd4cf, roughness: 0.05, metalness: 0.2, transparent: true, opacity: 0.16, depthWrite: false }));
      glass.position.z = 0.0025; lk.add(glass);
      const bail = new THREE.Mesh(new THREE.TorusGeometry(0.004, 0.0012, 4, 10), gold); bail.position.set(0, 0.025, 0); lk.add(bail);
      /* CHAD'S yin amulet in his hand (v22.0 CP5: "this is the yin amulet that the player holds"): the near cut, every
         triangle, 10 cm with its bail (7.5 read as a coin at the fingertip in the photographs), her portrait to the lens;
         the drawn locket stands until it lands */
      { const drawn = [rim, back, heldFace, glass, bail];
        yinAmulet().then(A => {
          if (!alive) return;
          const m = A.near.clone(true); m.scale.setScalar(0.1 / 1.35); lk.add(m);
          for (const o of drawn) o.visible = false;
          // the chain re-laid for her size: through the bail (its ring 4.5 cm up), back over her ghost's face on the
          // locket's back, and down behind her onto his fingers
          heldLinks.forEach((ln, k) => { const u = k / 17;
            ln.position.set(0.006 * Math.sin(u * 5), 0.033 - u * 0.1, -(0.0105 + 0.006 * Math.sin(Math.PI * Math.min(1, u * 1.4))) * Math.min(1, u * 4) - u * 0.004);
            ln.scale.setScalar(1.25); });
        }).catch(() => {}); }
      // the chain, from the bail over the back of the locket and down onto his fingers (CP5e: held up on the fingertip
      // with the chain rising out of the frame, it read as a locket hanging from something above him)
      const chainG = new THREE.TorusGeometry(0.003, 0.0008, 3, 6);
      for (let k = 0; k < 18; k++) {
        const ln = new THREE.Mesh(chainG, yinChainMat), u = k / 17;
        ln.position.set(0.005 * Math.sin(u * 5), 0.027 - u * 0.078, -0.004 - 0.007 * Math.sin(Math.PI * Math.min(1, u * 1.4)) - u * 0.003);
        ln.rotation.set(u * 2, k % 2 ? Math.PI / 2 : 0, 0); lk.add(ln); heldLinks.push(ln);
      }
      // the cold creeping from the locket up his arm: soft blue lights that rise from her and fade on the wrist, one
      // after another (CP5e: the first build drew jagged white threads here, and in the photographs they read as
      // scribbles on the skin, not as cold). Additive, over the skin, in the hands' pass.
      for (let i = 0; i < 7; i++) {
        const m = new THREE.SpriteMaterial({ map: yLive.tGlow, color: 0x8cc8ff, transparent: true, opacity: 0, depthTest: false, depthWrite: false, blending: THREE.AdditiveBlending, fog: false });
        mats.push(m);
        const sp = new THREE.Sprite(m); sp.renderOrder = 50; sp.visible = false; yinHeld.add(sp);
        arcs.push({ sp, ph: i / 7, side: (hash(i, 41) - 0.5) * 2, lift: (hash(i, 43) - 0.5) * 2 });
      }
      const gm = new THREE.SpriteMaterial({ map: yLive.tGlow, color: 0x7cc4ff, transparent: true, opacity: 0, depthTest: false, depthWrite: false, blending: THREE.AdditiveBlending, fog: false });
      mats.push(gm);
      yin.glow = new THREE.Sprite(gm); yin.glow.scale.set(0.09, 0.09, 1); yin.glow.renderOrder = 51; yinHeld.add(yin.glow);
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
        // above the fingertip, clear of the hand (chosen from nine photographed placements — at the palm the index finger
        // covered her face, CP5e)
        kit.hold(yinHeld, { pos: [0.018, 0.005, -0.19], rot: [ARM_INV.x - 0.25, ARM_INV.y, ARM_INV.z] });
      } else if (kit.holding && kit.holding() === yinHeld) kit.hold(null);
    }
    const _as = new THREE.Vector3(), _au = new THREE.Vector3(), _ap = new THREE.Vector3();
    function arcsTick(wdt) {
      const k = yin.numb;
      yin.glow.material.opacity = k * (0.3 + 0.12 * Math.sin(yT * 3.1));       // her glow: a slow breath, not a buzz
      if (k < 0.02) { for (const a of arcs) a.sp.visible = false; return; }
      _as.set(0, 0, 1).cross(ARM_UP).normalize(); _au.copy(ARM_UP).cross(_as).normalize();
      const reach = 0.08 + 0.16 * k;                                          // further up the arm as he goes numb
      for (const a of arcs) {
        a.ph = (a.ph + wdt * (0.32 + 0.1 * k)) % 1;
        const u = a.ph, wob = Math.sin(yT * 2.3 + a.side * 4) * 0.004;
        _ap.copy(ARM_UP).multiplyScalar(u * reach).addScaledVector(_as, a.side * 0.008 * (0.4 + u) + wob).addScaledVector(_au, a.lift * 0.006);
        a.sp.position.copy(_ap);
        const sc = 0.03 + 0.05 * Math.sin(Math.PI * u) * (0.6 + 0.4 * k); a.sp.scale.set(sc, sc, 1);
        a.sp.material.opacity = Math.sin(Math.PI * u) * Math.min(1, k * 1.1) * 0.55;
        a.sp.visible = true;
      }
    }
    /* CP5e · HE TURNS FROM THE COUNTER with her in his hand, to hold her up to the shop's light — looking down the
       shop: the aisle and the cabinets, the altar at the back, her portrait on the right wall. It is also the only
       view in which the frame's edges can hold her: facing the keeper, every spot at the edge of a desktop's frame
       is behind the counter, in the stock or past the wall (the probe, at the counter: 36 candidates, 36 refused).
       1.4 s on wall time, eased; held still under a panel; his look is his own again the moment it ends. */
    const viewTurn = { on: false, t: 0, secs: 1.4, y0: 0, y1: 0, p0: 0, p1: 0 };
    function viewTurnStart(tx, tz, pitchTo, secs) {
      const dx = tx - yaw.position.x, dz = tz - yaw.position.z, want = Math.atan2(-dx, -dz);
      const d = Math.atan2(Math.sin(want - yaw.rotation.y), Math.cos(want - yaw.rotation.y));
      Object.assign(viewTurn, { on: true, t: 0, secs, y0: yaw.rotation.y, y1: yaw.rotation.y + d, p0: pitch.rotation.x, p1: pitchTo });
    }
    function viewTurnTick(wdt) {
      if (!viewTurn.on || getState() !== 'play') return;
      viewTurn.t = Math.min(1, viewTurn.t + wdt / viewTurn.secs);
      const k = viewTurn.t * viewTurn.t * (3 - 2 * viewTurn.t);
      yaw.rotation.y = viewTurn.y0 + (viewTurn.y1 - viewTurn.y0) * k;
      pitch.rotation.x = viewTurn.p0 + (viewTurn.p1 - viewTurn.p0) * k;
      if (viewTurn.t >= 1) viewTurn.on = false;
    }
    /* THE GIRL at the edge of the frame — of THIS screen (a phone's half-width is ~19°, a desktop's ~49°): put where
       the frame ends, held there in the world, and gone the moment his look turns toward her (before it arrives).
       Twice at most, the second time on the other side. */
    const _gd = new THREE.Vector3(), _gp = new THREE.Vector3(), _gq = new THREE.Vector3();
    function halfFovH() { return Math.atan(Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2) * camera.aspect); }
    function girlFree(x, z) {
      if (x < YSHOP.x0 + 0.35 || x > YSHOP.x1 - 0.35 || z < YSHOP.z0 + 0.4 || z > YSHOP.z1 - 0.5) return false;
      for (const b of (S && S.blockers) || []) if (b.max.y > 0.5 && x > b.min.x - 0.12 && x < b.max.x + 0.12 && z > b.min.z - 0.12 && z < b.max.z + 0.12) return false;
      // never inside the keeper (she stands behind the counter, where the narrow frame's spots fall)
      if (Math.hypot(x - KEEP.x, z - KEEP.z) < 0.62) return false;
      return true;
    }
    /* does the line from him to a spot pass through anything tall (a cabinet, a shelf, the back wall)? A girl behind
       the stock is not a girl at the edge of his sight. 2-D slab test against every blocker taller than a counter:
       furniture's collision COLUMNS all stand to 1.40 whatever is drawn (blockers()' solid, the v5.03 law), so the
       counter he leans on read as a wall at the first threshold (1.2) and every spot past it failed — the probe
       photographs: she never came. Only what really stands above 1.45 (shelves, the walls) hides her. */
    function girlSeen(ax, az, bx, bz) {
      for (const b of (S && S.blockers) || []) {
        if (b.max.y <= 1.45) continue;
        let t0 = 0, t1 = 1;
        const ok = [[ax, bx - ax, b.min.x, b.max.x], [az, bz - az, b.min.z, b.max.z]].every(([o, d, lo, hi]) => {
          if (Math.abs(d) < 1e-9) return o >= lo && o <= hi;
          let u0 = (lo - o) / d, u1 = (hi - o) / d; if (u0 > u1) [u0, u1] = [u1, u0];
          t0 = Math.max(t0, u0); t1 = Math.min(t1, u1); return t0 <= t1;
        });
        if (ok && t1 > 0.02 && t0 < 0.98) return false;
      }
      return true;
    }
    /* CP5e: the first build looked only 0.85-1.3 m out at 0.97 of the half-width, and from the counter every one of
       those spots was inside the counter (the photographs: she never came). Now: further out, a little further in
       from the edge, and only where nothing tall stands between them. */
    function girlPlace() {
      const G = yin.girl, P = yLive.girl; if (!P || !P.ready) return false;
      camera.getWorldDirection(_gd); _gd.y = 0; _gd.normalize(); camera.getWorldPosition(_gp);
      const hf = halfFovH(), fails = G.fail = { free: 0, seen: 0, from: [+_gp.x.toFixed(2), +_gp.z.toFixed(2)], dir: [+_gd.x.toFixed(2), +_gd.z.toFixed(2)], hf: +hf.toFixed(3) };
      /* (Chad's ghost, v22.0 CP5: the cold's own edge blur — kit.chill — swallowed her at 0.82-0.95 of the half-width,
         a pale smear in every photograph; she stands where the sight is still sharp now, two thirds of the way out, and
         far enough off that the whole of her is in the frame, hem to crown) */
      for (const side of [G.side, -G.side]) for (const f of [0.64, 0.7, 0.58, 0.76]) for (const d of [2.2, 2.6, 1.9, 3.1, 1.6, 3.7, 4.4]) {
        const a = side * hf * f, ca = Math.cos(a), sa = Math.sin(a);
        // turn the view direction by a, positive = to his RIGHT (the screen's +x, where a sound panned +1 is heard):
        // facing −z, a quarter turn right faces +x. (The first build turned the other way and panned her breath
        // to the side she was not on.)
        const dx = _gd.x * ca - _gd.z * sa, dz = _gd.x * sa + _gd.z * ca;
        const x = _gp.x + dx * d, z = _gp.z + dz * d;
        if (!girlFree(x, z)) { fails.free++; continue; }
        if (!girlSeen(_gp.x, _gp.z, x, z)) { fails.seen++; continue; }
        P.group.position.set(x, 0, z); P.group.rotation.y = Math.atan2(_gp.x - x, _gp.z - z);
        G.side = side; G.placed = true; G.at = { f, d };
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
            // she CRIES (Chad: "when the ghost appears, i want the ghost to have a pitiful crying voice echoing"):
            // a young woman's broken weeping, laid with an echo that carries down the tiles and back (cry.sh)
            worldSfx('y4cry', 0.78, 1, pan);
          }
        } else G.nextAt = dayClock.t + 0.4;
      }
      if (G.placed) {
        // is his look turning onto her? (the angle off his view's centre, against this screen's half-width)
        camera.getWorldDirection(_gd); _gd.y = 0; _gd.normalize(); camera.getWorldPosition(_gp);
        _gq.copy(P.group.position).sub(_gp); _gq.y = 0; _gq.normalize();
        const off = Math.acos(THREE.MathUtils.clamp(_gd.dot(_gq), -1, 1)), edge = halfFovH();
        const want = G.to > 0 && off > edge * 0.36 ? 0.8 : 0;            // gone the moment his look turns onto her
        G.a += (want - G.a) * (1 - Math.exp(-wdt * (want > G.a ? 2.2 : 14)));
        if (want === 0 && G.a < 0.02) {
          G.placed = false; G.a = 0;
          if (G.to > 0 && G.shows < 2) { G.side = -G.side; G.nextAt = dayClock.t + 2.6; } else G.to = 0;
        }
      }
      // CP5e: her own colours kept (her hair dark, her face pale), cooled a little and lit faintly from within, so she
      // reads as a young woman at the edge of his sight and not as a grey shape (the first tint washed her out)
      for (const m of P.mats) { m.opacity = G.a; if (m.color) m.color.setRGB(0.86 + 0.08 * G.a, 0.88 + 0.07 * G.a, 0.97); if (m.emissive) m.emissive.setRGB(0.05 * G.a, 0.06 * G.a, 0.09 * G.a); }
      P.group.visible = G.a > 0.01;
    }
    /* the breath, the static, the light, the lid, the bell — every frame (the shop lives in every state) */
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
      const fk = yin.cold;
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
      viewTurnTick(wdt);
      girlTick(wdt);
    }

    /* the cold on him, through the engine's three verbs (kit.chill / kit.smear / kit.pulse, main.js) — each optional,
       so a build without them plays the rest of the experience as it was */
    function coldTo(o) {
      if (!kit) return;
      if (o.chill && kit.chill) kit.chill(o.chill[0], { secs: o.chill[1] });
      if (o.smear && kit.smear) kit.smear(o.smear[0], { secs: o.smear[1] });
      if (o.pulse !== undefined && kit.pulse) kit.pulse(o.pulse);
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
      at(0.3, () => viewTurnStart(-0.35, -7.4, -0.06, 1.4));      // down the shop, her portrait on the right wall
      at(0.5, () => {
        yin.numbTo = 1; kit.tremble(0.35, { secs: 0.8 }); if (worldSfx) worldSfx('y4zap', 0.55, 1, 0.4);
        // the moment it touches him his heart jumps — heard from here on, and drawn on the monitor beat for beat
        coldTo({ pulse: { bpm: 104, secs: 0.6, erratic: 0.15, sound: 'y4heart', vol: 0.55, kick: true } });
      });
      at(1.4, () => queueLine('z4numb'));
      at(1.9, () => { kit.tremble(0.5, { secs: 1.0 }); if (worldSfx) worldSfx('y4zap', 0.4, 0.9, 0.5); });
      at(3.0, () => {
        yin.coldTo = 1;
        kit.daylight(Y_COLD, 3.0);
        W.presence = W.presenceCold; kit.presence(0.55);
        kit.tremble(0.65, { secs: 1.5 });
        // THE COLD: the edges of his sight blurring and going blue, the world dimming, the picture lagging behind his
        // eyes — and the racing heart SLOWING, missing beats, the monitor starting to go wrong
        coldTo({ chill: [0.6, 3.5], smear: [0.45, 3.5], pulse: { bpm: 58, secs: 4.5, erratic: 0.35 } });
        if (worldSfx) worldSfx('y4shiver', 0.5, 1, 0);
      });
      at(5.0, () => queueLine('z4cold'));
      at(6.6, () => {
        const G = yin.girl; G.to = 1; G.shows = 0; G.nextAt = dayClock.t; G.side = hash(yin.run, 31) < 0.5 ? 1 : -1;
        // as she comes: colder still, the heart down to a crawl and jumping (palpitations), the monitor wild
        coldTo({ chill: [0.85, 2.5], smear: [0.7, 2.5], pulse: { bpm: 44, secs: 4, erratic: 0.7 } });
      });
      at(7.4, () => queueLine('z4beside'));
      at(7.4 + (SECS.z4beside || 4.1) + 0.9, () => queueFn(() => yinSteady(run)));
    }
    function yinSteady(run) {
      if (run !== yin.run || !yin.on || !kit) return;
      let tugs = 0;
      // the cold does not charge him while he reads how to hold her (CP11: 0.8 a second through the brief, and a brief
      // left up long enough fainted him under the panel); it starts again on START
      kit.presence(0);
      kit.event({
        kind: 'steady', label: W.evSteady, brief: W.evSteadyBrief, demo: 'steady',
        secs: 8, ring: 0.16, grace: 1.3, pass: 0.6,
        onBegin: () => { if (worldSfx) worldSfx('y4sting', 0.3, 0.8, 0); if (run === yin.run && yin.on && !yin.setDown) kit.presence(0.55); },
        // the further she drifts from the middle, the harder the hand shakes, the colder the edges and the wilder the heart
        onDrift: (k) => {
          const d = Math.min(1, k);
          kit.tremble(0.45 + 0.75 * d, { secs: 0.15 }); yin.numbTo = 0.6 + 0.4 * d;
          coldTo({ chill: [0.75 + 0.25 * d, 0.3], pulse: { erratic: 0.55 + 0.45 * d } });
        },
        // and every tug is a palpitation on the spot
        onTug: () => {
          tugs++; if (worldSfx) worldSfx(tugs % 2 ? 'y4breath' : 'y4zap', 0.42, 1, (tugs % 2 ? -1 : 1) * 0.6);
          coldTo({ pulse: { kick: true } });
        }
      }).then(r => { if (r && r.aborted) return; if (run === yin.run && yin.on) yinSetDown(!!(r && r.ok)); });   // (aborted: a faint, a film — nothing is paid)
    }
    function yinSetDown(ok) {
      if (yin.setDown || !kit) return;
      yin.setDown = true;
      heldShow(false);
      if (yLive.locket) yLive.locket.visible = true;               // back on her satin
      if (worldSfx) worldSfx(ok ? 'y4setdown' : 'y4clatter', ok ? 0.6 : 0.7, 1, panAt(YBOX.x, YBOX.z));
      if (ok) bankOnce({ s: 3, note: W.noteSteady });
      else {
        kit.award('sanity', -6, { minigame: true });
        bankOnce({ note: W.noteSlip });
        if (kit.flash) kit.flash({ color: 'rgba(170,205,255,0.28)', secs: 0.5 });
        coldTo({ pulse: { kick: true } });                         // the clatter jolts him
      }
      /* the bookmark moves with what was paid (CP11: it stayed 'held' for the ~11 s the keeper speaks, so a Continue
         from a save taken there replayed STEADY and paid for it twice); a Continue lands at the door, her merit line
         said again */
      setPhase('yinHold', 'down');
      // the tape runs down and stops; a sigh at his ear; the cold leaves over four seconds — the edges clearing, the
      // picture catching up with his eyes, the heart steadying and coming back to him, then out of his ears
      yin.stopping = true;
      after(1.1, () => { if (worldSfx) worldSfx('y4sigh', 0.62, 1, -yin.girl.side * 0.6); });
      yin.girl.to = 0;
      yin.coldTo = 0; yin.numbTo = 0;
      kit.daylight(null, 4.0);
      kit.presence(0); W.presence = undefined;
      kit.tremble(0, { secs: 1.6 });
      coldTo({ chill: [0, 4.0], smear: [0, 2.5], pulse: { bpm: 76, secs: 3.0, erratic: 0 } });
      const run = yin.run;
      after(3.4, () => { if (run === yin.run) coldTo({ pulse: { vol: 0.22 } }); });
      after(6.0, () => { if (run === yin.run) coldTo({ pulse: null }); });
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
      const filmMall = st === 'cine' && oLive.on && oLive.where === 'mall';   // CP10: the opening film's old mall
      const live = inY && (st === 'play' || st === 'unlock' || st === 'choose' || st === 'menu' || filmMall);
      const d = Math.hypot(yaw.position.x - RADIO.x, yaw.position.z - RADIO.z);
      const outside = yaw.position.z > 0.15;
      const att = (1 / (1 + (d / (filmMall ? 5.0 : 2.6)) ** 2)) * (outside ? 0.45 : 1);   // (the film hears it from the far end)
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
      yin.on = false; yin.setDown = false; yin.showing = false; yin.cold = yin.coldTo = 0; yin.numb = yin.numbTo = 0; yin.puffT = 0;
      yin.rate = 1; yin.stopping = false; yin.stopped = false; yin.clicked = false; yin.bellSwing = 0; yin.radioDip = 0;
      Object.assign(yin.girl, { a: 0, to: 0, shows: 0, side: 1, placed: false, nextAt: 0 });
      viewTurn.on = false;
      coldTo({ chill: [0, 0], smear: [0, 0], pulse: null });     // nothing of the cold outlives a reset (kitReset also clears it)
      if (yLive.girl) yLive.girl.group.visible = false;
      heldShow(false);
      if (yLive.locket) yLive.locket.visible = true;
      if (yLive.box) { yLive.box.open = 0; yLive.box.lid.rotation.z = 0; }
      for (const p of puffs) { p.t = 1; p.sp.visible = false; }
      yLive.redK = 1; yLive.flameK = 1; yLive.smokeK = 1; if (yLive.fan) yLive.fan.k = 1;
      W.presence = undefined;
      wrongAt = 0; wrongI = 0;
      mixK.song = mixK.dread = mixK.mall = 0;
    }

    /* ============================================== THE HANUMAN SHOP (CP7, §4.3)
       He comes back to the shop he knows best; the owner has something new. Its stand on the counter, the press, and
       THE HANUMAN EXPERIENCE on the chapter clock from the press (S1·09: "an overwhelming urge, as if something wanted to
       enter"), his look his own all through it:
         0.0  the weight of it: a low hum out of the bronze, a glint in its eyes, his hand unsteady
         0.6  THE SURGE: the shop's light goes to gold and buzzes, the counter's glass rattles, embers come off it, his
              heart jumps
         1.8  THE ROAR, IN HIS MIND: heard from inside, enormous; a gold flash, a ring out of the piece past the frame, his
              head knocked back, the picture smearing, every sound in the shop gone under water
         2.2  THE VISION: Chad's Hanuman, huge, in gold fire, rising before him wherever he looks (drawn over the room)
         3.4  "Something... roared. Inside me."
         4.0  THE URGE: he closes both hands round it; something wants to come in (the banner, the drain); the lens drawn
              in toward it; the heart racing — and the hands begin to move on their own (chapter 2's hands, again)
         then "No... no... it wants to come in..." and LET GO — the timed press (CP3's words): wait for it, then let go AT
              ONCE. Too soon and its grip tightens; too late and it surges; either costs him and it comes again; a third
              miss lets it go for him, at the price. On the release his hands open, it falls on the glass, the vision
              bursts into embers, 0.4 s of nothing — then the shop again, the light back, the owner: "Eh! Boy!"
       Every beat is cancelled by a reset (`run`), and an experience is never resumed half-way (§8): a Continue lands
       on the piece back on its stand. */
    function ownerShows() {
      if (phase !== 'han' || hanX.shown) return false;
      hanX.shown = true;                                         // once (CP11)
      // he brings it up from under the counter as he calls him over: on the velvet a beat into his line, and it is
      // there to be picked up once he has finished saying it
      queueLine('ow4new', () => {
        personTalk(hLive.owner, SECS.ow4new);
        after(1.7, () => { standShow(true); if (worldSfx) worldSfx('y4setdown', 0.55, 1, panAt(HX + H.LPT.x, H.LPT.z)); });
        after(2.3, () => setPhase('hanHold'));
      });
      return true;
    }
    function pickHanuman() {
      if (phase !== 'hanHold' || hanX.on || hanX.released || stand.k < 0.9) return false;
      hanStart();
      return true;
    }
    function hanStart() {
      if (hanX.on || !kit) return;
      const run = ++hanX.run;
      const at = (t, fn) => after(t, () => { if (run === hanX.run && hanX.on) fn(); });
      hanX.on = true; hanX.released = false; hanX.tries = 0;
      kit.root(true); kit.objective(null);
      if (kit.waypoint) kit.waypoint(null);
      standShow(false, true);                                         // from the velvet into his hand
      hanHeldShow('hand');
      setPhase('hanHold', 'held'); kit.objective(null);
      // THE WEIGHT OF IT
      if (worldSfx) worldSfx('h4rumble', 0.7, 1, 0);
      kit.tremble(0.18, { secs: 0.5 });
      hanX.glintT = 0;
      at(0.6, () => {                                                 // THE SURGE
        kit.daylight(H_GOLD, 0.9);
        hanX.goldTo = 1; hanX.embTo = 1;
        if (worldSfx) { worldSfx('h4surge', 0.75, 1, 0); worldSfx('h4rattle', 0.55, 1, panAt(HX + H.LPT.x, H.LPT.z)); worldSfx('h4embers', 0.5, 1, 0); }
        kit.tremble(0.5, { secs: 0.6 });
        if (kit.pulse) kit.pulse({ bpm: 98, secs: 0.8, erratic: 0.1, sound: 'y4heart', vol: 0.5, kick: true });
      });
      at(1.8, () => {                                                 // THE ROAR, IN HIS MIND
        if (worldSfx) { worldSfx('h4roarin', 0.95, 1, 0); worldSfx('h4ring', 0.7, 1, 0); }
        if (kit.flash) kit.flash({ color: 'rgba(255,200,96,0.6)', secs: 0.7 });
        hanX.ring = 0; hanX.kick = 0.075; hanX.uwTo = 1;
        if (kit.smear) kit.smear(0.55, { secs: 0.25 });
        kit.tremble(0.95, { secs: 0.25 });
        if (kit.pulse) kit.pulse({ kick: true });
      });
      at(2.2, () => { visShow(true); if (worldSfx) worldSfx('h4embers', 0.42, 0.9, 0); });   // THE VISION
      at(2.7, () => { if (kit.smear) kit.smear(0.2, { secs: 1.2 }); kit.tremble(0.55, { secs: 1.0 }); });
      at(3.4, () => queueLine('z4roar'));
      at(4.0, () => {                                                 // THE URGE
        hanHeldShow('clasp');
        if (kit.pray) kit.pray(true, { secs: 0.9, y: -0.33 });
        // (no presence drain here — CP7: its banner lay across the vision's face on a phone, and it went on charging
        // while he read the brief; the urge's price is the LET GO itself)
        hanX.fovTo = 1;
        if (kit.pulse) kit.pulse({ bpm: 128, secs: 6, erratic: 0.25 });
      });
      at(5.0, () => { if (kit.hands) kit.hands(0.28, { secs: 3.5 }); kit.tremble(0.7, { secs: 2.0 }); });
      at(5.2, () => { queueLine('z4urge'); queueFn(() => hanLetGo(run)); });
    }
    function hanLetGo(run) {
      if (run !== hanX.run || !hanX.on || hanX.released || !kit) return;
      const first = hanX.tries === 0;
      // when the window comes is not his to know: 1.0–2.4 s, a different moment each try; it stays open 0.75 s
      // (2.5–3.9 s: the pull's take peaks 2.5 s in, and cued from START it must peak INSIDE the window — CP11: with
      // 1.0–2.4 it peaked after the window had closed in half the tries)
      const open = 2.5 + 1.4 * hash(hanX.run * 7 + hanX.tries, 59);
      kit.event({
        kind: 'timed', label: W.evLetGo, brief: first ? W.evLetGoBrief : undefined, demo: 'wait', low: true,
        waitWord: W.evLetGoWait, goWord: W.evLetGoGo, open, close: open + 0.75, guard: 0.35,   // (a double tap on START is not a press)
        // the pull builds to its peak 2.5 s into its take: cued so the peak lands on LET GO
        onBegin: () => after(Math.max(0, open - 2.5), () => { if (run === hanX.run && hanX.on && worldSfx) worldSfx('h4pull', 0.72, 1, 0); })
      }).then(r => {
        if (r && r.aborted) return;                                 // (a faint: nothing paid, no retry)
        if (run !== hanX.run || !hanX.on || hanX.released) return;
        if (r && r.ok) { kit.conduct({ s: 3, note: W.noteLetGo }); hanRelease(run); return; }
        hanX.tries++;
        const early = !!(r && r.early);
        // too soon: its grip tightens (the hands pulled further); too late: it surges (the gold, the buzz) — either
        // costs him, and it comes again
        kit.award('sanity', early ? -4 : -6, { minigame: true });
        if (kit.flash) kit.flash({ color: 'rgba(255,190,80,0.45)', secs: 0.5 });
        if (worldSfx) worldSfx(early ? 'h4rattle' : 'h4surge', 0.62, 1, 0);
        if (kit.pulse) kit.pulse({ kick: true });
        if (kit.hands) { kit.hands(0.46, { secs: 0.4 }); after(0.9, () => { if (run === hanX.run && !hanX.released && kit.hands) kit.hands(0.3, { secs: 1.2 }); }); }
        kit.tremble(1.1, { secs: 0.2 }); after(0.6, () => { if (run === hanX.run && !hanX.released) kit.tremble(0.75, { secs: 0.6 }); });
        hanX.kick = 0.04;
        // (paid in the same moment the bookmark moves to 'done': CP11 paid it 0.8 s before, inside an autosave's reach)
        if (hanX.tries >= 3) { after(0.8, () => { if (run !== hanX.run || hanX.released) return; kit.conduct({ s: -3, note: W.noteLate, minigame: true }); hanRelease(run); }); return; }
        after(1.4, () => hanLetGo(run));
      });
    }
    function hanRelease(run) {
      if (run !== hanX.run || hanX.released || !kit) return;
      hanX.released = true;
      // his hands open and it falls onto the glass, lying where it fell
      if (kit.hands) kit.hands(0, { secs: 0.25 });
      if (kit.pray) kit.pray(false, { secs: 0.5 });
      hanHeldShow(null);
      dropShow(true);
      if (worldSfx) { worldSfx('h4clatter', 0.8, 1, panAt(HX + H.LPT.x, H.LPT.z)); worldSfx('h4burst', 0.85, 1, 0); }
      if (kit.flash) kit.flash({ color: 'rgba(255,236,190,0.7)', secs: 0.45 });
      hanX.vis.burst = 0.0001;                                       // the vision bursts into embers and is gone
      hanX.embTo = 0; hanX.goldTo = 0; hanX.silent = 1; hanX.fovTo = 0;
      kit.tremble(0, { secs: 0.4 });
      if (kit.smear) kit.smear(0, { secs: 0.6 });                     // (CP11: left at 0.2 into World T, a minute of trails)
      if (kit.pulse) kit.pulse({ bpm: 84, secs: 2.5, erratic: 0 });
      after(0.45, () => { if (run !== hanX.run) return; hanX.silent = 0; hanX.uwTo = 0; kit.daylight(H_DAY, 1.6); });
      after(3.0, () => { if (run === hanX.run && kit.pulse) kit.pulse({ vol: 0.2 }); });
      after(5.0, () => { if (run === hanX.run && kit.pulse) kit.pulse(null); });
      setPhase('hanHold', 'done'); kit.objective(null);
      queueGap(1.1);
      queueLine('ow4ok', () => personTalk(hLive.owner, SECS.ow4ok));
      queueLine('z4go', () => after(SECS.z4go + 0.3, () => runOut()));
    }
    function runOut() {
      if (phase !== 'hanHold' || !kit) return;
      hanX.on = false;
      const done = () => { runEnd(); toWorld('T', false); };
      if (!kit.film || !kit.film('runout', { onDone: done })) done();
    }
    /* World H as a Continue finds it (§8): before the owner calls, the stand empty; after, the piece on its stand; once
       it has been let go, the piece lying on the glass and his last words still to say, then the run (the film is never
       resumed half-way either) */
    function hEnter(at, tag) {
      hanReset();
      if (at === 'hanHold' && tag !== 'done') standShow(true, true);
      // (his last words and the run are queued once, by toWorld after its warm: CP11 queued them here too, so a Continue
      // said 'I have to go' twice and, on a slow phone, ran the film under the black)
      if (at === 'hanHold' && tag === 'done') { hanX.released = true; dropShow(true); }
    }
    function hanReset() {
      hanX.run++;
      Object.assign(hanX, { on: false, released: false, shown: false, tries: 0, uw: 0, uwTo: 0, gold: 0, goldTo: 0, emb: 0, embTo: 0,
                            glintT: -1, ring: -1, fovK: 0, fovTo: 0, silent: 0 });
      if (hanX.kick || hanX.kickWas) { pitch.rotation.x -= hanX.kickWas; hanX.kick = hanX.kickWas = 0; }
      Object.assign(hanX.vis, { on: false, t: 0, placed: false, burst: 0 });
      hanVis.visible = visHalo.visible = visEmb.visible = false;
      hanHeldShow(null);
      standShow(false, true); dropShow(false);
      glint.visible = false; hRing.visible = false; for (const e of hEmb) e.sp.visible = false;
      for (const m of hanMats) m.emissiveIntensity = 0;
      if (camera.fov !== BASE_FOV && getState() !== 'cine') { camera.fov = BASE_FOV; camera.updateProjectionMatrix(); }
      hAmb.at = 0; hAmb.seed = 0;
      mixH.air = mixH.walla = mixH.mall = mixH.radio = 0;
      runLive.on = false; hLive.look = false; doorsTo(0);
    }

    /* ============================================== THE RUN-OUT (kit.film('runout'), 23.2 s)
       Every picture a function of the film's clock (runFrame), so a seek, a skip and a slow phone land on the same
       frame (the merit film's shape); his own start (where he stood when he let go) is read once, at its first frame.
         R1 0–3.5    the whip-turn from the counter, and out through the door — the leaves swinging out, the shop's bell
         R2 3.5–7.9  from the corridor, back through the open door: the staff man and the customers turned to it; the
                     staff man, "Boss... what happened to him?"
         R3 7.9–12.8 his eyes, running west down the corridor; a shopper coming the other way steps back against the
                     shopfronts and turns to watch him go, a column at his left shoulder
         R4 12.8–23.2 the corridor's end: the lifts and the mall's directory — he stops, bent over, out of breath, and
                     lifts his head; "I couldn't let anyone see me like that. Not again. Not in public." Black. */
    const RF = { whip0: 0.15, whip1: 0.75, out: 3.5, stare1: 7.9, acc: 8.4, coast: 11.32, stop: 12.82, bend: 14.2, up0: 17.2, up1: 19.4, end: 23.2,
                 x0: HX - 1.8, run: 0, vmax: 2.4, stopX: 0, stopZ: 2.45 };
    const runLive = { on: false, p0: null, path: null, shot: '' };
    const angTo = (a, b) => Math.atan2(Math.sin(b - a), Math.cos(b - a));
    function runBegin() {
      runLive.on = true; hLive.look = true; runLive.shot = '';
      runLive.p0 = { x: yaw.position.x, z: yaw.position.z, y: yaw.rotation.y, p: pitch.rotation.x };
      runLive.path = new THREE.CatmullRomCurve3([new THREE.Vector3(yaw.position.x, 0, yaw.position.z), new THREE.Vector3(HX + 0.35, 0, -1.0),
                                                 new THREE.Vector3(HX + 0.02, 0, 0.12), new THREE.Vector3(HX - 0.9, 0, 1.75)], false, 'centripetal');
      personTalk(hLive.owner, 2.4);
    }
    function runEnd() {
      runLive.on = false; hLive.look = false; runLive.shot = '';
      doorsTo(0);
      camera.rotation.z = 0;
      for (let i = 0; i < hLive.cust.length; i++) { const P = hLive.cust[i]; if (P) P.group.rotation.y = CUST[i].ry; }
    }
    function hSet(x, y, z, ry, px, roll) {
      yaw.position.set(x, y, z); yaw.rotation.y = ry; pitch.rotation.x = px; camera.rotation.z = roll || 0;
    }
    function hAim(x, y, z, tx, ty, tz, roll) {
      const dx = tx - x, dy = ty - y, dz = tz - z;
      hSet(x, y, z, Math.atan2(-dx, -dz), Math.atan2(dy, Math.hypot(dx, dz)), roll);
    }
    function runDist(t) {                                            // metres run west down the corridor by film time t
      const a = RF.acc - RF.stare1, c = RF.coast - RF.acc, d = RF.stop - RF.coast, v = RF.vmax;
      const u = t - RF.stare1;
      if (u <= 0) return 0;
      if (u < a) return 0.5 * v * u * u / a;
      if (u < a + c) return 0.5 * v * a + v * (u - a);
      const w = Math.min(d, u - a - c);
      return 0.5 * v * a + v * c + v * w - 0.5 * v * w * w / d;
    }
    function walkerFilm(t) {
      const P = hLive.walker; if (!P || !P.ready) return;
      // out of the lift lobby at the corridor's west end, east along the shopfronts' side; he steps back against them as
      // the running man comes at him and turns his head to follow him past
      const x = -9.6 + 1.15 * (t - RF.stare1), aside = smooth(cl01((t - 9.0) / 0.7)) * (1 - smooth(cl01((t - 11.4) / 1.0)));
      P.group.visible = x > -13.4;
      P.group.position.set(x, 0, 1.45 - 0.75 * aside);
      P.group.rotation.y = Math.PI / 2 - 0.5 * aside;
      if (P.idle && hLive.walkDur) P.idle.setEffectiveTimeScale((1 - 0.6 * aside) * WALK.v * hLive.walkDur / WALK.stride);
    }
    function runFrame(t, api) {
      if (!runLive.on) runBegin();
      if (api && api.handsRoot) api.handsRoot.visible = false;
      if (api && api.armR) api.armR.visible = false;
      // the door, pushed open as he reaches it, standing open through the stare, back on its closer after
      doorsTo(t < 2.25 ? 0 : t < 2.7 ? smooth((t - 2.25) / 0.45) : t < 8.0 ? 1 : 1 - 0.85 * smooth(cl01((t - 8.0) / 2.6)));
      walkerFilm(t);
      // the customers turn to the door as he runs out of it (and stay turned)
      for (let i = 0; i < hLive.cust.length; i++) {
        const P = hLive.cust[i]; if (!P) continue;
        const c = CUST[i], want = Math.atan2(0 - c.x, 0.2 - c.z), k = smooth(cl01((t - 1.0) / 1.2));
        P.group.rotation.y = c.ry + angTo(c.ry, want) * k;
      }
      const P0 = runLive.p0;
      if (t < RF.out) {
        runLive.shot = 'R1';
        const doorYaw = Math.atan2(-(HX - P0.x), -(0.2 - P0.z));
        if (t < RF.whip1) {
          const k = cl01((t - RF.whip0) / (RF.whip1 - RF.whip0)), e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
          hSet(P0.x, 1.6, P0.z, P0.y + angTo(P0.y, doorYaw) * e, P0.p + (-0.03 - P0.p) * e, 0);
        } else {
          const u = cl01((t - RF.whip1) / (RF.out - RF.whip1)), e = u < 0.3 ? u * u / 0.6 : u - 0.15;   // a quick start, then running
          const s = Math.min(1, e / 0.85), p = runLive.path.getPointAt(s), tg = runLive.path.getTangentAt(Math.min(0.999, s + 0.04));
          const yawRun = doorYaw + angTo(doorYaw, Math.atan2(-tg.x, -tg.z)) * smooth(cl01(u * 2.2));
          const ph = (t - RF.whip1) * Math.PI * 2.7;
          hSet(p.x, 1.6 - 0.02 * cl01(u * 4) + 0.032 * Math.abs(Math.sin(ph)), p.z, yawRun + 0.03 * Math.sin(ph * 0.5), -0.03 - 0.02 * smooth(cl01(u * 3)),
               0.016 * Math.sin(ph * 0.5));
        }
      } else if (t < RF.stare1) {
        runLive.shot = 'R2';
        // from the corridor, looking back in through the open door: the staff man and the woman at his counter
        const k = smooth(cl01((t - RF.out) / (RF.stare1 - RF.out)));
        hAim(HX + 1.6 - 0.25 * k, 1.5, 1.95 - 0.3 * k, HX - 3.0, 1.32, -2.45);
      } else if (t < RF.stop) {
        runLive.shot = 'R3';
        const d = runDist(t), ph = (t - RF.stare1) * Math.PI * 2.8, run = cl01((RF.stop - t) / 1.2);
        const x = RF.x0 - d, z = 1.9 + (RF.stopZ - 1.9) * cl01(d / RF.run);
        // a glance at the shopper as he goes past him (to his right)
        const glance = -0.32 * smooth(cl01((t - 9.5) / 0.5)) * (1 - smooth(cl01((t - 10.6) / 0.6)));
        hSet(x, 1.6 + run * (0.034 * Math.abs(Math.sin(ph)) - 0.015), z, Math.PI / 2 + glance + run * 0.035 * Math.sin(ph * 0.5), -0.04, run * 0.018 * Math.sin(ph * 0.5));
      } else {
        runLive.shot = 'R4';
        // stopped; bent over, the floor's tiles; his breath; then his head up — the lifts, the mall's directory
        const bend = smooth(cl01((t - RF.stop) / (RF.bend - RF.stop))), up = smooth(cl01((t - RF.up0) / (RF.up1 - RF.up0)));
        const pant = Math.sin((t - RF.stop) * Math.PI * 2 * (1.5 - 0.6 * cl01((t - RF.stop) / 8))) * (0.014 - 0.008 * up);
        const y = 1.6 - 0.32 * bend + 0.22 * up + pant, px = -0.04 - 0.66 * bend + 0.6 * up;
        hSet(RF.stopX, y, RF.stopZ, Math.PI / 2 - 0.06 * bend + 0.04 * up, px, 0.012 * Math.sin((t - RF.stop) * 1.7) * (1 - up));
      }
    }
    RF.run = runDist(RF.stop); RF.stopX = RF.x0 - RF.run;            // where the run ends is where the corridor's end shot stands
    const runCtl = { begin: runBegin, end: runEnd, frame: runFrame, F: RF, staffSays: () => personTalk(hLive.staff, SECS.sm4what) };

    /* ============================================== THE TRAY SHOP, PLAYED (CP8, docs/V22.0-E3C4-PLAN.md §4.4)
       He comes in out of the run and the owner has tea on. The order is to sit at the counter — the stool's glow, or a
       press. Seated (the stool's own height, drawn up to the counter; his look his own through the stool's swing), the
       owner tells him what he has noticed and slides the tray across: three pieces on red velvet — CHAD'S lersi amulet
       at every triangle on a teak foot, CHAD'S Thao Wessuwan as a small red figure, and (v22.1, Chad's call) a naga
       crystal ball on a gilt lotus stand with CHAD'S naga coiled inside it. Each is pressed (or tapped), taken in his
       hand and ANSWERED, and every answer STAYS behind him:
         THE LERSI — the fans wind down and the clock's tick slows, incense smoke rises round the counter out of nothing,
           dry leaves come down out of the ceiling, the light goes amber, a deep OM under a forest at night; behind him
           the old hermit's face forms in the air of the shop, amber, two metres tall (cut out of the amulet itself).
         THAO WESSUWAN — four steps down the street, each one nearer and heavier, the lens and the cups shaking, the
           lamps swinging, dust out of the joists, the sun on the floor going out step by step; the light goes red-gold,
           and in the road outside the open front a giant stands — his legs like pillars, the rest of him above the shop.
         THE NAGA CRYSTAL BALL — the naga inside it wakes, teal, turning; then water all round, the room under it: light
           rippling over the floor, the walls and the ceiling, drops rising UPWARD past him, the light going teal, a long
           hiss; a jade serpent (the same scan) comes in off the street across the floor behind him and rears.
       The view is DRAWN ROUND to each as it comes, held while he speaks, and given back (e3c3's seated turn: the stool's
       swing re-aimed every frame through kit.pose('lying')). Each presence stays, fainter; the light goes back to the
       afternoon; the piece is set back on the velvet. Then the fourth piece, in faded red cloth, unwrapped by the owner;
       THE CLOCK STOPS mid-swing and with it everything — the fans, the smoke in the air, the flames, the dust in the sun;
       the street goes silent and the music under it; the three behind him brighten and go still, and the view is drawn
       round to them; a pressure in the ears; "Everything went quiet. Even them." — and the decision opens by itself.
       Every number eased on wall time (the v7.4 law); every beat cancelled by a reset or a second start (`run`). An
       experience is never resumed half-way (§8): a Continue lands with the piece back on the velvet. */
    const TS = { x: TSTOOL.x, z: TSTOOL.z - 0.18 };              // his eye, seated: the stool drawn up to the counter
    const T_SEAT = { lo: -0.95, hi: 0.55, span: 2.9, pitch: -0.42 };   // seated, the stool swings nearly all the way round
    /* (CP8, photographed on a phone: at the tray's pitch the owner's face sat under the stat bars for every word he
       said.) The view is drawn to whoever speaks: up to his face for his lines (T_OWN puts it a third of the way down a
       phone, under the objective box), down to the tray when a piece is to be taken, down to the open bundle as the
       decision opens (tDec(): the piece above a phone's decision panel) */
    const T_OWN = -0.08;
    /* (CP8, photographed: at −0.6 the open bundle sat at the middle of a phone's screen — under the top edge of the
       decision panel, which covers its lower 57 %. On an upright screen the eye goes down far enough to hold the piece in
       the top third, above the panel; on a wide one the panel sits low and the owner stays in the frame) */
    const tDec = () => (camera.aspect < 1 ? -0.9 : -0.6);
    const eyeYaw = (x, z) => Math.atan2(-(x - TS.x), -(z - TS.z));
    const eyePitch = (x, y, z) => Math.atan2(y - TSEAT.eye, Math.hypot(x - TS.x, z - TS.z));
    /* the shop's light, three times answered and once stopped (kit.daylight eases the afternoon into each and back; five
       stops each, as T_DAY has, so the sky through the front tweens rather than snaps) */
    /* (CP8, photographed on a phone twice: at hemi 0.42 / key 0.55 the room under the Lersi read as the plain afternoon —
       the shop's own warm plaster and teak hid a dim orange, where the red and the teal, each as strong as the day, were
       unmistakable. Amber is as strong as they are now, and GOLD where the giant's is red: an oil lamp in a forest) */
    const T_AMBER = { stops: [[0.00, '#e0a048'], [0.12, '#c4822e'], [0.35, '#8a5420'], [0.65, '#523014'], [1.00, '#2a1808']],
      bg: 0x6a4418, fog: [0x7a4c1a, 0.042], hemi: [0xffc060, 0x3a2008, 0.8], key: [0xffb040, 0.95, -3, 6, 8], fill: [0xd08a28, 0.3],
      stars: 0, moon: 0, sun: 0, clouds: 0, vmHemi: [0xffc468, 0x3a2008, 0.82], vmKey: [0xffb048, 0.72] };
    const T_RED = { stops: [[0.00, '#ffa064'], [0.12, '#ec7a44'], [0.35, '#bc4c2c'], [0.65, '#7c2c1c'], [1.00, '#4c1810']],
      bg: 0x8c3a22, fog: [0x8c3a22, 0.014], hemi: [0xff9a6a, 0x4a1a0a, 0.78], key: [0xff7444, 0.92, -3, 6, 8], fill: [0xff6030, 0.26],
      stars: 0, moon: 0, sun: 0, clouds: 0, vmHemi: [0xff9a6a, 0x4a1a0a, 0.82], vmKey: [0xff7444, 0.76] };
    const T_TEAL = { stops: [[0.00, '#7adcc8'], [0.12, '#4abcb0'], [0.35, '#2a8c8c'], [0.65, '#1a5c66'], [1.00, '#0a3040']],
      bg: 0x1a5c66, fog: [0x1a6670, 0.035], hemi: [0x8af0e0, 0x0a2a30, 0.62], key: [0x6ae0d0, 0.56, -3, 6, 8], fill: [0x40c0c0, 0.32],
      stars: 0, moon: 0, sun: 0, clouds: 0, vmHemi: [0x8af0e0, 0x0a2a30, 0.7], vmKey: [0x6ae0d0, 0.56] };
    const T_STILL = { stops: [[0.00, '#c8c4bc'], [0.12, '#b8b4ac'], [0.35, '#9a9890'], [0.65, '#7a7872'], [1.00, '#5a5854']],
      bg: 0x9a968e, fog: [0x8a8680, 0.02], hemi: [0xe0ddd4, 0x2c2824, 0.6], key: [0xd8d4ca, 0.55, -3, 6, 8], fill: [0xb0b4c0, 0.2],
      stars: 0, moon: 0, sun: 0, clouds: 0, vmHemi: [0xe0ddd4, 0x2c2824, 0.66], vmKey: [0xd8d4ca, 0.55] };
    const ORDER = ['lersi', 'wess', 'naga'];
    const SLOT = { lersi: -0.135, wess: 0, naga: 0.135 };      // across the tray, left to right as he sees it
    const tX = { run: 0, seated: false, on: '', trayIn: false, unknown: false, amber: 0, amberTo: 0, red: 0, redTo: 0, teal: 0, tealTo: 0,
                 silent: 0, silentTo: 0, tension: 0, fanTo: 1, tickTo: 1, sunK: 1, sunTo: 1, smokeK: 0, smokeTo: 0, leaves: 0,
                 caus: 0, causTo: 0, drops: 0, dropsTo: 0, lamp: 0, lampTo: 0, cupJ: 0, glow: 0, glowTo: 0, tea: 0, teaTo: 0,
                 dustT: 9, dustAmt: 0, shake: 0, shakeWas: { p: 0, r: 0 }, tray: { k: 0, to: 0, aside: 0, asideTo: 0 },
                 bundle: { on: false, t: 0, open: 0, openTo: 0 }, clasp: false, ut: 0 };

    /* ---- THE OWNER: the stand-in towkay (chapter 3's first owner, his own takes) behind his counter, facing the stool,
       his shoulders eased toward his body (chapter 3's armFix); a column so he is not walked through */
    tLive.owner = mkPerson('towkay', { parent: worldT, x: TOWN.x - TX, z: TOWN.z, ry: 0, height: 1.64, idle: 'Idle_9',
      talk: 'Talk_with_Hands_Open', talkWeight: 0.85, look: 1, armFix: { sh: 6, arm: 7 } });
    solids.push(hidBox(0.5, 1.6, 0.5, TOWN.x - TX, 0.8, TOWN.z, worldT));

    /* ---- THE STOOL'S GLOW: on the floor round his stool while it is the order (a press or a step into it sits him) */
    const tGlowW = tex(makeGlowTex(THREE, cnv, [255, 226, 170]));
    const zoneMat = new THREE.MeshBasicMaterial({ map: tGlowW, color: 0xffcf86, transparent: true, opacity: 0, depthWrite: false,
      blending: THREE.AdditiveBlending, fog: false, toneMapped: false }); mats.push(zoneMat);
    const tZone = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 1.3), zoneMat);
    tZone.rotation.x = -Math.PI / 2; tZone.position.set(TSTOOL.x - TX, 0.02, TSTOOL.z); tZone.renderOrder = 4; tZone.visible = false; worldT.add(tZone);

    /* ---- THE TRAY: teak, its rim, red velvet; the three pieces in their places across it. It waits under the counter's
       back edge on the owner's side and is slid across to him on "Here. Hold them" */
    const mTrayTeak = M({ map: tex(makeTeak(THREE, cnv, 4183)), color: 0x6a4228, roughness: 0.4 });
    const mTrayVel = M({ color: 0x74101a, roughness: 0.95 });
    const trayG = new THREE.Group(); trayG.visible = false; worldT.add(trayG);
    box(TTRAY.w, 0.014, TTRAY.d, 0, 0.007, 0, mTrayTeak, trayG, false);
    box(TTRAY.w - 0.03, 0.006, TTRAY.d - 0.03, 0, 0.017, 0, mTrayVel, trayG, false);
    for (const s of [-1, 1]) {
      box(TTRAY.w, 0.026, 0.015, 0, 0.013, s * (TTRAY.d / 2 - 0.0075), mTrayTeak, trayG, false);
      box(0.015, 0.026, TTRAY.d - 0.03, s * (TTRAY.w / 2 - 0.0075), 0.013, 0, mTrayTeak, trayG, false);
    }
    const PAD_Y = 0.02;                                          // the velvet's top
    const pcG = {};
    for (const k of ORDER) { const g = new THREE.Group(); g.position.set(SLOT[k], PAD_Y, 0); trayG.add(g); pcG[k] = g; }
    box(0.046, 0.01, 0.028, 0, 0.005, -0.004, mTrayTeak, pcG.lersi, false);     // the Lersi's foot, a teak block it stands in

    /* ---- THE NAGA CRYSTAL BALL (v22.1, Chad: "Instead of a naga on the tray, replace that naga with a naga crystal
       ball, the naga model can still appear as special effect"). A ball of pale sea-green crystal, 5.2 cm across, on a
       small gilt lotus stand, and inside it CHAD'S naga coiled on itself with its head raised, pale as the etching in a
       crystal — the way such a ball is kept (แก้วพญานาค, the naga's crystal). The glass is DRAWN, never lit: two painted
       matcaps (its body, then its skin laid on additively), unlit and untoned, so no light is added, and no refraction
       pass (that would draw the whole shop a second time on a phone). In his hands the naga inside wakes — teal,
       brighter, turning slowly, a glow at its heart — and the serpent that comes in off the street behind him is the
       same scan, six metres long. He lifts the ball off its stand; the stand stays on the velvet. */
    const BALL_R = 0.026, BALL_K = 1.22;                         // the coiled naga inside: 1.22 of the ball's radius across
    const BALL_SIT = 0.0137 + Math.sqrt(BALL_R * BALL_R - 0.0135 * 0.0135);   // resting on the cup's rim (its radius 13.5 mm, its height 13.7)
    const tBallBody = tex(makeCrystalBodyT(THREE, cnv)), tBallSkin = tex(makeCrystalSkinT(THREE, cnv)), tBallCore = tex(makeGlowTex(THREE, cnv, [255, 255, 255]));
    const ballGeo = new THREE.SphereGeometry(1, 64, 48);
    const lotusGeo = new THREE.LatheGeometry([[0.0001, 0], [0.0165, 0], [0.0172, 0.0012], [0.0168, 0.0026], [0.0135, 0.0036], [0.0085, 0.0048], [0.0072, 0.0068],
      [0.0082, 0.0086], [0.0115, 0.0108], [0.0138, 0.0128], [0.0142, 0.0136], [0.0128, 0.0139]].map(([r, y]) => new THREE.Vector2(r, y)), 40);
    const petalGeo = new THREE.SphereGeometry(1, 12, 8);
    owned.push({ dispose: () => { ballGeo.dispose(); lotusGeo.dispose(); petalGeo.dispose(); } });
    function crystalBall(r) {
      const g = new THREE.Group();
      const body = new THREE.Mesh(ballGeo, new THREE.MeshMatcapMaterial({ matcap: tBallBody, transparent: true, opacity: 0.74, depthWrite: false, fog: false, toneMapped: false }));
      const skin = new THREE.Mesh(ballGeo, new THREE.MeshMatcapMaterial({ matcap: tBallSkin, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false, toneMapped: false }));
      const core = new THREE.Sprite(new THREE.SpriteMaterial({ map: tBallCore, color: 0x6affd2, transparent: true, opacity: 0, depthWrite: false,
        blending: THREE.AdditiveBlending, fog: false, toneMapped: false }));
      body.scale.setScalar(r); skin.scale.setScalar(r);
      core.scale.setScalar(r * 2.2); core.visible = false;
      // drawn in this order, none writing depth: the body, then the naga inside adding its light over it, its heart, the skin
      body.renderOrder = 60; core.renderOrder = 62; skin.renderOrder = 63;
      for (const m of [body, skin]) { m.castShadow = false; m.receiveShadow = false; }
      mats.push(body.material, skin.material, core.material);
      const inner = new THREE.Group(); g.add(body, inner, core, skin);
      return { g, body, skin, core, inner, r, nm: null, U: null, face: 0, spin: 0 };
    }
    // the stand, on the velvet at the naga's place: a round foot, a neck, a cup, and ten petals round it leaning out
    const ballStand = new THREE.Group(); ballStand.position.set(SLOT.naga, PAD_Y, 0); trayG.add(ballStand);
    { const cup = new THREE.Mesh(lotusGeo, matGold); cup.castShadow = false; cup.receiveShadow = true; ballStand.add(cup);
      const pet = new THREE.InstancedMesh(petalGeo, matGold, 10), M4 = new THREE.Matrix4(), A = new THREE.Matrix4();
      for (let i = 0; i < 10; i++) {
        const a = i / 10 * Math.PI * 2;
        A.makeRotationY(a); M4.copy(A).multiply(new THREE.Matrix4().makeTranslation(0.0104, 0.0112, 0))
          .multiply(new THREE.Matrix4().makeRotationZ(-0.62)).multiply(new THREE.Matrix4().makeScale(0.0058, 0.0094, 0.0022));
        pet.setMatrixAt(i, M4);
      }
      pet.instanceMatrix.needsUpdate = true; pet.computeBoundingSphere(); pet.castShadow = false; pet.receiveShadow = true; ballStand.add(pet); }
    const ballTray = crystalBall(BALL_R); ballTray.g.position.y = BALL_SIT; pcG.naga.add(ballTray.g);
    const trayPlace = () => {
      const e = smooth(tX.tray.k), a = smooth(tX.tray.aside);
      trayG.position.set(TTRAY.x + 0.40 * a, TCNT.top, TCNT.z - 0.17 + (TTRAY.z - (TCNT.z - 0.17)) * e);
      trayG.visible = tX.tray.k > 0.001 || tX.trayIn;
    };
    trayPlace();

    /* ---- EACH PIECE IN HIS HAND: its own copy (its own materials, so it can be lit from within as it answers), hung in
       the arm's frame at the Yin locket's place (CP5e: chosen from photographs), each at the size a piece is held at.
       HOLD_T is for a probe (stage.trayTry) */
    const HOLD_T = {
      lersi: { pos: [0.018, 0.012, -0.19], tilt: -0.25, s: 0.085 },
      wess:  { pos: [0.02, -0.004, -0.205], tilt: -0.18, s: 0.06 },
      naga:  { pos: [0.02, -0.006, -0.2], tilt: -0.42, s: 0.052 }     // (v22.1: the crystal ball, built a unit across: 5.2 cm, the size it is on the velvet)
    };
    const PIECE_GLOW = { lersi: 0xffb060, wess: 0xff6a3a, naga: 0x6af0c8 };
    const heldG = {}, heldModel = {}, heldMats = { lersi: [], wess: [], naga: [] }, heldHalo = {};
    for (const k of ORDER) {
      const g = new THREE.Group(); g.visible = false; heldG[k] = g;
      const m = new THREE.Group(); m.scale.setScalar(HOLD_T[k].s); g.add(m); heldModel[k] = m;
      const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tGlowW, color: PIECE_GLOW[k], transparent: true, opacity: 0,
        depthWrite: false, blending: THREE.AdditiveBlending, fog: false })); mats.push(sp.material);   // depth-tested: the piece hides it where it stands
      sp.renderOrder = 49; sp.position.set(0, 0, -0.02); sp.scale.setScalar(0.12); g.add(sp); heldHalo[k] = sp;
    }
    const ballHeld = crystalBall(0.5); heldModel.naga.add(ballHeld.g);   // the ball in his hands (its naga lands with the scan)
    owned.push({ dispose: () => { for (const k of ORDER) if (kit && kit.holding && kit.holding() === heldG[k]) kit.hold(null); } });
    function glowMats(root, color, k) {
      root.traverse(q => {
        if (!q.isMesh) return;
        q.castShadow = false; q.receiveShadow = false;
        q.material = (Array.isArray(q.material) ? q.material : [q.material]).map(mt => {
          if (!mt || !mt.emissive) return mt;
          const c = mt.clone(); c.emissive.set(color); c.emissiveIntensity = 0; c.emissiveMap = c.map || null;
          heldMats[k].push(c); mats.push(c); return c;
        });
        if (q.material.length === 1) q.material = q.material[0];
      });
    }
    /* (CP8, photographed: hung at the Yin locket's place, each piece sat on his knuckles under a hand whose pose cannot
       close on it — a figure standing on the back of his fingers.) Now he takes each between his joined palms, the
       anjali kit.pray holds — the way a sacred piece is held to be felt — and it rises out of his fingertips, its face to
       him. CLASP is for a probe (stage.trayTry). */
    const CLASP = { lersi: { lift: 0.05, ahead: 0 }, wess: { lift: 0.065, ahead: 0 }, naga: { lift: 0.105, ahead: 0 }, y: -0.27 };   // (v22.1: the ball rides above his fingertips, never between his palms)
    function pieceShow(k, where) {
      pcG[k].visible = where !== 'hand';
      heldG[k].visible = where === 'hand';
      if (!kit || !kit.hold) return;
      if (where === 'hand') {
        if (kit.pray) { kit.pray(true, { secs: 0.7, y: CLASP.y }); tX.clasp = true; }
        kit.hold(heldG[k], { clasp: true, lift: CLASP[k].lift, ahead: CLASP[k].ahead });
      } else {
        if (kit.holding && kit.holding() === heldG[k]) kit.hold(null);
        if (tX.clasp && kit.pray) { kit.pray(false, { secs: 0.7 }); tX.clasp = false; }
      }
    }

    /* ---- THE PRESENCES: each one a scan drawn as a translucent figure in TWO passes (the Yin ghost's: its depth first,
       then its colour on that depth only, so its near side hides its far side — one figure, never its back blended
       through its front), unlit, its own map tinted; a halo of painted light behind it. Unlit and additive: no light, so
       the light count never changes (v15.1). They stand where they formed and stay, fainter, until the clock stops. */
    const LFACE = { x: -0.45, y: 1.85, z: -1.9, h: 2.1 };        // the hermit's face, behind him, in the air of the shop (local)
    const GIANT = { x: 0.3, z: 12.4, h: 11 };                     // the giant, in the road outside the open front
    const NAGA_END = { x: 0.85, z: -2.55, len: 6.8 };             // where the serpent's head comes to rest, 2.6 m behind him
    const PRES = {};
    for (const [k, rest, ph] of [['lersi', 0.3, 0.0], ['wess', 0.28, 1.7], ['naga', 0.3, 3.1]]) {
      const g = new THREE.Group(); g.visible = false; worldT.add(g);
      PRES[k] = { g, inner: null, mats: [], k: 0, to: 0, rest, ph, t: 0, ready: false, frozen: false, halo: null, haloPeak: 0, slide: null };
    }
    function ghostify(root, color, peak, list) {
      const pres = [];
      root.traverse(q => {
        if (!q.isMesh) return;
        const col = new THREE.MeshBasicMaterial({ map: (q.material && q.material.map) || null, color, transparent: true, opacity: 0,
          depthWrite: false, depthFunc: THREE.LessEqualDepth, fog: false });
        col.userData.peak = peak; mats.push(col); list.push(col);
        q.material = col; q.renderOrder = 41; q.castShadow = false; q.receiveShadow = false;
        const pre = new THREE.MeshBasicMaterial({ colorWrite: false, depthWrite: true, transparent: true, opacity: 1,
          polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 2 }); mats.push(pre);   // a hair behind: its colour always passes it
        const pm = new THREE.Mesh(q.geometry, pre); pm.renderOrder = 40;
        pm.position.copy(q.position); pm.quaternion.copy(q.quaternion); pm.scale.copy(q.scale); pres.push([q.parent, pm]);
      });
      for (const [par, pm] of pres) par.add(pm);
    }
    function presHalo(P, color, size, peak, x, y, z) {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(size, size), new THREE.MeshBasicMaterial({ map: tGlowW, color, transparent: true, opacity: 0,
        depthWrite: false, blending: THREE.AdditiveBlending, fog: false, toneMapped: false }));
      mats.push(m.material); m.renderOrder = 882; m.position.set(x, y, z); m.visible = false; worldT.add(m);   // after the spectres: hidden behind each, round it
      P.halo = m; P.haloPeak = peak;
    }
    /* (CP8, photographed: tinted flat and blended whole, the three read as pale stains — the hermit's face a cream blob
       with its features washed out, the giant a pair of legs under the shop's lintel.) Each is drawn now as a SPECTRE:
       its own map tinted, brightest at its edges (a rim — the surface turning away from the eye glows, the surface
       facing it lets the room through), unlit and untoned, so its colour is the one chosen. And they are VISIONS,
       drawn over the room as the Hanuman's was (CP7): the depth is cleared once the shop is drawn (`clearer`), then
       their own depth is laid, so each hides its own far side and the nearer of two hides the farther, and the shop's
       walls hide none of them — the giant is seen whole past the lintel, eleven metres tall in the road. */
    const presOver = new THREE.Group(); presOver.visible = false; worldT.add(presOver);
    { const cm = new THREE.MeshBasicMaterial({ colorWrite: false, depthWrite: false, depthTest: false, transparent: true }); mats.push(cm);
      const clearer = new THREE.Mesh(new THREE.PlaneGeometry(0.01, 0.01), cm);
      clearer.renderOrder = 879; clearer.frustumCulled = false; clearer.onBeforeRender = (r) => r.clearDepth(); presOver.add(clearer); }
    const L_LERSI = { tint: 0xffb064, rim: 0xffd890, pow: 1.9, body: 0.85, base: 0.42, rimA: 0.78, peak: 0.95 };
    const L_WESS  = { tint: 0xff8a66, rim: 0xff5a36, pow: 2.3, body: 0.9, base: 0.42, rimA: 0.7, peak: 0.85 };
    const L_NAGA  = { tint: 0x86ffd6, rim: 0xa8fff0, pow: 2.1, body: 0.9, base: 0.4, rimA: 0.72, peak: 0.85 };
    function spectral(root, L, list) {
      const pres = [];
      root.traverse(q => {
        if (!q.isMesh) return;
        const col = new THREE.MeshBasicMaterial({ map: (q.material && q.material.map) || null, color: L.tint, transparent: true, opacity: 0,
          depthWrite: false, depthFunc: THREE.LessEqualDepth, fog: false, toneMapped: false });
        const U = { uRim: { value: new THREE.Color(L.rim) }, uRimPow: { value: L.pow }, uBody: { value: L.body }, uBase: { value: L.base }, uRimA: { value: L.rimA } };
        col.onBeforeCompile = (sh) => {
          Object.assign(sh.uniforms, U);
          sh.vertexShader = 'varying vec3 vSpN;\nvarying vec3 vSpV;\n' + sh.vertexShader.replace('#include <project_vertex>',
            '#include <project_vertex>\n  vSpN = normalize(normalMatrix * normal);\n  vSpV = -mvPosition.xyz;');
          sh.fragmentShader = 'uniform vec3 uRim;\nuniform float uRimPow;\nuniform float uBody;\nuniform float uBase;\nuniform float uRimA;\nvarying vec3 vSpN;\nvarying vec3 vSpV;\n' +
            sh.fragmentShader.replace('#include <map_fragment>', '#include <map_fragment>\n  float spF = pow(1.0 - abs(dot(normalize(vSpN), normalize(vSpV))), uRimPow);\n' +
              '  diffuseColor.rgb = diffuseColor.rgb * uBody + uRim * spF;\n  diffuseColor.a = clamp(diffuseColor.a * (uBase + uRimA * spF), 0.0, 1.0);');
        };
        col.customProgramCacheKey = () => 'e3c4spectral';
        col.userData.peak = L.peak; mats.push(col); list.push(col);
        q.material = col; q.renderOrder = 881; q.castShadow = false; q.receiveShadow = false;
        const pre = new THREE.MeshBasicMaterial({ colorWrite: false, depthWrite: true, transparent: true, opacity: 1,
          polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 2 }); mats.push(pre);   // a hair behind: its colour always passes it
        const pm = new THREE.Mesh(q.geometry, pre); pm.renderOrder = 880;
        pm.position.copy(q.position); pm.quaternion.copy(q.quaternion); pm.scale.copy(q.scale); pres.push([q.parent, pm]);
      });
      for (const [par, pm] of pres) par.add(pm);
    }
    /* the hermit's FACE, cut out of the amulet's own light cut at run time: the front of its middle (every triangle in
       front of the backplate, inside the face's box — measured off the file, masters/v22.0/cp8), two metres tall, amber,
       with a thin additive shell over it */
    function lersiFace(lo) {
      let src = null; lo.scene.traverse(m => { if (m.isMesh && !src) src = m; });
      if (!src) return;
      const g = src.geometry, P = g.attributes.position, U = g.attributes.uv, I = g.index;
      const nT = (I ? I.count : P.count) / 3, keep = [];
      for (let t = 0; t < nT; t++) {
        const a = I ? I.getX(3 * t) : 3 * t, b = I ? I.getX(3 * t + 1) : 3 * t + 1, c = I ? I.getX(3 * t + 2) : 3 * t + 2;
        const cx = (P.getX(a) + P.getX(b) + P.getX(c)) / 3, cy = (P.getY(a) + P.getY(b) + P.getY(c)) / 3, cz = (P.getZ(a) + P.getZ(b) + P.getZ(c)) / 3;
        if (cz > 0.01 && Math.abs(cx) < 0.44 && cy > -0.75 && cy < 0.5) keep.push(a, b, c);
      }
      if (keep.length < 300) { console.warn('e3c4: the lersi face cut is empty', keep.length); return; }
      const N = g.attributes.normal;
      const pos = new Float32Array(keep.length * 3), uv = new Float32Array(keep.length * 2), nrm = new Float32Array(keep.length * 3);
      keep.forEach((v, j) => { pos[3 * j] = P.getX(v); pos[3 * j + 1] = P.getY(v); pos[3 * j + 2] = P.getZ(v); if (U) { uv[2 * j] = U.getX(v); uv[2 * j + 1] = U.getY(v); }
                               if (N) { nrm[3 * j] = N.getX(v); nrm[3 * j + 1] = N.getY(v); nrm[3 * j + 2] = N.getZ(v); } });
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); if (U) geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
      if (N) geo.setAttribute('normal', new THREE.BufferAttribute(nrm, 3)); else geo.computeVertexNormals();
      geo.computeBoundingSphere(); owned.push({ dispose: () => geo.dispose() });
      const Pz = PRES.lersi, s = LFACE.h / 1.25;
      const inner = new THREE.Group(); inner.scale.setScalar(s); inner.position.y = 0.125 * s; Pz.g.add(inner); Pz.inner = inner; Pz.s0 = s;
      const face = new THREE.Mesh(geo, src.material); inner.add(face);
      spectral(face, L_LERSI, Pz.mats);
      Pz.g.position.set(LFACE.x, LFACE.y, LFACE.z); Pz.g.rotation.y = Math.PI;
      presHalo(Pz, 0xffa040, 3.6, 0.32, LFACE.x, LFACE.y + 0.1, LFACE.z - 0.25);
      Pz.ready = true;
    }
    /* the naga laid flat: it was baked for a stair (v16.7: its body rises 32° toward its tail), so turned back about x by
       that slope it lies along the floor with its head still rearing; grounded on its own lowest point (measured off
       its vertices, never its box, which a turned box overstates) */
    const NAGA_FLAT = -0.575;
    function nagaFlat(src) {
      const w = new THREE.Group(), m = src.clone(true); w.add(m); m.rotation.x = NAGA_FLAT;
      w.updateMatrixWorld(true);
      const bb = new THREE.Box3().setFromObject(m, true);
      m.position.set(-(bb.min.x + bb.max.x) / 2, -bb.min.y, 0);
      return { w, m, bb, len: bb.max.z - bb.min.z };
    }
    /* CHAD'S naga COILED, for inside the crystal ball (v22.1): the scan laid flat, then every vertex carried onto a flat
       spiral that tightens toward the head — a point s along the body lands s along the spiral (its arc length tabled),
       each cross-section turned with the spiral's own heading, its height kept and lifted a little as it winds in — so
       the tail lies outside, the coils inside it, and the head rears up out of the middle. Bent once, at load, from the
       scan's own triangles; returned a unit across, centred, with the turn that faces its head to +z (toward him). */
    const COIL = { turns: 1.6, k: 0.6, rise: 0.06, n: 720 };
    function nagaCoil(src) {
      const t = nagaFlat(src); t.w.updateMatrixWorld(true);
      const L = t.len, z0 = t.bb.min.z, TH = COIL.turns * Math.PI * 2, N = COIL.n, K = COIL.k;
      const arc = new Float64Array(N + 1);
      for (let i = 1; i <= N; i++) { const u = (i - 0.5) / N; arc[i] = arc[i - 1] + Math.hypot((1 - K * u) * TH, K) / N; }
      const R0 = L / arc[N];
      const uAt = (sv) => { const a = sv * arc[N]; let lo = 0, hi = N;
        while (hi - lo > 1) { const md = (lo + hi) >> 1; if (arc[md] < a) lo = md; else hi = md; }
        return (lo + (a - arc[lo]) / Math.max(1e-12, arc[hi] - arc[lo])) / N; };
      const parts = []; let map = null;
      t.m.traverse(q => { if (q.isMesh) { parts.push(q); if (!map && q.material && q.material.map) map = q.material.map; } });
      let nv = 0, ni = 0;
      for (const q of parts) { const G = q.geometry; nv += G.attributes.position.count; ni += G.index ? G.index.count : G.attributes.position.count; }
      const pos = new Float32Array(nv * 3), nrm = new Float32Array(nv * 3), uv = new Float32Array(nv * 2);
      const idx = nv > 65535 ? new Uint32Array(ni) : new Uint16Array(ni);
      const v = new THREE.Vector3(), nn = new THREE.Vector3(), nmx = new THREE.Matrix3();
      let o = 0, oi = 0;
      for (const q of parts) {
        const G = q.geometry, P = G.attributes.position, Nm = G.attributes.normal, U = G.attributes.uv, I = G.index;
        nmx.getNormalMatrix(q.matrixWorld);
        for (let i = 0; i < P.count; i++) {
          v.fromBufferAttribute(P, i).applyMatrix4(q.matrixWorld);
          const u = uAt(Math.min(1, Math.max(0, (v.z - z0) / L))), th = TH * u, R = R0 * (1 - K * u), c = Math.cos(th), sn = Math.sin(th);
          const ph = Math.atan2(-R0 * K * c - R * TH * sn, -R0 * K * sn + R * TH * c), cp = Math.cos(ph), sp = Math.sin(ph), j = o + i;
          pos[3 * j] = R * c + v.x * cp; pos[3 * j + 1] = v.y + COIL.rise * L * u; pos[3 * j + 2] = R * sn - v.x * sp;
          if (Nm) { nn.fromBufferAttribute(Nm, i).applyMatrix3(nmx).normalize();
                    nrm[3 * j] = nn.x * cp + nn.z * sp; nrm[3 * j + 1] = nn.y; nrm[3 * j + 2] = -nn.x * sp + nn.z * cp; }
          if (U) { uv[2 * j] = U.getX(i); uv[2 * j + 1] = U.getY(i); }
        }
        if (I) for (let jj = 0; jj < I.count; jj++) idx[oi + jj] = I.getX(jj) + o; else for (let jj = 0; jj < P.count; jj++) idx[oi + jj] = o + jj;
        oi += I ? I.count : P.count; o += P.count;
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); geo.setAttribute('normal', new THREE.BufferAttribute(nrm, 3));
      geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2)); geo.setIndex(new THREE.BufferAttribute(idx, 1));
      geo.computeBoundingBox();
      const bb = geo.boundingBox, cx = (bb.min.x + bb.max.x) / 2, cy = (bb.min.y + bb.max.y) / 2, cz = (bb.min.z + bb.max.z) / 2;
      const ext = Math.max(bb.max.x - bb.min.x, bb.max.y - bb.min.y, bb.max.z - bb.min.z);
      geo.translate(-cx, -cy, -cz); geo.scale(1 / ext, 1 / ext, 1 / ext); geo.computeBoundingSphere();
      const th1 = TH, R1 = R0 * (1 - K);
      const face = -Math.atan2(-R0 * K * Math.cos(th1) - R1 * TH * Math.sin(th1), -R0 * K * Math.sin(th1) + R1 * TH * Math.cos(th1));
      return { geo, map, face };
    }
    /* the naga inside the glass: its own map read as LIGHT (its scales as brightness, never their colour), brightest at
       its edges, added over the ball's body — a white etching on the velvet, teal and alive in his hands */
    function crystalNaga(B, coil, k) {
      const U = { uTint: { value: new THREE.Color(0xc4dcd8) }, uRim: { value: new THREE.Color(0xe8fffa) } };
      const m = new THREE.MeshBasicMaterial({ map: coil.map || null, transparent: true, opacity: 0, depthWrite: false,
        blending: THREE.AdditiveBlending, fog: false, toneMapped: false });
      m.onBeforeCompile = (sh) => {
        Object.assign(sh.uniforms, U);
        sh.vertexShader = 'varying vec3 vCbN;\nvarying vec3 vCbV;\n' + sh.vertexShader.replace('#include <project_vertex>',
          '#include <project_vertex>\n  vCbN = normalize(normalMatrix * normal);\n  vCbV = -mvPosition.xyz;');
        sh.fragmentShader = 'uniform vec3 uTint;\nuniform vec3 uRim;\nvarying vec3 vCbN;\nvarying vec3 vCbV;\n' +
          sh.fragmentShader.replace('#include <map_fragment>', '#include <map_fragment>\n' +
            '  float cbL = dot(diffuseColor.rgb, vec3(0.3, 0.59, 0.11));\n' +
            '  float cbF = pow(1.0 - abs(dot(normalize(vCbN), normalize(vCbV))), 1.7);\n' +
            '  diffuseColor.rgb = uTint * (0.25 + 0.9 * cbL) + uRim * cbF;\n  diffuseColor.a *= 0.28 + 0.95 * cbF;');
      };
      m.customProgramCacheKey = () => 'e3c4crystalnaga';
      mats.push(m);
      const mesh = new THREE.Mesh(coil.geo, m); mesh.renderOrder = 61; mesh.castShadow = false; mesh.receiveShadow = false;
      mesh.scale.setScalar(k * B.r); B.inner.add(mesh);
      B.inner.rotation.y = coil.face; B.face = coil.face; B.nm = m; B.U = U;
    }
    /* every frame: the glass takes the room's light (it is painted, so it is told — the afternoon, the amber, the red,
       the teal, the stillness), and the naga inside wakes by `g` in his hands, turning slowly with a glow at its heart;
       once it has answered, the ball on the velvet keeps a little of it */
    const _bt = new THREE.Color(), _btA = new THREE.Color(1.0, 0.82, 0.6), _btR = new THREE.Color(1.0, 0.7, 0.6),
          _btT = new THREE.Color(0.62, 1.0, 0.94), _btS = new THREE.Color(0.8, 0.8, 0.8);
    const _bnW = new THREE.Color(0xc4dcd8), _bnT = new THREE.Color(0x58ffd0), _brW = new THREE.Color(0xe8fffa), _brT = new THREE.Color(0xa8fff0);
    function ballTick(wdt, g) {
      const frozen = !!tLive.frozen, after = held.has('naga');
      _bt.setRGB(1, 1, 1).lerp(_btA, 0.7 * tX.amber).lerp(_btR, 0.7 * tX.red).lerp(_btT, 0.75 * tX.teal);
      if (frozen) _bt.lerp(_btS, 0.6);
      const beat = 0.8 + 0.2 * Math.sin(tLive.t * 3.0);
      for (const B of [ballTray, ballHeld]) {
        const live = B === ballHeld ? g : (after ? 0.3 : 0);
        B.body.material.color.copy(_bt).multiplyScalar(0.94 + 0.45 * live);
        B.skin.material.color.copy(_bt);
        const co = B === ballHeld ? 0.7 * g * beat : 0.16 * live;
        B.core.visible = co > 0.004; B.core.material.opacity = co;
        if (!B.nm) continue;
        B.U.uTint.value.copy(_bnW).lerp(_bnT, Math.min(1, live * 1.5));
        B.U.uRim.value.copy(_brW).lerp(_brT, Math.min(1, live * 1.5));
        B.nm.opacity = 0.38 + 0.6 * live * (B === ballHeld ? beat : 1);
        if (!frozen) B.spin += wdt * (B === ballHeld ? 0.55 * g : 0.12 * live);
        B.inner.rotation.y = B.face + (B === ballHeld ? B.spin : 0.3 * Math.sin(B.spin * 2.4));
      }
      if (!frozen) ballHeld.g.position.y = 0.06 * g * Math.sin(tLive.t * 1.5);   // (a unit across: 3 mm of float as it answers)
    }

    /* the pieces' models: every one a clone of one parse (v15.0), the tray's and his hand's and the presence's */
    const L_S = 0.066;                                            // the Lersi on its foot: 6.6 cm (its file is 1.0 unit tall, centred)
    Promise.all([parseOnce('lersiamulet'), parseOnce('lersiamuletlod')]).then(([hd, lo]) => {
      if (!alive) return;
      let mat = null; hd.scene.traverse(m => { if (m.isMesh && !mat) mat = m.material; });
      if (mat) { mat.envMapIntensity = 0.35; for (const k of ['map', 'normalMap', 'roughnessMap', 'metalnessMap']) if (mat[k]) mat[k].anisotropy = 8; }
      const lod = new THREE.LOD();
      for (const [src, d] of [[hd.scene, 0], [lo.scene, 1.4]]) {
        const m = src.clone(true); m.scale.setScalar(L_S); m.position.y = 0.01 + L_S / 2;
        m.traverse(q => { if (!q.isMesh) return; q.castShadow = false; q.receiveShadow = true; if (d > 0 && mat) q.material = mat; });
        lod.addLevel(m, d);
      }
      pcG.lersi.add(lod);
      const h = hd.scene.clone(true); glowMats(h, PIECE_GLOW.lersi, 'lersi'); heldModel.lersi.add(h);
      lersiFace(lo);
    }).catch(err => { console.warn('the lersi amulet failed to load', err); ctx.loadFail && ctx.loadFail('lersiamulet', err); });
    const W_S = 0.07;                                             // the Thao Wessuwan on the velvet: 13 cm (its file 1.9 units, feet on 0)
    parseOnce('wessred').then(gl => {
      if (!alive) return;
      const m = gl.scene.clone(true); m.scale.setScalar(W_S);
      m.traverse(q => { if (q.isMesh) { q.castShadow = false; q.receiveShadow = true; } });
      pcG.wess.add(m);
      const h = gl.scene.clone(true); h.position.y = -0.951; glowMats(h, PIECE_GLOW.wess, 'wess'); heldModel.wess.add(h);   // held by its middle
      // THE GIANT: the same figure, eleven metres, red-gold, in the road
      const Pz = PRES.wess, gi = gl.scene.clone(true), s = GIANT.h / 1.902;
      gi.scale.setScalar(s); Pz.g.add(gi); Pz.inner = gi;
      spectral(gi, L_WESS, Pz.mats);
      Pz.g.position.set(GIANT.x, 0, GIANT.z); Pz.g.rotation.y = Math.PI;
      presHalo(Pz, 0xff5a2a, 11, 0.22, GIANT.x, 3.2, GIANT.z - 1.6);
      Pz.ready = true;
    }).catch(err => { console.warn('wessred failed to load', err); ctx.loadFail && ctx.loadFail('wessred', err); });
    parseOnce('naga').then(gl => {
      if (!alive) return;
      // INSIDE THE CRYSTAL BALL (v22.1): the scan coiled once and shared by the ball on the velvet and the ball in his
      // hands, each with its own material so each can be lit as it is
      const coil = nagaCoil(gl.scene); owned.push({ dispose: () => coil.geo.dispose() });
      crystalNaga(ballTray, coil, BALL_K); crystalNaga(ballHeld, coil, BALL_K);
      // THE SERPENT: 6.8 m, its head front on its group's origin, turned to come at him; jade
      const Pz = PRES.naga, n = nagaFlat(gl.scene);
      n.m.position.z = -n.bb.max.z;
      n.w.scale.setScalar(NAGA_END.len / n.len);
      const inner = new THREE.Group(); inner.rotation.y = Math.PI; inner.add(n.w); Pz.g.add(inner); Pz.inner = inner;
      spectral(n.m, L_NAGA, Pz.mats);
      Pz.g.position.set(NAGA_END.x, 0, NAGA_END.z);
      presHalo(Pz, 0x30ffc0, 4.2, 0.2, NAGA_END.x, 1.5, NAGA_END.z + 0.6);
      Pz.ready = true;
    }).catch(err => { console.warn('naga failed to load', err); ctx.loadFail && ctx.loadFail('naga', err); });
    function presShow(k, how, now) {
      const P = PRES[k];
      P.to = how === 'rest' ? P.rest : how === 'bright' ? 0.62 : how ? 1 : 0;
      if (now) P.k = P.to;
    }

    /* ---- WHAT EACH ANSWER DOES TO THE ROOM (built once; each driven from tPlayTick by its own number) */
    const tfx = new THREE.Group(); worldT.add(tfx);
    // THE CAUSTICS (the naga): light rippling over the floor, the walls and the ceiling — two layers of one drawn cell
    // pattern (tileable), in metres on every surface so a wall's cells are a floor's, drifting two ways
    const cTexA = tex(makeCausticT(THREE, cnv)), cTexB = tex(cTexA.clone()); cTexB.needsUpdate = true; cTexB.repeat.set(1.37, 1.37);
    const causMats = [], causMeshes = [];
    { const TW = TSHOP.x1 - TSHOP.x0, TD = TSHOP.z1 - TSHOP.z0, TH = TSHOP.H, cz = (TSHOP.z0 + TSHOP.z1) / 2;
      const plane = (w, h, x, y, z, rx, ry, map, ceilingOnly) => {
        const geo = new THREE.PlaneGeometry(w, h), uv = geo.attributes.uv;
        for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * w / 1.6, uv.getY(i) * h / 1.6);
        const m = new THREE.MeshBasicMaterial({ map, color: 0x5affe0, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending,
          fog: false, toneMapped: false }); m.userData.ceil = !!ceilingOnly; mats.push(m); causMats.push(m);
        const p = new THREE.Mesh(geo, m); p.position.set(x, y, z); p.rotation.set(rx, ry, 0, 'YXZ'); p.renderOrder = 3; p.visible = false; tfx.add(p); causMeshes.push(p);
      };
      for (const map of [cTexA, cTexB]) {
        plane(TW, TD, 0, 0.016, cz, -Math.PI / 2, 0, map);
        plane(TW, TD, 0, TH - 0.035, cz, Math.PI / 2, 0, map, true);
        plane(TD, TH, TSHOP.x0 + 0.012, TH / 2, cz, 0, Math.PI / 2, map);
        plane(TD, TH, TSHOP.x1 - 0.012, TH / 2, cz, 0, -Math.PI / 2, map);
        plane(TW, TH, 0, TH / 2, TSHOP.z0 + 0.012, 0, 0, map);
      } }
    // THE DROPS (the naga): rising past him from the floor to the ceiling
    const NDROP = LOW ? 60 : 110, dropSeed = [];
    for (let i = 0; i < NDROP; i++) { const a = hash(i, 201) * Math.PI * 2, rr = 0.45 + hash(i, 203) * 2.6;
      dropSeed.push([TS.x - TX + Math.cos(a) * rr, TS.z + Math.sin(a) * rr, hash(i, 207), 0.3 + hash(i, 209) * 0.5, hash(i, 211) * 6.28]); }
    const dropGeo = new THREE.BufferGeometry(); dropGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(NDROP * 3), 3));
    const dropMat = new THREE.PointsMaterial({ map: tGlowW, color: 0xa8fff0, size: 0.04, sizeAttenuation: true, transparent: true, opacity: 0,
      depthWrite: false, blending: THREE.AdditiveBlending, fog: false }); mats.push(dropMat);
    const dropsP = new THREE.Points(dropGeo, dropMat); dropsP.frustumCulled = false; dropsP.visible = false; tfx.add(dropsP);
    // THE DUST (the giant's steps): out of the joists, falling through the light
    const NDUST = LOW ? 90 : 170, dustSeed = [];
    for (let i = 0; i < NDUST; i++) dustSeed.push([-2.6 + hash(i, 221) * 5.2, -7.6 + hash(i, 223) * 6.4, 0.45 + hash(i, 227) * 0.8, hash(i, 229) * 6.28]);
    const dustGeo = new THREE.BufferGeometry(); dustGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(NDUST * 3), 3));
    const dustMat = new THREE.PointsMaterial({ map: tGlowW, color: 0xe6dccb, size: 0.026, sizeAttenuation: true, transparent: true, opacity: 0,
      depthWrite: false, fog: false }); mats.push(dustMat);
    const dustP = new THREE.Points(dustGeo, dustMat); dustP.frustumCulled = false; dustP.visible = false; tfx.add(dustP);
    // THE LEAVES (the Lersi): dry leaves out of the ceiling, falling with a flutter, lying where they land a while
    const leafMat = M({ map: tex(makeMLeaf(THREE, cnv)), color: 0xc89a5a, roughness: 0.85, alphaTest: 0.4, side: THREE.DoubleSide });
    const leafGeo = new THREE.PlaneGeometry(0.075, 0.075);
    const leaves = [];
    for (let i = 0; i < 28; i++) { const m = new THREE.Mesh(leafGeo, leafMat); m.visible = false; m.castShadow = false; tfx.add(m);
      leaves.push({ m, on: false, x: 0, y: 0, z: 0, vy: 0, ph: 0, landY: 0, life: 0 }); }
    let leafNext = 0, leafN = 0;
    // THE SMOKE (the Lersi): incense rising round the counter where there is no incense
    const lsmoke = [];
    for (let i = 0; i < 12; i++) {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(0.55, 1.2), new THREE.MeshBasicMaterial({ map: tLive.tSmoke, color: 0xdccfb8, transparent: true,
        opacity: 0, depthWrite: false, fog: false })); mats.push(m.material); m.visible = false; m.renderOrder = 5; tfx.add(m);
      const a = (i / 12) * Math.PI * 2 + hash(i, 233);
      lsmoke.push({ m, x: TS.x - TX + Math.cos(a) * (0.9 + hash(i, 235) * 1.3), z: TS.z - 0.3 + Math.sin(a) * (0.7 + hash(i, 237) * 1.2), ph: hash(i, 239) });
    }
    // THE STEAM off the two cups
    const steam = [];
    for (let i = 0; i < 4; i++) {
      const c = tLive.cups[i >> 1]; if (!c) continue;
      const m = new THREE.Mesh(new THREE.PlaneGeometry(0.07, 0.2), new THREE.MeshBasicMaterial({ map: tLive.tSmoke, color: 0xf2ece2, transparent: true,
        opacity: 0, depthWrite: false, fog: false })); mats.push(m.material); m.renderOrder = 5; m.visible = false; tfx.add(m);
      steam.push({ m, x: c.cup.position.x, z: c.cup.position.z, ph: i * 0.5, cup: i >> 1 });
    }

    /* ---- THE FOURTH PIECE: a bundle in faded red cloth (four flaps folded over a takrut — a rolled lead sheet scratched
       with script, bound in red string, the owner's own tag on it: "?"). It comes up from behind the counter's back edge,
       is set down before him where the tray was, and opens */
    const bundleG = new THREE.Group(); bundleG.visible = false; worldT.add(bundleG);
    const mCloth = M({ map: tex(makeOldCloth(THREE, cnv)), roughness: 0.95, side: THREE.DoubleSide });
    const B_W = 0.17;
    { const base = new THREE.Mesh(new THREE.PlaneGeometry(B_W, B_W), mCloth); base.rotation.x = -Math.PI / 2; base.position.y = 0.002; bundleG.add(base); }
    const flaps = [];
    for (let i = 0; i < 4; i++) {
      const hinge = new THREE.Group(); hinge.rotation.y = i * Math.PI / 2; bundleG.add(hinge);
      const piv = new THREE.Group(); piv.position.set(0, 0.003 + i * 0.0015, B_W / 2); hinge.add(piv);
      const f = new THREE.Mesh(new THREE.PlaneGeometry(B_W, B_W * 0.56), mCloth); f.rotation.x = -Math.PI / 2; f.position.z = B_W * 0.28; piv.add(f);
      flaps.push({ piv, shut: -(Math.PI - 0.42 + i * 0.05) });
    }
    { const tk = new THREE.Mesh(new THREE.CylinderGeometry(0.0105, 0.0105, 0.078, 16, 1), M({ map: tex(makeTakrutT(THREE, cnv)), color: 0x9a968e, roughness: 0.55, metalness: 0.45 }));
      tk.rotation.z = Math.PI / 2; tk.position.set(0, 0.0125, 0); bundleG.add(tk);
      const mString = M({ color: 0xa8141a, roughness: 0.7 });
      for (const x of [-0.024, 0, 0.024]) { const ring = new THREE.Mesh(new THREE.TorusGeometry(0.0113, 0.0012, 6, 20), mString); ring.rotation.y = Math.PI / 2; ring.position.set(x, 0.0125, 0); bundleG.add(ring); }
      const tag = new THREE.Mesh(new THREE.PlaneGeometry(0.036, 0.018), M({ map: tex(makeTagT(THREE, cnv)), roughness: 0.9 }));
      tag.rotation.set(-Math.PI / 2, 0, 0.35); tag.position.set(0.03, 0.004, 0.036); bundleG.add(tag); }
    /* (CP8) what the fourth piece gives off once the clock has stopped — the only thing in the shop still moving: a
       thin black smoke rising off the takrut, and a cold dull light under it (its own clock, tX.ut: the shop's stops) */
    const uSmoke = [];
    for (let i = 0; i < 6; i++) {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(0.09, 0.28), new THREE.MeshBasicMaterial({ map: tLive.tSmoke, color: 0x140e18, transparent: true,
        opacity: 0, depthWrite: false, fog: false })); mats.push(m.material); m.renderOrder = 6; m.visible = false; bundleG.add(m);
      uSmoke.push({ m, ph: i / 6, sx: (hash(i, 251) - 0.5) * 0.04 });
    }
    const uGlow = new THREE.Mesh(new THREE.PlaneGeometry(0.34, 0.34), new THREE.MeshBasicMaterial({ map: tGlowW, color: 0x5a6a9a, transparent: true, opacity: 0,
      depthWrite: false, blending: THREE.AdditiveBlending, fog: false, toneMapped: false })); mats.push(uGlow.material);
    uGlow.rotation.x = -Math.PI / 2; uGlow.position.y = 0.004; uGlow.renderOrder = 5; uGlow.visible = false; bundleG.add(uGlow);
    const B_FROM = new THREE.Vector3(PILE_POS.x - TX, TCNT.top - 0.22, TCNT.z - TCNT.d / 2 - 0.1);
    const B_LIFT = new THREE.Vector3(PILE_POS.x - TX, TCNT.top + 0.07, TCNT.z - TCNT.d / 2 - 0.05);
    const B_AT = new THREE.Vector3(PILE_POS.x - TX, TCNT.top, PILE_POS.z);
    function bundlePlace() {
      const E = endLive.bundleAt;
      if (E) {                                                     // (CP9: an ending puts it — closed, carried, in his drawer)
        bundleG.visible = !!E.vis;
        if (!E.vis) return;
        bundleG.position.set(E.x, E.y, E.z); bundleG.rotation.set(E.rx || 0, E.ry || 0, 0);   // (B stands it on its edge into the bag)
        for (let i = 0; i < flaps.length; i++) { const F = flaps[i], u = smooth(cl01((E.open || 0) * 1.6 - i * 0.2)); F.piv.rotation.x = F.shut * (1 - u); }
        return;
      }
      const B = tX.bundle;
      bundleG.visible = B.on; bundleG.rotation.set(0, 0, 0);
      if (!B.on) return;
      const t = B.t;
      if (t < 0.5) bundleG.position.lerpVectors(B_FROM, B_LIFT, smooth(t / 0.5));
      else { const u = smooth(cl01((t - 0.5) / 0.8)); bundleG.position.lerpVectors(B_LIFT, B_AT, u); bundleG.position.y += 0.05 * Math.sin(Math.PI * u); }
      for (let i = 0; i < flaps.length; i++) {
        const F = flaps[i], u = smooth(cl01(B.open * 1.6 - i * 0.2));
        F.piv.rotation.x = F.shut * (1 - u);
      }
    }
    bundlePlace();

    /* ---- THE VIEW DRAWN ROUND, SEATED (e3c3's turnTo: kit.pose('lying') re-aimed every frame — its swing held to a
       hair round the heading being written, so nothing fights the turn — then let go round where it ends: a little
       room to look about at a presence, the stool's whole swing at the counter) */
    let tTurn = null;
    function seatTurn(to, pitchTo, secs, lock, done, pos) {
      tTurn = { t: 0, from: yaw.rotation.y, to, secs, p0: pitch.rotation.x, p1: pitchTo, lock, done, pos: pos || null,
                x0: yaw.position.x, z0: yaw.position.z };
    }
    function seatTurnTick(wdt) {
      const T2 = tTurn; if (!T2 || !kit || getState() !== 'play') return;
      T2.t += wdt / T2.secs;
      const k = smooth(Math.min(1, T2.t));
      yaw.rotation.y = T2.from + angTo(T2.from, T2.to) * k;
      if (T2.pos) { yaw.position.x = T2.x0 + (T2.pos.x - T2.x0) * k; yaw.position.z = T2.z0 + (T2.pos.z - T2.z0) * k; }
      pitch.rotation.x = T2.p0 + (T2.p1 - T2.p0) * k;
      kit.pose('lying', { y: TSEAT.eye, yaw: yaw.rotation.y, span: 0.02, pitchLo: Math.min(T_SEAT.lo, pitch.rotation.x - 0.01),
                          pitchHi: Math.max(T_SEAT.hi, pitch.rotation.x + 0.01), secs: 0.9 });
      if (T2.t >= 1) {
        tTurn = null;
        const L = T2.lock || { yaw: 0, span: T_SEAT.span };
        kit.pose('lying', { y: TSEAT.eye, yaw: L.yaw, span: L.span, pitchLo: T_SEAT.lo, pitchHi: T_SEAT.hi, secs: 0.05 });
        if (T2.done) T2.done();
      }
    }
    const PRES_AT = {                                            // where the view is drawn to for each (world)
      lersi: () => [TX + LFACE.x, LFACE.y + 0.05, LFACE.z],
      wess: () => [TX + GIANT.x, 5.0, GIANT.z],
      naga: () => [TX + NAGA_END.x, 1.45, NAGA_END.z + 0.2],
      all: () => [TX + 0.25, 1.95, -1.4]
    };
    function lookRound(k, secs, span = 0.4) {
      const [x, y, z] = PRES_AT[k](), yw = eyeYaw(x, z);
      seatTurn(yw, eyePitch(x, y, z), secs, { yaw: yw, span });
    }
    function lookBack(secs, done, p = T_SEAT.pitch) { seatTurn(0, p, secs, { yaw: 0, span: T_SEAT.span }, done); }

    /* ---- SITTING DOWN */
    function sitNow() {
      tX.seated = true;
      yaw.position.x = TS.x; yaw.position.z = TS.z; yaw.rotation.y = 0; pitch.rotation.x = T_SEAT.pitch;
      if (kit) { kit.root(true); kit.pose('lying', { y: TSEAT.eye, yaw: 0, span: T_SEAT.span, pitchLo: T_SEAT.lo, pitchHi: T_SEAT.hi, secs: 0.05 }); }
    }
    function sitDown() {
      if (phase !== 'tray' || tX.seated || !kit) return false;
      tX.seated = true; tX.run++;
      kit.root(true); kit.objective(null);
      if (kit.waypoint) kit.waypoint(null);
      kit.pose('lying', { y: TSEAT.eye, yaw: yaw.rotation.y, span: 0.02, pitchLo: -1.2, pitchHi: 1.2, secs: 1.0 });
      seatTurn(0, T_OWN, 1.1, null, () => { if (worldSfx) worldSfx('x4cup', 0.45, 1, panAt(TX + tLive.cups[0].cup.position.x, tLive.cups[0].cup.position.z)); },
               { x: TS.x, z: TS.z });
      queueGap(1.2);
      queueLine('to4notice', () => personTalk(tLive.owner, SECS.to4notice));
      queueLine('z4sense');
      queueLine('to4tray', () => { personTalk(tLive.owner, SECS.to4tray); after(1.6, () => trayIn()); });
      return true;
    }
    function teaPour() {
      tX.teaTo = 1;
      if (worldSfx) worldSfx('x4tea', 0.55, 1, panAt(TX + tLive.cups[0].cup.position.x, tLive.cups[0].cup.position.z));
    }
    function trayIn() {
      if (phase !== 'tray' || !tX.seated) return;
      tX.tray.to = 1;
      after(0.25, () => { if (phase === 'tray' && tX.seated) seatTurn(0, T_SEAT.pitch, 1.3, { yaw: 0, span: T_SEAT.span }); });
      after(1.1, () => {
        if (phase !== 'tray') return;
        tX.trayIn = true;
        if (worldSfx) worldSfx('x4set', 0.5, 1, panAt(TX + TTRAY.x, TTRAY.z));
        setPhase('trayHold', '');
      });
    }

    /* ---- THE PIECES: pressed in order, the Lersi first; each held, answered, and set back. Their hotspots stand on each
       piece (at the velvet, the v7.5 law's "on the thing itself"), and only the next one is ever offered */
    const pieceAt = (k) => ({ x: TX + TTRAY.x + SLOT[k], y: TCNT.top + 0.07, z: TTRAY.z });
    function pieceReady(k) {
      return phase === 'trayHold' && tX.trayIn && !tX.on && !tX.unknown && !held.has(k) && ORDER.indexOf(k) === held.size && !tTurn && quiet();
    }
    function holdPiece(k) {
      if (phase !== 'trayHold' || held.has(k) || tX.on || tX.unknown || !tX.trayIn) return false;
      if (ORDER.indexOf(k) !== held.size) return false;
      pieceStart(k);
      return true;
    }
    function pieceStart(k) {
      if (!kit) return;
      const run = ++tX.run;
      const at = (t, fn) => after(t, () => { if (run === tX.run && tX.on === k) fn(); });
      tX.on = k;
      if (k === 'naga') ballHeld.spin = 0;                       // (v22.1: the naga inside faces him as he lifts it)
      kit.objective(null, { complete: false });                 // (CP11: a pickup played OBJECTIVE COMPLETE with the count unmoved)
      pieceShow(k, 'hand');
      if (worldSfx) worldSfx('x4pick', 0.6, 1, 0);
      kit.tremble(0.1, { secs: 0.3 });
      tX.glowTo = 0.55;
      if (k === 'lersi') lersiX(at, run); else if (k === 'wess') wessX(at, run); else nagaX(at, run);
    }
    function answered(k, run, line, reply) {
      queueLine(line, () => after(SECS[line] - 0.8, () => { if (run === tX.run) lookBack(1.5, null, T_OWN); }));
      queueLine(reply, () => personTalk(tLive.owner, SECS[reply]));
      queueFn(() => { if (run === tX.run) pieceDone(k); });
    }
    function lersiX(at, run) {
      at(0.5, () => { if (worldSfx) worldSfx('x4shimmer', 0.45, 0.85, 0); });
      at(1.0, () => {
        kit.daylight(T_AMBER, 3.2);
        tX.amberTo = 1; tX.fanTo = 0.1; tX.tickTo = 0.42; tX.smokeTo = 1; tX.leaves = 1; tX.glowTo = 1;
        if (worldSfx) worldSfx('x4om', 0.85, 1, 0);
        kit.tremble(0.04, { secs: 1.5 });
      });
      at(2.2, () => { if (worldSfx) worldSfx('x4leaves', 0.5, 1, 0); });
      at(2.8, () => { presShow('lersi', true); if (kit.flash) kit.flash({ color: 'rgba(255,176,90,0.22)', secs: 1.4 }); });
      at(4.2, () => { if (worldSfx) worldSfx('x4turn', 0.5, 0.85, panAt(TX + LFACE.x, LFACE.z)); lookRound('lersi', 1.8); });
      at(5.4, () => answered('lersi', run, 'z4lersi', 'to4lersi'));
    }
    function wessX(at, run) {
      at(0.4, () => { if (worldSfx) worldSfx('x4shimmer', 0.4, 0.7, 0); tX.glowTo = 1; });
      at(1.0, () => kit.daylight(T_RED, 5.0));
      for (let i = 0; i < 4; i++) at(0.8 + i * 1.3, () => giantStep(i));
      at(5.3, () => lookRound('wess', 1.9, 0.5));
      at(5.6, () => { presShow('wess', true); if (worldSfx) worldSfx('x4giant', 0.8, 1, panAt(TX + GIANT.x, GIANT.z));
                      if (kit.flash) kit.flash({ color: 'rgba(255,110,60,0.25)', secs: 1.2 }); });
      at(6.8, () => answered('wess', run, 'z4wess', 'to4wess'));
    }
    function giantStep(i) {
      const v = 0.45 + 0.17 * i, x = 14 - i * 4.2;               // down the street from the right, nearer each time
      if (worldSfx) worldSfx('x4step', v, 1, panAt(TX + x, 9));
      tX.shake = Math.max(tX.shake, 0.35 + 0.22 * i); tX.cupJ = 1; tX.lamp = Math.max(tX.lamp, 0.02 + 0.014 * i);
      tX.sunTo = 1 - 0.21 * (i + 1); tX.redTo = 0.25 * (i + 1);
      if (kit) kit.tremble(0.2 + 0.1 * i, { secs: 0.05 });
      after(0.35, () => { if (kit && tX.on === 'wess') kit.tremble(0.04, { secs: 0.6 }); });
      if (i >= 1) { tX.dustT = 0; tX.dustAmt = Math.min(1, 0.5 + 0.2 * i); if (worldSfx) worldSfx('x4dust', 0.3 + 0.1 * i, 1, 0); }
      if (i >= 1 && worldSfx) worldSfx('x4rattle', 0.25 + 0.12 * i, 1, panAt(TX + TSHOP.x0 + 0.3, -3.2));   // the antiques on their shelves
      if (i === 2 && kit && kit.pulse) kit.pulse({ bpm: 96, secs: 5, erratic: 0.12, sound: 'y4heart', vol: 0.42, kick: true });
    }
    function nagaX(at, run) {
      at(0.5, () => { tX.tealTo = 1; kit.daylight(T_TEAL, 2.4); tX.glowTo = 1; if (worldSfx) worldSfx('x4shimmer', 0.45, 1.15, 0); });
      at(1.0, () => { tX.causTo = 1; tX.dropsTo = 1; if (kit.smear) kit.smear(0.28, { secs: 2.0 }); });
      at(2.0, () => { presShow('naga', true); PRES.naga.slide = { t: 0, secs: 4.4 }; });
      at(3.0, () => { if (worldSfx) worldSfx('x4hiss', 0.8, 1, panAt(TX + NAGA_END.x, NAGA_END.z + 2));
                      if (kit.pulse) kit.pulse({ bpm: 108, secs: 5, erratic: 0.18, sound: 'y4heart', vol: 0.45 }); });
      at(4.4, () => { if (worldSfx) worldSfx('x4turn', 0.45, 1.1, panAt(TX + NAGA_END.x, NAGA_END.z)); lookRound('naga', 1.7); });
      at(5.6, () => answered('naga', run, 'z4naga', 'to4naga'));
    }
    /* set back on the velvet, and what it called stays: fainter, and a little of it in the room */
    function pieceDone(k) {
      if (!kit || tX.on !== k) return;
      held.add(k);
      pieceShow(k, 'tray');
      if (worldSfx) worldSfx('x4set', 0.5, 1, panAt(TX + TTRAY.x + SLOT[k], TTRAY.z));
      tX.on = ''; tX.glowTo = 0;
      kit.daylight(T_DAY, 2.6);
      kit.tremble(0, { secs: 0.6 });
      if (kit.smear) kit.smear(0, { secs: 1.0 });
      if (kit.pulse) { kit.pulse({ bpm: 76, secs: 2.5, erratic: 0, vol: 0.2 }); const run = tX.run; after(4.0, () => { if (run === tX.run && kit.pulse && !tX.on) kit.pulse(null); }); }
      if (k === 'lersi') { tX.amberTo = 0; tX.fanTo = 0.55; tX.tickTo = 0.8; tX.smokeTo = 0.22; tX.leaves = 0; }
      if (k === 'wess') { tX.redTo = 0; tX.sunTo = 0.55; tX.lampTo = 0.008; }
      if (k === 'naga') { tX.tealTo = 0; tX.causTo = 0.14; tX.dropsTo = 0; }
      presShow(k, 'rest');
      setPhase('trayHold', [...held].join(','));
      if (held.size < PIECE_N) seatTurn(0, T_SEAT.pitch, 1.1, { yaw: 0, span: T_SEAT.span });
      if (held.size >= PIECE_N) { bankOnce({ note: W.notePieces }); theUnknown(); }
    }
    /* what stays of each in the room, as a Continue finds it */
    function residue(k) {
      if (k === 'lersi') { tX.fanTo = 0.55; tX.tickTo = 0.8; tX.smokeTo = tX.smokeK = 0.22; }
      if (k === 'wess') { tX.sunTo = tX.sunK = 0.55; tX.lampTo = tX.lamp = 0.008; }
      if (k === 'naga') { tX.causTo = tX.caus = 0.14; }
    }

    /* ---- THE FOURTH PIECE, AND THE CLOCK */
    function theUnknown() {
      const run = ++tX.run;
      const at = (t, fn) => after(t, () => { if (run === tX.run) fn(); });
      tX.unknown = true;
      if (kit) kit.objective(null);
      queueGap(0.9);
      queueFn(() => {
        tX.tray.asideTo = 1;
        if (worldSfx) worldSfx('x4set', 0.36, 0.9, panAt(TX + TTRAY.x, TTRAY.z));
        seatTurn(0, eyePitch(PILE_POS.x, TCNT.top + 0.03, PILE_POS.z), 1.2, { yaw: 0, span: T_SEAT.span });
        at(0.7, () => { tX.bundle.on = true; tX.bundle.t = 0; personTalk(tLive.owner, 1.6); });
        at(2.0, () => { if (worldSfx) worldSfx('x4set', 0.42, 1.1, panAt(PILE_POS.x, PILE_POS.z)); });
        at(2.6, () => { tX.bundle.openTo = 1; if (worldSfx) worldSfx('x4unwrap', 0.7, 1, panAt(PILE_POS.x, PILE_POS.z)); });
      });
      queueGap(3.4);
      queueLine('to4unknown', () => personTalk(tLive.owner, SECS.to4unknown));
      queueGap(0.3);
      queueFn(() => { tX.tickTo = 0.22; seatTurn(0, eyePitch(TX + TCLOCK.x, TCLOCK.y, TCLOCK.z), 1.1, { yaw: 0, span: 0.3 }); });   // its tick dragging: he looks up at it
      queueGap(1.3);
      queueFn(() => clockStops());
      queueGap(1.6);
      queueLine('to4clock', () => personTalk(tLive.owner, SECS.to4clock * 0.7));
      queueFn(() => {
        // THEM: brighter, and still; the view drawn round to them; the pressure in his ears
        for (const k of ORDER) { presShow(k, 'bright'); PRES[k].frozen = true; }
        if (worldSfx) { worldSfx('x4turn', 0.6, 0.9, 0); worldSfx('x4pressure', 0.7, 1, 0); }
        lookRound('all', 2.1, 0.6);
        at(5.0, () => lookBack(1.7, null, tDec()));
      });
      queueGap(7.0);
      queueLine('z4feel', () => { setPhase('decide'); after(SECS.z4feel + 0.4, () => openWhenClear(dayClock.t)); });
    }
    function clockStops() {
      tLive.stopA = Math.sin(tLive.swing) * 0.16; tLive.clockOn = false; tLive.frozen = true;
      if (worldSfx) worldSfx('x4clockstop', 0.85, 1, panAt(TX + TCLOCK.x, TCLOCK.z));
      tX.silentTo = 1; tX.fanTo = 0; tLive.fanK = 0;
      if (kit) {
        kit.daylight(T_STILL, 2.2);
        if (kit.pulse) kit.pulse({ bpm: 56, secs: 3, erratic: 0.05, sound: 'y4heart', vol: 0.55 });
      }
    }

    /* ---- PER FRAME (wall time; only while he is in World T) */
    let tickN = null;
    const _cupBase = tLive.cups.map(c => c.cup.position.y);
    function tPlayTick(wdt, st) {
      const ease = (v, to, s) => v + (to - v) * (1 - Math.exp(-wdt / s));
      const play = st === 'play';
      // the shake laid on the look the player owns: last frame's taken off before anything writes the look, this
      // frame's laid on after (the Hanuman's kick, both ways)
      pitch.rotation.x -= tX.shakeWas.p; camera.rotation.z -= tX.shakeWas.r; tX.shakeWas.p = tX.shakeWas.r = 0;
      seatTurnTick(wdt);
      if (play && tX.shake > 1e-3) {
        tX.shake *= Math.exp(-wdt * 4.2);
        const t = performance.now() / 1000, p = tX.shake * 0.012 * Math.sin(t * 47.3), r = tX.shake * 0.008 * Math.sin(t * 39.1 + 1.1);
        pitch.rotation.x += p; camera.rotation.z += r; tX.shakeWas.p = p; tX.shakeWas.r = r;
      } else if (tX.shake <= 1e-3) tX.shake = 0;
      // the numbers
      tX.amber = ease(tX.amber, tX.amberTo, tX.amberTo > tX.amber ? 1.2 : 1.6);
      tX.red = ease(tX.red, tX.redTo, 0.8);
      tX.teal = ease(tX.teal, tX.tealTo, tX.tealTo > tX.teal ? 0.9 : 1.4);
      tX.silent = ease(tX.silent, tX.silentTo, 0.05);
      tX.smokeK = ease(tX.smokeK, tX.smokeTo, 1.4);
      tX.caus = ease(tX.caus, tX.causTo, tX.causTo > tX.caus ? 0.9 : 1.6);
      tX.drops = ease(tX.drops, tX.dropsTo, 0.8);
      tX.sunK = ease(tX.sunK, tX.sunTo, 0.25);
      tX.glow = ease(tX.glow, tX.glowTo, 0.5);
      tX.tea = ease(tX.tea, tX.teaTo, 1.1);
      tX.lamp = Math.max(tX.lampTo, tX.lamp * Math.exp(-wdt * 0.6));
      tX.cupJ *= Math.exp(-wdt / 0.18);
      if (!tLive.frozen) { tLive.fanK = ease(tLive.fanK, tX.fanTo, 1.3); tLive.tickK = ease(tLive.tickK, tX.tickTo, 1.4); }
      tLive.lampSwing = tX.lamp;
      if (tLive.sun) tLive.sun.material.opacity = 0.32 * tX.sunK;
      if (tLive.motes) tLive.motes.material.opacity = 0.55 * (0.35 + 0.65 * tX.sunK);
      // the tension under the pieces: a step up with each one held, a little more while one answers, nothing once the
      // clock has stopped
      let ten = 0;
      if (tX.seated && !tX.trayIn) ten = 0.12;
      if (tX.trayIn) ten = 0.2 + 0.1 * held.size + (tX.on ? 0.1 : 0);
      if (tX.unknown) ten = 0.52;
      if (endLive.on) ten = endLive.tension;
      tX.tension = ease(tX.tension, ten, 1.2);
      // the tray and the bundle
      tX.tray.k = ease(tX.tray.k, tX.tray.to, 0.35); if (Math.abs(tX.tray.to - tX.tray.k) < 0.002) tX.tray.k = tX.tray.to;
      tX.tray.aside = ease(tX.tray.aside, tX.tray.asideTo, 0.3);
      trayPlace();
      if (tX.bundle.on) { tX.bundle.t += wdt; tX.bundle.open = ease(tX.bundle.open, tX.bundle.openTo, 0.55); }
      bundlePlace();
      tX.ut += wdt;
      const EB2 = endLive.bundleAt, uk = !tLive.frozen ? 0 : EB2 ? (EB2.vis ? cl01(EB2.open || 0) : 0) : tX.bundle.on ? cl01(tX.bundle.open) : 0;
      uGlow.visible = uk > 0.01; uGlow.material.opacity = 0.32 * uk * (0.8 + 0.2 * Math.sin(tX.ut * 1.7));
      for (const sm of uSmoke) {
        sm.m.visible = uk > 0.01; if (!sm.m.visible) continue;
        const u = (tX.ut * 0.18 + sm.ph) % 1;
        sm.m.position.set(sm.sx + 0.012 * Math.sin(tX.ut * 0.9 + sm.ph * 9), 0.03 + u * 0.32, 0);
        sm.m.material.opacity = 0.42 * uk * Math.sin(Math.PI * u); sm.m.scale.set(1 + 0.8 * u, 1 + 0.5 * u, 1);
        camera.getWorldQuaternion(sm.m.quaternion);
      }
      // the stool's glow while it is the order
      const zoneOn = phase === 'tray' && !tX.seated;
      tZone.visible = zoneOn;
      if (zoneOn) zoneMat.opacity = 0.32 + 0.18 * Math.sin(tLive.t * 2.4);
      // the tea in the cups, its steam, and the cups jumping at each step
      tLive.cups.forEach((c, i) => {
        if (endLive.spilt && i === 0) return;                                        // ending A has it on the floor
        c.tea.visible = tX.tea > 0.02;
        c.tea.position.y = TCNT.top + 0.008 + 0.024 * tX.tea; c.tea.scale.setScalar(0.78 + 0.22 * tX.tea);
        c.cup.position.y = _cupBase[i] + 0.004 * tX.cupJ * Math.abs(Math.sin(tLive.t * 71 + i));
      });
      for (const s of steam) {
        const u = (tLive.t * 0.22 + s.ph) % 1, on = tX.tea > 0.3 && !(endLive.spilt && s.cup === 0);
        s.m.visible = on; if (!on) continue;
        s.m.position.set(s.x + 0.01 * Math.sin(tLive.t * 1.3 + s.ph * 5), TCNT.top + 0.06 + u * 0.16, s.z);
        s.m.material.opacity = 0.16 * tX.tea * Math.sin(Math.PI * u); s.m.scale.set(1 + u, 1 + u * 0.4, 1);
        camera.getWorldQuaternion(s.m.quaternion);
      }
      // the held piece: lit from within as it answers, its halo breathing
      const hk = tX.on;
      for (const k of ORDER) {
        const g = k === hk ? tX.glow : 0, beat = 0.75 + 0.25 * Math.sin(tLive.t * 3.0);
        for (const m of heldMats[k]) m.emissiveIntensity = g * (0.35 + 0.35 * beat);
        heldHalo[k].visible = g > 0.01; heldHalo[k].material.opacity = 0.6 * g * beat;
      }
      ballTick(wdt, hk === 'naga' ? tX.glow : 0);
      presTick(wdt);
      fxTick(wdt);
      if (play || (endLive.on && endLive.where === 'shop')) tickTick();
    }
    function presTick(wdt) {
      if (endLive.presOwn) { presOver.visible = endLive.presVis; return; }   // (CP9: an ending draws them)
      let anyVis = false;
      for (const k of ORDER) {
        const P = PRES[k];
        P.k += (P.to - P.k) * (1 - Math.exp(-wdt / (P.to > P.k ? (k === 'wess' ? 0.35 : 0.9) : 1.4)));
        if (Math.abs(P.to - P.k) < 0.002) P.k = P.to;
        const vis = P.ready && P.k > 0.003;
        P.g.visible = vis; if (P.halo) P.halo.visible = vis;
        if (!vis) continue;
        anyVis = true;
        if (!P.frozen) P.t += wdt;
        const br = P.frozen ? 1 : 0.9 + 0.1 * Math.sin(P.t * 1.3 + P.ph);
        for (const m of P.mats) m.opacity = m.userData.peak * P.k * br;
        if (P.halo) { P.halo.material.opacity = P.haloPeak * P.k * br; camera.getWorldQuaternion(P.halo.quaternion); }
        if (k === 'lersi' && P.inner && !P.frozen) P.g.position.y = LFACE.y + 0.04 * Math.sin(P.t * 0.55);
        if (k === 'lersi' && P.inner && P.s0) P.inner.scale.setScalar(P.s0 * (0.84 + 0.16 * Math.min(1, P.k)));   // it comes forward as it forms
        if (k === 'naga' && P.inner) {
          let u = 1;
          if (P.slide) { P.slide.t += wdt; u = smooth(cl01(P.slide.t / P.slide.secs)); if (P.slide.t >= P.slide.secs) P.slide = null; }
          if (!P.frozen) {
            const sway = 0.14 * Math.sin(P.t * 1.7) * (1 - 0.7 * u) + 0.04 * Math.sin(P.t * 0.6);
            P.g.position.set(NAGA_END.x + 0.25 * Math.sin(P.t * 0.9) * (1 - u), 0, NAGA_END.z + 6.2 * (1 - u));
            P.inner.rotation.y = Math.PI + sway;
          }
          if (P.halo) P.halo.position.set(P.g.position.x, 1.5, P.g.position.z + 0.6);
        }
      }
      presOver.visible = anyVis;
    }
    function fxTick(wdt) {
      const t = tLive.t;
      // the caustics
      const cv = tX.caus > 0.003;
      const wallK = cl01((tX.caus - 0.14) / 0.3);                   // what stays is on the ceiling alone
      for (const m of causMats) m.opacity = m.userData.ceil ? 0.42 * tX.caus : 0.28 * tX.caus * wallK;
      for (const c of causMeshes) c.visible = cv && (c.material.userData.ceil || wallK > 0.002);
      if (cv && !tLive.frozen) { cTexA.offset.x += wdt * 0.05; cTexA.offset.y += wdt * 0.031; cTexB.offset.x -= wdt * 0.036; cTexB.offset.y += wdt * 0.044; }
      // the drops, rising
      dropsP.visible = tX.drops > 0.005;
      if (dropsP.visible) {
        const P = dropGeo.attributes.position;
        for (let i = 0; i < NDROP; i++) { const [x, z, ph, v, a] = dropSeed[i], u = (t * v * 0.3 + ph) % 1;
          P.setXYZ(i, x + 0.05 * Math.sin(t * 1.1 + a), u * 3.5, z + 0.05 * Math.cos(t * 0.9 + a)); }
        P.needsUpdate = true; dropMat.opacity = 0.85 * tX.drops;
      }
      // the dust, falling from the joists after a step
      if (!tLive.frozen) tX.dustT += wdt;
      const dk = tX.dustAmt * Math.exp(-tX.dustT / 1.7);
      dustP.visible = dk > 0.01;
      if (dustP.visible) {
        const P = dustGeo.attributes.position;
        for (let i = 0; i < NDUST; i++) { const [x, z, v, a] = dustSeed[i];
          P.setXYZ(i, x + 0.08 * Math.sin(tX.dustT * 1.4 + a), Math.max(0.1, 3.42 - v * tX.dustT), z + 0.06 * Math.cos(tX.dustT * 1.1 + a)); }
        P.needsUpdate = true; dustMat.opacity = 0.7 * dk;
      }
      // the smoke round the counter
      const sv = tX.smokeK > 0.01;
      for (const s of lsmoke) {
        s.m.visible = sv; if (!sv) continue;
        const u = (t * 0.07 + s.ph) % 1;
        s.m.position.set(s.x + 0.12 * Math.sin(t * 0.4 + s.ph * 7), 0.55 + u * 2.2, s.z);
        s.m.material.opacity = 0.3 * tX.smokeK * Math.sin(Math.PI * u); s.m.scale.set(1 + u * 1.5, 1 + u * 0.6, 1);
        camera.getWorldQuaternion(s.m.quaternion);
      }
      // the leaves
      if (!tLive.frozen) {
        if (tX.leaves > 0 && tLive.t > leafNext) {
          const L = leaves.find(q => !q.on);
          if (L) { const i = leafN++;
            Object.assign(L, { on: true, x: -1.4 + hash(i, 241) * 3.8, y: TSHOP.H - 0.1, z: -7.0 + hash(i, 243) * 4.0, vy: 0.32 + hash(i, 247) * 0.3,
                               ph: hash(i, 249) * 6.28, life: 0, landY: 0 });
            const onCnt = L.x > TCNT.x0 && L.x < TCNT.x1 && Math.abs(L.z - TCNT.z) < TCNT.d / 2;
            L.landY = onCnt ? TCNT.top + 0.003 : 0.008; L.m.visible = true; L.m.scale.setScalar(1); }
          leafNext = tLive.t + 0.22;
        }
        for (const L of leaves) {
          if (!L.on) continue;
          L.life += wdt;
          if (L.y > L.landY) {
            L.y = Math.max(L.landY, L.y - L.vy * wdt); L.x += Math.sin(t * 1.7 + L.ph) * 0.18 * wdt; L.z += Math.cos(t * 1.3 + L.ph) * 0.1 * wdt;
            L.m.rotation.set(Math.sin(t * 2.1 + L.ph) * 1.2, L.ph + t * 0.8, Math.cos(t * 1.7 + L.ph) * 0.9);
            if (L.y <= L.landY) { L.m.rotation.set(-Math.PI / 2, 0, L.ph); L.life = 0; }
          } else if (L.life > 7) { const k = 1 - cl01((L.life - 7) / 0.6); L.m.scale.setScalar(Math.max(0.001, k)); if (k <= 0) { L.on = false; L.m.visible = false; } }
          L.m.position.set(L.x, L.y, L.z);
        }
      }
    }
    function tickTick() {
      const n = Math.floor(tLive.swing / Math.PI);
      if (tickN === null || n === tickN) { tickN = n; return; }
      tickN = n;
      if (!tLive.clockOn || !worldSfx) return;
      const d = Math.hypot(yaw.position.x - (TX + TCLOCK.x), yaw.position.z - TCLOCK.z);
      worldSfx('x4tick', 0.42 / (1 + (d / 3.5) ** 2) * (1 - tX.silent), 1, panAt(TX + TCLOCK.x, TCLOCK.z));
    }
    function tZoneTick() {
      if (phase !== 'tray' || tX.seated || worldOf(yaw.position.x) !== 'T' || !quiet()) return;
      if (Math.hypot(yaw.position.x - TSTOOL.x, yaw.position.z - TSTOOL.z) < 0.5) sitDown();
    }
    function tTickAll(wdt, st) {
      if (wdt <= 0 || worldOf(yaw.position.x) !== 'T') return;
      tTick(wdt);
      tPlayTick(wdt, st);
    }
    /* the street through the open front, one small thing at a time on the chapter's clock from a seeded stream — a
       scooter, a bicycle's bell, people passing — panned from where it passes; while he waits and while he holds the
       tray, never under an answer, never once the clock has stopped; reset() rewinds the stream (the v8.1 law) */
    const T_AMB = [{ n: 'x4scooter', v: 0.34 }, { n: 'x4bicycle', v: 0.3 }, { n: 'x4passers', v: 0.38 }];
    const tAmb = { at: 0, seed: 0 };
    const tRand = () => hash(++tAmb.seed, 131);
    function tAmbTick() {
      if (worldOf(yaw.position.x) !== 'T' || !(phase === 'tray' || phase === 'trayHold') || tX.on || tX.unknown || getState() !== 'play') return;
      if (!tAmb.at) { tAmb.at = dayClock.t + 5; return; }
      if (dayClock.t < tAmb.at) return;
      const a = T_AMB[Math.floor(tRand() * T_AMB.length) % T_AMB.length], x = (tRand() < 0.5 ? -1 : 1) * (4 + tRand() * 9);
      if (worldSfx) worldSfx(a.n, a.v * (quiet() ? 1 : 0.6), 1, panAt(TX + x, 6 + tRand() * 4));
      tAmb.at = dayClock.t + 9 + tRand() * 11;
    }
    /* the shop's beds, by where he stands: the street through the front (louder at the door, its pan its bearing), the
       fans (as fast as they turn), the forest under the Lersi, the water under the naga, the tension under the pieces —
       and when the clock stops, all of it at once */
    const mixT = { street: 0, fan: 0, forest: 0, water: 0, tension: 0 };
    function mixBedsT(wdt, st) {
      const B = DATA.ambience.beds, inT = worldOf(yaw.position.x) === 'T';
      const live = inT && st !== 'result' && st !== 'complete' && !(endLive.on && endLive.where !== 'shop');
      const front = cl01((yaw.position.z + 6) / 6), still = 1 - tX.silent;
      const street = live ? (0.24 + 0.2 * front) * still * (1 - 0.65 * tX.amber) * (1 - 0.55 * tX.teal) : 0;
      const fan = live ? 0.2 * Math.min(1, tLive.fanK) * still : 0;
      const forest = live ? 0.6 * tX.amber : 0;
      const water = live ? 0.62 * tX.teal : 0;
      const tension = live ? tX.tension * still : 0;
      const k = 1 - Math.exp(-wdt / (tX.silentTo > 0.5 ? 0.06 : 0.8));
      mixT.street += (street - mixT.street) * k; mixT.fan += (fan - mixT.fan) * k; mixT.forest += (forest - mixT.forest) * k;
      mixT.water += (water - mixT.water) * k; mixT.tension += (tension - mixT.tension) * k;
      B[8][1] = mixT.street; B[8][2] = inT ? panAt(TX + 0.4, 5.5) : 0;
      B[9][1] = mixT.fan; B[10][1] = mixT.forest; B[11][1] = mixT.water; B[12][1] = mixT.tension;
    }

    /* the endings' two beds (CP9): the street at dusk and in the evening, and his room at night (its fan, the crickets
       outside, the road far below) — by where the ending has him; nothing anywhere else */
    const mixE = { dusk: 0, room: 0 };
    function mixBedsE(wdt, st) {
      const B = DATA.ambience.beds, live = endLive.on && st === 'cine';
      const dusk = live && endLive.where === 'dusk' ? 0.55 : 0, room = live && endLive.where === 'room' ? 0.6 : 0;
      const k = 1 - Math.exp(-wdt / 0.5);
      mixE.dusk += (dusk - mixE.dusk) * k; mixE.room += (room - mixE.room) * k;
      if (dusk === 0 && mixE.dusk < 0.002) mixE.dusk = 0; if (room === 0 && mixE.room < 0.002) mixE.room = 0;
      B[13][1] = mixE.dusk; B[14][1] = mixE.room;
    }

    /* ---- World T as a reset leaves it, and as a Continue finds it (§8): before he sits, standing inside the door with the
       tea made; seated with the tray out and every piece already held back on the velvet, its presence standing; with
       all three held, the fourth piece comes again (toWorld runs it once the black has lifted) */
    function tReset() {
      tX.run++; tTurn = null;
      if (tX.clasp && kit && kit.pray) kit.pray(false, { secs: 0.3 });
      if (tX.shakeWas.p || tX.shakeWas.r) { pitch.rotation.x -= tX.shakeWas.p; camera.rotation.z -= tX.shakeWas.r; }
      Object.assign(tX, { seated: false, on: '', trayIn: false, unknown: false, amber: 0, amberTo: 0, red: 0, redTo: 0, teal: 0, tealTo: 0,
                          silent: 0, silentTo: 0, tension: 0, fanTo: 1, tickTo: 1, sunK: 1, sunTo: 1, smokeK: 0, smokeTo: 0, leaves: 0,
                          caus: 0, causTo: 0, drops: 0, dropsTo: 0, lamp: 0, lampTo: 0, cupJ: 0, glow: 0, glowTo: 0, tea: 0, teaTo: 0,
                          dustT: 9, dustAmt: 0, shake: 0, shakeWas: { p: 0, r: 0 }, clasp: false, ut: 0 });
      Object.assign(tX.tray, { k: 0, to: 0, aside: 0, asideTo: 0 });
      Object.assign(tX.bundle, { on: false, t: 0, open: 0, openTo: 0 });
      trayPlace(); bundlePlace();
      for (const k of ORDER) { pieceShow(k, 'tray'); const P = PRES[k]; P.k = P.to = 0; P.frozen = false; P.slide = null; P.g.visible = false; if (P.halo) P.halo.visible = false; }
      tLive.clockOn = true; tLive.frozen = false; tLive.fanK = 1; tLive.tickK = 1; tLive.lampSwing = 0; tLive.stopA = 0;
      for (const L of leaves) { L.on = false; L.m.visible = false; }
      tAmb.at = 0; tAmb.seed = 0; tickN = null; leafNext = 0; leafN = 0;
      mixT.street = mixT.fan = mixT.forest = mixT.water = mixT.tension = 0;
      tZone.visible = false;
    }
    function tEnter(at, resumed) {
      tReset();
      tX.tea = tX.teaTo = (resumed || at !== 'tray') ? 1 : 0;    // a Continue finds the tea made; a fresh arrival watches it poured
      if (at === 'trayHold' || at === 'decide') {
        sitNow();
        tX.tray.k = tX.tray.to = 1; tX.trayIn = true; trayPlace();
        for (const k of held) { pieceShow(k, 'tray'); presShow(k, 'rest', true); residue(k); }
      }
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
    function toWorld(w, resumed, at, tag) {
      const run = ++worldRun;
      /* a Continue put in this world under the chapter card (the preplace in updateNotes) raises no black of its own:
         it used to show the shop, snap to black, warm and fade it in a second time (CP11; e3c3's SR-1 shape) */
      const cold = resumed && preplaced === w;
      if (kit) { kit.root(true); kit.presence(0); if (!cold) kit.fade(1, 0.01); }
      if (!cold) {
        placeIn(w);
        if (w === 'H') hEnter(at || 'han', tag);
        else if (w === 'T') tEnter(at || 'tray', resumed);
      }
      setPhase(at || (w === 'H' ? 'han' : 'tray'), at === 'trayHold' ? [...held].join(',') : at === 'hanHold' && tag === 'done' ? 'done' : undefined);
      const warmed = !cold && kit && kit.warm ? kit.warm() : Promise.resolve(0);   // (a preplace was warmed by the curtain)
      warmed.then(() => {
        if (!alive || run !== worldRun) return;
        if (!resumed) {
          if (w === 'H') { queueLine('z4han0', () => after(SECS.z4han0 * 0.6, () => { if (kit) kit.fade(0, 1.6); })); queueGap(0.6);
                           queueLine('ow4hello', () => personTalk(hLive.owner, SECS.ow4hello)); queueLine('z4fine'); }
          else { queueLine('z4tray0', () => after(SECS.z4tray0 * 0.6, () => { if (kit) kit.fade(0, 1.6); })); queueGap(0.6);
                 queueLine('to4hello', () => { personTalk(tLive.owner, SECS.to4hello); after(0.9, () => teaPour()); }); }
          queueFn(() => { if (kit) kit.root(false); });
        } else if (kit) {
          kit.fade(0, 1.2); kit.root((w === 'T' && tX.seated) || (w === 'H' && at === 'hanHold' && tag === 'done'));   // (let go: rooted until the run, as live)
          // all three already held before a Continue: the fourth piece comes again
          if (w === 'T' && held.size >= PIECE_N) { queueGap(1.0); queueFn(() => theUnknown()); }
          // let go already, before a Continue: the piece on the glass, and his last words still to say, then the run
          if (w === 'H' && at === 'hanHold' && tag === 'done') { queueGap(1.4); queueLine('z4go', () => after(SECS.z4go + 0.3, () => runOut())); }
        }
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
      { id: 'hanuman', pos: { x: HX + H.LPT.x, y: H.RCNT.top + 0.12, z: H.LPT.z }, radius: 2.2, prompt: W.hotHanuman, markY: 0.12,
        hits: tapBox(HX + H.LPT.x - 0.14, H.RCNT.top, H.LPT.z - 0.14, HX + H.LPT.x + 0.14, H.RCNT.top + 0.2, H.LPT.z + 0.14),
        enabled: () => phase === 'hanHold' && !hanX.on && !hanX.released && stand.k > 0.9 && quiet(), onInteract() { return pickHanuman(); } },
      { id: 'stool', pos: { x: TSTOOL.x, y: 0.8, z: TSTOOL.z }, radius: 1.8, prompt: W.hotStool, markY: 0.25,
        enabled: () => phase === 'tray' && !tX.seated && quiet(), onInteract() { return sitDown(); } },
      { id: 'pcLersi', pos: pieceAt('lersi'), radius: 1.6, prompt: W.hotLersi, markY: 0.06,
        hits: tapBox(pieceAt('lersi').x - 0.06, TCNT.top, TTRAY.z - 0.07, pieceAt('lersi').x + 0.06, TCNT.top + 0.16, TTRAY.z + 0.07),
        enabled: () => pieceReady('lersi'), onInteract() { return holdPiece('lersi'); } },
      { id: 'pcWess', pos: pieceAt('wess'), radius: 1.6, prompt: W.hotWess, markY: 0.12,
        hits: tapBox(pieceAt('wess').x - 0.06, TCNT.top, TTRAY.z - 0.07, pieceAt('wess').x + 0.06, TCNT.top + 0.2, TTRAY.z + 0.07),
        enabled: () => pieceReady('wess'), onInteract() { return holdPiece('wess'); } },
      { id: 'pcNaga', pos: pieceAt('naga'), radius: 1.6, prompt: W.hotNaga, markY: 0.06,
        hits: tapBox(pieceAt('naga').x - 0.05, TCNT.top, TTRAY.z - 0.07, pieceAt('naga').x + 0.05, TCNT.top + 0.1, TTRAY.z + 0.07),   // (v22.1: the ball on its stand)
        enabled: () => pieceReady('naga'), onInteract() { return holdPiece('naga'); } }
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
      yinTick(wdt); mixBedsY(wdt, st); mixBedsM(wdt);
      hTick(wdt); mixBedsH(wdt, st);
      tTickAll(wdt, st); mixBedsT(wdt, st); mixBedsE(wdt, st);
      const live = st === 'play' || st === 'unlock' || st === 'choose';
      /* a Continue into World H or T is put there UNDER the chapter card, so the card lifts on the shop it resumes in —
         not on the Yin shop for the frames before play boots the phase, then black, then the shop (CP11) */
      if (!booted && !preplaced && kit) {
        const RA = resumeAt(kit.getPhase());
        if (RA) { preplaced = RA.w; placeIn(RA.w); if (RA.w === 'H') hEnter(RA.at, RA.tag); else tEnter(RA.at, true); }
      }
      if (!live) { lastWall = 0; return; }
      if (lastWall) dayClock.t += Math.min(0.5, now - lastWall);
      lastWall = now;
      if (!booted) {
        booted = true;
        applyPhase(kit ? kit.getPhase() : null);
      }
      runTodo(); runSpeak(); runQueue();
      if (st !== 'play') return;
      watchTick(); wrongTick(); hAmbTick(); tAmbTick(); tZoneTick();
    }
    function updatePile() {}
    function updateFire() {}
    function updateSlow() {}

    /* ------------------------------------------------------------ a resume
       A Continue lands on the order still open, in its world: a look spent is
       spent, a piece held is held; an experience is begun again from its
       pickup (never resumed half-way). */
    /* where a saved phase resumes past World Y: the world, the phase it enters on, its tag — and, for the tray, the pieces
       already held. Shared by applyPhase and the preplace under the chapter card */
    function resumeAt(p0) {
      const tag = String(p0 || '').split(':'), p = PHASES.includes(tag[0]) ? tag[0] : 'yin', at = PHASES.indexOf(p);
      if (at >= PHASES.indexOf('tray')) {
        if (p === 'trayHold' && tag[1]) for (const k of tag[1].split(',')) if (['lersi', 'wess', 'naga'].includes(k)) held.add(k);
        if (p === 'decide') { held.add('lersi'); held.add('wess'); held.add('naga'); }
        return { w: 'T', at: p === 'decide' ? 'trayHold' : p };
      }
      if (at >= PHASES.indexOf('han')) return { w: 'H', at: p, tag: tag[1] };
      return null;
    }
    function applyPhase(p) {
      const RA = resumeAt(p);
      if (RA) { toWorld(RA.w, true, RA.at, RA.tag); return; }
      const tag = String(p || '').split(':');
      p = tag[0];
      if (!PHASES.includes(p)) p = 'yin';
      if (p === 'yin' && tag[1]) for (const k of tag[1].split(',')) if (['bottles', 'photos', 'altar'].includes(k)) looked.add(k);
      for (const h of hotspots) if (h.lookKey && looked.has(h.lookKey)) h.done = true;
      if (p === 'yin' && looked.size >= LOOK_N) p = 'yinKeeper';
      const setDown = p === 'yinHold' && tag[1] === 'down';      // set down already: at the door, her merit line again
      if (setDown) p = 'yinDone';
      /* the experience is begun again from its pickup (yinHold: the box open, the locket in it); after it, the box
         stays open, the tape stopped, and the door waits */
      if (p === 'yinHold' || p === 'yinDone') { if (yLive.box) { yLive.box.open = 1; yLive.box.lid.rotation.z = -1.9; } }
      if (p === 'yinDone') { yin.stopped = true; yin.clicked = true; yin.rate = 0.02; }
      setPhase(p, p === 'yin' && looked.size ? [...looked].join(',') : undefined);
      if (p === 'yinDone' && kit && kit.waypoint) kit.waypoint({ x: 0, y: 1.3, z: 0.1 });
      if (setDown) { queueGap(1.0); queueLine('yk4merit', () => personTalk(yLive.keeper, SECS.yk4merit)); }
    }

    /* ------------------------------------------------------------------ THE MERIT FILM, driven
       Everything the film shows is a function of its own clock (meritFrame(t)), so a seek, a skip, a replay and a
       one-frame-a-second phone all land on the same picture (v19.5's yantAt). The film itself (meritFilm, below)
       holds only its cues, its words, its fades and one track that calls this. Shots, film seconds:
         S1  0.85–8.6   the courtyard at sunset from low by the bodhi: the hall's three gables against the glow, the bell
         S2  8.6–12.0   his eyes just inside the door: down the hall to the Buddha, then to the donation box, his
                        envelope in his hand
         S2b 12.0–14.0  the slot, low across the lid: the envelope going in
         S3  14.0–22.2  kneeling before the monk, his hands joined; the dedication, whispered
         S4  22.2–26.6  the pour: the brass vessel's thin stream into the silver bowl as the monk begins the verse
         S4b 26.6–30.6  the monk chanting, his head dipping with each line
         S4c 30.6–35.7  the bowl filling, the stream thinning to drops; black
         S6  35.7–48.4  the bodhi's roots: the bowl's water poured on the earth, the breeze, leaves falling, a pale light
                        rising from the wet earth and the lens rising with it into the dusk; black */
    const M_DUSK = {
      stops: [[0.00, '#f4ad74'], [0.10, '#e48c6a'], [0.30, '#b86e7c'], [0.60, '#433f74'], [1.00, '#131a38']],
      bg: 0x6a4458, fog: [0xc88c78, 0.0055],
      hemi: [0xffc8b0, 0x3a2a30, 0.92], key: [0xffa458, 1.25, -6.2, 1.1, -7.8], fill: [0x8a90c8, 0.32],
      stars: 0, moon: 0, sun: 0, clouds: 0,
      vmHemi: [0xffd4b8, 0x3a2a30, 0.95], vmKey: [0xffb070, 0.8]
    };
    const M_HALL = {
      stops: [[0.00, '#f4ad74'], [0.30, '#b86e7c'], [1.00, '#131a38']],
      bg: 0x2a1c18, fog: [0x2a2018, 0.008],
      hemi: [0xffe2c4, 0x4a3426, 0.95], key: [0xffc08a, 0.8, -6, 2.4, -2.5], fill: [0xffd8b0, 0.38],
      stars: 0, moon: 0, sun: 0, clouds: 0,
      vmHemi: [0xffe2c8, 0x4a3426, 1.0], vmKey: [0xffc890, 0.85]
    };
    const MF = { s1: 0.85, s2: 8.6, s2b: 12.0, s3: 14.0, s4: 22.2, s4b: 26.6, s4c: 30.6, s6: 35.7, end: 48.4,
                 chant: 22.4, pour0: 22.6, pour1: 34.5, earth0: 36.4, earth1: 39.4, breeze: 39.4, mote: 40.4 };
    const _mp = new THREE.Vector3(), _mt = new THREE.Vector3(), _ms = new THREE.Vector3(), _mw = new THREE.Vector3(), _mqa = new THREE.Quaternion();
    const wz = (z) => z + MZ;                                   // pocket-local z to the world's
    function camLook(px, py, pz, tx, ty, tz) {                  // put the lens at p (local), aimed at t (local)
      yaw.position.set(px, py, wz(pz));
      const dx = tx - px, dy = ty - py, dz = tz - pz;
      yaw.rotation.y = Math.atan2(-dx, -dz);
      pitch.rotation.x = Math.atan2(dy, Math.hypot(dx, dz));
    }
    function lerp3(a, b, k) { return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k]; }
    function mStreamTo(p0, dir, speed, yEnd, radius) {           // a falling stream's tube, from p0 to the level yEnd (the pocket's own coordinates: the tube is its child)
      const pts = []; let x = p0.x, y = p0.y, z = p0.z, vx = dir.x * speed, vy = dir.y * speed, vz = dir.z * speed;
      for (let i = 0; i < 40 && y > yEnd; i++) { pts.push(new THREE.Vector3(x, y, z)); const h = 0.012; x += vx * h; y += vy * h; z += vz * h; vy -= 9.8 * h; }
      pts.push(new THREE.Vector3(x, Math.max(yEnd, y), z));
      if (pts.length < 2) pts.push(new THREE.Vector3(x, yEnd, z));
      const g = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), Math.max(4, pts.length * 2), radius, 6, false);
      if (mLive.streamGeo) mLive.streamGeo.dispose();
      mLive.streamGeo = g; mLive.stream.geometry = g;
      return pts[pts.length - 1];
    }
    let mShotWas = '', mHolding = false, mLit = null;
    /* what was chosen by photograph (a probe may try others: stage.merit.tune, then rehold()) — the clasp's height
       kneeling before the monk, how far his fingers relax round the envelope, and where it sits in his hand */
    const mTune = { s3y: -0.30, relax: 0.8, envPos: [0.02, -0.01, -0.2], envRot: [-0.3, 0.12, 0] };
    function mLight(p) { if (mLit !== p && kit && kit.daylight) { kit.daylight(p, 0); mLit = p; } }
    function meritShot(t) {
      return t < MF.s2 ? 'S1' : t < MF.s2b ? 'S2' : t < MF.s3 ? 'S2b' : t < MF.s4 ? 'S3' : t < MF.s4b ? 'S4' : t < MF.s4c ? 'S4b' : t < MF.s6 ? 'S4c' : 'S6';
    }
    function meritBegin() {
      mLive.on = true; worldM.visible = true; mShotWas = ''; mLit = null;
      if (kit && kit.captions) kit.captions(null);
    }
    function meritEnd() {
      mLive.on = false; worldM.visible = false; mShotWas = ''; mLit = null;
      if (mHolding && kit && kit.hold) { if (!kit.holding || kit.holding() === mLive.envelope) kit.hold(null); }
      mHolding = false;
      if (kit && kit.captions) kit.captions(null);
      if (mLive.stream) mLive.stream.visible = false;
      for (const d of mLive.drops) d.s.visible = false;
      camera.fov = 72; camera.updateProjectionMatrix();
    }
    function meritFrame(t, api) {
      if (!mLive.on) meritBegin();
      const shot = meritShot(t), F = MHALL.F, ss = smooth;
      const hr = api && api.handsRoot;
      mLive.t = t;
      // the light, the hands and the lens follow the shot
      mLight(shot === 'S1' || shot === 'S6' ? M_DUSK : M_HALL);
      mLive.duskTo = shot === 'S1' || shot === 'S6' ? 1 : 0.32;
      const handsOn = shot === 'S2' || shot === 'S3';
      if (hr) hr.visible = handsOn;
      if (api && api.armR) api.armR.visible = handsOn;
      const wantHold = shot === 'S2';
      if (wantHold !== mHolding && kit && kit.hold) {
        if (wantHold) { mLive.envelope.visible = true; kit.hold(mLive.envelope, { pos: mTune.envPos, rot: [ARM_INV.x + mTune.envRot[0], ARM_INV.y + mTune.envRot[1], ARM_INV.z + mTune.envRot[2]] }); }
        else if (!kit.holding || kit.holding() === mLive.envelope) kit.hold(null);
        mHolding = wantHold;
      }
      const fov = shot === 'S2b' ? 40 : shot === 'S4' ? 36 : shot === 'S4b' ? 46 : shot === 'S4c' ? 34 : shot === 'S6' ? 46 + 10 * ss(cl01((t - (MF.mote + 0.2)) / 5.6)) : 72;
      if (camera.fov !== fov) { camera.fov = fov; camera.updateProjectionMatrix(); }
      if (shot !== mShotWas) { mShotWas = shot; if (shot === 'S3' && api && api.dirtyShadows) api.dirtyShadows(2); }

      /* ---- the shots' lenses */
      if (shot === 'S1') {
        const k = ss(cl01((t - MF.s1) / (MF.s2 - MF.s1)));
        const p = lerp3([7.6, 0.55, 13.0], [6.7, 0.72, 11.6], k), q = lerp3([-0.6, 6.2, -2.0], [-0.6, 7.5, -2.0], k);
        camLook(p[0], p[1], p[2], q[0], q[1], q[2]);
      } else if (shot === 'S2') {
        /* just inside the door: down the hall to the Buddha, then (an eased pan of the angles themselves, so it sweeps
           evenly) down to the donation box by the door, a step nearer; the envelope in his hand, his fingers round it */
        const pan = ss(cl01((t - (MF.s2 + 1.0)) / 1.6)), push = ss(cl01((t - MF.s2) / (MF.s2b - MF.s2)));
        const P = [MBOX.x + 1.05 - 0.4 * push, F + 1.62, MBOX.z + 1.0 - 0.32 * push];
        const aim = (q) => [Math.atan2(-(q[0] - P[0]), -(q[2] - P[2])), Math.atan2(q[1] - P[1], Math.hypot(q[0] - P[0], q[2] - P[2]))];
        const A = aim([0, F + 2.0, MALT.z]), B = aim([MBOX.x, F + 1.12, MBOX.z]);
        yaw.position.set(P[0], P[1], wz(P[2])); yaw.rotation.y = A[0] + (B[0] - A[0]) * pan; pitch.rotation.x = A[1] + (B[1] - A[1]) * pan;
        if (api && api.handsPose) api.handsPose(0, 0, { from: 'rest', relax: mTune.relax });
      } else if (shot === 'S2b') {
        // low across the lid, the box's words below the slot; a phone's narrow frame stands further back
        const k = ss(cl01((t - MF.s2b) / (MF.s3 - MF.s2b))), back = camera.aspect < 1 ? 1.35 : 1;
        camLook(MBOX.x + 0.16 * back, F + 1.33 + 0.02 * back, MBOX.z + (0.62 - 0.05 * k) * back, MBOX.x, F + 1.13, MBOX.z + 0.06);
      } else if (shot === 'S3') {
        const k = ss(cl01((t - MF.s3) / (MF.s4 - MF.s3)));
        camLook(MKNEEL.x + 0.04 * k, F + 0.95, MKNEEL.z, MDAIS.x + 0.05, F + 1.27 - 0.03 * k, MDAIS.z);
        if (api && api.handsPose) api.handsPose(0, 0, { y: mTune.s3y });
      } else if (shot === 'S4' || shot === 'S4c') {
        const c4 = shot === 'S4', k = ss(cl01((t - (c4 ? MF.s4 : MF.s4c)) / (c4 ? MF.s4b - MF.s4 : MF.s6 - MF.s4c)));
        // the vessel held from above the frame: its spout and the curve of its belly in, the rest cut by the top edge
        if (c4) camLook(MBOWL.x + 0.03, F + 0.16 - 0.015 * k, MBOWL.z + 0.44 - 0.05 * k, MBOWL.x - 0.02, F + 0.065, MBOWL.z);
        else camLook(MBOWL.x + 0.27 - 0.03 * k, F + 0.17, MBOWL.z + 0.27 - 0.03 * k, MBOWL.x, F + 0.07, MBOWL.z);
      } else if (shot === 'S4b') {
        const k = ss(cl01((t - MF.s4b) / (MF.s4c - MF.s4b)));
        camLook(MDAIS.x - 1.3 + 0.18 * k, F + 1.2, MDAIS.z + 0.62 - 0.08 * k, MDAIS.x + 0.06, F + 1.27, MDAIS.z);
      } else {
        /* S6: down on the earth of the plinth, S4's language (the vessel held from above the frame): the bowl comes in
           at the top edge, tipped, the water onto the roots in the middle of the frame, the trunk's foot beyond — then
           the lens rises and turns up with the light, up the trunk, through the canopy, into the dusk. (The first cut
           stood two metres back with the whole bowl in the air and no one holding it, the trunk a dark mass behind) */
        const spot = { x: MTREE.x - 0.62, y: MTREE.h, z: MTREE.z + 0.42 };
        const rk = ss(cl01((t - (MF.mote + 0.2)) / 5.6)), push = ss(cl01((t - MF.s6) / (MF.mote - MF.s6)));
        const mote = moteAt(t, spot);
        /* (from the trunk's side: looking down at the spot with the trunk off to the right of the frame — on a phone's
           narrow frame out of it — where the first insert stood across the spot from the trunk and filled the top of
           the picture with a dark mass) */
        const cam = lerp3(lerp3([spot.x - 0.17, spot.y + 0.64, spot.z + 0.76], [spot.x - 0.14, spot.y + 0.6, spot.z + 0.7], push),
                          [spot.x - 1.5, spot.y + 1.15, spot.z + 1.7], rk);
        const tgt = lerp3([spot.x + 0.05, spot.y + 0.04, spot.z - 0.05], [mote.x, mote.y, mote.z], ss(cl01((t - (MF.mote + 0.6)) / 2.0)));
        camLook(cam[0], cam[1], cam[2], tgt[0], tgt[1], tgt[2]);
        if (pitch.rotation.x > 1.2) pitch.rotation.x = 1.2;
      }
      mLive.monkNod = 0;
      if (t >= MF.chant && t < MF.chant + 12.5) {
        // his head dips with each of the verse's four lines (measured on the shipped take: 0, 3.56, 6.71, 9.73 s)
        const u = t - MF.chant;
        for (const p of [0, 3.56, 6.71, 9.73]) { const d = u - p; if (d > 0 && d < 2.4) mLive.monkNod = Math.max(mLive.monkNod, Math.sin(Math.PI * d / 2.4) * 0.11); }
      }
      meritFx(t);
    }
    /* the pale light that rises from the wet earth: slow first, then up through the canopy into the dusk, turning a
       little as it climbs */
    function moteAt(t, spot) {
      const u = Math.max(0, t - MF.mote);
      _mp.set(spot.x + Math.sin(u * 1.8) * 0.14 * Math.min(1, u), spot.y + 0.06 + 1.55 * Math.pow(u, 1.38), spot.z + Math.cos(u * 1.8) * 0.12 * Math.min(1, u) - u * 0.25);
      return _mp;
    }
    function meritFx(t) {
      const F = MHALL.F, sh = meritShot(t);
      /* ---- the bell, struck at 4.6 s: it swings and settles */
      { const b = mLive.bell, d = t - 4.6;
        b.swing.rotation.z = d > 0 ? Math.sin(d * 4.2) * 0.16 * Math.exp(-d * 0.7) : 0; }
      /* ---- the envelope in the slot (S2b) */
      { const e = mLive.envIn, k = smooth(cl01((t - (MF.s2b + 0.25)) / 1.6));   // its foot already in the slot; pushed home
        e.visible = sh === 'S2b';
        e.position.set(MBOX.x, F + 1.235 + 0.045 - 0.105 * k, MBOX.z); }
      /* ---- the pour (S4, S4c): the vessel tips, the stream falls, the bowl fills, rings run out from where it lands */
      const pouring = sh === 'S4' || sh === 'S4c', inside = sh === 'S2' || sh === 'S2b' || sh === 'S3' || sh === 'S4' || sh === 'S4b' || sh === 'S4c';
      const fillK = cl01((t - MF.pour0) / (MF.pour1 - MF.pour0));
      const flow = t < MF.pour0 ? 0 : t < MF.pour1 - 0.6 ? 1 : t < MF.pour1 ? 1 - (t - (MF.pour1 - 0.6)) / 0.6 : 0;
      { const v = mLive.vessel, tip = smooth(cl01((t - (MF.pour0 - 0.5)) / 0.7)) * (1 - smooth(cl01((t - MF.pour1) / 0.8)));
        v.visible = inside && t > MF.s4 - 0.1 && t < MF.s6;
        v.position.set(MBOWL.x - 0.15, F + 0.155 + 0.03 * (1 - tip), MBOWL.z + 0.004);
        v.rotation.set(0, 0, -0.35 - 0.62 * tip);
        mLive.water.visible = inside && fillK > 0.01;
        const lvl = 0.02 + 0.042 * fillK;
        mLive.water.position.y = lvl; mLive.water.scale.setScalar(Math.min(1.12, (0.058 + 0.5 * lvl) / 0.08));
        const st = mLive.stream;
        if (pouring && flow > 0.02) {
          v.updateMatrix();
          _ms.copy(v.userData.spout).applyMatrix4(v.matrix);         // the spout's tip, in the pocket's coordinates
          _mw.set(Math.cos(v.rotation.z), Math.sin(v.rotation.z), 0).normalize();
          const end = mStreamTo(_ms, _mw, 0.32 + 0.1 * flow, F + lvl, 0.0028 * (0.45 + 0.55 * flow));
          st.visible = true; mLive.streamMat.opacity = 0.62 * Math.min(1, flow * 1.5);
          mLive.streamMat.map.offset.y = -t * 2.6;
          mLive.hit = end;
        } else st.visible = false;
        // the rings on the water, from the stream's foot
        mLive.ripples.forEach((rp, i) => {
          const live = pouring && flow > 0.05 && mLive.hit;
          const ph = ((t * 1.25 + i / mLive.ripples.length) % 1);
          rp.r.visible = !!live;
          if (!live) return;
          rp.r.position.set(mLive.hit.x - MBOWL.x, lvl + 0.0008, mLive.hit.z - MBOWL.z);
          const sc = 0.4 + ph * 2.2; rp.r.scale.set(sc, sc, sc);
          rp.r.material.opacity = (1 - ph) * 0.55 * flow;
        });
        // glints thrown up where the water lands, and catching the light on the stream
        mLive.drops.forEach((d, i) => {
          const live = pouring && flow > 0.05 && mLive.hit;
          d.s.visible = !!live; if (!live) return;
          const ph = ((t * 1.7 + i * 0.137) % 1), a = i * 2.4;
          d.s.position.set(mLive.hit.x + Math.cos(a) * 0.012 * ph, mLive.hit.y + 0.018 * Math.sin(Math.PI * ph), mLive.hit.z + Math.sin(a) * 0.012 * ph);
          d.s.material.opacity = 0.85 * Math.sin(Math.PI * ph) * flow; const s = 0.006 + 0.006 * Math.sin(Math.PI * ph); d.s.scale.set(s, s, 1);
        });
      }
      /* ---- S6: the bowl tipped over the roots, the earth darkening, the breeze and its petals, the light rising */
      { const out = sh === 'S6', b2 = mLive.bowl2, spot = { x: MTREE.x - 0.62, y: MTREE.h, z: MTREE.z + 0.42 };
        const tilt = smooth(cl01((t - (MF.earth0 - 0.2)) / 1.0)) * (1 - smooth(cl01((t - MF.earth1) / 0.6)));
        const lift = smooth(cl01((t - (MF.earth1 + 0.4)) / 0.8));
        b2.visible = out && lift < 0.98;
        // its foot at the top edge of the low frame (S6's lens): held from above, the rest of it out of the picture
        b2.position.set(spot.x - 0.07, spot.y + 0.37 + 0.6 * lift, spot.z + 0.09);
        b2.rotation.set(0, Math.PI / 4, 0); b2.rotateOnAxis(_mt.set(1, 0, 0), -1.25 * tilt);
        const eflow = out && t > MF.earth0 && t < MF.earth1 ? Math.min(1, (t - MF.earth0) * 3) * Math.min(1, (MF.earth1 - t) * 2) : 0;
        if (out && eflow > 0.02) {
          b2.updateMatrix();
          let lo = null;                                            // the rim's lowest point as it tips: where the water leaves it
          for (let i = 0; i < 24; i++) { const a = i / 24 * Math.PI * 2; _mt.set(Math.cos(a) * 0.098, 0.082, Math.sin(a) * 0.098).applyMatrix4(b2.matrix); if (!lo || _mt.y < lo.y) lo = _mt.clone(); }
          _mw.set(spot.x - lo.x, -0.3, spot.z - lo.z).normalize();
          // (thinner and fainter than the vessel's stream: at the insert's 0.9 m the first one read as a white rod)
          const end = mStreamTo(lo, _mw, 0.5, spot.y + 0.004, 0.0035 * eflow + 0.0015);
          mLive.stream.visible = true; mLive.streamMat.opacity = 0.5 * eflow; mLive.streamMat.map.offset.y = -t * 3.2;
          mLive.hit = end;
          mLive.drops.forEach((d, i) => { const ph = ((t * 1.9 + i * 0.137) % 1), a = i * 2.4;
            d.s.visible = true; d.s.position.set(end.x + Math.cos(a) * 0.05 * ph, end.y + 0.06 * Math.sin(Math.PI * ph), end.z + Math.sin(a) * 0.05 * ph);
            d.s.material.opacity = 0.9 * Math.sin(Math.PI * ph) * eflow; const s = 0.01 + 0.01 * Math.sin(Math.PI * ph); d.s.scale.set(s, s, 1); });
        } else if (out) { mLive.stream.visible = false; mLive.drops.forEach(d => { d.s.visible = false; }); }
        const wet = smooth(cl01((t - MF.earth0) / (MF.earth1 - MF.earth0)));
        mLive.wet.visible = out; mLive.wet.material.opacity = 0.7 * wet; mLive.wet.scale.setScalar(0.35 + 0.75 * wet);
        // the glow the light is born in: up as the water settles, gone as the light lifts away
        { const gk = smooth(cl01((t - (MF.mote - 0.5)) / 0.8)) * (1 - smooth(cl01((t - (MF.mote + 1.5)) / 2.0)));
          mLive.groundGlow.visible = out && gk > 0.01; mLive.groundGlow.material.opacity = 0.55 * gk; }
        // the leaves, let go by the breeze, tumbling down out of the canopy through the frame
        mLive.petals.forEach((p) => {
          const t0 = MF.breeze + p.i * 0.3, u = t - t0;
          p.s.visible = out && u > 0 && u < 8;
          if (!p.s.visible) return;
          const a = hash(p.i, 31) * Math.PI * 2, rr = 0.4 + hash(p.i, 37) * 1.8;
          const x0 = spot.x + Math.cos(a) * rr - 0.5, z0 = spot.z + Math.sin(a) * rr + 0.3, y0 = spot.y + 2.2 + hash(p.i, 41) * 2.4;
          p.s.position.set(x0 + Math.sin(u * 1.5 + p.i) * 0.28 + u * 0.12, Math.max(spot.y + 0.02, y0 - u * 0.55), z0 + Math.cos(u * 1.2 + p.i) * 0.2);
          const s = 0.11 + hash(p.i, 43) * 0.05; p.s.scale.set(s, s, 1);
          p.s.material.rotation = Math.sin(u * (1.4 + hash(p.i, 47))) * 1.2 + p.i;
          p.s.material.opacity = Math.min(1, u * 2) * (p.s.position.y <= spot.y + 0.03 ? Math.max(0, 1 - (u - 5.5) * 0.6) : 1);
        });
        // the light from the earth
        const m = mLive.mote, h = mLive.moteHalo, mu = t - MF.mote;
        m.visible = h.visible = out && mu > 0;
        if (m.visible) {
          const p = moteAt(t, spot);
          m.position.set(p.x, p.y, p.z); h.position.copy(m.position);
          const born = cl01(mu / 1.2), fadeTop = 1 - cl01((t - 46.2) / 1.6);
          const pulse = 0.85 + 0.15 * Math.sin(mu * 5.2);
          // held at a constant size on screen (a little over a degree, its halo seven), however far it has climbed
          const dcam = Math.hypot(yaw.position.x - p.x, yaw.position.y - p.y, yaw.position.z - wz(p.z));
          const sc = Math.max(0.03, dcam * 0.022) * (0.55 + 0.45 * born) * pulse; m.scale.set(sc, sc, 1); h.scale.set(sc * 7, sc * 7, 1);
          m.material.opacity = born * fadeTop; h.material.opacity = 0.42 * born * fadeTop * pulse;
          mLive.trail.forEach((tr, i) => {
            const tt = t - (i + 1) * 0.11; tr.s.visible = tt > MF.mote + 0.2;
            if (!tr.s.visible) return;
            const q = moteAt(tt, spot); tr.s.position.set(q.x + Math.sin(i * 2.1 + t) * 0.03, q.y, q.z + Math.cos(i * 1.7 + t) * 0.03);
            const s = Math.max(0.012, Math.hypot(yaw.position.x - q.x, yaw.position.y - q.y, yaw.position.z - wz(q.z)) * 0.008) * (1 - i / mLive.trail.length); tr.s.scale.set(s, s, 1);
            tr.s.material.opacity = 0.8 * (1 - i / mLive.trail.length) * born * fadeTop;
          });
        } else mLive.trail.forEach(tr => { tr.s.visible = false; });
      }
      /* ---- flames, and the incense's smoke on the altar */
      for (const f of mLive.flames) { const fl = 0.85 + 0.15 * Math.sin(t * 11 + f.k) * Math.sin(t * 7.3 + f.k * 2);
        f.fl.scale.set(0.05 * fl, 0.11 * (0.9 + 0.2 * fl), 1); f.halo.material.opacity = 0.3 + 0.08 * fl; }
      for (const sm of mLive.smoke) { const u = (sm.t + t / 5.5) % 1, a = mLive.smokeAt;
        sm.sp.position.set(a.x + Math.sin(u * 5 + sm.k) * 0.04 * u, a.y + u * 1.1, a.z + Math.cos(u * 4 + sm.k) * 0.03 * u);
        const sc = 0.05 + u * 0.35; sm.sp.scale.set(sc, sc, 1); sm.sp.material.opacity = Math.sin(Math.PI * u) * 0.2; sm.sp.material.rotation = u * 1.5 + sm.k; }
      /* ---- the monk's head, dipping with the verse (absolute from his rest, never stacked: v11.5) */
      { const mk = merit.monk;
        if (mk.ready && mk.head && mk.rest) {
          if (!mk.restW) { mk.head.updateWorldMatrix(true, false); mk.restW = mk.head.getWorldQuaternion(new THREE.Quaternion()); mk.parW = mk.head.parent.getWorldQuaternion(new THREE.Quaternion()).invert(); }
          _mqa.setFromAxisAngle(_mt.set(0, 0, 1), mLive.monkNod || 0);
          mk.head.quaternion.copy(mk.parW).multiply(_mqa.multiply(mk.restW));
        } }
    }
    const meritCtl = { begin: meritBegin, end: meritEnd, frame: meritFrame, F: MF, tune: mTune, rehold: () => { mHolding = false; } };
    /* the merit film's dusk bed: the temple's evening (birds settling, a far road, the trees) under its outdoor shots,
       held low inside the hall; nothing at all outside the film. The film's own sounds are its cues */
    let duskK = 0;
    function mixBedsM(wdt) {
      const B = DATA.ambience.beds, to = mLive.on ? 0.55 * mLive.duskTo : 0;
      duskK += (to - duskK) * (1 - Math.exp(-wdt / 0.8));
      B[3][1] = duskK;
    }

    /* ============================================== THE ENDINGS (CP9 · docs/V22.0-E3C4-PLAN.md §4.6)
       Four whole stories (v21.30), four different KINDS of answer — A surrenders to the piece, B takes it home to try
       alone, C puts it down and goes, D asks for a teacher — and in every one the owner is kind: he only collects them,
       and says so (no practice and no practitioner is ever the villain). Every picture is a function of its scene's own
       clock (endFrame(k, t)), so a seek, a skip and a one-frame-a-second phone land on the same frame (the merit and
       run-out films' shape); the scenes themselves (scOpen … scTeacher, below build) hold only their cues, their fades
       and the one track that draws them. The light, his room, the street lamps and the presences are DECIDED on the frame
       from the clock; the owner is posed on it; every prop is put where the clock says. Nothing here adds a light
       (v15.1): the dusk, the evening and his room at night are daylight presets, their lamps painted. reset() puts all of
       it back (endReset — the v8.1 law). */
    const E_TK = bundleG.children.filter(m => m.geometry && (m.geometry.type === 'CylinderGeometry' || m.geometry.type === 'TorusGeometry'));
    // his own copy of the fourth piece, for his hands (A, B): the bundle's takrut and its strings, its roll stood up the clasp
    const heldTk = new THREE.Group(); heldTk.visible = false;
    { const inner = new THREE.Group(); inner.rotation.z = Math.PI / 2; heldTk.add(inner);
      for (const m of E_TK) { const q = m.clone(); q.position.y -= 0.0125; inner.add(q); } }
    owned.push({ dispose: () => { if (kit && kit.holding && kit.holding() === heldTk) kit.hold(null); } });
    // A: the takrut on the tiles where it fell with him, the tea spilled, the stool over, the glass of water he is given
    const floorTk = new THREE.Group(); floorTk.visible = false; worldT.add(floorTk);
    for (const m of E_TK) floorTk.add(m.clone());
    const puddle = new THREE.Mesh(new THREE.CircleGeometry(0.15, 28), M({ color: 0x3a1c08, roughness: 0.06, transparent: true, opacity: 0.8, depthWrite: false }));
    puddle.rotation.x = -Math.PI / 2; puddle.scale.set(1.5, 0.75, 1); puddle.position.set(0.22, 0.004, -4.62); puddle.visible = false; worldT.add(puddle);
    const glassW = new THREE.Group(); glassW.visible = false; worldT.add(glassW);
    { const gm = M({ color: 0xe2ecef, roughness: 0.04, transparent: true, opacity: 0.3, depthWrite: false, side: THREE.DoubleSide });
      const wall = new THREE.Mesh(new THREE.CylinderGeometry(0.034, 0.029, 0.11, 20, 1, true), gm); wall.position.y = 0.055; glassW.add(wall);
      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.029, 0.029, 0.007, 20), gm); base.position.y = 0.0035; glassW.add(base);
      const water = new THREE.Mesh(new THREE.CylinderGeometry(0.0315, 0.0285, 0.078, 20), M({ color: 0xa8ccd6, roughness: 0.02, transparent: true, opacity: 0.42, depthWrite: false }));
      water.position.y = 0.046; glassW.add(water);
      // a lit rim and the water's surface catching the light: on the tiles the plain glass all but vanished
      const rim = new THREE.Mesh(new THREE.TorusGeometry(0.0335, 0.0018, 6, 28), M({ color: 0xffffff, roughness: 0.05, emissive: 0xc8d4d8, emissiveIntensity: 0.5, transparent: true, opacity: 0.8 }));
      rim.rotation.x = Math.PI / 2; rim.position.y = 0.11; glassW.add(rim);
      const top = new THREE.Mesh(new THREE.CircleGeometry(0.031, 24), M({ color: 0xdaf0f6, roughness: 0.02, emissive: 0x6a8c96, emissiveIntensity: 0.35, transparent: true, opacity: 0.7, depthWrite: false }));
      top.rotation.x = -Math.PI / 2; top.position.y = 0.086; glassW.add(top); }

    /* ---- A · HIS EYES CLOSING: two lids in front of the lens (children of the camera, 0.1 m out), each a black field
       with a soft curved edge, drawn before the presences' clearer (renderOrder 878) so what he sees with his eyes shut
       is drawn over them; and a red wash and red rings for the thing that is not one of them. IT HAS NO FIGURE (CP11):
       the first build drew it as the red Thao Wessuwan scan turned upside down and blackened — a revered guardian made
       the evil thing by inversion, under "this isn't one of them", minutes after the towkay named him "guardian of the
       north" (the v21.30 rule; the plan only ever asked for whispers and the black rippling red). A figure is the scan
       or nothing, and here it is nothing: the dark, the red, the whispers and his body under it */
    const lidMat = new THREE.MeshBasicMaterial({ map: tex(makeLidT(THREE, cnv)), transparent: true, depthTest: false, depthWrite: false, toneMapped: false, fog: false });
    mats.push(lidMat);
    const lidTop = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.25), lidMat), lidBot = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.25), lidMat);
    lidBot.rotation.z = Math.PI;
    const ripple = new THREE.Mesh(new THREE.PlaneGeometry(0.62, 0.62), new THREE.MeshBasicMaterial({ map: tex(makeRippleT(THREE, cnv)), color: 0xff3018,
      transparent: true, opacity: 0, depthTest: false, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false, fog: false }));
    const redWash = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.6), new THREE.MeshBasicMaterial({ color: 0x3c0206, transparent: true, opacity: 0,
      depthTest: false, depthWrite: false, toneMapped: false, fog: false }));
    mats.push(ripple.material, redWash.material);
    lidTop.renderOrder = lidBot.renderOrder = 878; redWash.renderOrder = 885; ripple.renderOrder = 886;
    ripple.position.set(0, 0, -0.15); redWash.position.set(0, 0, -0.16);
    for (const m of [lidTop, lidBot, ripple, redWash]) { m.frustumCulled = false; m.visible = false; camera.add(m); owned.push(m); }
    owned.push({ dispose: () => { for (const m of [lidTop, lidBot, ripple, redWash]) m.geometry.dispose(); } });
    function eLids(kTop, kBot) {                                  // 0 open … 1 shut
      const show = kTop > 0.002 || kBot > 0.002;
      lidTop.visible = lidBot.visible = show;
      if (!show) return;
      // shut, the two edges cross by 5 cm at the middle (and still by 3 at a desktop's sides, where the curve rises)
      const eT = 0.105 + (-0.03 - 0.105) * kTop, eB = -0.105 + (0.02 + 0.105) * kBot;
      /* the drawn lid's edge (makeLidT: a quadratic from half-height at the corners through 0.92 of it at the middle)
         reaches only 0.71 of the plane's 0.25 below its top at the middle, so the plane stands 0.0525 above the edge it
         is asked for (below, for the lower lid). The first build put it 0.105 above: on a phone, "shut" left the middle
         two thirds of the frame open */
      lidTop.position.set(0, eT + 0.0525, -0.1); lidBot.position.set(0, eB - 0.0525, -0.1);
    }

    /* ---- B · THE PAPER BAG the owner puts it in, and HIS ROOM AT NIGHT: a pocket 250 m under World T (local z −250,
       past the far plane from every world), a 3.2 × 3.6 m HDB bedroom — the desk under the window wall with his lamp, his
       laptop still on the search he keeps making, the talisman from the medium pinned over it, his bed, the clock by it,
       the window onto the blocks at night. Lit by nothing: the night is a daylight preset, the lamp is painted */
    const bagG = new THREE.Group(); bagG.visible = false; worldT.add(bagG);            // its origin at the top of the fold
    { const bm = M({ map: tex(makeBagT(THREE, cnv)), roughness: 0.93 });
      /* (CP11: 0.2 × 0.25 × 0.1 stood 0.66 m from his eyes on the counter and filled a phone's frame — a box the size of
         the owner's chest. A small paper bag for one wrapped piece, and it stands on HIS side of the counter now) */
      const body = new THREE.Mesh(new THREE.BoxGeometry(0.19, 0.2, 0.075), bm); body.position.y = -0.125; body.castShadow = false; bagG.add(body);
      const fold = new THREE.Mesh(new THREE.BoxGeometry(0.19, 0.03, 0.078), bm); fold.position.set(0, -0.03, 0.002); fold.rotation.x = 0.22; bagG.add(fold); }
    const BAG_H = 0.225;                                                              // the fold's top over the bag's bottom
    const RMZ = -250;
    const eRoom = new THREE.Group(); eRoom.position.set(0, 0, RMZ); eRoom.visible = false; worldT.add(eRoom);
    const roomLive = { lamp: 1, glow: [], bulb: null, clockTex: null, clockC: null, clockX: null, clockShown: '', drawer: null, screen: null, analog: null };
    buildRoom();
    function buildRoom() {
      const R = eRoom, W = 3.2, D = 3.6, H = 2.7, x0 = -1.6, x1 = 1.6, z0 = -1.8, z1 = 1.8;
      const mWall = M({ map: tex(makeRoomWallT(THREE, cnv)), color: 0xc4ccd2, roughness: 0.94 });
      const mFloor = M({ map: tex(makeTeak(THREE, cnv, 5101)), color: 0xa88a6a, roughness: 0.6 });
      const mCeil = M({ color: 0xe4e6e2, roughness: 0.95 });
      const mWood = M({ map: tex(makeTeak(THREE, cnv, 5107)), color: 0x9a7452, roughness: 0.55 });
      const mWhite = M({ color: 0xeceae4, roughness: 0.6 });
      const mDark = M({ color: 0x1e1e22, roughness: 0.5, metalness: 0.2 });
      const mSheet = M({ color: 0x5a6a8a, roughness: 0.95 }), mPillow = M({ color: 0xd8dcd6, roughness: 0.95 }), mBlanket = M({ color: 0x3a4a6a, roughness: 0.96 });
      const tiled = (w, h, mat, per, x, y, z, ry = 0, rx = 0) => {
        const geo = new THREE.PlaneGeometry(w, h), uv = geo.attributes.uv;
        for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * w / per, uv.getY(i) * h / per);
        const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.rotation.set(rx, ry, 0, 'YXZ'); m.receiveShadow = false; R.add(m); return m;
      };
      tiled(W, D, mFloor, 1.0, 0, 0, 0, 0, -Math.PI / 2);
      tiled(W, D, mCeil, 3.6, 0, H, 0, 0, Math.PI / 2);
      tiled(W, H, mWall, 1.6, 0, H / 2, z0, 0);                                      // the back wall (the desk's)
      tiled(W, H, mWall, 1.6, 0, H / 2, z1, Math.PI);                                // the front wall (the door's)
      tiled(D, H, mWall, 1.6, x0, H / 2, 0, Math.PI / 2);                            // the left (the bed's)
      // the right wall, round its window (z −0.2 … 1.0, y 0.9 … 2.1)
      const WZ0 = -0.2, WZ1 = 1.0, WY0 = 0.9, WY1 = 2.1;
      tiled(D, WY0, mWall, 1.6, x1, WY0 / 2, 0, -Math.PI / 2);
      tiled(D, H - WY1, mWall, 1.6, x1, (H + WY1) / 2, 0, -Math.PI / 2);
      tiled(WZ0 - z0, WY1 - WY0, mWall, 1.6, x1, (WY0 + WY1) / 2, (z0 + WZ0) / 2, -Math.PI / 2);
      tiled(z1 - WZ1, WY1 - WY0, mWall, 1.6, x1, (WY0 + WY1) / 2, (WZ1 + z1) / 2, -Math.PI / 2);
      for (const [w, d, x, z] of [[W, 0.02, 0, z0 + 0.01], [W, 0.02, 0, z1 - 0.01], [0.02, D, x0 + 0.01, 0], [0.02, D, x1 - 0.01, 0]]) box(w, 0.09, d, x, 0.045, z, mWhite, R, false);
      // the window: its frame, a mullion, dark glass, the night beyond (the blocks across, painted, unlit so their windows glow)
      const fr = M({ color: 0xd8dad6, roughness: 0.4, metalness: 0.3 });
      for (const [w, h, y, z] of [[0.06, WY1 - WY0 + 0.06, (WY0 + WY1) / 2, WZ0], [0.06, WY1 - WY0 + 0.06, (WY0 + WY1) / 2, WZ1], [0.06, 0.05, WY0, (WZ0 + WZ1) / 2],
                                  [0.06, 0.05, WY1, (WZ0 + WZ1) / 2], [0.05, WY1 - WY0, (WY0 + WY1) / 2, (WZ0 + WZ1) / 2]]) box(0.06, h, w === 0.06 && h === 0.05 ? WZ1 - WZ0 : w === 0.05 ? 0.04 : 0.06, x1, y, z, fr, R, false);
      { const g = new THREE.Mesh(new THREE.PlaneGeometry(WZ1 - WZ0, WY1 - WY0), new THREE.MeshBasicMaterial({ color: 0x0a1220, transparent: true, opacity: 0.32, depthWrite: false }));
        mats.push(g.material); g.position.set(x1 + 0.01, (WY0 + WY1) / 2, (WZ0 + WZ1) / 2); g.rotation.y = -Math.PI / 2; g.renderOrder = 6; R.add(g);
        const v = new THREE.Mesh(new THREE.PlaneGeometry(14, 9), new THREE.MeshBasicMaterial({ map: tex(makeNightBlocksT(THREE, cnv)), toneMapped: false, fog: false }));
        mats.push(v.material); v.position.set(x1 + 6.5, 2.4, 0.4); v.rotation.y = -Math.PI / 2; R.add(v); }
      // its curtains, drawn half across, in folds
      { const cm = M({ color: 0x8a96a8, roughness: 0.96, side: THREE.DoubleSide });
        for (let i = 0; i < 6; i++) { const s = i < 3 ? -1 : 1, k = i % 3;
          const p = new THREE.Mesh(new THREE.PlaneGeometry(0.16, 1.5), cm); p.position.set(x1 - 0.12 - 0.03 * (k % 2), 1.48, s < 0 ? WZ0 - 0.05 + k * 0.13 : WZ1 + 0.05 - k * 0.13);
          p.rotation.y = -Math.PI / 2 + (k % 2 ? 0.45 : -0.45); R.add(p); }
        box(0.03, 0.03, WZ1 - WZ0 + 0.7, x1 - 0.12, 2.25, (WZ0 + WZ1) / 2, mDark, R, false); }
      // the moon through the glass, on the floor and the bed (painted)
      const glowP = (w, h, color, op, x, y, z, rx, ry) => {
        const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tLive.tGlow, color, transparent: true, opacity: op, depthWrite: false,
          blending: THREE.AdditiveBlending, toneMapped: false, fog: false }));
        mats.push(m.material); m.position.set(x, y, z); m.rotation.set(rx || 0, ry || 0, 0, 'YXZ'); m.renderOrder = 4; m.userData.op = op; R.add(m); return m;
      };
      glowP(1.4, 1.8, 0x8aa4d8, 0.16, 0.7, 0.012, 0.45, -Math.PI / 2);
      // THE DESK under the back wall, a pedestal of drawers at its right end, the top one his to open and shut
      const DT = 0.74, DX0 = -1.0, DX1 = 0.3, DZ = -1.49;
      box(DX1 - DX0, 0.035, 0.62, (DX0 + DX1) / 2, DT, DZ, mWood, R, false);
      box(0.03, DT, 0.58, DX0 + 0.03, DT / 2, DZ, mWood, R, false);
      box(0.42, DT - 0.04, 0.58, DX1 - 0.21, (DT - 0.04) / 2, DZ, mWood, R, false);
      // its back panel, between the leg and the pedestal (CP11: without it the white skirting under the desk read, on a
      // phone, as a lit bar floating across the bottom of every desk shot)
      box(DX1 - 0.42 - (DX0 + 0.045), 0.6, 0.015, (DX1 - 0.42 + DX0 + 0.045) / 2, 0.42, DZ - 0.27, mWood, R, false);
      for (const y of [0.42, 0.22]) box(0.38, 0.17, 0.012, DX1 - 0.21, y, DZ + 0.296, mWood, R, false);
      { const dr = new THREE.Group(); dr.position.set(DX1 - 0.21, 0.6, DZ); R.add(dr);
        box(0.38, 0.14, 0.012, 0, 0, 0.296, mWood, dr, false);                       // its front
        box(0.34, 0.1, 0.5, 0, -0.005, 0.03, M({ color: 0x6a5038, roughness: 0.7 }), dr, false);
        box(0.08, 0.012, 0.02, 0, 0.0, 0.31, M({ color: 0xb8b4a8, roughness: 0.3, metalness: 0.8 }), dr, false);
        roomLive.drawer = dr; }
      // the lamp at the desk's left: a weighted foot, two arms, a green shade over a bulb; its pool on the desk, its glow
      // up the wall (both painted), a halo round the bulb
      { const L = new THREE.Group(); L.position.set(-0.82, DT + 0.018, -1.62); R.add(L);
        const mg = M({ color: 0x24402e, roughness: 0.35, metalness: 0.4, side: THREE.DoubleSide });
        cyl(0.07, 0.08, 0.025, 0, 0.012, 0, mg, 20, L);
        const a1 = cyl(0.009, 0.009, 0.36, 0.02, 0.19, 0.02, mDark, 8, L); a1.rotation.z = -0.12;
        const a2 = cyl(0.008, 0.008, 0.3, 0.13, 0.38, 0.1, mDark, 8, L); a2.rotation.set(0.6, 0, -0.9);
        const sh = new THREE.Mesh(new THREE.ConeGeometry(0.085, 0.13, 20, 1, true), mg); sh.position.set(0.25, 0.37, 0.2); sh.rotation.set(-0.55, 0, 0.35); L.add(sh);
        const b = new THREE.Mesh(new THREE.SphereGeometry(0.028, 12, 8), new THREE.MeshBasicMaterial({ color: 0xfff0c8, toneMapped: false })); mats.push(b.material);
        b.position.set(0.24, 0.33, 0.21); L.add(b); roomLive.bulb = b; }
      roomLive.glow.push(glowP(1.25, 1.0, 0xffcc80, 0.55, -0.42, DT + 0.022, -1.38, -Math.PI / 2));
      roomLive.glow.push(glowP(1.9, 1.6, 0xffc070, 0.32, -0.55, 1.15, z0 + 0.012));
      roomLive.glow.push(glowP(0.42, 0.42, 0xfff0c8, 0.6, -0.58, DT + 0.33, -1.42));
      // his laptop, open, the screen on the page he keeps coming back to
      { const lp = new THREE.Group(); lp.position.set(-0.08, DT + 0.018, -1.43); lp.rotation.y = -0.08; R.add(lp);
        box(0.33, 0.014, 0.23, 0, 0.007, 0, M({ color: 0x3a3c40, roughness: 0.4, metalness: 0.5 }), lp, false);
        const hinge = new THREE.Group(); hinge.position.set(0, 0.014, -0.112); hinge.rotation.x = -0.3; lp.add(hinge);
        box(0.33, 0.215, 0.008, 0, 0.108, 0, M({ color: 0x2a2c30, roughness: 0.4, metalness: 0.5 }), hinge, false);
        const scr = new THREE.Mesh(new THREE.PlaneGeometry(0.31, 0.195), new THREE.MeshBasicMaterial({ map: tex(makeSearchT(THREE, cnv)), toneMapped: false })); mats.push(scr.material);
        scr.position.set(0, 0.108, 0.0045); hinge.add(scr); roomLive.screen = scr;
        roomLive.glow.push(glowP(0.7, 0.5, 0xb8d0ff, 0.12, -0.08, DT + 0.021, -1.2, -Math.PI / 2)); }
      // the paper bag's place on the desk, a mug, his phone, a small clock that ticks
      { const mug = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.036, 0.095, 18), M({ color: 0xe8e2d6, roughness: 0.5 })); mug.position.set(0.17, DT + 0.066, -1.33); R.add(mug);
        box(0.075, 0.008, 0.15, 0.08, DT + 0.022, -1.24, M({ color: 0x14161a, roughness: 0.3, metalness: 0.4 }), R, false);
        const ac = new THREE.Group(); ac.position.set(0.2, DT + 0.018, -1.66); ac.rotation.y = -0.35; R.add(ac);
        cyl(0.05, 0.05, 0.03, 0, 0.065, 0, M({ color: 0xa83a2a, roughness: 0.4, metalness: 0.3 }), 20, ac).rotation.x = Math.PI / 2;
        const face = new THREE.Mesh(new THREE.CircleGeometry(0.042, 24), M({ map: tex(makeAlarmFaceT(THREE, cnv)), roughness: 0.5 })); face.position.set(0, 0.065, 0.016); ac.add(face);
        for (const s of [-1, 1]) { const l = cyl(0.005, 0.005, 0.03, s * 0.03, 0.012, 0, mDark, 6, ac); l.rotation.z = s * 0.4; }
        roomLive.analog = ac; }
      // the talisman from the medium, pinned over the desk
      { const tm = new THREE.Mesh(new THREE.PlaneGeometry(0.12, 0.33), M({ map: tex(makeFuT(THREE, cnv)), roughness: 0.9 })); tm.position.set(-0.32, 1.6, z0 + 0.008); tm.rotation.z = 0.03; R.add(tm);
        const pin = new THREE.Mesh(new THREE.SphereGeometry(0.008, 8, 6), M({ color: 0xc82a20, roughness: 0.4 })); pin.position.set(-0.32, 1.75, z0 + 0.012); R.add(pin); }
      // THE BED along the left wall, its head to the back; the clock by it; a shelf over it with books and a small Buddha
      box(0.96, 0.3, 2.0, x0 + 0.48, 0.15, 0.4, mWood, R, false);
      box(0.92, 0.18, 1.96, x0 + 0.48, 0.39, 0.4, mSheet, R, false);
      { const p = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 10), mPillow); p.scale.set(1.3, 0.32, 0.8); p.position.set(x0 + 0.48, 0.52, -0.42); R.add(p); }
      { const bl = box(0.94, 0.06, 1.25, x0 + 0.48, 0.5, 0.7, mBlanket, R, false); bl.rotation.z = 0.02;
        const fold = box(0.94, 0.07, 0.22, x0 + 0.48, 0.53, 0.1, mBlanket, R, false); fold.rotation.x = -0.15; }
      box(0.4, 0.5, 0.38, x0 + 0.24, 0.25, -1.18, mWood, R, false);
      { const ck = new THREE.Group(); ck.position.set(x0 + 0.3, 0.5, -1.1); ck.rotation.y = 0.5; R.add(ck);
        box(0.15, 0.065, 0.06, 0, 0.033, 0, mDark, ck, false);
        const [c, x] = sized(cnv, 256, 112); roomLive.clockC = c; roomLive.clockX = x;
        const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; tex(t); roomLive.clockTex = t;
        const f = new THREE.Mesh(new THREE.PlaneGeometry(0.13, 0.055), new THREE.MeshBasicMaterial({ map: t, toneMapped: false })); mats.push(f.material);
        f.position.set(0, 0.034, 0.031); ck.add(f); roomClock('23:47'); }
      box(1.1, 0.025, 0.22, x0 + 0.13, 1.62, 0.3, mWood, R, false).rotation.y = Math.PI / 2;
      { const r = rng(5113); let z = -0.15;
        for (let i = 0; i < 9; i++) { const h = 0.16 + r() * 0.08, w = 0.025 + r() * 0.02;
          box(0.16, h, w, x0 + 0.12, 1.633 + h / 2, z, M({ color: [0x7a2a24, 0x2a4a6a, 0xd8c8a0, 0x3a5a3a, 0x6a4a2a][i % 5], roughness: 0.8 }), R, false); z += w + 0.004; } }
      thai('buddha', x0 + 0.14, 1.633, 0.6, { s: 0.22, parent: R, cast: false, ry: Math.PI / 2 });
      // the door, shut, on the front wall
      box(0.86, 2.05, 0.04, 0.9, 1.025, z1 - 0.025, mWood, R, false);
      box(0.1, 0.02, 0.03, 0.55, 1.0, z1 - 0.06, M({ color: 0xb8b4a8, roughness: 0.3, metalness: 0.8 }), R, false);
      // the ceiling's lamp, off
      cyl(0.18, 0.2, 0.06, 0, H - 0.03, 0.1, mWhite, 24, R);
    }
    function roomClock(s) {
      if (roomLive.clockShown === s) return;
      roomLive.clockShown = s;
      const x = roomLive.clockX, c = roomLive.clockC;
      x.fillStyle = '#060404'; x.fillRect(0, 0, c.width, c.height);
      x.font = 'bold 84px monospace'; x.textAlign = 'center'; x.textBaseline = 'middle';
      x.fillStyle = 'rgba(255,40,30,0.12)'; x.fillText('88:88', 128, 58);
      x.fillStyle = '#ff3a24'; x.shadowColor = '#ff2a10'; x.shadowBlur = 14; x.fillText(s, 128, 58); x.shadowBlur = 0;
      roomLive.clockTex.needsUpdate = true;
    }

    /* ---- D · THE CARD the owner writes on: his shop's name card, its back filled as the pen goes (a canvas redrawn only
       when another letter is due), and the pen */
    const cardG = new THREE.Group(); cardG.visible = false; worldT.add(cardG);
    const cardBack = { c: null, x: null, tex: null, n: -1 };
    const CARD_LINES = ['Temple · Sun 8 am', 'meditation class', 'ask for the monk'];
    const CARD_N = CARD_LINES.reduce((a, l) => a + l.length, 0);
    { const [c, x] = sized(cnv, 512, 304); cardBack.c = c; cardBack.x = x;
      const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; tex(t); cardBack.tex = t;
      const back = new THREE.Mesh(new THREE.PlaneGeometry(0.09, 0.054), M({ map: t, roughness: 0.92 })); cardG.add(back);
      const front = new THREE.Mesh(new THREE.PlaneGeometry(0.09, 0.054), M({ map: tex(makeCardFrontT(THREE, cnv)), roughness: 0.85 }));
      front.rotation.y = Math.PI; front.position.z = -0.0004; cardG.add(front);
      cardWrite(0); }
    function cardWrite(n) {
      n = Math.max(0, Math.min(CARD_N, Math.floor(n)));
      if (n === cardBack.n) return;
      cardBack.n = n;
      const x = cardBack.x, r = rng(5131);
      x.fillStyle = '#f4f0e6'; x.fillRect(0, 0, 512, 304);
      x.fillStyle = 'rgba(120,110,90,0.08)'; for (let i = 0; i < 140; i++) x.fillRect(r() * 512, r() * 304, 2, 2);
      x.fillStyle = '#1c2a6a'; x.textBaseline = 'alphabetic';
      let left = n;
      CARD_LINES.forEach((line, li) => {
        let cx = 44 + li * 10, cy = 92 + li * 82;
        for (let i = 0; i < line.length; i++) {
          const ch = line[i], jit = r() - 0.5, rot = (r() - 0.5) * 0.12, sz = 46 + (r() - 0.5) * 6;
          x.font = `italic 600 ${sz.toFixed(0)}px "Segoe Print", "Bradley Hand", "Noteworthy", "Comic Sans MS", cursive`;
          const w = x.measureText(ch).width;
          if (left > 0) { x.save(); x.translate(cx, cy + jit * 4); x.rotate(rot - 0.04); x.fillText(ch, 0, 0); x.restore(); left--; }
          cx += w * 0.96;
        }
        if (li === 2 && n >= CARD_N) { x.strokeStyle = '#1c2a6a'; x.lineWidth = 3; x.beginPath(); x.moveTo(60, cy + 14); x.quadraticCurveTo(250, cy + 24, 440, cy + 10); x.stroke(); }
      });
      cardBack.tex.needsUpdate = true;
    }
    const penG = new THREE.Group(); penG.visible = false; worldT.add(penG);           // its origin at the nib
    { const body = new THREE.Mesh(new THREE.CylinderGeometry(0.0045, 0.0042, 0.12, 12), M({ color: 0x14141a, roughness: 0.3, metalness: 0.4 })); body.position.y = 0.072; penG.add(body);
      const nib = new THREE.Mesh(new THREE.ConeGeometry(0.0042, 0.014, 12), M({ color: 0xc8c4b8, roughness: 0.25, metalness: 0.9 })); nib.rotation.x = Math.PI; nib.position.y = 0.007; penG.add(nib);
      const clip = box(0.002, 0.04, 0.004, 0.0048, 0.11, 0, M({ color: 0xd4a840, roughness: 0.3, metalness: 0.9 }), penG, false); void clip; }

    /* ---- A and D · THE STREET AT DUSK AND IN THE EVENING: tubes under the five-foot way's ceiling and lamps on poles
       along the far verge, each painted with its pool (an unlit head, an additive pool — no lamp is a light, v15.1);
       `endLive.lampK` brings them up, each at its own moment (D: the lamps coming on down the street) */
    const lampsG = new THREE.Group(); lampsG.visible = false; worldT.add(lampsG);
    const lampUnits = [];
    { const tube = new THREE.MeshBasicMaterial({ color: 0x7a7c80, toneMapped: false }); mats.push(tube);
      const head = new THREE.MeshBasicMaterial({ color: 0x6a5a40, toneMapped: false }); mats.push(head);
      const pole = M({ color: 0x4a4e52, roughness: 0.6, metalness: 0.5 });
      const pool = (w, h, color, op, x, y, z) => {
        const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tLive.tGlow, color, transparent: true, opacity: 0, depthWrite: false,
          blending: THREE.AdditiveBlending, toneMapped: false, fog: false }));
        mats.push(m.material); m.rotation.x = -Math.PI / 2; m.position.set(x, y, z); m.renderOrder = 3; m.userData.op = op; lampsG.add(m); return m;
      };
      let i = 0;
      for (let x = -51; x <= 51; x += 6, i++) {
        if (Math.abs(x) < 3.2) continue;                                            // not under the shop's own front
        const t = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.035, 0.07), tube.clone()); mats.push(t.material); t.position.set(x, TFRONT.way - 0.03, 1.15); lampsG.add(t);
        lampUnits.push({ x, at: 0.15 * Math.abs(x) / 51 + 0.08 * hash(i, 501), mesh: t, on: 0xe6f2ff, off: 0x7a7c80,
                         pools: [pool(2.6, 2.4, 0xd8ecff, 0.16, x, 0.012, 1.1)] });
      }
      i = 0;
      for (let x = -56; x <= 56; x += 16, i++) {
        cyl(0.06, 0.085, 7.2, x, 3.6, 15.35, pole, 10, lampsG);
        box(1.5, 0.07, 0.07, x, 7.15, 14.7, pole, lampsG, false).rotation.y = Math.PI / 2;
        const h = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.09, 0.5), head.clone()); mats.push(h.material); h.position.set(x, 7.08, 14.0); lampsG.add(h);
        lampUnits.push({ x, at: 0.3 + 0.55 * ((x + 56) / 112) + 0.1 * hash(i, 503), mesh: h, on: 0xffd08a, off: 0x6a5a40,
                         pools: [pool(6.5, 8.5, 0xffb060, 0.2, x, 0.008, 12.6), pool(1.1, 1.1, 0xffe0a8, 0.0, x, 7.0, 14.0)] });
      }
    }
    function eLamps(k, stagger) {                                                   // k 0..1; stagger: each its own moment
      lampsG.visible = k > 0.001;
      if (!lampsG.visible) return;
      for (const u of lampUnits) {
        const kk = stagger ? cl01((k - u.at) / 0.12) : k, flick = stagger && kk > 0 && kk < 1 ? (hash(Math.floor(k * 90 + u.x), 7) < 0.5 ? 0.25 : 1) : 1;
        const on = kk * flick;
        u.mesh.material.color.setHex(u.off).lerp(_ecol.setHex(u.on), on);
        for (const p of u.pools) p.material.opacity = p.userData.op * on;
      }
    }
    const _ecol = new THREE.Color();

    /* ---- A · THE DARK WINDOW down the five-foot way: a shop shut for the night two doors west, its glass over a dark
       room, the street behind him painted in it — and for a moment, a step behind where he stands, someone in it (a real
       figure, the staff man's scan in the dark, mirrored in where the glass would put what is behind him) */
    const REFL = { x: -10.4, z: 0.07 };
    const reflG = new THREE.Group(); reflG.visible = false; worldT.add(reflG);
    { const inner = new THREE.Mesh(new THREE.BoxGeometry(2.8, 2.5, 3.4), new THREE.MeshBasicMaterial({ color: 0x07080b, side: THREE.BackSide })); mats.push(inner.material);
      inner.position.set(REFL.x, 1.3, REFL.z - 1.72); reflG.add(inner);
      const g = new THREE.Mesh(new THREE.PlaneGeometry(2.8, 2.45), new THREE.MeshBasicMaterial({ map: tex(makeReflT(THREE, cnv)), transparent: true, opacity: 0.62,
        depthWrite: false, toneMapped: false })); mats.push(g.material);
      g.position.set(REFL.x, 1.28, REFL.z); g.renderOrder = 70; reflG.add(g);
      const al = M({ color: 0x8a8e92, roughness: 0.35, metalness: 0.7 });
      for (const [w, h, x, y] of [[2.9, 0.06, REFL.x, 2.53], [2.9, 0.06, REFL.x, 0.04], [0.06, 2.5, REFL.x - 1.43, 1.28], [0.06, 2.5, REFL.x + 1.43, 1.28], [0.05, 2.45, REFL.x + 0.2, 1.28]])
        box(w, h, 0.05, x, y, REFL.z + 0.01, al, reflG, false); }
    const eShade = mkPerson('staffman', { parent: worldT, x: REFL.x + 0.42, z: REFL.z - 1.95, ry: 0, height: 1.7, idle: 'Idle_9', hidden: true,
      then: (P) => { P.model.traverse(m => { if (!m.isMesh) return; m.material = m.material.clone(); m.material.color.setHex(0x2a2e38);
                                                 if (m.material.emissive) m.material.emissive.setHex(0x000000); mats.push(m.material); m.castShadow = false; }); } });

    /* ---- the light of the endings (five stops each, as every World T preset has, so the sky tweens) */
    const T_DUSK = { stops: [[0.00, '#e89a64'], [0.12, '#b8786a'], [0.35, '#6a6488'], [0.65, '#2e3a62'], [1.00, '#141c3a']],
      bg: 0x4a4a62, fog: [0x5a5268, 0.012], hemi: [0x8a94c8, 0x3a2a22, 0.5], key: [0xffa070, 0.38, -8, 3, 2], fill: [0x6a7ab8, 0.24],
      stars: 0, moon: 0, sun: 0, clouds: 0, vmHemi: [0x9aa4d0, 0x3a2a22, 0.6], vmKey: [0xffa878, 0.42] };
    const T_EVE = { stops: [[0.00, '#7a6a8a'], [0.12, '#5a5a82'], [0.35, '#34407a'], [0.65, '#1c2856'], [1.00, '#0c1230']],
      bg: 0x26304e, fog: [0x2a3252, 0.01], hemi: [0x7a88c8, 0x1e1a1c, 0.42], key: [0xb8c4ff, 0.18, -6, 6, 2], fill: [0x4a5a9a, 0.24],
      stars: 0.35, moon: 0, sun: 0, clouds: 0, vmHemi: [0x8a98d0, 0x241e1c, 0.55], vmKey: [0xffc890, 0.3] };
    const T_ROOM = { stops: [[0.00, '#141c30'], [0.12, '#10182a'], [0.35, '#0c1222'], [0.65, '#080c18'], [1.00, '#04060e']],
      bg: 0x060a14, fog: [0x060a14, 0.0004], hemi: [0x6a7ab0, 0x141016, 0.3], key: [0x9ab0e8, 0.16, 6, 3, 1], fill: [0xffb070, 0.12],
      stars: 0, moon: 0, sun: 0, clouds: 0, vmHemi: [0xb8a088, 0x141016, 0.55], vmKey: [0xffc888, 0.5] };

    /* ---- the controller */
    /* (endLive, the endings' own state, is declared beside tLive: bundlePlace, presTick and mixBedsT read it, and the first
       two are called while build() runs — a later `const` would be in its dead zone then, the v21.1 trap) */
    const _eV = new THREE.Vector3(), _eQ = new THREE.Quaternion(), _eQ2 = new THREE.Quaternion(), _eF = new THREE.Vector3(), _eR = new THREE.Vector3(), _eU = new THREE.Vector3();
    const eS = (a, b, t) => smooth(cl01((t - a) / (b - a)));                         // eased 0 → 1 between a and b
    function eCam(x, y, z, ry, px, roll) { yaw.position.set(x, y, z); yaw.rotation.y = ry; pitch.rotation.x = px; camera.rotation.z = roll || 0; }
    function eAim(x, y, z, tx, ty, tz, roll) { const dx = tx - x, dy = ty - y, dz = tz - z; eCam(x, y, z, Math.atan2(-dx, -dz), Math.atan2(dy, Math.hypot(dx, dz)), roll); }
    const eYaw = (x, z, tx, tz) => Math.atan2(-(tx - x), -(tz - z));
    const ePitch = (x, y, z, tx, ty, tz) => Math.atan2(ty - y, Math.hypot(tx - x, tz - z));
    const eMix = (a, b, k) => a + angTo(a, b) * k;
    function eDay(p) { if (endLive.day !== p && kit) { endLive.day = p; kit.daylight(p, 0); } }
    function eLens(f) { if (Math.abs(camera.fov - f) > 1e-3) { camera.fov = f; camera.updateProjectionMatrix(); } }
    // where the camera is looking, for a thing put in front of it
    function eBasis() {
      const ry = yaw.rotation.y, px = pitch.rotation.x;
      _eF.set(-Math.sin(ry) * Math.cos(px), Math.sin(px), -Math.cos(ry) * Math.cos(px));
      _eR.set(Math.cos(ry), 0, -Math.sin(ry));
      _eU.crossVectors(_eR, _eF);
    }
    function eFront(d, x, y, out) { return out.copy(yaw.position).addScaledVector(_eF, d).addScaledVector(_eR, x).addScaledVector(_eU, y); }
    // THE PRESENCES, while an ending owns them: drawn at k (0..1), each where the ending puts it; presTick stands aside
    function ePres(k, a) {
      const P = PRES[k]; if (!P.ready) return;
      a = Math.max(0, a);
      P.k = P.to = a; P.frozen = true;
      const vis = a > 0.003;
      P.g.visible = vis; if (P.halo) P.halo.visible = vis && endLive.halos;
      for (const m of P.mats) m.opacity = m.userData.peak * a;
      if (P.halo && vis) { P.halo.material.opacity = P.haloPeak * a; P.halo.quaternion.copy(yaw.quaternion).multiply(pitch.quaternion); }
      if (vis) endLive.presVis = true;
    }
    function ePresHome() {                                                          // each where it formed
      const H0 = endLive.pres0; if (!H0) return;
      for (const k of ORDER) { const P = PRES[k], h = H0[k]; P.g.position.copy(h.p); P.g.rotation.copy(h.r); P.g.scale.copy(h.s); }
      if (PRES.naga.halo) PRES.naga.halo.position.set(PRES.naga.g.position.x, 1.5, PRES.naga.g.position.z + 0.6);
    }
    // THE OWNER, posed by the ending: where he stands, which way he faces, how far he leans over (about his feet)
    function eOwner(x, z, ry, lean) {
      const P = tLive.owner; if (!P || !P.group) return;
      P.group.rotation.order = 'YXZ';
      P.group.position.set(x - TX, 0, z); P.group.rotation.set(lean || 0, ry, 0);
    }
    function eTalk(secs) { personTalk(tLive.owner, secs); }
    /* a thing HELD UP in his right hand — the index fingertip's leaf, the thing hanging from it and turned to the lens,
       the hand risen from below the frame by `up`, slid in until the fingertip stands a little left of the middle on a
       narrow screen (e3c3's holdUp, as a function of the clock rather than a track) */
    function eHoldUp(api, obj, up, o = {}) {
      const hand = api.rightHand && api.rightHand();
      if (hand && !endLive.holdBone) hand.traverse(q => { if (!endLive.holdBone && /f_index03R?_end$|f_index\.?03\.?R_end$/i.test(q.name)) endLive.holdBone = q; });
      const bone = endLive.holdBone;
      api.handsRoot.visible = true; api.armR.visible = true;
      api.handsPose(0, 0, { from: 'rest', relax: o.relax === undefined ? 0.15 : o.relax });
      const lift = o.lift === undefined ? 0.33 : o.lift;
      api.armR.position.y += -0.2 + lift * up - 0.25 * (1 - up); api.armR.position.x -= (o.x === undefined ? 0.05 : o.x) * up; api.armR.position.z += (o.z === undefined ? 0.11 : o.z) * up;
      if (!bone) return;
      if (!endLive.holdPend) endLive.holdPend = new THREE.Group();
      const pend = endLive.holdPend;
      if (pend.parent !== bone) bone.add(pend);
      if (obj.parent !== pend) { pend.add(obj); obj.position.set(0, 0, 0); obj.rotation.set(0, 0, 0); }
      obj.visible = up > 0.01;
      if (api.vmCam && up > 0) {
        api.armR.updateMatrixWorld(true); bone.getWorldPosition(_eV);
        const hw = Math.tan(api.vmCam.fov * Math.PI / 360) * api.vmCam.aspect * Math.max(0.05, -_eV.z);
        const need = Math.max(0, -0.1 * hw - _eV.x) * up;
        if (need > 0) { api.armR.parent.getWorldQuaternion(_eQ); api.armR.position.add(_eV.set(need, 0, 0).applyQuaternion(_eQ.invert())); }
      }
      bone.updateWorldMatrix(true, false); bone.getWorldQuaternion(_eQ);
      _eQ2.setFromAxisAngle(_eV.set(1, 0, 0), -api.pitch.rotation.x + (o.tilt || 0));
      pend.quaternion.copy(_eQ.invert().multiply(_eQ2));
      bone.getWorldScale(_eV); pend.scale.setScalar(1 / (_eV.x || 1));
    }
    function eDrop() {                                                              // what eHoldUp hung, put back in the world
      const pend = endLive.holdPend;
      if (pend) { for (const c of [...pend.children]) { pend.remove(c); worldT.add(c); c.visible = false; } if (pend.parent) pend.parent.remove(pend); }
    }
    // the clasp: the hands joined (kit.pray's own pose), risen from below the frame by `up`, the takrut between them
    function eClasp(api, up, withTk) {
      api.handsRoot.visible = true; api.armR.visible = true;
      api.handsPose(0, 0, { y: CLASP.y });
      const off = 0.2 * (1 - up), L = api.prayerArm && api.prayerArm();
      api.armR.position.y -= off; if (L) L.position.y -= off;
      if (withTk && kit && kit.holding && kit.holding() !== heldTk) { heldTk.visible = true; kit.hold(heldTk, { clasp: true, lift: 0.05 }); }
      if (!withTk && kit && kit.holding && kit.holding() === heldTk) { kit.hold(null); heldTk.visible = false; }
    }
    function eHandsAway(api) {
      if (kit && kit.holding && kit.holding() === heldTk) { kit.hold(null); heldTk.visible = false; }
      api.handsRoot.visible = false;
    }
    // the clock: running again (C, D, B's morning) or not; its minute hand put on (A: twenty minutes gone)
    function eClock(run, minutes) {
      tLive.clockOn = run; tLive.frozen = !run;
      if (run) { tX.silentTo = 0; tX.fanTo = 1; tX.tickTo = 1; } else tLive.fanK = 0;
      const H2 = tLive.clockHands; if (!H2) return;
      const m = minutes === undefined ? 25 : minutes;
      H2.mG.rotation.z = -m / 60 * Math.PI * 2; H2.hG.rotation.z = -(4 + m / 60) / 12 * Math.PI * 2;
    }
    function eBundle(o) { endLive.bundleAt = o; }
    /* the five-foot way's potted plants (buildStreetT records them, in World T's own numbers): a walk along it bends
       round one, toward the shop fronts, rather than through it (the phone's photographs walked ending A into one) */
    function ePotZ(x, z) {
      let zz = z;
      for (const p of tLive.pots || []) {
        if (p.z < 0.2 || p.z > TWAY.z1) continue;                   // our own five-foot way's, not the far row's
        const dx = Math.abs(x - (TX + p.x)); if (dx > 1.2) continue;
        const clear = p.z - 0.68, w = 1 - eS(0.55, 1.2, dx);
        if (zz > clear) zz += (clear - zz) * w;
      }
      return zz;
    }
    const _ehd = new THREE.Vector3();
    /* on his back on the tiles: the lens on the owner's face as he bends over him (his head bone, a frame old — the
       first build aimed at a fixed point and the phone's frame cut his face at its top edge) */
    function eFloorAim() {
      const P = tLive.owner, H = P && P.ready && P.head ? P.head.getWorldPosition(_ehd) : null;
      if (!H) return { y: 0, p: 1.2 };
      return { y: eYaw(A_FLOOR.x, A_FLOOR.z, H.x, H.z), p: Math.min(1.5, ePitch(A_FLOOR.x, A_FLOOR.y, A_FLOOR.z, H.x, H.y - 0.12, H.z)) };
    }
    function eTk(onCounter) { for (const m of E_TK) m.visible = onCounter; }

    function endBegin(k, api) {
      endLive.on = k; endLive.where = 'shop'; endLive.day = null; endLive.presOwn = true; endLive.halos = true;
      endLive.tension = 0.45; endLive.bundleAt = null; endLive.dusk = endLive.room = 0;
      endLive.t0 = { x: yaw.position.x, y: yaw.position.y, z: yaw.position.z, ry: yaw.rotation.y, p: pitch.rotation.x };
      endLive.spilt = false;
      for (const c of tLive.cups) if (!c.home) c.home = { p: c.cup.position.clone(), r: c.cup.rotation.clone() };
      const P = tLive.owner; endLive.owner0 = P && P.group ? { p: P.group.position.clone(), r: P.group.rotation.clone() } : null;
      endLive.pres0 = {}; for (const kk of ORDER) { const Q = PRES[kk]; endLive.pres0[kk] = { p: Q.g.position.clone(), r: Q.g.rotation.clone(), s: Q.g.scale.clone() }; }
      if (tTurn) tTurn = null;
      if (tX.shakeWas.p || tX.shakeWas.r) { pitch.rotation.x -= tX.shakeWas.p; camera.rotation.z -= tX.shakeWas.r; tX.shakeWas.p = tX.shakeWas.r = 0; }
      tX.shake = 0;
    }
    function endFrame(k, t, api) {
      if (endLive.on !== k) endBegin(k, api);
      endLive.presVis = false;
      eBasis();
      if (k === 'A') endA(t, api); else if (k === 'B') endB(t, api); else if (k === 'C') endC(t, api); else endD(t, api);
      presOver.visible = endLive.presVis;
    }
    function endReset() {
      eDrop();
      if (kit && kit.holding && kit.holding() === heldTk) kit.hold(null);
      heldTk.visible = false;
      eLids(0, 0); ripple.visible = redWash.visible = false;
      floorTk.visible = puddle.visible = glassW.visible = bagG.visible = cardG.visible = penG.visible = false;
      eRoom.visible = false; reflG.visible = false; eLamps(0); roomClock('23:47');
      if (roomLive.drawer) roomLive.drawer.position.z = -1.49;
      if (eShade) { eShade.group.visible = false; }
      if (tLive.stool) { tLive.stool.position.set(TSTOOL.x - TX, 0, TSTOOL.z); tLive.stool.rotation.set(0, 0, 0); }
      const cup = tLive.cups[0];
      if (cup && cup.home) { cup.cup.position.copy(cup.home.p); cup.cup.rotation.copy(cup.home.r); }
      eTk(true);
      const P = tLive.owner, O = endLive.owner0;
      if (P && P.group && O) { P.group.position.copy(O.p); P.group.rotation.set(0, O.r.y, 0); P.group.rotation.order = 'XYZ'; }
      ePresHome();
      if (tLive.clockHands) eClock(true, 25);
      if (camera.fov !== BASE_FOV) { camera.fov = BASE_FOV; camera.updateProjectionMatrix(); }
      Object.assign(endLive, { on: '', where: 'shop', tension: 0, presOwn: false, presVis: false, day: null, bundleAt: null, holdBone: null, dusk: 0, room: 0, spilt: false });
      if (kit && kit.chill) kit.chill(0, { secs: 0 });
    }

    /* ---------------------------------------------------------------- A · OPEN (worst)
       He takes it between his palms and opens himself to it, all the way; his eyes close. In the dark, the three that
       answered him rush in — and then something that is not one of them, out of the piece, cold and wrong: whispers,
       the black rippling red, his body jerking. Black. The ceiling fan from the floor, the owner bent over him; twenty
       minutes gone on the clock; the stool over, the tea spilled, the piece on the tiles; a glass of water. Then the
       five-foot way at dusk, his hand still shaking — and in a dark shop window, for a moment, someone a step behind
       where he stands. */
    const EA = { take0: 0.2, take1: 1.5, shut0: 5.7, shut1: 6.9, rush0: 8.2, wrong0: 10.4, convulse: 13.2, cut: 17.1, open0: 19.9, open1: 22.9,
                 sit0: 24.4, sit1: 26.7, clock0: 30.5, clock1: 31.7, floor0: 34.7, floor1: 36.0, glass0: 37.4, bend0: 39.7, glassAt: 40.6, bend1: 41.4,
                 out: 42.6, dusk: 43.5, walk0: 43.8, stop: 50.2, look1: 50.9, shade0: 51.0, shade1: 51.95, turn0: 52.0, turn1: 52.8, back0: 53.4,
                 back1: 54.3, walk2: 54.4, end: 64.6 };
    const A_FLOOR = { x: TX + 0.5, y: 0.17, z: -4.2 };              // his eyes on the tiles, where he fell back off the stool
    const A_SIT = { x: TX + 0.5, y: 0.86, z: -4.3 };                 // sat up on the floor
    const A_OWN = { x: TX + 1.2, z: -4.95 };                         // the owner, stepped back from him
    const RUSH = { lersi: { at: 0, x0: -2.4, y0: 0.7, x1: -0.25, y1: 0.12, s: 0.5 }, wess: { at: 0.4, x0: 2.8, y0: -1.6, x1: 0.35, y1: -0.9, s: 0.2 },
                   naga: { at: 0.8, x0: 0.2, y0: -2.2, x1: 0.0, y1: -0.5, s: 0.42 } };
    function endA(t, api) {
      const S0 = endLive.t0;
      if (t < EA.cut) {
        endLive.where = 'shop';
        eDay(T_STILL);
        eClock(false, 25);
        eTk(t < 0.95);
        // THE TAKING, and the opening: the clasp up into the frame with it, his eyes on it, the three behind him brighter
        const up = eS(EA.take0, EA.take1, t), shut = eS(EA.shut0, EA.shut1, t);
        const breathe = 0.006 * Math.sin(t * 1.7);
        eCam(S0.x, S0.y + breathe, S0.z, S0.ry, S0.p + (-0.34 - S0.p) * up - 0.06 * shut, 0);
        if (t < EA.shut1) eClasp(api, up, true); else eHandsAway(api);
        eLids(shut, 0.9 * eS(EA.shut0 + 0.1, EA.shut1, t));
        // in his mind's eye: the three rush at him out of the dark — each from its own side, faster as it comes
        endLive.halos = t < EA.shut1;
        for (const k of ORDER) {
          const P = PRES[k], R = RUSH[k];
          if (t < EA.shut1) { ePresHome(); ePres(k, 0.62 + 0.23 * eS(2.0, 5.6, t)); continue; }
          const u = (t - EA.rush0 - R.at) / 1.3;
          if (u <= 0 || u >= 1) { ePres(k, 0); continue; }
          const d = 9.5 - 9.0 * u * u, x = R.x0 + (R.x1 - R.x0) * u * u, y = R.y0 + (R.y1 - R.y0) * u * u;
          eFront(d, x, y, _eV); P.g.position.set(_eV.x - TX, _eV.y, _eV.z);
          P.g.rotation.set(0, yaw.rotation.y + (k === 'naga' ? Math.PI : 0), 0); P.g.scale.setScalar(R.s);
          if (k === 'lersi' && P.inner) P.g.position.y -= P.inner.position.y * R.s;
          ePres(k, 0.95 * eS(0, 0.18, u) * (1 - eS(0.82, 1, u)));
        }
        // IT: the black rippling red, coming up out of the piece at him (no figure — see the lids' note), his body
        // jerking under it
        const rk = eS(EA.wrong0 - 0.2, 16.8, t);
        ripple.visible = redWash.visible = rk > 0.002;
        if (ripple.visible) {
          ripple.material.opacity = (0.25 + 0.6 * rk) * (0.75 + 0.25 * Math.sin(t * 7.3));
          const sc = 1 + 0.35 * ((t * 0.9) % 1); ripple.scale.setScalar(sc); ripple.rotation.z = t * 0.4;
          redWash.material.opacity = 0.6 * rk;
        }
        const cv = eS(EA.convulse, 16.95, t);
        if (cv > 0) {
          const jerk = Math.pow(Math.max(0, Math.sin(t * 6.1) * Math.sin(t * 3.7 + 1)), 2);
          yaw.rotation.y += cv * (0.05 * Math.sin(t * 37) + 0.08 * jerk);
          pitch.rotation.x += cv * (0.04 * Math.sin(t * 29 + 1) - 0.07 * jerk);
          camera.rotation.z = cv * (0.09 * Math.sin(t * 23) + 0.12 * jerk);
        }
        return;
      }
      // ---- after: everything that was in the dark gone; the shop as twenty minutes have left it
      ripple.visible = redWash.visible = false;
      for (const k of ORDER) ePres(k, 0);
      eTk(false);
      floorTk.visible = t < EA.out + 0.85; floorTk.position.set(0.74, 0, -4.52); floorTk.rotation.set(0, 0.6, 0);
      puddle.visible = floorTk.visible;
      if (tLive.stool) { tLive.stool.position.set(TSTOOL.x - TX - 0.05, 0.17, -4.68); tLive.stool.rotation.set(0, 0.4, Math.PI / 2); }
      const cup = tLive.cups[0];
      // (the stool, the cup and the piece lie where the lens finds them from the floor: the phone's photographs had the
      // cup out of the frame and the piece at its edge)
      if (cup) { endLive.spilt = true; cup.cup.position.set(0.55, 0.033, -4.8); cup.cup.rotation.set(0, 0.3, Math.PI / 2); cup.tea.visible = false; }
      puddle.position.set(0.6, 0.004, -4.71);
      glassW.visible = t >= EA.glassAt && t < EA.out + 0.85; glassW.position.set(0.95, 0, -3.95);
      // (the street comes in at full black: the fade runs out..out+0.8 and back from dusk — CP11 cut at 62 %)
      if (t < EA.out + 0.85) {
        endLive.where = 'shop'; endLive.tension = 0;
        eDay(T_DAY); eClock(true, 45); eLamps(0); reflG.visible = false;
        // the lids: open, shut, open — coming round
        const lo = t < 20.7 ? 1 - 0.45 * eS(EA.open0, 20.6, t) : t < 21.2 ? 0.55 + 0.4 * eS(20.7, 21.15, t) : t < 22.0 ? 0.95 - 0.75 * eS(21.2, 21.9, t) : 0.2 - 0.2 * eS(22.0, EA.open1, t);
        eLids(lo, lo * 0.85);
        eHandsAway(api);
        // the owner: bent over him, then stepped back and standing, then bending to set the water down by him
        if (t < EA.sit0) eOwner(TX + 0.85, -4.65, -0.66, 0.42);
        else if (t < EA.glass0 + 1.4) { const k = eS(EA.sit0, EA.sit1, t); eOwner(TX + 0.85 + (A_OWN.x - TX - 0.85) * k, -4.65 + (A_OWN.z + 4.65) * k, eMix(-0.66, eYaw(A_OWN.x, A_OWN.z, A_SIT.x, A_SIT.z) + Math.PI, k), 0.42 * (1 - k)); }
        else { const k = eS(EA.glass0 + 1.4, EA.bend0, t), bend = eS(EA.bend0, EA.glassAt, t) * (1 - eS(EA.glassAt + 0.1, EA.bend1, t));
               const ox = A_OWN.x + (TX + 1.3 - A_OWN.x) * k, oz = A_OWN.z + (-4.15 - A_OWN.z) * k;
               eOwner(ox, oz, eYaw(ox, oz, TX + 0.95, -3.95) + Math.PI, 0.55 * bend); }
        // the camera: on his back (looking up past the owner's face to the ceiling), sitting up, the clock, the floor,
        // the owner, the glass
        if (t < EA.sit0) {
          const shakeK = eS(20.8, 21.1, t) * (1 - eS(23.4, 23.8, t)), jolt = shakeK * Math.sin(t * 9.5);
          const fa = eFloorAim();
          eCam(A_FLOOR.x + 0.006 * jolt, A_FLOOR.y, A_FLOOR.z, fa.y + 0.04 * Math.sin(t * 0.4), fa.p + 0.03 * Math.sin(t * 0.6) + 0.025 * jolt, 0.04 * jolt);
        } else if (t < EA.clock0) {
          const k = eS(EA.sit0, EA.sit1, t), fa = eFloorAim();
          const ox = A_OWN.x, oz = A_OWN.z, yo = eYaw(A_SIT.x, A_SIT.z, ox, oz), po = ePitch(A_SIT.x, A_SIT.y, A_SIT.z, ox, 1.52, oz);
          eCam(A_FLOOR.x + (A_SIT.x - A_FLOOR.x) * k, A_FLOOR.y + (A_SIT.y - A_FLOOR.y) * k + 0.004 * Math.sin(t * 1.3), A_FLOOR.z + (A_SIT.z - A_FLOOR.z) * k,
               eMix(fa.y, yo, k), fa.p + (po - fa.p) * k, 0);
        } else if (t < EA.floor0) {
          const k = eS(EA.clock0, EA.clock1, t), yo = eYaw(A_SIT.x, A_SIT.z, A_OWN.x, A_OWN.z), po = ePitch(A_SIT.x, A_SIT.y, A_SIT.z, A_OWN.x, 1.52, A_OWN.z);
          const yc = eYaw(A_SIT.x, A_SIT.z, TX + TCLOCK.x, TCLOCK.z), pc = ePitch(A_SIT.x, A_SIT.y, A_SIT.z, TX + TCLOCK.x, TCLOCK.y + 0.2, TCLOCK.z);
          eCam(A_SIT.x, A_SIT.y, A_SIT.z, eMix(yo, yc, k), po + (pc - po) * k, 0);
        } else if (t < EA.glass0) {
          const k = eS(EA.floor0, EA.floor1, t), yc = eYaw(A_SIT.x, A_SIT.z, TX + TCLOCK.x, TCLOCK.z), pc = ePitch(A_SIT.x, A_SIT.y, A_SIT.z, TX + TCLOCK.x, TCLOCK.y + 0.2, TCLOCK.z);
          const yf = eYaw(A_SIT.x, A_SIT.z, TX + 0.62, -4.62), pf = ePitch(A_SIT.x, A_SIT.y, A_SIT.z, TX + 0.62, 0.02, -4.62);
          eCam(A_SIT.x, A_SIT.y, A_SIT.z, eMix(yc, yf + 0.04 * Math.sin(t * 0.5), k), pc + (pf - pc) * k, 0);
        } else {
          // up to the owner as he speaks; down with him to the glass he sets by him
          const k = eS(EA.glass0, EA.glass0 + 1.0, t), g = eS(EA.bend0 + 0.2, EA.glassAt + 0.2, t);
          const yf = eYaw(A_SIT.x, A_SIT.z, TX + 0.62, -4.62), pf = ePitch(A_SIT.x, A_SIT.y, A_SIT.z, TX + 0.62, 0.02, -4.62);
          const P = tLive.owner && tLive.owner.group ? tLive.owner.group.position : null, ox = P ? P.x + TX : A_OWN.x, oz = P ? P.z : A_OWN.z;
          const yo = eYaw(A_SIT.x, A_SIT.z, ox, oz), po = ePitch(A_SIT.x, A_SIT.y, A_SIT.z, ox, 1.45, oz);
          const yg = eYaw(A_SIT.x, A_SIT.z, TX + 0.95, -3.95), pg = ePitch(A_SIT.x, A_SIT.y, A_SIT.z, TX + 0.95, 0.06, -3.95);
          eCam(A_SIT.x, A_SIT.y, A_SIT.z, eMix(eMix(yf, yo, k), yg, g), (pf + (po - pf) * k) * (1 - g) + pg * g, 0);
        }
        // in on the clock, and back out over the pan to the floor (CP11: it snapped from 56° to 72° on the pan's first frame)
        eLens(BASE_FOV - 16 * eS(EA.clock1 - 0.4, EA.clock1 + 1.6, t) * (1 - eS(EA.floor0, EA.floor1, t)));
        return;
      }
      // ---- the five-foot way at dusk, walking home
      eLens(BASE_FOV);
      endLive.where = 'dusk'; endLive.tension = 0;
      eDay(T_DUSK); eLamps(0.85, false); reflG.visible = true;
      eLids(0, 0);
      eOwner(TX + 0.55, -6.85, 0, 0);
      const flick = t > 52.5 && t < 55.5 ? (hash(Math.floor(t * 14), 33) < 0.42 ? 0.15 : 1) : 1;
      for (const u of lampUnits) if (Math.abs(u.x - REFL.x) < 3.1 && u.mesh.position.y < 5) { u.mesh.material.color.setHex(u.off).lerp(_ecol.setHex(u.on), 0.85 * flick); for (const p of u.pools) p.material.opacity = p.userData.op * 0.85 * flick; }
      const X0 = TX - 4.6, XS = TX + REFL.x + 0.15, Z = 1.12;
      let x, ry, py = -0.04, bobA = 1, walkT;
      // (the slowing curve reaches 0.925 at k = 1 — divided by it, so he stops where he stands next; CP11: 0.42 m in a frame)
      if (t < EA.stop) { const k = cl01((t - EA.walk0) / (EA.stop - EA.walk0)); x = X0 + (XS - X0) * (k < 0.85 ? k : 0.85 + (k - 0.85) * (1 - (k - 0.85) / 0.3)) / 0.925; ry = Math.PI / 2 + 0.03 * Math.sin(t * 0.8); walkT = t; bobA = 1 - eS(EA.stop - 0.6, EA.stop, t); }
      else if (t < EA.walk2) {
        x = XS; walkT = EA.stop; bobA = 0;
        ry = t < EA.turn0 ? eMix(Math.PI / 2, 0.06, eS(EA.stop, EA.look1, t)) : t < EA.back0 ? eMix(0.06, Math.PI - 0.15, eS(EA.turn0, EA.turn1, t)) : eMix(Math.PI - 0.15, Math.PI / 2, eS(EA.back0, EA.back1, t));
        py = -0.04 - 0.04 * eS(EA.turn0, EA.turn1, t) * (1 - eS(EA.back0, EA.back1, t));
      } else { const k = (t - EA.walk2); x = XS - 1.2 * k + 0.25 * Math.min(1, k); ry = Math.PI / 2 + (t > 58.0 && t < 59.4 ? 0.7 * Math.sin(Math.PI * (t - 58.0) / 1.4) : 0.02 * Math.sin(t)); walkT = t; bobA = eS(EA.walk2, EA.walk2 + 0.7, t); }
      const ph = (walkT - EA.walk0) * Math.PI * 2.1;
      eCam(x, 1.6 + bobA * 0.026 * Math.abs(Math.sin(ph)), ePotZ(x, Z), ry, py, bobA * 0.012 * Math.sin(ph * 0.5));
      // the shape in the glass, for a moment, then nothing behind him at all
      if (eShade && eShade.group) eShade.group.visible = t >= EA.shade0 && t < EA.shade1;
      // his hand, at his side and shaking
      api.handsRoot.visible = true; api.armR.visible = true;
      api.handsPose(0, 0, { from: 'rest', relax: 0.9 });
      const tr = 1 - 0.5 * eS(57, 62, t);
      api.armR.position.y -= 0.07; api.armR.position.x += tr * (0.004 * Math.sin(t * 41) + 0.003 * Math.sin(t * 67)); api.armR.rotation.z += tr * 0.03 * Math.sin(t * 53);
    }

    /* ---------------------------------------------------------- B · TAKE IT HOME (bad)
       "How much, Uncle? I'll try it at home." The owner hesitates, then wraps it and puts it in a paper bag: treat it
       with respect, and bring it back if anything happens. His room at night: he unwraps it on his desk and opens himself
       to it. Nothing — the clock ticks. Then the lamp flickers, the cold comes in at the edges of his sight, and a woman
       is humming the old song, very faint: the promise he made her, broken. He wraps it, shuts it in the drawer. Three in
       the morning; every sound in the room is it, or him. In the morning he takes it back, and the owner takes it without
       a word about the money. */
    const EB = { ask: 0.5, wrap0: 4.3, wrap1: 5.8, bag: 6.6, bagIn: 7.6, take0: 9.5, take1: 10.6, out: 10.8, room: 11.6, unwrap0: 12.4, unwrap1: 13.8,
                 clasp0: 15.0, clasp1: 16.4, flick0: 20.5, flick1: 23.0, cold0: 21.0, look0: 25.2, look1: 27.4, back0: 28.6, drop0: 30.2, drop1: 31.0,
                 drawer0: 31.0, drawer1: 31.5, dark: 32.6, bed: 33.4, clockLook0: 35.4, clockLook1: 36.6, knock: 38.0, deskLook0: 38.3, deskLook1: 39.4,
                 night1: 41.5, morning: 42.3, walk0: 43.0, walk1: 47.5, put: 48.6, turn0: 52.3, turn1: 53.2, walkOut: 53.2, end: 60.6 };
    const B_DESK = { x: TX - 0.3, y: 1.18, z: RMZ - 0.74 };          // his eye at his desk
    const B_BED = { x: TX - 1.12, y: 0.66, z: RMZ - 0.33 };          // his eye on the pillow
    const B_DOOR = { x: TX + 0.4, z: 1.5 }, B_CNT = { x: TX + 0.55, z: -4.75 };
    function endB(t, api) {
      const S0 = endLive.t0;
      eLens(BASE_FOV);
      if (t < EB.room) {
        endLive.where = 'shop'; eDay(T_STILL); eClock(false, 25);
        // on the owner for the asking and his answer — in a little while he answers, his lean over the counter as he
        // wraps it — down to the bag, the bag taken
        // (CP11: the lens came down onto the pile itself and a phone's frame was all bag; it settles on a two-shot of
        // the counter's far half now — his face at the top, the bundle and the bag on the wood under it)
        const yo = S0.ry, po = T_OWN, pb = eyePitch(PILE_POS.x, TCNT.top + 0.22, TCNT.z - 0.15);
        const k1 = eS(0, 0.9, t), k2 = eS(EB.bag - 0.4, EB.bag + 0.6, t);
        eLens(BASE_FOV - 7 * eS(3.2, 5.8, t) * (1 - k2));
        eCam(S0.x, S0.y + 0.005 * Math.sin(t * 1.5), S0.z, yo, (S0.p + (po - S0.p) * k1) * (1 - k2) + pb * k2, 0);
        eOwner(TX + 0.55, -6.85, 0, 0.15 * eS(EB.wrap0 - 0.3, EB.wrap0 + 0.3, t) * (1 - eS(EB.wrap1, EB.wrap1 + 0.7, t)));
        // the bundle closed; a paper bag stood open on HIS side of the counter; the bundle drawn across the wood to it,
        // stood on its edge and let down in; the bag folded over and pushed across to him (CP11: the bag stood ON the
        // bundle at the lens)
        const shut = eS(EB.wrap0, EB.wrap1, t);
        const BGX = PILE_POS.x - TX + 0.04, BGZ = TCNT.z - 0.13, PX = PILE_POS.x - TX;
        const slide = eS(EB.bag + 0.1, EB.bag + 0.7, t), up = eS(EB.bag + 0.65, EB.bag + 0.85, t), dn = eS(EB.bag + 0.85, EB.bagIn, t);
        eBundle(t < EB.bagIn ? { x: PX + (BGX - PX) * slide, y: TCNT.top + 0.28 * up - 0.185 * dn, z: PILE_POS.z + (BGZ + 0.125 - PILE_POS.z) * slide - 0.125 * up,
                                 rx: -Math.PI / 2 * up, open: 1 - shut, vis: true } : { vis: false });
        const bagShown = t >= EB.bag && t < EB.take0 + 0.6;
        if (t < EB.take0) { if (bagG.parent !== worldT) eDrop(); bagG.visible = bagShown; bagG.position.set(BGX, TCNT.top + BAG_H, BGZ + 0.26 * eS(EB.bagIn + 0.6, EB.take0 - 0.2, t)); bagG.rotation.set(0, 0.15, 0); bagG.scale.setScalar(1);
                            bagG.children[1].rotation.x = 0.22 + 1.2 * (1 - eS(EB.bagIn, EB.bagIn + 0.35, t)); }
        else eHoldUp(api, bagG, eS(EB.take0, EB.take0 + 0.6, t) * (1 - eS(EB.take1 - 0.3, EB.take1, t)), { lift: 0.12, tilt: 0.25 });
        if (t < EB.take0) eHandsAway(api);
        for (const k of ORDER) { ePresHome(); ePres(k, 0.62); }
        return;
      }
      // ---- his room
      if (t < EB.morning) {
        eDrop();
        for (const k of ORDER) ePres(k, 0);
        eRoom.visible = true; endLive.where = 'room'; eDay(T_ROOM);
        const lampOn = t < EB.dark + 0.5;
        // the lamp: on, flickering with the sound, steady again; off for the night
        let lk = lampOn ? 1 : 0;
        if (t > EB.flick0 && t < EB.flick1) lk = hash(Math.floor(t * 17), 77) < 0.38 ? 0.12 : 0.85 + 0.15 * Math.sin(t * 60);
        for (const g of roomLive.glow) g.material.opacity = g.userData.op * lk;
        if (roomLive.bulb) roomLive.bulb.material.color.setHex(0x2a2418).lerp(_ecol.setHex(0xfff0c8), lk);
        if (roomLive.screen) roomLive.screen.visible = lampOn;
        roomClock(t < EB.bed ? '23:47' : t < 40.2 ? '3:00' : '3:01');
        // the bundle on the desk, the bag beside it; opened; the takrut taken up; put back, wrapped, into the drawer
        const open = eS(EB.unwrap0, EB.unwrap1, t) * (1 - eS(EB.drop0, EB.drop1, t));
        const inDrawer = t >= EB.drawer0;
        const DR = roomLive.drawer, out = eS(EB.drop0 - 0.4, EB.drop0, t) * (1 - eS(EB.drawer0, EB.drawer1, t));
        if (DR) DR.position.z = -1.49 + 0.3 * out;
        // carried from the desk into the open drawer as it is wrapped, then shut in (CP11: it jumped 0.47 m on the drawer's frame)
        void inDrawer;
        const mv = eS(EB.drop1 - 0.25, EB.drawer0 + 0.1, t), DZ0 = RMZ - 1.36, DZ1 = RMZ - 1.49 + 0.3 * out + 0.1;
        eBundle(t >= EB.drawer1 ? { vis: false } : { x: -0.38 + 0.47 * mv, y: 0.758 + (0.6 - 0.758) * mv + 0.1 * Math.sin(Math.PI * mv), z: DZ0 + (DZ1 - DZ0) * mv, open, vis: true });
        eTk(!(t >= EB.clasp0 && t < EB.drop0));
        // (the bag goes under the black, not as it starts: CP11)
        bagG.visible = t < EB.bed; bagG.position.set(-0.68, 0.758 + BAG_H, RMZ - 1.3); bagG.rotation.set(0, 0.5, 0.0); bagG.scale.setScalar(1);
        if (bagG.visible) { bagG.children[1].rotation.x = 0.22 + 1.2 * eS(EB.room, EB.unwrap0, t); }
        // the hands: the clasp with it, from "let's see what you are" until he puts it back
        if (t >= EB.clasp0 - 0.3 && t < EB.drop0 + 0.2) eClasp(api, eS(EB.clasp0 - 0.3, EB.clasp1, t) * (1 - eS(EB.drop0 - 0.2, EB.drop0 + 0.2, t)), t < EB.drop0);
        else eHandsAway(api);
        // the cold: the edges of his sight blue and blurred, the room dimmed — never frost (CP5d)
        if (kit && kit.chill) kit.chill(t >= EB.cold0 && t < EB.drawer1 ? 0.8 : 0, { secs: t >= EB.drawer1 ? 1.4 : 2.4, cine: true });
        // the camera: at the desk, down at it; a look round to the window where the humming is; back; down to the drawer;
        // then on his back on the bed, the ceiling, the clock by him, the desk across the dark
        if (t < EB.bed) {
          const yDesk = 0.0, pDesk = -0.5, yWin = eYaw(B_DESK.x, B_DESK.z, TX + 1.6, RMZ + 0.4), pWin = -0.02;
          const wk = eS(EB.look0, EB.look1, t) * (1 - eS(EB.back0, EB.back0 + 1.2, t)), dk = eS(EB.drop0 - 0.3, EB.drop0 + 0.3, t);
          const freeze = t > 22.6 ? 0.25 : 1;
          // (down to the drawer is to the RIGHT, yaw about −0.5: CP11 turned left, and a phone lost the drawer off its edge)
          eCam(B_DESK.x, B_DESK.y + 0.006 * freeze * Math.sin(t * 1.4), B_DESK.z, eMix(yDesk, yWin, wk) - 0.5 * dk, pDesk + (pWin - pDesk) * wk - 0.22 * dk, 0);
        } else {
          // on the pillow, his head on its side: the clock by it first (three in the morning, red in the dark), then a slow
          // turn across the room to the desk where the drawer is — the knock from it, a flinch — held there until the black
          // (CP9 opened on the ceiling: on a phone, grey and nothing)
          const yC = eYaw(B_BED.x, B_BED.z, TX - 1.3, RMZ - 1.1), pC = ePitch(B_BED.x, B_BED.y, B_BED.z, TX - 1.3, 0.53, RMZ - 1.1);
          const yD = eYaw(B_BED.x, B_BED.z, TX + 0.1, RMZ - 1.45), pD = ePitch(B_BED.x, B_BED.y, B_BED.z, TX + 0.1, 0.62, RMZ - 1.45);
          const dk = eS(EB.clockLook1, EB.knock - 0.3, t), fl = t > EB.knock ? Math.exp(-(t - EB.knock) * 5) * Math.sin((t - EB.knock) * 30) : 0;
          eCam(B_BED.x, B_BED.y, B_BED.z + 0.003 * Math.sin(t * 0.7), eMix(yC, yD, dk) + 0.012 * fl, pC + (pD - pC) * dk + 0.03 * fl, 0.14);
        }
        return;
      }
      // ---- the morning, the shop's door: the bag back
      eRoom.visible = false; endLive.where = 'shop'; eDay(T_DAY); eClock(true, 10); endLive.tension = 0;
      if (kit && kit.chill) kit.chill(0, { secs: 0 });
      for (const k of ORDER) ePres(k, 0);
      eBundle({ vis: false }); eTk(true);
      tX.trayIn = false; tX.tray.k = tX.tray.to = 0;
      eOwner(TX + 0.55, -6.85, 0, 0);
      const k = eS(EB.walk0, EB.walk1, t), x = B_DOOR.x + (B_CNT.x - B_DOOR.x) * k, z = B_DOOR.z + (B_CNT.z - B_DOOR.z) * k;
      const ph = (t - EB.walk0) * Math.PI * 2.0, bob = (k > 0 && k < 1) ? 1 : 0;
      if (t < EB.turn0) {
        const po = ePitch(x, 1.62, z, TX + 0.55, 1.5, -6.85), pd = eyePitch(PILE_POS.x, TCNT.top + 0.1, PILE_POS.z) + 0.05;
        const pk = eS(EB.put - 0.5, EB.put + 0.2, t) * (1 - eS(EB.put + 1.0, EB.put + 1.8, t));
        eCam(x, 1.62 + bob * 0.022 * Math.abs(Math.sin(ph)), z, eYaw(x, z, TX + 0.55, -6.85), po + (pd - po) * pk, 0);
      } else {
        const kk = eS(EB.turn0, EB.turn1, t), w = Math.max(0, t - EB.walkOut), zz = B_CNT.z + 1.2 * w, ph2 = w * Math.PI * 2.0;
        const bw = w > 0 ? 1 - eS(1.25, 1.6, zz) : 0;              // the steps stop where the walk does (CP11)
        eCam(B_CNT.x, 1.62 + bw * 0.022 * Math.abs(Math.sin(ph2)), Math.min(1.6, zz), eMix(0, Math.PI, kk), -0.03, 0);
      }
      // the bag in his hand coming in, then on the counter by the owner (folded shut: the room left it open)
      bagG.children[1].rotation.x = 0.22;
      if (t < EB.put) eHoldUp(api, bagG, eS(EB.morning, EB.morning + 0.5, t), { lift: 0.04, tilt: 0.1, relax: 0.6 });
      else { if (bagG.parent !== worldT) eDrop(); eHandsAway(api); bagG.visible = true; bagG.position.set(PILE_POS.x - TX - 0.12, TCNT.top + BAG_H, PILE_POS.z - 0.12); bagG.rotation.set(0, -0.3, 0); }
    }

    /* ---------------------------------------------------------- C · PUT IT DOWN (good)
       "Thank you, Uncle... but I think that's enough for today." The owner, kindly: don't force; some things are better
       left wrapped. As he wraps it the clock starts again and the fans turn; he stands, and the three fade one by one as
       he turns to the door — the hermit's eyes going into the dark, the serpent into the floor, the giant into the
       afternoon. Out onto the five-foot way; the street floods back. He put it down. He still did not understand. */
    const EC = { lift0: 0.1, lift1: 0.7, set0: 1.15, set1: 1.6, wai0: 1.75, wai1: 3.6, wrap0: 5.3, wrap1: 6.9, clock: 7.2, stand0: 8.6, stand1: 9.5, turn0: 12.6, turn1: 14.0,
                 fadeL: 13.2, fadeN: 14.2, fadeG: 15.2, walk0: 14.6, door: 19.2, back0: 18.0, back1: 20.2, step: 20.4, ffw: 22.0, window0: 28.4,
                 window1: 31.6, end: 40.2 };
    const C_STAND = { x: TX + 0.55, y: 1.62, z: -4.62 };
    function endC(t, api) {
      const S0 = endLive.t0;
      endLive.where = 'shop';
      const running = t >= EC.clock;
      eClock(running, 25);
      eDay(running ? T_DAY : T_STILL);
      endLive.tension = running ? 0 : 0.4;
      // the owner wraps it and puts it away under the counter
      const shut = eS(EC.wrap0, EC.wrap1, t), away = eS(EC.back0 + 0.3, EC.back0 + 1.0, t);
      eBundle(away < 1 ? { x: PILE_POS.x - TX, y: TCNT.top - 0.25 * away, z: PILE_POS.z - 0.25 * away, open: 1 - shut, vis: true } : { vis: false });
      // the three, still and bright; then each goes: the hermit's face down into the dark, the serpent into the floor,
      // the giant into the light of the afternoon
      ePresHome();
      for (const k of ORDER) {
        const at = k === 'lersi' ? EC.fadeL : k === 'naga' ? EC.fadeN : EC.fadeG, u = eS(at, at + 1.6, t);
        const P = PRES[k];
        if (k === 'lersi') { P.g.position.y = LFACE.y - 0.35 * u; P.g.scale.setScalar(1 - 0.15 * u); }
        if (k === 'naga') { P.g.position.y = -1.2 * u * u; }
        if (k === 'wess') { P.g.scale.setScalar(1 + 0.05 * u); }
        ePres(k, (running ? 0.62 - 0.2 * eS(EC.clock, EC.clock + 2, t) : 0.62) * (1 - u));
      }
      // the camera: the wai at the counter; in a little as he answers; up; stood; turned to the door; out; a look back in;
      // the street
      eLens(BASE_FOV - 8 * eS(3.2, 7.4, t) * (1 - eS(EC.stand0 - 0.4, EC.stand0 + 0.5, t)));
      if (t < EC.stand0) {
        const k = eS(0, 0.9, t);
        eCam(S0.x, S0.y + 0.005 * Math.sin(t * 1.5), S0.z, S0.ry, S0.p + (T_OWN - S0.p) * k - 0.12 * eS(EC.wai0 + 0.5, EC.wai0 + 1.1, t) * (1 - eS(EC.wai1 - 0.9, EC.wai1 - 0.3, t)), 0);
      } else if (t < EC.turn0) {
        const k = eS(EC.stand0, EC.stand1, t);
        eCam(S0.x + (C_STAND.x - S0.x) * k, S0.y + (C_STAND.y - S0.y) * k, S0.z + (C_STAND.z - S0.z) * k, S0.ry, T_OWN + (ePitch(C_STAND.x, C_STAND.y, C_STAND.z, TOWN.x, 1.5, TOWN.z) - T_OWN) * k, 0);
      } else if (t < EC.walk0) {
        const k = eS(EC.turn0, EC.turn1, t), po = ePitch(C_STAND.x, C_STAND.y, C_STAND.z, TOWN.x, 1.5, TOWN.z);
        eCam(C_STAND.x, C_STAND.y, C_STAND.z, eMix(0, Math.PI + 0.06, k), po + (0.03 - po) * k, 0);   // (onto the walk's own heading and pitch: CP11)
      } else if (t < EC.door) {
        const k = cl01((t - EC.walk0) / (EC.door - EC.walk0)), z = C_STAND.z + (0.9 - C_STAND.z) * k, x = C_STAND.x + (TX + 0.25 - C_STAND.x) * k, ph = (t - EC.walk0) * Math.PI * 2.1;
        const bk = eS(EC.back0, EC.back0 + 0.8, t) * (1 - eS(EC.back1 - 0.6, EC.back1, t));
        eCam(x, 1.62 + 0.024 * Math.abs(Math.sin(ph)) * (1 - bk), z, eMix(Math.PI + 0.06, 0.08, bk), 0.03 - 0.05 * bk, 0);
      } else {
        // out onto the five-foot way, along it to the west; a slow look at another shop's window full of pieces
        const w = Math.max(0, t - EC.step), x = TX + 0.25 - 1.05 * Math.max(0, t - EC.ffw), z = Math.min(1.15, 0.9 + 0.25 * eS(EC.step, EC.ffw, t)), ph = w * Math.PI * 2.1;
        const yaw0 = eMix(0.08, Math.PI / 2, eS(EC.step, EC.ffw + 0.4, t)), wk = eS(EC.window0, EC.window0 + 1.2, t) * (1 - eS(EC.window1 - 0.8, EC.window1, t));
        // (the look is ACROSS the road, at the far row's open fronts: the neighbours along this side are shuttered, and the
        // phone's photographs of a look at them were a roller shutter filling the frame)
        eCam(x, 1.62 + 0.024 * Math.abs(Math.sin(ph)) * (1 - 0.6 * wk), ePotZ(x, z), eMix(yaw0, Math.PI - 0.45, wk), -0.02 + 0.03 * wk, 0);
      }
      // his hands: the piece taken up in the clasp, looked at, and set back down on its cloth — then the wai, empty, and
      // down (CP11: the option says he puts it down, and the first build never had him pick it up)
      eTk(!(t >= EC.lift0 + 0.35 && t < EC.set1));
      if (t < EC.set1) eClasp(api, eS(EC.lift0, EC.lift1, t) * (1 - eS(EC.set0, EC.set1, t)), true);
      else if (t < EC.wai1) { const up = eS(EC.wai0, EC.wai0 + 0.5, t) * (1 - eS(EC.wai1 - 0.5, EC.wai1, t)); eClasp(api, up, false); if (up <= 0.001) eHandsAway(api); }
      else eHandsAway(api);
      eOwner(TX + 0.55, -6.85, 0, 0.15 * eS(EC.wrap0 - 0.3, EC.wrap0 + 0.3, t) * (1 - eS(EC.wrap1, EC.wrap1 + 0.7, t)));
    }

    /* ---------------------------------------------------------- D · ASK FOR A TEACHER (best)
       He pushes the tray gently back: he doesn't want to test them any more; he doesn't know what he is letting in. The
       owner is still a moment, then — almost relieved — agrees: he only collects them; he doesn't really know what is
       inside either. "Do you know anyone who can teach me properly?" The owner writes on the back of his card: go and
       see this temple, there is a monk there who teaches meditation, not like me, play-play. The card changes hands; the
       three fade; the clock ticks again. Outside, evening, the street lamps coming on, the card in his hand. */
    const ED = { push0: 0.3, push1: 1.8, wrap0: 11.0, wrap1: 12.6, write0: 25.3, pen0: 25.6, pen1: 26.9, slide0: 27.9, slide1: 28.7,
                 take0: 29.0, take1: 29.6, bow0: 30.6, bow1: 31.6, away0: 33.6, away1: 34.4, turn0: 33.0, turn1: 34.6, fadeL: 33.6, fadeN: 34.3, fadeG: 35.0,
                 clock: 34.0, out: 35.8, street: 36.8, lamps0: 41.5, lamps1: 44.5, pocket0: 46.6, pocket1: 47.4, walk0: 47.6, end: 56.2 };
    const D_KERB = { x: TX + 0.7, y: 1.62, z: 2.05 };
    function endD(t, api) {
      const S0 = endLive.t0;
      if (t < ED.street) {
        endLive.where = 'shop';
        const running = t >= ED.clock;
        eClock(running, 25); eDay(running ? T_DAY : T_STILL); endLive.tension = running ? 0 : 0.38;
        // the bundle pushed gently back, wrapped, and put away
        const push = eS(ED.push0, ED.push1, t), shut = eS(ED.wrap0, ED.wrap1, t), away = eS(ED.away0, ED.away1, t);
        eBundle(away < 1 ? { x: PILE_POS.x - TX, y: TCNT.top - 0.25 * away, z: PILE_POS.z - 0.16 * push - 0.15 * away, open: 1 - shut, vis: true } : { vis: false });
        ePresHome();
        for (const k of ORDER) {
          const at = k === 'lersi' ? ED.fadeL : k === 'naga' ? ED.fadeN : ED.fadeG, u = eS(at, at + 1.6, t), P = PRES[k];
          if (k === 'lersi') { P.g.position.y = LFACE.y - 0.3 * u; }
          if (k === 'naga') { P.g.position.y = -1.2 * u * u; }
          ePres(k, 0.62 * (1 - u));
        }
        // THE CARD: written on the counter (an insert, the pen at the line), slid across, taken up in his fingers
        const writing = t >= ED.write0 && t < ED.take0;
        if (writing) {
          if (cardG.parent !== worldT) eDrop();
          cardG.visible = true;
          const sl = eS(ED.slide0, ED.slide1, t);
          cardG.position.set(PILE_POS.x - TX - 0.02, TCNT.top + 0.0035, -6.08 + 0.3 * sl); cardG.rotation.set(-Math.PI / 2, 0, 0.08 - 0.1 * sl);
          const p = cl01((t - ED.pen0) / (ED.pen1 - ED.pen0));
          cardWrite(p * CARD_N);
          penG.visible = t < ED.pen1 + 0.5;
          if (penG.visible) {
            const li = Math.min(2, Math.floor(p * 3)), lp = (p * 3) % 1, lift = t > ED.pen1 ? eS(ED.pen1, ED.pen1 + 0.4, t) : 0;
            const nx = -0.034 + 0.07 * (p >= 1 ? 1 : lp) + 0.002 * li, nz = -0.012 + 0.015 * (p >= 1 ? 2 : li);
            penG.position.set(cardG.position.x + nx, cardG.position.y + 0.001 + 0.03 * lift + 0.0015 * Math.abs(Math.sin(t * 31)), cardG.position.z + nz);
            penG.rotation.set(-0.45, 0.3, 0.35);
          }
        } else if (t >= ED.take0) {                     // held until the black (CP11: dropped at a third of the fade)
          cardWrite(CARD_N); penG.visible = false;
          eHoldUp(api, cardG, eS(ED.take0, ED.take1, t), { lift: 0.36, tilt: -0.05 });
        } else { if (cardG.parent !== worldT) eDrop(); cardG.visible = false; penG.visible = false; }
        if (t < ED.take0) {
          // his hand pushing the bundle back, at the start
          const ph = eS(ED.push0 - 0.2, ED.push0 + 0.3, t) * (1 - eS(ED.push1, ED.push1 + 0.5, t));
          if (ph > 0.001) { api.handsRoot.visible = true; api.armR.visible = true; api.handsPose(0, 0, { from: 'rest', relax: 0.2 });
            api.armR.position.y -= 0.22 * (1 - ph) + 0.02; api.armR.position.z -= 0.08 * eS(ED.push0, ED.push1, t) * ph; }
          else eHandsAway(api);
        }
        // the camera: the bundle and his hand, the owner, the insert on the counter, the card in his fingers, the bow,
        // the three going
        const pBundle = eyePitch(PILE_POS.x, TCNT.top + 0.05, PILE_POS.z);
        let yy = S0.ry, pp, xx = S0.x, yh = S0.y, zz = S0.z, roll = 0;
        if (t < ED.write0 - 0.2) {
          // on the owner: in a little as he asks (the lens, and his own lean toward the counter); down to the cloth as the
          // owner leans over to wrap it; closer again on the question; held for the answer (CP9 held one frame for 22 s)
          const k = eS(ED.push1 - 0.2, ED.push1 + 0.8, t), wrapK = eS(ED.wrap0 - 0.3, ED.wrap0 + 0.4, t) * (1 - eS(ED.wrap1, ED.wrap1 + 0.8, t));
          pp = (S0.p + (pBundle + 0.06 - S0.p) * eS(0, 0.4, t)) * (1 - k) + T_OWN * k;
          pp += (pBundle + 0.1 - pp) * wrapK * 0.7;
          const lean = 0.05 * eS(2.6, 8.6, t) + 0.05 * eS(17.0, 21.0, t);
          xx = S0.x - Math.sin(S0.ry) * lean; zz = S0.z - Math.cos(S0.ry) * lean;
          eLens(BASE_FOV - 7 * eS(2.6, 8.6, t) - 7 * eS(17.0, 21.0, t) + 6 * wrapK);
        } else if (t < ED.take0) {
          // the insert: low over the counter, the card under the pen
          const cx = PILE_POS.x - 0.02, cz = -6.08 + 0.3 * eS(ED.slide0, ED.slide1, t);
          xx = cx + 0.02; yh = TCNT.top + 0.3; zz = cz + 0.24; yy = eYaw(xx, zz, cx, cz); pp = ePitch(xx, yh, zz, cx, TCNT.top, cz);
          eLens(46);
        } else {
          const bow = eS(ED.bow0, ED.bow0 + 0.4, t) * (1 - eS(ED.bow1 - 0.4, ED.bow1, t)), tk = eS(ED.turn0, ED.turn1, t);
          pp = T_OWN - 0.04 - 0.22 * bow + (0.12 - T_OWN) * tk; yy = eMix(S0.ry, Math.PI + 0.1, tk);
          eLens(BASE_FOV);
        }
        eCam(xx, yh + 0.004 * Math.sin(t * 1.5), zz, yy, pp, roll);
        eOwner(TX + 0.55, -6.85, 0, 0.16 * eS(ED.wrap0 - 0.3, ED.wrap0 + 0.3, t) * (1 - eS(ED.wrap1, ED.wrap1 + 0.7, t)));
        eLamps(0);
        return;
      }
      // ---- outside, evening: the lamps coming on down the street, the card in his hand
      eLens(BASE_FOV);
      endLive.where = 'dusk'; endLive.tension = 0;
      eDay(T_EVE); eClock(true, 25);
      for (const k of ORDER) ePres(k, 0);
      eBundle({ vis: false }); penG.visible = false;
      eLamps(cl01((t - ED.lamps0) / (ED.lamps1 - ED.lamps0)) * 1.0 + (t >= ED.lamps1 ? 1 : 0) * 0, true);
      const up = 1 - eS(ED.pocket0, ED.pocket1, t);
      if (up > 0.001) eHoldUp(api, cardG, up * eS(ED.street, ED.street + 0.4, t), { lift: 0.3, tilt: -0.05 });
      else { if (cardG.parent !== worldT) eDrop(); eHandsAway(api); }
      const w = Math.max(0, t - ED.walk0), ph = w * Math.PI * 2.0;
      const lk = eS(ED.lamps0 - 0.5, ED.lamps0 + 1.2, t) * (1 - eS(ED.pocket0 - 0.4, ED.pocket0 + 0.4, t));
      const look = eMix(Math.PI + 0.25, Math.PI + 0.7, lk), walkYaw = eMix(look, Math.PI / 2, eS(ED.pocket0, ED.walk0 + 0.8, t));
      eCam(D_KERB.x - 1.0 * w, D_KERB.y + (w > 0 ? 0.022 * Math.abs(Math.sin(ph)) : 0.004 * Math.sin(t * 1.3)), ePotZ(D_KERB.x - 1.0 * w, D_KERB.z - 0.9 * eS(ED.pocket0, ED.walk0 + 1.5, t)),
           walkYaw, -0.06 + 0.1 * lk - 0.05 * (1 - eS(ED.street, ED.lamps0, t)), 0);
    }

    const END_T = { A: EA.end, B: EB.end, C: EC.end, D: ED.end };
    const endCtl = { begin: endBegin, frame: endFrame, end: (k) => {}, T: END_T, EA, EB, EC, ED, talk: eTalk };

    /* ================================================================== THE OPENING FILM (CP10, docs/V22.0-E3C4-PLAN.md §4.0)
       "Seeking", in his voice, on one clock: every picture a function of the film's own seconds (the merit film's
       shape), so a seek, a skip and a slow phone land on the same frame. Four places:
         O1  0.0–11.8   his desk at night (a pocket at z −250): the two screens full of searches, the medium's talisman
                        from chapter 3 by the keyboard; the wheel down the results, a click, and the other screen opens a
                        thread on Yin amulets
         O2 11.9–23.9   Golden Mile, shop to shop (World H): the corridor; amulets under the glass; a tray slid across
                        the owner's counter, the owner shaking his head
         O3 24.0–43.4   the old mall (World Y): up the escalator out of the floor below, off at the top, and down the
                        corridor — one tube stuttering, the old song from the far end
         O4 43.4–52.0   her door: the red light through the beads, the bell; in through the beads to where play begins,
                        his eyes on the still figure behind the counter
       The office is Chad's Mersus Office (e3c1's film, v19.0), PAINTED for the night the way e3c1 paints it — unlit, its
       colour times the light the shot needs (a low blue ambient, the screens' pool, the desk lamp's) — so the light
       count never changes (v15.1); its stand-in is drawn (v4.7: a failed download costs a nicer room, never the shot). */
    const OFFZ = -250;
    const offG = new THREE.Group(); offG.position.set(0, 0, OFFZ); offG.visible = false; world.add(offG);
    const O_T = { o2: 11.9, o2b: 15.6, o2c: 19.6, o3: 24.0, o3b: 31.2, o3c: 33.0, door: 43.4, push0: 44.2, push1: 48.8, end: 52.0,
                  beads: 0, bell: 0 };
    const oLive = { on: false, where: '', day: undefined, page: -1 };
    const offU = {
      nAmb: { value: new THREE.Color(0.05, 0.056, 0.085) },
      // (the screens' pool: 0.40/0.60/1.05 lit the white desk near-white on a desktop's wide frame — a lit room, not a
      // desk at night; at this level the lamp's warm pool reads beside it)
      nPA: { value: new THREE.Vector3(1.30, 1.12, OFFZ - 0.10) }, nCA: { value: new THREE.Color(0.27, 0.41, 0.74) }, nRA: { value: 2.3 },
      nPB: { value: new THREE.Vector3(-5.5, 3.4, OFFZ - 6.0) }, nCB: { value: new THREE.Color(0.15, 0.15, 0.18) }, nRB: { value: 6.0 },
      nPC: { value: new THREE.Vector3(1.95, 0.98, OFFZ + 0.14) }, nCC: { value: new THREE.Color(0.95, 0.66, 0.36) }, nRC: { value: 1.25 }
    };
    function nightMat(src) {
      const m = new THREE.MeshBasicMaterial({ map: src.map || null, color: src.color ? src.color.clone() : 0xffffff, fog: false,
        transparent: !!src.transparent, opacity: src.opacity ?? 1, side: THREE.DoubleSide, alphaTest: src.alphaTest || 0, depthWrite: src.depthWrite !== false });
      m.onBeforeCompile = (sh) => {
        Object.assign(sh.uniforms, offU);
        sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vNW;')
          .replace('#include <fog_vertex>', '#include <fog_vertex>\nvNW = (modelMatrix * vec4(transformed, 1.0)).xyz;');
        sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nvarying vec3 vNW;\nuniform vec3 nAmb, nPA, nCA, nPB, nCB, nPC, nCC;\nuniform float nRA, nRB, nRC;')
          .replace('#include <opaque_fragment>', 'float kA = 1.0 - smoothstep(0.0, nRA, distance(vNW, nPA));\nfloat kB = 1.0 - smoothstep(0.0, nRB, distance(vNW, nPB));\n'
            + 'float kC = 1.0 - smoothstep(0.0, nRC, distance(vNW, nPC));\noutgoingLight *= nAmb + nCA * kA * kA + nCB * kB * kB + nCC * kC * kC;\n#include <opaque_fragment>');
      };
      m.customProgramCacheKey = () => 'e3c4night';
      mats.push(m); return m;
    }
    const oBasic = (o) => { const m = new THREE.MeshBasicMaterial({ fog: false, ...o }); mats.push(m); return m; };
    const oBox = (w, h, d, x, y, z, m, par) => { const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); b.position.set(x, y, z); par.add(b); return b; };
    const oPlane = (w, h, x, y, z, m, par, ry = 0, rx = 0) => { const p = new THREE.Mesh(new THREE.PlaneGeometry(w, h), m); p.position.set(x, y, z); p.rotation.set(rx, ry, 0); par.add(p); return p; };
    // THE SCREENS (where e3c1 measured his two monitors in the model, masters/v19.0/screens.mjs): the left one a page of
    // results that the wheel scrolls (a tall page, its window moved by the texture's offset), the right one an article
    // until the click, then the thread
    const OSCR = { w: 0.655, h: 0.37, rep: 289 / 1100 };
    const scrList = tex(makeSearchListT(THREE, cnv)); scrList.repeat.set(1, OSCR.rep); scrList.offset.set(0, 1 - OSCR.rep);
    const scrArt = tex(makeArticleT(THREE, cnv)), scrForum = tex(makeForumT(THREE, cnv));
    const offM = new THREE.Group(); offM.position.set(1.967, 0, 0.997); offM.rotation.y = Math.PI; offG.add(offM);
    const offScr = new THREE.Group(); offM.add(offScr);
    const scrMatL = oBasic({ map: scrList }), scrMatR = oBasic({ map: scrArt });
    const scrL = oPlane(OSCR.w, OSCR.h, 1.015 + Math.sin(-2.843) * 0.018, 1.122, 1.242 + Math.cos(-2.843) * 0.018, scrMatL, offScr, -2.843);
    const scrR = oPlane(OSCR.w, OSCR.h, 0.318 + Math.sin(2.737) * 0.018, 1.122, 1.192 + Math.cos(2.737) * 0.018, scrMatR, offScr, 2.737);
    const cursor = oPlane(0.016, 0.022, 0, 0, 0.002, oBasic({ map: tex(makeCursorT(THREE, cnv)), transparent: true, depthWrite: false }), scrL);
    cursor.renderOrder = 4;
    // their glow on the desk, and the desk lamp's warm pool and its shade (painted light, no lamp)
    // (the desk's top is 0.825 m in Chad's model — measured off its triangles, masters/v22.0/cp10; e3c1's 0.748 lies
    // inside the table, where nothing laid on it can be seen)
    const ODESK = 0.825;
    oPlane(1.5, 0.9, 0.66, ODESK + 0.002, 0.85, oBasic({ color: 0x3f7fd0, transparent: true, opacity: 0.16, blending: THREE.AdditiveBlending, depthWrite: false }), offScr, 0, -Math.PI / 2);
    { const lampG = new THREE.Group(); lampG.position.set(1.95, ODESK, 0.12); offG.add(lampG);
      const dark = oBasic({ color: 0x14141a });
      oBox(0.12, 0.018, 0.12, 0, 0.009, 0, dark, lampG);
      const arm = oBox(0.016, 0.36, 0.016, 0, 0.19, -0.02, dark, lampG); arm.rotation.x = 0.22;
      const shade = new THREE.Mesh(new THREE.ConeGeometry(0.075, 0.12, 16, 1, true), oBasic({ color: 0xffd9a0, side: THREE.DoubleSide }));
      shade.position.set(0, 0.36, 0.06); shade.rotation.x = 0.5; lampG.add(shade);
      oPlane(0.7, 0.55, -0.12, 0.003, 0.12, oBasic({ color: 0xffc88a, transparent: true, opacity: 0.22, blending: THREE.AdditiveBlending, depthWrite: false }), lampG, 0, -Math.PI / 2); }
    // the medium's talisman from chapter 3, by the keyboard (on its left, clear of it and the mouse pad — their places
    // measured with the desk's): yellow paper, red brush strokes (makeFuT)
    const O_TAL = { x: 0.82, y: ODESK + 0.003, z: 0.22 };
    { const fu = new THREE.Mesh(new THREE.PlaneGeometry(0.072, 0.198), nightMat({ map: tex(makeFuT(THREE, cnv)), color: new THREE.Color(1, 1, 1) }));
      fu.rotation.set(-Math.PI / 2, 0, -0.32); fu.position.set(O_TAL.x, O_TAL.y, O_TAL.z); offG.add(fu); }
    // the city at night through the windows, all the way round (e3c1's)
    { const cityTex = tex(makeOfficeCity(THREE, cnv)); cityTex.wrapS = THREE.RepeatWrapping; cityTex.repeat.set(5, 1);
      const city = new THREE.Mesh(new THREE.CylinderGeometry(19, 19, 9, 48, 1, true), oBasic({ map: cityTex, side: THREE.BackSide }));
      city.position.set(3.7, 3.4, 2.1); offG.add(city); }
    // the stand-in: a dark room, his desk and two monitors where the model's stand (hidden the moment Chad's lands)
    const offOld = new THREE.Group(); offG.add(offOld);
    { const dk = oBasic({ color: 0x14161c, side: THREE.BackSide }); oBox(16, 3.2, 12, 1.3, 1.6, 0, dk, offOld);
      const desk = oBasic({ color: 0x5a5048 }), leg = oBasic({ color: 0x1e1f22 }), mon = oBasic({ color: 0x0a0b0d });
      oBox(1.9, 0.04, 0.85, 1.3, 0.73, 0.0, desk, offOld); oBox(0.04, 0.72, 0.75, 0.38, 0.36, 0.0, leg, offOld); oBox(0.04, 0.72, 0.75, 2.22, 0.36, 0.0, leg, offOld);
      for (const [x, z, ry] of [[0.952, -0.27, 0.299], [1.649, -0.22, -0.404]]) { const b = oBox(0.68, 0.4, 0.03, x, 1.122, z, mon, offOld); b.rotation.y = ry; }
      oBox(0.42, 0.02, 0.14, 1.17, 0.76, 0.22, leg, offOld); }
    parseOnce('filmoffice').then(gltf => {
      if (!alive) return;
      const g = gltf.scene.clone(true), nm = new Map();
      g.traverse(o => {
        if (!o.isMesh) return;
        o.castShadow = o.receiveShadow = false;
        const ms = Array.isArray(o.material) ? o.material : [o.material];
        const out = ms.map(m => { if (!nm.has(m)) nm.set(m, nightMat(m)); return nm.get(m); });
        o.material = Array.isArray(o.material) ? out : out[0];
      });
      offM.add(g); offOld.visible = false;
    }).catch(err => { console.warn('filmoffice failed to load', err); ctx.loadFail && ctx.loadFail('filmoffice', err); });
    // O2's tray: one of Chad's display trays, lying on the owner's glass, slid across to the lens
    const oTray = new THREE.Group(); oTray.visible = false; H.shopG.add(oTray);
    { const TRAY_T = 0.0973 * 0.225;                       // the scan's board depth (buildWorldH's TRAY.d) at the counters' scale
      H_TRAYS([[0, H.RCNT.top + 0.008 + TRAY_T / 2, 0, new THREE.Euler(-Math.PI / 2, -Math.PI / 2, 0, 'YXZ'), 0.225]], [], oTray); }

    const _oa = new THREE.Vector3(), _ob = new THREE.Vector3(), _oq = new THREE.Quaternion();
    const oS = (a, b, t) => smooth(cl01((t - a) / (b - a)));
    function oPut(px, py, pz, tx, ty, tz) {                           // the lens at p, looking at the target
      yaw.position.set(px, py, pz);
      yaw.rotation.y = Math.atan2(-(tx - px), -(tz - pz));
      pitch.rotation.x = Math.atan2(ty - py, Math.hypot(tx - px, tz - pz));
      camera.rotation.z = 0;
    }
    function oDay(p) { if (oLive.day !== p && kit) { oLive.day = p; kit.daylight(p, 0); } }
    /* how far from a screen to stand for it to fill THIS frame's width (a phone sees a third of a desktop's) */
    function oFit(w, h) {
      const tv = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)), th = tv * camera.aspect;
      return Math.max(0.42, (w / 0.86) / 2 / th, (h / 0.62) / 2 / tv);
    }
    function oScreen(m, d) {                                          // a screen's middle and a point d out along its face
      m.getWorldPosition(_oa); _ob.set(0, 0, 1).applyQuaternion(m.getWorldQuaternion(_oq)).multiplyScalar(d).add(_oa);
      return [_oa.clone(), _ob.clone()];
    }
    function oFlick(on) { for (const m of yLive.flick || []) m.visible = on; }
    /* O3's walk: off the escalator's top, through the railing's gap, along the corridor to her door — a curve through
       these points, walked at a pace eased in at the top and out at the door (arc length, so the steps are even) */
    const O_PATH = (() => {
      const P = [[-13.9, 6.25], [-13.35, 6.05], [-13.25, 5.2], [-12.7, 4.05], [-10.6, 3.35], [-6.0, 2.85], [-2.4, 2.45], [-0.5, 2.0], [-0.08, 1.62]]
        .map(([x, z]) => new THREE.Vector3(x, 0, z));
      const c = new THREE.CatmullRomCurve3(P, false, 'centripetal'); c.arcLengthDivisions = 400; return c;
    })();
    /* where the push through the door crosses the beads and passes under the bell: the times its cues land on */
    const oPushZ = (t) => 1.62 + (DATA.spawn.z - 1.62) * oS(O_T.push0, O_T.push1, t);
    for (const [key, zc] of [['beads', 0.12], ['bell', -0.19]]) {
      let a = O_T.push0, b = O_T.push1;
      for (let i = 0; i < 30; i++) { const m = (a + b) / 2; if (oPushZ(m) > zc) a = m; else b = m; }
      O_T[key] = +((a + b) / 2).toFixed(2);
    }
    /* an ease in, a steady walk, an ease out: a of the time to come up to pace, d to come down (distance, 0..1) */
    const eAD = (k, a, d) => { const v = 1 / (1 - a / 2 - d / 2);
      return v * (k < a ? k * k / (2 * a) : k > 1 - d ? (1 - a / 2 - d / 2) - (1 - k) * (1 - k) / (2 * d) : k - a / 2); };
    /* the ride: standing on a step (the escalator's own 0.6 m a second, yTick's), his eyes up the stair, then onto the
       floor he is arriving on — a function of the clock, so the walk can turn off the look it ends on */
    function oRide(t) {
      const E = yLive.escalator, L = E ? E.e0.distanceTo(E.e1) : 8.63;
      const u = Math.min(1, 0.5 + (E ? E.v : 0.6) * (t - O_T.o3) / L);
      const ex = E ? E.e0.x + (E.e1.x - E.e0.x) * u : -17, ey = (E ? E.e0.y + (E.e1.y - E.e0.y) * u : -2) + 1.58, ez = E ? E.z : 6.25;
      // CP10 (the phone photographs: the ride stared down the atrium at its far end the whole way up): up the stair at
      // first — the steps, the rails, the skylight, the far end's banner — and as his eyes clear the floor (26.3), round
      // onto the one lit shopfront at the far end of the corridor, the shop he says he had never noticed, settled on it by
      // 29.8 while "...a shop I had never noticed before" is said. Eased in yaw and pitch, not through a lerp of two points.
      const s = oS(26.3, 29.8, t), dx = 0 - ex, dy = 1.6 - ey, dz = 0.3 - ez;
      const yaw = Math.atan2(-dz, dx) * s, pit = Math.atan2(1.1, 4) * (1 - s) + Math.atan2(dy, Math.hypot(dx, dz)) * s;
      return { ex, ey, ez, tx: ex + 6 * Math.cos(pit) * Math.cos(yaw), ty: ey + 6 * Math.sin(pit), tz: ez - 6 * Math.cos(pit) * Math.sin(yaw) };
    }
    function oBegin() { oLive.on = true; oLive.where = ''; oLive.day = undefined; oLive.page = -1; }
    function oFrame(t, api) {
      if (!oLive.on) oBegin();
      api.handsRoot.visible = false;
      const where = t < O_T.o2 - 0.05 ? 'office' : t < O_T.o3 - 0.05 ? 'gm' : 'mall';
      oLive.where = where;
      offG.visible = where === 'office';
      oDay(where === 'gm' ? H_DAY : null);
      hLive.look = where === 'gm' && t >= O_T.o2c;
      const P = hLive.owner;
      if (P) { P.shakeAmp = 0; P.shakeT = t; }
      oTray.visible = where === 'gm' && t >= O_T.o2c - 0.05;
      oFlick(!(where === 'mall' && t > 34.4 && t < 38.6 && hash(Math.floor(t * 13), 47) < 0.42));
      // ---- O1 · his desk at night
      if (where === 'office') {
        // the wheel: three turns down the results, the fifth ("What is a Yin amulet?") left under the cursor
        const px = 120 * oS(2.6, 3.4, t) + 140 * oS(4.9, 5.6, t) + 120 * oS(6.4, 7.0, t);
        scrList.offset.y = 1 - OSCR.rep - px / 1100;
        // the cursor: drifting over the results, onto the fifth, the click at 8.2
        const ck = oS(6.9, 7.9, t), cx = 0.09 - 0.17 * ck + 0.012 * Math.sin(t * 0.9) * (1 - ck), cy = 0.04 - 0.05 * ck;
        cursor.position.set(cx, cy, 0.002); cursor.scale.setScalar(t >= 8.2 && t < 8.32 ? 0.85 : 1);
        const page = t >= 8.3 ? 1 : 0;
        if (page !== oLive.page) { oLive.page = page; scrMatR.map = page ? scrForum : scrArt; scrMatR.needsUpdate = true; }
        // the lens: in from behind his chair to both screens; down to the talisman by the keyboard; up to the results;
        // and, on the click, across to the thread, close enough on THIS screen to read it
        const [SL] = oScreen(scrL, 0), [SR, NR] = oScreen(scrR, oFit(OSCR.w, OSCR.h));
        const MIDx = (SL.x + SR.x) / 2, MIDy = (SL.y + SR.y) / 2, MIDz = (SL.z + SR.z) / 2;
        const TAL = { x: O_TAL.x, y: O_TAL.y, z: OFFZ + O_TAL.z };
        const k0 = oS(0, 4.2, t), cx0 = 1.38 + (1.30 - 1.38) * k0, cy0 = 1.32 + (1.25 - 1.32) * k0, cz0 = OFFZ + 1.30 + (0.80 - 1.30) * k0;
        const kT = oS(4.2, 5.4, t) * (1 - oS(5.8, 6.9, t)), kL = oS(5.8, 6.9, t) * (1 - oS(8.5, 9.6, t)), kR = oS(8.5, 10.4, t);
        const ax = MIDx + (TAL.x - MIDx) * kT + (SL.x - MIDx) * kL + (SR.x - MIDx) * kR;
        const ay = MIDy + (TAL.y - MIDy) * kT + (SL.y - MIDy) * kL + (SR.y - MIDy) * kR;
        const az = MIDz + (TAL.z - MIDz) * kT + (SL.z - MIDz) * kL + (SR.z - MIDz) * kR;
        const pk = oS(8.6, 11.0, t);
        oPut(cx0 + (NR.x - cx0) * pk, cy0 + (NR.y - cy0) * pk + 0.004 * Math.sin(t * 1.1), cz0 + (NR.z - cz0) * pk, ax, ay, az);
        return;
      }
      // ---- O2 · Golden Mile, shop to shop (World H, its own numbers + HX)
      if (where === 'gm') {
        // (the customer browsing the staff's counter stands 0.6 m further along it for the film: at her own place her
        // chatting hand came into the counter shot's desktop frame; oEnd puts her back)
        const G0 = hLive.cust && hLive.cust[0]; if (G0 && G0.group) G0.group.position.z = G0.o.z - 0.6;
        if (t < O_T.o2b) {                                          // the corridor, past the fronts, to the shop's glass
          const k = oS(O_T.o2, O_T.o2b + 0.6, t), x = HX - 11.0 + 4.6 * k, ph = (t - O_T.o2) * Math.PI * 2.1;
          oPut(x, 1.62 + 0.02 * Math.abs(Math.sin(ph)), 2.7 - 0.2 * k, x + 4.0, 1.45, 0.9 - 0.7 * k);
        } else if (t < O_T.o2c) {                                   // the staff's counter: amulets under the glass
          const k = oS(O_T.o2b - 0.4, O_T.o2c + 0.4, t), z = -1.45 - 1.1 * k, C = H.LCNT;
          oPut(HX - 2.35, 1.42, z, HX + (C.x0 + C.x1) / 2 - 0.05, 0.62, z - 0.25);
        } else {                                                    // the owner's counter: a tray slid across, his head shaking
          const k = oS(O_T.o2c, O_T.o3, t), z = -2.75;
          const sl = oS(20.2, 21.4, t);
          oTray.position.set(3.32 - 0.30 * sl, 0, z);
          oPut(HX + 2.18 + 0.14 * k, 1.43, z - 0.04, HX + 3.55, 1.2, z + 0.02);
          if (P) P.shakeAmp = 0.2 * oS(21.0, 21.3, t) * (1 - oS(22.4, 22.8, t));
        }
        return;
      }
      // ---- O3 · the old mall: up the escalator (standing on a step: its own 0.6 m a second), off at the top; the corridor
      if (t < O_T.o3b) {
        const R = oRide(t);
        oPut(R.ex, R.ey + 0.002 * Math.sin(t * 7), R.ez, R.tx, R.ty, R.tz);
        return;
      }
      if (t < O_T.door) {
        // off the step, through the gap, along the corridor: the path's arc walked eased in and out; the look three
        // metres ahead along it, a touch toward the shop fronts, and onto her door in the last of it
        const s = eAD(cl01((t - O_T.o3b) / (O_T.door - O_T.o3b)), 0.12, 0.16), p = O_PATH.getPointAt(Math.min(1, s), _oa);
        const ahead = O_PATH.getPointAt(Math.min(1, s + 0.12), _ob);
        const y0 = 1.58 + 0.04 * oS(O_T.o3b, O_T.o3b + 0.8, t), bob = 0.02 * Math.abs(Math.sin((t - O_T.o3b) * Math.PI * 1.9)) * (1 - oS(O_T.door - 1.0, O_T.door, t));
        const toDoor = oS(O_T.door - 3.6, O_T.door, t), kb = oS(O_T.o3b, O_T.o3b + 1.4, t);   // (kb: off the ride's look)
        let tx = ahead.x + (-0.04 - ahead.x) * toDoor, ty = 1.5 - 0.08 * toDoor, tz = ahead.z - 0.4 + (-1.38 - (ahead.z - 0.4)) * toDoor;
        const R = oRide(O_T.o3b);
        tx = R.tx + (tx - R.tx) * kb; ty = R.ty + (ty - R.ty) * kb; tz = R.tz + (tz - R.tz) * kb;
        oPut(p.x, y0 + bob, p.z, tx, ty, tz);
        return;
      }
      // ---- O4 · her door: a breath on the threshold, then in through the beads to where play begins, his eyes going to
      // the still figure behind the counter
      const k = oS(O_T.push0, O_T.push1, t), SP = DATA.spawn, z = oPushZ(t);
      const x = -0.08 + (SP.x + 0.08) * k, ph = (t - O_T.push0) * Math.PI * 1.9;
      const kk = oS(O_T.push1 - 1.6, O_T.end - 0.8, t), KE = yLive.keeper && yLive.keeper.head ? yLive.keeper.head.getWorldPosition(_ob) : null;
      const kx = KE ? KE.x : KEEP.x, ky = KE ? KE.y - 0.05 : 1.45, kz = KE ? KE.z : KEEP.z;
      const lx = x + 0.04 * (1 - k), ly = 1.42 - 0.06 * k, lz = z - 3;
      oPut(x, 1.62 + 0.018 * Math.abs(Math.sin(ph)) * oS(O_T.push0, O_T.push0 + 0.4, t) * (1 - oS(O_T.push1 - 0.6, O_T.push1, t)), z,
           lx + (kx - lx) * kk * 0.85, ly + (ky - ly) * kk * 0.85, lz + (kz - lz) * kk * 0.85);
      yin.bellSwing = t >= O_T.bell ? Math.exp(-(t - O_T.bell) * 1.6) : 0;
    }
    function oEnd() {
      oLive.on = false; oLive.where = ''; offG.visible = false; oTray.visible = false; hLive.look = false;
      if (hLive.owner) hLive.owner.shakeAmp = 0;
      { const G0 = hLive.cust && hLive.cust[0]; if (G0 && G0.group) G0.group.position.z = G0.o.z; }
      oFlick(true);
      scrMatR.map = scrArt; scrMatR.needsUpdate = true; oLive.page = -1;
    }
    const filmCtl = { frame: oFrame, end: oEnd, T: O_T };

    /* ---------------------------------------------------------- lifecycle */
    function snap() { return { phase }; }
    function restore() {}
    function reset() {
      dropTodo(); speakReset(); lineQ.length = 0; heard.clear();
      booted = false; preplaced = ''; dayClock.t = 0; lastWall = 0;
      looked.clear(); held.clear();
      worldRun++;
      yinReset();
      meritEnd(); duskK = 0;                         // the merit film's world put away (a replay can start inside it)
      hanReset(); runEnd();                          // World H: the piece, the vision, the lens, the door, the run-out's stares
      tReset();                                      // World T: the seat, the tray, the pieces, the presences, the clock, the room's answers
      endReset();                                    // the endings: the lids, the room, the lamps, the bag, the card, the stool, the owner (CP9)
      oEnd();                                        // the opening film: its office, its tray, the owner's head, the stuttering tube (CP10)
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
      merit: meritCtl,                               // the merit film's controller (CP6): every picture a function of its clock
      runout: runCtl,                                // the run-out film's (CP7)
      endT: endCtl,                                  // the four endings' (CP9): every picture a function of the scene's clock
      filmO: filmCtl,                                // the opening film's (CP10): the same shape, its four places
      pileVia: { what: 'the tray shop\'s counter (two films carry him there)', x: TSTOOL.x, z: TSTOOL.z },
      arrivals: [{ what: 'the Hanuman shop (the merit film puts him at its door)', x: HARRIVE.x, z: HARRIVE.z },
                 { what: 'the tray shop (the run-out film puts him inside its door)', x: TARRIVE.x, z: TARRIVE.z }],
      get phase() { return phase; },
      setPhase, applyPhase, after, dayClock, sayLine,
      // (a probe's handle: the locket held at a trial offset in the arm's frame, so its framing is chosen by photograph)
      holdTry: (pos, rot) => { if (kit && kit.hold) { yinHeld.visible = true; kit.hold(yinHeld, { pos, rot: rot || [ARM_INV.x - 0.25, ARM_INV.y, ARM_INV.z] }); } },
      info: () => ({ phase, t: +dayClock.t.toFixed(2), queued: lineQ.length, heard: [...heard], looked: [...looked], held: [...held],
                     until: +speak.until.toFixed(2), pending: speak.pending ? speak.pending.name : null, world: worldOf(yaw.position.x),
                     yin: { on: yin.on, cold: +yin.cold.toFixed(2), numb: +yin.numb.toFixed(2), rate: +yin.rate.toFixed(3), stopped: yin.stopped,
                            locket: yLive.locket ? yLive.locket.visible : null,   // (v22.2: on her satin, where he can pick it up)
                            girl: { placed: yin.girl.placed, a: +yin.girl.a.toFixed(2), shows: yin.girl.shows, side: yin.girl.side, at: yin.girl.at || null,
                                    ready: !!(yLive.girl && yLive.girl.ready), to: yin.girl.to, fail: yin.girl.fail || null },
                            beds: DATA.ambience.beds.map(b => b.map(v => typeof v === 'number' ? +v.toFixed(3) : v)), wrong: wrongI },
                     merit: { on: mLive.on, shot: mShotWas, monk: merit.monk.ready, fov: camera.fov, dusk: +duskK.toFixed(3) },
                     han: { on: hanX.on, released: hanX.released, tries: hanX.tries, stand: +stand.k.toFixed(2), vis: hanX.vis.on, visReady,
                            uw: +hanX.uw.toFixed(2), gold: +hanX.gold.toFixed(2), fov: +camera.fov.toFixed(2), hold: hold.mode,
                            people: [hLive.owner, hLive.staff, ...hLive.cust, hLive.walker].map(P => P ? (P.ready ? P.key : P.key + '?') : null),
                            run: runLive.shot, drop: hDrop.visible, face: visFaceNdc() },
                     tray: { seated: tX.seated, on: tX.on, trayIn: tX.trayIn, unknown: tX.unknown, held: [...held], amber: +tX.amber.toFixed(2),
                             red: +tX.red.toFixed(2), teal: +tX.teal.toFixed(2), silent: +tX.silent.toFixed(2), clock: tLive.clockOn, frozen: !!tLive.frozen,
                             tension: +tX.tension.toFixed(2), tea: +tX.tea.toFixed(2), turn: !!tTurn, bundle: tX.bundle.on, open: +tX.bundle.open.toFixed(2),
                             pres: ORDER.map(k => (PRES[k].ready ? '' : '?') + PRES[k].k.toFixed(2)), owner: tLive.owner && tLive.owner.ready,
                             yaw: +yaw.rotation.y.toFixed(3), pitch: +pitch.rotation.x.toFixed(3), y: +yaw.position.y.toFixed(3) },
                     end: { on: endLive.on, where: endLive.where, room: eRoom.visible, lamps: lampsG.visible, refl: reflG.visible, card: cardG.visible,
                            bag: bagG.visible, lids: lidTop.visible ? +lidTop.position.y.toFixed(3) : null,
                            shade: !!(eShade && eShade.ready), beds: [+mixE.dusk.toFixed(2), +mixE.room.toFixed(2)], fov: +camera.fov.toFixed(1) } }),
      // (a probe's handle: a tray piece held at a trial place in the arm's frame, so its framing is chosen by photograph)
      trayTry: (k, o) => { if (o) { if (o.lift != null) CLASP[k].lift = o.lift; if (o.ahead != null) CLASP[k].ahead = o.ahead; if (o.y != null) CLASP.y = o.y;
                                     if (o.s) { HOLD_T[k].s = o.s; heldModel[k].scale.setScalar(o.s); } } pieceShow(k, o && o.off ? 'tray' : 'hand'); },
      trayDbg: { day: (n, s) => kit && kit.daylight({ day: T_DAY, amber: T_AMBER, red: T_RED, teal: T_TEAL, still: T_STILL }[n], s || 0),
                 pres: (k, how) => presShow(k, how, true), turn: (yw, p, s) => seatTurn(yw, p, s || 0.3, { yaw: yw, span: 0.3 }),
                 at: (k) => { const [x, y, z] = PRES_AT[k](); return [eyeYaw(x, z), eyePitch(x, y, z)]; } },
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

  /* the floor: 300 mm glazed tiles in oxblood and brown, the glaze dulled where people walk (CP5a: a chip here and
     there, no cracks, the grout a working grey); one texture is 1.2 m */
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
      // a chipped corner on the odd one
      if (r() < 0.08) { x.fillStyle = 'rgba(60,40,30,0.8)'; x.beginPath(); const cx = i * T + (r() < 0.5 ? 3 : T - 3), cy = j * T + (r() < 0.5 ? 3 : T - 3); x.moveTo(cx, cy); x.lineTo(cx + (cx > i * T + T / 2 ? -9 : 9), cy); x.lineTo(cx, cy + (cy > j * T + T / 2 ? -7 : 7)); x.fill(); }
    }
    x.fillStyle = '#4a3c34'; for (let k = 0; k <= n; k++) { x.fillRect(k * T - 2, 0, 4, S); x.fillRect(0, k * T - 2, S, 4); }
    yBlob(x, S, S * 0.72, S * 0.3, 140, 'rgba(26,14,10,0.07)');
    return yDone(THREE, c, true);
  }
  /* the plaster: a warm cream emulsion rolled over old plaster — the roller's soft unevenness, a fine grain, the
     odd small mark (CP5a: no damp, no cracks: "it doesn't have to be rundown"); one texture is 2.2 m */
  function makeYinPlaster(THREE, cnv) {
    const S = 512, [c, x] = cnv(S), r = yRng(43);
    x.fillStyle = '#d6c8b0'; x.fillRect(0, 0, S, S);
    for (let i = 0; i < 46; i++) yBlob(x, S, r() * S, r() * S, 30 + r() * 110, `rgba(${r() < 0.5 ? '150,132,108' : '236,226,208'},${0.03 + r() * 0.05})`);
    // the roller's lanes: long soft vertical bands a shade apart
    for (let i = 0; i < 9; i++) { const px = r() * S, w = 40 + r() * 50, a = 0.015 + r() * 0.025;
      for (const ox of [-S, 0, S]) { x.fillStyle = `rgba(${r() < 0.5 ? '120,104,84' : '244,236,222'},${a})`; x.fillRect(px + ox, 0, w, S); } }
    yGrain(x, S, S, 8, r);
    // a few small marks: a nail hole, a scuff, a pencil tick — the wall of a shop that is used
    for (let i = 0; i < 5; i++) { const px = r() * S, py = r() * S;
      if (i < 2) { x.fillStyle = 'rgba(70,58,46,0.45)'; x.beginPath(); x.arc(px, py, 1.4, 0, Math.PI * 2); x.fill(); }
      else { x.strokeStyle = 'rgba(90,76,60,0.12)'; x.lineWidth = 2; x.beginPath(); x.moveTo(px, py); x.lineTo(px + 6 + r() * 14, py + (r() - 0.5) * 4); x.stroke(); } }
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
  /* the shop's ceiling: 600 mm mineral-fibre boards in a white T-bar grid, the boards' pinholes, a shade of age in a
     board or two (CP5a: no leak rings, no gaps); one texture is 2.4 m */
  function makeYinCeil(THREE, cnv) {
    const S = 512, [c, x] = cnv(S), r = yRng(53), n = 4, T = S / n;
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { const v = 226 + (r() - 0.5) * 10 | 0; x.fillStyle = `rgb(${v},${v - 4},${v - 12})`; x.fillRect(i * T, j * T, T, T); }
    for (let i = 0; i < 2600; i++) { x.fillStyle = `rgba(110,100,84,${0.03 + r() * 0.07})`; x.fillRect(r() * S, r() * S, 1 + r() * 1.5, 1); }
    yBlob(x, S, T * 2.5, T * 0.5, 50, 'rgba(170,140,96,0.08)');
    x.fillStyle = '#d4d0c6'; for (let k = 0; k <= n; k++) { x.fillRect(k * T - 3, 0, 6, S); x.fillRect(0, k * T - 3, S, 6); }
    x.fillStyle = 'rgba(80,74,64,0.35)'; for (let k = 0; k <= n; k++) { x.fillRect(k * T + 3, 0, 1, S); x.fillRect(0, k * T + 3, S, 1); }
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
  /* the corridor's T-bar ceiling: pale tiles, the odd one a shade off (CP5a: none missing); one texture is 2.4 m */
  function makeYinCeilC(THREE, cnv) {
    const S = 512, [c, x] = cnv(S), r = yRng(73), n = 4, T = S / n;
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
      const v = 212 + (r() - 0.5) * 12 | 0;
      x.fillStyle = `rgb(${v},${v - 3},${v - 9})`; x.fillRect(i * T, j * T, T, T);
      for (let k = 0; k < 160; k++) { x.fillStyle = `rgba(100,94,84,${0.04 + r() * 0.07})`; x.fillRect(i * T + r() * T, j * T + r() * T, 1 + r() * 2, 1); }
      if (r() < 0.1) yBlob(x, S, i * T + T / 2, j * T + T / 2, 34, 'rgba(150,120,80,0.10)');
    }
    x.fillStyle = '#9a968e'; for (let k = 0; k <= n; k++) { x.fillRect(k * T - 3, 0, 6, S); x.fillRect(0, k * T - 3, S, 6); }
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
    for (let i = 0; i < 70; i++) { x.fillStyle = `rgba(0,0,0,${0.3 + r() * 0.4})`; x.beginPath(); x.ellipse(r() * 1024, r() * 342, 1 + r() * 4, 1 + r() * 2.5, r() * 3, 0, Math.PI * 2); x.fill(); }
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
  /* the atrium's skylight: panes in a steel grid, an afternoon sky, a few leaves on the glass */
  function makeYinSkylight(THREE, cnv) {
    const [c, x] = ySized(cnv, 256, 384), r = yRng(97);
    const g = x.createLinearGradient(0, 0, 0, 384); g.addColorStop(0, '#d8e2ea'); g.addColorStop(1, '#b4c4d0');
    x.fillStyle = g; x.fillRect(0, 0, 256, 384);
    for (let i = 0; i < 10; i++) yBlob(x, 256, r() * 256, r() * 384, 14 + r() * 40, `rgba(90,84,72,${0.04 + r() * 0.06})`);
    for (let i = 0; i < 6; i++) { x.fillStyle = `rgba(${60 + r() * 40 | 0},${44 + r() * 20 | 0},${24},0.7)`; x.beginPath(); x.ellipse(r() * 256, r() * 384, 3 + r() * 5, 1.5 + r() * 2, r() * 3, 0, Math.PI * 2); x.fill(); }
    x.fillStyle = '#3a3c3e'; for (const px of [0, 128]) x.fillRect(px - 3, 0, 6, 384); for (const py of [0, 128, 256]) x.fillRect(0, py - 3, 256, 6);
    return yDone(THREE, c, true);
  }
  /* the other shops' fascias, four boards down a 1024 x 512 sheet: their years in the paint, every letter there */
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
      x.fillStyle = 'rgba(0,0,0,0.35)'; x.fillRect(0, y, 1024, 4); x.fillRect(0, y + 124, 1024, 4);
    });
    return yDone(THREE, c, false);
  }
  /* a TO LET notice, taped on the inside of the glass, years old */
  /* the Yin shop's own board: red lacquer, a gold rule, Thai over Chinese over English, one 4.9 x 0.52 m board */
  function makeYinFascia(THREE, cnv) {
    const [c, x] = ySized(cnv, 1024, 110), r = yRng(103);
    const g = x.createLinearGradient(0, 0, 0, 110); g.addColorStop(0, '#7a1a12'); g.addColorStop(1, '#561008');
    x.fillStyle = g; x.fillRect(0, 0, 1024, 110);
    for (let k = 0; k < 24; k++) yBlob(x, 1024, r() * 1024, r() * 110, 8 + r() * 26, `rgba(${r() < 0.5 ? '255,236,220' : '30,8,4'},${0.03 + r() * 0.05})`);
    const gold = x.createLinearGradient(0, 0, 0, 110); gold.addColorStop(0, '#f0cc78'); gold.addColorStop(0.55, '#c49440'); gold.addColorStop(1, '#94682a');
    x.strokeStyle = gold; x.lineWidth = 3; x.strokeRect(6, 6, 1012, 98); x.lineWidth = 1; x.strokeRect(12, 12, 1000, 86);
    x.fillStyle = gold; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.font = 'bold 40px sans-serif'; x.fillText('เครื่องรางของขลัง', 300, 52);
    x.font = 'bold 34px serif'; x.fillText('灵 符 · 佛 牌', 690, 40);
    x.font = 'bold 18px sans-serif'; x.fillText('THAI AMULETS  ·  TALISMANS', 690, 78);
    return yDone(THREE, c, false);
  }
  function makeYinToLet(THREE, cnv) {
    const [c, x] = ySized(cnv, 256, 342), r = yRng(103);
    x.fillStyle = '#f0e8d4'; x.fillRect(0, 0, 256, 342);
    x.fillStyle = '#c41a14'; x.fillRect(12, 12, 232, 120);
    x.fillStyle = '#fff4e0'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.font = 'bold 66px sans-serif'; x.fillText('TO LET', 128, 74);
    x.fillStyle = '#1a1a1a'; x.font = 'bold 30px sans-serif'; x.fillText('招 租', 128, 168);
    // (CP10: no telephone number — a made-up one can belong to someone real; the management office instead)
    x.font = 'bold 22px sans-serif'; x.fillText('Unit #04-', 128, 214); x.font = 'bold 17px sans-serif'; x.fillText('Enquire: Mgmt Office L1', 128, 252);
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
  /* CP10: the atrium's two ends were open to nothing (the opening film's escalator rides up looking straight at the far
     one). These are what an old mall keeps there. A long cloth banner hung in the void, sun-faded red, letting the
     empty units — its words are world art and name nobody (1.5 x 5.25 m) */
  function makeYinLease(THREE, cnv) {
    const [c, x] = ySized(cnv, 256, 896), r = yRng(211);
    const g = x.createLinearGradient(0, 0, 0, 896); g.addColorStop(0, '#9a4a3e'); g.addColorStop(0.5, '#a8584a'); g.addColorStop(1, '#8c3e34');
    x.fillStyle = g; x.fillRect(0, 0, 256, 896);
    // the fold lines a cloth keeps from its box, and the sun on its upper half
    for (let y = 60; y < 896; y += 112) { const f = x.createLinearGradient(0, y - 10, 0, y + 10); f.addColorStop(0, 'rgba(0,0,0,0)'); f.addColorStop(0.5, 'rgba(40,10,6,0.22)'); f.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = f; x.fillRect(0, y - 10, 256, 20); }
    x.fillStyle = 'rgba(255,236,214,0.10)'; x.fillRect(0, 0, 256, 400);
    x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = '#f4e6cc';
    x.font = 'bold 96px serif'; ['旺', '铺', '招', '租'].forEach((ch, i) => x.fillText(ch, 128, 96 + i * 108));
    x.fillStyle = '#efe0c2'; x.font = 'bold 44px sans-serif'; ['UNITS', 'FOR', 'LEASE'].forEach((w, i) => x.fillText(w, 128, 560 + i * 52));
    x.fillStyle = 'rgba(244,230,204,0.85)'; x.fillRect(36, 720, 184, 3);
    x.font = 'bold 21px sans-serif'; x.fillText('ENQUIRE AT', 128, 752); x.fillText('MGMT OFFICE', 128, 780); x.fillText('LEVEL 1', 128, 808);
    // water marks and grime, the grommets at the top
    for (let i = 0; i < 26; i++) yBlob(x, 256, r() * 256, r() * 896, 14 + r() * 46, `rgba(${r() < 0.6 ? '60,28,20' : '230,214,190'},${0.05 + r() * 0.09})`);
    for (let i = 0; i < 9; i++) { x.fillStyle = `rgba(70,40,26,${0.12 + r() * 0.1})`; x.fillRect(r() * 256, 300 + r() * 560, 2 + r() * 2, 30 + r() * 90); }
    for (const gx of [22, 234]) { x.fillStyle = '#6e6a60'; x.beginPath(); x.arc(gx, 16, 8, 0, Math.PI * 2); x.fill(); x.fillStyle = '#2a2622'; x.beginPath(); x.arc(gx, 16, 4, 0, Math.PI * 2); x.fill(); }
    yGrain(x, 256, 896, 14, r);
    return yDone(THREE, c, false);
  }
  /* an advertising lightbox, one of its tubes dead: a mall sale nobody took down, its reds gone to the cyan an old print
     fades to (4.8 x 1.8 m) */
  function makeYinSaleBox(THREE, cnv) {
    const [c, x] = ySized(cnv, 1024, 384), r = yRng(223);
    const g = x.createLinearGradient(0, 0, 1024, 384); g.addColorStop(0, '#cfe4e2'); g.addColorStop(1, '#b6d2d4');
    x.fillStyle = g; x.fillRect(0, 0, 1024, 384);
    // a few shopping bags, drawn plainly, in the faded colours
    [[120, 250, '#c9a6b8'], [210, 270, '#a8c0cc'], [300, 255, '#d4c49a']].forEach(([bx, by, col], i) => {
      x.fillStyle = col; x.fillRect(bx - 50, by - 80, 100, 120);
      x.strokeStyle = 'rgba(80,90,96,0.6)'; x.lineWidth = 5; x.beginPath(); x.arc(bx, by - 80, 26, Math.PI, 0); x.stroke();
      x.fillStyle = 'rgba(255,255,255,0.35)'; x.fillRect(bx - 50, by - 80, 14, 120);
    });
    x.textAlign = 'center'; x.textBaseline = 'middle';
    x.fillStyle = '#b07890'; x.font = 'bold 92px sans-serif'; x.fillText('MID-YEAR SALE', 690, 120);
    x.fillStyle = '#5c7a8c'; x.font = 'bold 64px sans-serif'; x.fillText('UP TO 70% OFF', 690, 214);
    x.fillStyle = '#7a8e96'; x.font = 'bold 38px serif'; x.fillText('年 中 大 减 价', 690, 290);
    x.font = 'bold 24px sans-serif'; x.fillText('ALL PARTICIPATING OUTLETS · LEVELS 1 – 4', 690, 340);
    // the dead tube: the left third in shadow, a soft edge; dead insects along the bottom of the box
    const d = x.createLinearGradient(0, 0, 420, 0); d.addColorStop(0, 'rgba(10,14,18,0.62)'); d.addColorStop(1, 'rgba(10,14,18,0)');
    x.fillStyle = d; x.fillRect(0, 0, 420, 384);
    for (let i = 0; i < 60; i++) { x.fillStyle = `rgba(40,34,26,${0.4 + r() * 0.4})`; x.fillRect(r() * 1024, 368 + r() * 14, 2 + r() * 4, 2 + r() * 3); }
    for (let i = 0; i < 18; i++) yBlob(x, 1024, r() * 1024, r() * 384, 20 + r() * 60, `rgba(80,74,60,${0.04 + r() * 0.06})`);
    return yDone(THREE, c, false);
  }
  /* the store directory at the other end: a brown board with its letters pushed in, half its units blank (1.6 x 2.0 m) */
  function makeYinDirectory(THREE, cnv) {
    const [c, x] = ySized(cnv, 512, 640), r = yRng(227);
    x.fillStyle = '#3a2a20'; x.fillRect(0, 0, 512, 640);
    x.fillStyle = '#d8c69a'; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.font = 'bold 34px sans-serif'; x.fillText('STORE DIRECTORY', 256, 40); x.font = 'bold 26px serif'; x.fillText('商 场 指 南', 256, 78);
    x.fillRect(30, 100, 452, 2);
    const names = ['', 'TAILOR', '', 'PHOTO STUDIO', '', '', 'TRAVEL', '', 'WATCH & CLOCK', '', 'BOOKS', '', '', 'TEXTILE', '', 'OPTICAL', '', ''];
    x.textAlign = 'left'; x.font = 'bold 15px monospace';
    for (let lv = 4; lv >= 1; lv--) {
      const y0 = 124 + (4 - lv) * 128;
      x.fillStyle = '#e8d8ae'; x.font = 'bold 22px sans-serif'; x.fillText('LEVEL ' + lv, 30, y0 + 10);
      x.font = 'bold 15px monospace';
      for (let i = 0; i < 6; i++) {
        const col = i % 2, row = i >> 1, tx = 30 + col * 236, ty = y0 + 38 + row * 28, nm = names[(lv * 5 + i) % names.length];
        x.fillStyle = '#c8b68a'; x.fillText('#0' + lv + '-' + String(10 + i * 3), tx, ty);
        if (nm) x.fillText(nm, tx + 76, ty); else { x.fillStyle = 'rgba(200,182,138,0.18)'; x.fillRect(tx + 76, ty - 6, 120, 12); }
      }
    }
    for (let i = 0; i < 20; i++) yBlob(x, 512, r() * 512, r() * 640, 12 + r() * 40, `rgba(${r() < 0.5 ? '255,240,210' : '10,6,4'},${0.04 + r() * 0.06})`);
    yGrain(x, 512, 640, 10, r);
    return yDone(THREE, c, false);
  }
  /* the floor's number, painted big on the wall at the escalator's head, the way every mall marks its levels */
  function makeYinLevel(THREE, cnv) {
    const [c, x] = ySized(cnv, 256, 320), r = yRng(229);
    x.clearRect(0, 0, 256, 320);
    x.fillStyle = 'rgba(122,26,20,0.88)'; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.font = 'bold 230px sans-serif'; x.fillText('4', 128, 128);
    x.font = 'bold 40px sans-serif'; x.fillText('LEVEL', 128, 262); x.font = 'bold 30px serif'; x.fillText('四 楼', 128, 300);
    // the paint worn back to the wall in places
    x.globalCompositeOperation = 'destination-out';
    for (let i = 0; i < 70; i++) { x.fillStyle = `rgba(0,0,0,${0.2 + r() * 0.5})`; x.fillRect(r() * 256, r() * 320, 2 + r() * 10, 1 + r() * 3); }
    x.globalCompositeOperation = 'source-over';
    return yDone(THREE, c, false);
  }
  /* an escalator step's tread: grooved aluminium running the way it travels, a yellow nose, yellow at both sides (the
     box's +y face: u along the run, 0.4 m; v across, 1.0 m) */
  function makeYinTread(THREE, cnv) {
    const [c, x] = ySized(cnv, 128, 256);
    x.fillStyle = '#5a5e62'; x.fillRect(0, 0, 128, 256);
    for (let y = 0; y < 256; y += 6) { x.fillStyle = '#7e8286'; x.fillRect(0, y, 128, 2); x.fillStyle = '#34373a'; x.fillRect(0, y + 3, 128, 2); }
    x.fillStyle = '#d8b228'; x.fillRect(0, 0, 16, 256); x.fillRect(0, 0, 128, 9); x.fillRect(0, 247, 128, 9);
    x.fillStyle = 'rgba(60,50,10,0.35)'; for (let y = 0; y < 256; y += 6) x.fillRect(0, y + 3, 16, 2);
    return yDone(THREE, c, false);
  }
  /* its riser: the cleated face, ribs running up it (the box's −x face: u across, v up) */
  function makeYinRiser(THREE, cnv) {
    const [c, x] = ySized(cnv, 256, 64);
    x.fillStyle = '#2c2f32'; x.fillRect(0, 0, 256, 64);
    for (let u = 0; u < 256; u += 4) { x.fillStyle = '#4c5054'; x.fillRect(u, 0, 2, 64); }
    x.fillStyle = '#c8a424'; x.fillRect(0, 0, 6, 64); x.fillRect(250, 0, 6, 64);
    return yDone(THREE, c, false);
  }
  /* the hose reel's label, and the staircase door's sign, white on red and black on white */
  function makeYinHoseSign(THREE, cnv) {
    const [c, x] = ySized(cnv, 256, 128);
    x.fillStyle = '#b81c14'; x.fillRect(0, 0, 256, 64); x.fillStyle = '#f4f0e8'; x.fillRect(0, 64, 256, 64);
    x.textAlign = 'center'; x.textBaseline = 'middle';
    x.fillStyle = '#ffffff'; x.font = 'bold 30px sans-serif'; x.fillText('FIRE HOSE REEL', 128, 32);
    x.fillStyle = '#1a1a1a'; x.font = 'bold 30px sans-serif'; x.fillText('STAIRCASE  楼梯', 128, 96);
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
  /* the barrier across the escalator's landing: black and yellow */
  function makeYinHazard(THREE, cnv) {
    const S = 128, [c, x] = cnv(S);
    x.fillStyle = '#e8b818'; x.fillRect(0, 0, S, S);
    x.fillStyle = '#141414';
    for (let i = -S; i < S * 2; i += 32) { x.beginPath(); x.moveTo(i, 0); x.lineTo(i + 16, 0); x.lineTo(i + 16 - S, S); x.lineTo(i - S, S); x.closePath(); x.fill(); }
    return yDone(THREE, c, true);
  }

  /* ============================================================ THE TEMPLE AT SUNSET'S SURFACES (CP6)
     Drawn on canvases (CSP-safe, nothing downloaded). The words on its box and its envelope are world art (v14.5). */
  /* the sky: an equirectangular sheet on the inside of a dome — the canvas's top is the zenith and its middle the
     horizon; its x runs round the sky so that 0.75 is the pocket's −z (SphereGeometry's own mapping). The sun sits
     low at u 0.857, 5° up — behind the hall and a little to its west from the courtyard, so the roofs stand dark
     against the brightest of it; long clouds lit from beneath, gold near the sun, pink, then lilac on the far side. */
  function makeMSky(THREE, cnv) {
    const W = 2048, H = 1024, [c, x] = ySized(cnv, W, H), r = yRng(211);
    const g = x.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0.00, '#131a38'); g.addColorStop(0.16, '#232c5a'); g.addColorStop(0.28, '#433f74'); g.addColorStop(0.36, '#7a5a80');
    g.addColorStop(0.42, '#b86e7c'); g.addColorStop(0.465, '#e48c6a'); g.addColorStop(0.495, '#f4ad74'); g.addColorStop(0.50, '#e89a6a');
    g.addColorStop(0.53, '#6e4a46'); g.addColorStop(0.62, '#33262a'); g.addColorStop(1.0, '#171214');
    x.fillStyle = g; x.fillRect(0, 0, W, H);
    const SU = 0.857 * W, SV = (90 - 5) / 180 * H;
    // the sun's half of the sky warmer and brighter, the far half cooler: soft washes drawn twice across the seam
    const wash = (cx, cy, rx, ry, col) => { for (const ox of [-W, 0, W]) { x.save(); x.translate(cx + ox, cy); x.scale(1, ry / rx);
      const rg = x.createRadialGradient(0, 0, 0, 0, 0, rx); rg.addColorStop(0, col); rg.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = rg; x.fillRect(-rx, -rx, rx * 2, rx * 2); x.restore(); } };
    wash(SU, SV, W * 0.42, H * 0.30, 'rgba(255,170,90,0.55)');
    wash(SU, SV, W * 0.16, H * 0.12, 'rgba(255,214,150,0.75)');
    wash(SU - W / 2, H * 0.40, W * 0.40, H * 0.22, 'rgba(70,72,130,0.45)');
    // long clouds in the band above the horizon, each lit from below by the sun's distance round the sky
    for (let i = 0; i < 70; i++) {
      const cy = H * (0.30 + r() * 0.17), cx = r() * W, len = W * (0.05 + r() * 0.16), th = 4 + r() * 11;
      let du = Math.abs(cx - SU); du = Math.min(du, W - du) / (W / 2);               // 0 at the sun, 1 opposite
      const near = Math.max(0, 1 - du * 1.6), lift = (cy - H * 0.30) / (H * 0.17);
      const body = `rgba(${Math.round(70 + 60 * near)},${Math.round(52 + 30 * near)},${Math.round(78 - 10 * near)},${0.45 + 0.3 * r()})`;
      const lit = `rgba(255,${Math.round(150 + 70 * near)},${Math.round(110 + 40 * near)},${(0.25 + 0.55 * near) * (0.6 + 0.4 * lift)})`;
      for (const ox of [-W, 0, W]) {
        x.fillStyle = body; x.beginPath(); x.ellipse(cx + ox, cy, len / 2, th, 0, 0, Math.PI * 2); x.fill();
        x.fillStyle = lit; x.beginPath(); x.ellipse(cx + ox, cy + th * 0.55, len / 2 * 0.92, th * 0.42, 0, 0, Math.PI * 2); x.fill();
      }
    }
    // the sun itself, just over the line, and its bloom
    const sg = x.createRadialGradient(SU, SV, 0, SU, SV, 60); sg.addColorStop(0, 'rgba(255,248,226,1)'); sg.addColorStop(0.12, 'rgba(255,236,190,1)'); sg.addColorStop(0.35, 'rgba(255,190,120,0.5)'); sg.addColorStop(1, 'rgba(255,160,90,0)');
    x.fillStyle = sg; x.fillRect(SU - 60, SV - 60, 120, 120);
    // the first stars on the far, dark side
    for (let i = 0; i < 120; i++) { const sx = (SU - W / 2 + (r() - 0.5) * W * 0.7 + W) % W, sy = r() * H * 0.24;
      x.fillStyle = `rgba(255,255,255,${0.2 + r() * 0.5})`; x.fillRect(sx, sy, 1.4, 1.4); }
    return yDone(THREE, c, false);
  }
  function makeMSlabs(THREE, cnv) {
    const S = 256, [c, x] = cnv(S), r = yRng(223);
    x.fillStyle = '#5e5a54'; x.fillRect(0, 0, S, S);
    for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) { const v = 150 + r() * 26; x.fillStyle = `rgb(${v},${v - 6},${v - 14})`; x.fillRect(i * 128 + 2, j * 128 + 2, 124, 124); }
    for (let k = 0; k < 40; k++) yBlob(x, S, r() * S, r() * S, 6 + r() * 22, `rgba(${r() < 0.5 ? '70,62,52' : '210,204,190'},${0.05 + r() * 0.08})`);
    return yDone(THREE, c, true);
  }
  function makeMPlaster(THREE, cnv) {
    const S = 256, [c, x] = cnv(S), r = yRng(227);
    x.fillStyle = '#ece6da'; x.fillRect(0, 0, S, S);
    for (let k = 0; k < 60; k++) yBlob(x, S, r() * S, r() * S, 8 + r() * 30, `rgba(${r() < 0.6 ? '200,188,170' : '255,252,246'},${0.06 + r() * 0.08})`);
    return yDone(THREE, c, true);
  }
  function makeMFloor(THREE, cnv) {
    const S = 256, [c, x] = cnv(S), r = yRng(229);
    x.fillStyle = '#d8ccb8'; x.fillRect(0, 0, S, S);
    for (let k = 0; k < 30; k++) yBlob(x, S, r() * S, r() * S, 10 + r() * 34, `rgba(${r() < 0.5 ? '186,170,148' : '236,228,214'},${0.12 + r() * 0.12})`);
    x.strokeStyle = 'rgba(150,132,110,0.35)'; x.lineWidth = 1;
    for (let k = 0; k < 9; k++) { x.beginPath(); let px = r() * S, py = r() * S; x.moveTo(px, py); for (let s = 0; s < 6; s++) { px += (r() - 0.3) * 40; py += (r() - 0.5) * 30; x.lineTo(px, py); } x.stroke(); }
    x.fillStyle = 'rgba(110,92,72,0.55)'; x.fillRect(0, 0, S, 2); x.fillRect(0, 0, 2, S);
    return yDone(THREE, c, true);
  }
  function makeMTiles(THREE, cnv, a, b) {
    const S = 256, [c, x] = cnv(S);
    x.fillStyle = a; x.fillRect(0, 0, S, S);
    x.translate(S, 0); x.rotate(Math.PI / 2);
    for (let row = 0; row < 8; row++) for (let i = 0; i < 8; i++) {
      const ox = (row % 2) * 16;
      x.fillStyle = b; x.beginPath(); x.arc(i * 32 + ox, row * 32 + 30, 16, 0, Math.PI); x.fill();
      x.fillStyle = 'rgba(255,255,255,0.07)'; x.fillRect(i * 32 + ox - 14, row * 32 + 4, 28, 6);
    }
    return yDone(THREE, c, true);
  }
  function makeMEarth(THREE, cnv) {
    const S = 256, [c, x] = cnv(S), r = yRng(233);
    x.fillStyle = '#4a3624'; x.fillRect(0, 0, S, S);
    for (let k = 0; k < 90; k++) yBlob(x, S, r() * S, r() * S, 4 + r() * 18, `rgba(${r() < 0.5 ? '30,20,12' : '110,86,60'},${0.12 + r() * 0.18})`);
    for (let k = 0; k < 160; k++) { x.fillStyle = `rgba(${150 + r() * 60},${130 + r() * 50},${100 + r() * 40},${0.3 + r() * 0.4})`; x.fillRect(r() * S, r() * S, 1 + r() * 2, 1 + r() * 2); }
    // fallen leaves on the earth
    for (let k = 0; k < 14; k++) { x.save(); x.translate(r() * S, r() * S); x.rotate(r() * 6); x.fillStyle = `rgba(${120 + r() * 60},${80 + r() * 40},${30},0.7)`;
      x.beginPath(); x.ellipse(0, 0, 9, 4, 0, 0, Math.PI * 2); x.fill(); x.restore(); }
    return yDone(THREE, c, true);
  }
  function makeMGrass(THREE, cnv) {
    const S = 256, [c, x] = cnv(S), r = yRng(239);
    x.fillStyle = '#4e5c34'; x.fillRect(0, 0, S, S);
    for (let k = 0; k < 120; k++) yBlob(x, S, r() * S, r() * S, 6 + r() * 26, `rgba(${r() < 0.5 ? '64,80,40' : '96,104,58'},${0.15 + r() * 0.2})`);
    return yDone(THREE, c, true);
  }
  /* a window from inside at sunset: the sky going from gold to rose behind a lattice, a branch across it */
  function makeMWindow(THREE, cnv) {
    const [c, x] = ySized(cnv, 128, 212), r = yRng(241);
    const g = x.createLinearGradient(0, 0, 0, 212); g.addColorStop(0, '#d8869a'); g.addColorStop(0.55, '#ffb878'); g.addColorStop(1, '#ffd8a0');
    x.fillStyle = g; x.fillRect(0, 0, 128, 212);
    x.strokeStyle = 'rgba(40,24,20,0.85)'; x.lineWidth = 3;
    x.beginPath(); x.moveTo(-10, 150); x.quadraticCurveTo(50, 120, 140, 136); x.stroke();
    for (let k = 0; k < 40; k++) { x.fillStyle = 'rgba(40,30,22,0.8)'; x.beginPath(); x.ellipse(r() * 140, 110 + r() * 50, 5, 2.5, r() * 3, 0, Math.PI * 2); x.fill(); }
    x.fillStyle = 'rgba(60,30,18,0.92)';
    for (let i = 1; i < 4; i++) x.fillRect(i * 32 - 2, 0, 4, 212);
    for (let j = 1; j < 6; j++) x.fillRect(0, j * 35 - 2, 128, 4);
    return yDone(THREE, c, false);
  }
  /* the red board behind the Buddha and the monk: a gilt border and a lattice of four-petal flowers (Chad's v19.1 —
     no halo, no arch behind the image) */
  function makeMScreen(THREE, cnv) {
    const [c, x] = ySized(cnv, 512, 512);
    x.fillStyle = '#6e1008'; x.fillRect(0, 0, 512, 512);
    x.strokeStyle = '#d8a44a'; x.lineWidth = 10; x.strokeRect(14, 14, 484, 484); x.lineWidth = 3; x.strokeRect(32, 32, 448, 448);
    x.fillStyle = '#d8a44a';
    for (let i = 0; i < 9; i++) for (let j = 0; j < 9; j++) {
      const cx = 56 + i * 50 + (j % 2) * 25, cy = 56 + j * 50; if (cx > 470) continue;
      for (let k = 0; k < 4; k++) { x.save(); x.translate(cx, cy); x.rotate(k * Math.PI / 2); x.beginPath(); x.ellipse(0, -7, 4, 7, 0, 0, Math.PI * 2); x.fill(); x.restore(); }
      x.beginPath(); x.arc(cx, cy, 2.5, 0, Math.PI * 2); x.fill();
    }
    return yDone(THREE, c, false);
  }
  /* the donation box's front: teak, a gilt rule, ตู้ทำบุญ (a merit box) over DONATION and 功德箱 */
  function makeMBoxFront(THREE, cnv) {
    const [c, x] = ySized(cnv, 512, 400), r = yRng(251);
    const g = x.createLinearGradient(0, 0, 0, 400); g.addColorStop(0, '#5a3218'); g.addColorStop(1, '#40220e'); x.fillStyle = g; x.fillRect(0, 0, 512, 400);
    for (let k = 0; k < 60; k++) { x.strokeStyle = `rgba(${r() < 0.5 ? '30,16,6' : '120,80,40'},0.25)`; x.beginPath(); const y = r() * 400; x.moveTo(0, y); x.bezierCurveTo(170, y + (r() - 0.5) * 20, 340, y + (r() - 0.5) * 20, 512, y); x.stroke(); }
    x.strokeStyle = '#d8a44a'; x.lineWidth = 8; x.strokeRect(14, 14, 484, 372);
    x.fillStyle = '#e8bf62'; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.font = 'bold 72px sans-serif'; x.fillText('ตู้ทำบุญ', 256, 130);
    x.font = 'bold 52px sans-serif'; x.fillText('DONATION', 256, 236);
    x.font = 'bold 46px serif'; x.fillText('功 德 箱', 256, 318);
    return yDone(THREE, c, false);
  }
  /* his envelope: plain white, and on it in his own hand, in pen, who it is for */
  function makeMEnvelope(THREE, cnv) {
    const [c, x] = ySized(cnv, 512, 286), r = yRng(257);
    x.fillStyle = '#f6f2e8'; x.fillRect(0, 0, 512, 286);
    for (let k = 0; k < 20; k++) yBlob(x, 512, r() * 512, r() * 286, 20 + r() * 40, `rgba(${r() < 0.5 ? '220,212,196' : '255,255,250'},0.18)`);
    x.strokeStyle = 'rgba(160,150,130,0.45)'; x.lineWidth = 2; x.beginPath(); x.moveTo(0, 0); x.lineTo(256, 120); x.lineTo(512, 0); x.stroke();
    x.save(); x.translate(256, 190); x.rotate(-0.035);
    x.fillStyle = '#1c2a5a'; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.font = 'italic 600 34px Georgia, serif'; x.fillText('For the young lady', 0, -20);
    x.font = 'italic 600 34px Georgia, serif'; x.fillText('of the amulet', 6, 24);
    x.strokeStyle = '#1c2a5a'; x.lineWidth = 2; x.beginPath(); x.moveTo(-120, 52); x.quadraticCurveTo(0, 60, 120, 50); x.stroke();
    x.restore();
    return yDone(THREE, c, false);
  }
  /* a falling bodhi leaf: heart-shaped, wide at the stalk, with its long drip tip; gold-green, its midrib and veins */
  function makeMLeaf(THREE, cnv) {
    const S = 128, [c, x] = cnv(S);
    x.clearRect(0, 0, S, S); x.translate(64, 58);
    const g = x.createLinearGradient(0, -40, 0, 56); g.addColorStop(0, '#d8c060'); g.addColorStop(0.5, '#a8a848'); g.addColorStop(1, '#7c8a34');
    x.fillStyle = g; x.beginPath(); x.moveTo(0, -30);
    x.bezierCurveTo(24, -50, 46, -18, 30, 6); x.bezierCurveTo(20, 22, 6, 30, 1, 60);
    x.lineTo(-1, 60); x.bezierCurveTo(-6, 30, -20, 22, -30, 6); x.bezierCurveTo(-46, -18, -24, -50, 0, -30); x.fill();
    x.strokeStyle = 'rgba(250,240,190,0.7)'; x.lineWidth = 1.6; x.beginPath(); x.moveTo(0, -30); x.lineTo(0, 58); x.stroke();
    x.lineWidth = 0.9;
    for (let i = 0; i < 6; i++) { const y = -22 + i * 9; x.beginPath(); x.moveTo(0, y); x.quadraticCurveTo(12, y - 4, 24 - i * 2.5, y - 10 + i); x.moveTo(0, y); x.quadraticCurveTo(-12, y - 4, -24 + i * 2.5, y - 10 + i); x.stroke(); }
    return yDone(THREE, c, false);
  }
  /* the wet patch's alpha: soft all round, a little uneven (CP6: a hard-edged disc read as a hole in the earth) */
  function makeMWet(THREE, cnv) {
    const S = 128, [c, x] = cnv(S), r = yRng(281);
    const g = x.createRadialGradient(64, 64, 6, 64, 64, 62); g.addColorStop(0, '#ffffff'); g.addColorStop(0.5, '#d0d0d0'); g.addColorStop(1, '#000000');
    x.fillStyle = g; x.fillRect(0, 0, S, S);
    for (let k = 0; k < 14; k++) yBlob(x, S, 34 + r() * 60, 34 + r() * 60, 6 + r() * 14, 'rgba(255,255,255,0.3)');
    return yDone(THREE, c, false);
  }
  function makeMRipple(THREE, cnv) {
    const S = 128, [c, x] = cnv(S);
    const g = x.createRadialGradient(64, 64, 40, 64, 64, 62); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(0.55, 'rgba(255,255,255,0.9)'); g.addColorStop(1, 'rgba(255,255,255,0)');
    x.fillStyle = g; x.fillRect(0, 0, S, S);
    return yDone(THREE, c, false);
  }
  /* the stream: streaks along its length (v runs down it), brighter at the core, scrolled each frame */
  function makeMStream(THREE, cnv) {
    const [c, x] = ySized(cnv, 64, 256), r = yRng(263);
    x.clearRect(0, 0, 64, 256);
    const g = x.createLinearGradient(0, 0, 64, 0); g.addColorStop(0, 'rgba(255,255,255,0.15)'); g.addColorStop(0.5, 'rgba(255,255,255,0.75)'); g.addColorStop(1, 'rgba(255,255,255,0.15)');
    x.fillStyle = g; x.fillRect(0, 0, 64, 256);
    for (let k = 0; k < 40; k++) { x.fillStyle = `rgba(255,255,255,${0.25 + r() * 0.5})`; x.fillRect(8 + r() * 48, r() * 256, 1 + r() * 2, 10 + r() * 40); }
    return yDone(THREE, c, true);
  }
  /* a shaft of low sun through a window: bright at its root, soft at its edges, gone by its far end */
  function makeMShaft(THREE, cnv) {
    const [c, x] = ySized(cnv, 256, 64);
    const g = x.createLinearGradient(0, 0, 256, 0); g.addColorStop(0, 'rgba(255,255,255,0.9)'); g.addColorStop(0.6, 'rgba(255,255,255,0.35)'); g.addColorStop(1, 'rgba(255,255,255,0)');
    x.fillStyle = g; x.fillRect(0, 0, 256, 64);
    const v = x.createLinearGradient(0, 0, 0, 64); v.addColorStop(0, 'rgba(0,0,0,1)'); v.addColorStop(0.3, 'rgba(0,0,0,0)'); v.addColorStop(0.7, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,1)');
    x.globalCompositeOperation = 'destination-out'; x.fillStyle = v; x.fillRect(0, 0, 256, 64); x.globalCompositeOperation = 'source-over';
    return yDone(THREE, c, false);
  }
  /* a gable's carved panel (chapter 2's makeGableCarve): drawn to the gable's own triangle, gold kanok on dark red */
  function makeMGable(THREE, cnv, w, h) {
    const W = 1024, Hh = Math.max(128, Math.round(W * h / w)), [c, x] = ySized(cnv, W, Hh), r = yRng(269);
    x.fillStyle = '#6e110a'; x.fillRect(0, 0, W, Hh);
    x.save(); x.beginPath(); x.moveTo(W * 0.03, Hh); x.lineTo(W / 2, Hh * 0.03); x.lineTo(W * 0.97, Hh); x.closePath(); x.clip();
    x.fillStyle = '#7d140c'; x.fillRect(0, 0, W, Hh);
    const leaf = (cx, cy, sz, ang) => { x.save(); x.translate(cx, cy); x.rotate(ang);
      x.beginPath(); x.moveTo(0, sz); x.quadraticCurveTo(sz * 0.55, sz * 0.25, 0, -sz); x.quadraticCurveTo(-sz * 0.55, sz * 0.25, 0, sz); x.fill(); x.restore(); };
    x.fillStyle = '#d6a648';
    const step = Hh / 9;
    for (let row = 0; row < 9; row++) { const y = Hh - step * (row + 0.6), half = (W / 2) * (y / Hh), n = Math.max(1, Math.round(half * 2 / (step * 1.15)));
      for (let i = 0; i < n; i++) { const xx = W / 2 - half + (i + 0.5) * (half * 2 / n); leaf(xx, y, step * 0.42, (xx - W / 2) / W * 1.2 + (r() - 0.5) * 0.15); } }
    x.strokeStyle = '#e8bf62'; x.lineWidth = Math.max(2, Hh * 0.012);
    for (let i = 0; i < 26; i++) { const cy = Hh * (0.35 + r() * 0.6), span = (W / 2) * (cy / Hh), cx = W / 2 + (r() * 2 - 1) * span * 0.85, rr = step * (0.25 + r() * 0.3);
      x.beginPath(); x.arc(cx, cy, rr, r() * 6, r() * 6 + 3.6); x.stroke(); }
    x.restore();
    x.strokeStyle = '#e8bf62'; x.lineWidth = Math.max(4, Hh * 0.03);
    x.beginPath(); x.moveTo(W * 0.04, Hh * 0.985); x.lineTo(W / 2, Hh * 0.04); x.lineTo(W * 0.96, Hh * 0.985); x.closePath(); x.stroke();
    const mx = W / 2, my = Hh * 0.66, mr = Math.min(Hh * 0.2, W * 0.07);
    x.fillStyle = '#e8bf62'; x.beginPath(); x.arc(mx, my, mr, 0, Math.PI * 2); x.fill();
    x.fillStyle = '#7d140c'; x.beginPath(); x.arc(mx, my, mr * 0.74, 0, Math.PI * 2); x.fill();
    x.fillStyle = '#e8bf62'; x.beginPath(); x.arc(mx, my, mr * 0.36, 0, Math.PI * 2); x.fill();
    for (let i = 0; i < 12; i++) leaf(mx + Math.cos(i / 12 * Math.PI * 2) * mr * 1.25, my + Math.sin(i / 12 * Math.PI * 2) * mr * 1.25, mr * 0.28, i / 12 * Math.PI * 2 + Math.PI / 2);
    return yDone(THREE, c, false);
  }
  /* the pointed gilt crown over a Thai door or window, and a gable's plain triangle (chapter 2's) */
  function mCrown(THREE, w, h) {
    const s = new THREE.Shape();
    s.moveTo(-w / 2, 0);
    s.quadraticCurveTo(-w * 0.40, h * 0.50, -w * 0.10, h * 0.74); s.quadraticCurveTo(-w * 0.02, h * 0.84, 0, h);
    s.quadraticCurveTo(w * 0.02, h * 0.84, w * 0.10, h * 0.74); s.quadraticCurveTo(w * 0.40, h * 0.50, w / 2, 0);
    s.lineTo(-w / 2, 0);
    return s;
  }
  function mTri(THREE, w, h) { const s = new THREE.Shape(); s.moveTo(-w / 2, 0); s.lineTo(w / 2, 0); s.lineTo(0, h); s.lineTo(-w / 2, 0); return s; }

  /* ============================================================ WORLD H's SURFACES (CP7)
     Chapter 3's drawn surfaces, copied with its shop (a chapter never imports another): from e3c3.js at v21.32,
     unchanged. The comment that follows is chapter 3's own.
     ---------------------------------------------------------------- THE DRAWN SURFACES (e3c3)
     Every sheet is drawn here, on a canvas (CSP-safe, no download). The words
     on the signs are world art, not the sheet's (the jetty sign's precedent,
     v14.5): a shop is called what its lightbox says. */
  function rng(seed) { let s = seed >>> 0 || 1; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
  function done(THREE, c, rep) {
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
    if (rep) { t.wrapS = t.wrapT = THREE.RepeatWrapping; }
    return t;
  }
  function sized(cnv, W, H) { const [c, x] = cnv(W); c.height = H; return [c, x]; }
  /* a soft round glow (painted light: additive, no lamp) */
  /* v21.8 · the roar's ring: a thin bright band going out from the middle */
  function makeShockRing(THREE, cnv) {
    const S = 256, [c, x] = cnv(S);
    const g = x.createRadialGradient(128, 128, 0, 128, 128, 128);
    g.addColorStop(0, 'rgba(255,220,150,0)'); g.addColorStop(0.62, 'rgba(255,214,140,0.05)'); g.addColorStop(0.8, 'rgba(255,236,190,1)');
    g.addColorStop(0.88, 'rgba(255,190,90,0.55)'); g.addColorStop(1, 'rgba(255,170,60,0)');
    x.fillStyle = g; x.fillRect(0, 0, S, S);
    return done(THREE, c, false);
  }
  /* v21.8 · the lunge's streak: gold along its length, hot at its head (u = 1), soft at its edges */
  function makeStreak(THREE, cnv) {
    const [c, x] = sized(cnv, 256, 64);
    const g = x.createLinearGradient(0, 0, 256, 0);
    g.addColorStop(0, 'rgba(255,170,60,0)'); g.addColorStop(0.6, 'rgba(255,190,90,0.45)'); g.addColorStop(0.92, 'rgba(255,240,200,1)'); g.addColorStop(1, 'rgba(255,240,200,0)');
    x.fillStyle = g; x.fillRect(0, 0, 256, 64);
    const v = x.createLinearGradient(0, 0, 0, 64); v.addColorStop(0, 'rgba(0,0,0,1)'); v.addColorStop(0.5, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,1)');
    x.globalCompositeOperation = 'destination-out'; x.fillStyle = v; x.fillRect(0, 0, 256, 64);
    x.globalCompositeOperation = 'source-over';
    return done(THREE, c, false);
  }
  function makeGlowTex(THREE, cnv, rgb) {
    const S = 128, [c, x] = cnv(S);
    const g = x.createRadialGradient(64, 64, 2, 64, 64, 64);
    g.addColorStop(0, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},1)`); g.addColorStop(0.35, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},0.45)`); g.addColorStop(1, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},0)`);
    x.fillStyle = g; x.fillRect(0, 0, S, S);
    return done(THREE, c, false);
  }
  /* a small printed sign: words on a coloured card, sized to its aspect */
  function makeSignTxt(THREE, cnv, text, bg, fg, aspect) {
    const W = 512, H = Math.round(W / aspect), [c, x] = sized(cnv, W, H);
    x.fillStyle = bg; x.fillRect(0, 0, W, H);
    x.strokeStyle = fg; x.lineWidth = Math.max(2, H * 0.05); x.strokeRect(H * 0.08, H * 0.08, W - H * 0.16, H - H * 0.16);
    let px = Math.floor(H * 0.56); x.font = 'bold ' + px + 'px sans-serif';
    while (x.measureText(text).width > W * 0.86 && px > 6) { px -= 2; x.font = 'bold ' + px + 'px sans-serif'; }
    x.fillStyle = fg; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(text, W / 2, H * 0.54);
    return done(THREE, c, false);
  }
  /* the shop's floor: 600 mm porcelain, warm white, a faint vein, grout */
  function makeShopTiles(THREE, cnv) {
    const S = 512, [c, x] = cnv(S), r = rng(3);
    for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) {
      const g = 226 + r() * 10;
      x.fillStyle = `rgb(${g},${g - 4},${g - 12})`; x.fillRect(i * 256, j * 256, 256, 256);
      for (let k = 0; k < 6; k++) {                      // soft veining
        x.strokeStyle = `rgba(150,140,128,${0.05 + r() * 0.06})`; x.lineWidth = 1 + r() * 2;
        x.beginPath(); let px = i * 256 + r() * 256, py = j * 256 + r() * 256; x.moveTo(px, py);
        for (let q = 0; q < 5; q++) { px += r() * 60 - 30; py += r() * 60 - 30; x.lineTo(px, py); }
        x.stroke();
      }
      const gr = x.createLinearGradient(i * 256, j * 256, i * 256 + 256, j * 256 + 256);   // a polish sheen
      gr.addColorStop(0, 'rgba(255,255,255,0.0)'); gr.addColorStop(0.5, 'rgba(255,255,255,0.08)'); gr.addColorStop(1, 'rgba(255,255,255,0.0)');
      x.fillStyle = gr; x.fillRect(i * 256, j * 256, 256, 256);
    }
    x.fillStyle = '#b9b0a2'; for (const p of [0, 255]) { x.fillRect(0, p, S, 2); x.fillRect(p, 0, 2, S); }
    return done(THREE, c, true);
  }
  /* the old mall's terrazzo: cream, chips of grey, rust, black and white,
     brass divider strips on a 1.2 m grid */
  function makeTerrazzo(THREE, cnv) {
    const S = 512, [c, x] = cnv(S), r = rng(19);
    x.fillStyle = '#d8ccb4'; x.fillRect(0, 0, S, S);
    const cols = ['#8c8478', '#6e3b28', '#2a2622', '#f2ece0', '#a89c88', '#b7643e'];
    for (let i = 0; i < 5200; i++) {
      x.fillStyle = cols[(r() * cols.length) | 0];
      x.globalAlpha = 0.45 + r() * 0.5;
      const w = 1 + r() * 5, h = 1 + r() * 4;
      x.beginPath(); x.ellipse(r() * S, r() * S, w, h, r() * 3, 0, Math.PI * 2); x.fill();
    }
    x.globalAlpha = 1;
    const gr = x.createRadialGradient(S * 0.4, S * 0.6, 20, S * 0.4, S * 0.6, S * 0.7);   // a century of feet
    gr.addColorStop(0, 'rgba(255,250,240,0.10)'); gr.addColorStop(1, 'rgba(90,80,60,0.10)');
    x.fillStyle = gr; x.fillRect(0, 0, S, S);
    x.fillStyle = '#a8864a'; x.fillRect(0, 0, S, 3); x.fillRect(0, 0, 3, S);
    return done(THREE, c, true);
  }
  /* the 600 mm T-bar ceiling: fissured mineral tiles in a thin grey grid */
  function makeCeilGrid(THREE, cnv) {
    const S = 512, [c, x] = cnv(S), r = rng(23);
    x.fillStyle = '#ece9e2'; x.fillRect(0, 0, S, S);
    for (let i = 0; i < 2600; i++) { x.fillStyle = `rgba(120,116,108,${0.05 + r() * 0.12})`; x.fillRect(r() * S, r() * S, 1 + r() * 2, 1); }
    x.fillStyle = '#9a968e'; for (const p of [0, 254]) { x.fillRect(0, p, S, 4); x.fillRect(p, 0, 4, S); }
    return done(THREE, c, true);
  }
  /* the shop's name on its glass in gold leaf: Thai, Chinese and English, as a
     Singapore Thai-amulet shop writes it (transparent between the letters) */
  function makeGlassName(THREE, cnv) {
    const [c, x] = sized(cnv, 1024, 384);
    x.clearRect(0, 0, 1024, 384);
    const gold = x.createLinearGradient(0, 0, 0, 384);
    gold.addColorStop(0, '#ffe6a0'); gold.addColorStop(0.5, '#d4a23e'); gold.addColorStop(1, '#a8761e');
    x.textAlign = 'center'; x.textBaseline = 'middle';
    x.shadowColor = 'rgba(40,20,0,0.6)'; x.shadowBlur = 4;
    x.fillStyle = gold; x.font = 'bold 92px sans-serif'; x.fillText('พระเครื่องสยาม', 512, 92);
    x.font = 'bold 64px sans-serif'; x.fillText('暹 罗 佛 牌', 512, 200);
    x.font = 'bold 56px serif'; x.fillText('SIAM AMULET HOUSE', 512, 300);
    x.shadowBlur = 0; x.strokeStyle = '#d4a23e'; x.lineWidth = 3;
    x.beginPath(); x.moveTo(170, 248); x.lineTo(854, 248); x.stroke();
    return done(THREE, c, false);
  }
  /* the lightbox over the front, facing the corridor */
  function makeLightbox(THREE, cnv) {
    const [c, x] = sized(cnv, 1024, 192);
    const g = x.createLinearGradient(0, 0, 0, 192); g.addColorStop(0, '#b01c14'); g.addColorStop(1, '#7a0e08');
    x.fillStyle = g; x.fillRect(0, 0, 1024, 192);
    x.strokeStyle = '#f2c14e'; x.lineWidth = 6; x.strokeRect(8, 8, 1008, 176);
    x.fillStyle = '#ffe08a'; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.font = 'bold 70px sans-serif'; x.fillText('SIAM AMULET HOUSE  暹罗佛牌', 512, 72);
    x.fillStyle = '#fff4dc'; x.font = 'bold 34px sans-serif'; x.fillText('พระเครื่อง · AMULETS · BUDDHA IMAGES · 佛像', 512, 142);
    return done(THREE, c, false);
  }
  /* v21.18 · the corridor's end: the mall's directory — its name, the floors and what is on them (generic names), a
     plan of this floor with a red YOU ARE HERE; and the green EXIT over the way out */
  function makeMallDirectory(THREE, cnv) {
    const [c, x] = sized(cnv, 512, 768);
    x.fillStyle = '#16212c'; x.fillRect(0, 0, 512, 768);
    x.fillStyle = '#c9a24c'; x.fillRect(0, 0, 512, 104);
    x.fillStyle = '#1c1408'; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.font = 'bold 38px sans-serif'; x.fillText('GOLDEN MILE COMPLEX', 256, 40);
    x.font = 'bold 22px sans-serif'; x.fillText('DIRECTORY  ·  ผังร้านค้า  ·  商场指南', 256, 80);
    const floors = [['LEVEL 3', ['Karaoke Lounge', 'Thai Disco', 'Travel Agents']], ['LEVEL 2', ['Thai Restaurants', 'Coach Ticketing', 'Massage']],
                    ['LEVEL 1', ['Thai Mart', 'Amulets', 'Money Changer', 'Mobile']], ['B1', ['Supermarket', 'Food Court']]];
    let y = 136;
    for (const [fl, units] of floors) {
      x.fillStyle = '#c9a24c'; x.fillRect(24, y - 16, 112, 32);
      x.fillStyle = '#1c1408'; x.font = 'bold 20px sans-serif'; x.fillText(fl, 80, y);
      x.fillStyle = '#e8eef2'; x.font = '19px sans-serif'; x.textAlign = 'left';
      units.forEach((u, i) => x.fillText(u, 156 + (i % 2) * 176, y + Math.floor(i / 2) * 26 - (units.length > 2 ? 12 : 0)));
      x.textAlign = 'center'; y += 74;
    }
    // this floor's plan: the corridor, the shops either side, the lifts at its end
    const px = 40, py = 448, pw = 432, ph = 250;
    x.fillStyle = '#22303e'; x.fillRect(px, py, pw, ph);
    x.strokeStyle = '#8aa0b4'; x.lineWidth = 2;
    for (let i = 0; i < 7; i++) { x.strokeRect(px + 8 + i * 60, py + 10, 54, 70); x.strokeRect(px + 8 + i * 60, py + ph - 80, 54, 70); }
    x.fillStyle = '#d8b04a'; x.fillRect(px + 8 + 3 * 60, py + ph - 80, 54, 70);              // the amulet shop
    x.fillStyle = '#5a6a7a'; x.fillRect(px + 2, py + 96, 30, 58);                             // the lifts
    x.fillStyle = '#e8263c'; x.beginPath(); x.arc(px + 60, py + 125, 11, 0, Math.PI * 2); x.fill();
    x.fillStyle = '#ffffff'; x.font = 'bold 18px sans-serif'; x.textAlign = 'left'; x.fillText('YOU ARE HERE', px + 80, py + 126);
    x.textAlign = 'center'; x.fillStyle = '#9ab0c4'; x.font = '16px sans-serif'; x.fillText('LIFT  ลิฟต์  电梯', px + pw / 2 + 40, py + ph + 30);
    return done(THREE, c, false);
  }
  function makeExitSign(THREE, cnv) {
    const [c, x] = sized(cnv, 256, 96);
    x.fillStyle = '#0f8a3e'; x.fillRect(0, 0, 256, 96);
    x.fillStyle = '#ffffff'; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.font = 'bold 46px sans-serif'; x.fillText('EXIT 出口', 150, 50);
    x.beginPath(); x.moveTo(28, 50); x.lineTo(58, 28); x.lineTo(58, 42); x.lineTo(80, 42); x.lineTo(80, 58); x.lineTo(58, 58); x.lineTo(58, 72); x.closePath(); x.fill();
    return done(THREE, c, false);
  }
  /* v21.18 · THE MALL'S SHOPS, BUILT — the drawn parts. Their signboards, one atlas: ten lightboxes of 1024 × 128,
     each a shop's own (a lit face, a bright edge, the name in English with its Thai or Chinese, a line under it) */
  const MALL_SIGNS = [
    { bg: ['#1e5aa8', '#0f356c'], edge: '#9fd0ff', ink: '#ffffff', name: 'BANGKOK TRAVEL  ทัวร์', sub: 'BUS · AIR · TOURS · VISA' },
    { bg: ['#23824a', '#12512b'], edge: '#ffe27a', ink: '#fff6cc', name: 'THAI MART  ร้านค้าไทย', sub: 'FRESH FROM BANGKOK DAILY' },
    { bg: ['#e07a18', '#a24a08'], edge: '#ffe2a8', ink: '#fffaf0', name: 'THAI KITCHEN  อาหารไทย', sub: 'BOAT NOODLES · TOM YUM · MOOKATA' },
    { bg: ['#c2457a', '#7e1f4a'], edge: '#ffd0e4', ink: '#fff4fa', name: 'THAI MASSAGE  นวดไทย', sub: 'FOOT · BODY · HERBAL COMPRESS' },
    { bg: ['#9a1810', '#5a0a06'], edge: '#ffd24a', ink: '#ffd84e', name: '金 店   GOLDSMITH', sub: '916 · 999 GOLD  ·  BUY & SELL' },
    { bg: ['#1a1c22', '#08090c'], edge: '#3ad0ff', ink: '#8ae8ff', name: 'MOBILE CENTRE', sub: 'REPAIR · TOP-UP · THAI SIM' },
    { bg: ['#8a8478', '#5e5a52'], edge: '#b8b2a4', ink: '#d6d0c2', name: 'SUCCESS TRADING', sub: '' , faded: true },
    { bg: ['#14523e', '#0a3024'], edge: '#7affc8', ink: '#e8fff4', name: 'MONEY CHANGER  แลกเงิน', sub: 'THB · MYR · USD · RMB' },
    { bg: ['#d8261c', '#8e0e08'], edge: '#ffe14a', ink: '#ffe94e', name: 'HAT YAI EXPRESS', sub: 'COACHES DAILY · HAT YAI · KL · BANGKOK' },
    { bg: ['#f2b81c', '#c47e08'], edge: '#fff6cc', ink: '#5a1608', name: 'THAI SNACKS  ขนมไทย', sub: 'SWEETS · DRIED FRUIT · CHILLI PASTE' }];
  function makeMallSigns(THREE, cnv) {
    const [c, x] = sized(cnv, 1024, 1280);
    MALL_SIGNS.forEach((s, i) => {
      const y = i * 128, g = x.createLinearGradient(0, y, 0, y + 128);
      g.addColorStop(0, s.bg[0]); g.addColorStop(1, s.bg[1]);
      x.fillStyle = g; x.fillRect(0, y, 1024, 128);
      x.strokeStyle = s.edge; x.lineWidth = 6; x.strokeRect(6, y + 6, 1012, 116);
      x.globalAlpha = 0.18; x.fillStyle = '#ffffff'; x.fillRect(12, y + 12, 1000, 36); x.globalAlpha = 1;   // the lightbox's own sheen
      x.fillStyle = s.ink; x.textAlign = 'center'; x.textBaseline = 'middle';
      x.font = `bold ${s.sub ? 54 : 64}px sans-serif`; x.fillText(s.name, 512, y + (s.sub ? 52 : 64));
      if (s.sub) { x.font = 'bold 26px sans-serif'; x.fillText(s.sub, 512, y + 102); }
      if (s.faded) {                                        // an old sign nobody has lit for years: streaks, a corner gone
        x.globalAlpha = 0.35; for (let k = 0; k < 40; k++) { x.fillStyle = k % 2 ? '#4a463e' : '#a29c8e'; x.fillRect((k * 97) % 1000, y + 8, 3 + (k % 4), 112); }
        x.globalAlpha = 1; x.fillStyle = '#3a3630'; x.beginPath(); x.moveTo(900, y + 128); x.lineTo(1024, y + 70); x.lineTo(1024, y + 128); x.fill();
      }
    });
    return done(THREE, c, false);
  }
  /* their posters, menus and boards, one atlas of sixteen 256 × 256 cells (see MALL_POSTER for which is which) */
  const MALL_POSTER = { bangkok: 0, phuket: 1, hatyai: 2, timetable: 3, menu: 4, massage: 5, rates: 6, sim: 7,
                        tolet: 8, noodles: 9, goldrate: 10, elephant: 11, tomyum: 12, coach: 13, calendar: 14, rice: 15 };
  function makeMallPosters(THREE, cnv) {
    const [c, x] = sized(cnv, 1024, 1024), r = rng(2118);
    const cell = (i, fn) => { const cx = (i % 4) * 256, cy = Math.floor(i / 4) * 256; x.save(); x.translate(cx, cy); x.beginPath(); x.rect(0, 0, 256, 256); x.clip(); fn(); x.restore(); };
    const txt = (s, X, Y, px, col, al = 'center') => { x.fillStyle = col; x.textAlign = al; x.textBaseline = 'middle'; x.font = `bold ${px}px sans-serif`; x.fillText(s, X, Y); };
    const sky = (a, b) => { const g = x.createLinearGradient(0, 0, 0, 256); g.addColorStop(0, a); g.addColorStop(1, b); x.fillStyle = g; x.fillRect(0, 0, 256, 256); };
    cell(0, () => { sky('#f4a040', '#6a1c10');                                   // BANGKOK: a temple's spires at sunset
      x.fillStyle = '#ffd890'; x.beginPath(); x.arc(170, 96, 30, 0, 7); x.fill();
      x.fillStyle = '#2a0e08';
      for (const [px, h, w] of [[60, 120, 30], [110, 160, 40], [168, 110, 28], [210, 80, 22]]) { x.beginPath(); x.moveTo(px, 210 - h); x.lineTo(px + w / 2, 210); x.lineTo(px - w / 2, 210); x.fill(); x.fillRect(px - w * 0.7, 196, w * 1.4, 16); }
      x.fillRect(0, 210, 256, 46); txt('BANGKOK', 128, 232, 34, '#ffe6a8'); });
    cell(1, () => { sky('#3ab4e8', '#f2e2a8');                                   // PHUKET: sea, sand, a longtail boat
      x.fillStyle = '#1a7ab0'; x.fillRect(0, 120, 256, 60); x.fillStyle = '#f6e6b0'; x.fillRect(0, 180, 256, 76);
      x.fillStyle = '#7a3a14'; x.beginPath(); x.moveTo(60, 150); x.lineTo(170, 150); x.lineTo(150, 168); x.lineTo(76, 168); x.fill();
      x.fillStyle = '#2a5a1c'; for (const px of [20, 228]) { x.fillRect(px, 70, 6, 110); x.beginPath(); x.ellipse(px + 3, 70, 40, 12, 0.3, 0, 7); x.fill(); }
      txt('PHUKET', 128, 226, 38, '#0e4a78'); });
    cell(2, () => { sky('#4a3a9a', '#e8708a');                                   // HAT YAI: the city at dusk
      x.fillStyle = '#1a1430'; for (let k = 0; k < 9; k++) { const h = 50 + r() * 90; x.fillRect(k * 29, 200 - h, 26, h); }
      x.fillStyle = '#ffd86a'; for (let k = 0; k < 40; k++) x.fillRect(4 + r() * 248, 110 + r() * 86, 3, 4);
      x.fillStyle = '#1a1430'; x.fillRect(0, 200, 256, 56); txt('HAT YAI', 128, 228, 36, '#ffe0f0'); });
    cell(3, () => { x.fillStyle = '#101418'; x.fillRect(0, 0, 256, 256);          // the coach timetable, an LED board
      txt('DEPARTURES  ออกเดินทาง', 128, 22, 17, '#ffd23a');
      [['HAT YAI', '08:00'], ['HAT YAI', '10:30'], ['K. LUMPUR', '13:00'], ['BANGKOK', '15:45'], ['HAT YAI', '21:00'], ['SONGKHLA', '22:30']].forEach(([d, t], k) => {
        txt(d, 18, 58 + k * 32, 19, '#ff8a2a', 'left'); txt(t, 238, 58 + k * 32, 19, '#7aff8a', 'right'); }); });
    cell(4, () => { x.fillStyle = '#fff4dc'; x.fillRect(0, 0, 256, 256);          // the kitchen's menu: six dishes, a price each
      txt('MENU  เมนู', 128, 20, 20, '#a8320a');
      const dish = [['#d8501c', 'TOM YUM'], ['#7a3a1a', 'BOAT NOODLE'], ['#e8c040', 'PAD THAI'], ['#3a8a2a', 'GREEN CURRY'], ['#c8642a', 'BASIL PORK'], ['#f0e0b0', 'MANGO RICE']];
      dish.forEach(([col, n], k) => { const X = 46 + (k % 3) * 82, Y = 72 + Math.floor(k / 3) * 96;
        x.fillStyle = '#f8f8f4'; x.beginPath(); x.arc(X, Y, 30, 0, 7); x.fill(); x.fillStyle = col; x.beginPath(); x.arc(X, Y, 23, 0, 7); x.fill();
        txt(n, X, Y + 42, 11, '#3a1a0a'); txt('$' + (5 + k % 3), X, Y + 56, 12, '#a8320a'); }); });
    cell(5, () => { x.fillStyle = '#5a1a3a'; x.fillRect(0, 0, 256, 256);          // the massage price list
      x.strokeStyle = '#f2c4d8'; x.lineWidth = 3; x.strokeRect(8, 8, 240, 240);
      txt('PRICE LIST', 128, 34, 22, '#ffd8ea');
      [['FOOT 45 min', '$28'], ['THAI 1 hr', '$38'], ['OIL 1 hr', '$42'], ['HERBAL 90 min', '$58']].forEach(([a, b], k) => { txt(a, 20, 82 + k * 40, 17, '#fff0f6', 'left'); txt(b, 236, 82 + k * 40, 17, '#ffd24a', 'right'); }); });
    cell(6, () => { x.fillStyle = '#060806'; x.fillRect(0, 0, 256, 256);          // the money changer's rates, red and green LEDs
      txt('WE BUY    WE SELL', 128, 18, 16, '#ffffff');
      [['THB', '25.40', '24.10'], ['MYR', '3.42', '3.28'], ['USD', '1.33', '1.30'], ['RMB', '5.36', '5.10'], ['IDR', '11,850', '11,200']].forEach(([c3, a, b], k) => {
        txt(c3, 12, 52 + k * 42, 20, '#ffffff', 'left'); txt(a, 158, 52 + k * 42, 20, '#ff3a2a', 'right'); txt(b, 246, 52 + k * 42, 20, '#3aff6a', 'right'); }); });
    cell(7, () => { sky('#0a1a4a', '#2a6ad8');                                   // the phone shop's offer
      x.fillStyle = '#ffffff'; x.fillRect(150, 40, 70, 130); x.fillStyle = '#2a8ae8'; x.fillRect(156, 50, 58, 104);
      txt('THAI SIM', 80, 70, 28, '#ffe14a'); txt('$10', 80, 120, 46, '#ffffff'); txt('5G · 30 DAYS', 128, 210, 22, '#bfe6ff'); });
    cell(8, () => { x.fillStyle = '#f4f2ea'; x.fillRect(0, 0, 256, 256);          // TO LET
      x.fillStyle = '#c81e14'; x.fillRect(0, 0, 256, 74); txt('TO LET', 128, 40, 50, '#ffffff');
      txt('SHOP UNIT', 128, 110, 24, '#1a1a1a'); txt('Enquiries', 128, 156, 20, '#3a3a3a'); txt('9xxx xxxx', 128, 190, 26, '#1a1a1a'); });
    cell(9, () => { x.fillStyle = '#ffe23a'; x.fillRect(0, 0, 256, 256);          // the grocer's offer
      txt('PROMO!', 128, 34, 34, '#d8201a'); for (let k = 0; k < 5; k++) { x.fillStyle = ['#e8401a', '#2a9a3a', '#e8a01a', '#8a2ad8', '#1a7ad8'][k]; x.fillRect(18 + k * 46, 80, 38, 56); }
      txt('INSTANT NOODLES', 128, 168, 20, '#3a1a0a'); txt('5 FOR $3', 128, 212, 36, '#d8201a'); });
    cell(10, () => { x.fillStyle = '#7a0a06'; x.fillRect(0, 0, 256, 256);         // the goldsmith's board: 金, 福, today's price
      txt('金', 70, 80, 90, '#ffd24a'); txt('福', 190, 80, 90, '#ffd24a');
      txt('916 GOLD', 128, 170, 26, '#ffe6a0'); txt('TODAY $102 /g', 128, 212, 24, '#ffffff'); });
    cell(11, () => { sky('#2a6a3a', '#d8b86a');                                   // a framed picture: an elephant in a field
      x.fillStyle = '#4a4440'; x.beginPath(); x.ellipse(128, 150, 70, 46, 0, 0, 7); x.fill(); x.fillRect(80, 170, 22, 50); x.fillRect(150, 170, 22, 50);
      x.beginPath(); x.ellipse(196, 132, 30, 34, 0, 0, 7); x.fill(); x.fillRect(214, 140, 14, 70);
      x.strokeStyle = '#c89a3a'; x.lineWidth = 10; x.strokeRect(5, 5, 246, 246); });
    cell(12, () => { x.fillStyle = '#2a0a06'; x.fillRect(0, 0, 256, 256);         // TOM YUM, a bowl
      x.fillStyle = '#f2f0ea'; x.beginPath(); x.arc(128, 128, 92, 0, 7); x.fill(); x.fillStyle = '#e0501a'; x.beginPath(); x.arc(128, 128, 78, 0, 7); x.fill();
      x.fillStyle = '#f4a8a0'; for (let k = 0; k < 6; k++) { x.beginPath(); x.ellipse(128 + Math.cos(k) * 40, 128 + Math.sin(k * 1.3) * 34, 16, 9, k, 0, 7); x.fill(); }
      x.fillStyle = '#4ab43a'; for (let k = 0; k < 8; k++) x.fillRect(90 + r() * 80, 96 + r() * 70, 9, 4);
      txt('TOM YUM GOONG', 128, 236, 22, '#ffd24a'); });
    cell(13, () => { sky('#f0f4f8', '#b8d0e8');                                  // a coach, side on
      x.fillStyle = '#ffffff'; x.fillRect(20, 90, 216, 90); x.fillStyle = '#d8261c'; x.fillRect(20, 150, 216, 16); x.fillStyle = '#1a2a3a'; x.fillRect(30, 100, 196, 34);
      x.fillStyle = '#1a1a1a'; for (const px of [64, 190]) { x.beginPath(); x.arc(px, 182, 16, 0, 7); x.fill(); }
      txt('TO HAT YAI', 128, 40, 28, '#d8261c'); txt('DAILY · $45', 128, 226, 26, '#1a1a1a'); });
    cell(14, () => { x.fillStyle = '#fffaf2'; x.fillRect(0, 0, 256, 256);          // a calendar
      x.fillStyle = '#c81e14'; x.fillRect(0, 0, 256, 56); txt('2026', 128, 30, 30, '#ffffff');
      for (let k = 0; k < 35; k++) txt(String(k % 31 + 1), 24 + (k % 7) * 35, 80 + Math.floor(k / 7) * 34, 15, k % 7 === 0 ? '#c81e14' : '#2a2a2a'); });
    cell(15, () => { x.fillStyle = '#f6f2e6'; x.fillRect(0, 0, 256, 256);          // a rice sack's print
      x.fillStyle = '#1e7a3a'; x.fillRect(0, 70, 256, 110); txt('JASMINE RICE', 128, 104, 26, '#ffffff'); txt('ข้าวหอมมะลิ', 128, 146, 26, '#ffe14a'); txt('5 KG', 128, 214, 30, '#1e7a3a'); });
    return done(THREE, c, false);
  }
  /* one amulet in its case, for the atlas: k picks the kind */
  function drawAmulet(x, cx, cy, s, k, r) {
    const casing = k % 3 === 0 ? '#d6a640' : k % 3 === 1 ? '#c8ccd2' : '#2a2a2a';
    const clay = ['#c9b48e', '#8a6a44', '#5a4a3a', '#d8c8a4', '#b08a5a', '#7a5a3a', '#e0d0b0', '#a07a50'][k % 8];
    x.save(); x.translate(cx, cy);
    const shape = (pad) => {
      x.beginPath();
      if (k === 2) { x.moveTo(0, -s - pad); x.lineTo(s * 0.8 + pad, s * 0.8 + pad); x.lineTo(-s * 0.8 - pad, s * 0.8 + pad); x.closePath(); }
      else if (k === 3 || k === 5) x.arc(0, 0, s * (k === 5 ? 1.0 : 0.8) + pad, 0, Math.PI * 2);
      else if (k === 4) { x.moveTo(-s * 0.6 - pad, s + pad); x.lineTo(-s * 0.6 - pad, -s * 0.3); x.lineTo(0, -s - pad); x.lineTo(s * 0.6 + pad, -s * 0.3); x.lineTo(s * 0.6 + pad, s + pad); x.closePath(); }
      else if (k === 7) { x.rect(-s * 0.25 - pad, -s - pad, s * 0.5 + 2 * pad, 2 * s + 2 * pad); }
      else x.rect(-s * 0.62 - pad, -s - pad, s * 1.24 + 2 * pad, 2 * s + 2 * pad);
    };
    x.fillStyle = casing; shape(s * 0.12); x.fill();
    x.fillStyle = clay; shape(0); x.fill();
    // the image on its face: a seated figure under an arch, or a monk's head on a coin
    x.fillStyle = 'rgba(40,24,10,0.55)';
    if (k === 3 || k === 5) { x.beginPath(); x.arc(0, -s * 0.15, s * 0.32, 0, Math.PI * 2); x.fill(); x.fillRect(-s * 0.4, s * 0.15, s * 0.8, s * 0.35); }
    else if (k === 7) { for (let i = -3; i <= 3; i++) x.fillRect(-s * 0.2, i * s * 0.26, s * 0.4, s * 0.06); }
    else {
      x.beginPath(); x.arc(0, -s * 0.38, s * 0.16, 0, Math.PI * 2); x.fill();
      x.beginPath(); x.moveTo(-s * 0.36, s * 0.42); x.quadraticCurveTo(0, -s * 0.3, s * 0.36, s * 0.42); x.closePath(); x.fill();
      x.fillRect(-s * 0.46, s * 0.42, s * 0.92, s * 0.1);
      if (k === 0) { x.strokeStyle = 'rgba(40,24,10,0.5)'; x.lineWidth = 2; x.beginPath(); x.arc(0, -s * 0.1, s * 0.5, Math.PI, 0); x.stroke(); }
    }
    x.fillStyle = 'rgba(255,255,255,0.22)'; x.beginPath(); x.ellipse(-s * 0.2, -s * 0.5, s * 0.25, s * 0.1, -0.5, 0, Math.PI * 2); x.fill();
    x.restore();
  }
  /* red velvet under a counter's glass, rows of cased amulets on it */
  function makeVelvetTray(THREE, cnv, seed) {
    const [c, x] = sized(cnv, 1024, 256), r = rng(seed);
    const g = x.createLinearGradient(0, 0, 0, 256); g.addColorStop(0, '#6a0c10'); g.addColorStop(1, '#4a0608');
    x.fillStyle = g; x.fillRect(0, 0, 1024, 256);
    for (let i = 0; i < 1800; i++) { x.fillStyle = `rgba(${r() < 0.5 ? '120,20,24' : '30,0,2'},${r() * 0.3})`; x.fillRect(r() * 1024, r() * 256, 2, 2); }
    for (let row = 0; row < 3; row++) for (let i = 0; i < 16; i++) {
      drawAmulet(x, 34 + i * 63 + (row % 2) * 12, 46 + row * 80, 24, (i + row * 3 + (seed % 5)) % 8, r);
      x.fillStyle = '#f4ecd8'; x.fillRect(22 + i * 63 + (row % 2) * 12, 78 + row * 80, 26, 9);   // its price tag
    }
    return done(THREE, c, false);
  }
  /* framed amulets, one kind to a cell, for the wall cabinets */
  function makeAmuletAtlas(THREE, cnv) {
    const [c, x] = sized(cnv, 1024, 512), r = rng(77);
    for (let k = 0; k < 8; k++) {
      const cx = (k % 4) * 256, cy = ((k / 4) | 0) * 256;
      x.fillStyle = '#efe6d0'; x.fillRect(cx, cy, 256, 256);
      x.fillStyle = '#5a0a0c'; x.fillRect(cx + 18, cy + 18, 220, 220);                    // the velvet of the frame's mount
      drawAmulet(x, cx + 128, cy + 128, 70, k, r);
    }
    return done(THREE, c, false);
  }
  /* a Thai wall calendar: the red header, a temple picture, the month's grid */
  function makeCalendar(THREE, cnv) {
    const [c, x] = sized(cnv, 256, 384);
    x.fillStyle = '#fbf7ee'; x.fillRect(0, 0, 256, 384);
    x.fillStyle = '#b21a12'; x.fillRect(0, 0, 256, 40);
    x.fillStyle = '#ffe08a'; x.font = 'bold 22px sans-serif'; x.textAlign = 'center'; x.fillText('พฤษภาคม 2569', 128, 28);
    const g = x.createLinearGradient(0, 44, 0, 196); g.addColorStop(0, '#f6b04a'); g.addColorStop(1, '#8a2a12');
    x.fillStyle = g; x.fillRect(12, 46, 232, 150);
    x.fillStyle = '#e8b030'; x.beginPath(); x.moveTo(128, 70); x.lineTo(168, 180); x.lineTo(88, 180); x.fill();   // a chedi
    x.fillStyle = '#3a2a2a'; x.font = '15px sans-serif';
    for (let d = 0; d < 31; d++) { const col = d % 7, row = (d / 7) | 0; x.fillStyle = d === 30 ? '#b21a12' : '#3a2a2a'; x.fillText(String(d + 1), 26 + col * 34, 226 + row * 32); }
    return done(THREE, c, false);
  }
  /* the wall clock's face (the hands are meshes, so the time can pass) */
  function makeClockFace(THREE, cnv) {
    const S = 256, [c, x] = cnv(S);
    x.fillStyle = '#fbfaf6'; x.beginPath(); x.arc(128, 128, 124, 0, Math.PI * 2); x.fill();
    x.strokeStyle = '#2a2a2a'; x.lineWidth = 6; x.stroke();
    x.fillStyle = '#1a1a1a'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.font = 'bold 26px sans-serif';
    for (let h = 1; h <= 12; h++) { const a = h / 12 * Math.PI * 2; x.fillText(String(h), 128 + Math.sin(a) * 96, 128 - Math.cos(a) * 96); }
    for (let m = 0; m < 60; m++) { const a = m / 60 * Math.PI * 2, L = m % 5 ? 6 : 12; x.lineWidth = m % 5 ? 2 : 4;
      x.beginPath(); x.moveTo(128 + Math.sin(a) * 118, 128 - Math.cos(a) * 118); x.lineTo(128 + Math.sin(a) * (118 - L), 128 - Math.cos(a) * (118 - L)); x.stroke(); }
    return done(THREE, c, false);
  }
  /* the Buddhist flag: blue, yellow, red, white, orange, and the sixth band
     that is all five together */
  function makeBuddhistFlag(THREE, cnv) {
    const [c, x] = sized(cnv, 240, 160);
    const cols = ['#2b5fb4', '#f2c12e', '#c8261c', '#f6f4ee', '#e8781e'];
    for (let i = 0; i < 5; i++) { x.fillStyle = cols[i]; x.fillRect(i * 40, 0, 40, 160); }
    for (let i = 0; i < 5; i++) { x.fillStyle = cols[i]; x.fillRect(200, i * 32, 40, 32); }
    return done(THREE, c, false);
  }
  /* the red board behind the shop's Buddha (chapter 1's v19.1 lai rot nam,
     redrawn at a shop's size) */
  function makeAltarScreen(THREE, cnv) {
    const W = 768, H = 640, [c, x] = sized(cnv, W, H), r = rng(41);
    const GOLD = '#d7a548', GOLD2 = '#f0cf7a', DEEP = '#6d140e';
    const g = x.createRadialGradient(W / 2, H * 0.42, 50, W / 2, H * 0.5, W * 0.72);
    g.addColorStop(0, '#7a1a12'); g.addColorStop(1, '#5a0f0a');
    x.fillStyle = g; x.fillRect(0, 0, W, H);
    const B = 70, P = 80;
    x.save(); x.beginPath(); x.rect(B, B, W - 2 * B, H - 2 * B); x.clip();
    x.strokeStyle = GOLD; x.lineWidth = 2.5;
    for (let k = -H; k < W + H; k += P) { x.beginPath(); x.moveTo(k, 0); x.lineTo(k + H, H); x.stroke(); x.beginPath(); x.moveTo(k, H); x.lineTo(k + H, 0); x.stroke(); }
    const flower = (cx, cy, rr) => {
      x.fillStyle = GOLD;
      for (let i = 0; i < 4; i++) { x.save(); x.translate(cx, cy); x.rotate(i * Math.PI / 2);
        x.beginPath(); x.moveTo(0, 0); x.bezierCurveTo(rr * 0.55, -rr * 0.35, rr * 0.75, -rr * 0.05, rr, 0); x.bezierCurveTo(rr * 0.75, rr * 0.05, rr * 0.55, rr * 0.35, 0, 0); x.fill(); x.restore(); }
      x.fillStyle = GOLD2; x.beginPath(); x.arc(cx, cy, rr * 0.2, 0, Math.PI * 2); x.fill();
    };
    for (let row = 0, y = 0; y <= H + P; row++, y += P / 2) for (let xx = (row % 2) * P / 2; xx <= W + P; xx += P) flower(xx, y, 20);
    x.restore();
    x.fillStyle = DEEP; x.fillRect(0, 0, W, B); x.fillRect(0, H - B, W, B); x.fillRect(0, 0, B, H); x.fillRect(W - B, 0, B, H);
    x.strokeStyle = GOLD; x.lineWidth = 5; x.strokeRect(10, 10, W - 20, H - 20); x.lineWidth = 3; x.strokeRect(B - 6, B - 6, W - 2 * B + 12, H - 2 * B + 12);
    for (let i = 0; i < 900; i++) { x.fillStyle = `rgba(${r() < 0.5 ? '255,220,150' : '30,6,4'},${r() * 0.07})`; x.fillRect(r() * W, r() * H, 2 + r() * 3, 1 + r() * 2); }
    return done(THREE, c, false);
  }
  function makeReedMat(THREE, cnv) {
    const S = 256, [c, x] = cnv(S), r = rng(13);
    x.fillStyle = '#b89a62'; x.fillRect(0, 0, S, S);
    for (let i = 0; i < S; i += 4) { const v = 150 + r() * 50; x.fillStyle = `rgb(${v},${v * 0.82 | 0},${v * 0.52 | 0})`; x.fillRect(0, i, S, 3); }
    x.fillStyle = '#7a1c14'; x.fillRect(0, 0, S, 14); x.fillRect(0, S - 14, S, 14);                   // its red binding
    return done(THREE, c, false);
  }
  /* boxes of amulet cases on the back shelves, labels in Thai and English */
  function makeBoxRow(THREE, cnv) {
    const [c, x] = sized(cnv, 512, 128), r = rng(53);
    x.fillStyle = '#3a2a1e'; x.fillRect(0, 0, 512, 128);
    for (let i = 0; i < 12; i++) {
      const w = 34 + r() * 8; x.fillStyle = ['#e8e0cc', '#c8a050', '#d8d4cc', '#8a1a14', '#f2ecd8'][(r() * 5) | 0];
      x.fillRect(6 + i * 42, 20 + r() * 20, w, 108);
      x.fillStyle = 'rgba(60,30,10,0.8)'; x.font = 'bold 12px sans-serif'; x.fillText(['LP', 'พระ', '#', 'AJ', 'วัด'][i % 5] + ((i * 37) % 90 + 10), 10 + i * 42, 70);
    }
    return done(THREE, c, false);
  }

  /* the roller shutter's slats, grey and rust-streaked */
  function makeShutter(THREE, cnv) {
    const [c, x] = sized(cnv, 256, 256), r = rng(73);
    for (let y = 0; y < 256; y += 16) {
      const g = x.createLinearGradient(0, y, 0, y + 16);
      g.addColorStop(0, '#9aa0a4'); g.addColorStop(0.45, '#c8ccd0'); g.addColorStop(0.55, '#7c8286'); g.addColorStop(1, '#5c6064');
      x.fillStyle = g; x.fillRect(0, y, 256, 16);
    }
    for (let i = 0; i < 40; i++) { x.fillStyle = `rgba(120,64,30,${0.05 + r() * 0.12})`; x.fillRect(r() * 256, r() * 256, 2 + r() * 3, 10 + r() * 50); }
    return done(THREE, c, true);
  }

  /* ============================================================ THE FILMS FROM PLAY
     CP6 and CP7 build them; until then each is its black and its hand-off. */
  /* THE MERIT FILM (CP6) · S1·09: "Later I went to a temple and made a contribution dedicated to her." From the Yin
     shop's door into a Thai temple at sunset: the courtyard, the donation box (his envelope, its words to the lens, into
     the slot), kneeling before the monk with his hands joined while he dedicates it, the kruat nam — the water poured
     into the silver bowl while the monk chants the Yathā vārivahā (its four lines captioned, the Pali over what it
     means), the bowl filling — and the water given to the earth at the bodhi's roots: the breeze, the petals, and a pale
     light rising from the wet earth into the dusk. Every picture is a function of the film's clock (stage.merit.frame:
     a seek, a skip, a replay and a one-frame-a-second phone land on the same frame); this holds its cues, its words, its
     fades and the one track that calls it. Every cue is literal, so the engine warms it before the film can start. */
  function meritFilm(c, s, api) {
    const { tr, step, sfx, sfxFade, fade, stage } = api;
    const MC = stage.merit, W = DATA.words, K = api.kit;
    c.keepFade = true;                                   // its last black is handed to the kit's fade: World H lifts it
    c.endFade = 1;                                       // and stays black from the frame it ends (CP11: it fell to 0 for a frame)
    fade(0, 0.8, 0, 1);                                  // out of the Yin shop, into black
    step(0.85, () => MC.begin());
    tr(0.85, 48.4, (k, t) => MC.frame(t, api));
    fade(1.2, 2.6, 1, 0);                                // S1 · the courtyard at sunset
    sfx(1.4, 'm4music', 0.55);
    sfx(1.9, 'z4tem1', 1);                               // "Later I went to a temple..."
    sfx(4.6, 'm4bell', 0.75);                            // the bell in its pavilion, struck
    sfx(12.2, 'm4envelope', 0.8);                        // S2b · the envelope into the slot
    sfx(14.6, 'z4dedicate', 1);                          // S3 · kneeling, his hands joined: the dedication
    sfxFade(18.5, 22.5, 'm4music');
    sfx(22.4, 'mk4yatha', 1);                            // S4 · the monk chants as the water is poured
    step(22.4, () => {
      // the verse's four lines, timed on the take's own breaths (masters/v22.0/cp6: 0, 3.56, 6.71, 9.73 s)
      if (K && K.captions) K.captions([
        { at: 0.0, end: 3.3, text: W.yatha1, sub: W.yatha1en },
        { at: 3.45, end: 6.45, text: W.yatha2, sub: W.yatha2en },
        { at: 6.6, end: 9.5, text: W.yatha3, sub: W.yatha3en },
        { at: 9.6, end: 12.6, text: W.yatha4, sub: W.yatha4en }
      ]);
    });
    sfx(22.6, 'm4pour', 0.55);
    sfxFade(33.8, 35.2, 'm4pour');
    fade(35.0, 35.7, 0, 1);                              // the bowl full: black
    fade(36.0, 37.2, 1, 0);                              // S6 · the bodhi's roots in the dusk
    sfx(36.2, 'm4coda', 0.6);
    sfx(36.6, 'm4ground', 0.7);                          // the water given to the earth
    sfx(39.4, 'm4leaves', 0.6);                          // the breeze, the petals
    sfx(40.4, 'm4rise', 0.55);                           // the light rising from the wet earth
    sfx(43.0, 'z4tem2', 1);
    fade(46.0, 48.0, 0, 1);
    sfxFade(46.0, 48.6, 'm4coda');
    step(48.4, () => MC.end());
  }
  /* THE RUN-OUT (CP7): out of the shop and down the corridor to its end — every picture from stage.runout's frame(t);
     the film holds only its cues, its one fade and the track that draws it (the merit film's shape) */
  function runoutFilm(c, s, api) {
    const { tr, step, sfx, sfxFade, fade, stage } = api;
    const RC = stage.runout;
    c.keepFade = true;                                   // its last black is handed to the kit's fade: World T lifts it
    c.endFade = 1;
    step(0.0, () => RC.begin());
    tr(0.0, 23.2, (k, t) => RC.frame(t, api));
    sfx(0.8, 'h4feet', 0.55);                            // R1 · the whip-turn, and running for the door
    sfxFade(3.0, 3.5, 'h4feet');
    sfx(2.3, 'y4bell', 0.55);                            // the door's bell as the leaves swing out
    step(4.3, () => RC.staffSays());                     // R2 · the staff man, at the door's glass
    sfx(4.3, 'sm4what', 1);                              // "Boss... what happened to him?"
    sfx(7.9, 'h4feet', 0.8);                             // R3 · down the corridor
    sfx(9.3, 'h4crowd', 0.6);                            // the shoppers, startled, as he goes past
    sfxFade(12.2, 12.9, 'h4feet');
    sfx(12.9, 'h4pant', 0.85);                           // R4 · the corridor's end: his breath
    sfx(14.6, 'z4hide', 1);                              // "I couldn't let anyone see me like that..."
    fade(21.6, 22.9, 0, 1);
    step(23.2, () => {});
  }

  /* ---------------------------------------------------------------- WORLD T · THE CHINATOWN STREET (v22.0 CP8)
     Chapter 3's shophouse-street surfaces (World B, the medium's lorong), copied as they are: the tray shop stands
     in such a street, by day. A chapter is self-contained (e3c2's film copied ch4's flat by its own code). */
  /* v21.8 · THE STREET'S SURFACES (buildStreet). The signboards: every shop's
     name in Chinese over its English, two across and twelve down a 1024
     sheet (512 × 80 a board, a fascia's own proportion), then three years for
     the Art Deco parapets. World art, not the sheet's (v14.5's jetty sign). */
  const STREET_SIGNS = [
    ['新华茶室', 'SIN WAH KOPITIAM', '#a8160e', '#ffd860', '#ffe9b0'],              // 0 the kopitiam (lit)
    ['万兴百货 24小时', 'BAN HIN MINIMART · OPEN 24 HOURS', '#f4f6f8', '#c41a10', '#1a3a8a'],   // 1 the minimart (lit)
    ['合兴五金', 'HUP HING HARDWARE', '#141414', '#e0b04a', '#e0b04a'],
    ['顺利药行', 'SOON LEE MEDICAL HALL', '#1e5a3a', '#f4f0e0', '#f4f0e0'],           // 3 (its blade sign too)
    ['金星理发室', 'KIM SENG BARBER', '#f2f2ee', '#1a3a8a', '#c41a10'],
    ['协和布行', 'HIAP HOE TEXTILES', '#141414', '#e0b04a', '#e0b04a'],
    ['福记鸡饭', 'HOCK KEE CHICKEN RICE', '#b8241a', '#ffe070', '#ffffff'],
    ['东方照相馆', 'TONG FONG PHOTO STUDIO', '#f4f2ea', '#b01c14', '#202020'],
    ['和平金庄', 'WO PENG GOLDSMITH', '#8a1410', '#f0c860', '#f0c860'],
    ['南洋印务', 'NAN YANG PRINTING PRESS', '#1e4a6a', '#f4f0e0', '#f4f0e0'],
    ['永安当', 'WING ON PAWNSHOP', '#141414', '#e0b04a', '#e0b04a'],                 // 10 (its blade sign too)
    ['大同电器', 'TAI TONG ELECTRICAL', '#f2f2ee', '#1a4a9a', '#1a4a9a'],
    ['仁爱诊所', 'JIN AI CLINIC · 24 HR', '#f6f8f6', '#1a7a4a', '#1a7a4a'],           // 12 the clinic (always lit)
    ['长春堂中医', 'CHEONG CHUN TONG · TCM', '#2a1a10', '#e0b04a', '#e0b04a'],
    ['美华眼镜', 'MEI HUA OPTICAL', '#f2f2ee', '#c41a10', '#202020'],
    ['振兴海味', 'CHIN HIN DRIED GOODS', '#b8241a', '#ffe070', '#ffffff'],
  ];
  function makeStreetSigns(THREE, cnv) {
    const [c, x] = sized(cnv, 1024, 1024);
    x.fillStyle = '#1a1a1a'; x.fillRect(0, 0, 1024, 1024);
    x.textAlign = 'center'; x.textBaseline = 'middle';
    STREET_SIGNS.forEach(([zh, en, bg, fg, fg2], i) => {
      const cx = (i % 2) * 512, cy = Math.floor(i / 2) * 80;
      x.fillStyle = bg; x.fillRect(cx + 2, cy + 2, 508, 76);
      x.strokeStyle = fg; x.lineWidth = 3; x.strokeRect(cx + 8, cy + 7, 496, 66);
      x.fillStyle = fg; x.font = 'bold 40px serif'; x.fillText(zh, cx + 256, cy + 33, 460);
      x.fillStyle = fg2; x.font = 'bold 14px sans-serif'; x.fillText(en, cx + 256, cy + 63, 460);
    });
    ['1931', '1938', '1949'].forEach((yr, k) => {                     // cells 16-18: the parapets' years, in relief
      const i = 16 + k, cx = (i % 2) * 512, cy = Math.floor(i / 2) * 80;
      x.fillStyle = '#e8e2d2'; x.fillRect(cx, cy, 512, 80);
      x.strokeStyle = '#b8b0a0'; x.lineWidth = 6; x.strokeRect(cx + 60, cy + 8, 392, 64);
      x.fillStyle = '#8a8274'; x.font = 'bold 50px serif'; x.fillText(yr, cx + 256, cy + 42);
    });
    return done(THREE, c, false);
  }
  /* door couplets on the five-foot way's pillars: red paper, black characters */
  function makeCouplet(THREE, cnv, words) {
    const [c, x] = sized(cnv, 96, 512);
    x.fillStyle = '#b8160e'; x.fillRect(0, 0, 96, 512);
    x.strokeStyle = '#e8b84a'; x.lineWidth = 4; x.strokeRect(6, 6, 84, 500);
    x.fillStyle = '#1a0c06'; x.font = 'bold 58px serif'; x.textAlign = 'center'; x.textBaseline = 'middle';
    [...words].forEach((ch, i) => x.fillText(ch, 48, 52 + i * 70));
    return done(THREE, c, false);
  }
  /* the French windows, eight across a 1024 × 320 sheet (each 128 × 320, the
     window's own proportion): 0 louvred shutters shut (grey: the vertex colour
     paints them green, brown, blue), 1 one leaf ajar on a lit room, 2 a lit
     room, 3 a room under a tube, 4 dark glass, 5 open on the dark, 6 curtains
     lit from behind, 7 glass behind an iron grille */
  function makeStreetWindows(THREE, cnv) {
    const [c, x] = sized(cnv, 1024, 320);
    const cell = (i, f) => { x.save(); x.translate(i * 128, 0); x.beginPath(); x.rect(0, 0, 128, 320); x.clip(); f(); x.restore(); };
    const leaf = (lx, base, slat) => {
      x.fillStyle = base; x.fillRect(lx, 4, 58, 312);
      x.fillStyle = slat; for (let y = 12; y < 310; y += 8) x.fillRect(lx + 6, y, 46, 3);
      x.strokeStyle = slat; x.lineWidth = 5; x.strokeRect(lx + 3, 7, 52, 306); x.fillRect(lx + 3, 152, 52, 7);
    };
    const room = (top, bottom) => { const g = x.createLinearGradient(0, 0, 0, 320); g.addColorStop(0, top); g.addColorStop(1, bottom); x.fillStyle = g; x.fillRect(0, 0, 128, 320); };
    const frame = () => { x.strokeStyle = '#2a2420'; x.lineWidth = 7; x.strokeRect(3, 3, 122, 314); x.fillStyle = '#2a2420'; x.fillRect(61, 0, 6, 320); };
    cell(0, () => { x.fillStyle = '#1c1c1c'; x.fillRect(0, 0, 128, 320); leaf(4, '#d8d8d8', '#5a5a5a'); leaf(66, '#d0d0d0', '#565656'); });
    cell(1, () => { room('#ffe2a0', '#c8884a'); x.fillStyle = 'rgba(70,34,12,0.4)'; x.fillRect(84, 70, 28, 120); leaf(4, '#6a4a2a', '#2a1a0e'); x.fillStyle = '#3a2618'; x.fillRect(104, 4, 22, 312); });
    cell(2, () => {
      room('#ffe6b0', '#cc8a48');
      x.fillStyle = 'rgba(255,250,224,0.95)'; x.beginPath(); x.ellipse(64, 44, 26, 11, 0, 0, Math.PI * 2); x.fill();   // a lampshade's glow
      x.fillStyle = 'rgba(96,44,20,0.55)'; x.fillRect(0, 0, 24, 320); x.fillRect(104, 0, 24, 320);                    // the curtains, drawn back
      x.fillStyle = 'rgba(60,30,14,0.5)'; x.fillRect(30, 206, 68, 7); x.fillRect(38, 172, 11, 34); x.fillRect(72, 162, 17, 44);   // a shelf, its things
      frame();
    });
    cell(3, () => {
      room('#eaf4ff', '#a6bacc');
      x.fillStyle = '#ffffff'; x.fillRect(18, 26, 92, 9);                                                              // the tube
      x.fillStyle = 'rgba(40,60,80,0.4)'; x.fillRect(32, 120, 28, 42); x.fillStyle = 'rgba(200,40,30,0.6)'; x.fillRect(34, 122, 24, 9);   // a calendar
      x.strokeStyle = 'rgba(30,40,50,0.5)'; x.lineWidth = 3; x.beginPath(); x.arc(86, 84, 20, 0, Math.PI * 2); x.stroke();   // a fan
      frame();
    });
    cell(4, () => {
      room('#283038', '#12161c');
      x.fillStyle = 'rgba(160,184,206,0.14)'; x.beginPath(); x.moveTo(8, 300); x.lineTo(60, 18); x.lineTo(82, 18); x.lineTo(30, 300); x.fill();
      frame(); x.fillRect(0, 104, 128, 5); x.fillRect(0, 212, 128, 5);
    });
    cell(5, () => { room('#0c0c0e', '#060607'); leaf(-34, '#b8b8b8', '#4a4a4a'); leaf(104, '#b0b0b0', '#484848'); });
    cell(6, () => { room('#ffb868', '#c26a2a'); x.fillStyle = 'rgba(120,40,10,0.32)'; for (let k = 0; k < 9; k++) x.fillRect(6 + k * 13, 0, 5, 320); frame(); });
    cell(7, () => {
      room('#20242a', '#0e1014');
      x.strokeStyle = '#4a4c50'; x.lineWidth = 4;
      for (let k = 1; k < 8; k++) { x.beginPath(); x.moveTo(k * 16, 0); x.lineTo(k * 16, 320); x.stroke(); }
      for (let k = 1; k < 10; k++) { x.beginPath(); x.moveTo(0, k * 32); x.lineTo(128, k * 32); x.stroke(); }
      frame();
    });
    return done(THREE, c, false);
  }
  /* a fanlight over a window: radial glazing bars in a half-round, drawn in
     the canvas's top half (a half-disc's UVs run v 0.5…1); grey, so a lit
     room's warm and the night's dark both come from what it is drawn with */
  function makeFanlight(THREE, cnv) {
    const [c, x] = cnv(256);
    x.fillStyle = '#000'; x.fillRect(0, 0, 256, 256);
    const g = x.createRadialGradient(128, 128, 10, 128, 128, 124); g.addColorStop(0, '#dcdcdc'); g.addColorStop(1, '#9a9a9a');
    x.fillStyle = g; x.beginPath(); x.arc(128, 128, 124, Math.PI, 0); x.fill();
    x.strokeStyle = '#2a2420'; x.lineWidth = 8;
    for (let k = 0; k <= 6; k++) { const a = Math.PI + k * Math.PI / 6; x.beginPath(); x.moveTo(128, 128); x.lineTo(128 + Math.cos(a) * 124, 128 + Math.sin(a) * 124); x.stroke(); }
    x.beginPath(); x.arc(128, 128, 122, Math.PI, 0); x.stroke(); x.beginPath(); x.arc(128, 128, 42, Math.PI, 0); x.stroke();
    return done(THREE, c, false);
  }
  /* the Peranakan balustrade before a first-floor French window: green-glazed
     vase balusters between white rails */
  function makeBalustrade(THREE, cnv) {
    const [c, x] = sized(cnv, 256, 128);
    x.fillStyle = '#1c1c1c'; x.fillRect(0, 0, 256, 128);
    x.fillStyle = '#efeae0'; x.fillRect(0, 0, 256, 16); x.fillRect(0, 112, 256, 16);
    for (let k = 0; k < 8; k++) {
      const cx = 16 + k * 32, g = x.createLinearGradient(cx - 11, 0, cx + 11, 0);
      g.addColorStop(0, '#1a5038'); g.addColorStop(0.5, '#56aa82'); g.addColorStop(1, '#1a5038');
      x.fillStyle = g; x.beginPath(); x.moveTo(cx - 6, 16); x.quadraticCurveTo(cx - 15, 62, cx - 5, 100); x.lineTo(cx - 9, 112); x.lineTo(cx + 9, 112); x.lineTo(cx + 5, 100); x.quadraticCurveTo(cx + 15, 62, cx + 6, 16); x.fill();
    }
    return done(THREE, c, false);
  }
  /* an air-conditioner's face: its fan behind a round grille */
  function makeAcFront(THREE, cnv) {
    const [c, x] = cnv(128);
    x.fillStyle = '#dcdad2'; x.fillRect(0, 0, 128, 128);
    x.fillStyle = '#44464a'; x.beginPath(); x.arc(64, 64, 52, 0, Math.PI * 2); x.fill();
    x.strokeStyle = '#9a9a96'; x.lineWidth = 3;
    for (let k = 0; k < 6; k++) { x.beginPath(); x.arc(64, 64, 10 + k * 8, 0, Math.PI * 2); x.stroke(); }
    x.beginPath(); x.moveTo(12, 64); x.lineTo(116, 64); x.moveTo(64, 12); x.lineTo(64, 116); x.stroke();
    return done(THREE, c, false);
  }
  /* the blade signs out over the five-foot way: the pawnshop's 当 on its red
     disc, the medical hall's name down a green board */
  function makeBladeSigns(THREE, cnv) {
    const [c, x] = sized(cnv, 256, 512);
    x.textAlign = 'center'; x.textBaseline = 'middle';
    x.fillStyle = '#e8b84a'; x.fillRect(0, 0, 128, 512); x.strokeStyle = '#8a1410'; x.lineWidth = 6; x.strokeRect(5, 5, 118, 502);
    x.fillStyle = '#b8160e'; x.beginPath(); x.arc(64, 92, 50, 0, Math.PI * 2); x.fill();
    x.fillStyle = '#ffe9a0'; x.font = 'bold 64px serif'; x.fillText('当', 64, 94);
    x.fillStyle = '#8a1410'; x.font = 'bold 52px serif'; ['永', '安'].forEach((ch, i) => x.fillText(ch, 64, 214 + i * 72));
    x.font = 'bold 20px sans-serif'; x.fillText('PAWN', 64, 392);
    x.fillStyle = '#1e6a44'; x.fillRect(128, 0, 128, 512); x.strokeStyle = '#f0e8c8'; x.lineWidth = 6; x.strokeRect(133, 5, 118, 502);
    x.fillStyle = '#f4f0e0'; x.font = 'bold 56px serif'; ['顺', '利', '药', '行'].forEach((ch, i) => x.fillText(ch, 192, 72 + i * 100));
    return done(THREE, c, false);
  }
  /* pan tiles: half-round channels running down the slope (the canvas's v,
     which a roof's top face takes from z), their courses staggered, moss */
  function makePanTiles(THREE, cnv) {
    const S = 256, [c, x] = cnv(S), r = rng(2113);
    x.fillStyle = '#6e3424'; x.fillRect(0, 0, S, S);
    for (let i = 0; i < 8; i++) {
      const cx = i * 32, g = x.createLinearGradient(cx, 0, cx + 32, 0);
      g.addColorStop(0, '#4e2416'); g.addColorStop(0.5, '#a65a3a'); g.addColorStop(1, '#4e2416');
      x.fillStyle = g; x.fillRect(cx + 2, 0, 28, S);
      for (let j = 0; j < 8; j++) { x.fillStyle = `rgba(28,12,6,${0.35 + r() * 0.2})`; x.fillRect(cx + 2, j * 32 + (i % 2) * 16, 28, 3); }
    }
    for (let k = 0; k < 120; k++) { x.fillStyle = `rgba(24,34,22,${r() * 0.2})`; x.fillRect(r() * S, r() * S, 2 + r() * 8, 2 + r() * 8); }
    return done(THREE, c, true);
  }
  /* the planting strip's grass, cut short */
  function makeVerge(THREE, cnv) {
    const S = 256, [c, x] = cnv(S), r = rng(2117);
    x.fillStyle = '#34522a'; x.fillRect(0, 0, S, S);
    for (let i = 0; i < 3000; i++) { const v = r(); x.fillStyle = `rgba(${(40 + v * 60) | 0},${(70 + v * 70) | 0},${(30 + v * 30) | 0},0.7)`; x.fillRect(r() * S, r() * S, 1, 2 + r() * 4); }
    return done(THREE, c, true);
  }
  /* the kopitiam's back wall, under its tubes: the drinks stall's red menu
     board, its tins, its counter, a clock and a calendar */
  function makeKopiBack(THREE, cnv) {
    const [c, x] = sized(cnv, 512, 256);
    const g = x.createLinearGradient(0, 0, 0, 256); g.addColorStop(0, '#f6e8c8'); g.addColorStop(1, '#d6c29e'); x.fillStyle = g; x.fillRect(0, 0, 512, 256);
    x.fillStyle = '#a8160e'; x.fillRect(70, 14, 372, 72);
    x.fillStyle = '#ffe9b0'; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.font = 'bold 28px serif'; x.fillText('咖啡  茶  美禄  冰水', 256, 40);
    x.font = 'bold 15px sans-serif'; x.fillText('KOPI 1.40   TEH 1.50   MILO 1.80   ICE 0.30', 256, 70);
    for (let k = 0; k < 14; k++) { x.fillStyle = ['#c8a020', '#d8d8d0', '#2a6a3a', '#b82a1a'][k % 4]; x.fillRect(56 + k * 30, 112, 18, 28); }
    x.fillStyle = '#5a3a20'; x.fillRect(48, 140, 416, 6);
    x.fillStyle = '#e8e4dc'; x.fillRect(40, 148, 432, 8); x.fillStyle = '#6a3a1e'; x.fillRect(40, 156, 432, 100);
    x.fillStyle = '#f8f8f4'; x.beginPath(); x.arc(472, 50, 22, 0, Math.PI * 2); x.fill(); x.strokeStyle = '#222'; x.lineWidth = 3; x.stroke();
    x.beginPath(); x.moveTo(472, 50); x.lineTo(472, 34); x.moveTo(472, 50); x.lineTo(484, 55); x.stroke();
    x.fillStyle = '#e8e8e0'; x.fillRect(14, 20, 42, 58); x.fillStyle = '#c41a10'; x.fillRect(14, 20, 42, 15);
    return done(THREE, c, false);
  }
  /* the minimart's back wall: shelves of everything, its banner over them */
  function makeMartBack(THREE, cnv) {
    const [c, x] = sized(cnv, 512, 256), r = rng(2123);
    x.fillStyle = '#eef2f4'; x.fillRect(0, 0, 512, 256);
    for (let s = 0; s < 4; s++) {
      const y = 40 + s * 52;
      for (let k = 0; k < 60; k++) { const h = 10 + r() * 26; x.fillStyle = `hsl(${(r() * 360) | 0},60%,${(45 + r() * 25) | 0}%)`; x.fillRect(k * 8.5, y + 40 - h, 4 + r() * 8, h); }
      x.fillStyle = '#9aa2a8'; x.fillRect(0, y + 40, 512, 5);
    }
    x.fillStyle = '#1a3a8a'; x.fillRect(0, 0, 512, 30);
    x.fillStyle = '#ffffff'; x.font = 'bold 17px sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('DRINKS · SNACKS · TOILETRIES · 日用品', 256, 16);
    return done(THREE, c, false);
  }
  /* a red paper lantern's skin: the character for blessing on it */
  /* (1024 × 512 since v21.1: ending B's close-up of the door's lantern showed a soft, blurred character at 256) */
  function makeLanternSkin(THREE, cnv) {
    const [c, x] = sized(cnv, 1024, 512);
    const g = x.createLinearGradient(0, 0, 0, 512); g.addColorStop(0, '#a8140c'); g.addColorStop(0.5, '#e8301c'); g.addColorStop(1, '#a8140c');
    x.fillStyle = g; x.fillRect(0, 0, 1024, 512);
    x.strokeStyle = 'rgba(80,0,0,0.35)'; x.lineWidth = 6; for (let i = 0; i < 1024; i += 64) { x.beginPath(); x.moveTo(i, 0); x.lineTo(i, 512); x.stroke(); }
    x.fillStyle = '#ffd86a'; x.font = 'bold 240px serif'; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.shadowColor = 'rgba(90,10,0,0.55)'; x.shadowBlur = 6;
    x.fillText('福', 256, 264); x.fillText('福', 768, 264);
    return done(THREE, c, true);
  }
  /* the shophouse's ceiling: the upper floor's planks, stained dark, the
     joints between them darker still */
  function makeCeilBoards(THREE, cnv) {
    const S = 256, [c, x] = cnv(S), r = rng(89);
    for (let i = 0; i < 8; i++) {
      const v = 0.85 + r() * 0.25;
      x.fillStyle = `rgb(${(92 * v) | 0},${(68 * v) | 0},${(50 * v) | 0})`; x.fillRect(0, i * 32, S, 32);
      for (let k = 0; k < 30; k++) { x.fillStyle = `rgba(40,26,16,${r() * 0.25})`; x.fillRect(r() * S, i * 32 + r() * 30, 20 + r() * 60, 1); }
      x.fillStyle = '#21160e'; x.fillRect(0, i * 32, S, 2);
    }
    return done(THREE, c, true);
  }
  /* ---------------------------------------------------------------- v21.15 · BEACH ROAD'S SURFACES AND SIGNS (CP6)
     All drawn in canvas (CSP-safe, no download), like every other surface in the film's pocket. */
  /* the morning's asphalt: a mid grey with its aggregate, the darker patches of old repairs, tar-sealed cracks and a
     few oil drips — the night street's asphalt (makeAsphalt) is near black, and under a morning sun it read as a
     hole in the picture */
  function makeDayAsphalt(THREE, cnv) {
    const S = 512, [c, x] = cnv(S), R = rng(97);
    x.fillStyle = '#5f6064'; x.fillRect(0, 0, S, S);
    for (let i = 0; i < 9000; i++) { const v = 72 + R() * 72; x.fillStyle = `rgba(${v},${v},${v + 3},${0.22 + R() * 0.32})`; x.fillRect(R() * S, R() * S, 1 + R() * 2, 1 + R() * 2); }
    x.globalAlpha = 0.16;
    for (let i = 0; i < 14; i++) { x.fillStyle = R() < 0.55 ? '#45464b' : '#717276'; x.beginPath(); x.ellipse(R() * S, R() * S, 24 + R() * 80, 12 + R() * 44, R() * 3, 0, Math.PI * 2); x.fill(); }
    x.globalAlpha = 1;
    x.strokeStyle = 'rgba(32,32,36,0.4)'; x.lineWidth = 2;
    for (let i = 0; i < 5; i++) { x.beginPath(); let px = R() * S, py = R() * S; x.moveTo(px, py); for (let k = 0; k < 6; k++) { px += (R() - 0.5) * 60; py += (R() - 0.5) * 60; x.lineTo(px, py); } x.stroke(); }
    x.globalAlpha = 0.12;
    for (let i = 0; i < 7; i++) { x.fillStyle = '#26262a'; x.beginPath(); x.ellipse(R() * S, R() * S, 8 + R() * 16, 5 + R() * 10, R() * 3, 0, Math.PI * 2); x.fill(); }
    x.globalAlpha = 1;
    return done(THREE, c, true);
  }
  /* the five-foot way's tiles: Peranakan encaustic, a rosette in each tile,
     quarter-circles meeting at the corners, worn by a century of feet */
  function makePeranakanTiles(THREE, cnv) {
    const S = 256, [c, x] = cnv(S), r = rng(83), T = 128;
    for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) {
      const ox = i * T, oy = j * T, cx = ox + T / 2, cy = oy + T / 2;
      x.fillStyle = '#efe6d2'; x.fillRect(ox, oy, T, T);
      x.fillStyle = '#2f6a7a';
      for (const [qx, qy] of [[ox, oy], [ox + T, oy], [ox, oy + T], [ox + T, oy + T]]) { x.beginPath(); x.arc(qx, qy, 30, 0, Math.PI * 2); x.fill(); }
      x.fillStyle = '#efe6d2'; for (const [qx, qy] of [[ox, oy], [ox + T, oy], [ox, oy + T], [ox + T, oy + T]]) { x.beginPath(); x.arc(qx, qy, 18, 0, Math.PI * 2); x.fill(); }
      x.fillStyle = '#b8342a';
      for (let p = 0; p < 8; p++) { const a = p * Math.PI / 4; x.beginPath(); x.ellipse(cx + Math.cos(a) * 24, cy + Math.sin(a) * 24, 16, 7, a, 0, Math.PI * 2); x.fill(); }
      x.fillStyle = '#3e8a52'; for (let p = 0; p < 4; p++) { const a = p * Math.PI / 2 + Math.PI / 4; x.beginPath(); x.ellipse(cx + Math.cos(a) * 44, cy + Math.sin(a) * 44, 11, 5, a, 0, Math.PI * 2); x.fill(); }
      x.fillStyle = '#e8b84a'; x.beginPath(); x.arc(cx, cy, 10, 0, Math.PI * 2); x.fill();
      x.strokeStyle = '#2f6a7a'; x.lineWidth = 3; x.strokeRect(ox + 4, oy + 4, T - 8, T - 8);
    }
    x.fillStyle = '#6a6458'; for (let p = 0; p <= S; p += T) { x.fillRect(0, p - 1, S, 2); x.fillRect(p - 1, 0, 2, S); }
    for (let i = 0; i < 500; i++) { x.fillStyle = `rgba(${r() < 0.5 ? '90,80,70' : '255,250,240'},${r() * 0.12})`; x.fillRect(r() * S, r() * S, 2 + r() * 4, 1 + r() * 3); }
    return done(THREE, c, true);
  }

  /* ---------------------------------------------------------------- WORLD T · THE TRAY SHOP'S OWN SURFACES (v22.0 CP8)
     Drawn here like every other sheet (canvas, CSP-safe, no download); the words are world art (v14.5). */
  /* a block of flats by day: cream walls, a band of colour every storey, the windows dark glass, the corridor's railing */
  function makeHdbDay(THREE, cnv) {
    const S = 512, [c, x] = cnv(S), r = rng(4119);
    x.fillStyle = '#e4ddcc'; x.fillRect(0, 0, S, S);
    for (let f = 0; f < 16; f++) {
      const y = f * 32;
      x.fillStyle = f % 4 === 0 ? '#c86a4a' : '#d2c8b4'; x.fillRect(0, y + 25, S, 7);
      for (let k = 0; k < 16; k++) {
        const v = r();
        x.fillStyle = v < 0.12 ? '#e8e4dc' : v < 0.2 ? '#7a8a96' : '#46525c';
        x.fillRect(k * 32 + 6, y + 7, 20, 14);
        if (v > 0.86) { x.fillStyle = ['#c8302a', '#2a5aa8', '#e8c040', '#f0ece0'][(r() * 4) | 0]; x.fillRect(k * 32 + 8, y + 18, 16, 6); }   // laundry on its pole
      }
    }
    return done(THREE, c, true);
  }
  /* old teak: warm brown, a long grain, the odd darker streak */
  function makeTeak(THREE, cnv, seed) {
    const S = 256, [c, x] = cnv(S), r = rng(seed || 4123);
    x.fillStyle = '#6a3e22'; x.fillRect(0, 0, S, S);
    for (let i = 0; i < 160; i++) {
      const y = r() * S, v = r();
      x.strokeStyle = v < 0.5 ? `rgba(40,20,8,${0.15 + r() * 0.25})` : `rgba(150,96,56,${0.1 + r() * 0.2})`;
      x.lineWidth = 1 + r() * 2; x.beginPath(); x.moveTo(0, y);
      for (let k = 1; k <= 8; k++) x.lineTo(k * 32, y + Math.sin(k * 0.9 + i) * 3 + (r() - 0.5) * 2);
      x.stroke();
    }
    return done(THREE, c, true);
  }
  /* a hanging scroll: cream paper on a brocade mount, characters brushed down it */
  function makeScroll(THREE, cnv, words, seed) {
    const [c, x] = sized(cnv, 160, 640), r = rng(seed);
    x.fillStyle = '#5a2a18'; x.fillRect(0, 0, 160, 640);
    for (let i = 0; i < 400; i++) { x.fillStyle = `rgba(${r() < 0.5 ? '120,60,30' : '40,16,8'},0.4)`; x.fillRect(r() * 160, r() * 640, 3, 3); }
    x.fillStyle = '#efe4c8'; x.fillRect(18, 60, 124, 520);
    for (let i = 0; i < 220; i++) { x.fillStyle = `rgba(150,120,70,${r() * 0.12})`; x.fillRect(18 + r() * 124, 60 + r() * 520, 4, 4); }
    x.fillStyle = '#1a1410'; x.font = 'bold 84px serif'; x.textAlign = 'center'; x.textBaseline = 'middle';
    const ch = [...words]; ch.forEach((w, i) => x.fillText(w, 80, 60 + 520 * (i + 0.5) / ch.length));
    x.fillStyle = '#b8160e'; x.fillRect(96, 540, 22, 22);                                   // the artist's seal
    return done(THREE, c, false);
  }
  /* the transom over the shop's opening: a carved timber fretwork panel, gilt on lacquer */
  function makeFretwork(THREE, cnv) {
    const [c, x] = sized(cnv, 1024, 128);
    x.fillStyle = '#2a120a'; x.fillRect(0, 0, 1024, 128);
    x.strokeStyle = '#c8963e'; x.lineWidth = 6;
    for (let i = 0; i < 16; i++) {
      const cx = 32 + i * 64;
      x.beginPath(); x.arc(cx, 64, 24, 0, Math.PI * 2); x.stroke();
      x.beginPath(); x.moveTo(cx - 32, 64); x.lineTo(cx - 24, 64); x.moveTo(cx + 24, 64); x.lineTo(cx + 32, 64); x.stroke();
      x.beginPath(); for (let p = 0; p < 4; p++) { const a = p * Math.PI / 2 + Math.PI / 4; x.moveTo(cx, 64); x.lineTo(cx + Math.cos(a) * 18, 64 + Math.sin(a) * 18); } x.stroke();
    }
    x.lineWidth = 8; x.strokeRect(4, 4, 1016, 120);
    return done(THREE, c, false);
  }
  /* the shop's own signboard: black lacquer, a gilt border, gilt characters — the antiques and amulets of Guan Huat */
  function makeTraySign(THREE, cnv) {
    const [c, x] = sized(cnv, 1024, 160);
    const g = x.createLinearGradient(0, 0, 0, 160); g.addColorStop(0, '#1c0e08'); g.addColorStop(1, '#0a0503');
    x.fillStyle = g; x.fillRect(0, 0, 1024, 160);
    x.strokeStyle = '#d4a23e'; x.lineWidth = 8; x.strokeRect(8, 8, 1008, 144); x.lineWidth = 2; x.strokeRect(20, 20, 984, 120);
    const gold = x.createLinearGradient(0, 24, 0, 124); gold.addColorStop(0, '#ffe6a0'); gold.addColorStop(0.5, '#d4a23e'); gold.addColorStop(1, '#a8761e');
    x.fillStyle = gold; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.font = 'bold 84px serif'; x.fillText('源 發 古 玩', 512, 66);
    x.font = 'bold 22px serif'; x.fillText('GUAN HUAT  ·  ANTIQUES & AMULETS  ·  EST. 1958', 512, 128);
    return done(THREE, c, false);
  }
  /* the back of the altar: red cloth, a gilt lotus border, the character for the Buddha in gold */
  function makeAltarBackT(THREE, cnv) {
    const [c, x] = sized(cnv, 512, 512), r = rng(4127);
    x.fillStyle = '#8a1410'; x.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 900; i++) { x.fillStyle = `rgba(${r() < 0.5 ? '50,0,0' : '200,40,30'},${r() * 0.18})`; x.fillRect(r() * 512, r() * 512, 2, 2); }
    x.strokeStyle = '#e8b84a'; x.lineWidth = 10; x.strokeRect(14, 14, 484, 484); x.lineWidth = 3; x.strokeRect(32, 32, 448, 448);
    for (let i = 0; i < 12; i++) for (const [px, py] of [[44 + i * 38, 24], [44 + i * 38, 488]]) {
      x.fillStyle = '#e8b84a'; x.beginPath(); x.ellipse(px, py, 9, 5, 0, 0, Math.PI * 2); x.fill();
    }
    x.fillStyle = '#e8b84a'; x.beginPath(); x.arc(256, 230, 120, 0, Math.PI * 2); x.fill();
    x.fillStyle = '#8a1410'; x.beginPath(); x.arc(256, 230, 108, 0, Math.PI * 2); x.fill();
    x.fillStyle = '#ffd86a'; x.font = 'bold 150px serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('佛', 256, 236);
    return done(THREE, c, false);
  }
  /* blue-and-white porcelain: a cobalt band of scrolling clouds round a white body */
  function makePorcelain(THREE, cnv, seed) {
    const S = 256, [c, x] = cnv(S), r = rng(seed);
    x.fillStyle = '#f2f0ea'; x.fillRect(0, 0, S, S);
    x.strokeStyle = '#1e3c8a'; x.fillStyle = '#1e3c8a';
    x.lineWidth = 6; for (const y of [26, 34, 222, 230]) { x.beginPath(); x.moveTo(0, y); x.lineTo(S, y); x.stroke(); }
    x.lineWidth = 3;
    for (let i = 0; i < 9; i++) {
      const cx = r() * S, cy = 70 + r() * 120, rr = 10 + r() * 18;
      x.beginPath(); x.arc(cx, cy, rr, 0, Math.PI * 1.6); x.stroke();
      x.beginPath(); x.arc(cx + rr * 0.9, cy - 4, rr * 0.6, Math.PI, Math.PI * 2.4); x.stroke();
    }
    for (let i = 0; i < 4; i++) { const cx = 30 + i * 64; x.beginPath(); x.ellipse(cx, 130, 12, 20, 0, 0, Math.PI * 2); x.fill(); }
    return done(THREE, c, true);
  }
  /* painted shade: dark at the back of the shop, nothing at its front (the room is lit from the street) */
  function makeShadeT(THREE, cnv) {
    const [c, x] = sized(cnv, 16, 256);
    const g = x.createLinearGradient(0, 0, 0, 256);
    g.addColorStop(0, 'rgba(26,14,6,0.0)'); g.addColorStop(0.35, 'rgba(26,14,6,0.18)'); g.addColorStop(1, 'rgba(18,9,4,0.62)');
    x.fillStyle = g; x.fillRect(0, 0, 16, 256);
    return done(THREE, c, false);
  }
  /* the afternoon sun on the floor inside the door: a warm patch, soft at every edge */
  function makeSunPatchT(THREE, cnv) {
    const S = 256, [c, x] = cnv(S);
    const g = x.createLinearGradient(0, 0, 0, S); g.addColorStop(0, 'rgba(255,214,150,0.95)'); g.addColorStop(0.7, 'rgba(255,200,130,0.45)'); g.addColorStop(1, 'rgba(255,190,120,0)');
    x.fillStyle = g; x.fillRect(0, 0, S, S);
    const s = x.createLinearGradient(0, 0, S, 0); s.addColorStop(0, 'rgba(0,0,0,1)'); s.addColorStop(0.18, 'rgba(0,0,0,0)'); s.addColorStop(0.82, 'rgba(0,0,0,0)'); s.addColorStop(1, 'rgba(0,0,0,1)');
    x.globalCompositeOperation = 'destination-out'; x.fillStyle = s; x.fillRect(0, 0, S, S); x.globalCompositeOperation = 'source-over';
    return done(THREE, c, false);
  }
  /* faded red cloth for the old bundle: the weave, the fading, a knot of string */
  function makeOldCloth(THREE, cnv) {
    const S = 256, [c, x] = cnv(S), r = rng(4129);
    x.fillStyle = '#8a2a20'; x.fillRect(0, 0, S, S);
    for (let y = 0; y < S; y += 3) { x.fillStyle = `rgba(${r() < 0.5 ? '60,10,6' : '170,70,56'},0.22)`; x.fillRect(0, y, S, 1); }
    for (let i = 0; i < 26; i++) { x.fillStyle = `rgba(200,160,120,${r() * 0.2})`; x.beginPath(); x.ellipse(r() * S, r() * S, 10 + r() * 40, 6 + r() * 20, r() * 3, 0, Math.PI * 2); x.fill(); }
    x.strokeStyle = 'rgba(220,200,150,0.7)'; x.lineWidth = 3;
    x.beginPath(); x.moveTo(0, 128); x.lineTo(S, 128); x.moveTo(128, 0); x.lineTo(128, S); x.stroke();
    return done(THREE, c, true);
  }
  /* a takrut's lead sheet: dull grey, Khom script scratched along it */
  function makeTakrutT(THREE, cnv) {
    const [c, x] = sized(cnv, 256, 64), r = rng(4133);
    x.fillStyle = '#5a5a58'; x.fillRect(0, 0, 256, 64);
    for (let i = 0; i < 300; i++) { x.fillStyle = `rgba(${r() < 0.5 ? '30,30,30' : '150,148,140'},${r() * 0.3})`; x.fillRect(r() * 256, r() * 64, 2, 2); }
    x.strokeStyle = 'rgba(190,186,176,0.75)'; x.lineWidth = 1.6;
    for (let k = 0; k < 14; k++) {
      const cx = 10 + k * 17.5; x.beginPath();
      x.moveTo(cx, 20); x.quadraticCurveTo(cx + 8, 12 + r() * 6, cx + 12, 22); x.lineTo(cx + 12, 40 + r() * 6); x.quadraticCurveTo(cx + 4, 48, cx, 42);
      x.stroke();
    }
    return done(THREE, c, true);
  }
  /* the old wall clock's face: yellowed enamel, roman numerals, a maker's name */
  function makeOldClockFace(THREE, cnv) {
    const S = 256, [c, x] = cnv(S);
    const g = x.createRadialGradient(128, 128, 20, 128, 128, 124); g.addColorStop(0, '#f2e8cc'); g.addColorStop(1, '#d8c89c');
    x.fillStyle = g; x.beginPath(); x.arc(128, 128, 124, 0, Math.PI * 2); x.fill();
    x.strokeStyle = '#2a2018'; x.lineWidth = 4; x.stroke();
    const R = ['XII', 'I', 'II', 'III', 'IIII', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'];
    x.fillStyle = '#1a1410'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.font = 'bold 22px serif';
    R.forEach((t, h) => { const a = h / 12 * Math.PI * 2; x.fillText(t, 128 + Math.sin(a) * 94, 128 - Math.cos(a) * 94); });
    for (let m = 0; m < 60; m++) { const a = m / 60 * Math.PI * 2; x.lineWidth = m % 5 ? 1.5 : 3; const L = m % 5 ? 5 : 9;
      x.beginPath(); x.moveTo(128 + Math.sin(a) * 116, 128 - Math.cos(a) * 116); x.lineTo(128 + Math.sin(a) * (116 - L), 128 - Math.cos(a) * (116 - L)); x.stroke(); }
    x.font = 'italic 13px serif'; x.fillText('EIGHT DAY', 128, 168);           // (no maker's name: a real one is a brand on a prop)
    return done(THREE, c, false);
  }
  /* old cement tiles, the shophouse floor: cream ground, a faded red quatrefoil, green corners, worn at the middle of
     the shop where people have walked for sixty years (one sheet covers 4 × 4 tiles; the floor repeats it) */
  function makeCementTilesT(THREE, cnv) {
    const S = 512, [c, x] = cnv(S), r = rng(4161), T = S / 4;
    for (let j = 0; j < 4; j++) for (let i = 0; i < 4; i++) {
      const x0 = i * T, y0 = j * T, cx = x0 + T / 2, cy = y0 + T / 2;
      x.fillStyle = '#e4d6b8'; x.fillRect(x0, y0, T, T);
      x.fillStyle = '#4e7a64';                                             // the corners: quarter circles that meet as a disc
      for (const [qx, qy, a0] of [[x0, y0, 0], [x0 + T, y0, Math.PI / 2], [x0 + T, y0 + T, Math.PI], [x0, y0 + T, Math.PI * 1.5]]) {
        x.beginPath(); x.moveTo(qx, qy); x.arc(qx, qy, T * 0.2, a0, a0 + Math.PI / 2); x.closePath(); x.fill();
      }
      x.fillStyle = '#a8432e';                                             // the quatrefoil
      for (let k = 0; k < 4; k++) { const a = k * Math.PI / 2; x.beginPath(); x.ellipse(cx + Math.cos(a) * T * 0.16, cy + Math.sin(a) * T * 0.16, T * 0.14, T * 0.09, a, 0, Math.PI * 2); x.fill(); }
      x.fillStyle = '#e4d6b8'; x.beginPath(); x.arc(cx, cy, T * 0.07, 0, Math.PI * 2); x.fill();
      x.strokeStyle = 'rgba(80,60,40,0.55)'; x.lineWidth = 2; x.strokeRect(x0 + 1, y0 + 1, T - 2, T - 2);   // the grout
    }
    for (let i = 0; i < 2600; i++) { x.fillStyle = `rgba(${r() < 0.5 ? '90,70,50' : '255,250,235'},${r() * 0.07})`; x.fillRect(r() * S, r() * S, 2 + r() * 3, 2 + r() * 3); }
    const g = x.createRadialGradient(S / 2, S / 2, S * 0.1, S / 2, S / 2, S * 0.75);           // the wear
    g.addColorStop(0, 'rgba(250,244,228,0.16)'); g.addColorStop(1, 'rgba(250,244,228,0)'); x.fillStyle = g; x.fillRect(0, 0, S, S);
    return done(THREE, c, true);
  }
  /* the shophouse's lime plaster: warm cream, the brush in it, a little old dirt low down (v-repeat once per wall) */
  function makeShopPlasterT(THREE, cnv) {
    const S = 512, [c, x] = cnv(S), r = rng(4163);
    x.fillStyle = '#efe4cc'; x.fillRect(0, 0, S, S);
    for (let i = 0; i < 1400; i++) {
      x.fillStyle = `rgba(${r() < 0.5 ? '170,150,118' : '255,252,240'},${0.03 + r() * 0.05})`;
      x.beginPath(); x.ellipse(r() * S, r() * S, 6 + r() * 26, 2 + r() * 6, r() * Math.PI, 0, Math.PI * 2); x.fill();
    }
    const g = x.createLinearGradient(0, S * 0.7, 0, S); g.addColorStop(0, 'rgba(110,86,60,0)'); g.addColorStop(1, 'rgba(110,86,60,0.18)');
    x.fillStyle = g; x.fillRect(0, 0, S, S);
    return done(THREE, c, true);
  }
  /* a calendar from the provision shop next door (world art: a shop's own calendar) */
  function makeCalendarT(THREE, cnv) {
    const [c, x] = sized(cnv, 256, 384);
    x.fillStyle = '#f4ecd8'; x.fillRect(0, 0, 256, 384);
    x.fillStyle = '#b8160e'; x.fillRect(0, 0, 256, 92);
    x.fillStyle = '#ffd86a'; x.font = 'bold 40px serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('恭 喜 發 財', 128, 46);
    x.fillStyle = '#1a1410'; x.font = 'bold 26px serif'; x.fillText('十 月  OCTOBER', 128, 120);
    x.font = '18px serif';
    for (let d = 0; d < 31; d++) { const col = d % 7, row = Math.floor(d / 7); x.fillStyle = col === 0 ? '#b8160e' : '#1a1410'; x.fillText(String(d + 1), 30 + col * 33, 168 + row * 40); }
    x.fillStyle = '#6a5a4a'; x.font = '13px serif'; x.fillText('SIN HUAT PROVISION · SINCE 1958', 128, 368);   // (no telephone number: a made-up one can be someone's)
    return done(THREE, c, false);
  }
  /* the bundle's knot of red string and the faded paper tag tied to it (the owner's own hand: "?") */
  function makeTagT(THREE, cnv) {
    const [c, x] = sized(cnv, 128, 64), r = rng(4167);
    x.fillStyle = '#e8dcbc'; x.fillRect(0, 0, 128, 64);
    x.fillStyle = 'rgba(120,96,60,0.25)'; for (let i = 0; i < 60; i++) x.fillRect(r() * 128, r() * 64, 3, 3);
    x.fillStyle = '#2a1e14'; x.font = 'bold 34px serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('？', 64, 34);
    return done(THREE, c, false);
  }
  /* the naga's water light (CP8): the bright edges of a cell pattern — the distance to a cell's border (F2 − F1), wrapped
     so it tiles — white on black, laid additively in teal over every surface of the shop, two layers drifting two ways */
  function makeCausticT(THREE, cnv) {
    const S = 256, [c, x] = cnv(S), r = rng(4191), N = 22, pts = [];
    for (let i = 0; i < N; i++) pts.push([r() * S, r() * S]);
    const img = x.createImageData(S, S), d = img.data;
    for (let py = 0; py < S; py++) for (let px = 0; px < S; px++) {
      let f1 = 1e9, f2 = 1e9;
      for (const [qx, qy] of pts) {
        let dx = Math.abs(px - qx), dy = Math.abs(py - qy);
        if (dx > S / 2) dx = S - dx;
        if (dy > S / 2) dy = S - dy;
        const dd = dx * dx + dy * dy;
        if (dd < f1) { f2 = f1; f1 = dd; } else if (dd < f2) f2 = dd;
      }
      const e = Math.sqrt(f2) - Math.sqrt(f1), v = Math.max(0, 1 - e / 9), b2 = Math.round(255 * v * v * v);
      const o = (py * S + px) * 4; d[o] = d[o + 1] = d[o + 2] = b2; d[o + 3] = 255;
    }
    x.putImageData(img, 0, 0);
    return done(THREE, c, true);
  }
  /* the naga crystal ball (v22.1), drawn as two MATCAPS: a disc whose every point is what the glass shows where its
     surface faces that way on the screen (its top is the ball's top, whatever the view). THE BODY is the room seen
     through it, upside down as a ball shows it — the dark velvet and the counter above, the shop's warm wood across the
     middle, the bright open front below — in a pale sea-green glass, the light it gathers into a bright crescent low
     inside, and the dark band of its edge, where the glass turns the light back on itself */
  function makeCrystalBodyT(THREE, cnv) {
    const S = 512, [c, x] = cnv(S), C = S / 2, R = S * 0.495;
    x.fillStyle = '#0e1c1a'; x.fillRect(0, 0, S, S);
    x.save(); x.beginPath(); x.arc(C, C, R, 0, Math.PI * 2); x.clip();
    const g = x.createLinearGradient(0, C - R, 0, C + R);
    g.addColorStop(0.00, '#40262a'); g.addColorStop(0.18, '#563430'); g.addColorStop(0.36, '#7a6448'); g.addColorStop(0.52, '#ad9e80');
    g.addColorStop(0.68, '#dcd4be'); g.addColorStop(0.84, '#f0ebdd'); g.addColorStop(1.00, '#f8f5ec');
    x.fillStyle = g; x.fillRect(0, 0, S, S);
    // the shop in it, soft: the counter's edge across it, the posts of the open front standing in the light (inverted)
    x.fillStyle = 'rgba(40,26,20,0.32)'; x.fillRect(0, C - 0.16 * R, S, 0.09 * R);
    for (const [px, w] of [[-0.52, 0.07], [-0.08, 0.05], [0.46, 0.08]]) {
      for (let i = 0; i < 6; i++) { x.fillStyle = 'rgba(70,56,40,0.07)'; x.fillRect(C + (px - w * (1 + i * 0.35)) * R, C + 0.05 * R, 2 * w * (1 + i * 0.35) * R, 0.9 * R); }
    }
    x.globalCompositeOperation = 'multiply'; x.fillStyle = '#a6ead8'; x.fillRect(0, 0, S, S);
    x.globalCompositeOperation = 'source-over';
    // the light it gathers, a crescent low inside it
    x.save(); x.translate(C, C + 0.6 * R); x.scale(1, 0.34);
    const f = x.createRadialGradient(0, 0, 0, 0, 0, 0.64 * R);
    f.addColorStop(0, 'rgba(255,255,250,0.92)'); f.addColorStop(0.45, 'rgba(225,255,244,0.42)'); f.addColorStop(1, 'rgba(200,255,236,0)');
    x.fillStyle = f; x.beginPath(); x.arc(0, 0, 0.64 * R, 0, Math.PI * 2); x.fill(); x.restore();
    // its heart a little clearer, luminous
    const h = x.createRadialGradient(C, C - 0.06 * R, 0, C, C - 0.06 * R, 0.56 * R);
    h.addColorStop(0, 'rgba(196,255,238,0.2)'); h.addColorStop(1, 'rgba(196,255,238,0)');
    x.fillStyle = h; x.fillRect(0, 0, S, S);
    // the dark band of its edge
    const e = x.createRadialGradient(C, C, 0.7 * R, C, C, R);
    e.addColorStop(0, 'rgba(3,14,12,0)'); e.addColorStop(0.55, 'rgba(3,14,12,0.5)'); e.addColorStop(0.88, 'rgba(2,10,9,0.82)'); e.addColorStop(1, 'rgba(6,20,18,0.72)');
    x.fillStyle = e; x.fillRect(0, 0, S, S);
    x.restore();
    return done(THREE, c, false);
  }
  /* ...and THE SKIN, laid on additively (black adds nothing): the thin bright line of its rim (glass reflects most where
     it turns away), brighter above than below, the shop's open front reflected small and hot on its left shoulder with
     the posts across it, a sparkle beside it, and a dim warm gleam low on the right, the lamp behind the counter */
  function makeCrystalSkinT(THREE, cnv) {
    const S = 512, [c, x] = cnv(S), C = S / 2, R = S * 0.495;
    x.fillStyle = '#000'; x.fillRect(0, 0, S, S);
    const e = x.createRadialGradient(C, C, 0.78 * R, C, C, R);
    e.addColorStop(0, 'rgba(0,0,0,1)'); e.addColorStop(0.5, 'rgba(46,84,76,1)'); e.addColorStop(0.82, 'rgba(160,214,200,1)'); e.addColorStop(1, 'rgba(236,255,250,1)');
    x.fillStyle = e; x.beginPath(); x.arc(C, C, R, 0, Math.PI * 2); x.fill();
    x.globalCompositeOperation = 'multiply';
    const v = x.createLinearGradient(0, C - R, 0, C + R); v.addColorStop(0, '#ffffff'); v.addColorStop(0.55, '#b4b4b4'); v.addColorStop(1, '#565656');
    x.fillStyle = v; x.fillRect(0, 0, S, S);
    x.globalCompositeOperation = 'lighter';
    // the open front, reflected: a soft glow, then a rounded pane built up in layers, the posts across it
    const wx = C - 0.38 * R, wy = C - 0.42 * R;
    const gl = x.createRadialGradient(wx, wy, 0, wx, wy, 0.34 * R);
    gl.addColorStop(0, 'rgba(255,255,250,0.42)'); gl.addColorStop(1, 'rgba(255,255,250,0)');
    x.fillStyle = gl; x.fillRect(0, 0, S, S);
    x.save(); x.translate(wx, wy); x.rotate(-0.52);
    const pane = (w, h, r) => { x.beginPath(); x.moveTo(-w + r, -h); x.lineTo(w - r, -h); x.quadraticCurveTo(w, -h, w, -h + r); x.lineTo(w, h - r);
      x.quadraticCurveTo(w, h, w - r, h); x.lineTo(-w + r, h); x.quadraticCurveTo(-w, h, -w, h - r); x.lineTo(-w, -h + r); x.quadraticCurveTo(-w, -h, -w + r, -h); x.fill(); };
    for (let i = 5; i >= 0; i--) { x.fillStyle = `rgba(255,255,252,${i === 0 ? 0.72 : 0.09})`; pane(0.135 * R + i * 2.2, 0.085 * R + i * 2.2, 0.036 * R + i); }
    x.globalCompositeOperation = 'source-over'; x.fillStyle = 'rgba(0,0,0,0.4)';
    for (const px of [-0.045, 0.045]) x.fillRect(px * R - 1, -0.09 * R, 2, 0.18 * R);
    x.fillRect(-0.145 * R, -0.01 * R, 0.29 * R, 2);
    x.restore();
    x.globalCompositeOperation = 'lighter';
    const sp = x.createRadialGradient(C - 0.17 * R, C - 0.6 * R, 0, C - 0.17 * R, C - 0.6 * R, 0.07 * R);
    sp.addColorStop(0, 'rgba(255,255,255,1)'); sp.addColorStop(0.25, 'rgba(255,255,255,0.6)'); sp.addColorStop(1, 'rgba(255,255,255,0)');
    x.fillStyle = sp; x.fillRect(0, 0, S, S);
    x.save(); x.translate(C + 0.5 * R, C + 0.5 * R); x.rotate(-0.78); x.scale(1, 0.3);
    const lo = x.createRadialGradient(0, 0, 0, 0, 0, 0.2 * R);
    lo.addColorStop(0, 'rgba(255,214,160,0.42)'); lo.addColorStop(1, 'rgba(255,214,160,0)');
    x.fillStyle = lo; x.beginPath(); x.arc(0, 0, 0.2 * R, 0, Math.PI * 2); x.fill(); x.restore();
    x.globalCompositeOperation = 'source-over';
    return done(THREE, c, false);
  }

  /* ============================================================ THE ENDINGS
     CP9 builds them (docs/V22.0-E3C4-PLAN.md §4.6). */
  /* ---------------------------------------------------------------- THE ENDINGS' SURFACES (CP9)
     Drawn on canvases (CSP-safe, nothing downloaded). */
  /* an upper eyelid: black down to a curve that dips at the middle, its edge soft — the shape drawn again thirteen times
     a little lower and faint, so the edge is a gradient with no canvas filter (Safari has none) */
  function makeLidT(THREE, cnv) {
    const W = 512, H = 256, [c, x] = sized(cnv, W, H);
    x.clearRect(0, 0, W, H);
    for (let i = 0; i < 14; i++) {
      x.fillStyle = i === 0 ? '#000' : 'rgba(0,0,0,0.11)';
      const d = i * 2.2;
      x.beginPath(); x.moveTo(0, 0); x.lineTo(W, 0); x.lineTo(W, H * 0.5 + d * 0.6);
      x.quadraticCurveTo(W / 2, H * 0.92 + d, 0, H * 0.5 + d * 0.6); x.closePath(); x.fill();
    }
    return done(THREE, c, false);
  }
  /* rings going out from the middle, broken and uneven, for the dark that ripples red */
  function makeRippleT(THREE, cnv) {
    const S = 512, [c, x] = cnv(S), r = rng(5141);
    x.fillStyle = '#000'; x.fillRect(0, 0, S, S);
    x.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 9; i++) {
      const rad = 30 + i * 26 + r() * 10, w = 4 + r() * 7, a = 0.55 - i * 0.045;
      for (let s = 0; s < 40; s++) {
        const a0 = (s / 40) * Math.PI * 2 + r() * 0.1, a1 = a0 + Math.PI * 2 / 40 * (0.4 + r() * 0.7);
        x.strokeStyle = `rgba(255,255,255,${(a * (0.4 + r() * 0.6)).toFixed(3)})`; x.lineWidth = w * (0.6 + r() * 0.8);
        x.beginPath(); x.arc(S / 2, S / 2, rad + (r() - 0.5) * 6, a0, a1); x.stroke();
      }
    }
    const g = x.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
    g.addColorStop(0, 'rgba(255,255,255,0.35)'); g.addColorStop(0.25, 'rgba(255,255,255,0.05)'); g.addColorStop(1, 'rgba(0,0,0,0)');
    x.fillStyle = g; x.fillRect(0, 0, S, S);
    x.globalCompositeOperation = 'source-over';
    const m = x.createRadialGradient(S / 2, S / 2, S * 0.3, S / 2, S / 2, S / 2);
    m.addColorStop(0, 'rgba(0,0,0,0)'); m.addColorStop(1, 'rgba(0,0,0,1)');
    x.fillStyle = m; x.fillRect(0, 0, S, S);
    return done(THREE, c, false);
  }
  /* brown kraft paper with the shop's name printed on it in red, creased */
  function makeBagT(THREE, cnv) {
    const [c, x] = sized(cnv, 256, 320), r = rng(5143);
    x.fillStyle = '#b08a5c'; x.fillRect(0, 0, 256, 320);
    for (let i = 0; i < 2200; i++) { x.fillStyle = `rgba(${r() < 0.5 ? '90,62,30' : '210,180,130'},${(0.05 + r() * 0.08).toFixed(3)})`; x.fillRect(r() * 256, r() * 320, 1 + r() * 2, 1 + r() * 4); }
    for (let i = 0; i < 9; i++) { x.strokeStyle = `rgba(80,56,28,${(0.12 + r() * 0.15).toFixed(3)})`; x.lineWidth = 1 + r() * 1.5;
      x.beginPath(); const y = r() * 320; x.moveTo(0, y); x.lineTo(256, y + (r() - 0.5) * 60); x.stroke(); }
    x.fillStyle = '#9a1c16'; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.font = 'bold 44px serif'; x.fillText('源 發', 128, 150); x.fillText('古 玩', 128, 200);
    x.font = 'bold 14px serif'; x.fillText('GUAN HUAT', 128, 240);
    return done(THREE, c, false);
  }
  /* an HDB bedroom's painted wall: pale blue-grey, a faint roller texture */
  function makeRoomWallT(THREE, cnv) {
    const S = 256, [c, x] = cnv(S), r = rng(5147);
    x.fillStyle = '#e4e8ec'; x.fillRect(0, 0, S, S);
    for (let i = 0; i < 2600; i++) { x.fillStyle = `rgba(${r() < 0.5 ? '120,130,140' : '255,255,255'},${(0.025 + r() * 0.04).toFixed(3)})`; x.fillRect(r() * S, r() * S, 2, 2); }
    return done(THREE, c, true);
  }
  /* the blocks across from his window at night: a deep sky, three slabs of flats with their corridors lit and a few
     windows yellow, the void deck glow at their feet */
  function makeNightBlocksT(THREE, cnv) {
    const [c, x] = sized(cnv, 1024, 640), r = rng(5149);
    const g = x.createLinearGradient(0, 0, 0, 640); g.addColorStop(0, '#05070f'); g.addColorStop(0.6, '#0e1426'); g.addColorStop(1, '#1a2034');
    x.fillStyle = g; x.fillRect(0, 0, 1024, 640);
    for (let i = 0; i < 40; i++) { x.fillStyle = `rgba(200,210,255,${(0.2 + r() * 0.4).toFixed(2)})`; x.fillRect(r() * 1024, r() * 180, 1.5, 1.5); }
    for (const [x0, w, top] of [[40, 300, 120], [400, 260, 170], [700, 300, 90]]) {
      x.fillStyle = '#10141c'; x.fillRect(x0, top, w, 640 - top);
      const floors = Math.floor((600 - top) / 26);
      for (let f = 0; f < floors; f++) {
        const y = top + 12 + f * 26;
        x.fillStyle = 'rgba(190,200,170,0.32)'; x.fillRect(x0 + 6, y + 15, w - 12, 3);                 // the corridor's strip lights
        for (let u = 0; u < Math.floor((w - 20) / 22); u++) {
          const lit = r() < 0.22, xx = x0 + 10 + u * 22;
          x.fillStyle = lit ? (r() < 0.5 ? 'rgba(255,214,140,0.85)' : 'rgba(210,230,255,0.7)') : 'rgba(30,36,50,0.9)';
          x.fillRect(xx, y, 14, 11);
        }
      }
      x.fillStyle = 'rgba(255,220,160,0.25)'; x.fillRect(x0, 600, w, 40);                            // the void deck
    }
    return done(THREE, c, false);
  }
  /* the laptop's screen: the search he keeps making */
  function makeSearchT(THREE, cnv) {
    const [c, x] = sized(cnv, 512, 322);
    x.fillStyle = '#f6f7f9'; x.fillRect(0, 0, 512, 322);
    x.fillStyle = '#e4e6ea'; x.fillRect(0, 0, 512, 26);
    for (const [cx, col] of [[14, '#ff5f57'], [30, '#febc2e'], [46, '#28c840']]) { x.fillStyle = col; x.beginPath(); x.arc(cx, 13, 5, 0, Math.PI * 2); x.fill(); }
    x.fillStyle = '#fff'; x.fillRect(66, 6, 380, 15); x.strokeStyle = '#c8ccd4'; x.strokeRect(66, 6, 380, 15);
    x.fillStyle = '#fff'; x.fillRect(40, 44, 432, 30); x.strokeStyle = '#a8b0c0'; x.lineWidth = 1.5; x.strokeRect(40, 44, 432, 30);
    x.fillStyle = '#202124'; x.font = '15px sans-serif'; x.textBaseline = 'middle'; x.fillText('amulet feels like something answering — normal?', 52, 59);
    const res = [['Why some amulets "react" to you — forum', 'I held it and felt something come in. Is this the power?'],
                 ['Are you sensitive? 7 signs you can feel spirits', 'If you feel cold, heaviness or presence when you hold...'],
                 ['Testing amulets at home — please don\'t (reply)', 'Uncle say don\'t simply try. Ask a proper teacher first.']];
    res.forEach(([h, s], i) => { const y = 100 + i * 70;
      x.fillStyle = '#1a0dab'; x.font = '15px sans-serif'; x.fillText(h, 40, y);
      x.fillStyle = '#4d5156'; x.font = '12px sans-serif'; x.fillText(s, 40, y + 22); });
    return done(THREE, c, false);
  }
  /* a small wind-up alarm clock's face */
  function makeAlarmFaceT(THREE, cnv) {
    const S = 128, [c, x] = cnv(S);
    x.fillStyle = '#f2ece0'; x.beginPath(); x.arc(64, 64, 62, 0, Math.PI * 2); x.fill();
    x.fillStyle = '#222'; x.font = 'bold 14px sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle';
    for (let h = 1; h <= 12; h++) { const a = h / 12 * Math.PI * 2; x.fillText(String(h), 64 + Math.sin(a) * 48, 64 - Math.cos(a) * 48); }
    x.strokeStyle = '#222'; x.lineCap = 'round';
    const hand = (a, l, w) => { x.lineWidth = w; x.beginPath(); x.moveTo(64, 64); x.lineTo(64 + Math.sin(a) * l, 64 - Math.cos(a) * l); x.stroke(); };
    hand((11 + 47 / 60) / 12 * Math.PI * 2, 28, 4); hand(47 / 60 * Math.PI * 2, 40, 3);
    return done(THREE, c, false);
  }
  /* the medium's talisman (chapter 3): yellow paper, red brush strokes, a seal — a talisman's look, no real script */
  function makeFuT(THREE, cnv) {
    const [c, x] = sized(cnv, 160, 440), r = rng(5153);
    x.fillStyle = '#e8c23a'; x.fillRect(0, 0, 160, 440);
    for (let i = 0; i < 900; i++) { x.fillStyle = `rgba(160,120,20,${(0.05 + r() * 0.08).toFixed(3)})`; x.fillRect(r() * 160, r() * 440, 2, 2); }
    x.strokeStyle = '#b8160e'; x.lineCap = 'round'; x.lineJoin = 'round';
    x.lineWidth = 3; x.strokeRect(10, 10, 140, 420);
    let y = 40;
    for (let k = 0; k < 9; k++) {
      x.lineWidth = 5 + r() * 4; x.beginPath();
      const cx = 80 + (r() - 0.5) * 20; x.moveTo(cx - 30 + r() * 10, y);
      for (let s = 0; s < 4; s++) x.lineTo(cx + (r() - 0.5) * 70, y + 8 + r() * 26);
      x.stroke(); y += 40;
    }
    x.fillStyle = '#b8160e'; x.fillRect(50, 380, 60, 34); x.fillStyle = '#e8c23a'; x.font = 'bold 22px serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('令', 80, 397);
    return done(THREE, c, false);
  }
  /* ---- CP10 · the opening film's screens: what he was reading, the night after the medium. A results page (a tall
     page, its window scrolled by the texture's offset — 289 of its 1100 rows on the screen at once), an article, the
     forum thread the fifth result opens, the cursor, and the city through the office's windows. The words are world
     art (a page is what it says on it); the sites are no one's — a search box, a forum, an article with no masthead. */
  function oText(x, s, X, Y, W, lh) {                          // words wrapped into a width; answers the y after them
    const ws = s.split(' '); let line = '', y = Y;
    for (const w of ws) {
      const t = line ? line + ' ' + w : w;
      if (x.measureText(t).width > W && line) { x.fillText(line, X, y); line = w; y += lh; } else line = t;
    }
    if (line) { x.fillText(line, X, y); y += lh; }
    return y;
  }
  function oChrome(x, W, url) {                                 // the browser's own strip: a tab, the address, the dots
    x.fillStyle = '#dfe3e8'; x.fillRect(0, 0, W, 44);
    x.fillStyle = '#ffffff'; x.fillRect(10, 6, 150, 18); x.fillStyle = '#5f6670'; x.font = '11px sans-serif'; x.textAlign = 'left';
    x.textBaseline = 'middle'; x.fillText(url.split('/')[0], 18, 15);
    x.fillStyle = '#f6f7f9'; x.fillRect(10, 27, W - 20, 14); x.fillStyle = '#4a515a'; x.font = '10px sans-serif'; x.fillText(url, 18, 34);
    for (const [cx, col] of [[W - 40, '#c8ccd2'], [W - 26, '#c8ccd2'], [W - 12, '#e25555']]) { x.fillStyle = col; x.beginPath(); x.arc(cx, 15, 4, 0, Math.PI * 2); x.fill(); }
    x.textBaseline = 'alphabetic';
  }
  const O_RESULTS = [
    ['Why do my hands move by themselves when I chant?', 'meditation-help forum › practice', 'Many people feel the body sway or the hands lift in deep concentration. Teachers say: do not chase it, and do not be afraid of it.'],
    ['Spirit possession: signs, myths, and what to do', 'an article · culture & belief', 'In many traditions, a sudden change in voice or movement is read as a spirit. Doctors, monks and mediums explain it differently.'],
    ['Involuntary movement during chanting — is it normal?', 'dhamma Q&A › ask a teacher', 'A monk answers: some feel energy, some feel nothing. What matters is what you do with it. Ask a teacher you trust.'],
    ['Thai amulets and their powers: a beginner\'s guide', 'amulet collectors\' notes', 'Luang Phor, Somdej, Phra Pidta... what collectors look for, and why a temple\'s blessing matters to them.'],
    ['What is a Yin amulet? (please read before you buy)', 'amulet talk forum › questions', 'Phra Ngan, Kumanthong, Nang Tani... amulets said to be bound to a spirit. Read the first post before you go looking.'],
    ['Phra Ngan, Kumanthong, Nang Tani: Yin amulets explained', 'amulet collectors\' notes', 'Believers say a Yin amulet must be cared for and respected. Collectors disagree about almost everything else.'],
    ['Should you test an amulet\'s power? A monk answers', 'dhamma Q&A › ask a teacher', '"Why do you want to test it?" he asks. "Ask yourself that first."'],
    ['Old amulet shops at Golden Mile — where to go', 'a city food & shopping blog', 'Thai grocers, Thai food, and the shops upstairs that sell amulets, if you know where to look.'],
    ['Chinatown antique shops that still sell old amulets', 'a city heritage blog', 'Some of the old shophouses keep trays of pieces behind the counter. Ask, and they may bring one out.'],
    ['Can an amulet be haunted?', 'amulet talk forum › stories', '"I bought one second-hand and I could not sleep for a week." 214 replies.']
  ];
  function makeSearchListT(THREE, cnv) {
    const W = 512, H = 1100, [c, x] = sized(cnv, W, H);
    x.fillStyle = '#ffffff'; x.fillRect(0, 0, W, H);
    oChrome(x, W, 'search/?q=hands+moving+on+their+own+during+chanting');
    // the box, with what he typed in it
    x.strokeStyle = '#c4c9d0'; x.lineWidth = 1.5; x.fillStyle = '#ffffff';
    x.beginPath(); x.roundRect ? x.roundRect(22, 58, W - 44, 30, 15) : x.rect(22, 58, W - 44, 30); x.fill(); x.stroke();
    x.fillStyle = '#202124'; x.font = '14px sans-serif'; x.textAlign = 'left'; x.fillText('hands moving on their own during chanting', 42, 78);
    x.strokeStyle = '#4285f4'; x.lineWidth = 2; x.beginPath(); x.arc(W - 46, 73, 6, 0, Math.PI * 2); x.stroke();
    x.beginPath(); x.moveTo(W - 42, 77); x.lineTo(W - 36, 83); x.stroke();
    x.fillStyle = '#70757a'; x.font = '11px sans-serif'; x.fillText('About 1,240,000 results (0.41 seconds)', 24, 112);
    x.fillStyle = '#e8eaed'; x.fillRect(22, 120, W - 44, 1);
    O_RESULTS.forEach(([title, where, snip], i) => {
      const y = 140 + i * 91;
      x.fillStyle = '#3c4043'; x.font = '11px sans-serif'; x.fillText(where, 24, y);
      x.fillStyle = i === 4 ? '#5e2bb8' : '#1a0dab'; x.font = '17px sans-serif'; x.fillText(title, 24, y + 22);
      x.fillStyle = '#4d5156'; x.font = '12px sans-serif'; oText(x, snip, 24, y + 42, W - 60, 16);
    });
    return done(THREE, c, false);
  }
  function makeArticleT(THREE, cnv) {
    const W = 512, H = 289, [c, x] = sized(cnv, W, H), r = rng(6011);
    x.fillStyle = '#fbfaf7'; x.fillRect(0, 0, W, H);
    oChrome(x, W, 'culture-and-belief/spirit-possession-signs');
    x.fillStyle = '#1d1d1f'; x.font = 'bold 21px serif'; x.textAlign = 'left';
    oText(x, 'Spirit possession: signs, myths, and what to do', 24, 76, W - 48, 25);
    x.fillStyle = '#7a7268'; x.font = '11px sans-serif'; x.fillText('Culture & belief  ·  12 min read', 24, 120);
    // a picture: a temple's hall at dusk, painted soft
    const g = x.createLinearGradient(0, 132, 0, 210); g.addColorStop(0, '#3a2a40'); g.addColorStop(1, '#a8603c');
    x.fillStyle = g; x.fillRect(24, 132, 170, 120);
    x.fillStyle = '#20141c'; x.beginPath(); x.moveTo(40, 252); x.lineTo(70, 190); x.lineTo(109, 160); x.lineTo(148, 190); x.lineTo(178, 252); x.fill();
    x.fillStyle = '#e2b24a'; for (let i = 0; i < 5; i++) x.fillRect(66 + i * 18, 214, 6, 20);
    x.fillStyle = '#2b2a28'; x.font = '12px serif';
    let y = oText(x, 'Across Southeast Asia, a body that moves by itself, a voice that is not quite your own, a sudden heat or cold, is often read as a spirit. Mediums read it one way.', 206, 142, W - 230, 15);
    oText(x, 'Doctors read it another. Monks often answer with a question: what were you doing when it began?', 206, y + 4, W - 230, 15);
    x.fillStyle = 'rgba(40,40,40,0.18)'; for (let i = 0; i < 2; i++) x.fillRect(24, 262 + i * 10, (W - 48) * (0.7 + 0.3 * r()), 4);
    return done(THREE, c, false);
  }
  function makeForumT(THREE, cnv) {
    const W = 512, H = 289, [c, x] = sized(cnv, W, H);
    x.fillStyle = '#eef0f3'; x.fillRect(0, 0, W, H);
    oChrome(x, W, 'amulet-talk/questions/what-is-a-yin-amulet');
    x.fillStyle = '#26303b'; x.fillRect(0, 44, W, 22);
    x.fillStyle = '#d9dfe6'; x.font = '11px sans-serif'; x.textAlign = 'left'; x.fillText('AMULET TALK   ›   Questions', 14, 59);
    x.fillStyle = '#ffffff'; x.fillRect(10, 72, W - 20, H - 80);
    x.fillStyle = '#1b2733'; x.font = 'bold 16px sans-serif'; x.fillText('What is a Yin amulet? (please read before you buy)', 22, 94);
    x.fillStyle = '#8a94a0'; x.font = '10px sans-serif'; x.fillText('pinned  ·  posted by an old member  ·  1,893 replies', 22, 108);
    x.fillStyle = '#c9a24a'; x.beginPath(); x.arc(32, 130, 10, 0, Math.PI * 2); x.fill();
    x.fillStyle = '#2b2f36'; x.font = '12px sans-serif';
    let y = oText(x, 'Yin amulets (Phra Ngan, Kumanthong, Nang Tani and others) are said to be bound to a spirit. People who keep them believe the spirit must be cared for and respected, every day.', 50, 128, W - 80, 15);
    y = oText(x, 'Please do not buy one to "test" it, or to prove anything to yourself.', 50, y + 4, W - 80, 15);
    x.font = 'bold 12px sans-serif';
    y = oText(x, 'If something is happening to you, ask a proper teacher first.', 50, y + 4, W - 80, 15);
    x.fillStyle = '#e3e7ec'; x.fillRect(22, y + 6, W - 44, 1);
    x.fillStyle = '#56606b'; x.font = '11px sans-serif';
    oText(x, 'Reply: There is an old mall in town with a shop on the top floor. The auntie there knows a lot. Go in the afternoon.', 50, y + 24, W - 80, 14);
    return done(THREE, c, false);
  }
  function makeCursorT(THREE, cnv) {
    const [c, x] = sized(cnv, 64, 88);
    x.clearRect(0, 0, 64, 88);
    x.beginPath(); x.moveTo(6, 4); x.lineTo(6, 70); x.lineTo(22, 55); x.lineTo(33, 80); x.lineTo(43, 75); x.lineTo(32, 51); x.lineTo(54, 51); x.closePath();
    x.fillStyle = '#ffffff'; x.fill(); x.lineWidth = 4; x.strokeStyle = '#111111'; x.stroke();
    return done(THREE, c, false);
  }
  /* the city at night through the office's windows (e3c1's makeCity, its numbers) */
  function makeOfficeCity(THREE, cnv) {
    const S = 1024, [c, x] = cnv(S), r = rng(17);
    const g = x.createLinearGradient(0, 0, 0, S); g.addColorStop(0, '#060912'); g.addColorStop(0.7, '#1a2140'); g.addColorStop(1, '#2c2a3a');
    x.fillStyle = g; x.fillRect(0, 0, S, S);
    for (const [n, h0, h1, col, lit] of [[26, 0.25, 0.55, '#11172a', 0.25], [16, 0.45, 0.85, '#0a0e1a', 0.4]]) {
      for (let i = 0; i < n; i++) {
        const w = 30 + r() * 70, xx = r() * S, h = (h0 + r() * (h1 - h0)) * S;
        x.fillStyle = col; x.fillRect(xx, S - h, w, h);
        for (let wy = S - h + 8; wy < S - 6; wy += 10) for (let wx = xx + 4; wx < xx + w - 4; wx += 8)
          if (r() < lit) { x.fillStyle = r() < 0.8 ? 'rgba(255,214,140,0.9)' : 'rgba(170,210,255,0.9)'; x.fillRect(wx, wy, 4, 5); }
        if (h > S * 0.6) { x.fillStyle = '#ff3b30'; x.fillRect(xx + w / 2 - 2, S - h - 6, 5, 5); }
      }
    }
    return done(THREE, c, false);
  }
  /* the shop's name card, its printed face */
  function makeCardFrontT(THREE, cnv) {
    const [c, x] = sized(cnv, 512, 304);
    x.fillStyle = '#f4efe2'; x.fillRect(0, 0, 512, 304);
    x.strokeStyle = '#9a1c16'; x.lineWidth = 4; x.strokeRect(12, 12, 488, 280);
    x.fillStyle = '#9a1c16'; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.font = 'bold 62px serif'; x.fillText('源 發 古 玩', 256, 92);
    x.fillStyle = '#2a1e14'; x.font = 'bold 24px serif'; x.fillText('GUAN HUAT  ANTIQUES & AMULETS', 256, 158);
    x.font = '18px serif'; x.fillText('Est. 1958  ·  Chinatown, Singapore', 256, 200);
    x.font = '16px serif'; x.fillText('Open daily 10 am – 7 pm', 256, 240);
    return done(THREE, c, false);
  }
  /* a dark shop window at dusk with the street behind him in it: the far row's lit fronts, their pillars, the last of the
     sky, a lamp or two — mirrored, dim */
  function makeReflT(THREE, cnv) {
    const [c, x] = sized(cnv, 512, 448), r = rng(5159);
    const g = x.createLinearGradient(0, 0, 0, 448); g.addColorStop(0, '#2a2c48'); g.addColorStop(0.28, '#6a5a6a'); g.addColorStop(0.42, '#242438'); g.addColorStop(1, '#0c0c12');
    x.fillStyle = g; x.fillRect(0, 0, 512, 448);
    x.fillStyle = '#121218'; x.fillRect(0, 150, 512, 150);
    for (let i = 0; i < 7; i++) { const xx = i * 78 + r() * 20;
      x.fillStyle = `rgba(255,${(180 + r() * 50) | 0},${(110 + r() * 60) | 0},${(0.25 + r() * 0.35).toFixed(2)})`; x.fillRect(xx, 196 + r() * 20, 46 + r() * 20, 62 + r() * 20);
      x.fillStyle = 'rgba(30,30,40,0.9)'; x.fillRect(xx - 12, 150, 9, 150); }
    for (let i = 0; i < 3; i++) { const lx = 80 + i * 170 + r() * 30, rg = x.createRadialGradient(lx, 120, 0, lx, 120, 40);
      rg.addColorStop(0, 'rgba(255,220,160,0.75)'); rg.addColorStop(1, 'rgba(255,200,120,0)'); x.fillStyle = rg; x.fillRect(lx - 40, 80, 80, 80); }
    x.fillStyle = 'rgba(8,8,12,0.85)'; x.fillRect(0, 300, 512, 148);
    for (let i = 0; i < 70; i++) { x.fillStyle = `rgba(255,255,255,${(0.02 + r() * 0.05).toFixed(3)})`; x.fillRect(r() * 512, r() * 448, 1 + r() * 30, 1); }   // smears on the glass
    return done(THREE, c, false);
  }
  /* ============================================================ THE ENDINGS (CP9, docs/V22.0-E3C4-PLAN.md §4.6)
     Each scene holds its cues, its fades and the one track that draws it: every picture is stage.endT's frame for the
     scene's clock (endFrame — the merit film's shape), so a skip lands on the frame the clock says. The lines run as
     voiced at CP2 (the plan's "As voiced" order), each started after the one before has finished — the gaps are held
     by a sound with a reason (v21.30: no stretch in silence). The owner is kind in all four (no practitioner is ever
     the villain): he wraps it, he gives water, he takes it back, he writes the card. The card lies over the black the
     scene ends on (keep.view, endFade). */
  function endScene(c, api, k, cues) {
    const { tr, step, rawK, stage } = api;
    const E = stage.endT, T = E.T[k];
    step(0, () => E.begin(k, api));
    tr(0, T, (kk, t) => E.frame(k, t, api), rawK);
    // the hands back for whatever plays next (restart() gives the arm back, never the hands' root — a Retry or the
    // next run was played with none); under the card keep.view keeps the walking hand off
    step(T, () => { api.handsRoot.visible = true; });
    cues(E, T);
    c.endFade = 1;
    c.keep.view = true;
  }
  function scOpen(c, s, api) {
    const { step, sfx, sfxFade, fade } = api;
    endScene(c, api, 'A', (E, T) => {
      const A = E.EA;
      sfx(0.5, 'x4pick', 0.5);
      sfx(0.9, 'z4A1', 1);                                // "I wanted to know. So I opened myself... all the way."  → 7.09
      sfx(2.4, 'x4pressure', 0.4);
      sfx(7.3, 'y4heart', 0.55); sfx(8.0, 'y4heart', 0.6);
      sfx(8.2, 'x4rush', 0.85);                           // the three, rushing in out of the dark
      sfx(10.4, 'x4whispers', 0.8);                       // the thing that is not one of them
      sfx(11.3, 'z4A1b', 1);                              // "No... this isn't one of them... this isn't—"  → 14.85
      for (const at of [13.0, 13.55, 14.0, 14.35, 14.65, 14.9]) sfx(at, 'y4heart', 0.62);
      sfx(15.0, 'x4wrong', 0.9);                          // its scream, rising, cut
      fade(A.cut, A.cut + 0.02, 0, 1);
      sfxFade(A.cut, A.cut + 0.15, 'x4whispers');
      sfx(17.25, 'x4fall', 0.85);                         // the stool, his body, the cup
      sfx(19.9, 'x4wake', 0.9);                           // coming round: muffled, then clearing, a ring in the ears
      fade(A.open0, A.open0 + 0.4, 1, 0);
      sfx(20.8, 'to4A1', 1); step(20.8, () => E.talk(SECS.to4A1));     // "Boy! Boy! Wake up! Can you hear me or not?"  → 23.6
      sfx(24.0, 'z4A2b', 1);                              // "What... what happened?"  → 25.96
      sfx(26.3, 'to4A3', 1); step(26.3, () => E.talk(SECS.to4A3));     // "You fell down. Shaking... Twenty minutes, you know!"  → 32.67
      sfx(32.9, 'z4A2', 1);                               // "Twenty minutes. I couldn't remember any of it."  → 37.03
      sfx(37.3, 'to4A2', 1); step(37.3, () => E.talk(SECS.to4A2));     // "...Here, drink some water. Rest first."  → 42.37
      sfx(37.6, 'x4glass', 0.6);                          // poured, and set down by him (40.6)
      fade(A.out, A.out + 0.8, 0, 1);
      sfx(42.9, 'x4passers', 0.32);                       // the five-foot way at dusk, coming up out of the black
      fade(A.dusk, A.dusk + 1.1, 1, 0);
      sfx(44.8, 'z4A3', 1);                               // "I invited it in, to prove it was there. It came..."  → 55.07
      sfx(47.0, 'x4close', 0.5);
      sfx(51.1, 'y4breath', 0.4);                         // the shape in the glass: his breath catching
      sfx(52.0, 'x4turn', 0.45);                          // he whips round
      sfx(52.5, 'x4flicker', 0.35);                       // the tube over him stuttering; nobody there
      sfx(55.6, 'z4A4', 1);                               // "For weeks after, I didn't feel alone. Not once."  → 61.24
      fade(61.6, 64.4, 0, 1);
      sfxFade(61.6, 64.5, 'x4close');
      step(T, () => {});
    });
  }
  function scHome(c, s, api) {
    const { step, sfx, sfxFade, fade } = api;
    endScene(c, api, 'B', (E, T) => {
      const B = E.EB;
      sfx(0.5, 'z4B1', 1);                                // "How much, Uncle? I'll try it at home."  → 3.01
      sfx(3.6, 'to4B1', 1); step(3.6, () => E.talk(SECS.to4B1));       // "Okay... but treat it with respect, ah..."  → 9.03
      sfx(4.3, 'x4unwrap', 0.4);                          // the cloth folded back over it
      sfx(6.6, 'x4bag', 0.6);                             // into a paper bag, folded over
      sfx(9.8, 'x4bag', 0.4);                             // the bag taken off the glass
      fade(B.out, B.out + 0.8, 0, 1);
      fade(B.room, B.room + 1.2, 1, 0);
      sfx(12.4, 'x4unwrap', 0.55);                        // on his desk at night, the cloth opened
      sfx(14.0, 'z4B1b', 1);                              // "Okay... let's see what you are."  → 16.43
      for (const at of [17.0, 18.0, 19.0, 20.0]) sfx(at, 'x4tick', 0.32);   // nothing; the clock on the desk
      sfx(20.5, 'x4flicker', 0.55);                       // the lamp
      sfx(21.0, 'y4shiver', 0.5);                         // the cold
      sfx(21.6, 'y4hum', 0.22);                           // a woman humming the old song, very faint
      sfx(22.6, 'z4B2', 1);                               // "I had told her I wouldn't bring her home..."  → 29.99
      sfx(23.4, 'y4breath', 0.35);
      sfxFade(30.0, 30.6, 'y4hum');
      sfx(30.2, 'x4unwrap', 0.6);                         // wrapped fast
      sfx(31.0, 'x4drawer', 0.8);                         // shut in the drawer
      fade(B.dark, B.dark + 0.8, 0, 1);
      sfx(33.5, 'y4creak', 0.25);                         // the bed, as he lies down in the dark
      fade(B.bed, B.bed + 1.2, 1, 0);
      sfx(34.0, 'z4B3', 1);                               // "I didn't sleep that night. Every sound in the room was it... or me."  → 41.03
      sfx(36.2, 'y4creak', 0.3);
      sfx(38.0, 'x4drawer', 0.12);                        // a knock, very small, from the drawer
      fade(B.night1, B.night1 + 0.8, 0, 1);
      sfx(42.6, 'x4scooter', 0.35);                       // the street in the morning
      sfx(43.4, 'x4tick', 0.4);                           // and the shop's clock, going
      fade(B.morning, B.morning + 1.0, 1, 0);
      sfx(44.2, 'z4B5', 1);                               // "Uncle... I'm bringing it back."  → 47.67
      sfx(47.9, 'to4B2', 1); step(47.9, () => E.talk(SECS.to4B2));     // "Never mind. Better like that. Don't worry about the money."  → 51.87
      sfx(48.4, 'x4bag', 0.35); sfx(48.9, 'x4set', 0.35);
      sfx(49.0, 'x4close', 0.5);
      sfx(52.2, 'z4B4', 1);                               // "I brought it back the next morning. Some things are not for testing alone."  → 57.76
      fade(57.8, 60.4, 0, 1);
      sfxFade(57.8, 60.5, 'x4close');
      step(T, () => {});
    });
  }
  function scDown(c, s, api) {
    const { step, sfx, sfxFade, fade } = api;
    endScene(c, api, 'C', (E, T) => {
      sfx(0.2, 'x4pick', 0.45);                           // taken up off its cloth
      sfx(0.7, 'z4C1', 1);                                // "Thank you, Uncle... but I think that's enough for today."  → 4.41
      sfx(1.5, 'x4set', 0.4);                             // and put down
      sfx(4.7, 'to4C1', 1); step(4.7, () => E.talk(SECS.to4C1));       // "Yes, yes. Don't force..."  → 8.49
      sfx(5.3, 'x4unwrap', 0.4);                          // wrapped
      sfx(7.2, 'x4tick', 0.55);                           // the clock, going again
      sfx(9.6, 'to4C2', 1); step(9.6, () => E.talk(SECS.to4C2));       // "Come again anytime, ah. Tea is always here."  → 12.45
      sfx(13.0, 'x4turn', 0.32); sfx(14.0, 'x4shimmer', 0.25);         // the three going, one by one
      sfx(14.8, 'z4C2', 1);                               // "I put it down and walked away. That much, I got right."  → 19.71
      sfx(18.9, 'x4drawer', 0.28);                        // the owner puts it away under the counter
      sfx(19.5, 'x4tea', 0.32);                           // and pours himself tea
      sfx(21.0, 'x4scooter', 0.45);
      sfx(21.2, 'z4C3', 1);                               // "But I still didn't understand what I had been doing..."  → 28.28
      sfx(22.6, 'x4passers', 0.35);
      sfx(25.0, 'x4close', 0.5);
      sfx(28.6, 'z4C4', 1);                               // "And I knew... sooner or later, I would pick something up again."  → 36.49
      sfx(31.0, 'x4bicycle', 0.3);
      fade(37.0, 40.0, 0, 1);
      sfxFade(37.0, 40.1, 'x4close');
      step(T, () => {});
    });
  }
  function scTeacher(c, s, api) {
    const { step, sfx, sfxFade, fade } = api;
    endScene(c, api, 'D', (E, T) => {
      const D = E.ED;
      sfx(1.2, 'x4set', 0.3);                             // pushed back on the glass
      sfx(1.0, 'z4D1', 1);                                // "Uncle... I don't want to test them anymore..."  → 9.2
      sfx(10.0, 'to4D1', 1); step(10.0, () => E.talk(SECS.to4D1));     // "You know... you're right. I only collect them..."  → 16.9
      sfx(11.0, 'x4unwrap', 0.4);
      sfx(17.2, 'z4D2', 1);                               // "Do you know anyone who can teach me properly?..."  → 21.72
      sfx(22.0, 'to4D2', 1); step(22.0, () => E.talk(SECS.to4D2));     // "Go and see this temple. There's a monk there..."  → 29.05
      sfx(25.9, 'x4pen', 0.6);                            // written on the back of his card, and slid across
      sfx(29.6, 'z4D5', 1);                               // "Thank you, Uncle. Really."  → 31.48
      sfx(31.7, 'to4D3', 1); step(31.7, () => E.talk(SECS.to4D3));     // "Go. And this one... I'll keep it wrapped."  → 35.59
      sfx(33.6, 'x4shimmer', 0.28);                       // the three going
      sfx(34.0, 'x4tick', 0.55);                          // the clock, going again
      sfx(34.2, 'x4drawer', 0.3);                         // the piece put away
      fade(D.out, D.out + 0.9, 0, 1);
      sfx(36.4, 'x4passers', 0.3);                        // the evening street, coming up out of the black
      fade(D.street, D.street + 1.2, 1, 0);
      sfx(37.6, 'z4D3', 1);                               // "Discernment. Respect. Proper guidance..."  → 45.96
      sfx(41.8, 'x4flicker', 0.22);                       // the lamps coming on down the street
      sfx(43.0, 'x4close', 0.5);
      sfx(46.3, 'z4D4', 1);                               // "You don't need to invite something in... just to prove that something is there."  → 52.49
      fade(53.2, 56.0, 0, 1);
      sfxFade(53.2, 56.1, 'x4close');
      step(T, () => {});
    });
  }

  /* THE OPENING FILM (CP10, §4.0): "Seeking" — every picture from stage.filmO's frame(t) (the merit film's shape); this
     holds only its cues and its fades. It opens on black (the v4.6 law) and ends on it: the chapter card lies over the
     black, and play begins where the film leaves him, inside her door. The office's hum, his keys and the click; the
     Golden Mile shop's own air (its beds, World H's); the old mall's (World Y's: the empty floor, the drone, her song from
     the far end, louder as he comes); the tube, the beads, the bell. (Its score is the drone for now: the film's own
     music is generated when the account has credits again — docs/V22.0-E3C4-PLAN.md §12) */
  function introFilm(c, s, api) {
    const { tr, step, sfx, sfxFade, fade, rawK, stage } = api;
    const F = stage.filmO, T = F.T;
    c.keepFade = true;
    c.endFade = 1;                                       // the card fades in over the black the film ends on (CP11: it fell to 0 and showed the shop first)
    fade(0, 0, 1, 1);
    tr(0, T.end, (k, t) => F.frame(t, api), rawK);
    // O1 · his desk at night
    sfx(0.2, 'f4office', 0.5);
    sfx(0.5, 'f4keys', 0.42);                            // the search typed in the dark
    sfx(0.6, 'y4dread', 0.2);                            // the drone under all of it
    fade(0.6, 2.2, 1, 0);
    sfx(1.0, 'z4pro1', 1);                               // "After that night at the medium... I couldn't leave it alone..."  → 8.97
    sfx(8.2, 'f4click', 0.5);                            // the fifth result: "What is a Yin amulet?"
    fade(11.0, 11.85, 0, 1);
    sfxFade(11.0, 11.85, 'f4office');
    // O2 · Golden Mile, shop to shop (the shop's own air from World H's beds)
    fade(11.95, 12.6, 1, 0);
    sfx(12.4, 'z4pro2', 1);                              // "I went from shop to shop. Amulets, masters... anyone who might know something."  → 19.48
    sfx(15.55, 'f4shopbell', 0.5);                       // in through the shop's door
    sfx(21.3, 'x4set', 0.3);                             // the tray brought across the glass
    fade(23.2, 23.9, 0, 1);
    sfxFade(22.6, 24.0, 'y4dread');
    // O3 · the old mall, the top floor (World Y's beds: the empty floor, the drone, her song far off)
    fade(24.1, 25.2, 1, 0);
    sfx(25.0, 'z4pro3', 1);                              // "One afternoon, on the top floor of an old mall, I found a shop I had never noticed before."  → 30.72
    sfx(34.5, 'y4tube', 0.45);                           // the one tube stuttering, ahead of him
    sfx(36.6, 'y4tube', 0.35);
    sfx(39.0, 'z4pro4', 1);                              // "Nobody else was up there... just an old song, coming from that shop."  → 44.41
    // O4 · her door: the beads, the bell, the song close now
    sfx(T.beads, 'y4beads', 0.6);
    sfx(T.bell, 'y4bell', 0.45);
    fade(50.6, 52.0, 0, 1);
    // its frames hide the hands; play shows them, and nothing in the engine gives them back after an opening film
    // (CP11: the Yin shop was played with no hand, the locket and the cold on his arm unseen, until the merit film)
    step(T.end, () => { F.end(); api.handsRoot.visible = true; api.armR.visible = true; });
  }

  (window.__CHAPTERS__ = window.__CHAPTERS__ || {}).e3c4 = Object.assign(DATA, {
    build,
    scenes: [scOpen, scHome, scDown, scTeacher],
    intro: introFilm,
    films: { merit: meritFilm, runout: runoutFilm }
  });
})();
