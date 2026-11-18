/* Episode 4 · Chapter 4 · "The Woman Who Rose From Her Wheelchair"
   ---------------------------------------------------------------------------
   THE FOURTH CHAPTER OF CASE FILE 4, "The Teacher In White": S1·13, case one. Months into his training, Grandmaster
   Pho comes to Singapore, and a Tamil family in an HDB block asks him to see their mother: seven years in a wheelchair,
   every doctor, many practitioners, nothing changed. She once served Mae Kali. The student goes with him, and it is
   the first time the work is done in front of him, at night, in a home, with something in the room only he can see.

   THIS FILE IS GENERATED (masters/v27.0/assemble.py, from masters/v27.0/parts/*.js): edit the parts and assemble
   again, never this file. docs/V27.0-E4C4-PLAN.md is the design (§0 Chad's words, the contract; §4 every beat and
   line); docs/V27.0-E4C4-BUILD.md is where the build stands.

   CHAD'S DIRECTION (17 Nov 2026, the plan's §0): her own HDB flat in Singapore; she speaks English; her family, her,
   Grandmaster Pho and the player in the room; the horror of episodes 1 and 2 brought back; new ways to fight and to act,
   as the live range was in episode 2; and SPIRIT VISION, a button on the HUD like the torch's (the engine's fiftieth
   seam): the world's colours inverted, a slight blur and a vignette, spirits drawn as glowing shapes only through it,
   a wave of light out over every edge when it opens and back to him when it shuts, its own sounds, the heart.

   THE CASE FILE'S LESSON IS THE CHAPTER'S SHAPE: she had seen the doctors first (history before conclusions); a
   sensitivity only lets him see, the work is his teacher's (the holy water and the room are his part); and not
   everything he sees is against him (the husband who watches over her; the goddess's light at her altar).

   FAIRNESS (the standing rule: no practice and no practitioner is ever the villain). Her goddess is the protector,
   never the cause; her trance is shown as her own people know it, with respect; every practitioner the family tried is
   sincere; the hungry ones come for a share of merit, and are released, never destroyed. GOLD is Grandmaster Pho's
   alone; her goddess's presence is a dark blue light, never a figure.

   HE IS NEVER SEEN: every shot is his eyes. THE ENDING STAYS THAT NIGHT, in her flat: she stands, and it stops there. */

(() => {
  'use strict';

  let S = null;

  /* ---------------------------------------------------- the light (painted, never a lamp added on screen: v15.1)
     The build sheet's axes (docs/research/V27.0-HDB.md): the origin the middle of her main door's opening on the
     corridor's face, +z into the flat, +x to the right of someone walking in, y up. Her flat faces the corridor; the
     estate is beyond the corridor's parapet, to -z. */
  const sky = (o) => Object.assign({ stars: 0, moon: 0, sun: 0, clouds: 0 }, o);
  /* HER FLAT AT NIGHT: a fluorescent tube in the middle of the living room's ceiling (cool white, even, from above),
     and the estate's night through the corridor windows. The sky is Singapore's at night: never black, an orange-grey
     glow from the city low down, a few stars */
  const FLAT = sky({
    stops: [[0.00, '#3a2f30'], [0.10, '#2a2328'], [0.30, '#191820'], [0.60, '#101119'], [1.00, '#0a0b12']],
    bg: 0x14131a, fog: [0x14131a, 0.004],
    hemi: [0xe8eef6, 0x9a8f7e, 0.95], key: [0xf2f6ff, 0.9, 1.0, 2.5, 2.6], fill: [0xb8c4d8, 0.22],
    stars: 0.25, moon: 0,
    vmHemi: [0xe8eef6, 0x857a6c, 0.9], vmKey: [0xf2f6ff, 0.62] });
  /* (18 Nov, photographed: the hemisphere's ground was a dark brown, so every face looking down, the ceiling first,
     drew near black under a lit tube; it is the beige floor's bounce now, the way a tiled room under a tube is lit) */
  /* THE BLESSING: the tube dead, the fan stopped, the TV dead; the lamp at her altar and the estate through the grilles
     are all the light there is. The key is the lamp: warm, low, from the altar's wall; the fill the estate's cold */
  const DARK = sky({
    stops: [[0.00, '#3a2f30'], [0.10, '#2a2328'], [0.30, '#191820'], [0.60, '#101119'], [1.00, '#0a0b12']],
    bg: 0x0c0b10, fog: [0x0c0b10, 0.012],
    hemi: [0x5a5a78, 0x1c140c, 0.22], key: [0xffb060, 0.55, -0.2, 1.5, 5.0], fill: [0x6070a0, 0.12],
    stars: 0.25, moon: 0,
    vmHemi: [0x5a5a78, 0x1c140c, 0.36], vmKey: [0xffb878, 0.42] });
  /* THE ESTATE (the opening film): a slab block's corridors in rows of white light, white street lamps, the sky's city
     glow; the key is the corridor's own battens */
  const ESTATE = sky({
    stops: [[0.00, '#4a3a36'], [0.08, '#352a2e'], [0.25, '#1e1b24'], [0.55, '#12131c'], [1.00, '#0a0b12']],
    bg: 0x16141c, fog: [0x1a1720, 0.006],
    hemi: [0x9aa4c0, 0x2a2420, 0.42], key: [0xeef4ff, 0.65, 0, 2.4, -0.9], fill: [0x8090b4, 0.18],
    stars: 0.3, moon: 0,
    vmHemi: [0x9aa4c0, 0x2a2420, 0.5], vmKey: [0xeef4ff, 0.5] });
  const PRESETS = { FLAT, DARK, ESTATE };

  /* every line's length: an ESTIMATE at the speaker's pace until its take is measured at M8 (the registry will carry
     the same numbers); the queue books its window by it and every film's times are built from it, so a re-said line
     moves what follows it. The names are QUOTED on purpose: build.py gives a sound to a chapter's own pack only when
     the chapter names it in quotes (v21.1). Written by masters/v27.0/script/secs.py from masters/v27.0/script/lines.py. */
  /* SECS BEGIN */
  const SECS = {      // 45 of 45 MEASURED from their takes; the rest estimated at the speaker's pace
    /* him */
    'q4o1': 6.65, 'q4o2': 4.73, 'q4h1': 3.61, 'q4h2': 3.53, 'q4h3': 9.77, 'q4s1': 4.01, 'q4s2': 3.05, 'q4s3': 4.09,
    'q4A1': 3.53, 'q4B1': 3.21, 'q4C0': 6.41, 'q4C1': 3.69, 'q4D1': 4.25, 'q4A': 4.25, 'q4B': 3.29, 'q4C': 3.85,
    'q4D': 4.65,
    /* Ravi */
    'rv4o1': 2.6, 'rv4h1': 8.33, 'rv4h2': 6.73, 'rv4t1': 1.77,
    /* Grandmaster Pho */
    'ph4h0': 6.81, 'ph4h1': 3.13, 'ph4s0': 7.14, 'ph4s1': 0.65, 'ph4s2': 6.17, 'ph4s3': 8.45, 'ph4s4': 6.65,
    'ph4b0': 4.86, 'ph4b1': 2.06, 'ph4b2': 2.65, 'ph4A1': 6.25, 'ph4B0': 0.62, 'ph4B1': 6.41, 'ph4C1': 5.13,
    'ph4D0': 2.24, 'ph4D1': 8.61, 'ph4z0': 10.56, 'ph4z1': 6.63,
    /* Mala */
    'ml4h1': 14.65, 'ml4h2': 9.61, 'ml4h3': 7.61, 'ml4t1': 1.13, 'ml4t2': 1.45,
    /* Amma */
    'am4h1': 1.81
  };
  /* SECS END */

  /* A FILM'S TIMES are built from SECS (chapter 3's tl): a list of ['line', gap], [secs] (a pause) and ['@mark'] (a named
     moment); the answer maps every line and mark to its start on the film's own clock, and `end` to where the list ends,
     so the cues and the pictures read the same numbers, and a re-measured take moves everything after it (v5.15). */
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

  /* THE OPENING FILM (§4.0): black and his two lines; the estate at night; the lift lobby; the corridor and her gate;
     Ravi at the gate; inside, the room; the turn of her head and the window's reflection; the title (M7) */
  const OPENT = tl(0, [[1.2], ['q4o1', 1.0], ['@estate'], [1.0], ['q4o2', 2.0], ['@lobby'], [6.5], ['@corridor'], [6.0], ['@gate'], [1.2],
                       ['rv4o1', 1.0], ['@inside'], [6.0], ['@turn'], [3.4], ['@window'], [2.2], ['@black'], [1.4]]);

  const DATA = {
    id: 4,
    episode: 4,
    title: 'The Woman Who Rose From Her Wheelchair',
    cardLabel: 'Chapter 4',
    cardTitle: 'The Woman Who Rose From Her Wheelchair',
    brief: 'An HDB flat at night. Grandmaster Pho has been asked to see a mother who has not walked in seven years. You go with him.',
    /* the prompt is the turning point's own picture (the plan's §4.4): the decision sits AT it, as Chad's own did in
       episode 2 chapter 5 */
    prompt: 'Her son is running at her. Grandmaster Pho cannot let go.',
    /* THE DECISION (the plan's §4.4; its ranks the default D3: C best, D good, B bad, A worst). Four different kinds of
       answer: force on another person (A), the student's own fight (B), the people in the room (C), his own part held
       (D). Each card's lesson is Master Z's own words from S1·13 first, then what you did. Checked against every earlier
       decision of episodes 3 and 4 (the plan's §4.6): none repeats one. */
    choices: [
      { k: 'A', text: 'Grab him and hold him back',
        d: { sanity: -6, awareness: -3, wisdom: -18 }, verdict: 'worst', critical: true,
        say: 'I held her son back. His fear was only love.',
        teach: 'Look carefully at a person’s history, their previous practices and their circumstances before reaching any conclusion. You looked at the son running and saw a man in the way. He was her son, and his fear was only love.' },
      { k: 'B', text: 'Throw the water at the thing on her back',
        d: { sanity: -9, awareness: 3, wisdom: -9 }, verdict: 'bad',
        say: 'I threw the water. It was never mine to fight.',
        teach: 'Sensitivity only lets you experience something; cultivation is what teaches you how to examine it. You saw it and threw everything you had at it. Your part was the water and the room. The work was your teacher’s.' },
      { k: 'C', text: 'Go to him: tell him she is safe, and stay with him',
        d: { sanity: 6, awareness: 6, wisdom: 18 }, verdict: 'best',
        say: 'I told him only what I saw. He held her hand.',
        teach: 'Experience teaches you not to jump to conclusions. You told her son what you saw and nothing more, and he stayed with her.' },
      { k: 'D', text: 'Keep your place: hold the water, stay closed, trust your teacher',
        d: { sanity: 3, awareness: 0, wisdom: 9 }, verdict: 'good',
        say: 'I held my place. Next time, I see the people too.',
        teach: 'Sensitivity only lets you experience something; cultivation is what teaches you how to examine it. You held your part and your teacher’s work was done. There were two people afraid in that room, and you were the one who could see.' }
    ],
    /* S1·13's own lesson, the case file's words exactly, chosen and in its order (no Pali term is added: v11.10) */
    core: 'If you or someone you love cannot walk properly, see a doctor first and keep seeing them: she had already been through the doctors before she ever came to us, and that order is the right one. Look carefully at a person’s history, their previous practices and their circumstances before reaching any conclusion. Sensitivity only lets you experience something; cultivation is what teaches you how to examine it.',

    /* units metres, y up; the build sheet's axes (above). Play begins just inside her door, turned into the room: her
       chair before her altar on the far wall is what a portrait phone must see first */
    spawn:     { x: 0.15, y: 1.62, z: 1.0, rot: Math.PI },   // facing into the room, her chair and her altar (a turn of 0 looks back at the door)
    shrine:    { x: -0.15, z: 3.9 },             // the engine's anchor (ghost: null): her chair, the chapter's pile
    ghostHome: { x: -0.15, z: 3.9 },
    /* the flat and its corridor: the living room, her room, the passage and the kitchen are walked; the bedrooms and the
       baths are behind their doors (stage.keepIn is the walked part) */
    bounds:    { minX: -3.7, maxX: 6.6, minZ: -1.9, maxZ: 11.1 },

    ghost: null,
    fireLight: null,
    daylight: FLAT,
    /* (the speed-up of v26.11 chapter 3 took: a picture's decoded copy let go once it is on the graphics chip) */
    render: { freePictures: true },
    /* a PREVIEW chapter until the release (D9): out of the run, opened by ?ch=e4c4 only, saving and unlocking nothing */
    preview: true,

    /* SPIRIT VISION (the fiftieth seam, plan §5): this chapter's colours and sounds. The spirits are handed to the
       engine by the build (ctx.spirit) */
    /* SPIRIT VISION's own sound (masters/v27.0/sound.sh): the wave out (u4vison) and back (u4visoff, the same swell run
       backwards, as the wave is), its bed and its music brought up with it while the world's beds fall back 60 % under
       it, and his heart: up to 112 as he opens, its beat heard (his own thump, harmonised for a phone), back to 76 */
    vision: { heart: { bpm: 112, rest: 76, sound: 'u4heart', vol: 0.55, secs: 2.2, restSecs: 4.5 },
              sound: { on: 'u4vison', off: 'u4visoff', vol: 0.85, bed: ['u4visbed', 0.56], music: ['u4vismus', 0.32], duck: 0.6 } },
    /* THE HOLY WATER (the fifty-first seam, plan §6): his own hands, the small silver bowl in his left, a flick of the
       right hand's fingers a press, a dip at Grandmaster Pho's bowl to fill it again; the HUD says the chapter's words */
    /* the holy water is IN HIS HANDS only once Grandmaster Pho has given him the bowl (the item, given in the blessing):
       until then the hands are his own and empty (an item-less weapon is always out) */
    weapon: { hands: 'own', pose: 'bowl', item: 'holywater', rounds: 10, endless: true, fireGap: 0.35, spray: { count: 9 },
              words: { fire: 'FLICK', reload: 'DIP' }, shot: 'u4flick', reload: 'u4dip', empty: 'uiclick' },

    assets: [
      /* the people, the spirits and the things made for this chapter (masters/v27.0/make.sh) */
      /* >>> this chapter's own keys: written by masters/v27.0/keys.py (edit its table, not this list) >>> */
      'p4amma', 'p4ammam', 'p4ammah', 'p4ravi', 'p4ravim', 'p4ravih', 'p4mala', 'p4malam', 'p4malah', 'p4oppress',
      'p4wander', 'p4large', 'p4appa', 'w4wheelchair', 'w4prayershelf', 'w4vilakku', 'w4waterbowl', 'w4bigbowl',
      'w4sofa', 'w4cabinet', 'w4dintable', 'w4dinechair', 'w4framesmall', 'w4hugger', 'w4folder', 'w4gate',
      'w4frameport', 'w4armchair', 'w4tubelight', 'w4tvconsole', 'w4stool', 'w4standfan', 'w4shoerack', 'w4tulsi',
      'w4doorleaf', 'w4fridge', 'w4pilltray', 'w4clock', 'w4phonetable', 'w4bed', 'w4commode', 'w4poles',
      'w4thoranam', 'w4altartray', 'w4coffee', 'w4garland', 'w4t_kali', 'w4t_ganesha', 'w4t_murugan', 'w4t_appa',
      'iconwater',
      /* <<< this chapter's own keys <<< */
      /* Grandmaster Pho, Chad's own model, as chapter 3 cast him (reuseInEpisode) */
      'pho'
    ],
    /* FRESH (chaptertest): what this chapter takes from the chapters of its own episode, declared (Chad, v17.4) */
    reuse: {},
    reuseInEpisode: { pho: "Grandmaster Pho himself, Chad's own model in his look D, as chapter 3 cast him: the same man, come to Singapore" },
    placeholders: {},
    items: ['holywater'],                        // the small silver bowl, given in the blessing (kit.give: c_story.js takeWater)

    musicVol: 0,
    /* THE BEDS (M8): every one at 0 here; the chapter's mixer sets each by the room and the beat */
    /* THE BEDS, every one at 0 here: mixBeds (c_tsound.js) sets each by the beat, and a film sets its own */
    ambience: { beds: [['u4flatbed', 0], ['u4estate', 0], ['u4histmus', 0], ['u4dark', 0], ['u4whisper', 0], ['u4corridor', 0]] },
    voiceLine: null,

    words: {
      approach: '',
      act: 'E to act',
      actTouch: 'Tap to act',
      interact: 'E to answer',
      interactTouch: 'Tap to answer',
      actLine: 'Press E to answer',
      actLineTouch: 'Tap to answer',
      // PLAY I · history first (§4.1)
      objHistory: 'Learn her history · {n}/5',
      hotRavi: 'Talk to Ravi',
      hotMala: 'Talk to Mala',
      hotFolder: 'Read the letters',
      /* the clinic's letter, read on the screen while he thinks his line (§4.1 source 3): what it says, over what it is */
      letter: '“No structural cause identified. Physiotherapy advised. Review in six months.”',
      letterSub: 'The last of many letters in a thick folder, from many clinics.',
      hotOld: 'Look at the old photograph',
      hotAppa: 'Look at his photograph',
      objAmma: 'Go to her',
      hotAmma: 'Go to her',
      objTell: 'Tell Grandmaster Pho what you learned',
      hotTell: 'Tell him',
      // PLAY II · the sight (§4.2)
      objOpen: 'Open your Spirit Vision',
      objLook: 'Look at each presence · {n}/3',
      hotLook: 'Look',
      objClose: 'Close your Spirit Vision',
      // PLAY III · the blessing (§4.3)
      objWater: 'Take the holy water',
      hotWater: 'Take the holy water',
      dipHere: 'Fill it again at his bowl.',
      objHold: 'Keep the room',
      guardTitle: 'HOLD THE ROOM',
      guardBrief: 'Keep the room while Grandmaster Pho blesses her. Open your Spirit Vision to see them. Tap FLICK to send them back with the holy water, and DIP to fill the bowl again at his bowl. Keep them from her, from her family and from you. Not everything you see is against you.',
      guardBriefKey: 'Keep the room while Grandmaster Pho blesses her. Open your Spirit Vision (V) to see them. Click or press Space to flick the holy water and send them back, and R to dip the bowl again at his bowl. Keep them from her, from her family and from you. Not everything you see is against you.',
      noAltar: 'Not at her altar.',
      // the chant's captions: the Pali as chanted over its meaning (v21.31), Thanissaro Bhikkhu's A Chanting Guide,
      // word for word (docs/research/V27.0-BLESSING.md §1.3; docs/research/V27.0-VERDICTS.md B13, B14)
      cap1: 'Katā me rakkhā, Katā me parittā. Paṭikkamantu bhūtāni.',
      cap1Sub: 'I have made this protection, I have made this spell. May the beings depart.',
      cap2: 'Dukkhappattā ca niddukkhā, Bhayappattā ca nibbhayā, Sokappattā ca nissokā, Hontu sabbe’pi pāṇino.',
      cap2Sub: 'May all beings: who have fallen into suffering be without suffering, who have fallen into danger be without danger, who have fallen into sorrow be without sorrow.',
      // the card's What you did
      noteHistory: 'You learned her history before you looked.',
      noteAppa: 'You threw water at the one who was watching over her.',
      noteNerve: 'Your nerve ran out. Your teacher closed your sight for you.',
      noteKept: 'You kept the room.'
    },
    sayPrefix: 'q4'
  };
