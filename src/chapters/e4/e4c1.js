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
    hemi: [0xb4bacc, 0x34322c, 0.58], key: [0xc0c4dc, 0.32, -20, 14, 10], fill: [0x7078a0, 0.30],
    vmHemi: [0xc0c6d4, 0x34322c, 0.66], vmKey: [0xd0d0e4, 0.48] });
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
  const FLASH = sky({                 // the storm's lightning held long enough to see the room by (WHAT CHANGED?'s lit beat)
    stops: [[0.00, '#3a4660'], [0.12, '#2e3a52'], [0.35, '#222c44'], [0.65, '#161e32'], [1.00, '#0c1222']],
    bg: 0x141c2c, fog: [0x141c2c, 0.0004],
    hemi: [0xd8e4ff, 0x23262e, 1.0], key: [0xe2ecff, 1.05, 1.6, 3, 2.2], fill: [0x8aa0d8, 0.42],
    vmHemi: [0xd8e4ff, 0x23262e, 0.95], vmKey: [0xe2ecff, 0.85] });
  const HUSH = sky({                  // the room after the storm: the candles, and the washed grey-blue through the louvres
    stops: [[0.00, '#56606e'], [0.12, '#48525e'], [0.35, '#3a424e'], [0.65, '#2c323c'], [1.00, '#1e222a']],
    bg: 0x262c36, fog: [0x262c36, 0.0004],
    hemi: [0xc0cede, 0x2a2622, 0.52], key: [0xffb070, 0.44, -1, 1.2, -1], fill: [0x8aa0c8, 0.24],
    vmHemi: [0xc8d4e4, 0x2a2622, 0.58], vmKey: [0xffb878, 0.44] });
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
    hemi: [0xffb070, 0x0a0a10, 0.16], key: [0xffc080, 0.12, 0, 4, 2], fill: [0x6a80c0, 0.07],
    vmHemi: [0xffb878, 0x0a0a10, 0.3], vmKey: [0xffc888, 0.28] });
  const GREY = sky({                  // the coda's dawn in the shop, drained a third toward grey (the fog begins)
    stops: [[0.00, '#c4c6c8'], [0.12, '#babcbe'], [0.35, '#aaacb0'], [0.65, '#989a9e'], [1.00, '#86888c']],
    bg: 0xa8aaae, fog: [0xb4b6ba, 0.008],
    hemi: [0xdcdcdc, 0x6a6a6a, 0.92], key: [0xe4e4e4, 0.45, 0, 6, 6], fill: [0xc0c4c8, 0.30],
    vmHemi: [0xdcdcdc, 0x6a6a6a, 0.92], vmKey: [0xe4e4e4, 0.5] });
  const SHOPDARK = sky({              // his shop before the shutter is up: the morning only under its edge (the opening's first seconds)
    stops: [[0.00, '#3a3e46'], [0.12, '#33363e'], [0.35, '#2a2d34'], [0.65, '#22242a'], [1.00, '#1a1b20']],
    bg: 0x1c1e24, fog: [0x2a2c32, 0.004],
    hemi: [0xc8ccd4, 0x2a2622, 0.22], key: [0xfff0dc, 0.2, 0, 1.2, 6], fill: [0x8a94a8, 0.08],
    vmHemi: [0xc8ccd4, 0x2a2622, 0.3], vmKey: [0xfff0dc, 0.2] });
  const PRESETS = { YARD0, YARD1, YARD2, ROOM, DARK, FLASH, HUSH, AFTER, ROAD, SHOP, SHOPDARK, TAXI, GREY };
  /* ====================================================== THE FILMS' TIMES (CP9) — shared by the films' cues (below the
     build) and their pictures (films, inside it): seconds on each film's own clock. The lines' lengths are estimates until
     CP11 records them; CP12 re-times by the takes. */
  const OPEN = { o2: 9.6, o2b: 14.8, o3: 19.4, o3b: 24.8, o4: 27.6, buzz: 30.0, o4b: 31.4, o5: 37.0, o5b: 43.8, o6: 50.6,
                 o7: 61.4, stop: 68.4, black: 70.9, end: 72.2 };
  /* (CP13: the last chord is 8 s and swells to its peak 5 s in; the black at 20.6 and the end at 21.8 cut it at its loudest —
     the last image holds through the swell now, and the black comes down on its fade) */
  const CODA = { k2: 10.6, k3: 16.6, black: 22.6, end: 24.2 };          // from the coda's own start (END[k].coda)
  const END = {
    A: { pao: 6.5, bless: 13.5, look: 27.5, book: 34.0, out: 40.0, walk: 51.0, cab: 57.0, wide: 62.6, coda: 70.0 },
    B: { ask: 4.9, look: 14.4, pong: 25.6, who: 34.4, come: 42.0, card: 56.0, cab: 63.0, wide: 74.0, coda: 82.4 },
    C: { said: 7.4, up: 9.4, calm: 12.4, pong: 19.4, out: 24.0, car: 33.2, road: 39.2, coda: 51.6 },
    D: { ask: 7.0, nod: 19.0, out: 24.0, shelter: 36.0, dusk: 52.0, coda: 60.4 }
  };


  const DATA = {
    id: 1,
    episode: 4,
    title: 'The Master I Did Not Know',
    cardLabel: 'Chapter 1',
    cardTitle: 'The Master I Did Not Know',
    brief: 'Your own shop, and a question about its future. A dealer says he knows a master in Thailand. Nobody knows anything else about him.',
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
    core: 'Do not choose a spiritual master simply because somebody calls them a master. Ask the ordinary questions you would ask about anyone you are about to trust: who are they, what is their character, and who can genuinely vouch for them? Spiritual knowledge and good character are not automatically the same thing, and the title alone tells you nothing about the second one.',

    /* units metres, y up. WORLD C (x 0): the yard x −16…14, z −13…8, the gate at z 8 on the lane (x 0), the road
       across the paddies at z 21. WORLD R (x +250): the room x −2.5…2.5, z −2…2 (local). WORLD S (x −250) and WORLD T
       (x −500) are seen only in films. Play begins beside the pickup outside the gate, facing in. */
    spawn:     { x: -0.6, y: 1.62, z: 12.6, rot: 0 },
    shrine:    { x: 7.9, z: -6.2 },           // the engine's anchor (ghost: null): the receiving room's door
    ghostHome: { x: 7.9, z: -6.2 },
    bounds:    { minX: -62, maxX: 262, minZ: -22, maxZ: 30 },

    /* NO HAUNTING (the eleventh leak): the chapter frightens with stillness, and nothing hunts him */
    ghost: null,
    fireLight: null,
    daylight: YARD0,

    /* the first master is his own (§2.1 2); every other person is a PLACEHOLDER until Chad's model lands
       (docs/E4-MODELS.md), declared in `reuse` so the FRESH check names it on every run */
    assets: ['firstmaster', 'fmshadow', 'e4sky', 'e4pong', 'e4noi', 'e4joy', 'sitwomantalk', 'e4lim', 'encik', 'granny'],
    reuse: {
      sitwomantalk: 'Khun Joy\'s talking take — with her placeholder',
      encik: 'Ta Sombat — a placeholder until Chad\'s model',
      granny: 'the presence at the edge of sight — a placeholder until Chad\'s model'
    },
    /* this chapter's own lighter cuts of earlier characters, standing in for two of Chad's people in the crowded sala */
    placeholders: {
      e4pong: 'Pong, the dealer — episode 3\'s staff man with three seated takes of the first master\'s, until Chad\'s model (docs/E4-MODELS.md)',
      e4noi: 'Pa Noi, the master\'s wife — episode 3\'s Yin shop keeper at a crowd\'s cut, until Chad\'s model',
      e4lim: 'Uncle Lim — episode 3\'s amulet-shop owner at a crowd\'s cut, until Chad\'s model',
      e4joy: 'Khun Joy — chapter 3\'s pink-shirt lady with a standing idle and a walk retargeted in, until Chad\'s model'
    },
    items: [],

    musicVol: 0,
    /* the beds (§9.3), every one at 0 here: mixBeds sets each by the world he is in, the hour and the storm (masters/
       v24.0/make.sh: looped by hand, levelled by RMS) */
    /* (CP13: the taxi's bed went — nothing ever raised it, and its 28.5 s of stereo was decoded at the start of play for
       nothing; the coda cues the taxi as a one-shot) */
    ambience: { beds: [['w4yard', 0], ['w4paddy', 0], ['w4roomtone', 0], ['w4rainl', 0], ['w4rainh', 0], ['w4after', 0],
                       ['w4radio', 0]] },
    voiceLine: null,

    words: {
      approach: '',                          // no floating label (v12.5): the orders name what to do
      act: 'E to act',
      actTouch: 'Tap to act',
      interact: 'E to choose what you do',
      interactTouch: 'Tap to choose what you do',
      actLine: 'Press E to choose what you do',
      actLineTouch: 'Tap to choose what you do',
      // PLAY I · the yard (§4.2): the orders, and the people he can ask
      objFollow: 'Follow Pong into the samnak',
      objAsk: 'Ask about the master · {n}/3',
      objAskPong: 'Ask Pong how he knows him',
      objWait: 'Wait for your number · you are 14, now {n}',
      objGoIn: 'Go in',
      hotJoy: 'Ask the woman waiting',
      hotLim: 'Ask the uncle',
      hotSombat: 'Ask the old farmer',
      hotPong: 'Ask Pong',
      hotTree: 'The dresses on the tree',
      hotDoor: 'The receiving room',
      // THE LEDGER (S43): his stock book's back pages — a FACT or a MEANING, never labelled (§4.2, §4.4)
      ledWho: 'Who is he?',
      ledSaw: 'What I saw',
      ledPrompt: 'What will you write?',
      ledBrief: 'One line, in the back of your stock book.',
      ledJoyF: 'She came because her boss\'s wife said he was powerful.',
      ledJoyM: 'He must be powerful — people drive hours to see him.',
      ledLimF: 'Uncle Lim guesses three or four years. Already popular.',
      ledLimM: 'He\'s only in it for the money.',
      ledSbF: 'He came here five years ago. The farmer doesn\'t know from where.',
      ledSbM: 'He\'s hiding where he came from.',
      ledPongF: 'Pong had never been here either. His cousin knows him.',
      ledPongM: 'Pong\'s cousin vouches for him, so he\'s fine.',
      ledReadF: 'His answer was longer than Pong\'s translation.',
      ledReadM: 'Pong is hiding what he said.',
      ledSmokeF: 'The smoke leaned toward the covered bowl, against the fan.',
      ledSmokeM: 'His blessing is drawing luck into the bowl.',
      ledClothF: 'The cloth over the bowl moved.',
      ledClothM: 'He keeps something alive under there.',
      ledShadowF: 'His shadow moved after he did.',
      ledShadowM: 'His shadow isn\'t his own.',
      ledHerF: 'I glimpsed someone behind him. When I looked, no one was there.',
      ledHerM: 'She watches over the house for him.',
      // PLAY II · the reading (§4.3)
      objKneel: 'Kneel on the mat',
      hotMat: 'Kneel',
      pickLabel: 'The day you were born',
      pickTitle: 'What day were you born?',
      day_sun: 'Sunday', dayc_sun: 'red',
      day_mon: 'Monday', dayc_mon: 'yellow',
      day_tue: 'Tuesday', dayc_tue: 'pink',
      day_wed: 'Wednesday', dayc_wed: 'green · by day',
      day_wedn: 'Wednesday night', dayc_wedn: 'smoky black · after six',
      day_thu: 'Thursday', dayc_thu: 'orange',
      day_fri: 'Friday', dayc_fri: 'sky blue',
      day_sat: 'Saturday', dayc_sat: 'purple',
      chooseLabel: 'Take one',
      chooseTitle: 'For your shop',
      objOffer: 'Set your offering on the tray',
      hotOffer: 'Set down your offering',
      // PLAY III · the work (§4.4): the chant's captions — the words as said, over what they mean — and the four signs
      chant1: 'Namo tassa bhagavato arahato sammā-sambuddhassa.',
      chant1en: 'Homage to the Blessed One, the Worthy One, the Rightly Self-awakened One.',
      chant2: 'Ehi cittaṁ mahā-lābhaṁ piyaṁ mama māmā',
      chant2en: 'A Thai trade blessing in Pali-like words — roughly: come, heart; great gain; be dear to me',
      chant3: 'Mahā-lābhā bhavantu me',
      chant3en: 'May great gains be mine.',
      objWatch: 'Watch. Write down what you see · {n}/4',
      lookSmoke: 'The smoke',
      lookCloth: 'The red cloth',
      lookShadow: 'His shadow on the wall',
      lookHer: 'The doorway',
      // PLAY IV · the storm (§4.5): WHAT CHANGED?
      chgLabel: 'The storm',
      chgBrief: 'The lightning shows the room. Remember it. When it flashes again, tap or click only what has changed. If nothing has changed, touch nothing.',
      // the card's What you did (§4.9)
      noteAsked: 'You asked who he was. Nobody knew.',
      noteNeverAsked: 'You never asked who he was.',
      noteFacts: 'You wrote down what you saw.',
      noteMeanings: 'You wrote down what you thought it meant.',
      noteStormTrue: 'In the storm, you saw only what changed.',
      noteStormFalse: 'In the storm, you saw changes that weren\'t there.',
      noteStormNone: 'In the storm, you held back, and missed what changed.',
      note_nangkwak: 'You took a Nang Kwak for the shop.',
      note_takrut: 'You took a takrut for the shop.',
      note_phayant: 'You took a pha yant for the shop.',
      // the opening film's message (§4.0 O4): the chat over the picture, and his phone's lock screen
      phonePong: 'Pong',
      phonePongSub: 'Amulets · Bangkok',
      phoneTyping: 'typing…',
      phoneNow: 'now',
      chat1: 'Brother!! Come Thailand. I bring you see one Ajahn. Very strong for business 🙏',
      chat2: 'Who is he?',
      chat3: 'Very famous. Trust me.',
      // the coda's last image in ending B (§4.8 K3): the master's message on his phone
      phoneAjahn: 'Ajahn',
      phoneAjahnMsg: 'Sawasdee krap',
      phoneAjahnMsg2: 'May your shop do well.',
      // the endings (§4.7): the line he writes in the back of his book (A, D)
      endAline: 'I don\'t know what I saw.',
      endDline: 'Some things I don\'t need to understand today.'
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
      'q1pro1': 7.45, 'q1pro2': 6.01, 'q1pro3': 6.01, 'q1pro4': 4.01, 'q1pro5': 3.29, 'q1board': 2.73,
      'q1water': 0.89, 'q1joy1': 2.25, 'q1joy2': 1.05, 'q1lim1': 2.73, 'q1lim2': 1.29, 'q1sb1': 2.65, 'q1pg1': 2.81,
      'q1nobody': 2.65, 'q1missed': 1.61, 'q1tree': 2.97, 'q1wai': 1.21, 'q1shop': 5.45, 'q1short': 2.01,
      'q1smoke': 6.09, 'q1cloth': 2.89, 'q1shadow': 3.77, 'q1her': 5.61, 'q1A1': 1.83, 'q1A2': 0.65, 'q1A3': 0.81,
      'q1A4': 5.61, 'q1B1': 3.29, 'q1B2': 0.93, 'q1B3': 2.73, 'q1B4': 6.21, 'q1C0': 6.57, 'q1C1': 1.77,
      'q1C2': 1.29, 'q1C3': 5.13, 'q1D1': 5.45, 'q1D2': 4.17, 'q1D3': 2.97, 'q1D4': 3.21, 'q1D5': 3.29, 'q1K1': 6.25,
      'q1K2': 1.61, 'q1K3': 2.09, 'q1A': 4.63, 'q1B': 4.33, 'q1C': 3.13, 'q1D': 3.45,
    /* pg */
      'pg1car': 5.29, 'pg1here': 2.4, 'pg1come': 2.0, 'pg1sbq': 2.97, 'pg1sb': 7.05, 'pg1me': 6.87, 'pg1go': 2.46,
      'pg1tree': 3.01, 'pg1shop': 1.85, 'pg1th1': 2.97, 'pg1good': 5.77, 'pg1day': 1.85, 'pg1read': 7.61,
      'pg1items': 3.2, 'pg1nk': 3.53, 'pg1tk': 5.26, 'pg1py': 4.89, 'pg1offer': 4.01, 'pg1eyes': 3.72,
      'pg1power': 3.67, 'pg1Ank': 5.53, 'pg1Atk': 4.96, 'pg1Apy': 5.93, 'pg1A1': 3.61, 'pg1A2': 0.94, 'pg1B1': 3.73,
      'pg1B2': 4.3, 'pg1B3': 6.84, 'pg1B4': 1.65, 'pg1B5': 3.29, 'pg1B6': 2.99, 'pg1B7': 3.42, 'pg1C1': 3.35,
      'pg1C2': 2.49, 'pg1D1': 3.87, 'pg1D2': 3.0, 'pg1D3': 4.37,
    /* pn */
      'pn1num': 7.6, 'pn1water': 6.41, 'pn1n10': 1.14, 'pn1n11': 1.23, 'pn1n12': 1.3, 'pn1n13': 1.37,
      'pn1n14': 2.4, 'pn1tray': 0.83, 'pn1guava': 6.49, 'pn1card': 2.65, 'pn1C1': 6.03,
    /* jy */
      'jy1a': 6.97, 'jy1b': 6.25, 'jy1go': 2.01,
    /* lm */
      'lm1a': 7.96, 'lm1b': 4.49, 'lm1go': 2.04,
    /* sb */
      'sb1a': 8.59,
    /* fm */
      'fm1hello': 4.21, 'fm1shop': 1.25, 'fm1good': 4.49, 'fm1day': 1.13, 'fm1hm': 1.21, 'fm1read': 10.65,
      'fm1items': 2.25, 'fm1anu': 1.24, 'fm1eyes': 3.33, 'fm1chant': 33.77, 'fm1chant2': 18.17, 'fm1blessA': 2.33,
      'fm1Abye': 1.85, 'fm1B1': 3.77, 'fm1B2': 1.69, 'fm1B3': 2.57, 'fm1C1': 2.09, 'fm1C2': 2.73, 'fm1D1': 2.73,
    /* tx */
      'tx1where': 1.17,
  };
  /* SECS END */

  function build(ctx) {
    const { THREE, GLTFLoader, cloneSkinned, scene, camera, yaw, pitch, LOW, kit, cnv, loadImageTexture,
            assetBytes, rescueTextures, getState, startDecision, worldSfx, warmSounds, soundOff, unifySkeletons,
            makeHellNote, plantTrees, HEAD_RE } = ctx;

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
    const RDOOR = { x: 7.9, z: -5.6 };                    // the receiving room's door at the top of its steps, in the yard (they face +z)
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

    /* the cars' windows: the sky they reflect, painted (top: the pale storm light; down to the dark of the cabin) — a
       glass with no environment to reflect renders as a black slab (CP9, by photograph: the pickup's windows in the
       opening's tracking shot) */
    let carGlassTex = null;
    function carGlassSky() {
      if (carGlassTex) return carGlassTex;
      const [c, x] = sized(cnv, 4, 64);
      const g = x.createLinearGradient(0, 0, 0, 64);
      g.addColorStop(0, '#9fb2c6'); g.addColorStop(0.32, '#61707e'); g.addColorStop(0.62, '#262e36'); g.addColorStop(1, '#0d1115');
      x.fillStyle = g; x.fillRect(0, 0, 4, 64);
      carGlassTex = tex(done(THREE, c, false));
      return carGlassTex;
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
    const DOME_TINT = { YARD0: [1, 1, 1], YARD1: [0.84, 0.84, 0.88], YARD2: [0.46, 0.46, 0.55], AFTER: [0.86, 0.9, 1.0],
                        ROAD: [1.06, 1.02, 0.98], ROOM: [0.5, 0.52, 0.6], DARK: [0.16, 0.17, 0.22], FLASH: [0.9, 0.95, 1.1], HUSH: [0.6, 0.66, 0.78] };
    function domeTint(name, secs = 0) {
      const v = DOME_TINT[name] || [1, 1, 1];
      domeLive.tintFrom.copy(domeLive.tint); domeLive.tintTo.setRGB(v[0], v[1], v[2]);
      domeLive.t0 = wallNow(); domeLive.t1 = domeLive.t0 + Math.max(0.001, secs);
    }
    function domeFrame(now) {
      /* only the world the lens is in is drawn: from the shop (x −250) the paddies' far edge, the road and its palms are
         inside the far plane and were drawn behind the shop's walls for nothing (168 draws where 39 belong) */
      { const w = worldOf(yaw.position.x); worldC.visible = w === 'C'; worldR.visible = w === 'R'; worldS.visible = w === 'S'; worldT.visible = w === 'T'; }
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

    // WORLD C: the compound — built in full below (CP5)
    // WORLD R: the receiving room — built in full below (CP4)
    // WORLD S: his shop at dawn (local) — built in full below (CP6)
    // WORLD T: the taxi's cabin (local) — built in full below (CP6)

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
      INC: { x: 0.16, z: -1.22 },                                         // the incense cup on the table (off the line to his face:
                                                                          // CP9, by photograph — at x 0 its straight smoke rose
                                                                          // through the master's face in every shot from the mat)
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
        /* and after the storm, when every sign has settled (§4.6, ending A): the same stick's smoke rising straight and
           going with the fan like the altar's (smoke[2], off until roomCtl.smokeStraight) */
        room.smoke.push(smokePath([[I.x, T + 0.29, I.z], [I.x + 0.004, T + 0.47, I.z], [I.x + 0.02, T + 0.64, I.z + 0.01], [I.x + 0.08, T + 0.8, I.z + 0.03],
                                   [I.x + 0.2, T + 0.94, I.z + 0.06]], 26, 5.6, 0.34));
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

    /* ============================================== WORLD C · THE COMPOUND (CP5, §4.1)
       One small dense place in the central plains' rice country, about 34 × 23 m on a low mound above the flooded
       paddies: the red-earth yard inside a concrete-post fence, the old teak house on stilts (left), the open waiting
       sala (centre), the master's newer concrete receiving room (right), the takhian tree with its dresses behind,
       cars under a rain tree, the compound's own spirit house by the gate; outside, the lane to the road on its dyke,
       sugar palms on the bunds to the horizon, concrete poles and sagging wires, a roadside shelter. Everything is
       built here in code (CSP-safe): the vegetation through the engine's own stand machinery with this chapter's kits
       (S46), the paddies as water that mirrors the generated storm sky. */
    const CMP = {
      FENCE: { x0: -16, x1: 14, z0: -13, z1: 8 },
      HOUSE: { x0: -13.4, x1: -8.6, z0: -10.9, z1: -4.3, floor: 2.5, eave: 5.1, ridge: 7.5, verX: -6.6 },
      SALA: { x0: -3, x1: 3, z0: -4, z1: 0, floor: 0.32 },
      ROOMX: { x0: 5.6, x1: 11.4, z0: -11.4, z1: -6.4, base: 0.5, top: 3.4 },
      TAKHIAN: { x: 2.4, z: -10.4 }, RAINTREE: { x: 10.6, z: 2.2 }, MANGO: { x: -9.2, z: 2.6 },
      SPIRIT: { x: -5.4, z: 5.4 }, SHELTER: { x: 6.0, z: 15.4 }, PICKUP: { x: 2.0, z: 13.15 },
      BOARD: { x: 2.75, z: 0.75 }, WATER_Y: -0.32
    };
    const yard = { board: null, boardN: 9, water: null, waterMats: [], tvMat: null, standFan: null, stands: [], dresses: [], kitGeos: [], kitMats: [] };
    function buildCompound() {
      const C = worldC, LOWQ = LOW;
      const m4 = new THREE.Matrix4();
      const mesh = (g, m, x, y, z, p = C) => { const o = new THREE.Mesh(g, m); o.position.set(x, y, z); o.castShadow = !LOW; o.receiveShadow = true; p.add(o); return o; };
      const bx = (w, h, d, m, x, y, z, p = C) => mesh(new THREE.BoxGeometry(w, h, d), m, x, y, z, p);
      const cyl = (rt, rb, h, m, x, y, z, seg = 12, p = C) => mesh(new THREE.CylinderGeometry(rt, rb, h, seg), m, x, y, z, p);
      const lathe = (pts, m, x, y, z, seg = 18, p = C) => mesh(new THREE.LatheGeometry(pts.map(q => new THREE.Vector2(q[0], q[1])), seg), m, x, y, z, p);
      const flat = (w, h, m, p = C) => { const o = new THREE.Mesh(new THREE.PlaneGeometry(w, h), m); p.add(o); return o; };
      /* a sloped quad between four corners (roofs, banks): two triangles, UVs in metres along its two edges */
      const quad = (a, b, c, d, m, p = C, uvs = 1) => {
        const g = new THREE.BufferGeometry();
        const P = new Float32Array([...a, ...b, ...c, ...d]);
        const lu = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]) / uvs, lv = Math.hypot(d[0] - a[0], d[1] - a[1], d[2] - a[2]) / uvs;
        g.setAttribute('position', new THREE.BufferAttribute(P, 3));
        g.setAttribute('uv', new THREE.BufferAttribute(new Float32Array([0, 0, lu, 0, lu, lv, 0, lv]), 2));
        g.setIndex([0, 1, 2, 0, 2, 3]); g.computeVertexNormals();
        const o = new THREE.Mesh(g, m); o.castShadow = !LOW; o.receiveShadow = true; p.add(o); return o;
      };

      /* ---- the sheets */
      const tEarth = tex(makeRedEarth(THREE, cnv)); tEarth.repeat.set(7, 5);
      const tLane = tex(makeRedEarth(THREE, cnv)); tLane.repeat.set(1.4, 2.4);
      const tGrass = tex(makeGrassT(THREE, cnv, 4641)); tGrass.repeat.set(30, 1.5);
      const tBank = tex(makeGrassT(THREE, cnv, 4643)); tBank.repeat.set(10, 1);
      const tAsph = tex(makeAsphalt(THREE, cnv)); tAsph.repeat.set(60, 1.2);
      const tTiles = tex(makeRoofTiles(THREE, cnv));
      const tZinc = tex(makeZinc(THREE, cnv, 4645)), tZincRed = tex(makeZinc(THREE, cnv, 4647, [150, 52, 40]));
      const tConc = tex(makeConcreteT(THREE, cnv, 4649)), tConcW = tex(makeConcreteT(THREE, cnv, 4651, '#d8dcd0'));
      const tBoards = tex(makeHouseBoards(THREE, cnv));
      const tGlowY = tex(makeGlow(THREE, cnv));
      const mEarthY = M({ map: tEarth, roughness: 0.95 });
      const mLane = M({ map: tLane, roughness: 0.95, side: THREE.DoubleSide });
      const mBank = M({ map: tBank, roughness: 1, side: THREE.DoubleSide });
      const mGrassD = M({ map: tGrass, roughness: 1, side: THREE.DoubleSide });
      const mAsph = M({ map: tAsph, roughness: 0.9 });
      const mLine = M({ color: 0xe8e6dc, roughness: 0.7 });
      const mYel = M({ color: 0xd8a830, roughness: 0.7 });
      const mTiles = M({ map: tTiles, roughness: 0.85, side: THREE.DoubleSide });
      const mZinc = M({ map: tZinc, roughness: 0.55, metalness: 0.35, side: THREE.DoubleSide });
      const mZincR = M({ map: tZincRed, roughness: 0.6, metalness: 0.25, side: THREE.DoubleSide });
      const mConc = M({ map: tConc, roughness: 0.92 });
      const mConcW = M({ map: tConcW, roughness: 0.9 });
      const mBoards = M({ map: tBoards, roughness: 0.85 });
      const mTeakY = M({ color: 0x5a3a24, roughness: 0.75 });
      const mTeakO = M({ color: 0x6e5440, roughness: 0.85, side: THREE.DoubleSide });   // weathered, grey-brown
      const mWhite = M({ color: 0xece8de, roughness: 0.7 });
      const mGreenP = M({ color: 0x2e5a44, roughness: 0.55 });
      const mDark = M({ color: 0x141210, roughness: 0.9 });
      const mSteel = M({ color: 0x8a9096, roughness: 0.35, metalness: 0.8 });
      const mRust = M({ color: 0x6a4630, roughness: 0.8, metalness: 0.3 });
      const mGlassD = M({ color: 0x1a2028, roughness: 0.08, metalness: 0.4 });
      const mWire = M({ color: 0x1a1a1a, roughness: 0.6 });

      /* ---- THE PADDIES: water to the horizon, mirroring the storm sky (the same panorama, reflected), the rice in rows
         on it, a fresnel to the grey of the water when you look down into it */
      const tRice = tex(makeRiceRows(THREE, cnv));
      const waterMat = (pud) => new THREE.ShaderMaterial({
        uniforms: { uSky: { value: null }, uHas: { value: 0 }, uTheta: { value: DOME_THETA }, uTint: { value: new THREE.Color(pud ? 0x2a1812 : 0x3a4246) },
                    uSkyK: { value: new THREE.Color(1, 1, 1) }, uTime: { value: 0 }, uRice: { value: tRice }, uRiceK: { value: 0.85 }, uFlash: { value: 0 },
                    uRiceOn: { value: 1 },
                    fogColor: { value: new THREE.Color() }, fogDensity: { value: 0 }, fogNear: { value: 1 }, fogFar: { value: 2 } },
        defines: pud ? { PUD: '' } : {},
        vertexShader: 'varying vec3 vW; varying vec2 vUv;\n#include <fog_pars_vertex>\nvoid main() { vUv = uv; vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; vec4 mvPosition = viewMatrix * w; gl_Position = projectionMatrix * mvPosition;\n#include <fog_vertex>\n}',
        fragmentShader: [
          'uniform sampler2D uSky; uniform float uHas; uniform float uTheta; uniform vec3 uTint; uniform vec3 uSkyK; uniform float uTime;',
          'uniform sampler2D uRice; uniform float uRiceK; uniform float uFlash; uniform float uRiceOn; varying vec3 vW; varying vec2 vUv;',
          '#include <fog_pars_fragment>',
          'void main() {',
          '  vec3 v = normalize(vW - cameraPosition);',
          '  vec2 q = vW.xz;',
          '  float n1 = sin(q.x * 2.3 + uTime * 1.1) * sin(q.y * 1.9 - uTime * 0.9) + 0.5 * sin(q.x * 5.1 - q.y * 4.3 + uTime * 2.0);',
          '  vec3 n = normalize(vec3(n1 * 0.012, 1.0, n1 * 0.01));',
          '  vec3 r = reflect(v, n); r.y = abs(r.y);',
          '  float u = atan(r.z, -r.x) / 6.2831853; u = fract(u);',
          '  float th = acos(clamp(r.y, -1.0, 1.0));',
          '  vec3 sky = uHas > 0.5 ? texture2D(uSky, vec2(u, clamp(th / uTheta, 0.0, 0.999))).rgb : uTint * 1.6;',
          '  float f = 0.18 + 0.82 * pow(1.0 - clamp(-v.y, 0.0, 1.0), 5.0);',
          '  vec3 col = mix(uTint, sky * uSkyK, f);',
          '#ifndef PUD',
          '  vec4 rice = texture2D(uRice, vW.xz / 3.2);',
          '  float far = smoothstep(18.0, 90.0, length(vW.xz - cameraPosition.xz));',
          '  col = mix(col, rice.rgb * uRiceK, rice.a * uRiceOn * mix(0.75, 0.55, far));',
          '#endif',
          '  col *= 1.0 + uFlash * 1.6;',
          '#ifdef PUD',
          '  float rr = length(vUv - 0.5) * 2.0;',            // a rut's water has no edge: it thins into the mud
          '  gl_FragColor = vec4(col, 0.92 * (1.0 - smoothstep(0.5, 1.0, rr)));',
          '#else',
          '  gl_FragColor = vec4(col, 1.0);',
          '#endif',
          '#include <fog_fragment>',
          '#include <colorspace_fragment>',
          '}'].join('\n'),
        fog: true, toneMapped: false, transparent: !!pud, depthWrite: !pud
      });
      const water = waterMat(false), puddle = waterMat(true);
      mats.push(water, puddle); yard.waterMats.push(water, puddle);
      { const wg = new THREE.CircleGeometry(136, 64); wg.rotateX(-Math.PI / 2);
        const w = new THREE.Mesh(wg, water); w.position.set(0, CMP.WATER_Y, 6); w.receiveShadow = false; w.userData.dyn = true; C.add(w); yard.water = w; }
      /* the horizon's tree lines: a band just inside the water's edge, riding with nothing (the paddies are where they are) */
      { const tl = tex(makeTreeLine(THREE, cnv)); tl.repeat.set(7, 1);
        const g = new THREE.CylinderGeometry(132, 132, 7, 96, 1, true);
        const band = new THREE.Mesh(g, B({ map: tl, transparent: true, alphaTest: 0.35, side: THREE.BackSide, fog: false, toneMapped: false, color: 0x9aa4a8, depthWrite: false }));
        band.position.set(0, CMP.WATER_Y + 3.2, 6); band.renderOrder = -850; band.userData.dyn = true; C.add(band); yard.treeline = band; }

      /* ---- the mound the compound stands on, its banks into the water, the lane, the road on its dyke */
      const F = CMP.FENCE, M0 = { x0: F.x0 - 2.2, x1: F.x1 + 2.2, z0: F.z0 - 2.2, z1: F.z1 + 1.4 };
      { const g = flat(M0.x1 - M0.x0, M0.z1 - M0.z0, mEarthY); g.rotation.x = -Math.PI / 2; g.position.set((M0.x0 + M0.x1) / 2, 0, (M0.z0 + M0.z1) / 2); g.receiveShadow = true; }
      const W = CMP.WATER_Y - 0.08, BK = 2.4;
      quad([M0.x0, 0, M0.z0], [M0.x1, 0, M0.z0], [M0.x1 + BK, W, M0.z0 - BK], [M0.x0 - BK, W, M0.z0 - BK], mBank);
      quad([M0.x0 - BK, W, M0.z1 + BK], [M0.x0, 0, M0.z1], [M0.x0, 0, M0.z0], [M0.x0 - BK, W, M0.z0 - BK], mBank);
      quad([M0.x1, 0, M0.z0], [M0.x1, 0, M0.z1], [M0.x1 + BK, W, M0.z1 + BK], [M0.x1 + BK, W, M0.z0 - BK], mBank);
      quad([M0.x0, 0, M0.z1], [M0.x0 - BK, W, M0.z1 + BK], [-3.6 - BK, W, M0.z1 + BK], [-3.6, 0, M0.z1], mBank);
      quad([3.6, 0, M0.z1], [3.6 + BK, W, M0.z1 + BK], [M0.x1 + BK, W, M0.z1 + BK], [M0.x1, 0, M0.z1], mBank);
      /* the lane: flat to 13.5, then up onto the road's dyke */
      const ROADY = 0.8, RZ0 = 17.6, RZ1 = 24.4;
      { const L = flat(7.2, 13.5 - M0.z1, mLane); L.rotation.x = -Math.PI / 2; L.position.set(0, 0.003, (M0.z1 + 13.5) / 2); L.receiveShadow = true; }
      quad([-3.6, 0, 13.5], [3.6, 0, 13.5], [3.6, ROADY, RZ0], [-3.6, ROADY, RZ0], mLane);
      quad([-3.6, 0, M0.z1], [-3.6, 0, 13.5], [-3.6 - 1.6, W, 13.5], [-3.6 - BK, W, M0.z1 + BK], mBank);
      quad([3.6, 0, 13.5], [3.6, 0, M0.z1], [3.6 + BK, W, M0.z1 + BK], [3.6 + 1.6, W, 13.5], mBank);
      quad([-3.6, ROADY, RZ0], [-3.6, 0, 13.5], [-5.2, W, 13.5], [-5.2, W, RZ0 - 1.6], mBank);
      quad([3.6, 0, 13.5], [3.6, ROADY, RZ0], [5.2, W, RZ0 - 1.6], [5.2, W, 13.5], mBank);
      /* the road on its dyke, x −150…150 */
      const RL = 300;
      { const top = flat(RL, RZ1 - RZ0, mAsph); top.rotation.x = -Math.PI / 2; top.position.set(0, ROADY, (RZ0 + RZ1) / 2); top.receiveShadow = true;
        tAsph.repeat.set(RL / 5, (RZ1 - RZ0) / 5); }
      quad([-RL / 2, ROADY, RZ0], [-RL / 2, W, RZ0 - 1.9], [RL / 2, W, RZ0 - 1.9], [RL / 2, ROADY, RZ0], mGrassD);
      quad([RL / 2, ROADY, RZ1], [RL / 2, W, RZ1 + 1.9], [-RL / 2, W, RZ1 + 1.9], [-RL / 2, ROADY, RZ1], mGrassD);
      for (const zz of [RZ0 + 0.35, RZ1 - 0.35]) { const l = flat(RL, 0.12, mLine); l.rotation.x = -Math.PI / 2; l.position.set(0, ROADY + 0.004, zz); }
      for (let x = -RL / 2; x < RL / 2; x += 6) { const l = flat(3.0, 0.1, mYel); l.rotation.x = -Math.PI / 2; l.position.set(x + 1.5, ROADY + 0.004, (RZ0 + RZ1) / 2); }
      /* the bunds between the paddies: a grid of low grassy dykes, the compound and the road left clear */
      { const r = rng(4661), bund = (x0, z0, x1, z1) => { const L = Math.hypot(x1 - x0, z1 - z0), b = bx(L, 0.36, 0.7, mGrassD, (x0 + x1) / 2, CMP.WATER_Y + 0.1, (z0 + z1) / 2); b.rotation.y = -Math.atan2(z1 - z0, x1 - x0); b.castShadow = false; };
        for (const zz of [-32, -55, -80, 40, 62, 86]) bund(-120, zz + (r() - 0.5) * 3, 120, zz + (r() - 0.5) * 3);
        for (const zz of [-18.5]) bund(-60, zz, 60, zz);
        for (const xx of [-24, -48, -74, -100, 22, 46, 70, 96]) { bund(xx, -110, xx + (r() - 0.5) * 4, -17); bund(xx + (r() - 0.5) * 3, 27, xx + (r() - 0.5) * 3, 110); }
        tGrass.repeat.set(1, 1); }

      /* ---- THE OLD HOUSE ON STILTS (left): sixteen posts, the floor at 2.5 m, silvered teak walls, a steep tiled gable,
         the open veranda (chan) toward the yard and its stair; underneath, where the family lives in the day */
      const H = CMP.HOUSE;
      { const xs = [-13.25, -11.65, -10.05, -8.75], zs = [-10.75, -8.55, -6.45, -4.45];
        for (const x of xs) for (const z of zs) { const p = bx(0.22, H.floor, 0.22, mTeakO, x, H.floor / 2, z); solids.push(p); }
        for (const x of [-7.6, -6.7]) for (const z of [-6.45, -4.45]) { const p = bx(0.2, H.floor, 0.2, mTeakO, x, H.floor / 2, z); solids.push(p); }
        /* the floor and its joists */
        bx(H.x1 - H.x0 + 0.4, 0.14, H.z1 - H.z0 + 0.4, mTeakY, (H.x0 + H.x1) / 2, H.floor + 0.07, (H.z0 + H.z1) / 2);
        for (const z of zs) bx(H.verX - H.x0 + 0.5, 0.2, 0.16, mTeakO, (H.x0 + H.verX) / 2 + 0.1, H.floor - 0.1, z);
        for (let x = H.x0; x <= H.x1; x += 0.6) bx(0.08, 0.12, H.z1 - H.z0, mTeakO, x, H.floor - 0.26, (H.z0 + H.z1) / 2);
        /* the veranda's deck, its rail, the stair down to the yard */
        bx(H.verX - H.x1, 0.12, 2.6, mTeakY, (H.x1 + H.verX) / 2, H.floor + 0.06, -5.45);
        for (let x = H.x1 + 0.2; x <= H.verX; x += 0.42) bx(0.05, 0.8, 0.05, mTeakO, x, H.floor + 0.5, -4.18);
        bx(H.verX - H.x1, 0.06, 0.08, mTeakO, (H.x1 + H.verX) / 2, H.floor + 0.92, -4.18);
        for (let z = -6.65; z <= -4.2; z += 0.42) bx(0.05, 0.8, 0.05, mTeakO, H.verX - 0.03, H.floor + 0.5, z);
        const SN = 9, SR = H.floor / SN;
        for (let k = 0; k < SN; k++) bx(0.32, 0.04, 1.0, mTeakY, H.verX + 0.25 + k * 0.28, H.floor - (k + 1) * SR + 0.02, -6.0);
        for (const zz of [-6.52, -5.48]) { const st = bx(Math.hypot(2.6, H.floor), 0.16, 0.06, mTeakO, H.verX + 1.3, H.floor / 2, zz); st.rotation.z = -Math.atan2(H.floor, 2.6); }
        solids.push(hidBox(2.8, 1.4, 1.2, H.verX + 1.3, 0.7, -6.0, C));
        /* the walls: boards standing on end, two windows with their shutters open, a door onto the veranda */
        const wy = H.floor + 0.14, wh = H.eave - wy, wxs = H.x1 - H.x0, wzs = H.z1 - H.z0;
        const wall = (len, x, z, ry, holes, notch) => {
          const s = new THREE.Shape(); s.moveTo(-len / 2, 0);
          if (notch) { s.lineTo(notch[0], 0); s.lineTo(notch[0], notch[1]); s.lineTo(notch[2], notch[1]); s.lineTo(notch[2], 0); }
          s.lineTo(len / 2, 0); s.lineTo(len / 2, wh); s.lineTo(-len / 2, wh); s.lineTo(-len / 2, 0);
          for (const h of holes) { const p = new THREE.Path(); p.moveTo(h[0], h[1]); p.lineTo(h[2], h[1]); p.lineTo(h[2], h[3]); p.lineTo(h[0], h[3]); p.lineTo(h[0], h[1]); s.holes.push(p); }
          const g = new THREE.ShapeGeometry(s); tBoards.repeat.set(1, 1);
          const uv = g.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) / 1.2, uv.getY(i) / 2.4);
          const m = mesh(g, mBoards, x, wy, z); m.rotation.y = ry; m.material = mBoards; return m;
        };
        wall(wzs, H.x0, (H.z0 + H.z1) / 2, -Math.PI / 2, [[-1.6, 0.9, -0.6, 2.0], [0.8, 0.9, 1.8, 2.0]]);
        wall(wzs, H.x1, (H.z0 + H.z1) / 2, Math.PI / 2, [[0.8, 0.9, 1.8, 2.0]], [-2.6, 2.0, -1.7]);   // the door onto the veranda, a window
        wall(wxs, (H.x0 + H.x1) / 2, H.z1, 0, [[-1.6, 0.9, -0.6, 2.0], [0.6, 0.9, 1.6, 2.0]]);
        wall(wxs, (H.x0 + H.x1) / 2, H.z0, Math.PI, []);
        /* behind each hole, the house's dark inside; the open shutters folded back on the boards */
        const inside = (x, y, z, w, h, ry) => { const o = flat(w, h, mDark); o.position.set(x, y, z); o.rotation.y = ry; };
        const zcH = (H.z0 + H.z1) / 2;
        inside(-12.1, wy + 1.45, H.z1 - 0.12, 1.0, 1.1, 0); inside(-9.9, wy + 1.45, H.z1 - 0.12, 1.0, 1.1, 0);
        inside(H.x1 - 0.12, wy + 1.0, zcH + 2.15, 0.9, 2.0, Math.PI / 2); inside(H.x1 - 0.12, wy + 1.45, zcH - 1.3, 1.0, 1.1, Math.PI / 2);
        for (const [x, side] of [[-12.6, -1], [-11.6, 1], [-10.4, -1], [-9.4, 1]]) { const sh = bx(0.5, 1.1, 0.04, mTeakY, x + side * 0.27, wy + 1.45, H.z1 + 0.03); sh.rotation.y = side * 0.2; }
        { const dl = bx(0.9, 2.0, 0.05, mTeakY, H.x1 + 0.47, wy + 1.0, zcH + 2.6 + 0.04); dl.rotation.y = 0.12; }   // the door, open onto the veranda
        /* the roof: a steep gable of old tiles, ridge along z, the gable ends boarded, dark bargeboards */
        const ox = 0.7, oz = 0.5, xc = (H.x0 + H.x1) / 2;
        tTiles.repeat.set(1, 1);
        const rf = (x0r, x1r) => quad([x0r, H.eave - 0.25, H.z1 + oz], [xc, H.ridge, H.z1 + oz], [xc, H.ridge, H.z0 - oz], [x0r, H.eave - 0.25, H.z0 - oz], mTiles, C, 1.6);
        rf(H.x0 - ox, xc); quad([xc, H.ridge, H.z1 + oz], [H.x1 + ox, H.eave - 0.25, H.z1 + oz], [H.x1 + ox, H.eave - 0.25, H.z0 - oz], [xc, H.ridge, H.z0 - oz], mTiles, C, 1.6);
        for (const zg of [H.z1, H.z0]) {
          const tri = new THREE.Shape(); tri.moveTo(H.x0, 0); tri.lineTo(H.x1, 0); tri.lineTo(xc, H.ridge - H.eave); tri.lineTo(H.x0, 0);
          const g = new THREE.ShapeGeometry(tri); const uv = g.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) / 1.2, uv.getY(i) / 2.4);
          const m = mesh(g, mBoards, zg === H.z0 ? 2 * xc : 0, H.eave, zg);
          if (zg === H.z0) m.rotation.y = Math.PI;                                     // (the back gable faces back: its x is mirrored about the ridge)
        }
        for (const zg of [H.z1 + oz + 0.02, H.z0 - oz - 0.02]) for (const s2 of [-1, 1]) {
          const L = Math.hypot(xc - (s2 < 0 ? H.x0 - ox : H.x1 + ox), H.ridge - (H.eave - 0.25));
          const b = bx(L + 0.2, 0.22, 0.05, mTeakY, (xc + (s2 < 0 ? H.x0 - ox : H.x1 + ox)) / 2, (H.ridge + H.eave - 0.25) / 2, zg);
          b.rotation.z = -s2 * Math.atan2(H.ridge - H.eave + 0.25, xc - (H.x0 - ox));
        }
        bx(0.2, 0.16, H.z1 - H.z0 + 2 * oz + 0.1, mRust, xc, H.ridge + 0.06, (H.z0 + H.z1) / 2);
        /* under the house: a bamboo bench, a hammock, water jars, a motorbike, an old fridge, the TV (heard), sacks of
           rice, chillies drying on a mat; the laundry on a line along the back, over no path */
        const mBamboo = M({ color: 0xb89a5a, roughness: 0.7 });
        bx(1.9, 0.06, 0.95, mBamboo, -11.0, 0.46, -7.6); for (const [lx, lz] of [[-11.9, -7.2], [-10.1, -7.2], [-11.9, -8.0], [-10.1, -8.0]]) bx(0.07, 0.44, 0.07, mBamboo, lx, 0.22, lz);
        for (let k = 0; k < 12; k++) bx(1.9, 0.012, 0.012, M({ color: 0x8a7240, roughness: 0.8 }), -11.0, 0.495, -7.98 + k * 0.07);
        solids.push(hidBox(1.9, 0.6, 0.95, -11.0, 0.3, -7.6, C));
        { const hg = new THREE.PlaneGeometry(0.8, 1.9, 4, 16); hg.rotateX(-Math.PI / 2); const P = hg.attributes.position;
          for (let i = 0; i < P.count; i++) { const zz = P.getZ(i) / 0.95, xx = P.getX(i) / 0.4; P.setY(i, -0.48 * (1 - zz * zz) + 0.1 * xx * xx); }
          hg.computeVertexNormals();
          const hm = new THREE.Mesh(hg, M({ map: tex(makeDressCloth(THREE, cnv, 4671, '#2a5a8a', 'rgba(230,200,80,0.8)')), roughness: 0.9, side: THREE.DoubleSide }));
          hm.position.set(-10.05, 1.55, -9.65); C.add(hm);
          for (const zz of [-8.7, -10.6]) { const rp = cyl(0.008, 0.008, 0.2, M({ color: 0xd8c8a0, roughness: 0.8 }), -10.05, 1.6, zz, 4); rp.rotation.x = Math.PI / 2; } }
        const mJar = M({ color: 0x4a2a18, roughness: 0.25, metalness: 0.05 });
        for (const [jx, jz, s3] of [[-13.0, -5.0, 1], [-12.4, -4.7, 0.85], [-6.2, -9.6, 0.9]]) {
          const j = lathe([[0, 0], [0.22, 0], [0.34, 0.25], [0.36, 0.42], [0.3, 0.6], [0.2, 0.68], [0.21, 0.72]], mJar, jx, 0, jz, 20); j.scale.setScalar(s3);
          cyl(0.24 * s3, 0.24 * s3, 0.02, mSteel, jx, 0.73 * s3, jz, 18); solids.push(hidBox(0.7 * s3, 0.8, 0.7 * s3, jx, 0.4, jz, C));
        }
        buildMotorbike(-12.2, -9.9, 0.4);
        const fr = bx(0.62, 1.5, 0.62, M({ color: 0xd4ccb4, roughness: 0.4 }), -13.0, 0.75, -10.4); solids.push(fr);
        bx(0.6, 0.004, 0.02, M({ color: 0x8a8678, roughness: 0.5 }), -13.0, 1.05, -10.08);
        bx(0.9, 0.55, 0.45, mTeakY, -8.95, 0.27, -10.45); solids.push(hidBox(0.9, 0.6, 0.45, -8.95, 0.3, -10.45, C));
        bx(0.62, 0.42, 0.36, mDark, -8.95, 0.78, -10.45);
        const tvM = B({ color: 0x5a7aa0 }); yard.tvMat = tvM;
        { const scr = flat(0.52, 0.32, tvM); scr.position.set(-8.95, 0.79, -10.265); }
        for (let k = 0; k < 3; k++) { const sk = mesh(new THREE.CapsuleGeometry(0.2, 0.3, 4, 8), M({ color: 0xe8e2d0, roughness: 0.95 }), -6.95, 0.22 + (k === 2 ? 0.36 : 0), -10.2 + k * 0.42 - (k === 2 ? 0.63 : 0)); sk.rotation.z = Math.PI / 2; sk.scale.set(1, 1, 0.8); }
        { const cm = flat(1.6, 1.0, M({ map: tex(makeChilliMat(THREE, cnv)), roughness: 0.9 })); cm.rotation.set(-Math.PI / 2, 0, 0.1); cm.position.set(-7.0, 0.012, -1.6); }
        /* the laundry line, between the two back posts and a pole, over the back of the plot where nobody walks */
        { const ly = 2.05, lz = -11.9, x0l = -13.6, x1l = -8.4;
          cyl(0.04, 0.05, 2.1, mTeakO, x0l, 1.05, lz); cyl(0.04, 0.05, 2.1, mTeakO, x1l, 1.05, lz);
          bx(x1l - x0l, 0.008, 0.008, M({ color: 0x3a3a3a, roughness: 0.6 }), (x0l + x1l) / 2, ly, lz);
          const cl = [['#d8d4c8', 0.55, 0.7], ['#b4282c', 0.5, 0.9], ['#2a6a9a', 0.62, 0.55], ['#e8c040', 0.48, 0.62], ['#5a8a4a', 0.9, 0.75], ['#ece8e0', 0.5, 0.5]];
          let px = x0l + 0.5;
          cl.forEach(([col, w, h], k) => { const pc = flat(w, h, M({ color: new THREE.Color(col), roughness: 0.9, side: THREE.DoubleSide })); pc.position.set(px + w / 2, ly - h / 2, lz); pc.rotation.y = (k % 2 ? 0.05 : -0.04); px += w + 0.18; });
        }
      }

      /* ---- THE WAITING SALA (centre): a raised concrete floor and its steps, six white posts, a hipped roof of red
         zinc, two benches toward the master's door, the queue's whiteboard, a water dispenser, a standing fan */
      const SL = CMP.SALA;
      { const sxc = (SL.x0 + SL.x1) / 2, szc = (SL.z0 + SL.z1) / 2;
        const fl = bx(SL.x1 - SL.x0, SL.floor, SL.z1 - SL.z0, mConcW, sxc, SL.floor / 2, szc);
        for (const [k, sy] of [[0, 0.22], [1, 0.11]]) bx(2.2, sy, 0.3, mConcW, sxc, sy / 2, SL.z1 + 0.15 + k * 0.3);
        for (const x of [SL.x0 + 0.15, sxc, SL.x1 - 0.15]) for (const z of [SL.z0 + 0.15, SL.z1 - 0.15]) { const p = bx(0.18, 2.6, 0.18, mWhite, x, SL.floor + 1.3, z); solids.push(p); }
        bx(SL.x1 - SL.x0 + 0.2, 0.16, 0.12, mWhite, sxc, SL.floor + 2.6, SL.z0 + 0.15); bx(SL.x1 - SL.x0 + 0.2, 0.16, 0.12, mWhite, sxc, SL.floor + 2.6, SL.z1 - 0.15);
        bx(0.12, 0.16, SL.z1 - SL.z0, mWhite, SL.x0 + 0.15, SL.floor + 2.6, szc); bx(0.12, 0.16, SL.z1 - SL.z0, mWhite, SL.x1 - 0.15, SL.floor + 2.6, szc);
        const ey = SL.floor + 2.68, ry = ey + 1.1, ex0 = SL.x0 - 0.6, ex1 = SL.x1 + 0.6, ez0 = SL.z0 - 0.6, ez1 = SL.z1 + 0.6, rx0 = sxc - 1.6, rx1 = sxc + 1.6;
        tZincRed.repeat.set(1, 1);
        quad([ex0, ey, ez1], [ex1, ey, ez1], [rx1, ry, szc], [rx0, ry, szc], mZincR, C, 1.2);
        quad([ex1, ey, ez0], [ex0, ey, ez0], [rx0, ry, szc], [rx1, ry, szc], mZincR, C, 1.2);
        quad([ex0, ey, ez0], [ex0, ey, ez1], [rx0, ry, szc], [rx0, ry, szc], mZincR, C, 1.2);
        quad([ex1, ey, ez1], [ex1, ey, ez0], [rx1, ry, szc], [rx1, ry, szc], mZincR, C, 1.2);
        /* the roof's underside, seen from the benches: a dark plane under each slope */
        quad([rx0, ry - 0.03, szc], [rx1, ry - 0.03, szc], [ex1, ey - 0.03, ez1], [ex0, ey - 0.03, ez1], mTeakO, C, 1.2);
        quad([rx1, ry - 0.03, szc], [rx0, ry - 0.03, szc], [ex0, ey - 0.03, ez0], [ex1, ey - 0.03, ez0], mTeakO, C, 1.2);
        for (const zz of [ez0, ez1]) bx(ex1 - ex0, 0.14, 0.03, mWhite, sxc, ey - 0.05, zz);
        for (const xx of [ex0, ex1]) bx(0.03, 0.14, ez1 - ez0, mWhite, xx, ey - 0.05, szc);
        cyl(0.012, 0.012, 0.5, mWhite, sxc, ey + 0.55, szc, 6); cyl(0.08, 0.08, 0.08, mWhite, sxc, ey + 0.28, szc, 14);
        for (let k = 0; k < 3; k++) { const a = k / 3 * Math.PI * 2, bl = bx(0.55, 0.008, 0.11, mWhite, sxc + Math.cos(a) * 0.36, ey + 0.25, szc + Math.sin(a) * 0.36); bl.rotation.y = -a; }
        /* the benches, along z, the waiting facing +x (the master's door) */
        for (const bxp of [-1.6, 0.4]) {
          bx(0.42, 0.05, 2.6, mTeakY, bxp, SL.floor + 0.42, szc - 0.2);
          for (const bz of [szc - 1.35, szc + 0.95]) { bx(0.06, 0.4, 0.06, mTeakY, bxp - 0.16, SL.floor + 0.2, bz); bx(0.06, 0.4, 0.06, mTeakY, bxp + 0.16, SL.floor + 0.2, bz); }
          solids.push(hidBox(0.42, 0.5, 2.6, bxp, SL.floor + 0.25, szc - 0.2, C));
        }
        /* the water dispenser and its cups, the standing fan */
        bx(0.32, 0.95, 0.32, mWhite, SL.x0 + 0.4, SL.floor + 0.475, SL.z0 + 0.4);
        lathe([[0, 0], [0.13, 0], [0.135, 0.3], [0.08, 0.38], [0.04, 0.4], [0.04, 0.43]], M({ color: 0x5aa0d8, roughness: 0.05, metalness: 0.1, transparent: true, opacity: 0.75 }), SL.x0 + 0.4, SL.floor + 0.95, SL.z0 + 0.4, 18);
        cyl(0.032, 0.026, 0.3, mWhite, SL.x0 + 0.62, SL.floor + 0.8, SL.z0 + 0.4, 10);
        solids.push(hidBox(0.4, 1.4, 0.4, SL.x0 + 0.45, 0.7, SL.z0 + 0.4, C));
        { const fx = SL.x1 - 0.55, fz = SL.z0 + 0.55;
          cyl(0.2, 0.22, 0.04, M({ color: 0x3a4a6a, roughness: 0.5 }), fx, SL.floor + 0.02, fz, 18);
          cyl(0.016, 0.016, 1.15, mSteel, fx, SL.floor + 0.6, fz, 8);
          const head = new THREE.Group(); head.position.set(fx, SL.floor + 1.22, fz); C.add(head); head.userData.dyn = true;
          const mot = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.07, 0.14, 12), M({ color: 0x3a4a6a, roughness: 0.5 })); mot.rotation.x = Math.PI / 2; mot.position.z = -0.08; head.add(mot);
          head.add(new THREE.Mesh(new THREE.TorusGeometry(0.19, 0.006, 6, 32), mSteel));
          const blades = new THREE.Group(); head.add(blades);
          for (let k = 0; k < 3; k++) { const b2 = new THREE.Mesh(new THREE.CircleGeometry(0.09, 8, -0.5, 1.0), M({ color: 0x8ab0d0, roughness: 0.3, transparent: true, opacity: 0.85, side: THREE.DoubleSide })); b2.rotation.z = k * Math.PI * 2 / 3; b2.scale.set(1.8, 1, 1); blades.add(b2); }
          yard.standFan = { head, blades, base: -0.8 };
          solids.push(hidBox(0.44, 1.4, 0.44, fx, 0.7, fz, C)); }
        /* the queue's whiteboard on its stand at the sala's front corner — Pa Noi writes the numbers (CP8) */
        { const B0 = CMP.BOARD, bc = cnv(512)[0]; bc.height = 224;
          const bt = tex(done(THREE, bc, false)); drawQueueBoard(bc.getContext('2d'), 512, 224, yard.boardN); bt.needsUpdate = true;
          yard.board = { canvas: bc, tex: bt };
          const bdm = flat(1.1, 0.48, M({ map: bt, roughness: 0.4 })); bdm.position.set(B0.x, SL.floor + 1.35, B0.z); bdm.rotation.y = -0.35;
          const back = bx(1.14, 0.52, 0.03, mSteel, B0.x + Math.sin(-0.35) * -0.02, SL.floor + 1.35, B0.z - 0.02); back.rotation.y = -0.35;
          for (const s2 of [-1, 1]) { const lg = bx(0.03, 1.35, 0.03, mSteel, B0.x + s2 * 0.5 * Math.cos(0.35), SL.floor + 0.675, B0.z + s2 * 0.5 * Math.sin(0.35) - 0.06); lg.rotation.x = -0.06; }
          solids.push(hidBox(1.1, 1.4, 0.3, B0.x, 0.7, B0.z, C)); }
        void fl;
      }

      /* ---- THE MASTER'S RECEIVING ROOM, outside (right): a newer concrete room on a plinth, pale paint, a low zinc
         roof, louvred windows, the open door at the top of three steps under a small awning, a jar of water by them to
         wash the feet. (Its inside is World R.) */
      const RX0 = CMP.ROOMX;
      { const xc = (RX0.x0 + RX0.x1) / 2, zc = (RX0.z0 + RX0.z1) / 2, w = RX0.x1 - RX0.x0, d = RX0.z1 - RX0.z0;
        bx(w + 0.1, RX0.base, d + 0.1, mConc, xc, RX0.base / 2, zc);
        const mRoomW = M({ map: tex(makeConcreteT(THREE, cnv, 4681, '#bcd6c8')), roughness: 0.9 });
        const body = bx(w, RX0.top - RX0.base, d, mRoomW, xc, (RX0.top + RX0.base) / 2, zc); walls.push(hidBox(w + 0.2, 3, d + 0.2, xc, 1.5, zc, C)); void body;
        const DX = 7.9, dw = 0.9, dh = 2.05;
        { const o = flat(dw, dh, mDark); o.position.set(DX, RX0.base + dh / 2, RX0.z1 + 0.012); }
        { const gl = flat(dw * 0.9, dh * 0.6, B({ map: tGlowY, color: 0x9ad8b8, transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending, depthWrite: false })); gl.position.set(DX, RX0.base + dh * 0.62, RX0.z1 + 0.016); }
        bx(0.07, dh + 0.07, 0.06, mTeakY, DX - dw / 2 - 0.035, RX0.base + (dh + 0.07) / 2, RX0.z1 + 0.03);
        bx(0.07, dh + 0.07, 0.06, mTeakY, DX + dw / 2 + 0.035, RX0.base + (dh + 0.07) / 2, RX0.z1 + 0.03);
        bx(dw + 0.14, 0.07, 0.06, mTeakY, DX, RX0.base + dh + 0.035, RX0.z1 + 0.03);
        /* the doorway dressed as a Thai room's is: a printed cotton curtain on a rod, a pelmet across the top and the two
           panels hitched to the jambs, so the dark between them is a room and not a hole (CP8, by photograph: from the
           steps the bare doorway was a black slab with a mark floating in it). The room's own print. */
        { const tC = tex(makeCurtainPrint(THREE, cnv)); tC.repeat.set(1.0, 2.2);
          const mC = M({ map: tC, roughness: 0.92, side: THREE.DoubleSide }), zc2 = RX0.z1 + 0.045;
          const wave = (w2, h2, n, a) => { const g = new THREE.PlaneGeometry(w2, h2, 14, 1), ps = g.attributes.position;
            for (let i = 0; i < ps.count; i++) { const u = (ps.getX(i) + w2 / 2) / w2; ps.setZ(i, a * Math.sin(u * Math.PI * 2 * n)); }
            ps.needsUpdate = true; g.computeVertexNormals(); return g; };
          mesh(wave(dw + 0.04, 0.3, 6, 0.012), mC, DX, RX0.base + dh - 0.15, zc2 + 0.006);
          for (const s2 of [-1, 1]) mesh(wave(0.24, dh - 0.36, 2.5, 0.016), mC, DX + s2 * (dw / 2 - 0.12), RX0.base + (dh - 0.3) / 2 + 0.02, zc2);
          cyl(0.009, 0.009, dw + 0.12, mSteel, DX, RX0.base + dh - 0.01, zc2 + 0.012, 8).rotation.z = Math.PI / 2; }
        for (let k = 0; k < 3; k++) bx(1.5, RX0.base * (3 - k) / 3, 0.3, mConc, DX, RX0.base * (3 - k) / 6, RX0.z1 + 0.15 + k * 0.3);
        solids.push(hidBox(1.5, 0.5, 0.9, DX, 0.25, RX0.z1 + 0.45, C));
        quad([DX - 1.0, 2.95, RX0.z1], [DX + 1.0, 2.95, RX0.z1], [DX + 1.0, 2.7, RX0.z1 + 1.1], [DX - 1.0, 2.7, RX0.z1 + 1.1], mZinc, C, 1.2);
        for (const s2 of [-1, 1]) { const br = bx(0.04, 0.04, 1.0, mSteel, DX + s2 * 0.85, 2.72, RX0.z1 + 0.5); br.rotation.x = -0.3; }
        const jar = lathe([[0, 0], [0.2, 0], [0.3, 0.22], [0.31, 0.38], [0.24, 0.52], [0.25, 0.55]], M({ color: 0x5a3a24, roughness: 0.3 }), DX + 1.25, 0, RX0.z1 + 0.5, 18); void jar;
        cyl(0.27, 0.27, 0.01, M({ color: 0x5a6a72, roughness: 0.05, metalness: 0.4 }), DX + 1.25, 0.5, RX0.z1 + 0.5, 18);
        solids.push(hidBox(0.6, 0.6, 0.6, DX + 1.25, 0.3, RX0.z1 + 0.5, C));
        /* windows: dark louvres in green frames, a sill under each */
        const tLouv = (() => { const [c2, x2] = sized(cnv, 64, 128); x2.fillStyle = '#20262c'; x2.fillRect(0, 0, 64, 128); for (let y = 0; y < 128; y += 14) { x2.fillStyle = '#7a8a94'; x2.fillRect(0, y, 64, 3); x2.fillStyle = '#3a444c'; x2.fillRect(0, y + 3, 64, 5); } return tex(done(THREE, c2, true)); })();
        const mLouv = M({ map: tLouv, roughness: 0.3, metalness: 0.2 });
        const win = (x, z, ry, wd) => {
          const g = flat(wd, 1.2, mLouv); g.position.set(x, RX0.base + 1.55, z); g.rotation.y = ry;
          const fr2 = (fw, fh, dx2, dy2) => { const b = bx(fw, fh, 0.05, mGreenP, 0, 0, 0); b.position.set(x + Math.cos(ry) * dx2 + Math.sin(ry) * 0.025, RX0.base + 1.55 + dy2, z - Math.sin(ry) * dx2 + Math.cos(ry) * 0.025); b.rotation.y = ry; };
          fr2(wd + 0.1, 0.06, 0, 0.62); fr2(wd + 0.1, 0.06, 0, -0.62); fr2(0.06, 1.3, -wd / 2, 0); fr2(0.06, 1.3, wd / 2, 0); fr2(0.05, 1.2, 0, 0);
          const sl = bx(wd + 0.2, 0.05, 0.12, mConc, 0, 0, 0); sl.position.set(x + Math.sin(ry) * 0.06, RX0.base + 0.92, z + Math.cos(ry) * 0.06); sl.rotation.y = ry;
        };
        win(RX0.x0 - 0.012, -8.2, -Math.PI / 2, 1.5); win(RX0.x1 + 0.012, -8.0, Math.PI / 2, 1.5);
        win(RX0.x0 + 2.8, RX0.z0 - 0.012, Math.PI, 1.2);
        /* the roof: a low gable of zinc, ridge along x */
        tZinc.repeat.set(1, 1);
        const oy = RX0.top, ory = oy + 0.8, ozz = 0.55, oxx = 0.45;
        quad([RX0.x0 - oxx, oy - 0.05, RX0.z1 + ozz], [RX0.x1 + oxx, oy - 0.05, RX0.z1 + ozz], [RX0.x1 + oxx, ory, zc], [RX0.x0 - oxx, ory, zc], mZinc, C, 1.2);
        quad([RX0.x1 + oxx, oy - 0.05, RX0.z0 - ozz], [RX0.x0 - oxx, oy - 0.05, RX0.z0 - ozz], [RX0.x0 - oxx, ory, zc], [RX0.x1 + oxx, ory, zc], mZinc, C, 1.2);
        for (const xg of [RX0.x0, RX0.x1]) {
          const tri = new THREE.Shape(); tri.moveTo(-d / 2, 0); tri.lineTo(d / 2, 0); tri.lineTo(0, ory - oy); tri.lineTo(-d / 2, 0);
          const m = mesh(new THREE.ShapeGeometry(tri), mRoomW, xg, oy, zc); m.rotation.y = xg === RX0.x0 ? -Math.PI / 2 : Math.PI / 2;
        }
        bx(w + 2 * oxx + 0.05, 0.08, 0.1, mSteel, xc, ory + 0.02, zc);
      }

      /* ---- THE GATE: two white concrete posts with red caps, the hand-painted sign over the way in, the steel gates
         folded back against the fence; the fence itself — concrete posts and four strands of wire round the plot,
         a low wall either side of the gate */
      { const GX = GATE.w / 2;
        for (const s2 of [-1, 1]) {
          bx(0.42, 2.5, 0.42, mConcW, s2 * GX, 1.25, GATE.z); bx(0.5, 0.12, 0.5, M({ color: 0xa8241c, roughness: 0.6 }), s2 * GX, 2.56, GATE.z);
          lathe([[0, 0], [0.12, 0], [0.1, 0.1], [0.04, 0.22], [0, 0.26]], M({ color: 0xa8241c, roughness: 0.6 }), s2 * GX, 2.62, GATE.z, 12);
          const gt = new THREE.Group(); gt.position.set(s2 * (GX - 0.22), 0, GATE.z - 0.1); gt.rotation.y = Math.PI + s2 * 0.15; C.add(gt);
          bx(1.8, 0.05, 0.04, mGreenP, -s2 * 0.9, 1.5, 0, gt); bx(1.8, 0.05, 0.04, mGreenP, -s2 * 0.9, 0.2, 0, gt);
          for (let k = 0; k <= 9; k++) bx(0.025, 1.3, 0.025, mGreenP, -s2 * (0.05 + k * 0.19), 0.85, 0, gt);
        }
        bx(GATE.w + 0.6, 0.12, 0.16, mConcW, 0, 3.08, GATE.z);
        { const sg = flat(2.6, 0.81, M({ map: tex(makeGateSign(THREE, cnv)), roughness: 0.7 })); sg.position.set(0, 2.62, GATE.z + 0.09); }
        bx(2.7, 0.88, 0.05, mSteel, 0, 2.62, GATE.z + 0.06);
        for (const s2 of [-1, 1]) { bx(0.06, 0.5, 0.06, mSteel, s2 * 1.1, 3.05, GATE.z + 0.06); }
        /* the low wall either side, then posts and wire round the rest */
        bx(F.x1 - GX - 0.2, 0.7, 0.18, mConcW, (GX + 0.2 + F.x1) / 2, 0.35, F.z1); bx(-GX - 0.2 - F.x0, 0.7, 0.18, mConcW, (F.x0 - GX - 0.2) / 2, 0.35, F.z1);
        const posts = [], run = (x0, z0, x1, z1) => { const L = Math.hypot(x1 - x0, z1 - z0), n = Math.max(1, Math.round(L / 2.5)); for (let k = 0; k <= n; k++) posts.push([x0 + (x1 - x0) * k / n, z0 + (z1 - z0) * k / n]); };
        run(F.x0, F.z1, F.x0, F.z0); run(F.x0, F.z0, F.x1, F.z0); run(F.x1, F.z0, F.x1, F.z1);
        for (const [px, pz] of posts) bx(0.12, 1.5, 0.12, mConc, px, 0.75, pz);
        for (let x = F.x0; x <= F.x1; x += 2.5) if (Math.abs(x) > GX + 0.3) bx(0.12, 1.5, 0.12, mConc, x, 0.75, F.z1);
        const strand = (x0, z0, x1, z1, y) => { const L = Math.hypot(x1 - x0, z1 - z0); const s3 = cyl(0.006, 0.006, L, mWire, (x0 + x1) / 2, y, (z0 + z1) / 2, 3); s3.rotation.set(0, -Math.atan2(z1 - z0, x1 - x0), Math.PI / 2); s3.castShadow = false; };
        for (const y of [0.45, 0.8, 1.15, 1.45]) { strand(F.x0, F.z1, F.x0, F.z0, y); strand(F.x0, F.z0, F.x1, F.z0, y); strand(F.x1, F.z0, F.x1, F.z1, y); }
        walls.push(hidBox(0.3, 2, F.z1 - F.z0, F.x0, 1, (F.z0 + F.z1) / 2, C), hidBox(F.x1 - F.x0, 2, 0.3, (F.x0 + F.x1) / 2, 1, F.z0, C),
                   hidBox(0.3, 2, F.z1 - F.z0, F.x1, 1, (F.z0 + F.z1) / 2, C),
                   hidBox(F.x1 - GX, 2, 0.3, (GX + F.x1) / 2, 1, F.z1, C), hidBox(-GX - F.x0, 2, 0.3, (F.x0 - GX) / 2, 1, F.z1, C));
        /* the lane's sides and its far end (the road beyond is the films') */
        walls.push(hidBox(0.3, 2, 7, -3.4, 1, F.z1 + 3.5, C), hidBox(0.3, 2, 7, 3.4, 1, F.z1 + 3.5, C), hidBox(7.2, 2, 0.3, 0, 1, 14.4, C));
      }

      /* ---- the compound's spirit house: weathered concrete on its pillar by the gate, faded red and gold, its
         offerings — a red soda with a straw, water, rice, incense, a garland (no figurines: E4-MODELS) */
      { const S0 = CMP.SPIRIT, mSp = M({ map: tex(makeConcreteT(THREE, cnv, 4691, '#c4bcae')), roughness: 0.9 }), mRedF = M({ color: 0x9a3a2c, roughness: 0.8, side: THREE.DoubleSide }), mGoldF = M({ color: 0xb08a3a, roughness: 0.5, metalness: 0.5 });
        bx(0.26, 1.35, 0.26, mSp, S0.x, 0.675, S0.z); bx(0.9, 0.07, 0.9, mSp, S0.x, 1.38, S0.z);
        for (const [dx, dz] of [[-0.42, 0], [0.42, 0], [0, -0.42]]) bx(dz ? 0.86 : 0.04, 0.12, dz ? 0.04 : 0.86, mSp, S0.x + dx, 1.47, S0.z + dz);
        bx(0.46, 0.4, 0.4, mSp, S0.x, 1.62, S0.z - 0.12); bx(0.16, 0.26, 0.02, mRedF, S0.x, 1.58, S0.z + 0.085);
        const ry2 = 1.82, rp = 2.12;
        quad([S0.x - 0.3, ry2, S0.z + 0.14], [S0.x + 0.3, ry2, S0.z + 0.14], [S0.x + 0.3, rp, S0.z - 0.12], [S0.x - 0.3, rp, S0.z - 0.12], mRedF);
        quad([S0.x + 0.3, ry2, S0.z - 0.38], [S0.x - 0.3, ry2, S0.z - 0.38], [S0.x - 0.3, rp, S0.z - 0.12], [S0.x + 0.3, rp, S0.z - 0.12], mRedF);
        for (const sx2 of [-0.3, 0.3]) { const ch = bx(0.02, 0.16, 0.02, mGoldF, S0.x + sx2, rp + 0.04, S0.z - 0.12); ch.rotation.z = sx2 > 0 ? -0.5 : 0.5; }
        cyl(0.018, 0.018, 0.13, M({ color: 0xc8141c, roughness: 0.15, transparent: true, opacity: 0.9 }), S0.x + 0.22, 1.48, S0.z + 0.25, 10);
        cyl(0.0025, 0.0025, 0.12, M({ color: 0xf2f2f2, roughness: 0.5 }), S0.x + 0.225, 1.58, S0.z + 0.25, 4).rotation.z = 0.2;
        cyl(0.025, 0.02, 0.06, M({ color: 0xcfe2e8, roughness: 0.05, transparent: true, opacity: 0.5 }), S0.x - 0.2, 1.45, S0.z + 0.26, 10);
        lathe([[0, 0], [0.05, 0], [0.06, 0.03]], mGoldF, S0.x, 1.415, S0.z + 0.26, 14);
        for (let k = 0; k < 4; k++) { const s3 = cyl(0.002, 0.002, 0.18, M({ color: 0xa82a1c, roughness: 0.8 }), S0.x + (k - 1.5) * 0.012, 1.5, S0.z + 0.3, 4); s3.rotation.z = (k - 1.5) * 0.06; }
        const jas = new THREE.InstancedMesh(new THREE.SphereGeometry(0.009, 5, 4), M({ color: 0xf2eedc, roughness: 0.7 }), 30);
        for (let k = 0; k < 30; k++) { const u = k / 29; m4.makeTranslation(S0.x - 0.22 + u * 0.44, 1.78 - Math.sin(u * Math.PI) * 0.06, S0.z + 0.09); jas.setMatrixAt(k, m4); }
        C.add(jas);
        solids.push(hidBox(0.9, 1.6, 0.9, S0.x, 0.8, S0.z, C));
      }

      /* ---- the roadside shelter across the lane, by the road (ending D waits out the rain in it) */
      { const S1 = CMP.SHELTER;
        bx(2.6, 0.12, 1.6, mConc, S1.x, 0.06, S1.z);
        bx(2.2, 0.06, 0.4, mConcW, S1.x, 0.45, S1.z + 0.4); for (const dx of [-0.9, 0.9]) bx(0.1, 0.39, 0.3, mConcW, S1.x + dx, 0.25, S1.z + 0.4);
        for (const dx of [-1.15, 1.15]) for (const dz of [-0.65, 0.65]) bx(0.1, 2.3, 0.1, mWhite, S1.x + dx, 1.27, S1.z + dz);
        quad([S1.x - 1.4, 2.4, S1.z + 0.95], [S1.x + 1.4, 2.4, S1.z + 0.95], [S1.x + 1.4, 2.85, S1.z], [S1.x - 1.4, 2.85, S1.z], mZincR, C, 1.2);
        quad([S1.x + 1.4, 2.4, S1.z - 0.95], [S1.x - 1.4, 2.4, S1.z - 0.95], [S1.x - 1.4, 2.85, S1.z], [S1.x + 1.4, 2.85, S1.z], mZincR, C, 1.2);
      }

      /* ---- the poles and the wires: concrete poles along the road's far side, three conductors and a lower line,
         and a service drop from the pole by the lane to the house and the room */
      { const PZ = RZ1 + 0.6, PH = 8.6, poles = [];
        for (let x = -114; x <= 114; x += 38) poles.push(x);
        for (const x of poles) {
          const p = bx(0.22, PH, 0.22, mConc, x, ROADY + PH / 2 - 0.3, PZ); p.castShadow = false;
          bx(1.7, 0.1, 0.12, mConc, x, ROADY + PH - 0.6, PZ);
          for (const dx of [-0.75, 0, 0.75]) cyl(0.03, 0.03, 0.12, M({ color: 0xc8c8c0, roughness: 0.3 }), x + dx, ROADY + PH - 0.48, PZ, 6);
        }
        const sag = (a, b, s3, rad = 0.012) => {
          const pts = []; for (let k = 0; k <= 12; k++) { const u = k / 12; pts.push(new THREE.Vector3(a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u - s3 * 4 * u * (1 - u), a[2] + (b[2] - a[2]) * u)); }
          const m = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 12, rad, 3), mWire); m.castShadow = false; C.add(m);
        };
        for (let i = 0; i < poles.length - 1; i++) for (const dx of [-0.75, 0, 0.75]) sag([poles[i] + dx, ROADY + PH - 0.42, PZ], [poles[i + 1] + dx, ROADY + PH - 0.42, PZ], 1.1);
        for (let i = 0; i < poles.length - 1; i++) sag([poles[i], ROADY + PH - 1.6, PZ - 0.12], [poles[i + 1], ROADY + PH - 1.6, PZ - 0.12], 1.3);
        const LP = [4.4, 0, 15.8], lh = 7.2;
        bx(0.2, lh, 0.2, mConc, LP[0], lh / 2, LP[2]).castShadow = false;
        bx(0.8, 0.08, 0.1, mConc, LP[0], lh - 0.4, LP[2]);
        bx(0.4, 0.55, 0.3, M({ color: 0x8a8a84, roughness: 0.5 }), LP[0] + 0.3, lh - 1.4, LP[2]);
        sag([LP[0], lh - 0.35, LP[2]], [0, ROADY + PH - 1.6, PZ], 0.6);
        sag([LP[0], lh - 0.5, LP[2]], [-8.6, CMP.HOUSE.eave - 0.2, -4.4], 0.9, 0.009);
        sag([LP[0], lh - 0.6, LP[2]], [9.4, CMP.ROOMX.top + 0.3, -6.4], 0.7, 0.009);
      }

      /* ---- the cars under the rain tree (four, built in code like the buses at v21.14 — generic, no makers' marks) and
         Pong's white double-cab at the gate */
      [[8.3, 3.6, 0xb8bcc0, 'sedan'], [10.6, 3.4, 0x6a1a1e, 'sedan'], [12.9, 3.7, 0xe8e8e4, 'suv']].forEach(([x, z, col, kind]) => { const c2 = buildCar(kind, col); c2.position.set(x, 0, z); c2.rotation.y = 0.04; C.add(c2); solids.push(hidBox(1.9, 1.6, 4.6, x, 0.8, z, C)); });
      { const pk = buildCar('pickup', 0xf0f0ec); pk.position.set(CMP.PICKUP.x, 0, CMP.PICKUP.z); C.add(pk); yard.pickup = pk; solids.push(hidBox(1.95, 1.9, 5.3, CMP.PICKUP.x, 0.95, CMP.PICKUP.z, C)); }

      /* ---- puddles: the storm's sky again, in the ruts of the yard and the lane */
      { const r = rng(4701);
        const pud = [[-1.2, 4.2, 1.3, 0.6], [1.6, 6.4, 0.9, 0.45], [-0.4, 11.5, 1.5, 0.7], [5.6, 2.4, 1.1, 0.5], [-4.2, -0.6, 0.8, 0.4], [3.6, -5.2, 1.0, 0.5], [-2.0, 9.4, 0.7, 0.35], [1.2, 12.6, 1.2, 0.55]];
        const wet = B({ map: tGlowY, color: 0x000000, transparent: true, opacity: 0.38, depthWrite: false });
        for (const [px, pz, rx, rz] of pud) {
          const d = flat(rx * 3.0, rz * 3.0, wet); d.rotation.x = -Math.PI / 2; d.position.set(px, 0.006, pz);
          const g = new THREE.CircleGeometry(1, 20); g.rotateX(-Math.PI / 2);
          const P = g.attributes.position; for (let i = 1; i < P.count; i++) { const k = 0.8 + r() * 0.35; P.setX(i, P.getX(i) * k); P.setZ(i, P.getZ(i) * k); }
          const pm = new THREE.Mesh(g, puddle); pm.scale.set(rx, 1, rz); pm.position.set(px, 0.012, pz); pm.rotation.y = r() * 3; pm.userData.dyn = true; C.add(pm);
        }
      }
      /* ---- the worn ways: darker, packed earth where the feet and the tyres go — gate to sala, sala to the room's door,
         the house's stair to the sala, the gate to the cars (a yard's one flat red is what made it read as a carpet) */
      { const worn = B({ map: tGlowY, color: 0x000000, transparent: true, opacity: 0.2, depthWrite: false });
        const way = (x0, z0, x1, z1, w) => { const L = Math.hypot(x1 - x0, z1 - z0); const d = flat(w, L + w, worn); d.rotation.set(-Math.PI / 2, 0, Math.atan2(-(x1 - x0), -(z1 - z0))); d.position.set((x0 + x1) / 2, 0.004, (z0 + z1) / 2); };
        way(0, 9.4, 0, 1.0, 2.8); way(1.8, -1.6, RDOOR.x - 0.4, RDOOR.z + 1.4, 1.7); way(-2.2, -1.4, CMP.HOUSE.verX + 2.4, -6.0, 1.5);
        way(0.6, 7.8, 8.6, 5.0, 2.4); way(-1.6, 1.0, CMP.SPIRIT.x + 0.6, CMP.SPIRIT.z - 0.4, 1.1); }
    }

    /* a motorbike (an underbone, the country's workhorse): two wheels, the frame, a seat, the bars, a basket */
    function buildMotorbike(x, z, ry) {
      const G = new THREE.Group(); G.position.set(x, 0, z); G.rotation.y = ry; worldC.add(G);
      const mT = M({ color: 0x1a1a1a, roughness: 0.8 }), mB = M({ color: 0xa81c20, roughness: 0.35, metalness: 0.2 }), mC = M({ color: 0x9a9ea2, roughness: 0.3, metalness: 0.8 });
      for (const zz of [-0.62, 0.62]) { const w = new THREE.Mesh(new THREE.TorusGeometry(0.26, 0.05, 8, 20), mT); w.position.set(0, 0.3, zz); w.rotation.y = Math.PI / 2; G.add(w);
        const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.1, 12), mC); hub.rotation.z = Math.PI / 2; hub.position.set(0, 0.3, zz); G.add(hub); }
      const add = (g, m, px, py, pz, rx = 0) => { const o = new THREE.Mesh(g, m); o.position.set(px, py, pz); o.rotation.x = rx; o.castShadow = !LOW; G.add(o); return o; };
      add(new THREE.BoxGeometry(0.22, 0.32, 0.7), mB, 0, 0.5, -0.05);
      add(new THREE.BoxGeometry(0.26, 0.09, 0.6), M({ color: 0x1a1a1a, roughness: 0.7 }), 0, 0.78, -0.22);
      add(new THREE.BoxGeometry(0.24, 0.42, 0.18), mB, 0, 0.68, 0.42, -0.35);
      add(new THREE.CylinderGeometry(0.014, 0.014, 0.62, 6), mC, 0, 1.0, 0.5).rotation.z = Math.PI / 2;
      add(new THREE.BoxGeometry(0.06, 0.6, 0.06), mC, 0, 0.62, 0.58, -0.35);
      add(new THREE.BoxGeometry(0.34, 0.2, 0.26), M({ color: 0x2a2a2a, roughness: 0.6 }), 0, 0.98, 0.72);
      solids.push(hidBox(0.6, 1.0, 1.7, x, 0.5, z, worldC));
      return G;
    }

    /* a car, built in code: a body extruded from its side profile, the glass inset in it (side windows, windscreen, rear
       glass), four wheels, lamps, a grille; a sedan, an SUV, or Pong's white double-cab pickup with its open tray.
       Generic, no maker's mark. It faces −z (its profile's +x is the nose). */
    function buildCar(kind, color) {
      const G = new THREE.Group();
      const mBody = M({ color, roughness: 0.3, metalness: 0.55 }), mGl = M({ color: 0x0c1014, roughness: 0.18, metalness: 0.0, emissive: 0xffffff, emissiveIntensity: 0.5, emissiveMap: carGlassSky() }),
            mT = M({ color: 0x161616, roughness: 0.85 }), mRim = M({ color: 0xa8acb0, roughness: 0.3, metalness: 0.8 }),
            mL = B({ color: 0xf0ead0 }), mR = B({ color: 0x8a1410 }), mBlk = M({ color: 0x1c1c1e, roughness: 0.6 });
      /* the side profile, x along the car (nose at +x), y up; the cabin's glass by its own corners */
      const PR = {
        pickup: { body: [[-2.62, 0.42], [-2.62, 1.0], [-0.95, 1.0], [-0.95, 1.8], [0.74, 1.82], [1.42, 1.13], [2.52, 1.0], [2.62, 0.45]],
                  side: [-0.86, 0.7, 1.14, 1.72], ws: [[0.78, 1.78], [1.38, 1.16]], rear: [[-0.93, 1.16], [-0.93, 1.74]], W: 1.82, wz: 1.72 },
        suv:    { body: [[-2.3, 0.42], [-2.32, 1.6], [-1.6, 1.72], [1.1, 1.72], [1.6, 1.1], [2.3, 0.98], [2.32, 0.45]],
                  side: [-1.5, 1.02, 1.12, 1.62], ws: [[1.14, 1.68], [1.56, 1.14]], rear: [[-2.3, 1.12], [-2.3, 1.58]], W: 1.8, wz: 1.42 },
        sedan:  { body: [[-2.25, 0.4], [-2.28, 0.88], [-1.6, 1.0], [-1.05, 1.42], [0.8, 1.44], [1.35, 0.98], [2.22, 0.86], [2.25, 0.42]],
                  side: [-1.0, 0.74, 0.98, 1.36], ws: [[0.84, 1.4], [1.3, 1.0]], rear: [[-1.56, 1.02], [-1.08, 1.38]], W: 1.76, wz: 1.42 }
      }[kind] || null;
      const P = PR.body, W = PR.W;
      const s = new THREE.Shape(); s.moveTo(P[0][0], P[0][1]); for (const q of P.slice(1)) s.lineTo(q[0], q[1]); s.closePath();
      const g = new THREE.ExtrudeGeometry(s, { depth: W, bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.05, bevelSegments: 2 });
      g.translate(0, 0, -W / 2); g.rotateY(Math.PI / 2);
      const b = new THREE.Mesh(g, mBody); b.castShadow = !LOW; b.receiveShadow = true; G.add(b);
      const at = (px) => -px;                                                  // the profile's x → the car's z
      const add = (geo, m, x, y, z) => { const o = new THREE.Mesh(geo, m); o.position.set(x, y, z); G.add(o); return o; };
      /* the side glass: one block a hair wider than the body, so it shows as a window on both flanks */
      const glass = [];                              // (the cabin hides these: from inside, a slab of tinted glass is a wall)
      { const [x0, x1, y0, y1] = PR.side; glass.push(add(new THREE.BoxGeometry(W + 0.12, y1 - y0, x1 - x0), mGl, 0, (y0 + y1) / 2, at((x0 + x1) / 2))); }
      /* the windscreen and the rear glass: thin slabs laid on their slopes */
      const slab = (pa, pb) => { const L = Math.hypot(pb[0] - pa[0], pb[1] - pa[1]); const o = add(new THREE.BoxGeometry(W - 0.12, 0.02, L), mGl, 0, (pa[1] + pb[1]) / 2 + 0.03, at((pa[0] + pb[0]) / 2)); o.rotation.x = Math.atan2(pb[1] - pa[1], pb[0] - pa[0]); return o; };
      glass.push(slab(PR.ws[0], PR.ws[1]));
      if (kind === 'pickup') glass.push(add(new THREE.BoxGeometry(W - 0.3, PR.rear[1][1] - PR.rear[0][1], 0.02), mGl, 0, (PR.rear[0][1] + PR.rear[1][1]) / 2, at(PR.rear[0][0]) + 0.012));
      else glass.push(slab(PR.rear[0], PR.rear[1]));
      if (kind === 'pickup') {                       // the open tray: its floor, dark, under the sides of the body
        add(new THREE.BoxGeometry(W - 0.14, 0.04, 1.6), mBlk, 0, 0.98, at(-1.78));
        add(new THREE.BoxGeometry(W - 0.14, 0.4, 0.04), mBlk, 0, 0.82, at(-2.58));
      }
      for (const px of [PR.wz, -PR.wz]) for (const x of [-W / 2 + 0.06, W / 2 - 0.06]) {
        const w = add(new THREE.CylinderGeometry(0.36, 0.36, 0.26, 18), mT, x, 0.36, at(px)); w.rotation.z = Math.PI / 2;
        const r = add(new THREE.CylinderGeometry(0.21, 0.21, 0.27, 12), mRim, x, 0.36, at(px)); r.rotation.z = Math.PI / 2;
      }
      const nose = P[P.length - 1][0] + 0.03, tail = P[0][0] - 0.03;
      for (const x of [-0.62, 0.62]) {
        add(new THREE.BoxGeometry(0.36, 0.12, 0.04), mL, x, kind === 'sedan' ? 0.76 : 0.88, at(nose));
        add(new THREE.BoxGeometry(0.2, 0.18, 0.04), mR, x * 1.14, kind === 'pickup' ? 0.86 : 0.86, at(tail));
      }
      add(new THREE.BoxGeometry(0.9, 0.24, 0.04), M({ color: 0x2a2a2a, roughness: 0.4, metalness: 0.6 }), 0, kind === 'sedan' ? 0.62 : 0.72, at(nose + 0.01));
      for (const x of [-W / 2 - 0.04, W / 2 + 0.04]) add(new THREE.BoxGeometry(0.1, 0.08, 0.14), mBlk, x, PR.side[2] + 0.02, at(PR.side[1] + 0.12));   // the mirrors
      /* what a car is read by up close (the first photograph of the pickup beside the spawn was a white box): bumpers,
         black arches over the wheels, the doors' lines and handles, the plates — a Thai plate, black on white, its
         province under the number (generic numbers) */
      const mBump = kind === 'pickup' ? M({ color: 0x4a4c50, roughness: 0.45, metalness: 0.5 }) : mBody;
      add(new THREE.BoxGeometry(W + 0.08, 0.2, 0.18), mBump, 0, 0.52, at(nose) - 0.03);
      add(new THREE.BoxGeometry(W + 0.08, 0.2, 0.16), mBump, 0, 0.52, at(tail) + 0.03);
      const arch = new THREE.RingGeometry(0.37, kind === 'pickup' ? 0.47 : 0.42, 18, 1, 0, Math.PI);
      for (const px of [PR.wz, -PR.wz]) for (const sx of [-1, 1]) { const a = add(arch, mBlk, sx * (W / 2 + 0.054), 0.36, at(px)); a.rotation.y = sx * Math.PI / 2; }
      const seams = { pickup: [0.74, -0.12, -0.93], suv: [1.05, -0.1, -1.35], sedan: [0.75, -0.25, -1.05] }[kind], sh = PR.side[2] - 0.5;
      for (const px of seams) for (const sx of [-1, 1]) add(new THREE.BoxGeometry(0.006, sh, 0.012), mBlk, sx * (W / 2 + 0.052), 0.5 + sh / 2, at(px));
      for (let i = 1; i < seams.length; i++) for (const sx of [-1, 1]) add(new THREE.BoxGeometry(0.02, 0.03, 0.14), mRim, sx * (W / 2 + 0.06), PR.side[2] - 0.1, at(seams[i] + 0.16));
      if (kind === 'pickup') { for (const y of [0.66, 0.76]) add(new THREE.BoxGeometry(0.86, 0.025, 0.02), mRim, 0, y, at(nose + 0.035)); }
      { const pm = M({ map: tex(makePlate(THREE, cnv, kind === 'pickup' ? 'บข 4821' : kind === 'suv' ? 'กค 7316' : '2กษ 590', kind === 'pickup' ? 'กรุงเทพมหานคร' : 'ขอนแก่น')), roughness: 0.5 });
        const fp = add(new THREE.PlaneGeometry(0.34, 0.11), pm, 0, 0.52, at(nose) - 0.125); fp.rotation.y = Math.PI;
        add(new THREE.PlaneGeometry(0.34, 0.11), pm, 0, 0.52, at(tail) + 0.115); }
      G.userData.glass = glass;
      return G;
    }

    /* ============================================== THE RICE COUNTRY'S GREEN (CP5, S46)
       This chapter's own kits, each kind one metre tall at scale 1, planted by the engine's stand machinery (the same
       dealing, instancing, per-tree culling, `lowKeep` and `planted` record as Chad's four trees): the sugar palm in two
       ages, the banana, the bamboo clump, three broadleaf crowns (the takhian, the rain tree, a mango), a clump of young
       rice. Built here in code until Chad's models land (E4-MODELS). Foliage cards carry normals that point out of the
       crown, so a crown is lit as a volume, not as a pile of planes. */
    function buildVegetation() {
      const I = new THREE.Matrix4();
      const kgeo = (g) => { yard.kitGeos.push(g); return g; };
      const kmat = (o) => { const m = new THREE.MeshStandardMaterial(o); yard.kitMats.push(m); return m; };
      const tFan = tex(makePalmFan(THREE, cnv)), tBark = tex(makePalmBark(THREE, cnv)); tBark.repeat.set(1, 7);
      const tBan = tex(makeBananaLeaf(THREE, cnv)), tBam = tex(makeBambooSpray(THREE, cnv)), tTB = tex(makeTreeBark(THREE, cnv)); tTB.repeat.set(2, 4);
      const tLeafA = tex(makeLeafCluster(THREE, cnv, 4711)), tLeafB = tex(makeLeafCluster(THREE, cnv, 4713, [58, 98, 34])), tLeafC = tex(makeLeafCluster(THREE, cnv, 4715, [40, 78, 34]));
      const tRiceC = tex(makeRiceClump(THREE, cnv));
      const mBark = kmat({ map: tBark, roughness: 0.95 }), mFan = kmat({ map: tFan, roughness: 0.8, alphaTest: 0.4, side: THREE.DoubleSide });
      const mStem = kmat({ color: 0x6a7a3a, roughness: 0.8 }), mBan = kmat({ map: tBan, roughness: 0.65, alphaTest: 0.4, side: THREE.DoubleSide });
      const mCulm = kmat({ color: 0x8a943e, roughness: 0.6 }), mSpray = kmat({ map: tBam, roughness: 0.8, alphaTest: 0.4, side: THREE.DoubleSide });
      const mTrunk = kmat({ map: tTB, roughness: 0.95 });
      const mLeafA = kmat({ map: tLeafA, roughness: 0.85, alphaTest: 0.42, side: THREE.DoubleSide }), mLeafB = kmat({ map: tLeafB, roughness: 0.85, alphaTest: 0.42, side: THREE.DoubleSide }),
            mLeafC = kmat({ map: tLeafC, roughness: 0.85, alphaTest: 0.42, side: THREE.DoubleSide });
      const mRiceC = kmat({ map: tRiceC, roughness: 0.9, alphaTest: 0.38, side: THREE.DoubleSide });
      const V = THREE.Vector3, Y = new V(0, 1, 0);
      /* a buffer from flat arrays */
      const geoOf = (P, N, U, IDX) => { const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(P), 3)); g.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(N), 3)); g.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(U), 2)); g.setIndex(IDX); g.computeBoundingSphere(); return kgeo(g); };
      /* a foliage card: four corners, normals out of `ctr` */
      const card = (B, a, b, c, d, ua, ub, ctr) => {
        const o = B.P.length / 3;
        for (const [p, uv] of [[a, [ua[0], ua[1]]], [b, [ub[0], ua[1]]], [c, [ub[0], ub[1]]], [d, [ua[0], ub[1]]]]) {
          B.P.push(p.x, p.y, p.z); const n = p.clone().sub(ctr).normalize(); n.y = n.y * 0.6 + 0.4; n.normalize(); B.N.push(n.x, n.y, n.z); B.U.push(uv[0], uv[1]);
        }
        B.I.push(o, o + 1, o + 2, o, o + 2, o + 3);
      };
      /* ---- the sugar palm: a tall dark ringed trunk, a ball of stiff fans, the dead ones hanging under them */
      const palm = (seed, o) => {
        const r = rng(seed);
        const tg = kgeo(new THREE.CylinderGeometry(o.rTop, o.rBot, o.trunk, 7, 8, true)); tg.translate(0, o.trunk / 2, 0);
        const P = tg.attributes.position; for (let i = 0; i < P.count; i++) { const y = P.getY(i), k = y / o.trunk; P.setX(i, P.getX(i) * (1 + 0.18 * Math.exp(-((k - 0.08) ** 2) / 0.004)) + o.bend * k * k); P.setZ(i, P.getZ(i) * (1 + 0.18 * Math.exp(-((k - 0.08) ** 2) / 0.004))); }
        tg.computeVertexNormals();
        const B = { P: [], N: [], U: [], I: [] }, ctr = new V(o.bend, o.trunk + 0.012, 0);
        const fan = (d, len, dead) => {
          let t1 = new V().crossVectors(d, Y); if (t1.lengthSq() < 1e-4) t1.set(1, 0, 0); t1.normalize();
          const roll = (r() - 0.5) * 1.0, t2 = new V().crossVectors(d, t1).normalize();
          t1.multiplyScalar(Math.cos(roll)).addScaledVector(t2, Math.sin(roll)).normalize();
          const nrm = new V().crossVectors(t1, d).normalize();
          const base = ctr.clone().addScaledVector(d, o.pet * (0.8 + r() * 0.4));
          const tip = base.clone().addScaledVector(d, len), fold = nrm.clone().multiplyScalar(len * 0.12);
          const A = base.clone().addScaledVector(t1, -len), Bq = base.clone().addScaledVector(t1, len), Cq = tip.clone().addScaledVector(t1, len), D = tip.clone().addScaledVector(t1, -len);
          const M0 = base.clone(), M1 = tip.clone().add(fold);
          A.addScaledVector(d, -len * 0.0); Cq.addScaledVector(nrm, -len * 0.08); D.addScaledVector(nrm, -len * 0.08);
          const u0 = dead ? 0.5 : 0, u1 = dead ? 1 : 0.5, um = (u0 + u1) / 2;
          card(B, A, M0, M1, D, [u0, 0.02], [um, 1], ctr); card(B, M0, Bq, Cq, M1, [um, 0.02], [u1, 1], ctr);
        };
        for (let i = 0; i < o.n; i++) {
          const el = Math.asin(Math.sin(o.elMin) + (Math.sin(o.elMax) - Math.sin(o.elMin)) * r()), az = i * 2.39996 + r() * 0.5;   // even over the sphere's band
          fan(new V(Math.cos(el) * Math.cos(az), Math.sin(el), Math.cos(el) * Math.sin(az)), o.len * (0.85 + r() * 0.3), false);
        }
        for (let i = 0; i < o.dead; i++) { const el = -1.05 - r() * 0.35, az = r() * Math.PI * 2; fan(new V(Math.cos(el) * Math.cos(az), Math.sin(el), Math.cos(el) * Math.sin(az)), o.len * 0.75, true); }
        return [{ geo: tg, mat: mBark, m: I, leaf: false }, { geo: geoOf(B.P, B.N, B.U, B.I), mat: mFan, m: I, leaf: true }];
      };
      const palmKit = [palm(4721, { trunk: 0.9, rTop: 0.015, rBot: 0.021, bend: 0.03, n: 40, dead: 7, len: 0.088, pet: 0.06, elMin: -0.7, elMax: 1.5 }),
                       palm(4723, { trunk: 0.86, rTop: 0.017, rBot: 0.024, bend: -0.04, n: 34, dead: 5, len: 0.094, pet: 0.06, elMin: -0.6, elMax: 1.5 }),
                       palm(4725, { trunk: 0.66, rTop: 0.026, rBot: 0.034, bend: 0.02, n: 30, dead: 4, len: 0.13, pet: 0.075, elMin: -0.45, elMax: 1.5 })];
      /* ---- the banana: a short trunk and broad torn leaves arching out and drooping */
      const banana = (seed) => {
        const r = rng(seed);
        const sg = kgeo(new THREE.CylinderGeometry(0.04, 0.055, 0.44, 7, 1, true)); sg.translate(0, 0.22, 0);
        const B = { P: [], N: [], U: [], I: [] }, ctr = new V(0, 0.55, 0);
        for (let k = 0; k < 8; k++) {
          const az = k * 2.39996 + r() * 0.4, dir = new V(Math.cos(az), 0, Math.sin(az)), side = new V(-dir.z, 0, dir.x);
          const L = 0.5 + r() * 0.22, rise = 0.32 + r() * 0.18, droop = 0.42 + r() * 0.2, y0 = 0.4 + r() * 0.06, segs = 8, o0 = B.P.length / 3;
          for (let s = 0; s <= segs; s++) {
            const t = s / segs, c = new V(0, y0, 0).addScaledVector(dir, 0.03 + t * L); c.y += rise * t - droop * t * t;
            const w = 0.11 * Math.pow(Math.sin(Math.min(1, t * 1.12 + 0.04) * Math.PI), 0.55);
            for (const sd of [-1, 1]) {
              const p = c.clone().addScaledVector(side, sd * w); p.y -= w * 0.28;
              B.P.push(p.x, p.y, p.z); const n = new V(0, 1, 0).addScaledVector(side, -sd * 0.3).normalize(); B.N.push(n.x, n.y, n.z); B.U.push(sd < 0 ? 0 : 1, t);
            }
            if (s) { const a = o0 + (s - 1) * 2; B.I.push(a, a + 1, a + 3, a, a + 3, a + 2); }
          }
        }
        return [{ geo: sg, mat: mStem, m: I, leaf: false }, { geo: geoOf(B.P, B.N, B.U, B.I), mat: mBan, m: I, leaf: true }];
      };
      const bananaKit = [banana(4731), banana(4733)];
      /* ---- the bamboo clump: culms leaning out of one root, sprays of narrow leaves along their tops */
      const bamboo = (seed) => {
        const r = rng(seed), culmGeos = [], B = { P: [], N: [], U: [], I: [] }, ctr = new V(0, 0.62, 0);
        for (let k = 0; k < 12; k++) {
          const az = r() * Math.PI * 2, lean = 0.05 + r() * 0.24, h = 0.72 + r() * 0.28, base = new V(Math.cos(az) * 0.03, 0, Math.sin(az) * 0.03);
          const out = new V(Math.cos(az), 0, Math.sin(az)), top = base.clone().addScaledVector(out, Math.sin(lean) * h + 0.08 * h).setY(h * Math.cos(lean));
          const mid = base.clone().addScaledVector(out, Math.sin(lean) * h * 0.35).setY(h * 0.55);
          const curve = new THREE.QuadraticBezierCurve3(base, mid, top);
          culmGeos.push(new THREE.TubeGeometry(curve, 6, 0.0055, 5, false));
          for (let j = 0; j < 6; j++) {
            const t = 0.42 + j * 0.1, p = curve.getPoint(Math.min(1, t)), s = 0.08 + r() * 0.06;
            const a1 = r() * Math.PI, t1 = new V(Math.cos(a1), 0, Math.sin(a1)), up = new V(0, 1, 0);
            const c0 = p.clone().addScaledVector(t1, -s).addScaledVector(up, -s * 0.5), c1 = p.clone().addScaledVector(t1, s).addScaledVector(up, -s * 0.5);
            card(B, c0, c1, c1.clone().addScaledVector(up, s * 1.4), c0.clone().addScaledVector(up, s * 1.4), [0, 0], [1, 1], ctr);
            const t2 = new V(-t1.z, 0, t1.x), d0 = p.clone().addScaledVector(t2, -s).addScaledVector(up, -s * 0.5), d1 = p.clone().addScaledVector(t2, s).addScaledVector(up, -s * 0.5);
            card(B, d0, d1, d1.clone().addScaledVector(up, s * 1.4), d0.clone().addScaledVector(up, s * 1.4), [0, 0], [1, 1], ctr);
          }
        }
        /* the culms into one geometry */
        let nv = 0, ni = 0; for (const g of culmGeos) { nv += g.attributes.position.count; ni += g.index.count; }
        const CP = [], CN = [], CU = [], CI = []; let off = 0;
        for (const g of culmGeos) { const p = g.attributes.position, n = g.attributes.normal, u = g.attributes.uv; for (let i = 0; i < p.count; i++) { CP.push(p.getX(i), p.getY(i), p.getZ(i)); CN.push(n.getX(i), n.getY(i), n.getZ(i)); CU.push(u.getX(i), u.getY(i)); } for (let i = 0; i < g.index.count; i++) CI.push(g.index.getX(i) + off); off += p.count; g.dispose(); }
        void nv; void ni;
        return [{ geo: geoOf(CP, CN, CU, CI), mat: mCulm, m: I, leaf: false }, { geo: geoOf(B.P, B.N, B.U, B.I), mat: mSpray, m: I, leaf: true }];
      };
      const bambooKit = [bamboo(4741), bamboo(4743)];
      /* ---- the broadleaf: a trunk (buttressed, for the takhian), limbs, and a crown of leaf clusters in its own shape */
      const broadleaf = (seed, o, mLeaf) => {
        const r = rng(seed);
        const tg = kgeo(new THREE.CylinderGeometry(o.rTop, o.rBot, o.trunk, 9, 6, true)); tg.translate(0, o.trunk / 2, 0);
        const P = tg.attributes.position; for (let i = 0; i < P.count; i++) { const k = P.getY(i) / o.trunk, fl = 1 + (o.flare || 0) * Math.exp(-k * 9); P.setX(i, P.getX(i) * fl + o.lean * k * k); P.setZ(i, P.getZ(i) * fl); }
        tg.computeVertexNormals();
        const parts = [tg];
        for (let k = 0; k < o.limbs; k++) {
          const az = k / o.limbs * Math.PI * 2 + r() * 0.5, y0 = o.trunk * (0.7 + r() * 0.25), out = new V(Math.cos(az), 0, Math.sin(az));
          const a = new V(o.lean * 0.6, y0, 0), b = a.clone().addScaledVector(out, o.cr * (0.45 + r() * 0.3)).setY(o.cy + (r() - 0.3) * o.ch * 0.6);
          parts.push(new THREE.TubeGeometry(new THREE.QuadraticBezierCurve3(a, a.clone().lerp(b, 0.5).setY(y0 + (b.y - y0) * 0.8), b), 4, o.rTop * 0.55, 5, false));
        }
        const LP = [], LN = [], LU = [], LI = []; let off = 0;
        for (const g of parts) { const p = g.attributes.position, n = g.attributes.normal, u = g.attributes.uv; for (let i = 0; i < p.count; i++) { LP.push(p.getX(i), p.getY(i), p.getZ(i)); LN.push(n.getX(i), n.getY(i), n.getZ(i)); LU.push(u.getX(i), u.getY(i)); } for (let i = 0; i < g.index.count; i++) LI.push(g.index.getX(i) + off); off += p.count; if (g !== tg) g.dispose(); }
        const B = { P: [], N: [], U: [], I: [] }, ctr = new V(o.lean, o.cy, 0);
        for (let k = 0; k < o.cards; k++) {
          const u1 = r() * 2 - 1, th = r() * Math.PI * 2, rr = Math.cbrt(r()) * 0.92, s1 = Math.sqrt(1 - u1 * u1);
          const p = new V(o.lean + Math.cos(th) * s1 * o.cr * rr, o.cy + u1 * o.ch * rr, Math.sin(th) * s1 * o.cr * rr);
          const s = o.card * (0.75 + r() * 0.5), a1 = r() * Math.PI, t1 = new V(Math.cos(a1), 0, Math.sin(a1)), t2 = new V(-t1.z, 0, t1.x), tilt = (r() - 0.5) * 0.8;
          const up = new V(0, Math.cos(tilt), Math.sin(tilt));
          for (const tt of [t1, t2]) {
            const c0 = p.clone().addScaledVector(tt, -s).addScaledVector(up, -s), c1 = p.clone().addScaledVector(tt, s).addScaledVector(up, -s);
            card(B, c0, c1, c1.clone().addScaledVector(up, 2 * s), c0.clone().addScaledVector(up, 2 * s), [0, 0], [1, 1], ctr);
          }
        }
        return [{ geo: geoOf(LP, LN, LU, LI), mat: mTrunk, m: I, leaf: false }, { geo: geoOf(B.P, B.N, B.U, B.I), mat: mLeaf, m: I, leaf: true }];
      };
      const broadKit = [broadleaf(4751, { trunk: 0.62, rTop: 0.016, rBot: 0.03, flare: 1.4, lean: 0.02, limbs: 6, cy: 0.74, cr: 0.21, ch: 0.24, cards: 120, card: 0.07 }, mLeafA),   // the takhian: tall, a high narrow crown
                        broadleaf(4753, { trunk: 0.38, rTop: 0.03, rBot: 0.05, flare: 0.5, lean: -0.03, limbs: 7, cy: 0.66, cr: 0.62, ch: 0.2, cards: 150, card: 0.11 }, mLeafB), // the rain tree: a wide low umbrella
                        broadleaf(4755, { trunk: 0.32, rTop: 0.035, rBot: 0.05, flare: 0.4, lean: 0.02, limbs: 5, cy: 0.62, cr: 0.42, ch: 0.34, cards: 120, card: 0.12 }, mLeafC)]; // the mango: round and dense
      /* ---- young rice: two cards crossed, the blades fanning out of the water */
      const riceG = (() => { const B = { P: [], N: [], U: [], I: [] }, ctr = new V(0, -2, 0);
        for (const a of [0, Math.PI / 2]) { const t = new V(Math.cos(a), 0, Math.sin(a)); const c0 = new V().addScaledVector(t, -0.45), c1 = new V().addScaledVector(t, 0.45); card(B, c0, c1, c1.clone().setY(1), c0.clone().setY(1), [0, 0], [1, 1], ctr); }
        return geoOf(B.P, B.N, B.U, B.I); })();
      const riceKit = [[{ geo: riceG, mat: mRiceC, m: I, leaf: true }]];

      /* ---- WHERE THEY STAND */
      const r = rng(4761), WY = CMP.WATER_Y;
      const inCompound = (x, z) => x > -22 && x < 20 && z > -19 && z < 13.6;
      const onRoad = (z) => z > 14.2 && z < 27.6;
      /* palms: along the bunds and scattered on them, out to the edge of the water; and the compound's own */
      const palms = [
        { x: -18.2, z: -14.6, h: 15, kind: 0, always: true }, { x: 16.4, z: -14.2, h: 13.5, kind: 1, always: true },
        { x: -18.6, z: 6.6, h: 12, kind: 0, always: true }, { x: 16.8, z: 9.2, h: 16, kind: 0, always: true },
        { x: -5.8, z: 13.8, h: 9, kind: 2, always: true }, { x: 6.2, z: 12.8, h: 14, kind: 1, always: true },
        { x: -19.8, z: -4.0, h: 11, kind: 2 }, { x: 18.6, z: -5.6, h: 7.5, kind: 2 }
      ];
      const bunds = [];
      for (const zz of [-32, -55, -80, 40, 62, 86]) bunds.push([-120, zz, 120, zz]);
      bunds.push([-60, -18.5, 60, -18.5]);
      for (const xx of [-24, -48, -74, -100, 22, 46, 70, 96]) { bunds.push([xx, -110, xx, -17]); bunds.push([xx, 27, xx, 110]); }
      for (const [x0, z0, x1, z1] of bunds) {
        const L = Math.hypot(x1 - x0, z1 - z0);
        for (let s = r() * 10; s < L; s += 13 + r() * 24) {
          const x = x0 + (x1 - x0) * s / L + (r() - 0.5) * 0.6, z = z0 + (z1 - z0) * s / L + (r() - 0.5) * 0.6;
          if (Math.hypot(x, z - 6) > 126 || inCompound(x, z) || onRoad(z)) continue;
          if (r() < 0.45) continue;
          palms.push({ x, z, y: WY + 0.1, h: 9 + r() * 10, kind: r() < 0.72 ? (r() < 0.5 ? 0 : 1) : 2 });
        }
      }
      for (const zz of [15.3, 26.7]) for (let x = -140; x < 140; x += 11 + r() * 16) {       // along the road's feet, for the drive in
        if (Math.abs(x) < 9 || Math.abs(x + 48) < 4 || Math.abs(x - 44.5) < 4) continue;
        palms.push({ x: x + (r() - 0.5) * 2, z: zz + (r() - 0.5) * 0.8, y: WY + 0.05, h: 10 + r() * 8, kind: r() < 0.75 ? (r() < 0.5 ? 0 : 1) : 2 });
      }
      for (let k = 0; k < 14; k++) {                         // the small groups out in the open paddies, two or three together
        const a = r() * Math.PI * 2, d = 30 + r() * 90, cx = Math.cos(a) * d, cz = 6 + Math.sin(a) * d;
        if (inCompound(cx, cz) || onRoad(cz)) continue;
        for (let j = 0; j < 1 + (r() * 3 | 0); j++) palms.push({ x: cx + (r() - 0.5) * 7, z: cz + (r() - 0.5) * 7, y: WY, h: 8 + r() * 11, kind: r() < 0.7 ? 0 : 2 });
      }
      yard.stands.push(plantTrees(worldC, palms, { kit: palmKit, seed: 21, lowKeep: 0.5, shadow: false }));
      /* bananas: behind and beside the house, by the spirit house, behind the room */
      const bananas = [];
      const clump = (cx, cz, n, y = 0) => { for (let j = 0; j < n; j++) bananas.push({ x: cx + (r() - 0.5) * 2.2, z: cz + (r() - 0.5) * 2.0, y, h: 2.4 + r() * 1.5, kind: j % 2 }); };
      clump(-14.5, -12.3, 4); clump(-10.5, -12.4, 3); clump(-15.2, -2.0, 3); clump(-7.2, 6.6, 3); clump(12.8, -12.4, 3); clump(-15.0, 3.5, 2); clump(13.2, -1.0, 2);
      yard.stands.push(plantTrees(worldC, bananas, { kit: bananaKit, seed: 23, lowKeep: 0.7, shadow: true }));
      /* bamboo at the back corners and the sides, outside the fence */
      yard.stands.push(plantTrees(worldC, [{ x: -17.6, z: -14.2, y: -0.15, h: 8.5, always: true }, { x: 15.8, z: -15.0, y: -0.15, h: 9.5, always: true },
                                            { x: 17.6, z: -2.4, y: -0.15, h: 7.5 }, { x: -18.4, z: 1.8, y: -0.15, h: 8 }], { kit: bambooKit, seed: 25, lowKeep: 0.6, shadow: false }));
      /* the takhian behind the sala, the rain tree over the cars, a mango by the house; rain trees along the road */
      yard.stands.push(plantTrees(worldC, [{ x: CMP.TAKHIAN.x, z: CMP.TAKHIAN.z, h: 19, kind: 0, ry: 0.4, always: true },
                                            { x: CMP.RAINTREE.x, z: CMP.RAINTREE.z, h: 10.5, kind: 1, ry: 1.2, always: true },
                                            { x: CMP.MANGO.x, z: CMP.MANGO.z, h: 8, kind: 2, ry: 2.1, always: true },
                                            { x: -58, z: 29, y: WY, h: 11, kind: 1 }, { x: 31, z: 30, y: WY, h: 9, kind: 2 }, { x: 84, z: 29.5, y: WY, h: 12, kind: 1 },
                                            { x: -96, z: 30, y: WY, h: 10, kind: 2 }, { x: -30, z: -40, y: WY, h: 9, kind: 2 }, { x: 52, z: -46, y: WY, h: 10, kind: 1 }],
                                          { kit: broadKit, seed: 27, shadow: true }));
      /* young rice in rows on the near paddies, round the mound (the far paddies carry it in the water's own sheet) */
      const rice = [];
      const band = (x0, x1, z0, z1) => { for (let z = z0; z < z1; z += 0.62) for (let x = x0; x < x1; x += 0.55) { if (r() < 0.12) continue; rice.push({ x: x + (r() - 0.5) * 0.12, z: z + (r() - 0.5) * 0.1, y: WY - 0.02, h: 0.48 + r() * 0.12 }); } };
      band(-23, 21, -21.8, -16.6); band(-25, -19.6, -16.6, 12.6); band(17.6, 23, -16.6, 12.6); band(-23, -6.4, 12.4, 15.6); band(6.4, 23, 12.4, 15.6);
      yard.stands.push(plantTrees(worldC, rice, { kit: riceKit, seed: 29, lowKeep: 0.45, shadow: false }));
      /* grass where nobody walks: tufts along the inside of the fence, round the trees' feet (the rice's cards, dried) */
      const mGrassT = kmat({ map: tRiceC, color: 0xb0a878, roughness: 0.95, alphaTest: 0.38, side: THREE.DoubleSide });
      const grassKit = [[{ geo: riceG, mat: mGrassT, m: I, leaf: true }]];
      const tufts = [], FN = CMP.FENCE, GH = GATE.w / 2;
      const strip = (x0, z0, x1, z1, n, spread) => { for (let k = 0; k < n; k++) { const u = r(); tufts.push({ x: x0 + (x1 - x0) * u + (r() - 0.5) * spread, z: z0 + (z1 - z0) * u + (r() - 0.5) * spread, h: 0.22 + r() * 0.22 }); } };
      strip(FN.x0 + 0.5, FN.z0 + 0.5, FN.x0 + 0.5, FN.z1 - 0.5, 40, 0.9); strip(FN.x1 - 0.5, FN.z0 + 0.5, FN.x1 - 0.5, FN.z1 - 0.5, 40, 0.9);
      strip(FN.x0 + 0.5, FN.z0 + 0.5, FN.x1 - 0.5, FN.z0 + 0.5, 60, 0.9);
      strip(FN.x0 + 0.5, FN.z1 - 0.6, -GH - 0.6, FN.z1 - 0.6, 26, 0.6); strip(GH + 0.6, FN.z1 - 0.6, FN.x1 - 0.5, FN.z1 - 0.6, 22, 0.6);
      strip(-3.3, 9.7, -3.3, 13.4, 14, 0.5); strip(3.3, 9.7, 3.3, 13.4, 12, 0.5);           // the lane's shoulders, where its edge met the bank
      for (const T of [CMP.TAKHIAN, CMP.RAINTREE, CMP.MANGO]) for (let k = 0; k < 14; k++) { const a = r() * Math.PI * 2, d = 0.9 + r() * 1.7; tufts.push({ x: T.x + Math.cos(a) * d, z: T.z + Math.sin(a) * d, h: 0.2 + r() * 0.22 }); }
      yard.stands.push(plantTrees(worldC, tufts, { kit: grassKit, seed: 31, lowKeep: 0.5, shadow: false }));
    }

    /* ============================================== THE FILM SETS (CP6, §4.0, §4.7, §4.8, §6.2)
       Places seen only in films: his shop at dawn in a Singapore neighbourhood mall (World S, x −250: the opening's
       shutter, ledger and message, and the coda's grey morning), the taxi home in the rain (World T, x −500: the coda's
       rear seat), and Pong's pickup from the inside (a cabin carried by the pickup in World C, for the drive in and the
       endings' drives). Built in code, every surface this chapter's own; lit by the presets and painted glows (v15.1). */
    const SHOP = { x0: -2.4, x1: 2.4, z0: -3.2, z1: 3.0, H: 3.0 };          // the unit, local to World S (its shutter at z1)
    const COR = { x0: -12, x1: 12, z0: 3.0, z1: 8.2, H: 3.6 };          // the mall's corridor outside it
    const COUNTER = { x0: -1.5, x1: 1.5, z: -1.55, h: 1.0, d: 0.6 };        // his counter (its customer face at z + d/2)
    const shop = { u: 0, uFrom: 0, uTo: 0, t0: 0, t1: 0, curtain: null, curTex: null, bar: null, spill: null, spillMat: null,
                   leds: [], ledK: 1, ledFrom: 1, ledTo: 1, l0: 0, l1: 0, phone: null, phoneOn: 0, ledger: null, pen: null };
    const taxi = { wipers: [], wipe: true, bokeh: [], glass: [], sweep: [], sweepU: { value: 9 }, meter: null, last: 0 };
    const cab = { root: null, glass: [], garland: null, show: false, drops: 0, last: 0, swing: 0 };

    /* rain on glass: beads born at random, swelling, sliding a little and gone — each one a small lens, dark at its rim
       and lit at its top where it catches the light. Unlit and transparent, over whatever is behind the glass. */
    /* CP6, from the photographs: one grid of tiny beads read as a starfield, not water. Two layers on two different
       grids (no lattice shows), bigger beads, and each one drawn as the small lens it is — a darker body, the light
       gathered in a crescent at its foot (what lies behind it, upside down) and a point of light at its top — sliding
       along `dir` (the wind and the weight: back and down on a side window) and leaving its wet path behind it. */
    function rainGlassMat(o = {}) {
      const m = new THREE.ShaderMaterial({
        uniforms: { uTime: { value: 0 }, uK: { value: o.k == null ? 1 : o.k }, uCells: { value: new THREE.Vector2(o.cx || 24, o.cy || 14) },
                    uHi: { value: new THREE.Color(o.hi == null ? 0xd8e4f0 : o.hi) }, uSlide: { value: o.slide == null ? 0.18 : o.slide },
                    uRate: { value: o.rate == null ? 0.07 : o.rate }, uDark: { value: o.dark == null ? 0.35 : o.dark },
                    uDir: { value: new THREE.Vector2(...(o.dir || [0, -1])).normalize() } },
        vertexShader: 'varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
        fragmentShader: [
          'uniform float uTime, uK, uSlide, uRate, uDark; uniform vec2 uCells, uDir; uniform vec3 uHi; varying vec2 vUv;',
          'float h1(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }',
          'float seg(vec2 p, vec2 a, vec2 b) { vec2 pa = p - a, ba = b - a; float h = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-5), 0.0, 1.0); return length(pa - ba * h); }',
          'void main() {',
          '  vec4 acc = vec4(0.0);',
          '  for (int k = 0; k < 2; k++) {',                                    // two layers, each on its own grid
          '    float fk = float(k);',
          '    vec2 g = vUv * uCells * (1.0 - 0.27 * fk) + fk * vec2(0.5, 0.37);',
          '    vec2 cid = floor(g) + fk * 17.0; vec2 f = fract(g);',
          '    float r0 = h1(cid), r1 = h1(cid + 3.1), r2 = h1(cid + 7.7), r3 = h1(cid + 11.3);',
          '    if (r3 > uK) continue;',
          '    float life = fract(uTime * uRate * (0.6 + r2) + r0);',
          '    float run = uSlide * life * life;',
          '    vec2 c0 = vec2(0.5) - uDir * uSlide * 0.5 + (vec2(r1, r2) - 0.5) * 0.18;',   // its whole path stays inside the cell
          '    vec2 c = c0 + uDir * run;',
          '    float rad = (0.08 + 0.12 * r0 + 0.1 * r0 * r0 * r0) * smoothstep(0.0, 0.08, life);',
          '    vec2 d = (f - c) / max(rad, 0.001);',
          '    float dist = length(d);',
          '    float body = 1.0 - smoothstep(0.78, 1.0, dist);',
          /* a drop is a small lens: the light behind it comes through INVERTED, so its lower part is lit — a soft fill,
             never a line — and a thin glint runs along its upper rim. CP9, by photograph: a round highlight dot over a
             thin bright crescent drew a smiling face in every drop on the taxi's window */
          '    float fill = smoothstep(-0.25, 0.95, -d.y) * (1.0 - smoothstep(0.5, 0.95, dist)) * body;',
          '    float rim = smoothstep(0.58, 0.8, dist) * (1.0 - smoothstep(0.82, 0.97, dist));',
          '    float glint = rim * smoothstep(0.3, 0.95, dot(d / max(dist, 1e-3), vec2(-0.6, 0.8)));',
          '    float fade = 1.0 - smoothstep(0.8, 1.0, life);',
          '    float tr = (1.0 - smoothstep(0.012, 0.03, seg(f, c0, c))) * smoothstep(0.03, 0.15, run);',
          '    vec3 col = mix(uHi * 0.3, uHi * clamp(fill * 0.8 + glint * 1.15, 0.0, 1.0), body);',
          '    float a = body * clamp(fill * 0.45 + glint * 0.85 + uDark * (0.45 + 0.55 * smoothstep(0.55, 1.0, dist)), 0.0, 1.0);',
          '    a = max(a, tr * 0.28) * fade;',
          '    acc.rgb = mix(acc.rgb, col, a); acc.a = max(acc.a, a);',
          '  }',
          '  if (acc.a < 0.01) discard;',
          '  gl_FragColor = acc;',
          '}'].join('\n'),
        transparent: true, depthWrite: false, side: THREE.DoubleSide, toneMapped: false
      });
      mats.push(m); return m;
    }

    /* ---------------------------------------------------- WORLD S · HIS SHOP AT DAWN (O1–O4, K2–K3) */
    function buildShop() {
      const S0 = worldS;
      const mesh = (g, m, x, y, z, p = S0) => { const o = new THREE.Mesh(g, m); o.position.set(x, y, z); o.receiveShadow = true; p.add(o); return o; };
      const bx = (w, h, d, m, x, y, z, p = S0) => mesh(new THREE.BoxGeometry(w, h, d), m, x, y, z, p);
      const pl = (w, h, m, x, y, z, rx = 0, ry = 0, p = S0) => { const o = mesh(new THREE.PlaneGeometry(w, h), m, x, y, z, p); o.rotation.set(rx, ry, 0); return o; };
      const tTer = tex(makeTerrazzo(THREE, cnv)); tTer.repeat.set((COR.x1 - COR.x0) / 1.2, (COR.z1 - COR.z0) / 1.2);
      const tTile = tex(makeShopTiles(THREE, cnv)); tTile.repeat.set((SHOP.x1 - SHOP.x0) / 0.6, (SHOP.z1 - SHOP.z0) / 0.6);
      const tAsh = tex(makeAshSlats(THREE, cnv)); tAsh.repeat.set(3.6 / 1.0, 1);
      const tSlat = tex(makeShutterSlats(THREE, cnv));
      const tVel = tex(makeVelvet(THREE, cnv)); tVel.repeat.set(2, 1);
      const tFaces = tex(makeAmuletFaces(THREE, cnv)), tCards = tex(makePriceCards(THREE, cnv));
      const tBook = tex(makeStockBook(THREE, cnv)), tBub = tex(makeBubbleWrap(THREE, cnv)), tCart = tex(makeCarton(THREE, cnv));
      const tGl = tex(makeGlow(THREE, cnv));
      const mFloor = M({ map: tTile, roughness: 0.32, metalness: 0.0 });
      const mTer = M({ map: tTer, roughness: 0.4 });
      const mWall = M({ color: 0xebe5da, roughness: 0.85 });
      const mCeil = M({ color: 0xf2f0ea, roughness: 0.9, emissive: 0x4a4844 });
      const mGloss = M({ color: 0xf4f4f0, roughness: 0.25 });
      const mAsh = M({ map: tAsh, roughness: 0.6 });
      const mOak = M({ color: 0xdcc6a0, roughness: 0.55 });
      const mAlu = M({ color: 0xc8ccd0, roughness: 0.3, metalness: 0.85 });
      const mGlass = M({ color: 0xe4eef2, roughness: 0.04, metalness: 0.1, transparent: true, opacity: 0.14, depthWrite: false });
      const mVel = M({ map: tVel, roughness: 0.95 });
      const mGold = M({ color: 0xc8a048, roughness: 0.32, metalness: 0.85 });
      const mBlack = M({ color: 0x141416, roughness: 0.4 });
      const mLed = B({ color: 0xf6fbff });
      const mSlat = M({ map: tSlat, roughness: 0.5, metalness: 0.55, side: THREE.DoubleSide });
      const mShutPaint = M({ color: 0x8c949a, roughness: 0.5, metalness: 0.5 });
      shop.leds.push(mLed);

      /* the unit: floor, walls, ceiling — the front open to the corridor above the shutter's line */
      pl(SHOP.x1 - SHOP.x0, SHOP.z1 - SHOP.z0, mFloor, 0, 0, (SHOP.z0 + SHOP.z1) / 2, -Math.PI / 2);
      pl(SHOP.x1 - SHOP.x0, SHOP.z1 - SHOP.z0, mCeil, 0, SHOP.H, (SHOP.z0 + SHOP.z1) / 2, Math.PI / 2);
      pl(SHOP.x1 - SHOP.x0, SHOP.H, mWall, 0, SHOP.H / 2, SHOP.z0, 0, 0);
      pl(SHOP.z1 - SHOP.z0, SHOP.H, mWall, SHOP.x0, SHOP.H / 2, (SHOP.z0 + SHOP.z1) / 2, 0, Math.PI / 2);
      pl(SHOP.z1 - SHOP.z0, SHOP.H, mWall, SHOP.x1, SHOP.H / 2, (SHOP.z0 + SHOP.z1) / 2, 0, -Math.PI / 2);
      bx(SHOP.x1 - SHOP.x0, 0.12, 0.02, mGloss, 0, 0.06, SHOP.z0 + 0.01);                   // the skirting
      /* the ceiling's light: four downlights and a cove of LED along the sides */
      const dl = new THREE.CircleGeometry(0.075, 20);
      for (const [x, z] of [[-1.1, -1.6], [1.1, -1.6], [-1.1, 1.0], [1.1, 1.0]]) { const d = mesh(dl, mLed, x, SHOP.H - 0.004, z); d.rotation.x = Math.PI / 2; }
      for (const sx of [-1, 1]) bx(0.03, 0.012, SHOP.z1 - SHOP.z0 - 0.2, mLed, sx * (SHOP.x1 - 0.12), SHOP.H - 0.02, (SHOP.z0 + SHOP.z1) / 2);

      /* the back wall: ash slats, three floating shelves, the small shrine shelf over them */
      pl(3.6, 1.9, mAsh, 0, 1.85, SHOP.z0 + 0.012, 0, 0);
      for (const y of [1.3, 1.78]) { bx(3.0, 0.035, 0.24, mOak, 0, y, SHOP.z0 + 0.13); bx(2.9, 0.008, 0.01, mLed, 0, y - 0.022, SHOP.z0 + 0.24); }
      { const mBoxR = M({ color: 0x9a1a1e, roughness: 0.5 }), mBoxG = M({ color: 0xb08a3a, roughness: 0.4, metalness: 0.5 });
        let k = 0;
        for (const y of [1.3, 1.78]) for (let x = -1.3; x <= 1.3; x += 0.36) { if ((k++ * 7) % 5 === 0) continue; const b2 = bx(0.12, 0.05, 0.09, k % 3 ? mBoxR : mBoxG, x + (k % 2) * 0.05, y + 0.044, SHOP.z0 + 0.13); b2.rotation.y = (k % 4 - 1.5) * 0.12; } }
      { bx(0.42, 0.32, 0.025, mBlack, -0.9, 2.3, SHOP.z0 + 0.03);
        pl(0.36, 0.26, B({ map: tex(makeTemplePrint(THREE, cnv)) }), -0.9, 2.3, SHOP.z0 + 0.045);
        bx(0.3, 0.4, 0.02, mGold, 0.95, 2.28, SHOP.z0 + 0.03);
        pl(0.26, 0.36, M({ color: 0xf4f2ea, roughness: 0.8 }), 0.95, 2.28, SHOP.z0 + 0.042); }
      /* the shrine shelf: red, two electric candles, a brass pot of sand, a vase of chrysanthemums */
      { const mRed = M({ color: 0x9a1418, roughness: 0.45 }), mCandle = M({ color: 0xc81a1a, roughness: 0.35 }), mTip = B({ color: 0xffb070 });
        bx(0.72, 0.04, 0.26, mRed, 0, 2.52, SHOP.z0 + 0.14); bx(0.72, 0.14, 0.02, mRed, 0, 2.6, SHOP.z0 + 0.02);
        for (const x of [-0.26, 0.26]) { const cnd = mesh(new THREE.CylinderGeometry(0.018, 0.02, 0.16, 10), mCandle, x, 2.62, SHOP.z0 + 0.15); void cnd;
          const tip = mesh(new THREE.SphereGeometry(0.012, 8, 6), mTip, x, 2.71, SHOP.z0 + 0.15); tip.scale.y = 1.6; }
        mesh(new THREE.CylinderGeometry(0.05, 0.04, 0.06, 14), mGold, 0, 2.57, SHOP.z0 + 0.16);
        const vase = mesh(new THREE.CylinderGeometry(0.03, 0.04, 0.14, 12), M({ color: 0xe8e8ee, roughness: 0.2 }), 0.14, 2.61, SHOP.z0 + 0.15); void vase;
        const mFl = M({ color: 0xf2c838, roughness: 0.7 });
        for (let k = 0; k < 7; k++) mesh(new THREE.SphereGeometry(0.026, 8, 6), mFl, 0.14 + Math.cos(k * 2.4) * 0.04, 2.72 + (k % 3) * 0.02, SHOP.z0 + 0.15 + Math.sin(k * 2.4) * 0.04); }

      /* a few amulets on velvet with their handwritten prices — the trays mostly empty (his stock is small yet) */
      const faceG = new THREE.PlaneGeometry(0.038, 0.05);
      const faceMats = [0, 1, 2, 3].map(k => { const t = tFaces.clone(); t.repeat.set(0.25, 1); t.offset.set(k * 0.25, 0); t.needsUpdate = true; madeTex.push(t); return M({ map: t, roughness: 0.4, metalness: 0.3 }); });
      const cardMats = [0, 1, 2, 3].map(k => { const t = tCards.clone(); t.repeat.set(0.25, 1); t.offset.set(k * 0.25, 0); t.needsUpdate = true; madeTex.push(t); return M({ map: t, roughness: 0.8 }); });
      const amulet = (x, y, z, ry, k, card) => {
        const g = new THREE.Group(); g.position.set(x, y, z); g.rotation.y = ry; S0.add(g);
        const p2 = new THREE.Mesh(faceG, faceMats[k % 4]); p2.rotation.x = -1.05; p2.position.set(0, 0.022, 0); g.add(p2);
        const st = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.004, 0.03), mAlu); st.position.set(0, 0.002, 0.012); g.add(st);
        if (card != null) { const c2 = new THREE.Mesh(new THREE.PlaneGeometry(0.05, 0.034), cardMats[card % 4]); c2.rotation.x = -0.6; c2.position.set(0.05, 0.015, 0.03); g.add(c2); }
        return g;
      };
      /* the two wall cabinets: white carcass, pale oak shelves, glass fronts, an LED strip under each shelf */
      const cabinet = (sx) => {
        const X = sx * 2.17, Z0 = -0.7, Z1 = 2.1, L = Z1 - Z0, ZC = (Z0 + Z1) / 2, D = 0.44, FX = sx * (2.17 - D / 2);   // FX: its glass front
        bx(0.02, 2.05, L, mGloss, X + sx * (D / 2 - 0.01), 1.085, ZC);                       // the carcass: its back,
        for (const zz of [Z0, Z1]) bx(D, 2.05, 0.02, mGloss, X, 1.085, zz);                  // its ends,
        for (const y of [0.11, 2.1]) bx(D, 0.02, L, mGloss, X, y, ZC);                       // its floor and top (the inside shows through the glass)
        bx(D - 0.06, 0.1, L - 0.02, mBlack, X, 0.05, ZC);                     // the plinth, set back
        for (const y of [0.42, 0.86, 1.3, 1.74]) {
          bx(D - 0.04, 0.03, L - 0.06, mOak, X - sx * 0.01, y, ZC);
          bx(0.012, 0.006, L - 0.12, mLed, FX - sx * 0.03, y - 0.02, ZC);
          for (let k = 0; k < 4; k++) { const tr = bx(D - 0.14, 0.012, L / 4 - 0.1, mVel, X - sx * 0.02, y + 0.021, Z0 + (k + 0.5) * L / 4); void tr; }
        }
        for (const zz of [Z0 + 0.02, ZC, Z1 - 0.02]) bx(0.025, 2.0, 0.025, mAlu, FX, 1.08, zz);
        for (const y of [0.1, 2.08]) bx(0.025, 0.025, L, mAlu, FX, y, ZC);
        const gl = pl(L - 0.06, 1.96, mGlass, FX, 1.09, ZC, 0, -sx * Math.PI / 2); gl.renderOrder = 2;
        return { X, ZC, L, Z0 };
      };
      const cL = cabinet(-1), cR = cabinet(1);
      [[cL, 0.86, 0.3, 0, 0], [cL, 0.86, 1.25, 1, null], [cL, 1.3, 0.1, 2, 1], [cL, 0.42, 1.7, 3, 2],
       [cR, 0.86, -0.2, 1, 3], [cR, 1.3, 0.9, 0, 0], [cR, 1.74, 1.6, 2, null], [cR, 0.42, 0.4, 3, 1]].forEach(([c, y, z, k, card]) =>
        amulet(c.X - Math.sign(c.X) * 0.03, y + 0.03, z, -Math.sign(c.X) * Math.PI / 2, k, card));

      /* his counter: a glass display over a white front, an oak top; the ledger open on it, the pen, his phone, a
         calculator, a stand of his new cards */
      { const C = COUNTER, W = C.x1 - C.x0, FZ = C.z + C.d / 2;
        bx(W, 0.5, C.d, mGloss, 0, 0.25, C.z);
        bx(W - 0.04, 0.42, C.d - 0.08, mVel, 0, 0.71, C.z - 0.02);                      // the display's bed, inside
        bx(W, 0.045, C.d + 0.04, mOak, 0, C.h + 0.0225, C.z);                            // the top
        const gf = pl(W - 0.02, 0.46, mGlass, 0, 0.75, FZ, 0, 0); gf.renderOrder = 2;
        for (const x of [C.x0 + 0.01, 0, C.x1 - 0.01]) bx(0.02, 0.48, 0.02, mAlu, x, 0.74, FZ);
        bx(W - 0.08, 0.008, 0.01, mLed, 0, 0.95, FZ - 0.03);
        for (const sx of [-1, 1]) bx(0.02, 0.5, C.d, mGloss, sx * (W / 2 - 0.01), 0.75, C.z);
        [[-1.0, 0, 0], [-0.35, 2, 3], [0.55, 1, null], [1.05, 3, 1]].forEach(([x, k, card]) => amulet(x, 0.92 + 0.0, C.z + 0.05, 0, k, card));
        /* the top: the ledger (S43 is the play's own book; this one is the film's prop, his real stock book) */
        const top = C.h + 0.046;
        const bk = new THREE.Group(); bk.position.set(-0.2, top, C.z - 0.05); bk.rotation.y = 0.06; S0.add(bk); bk.userData.dyn = true; shop.ledger = bk;
        const cover = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.012, 0.31), M({ color: 0x2a3a5a, roughness: 0.6 })); cover.position.y = 0.006; bk.add(cover);
        const pages = new THREE.Mesh(new THREE.PlaneGeometry(0.44, 0.29), M({ map: tBook, roughness: 0.85 })); pages.rotation.x = -Math.PI / 2; pages.position.y = 0.0135; bk.add(pages);
        const pen = new THREE.Group(); pen.position.set(0.09, top + 0.0048, C.z - 0.02); pen.rotation.set(0, -0.5, Math.PI / 2); S0.add(pen); pen.userData.dyn = true; shop.pen = pen;
        { const b2 = new THREE.Mesh(new THREE.CylinderGeometry(0.0045, 0.004, 0.14, 8), M({ color: 0x1a2a6a, roughness: 0.3 })); pen.add(b2);
          const tip = new THREE.Mesh(new THREE.ConeGeometry(0.004, 0.014, 8), mAlu); tip.position.y = -0.077; tip.rotation.x = Math.PI; pen.add(tip); }
        /* his phone: face up, its screen dark until a message comes (shop.phoneOn), then its lock screen with the message
           on it (shop.phoneWho: Pong's in the opening, the Ajahn's in ending B's coda). The screen is ALWAYS mapped and
           only its colour lights it, so waking it never asks for a new program on screen (v15.1). It reads the right
           way up from his side of the counter, where both shots of it stand. */
        const ph = new THREE.Group(); ph.position.set(0.48, top, C.z + 0.04); ph.rotation.y = -0.3; S0.add(ph); ph.userData.dyn = true;
        const body = new THREE.Mesh(new THREE.BoxGeometry(0.076, 0.009, 0.158), M({ color: 0x18181c, roughness: 0.25, metalness: 0.4 })); body.position.y = 0.0045; ph.add(body);
        const [pc, px] = sized(cnv, 256, 557); px.fillStyle = '#000'; px.fillRect(0, 0, 256, 557);
        const scr = B({ color: 0x050608, map: tex(done(THREE, pc, false)) });
        const sc = new THREE.Mesh(new THREE.PlaneGeometry(0.068, 0.148), scr); sc.rotation.set(-Math.PI / 2, 0, Math.PI); sc.position.y = 0.0095; ph.add(sc);
        shop.phone = { g: ph, scr, base: ph.position.clone(), x: px, drawn: '' };
        bx(0.09, 0.016, 0.13, M({ color: 0x2a2a2e, roughness: 0.6 }), 0.86, top + 0.008, C.z - 0.08).rotation.y = 0.2;   // the calculator
        { const cs = bx(0.1, 0.05, 0.04, mAlu, -0.95, top + 0.025, C.z + 0.12); cs.rotation.x = -0.2;
          bx(0.09, 0.055, 0.003, M({ color: 0xf6f4ee, roughness: 0.7 }), -0.95, top + 0.05, C.z + 0.11).rotation.x = -0.35; }
        /* his stool behind it */
        { const st = new THREE.Group(); st.position.set(0.55, 0, C.z - 0.85); S0.add(st);
          const seat = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.05, 18), M({ color: 0x2a2a2e, roughness: 0.6 })); seat.position.y = 0.66; st.add(seat);
          const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.64, 8), mAlu); leg.position.y = 0.32; st.add(leg);
          const ft = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.02, 18), mAlu); ft.position.y = 0.01; st.add(ft); }
        solids.push(hidBox(W, 1.0, C.d, 0, 0.5, C.z, S0));
      }

      /* the carton half unpacked by the right cabinet, its flaps out, bubble wrap spilling */
      { const g = new THREE.Group(); g.position.set(1.35, 0, 0.9); g.rotation.y = -0.35; S0.add(g);
        const mC = M({ map: tCart, roughness: 0.9 }), mCin = M({ color: 0x8a6a42, roughness: 0.95, side: THREE.DoubleSide });
        const W2 = 0.5, H2 = 0.36, D2 = 0.4;
        for (const [w, x, z, ry] of [[W2, 0, D2 / 2, 0], [W2, 0, -D2 / 2, Math.PI], [D2, W2 / 2, 0, Math.PI / 2], [D2, -W2 / 2, 0, -Math.PI / 2]]) {
          const f = new THREE.Mesh(new THREE.PlaneGeometry(w, H2), mC); f.position.set(x, H2 / 2, z); f.rotation.y = ry; g.add(f);
          const fi = new THREE.Mesh(new THREE.PlaneGeometry(w, H2), mCin); fi.position.set(x * 0.98, H2 / 2, z * 0.98); fi.rotation.y = ry + Math.PI; g.add(fi);
          const fl = new THREE.Mesh(new THREE.PlaneGeometry(w, D2 * 0.48), mCin); fl.position.set(x, H2, z); fl.rotation.set(0, ry, 0);
          fl.rotateX(-Math.PI / 2 - 0.55); fl.translateY(D2 * 0.24); g.add(fl);
        }
        const mBub = M({ map: tBub, roughness: 0.15, transparent: true, depthWrite: false, side: THREE.DoubleSide });
        const bw = new THREE.Mesh(new THREE.SphereGeometry(0.2, 12, 8), mBub); bw.scale.set(1.1, 0.55, 0.9); bw.position.set(0.02, H2 + 0.02, 0); g.add(bw);
        const sp = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.34), mBub); sp.rotation.set(-Math.PI / 2 + 0.08, 0, 0.3); sp.position.set(-0.42, 0.012, 0.12); g.add(sp);
        solids.push(hidBox(0.56, 0.4, 0.46, 1.35, 0.2, 0.9, S0));
      }

      /* the congratulations stand by the door: a tripod, a round of flowers, two red ribbons — 开张大吉, GRAND OPENING */
      { const g = new THREE.Group(); g.position.set(-1.62, 0, 2.45); g.rotation.y = 2.5; S0.add(g);
        const mLeg = M({ color: 0xc8a050, roughness: 0.4, metalness: 0.6 });
        for (const a of [0, 2.1, 4.2]) { const l = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 1.45, 6), mLeg); l.position.set(Math.cos(a) * 0.14, 0.7, Math.sin(a) * 0.14 - 0.05); l.rotation.set(Math.sin(a) * 0.12, 0, -Math.cos(a) * 0.12); g.add(l); }
        const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.36, 0.06, 28), M({ color: 0x2e5a2e, roughness: 0.8 })); disc.rotation.x = Math.PI / 2; disc.position.set(0, 1.5, 0); g.add(disc);
        const cols = [0xd8202a, 0xf2c030, 0xf27aa0, 0xf6f0e0, 0xe8642a], n = 120, fm = cols.map(c2 => M({ color: c2, roughness: 0.7 }));
        const fg = new THREE.SphereGeometry(0.034, 8, 6), ins = fm.map(m2 => new THREE.InstancedMesh(fg, m2, n));
        const cnt = fm.map(() => 0), mm = new THREE.Matrix4(), rr = rng(4851);
        for (let k = 0; k < n * 2; k++) { const a = rr() * Math.PI * 2, d = Math.sqrt(rr()) * 0.34, ci = rr() * cols.length | 0; if (cnt[ci] >= n) continue;
          mm.makeTranslation(Math.cos(a) * d, 1.5 + Math.sin(a) * d, 0.04 + (0.34 - d) * 0.18 + rr() * 0.02); ins[ci].setMatrixAt(cnt[ci]++, mm); }
        ins.forEach((im, i) => { im.count = cnt[i]; g.add(im); });
        [['开张大吉', false, -0.29], ['GRANDOPENING', true, 0.29]].forEach(([t, lat, x]) => {
          const rb = new THREE.Mesh(new THREE.PlaneGeometry(0.1, 1.05), M({ map: tex(makeRibbon(THREE, cnv, t, lat)), roughness: 0.4, side: THREE.DoubleSide }));
          rb.position.set(x, 0.92, 0.07); rb.rotation.z = -Math.sign(x) * 0.05; g.add(rb); });
        solids.push(hidBox(0.6, 1.6, 0.5, -1.62, 0.8, 2.45, S0));
      }

      /* THE SHUTTER: the curtain hangs from its drum (y 2.8) and rises into it; the light comes in under its edge */
      { const SW = SHOP.x1 - SHOP.x0 - 0.1, TOP = 2.8;
        bx(SW + 0.2, 0.34, 0.34, mShutPaint, 0, TOP + 0.17, SHOP.z1 + 0.12);                     // the drum's housing
        for (const sx of [-1, 1]) bx(0.07, TOP, 0.09, mShutPaint, sx * (SW / 2 + 0.04), TOP / 2, SHOP.z1);   // the guide rails
        const g = new THREE.PlaneGeometry(SW, 1); g.translate(0, -0.5, 0);
        const ct = tSlat.clone(); ct.needsUpdate = true; madeTex.push(ct);
        const cm = M({ map: ct, roughness: 0.5, metalness: 0.55, side: THREE.DoubleSide });
        const cur = new THREE.Mesh(g, cm); cur.position.set(0, TOP, SHOP.z1); cur.userData.dyn = true; S0.add(cur);
        const bar = new THREE.Mesh(new THREE.BoxGeometry(SW, 0.06, 0.05), mShutPaint); bar.userData.dyn = true; S0.add(bar);
        for (const sx of [-0.6, 0.6]) { const hd = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.03, 0.04), mAlu); hd.position.set(sx, 0, -0.04); bar.add(hd); }
        shop.curtain = cur; shop.curTex = ct; shop.bar = bar; shop.top = TOP;
        /* the light it lets in: a warm-grey bar on the floor that grows inward as it rises */
        const sm = B({ map: tGl, color: 0xffe2c0, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending });
        const sp = new THREE.Mesh(new THREE.PlaneGeometry(SW + 1.2, 1), sm); sp.rotation.x = -Math.PI / 2; sp.position.set(0, 0.006, SHOP.z1); sp.userData.dyn = true; S0.add(sp);
        shop.spill = sp; shop.spillMat = sm;
      }

      /* THE CORRIDOR: terrazzo, a skylight's soft grey down its middle, the other units' shutters still down, their signs */
      { pl(COR.x1 - COR.x0, COR.z1 - COR.z0, mTer, 0, 0, (COR.z0 + COR.z1) / 2, -Math.PI / 2);
        pl(COR.x1 - COR.x0, COR.z1 - COR.z0, mCeil, 0, COR.H, (COR.z0 + COR.z1) / 2, Math.PI / 2);
        const sky = B({ color: 0xdfe6ec });
        pl(COR.x1 - COR.x0 - 0.6, 1.4, sky, 0, COR.H - 0.01, (COR.z0 + COR.z1) / 2, Math.PI / 2);
        for (const dz of [-0.76, 0.76]) bx(COR.x1 - COR.x0, 0.12, 0.12, mGloss, 0, COR.H - 0.06, (COR.z0 + COR.z1) / 2 + dz);
        const signs = [['JIN FU PROVISION', '金福', '#b81e24', '#fff4d8'], ['MEI LING TAILOR', '美玲', '#1e4a8a', '#ffffff'], ['TIONG HOE CLOCKS', '中和', '#2a2a2a', '#f2c84a'],
                       ['SIN HUAT PHARMACY', '新发', '#2a7a4a', '#ffffff'], ['GOOD LUCK GOLDSMITH', '好运', '#7a1a1a', '#f6d870'], ['KIM LEE MOBILE', '金利', '#e86a1a', '#ffffff']];
        const unitW = 4.8;
        const unit = (cx, z, face, sg) => {                       // face: +1 looks toward +z, −1 toward −z
          const pz = z;
          const cur = new THREE.Mesh(new THREE.PlaneGeometry(unitW - 0.5, 2.8), mSlat); cur.position.set(cx, 1.4, pz); cur.rotation.y = face > 0 ? 0 : Math.PI; S0.add(cur);
          const ct2 = cur.material; void ct2;
          bx(unitW - 0.3, 0.34, 0.3, mShutPaint, cx, 2.97, pz - face * 0.1);
          bx(unitW, COR.H - 3.14, 0.2, mWall, cx, 3.14 + (COR.H - 3.14) / 2, pz - face * 0.1);
          if (sg) { const s2 = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 0.46), B({ map: tex(makeShopSign(THREE, cnv, sg[0], sg[1], sg[2], sg[3])) })); s2.position.set(cx, 3.36, pz + face * 0.012); s2.rotation.y = face > 0 ? 0 : Math.PI; S0.add(s2); }
          bx(0.46, COR.H, 0.46, M({ color: 0xc8c4bc, roughness: 0.5 }), cx + unitW / 2, COR.H / 2, pz - face * 0.12);
        };
        let si = 0;
        for (let cx = -9.6; cx <= 9.7; cx += unitW) unit(cx, COR.z1, -1, signs[si++ % signs.length]);      // across the corridor
        for (const cx of [-9.6, -4.8, 4.8, 9.6]) unit(cx, SHOP.z1, 1, signs[si++ % signs.length]);          // his neighbours
        /* his own fascia over his shutter: a red GRAND OPENING banner (the sign proper is still on order) */
        bx(SHOP.x1 - SHOP.x0, COR.H - 3.14, 0.2, mWall, 0, 3.14 + (COR.H - 3.14) / 2, SHOP.z1 + 0.1);
        { const bn = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 0.4), M({ color: 0xc81a20, roughness: 0.6, side: THREE.DoubleSide })); bn.position.set(0, 3.36, SHOP.z1 + 0.21); S0.add(bn); }
        /* the corridor's ends and an EXIT sign */
        for (const sx of [-1, 1]) pl(COR.z1 - COR.z0, COR.H, mWall, sx * COR.x1, COR.H / 2, (COR.z0 + COR.z1) / 2, 0, -sx * Math.PI / 2);
        { const ex = new THREE.Mesh(new THREE.PlaneGeometry(0.4, 0.15), B({ map: tex(makeExitSign(THREE, cnv)) })); ex.position.set(COR.x1 - 0.02, 2.7, (COR.z0 + COR.z1) / 2); ex.rotation.y = -Math.PI / 2; S0.add(ex); }
        /* a mop bucket against a pillar, left by the cleaner whose broom we only hear */
        { const bk2 = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.13, 0.3, 14), M({ color: 0xf2c218, roughness: 0.5 })); bk2.position.set(-4.2, 0.15, COR.z1 - 0.5); S0.add(bk2);
          const mop = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 1.3, 6), M({ color: 0x8a6a4a, roughness: 0.7 })); mop.position.set(-4.12, 0.7, COR.z1 - 0.45); mop.rotation.z = 0.2; S0.add(mop); }
      }
    }

    /* ---------------------------------------------------- WORLD T · THE TAXI HOME (K1)
       The rear-left seat of a Singapore taxi at night in the rain (the car faces −z; the uncle drives on the right): the
       front seats' backs, the dashboard and its red meter far off, the windscreen with its wipers, his window beside
       him beaded with rain and the city sliding past behind it, out of focus. The streetlights passing are painted on
       the cabin's own surfaces (an emissive sweep), never a light (v15.1). */
    function buildTaxi() {
      const T0 = worldT;
      const mesh = (g, m, x, y, z, p = T0) => { const o = new THREE.Mesh(g, m); o.position.set(x, y, z); p.add(o); return o; };
      const bx = (w, h, d, m, x, y, z, p = T0) => mesh(new THREE.BoxGeometry(w, h, d), m, x, y, z, p);
      /* a streetlight passing is a BAND of warm light sliding from the front of the cabin to the back (the car drives
         toward −z), painted on the surfaces' own emissive. One function for all four materials, so they share one
         program (three keys a program on onBeforeCompile's source). CP6: the first cut lit the whole cabin at once and
         at its peak it read as a beige box. (`sw * sw`, never pow(sw, 2.0): pow of a negative base is undefined.) */
      const sweepBand = (sh) => {
        sh.uniforms.uSweep = taxi.sweepU;
        sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying float vSwZ;')
          .replace('#include <project_vertex>', '#include <project_vertex>\nvSwZ = (modelMatrix * vec4(transformed, 1.0)).z;');
        sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nvarying float vSwZ;\nuniform float uSweep;')
          .replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\n{ float sw = (vSwZ - uSweep) / 0.5; totalEmissiveRadiance *= exp(-sw * sw); }');
      };
      const sweepM = (o) => { const m = M(o); m.onBeforeCompile = sweepBand; taxi.sweep.push(m); return m; };
      const mSeat = sweepM({ color: 0x23262e, roughness: 0.9 }), mPanel = sweepM({ color: 0x1c1d22, roughness: 0.7 }), mLiner = sweepM({ color: 0x4a4a4e, roughness: 0.95 });
      const mDash = sweepM({ color: 0x141518, roughness: 0.6 }), mChrome = M({ color: 0x9aa0a6, roughness: 0.25, metalness: 0.9 });
      const W = 0.76, FLOOR = 0.32, ROOF = 1.5;
      /* the shell: floor, roof liner, the door panels to the belt line, pillars */
      bx(2 * W, 0.02, 3.2, mPanel, 0, FLOOR, -0.4);
      bx(2 * W, 0.02, 2.31, mLiner, 0, ROOF, -0.055); bx(2 * W, 0.06, 0.06, mPanel, 0, 1.475, -1.2);
      for (const sx of [-1, 1]) {
        bx(0.05, 0.66, 2.6, mPanel, sx * W, FLOOR + 0.33, -0.3);                  // the doors below the windows
        bx(0.06, 0.06, 2.6, mPanel, sx * (W - 0.03), 0.98, -0.3);                  // the belt line's sill
        bx(0.06, 0.5, 0.1, mPanel, sx * W, 1.24, -0.1);                            // the B-pillar
        bx(0.06, 0.5, 0.16, mPanel, sx * W, 1.24, 0.85);                           // the C-pillar
        const ap = bx(0.06, 0.72, 0.06, mPanel, sx * (W - 0.04), 1.24, -1.46); ap.rotation.x = 0.86;   // the A-pillar along the screen
        bx(0.08, 0.04, 0.5, mPanel, sx * (W - 0.06), 0.86, 0.35);                  // the arm rest
      }
      /* the seats: the bench he sits on, the two front seats' backs with their headrests */
      bx(1.4, 0.16, 0.56, mSeat, 0, 0.6, 0.62); const rb = bx(1.4, 0.64, 0.14, mSeat, 0, 0.98, 0.95); rb.rotation.x = -0.18;
      for (const sx of [-1, 1]) {                    // CP6: a rounded shoulder, bolsters and a headrest, not a slab
        const sb = new THREE.Group(); sb.position.set(sx * 0.38, 0.92, -0.18); sb.rotation.x = -0.12; T0.add(sb);
        bx(0.5, 0.56, 0.14, mSeat, 0, -0.05, 0, sb);
        const top = mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.5, 14), mSeat, 0, 0.23, 0, sb); top.rotation.z = Math.PI / 2;
        for (const bs of [-1, 1]) mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.56, 10), mSeat, bs * 0.25, -0.05, 0.01, sb);
        const hr = mesh(new THREE.SphereGeometry(0.1, 16, 10), mSeat, 0, 0.44, -0.05, sb); hr.scale.set(1.3, 0.85, 0.55);
        bx(0.02, 0.1, 0.02, mChrome, -0.06, 0.32, -0.05, sb); bx(0.02, 0.1, 0.02, mChrome, 0.06, 0.32, -0.05, sb); }
      /* the dashboard, far off: its top, the meter's red figures, a phone in its holder glowing with a map */
      bx(2 * W, 0.08, 0.5, mDash, 0, 0.96, -1.42); bx(2 * W, 0.34, 0.06, mDash, 0, 0.78, -1.18);
      { const mt = new THREE.Mesh(new THREE.PlaneGeometry(0.14, 0.05), B({ map: tex(makeMeter(THREE, cnv)) })); mt.position.set(0.0, 1.03, -1.2); mt.rotation.x = -0.25; T0.add(mt); taxi.meter = mt;
        const ph2 = bx(0.08, 0.15, 0.012, M({ color: 0x0c0c10, roughness: 0.3 }), 0.24, 1.1, -1.24); ph2.rotation.x = -0.2;
        const scr = new THREE.Mesh(new THREE.PlaneGeometry(0.07, 0.135), B({ map: tex(makeNavMap(THREE, cnv)) })); scr.position.set(0.24, 1.1, -1.232); scr.rotation.x = -0.2; T0.add(scr); }
      /* the city: two strips of lights out of focus, one beside him that slides past, one ahead down the road. A strip is
         1024 × 256, so it repeats at the plane's own 4:1 and a disc stays round (CP6: at 2.2 every light was an egg) */
      { const side = tex(makeBokeh(THREE, cnv, 4861, false)), ahead = tex(makeBokeh(THREE, cnv, 4863, true));
        side.repeat.set(28 / 6.4 / 4, 1); ahead.repeat.set(1, 1);
        const sm = B({ map: side, fog: false, toneMapped: false }), am = B({ map: ahead, fog: false, toneMapped: false });
        const s2 = mesh(new THREE.PlaneGeometry(28, 6.4), sm, -6.5, 2.0, -0.6); s2.rotation.y = Math.PI / 2; s2.userData.dyn = true;
        const s3 = mesh(new THREE.PlaneGeometry(28, 6.4), sm, 6.5, 2.0, -0.6); s3.rotation.y = -Math.PI / 2; s3.userData.dyn = true;
        const a2 = mesh(new THREE.PlaneGeometry(14, 3.5), am, 0, 1.6, -9.5); a2.userData.dyn = true;
        taxi.bokeh.push(side, ahead);
        /* the road's wet sheen under the city, beside him */
        const wet = mesh(new THREE.PlaneGeometry(28, 6), B({ color: 0x0e0e16, fog: false }), -3.4, -0.2, -0.6); wet.rotation.x = -Math.PI / 2; void wet; }
      /* his window and the windscreen: rain on them */
      { const side = rainGlassMat({ cx: 22, cy: 12, hi: 0xffd8b4, slide: 0.4, rate: 0.08, k: 0.55, dark: 0.24, dir: [-0.85, -0.5] });   // back and down
        const g1 = mesh(new THREE.PlaneGeometry(0.86, 0.46), side, -W + 0.012, 1.22, 0.38); g1.rotation.y = Math.PI / 2; g1.userData.dyn = true; g1.renderOrder = 3;
        const g2 = mesh(new THREE.PlaneGeometry(0.78, 0.46), side, -W + 0.012, 1.22, -0.58); g2.rotation.y = Math.PI / 2; g2.userData.dyn = true; g2.renderOrder = 3;
        const front = rainGlassMat({ cx: 40, cy: 17, hi: 0xffcc98, slide: 0.18, rate: 0.16, k: 0.5, dark: 0.24, dir: [0, 1] });   // the wind pushes them up
        const ws = mesh(new THREE.PlaneGeometry(2 * W, 0.66), front, 0, 1.24, -1.46); ws.rotation.x = 0.86; ws.userData.dyn = true; ws.renderOrder = 3;
        taxi.glass.push(side, front);
        /* the wipers, pivoting at the screen's foot in its own plane */
        const wp = new THREE.Group(); wp.position.set(0, 1.035, -1.7); wp.rotation.x = 0.86; T0.add(wp); wp.userData.dyn = true;
        for (const px of [-0.42, 0.16]) { const piv = new THREE.Group(); piv.position.set(px, 0, 0.01); wp.add(piv);
          const arm = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.012, 0.012), M({ color: 0x0a0a0a, roughness: 0.6 })); arm.position.x = 0.3; piv.add(arm);
          taxi.wipers.push(piv); } }
    }

    /* ---------------------------------------------------- THE PICKUP'S CABIN (O6, O7, the endings' drives)
       Pong's white double-cab from the passenger seat (Thailand drives on the left: Pong is on the right, +x, the car
       facing −z): the dash and its cluster, the wheel, the console and the radio, the mirror and the jasmine garland
       swinging from it, the pillars, the liner, the door panels, the seats; the windscreen beaded with the first fat
       drops. Carried by the pickup, hidden until a film sits in it; while it shows, the exterior's own glass is hidden
       (from inside, a solid slab of tinted glass is a wall). */
    function buildCabin(pk) {
      const R0 = new THREE.Group(); R0.visible = false; R0.userData.dyn = true; pk.add(R0); cab.root = R0;
      const mesh = (g, m, x, y, z) => { const o = new THREE.Mesh(g, m); o.position.set(x, y, z); R0.add(o); return o; };
      const bx = (w, h, d, m, x, y, z) => mesh(new THREE.BoxGeometry(w, h, d), m, x, y, z);
      const mDash = M({ color: 0x2a2a2c, roughness: 0.75 }), mTrim = M({ color: 0x3a3a3c, roughness: 0.8 }), mSeat = M({ color: 0x3a3632, roughness: 0.92 });
      const mLiner = M({ color: 0x8a8680, roughness: 0.95, side: THREE.DoubleSide }), mChrome = M({ color: 0xa8acb0, roughness: 0.25, metalness: 0.9 });
      const W = 0.86;
      bx(2 * W, 0.03, 1.9, mDash, 0, 0.56, -0.1);                                  // the floor
      const ln = new THREE.Mesh(new THREE.PlaneGeometry(2 * W, 1.75), mLiner); ln.rotation.x = Math.PI / 2; ln.position.set(0, 1.76, 0.08); R0.add(ln);
      /* the dash: its top under the windscreen's foot, its face, the cluster's hood on Pong's side, the vents, the radio */
      { const top = bx(2 * W, 0.05, 0.46, mDash, 0, 1.13, -1.16); top.rotation.x = 0.08;
        bx(2 * W, 0.4, 0.08, mDash, 0, 0.92, -0.93);
        bx(0.42, 0.1, 0.22, mTrim, 0.42, 1.2, -0.98);
        for (const [x, c2] of [[0.34, 0xe8f0ff], [0.5, 0xffd8a0]]) { const d2 = new THREE.Mesh(new THREE.CircleGeometry(0.05, 18), B({ color: c2, transparent: true, opacity: 0.55 })); d2.position.set(x, 1.15, -0.865); R0.add(d2); }
        for (const x of [-0.62, -0.18, 0.18, 0.66]) bx(0.12, 0.05, 0.02, M({ color: 0x0c0c0e, roughness: 0.8 }), x, 1.04, -0.885);
        const rd = new THREE.Mesh(new THREE.PlaneGeometry(0.18, 0.06), B({ color: 0xff9a3a })); rd.position.set(0, 0.96, -0.883); R0.add(rd);
        bx(0.24, 0.32, 0.02, mTrim, 0, 0.94, -0.89); }
      /* the wheel and its column on Pong's side */
      { const wg = new THREE.Group(); wg.position.set(0.42, 1.22, -0.72); wg.rotation.x = -0.44; R0.add(wg);
        wg.add(new THREE.Mesh(new THREE.TorusGeometry(0.19, 0.017, 8, 32), mTrim));
        const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.07, 0.05, 14), mTrim); hub.rotation.x = Math.PI / 2; wg.add(hub);
        for (const a of [0.0, 2.3, 3.98]) { const sp = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.02, 0.012), mTrim); sp.position.set(Math.cos(a) * 0.09, Math.sin(a) * 0.09, 0); sp.rotation.z = a; wg.add(sp); }
        const col = bx(0.06, 0.06, 0.3, mTrim, 0.42, 1.12, -0.86); col.rotation.x = -0.44; }
      /* the console between the seats, the gear lever */
      bx(0.26, 0.32, 1.1, mTrim, 0, 0.72, -0.35);
      { const lv = bx(0.02, 0.18, 0.02, mChrome, 0, 0.97, -0.55); lv.rotation.x = 0.2; mesh(new THREE.SphereGeometry(0.032, 10, 8), mDash, 0, 1.06, -0.57); }
      /* the A-pillars along the windscreen's sides, the B-pillars, the door panels to the belt line */
      for (const sx of [-1, 1]) {
        const ap = bx(0.07, 0.86, 0.08, mDash, sx * (W - 0.05), 1.47, -1.08); ap.rotation.x = 0.77;
        bx(0.08, 0.62, 0.12, mDash, sx * (W - 0.03), 1.45, 0.86);
        bx(0.05, 0.58, 1.72, mTrim, sx * (W - 0.01), 0.86, -0.06);
        bx(0.08, 0.05, 0.6, mTrim, sx * (W - 0.06), 0.92, 0.02);                  // the arm rest
        bx(0.02, 0.025, 0.1, mChrome, sx * (W - 0.04), 1.02, -0.32);              // the handle
      }
      /* the cab's back wall, its small rear window over the tray */
      bx(2 * W, 0.64, 0.04, mTrim, 0, 0.88, 0.93);
      { const rw = new THREE.Mesh(new THREE.PlaneGeometry(1.3, 0.5), M({ color: 0x0c1014, roughness: 0.1, transparent: true, opacity: 0.55, depthWrite: false })); rw.position.set(0, 1.46, 0.945); R0.add(rw);
        for (const sx of [-1, 1]) bx((2 * W - 1.3) / 2, 0.56, 0.04, mTrim, sx * (W - (2 * W - 1.3) / 4), 1.46, 0.95); bx(2 * W, 0.08, 0.04, mTrim, 0, 1.73, 0.95); }
      /* the seats: his and Pong's, their backs and headrests — the cushion's top at 0.76, where a 1.70 m man's crown sits
         under the liner (1.76) with a hand to spare and his eye lands at the lens's 1.50 (CP9, by photograph: on a seat at
         0.99 Pong's head went up through the roof, and the turn to him found his chin under the liner; and, MEASURED in the
         cabin's frame, on a 0.80 cushion with his soles held on the floor his chair take lifted him 0.19 m off it, crown at
         1.91 — so his soles go under the floor, where nothing in the cabin can see them, and the crown is 1.68) */
      for (const sx of [-1, 1]) { bx(0.5, 0.14, 0.52, mSeat, sx * 0.42, 0.69, 0.02); const bk = bx(0.5, 0.66, 0.12, mSeat, sx * 0.42, 1.06, 0.34); bk.rotation.x = -0.16;
        bx(0.27, 0.18, 0.12, mSeat, sx * 0.42, 1.46, 0.4); }
      /* the mirror and the garland swinging from its stem */
      { bx(0.025, 0.08, 0.025, mDash, 0, 1.72, -0.8); bx(0.26, 0.07, 0.03, mDash, 0, 1.66, -0.79);
        const gl = new THREE.Group(); gl.position.set(0.03, 1.63, -0.775); R0.add(gl); cab.garland = gl;
        const gm = M({ map: tex(makeGarland(THREE, cnv)), roughness: 0.7, transparent: true, alphaTest: 0.3, side: THREE.DoubleSide });
        const p2 = new THREE.Mesh(new THREE.PlaneGeometry(0.06, 0.24), gm); p2.position.y = -0.12; gl.add(p2);
        const p3 = new THREE.Mesh(new THREE.PlaneGeometry(0.06, 0.24), gm); p3.position.y = -0.12; p3.rotation.y = Math.PI / 2; gl.add(p3); }
      /* the windscreen: its glass with the first drops on it (cab.drops), in the opening the exterior's slab filled */
      { const rg = rainGlassMat({ cx: 40, cy: 22, hi: 0xf0e2c8, slide: 0.06, rate: 0.05, k: 0, dark: 0.16 });
        const L = Math.hypot(0.6, 0.62), ws = new THREE.Mesh(new THREE.PlaneGeometry(2 * W - 0.14, L), rg);
        ws.position.set(0, (1.16 + 1.78) / 2, -(0.78 + 1.38) / 2); ws.rotation.x = Math.atan2(0.6, 0.62); ws.renderOrder = 3; R0.add(ws);
        cab.glass.push(rg); }
    }

    /* ---------------------------------------------------- the road's own (O5–O7, ending C): a roadside spirit house at
       the crossroads where the farm track crosses the road, and the stall across from the lane where a woman turns round */
    function buildRoadside() {
      const C = worldC, ROADY = 0.8;
      const mesh = (g, m, x, y, z) => { const o = new THREE.Mesh(g, m); o.position.set(x, y, z); o.castShadow = !LOW; o.receiveShadow = true; C.add(o); return o; };
      const bx = (w, h, d, m, x, y, z) => mesh(new THREE.BoxGeometry(w, h, d), m, x, y, z);
      /* the crossroads at x −48: the farm track up the bund onto the road, both sides */
      const mTrack = M({ map: tex(makeRedEarth(THREE, cnv)), roughness: 0.95, side: THREE.DoubleSide });
      for (const [z0, z1, y0, y1] of [[13.0, 17.6, -0.22, ROADY], [24.4, 29.0, ROADY, -0.22]]) {
        const g = new THREE.BufferGeometry(), x0 = -49.4, x1 = -46.6;
        g.setAttribute('position', new THREE.BufferAttribute(new Float32Array([x0, y0, z0, x1, y0, z0, x1, y1, z1, x0, y1, z1]), 3));
        g.setAttribute('uv', new THREE.BufferAttribute(new Float32Array([0, 0, 1, 0, 1, 2, 0, 2]), 2)); g.setIndex([0, 2, 1, 0, 3, 2]); g.computeVertexNormals();
        const o = new THREE.Mesh(g, mTrack); o.receiveShadow = true; C.add(o);
      }
      /* the spirit house at its corner: newer and gilded, on a white pillar on a pad, its soda bottles and garlands */
      { const X = -44.6, Z = 16.4, Y = ROADY - 0.22, mW = M({ color: 0xece6da, roughness: 0.6 }), mG = M({ color: 0xc89a3a, roughness: 0.35, metalness: 0.7 }),
              mR = M({ color: 0xa8201c, roughness: 0.5 }), mSoda = M({ color: 0xd8141c, roughness: 0.15, transparent: true, opacity: 0.85 });
        bx(1.1, 0.9, 1.1, M({ color: 0xa8a29a, roughness: 0.9 }), X, Y - 0.45, Z);
        bx(0.22, 1.33, 0.22, mW, X, Y + 0.665, Z);
        bx(0.9, 0.06, 0.9, mW, X, Y + 1.36, Z);
        bx(0.5, 0.42, 0.42, mG, X, Y + 1.6, Z - 0.12); bx(0.18, 0.28, 0.02, mR, X, Y + 1.56, Z + 0.1);
        for (const [dx, dz] of [[-0.24, 0.12], [0.24, 0.12], [-0.24, -0.34], [0.24, -0.34]]) bx(0.04, 0.42, 0.04, mG, X + dx, Y + 1.6, Z + dz);
        const roof = (y, w, d, h) => { const g = new THREE.ConeGeometry(Math.hypot(w, d) * 0.5, h, 4); g.rotateY(Math.PI / 4); const o = mesh(g, mR, X, y, Z - 0.12); o.scale.set(w / Math.hypot(w, d) * 1.414, 1, d / Math.hypot(w, d) * 1.414); return o; };
        roof(Y + 1.94, 0.7, 0.62, 0.26); roof(Y + 2.12, 0.46, 0.4, 0.22);
        mesh(new THREE.ConeGeometry(0.03, 0.22, 6), mG, X, Y + 2.33, Z - 0.12);
        for (let k = 0; k < 6; k++) { const b2 = mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.14, 8), mSoda, X - 0.3 + k * 0.12, Y + 1.46, Z + 0.32); void b2; }
        const jas = M({ color: 0xf4f0e2, roughness: 0.7 });
        for (let k = 0; k < 3; k++) { const t2 = mesh(new THREE.TorusGeometry(0.07, 0.012, 6, 14), jas, X - 0.15 + k * 0.15, Y + 1.45, Z + 0.22); t2.rotation.x = Math.PI / 2; }
        solids.push(hidBox(1.1, 2.4, 1.1, X, Y + 1.0, Z, C)); }
      /* the stall across the road: a lean-to of zinc on four posts, its table of fruit and bottled drinks, a bare bulb */
      { const X = 44.5, Z = 26.0, Y = ROADY, mPost = M({ color: 0x6a5a48, roughness: 0.85 }), mZ = M({ color: 0x8a7a68, roughness: 0.6, metalness: 0.3, side: THREE.DoubleSide }),
              mTab = M({ color: 0x8a6a4a, roughness: 0.8 }), mBulb = B({ color: 0xffe2a0 });
        bx(3.4, 1.3, 2.4, mTrack, X, Y - 0.65, Z);                                    // its pad, built up to the road's level
        for (const [dx, dz] of [[-1.3, -0.9], [1.3, -0.9], [-1.3, 0.9], [1.3, 0.9]]) bx(0.08, dz < 0 ? 2.3 : 2.0, 0.08, mPost, X + dx, Y + (dz < 0 ? 1.15 : 1.0), Z + dz);
        const rf = new THREE.Mesh(new THREE.PlaneGeometry(3.0, 2.2), mZ); rf.position.set(X, Y + 2.18, Z); rf.rotation.x = -Math.PI / 2 - 0.14; C.add(rf);
        bx(2.2, 0.05, 0.9, mTab, X, Y + 0.78, Z - 0.3); for (const dx of [-1.0, 1.0]) for (const dz of [-0.7, 0.1]) bx(0.05, 0.76, 0.05, mTab, X + dx, Y + 0.38, Z + dz);
        const cols = [0xe8a020, 0xd84a1a, 0x9ab830, 0xf2d040], r2 = rng(4871);
        for (let k = 0; k < 4; k++) { const bas = mesh(new THREE.CylinderGeometry(0.2, 0.15, 0.1, 14, 1, true), M({ color: 0x9a7a4a, roughness: 0.9, side: THREE.DoubleSide }), X - 0.8 + k * 0.5, Y + 0.86, Z - 0.35); void bas;
          for (let j = 0; j < 7; j++) mesh(new THREE.SphereGeometry(0.06, 10, 8), M({ color: cols[k], roughness: 0.6 }), X - 0.8 + k * 0.5 + (r2() - 0.5) * 0.2, Y + 0.92 + r2() * 0.05, Z - 0.35 + (r2() - 0.5) * 0.2); }
        for (let k = 0; k < 8; k++) mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.2, 8), M({ color: [0xe02a20, 0x2a8a3a, 0xf2a020][k % 3], roughness: 0.2, transparent: true, opacity: 0.85 }), X + 0.9 - (k % 4) * 0.08, Y + 0.91, Z - 0.05 - (k / 4 | 0) * 0.08);
        mesh(new THREE.SphereGeometry(0.05, 10, 8), mBulb, X, Y + 1.88, Z - 0.2);
        solids.push(hidBox(2.8, 2.2, 2.0, X, Y + 1.1, Z, C)); }
    }

    /* ---------------------------------------------------- the sets alive: the shutter, the LEDs, his phone; the taxi's
       city, wipers and streetlights; the cabin's garland and drops */
    /* his phone's lock screen: the time, and one message on it — who sent it and its first words (the sheet's) */
    function phoneDraw(who) {
      const P = shop.phone; if (!P || P.drawn === who) return; P.drawn = who;
      const x = P.x, Wd = DATA.words, ajahn = who === 'ajahn';
      const g = x.createLinearGradient(0, 0, 0, 557); g.addColorStop(0, ajahn ? '#3a3a44' : '#1c2a44'); g.addColorStop(1, ajahn ? '#121216' : '#0a0e18');
      x.fillStyle = g; x.fillRect(0, 0, 256, 557);
      x.fillStyle = 'rgba(255,255,255,0.92)'; x.textAlign = 'center'; x.textBaseline = 'alphabetic';
      x.font = '300 64px "Helvetica Neue", Arial, sans-serif'; x.fillText(ajahn ? '9:12' : '9:48', 128, 120);
      /* the notification card */
      const cx = 14, cy = 176, cw = 228, ch = 112, r = 16;
      x.fillStyle = 'rgba(245,245,248,0.88)';
      x.beginPath(); x.moveTo(cx + r, cy); x.arcTo(cx + cw, cy, cx + cw, cy + ch, r); x.arcTo(cx + cw, cy + ch, cx, cy + ch, r);
      x.arcTo(cx, cy + ch, cx, cy, r); x.arcTo(cx, cy, cx + cw, cy, r); x.closePath(); x.fill();
      x.fillStyle = '#2fae5a'; x.beginPath(); x.arc(cx + 26, cy + 26, 13, 0, Math.PI * 2); x.fill();          // the chat app's mark
      x.fillStyle = '#fff'; x.beginPath(); x.ellipse(cx + 26, cy + 25, 7, 5.5, 0, 0, Math.PI * 2); x.fill();
      x.textAlign = 'left'; x.fillStyle = '#16161a';
      x.font = 'bold 19px "Helvetica Neue", Arial, sans-serif'; x.fillText(ajahn ? (Wd.phoneAjahn || 'Ajahn') : (Wd.phonePong || 'Pong'), cx + 48, cy + 32);
      x.fillStyle = '#6a6a72'; x.font = '15px "Helvetica Neue", Arial, sans-serif'; x.textAlign = 'right'; x.fillText(Wd.phoneNow || 'now', cx + cw - 12, cy + 31);
      x.textAlign = 'left'; x.fillStyle = '#26262c'; x.font = '18px "Helvetica Neue", Arial, sans-serif';
      if (ajahn) {
        /* his greeting, a lotus after it, and a wish for the shop under them (CP13: alone, a greeting landing a second
           after "...I stopped feeling like myself" read as the cause of it) */
        const msg = Wd.phoneAjahnMsg || 'Sawasdee krap';
        x.fillText(msg, cx + 16, cy + 64);
        if (Wd.phoneAjahnMsg2) x.fillText(Wd.phoneAjahnMsg2, cx + 16, cy + 88);
        /* a lotus after his words, drawn (an emoji is not on every phone's canvas) */
        const lx = cx + 24 + x.measureText(msg).width + 16, ly = cy + 58;
        for (let k = 0; k < 5; k++) { x.save(); x.translate(lx, ly + 6); x.rotate((k - 2) * 0.42); x.fillStyle = k % 2 ? '#e88aa8' : '#d8658a';
          x.beginPath(); x.moveTo(0, 0); x.quadraticCurveTo(7, -9, 0, -18); x.quadraticCurveTo(-7, -9, 0, 0); x.fill(); x.restore(); }
        x.fillStyle = '#3a9a5a'; x.fillRect(lx - 9, ly + 7, 18, 2.5);
      } else {
        /* Pong's first message, wrapped to two lines */
        const words = String(Wd.chat1 || 'Brother!! Come Thailand. I bring you see one Ajahn.').split(/\s+/); let line = '', y = cy + 64, n = 0;
        for (const w of words) { const tl = line ? line + ' ' + w : w;
          if (x.measureText(tl).width > cw - 32 && line) { if (n === 1) { x.fillText(line + '…', cx + 16, y); line = ''; n++; break; } x.fillText(line, cx + 16, y); y += 24; n++; line = w; } else line = tl; }
        if (line && n < 2) x.fillText(line, cx + 16, y);
      }
      P.scr.map.needsUpdate = true;
    }
    const shopCtl = {
      shutter(u, secs = 0) { shop.uFrom = shop.u; shop.uTo = Math.max(0, Math.min(1, u)); shop.t0 = wallNow(); shop.t1 = shop.t0 + Math.max(0.001, secs); if (!secs) shop.u = shop.uTo; },
      lights(k, secs = 0) { shop.ledFrom = shop.ledK; shop.ledTo = k; shop.l0 = wallNow(); shop.l1 = shop.l0 + Math.max(0.001, secs); if (!secs) shop.ledK = k; },
      phone(on) { shop.phoneOn = on ? wallNow() : 0; }
    };
    const cabCtl = {
      show(on) { cab.show = !!on; if (cab.root) cab.root.visible = !!on; const gl = yard.pickup && yard.pickup.userData.glass; if (gl) for (const g of gl) g.visible = !on; },
      drops(k) { cab.drops = k; for (const m of cab.glass) m.uniforms.uK.value = k; }
    };
    function shopFrame(now) {
      if (!worldS.visible) return;
      const k = Math.min(1, Math.max(0, (now - shop.t0) / Math.max(0.001, shop.t1 - shop.t0)));
      if (shop.t1 > 0 && k < 1) shop.u = shop.uFrom + (shop.uTo - shop.uFrom) * k * k * (3 - 2 * k); else if (shop.t1 > 0) shop.u = shop.uTo;
      if (shop.curtain) {
        const h = Math.max(0.02, shop.top * (1 - shop.u));
        shop.curtain.scale.y = h; shop.curTex.repeat.set(1, h / 0.6);
        shop.bar.position.set(0, shop.top - h, SHOP.z1); shop.bar.visible = shop.u < 0.995;
        const dep = 0.3 + 2.8 * shop.u; shop.spill.scale.y = dep; shop.spill.position.z = SHOP.z1 - dep / 2 + 0.2;
        /* (CP9, by photograph: at 0.34 additive on the pale terrazzo it blew out to a white oval in the middle of a phone's
           frame — warmer and two thirds as strong, it reads as morning light on a floor) */
        shop.spillMat.opacity = 0.2 * Math.min(1, shop.u * 2.5);
      }
      const kl = Math.min(1, Math.max(0, (now - shop.l0) / Math.max(0.001, shop.l1 - shop.l0)));
      if (shop.l1 > 0) shop.ledK = kl < 1 ? shop.ledFrom + (shop.ledTo - shop.ledFrom) * kl : shop.ledTo;
      for (const m of shop.leds) if (m) m.color.setRGB(0.12 + 0.88 * shop.ledK, 0.12 + 0.88 * shop.ledK, 0.13 + 0.87 * shop.ledK);
      if (shop.phone) {
        const on = shop.phoneOn ? now - shop.phoneOn : -1, P = shop.phone;
        if (on >= 0) { phoneDraw(shop.phoneWho || 'pong'); P.scr.color.setRGB(1, 1, 1); const buzz = on < 1.6 ? Math.sin(on * 90) * 0.0012 * (1 - on / 1.6) : 0; P.g.position.x = P.base.x + buzz; }
        else { P.scr.color.setRGB(0.02, 0.024, 0.03); P.g.position.x = P.base.x; }
      }
    }
    function taxiFrame(now) {
      if (!worldT.visible) { taxi.last = 0; return; }
      const dt = taxi.last ? Math.min(0.1, now - taxi.last) : 0; taxi.last = now;
      if (taxi.bokeh[0]) taxi.bokeh[0].offset.x -= dt * 0.11;
      if (taxi.bokeh[1]) taxi.bokeh[1].offset.x = Math.sin(now * 0.07) * 0.03;
      for (const m of taxi.glass) m.uniforms.uTime.value = now % 1000;
      if (taxi.wipe) { const ph = (now % 1.7) / 1.7, a = ph < 0.5 ? Math.sin(ph * Math.PI * 2 - Math.PI / 2) * 0.5 + 0.5 : Math.sin((1 - ph) * Math.PI * 2 - Math.PI / 2) * 0.5 + 0.5;
        taxi.wipers.forEach((w, i) => { w.rotation.z = 0.08 + a * (i ? 1.25 : 1.1); }); }
      /* a streetlight passing: a warm band sliding front to back across the cabin in a third of a second, then the dark
         until the next lamp (one every 1.8 s, each its own brightness) */
      const per = 1.8, ph = (now % per) / per, s = 0.55 + 0.45 * Math.pow(Math.sin(Math.floor(now / per) * 12.9898), 2);
      taxi.sweepU.value = ph < 0.32 ? -2.8 + (ph / 0.32) * 5.2 : 9;
      for (const m of taxi.sweep) m.emissive.setRGB(0.045 * s, 0.03 * s, 0.012 * s);
    }
    function cabFrame(now) {
      if (!cab.show) { cab.last = 0; return; }
      const dt = cab.last ? Math.min(0.1, now - cab.last) : 0; cab.last = now;
      for (const m of cab.glass) m.uniforms.uTime.value = now % 1000;
      if (cab.garland) { cab.swing += dt; cab.garland.rotation.z = Math.sin(cab.swing * 2.3) * 0.12 + Math.sin(cab.swing * 5.1) * 0.03; cab.garland.rotation.x = Math.sin(cab.swing * 1.7) * 0.06; }
    }

    buildCompound();
    buildVegetation();
    buildRoadside();
    yard.pickup.userData.dyn = true;                     // it drives in the films: never baked into the yard
    buildCabin(yard.pickup);
    mergeStatic(worldC, new Set([...walls, ...solids]));
    buildShop();
    buildTaxi();
    mergeStatic(worldS, new Set([...walls, ...solids]));
    mergeStatic(worldT, new Set([...walls, ...solids]));

    /* ============================================== THE CAST (CP7, §3.5)
       Every person is a real character model (v21.16): the first master is his own; everyone else wears a placeholder
       until Chad's model lands (docs/E4-MODELS.md). One routine places them all — e3c5's mkPerson, by its own laws:
       sized from POSED BONES in a STANDING take (v3.8/v4.7; a seated take's bones measure a seated body), grounded on
       the lowest of them, or SEATED BY THE SKIN: the underside of the hips and thighs in the sitting take, measured on
       the posed skin, set on the seat's top (v17.1 — a robe's drape between the knees is not where a man sits); culled by
       a sphere round the posed skin (v18.5); the head's look laid on after the mixer and put back before it runs again
       (v11.5); a seated talker's talking take ridden on the upper body only, so his crossed legs stay where they are
       (v21.1). A failed download leaves the place empty, never a block of a person. */
    /* (the seated three in the sala cast no shadow: under its roof they stand in its shade, and on a desktop their shadow
       pass was another 130k triangles in the yard's widest view — CP7 measured 381k against the 297,872 budget) */
    const people = [];
    const _pv = new THREE.Vector3(), _pq = new THREE.Quaternion(), _pe = new THREE.Euler(), _hp = new THREE.Vector3(), _cp = new THREE.Vector3();
    const _hq = new THREE.Quaternion(), _pq2 = new THREE.Quaternion(), _dq = new THREE.Quaternion(), _iq = new THREE.Quaternion(), _fv = new THREE.Vector3();
    const _qlk = new THREE.Quaternion();     // the look's turn at its weight (never blended INTO _dq: see below)
    const _spq = new THREE.Quaternion(), _qy = new THREE.Quaternion(), _ax = new THREE.Vector3(), _UPV = new THREE.Vector3(0, 1, 0);
    const UPPER_RE = /Spine|Neck|Head|Shoulder|Arm|Hand|neck/;
    const LOWER_RE = /Hips|UpLeg|Leg|Foot|Toe/;
    function upperOnly(clip) {
      const c = clip.clone();
      c.tracks = c.tracks.filter(tr => { const node = tr.name.split('.')[0]; return UPPER_RE.test(node) && !LOWER_RE.test(node); });
      c.name = clip.name + '_upper';
      return c;
    }
    function lowerOnly(clip) {
      const c = clip.clone();
      c.tracks = c.tracks.filter(tr => LOWER_RE.test(tr.name.split('.')[0]));
      c.name = clip.name + '_lower';
      return c;
    }
    /* the skin's seat: the vertices the hips and thighs carry (each vertex's heaviest bone), their lowest band's centre,
       in the group's frame — where a sitting body meets what it sits on */
    function seatContact(P) {
      P.group.updateMatrixWorld(true);
      let lo = Infinity; const pts = [];
      P.model.traverse(m => {
        if (!m.isSkinnedMesh) return;
        m.skeleton.update();
        const si = m.geometry.attributes.skinIndex, sw = m.geometry.attributes.skinWeight, n = m.geometry.attributes.position.count;
        if (!si || !sw) return;
        const st = Math.max(1, Math.floor(n / 6000));
        for (let i = 0; i < n; i += st) {
          let bi = 0, bw = -1;
          for (let k = 0; k < 4; k++) { const w = sw.getComponent(i, k); if (w > bw) { bw = w; bi = si.getComponent(i, k); } }
          const b = m.skeleton.bones[bi]; if (!b || !/Hips|UpLeg/.test(b.name)) continue;
          m.getVertexPosition(i, _pv); _pv.applyMatrix4(m.matrixWorld); P.group.worldToLocal(_pv);
          pts.push(_pv.x, _pv.y, _pv.z); if (_pv.y < lo) lo = _pv.y;
        }
      });
      if (!pts.length) return null;
      let sx = 0, sz = 0, n = 0;
      for (let i = 0; i < pts.length; i += 3) if (pts[i + 1] < lo + 0.03) { sx += pts[i]; sz += pts[i + 2]; n++; }
      return new THREE.Vector3(sx / n, lo, sz / n);
    }
    /* the skin's lowest point, every vertex (a sitter's heels on the floor; a stander's soles), in the group's frame */
    function skinLow(P) {
      P.group.updateMatrixWorld(true);
      let lo = Infinity;
      P.model.traverse(m => { if (!m.isSkinnedMesh) return; m.skeleton.update(); const n = m.geometry.attributes.position.count, st = Math.max(1, Math.floor(n / 4000));
        for (let i = 0; i < n; i += st) { m.getVertexPosition(i, _pv); _pv.applyMatrix4(m.matrixWorld); P.group.worldToLocal(_pv); if (_pv.y < lo) lo = _pv.y; } });
      return lo;
    }
    /* A PERSON'S TAKES ARE LAYERS, their weights eased every frame from what he is doing — never three's own fades, which
       a weight set on the next frame silently cancels (setEffectiveWeight stops a fade): standing or sitting (each rest
       split into legs and body, so a seated talker's crossed legs stay crossed), walking, talking (the body only) and a
       one-off gesture (the pao). Standing up and sitting down blend the pose AND the body's offset onto the seat together,
       so a man rises off a bench rather than jumping out of it. */
    function mkPerson(key, o) {
      const parent = o.parent;
      const group = new THREE.Group(); group.position.set(o.x, o.y != null ? o.y : (o.ground ? o.ground(o.x, o.z) : 0), o.z); group.rotation.y = o.ry || 0; parent.add(group);
      if (o.hidden) group.visible = false;
      const P = { key, group, model: null, mixer: null, L: {}, head: null, headWrote: null, ready: false, o,
                  seated: o.posture === 'sit', sitW: o.posture === 'sit' ? 1 : 0, walkW: 0, oneW: 0, talkW: 0, talkUntil: 0,
                  one: null, walk: null, turnTo: null, lookW: 0, lookDir: new THREE.Vector3(0, 0, 1), faceLocal: null, look: o.look || 0, lookAt: null, lookFilm: false,
                  bow: o.bow || 0, bowNow: o.bow || 0, inner: null, standInner: new THREE.Vector3(), sitInner: new THREE.Vector3(), onReady: [], onFail: [] };
      const loads = [parseOnce(key)].concat(o.anims ? [parseOnce(o.anims)] : []);
      Promise.all(loads).then(([gltf, extra]) => {
        if (!alive) return;
        const g = cloneSkinned(gltf.scene);
        const clips = gltf.animations.concat(extra ? extra.animations : []);
        g.traverse(m => { if (m.isMesh) { m.castShadow = !LOW && !o.noShadow; m.receiveShadow = false;
          if (o.noMip) for (const mm of [].concat(m.material)) { const t = mm && mm.map;
            if (t && t.generateMipmaps !== false) { t.generateMipmaps = false; t.minFilter = THREE.LinearFilter; t.needsUpdate = true; } } } });
        g.traverse(b => { if (b.isBone && HEAD_RE.test(b.name) && !P.head) P.head = b; });
        g.traverse(b => { if (b.isBone && /Hips(_\d+)?$/.test(b.name) && !P.hips) P.hips = b; });
        g.traverse(b => { if (b.isBone && /Spine2(_\d+)?$/.test(b.name) && !P.spine) P.spine = b; });
        const mx = new THREE.AnimationMixer(g);
        const clip = (n) => clips.find(a => a.name === n);
        const acts = new Map();
        const act = (name, part) => {
          const c = clip(name); if (!c) return null;
          const k = name + '|' + (part || 'full');
          if (!acts.has(k)) acts.set(k, mx.clipAction(part === 'upper' ? upperOnly(c) : part === 'lower' ? lowerOnly(c) : c));
          return acts.get(k);
        };
        P.act = act;
        /* the size: a STANDING take's posed bones (a seated take measures a seated body); a rig with neither a standing
           take nor a standing bind pose is sized SITTING, floor to crown (chapter 3's crowd, 1.30) */
        const sizeC = o.sizeTake === '@bind' ? null : clip(o.seatedHeight ? o.sit : (o.sizeTake || o.stand || o.sit)) || clips[0];
        let lo = Infinity, hi = -Infinity;
        if (!sizeC) {
          g.updateMatrixWorld(true);
          g.traverse(b => { if (!b.isBone) return; b.getWorldPosition(_pv); lo = Math.min(lo, _pv.y); hi = Math.max(hi, _pv.y); });
        } else {
          const a = mx.clipAction(sizeC); a.reset().setEffectiveWeight(1).play();
          for (let k = 0; k < 6; k++) { mx.setTime(sizeC.duration * k / 6); g.updateMatrixWorld(true);
            g.traverse(b => { if (!b.isBone) return; b.getWorldPosition(_pv); lo = Math.min(lo, _pv.y); hi = Math.max(hi, _pv.y); }); }
          a.stop(); mx.uncacheAction(sizeC);
        }
        if (!(hi > lo)) { console.warn(key + ': no bones to size by'); return; }
        const crown = (() => { let c = false; g.traverse(b => { if (b.isBone && /HeadTop_End|head_end|headtop/i.test(b.name)) c = true; }); return c; })();
        const s = o.seatedHeight ? o.seatedHeight / (hi - lo) : o.height / ((hi - lo) / (crown ? 1 : 0.935));
        const inner = new THREE.Group(); inner.scale.setScalar(s); inner.add(g); group.add(inner);
        P.inner = inner; P.model = g; P.mixer = mx; P.scale = s;
        /* the layers */
        const L = P.L;
        if (o.stand) { L.standLo = act(o.stand, 'lower'); L.standUp = act(o.stand, 'upper'); }
        if (o.sit) { L.sitLo = act(o.sit, 'lower'); L.sitUp = act(o.sit, 'upper'); }
        L.walk = o.walk === false ? null : act(o.walk || 'Walking');
        L.talk = o.talk ? act(o.talk, 'upper') : null;
        for (const k of ['standLo', 'standUp', 'sitLo', 'sitUp', 'walk', 'talk']) if (L[k]) L[k].reset().setEffectiveWeight(0).play();
        const pose = (sitW) => {                            // the rest alone, at this blend, for measuring
          for (const k of ['standLo', 'standUp']) if (L[k]) L[k].setEffectiveWeight(1 - sitW);
          for (const k of ['sitLo', 'sitUp']) if (L[k]) L[k].setEffectiveWeight(sitW);
          if (L.walk) L.walk.setEffectiveWeight(0); if (L.talk) L.talk.setEffectiveWeight(0);
          mx.update(0); g.updateMatrixWorld(true);
        };
        /* standing: the soles a hair over the floor (the stand take's lowest bone, measured in its own clock) */
        if (o.stand) {
          inner.position.set(0, 0, 0); pose(0);
          let sl = Infinity; const sa = clip(o.stand);
          for (let k = 0; k < 4; k++) { mx.setTime(sa.duration * k / 4); g.updateMatrixWorld(true);
            g.traverse(b => { if (b.isBone && /Foot|Toe/.test(b.name)) { b.getWorldPosition(_pv); sl = Math.min(sl, _pv.y); } }); }
          if (!isFinite(sl)) sl = lo;
          P.standInner.set(0, -sl * s + 0.005, 0);
          if (o.ground === 'skin') { inner.position.copy(P.standInner); P.standInner.y -= skinLow(P) - 0.004; }
        }
        /* seated: the skin's seat set on the seat's top, at the group's origin; never through the floor under the seat; and
           on a bench, feet that would hang are let down onto the floor, the seat taking up to 5 cm of it (cloth gives) */
        if (o.sit) {
          inner.position.set(0, 0, 0); pose(1);
          const c = seatContact(P);
          if (c) P.sitInner.set(-c.x, (o.seatH || 0) - c.y, -c.z);
          if (o.seatFloor != null) {
            inner.position.copy(P.sitInner); const lw = skinLow(P);
            if (lw < o.seatFloor + 0.004) P.sitInner.y += o.seatFloor + 0.004 - lw;
            else if (o.feet && lw > o.seatFloor + 0.01) P.sitInner.y -= Math.min(lw - o.seatFloor - 0.01, 0.05);
          }
          inner.position.copy(P.sitInner);
          P.diag = { scale: +s.toFixed(4), seat: c && [+c.x.toFixed(3), +c.y.toFixed(3), +c.z.toFixed(3)], low: +(skinLow(P) + (o.y || 0)).toFixed(3) };
        }
        /* (a parked rest — her one still frame — and a slower breath are set after the measuring, which runs the clocks) */
        if (o.idleAt != null) for (const k of ['standLo', 'standUp', 'sitLo', 'sitUp']) if (L[k]) { L[k].time = o.idleAt; L[k].setEffectiveTimeScale(0); }
        if (o.restRate) for (const k of ['standLo', 'standUp', 'sitLo', 'sitUp']) if (L[k]) L[k].setEffectiveTimeScale(o.restRate);
        pose(P.sitW);
        inner.position.lerpVectors(P.standInner, P.sitInner, P.sitW);
        /* his face's direction, in the head bone's own frame, measured at the FILE's own rest — every layer at weight 0,
           so the mixer gives back the pose the file was bound in, head level and along the body's forward. A take's rest
           may hold the head anywhere (CP9, by photograph: Pong's cross-legged take holds his chin up and his head turned,
           and a face measured there looked past the lens by that turn whenever he was asked to look at it). The turn
           the take's own rest holds the head at is kept as a diagnostic (`diag.faceTurn`, degrees). */
        if (P.head) {
          for (const k of ['standLo', 'standUp', 'sitLo', 'sitUp', 'walk', 'talk']) if (L[k]) L[k].setEffectiveWeight(0);
          mx.update(0); group.updateMatrixWorld(true);
          P.head.getWorldQuaternion(_hq);
          group.getWorldQuaternion(_pq);
          P.faceLocal = new THREE.Vector3(0, 0, 1).applyQuaternion(_pq).applyQuaternion(_hq.invert()).normalize();
          pose(P.sitW); group.updateMatrixWorld(true);
          P.head.getWorldQuaternion(_hq);
          const fw = P.faceLocal.clone().applyQuaternion(_hq), bw = new THREE.Vector3(0, 0, 1).applyQuaternion(_pq);
          P.diag = Object.assign(P.diag || {}, { faceTurn: +THREE.MathUtils.radToDeg(fw.angleTo(bw)).toFixed(1) });
        }
        P.ready = true;
        /* the culling sphere round the posed skin, in world space, generous (v18.5's law) — a walker's is wider */
        group.updateMatrixWorld(true);
        const bb = new THREE.Box3();
        g.traverse(m => { if (!m.isSkinnedMesh) return; m.skeleton.update(); const n = m.geometry.attributes.position.count, st = Math.max(1, Math.floor(n / 3000));
          for (let i = 0; i < n; i += st) { m.getVertexPosition(i, _pv); _pv.applyMatrix4(m.matrixWorld); bb.expandByPoint(_pv); } });
        if (!bb.isEmpty()) {
          const sph = bb.getBoundingSphere(new THREE.Sphere()); sph.radius = Math.max(sph.radius * 1.5, 1.3);
          g.traverse(m => { if (!m.isSkinnedMesh) return; m.frustumCulled = true; const inv = m.matrixWorld.clone().invert(), k = m.matrixWorld.getMaxScaleOnAxis() || 1;
            m.boundingSphere = new THREE.Sphere(sph.center.clone().applyMatrix4(inv), sph.radius / k); });
        }
        owned.push({ dispose: () => mx.stopAllAction() });
        if (o.then) o.then(P);
        for (const f of P.onReady.splice(0)) f(P);
      }).catch(err => {
        console.warn(key + ' failed to load', err); if (ctx.loadFail) ctx.loadFail(key, err);
        /* (CP13: a beat that waits on a person never came when the download failed — the tray, the fourth sign) */
        P.failed = true; for (const f of P.onFail.splice(0)) f(P);
      });
      people.push(P);
      return P;
    }
    const whenReady = (P, f) => { if (!P) return; if (P.ready) f(P); else P.onReady.push(f); };
    /* the same, with what to do if his model never comes (the v4.7 rule: a failed download costs a person, never the
       chapter) */
    const whenReadyOr = (P, f, fail) => { if (!P || P.failed) { fail(); return; } if (P.ready) { f(P); return; } P.onReady.push(f); P.onFail.push(fail); };
    /* he speaks: the talking take eased in over his rest for the line's length, on WALL time */
    function personTalk(P, secs) { if (P) P.talkUntil = wallNow() + secs; }
    /* a take played once over the rest (a gesture, the pao), on the body only unless asked; `hold` keeps its last frame */
    function personDo(P, name, o = {}) {
      whenReady(P, () => {
        const a = P.act(name, o.full ? null : 'upper'); if (!a) return;
        if (P.one && P.one.a !== a) P.one.a.setEffectiveWeight(0);
        a.reset().setLoop(o.loop ? THREE.LoopRepeat : THREE.LoopOnce, o.loop ? Infinity : 1); a.clampWhenFinished = true;
        a.setEffectiveTimeScale(o.rate || 1).setEffectiveWeight(0).play();
        P.one = { a, until: o.loop || o.hold ? Infinity : wallNow() + a.getClip().duration / (o.rate || 1) - 0.3 };
      });
    }
    function personRest(P) { if (P) P.one && (P.one.until = 0); }
    /* sitting down and getting up: the blend of pose and offset eases on the frame (sitW); a walk waits for the standing.
       `seat` ({x, z}, the parent's frame) sits him onto a seat from where he stands in front of it: the group moves onto
       the seat at once and the body is carried back to it with the blend (P.sitOff, the parent's frame, shrinking with
       1 − sitW), so he lowers himself backwards onto the bench rather than sinking into it where he stood. Getting up
       carries him forward again by the same step (`seatFwd`, 0.42 m when he began seated), and the group follows the
       body once he is up. */
    function personSit(P, on = true, seat) {
      if (!P) return;
      P.seated = !!on;
      if (on) {
        P.walk = null;
        if (seat && P.ready) {
          const g = P.group, ox = g.position.x - seat.x, oz = g.position.z - seat.z;
          P.sitOff = new THREE.Vector3(ox, 0, oz); P.seatFwd = Math.hypot(ox, oz);
          g.position.x = seat.x; g.position.z = seat.z;
          if (P.o.ground) g.position.y = P.o.ground(seat.x, seat.z);
          P.sitOffK = 1 - P.sitW;                               // what of the step the blend still has to carry
        }
      } else if (P.ready && P.sitOff && P.sitOffK >= 0) {
        P.sitOffK = -1;                                       // told to stand mid-sit: the same step, now carried forward
      } else if (P.ready && !P.sitOff && P.sitW > 0.002) {
        const f = P.seatFwd != null ? P.seatFwd : (P.o.seatFwd != null ? P.o.seatFwd : 0.42);
        const ry = P.group.rotation.y;
        P.sitOff = new THREE.Vector3(Math.sin(ry) * f, 0, Math.cos(ry) * f); P.sitOffK = -1;   // rising: grows with 1 − sitW
      }
    }
    /* the step, on the frame: the body's place relative to the group, in the group's own frame */
    const _so = new THREE.Vector3();
    function sitStep(P) {
      if (!P.sitOff) return;
      const g = P.group, rising = P.sitOffK < 0;
      const k = rising ? (1 - P.sitW) : (P.sitOffK > 0 ? (1 - P.sitW) / P.sitOffK : 0);
      _so.copy(P.sitOff).multiplyScalar(Math.min(1, k));
      const c = Math.cos(g.rotation.y), s = Math.sin(g.rotation.y);   // the parent's frame into the group's (a turn about y)
      P.inner.position.x += _so.x * c - _so.z * s; P.inner.position.z += _so.x * s + _so.z * c;
      if (!rising && P.sitW > 0.999) P.sitOff = null;
      if (rising && P.sitW < 0.001) sitRebase(P);
    }
    /* up: the group stands where the body does, and the offset is gone */
    function sitRebase(P) {
      if (!P.sitOff || P.sitOffK >= 0) return;
      const g = P.group; g.position.x += P.sitOff.x; g.position.z += P.sitOff.z;
      if (P.o.ground) g.position.y = P.o.ground(g.position.x, g.position.z);
      P.sitOff = null;
      P.inner.position.lerpVectors(P.standInner, P.sitInner, P.sitW);
    }
    /* a person moved to a mark (a cut, never seen moving) */
    function personPut(P, x, z, ry, y) { if (!P) return; P.walk = null; P.sitOff = null;
      P.group.position.set(x, y != null ? y : (P.o.ground ? P.o.ground(x, z) : P.group.position.y), z); if (ry != null) { P.group.rotation.y = ry; P.turnTo = null; } }
    /* a walk along points on the group's own floor (`o.ground` lifts him up steps): the walking take tied to the ground
       covered, the body turned to its heading on the way (a corner is walked, not snapped), the rest back at the end and
       the last heading eased. A seated man stands first. */
    function personWalk(P, pts, o = {}) {
      whenReady(P, () => {
        if (P.seated || P.sitW > 0.05) personSit(P, false);
        P.seated = false;
        P.walk = { pts: pts.slice(), i: 0, speed: o.speed || 1.1, ry: o.ry, then: o.then, wait: P.sitW > 0.05, tag: o.tag || '' };
      });
    }
    const angTo = (a, b) => Math.atan2(Math.sin(b - a), Math.cos(b - a));
    const ease = (v, to, rate, dt) => v + (to - v) * (1 - Math.exp(-dt * rate));
    function walkTick(P, dt) {
      const W = P.walk; if (!W) return;
      if (W.wait) { if (P.sitW > 0.05) return; W.wait = false; sitRebase(P); }
      const g = P.group, tgt = W.pts[W.i];
      const dx = tgt[0] - g.position.x, dz = tgt[1] - g.position.z, d = Math.hypot(dx, dz);
      if (d < 0.04) {
        W.i++;
        if (W.i >= W.pts.length) { P.walk = null; if (W.ry != null) P.turnTo = W.ry; if (W.then) W.then(); }
        return;
      }
      const step = Math.min(d, W.speed * dt * Math.min(1, P.walkW * 1.6 + 0.15));
      g.position.x += dx / d * step; g.position.z += dz / d * step;
      if (P.o.ground) g.position.y = P.o.ground(g.position.x, g.position.z);
      g.rotation.y += angTo(g.rotation.y, Math.atan2(dx, dz)) * Math.min(1, dt * 6);
      if (P.L.walk) P.L.walk.setEffectiveTimeScale(W.speed / 1.3);
    }
    function peopleTick(now, wdt) {
      const live = getState() === 'play';
      for (const P of people) {
        if (!P.ready) continue;
        let vis = P.group.visible; for (let q = P.group.parent; vis && q && q !== world; q = q.parent) vis = q.visible;
        if (!vis) continue;
        if (P.head && P.headWrote) P.head.quaternion.copy(P.headWrote);
        if (P.spine && P.spineWrote) P.spine.quaternion.copy(P.spineWrote);
        walkTick(P, wdt);
        if (P.turnTo != null) { const d = angTo(P.group.rotation.y, P.turnTo); P.group.rotation.y += d * Math.min(1, wdt * 3.5); if (Math.abs(d) < 0.01) P.turnTo = null; }
        /* the layers' weights, eased */
        const L = P.L;
        P.sitW = ease(P.sitW, P.seated && (L.sitLo || !L.standLo) ? 1 : 0, 2.4, wdt);
        if (Math.abs(P.sitW - (P.seated ? 1 : 0)) < 0.002) P.sitW = P.seated ? 1 : 0;
        P.walkW = ease(P.walkW, (P.walk && !P.walk.wait) || P.filmWalk ? 1 : 0, 4.5, wdt);
        if (P.filmWalk && P.L.walk) P.L.walk.setEffectiveTimeScale(P.filmWalk / 1.3);   // a film walks him by its clock (CP9: fWalk)
        P.talkW = ease(P.talkW, now < P.talkUntil ? (P.o.talkWeight || 1) : 0, 3.2, wdt);
        if (P.one && now > P.one.until) { P.oneW = ease(P.oneW, 0, 3.0, wdt); if (P.oneW < 0.01) { P.one.a.setEffectiveWeight(0); P.one = null; P.oneW = 0; } }
        else if (P.one) P.oneW = ease(P.oneW, 1, 4.0, wdt);
        const st = L.standLo ? 1 - P.sitW : 0, sw = L.standLo ? P.sitW : 1, wk = L.walk ? P.walkW : 0;
        const tk = L.talk ? P.talkW * (1 - P.oneW) * (1 - wk) : 0, up = (1 - 0.9 * tk) * (1 - P.oneW);
        if (L.standLo) { L.standLo.setEffectiveWeight(st * (1 - wk)); L.standUp.setEffectiveWeight(st * (1 - wk) * up); }
        if (L.sitLo) { L.sitLo.setEffectiveWeight(sw); L.sitUp.setEffectiveWeight(sw * up); }
        if (L.walk) L.walk.setEffectiveWeight(st * wk);
        if (L.talk) L.talk.setEffectiveWeight(tk);
        if (P.one) P.one.a.setEffectiveWeight(P.oneW);
        if (L.standLo && L.sitLo) { P.inner.position.lerpVectors(P.standInner, P.sitInner, P.sitW); sitStep(P); }
        P.mixer.update(wdt);
        if (P.head) {
          if (!P.headWrote) P.headWrote = new THREE.Quaternion();
          P.headWrote.copy(P.head.quaternion);
          if (P.spine) { if (!P.spineWrote) P.spineWrote = new THREE.Quaternion(); P.spineWrote.copy(P.spine.quaternion); }
          /* THE LOOK IS ABSOLUTE (v5.04's law, in full): the face is turned onto what he looks at from wherever the take
             has put it, never added to it — a talking take that leans him back with his chin up (the master's
             answering take) would otherwise carry the look over the client's head. His face's own direction is
             measured once at rest (`faceLocal`, the head bone's frame); each frame the head is turned, in the world,
             by the part of the arc from where the face points to the target that this look's weight asks for, the
             target held to a neck's reach of the BODY's forward (yaw ±0.85, pitch −0.35…+0.30). */
          const tgt = P.lookAt || ((P.look > 0 && (live || P.lookFilm)) ? camera : null);
          let want = 0;
          if (tgt && P.faceLocal) {
            P.head.updateWorldMatrix(true, false);
            P.head.getWorldPosition(_hp); (tgt.isObject3D ? tgt.getWorldPosition(_cp) : _cp.copy(tgt));
            P.group.getWorldQuaternion(_pq); _pe.setFromQuaternion(_pq, 'YXZ');
            const dx = _cp.x - _hp.x, dz = _cp.z - _hp.z, dy = _cp.y - _hp.y, hd = Math.hypot(dx, dz);
            const a = Math.atan2(dx, dz) - _pe.y, yawTo = Math.atan2(Math.sin(a), Math.cos(a));
            if (Math.abs(yawTo) < 1.7 && hd < 9) {
              want = P.lookAt ? 1 : P.look;
              const nk = P.neck || 0.85;
              const yy = _pe.y + THREE.MathUtils.clamp(yawTo, -nk, nk), pp = THREE.MathUtils.clamp(Math.atan2(dy, hd), -0.35, 0.3);
              P.lookDir.set(Math.sin(yy) * Math.cos(pp), Math.sin(pp), Math.cos(yy) * Math.cos(pp));
            }
          }
          P.lookW += (want - P.lookW) * (1 - Math.exp(-wdt * 2.4));
          if (P.lookW > 0.002 && P.faceLocal) {
            P.head.updateWorldMatrix(true, false);
            P.head.getWorldQuaternion(_hq);
            _fv.copy(P.faceLocal).applyQuaternion(_hq);
            /* a wide turn is shared with the chest, as a person turns: past 26° the upper spine takes 55 % of the rest,
               about the world's up (CP9, by photograph: Pong, seated beside the client, turned his head alone 72° to
               answer him and it read as a man craning at the ceiling) */
            if (P.spine) {
              const dyw = angTo(Math.atan2(_fv.x, _fv.z), Math.atan2(P.lookDir.x, P.lookDir.z));
              const sh = Math.sign(dyw) * Math.max(0, Math.abs(dyw) - 0.45) * 0.55 * Math.min(1, P.lookW);
              if (Math.abs(sh) > 1e-4) {
                P.spine.updateWorldMatrix(true, false); P.spine.getWorldQuaternion(_spq);
                _dq.setFromAxisAngle(_UPV, sh); P.spine.parent.getWorldQuaternion(_pq2);
                P.spine.quaternion.copy(_pq2.invert().multiply(_dq.multiply(_spq)));
                P.head.updateWorldMatrix(true, false); P.head.getWorldQuaternion(_hq);
                _fv.copy(P.faceLocal).applyQuaternion(_hq);
              }
            }
            /* a TURN about the world's up, then a NOD about the face's own horizontal — never the shortest arc between
               the two directions, whose roll tipped a head turned far to one side onto its shoulder with the chin up
               (CP9: Pong translating to the client looked at the ceiling over his head) */
            const fy = Math.atan2(_fv.x, _fv.z), fp = Math.asin(THREE.MathUtils.clamp(_fv.y, -1, 1));
            const ly = Math.atan2(P.lookDir.x, P.lookDir.z), lpch = Math.asin(THREE.MathUtils.clamp(P.lookDir.y, -1, 1));
            _qy.setFromAxisAngle(_UPV, angTo(fy, ly));
            _ax.set(-Math.cos(ly), 0, Math.sin(ly));
            _dq.setFromAxisAngle(_ax, lpch - fp).multiply(_qy);
            /* (CP11, measured: `_dq.slerpQuaternions(_iq, _dq, w)` COPIES _iq into _dq before it blends toward _dq, which is
               then the identity too — the turn was always nothing, and from CP7 no head in this chapter ever turned to
               look at anything; only the takes' own poses and the chest's share moved. The blend goes into its own.) */
            _qlk.copy(_iq).slerp(_dq, Math.min(1, P.lookW));
            P.head.parent.getWorldQuaternion(_pq2);
            P.head.quaternion.copy(_pq2.invert().multiply(_qlk.multiply(_hq)));
          }
          P.bowNow += ((P.bow || 0) - P.bowNow) * Math.min(1, wdt * 2.5);
          /* a man with no talking take of his own nods his way through his line (Ta Sombat) */
          const nod = !L.talk && P.talkW > 0.02 ? 0.07 * Math.sin(now * 5.2) * P.talkW : 0;
          const pit = P.bowNow + nod;
          if (Math.abs(pit) > 1e-4) { _pe.set(pit, 0, 0, 'YXZ'); _pq.setFromEuler(_pe); P.head.quaternion.multiply(_pq); }
        }
        if (P.after) P.after(P, now, wdt);
      }
    }

    /* ---- THE FIRST MASTER (§3.5): on his cushion at the back of the receiving room, facing the client's mat. He rests
       cross-legged; he talks on his answering take ridden on the upper body; the pao (the blessing blown three times
       onto the crown) is his hands-to-mouth take. He looks at the one in front of him (v5.03), and closes his eyes to
       chant (no look). */
    const CUSH_TOP = RMC.PLAT.top + 0.0925;               // the red cushion's top on the platform (buildRoom)
    const cast = {};
    /* ---- THE LAGGING SHADOW (§7.4): his own silhouette, flattened onto the back wall by the two candles on the table —
       one shadow a candle — and posed by what HE did 0.7 s ago (every bone's local turn written into a short history
       each frame, the shadow reading it back late). Unlit, dark, see-through; drawn exactly once a pixel however its
       body overlaps itself (each fragment's depth is the wall plane's, worked out from the pixel alone, so a second
       layer at the same pixel always fails the depth test), and gone in a lightning flash. */
    const SHADOW_LAG = 0.7, WALL_Z = RM.z0 + 0.04;
    const shadow = { list: [], hist: [], bones: null, srcBones: null, k: 0, lag: SHADOW_LAG };
    const _vp = new THREE.Vector4(), _nv = new THREE.Vector3(), _p0 = new THREE.Vector3(), _nm = new THREE.Matrix3();
    function shadowMat(light, wz) {
      const U = { uLight: { value: light.clone() }, uWallZ: { value: wz }, uProjK: { value: new THREE.Vector4() }, uProjZ: { value: new THREE.Vector2() },
                  uPlane: { value: new THREE.Vector4() }, uVP: { value: new THREE.Vector4(0, 0, 1, 1) } };
      /* LESS, never three's default LESS-OR-EQUAL: a second layer of the same body at the same pixel has the same depth and
         must fail (CP7: at LEQUAL every fold of his legs added another layer, and they drew as black scribbles) */
      const m = new THREE.MeshBasicMaterial({ color: 0x140a04, transparent: true, opacity: 0, depthWrite: true, depthFunc: THREE.LessDepth, fog: false });
      m.onBeforeCompile = (sh) => {
        Object.assign(sh.uniforms, U);
        sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nuniform vec3 uLight;\nuniform float uWallZ;')
          .replace('#include <project_vertex>', [
            'vec4 wpS = modelMatrix * vec4(transformed, 1.0);',
            'float dzS = min(wpS.z - uLight.z, -0.45);',           // (a knee within a hand of the flame would stretch the whole wall)
            'vec3 pS = uLight + (wpS.xyz - uLight) * ((uWallZ - uLight.z) / dzS);',
            'pS.z = uWallZ;',
            'vec4 mvPosition = viewMatrix * vec4(pS, 1.0);',
            'gl_Position = projectionMatrix * mvPosition;'].join('\n'));
        sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nuniform vec4 uProjK; uniform vec2 uProjZ; uniform vec4 uPlane; uniform vec4 uVP;')
          .replace(/}\s*$/, [
            '  vec2 nd = (gl_FragCoord.xy - uVP.xy) / uVP.zw * 2.0 - 1.0;',
            '  vec3 rv = vec3((nd.x + uProjK.z) / uProjK.x, (nd.y + uProjK.w) / uProjK.y, -1.0);',
            '  float sd = uPlane.w / dot(uPlane.xyz, rv);',
            '  gl_FragDepth = clamp(0.5 * (-uProjZ.x + uProjZ.y / sd) + 0.5, 0.0, 1.0);',
            '}'].join('\n'));
      };
      m.userData.U = U;
      mats.push(m);
      return m;
    }
    /* the wall plane, in the lens's view space, and the projection's numbers — set on the frame it is drawn */
    function shadowUniforms(U, renderer, cam) {
      renderer.getCurrentViewport(_vp); U.uVP.value.copy(_vp);
      const e = cam.projectionMatrix.elements; U.uProjK.value.set(e[0], e[5], e[8], e[9]); U.uProjZ.value.set(e[10], e[14]);
      _nm.getNormalMatrix(cam.matrixWorldInverse); _nv.set(0, 0, 1).applyMatrix3(_nm).normalize();
      _p0.set(RX, 1, U.uWallZ.value).applyMatrix4(cam.matrixWorldInverse);
      U.uPlane.value.set(_nv.x, _nv.y, _nv.z, _nv.dot(_p0));
    }

    function buildCast() {
      const SL = CMP.SALA, BENCH = 0.445;                 // a sala bench's top above its floor
      /* the room: the master; Pong cross-legged on the second mat, turned to him; Pa Noi (the tray); her, by the curtained
         door, never looked at */
      cast.master = mkPerson('firstmaster', { parent: worldR, x: MASTER.x, z: MASTER.z, ry: 0, height: 1.68, sizeTake: 'Walking', walk: false,
        posture: 'sit', sit: 'Sit_Cross_Legged_on_Floor', talk: 'Sitting_Answering_Questions', seatH: CUSH_TOP, seatFloor: RMC.PLAT.top, look: 1, noMip: true,
        then: (P) => {
          /* the shadow's two silhouettes, in his own inner frame so a pose lands where his does */
          parseOnce('fmshadow').then((sg) => {
            if (!alive || !P.inner) return;
            const byName = new Map(); P.model.traverse(b => { if (b.isBone) byName.set(b.name, b); });
            room.candles.slice(0, 2).forEach((c, ci) => {
              const s2 = cloneSkinned(sg.scene);
              const L = new THREE.Vector3(c.x + RX, c.y + 0.03, c.z);
              const mat = shadowMat(L, WALL_Z + 0.002 * ci);      // the second a hair nearer, so where the two cross it darkens once more
              s2.traverse(m => { if (m.isMesh) { m.material = mat; m.castShadow = false; m.receiveShadow = false; m.frustumCulled = false; m.renderOrder = -1;
                m.onBeforeRender = (r, sc, cam) => shadowUniforms(mat.userData.U, r, cam); } });
              P.inner.add(s2);
              const bones = []; s2.traverse(b => { if (b.isBone) bones.push(b); });
              shadow.list.push({ root: s2, mat, bones });
            });
            shadow.srcBones = shadow.list[0].bones.map(b => byName.get(b.name) || null);
          }).catch(err => { console.warn('fmshadow failed to load', err); if (ctx.loadFail) ctx.loadFail('fmshadow', err); });
        } });
      cast.pongR = mkPerson('e4pong', { parent: worldR, x: -0.95, z: -0.2, ry: Math.atan2(0.95, -1.75), height: 1.7, sizeTake: 'Idle_9', walk: false,
        posture: 'sit', sit: 'Sit_Cross_Legged_on_Floor', talk: 'Sitting_Answering_Questions', seatH: 0.012, seatFloor: 0.004, look: 0.8, noMip: true });
      cast.noiR = mkPerson('e4noi', { parent: worldR, x: 1.55, z: -1.0, ry: -2.2, height: 1.56, posture: 'stand', stand: 'Idle_9',
        talk: 'Talk_with_Left_Hand_on_Hip', hidden: true, noMip: true });
      cast.her = mkPerson('granny', { parent: worldR, x: RMC.HER.door.x, z: RMC.HER.door.z, ry: -0.45, height: 1.5, posture: 'stand', stand: 'Stand_and_Chat',
        idleAt: 0.4, walk: false, bow: 0.42, noMip: true, noShadow: true, hidden: true, then: herDress });
      /* the yard: Pa Noi at the queue's board; in the sala, Khun Joy and Ta Sombat on the back bench and Uncle Lim on the
         front one, all turned to the master's door; Pong, standing by his pickup at the gate (he leads him in, and sits
         on the front bench to wait) */
      cast.noi = mkPerson('e4noi', { parent: worldC, x: CMP.BOARD.x + 0.62, z: CMP.BOARD.z + 0.42, ry: -0.46, height: 1.56, posture: 'stand', stand: 'Idle_9',
        talk: 'Talk_with_Left_Hand_on_Hip', look: 1, noMip: true, ground: groundAt });
      /* (her take is a woman on a CHAIR, one knee over the other — the tentage's seated audience, v5.29 — so she has a bench) */
      cast.joy = mkPerson('e4joy', { parent: worldC, x: -1.6, z: -3.0, y: SL.floor, ry: Math.PI / 2, height: 1.6, anims: 'sitwomantalk', sizeTake: 'Idle_9',
        posture: 'sit', stand: 'Idle_9', sit: 'Armature|Sit_Cross_Legged|baselayer', talk: 'Talk', seatH: BENCH, seatFloor: 0, feet: true, look: 0.8, noMip: true, noShadow: true,
        ground: groundAt });
      cast.lim = mkPerson('e4lim', { parent: worldC, x: 0.4, z: -2.75, y: SL.floor, ry: Math.PI / 2, height: 1.66, sizeTake: 'Idle_9',
        posture: 'sit', stand: 'Idle_9', sit: 'mixamo.com', talk: 'Talk_with_Hands_Open', seatH: BENCH, seatFloor: 0, feet: true, look: 0.8,
        noMip: true, noShadow: true, ground: groundAt });
      cast.sombat = mkPerson('encik', { parent: worldC, x: -1.6, z: -1.55, y: SL.floor, ry: Math.PI / 2, seatedHeight: 1.3, walk: false,
        posture: 'sit', sit: 'mixamo.com', seatH: BENCH, seatFloor: 0, feet: true, look: 0.6, noShadow: true });
      cast.pong = mkPerson('e4pong', { parent: worldC, x: 3.45, z: 11.6, ry: Math.PI, height: 1.7, sizeTake: 'Idle_9',
        posture: 'stand', stand: 'Idle_9', sit: 'Sit_Upright', talk: 'Talk_with_Hands_Open', seatH: BENCH, seatFloor: 0, feet: true, look: 0.9, ground: groundAt, noMip: true });
      /* the pickup: Pong at the wheel (Thailand drives on the left: the driver sits on the right, +x, facing −z), riding
         the pickup's own frame — hidden until a film sits in the cabin */
      cast.pongCab = mkPerson('e4pong', { parent: cab.root, x: 0.42, z: 0.06, y: 0, ry: Math.PI, height: 1.7, sizeTake: 'Idle_9', walk: false,
        posture: 'sit', sit: 'Sit_Upright', talk: 'Talk_with_Hands_Open', seatH: 0.76, noShadow: true, noMip: true,
        /* his eyes on the road: a point three metres ahead of the windscreen, riding the pickup (the chair take's upright
           stretch still lifts his chin; the absolute look holds his face level on the road) */
        then: (P) => { const ahead = new THREE.Object3D(); ahead.position.set(0.42, 1.56, -3.2); cab.root.add(ahead); P.lookAt = ahead; P.lookHome = ahead; } });
    }
    /* her look: the colour drained to the grey of an old photograph, faded by DITHERED alpha (alphaHash — the opaque
       pass, never the transparent one: v12.4) */
    function herDress(P) {
      P.model.traverse(m => {
        if (!m.isMesh) return;
        const mm = m.material = m.material.clone(); mats.push(mm);
        mm.alphaHash = true; mm.opacity = 0;
        mm.onBeforeCompile = (sh) => {
          sh.fragmentShader = sh.fragmentShader.replace('#include <map_fragment>',
            '#include <map_fragment>\n{ float lu = dot(diffuseColor.rgb, vec3(0.299, 0.587, 0.114)); diffuseColor.rgb = mix(diffuseColor.rgb, vec3(lu) * vec3(0.92, 0.95, 1.0), 0.82) * 0.82; }');
        };
      });
      her.P = P;
    }
    /* SHE IS SEEN ONLY AT THE EDGE OF SIGHT (§7.3): her fade is keyed to where she is ON THE SCREEN, not to an angle —
       full in the frame's outer quarter, gone inside its middle 30 % — the only rule that holds on a phone's narrow
       crop and a desktop's wide frame alike. Turning to her takes her away. */
    const her = { P: null, on: false, k: 0, spot: 'door', mats: null };
    const HER_SPOT = () => {
      const S2 = RMC.HER; if (her.spot === 'door') return S2.door;
      return (camera.aspect < 1 ? S2.phoneStep : S2.deskStep);
    };
    const herCtl = {
      show(on) { her.on = !!on; },
      at(spot) { her.spot = spot; const p = HER_SPOT(); if (cast.her) { cast.her.group.position.x = p.x; cast.her.group.position.z = p.z; } }
    };
    function herFrame(now, wdt) {
      const P = her.P; if (!P) return;
      const inR = worldOf(yaw.position.x) === 'R';
      let want = 0;
      if (her.on && inR) {
        if (her.spot !== 'door') { const p = HER_SPOT(); P.group.position.x = p.x; P.group.position.z = p.z; }
        P.group.getWorldPosition(_hp); _hp.y += 1.15;
        camera.updateMatrixWorld(); _hp.project(camera);
        if (_hp.z < 1 && Math.abs(_hp.y) < 1.2) { const ax = Math.abs(_hp.x); want = THREE.MathUtils.smoothstep(ax, 0.3, 0.55) * (ax < 1.25 ? 1 : 0); }
      }
      her.k += (want - her.k) * Math.min(1, wdt * (want > her.k ? 2.2 : 6.0));
      P.group.visible = her.k > 0.05;                // (CP8: under this the dither left a few stray specks where she had been)
      if (P.group.visible) P.model.traverse(m => { if (m.isMesh) m.material.opacity = her.k * 0.72; });   // never quite solid: the dither always shows
    }
    /* the shadow, each frame: his pose written into the history, the late pose read back into both silhouettes, and how
       dark they are — the candles lit, darker in the power cut, gone in a flash */
    const _sq = [];
    function shadowFrame(now) {
      if (!shadow.list.length || !shadow.srcBones || worldOf(yaw.position.x) !== 'R') return;
      const src = shadow.srcBones, nb = src.length;
      const rec = { t: now, q: new Float32Array(nb * 4), hp: new THREE.Vector3() };
      for (let i = 0; i < nb; i++) { const b = src[i]; if (!b) continue; rec.q[i * 4] = b.quaternion.x; rec.q[i * 4 + 1] = b.quaternion.y; rec.q[i * 4 + 2] = b.quaternion.z; rec.q[i * 4 + 3] = b.quaternion.w; }
      const hip = src.find(b => b && /Hips$/.test(b.name)); if (hip) rec.hp.copy(hip.position);
      shadow.hist.push(rec);
      while (shadow.hist.length > 2 && shadow.hist[1].t < now - shadow.lag - 0.2) shadow.hist.shift();
      const want = now - shadow.lag;
      let r = shadow.hist[0]; for (const h of shadow.hist) { if (h.t <= want) r = h; else break; }
      for (const S2 of shadow.list) {
        for (let i = 0; i < nb; i++) { const b = S2.bones[i]; if (!b || !src[i]) continue; b.quaternion.set(r.q[i * 4], r.q[i * 4 + 1], r.q[i * 4 + 2], r.q[i * 4 + 3]); if (/Hips$/.test(b.name)) b.position.copy(r.hp); }
        if (cast.master && cast.master.model) S2.root.position.copy(cast.master.model.position);
      }
      const fl = kit && kit.flashNow ? kit.flashNow() : 0;
      const k = room.candleK * (0.34 + 0.32 * (1 - room.tubeK)) * (1 - Math.min(1, fl * 1.6));
      for (const S2 of shadow.list) { S2.mat.opacity = k; S2.root.visible = k > 0.005; }
    }
    buildCast();
    if (room.wash) room.wash.renderOrder = -2;          // the candles' wash under the lagging shadow (renderOrder −1), never over it

    /* ------------------------------------------------- the compound, alive (CP5): the water's ripples and its sky, the
       lightning in it, the standing fan, the TV under the house */
    function yardFrame(now) {
      if (worldOf(yaw.position.x) !== 'C') { yard.last = 0; return; }
      const dt = yard.last ? Math.min(0.1, Math.max(0, now - yard.last)) : 0; yard.last = now;
      const fl = kit && kit.flashNow ? kit.flashNow() : 0;
      for (const wm of yard.waterMats) {
        const U = wm.uniforms; U.uTime.value = now % 1000; U.uFlash.value = fl; U.uSkyK.value.copy(domeLive.tint);
        if (!U.uHas.value && domeLive.mat && domeLive.mat.map) { U.uSky.value = domeLive.mat.map; U.uHas.value = 1; }
      }
      if (yard.standFan) { const f = yard.standFan; f.blades.rotation.z += dt * 24; f.head.rotation.y = f.base + Math.sin(now * 0.45) * 0.7; }
      if (yard.tvMat) { const k = 0.55 + 0.25 * Math.sin(now * 3.1) * Math.sin(now * 1.7) + (Math.sin(now * 13) > 0.92 ? 0.3 : 0); yard.tvMat.color.setRGB(0.35 * k, 0.45 * k, 0.6 * k); }
    }
    /* the ground's height where the compound is not flat: the sala's floor and its two steps (v16.4's seam) */
    function groundAt(x, z) {
      if (x > 125 || x < -125) return 0;
      const SL = CMP.SALA;
      if (x > SL.x0 && x < SL.x1 && z > SL.z0 && z < SL.z1) return SL.floor;
      if (x > -1.1 && x < 1.1 && z >= SL.z1 && z < SL.z1 + 0.3) return 0.22;
      if (x > -1.1 && x < 1.1 && z >= SL.z1 + 0.3 && z < SL.z1 + 0.6) return 0.11;
      /* the receiving room's three steps and its floor (the cast walk up them and in; the player is kept off by the
         steps' own blocker and the room's walls, and goes in by the door's press) */
      const RX0 = CMP.ROOMX;
      if (x > 7.15 && x < 8.65 && z >= RX0.z1 && z < RX0.z1 + 0.9) return z < RX0.z1 + 0.3 ? RX0.base : z < RX0.z1 + 0.6 ? RX0.base * 2 / 3 : RX0.base / 3;
      if (x > RX0.x0 && x < RX0.x1 && z > RX0.z0 && z < RX0.z1) return RX0.base;
      return 0;
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
      /* the table's smoke turned to the bowl (the sign), or straight up with the fan's air (the storm has passed) */
      smokeStraight(on) { if (room.smoke[1]) room.smoke[1].on = !on; if (room.smoke[2]) room.smoke[2].on = !!on; },
      fan(on) { room.fanOn = !!on; }
    };
    room.smoke.forEach(sp => { sp.on = true; });
    if (room.smoke[2]) room.smoke[2].on = false;
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
       bytes have not landed is held a moment (v8.0) and then spoken silently — so a beat chained on a line's start never
       stops the chapter */
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
    /* the boundaries sit 60 m off each set (the shop and its corridor span ±12 m, the room ±3 m): O5's wide stands at
       x −130 on the dyke road and was counted the shop's, so on a phone the paddies and the storm dome were never drawn
       and the shot was six seconds of flat purple (CP9, by photograph) */
    function worldOf(x) { return x > 190 ? 'R' : x < -375 ? 'T' : x < -190 ? 'S' : 'C'; }
    let worldRun = 0;
    let wDark = false;
    let decOpen = false;
    const AFTER_DAY = ['items', 'work', 'storm', 'decide'];
    function setPhase(p, tag, opts) {
      phase = p;
      /* past the reading, the day he was born rides every bookmark (~fri), so a Continue writes it on the slate again
         (CP13: the slate, in view from the mat and in the endings, was blank after a Continue past 'consult') */
      if (AFTER_DAY.includes(p) && play.day) tag = (tag || '') + '~' + play.day;
      if (kit) kit.setPhase(tag ? p + ':' + tag : p);
      objectiveFor(p, opts);
    }
    /* the orders (§4.2–§4.4). `opts.complete === false` where the change is not his doing — a number called, someone
       gone in — so the HUD never congratulates him for the queue moving (the v8.7 lie) */
    function objectiveFor(p, opts) {
      if (!kit) return;
      if (wDark) { kit.objective(null, { complete: false }); kit.waypoint(null); return; }
      let o = null, wp = null;
      if (p === 'arrive') o = W.objFollow;
      else if (p === 'wait') {
        const n3 = ['joy', 'lim', 'sb'].filter(k => play.asked.has(k)).length;
        o = !threeDone() ? W.objAsk.replace('{n}', String(n3))
          : (play.pongSat && !play.asked.has('pong')) ? W.objAskPong
          : W.objWait.replace('{n}', String(play.n));
      }
      else if (p === 'called') { o = W.objGoIn; wp = { x: RDOOR.x, y: 1.9, z: RDOOR.z - 0.5 }; }
      else if (p === 'consult') o = play.kneeling ? null : W.objKneel;
      else if (p === 'items') o = play.offerOn && !play.offered ? W.objOffer : null;
      else if (p === 'work') o = W.objWatch.replace('{n}', String(play.signs.size));
      kit.objective(o, opts);
      if (p !== 'arrive') kit.waypoint(wp);
    }
    let lookName = 'YARD0', hushAt = -1;                 // the light's preset now, and when the storm's hush began (the beds')
    function look(name, secs = 0) {
      if (kit) kit.daylight(PRESETS[name] || null, secs);
      domeTint(name, secs);
      lookName = name;
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

    /* ================================================================ THE PLAY (CP8, §4.2–§4.6)
       P1 arrive → P2 wait (ASK: the three in the sala, then Pong; THE QUEUE IS TIME) → P3 called → P4 consult (the mat,
       the wai, the day he was born, the reading) → P5 items (the tray, the teacher's offering) → P6 work (the chant; the
       four signs, each written in the ledger) → P7 storm (WHAT CHANGED?) → decide. Every beat on the chapter clock (wall
       time, v7.1); every line through the queue, one voice at a time; each beat's receipt in the phase string, so a
       Continue lands where a reload would (§10.1). */
    const play = {
      run: 0,                         // a token: a callback from before a reset finds it changed and does nothing
      asked: new Set(), missed: new Set(), n: 9, nextCall: 0, calling: false, busy: false,
      greeted: false, water: false, tree: false, pongSat: false,
      day: '', item: '', offerOn: false, offered: false,
      signs: new Set(), signsOn: false, herSeen: false, breathNext: 0, gestNext: 0, chantNext: 0,
      kneeling: false, turning: null, called: false,
      drone: null,                    // the storm's drone while it sounds (its source, to be ramped down)
      chants: []                      // the master's chant as it sounds (CP13: never stopped, it ran on through the hush)
    };
    /* THE SOUNDS PLAY ASKS FOR, warmed so the first of each is heard (CP13: nothing here was ever warmed — the first
       chant, the drone, the match and the tube were silent, and a cold line was spoken without its voice after 1.6 s).
       The yard's and the room's from the start (short lines, about 25 MB decoded); the work's and the storm's — the
       34 s chant, the 43 s drone — once he is called in, and on any Continue into the room */
    const WARM_YARD = ['pg1come', 'pn1num', 'q1board', 'pn1water', 'q1water', 'w4water', 'pn1n10', 'pn1n11', 'pn1n12', 'pn1n13',
      'pn1n14', 'q1joy1', 'jy1a', 'q1joy2', 'jy1b', 'q1lim1', 'lm1a', 'q1lim2', 'lm1b', 'q1sb1', 'pg1sbq', 'sb1a', 'pg1sb',
      'q1pg1', 'pg1me', 'q1nobody', 'q1missed', 'jy1go', 'lm1go', 'pg1go', 'q1tree', 'pg1tree', 'w4dog', 'w4marker', 'w4sandals'];
    const WARM_ROOM = ['w4kneel', 'fm1hello', 'q1wai', 'fm1shop', 'pg1shop', 'q1shop', 'pg1th1', 'fm1good', 'pg1good', 'fm1day',
      'pg1day', 'fm1hm', 'fm1read', 'pg1read', 'q1short', 'w4tray', 'pn1tray', 'pg1items', 'fm1items', 'pg1nk', 'pg1tk', 'pg1py',
      'pg1offer', 'w4envelope', 'fm1anu', 'fm1eyes', 'pg1eyes', 'w4match'];
    const WARM_WORK = ['fm1chant', 'fm1chant2', 'w4cloth', 'w4mala', 'q1smoke', 'q1cloth', 'q1shadow', 'q1her', 'w4tube',
      'pg1power', 'w4storm', 'w4thunder', 'w4crack', 'w4rainstop'];
    if (warmSounds) warmSounds(WARM_YARD.concat(WARM_ROOM));
    /* the stock book built now, hidden, so the loading curtain compiles it (CP13: built at its first opening, its
       materials compiled on screen at the first conversation) */
    if (kit && kit.ledger && kit.ledger.prepare) kit.ledger.prepare();
    const warmWork = () => { if (warmSounds) warmSounds(WARM_WORK); };
    /* a one-shot that waits for its bytes (a long sound decoded late is still the sound): tried now, then every tenth of a
       second of wall time for `wait` seconds; muted, it is not waited for */
    function sfxReady(name, vol, keep, wait = 3) {
      const run = play.run, t0 = wallNow();
      const go = () => {
        if (!live(run) || (soundOff && soundOff())) return;
        const s2 = worldSfx ? worldSfx(name, vol) : null;
        if (s2) { if (keep) keep(s2); return; }
        if (wallNow() - t0 < wait) setTimeout(go, 100);
      };
      go();
    }
    function chantStop(tau = 0.25) {
      for (const d of play.chants.splice(0)) {
        try { const t = d.context.currentTime; if (d.__g && tau > 0) { d.__g.gain.setTargetAtTime(0, t, tau); d.stop(t + tau * 6); } else d.stop(); } catch (e) {}
      }
    }
    const live = (run) => alive && run === play.run;
    const KNEEL_Y = RMC.EYE.y;                                       // his eye on the mat (§4.3)
    const faceMaster = () => Math.atan2(-(MASTER.x - CMAT.x), -(MASTER.z - CMAT.z));
    /* one line, its speaker on his talking take for the line's own length */
    function line(name, P, vol = 1) { queueLine(name, () => { if (P) personTalk(P, (SECS[name] || 2.5) * 0.92); }, vol); }
    function lines(list) { for (const [n, P] of list) line(n, P); }
    /* the receipt is the note (v7.3): a note that is banked is banked once, whatever a Continue replays */
    function bank(note) {
      if (!kit || !note) return;
      const got = kit.getConduct ? kit.getConduct().notes : [];
      if (!got.includes(note)) kit.conduct({ note, s: 0, a: 0 });
    }
    /* THE LEDGER (S43): a FACT pays two awareness, once (an entry already written answers at once and pays nothing);
       a MEANING pays nothing — both are written, and chapter 2 reads them back */
    function writeLedger(id, page, fk, mk, tries = 0) {
      const run = play.run;
      if (!kit || !kit.ledger) return Promise.resolve(null);
      const had = kit.ledger.entries().some(e => e.id === id);
      return kit.ledger.write(id, { page, title: page === 'who' ? W.ledWho : W.ledSaw, prompt: W.ledPrompt, brief: W.ledBrief,
                                    fact: W[fk], meaning: W[mk] }).then(kind => {
        if (!live(run)) return null;
        if (!kind && tries < 20) return new Promise(res => after(0.5, () => res(writeLedger(id, page, fk, mk, tries + 1))));
        if (kind === 'fact' && !had) kit.award('awareness', 2);
        return kind;
      });
    }

    /* ---------------------------------------------------------------- the yard's props: the board */
    function boardSet(n) {
      play.n = n;
      if (yard.board) { drawQueueBoard(yard.board.canvas.getContext('2d'), 512, 224, n); yard.board.tex.needsUpdate = true; }
    }
    /* a person who goes in or out of sight does it where he cannot be watched doing it: hidden on the first frame his
       head is off the screen (or when he is in another world) */
    const _hv = new THREE.Vector3();
    function hideUnseen(P) { if (P) P.hideUnseen = true; }
    function unseenTick() {
      for (const P of people) {
        if (!P.hideUnseen || !P.group.visible) continue;
        P.group.getWorldPosition(_hv); _hv.y += 1.5;
        camera.updateMatrixWorld(); _hv.project(camera);
        const off = _hv.z > 1 || Math.abs(_hv.x) > 1.08 || Math.abs(_hv.y) > 1.08 || worldOf(yaw.position.x) !== 'C';
        if (off) { P.group.visible = false; P.hideUnseen = false; }
      }
    }

    /* ---------------------------------------------------------------- the routes (World C, metres; §4.1)
       The sala is a raised floor (0.32) with its steps at the front between x ±1.1 (a post stands at their top, x 0);
       the receiving room's door is at the top of its own three steps (RDOOR) and its dark doorway takes whoever walks in
       (the room's box hides them behind its front face). Everyone goes round the queue's board and Pa Noi. */
    const SEAT = { joy: { x: -1.6, z: -3.0 }, lim: { x: 0.4, z: -2.75 }, pong: { x: 0.4, z: -1.35 } };
    const DOORWAY = [[6.6, -2.4], [7.9, -5.0], [7.9, -6.15], [7.9, -7.3]];
    const ROUTE_IN = {
      joy: [[-0.6, -2.0], [-0.55, -0.5], [-0.55, 0.7], [-0.4, 1.9], [4.4, 1.9], ...DOORWAY],
      lim: [[1.3, -2.2], [1.3, -0.6], [0.8, 0.6], [0.8, 1.9], [4.4, 1.9], ...DOORWAY]
    };
    const ROUTE_OUT = [[7.9, -6.15], [7.9, -5.0], [6.4, -2.0], [4.6, 2.6], [1.9, 6.4], [0.7, 9.4], [0.4, 12.6]];

    /* ================================================================ P1 · ARRIVE */
    /* a fresh start of the chapter owns no piece and no page (CP13: the bag and the ledger outlive a replay — the bag adds
       a second piece and a Continue then picked the first; every ledger page "answered at once", with no book and no
       award): the three pieces are taken back and this chapter's entries go, the episode's others stay */
    const PIECES = ['nangkwak', 'takrut', 'phayant'];
    function freshRun() {
      if (!kit) return;
      if (kit.has && kit.take) for (const id of PIECES) { let n = 0; while (kit.has(id) && n++ < 8) kit.take(id); }
      if (kit.ledger && kit.ledger.set) {
        const keep = kit.ledger.entries().filter(e => !/^(who|saw):/.test(e.id));
        if (keep.length !== kit.ledger.entries().length) kit.ledger.set(keep);
      }
    }
    function arriveBegin() {
      setPhase('arrive');
      freshRun();
      look('YARD0', 0);
      boardSet(9);
      after(3.4, () => { if (phase === 'arrive' && worldSfx) worldSfx('w4dog', 0.3, 1, -0.5); });   // the yard's dog, by the house
      after(0.9, () => {
        if (play.greeted) return;                  // (CP13: a Continue beside Pa Noi greets on the first frame; greet() walks him in)
        line('pg1come', cast.pong);
        queueFn(() => { if (!play.greeted || !cast.pong.walk) personWalk(cast.pong, ARRIVE_IN, { speed: 1.1, ry: 2.3, tag: 'in' }); });
      });
    }
    const ARRIVE_IN = [[2.4, 9.8], [0.9, 7.2], [1.6, 4.0], [2.25, 2.35]];
    function pongToSeat() {
      personWalk(cast.pong, [[1.6, 2.0], [0.82, 0.9], [0.82, -0.3], [0.84, -1.35]], { speed: 1.05, ry: Math.PI / 2,
        then: () => after(0.5, () => { personSit(cast.pong, true, SEAT.pong); play.pongSat = true; }) });
    }
    /* Pa Noi gives him his number when he comes up to her (the waypoint is on Pong, then on her) */
    function greet() {
      if (play.greeted) return;
      play.greeted = true;
      line('pn1num', cast.noi);
      line('q1board', null);
      queueFn(() => {
        waitBegin(false);
        /* Pong takes his seat on the front bench to wait: on from his walk in if he is still on it, in from the gate if he
           never came (a Continue beside Pa Noi — CP13: the walk in replaced the walk to the seat, which alone sits him
           down, and the farmer and Pong could never be asked) */
        whenReady(cast.pong, (P) => {
          if (P.walk && P.walk.tag === 'in') P.walk.then = pongToSeat;
          else if (P.group.position.z > 4.2) personWalk(P, ARRIVE_IN.slice(0, -1), { speed: 1.1, then: pongToSeat });
          else pongToSeat();
        });
      });
    }

    /* ================================================================ P2 · WAIT, AND ASK */
    function waitTag() {
      return [...play.asked].join(',') + ';n' + play.n + (play.missed.size ? ';m' + [...play.missed].join(',') : '');
    }
    function waitBegin(resumed) {
      setPhase('wait', waitTag());
      play.nextCall = dayClock.t + (resumed ? 18 : 24);
      if (!resumed && !play.water) after(8.5, waterOffer);
    }
    /* hospitality, the first and the last: Pa Noi brings him water while he waits */
    function waterOffer() {
      if (play.water || phase !== 'wait') return;
      if (play.busy || play.calling) { after(4, waterOffer); return; }
      play.water = true;
      queueFn(() => { if (worldSfx) worldSfx('w4water', 0.45); });   // the dispenser's tap into a paper cup, as she speaks (CP13)
      line('pn1water', cast.noi);
      line('q1water', null);
    }
    const ASK = {
      joy:  { f: 'ledJoyF', m: 'ledJoyM', steps: () => [['q1joy1', null], ['jy1a', cast.joy], ['q1joy2', null], ['jy1b', cast.joy]] },
      lim:  { f: 'ledLimF', m: 'ledLimM', steps: () => [['q1lim1', null], ['lm1a', cast.lim], ['q1lim2', null], ['lm1b', cast.lim]] },
      sb:   { f: 'ledSbF', m: 'ledSbM', steps: () => [['q1sb1', null], ['pg1sbq', cast.pong], ['sb1a', cast.sombat], ['pg1sb', cast.pong]] },
      pong: { f: 'ledPongF', m: 'ledPongM', steps: () => [['q1pg1', null], ['pg1me', cast.pong]] }
    };
    const threeDone = () => ['joy', 'lim', 'sb'].every(k => play.asked.has(k) || play.missed.has(k));
    function askOpen(key) {
      if (phase !== 'wait' || play.busy || play.calling || play.asked.has(key) || play.missed.has(key)) return false;
      if (key === 'sb' || key === 'pong') { if (!play.pongSat) return false; }
      if (key === 'pong' && !threeDone()) return false;
      return true;
    }
    function ask(key) {
      if (!askOpen(key)) return false;
      play.busy = true;
      const A = ASK[key], run = play.run;
      /* the farmer is asked through Pong: Pong hears him out, turns to the farmer to ask (and the farmer to Pong), and
         turns back to translate (CP8, by photograph: the turn came before the question was put to Pong at all) */
      if (key === 'sb') {
        const st = A.steps();
        line(st[0][0], st[0][1]);
        queueFn(() => { if (cast.pong.head && cast.sombat.head) { cast.pong.lookAt = cast.sombat.head; cast.sombat.lookAt = cast.pong.head; } });
        line(st[1][0], st[1][1]); line(st[2][0], st[2][1]);
        queueFn(() => { cast.pong.lookAt = null; cast.sombat.lookAt = null; });
        line(st[3][0], st[3][1]);
      } else lines(A.steps());
      queueFn(() => {
        if (key === 'sb') { cast.pong.lookAt = null; cast.sombat.lookAt = null; }
        writeLedger('who:' + key, 'who', A.f, A.m).then(() => {
          if (!live(run)) return;
          play.asked.add(key);
          if (key === 'pong') line('q1nobody', null);
          queueFn(() => {
            play.busy = false;
            setPhase('wait', waitTag());
            play.nextCall = Math.min(play.nextCall, dayClock.t + 3.5);       // a conversation is followed by the next call
          });
        });
      });
      return true;
    }
    /* the takhian tree with its dresses (a folk custom, shown respectfully, never explained further) */
    function treeLook() {
      if (play.tree || play.busy) return false;
      play.tree = true;
      line('q1tree', null);
      line('pg1tree', cast.pong);
      return true;
    }

    /* THE QUEUE IS TIME (§4.2): a short dip to black; in it the light moves a notch toward the storm and the board a
       number on; whoever was called while time passed is gone. Ten and eleven are heard in the dark; twelve, thirteen
       and his own fourteen are called with the picture up, and the ones called rise and go in. */
    const CALL = { 10: 'pn1n10', 11: 'pn1n11', 12: 'pn1n12', 13: 'pn1n13', 14: 'pn1n14' };
    const SKY = { 9: 'YARD0', 10: 'YARD0', 11: 'YARD1', 12: 'YARD1', 13: 'YARD2', 14: 'YARD2' };
    function callNext() {
      if (play.calling || play.n >= 14 || phase !== 'wait') return;
      play.calling = true;
      const n = play.n + 1, run = play.run;
      if (kit) kit.fade(1, 0.45);
      after(0.6, () => {
        if (!live(run)) return;
        boardSet(n);
        if (worldSfx) worldSfx('w4marker', 0.4, 1, -0.2);          // her marker on the board, heard in the dark
        look(SKY[n], 2.6);
        /* the one who went in before comes out while time passes */
        if (n === 13) comeOut(cast.joy);
        setPhase('wait', waitTag(), { complete: false });
        if (n <= 11) line(CALL[n], cast.noi);
      });
      after(1.6, () => { if (live(run) && kit) kit.fade(0, 0.8); });
      after(2.5, () => {
        if (!live(run)) return;
        if (n >= 12) line(CALL[n], cast.noi);
        if (n === 12) queueFn(() => goIn('joy'));
        if (n === 13) queueFn(() => goIn('lim'));
        queueFn(() => {
          play.calling = false;
          if (n === 14) { calledBegin(false); return; }
          play.nextCall = dayClock.t + (['joy', 'lim', 'sb', 'pong'].every(k => play.asked.has(k) || play.missed.has(k) || !askAvail(k)) ? 9 : 30);
        });
      });
    }
    const askAvail = (k) => !(k === 'joy' && play.n >= 12) && !(k === 'lim' && play.n >= 13);
    function goIn(who) {
      const P = cast[who];
      if (!play.asked.has(who)) play.missed.add(who);
      setPhase('wait', waitTag(), { complete: false });
      line(who === 'joy' ? 'jy1go' : 'lm1go', P);
      queueFn(() => {
        whenReady(P, () => personWalk(P, ROUTE_IN[who], { speed: 1.05, then: () => {
          P.group.visible = false;
          /* called out again while still on the way in: out a while after she went in, never out of thin air */
          if (P.pendingOut) { P.pendingOut = false; const run = play.run; after(9, () => { if (live(run)) comeOut(P); }); }
        } }));
        if (play.missed.has(who)) after(1.6, () => line('q1missed', null));
      });
    }
    function comeOut(P) {
      if (P && P.walk && P.group.visible) { P.pendingOut = true; return; }
      whenReady(P, () => {
        P.group.visible = true; P.seated = false; P.sitW = 0;
        personPut(P, 7.9, -7.2, 0);
        personWalk(P, ROUTE_OUT, { speed: 1.1, then: () => hideUnseen(P) });
      });
    }

    /* ================================================================ P3 · CALLED */
    function calledBegin(resumed) {
      play.called = true;
      warmWork();
      /* OBJECTIVE COMPLETE only when the order on the box was to wait (CP13: an unfinished "Ask about the master · 1/3"
         was congratulated as the number came — the v8.7 lie) */
      const waited = threeDone() && !(play.pongSat && !play.asked.has('pong'));
      setPhase('called', undefined, resumed || !waited ? { complete: false } : undefined);
      if (!resumed) {
        line('pg1go', cast.pong);
        queueFn(() => comeOut(cast.lim));
      }
      /* Pong gets up and goes to the room's steps to take his sandals off; the first drops */
      whenReady(cast.pong, () => {
        personWalk(cast.pong, [[0.82, 0.6], [0.82, 1.9], [4.4, 1.9], [6.6, -2.4], [7.35, -4.9]], { speed: 1.1, ry: Math.PI });
      });
      if (kit && kit.rain) kit.rain(0.12, { secs: 4, len: 0.5 });   // (CP13: the engine's shape is (k, opts) — the ease and the length were dropped)
    }
    function enterRoom() {
      if (phase !== 'called') return false;
      lineQ.length = 0;                            // (CP13: Pong's yard line and Lim's walk out were carried into the room)
      if (kit && kit.rain) kit.rain(0, 0);
      if (worldSfx) worldSfx('w4sandals', 0.7);
      toWorld('R', false, 'consult');
      consultBegin(false);
      return true;
    }

    /* ================================================================ P4 · THE READING (World R) */
    /* the client's mat: a glow on the floor, the engine's "!" over it; step into it, or press it, and he kneels (legs
       folded to one side, as a client does) facing the master */
    const matZone = (() => {
      const g = new THREE.Group(); g.position.set(CMAT.x, 0.03, CMAT.z); g.visible = false; g.userData.dyn = true; worldR.add(g);
      const disc = new THREE.Mesh(new THREE.CircleGeometry(0.42, 32), B({ color: 0xf2c46a, transparent: true, opacity: 0.2, depthWrite: false, fog: false }));
      disc.rotation.x = -Math.PI / 2; g.add(disc);
      const ring = new THREE.Mesh(new THREE.RingGeometry(0.38, 0.45, 40), B({ color: 0xffd98a, transparent: true, opacity: 0.8, depthWrite: false, fog: false,
                                                                                 blending: THREE.AdditiveBlending, side: THREE.DoubleSide }));
      ring.rotation.x = -Math.PI / 2; ring.position.y = 0.003; g.add(ring);
      const wave = new THREE.Mesh(new THREE.RingGeometry(0.4, 0.45, 40), B({ color: 0xffd98a, transparent: true, opacity: 0.7, depthWrite: false, fog: false,
                                                                                blending: THREE.AdditiveBlending, side: THREE.DoubleSide }));
      wave.rotation.x = -Math.PI / 2; wave.position.y = 0.005; wave.userData.moves = true; g.add(wave);
      g.userData.parts = { disc, ring, wave };
      return g;
    })();
    function zoneTick(now) {
      if (!matZone.visible) return;
      const { disc, ring, wave } = matZone.userData.parts, k = (now % 2) / 2;
      wave.scale.setScalar(1 + k * 0.9); wave.material.opacity = 0.7 * (1 - k);
      ring.material.opacity = 0.6 + 0.3 * Math.sin(now * 3.1); disc.material.opacity = 0.16 + 0.08 * Math.sin(now * 3.1);
    }
    /* a glide and a turn to a heading, the eye easing to its height (e3c2's) */
    const smooth = (u) => u * u * (3 - 2 * u);
    function turnTo(to, secs, o, done) {
      play.turning = { t: 0, from: yaw.rotation.y, to, secs, y: o.y, span: o.span, lo: o.lo, hi: o.hi, done,
                       pos: o.pos || null, p0: { x: yaw.position.x, z: yaw.position.z }, pitch: o.pitch, pt0: pitch.rotation.x };
    }
    function turnTick(wdt) {
      const T2 = play.turning; if (!T2) return;
      T2.t += wdt / T2.secs;
      const k = smooth(Math.min(1, T2.t));
      let d = T2.to - T2.from; while (d > Math.PI) d -= Math.PI * 2; while (d < -Math.PI) d += Math.PI * 2;
      yaw.rotation.y = T2.from + d * k;
      if (T2.pos) { yaw.position.x = T2.p0.x + (T2.pos.x - T2.p0.x) * k; yaw.position.z = T2.p0.z + (T2.pos.z - T2.p0.z) * k; }
      if (T2.pitch != null) pitch.rotation.x = T2.pt0 + (T2.pitch - T2.pt0) * k;
      if (kit) kit.pose('lying', { y: T2.y, yaw: yaw.rotation.y, span: 0.02, pitchLo: Math.min(T2.lo, pitch.rotation.x - 0.01), pitchHi: Math.max(T2.hi, pitch.rotation.x + 0.01), secs: 0.9 });
      if (T2.t >= 1) {
        play.turning = null;
        if (kit) kit.pose('lying', { y: T2.y, yaw: T2.to, span: T2.span, pitchLo: T2.lo, pitchHi: T2.hi, secs: 0.05 });
        if (T2.done) T2.done();
      }
    }
    const KNEEL = { y: KNEEL_Y, span: 1.2, lo: -0.85, hi: 0.5 };
    function consultBegin(resumed) {
      play.kneeling = false;
      matZone.visible = true;
      herCtl.show(false);
      setPhase('consult', play.day);
    }
    function kneel(instant) {
      if (play.kneeling) return false;
      play.kneeling = true; matZone.visible = false;
      if (kit) kit.root(true);
      /* the order is done the moment he kneels (CP8, by photograph: "Kneel on the mat" stood over him kneeling through the
         whole greeting); a resume that kneels him puts it away without a COMPLETE */
      if (phase === 'consult') objectiveFor('consult', instant ? { complete: false } : undefined);
      if (!instant && worldSfx) worldSfx('w4kneel', 0.6);         // (CP13: a Continue kneels him without a sound)
      if (instant) {
        yaw.position.x = RX + CMAT.x; yaw.position.z = CMAT.z; yaw.rotation.y = faceMaster(); pitch.rotation.x = -0.06;
        if (kit) kit.pose('lying', { y: KNEEL.y, yaw: faceMaster(), span: KNEEL.span, pitchLo: KNEEL.lo, pitchHi: KNEEL.hi, secs: 0.05 });
        return true;
      }
      turnTo(faceMaster(), 1.0, Object.assign({ pos: { x: RX + CMAT.x, z: CMAT.z }, pitch: -0.06 }, KNEEL), () => greeting());
      return true;
    }
    function greeting() {
      const M2 = cast.master, PR = cast.pongR;
      if (kit && kit.pray) kit.pray(true, { secs: 0.8, y: -0.33 });         // the wai on arrival
      lines([['q1wai', null], ['fm1hello', M2]]);                         // the junior greets first; the senior returns it (research §1.4)
      queueFn(() => { if (kit && kit.pray) kit.pray(false, { secs: 0.9 }); });
      lines([['fm1shop', M2], ['pg1shop', PR], ['q1shop', null]]);
      queueFn(() => { if (PR.head && M2.head) PR.lookAt = M2.head; });       // Pong says it to the master in Thai
      line('pg1th1', PR);
      queueFn(() => { PR.lookAt = null; });
      lines([['fm1good', M2], ['pg1good', PR]]);
      if (play.day) { queueFn(() => { slateWrite(play.day); reading(); }); return; }
      lines([['fm1day', M2], ['pg1day', PR]]);
      queueFn(() => askDay());
    }
    /* THE DAY HE WAS BORN (S47): eight days in their Thai colours — Wednesday has a night of its own (Rahu's) */
    const DAYS = [['sun', '#d23a30'], ['mon', '#e8c228'], ['tue', '#ec7fa4'], ['wed', '#3a9a4a'], ['wedn', '#3c3a42'],
                  ['thu', '#ec8a2a'], ['fri', '#5aa8e0'], ['sat', '#7a4aa8']];
    const DAY_TH = { sun: 'วันอาทิตย์', mon: 'วันจันทร์', tue: 'วันอังคาร', wed: 'วันพุธ', wedn: 'พุธกลางคืน', thu: 'วันพฤหัสบดี', fri: 'วันศุกร์', sat: 'วันเสาร์' };
    function askDay() {
      const run = play.run;
      if (!kit || !kit.pick) { play.day = 'fri'; reading(); return; }
      kit.pick(DAYS.map(([id, color]) => ({ id, color, label: W['day_' + id], sub: W['dayc_' + id] })),
               { label: W.pickLabel, title: W.pickTitle }).then(id => {
        if (!live(run)) return;
        if (!id) { after(0.8, askDay); return; }
        play.day = id;
        setPhase('consult', id);
        slateWrite(id);
        reading();
      });
    }
    /* the master writes the day on his slate in chalk, with the small square of a reckoning under it */
    function slateWrite(id) {
      const S2 = room.slate; if (!S2) return;
      const x = S2.ctx, Wd = 256, Hd = 180;
      x.fillStyle = '#20262a'; x.fillRect(0, 0, Wd, Hd);
      for (let i = 0; i < 300; i++) { x.fillStyle = `rgba(200,210,214,${(Math.random() * 0.05).toFixed(3)})`; x.fillRect(Math.random() * Wd, Math.random() * Hd, 2, 1); }
      x.strokeStyle = 'rgba(232,236,236,0.85)'; x.fillStyle = 'rgba(236,240,240,0.92)';
      x.font = `bold 34px ${THAI_FONT}`; x.textAlign = 'center'; x.textBaseline = 'middle';
      if (!id) { S2.tex.needsUpdate = true; return; }
      x.save(); x.translate(Wd / 2, 40); x.rotate(-0.03); x.fillText(DAY_TH[id], 0, 0); x.restore();
      x.lineWidth = 2.2;
      const gx = 78, gy = 72, gs = 33;
      for (let i = 0; i <= 3; i++) { x.beginPath(); x.moveTo(gx + i * gs, gy); x.lineTo(gx + i * gs + (i % 2) * 1.5, gy + 3 * gs); x.stroke();
                                     x.beginPath(); x.moveTo(gx, gy + i * gs); x.lineTo(gx + 3 * gs, gy + i * gs + (i % 2) * 1.5); x.stroke(); }
      x.font = `22px ${THAI_FONT}`;
      const digits = ['๑', '๒', '๓', '๔', '๕', '๖', '๗', '๘', '๙'];
      const start = Math.max(0, DAYS.findIndex(d => d[0] === id));
      for (let k = 0; k < 9; k++) x.fillText(digits[(k + start) % 9], gx + (k % 3) * gs + gs / 2, gy + Math.floor(k / 3) * gs + gs / 2 + 1);
      S2.tex.needsUpdate = true;
    }
    function reading() {
      const M2 = cast.master, PR = cast.pongR, run = play.run;
      lines([['fm1hm', M2], ['fm1read', M2], ['pg1read', PR], ['q1short', null]]);
      queueFn(() => writeLedger('who:read', 'who', 'ledReadF', 'ledReadM').then(() => { if (live(run)) itemsBegin(false); }));
    }

    /* ================================================================ P5 · THE ITEMS */
    /* the tray Pa Noi brings: red lacquer on a short pedestal, set on the floor beside his mat — a small Nang Kwak
       medallion on its card, a takrut on its cord, a pha yant folded — and, once he has given it, his envelope */
    const tray = (() => {
      const g = new THREE.Group(); g.position.set(0.5, 0, -0.42); g.rotation.y = -0.35; g.visible = false; g.userData.dyn = true; worldR.add(g);
      const mk = (geo, mat, x, y, z) => { const o = new THREE.Mesh(geo, mat); o.position.set(x, y, z); g.add(o); return o; };
      const lacq = M({ color: 0x7a1414, roughness: 0.32 }), gold = M({ color: 0xc89a3a, roughness: 0.35, metalness: 0.7 });
      mk(new THREE.CylinderGeometry(0.06, 0.09, 0.07, 18), lacq, 0, 0.035, 0);
      mk(new THREE.CylinderGeometry(0.2, 0.19, 0.022, 32), lacq, 0, 0.081, 0);
      mk(new THREE.TorusGeometry(0.2, 0.008, 6, 40), gold, 0, 0.094, 0).rotation.x = Math.PI / 2;
      const T = 0.093;
      /* the Nang Kwak: a gilt medallion of her, beckoning, on a red card */
      const nk = new THREE.Group(); nk.position.set(-0.1, T, 0.03); g.add(nk);
      const card = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.004, 0.1), M({ color: 0xa81e22, roughness: 0.7 })); card.position.y = 0.002; nk.add(card);
      const med = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.024, 0.005, 24), gold); med.position.set(0, 0.0065, 0.01); nk.add(med);
      const medT = (() => { const [c, x] = cnv(64); x.fillStyle = '#c89a3a'; x.fillRect(0, 0, 64, 64); x.strokeStyle = '#6a4a14'; x.lineWidth = 3;
        x.beginPath(); x.arc(32, 32, 28, 0, Math.PI * 2); x.stroke();
        x.beginPath(); x.arc(32, 20, 6, 0, Math.PI * 2); x.stroke(); x.beginPath(); x.moveTo(32, 26); x.quadraticCurveTo(22, 44, 26, 54); x.lineTo(38, 54); x.quadraticCurveTo(42, 44, 32, 26); x.stroke();
        x.beginPath(); x.moveTo(36, 32); x.lineTo(44, 24); x.lineTo(46, 18); x.stroke();
        return tex(done(THREE, c, false)); })();
      const face = new THREE.Mesh(new THREE.CircleGeometry(0.023, 24), M({ map: medT, roughness: 0.35, metalness: 0.6 })); face.rotation.x = -Math.PI / 2; face.position.set(0, 0.0095, 0.01); nk.add(face);
      /* the takrut: a small dark metal roll on its cord */
      const tk = new THREE.Group(); tk.position.set(0.06, T, -0.07); g.add(tk);
      const roll = new THREE.Mesh(new THREE.CylinderGeometry(0.007, 0.007, 0.06, 10), M({ color: 0x3a3430, roughness: 0.4, metalness: 0.8 })); roll.rotation.z = Math.PI / 2; roll.position.y = 0.008; tk.add(roll);
      const cord = new THREE.Mesh(new THREE.TorusGeometry(0.045, 0.0018, 4, 32), M({ color: 0x1a1a1a, roughness: 0.8 })); cord.rotation.x = Math.PI / 2; cord.position.set(0, 0.003, 0.02); cord.scale.set(1, 0.7, 1); tk.add(cord);
      /* the pha yant: a white cloth folded in four, the yant's red lines showing */
      const py = new THREE.Group(); py.position.set(0.07, T, 0.08); g.add(py);
      const yt = (() => { const [c, x] = cnv(64); x.fillStyle = '#f2ece0'; x.fillRect(0, 0, 64, 64); x.strokeStyle = '#a81e22'; x.lineWidth = 2;
        x.strokeRect(6, 6, 52, 52); x.beginPath(); x.moveTo(32, 10); x.lineTo(54, 50); x.lineTo(10, 50); x.closePath(); x.stroke();
        for (let i = 0; i < 4; i++) { x.beginPath(); x.moveTo(14, 16 + i * 9); x.lineTo(28, 16 + i * 9); x.stroke(); }
        return tex(done(THREE, c, false)); })();
      const cloth2 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.006, 0.08), [M({ color: 0xece4d4, roughness: 0.9 }), M({ color: 0xece4d4, roughness: 0.9 }),
        M({ map: yt, roughness: 0.9 }), M({ color: 0xece4d4, roughness: 0.9 }), M({ color: 0xece4d4, roughness: 0.9 }), M({ color: 0xece4d4, roughness: 0.9 })]);
      cloth2.position.y = 0.003; cloth2.rotation.y = 0.3; py.add(cloth2);
      /* his envelope, white, set across the tray's front */
      const env = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.003, 0.06), M({ color: 0xf6f4ee, roughness: 0.85 })); env.position.set(-0.04, T + 0.006, -0.1); env.rotation.y = 0.25; env.visible = false; g.add(env);
      g.userData.pieces = { nangkwak: nk, takrut: tk, phayant: py }; g.userData.env = env;
      return g;
    })();
    const TRAY_W = () => new THREE.Vector3(RX + tray.position.x, 0.12, tray.position.z);
    function trayShow(on) { tray.visible = !!on; for (const k in tray.userData.pieces) tray.userData.pieces[k].visible = k !== play.item; tray.userData.env.visible = play.offered; }
    /* the view down onto the tray beside him, and back up to the master */
    const yawToTray = () => { const t = TRAY_W(); return Math.atan2(-(t.x - yaw.position.x), -(t.z - yaw.position.z)); };
    function lookTray(on, done2) {
      const KN = Object.assign({}, KNEEL);
      turnTo(on ? yawToTray() : faceMaster(), 0.8, Object.assign(KN, { pitch: on ? -0.62 : -0.06, lo: on ? -0.9 : KNEEL.lo }), done2);
    }
    function itemsBegin(resumed) {
      setPhase('items', play.item);
      if (resumed) {
        trayShow(true);
        if (play.item) { offerBegin(); return; }
        after(0.8, () => lookTray(true, () => chooseItem()));
        return;
      }
      /* Pa Noi comes through the curtained doorway with the tray */
      const NR = cast.noiR, run = play.run;
      const trayDown = (P) => {
        if (!live(run)) return;
        trayShow(true);
        if (worldSfx) worldSfx('w4tray', 0.6);
        line('pn1tray', P);
        if (P) queueFn(() => personWalk(P, [[1.75, -1.1], [2.07, -2.45]], { speed: 0.9, then: () => { P.group.visible = false; } }));
        lines([['pg1items', cast.pongR], ['fm1items', cast.master]]);
        queueFn(() => lookTray(true, () => chooseItem()));
      };
      whenReadyOr(NR, () => {
        if (!live(run)) return;
        NR.group.visible = true;
        personPut(NR, 2.07, -2.3, 0);
        personWalk(NR, [[1.75, -1.1], [0.92, -0.62]], { speed: 0.9, ry: -2.3, then: () => trayDown(NR) });
      }, () => after(1.2, () => trayDown(null)));   // her model never came: the tray is simply there, her voice from the doorway
    }
    function chooseItem() {
      const run = play.run;
      if (!kit || !kit.choose) return;
      kit.choose(['nangkwak', 'takrut', 'phayant'], { label: W.chooseLabel, title: W.chooseTitle }).then(id => {
        if (!live(run)) return;
        if (!id) { after(0.8, chooseItem); return; }
        play.item = id;
        if (kit.give) { kit.give(id); if (kit.urge) kit.urge(null); }
        trayShow(true);
        bank(W['note_' + id]);
        setPhase('items', id);
        line({ nangkwak: 'pg1nk', takrut: 'pg1tk', phayant: 'pg1py' }[id], cast.pongR);
        offerBegin();
      });
    }
    function offerBegin() {
      line('pg1offer', cast.pongR);
      queueFn(() => { play.offerOn = true; objectiveFor('items'); });
    }
    function offer() {
      if (!play.offerOn || play.offered) return false;
      play.offerOn = false; play.offered = true;
      trayShow(true);
      if (worldSfx) worldSfx('w4envelope', 0.6);
      objectiveFor('items');
      line('fm1anu', cast.master);
      queueFn(() => lookTray(false, () => workBegin(false)));
      return true;
    }

    /* ================================================================ P6 · THE WORK: the chant and the four signs */
    /* the chant's words (§4.4, the research): the homage three times, the Nang Kwak trade formula twice — a Thai folk
       formula in Pali-sounding words, captioned as such — and "may great gains be mine". Timed on the take's own
       breaths (CP11, measured: five of 1.2-1.6 s at -40 dB, so six phrases — 0-4.75, 6.25-11.1, 12.7-17.6, 19.6-24.0,
       25.4-30.0, 31.35-33.8 of its 33.8 s). */
    const CHANT_CAPS = () => [
      { at: 0.1, end: 4.9, text: W.chant1, sub: W.chant1en }, { at: 6.2, end: 11.2, text: W.chant1, sub: W.chant1en },
      { at: 12.6, end: 17.7, text: W.chant1, sub: W.chant1en },
      { at: 19.5, end: 24.1, text: W.chant2, sub: W.chant2en }, { at: 25.3, end: 30.1, text: W.chant2, sub: W.chant2en },
      { at: 31.3, end: 33.8, text: W.chant3, sub: W.chant3en }];
    function chantStart() {
      sfxReady('fm1chant', 0.8, d => play.chants.push(d));
      if (kit && kit.captions) kit.captions(CHANT_CAPS());
      play.chantNext = wallNow() + (SECS.fm1chant || 28);          // on WALL time (CP13: the chapter clock stops under a ledger page)
    }
    function workBegin(resumed) {
      setPhase('work', [...play.signs].join(','));
      const go = () => {
        roomCtl.candles(true, resumed ? 0.01 : 1.6);
        if (!resumed && worldSfx) worldSfx('w4match', 0.6);
        cast.master.look = 0;                     // his eyes close for the chant
        chantStart();
        roomCtl.rain(resumed ? 0.7 : 0.35, resumed ? 0.01 : 6);
        if (!resumed) after(12, () => { if (phase === 'work') roomCtl.rain(0.7, 18); });
        herCtl.at('door'); herCtl.show(true);
        play.signsOn = true; play.breathNext = dayClock.t + 8; play.gestNext = dayClock.t + 4;
        objectiveFor('work');
      };
      if (resumed) { go(); return; }
      lines([['fm1eyes', cast.master], ['pg1eyes', cast.pongR]]);
      queueFn(go);
    }
    const SIGN = { smoke: ['q1smoke', 'ledSmokeF', 'ledSmokeM'], cloth: ['q1cloth', 'ledClothF', 'ledClothM'],
                   shadow: ['q1shadow', 'ledShadowF', 'ledShadowM'], her: ['q1her', 'ledHerF', 'ledHerM'] };
    const signOpen = (k) => phase === 'work' && play.signsOn && !play.busy && !play.signs.has(k) && worldOf(yaw.position.x) === 'R'
                            && (k !== 'her' || play.herSeen);
    function sign(key) {
      if (!signOpen(key)) return false;
      play.busy = true;
      const S2 = SIGN[key], run = play.run;
      /* she is gone as he turns to her (CP13: the doorway's cone is wider than her fade on a phone, so she could stand there
         through "No. There's no one.") — and back at the edge of sight after his line, while the work goes on */
      if (key === 'her') herCtl.show(false);
      line(S2[0], null);
      queueFn(() => writeLedger('saw:' + key, 'saw', S2[1], S2[2]).then(() => {
        if (!live(run)) return;
        play.signs.add(key); play.busy = false;
        setPhase('work', [...play.signs].join(','));
        if (key === 'her' && phase === 'work') herCtl.show(true);
        if (play.signs.size >= 4) stormBegin(false);
      }));
      return true;
    }
    /* her place on the screen, for the sign's look-spot and the storm's fourth flash: wherever she stands now */
    const herPos = { x: RX + RMC.HER.door.x, y: 1.32, z: RMC.HER.door.z };
    function herPosSync() { const p = HER_SPOT(); herPos.x = RX + p.x; herPos.z = p.z; }

    /* ================================================================ P7 · THE STORM: WHAT CHANGED? */
    const chg = {
      cup: { id: 'cup', pos: { x: RX + RMC.CUP[0].x, y: RMC.LOWT.top + 0.06, z: RMC.CUP[0].z } },
      cloth: { id: 'cloth', pos: { x: RX + RMC.BOWL.x, y: RMC.LOWT.top + 0.13, z: RMC.BOWL.z } },
      clock: { id: 'clock', pos: { x: RX + RMC.CLOCK.x, y: RMC.CLOCK.y1 - 0.13, z: RM.z0 + 0.1 } },
      her: { id: 'her', pos: herPos }
    };
    function stormBegin(resumed) {
      setPhase('storm');
      play.signsOn = false;
      roomCtl.rain(1, resumed ? 0.01 : 2.5);
      roomCtl.tube(false, !resumed);
      if (!resumed) sfxReady('w4tube', 0.55, null, 1);              // the tube flickers and dies with the power
      droneStop(0);
      after(resumed ? 0.05 : 1.7, () => look('DARK', resumed ? 0.01 : 0.5));
      if (kit && kit.lightning) kit.lightning({ power: 0.7, near: 0.25, thunder: 'w4thunder', vol: 0.8 });
      herCtl.at('door'); herCtl.show(true); herPosSync();
      if (!resumed) line('pg1power', cast.pongR);
      /* he faces the master before the room is shown to him (CP13: WHAT CHANGED? was played from wherever the fourth sign
         left his eyes — on a phone every change could be off the screen — and nothing can turn the view while it runs) */
      queueFn(() => faceRoom(() => changeEvent()));
    }
    function faceRoom(done) {
      const d = Math.abs(angTo(yaw.rotation.y, faceMaster())) + Math.abs(pitch.rotation.x + 0.06);
      if (d < 0.02) { done(); return; }
      turnTo(faceMaster(), Math.min(1.0, 0.35 + d * 0.6), Object.assign({ pitch: -0.06 }, KNEEL), done);
    }
    function changeEvent() {
      const run = play.run;
      if (!kit || !kit.event) { stormEnd(null); return; }
      kit.event({ kind: 'change', label: W.chgLabel, brief: W.chgBrief, spots: [chg.cup, chg.cloth, chg.clock, chg.her],
        rounds: [[], ['cup'], ['cloth', 'clock'], ['her'], []],
        lead: 1.4, dark: 1.6, lit: 2.6, hit: 3, miss: 1, falseCost: 3, falseCap: 2, tol: 0.09,   // (CP13: at most two false taps paid a flash — a panicked thumb could faint him and lose the chapter)
        /* the one low drone rises from START (CP13: begun at the storm, its swell had passed before a slow reader of the
           brief had played a round) */
        onBegin() { droneStop(0); sfxReady('w4storm', 0.42, d => { if (phase === 'storm') play.drone = d; else try { d.stop(); } catch (e) {} }); },
        apply(r) {
          if (r === 1) { roomCtl.cup(1); chg.cup.pos.x = RX + RMC.CUP[1].x; chg.cup.pos.z = RMC.CUP[1].z; }
          if (r === 2) { roomCtl.clothShift(true); roomCtl.clock(false); }
          if (r === 3) { herCtl.at('step'); herPosSync(); }
        },
        onPhase(r, ph) {
          if (ph === 'lit') { if (kit.lightning) kit.lightning({ power: r === 4 ? 1.4 : 1.0, near: 0.95, thunder: 'w4crack', vol: r === 4 ? 1 : 0.65 }); look('FLASH', 0.05); }
          else if (ph === 'dark') look('DARK', 0.15);
          else if (ph === 'end') look('DARK', 0.3);
        }
      }).then(res => { if (live(run) && !(res && res.aborted)) stormEnd(res); });   // (CP13: a faint aborts it — not an end)
    }
    function droneStop(tau) {
      const d = play.drone; play.drone = null;
      if (!d) return;
      try { const t = d.context.currentTime; if (d.__g && tau > 0) { d.__g.gain.setTargetAtTime(0, t, tau); d.stop(t + tau * 6); } else d.stop(); } catch (e) {}
    }
    function stormEnd(res) {
      setPhase('storm', 'done');                   // the storm is paid: a Continue from here lands on the decision (CP13)
      bank(res && res.wrong ? W.noteStormFalse : res && res.right ? W.noteStormTrue : W.noteStormNone);   // (CP13: a storm with nothing tapped and every change missed said he 'saw only what changed')
      roomCtl.rain(0, 0.25);                       // all at once
      droneStop(0.08);                             // and the drone with it
      chantStop(0.08); play.chantNext = 0;         // and the chant: he has stopped (CP13: it ran on under the decision)
      roomCtl.smokeStraight(true);                 // and every sign settles: the table's smoke goes straight up with the fan's air
      herCtl.show(false);
      if (worldSfx) worldSfx('w4rainstop', 0.7);
      after(0.5, () => look('HUSH', 2.8));
      cast.master.look = 1;                        // his eyes open: the kind face he had at the start
      after(3.4, () => decideBegin(false));
    }

    /* ================================================================ DECIDE */
    function decideBegin(resumed) {
      /* whom he asked, from the ledger as well (CP13: play.asked is rebuilt only for 'wait', so a Continue in the room
         told him he never asked) */
      const askedAny = play.asked.size || (kit && kit.ledger && kit.ledger.entries().some(e => /^who:/.test(e.id)));
      bank(askedAny ? W.noteAsked : W.noteNeverAsked);
      if (kit && kit.ledger) {
        const ents = kit.ledger.entries(), f = ents.filter(e => e.kind === 'fact').length, m = ents.filter(e => e.kind === 'meaning').length;
        if (f + m) bank(f >= m ? W.noteFacts : W.noteMeanings);
      }
      setPhase('decide');
      if (resumed) after(0.6, openDecision); else openDecision();
    }

    /* ---------------------------------------------------------------- the frame's share */
    function playTick(now, wdt) {
      unseenTick();
      zoneTick(now);
      if (getState() !== 'play') return;
      turnTick(wdt);
      const inC = worldOf(yaw.position.x) === 'C', inR = worldOf(yaw.position.x) === 'R';
      if (phase === 'arrive' && inC && !play.greeted) {   // (CP13: after the greeting it came back over her for ten seconds)
        const P = cast.pong;
        if (P && P.ready && P.walk) kit.waypoint({ x: P.group.position.x, y: 2.0, z: P.group.position.z });
        else kit.waypoint({ x: cast.noi.group.position.x, y: 2.0, z: cast.noi.group.position.z });
        if (Math.hypot(yaw.position.x - cast.noi.group.position.x, yaw.position.z - cast.noi.group.position.z) < 3.4 && !play.greeted) { kit.waypoint(null); greet(); }
      }
      if (phase === 'wait' && inC && !play.busy && !play.calling && !lineQ.length && !speak.pending && dayClock.t >= speak.until
          && dayClock.t >= play.nextCall && !(kit.ledger && kit.ledger.isOpen())) callNext();
      if (phase === 'consult' && inR && !play.kneeling && matZone.visible
          && Math.hypot(yaw.position.x - (RX + CMAT.x), yaw.position.z - CMAT.z) < 0.42) kneel(false);
      if ((phase === 'work' || phase === 'storm') && inR) {
        /* the chant goes on, murmured, under the signs and the storm */
        if (play.chantNext && wallNow() >= play.chantNext) { sfxReady('fm1chant2', 0.5, d => play.chants.push(d)); play.chantNext = wallNow() + (SECS.fm1chant2 || 40); }
        if (phase === 'work') {
          /* the cloth breathes now and then; his hands move over the mala, so his shadow can be seen to follow late */
          if (dayClock.t >= play.breathNext) { roomCtl.breathe(); if (worldSfx) worldSfx('w4cloth', 0.35); play.breathNext = dayClock.t + 9 + 5 * ((dayClock.t * 7.13) % 1); }
          if (dayClock.t >= play.gestNext) { personTalk(cast.master, 2.6); if (worldSfx) worldSfx('w4mala', 0.3); play.gestNext = dayClock.t + 7 + 4 * ((dayClock.t * 3.71) % 1); }
          if (!play.herSeen && (her.k > 0.45 || (cast.her && cast.her.failed))) play.herSeen = true;   // (CP13: her model failed — the doorway is still the sign)
          herPosSync();
        }
      }
    }

    /* ---------------------------------------------------------------- the hotspots */
    const near = (P, dy = 1.1) => ({ x: P ? P.group.position.x : 0, y: (P ? P.group.position.y : 0) + dy, z: P ? P.group.position.z : 0 });
    /* does the ground segment (ax, az)→(bx, bz) pass through the box { x0, x1, z0, z1 }? (a slab test) */
    function segBox(ax, az, bx, bz, B2) {
      let t0 = 0, t1 = 1;
      for (const [p, d, lo, hi] of [[ax, bx - ax, B2.x0, B2.x1], [az, bz - az, B2.z0, B2.z1]]) {
        if (Math.abs(d) < 1e-9) { if (p < lo || p > hi) return false; continue; }
        let u0 = (lo - p) / d, u1 = (hi - p) / d; if (u0 > u1) [u0, u1] = [u1, u0];
        t0 = Math.max(t0, u0); t1 = Math.min(t1, u1); if (t0 > t1) return false;
      }
      return true;
    }
    const askSpot = (key, Pf, prompt) => {
      const pos = { x: 0, y: 0, z: 0 };
      return { id: 'ask-' + key, get pos() { const P = Pf(); const p = near(P, 1.15); pos.x = p.x; pos.y = p.y; pos.z = p.z; return pos; },
               radius: 3.4, aim: 0.3, pressAim: true, markY: 0.42, prompt, enabled: () => askOpen(key) && worldOf(yaw.position.x) === 'C',
               onInteract() { return ask(key); } };
    };
    const signHit = (posF) => (x, y) => { const p = posF(); camera.updateMatrixWorld(); _hv.set(p.x, p.y, p.z).project(camera);
      return _hv.z < 1 && Math.hypot(x - (_hv.x * 0.5 + 0.5) * innerWidth, y - (-_hv.y * 0.5 + 0.5) * innerHeight) < Math.min(innerWidth, innerHeight) * 0.08; };
    /* a tap on a spot's own "!" (or on the thing under it) presses it: the door and the tray answer a finger as the people
       do (CP8, the phone probe: the mark over the door took no tap — only the badge at the foot of the screen did) */
    const markHit = (posF, markY, frac = 0.09) => (x, y) => { const p = posF(); camera.updateMatrixWorld();
      return [p.y, p.y + markY].some((py) => { _hv.set(p.x, py, p.z).project(camera);
        return _hv.z < 1 && Math.hypot(x - (_hv.x * 0.5 + 0.5) * innerWidth, y - (-_hv.y * 0.5 + 0.5) * innerHeight) < Math.min(innerWidth, innerHeight) * frac; }); };
    const smokePos = { x: RX + RMC.INC.x - 0.09, y: RMC.LOWT.top + 0.3, z: RMC.INC.z + 0.06 };
    const clothPos = { x: RX + RMC.BOWL.x, y: RMC.LOWT.top + 0.15, z: RMC.BOWL.z };
    const shadowPos = { x: RX + 0, y: 1.62, z: WALL_Z };
    const hotspots = [
      askSpot('joy', () => cast.joy, W.hotJoy),
      askSpot('lim', () => cast.lim, W.hotLim),
      askSpot('sb', () => cast.sombat, W.hotSombat),
      askSpot('pong', () => cast.pong, W.hotPong),
      { id: 'tree', pos: { x: CMP.TAKHIAN.x, y: 1.5, z: CMP.TAKHIAN.z + 0.9 }, radius: 12, aim: 0.22, pressAim: true, mark: false, prompt: W.hotTree,
        enabled: () => !play.tree && !play.busy && (phase === 'wait' || phase === 'arrive') && play.greeted && worldOf(yaw.position.x) === 'C'
                       && !segBox(yaw.position.x, yaw.position.z, CMP.TAKHIAN.x, CMP.TAKHIAN.z + 0.9, CMP.ROOMX),   // (CP13: offered through the room's walls)
        onInteract() { return treeLook(); } },
      { id: 'door', pos: { x: RDOOR.x, y: 1.6, z: RDOOR.z - 0.5 }, radius: 3.2, prompt: W.hotDoor,
        hits: markHit(() => ({ x: RDOOR.x, y: 1.6, z: RDOOR.z - 0.5 }), 0.55),
        enabled: () => worldOf(yaw.position.x) === 'C' && phase === 'called',
        onInteract() { return enterRoom(); } },
      /* the glowing place on the floor IS the mat's mark (CP8, by photograph: the engine's "!" floated at chest height over
         it and read as a mark on the far wall; the anchor stays at 1.0 so the badge is offered from the door) */
      { id: 'mat', pos: { x: RX + CMAT.x, y: 1.0, z: CMAT.z }, radius: 2.2, prompt: W.hotMat, mark: false,
        enabled: () => worldOf(yaw.position.x) === 'R' && phase === 'consult' && !play.kneeling,
        onInteract() { return kneel(false); } },
      { id: 'offer', get pos() { const t = TRAY_W(); return { x: t.x, y: 0.2, z: t.z }; }, radius: 2.2, prompt: W.hotOffer, markY: 0.22, anyView: true,
        hits: markHit(() => { const t = TRAY_W(); return { x: t.x, y: 0.2, z: t.z }; }, 0.22),
        enabled: () => worldOf(yaw.position.x) === 'R' && phase === 'items' && play.offerOn && !play.offered,
        onInteract() { return offer(); } },
      { id: 'sign-smoke', pos: smokePos, radius: 4, aim: 0.17, pressAim: true, mark: false, prompt: W.lookSmoke,
        hits: signHit(() => smokePos), enabled: () => signOpen('smoke'), onInteract() { return sign('smoke'); } },
      { id: 'sign-cloth', pos: clothPos, radius: 4, aim: 0.15, pressAim: true, mark: false, prompt: W.lookCloth,
        hits: signHit(() => clothPos), enabled: () => signOpen('cloth'), onInteract() { return sign('cloth'); } },
      { id: 'sign-shadow', pos: shadowPos, radius: 4, aim: 0.3, pressAim: true, mark: false, prompt: W.lookShadow,
        hits: signHit(() => shadowPos), enabled: () => signOpen('shadow'), onInteract() { return sign('shadow'); } },
      { id: 'sign-her', pos: herPos, radius: 5, aim: 0.24, pressAim: true, mark: false, prompt: W.lookHer,
        hits: signHit(() => herPos), enabled: () => signOpen('her'), onInteract() { return sign('her'); } }
    ];

    /* ------------------------------------------------------------- the frame */
    let castLast = 0;
    function updateNotes(dt, t) {
      const now = wallNow();
      const raw = castLast ? Math.max(0, now - castLast) : 0, wdt = Math.min(0.1, raw); castLast = now;
      domeFrame(now);
      roomFrame(now);
      peopleTick(now, wdt);                               // the cast's clocks run in films too (v5.19): only their looks wait for play
      herFrame(now, wdt);
      shadowFrame(now);
      yardFrame(now);
      shopFrame(now);
      taxiFrame(now);
      cabFrame(now);
      const st = getState();
      mixBeds(Math.min(1, raw), st);                   // the beds' ease on the unclamped wall step (CP13: at 2 fps "all at once" took 5 s)
      const live = st === 'play' || st === 'unlock' || st === 'choose';
      if (!booted && !preplaced && kit) {
        const w0 = preStage(kit.getPhase());
        if (w0) preplaced = w0;
      }
      if (!live) { lastWall = 0; return; }
      if (lastWall) dayClock.t += Math.min(0.5, now - lastWall);
      lastWall = now;
      if (!booted) {
        booted = true;
        applyPhase(kit ? kit.getPhase() : null);
      }
      runTodo(); runSpeak(); runQueue();
      playTick(now, wdt);
    }
    /* ---- THE BEDS (CP11, §9.3): each set by the world he is in, the hour and the storm, and eased — a world's sound
       comes and goes over about a second, the after-rain over a few. The YARD by the hour (the light's preset: the
       insects thin as the storm comes; the paddies grow toward dusk) and the luk thung RADIO in the stilt house, louder
       as he nears it (the lamps' falloff, v21.17); the ROOM's fan and tube on the room's own power, the RAIN on its zinc
       as the room's rain (light, then the downpour), and after the storm THE HUSH: nothing, then the after-rain's frogs
       and drips. In a film the beds go down: every film cues its own sound, written to its pictures. The order is
       DATA.ambience.beds'. */
    const bedMix = { yard: 0, paddy: 0, room: 0, rainl: 0, rainh: 0, after: 0, radio: 0 };
    const bedStep = (v, a, b) => { const u = v <= a ? 0 : v >= b ? 1 : (v - a) / (b - a); return u * u * (3 - 2 * u); };
    function mixBeds(wdt, st) {
      if (!(wdt > 0)) return;
      const want = { yard: 0, paddy: 0, room: 0, rainl: 0, rainh: 0, after: 0, radio: 0 };
      const w = worldOf(yaw.position.x);
      if (st !== 'cine') {
        if (w === 'C') {
          const late = lookName === 'YARD2' ? 2 : lookName === 'YARD1' ? 1 : 0;
          want.yard = [0.3, 0.26, 0.2][late];
          want.paddy = [0.08, 0.13, 0.18][late];
          const H = CMP.HOUSE, d = Math.hypot(yaw.position.x - (H.x0 + H.x1) / 2, yaw.position.z - (H.z0 + H.z1) / 2) / 7;
          want.radio = 0.3 / (1 + d * d);
          if (play.called) want.rainl = 0.2;          // the first drops on the sala's roof as his number comes (CP13: silent)
        } else if (w === 'R') {
          const rk = room.rainK || 0;
          want.room = 0.22 * Math.max(room.fanSpeed || 0, room.tubeK || 0);
          want.rainl = 0.5 * Math.min(1, rk / 0.3) * (1 - 0.8 * bedStep(rk, 0.6, 1));
          /* (CP12, priced against the voices: at 0.55 the downpour, the room and the drone summed to −20 dBFS in the band
             a voice lives in, and Pong's whisper had 5 dB over it through the duck; at 0.40 it has 8, the cast's speech 12) */
          want.rainh = 0.40 * bedStep(rk, 0.55, 1);
          /* on WALL time (CP13: the chapter clock stands still under the decision, so the after-rain never came) */
          if (phase === 'decide' && rk < 0.02) { if (hushAt < 0) hushAt = wallNow(); } else hushAt = -1;
          want.after = hushAt >= 0 && wallNow() - hushAt > 2.5 ? 0.3 : 0;
        }
      }
      for (const k in bedMix) bedMix[k] += (want[k] - bedMix[k]) * (1 - Math.exp(-wdt / (k === 'after' ? 2.5 : 0.9)));
      const B = DATA.ambience.beds;
      B[0][1] = bedMix.yard; B[1][1] = bedMix.paddy; B[2][1] = bedMix.room; B[3][1] = bedMix.rainl;
      B[4][1] = bedMix.rainh; B[5][1] = bedMix.after; B[6][1] = bedMix.radio;
    }
    function updatePile() {}
    function updateFire() {}
    function updateSlow() {}

    /* ------------------------------------------------------------ a resume (§10.1) */
    /* A CONTINUE IS PLACED BEFORE THE CARD (the v4.8 contract): under the chapter card the saved moment's picture is set —
       where he is, the light, the board, who sits where, his kneel and the room's state — so the card's dissolve shows the
       moment and nothing jumps when play begins (CP13: only the room's door was placed, so a wait showed the yard at noon
       with Pong at the gate, and a storm showed the room lit from the door, then everything moved). applyPhase does it all
       again on the first live frame, and every part of it is idempotent. */
    function preStage(p0) {
      const t = String(p0 || '').split(':'), p = PHASES.includes(t[0]) ? t[0] : 'arrive';
      let tag = t.slice(1).join(':'); const di = tag.indexOf('~'); if (di >= 0) tag = tag.slice(0, di);
      if (p === 'wait' || p === 'called') {
        let n = p === 'called' ? 14 : 9;
        for (const part of tag.split(';')) if (/^n\d+$/.test(part)) n = Math.min(14, Math.max(9, parseInt(part.slice(1), 10)));
        yaw.position.x = 3.1; yaw.position.z = 3.8; yaw.rotation.y = 0.62; pitch.rotation.x = -0.05;
        look(SKY[n], 0); boardSet(n);
        whenReady(cast.pong, (P) => { if (!booted) { personPut(P, SEAT.pong.x, SEAT.pong.z, Math.PI / 2, CMP.SALA.floor); seatNow(P, true); } });
        if (n >= 12) whenReady(cast.joy, (P) => { if (!booted) P.group.visible = false; });
        if (n >= 13) whenReady(cast.lim, (P) => { if (!booted) P.group.visible = false; });
        return 'C';
      }
      const RA = resumeAt(p0);
      if (!RA) return '';
      placeIn('R');
      if (p === 'consult') return 'R';
      yaw.position.x = RX + CMAT.x; yaw.position.z = CMAT.z; yaw.rotation.y = faceMaster(); pitch.rotation.x = -0.06;
      if (kit) kit.pose('lying', { y: KNEEL.y, yaw: faceMaster(), span: KNEEL.span, pitchLo: KNEEL.lo, pitchHi: KNEEL.hi, secs: 0.05 });
      const bagged = PIECES.find(k => kit && kit.has && kit.has(k)) || '';
      play.item = p === 'items' && PIECES.includes(tag) ? tag : bagged;     // the piece he took is not on the tray
      if (p !== 'items') play.offered = true;
      trayShow(true);
      if (p === 'items') return 'R';
      roomCtl.candles(true, 0.01);
      if (p === 'work') { roomCtl.rain(0.7, 0.01); return 'R'; }
      if (p === 'storm' && tag !== 'done') { roomCtl.rain(1, 0.01); roomCtl.tube(false); look('DARK', 0); return 'R'; }
      roomCtl.tube(false); roomCtl.rain(0, 0.01); roomCtl.cup(1); roomCtl.clothShift(true); roomCtl.clock(false); roomCtl.smokeStraight(true);
      look('HUSH', 0);
      return 'R';
    }
    function resumeAt(p0) {
      const tag = String(p0 || '').split(':'), p = PHASES.includes(tag[0]) ? tag[0] : 'arrive';
      if (PHASES.indexOf(p) >= PHASES.indexOf('consult')) return { w: 'R', at: p, tag: tag.slice(1).join(':') };
      return null;
    }
    /* A CONTINUE LANDS WHERE A RELOAD WOULD (§10.1): each phase's receipt is in its string — whom he asked and the
       number called (wait:joy,sb;n11;mjoy), the day he was born (consult:fri), the piece he took (items:takrut), the
       signs he has written (work:smoke,her) — and the world, the people and the room are put as that moment had them */
    const seatNow = (P, on) => { if (!P) return; P.seated = !!on; P.sitW = on ? 1 : 0; P.sitOff = null; P.walk = null; };
    function yardResume(p) {
      yaw.position.x = 3.1; yaw.position.z = 3.8; yaw.rotation.y = 0.62; pitch.rotation.x = -0.05;
      if (kit) kit.pose('standing', { secs: 0.05 });
      look(SKY[play.n], 0); boardSet(play.n);
      play.greeted = true; play.water = true; play.pongSat = true;
      whenReady(cast.pong, (P) => { personPut(P, SEAT.pong.x, SEAT.pong.z, Math.PI / 2, CMP.SALA.floor); seatNow(P, true); });
      if (play.n >= 12) whenReady(cast.joy, (P) => { P.group.visible = false; });
      if (play.n >= 13) whenReady(cast.lim, (P) => { P.group.visible = false; });
      if (p === 'wait') waitBegin(true); else calledBegin(true);
    }
    function applyPhase(p0) {
      const t = String(p0 || '').split(':'), p = PHASES.includes(t[0]) ? t[0] : 'arrive';
      let tag = t.slice(1).join(':');
      const dayAt = tag.indexOf('~');
      if (dayAt >= 0) { const d = tag.slice(dayAt + 1); tag = tag.slice(0, dayAt); if (DAY_TH[d]) play.day = d; }
      if (p === 'arrive') { arriveBegin(); return; }
      if (p === 'wait') {
        for (const part of tag.split(';')) {
          if (/^n\d+$/.test(part)) { const n = parseInt(part.slice(1), 10); if (n >= 9 && n <= 14) play.n = n; }
          else if (part.startsWith('m')) { for (const k of part.slice(1).split(',')) if (ASK[k]) play.missed.add(k); }
          else for (const k of part.split(',')) if (ASK[k]) play.asked.add(k);
        }
        /* a save in the seconds between the board's flip and the walk in (CP13): whoever's number is up has gone in, so
           one he never asked is missed (a "!" over her empty seat otherwise), and FOURTEEN is the call itself (the
           wait could never call again: a soft-lock) */
        if (play.n >= 12 && !play.asked.has('joy')) play.missed.add('joy');
        if (play.n >= 13 && !play.asked.has('lim')) play.missed.add('lim');
        if (play.n >= 14) { play.called = true; yardResume('called'); return; }
        yardResume('wait');
        return;
      }
      if (p === 'called') { play.n = 14; play.called = true; yardResume('called'); return; }
      /* the room */
      warmWork();
      if (p === 'consult' && DAY_TH[tag]) play.day = tag;
      const bagged = ['nangkwak', 'takrut', 'phayant'].find(k => kit && kit.has && kit.has(k));
      if (p === 'items') { if (['nangkwak', 'takrut', 'phayant'].includes(tag)) play.item = tag; else if (bagged) play.item = bagged; }
      if (p === 'work' || p === 'storm' || p === 'decide') { play.item = bagged || ''; play.offered = true; }
      if (p === 'work') for (const k of tag.split(',')) if (SIGN[k]) play.signs.add(k);
      if (p === 'storm' || p === 'decide') for (const k of Object.keys(SIGN)) play.signs.add(k);
      toWorld('R', true, p, tag);
      if (p === 'consult') { consultBegin(true); return; }
      if (play.day) slateWrite(play.day);
      kneel(true);
      if (p === 'items') { itemsBegin(true); return; }
      trayShow(true);
      if (p === 'work') { workBegin(true); return; }
      roomCtl.candles(true, 0.01);
      if (p === 'storm' && tag !== 'done') { cast.master.look = 0; play.chantNext = wallNow() + 0.5; stormBegin(true); return; }   // (CP13: his eyes shut for the chant, and the chant under it)
      /* decide: the room as the storm left it */
      roomCtl.tube(false); roomCtl.rain(0, 0.01); roomCtl.cup(1); roomCtl.clothShift(true); roomCtl.clock(false); roomCtl.smokeStraight(true);
      look('HUSH', 0);
      decideBegin(true);
    }

    /* ====================================================== THE FILMS (CP9 · §4.0, §4.7, §4.8)
       The opening film, the four endings and the coda they share. Every picture is a function of the film's clock (v19.5's
       law; e3c5's shape): each film below the build holds only its cues and its fades, and one track calls
       films.frame(key, t) here — so a seek, a skip and a slow phone land on the same frame. A person's PLACE is the
       clock's (fPut, fWalk); only his gait and his talk ease on wall time, and he talks while a line of his plays (read off
       the film's own cues). The light follows the shot and is set when it changes. Every person is the cast, never a block
       figure (v21.16); every prop is this chapter's own. */
    const FL = { key: '', lit: '', stings: [], api: null, hand: null, shopOn: false };
    const DUSK_SKY = new THREE.Vector3();
    const c01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v), smo = (k) => k * k * (3 - 2 * k), sgk = (t, a, b) => c01((t - a) / (b - a));
    const lp = (a, b, k) => a + (b - a) * k, lp3 = (a, b, k) => [lp(a[0], b[0], k), lp(a[1], b[1], k), lp(a[2], b[2], k)];
    const isNarrow = () => camera.aspect < 1;
    const _ffv = new THREE.Vector3(), _ffv2 = new THREE.Vector3();
    function fLook(name, secs = 0) { if (FL.lit !== name) { FL.lit = name; look(name, secs); } }
    function fLens(f) { if (Math.abs(camera.fov - f) > 1e-3) { camera.fov = f; camera.updateProjectionMatrix(); } }
    function camAt(p, q, roll = 0) {
      yaw.position.set(p[0], p[1], p[2]);
      const dx = q[0] - p[0], dy = q[1] - p[1], dz = q[2] - p[2];
      yaw.rotation.y = Math.atan2(-dx, -dz); pitch.rotation.x = Math.atan2(dy, Math.hypot(dx, dz));
      camera.rotation.z = roll;
    }
    /* where his FACE is, for a lens to frame: the head bone is the skull's base, 9 cm under the eyes, and a shot aimed
       at it put the eyes at the top of a phone's frame and cut them in the cab (CP9, by photograph) */
    function faceOf(P, fb) { const h = headOf(P, null); return h ? [h[0], h[1] + 0.08, h[2]] : fb; }
    /* where a person's head is (his look's target), or a fallback point */
    function headOf(P, fb) { if (P && P.ready && P.head && P.group.visible) { P.head.getWorldPosition(_ffv); return [_ffv.x, _ffv.y, _ffv.z]; } return fb; }
    function handOf(P, re) {
      if (!P || !P.ready || !P.model) return null;
      if (!P.handBone) P.model.traverse(b => { if (b.isBone && re.test(b.name) && !P.handBone) P.handBone = b; });
      return P.handBone ? P.handBone.getWorldPosition(new THREE.Vector3()) : null;
    }
    /* a person at a mark (a cut), standing or seated */
    function fPut(P, x, z, ry, o = {}) {
      if (!P || !P.ready) return;
      P.walk = null; P.filmWalk = 0; P.sitOff = null; P.group.visible = true;
      P.group.position.set(x, o.y != null ? o.y : (P.o.ground ? P.o.ground(x, z) : P.group.position.y), z);
      if (ry != null) { P.group.rotation.y = ry; P.turnTo = null; }
      if (o.seated != null && P.seated !== !!o.seated) seatNow(P, o.seated);
    }
    const faceTo = (x, z, tx, tz) => Math.atan2(tx - x, tz - z);
    function pathLen(pts) { let L = 0; for (let i = 1; i < pts.length; i++) L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); return L; }
    function pathAt(pts, s) {
      for (let i = 1; i < pts.length; i++) {
        const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
        if (s <= d || i === pts.length - 1) { const f = d > 1e-6 ? c01(s / d) : 1; return [lp(pts[i - 1][0], pts[i][0], f), lp(pts[i - 1][1], pts[i][1], f)]; }
        s -= d;
      }
      return pts[0].slice();
    }
    /* a person walked along points by the film's clock: his place at t, his heading the path's (eased over half a metre
       either side, so a corner is walked); the gait plays while he moves (peopleTick reads P.filmWalk, his speed) */
    function fWalk(P, pts, t0, t1, t, o = {}) {
      if (!P || !P.ready) return;
      const L = pathLen(pts), k = sgk(t, t0, t1), s = (o.linear ? k : smo(k)) * L;
      const a = pathAt(pts, s), f = pathAt(pts, Math.min(L, s + 0.5)), b = pathAt(pts, Math.max(0, s - 0.5));
      P.walk = null; P.sitOff = null; P.group.visible = true;
      if (P.seated || P.sitW > 0) seatNow(P, false);
      P.group.position.set(a[0], o.y != null ? o.y : (P.o.ground ? P.o.ground(a[0], a[1]) : P.group.position.y), a[1]);
      const moving = t > t0 && t < t1;
      P.filmWalk = moving ? (L / Math.max(0.2, t1 - t0)) * (o.linear ? 1 : 1.3) : 0;
      if (moving) { const dx = f[0] - b[0], dz = f[1] - b[1]; if (dx * dx + dz * dz > 1e-6) { P.group.rotation.y = Math.atan2(dx, dz); P.turnTo = null; } }
      else if (t >= t1 && o.ry != null) P.group.rotation.y = o.ry;
      else if (t <= t0 && o.ry0 != null) P.group.rotation.y = o.ry0;
    }
    /* who is speaking a line of the film's at t: his talking take, read off the film's own cues */
    const SPEAKS = { pg: 'pong', fm: 'master', pn: 'noi' };
    function speakerNow(who) {
      const cand = who === 'pong' ? [cast.pongCab, cast.pongR, cast.pong] : who === 'noi' ? [cast.noi, cast.noiR] : [cast[who]];
      for (const P of cand) {
        if (!P || !P.ready) continue;
        let vis = P.group.visible; for (let q = P.group.parent; vis && q && q !== world; q = q.parent) vis = q.visible;
        if (vis) return P;
      }
      return null;
    }
    function fTalk(t) {
      for (const s of FL.stings) {
        const sp = SPEAKS[String(s.kind).slice(0, 2)]; if (!sp || /chant/.test(s.kind)) continue;
        const d = SECS[s.kind]; if (!d || t < s.at || t > s.at + d) continue;
        const P = speakerNow(sp); if (P) P.talkUntil = wallNow() + 0.25;
      }
    }

    /* ---- the films' props: a stock book he carries (the endings' notes), a pen, the guava bag, the master's card, his
       keys; the shop's own book and pen stand on its counter (World S) */
    function mkBook(parent) {
      const g = new THREE.Group(); g.visible = false; g.userData.dyn = true; parent.add(g);
      const cover = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.012, 0.31), M({ color: 0x2a3a5a, roughness: 0.6 })); cover.position.y = 0.006; g.add(cover);
      const [c, x] = sized(cnv, 1024, 640);
      const t = tex(done(THREE, c, false));
      const pages = new THREE.Mesh(new THREE.PlaneGeometry(0.44, 0.29), M({ map: t, roughness: 0.85 })); pages.rotation.x = -Math.PI / 2; pages.position.y = 0.0135; g.add(pages);
      return { g, pages, x, t, sig: '', pen: null };
    }
    /* draw a book only when what it shows changes */
    function bookDraw(B, o) {
      const sig = JSON.stringify([o.mode, o.wed == null ? -1 : Math.round(o.wed * 60), o.last || '', o.lastK == null ? -1 : Math.round(o.lastK * 60), o.n || 0]);
      if (sig === B.sig) return B.pen;
      B.sig = sig; B.pen = drawStockPages(B.x, o); B.t.needsUpdate = true;
      return B.pen;
    }
    /* a canvas pixel of a book's pages, in the world */
    function bookPoint(B, px, py) { _ffv2.set((px / 1024 - 0.5) * 0.44, (0.5 - py / 640) * 0.29, 0); B.pages.updateWorldMatrix(true, false); return B.pages.localToWorld(_ffv2.clone()); }
    function mkPen(parent) {
      const pen = new THREE.Group(); pen.visible = false; pen.userData.dyn = true; parent.add(pen);
      const b2 = new THREE.Mesh(new THREE.CylinderGeometry(0.0045, 0.004, 0.14, 8), M({ color: 0x1a2a6a, roughness: 0.3 })); pen.add(b2);
      const tip = new THREE.Mesh(new THREE.ConeGeometry(0.004, 0.014, 8), M({ color: 0xc8ccd0, roughness: 0.3, metalness: 0.85 })); tip.position.y = -0.077; tip.rotation.x = Math.PI; pen.add(tip);
      return pen;
    }
    /* the pen held to the page: its nib on `at` (a world point), its body running up and away along `dir` — out of a
       macro's frame toward the hand that holds it, which the frame never shows */
    const _fpu = new THREE.Vector3(0, 1, 0), _fpq = new THREE.Quaternion();
    function penAt(pen, at, dir, lift = 0) {
      const d = _ffv2.set(dir[0], dir[1], dir[2]).normalize();
      _fpq.setFromUnitVectors(_fpu, d); pen.quaternion.copy(_fpq);
      pen.parent.updateWorldMatrix(true, false);
      const w = at.clone().addScaledVector(d, 0.084 + lift);
      pen.position.copy(pen.parent.worldToLocal(w));
      pen.visible = true;
    }
    const fBook = mkBook(world), fPen = mkPen(world);
    /* the shop's book on its counter becomes a drawn one too (the opening's Wednesday, the coda's last line) */
    const sBook = (() => { if (!shop.ledger) return null; const B = mkBook(shop.ledger); B.g.visible = true; B.g.position.y = 0.0005;
      /* turned to read from HIS side of the counter (the film looks down at it over his shoulder; the drawn page's top is
         the book's −z, which faced him), and the first cover and page hidden under the drawn ones (two covers 0.5 mm apart
         fight for the rim) */
      shop.ledger.rotation.y = Math.PI + 0.06;
      for (const ch of shop.ledger.children.slice()) if (ch !== B.g && ch.isMesh) ch.visible = false;
      bookDraw(B, { mode: 'front' }); return B; })();
    /* the guava bag: a white plastic carrier, its handles knotted, green guavas showing through */
    const guava = (() => {
      const g = new THREE.Group(); g.visible = false; g.userData.dyn = true; world.add(g);
      const bag = new THREE.Mesh(new THREE.SphereGeometry(0.13, 14, 10), M({ color: 0xf2f2ee, roughness: 0.35, transparent: true, opacity: 0.62, depthWrite: false }));
      bag.scale.set(1, 1.15, 0.8); bag.position.y = -0.17; g.add(bag);
      const mG = M({ color: 0x8ab048, roughness: 0.55 });
      for (const [x, y, z] of [[-0.05, -0.22, 0.02], [0.05, -0.21, -0.02], [0.0, -0.13, 0.03], [-0.04, -0.1, -0.03], [0.05, -0.12, 0.02]]) {
        const s = new THREE.Mesh(new THREE.SphereGeometry(0.048, 12, 9), mG); s.position.set(x, y, z); s.scale.set(1, 1.12, 1); g.add(s); }
      for (const sx of [-1, 1]) { const h = new THREE.Mesh(new THREE.TorusGeometry(0.035, 0.008, 6, 12, Math.PI), M({ color: 0xf2f2ee, roughness: 0.4 })); h.position.set(sx * 0.02, -0.03, 0); h.rotation.y = sx * 0.4; g.add(h); }
      return g;
    })();
    /* the master's card (ending B): its front and its back */
    const card = (() => {
      const g = new THREE.Group(); g.visible = false; g.userData.dyn = true; world.add(g);
      const f = new THREE.Mesh(new THREE.PlaneGeometry(0.09, 0.055), M({ map: tex(makeMasterCard(THREE, cnv, false)), roughness: 0.8 })); g.add(f);
      const b = new THREE.Mesh(new THREE.PlaneGeometry(0.09, 0.055), M({ map: tex(makeMasterCard(THREE, cnv, true)), roughness: 0.8 })); b.rotation.y = Math.PI; b.position.z = -0.0005; g.add(b);
      return g;
    })();
    /* his keys (the coda): a steel ring, three keys, a plain brass fob */
    const keys = (() => {
      const g = new THREE.Group(); g.visible = false; g.userData.dyn = true;
      const mS = M({ color: 0xc8ccd0, roughness: 0.25, metalness: 0.9 }), mB = M({ color: 0xc8a048, roughness: 0.3, metalness: 0.85 });
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.016, 0.0018, 6, 18), mS); g.add(ring);
      [[0.02, -0.03, 0.3], [-0.006, -0.036, -0.1], [-0.026, -0.028, -0.5]].forEach(([x, y, r]) => {
        const k = new THREE.Mesh(new THREE.BoxGeometry(0.009, 0.046, 0.002), mS); k.position.set(x, y, 0); k.rotation.z = r; g.add(k); });
      const fob = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.01, 0.018, 10), mB); fob.position.set(0.002, -0.022, 0.006); g.add(fob);
      return g;
    })();
    /* ending C's reflection in the glass case (the coda): his own shape, dark, where a reflection of him would stand */
    cast.refl = mkPerson('e4pong', { parent: worldS, x: 1.0, z: -0.1, ry: 0, height: 1.72, sizeTake: 'Idle_9', walk: false,
      posture: 'stand', stand: 'Idle_9', hidden: true, noShadow: true, then: (P) => {
        const mm = new THREE.MeshBasicMaterial({ color: 0x0a0c10, transparent: true, opacity: 0.55, depthWrite: false }); mats.push(mm);
        P.model.traverse(m => { if (m.isMesh) m.material = mm; }); } });
    /* ending C's road: a woman at the stall across from the lane, who turns round as the pickup passes */
    cast.stall = mkPerson('e4joy', { parent: worldC, x: 44.5, z: 25.6, y: 0.8, ry: Math.PI, height: 1.58, sizeTake: 'Idle_9', walk: false,
      posture: 'stand', stand: 'Idle_9', hidden: true, noShadow: true, noMip: true });

    /* a person looking at the lens in a film: the look is the FILM's, so it is on at once (a seek or a skip lands on it —
       CP9, by photograph: a seek arrived before Pong's eased look had turned his head, and he talked to the ceiling) and
       the neck may turn as far as a seated man turns to the person beside him; off, he goes back to what he watched */
    function gaze(P, on) {
      if (!P) return;
      if (on) { P.lookAt = camera; P.neck = 1.25; P.lookW = 1; }
      else if (P.lookAt === camera) { P.lookAt = P.lookHome || null; P.neck = null; }
    }
    /* a thing held in his right hand, in the hands' own pass (kit.hold's place: the palm, noteProp's frame) */
    const PALM = [0.012, -0.052, -0.148], _hhv = new THREE.Vector3();
    function handHold(obj, o = {}) {
      const A = FL.api; if (!A || !A.armR) return;
      if (FL.hand && FL.hand !== obj) { A.armR.remove(FL.hand); FL.hand.visible = false; }
      if (!obj) { FL.hand = null; return; }
      if (obj.parent !== A.armR) { if (obj.parent) obj.parent.remove(obj); A.armR.add(obj); }
      obj.position.set(PALM[0] + (o.dx || 0), PALM[1] + (o.dy || 0), PALM[2] + (o.dz || 0));
      obj.rotation.set(o.rx || 0, o.ry || 0, o.rz || 0);
      /* a thing he LOOKS AT in his hand faces the lens (the card): its front turned onto the hands' camera, then tipped
         back by `tilt` and turned over by `flip` about its own upright (CP9, measured: held at a fixed turn in the arm's
         frame the card stood EDGE-ON to the lens — its face 87° off the line of sight — in every grip, and no photograph
         of either card shot ever showed it) */
      /* `lens`: placed from the PALM in the lens's own frame (metres: +x right, +y up, −z ahead), so a thing held up out
         of a closed hand stands where the screen needs it whichever grip and depth the hand is at */
      if (o.lens && A.vmCam) {
        A.armR.updateWorldMatrix(true, false); A.vmCam.updateMatrixWorld();
        const pw = A.vmCam.worldToLocal(A.armR.localToWorld(_hhv.set(PALM[0], PALM[1], PALM[2])));
        pw.x += o.lens[0]; pw.y += o.lens[1]; pw.z += o.lens[2];
        obj.position.copy(A.armR.worldToLocal(A.vmCam.localToWorld(pw)));
      }
      /* `screen`: [x, y, depth] — at that point of THIS screen (−1…1 across and up) that many metres from the lens: a
         thing he holds up to read stands where every screen shape sees it, just above the hand that holds it */
      if (o.screen && A.vmCam) {
        A.armR.updateWorldMatrix(true, false); A.vmCam.updateMatrixWorld();
        const [nx, ny, d] = o.screen, th = Math.tan(A.vmCam.fov * Math.PI / 360);
        _hhv.set(nx * d * th * A.vmCam.aspect, ny * d * th, -d);
        obj.position.copy(A.armR.worldToLocal(A.vmCam.localToWorld(_hhv)));
      }
      if (o.face && A.vmCam) {
        A.vmCam.updateMatrixWorld(); obj.lookAt(_hhv.setFromMatrixPosition(A.vmCam.matrixWorld));
        if (o.tilt) obj.rotateX(o.tilt);
        if (o.flip) obj.rotateY(o.flip);
      }
      obj.visible = true; FL.hand = obj;
      if (A.handsRoot) A.handsRoot.visible = true;
      A.armR.visible = true;
    }
    /* a thing held IN A GRIP (the card): the hand-pose library's closed grip, drawn at exactly k each frame it is wanted
       (a scene's own pose, api.handPose) — the walking hand has its index out, and a card held there read as a pointing
       hand beside a card (CP9, by photograph); `gripOff` writes the walking rest back once */
    function gripOn(p) { const A = FL.api; if (A && A.handPose) { A.handPose('place', 1, { p: p || 0 }); FL.grip = true; } }
    /* the card in the grip: on a phone the place-grip's forearm was a wall of skin across the frame with the card behind
       it (CP9, by photograph — a third of the width sees a hand at 35 cm as wider than the frame), so the grip goes lower
       and deeper by the pose's own variable, and the card is held up out of the fist at a point of the screen (handHold's
       `screen`). Answers that point. */
    /* (CP12, photographed on both screens: the grip at 1.6 is a closed fist with the thumb up on both, and the card
       stands just above it — on a phone low enough that Pa Noi's eyes stay over it at the door, on a desktop beside
       her face, both read whole in the cab and turned over to the flower on its back) */
    const CARD_N = { p: 1.6, phone: [0.0, -0.48, 0.30], desk: [0.2, -0.38, 0.36], tilt: -0.35 };
    function cardGrip() { gripOn(CARD_N.p); return isNarrow() ? CARD_N.phone : CARD_N.desk; }
    const cardTilt = () => CARD_N.tilt;
    function gripOff() { const A = FL.api; if (FL.grip && A && A.handPose) A.handPose(null, 0); FL.grip = false; }
    function handFree() {
      const A = FL.api;
      gripOff();
      if (FL.hand && A && A.armR) { A.armR.remove(FL.hand); FL.hand.visible = false; world.add(FL.hand); }
      FL.hand = null;
      /* a film shows his hands only while they hold something or make the wai */
      if (A && A.handsRoot && FL.key && !FL.wai) A.handsRoot.visible = false;
    }
    /* THE WAI in a film (A after the pao, D before he speaks and when the master returns it): the clasp risen from under
       the frame to play's own height (k 0 → 1). The arm's pose is kept and given back when it goes down, and the left
       hand put away, so the next thing he holds is held as before. */
    function waiAt(k) {
      const A = FL.api; if (!A || !A.handsPose || !A.armR) return;
      if (k <= 0.001) {
        if (FL.wai) {
          FL.wai = false;
          A.armR.position.copy(FL.waiPos); A.armR.quaternion.copy(FL.waiQ);
          const L = A.prayerArm && A.prayerArm(); if (L) L.visible = false;
          if (A.handsRoot && !FL.hand && FL.key) A.handsRoot.visible = false;
        }
        return;
      }
      if (!FL.wai) { FL.wai = true; FL.waiPos = A.armR.position.clone(); FL.waiQ = A.armR.quaternion.clone(); }
      if (A.handsRoot) A.handsRoot.visible = true;
      A.handsPose(0, 0, { y: lp(-0.72, -0.33, smo(k)) });
    }

    /* ---- the pickup on the road, by the film's clock: at (x, z), heading `ry`, on the road's dyke or the lane's slope */
    const PICK_Y = (x, z) => (z >= 17.6 && z <= 24.4) ? 0.8 : (z > 13.5 && z < 17.6 && Math.abs(x) < 3.8) ? (z - 13.5) / 4.1 * 0.8 : 0;
    function pickupAt(x, z, ry) {
      const pk = yard.pickup; if (!pk) return;
      const y = PICK_Y(x, z), fx = -Math.sin(ry), fz = -Math.cos(ry);
      const yF = PICK_Y(x + fx * 1.4, z + fz * 1.4), yB = PICK_Y(x - fx * 1.4, z - fz * 1.4);
      pk.position.set(x, y, z); pk.rotation.set(Math.atan2(yF - yB, 2.8), ry, 0, 'YXZ');
    }
    function pickupHome() { const pk = yard.pickup; if (pk) { pk.position.set(CMP.PICKUP.x, 0, CMP.PICKUP.z); pk.rotation.set(0, 0, 0); } }
    /* a drive along a path of (x, z) points, eased in and out between t0 and t1 */
    function driveAt(pts, t0, t1, t, o = {}) {
      const L = pathLen(pts), k = sgk(t, t0, t1), s = (o.linear ? k : o.easeOut ? 1 - (1 - k) * (1 - k) : o.easeIn ? k * k : smo(k)) * L;
      const a = pathAt(pts, s), f = pathAt(pts, Math.min(L, s + 1.2)), b = pathAt(pts, Math.max(0, s - 1.2));
      const ry = Math.atan2(-(f[0] - b[0]), -(f[1] - b[1]));
      pickupAt(a[0], a[1], ry);
      return { x: a[0], z: a[1], ry };
    }
    /* the eye of whoever sits in the passenger seat, and a point ahead of it, in the pickup's own frame */
    function cabEye(lx, ly, lz) { const pk = yard.pickup; pk.updateWorldMatrix(true, false); return pk.localToWorld(_ffv.set(lx, ly, lz)).toArray(); }

    /* ================================================================= THE OPENING FILM ("The Shutter", §4.0) */
    function openFrame(t) {
      const O = OPEN, S0 = SX;
      const shopAt = (x, y, z) => [S0 + x, y, z];
      if (t < O.o5) {
        /* ---- his shop, World S: the shutter going up, the cases, the book, the message */
        cabCtl.show(false);
        const lit = t < 1.6 ? 'SHOPDARK' : 'SHOP';
        fLook(lit, lit === 'SHOP' && t < 6.6 ? 5.0 : 0);
        shop.t1 = 0; shop.u = smo(sgk(t, 1.0, 7.6));                                  // the shutter: hauled up from outside the frame
        shop.l1 = 0; shop.ledK = t < 6.3 ? 0.02 : smo(sgk(t, 6.3, 6.8));               // the LEDs: his hand on the switch
        /* his phone: dark until the message, then lit and buzzing (the buzz read off the film's clock) */
        shop.phoneOn = t >= O.buzz ? wallNow() - (t - O.buzz) : 0; shop.phoneWho = 'pong';
        /* the book: the front pages, Wednesday's row written as the pen goes */
        const wedK = t < O.o3 + 0.6 ? 0 : sgk(t, O.o3 + 0.6, O.o3 + 4.2);
        const pen = sBook ? bookDraw(sBook, { mode: 'front', wed: t < O.o3 ? 1 : wedK }) : null;
        if (t < O.o2) {                                                                  // O1 · THE SHUTTER
          const k = sgk(t, 0, O.o2);
          /* low, on the shop floor in front of his counter, looking out at the shutter's foot: the bar of light under it
             runs across the floor toward the lens as it rises (CP9, by photograph: from behind the counter its top filled
             the lower half of a phone's frame and the light under the shutter never showed) */
          fLens(isNarrow() ? 62 : 54);
          camAt(lp3(shopAt(0.38, 0.9, -0.95), shopAt(0.32, 0.98, -0.6), k), shopAt(0.02, 0.55, 3.0));
        } else if (t < O.o2b) {                                                          // O2 · along the new cases
          /* along the right-hand case, its glass at x 1.95 from z −0.7 to 2.1: the aim stays on the case the whole way
             (CP9: it ran 0.5 m past the case's end and a phone's frame filled with the bare wall) */
          const k = smo(sgk(t, O.o2, O.o2b)), pz = lp(2.3, 0.45, k);
          fLens(isNarrow() ? 54 : 46);
          camAt(shopAt(lp(1.02, 1.16, k), lp(1.36, 1.28, k), pz), shopAt(1.95, lp(1.12, 0.98, k), pz - 0.72));
        } else if (t < O.o3) {                                                           // the carton, then the flowers by the door
          const k = smo(sgk(t, O.o2b, O.o3));
          fLens(isNarrow() ? 58 : 50);
          camAt(shopAt(0.72, 1.42, -0.55), lp3(shopAt(1.3, 0.36, 0.95), shopAt(-1.6, 1.22, 2.42), k));
        } else if (t < O.o3b) {                                                          // O3 · the book: Wednesday's row
          if (sBook && pen) {
            const n = bookPoint(sBook, pen[0], pen[1]);
            const k = sgk(t, O.o3, O.o3 + 0.6);
            fLens(isNarrow() ? 34 : 28);
            camAt([n.x + 0.04 - 0.02 * k, n.y + 0.26, n.z - 0.16], [n.x - 0.02, n.y, n.z + 0.03]);
            const lift = t > O.o3 + 4.2 ? 0.012 * smo(sgk(t, O.o3 + 4.2, O.o3 + 4.8)) : 0;
            const scr = shop.pen; if (scr) { scr.visible = true; penAt(scr, n, [-0.42, 0.78, -0.46], lift); }
          }
        } else if (t < O.o4b) {                                                          // the lens lifts to the corridor; the phone buzzes
          if (shop.pen) shop.pen.visible = false;
          const n = sBook && pen ? bookPoint(sBook, pen[0], pen[1]) : _ffv.set(S0, 1.05, -1.6);
          const k = smo(sgk(t, O.o3b, O.o3b + 2.4)), kd = smo(sgk(t, O.buzz + 0.15, O.o4b));
          fLens(lp(isNarrow() ? 34 : 28, isNarrow() ? 62 : 56, k));
          const p0 = [n.x + 0.02, n.y + 0.26, n.z - 0.16], p1 = shopAt(0.25, 1.52, -2.1);
          const q0 = [n.x - 0.02, n.y, n.z + 0.03], q1 = shopAt(0.1, 1.42, 7.0), q2 = shopAt(0.48, 1.06, -1.51);
          camAt(lp3(lp3(p0, p1, k), shopAt(0.4, 1.5, -2.04), kd), lp3(lp3(q0, q1, k), q2, kd));
        } else {                                                                         // O4 · the message
          const k = smo(sgk(t, O.o4b, O.o5));
          fLens(isNarrow() ? 50 : 42);
          camAt(lp3(shopAt(0.4, 1.5, -2.04), shopAt(0.42, 1.42, -1.92), k), shopAt(0.48, 1.06, -1.51));
        }
        if (t >= O.o3b && shop.pen) {                                                    // the pen back down on the counter
          shop.pen.position.set(0.09, COUNTER.h + 0.046 + 0.0048, COUNTER.z - 0.02); shop.pen.rotation.set(0, -0.5, Math.PI / 2); shop.pen.quaternion.setFromEuler(shop.pen.rotation);
        }
        return;
      }
      /* ---- the rice country, World C */
      shop.phoneOn = 0;
      if (t < O.o6) {
        fLook('ROAD');
        cabCtl.show(false);
        if (t < O.o5b) {
          /* O5 · the huge wide: from behind, the pickup small on the dyke road driving away into the storm wall — which
             stands toward +x in the panorama (its heart at u ≈ 0.5), 27° up at its base. The lens tilts up 9° so the
             paddies are the lower third and the storm the rest (CP9: the first cut looked south on a 15° lens at the
             horizon's sunset band, and no storm was in it) */
          const x = -110 + 6.2 * (t - O.o5), k = sgk(t, O.o5, O.o5b), cx = -130 + 3 * k;
          pickupAt(x, 19.6, -Math.PI / 2);
          fLens(isNarrow() ? 50 : 38);
          const dd = Math.hypot(x + 8 - cx, 6.9);
          camAt([cx, 1.9, 26.5], [x + 8, 1.9 + 0.16 * dd, 19.6]);
        } else {
          /* a tracking shot alongside it from beyond the far row of palms, low: the trunks cross close in front of the
             lens as it keeps pace (CP9: from 9 m without them the pickup filled a phone's frame side-on) */
          const x = -77 + 6.2 * (t - O.o5b);
          pickupAt(x, 19.6, -Math.PI / 2);
          /* a phone sees a third of the width: from 9 m on a 40° lens it held the pickup's tail wheel at its left edge and
             nothing else (CP9, by photograph) — so it stands back to 15 m, on the pickup's middle, and the palms of the far
             row cross between */
          if (isNarrow()) { fLens(54); camAt([x - 0.6, 1.3, 34.4], [x + 0.6, 1.5, 19.6]); }
          else { fLens(32); camAt([x - 1.5, 1.2, 28.6], [x + 3.0, 1.55, 19.6]); }
        }
        return;
      }
      /* ---- O6, O7 · in the pickup: Pong at the wheel; the spirit house; the turn onto the lane; the gate */
      fLook(t < O.o7 ? 'ROAD' : 'YARD0', t < O.o7 ? 0 : 3.0);
      cabCtl.show(true);
      /* Pong is at the wheel (pongCab): the yard's own Pong stands at the pickup's place for play, and would be waiting
         at the gate for himself (CP9, by photograph) — away until the film ends */
      if (cast.pong && cast.pong.group && cast.pong.group.visible) { cast.pong.group.visible = false; FL.hidPong = true; }
      cabCtl.drops(t < O.o6 + 1.0 ? 0 : 0.18 + 0.5 * sgk(t, O.o6 + 1.0, O.stop));
      let P;
      if (t < O.o7) P = driveAt([[-52, 19.6], [-1.2, 19.6]], O.o6, O.o7 + 9.0, t, { linear: true });
      else P = driveAt([[-1.2 + 4.86 * 0, 19.6], [-1.2, 19.6], [0.6, 18.6], [1.7, 17.0], [2.0, 15.4], [CMP.PICKUP.x, CMP.PICKUP.z]], O.o7, O.stop, t, { easeOut: true });
      if (t < O.o7) {
        /* along the road: the windscreen; Pong talking; the spirit house sliding past on his side */
        const tk = (t >= O.o6 + 3.4 && t < O.o6 + 7.4) ? smo(sgk(t, O.o6 + 3.4, O.o6 + 4.4)) * (1 - smo(sgk(t, O.o6 + 6.4, O.o6 + 7.4))) : 0;
        fLens(isNarrow() ? 66 : 60);
        /* the turn to Pong lands on his face (his head beside the lens, not the windscreen's corner ahead of it — CP9) */
        gaze(cast.pongCab, tk > 0.5);                                                 // (a glance across at him on "brother")
        const road = cabEye(-0.36, 1.36, -3.0), face = tk > 0 ? faceOf(cast.pongCab, cabEye(0.42, 1.42, 0.02)) : road;
        camAt(cabEye(-0.42, 1.5, 0.08), lp3(road, face, tk));
      } else {
        /* up the lane and stopped: the look goes through the gate's opening to the yard (CP9: straight ahead, the
           right-hand post stood in the middle of a phone's frame for the last five seconds) */
        fLens(isNarrow() ? 66 : 60);
        /* and he LEANS IN to look (CP9, by photograph: turned 11° to the gate from his seat, the A-pillar beside him stood
           7° left of a phone's centre, a black bar across the gate for five seconds; leaned 0.38 m forward and 0.12 m in,
           it is 23° off his line — out of a phone's ±16.7° and at a desktop's edge, where a pillar belongs) */
        const lk = smo(sgk(t, O.o7 + 2.0, O.o7 + 5.0));
        camAt(lp3(cabEye(-0.42, 1.5, 0.08), cabEye(-0.30, 1.46, -0.30), lk), lp3(cabEye(-0.28, 1.34, -3.0), cabEye(-1.25, 1.34, -4.0), lk));
      }
      void P;
    }

    /* ================================================================= THE ENDINGS (§4.7) and THE CODA (§4.8) */
    const ROOM_EYE = () => [RX + CMAT.x, RMC.EYE.y, CMAT.z];
    const MASTER_HEAD = () => headOf(cast.master, [RX + MASTER.x, 1.22, MASTER.z]);
    const PONG_HEAD = () => headOf(cast.pongR, [RX - 0.95, 0.88, -0.2]);
    const DOOR_STEP = [RDOOR.x, 0.5 + 1.62, RDOOR.z - 0.45];
    /* the room as the storm left it, and the people in it (a scene begins from the decision) */
    function roomAfter() {
      fLook('HUSH');
      roomCtl.tube(false); roomCtl.rain(0, 0.01); roomCtl.cup(1); roomCtl.clothShift(true); roomCtl.clock(false); roomCtl.smokeStraight(true);
    }
    /* a slow look round the room: the table's smoke (straight now), the cloth (still), the doorway (empty) */
    function lookRound(t, t0, eye) {
      const k = sgk(t, t0, t0 + 6.4), qs = [[RX + 0.0, 0.92, -1.22], [RX - 0.28, 0.46, -1.08], [RX + 2.06, 1.18, -2.5]];
      const q = k < 0.36 ? lp3(MASTER_HEAD(), qs[0], smo(k / 0.36)) : k < 0.66 ? lp3(qs[0], qs[1], smo((k - 0.36) / 0.3)) : lp3(qs[1], qs[2], smo((k - 0.66) / 0.34));
      camAt(eye, q);
    }
    /* the book in his hands for the ending's own line (A, D): a macro on the page, the pen writing it */
    function bookShot(t, t0, t1, at, line) {
      const B = fBook;
      B.g.visible = true; B.g.position.set(at[0], at[1], at[2]); B.g.rotation.set(0, at[3] || 0, 0);
      const ents = kit && kit.ledger ? kit.ledger.entries() : [];
      const k = sgk(t, t0 + 0.5, t1 - 1.1);
      const pen = bookDraw(B, { mode: 'back', entries: ents, n: ents.length, last: line, lastK: k, titleL: W.ledWho || 'Who is he?', titleR: W.ledSaw || 'What I saw' });
      if (!pen) return;
      const n = bookPoint(B, pen[0], pen[1]);
      fLens(isNarrow() ? 36 : 30);
      const ry = at[3] || 0, bx = Math.sin(ry), bz = Math.cos(ry);           // the book's own "toward him" (+z when it lies square to him)
      camAt([n.x + bx * 0.17 + bz * 0.02, n.y + 0.25, n.z + bz * 0.17 - bx * 0.02], [n.x - bx * 0.02, n.y, n.z - bz * 0.02]);
      penAt(fPen, n, [0.4 * bz + 0.46 * bx, 0.8, 0.46 * bz - 0.4 * bx], t > t1 - 1.1 ? 0.012 * smo(sgk(t, t1 - 1.1, t1 - 0.6)) : 0);
    }
    function bookAway() { fBook.g.visible = false; fPen.visible = false; }

    /* ---- A · STILL: he observes and decides nothing */
    function endA(t) {
      const T = END.A, it = play.item || 'takrut';
      waiAt(t < T.out ? smo(sgk(t, T.pao + 4.4, T.pao + 5.4)) * (1 - smo(sgk(t, T.bless + 2.6, T.bless + 3.4))) : 0);   // his wai after the pao, through the blessing
      if (t < T.out) {
        roomAfter();
        cabCtl.show(false);
        const eye = ROOM_EYE();
        if (t < T.pao) {                                                                   // his eyes down: his breath, the drips
          const k = smo(sgk(t, 0.3, 3.0)) * (1 - smo(sgk(t, 4.6, T.pao)));
          fLens(isNarrow() ? 64 : 58);
          camAt(eye, lp3(MASTER_HEAD(), [RX + 0.12, 0.08, -0.62], k));
        } else if (t < T.bless) {                                                          // the pao: three breaths onto his crown
          const k = smo(sgk(t, T.pao, T.bless));
          fLens(lp(isNarrow() ? 58 : 50, isNarrow() ? 50 : 42, k));
          camAt(lp3(eye, [RX + 0.02, 1.0, -0.22], k), MASTER_HEAD());
          cast.master.bow = t > T.pao + 5.0 && t < T.bless - 0.2 ? 0.42 : 0;
        } else if (t < T.look) {                                                           // the blessing, and Pong's word for the piece
          cast.master.bow = 0;
          const onPong = t > T.bless + 3.2 && t < T.bless + 12.0;
          fLens(isNarrow() ? 56 : 48);
          camAt(eye, onPong ? PONG_HEAD() : MASTER_HEAD());
          gaze(cast.pongR, onPong);
        } else if (t < T.book) {
          fLens(isNarrow() ? 60 : 54);
          lookRound(t, T.look, eye);
        } else {
          bookShot(t, T.book, T.out, [RX + 0.04, 0.012, -0.34, 0], W.endAline || "I don't know what I saw.");
        }
        return;
      }
      bookAway();
      if (t < T.walk) {                                                                    // outside: the washed yard; Pa Noi and her guavas
        fLook('AFTER');
        cabCtl.show(false);
        const P = cast.noi, nx = RDOOR.x - 0.35, nz = RDOOR.z + 1.15;
        fPut(P, nx, nz, faceTo(nx, nz, DOOR_STEP[0], DOOR_STEP[2]));
        gaze(P, t > T.out + 1.2);                                                        // she looks at him to give them (CP9: her eyes were on her hands)
        const k = smo(sgk(t, T.out + 0.2, T.out + 2.4));                               // the washed yard, then her (before she speaks)
        fLens(isNarrow() ? 58 : 50);
        camAt(DOOR_STEP, lp3([2.0, 1.1, 5.0], headOf(P, [nx, 1.5, nz]), k));
        /* the bag: in her hand; held out to him; taken below the frame (a man carrying a bag at his side does not see it —
           CP9, by photograph: held up in the viewmodel it floated beside a pointing hand) */
        const give = T.out + 8.8;
        handFree();
        const h = handOf(P, /RightHand(_\d+)?$/);
        if (t < give && h) { guava.visible = true; guava.position.copy(h); guava.rotation.set(0, 0, 0); }
        else if (t < give + 0.9 && h) {
          const g = smo(sgk(t, give, give + 0.9));
          guava.visible = true; guava.rotation.set(0, 0, 0);
          guava.position.set(lp(h.x, DOOR_STEP[0] + 0.18, g), lp(h.y, DOOR_STEP[1] - 1.05, g), lp(h.z, DOOR_STEP[2] + 0.28, g));
        } else guava.visible = false;
        if (t > T.out + 7.6 && t < T.out + 7.7 && !P.one) personDo(P, 'Checkout_Gesture');
        return;
      }
      if (t < T.cab) {                                                                     // across the yard to the gate, Pong ahead
        fLook('AFTER');
        handFree(); guava.visible = false;
        const path = [[RDOOR.x, RDOOR.z + 1.0], [6.2, -1.6], [4.3, 2.0], [2.8, 5.6], [2.4, 8.6]];
        const k = sgk(t, T.walk, T.cab), L = pathLen(path), a = pathAt(path, smo(k) * L), f = pathAt(path, Math.min(L, smo(k) * L + 3.0));
        const bob = Math.sin((t - T.walk) * 7.2) * 0.014;
        fLens(isNarrow() ? 62 : 56);
        fWalk(cast.pong, [[RDOOR.x - 0.2, RDOOR.z + 2.6], [5.6, 0.0], [3.6, 3.6], [2.4, 7.4], [2.7, 10.4]], T.walk, T.cab + 0.4, t);
        if (cast.pong && t > T.walk + 0.5 && t < T.walk + 5.6) cast.pong.lookAt = null;
        /* while he says "See? I tell you..." the eyes are on Pong ahead (CP9, by photograph: on the path's own line he
           walked at a phone's left edge, a shoulder and nothing else, for the whole of his line) */
        const ph = headOf(cast.pong, null), on = ph ? smo(sgk(t, T.walk + 0.2, T.walk + 1.0)) * (1 - smo(sgk(t, T.walk + 4.4, T.walk + 5.4))) : 0;
        camAt([a[0], groundAt(a[0], a[1]) + 1.62 + bob, a[1]], on > 0 ? lp3([f[0], 1.5, f[1]], [ph[0], ph[1] - 0.1, ph[2]], on) : [f[0], 1.5, f[1]]);
        return;
      }
      handFree();
      if (t < T.wide) {                                                                    // in the pickup, up the lane: "Strong, right?" / "...Maybe."
        fLook('AFTER');
        cabCtl.show(true); cabCtl.drops(0.22);
        driveAt([[2.0, 13.4], [1.8, 16.0], [0.4, 18.6], [-2.6, 20.2], [-12, 22.4]], T.cab, T.wide + 1.4, t, { easeIn: true });
        const tk = (t > T.cab + 0.4 && t < T.cab + 4.6) ? smo(sgk(t, T.cab + 0.4, T.cab + 1.1)) * (1 - smo(sgk(t, T.cab + 3.9, T.cab + 4.6))) : 0;
        gaze(cast.pongCab, tk > 0.5);
        fLens(isNarrow() ? 66 : 60);
        camAt(cabEye(-0.42, 1.5, 0.08), lp3(cabEye(-0.32, 1.36, -3.0), faceOf(cast.pongCab, cabEye(0.42, 1.42, 0.02)), tk));
        return;
      }
      if (t < T.coda) {                                                                    // the wide: the dyke road into the gold seam
        fLook('AFTER');
        cabCtl.show(false);
        /* from the road's edge behind it, the pickup away down the dyke road into the gold seam at the horizon (the
           panorama's −x is where the low sun is); the palms line the right of the frame (CP9: from the yard on a long
           lens its side filled a phone's frame) */
        const x = -14 - 6.0 * (t - T.wide);
        pickupAt(x, 22.4, Math.PI / 2);
        fLens(isNarrow() ? 40 : 32);
        camAt([-7.0, 2.1, 25.6], [x - 24, 2.0, 22.0]);
        return;
      }
      codaFrame(t - T.coda, 'A');
    }

    /* ---- B · THE QUESTION: he asks, and is seen */
    function endB(t) {
      const T = END.B;
      if (t < T.card) {
        roomAfter();
        cabCtl.show(false);
        const eye = ROOM_EYE();
        herCtl.at('door'); herCtl.show(t > T.look && t < T.pong + 2.0);
        const toMaster = (t > T.ask + 3.4 && t < T.look) || (t > T.pong + 9.0 && t < T.come + 3.8);
        const toHim = t < T.ask + 3.4 || (t >= T.pong && t <= T.pong + 9.0) || (t >= T.come + 3.8 && t < T.come + 10.0);
        if (cast.pongR) { if (toMaster) { cast.pongR.lookAt = cast.master.head || null; cast.pongR.neck = null; } else if (toHim) gaze(cast.pongR, true); else { gaze(cast.pongR, false); cast.pongR.lookAt = null; } }
        if (t < T.ask) {                                                                   // to Pong, low
          fLens(isNarrow() ? 56 : 48);
          camAt(eye, PONG_HEAD());
        } else if (t < T.look) {                                                           // Pong startled; then he asks the master in Thai
          const k = smo(sgk(t, T.ask + 3.0, T.ask + 4.2));
          fLens(isNarrow() ? 58 : 50);
          camAt(eye, lp3(PONG_HEAD(), MASTER_HEAD(), k));
        } else if (t < T.pong) {                                                           // the master does not turn round: a long look, then his answer
          const k = smo(sgk(t, T.look, T.look + 6.0)), fov = lp(isNarrow() ? 54 : 46, isNarrow() ? 44 : 34, k);
          fLens(fov);
          /* he looks at the client a long time; the client's eyes go past him to the doorway and come back. The glance
             puts the doorway three quarters of the way to the frame's edge on THIS screen — where she is seen and only
             there (her look) — so on a phone, whose frame is a third as wide, the master leaves it for the glance (CP9,
             by photograph: on a phone the doorway never came into the frame and she was never seen) */
          const mh = MASTER_HEAD(), e0 = lp3(eye, [RX + 0.0, 1.0, -0.3], k);
          const dr = [RX + RMC.HER.door.x, 1.42, RMC.HER.door.z];
          const half = Math.atan(Math.tan(THREE.MathUtils.degToRad(fov) / 2) * innerWidth / Math.max(1, innerHeight));
          const bm = Math.atan2(mh[0] - e0[0], mh[2] - e0[2]), bd = Math.atan2(dr[0] - e0[0], dr[2] - e0[2]);
          const ba = bd - Math.sign(angTo(bm, bd)) * 0.75 * half, rr = Math.hypot(dr[0] - e0[0], dr[2] - e0[2]);
          const toDoor = [e0[0] + Math.sin(ba) * rr, lp(mh[1], dr[1], 0.5), e0[2] + Math.cos(ba) * rr];
          const g = smo(sgk(t, T.look + 6.2, T.look + 7.6)) * (1 - smo(sgk(t, T.look + 9.4, T.look + 10.6)));
          camAt(e0, lp3([mh[0], mh[1] - 0.02, mh[2]], toDoor, g));
        } else if (t < T.who) {                                                            // Pong, uneasy
          fLens(isNarrow() ? 56 : 48);
          camAt(eye, PONG_HEAD());
        } else {                                                                           // who taught him? "...Nobody." Come back. "Maybe another time."
          const onPong = (t > T.who + 1.8 && t < T.who + 5.2) || (t > T.come + 3.8 && t < T.come + 10.0);
          fLens(isNarrow() ? 52 : 44);
          camAt(eye, onPong ? PONG_HEAD() : MASTER_HEAD());
        }
        return;
      }
      herCtl.show(false);
      if (cast.pongR) cast.pongR.lookAt = null;
      if (t < T.cab) {                                                                     // at the door: Pa Noi and the master's card
        fLook('AFTER');
        cabCtl.show(false);
        const P = cast.noi, nx = RDOOR.x - 0.3, nz = RDOOR.z + 1.05;
        fPut(P, nx, nz, faceTo(nx, nz, DOOR_STEP[0], DOOR_STEP[2]));
        gaze(P, true);                                                                   // "Ajahn say, call anytime, ka." — to him
        fLens(isNarrow() ? 56 : 48);
        const give = T.card + 4.0;
        if (t < give) {
          handFree();
          const h = handOf(P, /RightHand(_\d+)?$/); if (h) { card.visible = true; card.position.copy(h); card.position.y += 0.03; card.lookAt(DOOR_STEP[0], DOOR_STEP[1], DOOR_STEP[2]); }
          camAt(DOOR_STEP, headOf(P, [nx, 1.5, nz]));
          if (t > T.card + 2.4 && t < T.card + 2.5 && !P.one) personDo(P, 'Checkout_Gesture');
        } else {
          const lift = cardGrip();
          handHold(card, { screen: lift, face: true, tilt: cardTilt() });
          camAt(DOOR_STEP, [DOOR_STEP[0] - 0.6, 1.2, DOOR_STEP[2] + 3.2]);
        }
        return;
      }
      if (t < T.wide) {                                                                    // in the pickup: Pong thrilled; he turns the card over
        fLook('AFTER');
        cabCtl.show(true); cabCtl.drops(0.18);
        driveAt([[2.0, 13.4], [1.8, 16.0], [0.6, 18.4], [3.0, 19.8], [30, 19.6]], T.cab, T.wide + 3.0, t, { easeIn: true });
        const flip = smo(sgk(t, T.cab + 6.0, T.cab + 7.6));
        const lift = cardGrip();
        handHold(card, { screen: lift, face: true, tilt: cardTilt() - 0.25 * Math.sin(flip * Math.PI), flip: flip * Math.PI });
        const onPong = t < T.cab + 5.2;
        gaze(cast.pongCab, onPong);
        fLens(isNarrow() ? 66 : 60);
        /* off Pong: his eyes down to the card in his hand, the road still in the top of the frame */
        camAt(cabEye(-0.42, 1.5, 0.08), onPong ? faceOf(cast.pongCab, cabEye(0.42, 1.42, 0.02)) : cabEye(-0.36, 1.18, -1.6));
        return;
      }
      handFree();
      if (t < T.coda) {                                                                    // the wide: the pickup away along the dyke
        fLook('AFTER');
        cabCtl.show(false);
        /* from the crown of the road behind it, the pickup going away east between the two rows of palms toward what is
           left of the storm (CP9, by photograph: from the verge by the shelter its posts and a palm trunk stood in the
           middle of a phone's frame and the pickup went behind them) */
        const x = 4 + 6.0 * (t - T.wide), k = sgk(t, T.wide, T.coda);
        pickupAt(x, 19.6, -Math.PI / 2);
        fLens(isNarrow() ? 40 : 28);
        camAt([lp(-4.0, -2.5, k), 1.75, 20.9], [x + 10, 1.6, 19.9]);
        return;
      }
      codaFrame(t - T.coda, 'B');
    }

    /* ---- C · CERTAIN: fear decides first */
    function endC(t) {
      const T = END.C;
      if (kit && kit.chill) kit.chill(t < T.car ? 0.45 * (1 - sgk(t, T.calm, T.pong)) + 0.25 : t < T.coda ? 0.18 : 0, { secs: 0.01, cine: true });
      if (t < T.out) {
        roomAfter();
        cabCtl.show(false);
        const eye = ROOM_EYE(), roll = t < T.up ? 0.018 * Math.sin(t * 0.9) : 0;
        herCtl.at('door'); herCtl.show(t > 2.6 && t < 5.5);
        if (t < 2.2) {                                                                     // the bowl
          fLens(isNarrow() ? 36 : 30);
          const k = smo(sgk(t, 0, 2.2));
          camAt(lp3(eye, [RX - 0.2, 0.86, -0.62], k), [RX - 0.28, 0.44, -1.08], roll);
        } else if (t < 3.6) {                                                              // the shadow on the wall
          fLens(isNarrow() ? 44 : 36);
          const side = isNarrow() ? 0.9 : 1.15;
          camAt(eye, [RX - side + 0.5, 1.62, RM.z0], roll);
        } else if (t < 5.3) {                                                              // and her, at the edge of the doorway
          /* the doorway three quarters of the way to the frame's edge on THIS screen, where she is seen (her look) —
             on a phone the shadow and the door are never in one frame, so they are two cuts (CP9, by photograph) */
          const fov = isNarrow() ? 44 : 36; fLens(fov);
          const half = Math.atan(Math.tan(THREE.MathUtils.degToRad(fov) / 2) * innerWidth / Math.max(1, innerHeight));
          const dr = [RX + RMC.HER.door.x, 1.42, RMC.HER.door.z], bd = Math.atan2(dr[0] - eye[0], dr[2] - eye[2]);
          const bm = Math.atan2(-eye[0] + RX, RM.z0 - eye[2]), ba = bd - Math.sign(angTo(bm, bd)) * 0.75 * half, rr = Math.hypot(dr[0] - eye[0], dr[2] - eye[2]);
          camAt(eye, [eye[0] + Math.sin(ba) * rr, 1.42, eye[2] + Math.cos(ba) * rr], roll);
        } else if (t < T.up) {                                                             // the master — "He's doing something to me."
          fLens(lp(isNarrow() ? 40 : 34, isNarrow() ? 34 : 28, sgk(t, 5.3, T.up)));
          camAt(eye, MASTER_HEAD(), roll);
        } else if (t < T.calm) {                                                           // up too fast; the cup goes over
          const k = smo(sgk(t, T.up, T.up + 0.9));
          fLens(isNarrow() ? 64 : 58);
          camAt([RX + 0.0, lp(1.0, 1.62, k), lp(0.0, 0.25, k)], lp3(MASTER_HEAD(), [RX + 0.06, 0.4, -1.03], smo(sgk(t, T.up + 0.6, T.up + 1.4))), 0.03 * Math.sin(k * Math.PI));
          if (room.cup) room.cup.rotation.z = -1.45 * smo(sgk(t, T.up + 0.6, T.up + 1.0));
        } else if (t < T.pong) {                                                           // the master stops, surprised, calm
          fLens(isNarrow() ? 56 : 48);
          camAt([RX + 0.0, 1.62, 0.25], MASTER_HEAD());
        } else {                                                                           // Pong, awkward; he backs to the door
          const k = smo(sgk(t, T.pong + 2.8, T.out));
          gaze(cast.pongR, k < 0.5);
          fLens(isNarrow() ? 60 : 54);
          camAt([RX + lp(0.0, R_ARRIVE.x - RX, k), 1.62, lp(0.25, R_ARRIVE.z, k)], k < 0.5 ? PONG_HEAD() : MASTER_HEAD());
        }
        return;
      }
      herCtl.show(false);
      if (room.cup) room.cup.rotation.z = 0;
      if (t < T.road) {                                                                    // across the yard in the last of the rain; Pa Noi calls after him
        fLook('YARD2');
        if (kit && kit.rain) kit.rain(0.25, 0.01);
        if (t < T.car) {
          cabCtl.show(false);
          const P = cast.noi; fPut(P, RDOOR.x - 0.2, RDOOR.z + 0.6, faceTo(RDOOR.x, RDOOR.z, 3, 6));
          gaze(P, true);                                                                 // she watches him go, and calls after him
          if (t > T.out + 3.2 && t < T.out + 3.3 && !P.one) personDo(P, 'Wave_One_Hand');
          const path = [[RDOOR.x, RDOOR.z + 1.3], [6.0, -1.0], [4.0, 3.0], [2.6, 7.4], [2.4, 10.6]];
          const k = sgk(t, T.out, T.car), L = pathLen(path), a = pathAt(path, k * L), f = pathAt(path, Math.min(L, k * L + 3.0));
          const back = t > T.out + 3.6 && t < T.out + 6.4;
          const bob = Math.sin((t - T.out) * 9.5) * 0.02;
          fLens(isNarrow() ? 64 : 58);
          camAt([a[0], groundAt(a[0], a[1]) + 1.62 + bob, a[1]], back ? headOf(P, [RDOOR.x, 1.6, RDOOR.z]) : [f[0], 1.45, f[1]]);
          fPut(cast.pong, 2.6, 9.4, faceTo(2.6, 9.4, a[0], a[1]));
        } else {                                                                           // at the pickup: Pong catches up — "Just drive."
          cabCtl.show(true); cabCtl.drops(0.5);
          pickupAt(CMP.PICKUP.x, CMP.PICKUP.z + 0.4, Math.PI);
          fLens(isNarrow() ? 64 : 58);
          gaze(cast.pongCab, t < T.car + 4.4);
          camAt(cabEye(-0.42, 1.5, 0.08), t < T.car + 4.4 ? faceOf(cast.pongCab, cabEye(0.42, 1.42, 0.02)) : cabEye(-0.3, 1.32, -3.0));
        }
        return;
      }
      if (t < T.coda) {                                                                    // the road: every dark shape is her — and a woman at a stall is only a woman at a stall
        fLook('YARD2');
        if (kit && kit.rain) kit.rain(0.18, 0.01);
        cabCtl.show(true); cabCtl.drops(0.55);
        const pos = driveAt([[2.0, 13.6], [1.8, 16.2], [0.8, 18.5], [3.2, 19.8], [70, 19.6]], T.road, T.coda + 2.0, t, { easeIn: true });
        const S = cast.stall; if (S && S.ready) {
          fPut(S, 44.5, 25.6, Math.PI + 3.0 * smo(sgk(pos.x, 34, 41)) * 0.33 * 3, { y: 0.8 });
          S.group.rotation.y = lp(Math.PI, Math.PI * 2 - 0.2, smo(sgk(pos.x, 33, 40)));
        }
        const look = pos.x > 30 && pos.x < 50 ? smo(sgk(pos.x, 30, 36)) * (1 - smo(sgk(pos.x, 46, 50))) : 0;
        const sh = headOf(S, [44.5, 2.3, 25.6]);
        /* level on the road, a little long: the dash is a band at the foot of the frame, not half of it (CP9, by
           photograph: aimed down on a wide lens, a phone's frame was 45 % black dashboard) */
        fLens(lp(isNarrow() ? 54 : 52, isNarrow() ? 40 : 32, look));
        const eyeW = cabEye(-0.42, 1.5, 0.08), ahead = cabEye(-0.3, 1.5, -3.0);
        camAt(eyeW, lp3(ahead, sh, look));
        return;
      }
      if (kit && kit.rain) kit.rain(0, 0.01);
      codaFrame(t - T.coda, 'C');
    }

    /* ---- D · ENOUGH: he knows when to go */
    function endD(t) {
      const T = END.D;
      const w1 = smo(sgk(t, T.ask - 0.6, T.ask + 0.3)) * (1 - smo(sgk(t, T.ask + 5.6, T.ask + 6.4)));
      const w2 = smo(sgk(t, T.nod + 2.2, T.nod + 3.0)) * (1 - smo(sgk(t, T.out - 1.2, T.out - 0.5)));
      waiAt(t < T.out ? Math.max(w1, w2) : 0);                                               // his wai, and his answer to the master's
      if (t < T.out) {
        roomAfter();
        cabCtl.show(false);
        const eye = ROOM_EYE();
        cast.master.look = t < T.ask ? 0 : 1;                                              // his eyes shut while he finishes the chant
        cast.master.bow = t < T.ask - 0.8 ? 0.26 : t < T.nod + 2.8 ? 0 : cast.master.bow; // (the scan's eyes cannot close: his head is bowed over it)
        if (t < T.ask) {
          fLens(lp(isNarrow() ? 50 : 42, isNarrow() ? 46 : 38, sgk(t, 0, T.ask)));
          camAt(eye, MASTER_HEAD());
        } else if (t < T.nod) {                                                            // to Pong, then Pong to the master
          const onPong = t < T.ask + 7.2;
          if (cast.pongR) { if (onPong) gaze(cast.pongR, true); else { cast.pongR.neck = null; cast.pongR.lookAt = cast.master.head || null; } }
          fLens(isNarrow() ? 56 : 48);
          camAt(eye, onPong ? PONG_HEAD() : MASTER_HEAD());
        } else {                                                                           // the master, unoffended, returns the wai
          if (cast.pongR) cast.pongR.lookAt = null;
          fLens(isNarrow() ? 52 : 44);
          camAt(eye, MASTER_HEAD());
          cast.master.bow = t > T.nod + 2.8 && t < T.out - 0.4 ? 0.45 : 0;
        }
        return;
      }
      cast.master.bow = 0;
      if (t < T.shelter) {                                                                 // outside: "Finish already?" — "Let's sit for a bit."
        fLook('AFTER');
        cabCtl.show(false);
        const C0 = [RDOOR.x - 1.0, RDOOR.z + 3.4], t1 = T.out + 6.0;
        if (t < t1) {
          /* at the foot of the steps he turns back to the door: Pong comes out after him and stops on the bottom step */
          fWalk(cast.pong, [[RDOOR.x, RDOOR.z + 0.6], [RDOOR.x - 0.3, RDOOR.z + 1.5], [RDOOR.x - 0.5, RDOOR.z + 2.1]], T.out + 0.3, T.out + 2.4, t, { ry: faceTo(RDOOR.x - 0.5, RDOOR.z + 2.1, C0[0], C0[1]) });
          gaze(cast.pong, t > T.out + 2.0);
          fLens(isNarrow() ? 58 : 52);
          camAt([C0[0], groundAt(C0[0], C0[1]) + 1.62, C0[1]], headOf(cast.pong, [RDOOR.x - 0.5, 1.6, RDOOR.z + 2.1]));
          return;
        }
        gaze(cast.pong, false);
        const path = [C0, [5.2, 0.6], [3.6, 4.4], [3.0, 7.8], [4.6, 11.4]];
        const k = sgk(t, t1, T.shelter), L = pathLen(path), a = pathAt(path, smo(k) * L), f = pathAt(path, Math.min(L, smo(k) * L + 3.0));
        fWalk(cast.pong, [[RDOOR.x - 0.5, RDOOR.z + 2.1], [5.6, 0.2], [3.9, 3.8], [3.1, 7.2], [4.4, 10.8]], t1 + 0.6, T.shelter + 0.6, t);
        const bob = Math.sin((t - t1) * 6.8) * 0.012;
        fLens(isNarrow() ? 62 : 56);
        camAt([a[0], groundAt(a[0], a[1]) + 1.62 + bob, a[1]], [f[0], 1.5, f[1]]);
        return;
      }
      if (t < T.dusk) {                                                                    // the roadside shelter: the compound's lights across the wet paddy
        fLook(t < T.shelter + 9.0 ? 'AFTER' : 'YARD0', 6.0);
        cabCtl.show(false);
        const S1 = CMP.SHELTER;
        fPut(cast.pong, S1.x + 0.5, S1.z + 0.3, Math.PI, { y: 0.04, seated: true });
        const eye = [S1.x - 0.42, 0.48 + 0.78, S1.z + 0.36];
        if (t < T.shelter + 11.4) {
          const onPong = (t > T.shelter + 1.4 && t < T.shelter + 7.2);
          gaze(cast.pong, onPong);
          fLens(isNarrow() ? 60 : 52);
          camAt(eye, onPong ? headOf(cast.pong, [S1.x + 0.5, 1.2, S1.z + 0.3]) : [S1.x - 2.0, 1.4, -6.0]);
        } else {
          bookShot(t, T.shelter + 11.4, T.dusk, [S1.x - 0.4, 0.86, S1.z + 0.08, 0], W.endDline || "Some things I don't need to understand today.");
        }
        return;
      }
      bookAway();
      if (t < T.coda) {                                                                    // the dusk: Pong beside him watching the sky clear; the lens goes up into it
        /* from his seat, never from outside (a shot of the shelter from the road showed Pong alone under it — there is
           no body of his to put beside him — CP9): Pong first, his face up to the clearing sky, then the lens turns
           out over the compound and rises into the gold over its roofs while the line is said */
        fLook('YARD0', 4.0);
        cabCtl.show(false);
        const S1 = CMP.SHELTER, eye = [S1.x - 0.42, 0.48 + 0.78, S1.z + 0.36];
        fPut(cast.pong, S1.x + 0.5, S1.z + 0.3, Math.PI, { y: 0.04, seated: true });
        cast.pong.lookAt = DUSK_SKY.set(S1.x - 1.5, 7.0, S1.z - 22); cast.pong.neck = null; cast.pong.lookW = 1;
        const k = smo(sgk(t, T.dusk + 2.6, T.dusk + 7.4));
        fLens(lp(isNarrow() ? 54 : 46, isNarrow() ? 48 : 40, k));
        camAt(eye, lp3(headOf(cast.pong, [S1.x + 0.5, 1.2, S1.z + 0.3]), [S1.x - 1.2, 4.6, S1.z - 9.0], k));
        return;
      }
      codaFrame(t - T.coda, 'D');
    }

    /* ---- THE CODA: the taxi home, the shutter again, and the ending's own last image */
    function codaFrame(t, k) {
      bookAway();
      cabCtl.show(false);
      herCtl.show(false);
      if (kit && kit.chill && k === 'C') kit.chill(t < CODA.k3 ? 0.12 : 0, { secs: 0.01, cine: true });
      if (t < CODA.k2) {                                                                   // K1 · the taxi in the rain
        fLook('TAXI');
        /* the rain on his window and the city in it; then through the gap between the front seats to the windscreen, the
           wipers and the meter while he cannot find the unit's number; then the window again for "When I got back..."
           (CP9, by photograph: the turn ended on the back of the driver's seat and held it) */
        const T0 = TX, kk = smo(sgk(t, 1.0, 3.2)) * (1 - smo(sgk(t, 7.2, 9.0)));
        fLens(isNarrow() ? 60 : 54);
        /* a phone's third of the frame, turned to the front, held the back of the driver's seat and a headrest in the dark
           (CP9, by photograph): it leans a little to the middle and looks higher, over the seats onto the windscreen */
        if (isNarrow()) camAt(lp3([T0 - 0.36, 1.14, 0.5], [T0 - 0.2, 1.18, 0.42], kk), lp3([T0 - 1.2, 1.12, 0.3], [T0 + 0.28, 1.38, -2.6], kk));
        else camAt([T0 - 0.36, 1.14, 0.5], lp3([T0 - 1.2, 1.12, 0.3], [T0 + 0.22, 1.3, -2.6], kk));
        return;
      }
      /* K2 · the shutter again, in grey light; his keys in his hand while the other pats his pocket */
      const S0 = SX;
      if (t < CODA.k3) {
        fLook('GREY');
        shop.t1 = 0; shop.u = smo(sgk(t, CODA.k2 + 0.4, CODA.k2 + 4.8)); shop.l1 = 0; shop.ledK = t < CODA.k2 + 3.0 ? 0.02 : 0.7;
        shop.phoneOn = 0;
        if (sBook) bookDraw(sBook, { mode: 'front' });
        /* the bookend of O1: the same place low on the floor, the same shutter rising — in grey light now; then a cut to
           him at his counter, the keys in his hand, looking down at the book while the other hand pats a pocket */
        if (t < CODA.k2 + 4.2) {
          fLens(isNarrow() ? 62 : 54);
          camAt(lp3([S0 + 0.38, 0.9, -0.95], [S0 + 0.32, 0.98, -0.6], smo(sgk(t, CODA.k2, CODA.k2 + 4.2))), [S0 + 0.02, 0.55, 3.0]);
          handFree();
        } else {
          fLens(isNarrow() ? 58 : 50);
          camAt([S0 + 0.3, 1.55, -2.25], [S0 + 0.12, 1.02, -1.45]);
          handHold(keys, { dx: 0.0, dy: 0.0, rx: -0.4, rz: 0.3 });
        }
        return;
      }
      handFree();
      fLook('GREY');
      shop.t1 = 0; shop.u = 1; shop.l1 = 0; shop.ledK = 0.7;
      if (k === 'A' || k === 'D') {                                                        // the book on the counter, open at his line
        const line = k === 'A' ? (W.endAline || "I don't know what I saw.") : (W.endDline || "Some things I don't need to understand today.");
        const ents = kit && kit.ledger ? kit.ledger.entries() : [];
        const pen = sBook ? bookDraw(sBook, { mode: 'back', entries: ents, n: ents.length, last: line, lastK: 1, titleL: W.ledWho || 'Who is he?', titleR: W.ledSaw || 'What I saw' }) : null;
        if (pen) {
          const kk = smo(sgk(t, CODA.k3, CODA.black));
          if (isNarrow()) {
            /* a phone holds the WHOLE line: aimed at its middle (the hand writes ~7.7 page pixels a letter) and drawn back
               until it fits a third of a desktop's width — CP9, by photograph: the push-in cut "I don't know what I saw."
               to "I don't know what I s" at the last image of the chapter, and D's longer line never fitted at all */
            const n = bookPoint(sBook, pen[0] - line.length * 3.9, pen[1]);
            const f = Math.max(1, 0.0262 * line.length / 0.405 * (0.462 / Math.max(0.3, camera.aspect)));
            fLens(40);
            camAt([n.x, n.y + (0.34 - 0.02 * kk) * f, n.z + (-0.22 + 0.015 * kk) * f], [n.x, n.y, n.z + 0.02]);
          } else {
            const n = bookPoint(sBook, pen[0] - 140, pen[1]);
            fLens(lp(34, 28, kk));
            camAt([n.x + 0.0, n.y + 0.34 - 0.06 * kk, n.z - 0.22 + 0.04 * kk], [n.x, n.y, n.z + 0.02]);
          }
        }
      } else if (k === 'B') {                                                              // his phone lights: the Ajahn
        shop.phoneOn = wallNow() - (t - CODA.k3 - 0.6); shop.phoneWho = 'ajahn';
        fLens(isNarrow() ? 50 : 42);
        camAt([S0 + 0.42, 1.42, -1.92], [S0 + 0.48, 1.06, -1.51]);
      } else {                                                                             // C · the glass case, and a shape in it
        const R = cast.refl, gx = 1.95, ez = 0.6, ex = 0.95;
        if (R && R.ready) { fPut(R, gx + (gx - ex) + 0.02, ez - 0.05, -Math.PI / 2, { y: 0 }); R.group.visible = t > CODA.k3 + 0.6 && t < CODA.k3 + 2.3; }
        const flinch = t > CODA.k3 + 1.5 ? Math.exp(-(t - CODA.k3 - 1.5) * 4) * Math.sin((t - CODA.k3 - 1.5) * 30) * 0.03 : 0;
        fLens(isNarrow() ? 54 : 46);
        camAt([S0 + ex, 1.6 + flinch, ez], [S0 + gx, 1.45, ez + 0.4], flinch * 0.6);
      }
    }

    const films = {
      begin(key, c, api) {
        FL.key = key; FL.lit = ''; FL.api = api; FL.stings = (c && c.stings) || [];
        /* his hands are not in the films (but for what he holds and his wai) — and nothing else gives them back after one
           (chapter 4's law), so end() does */
        if (api && api.handsRoot) { FL.hands = api.handsRoot; api.handsRoot.visible = false; }
        if (key !== 'open') { play.signsOn = false; matZone.visible = false; }
        /* the master looks at the one in front of him in the endings as he does in play (his `look`: 0 while his eyes
           are shut) — a look outside play is opt-in (CP9, by photograph: in every ending he talked over the lens to the
           ceiling, because his answering take tips his chin up and nothing held his face on the client) */
        if (cast.master) cast.master.lookFilm = key !== 'open';
      },
      frame(key, t, api) {
        if (FL.key !== key) films.begin(key, null, api);
        fTalk(t);
        if (key === 'open') openFrame(t);
        else if (key === 'A') endA(t);
        else if (key === 'B') endB(t);
        else if (key === 'C') endC(t);
        else if (key === 'D') endD(t);
      },
      /* the films leave nothing behind them: the pickup home, the cabin shut, the books and props away, the people back
         to their places, the light and the lens the play's (a scene's own end, a skip, a Retry) */
      end() {
        waiAt(0);
        handFree();
        bookAway(); guava.visible = false; card.visible = false; keys.visible = false;
        if (shop.pen) { shop.pen.position.set(0.09, COUNTER.h + 0.046 + 0.0048, COUNTER.z - 0.02); shop.pen.rotation.set(0, -0.5, Math.PI / 2); shop.pen.visible = true; }
        if (sBook) bookDraw(sBook, { mode: 'front' });
        pickupHome(); cabCtl.show(false); cabCtl.drops(0);
        shop.phoneOn = 0;
        for (const P of people) P.filmWalk = 0;
        if (cast.refl) cast.refl.group.visible = false;
        if (cast.stall) cast.stall.group.visible = false;
        if (FL.hidPong && cast.pong && cast.pong.group) cast.pong.group.visible = true;
        FL.hidPong = false;
        if (cast.master) { cast.master.bow = 0; cast.master.look = 1; cast.master.lookFilm = false; }
        for (const P of [cast.pongR, cast.pongCab, cast.pong, cast.noi]) if (P) { P.lookAt = P.lookHome || null; P.neck = null; }
        if (room.cup) room.cup.rotation.z = 0;
        if (kit && kit.chill) kit.chill(0, { secs: 0.01, cine: false });
        camera.rotation.z = 0;
        if (FL.hands) { FL.hands.visible = true; FL.hands = null; }
        FL.key = ''; FL.lit = ''; FL.stings = []; FL.api = null;
      }
    };

    /* ---------------------------------------------------------- lifecycle */
    function snap() { return { phase }; }
    function restore() {}
    function reset() {
      films.end();                                       // a film's props, people and pickup back where play keeps them (CP9)
      dropTodo(); speakReset(); lineQ.length = 0; heard.clear();
      booted = false; preplaced = ''; dayClock.t = 0; lastWall = 0;
      worldRun++; wDark = false; decOpen = false;
      worldS.visible = false; worldT.visible = false;
      cabCtl.show(false); cabCtl.drops(0);
      for (const h of hotspots) { h.done = false; h.dwellT = 0; }
      if (kit) {
        /* a minigame or an order left from the run before goes with it, whoever calls this (the engine's kitReset does
           both too; a reset is never trusted to come after it — CP8: the storm's brief stood over a resumed decision) */
        if (kit.abortEvent) kit.abortEvent();
        kit.objective(null, { complete: false });
        kit.root(false); kit.pose('standing', { secs: 0.05 });
        if (kit.pray) kit.pray(false, { secs: 0 });
        kit.presence(0);
        kit.daylight(null, 0);
        kit.setPhase('arrive');
        if (kit.captions) kit.captions(null);
        if (kit.rain) kit.rain(0, 0);
        kit.waypoint(null);
      }
      domeTint('YARD0', 0);
      lookName = 'YARD0'; hushAt = -1;
      for (const k in bedMix) bedMix[k] = 0;
      phase = 'arrive';
      /* THE PLAY, BACK TO ITS FIRST FRAME (the v8.1 law: whatever a beat stated is cleared by whatever resets it) */
      play.run++;
      play.asked.clear(); play.missed.clear(); play.n = 9; play.nextCall = 0; play.calling = false; play.busy = false;
      play.greeted = false; play.water = false; play.tree = false; play.pongSat = false; play.called = false;
      play.day = ''; play.item = ''; play.offerOn = false; play.offered = false;
      play.signs.clear(); play.signsOn = false; play.herSeen = false; play.kneeling = false; play.turning = null;
      play.breathNext = 0; play.gestNext = 0; play.chantNext = 0;
      droneStop(0); chantStop(0);
      boardSet(9); slateWrite(null);
      matZone.visible = false; tray.visible = false;
      /* the people where the day began */
      for (const P of people) { P.walk = null; P.lookAt = P.lookHome || null; P.hideUnseen = false; P.pendingOut = false; P.talkUntil = 0; P.turnTo = null; if (P.one) P.one.until = 0; }
      const at = (P, x, z, ry, y, seated) => whenReady(P, () => { P.group.visible = true; personPut(P, x, z, ry, y); seatNow(P, seated); });
      at(cast.pong, 3.45, 11.6, Math.PI, undefined, false);
      at(cast.joy, SEAT.joy.x, SEAT.joy.z, Math.PI / 2, CMP.SALA.floor, true);
      at(cast.lim, SEAT.lim.x, SEAT.lim.z, Math.PI / 2, CMP.SALA.floor, true);
      at(cast.noi, CMP.BOARD.x + 0.62, CMP.BOARD.z + 0.42, -0.46, undefined, false);
      whenReady(cast.noiR, (P) => { P.group.visible = false; personPut(P, 1.55, -1.0, -2.2); });
      if (cast.master) cast.master.look = 1;
      herCtl.show(false); herCtl.at('door');
      /* the room as he will find it */
      roomCtl.tube(true); roomCtl.candles(false, 0.01); roomCtl.rain(0, 0.01);
      roomCtl.cup(0); roomCtl.clothShift(false); roomCtl.clock(true); roomCtl.smokeStraight(false);
      chg.cup.pos.x = RX + RMC.CUP[0].x; chg.cup.pos.z = RMC.CUP[0].z;
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
      for (const st of yard.stands) st.userData.disposeTrees?.();
      for (const g of yard.kitGeos) g.dispose();
      for (const m of yard.kitMats) m.dispose();
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
      world, noteTex, blockers: blockers(), groundAt,
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
      film: { RX, SX, TX, YARD, GATE, ROAD_Z, RM, RDOOR, R_ARRIVE, MASTER, CMAT, SHOP, COR, COUNTER, worldC, worldR, worldS, worldT },
      pileVia: { what: 'the receiving room\'s door (pressing it carries him inside)', x: RDOOR.x, z: RDOOR.z + 0.9 },
      arrivals: [{ what: 'the receiving room (just inside its door)', x: R_ARRIVE.x, z: R_ARRIVE.z }],
      get phase() { return phase; },
      setPhase, applyPhase, after, dayClock, sayLine, queueLine, queueFn, queueGap,
      look, presets: PRESETS, dome: domeLive, worldOf, room: roomCtl, rmc: RMC, roomState: room, yard, cmp: CMP,
      shop: shopCtl, shopState: shop, cab: cabCtl, cabState: cab, taxi, films,
      cast, her: herCtl, herState: her, shadow,
      person: { talk: personTalk, do: personDo, rest: personRest, walk: personWalk, put: personPut, sit: personSit, ready: whenReady },
      play: { state: play, ask, sign, kneel, offer, enterRoom, callNext, greet, treeLook, chooseItem, askDay, matZone, tray, herPos, chg,
              spots: { smoke: smokePos, cloth: clothPos, shadow: shadowPos } },
      castInfo: () => Object.fromEntries(Object.entries(cast).map(([k, P]) => [k, P && { ready: P.ready, diag: P.diag || null,
        pos: [+P.group.position.x.toFixed(2), +P.group.position.y.toFixed(2), +P.group.position.z.toFixed(2)], vis: P.group.visible,
        /* where his face points against the lens, in degrees (what a look at the lens is graded on) */
        faceToLens: (() => { if (!P.ready || !P.head || !P.faceLocal) return null;
          const hq = new THREE.Quaternion(), hp = new THREE.Vector3(), cp = new THREE.Vector3();
          P.head.updateWorldMatrix(true, false); P.head.getWorldQuaternion(hq); P.head.getWorldPosition(hp); camera.getWorldPosition(cp);
          return +THREE.MathUtils.radToDeg(P.faceLocal.clone().applyQuaternion(hq).angleTo(cp.sub(hp).normalize())).toFixed(1); })(),
        looking: P.lookAt === camera ? 'lens' : P.lookAt ? 'thing' : (P.look > 0 ? 'play' : null), lookW: +P.lookW.toFixed(2) }])),
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

  /* ====================================================== THE COMPOUND'S DRAWN SURFACES (CP5)
     The rice country's own sheets: red earth, flooded paddies, the sugar palm's fan and bark, a banana's torn leaf,
     bamboo, a broadleaf crown, old tiles, zinc, concrete, the gate's hand-painted sign and the queue's whiteboard. */
  function blobWrap2(x, S, px, py, rr, inner) {
    for (const ox of [-S, 0, S]) for (const oy of [-S, 0, S]) {
      const g = x.createRadialGradient(px + ox, py + oy, 0, px + ox, py + oy, rr); g.addColorStop(0, inner); g.addColorStop(1, 'rgba(0,0,0,0)');
      x.fillStyle = g; x.fillRect(px + ox - rr, py + oy - rr, rr * 2, rr * 2);
    }
  }
  /* the yard: red laterite earth, packed by tyres and feet, gravel in it, darker where it holds the wet */
  function makeRedEarth(THREE, cnv) {
    const S = 512, [c, x] = cnv(S), r = rng(4601);
    x.fillStyle = '#86503a'; x.fillRect(0, 0, S, S);
    for (let i = 0; i < 70; i++) blobWrap2(x, S, r() * S, r() * S, 30 + r() * 90, r() < 0.5 ? 'rgba(160,104,76,0.18)' : 'rgba(70,38,26,0.2)');
    speckle(x, S, S, r, 5000, '210,176,140', 0.12, 0.35, 1, 3);
    speckle(x, S, S, r, 4000, '50,24,14', 0.12, 0.3, 1, 3);
    for (let i = 0; i < 260; i++) { const px = r() * S, py = r() * S, rr = 1.5 + r() * 3; x.fillStyle = `rgba(${r() < 0.5 ? '190,170,150' : '120,110,100'},0.7)`; x.beginPath(); x.ellipse(px, py, rr, rr * 0.7, r() * 3, 0, Math.PI * 2); x.fill(); }
    return done(THREE, c, true);
  }
  /* the paddies seen from above: rows of young rice in green clumps over the water, the gaps clear (alpha) */
  function makeRiceRows(THREE, cnv) {
    const S = 256, [c, x] = cnv(S), r = rng(4603);
    x.clearRect(0, 0, S, S); x.lineCap = 'round';
    for (let row = 0; row < 16; row++) for (let k = 0; k < 20; k++) {
      const cx = (k + 0.5) * S / 20 + (r() - 0.5) * 3, cy = (row + 0.5) * S / 16 + (r() - 0.5) * 3;
      for (let b = 0; b < 7; b++) {
        const a = r() * Math.PI * 2, l = 2 + r() * 4.5;
        x.strokeStyle = `rgba(${90 + r() * 40 | 0},${150 + r() * 50 | 0},${50 + r() * 30 | 0},${(0.6 + r() * 0.35).toFixed(2)})`; x.lineWidth = 1 + r() * 0.8;
        x.beginPath(); x.moveTo(cx, cy); x.lineTo(cx + Math.cos(a) * l, cy + Math.sin(a) * l); x.stroke();
      }
    }
    return done(THREE, c, true);
  }
  /* a clump of young rice for the near paddies: blades fanning up from the water, a card crossed with itself */
  function makeRiceClump(THREE, cnv) {
    const S = 128, [c, x] = cnv(S), r = rng(4605);
    x.clearRect(0, 0, S, S); x.lineCap = 'round';
    for (let i = 0; i < 46; i++) {
      const b0 = 64 + (r() - 0.5) * 14, a = (r() - 0.5) * 1.3, l = 70 + r() * 54, bend = (r() - 0.5) * 30;
      x.strokeStyle = `rgb(${70 + r() * 50 | 0},${130 + r() * 60 | 0},${40 + r() * 30 | 0})`; x.lineWidth = 1.4 + r() * 1.4;
      x.beginPath(); x.moveTo(b0, S); x.quadraticCurveTo(b0 + Math.sin(a) * l * 0.5, S - l * 0.55, b0 + Math.sin(a) * l + bend * 0.3, S - l); x.stroke();
    }
    return done(THREE, c, false);
  }
  /* the sugar palm's fan (left half) and its dead, browned fan (right half): stiff leaflets from the petiole's tip,
     split at their ends — the leaf the whole rice country is drawn with */
  function makePalmFan(THREE, cnv) {
    const W = 512, Hh = 128, [c, x] = sized(cnv, W, Hh), r = rng(4607);
    x.clearRect(0, 0, W, Hh); x.lineCap = 'round';
    const fan = (ox, dead) => {
      const cx = ox + 128, cy = 124;
      for (let i = 0; i < 52; i++) {
        const a = Math.PI * (0.05 + 0.9 * i / 51) + (r() - 0.5) * 0.025, len = (dead ? 92 : 118) * (0.8 + 0.2 * Math.sin(i / 51 * Math.PI)) * (0.94 + r() * 0.07);
        const sag = dead ? 26 : 0, ex = cx - Math.cos(a) * len, ey = cy - Math.sin(a) * len * (dead ? 0.7 : 1) + sag * Math.abs(Math.cos(a));
        const g0 = dead ? [96 + r() * 26, 84 + r() * 18, 70 + r() * 12] : [50 + r() * 24, 94 + r() * 32, 58 + r() * 18];
        x.strokeStyle = `rgb(${g0.map(v => v | 0).join(',')})`; x.lineWidth = dead ? 3 : 4.2;
        x.beginPath(); x.moveTo(cx, cy); x.lineTo(ex, ey); x.stroke();
        x.strokeStyle = dead ? 'rgba(168,156,134,0.5)' : 'rgba(170,206,150,0.38)'; x.lineWidth = 1;
        x.beginPath(); x.moveTo(cx, cy); x.lineTo(ex, ey); x.stroke();
        if (r() < 0.75) { x.strokeStyle = `rgb(${g0.map(v => v | 0).join(',')})`; x.lineWidth = 1.6; const b = (r() - 0.5) * 0.5; x.beginPath(); x.moveTo(ex, ey); x.lineTo(ex - Math.cos(a + b) * 10, ey - Math.sin(a + b) * 10); x.stroke(); }
      }
      x.fillStyle = dead ? '#584a3c' : '#3e5a34'; x.beginPath(); x.arc(cx, cy, 8, 0, Math.PI * 2); x.fill();
    };
    fan(0, false); fan(256, true);
    return done(THREE, c, false);
  }
  /* the sugar palm's trunk: near black, ringed by old leaf scars, fibrous */
  function makePalmBark(THREE, cnv) {
    const [c, x] = sized(cnv, 64, 256), r = rng(4609);
    x.fillStyle = '#3a3634'; x.fillRect(0, 0, 64, 256);
    for (let i = 0; i < 300; i++) { x.fillStyle = `rgba(${r() < 0.5 ? '90,84,80' : '20,18,16'},${(0.2 + r() * 0.3).toFixed(2)})`; x.fillRect(r() * 64, r() * 256, 1 + r() * 2, 4 + r() * 12); }
    for (let y = 4; y < 256; y += 9 + r() * 6) { x.fillStyle = 'rgba(16,14,12,0.6)'; x.fillRect(0, y, 64, 2); x.fillStyle = 'rgba(110,104,96,0.3)'; x.fillRect(0, y + 2, 64, 1); }
    return done(THREE, c, true);
  }
  /* a banana leaf: the midrib, the parallel veins, the edge torn into strips by the wind, browning at the tears */
  function makeBananaLeaf(THREE, cnv) {
    const [c, x] = sized(cnv, 64, 256), r = rng(4611);
    x.clearRect(0, 0, 64, 256);
    for (let y = 0; y < 256; y++) {
      const t = y / 255, w = 30 * Math.min(1, Math.sin(Math.min(1, t * 1.08) * Math.PI) * 1.6);
      for (const side of [-1, 1]) {
        const tear = r() < 0.06;
        x.fillStyle = tear ? 'rgba(0,0,0,0)' : `rgb(${70 + r() * 20 | 0},${140 + r() * 30 | 0},${50 + r() * 15 | 0})`;
        if (side < 0) x.fillRect(32 - w, y, w, 1); else x.fillRect(32, y, w, 1);
      }
    }
    for (let k = 0; k < 40; k++) { const y = r() * 256, side = r() < 0.5 ? -1 : 1; x.clearRect(side < 0 ? 0 : 34, y, 30, 1 + r() * 1.5); }
    x.strokeStyle = 'rgba(40,90,30,0.35)'; x.lineWidth = 0.8;
    for (let y = 6; y < 256; y += 5) { x.beginPath(); x.moveTo(32, y); x.lineTo(2, y - 7); x.moveTo(32, y); x.lineTo(62, y - 7); x.stroke(); }
    x.fillStyle = '#c8d890'; x.fillRect(30, 0, 4, 256);
    for (let i = 0; i < 8; i++) blobWrap2(x, 64, r() * 64, r() * 256, 6 + r() * 10, 'rgba(150,120,60,0.45)');
    return done(THREE, c, false);
  }
  /* a spray of bamboo leaves on its twigs */
  function makeBambooSpray(THREE, cnv) {
    const S = 128, [c, x] = cnv(S), r = rng(4613);
    x.clearRect(0, 0, S, S);
    for (let t = 0; t < 7; t++) {
      const bx0 = 20 + r() * 88, by0 = 20 + r() * 88, a0 = r() * Math.PI * 2;
      x.strokeStyle = 'rgba(80,90,40,0.8)'; x.lineWidth = 1; x.beginPath(); x.moveTo(bx0, by0); x.lineTo(bx0 + Math.cos(a0) * 26, by0 + Math.sin(a0) * 26); x.stroke();
      for (let i = 0; i < 6; i++) {
        const u = i / 6, px = bx0 + Math.cos(a0) * 26 * u, py = by0 + Math.sin(a0) * 26 * u, a = a0 + (i % 2 ? 0.9 : -0.9) + (r() - 0.5) * 0.4, l = 14 + r() * 10;
        x.fillStyle = `rgb(${60 + r() * 40 | 0},${120 + r() * 50 | 0},${40 + r() * 20 | 0})`;
        x.beginPath(); x.ellipse(px + Math.cos(a) * l / 2, py + Math.sin(a) * l / 2, l / 2, 2.4, a, 0, Math.PI * 2); x.fill();
      }
    }
    return done(THREE, c, false);
  }
  /* a broadleaf crown's cluster: small leathery leaves crowding, dark and light, an uneven edge */
  function makeLeafCluster(THREE, cnv, seed, tint) {
    const S = 256, [c, x] = cnv(S), r = rng(seed);
    x.clearRect(0, 0, S, S);
    for (let i = 0; i < 520; i++) {
      const a = r() * Math.PI * 2, rr = Math.sqrt(r()) * 112, px = 128 + Math.cos(a) * rr, py = 128 + Math.sin(a) * rr * 0.86;
      const l = 9 + r() * 9, la = r() * Math.PI, lt = r();
      const base = tint || [52, 92, 40];
      x.fillStyle = `rgb(${base[0] + lt * 40 | 0},${base[1] + lt * 50 | 0},${base[2] + lt * 26 | 0})`;
      x.beginPath(); x.ellipse(px, py, l, l * 0.42, la, 0, Math.PI * 2); x.fill();
      x.strokeStyle = 'rgba(20,40,14,0.35)'; x.lineWidth = 0.6; x.beginPath(); x.moveTo(px - Math.cos(la) * l, py - Math.sin(la) * l); x.lineTo(px + Math.cos(la) * l, py + Math.sin(la) * l); x.stroke();
    }
    return done(THREE, c, false);
  }
  function makeTreeBark(THREE, cnv) {
    const [c, x] = sized(cnv, 128, 256), r = rng(4617);
    x.fillStyle = '#5a5046'; x.fillRect(0, 0, 128, 256);
    for (let i = 0; i < 70; i++) { const px = r() * 128; x.strokeStyle = `rgba(${r() < 0.5 ? '30,26,22' : '120,110,98'},${(0.3 + r() * 0.4).toFixed(2)})`; x.lineWidth = 1 + r() * 3; x.beginPath(); x.moveTo(px, 0); for (let y = 0; y <= 256; y += 16) x.lineTo(px + (r() - 0.5) * 6, y); x.stroke(); }
    speckle(x, 128, 256, r, 800, '40,60,30', 0.06, 0.18, 1, 3);
    return done(THREE, c, true);
  }
  /* the old house's roof: terracotta tiles in courses, weathered dark, moss and lichen on the north side */
  function makeRoofTiles(THREE, cnv) {
    const S = 256, [c, x] = cnv(S), r = rng(4619);
    x.fillStyle = '#5a2e1e'; x.fillRect(0, 0, S, S);
    const rows = 8, cols = 8;
    for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
      const w = S / cols, h = S / rows, px = i * w + (j % 2) * w / 2, py = j * h;
      const v = r(), col = [140 + v * 50, 70 + v * 30, 44 + v * 20].map(q => q | 0);
      for (const ox of [0, -S]) {
        x.fillStyle = `rgb(${col.join(',')})`; x.beginPath(); x.moveTo(px + ox + 2, py); x.lineTo(px + ox + w - 2, py); x.lineTo(px + ox + w - 2, py + h * 0.78); x.quadraticCurveTo(px + ox + w / 2, py + h * 1.02, px + ox + 2, py + h * 0.78); x.closePath(); x.fill();
        x.fillStyle = 'rgba(0,0,0,0.28)'; x.fillRect(px + ox + 2, py + h * 0.72, w - 4, 3);
      }
    }
    for (let i = 0; i < 40; i++) blobWrap2(x, S, r() * S, r() * S, 10 + r() * 28, r() < 0.6 ? 'rgba(40,60,30,0.32)' : 'rgba(20,16,14,0.35)');
    speckle(x, S, S, r, 1600, '200,190,170', 0.06, 0.16);
    return done(THREE, c, true);
  }
  /* corrugated zinc: the ribs' light and shade, rust running down from the nail lines */
  function makeZinc(THREE, cnv, seed, paint) {
    const S = 256, [c, x] = cnv(S), r = rng(seed);
    const base = paint || [150, 154, 156];
    for (let px = 0; px < S; px++) { const k = 0.82 + 0.18 * Math.sin(px / S * Math.PI * 2 * 12); x.fillStyle = `rgb(${base.map(v => v * k | 0).join(',')})`; x.fillRect(px, 0, 1, S); }
    for (let i = 0; i < 26; i++) { const px = r() * S, py = r() * S * 0.4, l = 30 + r() * 140, g = x.createLinearGradient(0, py, 0, py + l); g.addColorStop(0, 'rgba(150,70,30,0.5)'); g.addColorStop(1, 'rgba(150,70,30,0)'); x.fillStyle = g; x.fillRect(px, py, 3 + r() * 6, l); }
    for (const yy of [6, S / 2 + 6]) for (let px = 8; px < S; px += 21) { x.fillStyle = 'rgba(60,40,30,0.8)'; x.fillRect(px, yy, 2, 2); }
    speckle(x, S, S, r, 900, '90,60,40', 0.08, 0.2);
    return done(THREE, c, true);
  }
  /* rough concrete, rendered and painted once: pores, a tide of black mildew up from the ground */
  function makeConcreteT(THREE, cnv, seed, paint) {
    const S = 256, [c, x] = cnv(S), r = rng(seed);
    x.fillStyle = paint || '#c8c2b4'; x.fillRect(0, 0, S, S);
    for (let i = 0; i < 40; i++) blobWrap2(x, S, r() * S, r() * S, 12 + r() * 40, r() < 0.5 ? 'rgba(255,255,255,0.12)' : 'rgba(80,76,66,0.12)');
    speckle(x, S, S, r, 3000, '60,56,50', 0.08, 0.22, 1, 2);
    const g = x.createLinearGradient(0, S * 0.6, 0, S); g.addColorStop(0, 'rgba(30,34,26,0)'); g.addColorStop(1, 'rgba(30,34,26,0.45)');
    x.fillStyle = g; x.fillRect(0, 0, S, S);
    return done(THREE, c, true);
  }
  /* the gate's sign, hand-painted on a white board in red and blue: "the Ajahn's house · welcome, everyone" — never
     สำนักสงฆ์, which is a monks' place (the research's correction) */
  function makeGateSign(THREE, cnv) {
    const W = 512, Hh = 160, [c, x] = sized(cnv, W, Hh), r = rng(4621);
    x.fillStyle = '#f0ece2'; x.fillRect(0, 0, W, Hh);
    speckle(x, W, Hh, r, 1500, '120,110,90', 0.05, 0.14);
    x.strokeStyle = '#2a4a9a'; x.lineWidth = 8; x.strokeRect(8, 8, W - 16, Hh - 16);
    x.fillStyle = '#b4161c'; x.font = `bold 66px ${THAI_FONT}`; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('บ้านอาจารย์', W / 2, 66);
    x.fillStyle = '#2a4a9a'; x.font = `bold 30px ${THAI_FONT}`; x.fillText('ยินดีต้อนรับทุกท่าน', W / 2, 124);
    for (let i = 0; i < 9; i++) { const px = r() * W, l = 10 + r() * 30; x.fillStyle = 'rgba(120,80,40,0.25)'; x.fillRect(px, Hh - 16, 2, l); }
    return done(THREE, c, false);
  }
  /* the horizon: the tree lines between the paddies and the sky — palms, bamboo, mango, all one hazy blue-green */
  function makeTreeLine(THREE, cnv) {
    const W = 1024, Hh = 128, [c, x] = sized(cnv, W, Hh), r = rng(4623);
    x.clearRect(0, 0, W, Hh);
    const col = 'rgb(58,70,72)';
    x.fillStyle = col; x.beginPath(); x.moveTo(0, Hh);
    for (let px = 0; px <= W; px += 8) x.lineTo(px, 92 - Math.abs(Math.sin(px * 0.013 + 1)) * 10 - r() * 7);
    x.lineTo(W, Hh); x.closePath(); x.fill();
    for (let i = 0; i < 70; i++) {
      const px = r() * W, h = 30 + r() * 46;
      if (r() < 0.55) {                         // a palm: a stem and a round fan crown
        x.strokeStyle = col; x.lineWidth = 1.6; x.beginPath(); x.moveTo(px, 96); x.lineTo(px + (r() - 0.5) * 3, 96 - h); x.stroke();
        for (const ox of [-W, 0, W]) { x.fillStyle = col; x.beginPath(); x.arc(px + ox, 96 - h, 5 + r() * 3, 0, Math.PI * 2); x.fill(); }
      } else {                                  // a rounded tree
        for (const ox of [-W, 0, W]) { x.fillStyle = col; x.beginPath(); x.ellipse(px + ox, 96 - h * 0.45, 10 + r() * 16, h * 0.4, 0, 0, Math.PI * 2); x.fill(); }
      }
    }
    return done(THREE, c, true);
  }
  function makeAsphalt(THREE, cnv) {
    const S = 256, [c, x] = cnv(S), r = rng(4625);
    x.fillStyle = '#3e3c3a'; x.fillRect(0, 0, S, S);
    speckle(x, S, S, r, 6000, '120,116,108', 0.1, 0.3, 1, 2);
    speckle(x, S, S, r, 3000, '20,20,20', 0.1, 0.3, 1, 2);
    for (let i = 0; i < 18; i++) blobWrap2(x, S, r() * S, r() * S, 10 + r() * 40, 'rgba(20,20,22,0.18)');
    return done(THREE, c, true);
  }
  function makeGrassT(THREE, cnv, seed) {
    const S = 256, [c, x] = cnv(S), r = rng(seed);
    x.fillStyle = '#5a7a34'; x.fillRect(0, 0, S, S);
    for (let i = 0; i < 40; i++) blobWrap2(x, S, r() * S, r() * S, 20 + r() * 50, r() < 0.5 ? 'rgba(140,150,70,0.2)' : 'rgba(40,60,26,0.22)');
    x.lineCap = 'round';
    for (let i = 0; i < 2600; i++) { const px = r() * S, py = r() * S; x.strokeStyle = `rgba(${60 + r() * 80 | 0},${100 + r() * 70 | 0},${30 + r() * 30 | 0},0.7)`; x.lineWidth = 1; x.beginPath(); x.moveTo(px, py); x.lineTo(px + (r() - 0.5) * 3, py - 3 - r() * 4); x.stroke(); }
    return done(THREE, c, true);
  }
  /* weathered teak boards standing on end (the old house's walls): silvered brown, a dark gap at each joint */
  function makeHouseBoards(THREE, cnv) {
    const S = 256, [c, x] = cnv(S), r = rng(4627), N = 8, w = S / N;
    for (let k = 0; k < N; k++) {
      const v = r(), col = [110 + v * 26, 88 + v * 18, 70 + v * 14].map(q => q | 0);
      x.fillStyle = `rgb(${col.join(',')})`; x.fillRect(k * w, 0, w, S);
      for (let i = 0; i < 16; i++) { const px = k * w + 2 + r() * (w - 4); x.strokeStyle = `rgba(${r() < 0.5 ? '60,46,36' : '170,150,128'},${(0.15 + r() * 0.25).toFixed(2)})`; x.lineWidth = 0.6 + r(); x.beginPath(); x.moveTo(px, 0); for (let y = 0; y <= S; y += 32) x.lineTo(px + (r() - 0.5) * 1.6, y); x.stroke(); }
      x.fillStyle = 'rgba(24,16,10,0.85)'; x.fillRect(k * w, 0, 2, S);
    }
    const g = x.createLinearGradient(0, 0, 0, S); g.addColorStop(0, 'rgba(30,24,18,0)'); g.addColorStop(1, 'rgba(30,24,18,0.25)'); x.fillStyle = g; x.fillRect(0, 0, S, S);
    return done(THREE, c, true);
  }
  /* the queue's whiteboard, written in red marker: the number being seen now, the numbers taken, the date */
  function drawQueueBoard(x, W, Hh, now) {
    x.fillStyle = '#f6f6f2'; x.fillRect(0, 0, W, Hh);
    x.strokeStyle = '#a8aaae'; x.lineWidth = 10; x.strokeRect(5, 5, W - 10, Hh - 10);
    x.fillStyle = '#1a3a8a'; x.font = `bold 34px ${THAI_FONT}`; x.textAlign = 'left'; x.textBaseline = 'middle'; x.fillText('คิว', 28, 42);
    x.font = 'bold 26px sans-serif'; x.fillText('QUEUE', 96, 44);
    x.fillStyle = '#c0141c'; x.font = 'bold 30px sans-serif'; x.fillText('NOW', 28, 112);
    x.font = 'bold 96px sans-serif'; x.fillText(String(now), 120, 118);
    x.fillStyle = '#2a2a2a'; x.font = '22px sans-serif';
    for (let k = 0; k < 6; k++) { const n = now + 1 + k; x.fillText(String(n), 300 + (k % 2) * 90, 76 + Math.floor(k / 2) * 40); }
    x.fillStyle = '#5a5a5a'; x.font = `20px ${THAI_FONT}`; x.fillText('รอเรียกคิวค่ะ', 28, 196);
  }
  function makeDressCloth(THREE, cnv, seed, a, b) {
    const S = 128, [c, x] = cnv(S), r = rng(seed);
    x.fillStyle = a; x.fillRect(0, 0, S, S);
    for (let i = 0; i < 30; i++) { const px = r() * S, py = r() * S; x.fillStyle = b; for (let k = 0; k < 5; k++) { const aa = k / 5 * Math.PI * 2; x.beginPath(); x.ellipse(px + Math.cos(aa) * 4, py + Math.sin(aa) * 4, 3, 1.6, aa, 0, Math.PI * 2); x.fill(); } }
    return done(THREE, c, true);
  }
  function makeChilliMat(THREE, cnv) {
    const S = 256, [c, x] = cnv(S), r = rng(4631);
    x.fillStyle = '#b89a62'; x.fillRect(0, 0, S, S);
    for (let j = 0; j < 64; j++) for (let i = 0; i < 64; i++) { x.fillStyle = ((i >> 1) + j) % 2 ? 'rgba(90,60,30,0.2)' : 'rgba(230,200,140,0.2)'; x.fillRect(i * 4, j * 4, 4, 4); }
    for (let i = 0; i < 900; i++) { const px = 10 + r() * (S - 20), py = 10 + r() * (S - 20), a = r() * Math.PI; x.fillStyle = `rgb(${170 + r() * 60 | 0},${20 + r() * 30 | 0},${16 + r() * 20 | 0})`; x.beginPath(); x.ellipse(px, py, 5 + r() * 3, 1.6, a, 0, Math.PI * 2); x.fill(); }
    return done(THREE, c, false);
  }


  /* ====================================================== THE FILM SETS' DRAWN SURFACES (CP6)
     His shop at dawn in a Singapore neighbourhood mall, the taxi home in the rain, Pong's pickup from the inside. Every
     sheet drawn on a canvas, every one this chapter's own (FRESH). The words on them are world art: a carton says what is
     printed on it, a corridor's shops say their own names (generic: no real brand). */
  /* terrazzo: a pale cement ground, chips of grey, black, white and a little terracotta, brass divider lines every tile */
  function makeTerrazzo(THREE, cnv) {
    const S = 512, [c, x] = cnv(S), r = rng(4801);
    x.fillStyle = '#d6d2ca'; x.fillRect(0, 0, S, S);
    for (let i = 0; i < 40; i++) blobWrap2(x, S, r() * S, r() * S, 40 + r() * 80, r() < 0.5 ? 'rgba(240,236,228,0.18)' : 'rgba(150,144,134,0.12)');
    const chip = (col, n, s0, s1) => {
      for (let i = 0; i < n; i++) {
        const px = r() * S, py = r() * S, s = s0 + r() * (s1 - s0), k = 4 + (r() * 3 | 0);
        x.fillStyle = col; x.beginPath();
        for (let j = 0; j < k; j++) { const a = j / k * Math.PI * 2 + r() * 0.6, rr = s * (0.6 + r() * 0.5); const fx = px + Math.cos(a) * rr, fy = py + Math.sin(a) * rr; if (j) x.lineTo(fx, fy); else x.moveTo(fx, fy); }
        x.closePath(); x.fill();
      }
    };
    chip('rgba(120,116,110,0.85)', 900, 1.5, 4); chip('rgba(40,38,36,0.85)', 600, 1.2, 3.5); chip('rgba(250,248,244,0.9)', 700, 1.2, 3.5);
    chip('rgba(168,104,80,0.75)', 120, 1.2, 3); chip('rgba(92,122,106,0.6)', 50, 1, 2.5);
    x.fillStyle = 'rgba(176,146,92,0.85)'; x.fillRect(0, 0, S, 2); x.fillRect(0, 0, 2, S);    // the brass strip at the tile's edge
    return done(THREE, c, true);
  }
  /* the shop's floor: 600 mm porcelain, a soft grey-white, thin pale grout */
  function makeShopTiles(THREE, cnv) {
    const S = 256, [c, x] = cnv(S), r = rng(4803);
    x.fillStyle = '#e2e0dc'; x.fillRect(0, 0, S, S);
    for (let i = 0; i < 18; i++) blobWrap2(x, S, r() * S, r() * S, 30 + r() * 60, 'rgba(200,198,194,0.16)');
    speckle(x, S, S, r, 1400, '170,168,164', 0.05, 0.16, 1, 2);
    x.fillStyle = 'rgba(182,178,170,0.9)'; x.fillRect(0, 0, S, 2); x.fillRect(0, 0, 2, S);
    return done(THREE, c, true);
  }
  /* pale ash slats on the wall behind the counter, a shadow gap between each */
  function makeAshSlats(THREE, cnv) {
    const [c, x] = sized(cnv, 256, 512), r = rng(4805);
    x.fillStyle = '#2a2420'; x.fillRect(0, 0, 256, 512);
    for (let k = 0; k < 8; k++) {
      const x0 = k * 32 + 3, w = 26, base = [214 + r() * 14, 192 + r() * 12, 160 + r() * 12];
      x.fillStyle = `rgb(${base.map(v => v | 0).join(',')})`; x.fillRect(x0, 0, w, 512);
      for (let g = 0; g < 9; g++) { x.strokeStyle = `rgba(150,120,86,${(0.12 + r() * 0.16).toFixed(2)})`; x.lineWidth = 0.6 + r(); const gx = x0 + 2 + r() * (w - 4); x.beginPath(); x.moveTo(gx, 0); for (let y = 0; y <= 512; y += 32) x.lineTo(gx + Math.sin(y * 0.02 + g) * 1.6, y); x.stroke(); }
      x.fillStyle = 'rgba(255,250,240,0.18)'; x.fillRect(x0, 0, 2, 512);
    }
    return done(THREE, c, true);
  }
  /* a roller shutter's curtain: galvanised slats in horizontal ridges, grey, a little grime low down */
  function makeShutterSlats(THREE, cnv) {
    const [c, x] = sized(cnv, 128, 256), r = rng(4807);
    for (let y = 0; y < 256; y += 32) {
      const g = x.createLinearGradient(0, y, 0, y + 32);
      g.addColorStop(0, '#6a7074'); g.addColorStop(0.18, '#b4babe'); g.addColorStop(0.5, '#9ca2a6'); g.addColorStop(0.82, '#7e8488'); g.addColorStop(1, '#4a4e52');
      x.fillStyle = g; x.fillRect(0, y, 128, 32);
    }
    for (let i = 0; i < 40; i++) { x.fillStyle = `rgba(${r() < 0.5 ? '60,56,50' : '200,204,206'},${(0.06 + r() * 0.1).toFixed(2)})`; x.fillRect(r() * 128, r() * 256, 2 + r() * 12, 1 + r() * 3); }
    return done(THREE, c, true);
  }
  /* the cases' bed: dark red velvet, its nap catching the light in soft patches */
  function makeVelvet(THREE, cnv) {
    const S = 128, [c, x] = cnv(S), r = rng(4809);
    x.fillStyle = '#4a1016'; x.fillRect(0, 0, S, S);
    for (let i = 0; i < 30; i++) blobWrap2(x, S, r() * S, r() * S, 10 + r() * 30, r() < 0.5 ? 'rgba(110,30,38,0.25)' : 'rgba(20,4,8,0.25)');
    speckle(x, S, S, r, 900, '120,40,48', 0.1, 0.25, 1, 1);
    return done(THREE, c, true);
  }
  /* the amulets in his cases, an atlas of four faces: a Somdej's stepped arch, a round coin, an oval, a takrut's roll */
  function makeAmuletFaces(THREE, cnv) {
    const [c, x] = sized(cnv, 256, 64), r = rng(4811);
    x.fillStyle = '#000'; x.fillRect(0, 0, 256, 64);
    const face = (ox, kind) => {
      const cx = ox + 32, cy = 32;
      x.fillStyle = '#b8902e'; x.fillRect(ox + 2, 2, 60, 60);                       // the gold frame
      x.fillStyle = kind === 1 ? '#7a6a4a' : kind === 2 ? '#3a3632' : '#c8bca0';
      if (kind === 0) { x.fillRect(ox + 10, 8, 44, 50); x.fillStyle = '#a89c80'; x.beginPath(); x.moveTo(cx - 14, 50); x.lineTo(cx - 14, 26); x.quadraticCurveTo(cx, 8, cx + 14, 26); x.lineTo(cx + 14, 50); x.fill();
        x.fillStyle = '#8a7e64'; for (let k = 0; k < 3; k++) x.fillRect(cx - 12 + k * 2, 50 - k * 3, 24 - k * 4, 2); x.beginPath(); x.ellipse(cx, 34, 5, 7, 0, 0, Math.PI * 2); x.fill(); }
      else if (kind === 1) { x.beginPath(); x.arc(cx, cy, 24, 0, Math.PI * 2); x.fill(); x.strokeStyle = '#d8b450'; x.lineWidth = 2; x.beginPath(); x.arc(cx, cy, 20, 0, Math.PI * 2); x.stroke(); x.fillStyle = '#5a4a30'; x.beginPath(); x.ellipse(cx, cy + 2, 7, 10, 0, 0, Math.PI * 2); x.fill(); }
      else if (kind === 2) { x.beginPath(); x.ellipse(cx, cy, 18, 25, 0, 0, Math.PI * 2); x.fill(); x.fillStyle = '#6a5e4e'; x.beginPath(); x.ellipse(cx, cy + 3, 7, 11, 0, 0, Math.PI * 2); x.fill(); }
      else { x.fillStyle = '#5a4630'; x.fillRect(ox + 24, 6, 16, 52); x.strokeStyle = '#2a2018'; x.lineWidth = 1.5; for (let y = 10; y < 56; y += 6) { x.beginPath(); x.moveTo(ox + 24, y); x.lineTo(ox + 40, y + 2); x.stroke(); } }
      for (let i = 0; i < 40; i++) { x.fillStyle = `rgba(255,240,200,${(r() * 0.12).toFixed(2)})`; x.fillRect(ox + 4 + r() * 56, 4 + r() * 56, 1, 1); }
    };
    for (let k = 0; k < 4; k++) face(k * 64, k);
    return done(THREE, c, false);
  }
  /* a price card, handwritten: four of them on one sheet */
  function makePriceCards(THREE, cnv) {
    const [c, x] = sized(cnv, 256, 64);
    const HAND = '"Segoe Print", "Bradley Hand", "Comic Sans MS", "Chalkboard SE", cursive';
    ['$380', '$1,200', '$95', '$560'].forEach((p, k) => {
      x.fillStyle = '#f6f2e8'; x.fillRect(k * 64 + 3, 6, 58, 52);
      x.fillStyle = '#c02a20'; x.fillRect(k * 64 + 3, 6, 58, 4);
      x.fillStyle = '#1c2a6a'; x.font = `bold ${p.length > 4 ? 17 : 21}px ${HAND}`; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(p, k * 64 + 32, 36);
    });
    return done(THREE, c, false);
  }
  /* his stock book, open on the counter: ruled pages, a red margin, his entries in blue ballpoint, the sales column */
  function makeStockBook(THREE, cnv) {
    const [c, x] = sized(cnv, 1024, 640), r = rng(4813);
    const HAND = '"Segoe Print", "Bradley Hand", "Comic Sans MS", "Chalkboard SE", cursive';
    for (const ox of [0, 512]) {
      const g = x.createLinearGradient(ox, 0, ox + 512, 0);
      g.addColorStop(0, ox ? '#d8d2c2' : '#f2eee2'); g.addColorStop(ox ? 0.1 : 0.9, '#f4f0e4'); g.addColorStop(1, ox ? '#f2eee2' : '#d8d2c2');
      x.fillStyle = g; x.fillRect(ox, 0, 512, 640);
      x.strokeStyle = 'rgba(80,120,190,0.45)'; x.lineWidth = 1.2;
      for (let y = 92; y < 620; y += 38) { x.beginPath(); x.moveTo(ox + 18, y); x.lineTo(ox + 494, y); x.stroke(); }
      x.strokeStyle = 'rgba(200,40,40,0.6)'; x.beginPath(); x.moveTo(ox + 70, 20); x.lineTo(ox + 70, 620); x.stroke();
      x.strokeStyle = 'rgba(80,120,190,0.35)'; for (const cx of [330, 400, 452]) { x.beginPath(); x.moveTo(ox + cx, 60); x.lineTo(ox + cx, 620); x.stroke(); }
    }
    x.fillStyle = '#1e2c78'; x.textBaseline = 'alphabetic';
    x.font = `bold 26px ${HAND}`; x.fillText('STOCK', 84, 70); x.fillText('SALES', 596, 70);
    x.font = `22px ${HAND}`; x.fillText('qty', 338, 70); x.fillText('S$', 408, 70);
    const rows = [['Phra Somdej', '2', '380'], ['Takrut (5 pc)', '5', '95'], ['Phra Pidta', '1', '560'], ['Rian LP coin', '3', '120'], ['Pendant frames', '20', '8']];
    rows.forEach(([n, q, p], i) => { const y = 124 + i * 38; x.font = `24px ${HAND}`; x.fillText(n, 84, y); x.fillText(q, 344, y); x.fillText(p, 404, y); });
    ['Mon', 'Tue', 'Wed'].forEach((d, i) => { const y = 124 + i * 38; x.font = `24px ${HAND}`; x.fillText(d, 596, y); x.fillText(i < 2 ? '0' : '1', 856, y); if (i === 2) x.fillText('Takrut', 690, y); });
    x.strokeStyle = 'rgba(30,44,120,0.5)'; x.lineWidth = 1.5; x.beginPath(); x.moveTo(596, 238); x.lineTo(640, 236); x.stroke();
    for (let i = 0; i < 200; i++) { x.fillStyle = `rgba(120,100,70,${(r() * 0.05).toFixed(3)})`; x.fillRect(r() * 1024, r() * 640, 2, 2); }
    x.fillStyle = 'rgba(60,50,40,0.25)'; x.fillRect(506, 0, 12, 640);
    return done(THREE, c, false);
  }
  /* his stock book's two open pages, drawn on demand onto one 1024 × 640 canvas (CP9). The FRONT is the shop's — what he
     stocks and what sold this week — and the opening film watches him write Wednesday's row (`wed`, 0…1: the row is
     revealed left to right as the pen goes). The BACK is the day at the samnak: every line he wrote there in his own
     words (`entries`, the kit's ledger, the people he asked on the left page and what he saw on the right), and the line
     an ending adds (`last`, written to `lastK`). Answers where the pen is, in the canvas's pixels. */
  const BOOK_HAND = '"Segoe Print", "Bradley Hand", "Comic Sans MS", "Chalkboard SE", cursive';
  const BOOK_NOTE = 'italic 500 23px "Cormorant Garamond", Georgia, serif';
  function drawStockPages(x, o = {}) {
    const r = rng(4813);
    x.setTransform(1, 0, 0, 1, 0, 0); x.clearRect(0, 0, 1024, 640);
    for (const ox of [0, 512]) {
      const g = x.createLinearGradient(ox, 0, ox + 512, 0);
      g.addColorStop(0, ox ? '#d8d2c2' : '#f2eee2'); g.addColorStop(ox ? 0.1 : 0.9, '#f4f0e4'); g.addColorStop(1, ox ? '#f2eee2' : '#d8d2c2');
      x.fillStyle = g; x.fillRect(ox, 0, 512, 640);
      x.strokeStyle = 'rgba(80,120,190,0.45)'; x.lineWidth = 1.2;
      for (let y = 92; y < 620; y += 38) { x.beginPath(); x.moveTo(ox + 18, y); x.lineTo(ox + 494, y); x.stroke(); }
      x.strokeStyle = 'rgba(200,40,40,0.6)'; x.beginPath(); x.moveTo(ox + 70, 20); x.lineTo(ox + 70, 620); x.stroke();
      if (o.mode !== 'back') { x.strokeStyle = 'rgba(80,120,190,0.35)'; for (const cx of [330, 400, 452]) { x.beginPath(); x.moveTo(ox + cx, 60); x.lineTo(ox + cx, 620); x.stroke(); } }
    }
    x.fillStyle = '#1e2c78'; x.textBaseline = 'alphabetic'; x.textAlign = 'left';
    let pen = null;
    if (o.mode !== 'back') {
      x.font = `bold 26px ${BOOK_HAND}`; x.fillText('STOCK', 84, 70); x.fillText('SALES', 596, 70);
      x.font = `22px ${BOOK_HAND}`; x.fillText('qty', 338, 70); x.fillText('S$', 408, 70);
      const rows = [['Phra Somdej', '2', '380'], ['Takrut (5 pc)', '5', '95'], ['Phra Pidta', '1', '560'], ['Rian LP coin', '3', '120'], ['Pendant frames', '20', '8']];
      rows.forEach(([n, q, p], i) => { const y = 124 + i * 38; x.font = `24px ${BOOK_HAND}`; x.fillText(n, 84, y); x.fillText(q, 344, y); x.fillText(p, 404, y); });
      x.font = `24px ${BOOK_HAND}`;
      ['Mon', 'Tue'].forEach((d, i) => { const y = 124 + i * 38; x.fillText(d, 596, y); x.fillText('0', 856, y); });
      /* Wednesday's row, written as far as the pen has gone (the whole row when `wed` is not given) */
      const wk = o.wed == null ? 1 : Math.max(0, Math.min(1, o.wed)), y3 = 200, x0 = 592, x1 = 878;
      if (wk > 0) {
        x.save(); x.beginPath(); x.rect(x0 - 4, y3 - 30, (x1 - x0) * wk + 4, 40); x.clip();
        x.fillText('Wed', 596, y3); x.fillText('Takrut', 690, y3); x.fillText('1', 856, y3);
        x.restore();
      }
      pen = [x0 + (x1 - x0) * wk, y3 - 2];
    } else {
      /* the back of the book: the day at the samnak, in his own hand */
      const E = Array.isArray(o.entries) ? o.entries : [];
      x.font = `bold 24px ${BOOK_HAND}`; x.fillText(o.titleL || 'Who is he?', 84, 62); x.fillText(o.titleR || 'What I saw', 596, 62);
      x.font = BOOK_NOTE;
      const wrapAt = (txt, ox, y0, maxW) => {
        const words = String(txt).split(/\s+/); let line = '', y = y0;
        for (const w of words) { const tl = line ? line + ' ' + w : w; if (x.measureText(tl).width > maxW && line) { x.fillText(line, ox, y); y += 38; line = w; } else line = tl; }
        if (line) { x.fillText(line, ox, y); y += 38; }
        return y;
      };
      let yL = 124, yR = 124;
      for (const e of E) {
        const left = e.page === 'who';
        if (left) { if (yL > 580) continue; x.fillText('–', 80, yL); yL = wrapAt(e.text, 98, yL, 392); }
        else { if (yR > 540) continue; x.fillText('–', 592, yR); yR = wrapAt(e.text, 610, yR, 392); }
      }
      /* the ending's own line, at the foot of what he saw, written as far as the pen has gone */
      if (o.last) {
        const yl = Math.min(582, Math.max(yR + 6, 352)), lk = o.lastK == null ? 1 : Math.max(0, Math.min(1, o.lastK));
        x.font = 'italic 600 25px "Cormorant Garamond", Georgia, serif';
        const w = x.measureText(o.last).width;
        if (lk > 0) { x.save(); x.beginPath(); x.rect(604, yl - 30, w * lk + 6, 42); x.clip(); x.fillText(o.last, 610, yl); x.restore(); }
        pen = [610 + w * lk, yl - 2];
      }
    }
    for (let i = 0; i < 200; i++) { x.fillStyle = `rgba(120,100,70,${(r() * 0.05).toFixed(3)})`; x.fillRect(r() * 1024, r() * 640, 2, 2); }
    x.fillStyle = 'rgba(60,50,40,0.25)'; x.fillRect(506, 0, 12, 640);
    return pen;
  }
  /* the master's card (ending B): cream card, his name in Thai, the samnak and a number on the front; a lotus on the back */
  function makeMasterCard(THREE, cnv, back) {
    const [c, x] = sized(cnv, 256, 156);
    x.fillStyle = back ? '#f1e7cf' : '#f6efdc'; x.fillRect(0, 0, 256, 156);
    x.strokeStyle = '#a8862e'; x.lineWidth = 3; x.strokeRect(6, 6, 244, 144);
    x.fillStyle = '#5a1a12'; x.textAlign = 'center'; x.textBaseline = 'middle';
    if (!back) {
      x.font = `bold 26px ${THAI_FONT}`; x.fillText('อาจารย์', 128, 42);
      x.font = `17px ${THAI_FONT}`; x.fillText('สำนักบ้านอาจารย์', 128, 78);
      x.font = 'bold 19px Arial, sans-serif'; x.fillStyle = '#2a2420'; x.fillText('08x-xxx-xxxx', 128, 116);
    } else {
      x.translate(128, 84);
      for (let k = 0; k < 8; k++) { x.save(); x.rotate(k * Math.PI / 4 - Math.PI / 2); x.fillStyle = k % 2 ? '#c8a040' : '#b0781e';
        x.beginPath(); x.moveTo(0, 0); x.quadraticCurveTo(16, -22, 0, -48); x.quadraticCurveTo(-16, -22, 0, 0); x.fill(); x.restore(); }
      x.fillStyle = '#7a4a10'; x.beginPath(); x.arc(0, 0, 8, 0, Math.PI * 2); x.fill();
    }
    return done(THREE, c, false);
  }
  /* a congratulations ribbon on a flower stand: red satin, gold characters down it */
  function makeRibbon(THREE, cnv, text, latin) {
    const [c, x] = sized(cnv, 64, 512), r = rng(4815);
    const g = x.createLinearGradient(0, 0, 64, 0); g.addColorStop(0, '#8a0e12'); g.addColorStop(0.5, '#d01c22'); g.addColorStop(1, '#8a0e12');
    x.fillStyle = g; x.fillRect(0, 0, 64, 512);
    for (let i = 0; i < 60; i++) { x.fillStyle = `rgba(255,${120 + r() * 60 | 0},${100 + r() * 40 | 0},${(r() * 0.08).toFixed(2)})`; x.fillRect(0, r() * 512, 64, 1 + r() * 3); }
    x.fillStyle = '#f2cc5a'; x.textAlign = 'center'; x.textBaseline = 'middle';
    if (latin) { x.font = 'bold 28px Georgia, "Times New Roman", serif'; const ch = text.split(''); ch.forEach((t, i) => x.fillText(t, 32, 132 + i * (366 / ch.length))); }
    else { x.font = `bold 46px "Noto Sans CJK SC", "Noto Sans SC", "PingFang SC", "Microsoft YaHei", sans-serif`; [...text].forEach((t, i) => x.fillText(t, 32, 160 + i * 92)); }
    return done(THREE, c, false);
  }
  /* bubble wrap: clear plastic, a grid of bubbles catching the light (alpha) */
  function makeBubbleWrap(THREE, cnv) {
    const S = 128, [c, x] = cnv(S);
    x.clearRect(0, 0, S, S); x.fillStyle = 'rgba(230,236,240,0.22)'; x.fillRect(0, 0, S, S);
    for (let j = 0; j < 8; j++) for (let i = 0; i < 8; i++) {
      const cx = i * 16 + (j % 2) * 8 + 8, cy = j * 16 + 8;
      const g = x.createRadialGradient(cx - 2, cy - 2, 0, cx, cy, 6); g.addColorStop(0, 'rgba(255,255,255,0.9)'); g.addColorStop(0.5, 'rgba(220,230,238,0.45)'); g.addColorStop(1, 'rgba(180,196,210,0.3)');
      x.fillStyle = g; x.beginPath(); x.arc(cx, cy, 6, 0, Math.PI * 2); x.fill();
    }
    return done(THREE, c, true);
  }
  /* a carton: corrugated brown, FRAGILE in red, the up arrows, a strip of tape */
  function makeCarton(THREE, cnv) {
    const S = 256, [c, x] = cnv(S), r = rng(4817);
    x.fillStyle = '#b08a5a'; x.fillRect(0, 0, S, S);
    for (let y = 0; y < S; y += 3) { x.fillStyle = `rgba(90,64,36,${(0.05 + r() * 0.05).toFixed(2)})`; x.fillRect(0, y, S, 1); }
    x.fillStyle = 'rgba(196,170,120,0.8)'; x.fillRect(0, 118, S, 20);
    x.fillStyle = '#b01e1a'; x.font = 'bold 30px Arial, Helvetica, sans-serif'; x.textAlign = 'center'; x.fillText('FRAGILE', 128, 74);
    x.font = 'bold 18px Arial, Helvetica, sans-serif'; x.fillText('易碎品 · HANDLE WITH CARE', 128, 100);
    x.strokeStyle = '#1a1a1a'; x.lineWidth = 4; for (const ax of [70, 186]) { x.beginPath(); x.moveTo(ax, 220); x.lineTo(ax, 170); x.moveTo(ax - 12, 184); x.lineTo(ax, 170); x.lineTo(ax + 12, 184); x.stroke(); }
    return done(THREE, c, false);
  }
  /* a shop sign on the corridor: a lightbox with the shop's name (generic) in two scripts */
  function makeShopSign(THREE, cnv, en, cn, bg, fg) {
    const [c, x] = sized(cnv, 512, 96);
    x.fillStyle = bg; x.fillRect(0, 0, 512, 96);
    x.fillStyle = 'rgba(255,255,255,0.12)'; x.fillRect(0, 0, 512, 10);
    x.fillStyle = fg; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.font = `bold 40px "Noto Sans CJK SC", "Noto Sans SC", "PingFang SC", sans-serif`; x.fillText(cn, 106, 48);
    x.font = 'bold 30px Arial, Helvetica, sans-serif'; x.fillText(en, 330, 50);
    return done(THREE, c, false);
  }
  /* a green EXIT sign, the running man left out (a sign says EXIT; that is enough) */
  function makeExitSign(THREE, cnv) {
    const [c, x] = sized(cnv, 128, 48);
    x.fillStyle = '#0e8a3a'; x.fillRect(0, 0, 128, 48); x.fillStyle = '#eafff0'; x.font = 'bold 30px Arial, Helvetica, sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('EXIT', 64, 26);
    return done(THREE, c, false);
  }
  /* a small framed print of a temple's roofline at sunset (the shop's one picture on the wall) */
  function makeTemplePrint(THREE, cnv) {
    const [c, x] = sized(cnv, 128, 96);
    const g = x.createLinearGradient(0, 0, 0, 96); g.addColorStop(0, '#f2b070'); g.addColorStop(0.6, '#d8805a'); g.addColorStop(1, '#5a3a3a');
    x.fillStyle = g; x.fillRect(0, 0, 128, 96);
    x.fillStyle = '#2a1a1a'; x.beginPath(); x.moveTo(20, 80); x.lineTo(40, 52); x.lineTo(56, 52); x.lineTo(64, 30); x.lineTo(72, 52); x.lineTo(88, 52); x.lineTo(108, 80); x.closePath(); x.fill();
    x.fillRect(14, 80, 100, 16); x.beginPath(); x.moveTo(64, 30); x.lineTo(66, 14); x.lineTo(62, 14); x.fill();
    return done(THREE, c, false);
  }
  /* the city at night through rain, out of focus: discs of sodium, LED white, tail-light red and a sign's green on blue-black
     (a strip that repeats along u; the taxi slides past it) */
  function makeBokeh(THREE, cnv, seed, ahead) {
    const [c, x] = sized(cnv, 1024, 256), r = rng(seed);
    const g = x.createLinearGradient(0, 0, 0, 256); g.addColorStop(0, '#04050a'); g.addColorStop(0.5, '#0a0b14'); g.addColorStop(0.7, '#0d0c14'); g.addColorStop(1, '#030306');
    x.fillStyle = g; x.fillRect(0, 0, 1024, 256);
    /* CP6: the first strip was confetti — seven hues dealt evenly, magenta among them. Weighted as a city at night is:
       sodium and warm LED most, then white, the traffic's red, and a sign's green or blue only now and then. */
    const pal = ahead ? [['255,64,40', 5], ['255,92,52', 3], ['255,176,86', 3], ['244,236,224', 2], ['92,255,150', 0.6]]
                      : [['255,168,72', 5], ['255,204,130', 4], ['246,238,226', 3], ['214,226,255', 1.5], ['255,70,48', 2], ['96,236,156', 0.5], ['120,168,255', 0.5]];
    const tot = pal.reduce((a, p) => a + p[1], 0);
    const pick = () => { let q = r() * tot; for (const p of pal) { q -= p[1]; if (q <= 0) return p[0]; } return pal[0][0]; };
    const HOR = ahead ? 150 : 170;                 // the street's horizon in the strip: lights above it, their wet road below
    for (let i = 0, N = ahead ? 70 : 120; i < N; i++) {
      const big = r() < 0.12, px = r() * 1024;
      const py = ahead ? HOR - 8 - Math.pow(r(), 1.6) * 70 : HOR - 6 - Math.pow(r(), 1.3) * 140;
      const rr = big ? 14 + r() * 12 : 2.5 + Math.pow(r(), 2) * 9, col = pick(), a = big ? 0.12 + r() * 0.16 : 0.35 + r() * 0.5;
      const refl = !big && r() < 0.7, len = 30 + r() * 60, w = Math.max(2, rr * 0.9), sy = HOR + 4 + (HOR - py) * 0.15;
      const rj = [0, (r() - 0.5) * 3, (r() - 0.5) * 4];
      for (const ox of [-1024, 0, 1024]) {
        const gg = x.createRadialGradient(px + ox, py, 0, px + ox, py, rr);       // a lens's disc: flat, its rim a touch brighter
        gg.addColorStop(0, `rgba(${col},${(a * 0.82).toFixed(3)})`); gg.addColorStop(0.78, `rgba(${col},${(a * 0.9).toFixed(3)})`);
        gg.addColorStop(0.9, `rgba(${col},${a.toFixed(3)})`); gg.addColorStop(1, `rgba(${col},0)`);
        x.fillStyle = gg; x.fillRect(px + ox - rr, py - rr, rr * 2, rr * 2);
        /* its reflection in the wet road: three soft streaks under the horizon, broken as the water breaks it (CP6: one
           hard-edged bar a light read as a row of posts) */
        if (refl) for (let k = 0; k < 3; k++) {
          const cy = sy + len * (0.18 + k * 0.3), hl = len * 0.16, ww = w * (1 - k * 0.18);
          x.save(); x.translate(px + ox + rj[k], cy); x.scale(1, hl / ww);
          const gr = x.createRadialGradient(0, 0, 0, 0, 0, ww);
          gr.addColorStop(0, `rgba(${col},${(a * 0.3 * (1 - k * 0.28)).toFixed(3)})`); gr.addColorStop(1, `rgba(${col},0)`);
          x.fillStyle = gr; x.fillRect(-ww, -ww, ww * 2, ww * 2); x.restore();
        }
      }
    }
    return done(THREE, c, true);
  }
  /* the uncle's phone in its holder: a navigation map at night — dark blocks, grey roads, the blue route, his arrow */
  function makeNavMap(THREE, cnv) {
    const [c, x] = sized(cnv, 128, 248), r = rng(5101);
    x.fillStyle = '#1a1d24'; x.fillRect(0, 0, 128, 248);
    x.fillStyle = '#21252e'; for (let i = 0; i < 14; i++) x.fillRect(r() * 128, r() * 248, 14 + r() * 30, 10 + r() * 26);
    x.strokeStyle = '#3c424e'; x.lineCap = 'round';
    for (let i = 0; i < 9; i++) {
      x.lineWidth = 2 + r() * 3; x.beginPath(); const vert = r() < 0.5, p0 = r() * (vert ? 128 : 248), sk = (r() - 0.5) * 40;
      if (vert) { x.moveTo(p0, 0); x.lineTo(p0 + sk, 248); } else { x.moveTo(0, p0); x.lineTo(128, p0 + sk); }
      x.stroke();
    }
    x.strokeStyle = '#2f8cff'; x.lineWidth = 6; x.lineJoin = 'round'; x.beginPath(); x.moveTo(64, 248); x.lineTo(64, 150); x.lineTo(96, 118); x.lineTo(96, 40); x.lineTo(70, 10); x.stroke();
    x.fillStyle = '#ffffff'; x.beginPath(); x.moveTo(64, 176); x.lineTo(54, 198); x.lineTo(64, 192); x.lineTo(74, 198); x.closePath(); x.fill();
    x.fillStyle = '#0e1016'; x.fillRect(0, 0, 128, 34); x.fillStyle = '#e8ecf2'; x.font = 'bold 15px Arial, sans-serif'; x.textBaseline = 'alphabetic'; x.fillText('300 m', 10, 23);
    return done(THREE, c, false);
  }
  /* the taxi's meter: a red LED readout in its little black box */
  function makeMeter(THREE, cnv) {
    const [c, x] = sized(cnv, 128, 48);
    x.fillStyle = '#0a0a0c'; x.fillRect(0, 0, 128, 48);
    x.fillStyle = '#ff3a2a'; x.font = 'bold 26px "Courier New", monospace'; x.textAlign = 'right'; x.textBaseline = 'middle'; x.fillText('18.60', 118, 26);
    x.fillStyle = 'rgba(255,58,42,0.6)'; x.font = '12px Arial, sans-serif'; x.textAlign = 'left'; x.fillText('S$', 8, 26);
    return done(THREE, c, false);
  }
  /* a jasmine garland's string (phuang malai): white buds, a red rose at the knot, ribbons */
  function makeGarland(THREE, cnv) {
    const [c, x] = sized(cnv, 64, 256), r = rng(4819);
    x.clearRect(0, 0, 64, 256);
    for (let y = 8; y < 150; y += 7) for (let k = 0; k < 3; k++) { x.fillStyle = `rgb(${236 + r() * 18 | 0},${236 + r() * 16 | 0},${214 + r() * 20 | 0})`; x.beginPath(); x.ellipse(24 + k * 8 + (r() - 0.5) * 3, y + r() * 3, 3.6, 4.4, 0, 0, Math.PI * 2); x.fill(); }
    x.fillStyle = '#b0141c'; x.beginPath(); x.arc(32, 162, 13, 0, Math.PI * 2); x.fill(); x.fillStyle = '#e8b030'; x.beginPath(); x.arc(32, 162, 5, 0, Math.PI * 2); x.fill();
    for (const [x0, col] of [[24, '#e83a8a'], [36, '#f0c040']]) { x.fillStyle = col; x.fillRect(x0, 176, 5, 76); }
    return done(THREE, c, false);
  }
  /* a Thai number plate: black on white, the number over the province (generic numbers) */
  function makePlate(THREE, cnv, num, prov) {
    const [c, x] = sized(cnv, 256, 84);
    x.fillStyle = '#f6f6f2'; x.fillRect(0, 0, 256, 84); x.strokeStyle = '#1a1a1a'; x.lineWidth = 4; x.strokeRect(3, 3, 250, 78);
    x.fillStyle = '#141414'; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.font = `bold 40px ${THAI_FONT}`; x.fillText(num, 128, 32); x.font = `22px ${THAI_FONT}`; x.fillText(prov, 128, 66);
    return done(THREE, c, false);
  }

  /* ====================================================== THE FILMS (CP9 · §4.0, §4.7, §4.8)
     Each film holds only its cues and its fades; one track hands its clock to the stage (films.frame), which draws every
     picture from it — so a seek, a skip and a slow phone land on the same frame (v19.5's law). A line is cued after the one
     before has ended (their SECS are estimates until CP11 records them; CP12 re-times by the takes); every stretch between
     lines is held by a sound with a reason (v21.30). The coda's cues are written out in each ending, because the engine
     warms what a scene's own source cues. */
  function introFilm(c, s, api) {
    const { tr, step, fade, sfx, sfxFade, rawK, stage, phone } = api;
    const O = OPEN;
    c.keepFade = true;                         // it ends on black: the chapter card comes up over it (v14.1's law)
    step(0, () => stage.films.begin('open', c, api));
    tr(0, O.end, (k, t) => stage.films.frame('open', t, api), rawK);
    /* O1 · THE SHUTTER: black, then the morning coming in under the shutter */
    fade(0, 1.2, 1, 1); fade(1.2, 2.8, 1, 0);
    sfx(0.2, 'w4mallair', 0.5);                // the closed mall's empty air, a far broom
    sfx(0.9, 'w4shutter', 0.9);                // the roller shutter hauled up from outside the frame
    sfx(2.5, 'q1pro1', 1);                     // "Not long after, my interest in amulets became more than curiosity..."  (→ ~9.7)
    sfx(6.25, 'w4switch', 0.6);                // the lights
    sfx(6.4, 'w4ledhum', 0.35);
    sfx(0.4, 'w4open', 0.8);                   // the opening's own music, under the whole film
    /* O2 · THE SHOP */
    sfx(10.3, 'q1pro2', 1);                    // "Eventually I opened an amulet shop of my own..."  (→ ~19.1)
    sfx(15.6, 'w4carton', 0.4);                // a carton's flap, settling
    /* O3 · THE BOOK */
    sfx(20.0, 'w4pen', 0.55);                  // the ballpoint, writing Wednesday's row
    sfx(20.4, 'q1pro3', 1);                    // "Business was slow. I wanted guidance about the fortune... and the future of my shop."  (→ ~27.5)
    /* O4 · THE MESSAGE */
    sfx(O.buzz, 'w4buzz', 0.7); sfx(O.buzz + 0.9, 'w4buzz', 0.6);
    sfx(30.2, 'q1pro4', 1);                    // "A dealer I bought from said he knew a very strong master in Thailand."  (→ ~36.0)
    sfx(O.o4b + 2.6, 'w4type', 0.45);          // his reply typed
    const Wd = DATA.words;                     // (the chat's words are the sheet's)
    phone(O.o4b, O.o5, { name: Wd.phonePong, sub: Wd.phonePongSub, ava: { text: String(Wd.phonePong || 'P').charAt(0), color: '#2f7a5a' }, typingWord: Wd.phoneTyping,
      msgs: [{ at: 1.0, who: 'them', typing: 0.8, text: Wd.chat1 },
             { at: 3.2, who: 'me', typing: 1.0, text: Wd.chat2 },
             { at: 4.8, who: 'them', typing: 0.8, text: Wd.chat3 }] });
    /* O5 · THE RICE COUNTRY: a hard cut; the picture breathes; the wind */
    sfx(O.o5, 'w4wind', 0.6);
    sfx(O.o5b, 'w4drivepass', 0.55);           // the pickup going by the lens, the palms
    /* O6 · THE PICKUP */
    sfx(O.o6, 'w4diesel', 0.5);                // the diesel, from inside
    sfx(O.o6 + 9.2, 'w4diesel', 0.5);          // and on under the first's tail to the stop (CP13: the cab drove six seconds with no engine)
    sfxFade(O.stop - 0.5, O.stop + 0.1, 'w4diesel');
    sfx(O.o6 + 0.6, 'w4radio', 0.22);          // the radio low (luk thung)
    sfx(51.6, 'pg1car', 1);                    // "This Ajahn very strong one, brother. Business, family, everything... you will see!"  (→ ~57.6)
    sfx(O.o6 + 1.1, 'w4drops', 0.4);           // the first fat drops on the windscreen
    sfx(58.2, 'q1pro5', 1);                    // "A Thai master... I did not know very well."  (→ ~62.8)
    /* O7 · THE TURN */
    sfx(O.o7 + 1.0, 'w4gravel', 0.55);         // off the road onto the red earth
    sfx(66.0, 'w4thunder', 0.8);
    sfx(O.stop - 0.3, 'w4engoff', 0.16);       // the engine dying, from the idle's own level (CP13: at 0.5 it came back 10 dB louder to die)
    sfx(68.6, 'pg1here', 1);                   // "Here, here! This is Ajahn's samnak."  (→ ~71.6)
    fade(O.black, O.end, 0, 1);
    step(O.end, () => stage.films.end());
  }

  /* the ending's own frame and its end: the stage draws it; the card lies over the coda's last black */
  function endingScene(c, api, k, cues) {
    const { tr, step, rawK, stage } = api;
    const T = END[k], total = T.coda + CODA.end;
    step(0, () => stage.films.begin(k, c, api));
    tr(0, total, (kk, t) => stage.films.frame(k, t, api), rawK);
    cues(T);
    step(total, () => stage.films.end());
    c.endFade = 1;
    c.keep.view = true;
  }

  /* A · STILL (good): he observes, and decides nothing */
  function scStill(c, s, api) {
    const { sfx, sfxFade, fade } = api;
    endingScene(c, api, 'A', (T) => {
      sfx(0.4, 'w4drips', 0.5);                              // the eaves dripping after the storm (the room's only sound)
      sfx(0.8, 'w4breath', 0.35);                            // his breath, slowed
      sfx(T.pao + 2.1, 'w4pao', 0.6); sfx(T.pao + 2.9, 'w4pao', 0.6); sfx(T.pao + 3.7, 'w4pao', 0.6);   // three breaths onto his crown
      sfx(10.2, 'w4drips', 0.45);                            // the eaves still dripping, under the blessing's wait (CP13: 2.8 s of silence)
      sfx(T.bless + 0.3, 'fm1blessA', 1);                    // "May your trade go well..."  (→ ~16.4)
      /* Pong's word for the piece he took (all three written out, so the engine warms each) */
      const it = api.stage && api.stage.play ? api.stage.play.state.item : '';
      if (it === 'nangkwak') sfx(T.bless + 3.5, 'pg1Ank', 1);         // "...Put the Nang Kwak facing your door..."  (→ ~25.2)
      else if (it === 'phayant') sfx(T.bless + 3.5, 'pg1Apy', 1);     // "...The pha yant — facing your door, under the Buddha."
      else sfx(T.bless + 3.5, 'pg1Atk', 1);                           // "...Wear the takrut every day, on its cord."
      sfx(T.bless + 12.3, 'fm1Abye', 1);                     // "Go well, come back well."  (→ ~27.3)
      sfx(T.bless + 9.5, 'w4frogs', 0.35);                   // the frogs starting outside now the rain has stopped (they hold the
                                                             // breath between Pong's last word and the master's, whichever piece)
      sfx(T.book + 0.6, 'w4page', 0.5);                      // the book opened on his knee
      sfx(T.book - 0.2, 'w4frogs', 0.3);                     // and the frogs go on outside (CP13: 3.4 s of silence after his line)
      sfx(T.book + 1.0, 'q1A1', 1);                          // "I don't know what I saw."  (→ ~37.8)
      sfx(T.book + 1.0, 'w4pen', 0.4);
      fade(T.out - 0.6, T.out, 0, 1); fade(T.out, T.out + 0.8, 1, 0);
      sfx(T.out + 0.2, 'w4after', 0.6);                      // the washed yard: drips, frogs, a far motorbike
      sfx(T.out + 0.5, 'w4sandon', 0.55);                    // his sandals, on again at the step
      sfx(T.out + 1.8, 'pn1guava', 1);                       // "Take some guavas with you... from our tree."  (→ ~48.8)
      sfx(T.out + 9.4, 'q1A2', 1);                           // "Khop khun krap."  (→ ~51.0)
      sfx(T.walk + 0.4, 'pg1A1', 1);                         // "See? I tell you. Very good one. My cousin never lie."  (→ ~56.7)
      sfx(T.walk + 0.6, 'w4steps', 0.35);
      sfx(T.cab - 0.3, 'w4door', 0.5);                       // the pickup's door
      sfx(T.cab + 0.2, 'w4diesel', 0.45);
      sfx(T.cab + 0.6, 'pg1A2', 1);                          // "Strong, right?"  (→ ~58.8)
      sfx(T.cab + 2.4, 'q1A3', 1);                           // "...Maybe."  (→ ~60.7)
      sfx(T.cab + 0.1, 'w4endA', 0.75);                      // the khaen, alone
      sfx(T.wide + 0.4, 'q1A4', 1);                          // "I didn't know what I'd seen in that room. So I let it stay unknown."  (→ ~69.4)
      sfxFade(T.coda - 1.2, T.coda + 0.2, 'w4endA');
      /* THE CODA (the same in every ending; the last image is the ending's own) */
      fade(T.coda - 0.5, T.coda, 0, 1); fade(T.coda, T.coda + 0.8, 1, 0);
      sfx(T.coda + 0.1, 'w4taxi', 0.6);                      // a Singapore taxi in the rain: the wipers, the indicator
      sfx(T.coda + 0.8, 'tx1where', 1);                      // "Where to, boss?"  (→ ~2.4)
      sfx(T.coda + 2.6, 'q1K1', 1);                          // "It's... the shop's at... sorry, uncle. Give me a second."  (→ 8.85)
      sfx(T.coda + 9.2, 'q1K2', 1);                          // "When I got back to Singapore..."  (→ ~12.5)
      fade(T.coda + CODA.k2 - 0.3, T.coda + CODA.k2, 0, 1); fade(T.coda + CODA.k2, T.coda + CODA.k2 + 0.6, 1, 0);
      sfx(T.coda + CODA.k2 + 0.3, 'w4shutter', 0.7);         // the shutter again, in grey light
      sfxFade(T.coda + CODA.k2 - 0.5, T.coda + CODA.k2 + 0.1, 'w4taxi');   // the taxi gone with its picture (CP13: it ran on under the shop)
      sfx(T.coda + 13.4, 'q1K3', 1);                         // "...I stopped feeling like myself."  (→ ~16.3)
      sfx(T.coda + CODA.k2 + 4.4, 'w4pat', 0.5);             // his free hand patting his pocket for the keys in the other
      sfx(T.coda + CODA.k3, 'w4coda', 0.7);                  // the coda's chord
      fade(T.coda + CODA.black, T.coda + CODA.end, 0, 1);
    });
  }

  /* B · THE QUESTION (bad): he asks, and is seen */
  function scQuestion(c, s, api) {
    const { sfx, sfxFade, fade } = api;
    endingScene(c, api, 'B', (T) => {
      sfx(0.3, 'w4drips', 0.5);
      sfx(10.0, 'w4drips', 0.45);                            // the eaves, on into the master's long look (CP13: 1.8 s of silence)
      sfx(0.6, 'q1B1', 1);                                   // "Pong... ask him who's standing behind him."  (→ ~4.4)
      sfx(T.ask + 0.1, 'pg1B1', 1);                          // "Behind? ...Okay. I ask."  (→ ~7.9)
      sfx(T.ask + 4.0, 'pg1B2', 1);                          // (Pong asks the master, in Thai)  (→ ~13.2)
      sfx(T.look + 0.6, 'w4frogs', 0.35);
      sfx(T.look + 1.2, 'w4endB', 0.6);                      // the curious motif, low
      sfx(T.look + 5.2, 'fm1B1', 1);                         // "That one has been in this house longer than me..."  (→ ~25.4)
      sfx(T.pong + 0.2, 'pg1B3', 1);                         // "He say... that one stay in this house longer than him..."  (→ ~34.1)
      sfx(T.who + 0.2, 'fm1B2', 1);                          // "Who taught him?"  (→ ~36.0)
      sfx(T.who + 2.0, 'pg1B4', 1);                          // "He ask... who teach you?"  (→ ~39.5)
      sfx(T.who + 5.9, 'q1B2', 1);                           // "...Nobody."  (→ ~41.6)
      sfx(T.come + 0.2, 'fm1B3', 1);                         // "If he wants to learn, come back. I can teach him."  (→ ~45.7)
      sfx(T.come + 4.0, 'pg1B5', 1);                         // "He say you should come back..."  (→ ~52.0)
      sfx(T.come + 10.6, 'q1B3', 1);                         // "Thank you, Ajahn. Maybe another time."  (→ ~55.6)
      fade(T.card - 0.6, T.card, 0, 1); fade(T.card, T.card + 0.8, 1, 0);
      sfx(T.card + 0.2, 'w4after', 0.6);
      sfx(T.card + 0.4, 'w4sandon', 0.55);
      sfx(T.card + 1.4, 'pn1card', 1);                       // "Ajahn say, call anytime, ka."  (→ ~59.8)
      sfx(T.card + 4.0, 'w4card', 0.5);                      // the card into his hand
      sfx(T.cab - 0.3, 'w4door', 0.5);
      sfx(T.cab + 0.2, 'w4diesel', 0.45);
      sfx(T.cab + 0.4, 'pg1B6', 1);                          // "Brother! You can SEE? Why you never tell me!"  (→ ~67.7)
      sfx(T.cab + 5.2, 'pg1B7', 1);                          // "Next time you bring me, okay? I also want to know my future!"  (→ ~73.9)
      sfx(T.cab + 6.0, 'w4card', 0.35);                      // the card turned over in his fingers
      sfx(T.wide + 0.6, 'q1B4', 1);                          // "I'd asked to understand... and shown a man I didn't know what I could see."  (→ ~81.5)
      sfxFade(T.coda - 1.0, T.coda + 0.3, 'w4after');        // (CP13: it ran 2.3 s into the Singapore taxi)
      sfxFade(T.coda - 1.2, T.coda + 0.2, 'w4endB');
      fade(T.coda - 0.5, T.coda, 0, 1); fade(T.coda, T.coda + 0.8, 1, 0);
      sfx(T.coda + 0.1, 'w4taxi', 0.6);
      sfx(T.coda + 0.8, 'tx1where', 1);
      sfx(T.coda + 2.6, 'q1K1', 1);
      sfx(T.coda + 9.2, 'q1K2', 1);
      fade(T.coda + CODA.k2 - 0.3, T.coda + CODA.k2, 0, 1); fade(T.coda + CODA.k2, T.coda + CODA.k2 + 0.6, 1, 0);
      sfx(T.coda + CODA.k2 + 0.3, 'w4shutter', 0.7);
      sfxFade(T.coda + CODA.k2 - 0.5, T.coda + CODA.k2 + 0.1, 'w4taxi');   // the taxi gone with its picture (CP13: it ran on under the shop)
      sfx(T.coda + 13.4, 'q1K3', 1);
      sfx(T.coda + CODA.k2 + 4.4, 'w4pat', 0.5);
      sfx(T.coda + CODA.k3 + 0.6, 'w4buzz', 0.7);            // his phone lights: the Ajahn
      sfx(T.coda + CODA.k3, 'w4coda', 0.7);
      fade(T.coda + CODA.black, T.coda + CODA.end, 0, 1);
    });
  }

  /* C · CERTAIN (worst): fear decides first */
  function scCertain(c, s, api) {
    const { sfx, sfxFade, fade, phone } = api;
    endingScene(c, api, 'C', (T) => {
      sfx(0.0, 'w4heart', 0.75);                             // his heart taking over
      sfx(0.4, 'q1C0', 1);                                   // "The bowl... the shadow... her. It's all him."  (→ 6.97: "her" 4.05, on her; "It's all him" 6.12, on him)
      sfx(0.2, 'w4endC', 0.6);                               // the tight pulse
      sfx(T.said, 'q1C1', 1);                                // "He's doing something to me."  (→ 9.17)
      sfx(T.up + 0.2, 'w4rise', 0.6);                        // up too fast
      sfx(T.up + 0.8, 'w4cup', 0.7);                         // the cup goes over
      sfx(T.calm + 0.2, 'fm1C1', 1);                         // "Oh... it's all right, it's all right."  (→ ~15.5)
      sfx(T.calm + 3.9, 'fm1C2', 1);                         // "It's still slippery outside. Go carefully."  (→ ~18.4)
      sfx(T.pong + 0.2, 'pg1C1', 1);                         // "He say... go carefully. Outside still slippery."  (→ ~23.2)
      sfx(T.out - 1.2, 'w4sandals', 0.6);                    // his feet into his shoes, wrong
      fade(T.out - 0.4, T.out, 0, 1); fade(T.out, T.out + 0.5, 1, 0);
      sfx(T.out + 0.1, 'w4rainl', 0.55);                     // the last of the rain
      sfx(T.out + 0.4, 'w4sandon', 0.55);
      sfx(T.out + 1.0, 'w4dog', 0.6);                        // the dog barks
      sfx(T.out + 3.4, 'pn1C1', 1);                          // "Wait, wait, an umbrella! ... Rain coming again, ka!"  (→ ~28.8)
      sfx(T.out + 0.6, 'w4steps', 0.45);
      sfx(T.car - 0.2, 'w4door', 0.6);
      sfx(T.car + 0.4, 'pg1C2', 1);                          // "Brother, what happen? He is a good man!"  (→ ~36.5)
      sfx(T.car + 4.6, 'q1C2', 1);                           // "Just drive."  (→ ~38.2)
      sfx(T.road, 'w4diesel', 0.45);
      sfx(T.road + 0.4, 'w4drops', 0.4);
      sfx(T.road + 5.6, 'q1C3', 1);                          // "I was certain before I knew anything. And the certainty came home with me."  (→ ~50.0)
      sfxFade(T.coda - 1.0, T.coda + 0.3, 'w4rainl');        // (CP13: it ran a second into the Singapore taxi)
      sfxFade(T.coda - 1.2, T.coda + 0.2, 'w4endC');
      fade(T.coda - 0.5, T.coda, 0, 1); fade(T.coda, T.coda + 0.8, 1, 0);
      sfx(T.coda + 0.1, 'w4taxi', 0.6);
      sfx(T.coda + 0.8, 'tx1where', 1);
      sfx(T.coda + 2.6, 'q1K1', 1);
      sfx(T.coda + 9.2, 'q1K2', 1);
      fade(T.coda + CODA.k2 - 0.3, T.coda + CODA.k2, 0, 1); fade(T.coda + CODA.k2, T.coda + CODA.k2 + 0.6, 1, 0);
      sfx(T.coda + CODA.k2 + 0.3, 'w4shutter', 0.7);
      sfxFade(T.coda + CODA.k2 - 0.5, T.coda + CODA.k2 + 0.1, 'w4taxi');   // the taxi gone with its picture (CP13: it ran on under the shop)
      sfx(T.coda + 13.4, 'q1K3', 1);
      sfx(T.coda + CODA.k2 + 4.4, 'w4pat', 0.5);
      sfx(T.coda + CODA.k3 + 1.5, 'w4gasp', 0.8);            // he flinches at a shape in the glass
      sfx(T.coda + CODA.k3, 'w4coda', 0.7);
      fade(T.coda + CODA.black, T.coda + CODA.end, 0, 1);
      void phone;
    });
  }

  /* D · ENOUGH (best): he knows when to go */
  function scEnough(c, s, api) {
    const { sfx, sfxFade, fade } = api;
    endingScene(c, api, 'D', (T) => {
      sfx(0.0, 'fm1chant2', 0.45);                           // the chant he began, let finish
      sfx(0.3, 'w4drips', 0.45); sfx(10.2, 'w4drips', 0.45);  // the eaves after the storm (CP13: D's room had none — two silences)
      sfx(19.6, 'w4frogs', 0.3);                             // the frogs starting outside as he wais
      sfxFade(T.ask - 1.4, T.ask - 0.2, 'fm1chant2');
      sfx(T.ask - 0.2, 'w4bell', 0.4);                       // a small bell: the chant's end
      sfx(T.ask + 0.4, 'q1D1', 1);                           // "Pong... please tell him thank you. This is enough for me today."  (→ ~13.4)
      sfx(T.ask + 6.8, 'pg1D1', 1);                          // (Pong, to the master, in Thai)  (→ ~18.7)
      sfx(T.nod + 0.2, 'fm1D1', 1);                          // "Of course, of course; no matter, as you like."  (→ ~21.8)
      fade(T.out - 0.6, T.out, 0, 1); fade(T.out, T.out + 0.8, 1, 0);
      sfx(T.out + 0.2, 'w4after', 0.6);
      sfx(T.out + 0.5, 'w4sandon', 0.55);
      sfx(T.out + 1.0, 'pg1D2', 1);                          // "Finish already? He haven't even done the full one!"  (→ ~29.1)
      sfx(T.out + 5.6, 'q1D2', 1);                           // "It's okay. Let's sit for a bit. The road's still flooded."  (→ ~34.7)
      sfx(T.out + 0.8, 'w4steps', 0.35);
      sfx(T.shelter + 0.4, 'w4frogs', 0.45);                 // the frogs beginning across the wet paddy
      sfx(T.shelter + 1.6, 'pg1D3', 1);                      // "You know... I also never actually ask who is his teacher."  (→ ~43.0)
      sfx(T.shelter + 7.6, 'q1D3', 1);                       // "Next time... we ask first."  (→ ~46.7)
      sfx(T.shelter + 11.2, 'w4page', 0.5);
      sfx(T.shelter + 11.6, 'q1D4', 1);                      // "Some things I don't need to understand today."  (→ ~51.1)
      sfx(T.shelter + 11.6, 'w4pen', 0.4);
      sfx(T.shelter + 10.0, 'w4endD', 0.7);                  // the phin
      sfx(T.dusk + 0.6, 'q1D5', 1);                          // "I didn't need to understand it to know it was time to go."  (→ ~58.1)
      sfxFade(T.coda - 1.2, T.coda + 0.2, 'w4endD');
      fade(T.coda - 0.5, T.coda, 0, 1); fade(T.coda, T.coda + 0.8, 1, 0);
      sfx(T.coda + 0.1, 'w4taxi', 0.6);
      sfx(T.coda + 0.8, 'tx1where', 1);
      sfx(T.coda + 2.6, 'q1K1', 1);
      sfx(T.coda + 9.2, 'q1K2', 1);
      fade(T.coda + CODA.k2 - 0.3, T.coda + CODA.k2, 0, 1); fade(T.coda + CODA.k2, T.coda + CODA.k2 + 0.6, 1, 0);
      sfx(T.coda + CODA.k2 + 0.3, 'w4shutter', 0.7);
      sfxFade(T.coda + CODA.k2 - 0.5, T.coda + CODA.k2 + 0.1, 'w4taxi');   // the taxi gone with its picture (CP13: it ran on under the shop)
      sfx(T.coda + 13.4, 'q1K3', 1);
      sfx(T.coda + CODA.k2 + 4.4, 'w4pat', 0.5);
      sfx(T.coda + CODA.k3, 'w4coda', 0.7);
      fade(T.coda + CODA.black, T.coda + CODA.end, 0, 1);
    });
  }

  (window.__CHAPTERS__ = window.__CHAPTERS__ || {}).e4c1 = Object.assign(DATA, {
    build,
    scenes: [scStill, scQuestion, scCertain, scEnough],
    intro: introFilm
  });
})();
