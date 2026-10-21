/* Episode 3 · Chapter 3 · "The Dance On Buddha Day"
   ---------------------------------------------------------------------------
   THE THIRD CHAPTER OF CASE FILE 3, "How It All Began" — S1·08, "The Journey
   To Seek The Truth". Buddha Day, in Singapore, at an amulet shop he often
   visits. Paying respect to the main Buddha, something comes into his body:
   fully conscious, he cannot stop himself, and what the body performs is a
   traditional dance, "as though dancing for the god to see". People rush in
   and cannot stop him; they give up and let him dance for fifteen minutes;
   afterwards they urge him to see a medium that night. At the medium the same
   presence walks him forward and BOWS him; the medium says, without much
   hesitation, that it is a ghost possessing him — and the nature of it
   changes: something monkey-like comes through and he ROARS at the man.

   THE EPISODE'S AXIS IS CONTROL. Chapter 1 was ASKING, chapter 2 HANDS (the
   player could fight them). This is VOICE: the player cannot stop the body
   at all — only stay aware of what is around him (the STAY PRESENT minigame,
   the case file's own "I was conscious the whole time") — and at the medium
   his legs walk him forward on their own.

   TWO PLACES, one chapter (Chad, 19 Oct 2026: "The player still gets to
   browse the amulet shop in play, get the lp tim amulet. And then the buddha
   day celebration starts, and that's when the trance begins. Then cutscene
   takes over, and the staff and customers urge him to see a medium, and the
   player is then transported to the next playable section with the chinese
   medium scene"):
   - WORLD A, the amulet shop in an old Singapore mall, Buddha Day noon: the
     owner gives him the LP Tim Khun Paen, the celebration's chant, the trance
     beginning in play, and the cutscene taking over (`kit.film`, the
     twenty-sixth seam — a cutscene from PLAY that hands back to PLAY).
   - WORLD B, a shophouse shrine that night, a pocket past the far plane: the
     incense, the wait, two readings given with complete certainty, the walk
     he cannot stop, the bow, "It is a ghost possessing you", the roar.

   The four options are the approved plan's (docs/V16.0-EPISODE3-PLAN.md §3,
   chapter 3): accept it whole (bad), tell him he is wrong (worst), thank him
   and put it out of mind (good), thank him and hold his reading as one view,
   and keep seeking (best — the case file's own lesson). The teaching is
   S1·08's lesson, verbatim.

   docs/V21.0-E3C3-PLAN.md is the build's memory.                           */

(() => {
  'use strict';

  let S = null;

  const DATA = {
    id: 3,
    episode: 3,
    title: 'The Dance On Buddha Day',
    cardLabel: 'Chapter 3',
    cardTitle: 'The Dance On Buddha Day',
    brief: 'Buddha Day, at the amulet shop you often visit in Singapore. Look around, see the owner at his counter, and join his chanting at the altar.',
    prompt: 'The medium has given his reading, and something roared back at him through you. What do you do with what he said?',
    choices: [
      { k: 'A', text: 'Accept it: it is a ghost. Do every ritual he says.',
        d: { sanity: -9, awareness: 6, wisdom: -12 }, verdict: 'bad',
        say: 'I took his word, and did everything he said.',
        teach: 'A reading is one person\'s understanding, through their own training. Taken whole, the first explanation ends the search before it begins.' },
      { k: 'B', text: 'Tell him he is wrong.',
        d: { sanity: -18, awareness: -9, wisdom: -27 }, verdict: 'worst', critical: true,
        say: 'I told him he was wrong.',
        teach: 'Answering one certainty with another is the same mistake, and provoking what you cannot identify is never safe.' },
      { k: 'C', text: 'Thank him, leave, and put it out of mind.',
        d: { sanity: 9, awareness: 12, wisdom: 15 }, verdict: 'good',
        say: 'I thanked him, and tried to forget it.',
        teach: 'Leaving politely harms no one. But a question put away does not answer itself.' },
      { k: 'D', text: 'Thank him, hold his reading as one view, and keep seeking the truth.',
        d: { sanity: 15, awareness: 24, wisdom: 30 }, verdict: 'best',
        say: 'I thanked him, and kept looking for the truth.',
        teach: 'Respect the one who reads for you, and hold what he says as one view. The truth is still yours to seek.' }
    ],
    /* v21.8 (Chad: "The core lesson text is way too long, and why is that written from a first person perspective?
       None of the previous core lessons were ever written like that. It should be a real core lesson."): the case
       file's own lesson in the second person, a third of the length, no Pali tag — his pick of the three proposed */
    core: 'Not every practitioner reads the same experience the same way, and being called a master does not make a reading infallible. Do not simply accept the first explanation you are handed. If you want the truth, seek it, learn it, and find it for yourself.',

    /* units metres, y up. WORLD A, THE SHOP: its inner faces x -4.5…4.5,
       z -7 (the altar's wall) … 0 (the glass front onto the mall); the mall
       corridor past the glass, z 0…5. WORLD B, THE SHRINE: a pocket at
       x -250 (the far plane is 160 m: neither is ever drawn from the other,
       v8.9), its shutter front at z 0, the five-foot way z 0…2.2. */
    spawn:     { x: -0.4, y: 1.62, z: -1.0, rot: 0.1 },    // (0.25 cut the principal Buddha in half at a phone's edge on the first frame of play — GF-4)
    shrine:    { x: -0.9, z: -3.65 },         // the engine's anchor: his mat at the celebration (ghost: null; v21.8: the rows 0.95 m back, MAT)
    ghostHome: { x: -0.9, z: -3.65 },
    bounds:    { minX: -262, maxX: 4.3, minZ: -9.8, maxZ: 2.0 },

    /* NO HAUNTING (the eleventh leak). Nothing comes for him; something comes
       THROUGH him. */
    ghost: null,

    /* NOON, INDOORS. The shop is under a mall's roof; the sky is only ever
       seen through the film's pockets and the shrine's night (kit.daylight). */
    daylight: {
      stops: [[0.00, '#cfe2f2'], [0.10, '#b9d4ec'], [0.30, '#8fb8e0'],
              [0.60, '#6a9ad0'], [1.00, '#4a7cbc']],
      bg: 0xb8cde0,
      fog: [0xd8d2c4, 0.004],
      hemi: [0xfff4e2, 0x6a5a48, 0.95],
      key: [0xfff0dc, 0.85, 2, 8, 4],
      fill: [0xcfe0ff, 0.35],
      stars: 0, moon: 0,
      sun: 0, clouds: 0,
      vmHemi: [0xfff2e0, 0x6a5a48, 0.95],
      vmKey: [0xfff0dc, 0.80]
    },

    /* the stand-in cast (docs/V21.0-E3C3-PLAN.md §3) — each behind its own
       key, so a model of Chad's is a one-line swap */
    assets: ['buddhahd', 'buddhalod', 'timkp', 'timkplod', 'thaikit', 'hanuman', 'medium', 'owner', 'staffman', 'hdb',
             'cg_woman2hd', 'cg_man2hd', 'sitclap', 'sitshout', 'botak',
             'guangong', 'sitman', 'sitwoman', 'sitwomantalk', 'wifewalk',
             /* v21.8: the monk who leads the chant (e3c1's, at full detail), Chad's row of altar statues (e3c1's Sak Yant
                room), and his five masters for the wall (the sources' own photographs, unaltered) */
             'monkshop', 'altarrow', 'altarrowfar', 'lersimask', 'cars', 'mstr_somdejtoh', 'mstr_achanmun', 'mstr_lpthuad', 'mstr_lptimpray', 'mstr_lptimbench',
             'traynear', 'trayfar', 'amushelf'],
    items: ['timkp'],

    musicVol: 0,
    /* the mall's murmur through the glass; the radio's Thai music while he
       browses, until the owner turns it off for the monk's chant (v21.2: a
       chant until Chad turned it down — the bed keeps its name, `shopchant`;
       v21.8: on from the start, off for the chant); THE MELODY NOBODY ELSE
       HEARS, from the monk's last word through the trance and into its film;
       the dance's cloth and feet — driven every frame by mixBeds (e3c2's shape) */
    /* (the rites' drum and four more are COPIES under this chapter's own names — ritual3, drum3, drumroll3, gong3,
       candlelit3, incenselit3, matkneel3: a sound two chapters ask for is shared, and asking for ch3's, e3c1's and
       e3c2's by their names put all seven in every player's boot download — EN-2, the v4.2 split) */
    ambience: { beds: [['mallamb', 0.3], ['shopchant', 0], ['e3dance', 0], ['dancemove', 0],
                       ['lorongamb', 0], ['shrineamb', 0], ['e3shrine', 0], ['ritual3', 0]] },
    voiceLine: null,

    words: {
      approach: '',
      act: 'E to act',
      actTouch: 'Tap to act',
      interact: 'E to choose what you do',
      interactTouch: 'Tap to choose what you do',
      actLine: 'Press E to choose what you do',
      actLineTouch: 'Tap to choose what you do',
      objBrowse: 'Look around the shop · {n}/4',          // (v21.9: each of the four pressed is a beat)
      objOwner: 'See the owner at his counter',
      objWear: 'Open your bag and wear the LP Tim Khun Paen',
      objJoin: 'Join the chanting at the altar',
      objChant: 'Chant with them',
      objIncense: 'Light incense at the urn',
      objWait: 'Sit and wait for your turn',
      objWatch: 'Wait for your turn',
      hotOwner: 'Talk to the owner',
      hotMat: 'Kneel on the mat',
      hotIncense: 'Take three joss sticks',
      hotStool: 'Sit on the stool',
      evAware: 'Stay present',
      evAwareBrief: 'Something has come into your body, and you cannot stop it. But you are still here. When a light shows on something around you, tap it (or click it) before its ring closes.',
      lookWall: 'The framed amulets',
      lookTim: 'The LP Tim on its stand',          // (v21.8: no glass case — on screen it may say LP; a VOICE says Luang Phu)
      lookAltar: 'The altar',
      lookMasters: 'The old masters',
      tgBuddha: 'The Buddha',
      tgCandle: 'A candle',
      tgOwner: 'Uncle',
      tgClock: 'The clock',
      tgAuntie: 'The auntie, praying',
      tgGirl: 'The girl\'s hands',
      presence: 'Something is moving your body.',
      presenceWarn: 'Sanity drops while it holds you.',
      noteTim: 'Wore the LP Tim Khun Paen the owner gave you.',
      noteAware: 'Stayed aware of what was around you, though your body was not yours.',
      noteLost: 'Lost track of where you were while your body danced.',
      noteIncense: 'Lit incense at the medium\'s urn before you sat.'
    },
    sayPrefix: 'z3'
  };

  /* the measured length of every line said OUTSIDE a cutscene
     (masters/v21.0: the installed files, ffprobe; v21.8's re-said and new lines, masters/v21.8) */
  const SECS = {
    z3pro0: 4.24, z3pro3: 4.0, z3pro4: 6.84, z3pro5: 4.8, ow3hello: 5.96, z3look1: 6.27,
    z3look2: 4.65, z3look3: 5.93, z3look4: 3.71, ow3call: 2.43, ow3gift1: 9.69, ow3gift2: 3.47,
    z3thanks: 4.21, ow3good: 2.85, mk3chant: 30.37, z3shift1: 3.47, z3shift2: 4.28, ow3eh: 2.93,
    sm3hold: 2.38, sm3cannot: 2.32, st3uncle: 2.35, cu3sadhu: 3.01, ow3let: 2.43, z3breath: 3.0,
    ow3know: 2.04, z3knew: 5.64, st3trance: 2.59, cu3unclean: 4.26, ow3medium: 5.56, z3night: 2.69,
    z3shrine: 4.7, as3sit: 3.63, dv3wife: 7.57, md3read1: 7.16, md3drink: 3.32, dv3father: 4.68,
    md3read2: 3.92, md3done: 1.52, as3next: 1.88, z3walk: 4.44, md3ghost: 1.7, md3gasp: 1.39, md3chant: 4.27,
    as3back: 2.51, z3A1: 2.51, md3A1: 2.12, md3A2: 0.57, as3A: 3.87, z3A2: 4.05,
    z3B1: 2.35, md3B1: 1.18, as3B: 3.27, z3B2: 4.91, z3thank: 1.96, md3C: 2.43,
    z3C2: 5.96, md3D: 1.23, z3D2: 6.77, z3D3: 4.44, z3close: 8.44, z3next: 3.87,
    z3A: 2.93, z3B: 1.57, z3C: 2.27, z3D: 3.08
  };

  const hash = (i, s) => { const x = Math.sin(i * 127.1 + s * 311.7) * 43758.5453; return x - Math.floor(x); };
  const smooth = k => k * k * (3 - 2 * k);

  function build(ctx) {
    const { THREE, GLTFLoader, cloneSkinned, scene, camera, yaw, pitch, LOW, kit, plantTrees,
            assetBytes, rescueTextures, redoShadows, cnv, makeHellNote, makeSoftDot, loadImageTexture,
            getState, startDecision, worldSfx, warmSounds, soundOff, HEAD_RE, unifySkeletons } = ctx;

    const owned = [];
    const treeStands = [];          // v21.1: kept, so dispose() can hand the shared tree kit back before its sweep
    let alive = true;
    let shrineRun = 0, shrDark = false;   // v21.1: the shrine arrival's run token (SR-6) and its HUD held under the black (ST-4)
    let shrineWarm = null;                // v21.1: the arrival's warm while it runs (a cold arrival that supersedes it waits for it)
    let lanternSkinMat = null, tasselMat = null, coilTagMat = null;   // v21.1: the lanterns' shared skin and tassel (mkLantern) and the coils' one tag (mkCoil), here so no caller meets them in their dead zone
    const parsedGlb = new Map();
    const madeTex = [];
    const tex = (t) => { madeTex.push(t); return t; };

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
    const CLOCK = { x: 0, y: 2.56, z: -0.06 };           // over the door, inside, facing the shop

    /* ----------------------------------------------------------- materials */
    const noteTex = makeHellNote();
    madeTex.push(noteTex);
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
    const matMat    = new THREE.MeshStandardMaterial({ map: tex(makeReedMat(THREE, cnv)), roughness: 0.95 });

    const world = new THREE.Group();
    scene.add(world);
    const shopG = new THREE.Group(); world.add(shopG);      // WORLD A
    const mallG = new THREE.Group(); world.add(mallG);      // the corridor past the glass

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
    const texMat = (t, o = {}) => new THREE.MeshStandardMaterial({ map: tex(t), roughness: 0.8, ...o });
    /* an invisible box that is only a blocker (collision reads it whether it
       is drawn or not) */
    const hidBox = (w, h, d, x, y, z, parent = shopG) => { const m = box(w, h, d, x, y, z, matProxy, parent, false); m.visible = false; return m; };

    /* ------------------------------------------------- one parse per asset */
    function parseOnce(key) {
      if (!parsedGlb.has(key)) {
        parsedGlb.set(key, assetBytes(key).then(BUF => new Promise((res, rej) =>
          new GLTFLoader().parse(BUF, '', (gltf) => {
            rescueTextures(gltf, BUF);
            /* one exact skeleton per model, before any clone (v15.2, proven pixel for pixel): a scan's every mesh
               carries its own, and the staff man was ten skeleton updates a frame (the v21.1 review) */
            if (unifySkeletons) unifySkeletons(gltf.scene);
            res({ scene: gltf.scene, animations: gltf.animations });
          }, rej))));
      }
      return parsedGlb.get(key);
    }

    /* THE THAI KIT (v16.6's file): one parse, every piece a clone; a primitive
       it replaces stays drawn until it lands. Chad's Buddha (v18.8) takes the
       kit Buddha's place at the kit's footprint — a LOD per image, the
       PRINCIPAL one (`hd`) the full statue while it is big on screen. */
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
        for (const x of (o.hide || [])) if (x) x.visible = false;
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
        for (const h of (o.hide || [])) if (h) h.visible = false;
        if (o.then) o.then(g, m);
      }).catch(err => { console.warn('thaikit failed to load', err); ctx.loadFail && ctx.loadFail('thaikit', err); });
      return g;
    }

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
      walls.push(box(SHOP.x1 - SHOP.x0, SHOP.H, 0.12, 0, SHOP.H / 2, 0.06, matGlass, shopG, false));
      box(SHOP.x1 - SHOP.x0, bulk, 0.16, 0, yT + bulk / 2, 0.02, matWall, shopG, false);           // the bulkhead
      box(SHOP.x1 - SHOP.x0, 0.06, 0.1, 0, yT, 0.03, matAlu, shopG, false);                         // the transom
      box(SHOP.x1 - SHOP.x0, 0.06, 0.1, 0, 0.03, 0.03, matAlu, shopG, false);                       // the sill
      for (const mx of [SHOP.x0 + 0.04, -2.6, DOOR.x0, 0, DOOR.x1, 2.6, SHOP.x1 - 0.04]) box(0.06, yT, 0.1, mx, yT / 2, 0.03, matAlu, shopG, false);
      // the door's pulls and its bell
      for (const s of [-1, 1]) { const p = cyl(0.014, 0.014, 0.9, s * 0.1, 1.05, -0.06, matChrome, 8, shopG);
        cyl(0.01, 0.01, 0.06, s * 0.1, 1.48, -0.03, matChrome, 6, shopG).rotation.x = Math.PI / 2;
        cyl(0.01, 0.01, 0.06, s * 0.1, 0.62, -0.03, matChrome, 6, shopG).rotation.x = Math.PI / 2; p.castShadow = false; }
      const bell = cyl(0.02, 0.045, 0.07, DOOR.x1 - 0.12, yT - 0.08, -0.05, matGold, 12, shopG); bell.castShadow = false;
      // the name in gold leaf, twice: on the left pane and the right (it reads backwards from inside, as it should)
      const nameM = new THREE.MeshBasicMaterial({ map: tex(makeGlassName(THREE, cnv)), transparent: true, depthWrite: false, side: THREE.DoubleSide });
      for (const sx of [-1.6, 1.6]) plane(1.8, 0.675, nameM, sx, 1.62, 0.005, 0, shopG);
      // an OPEN sign hanging in the door, and the opening hours
      const openM = texMat(makeSignTxt(THREE, cnv, 'OPEN  营业中', '#1f6a3a', '#fff6d0', 3.2), { emissive: 0xffffff, emissiveIntensity: 0.12 });
      openM.emissiveMap = openM.map; plane(0.36, 0.12, openM, -0.3, 1.72, -0.02, 0, shopG);
      plane(0.36, 0.12, texMat(makeSignTxt(THREE, cnv, 'THANK YOU  谢谢', '#1f6a3a', '#fff6d0', 3.2)), -0.3, 1.72, -0.022, Math.PI, shopG);
      for (const s of [-1, 1]) box(0.003, yT - 1.78, 0.003, -0.3 + s * 0.15, (yT + 1.78) / 2, -0.021, matBlack, shopG, false);   // its cord
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

    /* ----------------------------------- THE LP TIM, on its own stand
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
    const lpMats = [];                                      // the scan's own materials, lit from within (lpGlowTick)
    /* THE GLOW, one group (lpHalo — the name every toggle already used): the halo, the ring, the motes. Additive
       light over the white counter top sums to white (the v8.8 law), so the halo is small and warm, a glow ROUND
       the amulet (ch3's: its first, 40 cm halo blew the paper behind it out) */
    const lpHalo = new THREE.Group(); lpCase.add(lpHalo);
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
    Promise.all([parseOnce('timkplod'), parseOnce('timkp')]).then(([lo, hd]) => {
      if (!alive) return;
      for (const [src, d] of [[hd.scene, 0], [lo.scene, 1.4]]) {
        const m = src.clone(true); m.scale.setScalar(LP_H);
        m.traverse(q => {
          if (!q.isMesh) return;
          q.castShadow = false; q.receiveShadow = false;
          /* its own copy of each material, so lighting it from within touches no other use of the scan (the bag's
             views and the unlock splash draw the same file) */
          q.material = (Array.isArray(q.material) ? q.material : [q.material]).map(mt => {
            if (!mt || !mt.emissive) return mt;
            const c = mt.clone(); c.emissive.set(0xffffff); c.emissiveIntensity = 0; c.emissiveMap = c.map || null;
            lpMats.push(c); owned.push({ dispose: () => c.dispose() }); return c;
          });
          if (q.material.length === 1) q.material = q.material[0];
        });
        lpAmulet.addLevel(m, d);
      }
      lpProxy.visible = false;
    }).catch(err => { console.warn('the LP Tim failed to load', err); ctx.loadFail && ctx.loadFail('timkp', err); });

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
       Luang Phu Tim's two, above — the master of the shop's prized amulet —
       in plain gilt frames built ROUND the photographs; below, Luang Pu
       Thuad, Somdej Toh and Ajahn Mun, whose pictures carry their own gold
       frames and hang as they are (their corners are the file's own
       transparency). Credited in the panel, one row a page. */
    {
      const wx = SHOP.x1 - 0.012;
      /* an ImageBitmap upload ignores UNPACK_FLIP_Y (the WebGL rule), so the photograph's first row arrives at v = 0:
         the plane's own v is turned round to stand it upright — the picture itself is never touched */
      const portrait = (key, mime, w, h, y, z, frame) => {
        const g = new THREE.Group(); g.position.set(wx - 0.004, y, z); g.rotation.y = -Math.PI / 2; shopG.add(g);
        // a soft shadow on the wall, a little under it, so it hangs ON the wall rather than being painted into it
        const sh = new THREE.Mesh(new THREE.PlaneGeometry(w * 1.12, h * 1.1), new THREE.MeshBasicMaterial({
          map: (() => { const t = makeSoftDot('rgba(0,0,0,0.55)', 'rgba(0,0,0,0)'); madeTex.push(t); return t; })(),
          transparent: true, depthWrite: false, fog: false }));
        sh.position.set(0.006, -0.018, -0.002); g.add(sh);
        if (frame) {                                         // a gilt moulding round it, standing proud of the picture, and a dark board behind
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
        const m = new THREE.Mesh(geo, mat); m.position.z = frame ? 0.0075 : 0.004; m.visible = false; g.add(m);
        loadImageTexture(key, mime).then(t => {
          if (!alive || !t) return;
          madeTex.push(t); mat.map = t; mat.needsUpdate = true; m.visible = true;
        }).catch(() => {});
        return g;
      };
      /* Luang Phu Tim at prayer (250 x 333) and on his bench (450 x 600), both 3:4; the three mybuddha108 portraits
         320 x 418. Left to right as seen from the shop floor (+z is the viewer's right on this wall) */
      portrait('mstr_lptimpray', 'image/jpeg', 0.42, 0.42 * 333 / 250, 1.97, -2.86, true);
      portrait('mstr_lptimbench', 'image/jpeg', 0.42, 0.42 * 600 / 450, 1.97, -2.14, true);
      portrait('mstr_lpthuad', 'image/png', 0.48 * 320 / 418, 0.48, 1.2, -2.96, false);
      portrait('mstr_somdejtoh', 'image/png', 0.48 * 320 / 418, 0.48, 1.2, -2.5, false);
      portrait('mstr_achanmun', 'image/png', 0.48 * 320 / 418, 0.48, 1.2, -2.04, false);
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
      plane(0.42, 0.63, texMat(makeCalendar(THREE, cnv)), wx - 0.002, 1.55, -4.15, -Math.PI / 2, shopG);
      solids.push(hidBox(0.4, 0.9, 2.8, SHOP.x1 - 0.2, 0.45, -2.45));
      // a small shelf-shrine over the photographs: a Buddha, a garland, two candles
      /* (on two gilt brackets, with a gold lip along its front: seen from the counter it was a dark-red slab floating
         on nothing behind the SANITY row — VP-9) */
      box(0.28, 0.03, 0.7, SHOP.x1 - 0.14, 2.62, -2.5, matRed, shopG);
      box(0.012, 0.045, 0.7, SHOP.x1 - 0.282, 2.62, -2.5, matGold, shopG, false);
      for (const dz of [-0.26, 0.26]) {
        box(0.2, 0.025, 0.03, SHOP.x1 - 0.1, 2.59, -2.5 + dz, matGold, shopG, false);
        const st = box(0.02, 0.2, 0.03, SHOP.x1 - 0.02, 2.5, -2.5 + dz, matGold, shopG, false);
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
    clockTo(12, 6);

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

    /* ------------------------------------------------------- BUDDHA DAY
       Lotus lanterns over the mats, strings of Buddhist flags across the
       ceiling. (v21.2: Buddha Day here is an uposatha day, not Vesak — Chad —
       so the HAPPY VESAK DAY banner over the altar's valance is gone.) */
    const flagTex = tex(makeBuddhistFlag(THREE, cnv));
    {
      const flagM = new THREE.MeshStandardMaterial({ map: flagTex, roughness: 0.9, side: THREE.DoubleSide });
      const fG = new THREE.PlaneGeometry(0.2, 0.13);
      const fl = [];
      const string = (x0, z0, x1, z1, y, n) => {
        for (let i = 0; i <= n; i++) {
          const k = i / n, sag = Math.sin(k * Math.PI) * 0.14;
          fl.push([x0 + (x1 - x0) * k, y - sag - 0.07, z0 + (z1 - z0) * k, Math.atan2(x1 - x0, z1 - z0) + Math.PI / 2]);
        }
      };
      string(-4.3, -1.0, 4.3, -1.0, 2.82, 22); string(-4.3, -3.2, 4.3, -3.2, 2.82, 22); string(-4.3, -5.3, 4.3, -5.3, 2.82, 22);
      const I = new THREE.InstancedMesh(fG, flagM, fl.length), m = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler();
      fl.forEach(([x, y, z, ry], i) => { e.set(0, ry, 0.08 * Math.sin(i * 1.7)); q.setFromEuler(e); m.compose(new THREE.Vector3(x, y, z), q, new THREE.Vector3(1, 1, 1)); I.setMatrixAt(i, m); });
      I.castShadow = false; shopG.add(I);
      // the lanterns: pink lotus paper lanterns, petals in two rings, a tassel
      const petalG = new THREE.SphereGeometry(0.07, 10, 8); petalG.scale(0.55, 1.2, 0.3);
      const pink = new THREE.MeshStandardMaterial({ color: 0xf4a2bc, roughness: 0.8, emissive: 0xf08aa8, emissiveIntensity: 0.25 });
      const white = new THREE.MeshStandardMaterial({ color: 0xfff2f4, roughness: 0.8, emissive: 0xffe8ee, emissiveIntensity: 0.2 });
      /* (the front pair hung 1.2 m ahead of the spawn and 0.7 m over the eye, and on a phone the first frame put a pink
         lantern right behind the SANITY and AWARENESS labels — VP-1: at z −2.8 it sits under the stats) */
      const lanterns = [[-1.6, -4.0], [0, -4.4], [1.6, -4.0], [-0.8, -2.8], [0.8, -2.8]];
      const tasM = new THREE.MeshStandardMaterial({ color: 0xf2c12e, roughness: 0.8 });
      const petals = [];
      for (const [lx, lz] of lanterns) {
        const L = new THREE.Group(); L.position.set(lx, 2.3, lz); shopG.add(L);
        cyl(0.003, 0.003, SHOP.H - 2.3 - 0.12, 0, (SHOP.H - 2.3) / 2 + 0.06, 0, matDark, 4, L).castShadow = false;
        for (let ring = 0; ring < 2; ring++) for (let i = 0; i < 8; i++) {
          const a = i / 8 * Math.PI * 2 + ring * 0.39, p = new THREE.Object3D();
          p.position.set(lx + Math.cos(a) * (0.09 - ring * 0.04), 2.3 + 0.06 + ring * 0.04, lz + Math.sin(a) * (0.09 - ring * 0.04));
          p.rotation.set(0, -a + Math.PI / 2, 0); p.rotateX(0.5 - ring * 0.25); p.updateMatrix();
          petals.push([ring, p.matrix.clone()]);
        }
        const t = cyl(0.008, 0.02, 0.18, 0, -0.08, 0, tasM, 6, L); t.castShadow = false;
      }
      /* the petals INSTANCED, one mesh a colour (PF-6: eighty meshes, eighty draws, for five lanterns) */
      for (const ring of [0, 1]) {
        const ms = petals.filter(q => q[0] === ring), I = new THREE.InstancedMesh(petalG, ring ? white : pink, ms.length);
        ms.forEach((q, i) => I.setMatrixAt(i, q[1])); I.computeBoundingSphere(); shopG.add(I);
      }
    }

    /* ----------------------------------------------- the celebration's mats */
    {
      for (const m of MATS) {
        const p = new THREE.Mesh(new THREE.PlaneGeometry(0.62, 0.82), matMat); p.rotation.x = -Math.PI / 2; p.position.set(m.x, 0.006, m.z); p.receiveShadow = true; shopG.add(p);
      }
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
      box(W, MALL.H, 0.2, 0, MALL.H / 2, MALL.z1 + 0.12, matWallB, mallG, false);
      for (let i = 0; i < 7; i++) { const t = box(2.4, 0.04, 0.12, -12 + i * 4, MALL.H - 0.02, mz, matTube, mallG, false); t.castShadow = false; }
      // the neighbours across the corridor (facing -z) and on our side (facing +z)
      const kinds = ['travel', 'grocery', 'food', 'massage', 'gold', 'phone', 'shutter'];
      for (let i = 0; i < 7; i++) {
        const xx = MALL.x0 + 2 + i * 4;
        plane(3.9, 2.95, texMat(makeShopfront(THREE, cnv, kinds[i]), { roughness: 0.4, emissive: 0xffffff, emissiveIntensity: 0.18 }), xx, 1.48, MALL.z1 - 0.01, Math.PI, mallG);
        box(0.12, MALL.H, 0.2, xx + 1.98, MALL.H / 2, MALL.z1 + 0.05, matWallB, mallG, false);
      }
      for (const m of mallG.children) if (m.material && m.material.map && m.material.emissiveIntensity === 0.18) m.material.emissiveMap = m.material.map;
      for (const [xx, k] of [[-11.5, 'phone'], [-7.5, 'grocery'], [7.5, 'gold'], [11.5, 'shutter']]) {
        const mt = texMat(makeShopfront(THREE, cnv, k), { roughness: 0.4, emissive: 0xffffff, emissiveIntensity: 0.18 }); mt.emissiveMap = mt.map;
        plane(3.9, 2.95, mt, xx, 1.48, MALL.z0 - 0.02, 0, mallG);
      }
      box(SHOP.x0 - MALL.x0, MALL.H, 0.2, (MALL.x0 + SHOP.x0) / 2, MALL.H / 2, -0.14, matWallB, mallG, false);
      box(MALL.x1 - SHOP.x1, MALL.H, 0.2, (MALL.x1 + SHOP.x1) / 2, MALL.H / 2, -0.14, matWallB, mallG, false);
      box(SHOP.x1 - SHOP.x0, MALL.H - SHOP.H, 0.2, 0, SHOP.H + (MALL.H - SHOP.H) / 2, 0.04, matWallB, mallG, false);
      for (const s of [-1, 1]) box(0.2, MALL.H, D + 0.4, s * MALL.x1, MALL.H / 2, mz, matWallB, mallG, false);
      // the shop's own lightbox over its front
      const lbM = new THREE.MeshBasicMaterial({ map: tex(makeLightbox(THREE, cnv)) });
      plane(4.2, 0.6, lbM, 0, SHOP.H + 0.36, 0.15, 0, mallG);
      // two columns clad in small tiles
      for (const s of [-1, 1]) box(0.6, MALL.H, 0.6, s * 7.0, MALL.H / 2, 3.2, new THREE.MeshStandardMaterial({ color: 0xcfc6b4, roughness: 0.6 }), mallG);
      /* (v21.2: the HAPPY VESAK DAY banner that hung across the corridor is gone — Buddha Day is an uposatha day) */
    }

    /* ============================================== THE PEOPLE
       Stand-ins until Chad's models land (docs/V21.0-E3C3-PLAN.md §3, each a
       one-line swap). One parse per asset, every rig a clone. A STANDING rig
       is sized on its own idle (the v5.05 law); a SEATED one on its seated
       take, its plastic stool then put under its measured hips (the seat is
       ours, the hip height is the take's); a KNEELING one sized on its bind
       pose and grounded on its posed skin (e3c2's congregation). Culling
       spheres from the posed skin (v18.5 / v19.1). */
    const _v = new THREE.Vector3(), _cv = new THREE.Vector3(), _cm = new THREE.Matrix4();
    function skinCull(r, pad = 1.35, minR = 0) {
      if (!r.model) return;
      r.model.updateMatrixWorld(true);
      const bb = new THREE.Box3();
      r.model.traverse(o => {
        if (!o.isSkinnedMesh) return;
        o.skeleton.update();
        const n = o.geometry.attributes.position.count, step = Math.max(1, Math.floor(n / 4000));
        for (let i = 0; i < n; i += step) { o.getVertexPosition(i, _cv); _cv.applyMatrix4(o.matrixWorld); bb.expandByPoint(_cv); }
      });
      if (bb.isEmpty()) return;
      const sph = bb.getBoundingSphere(new THREE.Sphere()), R = Math.max(sph.radius * pad, minR);
      r.model.traverse(o => {
        if (!o.isSkinnedMesh) return;
        o.frustumCulled = true;
        _cm.copy(o.matrixWorld).invert();
        const k = o.matrixWorld.getMaxScaleOnAxis() || 1;
        o.boundingSphere = new THREE.Sphere(sph.center.clone().applyMatrix4(_cm), R / k);
      });
      r.culled = true;
    }
    function lowestBone(g) {
      let lo = Infinity;
      g.traverse(o => { if (o.isBone) { o.getWorldPosition(_v); lo = Math.min(lo, _v.y); } });
      return lo;
    }
    function skinLow(g) {
      let lo = Infinity;
      g.updateMatrixWorld(true);
      g.traverse(o => {
        if (!o.isSkinnedMesh) return;
        o.skeleton.update();
        const n = o.geometry.attributes.position.count;
        for (let i = 0; i < n; i += 5) { o.getVertexPosition(i, _cv); _cv.applyMatrix4(o.matrixWorld); if (_cv.y < lo) lo = _cv.y; }
      });
      return lo;
    }
    /* a red or blue plastic stool, its top at `top` (group-local) */
    function plasticStool(parent, x, z, top, color) {
      const g = new THREE.Group(); g.position.set(x, 0, z); parent.add(g);
      const m = new THREE.MeshStandardMaterial({ color, roughness: 0.45 });
      owned.push({ dispose: () => m.dispose() });
      cyl(0.17, 0.15, 0.03, 0, top - 0.015, 0, m, 20, g);
      for (let i = 0; i < 4; i++) { const a = i / 4 * Math.PI * 2 + Math.PI / 4;
        const l = cyl(0.018, 0.024, top - 0.03, Math.cos(a) * 0.13, (top - 0.03) / 2, Math.sin(a) * 0.13, m, 6, g);
        l.rotation.z = Math.cos(a) * 0.08; l.rotation.x = -Math.sin(a) * 0.08; }
      return g;
    }
    const rigs = [];
    function mkRig(key, opts) {
      const parent = opts.parent || shopG;
      const group = new THREE.Group();
      group.position.set(opts.x, opts.y || 0, opts.z); group.rotation.y = opts.ry || 0;
      parent.add(group);
      const ph = opts.seated ? 1.1 : opts.kneel ? 0.95 : opts.height;
      const proxy = new THREE.Mesh(new THREE.CapsuleGeometry(0.2, Math.max(0.1, ph - 0.4), 4, 8), matProxy);
      proxy.position.y = ph / 2 + 0.05; proxy.castShadow = !LOW; group.add(proxy);
      const rig = { key, group, proxy, model: null, mixer: null, acts: null, cur: null, head: null, hips: null,
                    ready: false, height: opts.height, idle: opts.idle || null, floor: opts.y || 0,
                    headWrote: null, nod: 0, nodT: 0, nodW: 0, lookYaw: 0, lookPitch: 0, look: opts.look || 0, lookK: 0,
                    talkUntil: 0, stool: null, opts };
      rig.play = (name, ts = 1, fade = 0.34, once = false, at) => {
        if (!rig.mixer || !rig.acts || !rig.acts[name]) return false;
        /* asked to RUN the take already current: it runs. A take parked by
           the sizing (or by an earlier `at`) is paused, and keeping that
           pause left the owner's staff, the shrine's wife and father and
           the auntie's prayer standing as statues (the v21.0 review) */
        if (rig.cur === name && at === undefined && rig.acts[name].isScheduled()) {
          const a = rig.acts[name]; a.paused = false; a.setEffectiveTimeScale(ts); return true; }
        /* (a split talk still on — splitPlay — goes with whatever is asked for next) */
        if (rig.splitOn && rig.splitOn.size) { for (const k of rig.splitOn) if (k !== name && rig.acts[k]) rig.acts[k].fadeOut(fade > 0 ? fade : 0.01); rig.splitOn.clear(); }
        const nx = rig.acts[name], old = rig.cur && rig.cur !== name && rig.acts[rig.cur];
        nx.reset(); nx.setEffectiveTimeScale(ts); nx.setEffectiveWeight(1);
        nx.setLoop(once ? THREE.LoopOnce : THREE.LoopRepeat, Infinity);
        nx.clampWhenFinished = once;
        /* (an update here runs outside peopleTick's head/spine/arm bracket: the take's new pose is written, the next
           frame's pre-pass then put back LAST frame's capture, and a parked take — whose values no longer change —
           was never written again: the youth's head stayed 33° wrong for 21 s of the trance film. So the bracket is
           kept here too — the v11.5 law from the other side, the v21.1 review) */
        const mixNow = (dt) => { headPre(rig); spinePre(rig); armsPre(rig); rig.mixer.update(dt); recapture(rig); };
        if (at !== undefined) {
          nx.play(); nx.time = nx.getClip().duration * at; nx.paused = true;
          for (const a of Object.values(rig.acts)) if (a !== nx) a.stop();
          mixNow(0);
        } else if (fade > 0) {
          nx.paused = false; nx.fadeIn(fade).play();
          if (old) old.fadeOut(fade);
        } else {
          nx.paused = false; nx.play();
          for (const a of Object.values(rig.acts)) if (a !== nx) a.stop();
          mixNow(0.0001);
        }
        rig.cur = name;
        return true;
      };
      parseOnce(key).then((gltf) => {
        if (!alive) return;
        const g = cloneSkinned(gltf.scene);
        g.traverse(o => { if (o.isMesh) { o.castShadow = !LOW; o.receiveShadow = false; } });
        group.add(g); rig.model = g;
        g.traverse(o => {
          if (!o.isBone) return;
          if (HEAD_RE.test(o.name) && !rig.head) rig.head = o;
          if (/Hips(_\d+)?$/.test(o.name) && !rig.hips) rig.hips = o;
          if (/RightHand(_\d+)?$/.test(o.name) && !rig.handR) rig.handR = o;
          if (/LeftHand(_\d+)?$/.test(o.name) && !rig.handL) rig.handL = o;
        });
        /* the spine by HIERARCHY, lowest first (e3c2's v19.2: by name the
           Meshy rigs give their chest the bow's big share) */
        { const s0 = rig.hips && rig.hips.children.find(ch => ch.isBone && /spine/i.test(ch.name));
          const s1 = s0 && s0.children.find(ch => ch.isBone && /spine/i.test(ch.name));
          rig.spine = [s0, s1].filter(Boolean); }
        if (gltf.animations && gltf.animations.length) {
          rig.mixer = new THREE.AnimationMixer(g);
          rig.acts = {};
          for (const clip of gltf.animations) rig.acts[clip.name] = rig.mixer.clipAction(clip);
          owned.push({ dispose: () => rig.mixer && rig.mixer.stopAllAction() });
          /* takes from other files, bound by bone name (e3c1's v17.4; a list here) */
          for (const ak of [].concat(opts.anims || [])) parseOnce(ak).then(a => {
            if (!alive || !rig.mixer) return;
            for (const clip of a.animations || []) if (!rig.acts[clip.name]) rig.acts[clip.name] = rig.mixer.clipAction(clip);
          }).catch(err => { console.warn(ak + ' failed to load', err); ctx.loadFail && ctx.loadFail(ak, err); });
        }
        // size: on the bind pose (a kneeler), else on its own take
        const sizeOn = opts.kneel ? null : (opts.sizeOn || opts.idle);
        if (sizeOn && rig.acts && rig.acts[sizeOn]) { rig.play(sizeOn, 1, 0, false, opts.sizeAt ?? opts.at ?? 0); rig.mixer.update(0.001); }
        g.updateMatrixWorld(true);
        let lo = Infinity, hi = -Infinity, crown = false;
        g.traverse(o => {
          if (!o.isBone) return;
          o.getWorldPosition(_v); lo = Math.min(lo, _v.y); hi = Math.max(hi, _v.y);
          if (/HeadTop_End|head_end/.test(o.name)) crown = true;
        });
        if (isFinite(lo) && hi > lo) {
          const span = (hi - lo) / (crown ? 1 : 0.935);
          g.scale.multiplyScalar(opts.height / span); g.updateMatrixWorld(true);
        }
        if (rig.acts && opts.idle && rig.acts[opts.idle]) {
          if (opts.at !== undefined) rig.play(opts.idle, 1, 0, false, opts.at);
          else rig.play(opts.idle, opts.rate || 1, 0);
          rig.mixer.update(0.0001);
        }
        g.updateMatrixWorld(true);
        if (opts.kneel) {
          const sl = skinLow(g);
          if (isFinite(sl)) g.position.y += group.position.y - 0.004 - sl;
        } else {
          const lb = lowestBone(g);
          if (isFinite(lb)) g.position.y += group.position.y - lb + (opts.footLift ?? 0.02);
        }
        g.updateMatrixWorld(true);
        rig.baseY = g.position.y; rig.yOff = 0; rig.yTo = 0;
        if (opts.seated && rig.hips) {
          rig.hips.getWorldPosition(_v);
          const local = group.worldToLocal(_v.clone());
          rig.stool = plasticStool(group, local.x, local.z - 0.02, Math.max(0.3, local.y - 0.1), opts.stool || 0xc8261c);
        }
        if (opts.then) opts.then(rig);
        g.updateMatrixWorld(true);
        skinCull(rig, 1.35, (opts.height || 1.7) * 0.8);
        proxy.visible = false; rig.ready = true; redoShadows();
      }).catch(err => { console.warn(key + ' failed to load', err); ctx.loadFail && ctx.loadFail(key, err); rig.ready = true; });
      rigs.push(rig);
      return rig;
    }
    /* THE HEAD (e3c1's law): put back what the mixer last wrote before it
       runs again, so a turn never stacks on the frame a take holds still */
    const _q = new THREE.Quaternion(), _e = new THREE.Euler(), _hp = new THREE.Vector3(), _cp = new THREE.Vector3();
    function headPre(rig) { if (rig.head && rig.headWrote) rig.head.quaternion.copy(rig.headWrote); }
    /* what a take wrote OUTSIDE peopleTick is what the next frame's pre-pass puts back (rig.play, seatMedium) */
    function recapture(r) {
      if (r.head && r.headWrote) r.headWrote.copy(r.head.quaternion);
      if (r.spine && r.spineWrote) r.spine.forEach((b, i) => r.spineWrote[i].copy(b.quaternion));
      if (r.armBones && r.armWrote) r.armBones.forEach((b, i) => r.armWrote[i].copy(b.quaternion));
    }
    function headPost(rig, wdt) {
      if (!rig.head) return;
      if (!rig.headWrote) rig.headWrote = new THREE.Quaternion();
      rig.headWrote.copy(rig.head.quaternion);
      // the look: toward the lens, within a neck's reach, eased
      let ty = 0, tp = 0;
      if (rig.look > 0 && rig.group.visible) {
        rig.head.getWorldPosition(_hp);
        if (rig.lookAt) _cp.set(rig.lookAt.x, rig.lookAt.y, rig.lookAt.z); else camera.getWorldPosition(_cp);
        const dx = _cp.x - _hp.x, dz = _cp.z - _hp.z, dy = _cp.y - _hp.y;
        const fwd = rig.group.rotation.y, a = Math.atan2(dx, dz) - fwd;
        const yawTo = Math.atan2(Math.sin(a), Math.cos(a));
        if (Math.abs(yawTo) < 1.6 && Math.hypot(dx, dz) < 7) { ty = THREE.MathUtils.clamp(yawTo, -1.0, 1.0); tp = THREE.MathUtils.clamp(-Math.atan2(dy, Math.hypot(dx, dz)), -0.4, 0.35); }
      }
      const k = 1 - Math.exp(-wdt * 3.0);
      rig.lookYaw += (ty * rig.look - rig.lookYaw) * k; rig.lookPitch += (tp * rig.look - rig.lookPitch) * k;
      rig.nodT += wdt;
      const target = rig.nod > 0 ? 1 : 0;
      rig.nodW += (target - rig.nodW) * (1 - Math.exp(-wdt * 5));
      if (rig.nod > 0) rig.nod = Math.max(0, rig.nod - wdt);
      const dip = rig.nodW * (0.06 * Math.sin(rig.nodT * 4.2) + 0.04 * Math.sin(rig.nodT * 1.7 + 1));
      if (Math.abs(dip) + Math.abs(rig.lookYaw) + Math.abs(rig.lookPitch) < 1e-4) return;
      _e.set(dip + rig.lookPitch, rig.lookYaw, 0, 'YXZ');
      _q.setFromEuler(_e);
      rig.head.quaternion.multiply(_q);
    }
    /* a line said with the talking take under it, then back to rest — on
       WALL time, so a line said under a splash ends when its words do; a man
       sitting (or walking) only nods, since the talking take stands him up */
    function talk(rig, secs, take = 'Talk_with_Hands_Open') {
      if (!rig) return;
      if (rig.sitting || rig.path || !rig.acts || !rig.acts[take]) { rig.nod = secs; return; }
      if (rig.opts.splitTalk && rig.acts[rig.idle]) {               // made when first asked: the talk's file lands after the model
        if (!rig.acts[take + '^up']) splitTake(rig, take, false, '^up');
        if (!rig.acts[rig.idle + '^low']) splitTake(rig, rig.idle, true, '^low');
      }
      if (rig.acts[take + '^up'] && rig.acts[rig.idle + '^low']) splitPlay(rig, take, 0.3);
      else rig.play(take, 1, 0.3);
      rig.talkUntil = performance.now() / 1000 + secs;
    }
    /* v21.1: a talking take on a SEATED body, under its own legs — the
       medium's ^up/^low split given to anyone who carries it. The wife talks
       on the monk's seated take retargeted onto her, and that take uncrosses
       her legs and puts both toes 11–12 cm through the tiles for her whole
       line (FK over the shipped files): her legs stay on her own sitting
       take, the talk is laid over her upper body only. The legs' tracks hand
       over to themselves (the idle and its ^low in step), so they never move. */
    function splitPlay(r, name, fade) {
      const on = r.splitOn || (r.splitOn = new Set());
      const idle = r.acts[r.idle];
      const want = name === r.idle ? [r.idle] : [r.idle + '^low', name + '^up'];
      const sync = on.has(r.idle + '^low') ? r.acts[r.idle + '^low'].time : (idle && idle.isRunning() ? idle.time : 0);
      if (r.cur && !on.has(r.cur) && !want.includes(r.cur) && r.acts[r.cur]) r.acts[r.cur].fadeOut(fade);
      for (const k of [...on]) if (!want.includes(k)) { r.acts[k].fadeOut(fade); on.delete(k); }
      for (const k of want) {
        const a = r.acts[k]; if (!a || on.has(k)) continue;
        a.reset(); a.setEffectiveTimeScale(1); a.setEffectiveWeight(1);
        if (k === r.idle || k === r.idle + '^low') a.time = sync;
        a.play(); if (fade > 0) a.fadeIn(fade);
        on.add(k);
      }
      if (name === r.idle) on.clear();
      r.cur = name === r.idle ? r.idle : name + '^up';
    }
    let shadowAt = 0;
    function peopleTick(wdt) {
      const now = performance.now() / 1000;
      let moving = false;
      const inB = shrPeople.visible;
      for (const r of rigs) {
        if (!r.group.visible || (r.opts.parent === shrPeople) !== inB) continue;
        if (r.path) { walkTick(r, wdt); moving = true; }
        rigTurn(r, wdt);
        if (r.model && r.baseY !== undefined && r.yOff !== r.yTo) {
          r.yOff += (r.yTo - r.yOff) * (1 - Math.exp(-wdt * 5));
          if (Math.abs(r.yTo - r.yOff) < 0.002) r.yOff = r.yTo;
          r.model.position.y = r.baseY + r.yOff;
        }
        if (!r.mixer) continue;
        if (r.talkUntil && now > r.talkUntil) { r.talkUntil = 0; if (r.idle && !r.path) { if (r.splitOn && r.splitOn.size) splitPlay(r, r.idle, 0.4); else r.play(r.idle, r.opts.rate || 1, 0.4); } }
        if (r === medium) medRestTick(wdt);
        headPre(r); spinePre(r); armsPre(r); recoilPre(r);
        r.mixer.update(wdt);
        if (r.rootOff) rootComp(r);
        spinePost(r); armsPost(r); recoilPost(r); headPost(r, wdt);
        if (r.bow > 0.001 || r.recoil > 0.001) moving = true;
      }
      if (inB) toolsTick();                       // the sword and the bell, after his take has posed his hands
      if (!inB) { passerTick(wdt); phoneTick(); monkTick(wdt); }
      /* the shadow maps are drawn on demand (v2.x): while someone walks or
         bows, a few times a second (e3c2's v18.5), desktop only */
      if (!LOW && moving && now - shadowAt > 0.25) { shadowAt = now; redoShadows(); }
    }
    /* THE BOW (the krap) on a kneeler: about the rig's own right axis, laid
       on what the take wrote and put back before it writes again (the v11.5
       law — a take that holds still is not rewritten, and a bow would stack) */
    const _ax = new THREE.Vector3(), _ax2 = new THREE.Vector3(), _q2 = new THREE.Quaternion(), _q3 = new THREE.Quaternion();
    /* THE STAND-INS' SHOULDERS: the owner and the staff man play takes
       retargeted onto them from another rig, and those carry the source's
       shoulders a little shrugged and its arms ~14° out (measured: upper arm
       13.9° / 14.7° off the body's down) — a mannequin at the counter. Each
       shoulder and upper arm is turned toward the body's down by a few degrees
       after the mixer (and put back before it runs again, the v11.5 law),
       weighted off whenever the scan's OWN seated take is playing. */
    const _amA = new THREE.Vector3(), _amB = new THREE.Vector3(), _amD = new THREE.Vector3(), _amQ = new THREE.Quaternion(), _amP = new THREE.Quaternion();
    function armsPre(r) { if (r.armWrote) r.armBones.forEach((b, i) => b.quaternion.copy(r.armWrote[i])); }
    function armsPost(r) {
      const F = r.opts.armFix; if (!F || !r.model || !r.hips || !r.acts) return;
      if (!r.armBones) {
        const find = (re) => { let o = null; r.model.traverse(b => { if (!o && b.isBone && re.test(b.name)) o = b; }); return o; };
        r.armBones = [find(/LeftShoulder(_\d+)?$/), find(/RightShoulder(_\d+)?$/), find(/LeftArm(_\d+)?$/), find(/RightArm(_\d+)?$/)];
        r.armNeck = find(/Neck(_\d+)?$/);
        if (r.armBones.some(b => !b) || !r.armNeck) { r.opts.armFix = null; r.armBones = null; return; }
        r.armWrote = r.armBones.map(b => b.quaternion.clone());
      }
      r.armBones.forEach((b, i) => r.armWrote[i].copy(b.quaternion));
      const own = r.acts[SIT_W], w = 1 - (own && own.isScheduled() ? own.getEffectiveWeight() : 0);
      if (w < 0.01) return;
      r.model.updateMatrixWorld(true);
      r.hips.getWorldPosition(_amA); r.armNeck.getWorldPosition(_amB); _amD.subVectors(_amA, _amB).normalize();   // the body's own down
      r.armBones.forEach((b, i) => {
        const ch = b.children.find(c => c.isBone); if (!ch) return;
        b.getWorldPosition(_amA); ch.getWorldPosition(_amB);
        _amB.sub(_amA).normalize(); _amA.crossVectors(_amB, _amD);
        if (_amA.lengthSq() < 1e-8) return;
        _amA.normalize(); b.parent.getWorldQuaternion(_amP); _amA.applyQuaternion(_amP.invert());
        b.quaternion.premultiply(_amQ.setFromAxisAngle(_amA, THREE.MathUtils.degToRad(i < 2 ? F.sh : F.arm) * w));
        b.updateMatrixWorld(true);
      });
    }
    function spinePre(r) { if (r.spineWrote && r.spine) r.spine.forEach((b, i) => b.quaternion.copy(r.spineWrote[i])); }
    /* v21.8 · TAKEN ABACK (Chad: "The medium upon seeing it, should appear shocked and taken aback, before he stands
       up to respond with his deity tongue"): none of his takes starts, so it is laid on after the mixer and put back
       before it writes again (the v11.5 law) — the trunk thrown back (spinePost, his `recoil`), and both upper arms
       swung up before him with the forearms bent up, palms out: each bone turned, by `recoil`, from where the take
       has it toward where a startled man's goes, measured in the world (his forward and his left from his facing) */
    const _rcA = new THREE.Vector3(), _rcB = new THREE.Vector3(), _rcT = new THREE.Vector3(), _rcQ = new THREE.Quaternion(),
          _rcP = new THREE.Quaternion(), _rcL = new THREE.Quaternion(), _rcI = new THREE.Quaternion();
    function recoilPre(r) { if (r.rcWrote) r.rcBones.forEach((b, i) => b.quaternion.copy(r.rcWrote[i])); }
    function recoilPost(r) {
      if (!r.model || (!r.rcBones && !(r.recoil > 0.001))) return;
      if (!r.rcBones) {
        const find = (re) => { let o = null; r.model.traverse(b => { if (!o && b.isBone && re.test(b.name)) o = b; }); return o; };
        r.rcBones = [find(/LeftArm(_\d+)?$/), find(/RightArm(_\d+)?$/), find(/LeftForeArm(_\d+)?$/), find(/RightForeArm(_\d+)?$/)];
        if (r.rcBones.some(b => !b)) r.rcBones = [];
        r.rcWrote = r.rcBones.map(b => b.quaternion.clone());
      }
      r.rcBones.forEach((b, i) => r.rcWrote[i].copy(b.quaternion));
      const w = r.recoil || 0; if (w < 0.001 || !r.rcBones.length) return;
      const ry = r.group.rotation.y, fx = Math.sin(ry), fz = Math.cos(ry);   // his forward; his left is (fz, 0, -fx)
      r.model.updateMatrixWorld(true);
      r.rcBones.forEach((b, i) => {
        const ch = b.children.find(c => c.isBone); if (!ch) return;
        const side = i % 2 ? -1 : 1, out = i < 2 ? 0.45 : 0.12, fwd = i < 2 ? 0.75 : 0.3, up = i < 2 ? 0.62 : 0.95;
        _rcT.set(fz * side * out + fx * fwd, up, -fx * side * out + fz * fwd).normalize();
        b.getWorldPosition(_rcA); ch.getWorldPosition(_rcB); _rcB.sub(_rcA).normalize();
        _rcQ.setFromUnitVectors(_rcB, _rcT).slerp(_rcI, 1 - w);
        b.parent.getWorldQuaternion(_rcP);
        _rcL.copy(_rcP).invert().multiply(_rcQ).multiply(_rcP);
        b.quaternion.premultiply(_rcL);
        b.updateMatrixWorld(true);
      });
    }
    function spinePost(r) {
      if (!r.spine || !r.spine.length) return;
      if (!r.spineWrote) r.spineWrote = r.spine.map(b => b.quaternion.clone());
      else r.spine.forEach((b, i) => r.spineWrote[i].copy(b.quaternion));
      const bow = (r.bow || 0) - 0.42 * (r.recoil || 0);   // (v21.8: a recoil throws the trunk BACK — the medium, taken aback)
      if (Math.abs(bow) < 0.001) return;
      const ry = r.group.rotation.y;
      _ax.set(Math.cos(ry), 0, -Math.sin(ry));
      r.spine.forEach((b, i) => {
        b.parent.getWorldQuaternion(_q2);
        _ax2.copy(_ax).applyQuaternion(_q2.invert());
        b.quaternion.premultiply(_q3.setFromAxisAngle(_ax2, bow * (i === 0 ? 0.62 : 0.38)));
      });
    }
    /* WALKING THE CAST: a rig on a path, its walk take at the rate the ground
       covered asks for (v9.3 — the take's own speed, ~1.38 m/s for a 1.75 m
       man, so it never glides), the body turning toward where it goes on an
       ease (a corner is WALKED, v5.07); at the end it turns to `face` and
       `then` decides what it does. A path obeys no collision (v5.03): every
       one below is laid clear of the counters, the mats' people and the
       altar's bowls, and was walked in the photographs. */
    const WALK_NAT = 1.38 / 1.75;
    function walkTo(r, pts, o = {}) {
      if (!r) return;
      r.path = { pts: pts.map(q => ({ x: q.x, z: q.z })), i: 0, v: o.v || 0.95, face: o.face, then: o.then || null };
      r.talkUntil = 0; r.turnTo = null; r.look = 0;
      /* (a seated rig is sized on its seated span, and that span is not its standing height: the stride ran 16–36 %
         fast and the feet skated — standH is its height on its own walk, walkDy the walk's toes on the floor; FK over
         the shipped files, the v21.1 review) */
      if (r.acts && r.acts.Walking) r.play('Walking', (o.v || 0.95) / (WALK_NAT * (r.opts.standH || r.height || 1.7)), 0.35);
      if (r.opts.walkDy) r.yTo = r.opts.walkDy;
    }
    function walkTick(r, wdt) {
      const P = r.path, g = r.group, tgt = P.pts[P.i];
      const dx = tgt.x - g.position.x, dz = tgt.z - g.position.z, d = Math.hypot(dx, dz), step = P.v * wdt;
      if (d <= step) {
        g.position.x = tgt.x; g.position.z = tgt.z;
        if (++P.i < P.pts.length) return;
        r.path = null;
        if (P.face !== undefined) r.turnTo = P.face;
        if (P.then) P.then(r);
        else if (r.idle && r.acts && r.acts[r.idle]) r.play(r.idle, r.opts.rate || 1, 0.4);
        if (!r.path && r.cur === 'Walking' && r.idle && r.acts && r.acts[r.idle]) r.play(r.idle, r.opts.rate || 1, 0.4);
        return;
      }
      g.position.x += dx / d * step; g.position.z += dz / d * step;
      let a = Math.atan2(dx, dz) - g.rotation.y; a = Math.atan2(Math.sin(a), Math.cos(a));
      g.rotation.y += a * (1 - Math.exp(-wdt * 6));
    }
    function rigTurn(r, wdt) {
      if (r.turnTo === undefined || r.turnTo === null) return;
      let a = r.turnTo - r.group.rotation.y; a = Math.atan2(Math.sin(a), Math.cos(a));
      if (Math.abs(a) < 0.004) { r.group.rotation.y = r.turnTo; r.turnTo = null; return; }
      r.group.rotation.y += a * (1 - Math.exp(-wdt * 4));
    }
    /* where a seated take puts a man's hips, in his own group's frame (so a
       stool can be built under them wherever he sits — the v17.1 seat law:
       the seat is ours, the hip height is the take's) */
    function measureSeat(r, take, at) {
      if (!r.acts || !r.acts[take] || !r.hips) return null;
      const keep = r.cur;
      r.play(take, 1, 0, false, at);
      r.group.updateMatrixWorld(true);
      r.hips.getWorldPosition(_v);
      const out = r.group.worldToLocal(_v.clone());
      /* and how far its feet hang above the floor: a seated take that keeps
         the hips at standing height sits a man in the air, so his soles are
         put on the floor (the v17.1 law) and the seat goes under him there */
      const lb = lowestBone(r.model);
      out.drop = isFinite(lb) ? Math.max(0, lb - r.group.position.y - 0.02) : 0;
      if (keep && r.acts[keep]) { r.play(keep, r.opts.rate || 1, 0); r.mixer.update(0.0001); }
      return out;
    }
    /* THE GLOW ON THE FLOOR where he is to kneel (e3c2's zone, in gold).
       On this WHITE tile an additive gold sums to white (the v8.8 law), so
       the hue is a normal-blended tint and the glow a faint additive layer
       over it (the first photographs showed a white ring) */
    function mkZone(x, z, parent = shopG) {
      const g = new THREE.Group(); g.position.set(x, 0.02, z); g.visible = false; parent.add(g);
      const disc = new THREE.Mesh(new THREE.CircleGeometry(0.5, 32),
        new THREE.MeshBasicMaterial({ color: 0xd99a1a, transparent: true, opacity: 0.3, depthWrite: false, fog: false }));
      disc.rotation.x = -Math.PI / 2; g.add(disc);
      const ring = new THREE.Mesh(new THREE.RingGeometry(0.46, 0.54, 40),
        new THREE.MeshBasicMaterial({ color: 0xc07a08, transparent: true, opacity: 0.85, depthWrite: false, fog: false, side: THREE.DoubleSide }));
      ring.rotation.x = -Math.PI / 2; ring.position.y = 0.004; g.add(ring);
      const glow = new THREE.Mesh(new THREE.RingGeometry(0.42, 0.6, 40),
        new THREE.MeshBasicMaterial({ color: 0xffc860, transparent: true, opacity: 0.3, depthWrite: false, fog: false,
                                      blending: THREE.AdditiveBlending, side: THREE.DoubleSide }));
      glow.rotation.x = -Math.PI / 2; glow.position.y = 0.005; g.add(glow);
      const wave = new THREE.Mesh(new THREE.RingGeometry(0.48, 0.54, 40), ring.material.clone());
      wave.rotation.x = -Math.PI / 2; wave.position.y = 0.006; wave.userData.moves = true; g.add(wave);
      g.userData = { disc, ring, wave, glow };
      return g;
    }
    function zoneTick(g, t) {
      if (!g.visible) return;
      const { disc, ring, wave } = g.userData;
      const k = (t % 2.0) / 2.0;
      wave.scale.setScalar(1 + k * 0.9); wave.material.opacity = 0.75 * (1 - k);
      ring.material.opacity = 0.7 + 0.2 * Math.sin(t * 3.1);
      disc.material.opacity = 0.24 + 0.08 * Math.sin(t * 3.1);
      if (g.userData.glow) g.userData.glow.material.opacity = 0.22 + 0.12 * Math.sin(t * 3.1);
    }
    const zone = mkZone(MAT.x, MAT.z);
    /* THE GIRL'S PHONE, raised to film him: held up in front of her joined
       hands, its back (the lens) turned to him and its lit screen to her —
       placed in the world every frame, so no bone's axes are guessed */
    const girlPhone = new THREE.Group(); girlPhone.visible = false; shopG.add(girlPhone);
    box(0.072, 0.15, 0.009, 0, 0, 0, matBlack, girlPhone, false);
    { const sc = new THREE.Mesh(new THREE.PlaneGeometry(0.064, 0.138), new THREE.MeshBasicMaterial({ color: 0xcfe8ff }));
      sc.position.z = -0.0052; sc.rotation.y = Math.PI; girlPhone.add(sc);
      const lens = new THREE.Mesh(new THREE.CircleGeometry(0.006, 12), new THREE.MeshBasicMaterial({ color: 0x222830 }));
      lens.position.set(-0.022, 0.058, 0.0052); girlPhone.add(lens);
      const rec = new THREE.Mesh(new THREE.CircleGeometry(0.003, 8), new THREE.MeshBasicMaterial({ color: 0xff3020 }));
      rec.position.set(-0.008, 0.058, 0.0052); girlPhone.add(rec); }
    const _ph = new THREE.Vector3(), _ph2 = new THREE.Vector3();
    function phoneTick() {
      if (!girlPhone.visible || !girl.handR || !girl.handL) return;
      girl.handR.getWorldPosition(_ph); girl.handL.getWorldPosition(_ph2);
      _ph.add(_ph2).multiplyScalar(0.5);
      camera.getWorldPosition(_cp);
      _ph2.copy(_cp).sub(_ph).setY(0).normalize();
      girlPhone.position.set(_ph.x + _ph2.x * 0.11, _ph.y + 0.07, _ph.z + _ph2.z * 0.11);   // (in front of her fingers: 0.16 up it floated over her joined hands — VT-10)
      girlPhone.lookAt(_cp.x, girlPhone.position.y, _cp.z);
      girlPhone.rotateY(0.42);                          // a little edge-on, so the lit screen shows
    }
    let passerHeld = false, danceHalt = false;

    /* THE SHOP'S PEOPLE, before the chant */
    const SIT_W = 'mixamo.com', SHOUT = 'Armature|Sit_Shout_Hands_on_Mouth|baselayer';
    let ownerStool = null;
    const owner  = mkRig('owner', { x: OWN.x, z: OWN.z, ry: -Math.PI / 2, height: 1.66, idle: 'Idle_9', look: 1, armFix: { sh: 6, arm: 7 },
      then: (r) => {
        const hl = measureSeat(r, SIT_W, 0.05);
        if (!hl) return;
        /* his own seated take's hips, carried to the stool's spot and turn */
        const c = Math.cos(OWN_SIT.ry), sn = Math.sin(OWN_SIT.ry);
        r.seatDrop = hl.drop;
        ownerStool = plasticStool(shopG, OWN_SIT.x + hl.x * c + hl.z * sn, OWN_SIT.z - hl.x * sn + hl.z * c, Math.max(0.3, hl.y - hl.drop - 0.1), 0xc8261c);
        ownerStool.visible = true;                 // (his stool is always there: it used to appear under him as he sat — GF-3)
        if (r.sitting) { r.yTo = r.yOff = -r.seatDrop; r.model.position.y = r.baseY + r.yOff; }
      } });
    const staff  = mkRig('staffman', { x: STAFF.x, z: STAFF.z, ry: Math.PI / 2, height: 1.73, idle: 'Idle_9', look: 0.6, armFix: { sh: 6, arm: 7 } });
    /* the girl's two takes root her ~22 cm apart (each retargeted from its own
       Mixamo file — e3c2's v19.7 finding), so her turn to him at the rise
       skated her across her mat on her knees: each take's knee midpoint is
       read once in her group's frame and rootComp moves the model by the
       weighted difference, the knees staying where the kneel put them */
    function kneelComp(r) {
      if (!r.acts || !r.acts.kneel || !r.acts.pray) return;
      const legs = [];
      r.model.traverse(o => { if (o.isBone && /(Left|Right)Leg(_\d+)?$/.test(o.name)) legs.push(o); });
      if (legs.length !== 2) return;
      const mid = () => {
        r.group.updateWorldMatrix(true, true);
        const m = new THREE.Vector3();
        for (const b of legs) m.add(r.group.worldToLocal(b.getWorldPosition(new THREE.Vector3())));
        return m.multiplyScalar(0.5);
      };
      r.play('pray', 1, 0, false, 0.5); const kp = mid();
      r.play('kneel', 1, 0, false, 0.5); const kk = mid();
      r.play('kneel', 1, 0);
      r.rootBase = { x: r.model.position.x, z: r.model.position.z };
      r.rootOff = { kneel: [0, 0], pray: [kp.x - kk.x, kp.z - kk.z] };
    }
    /* (on the front row's left mat: on the next one in she knelt exactly in his line to the Buddha — 21.3° against
       21.6° from his mat — and her head and back filled a phone's frame through the whole chant and every bow —
       GF-9, VP-3. From here his line passes between her and the man in white, a metre clear of each) */
    const GIRL_AT = { x: -1.6, z: FRONT };                // (v21.8: the front row is behind the monk now, 0.7 m back)
    const girl   = mkRig('cg_woman2hd', { x: GIRL_AT.x, z: GIRL_AT.z, ry: Math.PI, height: 1.6, idle: 'kneel', kneel: true, then: kneelComp });
    const manW   = mkRig('cg_man2hd', { x: 0.55, z: FRONT, ry: Math.PI, height: 1.72, idle: 'pray', kneel: true });
    const auntie = mkRig('sitclap', { x: -2.45, z: -4.85, ry: Math.PI * 0.82, height: 1.22, idle: SIT_W, at: 0.0, sizeAt: 0.15, seated: true, stool: 0xc8261c });   // parked with her hands in her lap: the take's every palms-together frame is at or over her head, wrists crossed (FK, VT-8/VF-10a); sized on the frame she always was, so she stands no bigger
    const youth  = mkRig('sitshout', { x: 2.42, z: -4.85, ry: -Math.PI * 0.82, height: 1.27, idle: SHOUT, at: 0.0, seated: true, stool: 0x2a64b4 });
    /* (built at PASS.z 2.35: at 2.9 a Continue mid-run walked him through the mall's two columns — GF-5) */
    const passer = mkRig('botak', { parent: mallG, x: -10, z: 2.35, ry: Math.PI / 2, height: 1.72, idle: 'Walking',
      then: (r) => r.model.traverse(o => { if (o.isMesh) o.castShadow = false; }) });   // a walker's shadow would redraw the maps forever
    /* v21.8 · THE MONK WHO LEADS THE CHANT (Chad: "Add a monk to the front
       of the altar area, the monk should be in the same praying position used
       in ep 3 chp 2. The monk should lead the chanting with his own
       voiceline, when the chanting starts"; and his pick: FACING THE ALTAR,
       his back to the room). Chad's monk at full detail (e3c1's file, the
       same rig and the same take as e3c2's row), sitting cross-legged on his
       own Sit_Cross_Legged_on_Floor parked on one frame, grounded on the SEAT
       (the skin his hips carry, e3c2's v19.2) on a saffron cushion, and his
       hands brought into añjali by e3c2's v20.0 solve — each palm measured
       off his own skin, turned on the hand's long axis to face the other, the
       wrists as far apart as the two palms are thick — so the palms press
       together exactly as the monks' in the ordination hall. No mixer runs
       after that: the pose is the bones' own locals, and his breath, the
       nod of his head with each phrase of the chant, his bows and a turn of
       the head are laid on it ABSOLUTELY, from the rest it was left in
       (never stacked on last frame's — the v11.5 law). */
    const monk = { group: null, model: null, bones: [], head: null, neck: null, spine: [], rest: null,
                   bow: 0, chantT0: -1, look: 0, lookK: 0, ready: false };
    const _mq = new THREE.Quaternion(), _mq2 = new THREE.Quaternion(), _mv = new THREE.Vector3(), _mv2 = new THREE.Vector3(), _mAx = new THREE.Vector3();
    const MONK_H = 1.70, MONK_TAKE = 'Sit_Cross_Legged_on_Floor', CUSH_TOP = 0.05, MPALM_GAP = 0.002;
    const mBone = (re) => monk.bones.find(b => re.test(b.name)) || null;
    // turn a bone so that a world direction `from` (its child, now) becomes `to` (e3c2's aimBone)
    function mAim(bone, from, to) {
      _mq.setFromUnitVectors(from, to);
      bone.getWorldQuaternion(_mq2); _mq2.premultiply(_mq);
      const pq = bone.parent ? bone.parent.getWorldQuaternion(new THREE.Quaternion()) : new THREE.Quaternion();
      bone.quaternion.copy(pq.invert().multiply(_mq2));
    }
    /* a hand's own palm, in the hand bone's frame (e3c2's palmOf: the knuckles' line by the widest spread across the
       finger axis, the palm's side by the thumb's skew and the handedness — checked there against the scan's A-pose) */
    function mPalmOf(hand, tip, S) {
      monk.model.updateMatrixWorld(true);
      const pts = [];
      monk.model.traverse(o => {
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
    function mPalmTo(hand, pl, inward) {
      const hq = hand.getWorldQuaternion(new THREE.Quaternion());
      const F = pl.f.clone().applyQuaternion(hq).normalize();
      const N = pl.palm.clone().applyQuaternion(hq), T = inward.clone();
      N.addScaledVector(F, -N.dot(F)); T.addScaledVector(F, -T.dot(F));
      if (N.lengthSq() < 1e-8 || T.lengthSq() < 1e-8) return;
      N.normalize(); T.normalize();
      const ang = Math.atan2(new THREE.Vector3().crossVectors(N, T).dot(F), N.dot(T));
      _mq.setFromAxisAngle(F, ang);
      hand.getWorldQuaternion(_mq2); _mq2.premultiply(_mq);
      const pq = hand.parent ? hand.parent.getWorldQuaternion(new THREE.Quaternion()) : new THREE.Quaternion();
      hand.quaternion.copy(pq.invert().multiply(_mq2));
    }
    function mPalmReach(hand, pl, inward) {
      hand.updateWorldMatrix(true, false);
      const wr = hand.getWorldPosition(new THREE.Vector3()), q = [];
      for (const pt of pl.pts) q.push(_mv.copy(pt).applyMatrix4(hand.matrixWorld).sub(wr).dot(inward));
      q.sort((x, y) => x - y);
      return Math.max(0.005, q[Math.floor(q.length * 0.97)] || 0);
    }
    /* AÑJALI by a two-bone solve, once, in world space (e3c2's prayArms, for a rig with its finger tip bones): each
       hand before the chest, the elbow falling down and out, the fingers up and a little forward, the palm turned to
       the other hand, and the arms solved a second time with the wrists exactly the palms' thickness apart */
    function monkPray() {
      const g = monk.model; g.updateMatrixWorld(true);
      const fwd = new THREE.Vector3(Math.sin(MONK.ry), 0, Math.cos(MONK.ry)), side = new THREE.Vector3(fwd.z, 0, -fwd.x), up = new THREE.Vector3(0, 1, 0);
      const chestB = mBone(/LeftShoulder(_\d+)?$/), chest = chestB && chestB.parent;
      if (!chest) return;
      const C = chest.getWorldPosition(new THREE.Vector3());
      for (const sd of [1, -1]) {
        const S = sd > 0 ? 'Left' : 'Right';
        const arm = mBone(new RegExp(S + 'Arm(_\\d+)?$')), fore = mBone(new RegExp(S + 'ForeArm(_\\d+)?$')), hand = mBone(new RegExp(S + 'Hand(_\\d+)?$'));
        if (!arm || !fore || !hand) continue;
        const tip = hand.children.find(ch => ch.isBone);
        const pl = mPalmOf(hand, tip, S), inward = side.clone().multiplyScalar(-sd);
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
          mAim(arm, el.clone().sub(sh).normalize(), elbow.clone().sub(sh).normalize());
          g.updateMatrixWorld(true);
          const el2 = fore.getWorldPosition(new THREE.Vector3()), wr2 = hand.getWorldPosition(new THREE.Vector3());
          const T1 = sh.clone().addScaledVector(dir, dl);
          mAim(fore, wr2.clone().sub(el2).normalize(), T1.clone().sub(el2).normalize());
          g.updateMatrixWorld(true);
          const el3 = fore.getWorldPosition(new THREE.Vector3()), wr3 = hand.getWorldPosition(new THREE.Vector3());
          const hdir = tip ? tip.getWorldPosition(new THREE.Vector3()).sub(wr3).normalize() : wr3.clone().sub(el3).normalize();
          mAim(hand, hdir, up.clone().multiplyScalar(0.92).addScaledVector(fwd, 0.25).addScaledVector(side, pl ? 0 : -sd * 0.12).normalize());
          g.updateMatrixWorld(true);
          if (pl) { mPalmTo(hand, pl, inward); g.updateMatrixWorld(true); }
        };
        solve(0.035);
        if (pl) solve(mPalmReach(hand, pl, inward) + MPALM_GAP);
      }
    }
    {
      const g0 = new THREE.Group(); g0.position.set(MONK.x, 0, MONK.z); g0.rotation.y = MONK.ry; shopG.add(g0); monk.group = g0;
      // his seat: a saffron cushion, a little forward of his hips, under the crossed legs (group-local +z is his front)
      const cushM = new THREE.MeshStandardMaterial({ color: 0xa65218, roughness: 0.93 });
      box(0.7, CUSH_TOP, 0.66, 0, CUSH_TOP / 2, 0.07, cushM, g0);
      box(0.72, 0.012, 0.68, 0, 0.006, 0.07, matGold, g0, false);
      const proxy = new THREE.Mesh(new THREE.CapsuleGeometry(0.22, 0.42, 4, 8), matProxy); proxy.position.y = 0.55; proxy.castShadow = !LOW; g0.add(proxy);
      solids.push(hidBox(0.95, 1.0, 0.78, MONK.x, 0.5, MONK.z - 0.07));      // nobody walks through the monk (world coords: his front is -z)
      /* (his scan at 0.28 — 50k of 179k, every take kept, tools/permcut.mjs: photographed side by side at 1.4 m the two
         faces are the same face, and the full one was 179k triangles in every view of the shop) */
      parseOnce('monkshop').then((gltf) => {
        if (!alive) return;
        const g = cloneSkinned(gltf.scene);
        g.traverse(o => { if (o.isBone) monk.bones.push(o); if (o.isMesh) { o.castShadow = !LOW; o.receiveShadow = false; } });
        g0.add(g); monk.model = g;
        // sized from the BIND pose (standing), e3c2's monks' height
        g.updateMatrixWorld(true);
        let lo = Infinity, hi = -Infinity;
        for (const b of monk.bones) { b.getWorldPosition(_mv); lo = Math.min(lo, _mv.y); hi = Math.max(hi, _mv.y); }
        const crown = monk.bones.some(b => /HeadTop_End|head_end/.test(b.name));
        if (isFinite(lo) && hi > lo) g.scale.multiplyScalar(MONK_H / ((hi - lo) / (crown ? 1 : 0.935)));
        // his own floor take, parked on one frame (no mixer runs after this)
        const clip = (gltf.animations || []).find(c => c.name === MONK_TAKE);
        if (clip) { const mixer = new THREE.AnimationMixer(g), act = mixer.clipAction(clip);
          act.play(); act.time = clip.duration * 0.3; act.paused = true; mixer.update(0);
          owned.push({ dispose: () => mixer.stopAllAction() }); }
        g.updateMatrixWorld(true);
        /* grounded on the SEAT: the lowest skin his hips carry rests a few mm into the cushion, the crossed ankles at
           most 4.5 cm under it (e3c2's v19.2) */
        let sl = Infinity, seat = Infinity;
        g.traverse(o => {
          if (!o.isSkinnedMesh) return;
          o.skeleton.update();
          const hb = o.skeleton.bones.map(b => /hips|pelvis/i.test(b.name));
          const sI = o.geometry.attributes.skinIndex, sW = o.geometry.attributes.skinWeight;
          const n = o.geometry.attributes.position.count;
          for (let i = 0; i < n; i += 7) {
            o.getVertexPosition(i, _mv); _mv.applyMatrix4(o.matrixWorld); if (_mv.y < sl) sl = _mv.y;
            if (sI && sW) { let w = 0; for (let k = 0; k < 4; k++) if (hb[sI.getComponent(i, k)]) w += sW.getComponent(i, k); if (w > 0.5 && _mv.y < seat) seat = _mv.y; }
          }
        });
        if (isFinite(sl)) g.position.y += isFinite(seat) ? Math.max(CUSH_TOP - 0.008 - seat, CUSH_TOP - 0.045 - sl) : CUSH_TOP + 0.012 - sl;
        g.updateMatrixWorld(true);
        // the head stood up from its crown bone, a little bowed — a chanting monk looks down, not at the roof (e3c2's)
        monk.head = mBone(/(^|[^A-Za-z])Head(_\d+)?$|mixamorigHead(_\d+)?$/);
        if (monk.head) {
          const top = monk.head.children.find(ch => ch.isBone && /HeadTop|head_end/i.test(ch.name)) || monk.head.children.find(ch => ch.isBone);
          if (top) {
            const fwd = new THREE.Vector3(Math.sin(MONK.ry), 0, Math.cos(MONK.ry));
            const hp = monk.head.getWorldPosition(new THREE.Vector3()), tp = top.getWorldPosition(new THREE.Vector3());
            mAim(monk.head, tp.sub(hp).normalize(), new THREE.Vector3(0, 1, 0).multiplyScalar(Math.cos(0.22)).addScaledVector(fwd, Math.sin(0.22)).normalize());
            g.updateMatrixWorld(true);
          }
          if (monk.head.parent && monk.head.parent.isBone && /neck/i.test(monk.head.parent.name)) monk.neck = monk.head.parent;
        }
        // the spine by HIERARCHY, lowest first (e3c2's v19.2)
        { const hips = monk.bones.find(b => b.children.some(ch => ch.isBone && /spine/i.test(ch.name)));
          const s0 = hips && hips.children.find(ch => ch.isBone && /spine/i.test(ch.name));
          const s1 = s0 && s0.children.find(ch => ch.isBone && /spine/i.test(ch.name));
          monk.spine = [s0, s1].filter(Boolean); }
        monkPray();
        monk.rest = new Map();
        for (const b of [monk.head, monk.neck, ...monk.spine]) if (b) monk.rest.set(b, b.quaternion.clone());
        g.updateMatrixWorld(true);
        skinCull(monk, 1.4, 1.1);
        proxy.visible = false; monk.ready = true; redoShadows();
      }).catch(err => { console.warn('monk failed to load', err); ctx.loadFail && ctx.loadFail('monkshop', err); monk.ready = true; });
    }
    /* the chant's eight phrases, measured on the shipped take (silence at -26 dB: Imina sakkarena / Buddham pujemi,
       twice more for the Dhamma and the Sangha, Araham samma-sambuddho bhagava / Buddham bhagavantam abhivademi): his
       head dips a little on each */
    const CHANT_PH = [0.08, 4.26, 7.90, 11.86, 15.30, 18.98, 22.48, 26.72];
    function monkTick(wdt) {
      if (!monk.ready || !monk.rest || !monk.group.visible) return;
      const t = wallNow(), ry = MONK.ry;
      _mAx.set(Math.cos(ry), 0, -Math.sin(ry));            // his right: a positive turn about it bows him forward
      const lay = (b, axisWorld, ang) => {
        if (Math.abs(ang) < 1e-6) return;
        b.parent.getWorldQuaternion(_mq2);
        _mv2.copy(axisWorld).applyQuaternion(_mq2.invert());
        b.quaternion.premultiply(_mq.setFromAxisAngle(_mv2, ang));
      };
      // breath, and the bow (the krap and the bow on "abhivademi" — bowTick's b, with the room)
      const breath = 0.011 * Math.sin(t * 1.3);
      monk.spine.forEach((b, i) => { b.quaternion.copy(monk.rest.get(b)); lay(b, _mAx, monk.bow * (i === 0 ? 0.36 : 0.22) + breath * (i === 0 ? 1 : 0.5)); });
      if (!monk.head) return;
      monk.head.quaternion.copy(monk.rest.get(monk.head));
      if (monk.neck) monk.neck.quaternion.copy(monk.rest.get(monk.neck));
      // his head with the chant: a slow dip on each phrase, a little sway between
      let nod = 0;
      if (monk.chantT0 >= 0) {
        const ct = dayClock.t - monk.chantT0;
        if (ct >= 0 && ct < SECS.mk3chant + 0.5) {
          for (const p0 of CHANT_PH) { const u = (ct - p0) / 2.2; if (u > 0 && u < 1) nod += 0.07 * Math.sin(u * Math.PI); }
          nod += 0.012 * Math.sin(ct * 2.1);
        }
      }
      // and turned (a little — the man behind him is at his back), eased; shared with the neck
      let want = 0;
      if (monk.look > 0) {
        camera.getWorldPosition(_cp);
        monk.head.getWorldPosition(_mv);
        let a = Math.atan2(_cp.x - _mv.x, _cp.z - _mv.z) - ry; a = Math.atan2(Math.sin(a), Math.cos(a));
        want = THREE.MathUtils.clamp(a, -0.85, 0.85) * monk.look;
      }
      monk.lookK += (want - monk.lookK) * (1 - Math.exp(-wdt * 2.6));
      _mv.set(0, 1, 0);
      if (monk.neck) lay(monk.neck, _mv, monk.lookK * 0.4);
      lay(monk.head, _mAx, nod);
      lay(monk.head, _mv.set(0, 1, 0), monk.lookK * (monk.neck ? 0.6 : 1));
    }
    /* everyone back where the day began (a Retry, a replay) */
    function castHome() {
      for (const r of rigs) { r.path = null; r.turnTo = null; r.talkUntil = 0; r.nod = 0; r.bow = 0; }
      owner.sitting = false; owner.idle = 'Idle_9'; owner.look = 1; owner.yTo = owner.yOff = 0;
      if (owner.model && owner.baseY !== undefined) owner.model.position.y = owner.baseY;
      owner.group.position.set(OWN.x, 0, OWN.z); owner.group.rotation.y = -Math.PI / 2;
      if (owner.acts && owner.acts.Idle_9) owner.play('Idle_9', 1, 0);
      if (ownerStool) ownerStool.visible = true;
      staff.look = 0.6; staff.group.position.set(STAFF.x, 0, STAFF.z); staff.group.rotation.y = Math.PI / 2;
      if (staff.acts && staff.acts.Idle_9) staff.play('Idle_9', 1, 0);
      for (const r of [girl, manW, auntie, youth]) { r.look = 0; r.nod = 0; }
      monk.bow = 0; monk.look = 0; monk.lookK = 0; monk.chantT0 = -1;     // (v21.8)
      // the shrine's people back where the night found them
      for (const [r, at, idle, park] of [[wife, WIFE_AT, WIFE_SIT], [father, FATHER_AT, 'Chair_Sit_Idle_M', 0.06]]) {   // (v21.8: the botak father, parked upright)
        r.group.visible = true; r.group.position.set(at.x, 0, at.z);
        r.group.rotation.y = r === wife ? Math.PI : Math.atan2(MED_AT.x - FATHER_AT.x, MED_AT.z - FATHER_AT.z);
        r.look = 0; r.lookAt = null; r.nod = 0;
        if (r.splitOn) r.splitOn.clear();                // (the fade-0 play below stops every other action, the split's too)
        r.yTo = r.yOff = 0; if (r.model && r.baseY !== undefined) r.model.position.y = r.baseY;   // (the walk's drop, undone)
        if (r.acts && r.acts[idle]) r.play(idle, 1, 0, false, park);
      }
      asst.look = 0; asst.lookAt = null; asst.nod = 0;
      medium.look = 0; medium.lookAt = null; medium.nod = 0;
      if (medium.acts) { medium.standK = medium.standTo = 0; medium.group.position.z = MED_AT.z; medStand(false, 0); }
      talismanGiven(false); urnLight(false); roarFx.flash(0); roarFx.hanu(0, MED_AT, MED_AT); roarFx.off();
      medium.recoil = 0;
      // the endings' things put away: the doorway open, no bus, nothing in his hand, the lanterns still
      entShutterK(0); busK(0); shrLife.gust = 0; starsK(0);
      for (const o of [cupProp, timHeld]) { o.visible = false; o.userData.warmHeld = false; if (o.parent) o.parent.remove(o); }
      // the kneelers and the two on stools back as the day found them (the film moves and turns them)
      girl.group.position.set(GIRL_AT.x, 0, GIRL_AT.z); girl.group.rotation.y = Math.PI;
      if (girl.acts && girl.acts.kneel) girl.play('kneel', 1, 0);
      manW.group.rotation.y = Math.PI;
      auntie.group.rotation.y = Math.PI * 0.82;
      if (auntie.acts && auntie.acts[SIT_W]) auntie.play(SIT_W, 1, 0, false, 0.0);
      youth.group.rotation.y = -Math.PI * 0.82;
      if (youth.acts && youth.acts[SHOUT]) youth.play(SHOUT, 1, 0, false, 0.0);
      /* the passer-by back on his beat, walking (the trance film stops him at
         the glass on a parked frame), and the shop's clock back to the morning
         the chapter opens on (the trance film runs it on fifteen minutes) */
      passerHeld = false; PASS.dir = 1;
      passer.group.position.set(-10, 0, PASS.z); passer.group.rotation.y = Math.PI / 2;
      if (passer.acts && passer.acts.Walking) passer.play('Walking', 1, 0);
      clockTo(12, 6);
    }
    const PASS = { x0: -12.2, x1: 12.2, z: 2.35, v: 1.3, dir: 1 };   // (at 2.9 he walked along the columns' near faces, half of him through each)
    function passerTick(wdt) {
      if (!passer.ready || !passer.group.visible || passerHeld) return;
      const g = passer.group;
      g.position.x += PASS.dir * PASS.v * wdt;
      if (g.position.x > PASS.x1) { PASS.dir = -1; g.rotation.y = -Math.PI / 2; }
      if (g.position.x < PASS.x0) { PASS.dir = 1; g.rotation.y = Math.PI / 2; }
    }

    /* ======================================================== WORLD B · THE SHRINE
       A medium's shrine in an old shophouse, that night. One bay's roller
       shutter rolled up for the consultations, the other half down with the
       light spilling under it; red lanterns on the five-foot way, couplets on
       the piers, the shrine's name board over both bays. Inside: red quarry
       tiles, a green-glazed dado, a tall red-and-gold altar with Guan Gong in
       its niche and lesser images on its steps, the offering table before it,
       the medium's carved chair (built round his own seated pose) and his
       table with every tool — the talismans, brush and ink, the seal, the
       bell, the command flags, the sword — the assistant's desk and queue
       board, the drum and the gong, the great urn by the door with the joss
       sticks beside it, incense coils turning under the beams, a fan, two
       tubes, and the earth god's red lamp on the floor by the door. Outside, a
       lorong at night: double yellow lines, a sodium lamp, a parked
       motorbike, a joss-paper burner, and across the road a row of shophouses
       with a kopitiam still lit. LIT WITHOUT A LIGHT (v15.1 / v9.4): the
       night preset lights the room, every glow is painted. A pocket at x -250
       (the far plane is 160 m — neither world is ever drawn from the other). */
    const shrG = new THREE.Group(); shrG.position.x = SHR.x; world.add(shrG);
    /* the people are in WORLD coordinates (their paths, the film's marks and
       the hotspots all are), in a group shown only while he is there */
    const shrPeople = new THREE.Group(); world.add(shrPeople); shrPeople.visible = false;
    const SB = { x0: -4.5, x1: 4.5, z0: -10.0, z1: 0.0, H: 3.4 };   // the room's inner faces, local
    const LX = (lx) => SHR.x + lx;                                   // local x → world x
    const _sv = new THREE.Vector3();
    const shrLife = { smokes: [], fans: [], coils: [], flames: [], lanterns: [] };
    let bigUrn = null, urnLit = false, talLaid = null, swordG = null, bellG = null, medStanding = false;
    const matQuarry = new THREE.MeshStandardMaterial({ map: tex(makeQuarryTiles(THREE, cnv)), roughness: 0.6 });
    matQuarry.map.repeat.set(9 / 1.2, 10 / 1.2);
    const matPaintB = new THREE.MeshStandardMaterial({ color: 0xe6d9bf, roughness: 0.93 });
    const matBeam   = new THREE.MeshStandardMaterial({ color: 0x5a1a12, roughness: 0.7 });
    const matBoards = new THREE.MeshBasicMaterial({ map: tex(makeCeilBoards(THREE, cnv)), color: 0x9a8670 });   // painted: the tubes light it
    matBoards.map.repeat.set(3, 4);
    const matLacq   = new THREE.MeshStandardMaterial({ color: 0x86140c, roughness: 0.32 });
    const matLacqIn = new THREE.MeshStandardMaterial({ color: 0x5c0c08, roughness: 0.5 });
    const matBronze = new THREE.MeshStandardMaterial({ color: 0x7a5a2c, roughness: 0.4, metalness: 0.65 });
    const matBronzeD = new THREE.MeshStandardMaterial({ color: 0x7a5a2c, roughness: 0.4, metalness: 0.65, side: THREE.DoubleSide });   // an open bowl, seen inside
    const matStone  = new THREE.MeshStandardMaterial({ color: 0x8a857a, roughness: 0.88 });
    const matSand   = new THREE.MeshStandardMaterial({ color: 0xb8a888, roughness: 1.0 });
    const matYellow = new THREE.MeshStandardMaterial({ color: 0xe8c040, roughness: 0.8 });
    const matInk    = new THREE.MeshStandardMaterial({ color: 0x141414, roughness: 0.35 });
    const matTubeB  = new THREE.MeshBasicMaterial({ color: 0xf2f6ff });
    const matRedLamp = new THREE.MeshBasicMaterial({ color: 0xff3018 });
    const matEmber  = new THREE.MeshBasicMaterial({ color: 0xff7a28 });
    /* v21.1: the lorong runs on past every frame an ending holds (GF-1, VB-5, VC-1): the road, its lines and both
       kerbs 180 m long, the far row of shophouses 96 m, and the fog takes them — they stopped at ±30 and ±24 in plain
       sight, and three endings held their last pictures on those ends */
    const ROAD_L = 180;
    const matFfw    = new THREE.MeshStandardMaterial({ map: tex(makePeranakanTiles(THREE, cnv)), roughness: 0.55, color: 0xb0aaa0 });
    matFfw.map.repeat.set(24 / 0.4, 2.2 / 0.4);
    const matShutter = texMat(makeShutter(THREE, cnv), { roughness: 0.6, metalness: 0.3 });
    matShutter.map.repeat.set(4, 2.2);
    const matKerb   = new THREE.MeshStandardMaterial({ color: 0x77736c, roughness: 0.9 });
    const matSmoke  = new THREE.MeshBasicMaterial({ map: tex(makeGlowTex(THREE, cnv, [210, 206, 200])), transparent: true, depthWrite: false, opacity: 0.3, fog: true });
    const glowRed   = tex(makeGlowTex(THREE, cnv, [255, 70, 40]));
    const glowSod   = tex(makeGlowTex(THREE, cnv, [255, 150, 60]));
    const glowWarm  = tex(makeGlowTex(THREE, cnv, [255, 214, 160]));
    const addGlow = (t, op) => new THREE.MeshBasicMaterial({ map: t, transparent: true, opacity: op, depthWrite: false, blending: THREE.AdditiveBlending, fog: false });
    const addGlowF = (t, op) => { const m = addGlow(t, op); m.fog = true; return m; };   // v21.8: one the night's fog takes, for the street's far lamps
    const bwall = (w, h, d, x, y, z, mat) => { const m = box(w, h, d, x, y, z, mat, shrG, false); walls.push(m); return m; };
    const GG_FACE = 0;                                               // Guan Gong faces +z, the door (chapter 3's GG_YAW)

    /* ---- THE NIGHT OVER THE LORONG. The engine's sky — its dome, its stars,
       its moon — is centred on the world's origin, and this pocket stands
       250 m off it: past the 160 m far plane from every star but a few low in
       the +x, so ending D looked up "at the night" into a sky with nothing in
       it (photographed on a phone). The shrine has its own, the engine's way —
       points that keep their size at any distance, a few bright among a
       dusting, a fifth of them warm — on a dome 100 m round the pocket, never
       fogged (the night's fog would take them at that distance), hidden by the
       room's ceiling and the facades wherever a roof would, and shown only
       while he is here (worldB) */
    const shrStars = new THREE.Group(); shrG.add(shrStars); shrStars.visible = false;
    /* v21.1: the stars a scene can ask more of — ending D looks up at the night, and its `stars` daylight drove the
       ENGINE's dome, which from the shrine is past the far plane: nothing in the sky ever changed (the v21.1 review) */
    const starMats = [];
    function starsK(k) {
      k = THREE.MathUtils.clamp(k, 0, 1);
      for (const s of starMats) { s.m.opacity = Math.min(1, s.op * (1 + 0.35 * k)); s.m.size = s.size * (1 + 0.55 * k); }
    }
    {
      const dot = tex(makeGlowTex(THREE, cnv, [255, 255, 255]));
      let sd = 2021019;
      const rnd = () => ((sd = (Math.imul(sd, 1664525) + 1013904223) >>> 0) / 4294967296);
      const layer = (n, size, l0, l1, op) => {
        const pos = new Float32Array(n * 3), col = new Float32Array(n * 3);
        for (let i = 0; i < n; i++) {
          const el = Math.asin(0.12 + rnd() * 0.87), az = rnd() * Math.PI * 2, cr = Math.cos(el) * 100;
          pos[i * 3] = Math.cos(az) * cr; pos[i * 3 + 1] = Math.sin(el) * 100; pos[i * 3 + 2] = Math.sin(az) * cr;
          const l = l0 + rnd() * (l1 - l0), warm = rnd() < 0.22;
          col[i * 3] = l * (warm ? 1.0 : 0.86); col[i * 3 + 1] = l * 0.9; col[i * 3 + 2] = l * (warm ? 0.76 : 1.0);
        }
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
        const pts = new THREE.Points(geo, new THREE.PointsMaterial({ map: dot, size, sizeAttenuation: false, vertexColors: true,
          transparent: true, opacity: op, depthWrite: false, fog: false, blending: THREE.AdditiveBlending }));
        pts.renderOrder = -900; shrStars.add(pts);
        starMats.push({ m: pts.material, op, size });
      };
      layer(700, 2.0, 0.22, 0.6, 0.85);
      layer(110, 3.6, 0.6, 1.0, 1.0);
    }

    /* ---- the room's shell */
    { const f = new THREE.Mesh(new THREE.PlaneGeometry(9, 10), matQuarry);
      f.rotation.x = -Math.PI / 2; f.position.set(0, 0, -5); f.receiveShadow = true; shrG.add(f); }
    { const c = new THREE.Mesh(new THREE.PlaneGeometry(9, 10), matBoards);
      c.rotation.x = Math.PI / 2; c.position.set(0, SB.H, -5); shrG.add(c); }
    for (const z of [-2.2, -4.6, -7.0, -9.86]) box(9, 0.2, 0.16, 0, SB.H - 0.1, z, matBeam, shrG, false);    // the beams (the last on the back wall: at −9.2 it ran through the altar's canopy and hid the top of its plaque)
    bwall(9.4, SB.H, 0.2, 0, SB.H / 2, SB.z0 - 0.1, matPaintB);                                              // back
    bwall(0.2, SB.H, 10.2, SB.x0 - 0.1, SB.H / 2, -5.0, matPaintB);                                          // left
    bwall(0.2, SB.H, 10.2, SB.x1 + 0.1, SB.H / 2, -5.0, matPaintB);                                          // right
    // the dado: green glazed tiles to the shoulder, a rail over them (the left, right and back walls)
    { const dt = tex(makeDadoTiles(THREE, cnv));
      const dm = (len) => { const t = dt.clone(); t.needsUpdate = true; madeTex.push(t); t.repeat.set(len / 1.2, 1.25 / 1.2); return new THREE.MeshStandardMaterial({ map: t, roughness: 0.35 }); };
      plane(10, 1.25, dm(10), SB.x0 + 0.004, 0.625, -5.0, Math.PI / 2, shrG);
      plane(10, 1.25, dm(10), SB.x1 - 0.004, 0.625, -5.0, -Math.PI / 2, shrG);
      for (const [x, w] of [[-3.05, 2.9], [3.05, 2.9]]) plane(w, 1.25, dm(w), x, 0.625, SB.z0 + 0.004, 0, shrG);
      box(0.03, 0.05, 10, SB.x0 + 0.015, 1.27, -5.0, matWoodL, shrG, false);
      box(0.03, 0.05, 10, SB.x1 - 0.015, 1.27, -5.0, matWoodL, shrG, false); }
    // the front: three piers, a transom over both bays
    for (const [x, w] of [[-4.375, 0.25], [0, 0.5], [4.375, 0.25]]) bwall(w, SB.H, 0.25, x, SB.H / 2, -0.125, matPaintB);
    box(9, SB.H - 2.7, 0.25, 0, (SB.H + 2.7) / 2, -0.125, matPaintB, shrG, false);
    // the entrance bay (left): its shutter rolled up into the box over it, a folding grille pushed back
    box(4.0, 0.16, 0.22, -2.25, 2.62, -0.04, matBoxSteel, shrG, false);
    box(4.0, 0.05, 0.05, -2.25, 2.53, 0.02, matBoxSteel, shrG, false);
    for (let i = 0; i < 7; i++) box(0.018, 2.5, 0.018, -4.18 + i * 0.05, 1.25, -0.06 - (i % 2) * 0.03, matSteel, shrG, false);
    for (const y of [0.3, 1.25, 2.2]) box(0.34, 0.018, 0.05, -4.03, y, -0.07, matSteel, shrG, false);
    // the other bay: half down, the light under it; a blocker below the slats
    { const sh = plane(4.0, 1.55, matShutter, 2.25, 1.925, 0.004, 0, shrG); sh.material.side = THREE.DoubleSide;
      box(4.0, 0.06, 0.06, 2.25, 1.15, 0.01, matSteel, shrG, false);
      box(4.0, 0.16, 0.22, 2.25, 2.62, -0.04, matBoxSteel, shrG, false);
      bwall(4.0, 1.2, 0.2, 2.25, 0.6, -0.1, matProxy).visible = false;
      const spill = new THREE.Mesh(new THREE.PlaneGeometry(4.0, 1.4), addGlow(glowWarm, 0.22));
      spill.rotation.x = -Math.PI / 2; spill.position.set(2.25, 0.012, 0.55); shrG.add(spill); }

    /* v21.8: the street's lamps ([x, z, arm]: our side's poles on the kerb line, the far side's in the planting
       strip, arms out over the road), and the two shops still open across it */
    const STREET_LAMPS = [[6.4, 2.5, 1], [-26.0, 2.5, 1], [37.0, 2.5, 1], [-11.0, 15.55, -1], [19.0, 15.55, -1], [-42.0, 15.55, -1], [49.0, 15.55, -1]];
    const KOPI = { x: -15, z: 17.1, y: 0.15 };            // the kopitiam's tables, on the far five-foot way (z 16.0 … 18.0, 0.15 up)
    const MART = { x: 9.1 };                              // the minimart, open all night
    /* ---- v21.8 · THE STREET, BUILT. Chad: "The medium scene, the background row of shops, look too basic and
       sparse. You need to drastically improve it, and add some trees too. Make it look like a real Singapore street
       behind." It was four painted 24 m sheets and a black parapet. It is a street now:
         - across the road a row of shophouses the length of the lorong, each one BUILT: square piers carrying the
           upper floors over a tiled five-foot way, a signboard on every fascia, roller shutters down for the night
           and two shops still open (the kopitiam, warm, and a 24-hour minimart, cool); French windows above, most
           with their louvred shutters shut, some on a lit room, a curtain lit from behind, a tube; pilasters, floor
           bands and cornices, an Art Deco parapet with its year on some, Peranakan balustrades and fanlights on
           others, a pan-tiled roof behind the rest; air-conditioners on the walls, laundry out on bamboo poles, a
           pawnshop's and a medical hall's blade signs;
         - a planting strip along the far kerb with rain trees in it, a drain, cars parked at the kerb, street lamps
           both sides every thirty metres;
         - our own row runs on past the shrine's neighbours the same way, and its upper floors stand over the shrine;
         - HDB blocks over the roofs, their corridor lights on.
       LIT WITHOUT A LIGHT (v15.1 / v9.4) — per pixel now: one small shader (nightMat) paints the night onto every
       built face, a little moonlight and the sodium lamps and the two open shops as pools of light on the faces
       that look toward them, so a facade is bright under its lamp and dark between, and the scene's light count
       never changes. Everything is merged into a handful of batches (one draw a material); nothing casts a shadow
       and nothing is a blocker — the shrine's bounds stop him on the five-foot way (maxZ 2.0). */
    function buildStreet() {
      const rS = rng(2108);
      /* ---- the painted lights, in WORLD space (the shader works there): a pool each, falling off as the square of
         1 + (d/r)² — tight enough that between two lamps thirty metres apart the facade goes dark, which is what a
         street at night is (the first build's 1/(1 + (d/r)²) lit the whole row like a stage at dusk, photographed) */
      const SLP = [], SLC = [];
      const light = (x, y, z, hex, k, r) => { SLP.push(new THREE.Vector4(LX(x), y, z, r)); SLC.push(new THREE.Color(hex).multiplyScalar(k)); };
      for (const [x, z, arm] of STREET_LAMPS) light(x, 6.1, z + arm * 1.55, 0xffa860, 2.1, 4.6);
      light(KOPI.x, 2.6, 18.9, 0xffe2b8, 2.4, 3.0);
      light(MART.x, 2.6, 18.9, 0xdcecff, 2.2, 3.0);
      /* every built face: its paint (the vertex colour, times its map), lit by the night above. A material's program
         is keyed on its onBeforeCompile SOURCE, the same text for both variants here — so each its own key (e3c1's
         templeMats law) */
      function nightMat(map, grime) {
        const m = new THREE.MeshBasicMaterial({ vertexColors: true, map: map || null });
        m.customProgramCacheKey = () => 'e3night' + (grime ? 'G' : '');
        m.onBeforeCompile = sh => {
          const NL = SLP.length;
          sh.uniforms.uSLP = { value: SLP }; sh.uniforms.uSLC = { value: SLC };
          sh.vertexShader = sh.vertexShader
            .replace('#include <common>', '#include <common>\nvarying vec3 vSP; varying vec3 vSN;')
            .replace('#include <begin_vertex>', '#include <begin_vertex>\nvSP = (modelMatrix * vec4(transformed, 1.0)).xyz; vSN = mat3(modelMatrix) * normal;');
          sh.fragmentShader = sh.fragmentShader
            .replace('#include <common>', `#include <common>
varying vec3 vSP; varying vec3 vSN;
uniform vec4 uSLP[${NL}]; uniform vec3 uSLC[${NL}];
float nh21(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float nvn(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(nh21(i), nh21(i + vec2(1.0, 0.0)), f.x), mix(nh21(i + vec2(0.0, 1.0)), nh21(i + vec2(1.0, 1.0)), f.x), f.y); }`)
            .replace('#include <color_fragment>', `#include <color_fragment>
{ vec3 n = normalize(vSN);
  vec3 L = vec3(0.045, 0.052, 0.075) + vec3(0.035, 0.04, 0.06) * max(n.y, 0.0);
  for (int i = 0; i < ${NL}; i++) {
    vec3 d = uSLP[i].xyz - vSP; float r2 = dot(d, d);
    float w = clamp((dot(n, d) * inversesqrt(r2) + 0.2) / 1.2, 0.0, 1.0), a = 1.0 + r2 / (uSLP[i].w * uSLP[i].w);
    L += uSLC[i] * w / (a * a);
  }
  ${grime ? 'diffuseColor.rgb *= 0.74 + 0.3 * nvn(vec2(vSP.x * 2.1, vSP.y * 0.3)) + 0.08 * nvn(vSP.xz * 9.0 + vSP.y * 5.0);' : ''}
  diffuseColor.rgb *= L; }`);
        };
        owned.push({ dispose: () => m.dispose() });
        return m;
      }
      /* what makes its own light: a lit room, a lightbox, a shop's inside under its tubes */
      const unlitMat = (map, o = {}) => { const m = new THREE.MeshBasicMaterial({ vertexColors: true, map: map || null, ...o }); owned.push({ dispose: () => m.dispose() }); return m; };

      /* ---- the batches. Every piece is posed in its UNIT's own frame (x across it, y up, z into the building, the
         street at −z), and the frame puts it in the lorong: the far row as it is, our row turned round */
      const FR = new THREE.Matrix4(), _M = new THREE.Matrix4(), _L = new THREE.Matrix4(), _NM = new THREE.Matrix3(),
            _Q = new THREE.Quaternion(), _E = new THREE.Euler(0, 0, 0, 'YXZ'), _V = new THREE.Vector3(), _S1 = new THREE.Vector3(1, 1, 1), _c = new THREE.Color();
      const setFrame = (xc, zf, flip) => { FR.makeRotationY(flip ? Math.PI : 0).setPosition(xc, 0, zf); };
      const ident = () => FR.identity();
      function batch() {
        const P = [], N = [], C = [], U = [], I = [];
        const B = {
          /* `cell` maps the geometry's own UVs into a rectangle of an atlas, `uv` scales them, and with neither they
             are the face's position in metres (÷ `ws`), picked by the way it faces */
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
            const m = new THREE.Mesh(g, mat); m.castShadow = false; m.receiveShadow = false;
            shrG.add(m); return m;
          },
        };
        return B;
      }
      const winTex = tex(makeStreetWindows(THREE, cnv)), signTex = tex(makeStreetSigns(THREE, cnv)), fanTex = tex(makeFanlight(THREE, cnv)),
            baluTex = tex(makeBalustrade(THREE, cnv)), acTex = tex(makeAcFront(THREE, cnv)), bladeTex = tex(makeBladeSigns(THREE, cnv)),
            roofTex = tex(makePanTiles(THREE, cnv)), vergeTex = tex(makeVerge(THREE, cnv)), hdbTex = tex(makeHdbNight(THREE, cnv)),
            shutTex = tex(makeShutter(THREE, cnv)), ffwTex = tex(makePeranakanTiles(THREE, cnv));
      const bPl = batch(), bWinN = batch(), bWinL = batch(), bSignN = batch(), bSignL = batch(), bFanN = batch(), bFanL = batch(),
            bBalu = batch(), bAC = batch(), bBlade = batch(), bRoof = batch(), bFloor = batch(), bVerge = batch(), bShut = batch(),
            bIn = batch(), bHdb = batch(), bRoad = batch();
      /* the atlases' cells: eight French windows across winTex (128 × 320 each, the window's own proportion), and the
         signboards two across and twelve down signTex (512 × 80) */
      const WCELL = (i) => [i / 8 + 0.002, 0.004, (i + 1) / 8 - 0.002, 0.996];
      const SCELL = (i) => { const cc = i % 2, rr = Math.floor(i / 2); return [cc * 0.5 + 0.003, 1 - (rr + 1) * 80 / 1024 + 0.002, (cc + 1) * 0.5 - 0.003, 1 - rr * 80 / 1024 - 0.002]; };
      const BCELL = (i) => [i * 0.5 + 0.004, 0.004, (i + 1) * 0.5 - 0.004, 0.996];
      const WIN = { shut: 0, ajar: 1, warm: 2, cool: 3, glass: 4, open: 5, curtain: 6, grille: 7 };
      const LIT = new Set([WIN.ajar, WIN.warm, WIN.cool, WIN.curtain]);
      const PAL = [0xa6d4c0, 0xe8b6ba, 0xefd89a, 0xa8c6e4, 0xece0c6, 0xefc4a0, 0xc8b8da, 0x9ccec8, 0xe6e4dc, 0xd4e0a6, 0xf2d0c4, 0xb8dcd8];
      const TRIMS = [0xf6f2e8, 0xfaf7ee, 0xe8dfcc];
      const LOUV = [0x3e6c4c, 0x5c3c28, 0x34526c, 0x7c2c24, 0x4c5c3c, 0x2c5a5a];
      const CLOTH = [0xc8302a, 0x2a5aa8, 0xf0ece0, 0xe8c040, 0x4a8a5a, 0xd87aa0, 0x5a4a8a];
      const pick = (a) => a[(rS() * a.length) | 0];
      /* the signboards: the kopitiam's and the minimart's are their own; the rest are dealt so no two neighbours
         share one; a quarter of them lit (and the clinic's always) */
      let lastSign = -1;
      const dealSign = () => { let s; do { s = 2 + ((rS() * 14) | 0); } while (s === lastSign); lastSign = s; return s; };

      /* ---- ONE SHOPHOUSE, in its own frame. G: the five-foot way's ceiling; F: its depth; fy: its floor */
      function shophouse(x0, x1, far, kind) {
        const w = x1 - x0, xc = (x0 + x1) / 2;
        const G = far ? 3.9 : 3.4, F = far ? 2.0 : 2.2, fy = far ? 0.15 : 0;
        setFrame(xc, far ? 16.0 : 2.2, !far);
        const shop = kind === 'kopi' || kind === 'mart', upper = kind === 'upper';
        const roll = rS();
        const nUp = shop ? 2 : roll < 0.16 ? 1 : roll < 0.82 ? 2 : 3;
        const sr = rS(), style = sr < 0.36 ? 'early' : sr < 0.6 ? 'deco' : 'late';
        const wallC = pick(PAL), trim = pick(TRIMS), louv = pick(LOUV);
        const Y1 = G + 0.6, FH = 3.2, T = Y1 + nUp * FH;
        // the upper floors' mass: its sides show where a neighbour is lower, its front is behind the facade
        bPl.box(w - 0.01, T - Y1, 8.6, 0, (Y1 + T) / 2, 0.25 + 4.3, wallC, { k: 0.8 });
        // the facade, floor by floor
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
          if (f > 0) bPl.box(w, 0.2, 0.14, 0, y0, -0.07, trim);                                   // the floor band
          for (let i = 0; i < nw; i++) {
            const cx = -A / 2 + slot * (i + 0.5), r0 = rS();
            const st = r0 < 0.38 ? WIN.shut : r0 < 0.5 ? WIN.glass : r0 < 0.56 ? WIN.grille : r0 < 0.72 ? WIN.warm
                     : r0 < 0.8 ? WIN.curtain : r0 < 0.89 ? WIN.cool : r0 < 0.93 ? WIN.ajar : WIN.open;
            const lit = LIT.has(st);
            (lit ? bWinL : bWinN).quad(ww, wh, cx, sill + wh / 2, 0.2, st === WIN.shut ? louv : 0xffffff, { ry: Math.PI, cell: WCELL(st) });
            bPl.box(ww + 0.2, 0.07, 0.18, cx, sill - 0.035, -0.07, trim);                           // its sill
            if (style === 'deco') bPl.box(ww + 0.36, 0.06, 0.34, cx, top + 0.1, -0.15, trim);      // a sun fin over it
            else if (style === 'early') bPl.box(ww + 0.26, 0.12, 0.1, cx, top + 0.15, -0.05, trim); // a moulded head
            else {                                                                                  // a fanlight in a moulded arch
              const fr = Math.min(ww / 2, y1 - top - 0.14);
              bPl.add(new THREE.CircleGeometry(fr + 0.07, 14, 0, Math.PI), cx, top + 0.02, -0.004, trim, { ry: Math.PI });
              (lit ? bFanL : bFanN).add(new THREE.CircleGeometry(fr, 14, 0, Math.PI), cx, top + 0.02, -0.008, lit ? 0xffd9a0 : 0xffffff, { ry: Math.PI });
            }
            if (french) {                                                                           // a Peranakan balustrade before the French window
              bBalu.quad(ww + 0.06, 0.62, cx, sill + 0.31, -0.07, 0xffffff, { ry: Math.PI });
              bPl.box(ww + 0.3, 0.06, 0.32, cx, sill - 0.01, -0.16, trim);
            }
            // an air-conditioner hung beside it, now and then; laundry out of it, now and then
            if (rS() < 0.22 && (slot - ww) / 2 > 0.5) {
              const ax = cx + (i % 2 ? -1 : 1) * (ww / 2 + 0.5), ay = sill + 0.45;
              bPl.box(0.8, 0.56, 0.3, ax, ay, -0.16, 0xdcdad2);
              bAC.quad(0.46, 0.46, ax + 0.1, ay, -0.312, 0xffffff, { ry: Math.PI, uv: [1, 1] });
            }
            if (!french && rS() < 0.14) {
              const py = top - 0.18;
              bPl.box(0.035, 0.035, 2.1, cx, py, -1.05, 0x9a8a64);                                  // the bamboo pole
              for (let j = 0, nj = 2 + ((rS() * 3) | 0); j < nj; j++) {
                const gz = -0.45 - j * 0.55, gh = 0.5 + rS() * 0.35, gc = pick(CLOTH);
                bPl.quad(0.46, gh, cx + 0.002, py - gh / 2 - 0.02, gz, gc, { ry: Math.PI / 2 });
                bPl.quad(0.46, gh, cx - 0.002, py - gh / 2 - 0.02, gz, gc, { ry: -Math.PI / 2 });
              }
            }
          }
        }
        // the pilasters at the party walls (each unit carries its half), their capitals, the cornice, and over it a
        // parapet with its year (Art Deco) or the eaves of a pan-tiled roof
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
          bSignN.quad(w * 0.34, 0.36, 0, T + 0.86, -0.113, 0xffffff, { ry: Math.PI, cell: SCELL(16 + ((rS() * 3) | 0)) });
        } else {
          const lift = style === 'late' ? 0.5 : 0;
          if (lift) bPl.box(w, 0.5, 0.2, 0, T + 0.3 + 0.25, 0.0, wallC);
          const z0 = -0.32, z1 = 4.2, rise = 1.75, len = Math.hypot(z1 - z0, rise), ang = Math.atan2(rise, z1 - z0);
          bRoof.box(w + 0.03, 0.1, len, 0, T + 0.3 + lift + rise / 2, (z0 + z1) / 2, 0xa05a3e, { rx: -ang, ws: 0.5 });
        }
        if (upper) return;
        /* the ground floor: the fascia beam over the way with its signboard, the way's ceiling (a tube on in some),
           and at the back the shop — its shutter down, or open on a lit inside */
        bPl.box(w, Y1 - G, 0.45, 0, (G + Y1) / 2, 0.225, wallC, { k: 0.92 });
        const sg = kind === 'kopi' ? 0 : kind === 'mart' ? 1 : dealSign(), sLit = sg < 2 || sg === 12 || rS() < 0.26;
        (sLit ? bSignL : bSignN).quad(w - 0.75, 0.5, 0, (G + Y1) / 2, -0.006, sLit ? 0xffffff : 0xffffff, { ry: Math.PI, cell: SCELL(sg), k: sLit ? 0.92 : 1 });
        bPl.quad(w, F, 0, G, F / 2, 0x5c544a, { rx: Math.PI / 2 });
        if (shop || rS() < 0.3) {
          bIn.box(1.2, 0.05, 0.08, 0, G - 0.05, F * 0.45, 0xffffff, { k: shop ? 1.3 : 1.1 });
          if (far && !shop) light(xc, G - 0.25, 16.0 + F * 0.45, 0xe4eeff, 1.3, 1.5);   // its light on the way (the facade over it faces away)
        }
        if (sg === 10 || sg === 3) {                                                                 // the pawnshop's and the medical hall's blade signs
          const bx = -w / 2 + 0.3, by = Y1 + 1.3;
          bPl.box(0.1, 1.95, 0.72, bx, by, -0.42, 0x2a2420);
          for (const s of [-1, 1]) bBlade.quad(0.62, 1.82, bx + s * 0.052, by, -0.42, 0xffffff, { ry: s * Math.PI / 2, cell: BCELL(sg === 10 ? 0 : 1) });
        }
        const sw = w - 0.9;
        if (!shop) {
          bShut.quad(sw, 3.0, 0, fy + 1.5, F - 0.02, 0xd8dadc, { ry: Math.PI });
          bPl.box(sw + 0.1, 0.3, 0.32, 0, fy + 3.15, F - 0.16, 0x4a4e54);                               // the roller box
          bPl.box(w, G - fy - 3.3, 0.2, 0, (fy + 3.3 + G) / 2, F + 0.1, wallC, { k: 0.85 });
          for (const s of [-1, 1]) bPl.box(0.45, 3.3, 0.2, s * (w / 2 - 0.225), fy + 1.65, F + 0.1, wallC, { k: 0.85 });
          if (rS() < 0.5) {                                                                          // a pot plant by the pier
            const px = (rS() < 0.5 ? -1 : 1) * (w / 2 - 0.55);
            bPl.add(new THREE.CylinderGeometry(0.2, 0.15, 0.36, 8), px, fy + 0.18, 0.75, 0x8a5a3a);
            bPl.add(new THREE.IcosahedronGeometry(0.32, 1), px, fy + 0.6, 0.75, 0x35552c);
          }
          return;
        }
        // an open shop: its jambs and the wall over the opening, and inside, lit by its own tubes (drawn unlit)
        const oh = 3.1, D = 6.0, warm = kind === 'kopi';
        bPl.box(w, G - fy - oh, 0.2, 0, (fy + oh + G) / 2, F + 0.1, wallC, { k: 0.85 });
        for (const s of [-1, 1]) bPl.box(0.45, oh, 0.2, s * (w / 2 - 0.225), fy + oh / 2, F + 0.1, wallC, { k: 0.85 });
        const wallIn = warm ? 0xe8d4b0 : 0xe6eef4, floorIn = warm ? 0xbca88c : 0xd4d8da, ceilIn = warm ? 0xf0e2c8 : 0xf4f6f8;
        bIn.quad(sw, D, 0, fy + 0.002, F + D / 2, floorIn, { rx: -Math.PI / 2, k: 0.48 });
        bIn.quad(sw, D, 0, fy + oh, F + D / 2, ceilIn, { rx: Math.PI / 2, k: 0.4 });
        bIn.quad(D, oh, -sw / 2, fy + oh / 2, F + D / 2, wallIn, { ry: Math.PI / 2, k: 0.5 });
        bIn.quad(D, oh, sw / 2, fy + oh / 2, F + D / 2, wallIn, { ry: -Math.PI / 2, k: 0.5 });
        for (const z of [1.2, 3.2, 5.0]) for (const x of [-sw / 4, sw / 4]) bIn.box(1.2, 0.05, 0.08, x, fy + oh - 0.04, F + z, 0xffffff, { k: 1.4 });
        // its back wall: the stall and its menu, or the shelves
        const back = new THREE.Mesh(new THREE.PlaneGeometry(sw, oh), unlitMat(tex(warm ? makeKopiBack(THREE, cnv) : makeMartBack(THREE, cnv)), { vertexColors: false, color: warm ? 0xd8d0c0 : 0xd8dce0 }));
        back.applyMatrix4(_M.multiplyMatrices(FR, _L.compose(_V.set(0, fy + oh / 2, F + D), _Q.setFromEuler(_E.set(0, Math.PI, 0)), _S1)));
        shrG.add(back);
        if (warm) {
          bIn.box(sw * 0.7, 1.05, 0.6, 0, fy + 0.525, F + D - 0.55, 0x6a3a1e, { k: 0.6 });         // the drinks stall's counter
          for (const x of [-1.3, 1.3]) {                                                            // two tables inside, marble on iron
            bIn.box(0.8, 0.04, 0.8, x, fy + 0.75, F + 2.6, 0xe8e4dc, { k: 0.85 });
            bIn.box(0.06, 0.72, 0.06, x, fy + 0.37, F + 2.6, 0x2a2420, { k: 0.7 });
          }
          bIn.box(0.7, 1.8, 0.55, sw / 2 - 0.5, fy + 0.9, F + D - 0.6, 0xd8ecff, { k: 1.05 });      // a drinks fridge
        } else {
          for (const x of [-1.4, 0, 1.4]) {                                                         // three gondolas of goods
            bIn.box(0.55, 1.6, 3.2, x, fy + 0.8, F + 3.3, 0xc8ccd0, { k: 0.75 });
            for (let k = 0; k < 4; k++) bIn.box(0.57, 0.2, 3.1, x, fy + 0.35 + k * 0.38, F + 3.3, pick([0xc8302a, 0x2a6ac8, 0xe8c040, 0x3a9a5a, 0xe87a2a]), { k: 0.8 });
          }
          bIn.box(1.4, 1.0, 0.6, -sw / 2 + 0.9, fy + 0.5, F + 0.9, 0x8a8e92, { k: 0.8 });           // the counter by the door
          bSignL.quad(1.0, 0.18, -sw / 2 + 0.9, fy + 2.7, F + 0.3, 0xffffff, { ry: Math.PI, cell: SCELL(1) });
        }
      }

      /* ---- the rows. Units of 4.4–6.2 m (a shophouse's own range), dealt from one seed; the kopitiam and the
         minimart where the endings look for them */
      const fill = (a, b) => {
        const L = b - a, n = Math.max(1, Math.round(L / 5.25)), ws = []; let s = 0;
        for (let i = 0; i < n; i++) { const v = 0.84 + rS() * 0.34; ws.push(v); s += v; }
        const out = []; let x = a; for (const v of ws) { const w = L * v / s; out.push([x, x + w]); x += w; } return out;
      };
      const farRow = [...fill(-74, -18.2), [-18.2, -11.8, 'kopi'], ...fill(-11.8, 6.5), [6.5, 11.7, 'mart'], ...fill(11.7, 74)];
      const ourRow = [...fill(-72, -12.3), [-12.3, -4.5, 'upper'], [-4.5, 4.5, 'upper'], [4.5, 12.3, 'upper'], ...fill(12.3, 72)];
      for (const [x0, x1, kind] of farRow) shophouse(x0, x1, true, kind);
      for (const [x0, x1, kind] of ourRow) shophouse(x0, x1, false, kind);
      ident();
      // the piers, once at every unit's edge: the far row's on its way's front, ours on the line of the shrine's own
      const edges = (row) => [...new Set(row.flatMap(([a, b]) => [a, b]).map(v => +v.toFixed(3)))];
      for (const x of edges(farRow)) {
        bPl.box(0.45, 3.9 - 0.15, 0.45, x, 0.15 + 3.75 / 2, 16.225, 0xf2eee4);
        bPl.box(0.56, 0.32, 0.56, x, 0.15 + 0.16, 16.225, 0xe2dccc);
      }
      for (const x of edges(ourRow)) {
        if (Math.abs(x) < 12.6) continue;                                                           // the shrine's own row has its pillars
        bPl.box(0.4, 3.4, 0.4, x, 1.7, 2.0, 0xe6d9bf);
        bPl.box(0.5, 0.3, 0.5, x, 0.15, 2.0, 0xd6c9af);
      }
      // the far five-foot way (a step up off the verge), the verge's grass, our way's tiles on past the end walls
      bFloor.box(148, 0.15, 2.0, 0, 0.075, 17.0, 0xb0aaa0, { ws: 0.4 });
      bVerge.box(180, 0.1, 0.86, 0, 0.05, 15.57, 0xffffff, { ws: 1.5 });
      /* the road itself (v21.8: it was lit by the room's light and read as one flat black; now the lamps lay their pools
         on it as on the facades) */
      bRoad.quad(ROAD_L, 12, 0, -0.03, 8.66, 0xffffff, { rx: -Math.PI / 2, ws: 6, k: 2.4 });   // (the asphalt sheet is near black: ×2.4, so a lamp's pool reads on it)
      for (const s of [-1, 1]) bFloor.quad(59.7, 2.2, s * 42.15, 0.003, 1.1, 0xb0aaa0, { rx: -Math.PI / 2, ws: 0.4 });

      /* ---- HDB blocks over the roofs: dark, their corridor lights on, a few windows lit, and the fog has them */
      for (const [x, z, w, h] of [[-50, 52, 36, 46], [-12, 60, 32, 54], [24, 50, 34, 40], [52, 58, 30, 50]]) {
        bHdb.box(w, h, 12, x, h / 2, z, 0xffffff, { uv: [w / 24, h / 44.8] });
        bPl.box(6, 3.2, 5, x - w * 0.22, h + 1.6, z, 0x30333c);                                     // the lift motor room
        bPl.add(new THREE.CylinderGeometry(1.3, 1.3, 2.2, 10), x + w * 0.25, h + 1.1, z, 0x30333c);  // and a water tank
      }

      // the batches, built
      bPl.build(nightMat(null, true));
      bWinN.build(nightMat(winTex, false));
      bWinL.build(unlitMat(winTex));
      bSignN.build(nightMat(signTex, false));
      bSignL.build(unlitMat(signTex));
      bFanN.build(nightMat(fanTex, false));
      bFanL.build(unlitMat(fanTex));
      bBalu.build(nightMat(baluTex, false));
      bAC.build(nightMat(acTex, false));
      bBlade.build(unlitMat(bladeTex));
      bRoof.build(nightMat(roofTex, true));
      bFloor.build(nightMat(ffwTex, true));
      bVerge.build(nightMat(vergeTex, false));
      bShut.build(nightMat(shutTex, true));
      bIn.build(unlitMat(null));
      bHdb.build(unlitMat(hdbTex));
      bRoad.build(nightMat(tex(makeAsphalt(THREE, cnv)), false));

      /* ---- the far kerb and its drain, the rain trees in the planting strip, the cars at the kerb */
      { const dm = new THREE.MeshStandardMaterial({ color: 0x0c0c0e, roughness: 0.96 }); owned.push({ dispose: () => dm.dispose() });
        const d = new THREE.Mesh(new THREE.PlaneGeometry(ROAD_L, 0.32), dm); d.rotation.x = -Math.PI / 2; d.position.set(0, -0.02, 14.82); shrG.add(d); }
      box(ROAD_L, 0.16, 0.16, 0, 0.08, 15.06, matKerb, shrG, false);
      if (plantTrees) treeStands.push(plantTrees(shrG, [-60, -47, -34.5, -22, -5.5, 4.5, 15.5, 27, 39, 55, 66]
        .map((x, i) => ({ x, y: 0.1, z: 15.55, h: 7.4 + (i % 3) * 0.9 })), { seed: 81, tint: 0x7a8476, lowKeep: 0.65 }));
      parseOnce('cars').then(gl => {
        if (!alive) return;
        gl.scene.updateMatrixWorld(true);
        const bodies = []; gl.scene.traverse(o => { if (o.isMesh) bodies.push(o); });
        [-36.5, -27.5, 2.5, 23.5, 33.0].forEach((x, i) => {
          const src = bodies[i % bodies.length]; if (!src) return;
          const geo = src.geometry.clone(); geo.applyMatrix4(src.matrixWorld); geo.computeBoundingBox();
          let bb = geo.boundingBox;
          if (bb.max.z - bb.min.z > bb.max.x - bb.min.x) { geo.rotateY(Math.PI / 2); geo.computeBoundingBox(); bb = geo.boundingBox; }
          const s = 4.3 / (bb.max.x - bb.min.x);
          geo.translate(-(bb.min.x + bb.max.x) / 2, -bb.min.y, -(bb.min.z + bb.max.z) / 2); geo.scale(s, s, s);
          geo.computeBoundingBox();
          const wd = geo.boundingBox.max.z - geo.boundingBox.min.z;
          const car = new THREE.Mesh(geo, src.material);
          car.position.set(x, -0.02, 14.6 - wd / 2); car.rotation.y = i % 2 ? Math.PI : 0;
          car.castShadow = false; car.receiveShadow = false;
          shrG.add(car);
        });
      }).catch(e => { if (ctx.loadFail) ctx.loadFail('cars', e); else console.warn('e3c3: the parked cars did not load', e); });
    }

    /* ---- the five-foot way and the lorong */
    { const f = new THREE.Mesh(new THREE.PlaneGeometry(24, 2.2), matFfw);
      f.rotation.x = -Math.PI / 2; f.position.set(0, 0.002, 1.1); f.receiveShadow = true; shrG.add(f);
      const c = new THREE.Mesh(new THREE.PlaneGeometry(24, 2.2), matBoards);
      c.rotation.x = Math.PI / 2; c.position.set(0, SB.H, 1.1); shrG.add(c);
      box(24, 0.32, 0.3, 0, SB.H - 0.16, 2.2, matPaintB, shrG, false);                         // the beam over the street edge
      for (const x of [-9, -4.5, 0, 4.5, 9]) { const p = box(0.36, SB.H - 0.3, 0.36, x, (SB.H - 0.3) / 2, 2.02, matPaintB, shrG, false); solids.push(p); }
      // the neighbours on both sides: shut for the night
      for (const s of [-1, 1]) {
        const sh = plane(7.4, 2.7, matShutter, s * 8.2, 1.35, 0.0, 0, shrG); sh.material.side = THREE.DoubleSide;
        bwall(7.4, 2.7, 0.2, s * 8.2, 1.35, -0.1, matProxy).visible = false;   // (a drawn shutter stopped nobody: past it there is no floor at all)
        box(7.5, SB.H - 2.7, 0.25, s * 8.25, (SB.H + 2.7) / 2, -0.125, matPaintB, shrG, false);
        box(7.4, 0.12, 0.2, s * 8.2, 2.62, 0.05, matBoxSteel, shrG, false);
      }
      // the way along is blocked past the neighbours (crates and a parked bicycle at the ends)
      for (const s of [-1, 1]) {
        bwall(0.3, 2.0, 2.2, s * 7.6, 1.0, 1.1, matProxy).visible = false;
        for (let i = 0; i < 3; i++) box(0.55, 0.4, 0.45, s * (7.8 + (i % 2) * 0.1), 0.2 + i * 0.4, 0.45 + i * 0.2, i % 2 ? matWood : matWoodL, shrG);
        /* v21.1: and a wall says so — past the crates the way's tiles and ceiling stopped at ±12 in a black void 4.8 m
           off, behind a wall nobody could see (GF-1): a plastered end wall, the neighbour's bay walled off, a
           grille and a pipe on it, where the invisible one stands */
        box(0.24, SB.H, 2.2, s * 8.2, SB.H / 2, 1.1, matPaintB, shrG);
        box(0.02, 0.7, 0.9, s * 8.07, 2.3, 0.9, matSteel, shrG, false);
        cyl(0.05, 0.05, SB.H, s * 8.03, SB.H / 2, 1.95, matSteel, 8, shrG);
      }
      /* and where our row's way ENDS, at ±12, a plastered end the height of the way (seen from the road, never
         from inside it): the tiles, the ceiling and the beam stopped there on nothing */
      for (const s of [-1, 1]) box(0.3, SB.H + 0.3, 2.6, s * 12.15, (SB.H + 0.3) / 2, 1.0, matPaintB, shrG, false);
      // the kerb, the drain, the double yellow lines, the road
      box(ROAD_L, 0.14, 0.14, 0, 0.07, 2.27, matKerb, shrG, false);
      { const d = new THREE.Mesh(new THREE.PlaneGeometry(ROAD_L, 0.32), matInk); d.rotation.x = -Math.PI / 2; d.position.set(0, -0.02, 2.5); shrG.add(d); }
      const yel = new THREE.MeshBasicMaterial({ color: 0xc8a020 });
      for (const z of [2.8, 2.92]) { const l = new THREE.Mesh(new THREE.PlaneGeometry(ROAD_L, 0.06), yel); l.rotation.x = -Math.PI / 2; l.position.set(0, -0.025, z); shrG.add(l); }
      { const l = new THREE.Mesh(new THREE.PlaneGeometry(ROAD_L, 0.1), new THREE.MeshBasicMaterial({ color: 0x9a9a92 })); l.rotation.x = -Math.PI / 2; l.position.set(0, -0.025, 8.7); shrG.add(l); }
      /* across the road (v21.8): the far kerb and its drain, a planting strip with rain trees, the far five-foot way
         and the row of shophouses over it, built — and our own row on past the neighbours (buildStreet, above) */
      buildStreet();
      /* THE KOPITIAM, with some depth (VC-5): ending C is a look at it, and it was a flat painted doorway with three
         brown T's for tables — round marble tables and plastic stools spill onto its five-foot way, three people
         sit late over their kopi, a drinks fridge glows at the side and the light pools out across the paving */
      { const KX = KOPI.x, KZ = KOPI.z, kg = new THREE.Group(); kg.position.y = KOPI.y; shrG.add(kg);   // (v21.8: on the far five-foot way, now built — 0.15 up, 1.4 m further back)
        const marble = new THREE.MeshStandardMaterial({ color: 0xe8e4dc, roughness: 0.4 }), iron = new THREE.MeshStandardMaterial({ color: 0x22201e, roughness: 0.6 });
        const stoolR = new THREE.MeshStandardMaterial({ color: 0xb8241c, roughness: 0.55 }), stoolB = new THREE.MeshStandardMaterial({ color: 0x2a58a8, roughness: 0.55 });
        const shirt = [0x3a4c5e, 0x6a4a32, 0x2c2c34].map(c => new THREE.MeshStandardMaterial({ color: c, roughness: 0.9 }));
        const skin = new THREE.MeshStandardMaterial({ color: 0x8a6a52, roughness: 0.8 }), dark = new THREE.MeshStandardMaterial({ color: 0x1c1c22, roughness: 0.9 });
        for (const m of [marble, iron, stoolR, stoolB, skin, dark, ...shirt]) owned.push({ dispose: () => m.dispose() });
        const seats = [];
        [-1.7, 0, 1.6].forEach((dx, i) => {
          const x = KX + dx, z = KZ + (i % 2 ? 0.15 : -0.1);
          cyl(0.38, 0.38, 0.03, x, 0.75, z, marble, 18, kg); cyl(0.035, 0.035, 0.72, x, 0.38, z, iron, 6, kg); cyl(0.2, 0.22, 0.02, x, 0.08, z, iron, 12, kg);
          for (let k = 0; k < 3; k++) {
            const a = k * 2.094 + i * 0.7, sx = x + Math.cos(a) * 0.62, sz = z + Math.sin(a) * 0.5;
            cyl(0.15, 0.17, 0.44, sx, 0.29, sz, (i + k) % 2 ? stoolR : stoolB, 10, kg);
            seats.push({ x: sx, z: sz, tx: x, tz: z });
          }
          const cup = cyl(0.035, 0.03, 0.08, x + 0.1, 0.81, z - 0.08, marble, 8, kg); cup.castShadow = false;
        });
        // three of them taken: a seated figure each, turned to its table (lit from behind, they read as people)
        [seats[1], seats[4], seats[6]].forEach((st, i) => {
          const g = new THREE.Group(); g.position.set(st.x, 0, st.z); g.rotation.y = Math.atan2(st.tx - st.x, st.tz - st.z); kg.add(g);
          box(0.34, 0.5, 0.22, 0, 0.8, -0.02, shirt[i], g); box(0.3, 0.14, 0.42, 0, 0.56, 0.16, dark, g); box(0.28, 0.42, 0.12, 0, 0.27, 0.36, dark, g);
          const hd = new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 10), skin); hd.position.set(0, 1.17, 0.02); g.add(hd);
          for (const sx of [-0.2, 0.2]) { const ar = box(0.08, 0.36, 0.08, sx, 0.84, 0.1, shirt[i], g); ar.rotation.x = -0.9; }
        });
        const fr = box(0.72, 1.85, 0.55, KX - 2.3, 0.93, 17.55, iron, kg);
        const fg = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 1.6), new THREE.MeshBasicMaterial({ color: 0xdcecff, fog: true }));
        fg.position.set(KX - 2.3, 0.98, 17.55 - 0.28); fg.rotation.y = Math.PI; kg.add(fg); owned.push({ dispose: () => fg.material.dispose() });
        const pool = new THREE.Mesh(new THREE.PlaneGeometry(6.4, 1.9), addGlow(glowWarm, 0.34)); pool.rotation.x = -Math.PI / 2; pool.position.set(KX, 0.012, 16.95); kg.add(pool);
        owned.push({ dispose: () => pool.material.dispose() });
      }
      /* the sodium lamps, their pools on the road (v21.8: every thirty metres both sides, STREET_LAMPS; their glows
         fogged, so the far ones go into the night rather than floating bright in it) */
      for (const [x, z, arm] of STREET_LAMPS) {
        cyl(0.07, 0.09, 6.4, x, 3.2, z, matSteel, 8, shrG);
        box(0.06, 0.06, 1.6, x, 6.3, z + arm * 0.8, matSteel, shrG, false);
        const head = box(0.42, 0.12, 0.24, x, 6.22, z + arm * 1.55, new THREE.MeshBasicMaterial({ color: 0xffb060 }), shrG, false);
        const halo = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 2.2), addGlowF(glowSod, 0.55)); halo.position.copy(head.position); halo.position.y -= 0.1; shrG.add(halo);
        shrLife.lanterns.push({ halo, bill: true });
        const pool = new THREE.Mesh(new THREE.PlaneGeometry(11, 11), addGlowF(glowSod, 0.42));
        pool.rotation.x = -Math.PI / 2; pool.position.set(x, 0.0, z + arm * 2.2); shrG.add(pool);
      }
      // a motorbike parked at the kerb, leaning on its stand
      /* (v21.1: it was a red box on two rings with a white cube for a lamp, and it is the one thing in the
         foreground of ending C's held last picture — the v21.1 photographs: forks, a tank, the seat, fenders, the
         engine and its exhaust, mirrors, a plate and a tail lamp now, on the same footprint) */
      { const g = new THREE.Group(); g.position.set(-6.4, 0, 3.35); g.rotation.x = 0.13; shrG.add(g);
        const tyre = new THREE.MeshStandardMaterial({ color: 0x141414, roughness: 0.8 });
        const paint = new THREE.MeshStandardMaterial({ color: 0x7a1412, roughness: 0.35, metalness: 0.3 });
        const grey = new THREE.MeshStandardMaterial({ color: 0x34363a, roughness: 0.6, metalness: 0.4 });
        for (const x of [-0.62, 0.62]) {
          const w = new THREE.Mesh(new THREE.TorusGeometry(0.26, 0.075, 8, 24), tyre); w.position.set(x, 0.3, 0); g.add(w);
          const rim = new THREE.Mesh(new THREE.TorusGeometry(0.19, 0.012, 4, 24), matChrome); rim.position.set(x, 0.3, 0); g.add(rim);
          const hub = cyl(0.06, 0.06, 0.1, x, 0.3, 0, matChrome, 10, g); hub.rotation.x = Math.PI / 2;
          for (let k = 0; k < 3; k++) { const sp = box(0.36, 0.014, 0.014, x, 0.3, 0, grey, g, false); sp.rotation.z = k * Math.PI / 3; }
          const fen = new THREE.Mesh(new THREE.TorusGeometry(0.33, 0.04, 4, 12, Math.PI * 0.55), paint);
          fen.position.set(x, 0.3, 0); fen.rotation.z = x > 0 ? Math.PI * 0.3 : Math.PI * 0.15; fen.scale.z = 2.2; g.add(fen);
        }
        for (const z of [-0.07, 0.07]) { const fk = cyl(0.022, 0.022, 0.72, 0.5, 0.62, z, matChrome, 8, g); fk.rotation.z = 0.38; }   // the front forks
        const tank = new THREE.Mesh(new THREE.SphereGeometry(0.2, 14, 10), paint); tank.scale.set(1.25, 0.62, 0.72); tank.position.set(0.18, 0.86, 0); g.add(tank);
        box(0.58, 0.09, 0.26, -0.24, 0.84, 0, matBlack, g);                                                        // the seat
        box(0.4, 0.26, 0.24, -0.02, 0.5, 0, grey, g);                                                             // the engine
        box(0.5, 0.16, 0.2, -0.36, 0.66, 0, paint, g);                                                            // the side panels
        const ex = cyl(0.04, 0.05, 0.62, -0.38, 0.36, 0.17, matChrome, 10, g); ex.rotation.z = Math.PI / 2 - 0.12;   // the exhaust
        box(0.05, 0.05, 0.62, 0.62, 1.06, 0, matChrome, g, false);                                                 // the handlebar
        for (const z of [-0.31, 0.31]) {
          box(0.09, 0.04, 0.04, 0.62, 1.06, z, matBlack, g, false);                                                // grips
          const st = cyl(0.008, 0.008, 0.26, 0.6, 1.18, z * 0.8, matChrome, 4, g); st.rotation.x = z > 0 ? -0.3 : 0.3;
          const mi = new THREE.Mesh(new THREE.CircleGeometry(0.045, 12), matChrome); mi.position.set(0.6, 1.31, z * 0.68); mi.rotation.y = Math.PI / 2; g.add(mi);
        }
        const lamp = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.06, 14), new THREE.MeshBasicMaterial({ color: 0xd8d8c0 }));
        lamp.rotation.z = Math.PI / 2; lamp.position.set(0.7, 0.92, 0); g.add(lamp);
        box(0.02, 0.06, 0.14, -0.74, 0.62, 0, new THREE.MeshBasicMaterial({ color: 0x7a0c08 }), g, false);         // the tail lamp (unlit)
        box(0.01, 0.12, 0.2, -0.75, 0.48, 0, new THREE.MeshBasicMaterial({ color: 0xdcd8c8 }), g, false);          // the plate
        const stand = cyl(0.012, 0.012, 0.32, -0.1, 0.14, 0.16, matChrome, 4, g); stand.rotation.x = -0.55; }   // (on the side it leans to)
      // the joss-paper burner on the five-foot way's end
      { const g = new THREE.Group(); g.position.set(6.9, 0, 1.35); shrG.add(g);
        const drum = cyl(0.3, 0.28, 0.78, 0, 0.39, 0, matBlack, 16, g);
        cyl(0.34, 0.34, 0.04, 0, 0.8, 0, matSteel, 16, g);
        const roof = new THREE.Mesh(new THREE.ConeGeometry(0.42, 0.28, 4), matLacq); roof.position.y = 1.25; roof.rotation.y = Math.PI / 4; g.add(roof);
        for (const s of [-1, 1]) box(0.03, 0.42, 0.03, s * 0.24, 1.0, 0, matSteel, g, false);
        const em = new THREE.Mesh(new THREE.CircleGeometry(0.26, 16), matEmber); em.rotation.x = -Math.PI / 2; em.position.y = 0.7; g.add(em);
        const eg = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 1.0), addGlow(glowSod, 0.4)); eg.position.y = 0.85; g.add(eg);
        shrLife.lanterns.push({ halo: eg, bill: true });
        solids.push(drum); }
      // the shrine's name board over both bays, and the two big lanterns
      plane(6.6, 0.62, new THREE.MeshBasicMaterial({ map: tex(makeTempleSign(THREE, cnv)), fog: true }), 0, 3.04, 0.006, 0, shrG);
      for (const x of [-2.25, 2.25]) mkLantern(x, 2.48, 1.05, 0.34, true);
      // couplets on the piers' faces, and the heaven urn hung on the middle pier
      const cps = ['風調雨順', '國泰民安', '神光普照', '有求必應'];
      [[-4.375, 0], [-0.13, 1], [0.13, 2], [4.375, 3]].forEach(([x, i]) => plane(0.2, 1.7, new THREE.MeshBasicMaterial({ map: tex(makeCouplet(THREE, cnv, cps[i])), fog: true }), x, 1.55, 0.006, 0, shrG));
      { const g = new THREE.Group(); g.position.set(0, 1.62, 0.16); shrG.add(g);
        cyl(0.11, 0.09, 0.16, 0, 0, 0, matLacq, 12, g); box(0.02, 0.2, 0.16, 0, 0.0, -0.08, matSteel, g, false);
        for (let i = 0; i < 3; i++) { cyl(0.004, 0.004, 0.24, -0.03 + i * 0.03, 0.18, 0, matLacq, 4, g); const tip = new THREE.Mesh(new THREE.SphereGeometry(0.006, 6, 4), matEmber); tip.position.set(-0.03 + i * 0.03, 0.3, 0); g.add(tip); }
        mkSmoke(shrG, 0, 1.92, 0.16, 5, 0.6, 0.12); }
    }

    /* ---- THE ALTAR: the base cabinet, the niche with its canopy and plaque,
       two steps of images, Guan Gong in the middle, the red lamps */
    const ALT = { z: -9.55, top: 0.95 };
    { const g = new THREE.Group(); shrG.add(g);
      const base = box(3.2, ALT.top, 0.9, 0, ALT.top / 2, ALT.z, matLacq, g); solids.push(base);
      for (const x of [-0.8, 0.8]) { box(1.4, 0.03, 0.02, x, 0.78, ALT.z + 0.455, matGold, g, false); box(1.4, 0.03, 0.02, x, 0.18, ALT.z + 0.455, matGold, g, false); }
      plane(2.0, 0.78, texMat(makeAltarCloth(THREE, cnv), { roughness: 0.85 }), 0, 0.5, ALT.z + 0.462, 0, g);
      box(3.26, 0.05, 0.96, 0, ALT.top + 0.025, ALT.z, matGold, g, false);
      // the niche
      box(3.2, 2.0, 0.08, 0, ALT.top + 1.0, -9.96, matLacqIn, g, false);
      for (const s of [-1, 1]) { box(0.16, 2.0, 0.62, s * 1.52, ALT.top + 1.0, -9.66, matLacq, g); box(0.04, 2.0, 0.04, s * 1.43, ALT.top + 1.0, -9.34, matGold, g, false); }
      box(3.44, 0.42, 0.8, 0, ALT.top + 2.0 + 0.21, -9.6, matLacq, g);
      box(3.44, 0.06, 0.05, 0, ALT.top + 2.0, -9.18, matGold, g, false);
      box(3.44, 0.04, 0.05, 0, ALT.top + 2.4, -9.18, matGold, g, false);
      plane(1.9, 0.38, new THREE.MeshBasicMaterial({ map: tex(makePlaque(THREE, cnv)), fog: true }), 0, ALT.top + 2.21, -9.193, 0, g);
      // a fringe of gold drops under the canopy, and the red bulbs among them
      { const drops = new THREE.InstancedMesh(new THREE.SphereGeometry(0.022, 6, 4), matGold, 30), m4 = new THREE.Matrix4();
        for (let i = 0; i < 30; i++) { m4.makeTranslation(-1.6 + i * (3.2 / 29), ALT.top + 1.95, -9.2); drops.setMatrixAt(i, m4); }
        g.add(drops);
        const bulbs = new THREE.InstancedMesh(new THREE.SphereGeometry(0.03, 8, 6), matRedLamp, 9);
        for (let i = 0; i < 9; i++) { m4.makeTranslation(-1.28 + i * 0.32, ALT.top + 1.9, -9.22); bulbs.setMatrixAt(i, m4); }
        g.add(bulbs); }
      // the steps
      box(2.9, 0.2, 0.62, 0, ALT.top + 0.1, -9.6, matLacq, g); box(2.94, 0.03, 0.03, 0, ALT.top + 0.2, -9.29, matGold, g, false);
      box(2.1, 0.3, 0.4, 0, ALT.top + 0.35, -9.72, matLacq, g); box(2.14, 0.03, 0.03, 0, ALT.top + 0.5, -9.52, matGold, g, false);
      // the lesser images on the lower step (drawn as statues: robe, face, crown, a halo behind)
      [[-1.25, 0x2a6a3a, 0xe8c08a, 0.36], [-0.82, 0xb8241a, 0xd8a070, 0.42], [0.82, 0xd8a83a, 0xe8c08a, 0.42], [1.25, 0x1a2a5a, 0x6a4a2a, 0.36]]
        .forEach(([x, robe, face, h], i) => mkDeity(g, x, ALT.top + 0.2, -9.5, h, robe, face, i));
      // Guan Gong on the upper step (Chad's scan, from episode 1's tentage), a red plinth under him
      box(0.62, 0.12, 0.34, 0, ALT.top + 0.56, -9.74, matLacqIn, g); box(0.64, 0.02, 0.36, 0, ALT.top + 0.62, -9.74, matGold, g, false);
      { const hold = new THREE.Group(); hold.position.set(0, ALT.top + 0.63, -9.74); g.add(hold);
        const ph = new THREE.Mesh(new THREE.CapsuleGeometry(0.16, 0.6, 4, 8), matLacq); ph.position.y = 0.48; hold.add(ph);
        parseOnce('guangong').then(gl => {
          if (!alive) return;
          const s = gl.scene.clone(true);
          s.updateMatrixWorld(true);
          let b1 = new THREE.Box3().setFromObject(s);
          if ((b1.max.z - b1.min.z) > (b1.max.y - b1.min.y) * 1.4) { s.rotation.x = -Math.PI / 2; s.updateMatrixWorld(true); b1 = new THREE.Box3().setFromObject(s); }
          s.scale.setScalar(1.12 / (b1.max.y - b1.min.y)); s.updateMatrixWorld(true);
          const b2 = new THREE.Box3().setFromObject(s);
          s.position.set(-(b2.min.x + b2.max.x) / 2, -b2.min.y, -(b2.min.z + b2.max.z) / 2);
          const yawG = new THREE.Group(); yawG.rotation.y = GG_FACE; yawG.add(s); hold.add(yawG);
          s.traverse(o => { if (o.isMesh) { o.castShadow = false; o.receiveShadow = true; } });
          ph.visible = false;
        }).catch(err => { console.warn('guangong failed to load', err); ctx.loadFail && ctx.loadFail('guangong', err); }); }
      // the red lamps: a lotus lamp each side on the cabinet, two electric candles on the step
      for (const s of [-1, 1]) {
        cyl(0.012, 0.016, 0.42, s * 1.36, ALT.top + 0.21, -9.3, matGold, 6, g);
        const lb = new THREE.Mesh(new THREE.SphereGeometry(0.07, 10, 8), matRedLamp); lb.scale.y = 0.8; lb.position.set(s * 1.36, ALT.top + 0.45, -9.3); g.add(lb);
        for (let p = 0; p < 6; p++) { const pt = box(0.05, 0.012, 0.09, s * 1.36 + Math.cos(p * 1.05) * 0.07, ALT.top + 0.4, -9.3 + Math.sin(p * 1.05) * 0.07, matLacq, g, false); pt.rotation.y = -p * 1.05; pt.rotation.z = 0.5; }
        const hl = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 0.7), addGlow(glowRed, 0.6)); hl.position.set(s * 1.36, ALT.top + 0.45, -9.2); g.add(hl);
        shrLife.lanterns.push({ halo: hl, bill: true });
        cyl(0.035, 0.035, 0.3, s * 1.12, ALT.top + 0.35, -9.42, matLacq, 10, g);
        mkFlame(g, s * 1.12, ALT.top + 0.52, -9.42, 0.6);
      }
      // the red glow the lamps throw on the niche's back
      const wash = new THREE.Mesh(new THREE.PlaneGeometry(3.0, 2.1), addGlow(glowRed, 0.32)); wash.position.set(0, ALT.top + 0.95, -9.9); g.add(wash);
    }
    // the offering table before the altar: the urn, candles, fruit, tea, flowers
    const OFT = { z: -8.55, top: 0.84 };
    { const g = new THREE.Group(); shrG.add(g);
      const t = box(2.3, OFT.top, 0.7, 0, OFT.top / 2, OFT.z, matLacqIn, g); solids.push(t);
      box(2.36, 0.025, 0.76, 0, OFT.top + 0.012, OFT.z, matLacq, g, false);
      plane(2.3, 0.7, texMat(makeAltarCloth(THREE, cnv), { roughness: 0.85 }), 0, OFT.top - 0.36, OFT.z + 0.383, 0, g);
      mkUrn(g, 0, OFT.top + 0.025, OFT.z - 0.05, 0.16, 9, 3);
      for (const s of [-1, 1]) {
        cyl(0.05, 0.07, 0.08, s * 0.85, OFT.top + 0.065, OFT.z, matBronze, 10, g);
        cyl(0.03, 0.03, 0.34, s * 0.85, OFT.top + 0.27, OFT.z, matLacq, 10, g);
        mkFlame(g, s * 0.85, OFT.top + 0.46, OFT.z, 0.8);
        mkFruit(g, s * 0.48, OFT.top + 0.025, OFT.z + 0.12);
        // chrysanthemums in a vase
        cyl(0.05, 0.07, 0.22, s * 1.02, OFT.top + 0.135, OFT.z - 0.16, matBronze, 10, g);
        const fl = new THREE.InstancedMesh(new THREE.SphereGeometry(0.03, 6, 4), new THREE.MeshStandardMaterial({ color: 0xf0c020, roughness: 0.8 }), 9), m4 = new THREE.Matrix4();
        for (let i = 0; i < 9; i++) { m4.makeTranslation(s * 1.02 + Math.cos(i * 0.7) * 0.06, OFT.top + 0.3 + (i % 3) * 0.04, OFT.z - 0.16 + Math.sin(i * 0.7) * 0.06); fl.setMatrixAt(i, m4); }
        g.add(fl);
      }
      for (let i = 0; i < 3; i++) cyl(0.022, 0.016, 0.03, -0.18 + i * 0.18, OFT.top + 0.04, OFT.z + 0.22, matWhite, 10, g);
    }

    /* ---- THE MEDIUM'S TABLE, and every tool on it */
    const MTB = { x: 0, z: -6.62, top: 0.78, w: 1.35, d: 0.66 };
    { const g = new THREE.Group(); g.position.set(MTB.x, 0, MTB.z); shrG.add(g);
      for (const sx of [-1, 1]) for (const sz of [-1, 1]) box(0.06, MTB.top - 0.04, 0.06, sx * (MTB.w / 2 - 0.06), (MTB.top - 0.04) / 2, sz * (MTB.d / 2 - 0.06), matLacqIn, g);
      box(MTB.w, 0.04, MTB.d, 0, MTB.top - 0.02, 0, matLacq, g);
      box(MTB.w + 0.02, 0.26, 0.01, 0, MTB.top - 0.15, MTB.d / 2 + 0.01, matLacq, g, false);
      box(MTB.w + 0.02, 0.025, 0.012, 0, MTB.top - 0.03, MTB.d / 2 + 0.017, matGold, g, false);
      box(MTB.w + 0.02, 0.025, 0.012, 0, MTB.top - 0.27, MTB.d / 2 + 0.017, matGold, g, false);
      const T = MTB.top;
      // the talismans: a stack, and one laid out with its brush beside it
      box(0.13, 0.03, 0.3, -0.5, T + 0.015, -0.05, matYellow, g, false);
      const tal = plane(0.11, 0.3, texMat(makeTalisman(THREE, cnv, 4), { roughness: 0.85 }), -0.3, T + 0.003, 0.0, 0, g); tal.rotation.x = -Math.PI / 2; tal.rotation.z = 0.12;
      talLaid = tal;
      const brush = cyl(0.006, 0.004, 0.22, -0.16, T + 0.012, 0.02, matWoodL, 6, g); brush.rotation.x = Math.PI / 2; brush.rotation.z = 0.25;
      box(0.11, 0.022, 0.16, -0.3, T + 0.011, -0.22, matInk, g, false);
      // the seal and its red pad, the bell, the command flags, the tea
      cyl(0.045, 0.045, 0.018, -0.02, T + 0.009, 0.12, new THREE.MeshStandardMaterial({ color: 0xb01010, roughness: 0.7 }), 12, g);
      box(0.05, 0.08, 0.05, 0.08, T + 0.04, 0.12, matWoodL, g, false);
      { const bell = new THREE.Group(); bell.position.set(0.24, T, 0.08); g.add(bell); bellG = bell;
        const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.045, 0.07, 12, 1, true), matBronzeD); cup.position.y = 0.035; bell.add(cup);
        cyl(0.01, 0.012, 0.1, 0, 0.12, 0, matWoodL, 6, bell); }
      { cyl(0.04, 0.035, 0.12, 0.5, T + 0.06, -0.2, matLacqIn, 10, g);
        ['#c8241a', '#e8c040', '#2a8a3a', '#141414', '#f0eee8'].forEach((c, i) => {
          const a = -0.5 + i * 0.25, st = cyl(0.004, 0.004, 0.42, 0.5 + Math.sin(a) * 0.08, T + 0.3, -0.2 + Math.cos(a) * 0.02, matWoodL, 4, g); st.rotation.z = -a * 0.35;
          const tri = new THREE.Shape(); tri.moveTo(0, 0); tri.lineTo(0, 0.1); tri.lineTo(0.075, 0.05); tri.closePath();
          const fg = new THREE.Mesh(new THREE.ShapeGeometry(tri), new THREE.MeshStandardMaterial({ color: c, side: THREE.DoubleSide, roughness: 0.8 }));
          owned.push({ dispose: () => fg.material.dispose() });
          fg.position.set(0.5 + Math.sin(a) * 0.08 + Math.sin(-a * 0.35) * 0.21, T + 0.4, -0.2 + Math.cos(a) * 0.02); fg.rotation.z = -a * 0.35; g.add(fg);
        }); }
      for (let i = 0; i < 3; i++) cyl(0.022, 0.016, 0.03, 0.34 + i * 0.07, T + 0.015, -0.12, matWhite, 10, g);
      { const pot = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 8), new THREE.MeshStandardMaterial({ color: 0x6a3a1c, roughness: 0.5 })); pot.scale.y = 0.8; pot.position.set(0.18, T + 0.05, -0.2); g.add(pot); }
      // a small urn of his own, a candle, and the sword across the front
      mkUrn(g, -0.05, T, -0.24, 0.07, 3, 3);
      cyl(0.025, 0.025, 0.18, -0.5, T + 0.09, -0.24, matLacq, 10, g); mkFlame(g, -0.5, T + 0.2, -0.24, 0.45);
      { const sw = new THREE.Group(); sw.position.set(0.02, T + 0.02, 0.24); sw.rotation.y = 0.04; g.add(sw); swordG = sw;
        // (chrome with nothing to reflect drew the blade near black in his hand — a lighter steel reads as steel)
        const blade = new THREE.MeshStandardMaterial({ color: 0xdfe4ea, roughness: 0.26, metalness: 0.42 }); owned.push({ dispose: () => blade.dispose() });
        /* a seven-star sword (七星剑): a blade that narrows to a point with a
           bevelled edge to catch the lamps (photographed in his hand, the flat
           box read as a grey bar), and the Dipper's seven gold stars along it */
        { const sh = new THREE.Shape(), L0 = -0.21, L1 = 0.45, w0 = 0.017, w1 = 0.012;
          sh.moveTo(L0, -w0); sh.lineTo(L1 - 0.07, -w1); sh.lineTo(L1, 0); sh.lineTo(L1 - 0.07, w1); sh.lineTo(L0, w0); sh.lineTo(L0, -w0);
          const bg = new THREE.ExtrudeGeometry(sh, { depth: 0.002, bevelEnabled: true, bevelThickness: 0.0016, bevelSize: 0.0028, bevelSegments: 1, steps: 1 });
          bg.rotateX(Math.PI / 2); bg.translate(0, 0.001, 0);
          const bm = new THREE.Mesh(bg, blade); sw.add(bm); owned.push({ dispose: () => bg.dispose() });
          const sg = new THREE.CircleGeometry(0.0042, 10); owned.push({ dispose: () => sg.dispose() });
          [[-0.14, 0.004], [-0.08, -0.005], [-0.02, 0.003], [0.04, -0.004], [0.11, 0.0], [0.17, 0.005], [0.24, -0.003]].forEach(([x, z]) => {
            for (const sd of [1, -1]) { const st = new THREE.Mesh(sg, matGold); st.rotation.x = -sd * Math.PI / 2; st.position.set(x, sd * 0.0029, z); sw.add(st); }
          }); }
        box(0.025, 0.03, 0.12, -0.22, 0, 0, matGold, sw, false);
        const hilt = cyl(0.014, 0.014, 0.16, -0.31, 0, 0, matBlack, 8, sw); hilt.rotation.z = Math.PI / 2;
        box(0.012, 0.012, 0.012, -0.4, 0, 0, matGold, sw, false);
        const tas = cyl(0.012, 0.004, 0.12, -0.42, -0.02, 0.03, new THREE.MeshStandardMaterial({ color: 0xc81a10, roughness: 0.8 }), 6, sw); tas.rotation.x = 0.4; }
      solids.push(hidBox(MTB.w, 1.4, MTB.d, MTB.x, 0.7, MTB.z, shrG));
    }

    /* ---- the assistant's desk, the queue board, the drum and the gong */
    const ASD = { x: 3.0, z: -6.5 };
    { const g = new THREE.Group(); g.position.set(ASD.x, 0, ASD.z); shrG.add(g);
      for (const sx of [-1, 1]) for (const sz of [-1, 1]) box(0.04, 0.7, 0.04, sx * 0.38, 0.35, sz * 0.24, matSteel, g);
      box(0.84, 0.03, 0.56, 0, 0.72, 0, matWoodL, g);
      const book = new THREE.Group(); book.position.set(0.0, 0.736, 0.02); book.rotation.y = -Math.PI / 2; g.add(book);
      for (const s of [-1, 1]) { const pg = box(0.15, 0.008, 0.21, s * 0.077, 0.004, 0, matWhite, book, false); pg.rotation.z = -s * 0.04; }
      box(0.006, 0.006, 0.14, 0.12, 0.74, 0.12, matInk, g, false);
      box(0.2, 0.08, 0.14, -0.22, 0.775, -0.12, new THREE.MeshStandardMaterial({ color: 0xb8241a, roughness: 0.5 }), g, false);   // the cash tin
      solids.push(hidBox(0.84, 1.4, 0.56, ASD.x, 0.7, ASD.z, shrG));
      plane(0.6, 0.4, new THREE.MeshBasicMaterial({ map: tex(makeQueueBoard(THREE, cnv)), fog: true }), SB.x1 - 0.01, 1.75, ASD.z, -Math.PI / 2, shrG);
      // the drum on its stand, and the gong in its frame, in the corner behind him
      const dg = new THREE.Group(); dg.position.set(2.35, 0, -8.95); shrG.add(dg);
      for (let i = 0; i < 4; i++) { const a = i * Math.PI / 2 + Math.PI / 4; const lg = box(0.04, 0.78, 0.04, Math.cos(a) * 0.26, 0.39, Math.sin(a) * 0.26, matWood, dg); lg.rotation.z = Math.cos(a) * 0.08; lg.rotation.x = -Math.sin(a) * 0.08; }
      const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.36, 18, 1, false), matLacq); barrel.position.y = 0.96; barrel.scale.set(1, 1, 1); dg.add(barrel);
      cyl(0.31, 0.31, 0.02, 0, 1.14, 0, matCream, 18, dg); cyl(0.31, 0.31, 0.02, 0, 0.78, 0, matCream, 18, dg);
      for (const s of [-1, 1]) { const st = cyl(0.012, 0.01, 0.38, s * 0.08, 1.17, 0.05, matWoodL, 6, dg); st.rotation.z = Math.PI / 2 - s * 0.3; }
      solids.push(hidBox(0.7, 1.4, 0.7, 2.35, 0.7, -8.95, shrG));
      const gg = new THREE.Group(); gg.position.set(3.65, 0, -9.3); gg.rotation.y = -0.35; shrG.add(gg);
      for (const s of [-1, 1]) box(0.06, 1.7, 0.06, s * 0.36, 0.85, 0, matWood, gg);
      box(0.84, 0.07, 0.07, 0, 1.68, 0, matLacq, gg);
      const gong = cyl(0.27, 0.27, 0.025, 0, 1.12, 0, matBronze, 24, gg); gong.rotation.x = Math.PI / 2;
      cyl(0.08, 0.08, 0.04, 0, 1.12, 0.012, matBronze, 16, gg).rotation.x = Math.PI / 2;
      for (const s of [-1, 1]) { const c = cyl(0.004, 0.004, 0.3, s * 0.2, 1.48, 0, matSteel, 4, gg); c.rotation.z = s * 0.6; }
      solids.push(hidBox(0.9, 1.4, 0.4, 3.65, 0.7, -9.3, shrG));
    }

    /* ---- the great urn by the door, the joss-stick table, the earth god */
    const URN = { x: 0, z: -1.75 };
    { const g = new THREE.Group(); g.position.set(URN.x, 0, URN.z); shrG.add(g);
      cyl(0.36, 0.4, 0.5, 0, 0.25, 0, matStone, 16, g);
      cyl(0.39, 0.39, 0.04, 0, 0.52, 0, matStone, 16, g);
      bigUrn = mkUrn(g, 0, 0.54, 0, 0.3, 46, 3, true);
      for (const o of bigUrn.userData.lit) o.visible = false;
      solids.push(hidBox(0.8, 1.2, 0.8, URN.x, 0.6, URN.z, shrG));
    }
    const JOSS = { x: -1.6, z: -1.2 };
    { const g = new THREE.Group(); g.position.set(JOSS.x, 0, JOSS.z); shrG.add(g);
      for (const sx of [-1, 1]) for (const sz of [-1, 1]) box(0.04, 0.8, 0.04, sx * 0.36, 0.4, sz * 0.21, matLacqIn, g);
      box(0.8, 0.03, 0.5, 0, 0.815, 0, matLacq, g);
      box(0.38, 0.06, 0.11, -0.05, 0.86, 0.06, new THREE.MeshStandardMaterial({ color: 0xc0201a, roughness: 0.6 }), g, false);
      { const sticks = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.0025, 0.0025, 0.34, 4), new THREE.MeshStandardMaterial({ color: 0x9a3a1c, roughness: 0.8 }), 40), m4 = new THREE.Matrix4(), q = new THREE.Quaternion();
        for (let i = 0; i < 40; i++) { q.setFromEuler(new THREE.Euler(0, 0, Math.PI / 2 + (hash(i, 3) - 0.5) * 0.06)); m4.compose(new THREE.Vector3(-0.05 + (hash(i, 1) - 0.5) * 0.02, 0.9 + (i % 4) * 0.006, 0.03 + (i % 8) * 0.007), q, new THREE.Vector3(1, 1, 1)); sticks.setMatrixAt(i, m4); }
        g.add(sticks); }
      for (const s of [-1, 1]) { cyl(0.04, 0.05, 0.05, s * 0.28, 0.855, -0.1, matBronze, 10, g); cyl(0.035, 0.035, 0.26, s * 0.28, 1.0, -0.1, matLacq, 10, g); mkFlame(g, s * 0.28, 1.15, -0.1, 0.7); }
      box(0.22, 0.24, 0.16, 0.24, 0.95, 0.1, new THREE.MeshStandardMaterial({ color: 0xa8140e, roughness: 0.5 }), g, false);   // the donation box
      plane(0.16, 0.08, new THREE.MeshBasicMaterial({ map: tex(makeSignTxt(THREE, cnv, '功德', '#a8140e', '#ffd86a', 2.0)) }), 0.24, 0.98, 0.181, 0, g);
      box(0.16, 0.05, 0.12, 0.05, 0.855, -0.14, new THREE.MeshStandardMaterial({ color: 0xd8b040, roughness: 0.7 }), g, false);
      solids.push(hidBox(0.8, 1.4, 0.5, JOSS.x, 0.7, JOSS.z, shrG));
    }
    // the earth god, on the floor by the door: his red cabinet, a red lamp, a small urn
    { const g = new THREE.Group(); g.position.set(4.0, 0, -0.55); g.rotation.y = -Math.PI / 2 + 0.35; shrG.add(g);
      box(0.46, 0.4, 0.34, 0, 0.2, 0, matLacq, g); box(0.5, 0.05, 0.38, 0, 0.42, 0, matGold, g, false);
      plane(0.3, 0.26, new THREE.MeshBasicMaterial({ map: tex(makeSignTxt(THREE, cnv, '地主', '#5a0a06', '#ffd86a', 1.15)) }), 0, 0.22, 0.171, 0, g);
      const lb = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 6), matRedLamp); lb.position.set(0.15, 0.48, 0.05); g.add(lb);
      const hl = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.5), addGlow(glowRed, 0.6)); hl.position.set(0.15, 0.48, 0.1); g.add(hl); shrLife.lanterns.push({ halo: hl, bill: true });
      mkUrn(g, -0.08, 0.0, 0.3, 0.07, 3, 3);
      solids.push(hidBox(0.5, 1.0, 0.5, 4.0, 0.5, -0.55, shrG)); }

    /* ---- the stools along the left wall for the waiting (his among them),
       and a stack of them in the corner by the door */
    const MYSTOOL = { x: -2.55, z: -4.7 };
    for (const [x, z, c] of [[-2.55, -3.7, 0x2a64b4], [MYSTOOL.x, MYSTOOL.z, 0xc8261c], [-2.55, -5.7, 0x2a64b4]]) {
      plasticStool(shrG, x, z, 0.45, c);
      if (x !== MYSTOOL.x || z !== MYSTOOL.z) solids.push(hidBox(0.34, 0.9, 0.34, x, 0.45, z, shrG));   // (the two others block: GF-7; his own is the place he sits)
    }
    for (let i = 0; i < 5; i++) { const s = plasticStool(shrG, -3.95, -0.6, 0.45, 0xc8261c); s.position.y = i * 0.07; s.rotation.y = i * 0.05; }
    solids.push(hidBox(0.5, 1.0, 0.5, -3.95, 0.5, -0.6, shrG));

    /* ---- the walls' things: talismans over the door and by the altar, the
       deity painting, a clock, the steel cabinet, the back door's curtain
       (the door's pair on the transom over the opening — at 2.35 they hung in
       the open bay with nothing holding them) */
    [[-2.6, 2.98, -0.27, 0], [-1.9, 2.98, -0.27, 1], [2.0, 2.4, -9.98, 2], [-2.0, 2.4, -9.98, 3], [SB.x1 - 0.01, 2.2, -3.0, 4], [SB.x0 + 0.01, 2.2, -7.6, 5]]
      .forEach(([x, y, z, i]) => {
        const ry = Math.abs(x - SB.x1) < 0.05 ? -Math.PI / 2 : Math.abs(x - SB.x0) < 0.05 ? Math.PI / 2 : z < -5 ? 0 : Math.PI;
        plane(0.13, 0.4, texMat(makeTalisman(THREE, cnv, 11 + i), { roughness: 0.85 }), x, y, z, ry, shrG);
      });
    plane(0.62, 0.92, texMat(makeDeityPainting(THREE, cnv), { roughness: 0.7 }), SB.x1 - 0.012, 1.95, -3.6, -Math.PI / 2, shrG);
    plane(0.62, 0.92, texMat(makeDeityPainting(THREE, cnv, '#6a1a12', '#d8a838'), { roughness: 0.7 }), SB.x0 + 0.012, 1.95, -3.2, Math.PI / 2, shrG);
    // a wall shelf of joss-paper bundles and red boxes, and a silk banner by the door
    box(0.26, 0.03, 1.2, SB.x0 + 0.14, 1.62, -5.2, matWoodL, shrG, false);     // along the wall (it was turned 90°: 0.74 m into the room at eye height)
    for (let i = 0; i < 5; i++) box(0.2, 0.12 + (i % 2) * 0.06, 0.2, SB.x0 + 0.14, 1.69 + (i % 2) * 0.03, -5.68 + i * 0.24, new THREE.MeshStandardMaterial({ color: [0xd8b040, 0xb8241a, 0xe8c860, 0x8a1a12, 0xd8b040][i], roughness: 0.75 }), shrG, false);
    plane(0.34, 1.3, new THREE.MeshStandardMaterial({ map: tex(makeCouplet(THREE, cnv, '有求必應')), roughness: 0.9, side: THREE.DoubleSide }), SB.x0 + 0.012, 1.95, -1.35, Math.PI / 2, shrG);
    plane(0.34, 0.34, texMat(makeClockFace(THREE, cnv), { roughness: 0.5 }), SB.x0 + 0.012, 2.55, -6.0, Math.PI / 2, shrG);
    { const cab = box(0.9, 1.8, 0.45, -3.7, 0.9, -9.45, new THREE.MeshStandardMaterial({ color: 0x8a9096, roughness: 0.45, metalness: 0.35 }), shrG); solids.push(cab);
      for (let i = 0; i < 3; i++) box(0.4, 0.22, 0.3, -3.85 + i * 0.2, 1.91 + (i % 2) * 0.06, -9.45, new THREE.MeshStandardMaterial({ color: i === 1 ? 0xd8b040 : 0xb8241a, roughness: 0.7 }), shrG); }
    { box(1.0, 2.2, 0.06, 3.5, 1.1, -9.97, matInk, shrG, false);
      plane(0.96, 1.9, new THREE.MeshStandardMaterial({ color: 0x8a1a12, roughness: 0.9, side: THREE.DoubleSide }), 3.5, 1.15, -9.9, 0, shrG); }

    /* ---- the light fittings: two tubes, a fan, the coils turning under the
       beams, two lanterns inside the door */
    for (const x of [-1.6, 1.6]) { box(0.06, 0.05, 1.3, x, SB.H - 0.03, -4.0, matSteel, shrG, false); box(0.04, 0.04, 1.22, x, SB.H - 0.07, -4.0, matTubeB, shrG, false);
      const gl = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 2.6), addGlow(glowWarm, 0.42)); gl.rotation.x = Math.PI / 2; gl.position.set(x, SB.H - 0.012, -4.0); shrG.add(gl); }
    { const pivot = new THREE.Group(); pivot.position.set(0, SB.H - 0.66, -4.6); shrG.add(pivot);
      const g = box(1.2, 0.02, 0.16, 0, 0.3, 0, matWood, pivot, false), g2 = box(0.16, 0.02, 1.2, 0, 0.3, 0, matWood, pivot, false);
      thai('ceilfan', 0, 0, 0, { s: 0.55, cast: false, parent: pivot, hide: [g, g2] });
      shrLife.fans.push(pivot); }
    for (const [x, z] of [[-1.5, -3.2], [1.5, -3.3], [-1.6, -5.9], [1.6, -5.8], [-2.7, -7.7], [2.6, -2.3]]) mkCoil(x, z);
    for (const x of [-2.25, 2.25]) mkLantern(x, 2.95, -0.75, 0.24, false);

    /* the builders World B uses (they add to shrG; every glow is painted) */
    function mkFlame(parent, x, y, z, s = 1) {
      const g = new THREE.Group(); g.position.set(x, y, z); parent.add(g);
      const core = new THREE.Mesh(new THREE.SphereGeometry(0.012 * s, 8, 6), matFlame); core.scale.y = 2.2; g.add(core);
      const glow = new THREE.Mesh(new THREE.PlaneGeometry(0.16 * s, 0.16 * s), addGlow(glowWarm, 0.55)); g.add(glow);
      shrLife.flames.push({ core, glow, ph: shrLife.flames.length * 1.7 });
      return g;
    }
    function mkSmoke(parent, x, y, z, n, h, w) {
      const g = new THREE.Group(); g.position.set(x, y, z); parent.add(g);
      const puffs = [];
      n = Math.round(n * 1.6);                   // (more of them, thinner: VB-6)
      for (let i = 0; i < n; i++) { const p = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), matSmoke.clone()); g.add(p); puffs.push(p); owned.push({ dispose: () => p.material.dispose() }); }
      shrLife.smokes.push({ g, puffs, h, w, sp: 0.16 + hash(x * 7, z * 3) * 0.08, ph: hash(x, z) });
      return g;
    }
    function mkUrn(parent, x, y, z, r, nStubs, nLit, big = false) {
      const g = new THREE.Group(); g.position.set(x, y, z); parent.add(g);
      const h = r * (big ? 1.0 : 0.8);
      const bowl = new THREE.Mesh(new THREE.CylinderGeometry(r, r * 0.84, h, 18, 1, true), matBronzeD); bowl.position.y = h / 2; g.add(bowl);
      cyl(r * 1.04, r * 1.04, r * 0.06, 0, h, 0, matBronze, 18, g);
      cyl(r * 0.84, r * 0.84, r * 0.05, 0, 0.0, 0, matBronze, 18, g);
      for (const s of [-1, 1]) { const ear = new THREE.Mesh(new THREE.TorusGeometry(r * 0.22, r * 0.05, 6, 12, Math.PI), matBronze); ear.position.set(s * r * 1.02, h * 0.95, 0); ear.rotation.y = Math.PI / 2; g.add(ear); }
      cyl(r * 0.98, r * 0.98, 0.01, 0, h - r * 0.08, 0, matSand, 18, g);
      if (nStubs) {
        const st = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.0028, 0.0028, 1, 4), new THREE.MeshStandardMaterial({ color: 0xa83a1c, roughness: 0.8 }), nStubs), m4 = new THREE.Matrix4(), q = new THREE.Quaternion();
        for (let i = 0; i < nStubs; i++) {
          const a = hash(i, r * 9) * Math.PI * 2, rr = Math.sqrt(hash(i, r * 3)) * r * 0.85, len = (big ? 0.05 : 0.02) + hash(i, 7) * (big ? 0.22 : 0.08);
          q.setFromEuler(new THREE.Euler((hash(i, 11) - 0.5) * 0.3, 0, (hash(i, 13) - 0.5) * 0.3));
          m4.compose(new THREE.Vector3(Math.cos(a) * rr, h - r * 0.08 + len / 2, Math.sin(a) * rr), q, new THREE.Vector3(1, len, 1)); st.setMatrixAt(i, m4);
        }
        g.add(st);
      }
      const lit = [];
      for (let i = 0; i < nLit; i++) {
        const sx = (i - (nLit - 1) / 2) * r * 0.22, L = big ? 0.36 : 0.16;
        const s = cyl(0.003, 0.003, L, sx, h + L / 2 - r * 0.08, 0.0, new THREE.MeshStandardMaterial({ color: 0xc0301c, roughness: 0.7 }), 4, g);
        const tip = new THREE.Mesh(new THREE.SphereGeometry(0.006, 6, 4), matEmber); tip.position.set(sx, h + L - r * 0.08, 0); g.add(tip);
        lit.push(s, tip);
      }
      mkSmoke(g, 0, h + (big ? 0.34 : 0.15), 0, big ? 7 : 4, big ? 1.1 : 0.5, big ? 0.22 : 0.1);
      g.userData.lit = lit;
      return g;
    }
    function mkFruit(parent, x, y, z) {
      const g = new THREE.Group(); g.position.set(x, y, z); parent.add(g);
      cyl(0.13, 0.1, 0.02, 0, 0.01, 0, matGold, 16, g);
      const om = new THREE.MeshStandardMaterial({ color: 0xf08a1a, roughness: 0.55 });
      for (let i = 0; i < 5; i++) { const o = new THREE.Mesh(new THREE.SphereGeometry(0.04, 10, 8), om); o.position.set(i < 4 ? Math.cos(i * 1.57) * 0.05 : 0, i < 4 ? 0.06 : 0.12, i < 4 ? Math.sin(i * 1.57) * 0.05 : 0); g.add(o); }
      owned.push({ dispose: () => om.dispose() });
    }
    /* a temple image in miniature, built (robe, face, crown and a halo behind) */
    function mkDeity(parent, x, y, z, h, robe, face, i) {
      const g = new THREE.Group(); g.position.set(x, y, z); parent.add(g);
      const rm = new THREE.MeshStandardMaterial({ color: robe, roughness: 0.45, metalness: 0.15 }), fm = new THREE.MeshStandardMaterial({ color: face, roughness: 0.5 });
      owned.push({ dispose: () => { rm.dispose(); fm.dispose(); } });
      cyl(h * 0.32, h * 0.36, h * 0.08, 0, h * 0.04, 0, matGold, 14, g);
      const body = new THREE.Mesh(new THREE.CylinderGeometry(h * 0.18, h * 0.3, h * 0.55, 14), rm); body.position.y = h * 0.36; g.add(body);
      box(h * 0.42, h * 0.06, h * 0.2, 0, h * 0.5, h * 0.06, matGold, g, false);
      const head = new THREE.Mesh(new THREE.SphereGeometry(h * 0.11, 12, 10), fm); head.position.y = h * 0.74; g.add(head);
      if (i % 2) { const beard = new THREE.Mesh(new THREE.ConeGeometry(h * 0.06, h * 0.16, 8), matInk); beard.position.set(0, h * 0.62, h * 0.07); beard.rotation.x = Math.PI; g.add(beard); }
      const crown = new THREE.Mesh(new THREE.CylinderGeometry(h * 0.08, h * 0.11, h * 0.12, 10), matGold); crown.position.y = h * 0.88; g.add(crown);
      const halo = new THREE.Mesh(new THREE.CircleGeometry(h * 0.2, 20), matGold); halo.position.set(0, h * 0.78, -h * 0.13); g.add(halo);
      return g;
    }
    /* a red paper lantern, lit from within (unlit material: it is the light) — its two shared materials are declared
       at the top of build(): the street's lanterns are made before this point, and a `let` here was still in its
       dead zone when they asked for it (the v21.1 deploy threw on boot) */
    function mkLantern(x, y, z, r, outside) {
      const g = new THREE.Group(); g.position.set(x, y, z); shrG.add(g);
      /* (one skin for all of them, and rounder: ending B holds a close-up on one — VB-9) */
      if (!lanternSkinMat) lanternSkinMat = new THREE.MeshBasicMaterial({ map: tex(makeLanternSkin(THREE, cnv)), fog: true });
      const skin = new THREE.Mesh(new THREE.SphereGeometry(r, 40, 24), lanternSkinMat);
      skin.scale.y = 0.82; g.add(skin);
      for (const s of [-1, 1]) cyl(r * 0.42, r * 0.42, r * 0.14, 0, s * r * 0.82, 0, matGold, 24, g);
      cyl(0.004, 0.004, SB.H - y - r * 0.9, 0, (SB.H - y) / 2 + r * 0.4, 0, matInk, 4, g);
      /* the tassel: a knot, a gold band, and a fringe that flares and is open at its end (it was a solid 8-sided
         rod with a flat dark end) */
      if (!tasselMat) tasselMat = new THREE.MeshStandardMaterial({ color: 0xc81a10, roughness: 0.9, side: THREE.DoubleSide });
      const knot = new THREE.Mesh(new THREE.SphereGeometry(r * 0.09, 12, 8), tasselMat); knot.position.y = -r * 0.9; g.add(knot);
      cyl(r * 0.07, r * 0.07, r * 0.05, 0, -r * 1.0, 0, matGold, 12, g);
      const tas = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.06, r * 0.19, r * 0.8, 24, 1, true), tasselMat); tas.position.y = -r * 1.42; g.add(tas);
      const hl = new THREE.Mesh(new THREE.PlaneGeometry(r * 4.5, r * 4.5), addGlow(glowRed, outside ? 0.5 : 0.38)); g.add(hl);
      shrLife.lanterns.push({ halo: hl, bill: true, sway: g, ph: x * 1.3 + z });
      return g;
    }
    /* an incense coil hung from a beam: a cone of spiral, a red tag, its
       burning end and a thread of smoke */
    function mkCoil(x, z) {
      const top = SB.H - 0.95, pts = [];
      for (let i = 0; i <= 120; i++) { const t = i / 120, a = t * Math.PI * 2 * 6.5, r = 0.02 + 0.19 * t; pts.push(new THREE.Vector3(Math.cos(a) * r, -0.05 - 0.3 * t, Math.sin(a) * r)); }
      const g = new THREE.Group(); g.position.set(x, top, z); shrG.add(g);
      const coil = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 240, 0.0055, 5, false), new THREE.MeshStandardMaterial({ color: 0x6a4a2c, roughness: 0.85 }));
      g.add(coil);
      cyl(0.003, 0.003, SB.H - top, 0, (SB.H - top) / 2, 0, matInk, 4, g);
      for (let k = 0; k < 3; k++) { const a = k * 2.094; const s = cyl(0.0015, 0.0015, 0.36, Math.cos(a) * 0.1, -0.13, Math.sin(a) * 0.1, matInk, 3, g); s.rotation.z = Math.cos(a) * 0.28; s.rotation.x = -Math.sin(a) * 0.28; }
      /* (one tag drawn for every coil: each drew its own 512×1024 sheet, six identical ones — PF-13) */
      if (!coilTagMat) coilTagMat = new THREE.MeshBasicMaterial({ map: tex(makeSignTxt(THREE, cnv, '福', '#c01a10', '#ffd86a', 0.5)), side: THREE.DoubleSide, fog: true });
      plane(0.07, 0.14, coilTagMat, 0, -0.34, 0, 0, g);
      const end = pts[pts.length - 1];
      const tip = new THREE.Mesh(new THREE.SphereGeometry(0.009, 6, 4), matEmber); tip.position.copy(end); g.add(tip);
      mkSmoke(g, end.x, end.y + 0.05, end.z, 4, 0.5, 0.1);
      shrLife.coils.push({ g, sp: 0.08 + hash(x, z) * 0.06 });
    }
    function shrineTick(wdt, t) {
      if (!shrPeople.visible) return;
      camera.getWorldQuaternion(_cq);
      for (const f of shrLife.flames) { f.core.scale.y = 2.2 * (1 + Math.sin(t * 11 + f.ph) * 0.16 + Math.sin(t * 23 + f.ph) * 0.07); f.glow.quaternion.copy(_cq); }
      /* the lanterns sway; a gust (ending B: "it heard me") swings them harder and faster, on an accumulated phase so it never jumps */
      const gu = shrLife.gust || 0, gA = 0.018 * (1 + 6 * gu);
      shrLife.swayPh = (shrLife.swayPh || 0) + wdt * (0.9 + 2.4 * gu);
      for (const l of shrLife.lanterns) { if (l.bill) l.halo.quaternion.copy(_cq); if (l.sway) { l.sway.rotation.z = gA * Math.sin(shrLife.swayPh + l.ph); l.sway.rotation.x = 0.5 * gA * gu * Math.sin(shrLife.swayPh * 1.3 + l.ph * 2); } }
      for (const p of shrLife.fans) p.rotation.y += wdt * 2.4;
      for (const c of shrLife.coils) c.g.rotation.y += wdt * c.sp;
      for (const s of shrLife.smokes) {
        for (let i = 0; i < s.puffs.length; i++) {
          const u = ((t * s.sp + i / s.puffs.length + s.ph) % 1), p = s.puffs[i];
          p.position.set(Math.sin(t * 0.7 + i * 1.3) * 0.04 * u, u * s.h, Math.cos(t * 0.5 + i) * 0.03 * u);
          /* WISPS, not orbs: each puff drawn tall and narrow on the screen (it faces the lens), thinner — against the
             medium's black robe the round ones read as grey discs and a glowing ball (VB-6, VC-9) */
          p.quaternion.copy(_cq); p.scale.set(0.03 + u * s.w * 0.5, 0.06 + u * s.w * 1.5, 1);
          p.material.opacity = 0.2 * Math.sin(Math.PI * u);
        }
      }
    }

    /* ---- WORLD B's PEOPLE: the medium in his chair; the assistant at his
       desk; the woman being read when he comes in, on the devotees' stool
       before the table; the father waiting his turn beside it. The stools
       stay where they stand when their people get up (shrPeople.attach). */
    const MED_AT = { x: LX(0), z: -7.55 };
    const WIFE_AT = { x: LX(-0.42), z: -5.82 }, FATHER_AT = { x: LX(1.32), z: -5.2 };
    const ASST_AT = { x: LX(3.62), z: -6.5 };
    const MED_SIT = 'Chair_Sit_Idle_M', MED_READ = 'Sitting_Answering_Questions', MED_NO = 'Sit_Finger_Wag_No';
    const WIFE_SIT = 'Armature|Sit_Cross_Legged|baselayer', ASST_CLAP = 'Armature|Sitting_Clap|baselayer', ASST_REST = 0.0;
    const stoolStays = (r) => { if (r.stool) { r.stool.updateWorldMatrix(true, false); shrPeople.attach(r.stool); } };
    /* sized STANDING (on his walk's first frame): sized on the seated take a
       seated span read as his full height, and he stood 2.3 m tall in every
       ending that stands him up (the v21.0 review) */
    const medium = mkRig('medium', { parent: shrPeople, x: MED_AT.x, z: MED_AT.z, ry: 0, height: 1.74, idle: 'Chair_Sit_Idle_M', look: 0,
      sizeOn: 'Walking', then: (r) => seatMedium(r) });
    const asst = mkRig('sitman', { parent: shrPeople, x: ASST_AT.x, z: ASST_AT.z, ry: -Math.PI / 2, height: 1.25, idle: ASST_CLAP, at: ASST_REST, seated: true, stool: 0x2a64b4 });
    const wife = mkRig('sitwoman', { parent: shrPeople, x: WIFE_AT.x, z: WIFE_AT.z, ry: Math.PI, height: 1.2, idle: WIFE_SIT, seated: true, stool: 0xc8261c, anims: ['sitwomantalk', 'wifewalk'], then: stoolStays, splitTalk: true, standH: 1.64, walkDy: -0.024 });
    /* v21.8 (Chad: "For the other male customer, i dont want that customer to be doing that fist pumping animation,
       maybe replace that with another 3D male model"): the father is the botak man now, sized STANDING on his own walk
       (the parade square's frame, 0.122) and seated on his own Chair_Sit_Idle_M parked inside its UPRIGHT window —
       the take folds him over for more than half its length (e2c1's v8.0 measure), so it is never played through;
       his own Walking takes him out */
    const father = mkRig('botak', { parent: shrPeople, x: FATHER_AT.x, z: FATHER_AT.z, ry: Math.atan2(MED_AT.x - FATHER_AT.x, MED_AT.z - FATHER_AT.z), height: 1.72, sizeOn: 'Walking', sizeAt: 0.122, idle: 'Chair_Sit_Idle_M', at: 0.06, seated: true, stool: 0x2a64b4, then: stoolStays, standH: 1.72 });

    /* THE MEDIUM'S CHAIR, built round his own seated takes (e3c1's v17.1 law:
       the seat is ours, the sitting is the take's): each take's hips measured
       in his group's frame so a change of take never slides him (rootComp),
       his soles put on the floor, the cushion under the underside of his
       thighs, the back just clear of his own, the arms either side. */
    const LOWER_RE = /(Hips|UpLeg|Leg|Foot|Toe)/;
    function splitTake(r, take, lower, tag) {
      const a = r.acts[take]; if (!a) return;
      const c = a.getClip(), tracks = c.tracks.filter(t => LOWER_RE.test(t.name.split('.')[0]) === lower);
      r.acts[take + tag] = r.mixer.clipAction(new THREE.AnimationClip(take + tag, c.duration, tracks));
    }
    /* the medium's seated takes: MED_SIT whole, or MED_SIT's legs under
       another take's upper body — a crossfade either way (the legs' tracks
       hand over to themselves, so they never move) */
    const medOn = new Set();
    /* v21.1: HIS REST IS THE TAKE'S UPRIGHT STRETCH. Chair_Sit_Idle_M is the
       take v8.0 wrote down as "not an idle": measured by FK over medium.glb's
       own 10.67 s, his head stands 0.40 over his hips from 0 to 1.3 s and from
       9.2 s to the end, and for the five seconds between it drops to 0.18 and
       slides 0.32 forward — he folded over his table for three quarters of
       every loop, and under every reading his hips (MED_SIT^low) tipped the
       talking take forward with them. So both are driven on WALL time through
       that stretch only — 9.2 s round the loop's seam to 1.2 s, a slow there
       and back (the seam is continuous: 0.402 / 0.049 either side) — the way
       e2c1's riders sit inside their take's upright window. */
    const MED_WIN = [9.2, 1.2];
    let medRestT = 0;
    function medRestTick(wdt) {
      const r = medium; if (!r.acts) return;
      medRestT += Math.min(wdt, 0.25);
      for (const k of [MED_SIT, MED_SIT + '^low']) {
        const a = r.acts[k]; if (!a || !medOn.has(k)) continue;
        const dur = a.getClip().duration, span = dur - MED_WIN[0] + MED_WIN[1];
        let t = MED_WIN[0] + span * (0.5 - 0.5 * Math.cos(medRestT * Math.PI / (span * 1.4)));
        if (t >= dur) t -= dur;
        a.paused = true; a.time = t;
      }
    }
    function medPose(name, fade = 0.45, ts = 1) {
      const r = medium; if (!r.acts || !r.acts[MED_SIT]) return;
      const want = name === MED_SIT ? [MED_SIT] : (r.acts[name + '^up'] ? [MED_SIT + '^low', name + '^up'] : [name]);
      for (const k of [...medOn]) if (!want.includes(k)) { r.acts[k].fadeOut(fade); medOn.delete(k); }
      for (const k of want) {
        const a = r.acts[k]; if (!a) continue;
        a.setEffectiveTimeScale(ts);
        if (medOn.has(k)) continue;
        a.reset(); a.setEffectiveWeight(1); a.play(); if (fade > 0) a.fadeIn(fade);
        medOn.add(k);
      }
      r.cur = name;
    }
    function seatMedium(r) {
      if (!r.hips || !r.acts) return;
      for (const t of [MED_READ, MED_NO]) splitTake(r, t, false, '^up');
      splitTake(r, MED_SIT, true, '^low');
      const takes = [MED_SIT];
      const hipAt = {}, seats = [], all = [];
      for (const take of takes) {
        let hx = 0, hz = 0, n = 0;
        /* measured over the poses he will actually rest in (MED_WIN), never across the fold */
        const tdur = r.acts[take].getClip().duration;
        for (const k of [9.2, 9.9, 10.5, 0.4, 1.1].map(s => Math.min(s, tdur) / tdur)) {
          r.play(take, 1, 0, false, k); r.mixer.update(0); r.model.updateMatrixWorld(true);
          r.hips.getWorldPosition(_v); const hy = _v.y, wx = _v.x, wz = _v.z;
          const hl = r.group.worldToLocal(_v.clone()); hx += hl.x; hz += hl.z; n++;
          const m = { sole: Infinity, seat: Infinity, toe: -Infinity, back: Infinity, wide: 0 }, pts = [];
          r.model.traverse(o => {
            if (!o.isSkinnedMesh) return;
            o.skeleton.update();
            const N = o.geometry.attributes.position.count;
            for (let i = 0; i < N; i += 5) {
              o.getVertexPosition(i, _sv); _sv.applyMatrix4(o.matrixWorld);
              const along = _sv.z - wz, side = _sv.x - wx;              // he faces +z (ry 0)
              pts.push(_sv.y, along, side);
              if (_sv.y < m.sole) m.sole = _sv.y;
              if (Math.abs(side) < 0.2 && along > -0.22 && along < 0.04 && _sv.y < hy + 0.05 && _sv.y > hy - 0.45 && _sv.y < m.seat) m.seat = _sv.y;
            }
          });
          for (let i = 0; i < pts.length; i += 3) {
            const y = pts[i], along = pts[i + 1], side = pts[i + 2];
            if (y < m.sole + 0.14) { if (along > m.toe) m.toe = along; m.wide = Math.max(m.wide, Math.abs(side)); }
            if (Math.abs(side) < 0.24 && y > m.seat + 0.14 && y < m.seat + 0.62 && along < m.back) m.back = along;
          }
          all.push({ ...m, take });
          if (isFinite(m.seat)) seats.push(m.seat);
        }
        hipAt[take] = [hx / n, hz / n];
      }
      const ref = hipAt[MED_SIT] || [0, 0];
      for (const a of Object.values(r.acts)) a.stop();
      medOn.clear(); r.cur = null; medPose(MED_SIT, 0); headPre(r); spinePre(r); armsPre(r); r.mixer.update(0.0001); recapture(r);
      // the soles on the floor: the rest take's lowest skin to y 0
      const rest = all.filter(m => m.take === MED_SIT), sole = Math.min(...rest.map(m => m.sole));
      if (isFinite(sole)) { const dy = r.group.position.y - sole; r.model.position.y += dy; for (const m of all) { m.sole += dy; m.seat += dy; } for (let i = 0; i < seats.length; i++) seats[i] += dy; }
      r.rootBase = { x: r.model.position.x, z: r.model.position.z };
      r.baseY = r.model.position.y; r.yOff = r.yTo = 0;
      /* his EYES, where every shot of him aims: off his seated head bone (a
         Mixamo head bone sits ~10 cm under the eyes — v5.04), never a typed
         height, which was set against the 2.3 m man he was by mistake */
      if (r.head) { r.group.updateWorldMatrix(true, true); r.head.getWorldPosition(_v); MED_EYE.y = +(_v.y + 0.1).toFixed(3); }
      const seatY = seats.length ? (Math.min(...seats) + Math.max(...seats)) / 2 : 0.48;
      const back = Math.min(...all.map(m => m.back).filter(isFinite));
      const knee = Math.max(...all.map(m => m.toe).filter(isFinite)) - 0.2;
      const s0 = isFinite(back) ? Math.max(back - 0.04, -0.34) : -0.28, s1 = Math.min(0.4, Math.max(0.18, knee - 0.12));
      // the chair, in the world (he faces +z: along is +z from his hips)
      const hx = MED_AT.x + ref[0], hz = MED_AT.z + ref[1];
      const g = new THREE.Group(); g.position.set(hx - SHR.x, 0, hz); shrG.add(g);
      const CU = 0.06, top = seatY - CU, D = s1 - s0, zc = (s0 + s1) / 2, W = 0.7;
      box(W, 0.06, D, 0, top - 0.03, zc, matLacq, g);
      box(W - 0.06, CU, D - 0.04, 0, top + CU / 2, zc, new THREE.MeshStandardMaterial({ color: 0xa81810, roughness: 0.8 }), g);
      for (const sx of [-1, 1]) for (const sz of [s0 + 0.04, s1 - 0.04]) box(0.06, top - 0.06, 0.06, sx * (W / 2 - 0.04), (top - 0.06) / 2, sz, matLacqIn, g);
      box(W, 0.1, 0.03, 0, top - 0.11, s1, matLacq, g, false); box(W - 0.1, 0.02, 0.012, 0, top - 0.09, s1 + 0.016, matGold, g, false);
      const bh = 0.82;
      box(W, bh, 0.05, 0, top + bh / 2, s0 - 0.03, matLacq, g);
      box(W - 0.16, bh - 0.2, 0.012, 0, top + bh / 2 + 0.03, s0 - 0.002, matLacqIn, g, false);
      for (const [w, h, y] of [[W - 0.12, 0.02, top + 0.15], [W - 0.12, 0.02, top + bh - 0.06]]) box(w, h, 0.012, 0, y, s0 - 0.0, matGold, g, false);
      const roundel = new THREE.Mesh(new THREE.CircleGeometry(0.09, 20), matGold); roundel.position.set(0, top + bh * 0.62, s0 + 0.002); g.add(roundel);
      box(W + 0.14, 0.08, 0.08, 0, top + bh + 0.04, s0 - 0.03, matLacq, g);
      for (const sx of [-1, 1]) { const horn = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.12, 8), matGold); horn.position.set(sx * (W / 2 + 0.08), top + bh + 0.09, s0 - 0.03); horn.rotation.z = -sx * 0.9; g.add(horn); }
      for (const sx of [-1, 1]) {
        box(0.05, 0.05, D, sx * (W / 2 - 0.02), top + 0.24, zc, matLacq, g);
        box(0.05, 0.24, 0.05, sx * (W / 2 - 0.02), top + 0.12, s1 - 0.04, matLacq, g);
      }
      /* (built when his GLB lands, long after build() handed the engine its
         blockers — a push to `solids` here reached nothing, and he and his chair
         could be walked through: the box goes into the engine's own array) */
      lateSolid(hidBox(W + 0.1, 1.4, D + 0.12, hx - SHR.x, 0.7, hz + zc, shrG));
      r.chair = g;
      r.seatInfo = { seatY: +seatY.toFixed(3), s0: +s0.toFixed(3), s1: +s1.toFixed(3), sole: +sole.toFixed(3),
                     takes: all.map(m => [m.take, +m.seat.toFixed(3), +m.sole.toFixed(3), +m.toe.toFixed(3), +m.back.toFixed(3)]) };
      /* PF-4: his palms measured now, under the loading screen — a scan of every skinned vertex, twice, which ran on
         the roar's cut the first time he took up the sword and the bell (the palm is in the hand bone's own frame,
         so the pose it is measured in does not matter — the v21.1 review) */
      if (r.handR) palmOf(r, r.handR);
      if (r.handL) palmOf(r, r.handL);
      redoShadows();
    }
    function rootComp(r) {
      if (!r.rootOff || !r.model || !r.acts) return;
      let wx = 0, wz = 0, ws = 0;
      for (const [name, a] of Object.entries(r.acts)) {
        if (!a.isScheduled()) continue;
        const w = a.getEffectiveWeight(); if (!(w > 0)) continue;
        const o = r.rootOff[name]; ws += w;
        if (o) { wx += o[0] * w; wz += o[1] * w; }
      }
      if (ws <= 0) return;
      r.model.position.x = r.rootBase.x - wx / ws;
      r.model.position.z = r.rootBase.z - wz / ws;
    }

    /* ---- THE ROAR's own things: Chad's Hanuman as the medium sees him (gold
       light where the young man stood — a body of light over a glow, both
       unlit, both through the dark), and a gold flash over the lens */
    const hanuG = new THREE.Group(); hanuG.visible = false; hanuG.rotation.order = 'YXZ'; world.add(hanuG);
    const hanuMats = [];
    /* (its box until the file lands: a figure of its height, a forearm round) */
    const hanuLocal = new THREE.Box3(new THREE.Vector3(-0.55, 0, -0.5), new THREE.Vector3(0.55, 1.95, 0.5)), hanuPts = [];
    const echoG = [0, 1].map(() => { const g = new THREE.Group(); g.visible = false; g.rotation.order = 'YXZ'; world.add(g); return g; });
    const echoMats = [[], []];
    const _hM = new THREE.Matrix4(), _hQ = new THREE.Quaternion(), _hE = new THREE.Euler(0, 0, 0, 'YXZ'), _hS = new THREE.Vector3(1, 1, 1), _hP = new THREE.Vector3();
    parseOnce('hanuman').then(gl => {
      if (!alive) return;
      const src = gl.scene;
      src.updateMatrixWorld(true);
      const bb = new THREE.Box3().setFromObject(src), k = 1.95 / (bb.max.y - bb.min.y);
      /* (photographed: both layers drawn two-sided with no depth write summed
         every surface of 118k triangles front and back, and the additive one
         blew the whole figure out to a white blob with no face — now the body
         is one solid gold surface that hides its own far side, and the glow is
         a thin front-faced shell over it) */
      for (const [color, op, blend, sc, dw] of [[0xffd27a, 0.86, THREE.NormalBlending, 1.0, true], [0xffa83a, 0.26, THREE.AdditiveBlending, 1.02, false]]) {
        const m = src.clone(true);
        m.traverse(o => {
          if (!o.isMesh) return;
          const mt = new THREE.MeshBasicMaterial({ map: o.material.map || null, color, transparent: true, opacity: 0, depthWrite: dw, blending: blend, fog: false, side: THREE.FrontSide });
          mt.userData.peak = op; hanuMats.push(mt); owned.push({ dispose: () => mt.dispose() });
          o.material = mt; o.castShadow = false; o.receiveShadow = false; o.renderOrder = 3;
        });
        const w = new THREE.Group(); w.scale.setScalar(k * sc); w.position.y = -bb.min.y * k * sc;
        w.add(m); hanuG.add(w);
      }
      /* v21.8: its box in its own frame (the roar film frames it — the whole figure, raised arm and tail, on every
         screen shape), and two echoes of its glow that trail it down the line it lunges along */
      hanuLocal.set(new THREE.Vector3(bb.min.x * k, 0, bb.min.z * k), new THREE.Vector3(bb.max.x * k, (bb.max.y - bb.min.y) * k, bb.max.z * k));
      /* (and points ON it — every so many of the body's own vertices, in its frame: a box's corners stand well off a
         figure with one arm up and a tail out, and a frame fitted to them stood half a metre further back than the
         figure needs) */
      hanuG.updateMatrixWorld(true);
      const inv = new THREE.Matrix4().copy(hanuG.matrixWorld).invert(), mw = new THREE.Matrix4();
      hanuG.children[0].traverse(o => {
        if (!o.isMesh) return;
        const pa = o.geometry.attributes.position, st = Math.max(1, Math.floor(pa.count / 1500));
        mw.multiplyMatrices(inv, o.matrixWorld);
        for (let i = 0; i < pa.count; i += st) hanuPts.push(new THREE.Vector3().fromBufferAttribute(pa, i).applyMatrix4(mw));
      });
      for (let i = 0; i < 2; i++) {
        const m = src.clone(true);
        m.traverse(o => {
          if (!o.isMesh) return;
          const mt = new THREE.MeshBasicMaterial({ map: o.material.map || null, color: 0xffb347, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, fog: false, side: THREE.FrontSide });
          echoMats[i].push(mt); owned.push({ dispose: () => mt.dispose() });
          o.material = mt; o.castShadow = false; o.receiveShadow = false; o.renderOrder = 3;
        });
        const w = new THREE.Group(); w.scale.setScalar(k * 1.01); w.position.y = -bb.min.y * k * 1.01;
        w.add(m); echoG[i].add(w);
      }
    }).catch(err => { console.warn('hanuman failed to load', err); ctx.loadFail && ctx.loadFail('hanuman', err); });
    const flashM = new THREE.MeshBasicMaterial({ color: 0xffc860, transparent: true, opacity: 0, depthTest: false, depthWrite: false, blending: THREE.AdditiveBlending, fog: false });
    const flashQ = new THREE.Mesh(new THREE.PlaneGeometry(6, 6), flashM); flashQ.position.z = -0.5; flashQ.renderOrder = 9; flashQ.visible = false;
    camera.add(flashQ);
    owned.push({ dispose: () => { camera.remove(flashQ); flashQ.geometry.dispose(); flashM.dispose(); } });
    /* v21.8 · THE LUNGE's LIGHT (Chad: "i want the camera to pan to show the entire panning perspective of the
       hanuman looking like it lunged out towards the medium, with special glowing effects ... This moment needs to
       feel cinematic and powerful and impressive"): a halo that breathes behind the figure's body, embers coming off
       it, a streak of gold down the line it flies, and the ring that goes out of the medium when it reaches him — all
       unlit and additive (no light: the light count never changes, v15.1), each a pure function of the film's clock,
       so a seek or a skip lands on the same frame (v5.30) */
    const hfxG = new THREE.Group(); world.add(hfxG);
    const goldGlow = tex(makeGlowTex(THREE, cnv, [255, 200, 110])), ringTex = tex(makeShockRing(THREE, cnv)), streakTex = tex(makeStreak(THREE, cnv));
    const hfxMat = (map) => { const m = new THREE.MeshBasicMaterial({ map, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, fog: false, side: THREE.DoubleSide }); owned.push({ dispose: () => m.dispose() }); return m; };
    const halo = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), hfxMat(goldGlow)); halo.renderOrder = 4; halo.visible = false; hfxG.add(halo);
    const ring = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), hfxMat(ringTex)); ring.renderOrder = 6; ring.visible = false; hfxG.add(ring);
    const streaks = [0, 1].map(() => { const m = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), hfxMat(streakTex)); m.renderOrder = 4; m.visible = false; hfxG.add(m); return m; });
    const EMB = 90, embGeo = new THREE.BufferGeometry(), embSeed = [];
    { const r = rng(9107); for (let i = 0; i < EMB; i++) embSeed.push([r() * Math.PI * 2, 0.2 + r() * 0.5, r() * 2.1, 0.5 + r() * 1.2, (r() - 0.5) * 2.4, r()]); }
    embGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(EMB * 3), 3));
    const embMat = new THREE.PointsMaterial({ map: goldGlow, color: 0xffe0a0, size: 0.11, sizeAttenuation: true, transparent: true, opacity: 0,
                                              depthWrite: false, blending: THREE.AdditiveBlending, fog: false });
    owned.push({ dispose: () => embMat.dispose() });
    const embers = new THREE.Points(embGeo, embMat); embers.frustumCulled = false; embers.renderOrder = 5; embers.visible = false; hfxG.add(embers);
    const _fxV = new THREE.Vector3();
    const roarFx = {
      flash(k) { flashM.opacity = 0.85 * k; flashQ.visible = k > 0.002; },
      /* the figure at `at`, turned to face `to`, k its light, push a lunge along its facing; v21.8: `lift` off the
         floor and `tilt` forward into the lunge, about its own feet */
      hanu(k, at, to, push = 0, lift = 0, tilt = 0) {
        hanuG.visible = k > 0.002;
        if (!hanuG.visible) return;
        const ry = Math.atan2(to.x - at.x, to.z - at.z);
        hanuG.position.set(at.x + Math.sin(ry) * push, lift, at.z + Math.cos(ry) * push);
        hanuG.rotation.set(tilt, ry + HANU_FACE, 0, 'YXZ');
        for (const m of hanuMats) m.opacity = m.userData.peak * k;
      },
      /* its halo and its embers, at k, about its body where it is now; t the film's clock */
      aura(k, t) {
        halo.visible = embers.visible = k > 0.002;
        if (!halo.visible) return;
        hanuG.updateWorldMatrix(true, false);
        _fxV.set(0, 1.15, 0).applyMatrix4(hanuG.matrixWorld);
        halo.position.copy(_fxV); camera.getWorldQuaternion(halo.quaternion);
        halo.scale.setScalar(2.9 + 0.25 * Math.sin(t * 7.0));
        halo.material.opacity = 0.62 * k * (0.86 + 0.14 * Math.sin(t * 11.0));
        const EP = embGeo.attributes.position;
        for (let i = 0; i < EMB; i++) {
          const [a0, r0, y0, rise, spin, ph] = embSeed[i], u = (t * rise * 0.55 + ph) % 1, a = a0 + t * spin * 0.6, rr = r0 + u * 0.55;
          EP.setXYZ(i, _fxV.x + Math.cos(a) * rr, hanuG.position.y + 0.1 + ((y0 + u * 1.6) % 2.1), _fxV.z + Math.sin(a) * rr);
        }
        EP.needsUpdate = true;
        embMat.opacity = 0.95 * k;
      },
      /* a streak of gold down the line it flew, from `from` to `to`, at height y — one upright plane and one flat,
         the texture's hot end at its head */
      streak(k, from, to, y) {
        for (const m of streaks) m.visible = k > 0.002;
        if (k <= 0.002) return;
        const dx = to.x - from.x, dz = to.z - from.z, L = Math.max(0.05, Math.hypot(dx, dz)), ry = Math.atan2(dx, dz);
        streaks.forEach((m, i) => {
          m.position.set((from.x + to.x) / 2, y, (from.z + to.z) / 2);
          m.rotation.set(i ? -Math.PI / 2 : 0, ry - Math.PI / 2, 0, 'YXZ');
          m.scale.set(L + 0.6, i ? 0.9 : 1.3, 1);
          m.material.opacity = 0.75 * k;
        });
      },
      /* the ring going out of the medium when it reaches him */
      ring(k, at) {
        ring.visible = k > 0.002 && k < 0.998;
        if (!ring.visible) return;
        ring.position.set(at.x, at.y, at.z); camera.getWorldQuaternion(ring.quaternion);
        ring.scale.setScalar(0.35 + 3.8 * k);
        ring.material.opacity = 0.95 * (1 - k) * (1 - k);
      },
      /* v21.8: points on the figure in the world, posed as hanu() would pose it — what the roar film frames (its own
         vertices once the file has landed, its box's corners until then) */
      corners(at, to, push = 0, lift = 0, tilt = 0) {
        const ry = Math.atan2(to.x - at.x, to.z - at.z);
        _hP.set(at.x + Math.sin(ry) * push, lift, at.z + Math.cos(ry) * push);
        _hQ.setFromEuler(_hE.set(tilt, ry + HANU_FACE, 0, 'YXZ'));
        _hM.compose(_hP, _hQ, _hS);
        const b = hanuLocal, out = [];
        if (hanuPts.length) for (const p of hanuPts) { _fxV.copy(p).applyMatrix4(_hM); out.push({ x: _fxV.x, y: _fxV.y, z: _fxV.z }); }
        else for (const x of [b.min.x, b.max.x]) for (const y of [b.min.y, b.max.y]) for (const z of [b.min.z, b.max.z]) {
          _fxV.set(x, y, z).applyMatrix4(_hM); out.push({ x: _fxV.x, y: _fxV.y, z: _fxV.z });
        }
        return out;
      },
      /* v21.8: its echoes — each a gold afterimage of the figure where it was a moment before ([{ push, lift, tilt, k }]) */
      echoes(at, to, list) {
        const ry = Math.atan2(to.x - at.x, to.z - at.z);
        echoG.forEach((g, i) => {
          const e = list && list[i];
          g.visible = !!e && e.k > 0.002;
          if (!g.visible) return;
          g.position.set(at.x + Math.sin(ry) * e.push, e.lift, at.z + Math.cos(ry) * e.push);
          g.rotation.set(e.tilt, ry + HANU_FACE, 0, 'YXZ');
          for (const m of echoMats[i]) m.opacity = 0.34 * e.k;
        });
      },
      off() { halo.visible = embers.visible = ring.visible = false; for (const m of streaks) m.visible = false; for (const g of echoG) g.visible = false; }
    };
    const HANU_FACE = 0;                                   // the model faces +z (photographed front-on, v21.0)
    function talismanGiven(on) { if (talLaid) talLaid.visible = !on; }
    /* the sword in his right hand, the bell in his left, for the rites; put
       back on the table as they were found (a reset, a replay).
       (Photographed, the first grip was a fixed offset in the hand bone's
       frame: the sword came out of his wrist as a thin dark line and the bell
       sat inside his sleeve. A Mixamo hand bone is the WRIST and his hand has
       no finger bones, so the grip is measured instead: the PALM is the
       centroid of the vertices skinned mainly to the hand bone, in its own
       frame; each tool's grip point — the sword's hilt, the bell's handle —
       is put there; and its turn rides the hand but is pulled every frame
       toward how the thing is held — the blade up and toward the man before
       him, the bell hanging mouth down — so a take that swings the wrist
       swings the tool without ever driving it into the floor or the body.) */
    const toolHome = new Map();
    const SWORD_GRIP = new THREE.Vector3(-0.31, 0, 0), BELL_GRIP = new THREE.Vector3(0, 0.12, 0);
    const SWORD_UP = (() => {
      const x = new THREE.Vector3(-0.22, 1, 0.42).normalize(), z0 = new THREE.Vector3(0, 0, 1);
      const y = z0.clone().addScaledVector(x, -z0.dot(x)).normalize(), z = new THREE.Vector3().crossVectors(x, y);
      return new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(x, y, z));
    })();
    const BELL_UP = new THREE.Quaternion();
    const _gq = new THREE.Quaternion(), _gq2 = new THREE.Quaternion(), _gs = new THREE.Vector3(), _gp = new THREE.Vector3(), _gm = new THREE.Matrix4();
    function palmOf(r, hand) {
      if (hand.userData.palm) return hand.userData.palm;
      r.model.updateMatrixWorld(true);
      _gm.copy(hand.matrixWorld).invert();
      const c = new THREE.Vector3(), v = new THREE.Vector3(); let n = 0;
      r.model.traverse(m => {
        if (!m.isSkinnedMesh) return;
        const bi = m.skeleton.bones.indexOf(hand); if (bi < 0) return;
        const si = m.geometry.attributes.skinIndex, sw = m.geometry.attributes.skinWeight;
        m.skeleton.update();
        for (let i = 0; i < si.count; i++) {
          let w = 0;
          for (let k = 0; k < 4; k++) if (si.getComponent(i, k) === bi) w += sw.getComponent(i, k);
          if (w < 0.5) continue;
          m.getVertexPosition(i, v); v.applyMatrix4(m.matrixWorld).applyMatrix4(_gm); c.add(v); n++;
        }
      });
      if (n) c.multiplyScalar(1 / n); else c.set(0, 0.07, 0);
      return (hand.userData.palm = c);           // in the bone's own frame and units
    }
    function toolsInHands(on, settle = 0) {
      const r = medium;
      if (on && r.mixer) { r.mixer.update(0); r.model.updateMatrixWorld(true); }   // the hand where the new take has it
      for (const [g, hand] of [[swordG, r.handR], [bellG, r.handL]]) {
        if (!g) continue;
        if (!toolHome.has(g)) toolHome.set(g, { parent: g.parent, pos: g.position.clone(), rot: g.rotation.clone() });
        const H = toolHome.get(g);
        if (on && hand) {
          hand.add(g);
          /* held exactly as it should be until the take has blended in, and
             from then on riding the hand */
          g.userData.rideQ = null; g.userData.settleUntil = performance.now() + settle * 1000;
          toolsTick();
        } else if (!on) {
          H.parent.add(g); g.position.copy(H.pos); g.rotation.copy(H.rot); g.scale.setScalar(1);
        }
      }
    }
    function toolsTick() {
      if (!medStanding) return;
      const r = medium;
      for (const [g, hand, grip, ideal, w] of [[swordG, r.handR, SWORD_GRIP, SWORD_UP, 0.55], [bellG, r.handL, BELL_GRIP, BELL_UP, 0.8]]) {
        if (!g || !hand || g.parent !== hand) continue;
        hand.getWorldQuaternion(_gq); hand.getWorldScale(_gs);
        if (!g.userData.rideQ || performance.now() < g.userData.settleUntil) g.userData.rideQ = (g.userData.rideQ || new THREE.Quaternion()).copy(_gq).invert().multiply(ideal);
        _gq2.copy(_gq).multiply(g.userData.rideQ).slerp(ideal, w);    // riding the hand, pulled toward how it is held
        g.quaternion.copy(_gq).invert().multiply(_gq2);
        const k = 1 / (_gs.x || 1);
        g.scale.setScalar(k);                                          // the bone carries the model's (and its armature's) scale
        _gp.copy(grip).applyQuaternion(g.quaternion).multiplyScalar(k);
        g.position.copy(palmOf(r, hand)).sub(_gp);
      }
    }

    /* ---- THE ENDINGS' own things (the scenes direct them through stage.film):
       the entrance bay's shutter, which only ending B brings down; a bus in
       the far lane for ending C; the cup of talisman water put in his hand in
       A; the LP Tim held up into the lantern light in D; and a gust through
       the lanterns when "whatever it was" hears him (B) */
    const entMat = matShutter.clone(); entMat.map = tex(matShutter.map.clone()); entMat.map.needsUpdate = true; entMat.side = THREE.DoubleSide;
    owned.push({ dispose: () => entMat.dispose() });
    const entShutter = plane(4.0, 2.55, entMat, -2.25, 2.62 - 1.275, 0.01, 0, shrG); entShutter.visible = false;
    // (its bottom rail, which comes down with it: the shutter's edge was only where the slats' picture stopped — VB-7)
    const entRail = box(4.0, 0.05, 0.05, -2.25, 2.62, 0.03, matBoxSteel, shrG, false); entRail.visible = false;
    function entShutterK(k) {
      k = THREE.MathUtils.clamp(k, 0, 1);
      entShutter.visible = k > 0.002; entRail.visible = entShutter.visible;
      entShutter.scale.y = Math.max(0.002, k); entShutter.position.y = 2.62 - 1.275 * k;
      entRail.position.y = 2.62 - 2.55 * k + 0.025;
      entMat.map.repeat.set(4, 2.2 * k); entMat.map.offset.y = 2.2 * (1 - k);   // the slats come down out of the box, not squashed
    }
    /* (from +50 to −80 now, at the same 13.9 m/s: it drove off the road's end at −34 and blinked out on a desktop's
       screen; the road runs to ±90 and the fog has it by −80 — GF-6) */
    const BUS = { x0: 50, x1: -80, z: 11.45 };          // (v21.8: 11.6 → 11.45, clear of the cars parked at the far kerb)
    /* a Singapore single-decker, built once for the night (ending C's, unlit materials with its windows lit) and once
       for the morning (the film's, lit materials, dark glass, no lamps) */
    function makeBus(parent, day) {
      const g = new THREE.Group(); g.visible = false; parent.add(g);
      const M = (o) => day ? new THREE.MeshStandardMaterial({ roughness: 0.45, ...o }) : new THREE.MeshBasicMaterial({ fog: true, ...o });
      const body = M({ color: day ? 0x55a043 : 0x5c6066 }), skirt = M({ color: day ? 0x2c3032 : 0x2a2c30 }),
            band = M({ color: day ? 0xeeeee6 : 0x8a2a20 }),
            win = day ? new THREE.MeshStandardMaterial({ map: tex(makeBusWindowsDay(THREE, cnv)), roughness: 0.15, metalness: 0.2 }) : new THREE.MeshBasicMaterial({ map: tex(makeBusWindows(THREE, cnv)), fog: true }),
            glass = day ? new THREE.MeshStandardMaterial({ color: 0x1e2a32, roughness: 0.12, metalness: 0.35 }) : win,   // the windscreen (and the rear): plain glass by day
            rearWin = day ? glass : M({ color: 0xe9e1c6 }),                                                               // at night the cabin's light through it
            plate = M({ map: tex(makeBusPlate(THREE, cnv)) }),
            sign = new THREE.MeshBasicMaterial({ map: tex(makeBusSign(THREE, cnv)), fog: true }), tyre = M({ color: 0x101010 });
      for (const m of new Set([body, skirt, band, win, glass, rearWin, plate, sign, tyre])) owned.push({ dispose: () => m.dispose() });   // (their maps go with madeTex)
      /* a single-decker 3.15 m tall: the body from 1.0 m up, a dark skirt below it to 0.32, and the tyres INSIDE the
         skirt's line (their outer face at 1.25 against the skirt's 1.26), so from the side only their lower third shows
         under the skirt — the first build had them poking out of the body as black discs */
      box(12.0, 2.15, 2.5, 0, 2.075, 0, body, g, false);
      box(12.02, 0.68, 2.52, 0, 0.66, 0, skirt, g, false);
      box(12.04, 0.12, 2.54, 0, 1.04, 0, band, g, false);
      for (const s of [-1, 1]) plane(11.2, 0.95, win, 0.25, 2.2, s * 1.262, s > 0 ? 0 : Math.PI, g);             // the windows both sides
      plane(2.3, 1.2, glass, -6.012, 2.15, 0, -Math.PI / 2, g);                                                    // the windscreen
      plane(1.7, 0.28, sign, -6.02, 2.95, 0, -Math.PI / 2, g);                                                     // the route, in amber
      plane(1.9, 0.75, rearWin, 6.012, 2.4, 0, Math.PI / 2, g);                                                    // the rear window
      plane(0.52, 0.13, plate, 6.012, 1.32, 0, Math.PI / 2, g);                                                    // and its plate
      for (const [x, z] of [[-4.2, -1.13], [-4.2, 1.13], [3.6, -1.13], [3.6, 1.13]]) { const w = cyl(0.48, 0.48, 0.24, x, 0.48, z, tyre, 14, g); w.rotation.x = Math.PI / 2; }
      if (!day) {
        for (const s of [-1, 1]) {
          const hl = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.9), addGlow(glowWarm, 0.95)); hl.position.set(-6.1, 0.72, s * 0.92); hl.rotation.y = -Math.PI / 2; g.add(hl);
          const tl = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 0.7), addGlow(glowRed, 0.9)); tl.position.set(6.06, 0.88, s * 0.95); tl.rotation.y = Math.PI / 2; g.add(tl);
        }
        const beam = new THREE.Mesh(new THREE.PlaneGeometry(7, 4), addGlow(glowWarm, 0.35)); beam.rotation.x = -Math.PI / 2; beam.position.set(-9.0, 0.02, 0); g.add(beam);
        const spill = new THREE.Mesh(new THREE.PlaneGeometry(12, 4.2), addGlow(glowWarm, 0.16)); spill.rotation.x = -Math.PI / 2; spill.position.set(0.25, 0.02, 0); g.add(spill);
      }
      return g;
    }
    /* v21.2: a TOUR COACH parked at Golden Mile Complex's kerb (where the coaches to Hat Yai and Kuala Lumpur leave
       from): a white high-deck body, a red and blue stripe down its side, a band of tinted glass, at rest */
    function makeCoach(parent, x, z) {
      const g = new THREE.Group(); g.position.set(x, 0, z); parent.add(g);
      const M = (o) => { const m = new THREE.MeshStandardMaterial({ roughness: 0.4, ...o }); owned.push({ dispose: () => m.dispose() }); return m; };
      const white = M({ color: 0xf2f1ec }), red = M({ color: 0xc0262a }), blue = M({ color: 0x1f4f9a }),
            glass = M({ color: 0x1b242c, roughness: 0.1, metalness: 0.4 }), dark = M({ color: 0x2a2c30 }), tyre = M({ color: 0x111111 });
      box(12.2, 2.9, 2.5, 0, 2.05, 0, white, g, false);                    // the body, 0.6 m to 3.5 m
      box(12.22, 0.5, 2.52, 0, 0.72, 0, dark, g, false);                   // the skirt over the luggage bays
      for (const s of [-1, 1]) {
        plane(11.4, 1.05, glass, 0.3, 2.75, s * 1.262, s > 0 ? 0 : Math.PI, g);   // the windows, tinted
        plane(12.0, 0.22, red, 0, 1.78, s * 1.263, s > 0 ? 0 : Math.PI, g);       // the stripes
        plane(12.0, 0.12, blue, 0, 1.6, s * 1.263, s > 0 ? 0 : Math.PI, g);
      }
      plane(2.3, 1.5, glass, -6.112, 2.55, 0, -Math.PI / 2, g);            // the windscreen
      for (const [wx, wz] of [[-4.3, -1.13], [-4.3, 1.13], [3.4, -1.13], [3.4, 1.13], [4.6, -1.13], [4.6, 1.13]]) { const w = cyl(0.5, 0.5, 0.26, wx, 0.5, wz, tyre, 14, g); w.rotation.x = Math.PI / 2; w.castShadow = false; }
      return g;
    }
    const busG = makeBus(shrG, false);
    function busK(k) {
      busG.visible = k > 0 && k < 1;
      busG.position.set(BUS.x0 + (BUS.x1 - BUS.x0) * k, 0, BUS.z);
    }
    // the cup of talisman water (built for the hands' pass: it rides his right arm in scene A)
    const cupProp = new THREE.Group(); cupProp.visible = false;
    /* (the body is an open-ended cylinder, and seen from above — at his lips — its inside is the BACK face: drawn
       one-sided, the cup was a navy hoop with the table showing through its wall. Both sides now — the v21.1 review) */
    { const por = new THREE.MeshStandardMaterial({ color: 0xf2eee6, roughness: 0.28, side: THREE.DoubleSide }), rim = new THREE.MeshStandardMaterial({ color: 0x2a4a8a, roughness: 0.4 }),
            wat = new THREE.MeshStandardMaterial({ map: tex(makeAshWater(THREE, cnv)), roughness: 0.15 });
      for (const m of [por, rim, wat]) owned.push({ dispose: () => m.dispose() });
      const c = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.028, 0.058, 18, 1, true), por); c.position.y = 0.029; cupProp.add(c);
      const b = new THREE.Mesh(new THREE.CircleGeometry(0.028, 16), por); b.rotation.x = -Math.PI / 2; cupProp.add(b);
      const r = new THREE.Mesh(new THREE.TorusGeometry(0.038, 0.0025, 6, 24), rim); r.rotation.x = Math.PI / 2; r.position.y = 0.058; cupProp.add(r);
      const w = new THREE.Mesh(new THREE.CircleGeometry(0.035, 18), wat); w.rotation.x = -Math.PI / 2; w.position.y = 0.046; cupProp.add(w);
      cupProp.traverse(o => { if (o.geometry) owned.push({ dispose: () => o.geometry.dispose() }); }); }
    // the LP Tim, held up into the lantern light (D): Chad's model at full detail, as every amulet up close is
    // (it hangs from his fingertip on a red cord: the cord from the group's origin down, the amulet's top 3 cm under it)
    const timHeld = new THREE.Group(); timHeld.visible = false;
    { const cordM = new THREE.MeshStandardMaterial({ color: 0x8a1a12, roughness: 0.9 }); owned.push({ dispose: () => cordM.dispose() });
      const cord = cyl(0.0011, 0.0011, 0.032, 0, -0.016, 0, cordM, 5, timHeld); owned.push({ dispose: () => cord.geometry.dispose() }); }
    parseOnce('timkp').then(hd => {
      if (!alive) return;
      const m = hd.scene.clone(true); m.scale.setScalar(0.052);
      m.updateMatrixWorld(true);
      const bb = new THREE.Box3().setFromObject(m);
      m.position.set(-(bb.min.x + bb.max.x) / 2, -0.03 - bb.max.y, -(bb.min.z + bb.max.z) / 2);
      m.traverse(q => { if (q.isMesh) { q.castShadow = false; q.receiveShadow = false; } });
      timHeld.add(m);
    }).catch(err => { console.warn('the held LP Tim failed to load', err); ctx.loadFail && ctx.loadFail('timkp', err); });   // (never silent: v14.16)
    shrLife.gust = 0;

    /* ================================================== THE FILM'S POCKET
       Context only (Chad: "The opening film should not already have him
       trancing. It should only set the stage and context for what is about to
       happen."). One set out past the far plane from both worlds, under its
       own painted sky: Golden Mile Complex across Beach Road in the morning.
       (v21.2, Chad: "it is buddha day, meaning uposatha day, not actual vesak
       day. There is no need to start the intro cutscene at the chinese
       buddhist temple. Start at the outside of the mall complex instead" —
       the temple gate at dawn, its bunting, lanterns and people in white, is
       gone, and the film opens on the mall.) The corridor and the shop's door
       are World A's own. Drawn only while the film runs. */
    const FM = { x: 300, z: 240 };
    /* the pocket's light, swapped in by the film's first step (a whole preset: kit.daylight lays it over the
       chapter's own noon). Nothing out here casts a shadow, so the key is free to come from the painted sun */
    const FILM_MORN = {
      stops: [[0.00, '#2a5aac'], [0.50, '#5a8ed0'], [1.00, '#d6e4ee']],
      bg: 0xd6e4ee, fog: [0xd2dee8, 0.005],
      hemi: [0xeaf2ff, 0x5a5048, 1.0], key: [0xfff0d8, 1.15, -6, 10, 9], fill: [0xc8dcff, 0.38],
      stars: 0, moon: 0, sun: 0, clouds: 0,
      vmHemi: [0xeaf2ff, 0x5a5048, 0.95], vmKey: [0xfff0d8, 0.8] };
    const filmG = new THREE.Group(); filmG.visible = false; world.add(filmG);
    const fBasic = (o) => { const m = new THREE.MeshBasicMaterial(o); owned.push({ dispose: () => m.dispose() }); return m; };
    const fStd = (o) => { const m = new THREE.MeshStandardMaterial({ roughness: 0.85, ...o }); owned.push({ dispose: () => m.dispose() }); return m; };
    const matWhiteF = fStd({ color: 0xece6da, roughness: 0.9 }), matGreenF = fStd({ color: 0x2c6a4a, roughness: 0.45 });
    const matIronF = fStd({ color: 0x1e2a24, roughness: 0.6, metalness: 0.3 }), matConcF = fStd({ color: 0xb4aea2, roughness: 0.92 });


    /* ---- GOLDEN MILE COMPLEX across Beach Road, in the morning (v21.2: Chad names the mall, and the film opens
       here, outside it). The real building — 1973, Design Partnership — is a sixteen-storey slab on a three-storey
       podium of shops, Singapore's "Little Thailand", where the coaches leave for Hat Yai; its long face STEPS BACK
       a floor at a time, every floor a terrace open to the sky, so that from its end the whole slab leans like a
       typewriter's keys, two solid end walls holding it up. Weathered cream concrete, dark glass behind the
       terraces, planters and air-conditioners on them, the name over the podium, Thai signs under it. Every floor
       of the tower is the same piece, so each part is ONE instanced mesh — a draw a part, not a draw a floor. */
    const MALLX = new THREE.Group(); MALLX.position.set(FM.x, 0, FM.z); filmG.add(MALLX);
    const mallBusG = makeBus(MALLX, true);          // a green single-decker going by in the near lane
    /* (v21.3, Chad: "just show the bottom 2 rows of shopfronts will do, instead of the current 3 rows. Then move the
       golden mile complex signboard lower after removing the third row" — the podium is two rows of shops, 8.9 m
       where it was 13.2, and the sign, the slab and its roof all stand on it, so they come down with it) */
    const GM = { x0: -64, x1: 30, pod: 8.9, fh: 3.4, floors: 13, step: 1.45, z0: -3.0, depth: 15 };
    GM.len = GM.x1 - GM.x0; GM.cx = (GM.x0 + GM.x1) / 2;
    const gmZ = (i) => GM.z0 - i * GM.step;            // floor i's front edge, where its terrace's parapet stands
    { const sky = new THREE.Mesh(new THREE.SphereGeometry(118, 40, 20, 0, Math.PI * 2, 0, Math.PI / 2 + 0.22), fBasic({ map: tex(makeMorningSky(THREE, cnv)), side: THREE.BackSide, depthWrite: false, fog: false }));
      sky.position.set(0, -6, 0); sky.renderOrder = -1; MALLX.add(sky);
      const asT = tex(makeAsphalt(THREE, cnv)); asT.wrapS = asT.wrapT = THREE.RepeatWrapping; asT.repeat.set(160 / 6, 12 / 6);
      const road = new THREE.Mesh(new THREE.PlaneGeometry(160, 12), fStd({ map: asT, color: 0x96969c, roughness: 0.92 })); road.rotation.x = -Math.PI / 2; road.position.set(0, 0, 11); MALLX.add(road);
      { const pv = new THREE.Mesh(new THREE.PlaneGeometry(160, 5), fStd({ color: 0xaaa498, roughness: 0.9 })); pv.rotation.x = -Math.PI / 2; pv.position.set(0, 0.012, 2.5); MALLX.add(pv);
        const pv2 = new THREE.Mesh(new THREE.PlaneGeometry(160, 6), fStd({ color: 0xaaa498, roughness: 0.9 })); pv2.rotation.x = -Math.PI / 2; pv2.position.set(0, 0.012, 20); MALLX.add(pv2); }
      for (const z of [5.0, 17.0]) box(160, 0.14, 0.2, 0, 0.07, z, matConcF, MALLX, false);
      for (let i = 0; i < 8; i++) { const st = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 4.0), fBasic({ color: 0xe8e8e0 })); st.rotation.x = -Math.PI / 2; st.position.set(-3.5 + i * 1.0, 0.012, 11); MALLX.add(st); }   // the zebra
      { const l = new THREE.Mesh(new THREE.PlaneGeometry(160, 0.12), fBasic({ color: 0xd8d8d0 })); l.rotation.x = -Math.PI / 2; l.position.set(0, 0.01, 11); MALLX.add(l); }
      /* THE PODIUM: three floors of shops, a row of Thai signs a floor, the covered way along the front; its roof a
         terrace the tower stands back from */
      const podM = fStd({ color: 0xc9bfa8, roughness: 0.93 });                // the cream concrete, weathered
      box(GM.len, GM.pod, 30, GM.cx, GM.pod / 2, -15.05, podM, MALLX, false);
      [[0, 4.6], [4.6, 4.3]].forEach(([y0, h], i) => {
        const t = tex(makeMallFront(THREE, cnv, i)); t.wrapS = THREE.RepeatWrapping; t.repeat.set(GM.len / 46, 1);   // a shop every 4.6 m
        plane(GM.len - 1.4, h - 0.3, fBasic({ map: t }), GM.cx, y0 + (h - 0.3) / 2, 0.01, 0, MALLX);
        box(GM.len, 0.3, 0.5, GM.cx, y0 + h - 0.15, 0.2, matWhiteF, MALLX, false);
      });
      box(GM.len, 1.1, 0.4, GM.cx, GM.pod + 0.55, -0.2, podM, MALLX, false);  // the podium roof's parapet
      /* the name over the podium, on a dark board standing on its roof's edge: in English, and in Chinese (黄金大厦)
         under it. Two lines, 18 m, so the whole of it is in a phone's frame at the end of the shot — a phone sees a
         third of a desktop's width, and the first board (one line, 32 m) ran off both sides of it */
      box(18.6, 4.7, 0.3, 14, GM.pod + 1.1 + 2.35, -0.12, fStd({ color: 0x3a2b20, roughness: 0.7 }), MALLX, false);
      plane(18, 4.4, fBasic({ map: tex(makeGMCName(THREE, cnv)), transparent: true }), 14, GM.pod + 1.1 + 2.35, 0.05, 0, MALLX);
      // the covered way along the front: a canopy on columns
      box(GM.len, 0.18, 3.2, GM.cx, 3.7, 1.7, matWhiteF, MALLX, false);
      for (let x = GM.x0 + 2; x < GM.x1; x += 5.5) box(0.4, 3.7, 0.4, x, 1.85, 3.1, matWhiteF, MALLX, false);

      /* THE STEPPED SLAB: thirteen floors over the podium, each 1.45 m back from the one below — so each floor's
         front strip is a terrace open to the sky, behind a parapet, with the floor's glass set back behind it — 15 m
         deep throughout, so the whole slab leans back as it climbs, and an end wall at each end that shows it */
      const N = GM.floors, M = new THREE.Matrix4();
      const inst = (geo, mat, n, at) => {
        const I = new THREE.InstancedMesh(geo, mat, n); owned.push({ dispose: () => geo.dispose() });
        for (let k = 0; k < n; k++) { const p = at(k); M.makeTranslation(p[0], p[1], p[2]); I.setMatrixAt(k, M); }
        I.castShadow = false; I.receiveShadow = false; I.computeBoundingSphere(); MALLX.add(I); return I;
      };
      const coreD = GM.depth - GM.step;
      // each floor's mass behind its glass, and the terrace slab in front of it
      inst(new THREE.BoxGeometry(GM.len - 1.4, GM.fh, coreD), podM, N, k => [GM.cx, GM.pod + k * GM.fh + GM.fh / 2, gmZ(k) - GM.step - coreD / 2]);
      inst(new THREE.BoxGeometry(GM.len - 1.4, 0.36, GM.step + 0.02), podM, N, k => [GM.cx, GM.pod + k * GM.fh + 0.18, gmZ(k) - GM.step / 2]);
      // the terrace's parapet, a cream band — the line the eye reads the steps by
      const parT = tex(makeGMCParapet(THREE, cnv)); parT.wrapS = THREE.RepeatWrapping; parT.repeat.set((GM.len - 1.4) / 8, 1);
      const parM = fStd({ map: parT, roughness: 0.9 });
      inst(new THREE.BoxGeometry(GM.len - 1.4, 1.05, 0.2), parM, N, k => [GM.cx, GM.pod + k * GM.fh + 0.36 + 0.52, gmZ(k) - 0.1]);
      // the glass behind each terrace: two faces of windows and doors, alternate floors, so no two floors above each other match
      for (const v of [0, 1]) {
        const gt = tex(makeGMCGlass(THREE, cnv, v)); gt.wrapS = THREE.RepeatWrapping; gt.repeat.set((GM.len - 1.4) / 23, 1);
        const n = Math.ceil((N - v) / 2);
        inst(new THREE.PlaneGeometry(GM.len - 1.4, GM.fh - 0.36), fStd({ map: gt, roughness: 0.55 }), n,
             k => { const f = v + 2 * k; return [GM.cx, GM.pod + f * GM.fh + 0.36 + (GM.fh - 0.36) / 2, gmZ(f) - GM.step + 0.01]; });
      }
      // the two end walls, a floor at a time — their stepped front edge is the building's profile
      const endM = fStd({ color: 0xb7ad97, roughness: 0.95 });
      inst(new THREE.BoxGeometry(0.7, GM.fh, GM.depth + 0.3), endM, N * 2,
           k => { const f = k % N, x = k < N ? GM.x1 - 0.35 : GM.x0 + 0.35; return [x, GM.pod + f * GM.fh + GM.fh / 2, gmZ(f) + 0.3 - (GM.depth + 0.3) / 2]; });
      // the roof: a parapet round the top floor, the lift and water-tank houses set back on it
      box(GM.len, 1.0, 0.25, GM.cx, GM.pod + N * GM.fh + 0.5, gmZ(N - 1) - GM.step - 0.12, parM, MALLX, false);
      for (const x of [-46, -14, 14]) box(7, 3.2, 6, x, GM.pod + N * GM.fh + 1.6, gmZ(N - 1) - GM.step - 7, endM, MALLX, false);
      /* on the terraces: planters along the parapets with their plants grown up over the top and trailing down the
         face, as the real building's are; an air-conditioner and a pot here and there (dealt from a fixed seed, so a
         seek and a skip find the same terraces). The first pass sat the bushes behind the parapets, under their top:
         from the street not one of them was seen */
      { const R = rng(71), pl = [], bush = [], trail = [], ac = [], pot = [];
        for (let f = 0; f < N; f++) for (let x = GM.x0 + 2.5; x < GM.x1 - 2; x += 3.1) {
          const z = gmZ(f), y = GM.pod + f * GM.fh + 0.36, r = R();
          if (r < 0.5) {
            const px = x + R() * 0.6;
            pl.push([px, y + 0.3, z - 0.45]);
            for (let b = 0; b < 2 + ((R() * 2) | 0); b++) bush.push([px - 0.55 + R() * 1.1, y + 1.02 + R() * 0.3, z - 0.42 + R() * 0.12, 0.85 + R() * 0.5,
                                                                     1.3 + R() * 0.6, 0.65 + R() * 0.3, 0.9 + R() * 0.3, R() * Math.PI, (R() * 3) | 0]);
            if (R() < 0.4) trail.push([px - 0.3 + R() * 0.6, y + 0.72 - R() * 0.25, z + 0.03, 0.6 + R() * 0.7]);
          }
          else if (r < 0.66) ac.push([x + R() * 0.8, y + 0.3, z - GM.step + 0.32]);
          else if (r < 0.76) pot.push([x + R() * 0.8, y + 0.34, z - 0.62]);
        }
        const Q = new THREE.Quaternion(), S3 = new THREE.Vector3(), V3 = new THREE.Vector3(), EU = new THREE.Euler();
        /* as inst(), each with its own size (the 4th number) — and, for the bushes, a stretch along the parapet, a
           squash, a turn and one of three greens, so a terrace of them reads as foliage spilling over, not as a row of
           green dice (the first photograph of them on a phone) */
        const GREENS = [new THREE.Color(0x4a7838), new THREE.Color(0x5e8a3e), new THREE.Color(0x3c6a34)];
        const instS = (geo, mat, arr) => {
          const I = new THREE.InstancedMesh(geo, mat, arr.length); owned.push({ dispose: () => geo.dispose() });
          arr.forEach((p, k) => {
            if (p.length > 4) { S3.set(p[3] * p[4], p[3] * p[5], p[3] * p[6]); Q.setFromEuler(EU.set(0, p[7], 0)); I.setColorAt(k, GREENS[p[8]]); }
            else { S3.setScalar(p[3]); Q.identity(); }
            M.compose(V3.set(p[0], p[1], p[2]), Q, S3); I.setMatrixAt(k, M);
          });
          I.castShadow = false; I.receiveShadow = false; I.computeBoundingSphere(); MALLX.add(I); return I;
        };
        inst(new THREE.BoxGeometry(1.5, 0.6, 0.5), fStd({ color: 0x7a6a58, roughness: 0.9 }), pl.length, k => pl[k]);
        instS(new THREE.IcosahedronGeometry(0.4, 1), fStd({ color: 0xffffff, roughness: 0.85 }), bush);
        // the trailing ones, down the parapet's face from its top
        { const tg = new THREE.BoxGeometry(1.0, 0.7, 0.06); tg.translate(0, -0.35, 0);
          instS(tg, fStd({ color: 0x3e6a30, roughness: 0.9 }), trail.map(t => [t[0], t[1] + 0.35, t[2], t[3]])); }
        inst(new THREE.BoxGeometry(0.85, 0.6, 0.34), fStd({ color: 0xd9d6cf, roughness: 0.6 }), ac.length, k => ac[k]);
        inst(new THREE.IcosahedronGeometry(0.3, 0), fStd({ color: 0x5d8a44, roughness: 0.85, flatShading: true }), pot.length, k => pot[k]);
      }

      // its neighbours: a plain office slab to the left and the estate's blocks behind, so it does not stand on its own
      { const nt = tex(makeTowerFace(THREE, cnv)); nt.wrapS = nt.wrapT = THREE.RepeatWrapping; nt.repeat.set(3, 5);
        box(30, 70, 22, -92, 35, -20, fStd({ map: nt, color: 0xc8c4bc, roughness: 0.85 }), MALLX, false); }
      parseOnce('hdb').then(gl => {
        if (!alive) return;
        for (const [x, z, ry] of [[66, -52, -0.35], [-30, -70, 0.12]]) {
          const b = gl.scene.clone(true); b.scale.setScalar(0.001); b.rotation.y = ry;
          b.traverse(o => { if (!o.isMesh) return; o.castShadow = false; o.receiveShadow = false; });
          b.updateMatrixWorld(true);
          const bb = new THREE.Box3().setFromObject(b);
          b.position.set(x - (bb.min.x + bb.max.x) / 2, -bb.min.y, z - (bb.min.z + bb.max.z) / 2);
          MALLX.add(b);
        }
      }).catch(err => { console.warn('hdb failed to load', err); ctx.loadFail && ctx.loadFail('hdb', err); });

      // a tour coach at the kerb (the coaches to Hat Yai leave from here), a lamp post or two
      makeCoach(MALLX, -18, 6.4);
      for (const x of [-30, -2, 26]) { box(0.16, 7.5, 0.16, x, 3.75, 4.75, matIronF, MALLX, false); box(1.6, 0.14, 0.3, x - 0.7, 7.5, 4.75, matIronF, MALLX, false); }
      // a bus stop across the road, behind him; the rain trees along the kerbs, kept out of his way
      box(6, 0.12, 2.0, 12, 2.7, 19.2, matGreenF, MALLX, false); for (const x of [9.4, 14.6]) box(0.1, 2.7, 0.1, x, 1.35, 19.9, matIronF, MALLX, false);
      if (plantTrees) treeStands.push(plantTrees(MALLX, [[-24, 19.5], [-4, 20.4], [52, 20.2], [-40, 4.0], [-10, 4.0], [44, 3.8]].map(([x, z], i) => ({ x, y: 0, z, h: 7 + (i % 2) * 2 })), { seed: 33, tint: 0x8a9a7a, lowKeep: 0.7 }));
    }

    /* ------------------------------------------------------ the chapter clock */
    const PHASES = ['browse', 'owner', 'gift', 'wear', 'join', 'chant', 'trance',
                    'arrive', 'wait', 'called', 'decide'];
    let phase = 'browse';
    let booted = false, preplaced = false;
    const dayClock = { t: 0 };
    let lastWall = 0;
    const todo = [];
    function after(secs, fn) { todo.push({ at: dayClock.t + secs, fn }); todo.sort((a, b) => a.at - b.at); }
    function runTodo() { while (todo.length && todo[0].at <= dayClock.t) todo.shift().fn(); }
    function dropTodo() { todo.length = 0; }
    const heard = new Set();

    const speak = { until: 0, pending: null };
    function speakReset() { speak.until = 0; speak.pending = null; }
    /* A LINE IS A BEAT, HEARD OR NOT: a muted game (soundOff) speaks it
       silently on its own length, and a line whose bytes have not landed is
       held for a moment (v8.0) and then spoken silently too — the people's
       moves and the story are chained on a line's START, so a line that is
       dropped must never stop the chapter */
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
    /* one voice at a time, in order, never dropped (the v9.5 count-off's
       queue): a held line holds the queue rather than losing its words */
    const lineQ = [];
    function queueLine(name, onStart, vol = 1, pan = 0) { lineQ.push({ name, onStart, vol, pan }); }
    function queueGap(secs) { lineQ.push({ gap: secs }); }
    function runQueue() {
      if (!lineQ.length || speak.pending || dayClock.t < speak.until) return;
      const q = lineQ.shift();
      if (q.gap) { speak.until = dayClock.t + q.gap; return; }
      sayLine(q.name, q.vol, q.onStart, q.pan);
    }
    function panAt(x, z) {
      const dx = x - yaw.position.x, dz = z - yaw.position.z;
      const a = Math.atan2(dx, -dz) + yaw.rotation.y;
      return THREE.MathUtils.clamp(Math.sin(a) * 0.75, -0.75, 0.75);
    }

    /* the play-time voices and sounds, decoded ahead (the seventeenth seam,
       v8.0: a line asked for before its bytes have decoded plays nothing) */
    if (warmSounds) warmSounds(['ow3hello', 'z3look1', 'z3look2', 'z3look3', 'z3look4', 'ow3call', 'ow3gift1', 'ow3gift2',
                                'z3thanks', 'ow3good', 'mk3chant', 'z3shift1', 'z3shift2', 'z3night',
                                'candlelit3', 'torchclick', 'matkneel3', 'e3bell', 'presencein',
                                // the shrine's (play B): its lines and the sounds play makes there
                                'z3shrine', 'as3sit', 'dv3wife', 'md3read1', 'md3drink', 'dv3father', 'md3read2', 'md3done',
                                'as3next', 'z3walk', 'md3ghost', 'incenselit3', 'urnsand', 'stoolscrape', 'taobell',
                                'step1', 'step2', 'step3', 'step4',
                                // the endings' helpers fire these (the engine reads a SCENE's own source for its cues, v14.16)
                                'z3next', 'e3close3',
                                /* and the two films from play (ST-5): the engine warms their cues at play's entry, and a
                                   pack that landed after the curtain gave up waiting had nobody to decode them — a name
                                   asked for HERE is decoded whenever the bytes land */
                                'ow3eh', 'rushgrab', 'sm3hold', 'sm3cannot', 'crowdgasp', 'st3uncle', 'phonerec', 'cu3sadhu',
                                'stoolfall', 'timelapse', 'st3trance', 'kneethud', 'z3breath', 'ow3know', 'z3knew', 'cu3unclean',
                                'ow3medium', 'ow3let', 'hanumanroar', 'goldsting', 'drumroll3', 'drum3', 'gong3', 'md3chant',
                                'swordswish', 'as3back',
                                // v21.8: the roar's lunge — the medium's gasp, the rush, the hit, the crash, the swell
                                'md3gasp', 'hanulunge', 'hanuhit', 'hanucrash', 'goldswell']);

    /* ------------------------------------------------------------ the phases */
    const inShrine = (x) => x < -100;
    const W = DATA.words;
    function setPhase(p, opts) {
      phase = p;
      if (kit) kit.setPhase(p);
      objectiveFor(p, opts);
    }
    function objectiveFor(p, opts) {
      if (!kit) return;
      /* 'join' with the LP Tim not on him (a Continue saved after he took it
         off) asks for it again first, so a resume plays one order, not two */
      const joinNow = p === 'join' && wornNow();
      const obj = { browse: W.objBrowse.replace('{n}', String(looked.size)), owner: W.objOwner, wear: W.objWear, join: joinNow ? W.objJoin : W.objWear,
                    chant: W.objChant, arrive: W.objIncense, wait: W.objWait, watch: W.objWatch }[p];
      kit.objective(shrDark ? null : (obj || null), opts);
      /* the mat's own "!" floats over its glow (e3c2's v19.4); the owner is a
         hotspot with his own mark — one marker for one thing (v19.2); at the
         shrine the joss sticks and then his stool are marked the same way */
      kit.waypoint(null);                         // (and no waypoint on the mat besides: two markers for one mat, neither on it — VP-5)
    }
    /* the receipt is the note (v7.3): a beat that banks is paid once, whatever
       a Continue replays */
    function bank(note, s = 0, a = 0) {
      if (!kit || !note) return;
      const got = kit.getConduct ? kit.getConduct().notes : [];
      if (got.includes(note)) return;
      kit.conduct({ note, s, a });
    }

    /* ================================================ PLAY A · THE SHOP
       browse → owner → gift → wear → join → chant → trance (the plan's §2.2).
       Every beat on the chapter clock (wall time, v7.1); whether the LP Tim is
       worn is read off the bag every frame (v11.6 / v14.7), so a Continue, a
       bag opened at the wrong moment or an amulet taken off again all land on
       the right order. */
    const wallNow = () => performance.now() / 1000;
    const looked = new Set();
    let called = false, gifted = false, wornDone = false, seated = null, turning = null, facing = null,
        bowing = null, chant = null, trance = null, celebrate = null,
        flamesOn = false, radioOn = true, curTgt = 0, browseT0 = -1;   // (v21.8: the radio plays from the start)
    const wornNow = () => !!kit && kit.equipped('timkp');
    const BUDDHA_FACE = ROW_FACE;                       // v21.8: the Buddha at the middle of Chad's statue row
    const faceBuddha = (p = MAT) => Math.atan2(-(BUDDHA_FACE.x - p.x), -(BUDDHA_FACE.z - p.z));

    /* 1 · BROWSING — four things to look at, each a line of his.
       v21.9 (Chad: "the user either has to tap it, click it, or press E on
       each objective in order to complete it and move to the next"): each of
       the four is PRESSED (the hotspots below), the order counts them — 1/4,
       2/4, 3/4, each a beat — and the owner calls him over on the fourth.
       Nothing moves on by itself any more: v21.0 had him call after two, or
       when the player walked up to the counter, or after 45 s of wandering,
       and each of those finished the browse with markers still on screen,
       never pressed. The count rides the phase string (`browse:wall,tim`), so
       a Continue lands on the same count (e2c2's `ask:`, v7.3's law). */
    const LOOKS = {
      wall:    { line: 'z3look1' },
      tim:     { line: 'z3look2' },
      altar:   { line: 'z3look3' },
      masters: { line: 'z3look4' }
    };
    const LOOK_N = Object.keys(LOOKS).length;
    const browseMark = () => { if (kit) kit.setPhase(looked.size ? 'browse:' + [...looked].join(',') : 'browse'); };
    function lookAt(k) {
      if (phase !== 'browse') return false;
      if (looked.has(k)) return false;
      looked.add(k);
      queueLine(LOOKS[k].line);
      if (looked.size >= LOOK_N) ownerCalls();          // the fourth: the owner's call is queued behind its line
      else { objectiveFor('browse'); browseMark(); }
      return true;
    }
    function ownerCalls() {
      if (called || phase !== 'browse') return;
      called = true;
      /* COMPLETE only when he did look around (v8.7) — since v21.9 the only way here from the browse */
      setPhase('owner', looked.size >= LOOK_N ? undefined : { complete: false });
      owner.look = 1;
      queueGap(0.4);
      queueLine('ow3call', () => talk(owner, SECS.ow3call), 1, panAt(OWN.x, OWN.z));
    }

    /* 2 · THE GIFT — at his counter the owner lifts the acrylic lid off the
       LP Tim's own case, says why today, and holds it out; the ITEM UNLOCKED
       splash shows it turning (Chad: "The player still gets to browse the
       amulet shop in play, get the lp tim amulet") */
    function giftBegin() {
      if (phase !== 'owner') return false;
      setPhase('gift');
      /* he is at the counter now: a look's line or the owner's call still
         waiting in the queue is dropped (the one already playing finishes),
         so the owner speaks the moment he can — not after thirteen seconds of
         lines about the shop the player has already left behind */
      lineQ.length = 0;
      if (kit) kit.root(true);
      faceTo({ x: OWN.x, y: 1.32, z: OWN.z }, 0.8);
      owner.look = 1;
      celebratePrep();                                   // the staff man readies the altar meanwhile
      queueGap(0.2);
      queueLine('ow3gift1', () => {
        talk(owner, SECS.ow3gift1);
        after(SECS.ow3gift1 + 0.3, () => {
          queueLine('ow3gift2', () => {
            talk(owner, SECS.ow3gift2);
            after(0.7, takeTim);
            after(SECS.ow3gift2 + 0.35, giveTim);
          }, 1, panAt(OWN.x, OWN.z));
        });
      }, 1, panAt(OWN.x, OWN.z));
      return true;
    }
    /* (v21.8: off its open stand — no lid to lift, no glass to sound; the splash that follows has its own sting) */
    function takeTim() { lpAmulet.visible = false; lpHalo.visible = false; }
    /* SR-5: what the AMULET box held before the gift (the Phiboon, worn since episode 1), so a replay that takes the
       LP Tim back gives the neck back what it had — a replay used to leave the Phiboon it displaced in the bag */
    let neckWas = null;
    function takeTimBack() {
      if (!kit || !kit.has('timkp')) return;
      kit.take('timkp');
      if (neckWas && kit.has(neckWas) && !kit.equipped(neckWas)) kit.equip(neckWas);
    }
    function giveTim() {
      if (gifted) return;
      gifted = true;
      if (kit && kit.equipped && !kit.equipped('timkp')) neckWas = kit.equipped('amulet') ? 'amulet' : null;
      if (lpAmulet.visible) takeTim();            // (it may already be in his hand)
      if (kit && !kit.has('timkp')) kit.give('timkp');
      const ok = kit && kit.unlock && kit.unlock('timkp', { onClose: afterUnlock });
      if (!ok) afterUnlock();
    }
    function afterUnlock() {
      if (phase !== 'gift') return;
      if (kit) kit.root(false);
      setPhase('wear');
    }

    /* 3 · WEARING IT — the order stands until the bag says it is on his
       chest; taking it off again asks again, with no COMPLETE (v8.7) */
    function wearTick() {
      if (phase === 'wear' && wornNow()) {
        bank(W.noteTim, 0, 2);
        setPhase('join');
        if (!wornDone) {
          wornDone = true;
          queueGap(0.6);
          queueLine('z3thanks');
          queueGap(0.3);
          queueLine('ow3good', () => { talk(owner, SECS.ow3good); celebrateBegin(); }, 1, panAt(OWN.x, OWN.z));
        }
        return;
      }
      if (phase === 'join' && !seated) {
        const want = wornNow() ? W.objJoin : W.objWear;
        if (kit && kit.objective && objWas !== want) {
          /* taken off again: it asks again with no COMPLETE (going back is not
             done, v8.7) and the bag pulses with it; put back on, that IS done
             and is congratulated (ch3's amulet, e2c3's torch — the v21.1 review) */
          const back = want === W.objWear;
          if (back && kit.urge) kit.urge('timkp');
          kit.objective(want, back || objWas === null ? { complete: false } : undefined);
          objWas = want;
          kit.waypoint(wornNow() ? { x: MAT.x, y: 0.9, z: MAT.z } : null);
        }
      }
    }
    let objWas = null;

    /* 4 · THE CELEBRATION — the candles are lit and the radio goes quiet; the
       owner comes round his counter to his stool; the free mat glows. Laid out
       on the people's own paths (wall time, the walk take at the rate the
       ground asks for).
       v21.8: a monk leads the chant now, sitting on his cushion before the
       altar's step, and nobody walks between him and the altar. So the candles
       are lit FROM THE SIDES — the staff man the left one while the owner gives
       the gift, going back round the auntie to stand behind the mats; the
       owner the right one, on his way to his stool once the LP Tim is on the
       boy's chest, turning the radio OFF as he passes it (it has played Thai
       music while he browsed: nobody chants over the radio). */
    const OWN_SIT = { x: 1.72, z: -5.7 + ROWS_BACK };     // (v21.8: his stool comes back with the rows — the monk sits alone in front)
    OWN_SIT.ry = Math.atan2(BUDDHA_FACE.x - OWN_SIT.x, BUDDHA_FACE.z - OWN_SIT.z);
    const STAFF_AT = { x: -0.25, z: -3.55 + ROWS_BACK };   // behind the mats, where staff stand while customers kneel
    const RADIO_AT = { x: 1.95, z: -6.12 };             // before the radio's table, facing it (v21.8)
    /* where each candle is lit from: beside the cabinet's front corner, 0.8 m off the monk's knee, never in front of him */
    const CANDLE_AT = [{ x: -1.27, z: -5.98 }, { x: 1.27, z: -5.98 }];
    const toFlame = (i) => Math.atan2(flames[i].position.x - CANDLE_AT[i].x, flames[i].position.z - CANDLE_AT[i].z);
    /* the staff man readies the altar while the owner gives the gift (so it
       is done before anyone kneels — the first photographs had him walking
       across the front of the kneelers): round his counter's end and behind
       the auntie to the left candle, then back the same way, behind her stool
       and clear of his counter's corner, to stand behind the mats */
    function celebratePrep() {
      if (celebrate) return;
      celebrate = { ready: false, ownerSat: false, staffDone: false };
      walkTo(staff, [{ x: -3.85, z: -4.45 }, { x: -2.95, z: -5.5 }, CANDLE_AT[0]], {
        v: 1.05, face: toFlame(0),
        then: () => after(0.9, () => { lightFlame(0);
          walkTo(staff, [{ x: -2.95, z: -5.5 }, { x: -3.3, z: -4.55 }, { x: -2.55, z: -4.35 }, { x: -2.45, z: -3.3 }, STAFF_AT], { v: 1.0,
            face: Math.atan2(BUDDHA_FACE.x - STAFF_AT.x, BUDDHA_FACE.z - STAFF_AT.z),
            then: () => { celebrate.staffDone = true; staff.look = 0; } }); })
      });
    }
    /* the owner, once it is on his chest: round his counter's end (behind the youth's stool) to the radio, which he
       turns off; the right candle, which he lights; and back to his stool */
    function celebrateBegin() {
      if (!celebrate) celebratePrep();
      /* (to where he stands to sit, turned to his seat, and only then down: the walk ended 0.46 m off and 31° round,
         and he popped onto his stool in one frame — GF-3, FK over his takes) */
      after(0.8, () => walkTo(owner, [{ x: 3.98, z: -4.3 }, { x: 2.95, z: -5.5 }, RADIO_AT], {
        v: 0.85, face: Math.PI,
        then: () => after(0.7, () => { radioSwitch(false);
          walkTo(owner, [CANDLE_AT[1]], { v: 0.8, face: toFlame(1),
            then: () => after(0.9, () => { lightFlame(1);
              walkTo(owner, [{ x: OWN_SIT.x, z: OWN_SIT.z }], { v: 0.8, face: OWN_SIT.ry,
                then: () => after(0.9, () => { if (owner.turnTo === null || owner.turnTo === undefined || Math.abs(owner.group.rotation.y - OWN_SIT.ry) < 0.2) sitOwner(false); else after(0.4, () => sitOwner(false)); }) }); }) }); })
      }));
    }
    function lightFlame(i) {
      flamesOn = true; flames[i].visible = true;
      if (worldSfx) worldSfx('candlelit3', 0.55, 1, panAt(flames[i].position.x, ALTAR.z));
    }
    function radioSwitch(on) {
      if (radioOn === on) return;
      radioOn = on; radioLed.visible = on;
      if (worldSfx) worldSfx('torchclick', 0.45, 0.8, panAt(RADIO_AT.x, ALTAR.z));   // (its switch either way: v21.8 turns it OFF)
    }
    function sitOwner(instant) {
      const r = owner;
      r.path = null; r.turnTo = null;
      r.group.position.set(OWN_SIT.x, 0, OWN_SIT.z);
      r.group.rotation.y = OWN_SIT.ry;
      r.sitting = true; r.idle = SIT_W; r.look = 0;
      if (r.acts && r.acts[SIT_W]) r.play(SIT_W, 1, instant ? 0 : 0.7);
      r.yTo = -(r.seatDrop || 0);
      if (instant && r.model && r.baseY !== undefined) { r.yOff = r.yTo; r.model.position.y = r.baseY + r.yOff; }
      if (ownerStool) ownerStool.visible = true;
      if (celebrate) celebrate.ownerSat = true;
    }
    /* a resume past the celebration: everyone where the chant finds them */
    function snapCelebration() {
      celebrate = { ready: true, ownerSat: true, staffDone: true };
      staff.path = null; staff.group.position.set(STAFF_AT.x, 0, STAFF_AT.z);
      staff.group.rotation.y = Math.atan2(BUDDHA_FACE.x - STAFF_AT.x, BUDDHA_FACE.z - STAFF_AT.z); staff.look = 0;
      if (staff.acts && staff.idle) staff.play(staff.idle, 1, 0);
      sitOwner(true);
      flames.forEach(f => { f.visible = true; }); flamesOn = true;
      radioOn = false; radioLed.visible = false;          // (v21.8: off for the monk's chant — set, not switched, so a resume clicks nothing)
    }

    /* 5 · THE MAT — step into the glow (or press) and he kneels, hands
       together, facing the Buddha (e3c2's kneel, glide and turn) */
    function kneel() {
      if (phase !== 'join' || seated || !wornNow()) return;
      seated = 'mat';
      if (kit) kit.root(true);
      if (worldSfx) worldSfx('matkneel3', 0.8);
      turnTo(faceBuddha(), 1.0, { y: 0.98, span: 1.35, lo: -0.75, hi: 0.55, pos: MAT, pitch: 0.18 }, () => {
        if (kit && kit.pray) kit.pray(true, { secs: 1.2, y: -0.33 });
      });
      setPhase('chant');
      chant = { t0: -1 };
    }
    function turnTo(to, secs, o, done) {
      turning = { t: 0, from: yaw.rotation.y, to, secs, y: o.y, span: o.span, lo: o.lo, hi: o.hi, done,
                  pos: o.pos || null, p0: { x: yaw.position.x, z: yaw.position.z }, pitch: o.pitch, pt0: pitch.rotation.x };
    }
    function turnTick(wdt) {
      if (!turning) return;
      const T2 = turning;
      T2.t += wdt / T2.secs;
      const k = smooth(Math.min(1, T2.t));
      let d = T2.to - T2.from; while (d > Math.PI) d -= Math.PI * 2; while (d < -Math.PI) d += Math.PI * 2;
      yaw.rotation.y = T2.from + d * k;
      if (T2.pos) { yaw.position.x = T2.p0.x + (T2.pos.x - T2.p0.x) * k; yaw.position.z = T2.p0.z + (T2.pos.z - T2.p0.z) * k; }
      if (T2.pitch != null) pitch.rotation.x = T2.pt0 + (T2.pitch - T2.pt0) * k;
      if (kit) kit.pose('lying', { y: T2.y, yaw: yaw.rotation.y, span: 0.02, pitchLo: Math.min(T2.lo, pitch.rotation.x - 0.01), pitchHi: Math.max(T2.hi, pitch.rotation.x + 0.01), secs: 0.9 });
      if (T2.t >= 1) {
        turning = null;
        if (kit) kit.pose('lying', { y: T2.y, yaw: T2.to, span: T2.span, pitchLo: T2.lo, pitchHi: T2.hi, secs: 0.05 });
        if (T2.done) T2.done();
      }
    }
    /* a standing look turned onto something (the owner at the gift) */
    function faceTo(p, secs) {
      camera.getWorldPosition(_cp);
      const toY = Math.atan2(-(p.x - yaw.position.x), -(p.z - yaw.position.z));
      const toP = Math.atan2(p.y - _cp.y, Math.hypot(p.x - yaw.position.x, p.z - yaw.position.z));
      facing = { t: 0, secs, y0: yaw.rotation.y, p0: pitch.rotation.x, y1: toY, p1: toP };
    }
    function faceTick(wdt) {
      if (!facing) return;
      const F = facing; F.t += wdt / F.secs;
      const k = smooth(Math.min(1, F.t));
      let d = F.y1 - F.y0; d = Math.atan2(Math.sin(d), Math.cos(d));
      yaw.rotation.y = F.y0 + d * k;
      pitch.rotation.x = F.p0 + (F.p1 - F.p0) * k;
      if (F.t >= 1) facing = null;
    }

    /* 6 · THE CHANT — once the owner has turned the radio off and sat: the
       shop's small bell, the krap (three bows — the monk, the room and he
       together), and then THE MONK LEADS (v21.8, Chad: "When the chanting
       begins, instead of saying the usual 'namo tassa', i want it to say:
       Imina Sakarena Buddham Pujaymi, Imina Sakarena Dhammam Pujaymi, Imina
       Sakarena Sangham Pujaymi, Araham samma-sambuddho bhagava, Buddham
       bhagavantam abhivademi ... Just as these lines finish, the player's
       trance and voiceline of 'no, not here' should start accordingly. Then
       the minigame"). Everyone bows once with him on "abhivademi" — I bow to
       the Blessed One — and on the frame his last word ends the melody nobody
       else hears comes up, the hands start to part on their own, and "No...
       not here." follows a quarter of a second after it. */
    const CHANT_BOW = 28.2;                               // mk3chant: "apiwaa-tay-mee" is its last 1.9 s (28.4-30.3, measured): the bow goes down into it
    function chantTick() {
      if (phase !== 'chant' || !chant || turning) return;
      if (chant.t0 < 0) {
        if (!celebrate || !celebrate.ownerSat || radioOn) return;
        chant.t0 = dayClock.t;
        after(0.6, () => { if (worldSfx) worldSfx('e3bell', 0.45, 1, panAt(0, ALTAR.z)); });
        after(1.1, () => { bowing = { t0: dayClock.t, applied: 0 }; });
        after(8.4, () => queueLine('mk3chant', () => {
          monk.chantT0 = dayClock.t; owner.nod = SECS.mk3chant;
          after(CHANT_BOW, () => { if (phase === 'chant') bowing = { t0: dayClock.t, applied: 0, once: true }; });
          after(SECS.mk3chant + 0.05, tranceStirs);       // his last word
          after(SECS.mk3chant + 0.15, () => queueLine('z3shift1', () => {
            if (kit && kit.hands) kit.hands(0.45, { secs: 2.4 });
            after(SECS.z3shift1 + 0.5, riseUp);          // and as his words end, he rises
          }));
        }, 1, panAt(MONK.x, MONK.z)));
      }
    }
    /* the krap: the lens dips three times and comes back, riding on his own
       look (e3c2's v19.2 law); the two kneeling in front bow with him, and
       (v21.8) the monk. A bow `once` is the one on "abhivademi" */
    function bowTick() {
      const t = bowing ? dayClock.t - bowing.t0 : -1;
      const once = !!(bowing && bowing.once), END = once ? 2.3 : 7.3;
      let b = 0;
      if (t >= 0) for (const [a0, a1] of (once ? [[0.25, 2.05]] : [[0.25, 2.25], [2.55, 4.55], [4.85, 6.85]])) { const u = (t - a0) / (a1 - a0); if (u > 0 && u < 1) b = Math.sin(u * Math.PI); }
      if (!bowing || !bowing.free) { for (const r of [girl, manW]) r.bow = b; monk.bow = b; }
      if (!bowing) return;
      if (t < END && (seated || bowing.free)) {
        const base = pitch.rotation.x - bowing.applied;
        const p2 = Math.max(-0.75, Math.min(0.55, base - b * 0.62));
        pitch.rotation.x = p2; bowing.applied = p2 - base;
      }
      if (t > END + 0.3) { if (!bowing.free) { for (const r of [girl, manW]) r.bow = 0; monk.bow = 0; } bowing = null; }
    }
    function tranceStirs() {
      if (phase !== 'chant' || trance) return;
      danceTo = 1;                                         // the melody nobody else hears
      if (worldSfx) worldSfx('presencein', 0.75);
      if (kit) { if (kit.hands) kit.hands(0.2, { secs: 2.6 }); kit.presence(0.12); }
    }
    function riseUp() {
      if (phase !== 'chant') return;
      seated = null;
      if (kit) {
        kit.pose('standing', { secs: 2.2 });
        if (kit.hands) kit.hands(0.8, { secs: 2.0 });
        kit.presence(0.3);
      }
      for (const r of [owner, staff, auntie, youth]) r.look = 1;
      girl.look = 0.8; manW.look = 0.8; monk.look = 0.5;   // (v21.8: the monk only turns his head — the man is at his back)
      /* the girl in front of him turns round on her knees to see, her hands
         together — what STAY PRESENT asks him to notice is in sight */
      girl.turnTo = Math.atan2(MAT.x - girl.group.position.x, MAT.z - girl.group.position.z);
      if (girl.acts && girl.acts.pray) girl.play('pray', 1, 0.6);
      owner.nod = 0;
      queueGap(0.4);
      queueLine('z3shift2', () => { if (kit && kit.hands) kit.hands(1, { secs: 1.6 }); });
      after(1.0, () => beginTrance());
    }

    /* 7 · THE TRANCE — the body dances; the eyes are still his. A turn that
       is not his carries him round the shop, lingering on whatever the
       minigame is asking him to notice — STAY PRESENT: the case file's own
       sentence ("I was conscious the whole time. I knew what I was doing and
       I knew what was happening around me") as a thing to do. The dance is
       applied as DELTAS on his own look (v11.1), so a mouse still owns where
       the eyes go. */
    const headOf = (r, fb) => { if (r.head) { r.head.getWorldPosition(_tg); return { x: _tg.x, y: _tg.y + 0.06, z: _tg.z }; } return fb; };
    const handsOf = (r, fb) => {
      if (r.handR && r.handL) { r.handR.getWorldPosition(_tg); r.handL.getWorldPosition(_tg2); return { x: (_tg.x + _tg2.x) / 2, y: (_tg.y + _tg2.y) / 2, z: (_tg.z + _tg2.z) / 2 }; }
      return fb;
    };
    const _tg = new THREE.Vector3(), _tg2 = new THREE.Vector3();
    const TGTS = [
      { label: W.tgBuddha, at: () => BUDDHA_FACE },
      { label: W.tgCandle, at: () => ({ x: flames[1].position.x, y: flames[1].position.y, z: flames[1].position.z }) },
      { label: W.tgOwner,  at: () => headOf(owner, { x: OWN_SIT.x, y: 1.25, z: OWN_SIT.z }) },
      { label: W.tgClock,  at: () => CLOCK },
      { label: W.tgAuntie, at: () => handsOf(auntie, { x: -2.45, y: 0.95, z: -4.85 }) },
      { label: W.tgGirl,   at: () => handsOf(girl, { x: GIRL_AT.x, y: 0.85, z: GIRL_AT.z }) }
    ].map((tg, i) => ({ label: tg.label, at: tg.at, pos: () => { curTgt = i; return tg.at(); },
                        /* v21.2: its light may come on only once the dance has brought the thing to rest (the engine's
                           steady focus asks; tranceTick answers) */
                        ready: () => !!trance && trance.readyFor === i }));
    function beginTrance() {
      if (phase !== 'chant') return;
      setPhase('trance', { complete: false });            // the chant is not "completed" as the body takes over (e3c2's v18.4)
      trance = { t: 0, yaw: yaw.rotation.y, py: pitch.rotation.x, appY: yaw.rotation.y, appP: pitch.rotation.x, ev: false, done: false,
                 amp: 1, tgt: 0, readyFor: -1, settle: 0 };
      curTgt = 0;
      after(SECS.z3shift2 + 0.9, beginAware);
    }
    function beginAware() {
      if (!trance || trance.ev || !kit) return;
      trance.ev = true;
      /* (the v21.1 review, three corrections) THE RING IS THE WINDOW: the ring closes over `each`, and a tap after the
         last paying band (react[3], 1.8 s) was already MISSED — so at 3.2 s a player doing what the brief says ("before
         its ring closes") was charged for a ring still 1.7x the light. It closes at 1.9 now, where the paying window
         ends; a late tap cost the same as a timeout before, so nothing about the scoring moves. A MISS COSTS SANITY:
         with no `penalty` the engine charged the award's stat, awareness, while the words said "SANITY LOST" and the
         plan said sanity. And the body's drain waits while the brief is read (presence 0 until START, then back). */
      if (kit.presence) kit.presence(0);
      /* v21.2 (Chad: "the minigame is unplayable at all, i cant hit the lights, and i cannot see the lights appear
         where i need to hit"): a STEADY light. It comes on only once the dance has brought its thing to rest a third of
         the way out from the middle (tranceTick's readyFor), inside the box between the raised hands and the panel,
         with a flash and the HUD's chime, and it holds still there; its life is 2.4 s, read against bands a thumb on
         glass can meet (a fair reaction to a light that does not move is 0.6-1.0 s). Measured at sixty frames a second
         on a phone, v21.1's lights came on at the very right edge, half off the glass, and slid 90-190 px under the
         finger reaching for them. */
      kit.event({ kind: 'focus', graded: true, steady: true, label: W.evAware, brief: W.evAwareBrief, demo: 'spot',
                  targets: TGTS, each: 2.4, react: [0.8, 1.2, 1.7, 2.3], tol: 110,
                  gap: 0.7, box: { x: 0.7, yLo: -0.55, yHi: 0.3 }, popSound: 'hudnext', popVol: 0.45,
                  missCost: 5, penalty: { stat: 'sanity' }, award: { stat: 'awareness', per: 1, hi: 12 },
                  onBegin: () => { if (trance && !trance.done && kit.presence) kit.presence(0.3); } })
        .then(r => { if (!trance || !r || r.aborted) return; awareDone(r); });
    }
    function awareDone(r) {
      trance.done = true;
      /* v21.8: THE BOOKMARK SAYS THE MINIGAME IS PLAYED. Chad: "The minigame sometimes works and sometimes doesnt
         work, depending on whether i pressed continue game". It did not depend on the way in — every way in played it
         (dbg-e3c3paths.mjs: a fresh link, Continue, the selector, chapter 2 played through) — it depended on WHEN the
         last save was made: the autosave writes every 8 s of play, and the phase was 'trance' from the hands parting
         to the film, before the minigame as well as after it. A Continue read every 'trance' as spent and put him at
         the shrine, so a phone closed (or reloaded) anywhere in those twenty seconds lost the minigame for good. Only
         a played one is tagged now; an untagged 'trance' goes back to the mat and plays it */
      if (kit) kit.setPhase('trance:done');
      bank(r.ok ? W.noteAware : W.noteLost);
      after(1.4, startTranceFilm);
    }
    function startTranceFilm() {
      if (phase !== 'trance' || !kit || !kit.film) return;
      if (kit.presence) kit.presence(0);
      /* (onDone hands back { skipped }: it must NOT reach toShrine's second argument, which is the PHASE to land in —
         the first build passed it straight through, so every player who reached the shrine landed in a phase that was
         an object: no objective, no incense, no readings, no decision. Found by three reviewers at once) */
      if (!kit.film('trance', { onDone: () => toShrine(false) })) toShrine(false);
    }
    function tranceTick(wdt) {
      const T = trance; if (!T) return;
      T.t += wdt;
      camera.getWorldPosition(_cp);
      const i = Math.min(TGTS.length - 1, curTgt);
      if (T.tgt !== i) { T.tgt = i; T.readyFor = -1; T.settle = 0; }    // a new thing to bring to rest
      const P = TGTS[i].at();
      // its bearing, unwrapped onto the way the dance turns (to his right)
      let b = Math.atan2(-(P.x - yaw.position.x), -(P.z - yaw.position.z));
      while (b > T.yaw + 0.7) b -= Math.PI * 2;
      while (b < T.yaw - Math.PI * 2 + 0.7) b += Math.PI * 2;
      /* v21.2: the thing is brought to REST a third of the way out from the middle, to one side and then the other,
         and a little above the middle — between the raised hands below and the panel above — and its light comes on
         only then. v21.1 aimed at ~0.45 of the half-width and the light came on the moment the thing crossed the
         screen's edge, with the turn still carrying it in (dbg-e3c3aware.mjs, sixty frames a second on a phone). */
      const tanV = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)), tanH = tanV * camera.aspect;
      const off = Math.atan(0.3 * tanH) * (i % 2 ? 1 : -1);
      const want = (T.done ? T.yaw - 0.5 : b + off);
      const dy = want - T.yaw;
      T.yaw += THREE.MathUtils.clamp(dy * (1 - Math.exp(-wdt * 2.2)), -0.9 * wdt, 0.9 * wdt);
      const elev = Math.atan2(P.y - _cp.y, Math.hypot(P.x - _cp.x, P.z - _cp.z));
      const pWant = THREE.MathUtils.clamp(elev - Math.atan(0.06 * tanV), -0.7, 0.6);
      T.py += (pWant - T.py) * (1 - Math.exp(-wdt * 2.4));
      /* at rest, its light may come on (the engine asks the target's ready(); before START the dance only turns) */
      const near = !T.done && Math.abs(want - T.yaw) < 0.025 && Math.abs(pWant - T.py) < 0.03;
      T.settle = near ? T.settle + wdt : 0;
      if (T.ev && T.settle > 0.12) T.readyFor = i;
      /* and the dance QUIETENS as it arrives and holds still while the light is up: at full, the sway, the nod and
         the feet's drift carried a thing 50-70 px about a phone's screen in under a second */
      const far = THREE.MathUtils.clamp(Math.abs(want - T.yaw) / 0.3, 0, 1);
      const ampTo = T.done ? 1 : T.readyFor === i ? 0.08 : 0.2 + 0.8 * far;
      T.amp += (ampTo - T.amp) * (1 - Math.exp(-wdt * 5));
      const sway = T.amp * (0.09 * Math.sin(T.t * 1.25) + 0.035 * Math.sin(T.t * 2.9 + 0.7));
      const nod = T.amp * 0.05 * Math.sin(T.t * 1.7 + 1.1);
      const Y = T.yaw + sway, Pp = T.py + nod;
      yaw.rotation.y += Y - T.appY; T.appY = Y;
      pitch.rotation.x += Pp - T.appP; T.appP = Pp;
      // the feet drift a hand's breadth round the mat as it turns him
      yaw.position.x = MAT.x + T.amp * 0.07 * Math.sin(T.t * 0.7);
      yaw.position.z = MAT.z + T.amp * 0.05 * Math.sin(T.t * 0.9 + 0.8);
    }

    /* ================================================ PLAY B · THE SHRINE
       arrive (the incense, three bows) → wait (his stool, two readings) →
       called (the assistant calls; the body walks him to the table and bows
       him) → the reading → the roar (a film) → decide. Every beat on the
       chapter clock; the shrine's people tick only while he is there. */
    const JOSS_W = { x: LX(JOSS.x), z: JOSS.z }, STOOL_W = { x: LX(MYSTOOL.x), z: MYSTOOL.z };
    const INC_AT = { x: LX(0), z: -0.92 };                   // where he stands to offer, the urn before him
    const TABLE_AT = { x: LX(0.1), z: -5.5 };               // where his legs stop him, before the medium's table
    const MED_EYE = { x: MED_AT.x, y: 1.42, z: MED_AT.z + 0.1 };
    const ALT_FACE = { x: LX(0), y: 1.6, z: -9.7 };
    const WIFE_HEAD = { x: WIFE_AT.x, y: 1.05, z: WIFE_AT.z }, FATHER_HEAD = { x: FATHER_AT.x, y: 1.08, z: FATHER_AT.z };
    let inc = null, sitB = null, walkB = null, bowB = null, roarDone = false;
    const camYawFrom = (from, p) => Math.atan2(-(p.x - from.x), -(p.z - from.z));
    const zoneB = mkZone(STOOL_W.x, STOOL_W.z, world);

    /* THE THREE STICKS IN HIS HANDS (the plan's 7.2): red stems, the brown
       incense over them, an ember at each tip and a thread of smoke, held
       between the palms through the bows (kit.hold, the twenty-seventh seam —
       a child of the right arm, drawn in the hands' own pass, so the palms
       close round them) and planted in the urn's sand. In the clasp's frame:
       +y is up the fingers, -z ahead; the origin is between the palms. */
    const jossHeld = new THREE.Group(); jossHeld.visible = false;
    const jossSmoke = [];
    { const tilt = new THREE.Group(); tilt.rotation.x = -0.16; jossHeld.add(tilt);
      const stemM = new THREE.MeshStandardMaterial({ color: 0xb02018, roughness: 0.55 });
      const coatM = new THREE.MeshStandardMaterial({ color: 0x5c3a22, roughness: 0.95 });
      const tipM  = new THREE.MeshBasicMaterial({ color: 0xff8030 });
      const glowM = addGlow(glowSod, 0.85);
      for (const m of [stemM, coatM, tipM, glowM]) owned.push({ dispose: () => m.dispose() });
      const stemG = new THREE.CylinderGeometry(0.0018, 0.0018, 0.12, 5), coatG = new THREE.CylinderGeometry(0.0027, 0.0024, 0.2, 6),
            tipG = new THREE.SphereGeometry(0.0034, 6, 4), glowG = new THREE.PlaneGeometry(0.03, 0.03);
      for (const g of [stemG, coatG, tipG, glowG]) owned.push({ dispose: () => g.dispose() });
      for (let i = 0; i < 3; i++) {
        const s = new THREE.Group(); s.position.set((i - 1) * 0.007, 0, (i % 2) * -0.004); s.rotation.z = (i - 1) * -0.07; tilt.add(s);
        const st = new THREE.Mesh(stemG, stemM); st.position.y = -0.02; s.add(st);
        const ct = new THREE.Mesh(coatG, coatM); ct.position.y = 0.14; s.add(ct);
        const tp = new THREE.Mesh(tipG, tipM); tp.position.y = 0.242; s.add(tp);
        const gl = new THREE.Mesh(glowG, glowM); gl.position.y = 0.242; gl.renderOrder = 2; s.add(gl);
      }
      for (let i = 0; i < 6; i++) {
        const m = new THREE.MeshBasicMaterial({ map: matSmoke.map, transparent: true, depthWrite: false, opacity: 0, color: 0xd8d4cc, fog: false });
        owned.push({ dispose: () => m.dispose() });
        const q = new THREE.Mesh(glowG, m); q.renderOrder = 2; q.userData.ph = i / 6; tilt.add(q); jossSmoke.push(q);
      } }
    owned.push({ dispose: () => { if (kit && kit.hold && kit.holding && kit.holding() === jossHeld) kit.hold(null); } });
    function jossSmokeTick(t) {
      if (!jossHeld.visible) return;
      for (const q of jossSmoke) {
        const u = (t * 0.32 + q.userData.ph) % 1;               // a thread rising off the tips and fading
        q.position.set(0.004 * Math.sin(t * 1.7 + q.userData.ph * 9) + 0.01 * u * Math.sin(q.userData.ph * 5), 0.25 + u * 0.16, -0.01 * u);
        q.scale.setScalar(0.6 + u * 2.2);
        q.material.opacity = 0.32 * Math.sin(Math.PI * u) * (1 - u * 0.4);
      }
    }
    function jossHold(on) {
      jossHeld.visible = !!on;
      if (!kit || !kit.hold) return;
      if (on) kit.hold(jossHeld, { clasp: true });
      else if (kit.holding && kit.holding() === jossHeld) kit.hold(null);
    }

    /* 1 · THE INCENSE — at the joss table: three sticks lit at its candle, he
       turns to the altar over the urn, the hands together round the sticks,
       three bows, and he looks down into the urn and plants them in the sand
       (bowTick's three bows, made standing) */
    function incenseBegin() {
      if (phase !== 'arrive' || inc) return false;
      inc = { t0: dayClock.t };
      if (kit) kit.root(true);
      if (worldSfx) worldSfx('incenselit3', 0.8, 1, panAt(JOSS_W.x, JOSS_W.z));
      turnTo(camYawFrom(INC_AT, ALT_FACE), 1.5, { y: 1.62, span: 0.9, lo: -0.7, hi: 0.5, pos: INC_AT, pitch: -0.08 }, () => {
        if (kit && kit.pray) kit.pray(true, { secs: 1.0, y: -0.3 });
        jossHold(true);
        after(1.2, () => { bowing = { t0: dayClock.t, applied: 0, free: true }; });
        after(8.3, () => turnTo(yaw.rotation.y, 0.6, { y: 1.62, span: 0.9, lo: -0.7, hi: 0.5, pos: null, pitch: -0.42 }));   // down, into the urn
        after(8.9, () => {
          if (worldSfx) worldSfx('urnsand', 0.9, 1, 0);
          urnLight(true); jossHold(false);
          if (kit && kit.pray) kit.pray(false, { secs: 0.9 });
          bank(W.noteIncense, 0, 2);
          after(1.0, () => {
            if (kit) { kit.pose('standing', { secs: 0.4 }); kit.root(false); }
            asst.look = 1; asst.lookAt = null;
            queueGap(0.3);
            queueLine('as3sit', () => { asst.nod = SECS.as3sit; }, 1, panAt(ASST_AT.x, ASST_AT.z));
            setPhase('wait');
          });
        });
      });
      return true;
    }
    function urnLight(on) { urnLit = on; for (const o of bigUrn.userData.lit) o.visible = on; }

    /* 2 · HIS STOOL — and while he waits, the two readings he watches, each
       given with complete certainty, each sent off with a remedy */
    function sitDown() {
      if (phase !== 'wait' || sitB) return;
      /* he faces between the medium and the wife (each ~10° off the middle, so a
         phone's ±18° holds both through her reading); the father's turn comes
         with his reading, unless the player has already looked elsewhere */
      sitB = { t0: dayClock.t, aim: readAim(WIFE_HEAD, 0.5) };
      if (kit) kit.root(true);
      if (worldSfx) worldSfx('stoolscrape', 0.6, 1, panAt(STOOL_W.x, STOOL_W.z));
      turnTo(sitB.aim, 1.2, { y: 1.13, span: 1.35, lo: -0.75, hi: 0.5, pos: STOOL_W, pitch: -0.06 }, () => {
        if (kit) kit.root(false);
        /* VP-7: his hands joined and low while he waits his turn — the walking hand, its index finger out, pointed at
           each person being read through both readings (the v21.1 photographs). The body's walk lifts them out of
           this clasp, as e3c2's fight lifts them out of its prayer. */
        if (kit && kit.pray) kit.pray(true, { secs: 1.0, y: -0.4 });
        objectiveFor('watch');
        readingsBegin();
      });
    }
    /* a seated look between the medium's eyes and someone: `w` of the way from him to them */
    function readAim(p, w) {
      const ya = camYawFrom(STOOL_W, MED_EYE), yb = camYawFrom(STOOL_W, p);
      let d = yb - ya; while (d > Math.PI) d -= Math.PI * 2; while (d < -Math.PI) d += Math.PI * 2;
      return ya + d * w;
    }
    function readingsBegin() {
      medium.look = 1; medium.lookAt = WIFE_HEAD;
      queueGap(1.4);
      queueLine('dv3wife', () => talk(wife, SECS.dv3wife, 'Talk'), 1, panAt(WIFE_AT.x, WIFE_AT.z));
      queueGap(0.5);
      queueLine('md3read1', () => { medPose(MED_READ); after(SECS.md3read1, () => medPose(MED_SIT)); }, 1, panAt(MED_AT.x, MED_AT.z));
      queueGap(0.6);
      queueLine('md3drink', () => {
        medPose(MED_READ);
        after(0.9, () => talismanGiven(true));
        after(SECS.md3drink + 0.2, () => { medPose(MED_SIT); wife.nod = 1.4; after(1.6, wifeLeaves); });
      }, 1, panAt(MED_AT.x, MED_AT.z));
    }
    function wifeLeaves() {
      if (worldSfx) worldSfx('stoolscrape', 0.55, 1, panAt(WIFE_AT.x, WIFE_AT.z));
      wife.look = 0;
      walkTo(wife, [{ x: WIFE_AT.x - 0.35, z: WIFE_AT.z + 0.55 }, { x: LX(-2.55), z: -2.4 }, { x: LX(-2.6), z: 0.6 }, { x: LX(-7.3), z: 1.0 }],
             { v: 0.95, then: (r) => { r.group.visible = false; } });
      medium.lookAt = FATHER_HEAD;
      if (sitB && !turning && sitB.aim !== undefined) {
        let dd = yaw.rotation.y - sitB.aim; while (dd > Math.PI) dd -= Math.PI * 2; while (dd < -Math.PI) dd += Math.PI * 2;
        if (Math.abs(dd) < 0.15) {                     // still where we put him: turn him to the father (40° round)
          sitB.aim = readAim(FATHER_HEAD, 0.6);
          turnTo(sitB.aim, 1.8, { y: 1.13, span: 1.35, lo: -0.75, hi: 0.5, pos: null, pitch: pitch.rotation.x });
        }
      }
      queueGap(2.2);
      queueLine('dv3father', () => { father.nod = SECS.dv3father; }, 1, panAt(FATHER_AT.x, FATHER_AT.z));
      queueGap(0.5);
      queueLine('md3read2', () => {
        medPose(MED_READ);
        after(SECS.md3read2 + 0.3, () => { medPose(MED_SIT); if (worldSfx) worldSfx('taobell', 0.75, 1, panAt(MED_AT.x, MED_AT.z)); });
      }, 1, panAt(MED_AT.x, MED_AT.z));
      queueGap(2.4);
      queueLine('md3done', () => { father.nod = 1.5; after(SECS.md3done + 1.0, fatherLeaves); }, 1, panAt(MED_AT.x, MED_AT.z));
    }
    function fatherLeaves() {
      if (worldSfx) worldSfx('stoolscrape', 0.55, 1, panAt(FATHER_AT.x, FATHER_AT.z));
      father.look = 0;
      walkTo(father, [{ x: FATHER_AT.x - 0.4, z: FATHER_AT.z + 0.75 }, { x: LX(-0.8), z: -2.6 }, { x: LX(-0.8), z: 0.6 }, { x: LX(-7.3), z: 1.1 }],
             { v: 1.0, then: (r) => { r.group.visible = false; } });
      medium.lookAt = null;                                   // and now he looks at the one still waiting
      queueGap(3.0);
      queueLine('as3next', () => { asst.nod = SECS.as3next; asst.lookAt = null; asst.look = 1; after(SECS.as3next + 0.4, bodyWalks); },
                1, panAt(ASST_AT.x, ASST_AT.z));
    }

    /* 3 · THE BODY WALKS — not his: rooted, the lens carried off the stool,
       across the floor to the table at a step that is not his own, the hands
       a little up; there it turns him to the medium and BOWS him, deep and
       formal (the case file: "the body moved forward and bowed to him") */
    function bodyWalks() {
      if (phase !== 'wait') return;
      setPhase('called', { complete: false });            // nor is the wait, as the body walks off without him
      if (kit) {
        kit.root(true); kit.presence(0.2);
        kit.pose('standing', { secs: 1.1 });
        if (kit.hands) kit.hands(0.3, { secs: 2.2 });
      }
      if (worldSfx) worldSfx('stoolscrape', 0.7, 1, panAt(STOOL_W.x, STOOL_W.z));
      after(0.6, () => queueLine('z3walk'));
      const pts = [{ x: STOOL_W.x + 0.25, z: STOOL_W.z - 0.15 }, { x: LX(-1.3), z: -5.25 }, TABLE_AT];
      walkB = { i: 0, pts, t: 0, wait: 1.2, step: 0 };
    }
    function walkBTick(wdt) {
      const W2 = walkB; if (!W2) return;
      if (W2.wait > 0) { W2.wait -= wdt; return; }
      W2.t += wdt;
      const tgt = W2.pts[W2.i], dx = tgt.x - yaw.position.x, dz = tgt.z - yaw.position.z, d = Math.hypot(dx, dz), v = 0.62 * wdt;
      // the eyes go where the legs go, a little late; the head bobs on the steps
      const want = Math.atan2(-dx, -dz);
      let a = want - yaw.rotation.y; a = Math.atan2(Math.sin(a), Math.cos(a));
      yaw.rotation.y += a * (1 - Math.exp(-wdt * 2.6));
      if (kit) kit.pose('lying', { y: 1.62 + 0.018 * Math.sin(W2.t * 8.6), yaw: yaw.rotation.y, span: 0.02, pitchLo: -0.3, pitchHi: 0.2, secs: 0.2 });
      if ((W2.step += wdt) > 0.58) { W2.step = 0; if (worldSfx) worldSfx(['step1', 'step2', 'step3', 'step4'][(W2.t * 7 | 0) % 4], 0.45, 0.9, 0); }
      if (d <= v) {
        yaw.position.x = tgt.x; yaw.position.z = tgt.z;
        if (++W2.i >= W2.pts.length) { walkB = null; bowToMedium(); }
        return;
      }
      yaw.position.x += dx / d * v; yaw.position.z += dz / d * v;
    }
    function bowToMedium() {
      medium.look = 1; medium.lookAt = null;
      turnTo(camYawFrom(TABLE_AT, MED_EYE), 0.9, { y: 1.62, span: 0.4, lo: -0.85, hi: 0.4, pos: null, pitch: -0.12 }, () => {
        if (kit && kit.pray) kit.pray(true, { secs: 0.7, y: -0.3 });
        bowB = { t: 0 };
        after(3.9, () => {
          if (kit && kit.pray) kit.pray(false, { secs: 0.8 });
          queueGap(0.4);
          queueLine('md3ghost', () => { medPose(MED_READ); after(SECS.md3ghost + 0.3, startRoar); }, 1, panAt(MED_AT.x, MED_AT.z));
        });
      });
    }
    /* the bow: the lens goes down to the table's edge and comes back, the
       body dipping with it — on the clock, as deltas on his own look */
    function bowBTick(wdt) {
      const B2 = bowB; if (!B2) return;
      B2.t += wdt;
      const t = B2.t;
      const k = t < 1.3 ? smooth(t / 1.3) : t < 2.2 ? 1 : t < 3.4 ? 1 - smooth((t - 2.2) / 1.2) : 0;
      const p0 = B2.p0 ?? (B2.p0 = pitch.rotation.x);
      pitch.rotation.x = p0 - 0.78 * k;
      if (kit) kit.pose('lying', { y: 1.62 - 0.2 * k, yaw: yaw.rotation.y, span: 0.02, pitchLo: -1.0, pitchHi: 0.4, secs: 0.05 });
      if (t >= 3.4) bowB = null;
    }

    /* 4 · THE ROAR — a film from play (the twenty-sixth seam): the reading
       lands, and what answers is not him */
    function startRoar() {
      if (phase !== 'called' || !kit || !kit.film) return;
      if (kit.presence) kit.presence(0);
      if (!kit.film('roar', { onDone: () => afterRoar() })) afterRoar();
    }
    function afterRoar() {
      roarDone = true;
      medStand(true, 0);
      if (kit) { kit.root(true); if (kit.hands) kit.hands(0, { secs: 0.6 }); }
      yaw.position.x = TABLE_AT.x; yaw.position.z = TABLE_AT.z + 0.2;
      /* the decision panel covers the bottom half of the screen (a phone's
         lower 60 %): looking a little down puts his face and the bell in the
         top half, over it (at +0.05 a phone showed his hat and the plaque) */
      yaw.rotation.y = camYawFrom({ x: TABLE_AT.x, z: TABLE_AT.z + 0.2 }, MED_EYE); pitch.rotation.x = -0.3;   // (the roar film's last second eases onto this)
      if (kit) kit.pose('standing', { secs: 0.05 });
      setPhase('decide');
      after(0.6, () => openWhenClear(dayClock.t));
    }
    /* the decision opens once the black has lifted: the kit's fade only runs in
       PLAY, so a decision opened under it froze it there — a Continue into the
       end of the reading put the four answers over a black screen. Polled, not
       timed (a slow phone fades slowly), and never more than six seconds. */
    function openWhenClear(t0) {
      if (phase !== 'decide' || getState() !== 'play') return;
      if (kit && kit.getFade && kit.getFade() > 0.03 && dayClock.t - t0 < 6) { after(0.1, () => openWhenClear(t0)); return; }
      startDecision();
    }
    /* the medium on his feet for the rites: out of his chair to stand behind
       his table, the sword in his right hand and the bell in his left */
    const MED_STAND_DZ = 0.42;
    /* the rites' take: the bell held up in his left hand, the sword in his
       right (photographed against Stand_Talking_Angry and Talk_Passionately,
       whose arms fly out wide — those are kept for anger, scene B) */
    const MED_RITE = 'Talk_with_Left_Hand_Raised', MED_ANGRY = 'Stand_Talking_Angry';
    function medStand(on, secs = 0.6, take = MED_RITE) {
      const r = medium;
      if (!r.acts) return;
      medStanding = on;
      r.standTo = on ? 1 : 0;
      /* (an instant stand writes where he stands NOW: the tick only moves him
         while standK chases standTo, so a Continue into the reading's end left
         him standing up inside his own chair) */
      if (secs <= 0) { r.standK = r.standTo; r.group.position.z = MED_AT.z + MED_STAND_DZ * smooth(r.standK); }
      if (on) { medPose(take, secs > 0 ? 0.5 : 0); }
      else medPose(MED_SIT, secs > 0 ? 0.5 : 0);
      toolsInHands(on, secs > 0 ? 0.6 : 0);
    }
    function medStandTick(wdt) {
      const r = medium; if (r.standK === undefined) r.standK = 0;
      if (r.standTo === undefined || r.standK === r.standTo) return;
      r.standK += Math.sign(r.standTo - r.standK) * wdt / 0.6;
      r.standK = THREE.MathUtils.clamp(r.standK, 0, 1);
      r.group.position.z = MED_AT.z + MED_STAND_DZ * smooth(r.standK);
    }

    /* 8 · AWAY — the trance film ends on black (CP5); under it he is put in
       the medium's shrine that night, its light on, warmed, and the black
       lifts on "That night... I went." */
    const SHRINE_NIGHT = {
      stops: [[0.00, '#04060c'], [0.25, '#060912'], [0.55, '#080d1a'], [1.00, '#0b1224']],
      bg: 0x04060c, fog: [0x0a0b10, 0.018],
      hemi: [0xffd2a8, 0x2a1410, 0.55], key: [0xffb07a, 0.55, -2, 6, 3], fill: [0x6a7cff, 0.10],
      stars: 0.5, moon: 0, sun: 0, clouds: 0,
      vmHemi: [0xffd2a8, 0x2a1410, 0.6], vmKey: [0xffb07a, 0.5]
    };
    const ARRIVE = { x: LX(-2.25), z: 1.3 };
    function worldB(on) { shrPeople.visible = on; shrStars.visible = on; shopG.visible = mallG.visible = !on; }
    function placeAtShrine(at = 'arrive') {
      worldB(true);
      if (at === 'called' || at === 'decide') {             // the reading over: at his table, as afterRoar frames it
        yaw.position.x = TABLE_AT.x; yaw.position.z = TABLE_AT.z + 0.2;
        yaw.rotation.y = camYawFrom({ x: TABLE_AT.x, z: TABLE_AT.z + 0.2 }, MED_EYE); pitch.rotation.x = -0.3;
      } else {
        yaw.position.x = ARRIVE.x; yaw.position.z = ARRIVE.z;
        yaw.rotation.y = 0; pitch.rotation.x = -0.02;
      }
      if (kit) { kit.daylight(SHRINE_NIGHT, 0); kit.pose('standing', { secs: 0.05 }); }
    }
    /* the state a shrine phase is found in (an arrival, a Continue under the card, a Continue in play) */
    function shrineState(at) {
      const past = at !== 'arrive', done = at === 'called' || at === 'decide';
      if (past) urnLight(true);                                   // his sticks are already in the urn
      if (done) { wife.group.visible = false; father.group.visible = false; talismanGiven(true); }
      return done;
    }
    /* CF-7: the ash-water cup (ending A) and the held LP Tim (ending D) are drawn in the HANDS' pass, in no scene
       until their endings — held hidden in the hands while a warm runs, so their programs are built under a cover and
       not on their first frame (the joss sticks' v15.1 law; the v21.1 review) */
    function warmProps(on) {
      for (const o of [cupProp, timHeld]) {
        if (on) { if (!o.parent) { jossHeld.add(o); o.visible = false; o.userData.warmHeld = true; } }
        else if (o.userData.warmHeld) { o.userData.warmHeld = false; if (o.parent) o.parent.remove(o); o.visible = false; }
      }
    }
    /* (shrineRun, shrDark: declared with `alive`, at the top — objectiveFor reads shrDark) */
    function toShrine(resumed, at = 'arrive') {
      if (!PHASES.includes(at) || PHASES.indexOf(at) < PHASES.indexOf('arrive')) at = 'arrive';   // a phase, and one of the shrine's, whatever is passed
      trance = null; seated = null; turning = null; facing = null; bowing = null;
      danceTo = 0;
      const run = ++shrineRun;
      /* SR-1: a Continue into the shrine was placed UNDER the card (updateNotes' preplace) and the curtain warmed it
         there, so it raises no black of its own: it used to show the shrine, snap to black, warm, and fade it in a
         second time — and a Continue at the decision showed the door first and the table second (the v21.1 review) */
      const cold = resumed && preplaced;
      if (kit) {
        kit.root(true);
        if (kit.pray) kit.pray(false, { secs: 0 });
        if (kit.hands) kit.hands(0, { secs: 0 });
        kit.presence(0);
        if (!cold) kit.fade(1, 0.01);
      }
      if (!cold) placeAtShrine(at);
      const done = shrineState(at);
      /* ST-4: the shrine's order, its beep and its "!" wait for the picture: on the black before "That night... I
         went." they stood in a void (the v21.1 photographs) */
      shrDark = !resumed;
      setPhase(done ? 'decide' : at);
      if (cold) {
        /* (an earlier arrival this run supersedes may still be warming under its own black — an applyPhase before the
           chapter's boot arrives twice — and its warm returns on the run token without lifting that black, so the
           decision opened over it after openWhenClear's six seconds: the cold arrival lets that warm finish, holding
           what it holds, and lifts the black itself) */
        const go = () => {
          if (!alive || run !== shrineRun) return;
          jossHold(false); warmProps(false);
          if (kit && kit.getFade && kit.getFade() > 0.001) kit.fade(0, 1.2);
          if (done) { afterRoar(); return; }
          if (kit) kit.root(false);
          if (at === 'arrive') { queueGap(1.0); queueLine('z3shrine'); }
        };
        if (shrineWarm) shrineWarm.then(go); else go();
        return;
      }
      /* the joss sticks held under the black while the warm runs: they are
         drawn in the HANDS' pass, and a program the warm never saw is built on
         screen the moment he takes them at the urn (the v15.1 law) */
      jossHold(true); warmProps(true);
      const warmed = kit && kit.warm ? kit.warm() : Promise.resolve(0);
      shrineWarm = warmed;
      warmed.then(() => {
        if (shrineWarm === warmed) shrineWarm = null;
        jossHold(false); warmProps(false);
        if (!alive || run !== shrineRun) return;                  // (SR-6: a reset or a second arrival since)
        if (done) { kit && kit.fade(0, 1.2); afterRoar(); return; }
        if (!resumed) {
          queueGap(0.4);
          queueLine('z3night', () => after(SECS.z3night * 0.55, () => {
            if (run !== shrineRun) return;
            shrDark = false; objectiveFor(phase);
            if (kit) { kit.fade(0, 1.8); kit.root(false); }
          }));
          queueGap(0.9);
          queueLine('z3shrine');
        } else {
          if (kit) { kit.fade(0, 1.4); kit.root(false); }
          if (at === 'arrive') { queueGap(1.0); queueLine('z3shrine'); }
        }
      });
    }

    /* ------------------------------------------------------- the decision */
    const _ndc = new THREE.Vector3();
    /* the medium's table, over its far edge, in front of the man (it stood at
       z −5.4 — under the player's own feet at TABLE_AT, so a decision closed
       with Escape could never be reopened: straight down is never in view) */
    const PILE_POS = new THREE.Vector3(LX(MTB.x), 0, MTB.z - 0.25);
    const INTERACT_R = 2.4;
    const pile = new THREE.Group(); pile.position.copy(PILE_POS); world.add(pile);
    const pileLive = () => phase === 'decide' && inShrine(yaw.position.x);
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
       Anchors at EYE height on the thing itself (the v7.5 law).
       v21.9 (Chad: "the objective markers all have a timing that automatically
       completes if the user camera faces it. I don't want this auto timer,
       instead the user either has to tap it, click it, or press E on each
       objective in order to complete it and move to the next"): the four
       look-spots are PRESSED, never timed — `pressAim` (the twenty-eighth
       seam): E, the badge or a click under pointer lock presses the one the
       reticle is on; a tap or an unlocked click on its mark, or on the thing
       itself (`hits`, a box round it), presses it from anywhere in reach.
       The framed amulets are the trays in the staff's counter now: since
       v21.8 the wall behind it holds Chad's shelves of images, and the
       line ("Somdej, Phra Rod, Nang Phaya...") names amulets. */
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
      { id: 'lkWall', lookKey: 'wall', pos: { x: -3.2, y: 1.15, z: -3.4 }, radius: 9, aim: 0.30, pressAim: true, once: true, markFar: 9, markY: 0.25, prompt: W.lookWall,
        hits: tapBox(LCNT.x0 - 0.05, 0.35, LCNT.z1 - 0.05, LCNT.x1 + 0.05, LCNT.top + 0.02, LCNT.z0 + 0.05),   // the staff's counter, its trays
        enabled: () => phase === 'browse', onInteract() { return lookAt('wall'); } },
      { id: 'lkTim', lookKey: 'tim', pos: { x: LPT.x, y: RCNT.top + 0.12, z: LPT.z }, radius: 6, aim: 0.20, pressAim: true, once: true, markFar: 6, prompt: W.lookTim,
        hits: tapBox(LPT.x - 0.13, RCNT.top - 0.02, LPT.z - 0.15, LPT.x + 0.13, RCNT.top + 0.40, LPT.z + 0.15),   // the LP Tim on its stand
        enabled: () => phase === 'browse', onInteract() { return lookAt('tim'); } },
      { id: 'lkAltar', lookKey: 'altar', pos: { x: 0, y: 1.45, z: ALTAR.z + 0.1 }, radius: 9, aim: 0.30, pressAim: true, once: true, markFar: 9, prompt: W.lookAltar,   // (v21.8: on the row's Buddha and the monk before it)
        hits: tapBox(-ALTAR.w / 2 - 0.05, 0, SHOP.z0, ALTAR.w / 2 + 0.05, 2.45, ALTAR.z + ALTAR.d / 2 + 0.05),   // the altar, its row and the screen behind
        enabled: () => phase === 'browse', onInteract() { return lookAt('altar'); } },
      { id: 'lkMasters', lookKey: 'masters', pos: { x: SHOP.x1 - 0.05, y: 1.78, z: -2.5 }, radius: 9, aim: 0.26, pressAim: true, once: true, markFar: 9, prompt: W.lookMasters,
        hits: tapBox(SHOP.x1 - 0.2, 0.9, -3.25, SHOP.x1, 2.32, -1.75),   // the five portraits
        enabled: () => phase === 'browse', onInteract() { return lookAt('masters'); } },
      { id: 'owner', pos: { x: OWN.x - 0.05, y: 1.45, z: OWN.z }, radius: 2.7, prompt: W.hotOwner, markY: 0.3,   // (just over his head: at the default it stood under the objective box from the counter — VP-4)
        enabled: () => phase === 'owner', onInteract() { return giftBegin(); } },
      { id: 'mat', pos: { x: MAT.x, y: 1.0, z: MAT.z }, radius: 1.5, prompt: W.hotMat, markY: -0.55,   // (just over the mat's glow: 1.45 m up it read as the altar's, beside a second marker — VP-5)
        enabled: () => phase === 'join' && !seated && wornNow(), onInteract() { kneel(); return true; } },
      /* (the anchor at 1.45, near eye height, the mark still just over the bundle at 1.13: at 1.05 the badge and the
         "!" went out as he walked up to the table — 55° under a level gaze at the table's edge, the v14.1 class, GF-2.
         At the default 0.55 the mark had stood at eye height and read as over the medium's table, eight metres on) */
      { id: 'joss', pos: { x: JOSS_W.x, y: 1.45, z: JOSS_W.z }, radius: 2.2, prompt: W.hotIncense, markY: -0.32,
        enabled: () => phase === 'arrive' && !inc && !shrDark, onInteract() { return incenseBegin(); } },
      { id: 'stool', pos: { x: STOOL_W.x, y: 0.95, z: STOOL_W.z }, radius: 1.6, prompt: W.hotStool, markY: 0.15,   // (at 0.5 it stood behind the WISDOM bar and under the objective at reach — VP-4)
        enabled: () => phase === 'wait' && !sitB, onInteract() { sitDown(); return true; } }
    ];

    /* ---------------------------------------------------------- per frame */
    function watchTick() {
      const x = yaw.position.x, z = yaw.position.z;
      if (phase === 'join' && !seated && wornNow() && Math.hypot(x - MAT.x, z - MAT.z) < 0.5) kneel();
      if (phase === 'wait' && !sitB && Math.hypot(x - STOOL_W.x, z - STOOL_W.z) < 0.5) sitDown();
      /* (v21.9: the owner no longer calls him over when he walks up to the
         counter or after 45 s of wandering — the browse ends on the fourth
         press, and only there; see lookAt) */
    }
    /* THE BEDS: the mall's murmur through the glass (louder by the front);
       the radio's Thai music while it is on (v21.8: from the start, until the
       owner turns it off for the monk); the melody nobody else hears from the
       monk's last word, through the trance and into its film; the dance's own
       cloth and feet. All four go to nothing at the shrine. */
    let danceTo = 0, rite = false;
    const mixK = { mall: 0.3, chant: 0, dance: 0, move: 0, lor: 0, room: 0, bed: 0, rit: 0 };
    let mixCard = false;
    function mixBeds(wdt, st) {
      const atShop = !inShrine(yaw.position.x);
      const front = THREE.MathUtils.clamp((yaw.position.z + 4.5) / 4.0, 0, 1);
      /* (v21.2: the radio plays Thai traditional music now — Chad turned down every chant — and two melodies in
         different keys and tempos fight, where a chant under the piphat never did; so as the melody nobody else
         hears comes up, the radio sinks under it to a quarter and stays there through the trance. The room still
         hears its radio; he hears the other thing) */
      const under = 1 - 0.75 * THREE.MathUtils.clamp(mixK.dance / 0.85, 0, 1);
      /* (v21.8: the radio plays while he browses, as a shop's does — a background, 0.3 where it was 0.42 under the
         owner's Namo — and the owner turns it off for the monk's chant) */
      let mall = atShop ? 0.12 + 0.2 * front : 0, ch = atShop && radioOn ? 0.3 * under : 0, dn = atShop ? danceTo * 0.85 : 0, mv = 0;
      if (phase === 'trance' && atShop) { mv = 0.5; }
      if (danceHalt) { dn = 0; mv = 0; ch = 0; }        // the trance film: the music STOPS
      if (st === 'cine' && !booted) { mall = 0.25; ch = 0; dn = 0; mv = 0; }     // the opening film has its own sounds
      const ease = (k, to, s) => k + (to - k) * (1 - Math.exp(-wdt / s));
      mixK.mall = ease(mixK.mall, mall, 0.8); mixK.chant = ease(mixK.chant, ch, 1.2);
      mixK.dance = ease(mixK.dance, dn, dn > mixK.dance ? 4.0 : danceHalt ? 0.05 : 1.5); mixK.move = ease(mixK.move, mv, danceHalt ? 0.05 : 1.0);
      if (danceHalt) mixK.chant = ease(mixK.chant, 0, 0.05);
      /* WORLD B: the street louder by the shutters, the room tone, the bed the
         readings are given over, and once he has roared, the rites' drum */
      const inB = !atShop, outK = THREE.MathUtils.clamp((yaw.position.z + 3.0) / 4.0, 0, 1);
      /* under the outcome and sealed cards the night goes quiet: the rites'
         drum and the reading bed stop and the street and the room sink (the
         ending's own music is what the card is read over) */
      const card = st === 'result' || st === 'complete';
      const lor = inB ? (card ? 0.06 : 0.08 + 0.32 * outK) : 0, room = inB ? (card ? 0.1 : 0.26) : 0;
      /* ST-2: the endings hold the rites' drum and the room tone down with a duck, and the duck is cleared as the
         scene ends — so on the card's first frame both sprang back to their play levels and only then eased away
         (the drum climbing back under the outcome card). The two the scenes duck land on the card's own level. */
      if (card && !mixCard && inB) { mixK.rit = 0; mixK.room = room; }
      mixCard = card;
      const bed = inB && !card && !roarDone && !rite ? (phase === 'arrive' ? 0.22 : 0.3) : 0;
      const rit = inB && !card && (roarDone || rite) ? 0.5 : 0;
      mixK.lor = ease(mixK.lor || 0, lor, 0.8); mixK.room = ease(mixK.room || 0, room, 0.8);
      mixK.bed = ease(mixK.bed || 0, bed, bed > (mixK.bed || 0) ? 2.0 : 0.6); mixK.rit = ease(mixK.rit || 0, rit, 1.2);
      const B = DATA.ambience.beds;
      B[0][1] = mixK.mall; B[1][1] = mixK.chant; B[2][1] = mixK.dance; B[3][1] = mixK.move;
      B[4][1] = mixK.lor; B[5][1] = mixK.room; B[6][1] = mixK.bed; B[7][1] = mixK.rit;
    }
    const ZONE_T0 = wallNow(), _cq = new THREE.Quaternion();
    function lifeTick(wdt) {
      const t = wallNow() - ZONE_T0;
      camera.getWorldQuaternion(_cq);
      for (let i = 0; i < flames.length; i++) {
        if (!flames[i].visible) continue;
        flames[i].userData.core.scale.y = 2.2 * (1 + Math.sin(t * 11 + i * 1.7) * 0.16 + Math.sin(t * 23 + i) * 0.07);
        flames[i].userData.glow.quaternion.copy(_cq);
      }
      lpGlowTick(t);
      zone.visible = phase === 'join' && !seated && wornNow();
      zoneTick(zone, t);
      zoneB.visible = phase === 'wait' && !sitB;
      zoneTick(zoneB, t);
      jossSmokeTick(t);
      medStandTick(wdt);
      shrineTick(wdt, t);
    }

    /* ------------------------------------------------------------ the frame */
    let lastFrame = 0;
    function updateNotes(dt, t) {
      /* the people's clocks run in play AND under a film or a panel (v5.19:
         a guard that owns the poses must not own the clocks) — on wall time */
      const now = wallNow();
      /* one wall step for the people AND the chapter clock (capped alike, 0.5 s):
         a walk on a 0.1 s cap crawled at a fifth of its speed on a slow box
         while the clock it was timed against ran on (the v9.3 law) */
      const wdt = lastFrame ? Math.min(0.5, now - lastFrame) : 0; lastFrame = now;
      const st = getState();
      const live = st === 'play' || st === 'unlock' || st === 'choose';
      if (live || st === 'cine' || st === 'decide') peopleTick(wdt);
      mixBeds(wdt, st);
      lifeTick(wdt);
      /* a Continue into the shrine: World B goes up UNDER the chapter card, or
         the card lifted on the shop at noon for the frames before play boots
         the phase (the v21.0 review) */
      if (!booted && !preplaced && kit) {
        const ppTag = String(kit.getPhase() || '').split(':'), pp = ppTag[0];
        if ((pp === 'trance' && ppTag[1] === 'done') || PHASES.indexOf(pp) >= PHASES.indexOf('arrive')) {   // v21.8: an unplayed trance stays in the shop
          const at = pp === 'trance' ? 'arrive' : pp;
          preplaced = true; placeAtShrine(at); shrineState(at);
          jossHold(true); warmProps(true);                       // (the curtain's warm, still to come, builds them; the boot lets go)
        }
      }
      if (!live) { lastWall = 0; return; }
      if (lastWall) dayClock.t += Math.min(0.5, now - lastWall);
      lastWall = now;
      if (!booted) {
        booted = true;
        applyPhase(kit ? kit.getPhase() : null);
      }
      runTodo(); runSpeak(); runQueue();
      if (st !== 'play') return;          // a splash: time passes, nothing is played
      faceTick(wdt); turnTick(wdt); bowTick(); watchTick(); wearTick(); chantTick(); tranceTick(wdt);
      walkBTick(wdt); bowBTick(wdt);
    }
    function updatePile() {}
    function updateFire() {}
    function updateSlow() {}

    /* ------------------------------------------------------------ a resume
       A Continue lands on the order that is still open: the gift is never
       given twice, the celebration is set as the chant finds it, a chant or
       a trance under way is begun again from its mat — or, once the trance
       is spent, at the shrine (the plan's 4.7). */
    function applyPhase(p) {
      const tag = String(p || '').split(':');
      p = tag[0];
      if (!PHASES.includes(p)) p = 'browse';
      if (p === 'gift') p = 'owner';
      if (p === 'chant') p = 'join';
      if (p === 'trance') p = tag[1] === 'done' ? 'arrive' : 'join';   // v21.8: only a PLAYED trance is spent (awareDone)
      const at = PHASES.indexOf(p);
      if (at >= PHASES.indexOf('owner')) called = true;
      if (at >= PHASES.indexOf('wear')) {
        gifted = true; lpAmulet.visible = false; lpHalo.visible = false;
        if (kit && !kit.has('timkp')) kit.give('timkp');
        /* a Continue with it still in the bag: the bag asks again — at 'join' too (taken off after it was worn), not only 'wear' */
        else if (kit && kit.urge && at < PHASES.indexOf('arrive') && !kit.equipped('timkp')) kit.urge('timkp');
      } else if (kit && kit.has('timkp')) takeTimBack();            // a fresh run: the owner gives it again
      if (at >= PHASES.indexOf('join')) { wornDone = true; snapCelebration(); }
      if (at >= PHASES.indexOf('arrive')) { toShrine(true, p); return; }
      /* v21.9: a Continue in the browse lands on the same count — the looks
         already pressed are spent (their marks gone, their lines not said again) */
      if (p === 'browse' && tag[1]) {
        for (const k of tag[1].split(',')) if (LOOKS[k]) looked.add(k);
        for (const h of hotspots) if (h.lookKey && looked.has(h.lookKey)) h.done = true;
      }
      setPhase(p);
      if (p === 'browse') {
        browseMark();
        browseT0 = dayClock.t;
        after(1.6, () => { if (phase === 'browse' && !heard.has('ow3hello')) queueLine('ow3hello', () => talk(owner, SECS.ow3hello), 1, panAt(OWN.x, OWN.z)); });
      }
      if (p === 'owner') owner.look = 1;
    }

    /* ---------------------------------------------------------- lifecycle */
    function snap() { return { phase }; }
    function restore() {}
    function reset() {
      dropTodo(); speakReset(); lineQ.length = 0; heard.clear();
      booted = false; preplaced = false; dayClock.t = 0; lastWall = 0;
      looked.clear(); called = false; gifted = false; wornDone = false; seated = null; turning = null; facing = null;
      bowing = null; chant = null; trance = null; celebrate = null; curTgt = 0; browseT0 = -1;
      objWas = null; danceTo = 0; danceHalt = false; passerHeld = false; filmG.visible = false; passer.group.position.z = PASS.z;
      inc = null; sitB = null; walkB = null; bowB = null; roarDone = false; rite = false; jossHold(false);
      shrineRun++; shrDark = false;                              // (a warm still running belongs to the run before)
      girlPhone.visible = false;
      if (ownerStool) { ownerStool.rotation.z = 0; ownerStool.position.y = 0; }
      for (const k in mixK) mixK[k] = 0;
      for (const h of hotspots) { h.done = false; h.dwellT = 0; }
      // the LP Tim back on its stand; the candles out; the radio on again (v21.8: it plays while he browses)
      lpAmulet.visible = true; lpHalo.visible = true;
      flames.forEach(f => { f.visible = false; }); flamesOn = false;
      radioOn = true; radioLed.visible = true;
      castHome();
      worldB(false);
      if (kit) {
        kit.root(false); kit.pose('standing', { secs: 0.05 });
        if (kit.pray) kit.pray(false, { secs: 0 });
        if (kit.hands) kit.hands(0, { secs: 0 });
        kit.presence(0);
        kit.daylight(null, 0);
        takeTimBack();
        kit.setPhase('browse');
      }
      phase = 'browse';
    }

    /* a blocker made after build() returned: the engine iterates the array
       blockers() handed it, so the box joins THAT array (the chapter's, while
       the stage is still being built) */
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
      /* the tree stands FIRST: their geometry and every map are the session's shared kit, and the sweep below would
         have freed them out from under every later chapter with trees (v6.15's law; the v21.1 review) */
      for (const g of treeStands) g && g.userData.disposeTrees?.();
      treeStands.length = 0;
      const geos = new Set(), mats = new Set();
      const sweep = (root) => root.traverse(o => {
        if (o.geometry) geos.add(o.geometry);
        if (o.material) for (const m of (Array.isArray(o.material) ? o.material : [o.material])) mats.add(m);
      });
      sweep(world);
      scene.remove(world);
      for (const o of owned) { if (o.parent) o.parent.remove(o); o.dispose?.(); }
      owned.length = 0;
      for (const g of geos) g.dispose();
      for (const m of mats) {
        for (const k of ['map', 'roughnessMap', 'normalMap', 'emissiveMap', 'alphaMap']) m[k]?.dispose?.();
        m.dispose();
      }
      for (const t of madeTex) t?.dispose?.();
      world.clear();
      S = null;
    }

    return (S = {
      world, noteTex, blockers: blockers(),
      ready: () => true,
      pile: { pos: PILE_POS, radius: INTERACT_R, group: pile,
              dist: pileDist, screen: pileScreen, inView: pileInView,
              hits: pointerHitsPile, interact: interactPile,
              glow: () => 0 },
      drum: null, ash: null, embers: null, heroNote: null, smoke: null, flying: null,
      jossTips: [], fireLight: null,
      get noteStorm() { return 1; },
      set noteStorm(v) {},
      SHOP, MALL, SHR, MAT,
      /* THE TRANCE FILM's hooks (tranceFilm, below): the cast, where the
         celebration put them, and the few things a film must do in the shop
         that are not a camera — a man standing up, his stool going over, a
         phone raised, a passer-by stopping at the glass, the clock, and the
         melody nobody else hears stopping dead */
      film: {
        cast: { owner, staff, girl, manW, auntie, youth, passer, monk },
        monkLook(w) { monk.look = w; },
        MAT, OWN_SIT, STAFF_AT, CLOCK, BUDDHA_FACE, ROWS_BACK,
        SHOUT, CLAP: SIT_W, CLAP_AT: 0.0,               // the youth's take; the auntie's, and its frame with her hands in her lap (0.15, the 'palms together' one, is an overhead clap with the wrists crossed — measured, v21.1)
        put(r, x, z, ry) { r.path = null; r.turnTo = null; r.group.position.x = x; r.group.position.z = z; if (ry !== undefined) r.group.rotation.y = ry; },
        take(r, name, ts = 1, fade = 0.3, at) { return r.play(name, ts, fade, false, at); },
        walkRate(r, v) { return v / (WALK_NAT * (r.opts.standH || r.height || 1.7)); },
        stand(r) { r.sitting = false; r.idle = 'Idle_9'; r.play('Idle_9', 1, 0.55); r.yTo = 0; },
        look(r, w) { r.look = w; },
        /* (it pivots on the floor under its seat, so tipped, half of it went under
           the tile: each frame it is lifted until its lowest point rests on the floor) */
        /* (it goes over BEHIND him: +z tipped its top toward −x, in front of him, and swept the seat through his legs
           as he rose and into his path — GF-10) */
        stoolTip(k) { if (!ownerStool) return; ownerStool.rotation.z = -1.45 * k; ownerStool.position.y = 0;
          if (k > 0) { ownerStool.updateWorldMatrix(true, true); const bb = new THREE.Box3().setFromObject(ownerStool, true); ownerStool.position.y = Math.max(0, -bb.min.y); } },
        phone(on) { girlPhone.visible = !!on; },
        passerStop(on) { passerHeld = !!on;
          if (on) { passer.group.position.set(-1.55, 0, 0.78); passer.group.rotation.y = Math.PI; passer.play('Walking', 1, 0.3, false, 0.122); }
          else passer.play('Walking', 1, 0.3); },
        clockTo,
        danceStop(on = true) { danceHalt = !!on; if (on) danceTo = 0; },
        radio(on) { radioSwitch(!!on); },
        shrineCast: { medium, asst, wife, father },
        mediumSeat: () => medium.seatInfo || null,
        roar: roarFx, MED_EYE, TABLE_AT, medPose, medStand, MED_READ, MED_NO, MED_RITE, MED_ANGRY,
        SHR_ROOM: { x0: LX(SB.x0), x1: LX(SB.x1), z0: SB.z0, z1: SB.z1, h: SB.H },   // (v21.8: where the roar film's lens may stand)
        rite(on) { rite = !!on; },
        // the endings (CP8)
        LX, MED_AT, ASST_AT, SHRINE_NIGHT, entShutter: entShutterK, bus: busK, cup: cupProp, tim: timHeld,
        DECIDE_AT: { x: TABLE_AT.x, z: TABLE_AT.z + 0.2 }, DECIDE_PITCH: -0.3,   // where afterRoar frames the decision (the roar film ends on it)
        GIRL_AT,
        gust(k) { shrLife.gust = THREE.MathUtils.clamp(k, 0, 1); },
        stars: starsK,
        asstLook(w) { asst.look = w; asst.lookAt = null; },
        // the opening film (CP9; v21.2: one pocket, Golden Mile Complex): its light, the bus, the man in the corridor
        FM, FILM_MORN, OWN,
        pockets(on) { filmG.visible = !!on; },
        mallBus(k) { mallBusG.visible = k > 0 && k < 1; mallBusG.position.set(-36 + 72 * THREE.MathUtils.clamp(k, 0, 1), 0, 9.4); mallBusG.rotation.y = Math.PI; },   // (v21.2: 9.4, clear of the coach at the kerb)
        passerTo(x, z, ry) { passerHeld = true; passer.group.position.set(x, 0, z); passer.group.rotation.y = ry; },
        passerFree() { passerHeld = false; passer.group.position.z = PASS.z; passer.group.rotation.y = PASS.dir > 0 ? Math.PI / 2 : -Math.PI / 2; }
      },
      pileVia: { what: 'the mat at the altar (the trance carries him to the shrine)', x: MAT.x, z: MAT.z },   // walktest: the medium is behind a scene change
      arrivals: [{ what: "the shrine's arrival (the trance film puts him at its door)", x: ARRIVE.x, z: ARRIVE.z }],   // walktest floods the shrine from here
      get phase() { return phase; },
      setPhase, applyPhase, after, dayClock, sayLine,
      info: () => ({ phase, t: +dayClock.t.toFixed(2), queued: lineQ.length, heard: [...heard],
                     until: +speak.until.toFixed(2), pending: speak.pending ? speak.pending.name : null,
                     looked: [...looked], called, gifted, worn: wornNow(), seated, celebrate,
                     trance: trance ? { t: +trance.t.toFixed(1), tgt: curTgt, ev: trance.ev, done: trance.done } : null,
                     rigsReady: rigs.every(r => r.ready),
                     owner: { x: +owner.group.position.x.toFixed(2), z: +owner.group.position.z.toFixed(2), cur: owner.cur, sitting: !!owner.sitting },
                     staff: { x: +staff.group.position.x.toFixed(2), z: +staff.group.position.z.toFixed(2), cur: staff.cur },
                     flames: flames.map(f => f.visible), radio: radioOn, timOnStand: lpAmulet.visible,
                     beds: DATA.ambience.beds.map(b => b[0] + ':' + (+b[1]).toFixed(2)).join(' ') }),
      hotspots,
      updateNotes, updatePile, updateFire, updateSlow,
      snap, restore, reset, dispose
    });
  }

  /* ============================================================ THE FILM
     Context only (Chad: "The opening film should not already have him
     trancing. It should only set the stage and context for what is about to
     happen"). Three shots, two of his lines, no trance (v21.2 — Chad: "it is
     buddha day, meaning uposatha day, not actual vesak day. There is no need
     to start the intro cutscene at the chinese buddhist temple. Start at the
     outside of the mall complex instead ... Remove the voiceline that says
     'by then i learnt to hide...'". The temple gate at dawn is gone, and so
     are "It was Buddha Day." — the next line says Buddha Day itself — and
     "By then, I had learnt to hide..."):
       1 · 0–14.1   GOLDEN MILE COMPLEX across Beach Road in the morning:
                    his eyes up its stepped face to where the terraces meet
                    the sky ("Back home, the closest thing to Thailand was
                    Golden Mile Complex." — v21.7), then down onto its name
                    and its shops, a coach at the kerb, a bus going by
                    ("There was an amulet shop I often visited. The owner
                    knew me well.")
       2 · 14.1–23.4 its corridor, World A's own: he walks it to the shop's
                    glass ("Every Buddha Day, he held a small chanting...")
       3 · 23.4–32.4 inside, on the bell: the owner looks up and nods ("I only
                    meant to stay for the chanting..." — v21.7, Chad's words),
                    and in the line's pause the lens finds the altar at the
                    back ("...but something else happened..."). Black, and
                    the card.
     (v21.7: the two new lines moved everything after the first by 3.5 s and
     held the last shot 1.5 s longer — each beat the same distance from the
     line it belongs to; the film is 32.4 s, was 27.4.)
     The pocket is drawn only while its shot runs, its light swapped in by a
     STEP (a passed track re-applies every frame); a skip runs every step in
     order and lands on the shop's own light. */
  function intro(c, s, api) {
    const { step, tr, sfx, sfxFade, fade, yawTo, pitchTo, faceFrom, rawK, smoothK, stage, handsRoot, duck, yaw, pitch } = api;
    const F = stage.film;
    const daylight = (d) => { if (api.kit && api.kit.daylight) api.kit.daylight(d, 0); };
    const M = (x, y, z) => ({ x: F.FM.x + x, y, z: F.FM.z + z });

    step(0, () => { handsRoot.visible = false; daylight(F.FILM_MORN); });
    tr(0, 32.4, (k, t) => F.pockets(t < 14.1), rawK);           // a track: a seek always answers the clock
    /* the chapter's own bed is the mall's murmur: none of it in the street, the corridor's from the moment we are in
       it, and down with the picture at the end */
    tr(0, 32.4, (k, t) => duck('mallamb', t < 14.1 ? 0 : t < 15.1 ? t - 14.1 : t < 30.6 ? 1 : Math.max(0, 1 - (t - 30.6) / 1.6)), rawK);
    fade(0, 0, 1, 1);
    sfx(0.2, 'e3film3', 0.8);

    /* 1 · GOLDEN MILE COMPLEX (0 – 14.1): he stands across Beach Road from the end of the slab, looking up its
       stepped face to where the last terraces meet the sky (the end wall's steps against it, the profile the building
       is known by); his eyes come down it onto the name over the podium and the Thai shops under it, and he takes a
       few steps toward it as a bus goes by between */
    /* (where the sign lands was COMPUTED for both screens before it was photographed — dbg-gmcframe: at the end its
       board spans NDC x −0.82…0.83 on a phone, inside the frame, and the opening keeps the slab in the top third of
       the picture rather than under half a frame of sky. v21.3: both looks come down with the podium) */
    const E0 = M(36.5, 1.66, 21.5), E1 = M(31.0, 1.66, 18.6);
    const L0 = M(22.5, 29, -14), L1 = M(16.0, 5.5, 0);
    tr(0, 14.1, (k, t) => {
      const kp = sm(cl01((t - 0.4) / 13.1)), kl = sm(cl01((t - 7.1) / 5.4));
      const x = E0.x + (E1.x - E0.x) * kp, z = E0.z + (E1.z - E0.z) * kp, y = 1.66;
      const tx = L0.x + (L1.x - L0.x) * kl, ty = L0.y + (L1.y - L0.y) * kl, tz = L0.z + (L1.z - L0.z) * kl;
      yaw.position.set(x, y, z);
      yaw.rotation.y = faceFrom(x, z, tx, tz);
      pitch.rotation.x = Math.atan2(ty - y, Math.hypot(tx - x, tz - z));
    }, rawK);
    /* a green bus in the near lane, between him and the mall: across the middle of the frame at ~12.9, once his eyes
       have come down far enough to hold all of it */
    tr(0, 14.1, (k, t) => F.mallBus((t - 8.1) / 6.0), rawK);
    sfx(10.9, 'buspass', 0.55);
    fade(0.4, 1.8, 1, 0);
    sfx(0.3, 'estatemorn', 0.9);                      // the morning street: birds, the road
    /* v21.7: his first words are over the building itself, as the picture comes up (Chad picked the line); the shop's
       line follows half a second after it, and the look down, the bus and the fade keep their distance from it */
    sfx(1.0, 'z3pro0');                               // 4.24 → 5.24
    sfx(5.7, 'z3pro3');                               // 4.0 → 9.7
    fade(13.5, 14.1, 0, 1);
    sfxFade(13.5, 14.1, 'estatemorn');

    /* 2 · THE CORRIDOR (14.1 – 23.4): World A's own, walked from its east end to the shop's glass, a man coming the
       other way on the far side (his walk on the film's clock, so a seek finds him where the shot wants him) */
    step(14.1, () => { daylight(null); });
    /* (a track is applied on every frame after its start with the RAW film
       time, so past the shot's end (23.4 now) this one kept holding him and walking him on — he
       was frozen out of sight for the whole of play) */
    tr(14.1, 23.4, (k, t) => { if (t <= 23.4) F.passerTo(-1.6 + 1.3 * (t - 14.1), 3.95, Math.PI / 2); }, rawK);
    /* (the walk's own track from the cut itself: a passed track holds its last value, so a walk starting later would
       leave the lens at the mall's end for those frames — out at x 300 with its pocket already put away) */
    /* (it ends in the doorway's middle, close to the glass: at (0.62, 1.12) it stood on the door's right mullion's
       line and the held picture was cut in half by the bar 1.1 m off — VF-2/GF-8. From here both mullions are ~34°
       off the middle, outside a phone's frame. And it comes in STRAIGHT, through the middle of the right leaf: the
       last stretch used to run on the line of the door's MIDDLE bar (x 0), so for the walk's last second that bar
       stood in the centre of a phone's frame, half a metre off (the v21.1 photographs). Square on, the two bars
       slide out to either side as he comes in. 1.77 m/s keeps the hold where it was, 22.2 → 23.0) */
    const W = walkRoute(api, [{ x: 12.4, z: 2.05 }, { x: 1.2, z: 2.05 }, { x: 0.31, z: 1.55 }, { x: 0.31, z: 0.45 }], 14.1, 1.77);
    pitchTo(14.1, 14.5, 0.03, 0.03, rawK);
    const inLook = faceFrom(0.31, 0.45, 0.05, -6.69);   // through the glass, onto the altar at the back
    yawTo(W.end - 0.3, W.end + 0.5, W.head, inLook, smoothK);
    pitchTo(W.end - 0.5, W.end + 0.4, 0.03, -0.05, smoothK);
    fade(14.2, 15.0, 1, 0);
    sfx(16.1, 'z3pro4');                              // 6.84 → 22.94
    fade(23.0, 23.4, 0, 1);

    // 3 · INSIDE (23.4 – 32.4): the bell over the door, two steps in, the owner looking up from his counter
    step(23.4, () => { F.passerFree(); });
    sfx(23.35, 'shopbell', 0.8);
    const IN0 = { x: 0.1, y: 1.62, z: -0.25 }, IN1 = { x: -0.18, y: 1.62, z: -0.95 };
    const toOwn = faceFrom(IN1.x, IN1.z, F.OWN.x, F.OWN.z), toAlt = faceFrom(IN1.x, IN1.z, 0.05, -6.69);
    tr(23.4, 25.1, (k) => { yaw.position.set(IN0.x + (IN1.x - IN0.x) * k, IN0.y + 0.012 * Math.sin(k * Math.PI * 2), IN0.z + (IN1.z - IN0.z) * k); }, smoothK);
    sfx(23.75, 'step', 0.7); sfx(24.35, 'step', 0.7);
    yawTo(23.4, 25.1, toOwn + 0.2, toOwn, smoothK);
    pitchTo(23.4, 25.1, -0.02, -0.06, smoothK);
    fade(23.45, 24.1, 1, 0);
    step(23.9, () => { const O = F.cast.owner; O.look = 1; O.lookAt = null; });
    step(24.7, () => { F.cast.owner.nod = 1.6; });    // he knows him: a nod, no word (his hello is play's first line)
    /* v21.7: the film's last line, Chad's own words. Its first half is said on the owner; in its pause (the take's
       1.08 s between "chanting..." at 27.52 and "but" at 28.60) the lens turns to the altar at the back, where it will
       happen, and arrives on "...something else happened..."; a beat on the altar in silence, then the black */
    sfx(25.1, 'z3pro5');                              // 4.80 → 29.90
    yawTo(27.5, 29.7, toOwn, toAlt, smoothK);
    pitchTo(27.5, 29.7, -0.06, 0.02, smoothK);
    fade(30.6, 32.2, 0, 1);
    sfxFade(30.4, 32.2, 'e3film3');
    tr(32.2, 32.4, () => {}, rawK);                   // the film's length (its last steps run inside it)
    step(32.3, () => { handsRoot.visible = true; });
    c.keepFade = true;
    c.endFade = 1;
  }

  /* ============================================================ THE TRANCE
     A film FROM PLAY (the twenty-sixth seam, kit.film), from his eyes: the
     dance carries on with the melody nobody else hears; the owner and the
     staff man come at him and cannot hold him; the room watches, the girl
     films, the auntie prays fast, a passer-by stops at the glass; fifteen
     minutes go by on the wall clock in three jumps; the music STOPS, he goes
     down on his knees, and the faces come over him — "Tonight, you go and
     see a medium." It ends on a black that stays: its onDone takes him to
     the shrine that night (toShrine). Every move is a TRACK of the film's own
     clock (a seek or a skip lands on the same picture — v5.30), pushed in
     time order per person so the latest one wins. */
  function tranceFilm(c, s, api) {
    const { tr, step, sfx, fade, camTo, lens, smoothK, rawK, mixAngle, faceFrom, stage, camera, yaw, pitch, handsRoot } = api;
    const F = stage.film, C = F.cast, B = F.BUDDHA_FACE;
    const P = { x: s.yawPos.x, z: s.yawPos.z };
    const H0 = api.handsFrom(), hk = H0.k > 0 ? H0.k : 1, ht = H0.t || 0;
    const TAU = Math.PI * 2;
    const mFace = (ax, az, bx, bz) => Math.atan2(bx - ax, bz - az);   // a MODEL at a facing b (faceFrom + PI, v5.0)
    const at = (dx, dz) => ({ x: P.x + dx, z: P.z + dz });
    const camYaw = (q) => faceFrom(P.x, P.z, q.x, q.z);
    const up = (a, ref) => { while (a < ref) a += TAU; while (a > ref + TAU) a -= TAU; return a; };   // turning LEFT from ref
    const near = (a, ref) => { while (a < ref - Math.PI) a += TAU; while (a > ref + Math.PI) a -= TAU; return a; };
    // a walk along straight legs at the pace the ground asks, then a turn to `face`
    const walk = (r, pts, t0, t1, face) => {
      /* v21.1: a move UNDER THE BLACK is a put, never a walk — the two 0.05 s
         "walks" at the time-lapse cut ran Walking at ×18.6 and ×4.4, three's
         fadeOut put that take back at full weight, and the owner came out of
         the black with his legs churning and whipping 145° round on the spot
         (the v21.1 review: FK, and a simulation of the film) */
      if (t1 - t0 < 0.2) {
        const q = pts[pts.length - 1], m = pts[pts.length - 2];
        const f = face !== undefined ? face : mFace(m.x, m.z, q.x, q.z);
        step(t0, () => { F.take(r, 'Idle_9', 1, 0); F.look(r, 1); });
        tr(t0, t1, () => F.put(r, q.x, q.z, f), rawK);
        return;
      }
      let L = 0; for (let i = 1; i < pts.length; i++) L += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].z - pts[i - 1].z);
      const v = L / Math.max(0.1, t1 - t0);
      step(t0, () => { F.take(r, 'Walking', F.walkRate(r, v), 0.25); F.look(r, 0); });
      tr(t0, t1, (k) => {
        let d = k * L;
        for (let i = 1; i < pts.length; i++) {
          const a = pts[i - 1], b = pts[i], l = Math.hypot(b.x - a.x, b.z - a.z);
          if (d <= l || i === pts.length - 1) { const u = Math.min(1, d / Math.max(1e-4, l)); F.put(r, a.x + (b.x - a.x) * u, a.z + (b.z - a.z) * u, mFace(a.x, a.z, b.x, b.z)); return; }
          d -= l;
        }
      }, rawK);
      const n = pts.length, dir = mFace(pts[n - 2].x, pts[n - 2].z, pts[n - 1].x, pts[n - 1].z);
      step(t1, () => { F.take(r, 'Idle_9', 1, 0.35); F.look(r, 1); });
      if (face !== undefined) tr(t1, t1 + 0.55, (k) => { r.group.rotation.y = mixAngle(dir, face, k); }, smoothK);
    };

    /* WHERE EVERYONE GOES (P is where he stood when the film took over).
       Every spot is a metre or more off the lens: the owner is a scan whose
       face will not stand a close-up (photographed at 0.75 m), and on a
       phone a man a metre away already fills the frame. Every route below
       keeps clear of the two still kneeling and was walked in the photos. */
    /* (the staff man at his right shoulder, not behind him: from behind, the man saying "Hold him! Hold him!" and "I
       cannot!" was never once on screen, and the struggle did not read — VT-4. The lens turns to him for his line) */
    const A_OWN = at(0.85, -0.6), A_STAFF = at(0.8, 0.15);             // hands on him: the owner in front, the staff man at his right
    const B_OWN = at(1.75, 0.05), B_STAFF = at(-1.35, 0.95);           // stepped back
    const C_OWN = { x: 2.05, z: -4.35 + F.ROWS_BACK }, C_STAFF = { x: -2.25, z: -3.35 + F.ROWS_BACK };   // the minutes go by (v21.8: the room further back, with the rows)
    /* (the girl a little further off: at 0.84 m her face filled a phone's frame and the scan's mouth did not stand
       it — VT-3) */
    const E_OWN = at(-0.1, -1.35), E_STAFF = at(0.95, 0.45), E_GIRL = at(-0.85, -0.65);   // over him: the owner before him, the girl at his left
    const AUNTIE = { x: -2.45, z: -4.85 }, GIRL0 = F.GIRL_AT;
    const YOUTH = { x: 2.42, z: -4.85 };
    const SHOUT = F.SHOUT, CLAP = F.CLAP;

    /* the room as the film finds it: the girl turned round to him on her
       knees, hands together (play's rise turned her; a seek lands the same) */
    step(0, () => {
      F.put(C.girl, GIRL0.x, GIRL0.z, mFace(GIRL0.x, GIRL0.z, P.x, P.z));
      F.take(C.girl, 'pray', 1, 0.2); F.look(C.girl, 0.8);
    });

    /* ---------------- A · 0–10.2 · THE DANCE, AND THE HANDS THAT CANNOT HOLD HIM */
    const yA = near(camYaw(A_OWN) + 0.12, s.yawRot);      // he sits a little right of the middle
    const pA = Math.atan2(1.3 - 1.62, Math.hypot(A_OWN.x - P.x, A_OWN.z - P.z));   // on his chest, the face high in the frame
    tr(0, 4.2, (k) => { yaw.rotation.y = mixAngle(s.yawRot, yA, k); }, smoothK);
    tr(0, 4.2, (k) => { pitch.rotation.x = s.pitchX + (pA - s.pitchX) * k; }, smoothK);
    // the owner jumps up — his stool goes over — and comes at him; the staff man from behind
    step(1.0, () => { F.stand(C.owner); F.look(C.owner, 1); });
    tr(1.05, 1.55, (k) => F.stoolTip(k), smoothK);
    sfx(1.15, 'stoolfall', 0.8);
    sfx(1.4, 'ow3eh');                                   // 2.93 → 4.33
    /* (v21.8: round the man in white on the front row, now 0.7 m further back, by the gap between the rows) */
    walk(C.owner, [F.OWN_SIT, { x: 1.25, z: -4.3 }, { x: 0.5, z: -4.25 }, A_OWN], 2.2, 5.0, mFace(A_OWN.x, A_OWN.z, P.x, P.z));
    walk(C.staff, [F.STAFF_AT, A_STAFF], 3.3, 4.6, mFace(A_STAFF.x, A_STAFF.z, P.x, P.z));
    // they take hold of him: hands out, quick, the take at a struggle's pace
    step(5.0, () => { F.take(C.owner, 'Talk_with_Hands_Open', 1.55, 0.25); F.take(C.staff, 'Talk_with_Hands_Open', 1.7, 0.25); });
    sfx(5.0, 'rushgrab', 0.85);
    // the eyes go to the man at his arm for "Hold him!", and back to the owner for "I cannot..."
    const yS = near(camYaw(A_STAFF), yA), pS = Math.atan2(1.42 - 1.62, Math.hypot(A_STAFF.x - P.x, A_STAFF.z - P.z));
    tr(5.05, 5.6, (k) => { yaw.rotation.y = yA + (yS - yA) * k; pitch.rotation.x = pA + (pS - pA) * k; }, smoothK);
    tr(7.25, 7.95, (k) => { yaw.rotation.y = yS + (yA - yS) * k; pitch.rotation.x = pS + (pA - pS) * k; }, smoothK);
    sfx(5.3, 'sm3hold');                                 // 2.38 → 7.68
    sfx(8.0, 'sm3cannot');                               // 2.32 → 10.32
    sfx(8.6, 'crowdgasp', 0.55);
    // the young man on the stool: his hands go up to his head, and stay
    step(8.6, () => F.look(C.youth, 1));
    tr(8.6, 9.6, (k) => F.take(C.youth, SHOUT, 1, 0, 0.25 * k), rawK);   // his own take, run to the frame his hands are up (0.25, measured)
    const youthR0 = C.youth.group.rotation.y, auntieR0 = C.auntie.group.rotation.y;
    tr(8.6, 9.8, (k) => { C.youth.group.rotation.y = mixAngle(youthR0, mFace(YOUTH.x, YOUTH.z, P.x, P.z), k); }, smoothK);
    // they let go and step back
    walk(C.owner, [A_OWN, B_OWN], 9.7, 11.0, mFace(B_OWN.x, B_OWN.z, P.x, P.z));
    walk(C.staff, [A_STAFF, B_STAFF], 9.8, 11.0, mFace(B_STAFF.x, B_STAFF.z, P.x, P.z));

    /* ---------------- B · 10.2–19.4 · THE ROOM WATCHES (the turn goes left) */
    const yB0 = yA, yB1 = near(camYaw(GIRL0), yB0), yB2 = up(camYaw(AUNTIE), yB1), yB3 = up(camYaw({ x: -0.75, z: 0.6 }), yB2);
    const pB1 = Math.atan2(1.05 - 1.62, Math.hypot(GIRL0.x - P.x, GIRL0.z - P.z));
    tr(10.2, 12.8, (k) => { yaw.rotation.y = yB0 + (yB1 - yB0) * k; }, smoothK);
    tr(12.8, 15.8, (k) => { yaw.rotation.y = yB1 + (yB2 - yB1) * k; }, smoothK);
    tr(15.8, 19.0, (k) => { yaw.rotation.y = yB2 + (yB3 - yB2) * k; }, smoothK);
    tr(10.2, 12.8, (k) => { pitch.rotation.x = pA + (pB1 - pA) * k; }, smoothK);    // down to the girl on her knees, her phone up
    tr(12.8, 15.8, (k) => { pitch.rotation.x = pB1 + (-0.16 - pB1) * k; }, smoothK);
    tr(15.8, 19.0, (k) => { pitch.rotation.x = -0.16 + 0.16 * k; }, smoothK);
    sfx(11.0, 'st3uncle');                               // 2.35 → 13.35
    step(11.4, () => F.phone(true));
    sfx(12.5, 'phonerec', 0.6);
    // the auntie turns to him and prays fast, palms beating together
    tr(12.6, 13.8, (k) => { C.auntie.group.rotation.y = mixAngle(auntieR0, mFace(AUNTIE.x, AUNTIE.z, P.x, P.z), k); }, smoothK);
    step(13.6, () => { F.look(C.auntie, 1); F.take(C.auntie, CLAP, 2.1, 0.3); });
    /* v21.8 (Chad: "The girl should not say 'amituofo'. change it to 'sadhu, sadhu, sadhu!'"): the line the camera
       reaches her on is the Thai Buddhist's exclamation of approval and awe, said by the auntie as she prays */
    sfx(14.0, 'cu3sadhu');                               // 3.01 → 17.01
    step(17.8, () => F.take(C.auntie, CLAP, 1, 0.35, F.CLAP_AT));   // and her hands come down to her lap, and stay
    step(16.4, () => F.passerStop(true));

    /* ---------------- C · 19.4–29.8 · FIFTEEN MINUTES, IN THREE JUMPS
       The clock is far and small over the door, so the lens closes on it
       (the sixteenth seam; cineEnd hands the lens back however it ends) */
    const CLK = F.CLOCK, yC = near(camYaw(CLK), yB3), pC = Math.atan2(CLK.y - 1.62, Math.hypot(CLK.x - P.x, CLK.z - P.z));
    const ZOOM = 38;
    tr(19.0, 20.4, (k) => { yaw.rotation.y = yB3 + (yC - yB3) * k; }, smoothK);
    tr(19.0, 20.4, (k) => { pitch.rotation.x = 0 + (pC - 0) * k; }, smoothK);
    lens(19.4, 21.4, 72, ZOOM, smoothK);
    tr(19.4, 29.6, (k) => F.clockTo(12, 10 + 15 * k), rawK);
    sfx(19.6, 'timelapse', 0.8);
    // cut one: the room from the altar's side — the owner back by his counter, the staff at the glass
    fade(21.95, 22.1, 0, 1); fade(22.25, 22.4, 1, 0);
    lens(22.1, 22.12, ZOOM, 72, rawK);
    walk(C.owner, [B_OWN, C_OWN], 22.1, 22.15, mFace(C_OWN.x, C_OWN.z, P.x, P.z));
    walk(C.staff, [B_STAFF, C_STAFF], 22.1, 22.15, mFace(C_STAFF.x, C_STAFF.z, P.x, P.z));
    const yC1 = near(camYaw(C_OWN), yC);
    tr(22.1, 22.12, () => { yaw.rotation.y = yC1 - 0.25; pitch.rotation.x = 0.0; }, rawK);
    tr(22.12, 26.0, (k) => { yaw.rotation.y = yC1 - 0.25 + 0.3 * k; }, rawK);
    sfx(22.6, 'timelapse', 0.55);
    sfx(23.0, 'ow3let');                                 // 2.43 → 25.43
    step(23.0, () => F.take(C.owner, 'Talk_with_Hands_Open', 0.9, 0.3));
    step(25.45, () => F.take(C.owner, 'Idle_9', 1, 0.4));
    // cut two: the clock again, ten minutes on
    fade(25.85, 26.0, 0, 1); fade(26.15, 26.3, 1, 0);
    lens(26.0, 26.02, 72, ZOOM + 4, rawK);
    tr(26.0, 26.02, () => { yaw.rotation.y = yC + 0.06; pitch.rotation.x = pC; }, rawK);
    tr(26.02, 29.6, (k) => { yaw.rotation.y = yC + 0.06 - 0.1 * k; }, rawK);
    sfx(26.2, 'timelapse', 0.45);

    /* ---------------- D · 29.6–35.6 · IT STOPS. HE GOES DOWN. */
    fade(29.45, 29.6, 0, 1); fade(29.75, 29.9, 1, 0);
    lens(29.6, 29.62, ZOOM + 4, 72, rawK);
    // under that black: the girl kneels at his side, the others turn to him
    step(29.6, () => {
      F.put(C.girl, E_GIRL.x, E_GIRL.z, mFace(E_GIRL.x, E_GIRL.z, P.x, P.z));
      F.take(C.girl, 'kneel', 1, 0.3);
      C.auntie.group.rotation.y = mFace(AUNTIE.x, AUNTIE.z, P.x, P.z);
      C.youth.group.rotation.y = mFace(YOUTH.x, YOUTH.z, P.x, P.z);
      C.manW.group.rotation.y = mFace(C.manW.group.position.x, C.manW.group.position.z, P.x, P.z);
      F.look(C.girl, 1); F.look(C.manW, 1); F.look(C.youth, 1); F.look(C.auntie, 1);
      F.monkLook(0.6);
    });
    tr(29.6, 29.62, () => F.take(C.youth, SHOUT, 1, 0, 0.0), rawK);   // his hands down again (a track, pushed after his raise, so it wins)
    const yD = near(camYaw(B), yC);
    tr(29.6, 29.62, () => { yaw.rotation.y = yD; pitch.rotation.x = 0.02; }, rawK);   // (0.12 put the statue behind the right hand: lower, it stands over them — VT-2)
    step(30.5, () => { F.danceStop(true); F.phone(false); });
    tr(30.9, 31.35, () => {}, rawK);
    camTo(30.9, 31.35, { x: P.x, y: 1.62, z: P.z }, { x: P.x, y: 0.98, z: P.z }, (k) => k * k);
    tr(30.9, 31.6, (k) => { pitch.rotation.x = 0.02 - 0.4 * k; }, smoothK);
    sfx(31.3, 'kneethud', 0.9);
    sfx(31.32, 'matkneel3', 0.6);
    sfx(31.9, 'z3breath');                               // 3.0 → 34.9
    // the people come in while he breathes (the owner round the far side of the two still kneeling)
    walk(C.owner, [C_OWN, { x: 0.7, z: -3.6 }, { x: -0.1, z: -4.35 }, E_OWN], 31.6, 34.6, mFace(E_OWN.x, E_OWN.z, P.x, P.z));
    walk(C.staff, [C_STAFF, E_STAFF], 31.9, 34.9, mFace(E_STAFF.x, E_STAFF.z, P.x, P.z));

    /* ---------------- E · 34.9–60 · THE FACES OVER HIM */
    const dO = Math.hypot(E_OWN.x - P.x, E_OWN.z - P.z);
    const yE = near(camYaw(E_OWN), yD), pE = Math.atan2(1.55 - 0.98, dO);
    tr(34.9, 36.2, (k) => { yaw.rotation.y = yD + (yE - yD) * k; }, smoothK);
    tr(34.9, 36.2, (k) => { pitch.rotation.x = -0.38 + (pE + 0.38) * k; }, smoothK);
    sfx(36.2, 'ow3know');                                // 2.04 → 38.24
    step(36.2, () => F.take(C.owner, 'Talk_with_Hands_Open', 0.85, 0.3));
    step(38.3, () => F.take(C.owner, 'Idle_9', 1, 0.45));
    sfx(38.7, 'z3knew');                                 // 5.64 → 44.34
    /* (to the mat by his own knees: at −0.5 the look stopped on the standing owner's trousers and shoes for four
       seconds under "I knew... I knew everything" — VT-7) */
    tr(39.4, 41.0, (k) => { pitch.rotation.x = pE + (-1.0 - pE) * k; }, smoothK);   // his eyes go down to the mat
    tr(42.6, 44.2, (k) => { pitch.rotation.x = -1.0 + (pE + 1.0) * k; }, smoothK);  // and back up to him
    const yG = near(camYaw(E_GIRL), yE), yN = near(camYaw(AUNTIE), yG);
    const pG = Math.atan2(1.12 - 0.98, Math.hypot(E_GIRL.x - P.x, E_GIRL.z - P.z)), pN = Math.atan2(1.1 - 0.98, Math.hypot(AUNTIE.x - P.x, AUNTIE.z - P.z));
    tr(44.5, 45.6, (k) => { yaw.rotation.y = yE + (yG - yE) * k; pitch.rotation.x = pE + (pG - pE) * k; }, smoothK);
    sfx(44.8, 'st3trance');                              // 2.59 → 47.39
    step(44.8, () => { C.girl.nod = 2.6; });
    tr(47.5, 48.7, (k) => { yaw.rotation.y = yG + (yN - yG) * k; pitch.rotation.x = pG + (pN - pG) * k; }, smoothK);
    sfx(47.9, 'cu3unclean');                             // 4.26 → 52.16
    step(47.9, () => { C.auntie.nod = 4.2; });
    tr(51.5, 52.7, (k) => { yaw.rotation.y = yN + (near(yE, yN) - yN) * k; pitch.rotation.x = pN + (pE - pN) * k; }, smoothK);   // (it landed 0.8 s into his line, him half off the frame — VT-13)
    sfx(52.6, 'ow3medium');                              // 5.56 → 58.16
    step(52.6, () => F.take(C.owner, 'Talk_with_Hands_Open', 0.85, 0.3));
    // a slow push toward him while he says it
    /* (a gentler push: the owner is a stand-in scan whose face shows its facets up close — VT-1, until Chad's model) */
    camTo(53.4, 58.4, { x: P.x, y: 0.98, z: P.z }, { x: P.x + (E_OWN.x - P.x) * 0.06, y: 0.98, z: P.z + (E_OWN.z - P.z) * 0.06 }, smoothK);
    fade(58.4, 60.0, 0, 1);

    /* ---------------- the body, laid on top of every camera track above
       (pushed LAST, so it rides whatever the latest base track wrote): the
       dance's sway and nod, the shake while they hold him, the roll of the
       body, and the hands in the dance until the stop */
    const alive = (t) => t < 30.5 ? 1 : Math.max(0, 1 - (t - 30.5) / 0.25);
    const grip = (t) => (t > 5.0 && t < 9.7) ? Math.sin(Math.PI * (t - 5.0) / 4.7) : 0;
    /* (eased in over the film's first half second, the roll from where play's dance left it: added at full from
       t 0 on top of play's own sway, the first frame jolted 4.5° of roll — the v21.1 review) */
    tr(0, 31.0, (k, t) => {
      const a = alive(t) * (camera.fov / 72), g = grip(t), e = sm(cl01(t / 0.5));   // a closed lens magnifies a sway: it is scaled with it
      yaw.rotation.y += e * (a * (0.09 * Math.sin(t * 1.25) + 0.035 * Math.sin(t * 2.9 + 0.7)) + g * 0.035 * Math.sin(t * 17.0));
      pitch.rotation.x += e * (a * 0.05 * Math.sin(t * 1.7 + 1.1) + g * 0.02 * Math.sin(t * 13.0 + 1));
      camera.rotation.z = (H0.roll || 0) * (1 - e) + e * (a * (0.055 * Math.sin(t * 1.25 + 0.4)) + g * 0.03 * Math.sin(t * 11.0));
    }, rawK);
    /* the breath: two of them, ending on a zero crossing (a track is re-applied with the RAW time on every frame
       after it starts, so this kept bobbing the lens to the film's end at 60 s — the v21.0 law) */
    tr(31.9, 35.0, (k, t) => { pitch.rotation.x += 0.025 * Math.sin(Math.min(t - 31.9, 40 / 11) * Math.PI * 1.1); }, rawK);
    /* the hands quicken while they hold him (1 → 2.5 → 1 times their pace): the RATE integrated, a pure function of
       t so a seek lands where a watch does. (t × (1 + 1.5 grip) multiplied the time instead: the gesture lurched
       forward at ×6, ran BACKWARDS at −8.7 and stopped dead at 9.7 — the v21.1 review) */
    const flowAt = (t) => ht + t + 1.5 * (4.7 / Math.PI) * (1 - Math.cos(Math.PI * cl01((t - 5.0) / 4.7)));
    /* and while the room is watched the dance sinks a little: on a phone the raised hands filled the middle two
       thirds of the frame and stood exactly over each beat's subject — the girl filming, the auntie's fast prayer,
       the owner's "let him", the Buddha (VT-2, the v21.1 photographs). Out of the way, the subject over the
       fingertips; at both ends it moves under the black or in a pan */
    const dip = (t) => 0.13 * (sm(cl01((t - 10.4) / 0.9)) - sm(cl01((t - 18.4) / 0.9))) + 0.15 * (t >= 22.1 && t < 25.85 ? 1 : 0)
                     + 0.11 * sm(cl01((t - 29.6) / 0.5))
                     + 0.12 * (sm(cl01((t - 5.0) / 0.35)) - sm(cl01((t - 7.4) / 0.6)));   // pulled down by the hands on his arms (VT-4)
    tr(0, 30.6, (k, t) => {
      api.handsPose(hk, flowAt(Math.min(t, 30.6)));
      const d = dip(Math.min(t, 30.6)); if (d > 0) { api.armR.position.y -= d; const L = api.prayerArm(); if (L) L.position.y -= d; }
    }, rawK);
    tr(30.6, 31.3, (k, t) => {
      const u = Math.min(1, (t - 30.6) / 0.7), d = dip(30.6) + 0.16 * u;
      api.handsPose(hk * (1 - u), flowAt(30.6));
      api.armR.position.y -= d; const L = api.prayerArm(); if (L) L.position.y -= d;
    }, rawK);
    step(31.35, () => { handsRoot.visible = false; });
    /* the hands back for play, pushed AFTER the hide above: a skip runs every
       step it has not yet run in the order they were PUSHED, not in time
       order, so a show pushed before the 31.35 hide ran first and the hide
       last — and a skipped trance film left the hands, and the joss sticks
       held in the clasp, invisible through the whole shrine (the v21.1
       review) */
    step(59.9, () => { handsRoot.visible = true; api.armR.visible = true; camera.rotation.z = 0; });
    c.keepFade = true;
    c.endFade = 1;
  }

  /* ============================================================ THE ROAR
     The reading has landed ("It is a ghost possessing you") and on that word
     the nature of the thing changes (the case file). From his eyes: a gold
     flash, the lens lunges at the medium, the room shakes, and a ROAR comes
     out of him that is not his voice. v21.8 (Chad: "When the player roars, and
     the hanuman appears, i want the camera to pan to show the entire panning
     perspective of the hanuman looking like it lunged out towards the medium,
     with special glowing effects, and some sting or sound effects to increase
     the dramatic effect of that moment. This moment needs to feel cinematic
     and powerful and impressive. The medium upon seeing it, should appear
     shocked and taken aback, before he stands up to respond with his deity
     tongue."): CUT, and we are out of him — Chad's Hanuman in gold light
     standing where the young man stood, coming up out of the flash on a swell,
     a halo breathing behind it and embers coming off it; and IT GOES FOR HIM:
     it flies the line to the medium's face, rising, pitched into the lunge, a
     streak of gold behind it, while the camera swings with it from its side
     round to over its shoulder — the whole of the flight in the frame, ending
     on the medium's face beyond it — on a rush. It reaches him: a white-gold
     flash, a ring going out of him, the hit and the crash, the room shaken,
     the lanterns swinging. CUT to him: thrown back in his chair, his hands up,
     his eyes on it, a gasp, the gold going out of the air between them — and
     only then does he stand, with the sword and the bell. From his eyes again:
     the medium on his feet, the whispered tongue, the bells, the assistant
     pulling the room back, the drum. It ends on his eyes, and the decision
     opens over the rites (afterRoar). Every move a track; every light unlit
     and additive (roarFx), nothing a real light. */
  function roarFilm(c, s, api) {
    const { tr, step, sfx, sfxFade, camTo, smoothK, rawK, mixAngle, stage, camera, yaw, pitch, handsRoot } = api;
    const F = stage.film, R = F.roar, E = F.MED_EYE, M = F.shrineCast.medium, RM = F.SHR_ROOM;
    const P = { x: s.yawPos.x, z: s.yawPos.z };
    const dx = E.x - P.x, dz = E.z - P.z, dl = Math.hypot(dx, dz), ux = dx / dl, uz = dz / dl;
    const nx = uz, nz = -ux;                      // across the line, to its −x side: the open floor before the waiting stools
    const yP = Math.atan2(-dx, -dz), pP = Math.atan2(E.y - 1.62, dl);
    const at = (a, b, y) => ({ x: P.x + ux * a + nx * b, y, z: P.z + uz * a + nz * b });   // a metres along the line, b across it
    const mix = (p, q, k) => ({ x: p.x + (q.x - p.x) * k, y: p.y + (q.y - p.y) * k, z: p.z + (q.z - p.z) * k });
    const put = (cp, tg) => {
      yaw.position.set(cp.x, cp.y, cp.z);
      const ex = tg.x - cp.x, ez = tg.z - cp.z;
      yaw.rotation.y = Math.atan2(-ex, -ez); pitch.rotation.x = Math.atan2(tg.y - cp.y, Math.hypot(ex, ez));
    };
    /* v21.8 · FRAMED FOR THE SCREEN IT PLAYS ON. Photographed, the first lunge (an orbit 1.2–1.6 m off the figure)
       showed a phone a gold torso with no head and no medium: a portrait phone sees a third of a desktop's width at
       the same 72° height. So a shot names what must be in it — the figure's own box where it stands, raised arm and
       tail, and the medium's hat and chair — and the lens stands as far back along its line of sight as THIS screen
       needs: the letterbox's 22 % off the height, the aspect's own width, a margin each way */
    const VT = Math.tan(camera.fov * Math.PI / 360), HX = VT * camera.aspect * 0.86, HY = VT * 0.78 * 0.9;
    const fitD = (T, f, pts) => {                 // how far back from T along f every point is in the frame
      const h = Math.hypot(f.x, f.z) || 1, r = { x: -f.z / h, z: f.x / h };      // right = f × up, up = right × f
      const v = { x: -r.z * f.y, y: r.z * f.x - r.x * f.z, z: r.x * f.y };
      let D = 0;
      for (const p of pts) {
        const qx = p.x - T.x, qy = p.y - T.y, qz = p.z - T.z;
        const x = qx * r.x + qz * r.z, y = qx * v.x + qy * v.y + qz * v.z, z = qx * f.x + qy * f.y + qz * f.z;
        D = Math.max(D, Math.abs(x) / HX - z, Math.abs(y) / HY - z);
      }
      return D;
    };
    const cen = (pts) => {
      const lo = { x: Infinity, y: Infinity, z: Infinity }, hi = { x: -Infinity, y: -Infinity, z: -Infinity };
      for (const p of pts) for (const a of ['x', 'y', 'z']) { lo[a] = Math.min(lo[a], p[a]); hi[a] = Math.max(hi[a], p[a]); }
      return { x: (lo.x + hi.x) / 2, y: (lo.y + hi.y) / 2, z: (lo.z + hi.z) / 2 };
    };
    const unit = (x, y, z) => { const l = Math.hypot(x, y, z) || 1; return { x: x / l, y: y / l, z: z / l }; };
    const back = (T, f, d) => ({ x: Math.min(RM.x1 - 0.3, Math.max(RM.x0 + 0.3, T.x - f.x * d)), y: Math.min(RM.h - 0.3, Math.max(0.35, T.y - f.y * d)),
                                 z: Math.min(RM.z1 - 0.3, Math.max(RM.z0 + 0.3, T.z - f.z * d)) });   // (and never through a wall)
    /* how far it flies: its feet to 0.95 m short of his eyes (over his table), so that pitched into the lunge its
       head stops a forearm from his face rather than in it */
    const REACH = Math.max(0.6, dl - 0.95), LIFT = 0.32, TILT = 0.32;
    const F1 = at(REACH, 0, 0);
    const IMPACT = { x: E.x - ux * 0.1, y: E.y - 0.12, z: E.z - uz * 0.1 };   // where it reaches him: his chest
    const gather = (k) => 0.35 * k * k * (3 - 2 * k) + 0.65 * k * k;          // it gathers, then goes
    /* 1 · 0–0.55 · his eyes: the flash, the jolt at the medium, the roar out of him */
    sfx(0.0, 'hanumanroar', 1);
    sfx(0.04, 'goldsting', 0.8);
    tr(0, 0.12, (k) => R.flash(k), rawK);
    tr(0.12, 0.85, (k) => R.flash(1 - k), smoothK);
    tr(0, 0.02, () => { yaw.rotation.y = yP; pitch.rotation.x = pP; }, rawK);
    camTo(0, 0.26, { x: P.x, y: 1.62, z: P.z }, { x: P.x + ux * 0.34, y: 1.7, z: P.z + uz * 0.34 }, smoothK);
    /* the medium as a frame must hold him: his hat's crown, his chair's back, his knees under the table */
    const MED_PTS = [{ x: E.x, y: 2.02, z: E.z }, { x: E.x + ux * 0.42, y: 1.25, z: E.z + uz * 0.42 }, { x: E.x - ux * 0.3, y: 0.55, z: E.z - uz * 0.3 }];
    /* 2 · 0.55–1.4 · CUT, and we are out of him: gold light standing where he stood, coming up out of the flash on a
       swell — the lens low on the line's −x side and before it (55° round toward the medium), looking up at the whole
       of it from as far back as this screen needs, easing in */
    step(0.55, () => { handsRoot.visible = false; api.armR.visible = false; M.look = 1; M.lookAt = { x: P.x, y: 1.85, z: P.z }; });
    sfx(0.5, 'goldswell', 0.9);
    const box0 = R.corners(P, E, 0, 0, 0), T0 = cen(box0);
    const aA = 0.96, tA = 0.17;
    const fA = unit(-(ux * Math.cos(aA) + nx * Math.sin(aA)) * Math.cos(tA), Math.sin(tA), -(uz * Math.cos(aA) + nz * Math.sin(aA)) * Math.cos(tA));
    const DA = fitD(T0, fA, box0);
    tr(0.55, 1.4, (k) => put(back(T0, fA, DA * (1.14 - 0.14 * k)), T0), smoothK);
    tr(0.55, 0.95, (k) => R.hanu(k, P, E, 0, 0, 0), smoothK);
    tr(0.55, 1.0, (k, t) => R.aura(k, t), smoothK);
    /* 3 · 1.4–2.75 · IT GOES FOR HIM, and the lens PANS with it (Chad's word): on the line's −x side, square to it,
       as far back as this screen needs for the whole figure where it reaches him AND the medium (and, from there,
       the whole figure where it stood), turning from where it stood to where it strikes as it goes and pushing in a
       little; and two gold echoes of it trail down the line it flies, where it was a moment before. (Until v21.8 an
       orbit 1.2–1.6 m off the figure, which showed a phone a gold torso with no head and no medium — photographed.) */
    sfx(1.3, 'hanulunge', 1);
    const box1 = R.corners(P, E, REACH, LIFT, TILT).concat(MED_PTS), T1 = cen(box1);
    const tB = 0.07, fB = unit(-nx * Math.cos(tB), Math.sin(tB), -nz * Math.cos(tB));
    let DB = fitD(T1, fB, box1) * 1.04;
    for (let i = 0; i < 6; i++) {
      const C = back(T1, fB, DB * 1.1), have = Math.hypot(T0.x - C.x, T0.y - C.y, T0.z - C.z);
      const need = fitD(T0, unit(T0.x - C.x, T0.y - C.y, T0.z - C.z), box0);
      if (have >= need) break;
      DB += (need - have) / 1.1 + 0.05;
    }
    F.roarFrame = { DA, DB, T0, T1, fA, fB, box0, box1 };   // (what the framing measured: probes read it)
    const lungeAt = (q) => ({ push: REACH * q, lift: LIFT * Math.sin(Math.min(1, q * 1.4) * Math.PI / 2), tilt: TILT * Math.min(1, q * 1.6) });
    tr(1.4, 2.75, (k) => {
      const q = gather(k), L = lungeAt(q), push = L.push, lift = L.lift;
      R.hanu(1, P, E, push, lift, L.tilt);
      const ek = Math.min(1, q * 5) * (1 - Math.max(0, (k - 0.82) / 0.18));
      R.echoes(P, E, [{ ...lungeAt(Math.max(0, q - 0.13)), k: ek }, { ...lungeAt(Math.max(0, q - 0.28)), k: ek * 0.55 }]);
      const fx = P.x + ux * push, fz = P.z + uz * push;
      R.streak(q > 0.04 ? Math.min(1, q * 4) : 0, P, { x: fx, z: fz }, 1.2 + lift);
      if (k < 1) M.lookAt = { x: fx + ux * 0.55, y: 1.75 + lift, z: fz + uz * 0.55 };   // (a track past its end still runs: only while it flies)
      put(back(T1, fB, DB * (1.1 - 0.1 * sm(k))), mix(T0, T1, Math.min(1, q * 1.08)));
    }, rawK);
    tr(1.0, 2.85, (k, t) => R.aura(1, t), rawK);
    /* 4 · 2.7 · it reaches him: a white-gold flash, a ring going out of him, the room shaken, the lanterns swinging;
       5 · and the medium, taken aback — flinching back in his chair as it comes at him, thrown back as it strikes,
       his hands up, his eyes on it — and his gasp after the crash's first blow (a voice ducks every other sound
       8 dB: on the blow it took the crash's weight with it) */
    sfx(2.7, 'hanuhit', 1);
    sfx(2.74, 'hanucrash', 0.85);
    sfx(3.02, 'md3gasp');                              // 1.39 → 4.41
    /* (the flash short and hard: at 0.9 for 0.6 s it hid his whole recoil under white, photographed at 2.78 and 3.0) */
    tr(2.7, 2.75, (k) => R.flash(0.8 * k), rawK);
    tr(2.75, 3.02, (k) => R.flash(0.8 * (1 - k)), smoothK);
    tr(2.72, 3.3, (k) => R.ring(k, IMPACT), rawK);
    tr(2.72, 3.2, (k) => F.gust(k), smoothK);
    tr(3.2, 4.6, (k) => F.gust(1 - k), smoothK);
    tr(2.42, 2.9, (k) => { M.recoil = k; }, smoothK);
    tr(3.9, 4.4, (k) => { M.recoil = 1 - k; }, smoothK);
    /* 6 · 2.85–4.1 · CUT to him: the medium in his chair, the gold going out of the air before him (the figure, its
       halo, its streak fading where it reached), his eyes going from where it was to the young man */
    tr(2.85, 4.1, (k) => put(mix(at(dl - 1.08, 0.8, E.y + 0.1), at(dl - 0.98, 0.7, E.y + 0.13), k), { x: E.x, y: E.y - 0.02, z: E.z }), smoothK);
    tr(2.85, 3.5, (k) => R.hanu(1 - k, P, E, REACH, LIFT, TILT + 0.1 * k), smoothK);
    tr(2.75, 3.25, (k) => R.streak(1 - k, P, F1, 1.2 + LIFT), smoothK);
    tr(2.85, 3.7, (k, t) => R.aura(1 - k, t), rawK);
    step(3.6, () => { M.lookAt = { x: P.x, y: 1.62, z: P.z }; });
    /* 7 · 4.1– · his eyes again: the medium still in his chair, staring at him — and THEN he stands (v21.8: he stood
       inside the close shot, into the lens, photographed at 4.4), out of his chair over 0.6 s with the sword and the
       bell coming up with him, the lens lifting with his face; the rites */
    step(4.1, () => { handsRoot.visible = true; api.armR.visible = true; });
    camTo(4.1, 5.2, { x: P.x + ux * 0.18, y: 1.64, z: P.z + uz * 0.18 }, { x: P.x - ux * 0.05, y: 1.62, z: P.z - uz * 0.05 }, smoothK);
    tr(4.1, 4.45, () => { yaw.rotation.y = yP; pitch.rotation.x = pP; }, rawK);
    tr(4.45, 5.2, (k) => { yaw.rotation.y = yP; pitch.rotation.x = pP + (0.08 - pP) * k; }, smoothK);
    step(4.45, () => { F.medStand(true); F.rite(true); F.asstLook(1); });
    sfx(4.45, 'stoolscrape', 0.5);
    step(5.0, () => { M.lookAt = null; });
    /* and the last second eases onto the decision's own framing — afterRoar puts the view there in one frame, and
       from the film's end that was a 22° drop and 0.15 m back as the letterbox left (the v21.1 review) */
    const D = F.DECIDE_AT, yD = Math.atan2(-(E.x - D.x), -(E.z - D.z));
    camTo(11.6, 12.6, { x: P.x - ux * 0.05, y: 1.62, z: P.z - uz * 0.05 }, { x: D.x, y: 1.62, z: D.z }, smoothK);
    tr(11.6, 12.6, (k) => { yaw.rotation.y = mixAngle(yP, yD, k); pitch.rotation.x = 0.08 + (F.DECIDE_PITCH - 0.08) * k; }, smoothK);
    /* the tongue (v21.4–v21.6: a whisper in no language, 4.27 s) on the cut back to his eyes — v21.8: 2.1 s later than
       it was, the lunge and the medium's shock before it — and everything after it moved with it, each the same
       distance from its end: the bells and the sword inside it, the drumroll under its last breath, the assistant, the
       drum, the gong damped with the drum's tail at the end (the v21.1 review: cut at the end, the gong CHOKED) */
    sfx(5.0, 'md3chant');                                 // 4.27 → 9.27
    sfx(5.5, 'taobell', 0.8);
    sfx(6.4, 'swordswish', 0.7);
    sfx(7.8, 'taobell', 0.7);
    sfx(8.3, 'swordswish', 0.75);
    sfx(9.0, 'drumroll3', 0.75);                          // (under its last breath)
    sfx(9.5, 'as3back');                                  // 2.51 → 12.01
    sfx(10.2, 'drum3', 0.8); sfx(10.8, 'drum3', 0.7); sfx(11.4, 'gong3', 0.55);
    sfxFade(12.0, 12.7, 'gong3'); sfxFade(12.2, 12.7, 'drum3');
    /* the body over every camera track: the roar's shake, the hit's (the hardest), the rites' (lighter), settling */
    const shake = (t) => t < 0.55 ? 1 - 0.4 * t / 0.55
                       : t < 2.7 ? 0.12
                       : t < 3.95 ? 1.25 * (1 - (t - 2.7) / 1.25)
                       : t < 4.45 ? 0
                       : Math.max(0, 0.3 * (1 - (t - 4.45) / 2.6));
    tr(0, 12.7, (k, t) => {
      const a = shake(t);
      yaw.rotation.y += a * 0.02 * Math.sin(t * 31.0);
      pitch.rotation.x += a * 0.016 * Math.sin(t * 27.0 + 1.3);
      camera.rotation.z = a * 0.025 * Math.sin(t * 23.0 + 0.4);
    }, rawK);
    step(12.6, () => { camera.rotation.z = 0; R.flash(0); R.hanu(0, P, E); R.off(); M.recoil = 0; M.lookAt = null; handsRoot.visible = true; api.armR.visible = true; });
  }

  /* ============================================================ THE ENDINGS
     Each begins where the roar left him: standing before the medium's table,
     the medium on his feet with the sword and the bell, the rites' drum going.
     Each is a different answer to the same certainty: A takes the remedy, and
     it does not end; B answers certainty with certainty and is thrown out into
     the lorong; C thanks him and goes out into an ordinary night; D thanks him
     and goes out to find the truth himself. All four close on "After that
     night..." inside the scene and the last line under the held picture (e3c2's
     v19.2 shape: the image holds while the line and the music go down
     together), and the outcome card lies over the scene's own last picture. */
  const P0 = (s) => ({ x: s.yawPos.x, y: s.yawPos.y, z: s.yawPos.z });
  const sm = (x) => x * x * (3 - 2 * x), cl01 = (x) => Math.max(0, Math.min(1, x));

  /* the closing, shared: "And some of the pieces I found... answered back."
     over the held picture, the picture and the music going down together */
  function ending(c, api, T) {
    const { step, tr, sfx, sfxFade, fade, handsRoot, pitch, smoothK } = api;
    let hold = null;
    step(T, () => { hold = { p: pitch.rotation.x }; });
    tr(T, T + 4.8, (k) => { if (hold) pitch.rotation.x = hold.p + 0.04 * k; }, smoothK);
    sfx(T + 0.4, 'z3next');                           // 3.87 s → T + 4.27
    fade(T + 1.9, T + 4.7, 0, 1);
    sfxFade(T + 1.9, T + 4.7, 'e3close3');
    step(T + 4.8, () => { handsRoot.visible = true; });   // (the engine keeps the walking hand off under the card — keep.view)
    c.endFade = 1;
    c.keep.view = true;
  }
  /* the wai, with his hands: the resting hand goes down out of the frame, the
     clasp rises into it, holds through the bow, goes down, and the resting
     hand comes back. handsPose writes the arms absolutely, so the last track
     to have started owns them. Returns when the hand is back. */
  function wai(api, T, H) {
    const { tr, rawK } = api;
    const Y = { y: -0.3 };
    tr(T, T + 0.32, (k) => { api.handsPose(0, 0, { from: 'rest' }); api.armR.position.y -= 0.17 * sm(k); }, rawK);
    tr(T + 0.32, T + 0.32 + H, (k, t) => {
      const u = cl01((t - T - 0.32) / 0.45), d = cl01((t - T - H + 0.13) / 0.45);
      api.handsPose(0, 0, Y);
      const off = 0.17 * (1 - sm(u)) + 0.17 * sm(d), L = api.prayerArm();
      api.armR.position.y -= off; if (L) L.position.y -= off;
    }, rawK);
    /* and the resting hand STAYS DOWN, out of the frame: back at rest it is the walking hand, its index finger out,
       and the photographs had it pointing at the medium's sash as he knelt and at the assistant's knees (relaxed, the
       fingers close but that finger still leads). A scene that needs the hand again raises it from below (A's lift,
       D's LP Tim) — the v21.1 review */
    tr(T + 0.32 + H, T + 0.72 + H, (k) => { api.handsPose(0, 0, { from: 'rest', relax: 0.85 }); api.armR.position.y -= 0.17; }, rawK);
    return T + 0.72 + H;
  }
  /* a walk along a route at a steady pace — eased in and out, the heading
     looking ahead along the way (unwrapped, so it never spins), a small bob,
     a footfall every 0.56 s */
  function walkRoute(api, pts, T0, v, look = 1.8) {
    const { tr, sfx, faceFrom, rawK } = api;
    const segL = pts.slice(1).map((q, i) => Math.hypot(q.x - pts[i].x, q.z - pts[i].z));
    const L = segL.reduce((a, b) => a + b, 0), E = 0.55, D = L / v + E;
    const atLen = (d) => { d = Math.max(0, Math.min(L, d));
      for (let i = 0; i < segL.length; i++) { if (d <= segL[i] || i === segL.length - 1) { const f = segL[i] ? Math.min(1, d / segL[i]) : 1; return { x: pts[i].x + (pts[i + 1].x - pts[i].x) * f, z: pts[i].z + (pts[i + 1].z - pts[i].z) * f }; } d -= segL[i]; } };
    const dAt = (t) => { const tt = Math.min(D, Math.max(0, t - T0)); return tt < E ? v * tt * tt / (2 * E) : tt > D - E ? L - v * (D - tt) * (D - tt) / (2 * E) : v * (tt - E / 2); };
    const segH = [];
    for (let i = 0; i < segL.length; i++) { let h = faceFrom(pts[i].x, pts[i].z, pts[i + 1].x, pts[i + 1].z); if (i) { while (h - segH[i - 1] > Math.PI) h -= 2 * Math.PI; while (h - segH[i - 1] < -Math.PI) h += 2 * Math.PI; } segH.push(h); }
    const headAt = (d) => {
      let i = 0, dd = d; while (i < segL.length - 1 && dd > segL[i]) { dd -= segL[i]; i++; }
      const q = atLen(d), a = atLen(Math.min(L, d + look));
      if (Math.hypot(a.x - q.x, a.z - q.z) < 0.3) return segH[segH.length - 1];
      let h = faceFrom(q.x, q.z, a.x, a.z); while (h - segH[i] > Math.PI) h -= 2 * Math.PI; while (h - segH[i] < -Math.PI) h += 2 * Math.PI;
      return h;
    };
    tr(T0, T0 + D + 0.05, (k, t) => {
      const d = dAt(t), q = atLen(d);
      api.yaw.position.set(q.x, 1.62 + 0.016 * Math.sin(d / 0.72 * Math.PI), q.z);
      api.yaw.rotation.y = headAt(d);
    }, rawK);
    for (let t = T0 + 0.35; t < T0 + D - 0.25; t += 0.56) {
      const at = +t.toFixed(2);
      sfx(at, 'step', 0.85);                           // (a footfall: the engine deals one of step1..step4)
    }
    return { end: T0 + D, head: segH[segH.length - 1], first: segH[0], headAt0: headAt(0) };
  }
  /* v21.1: a turn onto a walk that HANDS OVER. yawTo's track writes its end value on every frame after t1 (cineSeek
     re-applies every passed track, in push order), so the turn from the medium onto the route, pushed after the walk,
     owned the walk's heading for the whole walk out: endings B, C and D crossed the room looking 52–58° off his own
     path and then jumped that far in one frame (the v21.1 review, measured and photographed). This one stops writing
     at t1; on a skip it writes nothing, so the walk's own end heading stands and the next turn starts from it. */
  function turnOnto(api, t0, t1, from, to) {
    api.tr(t0, t1, (k, t) => { if (t <= t1) api.yaw.rotation.y = api.mixAngle(from, to, k); }, api.smoothK);
  }
  // the way out, from the table through the room and the left bay to the five-foot way (local x, through LX)
  const outRoute = (F, p0, last) => [{ x: p0.x, z: p0.z }, { x: F.LX(-1.0), z: -4.4 }, { x: F.LX(-2.3), z: -2.7 }, { x: F.LX(-2.4), z: -0.9 },
    { x: F.LX(-2.35), z: 0.5 }, { x: F.LX(last.x), z: last.z }];

  /* A · ACCEPT IT, DO EVERY RITUAL (bad) — "Then please... drive it out." He
     kneels and shuts his eyes; in the dark the bell and the sword go round
     him, the incantation, the paper burnt and stirred into water; he drinks
     it; the assistant books him seven nights of the same; and outside under
     the lanterns his hand begins to lift on its own. */
  function scAccept(c, s, api) {
    const { sfx, tr, step, fade, camTo, yawTo, pitchTo, faceFrom, smoothK, rawK, stage, duck, handsRoot } = api;
    const F = stage.film, M = F.shrineCast.medium, A = F.shrineCast.asst, E = F.MED_EYE, p0 = P0(s);
    const toMed = faceFrom(p0.x, p0.z, E.x, E.z);
    step(0, () => { M.look = 1; M.lookAt = null; F.medPose(F.MED_RITE, 0.5); });
    yawTo(0, 0.8, s.yawRot, toMed, smoothK);
    pitchTo(0, 0.8, s.pitchX, 0.06, smoothK);
    // the wai, and his plea
    wai(api, 0.2, 2.2);
    pitchTo(0.9, 1.5, 0.06, -0.36, smoothK); pitchTo(1.8, 2.5, -0.36, 0.06, smoothK);
    sfx(0.6, 'z3A1');                                  // 2.51 → 3.11
    // "Kneel. Close your eyes." — he goes down on his knees before the table
    sfx(3.4, 'md3A1');                                 // 2.12 → 5.52
    step(3.4, () => { M.nod = 1.8; });
    const stand = { x: p0.x, y: 1.62, z: p0.z }, knee = { x: p0.x, y: 1.0, z: p0.z - 0.1 };
    camTo(4.4, 5.4, stand, knee, smoothK);
    pitchTo(4.4, 5.4, 0.06, 0.34, smoothK);           // up at him over the table's edge
    sfx(5.0, 'kneethud', 0.6); sfx(5.05, 'matkneel3', 0.5);
    // his eyes close; the rites go round him in the dark
    fade(5.8, 6.6, 0, 0.985);
    tr(5.8, 6.6, (k) => { duck('ritual3', 1 - 0.55 * k); }, rawK);
    sfx(6.8, 'taobell', 0.85);
    sfx(7.6, 'swordswish', 0.8);
    sfx(8.2, 'swordswish', 0.7);
    sfx(8.7, 'taobell', 0.7);
    sfx(8.9, 'md3chant');                              // 4.27 → 13.17 (v21.4: the longer take started on the sword; v21.5: the whispered one on the second; v21.6: without its shout, after the bell — ending where it always did)
    sfx(10.7, 'taobell', 0.6);
    sfx(13.3, 'ashwater', 0.8);                        // the paper burnt and the ash stirred into the water (2.03 s)
    // his eyes open on the cup brought to his lips: "Drink." (held in the hands' pass, the hands below the frame)
    step(15.2, () => { api.armR.visible = false; F.cup.visible = true; F.cup.scale.setScalar(0.72); handsRoot.add(F.cup); });
    fade(15.3, 16.0, 0.985, 0);
    tr(15.2, 20.2, (k, t) => {
      const up = sm(cl01((t - 15.4) / 0.9)), tip = sm(cl01((t - 17.0) / 0.7)) * (1 - sm(cl01((t - 18.6) / 0.6))), down = sm(cl01((t - 19.2) / 0.8));
      /* (at 0.24 m it filled the frame like a bucket; at -0.16 / -0.33 it sat on the frame's bottom edge — 26° under the middle of
         a 26° half-view — and the tip carried the drink itself out of frame: it rests at 20° under the middle now, and the tip
         brings it up and in toward the lips, still at 19°) */
      F.cup.position.set(0.015, -0.36 + 0.24 * up - 0.34 * down + 0.04 * tip, -0.33 + 0.1 * tip);
      F.cup.rotation.set(0.12 + 0.9 * tip, 0, 0);
    }, rawK);
    pitchTo(15.2, 16.4, 0.34, 0.1, smoothK);
    sfx(16.2, 'md3A2');                                // 0.57 → 16.77
    sfx(17.4, 'drinkgulp', 0.8);                       // 1.58 s
    step(20.2, () => { F.cup.visible = false; if (F.cup.parent) F.cup.parent.remove(F.cup); api.armR.visible = true; });
    // he gets up; the assistant has his list ready — "Come back seven nights."
    camTo(19.6, 20.6, knee, stand, smoothK);
    const toAsst = faceFrom(p0.x, p0.z, F.ASST_AT.x, F.ASST_AT.z);
    yawTo(20.2, 21.2, toMed, toAsst, smoothK);
    pitchTo(20.2, 21.2, 0.1, -0.12, smoothK);
    step(20.4, () => { A.look = 1; A.lookAt = null; A.nod = 4.0; });
    sfx(21.0, 'as3A');                                 // 3.87 → 24.87
    // out under the lanterns: the black takes him through the door
    fade(25.0, 25.6, 0, 1);
    tr(25.0, 25.6, (k) => { duck('ritual3', 0.45 * (1 - k)); }, rawK);
    const out = { x: F.LX(-3.15), y: 1.62, z: 1.45 }, east = faceFrom(out.x, out.z, F.LX(7), 1.6);
    camTo(25.65, 25.7, out, out, rawK);
    yawTo(25.65, 25.7, east, east, rawK);
    pitchTo(25.65, 25.7, -0.2, -0.2, rawK);
    fade(25.8, 26.7, 1, 0);
    // his right hand: it starts to lift into the dance on its own, is pulled down, and starts again
    tr(26.0, 34.0, (k, t) => {
      const u = t - 26.0, lift = 0.62 * Math.max(0, Math.sin(u * 0.85)) ** 1.4 + 0.035 * Math.sin(u * 7.3);
      api.handsPose(cl01(lift), u * 0.8, { from: 'rest', relax: 0.8 });
      api.armR.position.y -= 0.17 * (1 - sm(cl01((lift - 0.04) / 0.2)));   // up from below the frame, where the bow left it, and back down
    }, rawK);
    sfx(27.0, 'presencein', 0.3);
    sfx(27.6, 'z3A2');                                 // 4.05 → 31.65
    // and up, to the lanterns and the night over the lorong
    sfx(31.8, 'e3close3', 0.9);
    sfx(32.4, 'z3close');                              // 8.44 → 40.84
    /* (along the five-foot way, a little toward the road: the far lantern stays in the left of a phone's frame and
       the night opens on the right. Toward (LX 2, z 6) it swung across the road and held the last nine seconds, and
       the card, on three flat shophouse fronts, the lanterns gone — the v21.1 photographs) */
    yawTo(33.0, 39.5, east, east - 0.16, smoothK);
    pitchTo(33.0, 39.5, -0.2, 0.2, smoothK);
    tr(34.0, 34.6, (k) => { api.armR.position.y -= 0.3 * sm(k); }, rawK);   // the hand down out of the frame, not gone in one frame mid-lift
    step(34.6, () => { handsRoot.visible = false; });
    ending(c, api, 41.0);
  }

  /* B · TELL HIM HE IS WRONG (worst) — certainty against certainty. The drum
     stops; he looks at him; "What did you say?" — and it surges again: the
     roar out of him, the gold, the stools going over; the assistant throws
     him out, and the shutter comes down on the light. In the lorong the
     lanterns swing in no wind: whatever it was, it heard him. */
  function scWrong(c, s, api) {
    const { sfx, tr, step, camTo, yawTo, pitchTo, faceFrom, smoothK, rawK, stage, duck, camera, handsRoot } = api;
    const F = stage.film, M = F.shrineCast.medium, A = F.shrineCast.asst, E = F.MED_EYE, R = F.roar, p0 = P0(s);
    const toMed = faceFrom(p0.x, p0.z, E.x, E.z);
    step(0, () => { M.look = 0.6; M.lookAt = null; });
    yawTo(0, 0.8, s.yawRot, toMed, smoothK);
    pitchTo(0, 0.8, s.pitchX, 0.08, smoothK);
    sfx(0.4, 'z3B1');                                  // 2.35 → 2.75
    // the drum stops; the medium stops; he looks at him
    tr(2.7, 3.3, (k) => { duck('ritual3', 1 - k); }, rawK);
    step(2.9, () => { M.look = 1; F.medPose(F.MED_ANGRY, 0.7); A.look = 1; A.lookAt = null; });
    sfx(3.5, 'md3B1');                                 // 1.18 → 4.68
    // and it surges again: the roar out of him, the gold, the lens thrown at the medium
    sfx(5.0, 'hanumanroar', 1);
    sfx(5.05, 'goldsting', 0.8);
    tr(5.0, 5.12, (k) => R.flash(k), rawK);
    tr(5.12, 6.2, (k) => R.flash(1 - k), smoothK);
    const stand = { x: p0.x, y: 1.62, z: p0.z };
    const lunge = { x: p0.x + (E.x - p0.x) * 0.22, y: 1.7, z: p0.z + (E.z - p0.z) * 0.22 };
    camTo(5.0, 5.25, stand, lunge, smoothK);
    tr(5.1, 5.8, (k) => { M.group.position.z = F.MED_AT.z + 0.42 - 0.24 * sm(k); }, rawK);   // the medium falls back a step
    sfx(5.4, 'stoolfall', 0.8);
    sfx(5.7, 'stoolscrape', 0.75);
    tr(5.0, 11.0, (k, t) => { const a = Math.max(0, 1 - (t - 5.0) / 2.4) + 0.4 * Math.max(0, Math.sin((t - 6.6) * 2.2)) * cl01((10.4 - t) / 1.0) * (t > 6.6 ? 1 : 0);
      camera.rotation.z = a * 0.03 * Math.sin(t * 27); }, rawK);
    // "Go! Get out!" — he is turned round and thrown out of the door, stumbling
    sfx(6.9, 'as3B');                                  // 3.27 → 10.17 (at 6.2 it was said into the roar's loudest half-second, 6.0–6.5)
    /* (he stops further out and to the right of the door: at (−2.0, 1.9) the doorway lantern hung 0.89 m in front
       of him, and through the whole shutter beat its gold ring and its tassel stood across the top-left of a phone's
       frame — "a large red pipe" (the v21.1 photographs). From here it is 28° off his line, out of a phone's frame,
       and whole on a desktop's; he turns up onto it later as before) */
    const BST = { x: -1.3, z: 2.15 };
    const W = walkRoute(api, [{ x: lunge.x, z: lunge.z }, ...outRoute(F, p0, BST).slice(1)], 6.7, 1.9, 1.2);
    turnOnto(api, 6.2, 6.75, toMed, W.headAt0);
    pitchTo(6.2, 6.9, 0.08, -0.12, smoothK);
    for (const [t0, d] of [[7.3, 0.12], [8.6, 0.16], [9.5, 0.1]]) { pitchTo(t0, t0 + 0.14, -0.12, -0.12 - d, rawK); pitchTo(t0 + 0.14, t0 + 0.5, -0.12 - d, -0.12, smoothK); }
    step(6.6, () => { handsRoot.visible = false; });
    // he turns back: the shutter comes down on the light
    const face = faceFrom(F.LX(BST.x), BST.z, F.LX(-2.25), -2.0);
    yawTo(W.end - 0.1, W.end + 1.0, W.head, face, smoothK);
    pitchTo(W.end - 0.1, W.end + 1.0, -0.12, 0.08, smoothK);
    const T1 = W.end + 0.9;
    sfx(T1, 'shutter', 0.95);                          // 2.9 s
    tr(T1 + 0.05, T1 + 2.6, (k) => { F.entShutter(k); duck('ritual3', 0); duck('shrineamb', 1 - 0.7 * k); }, rawK);
    // "...and whatever it was, it heard me." — the lanterns swing in no wind
    sfx(T1 + 3.0, 'z3B2');                             // 4.91 → T1 + 7.91
    sfx(T1 + 4.8, 'presencein', 0.35);
    tr(T1 + 4.6, T1 + 5.8, (k) => F.gust(sm(k)), rawK);
    tr(T1 + 5.8, T1 + 9.0, (k) => F.gust(1 - sm(k)), rawK);
    /* up AND round onto the lantern over the door, turned to its bearing. From BST it hangs 1.45 m off and spans
       10°–39° of elevation with its tassel, and the letterboxed frame is ±29.5°: at 0.42 (24°) it swings whole, the
       string to the ceiling above it, clear of both bars on a phone. (From v21.0's stand, 0.89 m under it, it spanned
       16°–60° and needed 0.62 — and stood across the top of the shutter shot before it.) */
    const lant = faceFrom(F.LX(BST.x), BST.z, F.LX(-2.25), 1.05);
    yawTo(T1 + 4.6, T1 + 6.0, face, lant, smoothK);
    pitchTo(T1 + 4.6, T1 + 6.0, 0.08, 0.42, smoothK);
    // and away, down the lorong under the sodium lamp
    sfx(T1 + 8.2, 'e3close3', 0.9);
    sfx(T1 + 8.6, 'z3close');                          // 8.44 → T1 + 17.04
    const street = faceFrom(F.LX(BST.x), BST.z, F.LX(6.4), 6.0);
    yawTo(T1 + 9.0, T1 + 15.5, lant, street, smoothK);
    pitchTo(T1 + 9.0, T1 + 15.5, 0.42, 0.16, smoothK);
    ending(c, api, T1 + 17.1);
  }

  /* C · THANK HIM, LEAVE, AND PUT IT OUT OF MIND (good) — a polite wai;
     "Mm. Go home. Rest."; out through the room into an ordinary night: the
     coffee shop's lights across the road, a bus going past between. */
  function scLeave(c, s, api) {
    const { sfx, tr, step, yawTo, pitchTo, faceFrom, smoothK, rawK, stage, duck, handsRoot } = api;
    const F = stage.film, M = F.shrineCast.medium, E = F.MED_EYE, p0 = P0(s);
    const toMed = faceFrom(p0.x, p0.z, E.x, E.z);
    step(0, () => { M.look = 1; M.lookAt = null; });
    yawTo(0, 0.8, s.yawRot, toMed, smoothK);
    pitchTo(0, 0.8, s.pitchX, 0.06, smoothK);
    wai(api, 0.2, 2.4);
    pitchTo(0.9, 1.5, 0.06, -0.36, smoothK); pitchTo(1.9, 2.6, -0.36, 0.06, smoothK);
    sfx(0.7, 'z3thank');                               // 1.96 → 2.66
    step(2.9, () => { M.nod = 2.4; });
    sfx(3.0, 'md3C');                                  // 2.43 → 5.43
    // out: through the room, through the door, to the kerb
    const kerb = { x: -2.1, z: 1.95 }, route = outRoute(F, p0, kerb);
    const W = walkRoute(api, route, 6.0, 1.05);
    turnOnto(api, 5.3, 6.1, toMed, W.headAt0);
    pitchTo(5.3, 6.1, 0.06, -0.05, smoothK);
    step(5.6, () => { handsRoot.visible = false; });
    tr(6.0, W.end, (k) => { duck('ritual3', 1 - 0.75 * k); duck('shrineamb', 1 - 0.5 * k); }, rawK);
    // the coffee shop across the road (its lit bay on the far facade), and the bus between
    const kopi = { x: F.LX(-15), z: 17.8 };             // (v21.8: its open front, 1.4 m further back with the far row)
    const toKopi = faceFrom(F.LX(kerb.x), kerb.z, kopi.x, kopi.z);
    yawTo(W.end - 0.3, W.end + 1.4, W.head, toKopi, smoothK);
    pitchTo(W.end - 0.3, W.end + 1.4, -0.05, 0.1, smoothK);
    const Tb = W.end + 0.9;
    sfx(Tb, 'buspass', 0.9);                           // 4.54 s
    tr(Tb - 0.85, Tb + 8.5, (k) => F.bus(k), rawK);      // (13.9 m/s; past the kerb's line at Tb + 2.9, as it always was)
    sfx(Tb + 1.4, 'z3C2');                             // 5.96 → Tb + 7.36
    // he watches it go, and the night goes on
    /* (he stands on the line of the five-foot way's pillars, z 2.02, and the one at x −4.5 is 2.4 m along it: looking
       toward (−24, 9) put its face in the right third of a phone's frame for the rest of the scene — toward (−24, 14)
       its edge is 23° off the middle, outside a phone's 18.6°) */
    yawTo(Tb + 3.2, Tb + 8.0, toKopi, faceFrom(F.LX(kerb.x), kerb.z, F.LX(-24), 14.0), smoothK);
    sfx(Tb + 7.6, 'e3close3', 0.9);
    sfx(Tb + 8.0, 'z3close');                          // 8.44 → Tb + 16.44
    pitchTo(Tb + 8.4, Tb + 15.5, 0.1, 0.24, smoothK);
    ending(c, api, Tb + 16.5);
  }

  /* D · THANK HIM, HOLD HIS READING AS ONE VIEW, KEEP SEEKING (best) — a
     wai; "Remember what I told you."; out under the lanterns, where his hand
     finds the LP Tim and holds it up into their light; then out to the kerb,
     and up at the night: "If I wanted the truth... I would have to go and
     find it myself." */
  function scSeek(c, s, api) {
    const { sfx, tr, step, camTo, yawTo, pitchTo, faceFrom, smoothK, rawK, stage, duck, handsRoot, camera } = api;
    const F = stage.film, M = F.shrineCast.medium, E = F.MED_EYE, p0 = P0(s);
    const toMed = faceFrom(p0.x, p0.z, E.x, E.z);
    step(0, () => { M.look = 1; M.lookAt = null; });
    yawTo(0, 0.8, s.yawRot, toMed, smoothK);
    pitchTo(0, 0.8, s.pitchX, 0.06, smoothK);
    wai(api, 0.2, 2.4);
    pitchTo(0.9, 1.5, 0.06, -0.36, smoothK); pitchTo(1.9, 2.6, -0.36, 0.06, smoothK);
    sfx(0.7, 'z3thank');                               // 1.96 → 2.66
    step(2.9, () => { M.nod = 1.4; });
    sfx(3.0, 'md3D');                                  // 1.23 → 4.23
    // out, to stand under the lantern over the door
    const lan = { x: -2.3, z: 1.3 }, route = outRoute(F, p0, lan);
    const W = walkRoute(api, route, 4.8, 1.05);
    turnOnto(api, 4.3, 5.0, toMed, W.headAt0);
    pitchTo(4.3, 5.0, 0.06, -0.05, smoothK);
    tr(4.8, W.end, (k) => { duck('ritual3', 1 - 0.75 * k); duck('shrineamb', 1 - 0.5 * k); }, rawK);
    /* (toward the kopitiam's lit bay across the road, x −15: the LP Tim is held up against its warm light, as this
       ending always meant — straight across, it hung against two grey shutters and the black road; the v21.1
       photographs) */
    const Ls = { x: F.LX(lan.x), z: lan.z }, outward = faceFrom(Ls.x, Ls.z, F.LX(-15), 18.0);   // (v21.8: the kopitiam's front, with the far row)
    yawTo(W.end - 0.3, W.end + 0.9, W.head, outward, smoothK);
    // his hand finds the LP Tim and holds it up into the lantern's light: it hangs from his fingers on its cord
    const T2 = W.end + 0.6;
    let pend = null, bone = null;
    /* (the fingertip is the "_end" LEAF of the index finger: glTF makes a node a Bone only when a skin lists it as a
       joint, and a leaf no vertex is weighted to is a plain Object3D — the first build tested isBone and never found it) */
    step(T2, () => {
      const hand = api.rightHand && api.rightHand();
      if (hand) hand.traverse(o => { if (!bone && /f_index03R?_end$|f_index\.?03\.?R_end$/i.test(o.name)) bone = o; });
      pend = new (F.tim.constructor)();
      if (bone) { bone.add(pend); pend.add(F.tim); F.tim.visible = true; }
    });
    const Q = camera.quaternion.constructor, V3 = camera.position.constructor, AX = new V3(1, 0, 0), AY = new V3(0, 1, 0);
    const _pq = new Q(), _hq = new Q(), _sq = new Q(), _ps = new V3(), _tp = new V3(), _dv = new V3(), _aq = new Q();
    tr(T2, T2 + 9.0, (k, t) => {
      const u = t - T2, up = sm(cl01(u / 1.1)) * (1 - sm(cl01((u - 7.6) / 1.0)));
      api.handsPose(0, 0, { from: 'rest', relax: 0.15 });
      api.armR.position.y += -0.2 + 0.35 * up; api.armR.position.x -= 0.05 * up; api.armR.position.z += 0.11 * up;
      /* on a narrow screen layoutHands lays the hand further in (so the whole hand stays on it), and that carried the
         fingertip — and the LP Tim on it — off the LEFT edge: a phone saw the hand and no pendant (photographed). The
         arm slides right until the fingertip stands a little left of the middle; never left, so a desktop's hand is
         exactly where it was. (The hands' scene is the lens's frame: the viewmodel camera sits at its origin.) */
      if (bone && api.vmCam && up > 0) {
        api.armR.updateMatrixWorld(true);
        bone.getWorldPosition(_tp);
        const hw = Math.tan(api.vmCam.fov * Math.PI / 360) * api.vmCam.aspect * Math.max(0.05, -_tp.z);
        const need = Math.max(0, -0.1 * hw - _tp.x) * up;
        if (need > 0) { api.armR.parent.getWorldQuaternion(_aq); api.armR.position.add(_dv.set(need, 0, 0).applyQuaternion(_aq.invert())); }
      }
      if (api.vmFire) api.vmFire.intensity = 1.1 * up * (0.92 + 0.08 * Math.sin(u * 7.3));   // the lantern over the door, warm on it
      if (pend && pend.parent) {
        /* the pendant HANGS: the hands are drawn in the viewmodel's own scene, which is the lens's frame, so the
           world's up there is the camera's up tipped back by the pitch; it faces the lens (the model's front is
           its +z, the shop case's measure) and turns a little on its cord */
        pend.parent.updateWorldMatrix(true, false);
        pend.parent.getWorldQuaternion(_pq);
        _hq.setFromAxisAngle(AX, -api.pitch.rotation.x).multiply(_sq.setFromAxisAngle(AY, 0.22 * Math.sin(u * 0.8)));
        pend.quaternion.copy(_pq.invert().multiply(_hq));
        pend.parent.getWorldScale(_ps); pend.scale.setScalar(1 / (_ps.x || 1));
      }
    }, rawK);
    pitchTo(T2, T2 + 1.2, -0.05, 0.03, smoothK);       // level, onto the street: the kopitiam's light behind it
    sfx(T2 + 1.3, 'z3D2');                             // 6.77 → T2 + 8.07
    step(T2 + 9.0, () => { F.tim.visible = false; if (F.tim.parent) F.tim.parent.remove(F.tim); if (pend && pend.parent) pend.parent.remove(pend); handsRoot.visible = false; });
    // to the kerb, and up at the night
    const kerb = { x: F.LX(-2.0), y: 1.62, z: 2.12 };
    camTo(T2 + 8.6, T2 + 10.0, { x: Ls.x, y: 1.62, z: Ls.z }, kerb, smoothK);
    sfx(T2 + 8.8, 'step', 0.8); sfx(T2 + 9.4, 'step', 0.8);
    /* (higher than the 0.62 it was: the far row's upper floor filled half the frame under a hard roofline, and the
       stars, the thing he looks up at, were faint and never changed — they are the shrine's OWN, brightened over
       the line; the engine's dome a `{ stars }` daylight drives is past the far plane from here — the v21.1 review) */
    pitchTo(T2 + 8.8, T2 + 11.6, 0.03, 0.82, smoothK);
    tr(T2 + 9.6, T2 + 14.6, (k) => F.stars(k), smoothK);
    sfx(T2 + 10.4, 'z3D3');                            // 4.44 → T2 + 14.84
    sfx(T2 + 15.0, 'e3close3', 0.9);
    sfx(T2 + 15.4, 'z3close');                         // 8.44 → T2 + 23.84
    yawTo(T2 + 15.6, T2 + 22.5, outward, outward - 0.35, smoothK);
    ending(c, api, T2 + 23.9);
  }

  /* ================================================== THE DRAWN SURFACES
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
  /* a neighbouring shopfront in the old mall: a sign band and a window */
  function makeShopfront(THREE, cnv, kind) {
    const W = 512, H = 384, [c, x] = sized(cnv, W, H), r = rng(kind.length * 7 + 3);
    const K = {
      grocery: { band: '#1f6a3a', ink: '#fff4c8', name: 'THAI MART  ร้านค้าไทย', sub: 'Fresh from Bangkok daily' },
      travel:  { band: '#174a8c', ink: '#ffffff', name: 'BANGKOK TRAVEL', sub: 'Bus · Air · Tours  ทัวร์' },
      massage: { band: '#b03a6a', ink: '#fff0f6', name: 'THAI MASSAGE  นวดไทย', sub: 'Foot · Body · Herbal' },
      gold:    { band: '#7a1a10', ink: '#ffd76a', name: '金店 GOLDSMITH', sub: '916 · 999 Gold' },
      phone:   { band: '#202020', ink: '#7fe0ff', name: 'MOBILE CENTRE', sub: 'Repair · Top-up · SIM' },
      shutter: { band: '#5a5a5a', ink: '#e8e8e8', name: 'TO LET', sub: 'Enquiries 9xxx xxxx' },
      food:    { band: '#c46a10', ink: '#fff6e0', name: 'THAI KITCHEN  อาหารไทย', sub: 'Boat noodles · Tom yum' }
    }[kind] || { band: '#444', ink: '#fff', name: kind.toUpperCase(), sub: '' };
    x.fillStyle = '#3a3a3e'; x.fillRect(0, 0, W, H);
    x.fillStyle = K.band; x.fillRect(0, 0, W, 86);
    x.fillStyle = K.ink; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.font = 'bold 40px sans-serif'; x.fillText(K.name, W / 2, 34);
    x.font = '22px sans-serif'; x.fillText(K.sub, W / 2, 68);
    if (kind === 'shutter' || kind === 'massage') {               // a roller shutter, part or all the way down
      const top = kind === 'massage' ? 230 : 92;
      x.fillStyle = '#d8dad6'; x.fillRect(10, 92, W - 20, H - 102);
      x.fillStyle = '#9ea29c'; x.fillRect(10, top, W - 20, H - top - 10);
      for (let y = top; y < H - 10; y += 9) { x.fillStyle = 'rgba(40,40,40,0.35)'; x.fillRect(10, y, W - 20, 2); }
      if (kind === 'massage') { x.fillStyle = '#f6c8da'; for (let i = 0; i < 3; i++) x.fillRect(40 + i * 150, 110, 110, 100); }
      return done(THREE, c, false);
    }
    // the window: a glass box of goods
    x.fillStyle = '#e8eef0'; x.fillRect(10, 92, W - 20, H - 102);
    if (kind === 'grocery' || kind === 'food') {
      for (let sh = 0; sh < 4; sh++) {
        const y = 110 + sh * 66;
        x.fillStyle = '#9a9a9a'; x.fillRect(16, y + 56, W - 32, 4);
        for (let i = 0; i < 18; i++) {
          x.fillStyle = `hsl(${(r() * 360) | 0},${55 + r() * 30}%,${40 + r() * 25}%)`;
          const w = 16 + r() * 10, h = 26 + r() * 26; x.fillRect(20 + i * 26.5, y + 56 - h, w, h);
        }
      }
    } else if (kind === 'travel') {
      for (let i = 0; i < 3; i++) {                                // posters: a temple at sunset, a beach, a city
        const px = 26 + i * 160;
        const gr = x.createLinearGradient(0, 110, 0, 340);
        gr.addColorStop(0, ['#f2a046', '#4ab0e0', '#8a6ad0'][i]); gr.addColorStop(1, ['#7a2a1a', '#e8d8a0', '#202040'][i]);
        x.fillStyle = gr; x.fillRect(px, 110, 140, 200);
        x.fillStyle = 'rgba(20,10,10,0.75)';
        if (i === 0) { x.beginPath(); x.moveTo(px + 70, 160); x.lineTo(px + 110, 260); x.lineTo(px + 30, 260); x.fill(); x.fillRect(px + 20, 260, 100, 30); }
        if (i === 2) for (let k = 0; k < 6; k++) x.fillRect(px + 10 + k * 21, 200 + (k * 37 % 50), 16, 110);
        x.fillStyle = '#fff'; x.font = 'bold 18px sans-serif'; x.fillText(['BANGKOK', 'PHUKET', 'HAT YAI'][i], px + 70, 330);
      }
    } else if (kind === 'gold') {
      x.fillStyle = '#2a0c08'; x.fillRect(16, 100, W - 32, H - 116);
      for (let i = 0; i < 60; i++) { x.strokeStyle = `rgba(255,${190 + r() * 50},${70 + r() * 40},0.9)`; x.lineWidth = 2;
        x.beginPath(); x.arc(30 + r() * (W - 60), 120 + r() * 230, 6 + r() * 12, 0, Math.PI * 2); x.stroke(); }
    } else if (kind === 'phone') {
      for (let i = 0; i < 4; i++) for (let j = 0; j < 3; j++) {
        x.fillStyle = '#1a1a1a'; x.fillRect(40 + i * 112, 110 + j * 84, 52, 74);
        x.fillStyle = `hsl(${(r() * 360) | 0},60%,55%)`; x.fillRect(44 + i * 112, 116 + j * 84, 44, 60);
      }
    }
    const sheen = x.createLinearGradient(0, 92, W, H);            // the glass
    sheen.addColorStop(0, 'rgba(255,255,255,0.16)'); sheen.addColorStop(0.4, 'rgba(255,255,255,0)'); sheen.addColorStop(0.6, 'rgba(255,255,255,0.08)'); sheen.addColorStop(1, 'rgba(255,255,255,0)');
    x.fillStyle = sheen; x.fillRect(10, 92, W - 20, H - 102);
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

  /* ---------------------------------------------- WORLD B's drawn surfaces */
  /* the shrine's floor: old red quarry tiles, worn paler where people stand */
  function makeQuarryTiles(THREE, cnv) {
    const S = 512, [c, x] = cnv(S), r = rng(61);
    for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) {
      const v = 0.85 + r() * 0.2;
      x.fillStyle = `rgb(${(132 * v) | 0},${(52 * v) | 0},${(36 * v) | 0})`; x.fillRect(i * 128, j * 128, 128, 128);
      for (let k = 0; k < 90; k++) { x.fillStyle = `rgba(${r() < 0.5 ? '40,12,8' : '190,120,90'},${r() * 0.18})`; x.fillRect(i * 128 + r() * 128, j * 128 + r() * 128, 2 + r() * 3, 1 + r() * 2); }
    }
    x.fillStyle = '#3a2620'; for (let p = 0; p <= 512; p += 128) { x.fillRect(0, p - 2, S, 4); x.fillRect(p - 2, 0, 4, S); }
    const g = x.createRadialGradient(S / 2, S / 2, 40, S / 2, S / 2, S * 0.7);
    g.addColorStop(0, 'rgba(255,220,190,0.10)'); g.addColorStop(1, 'rgba(0,0,0,0.12)');
    x.fillStyle = g; x.fillRect(0, 0, S, S);
    return done(THREE, c, true);
  }
  /* the walls' dado: small pale-green glazed tiles to shoulder height, the way
     an old shophouse is tiled; the paint above is plain cream (a material) */
  function makeDadoTiles(THREE, cnv) {
    const S = 256, [c, x] = cnv(S), r = rng(67);
    for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) {
      const v = 0.92 + r() * 0.1;
      x.fillStyle = `rgb(${(176 * v) | 0},${(206 * v) | 0},${(186 * v) | 0})`; x.fillRect(i * 32, j * 32, 32, 32);
      x.fillStyle = 'rgba(255,255,255,0.16)'; x.fillRect(i * 32 + 3, j * 32 + 3, 10, 4);
    }
    x.fillStyle = '#e8e4d8'; for (let p = 0; p <= S; p += 32) { x.fillRect(0, p - 1, S, 2); x.fillRect(p - 1, 0, 2, S); }
    return done(THREE, c, true);
  }
  /* the black lacquer plaque over the altar, gold characters: "the god's grace
     is boundless" — the phrase every such shrine hangs */
  function makePlaque(THREE, cnv) {
    const [c, x] = sized(cnv, 1024, 256);
    const g = x.createLinearGradient(0, 0, 0, 256); g.addColorStop(0, '#1a0c06'); g.addColorStop(1, '#0a0402');
    x.fillStyle = g; x.fillRect(0, 0, 1024, 256);
    x.strokeStyle = '#d4a23e'; x.lineWidth = 10; x.strokeRect(14, 14, 996, 228);
    x.lineWidth = 3; x.strokeRect(30, 30, 964, 196);
    const gold = x.createLinearGradient(0, 40, 0, 220); gold.addColorStop(0, '#ffe6a0'); gold.addColorStop(0.5, '#d4a23e'); gold.addColorStop(1, '#a8761e');
    x.fillStyle = gold; x.textAlign = 'center'; x.textBaseline = 'middle'; x.font = 'bold 150px serif';
    x.fillText('神 恩 浩 蕩', 512, 132);
    return done(THREE, c, false);
  }
  /* a red altar cloth, gold border, a big gold character in a roundel */
  function makeAltarCloth(THREE, cnv) {
    const [c, x] = sized(cnv, 512, 256), r = rng(71);
    x.fillStyle = '#9a1410'; x.fillRect(0, 0, 512, 256);
    for (let i = 0; i < 600; i++) { x.fillStyle = `rgba(${r() < 0.5 ? '60,0,0' : '200,40,30'},${r() * 0.2})`; x.fillRect(r() * 512, r() * 256, 2, 2); }
    x.strokeStyle = '#e8b84a'; x.lineWidth = 10; x.strokeRect(12, 12, 488, 232);
    x.lineWidth = 3; x.strokeRect(28, 28, 456, 200);
    for (let i = 0; i < 18; i++) { x.fillStyle = '#e8b84a'; x.beginPath(); x.arc(40 + i * 25.6, 244, 6, 0, Math.PI); x.fill(); }   // the fringe's scallops
    x.fillStyle = '#e8b84a'; x.beginPath(); x.arc(256, 124, 70, 0, Math.PI * 2); x.fill();
    x.fillStyle = '#9a1410'; x.beginPath(); x.arc(256, 124, 62, 0, Math.PI * 2); x.fill();
    x.fillStyle = '#ffd86a'; x.font = 'bold 92px serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('壇', 256, 128);
    return done(THREE, c, false);
  }
  /* a fu talisman: yellow paper, red brush strokes — a seal at the top, a
     column of strokes down it, and the command character the rite ends on */
  function makeTalisman(THREE, cnv, seed) {
    const [c, x] = sized(cnv, 128, 384), r = rng(seed);
    x.fillStyle = '#f1cf4a'; x.fillRect(0, 0, 128, 384);
    for (let i = 0; i < 300; i++) { x.fillStyle = `rgba(${r() < 0.5 ? '180,130,20' : '255,240,160'},${r() * 0.25})`; x.fillRect(r() * 128, r() * 384, 2, 2); }
    x.strokeStyle = '#c0141a'; x.lineCap = 'round'; x.lineJoin = 'round';
    x.lineWidth = 3; x.strokeRect(8, 8, 112, 368);
    x.fillStyle = '#c0141a'; x.font = 'bold 30px serif'; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.fillText(['勅', '令', '敕'][(seed | 0) % 3], 64, 34);
    x.lineWidth = 5;
    x.beginPath(); let py = 62; x.moveTo(64, py);
    for (let k = 0; k < 9; k++) { const nx = 30 + r() * 68, ny = py + 18 + r() * 14; x.quadraticCurveTo((nx + 64) / 2 + (r() - 0.5) * 30, (py + ny) / 2, nx, ny); py = ny; }
    x.stroke();
    x.lineWidth = 3;
    for (let k = 0; k < 6; k++) { const yy = 90 + k * 40; x.beginPath(); x.moveTo(22 + r() * 10, yy); x.lineTo(96 + r() * 10, yy + (r() - 0.5) * 8); x.stroke(); }
    x.beginPath(); x.arc(64, 330, 22, 0, Math.PI * 2); x.stroke();
    x.font = 'bold 26px serif'; x.fillText('令', 64, 331);
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
  /* an HDB block at night: sixteen storeys of sixteen bays, most windows dark,
     some lit warm or cool, and every floor's corridor lights on — the line of
     small cold lights that is an HDB block after dark */
  function makeHdbNight(THREE, cnv) {
    const S = 512, [c, x] = cnv(S), r = rng(2119);
    x.fillStyle = '#1e2129'; x.fillRect(0, 0, S, S);
    for (let f = 0; f < 16; f++) {
      const y = f * 32;
      x.fillStyle = '#292d36'; x.fillRect(0, y + 25, S, 7);
      for (let k = 0; k < 16; k++) {
        const v = r();
        x.fillStyle = v < 0.18 ? '#f2c878' : v < 0.27 ? '#d8eaff' : v < 0.32 ? '#ffe2a8' : '#12141a';
        x.fillRect(k * 32 + 6, y + 7, 20, 14);
      }
      x.fillStyle = 'rgba(222,236,255,0.9)'; for (let k = 0; k < 8; k++) x.fillRect(k * 64 + 29, y + 26, 6, 3);
    }
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
  /* a deity painting in a frame: a robed figure in a halo, generic, soft */
  function makeDeityPainting(THREE, cnv, robeA = '#1e5a3a', robeB = '#b8241a') {
    const [c, x] = sized(cnv, 256, 384);
    x.fillStyle = '#3a0c08'; x.fillRect(0, 0, 256, 384);
    const g = x.createLinearGradient(0, 20, 0, 364); g.addColorStop(0, '#d8b77a'); g.addColorStop(1, '#8a6a3a');
    x.fillStyle = g; x.fillRect(20, 20, 216, 344);
    x.fillStyle = 'rgba(255,230,150,0.55)'; x.beginPath(); x.arc(128, 120, 54, 0, Math.PI * 2); x.fill();
    x.fillStyle = robeA; x.beginPath(); x.moveTo(60, 352); x.quadraticCurveTo(128, 120, 196, 352); x.fill();   // the robe
    x.fillStyle = robeB; x.beginPath(); x.moveTo(96, 352); x.quadraticCurveTo(128, 190, 160, 352); x.fill();
    x.fillStyle = '#c8783a'; x.beginPath(); x.ellipse(128, 128, 26, 32, 0, 0, Math.PI * 2); x.fill();   // the face
    x.fillStyle = '#1a1210'; x.beginPath(); x.moveTo(104, 150); x.quadraticCurveTo(128, 230, 152, 150); x.fill();   // the long beard
    x.fillStyle = '#1a1210'; x.fillRect(100, 92, 56, 12);
    x.strokeStyle = '#d4a23e'; x.lineWidth = 6; x.strokeRect(14, 14, 228, 356);
    return done(THREE, c, false);
  }
  /* the assistant's board: today's consultations and numbers */
  function makeQueueBoard(THREE, cnv) {
    const [c, x] = sized(cnv, 384, 256);
    x.fillStyle = '#f4f2ea'; x.fillRect(0, 0, 384, 256);
    x.strokeStyle = '#8a1a10'; x.lineWidth = 8; x.strokeRect(4, 4, 376, 248);
    x.fillStyle = '#8a1a10'; x.font = 'bold 34px sans-serif'; x.textAlign = 'center'; x.fillText('今晚问事', 192, 48);
    x.fillStyle = '#2a2a2a'; x.font = 'bold 20px sans-serif'; x.fillText('CONSULTATION TONIGHT', 192, 78);
    x.font = '22px sans-serif'; x.textAlign = 'left';
    ['8:00 PM  — 11:00 PM', '号码  No.   12', '请勿拍照  No photos'].forEach((t, i) => x.fillText(t, 36, 126 + i * 40));
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
  /* the lorong's asphalt: dark, grained, a few repairs */
  function makeAsphalt(THREE, cnv) {
    const S = 256, [c, x] = cnv(S), r = rng(79);
    x.fillStyle = '#26262a'; x.fillRect(0, 0, S, S);
    for (let i = 0; i < 2600; i++) { const v = 20 + r() * 40; x.fillStyle = `rgba(${v},${v},${v + 4},${0.3 + r() * 0.4})`; x.fillRect(r() * S, r() * S, 1 + r() * 2, 1 + r() * 2); }
    for (let i = 0; i < 3; i++) { x.fillStyle = 'rgba(14,14,16,0.55)'; x.fillRect(r() * S, r() * S, 30 + r() * 60, 20 + r() * 40); }
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
  /* the shrine's name board: black lacquer, gold border, gold characters
     (an altar of fortune and virtue — the generic name such shrines carry) */
  function makeTempleSign(THREE, cnv) {
    const [c, x] = sized(cnv, 1024, 96);
    const g = x.createLinearGradient(0, 0, 0, 96); g.addColorStop(0, '#1c0e08'); g.addColorStop(1, '#0a0503');
    x.fillStyle = g; x.fillRect(0, 0, 1024, 96);
    x.strokeStyle = '#d4a23e'; x.lineWidth = 6; x.strokeRect(6, 6, 1012, 84);
    const gold = x.createLinearGradient(0, 14, 0, 84); gold.addColorStop(0, '#ffe6a0'); gold.addColorStop(0.5, '#d4a23e'); gold.addColorStop(1, '#a8761e');
    x.fillStyle = gold; x.textAlign = 'center'; x.textBaseline = 'middle'; x.font = 'bold 70px serif';
    x.fillText('福 德 壇', 512, 50);
    x.font = 'bold 22px serif'; x.fillText('有 求 必 應', 130, 50); x.fillText('神 光 普 照', 894, 50);
    return done(THREE, c, false);
  }
  /* a night bus's lit side: a strip of window bays, the cabin's white light,
     the seat backs and a few heads against it */
  function makeBusWindows(THREE, cnv) {
    const W = 1024, H = 96, [c, x] = sized(cnv, W, H), R = rng(14);
    x.fillStyle = '#16181c'; x.fillRect(0, 0, W, H);
    const bays = 9, bw = W / bays;
    for (let i = 0; i < bays; i++) {
      const x0 = i * bw + 5, w = bw - 10;
      const g = x.createLinearGradient(0, 6, 0, H - 6); g.addColorStop(0, '#fbf6e2'); g.addColorStop(1, '#e8dfc2');
      x.fillStyle = g; x.fillRect(x0, 6, w, H - 12);
      x.fillStyle = 'rgba(70,90,120,0.55)';                                     // the seat backs
      for (let s = 0; s < 2; s++) x.fillRect(x0 + 8 + s * w * 0.5, H * 0.58, w * 0.36, H * 0.4);
      if (R() < 0.45) {                                                          // a passenger
        const hx = x0 + w * (0.2 + 0.6 * R());
        x.fillStyle = '#2a2420'; x.beginPath(); x.ellipse(hx, H * 0.5, 9, 11, 0, 0, Math.PI * 2); x.fill();
        x.fillRect(hx - 15, H * 0.62, 30, H * 0.4);
      }
    }
    return done(THREE, c, false);
  }
  /* a day bus's side (VF-1: the morning's bus went by with one flat dark band for windows): tinted bays in black
     rubber, the sky caught along their tops, the seat backs and a few heads just showing through, a glint */
  function makeBusWindowsDay(THREE, cnv) {
    const W = 1024, H = 96, [c, x] = sized(cnv, W, H), R = rng(15);
    x.fillStyle = '#0c0e10'; x.fillRect(0, 0, W, H);
    const bays = 9, bw = W / bays;
    for (let i = 0; i < bays; i++) {
      const x0 = i * bw + 6, w = bw - 12;
      const g = x.createLinearGradient(0, 6, 0, H - 6); g.addColorStop(0, '#7d93a3'); g.addColorStop(0.32, '#34434e'); g.addColorStop(1, '#1b242b');
      x.fillStyle = g; x.fillRect(x0, 6, w, H - 12);
      x.fillStyle = 'rgba(10,14,18,0.6)';                                        // the seat backs
      for (let s = 0; s < 2; s++) x.fillRect(x0 + 8 + s * w * 0.5, H * 0.6, w * 0.36, H * 0.38);
      if (R() < 0.4) {                                                           // a passenger
        const hx = x0 + w * (0.2 + 0.6 * R());
        x.fillStyle = 'rgba(8,10,12,0.72)'; x.beginPath(); x.ellipse(hx, H * 0.52, 9, 11, 0, 0, Math.PI * 2); x.fill();
        x.fillRect(hx - 15, H * 0.64, 30, H * 0.36);
      }
      const gl = x.createLinearGradient(x0, 6, x0 + w, H - 6);                   // the glint across the glass
      gl.addColorStop(0.28, 'rgba(255,255,255,0)'); gl.addColorStop(0.4, 'rgba(255,255,255,0.12)'); gl.addColorStop(0.5, 'rgba(255,255,255,0)');
      x.fillStyle = gl; x.fillRect(x0, 6, w, H - 12);
    }
    return done(THREE, c, false);
  }
  /* the plate on its back (VC-6: the bus left the frame as a plain box) */
  function makeBusPlate(THREE, cnv) {
    const [c, x] = sized(cnv, 256, 64);
    x.fillStyle = '#f4f2ea'; x.fillRect(0, 0, 256, 64);
    x.strokeStyle = '#1a1a1a'; x.lineWidth = 4; x.strokeRect(3, 3, 250, 58);
    x.fillStyle = '#141414'; x.font = 'bold 40px monospace'; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.fillText('SBS 8462D', 128, 34);
    return done(THREE, c, false);
  }
  function makeBusSign(THREE, cnv) {
    const [c, x] = sized(cnv, 512, 84);
    x.fillStyle = '#0c0a08'; x.fillRect(0, 0, 512, 84);
    x.fillStyle = '#ffb028'; x.font = 'bold 56px monospace'; x.textBaseline = 'middle';
    x.textAlign = 'left'; x.fillText('14', 26, 44);
    x.font = 'bold 40px monospace'; x.textAlign = 'right'; x.fillText('BEDOK INT', 490, 44);
    return done(THREE, c, false);
  }
  /* the talisman water: grey, with the burnt paper's ash floating in it */
  function makeAshWater(THREE, cnv) {
    const S = 128, [c, x] = cnv(S), R = rng(31);
    const g = x.createRadialGradient(64, 64, 4, 64, 64, 64); g.addColorStop(0, '#8a857a'); g.addColorStop(1, '#5e5a52');
    x.fillStyle = g; x.fillRect(0, 0, S, S);
    for (let i = 0; i < 70; i++) {
      x.fillStyle = `rgba(${20 + R() * 30},${18 + R() * 25},${16 + R() * 20},${0.5 + R() * 0.5})`;
      x.beginPath(); x.ellipse(16 + R() * 96, 16 + R() * 96, 1 + R() * 4, 0.6 + R() * 2.5, R() * 3, 0, Math.PI * 2); x.fill();
    }
    x.fillStyle = 'rgba(180,40,20,0.5)'; for (let i = 0; i < 6; i++) x.fillRect(30 + R() * 60, 30 + R() * 60, 2 + R() * 3, 1 + R() * 2);   // a few red flecks of the paper's ink
    return done(THREE, c, false);
  }
  /* THE FILM'S SKY, painted onto a dome's inside (SphereGeometry's UVs: u
     round the horizon — u 0.75 is straight down -z, where the shots look —
     and v from the zenith at the top of the sheet to the horizon at its
     middle). Golden Mile Complex's morning: a clear blue, paler to the
     horizon, white cumulus. */
  function makeMorningSky(THREE, cnv) {
    const W = 2048, H = 1024, [c, x] = sized(cnv, W, H), R = rng(43);
    const g = x.createLinearGradient(0, 0, 0, H * 0.877);
    g.addColorStop(0.0, '#2a5aac'); g.addColorStop(0.45, '#4f86cc'); g.addColorStop(0.8, '#9cc0e4'); g.addColorStop(1.0, '#d6e4ee');
    x.fillStyle = g; x.fillRect(0, 0, W, H);
    for (let i = 0; i < 22; i++) {
      const cx = R() * W, cy = H * (0.36 + R() * 0.3), n = 5 + (R() * 6 | 0), base = 30 + R() * 60;
      for (let k = 0; k < n; k++) {
        const px = cx + (R() - 0.5) * base * 2.4, py = cy + (R() - 0.5) * base * 0.5, r = base * (0.5 + R() * 0.6);
        const cg = x.createRadialGradient(px, py - r * 0.2, 2, px, py, r);
        cg.addColorStop(0, 'rgba(255,255,255,0.92)'); cg.addColorStop(0.6, 'rgba(240,244,250,0.6)'); cg.addColorStop(1, 'rgba(230,238,248,0)');
        x.fillStyle = cg; x.beginPath(); x.arc(px, py, r, 0, Math.PI * 2); x.fill();
      }
    }
    return done(THREE, c, false);
  }
  /* one floor of the old mall's front: a row of shops, each a sign over its
     window — Thai and English, faded colours of the seventies, lit */
  function makeMallFront(THREE, cnv, floor) {
    const W = 2048, H = 160, [c, x] = sized(cnv, W, H), R = rng(50 + floor);
    const SHOPS = [
      ['#c8241a', '#fff2c0', 'THAI SUPERMARKET', 'ซุปเปอร์มาร์เก็ต'], ['#f2c12e', '#2a1a10', 'THAI FOOD', 'ร้านอาหารไทย'],
      ['#2a7a3a', '#fff6d8', 'MASSAGE', 'นวดแผนไทย'], ['#1e4a8a', '#ffffff', 'TRAVEL & TOURS', 'บริษัททัวร์'],
      ['#7a1a1a', '#ffd870', 'AMULETS', 'พระเครื่อง'], ['#8a2a8a', '#fff0ff', 'KARAOKE', 'คาราโอเกะ'],
      ['#e8e0c8', '#a8201a', 'MONEY CHANGER', 'แลกเงิน'], ['#d8641a', '#fff6e0', 'BUS TICKETS', 'ตั๋วรถทัวร์'],
      ['#3a3a3a', '#f8d870', 'GOLDSMITH', 'ร้านทอง'], ['#1a6a7a', '#ffffff', 'PHONES', 'โทรศัพท์']];
    x.fillStyle = '#8a8478'; x.fillRect(0, 0, W, H);
    const n = 10, sw = W / n;
    for (let i = 0; i < n; i++) {
      const [bg, fg, en, th] = SHOPS[(i * 3 + floor * 4) % SHOPS.length], x0 = i * sw;
      x.fillStyle = bg; x.fillRect(x0 + 4, 4, sw - 8, H * 0.36);
      x.fillStyle = fg; x.textAlign = 'center'; x.textBaseline = 'middle';
      const fit = (t, px) => { let z = px; x.font = `bold ${z}px sans-serif`; while (z > 10 && x.measureText(t).width > sw - 22) { z--; x.font = `bold ${z}px sans-serif`; } };
      fit(en, 24); x.fillText(en, x0 + sw / 2, H * 0.12);
      fit(th, 24); x.fillText(th, x0 + sw / 2, H * 0.27);
      const lit = R() < 0.75;
      const wg = x.createLinearGradient(0, H * 0.4, 0, H); wg.addColorStop(0, lit ? '#f4e2b0' : '#3a3c40'); wg.addColorStop(1, lit ? '#d8b878' : '#2a2c30');
      x.fillStyle = wg; x.fillRect(x0 + 6, H * 0.4, sw - 12, H * 0.6 - 4);
      if (lit) { x.fillStyle = 'rgba(60,40,30,0.35)'; for (let k = 0; k < 4; k++) x.fillRect(x0 + 14 + k * (sw - 28) / 4, H * 0.58, (sw - 28) / 5, H * 0.3); }
      else { x.fillStyle = 'rgba(80,82,86,0.6)'; for (let k = 0; k < 9; k++) x.fillRect(x0 + 6, H * 0.42 + k * 9, sw - 12, 3); }
      x.fillStyle = '#5a5650'; x.fillRect(x0, 0, 4, H);
    }
    return done(THREE, c, false);
  }
  /* the slab tower's long face: bands of windows and balconies, the
     concrete weathered, curtains, an air-conditioner or a pot here and there */
  function makeTowerFace(THREE, cnv) {
    const W = 1024, H = 1024, [c, x] = sized(cnv, W, H), R = rng(61);
    x.fillStyle = '#b8b0a2'; x.fillRect(0, 0, W, H);
    const rows = 8, cols = 10, rh = H / rows, cw = W / cols;
    for (let r = 0; r < rows; r++) for (let k = 0; k < cols; k++) {
      const x0 = k * cw, y0 = r * rh;
      x.fillStyle = ['#2a3036', '#3a3a34', '#454036', '#34383c'][(R() * 4) | 0]; x.fillRect(x0 + 10, y0 + 18, cw - 20, rh * 0.52);
      if (R() < 0.5) { x.fillStyle = ['#c8b48a', '#9ab0b8', '#c89a8a', '#e8dcc0'][(R() * 4) | 0]; x.fillRect(x0 + 12, y0 + 20, (cw - 24) * (0.3 + R() * 0.4), rh * 0.48); }
      x.fillStyle = '#d0c8b8'; x.fillRect(x0 + 4, y0 + rh * 0.72, cw - 8, 10);                             // the balcony ledge
      x.fillStyle = '#5a5650'; for (let b = 0; b < 8; b++) x.fillRect(x0 + 8 + b * (cw - 16) / 8, y0 + rh * 0.6, 2, rh * 0.12);
      if (R() < 0.25) { x.fillStyle = '#e8e6e0'; x.fillRect(x0 + cw * 0.6, y0 + rh * 0.55, 26, 18); }      // an air-conditioner
    }
    x.globalAlpha = 0.25; for (let i = 0; i < 160; i++) { x.fillStyle = R() < 0.5 ? '#7a7264' : '#8a8274'; x.fillRect(R() * W, R() * H, 2 + R() * 6, 20 + R() * 80); } x.globalAlpha = 1;   // weather streaks
    return done(THREE, c, false);
  }
  /* v21.2: GOLDEN MILE COMPLEX over its podium (Chad names the mall: the real
     building on Beach Road, "Little Thailand"), bronze capitals with a dark
     edge so they read on the board from across the road, and its Chinese name
     under them; a gilt rule round the board */
  function makeGMCName(THREE, cnv) {
    const [c, x] = sized(cnv, 2048, 500);
    x.clearRect(0, 0, 2048, 500);
    x.strokeStyle = '#b08a46'; x.lineWidth = 6; x.strokeRect(22, 22, 2004, 456);
    const gold = (y0, y1) => { const g = x.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, '#f6dc9a'); g.addColorStop(0.5, '#d4a24c'); g.addColorStop(1, '#9a6a26'); return g; };
    x.textAlign = 'center'; x.textBaseline = 'middle'; x.lineJoin = 'round'; x.strokeStyle = '#1c130c';
    x.font = 'bold 150px sans-serif'; x.lineWidth = 10;
    x.strokeText('GOLDEN MILE COMPLEX', 1024, 160, 1880); x.fillStyle = gold(100, 222); x.fillText('GOLDEN MILE COMPLEX', 1024, 160, 1880);
    x.font = 'bold 170px serif';
    x.strokeText('黄金大厦', 1024, 362); x.fillStyle = gold(280, 446); x.fillText('黄金大厦', 1024, 362);
    return done(THREE, c, false);
  }
  /* v21.2: the glass behind one of Golden Mile Complex's terraces, 23 m of it:
     sliding doors and windows in dark aluminium frames between cream piers,
     curtains drawn half across some, a laundry pole out over the terrace in
     others, the concrete above stained. `v` deals a second floor that does not
     match the one above it. */
  function makeGMCGlass(THREE, cnv, v) {
    /* (darker than the first pass: from the street the eye reads this building by its bands — a light parapet over
       the dark recess of each floor — and pale piers and curtains made the recesses as light as the parapets) */
    const W = 1024, H = 136, [c, x] = sized(cnv, W, H), R = rng(91 + v * 17);
    x.fillStyle = '#8e8676'; x.fillRect(0, 0, W, H);
    x.fillStyle = '#6e675a'; x.fillRect(0, 0, W, 10);                      // the slab's shadowed edge over the glass
    const bays = 8, bw = W / bays;
    for (let b = 0; b < bays; b++) {
      const x0 = b * bw + 4, w = bw - 8;
      const gl = x.createLinearGradient(0, 10, 0, H); gl.addColorStop(0, '#2e3a42'); gl.addColorStop(0.5, '#1c252c'); gl.addColorStop(1, '#141a1f');
      x.fillStyle = gl; x.fillRect(x0, 10, w, H - 14);
      // a pale reflection of the morning across the top of the glass
      x.fillStyle = 'rgba(190,214,232,0.14)'; x.fillRect(x0, 10, w, 16);
      if (R() < 0.4) { x.fillStyle = ['#7a6e5c', '#5e6a72', '#6e5a4c', '#8a8070', '#56604e'][(R() * 5) | 0]; x.fillRect(x0 + (R() < 0.5 ? 0 : w * 0.45), 12, w * (0.35 + R() * 0.2), H - 18); }   // a curtain half across, seen through the glass
      x.fillStyle = '#5e5e5a'; for (let k = 1; k < 4; k++) x.fillRect(x0 + k * w / 4 - 1, 10, 3, H - 14);   // the frames
      x.fillRect(x0, 10, w, 3); x.fillRect(x0, H - 6, w, 3);
      if (R() < 0.3) {                                                         // a laundry pole with the washing out
        x.fillStyle = '#b0b0aa'; x.fillRect(x0 + 4, 30, w - 8, 3);
        for (let k = 0; k < 5; k++) { x.fillStyle = ['#f0f0ea', '#4a6a9a', '#c84a3a', '#e8d080', '#6a8a5a'][(R() * 5) | 0]; x.fillRect(x0 + 10 + k * (w - 24) / 5, 33, (w - 30) / 6, 26 + R() * 18); }
      }
    }
    x.globalAlpha = 0.18; for (let i = 0; i < 60; i++) { x.fillStyle = R() < 0.5 ? '#4a4438' : '#6a6252'; x.fillRect(R() * W, 0, 2 + R() * 4, 6 + R() * 16); } x.globalAlpha = 1;   // the stain under each slab edge
    return done(THREE, c, false);
  }
  /* v21.2: a terrace parapet's face, 8 m of it — the weathered cream concrete
     of the real building: a lit coping along the top with its drip line under
     it, the rain's grey streaks running down from that, and a damp band along
     the foot. Without it every parapet was one flat cream stripe. */
  function makeGMCParapet(THREE, cnv) {
    const W = 512, H = 96, [c, x] = sized(cnv, W, H), R = rng(57);
    x.fillStyle = '#d2c8b2'; x.fillRect(0, 0, W, H);
    x.globalAlpha = 0.12; for (let i = 0; i < 900; i++) { x.fillStyle = R() < 0.5 ? '#8a826e' : '#f0e8d6'; x.fillRect(R() * W, R() * H, 1 + R() * 3, 1 + R() * 3); } x.globalAlpha = 1;   // the aggregate
    for (let i = 0; i < 28; i++) {                                             // the streaks
      const sx = R() * W, len = H * (0.3 + R() * 0.7), g = x.createLinearGradient(0, 8, 0, 8 + len);
      g.addColorStop(0, 'rgba(88,80,64,0.45)'); g.addColorStop(1, 'rgba(88,80,64,0)');
      x.fillStyle = g; x.fillRect(sx, 8, 2 + R() * 8, len);
    }
    x.fillStyle = '#eee6d2'; x.fillRect(0, 0, W, 6);                          // the coping, lit from above
    x.fillStyle = 'rgba(64,58,46,0.4)'; x.fillRect(0, 6, W, 3);               // its drip line
    const d = x.createLinearGradient(0, H - 20, 0, H); d.addColorStop(0, 'rgba(80,74,60,0)'); d.addColorStop(1, 'rgba(80,74,60,0.45)');
    x.fillStyle = d; x.fillRect(0, H - 20, W, 20);                             // damp along the foot
    return done(THREE, c, false);
  }

  (window.__CHAPTERS__ = window.__CHAPTERS__ || {}).e3c3 = Object.assign(DATA, {
    build,
    intro,
    scenes: [scAccept, scWrong, scLeave, scSeek],
    films: { trance: tranceFilm, roar: roarFilm }
  });
})();
