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
             'owner', 'staffman', 'granny', 'botak', 'admintee', 'hanuman'],
    items: [],

    musicVol: 0,
    /* the beds, mixed every frame by where he is (mixBedsY): the cassette on the counter's shelf playing HER (its
       volume by distance, its pan by bearing, its RATE — the fourth value, main.js's loopRate — sagging with the
       cold and running down to a stop when he sets her down), the drone under the shop, the dead floor outside */
    ambience: { beds: [['y4song', 0, 0, 1], ['y4dread', 0], ['y4mall', 0], ['m4dusk', 0],   // m4dusk: the merit film's evening (mixBedsM)
                       /* CP7 · the Hanuman shop (mixBedsH): chapter 3's air, corridor, mall and radio, its own copies (h4*, the
                          v4.2 split) — the radio's third value its pan */
                       ['h4air', 0], ['h4walla', 0], ['h4mall', 0], ['h4radio', 0, 0]] },
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
      noteSteady: 'Held her gently, and set her down with respect.',
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
      evLetGoBrief: 'Something wants to come in. When the roar breaks, let go of it at once: wait for LET GO, then tap.',
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
            for (const tx of [-0.055, 0.055]) { const t = new THREE.Mesh(tubeGeo, mCorTube); t.rotation.x = Math.PI / 2; t.position.set(x + tx, CH - 0.07, 2.4); G.add(t); }
            glowPlane(3.2, 4.2, 0xdce6f4, 0.10, x, 0.012, 2.4, -Math.PI / 2);
            glowPlane(1.6, 2.8, 0xeef4ff, 0.16, x, CH - 0.006, 2.4, Math.PI / 2);
          } }
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
          const filmLook = hLive.look && P.wx > 100;                // CP7: the run-out film's stares
          if (P.look > 0 && (getState() === 'play' || filmLook)) {
            P.head.getWorldPosition(_hp); camera.getWorldPosition(_cp);
            const dx = _cp.x - _hp.x, dz = _cp.z - _hp.z, dy = _cp.y - _hp.y;
            const a = Math.atan2(dx, dz) - P.group.rotation.y, yawTo = Math.atan2(Math.sin(a), Math.cos(a));
            if (Math.abs(yawTo) < 1.7 && Math.hypot(dx, dz) < (filmLook ? 12 : 7)) { ty = THREE.MathUtils.clamp(yawTo, -0.9, 0.9); tp = THREE.MathUtils.clamp(-Math.atan2(dy, Math.hypot(dx, dz)), -0.35, 0.3); }
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
      function displayShelf(x, z, ry, standIn) {
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
          shopG.add(lod);
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
               lpCase, lpTilt, lpAmulet, lpHalo, lpMats, lpGlowTick, clockTo, flames, doorLeaves };
    }
    const H = buildWorldH();
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
    // CP7 · the Hanuman shop's sounds in play: the piece set down, the experience, the mall's small noises
    if (warmSounds) warmSounds(['y4setdown', 'h4rumble', 'h4surge', 'h4rattle', 'h4embers', 'h4roarin', 'h4ring', 'h4pull', 'h4clatter', 'h4burst',
                                'h4shutter', 'h4trolley', 'h4phone', 'h4cash', 'h4bag', 'h4child', 'h4slippers']);

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
      if (p === 'hanHold' && (tag === 'held' || tag === 'done')) { kit.objective(null); return; }
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
      /* the merit film (CP6): its end hands its black to World H. A skip lands on its last frame, so its world is put
         away here either way (meritEnd: the pocket hidden, the lens's width back, the envelope out of his hand, the
         captions cleared — captions run on wall time and outlive a skipped film) */
      const done = () => { meritEnd(); toWorld('H', false); };
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
      kit.event({
        kind: 'steady', label: W.evSteady, brief: W.evSteadyBrief, demo: 'steady',
        secs: 8, ring: 0.16, grace: 1.3, pass: 0.6,
        onBegin: () => { if (worldSfx) worldSfx('y4sting', 0.3, 0.8, 0); },
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
        coldTo({ pulse: { kick: true } });                         // the clatter jolts him
      }
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
      if (phase !== 'han') return false;
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
      const open = 1.0 + 1.4 * hash(hanX.run * 7 + hanX.tries, 59);
      kit.event({
        kind: 'timed', label: W.evLetGo, brief: first ? W.evLetGoBrief : undefined, demo: 'bar', low: true,
        waitWord: W.evLetGoWait, goWord: W.evLetGoGo, open, close: open + 0.75,
        // the pull builds to its peak 2.5 s into its take: cued so the peak lands on LET GO
        onBegin: () => after(Math.max(0, open - 2.5), () => { if (run === hanX.run && hanX.on && worldSfx) worldSfx('h4pull', 0.72, 1, 0); })
      }).then(r => {
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
        if (hanX.tries >= 3) { kit.conduct({ s: -3, note: W.noteLate, minigame: true }); after(0.8, () => hanRelease(run)); return; }
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
      if (at === 'hanHold' && tag === 'done') {
        hanX.released = true; dropShow(true);
        queueGap(1.4);
        queueLine('z4go', () => after(SECS.z4go + 0.3, () => runOut()));
      }
    }
    function hanReset() {
      hanX.run++;
      Object.assign(hanX, { on: false, released: false, tries: 0, uw: 0, uwTo: 0, gold: 0, goldTo: 0, emb: 0, embTo: 0,
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
    function toWorld(w, resumed, at, tag) {
      const run = ++worldRun;
      if (kit) { kit.root(true); kit.presence(0); kit.fade(1, 0.01); }
      placeIn(w);
      if (w === 'H') hEnter(at || 'han', tag);
      setPhase(at || (w === 'H' ? 'han' : 'tray'), at === 'trayHold' ? [...held].join(',') : at === 'hanHold' && tag === 'done' ? 'done' : undefined);
      const warmed = kit && kit.warm ? kit.warm() : Promise.resolve(0);
      warmed.then(() => {
        if (!alive || run !== worldRun) return;
        if (!resumed) {
          if (w === 'H') { queueLine('z4han0', () => after(SECS.z4han0 * 0.6, () => { if (kit) kit.fade(0, 1.6); })); queueGap(0.6);
                           queueLine('ow4hello', () => personTalk(hLive.owner, SECS.ow4hello)); queueLine('z4fine'); }
          else { queueLine('z4tray0', () => after(SECS.z4tray0 * 0.6, () => { if (kit) kit.fade(0, 1.6); })); queueGap(0.6); queueLine('to4hello'); }
          queueFn(() => { if (kit) kit.root(false); });
        } else if (kit) {
          kit.fade(0, 1.2); kit.root(false);
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
      yinTick(wdt); mixBedsY(wdt, st); mixBedsM(wdt);
      hTick(wdt); mixBedsH(wdt, st);
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
      watchTick(); wrongTick(); hAmbTick();
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
      if (at >= PHASES.indexOf('han')) { toWorld('H', true, p, tag[1]); return; }
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

    /* ---------------------------------------------------------- lifecycle */
    function snap() { return { phase }; }
    function restore() {}
    function reset() {
      dropTodo(); speakReset(); lineQ.length = 0; heard.clear();
      booted = false; dayClock.t = 0; lastWall = 0;
      looked.clear(); held.clear();
      worldRun++;
      yinReset();
      meritEnd(); duskK = 0;                         // the merit film's world put away (a replay can start inside it)
      hanReset(); runEnd();                          // World H: the piece, the vision, the lens, the door, the run-out's stares
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
                            girl: { placed: yin.girl.placed, a: +yin.girl.a.toFixed(2), shows: yin.girl.shows, side: yin.girl.side, at: yin.girl.at || null,
                                    ready: !!(yLive.girl && yLive.girl.ready), to: yin.girl.to, fail: yin.girl.fail || null },
                            beds: DATA.ambience.beds.map(b => b.map(v => typeof v === 'number' ? +v.toFixed(3) : v)), wrong: wrongI },
                     merit: { on: mLive.on, shot: mShotWas, monk: merit.monk.ready, fov: camera.fov, dusk: +duskK.toFixed(3) },
                     han: { on: hanX.on, released: hanX.released, tries: hanX.tries, stand: +stand.k.toFixed(2), vis: hanX.vis.on, visReady,
                            uw: +hanX.uw.toFixed(2), gold: +hanX.gold.toFixed(2), fov: +camera.fov.toFixed(2), hold: hold.mode,
                            people: [hLive.owner, hLive.staff, ...hLive.cust, hLive.walker].map(P => P ? (P.ready ? P.key : P.key + '?') : null),
                            run: runLive.shot, drop: hDrop.visible, face: visFaceNdc() } }),
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
