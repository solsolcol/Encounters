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
    const RM = { x0: -2.7, x1: 2.7, z0: -2.6, z1: 2.0, H: 2.9 };   // WORLD R, local (CP4: §6.2's room, 5.4 × 4.6)
    const RDOOR = { x: 8.5, z: -6.2 };                    // the receiving room's door, in the yard (its steps face +z)
    const R_ARRIVE = { x: RX - 0.6, z: 1.45, ry: -0.175 };  // just inside the room's door, turned to the master
    const MASTER = { x: 0, z: -1.95 };                    // on his platform at the back wall, facing +z (local)
    const CMAT = { x: 0, z: 0.0 };                        // the client's mat (local)

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
    // WORLD R: the receiving room — built in full below (CP4)
    // WORLD S: his shop at dawn (local; CP6)
    {
      const f = new THREE.Mesh(new THREE.PlaneGeometry(6, 9), mWhite); f.rotation.x = -Math.PI / 2; worldS.add(f);
      box(6, 3, 0.2, 0, 1.5, -4.5, mWhite, worldS); box(0.2, 3, 9, -3, 1.5, 0, mWhite, worldS); box(0.2, 3, 9, 3, 1.5, 0, mWhite, worldS);
    }
    // WORLD T: the taxi's cabin (local; CP6)
    {
      box(1.6, 0.05, 2.6, 0, 0.3, 0, mDark, worldT); box(1.6, 0.05, 2.6, 0, 1.45, 0, mDark, worldT);
    }

    /* ============================================== WORLD R · THE RECEIVING ROOM (CP4, §4.3, §6.2)
       The master's receiving room: 5.4 × 4.6 m, 2.9 high, at x +250. Faded mint distemper over a darker dado, old cement
       tiles, a fibre-board ceiling on battens; one fluorescent tube, a ceiling fan that does not turn and a wall fan that
       does; his teak platform along the back wall under a three-tier altar shelf; a low table at its edge; two glass
       cabinets of amulets; louvred windows with the storm beyond; the door he came in by, and a curtained doorway into
       the house behind the master's left shoulder.
       EVERYTHING THE STORM'S "WHAT CHANGED?" ASKS ABOUT IS INSIDE A PHONE'S SLICE FROM THE MAT (§4.5): a portrait phone
       sees the centre third of the desktop's frame (AUDIT-2026-09), ±0.35 m at the table and ±0.87 m at the back wall
       from where he kneels — so the covered bowl, the cup and the candles are on the low table, the clock hangs beside
       the altar, and the place she steps to on a phone is behind his left shoulder. The four signs (§4.4) are look-spots
       and may sit anywhere: he turns to find them.
       Lit by the presets and painted glows only — never a new light (v15.1). */
    const RMC = {
      PLAT: { x0: -1.5, x1: 1.5, z0: RM.z0, z1: -1.4, top: 0.34 },      // the master's teak platform
      LOWT: { x0: -0.55, x1: 0.55, z0: -1.4, z1: -0.95, top: 0.38 },    // the low table at its edge
      ENTRY: { x0: -1.05, x1: -0.15, h: 2.05 },                          // the door he came in by (front wall)
      CURT: { x0: 1.7, x1: 2.45, h: 2.1 },                               // the curtained doorway into the house (back wall)
      WINL: { z0: -0.55, z1: 0.95, y0: 0.95, y1: 2.15 },                 // the louvred window, left wall
      WINR: { z0: -0.35, z1: 1.15, y0: 0.95, y1: 2.15 },                 // and right
      CLOCK: { x: 0.72, y0: 1.33, y1: 2.05 },                            // the pendulum clock beside the altar
      CUP: [{ x: 0.26, z: -1.03 }, { x: 0.06, z: -1.03 }],               // the water cup, and where it is at flash 2 (§4.5)
      BOWL: { x: -0.28, z: -1.08 },                                       // the covered bowl
      INC: { x: 0.0, z: -1.22 },                                          // the incense cup on the table
      HER: { door: { x: 1.98, z: -2.36 }, deskStep: { x: 1.72, z: -1.92 }, phoneStep: { x: 0.6, z: -2.25 } },
      EYE: { x: 0, y: 1.0, z: 0.0 }                                        // his eye when he kneels on the mat
    };
    const room = {
      tubeMat: null, tubeHalo: null, tubeCeil: null, tubeK: 1, tubeTo: 1, tubeDie: 0, tubeFlick: 0,
      candles: [], candleK: 0, candleTo: 0, pools: [], wash: null,
      fanBlades: null, fanBlur: null, fanRibbon: null, fanOn: true,
      ribbons: [], curtain: null, curtainBase: null,
      pendulum: null, clockRun: true, clockT: 0, hands: null,
      cup: null, cupAt: 0, cloth: null, clothBase: null, clothW: null, breathT: -1,
      smoke: [], smokeLean: 1,
      views: [], rains: [], floorBands: [], rainK: 0, rainTo: 0,
      drip: null, ripple: null, dripT: 0,
      last: 0, forced: false
    };
    function buildRoom() {
      const R = worldR, { x0, x1, z0, z1, H } = RM, Wd = x1 - x0, Dp = z1 - z0, cx = (x0 + x1) / 2, cz = (z0 + z1) / 2;
      const { PLAT, LOWT, ENTRY, CURT, WINL, WINR, CLOCK } = RMC;
      const add = (o, p = R) => { p.add(o); return o; };
      const mesh = (g, m, x, y, z, p = R) => { const o = new THREE.Mesh(g, m); o.position.set(x, y, z); o.castShadow = !LOW; o.receiveShadow = true; p.add(o); return o; };
      const bx = (w, h, d, m, x, y, z, p = R) => mesh(new THREE.BoxGeometry(w, h, d), m, x, y, z, p);
      const cyl = (rt, rb, h, m, x, y, z, seg = 16, p = R) => mesh(new THREE.CylinderGeometry(rt, rb, h, seg), m, x, y, z, p);
      const lathe = (pts, m, x, y, z, seg = 20, p = R) => mesh(new THREE.LatheGeometry(pts.map(q => new THREE.Vector2(q[0], q[1])), seg), m, x, y, z, p);
      const flat = (w, h, m, p = R) => { const o = new THREE.Mesh(new THREE.PlaneGeometry(w, h), m); p.add(o); return o; };
      const m4 = new THREE.Matrix4();

      /* ---- the drawn sheets (the drawers are at the foot of the file) */
      const tTile = tex(makeCementTiles(THREE, cnv)); tTile.repeat.set(Wd / 0.4, Dp / 0.4);
      const tWall = tex(makeMintWall(THREE, cnv, H)); tWall.repeat.set(1 / 2.0, 1 / H);
      const tCeil = tex(makeCeilBoards(THREE, cnv)); tCeil.repeat.set(Wd / 1.2, Dp / 1.2);
      const tPlat = tex(makePlanks(THREE, cnv, 4461)); tPlat.repeat.set((PLAT.x1 - PLAT.x0) / 1.0, (PLAT.z1 - PLAT.z0) / 0.6);
      const tTable = tex(makePlanks(THREE, cnv, 4463, [74, 46, 26])); tTable.repeat.set(1.1, 0.75);
      const tDoor = tex(makePlanks(THREE, cnv, 4465, [86, 56, 34])); tDoor.repeat.set(0.25, 3.4); tDoor.rotation = Math.PI / 2;
      const tMat = tex(makeReedMat(THREE, cnv, 4471)), tMat2 = tex(makeReedMat(THREE, cnv, 4473));
      const tGlow = tex(makeGlow(THREE, cnv)), tFlame = tex(makeFlame(THREE, cnv)), tPuff = tex(makePuff(THREE, cnv));
      const tCurt = tex(makeCurtainPrint(THREE, cnv)); tCurt.repeat.set(2.2, 4.5);

      /* ---- materials */
      const mWall = M({ map: tWall, roughness: 0.93 });
      const mPaint = M({ color: 0x96c4ae, roughness: 0.9 });               // a reveal, a sill: the same distemper, plain
      const mGreen = M({ color: 0x2e4a3c, roughness: 0.55 });              // frames, bars: old dark-green gloss
      const mTeak = M({ color: 0x4a2e1a, roughness: 0.7 });
      const mTeakD = M({ color: 0x2e1c10, roughness: 0.75 });
      const mLacq = M({ color: 0x861414, roughness: 0.42 });               // red lacquer
      const mGold = M({ color: 0xc9a043, roughness: 0.38, metalness: 0.75 });
      const mBrass = M({ color: 0xb8892e, roughness: 0.32, metalness: 0.85 });
      const mSilver = M({ color: 0xc8ccd0, roughness: 0.28, metalness: 0.9 });
      const mGlass = M({ color: 0xcfe2dc, roughness: 0.05, metalness: 0.1, transparent: true, opacity: 0.12, depthWrite: false });
      const mFrost = M({ color: 0xbcd0d4, roughness: 0.35, transparent: true, opacity: 0.42, depthWrite: false, side: THREE.DoubleSide });
      const mWhiteP = M({ color: 0xe8e4da, roughness: 0.5 });
      const mCream = M({ color: 0xe6dfcc, roughness: 0.38, metalness: 0.05 });
      const mConduit = M({ color: 0xd8d6cc, roughness: 0.6 });
      const mRedCloth = M({ color: 0x9a1418, roughness: 0.82, side: THREE.DoubleSide });
      const mCandle = M({ color: 0xf2eee2, roughness: 0.6, emissive: 0x2a1a08, emissiveIntensity: 0.4 });
      const mDarkRoom = M({ color: 0x0c0b0a, roughness: 1 });

      /* ---- the floor, the ceiling, the four walls (the door and the curtain cut from the foot of theirs, the windows
         holed) — each wall one ShapeGeometry whose UVs are its own metres, so the dado sits at a metre everywhere */
      const floor = flat(Wd, Dp, M({ map: tTile, roughness: 0.58 })); floor.rotation.x = -Math.PI / 2; floor.position.set(cx, 0, cz); floor.receiveShadow = true;
      const mCeil = M({ map: tCeil, roughness: 0.95, emissive: 0xffffff, emissiveMap: tCeil, emissiveIntensity: 0.32 }); room.ceilMat = mCeil;
      const ceil = flat(Wd, Dp, mCeil); ceil.rotation.x = Math.PI / 2; ceil.position.set(cx, H, cz);
      const wallGeo = (u0, u1, o) => {
        const s = new THREE.Shape(); s.moveTo(u0, 0);
        for (const n of (o.notch || [])) { s.lineTo(n[0], 0); s.lineTo(n[0], n[2]); s.lineTo(n[1], n[2]); s.lineTo(n[1], 0); }
        s.lineTo(u1, 0); s.lineTo(u1, H); s.lineTo(u0, H); s.lineTo(u0, 0);
        for (const h of (o.holes || [])) { const p = new THREE.Path(); p.moveTo(h[0], h[1]); p.lineTo(h[2], h[1]); p.lineTo(h[2], h[3]); p.lineTo(h[0], h[3]); p.lineTo(h[0], h[1]); s.holes.push(p); }
        return new THREE.ShapeGeometry(s);
      };
      const wBack = add(new THREE.Mesh(wallGeo(x0, x1, { notch: [[CURT.x0, CURT.x1, CURT.h]] }), mWall)); wBack.position.z = z0;
      const wFront = add(new THREE.Mesh(wallGeo(-x1, -x0, { notch: [[-ENTRY.x1, -ENTRY.x0, ENTRY.h]] }), mWall)); wFront.rotation.y = Math.PI; wFront.position.z = z1;
      const wLeft = add(new THREE.Mesh(wallGeo(-z1, -z0, { holes: [[-WINL.z1, WINL.y0, -WINL.z0, WINL.y1]] }), mWall)); wLeft.rotation.y = Math.PI / 2; wLeft.position.x = x0;
      const wRight = add(new THREE.Mesh(wallGeo(z0, z1, { holes: [[WINR.z0, WINR.y0, WINR.z1, WINR.y1]] }), mWall)); wRight.rotation.y = -Math.PI / 2; wRight.position.x = x1;
      for (const w of [wBack, wFront, wLeft, wRight]) w.receiveShadow = true;
      /* the walls' blockers: thick boxes behind each (the doorways too — he leaves by the door's hotspot, never on foot) */
      walls.push(hidBox(Wd + 1, H, 0.3, cx, H / 2, z0 - 0.15, R), hidBox(Wd + 1, H, 0.3, cx, H / 2, z1 + 0.15, R),
                 hidBox(0.3, H, Dp + 1, x0 - 0.15, H / 2, cz, R), hidBox(0.3, H, Dp + 1, x1 + 0.15, H / 2, cz, R));
      /* a stain where the roof has leaked over the bucket, and one under each window where the rain comes in */
      const tStainA = tex(makeStain(THREE, cnv, 4481)), tStainB = tex(makeStain(THREE, cnv, 4483));
      const stain = (t, w, h, op) => flat(w, h, B({ map: t, transparent: true, depthWrite: false, opacity: op }));
      { const s = stain(tStainA, 0.9, 0.9, 1); s.rotation.x = Math.PI / 2; s.position.set(2.2, H - 0.003, 1.6); }
      { const s = stain(tStainB, 0.9, 0.7, 1); s.rotation.y = Math.PI / 2; s.position.set(x0 + 0.003, 0.62, (WINL.z0 + WINL.z1) / 2); }

      /* ---- the louvred windows: the reveal, the sill, the frame, nine frosted slats open on their carriers, the
         grille, and outside them the painted storm and a sheet of rain on its own scroll (§7.1) */
      const tStormL = tex(makeStormView(THREE, cnv, 4491, false)), tStormR = tex(makeStormView(THREE, cnv, 4493, false));
      const window_ = (side, Wn, tStorm) => {
        const zc = (Wn.z0 + Wn.z1) / 2, zw = Wn.z1 - Wn.z0, yc = (Wn.y0 + Wn.y1) / 2, yh = Wn.y1 - Wn.y0;
        const xw = side < 0 ? x0 : x1, out = side < 0 ? -1 : 1;
        const G = new THREE.Group(); R.add(G);
        bx(0.18, 0.02, zw, mPaint, xw + out * 0.09, Wn.y1 + 0.01, zc, G);                    // the head's underside
        bx(0.18, yh, 0.02, mPaint, xw + out * 0.09, yc, Wn.z0 - 0.01, G);                    // the jambs
        bx(0.18, yh, 0.02, mPaint, xw + out * 0.09, yc, Wn.z1 + 0.01, G);
        bx(0.26, 0.045, zw + 0.1, mPaint, xw + out * 0.07, Wn.y0 - 0.02, zc, G);              // the sill, proud of the wall
        const fx = xw + out * 0.1;
        bx(0.05, 0.05, zw, mGreen, fx, Wn.y0 + 0.025, zc, G); bx(0.05, 0.05, zw, mGreen, fx, Wn.y1 - 0.025, zc, G);
        bx(0.05, yh, 0.05, mGreen, fx, yc, Wn.z0 + 0.025, G); bx(0.05, yh, 0.05, mGreen, fx, yc, Wn.z1 - 0.025, G);
        bx(0.04, yh - 0.1, 0.04, mGreen, fx, yc, zc, G);                                       // the mullion
        for (const zz of [Wn.z0 + 0.07, zc - 0.04, zc + 0.04, Wn.z1 - 0.07]) bx(0.012, yh - 0.1, 0.012, mSilver, fx - out * 0.02, yc, zz, G);   // the carriers
        const NS = 9, sg = new THREE.BoxGeometry(0.006, 0.122, (zw - 0.14) / 2 - 0.02);
        for (const half of [-1, 1]) for (let k = 0; k < NS; k++) {
          const s = new THREE.Mesh(sg, mFrost); s.position.set(fx - out * 0.01, Wn.y0 + 0.1 + k * (yh - 0.2) / (NS - 1), zc + half * ((zw - 0.14) / 4 + 0.03));
          s.rotation.z = out * 0.5; G.add(s);
        }
        /* the grille inside the glass: verticals and two flats (Thai lek dad, painted the frames' green) */
        const bars = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.008, 0.008, yh - 0.04, 6), mGreen, 12);
        const m4 = new THREE.Matrix4(); let n = 0;
        for (let k = 0; k < 12; k++) { m4.makeTranslation(xw - out * 0.02, yc, Wn.z0 + 0.06 + k * (zw - 0.12) / 11); bars.setMatrixAt(n++, m4); }
        bars.count = n; G.add(bars);
        for (const yy of [Wn.y0 + yh * 0.33, Wn.y0 + yh * 0.66]) bx(0.012, 0.03, zw - 0.04, mGreen, xw - out * 0.02, yy, zc, G);
        /* outside: the storm, painted, and its rain */
        const view = flat(4.6, 3.0, B({ map: tStorm, fog: false, toneMapped: false, color: 0x8a8a96 }), G);
        view.rotation.y = side < 0 ? Math.PI / 2 : -Math.PI / 2; view.position.set(xw + out * 1.6, 1.5, zc);
        room.views.push(view);
        const tRain = tex(makeRainSheet(THREE, cnv, 4501 + room.rains.length)); tRain.repeat.set(3, 1.6);
        const rain = flat(2.6, 1.8, B({ map: tRain, transparent: true, depthWrite: false, opacity: 0, color: 0xc8d4ec, fog: false }), G);
        rain.rotation.y = view.rotation.y; rain.position.set(xw + out * 0.55, 1.5, zc);
        room.rains.push(rain);
        /* the louvres' light on the floor when the lightning comes: blue bands, painted */
        const band = flat(1.1, zw, B({ map: tGlow, transparent: true, depthWrite: false, opacity: 0, color: 0x9ab0ff, blending: THREE.AdditiveBlending }), G);
        band.rotation.x = -Math.PI / 2; band.position.set(xw - out * 0.65, 0.006, zc);
        room.floorBands.push(band);
        return G;
      };
      window_(-1, WINL, tStormL); window_(1, WINR, tStormR);

      /* ---- the door he came in by: a teak frame, the panel door open against the wall, the threshold, and outside the
         yard in the storm under its eave (painted) */
      {
        const xc = (ENTRY.x0 + ENTRY.x1) / 2, w = ENTRY.x1 - ENTRY.x0;
        bx(0.07, ENTRY.h + 0.07, 0.2, mTeak, ENTRY.x0 - 0.035, (ENTRY.h + 0.07) / 2, z1 + 0.06);
        bx(0.07, ENTRY.h + 0.07, 0.2, mTeak, ENTRY.x1 + 0.035, (ENTRY.h + 0.07) / 2, z1 + 0.06);
        bx(w + 0.14, 0.07, 0.2, mTeak, xc, ENTRY.h + 0.035, z1 + 0.06);
        bx(w, 0.035, 0.22, mTeakD, xc, 0.0175, z1 + 0.05);
        const hinge = new THREE.Group(); hinge.position.set(ENTRY.x0 + 0.01, 0, z1 - 0.03); hinge.rotation.y = Math.PI - 0.16; R.add(hinge);
        const mDoor = M({ map: tDoor, roughness: 0.62 });
        bx(w - 0.02, ENTRY.h - 0.02, 0.04, mDoor, (w - 0.02) / 2, (ENTRY.h - 0.02) / 2, 0, hinge);
        for (const [py, ph] of [[0.5, 0.62], [1.45, 0.82]]) {
          bx(w - 0.24, ph, 0.012, mTeakD, (w - 0.02) / 2, py, 0.024, hinge);
          bx(w - 0.3, ph - 0.06, 0.014, mDoor, (w - 0.02) / 2, py, 0.028, hinge);
        }
        cyl(0.012, 0.012, 0.03, mBrass, w - 0.1, 1.0, 0.04, 10, hinge).rotation.x = Math.PI / 2;
        const tYard = tex(makeStormView(THREE, cnv, 4497, true));
        const v = flat(5.0, 3.2, B({ map: tYard, fog: false, toneMapped: false, color: 0x8a8a96 })); v.rotation.y = Math.PI; v.position.set(xc, 1.25, z1 + 2.4);
        room.views.push(v);
        const tRainD = tex(makeRainSheet(THREE, cnv, 4507)); tRainD.repeat.set(2.5, 1.6);
        const rd = flat(2.4, 2.6, B({ map: tRainD, transparent: true, depthWrite: false, opacity: 0, color: 0xc8d4ec, fog: false })); rd.rotation.y = Math.PI; rd.position.set(xc, 1.2, z1 + 0.8);
        room.rains.push(rd);
        const step = flat(1.6, 1.6, M({ color: 0x3a3632, roughness: 0.3, metalness: 0.1 })); step.rotation.x = -Math.PI / 2; step.position.set(xc, -0.16, z1 + 0.9);   // the wet step down
        bx(1.6, 0.16, 0.05, M({ color: 0x4a4440, roughness: 0.6 }), xc, -0.08, z1 + 0.12);
        const eave = flat(2.2, 1.4, mDarkRoom); eave.rotation.x = Math.PI / 2; eave.position.set(xc, ENTRY.h + 0.35, z1 + 0.75);   // the veranda roof over it
      }

      /* ---- the curtained doorway into the house: its frame, the dark passage behind, a plaque over it, and the
         curtain on its rod, drawn not quite across — she stands by it (§4.4) */
      {
        const xc = (CURT.x0 + CURT.x1) / 2, w = CURT.x1 - CURT.x0;
        bx(0.07, CURT.h + 0.07, 0.18, mTeak, CURT.x0 - 0.035, (CURT.h + 0.07) / 2, z0 - 0.05);
        bx(0.07, CURT.h + 0.07, 0.18, mTeak, CURT.x1 + 0.035, (CURT.h + 0.07) / 2, z0 - 0.05);
        bx(w + 0.14, 0.07, 0.18, mTeak, xc, CURT.h + 0.035, z0 - 0.05);
        const P = new THREE.Group(); P.position.set(xc, 0, z0 - 0.75); R.add(P);    // the passage: four dark faces and a far glimmer
        const pf = (ww, hh, rx, ry, px, py, pz) => { const o = flat(ww, hh, mDarkRoom, P); o.rotation.set(rx, ry, 0); o.position.set(px, py, pz); return o; };
        pf(w + 0.2, 1.4, -Math.PI / 2, 0, 0, 0.002, 0); pf(w + 0.2, 1.4, Math.PI / 2, 0, 0, CURT.h, 0);
        pf(1.4, CURT.h, 0, Math.PI / 2, -w / 2 - 0.1, CURT.h / 2, 0); pf(1.4, CURT.h, 0, -Math.PI / 2, w / 2 + 0.1, CURT.h / 2, 0);
        pf(w + 0.2, CURT.h, 0, 0, 0, CURT.h / 2, -0.7);
        const glim = flat(0.5, 1.2, B({ map: tGlow, transparent: true, depthWrite: false, opacity: 0.22, color: 0x6a5a40, blending: THREE.AdditiveBlending }), P);
        glim.position.set(0.2, 0.9, -0.69);
        cyl(0.01, 0.01, w + 0.18, mBrass, xc, CURT.h - 0.03, z0 + 0.03, 8).rotation.z = Math.PI / 2;
        const cw = 0.64, cg = new THREE.PlaneGeometry(cw, CURT.h - 0.06, 28, 1);
        const pos = cg.attributes.position;
        for (let i = 0; i < pos.count; i++) { const u = (pos.getX(i) + cw / 2) / cw; pos.setZ(i, 0.03 * Math.sin(u * Math.PI * 2 * 5.5)); }
        pos.needsUpdate = true; cg.computeVertexNormals();
        room.curtainBase = new Float32Array(pos.array);
        const cu = new THREE.Mesh(cg, M({ map: tCurt, roughness: 0.92, side: THREE.DoubleSide }));
        cu.position.set(CURT.x0 + cw / 2 + 0.01, (CURT.h - 0.06) / 2, z0 + 0.04); cu.castShadow = !LOW; R.add(cu);
        room.curtain = cu;
        const pl = flat(0.74, 0.185, B({ map: tex(makePlaque(THREE, cnv)) })); pl.position.set(xc, CURT.h + 0.3, z0 + 0.012);
        bx(0.78, 0.22, 0.02, mTeakD, xc, CURT.h + 0.3, z0 + 0.0);
      }

      /* ---- the master's platform: teak boards, a dark fascia, his cushion and the triangular pillow behind him, and
         what lives on it — the betel set, the palm-leaf books, the holy-water bowl, a flask, his mala in its dish */
      {
        const w = PLAT.x1 - PLAT.x0, d = PLAT.z1 - PLAT.z0, pxc = (PLAT.x0 + PLAT.x1) / 2, pzc = (PLAT.z0 + PLAT.z1) / 2;
        const top = bx(w, 0.05, d, [mTeak, mTeak, M({ map: tPlat, roughness: 0.58 }), mTeak, mTeak, mTeak], pxc, PLAT.top - 0.025, pzc);
        solids.push(top);
        bx(w, PLAT.top - 0.05, 0.04, mTeakD, pxc, (PLAT.top - 0.05) / 2, PLAT.z1 - 0.02);
        bx(0.04, PLAT.top - 0.05, d, mTeakD, PLAT.x0 + 0.02, (PLAT.top - 0.05) / 2, pzc);
        bx(0.04, PLAT.top - 0.05, d, mTeakD, PLAT.x1 - 0.02, (PLAT.top - 0.05) / 2, pzc);
        bx(w + 0.03, 0.02, 0.02, mTeak, pxc, PLAT.top - 0.06, PLAT.z1 + 0.005);        // the nosing
        const T0 = PLAT.top;
        bx(0.9, 0.05, 0.9, mGold, MASTER.x, T0 + 0.025, MASTER.z);
        bx(0.86, 0.075, 0.86, M({ color: 0x8a1a1c, roughness: 0.75 }), MASTER.x, T0 + 0.055, MASTER.z);
        /* the mon khwan: a triangular pillow, red with gold seams, against the wall behind him */
        const tri = new THREE.Shape(); tri.moveTo(0, 0); tri.lineTo(0.36, 0); tri.lineTo(0.04, 0.4); tri.lineTo(0, 0.4); tri.lineTo(0, 0);
        const tg = new THREE.ExtrudeGeometry(tri, { depth: 0.56, bevelEnabled: true, bevelThickness: 0.015, bevelSize: 0.015, bevelSegments: 2 });
        const pil = mesh(tg, M({ color: 0x9a1c1e, roughness: 0.7 }), -0.28, T0, PLAT.z0 + 0.04); pil.rotation.y = Math.PI / 2;
        const tray = lathe([[0, 0], [0.15, 0], [0.16, 0.025], [0.15, 0.03]], mBrass, 0.98, T0, -2.22, 24);
        for (const [ox, oz, hh] of [[-0.06, -0.05, 0.07], [0.05, -0.06, 0.05], [0.07, 0.05, 0.06], [-0.05, 0.06, 0.08]])
          lathe([[0, 0], [0.028, 0], [0.034, hh * 0.6], [0.022, hh], [0.026, hh + 0.008]], mBrass, 0.98 + ox, T0 + 0.025, -2.22 + oz, 14);
        void tray;
        const mCloth = M({ color: 0xb06a2c, roughness: 0.85 });
        bx(0.46, 0.055, 0.075, mCloth, -1.08, T0 + 0.028, -2.32).rotation.y = 0.12;
        bx(0.46, 0.055, 0.075, mCloth, -1.06, T0 + 0.083, -2.31).rotation.y = 0.06;
        bx(0.42, 0.05, 0.07, M({ color: 0x7a2a1e, roughness: 0.85 }), -1.0, T0 + 0.025, -2.18).rotation.y = -0.1;
        bx(0.006, 0.061, 0.08, mGold, -1.08, T0 + 0.03, -2.32).rotation.y = 0.12;
        lathe([[0, 0], [0.07, 0], [0.12, 0.05], [0.125, 0.07], [0.118, 0.072]], mSilver, -0.74, T0, -1.62, 24);
        const grass = M({ color: 0x5a8a3a, roughness: 0.8, side: THREE.DoubleSide });
        for (let k = 0; k < 5; k++) { const g = flat(0.012, 0.16, grass); g.position.set(-0.74 + (k - 2) * 0.012, T0 + 0.1, -1.62); g.rotation.set(0.3, k * 0.6, (k - 2) * 0.18); }
        cyl(0.055, 0.055, 0.28, M({ color: 0xb02828, roughness: 0.45 }), 1.12, T0 + 0.14, -1.68);
        cyl(0.04, 0.05, 0.05, mWhiteP, 1.12, T0 + 0.305, -1.68);
        lathe([[0, 0], [0.032, 0], [0.036, 0.09], [0.034, 0.095]], mGlass, 1.0, T0, -1.62, 14);
        lathe([[0, 0], [0.07, 0], [0.08, 0.012]], mBrass, 0.52, T0, -1.6, 20);
        const beads = new THREE.InstancedMesh(new THREE.SphereGeometry(0.0085, 8, 6), M({ color: 0x3a2014, roughness: 0.5 }), 54);
        for (let k = 0; k < 54; k++) { const a = k / 54 * Math.PI * 2; m4.makeTranslation(0.52 + Math.cos(a) * 0.05, T0 + 0.02, -1.6 + Math.sin(a) * 0.04); beads.setMatrixAt(k, m4); }
        R.add(beads);
      }

      /* ---- the low table at the platform's edge, and what is on it: the covered bowl (§4.4), the incense, the slate,
         his water, two candles in brass, the matches, the dish where the teacher's offering goes */
      {
        const w = LOWT.x1 - LOWT.x0, d = LOWT.z1 - LOWT.z0, tx = (LOWT.x0 + LOWT.x1) / 2, tz = (LOWT.z0 + LOWT.z1) / 2;
        const top = bx(w, 0.04, d, [mTeakD, mTeakD, M({ map: tTable, roughness: 0.5 }), mTeakD, mTeakD, mTeakD], tx, LOWT.top - 0.02, tz);
        solids.push(top);
        for (const [lx, lz] of [[LOWT.x0 + 0.05, LOWT.z0 + 0.05], [LOWT.x1 - 0.05, LOWT.z0 + 0.05], [LOWT.x0 + 0.05, LOWT.z1 - 0.05], [LOWT.x1 - 0.05, LOWT.z1 - 0.05]])
          bx(0.05, LOWT.top - 0.04, 0.05, mTeakD, lx, (LOWT.top - 0.04) / 2, lz);
        bx(w - 0.08, 0.06, 0.02, mTeakD, tx, LOWT.top - 0.07, LOWT.z1 - 0.03);
        bx(w - 0.08, 0.06, 0.02, mTeakD, tx, LOWT.top - 0.07, LOWT.z0 + 0.03);
        const T = LOWT.top;
        /* the covered bowl: a brass bowl on a footed tray (phan) under a red cloth that falls in folds to the tray */
        const BW = RMC.BOWL;
        lathe([[0, 0], [0.06, 0], [0.05, 0.03], [0.13, 0.045], [0.135, 0.06], [0.125, 0.062]], mBrass, BW.x, T, BW.z, 28);
        lathe([[0, 0], [0.06, 0], [0.1, 0.03], [0.115, 0.08], [0.11, 0.084]], mBrass, BW.x, T + 0.06, BW.z, 28);
        const cg = new THREE.PlaneGeometry(0.42, 0.42, 26, 26); cg.rotateX(-Math.PI / 2);
        const cp = cg.attributes.position, base = new Float32Array(cp.count * 3), wts = new Float32Array(cp.count);
        const RIM = 0.118, TOPY = 0.144;
        for (let i = 0; i < cp.count; i++) {
          const u = cp.getX(i), v = cp.getZ(i), r = Math.hypot(u, v), a = Math.atan2(v, u);
          let px, py, pz;
          if (r <= RIM) { py = TOPY + 0.016 * (1 - (r / RIM) ** 2); px = u; pz = v; wts[i] = 1 - (r / RIM) ** 2; }
          else {
            const s = r - RIM, fold = 0.012 * Math.min(1, s / 0.05) * Math.sin(a * 7 + 0.6), drop = Math.min(s, 0.075);
            const rr = RIM + 0.012 + s * 0.25 + fold + Math.max(0, s - 0.075) * 0.85;
            py = TOPY - drop * 0.95 - Math.max(0, s - 0.075) * 0.05; px = Math.cos(a) * rr; pz = Math.sin(a) * rr; wts[i] = 0;
            py = Math.max(py, 0.064);
          }
          base[i * 3] = px; base[i * 3 + 1] = py; base[i * 3 + 2] = pz;
        }
        cp.array.set(base); cp.needsUpdate = true; cg.computeVertexNormals();
        const cloth = new THREE.Mesh(cg, mRedCloth); cloth.position.set(BW.x, T, BW.z); cloth.castShadow = !LOW; R.add(cloth);
        room.cloth = cloth; room.clothBase = base; room.clothW = wts;
        /* the incense: a small brass cup of sand and three sticks; their tips glow */
        const IC = RMC.INC;
        lathe([[0, 0], [0.03, 0], [0.042, 0.04], [0.045, 0.05], [0.04, 0.052]], mBrass, IC.x, T, IC.z, 18);
        const stick = M({ color: 0x8a2a1a, roughness: 0.8 });
        for (let k = 0; k < 3; k++) {
          const s = cyl(0.0026, 0.0026, 0.24, stick, IC.x + (k - 1) * 0.008, T + 0.16, IC.z, 5); s.rotation.z = (k - 1) * 0.07;
          const tip = new THREE.Sprite(new THREE.SpriteMaterial({ map: tGlow, color: 0xff6a2a, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
          tip.scale.set(0.014, 0.014, 1); tip.position.set(IC.x + (k - 1) * 0.008 - Math.sin((k - 1) * 0.07) * 0.12, T + 0.28, IC.z); R.add(tip);
        }
        /* the slate, in its frame; the master writes his day on it (CP8 draws the word) */
        const sc = cnv(256)[0]; sc.height = 180;
        const sx = sc.getContext('2d'); sx.fillStyle = '#20262a'; sx.fillRect(0, 0, 256, 180);
        for (let i = 0; i < 300; i++) { sx.fillStyle = `rgba(200,210,214,${(Math.random() * 0.05).toFixed(3)})`; sx.fillRect(Math.random() * 256, Math.random() * 180, 2, 1); }
        const st = tex(done(THREE, sc, false)); room.slate = { canvas: sc, ctx: sx, tex: st };
        bx(0.25, 0.012, 0.18, mTeak, 0.21, T + 0.006, -1.25).rotation.y = -0.12;
        const sl = flat(0.22, 0.155, M({ map: st, roughness: 0.85 })); sl.rotation.set(-Math.PI / 2, 0, -0.12); sl.position.set(0.21, T + 0.0125, -1.25);
        bx(0.05, 0.008, 0.008, mWhiteP, 0.31, T + 0.016, -1.18);                                   // chalk
        /* his water: an enamel cup, white with a blue rim — it moves along the table at flash 2 */
        const cupG = new THREE.Group(); cupG.position.set(RMC.CUP[0].x, T, RMC.CUP[0].z); R.add(cupG);
        lathe([[0, 0], [0.034, 0], [0.038, 0.08], [0.04, 0.084]], mWhiteP, 0, 0, 0, 18, cupG);
        const rim = new THREE.Mesh(new THREE.TorusGeometry(0.039, 0.003, 6, 20), M({ color: 0x1e3c8a, roughness: 0.4 })); rim.rotation.x = Math.PI / 2; rim.position.y = 0.084; cupG.add(rim);
        const hd = new THREE.Mesh(new THREE.TorusGeometry(0.02, 0.004, 6, 12, Math.PI), mWhiteP); hd.position.set(0.04, 0.045, 0); hd.rotation.z = -Math.PI / 2; cupG.add(hd);
        const water = flat(0.07, 0.07, M({ color: 0x9ab0b8, roughness: 0.05, metalness: 0.2, transparent: true, opacity: 0.8 }), cupG); water.rotation.x = -Math.PI / 2; water.position.y = 0.07;
        room.cup = cupG;
        bx(0.05, 0.016, 0.035, M({ color: 0xc8a030, roughness: 0.6 }), 0.15, T + 0.008, -1.02).rotation.y = 0.3;     // the matches
        lathe([[0, 0], [0.05, 0], [0.062, 0.012], [0.058, 0.014]], mSilver, -0.06, T, -1.03, 22);                    // the offering dish
        for (const sx2 of [-0.42, 0.42]) {
          lathe([[0, 0], [0.045, 0], [0.04, 0.012], [0.012, 0.02], [0.01, 0.07], [0.025, 0.08], [0.022, 0.086]], mBrass, sx2, T, -1.3, 18);
          room.candles.push(candle(sx2, T + 0.086, -1.3, 0.16));
        }
      }

      /* ---- the altar shelf (a hing phra): three red-lacquered tiers stepping back up the wall, gold edges, gilt
         brackets, a valance; a gilded chedi on the top tier (no image until Chad's models land — the altar's offerings
         stand without them: E4-MODELS); candles, incense, water, fruit, marigolds, two jasmine garlands; ribbons on its
         ends that the wall fan's air takes (§4.4 — beside the smoke that does not go with it) */
      {
        const Z = z0;
        const tiers = [[0.9, 1.95, 0.26], [0.78, 2.17, 0.19], [0.66, 2.39, 0.12]];
        for (const [w, y, d] of tiers) { bx(w, 0.03, d, mLacq, 0, y, Z + d / 2); bx(w, 0.014, 0.012, mGold, 0, y + 0.002, Z + d - 0.004); }
        bx(0.92, 0.55, 0.012, mLacq, 0, 2.2, Z + 0.006);
        for (const [x, y] of [[-0.46, 2.2], [0.46, 2.2]]) bx(0.016, 0.57, 0.016, mGold, x, y, Z + 0.012);
        bx(0.94, 0.016, 0.016, mGold, 0, 2.48, Z + 0.012);
        for (const bxp of [-0.33, 0.33]) {
          const sh = new THREE.Shape(); sh.moveTo(0, 0); sh.lineTo(0.2, 0); sh.quadraticCurveTo(0.06, -0.04, 0, -0.2); sh.lineTo(0, 0);
          const br = mesh(new THREE.ExtrudeGeometry(sh, { depth: 0.024, bevelEnabled: false }), mGold, bxp - 0.012, 1.935, Z); br.rotation.y = -Math.PI / 2;
        }
        const val = flat(0.9, 0.11, B({ map: tex(makeValance(THREE, cnv)), transparent: true })); val.position.set(0, 1.88, Z + 0.262);
        /* tier 3: the chedi and two small brass bowls */
        lathe([[0, 0], [0.06, 0], [0.06, 0.02], [0.05, 0.02], [0.05, 0.035], [0.042, 0.035], [0.045, 0.06], [0.04, 0.1], [0.028, 0.12],
               [0.02, 0.125], [0.02, 0.135], [0.016, 0.135], [0.016, 0.145], [0.012, 0.15], [0.009, 0.2], [0.004, 0.25], [0, 0.26]], mGold, 0, 2.405, Z + 0.06, 20);
        for (const x of [-0.22, 0.22]) lathe([[0, 0], [0.02, 0], [0.034, 0.03], [0.036, 0.034]], mBrass, x, 2.405, Z + 0.06, 16);
        /* tier 2: vases of marigolds, glasses of water */
        const mari = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(0.018, 1), M({ color: 0xf08a1a, roughness: 0.8 }), 30);
        let mi = 0;
        for (const x of [-0.28, 0.28]) {
          lathe([[0, 0], [0.03, 0], [0.024, 0.02], [0.034, 0.07], [0.024, 0.11], [0.03, 0.12]], mBrass, x, 2.185, Z + 0.09, 16);
          for (let k = 0; k < 15; k++) { const a = k * 2.39, rr = 0.012 + (k % 5) * 0.009; m4.makeTranslation(x + Math.cos(a) * rr, 2.31 + (k % 3) * 0.018, Z + 0.09 + Math.sin(a) * rr); mari.setMatrixAt(mi++, m4); }
        }
        mari.count = mi; R.add(mari);
        for (const x of [-0.1, 0.1]) lathe([[0, 0], [0.018, 0], [0.02, 0.05], [0.021, 0.052]], mGlass, x, 2.185, Z + 0.09, 12);
        /* tier 1: the altar's incense, candles, a plate of bananas, a green coconut */
        lathe([[0, 0], [0.04, 0], [0.058, 0.04], [0.062, 0.06], [0.056, 0.064]], mBrass, 0, 1.965, Z + 0.15, 20);
        for (let k = 0; k < 5; k++) { const s = cyl(0.0018, 0.0018, 0.2, M({ color: 0xc23a1c, roughness: 0.8 }), (k - 2) * 0.012, 2.1, Z + 0.15, 5); s.rotation.z = (k - 2) * 0.05; }
        for (const x of [-0.38, 0.38]) {
          lathe([[0, 0], [0.025, 0], [0.008, 0.012], [0.007, 0.05], [0.016, 0.056]], mBrass, x, 1.965, Z + 0.15, 14);
          room.candles.push(candle(x, 2.021, Z + 0.15, 0.09));
        }
        lathe([[0, 0], [0.09, 0], [0.1, 0.012]], mSilver, -0.2, 1.965, Z + 0.15, 22);
        const ban = M({ color: 0xd8c040, roughness: 0.6 });
        for (let k = 0; k < 5; k++) {
          const curve = new THREE.QuadraticBezierCurve3(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0.05, 0.05, 0), new THREE.Vector3(0.1, 0.03, 0));
          const b = mesh(new THREE.TubeGeometry(curve, 8, 0.012, 6), ban, -0.27, 1.985 + k * 0.004, Z + 0.1 + k * 0.022); b.rotation.y = -0.3 + k * 0.05;
        }
        const coco = mesh(new THREE.SphereGeometry(0.06, 14, 10), M({ color: 0x6a9a3a, roughness: 0.55 }), 0.22, 2.025, Z + 0.15); coco.scale.set(1, 1.1, 1);
        /* the garlands: jasmine in a U from the tier's lip, a red tassel */
        const jas = new THREE.InstancedMesh(new THREE.SphereGeometry(0.008, 6, 5), M({ color: 0xf4f0e4, roughness: 0.7 }), 80);
        const ros = new THREE.InstancedMesh(new THREE.SphereGeometry(0.012, 6, 5), M({ color: 0xb4141c, roughness: 0.7 }), 16);
        let ji = 0, ri = 0;
        for (const gx of [-0.16, 0.16]) {
          for (let k = 0; k <= 26; k++) { const u = k / 26, px = gx + (u - 0.5) * 0.16, py = 1.95 - Math.sin(u * Math.PI) * 0.1; m4.makeTranslation(px, py, Z + 0.265); jas.setMatrixAt(ji++, m4); }
          for (let k = 0; k < 7; k++) { m4.makeTranslation(gx, 1.84 - k * 0.018, Z + 0.266); (k < 4 ? jas : ros).setMatrixAt(k < 4 ? ji++ : ri++, m4); }
          for (let k = 0; k < 4; k++) { m4.makeTranslation(gx + (k - 1.5) * 0.008, 1.76 - (k % 2) * 0.01, Z + 0.266); ros.setMatrixAt(ri++, m4); }
        }
        jas.count = ji; ros.count = ri; R.add(jas); R.add(ros);
        /* the ribbons on the shelf's ends: red, yellow, green; the fan's air takes them right */
        const ribC = [0xc81e24, 0xe8b020, 0x2a8a4a];
        for (const end of [-0.45, 0.45]) for (let k = 0; k < 3; k++) {
          const g = new THREE.PlaneGeometry(0.022, 0.3, 1, 6); g.translate(0, -0.15, 0);
          const rib = new THREE.Mesh(g, M({ color: ribC[k], roughness: 0.6, side: THREE.DoubleSide }));
          rib.position.set(end + (k - 1) * 0.024, 1.95, Z + 0.262); R.add(rib);
          room.ribbons.push({ m: rib, ph: k * 1.7 + end * 3, base: new Float32Array(g.attributes.position.array) });
        }
        /* the altar's own smoke rises and goes with the fan's air, to the right: the control beside the table's */
        room.smoke.push(smokePath([[0, 2.08, Z + 0.15], [0.01, 2.26, Z + 0.15], [0.09, 2.42, Z + 0.17], [0.26, 2.56, Z + 0.2], [0.5, 2.68, Z + 0.25], [0.78, 2.76, Z + 0.32]], 24, 5.8, 0.32));
      }

      /* ---- the table's smoke, which does not: it rises, turns against the fan and goes down to the cloth (§4.4, §7.6) */
      {
        const I = RMC.INC, BW = RMC.BOWL, T = LOWT.top;
        room.smoke.push(smokePath([[I.x, T + 0.29, I.z], [I.x - 0.005, T + 0.45, I.z + 0.004], [I.x - 0.05, T + 0.58, I.z + 0.04], [BW.x + 0.13, T + 0.6, BW.z - 0.04],
                                   [BW.x + 0.03, T + 0.44, BW.z - 0.01], [BW.x, T + 0.24, BW.z], [BW.x, T + 0.17, BW.z]], 30, 5.2, 0.36));
      }

      /* ---- the pendulum clock beside the altar: a teak case, a glass door, the dial at twenty to five, the pendulum
         (it stops at flash 3, §4.5) */
      {
        const xc = CLOCK.x, h = CLOCK.y1 - CLOCK.y0, yc = (CLOCK.y0 + CLOCK.y1) / 2, Z = z0;
        bx(0.26, h, 0.1, mTeak, xc, yc, Z + 0.05);
        const crest = new THREE.Shape(); crest.moveTo(-0.15, 0); crest.lineTo(0.15, 0); crest.lineTo(0.12, 0.05); crest.quadraticCurveTo(0, 0.13, -0.12, 0.05); crest.lineTo(-0.15, 0);
        mesh(new THREE.ExtrudeGeometry(crest, { depth: 0.11, bevelEnabled: false }), mTeakD, xc, CLOCK.y1, Z);
        bx(0.29, 0.03, 0.12, mTeakD, xc, CLOCK.y0 + 0.015, Z + 0.06);
        const dial = flat(0.17, 0.17, M({ map: tex(makeClockDial(THREE, cnv)), roughness: 0.5, transparent: true })); dial.position.set(xc, CLOCK.y1 - 0.13, Z + 0.101);
        const hm = M({ color: 0x1a1612, roughness: 0.5 });
        const hand = (len, wid) => { const g = new THREE.Group(); g.position.set(xc, CLOCK.y1 - 0.13, Z + 0.104); const b = new THREE.Mesh(new THREE.BoxGeometry(wid, len, 0.002), hm); b.position.y = len / 2 - 0.008; g.add(b); R.add(g); return g; };
        const hh = hand(0.045, 0.006), mh = hand(0.066, 0.004);
        hh.rotation.z = -((4 + 40 / 60) / 12) * Math.PI * 2; mh.rotation.z = -(40 / 60) * Math.PI * 2;
        room.hands = { hh, mh };
        const pend = new THREE.Group(); pend.position.set(xc, CLOCK.y1 - 0.25, Z + 0.07); R.add(pend);
        const rod = new THREE.Mesh(new THREE.BoxGeometry(0.006, 0.3, 0.004), mBrass); rod.position.y = -0.15; pend.add(rod);
        const bob = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.008, 22), mBrass); bob.rotation.x = Math.PI / 2; bob.position.y = -0.31; pend.add(bob);
        room.pendulum = pend;
        const gl = flat(0.22, h - 0.06, mGlass); gl.position.set(xc, yc, Z + 0.103);
        bx(0.22, 0.012, 0.004, mBrass, xc, CLOCK.y1 - 0.22, Z + 0.105);
      }

      /* ---- the wall fan, high on the back wall left of the altar: an old Hatari-style head on its bracket, three pale
         blades and the blur they make, a red ribbon on the guard streaming in its own air — the air goes right (+x) */
      {
        const P0 = new THREE.Vector3(-1.75, 2.28, z0 + 0.26);
        bx(0.05, 0.05, 0.22, mWhiteP, P0.x, P0.y + 0.02, z0 + 0.11);
        cyl(0.05, 0.06, 0.06, mWhiteP, P0.x, P0.y - 0.04, z0 + 0.24, 14);
        const head = new THREE.Group(); head.position.copy(P0); R.add(head);
        head.lookAt(P0.x + 1, P0.y - 0.28, P0.z + 0.62);
        const mFanBody = M({ color: 0xd4d2c8, roughness: 0.45 });
        const motor = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.07, 0.16, 16), mFanBody); motor.rotation.x = Math.PI / 2; motor.position.z = -0.1; head.add(motor);
        const ring = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.006, 6, 40), mSilver); head.add(ring);
        const ring2 = ring.clone(); ring2.position.z = -0.04; ring2.scale.setScalar(0.96); head.add(ring2);
        for (let k = 0; k < 12; k++) { const a = k / 12 * Math.PI * 2, sp = new THREE.Mesh(new THREE.CylinderGeometry(0.0022, 0.0022, 0.2, 4), mSilver); sp.position.set(Math.cos(a) * 0.1, Math.sin(a) * 0.1, 0.004); sp.rotation.z = a - Math.PI / 2; head.add(sp); }
        const badge = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.01, 16), M({ color: 0x2a4aa0, roughness: 0.4 })); badge.rotation.x = Math.PI / 2; badge.position.z = 0.012; head.add(badge);
        const blades = new THREE.Group(); blades.position.z = -0.02; head.add(blades);
        const mBlade = M({ color: 0xa8c8e0, roughness: 0.3, transparent: true, opacity: 0.85, side: THREE.DoubleSide });
        for (let k = 0; k < 3; k++) { const b = new THREE.Mesh(new THREE.CircleGeometry(0.1, 10, -0.5, 1.0), mBlade); b.position.set(0, 0, 0); b.rotation.z = k * Math.PI * 2 / 3; b.scale.set(1.7, 1, 1); blades.add(b); }
        room.fanBlades = blades;
        const blur = new THREE.Mesh(new THREE.CircleGeometry(0.18, 32), B({ map: tGlow, color: 0xbcd4e4, transparent: true, opacity: 0.18, depthWrite: false })); blur.position.z = -0.018; head.add(blur);
        room.fanBlur = blur;
        const rg = new THREE.PlaneGeometry(0.016, 0.26, 1, 8); rg.translate(0, -0.13, 0); rg.rotateX(-Math.PI / 2);
        const rb = new THREE.Mesh(rg, M({ color: 0xd01820, roughness: 0.6, side: THREE.DoubleSide })); rb.position.set(0.17, 0.08, 0.01); head.add(rb);
        room.fanRibbon = { m: rb, base: new Float32Array(rg.attributes.position.array) };
        /* its flex down the wall to a socket, in a conduit as old houses here run them */
        bx(0.018, 2.28 - 1.2, 0.012, mConduit, -1.6, (2.28 + 1.2) / 2, z0 + 0.008);
        bx(0.07, 0.11, 0.02, mWhiteP, -1.6, 1.15, z0 + 0.01);
      }

      /* ---- the fluorescent tube on its batten over the space between them, and its painted light; the ceiling fan that
         does not turn; the switch by the curtained door and the conduit up to both */
      {
        const ty = H, tz = -0.62;
        bx(1.26, 0.045, 0.075, mWhiteP, 0, ty - 0.0225, tz);
        const tubeM = B({ color: 0xeafff4 }); room.tubeMat = tubeM;
        cyl(0.013, 0.013, 1.18, tubeM, 0, ty - 0.062, tz, 10).rotation.z = Math.PI / 2;
        for (const e of [-0.6, 0.6]) cyl(0.018, 0.018, 0.03, M({ color: 0x8a8a84, roughness: 0.5 }), e, ty - 0.062, tz, 8).rotation.z = Math.PI / 2;
        const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: tGlow, color: 0xd8ffea, transparent: true, depthWrite: false, opacity: 0.42, blending: THREE.AdditiveBlending }));
        halo.scale.set(1.9, 0.42, 1); halo.position.set(0, ty - 0.07, tz); R.add(halo); room.tubeHalo = halo;
        const cg = flat(2.6, 1.4, B({ map: tGlow, color: 0xcff6e2, transparent: true, depthWrite: false, opacity: 0.3, blending: THREE.AdditiveBlending }));
        cg.rotation.x = Math.PI / 2; cg.position.set(0, ty - 0.004, tz); room.tubeCeil = cg;
        const fz = 0.55, mFan = M({ color: 0xd6c8b2, roughness: 0.55 });
        cyl(0.012, 0.012, 0.32, mWhiteP, 0, ty - 0.16, fz, 8);
        cyl(0.06, 0.06, 0.03, mWhiteP, 0, ty - 0.012, fz, 16);
        cyl(0.1, 0.085, 0.09, mFan, 0, ty - 0.36, fz, 18);
        for (let k = 0; k < 3; k++) {
          const a = k / 3 * Math.PI * 2 + 0.4, bl = bx(0.56, 0.008, 0.115, mFan, Math.cos(a) * 0.38, ty - 0.385, fz + Math.sin(a) * 0.38);
          bl.rotation.y = -a; bl.rotation.x = 0.1;
          bx(0.16, 0.01, 0.03, mSilver, Math.cos(a) * 0.12, ty - 0.38, fz + Math.sin(a) * 0.12).rotation.y = -a;
        }
        bx(0.08, 0.12, 0.022, mWhiteP, 1.5, 1.3, z0 + 0.011);
        for (const sx2 of [-0.016, 0.016]) bx(0.014, 0.024, 0.008, M({ color: 0x3a3a38, roughness: 0.5 }), 1.5 + sx2, 1.31, z0 + 0.025);
        bx(0.018, H - 1.36, 0.012, mConduit, 1.5, (H + 1.36) / 2, z0 + 0.008);
        bx(0.018, 0.012, Math.abs(tz - z0), mConduit, 1.5, H - 0.008, (tz + z0) / 2);
        bx(1.5 - 0.62, 0.012, 0.018, mConduit, (1.5 + 0.62) / 2, H - 0.008, tz);
      }

      /* ---- the glass cabinets of amulets on the side walls: teak carcass, a cupboard below, three glass shelves, red
         velvet boards of amulets behind them, and on the shelves takrut, bottles of oil, small wrapped bundles */
      const cabs = [];
      const cabinet = (side, zA, zB, seed) => {
        const xw = side < 0 ? x0 : x1, dep = 0.42, xc = xw - side * dep / 2, zl = zB - zA, zc = (zA + zB) / 2, Hc = 1.95;
        const G = new THREE.Group(); R.add(G);
        bx(dep, 0.06, zl, mTeakD, xc, 0.03, zc, G);
        bx(dep, 0.04, zl, mTeak, xc, Hc - 0.02, zc, G);
        bx(dep + 0.03, 0.035, zl + 0.04, mTeakD, xc - side * 0.015, Hc + 0.017, zc, G);
        for (const zz of [zA, zB]) bx(dep, Hc, 0.03, mTeak, xc, Hc / 2, zz + (zz === zA ? 0.015 : -0.015), G);
        bx(0.03, 0.7, zl - 0.06, mTeak, xc - side * (dep / 2 - 0.015), 0.38, zc, G);                        // the cupboard's doors
        bx(0.006, 0.6, 0.004, mTeakD, xc - side * (dep / 2 - 0.0), 0.38, zc, G);
        for (const zz of [zc - 0.06, zc + 0.06]) bx(0.02, 0.06, 0.012, mBrass, xc - side * (dep / 2 + 0.005), 0.45, zz, G);
        const board = flat(zl - 0.06, Hc - 0.84, M({ map: tex(makeAmuletBoard(THREE, cnv, seed)), roughness: 0.85 }), G);
        board.rotation.y = side < 0 ? Math.PI / 2 : -Math.PI / 2; board.position.set(xw - side * 0.02, 0.73 + (Hc - 0.84) / 2 + 0.02, zc);
        for (const yy of [0.74, 1.14, 1.54]) bx(dep - 0.06, 0.008, zl - 0.06, mGlass, xc + side * 0.01, yy, zc, G);
        const gf = flat(zl - 0.06, Hc - 0.8, mGlass, G); gf.rotation.y = board.rotation.y; gf.position.set(xc - side * (dep / 2 - 0.01), 0.72 + (Hc - 0.8) / 2, zc);
        bx(0.025, Hc - 0.8, 0.025, mTeak, xc - side * (dep / 2 - 0.012), 0.72 + (Hc - 0.8) / 2, zc, G);
        cabs.push({ side, xw, xc, dep, zA, zB, zc, zl, G });
        const body = hidBox(dep, Hc, zl, xc, Hc / 2, zc, R); solids.push(body);
      };
      cabinet(-1, -2.5, -1.15, 4511); cabinet(1, -1.6, -0.45, 4513);
      {
        const bottles = new THREE.InstancedMesh(new THREE.LatheGeometry([[0, 0], [0.016, 0], [0.017, 0.045], [0.008, 0.06], [0.007, 0.075], [0.009, 0.078]].map(q => new THREE.Vector2(q[0], q[1])), 10),
                                                M({ color: 0x9a5a18, roughness: 0.12, metalness: 0.1, transparent: true, opacity: 0.86 }), 24);
        const tak = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.006, 0.006, 0.07, 8), M({ color: 0xb88a4a, roughness: 0.3, metalness: 0.8 }), 40);
        const bun = new THREE.InstancedMesh(new THREE.BoxGeometry(0.06, 0.035, 0.04), M({ color: 0xd8c08a, roughness: 0.9 }), 12);
        const r = rng(4521); let nb = 0, nt = 0, nu = 0; const q = new THREE.Quaternion(), e = new THREE.Euler(), s1 = new THREE.Vector3(1, 1, 1), v = new THREE.Vector3();
        for (const cb of cabs) for (const yy of [0.748, 1.148, 1.548]) {
          let z = cb.zA + 0.07;
          while (z < cb.zB - 0.07) {
            const x = cb.xc + cb.side * 0.02 + (r() - 0.5) * 0.12, k = r();
            if (k < 0.34 && nb < 24) { m4.makeTranslation(x, yy, z); bottles.setMatrixAt(nb++, m4); z += 0.06; }
            else if (k < 0.82 && nt < 40) { e.set(0, r() * 0.6, Math.PI / 2); q.setFromEuler(e); m4.compose(v.set(x, yy + 0.006, z), q, s1); tak.setMatrixAt(nt++, m4); z += 0.03; }
            else if (nu < 12) { e.set(0, r(), 0); q.setFromEuler(e); m4.compose(v.set(x, yy + 0.018, z), q, s1); bun.setMatrixAt(nu++, m4); z += 0.08; }
            else z += 0.05;
          }
        }
        bottles.count = nb; tak.count = nt; bun.count = nu; R.add(bottles); R.add(tak); R.add(bun);
      }

      /* ---- the yant cloths on the wall either side of the altar, and the gold shop's calendar */
      {
        const hang = (kind, x, y) => {
          const c2 = flat(0.36, 0.48, M({ map: tex(makeYantCloth(THREE, cnv, kind)), roughness: 0.9, side: THREE.DoubleSide })); c2.position.set(x, y, z0 + 0.008);
          cyl(0.005, 0.005, 0.42, M({ color: 0x9a8a5a, roughness: 0.7 }), x, y + 0.245, z0 + 0.012, 6).rotation.z = Math.PI / 2;
          bx(0.002, 0.07, 0.002, M({ color: 0xd8d0b8, roughness: 0.8 }), x - 0.12, y + 0.28, z0 + 0.012).rotation.z = 0.8;
          bx(0.002, 0.07, 0.002, M({ color: 0xd8d0b8, roughness: 0.8 }), x + 0.12, y + 0.28, z0 + 0.012).rotation.z = -0.8;
        };
        hang('grid', -1.12, 1.62); hang('wheel', 1.22, 1.62);
        const cal = flat(0.36, 0.59, M({ map: tex(makeGoldCalendar(THREE, cnv)), roughness: 0.75 })); cal.position.set(-2.2, 1.5, z0 + 0.006);
      }

      /* ---- along the walls: the fridge by the door with a kettle on it; a bench under the left window; red plastic
         stools stacked in the corner; a bucket under the leak (it drips in the storm); the client's mat and the one the
         translator kneels on */
      {
        const F = { x: 1.62, z: 1.7 };
        const fr = bx(0.56, 0.86, 0.56, mCream, F.x, 0.43, F.z); solids.push(fr);
        bx(0.004, 0.8, 0.5, M({ color: 0x8a8678, roughness: 0.5 }), F.x - 0.282, 0.43, F.z - 0.0);
        bx(0.02, 0.22, 0.03, mSilver, F.x - 0.29, 0.6, F.z - 0.2);
        bx(0.2, 0.04, 0.004, mSilver, F.x - 0.283, 0.8, F.z + 0.1).rotation.y = Math.PI / 2;
        lathe([[0, 0], [0.075, 0], [0.085, 0.13], [0.07, 0.17], [0.04, 0.19], [0.04, 0.2]], mSilver, F.x + 0.06, 0.86, F.z - 0.02, 18);
        bx(0.012, 0.08, 0.012, mSilver, F.x - 0.04, 0.98, F.z - 0.02).rotation.z = 0.7;
        for (const ox of [-0.16, -0.08]) lathe([[0, 0], [0.026, 0], [0.03, 0.09], [0.031, 0.092]], mGlass, F.x + ox, 0.86, F.z + 0.12, 12);
        cyl(0.07, 0.07, 0.1, M({ color: 0xa81a1a, roughness: 0.35, metalness: 0.4 }), F.x + 0.12, 0.91, F.z + 0.15, 18);
        const bench = bx(0.36, 0.045, 1.2, M({ map: tex(makePlanks(THREE, cnv, 4531)), roughness: 0.62 }), x0 + 0.24, 0.42, 0.2); solids.push(bench);
        for (const [lx, lz] of [[x0 + 0.1, -0.35], [x0 + 0.38, -0.35], [x0 + 0.1, 0.75], [x0 + 0.38, 0.75]]) bx(0.04, 0.4, 0.04, mTeakD, lx, 0.2, lz);
        bx(0.3, 0.12, 0.22, M({ color: 0x3a5a7a, roughness: 0.9 }), x0 + 0.24, 0.5, 0.45).rotation.y = 0.2;
        const mRed = M({ color: 0xc41c1c, roughness: 0.48 });
        const stool = lathe([[0, 0], [0.17, 0], [0.165, 0.005], [0.145, 0.29], [0.155, 0.3], [0.15, 0.31], [0, 0.31]], mRed, -2.28, 0, 1.62, 22);
        for (let k = 1; k < 4; k++) lathe([[0, 0], [0.17, 0], [0.165, 0.005], [0.145, 0.29], [0.155, 0.3], [0.15, 0.31], [0, 0.31]], mRed, -2.28, k * 0.055, 1.62, 22);
        solids.push(hidBox(0.36, 0.5, 0.36, -2.28, 0.25, 1.62, R));
        const bk = lathe([[0, 0], [0.13, 0], [0.155, 0.3], [0.16, 0.31], [0.15, 0.31], [0.125, 0.012]], M({ color: 0x2a6ab4, roughness: 0.4, side: THREE.DoubleSide }), 2.22, 0, 1.58, 22);
        void bk;
        const wtr = new THREE.Mesh(new THREE.CircleGeometry(0.14, 22), M({ color: 0x4a5a6a, roughness: 0.04, metalness: 0.3 })); wtr.rotation.x = -Math.PI / 2; wtr.position.set(2.22, 0.18, 1.58); R.add(wtr);
        solids.push(hidBox(0.34, 0.4, 0.34, 2.22, 0.2, 1.58, R));
        const drip = new THREE.Mesh(new THREE.SphereGeometry(0.006, 6, 5), M({ color: 0xbcd0e0, roughness: 0.05, transparent: true, opacity: 0.8 }));
        drip.position.set(2.22, H - 0.01, 1.58); drip.visible = false; R.add(drip); room.drip = drip;
        const rip = new THREE.Mesh(new THREE.RingGeometry(0.01, 0.014, 20), B({ color: 0xd8e4f0, transparent: true, opacity: 0, depthWrite: false })); rip.rotation.x = -Math.PI / 2; rip.position.set(2.22, 0.182, 1.58); R.add(rip); room.ripple = rip;
        const mat = flat(0.9, 1.3, M({ map: tMat, roughness: 0.9 })); mat.rotation.x = -Math.PI / 2; mat.position.set(CMAT.x, 0.004, CMAT.z); mat.receiveShadow = true;
        const mat2 = flat(0.72, 1.12, M({ map: tMat2, roughness: 0.9 })); mat2.rotation.set(-Math.PI / 2, 0, 0.12); mat2.position.set(-0.98, 0.004, -0.2); mat2.receiveShadow = true;
      }

      /* ---- the painted candlelight: a pool on the table, a wash on the wall behind him (where his shadow will be, §7.4) */
      {
        const pool = flat(1.1, 0.6, B({ map: tGlow, color: 0xffa250, transparent: true, depthWrite: false, opacity: 0.2, blending: THREE.AdditiveBlending }));
        pool.rotation.x = -Math.PI / 2; pool.position.set(0, LOWT.top + 0.002, -1.18); room.pools.push(pool);
        const wash = flat(2.4, 1.7, B({ map: tGlow, color: 0xff9a48, transparent: true, depthWrite: false, opacity: 0.1, blending: THREE.AdditiveBlending }));
        wash.position.set(0, 1.35, z0 + 0.01); room.wash = wash;
      }
    }

    /* a candle: wax, wick, a flame (a sprite pivoting on the wick, leaned by the fan's air in the frame) and its glow */
    function candle(x, y, z, h) {
      const R = worldR;
      const wax = new THREE.Mesh(new THREE.CylinderGeometry(0.011, 0.012, h, 12), room._wax || (room._wax = M({ color: 0xf2eee2, roughness: 0.6, emissive: 0x3a240e, emissiveIntensity: 0.35 })));
      wax.position.set(x, y + h / 2, z); R.add(wax);
      const fl = new THREE.Sprite(new THREE.SpriteMaterial({ map: room._flameT || (room._flameT = tex(makeFlame(THREE, cnv))), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0 }));
      fl.center.set(0.5, 0.06); fl.scale.set(0.024, 0.05, 1); fl.position.set(x, y + h + 0.004, z); R.add(fl);
      const gl = new THREE.Sprite(new THREE.SpriteMaterial({ map: room._glowT || (room._glowT = tex(makeGlow(THREE, cnv))), color: 0xffa456, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0 }));
      gl.scale.set(0.3, 0.3, 1); gl.position.set(x, y + h + 0.025, z); R.add(gl);
      return { x, y: y + h, z, fl, gl, ph: Math.random() * 10 };
    }
    /* a smoke column: puffs carried along a path, growing and thinning, each on its own phase — ONE draw a column (a
       point each, sized in metres by the lens; a sprite a puff was fifty draws for two thin columns) */
    function smokePath(pts, n, secs, op) {
      const curve = new THREE.CatmullRomCurve3(pts.map(p => new THREE.Vector3(p[0], p[1], p[2])));
      const puffT = room._puffT || (room._puffT = tex(makePuff(THREE, cnv)));
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(n * 3), 3));
      g.setAttribute('aA', new THREE.BufferAttribute(new Float32Array(n), 1));
      g.setAttribute('aS', new THREE.BufferAttribute(new Float32Array(n), 1));
      g.setAttribute('aR', new THREE.BufferAttribute(new Float32Array(n), 1));
      const mat = new THREE.ShaderMaterial({
        uniforms: { map: { value: puffT }, uScale: { value: 500 }, uColor: { value: new THREE.Color(0xd8d8d4) } },
        vertexShader: 'attribute float aA; attribute float aS; attribute float aR; varying float vA; varying float vR; uniform float uScale;\n' +
          'void main() { vA = aA; vR = aR; vec4 mv = modelViewMatrix * vec4(position, 1.0); gl_PointSize = aS * uScale / max(0.05, -mv.z); gl_Position = projectionMatrix * mv; }',
        fragmentShader: 'uniform sampler2D map; uniform vec3 uColor; varying float vA; varying float vR;\n' +
          'void main() { vec2 p = gl_PointCoord - 0.5; float c = cos(vR), s = sin(vR); vec2 q = vec2(c * p.x - s * p.y, s * p.x + c * p.y) + 0.5;\n' +
          '  vec4 t = texture2D(map, q); gl_FragColor = vec4(uColor * t.rgb, t.a * vA);\n#include <colorspace_fragment>\n}',
        transparent: true, depthWrite: false
      });
      mats.push(mat);
      const pp = new THREE.Points(g, mat); pp.frustumCulled = false; pp.userData.dyn = true; worldR.add(pp);
      const list = [];
      for (let i = 0; i < n; i++) list.push({ ph: i / n + Math.random() * 0.4 / n, rot: Math.random() * 6 });
      return { curve, list, secs, op, g, mat };
    }
    buildRoom();
    /* what moves in the room is never merged (the cup, the clock's pendulum and hands, the fan's blades and ribbons,
       the curtain, the cloth, the storm's planes, the drip) */
    for (const o of [room.cup, room.pendulum, room.hands.hh, room.hands.mh, room.fanBlades, room.fanRibbon.m, room.curtain, room.cloth,
                     room.drip, room.ripple, ...room.ribbons.map(r => r.m), ...room.views, ...room.rains, ...room.floorBands]) if (o) o.userData.dyn = true;
    mergeStatic(worldR, new Set([...walls, ...solids]));

    /* ONE DRAW A MATERIAL (CP4): a room built of a few hundred small boxes and lathes asks the GPU for a few hundred
       draws, and a phone pays for each one. Every mesh that never moves is baked, by its own matrix, into one geometry
       per material it shares (the room's 31 materials), so the measured 250–380 draws a frame become a few dozen. The
       light, the maps and every vertex are the same; what moves (`userData.dyn`, or under a parent that does), what is
       a blocker (its box is read from the mesh), a skinned or instanced mesh and a mesh of several materials are left
       as they are. */
    function mergeStatic(root, skip) {
      root.updateMatrixWorld(true);
      const inv = new THREE.Matrix4().copy(root.matrixWorld).invert();
      const byMat = new Map();
      root.traverse(o => {
        if (!o.isMesh || o.isInstancedMesh || o.isSkinnedMesh || !o.visible || skip.has(o) || Array.isArray(o.material)) return;
        for (let q = o; q && q !== root; q = q.parent) if (q.userData.dyn) return;
        const g = o.geometry;
        if (!g.attributes.position || !g.attributes.normal || !g.attributes.uv) return;
        if (!byMat.has(o.material)) byMat.set(o.material, []);
        byMat.get(o.material).push(o);
      });
      const m = new THREE.Matrix4(), nm = new THREE.Matrix3(), v = new THREE.Vector3();
      let merged = 0, made = 0;
      for (const [mat, list] of byMat) {
        if (list.length < 2) continue;
        let nv = 0, ni = 0;
        for (const o of list) { const g = o.geometry; nv += g.attributes.position.count; ni += g.index ? g.index.count : g.attributes.position.count; }
        const P = new Float32Array(nv * 3), N = new Float32Array(nv * 3), U = new Float32Array(nv * 2), I = nv > 65535 ? new Uint32Array(ni) : new Uint16Array(ni);
        let vo = 0, io = 0, cast = false, recv = false;
        for (const o of list) {
          const g = o.geometry, pa = g.attributes.position, na = g.attributes.normal, ua = g.attributes.uv;
          m.multiplyMatrices(inv, o.matrixWorld); nm.getNormalMatrix(m);
          for (let i = 0; i < pa.count; i++) {
            v.fromBufferAttribute(pa, i).applyMatrix4(m); P[(vo + i) * 3] = v.x; P[(vo + i) * 3 + 1] = v.y; P[(vo + i) * 3 + 2] = v.z;
            v.fromBufferAttribute(na, i).applyMatrix3(nm).normalize(); N[(vo + i) * 3] = v.x; N[(vo + i) * 3 + 1] = v.y; N[(vo + i) * 3 + 2] = v.z;
            U[(vo + i) * 2] = ua.getX(i); U[(vo + i) * 2 + 1] = ua.getY(i);
          }
          if (g.index) for (let i = 0; i < g.index.count; i++) I[io++] = g.index.getX(i) + vo;
          else for (let i = 0; i < pa.count; i++) I[io++] = i + vo;
          vo += pa.count; cast = cast || o.castShadow; recv = recv || o.receiveShadow;
        }
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(P, 3)); geo.setAttribute('normal', new THREE.BufferAttribute(N, 3));
        geo.setAttribute('uv', new THREE.BufferAttribute(U, 2)); geo.setIndex(new THREE.BufferAttribute(I, 1)); geo.computeBoundingSphere();
        const mm = new THREE.Mesh(geo, mat); mm.castShadow = cast; mm.receiveShadow = recv; mm.name = 'merged'; root.add(mm);
        for (const o of list) { o.parent.remove(o); o.geometry.dispose(); }
        merged += list.length; made++;
      }
      return { merged, made };
    }

    /* ------------------------------------------------- the room, alive (CP4) — it runs in the films as well as in play
       (updateNotes calls it before its play-only gate), and only while the lens is in World R */
    const _rv = new THREE.Vector3(), _rv2 = new THREE.Vector3();
    const roomCtl = {
      /* the tube: on, or dying — a tick, a buzz, three stutters, out (§4.5's lead-in) */
      tube(on, die) { room.tubeTo = on ? 1 : 0; room.tubeDie = !on && die ? wallNow() : 0; if (on) room.tubeDie = 0; },
      candles(on, secs = 0.8) { room.candleTo = on ? 1 : 0; room.candleSecs = Math.max(0.01, secs); },
      rain(k, secs = 2) { room.rainFrom = room.rainK; room.rainTo = Math.max(0, Math.min(1, k)); room.rainT0 = wallNow(); room.rainSecs = Math.max(0.01, secs); },
      breathe() { room.breathT = wallNow(); },
      cup(i) { room.cupAt = i ? 1 : 0; const c = RMC.CUP[room.cupAt]; room.cup.position.set(c.x, RMC.LOWT.top, c.z); },
      /* the cloth lies differently (flash 3): turned half a fold and slid off the bowl's centre, so the brass rim shows
         on one side and the hem hangs lower on the other */
      clothShift(on) { if (!room.cloth) return; room.cloth.rotation.y = on ? 0.45 : 0; room.cloth.position.x = RMC.BOWL.x + (on ? 0.028 : 0); room.cloth.position.z = RMC.BOWL.z + (on ? -0.012 : 0); },
      clock(run) { room.clockRun = !!run; },
      smoke(which, on) { const sp = room.smoke[which === 'altar' ? 0 : 1]; if (sp) sp.on = !!on; },
      fan(on) { room.fanOn = !!on; }
    };
    room.smoke.forEach(sp => { sp.on = true; });
    room.candleK = 0; room.candleTo = 0; room.candleSecs = 0.8; room.rainFrom = 0; room.rainT0 = 0; room.rainSecs = 1; room.fanSpeed = 1;
    function roomFrame(now) {
      if (worldOf(yaw.position.x) !== 'R') { room.last = 0; return; }
      const dt = room.last ? Math.min(0.1, Math.max(0, now - room.last)) : 0; room.last = now;
      const fl = kit && kit.flashNow ? kit.flashNow() : 0;
      /* the tube */
      let tk = room.tubeTo;
      if (room.tubeDie) {
        const e = now - room.tubeDie;
        tk = e > 1.7 ? 0 : (e < 0.12 || (e > 0.3 && e < 0.42) || (e > 0.66 && e < 0.74) || (e > 1.02 && e < 1.06)) ? 0.15 : e > 1.3 ? 0.45 * (1 - (e - 1.3) / 0.4) : 1;
      }
      room.tubeK = tk;
      if (room.tubeMat) room.tubeMat.color.setRGB(0.12 + 0.8 * tk, 0.13 + 0.87 * tk, 0.13 + 0.83 * tk);
      if (room.tubeHalo) room.tubeHalo.material.opacity = 0.42 * tk;
      if (room.tubeCeil) room.tubeCeil.material.opacity = 0.3 * tk;
      /* the wall fan runs on the same power: it spins down when the tube dies */
      const want = room.fanOn && tk > 0.3 ? 1 : room.fanOn && room.tubeTo > 0 ? 1 : 0;
      room.fanSpeed += (want - room.fanSpeed) * Math.min(1, dt * (want ? 2.5 : 0.6));
      const fs = room.fanSpeed;
      if (room.fanBlades) { room.fanBlades.rotation.z += dt * 26 * fs; room.fanBlur.material.opacity = 0.2 * fs; }
      const t = now;
      if (room.fanRibbon) {
        const g = room.fanRibbon.m.geometry, P = g.attributes.position, b = room.fanRibbon.base;
        for (let i = 0; i < P.count; i++) {
          const z = b[i * 3 + 2], s = Math.max(0, z) / 0.26;
          P.setXYZ(i, b[i * 3] + fs * 0.02 * s * Math.sin(t * 17 + s * 9), b[i * 3 + 1] - (1 - fs) * 0.26 * s + fs * 0.016 * s * Math.sin(t * 13 + s * 7), z * (fs * 0.92 + (1 - fs) * 0.15));
        }
        P.needsUpdate = true;
      }
      /* the altar's ribbons: hung straight when the fan is still, taken right (+x) when it runs */
      for (const rb of room.ribbons) {
        const P = rb.m.geometry.attributes.position, b = rb.base;
        for (let i = 0; i < P.count; i++) {
          const y = b[i * 3 + 1], s = -y / 0.3;
          P.setXYZ(i, b[i * 3] + fs * (0.07 * s * s + 0.018 * s * Math.sin(t * 9 + rb.ph + s * 8)), y + fs * 0.025 * s * s, b[i * 3 + 2] + fs * 0.012 * s * Math.sin(t * 7 + rb.ph));
        }
        P.needsUpdate = true;
      }
      /* the curtain stirs in the same air */
      if (room.curtain) {
        const P = room.curtain.geometry.attributes.position, b = room.curtainBase, hh = (RMC.CURT.h - 0.06) / 2;
        for (let i = 0; i < P.count; i++) { const lo = (hh - b[i * 3 + 1]) / (2 * hh); P.setZ(i, b[i * 3 + 2] + fs * 0.018 * lo * Math.sin(t * 2.1 + b[i * 3] * 9)); }
        P.needsUpdate = true;
      }
      /* the candles: lit by the master (CP8), flames leaned by the fan in screen space, glows stronger when the tube is out */
      room.candleK += (room.candleTo - room.candleK) * Math.min(1, dt / room.candleSecs * 3);
      const ck = room.candleK, dark = 1 - tk;
      camera.updateMatrixWorld();
      for (const c of room.candles) {
        const fk = ck * (0.86 + 0.14 * Math.sin(t * 23 + c.ph) * Math.sin(t * 7.3 + c.ph * 2));
        c.fl.material.opacity = fk; c.gl.material.opacity = ck * (0.22 + 0.5 * dark) * (0.9 + 0.1 * Math.sin(t * 11 + c.ph));
        c.gl.scale.setScalar(0.26 + 0.24 * dark);
        c.fl.scale.set(0.022 + 0.004 * Math.sin(t * 17 + c.ph), 0.048 + 0.008 * Math.sin(t * 13 + c.ph), 1);
        const lean = fs * (0.32 + 0.14 * Math.sin(t * 6 + c.ph)) + 0.04 * Math.sin(t * 19 + c.ph);
        _rv.set(c.x + RX, c.y, c.z).project(camera); _rv2.set(c.x + RX + lean * 0.05, c.y + 0.05, c.z).project(camera);
        const ax = (_rv2.x - _rv.x) * innerWidth, ay = (_rv2.y - _rv.y) * innerHeight;
        c.fl.material.rotation = -Math.atan2(ax, ay);
      }
      for (const pl of room.pools) pl.material.opacity = ck * (0.12 + 0.35 * dark);
      if (room.wash) room.wash.material.opacity = ck * (0.05 + 0.4 * dark) + fl * 0.0;
      /* the clock (the pendulum stops at flash 3, §4.5) */
      if (room.clockRun) room.clockT += dt;
      if (room.pendulum) room.pendulum.rotation.z = room.clockRun ? 0.16 * Math.sin(room.clockT * Math.PI * 2 / 1.5) : room.pendulum.rotation.z * Math.max(0, 1 - dt * 3);
      if (room.hands) { const m = 40 + room.clockT / 60; room.hands.mh.rotation.z = -(m / 60) * Math.PI * 2; room.hands.hh.rotation.z = -((4 + m / 60) / 12) * Math.PI * 2; }
      /* the cloth's one breath: up over 0.9 s, down over 1.4 s */
      if (room.breathT > 0 && room.cloth) {
        const e = now - room.breathT, k = e < 0.9 ? Math.sin(e / 0.9 * Math.PI / 2) : e < 2.3 ? Math.cos((e - 0.9) / 1.4 * Math.PI / 2) : 0;
        const P = room.cloth.geometry.attributes.position, b = room.clothBase, w = room.clothW;
        for (let i = 0; i < P.count; i++) P.setY(i, b[i * 3 + 1] + k * (0.022 * w[i] + (w[i] === 0 ? 0.004 * Math.max(0, 1 - (Math.hypot(b[i * 3], b[i * 3 + 2]) - 0.118) / 0.06) : 0)));
        P.needsUpdate = true;
        if (e >= 2.3) { room.breathT = -1; P.array.set(b); P.needsUpdate = true; }
        room.cloth.geometry.computeVertexNormals();
      }
      /* the smoke: puffs along their paths, growing and thinning */
      const pxScale = Math.min(devicePixelRatio || 1, LOW ? 1.6 : 2) * innerHeight / (2 * Math.tan(camera.fov * Math.PI / 360));
      for (const sp of room.smoke) {
        const P = sp.g.attributes.position, A = sp.g.attributes.aA, Sz = sp.g.attributes.aS, Ro = sp.g.attributes.aR;
        sp.mat.uniforms.uScale.value = pxScale;
        sp.list.forEach((p, i) => {
          if (!sp.on) { A.setX(i, 0); return; }
          const u = ((t / sp.secs) + p.ph) % 1;
          sp.curve.getPointAt(u, _rv);
          P.setXYZ(i, _rv.x + 0.008 * Math.sin(t * 1.7 + p.ph * 20) * u, _rv.y, _rv.z);
          Sz.setX(i, 0.025 + u * 0.1);
          A.setX(i, sp.op * Math.pow(Math.sin(Math.PI * Math.min(1, u * 1.15)), 0.9) * (1 - u * 0.5));
          Ro.setX(i, p.rot + t * 0.2 * (p.ph - 0.5));
        });
        P.needsUpdate = A.needsUpdate = Sz.needsUpdate = Ro.needsUpdate = true;
      }
      /* the storm outside: the rain on its scroll, the painted sky lit by the lightning, its light on the floor */
      if (room.rainT0) { const u = Math.min(1, (now - room.rainT0) / room.rainSecs); room.rainK = room.rainFrom + (room.rainTo - room.rainFrom) * u * u * (3 - 2 * u); }
      for (const rn of room.rains) { rn.material.opacity = room.rainK * 0.55; if (rn.material.map) rn.material.map.offset.y += dt * (1.6 + 1.4 * room.rainK); }
      const vb = 0.27 + 1.9 * fl;
      for (const v of room.views) v.material.color.setRGB(vb, vb, vb * 1.08);
      for (const bd of room.floorBands) bd.material.opacity = Math.min(0.7, fl * 0.55);
      /* the leak over the bucket, in the storm */
      if (room.drip) {
        if (room.rainK > 0.4) {
          room.dripT += dt;
          const per = 1.35, e = room.dripT % per, fall = 0.74;
          room.drip.visible = e < fall;
          if (e < fall) room.drip.position.y = RM.H - 0.01 - 0.5 * 9.8 * e * e * ((RM.H - 0.19) / (0.5 * 9.8 * fall * fall));
          const re = e - fall;
          room.ripple.material.opacity = re > 0 && re < 0.55 ? 0.6 * (1 - re / 0.55) : 0;
          room.ripple.scale.setScalar(1 + (re > 0 ? re * 9 : 0));
        } else { room.drip.visible = false; room.ripple.material.opacity = 0; }
      }
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
      if (w === 'R') { yaw.position.x = R_ARRIVE.x; yaw.position.z = R_ARRIVE.z; yaw.rotation.y = R_ARRIVE.ry; pitch.rotation.x = -0.12; }
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
      roomFrame(now);
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
      look, presets: PRESETS, dome: domeLive, worldOf, room: roomCtl, rmc: RMC, roomState: room,
      info: () => ({ phase, t: +dayClock.t.toFixed(2), queued: lineQ.length, heard: [...heard], world: worldOf(yaw.position.x),
                     until: +speak.until.toFixed(2), pending: speak.pending ? speak.pending.name : null, decOpen }),
      hotspots,
      updateNotes, updatePile, updateFire, updateSlow,
      snap, restore, reset, dispose
    });
  }

  /* ====================================================== THE ROOM'S DRAWN SURFACES (CP4)
     Every sheet here is drawn on a canvas (CSP-safe, no download), and each is this chapter's own (FRESH, §3.2): an old
     receiving room in the rice country, nothing of a flat in Singapore or a shop in Golden Mile. The words on them are
     world art (the jetty sign's precedent, v14.5): a calendar says what is printed on it. */
  const THAI_FONT = 'Loma, "Noto Sans Thai", "Sarabun", Tahoma, "Leelawadee UI", sans-serif';
  function rng(seed) { let s = seed >>> 0 || 1; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
  function done(THREE, c, rep) {
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
    if (rep) { t.wrapS = t.wrapT = THREE.RepeatWrapping; }
    return t;
  }
  function sized(cnv, W, H) { const [c, x] = cnv(W); c.height = H; return [c, x]; }
  function speckle(x, W, H, r, n, rgb, a0, a1, s0 = 1, s1 = 2) {
    for (let i = 0; i < n; i++) {
      const s = s0 + r() * (s1 - s0);
      x.fillStyle = `rgba(${rgb},${(a0 + r() * (a1 - a0)).toFixed(3)})`; x.fillRect(r() * W, r() * H, s, s);
    }
  }
  /* a soft blob drawn three times across the sheet's width, so a sheet that repeats along u never shows a seam */
  function blobWrapped(x, W, px, py, rr, inner, outer = 'rgba(0,0,0,0)') {
    for (const ox of [-W, 0, W]) {
      const g = x.createRadialGradient(px + ox, py, 0, px + ox, py, rr); g.addColorStop(0, inner); g.addColorStop(1, outer);
      x.fillStyle = g; x.fillRect(px + ox - rr, py - rr, rr * 2, rr * 2);
    }
  }

  /* the floor: old encaustic cement tiles, 20 cm — cream, a brick-red flower in each, slate-green quarter-rounds that
     meet as rings across four tiles, ochre lozenges on the joints; faded by forty years of feet, the grout dark */
  function makeCementTiles(THREE, cnv) {
    const S = 512, [c, x] = cnv(S), r = rng(4407), T = S / 2;
    const GROUND = '#e0d2b4', GREEN = '#5b7a69', RED = '#9e4733', OCHRE = '#c2964e';
    for (let j = 0; j < 2; j++) for (let i = 0; i < 2; i++) {
      x.save(); x.translate(i * T, j * T);
      x.beginPath(); x.rect(0, 0, T, T); x.clip();
      x.fillStyle = GROUND; x.fillRect(0, 0, T, T);
      for (const [cx, cy] of [[0, 0], [T, 0], [0, T], [T, T]]) {
        x.fillStyle = GREEN; x.beginPath(); x.arc(cx, cy, T * 0.34, 0, Math.PI * 2); x.fill();
        x.fillStyle = GROUND; x.beginPath(); x.arc(cx, cy, T * 0.255, 0, Math.PI * 2); x.fill();
        x.fillStyle = RED; x.beginPath(); x.arc(cx, cy, T * 0.13, 0, Math.PI * 2); x.fill();
        x.fillStyle = GROUND; x.beginPath(); x.arc(cx, cy, T * 0.05, 0, Math.PI * 2); x.fill();
      }
      x.fillStyle = OCHRE;
      for (const [cx, cy] of [[T / 2, 0], [T / 2, T], [0, T / 2], [T, T / 2]]) {
        x.beginPath(); x.moveTo(cx, cy - T * 0.075); x.lineTo(cx + T * 0.075, cy); x.lineTo(cx, cy + T * 0.075); x.lineTo(cx - T * 0.075, cy); x.closePath(); x.fill();
      }
      x.save(); x.translate(T / 2, T / 2);
      x.strokeStyle = GREEN; x.lineWidth = T * 0.02; x.beginPath(); x.arc(0, 0, T * 0.29, 0, Math.PI * 2); x.stroke();
      for (let k = 0; k < 4; k++) {
        x.save(); x.rotate(Math.PI / 4 + k * Math.PI / 2);
        x.fillStyle = RED; x.beginPath(); x.ellipse(0, -T * 0.135, T * 0.058, T * 0.125, 0, 0, Math.PI * 2); x.fill();
        x.fillStyle = GROUND; x.beginPath(); x.ellipse(0, -T * 0.14, T * 0.02, T * 0.075, 0, 0, Math.PI * 2); x.fill();
        x.restore();
        x.save(); x.rotate(k * Math.PI / 2);
        x.fillStyle = GREEN; x.beginPath(); x.ellipse(0, -T * 0.205, T * 0.025, T * 0.05, 0, 0, Math.PI * 2); x.fill();
        x.restore();
      }
      x.fillStyle = OCHRE; x.beginPath(); x.arc(0, 0, T * 0.05, 0, Math.PI * 2); x.fill();
      x.fillStyle = RED; x.beginPath(); x.arc(0, 0, T * 0.02, 0, Math.PI * 2); x.fill();
      x.restore();
      /* each tile its own wear: a tile is never quite the next one's colour */
      x.fillStyle = `rgba(${r() < 0.5 ? '238,228,206' : '120,100,80'},${(0.05 + r() * 0.1).toFixed(3)})`; x.fillRect(0, 0, T, T);
      x.strokeStyle = 'rgba(64,56,46,0.9)'; x.lineWidth = 4; x.strokeRect(0, 0, T, T);
      x.restore();
    }
    x.fillStyle = 'rgba(236,224,200,0.16)'; x.fillRect(0, 0, S, S);           // forty years of feet
    speckle(x, S, S, r, 2600, '60,48,36', 0.05, 0.18, 1, 2.5);
    speckle(x, S, S, r, 900, '250,244,228', 0.08, 0.2, 1, 3);
    x.lineCap = 'round';
    for (let i = 0; i < 40; i++) {                                           // scratches, pale
      const px = r() * S, py = r() * S, a = r() * Math.PI * 2, l = 10 + r() * 40;
      x.strokeStyle = `rgba(250,244,230,${(0.08 + r() * 0.12).toFixed(3)})`; x.lineWidth = 0.6 + r();
      x.beginPath(); x.moveTo(px, py); x.lineTo(px + Math.cos(a) * l, py + Math.sin(a) * l); x.stroke();
    }
    for (let i = 0; i < 14; i++) {                                           // chips at the tile corners
      const k = r() < 0.5 ? 0 : T, m = r() < 0.5 ? 0 : T, px = k + (r() - 0.5) * 10, py = m + (r() - 0.5) * 10;
      x.fillStyle = 'rgba(92,80,66,0.55)'; x.beginPath(); x.arc(px, py, 2 + r() * 4, 0, Math.PI * 2); x.fill();
    }
    return done(THREE, c, true);
  }

  /* the room's walls: an old mint distemper, mottled where the damp came and went, a darker dado to a metre under a
     painted line, a dark plinth; the sheet maps 2.0 m across and the room's whole height up (row 0 the ceiling) */
  function makeMintWall(THREE, cnv, H) {
    const Wd = 512, Hd = 768, [c, x] = sized(cnv, Wd, Hd), r = rng(4409);
    const row = (m) => Hd * (1 - m / H);
    x.fillStyle = '#a9d2bf'; x.fillRect(0, 0, Wd, Hd);
    for (let i = 0; i < 60; i++) {
      const lt = r() < 0.6;
      blobWrapped(x, Wd, r() * Wd, r() * row(1.0), 40 + r() * 110, lt ? 'rgba(214,238,226,0.09)' : 'rgba(120,158,138,0.07)');
    }
    /* the soot of years under the ceiling, and the tide-marks where the roof has leaked before */
    const g = x.createLinearGradient(0, 0, 0, row(H - 0.5)); g.addColorStop(0, 'rgba(70,74,60,0.32)'); g.addColorStop(1, 'rgba(70,74,60,0)');
    x.fillStyle = g; x.fillRect(0, 0, Wd, row(H - 0.5));
    for (let k = 0; k < 3; k++) {
      x.strokeStyle = `rgba(140,118,78,${(0.1 + r() * 0.08).toFixed(3)})`; x.lineWidth = 2 + r() * 2;
      x.beginPath(); const y0 = row(H - 0.12 - r() * 0.25);
      for (let px = -8; px <= Wd + 8; px += 16) x.lineTo(px, y0 + Math.sin(px * 0.03 + k * 2) * 6 + (r() - 0.5) * 4);
      x.stroke();
    }
    /* hairline cracks in the plaster */
    x.lineCap = 'round';
    for (let i = 0; i < 7; i++) {
      let px = r() * Wd, py = r() * row(1.2);
      x.strokeStyle = `rgba(70,96,84,${(0.25 + r() * 0.2).toFixed(3)})`; x.lineWidth = 0.8;
      x.beginPath(); x.moveTo(px, py);
      for (let s = 0; s < 6 + r() * 6; s++) { px += (r() - 0.5) * 22; py += 6 + r() * 16; x.lineTo(px, py); }
      x.stroke();
    }
    speckle(x, Wd, row(1.0), r, 2400, '255,255,255', 0.03, 0.08, 1, 2.5);
    speckle(x, Wd, row(1.0), r, 1800, '60,90,76', 0.03, 0.08, 1, 2.5);
    /* the dado: the same green, a shade deeper, scuffed low where chairs and feet have been */
    const yD = row(1.0), yP = row(0.1);
    x.fillStyle = '#7fab96'; x.fillRect(0, yD, Wd, yP - yD);
    for (let i = 0; i < 40; i++) blobWrapped(x, Wd, r() * Wd, yD + r() * (yP - yD), 20 + r() * 50, r() < 0.5 ? 'rgba(170,206,186,0.08)' : 'rgba(60,92,78,0.08)');
    for (let i = 0; i < 26; i++) blobWrapped(x, Wd, r() * Wd, yP - 6 - r() * 50, 8 + r() * 26, 'rgba(48,52,44,0.16)');
    speckle(x, Wd, yP - yD, r, 1400, '40,64,54', 0.04, 0.12, 1, 2);
    x.fillStyle = '#466e5c'; x.fillRect(0, yD - 3, Wd, 5);                  // the painted line
    x.fillStyle = 'rgba(220,240,230,0.35)'; x.fillRect(0, yD - 4, Wd, 1);
    x.fillStyle = '#34483f'; x.fillRect(0, yP, Wd, Hd - yP);                // the plinth
    speckle(x, Wd, Hd - yP, r, 600, '20,26,22', 0.1, 0.3, 1, 2);
    for (let i = 0; i < 600; i++) { x.fillStyle = `rgba(20,26,22,${(0.1 + r() * 0.2).toFixed(3)})`; x.fillRect(r() * Wd, yP + r() * (Hd - yP), 2, 2); }
    const t = done(THREE, c, true); t.wrapT = THREE.ClampToEdgeWrapping;
    return t;
  }

  /* the ceiling: painted fibre-cement boards on battens, 60 cm square, yellowed; the sheet is 1.2 m */
  function makeCeilBoards(THREE, cnv) {
    const S = 256, [c, x] = cnv(S), r = rng(4421);
    x.fillStyle = '#e2dac4'; x.fillRect(0, 0, S, S);
    for (let i = 0; i < 24; i++) blobWrapped(x, S, r() * S, r() * S, 10 + r() * 40, r() < 0.5 ? 'rgba(200,186,150,0.16)' : 'rgba(246,242,230,0.2)');
    speckle(x, S, S, r, 900, '120,104,70', 0.04, 0.1);
    x.fillStyle = '#b9ad8c';
    for (const p of [0, S / 2, S]) { x.fillRect(p - 5, 0, 10, S); x.fillRect(0, p - 5, S, 10); }
    x.fillStyle = 'rgba(255,250,236,0.4)';
    for (const p of [0, S / 2, S]) { x.fillRect(p - 5, 0, 2, S); x.fillRect(0, p - 5, S, 2); }
    x.fillStyle = 'rgba(70,60,40,0.55)';
    for (const p of [0, S / 2]) for (let k = 16; k < S; k += 32) { x.fillRect(p - 1, k, 2, 2); x.fillRect(k, p - 1, 2, 2); }
    return done(THREE, c, true);
  }

  /* oiled teak boards, old and dark, the planks running along u; for the platform, the table, the door */
  function makePlanks(THREE, cnv, seed, base = [92, 58, 34]) {
    const S = 256, [c, x] = cnv(S), r = rng(seed), N = 4, Ph = S / N;
    for (let k = 0; k < N; k++) {
      const d = (r() - 0.5) * 22, col = base.map(v => Math.max(0, Math.min(255, Math.round(v + d))));
      x.fillStyle = `rgb(${col.join(',')})`; x.fillRect(0, k * Ph, S, Ph);
      for (let i = 0; i < 34; i++) {
        const y0 = k * Ph + 3 + r() * (Ph - 6), dark = r() < 0.6;
        x.strokeStyle = dark ? `rgba(30,16,6,${(0.12 + r() * 0.22).toFixed(3)})` : `rgba(170,120,80,${(0.08 + r() * 0.14).toFixed(3)})`;
        x.lineWidth = 0.7 + r() * 1.6; x.beginPath(); x.moveTo(-4, y0);
        for (let px = 0; px <= S + 8; px += 32) x.lineTo(px, y0 + Math.sin(px * 0.021 + i) * 2.2 + (r() - 0.5) * 1.4);
        x.stroke();
      }
      if (r() < 0.6) {                                                         // a knot
        const kx = r() * S, ky = k * Ph + Ph * (0.3 + r() * 0.4);
        for (let q = 5; q > 0; q--) { x.strokeStyle = `rgba(36,18,8,${0.1 + q * 0.05})`; x.lineWidth = 1; x.beginPath(); x.ellipse(kx, ky, q * 3.4, q * 1.4, 0, 0, Math.PI * 2); x.stroke(); }
      }
      x.fillStyle = 'rgba(16,8,2,0.85)'; x.fillRect(0, k * Ph, S, 2);            // the joint
      x.fillStyle = 'rgba(190,140,96,0.18)'; x.fillRect(0, k * Ph + 2, S, 1);
    }
    speckle(x, S, S, r, 700, '20,10,4', 0.08, 0.2, 1, 2);
    return done(THREE, c, true);
  }

  /* the client's mat: a sueah of woven reed, natural with dyed bands — a red border, green stripes, a red lozenge */
  function makeReedMat(THREE, cnv, seed) {
    const S = 256, [c, x] = cnv(S), r = rng(seed);
    const col = (i, j) => {
      const b = Math.min(i, j, S / 4 - 1 - i, S / 4 - 1 - j);                 // distance from the edge, in strands
      const ci = Math.abs(i - S / 8 + 0.5), cj = Math.abs(j - S / 8 + 0.5);
      if (b < 3) return [150, 44, 34];
      if (b >= 5 && b < 7) return [62, 98, 70];
      if (ci + cj < 8 && ci + cj > 5) return [150, 44, 34];
      return [200, 178, 120];
    };
    for (let j = 0; j < S / 4; j++) for (let i = 0; i < S / 4; i++) {
      const base = col(i, j), over = ((i >> 1) + j) % 2 === 0, d = over ? 14 : -18;
      x.fillStyle = `rgb(${base.map(v => Math.max(0, Math.min(255, v + d + (r() - 0.5) * 10))).join(',')})`;
      x.fillRect(i * 4, j * 4, 4, 4);
      x.fillStyle = over ? 'rgba(255,240,200,0.18)' : 'rgba(40,24,8,0.22)';
      if (over) x.fillRect(i * 4, j * 4, 4, 1); else x.fillRect(i * 4, j * 4 + 3, 4, 1);
    }
    speckle(x, S, S, r, 500, '60,40,20', 0.06, 0.16);
    return done(THREE, c, false);
  }

  /* a pseudo-Khom letter for a yant — a loop, a hook and a tail, varied by the stream; the look of the script, not words */
  function yantGlyph(x, cx, cy, s, r) {
    x.beginPath(); x.arc(cx - s * 0.22, cy + s * 0.16, s * 0.15, 0, Math.PI * 2); x.stroke();
    x.beginPath(); x.moveTo(cx - s * 0.08, cy + s * 0.16);
    x.bezierCurveTo(cx - s * 0.02, cy - s * (0.3 + r() * 0.2), cx + s * 0.3, cy - s * 0.3, cx + s * 0.26, cy + s * (0.1 + r() * 0.2));
    x.stroke();
    if (r() < 0.6) { x.beginPath(); x.moveTo(cx + s * 0.26, cy + s * 0.2); x.quadraticCurveTo(cx + s * 0.36, cy + s * 0.42, cx + s * 0.12, cy + s * 0.38); x.stroke(); }
    if (r() < 0.5) { x.beginPath(); x.arc(cx + s * 0.1, cy - s * 0.36, s * 0.07, 0, Math.PI * 2); x.stroke(); }
  }
  function unalome(x, cx, top, bottom, s) {
    x.beginPath();
    for (let a = 0; a < Math.PI * 4.2; a += 0.2) { const rr = s * 0.04 + a * s * 0.025; x.lineTo(cx + Math.cos(a) * rr, bottom - s * 0.25 + Math.sin(a) * rr * 0.8); }
    x.stroke();
    x.beginPath(); x.moveTo(cx, bottom - s * 0.25);
    let y = bottom - s * 0.45, side = 1;
    while (y > top + s * 0.25) { x.lineTo(cx + side * s * 0.12, y); y -= s * 0.16; side = -side; }
    x.lineTo(cx, top + s * 0.12); x.stroke();
    x.beginPath(); x.arc(cx, top + s * 0.05, s * 0.035, 0, Math.PI * 2); x.fill();
  }
  /* the yant cloths on the master's wall (pha yant): red ink on yellowed cotton, a frame, a grid or a wheel of letters,
     the unalome over them — two of this room's own designs */
  function makeYantCloth(THREE, cnv, kind) {
    const W = 256, Hh = 340, [c, x] = sized(cnv, W, Hh), r = rng(kind === 'wheel' ? 4433 : 4431);
    x.fillStyle = '#eee3cb'; x.fillRect(0, 0, W, Hh);
    for (let i = 0; i < 26; i++) { const px = r() * W, py = r() * Hh, rr = 10 + r() * 50, g = x.createRadialGradient(px, py, 0, px, py, rr); g.addColorStop(0, 'rgba(196,164,108,0.16)'); g.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = g; x.fillRect(px - rr, py - rr, rr * 2, rr * 2); }
    speckle(x, W, Hh, r, 900, '150,120,70', 0.05, 0.12);
    const ink = 'rgba(158,22,26,0.92)';
    x.strokeStyle = ink; x.fillStyle = ink; x.lineCap = 'round'; x.lineJoin = 'round';
    x.lineWidth = 3; x.strokeRect(12, 12, W - 24, Hh - 24); x.lineWidth = 1.2; x.strokeRect(18, 18, W - 36, Hh - 36);
    x.lineWidth = 1.6;
    if (kind === 'wheel') {
      const cx = W / 2, cy = 188;
      unalome(x, cx, 26, 96, 70);
      for (const rr of [92, 70, 30]) { x.beginPath(); x.arc(cx, cy, rr, 0, Math.PI * 2); x.stroke(); }
      for (let k = 0; k < 8; k++) {
        const a = k / 8 * Math.PI * 2;
        x.beginPath(); x.moveTo(cx + Math.cos(a) * 30, cy + Math.sin(a) * 30); x.lineTo(cx + Math.cos(a) * 70, cy + Math.sin(a) * 70); x.stroke();
        const am = a + Math.PI / 8;
        yantGlyph(x, cx + Math.cos(am) * 50, cy + Math.sin(am) * 50, 15, r);
        yantGlyph(x, cx + Math.cos(am) * 81, cy + Math.sin(am) * 81, 12, r);
      }
      yantGlyph(x, cx, cy, 22, r);
      for (let k = 0; k < 6; k++) yantGlyph(x, 40 + k * 35, 304, 14, r);
    } else {
      unalome(x, W / 2, 24, 92, 66);
      const gx = 40, gy = 106, cs = 58;
      for (let k = 0; k <= 3; k++) { x.beginPath(); x.moveTo(gx + k * cs, gy); x.lineTo(gx + k * cs, gy + 3 * cs); x.stroke(); x.beginPath(); x.moveTo(gx, gy + k * cs); x.lineTo(gx + 3 * cs, gy + k * cs); x.stroke(); }
      x.beginPath(); x.moveTo(gx, gy); x.lineTo(gx + 3 * cs, gy + 3 * cs); x.moveTo(gx + 3 * cs, gy); x.lineTo(gx, gy + 3 * cs); x.stroke();
      for (let j = 0; j < 3; j++) for (let i = 0; i < 3; i++) yantGlyph(x, gx + cs * (i + 0.5), gy + cs * (j + 0.5) + (i === j || i + j === 2 ? 10 : 0), 17, r);
      for (let k = 0; k < 6; k++) yantGlyph(x, 40 + k * 35, 300, 14, r);
    }
    return done(THREE, c, false);
  }

  /* a provincial gold shop's calendar — the shop's name and 金 on red and gold, a golden chedi at sunset, the month:
     the kind of calendar every shop in the town gives away in December */
  function makeGoldCalendar(THREE, cnv) {
    const W = 256, Hh = 420, [c, x] = sized(cnv, W, Hh), r = rng(4437);
    x.fillStyle = '#f2ecdc'; x.fillRect(0, 0, W, Hh);
    x.fillStyle = '#b0161c'; x.fillRect(0, 0, W, 128);
    x.strokeStyle = '#e4bd56'; x.lineWidth = 3; x.strokeRect(6, 6, W - 12, 116);
    x.fillStyle = '#e4bd56'; x.beginPath(); x.arc(44, 50, 28, 0, Math.PI * 2); x.fill();
    x.fillStyle = '#b0161c'; x.font = 'bold 34px serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('金', 44, 52);
    x.fillStyle = '#f4d670'; x.textAlign = 'left';
    x.font = `bold 21px ${THAI_FONT}`; x.fillText('ห้างทอง', 84, 36);
    x.font = `bold 25px ${THAI_FONT}`; x.fillText('สุขใจ', 84, 68);
    x.font = `13px ${THAI_FONT}`; x.fillText('ทองรูปพรรณ  ทองคำแท่ง', 16, 106);
    const g = x.createLinearGradient(0, 132, 0, 262); g.addColorStop(0, '#e98a3c'); g.addColorStop(0.6, '#f4c26a'); g.addColorStop(1, '#7a4a2a');
    x.fillStyle = g; x.fillRect(10, 132, W - 20, 130);
    x.fillStyle = '#5a3418'; x.fillRect(10, 238, W - 20, 24);
    x.fillStyle = '#c99a2e';                                                     // a chedi: a bell on a stepped base, rings, a spire
    x.fillRect(98, 228, 60, 10); x.fillRect(106, 220, 44, 8);
    x.beginPath(); x.moveTo(108, 220); x.quadraticCurveTo(108, 184, 128, 178); x.quadraticCurveTo(148, 184, 148, 220); x.closePath(); x.fill();
    for (let k = 0; k < 5; k++) x.fillRect(122 - k * 0.6 + k * 0.6, 170 - k * 6, 12 - k * 1.6, 4);
    x.beginPath(); x.moveTo(124, 142); x.lineTo(128, 112 + 30); x.lineTo(132, 148); x.lineTo(124, 148); x.fill();
    x.fillRect(127, 132, 2, 18);
    x.fillStyle = '#3a2a2a'; x.font = `bold 20px ${THAI_FONT}`; x.textAlign = 'center'; x.fillText('ตุลาคม', W / 2, 286);
    const days = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'];
    x.font = `11px ${THAI_FONT}`;
    for (let k = 0; k < 7; k++) { x.fillStyle = k === 0 ? '#b0161c' : '#3a2a2a'; x.fillText(days[k], 26 + k * 34, 308); }
    x.font = 'bold 13px sans-serif';
    let d = 1;
    for (let row = 0; row < 5; row++) for (let k = 0; k < 7; k++) {
      if (row === 0 && k < 3) continue;
      if (d > 31) break;
      x.fillStyle = k === 0 ? '#b0161c' : '#2a2a2a'; x.fillText(String(d++), 26 + k * 34, 328 + row * 20);
    }
    speckle(x, W, Hh, r, 400, '120,100,70', 0.04, 0.1);
    return done(THREE, c, false);
  }

  /* the pendulum clock's dial: cream, Roman hours, a brass ring printed round it */
  function makeClockDial(THREE, cnv) {
    const S = 128, [c, x] = cnv(S);
    x.fillStyle = '#efe6cc'; x.beginPath(); x.arc(64, 64, 62, 0, Math.PI * 2); x.fill();
    x.strokeStyle = '#b08a3a'; x.lineWidth = 4; x.beginPath(); x.arc(64, 64, 60, 0, Math.PI * 2); x.stroke();
    x.fillStyle = '#2a241c'; x.font = 'bold 12px serif'; x.textAlign = 'center'; x.textBaseline = 'middle';
    const RN = ['XII', 'I', 'II', 'III', 'IIII', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'];
    for (let h = 0; h < 12; h++) { const a = h / 12 * Math.PI * 2; x.fillText(RN[h], 64 + Math.sin(a) * 46, 64 - Math.cos(a) * 46); }
    x.strokeStyle = '#2a241c'; x.lineWidth = 1;
    for (let m = 0; m < 60; m++) { const a = m / 60 * Math.PI * 2, r0 = m % 5 ? 55 : 52; x.beginPath(); x.moveTo(64 + Math.sin(a) * r0, 64 - Math.cos(a) * r0); x.lineTo(64 + Math.sin(a) * 57, 64 - Math.cos(a) * 57); x.stroke(); }
    return done(THREE, c, false);
  }

  /* the storm through the louvres and the door: a dark violet sky in rolls, the paddies' tree line, two sugar palms and
     the compound's fence. Painted at half the brightness wanted, because the renderer's exposure lifts it (v8.9) */
  function makeStormView(THREE, cnv, seed, yard) {
    const W = 512, Hh = 320, [c, x] = sized(cnv, W, Hh), r = rng(seed);
    const g = x.createLinearGradient(0, 0, 0, Hh);
    g.addColorStop(0, '#1e2036'); g.addColorStop(0.5, '#3a3c56'); g.addColorStop(0.68, '#4c4e64'); g.addColorStop(0.7, '#2a2c34'); g.addColorStop(1, '#1a1a20');
    x.fillStyle = g; x.fillRect(0, 0, W, Hh);
    for (let i = 0; i < 40; i++) {                                              // the storm's rolls
      const px = r() * W, py = 20 + r() * 150, rw = 60 + r() * 140, rh = 14 + r() * 30;
      const gg = x.createRadialGradient(px, py, 0, px, py, rw); gg.addColorStop(0, r() < 0.5 ? 'rgba(14,14,28,0.35)' : 'rgba(90,92,120,0.22)'); gg.addColorStop(1, 'rgba(0,0,0,0)');
      x.save(); x.translate(px, py); x.scale(1, rh / rw); x.translate(-px, -py); x.fillStyle = gg; x.fillRect(px - rw, py - rw, rw * 2, rw * 2); x.restore();
    }
    x.fillStyle = '#16181c';                                                    // the tree line over the paddies
    x.beginPath(); x.moveTo(0, Hh);
    for (let px = 0; px <= W; px += 6) x.lineTo(px, 214 - Math.abs(Math.sin(px * 0.05 + seed)) * 10 - r() * 8 - (px % 90 < 30 ? 10 : 0));
    x.lineTo(W, Hh); x.closePath(); x.fill();
    const palm = (px, base, h) => {
      x.strokeStyle = '#121418'; x.lineWidth = 3; x.beginPath(); x.moveTo(px, base); x.quadraticCurveTo(px + 3, base - h * 0.5, px + 1, base - h); x.stroke();
      x.fillStyle = '#121418';
      for (let k = 0; k < 22; k++) { const a = -Math.PI * (0.05 + 0.9 * k / 21), rr = 14 + r() * 6; x.beginPath(); x.moveTo(px + 1, base - h); x.lineTo(px + 1 + Math.cos(a) * rr, base - h + Math.sin(a) * rr * 0.8); x.lineTo(px + 1 + Math.cos(a + 0.08) * rr * 0.9, base - h + Math.sin(a + 0.08) * rr * 0.7); x.fill(); }
      x.beginPath(); x.arc(px + 1, base - h, 6, 0, Math.PI * 2); x.fill();
    };
    palm(118 + r() * 30, 222, 92 + r() * 20); palm(380 + r() * 40, 218, 70 + r() * 20);
    if (yard) {                                                                 // the yard from the room's door: wet red earth, the sala's eave
      x.fillStyle = '#3a2620'; x.fillRect(0, 236, W, Hh - 236);
      for (let i = 0; i < 9; i++) { const px = r() * W, py = 250 + r() * 60, rw = 30 + r() * 70; x.fillStyle = 'rgba(70,74,96,0.55)'; x.beginPath(); x.ellipse(px, py, rw, rw * 0.12, 0, 0, Math.PI * 2); x.fill(); }
      x.fillStyle = '#1a1412'; x.beginPath(); x.moveTo(300, 170); x.lineTo(W, 130); x.lineTo(W, 152); x.lineTo(320, 186); x.closePath(); x.fill();
      x.fillRect(338, 182, 7, 70); x.fillRect(470, 150, 7, 100);
    } else {
      x.strokeStyle = 'rgba(20,22,26,0.9)'; x.lineWidth = 1.2;                  // the fence: posts and two wires
      for (const yy of [246, 258]) { x.beginPath(); x.moveTo(0, yy); x.lineTo(W, yy + 4); x.stroke(); }
      x.fillStyle = '#16181c'; for (let px = 20; px < W; px += 64) x.fillRect(px, 236, 5, 40);
    }
    return done(THREE, c, false);
  }

  /* the curtain over the doorway into the house: an old maroon cotton printed with small white flowers */
  function makeCurtainPrint(THREE, cnv) {
    const S = 256, [c, x] = cnv(S), r = rng(4443);
    x.fillStyle = '#6a1e24'; x.fillRect(0, 0, S, S);
    for (let i = 0; i < 30; i++) blobWrapped(x, S, r() * S, r() * S, 16 + r() * 40, r() < 0.5 ? 'rgba(140,60,60,0.18)' : 'rgba(30,8,10,0.2)');
    for (let j = 0; j < 6; j++) for (let i = 0; i < 6; i++) {
      const px = (i + (j % 2) * 0.5) * S / 6 + (r() - 0.5) * 8, py = (j + 0.5) * S / 6 + (r() - 0.5) * 8;
      for (const ox of [-S, 0, S]) for (const oy of [-S, 0, S]) {
        x.fillStyle = 'rgba(232,220,206,0.8)';
        for (let k = 0; k < 5; k++) { const a = k / 5 * Math.PI * 2; x.beginPath(); x.ellipse(px + ox + Math.cos(a) * 4, py + oy + Math.sin(a) * 4, 3.2, 1.8, a, 0, Math.PI * 2); x.fill(); }
        x.fillStyle = 'rgba(214,170,70,0.9)'; x.beginPath(); x.arc(px + ox, py + oy, 1.6, 0, Math.PI * 2); x.fill();
      }
    }
    speckle(x, S, S, r, 700, '30,6,8', 0.06, 0.16);
    return done(THREE, c, true);
  }

  /* the back of an amulet cabinet: red velvet, rows of amulets in gold frames (a niche, a coin, a leaf, a tablet), each
     with its small white tag — the shapes of amulets at a glance, not any one amulet */
  function makeAmuletBoard(THREE, cnv, seed) {
    const S = 512, [c, x] = cnv(S), r = rng(seed);
    x.fillStyle = '#6e1016'; x.fillRect(0, 0, S, S);
    speckle(x, S, S, r, 5000, '40,0,4', 0.08, 0.2, 1, 2);
    speckle(x, S, S, r, 2000, '160,40,48', 0.06, 0.14, 1, 2);
    const fills = ['#8a6a48', '#c9b896', '#5c4430', '#a08a62', '#7c5228', '#d8ccb0', '#4a3a2a'];
    const rows = 5, cols = 7, cw = S / cols, rh = S / rows;
    for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
      const cx = (i + 0.5) * cw, cy = (j + 0.45) * rh, kind = Math.floor(r() * 4), fill = fills[Math.floor(r() * fills.length)];
      const w = cw * 0.52, h = rh * 0.62;
      const shape = () => {
        x.beginPath();
        if (kind === 0) { x.moveTo(cx - w / 2, cy + h / 2); x.lineTo(cx - w / 2, cy - h * 0.15); x.quadraticCurveTo(cx - w / 2, cy - h / 2, cx, cy - h / 2); x.quadraticCurveTo(cx + w / 2, cy - h / 2, cx + w / 2, cy - h * 0.15); x.lineTo(cx + w / 2, cy + h / 2); x.closePath(); }
        else if (kind === 1) x.arc(cx, cy, w * 0.48, 0, Math.PI * 2);
        else if (kind === 2) { x.moveTo(cx, cy - h / 2); x.quadraticCurveTo(cx + w * 0.55, cy, cx, cy + h / 2); x.quadraticCurveTo(cx - w * 0.55, cy, cx, cy - h / 2); }
        else x.rect(cx - w * 0.42, cy - h * 0.42, w * 0.84, h * 0.84);
      };
      x.fillStyle = 'rgba(0,0,0,0.35)'; x.save(); x.translate(2, 3); shape(); x.fill(); x.restore();
      shape(); x.fillStyle = fill; x.fill();
      x.lineWidth = 4; x.strokeStyle = '#d4ac48'; x.stroke();
      x.lineWidth = 1; x.strokeStyle = 'rgba(255,236,170,0.8)'; x.stroke();
      x.strokeStyle = 'rgba(0,0,0,0.35)'; x.lineWidth = 1.2;                   // the relief: a niche and a small dark heart
      x.beginPath(); x.arc(cx, cy - h * 0.02, w * 0.2, Math.PI, 0); x.lineTo(cx + w * 0.2, cy + h * 0.22); x.lineTo(cx - w * 0.2, cy + h * 0.22); x.closePath(); x.stroke();
      x.fillStyle = 'rgba(0,0,0,0.28)'; x.beginPath(); x.ellipse(cx, cy + h * 0.06, w * 0.08, h * 0.12, 0, 0, Math.PI * 2); x.fill();
      x.fillStyle = '#f2eee2'; x.fillRect(cx - 9, cy + h * 0.52, 18, 7);
      x.fillStyle = 'rgba(80,60,40,0.7)'; x.fillRect(cx - 6, cy + h * 0.52 + 3, 12, 1);
    }
    return done(THREE, c, false);
  }

  /* a wooden plaque over the doorway: red lacquer, a gold frame, gold letters — a shopkeeper's blessing, "money and gold
     pour in", which is what the people who come here come for */
  function makePlaque(THREE, cnv) {
    const W = 512, Hh = 128, [c, x] = sized(cnv, W, Hh), r = rng(4447);
    x.fillStyle = '#7c1414'; x.fillRect(0, 0, W, Hh);
    speckle(x, W, Hh, r, 1600, '30,0,0', 0.08, 0.2);
    x.strokeStyle = '#d6ae4a'; x.lineWidth = 6; x.strokeRect(8, 8, W - 16, Hh - 16);
    x.lineWidth = 2; x.strokeRect(18, 18, W - 36, Hh - 36);
    x.fillStyle = '#e8c45e'; x.font = `bold 50px ${THAI_FONT}`; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.fillText('เงินทองไหลมาเทมา', W / 2, Hh / 2 + 4);
    return done(THREE, c, false);
  }

  /* painted light and air: a soft glow (tinted by its material, additive — never a lamp, v15.1), a flame, a puff of
     incense smoke, the rain running down outside glass, a damp stain */
  function makeGlow(THREE, cnv) {
    const S = 128, [c, x] = cnv(S);
    const g = x.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.25, 'rgba(255,255,255,0.55)'); g.addColorStop(0.6, 'rgba(255,255,255,0.14)'); g.addColorStop(1, 'rgba(255,255,255,0)');
    x.fillStyle = g; x.fillRect(0, 0, S, S);
    return done(THREE, c, false);
  }
  function makeFlame(THREE, cnv) {
    const [c, x] = sized(cnv, 64, 128);
    const g = x.createRadialGradient(32, 92, 2, 32, 80, 52);
    g.addColorStop(0, 'rgba(255,252,236,1)'); g.addColorStop(0.25, 'rgba(255,214,120,0.95)'); g.addColorStop(0.55, 'rgba(255,140,40,0.55)'); g.addColorStop(1, 'rgba(255,90,20,0)');
    x.fillStyle = g;
    x.beginPath(); x.moveTo(32, 6); x.bezierCurveTo(46, 50, 50, 84, 32, 118); x.bezierCurveTo(14, 84, 18, 50, 32, 6); x.fill();
    x.fillStyle = 'rgba(80,120,255,0.35)'; x.beginPath(); x.ellipse(32, 112, 7, 9, 0, 0, Math.PI * 2); x.fill();
    return done(THREE, c, false);
  }
  function makePuff(THREE, cnv) {
    const S = 64, [c, x] = cnv(S), r = rng(4451);
    for (let i = 0; i < 9; i++) {
      const px = 22 + r() * 20, py = 22 + r() * 20, rr = 10 + r() * 14, g = x.createRadialGradient(px, py, 0, px, py, rr);
      g.addColorStop(0, 'rgba(255,255,255,0.38)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(0, 0, S, S);
    }
    return done(THREE, c, false);
  }
  function makeRainSheet(THREE, cnv, seed) {
    const [c, x] = sized(cnv, 128, 256), r = rng(seed);
    x.clearRect(0, 0, 128, 256); x.lineCap = 'round';
    for (let i = 0; i < 140; i++) {
      const px = r() * 128, py = r() * 256, l = 14 + r() * 30;
      x.strokeStyle = `rgba(210,220,240,${(0.12 + r() * 0.35).toFixed(3)})`; x.lineWidth = 0.6 + r() * 0.9;
      for (const oy of [-256, 0, 256]) { x.beginPath(); x.moveTo(px, py + oy); x.lineTo(px - l * 0.08, py + oy + l); x.stroke(); }
    }
    return done(THREE, c, true);
  }
  function makeStain(THREE, cnv, seed) {
    const S = 256, [c, x] = cnv(S), r = rng(seed);
    for (let k = 0; k < 5; k++) {
      x.strokeStyle = `rgba(120,90,50,${(0.12 + r() * 0.16).toFixed(3)})`; x.lineWidth = 2 + r() * 4;
      x.beginPath();
      for (let a = 0; a <= Math.PI * 2 + 0.01; a += 0.15) { const rr = (40 + k * 16) * (0.8 + r() * 0.3); x.lineTo(128 + Math.cos(a) * rr, 128 + Math.sin(a) * rr * 0.9); }
      x.stroke();
    }
    const g = x.createRadialGradient(128, 128, 0, 128, 128, 120); g.addColorStop(0, 'rgba(110,84,50,0.24)'); g.addColorStop(1, 'rgba(110,84,50,0)');
    x.fillStyle = g; x.fillRect(0, 0, S, S);
    return done(THREE, c, false);
  }
  /* the altar shelf's valance: red cloth with a scalloped gold hem */
  function makeValance(THREE, cnv) {
    const [c, x] = sized(cnv, 256, 48);
    x.fillStyle = '#9a1a1e'; x.fillRect(0, 0, 256, 48);
    x.fillStyle = '#d8b04c'; x.fillRect(0, 0, 256, 6);
    for (let k = 0; k < 8; k++) { x.beginPath(); x.arc(16 + k * 32, 30, 16, 0, Math.PI); x.fillStyle = '#d8b04c'; x.fill(); x.beginPath(); x.arc(16 + k * 32, 30, 11, 0, Math.PI); x.fillStyle = '#9a1a1e'; x.fill(); }
    x.clearRect(0, 46, 256, 2);
    return done(THREE, c, false);
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
