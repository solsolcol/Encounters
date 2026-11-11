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
    spawn:     { x: -4.55, y: 1.62, z: 11.2, rot: 0 },    // (Ton, 2.5 m ahead, stands inside a portrait phone's eighteen degrees: photographed)
    shrine:    { x: 0, z: -11.2 },            // the engine's anchor (ghost: null): the offering tables
    ghostHome: { x: 0, z: -11.2 },
    /* the ground he is kept on: the turf, the gravel before the tables and the tents' fronts (stage.keepIn is the same box) */
    bounds:    { minX: -10.8, maxX: 10.8, minZ: -9.8, maxZ: 12.4 },

    ghost: null,
    fireLight: null,
    daylight: DAY1,

    /* (the list is long and grows with the build: one line a kind) */
    assets: [
      /* the people, the things and the surfaces made for this chapter (masters/v26.0/make.sh) */
      /* >>> this chapter's own keys: written by masters/v26.0/keys.py (edit its table, not this list) >>> */
      'e4ton', 'e4tonm', 'e4tonf', 'e4tonh', 'e4bench', 'e4benchm', 'e4benchf', 'e4benchh', 'e4hermita',
      'e4hermitam', 'e4hermitaf', 'e4hermitb', 'e4hermitbm', 'e4hermitbf', 'e4red', 'e4redm', 'e4redf', 'e4white',
      'e4whitem', 'e4whitef', 'e4dancera', 'e4danceram', 'e4danceraf', 'e4dancerb', 'e4dancerbm', 'e4dancerbf',
      'e4deva', 'e4devam', 'e4devaf', 'e4devb', 'e4devbm', 'e4devbf', 'e4devc', 'e4devcm', 'e4devcf', 'e4devd',
      'e4devdm', 'e4devdf', 'e4deve', 'e4devem', 'e4devef', 'e4devf', 'e4devfm', 'e4devff', 'e4devg', 'e4devgm',
      'e4devgf', 'e4devh', 'e4devhm', 'e4devhf', 'pho', 'phof', 'w3baisri', 'w3naga', 'w3wheel', 'w3parasol',
      'w3tower', 'w3candle', 'w3fan', 'w3nagastaff', 'w3pewter', 'w3purple', 'w3fruit', 'w3sweets', 'w3khantok',
      'w3puff', 'w3chair', 'w3lowtable', 'w3bench', 'w3sofa', 'w3petalbowl', 'w3petalsteel', 'w3smallbaisri',
      'w3candlemid', 'w3candlesmall', 'w3kratip', 'w3chicken', 'w3coconut', 'w3soda', 'w3water', 'w3nagafount',
      'w3nagagreen', 'w3nagawhite', 'w3ganesha', 'w3croton', 'w3dracaena', 'w3waterjar', 'w3walllamp', 'w3t_turf',
      'w3t_petalturf', 'w3t_earth', 'w3t_gravel', 'w3t_redplank', 'w3t_tin', 'w3t_brick', 'w3t_skirt', 'w3t_satin',
      'w3t_mat', 'w3t_carpet', 'w3t_swag', 'w3t_banner', 'w3t_treeline', 'w3t_redroof', 'w3t_hallbrick',
      'w3t_steptile', 'w3t_lawn', 'w3t_kalae', 'w3t_fretwork', 'w3t_sign',
      /* <<< this chapter's own keys <<< */
      /* the trees of this episode's first chapter (reuseInEpisode) */
      'e4raintree', 'e4mango', 'e4raintreehd', 'e4mangohd',
      /* Chad's monk as episode 3 has him (reuse). (Grandmaster Pho, Chad's own model, cast here for the first time, is
         in the keys above.) */
      'monkshop', 'monkrow'
    ],
    /* FRESH (chaptertest) asks a chapter of episode 4 to declare what it takes from episodes 1 to 3 (`reuse`), and what
       it shares with the chapters of its own episode (`reuseInEpisode`): Chad, v17.4, "any reuse is declared" */
    reuse: { monkshop: "Chad's monk, for the three monks who sit under the east tent as monks sit at a real Wai Kru (photograph 2): the one monk he has made, as episode 3 chapter 3's shop wears him",
             monkrow: "the same monk's light cut (episode 3 chapter 2's row), drawn for those three when they are far across the turf" },
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
    /* photographs 13 to 16; its front 9 m behind the tables (8, 10). Measured on 15, the front square on: the skirt rises
       1.5 m and the gable 2.2 m above it, the gable's foot is 6.6 m wide; from 16 the skirt is steep enough to show its
       tiles to a man standing before it, so both tiers are pitched at about thirty degrees */
    const HALL = { x0: -5, x1: 5, z0: -29.7, z1: -21.7, floor: 0.48, wall: 3.1, over: 1.6, overS: 0.9, rise: 1.5, pitch: 30 * Math.PI / 180, gable: 2.2 };
    const SHED = { x0: -16, x1: -10.5, z0: -14, z1: -8, eave: 2.4 };
    const TENT_W1 = { x: -9, z: -1 }, TENT_W2 = { x: -9, z: 5 }, TENT_E = { x: 9, z: -2 };
    const TENT = { w: 4, eave: 2.2, peak: 3.3 };
    /* HIS BENCH (photographs 1, 5, 6, read together): it stands at the canopy's south side and FACES THE OFFERING TABLES
       AND THE HALL (photograph 1 is taken over its back rail: the hall stands ahead, the west tents to the left, the
       lime pole at the front right), a little west of north. Two sit on it: he at its east end, the second master in
       white at his left. People kneel before it, to its north. (My first reading had it facing north-west.) A body and
       a seat face +z at a turn of 0. `benchAt(a, b)`: a point a metres to the sitters' right and b metres before them */
    const BENCH = { x: 5.9, z: 9.2, ry: Math.atan2(-0.3, -1) };
    const benchAt = (a, b) => { const fx = Math.sin(BENCH.ry), fz = Math.cos(BENCH.ry); return [BENCH.x - fz * a + fx * b, BENCH.z + fx * a + fz * b]; };
    /* HIS CANOPY stands square to the bench, and its front right pole (the one wrapped in lime) is 1.65 m to the
       sitters' right and 1.75 m before them: measured on photograph 1, where that pole fills a quarter of the frame's
       height 2.9 m from the lens. So the bench sits under the canopy's back half, against the buildings behind */
    const CHIEF = (() => { const [x, z] = benchAt(1.65 - 2.25, 1.75 - 2.25); return { x, z, w: 4.5, eave: 2.3, peak: 3.1, ry: BENCH.ry }; })();
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
      redplank: [0x8a2c26, 'image/jpeg'], tin: [0xcb8083, 'image/jpeg'],
      brick: [0x96573f, 'image/jpeg'], skirt: [0x1f9c3a, 'image/jpeg'], satin: [0xe9e9e9, 'image/jpeg'], mat: [0xc7b78a, 'image/jpeg'],
      carpet: [0x74202a, 'image/jpeg'], swag: [0xf2f0e4, 'image/webp'], banner: [0xe8e8e8, 'image/webp'], treeline: [0x4c7a3a, 'image/webp'],
      redroof: [0xc8483f, 'image/jpeg'], hallbrick: [0x9a4f3f, 'image/jpeg'], steptile: [0xc98c80, 'image/jpeg'], lawn: [0x5c9a35, 'image/jpeg'],
      kalae: [0x5a4a40, 'image/webp'], fretwork: [0x7a2a26, 'image/webp'], sign: [0xece8dc, 'image/webp']
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
      const { tile = 1, mirror = '', tint = null, gain = null, basic = false, cut = false, clampV = false, clamp = false, ...rest } = o;
      const lift = (c) => { if (gain != null) { const k = Array.isArray(gain) ? gain : [gain, gain, gain]; c.r *= k[0]; c.g *= k[1]; c.b *= k[2]; } return c; };
      const avg = lift(new THREE.Color(SURF[name][0])); if (tint != null) avg.multiply(new THREE.Color(tint));
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
        m.map = t; lift(m.color.set(tint != null ? tint : 0xffffff)); m.needsUpdate = true;
      });
      return m;
    }
    /* a surface's picture with its own holes and ONE flat colour (a fretwork painted pale grey: the cut-out is the
       picture's, the paint is not). The picture is drawn once onto a canvas and filled through its own alpha */
    function surfFlat(name, css, o = {}) {
      const { tile = 1, clampV = false, clamp = false, ...rest } = o;
      const m = M({ color: css, roughness: 0.85, metalness: 0, alphaTest: 0.5, side: THREE.DoubleSide, ...rest });
      surfLoad(name).then(t0 => {
        if (!t0 || !alive || !t0.image) return;
        const im = t0.image, c = document.createElement('canvas'); c.width = im.width; c.height = im.height;
        const x = c.getContext('2d'); x.drawImage(im, 0, 0); x.globalCompositeOperation = 'source-in'; x.fillStyle = '#ffffff'; x.fillRect(0, 0, c.width, c.height);
        const t = tex(new THREE.CanvasTexture(c)); t.colorSpace = THREE.SRGBColorSpace; t.flipY = false;
        const tu = Array.isArray(tile) ? tile[0] : tile, tv = Array.isArray(tile) ? tile[1] : tile;
        t.wrapS = clamp ? THREE.ClampToEdgeWrapping : THREE.RepeatWrapping; t.wrapT = clamp || clampV ? THREE.ClampToEdgeWrapping : THREE.RepeatWrapping;
        t.repeat.set(1 / tu, -1 / tv); t.offset.set(0, 1); m.map = t; m.needsUpdate = true;
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
    /* a flat piece of any number of corners (anticlockwise from its front), its UVs true metres: u along its first edge,
       v up the piece. A hip roof's trapezoid drawn as a quad() would squeeze its tiles toward the hip. */
    function planar(mat, pts, u0 = 0, v0 = 0) {
      const Bt = batchOf(mat), a = pts[0], b = pts[1], c = pts[2];
      const ux = b[0] - a[0], uy = b[1] - a[1], uz = b[2] - a[2], ul = Math.hypot(ux, uy, uz) || 1, ex = ux / ul, ey = uy / ul, ez = uz / ul;
      let nx = uy * (c[2] - a[2]) - uz * (c[1] - a[1]), ny = uz * (c[0] - a[0]) - ux * (c[2] - a[2]), nz = ux * (c[1] - a[1]) - uy * (c[0] - a[0]);
      const nl = Math.hypot(nx, ny, nz) || 1; nx /= nl; ny /= nl; nz /= nl;
      const vx = ny * ez - nz * ey, vy = nz * ex - nx * ez, vz = nx * ey - ny * ex;
      for (let i = 1; i < pts.length - 1; i++) for (const q of [pts[0], pts[i], pts[i + 1]]) {
        const dx = q[0] - a[0], dy = q[1] - a[1], dz = q[2] - a[2];
        Bt.p.push(q[0], q[1], q[2]); Bt.n.push(nx, ny, nz); Bt.u.push(u0 + dx * ex + dy * ey + dz * ez, v0 + dx * vx + dy * vy + dz * vz);
      }
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
        /* a file of TWO LEVELS (props/lods.sh: nodes <key>_near and <key>_far over the same vertices): the far one is
           drawn until the piece stands taller than a twenty-fifth of the screen (lodTick, the measure many() uses) */
        const near = [], far = []; m.traverse(q => { if (q.isMesh) { if (/_far$/.test(q.name)) far.push(q); else if (/_near$/.test(q.name)) near.push(q); } });
        if (near.length && far.length) { g.updateWorldMatrix(true, true); const bb = new THREE.Box3().setFromObject(m), c = bb.getCenter(new THREE.Vector3());
          for (const q of near) q.visible = false;
          standLods.push({ near, far, c, r: 0, size: Math.max(0.05, bb.max.y - bb.min.y), on: false }); }
      }).catch(err => { console.warn(key + ' failed to load', err); if (ctx.loadFail) ctx.loadFail(key, err); });
      return g;
    }
    /* every two-level thing's level, from the lens: called every frame of play, and by a film on its own clock (a cut
       chooses from the cut's own lens: v24.22). stockLod is many()'s (the copied one); this is stand()'s, the same rule */
    const standLods = [], _sl2 = new THREE.Vector3();
    function lodTick() {
      stockLod();
      if (!standLods.length) return;
      camera.getWorldPosition(_sl2);
      const span = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2);
      for (const L of standLods) { const d = Math.max(0.05, _sl2.distanceTo(L.c)), on = L.size / (d * span) > STOCK_NEAR;
        if (on === L.on) continue; L.on = on;
        for (const q of L.near) q.visible = on; for (const q of L.far) q.visible = !on; }
    }
    /* A HUE TURNED in a material (one soda bottle in red, orange and green; one small candle in pink and blue): the
       picture's own colour is turned about the grey axis before the light falls on it, so whites, blacks and greys
       stay as they are. A program of its own for each angle (compiled under the curtain with the rest: v14.15) */
    function hueTurn(mat, deg) {
      const a = deg * Math.PI / 180, uHue = { value: new THREE.Vector2(Math.cos(a), Math.sin(a)) };
      mat.onBeforeCompile = (sh) => { sh.uniforms.uHue = uHue;
        sh.fragmentShader = 'uniform vec2 uHue;\n' + sh.fragmentShader.replace('#include <map_fragment>', '#include <map_fragment>\n{ vec3 hk = vec3(0.57735); vec3 hv = diffuseColor.rgb; diffuseColor.rgb = hv * uHue.x + cross(hk, hv) * uHue.y + hk * dot(hk, hv) * (1.0 - uHue.x); }'); };
      mat.customProgramCacheKey = () => 'hueTurn';
      mat.needsUpdate = true;
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
      /* north of the gravel the ground is LAWN, up to the hall and round it (photographs 14 to 16), worn to a track of
         gravel up its middle from the tables to the fountain */
      floor(mLawn, -24, -40, 24, GRAVEL.z0, -0.008);
      floor(mGravel, -0.9, HALL.z1 + 3.9, 0.9, TABLES.z0 - 0.25, -0.005);
      /* the turf is rolls laid side by side, north to south: where two meet, a thin teal line (photograph 10) */
      const mSeam = M({ color: 0x1f8f7c, roughness: 0.9 });
      for (let x = TURF.x0 + TURF.strip; x < TURF.x1 - 0.01; x += TURF.strip) floor(mSeam, x - 0.012, TURF.z0, x + 0.012, TURF.z1, 0.003);
      /* its cut edge: a hand's width of darker pile all round, so it reads as a thing laid on the earth */
      const mEdge = M({ color: 0x2c6f1c, roughness: 1 });
      wall(mEdge, TURF.x0, TURF.z1, TURF.x1, TURF.z1, -0.012, 0.004); wall(mEdge, TURF.x1, TURF.z0, TURF.x0, TURF.z0, -0.012, 0.004);
      wall(mEdge, TURF.x1, TURF.z1, TURF.x1, TURF.z0, -0.012, 0.004); wall(mEdge, TURF.x0, TURF.z0, TURF.x0, TURF.z1, -0.012, 0.004);
    }

    /* ================================================================ THE HALL (photographs 13 to 16; and 8, 10 behind the tables)
       Chad, 11 Nov 2026: "More images of the building behind, at the wai kru". One storey, ten metres across its front:
       three steps of terracotta tile, walls of long red-brown brick, a dark red post at each corner and one in the
       middle of the front, two wide double doors of dark glass. Over it a roof in two tiers of bright red pressed tile:
       a hipped skirt all round with a wide overhang, and a steep gable to the south over the middle, its triangle in
       dark red boards. A fretwork board of pointed scallops hangs under every eave and up both rakes, and two carved
       boards cross at the peak (a kalae). In front: a white plank sign between two rough posts, the seven-headed naga
       fountain on its teal plinth, a naga on a plinth at each corner, bushes and jars. The tracker's §10 has the table.
       He cannot walk to it (it stands north of the ground he is kept on): it is for his eyes and for a film's lens. */
    const mRoofRed = surf('redroof', { tile: [2.4, 2.3], roughness: 0.62 });
    const mHallBrick = surf('hallbrick', { tile: [1.47, 1.4], tint: 0xc4a6a6, roughness: 0.9 });   // (photograph 15: a darker, browner red than the sunlit corner of 13)
    const mStep = surf('steptile', { tile: 1.2, roughness: 0.78 });
    const mRiser = surf('steptile', { tile: 1.2, tint: 0xd8c9c6, roughness: 0.85 });
    const mLawn = surf('lawn', { tile: 2.5, gain: [1.55, 1.3, 1.45], roughness: 1 });           // (dry and straw-pale in every photograph: lifted to them)
    const mFret = surf('fretwork', { tile: [1.68, 0.26], cut: true, clampV: true, roughness: 0.8 });
    const mSign = surf('sign', { tile: [2.4, 0.43], cut: true, clamp: true, roughness: 0.7 });
    const mFretGrey = surfFlat('fretwork', '#c4cad2', { tile: [1.68, 0.26], clampV: true });        // the gable's lace is painted pale grey (photograph 15)
    const mKalaeGrey = surfFlat('kalae', '#8e959c', { tile: [0.95, 0.97], clamp: true });           // and the kalae weathered grey
    const mBrick = surf('brick', { tile: 1.6, mirror: 'uv', roughness: 0.95 });
    const mRedPlank = surf('redplank', { tile: 2.0, mirror: 'uv', roughness: 0.85 });
    const mGable = surf('redplank', { tile: 2.0, mirror: 'uv', tint: 0xa9d0e8, roughness: 0.85 });   // (dark purple-brown boards, photograph 15)
    const mTin = surf('tin', { tile: 1.8, roughness: 0.7, side: THREE.DoubleSide });
    const mBarge = M({ color: 0xb23229, roughness: 0.6 });
    const mDark = M({ color: 0x15100c, roughness: 1 });
    const mWhite = M({ color: 0xf2efe6, roughness: 0.8 });
    const mConcrete = M({ color: 0xa9a49a, roughness: 0.95 });
    const mPostRed = M({ color: 0x4d231f, roughness: 0.7 });
    const mTeal = M({ color: 0x3a9a8e, roughness: 0.85 });
    /* the shade the deep eave lays on a wall: dark under the roof, gone a man's height below it (painted: v9.4) */
    const mEaveShade = (() => { const [c, x] = cnv(64); const g = x.createLinearGradient(0, 0, 0, 64);
      x.clearRect(0, 0, 64, 64); g.addColorStop(0, 'rgba(10,6,6,0.78)'); g.addColorStop(0.45, 'rgba(10,6,6,0.5)'); g.addColorStop(1, 'rgba(10,6,6,0)');
      x.fillStyle = g; x.fillRect(0, 0, 64, 64);
      const t = tex(done(THREE, c, false)); t.wrapS = THREE.RepeatWrapping; t.wrapT = THREE.ClampToEdgeWrapping;
      return B({ map: t, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1 }); })();
    /* the doors' glass: dark, and holding a dim picture of what stands before it (the sky over the trees over the lawn),
       painted, because nothing here is mirrored for real. Its quad's UVs are metres, so the sheet is fitted to a door */
    const mGlass = (() => { const [c, x] = cnv(64); const g = x.createLinearGradient(0, 0, 0, 64);
      g.addColorStop(0, '#31475e'); g.addColorStop(0.3, '#22313a'); g.addColorStop(0.42, '#15221a'); g.addColorStop(0.72, '#0e1611'); g.addColorStop(1, '#070909');
      x.fillStyle = g; x.fillRect(0, 0, 64, 64);
      const t = tex(done(THREE, c, false)); t.wrapS = THREE.RepeatWrapping; t.wrapT = THREE.ClampToEdgeWrapping; t.repeat.set(1, 1 / 2.25); t.offset.set(0, -HALL.floor / 2.25);
      return B({ map: t }); })();
    const mBronze = M({ color: 0x3b2f2a, roughness: 0.5, metalness: 0.4 });
    const mSteel = M({ color: 0xb9bcc0, roughness: 0.35, metalness: 0.8 });
    const mSoffit = M({ color: 0x8b8f92, roughness: 0.8 });
    const mSignPost = M({ color: 0x4f3038, roughness: 1 });
    const hall = { lamps: [] };
    function buildHall() {
      const H = HALL, fl = H.floor, eave = fl + H.wall, cx = (H.x0 + H.x1) / 2, zf = H.z1, ov = H.over;
      /* THE STEPS: three across the whole front and a little past each corner, a white strip on each one's edge */
      const sx0 = H.x0 - 0.6, sx1 = H.x1 + 0.6, zb = zf - 0.1;
      const stepFront = (k) => zf + 0.9 + (2 - k) * 0.3;                        // k 0 the lowest: its front edge is the furthest south
      for (let k = 0; k < 3; k++) { const top = (k + 1) * fl / 3, front = stepFront(k);
        box(mRiser, cx, top / 2, (zb + front) / 2, sx1 - sx0, top, front - zb, 0, mStep);
        floor(mWhite, sx0, front - 0.05, sx1, front, top + 0.003); }
      hall.stepsFront = stepFront(0);
      /* THE WALLS, the grey band at their foot, the thin white line of a conduit near their top */
      /* (each wall runs up to just under the skirt where the skirt crosses it, so no slot of sky shows under the eave) */
      const yo = eave - 0.22, yi = yo + H.rise, run = H.rise / Math.tan(H.pitch);
      const topF = yo + H.rise * ov / run - 0.05, topS = yo + H.rise * H.overS / run - 0.05;
      for (const [xa, za, xb, zw, top] of [[H.x0, zf, H.x1, zf, topF], [H.x1, zf, H.x1, H.z0, topS], [H.x1, H.z0, H.x0, H.z0, topF], [H.x0, H.z0, H.x0, zf, topS]]) wall(mHallBrick, xa, za, xb, zw, fl, top);
      /* (the eave's shade, laid 8 mm off each wall, behind the grey band and the doors' glass: from the wall's top down 2.1 m) */
      for (const [xa, za, xb, zw, top] of [[H.x0, zf, H.x1, zf, topF], [H.x1, zf, H.x1, H.z0, topS], [H.x1, H.z0, H.x0, H.z0, topF], [H.x0, H.z0, H.x0, zf, topS]]) {
        const dx = xb - xa, dz = zw - za, L = Math.hypot(dx, dz), ox = -dz / L * 0.008, oz = dx / L * 0.008, y1 = top, y0 = top - 2.1;
        const m = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), mEaveShade);
        m.position.set((xa + xb) / 2 + ox, (y0 + y1) / 2, (za + zw) / 2 + oz); m.scale.set(L, y1 - y0, 1); m.rotation.y = Math.atan2(ox, oz); m.renderOrder = 1; world.add(m); owned.push(m); }
      wall(mConcrete, H.x0, zf + 0.012, H.x1, zf + 0.012, fl, fl + 0.16);
      bar(mWhite, [H.x0, fl + 2.72, zf + 0.02], [H.x1, fl + 2.72, zf + 0.02], 0.012, 4);
      /* THE POSTS: dark red, at the four corners and the middle of the front */
      for (const [px, pz] of [[H.x0 - 0.02, zf + 0.07], [cx, zf + 0.07], [H.x1 + 0.02, zf + 0.07], [H.x0 - 0.02, H.z0 - 0.07], [H.x1 + 0.02, H.z0 - 0.07]]) post(mPostRed, px, pz, 0.11, fl, eave + 0.15, 10);
      /* THE TWO DOORS: dark glass in bronze frames, a leaf either side of the meeting stiles, long bar handles */
      for (const sx of [-1, 1]) { const dx = cx + sx * 2.7, w = 2.3, h = 2.25, z = zf + 0.02;
        wall(mGlass, dx - w / 2, z, dx + w / 2, z, fl + 0.02, fl + h);
        box(mBronze, dx, fl + h + 0.035, z + 0.02, w + 0.14, 0.07, 0.07);
        box(mBronze, dx, fl + 0.05, z + 0.02, w, 0.08, 0.06);
        for (const jx of [-w / 2 - 0.035, w / 2 + 0.035]) box(mBronze, dx + jx, fl + h / 2, z + 0.02, 0.07, h, 0.07);
        for (const jx of [-0.03, 0.03]) box(mBronze, dx + jx, fl + h / 2, z + 0.025, 0.05, h, 0.05);
        for (const jx of [-0.13, 0.13]) bar(mSteel, [dx + jx, fl + 0.85, z + 0.075], [dx + jx, fl + 1.35, z + 0.075], 0.014, 6); }
      /* THE LOWER ROOF: a skirt all round, from its edge out over the steps up to the foot of the upper roof. Each side
         is a flat trapezoid with true UVs (planar), the eave its picture's u, so the rows of tiles lie along it */
      const o = { x0: H.x0 - H.overS, x1: H.x1 + H.overS, z0: H.z0 - ov, z1: zf + ov }, g = { x0: o.x0 + run, x1: o.x1 - run, z0: o.z0 + run, z1: o.z1 - run };
      const sides = [
        [[o.x0, yo, o.z1], [o.x1, yo, o.z1], [g.x1, yi, g.z1], [g.x0, yi, g.z1]],      // south, the side the turf sees
        [[o.x1, yo, o.z1], [o.x1, yo, o.z0], [g.x1, yi, g.z0], [g.x1, yi, g.z1]],      // east
        [[o.x1, yo, o.z0], [o.x0, yo, o.z0], [g.x0, yi, g.z0], [g.x1, yi, g.z0]],      // north
        [[o.x0, yo, o.z0], [o.x0, yo, o.z1], [g.x0, yi, g.z1], [g.x0, yi, g.z0]]];     // west
      for (const q of sides) { planar(mRoofRed, q);
        /* its underside: grey sheet, a hand under the tiles and facing down (the corners turned the other way round) */
        planar(mSoffit, [q[1], q[0], q[3], q[2]].map(v => [v[0], v[1] - 0.05, v[2]])); }
      /* the purlins under the overhang (dark red), three on the south and on each side */
      for (const k of [0.12, 0.3, 0.46]) { const y = lp(yo, yi, k) - 0.09;
        bar(mPostRed, [lp(o.x0, g.x0, k), y, lp(o.z1, g.z1, k)], [lp(o.x1, g.x1, k), y, lp(o.z1, g.z1, k)], 0.035, 4);
        bar(mPostRed, [lp(o.x0, g.x0, k), y, lp(o.z0, g.z0, k)], [lp(o.x0, g.x0, k), y, lp(o.z1, g.z1, k)], 0.035, 4);
        bar(mPostRed, [lp(o.x1, g.x1, k), y, lp(o.z0, g.z0, k)], [lp(o.x1, g.x1, k), y, lp(o.z1, g.z1, k)], 0.035, 4); }
      /* its edge board, and THE FRETWORK hanging under it on all four sides (pointed scallops, dark red) */
      const fh = 0.26;
      for (const [xa, za, xb, zw] of [[o.x0, o.z1, o.x1, o.z1], [o.x1, o.z1, o.x1, o.z0], [o.x1, o.z0, o.x0, o.z0], [o.x0, o.z0, o.x0, o.z1]]) {
        wall(mBarge, xa, za, xb, zw, yo - 0.07, yo + 0.03);
        const dx = xb - xa, dz = zw - za, L = Math.hypot(dx, dz), ox = -dz / L * 0.012, oz = dx / L * 0.012;   // a finger outside the board
        quad(mFret, [xa + ox, yo - 0.05 - fh, za + oz], [xb + ox, yo - 0.05 - fh, zw + oz], [xb + ox, yo - 0.05, zw + oz], [xa + ox, yo - 0.05, za + oz]); }
      /* THE UPPER ROOF: a steep gable over the middle, its ridge running north to south, its end to the turf. It stands
         a short upstand above the skirt so its eaves clear the skirt's tiles */
      const g0 = yi + 0.25, ridge = g0 + H.gable, pitch = Math.atan2(H.gable, g.x1 - cx), eo = 0.3, ye = g0 - eo * Math.tan(pitch);
      const ex0 = g.x0 - eo, ex1 = g.x1 + eo, zr0 = g.z0 - 0.45, zr1 = g.z1 + 0.45;
      planar(mRoofRed, [[ex0, ye, zr0], [ex0, ye, zr1], [cx, ridge, zr1], [cx, ridge, zr0]]);          // the west slope
      planar(mRoofRed, [[ex1, ye, zr1], [ex1, ye, zr0], [cx, ridge, zr0], [cx, ridge, zr1]]);          // the east slope
      planar(mSoffit, [[ex0, ye - 0.04, zr1], [ex0, ye - 0.04, zr0], [cx, ridge - 0.04, zr0], [cx, ridge - 0.04, zr1]]);
      planar(mSoffit, [[ex1, ye - 0.04, zr0], [ex1, ye - 0.04, zr1], [cx, ridge - 0.04, zr1], [cx, ridge - 0.04, zr0]]);
      bar(mBarge, [cx, ridge + 0.02, zr0], [cx, ridge + 0.02, zr1], 0.06, 5);                           // the ridge cap
      /* the band between the two roofs and the gable's triangle, in dark red boards */
      for (const [xa, za, xb, zw] of [[g.x0, g.z1, g.x1, g.z1], [g.x1, g.z1, g.x1, g.z0], [g.x1, g.z0, g.x0, g.z0], [g.x0, g.z0, g.x0, g.z1]]) wall(mGable, xa, za, xb, zw, yi - 0.08, g0 + 0.02);
      tri(mGable, [g.x0, g0, g.z1], [g.x1, g0, g.z1], [cx, ridge - 0.08, g.z1]);
      tri(mGable, [g.x1, g0, g.z0], [g.x0, g0, g.z0], [cx, ridge - 0.08, g.z0]);
      /* the fretwork across the gable's foot and up both rakes (each strip's top edge on the roof's edge, its scallops
         hanging in the gable's plane), a red board along each rake's edge, and THE KALAE crossed at the peak */
      const zk = zr1 + 0.006;
      quad(mFret, [g.x0, g0 - fh, g.z1 + 0.03], [g.x1, g0 - fh, g.z1 + 0.03], [g.x1, g0, g.z1 + 0.03], [g.x0, g0, g.z1 + 0.03]);            // (dark red across the foot: photograph 15 has no pale lace there, only up the rakes)
      { const c = Math.cos(pitch), sn = Math.sin(pitch);
        const T0 = [ex0, ye, zk], T1 = [cx, ridge, zk], T2 = [ex1, ye, zk];
        quad(mFretGrey, [T0[0] + fh * sn, T0[1] - fh * c, zk], [T1[0] + fh * sn, T1[1] - fh * c, zk], T1, T0);         // the west rake (up to the peak)
        quad(mFretGrey, [T1[0] - fh * sn, T1[1] - fh * c, zk], [T2[0] - fh * sn, T2[1] - fh * c, zk], T2, T1);         // the east rake (down from it)
        bar(mBarge, [T0[0], T0[1] + 0.03, zk], [T1[0], T1[1] + 0.03, zk], 0.045, 4); bar(mBarge, [T2[0], T2[1] + 0.03, zk], [T1[0], T1[1] + 0.03, zk], 0.045, 4); }
      quad(mKalaeGrey, [cx - 0.475, ridge - 0.14, zk + 0.02], [cx + 0.475, ridge - 0.14, zk + 0.02], [cx + 0.475, ridge + 0.83, zk + 0.02], [cx - 0.475, ridge + 0.83, zk + 0.02]);
      /* THE SIGN: a white wavy plank between two rough posts in front of the steps (its words are a picture: z_tail's
         art; NOT the real place's name, v9.3) */
      /* (measured on photograph 15 against the doors: the plank 2.4 m by 0.43 m, its foot two metres up, on two posts
         that stand at the fountain's two sides; the fountain's plinth in two low tiers hard against the steps) */
      const zs = hall.stepsFront + 0.78;
      for (const sx of [-1, 1]) post(mSignPost, cx + sx * 1.1, zs, 0.085, 0, 2.02, 9, 0.075);
      quad(mSign, [cx - 1.2, 1.98, zs + 0.09], [cx + 1.2, 1.98, zs + 0.09], [cx + 1.2, 2.41, zs + 0.09], [cx - 1.2, 2.41, zs + 0.09]);
      /* THE PLINTHS, painted teal: the fountain's between the sign's posts, one at each corner for its naga */
      hall.fountain = { x: cx, z: zs, top: 0.4 };
      box(mTeal, hall.fountain.x, 0.1, hall.fountain.z, 2.05, 0.2, 1.4); box(mTeal, hall.fountain.x, 0.3, hall.fountain.z - 0.06, 1.8, 0.2, 1.12);
      hall.west = { x: H.x0 - 1.7, z: zf + 1.35, top: 0.5 };  box(mTeal, hall.west.x, 0.25, hall.west.z, 2.4, 0.5, 0.95);
      hall.east = { x: H.x1 + 0.3, z: zf + 1.0, top: 0.55 }; box(mTeal, hall.east.x, 0.275, hall.east.z, 1.8, 0.55, 0.95);
      hall.lampAt = [[H.x0 - 0.02, fl + 1.95, zf + 0.2], [H.x1 + 0.02, fl + 1.95, zf + 0.2]];
      /* A LAMP ON A POLE, front left (photograph 16): a round solar street lamp on a grey pole */
      post(mConcrete, -7.4, zf + 2.4, 0.045, 0, 4.2, 8);
      geo(mSteel, new THREE.CylinderGeometry(0.34, 0.3, 0.07, 14), _gm.makeTranslation(-7.4, 4.24, zf + 2.4));
      geo(mDark, new THREE.CylinderGeometry(0.3, 0.3, 0.012, 14), _gm.makeTranslation(-7.4, 4.285, zf + 2.4));
    }
    /* what stands at the hall, each a model made from his photographs (masters/v26.0/hall): placed after the batch is
       flushed, each on the spot buildHall measured out */
    function dressHall() {
      const F = hall.fountain, W = hall.west, E = hall.east;
      stand('w3nagafount', F.x, F.top, F.z, 0);                                   // the seven heads, facing the turf
      stand('w3ganesha', F.x + 0.72, F.top, F.z + 0.3, -0.5);                     // the small golden Ganesha at its east end
      stand('w3ganesha', F.x - 0.72, F.top, F.z + 0.3, 0.5, { done: (m) => { m.scale.x *= -1; } });    // and its fellow at the west, turned to face it
      stand('w3nagagreen', W.x, W.top, W.z, 0);                                   // west: the green naga, its heads to the west
      stand('w3nagawhite', E.x, E.top, E.z, 0, { s: 1.22 });                      // east: the white-bellied naga, upright (1.85 m on its plinth, photograph 15)
      /* (photograph 15: one yellow bush west of the fountain before the steps, one beyond the white naga; the dracaena
         in its brown jar at the east post's foot, as tall as the sign; a bowl of floating plants before the plinth) */
      stand('w3croton', F.x - 2.55, 0, F.z + 0.35, 0.6);
      stand('w3croton', E.x + 2.3, 0, E.z + 0.6, 2.2, { s: 0.92 });
      stand('w3dracaena', F.x + 1.55, 0, F.z + 0.45, 0.3, { s: 1.28 });
      stand('w3waterjar', F.x + 0.1, 0, F.z + 1.0, 0, { s: 0.8 });
      for (const [x, y, z] of hall.lampAt) hall.lamps.push(stand('w3walllamp', x, y, z, 0));
    }

    /* ================================================================ WHAT STANDS ROUND THE TURF
       The open shed (west), the white lattice fence, the red wooden house (east), the red plank wall and the pale grey
       building behind the chief canopy (south-east). Photographs 10, 12, 11, 5 and 6. */
    function buildSurround() {
      /* the open shed (photograph 10, read again beside 13 to 16): posts and a pink corrugated roof of TWO pitches, its
         ridge running north to south and its open gable end to the turf; tables of bai sri stand under it */
      const S0 = SHED, lo = S0.eave, hi = S0.eave + 1.25, sxc = (S0.x0 + S0.x1) / 2;
      const mPost = M({ color: 0x8a8376, roughness: 0.9 });
      for (const x of [S0.x0 + 0.2, S0.x1 - 0.2]) for (const z of [S0.z0 + 0.2, (S0.z0 + S0.z1) / 2, S0.z1 - 0.2]) box(mPost, x, lo / 2, z, 0.1, lo, 0.1);
      for (const z of [S0.z0 + 0.2, S0.z1 - 0.2]) box(mPost, sxc, hi / 2, z, 0.1, hi, 0.1);
      /* (a tin roof's eave is its picture's u, so the corrugations run down the slope) */
      planar(mTin, [[S0.x0 - 0.5, lo - 0.18, S0.z0 - 0.5], [S0.x0 - 0.5, lo - 0.18, S0.z1 + 0.6], [sxc, hi + 0.06, S0.z1 + 0.6], [sxc, hi + 0.06, S0.z0 - 0.5]]);
      planar(mTin, [[S0.x1 + 0.5, lo - 0.18, S0.z1 + 0.6], [S0.x1 + 0.5, lo - 0.18, S0.z0 - 0.5], [sxc, hi + 0.06, S0.z0 - 0.5], [sxc, hi + 0.06, S0.z1 + 0.6]]);
      const mRafter = M({ color: 0x5a4636, roughness: 0.9 });
      for (const z of [S0.z0 + 0.2, (S0.z0 + S0.z1) / 2, S0.z1 - 0.2]) { bar(mRafter, [S0.x0 + 0.2, lo, z], [sxc, hi, z], 0.04, 4); bar(mRafter, [S0.x1 - 0.2, lo, z], [sxc, hi, z], 0.04, 4); bar(mRafter, [S0.x0 + 0.2, lo, z], [S0.x1 - 0.2, lo, z], 0.035, 4); }
      bar(mRafter, [sxc, hi, S0.z0 + 0.2], [sxc, hi, S0.z1 - 0.2], 0.04, 4);
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
    const tentCorners = (cx, cz, w, ry = 0) => { const hw = w / 2, c = Math.cos(ry), s = Math.sin(ry);
      return [[-hw, hw], [hw, hw], [hw, -hw], [-hw, -hw]].map(([lx, lz]) => [cx + lx * c + lz * s, cz - lx * s + lz * c]); };
    function tent(cx, cz, o = {}) {
      const w = o.w || TENT.w, e = o.eave || TENT.eave, pk = o.peak || TENT.peak, hw = w / 2;
      const roof = o.roof || satinRoof(0x18a044), frame = o.frame || mFrameGreen;
      /* its four poles: SW, SE, NE, NW when it stands square to the ground; turned by o.ry about its middle, the same
         four in its own frame (a tent turned to face north has its first pole at its front right) */
      const C = tentCorners(cx, cz, w, o.ry || 0), L = hw * Math.SQRT2, out = ([x, z]) => [x + (x - cx) / L * 0.085, z + (z - cz) / L * 0.085];
      for (const [x, z] of C) post(frame, x, z, 0.022, 0, e, 6);
      for (let k = 0; k < 4; k++) { const [xa, za] = C[k], [xb, zb] = C[(k + 1) % 4], oa = out(C[k]), ob = out(C[(k + 1) % 4]);
        bar(frame, [xa, e, za], [xb, e, zb], 0.018, 4);
        quad(roof, [oa[0], e + 0.02, oa[1]], [ob[0], e + 0.02, ob[1]], [cx, pk, cz], [cx, pk, cz]);
        /* the valance: a band of cloth hanging from the eave, and swags over it */
        const vm = satin(o.valance != null ? o.valance : 0xf4f4f0);
        wall(vm, xa, za, xb, zb, e - (o.band || 0.28), e + 0.01);
        const n = o.swags || 3, cols = o.swagCols || [0x18a044, 0xf4f4f0], sd = o.swagDepth || 0.42, dr = o.swagDrop || 0.2;
        for (let s = 0; s < n; s++) { const k0 = s / n, k1 = (s + 1) / n;
          swag(satin(cols[(s + k * (o.swagStep || 0)) % cols.length]), [lp(xa, xb, k0), e + 0.005, lp(za, zb, k0)], [lp(xa, xb, k1), e + 0.005, lp(za, zb, k1)], sd, dr, 0.07); }
      }
      return C;
    }
    const satinRoofs = new Map();
    /* (`glow`: a dark sheet seen from below still passes a little of the day: without it the chief canopy's top was a
       black hole over him) */
    const satinRoof = (hex, glow = 0) => { const k = hex + ':' + glow; let m = satinRoofs.get(k); if (!m) satinRoofs.set(k, m = M({ color: hex, roughness: 0.62, side: THREE.DoubleSide, emissive: glow })); return m; };

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
      /* THE SMALLER OFFERINGS (photographs 9, 10, 3): small candles in pink and blue along the front edge; candles in
         clay pots between the bai sri; soda in rows of red, green and orange, and water; baskets of sticky rice; a
         boiled chicken on its plate; green coconuts; small bai sri at the front corners. One model each: a colour is a
         turn of its hue, and where each stands is a seeded scatter of a hand's width, so no row is ruled */
      const rnd = rng(9126), j = (k = 0.03) => (rnd() - 0.5) * 2 * k, turn = () => rnd() * 6.283;
      const hued = (deg) => (made) => { for (const im of made) hueTurn(im.material, deg); };
      const smalls = []; for (let x = -2.31; x <= 2.32; x += 0.33) smalls.push({ x: x + j(0.02), y: y0, z: -10.09 + j(0.012), ry: turn() });
      many('w3candlesmall', smalls.filter((_, i) => i % 2 === 0), world, 0.24);                    // pink, as made
      many('w3candlesmall', smalls.filter((_, i) => i % 2 === 1), world, 0.24, hued(-118));        // and blue
      many('w3candlemid', [-1.62, -0.82, 0.86, 1.64].map(x => ({ x: x + j(), y: y1, z: zm - 0.3 + j(), ry: turn() }))
        .concat([{ x: -0.5, y: y2, z: zb - 0.22, ry: 0 }, { x: 0.55, y: y2, z: zb - 0.2, ry: 1 }]), world, 0.66);
      const rows = (x0, zs, xs) => { const L = []; for (const z of zs) for (const dx of xs) L.push({ x: x0 + dx + j(0.006), y: y0, z: z + j(0.006), ry: turn() }); return L; };
      const sodaZ = [-10.33, -10.42, -10.51];
      many('w3soda', rows(0.02, sodaZ, [-0.09]), world, 0.22);                                    // red
      many('w3soda', rows(0.02, sodaZ, [0]), world, 0.22, hued(112));                             // green
      many('w3soda', rows(0.02, sodaZ, [0.09]), world, 0.22, hued(26));                           // orange
      many('w3water', rows(0.98, [-10.34, -10.43], [-0.045, 0.045]), world, 0.21);
      many('w3kratip', [{ x: -0.98, y: y0, z: -10.36, ry: 0.4 }, { x: -0.84, y: y0, z: -10.45, ry: 2.0 }, { x: -1.02, y: y0, z: -10.52, ry: 4.1 }], world, 0.14);
      many('w3chicken', [{ x: 1.62, y: y0, z: -10.42, ry: 0.5 }], world, 0.3);
      many('w3coconut', [{ x: -1.68, y: y0, z: -10.36, ry: 0.3 }, { x: -1.5, y: y0, z: -10.5, ry: 2.6 }, { x: 0.36, y: y1, z: zm + 0.3, ry: 1.2 }], world, 0.19);
      many('w3smallbaisri', [{ x: -2.3, y: y0, z: -10.46, ry: 0.6 }, { x: 2.3, y: y0, z: -10.46, ry: 2.4 }], world, 0.38);
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
      /* west tent 1: the hermit in brown and the master in red on pale green sofas, facing east (a third sofa stands
         empty: the second master in white sits with Grandmaster Pho, photographs 1 and 5); straw mats and a striped
         mat before them */
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
      many('w3chair', [-3.2, -2.0, -0.8].map(z => ({ x: 10.2, y: 0, z, ry: -Math.PI / 2, s: 1.11 })), world, 1.28);   // (a tall carved armchair, drawn at 1.28 m: its seat 0.43 m up)
      solidBox(0.9, 1.4, 3.6, 10.25, 0.7, -2.0);
      many('w3khantok', [{ x: 9.2, y: 0, z: -2.6, ry: 0.4 }, { x: 9.2, y: 0, z: -1.2, ry: 1.9 }], world, 0.25);
      stand('w3nagastaff', 10.55, 0, -3.75, 0.3); stand('w3fan', 10.5, 0.02, -0.15, -1.2);
      /* THE CHIEF CANOPY (photographs 1, 5, 6): a dark top, a valance of gold and lime in swags, one pole wrapped in
         puffs of lime cloth; maroon carpets deep in petals; his bench, a carved chair, a low dark table */
      /* (its drapes are deep: photographs 5 and 6 are taken under them, and what fills their top is swags of lime, gold
         and orange satin, not the dark cloth over them) */
      const C = tent(CHIEF.x, CHIEF.z, { w: CHIEF.w, eave: CHIEF.eave, peak: CHIEF.peak, ry: CHIEF.ry, roof: satinRoof(0x2c4632, 0x1d2c22), valance: 0xd8a41c, band: 0.4,
        swags: 3, swagCols: [0xb6d62e, 0xe2a61a, 0xf08a1c], swagDepth: 0.8, swagDrop: 0.36, swagStep: 1 });
      for (const [x, z] of C) solidBox(0.16, 2.2, 0.16, x, 1.1, z);
      /* THE LIME POLE (photographs 1, 5, 6): the canopy's front right pole, the one before the bench's right hand, wrapped
         from the ground to the eave in seven gathered tiers of lime cloth, each wider than it is tall and a little
         narrower than the one under it. The model is one puff of white satin (0.75 m tall, 0.52 across): each is drawn
         wider and pressed down to 0.46 m about its own foot, and tinted */
      { const [px, pz] = C[0], tiers = [0, 1, 2, 3, 4, 5, 6].map(k => ({ x: px, y: 0.01 + k * 0.31, z: pz, ry: k * 1.9, s: 1.22 - k * 0.04 }));   // (each 0.46 m tall on a rise of 0.31: they overlap, and no pole shows between)
        many('w3puff', tiers, world, 0.75, (made) => { const m4 = new THREE.Matrix4(), sq = new THREE.Matrix4();
          for (const im of made) { im.material.color.set(0xa6d82a);
            tiers.forEach((t, i) => { im.getMatrixAt(i, m4);
              sq.makeTranslation(0, t.y, 0).multiply(m4.clone().makeScale(1, 0.46 / (0.75 * t.s), 1)).multiply(new THREE.Matrix4().makeTranslation(0, -t.y, 0));
              im.setMatrixAt(i, sq.multiply(m4)); });
            im.instanceMatrix.needsUpdate = true; im.computeBoundingSphere(); } }); }
      /* his bench (brown hardwood: the model came lacquer red, its hue turned and darkened here), drawn 2.05 m long for
         two; the low table at his right hand's front with a bowl of petals and a bai sri set down on it; a carved chair
         beyond it; maroon carpets before the bench where people kneel; purple flowers at both ends */
      const BA = (a, b) => benchAt(a, b), along = BENCH.ry + Math.PI / 2;
      { const [x1, z1] = BA(0.15, 1.95), [x2, z2] = BA(-1.95, 1.8); rug(mCarpet, x1, z1, 2.4, 1.6, along); rug(mCarpet, x2, z2, 2.4, 1.6, along + 0.07, 0.009); }
      stand('w3bench', BENCH.x, 0, BENCH.z, BENCH.ry, { s: 1.1, done: (m) => { m.scale.x *= 1.24; m.traverse(q => { if (q.isMesh) { hueTurn(q.material, 17); q.material.color.multiplyScalar(0.72); } }); } });
      solidBox(2.2, 1.4, 0.8, BENCH.x, 0.7, BENCH.z, BENCH.ry);
      { const [x, z] = BA(2.25, -0.05); stand('w3chair', x, 0, z, BENCH.ry - 0.25, { s: 1.11 }); solidBox(0.9, 1.4, 0.9, x, 0.7, z, BENCH.ry); }
      const TB = BA(1.05, 1.1);
      stand('w3lowtable', TB[0], 0, TB[1], BENCH.ry + 0.12); solidBox(1.05, 1.0, 1.05, TB[0], 0.5, TB[1], BENCH.ry);
      { const [bx, bz] = BA(0.82, 1.28), [gx, gz] = BA(0.1, 0.72), [wx, wz] = BA(1.28, 0.98);
        many('w3petalbowl', [{ x: bx, y: 0.38, z: bz, ry: 0 }, { x: gx, y: 0, z: gz, ry: 1 }], world, 0.3);
        many('w3pewter', [{ x: wx, y: 0.38, z: wz, ry: 0.8 }], world, 0.5); }
      { const [ax, az] = BA(-1.55, 0.15), [cx2, cz2] = BA(2.95, 0.7); many('w3purple', [{ x: ax, y: 0, z: az, ry: 2.0 }, { x: cx2, y: 0, z: cz2, ry: 0.4 }], world, 1.1); }
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
      petalField(LOW ? 1500 : 2600, 5101, mix(around(5.7, 8.7, 2.6), around(5.7, 8.7, 1.5), around(-7.6, -0.8, 2.2), around(-7.6, 5.0, 1.7), around(7.6, -2.0, 2.0), around(0, -9.3, 2.6)), dayOne);
      /* day two: yesterday's petals everywhere, trodden into the turf */
      petalField(LOW ? 3200 : 5600, 5102, mix((rnd) => [TURF.x0 + rnd() * (TURF.x1 - TURF.x0), TURF.z0 + rnd() * (TURF.z1 - TURF.z0)],
        around(5.7, 8.7, 3.2), around(-7.6, -0.8, 2.8), around(7.6, -2.0, 2.6), around(0, -9.3, 3.0), around(0, 1.5, 6)), dayTwo);
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
      const tentS = (T0, w, e) => poly(tentCorners(T0.x, T0.z, w, T0.ry || 0), e + 0.3);
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
    dressTables(); dressHall();
    buildTrees();
    buildPetals();
    buildShade();
    paintShade('DAY1');

    /* ================================================================ THE PEOPLE (the plan's §3.3, §6.1; the tracker's §5)
       Every body here was made for this chapter end to end (a reference on white in an A pose, Meshy at its highest
       settings, its rig with fingers, the library's takes and written ones: masters/v26.0/make.sh §1 to §3), prepped in
       real metres with its feet on the origin and its face along +z. Nobody is a block figure: a person is not drawn at
       all until its model has landed (v21.16).

       A PERSON is a group with the rig cloned into it and one mixer. Its takes all run, each at a weight; `take()` names
       the one that should be full and the rest ease out. A take may hold the body off its own origin (v25.5: measured
       per take, at its first moment), so each is brought back onto the person's spot as its weight rises. In a film a
       person is posed by the film's clock (`pose()`: the take and the moment, absolute, so a seek lands on the same
       picture: v6.4); in play the wall clock runs them.

       ONE SKELETON, SEVERAL SKINS (the tracker's §5 "The levels"). A person's file holds the body drawn from near by;
       `<key>m` and `<key>f` are the same body rebuilt lighter (Meshy's own remesh at 8,000 and 2,500 triangles, the
       rig laid on each by tools/riglod.mjs), and `<key>h`, for the two he speaks to face to face, is the generator's
       own model with every triangle. Each lighter or fuller skin is bound to the near body's own bones by name, so it
       wears every take and costs no skeleton; which one is drawn is chosen every frame from the lens (and so at a cut
       from the cut's own lens: v24.22), with a little slack so a person standing on a boundary does not flicker. */
    const people = [];
    const WALKS = /^(Walking|Casual_Walk|Walking_Woman)$/;
    const LEVELS = [['h', 2.7], ['', 5.4], ['m', 11.5], ['f', Infinity]];        // each skin's suffix and how far it is drawn to
    const _pv = new THREE.Vector3(), _pq = new THREE.Quaternion(), _lens = new THREE.Vector3();
    /* the soft dark under a body (a phone draws no shadows, so a contact shadow is painted: v9.3) */
    const blobTex = (() => { const [c, x] = cnv(64); const g = x.createRadialGradient(32, 32, 2, 32, 32, 31);
      x.clearRect(0, 0, 64, 64);
      g.addColorStop(0, 'rgba(0,0,0,0.62)'); g.addColorStop(0.55, 'rgba(0,0,0,0.3)'); g.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = g; x.fillRect(0, 0, 64, 64); return tex(done(THREE, c, false)); })();
    const blobGeo = new THREE.PlaneGeometry(1, 1); blobGeo.rotateX(-Math.PI / 2);        // (dispose() finds it through the world, as it finds every geometry)
    const blobMat = B({ map: blobTex, transparent: true, depthWrite: false, opacity: 0.8, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });
    const blob = (parent, w = 0.85, d = 0.7) => { const m = new THREE.Mesh(blobGeo, blobMat); m.position.y = 0.014; m.scale.set(w, 1, d); m.renderOrder = 2; parent.add(m); return m; };

    function mkPerson(key, x, z, ry, o = {}) {
      const P = { key, o, group: new THREE.Group(), ready: false, acts: {}, w: {}, off: {}, offY: {}, cur: o.take || 'Idle_3', fade: 0.4, win: o.win || null,
                  mixer: null, model: null, head: null, hips: null, bone: {}, lv: [null, null, null, null], lvNow: -1, force: null, members: [],
                  hidden: !!o.hidden, driver: !!o.driver, filmT: null, rate: o.rate || 1, phase: o.phase || 0, clock: (o.phase || 0) * 10, then: [] };
      P.group.position.set(x, o.y || 0, z); P.group.rotation.y = ry; P.group.visible = false; (o.parent || world).add(P.group);
      people.push(P);
      if (!have(key)) { waiting.add(key); return P; }
      parseOnce(key).then(({ scene: src, animations }) => {
        if (!alive) return;
        const m = cloneSkinned(src), skins = [];
        m.traverse(q => {
          if (q.isSkinnedMesh) { q.castShadow = false; q.receiveShadow = false; q.frustumCulled = false; skins.push(q); }
          if (q.isBone) { P.bone[q.name] = q; if (/^(mixamorig:?)?Head$/.test(q.name)) P.head = q; if (/^(mixamorig:?)?Hips$/.test(q.name)) P.hips = q; }
        });
        if (o.s) m.scale.multiplyScalar(o.s);
        P.group.add(m); P.model = m; P.lv[1] = skins;
        P.mixer = new THREE.AnimationMixer(m);
        for (const clip0 of animations) {
          let clip = clip0;
          /* a walk is walked ON THE SPOT here: the group is what travels (so a path is a path), and the take's own
             travel over the ground is taken out of its hips (their sway and their rise kept) */
          if (WALKS.test(clip.name)) { clip = clip0.clone(); const tr0 = clip.tracks.find(t => /Hips\.position$/.test(t.name));
            if (tr0) { const v = tr0.values, n = v.length / 3, x0 = v[0], z0 = v[2], x1 = v[(n - 1) * 3], z1 = v[(n - 1) * 3 + 2];
              for (let i = 0; i < n; i++) { const k = n > 1 ? i / (n - 1) : 0; v[i * 3] -= (x1 - x0) * k; v[i * 3 + 2] -= (z1 - z0) * k; } } }
          const a = P.mixer.clipAction(clip); a.enabled = true; a.setEffectiveWeight(0); a.play(); P.acts[clip.name] = a; P.w[clip.name] = 0;
        }
        /* where each take holds the hips at its first moment (or at its window's start), from the person's own spot */
        if (P.hips) { const base = {};
          for (const name in P.acts) { for (const k in P.acts) P.acts[k].setEffectiveWeight(k === name ? 1 : 0);
            P.acts[name].time = P.win && P.win[name] ? P.win[name][0] : 0; P.mixer.update(0); P.group.updateWorldMatrix(true, true);
            P.hips.getWorldPosition(_pv); P.group.worldToLocal(_pv); base[name] = [_pv.x, _pv.z, _pv.y]; }
          const ref = o.centre ? [0, 0] : (base[o.ref || 'Idle_3'] || [0, 0]);    // centre: the hips themselves on the spot (a sitter on his seat)
          for (const name in base) P.off[name] = (o.keepOff && o.keepOff.test(name)) ? [0, 0] : [base[name][0] - ref[0], base[name][1] - ref[1]];
          /* A SITTER'S SEAT (o.seat: { y: the seat's top, over: how far the hips ride above it, takes: which takes sit }):
             every sitting take holds the hips at its own height (measured: Grandmaster Pho's talk sits 3 cm lower than
             his rest), so each is brought to the one height the seat asks for, and changing take never lifts him off
             it or sinks him through it (v16.8) */
          if (o.seat) for (const name in base) if (!o.seat.takes || o.seat.takes.test(name)) P.offY[name] = base[name][2] - (o.seat.y + (o.seat.over != null ? o.seat.over : 0.1)); }
        if (!P.acts[P.cur]) { console.warn(key + ' has no take ' + P.cur + ' (it has: ' + Object.keys(P.acts).join(', ') + ')'); P.cur = Object.keys(P.acts)[0]; }
        for (const k in P.acts) { P.w[k] = k === P.cur ? 1 : 0; P.acts[k].setEffectiveWeight(P.w[k]); P.acts[k].time = (P.phase * P.acts[k].getClip().duration) % P.acts[k].getClip().duration; }
        P.ready = true; P.group.visible = !P.hidden && !P.driver;
        if (!P.driver && !o.noBlob) P.blob = blob(P.group, o.blobW || 0.85, o.blobD || 0.7);
        personSettle(P); windowTime(P); P.mixer.update(0);
        if (ctx.cullBySphere && !P.driver) ctx.cullBySphere(P.group, 0, 0.9, 0, 1.9);
        for (const M0 of P.members) memberSkin(M0, 1);
        if (o.look) o.look(m);
        if (o.skins !== false) for (const i of [0, 2, 3]) addLevel(P, i);
        const L = P.then; P.then = []; for (const f of L) f(P);
      }).catch(err => { console.warn(key + ' failed to load', err); if (ctx.loadFail) ctx.loadFail(key, err); });
      return P;
    }
    /* one more skin of a person, bound to the bones the near body already has */
    function addLevel(P, i) {
      const named = P.o.skins && P.o.skins[i], key = named || (P.o.skins ? null : P.key + LEVELS[i][0]);
      if (!key) return;
      if (!have(key)) { if (i !== 0 || named) waiting.add(key); return; }
      parseOnce(key).then(({ scene: src }) => {
        if (!alive || !P.model) return;
        const made = [];
        src.traverse(sm => { if (!sm.isSkinnedMesh) return;
          const bones = sm.skeleton.bones.map(b => P.bone[b.name]);
          if (bones.some(b => !b)) { console.warn(key + ': a bone of it is not on ' + P.key); return; }
          let mat = sm.material;
          if (!mat.map) { let near = null; for (const q of P.lv[1]) for (const nm of [].concat(q.material)) if (nm.name === mat.name) near = nm; if (near) mat = near; }
          const mesh = new THREE.SkinnedMesh(sm.geometry, mat);
          mesh.castShadow = false; mesh.receiveShadow = false; mesh.frustumCulled = false; mesh.visible = false;
          P.model.add(mesh); mesh.bind(new THREE.Skeleton(bones, sm.skeleton.boneInverses), sm.bindMatrix); made.push(mesh); });
        if (!made.length) return;
        P.lv[i] = made; P.lvNow = -1;
        if (ctx.cullBySphere && !P.driver) ctx.cullBySphere(P.group, 0, 0.9, 0, 1.9);
        for (const M0 of P.members) memberSkin(M0, i);
      }).catch(err => { console.warn(key + ' failed to load', err); if (ctx.loadFail) ctx.loadFail(key, err); });
    }
    const whenReady = (P, fn) => { if (!P) return; if (P.ready) fn(P); else P.then.push(fn); };
    /* the model slid so the body stands on the person's spot whatever its takes' own offsets, by their weights */
    /* (and set down: two written takes hold the whole body a few centimetres over the ground, measured on a devotee) */
    const SINK = { prostrate: 0.046, offer: 0.049 };
    function personSettle(P) {
      if (!P.model) return; let ox = 0, oz = 0, oy = 0;
      for (const k in P.w) { const w = P.w[k], f = P.off[k]; if (w > 0 && f) { ox += f[0] * w; oz += f[1] * w; } if (w > 0 && SINK[k]) oy += SINK[k] * w; if (w > 0 && P.offY[k]) oy += P.offY[k] * w; }
      P.model.position.x = -ox; P.model.position.z = -oz; P.model.position.y = -oy;
    }
    /* A WINDOW of a take (o.win: { take: [from, length] }): a take that is right only for part of its length is played
       back and forth inside that part, eased at both ends (the seated idle leans far forward for five of its ten
       seconds: only its upright ends are a master's rest). The window may run past the take's end: it wraps. */
    function windowTime(P) {
      if (!P.win) return;
      for (const name in P.win) { const A = P.acts[name]; if (!A || !(P.w[name] > 0)) continue;
        const [from, len] = P.win[name], d = A.getClip().duration, u = (P.clock / (len * 2)) % 1, k = 0.5 - 0.5 * Math.cos(u * 2 * Math.PI);
        A.time = (((from + k * len) % d) + d) % d; A.timeScale = 0; }
    }
    /* which take a person wears from now on (eased over `fade` seconds); `restart` begins it at its start */
    function take(P, name, fade = 0.4, restart = false) {
      if (!P) return false;
      if (!P.ready) { P.cur = name; P.then.push(() => take(P, name, 0, restart)); return true; }
      if (!P.acts[name]) { console.warn(P.key + ' has no take ' + name); return false; }
      if (restart || P.cur !== name) { if (restart || P.w[name] < 0.01) P.acts[name].time = 0; }
      P.cur = name; P.fade = fade; P.filmT = null;
      if (!(fade > 0)) { for (const k in P.acts) { P.w[k] = k === name ? 1 : 0; P.acts[k].setEffectiveWeight(P.w[k]); } personSettle(P); }
      return true;
    }
    /* a film's pose: this take at this moment of its own length (held at its end, or wrapped if `loop`), absolutely */
    function pose(P, name, t, loop = false, name2 = null, k2 = 0, t2 = 0) {
      if (!P || !P.ready || !P.acts[name]) return;
      for (const k in P.acts) { const w = k === name ? 1 - (name2 ? k2 : 0) : (k === name2 ? k2 : 0); P.w[k] = w; P.acts[k].setEffectiveWeight(w); }
      const A = P.acts[name], d = A.getClip().duration; A.time = loop ? ((t % d) + d) % d : Math.max(0, Math.min(d - 1e-3, t));
      if (name2 && P.acts[name2]) { const A2 = P.acts[name2], d2 = A2.getClip().duration; A2.time = Math.max(0, Math.min(d2 - 1e-3, t2)); }
      P.cur = name; P.filmT = t; personSettle(P); P.mixer.update(0);
    }
    function put(P, x, z, ry, y = 0) { if (!P) return; P.group.position.set(x, y, z); if (ry != null) P.group.rotation.y = ry; }
    const faceTo = (x, z, tx, tz) => Math.atan2(tx - x, tz - z);                 // the turn that faces a +z-facing body at a point
    /* every frame of play: weights eased on the wall clock, takes run, bodies settled */
    function peopleTick(wdt, live) {
      for (const P of people) {
        if (!P.ready || (!P.group.visible && !P.driver)) continue;
        if (P.filmT != null && !live) continue;                                  // a film holds its people where it posed them
        if (P.filmT != null) { P.filmT = null; }
        let moved = false;
        for (const k in P.acts) { const to = k === P.cur ? 1 : 0, w = P.w[k];
          if (w !== to) { const st = P.fade > 0 ? wdt / P.fade : 1; P.w[k] = to > w ? Math.min(to, w + st) : Math.max(to, w - st); P.acts[k].setEffectiveWeight(P.w[k]); moved = true; } }
        if (moved) personSettle(P);
        P.clock += wdt * P.rate; windowTime(P);
        P.mixer.update(wdt * P.rate);
      }
    }

    /* THE CROWD (the tracker's §12). Forty-odd people cannot each have a skeleton on a phone. Each of the eight devotee
       bodies has a few DRIVERS instead: a person nobody sees, with its mixer, wearing one take at one phase. A MEMBER of
       the crowd is that body's skins drawn again from the driver's bones, wherever the member sits (three's detached
       bind mode: the pose comes from the bones, the place from the member's own group; episode 1 chapter 3's crowd,
       v5.21). So the whole crowd breathes, sways and bows on a score of mixers. A driver stands at the world's origin,
       unturned, or every member would be thrown by its place. */
    const crowd = [];
    function mkDriver(key, o = {}) { return mkPerson(key, 0, 0, 0, Object.assign({ driver: true }, o)); }
    function mkMember(D, x, z, ry, o = {}) {
      const s = o.s || 1, M0 = { D, group: new THREE.Group(), lv: [null, null, null, null], lvNow: -1, s, o };
      M0.group.position.set(x, o.y || 0, z); M0.group.rotation.y = ry; M0.group.scale.set(o.mirror ? -s : s, s, s); (o.parent || world).add(M0.group);
      if (!o.noBlob) M0.blob = blob(M0.group, (o.blobW || 0.95) / s, (o.blobD || 0.9) / s);
      crowd.push(M0); D.members.push(M0);
      for (let i = 1; i < 4; i++) if (D.lv[i]) memberSkin(M0, i);
      return M0;
    }
    function memberSkin(M0, i) {
      const src = M0.D.lv[i]; if (!src || M0.lv[i]) return;
      M0.lv[i] = src.map(sm => { const c = sm.clone(); c.bindMode = 'detached'; c.bindMatrix.identity(); c.bindMatrixInverse.identity();
        c.frustumCulled = false; c.visible = false; M0.group.add(c); return c; });
      M0.lvNow = -1;
      if (ctx.cullBySphere) ctx.cullBySphere(M0.group, 0, 0.75, 0, 1.6);         // a sitter or a stander, and room for a bow
    }

    /* WHICH SKIN IS DRAWN, every frame, from the lens. b: a boundary is crossed only 7 % past it (no flicker). A missing
       skin is stood in for by the next fuller one that is there. `force` (a film's close shot) names a level outright. */
    function levelFor(now, d, max) {
      let lv = 0;
      for (let i = 0; i < 3; i++) { const b = LEVELS[i][1]; if (now > i ? !(d < b * 0.93) : d > b * 1.07) lv++; }
      return Math.max(lv, max);
    }
    function showLevel(X, want) {
      let k = want; while (k > 1 && !X.lv[k]) k--;                                // the far skins fall back on the near one
      if (!X.lv[k]) k = 1;
      if (!X.lv[k]) return;
      if (k === X.lvShown && X.lvNow === want) return;
      for (let i = 0; i < 4; i++) if (X.lv[i]) for (const m of X.lv[i]) m.visible = i === k;
      X.lvShown = k; X.lvNow = want;
    }
    function peopleLevels(cam = camera) {
      cam.getWorldPosition(_lens);
      for (const P of people) { if (!P.ready || P.driver) { if (P.driver && P.ready && P.lvShown !== -2) { for (let i = 0; i < 4; i++) if (P.lv[i]) for (const m of P.lv[i]) m.visible = false; P.lvShown = -2; } continue; }
        if (!P.group.visible) continue;
        const g = P.group.position, d = Math.hypot(g.x - _lens.x, g.y + 1.0 - _lens.y, g.z - _lens.z);
        showLevel(P, P.force != null ? P.force : levelFor(P.lvNow < 0 ? 3 : P.lvNow, d, P.lv[0] ? 0 : 1)); }
      for (const M0 of crowd) { if (!M0.group.visible || !M0.D.ready) continue;
        const g = M0.group.position, d = Math.hypot(g.x - _lens.x, g.y + 0.8 - _lens.y, g.z - _lens.z);
        showLevel(M0, levelFor(M0.lvNow < 0 ? 3 : M0.lvNow, d, 1)); }
    }

    /* THE CAST OF DAY ONE AND DAY TWO. Who they are is the plan's §3.3. Each stands or sits where the photographs put
       their kind: the masters under their tents on the west side, the monks under the east one, Grandmaster Pho under the
       gold. (The crowd, the dancers and those who go up are placed by the play and the films.) */
    const cast = {};
    const SIT_E = Math.PI / 2, SIT_W = -Math.PI / 2;                            // seated facing east; facing west
    const REST = { Chair_Sit_Idle_M: [9.4, 2.85] };                             // the seated idle's upright window (it wraps its end)
    const PHO_AT = benchAt(0.46, 0.04);                                          // Grandmaster Pho's place: the bench's east end
    /* each seat's top in metres, MEASURED on its model (tools/probes/seatmeasure.mjs: the sofa's cushion 0.46 and sat
       into by 3 cm; the bench's slats 0.40 and the chair's seat 0.39, each at the size b_world2.js draws it) */
    const SEATS = { sofa: 0.43, bench: 0.44, chair: 0.43 };
    function buildCast() {
      const tonAt = [TON_TABLE.x + 1.25, TON_TABLE.z + 0.35];
      cast.ton = mkPerson('e4ton', tonAt[0], tonAt[1], faceTo(tonAt[0], tonAt[1], DATA.spawn.x, DATA.spawn.z), { take: 'Idle_3' });
      /* the woman at his bench stands by the low table at his right hand, turned to those who kneel (photograph 6) */
      { const [ax, az] = benchAt(1.95, 0.95), [kx, kz] = benchAt(0.3, 1.9);
        cast.aunt = mkPerson('e4bench', ax, az, faceTo(ax, az, kx, kz), { take: 'Idle_3', phase: 0.4 }); }
      /* (each on his sofa: its cushion's top is SEATS.sofa, his hips a little forward of the sofa's own middle) */
      const seat = (key, x, z, phase) => mkPerson(key, x, z, SIT_E, { take: 'Chair_Sit_Idle_M', centre: true, win: REST, phase, blobW: 1.0, blobD: 1.1,
        seat: { y: SEATS.sofa, takes: /^(Chair_Sit|Sitting_|handson|petals|palmover)/ } });
      cast.hermitA = seat('e4hermita', -10.17, -2.2, 0.1);
      cast.red = seat('e4red', -10.17, -0.95, 0.55);
      /* the second master in white sits at Grandmaster Pho's left on the same bench (photographs 1, 5, 6) */
      { const [wx, wz] = benchAt(-0.52, 0.04);
        cast.white = mkPerson('e4white', wx, wz, BENCH.ry, { take: 'Chair_Sit_Idle_M', centre: true, win: REST, phase: 0.8, blobW: 1.0, blobD: 1.1,
          seat: { y: SEATS.bench, takes: /^(Chair_Sit|Sitting_|handson|petals|palmover)/ } }); }
      cast.hermitB = seat('e4hermitb', -10.17, 5.0, 0.3);
      /* GRANDMASTER PHO (Chad's own model, prepared over v24.38 to v24.56: masters/v24.56/PLAN.md), on his bench under
         the gold canopy, facing the offering tables and those who kneel to him. His look is D, Chad's pick ("unlit, except for the robe", v24.52):
         lookD below. His rest is the first half second of his seated take, back and forth (the rest of it is talk). Far
         across the turf he is drawn from a lighter cut of the same body (permissive: fit for distance only, v21.8). */
      /* (his rest, judged on every seated take of his file at its first and last moments: the start of his rise from
         a seat, where he sits upright with both hands on his knees; its first third of a second, back and forth. His
         talk take holds both hands out before his chest from its first frame: that is talk, not rest) */
      cast.pho = mkPerson('pho', PHO_AT[0], PHO_AT[1], BENCH.ry, { take: 'Sit_to_Stand_Transition_M', centre: true,
        win: { Sit_to_Stand_Transition_M: [0.02, 0.3] }, seat: { y: SEATS.bench, takes: /^Sit/ }, skins: { 3: 'phof' }, look: lookD, blobW: 1.1, blobD: 1.2 });
      /* THE MONKS' ROW under the east tent, on chairs, facing the turf (photograph 2). Chad's monk, as episode 3's shop
         has him (declared: `reuse`), his far skin episode 3's row */
      /* (each rests at a different moment of the seated take, so three of one man do not hold one pose) */
      /* (their rest is the first and last third of a second of the seated take that begins and ends with both hands on
         the thighs; the talking take holds the hands out in the air the whole way: photographed, and refused as a rest) */
      cast.monks = [[-3.2, 0.05, 0.02, 0.32], [-2.0, 0.5, 3.5, 0.6], [-0.8, 0.85, 0.08, 0.26]].map(([z, ph, from, len]) => mkPerson('monkshop', 10.22, z, SIT_W, { take: 'Sit_Thumbs_Up_Right', centre: true,
        win: { Sit_Thumbs_Up_Right: [from, len] }, phase: ph, seat: { y: SEATS.chair, takes: /^Sit/ }, skins: { 3: 'monkrow' }, blobW: 1.0, blobD: 1.1 }));
    }
    /* LOOK D on Grandmaster Pho: after the tone mapping, the scan's own colour is laid back wherever the texel is
       saturated (his skin, his beads, the gold) and over the whole of his face-and-hands part; the white robe keeps the
       scene's light and its folds. `level` scales the laid colour to the hour (an unlit colour ignores the sun: at dawn
       or by candle it must be dimmed by hand): look() sets it. tools/probes/phoingame.mjs is where it was proved. */
    const phoLook = { k: { value: 1 }, level: { value: 1 } };
    function lookD(model) {
      model.traverse(q => { if (!q.isMesh) return;
        const list = [].concat(q.material).map(m0 => { const mt = m0.clone(); mats.push(mt); const WHOLE = /\(face and hands\)$/.test(m0.name);
          mt.onBeforeCompile = (sh) => { sh.uniforms.uK = phoLook.k; sh.uniforms.uLevel = phoLook.level;
            sh.fragmentShader = 'uniform float uLevel;\nuniform float uK;\n' + sh.fragmentShader.replace('#include <tonemapping_fragment>', '#include <tonemapping_fragment>\n'
              + (WHOLE ? 'float skn = 1.0;\n' : 'vec3 sc = pow(max(diffuseColor.rgb, vec3(1e-4)), vec3(1.0 / 2.2)); float mxc = max(sc.r, max(sc.g, sc.b)); float skn = smoothstep(0.12, 0.25, (mxc - min(sc.r, min(sc.g, sc.b))) / max(mxc, 1e-4));\n')
              + 'gl_FragColor.rgb = mix(gl_FragColor.rgb, diffuseColor.rgb * uLevel, clamp(uK * skn, 0.0, 1.0));'); };
          mt.customProgramCacheKey = () => 'phoLookD' + (WHOLE ? ':whole' : ''); return mt; });
        q.material = Array.isArray(q.material) ? list : list[0]; });
    }
    buildCast();
    /* those of the cast who STAND where he walks are things he walks round: a column each, set where its person stands
       (the engine walks the very list it was handed, so a box is moved in place, and lifted clear when its person is
       not on the ground) */
    const castBlock = {};
    for (const k of ['ton', 'aunt']) castBlock[k] = new THREE.Box3(new THREE.Vector3(0, 60, 0), new THREE.Vector3(0, 61, 0));
    function castSolid() { for (const k in castBlock) { const P = cast[k], b = castBlock[k], on = !!(P && P.group.visible && !P.hidden), g = P.group.position, r = 0.32;
      b.min.set(g.x - r, on ? 0 : 60, g.z - r); b.max.set(g.x + r, on ? 1.5 : 61, g.z + r); } }
    for (const k in castBlock) whenReady(cast[k], castSolid);


    /* ================================================================ THE CROWD OF DAY ONE (the plan's §3.3; photographs 1, 8, 10, 12)
       Devotees in white on the turf: most sit on their heels in loose rows facing the offering tables, some stand at the
       edges and talk. Eight bodies were made for them; a crowd of copies reads as copies, so WHO SITS WHERE IS SOLVED
       (Chad's rule, v5.29): a balanced deal of the eight over the places, then a seeded local search that swaps two
       people whenever the swap puts the same body further from its own copies; every other one is mirrored and each is a
       little taller or shorter. `stage.crowdStats()` reports what the solve reached, so the claim can be checked.

       Each body has three drivers (c_cast.js): two sitting at different moments of the same take, one standing. So the
       people of one body do not all breathe together, and the whole crowd is twenty-four mixers. */
    const DEVOTEES = ['e4deva', 'e4devb', 'e4devc', 'e4devd', 'e4deve', 'e4devf', 'e4devg', 'e4devh'];
    const crowdSeats = [];                                                       // { x, z, ry, kind: 'sit' | 'stand', body, mirror, s, drv }
    const crowdDrivers = {};                                                     // key -> { sitA, sitB, stand }
    const crowdBlock = [];
    function planCrowd() {
      const R = rng(41203);
      const aim = (x, z) => faceTo(x, z, 0, -11.2);                              // toward the offering tables
      /* the sitting blocks: a jittered grid in each, and only so many of its places taken (loose rows, small groups) */
      const block = (x0, x1, z0, z1, n) => { const cells = [];
        for (let z = z0; z <= z1 + 1e-6; z += 1.18) for (let x = x0 + ((Math.round((z - z0) / 1.18) % 2) ? 0.5 : 0); x <= x1 + 1e-6; x += 1.08) cells.push([x, z]);
        for (let i = cells.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); const t = cells[i]; cells[i] = cells[j]; cells[j] = t; }
        for (const [x, z] of cells.slice(0, n)) { const px = x + (R() - 0.5) * 0.3, pz = z + (R() - 0.5) * 0.3;
          crowdSeats.push({ x: px, z: pz, ry: aim(px, pz) + (R() - 0.5) * 0.3, kind: 'sit' }); } };
      block(-8.2, -2.4, 2.6, 6.6, 12);          // south-west of the middle
      block(2.2, 5.4, 1.4, 5.2, 6);             // south-east, short of the chief canopy
      block(-6.4, -2.4, -6.6, -2.8, 8);         // north-west, before the west tent
      block(2.4, 6.4, -7.2, -3.6, 6);           // north-east, before the monks
      /* those who stand: in twos and threes at the edges, turned to one another or to the tables */
      const pair = (x, z, n, r = 0.55) => { const a0 = R() * 6.283;
        for (let i = 0; i < n; i++) { const a = a0 + i * 6.283 / n, px = x + Math.sin(a) * r, pz = z + Math.cos(a) * r;
          crowdSeats.push({ x: px, z: pz, ry: n > 1 ? faceTo(px, pz, x, z) + (R() - 0.5) * 0.4 : aim(px, pz), kind: 'stand' }); } };
      pair(-8.6, 10.6, 2); pair(9.6, 3.6, 3, 0.62); pair(8.9, 6.2, 1); pair(-9.6, -8.4, 2); pair(4.4, -8.9, 2); pair(-1.9, 10.9, 1);
      /* THE SOLVE: bodies dealt evenly, then swaps that part a body from its copies. The cost of a pair of the same body
         falls with the square of the distance between them inside six metres */
      const N = crowdSeats.length, body = new Int32Array(N);
      const order = Array.from({ length: N }, (_, i) => i);
      for (let i = N - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); const t = order[i]; order[i] = order[j]; order[j] = t; }
      order.forEach((seat, k) => { body[seat] = k % DEVOTEES.length; });
      const pairCost = (i, j) => { if (body[i] !== body[j]) return 0; const d = Math.hypot(crowdSeats[i].x - crowdSeats[j].x, crowdSeats[i].z - crowdSeats[j].z); return d < 6 ? (6 - d) * (6 - d) : 0; };
      const costOf = (i) => { let c = 0; for (let j = 0; j < N; j++) if (j !== i) c += pairCost(i, j); return c; };
      let swaps = 0;
      for (let it = 0; it < 6000; it++) { const a = Math.floor(R() * N), b = Math.floor(R() * N); if (a === b || body[a] === body[b]) continue;
        const before = costOf(a) + costOf(b); let t = body[a]; body[a] = body[b]; body[b] = t;
        if (costOf(a) + costOf(b) < before - 1e-9) swaps++; else { t = body[a]; body[a] = body[b]; body[b] = t; } }
      crowdSeats.forEach((s, i) => { s.body = body[i]; s.mirror = R() < 0.5; s.s = 0.955 + R() * 0.085; s.half = R() < 0.5 ? 'A' : 'B'; });
      crowdSeats.swaps = swaps;
    }
    function crowdStats() {
      const N = crowdSeats.length, per = DEVOTEES.map(() => 0); let near = Infinity, sum = 0, touching = 0;
      for (let i = 0; i < N; i++) { per[crowdSeats[i].body]++; let best = Infinity;
        for (let j = 0; j < N; j++) if (j !== i && crowdSeats[j].body === crowdSeats[i].body) best = Math.min(best, Math.hypot(crowdSeats[i].x - crowdSeats[j].x, crowdSeats[i].z - crowdSeats[j].z));
        near = Math.min(near, best); sum += best; if (best < 1.6) touching++; }
      return { people: N, sitting: crowdSeats.filter(s => s.kind === 'sit').length, standing: crowdSeats.filter(s => s.kind === 'stand').length,
               perBody: per, nearestSameBody: +near.toFixed(2), meanNearestSameBody: +(sum / N).toFixed(2), sameBodyWithin1m6: touching, swaps: crowdSeats.swaps, drivers: Object.keys(crowdDrivers).length * 3 };
    }
    function buildCrowd() {
      planCrowd();
      const SIT = { seiza: [0.4, 6.8] };                                         // the kneeling sit, back and forth over nearly its whole length
      for (const key of DEVOTEES) crowdDrivers[key] = {
        A: mkDriver(key, { take: 'seiza', centre: true, win: SIT, phase: 0.07 + 0.11 * DEVOTEES.indexOf(key) }),
        B: mkDriver(key, { take: 'seiza', centre: true, win: SIT, phase: 0.55 + 0.09 * DEVOTEES.indexOf(key), rate: 0.86 }),
        S: mkDriver(key, { take: 'Idle_3', centre: true, phase: 0.13 * DEVOTEES.indexOf(key) }) };
      for (const s of crowdSeats) { const D = crowdDrivers[DEVOTEES[s.body]][s.kind === 'stand' ? 'S' : s.half];
        s.member = mkMember(D, s.x, s.z, s.ry, { s: s.s, mirror: s.mirror, parent: dayOne, blobW: s.kind === 'stand' ? 0.8 : 0.95, blobD: s.kind === 'stand' ? 0.7 : 1.0 });
        /* a person is a thing he walks round: a column from the ground (collide() samples at a metre) */
        const r = 0.3; crowdBlock.push(new THREE.Box3(new THREE.Vector3(s.x - r, 0, s.z - r), new THREE.Vector3(s.x + r, 1.5, s.z + r))); }
    }
    /* the crowd's columns stand only while the crowd does: the engine walks the very list it was handed, so each box is
       lifted clear of his head height when the crowd is gone, and set down again when it is back */
    function crowdSolid(on) { for (const b of crowdBlock) { b.min.y = on ? 0 : 60; b.max.y = on ? 1.5 : 61; } }
    buildCrowd();

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
      crowdSolid(dayOne.visible);
      paintShade(name === 'OPENED' || name === 'SHUT' ? 'DAWN' : name);
    }
    function openDecision() { decOpen = true; if (getState() === 'play') startDecision(); }

    /* ---------------------------------------------------------------- the decision: Grandmaster Pho, on his bench */
    const _ndc = new THREE.Vector3();
    const INTERACT_R = 3.4;
    const PILE_POS = new THREE.Vector3(PHO_AT[0], 0, PHO_AT[1]);              // (he is the chapter's pile: where he sits, not the bench's middle)
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
      if (st !== 'cine') { windClock += wdt; windTick(windClock); peopleTick(wdt, true); peopleLevels(); lodTick(); }
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
      for (const b of crowdBlock) out.push(b);                                   // the crowd, a column a person (lifted out of his way when they are gone: crowdSolid)
      for (const k in castBlock) out.push(castBlock[k]);                         // and those of the cast who stand on the turf (each follows its person: castSolid)
      return out;
    }
    function dispose() {
      alive = false;
      const geos = new Set(), ms = new Set(), skels = new Set();
      world.traverse(o => {
        if (o.isSkinnedMesh && o.skeleton) skels.add(o.skeleton);                  // each skin's bone sheet is a texture of its own
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
      for (const k of skels) k.dispose();
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
      look, presets: PRESETS, films, crowdStats,
      who: () => people.filter(P => !P.driver).map(P => ({ key: P.key, ready: P.ready, take: P.cur, skin: P.lvShown, skins: P.lv.map(v => (v ? 1 : 0)).join('') })),
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
     lattice of the fence, a louvred window, and one handful of petals. */
  function done(THREE, c, rep) {
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
    if (rep) { t.wrapS = t.wrapT = THREE.RepeatWrapping; }
    return t;
  }
  /* (the hall's fretwork is a picture cut from his photograph now: the surface `fretwork`) */
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
