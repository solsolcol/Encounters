/* Episode 4 · Chapter 3 · "I Finally Found My Answers"
   ---------------------------------------------------------------------------
   THE THIRD CHAPTER OF CASE FILE 4, "The Teacher In White": S1·12. For years he has carried the same questions and
   nobody could answer them. He goes up to a Wai Kru in Udon Thani with the group from the forum. It is the loudest,
   brightest day he has seen: a dozen masters of every kind, a few hundred people in white, petals in everybody's
   hair. One man in white holds his eyes. The next morning he is brought to him, tells him everything, and is
   answered. What Grandmaster Pho teaches first is control: to open, and to close. Then he says where the road goes,
   and waits.

   THIS FILE IS GENERATED (masters/v26.0/assemble.py, from masters/v26.0/parts/*.js): edit the parts and assemble
   again, never this file. docs/V26.0-E4C3-PLAN.md is the design (§4 every beat and line); docs/V26.0-E4C3-BUILD.md is
   where the build stands; masters/v26.0/script/lines.py is every line it speaks.

   THE ONE IDEA (the plan's §3.7): the world is loud and he is shut; one man in white is quiet and open. Noise against
   stillness, colour against white, many against one; at the close the two meet, in a bai sri held between four hands.

   THE PLACE IS CHAD'S PHOTOGRAPHS (11 Nov 2026: "You have to build out this chapter environment exactly to how the
   photos look like"): Grandmaster Pho's own Wai Kru, outdoors on bright green turf before a wooden hall with a red
   tiled roof. The tracker's §10 is the ground measured out from the twelve photographs (x east, z south, the origin
   the middle of the turf), and every place below is that plan's. The photographs themselves are not in this
   repository (it is public) and nobody in them is copied.

   FAIRNESS (the standing rule: no practice and no practitioner is ever the villain). Every master here is sincere and
   kind; the trances are other people's devotion, in daylight, with their friends standing by, never played for a
   scare or a laugh; Grandmaster Pho is kind in all four endings, and what each costs comes from the player's own
   answer. Nothing of the trade, no prediction, no miracle, no word against another master. GOLD is his alone.

   HE IS NEVER SEEN: every shot of every film is his eyes. NO HAUNTING (`ghost: null`): the one moment of fear is his
   own hands beginning to move, and it is answered by a look. THE ENDING STAYS IN THE PRESENT ("Tomorrow we begin."):
   his cultivation is what the later chapters are for (the plan's §1.2). */

(() => {
  'use strict';

  let S = null;

  /* ---------------------------------------------------- the light (the plan's §3.7: three movements, three looks)
     Light is presets and painted light, never a lamp added or removed on screen (v15.1). x is east and z south, so a
     key at (17, 20, 10) is the photographs' sun: east-south-east, about 45 degrees up (photograph 10's shadows). */
  const sky = (o) => Object.assign({ stars: 0, moon: 0, sun: 0, clouds: 0 }, o);
  const DAY1 = sky({                  // day one, late morning: hard sun, a deep clear blue, colour at full strength
    stops: [[0.00, '#cfe2f2'], [0.10, '#a6cbee'], [0.30, '#69a5e4'], [0.60, '#3f82d6'], [1.00, '#2b67c2']],
    bg: 0xbcd6ee, fog: [0xcfdfee, 0.0022],
    hemi: [0xe2eeff, 0x7a8452, 1.02], key: [0xfff3de, 2.05, 17, 20, 10], fill: [0xbcd4f0, 0.36],
    sun: 1, clouds: 0.22,
    vmHemi: [0xe8f0ff, 0x8a906c, 1.0], vmKey: [0xfff0d8, 0.95] });
  const NIGHT = sky({                 // the night between: candles only, hundreds of them; black and gold
    stops: [[0.00, '#1a1620'], [0.12, '#14121c'], [0.35, '#0e0e18'], [0.65, '#090a12'], [1.00, '#05060c']],
    bg: 0x08090f, fog: [0x0c0b10, 0.012],
    hemi: [0x3a3c58, 0x1a130c, 0.42], key: [0xffb060, 0.55, 0, 3, -11], fill: [0x4a5078, 0.16],
    stars: 0.9, moon: 0.35,
    vmHemi: [0x3a3c58, 0x1a130c, 0.4], vmKey: [0xffb868, 0.4] });
  const DAWN = sky({                  // day two, early: a low gold sun, ground mist, long shadows across the turf
    stops: [[0.00, '#f6d2a2'], [0.08, '#f2cfae'], [0.24, '#d4d2cc'], [0.55, '#9fbfdc'], [1.00, '#6f9ccc']],
    bg: 0xead2b2, fog: [0xead8bc, 0.0085],
    hemi: [0xffe4c2, 0x6c6a4a, 0.84], key: [0xffc27c, 1.7, 22, 7.5, 9], fill: [0xb0c6e2, 0.3],
    sun: 1, clouds: 0.35,
    vmHemi: [0xffeeda, 0x8e866a, 0.92], vmKey: [0xffd8a4, 0.85] });
  const OPENED = sky({                // the same dawn with the door open: the light widened, warmer and higher (OPEN)
    stops: [[0.00, '#fff0cc'], [0.08, '#ffe9c4'], [0.24, '#f2e6d6'], [0.55, '#c2daf0'], [1.00, '#8fb8e4']],
    bg: 0xfff0d4, fog: [0xfff0d0, 0.0105],
    hemi: [0xfff2dc, 0x8a8658, 1.18], key: [0xffd696, 2.3, 22, 7.5, 9], fill: [0xd0def0, 0.44],
    sun: 1, clouds: 0.35,
    vmHemi: [0xfff6e6, 0xa29a78, 1.15], vmKey: [0xffe2b4, 1.05] });
  const SHUT = sky({                  // ending D: closed, and staying closed; the same morning gone plain and flat
    stops: [[0.00, '#dcdcd8'], [0.08, '#d6d8d8'], [0.24, '#c8ced4'], [0.55, '#aebccc'], [1.00, '#92a6be']],
    bg: 0xd4d6d4, fog: [0xd6d8d6, 0.007],
    hemi: [0xe6e8ea, 0x74746a, 0.9], key: [0xf2ece2, 1.0, 22, 9, 9], fill: [0xc4ccd6, 0.34],
    sun: 0.5, clouds: 0.5,
    vmHemi: [0xeceef0, 0x8a8a80, 0.9], vmKey: [0xf2ece2, 0.7] });
  const AFTERNOON = sky({             // day two, the afternoon (ending B's long sit): the sun gone west and yellow
    stops: [[0.00, '#f4e2b4'], [0.10, '#e6dab6'], [0.30, '#b6cadc'], [0.60, '#7ea8d6'], [1.00, '#5688c6']],
    bg: 0xe6dcba, fog: [0xe8dcb8, 0.004],
    hemi: [0xfff0d0, 0x74744a, 0.96], key: [0xffd88c, 1.75, -20, 9, 6], fill: [0xb8cce6, 0.32],
    sun: 1, clouds: 0.3,
    vmHemi: [0xfff2da, 0x8e8a66, 0.95], vmKey: [0xffe0a4, 0.9] });
  const DUSK = sky({                  // day two, dusk: the bulbs under the shed's roof come on (painted, never a lamp)
    stops: [[0.00, '#f0a878'], [0.10, '#d89a84'], [0.30, '#8e86a8'], [0.60, '#4e5a8c'], [1.00, '#2c3866']],
    bg: 0x8e7a86, fog: [0x9a8088, 0.006],
    hemi: [0xd8b4a4, 0x3c3a34, 0.62], key: [0xff9c5c, 0.85, -24, 4, 3], fill: [0x7884b4, 0.26],
    sun: 0.6, clouds: 0.4, stars: 0.15,
    vmHemi: [0xdcc0b0, 0x4a4640, 0.66], vmKey: [0xffa868, 0.55] });
  const PRESETS = { DAY1, NIGHT, DAWN, OPENED, SHUT, AFTERNOON, DUSK };

  /* every line's length: an ESTIMATE at the speaker's pace until its take is measured at M7 (the registry will carry
     the same numbers); the queue books its window by it and every film's times are built from it, so a re-said line
     moves what follows it. The names are QUOTED on purpose: build.py gives a sound to a chapter's own pack only when
     the chapter names it in quotes (v21.1). Written by masters/v26.0/script/secs.py from masters/v26.0/script/lines.py. */
  /* SECS BEGIN */
  const SECS = {      // 0 of 104 MEASURED from their takes; the rest estimated at the speaker's pace
    /* him */
    'q3o1': 6, 'q3o2': 2.52, 'q3o3': 4.26, 'q3o4': 6.44, 'q3o5': 12.19, 'q3o6': 7.31, 'q3v': 6.18, 'q3p1': 1.22,
    'q3m0': 5.31, 'q3m1': 9.05, 'q3w1': 2.96, 'q3w2': 6, 'q3w3': 8.18, 'q3u1': 2.27, 'q3u2': 4.01, 'q3u3': 9.23,
    'q3c1': 3.57, 'q3c2': 3.39, 'q3c3': 8.36, 'q3t1': 6, 'q3t2': 9.23, 'q3t3': 10.1, 'q3t4': 6.44, 'q3t5': 7.92,
    'q3t6': 6.44, 'q3t7': 12.45, 'q3t8': 1.22, 'q3a1': 9.23, 'q3A0': 3.57, 'q3A1': 8.28, 'q3A2': 5.75, 'q3A3': 8.79,
    'q3B0': 8.54, 'q3B1': 17.34, 'q3B2': 1.83, 'q3B3': 7.05, 'q3B4': 2.27, 'q3B5': 6.62, 'q3C0': 6.65, 'q3C1': 8.79,
    'q3C2': 2.09, 'q3C3': 1.22, 'q3C4': 6.62, 'q3D0': 7.23, 'q3D1': 4.26, 'q3D2': 8.54, 'q3D3': 12.01, 'q3D4': 6.18,
    'q3D5': 9.23, 'q3z1': 10.1, 'q3K1': 12.52, 'q3A': 4.44, 'q3B': 6.18, 'q3C': 4.44, 'q3D': 5.75,
    /* Ton */
    'tn3a1': 3.86, 'tn3a2': 7.79, 'tn3d1': 3.03, 'tn3m1': 2.2, 'tn3m2': 5.06, 'tn3c1': 7.38, 'tn3c2': 4.88,
    'tn3n1': 2.61, 'tn3A1': 2.85,
    /* the woman at his bench */
    'ds3c1': 7.07,
    /* Grandmaster Pho */
    'ph3g1': 6.5, 'ph3n1': 10.71, 'ph3n2': 5.97, 'ph3n3': 9.13, 'ph3n4': 10.9, 'ph3n5': 8.95, 'ph3n6': 11.76,
    'ph3n7': 7.75, 'ph3g2': 1.4, 'ph3g3': 13.87, 'ph3g4': 6.85, 'ph3g5': 6.5, 'ph3b0': 3.69, 'ph3b1': 0.9,
    'ph3b2': 0.9, 'ph3b3': 3.69, 'ph3b4': 4.39, 'ph3bx': 0.9, 'ph3by': 5.79, 'ph3b5': 6.32, 'ph3p1': 5.79,
    'ph3p2': 5.27, 'ph3p3': 5.27, 'ph3A1': 4.21, 'ph3A2': 7.55, 'ph3B1': 1.4, 'ph3B2': 5.79, 'ph3B3': 1.93,
    'ph3B4': 4.56, 'ph3C1': 9.85, 'ph3C2': 3.69, 'ph3C3': 10.02, 'ph3D1': 4.21, 'ph3D2': 6.85, 'ph3D3': 3.16,
    'ph3D4': 3.69, 'ph3z0': 8.6, 'ph3z1': 9.13, 'ph3z2': 1.93
  };
  /* SECS END */

  /* A FILM'S TIMES are built from SECS: a list of ['line', gap] (the line starts where the last thing ended; `gap`
     seconds follow it), [secs] (a pause) and ['@mark'] (a named moment). The answer maps every line and mark to its
     start on the film's own clock, and `end` to where the list ends, so the cues (below the build) and the pictures
     (inside it) read the same numbers, and a re-measured take moves everything after it (v5.15). */
  function tl(start, list) {
    const T = {}; let t = start;
    for (const it of list) {
      if (typeof it[0] === 'number') { t += it[0]; continue; }
      if (it[0][0] === '@') { T[it[0].slice(1)] = t; continue; }
      T[it[0]] = t; t += (SECS[it[0]] || 2.5) + (it[1] || 0);
    }
    T.end = t;
    return T;
  }

  const DATA = {
    id: 3,
    episode: 4,
    title: 'I Finally Found My Answers',
    cardLabel: 'Chapter 3',
    cardTitle: 'I Finally Found My Answers',
    brief: 'A Wai Kru in Udon Thani, with the group from the forum. A dozen masters in one place, and the questions you have carried for years.',
    /* the prompt is the shape of the one decision Chad wrote himself for a chapter like this (episode 2 chapter 5's
       "he is waiting for an answer") */
    prompt: 'He has shown you the first step and told you where the road goes. He is waiting for your answer.',
    /* THE DECISION (the plan's §4.4). The four options are CHAD'S, in his words and his order (11 Nov 2026): "1. Accept
       your path 2. Challenge the path 3. Ask why 4. Ask to make it stop ... regardless, all options still lead to him
       accepting his path and mission". The ranks are the tracker's default D1 (his to change: data only), after the
       verdicts he gave in episode 2 chapter 5. Each card's lesson is Master Z's own words first (S1·06, S1·06, S1·12,
       S2·03), then what you did. */
    choices: [
      { k: 'A', text: 'Accept your path',
        d: { sanity: 6, awareness: 6, wisdom: 18 }, verdict: 'best',
        say: 'I said yes. He made me say what to.',
        teach: 'What matters is what you do once the path opens. It opened, and you said yes to all of it, in its order.' },
      { k: 'B', text: 'Challenge the path',
        d: { sanity: -6, awareness: 3, wisdom: -9 }, verdict: 'bad',
        say: 'I told him I never chose it. He asked who had carried me.',
        teach: 'Look back honestly at your own steps and you will usually find that none of them felt like a turning point at the time. You never chose the road, and you took every step of it yourself.' },
      { k: 'C', text: 'Ask why',
        d: { sanity: 3, awareness: 6, wisdom: 9 }, verdict: 'good',
        say: 'I asked why me. He showed me for whom.',
        teach: 'Today I can use these sensitivities to help others, which is the point of them. Not for myself. You asked why it was you, and were shown who it was for.' },
      { k: 'D', text: 'Ask to make it stop',
        d: { sanity: -3, awareness: 0, wisdom: -18 }, verdict: 'worst', critical: true,
        say: 'I asked him to take it away. He gave me the handle.',
        teach: 'Sensitivity is a gift, and without discipline it becomes a burden. You asked to be rid of it, and were handed the way to hold it.' }
    ],
    /* S1·12's own lesson, the case file's words exactly (no Pali term is added: v11.10) */
    core: 'If you are carrying a question nobody around you can answer, keep looking — carefully, and with everything I said about vetting a teacher still applying. And remember the order these things go in: sensitivity needs knowledge, knowledge needs discipline, and ability needs responsibility. Skip a step and it is not a gift any more.',

    /* units metres, y up; x east, z south; the origin the middle of the turf (the tracker's §10). Play begins at the
       turf's south edge, turned north to the offering tables: what a portrait phone must see first. */
    spawn:     { x: -4.0, y: 1.62, z: 11.2, rot: 0 },
    shrine:    { x: 0, z: -11.2 },            // the engine's anchor (ghost: null): the offering tables
    ghostHome: { x: 0, z: -11.2 },
    /* the ground he is kept on: the turf, the gravel before the tables and the tents' fronts (stage.keepIn is the same box) */
    bounds:    { minX: -10.8, maxX: 10.8, minZ: -9.8, maxZ: 12.4 },

    ghost: null,
    fireLight: null,
    daylight: DAY1,

    /* (the list is long and grows with the build: one line a kind) */
    assets: [
      /* the people made for this chapter (masters/v26.0/make.sh §1 to §3) */
      /* this chapter's things, each from a crop of his photograph (masters/v26.0/make.sh §4) */
      'w3baisri', 'w3naga', 'w3wheel', 'w3parasol', 'w3tower', 'w3candle', 'w3fan', 'w3nagastaff', 'w3pewter',
      /* the ground's surfaces (masters/v26.0/tex) */
      'w3t_turf', 'w3t_earth', 'w3t_gravel', 'w3t_rooftile', 'w3t_redplank', 'w3t_tin', 'w3t_timber', 'w3t_swag',
      'w3t_petalturf', 'w3t_brick', 'w3t_skirt', 'w3t_satin', 'w3t_mat', 'w3t_carpet', 'w3t_banner', 'w3t_treeline',
      /* the trees of this episode's first chapter (reuseInEpisode) */
      'e4raintree', 'e4mango', 'e4raintreehd', 'e4mangohd'
    ],
    /* FRESH (chaptertest) asks a chapter of episode 4 to declare what it takes from episodes 1 to 3 (`reuse`), and what
       it shares with the chapters of its own episode (`reuseInEpisode`): Chad, v17.4, "any reuse is declared" */
    reuse: {},
    reuseInEpisode: { e4raintree: "the rain tree of chapter 1's countryside, standing round the ground: the same country's trees, and no tree is built in code (v24.20)",
                      e4mango: "the mango of chapter 1's countryside, likewise",
                      e4raintreehd: "the same rain tree at its fuller level, for the one that stands over the turf",
                      e4mangohd: "the same mango at its fuller level, for the one behind the chief canopy" },
    placeholders: {},
    items: [],

    musicVol: 0,
    /* the beds, every one at 0 here: mixBeds sets each by the day, the place he stands and the beat (M7) */
    ambience: { beds: [] },
    voiceLine: null,

    words: {
      approach: '',
      act: 'E to act',
      actTouch: 'Tap to act',
      interact: 'E to answer him',
      interactTouch: 'Tap to answer him',
      actLine: 'Press E to answer him',
      actLineTouch: 'Tap to answer him',
      // PLAY I · the Wai Kru (§4.1)
      objTon: 'Find Ton, who posted the thread',
      hotTon: 'Talk to Ton',
      objTables: 'Pay your respects at the offering tables',
      hotTables: 'Raise the bai sri and bow',
      objPlace: 'Find a place on the mats',
      hotPlace: 'Kneel',
      objHomage: 'Join the homage',
      hotHomage: 'Join the homage',
      objLine: 'Stand in the line',
      objLook: 'Look at him',
      hotLook: 'Look at him',
      objCheck: 'Ask the people who know him',
      hotAskTon: 'Ask Ton',
      hotAskAunt: 'Ask her',
      // PLAY II · the chance (§4.3)
      objGo: 'Go to Grandmaster Pho',
      hotKneel: 'Kneel',
      objBow: 'Bow to your teacher',
      hotBow: 'Bow',
      objTell: 'Tell him everything',
      hotTell: 'Tell him everything',
      // OPEN AND CLOSE (§4.3 P9): the event's own words
      breathTitle: 'OPEN AND CLOSE',
      breathBrief: 'Hold your finger down to open. Lift it to close. Close before it is too much.',
      breathBriefKey: 'Hold the mouse button or Space to open. Let go to close. Close before it is too much.',
      breathWhere: 'Hold anywhere to open',
      breathWhereKey: 'Hold the mouse button or Space to open',
      breathOpen: 'OPEN',
      breathClose: 'CLOSE',
      // the chant's captions (the three lines of homage that go with the three bows): the Pali as chanted over its
      // meaning (v21.31), from Thanissaro Bhikkhu's A Chanting Guide; checked against the book at CP7.2 before it ships
      cap1: 'Arahaṁ sammā-sambuddho bhagavā. Buddhaṁ bhagavantaṁ abhivādemi.',
      cap1Sub: 'The Blessed One is Worthy and Rightly Self-awakened. I bow down before the Awakened, Blessed One.',
      cap2: 'Svākkhāto bhagavatā dhammo. Dhammaṁ namassāmi.',
      cap2Sub: 'The Dhamma is well-expounded by the Blessed One. I pay homage to the Dhamma.',
      cap3: 'Supaṭipanno bhagavato sāvaka-saṅgho. Saṅghaṁ namāmi.',
      cap3Sub: 'The Sangha of the Blessed One’s disciples has practiced well. I pay respect to the Sangha.',
      // the card's What you did
      noteAsked: 'You asked the people who knew him before you went near him.',
      noteBreath3: 'You closed in time, three breaths of three.',
      noteBreath2: 'You closed in time twice. Once he had to close it for you.',
      noteBreath1: 'Twice he had to close it for you.',
      noteBreath0: 'Three times he had to close it for you.',
      // the belief, said as belief (the card's note for the homage and the line: §4.7)
      noteTrance: 'At a Wai Kru some people go into trance when a master blesses them: they tremble, or their arms rise, or they dance. Believers hold that it comes to those whose faith is strong. Master Z’s own word on such states: “Do not imitate these states, do not provoke them, and do not chase them out of curiosity.”'
    },
    sayPrefix: 'q3',
    /* (the tracker's D12) A PREVIEW until the whole chapter is proved: registered, opened only by ?ch=e4c3, saving and
       unlocking nothing (the forty-second seam). Taken out at M9, when it joins the run. */
    preview: true
  };

  function build(ctx) {
    const { THREE, GLTFLoader, cloneSkinned, scene, camera, yaw, pitch, LOW, kit, cnv, loadImageTexture,
            assetBytes, rescueTextures, getState, startDecision, worldSfx, warmSounds, soundOff, unifySkeletons,
            makeHellNote, HEAD_RE } = ctx;

    /* (the v21.1 TDZ law: everything a builder or a frame asks for is declared up here, before anything is built) */
    const owned = [];
    let alive = true;
    const parsedGlb = new Map();
    const madeTex = [];
    const tex = (t) => { madeTex.push(t); return t; };
    const noteTex = tex(makeHellNote());                  // the contract wants one (the engine's note prop reads it at boot)
    const mats = [];
    const M = (o) => { const m = new THREE.MeshStandardMaterial(o); mats.push(m); return m; };
    const B = (o) => { const m = new THREE.MeshBasicMaterial(o); mats.push(m); return m; };   // unlit: a glow, a painted layer
    const wallNow = () => performance.now() / 1000;
    const have = (key) => DATA.assets.includes(key);      // a thing is asked for only once its file is in the build
    const waiting = new Set();                            // the keys the world names that have not landed yet (stage.info)
    const c01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v), smo = (k) => k * k * (3 - 2 * k), sgk = (t, a, b) => c01((t - a) / (b - a));
    const lp = (a, b, k) => a + (b - a) * k, lp3 = (a, b, k) => [lp(a[0], b[0], k), lp(a[1], b[1], k), lp(a[2], b[2], k)];
    const angTo = (a, b) => Math.atan2(Math.sin(b - a), Math.cos(b - a));
    const isNarrow = () => camera.aspect < 1;

    /* ------------------------------------------------------------- THE GROUND'S PLAN (the tracker's §10)
       x east, z south, the origin the middle of the turf. Every place in this chapter is one of these numbers. */
    const TURF = { x0: -10, x1: 10, z0: -9, z1: 12, strip: 2 };
    const GRAVEL = { z0: -10.5, z1: -9 };
    const TABLES = { x0: -2.5, x1: 2.5, z0: -12.4, z1: -10.0, tops: [0.75, 1.05, 1.35], step: 0.8 };   // three steps, the lowest in front (south)
    const WHEEL = { x: 0, z: -12.0 };
    const PARASOL = { x: 0, z: -12.75 };
    const POLE = { x: 0.6, z: -13.6, h: 10 };
    const HALL = { x0: -5, x1: 5, z0: -25, z1: -17, eave: 3.2, ridge: 6.0, over: 1.0 };
    const SHED = { x0: -16, x1: -10.5, z0: -14, z1: -8, eave: 2.4 };
    const TENT_W1 = { x: -9, z: -1 }, TENT_W2 = { x: -9, z: 5 }, TENT_E = { x: 9, z: -2 };
    const TENT = { w: 4, eave: 2.2, peak: 3.3 };
    const CHIEF = { x: 6, z: 9, w: 4.5, eave: 2.3, peak: 3.1 };                // Grandmaster Pho's canopy; his bench faces north-west
    const BENCH = { x: 6.6, z: 9.6, ry: Math.atan2(-1, -1) + Math.PI };        // where he sits, turned to the turf's middle
    const HOUSE = { x: 12.5, z0: -7, z1: 6, h: 5.2 };
    const PLANK = { x0: 8.5, x1: 13, z: 11.5 };
    const GREY = { x0: 0, x1: 8.5, z: 13.2, h: 4.2 };
    const FENCE = { x: -10.3, z0: -9, z1: -4, h: 1.0 };
    const WAYIN = { x: -4, z: 12.3 };
    /* the sun of each look, as a direction it shines FROM (painted shadows fall the other way) */
    const SUNS = { DAY1: [17, 20, 10], DAWN: [22, 7.5, 9], AFTERNOON: [-20, 9, 6] };

    const world = new THREE.Group();
    scene.add(world);
    const dayOne = new THREE.Group(), dayTwo = new THREE.Group(), nightG = new THREE.Group();   // what only one of the three looks draws
    world.add(dayOne); world.add(dayTwo); world.add(nightG);
    dayTwo.visible = false; nightG.visible = false;

    const walls = [], solids = [];
    const matProxy = M({ color: 0x8d7a66, roughness: 0.9 });
    /* a thing he cannot walk through: a box, never drawn (collision is a column from the floor: v5.03) */
    const solidBox = (w, h, d, x, y, z, ry = 0) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), matProxy);
      m.position.set(x, y, z); m.rotation.y = ry; m.visible = false; world.add(m); solids.push(m); return m;
    };

    /* ------------------------------------------------- one parse per asset */
    function parseOnce(key) {
      if (!parsedGlb.has(key)) {
        parsedGlb.set(key, assetBytes(key).then(BUF => new Promise((res, rej) =>
          new GLTFLoader().parse(BUF, '', (gltf) => {
            rescueTextures(gltf, BUF);
            if (unifySkeletons) unifySkeletons(gltf.scene);
            mendTwins(key, gltf.scene);
            res({ scene: gltf.scene, animations: gltf.animations });
          }, rej))));
      }
      return parsedGlb.get(key);
    }
    /* (v24.17) Chad's Nang Kwak is bronze, about 0.8 metal by its own metal-roughness sheet, and a metal shows only what
       it reflects: under the scene's environment at 0.05 she drew as a black silhouette on the tray and the altar
       (photographed), where the bag's own view shows her warm bronze. The pickup's lift (v24.16), held to her metal: the
       material is shared by her two copies, so both read as the same piece */
    /* (v24.29) THE LIFT IS DRAWN NOW (tools/patchthree.mjs: three ignored a material's envMapIntensity under the scene's
       environment, so the 10 written here never reached a pixel and she stayed the black silhouette above). Drawn as
       written, 10 x 0.05 = 0.5 of the room washed the shop's bronze and gold to pale silver; photographed on a phone at
       0.05 / 0.08 / 0.12 / 0.18 / 0.25 the images read bronze-gold at 0.12-0.18 and pale from 0.25 — episode 3's own
       bracket for its Buddha images (BUDDHA_ENV 0.15) — so a piece takes 3 (0.15). A vehicle's paint and chrome take k 2
       (0.1: silver reads silver and red red, where 0.18 up washed the sedan white) */
    function bronzeLift(o, k = 3) { for (const mt of [].concat(o.material)) if (mt && mt.metalnessMap && 'envMapIntensity' in mt) mt.envMapIntensity = k; }
    /* (v24.22) MANY OF ONE MODEL: a real model stood at many places as InstancedMeshes — one per mesh of the file, the
       file's own node transform folded into every instance — so a shop full of stock costs a draw a kind a place, never a
       draw a piece. `list`: [{ x, y, z, ry, rx, rz, s }] in `parent`'s frame, turned ry about y, then rx about its own x
       (a lean back, a lying down), then rz about its own z. Its gold, bronze and copper are metal and show only what they
       reflect: the pickup's lift (bronzeLift). The instances are `owned`, so dispose frees their buffers */
    const _mq = new THREE.Quaternion(), _me = new THREE.Euler(0, 0, 0, 'YXZ'), _mp = new THREE.Vector3(), _ms = new THREE.Vector3(), _mm = new THREE.Matrix4();
    /* (v24.22) NEAR AND FAR. A stock file carries its piece twice: `<key>_near` as it was made, `<key>_far` a light level
       of the same surface (a cased piece's front baked onto its own geometry, tools/planarfar.mjs; a statue cut by
       tools/lodpair.mjs). Each place stands both and draws the near level only while its nearest piece would fill more
       than STOCK_NEAR of the frame's height (`stockLod`, every frame World S is shown): measured on the first build, the
       phone's widest look into the shop drew 406k triangles, three quarters of them pieces a few pixels tall at their
       full 2–12k. A file with no levels stands as it is, always */
    const stockLods = [], STOCK_NEAR = 0.04;
    /* (v24.36) `done`, if given, is handed every InstancedMesh made, once they stand (the samnak's cabinets shake theirs
       with the room and put their stand-ins away); without it, as before */
    function manyOf(key, list, parent, size = 0.06, done = null) {
      if (!list.length) return;
      parseOnce(key).then(({ scene: src }) => {
        if (!alive) return;
        src.updateMatrixWorld(true);
        const lv = { near: [], far: [] }, made = [];
        src.traverse(o => {
          if (!o.isMesh) return;
          const mat = o.material.clone(); mats.push(mat); bronzeLift({ material: mat });
          const im = new THREE.InstancedMesh(o.geometry, mat, list.length);
          list.forEach((it, i) => {
            _me.set(it.rx || 0, it.ry || 0, it.rz || 0, 'YXZ'); _mq.setFromEuler(_me);
            _mm.compose(_mp.set(it.x, it.y, it.z), _mq, _ms.setScalar(it.s || 1)).multiply(o.matrixWorld);
            im.setMatrixAt(i, _mm);
          });
          im.instanceMatrix.needsUpdate = true; im.computeBoundingSphere();
          im.castShadow = false; im.receiveShadow = true; im.name = 'stock:' + key;
          parent.add(im); owned.push(im); made.push(im);
          if (/_far$/.test(o.name)) lv.far.push(im); else if (/_near$/.test(o.name)) lv.near.push(im);
        });
        if (lv.near.length && lv.far.length) {
          /* the place's sphere in the world: the middle of its pieces and the farthest of them from it; and the size of
             its pieces on the shelf (the file's own height times their largest scale) */
          const c = new THREE.Vector3(); for (const it of list) c.add(_mp.set(it.x, it.y, it.z)); c.divideScalar(list.length);
          let r = 0; for (const it of list) r = Math.max(r, c.distanceTo(_mp.set(it.x, it.y, it.z)));
          parent.updateMatrixWorld(true); parent.localToWorld(c);
          const sMax = list.reduce((a, it) => Math.max(a, it.s || 1), 0);
          for (const im of lv.near) im.visible = false;                  // the far level until the first frame asks
          stockLods.push({ near: lv.near, far: lv.far, c, r: r + 0.05, size: size * sMax, on: false });
        }
        if (done) done(made);
      }).catch(err => { console.warn(key + ' failed to load', err); if (ctx.loadFail) ctx.loadFail(key, err); });
    }
    const _sl = new THREE.Vector3();
    function stockLod() {
      if (!stockLods.length) return;
      camera.getWorldPosition(_sl);
      const span = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2);
      for (const L of stockLods) {
        const d = Math.max(0.05, _sl.distanceTo(L.c) - L.r), on = L.size / (d * span) > STOCK_NEAR;
        if (on === L.on) continue;
        L.on = on;
        for (const im of L.near) im.visible = on;
        for (const im of L.far) im.visible = !on;
      }
    }
    /* A SEAM'S TWINS MOVE AS ONE (v24.5, found by the photographs of Pong's head: a hair-thin dark line ran across the
       room's floor from behind his arm to the far wall). One vertex of his trousers, at his right hip, is weighted wholly
       to his LEFT KNEE while its two twins at the same place (a seam's copies) follow his hips — sat cross-legged, his
       knee carries it a metre off and three triangles of a 2 cm cap stretch into a needle across the floor. Twins at one
       place must deform as one: a vertex whose twins agree on a bone it carries no weight on at all takes their weights.
       Once a file, on the parse every clone shares; how many each file needed is kept (`stage.mends`) */
    const twinMends = {};
    function mendTwins(key, root) {
      let n = 0;
      root.traverse(m => {
        if (!m.isSkinnedMesh) return;
        const g = m.geometry, pa = g.attributes.position, si = g.attributes.skinIndex, sw = g.attributes.skinWeight;
        if (!pa || !si || !sw) return;
        let mine = 0;
        g.computeBoundingBox(); const bb = g.boundingBox;
        const tol = 1.5e-3 * Math.max(bb.max.x - bb.min.x, bb.max.y - bb.min.y, bb.max.z - bb.min.z);   // ~2.5 mm on a body
        const bones = m.skeleton ? m.skeleton.bones : [], near = (a, b2) => { const A = bones[a], B = bones[b2];
          return !A || !B || A === B || A.parent === B || B.parent === A; };   // a joint's own boundary is never mended
        if (!(tol > 0)) return;
        const cell = (v) => Math.floor(v / tol), cells = new Map(), K = (a, b2, c) => a + ',' + b2 + ',' + c;
        for (let i = 0; i < pa.count; i++) {
          const k = K(cell(pa.getX(i)), cell(pa.getY(i)), cell(pa.getZ(i)));
          let c = cells.get(k); if (!c) cells.set(k, c = []); c.push(i);
        }
        const dom = (i) => { let k = 0; for (let q = 1; q < 4; q++) if (sw.getComponent(i, q) > sw.getComponent(i, k)) k = q; return si.getComponent(i, k); };
        const weightOn = (i, bone) => { let w = 0; for (let q = 0; q < 4; q++) if (si.getComponent(i, q) === bone) w += sw.getComponent(i, q); return w; };
        for (let i = 0; i < pa.count; i++) {
          const x = pa.getX(i), y = pa.getY(i), z = pa.getZ(i), cx = cell(x), cy = cell(y), cz = cell(z), tw = [];
          for (let a = -1; a <= 1; a++) for (let b2 = -1; b2 <= 1; b2++) for (let c = -1; c <= 1; c++) {
            const l = cells.get(K(cx + a, cy + b2, cz + c)); if (!l) continue;
            for (const j of l) if (j !== i && Math.hypot(pa.getX(j) - x, pa.getY(j) - y, pa.getZ(j) - z) <= tol) tw.push(j);
          }
          if (tw.length < 2) continue;
          const d0 = dom(tw[0]);
          if (!tw.every(j => dom(j) === d0) || weightOn(i, d0) > 0 || near(dom(i), d0)) continue;
          for (let q = 0; q < 4; q++) { si.setComponent(i, q, si.getComponent(tw[0], q)); sw.setComponent(i, q, sw.getComponent(tw[0], q)); }
          n++; mine++;
        }
        if (mine) { si.needsUpdate = true; sw.needsUpdate = true; }
      });
      if (n) twinMends[key] = n;
    }


    /* ------------------------------------------------- the ground's surfaces (masters/v26.0/tex)
       Each is a picture made from his photograph of the real surface. A material stands in its surface's own average
       colour until its picture lands, so nothing flashes white; an ImageBitmap ignores flipY, so the picture is turned
       by its repeat. `tile` is the size of one tile in metres (the geometry's UVs are metres). */
    const SURF = {
      turf: [0x3f9a22, 'image/jpeg'], petalturf: [0x9a9c2c, 'image/jpeg'], earth: [0xb0663e, 'image/jpeg'], gravel: [0x9b968d, 'image/jpeg'],
      rooftile: [0xc66f63, 'image/jpeg'], redplank: [0x8a2c26, 'image/jpeg'], tin: [0xcb8083, 'image/jpeg'], timber: [0x57392a, 'image/jpeg'],
      brick: [0x96573f, 'image/jpeg'], skirt: [0x1f9c3a, 'image/jpeg'], satin: [0xe9e9e9, 'image/jpeg'], mat: [0xc7b78a, 'image/jpeg'],
      carpet: [0x74202a, 'image/jpeg'], swag: [0xf2f0e4, 'image/webp'], banner: [0xe8e8e8, 'image/webp'], treeline: [0x4c7a3a, 'image/webp']
    };
    const surfTex = new Map();
    function surfLoad(name) {
      if (!surfTex.has(name)) {
        const key = 'w3t_' + name;
        if (!have(key)) { waiting.add(key); surfTex.set(name, Promise.resolve(null)); }
        else surfTex.set(name, loadImageTexture(key, SURF[name][1]).then(t => { if (t && alive) madeTex.push(t); return alive ? t : null; }).catch(() => null));
      }
      return surfTex.get(name);
    }
    /* a material of a surface. o: tile [u, v] metres (or one number), mirror 'u' | 'v' | 'uv', clamp (one picture, laid
       once: its piece is drawn with tile = its own size), tint, basic (unlit), cut (its holes cut out), and whatever else
       a material takes */
    function surf(name, o = {}) {
      const { tile = 1, mirror = '', tint = null, basic = false, cut = false, clampV = false, clamp = false, ...rest } = o;
      const avg = new THREE.Color(SURF[name][0]); if (tint != null) avg.multiply(new THREE.Color(tint));
      const base = { color: avg, ...rest };
      if (!basic) { if (base.roughness == null) base.roughness = 0.9; if (base.metalness == null) base.metalness = 0; }
      if (cut) { base.alphaTest = 0.5; base.side = THREE.DoubleSide; }
      const m = basic ? B(base) : M(base);
      surfLoad(name).then(t0 => {
        if (!t0 || !alive) return;
        const t = t0.clone(); t.needsUpdate = true; madeTex.push(t);
        const tu = Array.isArray(tile) ? tile[0] : tile, tv = Array.isArray(tile) ? tile[1] : tile;
        t.wrapS = clamp ? THREE.ClampToEdgeWrapping : /u/.test(mirror) ? THREE.MirroredRepeatWrapping : THREE.RepeatWrapping;
        t.wrapT = clamp || clampV ? THREE.ClampToEdgeWrapping : /v/.test(mirror) ? THREE.MirroredRepeatWrapping : THREE.RepeatWrapping;
        t.repeat.set(1 / tu, -1 / tv); t.offset.set(0, 1);
        m.map = t; m.color.set(tint != null ? tint : 0xffffff); m.needsUpdate = true;
      });
      return m;
    }

    /* ------------------------------------------------- what never moves is merged, one mesh a material
       quad(): a flat four-cornered piece, a → b its u and a → d its v, both in metres (front: a, b, c, d anticlockwise).
       box(): six of them. geo(): any three geometry, its own UVs scaled. flush() makes the meshes. */
    const batches = new Map();
    const batchOf = (mat) => { let b = batches.get(mat); if (!b) batches.set(mat, b = { mat, p: [], n: [], u: [] }); return b; };
    function quad(mat, a, b, c, d, u0 = 0, v0 = 0) {
      const Bt = batchOf(mat);
      const ax = b[0] - a[0], ay = b[1] - a[1], az = b[2] - a[2], dx = d[0] - a[0], dy = d[1] - a[1], dz = d[2] - a[2];
      const lu = Math.hypot(ax, ay, az), lv = Math.hypot(dx, dy, dz);
      let nx = ay * dz - az * dy, ny = az * dx - ax * dz, nz = ax * dy - ay * dx; const nl = Math.hypot(nx, ny, nz) || 1; nx /= nl; ny /= nl; nz /= nl;
      const P = [a, b, c, a, c, d], U = [[u0, v0], [u0 + lu, v0], [u0 + lu, v0 + lv], [u0, v0], [u0 + lu, v0 + lv], [u0, v0 + lv]];
      for (let i = 0; i < 6; i++) { Bt.p.push(P[i][0], P[i][1], P[i][2]); Bt.n.push(nx, ny, nz); Bt.u.push(U[i][0], U[i][1]); }
    }
    /* a triangle (a gable's end), its UVs the wall's own metres from a */
    function tri(mat, a, b, c, u0 = 0, v0 = 0) {
      const Bt = batchOf(mat);
      const ax = b[0] - a[0], ay = b[1] - a[1], az = b[2] - a[2], dx = c[0] - a[0], dy = c[1] - a[1], dz = c[2] - a[2];
      let nx = ay * dz - az * dy, ny = az * dx - ax * dz, nz = ax * dy - ay * dx; const nl = Math.hypot(nx, ny, nz) || 1; nx /= nl; ny /= nl; nz /= nl;
      const lu = Math.hypot(ax, az) || Math.hypot(ax, ay, az), hu = Math.hypot(dx, dz);
      const U = [[u0, v0], [u0 + lu, v0 + ay], [u0 + hu, v0 + dy]];
      [a, b, c].forEach((p, i) => { Bt.p.push(p[0], p[1], p[2]); Bt.n.push(nx, ny, nz); Bt.u.push(U[i][0], U[i][1]); });
    }
    const floor = (mat, x0, z0, x1, z1, y = 0) => quad(mat, [x0, y, z1], [x1, y, z1], [x1, y, z0], [x0, y, z0], x0, -z1);
    /* an upright piece from (x0, z0) to (x1, z1): it faces the left of that way (west to east faces south) */
    const wall = (mat, x0, z0, x1, z1, y0, y1, u0 = 0) => quad(mat, [x0, y0, z0], [x1, y0, z1], [x1, y1, z1], [x0, y1, z0], u0, y0);
    function box(mat, cx, cy, cz, w, h, d, ry = 0, top = mat, skipBottom = true) {
      const c = Math.cos(ry), s = Math.sin(ry), hw = w / 2, hh = h / 2, hd = d / 2;
      const P = (lx, ly, lz) => [cx + lx * c + lz * s, cy + ly, cz - lx * s + lz * c];
      const a = P(-hw, -hh, hd), b = P(hw, -hh, hd), e = P(hw, -hh, -hd), f = P(-hw, -hh, -hd);
      const a1 = P(-hw, hh, hd), b1 = P(hw, hh, hd), e1 = P(hw, hh, -hd), f1 = P(-hw, hh, -hd);
      quad(mat, a, b, b1, a1, 0, cy - hh); quad(mat, b, e, e1, b1, 0, cy - hh); quad(mat, e, f, f1, e1, 0, cy - hh); quad(mat, f, a, a1, f1, 0, cy - hh);
      quad(top, a1, b1, e1, f1);
      if (!skipBottom) quad(mat, f, e, b, a);
    }
    const _gm = new THREE.Matrix4(), _gv = new THREE.Vector3(), _gn = new THREE.Matrix3();
    function geo(mat, g0, m4, su = 1, sv = 1) {
      const g = g0.index ? g0.toNonIndexed() : g0, Bt = batchOf(mat);
      const pa = g.attributes.position, na = g.attributes.normal, ua = g.attributes.uv;
      _gn.getNormalMatrix(m4);
      for (let i = 0; i < pa.count; i++) {
        _gv.fromBufferAttribute(pa, i).applyMatrix4(m4); Bt.p.push(_gv.x, _gv.y, _gv.z);
        _gv.fromBufferAttribute(na, i).applyMatrix3(_gn).normalize(); Bt.n.push(_gv.x, _gv.y, _gv.z);
        Bt.u.push(ua ? ua.getX(i) * su : 0, ua ? ua.getY(i) * sv : 0);
      }
      if (g !== g0) g.dispose(); g0.dispose();
    }
    /* an upright round post from the ground (or y0) to y1 */
    function post(mat, x, z, r, y0, y1, sides = 8, r1 = r) {
      geo(mat, new THREE.CylinderGeometry(r1, r, y1 - y0, sides, 1, true), _gm.makeTranslation(x, (y0 + y1) / 2, z), 2 * Math.PI * r, y1 - y0);
    }
    /* a straight round bar between two points */
    const _ba = new THREE.Vector3(), _bb = new THREE.Vector3(), _bq = new THREE.Quaternion(), _bu = new THREE.Vector3(0, 1, 0), _bs = new THREE.Vector3(1, 1, 1);
    function bar(mat, a, b, r, sides = 6) {
      _ba.set(a[0], a[1], a[2]); _bb.set(b[0], b[1], b[2]);
      const len = _ba.distanceTo(_bb); if (len < 1e-4) return;
      _bq.setFromUnitVectors(_bu, _bb.clone().sub(_ba).normalize());
      _gm.compose(_ba.clone().add(_bb).multiplyScalar(0.5), _bq, _bs);
      geo(mat, new THREE.CylinderGeometry(r, r, len, sides, 1, true), _gm, 2 * Math.PI * r, len);
    }
    function flush(parent = world) {
      for (const Bt of batches.values()) {
        if (!Bt.p.length) continue;
        const g = new THREE.BufferGeometry();
        g.setAttribute('position', new THREE.Float32BufferAttribute(Bt.p, 3));
        g.setAttribute('normal', new THREE.Float32BufferAttribute(Bt.n, 3));
        g.setAttribute('uv', new THREE.Float32BufferAttribute(Bt.u, 2));
        g.computeBoundingSphere(); g.computeBoundingBox();
        const m = new THREE.Mesh(g, Bt.mat); m.receiveShadow = false; m.castShadow = false; m.matrixAutoUpdate = false; m.updateMatrix();
        parent.add(m); owned.push(m);
      }
      batches.clear();
    }

    /* a seeded stream (v6.15): every scatter in this chapter is the same scatter on every run */
    function rng(seed) { let s = seed >>> 0 || 1; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }

    /* ------------------------------------------------- a model stood once (a tree, a seat, the parasol)
       Prepped in real metres with its origin on its base's middle (v13.1), so a place is a place; `h` fits one that
       was not (a tree from an earlier chapter) to a height. Answers the group at once; the model lands in it. */
    function stand(key, x, y, z, ry = 0, o = {}) {
      const g = new THREE.Group(); g.position.set(x, y, z); g.rotation.y = ry; (o.parent || world).add(g);
      if (!have(key)) { waiting.add(key); return g; }
      parseOnce(key).then(({ scene: src }) => {
        if (!alive) return;
        const m = src.clone(true);
        m.traverse(q => { if (q.isMesh) { q.castShadow = false; q.receiveShadow = false; q.material = q.material.clone(); mats.push(q.material); bronzeLift(q, o.lift || 3); } });
        if (o.h) { m.updateMatrixWorld(true); const bb = new THREE.Box3().setFromObject(m); const k = o.h / Math.max(1e-3, bb.max.y - bb.min.y);
          m.scale.multiplyScalar(k); m.position.y -= bb.min.y * k; m.position.x -= (bb.min.x + bb.max.x) / 2 * k; m.position.z -= (bb.min.z + bb.max.z) / 2 * k; }
        if (o.s) m.scale.multiplyScalar(o.s);
        g.add(m); g.userData.model = m;
        if (o.done) o.done(m, g);
      }).catch(err => { console.warn(key + ' failed to load', err); if (ctx.loadFail) ctx.loadFail(key, err); });
      return g;
    }
    /* many of one thing (the copied manyOf), asked for only once its file is in the build */
    function many(key, list, parent = world, size = 0.3, done = null) {
      if (!list.length) return;
      if (!have(key)) { waiting.add(key); return; }
      manyOf(key, list, parent, size, done);
    }

    /* ================================================================ THE GROUND
       Red earth under everything; the turf in strips with their seams; a strip of gravel before the tables. */
    const mEarth = surf('earth', { tile: 2.5, roughness: 1 });
    const mTurf = surf('turf', { tile: 2, roughness: 0.95 });
    const mGravel = surf('gravel', { tile: 1.5, roughness: 1 });
    function buildGround() {
      floor(mEarth, -46, -46, 46, 46, -0.012);
      floor(mTurf, TURF.x0, TURF.z0, TURF.x1, TURF.z1, 0);
      floor(mGravel, TURF.x0 - 0.6, GRAVEL.z0, TURF.x1 + 0.6, GRAVEL.z1, -0.004);
      /* the turf is rolls laid side by side, north to south: where two meet, a thin teal line (photograph 10) */
      const mSeam = M({ color: 0x1f8f7c, roughness: 0.9 });
      for (let x = TURF.x0 + TURF.strip; x < TURF.x1 - 0.01; x += TURF.strip) floor(mSeam, x - 0.012, TURF.z0, x + 0.012, TURF.z1, 0.003);
      /* its cut edge: a hand's width of darker pile all round, so it reads as a thing laid on the earth */
      const mEdge = M({ color: 0x2c6f1c, roughness: 1 });
      wall(mEdge, TURF.x0, TURF.z1, TURF.x1, TURF.z1, -0.012, 0.004); wall(mEdge, TURF.x1, TURF.z0, TURF.x0, TURF.z0, -0.012, 0.004);
      wall(mEdge, TURF.x1, TURF.z1, TURF.x1, TURF.z0, -0.012, 0.004); wall(mEdge, TURF.x0, TURF.z0, TURF.x0, TURF.z1, -0.012, 0.004);
    }

    /* ================================================================ THE HALL (photographs 8, 10, 4, 1)
       A wooden hall behind the tables: red-brown brick below and dark timber above, a dark doorway and steps; a red
       tiled roof in two tiers, the upper a gable to the south with red barge boards, the lower a skirt all round; white
       fretwork under the eaves. Built plainly: what stands behind it no photograph shows. */
    const mTile = surf('rooftile', { tile: [2.2, 2.9], clampV: false, roughness: 0.85, side: THREE.DoubleSide });
    const mTimber = surf('timber', { tile: 2.2, mirror: 'uv', roughness: 0.9 });
    const mBrick = surf('brick', { tile: 1.6, mirror: 'uv', roughness: 0.95 });
    const mRedPlank = surf('redplank', { tile: 2.0, mirror: 'uv', roughness: 0.85 });
    const mTin = surf('tin', { tile: 1.8, roughness: 0.7, side: THREE.DoubleSide });
    const mBarge = M({ color: 0xa02a22, roughness: 0.7 });
    const mDark = M({ color: 0x15100c, roughness: 1 });
    const mWhite = M({ color: 0xf2efe6, roughness: 0.8 });
    const mConcrete = M({ color: 0xa9a49a, roughness: 0.95 });
    function buildHall() {
      const H = HALL, e = H.eave, ov = H.over, brickH = 1.1;
      const cx = (H.x0 + H.x1) / 2;
      /* the walls: brick to the sill, timber to the eave */
      const ring = [[H.x0, H.z1, H.x1, H.z1], [H.x1, H.z1, H.x1, H.z0], [H.x1, H.z0, H.x0, H.z0], [H.x0, H.z0, H.x0, H.z1]];
      for (const [xa, za, xb, zb] of ring) { wall(mBrick, xa, za, xb, zb, 0, brickH); wall(mTimber, xa, za, xb, zb, brickH, e + 0.5); }
      /* the doorway, dark, with its frame; three steps up to it */
      wall(mDark, cx - 0.75, H.z1 + 0.012, cx + 0.75, H.z1 + 0.012, 0.45, 2.55);
      for (const sx of [-1, 1]) box(mWhite, cx + sx * 0.82, 1.5, H.z1 + 0.03, 0.1, 2.2, 0.08);
      box(mWhite, cx, 2.62, H.z1 + 0.03, 1.74, 0.1, 0.08);
      for (let st = 0; st < 3; st++) box(mConcrete, cx, (st + 1) * 0.075, H.z1 + 0.75 - st * 0.28, 2.4, (st + 1) * 0.15, 0.3);
      /* two shuttered windows either side of the door */
      const mShutter = M({ color: 0x3a2619, roughness: 0.85 });
      for (const sx of [-1, 1]) { wall(mShutter, cx + sx * 3.1 - 0.55, H.z1 + 0.014, cx + sx * 3.1 + 0.55, H.z1 + 0.014, 1.3, 2.5);
        box(mWhite, cx + sx * 3.1, 1.24, H.z1 + 0.03, 1.3, 0.07, 0.07); box(mWhite, cx + sx * 3.1, 2.56, H.z1 + 0.03, 1.3, 0.07, 0.07); }
      /* THE LOWER ROOF: a skirt all round, from the eave line (overhanging) up to a ring part way in */
      const y0 = e, y1 = e + 1.15, in0 = 1.9;                                  // the skirt rises 1.15 m over 1.9 + the overhang
      const o = { x0: H.x0 - ov, x1: H.x1 + ov, z0: H.z0 - ov, z1: H.z1 + ov }, i = { x0: H.x0 + in0, x1: H.x1 - in0, z0: H.z0 + in0, z1: H.z1 - in0 };
      quad(mTile, [o.x0, y0, o.z1], [o.x1, y0, o.z1], [i.x1, y1, i.z1], [i.x0, y1, i.z1]);            // south, facing the tables
      quad(mTile, [o.x1, y0, o.z1], [o.x1, y0, o.z0], [i.x1, y1, i.z0], [i.x1, y1, i.z1]);            // east
      quad(mTile, [o.x1, y0, o.z0], [o.x0, y0, o.z0], [i.x0, y1, i.z0], [i.x1, y1, i.z0]);            // north
      quad(mTile, [o.x0, y0, o.z0], [o.x0, y0, o.z1], [i.x0, y1, i.z1], [i.x0, y1, i.z0]);            // west
      /* its edge board, white, and the fretwork hanging under it on the side the tables see */
      wall(mWhite, o.x0, o.z1, o.x1, o.z1, y0 - 0.16, y0 + 0.02); wall(mWhite, o.x1, o.z1, o.x1, o.z0, y0 - 0.16, y0 + 0.02);
      wall(mWhite, o.x0, o.z0, o.x0, o.z1, y0 - 0.16, y0 + 0.02);
      const mFret = B({ map: tex(makeFretwork(THREE, cnv)), transparent: false, alphaTest: 0.5, side: THREE.DoubleSide, color: 0xf4f1e8 });
      { const g = new THREE.PlaneGeometry(o.x1 - o.x0, 0.34); const uv = g.attributes.uv; for (let k = 0; k < uv.count; k++) uv.setX(k, uv.getX(k) * (o.x1 - o.x0) / 0.68);
        const m = new THREE.Mesh(g, mFret); m.position.set(cx, y0 - 0.32, o.z1 + 0.004); world.add(m); owned.push(m); }
      /* the short wall between the two roofs, timber */
      for (const [xa, za, xb, zb] of [[i.x0, i.z1, i.x1, i.z1], [i.x1, i.z1, i.x1, i.z0], [i.x1, i.z0, i.x0, i.z0], [i.x0, i.z0, i.x0, i.z1]]) wall(mTimber, xa, za, xb, zb, y1 - 0.05, y1 + 0.55);
      /* THE UPPER ROOF: a gable whose ridge runs north to south, its end to the tables */
      const g0 = y1 + 0.5, ridge = H.ridge + 0.6, gx0 = i.x0 - 0.45, gx1 = i.x1 + 0.45, gz0 = i.z0 - 0.3, gz1 = i.z1 + 0.5;
      quad(mTile, [gx0, g0, gz0], [gx0, g0, gz1], [cx, ridge, gz1], [cx, ridge, gz0]);                 // west slope (its eave the picture's u, so the tiles hang down it)
      quad(mTile, [gx1, g0, gz1], [gx1, g0, gz0], [cx, ridge, gz0], [cx, ridge, gz1]);                 // east slope
      tri(mTimber, [i.x0, g0, i.z1 + 0.02], [i.x1, g0, i.z1 + 0.02], [cx, ridge - 0.12, i.z1 + 0.02]);  // the gable's end, timber
      tri(mTimber, [i.x1, g0, i.z0 - 0.02], [i.x0, g0, i.z0 - 0.02], [cx, ridge - 0.12, i.z0 - 0.02]);
      /* red barge boards up both rakes of the south gable, crossing at the ridge (the Thai way), and a white sun-burst
         of slats under them */
      bar(mBarge, [gx0 - 0.1, g0 - 0.12, gz1 + 0.03], [cx + 0.35, ridge + 0.42, gz1 + 0.03], 0.085, 4);
      bar(mBarge, [gx1 + 0.1, g0 - 0.12, gz1 + 0.03], [cx - 0.35, ridge + 0.42, gz1 + 0.03], 0.085, 4);
      for (let k = -3; k <= 3; k++) bar(mWhite, [cx + k * 0.42, g0 + 0.04, i.z1 + 0.05], [cx + k * 0.1, ridge - 0.5 - Math.abs(k) * 0.07, i.z1 + 0.05], 0.022, 4);
      /* he cannot walk into it (it stands outside the ground he is kept on: this is for a film's lens) */
    }

    /* ================================================================ WHAT STANDS ROUND THE TURF
       The open shed (west), the white lattice fence, the red wooden house (east), the red plank wall and the pale grey
       building behind the chief canopy (south-east). Photographs 10, 12, 11, 5 and 6. */
    function buildSurround() {
      /* the open shed: posts and a pink corrugated roof falling to the east (its high side to the west) */
      const S0 = SHED, hi = S0.eave + 1.2, lo = S0.eave;
      const mPost = M({ color: 0x8a8376, roughness: 0.9 });
      for (const x of [S0.x0 + 0.2, (S0.x0 + S0.x1) / 2, S0.x1 - 0.2]) for (const z of [S0.z0 + 0.2, (S0.z0 + S0.z1) / 2, S0.z1 - 0.2])
        box(mPost, x, lp(hi, lo, (x - S0.x0) / (S0.x1 - S0.x0)) / 2, z, 0.1, lp(hi, lo, (x - S0.x0) / (S0.x1 - S0.x0)), 0.1);
      /* (a tin roof's eave is its picture's u, so the corrugations run down the slope) */
      quad(mTin, [S0.x1 + 0.6, lo - 0.02, S0.z1 + 0.5], [S0.x1 + 0.6, lo - 0.02, S0.z0 - 0.5], [S0.x0 - 0.5, hi + 0.09, S0.z0 - 0.5], [S0.x0 - 0.5, hi + 0.09, S0.z1 + 0.5]);
      const mRafter = M({ color: 0x5a4636, roughness: 0.9 });
      for (const z of [S0.z0 + 0.2, (S0.z0 + S0.z1) / 2, S0.z1 - 0.2]) bar(mRafter, [S0.x0 + 0.2, hi + 0.02, z], [S0.x1 - 0.2, lo + 0.02, z], 0.045, 4);
      /* a second, lower shed roof seen behind the west tents (photograph 10's left edge) */
      quad(mTin, [-12.2, 2.5, 9], [-12.2, 2.5, -6], [-17.5, 3.4, -6], [-17.5, 3.4, 9]);
      wall(mBrick, -12.4, 9, -12.4, -6, 0, 2.45); wall(mWhite, -12.38, 8.9, -12.38, -5.9, 0.9, 2.3);
      /* the white lattice fence: posts, two rails and the lattice between them (a drawn sheet with holes) */
      const mLattice = B({ map: tex(makeLattice(THREE, cnv)), alphaTest: 0.5, side: THREE.DoubleSide, color: 0xf2f1ec });
      const fence = (xa, za, xb, zb) => {
        const len = Math.hypot(xb - xa, zb - za), g = new THREE.PlaneGeometry(len, FENCE.h - 0.12);
        const uv = g.attributes.uv; for (let k = 0; k < uv.count; k++) uv.setX(k, uv.getX(k) * len / 0.9);
        const m = new THREE.Mesh(g, mLattice); m.position.set((xa + xb) / 2, FENCE.h / 2 + 0.02, (za + zb) / 2); m.rotation.y = Math.atan2(xb - xa, zb - za) + Math.PI / 2;
        world.add(m); owned.push(m);
        for (let s = 0; s <= len + 0.01; s += 1.5) post(mWhite, lp(xa, xb, s / len), lp(za, zb, s / len), 0.04, 0, FENCE.h + 0.06, 6);
        bar(mWhite, [xa, FENCE.h, za], [xb, FENCE.h, zb], 0.025, 4); bar(mWhite, [xa, 0.1, za], [xb, 0.1, zb], 0.025, 4);
      };
      fence(FENCE.x, FENCE.z0, FENCE.x, FENCE.z1); fence(FENCE.x, FENCE.z0, FENCE.x - 3.5, FENCE.z0);
      /* the red wooden house east of the turf: plank walls painted red on a brick foot, a porch rail, a tin roof */
      const Hh = HOUSE;
      wall(mBrick, Hh.x, Hh.z0, Hh.x, Hh.z1, 0, 0.7); wall(mRedPlank, Hh.x, Hh.z0, Hh.x, Hh.z1, 0.7, Hh.h - 1.4);      // (north to south: it faces west, the turf)
      wall(mRedPlank, Hh.x + 9, Hh.z0, Hh.x, Hh.z0, 0, Hh.h - 1.4); wall(mRedPlank, Hh.x, Hh.z1, Hh.x + 9, Hh.z1, 0, Hh.h - 1.4);
      quad(mTin, [Hh.x - 0.8, Hh.h - 1.55, Hh.z0 - 0.6], [Hh.x - 0.8, Hh.h - 1.55, Hh.z1 + 0.6], [Hh.x + 4.5, Hh.h, Hh.z1 + 0.6], [Hh.x + 4.5, Hh.h, Hh.z0 - 0.6]);
      for (const z of [-4.5, -1.5, 1.5, 4.2]) { wall(mDark, Hh.x - 0.012, z - 0.5, Hh.x - 0.012, z + 0.5, 1.5, 2.6);
        box(mWhite, Hh.x - 0.03, 1.46, z, 0.06, 0.06, 1.12); box(mWhite, Hh.x - 0.03, 2.64, z, 0.06, 0.06, 1.12);
        for (const dz of [-0.56, 0.56]) box(mWhite, Hh.x - 0.03, 2.05, z + dz, 0.06, 1.2, 0.06); }
      for (let z = Hh.z0 + 0.5; z < Hh.z1; z += 1.6) post(mRedPlank, Hh.x - 0.9, z, 0.05, 0, 1.0, 6);
      bar(mRedPlank, [Hh.x - 0.9, 0.98, Hh.z0 + 0.5], [Hh.x - 0.9, 0.98, Hh.z1 - 0.3], 0.04, 4);
      /* behind the chief canopy: a red plank wall with a white-framed window (photographs 5, 6), and beside it a pale
         grey building with louvred windows */
      const P0 = PLANK;
      wall(mRedPlank, P0.x1, P0.z, P0.x0, P0.z, 0, 3.6); wall(mRedPlank, P0.x0, P0.z, P0.x0, P0.z + 4, 0, 3.6);
      wall(mDark, 11.4, P0.z - 0.012, 10.2, P0.z - 0.012, 1.25, 2.45);
      box(mWhite, 10.8, 1.2, P0.z - 0.03, 1.36, 0.08, 0.06); box(mWhite, 10.8, 2.5, P0.z - 0.03, 1.36, 0.08, 0.06); box(mWhite, 10.8, 1.85, P0.z - 0.03, 0.06, 1.3, 0.06);
      for (const dx of [-0.66, 0.66]) box(mWhite, 10.8 + dx, 1.85, P0.z - 0.03, 0.08, 1.38, 0.06);
      quad(mTin, [P0.x0 - 0.4, 3.55, P0.z - 0.7], [P0.x1 + 2, 3.55, P0.z - 0.7], [P0.x1 + 2, 4.5, P0.z + 4], [P0.x0 - 0.4, 4.5, P0.z + 4]);
      const mGrey = M({ color: 0xb9bcbc, roughness: 0.95 }), mLouvre = B({ map: tex(makeLouvre(THREE, cnv)), color: 0xffffff });
      wall(mGrey, GREY.x1, GREY.z, GREY.x0 - 6, GREY.z, 0, GREY.h); wall(mGrey, GREY.x0 - 6, GREY.z, GREY.x0 - 6, GREY.z + 6, 0, GREY.h);
      for (const x of [6.6, 4.2, 1.8, -0.6, -3.0]) { const g = new THREE.PlaneGeometry(1.1, 1.3); const m = new THREE.Mesh(g, mLouvre);
        m.position.set(x, 1.95, GREY.z - 0.012); m.rotation.y = Math.PI; world.add(m); owned.push(m); }
      box(mGrey, 1.2, GREY.h + 0.08, GREY.z + 0.2, 16, 0.16, 1.2);
    }

    /* ================================================================ A TENT (photographs 10, 11, 1)
       A green steel frame, a peaked green roof, and a valance of cloth round the eave with swags draped over it. */
    const mFrameGreen = M({ color: 0x1f7a3a, roughness: 0.5, metalness: 0.3 });
    const satinMats = new Map();
    const satin = (hex) => { let m = satinMats.get(hex); if (!m) satinMats.set(hex, m = surf('satin', { tile: [0.7, 0.7], mirror: 'u', tint: hex, roughness: 0.42, side: THREE.DoubleSide })); return m; };
    /* a swag: cloth hung between two points of an eave and sagging between them, its folds running down it */
    function swag(mat, a, b, depth, drop, out, segs = 10) {
      const dx = b[0] - a[0], dz = b[2] - a[2], len = Math.hypot(dx, dz), nx = -dz / len, nz = dx / len;       // it bellies `out` metres to the left of its way (the side a wall drawn the same way faces)
      let u = 0;
      for (let i = 0; i < segs; i++) {
        const k0 = i / segs, k1 = (i + 1) / segs, s0 = Math.sin(k0 * Math.PI), s1 = Math.sin(k1 * Math.PI);
        const p0 = [a[0] + dx * k0 + nx * out * s0 * 0.5, a[1] - s0 * 0.04, a[2] + dz * k0 + nz * out * s0 * 0.5];
        const p1 = [a[0] + dx * k1 + nx * out * s1 * 0.5, a[1] - s1 * 0.04, a[2] + dz * k1 + nz * out * s1 * 0.5];
        const q0 = [p0[0] + nx * out * s0 * 0.5, p0[1] - depth * 0.45 - drop * s0, p0[2] + nz * out * s0 * 0.5];
        const q1 = [p1[0] + nx * out * s1 * 0.5, p1[1] - depth * 0.45 - drop * s1, p1[2] + nz * out * s1 * 0.5];
        quad(mat, q0, q1, p1, p0, u, 0); u += len / segs;
      }
    }
    function tent(cx, cz, o = {}) {
      const w = o.w || TENT.w, e = o.eave || TENT.eave, pk = o.peak || TENT.peak, hw = w / 2;
      const roof = o.roof || satinRoof(0x18a044), frame = o.frame || mFrameGreen;
      const C = [[cx - hw, cz + hw], [cx + hw, cz + hw], [cx + hw, cz - hw], [cx - hw, cz - hw]];        // SW, SE, NE, NW
      for (const [x, z] of C) post(frame, x, z, 0.022, 0, e, 6);
      for (let k = 0; k < 4; k++) { const [xa, za] = C[k], [xb, zb] = C[(k + 1) % 4];
        bar(frame, [xa, e, za], [xb, e, zb], 0.018, 4);
        quad(roof, [xa - Math.sign(cx - xa) * 0.06, e + 0.02, za - Math.sign(cz - za) * 0.06], [xb - Math.sign(cx - xb) * 0.06, e + 0.02, zb - Math.sign(cz - zb) * 0.06], [cx, pk, cz], [cx, pk, cz]);
        /* the valance: a band of cloth hanging from the eave, and swags over it */
        const vm = satin(o.valance != null ? o.valance : 0xf4f4f0);
        wall(vm, xa, za, xb, zb, e - 0.28, e + 0.01);
        const n = o.swags || 3, cols = o.swagCols || [0x18a044, 0xf4f4f0];
        for (let s = 0; s < n; s++) { const k0 = s / n, k1 = (s + 1) / n;
          swag(satin(cols[s % cols.length]), [lp(xa, xb, k0), e + 0.005, lp(za, zb, k0)], [lp(xa, xb, k1), e + 0.005, lp(za, zb, k1)], 0.42, 0.2, 0.07); }
      }
      return C;
    }
    const satinRoofs = new Map();
    const satinRoof = (hex) => { let m = satinRoofs.get(hex); if (!m) satinRoofs.set(hex, m = M({ color: hex, roughness: 0.62, side: THREE.DoubleSide })); return m; };

    /* ================================================================ THE OFFERING TABLES (photographs 10, 9, 4, 8)
       Three steps under white cloth, the lowest in front; a bright green satin skirt to the ground hung with swags of
       jasmine lattice and marigold. Everything that stands on them is a real model, made from a crop of his photograph. */
    const mCloth = M({ color: 0xf5f4ef, roughness: 0.86 });
    const mSkirt = surf('skirt', { tile: [0.9, 0.78], mirror: 'u', roughness: 0.38, side: THREE.DoubleSide });
    const SWAG = { w: 1.25, h: 0.6 };
    /* one garland swag hung from (x0, z0) to (x1, z1) at height y, facing the left of that way */
    function garland(x0, z0, x1, z1, y) {
      const len = Math.hypot(x1 - x0, z1 - z0), nx = -(z1 - z0) / len, nz = (x1 - x0) / len, o = 0.018;
      const g = new THREE.PlaneGeometry(len, SWAG.h * len / SWAG.w);
      const m = new THREE.Mesh(g, mSwagPlane); m.position.set((x0 + x1) / 2 + nx * o, y - SWAG.h * len / SWAG.w / 2 + 0.03, (z0 + z1) / 2 + nz * o);
      m.rotation.y = Math.atan2(nx, nz); world.add(m); owned.push(m);
    }
    /* (a plane's own UVs are 0..1 with v up, and an ImageBitmap's first row is its top: the picture is turned once here) */
    const mSwagPlane = B({ color: SURF.swag[0], alphaTest: 0.5, side: THREE.DoubleSide });
    surfLoad('swag').then(t0 => { if (!t0 || !alive) return; const t = t0.clone(); t.needsUpdate = true; madeTex.push(t);
      t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping; t.repeat.set(1, -1); t.offset.set(0, 1); mSwagPlane.map = t; mSwagPlane.color.set(0xffffff); mSwagPlane.needsUpdate = true; });
    function buildTables() {
      const T0 = TABLES, n = T0.tops.length;
      for (let k = 0; k < n; k++) {                                          // k 0 the front step
        const zf = T0.z1 - k * T0.step, zb = zf - T0.step, top = T0.tops[k];
        box(mCloth, (T0.x0 + T0.x1) / 2, top / 2, (zf + zb) / 2, T0.x1 - T0.x0, top, T0.step);
        /* the skirt down each side of this step, and a garland on it */
        wall(mSkirt, T0.x1 + 0.01, zf, T0.x1 + 0.01, zb, 0, top - 0.02); wall(mSkirt, T0.x0 - 0.01, zb, T0.x0 - 0.01, zf, 0, top - 0.02);
        garland(T0.x1 + 0.012, zf, T0.x1 + 0.012, zb, top - 0.03); garland(T0.x0 - 0.012, zb, T0.x0 - 0.012, zf, top - 0.03);
      }
      /* the skirt across the front, and four garlands along it */
      wall(mSkirt, T0.x0 - 0.01, T0.z1 + 0.01, T0.x1 + 0.01, T0.z1 + 0.01, 0, T0.tops[0] - 0.02);
      for (let k = 0; k < 4; k++) garland(T0.x0 + k * SWAG.w, T0.z1 + 0.012, T0.x0 + (k + 1) * SWAG.w, T0.z1 + 0.012, T0.tops[0] - 0.03);
      solidBox(T0.x1 - T0.x0 + 0.5, 1.5, T0.z1 - T0.z0 + 0.3, 0, 0.75, (T0.z0 + T0.z1) / 2);
    }
    /* WHAT STANDS ON AND ROUND THEM. Each list is places in the world: x, y (the step's top), z, and a turn. A thing is
       drawn once its model is in the build (`have`); until then its key is listed as waiting (stage.info). */
    function dressTables() {
      const [y0, y1, y2] = TABLES.tops, zf = -10.4, zm = -11.2, zb = -12.0;
      stand('w3wheel', WHEEL.x, y2, WHEEL.z, 0);                                                   // the great bai sri and its wheel of marigolds
      stand('w3parasol', PARASOL.x, 0, PARASOL.z, 0);                                              // the orange and gold parasol over it
      many('w3naga', [{ x: 1.15, y: y2, z: -11.95, ry: -0.5 }, { x: 1.6, y: y2, z: -12.1, ry: -0.75 }, { x: 2.05, y: y2, z: -11.9, ry: -1.0 }], world, 0.8);
      many('w3tower', [{ x: -3.25, y: 0, z: -11.0, ry: 0.3 }, { x: 3.25, y: 0, z: -11.0, ry: 2.1 }], world, 2.8);
      many('w3baisri', [{ x: -2.05, y: y1, z: zm, ry: 0.4 }, { x: -1.2, y: y1, z: zm - 0.08, ry: 1.3 }, { x: 1.2, y: y1, z: zm - 0.08, ry: 2.2 }, { x: 2.05, y: y1, z: zm, ry: 0.9 },
                        { x: -2.1, y: y2, z: zb, ry: 2.6 }, { x: -0.95, y: y2, z: zb + 0.12, ry: 0.2 }], world, 0.6);
      many('w3pewter', [{ x: -1.55, y: y2, z: zb - 0.05, ry: 0.7 }, { x: -0.45, y: y1, z: zm + 0.1, ry: 1.9 }, { x: 0.5, y: y1, z: zm + 0.1, ry: 0.3 }], world, 0.5);
      many('w3fruit', [{ x: -1.65, y: y1, z: zm + 0.16, ry: 0.2 }, { x: 0, y: y1, z: zm - 0.12, ry: 1.1 }, { x: 1.65, y: y1, z: zm + 0.16, ry: 2.4 }, { x: -0.6, y: y0, z: zf - 0.1, ry: 0.6 }, { x: 1.9, y: y0, z: zf - 0.12, ry: 1.7 }], world, 0.3);
      many('w3sweets', [{ x: -2.0, y: y0, z: zf - 0.1, ry: 0.3 }, { x: 0.65, y: y0, z: zf - 0.12, ry: 1.5 }], world, 0.2);
      many('w3khantok', [{ x: -1.3, y: y0, z: zf - 0.08, ry: 0.9 }, { x: 1.3, y: y0, z: zf - 0.06, ry: 2.0 }], world, 0.25);
      many('w3candle', [{ x: -2.95, y: 0, z: -10.25, ry: 0.2 }, { x: 2.95, y: 0, z: -10.25, ry: 1.4 }, { x: -2.2, y: y2, z: -12.2, ry: 0 }, { x: 2.3, y: y2, z: -12.25, ry: 0.8 }], world, 1.25);
      many('w3purple', [{ x: -3.9, y: 0, z: -10.2, ry: 0.5 }, { x: 3.9, y: 0, z: -10.2, ry: 2.2 }], world, 1.1);
      for (const sx of [-1, 1]) solidBox(0.7, 1.5, 0.7, sx * 3.25, 0.75, -11.0);
    }

    /* a plain folding table (a white top on blue steel legs: photographs 11, 12). A stand-in drawn in code until its
       model lands: it is furniture nobody looks at, under a dozen bai sri */
    const mBlueLeg = M({ color: 0x2b55a8, roughness: 0.5, metalness: 0.3 }), mTop = M({ color: 0xecebe6, roughness: 0.6 });
    function foldTable(x, z, ry, w = 1.8, d = 0.75, h = 0.75) {
      box(mTop, x, h - 0.02, z, w, 0.04, d, ry);
      const c = Math.cos(ry), s = Math.sin(ry);
      for (const [lx, lz] of [[-w / 2 + 0.08, -d / 2 + 0.08], [w / 2 - 0.08, -d / 2 + 0.08], [w / 2 - 0.08, d / 2 - 0.08], [-w / 2 + 0.08, d / 2 - 0.08]])
        post(mBlueLeg, x + lx * c + lz * s, z - lx * s + lz * c, 0.016, 0, h - 0.04, 6);
      solidBox(w + 0.1, 1.4, d + 0.1, x, 0.7, z, ry);
      return h;
    }
    const TON_TABLE = { x: -6.1, z: 8.3, ry: 0.0 }, WEST_TABLE = { x: -7.2, z: -6.5, ry: Math.PI / 2 };
    function buildBaiSriTables() {
      const rnd = rng(2611);
      const rows = (T0, n, key, size) => {
        const h = foldTable(T0.x, T0.z, T0.ry), c = Math.cos(T0.ry), s = Math.sin(T0.ry), L = [];
        for (let i = 0; i < n; i++) { const lx = -0.72 + (i % (n / 2)) * (1.44 / (n / 2 - 1)), lz = i < n / 2 ? -0.17 : 0.18;
          L.push({ x: T0.x + lx * c + lz * s, y: h, z: T0.z - lx * s + lz * c, ry: rnd() * 6.28, s: size }); }
        many(key, L, world, 0.6);
        return L;
      };
      stageList.tonBai = rows(TON_TABLE, 8, 'w3baisri', 0.85);                 // Ton's group's, at the way in: one of them is his
      rows(WEST_TABLE, 10, 'w3pewter', 1);                                     // the table by the west tents (photographs 11, 12)
    }
    const stageList = {};

    /* ================================================================ THE TENTS, AND WHAT IS UNDER THEM */
    const mCarpet = surf('carpet', { tile: [2.4, 1.6], clamp: true, roughness: 0.95 });
    const mMat = surf('mat', { tile: 1.1, mirror: 'uv', roughness: 0.9 });
    const mStripe = surf('mat', { tile: 0.8, mirror: 'uv', tint: 0xc8d8ff, roughness: 0.9 });
    /* a rug or a mat lying on the turf: its long side `w` along its own x, turned ry */
    function rug(mat, x, z, w, d, ry, y = 0.007) {
      const c = Math.cos(ry), s = Math.sin(ry), P = (lx, lz) => [x + lx * c + lz * s, y, z - lx * s + lz * c];
      quad(mat, P(-w / 2, d / 2), P(w / 2, d / 2), P(w / 2, -d / 2), P(-w / 2, -d / 2));
    }
    function buildTents() {
      const opts = { valance: 0xf4f4f0, swagCols: [0x1ca548, 0xf4f4f0] };
      for (const T0 of [TENT_W1, TENT_W2, TENT_E]) { const C = tent(T0.x, T0.z, opts); for (const [x, z] of C) solidBox(0.16, 2.2, 0.16, x, 1.1, z); }
      /* west tent 1: the hermit in brown, the master in red and the second master in white on pale green sofas, facing
         east; straw mats and a striped mat before them */
      rug(mMat, -8.1, -1.0, 3.6, 1.8, Math.PI / 2); rug(mStripe, -7.0, -0.3, 1.9, 0.9, Math.PI / 2, 0.009);
      many('w3sofa', [{ x: -10.25, y: 0, z: -2.2, ry: Math.PI / 2 }, { x: -10.25, y: 0, z: -0.95, ry: Math.PI / 2 }, { x: -10.25, y: 0, z: 0.3, ry: Math.PI / 2 }], world, 0.9);
      solidBox(1.0, 1.4, 3.9, -10.3, 0.7, -0.95);
      many('w3petalsteel', [{ x: -9.1, y: 0, z: -1.6, ry: 0 }], world, 0.3);
      many('w3purple', [{ x: -7.0, y: 0, z: 1.0, ry: 1.0 }], world, 1.1);
      /* west tent 2: the hermit in the yellow shawl */
      rug(mMat, -8.1, 5.0, 3.2, 1.8, Math.PI / 2);
      many('w3sofa', [{ x: -10.25, y: 0, z: 5.0, ry: Math.PI / 2 }], world, 0.9);
      solidBox(1.0, 1.4, 1.5, -10.3, 0.7, 5.0);
      /* the east tent: the monks' row, the naga staff and the peacock fan, low round trays with coconuts and water */
      rug(mMat, 8.1, -2.0, 3.6, 1.8, Math.PI / 2);
      many('w3chair', [{ x: 10.2, y: 0, z: -3.2, ry: -Math.PI / 2 }, { x: 10.2, y: 0, z: -2.0, ry: -Math.PI / 2 }, { x: 10.2, y: 0, z: -0.8, ry: -Math.PI / 2 }], world, 1.15);
      solidBox(0.9, 1.4, 3.6, 10.25, 0.7, -2.0);
      many('w3khantok', [{ x: 9.2, y: 0, z: -2.6, ry: 0.4 }, { x: 9.2, y: 0, z: -1.2, ry: 1.9 }], world, 0.25);
      stand('w3nagastaff', 10.55, 0, -3.75, 0.3); stand('w3fan', 10.5, 0.02, -0.15, -1.2);
      /* THE CHIEF CANOPY (photographs 1, 5, 6): a dark top, a valance of gold and lime in swags, one pole wrapped in
         puffs of lime cloth; maroon carpets deep in petals; his bench, a carved chair, a low dark table */
      const C = tent(CHIEF.x, CHIEF.z, { w: CHIEF.w, eave: CHIEF.eave, peak: CHIEF.peak, roof: satinRoof(0x23301f), valance: 0xd8a41c, swags: 4, swagCols: [0xb6d62e, 0xe2a61a] });
      for (const [x, z] of C) solidBox(0.16, 2.2, 0.16, x, 1.1, z);
      many('w3puff', [0, 1, 2].map(k => ({ x: C[3][0], y: 0.02 + k * 0.72, z: C[3][1], ry: k * 1.1 })), world, 0.75);   // the north-west pole, the one the turf sees
      rug(mCarpet, 5.2, 8.2, 2.4, 1.6, BENCH.ry + Math.PI / 2); rug(mCarpet, 3.9, 6.9, 2.4, 1.6, BENCH.ry + Math.PI / 2 + 0.06, 0.009);
      stand('w3bench', BENCH.x, 0, BENCH.z, BENCH.ry);
      solidBox(1.9, 1.4, 0.75, BENCH.x, 0.7, BENCH.z, BENCH.ry);
      stand('w3chair', 7.75, 0, 8.35, BENCH.ry - 0.35);
      stand('w3lowtable', 5.75, 0, 9.95, BENCH.ry + 0.2);
      many('w3petalbowl', [{ x: 5.75, y: 0.42, z: 9.95, ry: 0 }, { x: 7.35, y: 0, z: 9.3, ry: 1 }], world, 0.3);
      many('w3purple', [{ x: 8.05, y: 0, z: 7.05, ry: 2.0 }], world, 1.1);
    }

    /* ================================================================ THE BANNERS, THE POLE, THE FLAGS (photographs 8, 10)
       Long banners of cloth in tiers on tall bamboo: fourteen in a row behind the tables, four along the west side; six
       colours. Each is one picture of a tiered banner (white, cut out) crossed with itself and tinted, hung from the tip
       of its pole; they turn a little in the wind (frame: windTick). */
    const BANNER = { w: 0.36, h: 3.2, top: 4.85 };
    const BCOL = { white: 0xf4f2ec, yellow: 0xf3c11c, red: 0xd9323a, purple: 0x8e52cc, pink: 0xf08cb6, green: 0x62bd72 };
    const banners = { im: null, list: [] };
    function buildBanners() {
      const order = ['white', 'yellow', 'red', 'white', 'purple', 'yellow', 'pink', 'red', 'white', 'purple', 'pink', 'yellow', 'green', 'white'];
      const mBamboo = M({ color: 0x9a8a5c, roughness: 0.8 });
      const rnd = rng(8104);
      const put = (x, z, col, lean) => {
        const tipX = x + Math.sin(lean) * 0.5, tipZ = z + Math.cos(lean) * 0.5;
        bar(mBamboo, [x, 0, z], [x + Math.sin(lean) * 0.12, 4.2, z + Math.cos(lean) * 0.12], 0.028, 6);
        bar(mBamboo, [x + Math.sin(lean) * 0.12, 4.2, z + Math.cos(lean) * 0.12], [tipX, BANNER.top + 0.12, tipZ], 0.02, 6);
        banners.list.push({ x: tipX, y: BANNER.top, z: tipZ, col, ph: rnd() * 6.28, ry: rnd() * 3.14, k: 0.7 + rnd() * 0.6 });
      };
      order.forEach((c, i) => put(-11 + i * (22 / 13), -14.5 + (rnd() - 0.5) * 0.5, c, 0.2 + rnd() * 0.5));
      [['pink', -8], ['white', -6], ['yellow', -4], ['red', -2]].forEach(([c, z]) => put(-11.5 + (rnd() - 0.5) * 0.3, z, c, 1.4 + rnd() * 0.4));
      /* the picture twice, crossed, hanging DOWN from its own origin (so a turn about the origin is a swing from the tip) */
      const g = new THREE.BufferGeometry(), w = BANNER.w / 2, h = BANNER.h, P = [], U = [], N = [];
      for (const [ax, az] of [[1, 0], [0, 1]]) {
        const v = [[-w * ax, 0, -w * az, 0, 0], [w * ax, 0, w * az, 1, 0], [w * ax, -h, w * az, 1, 1], [-w * ax, -h, -w * az, 0, 1]];
        for (const k of [0, 2, 1, 0, 3, 2]) { P.push(v[k][0], v[k][1], v[k][2]); U.push(v[k][3], v[k][4]); N.push(az, 0, ax); }
      }
      g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(U, 2));
      g.setAttribute('normal', new THREE.Float32BufferAttribute(N, 3));
      const mBan = M({ color: 0xffffff, roughness: 0.85, alphaTest: 0.5, side: THREE.DoubleSide });
      surfLoad('banner').then(t0 => { if (!t0 || !alive) return; const t = t0.clone(); t.needsUpdate = true; madeTex.push(t);
        t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping; mBan.map = t; mBan.needsUpdate = true; });   // (v 0 at the tip: the picture's first row, its top)
      const im = new THREE.InstancedMesh(g, mBan, banners.list.length);
      const col = new THREE.Color();
      banners.list.forEach((b, i) => im.setColorAt(i, col.set(BCOL[b.col])));
      im.instanceColor.needsUpdate = true; im.frustumCulled = false;
      world.add(im); owned.push(im); banners.im = im;
      windTick(0);
    }
    const _wm = new THREE.Matrix4(), _wq = new THREE.Quaternion(), _we = new THREE.Euler(), _wp = new THREE.Vector3(), _ws = new THREE.Vector3(1, 1, 1);
    /* THE WIND (the plan's §3.7): the banners swing from their tips and turn a little. t is the clock that is running:
       the film's in a film (so a seek lands on the same picture, v6.4), the wall's in play */
    function windTick(t) {
      const im = banners.im; if (!im) return;
      banners.list.forEach((b, i) => {
        const a = Math.sin(t * 0.9 * b.k + b.ph), c = Math.sin(t * 0.53 * b.k + b.ph * 1.7);
        _we.set(0.045 * a + 0.02, b.ry + 0.5 * c, 0.035 * c, 'YXZ'); _wq.setFromEuler(_we);
        im.setMatrixAt(i, _wm.compose(_wp.set(b.x, b.y, b.z), _wq, _ws));
      });
      im.instanceMatrix.needsUpdate = true;
    }
    /* the pole wrapped in tiers of coloured satin, and the strings of small flags that run from its top (photograph 8) */
    const TOP = [POLE.x, POLE.h - 0.25, POLE.z];
    function buildPole() {
      const mPole = M({ color: 0x8c8474, roughness: 0.7 });
      post(mPole, POLE.x, POLE.z, 0.05, 0, POLE.h, 8, 0.035);
      const puff = (y, hh, r, hex) => {
        const pts = []; for (let i = 0; i <= 10; i++) { const k = i / 10; pts.push(new THREE.Vector2(0.05 + r * Math.pow(Math.sin(k * Math.PI), 0.6), k * hh)); }
        geo(satin(hex), new THREE.LatheGeometry(pts, 14), _gm.makeTranslation(POLE.x, y, POLE.z), 2.0, hh / 0.7);
      };
      /* from the top down, as photograph 10 shows it: teal, pink-white, yellow, yellow, red; then plainer ones below */
      puff(9.15, 0.75, 0.2, 0x16a698); puff(8.45, 0.72, 0.27, 0xf6dfe6); puff(7.8, 0.66, 0.3, 0xf5c81c); puff(7.2, 0.62, 0.29, 0xf2b616); puff(6.35, 0.86, 0.33, 0xd72a34);
      /* the strings: from the pole's top out to the trees, the tents, the hall and the sheds */
      const ends = [[-15, 7.2, 3], [9, 6.8, -15], [-9, 3.5, -1], [9, 3.5, -2], [6, 3.3, 9], [-9, 3.5, 5], [-11, 3.8, -9.6], [11, 3.8, -9.6], [0, 6.8, -20], [-13.5, 3.7, -11], [3, 3.2, 12.6], [-5, 3.2, 12.6]];
      const fl = [], lineP = [], rnd = rng(4410), FLAGS = [0x2fa64a, 0xf2c21c, 0x2f6fd0, 0xf07a1c, 0xf4f2ec, 0xe8528c];
      ends.forEach((e, si) => {
        const len = Math.hypot(e[0] - TOP[0], e[1] - TOP[1], e[2] - TOP[2]), n = Math.floor(len / 0.62), sag = len * 0.07;
        let prev = TOP;
        for (let i = 1; i <= n; i++) {
          const k = i / n, p = [lp(TOP[0], e[0], k), lp(TOP[1], e[1], k) - Math.sin(k * Math.PI) * sag, lp(TOP[2], e[2], k)];
          lineP.push(prev[0], prev[1], prev[2], p[0], p[1], p[2]); prev = p;
          if (i < n) fl.push({ p, ry: Math.atan2(e[0] - TOP[0], e[2] - TOP[2]) + Math.PI / 2 + (rnd() - 0.5) * 0.5, c: FLAGS[(i + si) % FLAGS.length], rz: (rnd() - 0.5) * 0.5 });
        }
      });
      const lg = new THREE.BufferGeometry(); lg.setAttribute('position', new THREE.Float32BufferAttribute(lineP, 3));
      const ln = new THREE.LineSegments(lg, new THREE.LineBasicMaterial({ color: 0x4a463e })); mats.push(ln.material); world.add(ln); owned.push(ln);
      const tg = new THREE.BufferGeometry();
      tg.setAttribute('position', new THREE.Float32BufferAttribute([-0.085, 0, 0, 0.085, 0, 0, 0, -0.24, 0], 3));
      tg.setAttribute('normal', new THREE.Float32BufferAttribute([0, 0, 1, 0, 0, 1, 0, 0, 1], 3));
      const fm = M({ color: 0xffffff, roughness: 0.8, side: THREE.DoubleSide });
      const fi = new THREE.InstancedMesh(tg, fm, fl.length), col = new THREE.Color();
      fl.forEach((f, i) => { _we.set(0, f.ry, f.rz, 'YXZ'); _wq.setFromEuler(_we); fi.setMatrixAt(i, _wm.compose(_wp.set(f.p[0], f.p[1], f.p[2]), _wq, _ws)); fi.setColorAt(i, col.set(f.c)); });
      fi.instanceMatrix.needsUpdate = true; fi.instanceColor.needsUpdate = true; fi.frustumCulled = false; world.add(fi); owned.push(fi);
      /* the power lines across the sky (photographs 8, 10), on two concrete poles beyond the ground */
      const wp = [];
      for (const dy of [0, 0.35, 0.7]) { const a = [15, 7.6 + dy, -24], b = [-20, 7.2 + dy, 17]; let pv = a;
        for (let i = 1; i <= 16; i++) { const k = i / 16, p = [lp(a[0], b[0], k), lp(a[1], b[1], k) - Math.sin(k * Math.PI) * 0.9, lp(a[2], b[2], k)]; wp.push(pv[0], pv[1], pv[2], p[0], p[1], p[2]); pv = p; } }
      const wg = new THREE.BufferGeometry(); wg.setAttribute('position', new THREE.Float32BufferAttribute(wp, 3));
      const wl = new THREE.LineSegments(wg, new THREE.LineBasicMaterial({ color: 0x23211f })); mats.push(wl.material); world.add(wl); owned.push(wl);
      post(mConcrete, 15, -24, 0.14, 0, 8.6, 8, 0.1); post(mConcrete, -20, 17, 0.14, 0, 8.2, 8, 0.1);
    }

    /* ================================================================ THE TREES
       Real models (v24.20: no tree is built in code): the rain tree and the mango of this episode's first chapter, the
       same countryside's trees (declared: reuseInEpisode). Far off, the line of trees is his kind of country's, a
       picture cut out and laid round the ground on a ring. */
    const TREES = [
      /* (the two that stand over the turf are the fuller level of each, whose crowns are leaves: the lighter level's are
         shards from close by, which is what Chad saw in chapter 1's yard at v24.27) */
      { key: 'e4raintreehd', x: -15.5, z: 3, h: 13.5, ry: 0.4 },     // the huge tree west of the turf (photograph 10)
      { key: 'e4mangohd', x: 8.6, z: 12.6, h: 9.5, ry: 2.1 },        // the tree behind the chief canopy: its shade lies over the turf's south
      { key: 'e4raintree', x: 10.5, z: -16, h: 10.5, ry: 3.0 },      // north-east (photograph 8)
      { key: 'e4mango', x: -13.5, z: 15.5, h: 8.5, ry: 5.0 }         // south-west, by the way in
    ];
    function buildTrees() {
      for (const T0 of TREES) stand(T0.key, T0.x, 0, T0.z, T0.ry, { h: T0.h, lift: 1 });
      const R = 64, Hh = 20;
      const g = new THREE.CylinderGeometry(R, R, Hh, 56, 1, true);
      const uv = g.attributes.uv; for (let k = 0; k < uv.count; k++) uv.setX(k, uv.getX(k) * 5);
      const mRing = B({ color: SURF.treeline[0], alphaTest: 0.5, side: THREE.BackSide, fog: true, transparent: false });
      surfLoad('treeline').then(t0 => { if (!t0 || !alive) return; const t = t0.clone(); t.needsUpdate = true; madeTex.push(t);
        t.wrapS = THREE.RepeatWrapping; t.wrapT = THREE.ClampToEdgeWrapping; t.repeat.set(1, -1); t.offset.set(0, 1); mRing.map = t; mRing.color.set(0xd8dcd4); mRing.needsUpdate = true; });
      const ring = new THREE.Mesh(g, mRing); ring.position.y = Hh / 2 - 1.2; ring.renderOrder = -5; world.add(ring); owned.push(ring);
      ring.visible = have('w3t_treeline');
    }

    /* ================================================================ PETALS ON THE GROUND
       Marigold petals by the handful lie where they were thrown: before each master's seat on day one; all over the
       turf by the next morning. One small cluster of petals (drawn: a few petals with holes between them) laid flat
       thousands of times, each turned its own way (a seeded scatter). */
    const petalMat = M({ color: 0xffffff, roughness: 0.75, alphaTest: 0.45, side: THREE.DoubleSide, map: tex(makePetals(THREE, cnv)) });
    function petalField(n, seed, where, parent) {
      const g = new THREE.PlaneGeometry(1, 1); g.rotateX(-Math.PI / 2);
      const im = new THREE.InstancedMesh(g, petalMat, n), rnd = rng(seed), col = new THREE.Color();
      for (let i = 0; i < n; i++) {
        const [x, z] = where(rnd), s = 0.07 + rnd() * 0.07;
        _we.set((rnd() - 0.5) * 0.25, rnd() * 6.283, (rnd() - 0.5) * 0.25, 'YXZ'); _wq.setFromEuler(_we);
        im.setMatrixAt(i, _wm.compose(_wp.set(x, 0.012 + rnd() * 0.01, z), _wq, _ws.set(s, s, s)));
        im.setColorAt(i, col.setHSL(0.105 + rnd() * 0.04, 0.98, 0.5 + rnd() * 0.06, THREE.SRGBColorSpace));   // (said in sRGB: three reads a bare HSL as linear light, and marigold came out cream)
      }
      _ws.set(1, 1, 1);
      im.instanceMatrix.needsUpdate = true; im.instanceColor.needsUpdate = true; im.frustumCulled = false; parent.add(im); owned.push(im);
      return im;
    }
    /* a scatter round a point: thick at its middle, thinning out (two of a stream's numbers averaged) */
    const around = (cx, cz, r) => (rnd) => { const a = rnd() * 6.283, d = r * (rnd() + rnd()) / 2; return [cx + Math.cos(a) * d, cz + Math.sin(a) * d]; };
    const mix = (...fs) => (rnd) => fs[Math.floor(rnd() * fs.length) % fs.length](rnd);
    function buildPetals() {
      /* day one: before the chief bench, before the two west tents and the east one, and at the tables' front */
      petalField(LOW ? 1500 : 2600, 5101, mix(around(4.6, 7.6, 2.6), around(4.6, 7.6, 1.5), around(-7.6, -0.8, 2.2), around(-7.6, 5.0, 1.7), around(7.6, -2.0, 2.0), around(0, -9.3, 2.6)), dayOne);
      /* day two: yesterday's petals everywhere, trodden into the turf */
      petalField(LOW ? 3200 : 5600, 5102, mix((rnd) => [TURF.x0 + rnd() * (TURF.x1 - TURF.x0), TURF.z0 + rnd() * (TURF.z1 - TURF.z0)],
        around(4.6, 7.6, 3.2), around(-7.6, -0.8, 2.8), around(7.6, -2.0, 2.6), around(0, -9.3, 3.0), around(0, 1.5, 6)), dayTwo);
    }

    /* ================================================================ PAINTED SHADOW (v9.3, v9.4)
       Nothing on a phone casts a shadow, and a hard sun with no shadows is a ground with nothing standing on it. So the
       shade is painted: one sheet over the whole ground, drawn from what stands on it and where the sun of the look is
       (SUNS), redrawn in the black when the look changes. A thing's shade is its outline at its height, slid along the
       ground away from the sun. */
    const SHADE = { x0: -14, x1: 14, z0: -15, z1: 14, px: 768 };
    const shade = { c: null, x: null, t: null, m: null, look: '' };
    function buildShade() {
      const [c, x] = cnv(SHADE.px); shade.c = c; shade.x = x;
      const t = tex(new THREE.CanvasTexture(c)); t.colorSpace = THREE.SRGBColorSpace; shade.t = t;
      const m = B({ map: t, transparent: true, depthWrite: false, color: 0xffffff });
      const g = new THREE.PlaneGeometry(SHADE.x1 - SHADE.x0, SHADE.z1 - SHADE.z0); g.rotateX(-Math.PI / 2);
      const mesh = new THREE.Mesh(g, m); mesh.position.set((SHADE.x0 + SHADE.x1) / 2, 0.016, (SHADE.z0 + SHADE.z1) / 2); mesh.renderOrder = 2;
      world.add(mesh); owned.push(mesh); shade.m = mesh;
    }
    function paintShade(look) {
      if (shade.look === look || !shade.x) return;
      shade.look = look;
      const S0 = SHADE, px = S0.px, sun = SUNS[look];
      shade.x.clearRect(0, 0, px, px);
      if (!sun) { shade.t.needsUpdate = true; return; }                       // night, dusk: no sun's shade
      const sx = -sun[0] / sun[1], sz = -sun[2] / sun[1];                      // how far a point one metre up throws its shade
      const X = (wx) => (wx - S0.x0) / (S0.x1 - S0.x0) * px, Z = (wz) => (wz - S0.z0) / (S0.z1 - S0.z0) * px;
      const long = Math.hypot(sx, sz);
      /* every shape is drawn SOLID on a sheet of its own first, so shade over shade is still one shade; the sheet is
         then laid down once, at the shade's own strength */
      const [cA, x] = cnv(px); x.clearRect(0, 0, px, px);
      x.fillStyle = 'rgb(8,16,10)'; x.strokeStyle = 'rgb(8,16,10)';
      /* a flat outline at height h */
      const poly = (pts, h) => { x.beginPath(); pts.forEach(([wx, wz], i) => { const u = X(wx + sx * h), v = Z(wz + sz * h); if (i) x.lineTo(u, v); else x.moveTo(u, v); }); x.closePath(); x.fill(); };
      /* a standing box: its foot, its top's shade, and the four sides between */
      const boxS = (x0, z0, x1, z1, h) => { const F = [[x0, z0], [x1, z0], [x1, z1], [x0, z1]]; poly(F, 0); poly(F, h);
        for (let i = 0; i < 4; i++) { const p = F[i], q = F[(i + 1) % 4]; x.beginPath(); x.moveTo(X(p[0]), Z(p[1])); x.lineTo(X(q[0]), Z(q[1])); x.lineTo(X(q[0] + sx * h), Z(q[1] + sz * h)); x.lineTo(X(p[0] + sx * h), Z(p[1] + sz * h)); x.closePath(); x.fill(); } };
      const tentS = (T0, w, e) => poly([[T0.x - w / 2, T0.z - w / 2], [T0.x + w / 2, T0.z - w / 2], [T0.x + w / 2, T0.z + w / 2], [T0.x - w / 2, T0.z + w / 2]], e + 0.3);
      for (const T0 of [TENT_W1, TENT_W2, TENT_E]) tentS(T0, TENT.w + 0.2, TENT.eave);
      tentS(CHIEF, CHIEF.w + 0.2, CHIEF.eave);
      boxS(TABLES.x0, TABLES.z0, TABLES.x1, TABLES.z1, 1.2);
      boxS(TON_TABLE.x - 0.9, TON_TABLE.z - 0.38, TON_TABLE.x + 0.9, TON_TABLE.z + 0.38, 0.75); boxS(WEST_TABLE.x - 0.38, WEST_TABLE.z - 0.9, WEST_TABLE.x + 0.38, WEST_TABLE.z + 0.9, 0.75);
      for (const sxx of [-1, 1]) boxS(sxx * 3.25 - 0.3, -11.3, sxx * 3.25 + 0.3, -10.7, 2.7);
      boxS(HALL.x0 - 1, HALL.z0, HALL.x1 + 1, HALL.z1 + 1, 4.2);
      boxS(HOUSE.x, HOUSE.z0, HOUSE.x + 6, HOUSE.z1, 4.0); boxS(PLANK.x0, PLANK.z, PLANK.x1, PLANK.z + 3, 3.6); boxS(GREY.x0 - 6, GREY.z, GREY.x1, GREY.z + 3, 4.2);
      poly([[SHED.x0 - 0.5, SHED.z0 - 0.5], [SHED.x1 + 0.6, SHED.z0 - 0.5], [SHED.x1 + 0.6, SHED.z1 + 0.5], [SHED.x0 - 0.5, SHED.z1 + 0.5]], 2.9);
      /* each banner: a thin bar of shade from its pole's foot to its tip's */
      x.lineWidth = Math.max(1.5, 0.2 / (S0.x1 - S0.x0) * px);
      for (const b of banners.list) { x.beginPath(); x.moveTo(X(b.x), Z(b.z)); x.lineTo(X(b.x + sx * 4.8), Z(b.z + sz * 4.8)); x.stroke(); }
      /* THE TREES' DAPPLE: each crown a cloud of leaves' shade with the sun coming through between */
      const rnd = rng(7707);
      for (const T0 of TREES) {
        const hh = T0.h * 0.72, r = T0.h * 0.42, cx = T0.x + sx * hh, cz = T0.z + sz * hh;
        for (let i = 0; i < 150; i++) { const an = rnd() * 6.283, d = r * Math.sqrt(rnd()) * 1.05, rr = 0.35 + rnd() * 0.75;
          x.beginPath(); x.ellipse(X(cx + Math.cos(an) * d), Z(cz + Math.sin(an) * d), rr * (1 + long * 0.3) / (S0.x1 - S0.x0) * px, rr / (S0.z1 - S0.z0) * px, Math.atan2(sz, sx), 0, 6.283); x.fill(); }
      }
      /* soften every edge (the sheet drawn at half size and back: a canvas filter is not everywhere), then lay it down
         at the shade's strength: a long low shade is a paler one */
      const [c2, x2] = cnv(px / 2); x2.clearRect(0, 0, px / 2, px / 2); x2.imageSmoothingEnabled = true; x2.drawImage(cA, 0, 0, px / 2, px / 2);
      const out = shade.x; out.imageSmoothingEnabled = true; out.globalAlpha = Math.min(0.5, 0.42 / Math.sqrt(Math.max(1, long)));
      out.drawImage(c2, 0, 0, px, px); out.globalAlpha = 1;
      shade.t.needsUpdate = true;
    }

    /* ================================================================ THE WORLD IS BUILT (every name a builder or a frame
       asks for is declared above: the v21.1 TDZ law) */
    buildGround();
    buildHall();
    buildSurround();
    buildTables();
    buildBaiSriTables();
    buildTents();
    buildBanners();
    buildPole();
    flush();
    dressTables();
    buildTrees();
    buildPetals();
    buildShade();
    paintShade('DAY1');

    /* ================================================================ THE PLAY (the plan's §4.1, §4.3, §9)
       Every beat on the chapter clock (wall time, v7.1); every line through the queue, one voice at a time; each beat's
       receipt in the phase string, so a Continue lands where a reload would. */
    const PHASES = ['arrive', 'baisri', 'tables', 'place', 'festival', 'seen', 'check', 'dawn', 'knelt', 'told', 'breath', 'taught', 'decide'];
    let phase = 'arrive';
    let booted = false;
    const dayClock = { t: 0 };
    let lastWall = 0;
    const todo = [];
    function after(secs, fn) { todo.push({ at: dayClock.t + secs, fn }); todo.sort((a, b) => a.at - b.at); }
    function runTodo() { while (todo.length && todo[0].at <= dayClock.t) todo.shift().fn(); }
    function dropTodo() { todo.length = 0; }
    const heard = new Set();
    const speak = { until: 0, pending: null, voiceTo: 0 };
    function speakReset() { speak.until = 0; speak.pending = null; speak.voiceTo = 0; }
    /* A LINE IS A BEAT, HEARD OR NOT (e3c3's law): a muted game speaks it silently on its own length, a line whose bytes
       have not landed is held a moment (v8.0) and then spoken silently, so a beat chained on a line never stops */
    function sayLine(name, vol = 1, onStart, pan) {
      if (dayClock.t < speak.until) return false;
      const start = () => { speak.voiceTo = dayClock.t + (SECS[name] || 2.5); speak.until = speak.voiceTo + 0.25; heard.add(name); if (onStart) onStart(); };
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
    const lineQ = [];
    function queueLine(name, onStart, vol = 1, pan = 0) { lineQ.push({ name, onStart, vol, pan }); }
    function queueFn(fn) { lineQ.push({ fn }); }
    function queueGap(gap) { lineQ.push({ gap }); }
    function runQueue() {
      if (!lineQ.length || speak.pending || dayClock.t < speak.until) return;
      const q = lineQ.shift();
      if (q.fn) { q.fn(); return; }
      if (q.gap) { speak.until = dayClock.t + q.gap; return; }
      sayLine(q.name, q.vol, q.onStart, q.pan);
    }

    const W = DATA.words;
    const play = { run: 0, busy: false };
    let decOpen = false;
    function mark() { return ''; }
    function readMark(p0) {
      const [p1] = String(p0 || '').split(':');
      return { p: PHASES.includes(p1) ? p1 : 'arrive' };
    }
    function setPhase(p, opts) { phase = p; if (kit) kit.setPhase(p + ':' + mark()); objectiveFor(p, opts); }
    function objectiveFor(p, opts) {
      if (!kit) return;
      let o = null, wp = null;
      if (p === 'arrive') { o = W.objTon; }
      kit.objective(o, opts);
      kit.waypoint(wp);
    }
    /* THE LOOK: which of the looks the ground wears (a preset of light, the painted shade, and what only that day draws) */
    let lookName = 'DAY1';
    function look(name, secs = 0) {
      if (kit) kit.daylight(PRESETS[name] || null, secs);
      lookName = name;
      const two = name === 'DAWN' || name === 'OPENED' || name === 'SHUT' || name === 'AFTERNOON' || name === 'DUSK';
      dayOne.visible = name === 'DAY1'; dayTwo.visible = two; nightG.visible = name === 'NIGHT';
      paintShade(name === 'OPENED' || name === 'SHUT' ? 'DAWN' : name);
    }
    function openDecision() { decOpen = true; if (getState() === 'play') startDecision(); }

    /* ---------------------------------------------------------------- the decision: Grandmaster Pho, on his bench */
    const _ndc = new THREE.Vector3();
    const INTERACT_R = 3.4;
    const PILE_POS = new THREE.Vector3(BENCH.x, 0, BENCH.z);
    const pile = new THREE.Group(); pile.position.copy(PILE_POS); world.add(pile);
    const pileLive = () => decOpen && phase === 'decide';
    function pileDist() { return Math.hypot(yaw.position.x - PILE_POS.x, yaw.position.z - PILE_POS.z); }
    function pileScreen() { camera.updateMatrixWorld(); return _ndc.set(PILE_POS.x, 1.0, PILE_POS.z).project(camera); }
    function pileInView() { if (!pileLive()) return false; const n = pileScreen(); return n.z < 1 && Math.abs(n.x) < 1.1 && Math.abs(n.y) < 1.1; }
    function pointerHitsPile() { return pileLive() && pileDist() < INTERACT_R; }
    function interactPile() { if (!pileLive()) return false; startDecision(); return true; }

    const hotspots = [];

    /* ---------------------------------------------------------------- the frame */
    function arriveBegin() { setPhase('arrive', { complete: false }); look('DAY1', 0); }
    function applyPhase(p0) {
      const R = readMark(p0);
      arriveBegin();
      return R;
    }
    let windClock = 0;
    function updateNotes(dt, t) {
      const st = getState();
      const now = wallNow(), wdt = lastWall ? Math.min(0.25, now - lastWall) : 0; lastWall = now;
      if (st !== 'cine') { windClock += wdt; windTick(windClock); }
      if (st !== 'play') return;
      if (!booted) { booted = true; applyPhase(kit ? kit.getPhase() : null); }
      dayClock.t += wdt;
      runTodo(); runSpeak(); runQueue();
    }
    function updatePile() {}
    function updateFire() {}
    function updateSlow() {}

    /* ================================================================ THE FILMS' PICTURES (M6: each film's shots are
       written here; the cues are below the build) */
    const films = { key: '', begin() {}, frame() {}, end() {} };

    /* ---------------------------------------------------------------- the stage's life */
    function snap() { return { phase }; }
    function restore() {}
    function reset() {
      films.end();
      dropTodo(); speakReset(); lineQ.length = 0; heard.clear();
      booted = false; dayClock.t = 0; lastWall = 0;
      decOpen = false;
      for (const h of hotspots) { h.done = false; h.dwellT = 0; }
      if (kit) {
        if (kit.abortEvent) kit.abortEvent();
        kit.objective(null, { complete: false });
        kit.root(false); kit.pose('standing', { secs: 0.05 });
        if (kit.pray) kit.pray(false, { secs: 0 });
        kit.presence(0);
        kit.daylight(null, 0);
        kit.setPhase('arrive');
        if (kit.captions) kit.captions(null);
        kit.waypoint(null);
      }
      phase = 'arrive';
      play.run++; play.busy = false;
      look('DAY1', 0);
    }
    function blockers() {
      const out = [];
      const solid = (o, pad = 0.14) => { o.updateWorldMatrix(true, false); const bb = new THREE.Box3().setFromObject(o); bb.expandByScalar(pad); bb.min.y = 0; bb.max.y = Math.max(bb.max.y, 1.40); out.push(bb); };
      for (const s of solids) solid(s);
      return out;
    }
    function dispose() {
      alive = false;
      const geos = new Set(), ms = new Set();
      world.traverse(o => {
        if (o.geometry) geos.add(o.geometry);
        if (o.material) for (const m of (Array.isArray(o.material) ? o.material : [o.material])) ms.add(m);
      });
      for (const p of parsedGlb.values()) p.then(({ scene: sc }) => sc.traverse(o => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) for (const m of (Array.isArray(o.material) ? o.material : [o.material])) {
          for (const k of ['map', 'roughnessMap', 'metalnessMap', 'normalMap', 'emissiveMap', 'alphaMap']) m[k]?.dispose?.();
          m.dispose();
        }
      })).catch(() => {});
      scene.remove(world);
      for (const o of owned) { if (o.parent) o.parent.remove(o); o.dispose?.(); }
      owned.length = 0;
      for (const g of geos) g.dispose();
      for (const m of ms) {
        for (const k of ['map', 'roughnessMap', 'metalnessMap', 'normalMap', 'emissiveMap', 'alphaMap']) m[k]?.dispose?.();
        m.dispose();
      }
      for (const m of mats) m.dispose();
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
      skyAt: () => null,
      /* walktest: where play puts him besides the spawn, and the ground he must STAY on (v25.5): the turf, the gravel
         before the tables and the tents' fronts. He cannot leave it */
      arrivals: [{ what: 'before Grandmaster Pho, day two', x: 4.6, z: 7.6 }],
      keepIn: { what: 'the ground of the Wai Kru', minX: DATA.bounds.minX, maxX: DATA.bounds.maxX, minZ: DATA.bounds.minZ, maxZ: DATA.bounds.maxZ },
      get phase() { return phase; },
      setPhase, applyPhase, after, dayClock, sayLine, queueLine, queueFn, queueGap,
      look, presets: PRESETS, films,
      plan: { TURF, TABLES, HALL, TENT_W1, TENT_W2, TENT_E, CHIEF, BENCH, POLE, TON_TABLE, WEST_TABLE },
      info: () => ({ phase, t: +dayClock.t.toFixed(2), queued: lineQ.length, heard: [...heard], until: +speak.until.toFixed(2),
                     pending: speak.pending ? speak.pending.name : null, decOpen, look: lookName, busy: play.busy,
                     waiting: [...waiting].sort(), mends: twinMends }),
      /* how much the world draws, by counting the thing itself (v25.5): meshes, triangles, and the pictures' memory */
      census: () => {
        let meshes = 0, tris = 0; const texs = new Set();
        world.traverse(o => { if (!o.isMesh && !o.isLine && !o.isLineSegments) return; let v = true; for (let q = o; q; q = q.parent) if (!q.visible) { v = false; break; }
          if (!v) return; meshes++;
          const g = o.geometry, n = g.index ? g.index.count / 3 : (g.attributes.position ? g.attributes.position.count / 3 : 0);
          tris += n * (o.isInstancedMesh ? o.count : 1);
          for (const m of [].concat(o.material)) for (const k of ['map', 'normalMap', 'roughnessMap', 'metalnessMap', 'emissiveMap']) if (m && m[k] && m[k].image) texs.add(m[k].source || m[k]); });
        let mb = 0; for (const s of texs) { const im = s.data || s.image; if (im && im.width) mb += im.width * im.height * 4 * 1.33 / 1048576; }
        return { meshes, tris: Math.round(tris), textures: texs.size, texMB: +mb.toFixed(1) };
      },
      hotspots,
      updateNotes, updatePile, updateFire, updateSlow,
      snap, restore, reset, dispose
    });
  }


  /* ====================================================== THIS CHAPTER'S DRAWN SURFACES
     Flat things with holes in them that are drawn, not modelled (the plan's §6.3: cloth, woven things and wire): the
     white fretwork under the hall's eaves, the lattice of the fence, a louvred window, and one handful of petals. */
  function done(THREE, c, rep) {
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
    if (rep) { t.wrapS = t.wrapT = THREE.RepeatWrapping; }
    return t;
  }
  /* the fretwork: a board of pointed drops with a round hole in each, repeating sideways */
  function makeFretwork(THREE, cnv) {
    const [c, x] = cnv(256); c.height = 128; x.clearRect(0, 0, 256, 128);
    x.fillStyle = '#ffffff';
    for (let i = 0; i < 4; i++) {
      const u = i * 64;
      x.beginPath(); x.moveTo(u, 0); x.lineTo(u + 64, 0); x.lineTo(u + 64, 58); x.quadraticCurveTo(u + 50, 70, u + 32, 124); x.quadraticCurveTo(u + 14, 70, u, 58); x.closePath(); x.fill();
      x.globalCompositeOperation = 'destination-out';
      x.beginPath(); x.arc(u + 32, 50, 11, 0, 6.283); x.fill(); x.beginPath(); x.arc(u + 32, 86, 5, 0, 6.283); x.fill();
      x.globalCompositeOperation = 'source-over';
    }
    return done(THREE, c, true);
  }
  /* the fence's lattice: thin white laths crossed on the diagonal */
  function makeLattice(THREE, cnv) {
    const [c, x] = cnv(256); x.clearRect(0, 0, 256, 256);
    x.strokeStyle = '#ffffff'; x.lineWidth = 13; x.lineCap = 'butt';
    for (let i = -4; i <= 8; i++) { x.beginPath(); x.moveTo(i * 64, 0); x.lineTo(i * 64 + 256, 256); x.stroke(); x.beginPath(); x.moveTo(i * 64, 0); x.lineTo(i * 64 - 256, 256); x.stroke(); }
    return done(THREE, c, true);
  }
  /* a louvred window: a pale frame and grey glass slats, tilted */
  function makeLouvre(THREE, cnv) {
    const [c, x] = cnv(128); x.fillStyle = '#d9dcdc'; x.fillRect(0, 0, 128, 128);
    for (let i = 0; i < 9; i++) { const y = 8 + i * 13; const g = x.createLinearGradient(0, y, 0, y + 11); g.addColorStop(0, '#5e6a70'); g.addColorStop(0.6, '#8fa0a8'); g.addColorStop(1, '#3d464b'); x.fillStyle = g; x.fillRect(8, y, 112, 11); }
    x.fillStyle = '#eef0f0'; x.fillRect(61, 4, 6, 120);
    x.strokeStyle = '#f4f5f5'; x.lineWidth = 6; x.strokeRect(3, 3, 122, 122);
    const t = done(THREE, c, false); return t;
  }
  /* one handful of marigold petals lying together: pale, so each handful is tinted its own yellow or orange */
  function makePetals(THREE, cnv) {
    const [c, x] = cnv(128); x.clearRect(0, 0, 128, 128);
    let s = 90210; const r = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
    for (let i = 0; i < 16; i++) {
      const px = 22 + r() * 84, py = 22 + r() * 84, a = r() * 6.283, l = 13 + r() * 12, w = 4.5 + r() * 4;
      x.save(); x.translate(px, py); x.rotate(a);
      const g = x.createLinearGradient(-l, 0, l, 0); g.addColorStop(0, '#fff7d8'); g.addColorStop(0.5, '#ffffff'); g.addColorStop(1, '#ffe9a8');
      x.fillStyle = g; x.beginPath(); x.moveTo(-l, 0); x.quadraticCurveTo(0, -w * 1.6, l, 0); x.quadraticCurveTo(0, w * 1.6, -l, 0); x.fill();
      x.strokeStyle = 'rgba(190,120,20,0.55)'; x.lineWidth = 1; x.beginPath(); x.moveTo(-l * 0.8, 0); x.lineTo(l * 0.8, 0); x.stroke();
      x.restore();
    }
    return done(THREE, c, false);
  }

  /* ====================================================== THE FILMS' CUES (M6)
     Until each ending is directed, its scene is a held black with nothing in it, so the chapter can be played to its
     card while it is being built (a preview: the tracker's D12). */
  function holdScene(c, s, api) {
    const { tr, fade, rawK } = api;
    tr(0, 2.4, () => {}, rawK);
    fade(0, 0.8, 0, 1); fade(0.8, 2.4, 1, 1);
    c.endFade = 1;
  }

  (window.__CHAPTERS__ = window.__CHAPTERS__ || {}).e4c3 = Object.assign(DATA, {
    build,
    scenes: [holdScene, holdScene, holdScene, holdScene]
  });
})();
