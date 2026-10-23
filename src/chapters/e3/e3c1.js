/* Episode 3 · Chapter 1 · "The Luck I Went Looking For"
   ---------------------------------------------------------------------------
   THE FIRST CHAPTER OF CASE FILE 3, "How It All Began" — S1·06 "How It All
   Began · Part One", kept SHORT at Chad's word: the natural step after NS,
   and then straight on. After National Service he got a job (software), then
   a side business (in-car cameras) that grew until he left engineering to
   run it, and like every businessman he wanted it to do better — which led
   him to amulets, to blessings, and to a temple in Thailand at five in the
   morning for something more permanent: his first Sak Yant.

   THE EPISODE'S AXIS IS CONTROL, and this is the chapter of ASKING: the one
   time he reaches for the unseen entirely on purpose and is fully in charge
   of it. The one thing that must happen: THE FIRST STIRRING. As the last line
   of the yant is struck, it WARMS. Nothing more. (Chapter 2 is when his hands
   move on their own.)

   PLAY is the wat at dawn, in order: buy the offering set at the stall, take
   your shoes off at the steps, pay respect at the altar, present the offering
   to the MONK on the dais and kneel for his blessing (v16.1), then walk the
   covered walkway to the PRIVATE ROOM where the Ajarn works (v16.1: Chad,
   "Sakyants performed by ajarns are typically done in a private room ... and
   definitely not at the temple area where monks sit"), wait your turn, sit
   with your back to him, and hold still through the rod (a heartbeat event
   whose tick is the rod's own tap — the one engine seam). THE AJARN IS THE
   PILE: when the yant is done he asks what you ask of it, and the decision
   opens by itself.

   The four options are the plan's (docs/V16.0-E3C1-PLAN.md §3.3): luck,
   protection, the strongest, and "what does it ask of me?". The Ajarn answers
   all four; then he wais, puts his shoes on, and walks out into the sunrise.

   Built against the contract every chapter shares:
   build(ctx) -> stage, scenes[i](c, s, api), intro(c, s, api).

   ENGINE SEAMS TOUCHED: the heartbeat's `tick` may name a sound; a stage may
   name its own footstep (`stepSound`, barefoot on the sala's floor); his
   voice is the ADULT set (ADULT_TAKES), on his bus; and (v16.1) the door into
   the private room is a scene change warmed under the black (`kit.warm`).
   docs/V16.1-THE-PRIVATE-ROOM.md is the revision's memory.                */

(() => {
  'use strict';

  let S = null;

  const DATA = {
    id: 1,
    episode: 3,
    title: 'The Luck I Went Looking For',
    cardLabel: 'Chapter 1',
    cardTitle: 'The Luck I Went Looking For',
    brief: 'A temple in Thailand, before the sun is up. Buy a Sangkathan set, take off your shoes, pay your respects, receive the monk\'s blessing, and find the Ajarn in his private room.',
    prompt: 'The yant is finished, and it is warm on your back. The Ajarn has put his hand on it. He is waiting for an answer.',
    choices: [
      { k: 'A', text: '"Luck. For my business."',
        d: { sanity: 12, awareness: 15, wisdom: 18 }, verdict: 'good',
        say: 'I asked for luck. He told me what it would cost.',
        teach: 'Luck is a fine reason to begin. It is a poor reason to stay.' },
      { k: 'B', text: '"Protection. From whatever\'s out there."',
        d: { sanity: -6, awareness: 9, wisdom: -12 }, verdict: 'bad',
        say: 'I asked for protection. He pointed at my own chest.',
        teach: 'Protection from outside begins with what you carry inside.' },
      { k: 'C', text: '"Next time, give me the strongest one you have."',
        d: { sanity: -15, awareness: -9, wisdom: -27 }, verdict: 'worst', critical: true,
        say: 'I asked for more. He showed me I hadn\'t understood the first.',
        teach: 'Wanting the strongest is wanting a power you have not yet earned the understanding of.' },
      { k: 'D', text: '"What does it ask of me?"',
        d: { sanity: 18, awareness: 24, wisdom: 30 }, verdict: 'best',
        say: 'I asked what it wanted from me. That was the right question.',
        teach: 'Before you ask what a practice will give you, ask what it will ask of you.' }
    ],
    core: 'Almost nobody arrives at a spiritual path by deciding to. There is no shame in starting from self-interest; that is where most of us start. What matters is what you do once the path opens.',

    /* units metres, y up; -z is NORTH. THE WAT: the gate in the south wall
       (z 15), the courtyard, the offering stall on the west side, the bodhi
       tree and the spirit house on the east, the ubosot's long white flank
       across the east wall, and the SALA at the north end (x -7…7,
       z -11…-1.6) with the altar against its back wall and the MONK's dais
       in its north-east corner (v16.1; it was the Ajarn's). A covered
       walkway leaves the sala's west side for the kuti against the west wall,
       whose door is the way into the PRIVATE ROOM — a pocket at x -250 (see
       ROOM in build()). The spawn is just inside the gate, looking up the
       courtyard at the sala's gables. */
    spawn:     { x: 0, y: 1.62, z: 12.4, rot: 0 },
    shrine:    { x: 4.1, z: -10.2 },         // the engine's anchor: the monk's dais (v16.9: on the temple's east wall)
    ghostHome: { x: 4.1, z: -10.2 },         // unused (ghost: null)
    /* minX reaches the room (v16.1). In the wat the west compound wall at
       x -15 still stops the player, a metre past the old bound of -13.6. */
    bounds:    { minX: -262, maxX: 9.8, minZ: -22.9, maxZ: 13.8 },     // v16.9: round the temple to the moved north wall

    /* NO HAUNTING (the eleventh leak, v4.3). This is the chapter where he
       goes looking, and nothing comes looking for him — yet. */
    ghost: null,

    /* DAWN. The sun is just up in the south-east, behind the gate, so the
       courtyard is long gold shadows and the sala's gables catch the first
       light; the sky runs peach at the horizon to a clean blue overhead. */
    /* v16.4: the sun LOWER and warmer (14 degrees, not 21), the fill and the
       sky's bounce cut, so the dawn has long gold shadows instead of the flat
       midday it photographed as; a pinker horizon and a warm haze. */
    daylight: {
      stops: [[0.00, '#f6b58a'], [0.08, '#f4c49c'], [0.22, '#e6cdb6'],
              [0.50, '#a8bfd6'], [1.00, '#6690c2']],
      bg: 0xefc6a0,
      fog: [0xefcdab, 0.0085],
      hemi: [0xffd9b8, 0x6c5a48, 0.82],
      key: [0xffb46e, 2.05, 16, 6.5, 18],
      fill: [0xaec4e0, 0.30],
      stars: 0, moon: 0,
      sun: 1.0, clouds: 0.5,
      vmHemi: [0xfff0dc, 0x94836e, 0.95],
      vmKey: [0xffd8a8, 0.85]
    },

    /* the stand-in cast (docs/E3-MODELS.md: Chad is finding the real ones):
       the Ajarn is the admin tee in a white shirt, seated; the MONK (v16.1)
       is the botak recruit in saffron, seated; the stall auntie
       (v17.4) is the pink-shirt woman from the tang-ki's audience, seated,
       talking on the monk's take retargeted onto her; the man under the
       needle (v18.7) is Chad's Sak Yant customer, and the Ajarn Chad's Ajahn
       Krukai; the man by the walkway is the standing
       man; the
       amulet in the film is episode 1's Phiboon (the auntie gave it to him
       when he was a boy, a callback nobody has to notice). */
    /* v17.6: the three Sak Yant the Ajarn offers — one of them goes on his
       back at the stirring (the engine prepares an item's model at the
       curtain; these have none, they are drawings, but they are declared) */
    items: ['yantgaoyord', 'yanthahtaew', 'yantsroi'],
    assets: ['customer', 'sitwoman', 'sitwomantalk', 'standman', 'phiboon', 'tree1', 'tree2', 'tree3', 'tree4', 'thaikit', 'wessred', 'wessgreen', 'naga', 'monk', 'ajarn', 'temple', 'slipper', 'lersimask', 'altarrow', 'buddhahd', 'buddhalod', 'sangkathan',
             'filmoffice', 'filmlaptop', 'actioncam', 'planecabin', 'sitman', 'sitshout', 'sitclap', 'sitangry'],   // v19.0: the film's four models, and the plane's passengers

    /* THE SOUND. `watamb` is the dawn temple (birds, a far road, a broom on
       stone, wind chimes); `e3chant` is the monks' morning chanting from the
       ubosot, louder toward the east wall; `e3wait` is the only music in
       play, and it only comes up under the waiting and the rod. `mixBeds()`
       writes all three every frame. */
    musicVol: 0,
    ambience: { beds: [['watamb', 0.34], ['e3chant', 0.0], ['e3wait', 0.0], ['roomamb', 0.0]] },
    voiceLine: 'z1arrive',

    words: {
      approach: '',
      act: 'E to act',
      actTouch: 'Tap to act',
      interact: 'E to answer the Ajarn',
      interactTouch: 'Tap to answer the Ajarn',
      actLine: 'Press E to answer the Ajarn',          // v18.5: Step back's hint (the fallback named chapter 1's pile of notes)
      actLineTouch: 'Tap to answer the Ajarn',
      objStall: 'Buy a Sangkathan set at the stall',
      objShoes: 'Take off your shoes at the steps',
      objWai: 'Pay your respects at the altar',
      objPresent: 'Present your offering to the monk',
      objBless: 'Kneel before the monk for his blessing',
      objGo: 'Go to the private room at the end of the walkway',
      objWait: 'Sit on the mat and wait your turn',
      objSeat: 'Sit with your back to the Ajarn',
      objStill: 'Hold still',
      hotStall: 'Buy a Sangkathan set',
      hotShoes: 'Take off your shoes',
      hotWai: 'Kneel and wai',
      hotPresent: 'Present your offering',
      hotBless: 'Kneel for the blessing',
      hotDoor: 'Open the door',
      noShoes: 'Shoes off before the sala.',
      evYant: 'Hold still',
      evYantBrief: 'The Ajarn works with a long steel rod, one strike at a time. Breathe out as each strike lands — tap on the strike. A flinch costs you.',
      /* v17.6: the choice of design */
      yantLabel: 'Choose your Sak Yant',
      yantTitle: 'Which design will the Ajarn give you?',
      yantConfirm: 'Receive this yant',
      yantSub: 'Inked on your back · worn in your Sak Yant slot',
      /* v17.7: said once on the window, not in each design's words */
      yantHint: 'A Sak Yant is for life and cannot be taken off. Pick one, then confirm.',
      /* v21.31: the chants' captions (Chad: "subtitles with original pali words and the translated meaning, the same way
         it is done in episode 3 chapter 3"), each Pali line over what it means. The monk's blessing and the Ajarn's
         homage are the chanting guide's Pali; the Itipiso is Chad's own (v19.9), in his three lines; every English line
         is Thanissaro Bhikkhu's, A Chanting Guide (dhammatalks.org), as e3c3's last two lines are */
      bless1: 'Sabbītiyo vivajjantu',
      bless1en: 'May all distresses be averted.',
      bless2: 'Sabba-rogo vinassatu',
      bless2en: 'May every disease be destroyed.',
      bless3: 'Mā te bhavatvantarāyo',
      bless3en: 'May there be no dangers for you.',
      bless4: 'Sukhī dīgh’āyuko bhava.',
      bless4en: 'May you be happy & live long.',
      iti1: 'Iti pi so bhagavā arahaṁ sammā-sambuddho,',
      iti1en: 'He is a Blessed One, a Worthy One, a Rightly Self-awakened One,',
      iti2: 'Vijjā-caraṇa-sampanno sugato lokavidū,',
      iti2en: 'consummate in knowledge & conduct, one who has gone the good way, knower of the cosmos,',
      iti3: 'Anuttaro purisa-damma-sārathi satthā deva-manussānaṁ buddho bhagavā \'ti.',
      iti3en: 'unexcelled trainer of those who can be taught, teacher of human & divine beings; awakened; blessed.',
      namo: 'Namo tassa bhagavato arahato sammā-sambuddhassa.',
      namoen: 'Homage to the Blessed One, the Worthy One, the Rightly Self-awakened One.'
    },
    sayPrefix: 'z1'
  };

  /* the measured length of every line said OUTSIDE a cutscene (CP6 fills
     the real numbers; chaptertest fails a line spoken with none) */
  /* v16.9 · THE TEMPLE'S COLLISION, derived from its mesh (masters/v16.9/
     blockgrid.mjs over assets/temple.glb): a 10 cm grid over its floor, a
     cell solid where the temple is within 0.2 m of it at knee or chest height
     or less than 2.3 m over it, merged into [x0, z0, x1, z1] rectangles in
     world metres. Rebuild it whenever the temple file changes. */
  const TEMPLE_BLOCK = [
    [-2.8,-18.1,-2.4,-15.7],[2.6,-18.1,2.9,-15.7],[2.5,-18,2.6,-15.7],[2.9,-18,3,-15.7],[-2.9,-17.9,-2.8,-15.7],[-2.4,-17.9,-2.3,-15.7],
    [3,-17.9,3.1,-15.7],[-3,-17.8,-2.9,-15.7],[-2.3,-17.8,-2.2,-15.7],[2.4,-17.8,2.5,-15.7],[3.1,-17.8,3.2,-15.7],[-2.2,-17.7,-2.1,-15.6],
    [2.3,-17.7,2.4,-15.6],[-3.1,-17.6,-3,-15.7],[3.2,-17.5,3.3,-15.7],[-6.3,-16.3,-5.8,-9],[-4.5,-16.3,-3.9,-15.5],[-2.1,-16.3,-1.5,-15.5],
    [1.7,-16.3,2.3,-15.5],[4.1,-16.3,4.6,-15.5],[5.9,-16.3,6.4,-15.5],[-6.4,-16.2,-6.3,-15.6],[-5.8,-16.2,-4.5,-15.7],[-3.9,-16.2,-3.1,-15.7],
    [-1.5,-16.2,-1.4,-15.6],[1.6,-16.2,1.7,-15.6],[3.3,-16.2,4.1,-15.7],[4.6,-16.2,5.9,-15.7],[6.4,-16.2,6.5,-15.6],[-6.5,-16.1,-6.4,-15.7],
    [6.5,-16.1,6.6,-15.8],[-1.4,-16,-1.3,-15.8],[1.5,-15.9,1.6,-15.8],[-5.8,-15.7,-5.7,-15.6],[-4.6,-15.7,-4.5,-15.6],[-3.9,-15.7,-3.8,-15.6],
    [4,-15.7,4.1,-15.6],[4.6,-15.7,4.7,-15.6],[5.8,-15.7,5.9,-0.9],[-2,-15.5,-1.6,-15.4],[1.9,-15.5,2.2,-15.4],[5.9,-15.5,6.3,-0.9],
    [-1.3,-15.2,-0.7,-13.9],[0.9,-15.2,1.4,-13.9],[-3.9,-15.1,-2.1,-14.9],[-1.5,-15.1,-1.3,-14.7],[-0.7,-15.1,-0.6,-13.9],[0.7,-15.1,0.9,-14.7],
    [1.4,-15.1,1.6,-14.7],[2.3,-15.1,4.1,-14.9],[-0.6,-15,-0.5,-14.8],[-1.4,-14.7,-1.3,-13.9],[0.8,-14.7,0.9,-13.9],[1.4,-14.7,1.5,-13.9],
    [-5.8,-14.6,-1.4,-13.9],[1.5,-14.6,5.6,-13.9],[0.7,-14.5,0.8,-14],[5.6,-14.5,5.7,-2.4],[-0.6,-14.4,-0.5,-14.1],[-5.8,-13.9,-5.2,-9],
    [5,-13.9,5.6,-2.3],[5.7,-13.1,5.8,-10.9],[5.7,-9.5,5.8,-7.4],[-6,-9,-5.9,-8.9],[-5.5,-9,-5.4,-8.9],[-6.2,-7.9,-5.9,-0.9],[-5.5,-7.9,-5.4,-2.3],
    [-5.9,-7.8,-5.5,-2.3],[-5.4,-7.8,-5.2,-2.3],[-6.3,-7.6,-6.2,-0.9],[5.7,-5.9,5.8,-3.7],[-5.2,-3,-0.7,-2.3],[0.9,-3,5,-2.3],[-0.7,-2.9,-0.6,-2.1],
    [0.7,-2.9,0.9,-2.2],[-0.6,-2.8,-0.5,-2.3],[-5.9,-2.3,-5.8,-0.9],[-3.9,-2.3,-2.1,-2.1],[-1.5,-2.3,-0.7,-2.2],[0.9,-2.3,1.6,-2.2],
    [2.3,-2.3,4.1,-2.1],[-1.4,-2.2,-0.7,-2.1],[0.8,-2.2,1.5,-2.1],[-1.9,-1.8,-1.7,-0.8],[1.9,-1.8,2.1,-0.8],[-4.5,-1.7,-4,-0.9],[-2.1,-1.7,-1.9,-0.9],
    [-1.7,-1.7,-1.5,-0.9],[1.7,-1.7,1.9,-0.9],[2.1,-1.7,2.3,-0.9],[4.1,-1.7,4.6,-0.9],[6.3,-1.7,6.4,-0.9],[-6.4,-1.6,-6.3,-1],[-5.8,-1.6,-5.7,-0.9],
    [-4.6,-1.6,-4.5,-1],[-4,-1.6,-3.9,-0.9],[-2.2,-1.6,-2.1,0],[-1.5,-1.6,-1.4,-1],[1.6,-1.6,1.7,-1],[2.3,-1.6,2.4,-1],[4,-1.6,4.1,-1],
    [4.6,-1.6,4.7,-0.9],[6.4,-1.6,6.5,-1],[-5.7,-1.5,-5.5,-1],[-5.4,-1.5,-5.2,-1],[-5.1,-1.5,-4.9,-1],[-4.7,-1.5,-4.6,-1],[-3.9,-1.5,-3.7,-1],
    [-3.5,-1.5,-3.4,-1],[-3.2,-1.5,-3.1,-1],[-2.9,-1.5,-2.8,-1],[-2.6,-1.5,-2.5,-1],[-2.3,-1.5,-2.2,0],[2.5,-1.5,2.6,-1],[2.8,-1.5,2.9,-1],
    [3.1,-1.5,3.2,-1],[3.4,-1.5,3.5,-1],[3.7,-1.5,3.8,-1],[3.9,-1.5,4,-1],[4.7,-1.5,4.8,-1],[4.9,-1.5,5.1,-1],[5.2,-1.5,5.4,-1],[5.5,-1.5,5.8,-1],
    [-6.5,-1.4,-6.4,-1.1],[-5.5,-1.4,-5.4,-1],[-5.2,-1.4,-5.1,-1],[-4.9,-1.4,-4.7,-1],[-3.7,-1.4,-3.5,-1],[-3.4,-1.4,-3.2,-1],[-3.1,-1.4,-2.9,-1],
    [-2.8,-1.4,-2.6,-1],[-2.5,-1.4,-2.3,0],[-1.4,-1.4,-1.3,-1.2],[1.5,-1.4,1.6,-1.2],[2.4,-1.4,2.5,-1],[2.6,-1.4,2.8,-1],[2.9,-1.4,3.1,-1],
    [3.2,-1.4,3.4,-1],[3.5,-1.4,3.7,-1],[3.8,-1.4,3.9,-1],[4.8,-1.4,4.9,-1],[5.1,-1.4,5.2,-1],[5.4,-1.4,5.5,-1],[6.5,-1.4,6.6,-1.1],
    [-6.1,-0.9,-5.9,-0.8],[-4.3,-0.9,-4.1,-0.8],[4.3,-0.9,4.5,-0.8],[6,-0.9,6.2,-0.8]
  ];
  const SECS = { z1arrive: 3.08, z1wai: 3.71, z1wait: 3.40, z1trance: 9.29, z1warm: 4.99, au1hi: 3.97, au1sell: 11.38, au1shoes: 4.36, aj1which: 3.44, aj1chosen: 1.86, aj1next: 1.72, aj1sit: 1.57, aj1breathe: 3.63, aj1katha: 10.61, aj1done: 1.65, aj1ask: 3.08,
                 /* v16.1 */ mk1come: 3.40, mk1chant: 12.77, /* v19.9 */ mk1iti: 26.78, mk1teach: 14.37, hp1room: 6.19, aj1mat: 1.88, z1sadhu: 2.35, z1room: 1.65,
                 /* v19.1 */ z1thank: 1.70 };

  const hash = (i, s) => { const x = Math.sin(i * 127.1 + s * 311.7) * 43758.5453; return x - Math.floor(x); };
  const smooth = k => k * k * (3 - 2 * k);

  function build(ctx) {
    const { THREE, GLTFLoader, cloneSkinned, scene, camera, yaw, pitch, LOW, kit, plantTrees,
            assetBytes, rescueTextures, redoShadows, cnv, makeHellNote, makeGrass, makeSoftDot,
            getState, startDecision, worldSfx, warmSounds, HEAD_RE } = ctx;

    const owned = [];
    let alive = true;
    const parsedGlb = new Map();
    const madeTex = [];
    const tex = (t) => { madeTex.push(t); return t; };

    /* ------------------------------------------------------------- the map */
    /* v16.4: THE SALA ON A HIGH BASE (Chad: "elevate the temple grounds, with
       stairs at the front leading up to the temple"). The floor was 0.16 — a
       low plinth and three treads; it is 1.10 now, six risers up a staircase
       between the two nagas. Everything built at `SALA.floor + …` rose with
       it (the walkway, the kuti, the private room); LIFT is what the few
       heights that were typed as numbers gained. STAIR is the flight. */
    /* v16.9 · THE TEMPLE (Chad: "replace the main temple you built, with this
       new temple model"). SALA is the HALL now — the inner faces of the Lanna
       temple's four walls, in world metres (tools/preptemple.mjs: x = mx·0.2,
       y = (my − 21.15)·0.2, z = (mz + 9.5)·0.2) — and its floor, 2.456 m up
       on the model's own base. Everything built at `SALA.floor + …` rose
       with it again (the walkway, the kuti, the private room). */
    const SALA = { x0: -5.374, x1: 5.228, z0: -14.078, z1: -2.776, floor: 2.456 };
    const FDOOR = { x0: -0.7, x1: 1.0, z0: -2.776, z1: -2.1 };          // the front door, and its threshold
    const WDOOR = { x: -5.62, z0: -9.08, z1: -7.72 };                   // the west door, cut where the middle window pair was
    const TBASE = { x0: -7.0, x1: 7.1, z0: -18.2 };                     // the temple's base (its front edge is the landing's, z 0)
    const LIFT = SALA.floor - 0.16;
    /* v16.7: eight gentler risers over 3.0 m (were six over 1.92) and a 1.25 m
       pedestal at the foot, so Chad's naga can lie at ×2.3 — "make the naga
       much bigger, adjust the stairs to match" */
    /* v16.9: the model's own stair (four giant blocks) is cut from the mesh;
       this is a real one in its opening — fourteen risers of 17.5 cm over
       3.9 m, and 0.8 m cheek walls carrying Chad's naga at ×2.8 (re-baked,
       BEND=-0.93,0.463,0.877), its head rearing off a 1.45 m pedestal */
    const STAIR = { top: 0.0, foot: 3.9, hw: 2.4, n: 14, ped: 1.45, cw: 0.8 };
    /* v16.1 · THE PRIVATE ROOM is a pocket 250 m west of the wat: the far plane
       is 160 m, so neither is ever drawn from the other (v8.9's law: distance
       does the hiding). Its floor stands at the sala's height, so every
       `SALA.floor + …` in the yant's code is as true in here as it was on the
       sala's planks. The Ajarn's dais, his seat, the stool and the waiting mat
       are ROOM places now, with the offsets v16.0 measured between them. */
    const ROOM = { x: -250, z: 0, hw: 3.4, z0: -3.2, z1: 2.9, h: 3.0 };
    const DAIS = { x: ROOM.x + 0.9, z: ROOM.z - 1.9, w: 2.6, d: 2.2, h: 0.42 };
    const AJ   = { x: DAIS.x, z: DAIS.z - 0.25 };       // the Ajarn's seat on the dais
    /* the yant stool is ON the dais, right in front of him: a Sak Yant master
       works at arm's length behind you (photographed at v16.0 CP2 with the
       stool on the floor 2.4 m out, the rod could not have reached) */
    const CUSH = { x: DAIS.x, z: DAIS.z + 0.84 };       // flush with the dais's front edge, 1.1 m in front of him
    const WAIT = { x: ROOM.x - 1.9, z: ROOM.z + 0.2 };  // the waiting mat
    const RDOOR = { x: ROOM.x - 1.6, z: ROOM.z + ROOM.z1 };   // the room's door, in its front wall
    const RIN = { x: RDOOR.x, z: RDOOR.z - 0.8 };             // where he stands when the black lifts
    /* the MONK's dais, v16.9: on the EAST wall, facing into the hall (Chad:
       "the monk sitting area should not be right beside the buddha on the
       same wall, it should be on the side wall instead, for respect towards
       the principal buddha image"). Built as it always was, facing its own
       +z, and TURNED (ry): mdW(lx, lz) is a point on it in the world. MONL is
       his seat on it; MON the same in the world. */
    const MD  = { x: 4.1, z: -10.2, w: 2.6, d: 2.2, h: 0.42, ry: -Math.PI / 2 };
    const mdW = (lx, lz) => ({ x: MD.x + lx * Math.cos(MD.ry) + lz * Math.sin(MD.ry), z: MD.z - lx * Math.sin(MD.ry) + lz * Math.cos(MD.ry) });
    const MONL = { x: 0, z: -0.25 };
    const MON = mdW(MONL.x, MONL.z);                    // the monk's seat
    const BLESS = mdW(0, MD.d / 2 + 0.62);              // kneel before him, under the raised seat (CP6: at 0.95 he was small in the frame)
    /* the covered walkway: out of the sala's west side between its two back
       pillars, to the kuti against the west wall, whose door is the room's */
    const WALK = { z: -8.4, x0: -5.85, x1: -12.6, hw: 0.9 };              // v16.9: out of the west door
    const KUTI = { x0: -14.8, x1: -12.6, z0: WALK.z - 2.9, z1: WALK.z + 2.9, h: 3.2 };
    const KDOOR = { x: KUTI.x1, z: WALK.z };
    const HELP = { x: -4.55, z: -9.75 };                // the man by the west door, inside the hall
    const WAI  = { x: 0.15, z: SALA.z0 + 3.45 };        // kneel before the altar, 1.6 m off its front step (CP3: at 0.6 m the lens was in the steps)
    const RACK = { x: -4.9, z: 4.6 };                   // the shoe rack by the foot of the steps (v16.9: the old spot is under the temple)
    const STALL = { x: -9.6, z: 4.4 };                  // the offering stall, facing +x
    const BODHI = { x: 6.2, z: 4.6 };
    const GATE = { z: 15.0, hw: 2.2 };
    const UBO = { x0: 10.6, x1: 21.0, z0: -9.0, z1: 6.0 };             // v16.9: 0.4 m east, clear of the temple's eaves
    const CHEDI = { x: -22, z: -16 };                    // v16.4: outside the west wall, left of the sala from the gate
    const GAL = { x0: -14.82, x1: -13.9, z0: -3.4, z1: 1.8 };   // v16.4: the Buddha gallery on the west wall

    /* ----------------------------------------------------------- materials */
    const noteTex = makeHellNote();                     // the contract wants one
    madeTex.push(noteTex);
    const grassTex = makeGrass ? makeGrass() : null;
    const paveTex = tex(makePaving(THREE, cnv));
    const woodTex = tex(makePlanks(THREE, cnv));
    const goldTex = tex(makeGoldCarve(THREE, cnv));
    const tileTex = tex(makeRoofTiles(THREE, cnv, '#dc7b34', '#6e3a16'));   // v16.3: Thai orange terracotta, not a Chinese red
    const tileTex2 = tex(makeRoofTiles(THREE, cnv, '#8e2a1a', '#5a160d'));   // v17.3: deep red, not green
    const wallTex = tex(makeLimewash(THREE, cnv));
    const matGrass = new THREE.MeshStandardMaterial(grassTex ? { map: grassTex.map, roughnessMap: grassTex.rough, color: 0xa7b27c, roughness: 1 } : { color: 0x7d9a5c, roughness: 1 });
    const matPave  = new THREE.MeshStandardMaterial({ map: paveTex, roughness: 0.92 });
    const matWood  = new THREE.MeshStandardMaterial({ map: woodTex, roughness: 0.42, color: 0xffffff });
    const matWoodD = new THREE.MeshStandardMaterial({ color: 0x5b3522, roughness: 0.6 });
    const matWoodL = new THREE.MeshStandardMaterial({ color: 0x9a6a42, roughness: 0.7 });
    const matWall  = new THREE.MeshStandardMaterial({ map: wallTex, roughness: 0.95 });
    const matWhite = new THREE.MeshStandardMaterial({ color: 0xf1ece0, roughness: 0.9 });
    const matRed   = new THREE.MeshStandardMaterial({ color: 0x9c1f16, roughness: 0.45 });
    const matRedD  = new THREE.MeshStandardMaterial({ color: 0x6d140e, roughness: 0.55 });
    const matGold  = new THREE.MeshStandardMaterial({ color: 0xd9a63c, roughness: 0.32, metalness: 0.45,
                                                      emissive: 0x3a2406, emissiveIntensity: 0.55 });
    const matGoldC = new THREE.MeshStandardMaterial({ map: goldTex, roughness: 0.4, metalness: 0.35,
                                                      emissive: 0x2a1a04, emissiveIntensity: 0.5 });
    const matTile  = new THREE.MeshStandardMaterial({ map: tileTex, roughness: 0.6, side: THREE.DoubleSide });
    const matTile2 = new THREE.MeshStandardMaterial({ map: tileTex2, roughness: 0.6, side: THREE.DoubleSide });
    const matCeil  = new THREE.MeshStandardMaterial({ color: 0x4a2a1a, roughness: 0.8, side: THREE.DoubleSide });
    /* v16.4: the sala's ceiling — plain pale teak boards, faintly self-lit,
       where there was a black void over the pillars (the gold stars of the
       first pass were "too much": Chad) */
    const ceilTex = tex(makeCeilPlain(THREE, cnv));
    const matCeilP = new THREE.MeshStandardMaterial({ map: ceilTex, roughness: 0.75, side: THREE.DoubleSide,
                                                      emissive: 0xffffff, emissiveMap: ceilTex, emissiveIntensity: 0.18 });
    /* the bai raka: the gold blades along every bargeboard that give a Thai
       gable its saw-toothed outline. Gathered here, drawn as ONE instanced
       mesh per roof (a phone pays one draw for all of them) */
    const finGeo = new THREE.ConeGeometry(0.075, 0.24, 3); finGeo.translate(0, 0.12, 0);
    const finDummy = new THREE.Object3D();
    function nagaEdge(fins, x0, y0, x1, y1, z, s) {
      // x0,y0: the eave end; x1,y1: the apex; s: which side (+1 right)
      const L = Math.hypot(x1 - x0, y1 - y0), nx = (y1 - y0) / L * s, ny = Math.abs(x1 - x0) / L;
      const th = Math.atan2(-nx, ny);
      for (let d = 0.35; d < L - 0.2; d += 0.3) {
        const k = d / L;
        finDummy.position.set(x0 + (x1 - x0) * k + nx * 0.1, y0 + (y1 - y0) * k + ny * 0.1, z);
        finDummy.rotation.set(0, 0, th + s * 0.35); finDummy.scale.set(1, 1, 0.35);
        finDummy.updateMatrix(); fins.push(finDummy.matrix.clone());
      }
      /* the naga's head at the eave end, rearing up and out: the hang hong */
      const g = new THREE.Group(); g.position.set(x0 + s * 0.05, y0 + 0.02, z); world.add(g);
      const neck = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0, 0), new THREE.Vector3(s * 0.16, 0.06, 0), new THREE.Vector3(s * 0.24, 0.26, 0), new THREE.Vector3(s * 0.2, 0.44, 0)]), 10, 0.05, 6, false), matGold);
      g.add(neck);
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.075, 10, 8), matGold); head.scale.set(1.3, 0.85, 0.8);
      head.position.set(s * 0.25, 0.47, 0); g.add(head);
      const sn = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.14, 6), matGold);
      sn.rotation.z = -s * Math.PI / 2; sn.position.set(s * 0.36, 0.46, 0); g.add(sn);
      for (let c = 0; c < 3; c++) {
        const cr = new THREE.Mesh(new THREE.ConeGeometry(0.022, 0.14 - c * 0.02, 5), matGold);
        cr.position.set(s * (0.2 - c * 0.05), 0.56 - c * 0.02, 0); cr.rotation.z = s * (0.3 + c * 0.25); g.add(cr);
      }
    }
    function finMesh(fins) {
      const im = new THREE.InstancedMesh(finGeo, matGold, fins.length);
      fins.forEach((m, i) => im.setMatrixAt(i, m)); im.instanceMatrix.needsUpdate = true;
      im.castShadow = !LOW; im.computeBoundingSphere(); world.add(im); return im;
    }
    const matStone = new THREE.MeshStandardMaterial({ color: 0xcfc6b3, roughness: 0.95 });
    const matGreen = new THREE.MeshStandardMaterial({ color: 0x2f6a45, roughness: 0.6 });
    const matDark  = new THREE.MeshStandardMaterial({ color: 0x1f1a16, roughness: 0.9 });
    const matSteel = new THREE.MeshStandardMaterial({ color: 0xb8bcc0, roughness: 0.3, metalness: 0.7 });
    const matProxy = new THREE.MeshStandardMaterial({ color: 0x8d7a66, roughness: 0.9 });
    const matMat   = new THREE.MeshStandardMaterial({ map: tex(makeReedMat(THREE, cnv)), roughness: 0.95 });
    /* v16.4: the naga in green-and-gold glass mosaic, glinting in the sun */
    const mosTex = tex(makeMosaicGreen(THREE, cnv)); mosTex.repeat.set(26, 3);
    const matMosaic = new THREE.MeshStandardMaterial({ map: mosTex, roughness: 0.28, metalness: 0.35, emissive: 0x1a120a, emissiveIntensity: 0.4 });

    const world = new THREE.Group();
    scene.add(world);

    const walls = [], solids = [];
    const box = (w, h, d, x, y, z, mat, parent = world, cast = true) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
      m.position.set(x, y, z); m.castShadow = cast && !LOW; m.receiveShadow = true;
      parent.add(m); return m;
    };
    const hid = (m) => { m.visible = false; return m; };
    const cyl = (r0, r1, h, x, y, z, mat, seg = 14, parent = world) => {
      const m = new THREE.Mesh(new THREE.CylinderGeometry(r0, r1, h, seg), mat);
      m.position.set(x, y, z); m.castShadow = !LOW; m.receiveShadow = true;
      parent.add(m); return m;
    };

    /* v16.6 · THE THAI KIT — Chad's two "Tailandia" Sketchfab packs, made into
       one file of forty-two pieces by tools/prepthai.mjs: each a node named
       `thai_<name>`, its origin on its base centre, in metres. thai() stands a
       clone of one at (x, y, z) and ONLY WHEN IT HAS LANDED hides `o.hide` —
       the primitive it replaces stays drawn until then, so a failed download
       costs a nicer prop and never the chapter (v4.7). Collision never moves:
       blockers are the primitives' boxes, and a new piece that stands where
       the player walks brings its own (`o.block`). */
    const GOLD_T = 0xffd88c;          // the pack's Buddha, warmed from a stone-pale gilt to the altar's gold
    /* v18.8 · CHAD'S BUDDHA (his Phra Buddha Chinnarat scan, every map kept —
       "make sure all instances of buddha statues in the entire game, across
       episode 3 all chapters, are all using this new buddha statue model ...
       It needs to have its metallic sheen, texture, etc. It needs to look
       perfect"). It takes the kit Buddha's place at the kit's footprint: its
       base on the group's origin and 0.527 m tall before the group's own scale,
       so every placement keeps its size, and no tint (its gold is its own).
       One THREE.LOD per image. A PRINCIPAL image (`hd: true`) carries EVERY
       triangle (588,799, buddhahd) while it is big on screen — under 4 x its
       height away — the smoothed 123k cut further out, and a 30k cut sharing
       that cut's vertices once it is small (12 x). Every other image (under a
       metre tall) is the smoothed cut — no facet on its face, proven by close
       render — and the 30k cut beyond 4 x its height. Its
       metal reflects the room environment at its own strength (the world's is
       0.05, kept low for everything else); the materials are shared clones,
       and the dispose sweep never frees an envMap. */
    const BUDDHA_H = 0.527, BUDDHA_ENV = 0.15, _bMat = new Map();   // 0.15: bracketed in the hall at 0 / 0.15 / 0.3 / 0.5 — 0 left the unlit images bronze-dark, 0.3 up washed the gold pale
    function buddhaMat(m) {
      let c = _bMat.get(m);
      if (!c) { c = m.clone(); c.envMap = scene.environment || null; c.envMapIntensity = BUDDHA_ENV; _bMat.set(m, c); }
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
        /* only the PRINCIPAL images (`hd: true` — the ones the player stands
           before) carry the full statue; at 589k a level, three of them drawn
           at once at e3c1's altar was 2.6M triangles a frame */
        if (o.hd) { level(hd.scene, 0); level(lo.scene.getObjectByName('buddha_mid'), 4 * h); }
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
      if (o.block) solids.push(hid(cyl(o.block[0], o.block[0], o.block[1], x, (y || 0) + o.block[1] / 2, z, matProxy, o.parent || world)));
      if (name === 'buddha') return chadBuddha(g, o);   // v18.8: Chad's statue, not the kit's
      parseOnce('thaikit').then(gltf => {
        if (!alive) return;
        const src = gltf.scene.getObjectByName('thai_' + name);
        if (!src) throw new Error('thaikit has no thai_' + name);
        const m = src.clone(true);
        m.position.set(0, 0, 0);
        m.traverse(q => {
          if (!q.isMesh) return;
          q.castShadow = o.cast !== false && !LOW; q.receiveShadow = true;
          /* a tint is a per-piece material (the kit's own are shared by
             every clone); the sweep in dispose() frees it with the rest */
          if (o.tint) { q.material = q.material.clone(); q.material.color.multiply(new THREE.Color(o.tint)); if (o.glow) { q.material.emissive = new THREE.Color(o.tint); q.material.emissiveIntensity = o.glow; if (q.material.map) q.material.emissiveMap = q.material.map; } }
        });
        g.add(m);
        for (const h of (o.hide || [])) if (h) h.visible = false;
        if (o.then) o.then(g, m);
      }).catch(err => { console.warn('thaikit failed to load', err); ctx.loadFail && ctx.loadFail('thaikit', err); });
      return g;
    }

    /* v16.9 · CHAD'S SLIPPERS (Sketchfab "slipper", tools/prepslipper.mjs:
       `one` a single flip-flop, toe +z, `pair` the pair kicked off as his
       file lays it). Every pair at the wat is his model now — "Replace all
       your generated slippers, with this slipper model, but change the
       colour to vary it on the shelf". A spot is recorded with its parent,
       and drawn as a box pair until the file lands (v4.7); then each parent
       gets instanced meshes, one colour per pair (instanceColor): a left
       foot, a right foot (the left mirrored, its winding turned so it is
       not culled inside out) and the kicked-off pairs. */
    const SLIP = [];
    const SLIP_PAL = [0x1f2a4a, 0x1d1d1f, 0xb3261e, 0x2d6fb0, 0xd97aa5, 0x3f7a4c, 0xe8b830, 0x7a4a2a, 0xe6e1d6, 0xe0762a, 0x6a3aa0, 0x2a8a8a];
    const slipBoxM = new THREE.MeshStandardMaterial({ color: 0x5a4a3a, roughness: 0.8 });
    function slipperPair(parent, x, y, z, ry, col, kicked) {
      const boxes = [];
      for (const d of [-0.055, 0.055]) {
        const sh = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.03, 0.27), slipBoxM);
        sh.position.set(x + d * Math.cos(ry), y + 0.015, z - d * Math.sin(ry)); sh.rotation.y = ry; parent.add(sh); boxes.push(sh);
      }
      SLIP.push({ parent, x, y, z, ry, col, kicked, boxes });
    }
    function plantSlippers() {
      parseOnce('slipper').then(gltf => {
        if (!alive) return;
        const geo = {};
        gltf.scene.traverse(o => { if (o.isMesh) { const g = o.geometry.clone(); o.updateWorldMatrix(true, false); g.applyMatrix4(o.matrixWorld); g.computeVertexNormals(); geo[o.name] = g; } });
        if (!geo.one || !geo.pair) throw new Error('slipper file has no one/pair');
        const right = geo.one.clone(); right.scale(-1, 1, 1);
        const ix = right.index.array; for (let i = 0; i < ix.length; i += 3) { const t = ix[i + 1]; ix[i + 1] = ix[i + 2]; ix[i + 2] = t; }
        right.index.needsUpdate = true; right.computeVertexNormals();
        const mat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.62 });
        const byParent = new Map();
        for (const sp of SLIP) { if (!byParent.has(sp.parent)) byParent.set(sp.parent, []); byParent.get(sp.parent).push(sp); }
        const d = new THREE.Object3D(), col = new THREE.Color();
        for (const [parent, list] of byParent) {
          const parts = [['L', geo.one, list.filter(q => !q.kicked), -0.056], ['R', right, list.filter(q => !q.kicked), 0.056], ['P', geo.pair, list.filter(q => q.kicked), 0]];
          for (const [, g, items, off] of parts) {
            if (!items.length) continue;
            const im = new THREE.InstancedMesh(g, mat, items.length);
            items.forEach((q, i) => {
              d.position.set(q.x + off * Math.cos(q.ry), q.y + 0.002, q.z - off * Math.sin(q.ry)); d.rotation.set(0, q.ry, 0); d.updateMatrix();
              im.setMatrixAt(i, d.matrix); im.setColorAt(i, col.setHex(q.col));
            });
            im.instanceMatrix.needsUpdate = true; im.instanceColor.needsUpdate = true; im.computeBoundingSphere();
            im.castShadow = !LOW; im.receiveShadow = true; parent.add(im);
          }
          for (const q of list) for (const b of q.boxes) b.visible = false;
        }
        redoShadows();
      }).catch(err => { console.warn('slipper failed to load', err); ctx.loadFail && ctx.loadFail('slipper', err); });
    }

    /* ------------------------------------------------------------ the ground */
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(260, 260), matGrass);
    ground.rotation.x = -Math.PI / 2; ground.position.y = -0.02; ground.receiveShadow = true; world.add(ground);
    {
      const W = 36, D = 38.5;                         // x -15…21, z -23.5…15 (v16.9: the north wall moved back)
      const pv = new THREE.Mesh(new THREE.PlaneGeometry(W, D), matPave);
      pv.rotation.x = -Math.PI / 2; pv.position.set(3, 0.004, -4.25); pv.receiveShadow = true; world.add(pv);
      paveTex.repeat.set(W / 2.4, D / 2.4);
      // the road outside the gate, where the film walks in
      const road = new THREE.Mesh(new THREE.PlaneGeometry(10, 60), new THREE.MeshStandardMaterial({ color: 0x8a7e6c, roughness: 1 }));
      road.rotation.x = -Math.PI / 2; road.position.set(0, 0.003, 45); road.receiveShadow = true; world.add(road);
    }

    /* ------------------------------------------------------ the compound wall
       White limewash, a red tiled coping, 2.4 m. The gate in the south wall. */
    function wallRun(x0, z0, x1, z1) {
      const L = Math.hypot(x1 - x0, z1 - z0), a = Math.atan2(z1 - z0, x1 - x0);
      const cx = (x0 + x1) / 2, cz = (z0 + z1) / 2;
      const w = box(L, 2.4, 0.36, cx, 1.2, cz, matWall); w.rotation.y = -a; walls.push(w);
      const cap = box(L + 0.1, 0.16, 0.62, cx, 2.48, cz, matStone); cap.rotation.y = -a;
      // a pier every 4.5 m, the wall's rhythm
      for (let s = 0; s <= L; s += 4.5) {
        const px = x0 + Math.cos(a) * s, pz = z0 + Math.sin(a) * s;
        const p = box(0.56, 2.7, 0.56, px, 1.35, pz, matWhite);
        const cp = box(0.66, 0.14, 0.66, px, 2.77, pz, matGold);
        void p; void cp;
        budM.push(new THREE.Matrix4().makeTranslation(px, 2.84, pz));   // v16.4: a gold lotus bud on every pier
      }
    }
    const budM = [];
    wallRun(-15, 15, -GATE.hw - 0.6, 15);
    wallRun(GATE.hw + 0.6, 15, 21.5, 15);
    /* v16.9: the north wall 10.5 m further back — the temple is 20.6 m deep
       behind its landing (it stood at z −13, through the new hall) */
    wallRun(-15, -23.5, -15, 15);
    wallRun(-15, -23.5, 21.5, -23.5);
    wallRun(21.5, -23.5, 21.5, 15);
    {
      const pts = [[0, 0], [0.22, 0.02], [0.26, 0.12], [0.2, 0.32], [0.1, 0.5], [0.02, 0.62], [0, 0.66]].map(([a, b]) => new THREE.Vector2(a, b));
      const im = new THREE.InstancedMesh(new THREE.LatheGeometry(pts, 12), matGold, budM.length);
      budM.forEach((m, i) => im.setMatrixAt(i, m)); im.instanceMatrix.needsUpdate = true; im.computeBoundingSphere();
      im.castShadow = !LOW; world.add(im);
    }

    /* THE GATE: two white pillars, a small tiered roof on a gilded lintel, and
       two guardian giants (yak) either side, green and red, with clubs. */
    {
      for (const s of [-1, 1]) {
        const px = s * (GATE.hw + 0.3);
        walls.push(box(0.9, 4.2, 0.9, px, 2.1, GATE.z, matWhite));
        box(1.1, 0.25, 1.1, px, 4.3, GATE.z, matGold);
        const fin = cyl(0.02, 0.26, 0.9, px, 4.9, GATE.z, matGold, 8);
        void fin;
      }
      box(GATE.hw * 2 + 1.9, 0.5, 1.0, 0, 4.2, GATE.z, matWhite);              // the lintel (v16.3: white, gold under it)
      box(GATE.hw * 2 + 1.7, 0.18, 1.05, 0, 3.9, GATE.z, matGoldC);
      // a two-tier little roof over it
      for (let i = 0; i < 2; i++) {
        const w = GATE.hw * 2 + 2.6 - i * 1.4, y = 4.6 + i * 0.7;
        for (const s of [-1, 1]) {
          const r = box(w, 0.08, 1.35, 0, y + 0.25, GATE.z + s * 0.45, matTile);
          r.rotation.x = s * 0.62;
        }
        box(w * 0.6, 0.1, 0.12, 0, y + 0.62, GATE.z, matGold);
      }
      tileTex.repeat.set(3, 1);
      /* v16.4: a tiered spire crowning the gate — a white base, five gilded
         tiers stepping in, and a tall gold point */
      {
        const y0 = 6.05;
        box(1.3, 0.5, 1.3, 0, y0 + 0.25, GATE.z, matWhite);
        box(1.4, 0.06, 1.4, 0, y0 + 0.52, GATE.z, matGold);
        for (let i = 0; i < 5; i++) {
          const w = 1.05 - i * 0.17, y = y0 + 0.62 + i * 0.36;
          const t = cyl(w * 0.7, w * 0.72, 0.3, 0, y, GATE.z, i % 2 ? matGold : matWhite, 4); t.rotation.y = Math.PI / 4;
          cyl(w * 0.74, w * 0.74, 0.04, 0, y + 0.16, GATE.z, matGold, 4).rotation.y = Math.PI / 4;
        }
        const pt = new THREE.Mesh(new THREE.ConeGeometry(0.12, 1.5, 8), matGold);
        pt.position.set(0, y0 + 2.9, GATE.z); pt.castShadow = !LOW; world.add(pt);
      }
      // the guardians, just inside the gate, facing the road
      for (const s of [-1, 1]) mkYak(s * 3.9, GATE.z - 1.3, s < 0 ? 0x3f7a4c : 0xa2352a, s < 0 ? 'wessgreen' : 'wessred');
    }
    function mkYak(x, z, col, key) {
      const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = Math.PI; world.add(g);
      const skin = new THREE.MeshStandardMaterial({ color: col, roughness: 0.5 });
      box(1.3, 0.7, 1.3, 0, 0.35, 0, matWhite, g);                           // the plinth
      box(1.4, 0.1, 1.4, 0, 0.72, 0, matGold, g);
      // legs, a skirt, a torso, a crowned head — a stylised giant, 3.4 m
      for (const s of [-1, 1]) cyl(0.13, 0.16, 0.95, s * 0.2, 1.25, 0, skin, 10, g);
      const skirt = cyl(0.42, 0.55, 0.62, 0, 1.55, 0, matGoldC, 14, g); void skirt;
      cyl(0.36, 0.42, 0.9, 0, 2.3, 0, skin, 14, g);
      box(0.88, 0.14, 0.4, 0, 2.72, 0, matGold, g);                         // the collar
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.27, 16, 12), skin);
      head.position.set(0, 3.03, 0); head.scale.set(1, 1.12, 0.95); g.add(head);
      // the eyes and the fangs, the thing a child remembers
      for (const s of [-1, 1]) {
        const e = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 6), matWhite);
        e.position.set(s * 0.1, 3.08, 0.23); g.add(e);
        const f = new THREE.Mesh(new THREE.ConeGeometry(0.025, 0.09, 6), matWhite);
        f.position.set(s * 0.07, 2.9, 0.24); f.rotation.x = Math.PI; g.add(f);
      }
      // the stacked crown (chada), gold
      for (let i = 0; i < 5; i++) cyl(0.2 - i * 0.035, 0.24 - i * 0.035, 0.14, 0, 3.32 + i * 0.13, 0, matGold, 12, g);
      const spire = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.55, 10), matGold);
      spire.position.set(0, 4.25, 0); g.add(spire);
      // arms resting on a club planted in front
      for (const s of [-1, 1]) {
        const a = cyl(0.09, 0.1, 0.9, s * 0.42, 2.3, 0.12, skin, 8, g);
        a.rotation.z = s * 0.25; a.rotation.x = -0.35;
      }
      cyl(0.07, 0.12, 2.2, 0, 1.85, 0.42, matGold, 10, g);
      for (const o of g.children.slice(2)) o.visible = false;   // (v21.16: the giant built of cylinders is never drawn — the plinth waits for the scan)
      solids.push(hid(box(1.3, 0.7, 1.3, x, 0.35, z, matWhite, world, false)));
      /* v16.6: Chad's Thao Wessuwan scan (tools/prepwess.mjs) takes the
         giant's place on the same plinth, the same height to the spire tip
         (3.75 m over the gold), facing the same way; the primitive giant is
         drawn until the scan has landed (v4.7), the plinth stays */
      const giant = g.children.slice(2);
      parseOnce(key).then(gltf => {
        if (!alive) return;
        const m = gltf.scene.clone(true);
        const bb = new THREE.Box3().setFromObject(m), k = 3.75 / (bb.max.y - bb.min.y);
        m.scale.setScalar(k); m.position.y = 0.77 - bb.min.y * k;
        m.traverse(o => { if (o.isMesh) { o.castShadow = !LOW; o.receiveShadow = true; } });
        g.add(m);
        for (const o of giant) o.visible = false;
      }).catch(err => { console.warn(key + ' failed to load', err); ctx.loadFail && ctx.loadFail(key, err); });
    }

    /* ------------------------------------------------------------ THE TEMPLE
       v16.9: Chad's Lanna temple where the open sala stood (Chad: "replace
       the main temple you built, with this new temple model, and move
       everything interior that you built for the old temple model into this
       new temple model"). masters/v16.8/temple/bake.mjs turned every face
       outward, classed it and baked its ambient occlusion; tools/preptemple
       .mjs cut out the model's own stair (the staircase below and Chad's
       nagas are in its opening) and a door in the west wall (the walkway to
       the Ajarn's room leaves from it — the model has no veranda to walk
       round), and placed it in metres. EVERY TRIANGLE of the model ships
       (Chad: "why did u cut the temple down? now it loses all its details").
       Until it lands a plain shell of its size stands in (v4.7). Its
       collision is TEMPLE_BLOCK, derived from the mesh itself
       (masters/v16.9/blockgrid.mjs). The old sala's pillars, rails, three
       roofs, porch, back wall and ceiling are gone with it. */
    const SW = SALA.x1 - SALA.x0, SD = SALA.z1 - SALA.z0, SCX = (SALA.x0 + SALA.x1) / 2, SCZ = (SALA.z0 + SALA.z1) / 2;
    const templeProxy = new THREE.Group(); world.add(templeProxy);
    {
      const P = templeProxy, T = 0.3, wh = 4.6, Y = SALA.floor + wh / 2;
      box(TBASE.x1 - TBASE.x0, SALA.floor, -TBASE.z0, (TBASE.x0 + TBASE.x1) / 2, SALA.floor / 2, TBASE.z0 / 2, matWhite, P, false);
      const fl = new THREE.Mesh(new THREE.PlaneGeometry(SW, SD), matWood);
      fl.rotation.x = -Math.PI / 2; fl.position.set(SCX, SALA.floor + 0.004, SCZ); P.add(fl);
      woodTex.repeat.set(SW / 1.6, SD / 1.6);
      box(SW + 2 * T, wh, T, SCX, Y, SALA.z0 - T / 2, matWall, P);
      box(T, wh, SD, SALA.x1 + T / 2, Y, SCZ, matWall, P);
      box(T, wh, SALA.z1 - WDOOR.z1, SALA.x0 - T / 2, Y, (SALA.z1 + WDOOR.z1) / 2, matWall, P);
      box(T, wh, WDOOR.z0 - SALA.z0, SALA.x0 - T / 2, Y, (WDOOR.z0 + SALA.z0) / 2, matWall, P);
      box(FDOOR.x0 - SALA.x0 + T, wh, T, (SALA.x0 - T + FDOOR.x0) / 2, Y, SALA.z1 + T / 2, matWall, P);
      box(SALA.x1 + T - FDOOR.x1, wh, T, (SALA.x1 + T + FDOOR.x1) / 2, Y, SALA.z1 + T / 2, matWall, P);
      const rise = 5.0, run = SW / 2 + 1.6, slope = Math.hypot(rise, run), ang = Math.atan2(rise, run);
      for (const sd of [-1, 1]) {
        const r = new THREE.Mesh(new THREE.PlaneGeometry(slope, SD + 4.0), matTile);
        r.rotation.order = 'ZYX'; r.rotation.x = -Math.PI / 2; r.rotation.z = -sd * ang;
        r.position.set(SCX + sd * run / 2, SALA.floor + wh + rise / 2, SCZ); P.add(r);
      }
    }
    /* (the old sala set these two repeats; the bell tower's and the ubosot's
       green tiers and the gallery's underside still use them) */
    tileTex2.repeat.set(3, 2);
    ceilTex.repeat.set(6, 4);
    const templeMat = templeMats(THREE);
    parseOnce('temple').then(gltf => {
      if (!alive) return;
      const m = gltf.scene;
      m.traverse(o => {
        if (!o.isMesh) return;
        const k = (o.name || '').replace(/^temple_/, '').replace(/_\d+$/, '');
        o.material = templeMat[k] || templeMat.wall;
        o.castShadow = !LOW; o.receiveShadow = true;
      });
      world.add(m);
      templeProxy.visible = false;
      redoShadows();                                     // the shadows are drawn on demand: a new caster asks
    }).catch(err => { console.warn('temple failed to load', err); ctx.loadFail && ctx.loadFail('temple', err); });

    /* THE STAIRCASE in the model's own opening: pale stone treads with a gold
       nosing, and a white cheek wall each side 0.8 m thick (as broad as the
       model's own were) — Chad's naga lies along its top and rears up off the
       pedestal at its foot */
    {
      const rh = SALA.floor / STAIR.n, td = (STAIR.foot - STAIR.top) / STAIR.n;
      for (let k = 0; k < STAIR.n; k++) {
        const zf = STAIR.foot - k * td, d = zf - STAIR.top;
        box(STAIR.hw * 2, (k + 1) * rh, d, 0, (k + 1) * rh / 2, STAIR.top + d / 2, matStone, world, false);
        box(STAIR.hw * 2, 0.025, 0.05, 0, (k + 1) * rh + 0.0125, zf - 0.025, matGold, world, false);
      }
      for (const sx of [-1, 1]) {
        const sh = new THREE.Shape();
        sh.moveTo(STAIR.top, 0); sh.lineTo(STAIR.foot + STAIR.ped, 0); sh.lineTo(STAIR.foot + STAIR.ped, 0.5);
        sh.lineTo(STAIR.foot, 0.5); sh.lineTo(STAIR.top, SALA.floor + 0.5); sh.lineTo(STAIR.top - 1.1, SALA.floor + 0.5); sh.lineTo(STAIR.top - 1.1, 0);   // back along the landing's side, where the model's own cheek walls were cut sh.closePath();
        const cw = new THREE.Mesh(new THREE.ExtrudeGeometry(sh, { depth: STAIR.cw, bevelEnabled: false }), matWhite);
        cw.rotation.y = -Math.PI / 2; cw.position.set(sx * (STAIR.hw + STAIR.cw / 2) + STAIR.cw / 2, 0, 0); cw.castShadow = !LOW; cw.receiveShadow = true; world.add(cw);
      }
    }
    /* the NAGA balustrades either side of the steps: a serpent's body running
       down to the paving and rearing up at the foot, hood fanned, green and
       gold. A tube along a curve, a hood of cones. (The stand-in until
       Chad's naga lands.) */
    for (const s of [-1, 1]) {
      const x = s * (STAIR.hw + STAIR.cw / 2);
      const pts = [];
      /* v16.4: down the cheek wall of the staircase, the way a Thai temple's
         nagas run: the tail on the temple's floor at the rail, the body along
         the flight, the head rearing up at its foot */
      pts.push(new THREE.Vector3(x, SALA.floor + 0.64, STAIR.top - 0.2));
      for (let i = 0; i <= 20; i++) {
        const k = i / 20, z = STAIR.top + k * (STAIR.foot - STAIR.top);
        pts.push(new THREE.Vector3(x, 0.5 + SALA.floor * (1 - k) + 0.14 + Math.sin(k * Math.PI * 4) * 0.035, z));
      }
      pts.push(new THREE.Vector3(x, 0.66, STAIR.foot + 0.26), new THREE.Vector3(x, 1.1, STAIR.foot + 0.42), new THREE.Vector3(x, 1.62, STAIR.foot + 0.48));
      const body = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 48, 0.11, 10, false), matMosaic);   // v16.4: glass mosaic
      body.castShadow = !LOW; world.add(body);
      // a gold spine along its back
      const spine = pts.map(v => new THREE.Vector3(v.x, v.y + 0.1, v.z));
      const spineM = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(spine), 48, 0.03, 6, false), matGold); world.add(spineM);
      /* THE HOOD: a fan standing up and facing out at the courtyard — green
         scales ringed in gold — with five heads along its crown, the middle
         one tallest, each a snout, two gold eyes and a gold crest */
      const hood = new THREE.Group(); hood.position.set(x, 1.6, STAIR.foot + 0.52); hood.scale.setScalar(1.3); world.add(hood);
      const fan = new THREE.Mesh(new THREE.CircleGeometry(0.34, 20, 0, Math.PI), new THREE.MeshStandardMaterial({ map: tex(makeNagaScales(THREE, cnv)), roughness: 0.5, side: THREE.DoubleSide }));
      hood.add(fan);
      const rim = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.022, 6, 20, Math.PI), matGold); hood.add(rim);
      for (let h = -2; h <= 2; h++) {
        const a = Math.PI / 2 - h * 0.5, hr = 0.34;
        const head = new THREE.Group(); head.position.set(Math.cos(a) * hr, Math.sin(a) * hr, 0.02);
        head.rotation.z = -h * 0.35; hood.add(head);
        const sk = new THREE.Mesh(new THREE.SphereGeometry(0.07 - Math.abs(h) * 0.008, 10, 8), matMosaic);
        sk.scale.set(0.85, 1.1, 1.0); head.add(sk);
        const sn = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.12, 8), matMosaic);
        sn.rotation.x = Math.PI / 2; sn.position.set(0, -0.01, 0.08); head.add(sn);
        for (const e of [-1, 1]) { const ey = new THREE.Mesh(new THREE.SphereGeometry(0.014, 6, 4), matGold); ey.position.set(e * 0.035, 0.02, 0.06); head.add(ey); }
        const cr = new THREE.Mesh(new THREE.ConeGeometry(0.025, 0.11 + (h === 0 ? 0.06 : 0), 6), matGold); cr.position.set(0, 0.1, -0.01); head.add(cr);
      }
      hood.traverse(o => { if (o.isMesh) o.castShadow = !LOW; });
      solids.push(hid(box(STAIR.cw, 1.8, STAIR.foot + STAIR.ped - STAIR.top, x, 0.9, (STAIR.top + STAIR.foot + STAIR.ped) / 2, matStone, world, false)));
      solids.push(hid(box(STAIR.cw, 0.6, 1.1, x, SALA.floor + 0.3, STAIR.top - 0.55, matStone, world, false)));   // its parapet along the landing
      /* Chad's naga (tools/prepwess.mjs with BEND): lying along the cheek
         wall, the body sheared down the flight in the file itself and the
         head rearing upright off the pedestal at its foot. v16.9: at ×2.8 for
         the temple's 2.46 m flight (v16.7's ×2.3 was for a 1.1 m one) — the
         file is re-baked with BEND=-0.93,0.463,0.877, so its ramp starts on
         the landing's edge (z 0) and ends on the stair's foot (3.9), exactly
         the wall's slope, and the head (1.4 m) rears off the pedestal. */
      parseOnce('naga').then(gltf => {
        if (!alive) return;
        const m = gltf.scene.clone(true);
        /* v17.3: its green scales gold (Chad: "there is no green at thai
           temples") — the file's own gold trim stays brighter than them */
        m.traverse(o => { if (o.isMesh && o.material && !o.material.userData.ungreen) ungreen(o.material); });
        m.scale.setScalar(2.8); m.position.set(x, 0.5, STAIR.foot - 0.463 * 2.8);
        m.traverse(o => { if (o.isMesh) { o.castShadow = !LOW; o.receiveShadow = true; } });
        world.add(m);
        for (const o of [body, spineM, hood]) o.visible = false;
        redoShadows();
      }).catch(err => { console.warn('naga failed to load', err); ctx.loadFail && ctx.loadFail('naga', err); });
    }
    /* v16.4 · THE LIGHT THROUGH THE SMOKE: painted shafts of the low sun
       (no light — v9.4). v16.9: in through the temple's front door and its
       first east window, onto the runner before the altar */
    {
      const sd = new THREE.Vector3(16, 6.5, 18).normalize();
      const shTex = tex(makeShaftTex(THREE, cnv));
      const shm = new THREE.MeshBasicMaterial({ map: shTex, color: 0xffd6a0, transparent: true, opacity: 0.15, blending: THREE.AdditiveBlending,
                                                depthWrite: false, fog: false, side: THREE.DoubleSide });
      for (const [fx, fz, w, L] of [[-2.3, -5.3, 0.7, 6.0], [-3.2, -6.6, 0.45, 6.4], [0.74, -9.85, 0.8, 8.6]]) {
        const mid = new THREE.Vector3(fx, SALA.floor, fz).addScaledVector(sd, L / 2);
        for (const turn of [0, Math.PI / 2]) {
          const sh = new THREE.Mesh(new THREE.PlaneGeometry(w, L), shm);
          sh.position.copy(mid);
          sh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), sd);
          sh.rotateY(turn); sh.renderOrder = 3; world.add(sh);
        }
      }
    }
    // two ceiling fans, turning, and pendant lamps (off: it is light)
    /* v16.9: in the temple's hall, over the runner, hung on long rods from
       the ceiling's ridge (9.7 m up; the hall is 7.3 m to its ridge) */
    const fans = [];
    const CEIL = 9.7;
    for (const z of [-5.2, -9.4]) {
      cyl(0.012, 0.012, CEIL - (SALA.floor + 3.3), 0.15, (CEIL + SALA.floor + 3.3) / 2, z, matDark, 6);
      const g = new THREE.Group(); g.position.set(0.15, SALA.floor + 3.62, z); world.add(g);
      cyl(0.015, 0.015, 0.36, 0, 0.2, 0, matDark, 6, g);
      cyl(0.09, 0.09, 0.08, 0, 0, 0, matWhite, 10, g);
      const blades = new THREE.Group(); g.add(blades);
      for (let i = 0; i < 3; i++) {
        const b = box(0.62, 0.012, 0.11, 0.38, 0, 0, matWoodL, blades, false);
        b.position.set(Math.cos(i * 2.094) * 0.38, 0, Math.sin(i * 2.094) * 0.38); b.rotation.y = -i * 2.094;
      }
      fans.push(blades);
      // v16.6: the kit's five-blade fan, hung from the ceiling (0.73 m of rod
      // and hub at 0.6), turning in the primitive's place once it lands
      const kf = thai('ceilfan', 0.15, SALA.floor + 4.0 - 0.73, z, { s: 0.6, cast: false, hide: [g],
                               then: () => { fans[fans.indexOf(blades)] = kf; } });
    }
    for (const [x, z] of [[-2.6, -4.6], [2.6, -4.6], [-2.6, -8.2], [2.6, -8.2], [-2.6, -11.6], [2.6, -11.6]]) {
      cyl(0.006, 0.006, 9.0 - (SALA.floor + 3.35), x, (9.0 + SALA.floor + 3.35) / 2, z, matDark, 4);
      const sh = cyl(0.16, 0.24, 0.2, x, SALA.floor + 3.25, z, matGold, 12); void sh;
    }

    /* THE ALTAR against the back wall: a stepped red-and-gold throne, the
       seated golden Buddha on top under a gilded screen with a halo, smaller
       images either side, lotus in vases, candles, an incense pot with smoke
       rising, jasmine garlands, and a framed photograph of the old abbot. */
    const ALT = { x: 0.15, z: SALA.z0 + 0.95 };          // v16.9: on the front door's axis, against the temple's back wall
    const candles = [];
    let smokeP = null;
    {
      for (let i = 0; i < 3; i++) {
        const w = 3.8 - i * 0.9, h = 0.38, y = SALA.floor + h / 2 + i * h;
        box(w, h, 1.6 - i * 0.3, ALT.x, y, ALT.z + 0.1 - i * 0.12, i % 2 ? matGoldC : matRed);
        box(w + 0.04, 0.04, 1.62 - i * 0.3, ALT.x, y + h / 2, ALT.z + 0.1 - i * 0.12, matGold);
      }
      solids.push(hid(box(3.8, 1.2, 1.7, ALT.x, 0.6, ALT.z + 0.1, matRed, world, false)));
      /* the screen behind the Buddha. v19.1 (Chad: "remove the half circle
         thing behind the main buddha statue. also remove the circle thing
         behind the half circle thing. add some motif pattern on the red board
         behind the main buddha statue"): the gilded arch and the halo are
         gone, and the board's FRONT carries a lai thai — a gold kanok border
         round a diamond lattice of four-petal flowers, on the same red
         (makeAltarScreen); its edges and back stay plain lacquer */
      const scrMat = new THREE.MeshStandardMaterial({ map: tex(makeAltarScreen(THREE, cnv)), roughness: 0.5, metalness: 0.12 });
      const scr = box(3.2, 3.3, 0.08, ALT.x, SALA.floor + 2.8, SALA.z0 + 0.25, [matRedD, matRedD, matRedD, matRedD, scrMat, matRedD]);
      void scr;
      // the Buddha (a stand-in until Chad's model lands: a lathe-built seated
      // figure in gold, in the earth-touching pose's silhouette)
      /* v16.6: the pack's seated gold Buddha (0.53 m in the file) in the
         primitive's place and at its height, 1.85 m to the flame */
      /* v18.8: the principal image is Chad's statue, LARGE (x4.5 — 2.37 m to its arch's tip, 1.62 m wide: it
         clears the flanking images at +/-1.25 and is 0.92 m deep, the kit image's own depth at x3.5) */
      thai('buddha', ALT.x, SALA.floor + 1.14, SALA.z0 + 0.78, { s: 4.5, hd: true, tint: GOLD_T, glow: 0.12, hide: [mkBuddha(ALT.x, SALA.floor + 1.14, SALA.z0 + 0.72, 1.0)] });
      for (const s of [-1, 1]) thai('buddha', ALT.x + s * 1.25, SALA.floor + 0.76, SALA.z0 + 1.02, { s: 1.5, tint: GOLD_T, glow: 0.12, hide: [mkBuddha(ALT.x + s * 1.25, SALA.floor + 0.76, SALA.z0 + 1.02, 0.42)] });
      // vases of lotus, candles, the incense pot, garlands
      for (const s of [-1, 1]) {
        const vx = ALT.x + s * 1.55, vy = SALA.floor + 0.76, vz = ALT.z + 0.55;
        const vase = [cyl(0.09, 0.07, 0.3, vx, vy + 0.15, vz, matGold, 12)];
        for (let k = 0; k < 3; k++) {
          const st = cyl(0.008, 0.008, 0.42, vx + (k - 1) * 0.05, vy + 0.5, vz, matGreen, 4); st.rotation.z = (k - 1) * 0.18;
          const bud = new THREE.Mesh(new THREE.SphereGeometry(0.055, 8, 6), new THREE.MeshStandardMaterial({ color: 0xf2b6c6, roughness: 0.6 }));
          bud.scale.set(1, 1.5, 1); bud.position.set(vx + (k - 1) * 0.12, vy + 0.74, vz); world.add(bud);
          vase.push(st, bud);
        }
        thai('orchid', vx, vy, vz, { s: 0.55, hide: vase });          // v16.6: orchids in a white vase
        const cz = ALT.z + 0.62;
        for (const dx of [0.35, 0.55]) {
          const cx = ALT.x + s * dx;
          // v16.6: the pack's candle on its turned stand; the flame stays ours
          thai('candle', cx, SALA.floor + 0.76, cz, { s: 0.6, hide: [cyl(0.025, 0.025, 0.24, cx, SALA.floor + 0.88, cz, new THREE.MeshStandardMaterial({ color: 0xf3e4b0, roughness: 0.6 }), 8)] });
          const fl = new THREE.Mesh(new THREE.SphereGeometry(0.018, 8, 6),
            new THREE.MeshBasicMaterial({ color: 0xffc46a, transparent: true, opacity: 0.95, fog: false }));
          fl.scale.set(1, 1.8, 1); fl.position.set(cx, SALA.floor + 1.03, cz); world.add(fl);
          candles.push(fl);
        }
      }
      // the incense pot, front and centre, and its smoke
      {
        const pot = [cyl(0.16, 0.12, 0.16, ALT.x, SALA.floor + 0.84, ALT.z + 0.72, matGold, 16)];
        for (let k = 0; k < 5; k++) {
          const st = cyl(0.004, 0.004, 0.3, ALT.x - 0.06 + k * 0.03, SALA.floor + 1.02, ALT.z + 0.72, matRedD, 3);
          st.rotation.z = (k - 2) * 0.06; pot.push(st);
        }
        thai('incense', ALT.x, SALA.floor + 0.76, ALT.z + 0.72, { s: 0.6, hide: pot });   // v16.6
        // two pedestal trays on the lowest tier, and marigold strings on the screen's edges
        for (const sx of [-1, 1]) {
          thai('phan', ALT.x + sx * 0.95, SALA.floor + 0.38, ALT.z + 0.77, { s: 0.8 });
          thai('garland', ALT.x + sx * 1.66, SALA.floor + 1.72, SALA.z0 + 0.34, { s: 0.75, cast: false });
        }
      }
      if (makeSoftDot) {
        const dot = makeSoftDot(); madeTex.push(dot);
        const N = 18, geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(N * 3), 3));
        const pm = new THREE.PointsMaterial({ map: dot, size: 0.16, transparent: true, opacity: 0.32, depthWrite: false,
                                              color: 0xd8d0c4, sizeAttenuation: true });
        smokeP = new THREE.Points(geo, pm); smokeP.frustumCulled = false; world.add(smokeP);
        smokeP.userData.seed = Array.from({ length: N }, (_, i) => hash(i, 3));
      }
      // garlands: a loop of white-and-yellow along the front of each tier
      for (let i = 0; i < 2; i++) {
        const pts = [];
        const w = 3.6 - i * 0.9, y = SALA.floor + 0.34 + i * 0.38, z = ALT.z + 0.92 - i * 0.12;
        for (let k = 0; k <= 16; k++) { const t = k / 16; pts.push(new THREE.Vector3(ALT.x - w / 2 + t * w, y - Math.sin(t * Math.PI) * 0.16, z)); }
        const gm = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 32, 0.028, 6, false),
          new THREE.MeshStandardMaterial({ color: 0xf5f0de, roughness: 0.7 }));
        world.add(gm);
      }
      /* v19.1: the abbot's photograph that stood framed on the second tier is
         gone (Chad: "remove the monk portrait in the main temple hall, as it
         looks really bad") */
    }
    /* THE RUESI — the hermit sage who is the patron of the Sak Yant masters,
       whose head sits on every Ajarn's shrine: a bronze-dark face, a long
       white beard, the tall tiered crown, on a small red plinth */
    function mkRuesi(x, y, z, parent) {
      const g = new THREE.Group(); g.position.set(x, y, z); parent.add(g);
      box(0.2, 0.08, 0.18, 0, 0.04, 0, matRed, g, false);
      const skin = new THREE.MeshStandardMaterial({ color: 0x5a3a22, roughness: 0.45, metalness: 0.3 });
      const face = new THREE.Mesh(new THREE.SphereGeometry(0.07, 16, 12), skin); face.scale.set(0.9, 1.15, 0.9); face.position.y = 0.2; g.add(face);
      const beard = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.14, 12), new THREE.MeshStandardMaterial({ color: 0xece8de, roughness: 0.9 }));
      beard.rotation.x = Math.PI; beard.position.set(0, 0.1, 0.03); g.add(beard);
      for (let i = 0; i < 4; i++) cyl(0.06 - i * 0.012, 0.07 - i * 0.012, 0.06, 0, 0.3 + i * 0.055, 0, matGold, 12, g);
      const tip = new THREE.Mesh(new THREE.ConeGeometry(0.02, 0.12, 10), matGold); tip.position.y = 0.58; g.add(tip);
      for (const sd of [-1, 1]) { const e = new THREE.Mesh(new THREE.SphereGeometry(0.008, 6, 4), matGold); e.position.set(sd * 0.024, 0.215, 0.06); g.add(e); }
      const tiger = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.05, 0.1), new THREE.MeshStandardMaterial({ color: 0xc8782a, roughness: 0.8 }));
      tiger.position.set(0, 0.105, 0.0); g.add(tiger);
      g.traverse(o => { if (o.isMesh) o.castShadow = !LOW; });
      return g;
    }
    function mkBuddha(x, y, z, s, parent = world) {
      const g = new THREE.Group(); g.position.set(x, y, z); g.scale.setScalar(s); parent.add(g);
      // the lotus throne
      cyl(0.62, 0.52, 0.2, 0, 0.1, 0, matGold, 24, g);
      for (let i = 0; i < 16; i++) {
        const p = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 6), matGold);
        const a = i / 16 * Math.PI * 2; p.scale.set(0.6, 1.2, 0.35);
        p.position.set(Math.cos(a) * 0.56, 0.22, Math.sin(a) * 0.56); p.rotation.y = -a; g.add(p);
      }
      // the crossed legs, the robe's fall, the torso, the shoulders
      const legs = new THREE.Mesh(new THREE.SphereGeometry(0.5, 20, 12), matGold);
      legs.scale.set(1.0, 0.32, 0.62); legs.position.set(0, 0.36, 0.05); g.add(legs);
      const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.3, 0.68, 18), matGold);
      torso.position.set(0, 0.78, -0.02); g.add(torso);
      const chest = new THREE.Mesh(new THREE.SphereGeometry(0.27, 18, 12), matGold);
      chest.scale.set(1.12, 0.9, 0.78); chest.position.set(0, 1.0, -0.02); g.add(chest);
      for (const sd of [-1, 1]) {
        const arm = new THREE.Mesh(new THREE.CapsuleGeometry(0.07, 0.42, 4, 8), matGold);
        arm.position.set(sd * 0.3, 0.78, 0.02); arm.rotation.z = sd * 0.18; g.add(arm);
        const fore = new THREE.Mesh(new THREE.CapsuleGeometry(0.06, 0.3, 4, 8), matGold);
        fore.position.set(sd * 0.2, 0.52, 0.2); fore.rotation.x = 1.3; fore.rotation.z = sd * 0.5; g.add(fore);
      }
      // the right hand reaching down over the knee (the earth-touching pose)
      const hand = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 6), matGold);
      hand.scale.set(0.8, 1.2, 0.6); hand.position.set(0.38, 0.42, 0.34); g.add(hand);
      const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.1, 0.12, 12), matGold);
      neck.position.set(0, 1.23, -0.02); g.add(neck);
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.17, 20, 16), matGold);
      head.scale.set(0.95, 1.12, 1.0); head.position.set(0, 1.42, 0); g.add(head);
      for (const sd of [-1, 1]) {                         // the long ears
        const ear = new THREE.Mesh(new THREE.CapsuleGeometry(0.03, 0.16, 4, 6), matGold);
        ear.position.set(sd * 0.165, 1.38, -0.01); g.add(ear);
      }
      // the curls and the flame of the ushnisha
      const crown = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), matGold);
      crown.position.set(0, 1.56, 0); g.add(crown);
      const flame = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.24, 10), matGold);
      flame.position.set(0, 1.76, 0); g.add(flame);
      g.traverse(o => { if (o.isMesh) { o.castShadow = !LOW; o.receiveShadow = true; } });
      /* (v21.16: never drawn. Every one of these stands in for Chad's Buddha until it lands and was hidden then; a
         Buddha built of balls and capsules is a block figure, and Chad's rule is none anywhere — a failed download
         leaves the place bare) */
      g.visible = false;
      return g;
    }

    /* THE TWO DAISES (v16.1). v16.0 had one, the Ajarn's, in the sala's
       north-east corner; Chad: Sak Yant is "done in a private room ... and
       definitely not at the temple area where monks sit". So the dais in the
       sala is the MONK's now, dressed with a monk's things, and the Ajarn's —
       with every tool of the work, the stool and the rod — stands in the
       private room. One recipe builds both: a raised lacquered platform, a
       woven mat, the raised block the seated man sits on (the seat itself is
       sized to his hips when he lands, `seatUnder`), and the day's offerings
       piled at its front edge. */
    function mkDais(D, SEAT, parent) {
      const g = new THREE.Group(); g.position.set(D.x - parent.position.x, SALA.floor, D.z - parent.position.z); g.rotation.y = D.ry || 0; parent.add(g);
      const pile = new THREE.Group(); pile.position.set(-0.85, D.h + 0.01, 0.82); g.add(pile);
      box(D.w, D.h, D.d, 0, D.h / 2, 0, matWood, g);
      box(D.w + 0.05, 0.05, D.d + 0.05, 0, D.h, 0, matGold, g);
      box(D.w + 0.05, 0.08, D.d + 0.05, 0, 0.04, 0, matGold, g);
      const pm = new THREE.Mesh(new THREE.PlaneGeometry(D.w - 0.2, D.d - 0.2), matMat);
      pm.rotation.x = -Math.PI / 2; pm.position.y = D.h + 0.005; g.add(pm);
      const seat = box(0.62, 0.34, 0.52, SEAT.x - D.x, D.h + 0.17, SEAT.z - D.z - 0.06, matWoodD, g);
      const riser = box(1.0, 0.36, 0.95, SEAT.x - D.x, D.h + 0.18, SEAT.z - D.z + 0.05, matRed, g);
      const riserTop = box(1.04, 0.04, 0.99, SEAT.x - D.x, D.h + 0.36, SEAT.z - D.z + 0.05, matGold, g);
      const cushion = box(0.66, 0.06, 0.56, SEAT.x - D.x, D.h + 0.37, SEAT.z - D.z - 0.06, new THREE.MeshStandardMaterial({ color: 0xc7a24e, roughness: 0.8 }), g);
      /* v17.1: the seat's gilt lip and its back — a low throne, sized to the
         man who sits on it once he has landed (seatOnSkin) */
      const seatLip = box(0.64, 0.03, 0.54, SEAT.x - D.x, D.h + 0.35, SEAT.z - D.z - 0.06, matGold, g);
      const back = box(0.66, 0.6, 0.06, SEAT.x - D.x, D.h + 0.7, SEAT.z - D.z - 0.36, matRed, g);
      const backTop = box(0.7, 0.04, 0.09, SEAT.x - D.x, D.h + 1.0, SEAT.z - D.z - 0.36, matGold, g);
      back.visible = backTop.visible = false;
      seat.userData.base = D.h; seat.userData.cushion = cushion;
      Object.assign(seat.userData, { riser, riserTop, seatLip, back, backTop });
      for (let i = 0; i < 4; i++) {
        const t = mkTray(); t.position.set((i % 2) * 0.42, 0, Math.floor(i / 2) * -0.34);
        t.rotation.y = hash(i + D.x, 9) * 0.6 - 0.3; pile.add(t);
      }
      return { g, pile, seat, cushion };
    }

    /* THE MONK'S DAIS, where the Ajarn's stood: the alms bowl on its stand,
       the silver bowl of lustral water with its whisk of grass stalks (what he
       blesses you with), the ceremonial fan leaning at his side, a spool of
       white string, his thermos and glass */
    /* v16.9: the dais is TURNED to face the hall from the east wall, so the
       seat is given in its own frame (MONL) and everything on it is placed
       in that frame too (L); bowlPos is the world point, through mdW */
    const monkD = mkDais(MD, { x: MD.x + MONL.x, z: MD.z + MONL.z }, world);
    const offerPile = monkD.pile;
    const bowlL = { x: MONL.x + 0.42, z: MONL.z + 0.62 };      // the silver bowl, in the dais's own frame (v19.1: placeBowl moves it)
    const bowlW = mdW(bowlL.x, bowlL.z);
    const bowlPos = new THREE.Vector3(bowlW.x, SALA.floor + MD.h + 0.04, bowlW.z);
    let whisk = null, bowlG = null, almsG = null;
    {
      const g = monkD.g, L = (x, z) => [x, z];
      /* v19.1: each bowl is ONE group, so placeBowl() can move it once the
         throne has been built round him */
      const [ax, az] = L(MONL.x - 0.72, MONL.z + 0.35);
      almsG = new THREE.Group(); almsG.position.set(ax, 0, az); g.add(almsG);
      cyl(0.09, 0.07, 0.12, 0, MD.h + 0.06, 0, matGold, 14, almsG);                     // the alms bowl's stand
      const bowl = new THREE.Mesh(new THREE.SphereGeometry(0.14, 18, 10, 0, Math.PI * 2, 0, Math.PI * 0.62), new THREE.MeshStandardMaterial({ color: 0x141210, roughness: 0.35 }));
      bowl.rotation.x = Math.PI; bowl.position.set(0, MD.h + 0.24, 0); bowl.castShadow = !LOW; almsG.add(bowl);
      const lid = new THREE.Mesh(new THREE.SphereGeometry(0.13, 18, 8, 0, Math.PI * 2, 0, Math.PI * 0.35), bowl.material);
      lid.position.set(0, MD.h + 0.2, 0); almsG.add(lid);
      // the lustral water: a silver bowl, the water in it, the whisk resting across it
      const [bx, bz] = L(bowlL.x, bowlL.z);
      bowlG = new THREE.Group(); bowlG.position.set(bx, 0, bz); g.add(bowlG);
      const silver = new THREE.MeshStandardMaterial({ color: 0xd4d6d8, roughness: 0.25, metalness: 0.85 });
      const kb = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.09, 0.09, 22, 1, true), silver);
      kb.material.side = THREE.DoubleSide; kb.position.set(0, MD.h + 0.05, 0); bowlG.add(kb);
      cyl(0.09, 0.09, 0.012, 0, MD.h + 0.006, 0, silver, 22, bowlG);
      const water = new THREE.Mesh(new THREE.CircleGeometry(0.125, 22), new THREE.MeshStandardMaterial({ color: 0x9fb8c0, roughness: 0.05, metalness: 0.2, transparent: true, opacity: 0.8 }));
      water.rotation.x = -Math.PI / 2; water.position.set(0, MD.h + 0.07, 0); bowlG.add(water);
      /* the whisk is a WORLD object the frame puts in his hand while he
         blesses (monkArm), and back across the bowl when he is done */
      whisk = new THREE.Group(); world.add(whisk);
      const stalk = new THREE.MeshStandardMaterial({ color: 0xc9b77a, roughness: 0.8 });
      for (let k = 0; k < 9; k++) {
        const a = k / 9 * Math.PI * 2, r = 0.012 + (k % 3) * 0.004;
        const st = new THREE.Mesh(new THREE.CylinderGeometry(0.0025, 0.0035, 0.34, 4), stalk);
        st.position.set(Math.cos(a) * r, 0, 0.17 + Math.sin(a) * r * 0.2);
        st.rotation.x = Math.PI / 2; st.rotation.z = (hash(k, 5) - 0.5) * 0.25; whisk.add(st);
      }
      const band = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.05, 10), new THREE.MeshStandardMaterial({ color: 0xf2efe6, roughness: 0.7 }));
      band.rotation.x = Math.PI / 2; band.position.z = 0.03; whisk.add(band);
      whisk.userData.tip = new THREE.Vector3(0, 0, 0.34);
      // the ceremonial fan (talapat): a disc on a long handle, leaning on the seat
      const fan = new THREE.Group(); const [fx, fz] = L(MONL.x + 0.62, MONL.z - 0.05);
      fan.position.set(fx, MD.h, fz); fan.rotation.z = -0.28; g.add(fan);
      cyl(0.012, 0.012, 1.1, 0, 0.55, 0, matWoodD, 6, fan);
      const disc = new THREE.Mesh(new THREE.CircleGeometry(0.22, 24), new THREE.MeshStandardMaterial({ color: 0xa8541c, roughness: 0.6, side: THREE.DoubleSide }));
      disc.position.set(0, 1.18, 0.01); fan.add(disc);
      const rim = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.012, 6, 24), matGold); rim.position.copy(disc.position); fan.add(rim);
      // the white string, the thermos and the glass
      const [sx, sz] = L(MONL.x - 0.45, MONL.z + 0.72);
      cyl(0.035, 0.035, 0.05, sx, MD.h + 0.025, sz, new THREE.MeshStandardMaterial({ color: 0xf6f3ea, roughness: 0.9 }), 12, g);
      const [tx, tz] = L(MONL.x + 0.9, MONL.z - 0.25);
      cyl(0.05, 0.05, 0.3, tx, MD.h + 0.15, tz, new THREE.MeshStandardMaterial({ color: 0x8a2a24, roughness: 0.4, metalness: 0.3 }), 12, g);
      cyl(0.03, 0.028, 0.09, tx - 0.12, MD.h + 0.045, tz + 0.08, new THREE.MeshStandardMaterial({ color: 0xc8dce0, roughness: 0.1, transparent: true, opacity: 0.6 }), 10, g);
    }

    /* ======================================================= THE PRIVATE ROOM
       A kuti's back room, plain and full: limewashed walls with a dark
       wainscot, a plank floor, a shelf-shrine on the back wall behind the
       Ajarn's dais (Buddha images, the hermit Ruesi who is the patron of the
       craft, photographs of old masters, candles, garlands, incense), cloths
       printed with yants on the walls, a shuttered window with the dawn coming
       through it, a ceiling fan and a standing fan, the waiting mat with a
       water jug and cups, and the door he came in by. Lit WITHOUT A LIGHT
       (v9.4): the lamps are emissive and their pools are painted; the room's
       own look is a daylight preset applied in the black (ROOMLIGHT). */
    const roomG = new THREE.Group(); roomG.position.set(ROOM.x, 0, ROOM.z); world.add(roomG);
    const roomFans = [];
    let roomLeaf = null, standHead = null, roomSmoke = null;
    const roomLamps = [];
    {
      const F = SALA.floor, W = ROOM.hw * 2, D = ROOM.z1 - ROOM.z0, CZ = (ROOM.z0 + ROOM.z1) / 2, H = ROOM.h;
      const Z0 = ROOM.z0, Z1 = ROOM.z1, HW = ROOM.hw;
      box(W + 0.6, F, D + 0.6, 0, F / 2, CZ, matStone, roomG, false);
      const wood2 = woodTex.clone(); wood2.needsUpdate = true; wood2.repeat.set(W / 1.6, D / 1.6); madeTex.push(wood2);
      const fl = new THREE.Mesh(new THREE.PlaneGeometry(W, D), new THREE.MeshStandardMaterial({ map: wood2, roughness: 0.5, color: 0xd8c0a0 }));
      fl.rotation.x = -Math.PI / 2; fl.position.set(0, F + 0.004, CZ); fl.receiveShadow = true; roomG.add(fl);
      const mRW = new THREE.MeshStandardMaterial({ map: wallTex, color: 0xeedcc2, roughness: 0.95 });
      const mWain = new THREE.MeshStandardMaterial({ color: 0x4a2c1c, roughness: 0.7 });
      const wall = (w, d, x, z) => { const m = box(w, H, d, x, F + H / 2, z, mRW, roomG, false); walls.push(m); return m; };
      wall(W + 0.4, 0.2, 0, Z0 - 0.1);                           // back
      wall(0.2, D, -HW - 0.1, CZ);                               // left (west)
      wall(0.2, D, HW + 0.1, CZ);                                // right (east), the window on it
      // the front wall, round the door
      const dx = RDOOR.x - ROOM.x, dw = 0.95, dh = 2.1;
      const lw = (dx - dw / 2) + HW, rw = HW - (dx + dw / 2);
      wall(lw + 0.2, 0.2, -HW - 0.1 + (lw + 0.2) / 2, Z1 + 0.1);
      wall(rw + 0.2, 0.2, HW + 0.1 - (rw + 0.2) / 2, Z1 + 0.1);
      box(dw, H - dh, 0.2, dx, F + dh + (H - dh) / 2, Z1 + 0.1, mRW, roomG, false);
      // the wainscot, a dark band round the room, and a skirting rail
      box(W, 0.9, 0.03, 0, F + 0.45, Z0 + 0.015, mWain, roomG, false);
      box(0.03, 0.9, D, -HW + 0.015, F + 0.45, CZ, mWain, roomG, false);
      box(0.03, 0.9, D, HW - 0.015, F + 0.45, CZ, mWain, roomG, false);
      box(lw, 0.9, 0.03, -HW + lw / 2, F + 0.45, Z1 - 0.015, mWain, roomG, false);
      box(rw, 0.9, 0.03, HW - rw / 2, F + 0.45, Z1 - 0.015, mWain, roomG, false);
      // the ceiling, dark boards, and a beam across
      box(W, 0.08, D, 0, F + H + 0.04, CZ, new THREE.MeshStandardMaterial({ color: 0x8a6446, roughness: 0.85 }), roomG, false);
      box(0.18, 0.2, D, -0.9, F + H - 0.1, CZ, matWoodD, roomG, false);
      // the door, from inside: its frame, and the leaf on a hinge at its left
      const fr = new THREE.MeshStandardMaterial({ color: 0x3a2416, roughness: 0.6 });
      box(0.08, dh + 0.08, 0.26, dx - dw / 2 - 0.04, F + (dh + 0.08) / 2, Z1, fr, roomG, false);
      box(0.08, dh + 0.08, 0.26, dx + dw / 2 + 0.04, F + (dh + 0.08) / 2, Z1, fr, roomG, false);
      box(dw + 0.16, 0.08, 0.26, dx, F + dh + 0.04, Z1, fr, roomG, false);
      roomLeaf = new THREE.Group(); roomLeaf.position.set(dx - dw / 2, F, Z1 - 0.02); roomG.add(roomLeaf);
      const leafM = new THREE.MeshStandardMaterial({ color: 0x6a3e22, roughness: 0.55 });
      box(dw, dh, 0.045, dw / 2, dh / 2, 0, leafM, roomLeaf, false);
      for (const y of [0.55, 1.45]) box(dw - 0.16, 0.6, 0.02, dw / 2, y, -0.03, matWoodD, roomLeaf, false);
      const knob = new THREE.Mesh(new THREE.SphereGeometry(0.03, 10, 8), matGold); knob.position.set(dw - 0.1, 1.0, -0.05); roomLeaf.add(knob);
      /* the dark passage behind it (never shown lit): a box seen from inside,
         deep enough that the leaf, which opens OUTWARD (CP6: opening inward it
         swung into the face of a man walking up to it), stays inside it */
      const beyond = new THREE.Mesh(new THREE.BoxGeometry(1.6, dh + 0.1, 1.4), new THREE.MeshBasicMaterial({ color: 0x0a0806, side: THREE.BackSide }));
      beyond.position.set(dx, F + dh / 2, Z1 + 0.2 + 0.7); roomG.add(beyond);

      /* v18.7 · THE BACK WALL IS THE MASKS, THE EAST WALL THE ALTAR (Chad:
         "use this row of lersi masks model to completely replace the existing
         ones ... mounted on the wall prominently, instead of on the floor. The
         row of masks must be behind the AJ Krukai, instead of the buddha
         statues" — and "'row of altar statues', this replaces the rows of
         buddha statues completely ... move this to the sidewall, but it still
         must be easily seen by the player the moment he enters the room").
         v16.1's shelf-shrine — its two boards, the pack's Buddhas, the two
         standing deities and the Ruesi — is gone with v16.9's Khon stand. What
         stood on the shrine and was not a statue MOVED with the altar: the
         four candles, the incense pot and its smoke, the two garlands, and
         the old masters' three photographs, hung over it. Both rows are
         Chad's scans (tools/prepwess.mjs), on their base centre, facing +z. */
      const sx = DAIS.x - ROOM.x;
      const MASK_S = 1.15, MASK_Y = F + 1.30;                 // 2.19 m wide, F+1.30..F+2.91 (the ceiling is F+3.0)
      const ALT_S = 1.1, ALT_W = 1.904 * ALT_S, ALT_D = 0.889 * ALT_S;
      /* v19.1 · THE ALTAR ROW ON THE BACK WALL, BESIDE THE MASKS (Chad: "the
         row of altar statues with the buddha statues should be right next to
         the row of lersi masks, also mounted on the same wall at the same
         height, if not slightly higher. But keep it some distance away from
         the masks"). v18.7 stood it on a floor plinth against the east wall;
         it is a WALL SHELF now, on the back wall to the masks' left (to their
         right there is 1.4 m of wall, and the row is 2.09 m wide), 0.40 m
         clear of them, its top board at F+1.40 — the masks' scan starts at
         F+1.30, so the row stands a hand higher. The ledge in front of the
         row carries what the plinth carried: the candles, the incense pot and
         its smoke, the garlands. Nobody walks under a shrine: a blocker fills
         the space below it.
         v19.3 (Chad: "the altar of buddha statues need to be moved higher, it
         should not be below the row of lersi masks"): at F+1.40 the row stood
         1.22 m tall and its top was 0.29 m under the masks' top (F+2.91), so it
         read as hanging below them. The shelf is at F+1.70 now: the row's top
         at F+2.92, level with the masks' and a little over (the ceiling is
         F+3.0, its centre spire 8 cm under it), its foot 0.40 m above theirs.
         The ceiling beam at x −0.9 crosses the row's right end, where the
         statues are 0.84–0.91 m tall — measured off the scan, F+2.62 at most
         against the beam's F+2.80. */
      const MASK_X0 = sx - 1.903 * MASK_S / 2;                // the masks' left edge
      const SH_Y = F + 1.70, SH_T = 0.07, PL_D = ALT_D + 0.2; // the shelf's top, its board, its depth (the row and a ledge)
      const ALT_CX = MASK_X0 - 0.40 - ALT_W / 2;              // the row's centre, 0.40 m left of the masks
      const ALT_CZ = Z0 + 0.02 + ALT_D / 2, LEDGE_Z = Z0 + PL_D - 0.09, SH_CZ = Z0 + PL_D / 2;
      function wallScan(key, x, y, z, ry, sc, stand) {
        parseOnce(key).then(gltf => {
          if (!alive) return;
          const m = gltf.scene.clone(true);
          m.scale.setScalar(sc); m.position.set(x, y, z); m.rotation.y = ry;
          m.traverse(o => { if (o.isMesh) { o.castShadow = false; o.receiveShadow = true; } });
          roomG.add(m);
          for (const h of stand) h.visible = false;
        }).catch(err => { console.warn(key + ' failed to load', err); ctx.loadFail && ctx.loadFail(key, err); });
      }
      // the masks: the scan's back (its brackets) flush on the back wall, centred over him
      {
        const stand = [box(2.1, 0.05, 0.36, sx, MASK_Y + 0.05, Z0 + 0.19, matRed, roomG, false),
                       box(2.1, 0.05, 0.36, sx, MASK_Y + 0.75, Z0 + 0.19, matRed, roomG, false)];
        wallScan('lersimask', sx, MASK_Y, Z0 + 0.012 + 0.308 * MASK_S, 0, MASK_S, stand);
      }
      // the altar row on its wall shelf, to the masks' left, facing the room
      {
        const SW = ALT_W + 0.16;
        box(SW, SH_T, PL_D, ALT_CX, SH_Y - SH_T / 2, SH_CZ, matRed, roomG, false);             // the board
        /* v19.3: the gilt edge's top 5 mm UNDER the board's (Chad: "when player
           is moving near to the altar of buddha statues, there is a flickering
           glitchy red texture on the shelf"). Both tops were at SH_Y exactly,
           so the red board and the gold band fought over every pixel of the
           shelf's top — a flicker that moves as the eye moves. */
        box(SW + 0.04, 0.035, PL_D + 0.02, ALT_CX, SH_Y - 0.005 - 0.0175, SH_CZ + 0.01, matGold, roomG, false);
        box(SW + 0.04, 0.05, 0.03, ALT_CX, SH_Y - SH_T - 0.02, Z0 + PL_D + 0.005, matGold, roomG, false);   // its gilt lip, hanging under the front
        // three brackets under it, red with a gilt edge, from the wall
        const brk = new THREE.Shape(); brk.moveTo(0, 0); brk.lineTo(0, -0.46); brk.quadraticCurveTo(0.12, -0.12, PL_D - 0.18, 0); brk.closePath();
        const brkG = new THREE.ExtrudeGeometry(brk, { depth: 0.05, bevelEnabled: false });
        for (const bx of [-SW / 2 + 0.16, 0, SW / 2 - 0.16]) {
          const b = new THREE.Mesh(brkG, matRed); b.rotation.y = -Math.PI / 2;
          b.position.set(ALT_CX + bx - 0.025, SH_Y - SH_T, Z0); roomG.add(b);
          const e = new THREE.Mesh(brkG, matGold); e.rotation.y = -Math.PI / 2; e.scale.set(1, 1, 0.3);
          e.position.set(ALT_CX + bx + 0.012, SH_Y - SH_T - 0.004, Z0); roomG.add(e);
        }
        solids.push(hid(box(SW, SH_Y - SH_T - F, PL_D, ALT_CX, F + (SH_Y - SH_T - F) / 2, SH_CZ, matProxy, roomG, false)));
        const stand = [mkBuddha(ALT_CX, SH_Y, ALT_CZ, 0.36, roomG)];
        /* v19.3: 3 mm off the board — the scan's base cloth is flat at its
           y = 0, and sat on SH_Y it was a second coplanar face on the shelf */
        wallScan('altarrow', ALT_CX, SH_Y + 0.003, ALT_CZ, 0, ALT_S, stand);
      }
      /* v19.1: the old masters' three photographs that hung over the altar
         are gone (Chad: "also remove all the generated monk portraits that
         look bad") */
      // candles on the shelf's ledge, the incense pot at its far end, and the smoke
      const LY = SH_Y;
      for (const ex of [-0.95, -0.8, 0.8, 0.95]) {
        thai('candle', ALT_CX + ex, LY, LEDGE_Z, { s: 0.4, parent: roomG, cast: false,
          hide: [cyl(0.018, 0.018, 0.16, ALT_CX + ex, LY + 0.08, LEDGE_Z, new THREE.MeshStandardMaterial({ color: 0xf3e4b0, roughness: 0.6 }), 8, roomG)] });
        const f = new THREE.Mesh(new THREE.SphereGeometry(0.014, 8, 6), new THREE.MeshBasicMaterial({ color: 0xffc46a, transparent: true, opacity: 0.95, fog: false }));
        f.scale.set(1, 1.8, 1); f.position.set(ALT_CX + ex, LY + 0.18, LEDGE_Z); roomG.add(f); candles.push(f);
      }
      {
        const ix = ALT_CX - ALT_W / 2 + 0.02;                 // the end away from the masks: its smoke rises clear of them
        const pot = [cyl(0.1, 0.08, 0.1, ix, LY + 0.05, LEDGE_Z, matGold, 14, roomG)];
        for (let k = 0; k < 4; k++) {
          const st = cyl(0.004, 0.004, 0.26, ix - 0.03 + k * 0.02, LY + 0.2, LEDGE_Z, matRedD, 3, roomG);
          st.rotation.z = (k - 1.5) * 0.08; pot.push(st);
        }
        thai('incense', ix, LY, LEDGE_Z, { s: 0.42, parent: roomG, cast: false, hide: pot });   // v16.6
        if (makeSoftDot) {
          const dot = makeSoftDot(); madeTex.push(dot);
          const N = 12, geo = new THREE.BufferGeometry();
          geo.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(N * 3), 3));
          roomSmoke = new THREE.Points(geo, new THREE.PointsMaterial({ map: dot, size: 0.13, transparent: true, opacity: 0.28, depthWrite: false, color: 0xd8d0c4 }));
          roomSmoke.frustumCulled = false; roomSmoke.userData.seed = Array.from({ length: N }, (_, i) => hash(i, 11));
          roomSmoke.userData.at = new THREE.Vector3(ROOM.x + ix, LY + 0.29, ROOM.z + LEDGE_Z);
          world.add(roomSmoke);
        }
      }
      // the garlands, swagged across the shelf's front, under its lip
      for (let i = 0; i < 2; i++) {
        const pts = [], w = ALT_W + 0.1, y = SH_Y - SH_T - 0.06 - i * 0.14, z = Z0 + PL_D + 0.03 + i * 0.005;
        for (let k = 0; k <= 16; k++) { const t = k / 16; pts.push(new THREE.Vector3(ALT_CX - w / 2 + t * w, y - Math.sin(t * Math.PI) * 0.1, z)); }
        roomG.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 32, 0.022, 6, false), new THREE.MeshStandardMaterial({ color: i ? 0xf6c228 : 0xf5f0de, roughness: 0.7 })));
      }

      /* the yant cloths on the walls, framed — drawn, not downloaded. v19.1:
         the three designs Chad gave (makeYantCloth), each painted ONCE and
         shared by every cloth of it, each hung at its own proportions, and
         one more where v18.7's altar stood on the east wall */
      const YANT_A = { gao: 0.84, hah: 1.6, sroi: 0.66 }, yantMat = {};
      const cloth = (k, x, y, z, ry, w) => {
        const h = w * YANT_A[k];
        const mat = yantMat[k] || (yantMat[k] = new THREE.MeshStandardMaterial({ map: tex(makeYantCloth(THREE, cnv, k)), roughness: 0.9 }));
        const g = new THREE.Group(); g.position.set(x, y, z); g.rotation.y = ry; roomG.add(g);
        box(w + 0.06, h + 0.06, 0.025, 0, 0, 0, matWoodD, g, false);
        const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat);
        m.position.z = 0.014; g.add(m);
      };
      cloth('gao', -HW + 0.02, F + 1.75, -1.6, Math.PI / 2, 0.80);
      cloth('sroi', -HW + 0.02, F + 1.75, -0.3, Math.PI / 2, 0.92);
      cloth('hah', -HW + 0.02, F + 1.75, 1.0, Math.PI / 2, 0.50);
      cloth('gao', HW - 0.02, F + 1.8, -2.05, -Math.PI / 2, 0.80);
      cloth('hah', HW - 0.02, F + 1.8, 0.95, -Math.PI / 2, 0.50);
      cloth('sroi', HW - 0.02, F + 1.8, 1.8, -Math.PI / 2, 0.80);
      cloth('gao', 0.9, F + 1.7, Z1 - 0.02, Math.PI, 0.95);
      cloth('hah', 2.4, F + 1.7, Z1 - 0.02, Math.PI, 0.50);

      /* THE WINDOW on the east wall: a wooden frame, two shutters half open,
         and the dawn beyond them — a bright panel with the slats' shadows in
         it — throwing a painted shaft of light across the planks */
      const wz = -0.3, wy = F + 1.55;
      const win = new THREE.Group(); win.position.set(HW - 0.01, wy, wz); win.rotation.y = -Math.PI / 2; roomG.add(win);
      const glowM = new THREE.MeshBasicMaterial({ map: tex(makeDawnSlats(THREE, cnv)), fog: false });
      const gw = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 1.0), glowM); gw.position.z = -0.005; win.add(gw);
      for (const [w, h, x, y] of [[1.16, 0.08, 0, 0.54], [1.16, 0.08, 0, -0.54], [0.08, 1.16, 0.54, 0], [0.08, 1.16, -0.54, 0], [0.05, 1.0, 0, 0]])
        box(w, h, 0.08, x, y, 0.02, fr, win, false);
      for (const sd of [-1, 1]) {
        const hinge = new THREE.Group(); hinge.position.set(sd * 0.54, 0, 0.04); hinge.rotation.y = sd * 1.9; win.add(hinge);
        box(0.5, 1.0, 0.03, sd * 0.25, 0, 0, leafM, hinge, false);
        for (let k = 0; k < 6; k++) box(0.44, 0.02, 0.01, sd * 0.25, -0.4 + k * 0.16, 0.02, matWoodD, hinge, false);
      }
      const shaft = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 3.2), new THREE.MeshBasicMaterial({ color: 0xffd9a0, transparent: true, opacity: 0.04, blending: THREE.AdditiveBlending, depthWrite: false, fog: false, side: THREE.DoubleSide }));
      shaft.position.set(HW - 1.3, F + 0.95, wz); shaft.rotation.set(0, Math.PI / 2, -0.62); roomG.add(shaft);
      const pool = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 1.0), new THREE.MeshBasicMaterial({ color: 0xffc98a, transparent: true, opacity: 0.16, blending: THREE.AdditiveBlending, depthWrite: false, fog: false }));
      pool.rotation.x = -Math.PI / 2; pool.position.set(HW - 2.3, F + 0.008, wz); roomG.add(pool);

      /* the tube light on the ceiling (off at dawn but for a dim glow) and a
         warm pool under the shrine's candles */
      box(1.22, 0.05, 0.1, 0.2, F + H - 0.03, 0.6, new THREE.MeshStandardMaterial({ color: 0xe8e6e0, roughness: 0.4 }), roomG, false);
      const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 1.12, 8), new THREE.MeshBasicMaterial({ color: 0xfff6e8, fog: false }));
      tube.rotation.z = Math.PI / 2; tube.position.set(0.2, F + H - 0.08, 0.6); roomG.add(tube); roomLamps.push(tube);
      const cpool = new THREE.Mesh(new THREE.CircleGeometry(1.1, 28), new THREE.MeshBasicMaterial({ color: 0xffb870, transparent: true, opacity: 0.10, blending: THREE.AdditiveBlending, depthWrite: false, fog: false }));
      cpool.rotation.x = -Math.PI / 2; cpool.position.set(ALT_CX, F + 0.012, LEDGE_Z + 0.45); roomG.add(cpool);   // v19.1: on the floor in front of the altar's shelf, under its candles' light
      // the ceiling fan
      {
        const g = new THREE.Group(); g.position.set(-0.9, F + H - 0.42, 0.9); roomG.add(g);
        cyl(0.015, 0.015, 0.4, 0, 0.22, 0, matDark, 6, g);
        cyl(0.09, 0.09, 0.08, 0, 0, 0, matWhite, 10, g);
        const blades = new THREE.Group(); g.add(blades);
        for (let i = 0; i < 3; i++) {
          const b = box(0.6, 0.012, 0.11, 0.37, 0, 0, matWoodL, blades, false);
          b.position.set(Math.cos(i * 2.094) * 0.37, 0, Math.sin(i * 2.094) * 0.37); b.rotation.y = -i * 2.094;
        }
        roomFans.push(blades);
        // v16.6: the kit's fan, hung from the beam, turning in roomFans[0]'s place
        const kf = thai('ceilfan', -0.9, F + H - 0.66, 0.9, { s: 0.55, parent: roomG, cast: false, hide: [g],
                                 then: () => { roomFans[0] = kf; } });
      }
      // the standing fan in the corner by the door, its head turning
      {
        const g = new THREE.Group(); g.position.set(-HW + 0.45, F, Z1 - 0.5); roomG.add(g);
        cyl(0.18, 0.2, 0.04, 0, 0.02, 0, matWhite, 16, g);
        cyl(0.02, 0.02, 1.1, 0, 0.57, 0, matSteel, 8, g);
        standHead = new THREE.Group(); standHead.position.y = 1.15; g.add(standHead);
        cyl(0.07, 0.07, 0.14, 0, 0, -0.06, matWhite, 12, standHead).rotation.x = Math.PI / 2;
        const cage = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.008, 6, 28), matSteel); cage.position.z = 0.06; standHead.add(cage);
        const bl = new THREE.Group(); bl.position.z = 0.05; standHead.add(bl);
        for (let i = 0; i < 3; i++) { const b = box(0.07, 0.17, 0.01, 0, 0.09, 0, new THREE.MeshStandardMaterial({ color: 0x5c8fc0, roughness: 0.5, transparent: true, opacity: 0.8 }), bl, false); b.position.set(Math.sin(i * 2.094) * 0.09, Math.cos(i * 2.094) * 0.09, 0); b.rotation.z = -i * 2.094; }
        roomFans.push(bl); standHead.userData.blades = bl;
        solids.push(hid(box(0.4, 1.2, 0.4, -HW + 0.45, 0.6, Z1 - 0.5, matProxy, roomG, false)));
        /* v16.6: the pack's fan is an old DESK fan, so it stands on the
           cabinet and turns there (standHead is whatever turns); the corner
           it leaves keeps its blocker and gets a tall vase of papyrus */
        const pivot = new THREE.Group(); pivot.position.set(-HW + 0.3, F + 1.1, -2.35); roomG.add(pivot);
        thai('standfan', 0, 0, 0, { s: 0.6, ry: Math.PI / 2, parent: pivot, cast: false, hide: [g], then: () => { standHead = pivot; } });
        thai('vasereed', -HW + 0.45, F, Z1 - 0.5, { s: 0.75, parent: roomG, cast: false });
        thai('oillamp', -HW + 0.3, F + 1.1, -2.82, { s: 0.55, parent: roomG, cast: false });
      }
      /* (v16.9's Khon mask stand — two tiers and five masks against the back
         wall west of the shrine — removed at v18.7, Chad's word: his row of
         lersi masks on the wall behind the Ajarn replaces it.) */
      // the waiting mat, a cushion, a low table with a jug and two cups
      {
        const mx = WAIT.x - ROOM.x, mz = WAIT.z - ROOM.z;
        const mat = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 1.6), matMat);
        mat.rotation.x = -Math.PI / 2; mat.rotation.z = 0.5; mat.position.set(mx, F + 0.01, mz); mat.receiveShadow = true; roomG.add(mat);
        const cu = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.08, 0.46), new THREE.MeshStandardMaterial({ color: 0x7a2a22, roughness: 0.85 }));
        cu.position.set(mx - 0.1, F + 0.05, mz + 0.35); roomG.add(cu);
        thai('cushflat', mx - 0.1, F + 0.01, mz + 0.35, { s: 1.0, parent: roomG, ry: 0.5, hide: [cu] });   // v16.6
        const tb = new THREE.Group(); tb.position.set(-HW + 0.55, F, -0.9); roomG.add(tb);
        box(0.62, 0.05, 0.42, 0, 0.3, 0, matWoodD, tb, false);
        for (const a of [-1, 1]) for (const c of [-1, 1]) box(0.04, 0.3, 0.04, a * 0.27, 0.15, c * 0.17, matWoodD, tb, false);
        const tea = [cyl(0.06, 0.05, 0.2, -0.12, 0.43, 0, new THREE.MeshStandardMaterial({ color: 0xb8d0d8, roughness: 0.1, transparent: true, opacity: 0.6 }), 12, tb)];
        for (const cx of [0.1, 0.2]) tea.push(cyl(0.03, 0.025, 0.07, cx, 0.36, 0.05, new THREE.MeshStandardMaterial({ color: 0xece6d8, roughness: 0.5 }), 10, tb));
        const t2 = mkTray(); t2.scale.setScalar(0.8); t2.position.set(0.12, 0.33, -0.12); tb.add(t2); tea.push(t2);
        thai('teaset', 0, 0.325, 0, { s: 0.6, parent: tb, cast: false, hide: tea });   // v16.6: a brass tea set in place of the jug and cups
        solids.push(hid(box(0.62, 0.35, 0.42, -HW + 0.55, 0.18, -0.9, matProxy, roomG, false)));
      }
      // a cabinet on the west wall, and a calendar by the door
      {
        box(1.2, 1.1, 0.42, -HW + 0.21 + 0.0, F + 0.55, -2.35, matWoodD, roomG, false).rotation.y = Math.PI / 2;
        solids.push(hid(box(0.42, 1.1, 1.2, -HW + 0.21, 0.55, -2.35, matProxy, roomG, false)));
        for (let k = 0; k < 3; k++) box(0.02, 0.3, 1.1, -HW + 0.43, F + 0.25 + k * 0.33, -2.35, fr, roomG, false);
        const cal = new THREE.Mesh(new THREE.PlaneGeometry(0.34, 0.5), new THREE.MeshStandardMaterial({ map: tex(makeSignTex(THREE, cnv, '2567', '#f4efe2', '#8a1c14', 0.68)), roughness: 0.8 }));
        cal.position.set(dx + 0.95, F + 1.6, Z1 - 0.02); cal.rotation.y = Math.PI; roomG.add(cal);
      }
    }
    /* the room's own look, applied in the black when he comes in and handed
       back when he leaves (a daylight PRESET: the sky, fog and three lights,
       the viewmodel's rig too — so his hands are lit like the room) */
    const ROOMLIGHT = { bg: 0x241a12, fog: [0x2a1e16, 0.004], hemi: [0xffdcb4, 0x5a4232, 0.92],
                        key: [0xffc98a, 0.42, 16, 9, 18], fill: [0xcdbba2, 0.32], sun: 0, clouds: 0,
                        vmHemi: [0xffe6c8, 0x806a54, 0.82], vmKey: [0xffd0a0, 0.52] };

    /* THE AJARN'S DAIS, in the room: the recipe above, and every tool of the
       work — the lacquer tray of rods (the long mai sak), the ink pots, the
       cotton, the spirit lamp, his water — and in front of it the yant stool,
       facing out: you sit with your back to him. */
    const dais = mkDais(DAIS, AJ, roomG).g;
    /* v18.7 · A FRONT STEP for the customer's feet: Chad's customer sits on
       Sit_Dodge, whose toes reach ~0.6 m ahead of his hips — past the dais's
       edge, into the air. The step is the dais's own wood and gilt, as wide as
       a pair of feet needs; it has a blocker of its own (blockers()). */
    const STEP = { x: DAIS.x, z: DAIS.z + DAIS.d / 2 + 0.13, w: 1.1, d: 0.26 };
    {
      const sx0 = STEP.x - ROOM.x, sz0 = STEP.z - ROOM.z, F0 = SALA.floor;
      box(STEP.w, DAIS.h, STEP.d, sx0, F0 + DAIS.h / 2, sz0, matWood, roomG);
      box(STEP.w + 0.05, 0.05, STEP.d + 0.03, sx0, F0 + DAIS.h, sz0 + 0.012, matGold, roomG);
      box(STEP.w + 0.05, 0.08, STEP.d + 0.03, sx0, F0 + 0.04, sz0 + 0.012, matGold, roomG);
    }
    let rodG = null, stool = null, stoolTop = null;
    {
      const trayX = 0.78, trayZ = -0.2;
      box(0.46, 0.05, 0.32, trayX, DAIS.h + 0.03, trayZ, matRedD, dais);
      for (let k = 0; k < 4; k++) {
        const r = cyl(0.007, 0.007, 0.62, trayX - 0.12 + k * 0.08, DAIS.h + 0.075, trayZ, matSteel, 5, dais);
        r.rotation.x = Math.PI / 2;
      }
      for (const [dx, col] of [[0.66, 0x111111], [0.9, 0x7a5a20]]) {
        const pot = cyl(0.04, 0.035, 0.06, dx, DAIS.h + 0.06, 0.1, new THREE.MeshStandardMaterial({ color: col, roughness: 0.4 }), 10, dais);
        void pot;
      }
      cyl(0.05, 0.06, 0.1, 1.05, DAIS.h + 0.08, -0.35, new THREE.MeshStandardMaterial({ color: 0x8ab0c0, roughness: 0.15, transparent: true, opacity: 0.6 }), 10, dais);
      const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.02, 6, 4), new THREE.MeshBasicMaterial({ color: 0xffb060, fog: false }));
      lamp.scale.set(1, 1.8, 1); lamp.position.set(1.08, DAIS.h + 0.2, 0.05); dais.add(lamp); candles.push(lamp);
      cyl(0.035, 0.045, 0.1, 1.08, DAIS.h + 0.1, 0.05, matGold, 10, dais);
      const cot = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 6), matWhite); cot.scale.set(1, 0.5, 1);
      cot.position.set(0.55, DAIS.h + 0.04, 0.32); dais.add(cot);
      // the rod he is working with: a world object the frame animates
      rodG = new THREE.Group(); world.add(rodG);
      const rod = cyl(0.008, 0.012, 0.66, 0, 0, 0.33, matSteel, 6, rodG); rod.rotation.x = Math.PI / 2;
      const tip = cyl(0.002, 0.006, 0.08, 0, 0, 0.7, matDark, 4, rodG); tip.rotation.x = Math.PI / 2;
      // the stool for the yant, on the dais
      stool = box(0.5, 0.42, 0.4, CUSH.x, SALA.floor + DAIS.h + 0.21, CUSH.z, matWoodD);
      stoolTop = box(0.54, 0.05, 0.44, CUSH.x, SALA.floor + DAIS.h + 0.44, CUSH.z, new THREE.MeshStandardMaterial({ color: 0x7a2a22, roughness: 0.85 }));
    }

    /* =========================================== THE WALKWAY AND THE KUTI
       A covered walkway out of the sala's west side: a plank floor on a stone
       slab, red posts, a low balustrade both sides, a tiled roof along it, and
       lanterns; at its end the kuti — a small white building against the
       compound's west wall with a tiled gable, shuttered windows, a pair of
       shoes outside, and the door that is the way into the private room. */
    let kutiLeaf = null;
    {
      const L = WALK.x0 - WALK.x1, cx = (WALK.x0 + WALK.x1) / 2, Z = WALK.z;
      box(L, SALA.floor, WALK.hw * 2 + 0.3, cx, SALA.floor / 2, Z, matStone, world, false);
      const wood3 = woodTex.clone(); wood3.needsUpdate = true; wood3.repeat.set(L / 1.6, 1.2); madeTex.push(wood3);
      const fl = new THREE.Mesh(new THREE.PlaneGeometry(L, WALK.hw * 2), new THREE.MeshStandardMaterial({ map: wood3, roughness: 0.45 }));
      fl.rotation.x = -Math.PI / 2; fl.position.set(cx, SALA.floor + 0.012, Z); fl.receiveShadow = true; world.add(fl);   // (v16.9: over the temple's ledge, clear of it)
      /* v16.9: the posts 3.4 m (were 2.6) so the roof clears the west door's head */
      for (let x = WALK.x0 - 0.5; x >= WALK.x1 + 0.2; x -= 1.6) {
        for (const sd of [-1, 1]) {
          const post = cyl(0.08, 0.09, 3.4, x, SALA.floor + 1.7, Z + sd * (WALK.hw + 0.02), matWhite, 10); solids.push(post);
          cyl(0.1, 0.1, 0.12, x, SALA.floor + 0.3, Z + sd * (WALK.hw + 0.02), matGoldC, 10);
        }
      }
      for (const sd of [-1, 1]) {
        const zr = Z + sd * (WALK.hw + 0.02);
        box(L, 0.1, 0.14, cx, SALA.floor + 3.42, zr, matGold);                 // the beam along the posts
        const top = box(L - 0.4, 0.07, 0.12, cx - 0.2, SALA.floor + 0.62, zr, matGold); solids.push(top);
        box(L - 0.4, 0.08, 0.14, cx - 0.2, SALA.floor + 0.06, zr, matWhite);
        for (let x = WALK.x0 - 0.3; x > WALK.x1 + 0.1; x -= 0.26) cyl(0.025, 0.025, 0.52, x, SALA.floor + 0.34, zr, matWhite, 6);
      }
      // the roof, ridge along the walkway, tiles over a dark underside
      const rise = 0.55, run = WALK.hw + 0.4, slope = Math.hypot(rise, run), ang = Math.atan2(rise, run);
      const tl = tileTex.clone(); tl.needsUpdate = true; tl.repeat.set(L / 1.2, 1); madeTex.push(tl);
      const mT = new THREE.MeshStandardMaterial({ map: tl, roughness: 0.6, side: THREE.DoubleSide });
      for (const sd of [-1, 1]) {
        const p = new THREE.Mesh(new THREE.PlaneGeometry(L + 0.4, slope), mT);
        p.rotation.order = 'YXZ'; p.rotation.x = -Math.PI / 2 + sd * ang;
        p.position.set(cx, SALA.floor + 3.52 + rise / 2, Z + sd * run / 2); p.castShadow = !LOW; world.add(p);
        const u = new THREE.Mesh(new THREE.PlaneGeometry(L + 0.4, slope), matCeil);
        u.rotation.copy(p.rotation); u.position.copy(p.position); u.position.y -= 0.05; world.add(u);
      }
      box(L + 0.4, 0.1, 0.1, cx, SALA.floor + 3.52 + rise + 0.03, Z, matGold);
      // lanterns under it
      // v16.3: Lanna lanterns, yellow and white — a round red one is a Chinese temple's
      const lm = new THREE.MeshStandardMaterial({ color: 0xf2c230, roughness: 0.6, emissive: 0x5a3c06, emissiveIntensity: 0.6 });
      /* hung from the beams along the sides, so none of them stands between
         the sala and the sign over the door (CP6: the centre one did) */
      for (const [x, sd] of [[WALK.x0 - 1.3, 1], [cx, -1], [WALK.x1 + 1.3, 1]]) {
        const lz = Z + sd * (WALK.hw - 0.12);
        cyl(0.004, 0.004, 0.5, x, SALA.floor + 3.2, lz, matDark, 4);
        const l = new THREE.Mesh(new THREE.SphereGeometry(0.14, 10, 8), lm); l.scale.set(1, 1.25, 1); l.position.set(x, SALA.floor + 2.8, lz); world.add(l);
      }
      // the sign at the sala's end: the way to the Ajarn
      const sg = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.34), new THREE.MeshStandardMaterial({ map: tex(makeSignTex(THREE, cnv, 'SAK YANT  →', '#6d140e', '#f6e6b8', 2.65)), roughness: 0.7, side: THREE.DoubleSide }));
      sg.position.set(WALK.x0 - 1.3, SALA.floor + 2.9, Z + WALK.hw - 0.02); world.add(sg);
      /* v16.9 · THE WEST DOOR, where the walkway meets the temple: the
         middle window pair of the west wall was cut to the floor (tools/
         preptemple.mjs); lacquered red jambs with a gold edge cover the cut,
         and its two leaves stand open, flat against the hall's wall */
      const DH = 3.7, jz = [WDOOR.z0, WDOOR.z1];
      for (const [k, zj] of jz.entries()) {
        const zc = zj + (k ? 0.05 : -0.05);
        box(0.62, DH, 0.1, WDOOR.x, SALA.floor + DH / 2, zc, matRedD, world, false);
        box(0.64, DH, 0.02, WDOOR.x, SALA.floor + DH / 2, zc + (k ? -0.06 : 0.06), matGold, world, false);
        const lf = new THREE.Group(); lf.position.set(SALA.x0 + 0.04, SALA.floor, zj + (k ? 0.1 : -0.1)); world.add(lf);
        const w = 0.66;
        box(0.05, DH - 0.12, w, 0, (DH - 0.12) / 2, (k ? 1 : -1) * w / 2, matRed, lf, false);
        box(0.02, DH - 0.5, w - 0.14, 0.03, (DH - 0.12) / 2, (k ? 1 : -1) * w / 2, matGoldC, lf, false);
      }
      box(0.62, 0.12, WDOOR.z1 - WDOOR.z0 + 0.2, WDOOR.x, SALA.floor + DH + 0.06, (WDOOR.z0 + WDOOR.z1) / 2, matRedD, world, false);
    }
    {
      const K = KUTI, cx = (K.x0 + K.x1) / 2, cz = (K.z0 + K.z1) / 2, L = K.z1 - K.z0, Wd = K.x1 - K.x0;
      box(Wd + 0.3, SALA.floor, L + 0.3, cx, SALA.floor / 2, cz, matStone, world, false);
      walls.push(box(Wd, K.h, L, cx, SALA.floor + K.h / 2, cz, matWall));
      box(Wd + 0.02, 0.5, L + 0.02, cx, SALA.floor + 0.25, cz, matStone, world, false);    // the base band
      /* the gable faces the walkway: a roof whose ridge runs east–west, built
         with its ridge along a local z and turned a quarter */
      const rg = new THREE.Group(); rg.position.set(cx + 0.3, 0, cz); rg.rotation.y = Math.PI / 2; world.add(rg);
      const eave = SALA.floor + K.h, ridge = eave + 1.5, hw = L / 2 + 0.45, len = Wd + 0.9;
      const rise = ridge - eave, slope = Math.hypot(rise, hw), ang = Math.atan2(rise, hw);
      for (const sd of [-1, 1]) {
        const p = new THREE.Mesh(new THREE.PlaneGeometry(slope, len), matTile);
        p.rotation.order = 'ZYX'; p.rotation.x = -Math.PI / 2; p.rotation.z = -sd * ang;
        p.position.set(sd * hw / 2, (eave + ridge) / 2, 0); p.castShadow = !LOW; rg.add(p);
        const u = new THREE.Mesh(new THREE.PlaneGeometry(slope, len), matCeil);
        u.rotation.copy(p.rotation); u.position.copy(p.position); u.position.y -= 0.05; rg.add(u);
      }
      box(0.14, 0.18, len, 0, ridge + 0.05, 0, matGold, rg);
      const tri = new THREE.Shape();
      tri.moveTo(-hw * 0.9, 0); tri.lineTo(hw * 0.9, 0); tri.lineTo(0, rise * 0.92); tri.closePath();
      const gab = new THREE.Mesh(new THREE.ShapeGeometry(tri), matGoldC); gab.position.set(0, eave + 0.02, len / 2 - 0.3); rg.add(gab);
      for (const sd of [-1, 1]) {
        const b = box(slope + 0.3, 0.16, 0.1, sd * hw / 2, (eave + ridge) / 2 + 0.08, len / 2 - 0.25, matGold, rg);
        b.rotation.z = -sd * ang;
      }
      const cf = [];
      for (let i = 0; i <= 10; i++) { const k = i / 10; cf.push(new THREE.Vector3(0, ridge + k * 0.7, len / 2 - 0.25 + k * k * 0.4)); }
      rg.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(cf), 16, 0.035, 6, false), matGold));
      // the front: the door in its frame, shuttered windows either side
      const X = K.x1 + 0.005, fr = new THREE.MeshStandardMaterial({ color: 0x3a2416, roughness: 0.6 });
      const dw = 0.95, dh = 2.1;
      box(0.1, dh + 0.12, 0.1, X + 0.04, SALA.floor + (dh + 0.12) / 2, KDOOR.z - dw / 2 - 0.05, fr);
      box(0.1, dh + 0.12, 0.1, X + 0.04, SALA.floor + (dh + 0.12) / 2, KDOOR.z + dw / 2 + 0.05, fr);
      box(0.12, 0.12, dw + 0.22, X + 0.04, SALA.floor + dh + 0.06, KDOOR.z, fr);
      const dark = new THREE.Mesh(new THREE.PlaneGeometry(dw, dh), new THREE.MeshBasicMaterial({ color: 0x0c0906 }));
      dark.position.set(X + 0.002, SALA.floor + dh / 2, KDOOR.z); dark.rotation.y = Math.PI / 2; world.add(dark);
      kutiLeaf = new THREE.Group(); kutiLeaf.position.set(X + 0.03, SALA.floor, KDOOR.z - dw / 2); world.add(kutiLeaf);
      const leafM = new THREE.MeshStandardMaterial({ color: 0x7a4626, roughness: 0.55 });
      box(0.045, dh, dw, 0, dh / 2, dw / 2, leafM, kutiLeaf);
      for (const y of [0.55, 1.45]) box(0.02, 0.6, dw - 0.16, 0.03, y, dw / 2, matWoodD, kutiLeaf, false);
      box(0.02, 0.22, 0.5, 0.035, 1.62, dw / 2, new THREE.MeshStandardMaterial({ map: tex(makeYantCloth(THREE, cnv, 'gao', 0.44)), roughness: 0.8 }), kutiLeaf, false);   // v19.1: a Gao Yord, 0.5 x 0.22
      const knob = new THREE.Mesh(new THREE.SphereGeometry(0.03, 10, 8), matGold); knob.position.set(0.05, 1.0, dw - 0.1); kutiLeaf.add(knob);
      for (const wz of [KDOOR.z - 1.75, KDOOR.z + 1.75]) {
        const g = new THREE.Group(); g.position.set(X + 0.02, SALA.floor + 1.55, wz); world.add(g);
        box(0.06, 1.0, 0.9, 0, 0, 0, fr, g, false);
        for (const sd of [-1, 1]) {
          box(0.03, 0.92, 0.4, 0.035, 0, sd * 0.21, leafM, g, false);
          for (let k = 0; k < 6; k++) box(0.01, 0.02, 0.36, 0.055, -0.36 + k * 0.145, sd * 0.21, matWoodD, g, false);
        }
      }
      // the sign over the door, a lamp beside it, and someone's shoes outside
      const sign = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 0.3), new THREE.MeshStandardMaterial({ map: tex(makeSignTex(THREE, cnv, 'PRIVATE ROOM · AJARN', '#1f1712', '#e9c46a', 3.7)), roughness: 0.7 }));
      sign.position.set(X + 0.03, SALA.floor + dh + 0.36, KDOOR.z); sign.rotation.y = Math.PI / 2; world.add(sign);
      const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.09, 12, 8), new THREE.MeshStandardMaterial({ color: 0xfff0d0, emissive: 0xffc070, emissiveIntensity: 0.9, roughness: 0.4 }));
      lamp.position.set(X + 0.2, SALA.floor + 2.05, KDOOR.z + 0.78); world.add(lamp);
      box(0.2, 0.03, 0.03, X + 0.1, SALA.floor + 2.14, KDOOR.z + 0.78, matDark, world, false);        // its bracket
      box(0.02, 0.14, 0.08, X + 0.01, SALA.floor + 2.12, KDOOR.z + 0.78, matDark, world, false);
      const kr = new THREE.Group(); kr.position.set(X + 0.35, 0, KDOOR.z - 0.95); world.add(kr);
      box(0.3, 0.3, 0.7, 0, SALA.floor + 0.15, 0, matWoodL, kr, false);
      for (const dz of [-0.16, 0.16]) slipperPair(kr, 0, SALA.floor + 0.3, dz, Math.PI / 2, dz < 0 ? 0x2c3e66 : 0xb3261e);   // v16.9: Chad's slippers
    }

    /* v18.8 · THE SANGKATHAN SET (Chad: "this replaces the merit set that the
       player gets at the booth ... Replace all the existing generated merit
       set models with this new model, those on the table, and also make sure
       when the player picks it up, it shows this new model"). Every set in the
       chapter is made here — the stall's six, the pile on the monk's dais, the
       one presented, the one in his hands — so his model is put in every one:
       a yellow bucket of robe and necessities under a ribbon-tied wrap
       (tools/prepwess.mjs, 52k triangles), SET_H tall on the group's origin,
       facing +z. The drawn tray stays as the stand-in until it lands (v4.7).
       `after(model)` lets a caller dress the model once it is there (the hand's
       render order). */
    const SET_H = 0.42;
    function mkTray(after) {
      const g = new THREE.Group();
      const old = new THREE.Group(); g.add(old);
      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.14, 0.05, 16),
        new THREE.MeshStandardMaterial({ color: 0xb98a3a, roughness: 0.5, metalness: 0.2 }));
      base.position.y = 0.025; old.add(base);
      // a lotus bud, marigolds, three sticks of incense, a candle, an envelope
      const lot = new THREE.Mesh(new THREE.SphereGeometry(0.045, 10, 8), new THREE.MeshStandardMaterial({ color: 0xf4b8c8, roughness: 0.6 }));
      lot.scale.set(1, 1.6, 1); lot.position.set(-0.05, 0.11, 0); old.add(lot);
      for (let k = 0; k < 7; k++) {
        const m = new THREE.Mesh(new THREE.SphereGeometry(0.028, 8, 6), new THREE.MeshStandardMaterial({ color: k % 2 ? 0xf2a11a : 0xf6c228, roughness: 0.8 }));
        const a = k / 7 * Math.PI * 2; m.position.set(Math.cos(a) * 0.11, 0.07, Math.sin(a) * 0.11); old.add(m);
      }
      for (let k = 0; k < 3; k++) {
        const st = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.26, 4), new THREE.MeshStandardMaterial({ color: 0x9a3b2a }));
        st.position.set(0.05 + k * 0.012, 0.09, -0.04); st.rotation.z = 1.35; old.add(st);
      }
      const cd = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.12, 8), new THREE.MeshStandardMaterial({ color: 0xf3e4b0 }));
      cd.position.set(0.06, 0.09, 0.07); cd.rotation.z = 1.4; old.add(cd);
      const env = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.004, 0.07), new THREE.MeshStandardMaterial({ color: 0xf6f2e8, roughness: 0.8 }));
      env.position.set(0.0, 0.058, 0.085); env.rotation.y = 0.2; old.add(env);
      parseOnce('sangkathan').then(gltf => {
        if (!alive) return;
        const bb = new THREE.Box3().setFromObject(gltf.scene), k = SET_H / (bb.max.y - bb.min.y);
        const m = gltf.scene.clone(true); m.scale.setScalar(k); m.position.y = -bb.min.y * k;
        m.traverse(o => { if (o.isMesh) { o.castShadow = !LOW; o.receiveShadow = true; } });
        g.add(m); old.visible = false;
        if (after) after(m);
      }).catch(err => { console.warn('sangkathan failed to load', err); ctx.loadFail && ctx.loadFail('sangkathan', err); });
      g.traverse(o => { if (o.isMesh) { o.castShadow = !LOW; o.receiveShadow = true; } });
      return g;
    }

    /* the mats, in rows facing the altar either side of the runner, and a
       bench along the west wall where men wait who cannot sit on the floor
       for an hour (v16.9: in the temple's hall — two columns west of the
       runner, one east of it, clear of the monk's dais) */
    for (const [mx, mz] of [[-3.7, -4.4], [-2.3, -4.4], [-3.7, -6.3], [-2.3, -6.3], [-3.7, -8.2], [-2.3, -8.2], [2.3, -4.4], [2.3, -6.3]]) {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 1.6), matMat);
      m.rotation.x = -Math.PI / 2; m.position.set(mx, SALA.floor + 0.012, mz);
      m.receiveShadow = true; world.add(m);
    }
    const BENCH = { x: -4.95, z0: -3.3, z1: -7.0 };
    box(0.5, 0.06, BENCH.z0 - BENCH.z1, BENCH.x, SALA.floor + 0.44, (BENCH.z0 + BENCH.z1) / 2, matWoodL);
    for (const z of [BENCH.z0 - 0.2, BENCH.z1 + 0.2]) solids.push(box(0.44, 0.44, 0.08, BENCH.x, SALA.floor + 0.22, z, matWoodD));
    // the waiting mat glows when it is where the player should go (the zone)
    const zone = mkZone(WAIT.x, WAIT.z); const zoneSeat = mkZone(CUSH.x, DAIS.z + DAIS.d / 2 + 0.55);
    const zoneBless = mkZone(BLESS.x, BLESS.z);          // v16.1: where to kneel before the monk
    // a low table of amulets and water bottles along the east wall (v16.9)
    {
      box(0.5, 0.36, 1.4, 4.8, SALA.floor + 0.18, -5.2, matWoodD);
      for (let i = 0; i < 6; i++) {
        const b = cyl(0.03, 0.03, 0.2, 4.72, SALA.floor + 0.46, -5.7 + i * 0.2, new THREE.MeshStandardMaterial({ color: 0xb8d8e8, transparent: true, opacity: 0.7, roughness: 0.1 }), 8);
        void b;
      }
      solids.push(hid(box(0.5, 0.36, 1.4, 4.8, SALA.floor + 0.18, -5.2, matWoodD, world, false)));
    }

    /* ------------------------------------------------ the steps and the shoes
       A wooden rack at the foot of the steps with a dozen pairs on it and more
       on the paving beside it, and the sign every temple has. */
    const myShoes = new THREE.Group(); world.add(myShoes);
    {
      const g = new THREE.Group(); g.position.set(RACK.x, 0, RACK.z); g.rotation.y = 0; world.add(g);
      for (const y of [0.05, 0.32, 0.6]) box(1.5, 0.04, 0.36, 0, y, 0, matWoodL, g);
      for (const s of [-1, 1]) for (const z of [-0.16, 0.16]) box(0.05, 0.75, 0.05, s * 0.73, 0.37, z, matWoodD, g);
      /* v16.9: Chad's slippers, a colour a pair (slipperPair) — ten on the
         rack's two lower shelves, and five kicked off on the paving beside it */
      for (let i = 0; i < 10; i++) slipperPair(g, -0.58 + (i % 5) * 0.29, i < 5 ? 0.07 : 0.34, 0, (hash(i, 6) - 0.5) * 0.12, SLIP_PAL[(i * 5) % SLIP_PAL.length]);
      for (let i = 0; i < 5; i++) slipperPair(g, -1.3 - (i % 3) * 0.45, 0, 0.35 + Math.floor(i / 3) * 0.5 + (i % 2) * 0.12, (hash(i, 4) - 0.5) * 2.2, SLIP_PAL[(i * 7 + 3) % SLIP_PAL.length], true);
      solids.push(hid(box(1.5, 0.75, 0.4, RACK.x, 0.37, RACK.z, matWoodL, world, false)));
      // the sign, on a post
      const sg = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.5),
        new THREE.MeshStandardMaterial({ map: tex(makeShoeSign(THREE, cnv)), roughness: 0.7 }));
      sg.position.set(RACK.x + 1.05, 1.35, RACK.z + 0.05); world.add(sg);
      box(0.06, 1.3, 0.06, RACK.x + 1.05, 0.65, RACK.z, matWoodD);
      box(0.96, 0.56, 0.03, RACK.x + 1.05, 1.35, RACK.z + 0.03, matWoodD);
      // HIS pair, which appears on the rack when he takes them off
      slipperPair(myShoes, 0.0, 0.62, 0.02, 0, 0x2a2622);
      myShoes.position.set(RACK.x + 0.35, 0, RACK.z); myShoes.visible = false;
      plantSlippers();                                   // every pair recorded by now (the kuti's came first)
    }

    /* ------------------------------------------------------ the offering stall
       A wooden stall with a striped awning on the west side of the path:
       trays of offering sets, garlands hanging from the awning, bundles of
       incense and candles, a cooler box, and the auntie behind it. */
    const stallTrays = [];
    {
      const g = new THREE.Group(); g.position.set(STALL.x, 0, STALL.z); g.rotation.y = Math.PI / 2; world.add(g);
      // local: +z is toward the path (world +x)
      box(3.2, 0.9, 0.9, 0, 0.45, 0, matWoodL, g);
      box(3.3, 0.06, 1.0, 0, 0.93, 0, matWoodD, g);
      for (const x of [-1.55, 1.55]) for (const z of [-0.45, 0.45]) box(0.08, 2.5, 0.08, x, 1.25, z, matWoodD, g);
      const aw = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 1.7),
        new THREE.MeshStandardMaterial({ map: tex(makeStripes(THREE, cnv)), roughness: 0.85, side: THREE.DoubleSide }));
      aw.rotation.x = -Math.PI / 2 + 0.32; aw.position.set(0, 2.45, 0.35); aw.castShadow = !LOW; g.add(aw);
      // the trays of sets along the counter
      for (let i = 0; i < 6; i++) {
        const t = mkTray(); t.position.set(-1.25 + i * 0.5, 0.96, 0.18 - (i % 2) * 0.22); g.add(t); stallTrays.push(t);
      }
      // garlands hanging from the awning's front edge
      for (let i = 0; i < 7; i++) {
        const pts = [];
        const x0 = -1.5 + i * 0.5;
        for (let k = 0; k <= 10; k++) { const t = k / 10; pts.push(new THREE.Vector3(x0 + Math.sin(t * Math.PI) * 0.03, 2.12 - t * 0.38, 0.9)); }
        const col = [0xf6c228, 0xf5f0de, 0xf2a11a][i % 3];
        /* a string of flower beads, jasmine and marigold, not a tube: a tube
           this thick read as a row of bananas from the path (CP2) */
        const bm = new THREE.MeshStandardMaterial({ color: col, roughness: 0.8 });
        const curve = new THREE.CatmullRomCurve3(pts);
        for (let k = 0; k <= 12; k++) {
          const bead = new THREE.Mesh(new THREE.SphereGeometry(0.02, 6, 4), bm);
          bead.position.copy(curve.getPoint(k / 12)); g.add(bead);
        }
        // a tassel of a rose at the foot of each
        const tas = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 6), new THREE.MeshStandardMaterial({ color: 0xc8243a, roughness: 0.7 }));
        tas.position.copy(pts[pts.length - 1]); g.add(tas);
      }
      // incense bundles, candle boxes, the cooler, and a small price board
      for (let i = 0; i < 4; i++) {
        const b = cyl(0.04, 0.04, 0.32, -1.3 + i * 0.16, 1.12, -0.32, new THREE.MeshStandardMaterial({ color: 0xa23a22, roughness: 0.8 }), 8, g);
        void b;
      }
      box(0.5, 0.36, 0.34, 1.9, 0.18, 0.1, new THREE.MeshStandardMaterial({ color: 0x2d6fb0, roughness: 0.5 }), g);
      box(0.52, 0.06, 0.36, 1.9, 0.38, 0.1, matWhite, g);
      const pb = new THREE.Mesh(new THREE.PlaneGeometry(0.62, 0.42),
        new THREE.MeshStandardMaterial({ map: tex(makePriceBoard(THREE, cnv)), roughness: 0.8 }));
      pb.position.set(1.2, 1.25, 0.47); g.add(pb);
      solids.push(hid(box(3.3, 0.9, 1.0, STALL.x, 0.45, STALL.z, matWoodL, world, false)));
      solids[solids.length - 1].rotation.y = Math.PI / 2;
    }

    /* ----------------------------------------------- the courtyard's east side
       The bodhi tree in its raised round planter with coloured cloths tied
       round it; the spirit house on its post by the gate; and across the east wall, the ubosot's long white
       flank with its gold windows and stacked roof. */
    {
      cyl(1.85, 1.95, 0.55, BODHI.x, 0.275, BODHI.z, matWhite, 28);
      /* v16.4: the rim is a RING — as a full disc it lay over the soil like a
         lid (photographed, CP2) */
      { const rim = new THREE.Mesh(new THREE.TorusGeometry(1.9, 0.07, 8, 48), matGold); rim.rotation.x = -Math.PI / 2; rim.position.set(BODHI.x, 0.57, BODHI.z); world.add(rim); }
      const soil = new THREE.Mesh(new THREE.CircleGeometry(1.8, 28), new THREE.MeshStandardMaterial({ color: 0x5a4632, roughness: 1 }));
      soil.rotation.x = -Math.PI / 2; soil.position.set(BODHI.x, 0.56, BODHI.z); world.add(soil);
      /* the tree is the kit's biggest kind (its own trunk); what devotees
         leave round it sits on the planter's rim: garlands and small figures */
      for (let i = 0; i < 9; i++) {
        const a = i / 9 * Math.PI * 2 + 0.3;
        const gm = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.02, 6, 14),
          new THREE.MeshStandardMaterial({ color: [0xf6c228, 0xf5f0de, 0xf2a11a][i % 3], roughness: 0.8 }));
        gm.rotation.x = Math.PI / 2; gm.position.set(BODHI.x + Math.cos(a) * 1.82, 0.64, BODHI.z + Math.sin(a) * 1.82); world.add(gm);
      }
      solids.push(cyl(1.95, 1.95, 1.0, BODHI.x, 0.5, BODHI.z, matWhite, 16));
      solids[solids.length - 1].visible = false;
    }
    // THE SPIRIT HOUSE on its post, by the east side of the gate
    const SPIRIT = { x: 5.4, z: 12.4 };
    {
      const g = new THREE.Group(); g.position.set(SPIRIT.x, 0, SPIRIT.z); g.rotation.y = Math.PI * 0.85; world.add(g);
      cyl(0.12, 0.14, 1.35, 0, 0.67, 0, matWhite, 10, g);
      box(0.9, 0.06, 0.9, 0, 1.36, 0, matGold, g);
      box(0.56, 0.5, 0.5, 0, 1.64, 0, matRed, g);
      for (const s of [-1, 1]) { const r = box(0.7, 0.04, 0.42, 0, 2.02, s * 0.14, matGold, g); r.rotation.x = s * 0.6; }
      const sp = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.45, 8), matGold); sp.position.set(0, 2.35, 0); g.add(sp);
      box(0.22, 0.3, 0.02, 0, 1.6, 0.26, matDark, g);
      // what people leave: red drinks with straws, a garland, figurines
      for (let i = 0; i < 3; i++) {
        cyl(0.025, 0.025, 0.14, -0.3 + i * 0.1, 1.46, 0.36, new THREE.MeshStandardMaterial({ color: 0xd21f2a, roughness: 0.3, transparent: true, opacity: 0.85 }), 8, g);
        cyl(0.003, 0.003, 0.12, -0.3 + i * 0.1 + 0.01, 1.56, 0.36, matWhite, 3, g);
      }
      const gar = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.022, 6, 16), new THREE.MeshStandardMaterial({ color: 0xf6c228, roughness: 0.8 }));
      gar.position.set(0.25, 1.44, 0.34); gar.rotation.x = Math.PI / 2; g.add(gar);
      solids.push(cyl(0.3, 0.3, 1.4, SPIRIT.x, 0.7, SPIRIT.z, matWhite, 8));
      solids[solids.length - 1].visible = false;
      /* v16.6: the pack's spirit house, carved teak on its post, in the
         primitive's place and facing the same way; and at its foot what
         people really leave there — a row of small rooster figurines */
      thai('spirit', SPIRIT.x, 0, SPIRIT.z, { s: 1.2, ry: Math.PI * 0.85, hide: [g] });
      const foot = new THREE.Group(); foot.position.set(SPIRIT.x, 0, SPIRIT.z); foot.rotation.y = Math.PI * 0.85; world.add(foot);
      for (let i = 0; i < 4; i++) thai('rooster', -0.33 + i * 0.22, 0, 0.5 + (i % 2) * 0.1, { s: 0.26, ry: 1.3 - i * 0.2, parent: foot, cast: false });
    }
    /* v17.3: the stray dog that slept here is gone (Chad: "Remove this dog") */

    /* THE UBOSOT — the ordination hall. Only its west flank is ever seen, over
       the east wall: white walls on a stepped base, tall pointed windows with
       gold frames and red shutters, the stacked red-and-green roof, the gables
       at both ends with their chofa. The monks are chanting in it. */
    {
      const L = UBO.z1 - UBO.z0, cz = (UBO.z0 + UBO.z1) / 2, cx = (UBO.x0 + UBO.x1) / 2, W = UBO.x1 - UBO.x0;
      box(W + 1.0, 0.7, L + 1.0, cx, 0.35, cz, matStone, world, false);
      const body = box(W, 5.4, L, cx, 3.4, cz, matWall); walls.push(body);
      const winTex = tex(makeUboWindow(THREE, cnv));
      const wm = new THREE.MeshStandardMaterial({ map: winTex, roughness: 0.6, emissive: 0x201004, emissiveIntensity: 0.3 });
      for (let i = 0; i < 5; i++) {
        const w = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 2.6), wm);
        w.position.set(UBO.x0 - 0.01, 3.1, UBO.z0 + 1.7 + i * (L - 3.4) / 4); w.rotation.y = -Math.PI / 2; world.add(w);
      }
      const uboFins = [];
      /* two tiers of roof, ridge along z, and the gables at the north and south ends.
         v17.5 (Chad: "Look at the roof of the other building, fix it"): the roof
         SITS ON THE WALLS now. It used to start at the wall top's height out at
         the eave, so where it crossed the wall it stood 0.8 m above it, with open
         sky between, and each slope was a zero-thickness sheet that vanished
         when seen edge-on from the courtyard. The lower tier's eave is solved so
         its slope meets the wall top; each slope is a slab with a dark wooden
         underside; the upper tier rests on the lower one over a short white
         band, as a stacked Lanna roof does. */
      const WALL_TOP = 6.1, soffit = new THREE.MeshStandardMaterial({ color: 0x4a2c1a, roughness: 0.85 });
      let lowerY = null;                         // the lower tier's surface height at a given half-width
      for (let t = 0; t < 2; t++) {
        const ridge = 10.4 + t * 1.4, hw = W / 2 + 1.2 - t * 1.5, zz0 = UBO.z0 - 0.9 + t * 1.6, zz1 = UBO.z1 + 0.9 - t * 1.6;
        const over = hw - W / 2;
        const eave = t === 0 ? (WALL_TOP + 0.08 - over * ridge / hw) / (1 - over / hw)   // the slope crosses the wall at its top
                             : lowerY(hw) + 0.6;                                          // the upper tier over a 0.6 m band
        const rise = ridge - eave, slope = Math.hypot(rise, hw), ang = Math.atan2(rise, hw);
        const tile = t ? matTile2 : matTile;
        for (const s of [-1, 1]) {
          // a slab, not a sheet: tiles on top, wood under, a gilt edge round it
          const p = new THREE.Mesh(new THREE.BoxGeometry(slope, 0.14, zz1 - zz0), [matGold, matGold, tile, soffit, matGold, matGold]);
          p.rotation.z = -s * ang;               // tilted about the RIDGE (z)
          p.position.set(cx + s * hw / 2, (eave + ridge) / 2 - 0.07 / Math.cos(ang), (zz0 + zz1) / 2);
          p.castShadow = !LOW; p.receiveShadow = true; world.add(p);
          if (t === 1) {
            // the band between the tiers, from under the lower slope up to under this one
            const dx = hw - 0.45, y0 = lowerY(dx) - 0.15, y1 = eave + 0.45 * Math.tan(ang) - 0.1;
            box(0.12, y1 - y0, zz1 - zz0 - 0.4, cx + s * dx, (y0 + y1) / 2, (zz0 + zz1) / 2, matWall);
          }
        }
        if (t === 0) { const e0 = eave, r0 = ridge, h0 = hw; lowerY = (d) => e0 + (h0 - d) * (r0 - e0) / h0; }
        box(0.2, 0.22, zz1 - zz0, cx, ridge + 0.06, (zz0 + zz1) / 2, matGold);
        for (const zz of [zz0, zz1]) {
          const tri = new THREE.Shape();
          tri.moveTo(-hw * 0.95, 0); tri.lineTo(hw * 0.95, 0); tri.lineTo(0, rise * 0.95); tri.closePath();
          const gb = new THREE.Mesh(new THREE.ShapeGeometry(tri), matGoldC);
          gb.position.set(cx, eave, zz); if (zz === zz0) gb.rotation.y = Math.PI; world.add(gb);
          /* v16.4: the naga blades up its edges (the south end faces the courtyard) */
          /* the south gable's edges: a gold bargeboard and the naga blades on
             it — without the board the blades floated over the bare roof edge
             (Chad's screenshot: "Look at the floating elements") */
          if (zz === zz1) for (const s of [-1, 1]) {
            const b = box(slope + 0.35, 0.22, 0.12, cx + s * hw / 2, (eave + ridge) / 2 + 0.1, zz + 0.06, matGold);
            b.rotation.z = -s * ang;
            nagaEdge(uboFins, cx + s * (hw + 0.1), eave + 0.05, cx, ridge + 0.15, zz + 0.06, s);
          }
          const cf = [];
          for (let i = 0; i <= 10; i++) { const k = i / 10; cf.push(new THREE.Vector3(cx, ridge + k * 1.2, zz + (zz === zz0 ? -1 : 1) * k * k * 0.7)); }
          world.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(cf), 16, 0.07, 6, false), matGold));
        }
      }
      finMesh(uboFins);
    }

    /* the lanterns, strung from the stall's awning across to the sala's corner */
    {
      const pts = [new THREE.Vector3(-8.4, 2.6, 3.2), new THREE.Vector3(-10.62, 3.05, -3.82)];   // v16.9: to the bell tower (the sala's corner is gone)
      // v16.3: yellow, white and saffron Lanna lanterns — the round red ones read as a Chinese temple
      const lms = [0xf2c230, 0xf3ecdc, 0xe8912a].map(c => new THREE.MeshStandardMaterial({ color: c, roughness: 0.6, emissive: c, emissiveIntensity: 0.12 }));
      for (let i = 0; i <= 5; i++) {
        const k = i / 5, p = pts[0].clone().lerp(pts[1], k); p.y -= Math.sin(k * Math.PI) * 0.35;
        const l = new THREE.Mesh(new THREE.SphereGeometry(0.16, 10, 8), lms[i % 3]); l.scale.set(1, 1.2, 1); l.position.copy(p); world.add(l);
      }
    }
    // THE BELL TOWER: four posts and a little tiered roof, the bell hanging in it
    const BELL = { x: -11.4, z: -4.6 };
    {
      for (const dx of [-0.8, 0.8]) for (const dz of [-0.8, 0.8]) solids.push(cyl(0.1, 0.1, 3.2, BELL.x + dx, 1.6, BELL.z + dz, matWhite, 10));
      box(2.0, 0.1, 2.0, BELL.x, 3.25, BELL.z, matGold);
      for (let i = 0; i < 2; i++) {
        for (const s of [-1, 1]) { const r = box(2.4 - i * 0.8, 0.06, 1.4 - i * 0.4, BELL.x, 3.7 + i * 0.55, BELL.z + s * 0.45, i ? matTile2 : matTile); r.rotation.x = s * 0.65; }
      }
      const bell = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.42, 0.7, 20, 1, true), new THREE.MeshStandardMaterial({ color: 0x8a6a2a, roughness: 0.35, metalness: 0.6, side: THREE.DoubleSide }));
      bell.position.set(BELL.x, 2.6, BELL.z); world.add(bell);
      const cap = new THREE.Mesh(new THREE.SphereGeometry(0.28, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), bell.material);
      cap.position.set(BELL.x, 2.95, BELL.z); world.add(cap);
      box(1.7, 0.08, 0.08, BELL.x, 3.15, BELL.z, matWoodD);
    }
    /* the bowls of lotus along the temple's base and the path (v17.1, Chad:
       "Remove all of these green/pink plants you created ... Replace with the
       lotus model from the asset pack" — the potted bougainvillea, a ball of
       green with pink spheres, is gone; the kit's footed lotus bowl stands in
       each spot, its blocker the pot's) */
    {
      for (const [x, z] of [[-4.4, 0.95], [-6.2, 0.95], [4.4, 0.95], [6.2, 0.95], [-2.8, 8.6], [2.8, 8.6]]) {
        thai('lotusbowl', x, 0, z, { s: 0.72, ry: x * 1.7 + z });
        solids.push(hid(cyl(0.36, 0.36, 0.6, x, 0.3, z, matProxy, 8)));
      }
    }

    /* ------------------------------------------------ v16.4 · THE CHEDI
       White and bell-shaped on three stepped terraces, a ring of lotus
       mouldings, a square harmika, and a gold spire of stacked rings to a
       point at 25 m — outside the west wall, so from the gate it rises clear
       of the sala on the left, and from the stall it stands over the wall. */
    {
      const g = new THREE.Group(); g.position.set(CHEDI.x, 0, CHEDI.z); world.add(g);
      let y = 0;
      for (const [w, h] of [[12, 1.0], [10, 1.0], [8, 1.0]]) {
        box(w, h, w, 0, y + h / 2, 0, matWhite, g); box(w + 0.1, 0.08, w + 0.1, 0, y + h, 0, matGold, g); y += h;
      }
      for (const [r0, h] of [[3.5, 0.6], [3.15, 0.55], [2.85, 0.5]]) {
        cyl(r0, r0 + 0.1, h, 0, y + h / 2, 0, matWhite, 32, g); cyl(r0 + 0.12, r0 + 0.12, 0.08, 0, y + h, 0, matGold, 32, g); y += h;
      }
      const bellPts = [[3.2, 0], [3.25, 0.4], [3.1, 1.6], [2.8, 2.8], [2.3, 3.9], [1.6, 4.8], [1.05, 5.4], [0.75, 5.8], [0, 5.9]].map(([a, b2]) => new THREE.Vector2(a, b2));
      const bell = new THREE.Mesh(new THREE.LatheGeometry(bellPts, 40), matWhite);
      bell.position.y = y; bell.castShadow = !LOW; bell.receiveShadow = true; g.add(bell);
      box(3.5, 0.12, 3.5, 0, y + 0.06, 0, matGold, g);                       // a gold band where the bell sits
      y += 5.6;
      box(1.9, 1.0, 1.9, 0, y + 0.5, 0, matWhite, g); box(2.1, 0.1, 2.1, 0, y + 1.0, 0, matGold, g); y += 1.05;
      for (let i = 0; i < 9; i++) { const rr = 0.85 - i * 0.07; cyl(rr, rr + 0.05, 0.4, 0, y + 0.2, 0, matGold, 20, g); y += 0.42; }
      const spire = new THREE.Mesh(new THREE.ConeGeometry(0.22, 5.2, 16), matGold);
      spire.position.y = y + 2.6; spire.castShadow = !LOW; g.add(spire);
      const ball = new THREE.Mesh(new THREE.SphereGeometry(0.16, 12, 10), matGold); ball.position.y = y + 5.35; g.add(ball);
      g.userData.top = y + 5.5;
    }

    /* ----------------------------------------- v16.4 · THE COURTYARD GROUND
       The path of big pale slabs from the gate to the steps, stone kerbs
       along it, grass verges under the walls, and glazed jars of lotus. */
    {
      const pathTex = tex(makeSlabs(THREE, cnv));
      const pm = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 14.6), new THREE.MeshStandardMaterial({ map: pathTex, roughness: 0.85 }));
      pm.rotation.x = -Math.PI / 2; pm.position.set(0, 0.008, 7.6); pm.receiveShadow = true; world.add(pm);
      pathTex.repeat.set(2, 11);
      for (const sx of [-1.36, 1.36]) box(0.12, 0.05, 14.6, sx, 0.025, 7.6, matStone, world, false);
      // grass verges under the walls (the texture's density matched to the ground's)
      const verge = (w, d, x, z) => {
        const geo = new THREE.PlaneGeometry(w, d), uv = geo.attributes.uv;
        for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * w / 260 * 46 / 46, uv.getY(i) * d / 260);
        uv.needsUpdate = true;
        const m = new THREE.Mesh(geo, matGrass); m.rotation.x = -Math.PI / 2; m.position.set(x, 0.009, z); m.receiveShadow = true; world.add(m);
        const ax = w < d;
        box(ax ? 0.1 : w, 0.06, ax ? d : 0.1, ax ? x + (x < 0 ? w / 2 : -w / 2) : x, 0.03, ax ? z : z + (z < 0 ? d / 2 : -d / 2), matStone, world, false);
      };
      verge(1.1, 37.1, -14.27, -4.25);          // the west wall (v16.9: to the moved north wall)
      verge(10.9, 1.1, -8.95, 14.27);           // the south wall, west of the gate
      verge(6.0, 1.1, 5.8, 14.27);              // the south wall, east of the gate (to the spirit house)
      verge(14.2, 1.1, 0.0, -22.77);            // the north wall, behind the temple (v16.9: moved back with it)
      // the lotus jars: glazed, a pad of leaves, two flowers and a bud
      const glaze = new THREE.MeshStandardMaterial({ color: 0x8aa89c, roughness: 0.22, metalness: 0.05 });   // celadon: a dark glaze read as a black blob (CP2)
      const water = new THREE.MeshStandardMaterial({ color: 0x3a4a3a, roughness: 0.1, metalness: 0.2 });
      const pad = new THREE.MeshStandardMaterial({ color: 0x4f7a3a, roughness: 0.7, side: THREE.DoubleSide });
      const petal = new THREE.MeshStandardMaterial({ color: 0xf0a6bf, roughness: 0.6 });
      const jarPts = [[0, 0], [0.34, 0.02], [0.5, 0.25], [0.55, 0.5], [0.46, 0.74], [0.4, 0.8], [0.44, 0.84]].map(([a, b2]) => new THREE.Vector2(a, b2));
      const jarGeo = new THREE.LatheGeometry(jarPts, 20);
      // an open lotus: a cup of petals, pointed, flaring out
      const lotusGeo = new THREE.LatheGeometry([[0, 0], [0.03, 0.01], [0.07, 0.05], [0.1, 0.1], [0.11, 0.13]].map(([a, b2]) => new THREE.Vector2(a, b2)), 8);
      for (const [jx, jz] of [[-4.2, 6.2], [-4.2, 10.2], [3.9, 10.3]]) {
        const j = new THREE.Mesh(jarGeo, glaze); j.position.set(jx, 0, jz); j.castShadow = !LOW; j.receiveShadow = true; world.add(j);
        const w = new THREE.Mesh(new THREE.CircleGeometry(0.4, 20), water); w.rotation.x = -Math.PI / 2; w.position.set(jx, 0.76, jz); world.add(w);
        const jar = [j, w];
        for (let k = 0; k < 4; k++) {
          const a = k * 1.7 + jx, lp = new THREE.Mesh(new THREE.CircleGeometry(0.14, 12, 0.3, Math.PI * 2 - 0.6), pad);
          lp.rotation.x = -Math.PI / 2; lp.position.set(jx + Math.cos(a) * 0.2, 0.775, jz + Math.sin(a) * 0.2); world.add(lp); jar.push(lp);
        }
        for (let k = 0; k < 3; k++) {
          const a = k * 2.2 + jz, fx = jx + Math.cos(a) * 0.12, fz = jz + Math.sin(a) * 0.12, h = 0.25 + k * 0.12;
          jar.push(cyl(0.008, 0.008, h, fx, 0.76 + h / 2, fz, matGreen, 4));
          const fl = new THREE.Mesh(k === 2 ? new THREE.SphereGeometry(0.05, 8, 6) : lotusGeo, petal);
          if (k === 2) fl.scale.set(1, 1.6, 1);
          fl.position.set(fx, 0.76 + h, fz); world.add(fl); jar.push(fl);
        }
        // v16.6: the pack's footed lotus bowl, the same footprint (1.0 m)
        thai('lotusbowl', jx, 0, jz, { s: 1.0, ry: jx + jz, hide: jar });
        solids.push(hid(cyl(0.55, 0.55, 0.9, jx, 0.45, jz, matStone, 8)));
      }
    }

    /* ----------------------------------------- v16.4 · THE BUDDHA GALLERY
       A covered gallery against the west wall (a phra rabiang): a white
       plinth, a blue-green glass backing, six seated gold Buddhas facing the
       courtyard, a candle before each, a lean-to tiled roof on white posts. */
    {
      const cz = (GAL.z0 + GAL.z1) / 2, L = GAL.z1 - GAL.z0, D = GAL.x1 - GAL.x0;
      box(D, 0.6, L, GAL.x0 + D / 2, 0.3, cz, matWhite);
      box(D + 0.06, 0.05, L + 0.06, GAL.x0 + D / 2, 0.62, cz, matGold);
      /* the backing stands IN FRONT of the wall's piers (they cut it in two, CP2):
         blue glass with a gold pointed niche behind each image */
      const back = new THREE.MeshStandardMaterial({ map: tex(makeNiches(THREE, cnv)), roughness: 0.4, metalness: 0.15 });
      const bp = new THREE.Mesh(new THREE.PlaneGeometry(L, 1.9), back);
      bp.rotation.y = Math.PI / 2; bp.position.set(-14.66, 1.55, cz); world.add(bp);
      box(0.06, 0.06, L, -14.64, 2.5, cz, matGold, world, false);
      const n = 6;
      for (let i = 0; i < n; i++) {
        const z = GAL.z0 + 0.45 + i * (L - 0.9) / (n - 1);
        const b = mkBuddha(GAL.x0 + 0.46, 0.62, z, 0.34); b.rotation.y = Math.PI / 2;
        thai('buddha', GAL.x0 + 0.46, 0.62, z, { s: 1.2, ry: Math.PI / 2, tint: GOLD_T, glow: 0.12, hide: [b] });   // v16.6
        cyl(0.016, 0.016, 0.1, GAL.x1 - 0.12, 0.68, z, new THREE.MeshStandardMaterial({ color: 0xf3e4b0, roughness: 0.6 }), 6);
        const fl = new THREE.Mesh(new THREE.SphereGeometry(0.014, 6, 5),
          new THREE.MeshBasicMaterial({ color: 0xffc46a, transparent: true, opacity: 0.95, fog: false }));
        fl.scale.set(1, 1.8, 1); fl.position.set(GAL.x1 - 0.12, 0.76, z); world.add(fl); candles.push(fl);
      }
      // the roof: a lean-to of tiles from over the wall down to the posts
      const x0 = GAL.x0 - 0.1, x1 = GAL.x1 + 0.55, y0 = 3.15, y1 = 2.55, run = x1 - x0, sl = Math.hypot(run, y0 - y1);
      const rf = new THREE.Mesh(new THREE.PlaneGeometry(sl, L + 0.8), matTile);
      rf.rotation.order = 'ZYX'; rf.rotation.x = -Math.PI / 2; rf.rotation.z = -Math.atan2(y0 - y1, run);
      rf.position.set((x0 + x1) / 2, (y0 + y1) / 2, cz); rf.castShadow = !LOW; world.add(rf);
      const un = new THREE.Mesh(new THREE.PlaneGeometry(sl, L + 0.8), matCeilP); un.rotation.copy(rf.rotation);
      un.position.copy(rf.position); un.position.y -= 0.05; world.add(un);
      box(0.08, 0.1, L + 0.8, x1, y1 - 0.02, cz, matGold);
      box(0.1, y0 - 2.4, L + 0.8, GAL.x0 - 0.04, (y0 + 2.4) / 2, cz, matWhite);   // its back wall, up to the roof (no gap over the compound wall)
      for (const z of [GAL.z0 - 0.3, cz, GAL.z1 + 0.3]) solids.push(cyl(0.08, 0.09, y1, GAL.x1 + 0.45, y1 / 2, z, matWhite, 10));
      solids.push(hid(box(D, 1.2, L, GAL.x0 + D / 2, 0.6, cz, matStone, world, false)));
    }

    /* ---------------------------------------------------- v16.4 · BELLS
       Small gold bells with leaf clappers along every eave, swinging in
       dressTick(). (The flagpoles went at Chad's word — "Remove the flags,
       there are no flags in temples" — and the long Lanna banners after them:
       "Remove all of these long colourful banners ... Thai temples dont
       usually have this". `tungs` is left holding the bodhi cloth's tail.) */
    const tungs = [], bellHang = [];
    {
      // the bells: where they hang, along the eaves
      for (const sx of [-1, 1]) {
        /* v16.9: under the temple's side eaves (measured on the placed model:
           the lower roof's edge at x ±8.0, 6.76 m, from z −0.5 to −17.5) */
        for (let z = -1.0; z > -17.2; z -= 1.35) bellHang.push(new THREE.Vector3(sx * 7.95, 6.66, z));
      }
      for (const z of [GAL.z0, (GAL.z0 + GAL.z1) / 2, GAL.z1]) bellHang.push(new THREE.Vector3(GAL.x1 + 0.55, 2.5, z));
    }
    const bellG = new THREE.LatheGeometry([[0, 0.09], [0.005, 0.09], [0.005, 0.0], [0.03, -0.005], [0.045, -0.04], [0.06, -0.1], [0.064, -0.11], [0, -0.11]].map(([a, b2]) => new THREE.Vector2(a, b2)), 10);
    const leafG = new THREE.PlaneGeometry(0.09, 0.13); leafG.translate(0, -0.22, 0);
    const matLeaf = new THREE.MeshStandardMaterial({ color: 0xd9a63c, roughness: 0.35, metalness: 0.45, side: THREE.DoubleSide, emissive: 0x3a2406, emissiveIntensity: 0.5 });
    const bellIM = new THREE.InstancedMesh(bellG, matGold, bellHang.length);
    const leafIM = new THREE.InstancedMesh(leafG, matLeaf, bellHang.length);
    for (const im of [bellIM, leafIM]) { im.instanceMatrix.setUsage(THREE.DynamicDrawUsage); im.frustumCulled = false; world.add(im); }

    /* ---------------------------------------- v16.4 · THE BODHI'S CLOTHS
       Coloured cloths wound round the trunk the way Thai temples do, a
       tail hanging from the knot, and small offerings on the soil */
    {
      const cols = [0xe8912a, 0xe06a9a, 0xd8a12a, 0xf2c230, 0xf3ecdc];   // v17.3: saffron, not green
      for (let i = 0; i < 5; i++) {
        const band = new THREE.Mesh(new THREE.CylinderGeometry(0.29, 0.3, 0.13, 24, 1, true),
          new THREE.MeshStandardMaterial({ color: cols[i], roughness: 0.85, side: THREE.DoubleSide }));
        band.position.set(BODHI.x, 1.0 + i * 0.13, BODHI.z); band.rotation.z = (i % 2 ? 1 : -1) * 0.04; world.add(band);
      }
      const tail = new THREE.Mesh(new THREE.PlaneGeometry(0.12, 0.62), new THREE.MeshStandardMaterial({ color: 0xe06a9a, roughness: 0.85, side: THREE.DoubleSide }));
      tail.position.set(BODHI.x - 0.2, 0.98, BODHI.z + 0.22); tail.rotation.set(0.15, -0.8, 0.1); world.add(tail);
      tungs.push({ m: tail, ph: 3.1, tail: true });
      // and a small bowl of lotus on the soil (v17.1: the kit's, in place of three pink spheres)
      thai('lotusbowl', BODHI.x + 0.5, 0.56, BODHI.z + 0.6, { s: 0.28, ry: 0.6 });
    }

    /* ---------------------------------------- v16.6 · THE GARDEN, FROM THE KIT
       What grows under a wat's walls — banana, traveller's palm, elephant ear,
       fern, a clipped hedge — in the grass verges where nothing stood; the
       big earthen water jars by the gate and at the kuti; two roosters loose
       in the courtyard; a stack of floor cushions against the sala's east
       rail. A plant with a TRUNK brings a thin blocker for the trunk only (a
       leaf you walk into is a leaf; a trunk you walk through is a bug); a jar
       brings one its own size. */
    {
      /* v17.1, Chad: "Why are there so many plant types all over? Just
         standardize everything to use the same shortest bush all over the
         temple grounds" — every spot is the kit's clipped hedge now (1.0 m, the
         shortest bush in the pack), its long side laid along the wall it
         stands against (the hedge is 2.2 m along its own z) */
      const ALONG_X = Math.PI / 2, ALONG_Z = 0;
      const P = [
        // the south wall, west of the gate
        [-12.6, 14.15, ALONG_X], [-10.4, 14.15, ALONG_X], [-8.0, 14.15, ALONG_X], [-5.8, 14.15, ALONG_X],
        // the south wall, east of the gate
        [3.9, 14.3, ALONG_X], [7.9, 14.2, ALONG_X],
        // the west wall
        [-14.2, 4.2, ALONG_Z], [-14.2, 7.4, ALONG_Z], [-14.2, 10.6, ALONG_Z], [-14.2, 12.9, ALONG_Z], [-14.2, -4.7, ALONG_Z],
        // between the sala and the ubosot's flank
        [9.4, -10.4, ALONG_Z], [9.4, -6.6, ALONG_Z], [9.4, -2.6, ALONG_Z],
      ];
      for (const [x, z, ry] of P) thai('hedge', x, 0, z, { s: 0.9, ry });
      // the water jars: a big glazed ong by the gate with two clay pots, and two at the kuti
      thai('waterjar', -2.4, 0, 12.95, { s: 1.0, ry: 0.4, block: [0.6, 1.1] });
      thai('claypot', -3.55, 0, 13.35, { s: 0.9, block: [0.3, 0.7] });
      thai('claypot2', 2.75, 0, 13.3, { s: 0.85, ry: 1.2, block: [0.32, 0.7] });
      thai('claypot2', -12.2, 0, WALK.z - 2.3, { s: 0.9, ry: 2.1, block: [0.33, 0.75] });   // (v16.9: beside the kuti, clear of the walkway's base)
      thai('claypot', -12.15, 0, WALK.z + 1.4, { s: 0.9, ry: 0.6, block: [0.3, 0.7] });
      // two roosters, loose
      thai('rooster', BODHI.x - 3.4, 0, BODHI.z + 3.0, { s: 0.62, ry: 2.2 });
      thai('rooster', -7.2, 0, 9.6, { s: 0.58, ry: -0.8 });
      // floor cushions stacked against the sala's east rail, and a triangle one
      // (v16.9: inside the temple, against its east wall by the door)
      thai('cush6', 4.8, SALA.floor, -3.3, { s: 1.0, ry: 0.2, block: [0.32, 0.5] });
      thai('cush4', 4.8, SALA.floor, -3.95, { s: 1.0, ry: -0.3, block: [0.3, 0.4] });
      thai('cushtri', 4.85, SALA.floor, -6.6, { s: 0.55, ry: -Math.PI / 2, block: [0.32, 0.5] });
    }

    /* (v16.4 · the incense urn on the axis — pot, sticks, smoke, candles and
       its stone base — was built and taken out at Chad's word: "Remove this
       incense burner and the candles, and the square platform".) */

    /* ---------------------------------------------- v16.4 · MARIGOLDS
       Strings of marigold and jasmine (v16.7: no longer on the naga), a
       hanging strand on the front pillars and the porch posts, and one
       along the altar's new front step. One instanced mesh of beads. */
    {
      const beads = [], bcol = [];
      const O = new THREE.Color(0xf2a11a), Y = new THREE.Color(0xf6c228), W = new THREE.Color(0xf5f0de);
      const string = (pts, n, pal) => {
        const cv = new THREE.CatmullRomCurve3(pts);
        for (let k = 0; k <= n; k++) { beads.push(cv.getPoint(k / n)); bcol.push(pal[k % pal.length]); }
      };
      /* v16.7: no swag on the naga's neck any more (Chad: "has something
         hung around its neck, remove that thing") */
      /* v16.9: on the temple's two columns either side of the door (the old
         sala's four front pillars and its porch posts are gone) */
      for (const px of [-1.8, 2.0]) string([new THREE.Vector3(px, SALA.floor + 2.5, -0.82), new THREE.Vector3(px + 0.02, SALA.floor + 2.0, -0.82), new THREE.Vector3(px, SALA.floor + 1.55, -0.82)], 22, [O, Y, O, W]);
      string([new THREE.Vector3(ALT.x - 1.9, SALA.floor + 0.3, ALT.z + 1.42), new THREE.Vector3(ALT.x, SALA.floor + 0.18, ALT.z + 1.46), new THREE.Vector3(ALT.x + 1.9, SALA.floor + 0.3, ALT.z + 1.42)], 40, [O, Y]);
      const im = new THREE.InstancedMesh(new THREE.SphereGeometry(0.028, 6, 5), new THREE.MeshStandardMaterial({ roughness: 0.85 }), beads.length);
      const d = new THREE.Object3D();
      beads.forEach((p, i) => { d.position.copy(p); d.updateMatrix(); im.setMatrixAt(i, d.matrix); im.setColorAt(i, bcol[i]); });
      im.instanceMatrix.needsUpdate = true; im.instanceColor.needsUpdate = true; im.computeBoundingSphere(); world.add(im);
    }

    /* ---------------------------------------- v16.4 · THE ALTAR, FULLER
       A low front step with a row of candles, tiered gold umbrellas (chatra)
       either side of the Buddha, and gold bowls heaped with flowers. The
       Buddha and the tiers under him do not move (the wai and the blessing
       were framed on them). */
    {
      box(4.2, 0.2, 0.5, ALT.x, SALA.floor + 0.1, ALT.z + 1.15, matGoldC);
      box(4.24, 0.03, 0.52, ALT.x, SALA.floor + 0.2, ALT.z + 1.15, matGold);
      for (let i = 0; i < 8; i++) {
        const cx = ALT.x - 1.75 + i * 0.5;
        cyl(0.018, 0.018, 0.14, cx, SALA.floor + 0.27, ALT.z + 1.18, new THREE.MeshStandardMaterial({ color: 0xf3e4b0, roughness: 0.6 }), 6);
        const fl = new THREE.Mesh(new THREE.SphereGeometry(0.014, 6, 5), new THREE.MeshBasicMaterial({ color: 0xffc46a, transparent: true, opacity: 0.95, fog: false }));
        fl.scale.set(1, 1.8, 1); fl.position.set(cx, SALA.floor + 0.36, ALT.z + 1.18); world.add(fl); candles.push(fl);
      }
      for (const sx of [-1, 1]) {
        const x = ALT.x + sx * 2.2, z = ALT.z - 0.2;
        cyl(0.02, 0.02, 3.3, x, SALA.floor + 1.65, z, matGold, 6);
        for (let t = 0; t < 7; t++) {
          const r0 = 0.44 - t * 0.045, y = SALA.floor + 1.9 + t * 0.2;
          cyl(r0 * 0.3, r0, 0.08, x, y, z, t % 2 ? matGold : matWhite, 20);
          cyl(r0 + 0.01, r0 + 0.01, 0.03, x, y - 0.045, z, matGold, 20);
        }
        const tip = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.22, 8), matGold); tip.position.set(x, SALA.floor + 3.42, z); world.add(tip);
        // a gold bowl heaped with marigolds on the first tier
        const bx = ALT.x + sx * 1.35, by = SALA.floor + 0.38, bz = ALT.z + 0.62;
        cyl(0.05, 0.07, 0.1, bx, by + 0.05, bz, matGold, 12);
        cyl(0.16, 0.08, 0.1, bx, by + 0.15, bz, matGold, 16);
        const heap = new THREE.Mesh(new THREE.SphereGeometry(0.15, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshStandardMaterial({ color: 0xf2a11a, roughness: 0.9 }));
        heap.scale.set(1, 0.7, 1); heap.position.set(bx, by + 0.2, bz); world.add(heap);
      }
    }

    /* ------------------------------------ v16.9 · THE HALL'S OTHER THINGS
       The temple's hall is bigger than the sala was, and a hall like it is
       never empty (Chad: "fill up the interior space of this new temple
       appropriately and make use of the extra space too"): a scripture
       cabinet in black lacquer and gold against the west wall, a gong on its
       red frame in the back corner past the monk, rows of small Buddha images
       on low stands either side of the altar, and a donation box by the door. */
    {
      const lacq = new THREE.MeshStandardMaterial({ color: 0x14100c, roughness: 0.28, metalness: 0.1 });
      // the scripture cabinet (tu phra tham): splayed legs, gilt panels on black
      {
        const g = new THREE.Group(); g.position.set(SALA.x0 + 0.34, SALA.floor, -12.3); g.rotation.y = Math.PI / 2; world.add(g);
        box(1.2, 1.05, 0.52, 0, 0.3 + 0.525, 0, lacq, g);
        box(1.28, 0.06, 0.6, 0, 1.38, 0, matGold, g);
        box(1.3, 0.1, 0.62, 0, 0.3, 0, lacq, g);
        for (const sx of [-1, 1]) for (const sz of [-1, 1]) { const l = box(0.07, 0.34, 0.07, sx * 0.55, 0.15, sz * 0.22, lacq, g); l.rotation.z = -sx * 0.12; }
        for (const sx of [-1, 1]) {
          box(0.5, 0.86, 0.01, sx * 0.28, 0.83, 0.265, matGoldC, g);
          box(0.52, 0.02, 0.012, sx * 0.28, 1.27, 0.266, matGold, g);
        }
        solids.push(hid(box(0.62, 1.4, 1.3, SALA.x0 + 0.34, SALA.floor + 0.7, -12.3, matProxy, world, false)));
      }
      // the gong (khong): a bronze disc with its boss, hung in a red frame, facing into the hall
      {
        const g = new THREE.Group(); g.position.set(SALA.x1 - 0.5, SALA.floor, -12.85); g.rotation.y = -Math.PI / 2; world.add(g);
        for (const sx of [-1, 1]) { cyl(0.05, 0.06, 1.75, sx * 0.55, 0.875, 0, matRed, 10, g); box(0.24, 0.08, 0.34, sx * 0.55, 0.04, 0, matRedD, g); }
        box(1.3, 0.1, 0.1, 0, 1.78, 0, matRed, g); box(1.36, 0.04, 0.12, 0, 1.85, 0, matGold, g);
        const bronze = new THREE.MeshStandardMaterial({ color: 0x8a6a2a, roughness: 0.35, metalness: 0.6, emissive: 0x241604, emissiveIntensity: 0.4 });
        const disc = cyl(0.38, 0.38, 0.05, 0, 1.08, 0, bronze, 32, g); disc.rotation.x = Math.PI / 2;
        const boss = new THREE.Mesh(new THREE.SphereGeometry(0.1, 16, 10), bronze); boss.position.set(0, 1.08, 0.04); boss.scale.z = 0.6; g.add(boss);
        for (const sx of [-1, 1]) { const c = cyl(0.006, 0.006, 0.34, sx * 0.2, 1.58, 0, matDark, 4, g); c.rotation.z = sx * 0.5; }
        const mallet = cyl(0.02, 0.02, 0.5, 0.45, 0.62, 0.1, matWoodD, 8, g); mallet.rotation.z = 0.4;
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.06, 10, 8), new THREE.MeshStandardMaterial({ color: 0xece6d8, roughness: 0.9 })); head.position.set(0.55, 0.86, 0.1); g.add(head);
        solids.push(hid(box(0.5, 1.8, 1.3, SALA.x1 - 0.5, SALA.floor + 0.9, -12.85, matProxy, world, false)));
      }
      // the small images: a low stand either side of the altar, against the back wall
      for (const [x0, n] of [[-4.75, 4], [2.75, 2]]) {
        const w = n * 0.5 + 0.1, cx = x0 + w / 2, z = SALA.z0 + 0.35;
        box(w, 0.5, 0.5, cx, SALA.floor + 0.25, z, matRed);
        box(w + 0.04, 0.04, 0.54, cx, SALA.floor + 0.5, z, matGold);
        for (let i = 0; i < n; i++) {
          const bx = x0 + 0.3 + i * 0.5;
          thai('buddha', bx, SALA.floor + 0.52, z - 0.02, { s: 0.85, tint: GOLD_T, glow: 0.12, hide: [mkBuddha(bx, SALA.floor + 0.52, z - 0.02, 0.24)] });
          const fl = new THREE.Mesh(new THREE.SphereGeometry(0.012, 6, 5), new THREE.MeshBasicMaterial({ color: 0xffc46a, transparent: true, opacity: 0.95, fog: false }));
          cyl(0.014, 0.014, 0.08, bx, SALA.floor + 0.56, z + 0.19, new THREE.MeshStandardMaterial({ color: 0xf3e4b0, roughness: 0.6 }), 6);
          fl.scale.set(1, 1.8, 1); fl.position.set(bx, SALA.floor + 0.62, z + 0.19); world.add(fl); candles.push(fl);
        }
        solids.push(hid(box(w, 0.9, 0.5, cx, SALA.floor + 0.45, z, matProxy, world, false)));
      }
      // the donation box, by the door
      {
        box(0.42, 0.62, 0.34, 1.55, SALA.floor + 0.31, SALA.z1 - 0.45, matWoodD);
        box(0.44, 0.04, 0.36, 1.55, SALA.floor + 0.63, SALA.z1 - 0.45, matGold);
        box(0.16, 0.012, 0.02, 1.55, SALA.floor + 0.652, SALA.z1 - 0.45, matDark);
        box(0.3, 0.22, 0.005, 1.55, SALA.floor + 0.42, SALA.z1 - 0.28, new THREE.MeshStandardMaterial({ map: tex(makeSignTex(THREE, cnv, 'ทำบุญ', '#6d140e', '#f6e6b8', 1.4)), roughness: 0.7 }));
        solids.push(hid(box(0.42, 0.62, 0.34, 1.55, SALA.floor + 0.31, SALA.z1 - 0.45, matProxy, world, false)));
      }
    }

    /* ---------------------------------------------------------------- trees
       Round the outside of the walls, and two frangipani by the gate; the
       bodhi's crown is the tree kit's biggest kind over our trunk. */
    let treeStand = null;
    if (plantTrees) {
      const spots = [];
      for (let i = 0; i < 44; i++) {
        const a = hash(i, 7) * Math.PI * 2, r = 24 + hash(i, 13) * 20;
        const x = 3 + Math.cos(a) * r, z = 1 + Math.sin(a) * r * 0.9;
        if (Math.abs(x) < 7 && z > 14) continue;                     // keep the road and the film's walk-in clear
        if (x > -16 && x < 22.5 && z > -24.5 && z < 16) continue;    // v16.9: not inside the compound (its north wall moved back 10.5 m)
        if (Math.hypot(x - CHEDI.x, z - CHEDI.z) < 9) continue;      // v16.4: nothing grows against the chedi
        spots.push({ x, z, h: 8.5 * (0.8 + hash(i, 17) * 0.6) });
      }
      /* the bodhi's crown — `always`: on a phone the stand is thinned to 45 %
         and the bodhi went with it, leaving a planter of cloths round nothing
         (Chad: "What is this round thing supposed to be?") */
      spots.push({ x: BODHI.x, z: BODHI.z, h: 11.5, always: true });
      spots.push({ x: -4.6, z: 17.2, h: 5.2 }, { x: 4.6, z: 17.4, h: 4.8 });   // the frangipani outside the gate
      /* v16.1: the tree that stood at (-12.4, -10.6) is where the kuti is now */
      /* v16.4: the tree at (-13.4, -2.2) stood where the Buddha gallery is; it grows by the south-west corner now */
      spots.push({ x: -12.6, z: 10.8, h: 6.6 }, { x: -12.4, z: 7.9, h: 7.2 }, { x: 19.0, z: 12.0, h: 6.8 });
      treeStand = plantTrees(world, spots, { tint: 0xe0cfb0, shadow: !LOW, lowKeep: 0.45, roughness: 0.9 });
    }

    /* ------------------------------------------------------------ the zones */
    function mkZone(x, z) {
      const g = new THREE.Group(); g.position.set(x, SALA.floor + 0.02, z); g.visible = false; world.add(g);
      const disc = new THREE.Mesh(new THREE.CircleGeometry(0.62, 32),
        new THREE.MeshBasicMaterial({ color: 0xf2c46a, transparent: true, opacity: 0.22, depthWrite: false, fog: false }));
      disc.rotation.x = -Math.PI / 2; g.add(disc);
      const ring = new THREE.Mesh(new THREE.RingGeometry(0.58, 0.66, 40),
        new THREE.MeshBasicMaterial({ color: 0xffd98a, transparent: true, opacity: 0.8, depthWrite: false, fog: false,
                                      blending: THREE.AdditiveBlending, side: THREE.DoubleSide }));
      ring.rotation.x = -Math.PI / 2; ring.position.y = 0.004; g.add(ring);
      const wave = new THREE.Mesh(new THREE.RingGeometry(0.6, 0.66, 40), ring.material.clone());
      wave.rotation.x = -Math.PI / 2; wave.position.y = 0.006; wave.userData.moves = true; g.add(wave);
      g.userData = { disc, ring, wave };
      return g;
    }
    function zoneTick(g, t) {
      if (!g.visible) return;
      const { disc, ring, wave } = g.userData;
      const k = (t % 2.0) / 2.0;
      wave.scale.setScalar(1 + k * 0.9); wave.material.opacity = 0.7 * (1 - k);
      ring.material.opacity = 0.6 + 0.3 * Math.sin(t * 3.1);
      disc.material.opacity = 0.18 + 0.08 * Math.sin(t * 3.1);
    }

    /* ------------------------------------------------------------- the cast
       One parse per asset, every rig a clone (e2c5's v14.1 law). A rig is
       sized STANDING on its own idle (the v5.05 law: the measure that matters
       is the one the others used), then handed its real take and re-grounded
       on that take's own lowest bone. A SEATED rig then has its SEAT moved
       under its measured hips, rather than the man moved onto a seat: the
       seats are ours, the take's hip height is the file's. */
    const CULL_SPHERE = {
      admintee: { x: 0.067, y: 0.870, z: 0.011, r: 1.376 },
      botak:    { x: 0.041, y: 0.860, z: 0.020, r: 1.320 }
    };
    function wideBounds(root, key) {
      const d = CULL_SPHERE[key];
      root.traverse(o => {
        if (!o.isMesh) return;
        o.frustumCulled = true;
        if (!o.isSkinnedMesh) return;
        const sp = d ? new THREE.Sphere(new THREE.Vector3(d.x, d.y, d.z), d.r * 1.25)
                     : new THREE.Sphere(new THREE.Vector3(0, 0.9, 0), 1.9);
        o.boundingSphere = sp.clone();
        if (o.geometry) o.geometry.boundingSphere = sp.clone();
      });
    }
    function parseOnce(key) {
      if (!parsedGlb.has(key)) {
        parsedGlb.set(key, assetBytes(key).then(BUF => new Promise((res, rej) =>
          new GLTFLoader().parse(BUF, '', (gltf) => {
            rescueTextures(gltf, BUF);
            res({ scene: gltf.scene, animations: gltf.animations });
          }, rej))));
      }
      return parsedGlb.get(key);
    }
    const _v = new THREE.Vector3();
    /* v19.1 · EVERY RIG'S CULLING SPHERE FROM ITS POSED SKIN, in world space
       and then in each mesh's own frame — v18.5's law (e3c2's congregation),
       met here by Chad: "When player walks close to the standing male model
       in the main temple hall, he disappears immediately, and reappears when
       walking away." His file is quantized: every mesh's positions are
       normalised shorts in [-1, 1] under a 0.01 armature, so wideBounds'
       default sphere — (0, 0.9, 0), r 1.9, in MESH units — was a ball under
       two centimetres across at his feet. Drawn while his feet were in
       frame; dropped the moment the player came close enough to look him in
       the face. One sphere round the whole body (eyes, teeth and lashes go
       with it), generous on purpose — a take moves the body and a walk
       carries it — and each mesh's own (clones share their geometry). A rig
       with a measured table entry keeps it; a rig whose `then` already did
       this (the plane's passengers, fitSeat) is not done twice. */
    const _cv = new THREE.Vector3(), _cm = new THREE.Matrix4();
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
    function mkRig(key, opts) {
      const group = new THREE.Group();
      group.position.set(opts.x, opts.y || 0, opts.z); group.rotation.y = opts.ry || 0;
      world.add(group);
      const proxy = new THREE.Mesh(new THREE.CapsuleGeometry(0.2, (opts.seated ? 1.1 : opts.height) - 0.4, 4, 8), matProxy);
      /* (v21.16: never drawn — a capsule was a block of a person; until the model lands, and for good if it never does,
         the place stands empty: Chad's rule, no block figures anywhere) */
      proxy.position.y = (opts.seated ? 1.1 : opts.height) / 2 + (opts.seated ? 0.1 : 0); proxy.castShadow = false; proxy.visible = false; group.add(proxy);
      const rig = { key, group, proxy, model: null, mixer: null, acts: null, cur: null, head: null, hips: null,
                    ready: false, height: opts.height, idle: opts.idle || null, floor: opts.y || 0,
                    headRest: null, headWrote: null, nod: 0, nodT: 0, lookYaw: 0, lookPitch: 0 };
      rig.play = (name, ts = 1, fade = 0.34, once = false, at) => {
        if (!rig.mixer || !rig.acts || !rig.acts[name]) return false;
        if (rig.cur === name && at === undefined) { rig.acts[name].setEffectiveTimeScale(ts); return true; }
        const nx = rig.acts[name], old = rig.cur && rig.cur !== name && rig.acts[rig.cur];
        nx.reset(); nx.setEffectiveTimeScale(ts); nx.setEffectiveWeight(1);
        nx.setLoop(once ? THREE.LoopOnce : THREE.LoopRepeat, Infinity);
        nx.clampWhenFinished = once;
        if (at !== undefined) {
          nx.play(); nx.time = nx.getClip().duration * at; nx.paused = true;
          for (const a of Object.values(rig.acts)) if (a !== nx) a.stop();
          rig.mixer.update(0);
        } else if (fade > 0) {
          nx.paused = false; nx.fadeIn(fade).play();
          if (old) old.fadeOut(fade);
        } else {
          nx.paused = false; nx.play();
          for (const a of Object.values(rig.acts)) if (a !== nx) a.stop();
          rig.mixer.update(0.0001);
        }
        rig.cur = name;
        return true;
      };
      parseOnce(key).then((gltf) => {
        if (!alive) return;
        const g = cloneSkinned(gltf.scene);
        g.traverse(o => { if (o.isMesh) { o.castShadow = !LOW; o.receiveShadow = false; } });
        wideBounds(g, key);
        if (opts.recolor) opts.recolor(g);
        group.add(g); rig.model = g;
        if (gltf.animations && gltf.animations.length) {
          rig.mixer = new THREE.AnimationMixer(g);
          rig.acts = {};
          for (const clip of gltf.animations) rig.acts[clip.name] = rig.mixer.clipAction(clip);
          /* v17.4: `anims` names a second file of takes for this rig (no mesh,
             bound to the clone by bone name — the motheranim precedent) */
          if (opts.anims) parseOnce(opts.anims).then(a => {
            if (!alive || !rig.mixer) return;
            for (const clip of a.animations || []) if (!rig.acts[clip.name]) rig.acts[clip.name] = rig.mixer.clipAction(clip);
          }).catch(err => { console.warn(opts.anims + ' failed to load', err); ctx.loadFail && ctx.loadFail(opts.anims, err); });
          const sizeOn = opts.sizeOn || opts.idle;
          if (sizeOn && rig.acts[sizeOn]) { rig.play(sizeOn, 1, 0, false, opts.sizeAt ?? opts.at); rig.mixer.update(0.001); }
        }
        g.updateMatrixWorld(true);
        let lo = Infinity, hi = -Infinity, crown = false;
        g.traverse(o => {
          if (!o.isBone) return;
          o.getWorldPosition(_v); lo = Math.min(lo, _v.y); hi = Math.max(hi, _v.y);
          if (/HeadTop_End/.test(o.name)) crown = true;
          if (HEAD_RE.test(o.name) && !rig.head) rig.head = o;
          if (/Hips$/.test(o.name) && !rig.hips) rig.hips = o;
        });
        if (isFinite(lo) && hi > lo) {
          const span = (hi - lo) / (crown ? 1 : 0.935);
          g.scale.setScalar(opts.height / span); g.updateMatrixWorld(true);
          g.position.y += -(lowestBone(g) - group.position.y);
        }
        if (rig.acts && opts.idle && opts.sizeOn && opts.sizeOn !== opts.idle) {
          rig.play(opts.idle, opts.rate || 1, 0, false, opts.at);
          rig.mixer.update(0.0001); g.updateMatrixWorld(true);
          const lo3 = lowestBone(g);
          if (isFinite(lo3)) g.position.y += -(lo3 - group.position.y);
        }
        if (opts.then) opts.then(rig);
        g.updateMatrixWorld(true);
        if (!CULL_SPHERE[key] && !rig.culled) skinCull(rig, 1.35, (opts.height || 1.7) * 0.8);
        proxy.visible = false; rig.ready = true; redoShadows();
      }).catch(err => { console.warn(key + ' failed to load', err); ctx.loadFail && ctx.loadFail(key, err); rig.ready = true; });
      return rig;
    }
    /* THE HEAD, and why it is put back before the mixer runs: three.js's
       PropertyMixer writes a bone only when the value differs from the one it
       saved, so on a frame where a take holds the head still the mixer leaves
       our offset in place and the next frame's stacks on it (v11.5's spinning
       head). The bone goes back to what the mixer last wrote first. */
    const _q = new THREE.Quaternion(), _e = new THREE.Euler();
    function headPre(rig) { if (rig.head && rig.headWrote) rig.head.quaternion.copy(rig.headWrote); }
    function headPost(rig, wdt) {
      if (!rig.head) return;
      if (!rig.headWrote) rig.headWrote = new THREE.Quaternion();
      rig.headWrote.copy(rig.head.quaternion);
      // a nod while he speaks: a slow emphatic dip, eased in and out
      rig.nodT += wdt;
      const target = rig.nod > 0 ? 1 : 0;
      rig.nodW = (rig.nodW || 0) + (target - (rig.nodW || 0)) * (1 - Math.exp(-wdt * 5));
      if (rig.nod > 0) rig.nod = Math.max(0, rig.nod - wdt);
      const dip = rig.nodW * (0.07 * Math.sin(rig.nodT * 4.2) + 0.05 * Math.sin(rig.nodT * 1.7 + 1));
      if (Math.abs(dip) + Math.abs(rig.lookYaw) + Math.abs(rig.lookPitch) < 1e-4) return;
      _e.set(dip + rig.lookPitch, rig.lookYaw, 0, 'YXZ');
      _q.setFromEuler(_e);
      rig.head.quaternion.multiply(_q);
    }

    /* THE AJARN — the admin tee's rig, SITTING, in a white shirt and white
       trousers. The olive of the tee and the trousers is recoloured on a copy
       of its own texture (every pixel whose hue is the olive's goes to a warm
       white at its own brightness), so the face and the hands are untouched
       and no other admin tee in the game changes. */
    function whiten(g) {
      const seen = new Map();
      g.traverse(o => {
        if (!o.isMesh || !o.material) return;
        const mats = Array.isArray(o.material) ? o.material : [o.material];
        const out = mats.map(m => {
          if (seen.has(m)) return seen.get(m);
          const c = m.clone();
          const img = m.map && m.map.image;
          if (img && img.width) {
            try {
              const W = img.width, H = img.height, cv = document.createElement('canvas');
              cv.width = W; cv.height = H;
              const x = cv.getContext('2d'); x.drawImage(img, 0, 0);
              const d = x.getImageData(0, 0, W, H), p = d.data;
              for (let i = 0; i < p.length; i += 4) {
                const r = p[i], gg = p[i + 1], b = p[i + 2];
                const mx = Math.max(r, gg, b), mn = Math.min(r, gg, b);
                // olive and green: green leads, blue trails, and it is not skin
                if (gg >= r * 0.92 && gg > b * 1.12 && mx - mn > 10) {
                  const L = 0.30 * r + 0.59 * gg + 0.11 * b;
                  const v = Math.min(255, 150 + L * 1.25);
                  p[i] = v; p[i + 1] = v * 0.985; p[i + 2] = v * 0.95;
                }
              }
              x.putImageData(d, 0, 0);
              const t = new THREE.CanvasTexture(cv);
              t.colorSpace = m.map.colorSpace; t.flipY = m.map.flipY; t.wrapS = m.map.wrapS; t.wrapT = m.map.wrapT;
              t.anisotropy = 4; madeTex.push(t);
              c.map = t;
            } catch (err) { console.warn('ajarn recolour failed', err); }
          }
          owned.push({ dispose: () => c.dispose() });
          seen.set(m, c);
          return c;
        });
        o.material = Array.isArray(o.material) ? out : out[0];
      });
    }
    const DAIS_TOP = SALA.floor + DAIS.h;
    const HELP_RY = Math.atan2(MON.x - HELP.x, MON.z - HELP.z);   // at rest he faces across the hall, toward the monk
    /* HE SITS RAISED — on a lacquered block on the dais, so the man in front
       of him looks UP at him when he turns round (CP3: level with the stool,
       the decision opened on the top of his head) */
    const AJ_RISE = 0.38;          // v17.1: the footrest's gilt top (seatOnSkin puts his soles on it)
    /* v16.8: CHAD'S AJARN (tools/prepmonk.mjs, as the monk: his skin weights
       diffused, normals shared across the seams) — tattooed, in white, a
       top-knot and beads. His own takes (Chad's direction): Sitting_Answering_
       Questions while he works on the man before you, the rod in his right
       hand; Sit_Thumbs_Up_Right once when he is done — the slap on the back
       and the blessing; Chair_Sit_Idle_M at rest and when he speaks to you. */
    const AJ_WORK = 'Sitting_Answering_Questions', AJ_BLESS = 'Sit_Thumbs_Up_Right', AJ_REST = 'Chair_Sit_Idle_M';
    const ajarn = mkRig('ajarn', { x: AJ.x, y: DAIS_TOP + AJ_RISE, z: AJ.z, ry: 0, height: 1.68,
                                   sizeOn: 'Walking', sizeAt: 0, idle: AJ_WORK, seated: true,
                                   then: (r) => {
                                     seatOnSkin(r, ajSeat, [AJ_WORK, AJ_BLESS, AJ_REST], () => r.play(AJ_WORK, 1, 0));
                                     r.model.traverse(o => { if (o.isBone && /RightHand(_\d+)?$/.test(o.name) && !r.hand) r.hand = o;
                                                             if (o.isBone && /RightHandMiddle\d/.test(o.name) && !r.tip) r.tip = o; });
                                   } });
    const ajSeat = dais.children.find(c => c.geometry && c.geometry.parameters && c.geometry.parameters.width === 0.62);
    /* v19.1 (Chad: "the red backseat of the sakyant ajahn is colliding into
       the masks behind. just remove this red backseat"): his throne is built
       without its back — the masks hang on the wall right behind him. The
       monk's throne keeps its own. */
    if (ajSeat) ajSeat.userData.noBack = true;
    /* the seat goes under the hips: its top 0.10 below the hip joint, centred
       under it in x and z, in the dais's own frame (both daises: mkDais marks
       the seat with the height it stands on and its cushion) */
    function seatUnder(r, seat) {
      if (!r.hips || !seat) return;
      r.model.updateMatrixWorld(true);
      r.hips.getWorldPosition(_v);
      const local = seat.parent.worldToLocal(_v.clone());
      const top = local.y - 0.10, h = Math.max(0.12, top - (seat.userData.base || 0));
      seat.scale.y = h / seat.geometry.parameters.height;
      seat.position.set(local.x, top - h / 2, local.z);
      if (seat.userData.cushion) seat.userData.cushion.position.set(local.x, top + 0.03, local.z);
      r.seatTop = top;
    }

    /* v16.8 · SEATED ON THE BODY, NOT THE BONES (Chad: "both the monk and
       ajahn sinks into their seats, look at the leg area"). seatUnder puts
       the seat's top 10 cm under the HIP JOINT and the rig is grounded on its
       LOWEST JOINT — right for the stand-ins, wrong for two men in thick
       robes: the underside of a robed thigh hangs well below 10 cm under the
       joint, and a sole is below the toe joint. So for Chad's two, the POSED
       SKIN is measured (the v5.21 law: a rig with a real body is measured from
       its skin): the soles are put on the floor, and the seat's top is put at
       the underside of the thighs, in a box round the hips. */
    const _sv = new THREE.Vector3();
    function skinLow(r, keep) {
      let lo = Infinity;
      r.model.updateMatrixWorld(true);
      r.model.traverse(o => {
        if (!o.isSkinnedMesh) return;
        o.skeleton.update();
        const n = o.geometry.attributes.position.count;
        for (let i = 0; i < n; i += 5) {
          o.getVertexPosition(i, _sv); _sv.applyMatrix4(o.matrixWorld);
          if ((!keep || keep(_sv)) && _sv.y < lo) lo = _sv.y;
        }
      });
      return lo;
    }
    /* v17.1 · THE THRONE, BUILT ROUND HIM (Chad: "the monk is floating and
       his feet cutting into the platform, cant you redesign the chair or
       platform to fit him properly?" — and the same of the Ajarn). Two
       measures were wrong. The seat's height was read from the LOWEST skin
       near his hips, and on a man in a robe that is the cloth hanging
       between his knees — 15 cm under where he actually sits, so the seat
       stood a hand's width under him and he hovered over it. And the
       footrest's gold lip stood 2 cm over the height his soles were put at,
       and was only as deep as a stand-in's feet. Now every take he sits in
       is measured (posed skin, every frame of a few): the soles go on the
       footrest's top; the seat's cushion top is the middle of the takes'
       SEAT (the skin behind the hip joint, where he sits — the
       cushion takes the few centimetres between them, as a cushion does);
       the seat runs from behind him to a hand short of his knees; the
       footrest from behind the seat to past his toes; and a back stands
       just clear of his back. */
    /* each take's recorded seat offset cancelled, weighted by the takes now
       playing (a take not measured counts as no offset — the old behaviour) */
    function rootComp(r) {
      if (!r.rootOff || !r.model || !r.acts) return;
      let wx = 0, wz = 0, ws = 0;
      for (const [name, a] of Object.entries(r.acts)) {
        if (!a.isScheduled()) continue;                    // playing, fading or parked on a frame
        const w = a.getEffectiveWeight(); if (!(w > 0)) continue;
        const o = r.rootOff[name]; ws += w;
        if (o) { wx += o[0] * w; wz += o[1] * w; }
      }
      if (ws <= 0) return;
      /* the offset is in the group's frame; the model is the group's child, so
         its position is in that frame too — scaled by nothing (the model's own
         scale applies below it) */
      r.model.position.x = r.rootBase.x - wx / ws;
      r.model.position.z = r.rootBase.z - wz / ws;
    }
    function seatOnSkin(r, seat, takes, restore) {
      if (!r.hips || !seat) return;
      const U = seat.userData, P = seat.parent;
      const fwd = new THREE.Vector3(0, 0, 1).applyQuaternion(r.group.quaternion);
      const sides = new THREE.Vector3(fwd.z, 0, -fwd.x);
      const sample = () => {
        r.model.updateMatrixWorld(true);
        r.hips.getWorldPosition(_v);
        const hx = _v.x, hy = _v.y, hz = _v.z;
        const m = { sole: Infinity, seat: Infinity, toe: -Infinity, side: 0, back: Infinity, hx, hz };
        const pts = [];
        r.model.traverse(o => {
          if (!o.isSkinnedMesh) return;
          o.skeleton.update();
          const n = o.geometry.attributes.position.count;
          for (let i = 0; i < n; i += 6) {
            o.getVertexPosition(i, _sv); _sv.applyMatrix4(o.matrixWorld);
            const dx = _sv.x - hx, dz = _sv.z - hz, along = dx * fwd.x + dz * fwd.z, side = dx * sides.x + dz * sides.z;
            pts.push(_sv.y, along, side);
            if (_sv.y < m.sole) m.sole = _sv.y;
            // where he sits: the skin under and just behind the hip joint
            if (Math.abs(side) < 0.2 && along > -0.22 && along < 0.04 && _sv.y < hy + 0.05 && _sv.y > hy - 0.45 && _sv.y < m.seat) m.seat = _sv.y;
          }
        });
        for (let i = 0; i < pts.length; i += 3) {
          const y = pts[i], along = pts[i + 1], side = pts[i + 2];
          if (y < m.sole + 0.14) { if (along > m.toe) m.toe = along; m.side = Math.max(m.side, Math.abs(side)); }
          if (Math.abs(side) < 0.24 && y > m.seat + 0.14 && y < m.seat + 0.62 && along < m.back) m.back = along;
        }
        return m;
      };
      const all = [], seats = [], hipAt = {};
      const hipLocal = () => { r.model.updateMatrixWorld(true); r.hips.getWorldPosition(_v); return r.group.worldToLocal(_v.clone()); };
      for (const take of (takes || []).filter(t => r.acts && r.acts[t])) {
        const s = []; let hx = 0, hz = 0;
        for (const k of [0, 0.2, 0.4, 0.6, 0.8]) {
          r.play(take, 1, 0, false, k); r.mixer.update(0);
          const hl = hipLocal(); hx += hl.x / 5; hz += hl.z / 5;
          const m = sample(); s.push(m.seat); all.push(m);
        }
        seats.push(s.reduce((a, b) => a + b, 0) / s.length);
        hipAt[take] = [hx, hz];
      }
      if (restore) { r.cur = null; restore(); r.mixer.update(0); }
      const cur = sample(); if (!all.length) { all.push(cur); seats.push(cur.seat); }
      /* v17.1b (Chad: "When the monk speaks, he moves, and causes his legs to
         collide into the seat"): the takes were not recorded in one chair.
         Measured in the group's frame, Sitting_Answering_Questions sits his
         hips 0.30 m further BACK and 0.14 m to one side of where
         Sit_Thumbs_Up_Right sits them (and the Ajarn's Chair_Sit_Idle_M 0.31
         back and 0.17 the other way), so every change of take slid the whole
         man across the throne and his legs through the seat. Each take's
         offset from the take the seat was built on is kept, and rootComp()
         cancels it every frame, weighted by the takes playing — so he sits in
         the same place whatever he is doing, and a crossfade glides nothing. */
      const ref0 = takes && hipAt[takes[0]];                   // the take the seat is built round
      const ref = ref0 ? { x: ref0[0], z: ref0[1] } : hipLocal();
      r.rootOff = {};
      for (const [take, [hx, hz]] of Object.entries(hipAt)) r.rootOff[take] = [hx - ref.x, hz - ref.z];
      r.rootBase = { x: r.model.position.x, z: r.model.position.z };
      // the soles on the footrest he sits over (the group's height IS its top)
      if (isFinite(cur.sole)) {
        const dy = r.group.position.y - cur.sole; r.model.position.y += dy;
        for (const m of all) { m.sole += dy; m.seat += dy; }
        for (let i = 0; i < seats.length; i++) seats[i] += dy;
      }
      const cushTop = (Math.min(...seats) + Math.max(...seats)) / 2;
      const toe = Math.max(...all.map(m => m.toe)), wide = Math.max(...all.map(m => m.side));
      const back = Math.min(...all.map(m => m.back));
      const hx = cur.hx, hz = cur.hz;
      const toL = (along, y) => P.worldToLocal(new THREE.Vector3(hx + fwd.x * along, y, hz + fwd.z * along));
      const base = U.base || 0, CU = 0.08;
      // the seat: from 0.10 behind his back's line to a hand short of his knees
      const knee = Math.max(...all.map(m => m.toe)) - 0.2;
      const s0 = Math.max(isFinite(back) ? back - 0.03 : -0.28, -0.32), s1 = Math.min(0.42, Math.max(0.2, knee - 0.12));
      const top = P.worldToLocal(new THREE.Vector3(hx, cushTop - CU, hz)).y;
      const h = Math.max(0.12, top - base), mid = toL((s0 + s1) / 2, 0);
      const depth = s1 - s0;
      seat.scale.set(1, h / seat.geometry.parameters.height, depth / seat.geometry.parameters.depth);
      seat.position.set(mid.x, base + h / 2, mid.z);
      if (U.seatLip) { U.seatLip.scale.set(1, 1, (depth + 0.02) / U.seatLip.geometry.parameters.depth); U.seatLip.position.set(mid.x, top - 0.012, mid.z); }
      if (U.cushion) {
        U.cushion.scale.set(1, CU / U.cushion.geometry.parameters.height, (depth - 0.02) / U.cushion.geometry.parameters.depth);
        U.cushion.position.set(mid.x, top + CU / 2, mid.z);
      }
      // the footrest: the group's height, under the seat and past his toes
      if (U.riser) {
        const fy = P.worldToLocal(new THREE.Vector3(hx, r.group.position.y, hz)).y;
        const f0 = s0 - 0.04, f1 = Math.max(s1 + 0.1, toe + 0.14), fm = toL((f0 + f1) / 2, 0), W = Math.max(1.0, wide * 2 + 0.16);
        const rh = fy - 0.04 - base;
        U.riser.scale.set(W / 1.0, rh / U.riser.geometry.parameters.height, (f1 - f0) / U.riser.geometry.parameters.depth);
        U.riser.position.set(fm.x, base + rh / 2, fm.z);
        U.riserTop.scale.set((W + 0.04) / 1.04, 1, (f1 - f0 + 0.04) / U.riserTop.geometry.parameters.depth);
        U.riserTop.position.set(fm.x, fy - 0.02, fm.z);
      }
      // the back, just clear of his own
      if (U.back && isFinite(back) && !U.noBack) {
        const bp = toL(s0 - 0.03, 0), bh = 0.6;
        U.back.position.set(bp.x, top + CU + bh / 2 - 0.04, bp.z);
        U.backTop.position.set(bp.x, top + CU + bh - 0.02, bp.z);
        U.back.visible = U.backTop.visible = true;
      }
      r.seatTop = top;
      r.seatInfo = { cushTop: +cushTop.toFixed(3), seats: seats.map(v => +v.toFixed(3)), toe: +toe.toFixed(3), back: +back.toFixed(3), s0: +s0.toFixed(3), s1: +s1.toFixed(3) };
    }

    /* THE MONK (v16.1) — on the dais that was the Ajarn's: the botak recruit,
       shaven-headed, in saffron (every pixel of his clothes recoloured on a
       copy of his own texture, the skin untouched), SITTING STILL: the upright
       frame of his sitting take, parked (v8.0 measured the window: the head
       is over the hips for the first eighth). He does not doze. When he
       blesses, his right arm is lifted and flicks the whisk (monkArm). */
    function saffron(g) {
      const seen = new Map();
      g.traverse(o => {
        if (!o.isMesh || !o.material) return;
        const mats = Array.isArray(o.material) ? o.material : [o.material];
        const out = mats.map(m => {
          if (seen.has(m)) return seen.get(m);
          const c = m.clone();
          const img = m.map && m.map.image;
          if (img && img.width) {
            try {
              const W = img.width, H = img.height, cv = document.createElement('canvas');
              cv.width = W; cv.height = H;
              const x = cv.getContext('2d'); x.drawImage(img, 0, 0);
              const d = x.getImageData(0, 0, W, H), px = d.data;
              for (let i = 0; i < px.length; i += 4) {
                const r = px[i], gg = px[i + 1], b = px[i + 2];
                const L = 0.30 * r + 0.59 * gg + 0.11 * b;
                const warm = r >= gg && gg >= b * 0.85 && r - b > 10;
                /* his hair is a dark warm brown in this atlas (looked at, CP6):
                   a monk's head is shaven, so it goes to the colour of stubble
                   on skin; the lighter warm pixels are his skin and stay */
                if (warm && L < 88) { px[i] = r * 0.4 + 150 * 0.6; px[i + 1] = gg * 0.4 + 112 * 0.6; px[i + 2] = b * 0.4 + 92 * 0.6; continue; }
                if (warm && r > 80 && r - gg < 95) continue;          // skin
                const v = Math.min(1, 0.35 + L / 210);
                px[i] = 222 * v; px[i + 1] = 118 * v; px[i + 2] = 26 * v;
              }
              x.putImageData(d, 0, 0);
              const t = new THREE.CanvasTexture(cv);
              t.colorSpace = m.map.colorSpace; t.flipY = m.map.flipY; t.wrapS = m.map.wrapS; t.wrapT = m.map.wrapT;
              t.anisotropy = 4; madeTex.push(t);
              c.map = t;
            } catch (err) { console.warn('monk recolour failed', err); }
          }
          owned.push({ dispose: () => c.dispose() });
          seen.set(m, c);
          return c;
        });
        o.material = Array.isArray(o.material) ? out : out[0];
      });
    }
    const MD_TOP = SALA.floor + MD.h;
    /* v16.8: CHAD'S MONK (tools/prepmonk.mjs — his skin weights diffused, so
       the robe no longer shears into a staircase under the arms when he
       moves), sized standing on his own Walking take and seated on his own
       chair-sit takes: at rest on the first frame of Sit_Thumbs_Up_Right
       (seated, hands on his knees), `Sitting_Answering_Questions` while he
       talks, the thumbs-up take itself while he blesses (Chad's direction).
       The procedural arm lift is the stand-in's and is not given to him
       (no `arm`); the whisk still rides his right hand through the chant. */
    /* v19.1 (Chad: "The monk's blessing bowl is colliding into his seat
       base"): the bowls were set on the dais at v16.1, beside a 0.62 m seat
       block. Since v17.1 the throne is BUILT ROUND HIM once he lands
       (seatOnSkin) — its red footrest as wide as his knees and as deep as
       his toes, with a gilt top a little wider — and it reached over both
       spots. So the bowls go out to the footrest's own sides, a hand's width
       clear of its gilt edge, on the dais; the whisk's resting place and
       bowlPos follow the silver one. Never nearer in than v16.1 put them. */
    function placeBowl() {
      const R = monkD.seat.userData.riser;
      if (!R || !bowlG || !almsG) return;
      const half = R.scale.x * R.geometry.parameters.width / 2 + 0.02;   // the gilt top is 4 cm wider than the base
      bowlL.x = Math.max(MONL.x + 0.42, R.position.x + half + 0.14 + 0.06);
      bowlG.position.x = bowlL.x;
      almsG.position.x = Math.min(MONL.x - 0.72, R.position.x - half - 0.14 - 0.06);
      const w = mdW(bowlL.x, bowlL.z); bowlPos.set(w.x, bowlPos.y, w.z);
    }
    const MONK_REST = 'Sit_Thumbs_Up_Right', MONK_TALK = 'Sitting_Answering_Questions', MONK_BLESS = 'Sit_Thumbs_Up_Right';
    const monk = mkRig('monk', { x: MON.x, y: MD_TOP + AJ_RISE, z: MON.z, ry: MD.ry, height: 1.68,   // v16.9: facing the hall from the east wall
                                  sizeOn: 'Walking', sizeAt: 0, idle: MONK_REST, at: 0, seated: true,
                                  then: (r) => {
                                    seatOnSkin(r, monkD.seat, [MONK_REST, MONK_TALK], () => r.play(MONK_REST, 1, 0, false, 0));
                                    placeBowl();
                                    r.model.traverse(o => {
                                      if (!o.isBone) return;
                                      if (/RightHand(_\d+)?$/.test(o.name) && !r.hand) r.hand = o;
                                      if (/RightHandMiddle\d/.test(o.name) && !r.tip) r.tip = o;
                                    });
                                  } });
    /* a take for the length of a line, then back to rest. The rest IS the
       thumbs-up take's first frame, so a blessing cannot "go back to rest" by
       switching takes: it is let finish the cycle it is in — the take begins
       and ends on the same seated pose, hands on the knees — and holds. */
    let monkBack = null;
    function monkDo(take, secs) {
      if (!monk.play(take, 1, 0.45)) return;
      if (monkBack) monkBack.cancel = true;
      const tok = monkBack = { cancel: false };
      after(Math.max(0.5, secs), () => {
        if (tok.cancel || monkBack !== tok) return;
        monkBack = null;
        if (take === MONK_REST) { const a = monk.acts[take]; a.setLoop(THREE.LoopOnce, 1); a.clampWhenFinished = true; }
        else monk.play(MONK_REST, 0, 0.6);
      });
    }

    /* THE MAN UNDER THE NEEDLE — v18.7: Chad's Sak Yant customer (was the
       botak recruit), on the yant stool, facing out, with the Ajarn behind
       him. Chad's direction: SIT_DODGE while the yant goes in (the flinch of a
       man in a trance — "is he just acting it out?"), SIT_TO_STAND when he is
       done, WALKING out. His file was prepped like the monk (prepmonk.mjs: the
       auto-rig's blocky weights diffused — the saw-tooth tearing under his
       raised arms is gone — and the normals shared across the seams).
       SEATED ON HIS SKIN (seatOnSkin's law, v16.8): the dodge is sampled at
       several frames and his soles go on the dais, the stool's top under his
       thighs at the lowest the take sits him, his hips over the stool. */
    const C_DODGE = 'Sit_Dodge', C_STAND = 'Sit_to_standTransition_Female_2', C_WALK = 'Walking';
    const C_STRIDE = 1.43;          // m/s his planted foot travels at rate 1 (measured off the walk take, v18.7)
    /* he sits 0.30 m nearer the Ajarn than the player's stool spot: the dodge
       leans him forward, away from the rod, and his feet must land on the dais
       (and its step). The stool goes with him, and back to CUSH when the
       player takes it (putOther), so the player's seat is v18.6's exactly. */
    const C_BACK = 0.30;
    let STOOL_TOP = SALA.floor + DAIS.h + 0.465;
    function skinStats(r, take, ks) {
      const m = { sole: Infinity, seat: Infinity, hx: 0, hz: 0 };
      for (const k of ks) {
        r.play(take, 1, 0, false, k); r.mixer.update(0);
        r.model.updateMatrixWorld(true); r.hips.getWorldPosition(_v);
        const hx = _v.x, hy = _v.y, hz = _v.z; m.hx += hx / ks.length; m.hz += hz / ks.length;
        r.model.traverse(o => {
          if (!o.isSkinnedMesh) return;
          o.skeleton.update();
          const n = o.geometry.attributes.position.count;
          for (let i = 0; i < n; i += 5) {
            o.getVertexPosition(i, _sv); _sv.applyMatrix4(o.matrixWorld);
            if (_sv.y < m.sole) m.sole = _sv.y;
            /* where he sits (he faces +z): the skin under and just behind the hip joint */
            const dx = _sv.x - hx, dz = _sv.z - hz;
            if (Math.abs(dx) < 0.2 && dz > -0.22 && dz < 0.04 && _sv.y < hy + 0.05 && _sv.y > hy - 0.45 && _sv.y < m.seat) m.seat = _sv.y;
          }
        });
      }
      return m;
    }
    const other = mkRig('customer', { x: CUSH.x, y: SALA.floor + DAIS.h, z: CUSH.z, ry: 0, height: 1.72,
                                      sizeOn: C_WALK, sizeAt: 0, idle: C_DODGE, seated: true,
                                      then: (r) => {
                                        r.model.traverse(o => { if (o.isBone && /Spine2$/.test(o.name) && !r.spine) r.spine = o; });
                                        if (!r.hips || !stool || !r.acts || !r.acts[C_DODGE]) return;
                                        const base = SALA.floor + DAIS.h;
                                        /* standing: the stand take's last frame, soles on the dais */
                                        if (r.acts[C_STAND]) {
                                          const st = skinStats(r, C_STAND, [1]);
                                          r.standDy = base - st.sole;
                                        }
                                        const d = skinStats(r, C_DODGE, [0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9]);
                                        /* the hips over the stool (the player sits there too), the soles on the dais */
                                        r.group.position.x += CUSH.x - d.hx; r.group.position.z += (CUSH.z - C_BACK) - d.hz;
                                        const dy = base - d.sole; r.model.position.y += dy;
                                        r.seatY = r.model.position.y; r.standY = r.model.position.y - dy + (r.standDy ?? dy);
                                        const top = d.seat + dy, h = Math.max(0.2, top - 0.05 - base);   // the cushion (0.05) tops out at his seat
                                        stool.scale.y = h / 0.42; stool.position.y = base + h / 2;
                                        if (stoolTop) stoolTop.position.y = base + h + 0.025;
                                        STOOL_TOP = base + h + 0.05;
                                        if (r.group.visible) { stool.position.z = CUSH.z - C_BACK; if (stoolTop) stoolTop.position.z = stool.position.z; }
                                        r.seatGroup = { x: r.group.position.x, z: r.group.position.z };
                                        r.seatInfo = { sole: +d.sole.toFixed(3), seat: +(d.seat + dy).toFixed(3), stoolTop: +STOOL_TOP.toFixed(3) };
                                        r.cur = null; r.play(C_DODGE, 1, 0);
                                      } });
    const putOther = (on) => {
      other.group.visible = !!on;
      if (stool) stool.position.z = on ? CUSH.z - C_BACK : CUSH.z;
      if (stoolTop) stoolTop.position.z = stool ? stool.position.z : CUSH.z;
      if (!on) return;
      if (other.seatGroup) other.group.position.set(other.seatGroup.x, SALA.floor + DAIS.h, other.seatGroup.z);
      other.group.rotation.y = 0;
      if (other.model && other.seatY !== undefined) other.model.position.y = other.seatY;
      if (other.acts) other.play(C_DODGE, 1, 0);
    };

    /* v19.1: the man who dozed on the bench (the admin tee, episode 2's army
       shirt) is gone — Chad: "in the ep3 chp1 main temple hall, remove the
       army admin shirt guy". The bench stays. */

    /* THE STALL AUNTIE — v17.4: the pink-shirt woman from the tang-ki's
       audience (Chad: "i dont want to repeat the same granny" — the granny is
       episode 1 chapter 3's auntie), SITTING on a wooden stool behind her
       counter on her own take, turned to the path. Her file carries no
       talking take, so she TALKS on the monk's seated one, retargeted onto
       her rig (`sitwomantalk`, masters/v17.4: tools/retarget.mjs … meshy, then
       talkonly.mjs), and nods with it. The stool is built round her, under her
       hips, once she has landed. */
    const auntie = mkRig('sitwoman', { x: STALL.x - 1.15, y: 0.15, z: STALL.z + 0.2, ry: Math.PI / 2, height: 1.30,
                                       seated: true, idle: 'Armature|Sit_Cross_Legged|baselayer', anims: 'sitwomantalk',
                                       then: (r) => {
                                         if (!r.hips) return;
                                         r.model.updateMatrixWorld(true); r.hips.getWorldPosition(_v);
                                         r.group.worldToLocal(_v);
                                         const top = Math.max(0.3, _v.y - 0.11);
                                         /* she sits 15 cm up (group y) so more of her clears the
                                            counter; the stool's legs reach down to the paving */
                                         const st = new THREE.Group(); st.position.set(_v.x, 0, _v.z); r.group.add(st);
                                         const foot = -r.group.position.y, legH = top - 0.05 - foot;
                                         cyl(0.2, 0.2, 0.05, 0, top - 0.025, 0, matWoodL, 14, st);
                                         for (let k = 0; k < 4; k++) {
                                           const a = k * Math.PI / 2 + Math.PI / 4;
                                           cyl(0.022, 0.022, legH, Math.cos(a) * 0.14, foot + legH / 2, Math.sin(a) * 0.14, matWoodL, 6, st);
                                         }
                                         /* a stretcher between the front legs */
                                         box(0.36, 0.03, 0.03, 0, 0.015, 0.16, matWoodL, st);
                                         st.traverse(o => { if (o.isMesh) { o.castShadow = !LOW; o.receiveShadow = true; } });
                                       } });
    /* THE MAN BY THE WALKWAY (v16.1; v16.0's assistant, who stood by the
       Ajarn's dais watching the work) — standing at the sala's north-west
       corner, where the walkway leaves it. When the blessing is done he turns
       to the player and tells him where the Ajarn is (helperTick). */
    const assistant = mkRig('standman', { x: HELP.x, y: SALA.floor, z: HELP.z, ry: HELP_RY, height: 1.70,
                                          idle: 'mixamo.com', rate: 0.8 });

    /* v16.8: the SWEEPING MONK is gone (Chad: "remove the sweeping monk from
       the temple to save render costs") — a second skinned man, a broom and a
       per-frame walk, for someone beyond the player's reach. */

    /* v16.4 · PIGEONS on the paving by the path. They peck; walk within 3.2 m
       and the flock goes up with a burst of wings and away over the wall;
       some time later, when he is well away, they come back down. On wall
       time; only in play. */
    const PIG = { x: -3.3, z: 8.0 };                  // (v16.9: out from the new staircase's foot)
    const pigeons = [];
    let pigState = 'ground', pigT = 0;
    {
      const n = LOW ? 5 : 9;
      const grey = new THREE.MeshStandardMaterial({ color: 0x8e939e, roughness: 0.8 });
      const dark = new THREE.MeshStandardMaterial({ color: 0x5e6470, roughness: 0.6, metalness: 0.15 });
      const beakM = new THREE.MeshStandardMaterial({ color: 0x3a3230, roughness: 0.6 });
      const bodyG = new THREE.SphereGeometry(0.09, 10, 8), headG = new THREE.SphereGeometry(0.045, 8, 6);
      const beakG = new THREE.ConeGeometry(0.012, 0.035, 5), tailG = new THREE.ConeGeometry(0.035, 0.1, 4);
      const wingG = new THREE.PlaneGeometry(0.16, 0.08); wingG.translate(0.08, 0, 0);
      for (let i = 0; i < n; i++) {
        const g = new THREE.Group(), a = hash(i, 31) * Math.PI * 2, r = 0.25 + hash(i, 33) * 0.85;
        const home = new THREE.Vector3(PIG.x + Math.cos(a) * r, 0, PIG.z + Math.sin(a) * r);
        g.position.copy(home); g.rotation.y = hash(i, 35) * Math.PI * 2; world.add(g);
        const body = new THREE.Mesh(bodyG, grey); body.scale.set(0.8, 0.75, 1.3); body.position.y = 0.1; g.add(body);
        const head = new THREE.Group(); head.position.set(0, 0.17, 0.1); g.add(head);
        head.add(new THREE.Mesh(headG, dark));
        const bk = new THREE.Mesh(beakG, beakM); bk.rotation.x = Math.PI / 2; bk.position.z = 0.05; head.add(bk);
        const tl = new THREE.Mesh(tailG, dark); tl.rotation.x = -Math.PI / 2 - 0.3; tl.position.set(0, 0.1, -0.15); tl.scale.z = 0.3; g.add(tl);
        const wings = [];
        for (const sd of [-1, 1]) {
          const w = new THREE.Mesh(wingG, new THREE.MeshStandardMaterial({ color: 0x9aa0ab, roughness: 0.8, side: THREE.DoubleSide }));
          w.position.set(sd * 0.04, 0.14, 0); w.rotation.set(0, sd > 0 ? 0 : Math.PI, 0); w.rotation.z = -1.35; g.add(w); wings.push(w);
        }
        g.traverse(o => { if (o.isMesh) o.castShadow = !LOW; });
        pigeons.push({ g, home, head, wings, ph: hash(i, 37) * 10, vel: new THREE.Vector3(), hop: 0 });
      }
    }
    function pigeonTick(wdt, t) {
      const px = yaw.position.x, pz = yaw.position.z, dMe = Math.hypot(px - PIG.x, pz - PIG.z);
      pigT += wdt;
      if (pigState === 'ground') {
        for (const b of pigeons) {
          b.head.rotation.x = Math.max(0, Math.sin(t * 3.1 + b.ph)) * 0.9;              // pecking
          b.hop -= wdt;
          if (b.hop < 0) { b.hop = 1.5 + hash(b.ph, t | 0) * 3; b.g.rotation.y += (hash(b.ph, 7 + (t | 0)) - 0.5) * 1.6; }
          for (const w of b.wings) w.rotation.z = -1.35;
        }
        if (getState() === 'play' && dMe < 3.2) {
          pigState = 'up'; pigT = 0;
          sfxAt('wingflap', PIG.x, PIG.z, 0.9, 2, 16);
          for (const b of pigeons) {
            const ax = b.g.position.x - px, az = b.g.position.z - pz, al = Math.hypot(ax, az) || 1;
            b.vel.set(ax / al * (2.2 + hash(b.ph, 3)), 3.2 + hash(b.ph, 5) * 1.5, az / al * (2.2 + hash(b.ph, 3)) - 1.2);
            b.g.rotation.y = Math.atan2(b.vel.x, b.vel.z);
          }
        }
      } else if (pigState === 'up') {
        for (const b of pigeons) {
          b.vel.y += wdt * 0.8;
          b.g.position.addScaledVector(b.vel, wdt);
          const f = Math.sin(t * 34 + b.ph); for (const [i, w] of b.wings.entries()) w.rotation.z = (i ? -1 : 1) * 0 + f * 0.9 * (i ? 1 : -1);
          b.head.rotation.x = 0;
        }
        if (pigT > 4.5) { pigState = 'away'; pigT = 0; for (const b of pigeons) b.g.visible = false; }
      } else if (pigState === 'away') {
        if (pigT > 22 && dMe > 8) {
          pigState = 'down'; pigT = 0;
          for (const b of pigeons) { b.g.visible = true; b.g.position.set(b.home.x - 3, 7, b.home.z + 4); b.g.rotation.y = Math.atan2(3, -4); }
        }
      } else if (pigState === 'down') {
        const k = Math.min(1, pigT / 3.0), e = 1 - (1 - k) * (1 - k);
        for (const b of pigeons) {
          b.g.position.set(b.home.x - 3 * (1 - e), 7 * (1 - e), b.home.z + 4 * (1 - e));
          const f = Math.sin(t * 30 + b.ph) * (1 - k); for (const [i, w] of b.wings.entries()) w.rotation.z = k > 0.95 ? -1.35 : f * 0.9 * (i ? 1 : -1);
        }
        if (k >= 1) { pigState = 'ground'; pigT = 0; }
      }
    }
    function pigeonReset() {
      pigState = 'ground'; pigT = 0;
      for (const b of pigeons) { b.g.visible = true; b.g.position.copy(b.home); for (const w of b.wings) w.rotation.z = -1.35; }
    }

    /* v16.4 · THE EAVE BELLS' sound: a tinkle from the nearest stretch of eave
       every few seconds while he is near the sala (a one-shot — wind chimes
       ring when the wind moves, not in a loop) */
    let bellNext = 2;
    function bellSoundTick(wdt) {
      if (getState() !== 'play') return;
      bellNext -= wdt;
      if (bellNext > 0) return;
      bellNext = 3.5 + Math.random() * 5;
      let best = null, bd = 1e9;
      for (const h of bellHang) { const d = Math.hypot(h.x - yaw.position.x, h.z - yaw.position.z); if (d < bd) { bd = d; best = h; } }
      if (best) sfxAt('eavebells', best.x, best.z, 0.55, 3, 20, 0.9 + Math.random() * 0.2);
    }

    /* THE TRAY IN HIS HANDS: the offering set, carried low in front of him
       from the stall to the Ajarn. It lives on the camera, like chapter 1's
       note, and only in play. */
    const handTray = mkTray(m => m.traverse(o => { if (o.isMesh) { o.castShadow = false; o.renderOrder = 2; } }));
    /* carried low and to the left, the hand beside it: at 1.15x and 0.62 m it
       filled the lower half of the frame (CP3). v18.8: the sangkathan set is a
       bucket, taller than the tray, so it is held lower and nearly upright (a
       tray tilted 0.62 to show its flowers; a bucket tilted so looks spilt).
       Chad: "needs to be slightly bigger, and bring it downwards by abit so
       that it doesn't look like its floating in mid air" — x0.85, its base
       below the frame's bottom edge, carried rather than hovering */
    handTray.scale.setScalar(0.85);
    handTray.position.set(-0.17, -0.58, -0.72); handTray.rotation.set(0.22, 0.3, 0);
    handTray.traverse(o => { if (o.isMesh) { o.castShadow = false; o.renderOrder = 2; } });
    handTray.visible = false;
    camera.add(handTray); owned.push(handTray);
    const myTray = mkTray(); myTray.position.set(0.9, 0, -0.1); myTray.visible = false; offerPile.add(myTray);

    /* ------------------------------------------------------ the chapter clock */
    /* v16.1 inserts 'bless' (the monk) and 'go' (the walk to the room); every
       comparison below is by NAME, never by a number, so the order can grow */
    const PHASES = ['stall', 'shoes', 'wai', 'present', 'bless', 'go', 'wait', 'seat', 'yant', 'turn', 'decide'];
    const pIdx = (p) => PHASES.indexOf(p);
    const roomPhase = (p) => pIdx(p) >= pIdx('wait');
    let phase = 'stall';
    let booted = false;
    const dayClock = { t: 0 };
    let lastWall = 0;
    const todo = [];
    function after(secs, fn) { todo.push({ at: dayClock.t + secs, fn }); todo.sort((a, b) => a.at - b.at); }
    function runTodo() { while (todo.length && todo[0].at <= dayClock.t) todo.shift().fn(); }
    function dropTodo() { todo.length = 0; }
    const heard = new Set();                      // one-shot lines already said: 'hi', 'shoes', 'katha'

    const speak = { until: 0, pending: null };
    function speakReset() { speak.until = 0; speak.pending = null; }
    function sayLine(name, vol = 1, onStart, pan) {
      if (!worldSfx) return false;
      if (dayClock.t < speak.until) return false;
      const start = () => { speak.until = dayClock.t + (SECS[name] || 2.5) + 0.25; if (onStart) onStart(); };
      if (worldSfx(name, vol, 1, pan)) { start(); return true; }
      speak.pending = { name, vol, start, pan, give: dayClock.t + 3 };
      speak.until = dayClock.t + 0.2;
      return true;
    }
    function runSpeak() {
      const q = speak.pending;
      if (!q || dayClock.t < speak.until) return;
      if (dayClock.t > q.give) { speak.pending = null; return; }
      if (worldSfx(q.name, q.vol, 1, q.pan)) { speak.pending = null; q.start(); }
      else speak.until = dayClock.t + 0.2;
    }
    const lineQ = [];
    function queueLine(name, onStart, vol = 1) { lineQ.push({ name, onStart, vol }); }
    function queueFn(fn) { lineQ.push({ fn }); }
    function queueGap(secs) { lineQ.push({ gap: secs }); }
    function runQueue() {
      if (!lineQ.length || speak.pending || dayClock.t < speak.until) return;
      const q = lineQ[0];
      if (q.fn) { lineQ.shift(); q.fn(); return; }
      if (q.gap) { lineQ.shift(); speak.until = dayClock.t + q.gap; return; }
      lineQ.shift();
      sayLine(q.name, q.vol, q.onStart, panOf(q.name));
    }
    /* who says a line decides where it comes from: the Ajarn's from the dais,
       the auntie's from the stall — a stereo pan off the lens's own heading */
    function panOf(name) {
      const at = name.startsWith('aj1') ? AJ : name.startsWith('au1') ? STALL
               : name.startsWith('mk1') ? MON : name.startsWith('hp1') ? HELP : null;
      return at ? panAt(at.x, at.z) : 0;
    }
    function panAt(x, z) {
      const dx = x - yaw.position.x, dz = z - yaw.position.z;
      const a = Math.atan2(dx, -dz) + yaw.rotation.y;          // 0 ahead, +right
      return THREE.MathUtils.clamp(Math.sin(a) * 0.75, -0.75, 0.75);
    }
    function sfxAt(name, x, z, vol, near = 3, far = 18, rate = 1) {
      if (!worldSfx) return null;
      const d = Math.hypot(x - yaw.position.x, z - yaw.position.z);
      const k = THREE.MathUtils.clamp((far - d) / (far - near), 0, 1);
      if (k <= 0.02) return null;
      return worldSfx(name, vol * (0.25 + 0.75 * k * k), rate, panAt(x, z));
    }
    if (warmSounds) warmSounds(['mk1come', 'mk1chant', 'mk1iti', 'mk1teach', 'hp1room', 'aj1mat', 'z1sadhu', 'z1room', 'z1thank',
                                'roomdoor', 'watersprinkle', 'roomamb', 'eavebells', 'wingflap',
                                'z1wai', 'z1wait', 'z1trance', 'z1warm', 'au1hi', 'au1sell', 'au1shoes',
                                'aj1next', 'aj1sit', 'aj1breathe', 'aj1katha', 'aj1done', 'aj1ask',
                                'aj1which', 'aj1chosen', 'yantseal',
                                'yantap', 'yantblow', 'yantwarm', 'e3bell', 'shoesoff', 'barestep',
                                'trayset', 'coins', 'incenselit', 'e3gong',
                                /* fired from walkOut()/ending(), helpers the engine's source scan cannot
                                   read (v10.2) — so warmed here, or the last line over the black is silent */
                                'z1close', 'z1next', 'e3close', 'step']);

    function talk(rig, secs) {
      rig.nod = secs;
      if (rig === auntie && rig.acts && rig.acts.Talk) {
        auntie.play('Talk', 1, 0.35);
        after(secs + 0.2, () => { if (auntie.cur === 'Talk') auntie.play('Armature|Sit_Cross_Legged|baselayer', 1, 0.45); });
      }
    }

    /* ------------------------------------------------------------ the phases */
    function setPhase(p) {
      phase = p;
      if (kit) kit.setPhase(p);
      objectiveFor(p);
      syncProps();
    }
    function objectiveFor(p) {
      if (!kit) return;
      const W = DATA.words;
      const obj = { stall: W.objStall, shoes: W.objShoes, wai: W.objWai, present: W.objPresent,
                    bless: W.objBless, go: W.objGo,
                    wait: W.objWait, seat: W.objSeat, yant: W.objStill }[p];
      kit.objective(obj || null);
      const wp = { stall: { x: STALL.x + 1.1, y: 1.4, z: STALL.z },
                   shoes: { x: RACK.x, y: 1.2, z: RACK.z + 0.4 },
                   wai: { x: WAI.x, y: 1.3 + LIFT, z: WAI.z - 0.6 },
                   present: { x: mdW(-1.0, 1.0).x, y: 1.3 + LIFT, z: mdW(-1.0, 1.0).z },
                   bless: { x: BLESS.x, y: 1.0 + LIFT, z: BLESS.z },
                   go: { x: KDOOR.x + 0.3, y: 1.7 + LIFT, z: KDOOR.z },
                   wait: { x: WAIT.x, y: 1.0 + LIFT, z: WAIT.z },
                   seat: { x: CUSH.x, y: 1.0 + LIFT, z: DAIS.z + DAIS.d / 2 + 0.55 } }[p];
      kit.waypoint(wp || null);
    }
    /* everything a phase implies about the world is DERIVED from the phase,
       every time it changes and on a resume (the v11.6 law): the tray in his
       hands, his shoes on the rack, his offering on the dais, who is on the
       stool, which zone glows */
    function syncProps() {
      const i = pIdx(phase);
      handTray.visible = i >= 1 && i <= 3 && getState() === 'play';
      myShoes.visible = i >= 2;
      myTray.visible = i >= pIdx('bless');
      zone.visible = phase === 'wait' && !seated;
      zoneSeat.visible = phase === 'seat' && !seated;
      zoneBless.visible = phase === 'bless' && !blessing;
      if (i >= pIdx('seat') && !otherLeaving) putOther(false);
    }

    /* 1 · THE STALL */
    function buyOffering() {
      if (phase !== 'stall') return false;
      talk(auntie, SECS.au1sell);
      queueLine('au1sell');
      if (worldSfx) { worldSfx('coins', 0.7); after(1.2, () => worldSfx('trayset', 0.8)); }
      if (kit) kit.conduct({ note: 'Bought a Sangkathan set for the Ajarn.', s: 0, a: 2 });
      // the tray she hands over comes off her counter
      const t = stallTrays[2]; if (t) t.visible = false;
      setPhase('shoes');
      return true;
    }
    /* 2 · THE SHOES */
    function shoesOff() {
      if (phase !== 'shoes') return false;
      if (worldSfx) worldSfx('shoesoff', 0.9);
      setPhase('wai');
      return true;
    }
    /* 3 · THE ALTAR — he kneels, and bows three times, the way the man
       beside him does. The pose is the kit's (a low eye, a narrow neck). */
    let kneel = null;                             // { t0 } while kneeling
    function beginWai() {
      if (phase !== 'wai' || kneel) return false;
      yaw.position.x = WAI.x; yaw.position.z = WAI.z;
      if (kit) kit.root(true);
      turnTo(0, 0.8, { y: SALA.floor + 0.98, span: 0.7, lo: -0.9, hi: 0.8 });
      kneel = { t0: dayClock.t };
      // he lights three sticks from the altar candle, and the bell is struck
      if (worldSfx) { worldSfx('incenselit', 0.7); after(0.9, () => worldSfx('e3bell', 0.55, 1, 0)); }
      after(1.6, () => queueLine('z1wai'));
      after(6.4, () => {
        kneel = null;
        if (kit) { kit.pose('standing', { secs: 0.7 }); kit.root(false); kit.conduct({ note: 'Paid your respects at the altar first.', s: 2, a: 2 }); }
        setPhase('present');
      });
      return true;
    }
    function kneelTick() {
      if (!kneel) return;
      /* three bows: the head goes down to the floor and comes back up, over
         the six seconds, a little slower each time */
      const t = dayClock.t - kneel.t0;
      let dip = 0;
      for (const [a, b] of [[1.2, 2.6], [2.8, 4.2], [4.4, 5.9]]) {
        if (t > a && t < b) { const k = (t - a) / (b - a); dip = Math.sin(k * Math.PI); }
      }
      pitch.rotation.x = -0.12 - dip * 0.75;
    }
    /* 4 · THE OFFERING, to the monk (v16.1: it was the Ajarn's) */
    function present() {
      if (phase !== 'present') return false;
      if (worldSfx) worldSfx('trayset', 0.85, 1, panAt(MD.x, MD.z));
      monk.nod = 1.2;
      if (kit) kit.conduct({ note: 'Gave the offering to the monk with both hands.', s: 0, a: 2 });
      setPhase('bless');
      queueGap(0.7);
      queueLine('mk1come', () => { monkFace(true); monk.nod = SECS.mk1come; monkDo(MONK_TALK, SECS.mk1come); });
      return true;
    }
    /* 4b · THE BLESSING (v16.1). He kneels under the monk's raised seat and
       bows; the monk chants the blessing (the Pali in a Thai monk's mouth) and
       flicks lustral water over him from the silver bowl, three times; then
       (v19.9) the short Itipiso, the Buddha's virtues; then the teaching, Chad's words — "blessings don't replace hard work and
       merit" — and he answers "Sadhu", bows, and stands. Laid on the line
       queue so no line is dropped on a slow frame; the flicks are timed from
       the moment the chant actually starts. */
    let blessing = null;                          // { t0, chantAt, bowAt } while kneeling
    /* v16.5: the praying hands held LOWER than chapter 1's −0.235 (Chad: "move
       the prayer hands down even more so that i cannot see that protruding
       thumbs"). Swept on the phone crop: at −0.34 the thumbs still show, at
       −0.36 a sliver touches the bottom edge, at −0.37 only the tips of the
       joined fingers rise into frame. The lens's vertical angle is fixed, so
       the phone and the desktop agree. */
    const PRAY_Y = -0.37;
    const FLICKS = [3.0, 6.3, 9.8];               // seconds into the chant: its three breaths (v16.2, Arthur)
    /* v21.31 · THE CHANTS, CAPTIONED (Chad: "when player is getting blessing from the monk, and the monk chants his
       lines, i also want subtitles with original pali words and the translated meaning, the same way it is done in
       episode 3 chapter 3 ... for the sakyant ajahn, when the ajahn chants his namo tassa, also add subtitles for
       that"). e3c3's seam (kit.captions): each line up while it is chanted, the Pali over what it means, counted on
       wall time from the moment the voice starts. Timed on each take's own breaths, measured: the blessing's four
       phrases end and begin at 2.71/3.72, 5.83/7.05 and 9.34/10.50 of its 12.74 s; the Itipiso's seven phrases fall
       into Chad's three lines at 7.35/8.44 and 14.82/16.02 of its 26.79 s; the Ajarn says his homage twice, the
       breath between at 5.0–5.7 of 10.57 s */
    const CAPS = {
      bless: [['bless1', 0.05, 3.2], ['bless2', 3.4, 6.45], ['bless3', 6.65, 9.9], ['bless4', 10.1, 12.95]],
      iti: [['iti1', 0.05, 7.9], ['iti2', 8.1, 15.4], ['iti3', 15.6, 27.0]],
      namo: [['namo', 0.05, 5.6], ['namo', 5.75, 10.75]]
    };
    function chantCaps(k) {
      if (!kit || !kit.captions || !CAPS[k]) return;
      const Wd = DATA.words;
      kit.captions(CAPS[k].map(([w, at, end]) => ({ at, end, text: Wd[w], sub: Wd[w + 'en'] })));
    }
    function beginBless() {
      if (phase !== 'bless' || blessing) return false;
      yaw.position.x = BLESS.x; yaw.position.z = BLESS.z;
      if (kit) kit.root(true);
      const face = Math.atan2(-(MON.x - BLESS.x), -(MON.z - BLESS.z));
      turnTo(face, 0.9, { y: SALA.floor + 0.98, span: 0.6, lo: -0.9, hi: 0.8 });
      blessing = { t0: dayClock.t, chantAt: -1, bowAt: -1, flick: 0, mark: 0 };
      /* v16.5 (Chad: "his hands should switch to the same exact praying
         hands pose that was used back in episode 1 chapter 1 option 4") */
      if (kit && kit.pray) kit.pray(true, { secs: 1.4, y: PRAY_Y });
      monkFace(true);
      syncProps();
      if (worldSfx) worldSfx('barestep', 0.45, 0.85);
      after(1.0, () => { if (worldSfx) worldSfx('e3bell', 0.4, 1, panAt(MD.x, MD.z)); });
      /* the blessing keeps its own time whether or not a line sounds (a line
         whose bytes have not arrived is dropped, and every harness runs
         muted): the chant's start is stamped when the queue REACHES it, and
         the queue is held for each chant's and the teaching's own lengths */
      const hold = (secs) => queueFn(() => { if (blessing) speak.until = Math.max(speak.until, blessing.mark + secs); });
      queueGap(2.2);
      queueFn(() => { if (blessing) blessing.chantAt = blessing.mark = dayClock.t; });
      queueLine('mk1chant', () => { monk.nod = SECS.mk1chant * 0.6; monkDo(MONK_BLESS, SECS.mk1chant); chantCaps('bless'); });
      hold(SECS.mk1chant + 0.3);
      /* v19.9 — the short Itipiso straight after (Chad: "Can i add another
         short itipiso chant after that short chant too?"). The whisk is down
         by then (the flicks end 11.4 s into the blessing chant); a chanting
         monk sits still, so he keeps his rest and only his head moves with
         the words. */
      queueGap(0.9);
      queueFn(() => { if (blessing) blessing.mark = dayClock.t; });
      queueLine('mk1iti', () => { monk.nod = SECS.mk1iti * 0.6; chantCaps('iti'); });
      hold(SECS.mk1iti + 0.3);
      queueGap(0.9);
      queueFn(() => { if (blessing) blessing.mark = dayClock.t; });
      queueLine('mk1teach', () => { monk.nod = SECS.mk1teach; monkDo(MONK_TALK, SECS.mk1teach); });
      hold(SECS.mk1teach + 0.3);
      queueGap(0.5);
      queueFn(() => { if (blessing) blessing.bowAt = dayClock.t; });
      queueGap(0.5);
      queueLine('z1sadhu');
      queueGap(1.0);
      queueFn(() => endBless());
      return true;
    }
    function endBless() {
      if (!blessing) return;
      blessing = null;
      if (kit) {
        if (kit.pray) kit.pray(false, { secs: 0.9 });   // v16.5: the hands come down as he stands
        kit.pose('standing', { secs: 0.7 }); kit.root(false);
        kit.conduct({ note: 'Knelt for the monk\'s blessing, and heard what it asks of you.', s: 3, a: 2 });
      }
      monkFace(false);
      setPhase('go');
      goCall();
    }
    /* the pitch while kneeling: looking up at him, a bow as he kneels and a
       bow when he answers — the lens is his head, so the bows are the lens */
    function blessTick() {
      if (!blessing) return;
      const t = dayClock.t - blessing.t0;
      let dip = 0;
      if (t > 0.9 && t < 2.2) dip = Math.sin((t - 0.9) / 1.3 * Math.PI);
      if (blessing.bowAt >= 0) { const u = dayClock.t - blessing.bowAt; if (u > 0 && u < 1.5) dip = Math.sin(u / 1.5 * Math.PI); }
      if (!turning) pitch.rotation.x = 0.30 - dip * 0.95;
      // the flicks, off the chant's own start
      if (blessing.chantAt >= 0) {
        const c = dayClock.t - blessing.chantAt;
        while (blessing.flick < FLICKS.length && c >= FLICKS[blessing.flick] + 0.32) sprinkle(blessing.flick++);
      }
    }
    /* THE WATER: a spray of drops thrown from the whisk's tip toward his face,
       falling as they come, a cold glint on the screen, the sound of it */
    const drops = [];
    let dropP = null;
    if (makeSoftDot) {
      const N = 60, geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(N * 3).fill(-999), 3));
      const dot = makeSoftDot(); madeTex.push(dot);
      dropP = new THREE.Points(geo, new THREE.PointsMaterial({ map: dot, size: 0.035, transparent: true, opacity: 0.85, depthWrite: false, color: 0xe8f4ff, fog: false }));
      dropP.frustumCulled = false; world.add(dropP);
      for (let i = 0; i < N; i++) drops.push({ life: 0, p: new THREE.Vector3(), v: new THREE.Vector3() });
    }
    const _tip = new THREE.Vector3(), _to = new THREE.Vector3();
    function sprinkle(i) {
      if (worldSfx) worldSfx('watersprinkle', 0.75, 0.94 + i * 0.05, panAt(MON.x, MON.z) * 0.5);
      if (kit) { kit.flash({ color: '#dcefff', secs: 0.45 }); if (kit.haptic) kit.haptic([18, 30, 12]); }
      monkArmFlick = 1;
      if (!dropP) return;
      whisk.updateWorldMatrix(true, false);
      _tip.copy(whisk.userData.tip).applyMatrix4(whisk.matrixWorld);
      camera.getWorldPosition(_to);
      let n = 0;
      for (const d of drops) {
        if (d.life > 0 || n >= 20) continue;
        n++;
        d.life = 0.7 + hash(n, i) * 0.4;
        d.p.copy(_tip);
        d.v.copy(_to).sub(_tip).multiplyScalar(1.3 + hash(n, i + 7) * 0.5);
        d.v.x += (hash(n, i + 3) - 0.5) * 1.6; d.v.y += 1.2 + hash(n, i + 5) * 0.9; d.v.z += (hash(n, i + 9) - 0.5) * 1.6;
      }
    }
    function dropTick(wdt) {
      if (!dropP) return;
      const a = dropP.geometry.attributes.position;
      let any = false;
      drops.forEach((d, i) => {
        if (d.life > 0) {
          d.life -= wdt; d.v.y -= 9.0 * wdt; d.p.addScaledVector(d.v, wdt); any = true;
          a.array[i * 3] = d.p.x; a.array[i * 3 + 1] = d.p.y; a.array[i * 3 + 2] = d.p.z;
        } else a.array[i * 3 + 1] = -999;
      });
      if (any || dropP.userData.was) a.needsUpdate = true;
      dropP.userData.was = any;
    }
    /* HIS ARM. While he blesses, the right arm is lifted from the shoulder (a
       rotation in the WORLD about his own left-right axis, turned into the
       bone's frame so it is right whatever the rig's rest pose), dipped to the
       bowl, raised, and flicked down on each throw of water; the whisk rides
       his hand. Put back before the mixer runs (the v11.5 law, as the head). */
    let monkArmK = 0, monkArmFlick = 0;
    const _qa = new THREE.Quaternion(), _qp = new THREE.Quaternion(), _qw = new THREE.Quaternion(), _ax = new THREE.Vector3(1, 0, 0);
    const _hp = new THREE.Vector3();
    /* a point IN a hand: k of the way from the wrist (the hand bone) to the
       middle fingertip — the fingers' grip, not the wrist (v17.1) */
    function handGrip(r, k, out) {
      r.hand.getWorldPosition(out);
      if (r.tip) { r.tip.getWorldPosition(_tg); out.lerp(_tg, k); }
      return out;
    }
    const _tg = new THREE.Vector3(), _wUp = new THREE.Vector3(0, -0.035, 0);   // v17.1b (Chad: "The stick should be below his palm, not on top of it"): under the hand
    function monkArmPre() { if (monk.arm && monk.armWrote) monk.arm.quaternion.copy(monk.armWrote); }
    function monkArmPost(wdt) {
      const want = blessing && blessing.chantAt >= 0 && dayClock.t - blessing.chantAt < FLICKS[2] + 1.6 ? 1 : 0;
      monkArmK += (want - monkArmK) * (1 - Math.exp(-wdt * 3.2));
      monkArmFlick = Math.max(0, monkArmFlick - wdt * 3.0);
      if (monk.arm) {
        if (!monk.armWrote) monk.armWrote = new THREE.Quaternion();
        monk.armWrote.copy(monk.arm.quaternion);
        const ang = monkArmK * 1.05 - monkArmFlick * 0.55 * Math.sin(Math.min(1, monkArmFlick) * Math.PI);
        if (Math.abs(ang) > 1e-4) {
          monk.arm.parent.getWorldQuaternion(_qp);
          monk.arm.getWorldQuaternion(_qw);
          _qa.setFromAxisAngle(_ax, -ang);
          _qw.premultiply(_qa);
          monk.arm.quaternion.copy(_qp.invert().multiply(_qw));
          monk.model.updateMatrixWorld(true);
        }
      }
      // the whisk: in his hand while he blesses, across the bowl when not
      if (monk.hand && monkArmK > 0.02) {
        /* v17.1 (Chad: "Why is the stick item on his hand like that? It
           makes no sense"): it hung off the WRIST bone pointing at the lens,
           a bundle floating beside a hand that was not holding it. His rig has
           no finger bones (one tip bone), so it cannot close a fist round a
           handle, and his takes hold the palms up — so the whisk lies UNDER
           THE OPEN HAND (Chad: "below his palm, not on top of it"), its bound
           handle under the middle of the hand and the
           stalks running out past the fingertips the way the hand points, as a
           loosely held brush does; each throw of water tips the stalks up
           toward the one being blessed. */
        handGrip(monk, 0.42, _hp);
        monk.hand.getWorldPosition(_to);
        const fdir = _hp.clone().sub(_to).normalize();
        camera.getWorldPosition(_to);
        const toCam = _to.sub(_hp).setY(0).normalize();
        const dir = fdir.clone().addScaledVector(new THREE.Vector3(0, 1, 0), 0.06 + monkArmFlick * 0.8).addScaledVector(toCam, monkArmFlick * 0.3).normalize();
        whisk.position.copy(_hp).add(_wUp).addScaledVector(dir, -0.04);
        whisk.lookAt(whisk.position.clone().add(dir));
      } else {
        const wr = mdW(bowlL.x - 0.14, bowlL.z);                       // v16.9: across the bowl, in the turned dais's frame (v19.1: wherever placeBowl put it)
        whisk.position.set(wr.x, bowlPos.y + 0.07, wr.z);
        whisk.rotation.set(0, Math.PI / 2 + 0.2 + MD.ry, 0);
        whisk.rotateX(-0.12);
      }
    }
    function monkFace(on) {
      monk.lookPitch = on ? -0.14 : 0;
    }

    /* 4c · THE MAN BY THE WALKWAY: he turns to the player and tells him where
       the Ajarn is. Said again on a resume into 'go', so nobody lands there
       without being told where to go. */
    let helperLook = false;
    function goCall() {
      helperLook = true;
      queueGap(0.8);
      queueLine('hp1room', () => { assistant.nod = SECS.hp1room; });
    }
    function helperTick(wdt) {
      const g = assistant.group;
      let want = HELP_RY;
      if (helperLook) want = Math.atan2(yaw.position.x - g.position.x, yaw.position.z - g.position.z);
      let d = want - g.rotation.y; while (d > Math.PI) d -= Math.PI * 2; while (d < -Math.PI) d += Math.PI * 2;
      g.rotation.y += d * (1 - Math.exp(-wdt * 2.5));
      // he stops watching once the player has gone down the walkway
      if (helperLook && (roomPhase(phase) || yaw.position.x < WALK.x1 + 2.0)) helperLook = false;
    }

    /* 4d · THE DOOR, AND THE SCENE CHANGE (v16.1: "after opening the door, it
       will be a scene change with a fade to black and fade to scene, put the
       player inside the room, but load all the assets first while fading
       before the room shows up"). The door swings; the black comes up; IN THE
       BLACK he is put inside the room, the room's light is applied, the man
       under the needle is on the stool and the rod is working; then the room
       is WARMED (kit.warm: every texture uploaded, every program compiled, a
       frame drawn with everything forced visible) and every rig in it has
       landed — and only then does the black go. */
    let entering = null;
    let kutiK = 0, roomDoorK = 0, roomDoorWant = 0;
    function openDoor() {
      if (phase !== 'go' || entering) return false;
      entering = { t0: dayClock.t };
      if (kit) kit.root(true);
      if (worldSfx) worldSfx('roomdoor', 0.9);
      after(0.5, () => { if (kit) kit.fade(1, 0.6); });
      /* nothing moves until the black is ALL the way up: the kit's fade runs
         on the frame's clamped dt, so on a device under twenty frames a
         second it takes longer than its 0.6 s (measured on the probe box:
         the room was swapped in with the screen still part-lit) */
      const whenBlack = () => { if (!alive || phase !== 'go' || !entering) return;   // v18.7: an entry cleared under the fade (applyPhase, reset) stops waiting
        if (!kit || kit.getFade() >= 0.99 || dayClock.t - entering.t0 > 12) intoRoom(); else after(0.1, whenBlack); };
      after(1.1, whenBlack);
      return true;
    }
    function placeInRoom(at) {
      const p = at || RIN;
      yaw.position.x = p.x; yaw.position.z = p.z;
      /* v18.7: turned a little further right than v16.1, so the Ajarn, the
         masks over him and the altar row on the east wall are all in a phone's
         frame the moment the black lifts (Chad: "it still must be easily seen
         by the player the moment he enters the room"). v19.1: the altar row
         is on the BACK wall now, left of the masks, so the view is turned back
         to the gap between them — the altar on one side of a phone's frame,
         the masks on the other, the Ajarn at its edge (a phone sees ~37
         degrees across; the two rows and the Ajarn span 49 from here). */
      yaw.rotation.y = Math.atan2(-((ROOM.x - 0.45) - p.x), -((ROOM.z - 2.9) - p.z));
      pitch.rotation.x = -0.04;
      if (kit) kit.daylight(ROOMLIGHT, 0);
    }
    function intoRoom() {
      if (!alive || phase !== 'go') return;
      placeInRoom();
      if (kit) kit.pose('standing', { secs: 0.05 });
      putOther(true); workOn = true; strikeAt = dayClock.t + 1.2;
      setPhase('wait');
      const warmed = kit && kit.warm ? kit.warm() : Promise.resolve(0);
      const t0 = performance.now();
      const landed = () => new Promise(res => {
        const poll = () => ((ajarn.ready && other.ready) || performance.now() - t0 > 8000 || !alive) ? res() : setTimeout(poll, 100);
        poll();
      });
      warmed.then(landed).then(() => {
        if (!alive) return;
        kutiK = 0; if (kutiLeaf) kutiLeaf.rotation.y = 0;
        if (kit) { kit.fade(0, 0.9); kit.root(false); }
        entering = null;
        queueGap(1.1);
        queueLine('z1room');
        queueGap(0.4);
        queueLine('aj1mat', () => { ajarn.nod = SECS.aj1mat; });
      });
    }
    function doorTick(wdt) {
      const want = entering ? 1 : 0;
      kutiK += (want - kutiK) * (1 - Math.exp(-wdt * (want ? 4.0 : 8.0)));
      if (kutiLeaf) kutiLeaf.rotation.y = kutiK * 1.35;
      roomDoorK += (roomDoorWant - roomDoorK) * (1 - Math.exp(-wdt * 3.5));
      if (roomLeaf) roomLeaf.rotation.y = -roomDoorK * 1.3;          // outward, into the passage
    }
    /* 5 · THE WAIT — he sits on the mat and watches the man before him. The
       sequence is laid out once, off the chapter's clock; the lines go
       through the queue so none is dropped on a slow frame. */
    let seated = null;                            // 'mat' | 'stool' while seated
    let otherLeaving = null;
    function sitMat() {
      seated = 'mat'; syncProps();
      yaw.position.x = WAIT.x; yaw.position.z = WAIT.z;
      const face = Math.atan2(-(CUSH.x - WAIT.x), -(CUSH.z - WAIT.z));
      if (kit) kit.root(true);
      turnTo(face, 1.1, { y: SALA.floor + 0.86, span: 1.5, lo: -0.7, hi: 0.7 });
      if (worldSfx) worldSfx('barestep', 0.5, 0.85);
      waitSeq();
    }
    /* v18.7 (Chad: "While the customer is getting his sakyant and playing
       the sit dodge animation, i want a player voiceline to say something
       like 'This guy seems to be in some kind of trance...'"): z1trance follows
       the katha (~6.0-16.6, then 17.2-26.5), and everything after the work —
       the rod stopping, the blow, the man standing, "Next" — moves 5.5 s
       later so the line is said while he is still under the rod. */
    function waitSeq() {
      after(2.4, () => queueLine('z1wait'));
      after(6.0, () => { if (!heard.has('katha2')) { heard.add('katha2'); queueLine('aj1katha', () => { ajarn.nod = SECS.aj1katha; chantCaps('namo'); }, 0.8);
                                                       queueGap(0.6); queueLine('z1trance'); } });
      after(27.0, () => { workOn = false; });
      after(28.1, () => sfxAt('yantblow', CUSH.x, CUSH.z - 0.2, 0.85, 2, 12));
      after(29.7, () => otherLeaves());
      after(31.5, () => queueLine('aj1next', () => { ajarn.nod = SECS.aj1next; }));
      after(33.7, () => {
        seated = null;
        if (kit) { kit.pose('standing', { secs: 0.7 }); kit.root(false); }
        setPhase('seat');
      });
    }
    /* the man stands, wais, and walks out down the steps and away across
       the courtyard — the botak recruit's own walk take, glided under him on
       the same dt his mixer is given (the v9.3 law) */
    /* v16.1: he leaves by the room's door — off the dais, across the planks,
       the door opens for him, and he is gone into the dark beyond it */
    const LEAVE = [{ x: CUSH.x, z: CUSH.z + 0.2 }, { x: CUSH.x - 0.1, z: DAIS.z + DAIS.d / 2 + 0.55 },
                   { x: RDOOR.x + 0.55, z: RDOOR.z - 1.0 }, { x: RDOOR.x, z: RDOOR.z - 0.35 }, { x: RDOOR.x, z: RDOOR.z + 0.4 }];
    /* v18.7: he STANDS first (Sit_to_stand, once, held at its end), then walks.
       The stand carries his hips ~0.36 m forward of where the walk take keeps
       them, so on the frame the takes change the group is moved by exactly the
       hips' jump — he walks on from where he stood up, not from the stool —
       and the path starts there. His height eases from the seated grounding to
       the standing one over the stand (each measured on his skin). */
    function otherLeaves() {
      if (!other.group.visible) return;
      const canStand = !!(other.acts && other.acts[C_STAND] && other.model);
      otherLeaving = { seg: 0, s: 0, t: 0, stand: canStand ? 0 : -1, path: LEAVE };
      if (canStand) other.play(C_STAND, 1, 0.25, true);
      else if (other.acts) other.play(C_WALK, 1.05 / C_STRIDE, 0.5);
    }
    /* v19.3: the stool is his only once the man on it has STOOD UP and walked
       clear of it. 'seat' is set on the chapter's wall clock (4 s after he
       starts to rise), but his stand and his walk run on the frame's clamped
       dt, as his mixer does (the v9.3 law) — so on a phone under twenty frames
       a second he was still rising from the stool when the zone fired, and
       sitting put the camera inside him (photographed on the probe box: the
       back of his head stretched across the frame). */
    function stoolClear() {
      const L = otherLeaving;
      if (!L) return true;
      if (L.stand >= 0) return false;
      return Math.hypot(other.group.position.x - CUSH.x, other.group.position.z - CUSH.z) > 1.0;
    }
    function leaveTick(dt) {
      const L = otherLeaving; if (!L) return;
      const g = other.group;
      if (L.stand >= 0) {
        L.stand += dt;
        const dur = other.acts[C_STAND].getClip().duration, k = Math.min(1, L.stand / dur);
        if (other.seatY !== undefined && other.standY !== undefined)
          other.model.position.y = other.seatY + (other.standY - other.seatY) * k * k * (3 - 2 * k);
        if (L.stand < dur) return;
        g.updateMatrixWorld(true); other.hips.getWorldPosition(_v); const bx = _v.x, bz = _v.z;
        other.play(C_WALK, 1.05 / C_STRIDE, 0);
        g.updateMatrixWorld(true); other.hips.getWorldPosition(_v);
        g.position.x += bx - _v.x; g.position.z += bz - _v.z;
        L.stand = -1;
        L.path = [{ x: g.position.x, z: g.position.z }, ...LEAVE.slice(1)];
        return;
      }
      const P = L.path;
      if (L.seg >= P.length - 1) { g.visible = false; otherLeaving = null; after(1.2, () => { roomDoorWant = 0; }); return; }
      const a = P[L.seg], b = P[L.seg + 1];
      const len = Math.hypot(b.x - a.x, b.z - a.z);
      L.s += 1.05 * dt;
      if (L.s >= len) {
        L.s -= len; L.seg++;
        if (L.seg === 2 && !L.door) { L.door = true; roomDoorWant = 1; sfxAt('roomdoor', RDOOR.x, RDOOR.z, 0.7, 1, 10); }
        return;
      }
      const k = L.s / len;
      g.position.x = a.x + (b.x - a.x) * k; g.position.z = a.z + (b.z - a.z) * k;
      /* off the dais (the first leg), then the room's planks */
      g.position.y = L.seg === 0 ? SALA.floor + DAIS.h * (1 - k) : SALA.floor;
      const want = Math.atan2(b.x - a.x, b.z - a.z);
      let d = want - g.rotation.y; while (d > Math.PI) d -= Math.PI * 2; while (d < -Math.PI) d += Math.PI * 2;
      g.rotation.y += d * (1 - Math.exp(-dt * 6));
      if (other.acts && other.acts[C_WALK]) other.acts[C_WALK].setEffectiveTimeScale(1.05 / C_STRIDE);
      // through the door and gone
      if (L.seg === P.length - 2) g.visible = k < 0.6;
    }
    /* 6 · THE STOOL — back to the Ajarn, facing out at the courtyard */
    function sitStool() {
      seated = 'stool'; syncProps();
      yaw.position.x = CUSH.x; yaw.position.z = CUSH.z;
      if (kit) kit.root(true);
      /* v16.5 (Chad: "Same for the sakyant part, hands should be praying"):
         together from the moment he sits until a scene takes the hands */
      if (kit && kit.pray) kit.pray(true, { secs: 1.4, y: PRAY_Y });
      turnTo(Math.PI, 1.1, { y: STOOL_TOP + 0.80, span: 0.9, lo: -0.6, hi: 0.55 });
      if (worldSfx) worldSfx('barestep', 0.5, 0.9);
      setPhase('yant');
      queueGap(0.6);
      queueLine('aj1sit', () => { ajarn.nod = SECS.aj1sit; });
      /* v17.6 (Chad: "before the ajahn starts, the ajahn asks the player which
         sakyant design the player would like to choose. Then a window frame
         pops up ... After the player confirms which sakyant, then it goes to
         the flow that you already have"): the question, the window, his
         answer — and only then the breath, the gong and the rod, as before */
      queueGap(0.5);
      queueLine('aj1which', () => { ajarn.nod = SECS.aj1which; });
      queueGap(0.25);
      queueFn(() => chooseYant());
    }
    const YANTS = ['yantgaoyord', 'yanthahtaew', 'yantsroi'];   // Chad's three (v17.6b)
    let yantPick = null;
    function chooseYant() {
      if (!kit || !kit.choose || phase !== 'yant') { yantBegin(); return; }
      /* v17.6b: the seal sounds — the room's own temple bell under a golden
         shimmer (yantseal: three takes of a bell prompt came back as pure
         shimmer, so the bell's body is e3bell's) */
      kit.choose(YANTS, { label: DATA.words.yantLabel, title: DATA.words.yantTitle, confirm: DATA.words.yantConfirm, hint: DATA.words.yantHint,
                          sound: [['e3bell', 0.75], ['yantseal', 0.8]] })
        .then(id => {
          if (!alive || phase !== 'yant' || !id) return;     // torn down under the window: the run starts again
          yantPick = id;
          queueGap(0.35);
          queueLine('aj1chosen', () => { ajarn.nod = SECS.aj1chosen; });
          yantBegin();
        });
    }
    function yantBegin() {
      queueGap(0.5);
      queueLine('aj1breathe', () => { ajarn.nod = SECS.aj1breathe; });
      queueGap(0.4);
      // one stroke of the small gong beside him: the work begins
      queueFn(() => { sfxAt('e3gong', AJ.x + 0.9, AJ.z, 0.55, 1, 12); });
      queueGap(1.1);
      queueFn(() => startYant());
    }
    /* 7 · THE YANT — the heartbeat kind, re-skinned: the tick is the rod's
       own tap (the one engine seam), fourteen strikes quickening from 66 bpm
       as a rod does, and a flinch costs sanity on the frame it happens. */
    function startYant() {
      if (!kit || phase !== 'yant') return;
      workOn = 'player';
      /* v17.6b (Chad: "the ajahn voiceline of namo tassa should start after the
         player clicks start on the heartbeat minigame"): the katha waits for
         START — the event's own onBegin — not for the briefing to open */
      const katha = () => after(0.6, () => { if (!heard.has('katha3')) { heard.add('katha3'); sayLine('aj1katha', 0.7, () => { ajarn.nod = SECS.aj1katha; chantCaps('namo'); }, panOf('aj1katha')); } });
      kit.event({ kind: 'heartbeat', label: DATA.words.evYant, brief: DATA.words.evYantBrief, demo: 'beat', onBegin: katha,
                  n: 14, bpm: 66, win: 0.26, zone: 5.8, lead: 2.0, accel: 0.975, minPeriod: 0.5,
                  tick: 'yantap', tickVol: 0.95, missCost: 3,
                  penalty: { stat: 'sanity' },
                  award: { stat: 'sanity', per: 1, lo: 0, hi: 8 } })
        .then(r => {
          if (!alive) return;
          workOn = false;
          if (r && r.aborted) return;
          stir();
        });
    }
    /* 8 · THE STIRRING. The last strike; he blows on it; and on the frame
       after, it warms — a gold wash from the top of the screen, a shimmer,
       the morning a shade brighter, a tingle in the hands. Nothing more. */
    /* v16.1: in the ROOM now — the room's own look, warmed, and handed back
       to the room's look (not the courtyard's dawn) as it fades */
    const WARM = { ...ROOMLIGHT, hemi: [0xfff0d6, 0x8a765e, 1.35], key: [0xffd8a0, 1.2, 16, 9, 18], fill: [0xe8d8c0, 0.55],
                   vmHemi: [0xfff2dc, 0x94836e, 1.05], vmKey: [0xffd8a8, 0.8] };
    /* v17.6: the yant he chose goes ON HIM — straight into the Sak Yant box,
       never the bag (ink is not carried), and it cannot come off (`fixed`) */
    function yantOn() {
      if (!kit || !yantPick) return;
      for (const y of YANTS) if (y !== yantPick && kit.has(y)) kit.take(y);
      kit.equip(yantPick);
      if (kit.urge) kit.urge(null);
    }
    function stir() {
      yantOn();
      setPhase('turn');
      after(0.5, () => sfxAt('yantblow', CUSH.x, CUSH.z - 0.2, 1.0, 1, 10));
      after(1.6, () => {
        if (worldSfx) worldSfx('yantwarm', 0.9);
        if (kit) {
          kit.flash({ color: '#ffcf7a', secs: 2.4 });
          if (kit.haptic) kit.haptic([40, 60, 30, 90, 20]);
          kit.daylight(WARM, 1.2);
        }
        warmK = 1;
      });
      after(3.2, () => queueLine('z1warm'));
      after(5.4, () => { if (kit) kit.daylight(ROOMLIGHT, 3.5); });
      /* v17.6: and when his line about the warmth has been said, the design
         is shown — the ITEM UNLOCKED splash, its line drawing turning gold;
         the chapter's clock waits under it, so "Finish. Turn around." comes
         when it is closed */
      after(7.9, () => { if (kit && kit.unlock && yantPick) kit.unlock(yantPick, { sub: DATA.words.yantSub }); });
      after(8.0, () => {
        queueLine('aj1done', () => { ajarn.nod = SECS.aj1done; });
        queueGap(0.3);
        queueFn(() => turnRound());
      });
    }
    const faceAjarn = () => Math.atan2(-(AJ.x - yaw.position.x), -(AJ.z - yaw.position.z));
    let turning = null, warmK = 0;
    /* THE LENS TURNS FOR HIM when he sits, kneels or turns round: eased on
       wall time, the neck held narrow while it turns, and the pose's own
       clamp set on the new heading when it lands (CP3: a player who sat on the
       mat with his back to the dais watched a wall through the whole wait) */
    function turnTo(to, secs, o, done) {
      turning = { t: 0, from: yaw.rotation.y, to, secs, y: o.y, span: o.span, lo: o.lo, hi: o.hi, done };
    }
    function turnTick(wdt) {
      if (!turning) return;
      const T = turning;
      T.t += wdt / T.secs;
      const k = smooth(Math.min(1, T.t));
      let d = T.to - T.from; while (d > Math.PI) d -= Math.PI * 2; while (d < -Math.PI) d += Math.PI * 2;
      yaw.rotation.y = T.from + d * k;
      if (kit) kit.pose('lying', { y: T.y, yaw: yaw.rotation.y, span: 0.02, pitchLo: T.lo, pitchHi: T.hi, secs: 0.9 });
      if (T.t >= 1) {
        turning = null;
        if (kit) kit.pose('lying', { y: T.y, yaw: T.to, span: T.span, pitchLo: T.lo, pitchHi: T.hi, secs: 0.05 });
        if (T.done) T.done();
      }
    }
    function turnRound() {
      if (worldSfx) worldSfx('barestep', 0.45, 0.8);
      turnTo(faceAjarn(), 1.6, { y: STOOL_TOP + 0.80, span: 0.8, lo: -0.5, hi: 0.6 }, () => {
        pitch.rotation.x = 0.16;                       // and up, to his face
        ajarnFace(true);
        queueGap(0.5);
        queueLine('aj1ask', () => { ajarn.nod = SECS.aj1ask; });
        queueGap(0.7);
        queueFn(() => { setPhase('decide'); if (kit) kit.root(false); startDecision(); });
      });
    }

    /* the Ajarn at work: bursts of strikes and a pause to re-ink, the rod's
       tip on the man's upper back, heard from wherever the player is */
    let workOn = true, strikeAt = 0, burst = 0, strikeK = 0;
    const BACK_OFF = -0.13;        // v18.7: his upper spine to the skin of his back (photographed)
    function workTick(wdt) {
      ajarnTakeTick();
      const onOther = workOn === true && other.group.visible && !otherLeaving;
      rodG.visible = onOther && getState() !== 'cine';
      if (!onOther) return;
      strikeK = Math.max(0, strikeK - wdt * 7);
      if (dayClock.t >= strikeAt) {
        if (burst <= 0) { burst = 6 + Math.floor(hash(dayClock.t | 0, 3) * 6); strikeAt = dayClock.t + 1.6 + hash(dayClock.t | 0, 5) * 1.6; return; }
        burst--; strikeK = 1;
        sfxAt('yantap', CUSH.x, CUSH.z - 0.15, 0.55, 2.5, 16, 0.95 + hash(burst, dayClock.t | 0) * 0.1);
        strikeAt = dayClock.t + 0.42 + hash(burst, 11) * 0.14;
      }
      // the rod: from his right hand to the man's shoulder blade, tapping
      const tip = new THREE.Vector3(CUSH.x + 0.07, STOOL_TOP + 0.58, CUSH.z - 0.17);
      /* v18.7: Chad's customer flinches (Sit_Dodge), so the tip rides HIS back —
         behind his upper spine (he faces +z: behind is −z) — not a fixed point */
      if (other.spine) { other.spine.getWorldPosition(tip); tip.x += 0.05; tip.y += 0.04; tip.z += BACK_OFF; }
      if (ajarn.hand) {
        /* v16.8 (Chad: "put the rod on his right hand while he is doing it"):
           the butt IN his hand, the tip on the man's back 6 cm off the skin
           and driven in on each strike; the rod keeps to between 0.45 and
           1.1 of its length as his hand moves with the take */
        /* v17.1 (Chad: "Fix the rod to his fingers not his wrist"): the hand
           bone IS the wrist; the rod is gripped in the fingers, 60 % of the
           way from the wrist to the middle fingertip, its butt standing 6 cm
           out of the back of the grip as a held rod's does */
        handGrip(ajarn, 0.6, _hp);
        const aim = tip.clone().addScaledVector(tip.clone().sub(_hp).normalize(), -0.06 + strikeK * 0.06);
        const dir = aim.clone().sub(_hp).normalize();
        _hp.addScaledVector(dir, -0.06);
        const L = Math.min(1.1, Math.max(0.45, _hp.distanceTo(aim) / 0.74));
        rodG.position.copy(_hp); rodG.scale.set(1, 1, L); rodG.lookAt(aim);
      } else {
        const butt = new THREE.Vector3(AJ.x + 0.2, SALA.floor + (ajarn.seatTop ?? 1.2) + 0.28, AJ.z + 0.45);
        const dir = tip.clone().sub(butt).normalize();
        // held at the middle, the tip 6 cm off the skin, driven in on each strike
        rodG.position.copy(tip).addScaledVector(dir, -0.72 + strikeK * 0.06 - 0.06);
        rodG.lookAt(tip);
      }
    }

    /* ------------------------------------------------------------- hotspots
       Anchors at EYE height (the v7.5 law), on the thing itself. */
    const hotspots = [
      { id: 'stall', pos: { x: STALL.x + 0.55, y: 1.35, z: STALL.z }, radius: 2.6, prompt: DATA.words.hotStall,
        enabled: () => phase === 'stall', onInteract() { return buyOffering(); } },
      { id: 'shoes', pos: { x: RACK.x, y: 1.1, z: RACK.z + 0.1 }, radius: 2.2, prompt: DATA.words.hotShoes,
        enabled: () => phase === 'shoes', onInteract() { return shoesOff(); } },
      { id: 'wai', pos: { x: WAI.x, y: 1.35 + LIFT, z: WAI.z - 0.9 }, radius: 2.2, prompt: DATA.words.hotWai,
        enabled: () => phase === 'wai' && !kneel, onInteract() { return beginWai(); } },
      { id: 'present', pos: { x: mdW(-0.7, 0.95).x, y: 1.2 + LIFT, z: mdW(-0.7, 0.95).z }, radius: 2.4, prompt: DATA.words.hotPresent,
        enabled: () => phase === 'present', onInteract() { return present(); } },
      { id: 'bless', pos: { x: BLESS.x, y: 1.25 + LIFT, z: BLESS.z - 0.5 }, radius: 2.3, prompt: DATA.words.hotBless,
        enabled: () => phase === 'bless' && !blessing, onInteract() { return beginBless(); } },
      { id: 'door', pos: { x: KDOOR.x + 0.08, y: 1.5 + LIFT, z: KDOOR.z }, radius: 2.2, prompt: DATA.words.hotDoor,
        enabled: () => phase === 'go' && !entering, onInteract() { return openDoor(); } }
    ];

    /* ------------------------------------------------------------- the pile
       THE AJARN IS THE PILE: after the yant he asks, and the decision opens by
       itself; a player who closes it answers him again from the stool. */
    const PILE_POS = new THREE.Vector3(AJ.x, 0, AJ.z);
    const INTERACT_R = 3.2;
    const pile = new THREE.Group(); pile.position.copy(PILE_POS); world.add(pile);
    const _ndc = new THREE.Vector3();
    const syncCamera = () => { camera.updateWorldMatrix(true, false); camera.matrixWorldInverse.copy(camera.matrixWorld).invert(); };
    function pileDist() { return Math.hypot(yaw.position.x - PILE_POS.x, yaw.position.z - PILE_POS.z); }
    function pileScreen() { syncCamera(); return _ndc.set(PILE_POS.x, DAIS_TOP + 1.0, PILE_POS.z).project(camera); }
    function pileLive() { return phase === 'decide'; }
    function pileInView() {
      if (!pileLive()) return false;
      const n = pileScreen();
      return n.z < 1 && Math.abs(n.x) < 0.97 && Math.abs(n.y) < 0.97;
    }
    function pointerHitsPile(cx, cy) {
      if (!pileLive() || pileDist() > INTERACT_R) return false;
      const n = pileScreen();
      if (n.z > 1) return false;
      const sx = (n.x * 0.5 + 0.5) * innerWidth, sy = (-n.y * 0.5 + 0.5) * innerHeight;
      return Math.hypot(cx - sx, cy - sy) < Math.min(innerWidth, innerHeight) * 0.18;
    }
    function interactPile() {
      if (getState() !== 'play' || pileDist() >= INTERACT_R || phase !== 'decide') return false;
      startDecision(); return true;
    }

    /* ---------------------------------------------------------- per frame */
    function inSala(x, z) { return x > SALA.x0 && x < SALA.x1 && z < SALA.z1 - 0.1 && z > SALA.z0; }
    function inWalk(x, z) { return x <= SALA.x0 && x > WALK.x1 - 0.2 && Math.abs(z - WALK.z) < WALK.hw + 0.2; }
    function inRoom(x, z) { return Math.abs(x - ROOM.x) < ROOM.hw + 0.5 && z > ROOM.z0 - 0.5 && z < ROOM.z1 + 0.5; }
    function watchTick() {
      const x = yaw.position.x, z = yaw.position.z;
      // the auntie greets him the first time he comes near
      if (phase === 'stall' && !heard.has('hi') && Math.hypot(x - STALL.x, z - STALL.z) < 6.0) {
        heard.add('hi'); talk(auntie, SECS.au1hi); queueLine('au1hi');
      }
      // and calls after him if he walks into the sala in his shoes
      if (pIdx(phase) <= 1 && inSala(x, z) && !heard.has('shoes')) {
        heard.add('shoes'); talk(auntie, SECS.au1shoes); lineQ.unshift({ name: 'au1shoes', vol: 1.0 });
        if (kit) kit.conduct({ note: 'Walked into the sala in your shoes.', s: 0, a: -2 });
      }
      /* v16.1: v16.0's murmured katha on stepping into the sala was the
         Ajarn's, and the Ajarn is not in the sala any more; the room has it
         (waitSeq), and the sala has the monk's chant at the blessing */
      // the zones: step into the glow and he sits
      if (phase === 'wait' && !seated && Math.hypot(x - WAIT.x, z - WAIT.z) < 0.62) sitMat();
      if (phase === 'seat' && !seated && stoolClear() && Math.hypot(x - zoneSeat.position.x, z - zoneSeat.position.z) < 0.62) sitStool();
    }
    /* THE BEDS, by where he is and what is happening: the dawn everywhere,
       the chant louder toward the ubosot and softer under the sala's roof,
       the music only under the waiting and the rod */
    let lastMix = 0;
    const mixK = { chant: 0.12, music: 0 };
    function mixBeds(wdt) {
      /* v17.6: the choice window and the unlock splash sit OVER the room — the
         room keeps its sound under them (they used to read as "not play" and
         let the music and the room tone fall away while he chose) */
      const st0 = getState(), st = st0 === 'choose' || st0 === 'unlock' ? 'play' : st0;
      const x = yaw.position.x, z = yaw.position.z;
      const under = inSala(x, z) ? 1 : 0;
      const room = inRoom(x, z), roofed = under || inWalk(x, z);
      const chantWant = st === 'play' || st === 'decide' ? (0.10 + 0.20 * THREE.MathUtils.clamp((x + 8) / 16, 0, 1)) * (room ? 0.3 : roofed ? 0.7 : 1) : 0.10;
      let musicWant = 0;
      /* e3wait is levelled to -19 dBFS RMS (masters/v16.0), so 0.45 puts it
         near -26 in the room: over the dawn bed (-25 body x 0.26-0.34) and
         the chant, under every voice — the episode-2 lesson that a bed the
         player cannot hear is not a bed (v9.7, v10.4, v10.7) */
      if (st === 'play') musicWant = phase === 'yant' ? 0.52 : (phase === 'wait' || phase === 'seat') ? 0.45
                                   : phase === 'turn' ? 0.36 : phase === 'bless' ? 0.26 : 0;
      else if (st === 'decide') musicWant = 0.30;
      mixK.chant += (chantWant - mixK.chant) * (1 - Math.exp(-wdt / 1.2));
      mixK.music += (musicWant - mixK.music) * (1 - Math.exp(-wdt / 1.6));
      /* in the room the dawn outside is through a shuttered window, and the
         room has its own tone: the fans, the birds beyond the wall */
      DATA.ambience.beds[0][1] = room ? 0.08 : roofed ? 0.26 : 0.34;
      DATA.ambience.beds[1][1] = mixK.chant;
      DATA.ambience.beds[2][1] = mixK.music;
      DATA.ambience.beds[3][1] = room && (st === 'play' || st === 'decide') ? 0.55 : 0;
    }
    /* v16.4: the bodhi cloth's tail sways, the bells swing */
    const bellQ = new THREE.Quaternion(), bellE = new THREE.Euler(), bellM = new THREE.Matrix4(), bellS = new THREE.Vector3(1, 1, 1);
    function dressTick(t) {
      for (const g of tungs) {
        if (g.tail) { g.m.rotation.x = 0.15 + Math.sin(t * 1.1 + g.ph) * 0.06; continue; }
        g.m.rotation.x = Math.sin(t * 1.3 + g.ph) * 0.09; g.m.rotation.z = Math.sin(t * 0.9 + g.ph * 2) * 0.04;
      }
      for (let i = 0; i < bellHang.length; i++) {
        const ph = i * 0.73;
        bellE.set(Math.sin(t * 2.1 + ph) * 0.2 + Math.sin(t * 3.7 + ph * 2) * 0.06, 0, Math.sin(t * 1.7 + ph * 1.3) * 0.12);
        bellQ.setFromEuler(bellE); bellM.compose(bellHang[i], bellQ, bellS);
        bellIM.setMatrixAt(i, bellM);
        bellE.x *= 1.8; bellE.z *= 1.8; bellQ.setFromEuler(bellE); bellM.compose(bellHang[i], bellQ, bellS);
        leafIM.setMatrixAt(i, bellM);
      }
      bellIM.instanceMatrix.needsUpdate = true; leafIM.instanceMatrix.needsUpdate = true;
    }
    function lifeTick(t, wdt) {
      for (const f of fans) f.rotation.y += wdt * 2.2;
      if (roomFans[0]) roomFans[0].rotation.y += wdt * 2.4;
      if (roomFans[1]) roomFans[1].rotation.z += wdt * 14;
      if (standHead) standHead.rotation.y = Math.sin(t * 0.35) * 0.8;
      if (roomSmoke) {
        const a = roomSmoke.geometry.attributes.position, seed = roomSmoke.userData.seed, N = seed.length, at = roomSmoke.userData.at;
        for (let i = 0; i < N; i++) {
          const k = ((t * 0.1 + seed[i]) % 1);
          a.array[i * 3] = at.x + Math.sin(k * 8 + i) * 0.04 * (1 + k * 3);
          a.array[i * 3 + 1] = at.y + k * 0.9;
          a.array[i * 3 + 2] = at.z + Math.cos(k * 6 + i) * 0.03 * (1 + k * 2);
        }
        a.needsUpdate = true;
      }
      for (let i = 0; i < candles.length; i++) {
        const c = candles[i];
        c.scale.y = 1.8 + Math.sin(t * 11 + i * 1.7) * 0.25 + Math.sin(t * 23 + i) * 0.12;
      }
      if (smokeP) {
        const a = smokeP.geometry.attributes.position, seed = smokeP.userData.seed, N = seed.length;
        for (let i = 0; i < N; i++) {
          const k = ((t * 0.12 + seed[i]) % 1);
          a.array[i * 3] = ALT.x + Math.sin(k * 9 + i) * 0.05 * (1 + k * 3);
          a.array[i * 3 + 1] = SALA.floor + 1.1 + k * 1.3;
          a.array[i * 3 + 2] = ALT.z + 0.72 + Math.cos(k * 7 + i) * 0.04 * (1 + k * 2);
        }
        a.needsUpdate = true;
      }
      dressTick(t); pigeonTick(wdt, t); bellSoundTick(wdt);
      zoneTick(zone, t); zoneTick(zoneSeat, t); zoneTick(zoneBless, t);
      warmK = Math.max(0, warmK - wdt * 0.25);
    }
    function updateNotes(dt, t) {
      const nowW = performance.now() / 1000;
      const wdt = lastMix ? Math.min(0.5, nowW - lastMix) : 0;
      lastMix = nowW;
      // the mixers run in every state (v5.19): a cutscene owns the poses, never the clocks
      for (const r of [ajarn, other, auntie, assistant, monk]) {
        if (!r.mixer || !r.group.visible) continue;
        headPre(r); if (r === monk) monkArmPre();
        r.mixer.update(dt); rootComp(r); r.model && r.model.updateMatrixWorld(true);
        headPost(r, wdt); if (r === monk) monkArmPost(wdt);
      }
      lifeTick(t, wdt);
      mixBeds(wdt);
      leaveTick(dt);
      dropTick(wdt); doorTick(wdt); helperTick(wdt);
      handTray.visible = getState() === 'play' && pIdx(phase) >= 1 && pIdx(phase) <= 3;
      /* v18.8: a fixed 0.17 m to the left put the set half off a portrait
         phone's frame (it sees a third of the width); 0.42 of the visible
         half-width at its depth, never more than 0.17 */
      if (handTray.visible) handTray.position.x = -Math.min(0.17, 0.72 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.aspect * 0.42);
      if (getState() !== 'play') { lastWall = 0; rodG.visible = false; return; }
      const now = performance.now() / 1000;
      if (lastWall) dayClock.t += Math.min(0.5, now - lastWall);
      lastWall = now;
      if (!booted) { booted = true; applyPhase(kit ? kit.getPhase() : null); }
      runTodo(); runSpeak(); runQueue();
      watchTick(); kneelTick(); blessTick(); turnTick(wdt); workTick(wdt);
    }
    function updatePile() {}
    function updateFire() {}
    function updateSlow() {}

    /* ------------------------------------------------------------ a resume
       Every phase is its own receipt; the world is made to match it. A resume
       mid-sequence lands at the start of that sequence, standing: the wait is
       sat again, the stool is sat again (the rod has not started), and the
       question after the yant is asked again from the stool. */
    function applyPhase(p) {
      if (!PHASES.includes(p)) p = 'stall';
      seated = null; kneel = null; turning = null; otherLeaving = null; blessing = null; entering = null;
      if (p === 'yant') p = 'seat';
      if (pIdx(p) >= pIdx('seat')) putOther(false); else putOther(true);
      workOn = pIdx(p) < pIdx('seat');
      /* v16.1: a phase in the ROOM lands in the room, in its light — where the
         save stood him if that was inside it, else just inside the door; the
         curtain has warmed it. A phase before it lands in the wat's dawn. */
      if (roomPhase(p)) {
        const x = yaw.position.x, z = yaw.position.z;
        if (inRoom(x, z)) { const r = yaw.rotation.y; placeInRoom({ x, z }); yaw.rotation.y = r; }
        else placeInRoom();
      } else if (kit) kit.daylight(null, 0);
      if (p === 'turn' || p === 'decide') {
        yaw.position.x = CUSH.x; yaw.position.z = CUSH.z;
        seated = 'stool';
        if (kit) { kit.pose('lying', { y: STOOL_TOP + 0.80, yaw: faceAjarn(), span: 0.8, pitchLo: -0.5, pitchHi: 0.6, secs: 0.05 }); kit.root(false); }
        if (kit && kit.pray) kit.pray(true, { secs: 0, y: PRAY_Y });   // v16.5: still on the stool, hands still together
        yaw.rotation.y = faceAjarn();
        ajarnFace(true);
        setPhase('decide');
        return;
      }
      if (kit) { kit.pose('standing', { secs: 0.05 }); kit.root(false); if (kit.pray) kit.pray(false, { secs: 0 }); }
      setPhase(p);
      if (p === 'go') goCall();                     // told again where the Ajarn is
    }

    /* ---------------------------------------------------------- lifecycle */
    function putAjarn() {
      ajarn.group.visible = true; ajarn.nod = 0; ajarn.lookYaw = 0; ajarn.lookPitch = 0;
      ajBlessUntil = 0; ajWas = !!workOn;
      if (ajarn.acts) ajarn.play(workOn ? AJ_WORK : AJ_REST, 1, 0);
    }
    /* v16.8: the take follows the work — the answering take while the rod is
       going, the thumbs-up ONCE on the frame the work stops (the slap on the
       back), then the idle. Read in workTick every frame, so a resume, a
       replay or a skipped scene cannot leave him in the wrong one. */
    let ajBlessUntil = 0, ajWas = true;
    function ajarnTakeTick() {
      if (!ajarn.acts) return;
      const working = !!workOn;
      if (working && !ajWas) { ajBlessUntil = 0; ajarn.play(AJ_WORK, 1, 0.5); }
      if (!working && ajWas) {
        ajarn.play(AJ_BLESS, 1, 0.4, true);
        ajBlessUntil = dayClock.t + ajarn.acts[AJ_BLESS].getClip().duration;
      }
      if (!working && ajBlessUntil && dayClock.t >= ajBlessUntil) { ajBlessUntil = 0; ajarn.play(AJ_REST, 1, 0.6); }
      ajWas = working;
    }
    /* WHEN HE SPEAKS TO YOU he sits up: the same rig's other sitting take,
       parked on its upright opening frame (v8.0 measured it: the head is over
       the hips for the first eighth of the clip, then it folds), and his head
       lifted to the man in front of him. The doze is for when he works. */
    function ajarnFace(on) {
      if (!ajarn.acts) return;
      /* he looks up at you; the idle is his rest take, and a blessing still
         in its gesture is let finish (ajarnTakeTick hands over to the idle) */
      if (on) { if (!ajBlessUntil && !workOn) ajarn.play(AJ_REST, 1, 0.6); ajarn.lookPitch = -0.12; }
      else putAjarn();
    }
    function snap() { return { phase }; }
    function restore() {
      putAjarn();
      ajarn.nod = 0;
      if (kit) kit.root(false);
      handTray.visible = false;
      /* an ending leaves the room for the courtyard's dawn; the card is over
         the room again, where he sat */
      roomDoorWant = 0; roomDoorK = 0; if (roomLeaf) roomLeaf.rotation.y = 0;
      if (kit && roomPhase(phase)) kit.daylight(ROOMLIGHT, 0);
    }
    function reset() {
      dropTodo(); speakReset(); lineQ.length = 0; heard.clear();
      /* v17.6: a replay sits on the stool again and chooses again, so the
         yant from the run before comes off with the run (the v8.1 law, in the
         bag's form — the torch precedent) */
      yantPick = null;
      if (kit) for (const y of YANTS) if (kit.has(y)) kit.take(y);
      booted = false; dayClock.t = 0; lastWall = 0;
      pigeonReset(); bellNext = 2;                     // v16.4: the flock back on the paving
      seated = null; kneel = null; turning = null; otherLeaving = null; workOn = true; strikeAt = 0; burst = 0; warmK = 0;
      blessing = null; entering = null; helperLook = false; monkArmK = 0; monkArmFlick = 0;
      kutiK = 0; roomDoorK = 0; roomDoorWant = 0;
      if (kutiLeaf) kutiLeaf.rotation.y = 0; if (roomLeaf) roomLeaf.rotation.y = 0;
      assistant.group.rotation.y = HELP_RY; monkFace(false);
      monkBack = null; if (monk.acts) monk.play(MONK_REST, 0, 0, false, 0);   // v16.8: a replay finds him at rest (the v8.1 law)
      for (const d of drops) d.life = 0;
      for (const t of stallTrays) t.visible = true;
      putAjarn(); putOther(true);
      if (kit) {
        kit.root(false); kit.pose('standing', { secs: 0.05 });
        if (kit.pray) kit.pray(false, { secs: 0 });      // v16.5
        kit.daylight(null, 0); kit.presence(0);
        kit.setPhase('stall');
      }
      phase = 'stall';
      syncProps();
    }
    /* v16.4 · THE GROUND under a point (the engine's groundAt seam): the sala's
       base and the walkway at the floor's height, the staircase a ramp from
       the base's edge down to its foot, the private room at the floor's
       height, and the courtyard at zero */
    /* v16.9: the temple's base (its landing, the hall and the ledges the
       collision keeps him off), the staircase in front of it, the front
       door's threshold (0.26 m, then 0.18 — measured off the model), the
       walkway out of its west door */
    function groundAt(x, z) {
      if (x < -200) return SALA.floor;
      if (Math.abs(x) <= STAIR.hw && z > STAIR.top && z < STAIR.foot) return SALA.floor * (STAIR.foot - z) / (STAIR.foot - STAIR.top);
      if (x > FDOOR.x0 - 0.1 && x < FDOOR.x1 + 0.1 && z > FDOOR.z0 && z < FDOOR.z1) return SALA.floor + (z > -2.45 ? 0.26 : 0.18);
      if (x >= TBASE.x0 && x <= TBASE.x1 && z >= TBASE.z0 && z <= STAIR.top) return SALA.floor;
      if (x < TBASE.x0 && x >= WALK.x1 - 0.1 && Math.abs(z - WALK.z) <= WALK.hw + 0.15) return SALA.floor;
      return 0;
    }
    function blockers() {
      const out = [];
      const b = (o, pad = 0.20) => { o.updateWorldMatrix(true, false); const bb = new THREE.Box3().setFromObject(o); bb.expandByScalar(pad); out.push(bb); };
      /* v16.4: a column from the ground its centre stands on — collision samples
         1.0 m above the GROUND now, so a column on the raised floor must reach
         past 1.1 + 1.0 (the engine's groundAt seam) */
      const solid = (o, pad = 0.14) => { o.updateWorldMatrix(true, false); const bb = new THREE.Box3().setFromObject(o); bb.expandByScalar(pad); bb.min.y = 0;
        bb.max.y = Math.max(bb.max.y, groundAt((bb.min.x + bb.max.x) / 2, (bb.min.z + bb.max.z) / 2) + 1.40); out.push(bb); };
      for (const w of walls) b(w);
      for (const s of solids) solid(s);
      // v16.9: the temple, from its own mesh — and its back door, behind the altar
      for (const [x0, z0, x1, z1] of TEMPLE_BLOCK) out.push(new THREE.Box3(new THREE.Vector3(x0, 0, z0), new THREE.Vector3(x1, SALA.floor + 1.8, z1)));
      out.push(new THREE.Box3(new THREE.Vector3(-1.2, 0, SALA.z0 - 1.4), new THREE.Vector3(1.5, SALA.floor + 1.8, SALA.z0 + 0.05)));
      // both daises, the man by the walkway, the waiting man
      for (const D of [DAIS, MD]) {
        const turned = Math.abs(Math.sin(D.ry || 0)) > 0.5, hx = (turned ? D.d : D.w) / 2, hz = (turned ? D.w : D.d) / 2;   // v16.9: the monk's is turned
        out.push(new THREE.Box3(new THREE.Vector3(D.x - hx - 0.14, 0, D.z - hz - 0.14), new THREE.Vector3(D.x + hx + 0.14, SALA.floor + 1.4, D.z + hz + 0.14)));
      }
      // v18.7: the dais's front step, under the customer's feet
      out.push(new THREE.Box3(new THREE.Vector3(STEP.x - STEP.w / 2 - 0.14, 0, STEP.z - STEP.d / 2), new THREE.Vector3(STEP.x + STEP.w / 2 + 0.14, SALA.floor + 1.4, STEP.z + STEP.d / 2 + 0.14)));
      out.push(new THREE.Box3(new THREE.Vector3(HELP.x - 0.35, 0, HELP.z - 0.35), new THREE.Vector3(HELP.x + 0.35, SALA.floor + 1.8, HELP.z + 0.35)));
      out.push(new THREE.Box3(new THREE.Vector3(BENCH.x - 0.4, 0, BENCH.z1), new THREE.Vector3(BENCH.x + 0.75, SALA.floor + 1.4, BENCH.z0)));
      return out;
    }
    function dispose() {
      alive = false;
      if (treeStand) treeStand.userData.disposeTrees?.();   // BEFORE the sweep: the kit's maps are shared (v6.15)
      if (ordTrees) ordTrees.userData.disposeTrees?.();
      camera.remove(handTray);
      const geos = new Set(), mats = new Set();
      const sweep = (root) => root.traverse(o => {
        if (o.geometry) geos.add(o.geometry);
        if (o.material) for (const m of (Array.isArray(o.material) ? o.material : [o.material])) mats.add(m);
      });
      sweep(world); sweep(handTray);
      scene.remove(world);
      for (const r of [ajarn, other, auntie, assistant, monk]) r.mixer?.stopAllAction();
      for (const o of owned) { if (o.parent) o.parent.remove(o); o.dispose?.(); }
      owned.length = 0;
      for (const g of geos) g.dispose();
      for (const m of mats) {
        for (const k of ['map', 'roughnessMap', 'normalMap', 'emissiveMap', 'alphaMap']) m[k]?.dispose?.();
        m.dispose();
      }
      for (const t of madeTex) t?.dispose?.();
      world.clear();
      if (film) { scene.remove(film.root); }
      S = null;
    }

    /* ============================================================ THE FILM SETS
       Five pockets, far outside the wat (the camera's far plane is 160 m, so
       at these distances neither can ever see the other — v8.9's law: distance
       does the hiding). Every material is UNLIT and fog-free (the v4.9 recipe:
       the fog and the dawn lights are the wat's, and a memory has its own
       light painted into it). Nothing here casts a shadow. */
    let ordTrees = null;
    /* v19.0 · a passenger seated on an aircraft seat by his POSED SKIN: the
       hips over the seat's middle, the lowest skin under the hips (the thighs'
       and the seat's underside) set ON the cushion — never into it — and the
       back brought to the backrest, whose face leans back as it rises
       (raycast through the file: sz - 0.233 at y 0.87, sz - 0.327 at 1.34). */
    const paxRigs = [];
    function fitSeat(r, seat) {
      if (!r.model || !r.hips) return;
      const P = [];
      const sample = () => {
        P.length = 0; r.model.updateMatrixWorld(true);
        r.model.traverse(o => {
          if (!o.isSkinnedMesh) return;
          const n = o.geometry.attributes.position.count, step = Math.max(1, Math.floor(n / 6000));
          for (let i = 0; i < n; i += step) { o.getVertexPosition(i, _sv); _sv.applyMatrix4(o.matrixWorld); P.push(_sv.x, _sv.y, _sv.z); }
        });
      };
      sample(); r.hips.getWorldPosition(_v);
      r.group.position.x += seat.x - _v.x; r.group.position.z += seat.z - _v.z;
      sample(); r.hips.getWorldPosition(_v);
      const hx = _v.x, hy = _v.y, hz = _v.z;
      let under = Infinity;
      for (let i = 0; i < P.length; i += 3) if (Math.abs(P[i] - hx) < 0.2 && Math.abs(P[i + 2] - hz) < 0.15) under = Math.min(under, P[i + 1]);
      if (isFinite(under)) r.group.position.y += seat.top + 0.006 - under;
      const dy = isFinite(under) ? seat.top + 0.006 - under : 0;
      let push = -Infinity;
      for (let i = 0; i < P.length; i += 3) {
        const y = P[i + 1] + dy;
        if (y < seat.top + 0.2 || y > seat.top + 0.62 || Math.abs(P[i] - hx) > 0.22) continue;
        const face = seat.z - 0.233 - (y - (seat.top + 0.195)) * 0.2;   // the backrest's face at this height (world)
        push = Math.max(push, face + 0.012 - P[i + 2]);
      }
      if (isFinite(push)) r.group.position.z += push;
      void hy;
      r.model.updateMatrixWorld(true);
      /* the culling sphere from the POSED skin, in world space and then in
         each mesh's own frame (v18.5: a Meshy rig's mesh hangs under a 0.01
         armature, so wideBounds' 1.9 is 1.9 cm there — photographed, the woman
         in the aisle seat was simply not drawn). Each mesh's own sphere only:
         clones share their geometry, and the next passenger sits elsewhere. */
      const inv = new THREE.Matrix4();
      r.model.traverse(o => {
        if (!o.isSkinnedMesh) return;
        const bb = new THREE.Box3(), n = o.geometry.attributes.position.count, step = Math.max(1, Math.floor(n / 4000));
        for (let i = 0; i < n; i += step) { o.getVertexPosition(i, _sv); _sv.applyMatrix4(o.matrixWorld); bb.expandByPoint(_sv); }
        const sph = bb.getBoundingSphere(new THREE.Sphere());
        inv.copy(o.matrixWorld).invert();
        const c = sph.center.clone().applyMatrix4(inv), k = o.matrixWorld.getMaxScaleOnAxis() || 1;
        o.boundingSphere = new THREE.Sphere(c, sph.radius * 1.15 / k);
      });
      r.culled = true;
    }
    const film = buildFilm();
    function buildFilm() {
      const root = new THREE.Group(); world.add(root);
      const basic = (o) => new THREE.MeshBasicMaterial({ fog: false, ...o });
      const fbox = (w, h, d, x, y, z, m, p) => { const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); b.position.set(x, y, z); p.add(b); return b; };
      const fplane = (w, h, x, y, z, m, p, ry = 0, rx = 0) => { const b = new THREE.Mesh(new THREE.PlaneGeometry(w, h), m); b.position.set(x, y, z); b.rotation.set(rx, ry, 0); p.add(b); return b; };
      const shade = (hex, k) => new THREE.Color(hex).multiplyScalar(k);

      /* ---- 1 · THE CAMP GATE AT NOON (ORD) ---- */
      const ord = new THREE.Group(); ord.position.set(400, 0, 0); root.add(ord);
      {
        /* painted at about half the brightness it should read at: the
           renderer's ACES curve at exposure 1.42 lifts everything (v8.9) */
        const sky = new THREE.Mesh(new THREE.SphereGeometry(80, 32, 16),
          basic({ map: tex(makeSkyGrad(THREE, cnv, ['#3f78b4', '#86b2d4', '#b9c9c2'])), side: THREE.BackSide, depthWrite: false }));
        sky.position.y = 0; ord.add(sky);
        const lit = (o) => new THREE.MeshStandardMaterial({ fog: false, roughness: 0.9, ...o });
        const gnd = new THREE.Mesh(new THREE.CircleGeometry(78, 40), lit(grassTex ? { map: grassTex.map, color: 0xd6e0a8 } : { color: 0x7d9a5c }));
        if (grassTex) { grassTex.map.wrapS = grassTex.map.wrapT = THREE.RepeatWrapping; }
        gnd.rotation.x = -Math.PI / 2; gnd.position.y = 0.0; gnd.receiveShadow = true; ord.add(gnd);
        const road = fplane(7, 150, 0, 0.01, 0, lit({ map: tex(makeRoad(THREE, cnv)) }), ord, 0, -Math.PI / 2);
        road.material.map.repeat.set(1, 20);
        // the fence both sides of the gate, chain-link on posts, concertina on top
        const link = tex(makeLink(THREE, cnv));
        for (const s of [-1, 1]) {
          const lt = link.clone(); lt.needsUpdate = true; lt.repeat.set(12, 1); madeTex.push(lt);
          const f = fplane(40, 2.6, s * 24, 1.3, 0, basic({ map: lt, transparent: true, alphaTest: 0.4, side: THREE.DoubleSide, color: 0x9aa0a4 }), ord);
          void f;
          for (let x = 4; x <= 44; x += 3) fbox(0.08, 2.9, 0.08, s * x, 1.45, 0, basic({ color: 0x6a7074 }), ord);
        }
        // the guardhouse to the right of the road, its window, the boom across
        fbox(3.2, 2.8, 3.0, 5.4, 1.4, 1.6, lit({ color: 0xd8d1bf }), ord);
        fbox(3.6, 0.25, 3.4, 5.4, 2.93, 1.6, lit({ color: 0x5d6a4a }), ord);
        fbox(0.05, 0.9, 1.6, 3.78, 1.7, 1.6, lit({ color: 0x2c3a44, roughness: 0.3 }), ord);
        fbox(0.4, 1.1, 0.4, 3.6, 0.55, 0.0, lit({ color: 0xe8e4d8 }), ord);
        const boom = new THREE.Group(); boom.position.set(3.6, 1.05, 0); ord.add(boom);
        fbox(7.2, 0.14, 0.14, -3.6, 0, 0, lit({ color: 0xf1ede2 }), boom);
        for (let k = 0; k < 7; k++) fbox(0.5, 0.15, 0.15, -0.6 - k * 1.0, 0, 0, lit({ color: 0xc0271f }), boom);
        // the camp behind: two blocks either side, the flagpole, a sign
        fbox(24, 9, 8, -22, 4.5, 16, lit({ map: tex(makeCampFacade(THREE, cnv)) }), ord);
        fbox(18, 7, 8, 22, 3.5, 18, lit({ color: 0xd9d2bd }), ord);
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 9, 8), basic({ color: 0xe6e6e0 }));
        pole.position.set(-7, 4.5, 6); ord.add(pole);
        const flag = fplane(1.8, 1.2, -6.1, 8.3, 6.02, basic({ map: tex(makeSgFlag(THREE, cnv)), side: THREE.DoubleSide }), ord);
        void flag;
        const sg = fplane(3.4, 0.8, -5.2, 2.6, 0.2, basic({ map: tex(makeSignTex(THREE, cnv, 'CAMP EXIT · DRIVE SAFELY', '#1f3b2a', '#f1ecd8', 4.25)) }), ord, Math.PI);
        void sg;
        fbox(0.1, 2.4, 0.1, -6.6, 1.2, 0.25, basic({ color: 0x4d5257 }), ord);
        fbox(0.1, 2.4, 0.1, -3.8, 1.2, 0.25, basic({ color: 0x4d5257 }), ord);
        /* outside: Chad's trees along both sides of the road (the game's own
           kit, not blobs — v6.15's rule: no generated trees anywhere), a bus
           stop, and the road running off into them */
        if (plantTrees) {
          const spots = [];
          for (let i = 0; i < 16; i++) {
            const side = i % 2 ? 1 : -1;
            spots.push({ x: side * (6.5 + hash(i, 4) * 5), z: -8 - i * 3.6 - hash(i, 3) * 2, h: 7 + hash(i, 5) * 4 });
          }
          for (let i = 0; i < 8; i++) spots.push({ x: -30 + i * 8, z: 26 + hash(i, 6) * 6, h: 8 + hash(i, 7) * 3 });
          ordTrees = plantTrees(ord, spots, { tint: 0xe8e0c8, fog: false, shadow: false, lowKeep: 0.6 });
        }
        fbox(4, 0.15, 1.6, 8, 2.6, -8, lit({ color: 0x607f8c }), ord);
        fbox(0.1, 2.6, 0.1, 6.2, 1.3, -8.7, lit({ color: 0x777777 }), ord);
        fbox(0.1, 2.6, 0.1, 9.8, 1.3, -8.7, lit({ color: 0x777777 }), ord);
        root.userData.boom = boom;
      }

      /* ---- 2 · THE OFFICE AT NIGHT ---- */
      const off = new THREE.Group(); off.position.set(700, 0, 0); root.add(off);
      const codeCv = cnv(256), codeTex = new THREE.CanvasTexture(codeCv[0]);
      codeTex.colorSpace = THREE.SRGBColorSpace; madeTex.push(codeTex);
      /* v19.0: the drawn office is the STAND-IN now (v4.7: a failed download
         costs a nicer room, never the shot) — hidden the moment Chad's lands */
      const offOld = new THREE.Group(); off.add(offOld);
      {
        const room = new THREE.Mesh(new THREE.BoxGeometry(16, 3.2, 12), basic({ color: 0x14161c, side: THREE.BackSide }));
        room.position.set(0, 1.6, 0); offOld.add(room);
        const carpet = fplane(16, 12, 0, 0.005, 0, basic({ map: tex(makeCarpet(THREE, cnv)) }), offOld, 0, -Math.PI / 2);
        carpet.material.map.repeat.set(6, 4);
        // ceiling light panels, all off but one strip at the far end
        for (let x = -6; x <= 6; x += 3) for (let z = -4; z <= 4; z += 4) fplane(1.2, 0.6, x, 3.18, z, basic({ color: x === 6 ? 0x5a6470 : 0x23262c }), offOld, 0, Math.PI / 2);
        // the window wall: the city at night
        const city = fplane(16, 3.0, 0, 1.6, -5.95, basic({ map: tex(makeCity(THREE, cnv)) }), offOld);
        void city;
        for (let x = -7.5; x <= 7.5; x += 2.5) fbox(0.08, 3.2, 0.1, x, 1.6, -5.9, basic({ color: 0x0b0c10 }), offOld);
        fbox(16, 0.1, 0.12, 0, 0.9, -5.9, basic({ color: 0x0b0c10 }), offOld);
        // rows of desks, monitors dark, chairs pushed in
        const deskM = basic({ color: 0x3a3632 }), legM = basic({ color: 0x1e1f22 }), monM = basic({ color: 0x0a0b0d }), chairM = basic({ color: 0x1b1d22 });
        for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) {
          const x = -5.5 + c * 3.4, z = 2.8 - r * 2.8;
          if (r === 1 && c === 2) continue;        // his, built below
          fbox(1.6, 0.04, 0.8, x, 0.74, z, deskM, offOld);
          fbox(0.04, 0.72, 0.7, x - 0.76, 0.36, z, legM, offOld); fbox(0.04, 0.72, 0.7, x + 0.76, 0.36, z, legM, offOld);
          fbox(0.55, 0.34, 0.03, x, 1.0, z - 0.25, monM, offOld);
          fbox(0.5, 0.5, 0.5, x, 0.45, z + 0.62, chairM, offOld);
        }
        // HIS desk: three monitors of scrolling code, a lamp, a mug, the empty chair
        const hx = -5.5 + 2 * 3.4, hz = 0;
        const hisDesk = new THREE.Group(); hisDesk.position.set(hx, 0, hz); offOld.add(hisDesk);
        fbox(1.8, 0.04, 0.85, 0, 0.74, 0, basic({ color: 0x6a5f54 }), hisDesk);
        fbox(0.04, 0.72, 0.75, -0.86, 0.36, 0, legM, hisDesk); fbox(0.04, 0.72, 0.75, 0.86, 0.36, 0, legM, hisDesk);
        const scr = basic({ map: codeTex });
        for (const [dx, ry] of [[-0.58, 0.32], [0, 0], [0.58, -0.32]]) {
          const g = new THREE.Group(); g.position.set(dx, 1.02, -0.22); g.rotation.y = ry; hisDesk.add(g);
          fbox(0.56, 0.35, 0.03, 0, 0, -0.01, monM, g);
          fplane(0.52, 0.31, 0, 0, 0.007, scr, g);
          fbox(0.05, 0.25, 0.05, 0, -0.2, -0.03, legM, g);
        }
        // the glow the screens throw on the desk and the chair: soft additive quads
        const glow = basic({ color: 0x3f7fd0, transparent: true, opacity: 0.22, blending: THREE.AdditiveBlending, depthWrite: false });
        fplane(1.9, 1.2, 0, 0.765, 0.15, glow, hisDesk, 0, -Math.PI / 2);
        fplane(1.9, 1.6, 0, 1.0, 0.25, basic({ color: 0x2f5fa0, transparent: true, opacity: 0.12, blending: THREE.AdditiveBlending, depthWrite: false }), hisDesk);
        fbox(0.3, 0.02, 0.12, -0.1, 0.77, 0.12, basic({ color: 0x202226 }), hisDesk);     // the keyboard
        const mug = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.1, 12), basic({ color: 0xd8d4cc }));
        mug.position.set(0.6, 0.81, 0.2); hisDesk.add(mug);
        // the lamp: an arm and a warm cone of light on the desk's corner
        fbox(0.02, 0.5, 0.02, 0.8, 1.0, -0.3, legM, hisDesk);
        const lampPool = fplane(0.6, 0.5, 0.72, 0.765, 0.0, basic({ color: 0xffc88a, transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending, depthWrite: false }), hisDesk, 0, -Math.PI / 2);
        void lampPool;
        const shadeM = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.14, 12, 1, true), basic({ color: 0xffd9a0, side: THREE.DoubleSide }));
        shadeM.position.set(0.75, 1.24, -0.22); shadeM.rotation.z = 0.6; hisDesk.add(shadeM);
        // the empty chair, turned a little, lit blue from the screens
        const ch = new THREE.Group(); ch.position.set(0.1, 0, 0.75); ch.rotation.y = 0.35; hisDesk.add(ch);
        fbox(0.5, 0.08, 0.5, 0, 0.47, 0, basic({ color: 0x1f2a3a }), ch);
        fbox(0.48, 0.62, 0.07, 0, 0.84, 0.22, basic({ color: 0x223044 }), ch);
        fbox(0.05, 0.42, 0.05, 0, 0.22, 0, legM, ch);
        /* v19.0 · CHAD'S OFFICE (Mersus Office, Sketchfab — tools/prepfilm.mjs,
           in metres, its desks at 0.74 m). Turned a half turn and set so the
           two monitors of the desk the film is about stand where the drawn
           desk's did, so the camera path and the stand-in agree. His desk is
           the dual-monitor one whose keyboard is at (0.80, 0.78) in the file;
           its two panels were found as connected pieces of the Computers mesh
           and measured by their own vertices (masters/v19.0/screens.mjs):
           centre, facing (toward the keyboard) and width.

           NIGHT, PAINTED: every material becomes an unlit one whose colour is
           multiplied by the light the shot needs — a low blue ambient, the
           screens' pool round his desk, and one panel left on far off — so the
           room is dark where nobody is working, which is what the shot is
           about. (A real light would change the light COUNT, and every lit
           material in the chapter would build its shader again — v15.1.) */
        const OFF_T = [1.967, 0, 0.997];
        const offM = new THREE.Group(); offM.position.set(OFF_T[0], 0, OFF_T[2]); offM.rotation.y = Math.PI; off.add(offM);
        const nU = {
          /* photographed: at an ambient of 0.085 and a 3.6 m pool the wood
             floor read as day — these are the numbers that read as night */
          nAmb: { value: new THREE.Color(0.045, 0.052, 0.08) },
          nPA: { value: new THREE.Vector3(off.position.x + 1.30, 1.12, off.position.z - 0.10) }, nCA: { value: new THREE.Color(0.40, 0.60, 1.05) }, nRA: { value: 2.5 },
          nPB: { value: new THREE.Vector3(off.position.x - 5.5, 3.4, off.position.z - 6.0) }, nCB: { value: new THREE.Color(0.15, 0.15, 0.18) }, nRB: { value: 6.0 },
        };
        const nightMat = (src) => {
          const m = new THREE.MeshBasicMaterial({ map: src.map || null, color: src.color ? src.color.clone() : 0xffffff, fog: false,
            transparent: !!src.transparent, opacity: src.opacity ?? 1, side: THREE.DoubleSide, alphaTest: src.alphaTest || 0, depthWrite: src.depthWrite !== false });
          m.onBeforeCompile = (sh) => {
            Object.assign(sh.uniforms, nU);
            sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vNW;')
              .replace('#include <fog_vertex>', '#include <fog_vertex>\nvNW = (modelMatrix * vec4(transformed, 1.0)).xyz;');
            sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nvarying vec3 vNW;\nuniform vec3 nAmb, nPA, nCA, nPB, nCB;\nuniform float nRA, nRB;')
              .replace('#include <opaque_fragment>', 'float kA = 1.0 - smoothstep(0.0, nRA, distance(vNW, nPA));\nfloat kB = 1.0 - smoothstep(0.0, nRB, distance(vNW, nPB));\noutgoingLight *= nAmb + nCA * kA * kA + nCB * kB * kB;\n#include <opaque_fragment>');
          };
          m.customProgramCacheKey = () => 'e3c1night';
          return m;
        };
        // the code, on his two real screens (hidden until the room is there to hold them)
        const offScr = new THREE.Group(); offScr.visible = false; offM.add(offScr);
        for (const [mx, my, mz, ry] of [[0.318, 1.122, 1.192, 2.737], [1.015, 1.122, 1.242, -2.843]]) {
          const sc = fplane(0.655, 0.37, 0, 0, 0, basic({ map: codeTex }), offScr);
          sc.position.set(mx + Math.sin(ry) * 0.018, my, mz + Math.cos(ry) * 0.018); sc.rotation.set(0, ry, 0);
        }
        // and their glow on the desk under them
        const offGlow = fplane(1.5, 0.9, 0.66, 0.748, 0.85, basic({ color: 0x3f7fd0, transparent: true, opacity: 0.16, blending: THREE.AdditiveBlending, depthWrite: false }), offScr, 0, -Math.PI / 2);
        void offGlow;
        // the city at night through the windows, all the way round
        const cityTex = tex(makeCity(THREE, cnv)); cityTex.wrapS = THREE.RepeatWrapping; cityTex.repeat.set(5, 1);
        const city2 = new THREE.Mesh(new THREE.CylinderGeometry(19, 19, 9, 48, 1, true), basic({ map: cityTex, side: THREE.BackSide }));
        city2.position.set(3.7, 3.4, 2.1); off.add(city2); city2.visible = false;
        parseOnce('filmoffice').then(gltf => {
          if (!alive) return;
          const g = gltf.scene.clone(true), mats = new Map();
          g.traverse(o => {
            if (!o.isMesh) return;
            o.castShadow = o.receiveShadow = false;
            const ms = Array.isArray(o.material) ? o.material : [o.material];
            const nm = ms.map(m => { if (!mats.has(m)) mats.set(m, nightMat(m)); return mats.get(m); });
            o.material = Array.isArray(o.material) ? nm : nm[0];
          });
          offM.add(g); offScr.visible = true; city2.visible = true; offOld.visible = false;
        }).catch(err => { console.warn('filmoffice failed to load', err); ctx.loadFail && ctx.loadFail('filmoffice', err); });
        root.userData.code = { cv: codeCv, tex: codeTex, t: 0, lines: [] };
      }

      /* ---- 3 · THE CAMERA BUSINESS (v19.0) ----
         Chad: "the car camera business scene need to be greatly improved, it
         looks really bad. There's no need to have the gates. Just show a
         table, laptop, and the cameras on the table, and pan slowly while
         voiceline talks." So the warehouse — its racks, which read as gates,
         and its roller door — is gone, and what is left is the business: a
         wooden table, his laptop with the orders climbing on it (Chad's
         laptop model), and the cameras he sells laid out in front of it
         (Chad's Xiaomi Yi 4K, at its real 6.6 cm). LIT, because black plastic
         and a glass lens are nothing but their shading; the warm room behind
         is just enough of a place to sit the table in. */
      const ware = new THREE.Group(); ware.position.set(1000, 0, 0); root.add(ware);
      const chartCv = cnv(256), chartTex = new THREE.CanvasTexture(chartCv[0]); chartTex.colorSpace = THREE.SRGBColorSpace; madeTex.push(chartTex);
      root.userData.chart = { cv: chartCv, tex: chartTex, k: 0 };
      const BIZ = { top: 0.775 };
      {
        const wl = (o) => new THREE.MeshStandardMaterial({ fog: false, roughness: 0.75, ...o });
        /* behind the table, a dark warm backdrop and nothing else (photographed:
           a lit room was a brown box that pulled the eye off the table) — the
           table is the scene, the way a product is shot */
        const back = new THREE.Mesh(new THREE.SphereGeometry(7, 32, 16),
          basic({ map: tex(makeSkyGrad(THREE, cnv, ['#0b0907', '#2a1d14', '#120d0a'])), side: THREE.BackSide, depthWrite: false }));
        back.position.y = 0.8; ware.add(back);
        // THE TABLE: a thick light-oak top on four dark legs, a lamp's warm pool on it
        const topT = tex(makeOak(THREE, cnv));
        fbox(1.7, 0.05, 0.86, 0, BIZ.top - 0.025, 0, wl({ map: topT, roughness: 0.5 }), ware);
        fplane(1.5, 0.8, -0.18, BIZ.top + 0.002, 0.05, basic({ map: tex(makePool(THREE, cnv)), transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false }), ware, 0, -Math.PI / 2);
        for (const sx of [-0.78, 0.78]) for (const sz of [-0.36, 0.36]) fbox(0.06, BIZ.top - 0.05, 0.06, sx, (BIZ.top - 0.05) / 2, sz, wl({ color: 0x24201c, roughness: 0.6 }), ware);
        /* THE LAPTOP, at the back of the table, its screen the orders chart.
           The model's screen faces its own -x; a quarter turn faces it at the
           pan. The drawn laptop stands in until the file lands. */
        const lapAt = { x: 0.32, z: -0.14, ry: Math.PI / 2 - 0.42 };
        const lapOld = new THREE.Group(); lapOld.position.set(lapAt.x, BIZ.top + 0.008, lapAt.z); lapOld.rotation.y = -0.42; ware.add(lapOld);
        fbox(0.36, 0.015, 0.25, 0, 0, 0, basic({ color: 0x9a9ea4 }), lapOld);
        fplane(0.34, 0.22, 0, 0.12, -0.12, basic({ map: chartTex }), lapOld, 0, -0.25);
        parseOnce('filmlaptop').then(gltf => {
          if (!alive) return;
          const g = gltf.scene.clone(true);
          g.position.set(lapAt.x, BIZ.top, lapAt.z); g.rotation.y = lapAt.ry;
          g.traverse(o => {
            if (!o.isMesh) return;
            o.castShadow = false; o.receiveShadow = false;
            const m = o.material;
            o.material = (m && m.name === 'screen') ? basic({ map: chartTex }) : m.clone();
            if (o.material.isMeshStandardMaterial) o.material.fog = false;
          });
          ware.add(g); lapOld.visible = false;
        }).catch(err => { console.warn('filmlaptop failed to load', err); ctx.loadFail && ctx.loadFail('filmlaptop', err); });
        /* THE CAMERAS, in a loose row along the front of the table, each
           turned its own way — what he sells, lens to the light. Stand-ins:
           the drawn camera (a body, a lens), swapped for Chad's model. */
        /* set out as a seller sets them out (photographed: scattered at random
           they read as dice): a front row facing the pan, a second row behind
           turned a little, every lens toward the light */
        const CAMS = [[-0.62, 0.22, 0.30], [-0.47, 0.25, 0.12], [-0.32, 0.23, -0.06], [-0.17, 0.26, 0.10], [-0.02, 0.24, -0.12],
                      [-0.55, 0.06, 0.45], [-0.38, 0.08, 0.20], [-0.21, 0.07, -0.20], [-0.06, 0.09, 0.28]];
        const camOld = new THREE.Group(); ware.add(camOld);
        for (const [x, z, ry] of CAMS) {
          const cg = new THREE.Group(); cg.position.set(x, BIZ.top + 0.022, z); cg.rotation.y = ry; camOld.add(cg);
          fbox(0.066, 0.043, 0.03, 0, 0, 0, basic({ color: 0x151517 }), cg);
          const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.012, 16), basic({ color: 0x2a3444 }));
          lens.rotation.x = Math.PI / 2; lens.position.set(0.015, 0, 0.02); cg.add(lens);
        }
        parseOnce('actioncam').then(gltf => {
          if (!alive) return;
          /* black plastic and a glass lens, shaded: the file's metalness (0.49)
             with nothing to reflect rendered it bronze (photographed) — a
             satin plastic that takes the room's environment instead */
          const camMats = new Map();
          for (const [x, z, ry] of CAMS) {
            const g = gltf.scene.clone(true);
            g.position.set(x, BIZ.top, z); g.rotation.y = ry;
            g.traverse(o => {
              if (!o.isMesh) return;
              o.castShadow = false; o.receiveShadow = false;
              if (!camMats.has(o.material)) {
                const m = o.material.clone(); m.fog = false; m.metalness = 0.1; m.roughness = 0.45;
                m.envMap = scene.environment || null; m.envMapIntensity = 0.22;   // at 0.9 the black bodies read WHITE (photographed)
                camMats.set(o.material, m);
              }
              o.material = camMats.get(o.material);
            });
            ware.add(g);
          }
          camOld.visible = false;
        }).catch(err => { console.warn('actioncam failed to load', err); ctx.loadFail && ctx.loadFail('actioncam', err); });
      }

      /* ---- 4 · THE DESK AT NIGHT, AND THE AMULET ---- */
      const desk = new THREE.Group(); desk.position.set(1300, 0, 0); root.add(desk);
      let amuletSpin = null, candleFl = null;
      {
        const room = new THREE.Mesh(new THREE.BoxGeometry(6, 3, 6), basic({ color: 0x0c0907, side: THREE.BackSide }));
        room.position.y = 1.5; desk.add(room);
        const top = fplane(1.6, 0.8, 0, 0.75, 0, basic({ map: tex(makeDeskWood(THREE, cnv)) }), desk, 0, -Math.PI / 2);
        void top;
        fbox(1.6, 0.04, 0.8, 0, 0.725, 0, basic({ color: 0x1a120c }), desk);   // its top 5 mm under the wood (CP4: coplanar, it striped)
        // the candle's light, painted: a warm pool on the wood, a glow in the air
        fplane(1.1, 0.75, 0.2, 0.752, 0.0, basic({ color: 0xffa650, transparent: true, opacity: 0.30, blending: THREE.AdditiveBlending, depthWrite: false }), desk, 0, -Math.PI / 2);
        const glow = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 12),
          basic({ color: 0xff8a30, transparent: true, opacity: 0.10, blending: THREE.AdditiveBlending, depthWrite: false }));
        glow.position.set(0.32, 0.92, -0.12); desk.add(glow);
        const cnd = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.12, 12), basic({ color: 0x8a7c62 }));
        cnd.position.set(0.32, 0.81, -0.12); desk.add(cnd);
        candleFl = new THREE.Mesh(new THREE.SphereGeometry(0.009, 8, 6), basic({ color: 0xffb040 }));
        candleFl.scale.set(1, 2.2, 1); candleFl.position.set(0.32, 0.895, -0.12); desk.add(candleFl);
        // a red cloth, and on it, the amulet — episode 1's Phiboon
        const cloth = fplane(0.22, 0.22, -0.02, 0.753, 0.02, basic({ color: 0x4a0c08 }), desk, 0, -Math.PI / 2);   // velvet, painted dark (ACES)
        cloth.rotation.z = 0.3;
        amuletSpin = new THREE.Group(); amuletSpin.position.set(-0.02, 0.757, 0.02); desk.add(amuletSpin);
        // three more amulets at the edge of the cloth, a collector's desk
        for (let i = 0; i < 3; i++) {
          const a = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.004, 0.042), basic({ color: [0xb89a5a, 0x6a5a40, 0xd8c8a0][i] }));
          a.position.set(-0.28 + i * 0.07, 0.756, 0.2 - i * 0.02); a.rotation.y = hash(i, 8) - 0.5; desk.add(a);
        }
        // a notebook of figures, a pen
        fplane(0.2, 0.26, -0.45, 0.754, -0.1, basic({ map: tex(makeLedger(THREE, cnv)) }), desk, 0.2, -Math.PI / 2);
        fbox(0.14, 0.008, 0.008, -0.34, 0.758, 0.02, basic({ color: 0x1a1a1a }), desk);
        parseOnce('phiboon').then(gltf => {
          if (!alive) return;
          const g = gltf.scene.clone(true);
          const bb = new THREE.Box3().setFromObject(g), sz = bb.getSize(new THREE.Vector3());
          const s = 0.075 / Math.max(sz.x, sz.y, sz.z);
          g.scale.setScalar(s);
          const c = bb.getCenter(new THREE.Vector3());
          g.position.set(-c.x * s, -bb.min.y * s, -c.z * s);
          /* lying on its back, face up to the candle; lit by the candle, which
             is painted — the materials take their own map as a warm glow */
          const lie = new THREE.Group(); lie.rotation.x = -Math.PI / 2; lie.position.y = 0.004; lie.add(g);
          g.position.set(-c.x * s, -c.y * s, -bb.min.z * s);
          g.traverse(o => {
            if (!o.isMesh) return;
            o.castShadow = false;
            const m = o.material.clone();
            if (m.map) { m.emissiveMap = m.map; m.emissive = new THREE.Color(0xffb070); m.emissiveIntensity = 0.55; }   // the candle, not a lamp: at 1.1 its relief washed out (CP4)
            m.fog = false; o.material = m; owned.push({ dispose: () => m.dispose() });
          });
          amuletSpin.add(lie);
        }).catch(err => { console.warn('phiboon failed to load', err); ctx.loadFail && ctx.loadFail('phiboon', err); });
      }

      /* ---- 5 · THE PLANE WINDOW AT DAWN ---- */
      const plane = new THREE.Group(); plane.position.set(1600, 0, 0); root.add(plane);
      {
        /* the world outside (v19.0, Chad: "Colour the sky outside with clouds and
           sun"): a whole sky now, not a curved strip — deep blue overhead, the
           dawn low on the horizon with the sun in it, a sea of cloud below and
           towers of cumulus standing out of it, painted on a sphere round the
           cabin. The sun is out of the window's side and a little ahead. */
        const out = new THREE.Mesh(new THREE.SphereGeometry(70, 48, 24),
          basic({ map: tex(makePlaneSky(THREE, cnv)), side: THREE.BackSide, depthWrite: false }));
        out.position.set(0, 1.3, 0); plane.add(out);
        const planeOld = new THREE.Group(); plane.add(planeOld);
        /* the wing, reaching out and swept back below the window. Drawn in the
           plane of the ground: with rotation.x = -PI/2 a shape point (x, y)
           lands at world (x, 0, -y), so the outline is written as (x, -z) */
        const wing = new THREE.Shape();
        wing.moveTo(0.9, 0.6); wing.lineTo(14.0, -6.0); wing.lineTo(14.4, -7.6); wing.lineTo(0.9, -3.6); wing.closePath();
        /* v19.0: shaded — a flat grey wedge read as a cut-out against the new
           sky (photographed); now its top catches the dawn toward the leading
           edge and darkens to the flaps (ShapeGeometry's UVs are the shape's
           own coordinates, so the gradient is laid out across them) */
        const wingT = tex(makeWing(THREE, cnv)); wingT.repeat.set(1 / 14.5, 1 / 8.4); wingT.offset.set(-0.9 / 14.5, 7.8 / 8.4);
        const wm = new THREE.Mesh(new THREE.ShapeGeometry(wing), basic({ map: wingT, side: THREE.DoubleSide }));
        wm.rotation.x = -Math.PI / 2; wm.position.y = -0.85; plane.add(wm);   // v19.0: a metre lower — the sky is the window, the wing at its foot
        // a lighter leading edge catching the dawn, and the winglet at the tip
        const le = new THREE.Shape(); le.moveTo(0.9, 0.6); le.lineTo(14.0, -6.0); le.lineTo(14.0, -6.25); le.lineTo(0.9, 0.3); le.closePath();
        const lem = new THREE.Mesh(new THREE.ShapeGeometry(le), basic({ color: 0xb8a898, side: THREE.DoubleSide }));
        lem.rotation.x = -Math.PI / 2; lem.position.y = -0.84; plane.add(lem);
        const tipS = new THREE.Shape(); tipS.moveTo(-0.7, -0.6); tipS.lineTo(0.7, -0.6); tipS.lineTo(0.35, 0.6); tipS.lineTo(-0.05, 0.6); tipS.closePath();   // swept, not a square
        const tip = new THREE.Mesh(new THREE.ShapeGeometry(tipS), basic({ color: 0x23324c, side: THREE.DoubleSide }));
        tip.position.set(14.2, -0.25, 6.8); tip.rotation.y = Math.PI / 2; plane.add(tip);
        /* v19.0: retired with the drawn cabin — through Chad's window it read
           as a flat blade cutting the sky in two (photographed, on desktop and
           phone), and the ask is the sky: clouds and the sun */
        wm.visible = false; lem.visible = false; tip.visible = false;
        // the cabin wall around the window: a panel with a rounded hole in it
        const panel = new THREE.Shape();
        panel.moveTo(-1.2, -1.0); panel.lineTo(1.2, -1.0); panel.lineTo(1.2, 1.3); panel.lineTo(-1.2, 1.3); panel.closePath();
        const hole = new THREE.Path();
        const rw = 0.2, rh = 0.3, r = 0.14;
        hole.moveTo(-rw + r, -rh); hole.lineTo(rw - r, -rh); hole.quadraticCurveTo(rw, -rh, rw, -rh + r);
        hole.lineTo(rw, rh - r); hole.quadraticCurveTo(rw, rh, rw - r, rh); hole.lineTo(-rw + r, rh);
        hole.quadraticCurveTo(-rw, rh, -rw, rh - r); hole.lineTo(-rw, -rh + r); hole.quadraticCurveTo(-rw, -rh, -rw + r, -rh);
        panel.holes.push(hole);
        const wall = new THREE.Mesh(new THREE.ShapeGeometry(panel), basic({ color: 0x4a4744, side: THREE.DoubleSide }));   // a dim cabin: the light is outside
        wall.position.set(0, 1.3, 0); wall.rotation.y = -Math.PI / 2; wall.position.x = 0.62; planeOld.add(wall);
        // the shade, half up, and the window's own inner frame
        const shadeP = fplane(0.4, 0.3, 0.61, 1.52, 0, basic({ color: 0x6a655e, side: THREE.DoubleSide }), planeOld, -Math.PI / 2);
        void shadeP;
        const frame = new THREE.Mesh(new THREE.TorusGeometry(0.29, 0.03, 6, 28), basic({ color: 0xbdb8ae }));
        frame.material.color.setHex(0x6e6a63);
        frame.scale.set(0.72, 1.05, 1); frame.rotation.y = Math.PI / 2; frame.position.set(0.6, 1.3, 0); planeOld.add(frame);
        /* v19.0 · CHAD'S CABIN (Airplane Inside, Sketchfab — a slice of five
           rows of three, one wall of windows; tools/prepfilm.mjs x17.5, so the
           cushion stands 0.37 m off the floor and the seat back 1.08). The
           seats face +z. Set so HIS window — the second row's — is where the
           drawn one was (its inner rim at x 0.62, its middle at y 1.30, z 0):
           every number below was raycast through the file
           (masters/v19.0/holes2.mjs) and moved by that one offset. */
        const CAB_T = [-0.196, 0.17, 1.175];
        const CAB = { seatX: [-0.706, -0.206, 0.294], rowZ: [-1.336, -0.147, 1.032, 2.221, 3.411], top: 0.675,
                      aisle: -1.309, wallTop: 2.56, floor: 0.297, z0: -1.825, z1: 4.175 };
        const across = (x) => 2 * CAB.aisle - x;   // a seat's twin across the aisle
        const cabin = new THREE.Group(); cabin.position.set(CAB_T[0], CAB_T[1], CAB_T[2]); plane.add(cabin);
        parseOnce('planecabin').then(gltf => {
          if (!alive) return;
          const g = gltf.scene.clone(true);
          g.traverse(o => {
            if (!o.isMesh) return;
            o.castShadow = false; o.receiveShadow = false;
            const m = o.material.clone(); m.fog = false;
            /* the window panes (blinn5) are one opaque grey sheet in the file:
               glass now, so the sky is what is in the window */
            if (o.material.name === 'blinn5') { m.transparent = true; m.opacity = 0.06; m.depthWrite = false; m.color.setHex(0xdfeaf2); }
            o.material = m;
          });
          cabin.add(g); planeOld.visible = false;
          /* the file is HALF a cabin: one block of three and the wall beside
             it, open on the aisle side and at both ends (photographed: the sky
             stood in the cabin on the right). It is mirrored about the aisle
             — the floor's open edge, x -1.113 in the file, so the aisle is
             0.76 m wide — for the block of three across, and a ceiling and the
             two end bulkheads close the box. */
          const twin = g.clone(true); twin.scale.x = -1;
          const cab2 = new THREE.Group(); cab2.position.set(2 * CAB.aisle - CAB_T[0], CAB_T[1], CAB_T[2]); plane.add(cab2); cab2.add(twin);
          cabShell.visible = true;
        }).catch(err => { console.warn('planecabin failed to load', err); ctx.loadFail && ctx.loadFail('planecabin', err); });
        const cabShell = new THREE.Group(); cabShell.visible = false; plane.add(cabShell);
        {
          const lin = new THREE.MeshStandardMaterial({ color: 0xd9d3c8, roughness: 0.85, fog: false, side: THREE.DoubleSide });
          const cw = CAB.wallTop, x0 = 0.142, x1 = 2 * CAB.aisle - x0, z0 = CAB.z0, z1 = CAB.z1, fl = CAB.floor;
          fplane(x0 - x1, z1 - z0, (x0 + x1) / 2, cw - 0.01, (z0 + z1) / 2, lin, cabShell, 0, Math.PI / 2);                    // the ceiling
          fplane(0.5, z1 - z0, CAB.aisle, cw - 0.02, (z0 + z1) / 2, basic({ color: 0xfff1d8 }), cabShell, 0, Math.PI / 2);   // its light strip
          for (const z of [z0, z1]) fplane(2 * (0.97 - CAB.aisle) + 0.2, cw - fl, CAB.aisle, (cw + fl) / 2, z, lin, cabShell, 0, 0);   // the bulkheads
          fplane(0.7, 1.9, CAB.aisle, fl + 0.95, z1 - 0.01, new THREE.MeshStandardMaterial({ color: 0x23324c, roughness: 0.9, fog: false, side: THREE.DoubleSide }), cabShell);   // a curtain, forward
          fplane(0.36, 0.12, CAB.aisle, cw - 0.25, z1 - 0.02, basic({ color: 0x3fd07a }), cabShell);   // and an exit sign over it
        }
        /* THE PASSENGERS (Chad: "add other seated characters (you can reuse
           from tangki event to be added to the airplane seats), make sure they
           dont sink into the seats"): episode 1 chapter 3's seated audience, in
           the rows ahead of his, each parked on a quiet frame of its own take.
           Seated on their POSED SKIN, never their bones (v16.8): the underside
           of the thighs on the cushion, the back against the backrest. */
        const PAX = [
          ['sitwoman', 0, 2, 'Armature|Sit_Cross_Legged|baselayer', 0.0],
          ['sitman', 2, 2, 'Armature|Sitting_Clap|baselayer', 0.02],
          ['sitangry', 0, 3, 'mixamo.com', 0.0],
          ['sitshout', 1, 3, 'Armature|Sit_Shout_Hands_on_Mouth|baselayer', 0.0],
          ['sitclap', 2, 4, 'mixamo.com', 0.0],
          ['sitman', 0, 4, 'Armature|Sitting_Clap|baselayer', 0.5],
          // and three across the aisle (seat index 3 + i is the twin of i)
          ['sitangry', 3, 2, 'mixamo.com', 0.0],   // frame 0: at 0.4 an arm was up (photographed)
          ['sitshout', 4, 3, 'Armature|Sit_Shout_Hands_on_Mouth|baselayer', 0.0],
          ['sitclap', 5, 4, 'mixamo.com', 0.6],
        ].filter((_, i) => !LOW || i < 3 || i === 6 || i === 7);
        for (const [key, si, ri, take, at] of PAX) {
          const sx = plane.position.x + (si < 3 ? CAB.seatX[si] : across(CAB.seatX[si - 3])), sz = plane.position.z + CAB.rowZ[ri];
          paxRigs.push(mkRig(key, { x: sx, y: CAB.top, z: sz, ry: 0, height: 1.30, seated: true, idle: take, at,
            then: (r) => fitSeat(r, { x: sx, z: sz, top: plane.position.y + CAB.top }) }));
        }
        // the stand-in's seat in front, the armrest, the overhead's glow
        fbox(0.12, 0.9, 0.55, 0.3, 0.8, -0.72, basic({ color: 0x2a3550 }), planeOld);
        fbox(0.5, 0.08, 0.08, 0.3, 0.64, 0.35, basic({ color: 0x6a6a6a }), planeOld);
        fplane(2.4, 0.3, 0.1, 2.3, 0, basic({ color: 0x3c3a37 }), planeOld, -Math.PI / 2, 0);
      }
      return { root, ord, off, ware, desk, plane, amuletSpin: () => amuletSpin, candleFl: () => candleFl,
               boom: root.userData.boom, P: { ord: ord.position, off: off.position, ware: ware.position, desk: desk.position, plane: plane.position } };
    }
    /* the film's live paint: the code scrolls, the chart climbs, the phone lights */
    let codeAt = 0;
    function filmTick(t) {
      if (getState() !== 'cine' || !film) return;
      const cx = yaw.position.x;
      if (Math.abs(cx - 700) < 30 && t - codeAt > 0.09) {
        codeAt = t;
        const C = film.root.userData.code, [cv, x] = C.cv;
        C.t++;
        if (!C.lines.length || C.t % 2 === 0) {
          const ind = Math.floor(hash(C.t, 2) * 4) * 12;
          const len = 30 + hash(C.t, 3) * 150;
          const kinds = ['#7fb8ff', '#c9d1d9', '#8fe39a', '#e6b673', '#d58fe0'];
          C.lines.push({ ind, len, col: kinds[Math.floor(hash(C.t, 4) * kinds.length)], len2: hash(C.t, 6) * 60 });
          if (C.lines.length > 26) C.lines.shift();
        }
        x.fillStyle = '#0d1117'; x.fillRect(0, 0, 256, 256);
        C.lines.forEach((l, i) => {
          const y = 8 + i * 9.4;
          x.fillStyle = '#3b4250'; x.fillRect(4, y, 10, 5);
          x.fillStyle = l.col; x.fillRect(20 + l.ind, y, l.len, 5);
          if (l.len2 > 20) { x.fillStyle = '#c9d1d9'; x.fillRect(24 + l.ind + l.len, y, l.len2, 5); }
        });
        x.fillStyle = '#e6edf3'; if ((C.t >> 2) % 2) x.fillRect(20 + (C.lines[C.lines.length - 1].ind), 8 + (C.lines.length) * 9.4, 6, 7);
        C.tex.needsUpdate = true;
      }
      if (Math.abs(cx - 1000) < 30) {
        const H = film.root.userData.chart, [cv, x] = H.cv;
        H.k = H.at !== undefined ? H.at : Math.min(1, H.k + 0.004);   // v19.0: the film's own clock drives it (a frame count crawled on a slow box)
        x.fillStyle = '#f5f7fa'; x.fillRect(0, 0, 256, 256);
        x.fillStyle = '#1f2a3a'; x.font = 'bold 20px sans-serif'; x.fillText('ROADEYE · ORDERS', 14, 30);
        x.strokeStyle = '#d0d6de'; x.lineWidth = 1;
        for (let i = 0; i < 5; i++) { x.beginPath(); x.moveTo(14, 60 + i * 40); x.lineTo(244, 60 + i * 40); x.stroke(); }
        x.strokeStyle = '#1d9a5a'; x.lineWidth = 5; x.beginPath();
        const N = 12;
        for (let i = 0; i <= N * H.k; i++) {
          const px = 14 + i * (230 / N), v = Math.pow(i / N, 1.7) * 0.85 + hash(i, 9) * 0.08;
          const py = 220 - v * 170;
          i ? x.lineTo(px, py) : x.moveTo(px, py);
        }
        x.stroke();
        H.tex.needsUpdate = true;
      }
      if (film.candleFl()) film.candleFl().scale.y = 2.2 + Math.sin(t * 13) * 0.3 + Math.sin(t * 29) * 0.15;
    }

    const readyAt = performance.now();
    return (S = {
      world, noteTex, blockers: blockers(), groundAt, STAIR,
      pileVia: { what: "the private room's door", x: KDOOR.x + 0.4, z: KDOOR.z },   // the Ajarn is behind a scene change (walktest)
      ready: () => (ajarn.ready && other.ready && monk.ready) || performance.now() - readyAt > 12000,
      pile: { pos: PILE_POS, radius: INTERACT_R, group: pile,
              dist: pileDist, screen: pileScreen, inView: pileInView,
              hits: pointerHitsPile, interact: interactPile,
              glow: () => 0 },
      drum: null, ash: null, embers: null, heroNote: null, smoke: null, flying: null,
      jossTips: [], fireLight: null,
      get noteStorm() { return 1; },
      set noteStorm(v) {},
      /* v16.0: barefoot on the sala's planks, shod everywhere else. The
         engine asks every footfall (stepSound); null keeps its own. */
      stepSound: () => { const x = yaw.position.x, z = yaw.position.z;
                         return (pIdx(phase) >= 2 && (inSala(x, z) || inWalk(x, z) || inRoom(x, z))) ? 'barestep' : null; },
      // the chapter's own
      SALA, DAIS, AJ, CUSH, WAIT, WAI, RACK, STALL, GATE, ALT, BODHI, DAIS_TOP, ajarnFace,
      ROOM, RDOOR, RIN, MD, MON, BLESS, WALK, KUTI, KDOOR, HELP, ROOMLIGHT,
      get STOOL_TOP() { return STOOL_TOP; },
      ajarn, other, auntie, assistant, monk, putAjarn, putOther, myShoes, handTray, film,
      /* for the endings: the room's door opened by the scene, and the way out */
      roomDoor: (k) => { roomDoorWant = k; roomDoorK = k; if (roomLeaf) roomLeaf.rotation.y = -k * 1.3; },
      leaveRoom: () => { roomDoorWant = 0; roomDoorK = 0; if (roomLeaf) roomLeaf.rotation.y = 0; if (kit) kit.daylight(null, 0); },
      get phase() { return phase; },
      setPhase, applyPhase, after, dayClock, sayLine,
      info: () => ({ phase, seated, t: +dayClock.t.toFixed(2), queued: lineQ.length, heard: [...heard],
                     blessing: !!blessing, entering: !!entering, flicks: blessing ? blessing.flick : null,
                     inRoom: inRoom(yaw.position.x, yaw.position.z), monkArm: +monkArmK.toFixed(2),
                     until: +speak.until.toFixed(2), pending: speak.pending ? speak.pending.name : null,
                     stool: +STOOL_TOP.toFixed(3), ajSeatTop: ajarn.seatTop ? +ajarn.seatTop.toFixed(3) : null,
                     beds: DATA.ambience.beds.map(b => [b[0], +b[1].toFixed(3)]),
                     yant: yantPick, seatAt: [+zoneSeat.position.x.toFixed(2), +zoneSeat.position.z.toFixed(2)] }),
      hotspots,
      updateNotes: (dt, t) => { updateNotes(dt, t); filmTick(t); },
      updatePile, updateFire, updateSlow,
      snap, restore, reset, dispose
    });
  }

  /* ============================================================= textures
     All drawn, none downloaded (CSP-safe). Seeded, so the same every load. */
  function rng(seed) { let s = seed >>> 0 || 1; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
  function done(THREE, c, rep) {
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
    if (rep) { t.wrapS = t.wrapT = THREE.RepeatWrapping; }
    return t;
  }
  function makePaving(THREE, cnv) {
    const S = 512, [c, x] = cnv(S), r = rng(11);
    x.fillStyle = '#c9bca4'; x.fillRect(0, 0, S, S);
    // four big worn slabs per tile, each its own shade, the joints dark
    for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) {
      const g = 188 + r() * 26;
      x.fillStyle = `rgb(${g},${g - 10},${g - 28})`; x.fillRect(i * 256 + 3, j * 256 + 3, 250, 250);
      for (let k = 0; k < 900; k++) {
        const v = g - 30 + r() * 50;
        x.fillStyle = `rgba(${v},${v - 8},${v - 24},0.35)`; x.fillRect(i * 256 + r() * 256, j * 256 + r() * 256, 2, 2);
      }
      // a few lichen stains and worn patches
      for (let k = 0; k < 3; k++) {
        const gr = x.createRadialGradient(i * 256 + r() * 256, j * 256 + r() * 256, 2, i * 256 + r() * 256, j * 256 + r() * 256, 40 + r() * 50);
        gr.addColorStop(0, 'rgba(110,100,78,0.18)'); gr.addColorStop(1, 'rgba(110,100,78,0)');
        x.fillStyle = gr; x.fillRect(i * 256, j * 256, 256, 256);
      }
    }
    x.fillStyle = '#7e725e'; x.fillRect(0, 0, S, 3); x.fillRect(0, 254, S, 4); x.fillRect(0, 0, 3, S); x.fillRect(254, 0, 4, S);
    return done(THREE, c, true);
  }
  function makePlanks(THREE, cnv) {
    const S = 512, [c, x] = cnv(S), r = rng(5);
    const W = 64;
    for (let i = 0; i < S / W; i++) {
      const base = 120 + r() * 26;
      x.fillStyle = `rgb(${base},${base * 0.62 | 0},${base * 0.38 | 0})`; x.fillRect(i * W, 0, W, S);
      for (let k = 0; k < 60; k++) {
        const y = r() * S, a = 0.08 + r() * 0.12;
        x.strokeStyle = `rgba(60,30,14,${a})`; x.lineWidth = 1 + r() * 2;
        x.beginPath(); x.moveTo(i * W, y); x.bezierCurveTo(i * W + W / 3, y + r() * 8 - 4, i * W + 2 * W / 3, y + r() * 8 - 4, i * W + W, y + r() * 6 - 3); x.stroke();
      }
      // the sheen of polish down each board
      const gr = x.createLinearGradient(i * W, 0, i * W + W, 0);
      gr.addColorStop(0, 'rgba(255,220,170,0.0)'); gr.addColorStop(0.5, 'rgba(255,220,170,0.10)'); gr.addColorStop(1, 'rgba(255,220,170,0.0)');
      x.fillStyle = gr; x.fillRect(i * W, 0, W, S);
      x.fillStyle = 'rgba(40,18,8,0.8)'; x.fillRect(i * W, 0, 2, S);
      const cut = r() * S; x.fillRect(i * W, cut, W, 2);
    }
    return done(THREE, c, true);
  }
  function makeGoldCarve(THREE, cnv) {
    const S = 256, [c, x] = cnv(S), r = rng(9);
    x.fillStyle = '#7a150e'; x.fillRect(0, 0, S, S);
    // gilded kanok flames, big enough to meet: a gable is mostly gold: flame-shaped scrolls, gold on red, repeated
    for (let row = 0; row < 4; row++) for (let col = 0; col < 4; col++) {
      const cx = col * 64 + 32 + (row % 2) * 16, cy = row * 64 + 34;
      x.fillStyle = '#e0ad44';
      x.beginPath(); x.moveTo(cx, cy + 30);
      x.bezierCurveTo(cx - 30, cy + 12, cx - 18, cy - 20, cx, cy - 34);
      x.bezierCurveTo(cx + 6, cy - 14, cx + 28, cy - 8, cx + 14, cy + 10);
      x.bezierCurveTo(cx + 26, cy + 6, cx + 28, cy + 22, cx, cy + 30); x.fill();
      x.fillStyle = '#f6d27a'; x.beginPath(); x.arc(cx - 2, cy - 2, 4, 0, Math.PI * 2); x.fill();
      x.strokeStyle = '#6a120c'; x.lineWidth = 1.2; x.stroke();
    }
    for (let i = 0; i < 500; i++) { x.fillStyle = `rgba(255,230,160,${r() * 0.12})`; x.fillRect(r() * S, r() * S, 2, 2); }
    return done(THREE, c, true);
  }
  /* v19.1 · the red board behind the principal Buddha, painted as Thai
     lacquer-and-gilt (lai rot nam): a border of running kanok flames between
     gilt rules, and inside it a diamond lattice (lai phum khao bin) with a
     four-petal flower at every crossing and a small gilt star in every
     diamond. 1024 x 1056 for the board's 3.2 x 3.3 m; the red is matRedD's. */
  function makeAltarScreen(THREE, cnv) {
    const W = 1024, H = 1056, [c, x] = cnv(W); c.height = H;
    const GOLD = '#d7a548', GOLD2 = '#f0cf7a', DEEP = '#6d140e';
    const g = x.createRadialGradient(W / 2, H * 0.45, 60, W / 2, H * 0.5, W * 0.75);
    g.addColorStop(0, '#7a1a12'); g.addColorStop(1, '#5a0f0a');
    x.fillStyle = g; x.fillRect(0, 0, W, H);
    // the lattice field: diagonal rules, a flower at every crossing, a star in every diamond
    const B = 92, P = 96;                                    // border width; lattice pitch
    x.save(); x.beginPath(); x.rect(B, B, W - 2 * B, H - 2 * B); x.clip();
    x.strokeStyle = GOLD; x.lineWidth = 3;
    for (let k = -H; k < W + H; k += P) {
      x.beginPath(); x.moveTo(k, 0); x.lineTo(k + H, H); x.stroke();
      x.beginPath(); x.moveTo(k, H); x.lineTo(k + H, 0); x.stroke();
    }
    const flower = (cx, cy, r) => {
      x.fillStyle = GOLD;
      for (let i = 0; i < 4; i++) {
        const a = i * Math.PI / 2;
        x.save(); x.translate(cx, cy); x.rotate(a);
        x.beginPath(); x.moveTo(0, 0);
        x.bezierCurveTo(r * 0.55, -r * 0.35, r * 0.75, -r * 0.05, r, 0);
        x.bezierCurveTo(r * 0.75, r * 0.05, r * 0.55, r * 0.35, 0, 0); x.fill();
        x.restore();
      }
      for (let i = 0; i < 4; i++) {                          // the small leaves between the petals
        const a = i * Math.PI / 2 + Math.PI / 4;
        x.beginPath(); x.ellipse(cx + Math.cos(a) * r * 0.42, cy + Math.sin(a) * r * 0.42, r * 0.16, r * 0.08, a, 0, Math.PI * 2); x.fill();
      }
      x.fillStyle = GOLD2; x.beginPath(); x.arc(cx, cy, r * 0.2, 0, Math.PI * 2); x.fill();
      x.strokeStyle = DEEP; x.lineWidth = 1.5; x.beginPath(); x.arc(cx, cy, r * 0.2, 0, Math.PI * 2); x.stroke();
    };
    const star = (cx, cy, r) => {
      x.fillStyle = GOLD; x.beginPath();
      for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4, rr = i % 2 ? r * 0.35 : r; x.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr); }
      x.closePath(); x.fill();
    };
    // crossings sit where the rules meet: every P/2 across, alternating rows
    for (let row = 0, y = 0; y <= H + P; row++, y += P / 2) {
      for (let xx = (row % 2) * P / 2; xx <= W + P; xx += P) {
        flower(xx, y, 26);
        star(xx + P / 2, y, 9);
      }
    }
    x.restore();
    // the border: two gilt rules and a running kanok between them
    x.fillStyle = DEEP; x.fillRect(0, 0, W, B); x.fillRect(0, H - B, W, B); x.fillRect(0, 0, B, H); x.fillRect(W - B, 0, B, H);
    x.strokeStyle = GOLD; x.lineWidth = 6; x.strokeRect(12, 12, W - 24, H - 24);
    x.lineWidth = 4; x.strokeRect(B - 8, B - 8, W - 2 * B + 16, H - 2 * B + 16);
    const flame = (cx, cy, s, rot) => {
      x.save(); x.translate(cx, cy); x.rotate(rot); x.scale(s, s);
      x.fillStyle = GOLD; x.beginPath();
      x.moveTo(-14, 10); x.bezierCurveTo(-16, -6, -4, -14, 4, -26);
      x.bezierCurveTo(3, -14, 14, -10, 12, 4); x.bezierCurveTo(20, 0, 22, 10, 16, 14);
      x.bezierCurveTo(4, 18, -8, 18, -14, 10); x.fill();
      x.fillStyle = DEEP; x.beginPath(); x.arc(0, 4, 4.2, 0, Math.PI * 2); x.fill();
      x.fillStyle = GOLD2; x.beginPath(); x.arc(0, 4, 2.2, 0, Math.PI * 2); x.fill();
      x.restore();
    };
    const run = (x0, y0, x1, y1, rot) => {
      const n = Math.round(Math.hypot(x1 - x0, y1 - y0) / 52);
      for (let i = 0; i <= n; i++) flame(x0 + (x1 - x0) * i / n, y0 + (y1 - y0) * i / n, 1.2, rot);
    };
    const m = (B + 4) / 2 + 4;
    run(m + 40, m, W - m - 40, m, 0);                         // top: the flames point up
    run(m + 40, H - m, W - m - 40, H - m, Math.PI);           // bottom: down
    run(m, m + 40, m, H - m - 40, -Math.PI / 2);              // left: out
    run(W - m, m + 40, W - m, H - m - 40, Math.PI / 2);       // right: out
    for (const [cx, cy] of [[m, m], [W - m, m], [m, H - m], [W - m, H - m]]) flower(cx, cy, 30);
    // a faint lacquer wear, so the gilt is not printed-flat
    const r = rng(41);
    for (let i = 0; i < 1400; i++) { x.fillStyle = `rgba(${r() < 0.5 ? '255,220,150' : '30,6,4'},${r() * 0.07})`; x.fillRect(r() * W, r() * H, 2 + r() * 3, 1 + r() * 2); }
    return done(THREE, c, false);
  }
  function makeRoofTiles(THREE, cnv, a, b) {
    const S = 256, [c, x] = cnv(S);
    x.fillStyle = b; x.fillRect(0, 0, S, S);
    for (let row = 0; row < 8; row++) for (let col = 0; col < 8; col++) {
      const px = col * 32 + (row % 2) * 16, py = row * 32;
      x.fillStyle = a;
      x.beginPath(); x.moveTo(px + 2, py); x.lineTo(px + 30, py); x.lineTo(px + 30, py + 20);
      x.quadraticCurveTo(px + 16, py + 32, px + 2, py + 20); x.closePath(); x.fill();
      x.fillStyle = 'rgba(255,255,255,0.10)'; x.fillRect(px + 4, py + 2, 24, 3);
    }
    return done(THREE, c, true);
  }
  function makeLimewash(THREE, cnv) {
    const S = 256, [c, x] = cnv(S), r = rng(3);
    x.fillStyle = '#efe8da'; x.fillRect(0, 0, S, S);
    for (let i = 0; i < 2600; i++) { const g = 215 + r() * 30; x.fillStyle = `rgba(${g},${g - 4},${g - 14},0.45)`; x.fillRect(r() * S, r() * S, 2, 2); }
    // rain streaks from the coping and a grimy foot
    for (let i = 0; i < 18; i++) { x.fillStyle = `rgba(120,110,95,${0.04 + r() * 0.06})`; x.fillRect(r() * S, 0, 2 + r() * 5, 40 + r() * 120); }
    const g = x.createLinearGradient(0, S * 0.8, 0, S); g.addColorStop(0, 'rgba(110,100,80,0)'); g.addColorStop(1, 'rgba(110,100,80,0.35)');
    x.fillStyle = g; x.fillRect(0, 0, S, S);
    const t = done(THREE, c, true); t.repeat.set(3, 1); return t;
  }
  function makeNagaScales(THREE, cnv) {
    const S = 128, [c, x] = cnv(S);
    x.fillStyle = '#9a6618'; x.fillRect(0, 0, S, S);   // v17.3: gold, not green
    for (let row = 0; row < 10; row++) for (let col = 0; col < 10; col++) {
      const px = col * 13 + (row % 2) * 6.5, py = row * 12;
      x.fillStyle = row % 3 ? '#b88426' : '#e2b04a';
      x.beginPath(); x.arc(px, py, 6, 0, Math.PI); x.fill();
      x.strokeStyle = '#5a3a0c'; x.lineWidth = 1; x.stroke();
    }
    return done(THREE, c, false);
  }
  function makeReedMat(THREE, cnv) {
    const S = 128, [c, x] = cnv(S);
    x.fillStyle = '#c9a766'; x.fillRect(0, 0, S, S);
    for (let y = 0; y < S; y += 4) { x.fillStyle = y % 8 ? 'rgba(120,90,40,0.35)' : 'rgba(255,240,200,0.25)'; x.fillRect(0, y, S, 2); }
    x.strokeStyle = '#8a2a20'; x.lineWidth = 6; x.strokeRect(4, 4, S - 8, S - 8);
    return done(THREE, c, false);
  }
  function makeAbbot(THREE, cnv) {
    const S = 128, [c, x] = cnv(S);
    const g = x.createLinearGradient(0, 0, 0, S); g.addColorStop(0, '#b9a88a'); g.addColorStop(1, '#8a7658');
    x.fillStyle = g; x.fillRect(0, 0, S, S);
    // an old monk in saffron, a sepia portrait
    x.fillStyle = '#b8742a'; x.beginPath(); x.moveTo(20, S); x.quadraticCurveTo(64, 60, 108, S); x.fill();
    x.fillStyle = '#9a7a5a'; x.beginPath(); x.ellipse(64, 50, 20, 25, 0, 0, Math.PI * 2); x.fill();
    x.fillStyle = '#5a4432'; x.fillRect(52, 46, 7, 3); x.fillRect(69, 46, 7, 3); x.fillRect(58, 64, 12, 2);
    return done(THREE, c, false);
  }
  /* v16.1's cloths (the five lines, the nine spires, the twin tigers, the
     eight directions, 256 px each, glyphs as squiggles) are redrawn at v19.1
     as the three designs below. */
  /* Khom-style letters (the yant's script is Khom, not in any font a phone
     has): drawn strokes in a 10 x 10 box, y down — a looped head where the
     pen starts, arches, hooks and tails, the shapes of ห ส ม อ ข ร น ะ ๆ ช
     ย พ ท ถ ศ ง as the references write them. */
  const KHOM = [
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
  const KHOM_MARK = ['M3.6 0.9Q5 -0.5 6.4 0.9', 'M5 0.4m-0.6 0a0.6 0.6 0 1 1 1.2 0a0.6 0.6 0 1 1-1.2 0', 'M5.2 9.4Q6 10.6 4.8 11'];
  let khomP = null;
  /* one letter, size px square, centred on (cx, cy); `n` picks it */
  function khom(x, cx, cy, size, n, rot = 0) {
    if (!khomP) khomP = { g: KHOM.map(d => new Path2D(d)), m: KHOM_MARK.map(d => new Path2D(d)) };
    const j1 = ((Math.abs(n) * 37) % 11 - 5) / 5, j2 = ((Math.abs(n) * 53) % 7 - 3) / 3;   // a hand's wobble, the same every load
    const k = size / 10 * (1 + j2 * 0.07);
    x.save(); x.translate(cx, cy); x.rotate(rot + j1 * 0.09); x.scale(k, k); x.translate(-5, -5);
    x.lineWidth = 1.15; x.lineCap = 'round'; x.lineJoin = 'round';
    x.stroke(khomP.g[Math.abs(n) % KHOM.length]);
    const mk = Math.abs(n * 7 + 3) % 9;
    if (mk < KHOM_MARK.length) x.stroke(khomP.m[mk]);
    x.restore();
  }
  /* letters along a straight run, left to right */
  function khomRow(x, x0, x1, y, size, seed) {
    const n = Math.max(1, Math.floor((x1 - x0) / (size * 0.92)));
    const step = (x1 - x0) / n;
    for (let i = 0; i < n; i++) khom(x, x0 + step * (i + 0.5), y, size, seed + i * 5);
  }
  /* THE UNALOME — the path to enlightenment: a curl at its root (the
     tangle of life), switchbacks narrowing as it rises (the way), then the
     straight line (release). Root at (bx, by), rising h px (h < 0: it hangs
     DOWN, as the Hah Taew's lower ones do); w is the curl's width. */
  function unalome(x, bx, by, h, w) {
    const up = h >= 0 ? 1 : -1, H = Math.abs(h);
    x.save(); x.translate(bx, by); x.scale(1, -up);              // local frame: +y is "up" the spire
    x.lineCap = 'round'; x.lineJoin = 'round';
    // the root: a spiral of 1.6 turns opening out, its centre over the root
    const r0 = w * 0.32;
    x.beginPath();
    for (let i = 0; i <= 40; i++) {
      const t = i / 40, a = -Math.PI / 2 + t * Math.PI * 2 * 1.6, rr = r0 * (0.25 + 0.75 * t);
      const px = Math.cos(a) * rr, py = r0 + Math.sin(a) * rr;
      i ? x.lineTo(px, py) : x.moveTo(px, py);
    }
    // the switchbacks
    let y = r0 * 2.1; const zz = 5;
    for (let i = 0; i < zz; i++) {
      const a = (w / 2) * (1 - i / (zz + 1)), dy = w * 0.36 * (1 - i * 0.08);
      const sx = i % 2 ? -1 : 1;
      x.quadraticCurveTo(sx * a * 1.25, y + dy * 0.2, sx * a * 0.2, y + dy * 0.75);
      x.quadraticCurveTo(-sx * a * 0.6, y + dy * 0.95, 0, y + dy);
      y += dy;
    }
    x.lineTo(0, Math.max(y + w * 0.3, H));
    x.stroke();
    x.restore();
  }
  /* the three ovals — the Triple Gem — stacked, standing on (cx, by), w wide */
  function ovals(x, cx, by, w) {
    const r1 = w * 0.13, r2 = w * 0.12, r3 = w * 0.12;
    x.beginPath(); x.ellipse(cx, by - r1, w / 2, r1, 0, 0, Math.PI * 2); x.stroke();
    x.beginPath(); x.ellipse(cx, by - r1 * 2 - r2, w * 0.34, r2, 0, 0, Math.PI * 2); x.stroke();
    x.beginPath(); x.arc(cx, by - r1 * 2 - r2 * 2 - r3, r3, 0, Math.PI * 2); x.stroke();
    return by - r1 * 2 - r2 * 2 - r3 * 2;                       // the top of the stack
  }
  /* a curl at the end of a rule, as the yant's baselines end */
  function curl(x, ex, ey, dir, s) {
    x.beginPath(); x.moveTo(ex, ey);
    x.quadraticCurveTo(ex + dir * s * 1.2, ey, ex + dir * s * 1.1, ey + s * 0.6);
    x.quadraticCurveTo(ex + dir * s * 0.9, ey + s * 1.0, ex + dir * s * 0.55, ey + s * 0.7);
    x.stroke();
  }
  /* v19.1 · THE YANT CLOTHS (pha yant), redrawn from the three designs Chad
     gave (bkktattoostudio13.com, saved at v17.7 — Chad: "all the yant
     posters around the room needs to be completely redrawn according to the
     yant designs i provided you before. they need to be accurate and
     representative of real sak yant designs"). Black ink on unbleached cloth
     with a red border, the master's seal, gold leaf pressed on by the
     devout, as the references carry it.
       'gao'  — YANT GAO YORD: a stepped pyramid of script cells, 9-7-5-3-1;
                on every step's outer corner the three ovals and an unalome —
                the nine peaks — the middle one the tallest; two lines of
                script under it, ending in curls.
       'hah'  — YANT HAH TAEW CHAT PETCH: five vertical rows of script, an
                unalome rising from the top of each and one hanging from the
                bottom, and the Chat Petch — the diamond net — crossing
                between the rows.
       'sroi' — YANT SROI SANGWAN: the necklace — three rows of script hung
                in a U, an unalome rising from both ends of every row, and the
                pendant at the front: a diamond with three unalomes over it.
     `aspect` is height / width; the design keeps its own proportions and is
     centred, with plain cloth round it. */
  function makeYantCloth(THREE, cnv, k, aspect) {
    const A = aspect || ({ gao: 0.84, hah: 1.6, sroi: 0.66 })[k] || 0.84;
    const W = k === 'hah' ? 560 : 900, H = Math.round(W * A), [c, x] = cnv(W); c.height = H;
    const r = rng(97 + ({ gao: 1, hah: 2, sroi: 3 })[k] * 31);
    x.fillStyle = '#efe6d2'; x.fillRect(0, 0, W, H);
    // the weave, and the cloth's age
    for (let y = 0; y < H; y += 3) { x.fillStyle = `rgba(120,100,70,${0.025 + r() * 0.03})`; x.fillRect(0, y, W, 1); }
    for (let xx = 0; xx < W; xx += 3) { x.fillStyle = `rgba(120,100,70,${0.02 + r() * 0.025})`; x.fillRect(xx, 0, 1, H); }
    const vg = x.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.3, W / 2, H / 2, Math.max(W, H) * 0.75);
    vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(110,80,40,0.16)');
    x.fillStyle = vg; x.fillRect(0, 0, W, H);
    const B = Math.round(Math.min(W, H) * 0.035);
    x.strokeStyle = '#9a1c14'; x.lineWidth = B; x.strokeRect(B, B, W - 2 * B, H - 2 * B);
    // the design's own box, fitted inside the border
    const DA = ({ gao: 0.84, hah: 1.6, sroi: 0.66 })[k];
    let dw = W - 6 * B, dh = dw * DA;
    if (dh > H - 6 * B) { dh = H - 6 * B; dw = dh / DA; }
    const ox = (W - dw) / 2, oy = (H - dh) / 2;
    x.strokeStyle = '#17110c'; x.fillStyle = '#17110c';
    const gold = [];
    if (k === 'gao') {
      /* the whole of it — five rows, the ovals, the tallest spire and two
         lines of script under — is 10.3 cells tall and 10.5 wide */
      const cw = Math.min(dw / 10.5, dh / 10.3), rows = [9, 7, 5, 3, 1], cx = ox + dw / 2, yb = oy + dh / 2 + cw * 2.95;
      x.lineWidth = Math.max(2.2, cw * 0.05);
      let seed = 3;
      rows.forEach((n, ri) => {
        const y1 = yb - ri * cw, y0 = y1 - cw, x0 = cx - n * cw / 2;
        x.strokeRect(x0, y0, n * cw, cw);
        for (let i = 1; i < n; i++) { x.beginPath(); x.moveTo(x0 + i * cw, y0); x.lineTo(x0 + i * cw, y1); x.stroke(); }
        for (let i = 0; i < n; i++) khom(x, x0 + (i + 0.5) * cw, y0 + cw * 0.5, cw * 0.66, seed++);
      });
      // the bottom rule runs out past the cells and curls under at both ends
      x.beginPath(); x.moveTo(cx - 4.5 * cw - cw * 0.35, yb); x.lineTo(cx + 4.5 * cw + cw * 0.35, yb); x.stroke();
      curl(x, cx - 4.5 * cw - cw * 0.35, yb, -1, cw * 0.3); curl(x, cx + 4.5 * cw + cw * 0.35, yb, 1, cw * 0.3);
      // the nine peaks: on each step's two outer cells, and the top cell
      rows.forEach((n, ri) => {
        const y0 = yb - (ri + 1) * cw, ends = n === 1 ? [cx] : [cx - (n - 1) * cw / 2, cx + (n - 1) * cw / 2];
        for (const ex of ends) {
          const top = ovals(x, ex, y0, cw * 0.8);
          unalome(x, ex, top, n === 1 ? cw * 2.4 : cw * 1.9, cw * 0.62);
        }
      });
      // two lines of script under it, the rules ending in curls
      for (let j = 0; j < 2; j++) {
        const y = yb + cw * (0.62 + j * 0.78), half = cw * (4.9 - j * 0.6);
        khomRow(x, cx - half, cx + half, y, cw * 0.6, 40 + j * 17);
        x.beginPath(); x.moveTo(cx - half - cw * 0.5, y + cw * 0.36); x.lineTo(cx + half + cw * 0.5, y + cw * 0.36); x.stroke();
        curl(x, cx - half - cw * 0.5, y + cw * 0.36, -1, cw * 0.22); curl(x, cx + half + cw * 0.5, y + cw * 0.36, 1, cw * 0.22);
      }
      gold.push([cx - cw * 0.2, yb - cw * 1.4, cw * 0.9, 0.22]);
    } else if (k === 'hah') {
      const cols = 5, gap = dw / 5.4, x0 = ox + dw / 2 - gap * 2, top = oy + dh * 0.215, bot = oy + dh * 0.79, nr = 8;
      const ch = (bot - top) / nr, gs = Math.min(gap * 0.62, ch * 0.82);
      x.lineWidth = Math.max(2.0, gs * 0.095);
      for (let ci = 0; ci < cols; ci++) {
        const gx = x0 + ci * gap;
        unalome(x, gx, top - ch * 0.15, top - ch * 0.15 - (oy + dh * 0.01), gs * 0.72);
        unalome(x, gx, bot + ch * 0.15, -((oy + dh * 0.99) - (bot + ch * 0.15)), gs * 0.72);
        for (let j = 0; j < nr; j++) khom(x, gx, top + (j + 0.5) * ch, gs, ci * 11 + j * 3 + 1);
      }
      // the Chat Petch: a diamond net crossing between the rows, between the letters
      x.lineWidth = Math.max(1.8, gs * 0.07);
      for (let ci = 0; ci < cols - 1; ci++) {
        const a = x0 + ci * gap + gs * 0.42, b = x0 + (ci + 1) * gap - gs * 0.42;
        for (let j = 0; j < nr - 1; j++) {
          const ya = top + (j + 0.5) * ch + ch * 0.12, yb = top + (j + 1.5) * ch - ch * 0.12;
          x.beginPath(); x.moveTo(a, ya); x.lineTo(b, yb); x.moveTo(b, ya); x.lineTo(a, yb); x.stroke();
        }
      }
    } else {
      // three rows hung in a U, from the upper corners down to the front
      const cx = ox + dw / 2, rows = 3, s = dh * 0.072;
      const arc = (j, t) => {                       // t 0..1 along the row; j 0 outer .. 2 inner
        const hw = dw * (0.43 - j * 0.055), y0 = oy + dh * (0.25 + j * 0.02), y1 = oy + dh * (0.80 - j * 0.105);
        const a = Math.PI * (1 - t);                // from the left end round the bottom to the right
        return [cx + Math.cos(a) * hw, y0 + Math.sin(a) * (y1 - y0) * 1];
      };
      x.lineWidth = Math.max(2.0, s * 0.1);
      for (let j = 0; j < rows; j++) {
        const n = 34 - j * 6;
        for (let i = 0; i < n; i++) {
          const t = (i + 0.5) / n;
          if (Math.abs(t - 0.5) < [0.035, 0.06, 0.1][j]) continue;        // every row breaks round the pendant and its spires
          const [px, py] = arc(j, t), [qx, qy] = arc(j, Math.min(1, t + 0.01));
          khom(x, px, py, s, j * 13 + i * 3 + 2, Math.atan2(qy - py, qx - px));
        }
        // an unalome rising from each end of the row
        const [lx, ly] = arc(j, 0), [rx, ry] = arc(j, 1);
        unalome(x, lx, ly - s * 0.55, (ly - s * 0.55) - (oy + dh * 0.02 + j * s * 0.3), s * 0.55);
        unalome(x, rx, ry - s * 0.55, (ry - s * 0.55) - (oy + dh * 0.02 + j * s * 0.3), s * 0.55);
      }
      // the pendant: a diamond with an eye in it, three unalomes over it
      const [px, py] = arc(1, 0.5), d = s * 1.2;
      x.lineWidth = Math.max(2.2, s * 0.12);
      x.beginPath(); x.moveTo(px, py - d); x.lineTo(px + d * 0.8, py); x.lineTo(px, py + d); x.lineTo(px - d * 0.8, py); x.closePath(); x.stroke();
      x.beginPath(); x.moveTo(px, py - d * 0.55); x.lineTo(px + d * 0.42, py); x.lineTo(px, py + d * 0.55); x.lineTo(px - d * 0.42, py); x.closePath(); x.stroke();
      x.beginPath(); x.arc(px, py, d * 0.13, 0, Math.PI * 2); x.fill();
      x.lineWidth = Math.max(1.9, s * 0.095);
      unalome(x, px, py - d * 1.05, d * 3.4, s * 0.5);
      unalome(x, px - d * 0.62, py - d * 0.55, d * 2.5, s * 0.42);
      unalome(x, px + d * 0.62, py - d * 0.55, d * 2.5, s * 0.42);
      gold.push([px + d * 0.1, py + d * 0.05, d * 1.05, -0.3]);
    }
    // gold leaf, pressed on by the devout (the references carry it too)
    for (const [gx, gy, gs, rot] of gold) {
      x.save(); x.translate(gx, gy); x.rotate(rot);
      const gg = x.createLinearGradient(-gs / 2, -gs / 2, gs / 2, gs / 2);
      gg.addColorStop(0, 'rgba(214,170,78,0.92)'); gg.addColorStop(0.45, 'rgba(240,206,120,0.95)'); gg.addColorStop(1, 'rgba(176,132,52,0.92)');
      x.fillStyle = gg; x.fillRect(-gs / 2, -gs / 2, gs, gs);
      x.restore();
    }
    // the master's seal in a corner
    const sx = W - 3.4 * B, sy = H - 3.4 * B;
    x.fillStyle = 'rgba(160,30,20,0.85)'; x.beginPath(); x.arc(sx, sy, B * 1.1, 0, Math.PI * 2); x.fill();
    x.strokeStyle = 'rgba(239,230,210,0.9)'; x.lineWidth = B * 0.16; x.beginPath(); x.arc(sx, sy, B * 0.8, 0, Math.PI * 2); x.stroke();
    return done(THREE, c, false);
  }
  /* the dawn through the room's window, seen between the shutters: sky, the
     wat's wall and a tree beyond it, painted at half its brightness (ACES) */
  function makeDawnSlats(THREE, cnv) {
    const S = 128, [c, x] = cnv(S);
    const g = x.createLinearGradient(0, 0, 0, S); g.addColorStop(0, '#9fb4c6'); g.addColorStop(0.55, '#e8c8a0'); g.addColorStop(1, '#f2d2a6');
    x.fillStyle = g; x.fillRect(0, 0, S, S);
    x.fillStyle = '#c9c2b2'; x.fillRect(0, 96, S, 14);
    x.fillStyle = '#7a3a26'; x.fillRect(0, 92, S, 5);
    x.fillStyle = '#4c5a38';
    for (let i = 0; i < 26; i++) { x.beginPath(); x.arc(70 + Math.sin(i * 2.1) * 34, 40 + Math.cos(i * 1.7) * 26, 10 + (i % 4) * 3, 0, Math.PI * 2); x.fill(); }
    x.fillRect(66, 60, 8, 36);
    return done(THREE, c, false);
  }
  function makeSignTex(THREE, cnv, text, bg, fg, aspect) {
    const S = 512, [c, x] = cnv(S);
    x.fillStyle = bg; x.fillRect(0, 0, S, S);
    x.save(); x.scale(1, aspect);
    const H = S / aspect;
    x.strokeStyle = fg; x.lineWidth = Math.max(2, H * 0.05); x.strokeRect(H * 0.08, H * 0.08, S - H * 0.16, H - H * 0.16);
    let px = Math.floor(H * 0.5); x.font = 'bold ' + px + 'px sans-serif';
    while (x.measureText(text).width > S * 0.88 && px > 6) { px -= 2; x.font = 'bold ' + px + 'px sans-serif'; }
    x.fillStyle = fg; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(text, S / 2, H * 0.54);
    x.restore();
    return done(THREE, c, false);
  }
  function makeShoeSign(THREE, cnv) {
    const S = 512, [c, x] = cnv(S);
    x.fillStyle = '#f4efe2'; x.fillRect(0, 0, S, S);
    x.save(); x.scale(1, 1.8);
    x.fillStyle = '#8a1a12'; x.font = 'bold 44px sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.fillText('PLEASE REMOVE', S / 2, 56); x.fillText('YOUR SHOES', S / 2, 104);
    // a shoe with a line through it
    x.strokeStyle = '#8a1a12'; x.lineWidth = 8;
    x.beginPath(); x.ellipse(S / 2, 196, 70, 26, 0, 0, Math.PI * 2); x.stroke();
    x.beginPath(); x.moveTo(S / 2 - 90, 240); x.lineTo(S / 2 + 90, 150); x.stroke();
    x.restore();
    return done(THREE, c, false);
  }
  function makeStripes(THREE, cnv) {
    const S = 256, [c, x] = cnv(S);
    for (let i = 0; i < 8; i++) { x.fillStyle = i % 2 ? '#f2ece0' : '#b8261c'; x.fillRect(i * 32, 0, 32, S); }
    x.fillStyle = 'rgba(0,0,0,0.12)'; x.fillRect(0, S - 20, S, 20);
    return done(THREE, c, false);
  }
  function makePriceBoard(THREE, cnv) {
    const S = 256, [c, x] = cnv(S);
    x.fillStyle = '#1f2a22'; x.fillRect(0, 0, S, S);
    x.save(); x.scale(1, 1.47);
    x.fillStyle = '#f2ecd6'; x.font = 'bold 26px sans-serif'; x.textAlign = 'center';
    /* v18.8 (Chad: "The label at the booth should say Sangkathan set ...
       Update the price to be more realistic for such a set"): a bucket set
       of robe and necessities for the Sangha runs about 299-599 baht */
    x.font = 'bold 24px sans-serif';
    x.fillText('SANGKATHAN SET', S / 2, 36);
    x.font = '19px sans-serif';
    x.fillText('Robe · Tea · Soap · Candles', S / 2, 72);
    x.fillStyle = '#f6c228'; x.font = 'bold 40px sans-serif'; x.fillText('฿ 399', S / 2, 128);
    x.restore();
    return done(THREE, c, false);
  }
  function makeUboWindow(THREE, cnv) {
    const S = 256, [c, x] = cnv(S);
    x.fillStyle = '#efe8da'; x.fillRect(0, 0, S, S);
    // a tall window with a pointed gilded crown above it, red shutters open
    x.fillStyle = '#d9a63c';
    x.beginPath(); x.moveTo(40, 80); x.lineTo(128, 6); x.lineTo(216, 80); x.closePath(); x.fill();
    x.fillStyle = '#b8862c'; x.beginPath(); x.moveTo(62, 76); x.lineTo(128, 24); x.lineTo(194, 76); x.closePath(); x.fill();
    x.fillStyle = '#d9a63c'; x.fillRect(58, 80, 140, 172);
    x.fillStyle = '#1a1210'; x.fillRect(74, 94, 108, 150);
    x.fillStyle = '#3e1a12'; x.fillRect(34, 94, 38, 150); x.fillRect(184, 94, 38, 150);
    x.strokeStyle = '#d9a63c'; x.lineWidth = 3; x.strokeRect(38, 100, 30, 138); x.strokeRect(188, 100, 30, 138);
    return done(THREE, c, false);
  }
  /* ---- v16.4 · the wat, dressed ---- */
  /* the sala's ceiling: plain, pale teak boards (Chad: "simple and clean") */
  /* ---- v16.9 · THE TEMPLE'S MATERIALS ----
     The model has no UVs and no maps: one material per PART (v17.0 — the
     column, beam, gable screen, bargeboard, mosaic layer, roof, wall, frame,
     rail, base and carving pieces, named by masters/v16.9/temple/relabel.mjs;
     COLOR_0 is AO and the distances from the piece's top and bottom), and a
     pattern per part
     drawn in the shader in the MODEL's own units (vMP: the file is placed at
     x = mx·0.2, y = (my − 21.15)·0.2, z = (mz + 9.5)·0.2, so the shader
     undoes that; the patterns were tuned in model units in the refinement
     viewer, masters/v16.8/temple/tmats.js). Inside the hall, Chad's
     standing rulings: the plain pale teak ceiling (v16.4 — "the star
     pattern ... too much"), no mural (v16.4 — "it looks bad"); a lacquered
     red wainscot with a gold rule, limewash above, a red-and-gold frieze
     under the ceiling, the teak floor and the runner to the altar.
     Each class its own customProgramCacheKey: three keys its program cache
     on the onBeforeCompile SOURCE, the same text for every class here, so
     without it every class would draw with the first class's pattern. */
  function templeMats(THREE) {
    const COMMON = `
varying vec3 vMP; varying vec3 vWN;
float h21(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float vnoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
  return mix(mix(h21(i), h21(i+vec2(1,0)), f.x), mix(h21(i+vec2(0,1)), h21(i+vec2(1,1)), f.x), f.y); }
float fbm(vec2 p){ float a = 0.5, s = 0.0; for (int i = 0; i < 4; i++) { s += a * vnoise(p); p *= 2.03; a *= 0.5; } return s; }
float tH = 0.0; float tHk = 0.0; float gAmt = 0.0; float lAmt = 0.0;
vec3 bumpN(vec3 sp, vec3 sn, float h, float k){
  vec3 sx = dFdx(sp), sy = dFdy(sp); vec3 r1 = cross(sy, sn), r2 = cross(sn, sx);
  float det = dot(sx, r1); vec2 dh = vec2(dFdx(h), dFdy(h)) * k;
  vec3 g = sign(det) * (dh.x * r1 + dh.y * r2); return normalize(abs(det) * sn - g); }
bool inHall(vec3 p){ return p.x > -27.3 && p.x < 26.6 && p.z < -23.1 && p.z > -80.2 && p.y > 32.0; }
vec2 tri(vec3 p, vec3 n){ vec3 a = abs(n); return a.y > max(a.x, a.z) ? p.xz : (a.x > a.z ? p.zy : p.xy); }
/* the palette, linear: gold leaf, red lacquer, limewash, pale teak */
const vec3 GOLD = vec3(0.80, 0.55, 0.16);
const vec3 LAC  = vec3(0.34, 0.05, 0.03);
const vec3 LIME = vec3(0.90, 0.86, 0.77);
float aaK(vec2 q){ return 1.0 - smoothstep(0.25, 0.6, max(fwidth(q.x), fwidth(q.y))); }
/* the lacquer stencil (lai kham): a diamond lattice with a rosette in each cell */
float stencil(vec2 q){ vec2 c = fract(q) - 0.5; float dia = abs(c.x) + abs(c.y);
  float line = 1.0 - smoothstep(0.035, 0.06, abs(dia - 0.5));
  float ros = 1.0 - smoothstep(0.10, 0.13, length(c));
  float petal = 1.0 - smoothstep(0.03, 0.05, abs(length(c) - 0.22) - 0.035 * cos(atan(c.y, c.x) * 8.0));
  float k = aaK(q); return max(max(line, ros), petal * 0.9) * k + 0.22 * (1.0 - k); }
vec3 gilt(vec2 q){ return GOLD * (0.84 + 0.26 * fbm(q * 0.9)); }
vec3 lacq(vec2 q){ return LAC * (0.9 + 0.14 * fbm(q * 1.7)); }
vec3 limew(vec2 q){ return LIME * (1.0 + fbm(q * 0.35) * 0.05 + fbm(vec2(q.x * 0.6, q.y * 0.05)) * 0.04); }
/* the floor: teak boards and the runner in the hall, stone slabs outside it */
vec3 floorCol(vec3 p){
  if (inHall(p)) {
    float pl = fract(p.x / 1.6); float seam = smoothstep(0.0, 0.04, pl) * smoothstep(0.0, 0.04, 1.0 - pl);
    float board = floor(p.x / 1.6), endj = fract(p.z / 9.0 + h21(vec2(board, 1.0)));
    float grain = fbm(vec2(p.x * 3.0, p.z * 0.3));
    vec3 teak = vec3(0.36, 0.20, 0.10) * (0.8 + 0.35 * grain) * (0.85 + 0.3 * h21(vec2(board, 2.0)));
    teak *= mix(0.6, 1.0, seam) * mix(0.7, 1.0, smoothstep(0.0, 0.01, endj));
    float run = step(abs(p.x - 0.75), 4.2), rb = step(3.7, abs(p.x - 0.75)) * run;
    return mix(teak, mix(vec3(0.46, 0.06, 0.05), GOLD, rb), run);
  }
  vec2 q = p.xz / 3.4; vec2 f = fract(q);
  float seam = smoothstep(0.0, 0.025, f.x) * smoothstep(0.0, 0.025, 1.0 - f.x) * smoothstep(0.0, 0.025, f.y) * smoothstep(0.0, 0.025, 1.0 - f.y);
  return vec3(0.80, 0.76, 0.68) * mix(0.72, 1.0, seam) * (0.88 + 0.16 * h21(floor(q))) * (0.94 + 0.1 * fbm(p.xz * 0.4));
}
/* the side windows in the model's (z, y): three a side, sill 41.1, head 52
   (the west middle one is the chapter's door); a signed distance */
float winSD(vec2 zy){
  vec2 q1 = abs(zy - vec2(-33.5, 46.55)) - vec2(3.5, 5.45);
  vec2 q2 = abs(zy - vec2(-51.5, 46.55)) - vec2(3.5, 5.45);
  vec2 q3 = abs(zy - vec2(-69.75, 46.55)) - vec2(3.75, 5.45);
  float d1 = length(max(q1, 0.0)) + min(max(q1.x, q1.y), 0.0);
  float d2 = length(max(q2, 0.0)) + min(max(q2.x, q2.y), 0.0);
  float d3 = length(max(q3, 0.0)) + min(max(q3.x, q3.y), 0.0);
  return min(d1, min(d2, d3)); }
/* the doors in the end walls, in the model's (x, y) */
float doorSD(vec2 xy){ vec2 q = abs(xy - vec2(0.75, 41.45)) - vec2(4.25, 8.05); return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0); }
/* a frame round an opening: gold, a red line, gold (0 at the opening's edge) */
vec3 frameCol(float d, vec2 q, float w){ float t = d / w;
  float g = 1.0 - step(0.30, t) * step(t, 0.62); gAmt = g; lAmt = 1.0 - g;
  return g > 0.5 ? gilt(q) : lacq(q); }
`;
    const PAT = {
      /* the twelve columns: a limewashed shaft, a gilded lotus capital (the top
         3.25 units, where the radius flares 1.46 -> 1.85), a lacquer band with
         the gold stencil under it, and a gold foot */
      column: `
        vec2 q = vec2(abs(n.x) > abs(n.z) ? vMP.z : vMP.x, vMP.y);
        /* v17.1, Chad: first "The pillars should be red all over", then, on
           seeing it, "better for the pillar to be white instead of red, now it
           looks like a chinese temple". White limewash, gold only: the gilt
           lotus capital, a gold ring, a band of gold stencil on the white, a
           gold rule, a gold line over the gilt foot — no red on a pillar. */
        c = limew(q); aok = 0.4;
        if (dT < 3.25) { float pet = smoothstep(0.30, 0.45, abs(fract(q.x / 0.95) - 0.5)); c = gilt(q) * mix(1.0, 0.72, pet); gAmt = 1.0; }
        else if (dT < 3.6) { c = gilt(q) * 0.8; gAmt = 1.0; }
        else if (dT < 7.0) { float s = stencil(vec2(q.x / 1.15, (dT - 3.6) / 1.15)); c = mix(limew(q), gilt(q), s); gAmt = s; }
        else if (dT < 7.4) { c = gilt(q); gAmt = 1.0; }
        if (dB < 0.7) { c = gilt(q); gAmt = 1.0; }
        else if (dB < 0.82) { c = gilt(q) * 0.85; gAmt = 1.0; }`,
      /* the brackets from the flank columns and the tie beams across the
         gables: red lacquer, the gold stencil on their faces, gilt arrises */
      beam: `
        vec2 q = tri(vMP, n);
        float s = abs(n.y) < 0.5 ? stencil(q / 1.3) : 0.0;
        c = mix(lacq(q), gilt(q), s); gAmt = s; lAmt = 1.0 - s;
        if (dT < 0.3 || dB < 0.3) { c = gilt(q); gAmt = 1.0; lAmt = 0.0; }`,
      /* the gable ends: the scalloped valance under the eaves gilt on red, the
         gable board above it red lacquer with the gold lattice; the back of
         the board (seen only from under the porch roof) plain lacquer */
      screen: `
        vec2 q = vec2(vMP.x, vMP.y);
        bool front = vMP.z > -50.0; bool face = front ? n.z > 0.3 : n.z < -0.3;
        if (abs(n.z) < 0.3) { c = gilt(q); gAmt = 1.0; }
        else if (!face) { c = lacq(q) * 0.8; lAmt = 1.0; }
        else if (vMP.y < 63.0) { float s = stencil(q / 1.5); c = mix(lacq(q), gilt(q), s); gAmt = s; lAmt = 1.0 - s; }
        else { float s = stencil(q / 3.0); c = mix(lacq(q), gilt(q), s); gAmt = s; lAmt = 1.0 - s; }`,
      /* the bargeboards: gilt on the face, lacquer behind */
      barge: `
        vec2 q = vec2(vMP.x + vMP.z, vMP.y);
        bool front = vMP.z > -50.0; bool face = front ? n.z > 0.3 : n.z < -0.3;
        if (face || abs(n.z) < 0.3) { c = gilt(q); gAmt = 1.0; } else { c = lacq(q) * 0.85; lAmt = 1.0; }`,
      /* the bargeboards' inner layer: glass mosaic (v17.3: gold, no green) */
      mosaic: `
        vec2 q = vec2(vMP.x, vMP.y) / 0.22; vec2 cell = floor(q); float hc = h21(cell);
        vec2 f = fract(q); float grout = smoothstep(0.0, 0.08, f.x) * smoothstep(0.0, 0.08, 1.0 - f.x) * smoothstep(0.0, 0.08, f.y) * smoothstep(0.0, 0.08, 1.0 - f.y);
        /* v17.1: one glass, small chips that vary only in tone — the gold and
           blue chips of v17.0 made a staircase of the bargeboard's diagonal */
        /* v17.3: gold glass, not green (Chad: "there is no green at thai temples") */
        vec3 glass = vec3(0.50, 0.32, 0.07) * (0.8 + 0.4 * hc);
        float k = aaK(q);
        c = mix(vec3(0.47, 0.30, 0.07), glass * mix(0.7, 1.0, grout), k); gAmt = 0.55; lAmt = 0.45;
        bool front = vMP.z > -50.0; bool face = front ? n.z > 0.3 : n.z < -0.3;
        if (!face) { c = lacq(q) * 0.85; gAmt = 0.0; lAmt = 1.0; }`,
      /* the roof: orange terracotta, two rows of red glaze along the eaves,
         a gold ridge; the underside teak boards; the tiers' fascias lacquer */
      roof: `
        if (n.y > 0.3) {
          float row = vMP.y / 0.95; float fr = fract(row);
          float col = (abs(n.x) > abs(n.z) ? vMP.z : vMP.x) / 1.25 + mod(floor(row), 2.0) * 0.5; float fc = fract(col);
          float tip = 0.30 * (1.0 - abs(fc - 0.5) * 2.0);
          float body = smoothstep(tip - 0.03, tip + 0.03, fr);
          float seam = smoothstep(0.0, 0.05, fc) * smoothstep(0.0, 0.05, 1.0 - fc);
          float tone = 0.82 + 0.22 * h21(floor(vec2(col, row)));
          float shade = mix(0.45, 1.0, body) * mix(0.75, 1.0, seam) * mix(1.12, 1.0, smoothstep(tip, tip + 0.18, fr));
          float aa = 1.0 - smoothstep(0.18, 0.45, max(fwidth(row), fwidth(col)));
          shade = mix(0.82, shade, aa); tone = mix(0.9, tone, aa);
          tH = (body * (0.35 + 0.65 * smoothstep(tip, 1.0, fr)) + (1.0 - seam) * -0.25) * aa; tHk = 0.9;
          vec3 tile = dB < 2.2 ? vec3(0.40, 0.07, 0.04) : vec3(0.62, 0.21, 0.06);   // v17.3: the eave rows red, not green
          c = tile * shade * tone * (0.9 + 0.2 * fbm(vMP.xz * 0.08));
          lAmt = dB < 2.2 ? 0.6 : 0.0;
          if (dT < 0.7) { c = gilt(vMP.xz); gAmt = 1.0; tHk = 0.0; }
        } else if (n.y < -0.3) {
          vec2 q = tri(vMP, n); float along = abs(n.x) > abs(n.z) ? q.x : q.y;
          float pl = fract(along / 1.3); float seam = smoothstep(0.0, 0.05, pl) * smoothstep(0.0, 0.05, 1.0 - pl);
          float grain = fbm(vec2(along * 0.6, (abs(n.x) > abs(n.z) ? q.y : q.x) * 6.0));
          c = vec3(0.30, 0.15, 0.07) * mix(0.55, 1.0, seam) * (0.82 + grain * 0.35) * (0.9 + 0.2 * h21(vec2(floor(along / 1.3), 3.0)));
        } else {
          vec2 q = tri(vMP, n); c = lacq(q); lAmt = 1.0;
          if (fract(vMP.y) < 0.18) { c = gilt(q); gAmt = 1.0; lAmt = 0.0; }
        }`,
      /* the walls: limewash outside with gilt window frames and a pointed
         lacquer crown over each window, the reveals red lacquer with a gold
         lip; inside, a lacquered wainscot with a gold rule, limewash, gilt
         frames round the windows and the doors, and the red-and-gold frieze
         under the ceiling; the ceiling plain pale teak (Chad, v16.4) */
      wall: `
        vec2 q = tri(vMP, n);
        bool hall = inHall(vMP);
        c = limew(q); aok = 0.35;
        tH = fbm(q * 2.2) * 0.5; tHk = 0.012;
        float wt = abs(abs(vMP.x + 0.37) - 27.27);
        /* v17.3: only INSIDE an opening — the open shutters stand out from the
           frame at this depth too, and painted as reveals they were the big gold
           wedges Chad found beside every window */
        bool reveal = wt < 0.83 && abs(n.x) < 0.5 && vMP.y > 39.4 && vMP.y < 54.8 && vMP.z < -23.1 && vMP.z > -80.2 && winSD(vec2(vMP.z, vMP.y)) < 0.25;
        if (n.y > 0.5 && vMP.y < 33.9) { c = floorCol(vMP); tHk = 0.0; }
        else if (wt < 0.9 && winSD(vec2(vMP.z, vMP.y)) < 0.0) {    // the mullion and anything else standing in an opening
          c = lacq(q); lAmt = 1.0; tHk = 0.0;
          if (abs(n.x) > 0.5 && wt > 0.55) { c = gilt(q); gAmt = 1.0; lAmt = 0.0; }
        } else if (reveal) {
          c = lacq(q); lAmt = 1.0; tHk = 0.0;
          if (wt > 0.62) { c = gilt(q); gAmt = 1.0; lAmt = 0.0; }
        } else if (hall && n.y < -0.5) {
          vec2 w = vMP.xz; float along = w.x;
          float grain = fbm(vec2(along * 0.6, w.y * 6.0));
          vec3 teak = vec3(0.86, 0.68, 0.47) * (0.86 + grain * 0.24) * (0.94 + 0.1 * h21(vec2(floor(along / 1.6), 5.0)));
          c = teak * mix(0.72, 1.0, smoothstep(0.0, 0.03, fract(along / 1.6)) * smoothstep(0.0, 0.03, 1.0 - fract(along / 1.6)));
          tHk = 0.0;
        } else if (hall && abs(n.y) < 0.5) {
          float y = vMP.y - 33.1;
          vec2 wq = vec2(abs(n.x) > abs(n.z) ? vMP.z : vMP.x, y);
          float fd = abs(n.x) > abs(n.z) ? winSD(vec2(vMP.z, vMP.y)) : doorSD(vec2(vMP.x, vMP.y));
          tHk = 0.0;
          if (y < 5.6) {
            c = lacq(wq); lAmt = 1.0;
            if (y > 5.1) { c = gilt(wq); gAmt = 1.0; lAmt = 0.0; }
            else if (y > 1.0 && y < 4.6) { float s = stencil(vec2(wq.x / 2.4, (y - 1.0) / 3.6)); c = mix(c, gilt(wq), s * 0.85); gAmt = s * 0.85; }
          } else if (y < 21.5) {
            c = LIME * (0.97 + fbm(wq * 0.35) * 0.05) * mix(1.0, 0.9, smoothstep(12.0, 21.5, y));
          } else {
            float s = stencil(wq / 2.2); c = mix(lacq(wq), gilt(wq), s); gAmt = s; lAmt = 1.0 - s;
            if (y < 22.0) { c = gilt(wq); gAmt = 1.0; lAmt = 0.0; }
          }
          if (fd > 0.0 && fd < 0.95) c = frameCol(fd, wq, 0.95);
        } else if (!hall && abs(n.y) < 0.5) {
          vec2 wq = vec2(abs(n.x) > abs(n.z) ? vMP.z : vMP.x, vMP.y);
          float fd = 9.0;
          if (abs(n.x) > abs(n.z) && abs(vMP.x) > 26.0) {
            fd = winSD(vec2(vMP.z, vMP.y));
            /* the crown: a pointed gable over each window */
            float zc = vMP.z > -42.5 ? -33.5 : vMP.z > -60.6 ? -51.5 : -69.75, hw = vMP.z > -60.6 ? 4.6 : 4.85;
            float yy = vMP.y - 52.95, w = hw * (1.0 - yy / 3.6), dz = abs(vMP.z - zc);
            if (yy > 0.0 && yy < 3.6 && dz < w) {
              float edge = min(w - dz, yy) * 1.0;
              if (edge < 0.38 || (yy > 3.0 && dz < 0.3)) { c = gilt(wq); gAmt = 1.0; }
              else { float s = stencil(vec2((vMP.z - zc) / 1.1, yy / 1.1)); c = mix(lacq(wq), gilt(wq), s); gAmt = s; lAmt = 1.0 - s; }
              tHk = 0.0;
            }
          } else if (abs(n.z) > 0.5 && (vMP.z > -25.0 || vMP.z < -78.0)) {
            fd = doorSD(vec2(vMP.x, vMP.y));
            /* v17.1: the end walls above the doors' carving — the white wedges
               Chad found between the gable's valances — red, the gold stencil */
            /* v17.3: the FRONT wall stays white (Chad: "a little overdone");
               the valances hanging over it keep their pattern */
            if (vMP.y > 50.5 && vMP.z < -78.0) { float s = stencil(wq / 1.6); c = mix(lacq(wq), gilt(wq), s); gAmt = s; lAmt = 1.0 - s; tHk = 0.0;
              if (vMP.y < 51.0) { c = gilt(wq); gAmt = 1.0; lAmt = 0.0; } }
          }
          if (fd > 0.0 && fd < 1.05) { c = frameCol(fd, wq, 1.05); tHk = 0.0; }
          /* the plinth band along the foot of the walls */
          if (vMP.y < 35.2 && vMP.y > 33.3) { c = vMP.y > 34.85 ? gilt(wq) : LIME * 0.86; gAmt = vMP.y > 34.85 ? 1.0 : 0.0; }
        } else if (n.y < -0.5) { c = lacq(q); lAmt = 1.0; tHk = 0.0; }`,
      /* the back door's surround and the west windows' frames: gilt, the depth lacquer */
      frame: `
        vec2 q = tri(vMP, n);
        if (abs(n.x) > 0.5 && abs(vMP.x) > 26.0) { float fd = winSD(vec2(vMP.z, vMP.y)); c = frameCol(max(fd, 0.0), vec2(vMP.z, vMP.y), 1.05); }
        else {                                               // the doors' surrounds, front and back (v17.1: gilt all over, like the back door's)
          float r = smoothstep(0.18, 0.40, ao); float g = mix(0.25, 1.0, r);
          c = mix(lacq(q), gilt(q) * (abs(n.z) > 0.5 ? 1.0 : 0.9), g); gAmt = g; lAmt = 1.0 - g;
        }`,
      /* the balustrade: limewashed balusters, a gilt capping, a stone foot */
      rail: `
        vec2 q = tri(vMP, n);
        c = limew(q); aok = 0.4;
        if (dT < 0.45) { c = gilt(q); gAmt = 1.0; }
        else if (dB < 0.4) { c = LIME * 0.8; }`,
      /* the base: stone courses, a lacquer band with a gold rule under the
         floor's edge, the floor and the paving on top */
      base: `
        vec2 q = tri(vMP, n);
        if (n.y > 0.5) { c = vMP.y > 33.3 ? floorCol(vMP) : vec3(0.78, 0.74, 0.66) * (0.88 + 0.16 * fbm(vMP.xz * 0.5)); }
        else {
          float course = smoothstep(0.0, 0.05, fract(q.y / 2.2)) * smoothstep(0.0, 0.05, 1.0 - fract(q.y / 2.2));
          c = vec3(0.86, 0.82, 0.74) * (0.9 + fbm(q * 0.5) * 0.14) * mix(0.82, 1.0, course);
          if (n.y > -0.5 && vMP.y > 31.9 && vMP.y < 33.45 && !inHall(vMP)) {
            c = (vMP.y > 33.05 || vMP.y < 32.15) ? gilt(q) : lacq(q); gAmt = (vMP.y > 33.05 || vMP.y < 32.15) ? 1.0 : 0.0; lAmt = 1.0 - gAmt;
          }
          if (inHall(vMP)) c = LAC * 0.9;
        }`,
      /* the carving: gilt where it stands proud, deep lacquer in its hollows
         with a chip of coloured glass here and there */
      carve: `
        float raised = smoothstep(0.16, 0.44, ao);
        vec3 cell = floor(vMP * 3.0); float hc = h21(cell.xy + cell.z * 7.13);
        vec3 glass = hc > 0.93 ? vec3(0.06, 0.34, 0.20) : hc > 0.87 ? vec3(0.07, 0.14, 0.44) : LAC;
        c = mix(glass * (0.7 + 1.2 * ao), gilt(vMP.xz + vMP.y * 0.3) * (0.9 + 0.2 * ao), raised);
        gAmt = raised; lAmt = 1.0 - raised; aok = 0.8;`,
    };
    const BASE = {
      column: { roughness: 0.9 }, beam: { roughness: 0.6 }, screen: { roughness: 0.6 }, barge: { roughness: 0.5 },
      mosaic: { roughness: 0.3 }, roof: { roughness: 0.62 }, wall: { roughness: 0.92 }, frame: { roughness: 0.5 },
      rail: { roughness: 0.9 }, base: { roughness: 0.93 }, carve: { roughness: 0.4, flatShading: true },
    };
    const out = {};
    for (const k of Object.keys(BASE)) {
      const m = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.0, ...BASE[k], vertexColors: true, side: THREE.DoubleSide });
      m.customProgramCacheKey = () => 'e3temple2_' + k;
      m.onBeforeCompile = sh => {
        sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vMP; varying vec3 vWN;')
          .replace('#include <worldpos_vertex>', `#include <worldpos_vertex>
            vMP = (modelMatrix * vec4(transformed, 1.0)).xyz * 5.0 + vec3(0.0, 21.15, -9.5);
            vWN = normalize(mat3(modelMatrix) * objectNormal + vec3(0.0, 1e-5, 0.0));`);
        sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\n' + COMMON)
          .replace('#include <color_fragment>', `
            /* COLOR_0 is (AO, the distance from the piece's top, from its bottom) / 25 — not a colour */
            float ao = vColor.r, dT = vColor.g * 25.0, dB = vColor.b * 25.0;
            /* v17.1: drawn two-sided (the bake turned some faces inward, and a
               one-sided face seen from behind is a hole), so the normal the
               patterns read is the one facing the viewer */
            vec3 n = gl_FrontFacing ? vWN : -vWN;
            ${k === 'carve' ? 'n = normalize(cross(dFdx(vMP), dFdy(vMP)));' : ''}
            vec3 c = LIME; float aok = 0.9;
            ${PAT[k]}
            c *= mix(1.0, ao * (0.4 + 0.6 * ao), aok);          // the baked occlusion, per part (a wall greys under a full dose)
            /* a hall is lit by its door and windows: a little dimmer and warmer than the day */
            if (inHall(vMP)) c *= vec3(0.86, 0.80, 0.72);
            diffuseColor.rgb = c;
            totalEmissiveRadiance += gAmt * vec3(0.125, 0.078, 0.013) * ao;`)
          .replace('#include <metalnessmap_fragment>', `#include <metalnessmap_fragment>
            metalnessFactor = mix(metalnessFactor, 0.4, gAmt);
            roughnessFactor = mix(mix(roughnessFactor, 0.36, lAmt), 0.32, gAmt);`)
          .replace('#include <normal_fragment_maps>', `#include <normal_fragment_maps>
            if (tHk > 0.0) normal = bumpN(-vViewPosition, normal, tH, tHk);`);
      };
      out[k] = m;
    }
    return out;
  }
  function makeCeilPlain(THREE, cnv) {
    const S = 256, [c, x] = cnv(S), r = rng(41);
    x.fillStyle = '#b08a60'; x.fillRect(0, 0, S, S);
    for (let i = 0; i < 900; i++) { x.fillStyle = `rgba(${120 + r() * 50},${85 + r() * 30},50,${r() * 0.08})`; x.fillRect(r() * S, r() * S, 1 + r() * 2, 8 + r() * 30); }
    for (let i = 0; i < S; i += 32) { x.fillStyle = 'rgba(90,60,35,0.35)'; x.fillRect(i, 0, 1, S); }
    return done(THREE, c, true);
  }
  /* v17.3: a texel whose green stands over its red and blue is turned to a
     deep gold of the same brightness; everything else is untouched */
  function ungreen(mat) {
    mat.userData.ungreen = true;
    mat.customProgramCacheKey = () => 'e3ungreen';
    mat.onBeforeCompile = sh => {
      sh.fragmentShader = sh.fragmentShader.replace('#include <map_fragment>', `#include <map_fragment>
        { vec3 cg = diffuseColor.rgb; float gx = cg.g - max(cg.r, cg.b);
          float lum = dot(cg, vec3(0.299, 0.587, 0.114));
          diffuseColor.rgb = mix(cg, vec3(1.0, 0.68, 0.20) * lum * 1.5, smoothstep(0.0, 0.06, gx)); }`);
    };
    mat.needsUpdate = true;
  }
  function makeMosaicGreen(THREE, cnv) {
    const S = 128, [c, x] = cnv(S), r = rng(83);
    const cols = ['#b07a22', '#c98f2c', '#9a6618', '#d9a63c', '#a87020'];   // v17.3: gold glass, not green
    for (let yy = 0; yy < S; yy += 4) for (let xx = 0; xx < S; xx += 4) {
      x.fillStyle = r() < 0.12 ? '#d9a63c' : cols[Math.floor(r() * cols.length)]; x.fillRect(xx, yy, 4, 4);
    }
    // gold scale arcs, the serpent's scales
    x.strokeStyle = '#e2b04a'; x.lineWidth = 2;
    for (let row = 0; row < 4; row++) for (let col = 0; col < 5; col++) { x.beginPath(); x.arc(col * 32 + (row % 2) * 16, row * 32 + 20, 14, Math.PI, Math.PI * 2); x.stroke(); }
    return done(THREE, c, true);
  }
  /* the gallery's backing: blue glass with a gold pointed niche behind each image */
  function makeNiches(THREE, cnv) {
    const [c, x] = cnv(64); c.width = 1024; c.height = 384; const r = rng(91);
    const glass = ['#1d3f6e', '#1f5a7a', '#1d6a6a', '#234f86'];
    for (let yy = 0; yy < 384; yy += 4) for (let xx = 0; xx < 1024; xx += 4) { x.fillStyle = glass[Math.floor(r() * 4)]; x.fillRect(xx, yy, 4, 4); }
    const n = 6, step = 1024 / n;
    for (let i = 0; i < n; i++) {
      const cx = step * (i + 0.5);
      x.fillStyle = 'rgba(20,30,50,0.55)'; x.beginPath(); x.moveTo(cx - 60, 384); x.lineTo(cx - 60, 170); x.quadraticCurveTo(cx - 60, 90, cx, 40); x.quadraticCurveTo(cx + 60, 90, cx + 60, 170); x.lineTo(cx + 60, 384); x.fill();
      x.strokeStyle = '#e2b04a'; x.lineWidth = 7; x.stroke();
      x.fillStyle = '#e2b04a'; x.beginPath(); x.moveTo(cx - 8, 44); x.lineTo(cx, 8); x.lineTo(cx + 8, 44); x.fill();
    }
    x.fillStyle = '#e2b04a'; x.fillRect(0, 0, 1024, 8);
    return done(THREE, c, false);
  }
  function makeSlabs(THREE, cnv) {
    const S = 256, [c, x] = cnv(S), r = rng(29);
    for (let j = 0; j < 2; j++) for (let i = 0; i < 2; i++) {
      const g = 208 + r() * 22; x.fillStyle = `rgb(${g},${g - 6},${g - 18})`; x.fillRect(i * 128, j * 128, 128, 128);
    }
    for (let k = 0; k < 2600; k++) { const g = 170 + r() * 70; x.fillStyle = `rgba(${g},${g - 6},${g - 20},0.35)`; x.fillRect(r() * S, r() * S, 2, 2); }
    x.strokeStyle = 'rgba(90,80,64,0.8)'; x.lineWidth = 3;
    for (let k = 0; k <= S; k += 128) { x.beginPath(); x.moveTo(k, 0); x.lineTo(k, S); x.stroke(); x.beginPath(); x.moveTo(0, k); x.lineTo(S, k); x.stroke(); }
    return done(THREE, c, true);
  }
  function makeShaftTex(THREE, cnv) {
    const S = 64, [c, x] = cnv(S), im = x.createImageData(S, S);
    for (let j = 0; j < S; j++) for (let i = 0; i < S; i++) {
      const u = (i + 0.5) / S, v = (j + 0.5) / S;
      const a = Math.pow(Math.sin(Math.PI * u), 2) * Math.pow(Math.sin(Math.PI * v), 1.2) * (0.55 + 0.45 * v);
      const o = (j * S + i) * 4; im.data[o] = im.data[o + 1] = im.data[o + 2] = 255; im.data[o + 3] = Math.round(a * 255);
    }
    x.putImageData(im, 0, 0);
    return done(THREE, c, false);
  }
  /* ---- the film's paint ---- */
  function makeSkyGrad(THREE, cnv, cols) {
    const S = 256, [c, x] = cnv(S);
    const g = x.createLinearGradient(0, 0, 0, S);
    g.addColorStop(0, cols[0]); g.addColorStop(0.45, cols[1]); g.addColorStop(0.55, cols[2]); g.addColorStop(1, cols[2]);
    x.fillStyle = g; x.fillRect(0, 0, S, S);
    const r = rng(21);
    for (let i = 0; i < 14; i++) {
      const cx = r() * S, cy = 40 + r() * 60;
      for (let k = 0; k < 6; k++) {
        const gr = x.createRadialGradient(cx + k * 9, cy + r() * 6, 1, cx + k * 9, cy, 14 + r() * 10);
        gr.addColorStop(0, 'rgba(255,255,255,0.55)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
        x.fillStyle = gr; x.fillRect(0, 0, S, S);
      }
    }
    return done(THREE, c, false);
  }
  function makeRoad(THREE, cnv) {
    const S = 128, [c, x] = cnv(S), r = rng(4);
    x.fillStyle = '#4c4e52'; x.fillRect(0, 0, S, S);
    for (let i = 0; i < 1200; i++) { const g = 60 + r() * 40; x.fillStyle = `rgba(${g},${g},${g + 3},0.6)`; x.fillRect(r() * S, r() * S, 1.5, 1.5); }
    x.fillStyle = '#e8e2c8'; x.fillRect(60, 0, 8, 56);
    x.fillStyle = '#e8e2c8'; x.fillRect(4, 0, 4, S); x.fillRect(S - 8, 0, 4, S);
    return done(THREE, c, true);
  }
  function makeLink(THREE, cnv) {
    const S = 128, [c, x] = cnv(S);
    x.clearRect(0, 0, S, S); x.strokeStyle = '#9aa0a4'; x.lineWidth = 2;
    for (let i = -12; i < 24; i++) {
      x.beginPath(); x.moveTo(i * 10.7, 0); x.lineTo(i * 10.7 + S, S); x.stroke();
      x.beginPath(); x.moveTo(i * 10.7, S); x.lineTo(i * 10.7 + S, 0); x.stroke();
    }
    x.fillStyle = '#7d8488'; x.fillRect(0, 0, S, 4);
    return done(THREE, c, true);
  }
  function makeCampFacade(THREE, cnv) {
    const S = 256, [c, x] = cnv(S);
    x.fillStyle = '#dcd5c0'; x.fillRect(0, 0, S, S);
    for (let f = 0; f < 3; f++) {
      x.fillStyle = '#8e9b74'; x.fillRect(0, f * 85 + 78, S, 7);
      for (let w = 0; w < 5; w++) { x.fillStyle = '#4d5257'; x.fillRect(12 + w * 50, f * 85 + 26, 30, 36); x.fillStyle = '#c9cfd2'; for (let l = 0; l < 5; l++) x.fillRect(14 + w * 50, f * 85 + 29 + l * 7, 26, 3); }
    }
    return done(THREE, c, false);
  }
  function makeSgFlag(THREE, cnv) {
    const S = 256, [c, ctx] = cnv(S), SG = '#ee2536';
    ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, S, S);
    ctx.fillStyle = SG; ctx.fillRect(0, 0, S, S / 2);
    const cy = S / 4, k = S / 384;
    ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(62 * k, cy, 42 * k, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = SG; ctx.beginPath(); ctx.arc(80 * k, cy, 35 * k, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 5; i++) {
      const a = -Math.PI / 2 + i * Math.PI * 2 / 5, sx = 110 * k + Math.cos(a) * 22 * k, sy = cy + Math.sin(a) * 22 * k;
      ctx.beginPath();
      for (let j = 0; j < 10; j++) { const rr = (j % 2 ? 4.6 : 10.5) * k, t = -Math.PI / 2 + j * Math.PI / 5; const px = sx + Math.cos(t) * rr, py = sy + Math.sin(t) * rr; j ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }
      ctx.closePath(); ctx.fill();
    }
    return done(THREE, c, false);
  }
  function makeCarpet(THREE, cnv) {
    const S = 128, [c, x] = cnv(S), r = rng(8);
    x.fillStyle = '#23283a'; x.fillRect(0, 0, S, S);
    for (let i = 0; i < 1500; i++) { const g = 26 + r() * 22; x.fillStyle = `rgba(${g},${g + 4},${g + 16},0.7)`; x.fillRect(r() * S, r() * S, 1.5, 1.5); }
    x.strokeStyle = 'rgba(10,12,18,0.6)'; x.strokeRect(0, 0, S, S);
    return done(THREE, c, true);
  }
  function makeCity(THREE, cnv) {
    const S = 1024, [c, x] = cnv(S), r = rng(17);
    const g = x.createLinearGradient(0, 0, 0, S); g.addColorStop(0, '#060912'); g.addColorStop(0.7, '#1a2140'); g.addColorStop(1, '#2c2a3a');
    x.fillStyle = g; x.fillRect(0, 0, S, S);
    // towers, far then near, with lit windows; a red aircraft light on each tall one
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
  function makeWareFloor(THREE, cnv) {
    const S = 256, [c, x] = cnv(S), r = rng(6);
    x.fillStyle = '#8d8a84'; x.fillRect(0, 0, S, S);
    for (let i = 0; i < 2400; i++) { const g = 120 + r() * 40; x.fillStyle = `rgba(${g},${g - 2},${g - 6},0.4)`; x.fillRect(r() * S, r() * S, 2, 2); }
    x.fillStyle = '#e8c23a'; x.fillRect(0, 120, S, 10);
    x.fillStyle = 'rgba(60,58,54,0.5)'; x.fillRect(0, 0, S, 2); x.fillRect(0, 0, 2, S);
    return done(THREE, c, true);
  }
  function makeRoller(THREE, cnv) {
    const S = 256, [c, x] = cnv(S);
    x.fillStyle = '#9aa1a6'; x.fillRect(0, 0, S, S);
    for (let y = 0; y < S; y += 10) { x.fillStyle = 'rgba(60,66,70,0.45)'; x.fillRect(0, y, S, 3); x.fillStyle = 'rgba(220,226,230,0.3)'; x.fillRect(0, y + 4, S, 2); }
    return done(THREE, c, false);
  }
  function makeDashBox(THREE, cnv) {
    const S = 256, [c, x] = cnv(S);
    x.fillStyle = '#b48c5c'; x.fillRect(0, 0, S, S);
    x.fillStyle = '#1b1f26'; x.fillRect(20, 40, S - 40, S - 80);
    x.fillStyle = '#f2b429'; x.font = 'bold 38px sans-serif'; x.textAlign = 'center'; x.fillText('ROADEYE', S / 2, 104);
    x.fillStyle = '#e8ecf2'; x.font = 'bold 22px sans-serif'; x.fillText('DASHCAM · 1080P', S / 2, 146);
    x.fillStyle = '#3a4a5c'; x.beginPath(); x.arc(S / 2, 186, 16, 0, Math.PI * 2); x.fill();
    x.fillStyle = '#8ab4ff'; x.beginPath(); x.arc(S / 2 + 4, 182, 5, 0, Math.PI * 2); x.fill();
    return done(THREE, c, false);
  }
  function makeDeskWood(THREE, cnv) {
    const S = 256, [c, x] = cnv(S), r = rng(12);
    x.fillStyle = '#3a2416'; x.fillRect(0, 0, S, S);
    for (let i = 0; i < 90; i++) { x.strokeStyle = `rgba(20,10,4,${0.1 + r() * 0.2})`; x.lineWidth = 1 + r() * 2; const y = r() * S; x.beginPath(); x.moveTo(0, y); x.bezierCurveTo(S / 3, y + r() * 10 - 5, 2 * S / 3, y + r() * 10 - 5, S, y); x.stroke(); }
    return done(THREE, c, false);
  }
  function makeLedger(THREE, cnv) {
    const S = 128, [c, x] = cnv(S);
    x.fillStyle = '#e9e2cc'; x.fillRect(0, 0, S, S);
    x.fillStyle = '#9a8a70'; for (let i = 0; i < 12; i++) x.fillRect(10, 12 + i * 9, 100 - (i % 3) * 20, 2);
    x.fillStyle = '#2a4a8a'; x.fillRect(80, 30, 30, 2); x.fillRect(80, 48, 36, 2);
    return done(THREE, c, false);
  }
  /* v19.0 · the sky outside the plane: a whole sphere's worth (u runs round,
     v from the zenith to the nadir, the horizon at the middle). Deep blue
     overhead, dawn on the horizon, the sun in it a little ahead of the wing,
     a sea of cloud below lit warm on its tops, and towers of cumulus standing
     out of it. Painted at about half the brightness it should read at (ACES
     at 1.42, v8.9). */
  function makePlaneSky(THREE, cnv) {
    const W = 2048, H = 1024, r = rng(41);
    const c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d');
    /* photographed: the first painting went lilac under ACES and the clouds
       were painted over the sun — so the colours are deeper and more
       saturated than they should read, the cloud towers keep clear of the
       sun's column, and the sun goes on LAST */
    const g = x.createLinearGradient(0, 0, 0, H);
    /* the blue comes down to ~8 degrees over the horizon: a window only
       sees about twenty degrees of sky, and at 0.40 none of it was blue */
    g.addColorStop(0, '#0a2a66'); g.addColorStop(0.3, '#17478f'); g.addColorStop(0.44, '#3c76b8');
    g.addColorStop(0.475, '#c98a62'); g.addColorStop(0.5, '#eea66a'); g.addColorStop(0.53, '#e2c2a6');
    g.addColorStop(0.65, '#b9b4c4'); g.addColorStop(1, '#7f88a2');
    x.fillStyle = g; x.fillRect(0, 0, W, H);
    const sx = W * 0.475, sy = H * 0.465;   // ~9 degrees ahead of square-on, ~6 up: inside his window where the push-in ends
    // the dawn's warmth along the horizon, strongest under the sun
    const hz = x.createRadialGradient(sx, H * 0.5, 10, sx, H * 0.5, W * 0.45);
    hz.addColorStop(0, 'rgba(255,170,90,0.55)'); hz.addColorStop(1, 'rgba(255,150,80,0)');
    x.fillStyle = hz; x.fillRect(0, H * 0.3, W, H * 0.4);
    const puff = (cx, cy, rr, lit) => {
      const gr = x.createRadialGradient(cx - rr * 0.25, cy - rr * 0.35, rr * 0.1, cx, cy, rr);
      // a lit top, a shadowed lavender underside — the shape is in the shading
      gr.addColorStop(0, `rgba(255,${238 - (1 - lit) * 30},${214 - (1 - lit) * 40},0.92)`);
      gr.addColorStop(0.55, `rgba(${198 - (1 - lit) * 40},${190 - (1 - lit) * 36},${206 - (1 - lit) * 14},0.66)`);
      gr.addColorStop(1, 'rgba(130,136,170,0)');
      x.fillStyle = gr; x.fillRect(cx - rr, cy - rr, rr * 2, rr * 2);
    };
    // towers of cumulus standing up out of the sea, lit on the sun's side — never in the sun's own column
    for (let k = 0; k < 16; k++) {
      let cx = r() * W; if (Math.abs(cx - sx) < 220) cx += cx < sx ? -220 : 220;
      const base = H * 0.515, hgt = 40 + r() * 100, wide = 70 + r() * 130;
      const lit = 1 - Math.min(1, Math.abs(cx - sx) / (W * 0.4));
      for (let j = 0; j < 24; j++) {
        const t = r(), px = cx + (r() - 0.5) * wide * (1.1 - t * 0.6), py = base - t * hgt;
        puff(px, py, 18 + r() * 26 * (1 - t * 0.5), lit);
      }
    }
    // the cloud sea: rows of soft puffs, bigger as they come nearer (down the sphere)
    for (let row = 0; row < 12; row++) {
      const y = H * 0.512 + Math.pow(row / 11, 1.6) * H * 0.42, n = 70 + row * 6, rr0 = 14 + row * 9;
      for (let i = 0; i < n; i++) {
        const cx = r() * W, lit = 1 - Math.min(1, Math.abs(cx - sx) / (W * 0.45));
        puff(cx, y + (r() - 0.5) * 18, rr0 + r() * rr0 * 0.8, lit * (1 - row / 16));
      }
    }
    // a few high wisps
    x.globalAlpha = 0.18;
    for (let i = 0; i < 30; i++) { let cx = r() * W; if (Math.abs(cx - sx) < 160) continue; puff(cx, H * (0.22 + r() * 0.16), 30 + r() * 50, 0.8); }
    x.globalAlpha = 1;
    // a light ACES allowance (v8.9), lighter than the first pass's
    x.fillStyle = 'rgba(16,14,30,0.34)'; x.fillRect(0, 0, W, H);
    // THE SUN, last: a modest bloom, a bright ring, a white core (a 520 px bloom whited the window out)
    for (const [rad, a] of [[300, 0.16], [140, 0.4], [60, 0.8], [30, 1]]) {
      const sg = x.createRadialGradient(sx, sy, 2, sx, sy, rad);
      sg.addColorStop(0, `rgba(255,250,232,${a})`); sg.addColorStop(0.4, `rgba(255,226,170,${a * 0.6})`); sg.addColorStop(1, 'rgba(255,200,140,0)');
      x.fillStyle = sg; x.fillRect(0, 0, W, H);
    }
    x.fillStyle = '#fffbef'; x.beginPath(); x.arc(sx, sy, 20, 0, Math.PI * 2); x.fill();
    return done(THREE, c, false);
  }
  /* v19.0 · light oak for the camera table, a lamp's pool for its top, and the
     wing's skin: the dawn on its leading edge, darkening to the flaps */
  function makeOak(THREE, cnv) {
    const S = 512, [c, x] = cnv(S), r = rng(44);
    x.fillStyle = '#b98d5e'; x.fillRect(0, 0, S, S);
    for (let i = 0; i < 160; i++) {
      x.strokeStyle = `rgba(${90 + r() * 30},${60 + r() * 20},${34 + r() * 14},${0.12 + r() * 0.2})`; x.lineWidth = 0.8 + r() * 2.2;
      const y = r() * S; x.beginPath(); x.moveTo(0, y); x.bezierCurveTo(S / 3, y + r() * 16 - 8, 2 * S / 3, y + r() * 16 - 8, S, y + r() * 8 - 4); x.stroke();
    }
    for (let k = 0; k < 5; k++) { const y = r() * S; x.fillStyle = 'rgba(70,46,26,0.25)'; x.fillRect(0, y, S, 1); }
    return done(THREE, c, false);
  }
  function makePool(THREE, cnv) {
    const S = 256, [c, x] = cnv(S);
    const g = x.createRadialGradient(S * 0.5, S * 0.5, 4, S * 0.5, S * 0.5, S * 0.5);
    g.addColorStop(0, 'rgba(255,196,128,0.7)'); g.addColorStop(0.5, 'rgba(255,170,100,0.28)'); g.addColorStop(1, 'rgba(255,150,80,0)');
    x.fillStyle = g; x.fillRect(0, 0, S, S);
    return done(THREE, c, false);
  }
  function makeWing(THREE, cnv) {
    const S = 512, [c, x] = cnv(S);
    // v runs from the trailing edge (bottom of the canvas) to the leading edge (top)
    const g = x.createLinearGradient(0, S, 0, 0);
    g.addColorStop(0, '#3c4148'); g.addColorStop(0.55, '#7d838c'); g.addColorStop(0.9, '#c8b8a6'); g.addColorStop(1, '#e8d2b8');
    x.fillStyle = g; x.fillRect(0, 0, S, S);
    // the flap and aileron lines along the trailing edge, a few panel seams
    x.strokeStyle = 'rgba(30,32,36,0.55)'; x.lineWidth = 2;
    x.beginPath(); x.moveTo(0, S * 0.78); x.lineTo(S, S * 0.70); x.stroke();
    for (let i = 1; i < 6; i++) { x.beginPath(); x.moveTo(i * S / 6, S * 0.78 - i * 1.3); x.lineTo(i * S / 6 + 6, S); x.stroke(); }
    x.strokeStyle = 'rgba(40,44,50,0.25)'; x.lineWidth = 1;
    for (let i = 1; i < 9; i++) { x.beginPath(); x.moveTo(i * S / 9, 0); x.lineTo(i * S / 9 + 20, S * 0.7); x.stroke(); }
    // painted at half what it reads at (ACES, v8.9)
    x.fillStyle = 'rgba(20,18,24,0.30)'; x.fillRect(0, 0, S, S);
    return done(THREE, c, false);
  }
  function makeCloudSea(THREE, cnv) {
    const S = 1024, [c, x] = cnv(S), r = rng(29);
    const g = x.createLinearGradient(0, 0, 0, S);
    g.addColorStop(0, '#34507e'); g.addColorStop(0.35, '#b98fa3'); g.addColorStop(0.5, '#f4b98a'); g.addColorStop(0.56, '#fbe0b8');
    g.addColorStop(0.6, '#e8c4b4'); g.addColorStop(1, '#8f8aa2');
    x.fillStyle = g; x.fillRect(0, 0, S, S);
    // the sun just above the cloud line
    const sg = x.createRadialGradient(S * 0.62, S * 0.53, 4, S * 0.62, S * 0.53, 180);
    sg.addColorStop(0, 'rgba(255,248,220,1)'); sg.addColorStop(0.15, 'rgba(255,230,170,0.8)'); sg.addColorStop(1, 'rgba(255,200,140,0)');
    x.fillStyle = sg; x.fillRect(0, 0, S, S);
    // the cloud sea: rows of soft puffs, lit pink on top
    for (let row = 0; row < 7; row++) {
      const y = S * 0.58 + row * 60, n = 30 + row * 8;
      for (let i = 0; i < n; i++) {
        const cx = r() * S, rr = 30 + row * 14 + r() * 30;
        const gr = x.createRadialGradient(cx, y - rr * 0.3, 2, cx, y, rr);
        gr.addColorStop(0, `rgba(255,${226 - row * 10},${214 - row * 12},0.9)`); gr.addColorStop(1, 'rgba(200,180,200,0)');
        x.fillStyle = gr; x.fillRect(cx - rr, y - rr, rr * 2, rr * 2);
      }
    }
    // painted at half the brightness it should read at (ACES at 1.42, v8.9)
    x.fillStyle = 'rgba(28,20,40,0.42)'; x.fillRect(0, 0, S, S);
    return done(THREE, c, false);
  }

  /* ============================================================== THE FILM
     ~62 s, his own voice over five memories and then the wat: the camp gate
     the day he left NS, the office at night, the warehouse of his own boxes,
     the desk and the amulet by one candle, the plane window at dawn — and the
     temple gate, walked through, to where play begins. Each memory is cut to
     the next through a short dip to black. `e3film` runs under the whole of
     it and turns Thai as he arrives. */
  function intro(c, s, api) {
    const { step, sfx, fade, camTo, yawTo, pitchTo, faceFrom, rawK, smoothK, stage, armR, tr } = api;
    const F = stage.film, P = F.P;
    const at = (o, x, y, z) => ({ x: o.x + x, y, z: o.z + z });

    step(0, () => { armR.visible = false; F.boom.rotation.z = 0; if (F.amuletSpin()) F.amuletSpin().rotation.y = 0.3; });
    fade(0.0, 0.0, 1, 1);
    sfx(0.2, 'e3film', 0.85);

    // 1 · THE CAMP GATE, the day he walked out (0 – 9.4)
    fade(0.5, 2.5, 1, 0);
    camTo(0.0, 9.4, at(P.ord, 0, 1.62, 7.5), at(P.ord, 0.2, 1.62, -3.5), rawK);
    yawTo(0.0, 9.4, faceFrom(P.ord.x, P.ord.z + 7.5, P.ord.x + 0.6, P.ord.z - 20), faceFrom(P.ord.x + 0.2, P.ord.z - 3.5, P.ord.x - 0.8, P.ord.z - 20), rawK);
    pitchTo(0.0, 3.0, 0.02, 0.05, smoothK);
    sfx(0.9, 'boomgate', 0.8);
    tr(1.3, 4.3, k => { F.boom.rotation.z = -1.32 * k; }, smoothK);
    sfx(2.6, 'z1pro1');                               // 6.27 s → 8.87, under the dip (v18.6, Brian)
    fade(8.7, 9.4, 0, 1);

    // 2 · THE OFFICE AT NIGHT (9.4 – 19.4)
    const HD = at(P.off, 1.3, 1.0, 0);
    fade(9.6, 10.6, 1, 0);
    camTo(9.4, 19.4, at(P.off, 4.8, 1.55, 3.9), at(P.off, 1.95, 1.22, 1.15), smoothK);
    yawTo(9.4, 19.4, faceFrom(P.off.x + 4.8, P.off.z + 3.9, HD.x, HD.z - 0.4), faceFrom(P.off.x + 1.95, P.off.z + 1.15, HD.x - 0.05, HD.z - 0.25), smoothK);
    pitchTo(9.4, 19.4, -0.10, -0.16, smoothK);
    sfx(9.7, 'officehum', 0.55);
    sfx(10.3, 'keytype', 0.55);
    sfx(11.0, 'z1pro2');                              // 4.91 s → 15.91
    sfx(15.4, 'keytype', 0.4);
    fade(18.7, 19.4, 0, 1);

    // 3 · THE CAMERA BUSINESS (19.4 – 33.6), v19.0: one slow pan along the
    // table — over the cameras he sells, left to right, and onto the laptop,
    // where the orders climb while he says he wanted it to do better
    fade(19.6, 20.5, 1, 0);
    tr(19.4, 33.6, k => {
      const e = k * k * (3 - 2 * k) * 0.85 + k * 0.15;          // eased, and never quite still
      const x = P.ware.x - 0.78 + e * 1.02, y = 0.95 + e * 0.07, z = P.ware.z + 0.56 - e * 0.04;
      // it ends ON the laptop's screen (its middle, measured: the lid stands 0.12 m behind the base's centre) — on a phone, aimed at the base, the screen was half out of frame
      const tx = P.ware.x - 0.62 + e * 0.99, ty = 0.79 + e * 0.14, tz = P.ware.z + 0.18 - e * 0.43;
      api.yaw.position.set(x, y, z);
      api.yaw.rotation.y = faceFrom(x, z, tx, tz);
      api.pitch.rotation.x = -Math.atan2(y - ty, Math.hypot(x - tx, z - tz));
    }, rawK);
    sfx(19.8, 'wareamb', 0.6);
    sfx(20.4, 'taperip', 0.7);
    sfx(20.3, 'z1pro3');                              // 6.92 s → 27.22 (v18.6: 20.6 → 20.3, Brian's take is longer)
    tr(19.4, 33.6, k => { F.root.userData.chart.at = 0.15 + k * 0.85; });
    sfx(24.2, 'orderchime', 0.45);
    sfx(27.6, 'z1pro4');                              // 6.19 s → 33.79, under the dip (v18.6: 26.8 → 27.6, clear of z1pro3)
    sfx(28.6, 'orderchime', 0.55);
    sfx(30.6, 'orderchime', 0.6);
    sfx(31.8, 'orderchime', 0.65);
    fade(32.9, 33.6, 0, 1);

    // 4 · THE DESK AT NIGHT, AND THE AMULET (33.6 – 42.4): one candle, a slow circle
    const AM = at(P.desk, -0.02, 0.76, 0.02);
    fade(33.8, 35.0, 1, 0);
    sfx(33.9, 'candlelit', 0.7);
    tr(33.6, 42.4, k => {
      // close on it: 32 cm out to 19, the lens coming down toward the cloth
      const a = 0.9 - k * 0.9, r = 0.30 - k * 0.16;
      const x = AM.x + Math.sin(a) * r, z = AM.z + Math.cos(a) * r, y = 0.98 - k * 0.1;
      api.yaw.position.set(x, y, z);
      api.yaw.rotation.y = faceFrom(x, z, AM.x, AM.z);
      api.pitch.rotation.x = -Math.atan2(y - AM.y, Math.hypot(x - AM.x, z - AM.z));
    }, rawK);
    tr(33.6, 42.4, k => { const g = F.amuletSpin(); if (g) g.rotation.y = 0.3 + k * 0.9; }, smoothK);
    sfx(35.0, 'z1pro5');                              // 5.56 s → 40.56
    fade(41.7, 42.4, 0, 1);

    // 5 · THE PLANE WINDOW AT DAWN (42.4 – 50.2)
    fade(42.6, 43.6, 1, 0);
    /* v19.0: from his own seat in Chad's cabin — first down the cabin at the
       rows ahead (the passengers over their seat backs, the line of windows),
       then turning to his own window and pushing in on it, the way it always
       ended: the wing below, the cloud sea, the sun */
    camTo(42.4, 44.8, at(P.plane, 0.16, 1.43, -0.34), at(P.plane, 0.20, 1.43, -0.30), smoothK);
    yawTo(42.4, 44.8, faceFrom(P.plane.x + 0.16, P.plane.z - 0.34, P.plane.x + 0.55, P.plane.z + 3.2), faceFrom(P.plane.x + 0.2, P.plane.z - 0.3, P.plane.x + 0.9, P.plane.z + 3.0), smoothK);
    pitchTo(42.4, 44.8, -0.10, -0.10, smoothK);
    camTo(44.8, 50.2, at(P.plane, 0.20, 1.43, -0.30), at(P.plane, 0.44, 1.36, -0.04), smoothK);
    yawTo(44.8, 50.2, faceFrom(P.plane.x + 0.2, P.plane.z - 0.3, P.plane.x + 0.9, P.plane.z + 3.0), faceFrom(P.plane.x + 0.44, P.plane.z - 0.04, P.plane.x + 3, P.plane.z + 0.35), smoothK);
    pitchTo(44.8, 50.2, -0.10, -0.08, smoothK);   // level-ish: the sky and the sun in the window (at -0.26 it was all cloud sea)
    tr(42.4, 50.2, k => { api.yaw.position.y += Math.sin(k * 40) * 0.0012; });
    sfx(42.5, 'cabinhum', 0.6);
    sfx(43.3, 'seatchime', 0.5);
    sfx(44.0, 'z1pro6');                              // 5.41 s → 49.41
    fade(49.5, 50.2, 0, 1);

    // 6 · THE WAT, at dawn: through the gate, to where play begins (50.2 – 62)
    step(50.2, () => { armR.visible = false; });
    fade(50.5, 52.4, 1, 0);
    sfx(50.3, 'watamb', 0.7);
    sfx(50.6, 'e3chant', 0.45);
    camTo(50.2, 60.4, { x: 0.2, y: 1.62, z: 26.0 }, { x: 0, y: 1.62, z: 12.4 }, smoothK);
    yawTo(50.2, 60.4, faceFrom(0.2, 26, 0.6, 0), 0, smoothK);
    /* v16.9: tilted UP through the gate — the temple is twice the old sala's
       height (its spire is 21 m), and at 0.10 → 0.02 the gate and then the
       frame's top cut it in half */
    pitchTo(50.2, 56.0, 0.26, 0.30, smoothK);
    pitchTo(56.0, 60.4, 0.30, 0.24, smoothK);
    sfx(53.2, 'e3bell', 0.55);
    fade(60.2, 61.9, 0, 1);
    step(62.0, () => { armR.visible = true; });
    c.endFade = 1;
    c.keepFade = true;
  }

  /* ============================================================ THE ENDINGS
     He asks; the Ajarn answers; he wais, stands, crosses the room and goes
     out through its door (v16.1: the black takes him from the private room to
     the sala's front steps), goes down the steps, puts
     his shoes back on, walks out into the courtyard, turns back for one last
     look — and the lens rises over the wat into the sunrise while his closing
     line finishes INSIDE the scene (the v15.3 shape), and the last line is
     said over the black. Each answer is the Ajarn's own, and different. */
  const P0 = (s) => ({ x: s.yawPos.x, y: s.yawPos.y, z: s.yawPos.z });

  /* the walk out, shared by all four — from T, over ~31 s. Footfalls are
     written out with their literal names (the engine finds a scene's cues by
     READING ITS SOURCE, v10.2). */
  function walkOut(api, s, T) {
    const { step, sfx, fade, camTo, yawTo, pitchTo, faceFrom, rawK, smoothK, stage, tr } = api;
    /* v16.4: the sala stands on a base now — `top` is the head of the staircase
       at the floor's height, `foot` the paving below it between the nagas'
       heads, and the rack is reached from out in front of them */
    const EYE = stage.SALA.floor + 1.46, ST = stage.STAIR;
    /* v16.9: `top` is the temple's landing, the flight is 14 risers now, the
       rack stands west of the stair's foot, and the yard is further out —
       the temple is twice the sala's height, so the last look needs room */
    const R = stage.RACK;
    const p0 = P0(s), top = { x: 0.35, y: EYE, z: ST.top - 0.4 }, foot = { x: 0.35, y: 1.62, z: ST.foot + 1.0 },
          rack = { x: R.x + 0.15, y: 1.62, z: R.z + 1.4 }, yard = { x: 0.6, y: 1.62, z: 8.6 };
    const RD = stage.RDOOR, door = { x: RD.x + 0.05, y: EYE, z: RD.z - 0.6 };      // just inside the room's door
    // the wai: the head goes down and comes up
    pitchTo(T, T + 0.8, s.pitchX, -0.55, smoothK);
    pitchTo(T + 0.8, T + 1.7, -0.55, 0.0, smoothK);
    sfx(T + 0.3, 'e3bell', 0.4);
    /* v19.1 (Chad: "the player should also have a 'Thank you, Ajahn Krukai.'
       voiceline play while the camera bows, before leaving the sakyant room
       ... for every option chosen"): said into the bow, 1.70 s → T + 1.85,
       as the head comes back up. Every ending's reply has finished by T
       (A by 0.4 s, B 1.2, C 1.6, D 0.7), and it is warmed in build(), since
       it is fired from this helper and not the scene itself (v14.16). */
    sfx(T + 0.15, 'z1thank');
    /* he stands — ON the dais, so the eye is the dais's height over a
       standing man's — turns to the steps, and steps down off the front edge
       to the sala floor before he walks */
    const up = { x: p0.x - 0.15, y: stage.DAIS_TOP + 1.58, z: p0.z + 0.25 };
    const down = { x: p0.x - 0.35, y: EYE, z: stage.DAIS.z + stage.DAIS.d / 2 + 0.55 };
    camTo(T + 1.9, T + 3.1, p0, up, smoothK);
    yawTo(T + 1.9, T + 3.4, s.yawRot, faceFrom(p0.x, p0.z, door.x, door.z), smoothK);
    sfx(T + 2.0, 'barestep', 0.5);
    camTo(T + 3.1, T + 3.9, up, down, smoothK);
    // across the room to its door (v16.1), which opens; the black takes him out
    camTo(T + 3.9, T + 6.9, down, door, rawK);
    yawTo(T + 3.9, T + 5.2, faceFrom(p0.x, p0.z, door.x, door.z), faceFrom(down.x, down.z, RD.x, RD.z + 1), smoothK);
    sfx(T + 4.3, 'barestep', 0.45); sfx(T + 5.1, 'barestep', 0.45); sfx(T + 5.9, 'barestep', 0.45);
    sfx(T + 6.3, 'roomdoor', 0.8);
    tr(T + 6.3, T + 7.2, k => { stage.roomDoor(k); }, smoothK);
    fade(T + 6.8, T + 7.5, 0, 1);
    step(T + 7.6, () => { stage.leaveRoom(); });
    // out on the sala's front steps, in the dawn
    const outYaw = faceFrom(top.x, top.z, foot.x, foot.z);
    camTo(T + 7.6, T + 8.4, top, top, rawK);
    yawTo(T + 7.6, T + 8.2, outYaw, outYaw, rawK);
    pitchTo(T + 7.6, T + 8.2, 0.0, 0.0, rawK);
    fade(T + 7.7, T + 8.6, 1, 0);
    // down the staircase between the nagas, then across to the rack, and his shoes
    camTo(T + 8.4, T + 11.6, top, foot, rawK);
    sfx(T + 8.7, 'barestep', 0.45); sfx(T + 9.3, 'barestep', 0.45); sfx(T + 9.9, 'barestep', 0.45); sfx(T + 10.5, 'barestep', 0.45); sfx(T + 11.1, 'barestep', 0.45);
    camTo(T + 11.6, T + 12.5, foot, rack, smoothK);
    yawTo(T + 11.4, T + 12.3, outYaw, faceFrom(rack.x, rack.z, R.x, R.z), smoothK);
    pitchTo(T + 12.0, T + 12.6, 0.0, -0.72, smoothK);
    sfx(T + 12.8, 'shoesoff', 0.8);
    step(T + 13.1, () => { stage.myShoes.visible = false; });
    pitchTo(T + 13.4, T + 14.0, -0.72, 0.0, smoothK);
    // out across the courtyard, toward the gate and the sun
    yawTo(T + 13.6, T + 14.6, faceFrom(rack.x, rack.z, R.x, R.z), Math.PI + 0.05, smoothK);
    camTo(T + 14.2, T + 20.6, rack, yard, rawK);
    sfx(T + 14.6, 'step', 0.5); sfx(T + 15.4, 'step', 0.5); sfx(T + 16.2, 'step', 0.5);
    sfx(T + 17.0, 'step', 0.5); sfx(T + 17.8, 'step', 0.5); sfx(T + 18.6, 'step', 0.5); sfx(T + 19.4, 'step', 0.5);
    // one last look back at the temple
    const look = { x: 0.15, z: -8.0 };
    yawTo(T + 20.4, T + 22.4, Math.PI + 0.05, faceFrom(yard.x, yard.z, look.x, look.z), smoothK);
    pitchTo(T + 20.4, T + 22.4, 0.0, 0.16, smoothK);
    // and the lens leaves him, rising and drawing back over the courtyard
    const hi = { x: 0.3, y: 7.4, z: 13.4 };
    tr(T + 22.4, T + 30.9, k => {
      const e = smooth(k);
      api.yaw.position.set(yard.x + (hi.x - yard.x) * e, yard.y + (hi.y - yard.y) * e, yard.z + (hi.z - yard.z) * e);
      api.yaw.rotation.y = faceFrom(api.yaw.position.x, api.yaw.position.z, look.x, look.z);
      api.pitch.rotation.x = 0.16 + 0.10 * e;
    }, rawK);
    return T + 30.9;
  }

  function opening(api, s) {
    const { step, yawTo, pitchTo, faceFrom, smoothK, stage, handsRoot } = api;
    const p0 = P0(s), A = stage.AJ;
    step(0, () => { handsRoot.visible = false; stage.ajarnFace(true); stage.myShoes.visible = true; });
    yawTo(0, 1.0, s.yawRot, faceFrom(p0.x, p0.z, A.x, A.z), smoothK);
    pitchTo(0, 1.0, s.pitchX, 0.14, smoothK);
    s.yawRot = faceFrom(p0.x, p0.z, A.x, A.z); s.pitchX = 0.14;
  }
  function ending(c, api, T) {
    const { step, sfx, sfxFade, fade, handsRoot } = api;
    fade(T, T + 2.6, 0, 1);
    sfxFade(T + 0.4, T + 6.8, 'e3close');
    sfx(T + 2.9, 'z1next');
    step(T + 8.2, () => { handsRoot.visible = true; });
    c.endFade = 1;
  }
  const nod = (api, at, secs) => api.step(at, () => { api.stage.ajarn.nod = secs; });

  /* A · LUCK (good) — he laughs, not unkindly */
  function scLuck(c, s, api) {
    const { sfx } = api;
    opening(api, s);
    sfx(0.6, 'z1askA');
    sfx(3.6, 'aj1A'); nod(api, 3.6, 8.0);
    sfx(11.8, 'e3close', 0.9);
    const T = walkOut(api, s, 12.2);
    sfx(20.2, 'z1close');                             // 14.11 s → 34.31, as the lens leaves him
    ending(c, api, T);
  }
  /* B · PROTECTION (bad) — what you are afraid of, you bring with you */
  function scProtect(c, s, api) {
    const { sfx, tr, smoothK, stage } = api;
    opening(api, s);
    sfx(0.6, 'z1askB');
    sfx(4.6, 'aj1B'); nod(api, 4.6, 5.0);
    // he looks down at the man's chest as he says where protection starts
    tr(7.2, 8.0, k => { stage.ajarn.lookPitch = 0.28 * k; }, smoothK);
    tr(9.4, 10.2, k => { stage.ajarn.lookPitch = 0.28 * (1 - k); }, smoothK);
    sfx(9.8, 'e3close', 0.9);
    const T = walkOut(api, s, 10.8);
    sfx(18.8, 'z1close');
    ending(c, api, T);
  }
  /* C · THE STRONGEST (worst) — he takes his hand off the yant, and looks away */
  function scStrong(c, s, api) {
    const { sfx, tr, smoothK, stage } = api;
    opening(api, s);
    sfx(0.6, 'z1askC');
    sfx(5.4, 'aj1C'); nod(api, 5.4, 6.4);
    tr(11.8, 12.8, k => { stage.ajarn.lookYaw = 0.75 * k; }, smoothK);
    sfx(12.6, 'e3close', 0.8);
    const T = walkOut(api, s, 13.4);
    sfx(21.4, 'z1close');
    ending(c, api, T);
  }
  /* D · WHAT DOES IT ASK OF ME (best) — he looks at him a long time, and nods */
  function scAsk(c, s, api) {
    const { sfx, tr, smoothK, stage } = api;
    opening(api, s);
    sfx(0.6, 'z1askD');
    // the long look: nothing for two seconds, then one slow nod
    tr(4.0, 6.0, k => { stage.ajarn.lookPitch = 0.22 * Math.sin(k * Math.PI); }, smoothK);
    sfx(6.2, 'aj1D1'); nod(api, 6.2, 3.0);
    sfx(10.2, 'aj1D2'); nod(api, 10.2, 9.3);
    sfx(17.6, 'e3close', 0.95);
    const T = walkOut(api, s, 20.2);
    sfx(28.2, 'z1close');
    ending(c, api, T);
  }

  (window.__CHAPTERS__ = window.__CHAPTERS__ || {}).e3c1 = Object.assign(DATA, {
    build,
    intro,
    scenes: [scLuck, scProtect, scStrong, scAsk]
  });
})();
