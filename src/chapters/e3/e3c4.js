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
             'monkshop', 'buddhahd', 'buddhalod', 'thaikit', 'hdb'],
    items: [],

    musicVol: 0,
    /* the beds, mixed every frame by where he is (mixBedsY): the cassette on the counter's shelf playing HER (its
       volume by distance, its pan by bearing, its RATE — the fourth value, main.js's loopRate — sagging with the
       cold and running down to a stop when he sets her down), the drone under the shop, the dead floor outside */
    ambience: { beds: [['y4song', 0, 0, 1], ['y4dread', 0], ['y4mall', 0], ['m4dusk', 0]] },   // m4dusk: the merit film's evening (mixBedsM)
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
      const group = new THREE.Group(); group.position.set(o.x, 0, o.z); group.rotation.y = o.ry || 0; worldY.add(group);
      const P = { key, group, model: null, mixer: null, idle: null, talk: null, head: null, headWrote: null, ready: false, o,
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
        if (P.mixer) P.mixer.update(wdt);                         // (a still figure has none)
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
      yinTick(wdt); mixBedsY(wdt, st); mixBedsM(wdt);
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
                     merit: { on: mLive.on, shot: mShotWas, monk: merit.monk.ready, fov: camera.fov, dusk: +duskK.toFixed(3) } }),
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
