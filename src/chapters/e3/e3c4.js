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
      hemi: [0xffd9cc, 0x2a1810, 0.55],
      key: [0xffcab4, 0.42, 1, 6, 2],
      fill: [0xff8c72, 0.22],
      stars: 0, moon: 0,
      sun: 0, clouds: 0,
      vmHemi: [0xffd9cc, 0x2a1810, 0.62],
      vmKey: [0xffcab4, 0.5]
    },

    assets: [],
    items: [],

    musicVol: 0,
    ambience: { beds: [] },
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

  /* the measured length of every line said OUTSIDE a cutscene (CP2 measures
     them; until then, estimates — sayLine books its window from these) */
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
    const YMALL = { x0: -18.0, x1: 6.0, z0: 0.0, z1: 5.0, H: 3.2 };
    const YDOOR = { x0: -0.55, x1: 0.55, h: 2.15 };       // the Yin shop's door, onto the corridor
    const YCNT  = { x0: 0.75, x1: 2.25, z0: -1.8, z1: -3.3, top: 0.95 };   // the keeper's counter, front right, its face to −x
    const KEEP  = { x: 1.85, z: -2.55 };                  // the keeper, seated behind it
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
    const matWallY  = M({ color: 0x6e5a4e, roughness: 0.95 });      // the Yin shop's walls, old and stained (CP4)
    const matFloorY = M({ color: 0x4a3c34, roughness: 0.7 });
    const matCeilY  = M({ color: 0x3a3230, roughness: 0.95 });
    const matTerr   = M({ color: 0x8a8478, roughness: 0.5 });       // the corridor's terrazzo (CP4)
    const matWallC  = M({ color: 0xb8b0a0, roughness: 0.92 });
    const matCeilC  = M({ color: 0x9c968c, roughness: 0.95 });
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
    const matTube   = new THREE.MeshBasicMaterial({ color: 0xeef4ff }); mats.push(matTube);

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

    /* ============================================== WORLD Y · THE YIN SHOP
       CP1: the room and the corridor, lit and walled (CP4 dresses them) */
    {
      const W = YSHOP.x1 - YSHOP.x0, D = YSHOP.z1 - YSHOP.z0, cz = (YSHOP.z0 + YSHOP.z1) / 2;
      floorAt(W, D, 0, cz, matFloorY, worldY);
      ceilAt(W, D, 0, YSHOP.H, cz, matCeilY, worldY);
      walls.push(box(W + 0.4, YSHOP.H, 0.2, 0, YSHOP.H / 2, YSHOP.z0 - 0.1, matWallY, worldY, false));
      walls.push(box(0.2, YSHOP.H, D, YSHOP.x0 - 0.1, YSHOP.H / 2, cz, matWallY, worldY, false));
      walls.push(box(0.2, YSHOP.H, D, YSHOP.x1 + 0.1, YSHOP.H / 2, cz, matWallY, worldY, false));
      // the front, either side of the door
      const lw = YDOOR.x0 - YSHOP.x0, rw = YSHOP.x1 - YDOOR.x1;
      walls.push(box(lw, YSHOP.H, 0.2, YSHOP.x0 + lw / 2, YSHOP.H / 2, 0.1, matWallY, worldY, false));
      walls.push(box(rw, YSHOP.H, 0.2, YDOOR.x1 + rw / 2, YSHOP.H / 2, 0.1, matWallY, worldY, false));
      box(YDOOR.x1 - YDOOR.x0, YSHOP.H - YDOOR.h, 0.2, 0, (YSHOP.H + YDOOR.h) / 2, 0.1, matWallY, worldY, false);
      // the counter (a solid), the tube
      solids.push(box(YCNT.x1 - YCNT.x0, YCNT.top, YCNT.z0 - YCNT.z1, (YCNT.x0 + YCNT.x1) / 2, YCNT.top / 2, (YCNT.z0 + YCNT.z1) / 2, matWood, worldY));
      box(0.06, 0.04, 1.2, 0, YSHOP.H - 0.03, -3.6, matTube, worldY, false);
      // the corridor
      const CW = YMALL.x1 - YMALL.x0, CD = YMALL.z1 - YMALL.z0, ccx = (YMALL.x0 + YMALL.x1) / 2, ccz = (YMALL.z0 + YMALL.z1) / 2;
      floorAt(CW, CD, ccx, ccz, matTerr, worldY);
      ceilAt(CW, CD, ccx, YMALL.H, ccz, matCeilC, worldY);
      walls.push(box(CW, YMALL.H, 0.2, ccx, YMALL.H / 2, YMALL.z1 + 0.1, matWallC, worldY, false));
      walls.push(box(0.2, YMALL.H, CD, YMALL.x0 - 0.1, YMALL.H / 2, ccz, matWallC, worldY, false));
      walls.push(box(0.2, YMALL.H, CD, YMALL.x1 + 0.1, YMALL.H / 2, ccz, matWallC, worldY, false));
      // the shopfronts either side of the Yin shop's (shuttered: CP4)
      const fl = YSHOP.x0 - YMALL.x0, fr = YMALL.x1 - YSHOP.x1;
      walls.push(box(fl, YMALL.H, 0.2, YMALL.x0 + fl / 2, YMALL.H / 2, -0.1, matWallC, worldY, false));
      walls.push(box(fr, YMALL.H, 0.2, YSHOP.x1 + fr / 2, YMALL.H / 2, -0.1, matWallC, worldY, false));
    }

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
      queueLine({ bottles: 'z4look1', photos: 'z4look2', altar: 'z4look3' }[k]);
      if (looked.size >= LOOK_N) queueFn(() => keeperSpeaks());
      return true;
    }
    function keeperSpeaks() {
      if (phase !== 'yin') return;
      queueGap(0.6);
      queueLine('yk4hello', () => setPhase('yinKeeper'));
    }
    function keeperShows() {
      if (phase !== 'yinKeeper') return false;
      queueLine('yk4show');
      queueLine('z4ask');
      queueLine('yk4gentle', () => setPhase('yinHold'));
      return true;
    }
    function pickLocket() {
      if (phase !== 'yinHold') return false;
      // CP5: the whole Yin experience. CP1: the line, set down, the keeper.
      queueLine('z4yin');
      queueLine('yk4heard');
      queueLine('yk4merit', () => setPhase('yinDone'));
      return true;
    }
    function leaveYin() {
      if (phase !== 'yinDone' || !kit) return;
      setPhase('yinDone');
      if (!kit.film || !kit.film('merit', { onDone: () => toWorld('H', false) })) toWorld('H', false);
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
      { id: 'lkBottles', lookKey: 'bottles', pos: { x: YSHOP.x0 + 0.3, y: 1.35, z: -3.6 }, radius: 6, aim: 0.30, pressAim: true, once: true, markFar: 6, prompt: W.lookBottles,
        enabled: () => phase === 'yin' && quiet(), onInteract() { return lookAt('bottles'); } },
      { id: 'lkPhotos', lookKey: 'photos', pos: { x: YSHOP.x1 - 0.1, y: 1.6, z: -5.2 }, radius: 6, aim: 0.30, pressAim: true, once: true, markFar: 6, prompt: W.lookPhotos,
        enabled: () => phase === 'yin' && quiet(), onInteract() { return lookAt('photos'); } },
      { id: 'lkAltar', lookKey: 'altar', pos: { x: 0, y: 1.2, z: YSHOP.z0 + 0.5 }, radius: 7, aim: 0.30, pressAim: true, once: true, markFar: 7, prompt: W.lookAltar,
        enabled: () => phase === 'yin' && quiet(), onInteract() { return lookAt('altar'); } },
      { id: 'keeper', pos: { x: KEEP.x, y: 1.35, z: KEEP.z }, radius: 2.6, prompt: W.hotKeeper, markY: 0.3,
        enabled: () => phase === 'yinKeeper' && quiet(), onInteract() { return keeperShows(); } },
      { id: 'locket', pos: { x: YCNT.x0 + 0.2, y: YCNT.top + 0.1, z: -2.55 }, radius: 2.2, prompt: W.hotLocket, markY: 0.2,
        enabled: () => phase === 'yinHold' && quiet(), onInteract() { return pickLocket(); } },
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
      const st = getState();
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
      watchTick();
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
      setPhase(p, p === 'yin' && looked.size ? [...looked].join(',') : undefined);
    }

    /* ---------------------------------------------------------- lifecycle */
    function snap() { return { phase }; }
    function restore() {}
    function reset() {
      dropTodo(); speakReset(); lineQ.length = 0; heard.clear();
      booted = false; dayClock.t = 0; lastWall = 0;
      looked.clear(); held.clear();
      worldRun++;
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
                     until: +speak.until.toFixed(2), pending: speak.pending ? speak.pending.name : null, world: worldOf(yaw.position.x) }),
      hotspots,
      updateNotes, updatePile, updateFire, updateSlow,
      snap, restore, reset, dispose
    });
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
