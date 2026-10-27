/* Episode 4 · Chapter 1 · "The Master I Did Not Know"
   ---------------------------------------------------------------------------
   THE FIRST CHAPTER OF CASE FILE 4, "The Teacher In White" — the first half of
   S1·11, "Not Every Master Should Be Trusted". He has his own amulet shop now,
   and a worry about its future. A dealer he buys from knows "a very strong
   master" in Thailand; nobody can tell him anything else about the man. In a
   house among the rice fields, with a storm coming, the master is kind,
   unhurried, and dressed in black. His room shows things it does not explain.
   The chapter ends on the case file's own words: "When I got back to
   Singapore, I stopped feeling like myself."

   WHAT THE PLAYER LEARNS TO DO: LOOK. Ask the ordinary questions; write down
   what you saw rather than what you think it means; notice only what is
   really there. Three new ways to play carry it — ASK (the people waiting),
   THE LEDGER (his stock book's back pages: a fact or a meaning) and WHAT
   CHANGED? (the storm's lightning as a blink).

   FAIRNESS (Chad's standing rule: no practice and no practitioner is ever the
   villain). The master is warm, competent in his own practice and hospitable;
   he never pushes an item and nothing he does is harm. What unsettles the room
   is only what Master Z perceives, and the chapter never says what it means.

   FIVE WORLDS (the far plane is 160 m, v8.9: none is ever drawn from another):
   - WORLD C, x 0: the master's compound in the central plains' rice country —
     the lane and the gate, the stilt house, the waiting sala, the receiving
     room's outside, the takhian tree — and the road on its dyke across the
     paddies (the opening film's rice country is shot here). Play I.
   - WORLD R, x +250: the receiving room inside. Play II–IV, the decision.
   - WORLD S, x −250: his own new shop at dawn, and the closed mall outside it.
     The opening film and the coda.
   - WORLD T, x −500: a Singapore taxi at night in the rain. The coda.

   PREVIEW (the forty-second seam): built and deployed as a preview — out of
   the run, opened only by ?ch=e4c1 — until its voices are recorded (CP11) and
   the release takes the flag out (CP14).

   docs/V24.0-E4C1-PLAN.md is the build's memory, checkpoint by checkpoint. */

(() => {
  'use strict';

  let S = null;

  /* ---------------------------------------------------- the light presets (§10.2)
     Light is presets and painted glows — never a new light on screen (v15.1). Five stops each, so the sky tweens
     between any two. Tuned by photograph at CP4–CP6. The yard's sky is the generated storm dome (e4sky); the stops
     only matter where the dome is not drawn. */
  const sky = (o) => Object.assign({ stars: 0, moon: 0, sun: 0, clouds: 0 }, o);
  const YARD0 = sky({                 // the yard, arriving: warm gold under the storm deck, long shadows
    stops: [[0.00, '#e8b888'], [0.12, '#c8a48c'], [0.35, '#8a86a0'], [0.65, '#5a5a7c'], [1.00, '#3a3a58']],
    bg: 0x5a5a72, fog: [0x9a8a7a, 0.0065],
    hemi: [0xffe2bc, 0x5a4a30, 0.95], key: [0xffc27a, 1.25, -30, 9, 14], fill: [0x8a84b4, 0.30],
    vmHemi: [0xffe2bc, 0x5a4a30, 0.95], vmKey: [0xffc884, 1.0] });
  const YARD1 = sky({                 // the yard, waiting: the gold going grey
    stops: [[0.00, '#c8a890'], [0.12, '#a8988e'], [0.35, '#787890'], [0.65, '#505070'], [1.00, '#343452']],
    bg: 0x50506a, fog: [0x86807e, 0.0075],
    hemi: [0xe8d8c4, 0x4a4234, 0.82], key: [0xffcc90, 0.85, -30, 9, 14], fill: [0x8282aa, 0.30],
    vmHemi: [0xe8d8c4, 0x4a4234, 0.85], vmKey: [0xffd0a0, 0.8] });
  const YARD2 = sky({                 // the yard, his number called: the storm deck over the sun
    stops: [[0.00, '#8a8890'], [0.12, '#76768a'], [0.35, '#5c5c7a'], [0.65, '#40405e'], [1.00, '#2a2a44']],
    bg: 0x3c3c56, fog: [0x6a6a7a, 0.0095],
    hemi: [0xc0c4d4, 0x3a3830, 0.70], key: [0xc8c8e0, 0.45, -20, 14, 10], fill: [0x7a7aa4, 0.30],
    vmHemi: [0xc8ccd8, 0x3a3830, 0.75], vmKey: [0xd0d0e4, 0.55] });
  const ROOM = sky({                  // the receiving room: the tube's green-white, the louvres' blue, candle amber
    stops: [[0.00, '#5a6070'], [0.12, '#4c5266'], [0.35, '#3c4258'], [0.65, '#2c3046'], [1.00, '#1c2034']],
    bg: 0x2a3040, fog: [0x2a3040, 0.0004],
    hemi: [0xd8f0e4, 0x3a3428, 0.78], key: [0xe8fff4, 0.55, 0, 6, 1], fill: [0x8aa0c8, 0.26],
    vmHemi: [0xd8f0e4, 0x3a3428, 0.82], vmKey: [0xe8fff4, 0.6] });
  const DARK = sky({                  // the power cut: two candles and the black between lightning
    stops: [[0.00, '#141826'], [0.12, '#10131e'], [0.35, '#0c0e18'], [0.65, '#080a12'], [1.00, '#04050a']],
    bg: 0x05060c, fog: [0x05060c, 0.0004],
    hemi: [0xffb878, 0x0c0806, 0.26], key: [0xffa860, 0.42, -1, 1.2, -1], fill: [0x4a5a8a, 0.08],
    vmHemi: [0xffc488, 0x0c0806, 0.34], vmKey: [0xffb070, 0.42] });
  const AFTER = sky({                 // the hush: washed silver-blue, dripping eaves
    stops: [[0.00, '#c8d0dc'], [0.12, '#b0bccc'], [0.35, '#8c9cb4'], [0.65, '#6a7c98'], [1.00, '#4c5c7a']],
    bg: 0x7a8aa4, fog: [0xa8b4c4, 0.006],
    hemi: [0xdce6f0, 0x4a4c48, 0.86], key: [0xe8eef8, 0.50, -20, 12, 8], fill: [0xa8b8d4, 0.32],
    vmHemi: [0xdce6f0, 0x4a4c48, 0.86], vmKey: [0xe8eef8, 0.55] });
  const ROAD = sky({                  // the film's road: low gold sun under the violet storm wall
    stops: [[0.00, '#f0b878'], [0.12, '#d49a80'], [0.35, '#8a7a9c'], [0.65, '#55507a'], [1.00, '#363256']],
    bg: 0x56506e, fog: [0xa89070, 0.0045],
    hemi: [0xffe4c0, 0x4a5a30, 1.0], key: [0xffb868, 1.45, -40, 6, 4], fill: [0x8a80b8, 0.32],
    vmHemi: [0xffe4c0, 0x4a5a30, 1.0], vmKey: [0xffc078, 1.1] });
  const SHOP = sky({                  // his own shop at dawn: clean white, pale timber, soft daylight
    stops: [[0.00, '#e8ecf0'], [0.12, '#dfe4ea'], [0.35, '#cfd6e0'], [0.65, '#bcc6d4'], [1.00, '#a8b4c6']],
    bg: 0xc8d0da, fog: [0xd8dee6, 0.004],
    hemi: [0xf4f6f8, 0x8a8478, 1.10], key: [0xfff4e4, 0.70, 0, 6, 6], fill: [0xd0dcec, 0.36],
    vmHemi: [0xf4f6f8, 0x8a8478, 1.05], vmKey: [0xfff4e4, 0.75] });
  const TAXI = sky({                  // Singapore at night in the rain: sodium and LED on wet glass
    stops: [[0.00, '#2a2030'], [0.12, '#201a2a'], [0.35, '#161424'], [0.65, '#0e0e1a'], [1.00, '#06060e']],
    bg: 0x08080e, fog: [0x1a1620, 0.02],
    hemi: [0xffb070, 0x0a0a10, 0.34], key: [0xffc080, 0.30, 0, 4, 2], fill: [0x6a80c0, 0.12],
    vmHemi: [0xffb878, 0x0a0a10, 0.4], vmKey: [0xffc888, 0.35] });
  const GREY = sky({                  // the coda's dawn in the shop, drained a third toward grey (the fog begins)
    stops: [[0.00, '#c4c6c8'], [0.12, '#babcbe'], [0.35, '#aaacb0'], [0.65, '#989a9e'], [1.00, '#86888c']],
    bg: 0xa8aaae, fog: [0xb4b6ba, 0.008],
    hemi: [0xdcdcdc, 0x6a6a6a, 0.92], key: [0xe4e4e4, 0.45, 0, 6, 6], fill: [0xc0c4c8, 0.30],
    vmHemi: [0xdcdcdc, 0x6a6a6a, 0.92], vmKey: [0xe4e4e4, 0.5] });
  const PRESETS = { YARD0, YARD1, YARD2, ROOM, DARK, AFTER, ROAD, SHOP, TAXI, GREY };

  const DATA = {
    id: 1,
    episode: 4,
    title: 'The Master I Did Not Know',
    cardLabel: 'Chapter 1',
    cardTitle: 'The Master I Did Not Know',
    brief: 'Your own shop, and a question about its future. A dealer knows a master in Thailand. Nobody knows anything else about him.',
    prompt: 'The rain has stopped. He is waiting for you.',
    /* Master Z's own trial, 5.1, verbatim (docs/source/mztrial-episodes.md): the four options, their verdicts and their
       lessons; the deltas are the trial's ×3, as in episode 3 (§2.2 9) */
    choices: [
      { k: 'A', text: 'Observe quietly before reacting',
        d: { sanity: -3, awareness: 9, wisdom: 12 }, verdict: 'good',
        say: 'I kept what I saw as what I saw, and didn\'t decide what it meant.',
        teach: 'Observe before concluding. Unusual does not automatically mean understood. Careful observation gave you more detail without forcing an interpretation.' },
      { k: 'B', text: 'Ask directly about what you notice',
        d: { sanity: -3, awareness: 6, wisdom: 6 }, verdict: 'bad',
        say: 'I asked to understand. I showed more than I learned.',
        teach: 'Questions can gather context, but reveal only what is necessary. The answer gave you context — and you showed a stranger what you can perceive.' },
      { k: 'C', text: 'Assume the master is dangerous',
        d: { sanity: -6, awareness: 3, wisdom: -9 }, verdict: 'worst', critical: true,
        say: 'Fear made up my mind before I knew anything at all.',
        teach: 'Suspicion can justify caution, but it is not proof. Your certainty moved ahead of the evidence.' },
      { k: 'D', text: 'Leave without getting more involved',
        d: { sanity: 3, awareness: 6, wisdom: 15 }, verdict: 'best',
        say: 'I knew when to leave. Understanding could wait.',
        teach: 'Knowing when to leave can be wisdom. You avoided unnecessary exposure, and kept what you saw for later.' }
    ],
    /* S1·11's own lesson, its first half (the choosing; the "be especially careful" half is chapter 2's) — the case
       file's words, trimmed (§2.3 Q7); no Pali tag */
    core: 'Do not choose a spiritual master simply because somebody calls them a master. Ask the ordinary questions you would ask about anyone you are about to trust: who are they, and who can genuinely vouch for them? Spiritual knowledge and good character are not automatically the same thing, and the title alone tells you nothing about the second one.',

    /* units metres, y up. WORLD C (x 0): the yard x −16…14, z −13…8, the gate at z 8 on the lane (x 0), the road
       across the paddies at z 21. WORLD R (x +250): the room x −2.5…2.5, z −2…2 (local). WORLD S (x −250) and WORLD T
       (x −500) are seen only in films. Play begins beside the pickup outside the gate, facing in. */
    spawn:     { x: -0.8, y: 1.62, z: 10.5, rot: 0 },
    shrine:    { x: 8.5, z: -6.5 },           // the engine's anchor (ghost: null): the receiving room's door
    ghostHome: { x: 8.5, z: -6.5 },
    bounds:    { minX: -62, maxX: 262, minZ: -22, maxZ: 30 },

    /* NO HAUNTING (the eleventh leak): the chapter frightens with stillness, and nothing hunts him */
    ghost: null,
    fireLight: null,
    daylight: YARD0,

    /* the first master is his own (§2.1 2); every other person is a PLACEHOLDER until Chad's model lands
       (docs/E4-MODELS.md), declared in `reuse` so the FRESH check names it on every run */
    assets: ['firstmaster', 'e4sky', 'staffman', 'yinkeeper', 'sitwoman', 'sitwomantalk', 'owner', 'encik', 'granny'],
    reuse: {
      staffman: 'Pong, the dealer — a placeholder until Chad\'s model (docs/E4-MODELS.md)',
      yinkeeper: 'Pa Noi, the master\'s wife — a placeholder until Chad\'s model',
      sitwoman: 'Khun Joy — a placeholder until Chad\'s model',
      sitwomantalk: 'Khun Joy\'s talking take — with her placeholder',
      owner: 'Uncle Lim — a placeholder until Chad\'s model',
      encik: 'Ta Sombat — a placeholder until Chad\'s model',
      granny: 'the presence at the edge of sight — a placeholder until Chad\'s model'
    },
    items: [],

    musicVol: 0,
    /* the beds (§9.3) — PLANNED until CP11 (silent until then: chaptertest allows a planned sound only in a preview) */
    ambience: { beds: [['w4yard', 0], ['w4paddy', 0], ['w4roomtone', 0], ['w4rainl', 0], ['w4rainh', 0], ['w4after', 0],
                       ['w4taxi', 0], ['w4radio', 0]] },
    plannedSounds: ['w4yard', 'w4paddy', 'w4roomtone', 'w4rainl', 'w4rainh', 'w4after', 'w4taxi', 'w4radio'],
    voiceLine: null,

    words: {
      approach: '',                          // no floating label (v12.5): the orders name what to do
      act: 'E to act',
      actTouch: 'Tap to act',
      interact: 'E to choose what you do',
      interactTouch: 'Tap to choose what you do',
      actLine: 'Press E to choose what you do',
      actLineTouch: 'Tap to choose what you do',
      // PLAY I · the yard (§4.2)
      objFollow: 'Follow Pong into the samnak',
      objWait: 'Wait for your number · you are 14, now {n}',
      objAsk: 'Ask about the master · {n}/3',
      objGoIn: 'Go in',
      hotDoor: 'The receiving room',
      // PLAY II–IV · the room (§4.3–§4.5)
      objKneel: 'Kneel on the mat',
      objWatch: 'Watch. Write down what you see · {n}/4',
      hotMat: 'Kneel',
      // the preview's own words, until the play is built (CP8)
      objPreview: 'Being built: press the door to go in'
    },
    sayPrefix: 'q1',
    preview: true
  };

  /* every line's length — ESTIMATED until CP11 records the takes (the registry carries the same numbers); the line
     queue books its window by it, so a voice never starts over another. The names are QUOTED on purpose: build.py
     gives a sound to a chapter's own pack only when the chapter names it in quotes (v21.1). Written from the registry
     by masters/v24.0/script/secs.py. */
  /* SECS BEGIN */
  const SECS = {
    /* q */
      'q1pro1': 7.19, 'q1pro2': 8.84, 'q1pro3': 7.12, 'q1pro4': 5.83, 'q1pro5': 4.61, 'q1board': 2.57,
      'q1water': 1.6, 'q1joy1': 3.84, 'q1joy2': 2.76, 'q1lim1': 3.14, 'q1lim2': 3.14, 'q1sb1': 4.68, 'q1pg1': 3.84,
      'q1nobody': 3.14, 'q1missed': 2.37, 'q1tree': 3.07, 'q1wai': 1.6, 'q1shop': 5.58, 'q1short': 3.14,
      'q1smoke': 6.73, 'q1cloth': 3.46, 'q1shadow': 3.84, 'q1her': 3.98, 'q1A1': 2.76, 'q1A2': 1.6, 'q1A3': 1.33,
      'q1A4': 6.42, 'q1B1': 3.84, 'q1B2': 1.33, 'q1B3': 2.96, 'q1B4': 6.92, 'q1C0': 5.13, 'q1C1': 2.37,
      'q1C2': 1.22, 'q1C3': 6.03, 'q1D1': 5.97, 'q1D2': 5.08, 'q1D3': 3.07, 'q1D4': 3.53, 'q1D5': 5.45, 'q1K1': 5.9,
      'q1K2': 3.26, 'q1K3': 2.87, 'q1A': 6.22, 'q1B': 4.5, 'q1C': 4.68, 'q1D': 3.73,
    /* pg */
      'pg1car': 5.97, 'pg1here': 2.96, 'pg1come': 4.11, 'pg1sbq': 4.59, 'pg1sb': 8.86, 'pg1me': 7.52, 'pg1go': 3.21,
      'pg1tree': 4.88, 'pg1shop': 2.76, 'pg1th1': 4.34, 'pg1good': 5.9, 'pg1day': 3.14, 'pg1read': 10.4,
      'pg1items': 4.88, 'pg1nk': 5.13, 'pg1tk': 3.34, 'pg1py': 3.34, 'pg1offer': 6.33, 'pg1eyes': 3.73,
      'pg1power': 4.81, 'pg1Ank': 8.21, 'pg1Atk': 6.03, 'pg1Apy': 6.03, 'pg1A1': 5.28, 'pg1A2': 1.22, 'pg1B1': 2.89,
      'pg1B2': 5.4, 'pg1B3': 8.27, 'pg1B4': 3.07, 'pg1B5': 6.03, 'pg1B6': 4.31, 'pg1B7': 5.65, 'pg1C1': 4.04,
      'pg1C2': 3.73, 'pg1D1': 4.89, 'pg1D2': 4.11, 'pg1D3': 5.38,
    /* pn */
      'pn1num': 6.04, 'pn1water': 5.41, 'pn1n10': 1.45, 'pn1n11': 1.81, 'pn1n12': 1.72, 'pn1n13': 1.72,
      'pn1n14': 2.47, 'pn1tray': 0.9, 'pn1mango': 6.35, 'pn1card': 2.37, 'pn1C1': 4.59,
    /* jy */
      'jy1a': 8.41, 'jy1b': 5.4, 'jy1go': 2.96,
    /* lm */
      'lm1a': 8.99, 'lm1b': 5.47, 'lm1go': 2.57,
    /* sb */
      'sb1a': 8.95,
    /* fm */
      'fm1hello': 4.31, 'fm1shop': 2.07, 'fm1good': 5.22, 'fm1day': 1.61, 'fm1hm': 1.22, 'fm1read': 15.29,
      'fm1items': 3.43, 'fm1anu': 1.34, 'fm1eyes': 2.25, 'fm1chant': 28, 'fm1chant2': 40, 'fm1blessA': 2.61,
      'fm1Abye': 1.52, 'fm1B1': 5.77, 'fm1B2': 1.43, 'fm1B3': 3.52, 'fm1C1': 3.31, 'fm1C2': 2.52, 'fm1D1': 2.61,
    /* tx */
      'tx1where': 1.6,
  };
  /* SECS END */

  /* M1 · THE PREVIEW'S PLACEHOLDERS (§12 CP2): until the voices are recorded, every line not yet recorded is shown
     where its voice will go — its words at their estimated length (SECS), the speaker under them — so the chapter can
     be played and its words read before a credit is spent. The table is the registry's words, written by
     tools/previewcaps.mjs (re-run it after the sheet's words change; chaptertest checks it is current). CP11 deletes
     the table, its markers, previewCap and previewCues, and their calls: a recorded line needs none of it */
  /* PREVIEW CAPTIONS BEGIN */
  const PREVIEW_CAPS = {
    q1pro1: ['Not long after, my interest in amulets became more than curiosity. It grew into a serious pursuit.', 'him'],
    q1pro2: ['Eventually I opened an amulet shop of my own... though I was still very much a student of this world.', 'him'],
    q1pro3: ['Business was slow. I wanted guidance about the fortune... and the future of my shop.', 'him'],
    q1pro4: ['A dealer I bought from said he knew a very strong master in Thailand.', 'him'],
    pg1car: ['This Ajahn very strong one, brother. Business, family, everything... you will see!', 'Pong'],
    q1pro5: ['A Thai master... I did not know very well.', 'him'],
    pg1here: ['Here, here! This is Ajahn\'s samnak.', 'Pong'],
    pg1come: ['Come, come. Pa Noi will give you a number.', 'Pong'],
    pn1num: ['Hello... Fourteen — number fourteen, kha. Wait at the sala, kha.', 'Pa Noi'],
    q1board: ['Fourteen. They\'re only on nine.', 'him'],
    pn1water: ['Drink some water first... drink water first, kha. Very hot today.', 'Pa Noi'],
    q1water: ['Khop khun krap.', 'him'],
    pn1n10: ['Number ten!', 'Pa Noi, in Thai'],
    pn1n11: ['Number eleven!', 'Pa Noi, in Thai'],
    pn1n12: ['Number twelve!', 'Pa Noi, in Thai'],
    pn1n13: ['Number thirteen!', 'Pa Noi, in Thai'],
    pn1n14: ['Number fourteen! Fourteen!', 'Pa Noi, in Thai'],
    q1joy1: ['Sorry... have you been to him before?', 'him'],
    jy1a: ['First time. My boss\'s wife came last month — she said he\'s very powerful. I drove three hours, you know.', 'Khun Joy'],
    q1joy2: ['Do you know who taught him?', 'him'],
    jy1b: ['Honestly? No. Someone said Cambodia... someone said a forest monk.', 'Khun Joy'],
    q1lim1: ['Uncle, you\'re not from around here either?', 'him'],
    lm1a: ['Ah, you also not from here, right? I\'m from KL. My friend recommend. His friend\'s business — after one visit, double!', 'Uncle Lim'],
    q1lim2: ['How long has he been a master?', 'him'],
    lm1b: ['Three, four years? But already so popular. Must be got something, right?', 'Uncle Lim'],
    q1sb1: ['Pong, can you ask him how long the Ajahn\'s been here?', 'him'],
    pg1sbq: ['Uncle... has the Ajahn lived here long?', 'Pong, in Thai'],
    sb1a: ['I\'ve lived here sixty years... the Ajahn only came five years ago. Before that, I don\'t know where he came from either.', 'Ta Sombat, in Thai'],
    pg1sb: ['He say he live here sixty years. Ajahn come only five years ago. Before that... he also don\'t know.', 'Pong'],
    q1pg1: ['Pong... how long have you known him?', 'him'],
    pg1me: ['Me? Actually... first time I come also. My cousin know him. She say very good.', 'Pong'],
    q1nobody: ['Nobody here actually knows who he is.', 'him'],
    q1missed: ['I never got to ask.', 'him'],
    jy1go: ['Okay, my turn. Good luck, ah.', 'Khun Joy'],
    lm1go: ['Wah, finally! See you, boy.', 'Uncle Lim'],
    pg1go: ['Our turn! Come, come — shoes off.', 'Pong'],
    q1tree: ['Dresses... hanging on a tree?', 'him'],
    pg1tree: ['For the lady who stay in the tree. Don\'t point, ah.', 'Pong'],
    fm1hello: ['Hello... sit, sit, make yourself comfortable.', 'the master, in Thai'],
    q1wai: ['Sawasdee krap, Ajahn.', 'him'],
    fm1shop: ['What kind of shop do you have?', 'the master, in Thai'],
    pg1shop: ['Ajahn ask what shop you have.', 'Pong'],
    q1shop: ['An amulet shop. A small one... it just opened, in Singapore.', 'him'],
    pg1th1: ['An amulet shop, Ajahn. Just opened in Singapore.', 'Pong, in Thai'],
    fm1good: ['Good, good... an amulet shop: you make merit and earn a living at the same time.', 'the master, in Thai'],
    pg1good: ['He say good, good! Amulet shop — make merit and make money, same time.', 'Pong'],
    fm1day: ['What day were you born?', 'the master, in Thai'],
    pg1day: ['He ask what day you were born.', 'Pong'],
    fm1hm: ['Mm...', 'the master, in Thai'],
    fm1read: ['His shop is a good place, many people walk past... but money doesn\'t stay. It comes in and goes out, like water through the hands. If he wants it to stay, I can help... but he must make merit often too, and keep his mind calm.', 'the master, in Thai'],
    pg1read: ['He say your shop is good place... but the money don\'t stay. Come in, go out, like water. He can help it stay.', 'Pong'],
    q1short: ['He said a lot more than that.', 'him'],
    pn1tray: ['Please.', 'Pa Noi, in Thai'],
    pg1items: ['He has many thing for business. You take one is enough.', 'Pong'],
    fm1items: ['Choose whichever piece you like. Don\'t feel you have to.', 'the master, in Thai'],
    pg1nk: ['Nang Kwak! Good choice — she call the customer in for you.', 'Pong'],
    pg1tk: ['Takrut! Keep it under your cash drawer.', 'Pong'],
    pg1py: ['Pha yant! Hang it over your door.', 'Pong'],
    pg1offer: ['And the teacher offering — kha khru — you put what you want, up to you.', 'Pong'],
    fm1anu: ['I rejoice in your merit.', 'the master, in Thai'],
    fm1eyes: ['You may close your eyes. Relax.', 'the master, in Thai'],
    pg1eyes: ['He say close your eyes also can. Relax.', 'Pong'],
    q1smoke: ['The smoke... it\'s leaning toward that bowl. But the fan\'s blowing the other way.', 'him'],
    q1cloth: ['That cloth... did it just move?', 'him'],
    q1shadow: ['His shadow... it moved after he did.', 'him'],
    q1her: ['Someone\'s standing behind him— No. There\'s no one.', 'him'],
    pg1power: ['Power cut. Normal, normal... every time rain, like this.', 'Pong'],
    fm1blessA: ['May your trade go well. May you prosper.', 'the master, in Thai'],
    pg1Ank: ['He say your shop will be busy. Put the Nang Kwak facing your door — she will call the customer.', 'Pong'],
    pg1Atk: ['He say your shop will be busy. Keep the takrut under your cash drawer.', 'Pong'],
    pg1Apy: ['He say your shop will be busy. Hang the pha yant over your door.', 'Pong'],
    fm1Abye: ['Go well, come back well.', 'the master, in Thai'],
    q1A1: ['I don\'t know what I saw.', 'him'],
    pn1mango: ['Take some mangoes with you... take mango, kha! From our tree. Very sweet.', 'Pa Noi'],
    q1A2: ['Khop khun krap.', 'him'],
    pg1A1: ['See? I tell you. Very good one. My cousin never lie.', 'Pong'],
    pg1A2: ['Strong, right?', 'Pong'],
    q1A3: ['...Maybe.', 'him'],
    q1A4: ['I didn\'t know what I\'d seen in that room. So I let it stay unknown.', 'him'],
    q1B1: ['Pong... ask him who\'s standing behind him.', 'him'],
    pg1B1: ['Behind? ...Okay. I ask.', 'Pong'],
    pg1B2: ['Ajahn... he asks who is standing behind you.', 'Pong, in Thai'],
    fm1B1: ['That one has been in this house longer than me... not many people see them.', 'the master, in Thai'],
    pg1B3: ['He say... that one stay in this house longer than him. He say not many people can see.', 'Pong'],
    fm1B2: ['Who taught him?', 'the master, in Thai'],
    pg1B4: ['He ask... who teach you?', 'Pong'],
    q1B2: ['...Nobody.', 'him'],
    fm1B3: ['If he wants to learn, come back. I can teach him to use it.', 'the master, in Thai'],
    pg1B5: ['He say you should come back. He can teach you how to use it.', 'Pong'],
    q1B3: ['Thank you, Ajahn. Maybe another time.', 'him'],
    pn1card: ['Ajahn say, call anytime, kha.', 'Pa Noi'],
    pg1B6: ['Brother! You can SEE? Why you never tell me!', 'Pong'],
    pg1B7: ['Next time you bring me, okay? I also want to know my future!', 'Pong'],
    q1B4: ['I\'d asked to understand... and shown a man I didn\'t know what I could see.', 'him'],
    q1C0: ['The bowl... the shadow... her. It\'s all him.', 'him'],
    q1C1: ['He\'s doing something to me.', 'him'],
    fm1C1: ['Oh... it\'s all right, it\'s all right.', 'the master, in Thai'],
    fm1C2: ['It\'s still slippery outside. Go carefully.', 'the master, in Thai'],
    pg1C1: ['He say... go carefully. Outside still slippery.', 'Pong'],
    pn1C1: ['Wait, wait, an umbrella! Wait — umbrella, kha! Rain coming again!', 'Pa Noi'],
    pg1C2: ['Brother, what happen? He is a good man!', 'Pong'],
    q1C2: ['Just drive.', 'him'],
    q1C3: ['I was certain before I knew anything. And the certainty came home with me.', 'him'],
    q1D1: ['Pong... please tell him thank you. This is enough for me today.', 'him'],
    pg1D1: ['Ajahn, he says thank you very much. That\'s enough for today.', 'Pong, in Thai'],
    fm1D1: ['Of course, of course. No problem. As you like.', 'the master, in Thai'],
    pg1D2: ['Finish already? He haven\'t even done the full one!', 'Pong'],
    q1D2: ['It\'s okay. Let\'s sit for a bit. The road\'s still flooded.', 'him'],
    pg1D3: ['You know... I also never actually ask who is his teacher.', 'Pong'],
    q1D3: ['Next time... we ask first.', 'him'],
    q1D4: ['Some things I don\'t need to understand today.', 'him'],
    q1D5: ['I didn\'t need to understand it to know it was time to go.', 'him'],
    tx1where: ['Where to, boss?', 'the taxi uncle in Singapore'],
    q1K1: ['It\'s... the shop\'s at... sorry, uncle. Give me a second.', 'him'],
    q1K2: ['When I got back to Singapore...', 'him'],
    q1K3: ['...I stopped feeling like myself.', 'him'],
  };
  /* PREVIEW CAPTIONS END */
  function previewCap(kit, name) {
    const P = PREVIEW_CAPS[name];
    if (!P || !kit || !kit.captions) return false;
    /* a long line in pieces of about a dozen words, broken after a sentence where one ends, each held for its share of
       the line's words (v23.0: whole, the longest stood six lines tall over a phone's picture) */
    const words = P[0].split(' '), parts = [];
    let cur = [];
    for (const w of words) {
      cur.push(w);
      if (words.length > 14 && (cur.length >= 12 || (cur.length >= 6 && /[.?!—]$/.test(w)))) { parts.push(cur); cur = []; }
    }
    if (cur.length) { if (parts.length && cur.length < 4) parts[parts.length - 1].push(...cur); else parts.push(cur); }
    const secs = SECS[name] || 2.5;
    let at = 0;
    kit.captions(parts.map(pw => { const e = { at, end: at + secs * pw.length / words.length, text: pw.join(' '), sub: P[1] }; at = e.end; return e; }));
    return true;
  }
  /* a film's or a scene's own planned lines, each captioned on its cue's frame; at the end the captions go with the
     picture (a skip runs the passed steps in the order they were pushed, so the clearing one runs last) */
  function previewCues(c, api) {
    if (!c || !Array.isArray(c.stings) || !Array.isArray(c.tracks) || !api || !api.step) return;
    const mine = c.stings.filter(st => PREVIEW_CAPS[st.kind]);
    if (!mine.length) return;
    const end = c.tracks.reduce((m, tr) => Math.max(m, tr.t1), 0);
    for (const st of mine) api.step(st.at, () => previewCap(api.kit, st.kind));
    api.step(end, () => { if (api.kit && api.kit.captions) api.kit.captions(null); });
  }

  function build(ctx) {
    const { THREE, GLTFLoader, cloneSkinned, scene, camera, yaw, pitch, LOW, kit, cnv, loadImageTexture,
            assetBytes, rescueTextures, getState, startDecision, worldSfx, warmSounds, soundOff, unifySkeletons,
            makeHellNote } = ctx;

    /* (the v21.1 TDZ law: everything a builder or a frame asks for is declared up here, before anything is built) */
    const owned = [];
    let alive = true;
    const parsedGlb = new Map();
    const madeTex = [];
    const tex = (t) => { madeTex.push(t); return t; };
    const noteTex = tex(makeHellNote());                  // the contract wants one (the engine's note prop reads it at boot)
    const mats = [];
    const M = (o) => { const m = new THREE.MeshStandardMaterial(o); mats.push(m); return m; };
    const B = (o) => { const m = new THREE.MeshBasicMaterial(o); mats.push(m); return m; };   // unlit: a glow, a painted view
    const wallNow = () => performance.now() / 1000;
    const domeLive = { mesh: null, mat: null, tint: new THREE.Color(1, 1, 1), tintTo: new THREE.Color(1, 1, 1), tintFrom: new THREE.Color(1, 1, 1), t0: 0, t1: 0 };

    /* ------------------------------------------------------------- the map */
    const RX = 250, SX = -250, TX = -500;                 // WORLD R's, S's and T's x
    const YARD = { x0: -16, x1: 14, z0: -13, z1: 8 };     // WORLD C's compound
    const GATE = { x: 0, z: 8, w: 4.2 };                  // the gate on the lane
    const ROAD_Z = 21;                                     // the road on its dyke, along x
    const RM = { x0: -2.5, x1: 2.5, z0: -2.0, z1: 2.0, H: 2.8 };   // WORLD R, local
    const RDOOR = { x: 8.5, z: -6.2 };                    // the receiving room's door, in the yard (its steps face +z)
    const R_ARRIVE = { x: RX + 0.0, z: 1.55 };            // just inside the room's door, facing the master
    const MASTER = { x: 0, z: -1.35 };                    // on his platform at the back wall, facing +z (local)
    const CMAT = { x: 0, z: 0.2 };                        // the client's mat (local)

    const world = new THREE.Group();
    scene.add(world);
    const worldC = new THREE.Group(); world.add(worldC);
    const worldR = new THREE.Group(); worldR.position.x = RX; world.add(worldR);
    const worldS = new THREE.Group(); worldS.position.x = SX; worldS.visible = false; world.add(worldS);
    const worldT = new THREE.Group(); worldT.position.x = TX; worldT.visible = false; world.add(worldT);

    const walls = [], solids = [];
    const box = (w, h, d, x, y, z, mat, parent = world, cast = true) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
      m.position.set(x, y, z); m.castShadow = cast && !LOW; m.receiveShadow = true;
      parent.add(m); return m;
    };
    const matProxy = M({ color: 0x8d7a66, roughness: 0.9 });
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

    /* ============================================== THE SKY DOME (CP1, §3.3)
       The rice country's storm: a generated equirectangular panorama (assets/e4sky.jpg — the zenith down to 6° under
       the horizon, row 1029 of 1098 the horizon) on a sphere segment of radius 140 that rides with the lens, so its
       horizon is the true one wherever he stands. Drawn after the engine's own dome (renderOrder −900 to its −1000)
       and before everything else, neither tested nor written to depth; unlit and untoned, so the photograph's own
       colours stand and a preset's `dome` tint is the only thing that moves them. The light here is still the
       presets' — the dome is a picture, never a light (v15.1). */
    const DOME_R = 140, DOME_THETA = THREE.MathUtils.degToRad(96.46);
    {
      const g = new THREE.SphereGeometry(DOME_R, 64, 24, 0, Math.PI * 2, 0, DOME_THETA);
      const m = B({ color: 0xffffff, side: THREE.BackSide, fog: false, depthWrite: false, depthTest: false, toneMapped: false });
      const d = new THREE.Mesh(g, m);
      d.renderOrder = -900; d.frustumCulled = false; d.visible = false;
      world.add(d);
      domeLive.mesh = d; domeLive.mat = m;
      loadImageTexture('e4sky', 'image/jpeg').then(t => {
        if (!alive || !t) return;
        madeTex.push(t);
        /* an ImageBitmap ignores flipY (its first row is the image's top): flipped here by the repeat, so the zenith
           is the top of the sphere segment */
        t.wrapS = THREE.RepeatWrapping; t.repeat.set(1, -1); t.offset.set(0, 1);
        m.map = t; m.needsUpdate = true; d.visible = true;
      });
    }
    /* the tint a preset gives the dome (the photograph is the gold arrival; the waiting greys it, the storm darkens it) */
    const DOME_TINT = { YARD0: [1, 1, 1], YARD1: [0.84, 0.84, 0.88], YARD2: [0.58, 0.58, 0.66], AFTER: [0.86, 0.9, 1.0],
                        ROAD: [1.06, 1.02, 0.98], ROOM: [0.5, 0.52, 0.6], DARK: [0.16, 0.17, 0.22] };
    function domeTint(name, secs = 0) {
      const v = DOME_TINT[name] || [1, 1, 1];
      domeLive.tintFrom.copy(domeLive.tint); domeLive.tintTo.setRGB(v[0], v[1], v[2]);
      domeLive.t0 = wallNow(); domeLive.t1 = domeLive.t0 + Math.max(0.001, secs);
    }
    function domeFrame(now) {
      const d = domeLive.mesh; if (!d) return;
      /* the dome rides with the lens in WORLD C (the rice country); the room, the shop and the taxi have their own skies */
      const w = worldOf(yaw.position.x);
      d.visible = !!domeLive.mat.map && w === 'C';
      d.position.set(yaw.position.x, 0, yaw.position.z);
      const k = Math.min(1, Math.max(0, (now - domeLive.t0) / Math.max(0.001, domeLive.t1 - domeLive.t0)));
      domeLive.tint.copy(domeLive.tintFrom).lerp(domeLive.tintTo, k);
      domeLive.mat.color.copy(domeLive.tint);
    }

    /* ============================================== THE WORLDS, AS BOXES (CP2)
       CP4–CP6 build each place out; until then each is its floor, its walls and its masses, so the chapter boots, every
       world can be reached and the flow can be walked end to end. */
    const mEarth = M({ color: 0x9a5a3c, roughness: 0.95 });       // red earth
    const mPaddy = M({ color: 0x5a7a3a, roughness: 0.6 });         // the paddies (CP5: water and rice)
    const mRoad  = M({ color: 0x4a4a4c, roughness: 0.9 });
    const mTeak  = M({ color: 0x5a3e2a, roughness: 0.8 });
    const mConc  = M({ color: 0xb8b2a8, roughness: 0.9 });
    const mZinc  = M({ color: 0x8a8e92, roughness: 0.5, metalness: 0.4 });
    const mMint  = M({ color: 0x9ac8b4, roughness: 0.9 });
    const mFloor = M({ color: 0x8a8278, roughness: 0.8 });
    const mWhite = M({ color: 0xf0f0ec, roughness: 0.6 });
    const mDark  = M({ color: 0x1a1a1e, roughness: 0.7 });

    // WORLD C: the paddies to the dome's horizon, the compound's earth, the road on its dyke
    {
      const p = new THREE.Mesh(new THREE.PlaneGeometry(300, 300), mPaddy); p.rotation.x = -Math.PI / 2; p.position.y = -0.06; worldC.add(p);
      const e = new THREE.Mesh(new THREE.PlaneGeometry(YARD.x1 - YARD.x0 + 4, YARD.z1 - YARD.z0 + 18), mEarth);
      e.rotation.x = -Math.PI / 2; e.position.set((YARD.x0 + YARD.x1) / 2, 0, (YARD.z0 + YARD.z1) / 2 + 7); e.receiveShadow = true; worldC.add(e);
      const r = new THREE.Mesh(new THREE.PlaneGeometry(300, 5.5), mRoad); r.rotation.x = -Math.PI / 2; r.position.set(0, 0.02, ROAD_Z); worldC.add(r);
      // the compound's masses (CP5 builds each one out)
      solids.push(box(8, 5.2, 10, -9, 2.6, -5, mTeak, worldC));            // the stilt house
      solids.push(box(6, 2.8, 4, 0, 1.4, -2, mTeak, worldC));              // the waiting sala
      walls.push(box(7, 3.2, 7, 8.5, 1.6, -9.9, mConc, worldC));           // the receiving room, outside (its door on its +z face)
      walls.push(box(0.5, 2.2, 0.5, GATE.x - GATE.w / 2, 1.1, GATE.z, mConc, worldC));
      walls.push(box(0.5, 2.2, 0.5, GATE.x + GATE.w / 2, 1.1, GATE.z, mConc, worldC));
      // the compound's fence round the yard (gaps only at the gate)
      walls.push(hidBox(YARD.x1 - YARD.x0, 2, 0.3, (YARD.x0 + YARD.x1) / 2, 1, YARD.z0 - 0.2, worldC));
      walls.push(hidBox(0.3, 2, YARD.z1 - YARD.z0 + 10, YARD.x0 - 0.2, 1, (YARD.z0 + YARD.z1) / 2 + 5, worldC));
      walls.push(hidBox(0.3, 2, YARD.z1 - YARD.z0 + 10, YARD.x1 + 0.2, 1, (YARD.z0 + YARD.z1) / 2 + 5, worldC));
      walls.push(hidBox((GATE.x - GATE.w / 2) - YARD.x0, 2, 0.3, (YARD.x0 + GATE.x - GATE.w / 2) / 2, 1, GATE.z, worldC));
      walls.push(hidBox(YARD.x1 - (GATE.x + GATE.w / 2), 2, 0.3, (YARD.x1 + GATE.x + GATE.w / 2) / 2, 1, GATE.z, worldC));
      walls.push(hidBox(YARD.x1 - YARD.x0 + 1, 2, 0.3, (YARD.x0 + YARD.x1) / 2, 1, 13.2, worldC));   // the lane's far edge (the road beyond is the film's)
      solids.push(box(1.9, 1.8, 5.2, -1.2, 0.9, 12.0, mWhite, worldC));   // the pickup, parked (CP6 builds it)
    }
    // WORLD R: the receiving room (local), its platform at the back, the client's mat
    {
      const f = new THREE.Mesh(new THREE.PlaneGeometry(RM.x1 - RM.x0, RM.z1 - RM.z0), mFloor); f.rotation.x = -Math.PI / 2; worldR.add(f);
      const c = new THREE.Mesh(new THREE.PlaneGeometry(RM.x1 - RM.x0, RM.z1 - RM.z0), mWhite); c.rotation.x = Math.PI / 2; c.position.y = RM.H; worldR.add(c);
      walls.push(box(RM.x1 - RM.x0, RM.H, 0.2, 0, RM.H / 2, RM.z0 - 0.1, mMint, worldR));
      walls.push(box(RM.x1 - RM.x0, RM.H, 0.2, 0, RM.H / 2, RM.z1 + 0.1, mMint, worldR));
      walls.push(box(0.2, RM.H, RM.z1 - RM.z0, RM.x0 - 0.1, RM.H / 2, 0, mMint, worldR));
      walls.push(box(0.2, RM.H, RM.z1 - RM.z0, RM.x1 + 0.1, RM.H / 2, 0, mMint, worldR));
      solids.push(box(2.4, 0.32, 1.1, MASTER.x, 0.16, MASTER.z, mTeak, worldR));   // the platform
      const mat = box(0.9, 0.012, 1.2, CMAT.x, 0.006, CMAT.z, M({ color: 0xc8b07a, roughness: 0.95 }), worldR, false);
      mat.receiveShadow = true;
    }
    // WORLD S: his shop at dawn (local; CP6)
    {
      const f = new THREE.Mesh(new THREE.PlaneGeometry(6, 9), mWhite); f.rotation.x = -Math.PI / 2; worldS.add(f);
      box(6, 3, 0.2, 0, 1.5, -4.5, mWhite, worldS); box(0.2, 3, 9, -3, 1.5, 0, mWhite, worldS); box(0.2, 3, 9, 3, 1.5, 0, mWhite, worldS);
    }
    // WORLD T: the taxi's cabin (local; CP6)
    {
      box(1.6, 0.05, 2.6, 0, 0.3, 0, mDark, worldT); box(1.6, 0.05, 2.6, 0, 1.45, 0, mDark, worldT);
    }

    /* ------------------------------------------------- the chapter clock */
    const PHASES = ['arrive', 'wait', 'called', 'consult', 'items', 'work', 'storm', 'decide'];
    let phase = 'arrive';
    let booted = false, preplaced = '';
    const dayClock = { t: 0 };
    let lastWall = 0;
    const todo = [];
    function after(secs, fn) { todo.push({ at: dayClock.t + secs, fn }); todo.sort((a, b) => a.at - b.at); }
    function runTodo() { while (todo.length && todo[0].at <= dayClock.t) todo.shift().fn(); }
    function dropTodo() { todo.length = 0; }
    const heard = new Set();

    const speak = { until: 0, pending: null };
    function speakReset() { speak.until = 0; speak.pending = null; }
    /* A LINE IS A BEAT, HEARD OR NOT (e3c3's law): a muted game speaks it silently on its own length, a line whose
       bytes have not landed is held a moment (v8.0) and then spoken silently, and a PLANNED line (no take yet, CP11)
       shows its words on its estimate — so a beat chained on a line's start never stops the chapter */
    function sayLine(name, vol = 1, onStart, pan) {
      if (dayClock.t < speak.until) return false;
      const start = () => { speak.until = dayClock.t + (SECS[name] || 2.5) + 0.25; heard.add(name); if (onStart) onStart(); };
      if (PREVIEW_CAPS[name]) { start(); previewCap(kit, name); return true; }
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
    function queueFn(fn) { lineQ.push({ fn }); }
    function queueGap(gap) { lineQ.push({ gap }); }
    function runQueue() {
      if (!lineQ.length || speak.pending || dayClock.t < speak.until) return;
      const q = lineQ.shift();
      if (q.fn) { q.fn(); return; }
      if (q.gap) { speak.until = dayClock.t + q.gap; return; }
      sayLine(q.name, q.vol, q.onStart, q.pan);
    }

    /* ------------------------------------------------------------ the phases */
    const W = DATA.words;
    function worldOf(x) { return x > 125 ? 'R' : x < -375 ? 'T' : x < -125 ? 'S' : 'C'; }
    let worldRun = 0;
    let wDark = false;
    let decOpen = false;
    function setPhase(p, tag) {
      phase = p;
      if (kit) kit.setPhase(tag ? p + ':' + tag : p);
      objectiveFor(p, tag);
    }
    function objectiveFor(p) {
      if (!kit) return;
      if (wDark) { kit.objective(null, { complete: false }); return; }
      const o = { arrive: W.objPreview, wait: W.objPreview, called: W.objGoIn, consult: W.objKneel, decide: null }[p];
      kit.objective(o || null);
    }
    function look(name, secs = 0) {
      if (kit) kit.daylight(PRESETS[name] || null, secs);
      domeTint(name, secs);
    }

    /* ------------------------------------------------------- between worlds (e3c5's toWorld) */
    function placeIn(w) {
      if (w === 'R') { yaw.position.x = R_ARRIVE.x; yaw.position.z = R_ARRIVE.z; yaw.rotation.y = 0; pitch.rotation.x = -0.12; }
      else { yaw.position.x = DATA.spawn.x; yaw.position.z = DATA.spawn.z; yaw.rotation.y = DATA.spawn.rot; pitch.rotation.x = 0; }
      if (kit) { look(w === 'R' ? 'ROOM' : 'YARD0', 0); kit.pose('standing', { secs: 0.05 }); }
    }
    function toWorld(w, resumed, at, tag) {
      const run = ++worldRun;
      const cold = resumed && preplaced === w;
      if (kit) { kit.root(false); kit.presence(0); if (!cold) kit.fade(1, 0.01); }
      if (!cold) placeIn(w);
      wDark = !cold;
      setPhase(at || (w === 'R' ? 'consult' : 'arrive'), tag);
      const warmed = !cold && kit && kit.warm ? kit.warm() : Promise.resolve(0);
      warmed.then(() => {
        if (run !== worldRun || !alive) return;
        wDark = false;
        if (kit && !cold) kit.fade(0, 0.8);
        objectiveFor(phase);
      });
    }
    function openDecision() {
      decOpen = true;
      if (getState() === 'play') startDecision();
    }

    /* ------------------------------------------------------- the decision: the master, in the room */
    const _ndc = new THREE.Vector3();
    const INTERACT_R = 3.2;
    const PILE_POS = new THREE.Vector3(RX + MASTER.x, 0, MASTER.z);
    const pile = new THREE.Group(); pile.position.copy(PILE_POS); world.add(pile);
    const pileLive = () => decOpen && phase === 'decide' && worldOf(yaw.position.x) === 'R';
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

    /* ------------------------------------------------------------- hotspots (CP8 builds the play; CP2's door) */
    const hotspots = [
      { id: 'door', pos: { x: RDOOR.x, y: 1.5, z: RDOOR.z }, radius: 3.0, prompt: W.hotDoor,
        enabled: () => worldOf(yaw.position.x) === 'C' && ['arrive', 'wait', 'called'].includes(phase),
        onInteract() { toWorld('R', false, 'consult'); after(3.0, () => { setPhase('decide'); openDecision(); }); return true; } }
    ];

    /* ------------------------------------------------------------- the frame */
    function updateNotes(dt, t) {
      const now = wallNow();
      domeFrame(now);
      const st = getState();
      const live = st === 'play' || st === 'unlock' || st === 'choose';
      if (!booted && !preplaced && kit) {
        const RA = resumeAt(kit.getPhase());
        if (RA) { preplaced = RA.w; placeIn(RA.w); }
      }
      if (!live) { lastWall = 0; return; }
      if (lastWall) dayClock.t += Math.min(0.5, now - lastWall);
      lastWall = now;
      if (!booted) {
        booted = true;
        applyPhase(kit ? kit.getPhase() : null);
      }
      runTodo(); runSpeak(); runQueue();
    }
    function updatePile() {}
    function updateFire() {}
    function updateSlow() {}

    /* ------------------------------------------------------------ a resume (§10.1) */
    function resumeAt(p0) {
      const tag = String(p0 || '').split(':'), p = PHASES.includes(tag[0]) ? tag[0] : 'arrive';
      if (PHASES.indexOf(p) >= PHASES.indexOf('consult')) return { w: 'R', at: p, tag: tag[1] || '' };
      return null;
    }
    function applyPhase(p) {
      const RA = resumeAt(p);
      if (RA) {
        toWorld('R', true, RA.at === 'decide' ? 'decide' : 'consult');
        if (RA.at === 'decide') after(0.6, openDecision);
        else after(3.0, () => { setPhase('decide'); openDecision(); });
        return;
      }
      look('YARD0', 0);
      setPhase('arrive');
    }

    /* ---------------------------------------------------------- lifecycle */
    function snap() { return { phase }; }
    function restore() {}
    function reset() {
      dropTodo(); speakReset(); lineQ.length = 0; heard.clear();
      booted = false; preplaced = ''; dayClock.t = 0; lastWall = 0;
      worldRun++; wDark = false; decOpen = false;
      worldS.visible = false; worldT.visible = false;
      for (const h of hotspots) { h.done = false; h.dwellT = 0; }
      if (kit) {
        kit.root(false); kit.pose('standing', { secs: 0.05 });
        if (kit.pray) kit.pray(false, { secs: 0 });
        kit.presence(0);
        kit.daylight(null, 0);
        kit.setPhase('arrive');
      }
      domeTint('YARD0', 0);
      phase = 'arrive';
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
      /* the engine's sky rides with him in the rice country (its dome is behind ours); the room, the shop and the taxi
         carry theirs with them (chapter 4's L4-2: away from the origin the engine's sky stood out of reach) */
      skyAt: () => ({ x: yaw.position.x, z: yaw.position.z }),
      get noteStorm() { return 1; },
      set noteStorm(v) {},
      film: { RX, SX, TX, YARD, GATE, ROAD_Z, RM, RDOOR, R_ARRIVE, MASTER, CMAT, worldC, worldR, worldS, worldT },
      pileVia: { what: 'the receiving room\'s door (pressing it carries him inside)', x: RDOOR.x, z: RDOOR.z + 0.9 },
      arrivals: [{ what: 'the receiving room (just inside its door)', x: R_ARRIVE.x, z: R_ARRIVE.z }],
      get phase() { return phase; },
      setPhase, applyPhase, after, dayClock, sayLine, queueLine, queueFn, queueGap,
      look, presets: PRESETS, dome: domeLive, worldOf,
      info: () => ({ phase, t: +dayClock.t.toFixed(2), queued: lineQ.length, heard: [...heard], world: worldOf(yaw.position.x),
                     until: +speak.until.toFixed(2), pending: speak.pending ? speak.pending.name : null, decOpen }),
      hotspots,
      updateNotes, updatePile, updateFire, updateSlow,
      snap, restore, reset, dispose
    });
  }

  /* ====================================================== THE FILMS (CP9 shoots them; CP2's are placeholders)
     The opening film and the four endings in the engine's cutscene language. Until CP9 each is its words over black,
     so the flow can be walked and every line read where it will play. */
  function introFilm(c, s, api) {
    const { fade, sfx, step } = api;
    c.keepFade = true;                         // it ends on black: the chapter card comes up over it (v14.1's law)
    fade(0, 0.01, 1, 1);
    sfx(0.5, 'q1pro1', 1); sfx(6.0, 'q1pro2', 1);
    fade(11.4, 12, 1, 1);
    step(12, () => {});
    previewCues(c, api);
  }
  function scEnding(names) {
    return function (c, s, api) {
      const { fade, sfx, step } = api;
      fade(0, 0.6, 0, 1);
      let t = 0.8;
      for (const n of names) { sfx(t, n, 1); t += (SECS[n] || 2.5) + 0.3; }
      step(t + 0.5, () => {});
      previewCues(c, api);
    };
  }
  const scStill = scEnding(['q1A1', 'q1A3', 'q1A4']);
  const scQuestion = scEnding(['q1B1', 'pg1B1', 'pg1B3', 'q1B4']);
  const scCertain = scEnding(['q1C0', 'q1C1', 'pg1C2', 'q1C3']);
  const scEnough = scEnding(['q1D1', 'pg1D2', 'q1D4', 'q1D5']);

  (window.__CHAPTERS__ = window.__CHAPTERS__ || {}).e4c1 = Object.assign(DATA, {
    build,
    scenes: [scStill, scQuestion, scCertain, scEnough],
    intro: introFilm
  });
})();
