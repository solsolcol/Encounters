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
    brief: 'A temple in Thailand, before the sun is up. Buy an offering, take off your shoes, pay your respects, receive the monk\'s blessing, and find the Ajarn in his private room.',
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
    shrine:    { x: 4.4, z: -8.6 },          // the engine's anchor: the monk's dais
    ghostHome: { x: 4.4, z: -8.6 },          // unused (ghost: null)
    /* minX reaches the room (v16.1). In the wat the west compound wall at
       x -15 still stops the player, a metre past the old bound of -13.6. */
    bounds:    { minX: -262, maxX: 8.2, minZ: -10.2, maxZ: 13.8 },

    /* NO HAUNTING (the eleventh leak, v4.3). This is the chapter where he
       goes looking, and nothing comes looking for him — yet. */
    ghost: null,

    /* DAWN. The sun is just up in the south-east, behind the gate, so the
       courtyard is long gold shadows and the sala's gables catch the first
       light; the sky runs peach at the horizon to a clean blue overhead. */
    daylight: {
      stops: [[0.00, '#f4c9a0'], [0.10, '#f0d2b0'], [0.28, '#c9c8c0'],
              [0.60, '#8fb0cf'], [1.00, '#5a86b8']],
      bg: 0xe6c9a8,
      fog: [0xe8cfb2, 0.0075],
      hemi: [0xffe2c2, 0x7a6a58, 1.10],
      key: [0xffc98a, 1.65, 16, 9, 18],
      fill: [0xbccde2, 0.40],
      stars: 0, moon: 0,
      sun: 0.9, clouds: 0.45,
      vmHemi: [0xfff0dc, 0x94836e, 0.95],
      vmKey: [0xffd8a8, 0.85]
    },

    /* the stand-in cast (docs/E3-MODELS.md: Chad is finding the real ones):
       the Ajarn is the admin tee in a white shirt, seated; the MONK (v16.1)
       is the botak recruit in saffron, seated; the stall auntie
       is the granny with her own idle and talking takes; the man under the
       needle is the botak recruit; the man by the walkway is the standing
       man; the
       amulet in the film is episode 1's Phiboon (the auntie gave it to him
       when he was a boy, a callback nobody has to notice). */
    assets: ['admintee', 'botak', 'granny', 'standman', 'phiboon', 'tree1', 'tree2', 'tree3', 'tree4'],

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
      objStall: 'Buy an offering set at the stall',
      objShoes: 'Take off your shoes at the steps',
      objWai: 'Pay your respects at the altar',
      objPresent: 'Present your offering to the monk',
      objBless: 'Kneel before the monk for his blessing',
      objGo: 'Go to the private room at the end of the walkway',
      objWait: 'Sit on the mat and wait your turn',
      objSeat: 'Sit with your back to the Ajarn',
      objStill: 'Hold still',
      hotStall: 'Buy an offering set',
      hotShoes: 'Take off your shoes',
      hotWai: 'Kneel and wai',
      hotPresent: 'Present your offering',
      hotBless: 'Kneel for the blessing',
      hotDoor: 'Open the door',
      noShoes: 'Shoes off before the sala.',
      evYant: 'Hold still',
      evYantBrief: 'The Ajarn works with a long steel rod, one strike at a time. Breathe out as each strike lands — tap on the strike. A flinch costs you.'
    },
    sayPrefix: 'z1'
  };

  /* the measured length of every line said OUTSIDE a cutscene (CP6 fills
     the real numbers; chaptertest fails a line spoken with none) */
  const SECS = { z1arrive: 3.79, z1wai: 4.13, z1wait: 3.00, z1warm: 4.60, au1hi: 3.97, au1sell: 8.59, au1shoes: 4.36, aj1next: 1.72, aj1sit: 1.57, aj1breathe: 3.63, aj1katha: 10.61, aj1done: 1.65, aj1ask: 3.08,
                 /* v16.1 */ mk1come: 2.87, mk1chant: 9.17, mk1teach: 12.36, hp1room: 6.19, aj1mat: 1.88, z1sadhu: 2.04, z1room: 1.88 };

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
    const SALA = { x0: -7.0, x1: 7.0, z0: -11.0, z1: -1.6, floor: 0.16 };
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
    /* the sala's dais is the MONK's: v16.0's dais, where it always stood */
    const MD  = { x: 4.4, z: -8.7, w: 2.6, d: 2.2, h: 0.42 };
    const MON = { x: 4.4, z: -8.95 };                   // the monk's seat
    const BLESS = { x: MON.x, z: MD.z + MD.d / 2 + 0.62 };   // kneel before him, under the raised seat (CP6: at 0.95 he was small in the frame)
    /* the covered walkway: out of the sala's west side between its two back
       pillars, to the kuti against the west wall, whose door is the room's */
    const WALK = { z: -9.7, x0: -7.3, x1: -12.6, hw: 0.9 };
    const KUTI = { x0: -14.8, x1: -12.6, z0: -12.6, z1: -6.8, h: 3.2 };
    const KDOOR = { x: KUTI.x1, z: WALK.z };
    const HELP = { x: -5.9, z: -9.9 };                  // the man by the walkway
    const WAI  = { x: 0.0, z: -7.55 };                  // kneel before the altar, 1.6 m off its front step (CP3: at 0.6 m the lens was in the steps)
    const RACK = { x: 2.75, z: -0.55 };                 // the shoe rack at the foot of the steps
    const STALL = { x: -9.6, z: 4.4 };                  // the offering stall, facing +x
    const BODHI = { x: 6.2, z: 4.6 };
    const GATE = { z: 15.0, hw: 2.2 };
    const UBO = { x0: 10.2, x1: 21.0, z0: -9.0, z1: 6.0 };

    /* ----------------------------------------------------------- materials */
    const noteTex = makeHellNote();                     // the contract wants one
    madeTex.push(noteTex);
    const grassTex = makeGrass ? makeGrass() : null;
    const paveTex = tex(makePaving(THREE, cnv));
    const woodTex = tex(makePlanks(THREE, cnv));
    const goldTex = tex(makeGoldCarve(THREE, cnv));
    const tileTex = tex(makeRoofTiles(THREE, cnv, '#8e2a1e', '#5a1a12'));
    const tileTex2 = tex(makeRoofTiles(THREE, cnv, '#2f6a45', '#1c4029'));
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
    const matStone = new THREE.MeshStandardMaterial({ color: 0xcfc6b3, roughness: 0.95 });
    const matGreen = new THREE.MeshStandardMaterial({ color: 0x2f6a45, roughness: 0.6 });
    const matDark  = new THREE.MeshStandardMaterial({ color: 0x1f1a16, roughness: 0.9 });
    const matSteel = new THREE.MeshStandardMaterial({ color: 0xb8bcc0, roughness: 0.3, metalness: 0.7 });
    const matProxy = new THREE.MeshStandardMaterial({ color: 0x8d7a66, roughness: 0.9 });
    const matMat   = new THREE.MeshStandardMaterial({ map: tex(makeReedMat(THREE, cnv)), roughness: 0.95 });

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

    /* ------------------------------------------------------------ the ground */
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(260, 260), matGrass);
    ground.rotation.x = -Math.PI / 2; ground.position.y = -0.02; ground.receiveShadow = true; world.add(ground);
    {
      const W = 36, D = 28;                           // x -15…21, z -13…15
      const pv = new THREE.Mesh(new THREE.PlaneGeometry(W, D), matPave);
      pv.rotation.x = -Math.PI / 2; pv.position.set(3, 0.004, 1); pv.receiveShadow = true; world.add(pv);
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
      const cap = box(L + 0.1, 0.16, 0.62, cx, 2.48, cz, matRedD); cap.rotation.y = -a;
      // a pier every 4.5 m, the wall's rhythm
      for (let s = 0; s <= L; s += 4.5) {
        const px = x0 + Math.cos(a) * s, pz = z0 + Math.sin(a) * s;
        const p = box(0.56, 2.7, 0.56, px, 1.35, pz, matWhite);
        const cp = box(0.66, 0.14, 0.66, px, 2.77, pz, matRedD);
        void p; void cp;
      }
    }
    wallRun(-15, 15, -GATE.hw - 0.6, 15);
    wallRun(GATE.hw + 0.6, 15, 21.5, 15);
    wallRun(-15, -13, -15, 15);
    wallRun(-15, -13, 21.5, -13);
    wallRun(21.5, -13, 21.5, 15);

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
      box(GATE.hw * 2 + 1.9, 0.5, 1.0, 0, 4.2, GATE.z, matRed);                // the lintel
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
      // the guardians, just inside the gate, facing the road
      for (const s of [-1, 1]) mkYak(s * 3.9, GATE.z - 1.3, s < 0 ? 0x3f7a4c : 0xa2352a);
    }
    function mkYak(x, z, col) {
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
      solids.push(hid(box(1.3, 0.7, 1.3, x, 0.35, z, matWhite, world, false)));
    }

    /* ------------------------------------------------------------ the sala
       An open pavilion on a low stone plinth: a polished plank floor, ten red
       pillars with gold bands, a low balustrade round three sides, the steps
       in the middle of the front, and three tiers of gabled roof whose ridge
       runs north–south, so the courtyard sees the gables stacked one behind
       another — the Thai silhouette, from the spawn. */
    const SW = SALA.x1 - SALA.x0, SD = SALA.z1 - SALA.z0, SCX = 0, SCZ = (SALA.z0 + SALA.z1) / 2;
    {
      box(SW + 0.6, SALA.floor, SD + 0.6, SCX, SALA.floor / 2, SCZ, matStone, world, false);   // the plinth
      const fl = new THREE.Mesh(new THREE.PlaneGeometry(SW, SD), matWood);
      fl.rotation.x = -Math.PI / 2; fl.position.set(SCX, SALA.floor + 0.004, SCZ); fl.receiveShadow = true; world.add(fl);
      woodTex.repeat.set(SW / 1.6, SD / 1.6);
      // the steps: three treads down from the floor to the paving
      for (let i = 0; i < 3; i++) box(3.4, 0.05 + i * 0.05, 0.34, 0, (0.05 + i * 0.05) / 2, SALA.z1 + 0.95 - i * 0.34, matStone, world, false);
    }
    // the pillars
    const PIL = [];
    for (const x of [SALA.x0 + 0.25, SALA.x1 - 0.25]) for (const z of [-1.9, -4.2, -6.5, -8.8, -10.75]) PIL.push({ x, z });
    for (const z of [-1.9]) for (const x of [-2.4, 2.4]) PIL.push({ x, z });
    for (const p of PIL) {
      const c = cyl(0.17, 0.19, 4.0, p.x, SALA.floor + 2.0, p.z, matRed, 16); solids.push(c);
      for (const y of [0.35, 3.55]) cyl(0.2, 0.2, 0.2, p.x, SALA.floor + y, p.z, matGoldC, 16);
      // a lotus capital
      cyl(0.28, 0.2, 0.18, p.x, SALA.floor + 3.95, p.z, matGold, 16);
    }
    // the balustrade: west and east sides, and the front either side of the steps
    function rail(x0, z0, x1, z1) {
      const L = Math.hypot(x1 - x0, z1 - z0), a = Math.atan2(z1 - z0, x1 - x0);
      const cx = (x0 + x1) / 2, cz = (z0 + z1) / 2;
      const top = box(L, 0.08, 0.16, cx, SALA.floor + 0.78, cz, matRed); top.rotation.y = -a;
      const bot = box(L, 0.1, 0.18, cx, SALA.floor + 0.06, cz, matWhite); bot.rotation.y = -a;
      for (let s = 0.25; s < L; s += 0.28) {
        const px = x0 + Math.cos(a) * s, pz = z0 + Math.sin(a) * s;
        cyl(0.03, 0.03, 0.66, px, SALA.floor + 0.44, pz, matWhite, 6);
      }
      solids.push(top);
    }
    /* v16.1: the west rail stops at the pillar at z -8.8 — between it and the
       back pillar is the way out onto the walkway to the private room */
    rail(SALA.x0 + 0.25, -2.1, SALA.x0 + 0.25, -8.6);
    rail(SALA.x1 - 0.25, -2.1, SALA.x1 - 0.25, -10.6);
    rail(SALA.x0 + 0.4, -1.75, -1.85, -1.75);
    rail(1.85, -1.75, SALA.x1 - 0.4, -1.75);
    /* the NAGA balustrades either side of the steps: a serpent's body running
       down to the paving and rearing up at the foot, hood fanned, green and
       gold. A tube along a curve, a hood of cones. */
    for (const s of [-1, 1]) {
      const x = s * 1.9;
      const pts = [];
      for (let i = 0; i <= 20; i++) {
        const k = i / 20;
        pts.push(new THREE.Vector3(x, SALA.floor + 0.72 - k * 0.5 + Math.sin(k * Math.PI * 3) * 0.04, -1.75 + k * 1.55));
      }
      pts.push(new THREE.Vector3(x, 0.9, 0.05), new THREE.Vector3(x, 1.35, 0.12));
      const body = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 48, 0.11, 10, false), matGreen);
      body.castShadow = !LOW; world.add(body);
      // a gold spine along its back
      const spine = pts.map(v => new THREE.Vector3(v.x, v.y + 0.1, v.z));
      world.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(spine), 48, 0.03, 6, false), matGold));
      /* THE HOOD: a fan standing up and facing out at the courtyard — green
         scales ringed in gold — with five heads along its crown, the middle
         one tallest, each a snout, two gold eyes and a gold crest */
      const hood = new THREE.Group(); hood.position.set(x, 1.28, 0.16); world.add(hood);
      const fan = new THREE.Mesh(new THREE.CircleGeometry(0.34, 20, 0, Math.PI), new THREE.MeshStandardMaterial({ map: tex(makeNagaScales(THREE, cnv)), roughness: 0.5, side: THREE.DoubleSide }));
      hood.add(fan);
      const rim = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.022, 6, 20, Math.PI), matGold); hood.add(rim);
      for (let h = -2; h <= 2; h++) {
        const a = Math.PI / 2 - h * 0.5, hr = 0.34;
        const head = new THREE.Group(); head.position.set(Math.cos(a) * hr, Math.sin(a) * hr, 0.02);
        head.rotation.z = -h * 0.35; hood.add(head);
        const sk = new THREE.Mesh(new THREE.SphereGeometry(0.07 - Math.abs(h) * 0.008, 10, 8), matGreen);
        sk.scale.set(0.85, 1.1, 1.0); head.add(sk);
        const sn = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.12, 8), matGreen);
        sn.rotation.x = Math.PI / 2; sn.position.set(0, -0.01, 0.08); head.add(sn);
        for (const e of [-1, 1]) { const ey = new THREE.Mesh(new THREE.SphereGeometry(0.014, 6, 4), matGold); ey.position.set(e * 0.035, 0.02, 0.06); head.add(ey); }
        const cr = new THREE.Mesh(new THREE.ConeGeometry(0.025, 0.11 + (h === 0 ? 0.06 : 0), 6), matGold); cr.position.set(0, 0.1, -0.01); head.add(cr);
      }
      hood.traverse(o => { if (o.isMesh) o.castShadow = !LOW; });
      solids.push(hid(box(0.36, 0.9, 1.7, x, 0.45, -0.95, matStone, world, false)));
    }

    /* THE ROOF — three stacked gables, the front one lowest. Each tier is two
       sloping planes of tiles and a gable triangle filled with a carved gilded
       pediment; its edges carry the gold bargeboards (lamyong) ending in the
       hooked hang hong at the eaves, and the ridge's front end the chofa, the
       bird's-horn finial every Thai roof is recognised by. */
    const TIERS = [
      /* the SKIRT: one low roof the whole length, so the taller rear tiers never
         leave daylight between the column tops and their own eaves */
      { z0: -1.0, z1: -11.8, eave: 3.95, ridge: 5.3, hw: 7.9, mat: matTile, skirt: true },
      /* two gables, the rear one clearly the taller: from the spawn (14 m out,
         eye 1.62) the front apex sits 243 px above the frame's centre on a
         1280x800 frame and the rear one 317 px — a 74 px band of the second
         gable over the first, which is the stacked Thai silhouette. Three
         tiers of this width put the third exactly behind the second in
         perspective (measured, CP2) */
      { z0: -0.8, z1: -4.8, eave: 3.95, ridge: 7.8, hw: 7.9, mat: matTile },
      { z0: -3.2, z1: -11.8, eave: 4.6, ridge: 10.6, hw: 7.2, mat: matTile2 }
    ];
    const chofas = [];
    for (const T of TIERS) {
      const len = T.z1 - T.z0, cz = (T.z0 + T.z1) / 2;
      const rise = T.ridge - T.eave, run = T.hw;
      const slope = Math.hypot(rise, run), ang = Math.atan2(rise, run);
      for (const s of [-1, 1]) {
        const p = new THREE.Mesh(new THREE.PlaneGeometry(slope, Math.abs(len)), T.mat);
        p.rotation.order = 'ZYX';
        p.rotation.x = -Math.PI / 2; p.rotation.z = -s * ang;   // tilted about the RIDGE (z), not turned about y
        p.position.set(s * run / 2, (T.eave + T.ridge) / 2, cz);
        p.castShadow = !LOW; p.receiveShadow = true; world.add(p);
        const under = new THREE.Mesh(new THREE.PlaneGeometry(slope, Math.abs(len)), matCeil);
        under.rotation.copy(p.rotation); under.position.copy(p.position); under.position.y -= 0.06; world.add(under);
      }
      box(0.16, 0.2, Math.abs(len), 0, T.ridge + 0.05, cz, matGold);        // the ridge
      if (T.skirt) continue;
      // the gable at the front end, and the bargeboards up its two edges
      const tri = new THREE.Shape();
      tri.moveTo(-run * 0.94, 0); tri.lineTo(run * 0.94, 0); tri.lineTo(0, rise * 0.94); tri.closePath();
      const gab = new THREE.Mesh(new THREE.ShapeGeometry(tri), matGoldC);
      gab.position.set(0, T.eave + 0.02, T.z0 + 0.02); world.add(gab);
      const back = new THREE.Mesh(new THREE.ShapeGeometry(tri), matRedD);
      back.position.set(0, T.eave + 0.02, T.z0 - 0.02); back.rotation.y = Math.PI; world.add(back);
      for (const s of [-1, 1]) {
        const b = box(slope + 0.35, 0.22, 0.12, s * run / 2, (T.eave + T.ridge) / 2 + 0.1, T.z0 + 0.08, matGold);
        b.rotation.z = -s * ang;
        // the hang hong: a hooked finial at the eave end of each bargeboard
        const hh = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.05, 6, 10, Math.PI * 1.3), matGold);
        hh.position.set(s * (run + 0.1), T.eave - 0.05, T.z0 + 0.08); hh.rotation.z = s > 0 ? -0.3 : Math.PI + 0.3;
        world.add(hh);
      }
      // the chofa at the apex: a slender curved horn rising and bending forward
      const cf = [];
      for (let i = 0; i <= 10; i++) { const k = i / 10; cf.push(new THREE.Vector3(0, T.ridge + k * 0.95, T.z0 + 0.1 + k * k * 0.55)); }
      const ch = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(cf), 16, 0.045, 6, false), matGold);
      world.add(ch); chofas.push(ch);
      // the eave line, a fringe of gold
      box(run * 2 + 0.4, 0.08, 0.08, 0, T.eave - 0.02, T.z0 + 0.1, matGold);
    }
    tileTex2.repeat.set(3, 2);
    // the ceiling boards over the floor, and the back wall behind the altar
    walls.push(box(SW, 4.6, 0.3, SCX, SALA.floor + 2.3, SALA.z0 + 0.05, matRedD));
    /* the ceiling CASTS: without it the sun came through the hairline gaps
       between the roof planes and lay on the floor as a trail of bright specks
       (photographed, CP2) */
    box(SW - 0.6, 0.06, SD - 0.4, SCX, SALA.floor + 4.02, SCZ, matCeil, world, true);
    // two ceiling fans, turning, and pendant lamps (off: it is light)
    const fans = [];
    for (const z of [-3.6, -7.4]) {
      const g = new THREE.Group(); g.position.set(-1.8, SALA.floor + 3.62, z); world.add(g);
      cyl(0.015, 0.015, 0.36, 0, 0.2, 0, matDark, 6, g);
      cyl(0.09, 0.09, 0.08, 0, 0, 0, matWhite, 10, g);
      const blades = new THREE.Group(); g.add(blades);
      for (let i = 0; i < 3; i++) {
        const b = box(0.62, 0.012, 0.11, 0.38, 0, 0, matWoodL, blades, false);
        b.position.set(Math.cos(i * 2.094) * 0.38, 0, Math.sin(i * 2.094) * 0.38); b.rotation.y = -i * 2.094;
      }
      fans.push(blades);
    }
    for (const z of [-3.0, -6.2, -9.4]) {
      cyl(0.006, 0.006, 0.7, 2.2, SALA.floor + 3.65, z, matDark, 4);
      const sh = cyl(0.16, 0.24, 0.2, 2.2, SALA.floor + 3.25, z, matGold, 12); void sh;
    }

    /* THE ALTAR against the back wall: a stepped red-and-gold throne, the
       seated golden Buddha on top under a gilded screen with a halo, smaller
       images either side, lotus in vases, candles, an incense pot with smoke
       rising, jasmine garlands, and a framed photograph of the old abbot. */
    const ALT = { x: 0, z: SALA.z0 + 0.95 };
    const candles = [];
    let smokeP = null;
    {
      for (let i = 0; i < 3; i++) {
        const w = 3.8 - i * 0.9, h = 0.38, y = SALA.floor + h / 2 + i * h;
        box(w, h, 1.6 - i * 0.3, ALT.x, y, ALT.z + 0.1 - i * 0.12, i % 2 ? matGoldC : matRed);
        box(w + 0.04, 0.04, 1.62 - i * 0.3, ALT.x, y + h / 2, ALT.z + 0.1 - i * 0.12, matGold);
      }
      solids.push(hid(box(3.8, 1.2, 1.7, ALT.x, 0.6, ALT.z + 0.1, matRed, world, false)));
      // the screen behind the Buddha: red with a gilded arch and a halo
      const scr = box(3.2, 3.3, 0.08, ALT.x, SALA.floor + 2.8, SALA.z0 + 0.25, matRedD);
      void scr;
      const halo = new THREE.Mesh(new THREE.RingGeometry(0.55, 0.72, 40), matGold);
      halo.position.set(ALT.x, SALA.floor + 3.25, SALA.z0 + 0.32); world.add(halo);
      const arch = new THREE.Mesh(new THREE.TorusGeometry(1.35, 0.06, 8, 40, Math.PI), matGold);
      arch.position.set(ALT.x, SALA.floor + 2.4, SALA.z0 + 0.32); world.add(arch);
      // the Buddha (a stand-in until Chad's model lands: a lathe-built seated
      // figure in gold, in the earth-touching pose's silhouette)
      mkBuddha(ALT.x, SALA.floor + 1.14, SALA.z0 + 0.72, 1.0);
      for (const s of [-1, 1]) mkBuddha(ALT.x + s * 1.25, SALA.floor + 0.76, SALA.z0 + 1.02, 0.42);
      // vases of lotus, candles, the incense pot, garlands
      for (const s of [-1, 1]) {
        const vx = ALT.x + s * 1.55, vy = SALA.floor + 0.76, vz = ALT.z + 0.55;
        cyl(0.09, 0.07, 0.3, vx, vy + 0.15, vz, matGold, 12);
        for (let k = 0; k < 3; k++) {
          const st = cyl(0.008, 0.008, 0.42, vx + (k - 1) * 0.05, vy + 0.5, vz, matGreen, 4); st.rotation.z = (k - 1) * 0.18;
          const bud = new THREE.Mesh(new THREE.SphereGeometry(0.055, 8, 6), new THREE.MeshStandardMaterial({ color: 0xf2b6c6, roughness: 0.6 }));
          bud.scale.set(1, 1.5, 1); bud.position.set(vx + (k - 1) * 0.12, vy + 0.74, vz); world.add(bud);
        }
        const cz = ALT.z + 0.62;
        for (const dx of [0.35, 0.55]) {
          const cx = ALT.x + s * dx;
          cyl(0.025, 0.025, 0.24, cx, SALA.floor + 0.88, cz, new THREE.MeshStandardMaterial({ color: 0xf3e4b0, roughness: 0.6 }), 8);
          const fl = new THREE.Mesh(new THREE.SphereGeometry(0.018, 8, 6),
            new THREE.MeshBasicMaterial({ color: 0xffc46a, transparent: true, opacity: 0.95, fog: false }));
          fl.scale.set(1, 1.8, 1); fl.position.set(cx, SALA.floor + 1.03, cz); world.add(fl);
          candles.push(fl);
        }
      }
      // the incense pot, front and centre, and its smoke
      cyl(0.16, 0.12, 0.16, ALT.x, SALA.floor + 0.84, ALT.z + 0.72, matGold, 16);
      for (let k = 0; k < 5; k++) {
        const st = cyl(0.004, 0.004, 0.3, ALT.x - 0.06 + k * 0.03, SALA.floor + 1.02, ALT.z + 0.72, matRedD, 3);
        st.rotation.z = (k - 2) * 0.06;
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
      // the abbot's photograph, framed in gold, on the second tier
      const ph = new THREE.Mesh(new THREE.PlaneGeometry(0.34, 0.44),
        new THREE.MeshStandardMaterial({ map: tex(makeAbbot(THREE, cnv)), roughness: 0.6 }));
      ph.position.set(ALT.x - 0.95, SALA.floor + 1.28, ALT.z + 0.22); world.add(ph);
      box(0.4, 0.5, 0.03, ALT.x - 0.95, SALA.floor + 1.28, ALT.z + 0.2, matGold);
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
      const g = new THREE.Group(); g.position.set(D.x - parent.position.x, SALA.floor, D.z - parent.position.z); parent.add(g);
      const pile = new THREE.Group(); pile.position.set(-0.85, D.h + 0.01, 0.82); g.add(pile);
      box(D.w, D.h, D.d, 0, D.h / 2, 0, matRed, g);
      box(D.w + 0.05, 0.05, D.d + 0.05, 0, D.h, 0, matGold, g);
      box(D.w + 0.05, 0.08, D.d + 0.05, 0, 0.04, 0, matGold, g);
      const pm = new THREE.Mesh(new THREE.PlaneGeometry(D.w - 0.2, D.d - 0.2), matMat);
      pm.rotation.x = -Math.PI / 2; pm.position.y = D.h + 0.005; g.add(pm);
      const seat = box(0.62, 0.34, 0.52, SEAT.x - D.x, D.h + 0.17, SEAT.z - D.z - 0.06, matWoodD, g);
      box(1.0, 0.36, 0.95, SEAT.x - D.x, D.h + 0.18, SEAT.z - D.z + 0.05, matRed, g);
      box(1.04, 0.04, 0.99, SEAT.x - D.x, D.h + 0.36, SEAT.z - D.z + 0.05, matGold, g);
      const cushion = box(0.66, 0.06, 0.56, SEAT.x - D.x, D.h + 0.37, SEAT.z - D.z - 0.06, new THREE.MeshStandardMaterial({ color: 0xc7a24e, roughness: 0.8 }), g);
      seat.userData.base = D.h; seat.userData.cushion = cushion;
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
    const monkD = mkDais(MD, MON, world);
    const offerPile = monkD.pile;
    const bowlPos = new THREE.Vector3(MON.x + 0.42, SALA.floor + MD.h + 0.04, MON.z + 0.62);
    let whisk = null;
    {
      const g = monkD.g, L = (x, z) => [x - MD.x, z - MD.z];
      const [ax, az] = L(MON.x - 0.72, MON.z + 0.35);
      cyl(0.09, 0.07, 0.12, ax, MD.h + 0.06, az, matGold, 14, g);                       // the alms bowl's stand
      const bowl = new THREE.Mesh(new THREE.SphereGeometry(0.14, 18, 10, 0, Math.PI * 2, 0, Math.PI * 0.62), new THREE.MeshStandardMaterial({ color: 0x141210, roughness: 0.35 }));
      bowl.rotation.x = Math.PI; bowl.position.set(ax, MD.h + 0.24, az); bowl.castShadow = !LOW; g.add(bowl);
      const lid = new THREE.Mesh(new THREE.SphereGeometry(0.13, 18, 8, 0, Math.PI * 2, 0, Math.PI * 0.35), bowl.material);
      lid.position.set(ax, MD.h + 0.2, az); g.add(lid);
      // the lustral water: a silver bowl, the water in it, the whisk resting across it
      const [bx, bz] = L(bowlPos.x, bowlPos.z);
      const silver = new THREE.MeshStandardMaterial({ color: 0xd4d6d8, roughness: 0.25, metalness: 0.85 });
      const kb = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.09, 0.09, 22, 1, true), silver);
      kb.material.side = THREE.DoubleSide; kb.position.set(bx, MD.h + 0.05, bz); g.add(kb);
      cyl(0.09, 0.09, 0.012, bx, MD.h + 0.006, bz, silver, 22, g);
      const water = new THREE.Mesh(new THREE.CircleGeometry(0.125, 22), new THREE.MeshStandardMaterial({ color: 0x9fb8c0, roughness: 0.05, metalness: 0.2, transparent: true, opacity: 0.8 }));
      water.rotation.x = -Math.PI / 2; water.position.set(bx, MD.h + 0.07, bz); g.add(water);
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
      const fan = new THREE.Group(); const [fx, fz] = L(MON.x + 0.62, MON.z - 0.05);
      fan.position.set(fx, MD.h, fz); fan.rotation.z = -0.28; g.add(fan);
      cyl(0.012, 0.012, 1.1, 0, 0.55, 0, matWoodD, 6, fan);
      const disc = new THREE.Mesh(new THREE.CircleGeometry(0.22, 24), new THREE.MeshStandardMaterial({ color: 0xa8541c, roughness: 0.6, side: THREE.DoubleSide }));
      disc.position.set(0, 1.18, 0.01); fan.add(disc);
      const rim = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.012, 6, 24), matGold); rim.position.copy(disc.position); fan.add(rim);
      // the white string, the thermos and the glass
      const [sx, sz] = L(MON.x - 0.45, MON.z + 0.72);
      cyl(0.035, 0.035, 0.05, sx, MD.h + 0.025, sz, new THREE.MeshStandardMaterial({ color: 0xf6f3ea, roughness: 0.9 }), 12, g);
      const [tx, tz] = L(MON.x + 0.9, MON.z - 0.25);
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

      /* THE SHRINE on the back wall, over the Ajarn's shoulder */
      const sx = DAIS.x - ROOM.x, sz = Z0 + 0.26;
      box(3.2, 0.07, 0.46, sx, F + 1.72, sz, matRed, roomG, false);
      box(3.24, 0.03, 0.48, sx, F + 1.76, sz, matGold, roomG, false);
      box(3.2, 0.07, 0.36, sx, F + 2.34, sz - 0.05, matRed, roomG, false);
      for (const ex of [-1.5, 1.5]) box(0.06, 0.7, 0.06, sx + ex, F + 2.05, sz - 0.12, matWoodD, roomG, false);
      mkBuddha(sx, F + 1.76, sz - 0.02, 0.36, roomG);
      for (const ex of [-0.55, 0.55]) mkBuddha(sx + ex, F + 1.76, sz + 0.04, 0.22, roomG);
      mkRuesi(sx - 1.15, F + 1.76, sz, roomG);
      // the old masters, framed, on the top shelf
      const abbot = new THREE.MeshStandardMaterial({ map: tex(makeAbbot(THREE, cnv)), roughness: 0.6 });
      for (const ex of [-0.9, 0.0, 0.9]) {
        box(0.36, 0.46, 0.03, sx + ex, F + 2.62, sz - 0.12, matGold, roomG, false);
        const ph = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 0.4), abbot); ph.position.set(sx + ex, F + 2.62, sz - 0.1); roomG.add(ph);
      }
      // candles, a vase of lotus, the incense pot and its smoke, garlands
      for (const ex of [-0.95, -0.8, 0.8, 0.95]) {
        cyl(0.018, 0.018, 0.16, sx + ex, F + 1.84, sz + 0.14, new THREE.MeshStandardMaterial({ color: 0xf3e4b0, roughness: 0.6 }), 8, roomG);
        const f = new THREE.Mesh(new THREE.SphereGeometry(0.014, 8, 6), new THREE.MeshBasicMaterial({ color: 0xffc46a, transparent: true, opacity: 0.95, fog: false }));
        f.scale.set(1, 1.8, 1); f.position.set(sx + ex, F + 1.94, sz + 0.14); roomG.add(f); candles.push(f);
      }
      cyl(0.1, 0.08, 0.1, sx + 1.25, F + 1.81, sz + 0.1, matGold, 14, roomG);
      for (let k = 0; k < 4; k++) {
        const st = cyl(0.004, 0.004, 0.26, sx + 1.22 + k * 0.02, F + 1.96, sz + 0.1, matRedD, 3, roomG);
        st.rotation.z = (k - 1.5) * 0.08;
      }
      if (makeSoftDot) {
        const dot = makeSoftDot(); madeTex.push(dot);
        const N = 12, geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(N * 3), 3));
        roomSmoke = new THREE.Points(geo, new THREE.PointsMaterial({ map: dot, size: 0.13, transparent: true, opacity: 0.28, depthWrite: false, color: 0xd8d0c4 }));
        roomSmoke.frustumCulled = false; roomSmoke.userData.seed = Array.from({ length: N }, (_, i) => hash(i, 11));
        roomSmoke.userData.at = new THREE.Vector3(DAIS.x + 1.25, F + 2.05, ROOM.z + sz + 0.1);
        world.add(roomSmoke);
      }
      for (let i = 0; i < 2; i++) {
        const pts = [], w = 3.0, y = F + 1.7 + i * 0.62, z = sz + 0.24 - i * 0.05;
        for (let k = 0; k <= 16; k++) { const t = k / 16; pts.push(new THREE.Vector3(sx - w / 2 + t * w, y - Math.sin(t * Math.PI) * 0.12, z)); }
        roomG.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 32, 0.022, 6, false), new THREE.MeshStandardMaterial({ color: i ? 0xf6c228 : 0xf5f0de, roughness: 0.7 })));
      }

      /* the yant cloths on the walls, framed: the five lines, the nine spires,
         the twin tigers, the eight directions — drawn, not downloaded */
      const cloth = (k, x, y, z, ry, w = 0.62, h = 0.82) => {
        const g = new THREE.Group(); g.position.set(x, y, z); g.rotation.y = ry; roomG.add(g);
        box(w + 0.06, h + 0.06, 0.025, 0, 0, 0, matWoodD, g, false);
        const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({ map: tex(makeYantCloth(THREE, cnv, k)), roughness: 0.9 }));
        m.position.z = 0.014; g.add(m);
      };
      cloth(1, -HW + 0.02, F + 1.75, -1.6, Math.PI / 2);
      cloth(2, -HW + 0.02, F + 1.75, -0.3, Math.PI / 2, 0.7, 0.7);
      cloth(3, -HW + 0.02, F + 1.75, 1.0, Math.PI / 2);
      cloth(0, HW - 0.02, F + 1.8, -2.35, -Math.PI / 2, 0.55, 0.75);
      cloth(1, HW - 0.02, F + 1.8, 1.8, -Math.PI / 2, 0.55, 0.75);
      cloth(2, 0.9, F + 1.7, Z1 - 0.02, Math.PI, 0.9, 0.9);
      cloth(3, 2.4, F + 1.7, Z1 - 0.02, Math.PI, 0.55, 0.75);

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
      cpool.rotation.x = -Math.PI / 2; cpool.position.set(sx, F + DAIS.h + 0.012, sz + 0.9); roomG.add(cpool);
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
      }
      // the waiting mat, a cushion, a low table with a jug and two cups
      {
        const mx = WAIT.x - ROOM.x, mz = WAIT.z - ROOM.z;
        const mat = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 1.6), matMat);
        mat.rotation.x = -Math.PI / 2; mat.rotation.z = 0.5; mat.position.set(mx, F + 0.01, mz); mat.receiveShadow = true; roomG.add(mat);
        const cu = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.08, 0.46), new THREE.MeshStandardMaterial({ color: 0x7a2a22, roughness: 0.85 }));
        cu.position.set(mx - 0.1, F + 0.05, mz + 0.35); roomG.add(cu);
        const tb = new THREE.Group(); tb.position.set(-HW + 0.55, F, -0.9); roomG.add(tb);
        box(0.62, 0.05, 0.42, 0, 0.3, 0, matWoodD, tb, false);
        for (const a of [-1, 1]) for (const c of [-1, 1]) box(0.04, 0.3, 0.04, a * 0.27, 0.15, c * 0.17, matWoodD, tb, false);
        cyl(0.06, 0.05, 0.2, -0.12, 0.43, 0, new THREE.MeshStandardMaterial({ color: 0xb8d0d8, roughness: 0.1, transparent: true, opacity: 0.6 }), 12, tb);
        for (const cx of [0.1, 0.2]) cyl(0.03, 0.025, 0.07, cx, 0.36, 0.05, new THREE.MeshStandardMaterial({ color: 0xece6d8, roughness: 0.5 }), 10, tb);
        const t2 = mkTray(); t2.scale.setScalar(0.8); t2.position.set(0.12, 0.33, -0.12); tb.add(t2);
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
      fl.rotation.x = -Math.PI / 2; fl.position.set(cx, SALA.floor + 0.004, Z); fl.receiveShadow = true; world.add(fl);
      for (let x = WALK.x0 - 0.5; x >= WALK.x1 + 0.2; x -= 1.6) {
        for (const sd of [-1, 1]) {
          const post = cyl(0.08, 0.09, 2.6, x, SALA.floor + 1.3, Z + sd * (WALK.hw + 0.02), matRed, 10); solids.push(post);
          cyl(0.1, 0.1, 0.12, x, SALA.floor + 0.3, Z + sd * (WALK.hw + 0.02), matGoldC, 10);
        }
      }
      for (const sd of [-1, 1]) {
        const zr = Z + sd * (WALK.hw + 0.02);
        box(L, 0.1, 0.14, cx, SALA.floor + 2.62, zr, matRedD);                 // the beam along the posts
        const top = box(L - 0.4, 0.07, 0.12, cx - 0.2, SALA.floor + 0.62, zr, matRed); solids.push(top);
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
        p.position.set(cx, SALA.floor + 2.72 + rise / 2, Z + sd * run / 2); p.castShadow = !LOW; world.add(p);
        const u = new THREE.Mesh(new THREE.PlaneGeometry(L + 0.4, slope), matCeil);
        u.rotation.copy(p.rotation); u.position.copy(p.position); u.position.y -= 0.05; world.add(u);
      }
      box(L + 0.4, 0.1, 0.1, cx, SALA.floor + 2.72 + rise + 0.03, Z, matGold);
      // lanterns under it
      const lm = new THREE.MeshStandardMaterial({ color: 0xc4261c, roughness: 0.6, emissive: 0x5a0c06, emissiveIntensity: 0.6 });
      /* hung from the beams along the sides, so none of them stands between
         the sala and the sign over the door (CP6: the centre one did) */
      for (const [x, sd] of [[WALK.x0 - 1.3, 1], [cx, -1], [WALK.x1 + 1.3, 1]]) {
        const lz = Z + sd * (WALK.hw - 0.12);
        cyl(0.004, 0.004, 0.3, x, SALA.floor + 2.5, lz, matDark, 4);
        const l = new THREE.Mesh(new THREE.SphereGeometry(0.14, 10, 8), lm); l.scale.set(1, 1.25, 1); l.position.set(x, SALA.floor + 2.2, lz); world.add(l);
      }
      // the sign at the sala's end: the way to the Ajarn
      const sg = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.34), new THREE.MeshStandardMaterial({ map: tex(makeSignTex(THREE, cnv, 'SAK YANT  →', '#6d140e', '#f6e6b8', 2.65)), roughness: 0.7, side: THREE.DoubleSide }));
      sg.position.set(WALK.x0 - 0.9, SALA.floor + 2.35, Z + WALK.hw - 0.02); world.add(sg);
    }
    {
      const K = KUTI, cx = (K.x0 + K.x1) / 2, cz = (K.z0 + K.z1) / 2, L = K.z1 - K.z0, Wd = K.x1 - K.x0;
      box(Wd + 0.3, SALA.floor, L + 0.3, cx, SALA.floor / 2, cz, matStone, world, false);
      walls.push(box(Wd, K.h, L, cx, SALA.floor + K.h / 2, cz, matWall));
      box(Wd + 0.02, 0.5, L + 0.02, cx, SALA.floor + 0.25, cz, matRedD, world, false);     // the base band
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
      box(0.02, 0.22, 0.5, 0.035, 1.62, dw / 2, new THREE.MeshStandardMaterial({ map: tex(makeYantCloth(THREE, cnv, 0)), roughness: 0.8 }), kutiLeaf, false);
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
      for (const dz of [-0.16, 0.16]) for (const d of [-0.055, 0.055]) {
        const sh = new THREE.Mesh(new THREE.BoxGeometry(0.27, 0.07, 0.1), new THREE.MeshStandardMaterial({ color: dz < 0 ? 0x2c3e66 : 0x8a6a4a, roughness: 0.8 }));
        sh.position.set(0, SALA.floor + 0.34, dz + d); kr.add(sh);
      }
    }

    function mkTray() {
      const g = new THREE.Group();
      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.14, 0.05, 16),
        new THREE.MeshStandardMaterial({ color: 0xb98a3a, roughness: 0.5, metalness: 0.2 }));
      base.position.y = 0.025; g.add(base);
      // a lotus bud, marigolds, three sticks of incense, a candle, an envelope
      const lot = new THREE.Mesh(new THREE.SphereGeometry(0.045, 10, 8), new THREE.MeshStandardMaterial({ color: 0xf4b8c8, roughness: 0.6 }));
      lot.scale.set(1, 1.6, 1); lot.position.set(-0.05, 0.11, 0); g.add(lot);
      for (let k = 0; k < 7; k++) {
        const m = new THREE.Mesh(new THREE.SphereGeometry(0.028, 8, 6), new THREE.MeshStandardMaterial({ color: k % 2 ? 0xf2a11a : 0xf6c228, roughness: 0.8 }));
        const a = k / 7 * Math.PI * 2; m.position.set(Math.cos(a) * 0.11, 0.07, Math.sin(a) * 0.11); g.add(m);
      }
      for (let k = 0; k < 3; k++) {
        const st = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.26, 4), new THREE.MeshStandardMaterial({ color: 0x9a3b2a }));
        st.position.set(0.05 + k * 0.012, 0.09, -0.04); st.rotation.z = 1.35; g.add(st);
      }
      const cd = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.12, 8), new THREE.MeshStandardMaterial({ color: 0xf3e4b0 }));
      cd.position.set(0.06, 0.09, 0.07); cd.rotation.z = 1.4; g.add(cd);
      const env = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.004, 0.07), new THREE.MeshStandardMaterial({ color: 0xf6f2e8, roughness: 0.8 }));
      env.position.set(0.0, 0.058, 0.085); env.rotation.y = 0.2; g.add(env);
      g.traverse(o => { if (o.isMesh) { o.castShadow = !LOW; o.receiveShadow = true; } });
      return g;
    }

    /* the mats, in rows on the west half, and a bench along the west rail
       where men wait who cannot sit on the floor for an hour */
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 1.6), matMat);
      m.rotation.x = -Math.PI / 2; m.position.set(-4.6 + c * 1.45, SALA.floor + 0.012, -3.4 - r * 2.0);
      m.receiveShadow = true; world.add(m);
    }
    const BENCH = { x: -6.15, z0: -3.2, z1: -7.6 };
    box(0.5, 0.06, BENCH.z0 - BENCH.z1, BENCH.x, SALA.floor + 0.44, (BENCH.z0 + BENCH.z1) / 2, matWoodL);
    for (const z of [BENCH.z0 - 0.2, BENCH.z1 + 0.2]) solids.push(box(0.44, 0.44, 0.08, BENCH.x, SALA.floor + 0.22, z, matWoodD));
    // the waiting mat glows when it is where the player should go (the zone)
    const zone = mkZone(WAIT.x, WAIT.z); const zoneSeat = mkZone(CUSH.x, DAIS.z + DAIS.d / 2 + 0.55);
    const zoneBless = mkZone(BLESS.x, BLESS.z);          // v16.1: where to kneel before the monk
    // a low table of amulets and water bottles by the east rail
    {
      box(1.4, 0.36, 0.5, 6.0, SALA.floor + 0.18, -4.0, matWoodD);
      for (let i = 0; i < 6; i++) {
        const b = cyl(0.03, 0.03, 0.2, 5.5 + i * 0.2, SALA.floor + 0.46, -3.92, new THREE.MeshStandardMaterial({ color: 0xb8d8e8, transparent: true, opacity: 0.7, roughness: 0.1 }), 8);
        void b;
      }
      solids.push(hid(box(1.4, 0.36, 0.5, 6.0, SALA.floor + 0.18, -4.0, matWoodD, world, false)));
    }

    /* ------------------------------------------------ the steps and the shoes
       A wooden rack at the foot of the steps with a dozen pairs on it and more
       on the paving beside it, and the sign every temple has. */
    const shoeMats = [0x3a2a20, 0x1d1d1f, 0x8a6a4a, 0xe6e1d6, 0x2c3e66, 0xa33a2a].map(c => new THREE.MeshStandardMaterial({ color: c, roughness: 0.8 }));
    const myShoes = new THREE.Group(); world.add(myShoes);
    {
      const g = new THREE.Group(); g.position.set(RACK.x, 0, RACK.z); g.rotation.y = 0; world.add(g);
      for (const y of [0.05, 0.32, 0.6]) box(1.5, 0.04, 0.36, 0, y, 0, matWoodL, g);
      for (const s of [-1, 1]) for (const z of [-0.16, 0.16]) box(0.05, 0.75, 0.05, s * 0.73, 0.37, z, matWoodD, g);
      const pair = (px, py, pz, m, ry = 0, parent = g) => {
        for (const d of [-0.055, 0.055]) {
          const sh = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.07, 0.27), m);
          sh.position.set(px + d, py + 0.035, pz); sh.rotation.y = ry; parent.add(sh);
        }
      };
      for (let i = 0; i < 10; i++) pair(-0.58 + (i % 5) * 0.29, i < 5 ? 0.07 : 0.34, 0, shoeMats[i % shoeMats.length]);
      for (let i = 0; i < 5; i++) pair(-1.3 - (i % 3) * 0.3, 0, 0.25 + Math.floor(i / 3) * 0.33, shoeMats[(i + 2) % 6], hash(i, 4) - 0.5);
      solids.push(hid(box(1.5, 0.75, 0.4, RACK.x, 0.37, RACK.z, matWoodL, world, false)));
      // the sign, on a post
      const sg = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.5),
        new THREE.MeshStandardMaterial({ map: tex(makeShoeSign(THREE, cnv)), roughness: 0.7 }));
      sg.position.set(RACK.x + 1.05, 1.35, RACK.z + 0.05); world.add(sg);
      box(0.06, 1.3, 0.06, RACK.x + 1.05, 0.65, RACK.z, matWoodD);
      box(0.96, 0.56, 0.03, RACK.x + 1.05, 1.35, RACK.z + 0.03, matWoodD);
      // HIS pair, which appears on the rack when he takes them off
      pair(0.0, 0.62, 0.02, shoeMats[1], 0, myShoes);
      myShoes.position.set(RACK.x + 0.35, 0, RACK.z); myShoes.visible = false;
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
       round it; the spirit house on its post by the gate; a stray dog asleep
       in the tree's shade; and across the east wall, the ubosot's long white
       flank with its gold windows and stacked roof. */
    {
      cyl(1.85, 1.95, 0.55, BODHI.x, 0.275, BODHI.z, matWhite, 28);
      cyl(1.95, 1.95, 0.08, BODHI.x, 0.58, BODHI.z, matRedD, 28);
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
    }
    // THE DOG, asleep in the planter's shade, breathing
    const dog = new THREE.Group();
    {
      dog.position.set(BODHI.x - 2.35, 0, BODHI.z + 1.2); dog.rotation.y = 0.8; world.add(dog);
      const fur = new THREE.MeshStandardMaterial({ color: 0xb9895a, roughness: 0.95 });
      const body = new THREE.Mesh(new THREE.SphereGeometry(0.3, 14, 10), fur); body.scale.set(1.5, 0.55, 0.75);
      body.position.set(0, 0.17, 0); dog.add(body); dog.userData.body = body;
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.13, 12, 8), fur); head.scale.set(1.2, 0.8, 0.9);
      head.position.set(0.5, 0.11, 0.08); dog.add(head);
      const snout = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 6), fur); snout.scale.set(1.4, 0.7, 0.8);
      snout.position.set(0.64, 0.08, 0.1); dog.add(snout);
      for (const s of [-1, 1]) {
        const ear = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.1, 6), fur);
        ear.position.set(0.47, 0.2, 0.08 + s * 0.07); ear.rotation.z = -0.9; dog.add(ear);
        const leg = new THREE.Mesh(new THREE.CapsuleGeometry(0.035, 0.22, 4, 6), fur);
        leg.position.set(0.3, 0.05, 0.1 + s * 0.12); leg.rotation.z = Math.PI / 2; dog.add(leg);
      }
      const tail = new THREE.Mesh(new THREE.CapsuleGeometry(0.025, 0.28, 4, 6), fur);
      tail.position.set(-0.52, 0.08, -0.12); tail.rotation.set(0, 0.6, Math.PI / 2); dog.add(tail);
      dog.traverse(o => { if (o.isMesh) { o.castShadow = !LOW; o.receiveShadow = true; } });
      solids.push(hid(box(0.9, 0.4, 0.5, dog.position.x + 0.1, 0.2, dog.position.z, matProxy, world, false)));
    }

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
      // two tiers of roof, ridge along z, and the gables at the north and south ends
      for (let t = 0; t < 2; t++) {
        const eave = 6.1 + t * 1.7, ridge = 10.4 + t * 1.4, hw = W / 2 + 1.2 - t * 1.5, zz0 = UBO.z0 - 0.9 + t * 1.6, zz1 = UBO.z1 + 0.9 - t * 1.6;
        const rise = ridge - eave, slope = Math.hypot(rise, hw), ang = Math.atan2(rise, hw);
        for (const s of [-1, 1]) {
          const p = new THREE.Mesh(new THREE.PlaneGeometry(slope, zz1 - zz0), t ? matTile2 : matTile);
          p.rotation.order = 'ZYX'; p.rotation.x = -Math.PI / 2; p.rotation.z = -s * ang;   // tilted about the RIDGE (z), not turned about y
          p.position.set(cx + s * hw / 2, (eave + ridge) / 2, (zz0 + zz1) / 2); world.add(p);
        }
        box(0.2, 0.22, zz1 - zz0, cx, ridge + 0.06, (zz0 + zz1) / 2, matGold);
        for (const zz of [zz0, zz1]) {
          const tri = new THREE.Shape();
          tri.moveTo(-hw * 0.95, 0); tri.lineTo(hw * 0.95, 0); tri.lineTo(0, rise * 0.95); tri.closePath();
          const gb = new THREE.Mesh(new THREE.ShapeGeometry(tri), matGoldC);
          gb.position.set(cx, eave, zz); if (zz === zz0) gb.rotation.y = Math.PI; world.add(gb);
          const cf = [];
          for (let i = 0; i <= 10; i++) { const k = i / 10; cf.push(new THREE.Vector3(cx, ridge + k * 1.2, zz + (zz === zz0 ? -1 : 1) * k * k * 0.7)); }
          world.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(cf), 16, 0.07, 6, false), matGold));
        }
      }
    }

    /* the lanterns, strung from the stall's awning across to the sala's corner */
    {
      const pts = [new THREE.Vector3(-8.4, 2.6, 3.2), new THREE.Vector3(-7.4, 2.35, -0.2)];
      const lm = new THREE.MeshStandardMaterial({ color: 0xc4261c, roughness: 0.6, emissive: 0x3a0804, emissiveIntensity: 0.5 });
      for (let i = 0; i <= 5; i++) {
        const k = i / 5, p = pts[0].clone().lerp(pts[1], k); p.y -= Math.sin(k * Math.PI) * 0.35;
        const l = new THREE.Mesh(new THREE.SphereGeometry(0.16, 10, 8), lm); l.scale.set(1, 1.2, 1); l.position.copy(p); world.add(l);
      }
    }
    // THE BELL TOWER: four posts and a little tiered roof, the bell hanging in it
    const BELL = { x: -11.4, z: -4.6 };
    {
      for (const dx of [-0.8, 0.8]) for (const dz of [-0.8, 0.8]) solids.push(cyl(0.1, 0.1, 3.2, BELL.x + dx, 1.6, BELL.z + dz, matRed, 10));
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
    // potted bougainvillea along the sala's front and the path
    {
      const pot = new THREE.MeshStandardMaterial({ color: 0x9b4a2a, roughness: 0.9 });
      const bloom = [0xd9337a, 0xe0569a, 0xc02468].map(c => new THREE.MeshStandardMaterial({ color: c, roughness: 0.9 }));
      const leaf = new THREE.MeshStandardMaterial({ color: 0x3f6b35, roughness: 0.9 });
      for (const [x, z] of [[-4.6, 0.3], [-6.2, 0.3], [4.6, 0.6], [6.4, 0.6], [-2.8, 8.6], [2.8, 8.6]]) {
        cyl(0.3, 0.22, 0.46, x, 0.23, z, pot, 12);
        const mound = new THREE.Mesh(new THREE.SphereGeometry(0.34, 12, 8), leaf);
        mound.scale.set(1, 0.8, 1); mound.position.set(x, 0.72, z); world.add(mound);
        for (let k = 0; k < 22; k++) {
          const a = hash(k, x * 3) * Math.PI * 2, el = hash(k, z * 5) * 1.2, r = 0.32;
          const b = new THREE.Mesh(new THREE.SphereGeometry(0.06 + hash(k + x, 2) * 0.04, 6, 5), bloom[k % 3]);
          b.position.set(x + Math.cos(a) * Math.cos(el) * r, 0.72 + Math.sin(el) * r * 0.85, z + Math.sin(a) * Math.cos(el) * r); world.add(b);
        }
        solids.push(cyl(0.3, 0.3, 0.5, x, 0.25, z, pot, 8));
        solids[solids.length - 1].visible = false;
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
        spots.push({ x, z, h: 8.5 * (0.8 + hash(i, 17) * 0.6) });
      }
      spots.push({ x: BODHI.x, z: BODHI.z, h: 11.5 });               // the bodhi's crown
      spots.push({ x: -4.6, z: 17.2, h: 5.2 }, { x: 4.6, z: 17.4, h: 4.8 });   // the frangipani outside the gate
      /* v16.1: the tree that stood at (-12.4, -10.6) is where the kuti is now */
      spots.push({ x: -12.6, z: 10.8, h: 6.6 }, { x: -13.4, z: -2.2, h: 7.2 }, { x: 19.0, z: 12.0, h: 6.8 });
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
      proxy.position.y = (opts.seated ? 1.1 : opts.height) / 2 + (opts.seated ? 0.1 : 0); proxy.castShadow = !LOW; group.add(proxy);
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
    const HELP_RY = Math.PI / 2 + 0.5;                 // at rest he faces into the sala, toward the monk
    /* HE SITS RAISED — on a lacquered block on the dais, so the man in front
       of him looks UP at him when he turns round (CP3: level with the stool,
       the decision opened on the top of his head) */
    const AJ_RISE = 0.36;
    const ajarn = mkRig('admintee', { x: AJ.x, y: DAIS_TOP + AJ_RISE, z: AJ.z, ry: 0, height: 1.66,
                                      sizeOn: 'Idle_9', idle: 'Sit_and_Doze_Off', rate: 0.45, seated: true, recolor: whiten,
                                      then: (r) => seatUnder(r, ajSeat) });
    const ajSeat = dais.children.find(c => c.geometry && c.geometry.parameters && c.geometry.parameters.width === 0.62);
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
    const monk = mkRig('botak', { x: MON.x, y: MD_TOP + AJ_RISE, z: MON.z, ry: 0, height: 1.62,
                                  sizeOn: 'restpose', idle: 'Chair_Sit_Idle_M', at: 0.04, seated: true, recolor: saffron,
                                  then: (r) => {
                                    seatUnder(r, monkD.seat);
                                    r.model.traverse(o => {
                                      if (!o.isBone) return;
                                      if (/RightArm(_\d+)?$/.test(o.name) && !r.arm) r.arm = o;
                                      if (/RightHand(_\d+)?$/.test(o.name) && !r.hand) r.hand = o;
                                    });
                                  } });

    /* THE MAN UNDER THE NEEDLE — the botak recruit, on the yant stool, facing
       out, with the Ajarn behind him. When he is done he wais, stands and
       walks out; that is how the player learns it is his turn. */
    let STOOL_TOP = SALA.floor + DAIS.h + 0.465;
    const other = mkRig('botak', { x: CUSH.x, y: SALA.floor + DAIS.h, z: CUSH.z, ry: 0, height: 1.72,
                                   sizeOn: 'restpose', idle: 'Sit_and_Doze_Off', rate: 0.35, seated: true,
                                   then: (r) => {
                                     if (!r.hips || !stool) return;
                                     r.model.updateMatrixWorld(true); r.hips.getWorldPosition(_v);
                                     /* the man is moved onto the stool in x/z (the stool is where
                                        the player will sit too), and the stool's height is his */
                                     r.group.position.x += CUSH.x - _v.x; r.group.position.z += CUSH.z - _v.z;
                                     const base = SALA.floor + DAIS.h;
                                     const top = _v.y - 0.10, h = Math.max(0.2, top - base - 0.05);
                                     stool.scale.y = h / 0.42; stool.position.y = base + h / 2;
                                     if (stoolTop) stoolTop.position.y = base + h + 0.025;
                                     STOOL_TOP = base + h + 0.05;
                                     r.seatGroup = { x: r.group.position.x, z: r.group.position.z };
                                   } });
    const putOther = (on) => {
      other.group.visible = !!on;
      if (!on) return;
      if (other.seatGroup) other.group.position.set(other.seatGroup.x, SALA.floor + DAIS.h, other.seatGroup.z);
      other.group.rotation.y = 0;
      if (other.acts) other.play('Sit_and_Doze_Off', 0.35, 0);
    };

    /* A MAN WAITING on the bench along the west rail — the admin tee in his
       own olive, dozing upright, as one does at half past five in the morning. */
    const bench = new THREE.Group(); world.add(bench);
    const waiter = mkRig('admintee', { x: BENCH.x + 0.1, y: SALA.floor, z: -5.6, ry: Math.PI / 2, height: 1.70,
                                       sizeOn: 'Idle_9', idle: 'Sit_and_Doze_Off', rate: 0.3, seated: true,
                                       then: (r) => {
                                         if (!r.hips) return;
                                         r.model.updateMatrixWorld(true); r.hips.getWorldPosition(_v);
                                         r.group.position.x += BENCH.x - _v.x;
                                       } });

    /* THE STALL AUNTIE — the granny, behind her counter, turned to the path */
    const auntie = mkRig('granny', { x: STALL.x - 0.95, y: 0, z: STALL.z + 0.2, ry: Math.PI / 2, height: 1.55,
                                     idle: 'Stand_and_Chat' });
    /* THE MAN BY THE WALKWAY (v16.1; v16.0's assistant, who stood by the
       Ajarn's dais watching the work) — standing at the sala's north-west
       corner, where the walkway leaves it. When the blessing is done he turns
       to the player and tells him where the Ajarn is (helperTick). */
    const assistant = mkRig('standman', { x: HELP.x, y: SALA.floor, z: HELP.z, ry: HELP_RY, height: 1.70,
                                          idle: 'mixamo.com', rate: 0.8 });

    /* THE TRAY IN HIS HANDS: the offering set, carried low in front of him
       from the stall to the Ajarn. It lives on the camera, like chapter 1's
       note, and only in play. */
    const handTray = mkTray();
    /* carried low and to the left, the hand beside it: at 1.15x and 0.62 m it
       filled the lower half of the frame (CP3) */
    handTray.scale.setScalar(0.72);
    handTray.position.set(-0.17, -0.40, -0.70); handTray.rotation.set(0.62, 0.25, 0);
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
    if (warmSounds) warmSounds(['mk1come', 'mk1chant', 'mk1teach', 'hp1room', 'aj1mat', 'z1sadhu', 'z1room',
                                'roomdoor', 'watersprinkle', 'roomamb',
                                'z1wai', 'z1wait', 'z1warm', 'au1hi', 'au1sell', 'au1shoes',
                                'aj1next', 'aj1sit', 'aj1breathe', 'aj1katha', 'aj1done', 'aj1ask',
                                'yantap', 'yantblow', 'yantwarm', 'e3bell', 'shoesoff', 'barestep',
                                'trayset', 'coins', 'incenselit', 'e3gong',
                                /* fired from walkOut()/ending(), helpers the engine's source scan cannot
                                   read (v10.2) — so warmed here, or the last line over the black is silent */
                                'z1close', 'z1next', 'e3close', 'step']);

    function talk(rig, secs) {
      rig.nod = secs;
      if (rig === auntie && rig.acts) {
        rig.play('Talk_Passionately', 0.85, 0.3);
        after(secs + 0.15, () => { if (auntie.cur === 'Talk_Passionately') auntie.play('Stand_and_Chat', 1, 0.45); });
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
                   wai: { x: WAI.x, y: 1.3, z: WAI.z - 0.6 },
                   present: { x: MD.x - 1.0, y: 1.3, z: MD.z + 1.0 },
                   bless: { x: BLESS.x, y: 1.0, z: BLESS.z },
                   go: { x: KDOOR.x + 0.3, y: 1.7, z: KDOOR.z },
                   wait: { x: WAIT.x, y: 1.0, z: WAIT.z },
                   seat: { x: CUSH.x, y: 1.0, z: DAIS.z + DAIS.d / 2 + 0.55 } }[p];
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
      if (kit) kit.conduct({ note: 'Bought an offering set for the Ajarn.', s: 0, a: 2 });
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
      queueLine('mk1come', () => { monkFace(true); monk.nod = SECS.mk1come; });
      return true;
    }
    /* 4b · THE BLESSING (v16.1). He kneels under the monk's raised seat and
       bows; the monk chants the blessing (the Pali in a Thai monk's mouth) and
       flicks lustral water over him from the silver bowl, three times; then
       the teaching, Chad's words — "blessings don't replace hard work and
       merit" — and he answers "Sadhu", bows, and stands. Laid on the line
       queue so no line is dropped on a slow frame; the flicks are timed from
       the moment the chant actually starts. */
    let blessing = null;                          // { t0, chantAt, bowAt } while kneeling
    const FLICKS = [1.4, 3.5, 5.6];               // seconds into the chant
    function beginBless() {
      if (phase !== 'bless' || blessing) return false;
      yaw.position.x = BLESS.x; yaw.position.z = BLESS.z;
      if (kit) kit.root(true);
      const face = Math.atan2(-(MON.x - BLESS.x), -(MON.z - BLESS.z));
      turnTo(face, 0.9, { y: SALA.floor + 0.98, span: 0.6, lo: -0.9, hi: 0.8 });
      blessing = { t0: dayClock.t, chantAt: -1, bowAt: -1, flick: 0, mark: 0 };
      monkFace(true);
      syncProps();
      if (worldSfx) worldSfx('barestep', 0.45, 0.85);
      after(1.0, () => { if (worldSfx) worldSfx('e3bell', 0.4, 1, panAt(MD.x, MD.z)); });
      /* the blessing keeps its own time whether or not a line sounds (a line
         whose bytes have not arrived is dropped, and every harness runs
         muted): the chant's start is stamped when the queue REACHES it, and
         the queue is held for the chant's and the teaching's own lengths */
      const hold = (secs) => queueFn(() => { if (blessing) speak.until = Math.max(speak.until, blessing.mark + secs); });
      queueGap(2.2);
      queueFn(() => { if (blessing) blessing.chantAt = blessing.mark = dayClock.t; });
      queueLine('mk1chant', () => { monk.nod = SECS.mk1chant * 0.6; });
      hold(SECS.mk1chant + 0.3);
      queueGap(0.9);
      queueFn(() => { if (blessing) blessing.mark = dayClock.t; });
      queueLine('mk1teach', () => { monk.nod = SECS.mk1teach; });
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
        monk.hand.getWorldPosition(_hp);
        whisk.position.copy(_hp);
        camera.getWorldPosition(_to);
        whisk.lookAt(_to.x, _hp.y + 0.35 + monkArmFlick * 0.3, _to.z);
      } else {
        whisk.position.set(bowlPos.x - 0.14, bowlPos.y + 0.07, bowlPos.z);
        whisk.rotation.set(0, Math.PI / 2 + 0.2, 0);
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
      const whenBlack = () => { if (!alive || phase !== 'go') return;
        if (!kit || kit.getFade() >= 0.99 || dayClock.t - entering.t0 > 12) intoRoom(); else after(0.1, whenBlack); };
      after(1.1, whenBlack);
      return true;
    }
    function placeInRoom(at) {
      const p = at || RIN;
      yaw.position.x = p.x; yaw.position.z = p.z;
      yaw.rotation.y = Math.atan2(-((ROOM.x + 0.2) - p.x), -((ROOM.z - 1.2) - p.z));
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
    function waitSeq() {
      after(2.4, () => queueLine('z1wait'));
      after(6.0, () => { if (!heard.has('katha2')) { heard.add('katha2'); queueLine('aj1katha', () => { ajarn.nod = SECS.aj1katha; }, 0.8); } });
      after(21.5, () => { workOn = false; });
      after(22.6, () => sfxAt('yantblow', CUSH.x, CUSH.z - 0.2, 0.85, 2, 12));
      after(24.2, () => otherLeaves());
      after(26.0, () => queueLine('aj1next', () => { ajarn.nod = SECS.aj1next; }));
      after(28.2, () => {
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
    function otherLeaves() {
      if (!other.group.visible) return;
      otherLeaving = { seg: 0, s: 0, t: 0 };
      if (other.acts) { other.play('Walking', 0.95, 0.5); }
    }
    function leaveTick(dt) {
      const L = otherLeaving; if (!L) return;
      const g = other.group;
      if (L.seg >= LEAVE.length - 1) { g.visible = false; otherLeaving = null; after(1.2, () => { roomDoorWant = 0; }); return; }
      const a = LEAVE[L.seg], b = LEAVE[L.seg + 1];
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
      if (other.acts && other.acts.Walking) other.acts.Walking.setEffectiveTimeScale(1.05 / 1.39);
      // through the door and gone
      if (L.seg === LEAVE.length - 2) g.visible = k < 0.6;
    }
    /* 6 · THE STOOL — back to the Ajarn, facing out at the courtyard */
    function sitStool() {
      seated = 'stool'; syncProps();
      yaw.position.x = CUSH.x; yaw.position.z = CUSH.z;
      if (kit) kit.root(true);
      turnTo(Math.PI, 1.1, { y: STOOL_TOP + 0.80, span: 0.9, lo: -0.6, hi: 0.55 });
      if (worldSfx) worldSfx('barestep', 0.5, 0.9);
      setPhase('yant');
      queueGap(0.6);
      queueLine('aj1sit', () => { ajarn.nod = SECS.aj1sit; });
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
      after(1.2, () => { if (!heard.has('katha3')) { heard.add('katha3'); sayLine('aj1katha', 0.7, () => { ajarn.nod = SECS.aj1katha; }, panOf('aj1katha')); } });
      kit.event({ kind: 'heartbeat', label: DATA.words.evYant, brief: DATA.words.evYantBrief,
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
    function stir() {
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
    function workTick(wdt) {
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
      const butt = new THREE.Vector3(AJ.x + 0.2, SALA.floor + (ajarn.seatTop ?? 1.2) + 0.28, AJ.z + 0.45);
      const dir = tip.clone().sub(butt).normalize();
      // held at the middle, the tip 6 cm off the skin, driven in on each strike
      rodG.position.copy(tip).addScaledVector(dir, -0.72 + strikeK * 0.06 - 0.06);
      rodG.lookAt(tip);
    }

    /* ------------------------------------------------------------- hotspots
       Anchors at EYE height (the v7.5 law), on the thing itself. */
    const hotspots = [
      { id: 'stall', pos: { x: STALL.x + 0.55, y: 1.35, z: STALL.z }, radius: 2.6, prompt: DATA.words.hotStall,
        enabled: () => phase === 'stall', onInteract() { return buyOffering(); } },
      { id: 'shoes', pos: { x: RACK.x, y: 1.1, z: RACK.z + 0.1 }, radius: 2.2, prompt: DATA.words.hotShoes,
        enabled: () => phase === 'shoes', onInteract() { return shoesOff(); } },
      { id: 'wai', pos: { x: WAI.x, y: 1.35, z: WAI.z - 0.9 }, radius: 2.2, prompt: DATA.words.hotWai,
        enabled: () => phase === 'wai' && !kneel, onInteract() { return beginWai(); } },
      { id: 'present', pos: { x: MD.x - 0.7, y: 1.2, z: MD.z + 0.95 }, radius: 2.4, prompt: DATA.words.hotPresent,
        enabled: () => phase === 'present', onInteract() { return present(); } },
      { id: 'bless', pos: { x: BLESS.x, y: 1.25, z: BLESS.z - 0.5 }, radius: 2.3, prompt: DATA.words.hotBless,
        enabled: () => phase === 'bless' && !blessing, onInteract() { return beginBless(); } },
      { id: 'door', pos: { x: KDOOR.x + 0.08, y: 1.5, z: KDOOR.z }, radius: 2.2, prompt: DATA.words.hotDoor,
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
      if (phase === 'seat' && !seated && Math.hypot(x - zoneSeat.position.x, z - zoneSeat.position.z) < 0.62) sitStool();
    }
    /* THE BEDS, by where he is and what is happening: the dawn everywhere,
       the chant louder toward the ubosot and softer under the sala's roof,
       the music only under the waiting and the rod */
    let lastMix = 0;
    const mixK = { chant: 0.12, music: 0 };
    function mixBeds(wdt) {
      const st = getState(), x = yaw.position.x, z = yaw.position.z;
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
      if (dog.userData.body) dog.userData.body.scale.y = 0.55 + Math.sin(t * 1.3) * 0.025;
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
      zoneTick(zone, t); zoneTick(zoneSeat, t); zoneTick(zoneBless, t);
      warmK = Math.max(0, warmK - wdt * 0.25);
    }
    function updateNotes(dt, t) {
      const nowW = performance.now() / 1000;
      const wdt = lastMix ? Math.min(0.5, nowW - lastMix) : 0;
      lastMix = nowW;
      // the mixers run in every state (v5.19): a cutscene owns the poses, never the clocks
      for (const r of [ajarn, other, waiter, auntie, assistant, monk]) {
        if (!r.mixer || !r.group.visible) continue;
        headPre(r); if (r === monk) monkArmPre();
        r.mixer.update(dt); r.model && r.model.updateMatrixWorld(true);
        headPost(r, wdt); if (r === monk) monkArmPost(wdt);
      }
      lifeTick(t, wdt);
      mixBeds(wdt);
      leaveTick(dt);
      dropTick(wdt); doorTick(wdt); helperTick(wdt);
      handTray.visible = getState() === 'play' && pIdx(phase) >= 1 && pIdx(phase) <= 3;
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
        yaw.rotation.y = faceAjarn();
        ajarnFace(true);
        setPhase('decide');
        return;
      }
      if (kit) { kit.pose('standing', { secs: 0.05 }); kit.root(false); }
      setPhase(p);
      if (p === 'go') goCall();                     // told again where the Ajarn is
    }

    /* ---------------------------------------------------------- lifecycle */
    function putAjarn() {
      ajarn.group.visible = true; ajarn.nod = 0; ajarn.lookYaw = 0; ajarn.lookPitch = 0;
      if (ajarn.acts) ajarn.play('Sit_and_Doze_Off', 0.45, 0);
    }
    /* WHEN HE SPEAKS TO YOU he sits up: the same rig's other sitting take,
       parked on its upright opening frame (v8.0 measured it: the head is over
       the hips for the first eighth of the clip, then it folds), and his head
       lifted to the man in front of him. The doze is for when he works. */
    function ajarnFace(on) {
      if (!ajarn.acts) return;
      if (on) { ajarn.play('Chair_Sit_Idle_M', 1, 0.6, false, 0.04); ajarn.lookPitch = -0.12; }
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
      booted = false; dayClock.t = 0; lastWall = 0;
      seated = null; kneel = null; turning = null; otherLeaving = null; workOn = true; strikeAt = 0; burst = 0; warmK = 0;
      blessing = null; entering = null; helperLook = false; monkArmK = 0; monkArmFlick = 0;
      kutiK = 0; roomDoorK = 0; roomDoorWant = 0;
      if (kutiLeaf) kutiLeaf.rotation.y = 0; if (roomLeaf) roomLeaf.rotation.y = 0;
      assistant.group.rotation.y = HELP_RY; monkFace(false);
      for (const d of drops) d.life = 0;
      for (const t of stallTrays) t.visible = true;
      putAjarn(); putOther(true);
      if (kit) {
        kit.root(false); kit.pose('standing', { secs: 0.05 });
        kit.daylight(null, 0); kit.presence(0);
        kit.setPhase('stall');
      }
      phase = 'stall';
      syncProps();
    }
    function blockers() {
      const out = [];
      const b = (o, pad = 0.20) => { o.updateWorldMatrix(true, false); const bb = new THREE.Box3().setFromObject(o); bb.expandByScalar(pad); out.push(bb); };
      const solid = (o, pad = 0.14) => { o.updateWorldMatrix(true, false); const bb = new THREE.Box3().setFromObject(o); bb.expandByScalar(pad); bb.min.y = 0; bb.max.y = Math.max(bb.max.y, 1.40); out.push(bb); };
      for (const w of walls) b(w);
      for (const s of solids) solid(s);
      // both daises, the man by the walkway, the waiting man
      for (const D of [DAIS, MD]) out.push(new THREE.Box3(new THREE.Vector3(D.x - D.w / 2 - 0.14, 0, D.z - D.d / 2 - 0.14),
                                                          new THREE.Vector3(D.x + D.w / 2 + 0.14, 1.4, D.z + D.d / 2 + 0.14)));
      out.push(new THREE.Box3(new THREE.Vector3(HELP.x - 0.35, 0, HELP.z - 0.35), new THREE.Vector3(HELP.x + 0.35, 1.8, HELP.z + 0.35)));
      out.push(new THREE.Box3(new THREE.Vector3(BENCH.x - 0.4, 0, BENCH.z1), new THREE.Vector3(BENCH.x + 0.75, 1.4, BENCH.z0)));
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
      for (const r of [ajarn, other, waiter, auntie, assistant, monk]) r.mixer?.stopAllAction();
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
      {
        const room = new THREE.Mesh(new THREE.BoxGeometry(16, 3.2, 12), basic({ color: 0x14161c, side: THREE.BackSide }));
        room.position.set(0, 1.6, 0); off.add(room);
        const carpet = fplane(16, 12, 0, 0.005, 0, basic({ map: tex(makeCarpet(THREE, cnv)) }), off, 0, -Math.PI / 2);
        carpet.material.map.repeat.set(6, 4);
        // ceiling light panels, all off but one strip at the far end
        for (let x = -6; x <= 6; x += 3) for (let z = -4; z <= 4; z += 4) fplane(1.2, 0.6, x, 3.18, z, basic({ color: x === 6 ? 0x5a6470 : 0x23262c }), off, 0, Math.PI / 2);
        // the window wall: the city at night
        const city = fplane(16, 3.0, 0, 1.6, -5.95, basic({ map: tex(makeCity(THREE, cnv)) }), off);
        void city;
        for (let x = -7.5; x <= 7.5; x += 2.5) fbox(0.08, 3.2, 0.1, x, 1.6, -5.9, basic({ color: 0x0b0c10 }), off);
        fbox(16, 0.1, 0.12, 0, 0.9, -5.9, basic({ color: 0x0b0c10 }), off);
        // rows of desks, monitors dark, chairs pushed in
        const deskM = basic({ color: 0x3a3632 }), legM = basic({ color: 0x1e1f22 }), monM = basic({ color: 0x0a0b0d }), chairM = basic({ color: 0x1b1d22 });
        for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) {
          const x = -5.5 + c * 3.4, z = 2.8 - r * 2.8;
          if (r === 1 && c === 2) continue;        // his, built below
          fbox(1.6, 0.04, 0.8, x, 0.74, z, deskM, off);
          fbox(0.04, 0.72, 0.7, x - 0.76, 0.36, z, legM, off); fbox(0.04, 0.72, 0.7, x + 0.76, 0.36, z, legM, off);
          fbox(0.55, 0.34, 0.03, x, 1.0, z - 0.25, monM, off);
          fbox(0.5, 0.5, 0.5, x, 0.45, z + 0.62, chairM, off);
        }
        // HIS desk: three monitors of scrolling code, a lamp, a mug, the empty chair
        const hx = -5.5 + 2 * 3.4, hz = 0;
        const hisDesk = new THREE.Group(); hisDesk.position.set(hx, 0, hz); off.add(hisDesk);
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
        root.userData.code = { cv: codeCv, tex: codeTex, t: 0, lines: [] };
      }

      /* ---- 3 · THE WAREHOUSE ---- */
      const ware = new THREE.Group(); ware.position.set(1000, 0, 0); root.add(ware);
      {
        /* LIT, unlike the night pockets: a warehouse is strip-lit and flat, and
           unlit paint made every rack face the same colour (CP4) */
        const wl = (o) => new THREE.MeshStandardMaterial({ fog: false, roughness: 0.75, ...o });
        const shell = new THREE.Mesh(new THREE.BoxGeometry(20, 6.5, 14), wl({ color: 0x8a8c90, side: THREE.BackSide }));
        shell.position.y = 3.25; ware.add(shell);
        const flo = fplane(20, 14, 0, 0.005, 0, wl({ map: tex(makeWareFloor(THREE, cnv)), roughness: 0.5 }), ware, 0, -Math.PI / 2);
        flo.material.map.repeat.set(4, 3);
        // strip lights, bright
        for (let x = -7; x <= 7; x += 3.5) for (const z of [-3, 3]) fbox(2.2, 0.08, 0.2, x, 6.2, z, basic({ color: 0xf4f7ff }), ware);
        // the roller door at the far end, a crack of daylight under it
        fplane(6, 4.6, 0, 2.3, -6.95, basic({ map: tex(makeRoller(THREE, cnv)) }), ware);
        fplane(6, 0.12, 0, 0.06, -6.9, basic({ color: 0xfff2cc }), ware);
        // THE RACKS: three rows, orange uprights, blue beams, stacked with his boxes
        const boxTex = tex(makeDashBox(THREE, cnv));
        const boxM = wl({ map: boxTex });
        const upM = wl({ color: 0xd8691f, roughness: 0.5 }), beamM = wl({ color: 0x2a55a0, roughness: 0.5 });
        const n = LOW ? 150 : 260;
        const inst = new THREE.InstancedMesh(new THREE.BoxGeometry(0.46, 0.3, 0.34), boxM, n);
        let k = 0; const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), sc = new THREE.Vector3(1, 1, 1), p = new THREE.Vector3();
        for (const rz of [-3.8, 0.2, 4.2]) {
          for (const x of [-8.6, -4.3, 0, 4.3, 8.6]) { fbox(0.1, 4.2, 0.1, x, 2.1, rz - 0.55, upM, ware); fbox(0.1, 4.2, 0.1, x, 2.1, rz + 0.55, upM, ware); }
          for (const y of [0.15, 1.35, 2.55, 3.75]) {
            fbox(17.4, 0.1, 0.08, 0, y, rz - 0.55, beamM, ware); fbox(17.4, 0.1, 0.08, 0, y, rz + 0.55, beamM, ware);
            for (let x = -8.3; x < 8.4 && k < n; x += 0.5) {
              if (hash(x * 7 + rz, y * 3) < 0.12) continue;
              for (let st = 0; st < 3 && k < n; st++) {
                p.set(x, y + 0.2 + st * 0.31, rz + (hash(x, st) - 0.5) * 0.3);
                q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), (hash(x + st, rz) - 0.5) * 0.12);
                m4.compose(p, q, sc); inst.setMatrixAt(k++, m4);
              }
            }
          }
        }
        inst.count = k; inst.frustumCulled = false; ware.add(inst);
        // the packing table in the foreground: a cut-open box, a dashcam, the tape gun, the laptop
        const tbl = new THREE.Group(); tbl.position.set(1.2, 0, 5.4); ware.add(tbl);
        fbox(2.4, 0.06, 1.0, 0, 0.9, 0, basic({ color: 0x8a7254 }), tbl);
        for (const sx of [-1.1, 1.1]) for (const sz of [-0.42, 0.42]) fbox(0.06, 0.88, 0.06, sx, 0.44, sz, basic({ color: 0x3a3a3a }), tbl);
        const ob = fbox(0.5, 0.32, 0.36, -0.55, 1.09, 0.05, boxM, tbl); void ob;
        fplane(0.5, 0.36, -0.55, 1.25, -0.13, basic({ color: 0xa8865a, side: THREE.DoubleSide }), tbl, 0, -0.9);  // a flap, open
        // the camera itself, lifted out: a black body, a lens, a mount
        const cam = new THREE.Group(); cam.position.set(0.05, 0.98, 0.1); cam.rotation.y = 0.5; tbl.add(cam);
        fbox(0.12, 0.07, 0.06, 0, 0, 0, basic({ color: 0x151517 }), cam);
        const lens = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.02, 16), basic({ color: 0x2a3444 }));
        lens.rotation.x = Math.PI / 2; lens.position.set(0.02, 0, 0.04); cam.add(lens);
        const glint = new THREE.Mesh(new THREE.CircleGeometry(0.008, 10), basic({ color: 0x9fc4ff }));
        glint.position.set(0.026, 0.006, 0.051); cam.add(glint);
        fbox(0.04, 0.04, 0.03, 0, 0.055, -0.01, basic({ color: 0x222226 }), cam);
        // the laptop: its screen is the sales chart, rising
        const lap = new THREE.Group(); lap.position.set(0.75, 0.93, 0.0); lap.rotation.y = -0.45; tbl.add(lap);
        fbox(0.36, 0.015, 0.25, 0, 0, 0, basic({ color: 0x9a9ea4 }), lap);
        const chartCv = cnv(256), chartTex = new THREE.CanvasTexture(chartCv[0]); chartTex.colorSpace = THREE.SRGBColorSpace; madeTex.push(chartTex);
        const scrn = fplane(0.34, 0.22, 0, 0.12, -0.12, basic({ map: chartTex }), lap, 0, -0.25);
        void scrn;
        root.userData.chart = { cv: chartCv, tex: chartTex, k: 0 };
        // the tape gun, and a phone lighting up with orders
        fbox(0.16, 0.12, 0.05, -1.0, 1.0, 0.2, basic({ color: 0xb03a2e }), tbl);
        const ph = fplane(0.07, 0.14, 0.4, 0.935, 0.3, basic({ color: 0x0c0c0e }), tbl, 0, -Math.PI / 2);
        root.userData.phone = ph;
        // a pallet jack and a pallet of boxes by the door
        fbox(1.2, 0.14, 1.0, -5.0, 0.07, -5.2, basic({ color: 0x8a6a42 }), ware);
        for (let i = 0; i < 12; i++) fbox(0.46, 0.3, 0.34, -5.3 + (i % 3) * 0.48, 0.3 + Math.floor(i / 6) * 0.31, -5.4 + (Math.floor(i / 3) % 2) * 0.36, boxM, ware);
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
        // the world outside: a cloud sea at dawn, painted on a curved wall far off
        const out = new THREE.Mesh(new THREE.CylinderGeometry(60, 60, 60, 40, 1, true, Math.PI / 2 - 1.2, 2.4),
          basic({ map: tex(makeCloudSea(THREE, cnv)), side: THREE.BackSide }));
        out.position.set(0, 1.4, 0); plane.add(out);
        /* the wing, reaching out and swept back below the window. Drawn in the
           plane of the ground: with rotation.x = -PI/2 a shape point (x, y)
           lands at world (x, 0, -y), so the outline is written as (x, -z) */
        const wing = new THREE.Shape();
        wing.moveTo(0.9, 0.6); wing.lineTo(14.0, -6.0); wing.lineTo(14.4, -7.6); wing.lineTo(0.9, -3.6); wing.closePath();
        const wm = new THREE.Mesh(new THREE.ShapeGeometry(wing), basic({ color: 0x6f757c, side: THREE.DoubleSide }));
        wm.rotation.x = -Math.PI / 2; wm.position.y = 0.15; plane.add(wm);
        // a lighter leading edge catching the dawn, and the winglet at the tip
        const le = new THREE.Shape(); le.moveTo(0.9, 0.6); le.lineTo(14.0, -6.0); le.lineTo(14.0, -6.25); le.lineTo(0.9, 0.3); le.closePath();
        const lem = new THREE.Mesh(new THREE.ShapeGeometry(le), basic({ color: 0xb8a898, side: THREE.DoubleSide }));
        lem.rotation.x = -Math.PI / 2; lem.position.y = 0.16; plane.add(lem);
        const tip = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 1.2), basic({ color: 0x2c3e5c, side: THREE.DoubleSide }));
        tip.position.set(14.2, 0.75, 6.8); tip.rotation.y = Math.PI / 2; plane.add(tip);
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
        wall.position.set(0, 1.3, 0); wall.rotation.y = -Math.PI / 2; wall.position.x = 0.62; plane.add(wall);
        // the shade, half up, and the window's own inner frame
        const shadeP = fplane(0.4, 0.3, 0.61, 1.52, 0, basic({ color: 0x6a655e, side: THREE.DoubleSide }), plane, -Math.PI / 2);
        void shadeP;
        const frame = new THREE.Mesh(new THREE.TorusGeometry(0.29, 0.03, 6, 28), basic({ color: 0xbdb8ae }));
        frame.material.color.setHex(0x6e6a63);
        frame.scale.set(0.72, 1.05, 1); frame.rotation.y = Math.PI / 2; frame.position.set(0.6, 1.3, 0); plane.add(frame);
        // the seat in front, the armrest, the overhead's glow
        fbox(0.12, 0.9, 0.55, 0.3, 0.8, -0.72, basic({ color: 0x2a3550 }), plane);
        fbox(0.5, 0.08, 0.08, 0.3, 0.64, 0.35, basic({ color: 0x6a6a6a }), plane);
        fplane(2.4, 0.3, 0.1, 2.3, 0, basic({ color: 0x3c3a37 }), plane, -Math.PI / 2, 0);
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
        H.k = Math.min(1, H.k + 0.004);
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
      world, noteTex, blockers: blockers(),
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
      ajarn, other, waiter, auntie, assistant, monk, putAjarn, putOther, myShoes, handTray, film,
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
                     beds: DATA.ambience.beds.map(b => [b[0], +b[1].toFixed(3)]) }),
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
    x.fillStyle = '#2f6a45'; x.fillRect(0, 0, S, S);
    for (let row = 0; row < 10; row++) for (let col = 0; col < 10; col++) {
      const px = col * 13 + (row % 2) * 6.5, py = row * 12;
      x.fillStyle = row % 3 ? '#3f8a58' : '#d9a63c';
      x.beginPath(); x.arc(px, py, 6, 0, Math.PI); x.fill();
      x.strokeStyle = '#1c4029'; x.lineWidth = 1; x.stroke();
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
  /* v16.1 · the yant cloths (pha yant) on the room's walls: off-white cloth,
     a red border, the design in black ink — k 0 the five lines (Hah Taew), 1
     the nine spires (Gao Yord), 2 the twin tigers, 3 the eight directions
     (Paed Tidt) — and every design ringed with lines of script, drawn as
     small cursive strokes (the Khom letters are not in any font a phone has) */
  function makeYantCloth(THREE, cnv, k) {
    const S = 256, [c, x] = cnv(S), r = rng(97 + k * 31);
    x.fillStyle = '#efe6d2'; x.fillRect(0, 0, S, S);
    x.strokeStyle = '#9a1c14'; x.lineWidth = 7; x.strokeRect(8, 8, S - 16, S - 16);
    x.strokeStyle = '#1a1410'; x.fillStyle = '#1a1410'; x.lineCap = 'round';
    const glyphs = (x0, y0, w, h) => {
      x.lineWidth = 1.6;
      for (let gx = x0; gx < x0 + w - 6; gx += 7 + r() * 3) {
        x.beginPath(); const cy = y0 + h / 2;
        x.moveTo(gx, cy + 2); x.quadraticCurveTo(gx + 3, cy - 4 - r() * 3, gx + 5, cy + 1);
        if (r() < 0.6) { x.moveTo(gx + 1, cy - 3); x.arc(gx + 1.5, cy - 4, 1.4, 0, Math.PI * 2); }
        x.stroke();
      }
    };
    if (k === 0) {
      for (let i = 0; i < 5; i++) { const y = 70 + i * 26; x.lineWidth = 2; x.beginPath(); x.moveTo(40, y + 12); x.quadraticCurveTo(128, y + 2, 216, y + 12); x.stroke(); glyphs(44, y - 2, 168, 12); }
    } else if (k === 1) {
      for (let i = 0; i < 9; i++) { const cx = 128 + (i - 4) * 18, top = 48 + Math.abs(i - 4) * 12; x.lineWidth = 2.2; x.beginPath(); x.moveTo(cx - 8, 150); x.lineTo(cx, top); x.lineTo(cx + 8, 150); x.stroke(); }
      x.lineWidth = 2; x.strokeRect(64, 150, 128, 50); x.beginPath(); x.arc(128, 175, 16, 0, Math.PI * 2); x.stroke();
      glyphs(40, 206, 176, 12); glyphs(40, 222, 176, 12);
    } else if (k === 2) {
      for (const sd of [-1, 1]) {
        x.save(); x.translate(128 + sd * 44, 132); x.scale(sd, 1);
        x.lineWidth = 2.4; x.beginPath(); x.moveTo(30, 30); x.quadraticCurveTo(0, -10, -30, -24); x.quadraticCurveTo(-40, -30, -34, -38);
        x.moveTo(30, 30); x.lineTo(34, 50); x.moveTo(8, 22); x.lineTo(6, 48); x.moveTo(-14, 6); x.lineTo(-26, 40); x.stroke();
        x.beginPath(); x.arc(-32, -40, 9, 0, Math.PI * 2); x.stroke();
        for (let j = 0; j < 4; j++) { x.beginPath(); x.moveTo(-10 + j * 10, 0); x.lineTo(-4 + j * 10, 16); x.stroke(); }
        x.restore();
      }
      glyphs(40, 40, 176, 12); glyphs(40, 206, 176, 12); glyphs(40, 222, 176, 12);
    } else {
      x.lineWidth = 2;
      for (const rr of [30, 56, 84]) { x.beginPath(); x.arc(128, 128, rr, 0, Math.PI * 2); x.stroke(); }
      for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2; x.beginPath(); x.moveTo(128 + Math.cos(a) * 30, 128 + Math.sin(a) * 30); x.lineTo(128 + Math.cos(a) * 100, 128 + Math.sin(a) * 100); x.stroke(); }
      for (let i = 0; i < 8; i++) { const a = (i + 0.5) / 8 * Math.PI * 2; glyphs(128 + Math.cos(a) * 64 - 10, 128 + Math.sin(a) * 64 - 6, 22, 12); }
      x.beginPath(); x.arc(128, 128, 8, 0, Math.PI * 2); x.fill();
    }
    // a red seal stamp in a corner, the master's
    x.fillStyle = 'rgba(160,30,20,0.85)'; x.beginPath(); x.arc(208, 212, 11, 0, Math.PI * 2); x.fill();
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
    x.fillText('OFFERING SET', S / 2, 36);
    x.font = '20px sans-serif';
    x.fillText('Lotus · Candle · Incense', S / 2, 72);
    x.fillStyle = '#f6c228'; x.font = 'bold 40px sans-serif'; x.fillText('฿ 100', S / 2, 128);
    x.restore();
    return done(THREE, c, false);
  }
  function makeUboWindow(THREE, cnv) {
    const S = 256, [c, x] = cnv(S);
    x.fillStyle = '#efe8da'; x.fillRect(0, 0, S, S);
    // a tall window with a pointed gilded crown above it, red shutters open
    x.fillStyle = '#d9a63c';
    x.beginPath(); x.moveTo(40, 80); x.lineTo(128, 6); x.lineTo(216, 80); x.closePath(); x.fill();
    x.fillStyle = '#8a1a12'; x.beginPath(); x.moveTo(62, 76); x.lineTo(128, 24); x.lineTo(194, 76); x.closePath(); x.fill();
    x.fillStyle = '#d9a63c'; x.fillRect(58, 80, 140, 172);
    x.fillStyle = '#1a1210'; x.fillRect(74, 94, 108, 150);
    x.fillStyle = '#9c1f16'; x.fillRect(34, 94, 38, 150); x.fillRect(184, 94, 38, 150);
    x.strokeStyle = '#d9a63c'; x.lineWidth = 3; x.strokeRect(38, 100, 30, 138); x.strokeRect(188, 100, 30, 138);
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
    sfx(2.6, 'z1pro1');                               // 4.28 s → 6.88
    fade(8.7, 9.4, 0, 1);

    // 2 · THE OFFICE AT NIGHT (9.4 – 19.4)
    const HD = at(P.off, 1.3, 1.0, 0);
    fade(9.6, 10.6, 1, 0);
    camTo(9.4, 19.4, at(P.off, 4.8, 1.55, 3.9), at(P.off, 1.95, 1.22, 1.15), smoothK);
    yawTo(9.4, 19.4, faceFrom(P.off.x + 4.8, P.off.z + 3.9, HD.x, HD.z - 0.4), faceFrom(P.off.x + 1.95, P.off.z + 1.15, HD.x - 0.05, HD.z - 0.25), smoothK);
    pitchTo(9.4, 19.4, -0.10, -0.16, smoothK);
    sfx(9.7, 'officehum', 0.55);
    sfx(10.3, 'keytype', 0.55);
    sfx(11.0, 'z1pro2');                              // 4.13 s → 15.13
    sfx(15.4, 'keytype', 0.4);
    fade(18.7, 19.4, 0, 1);

    // 3 · THE WAREHOUSE (19.4 – 33.6): down the aisle of his own boxes, then the table
    fade(19.6, 20.5, 1, 0);
    camTo(19.4, 27.0, at(P.ware, 8.0, 2.1, 2.2), at(P.ware, 1.6, 1.8, 2.2), rawK);
    yawTo(19.4, 27.0, faceFrom(P.ware.x + 8, P.ware.z + 2.2, P.ware.x - 8, P.ware.z + 2.0), faceFrom(P.ware.x + 1.6, P.ware.z + 2.2, P.ware.x - 6, P.ware.z + 2.6), rawK);
    pitchTo(19.4, 27.0, 0.05, -0.02, smoothK);
    camTo(27.0, 33.6, at(P.ware, 1.6, 1.8, 2.2), at(P.ware, 2.55, 1.30, 6.2), smoothK);
    yawTo(27.0, 33.6, faceFrom(P.ware.x + 1.6, P.ware.z + 2.2, P.ware.x - 6, P.ware.z + 2.6), faceFrom(P.ware.x + 2.55, P.ware.z + 6.2, P.ware.x + 1.75, P.ware.z + 5.35), smoothK);
    pitchTo(27.0, 33.6, -0.02, -0.42, smoothK);
    sfx(19.8, 'wareamb', 0.6);
    sfx(20.4, 'taperip', 0.7);
    sfx(20.6, 'z1pro3');                              // 5.88 s → 26.48
    sfx(24.2, 'orderchime', 0.45);
    sfx(26.8, 'z1pro4');                              // 6.27 s → 33.07, under the dip
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
    sfx(35.0, 'z1pro5');                              // 6.43 s → 41.43
    fade(41.7, 42.4, 0, 1);

    // 5 · THE PLANE WINDOW AT DAWN (42.4 – 50.2)
    fade(42.6, 43.6, 1, 0);
    camTo(42.4, 50.2, at(P.plane, 0.05, 1.28, 0.26), at(P.plane, 0.22, 1.31, 0.12), smoothK);
    yawTo(42.4, 50.2, faceFrom(P.plane.x, P.plane.z + 0.26, P.plane.x + 3, P.plane.z - 0.2), faceFrom(P.plane.x + 0.22, P.plane.z + 0.12, P.plane.x + 3, P.plane.z + 0.3), smoothK);
    pitchTo(42.4, 50.2, -0.30, -0.22, smoothK);
    tr(42.4, 50.2, k => { api.yaw.position.y += Math.sin(k * 40) * 0.0012; });
    sfx(42.5, 'cabinhum', 0.6);
    sfx(43.3, 'seatchime', 0.5);
    sfx(44.0, 'z1pro6');                              // 5.15 s → 49.15
    fade(49.5, 50.2, 0, 1);

    // 6 · THE WAT, at dawn: through the gate, to where play begins (50.2 – 62)
    step(50.2, () => { armR.visible = false; });
    fade(50.5, 52.4, 1, 0);
    sfx(50.3, 'watamb', 0.7);
    sfx(50.6, 'e3chant', 0.45);
    camTo(50.2, 60.4, { x: 0.2, y: 1.62, z: 26.0 }, { x: 0, y: 1.62, z: 12.4 }, smoothK);
    yawTo(50.2, 60.4, faceFrom(0.2, 26, 0.6, 0), 0, smoothK);
    pitchTo(50.2, 56.0, 0.20, 0.10, smoothK);
    pitchTo(56.0, 60.4, 0.10, 0.02, smoothK);
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
    const p0 = P0(s), top = { x: 0.35, y: 1.62, z: -1.2 }, rack = { x: 2.85, y: 1.62, z: 0.85 },   // clear of the naga at x 1.9 (CP5)
          yard = { x: 0.6, y: 1.62, z: 5.4 };
    const RD = stage.RDOOR, door = { x: RD.x + 0.05, y: 1.62, z: RD.z - 0.6 };      // just inside the room's door
    // the wai: the head goes down and comes up
    pitchTo(T, T + 0.8, s.pitchX, -0.55, smoothK);
    pitchTo(T + 0.8, T + 1.7, -0.55, 0.0, smoothK);
    sfx(T + 0.3, 'e3bell', 0.4);
    /* he stands — ON the dais, so the eye is the dais's height over a
       standing man's — turns to the steps, and steps down off the front edge
       to the sala floor before he walks */
    const up = { x: p0.x - 0.15, y: stage.DAIS_TOP + 1.58, z: p0.z + 0.25 };
    const down = { x: p0.x - 0.35, y: 1.62, z: stage.DAIS.z + stage.DAIS.d / 2 + 0.55 };
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
    const outYaw = faceFrom(top.x, top.z, rack.x, rack.z);
    camTo(T + 7.6, T + 8.4, top, top, rawK);
    yawTo(T + 7.6, T + 8.2, outYaw, outYaw, rawK);
    pitchTo(T + 7.6, T + 8.2, 0.0, 0.0, rawK);
    fade(T + 7.7, T + 8.6, 1, 0);
    // down the steps to the rack, and his shoes
    camTo(T + 8.4, T + 11.0, top, rack, smoothK);
    yawTo(T + 8.2, T + 10.6, outYaw, faceFrom(rack.x, rack.z, 2.75, -0.55), smoothK);
    pitchTo(T + 9.6, T + 11.0, 0.0, -0.62, smoothK);
    sfx(T + 11.4, 'shoesoff', 0.8);
    step(T + 11.8, () => { stage.myShoes.visible = false; });
    pitchTo(T + 12.4, T + 13.2, -0.62, 0.0, smoothK);
    // out across the courtyard, toward the gate and the sun
    yawTo(T + 12.8, T + 14.2, faceFrom(rack.x, rack.z, 2.75, -0.55), Math.PI + 0.05, smoothK);
    camTo(T + 13.4, T + 20.6, rack, yard, rawK);
    sfx(T + 13.8, 'step', 0.5); sfx(T + 14.6, 'step', 0.5); sfx(T + 15.4, 'step', 0.5); sfx(T + 16.2, 'step', 0.5);
    sfx(T + 17.0, 'step', 0.5); sfx(T + 17.8, 'step', 0.5); sfx(T + 18.6, 'step', 0.5); sfx(T + 19.4, 'step', 0.5);
    // one last look back at the sala
    yawTo(T + 20.4, T + 22.4, Math.PI + 0.05, faceFrom(yard.x, yard.z, 0.2, -6), smoothK);
    pitchTo(T + 20.4, T + 22.4, 0.0, 0.10, smoothK);
    // and the lens leaves him, rising and drawing back over the courtyard
    const hi = { x: 0.3, y: 6.4, z: 12.2 };
    tr(T + 22.4, T + 30.9, k => {
      const e = smooth(k);
      api.yaw.position.set(yard.x + (hi.x - yard.x) * e, yard.y + (hi.y - yard.y) * e, yard.z + (hi.z - yard.z) * e);
      api.yaw.rotation.y = faceFrom(api.yaw.position.x, api.yaw.position.z, 0.2, -6);
      api.pitch.rotation.x = 0.10 + 0.14 * e;
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
