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
  /* (R36, 18 Nov: a Singapore night's sky is never black: the city's light on its haze, warm and low, a dull purple-grey
     overhead; the opening now begins on it. Build 20's photographs still read it black above the blocks: a step lighter) */
  const FLAT = sky({
    stops: [[0.00, '#5a463e'], [0.10, '#463837'], [0.30, '#2e2a36'], [0.60, '#1b1a24'], [1.00, '#0e0f17']],
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
  const SECS = {      // 74 of 74 MEASURED from their takes; the rest estimated at the speaker's pace
    /* him */
    'q4o1': 6.65, 'q4o2': 4.65, 'q4h1': 3.61, 'q4h2': 3.53, 'q4h3': 9.77, 'q4s1': 4.01, 'q4s2': 3.05, 'q4s3': 4.09,
    'q4f1': 2.97, 'q4f2': 2.89, 'q4f3': 2.33, 'q4f4': 3.61, 'q4A1': 3.53, 'q4B1': 3.21, 'q4C0': 6.41, 'q4C1': 3.69,
    'q4D1': 4.25, 'q4R1': 2.17, 'q4A': 4.25, 'q4B': 3.29, 'q4C': 3.85, 'q4D': 4.65,
    /* Ravi */
    'rv4o1': 2.6, 'rv4h1': 8.33, 'rv4h2': 6.73, 'rv4f1': 1.93, 'rv4t1': 1.77, 'rv4A1': 2.51, 'rv4A2': 0.61,
    'rv4C1': 2.58, 'rv4D1': 2.98, 'rv4R1': 4.59,
    /* Grandmaster Pho */
    'ph4h0': 7.53, 'ph4h1': 6.81, 'ph4h2': 2.81, 'ph4s0': 8.57, 'ph4s1': 4.57, 'ph4s2': 6.17, 'ph4s3': 8.45,
    'ph4s4': 9.77, 'ph4b0': 4.86, 'ph4b1': 4.65, 'ph4b2': 7.78, 'ph4b3': 4.36, 'ph4b4': 4.41, 'ph4b5': 5.2,
    'ph4b6': 4.43, 'ph4b7': 1.47, 'ph4f1': 4.95, 'ph4f2': 2.59, 'ph4f3': 5.37, 'ph4A1': 6.61, 'ph4B0': 0.62,
    'ph4B1': 9.13, 'ph4C1': 5.13, 'ph4D0': 2.24, 'ph4D1': 11.05, 'ph4z0': 10.56, 'ph4z1': 6.63,
    /* Mala */
    'ml4h1': 14.65, 'ml4h2': 9.61, 'ml4h3': 7.61, 'ml4t1': 1.13, 'ml4t2': 1.45, 'ml4A1': 2.27, 'ml4B1': 1.62,
    'ml4B2': 1.01, 'ml4B3': 1.38, 'ml4R1': 3.53, 'ml4z1': 2.56,
    /* Amma */
    'am4h1': 1.81, 'am4A1': 0.72, 'am4C1': 1.25, 'am4z1': 1.18
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
      { k: 'B', text: 'Throw the holy water at the spirit on her back',
        d: { sanity: -9, awareness: 3, wisdom: -9 }, verdict: 'bad',
        say: 'I threw the water. It was never mine to fight.',
        teach: 'Sensitivity only lets you experience something; cultivation is what teaches you how to examine it. You saw it and threw everything you had at it. Your part was the holy water, and keeping the spirits away from her. The work was your teacher’s.' },
      { k: 'C', text: 'Go to him: tell him she is safe, and stay with him',
        d: { sanity: 6, awareness: 6, wisdom: 18 }, verdict: 'best',
        say: 'I told him only what I saw. He held her hand.',
        teach: 'Experience teaches you not to jump to conclusions. You told her son what you saw and nothing more, and he stayed with her.' },
      { k: 'D', text: 'Keep your place: hold the holy water, trust your teacher',
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
    /* (released at v27.0, 18 Nov: in the run, after chapter 3; it was a preview chapter until then, D9) */

    /* SPIRIT VISION (the fiftieth seam, plan §5): this chapter's colours and sounds. The spirits are handed to the
       engine by the build (ctx.spirit) */
    /* SPIRIT VISION's own sound (masters/v27.0/sound.sh): the wave out (u4vison) and back (u4visoff, the same swell run
       backwards, as the wave is), its bed and its music brought up with it while the world's beds fall back 60 % under
       it, and his heart: up to 112 as he opens, its beat heard (his own thump, harmonised for a phone), back to 76 */
    /* (R61, Chad, 18 Nov evening: "make the tracer effect just ever so slightly slower so that the player can see the
       tracing effect even more? Also make the tracer effect look a little more obvious visually": out in 1.6 s where it
       was 1.3, home in 1.25 where it was 1.0; its front 18 cm wide where it was 12, the edges behind it traced half again
       as bright) */
    /* (R105, Chad, 19 Nov: the tracer "more obvious, slightly wider, blue colour stronger ... slightly slower ... linger on
       slightly longer as it travels outwards", and tracing more of everything): out over 2.2 s where it was 1.6 and home
       over 1.6 where it was 1.25; its band half as wide again (0.18 to 0.27); a deeper blue (0x3a96ff, where the engine's
       is the pale 0x8cf2ff) laid on before its light is added, its light stronger on surfaces and edges (0.32 and 3.2,
       from 0.22 and 2.6); every edge it crosses keeping the blue for 0.7 s behind it; the finer lines traced too */
    vision: { outSecs: 2.2, inSecs: 1.6, band: 0.27, line: 0.24,
              front: 0x3a96ff, glow: 0.32, burn: 3.2, laid: 0.55, linger: 0.7, detail: 1,
              heart: { bpm: 112, rest: 76, sound: 'u4heart', vol: 0.55, secs: 2.2, restSecs: 4.5 },
              sound: { on: 'u4vison', off: 'u4visoff', vol: 0.85, bed: ['u4visbed', 0.56], music: ['u4vismus', 0.32], duck: 0.6 } },
    /* THE HOLY WATER (the fifty-first seam, plan §6): his own hands, the small silver bowl in his left, a flick of the
       right hand's fingers a press, a dip at Grandmaster Pho's bowl to fill it again; the HUD says the chapter's words */
    /* the holy water is IN HIS HANDS only once Grandmaster Pho has given him the bowl (the item, given in the blessing):
       until then the hands are his own and empty (an item-less weapon is always out) */
    /* (Chad, 18 Nov: "make the aoe of the water flicking bigger, and slightly increase the amount of times the water can be
       flicked before reloading": fourteen flicks a bowl where there were ten, and the drops thrown wider, as wide as what a
       flick now reaches: c_story.js onShot) */
    weapon: { hands: 'own', pose: 'bowl', item: 'holywater', rounds: 14, endless: true, fireGap: 0.35, spray: { count: 16, spread: 0.24 },
              /* (R57, Chad, 18 Nov evening: "When the player runs out of water, and tries to flick, there should be a clear HUD UI
                 message asking the player to reload the water.") */
              words: { fire: 'FLICK', reload: 'DIP', empty: 'Out of holy water. DIP at the big bowl to refill.' }, shot: 'u4flick', reload: 'u4dip', empty: 'uiclick',
              /* (Chad, 18 Nov: "Flick icon can be a spraying water icon instead of a word."): the button draws water flung
                 (shell.html .wpnIco-spray), FLICK stays its name for a screen reader; no AIM (the water has no zoom) */
              icon: 'spray',
              /* (Chad, 18 Nov evening, R54: "why are there the hands holding the bowl like that? there is no need to have this
                 pose, remove the hands and bowl."): nothing drawn in his hands while the water is out (main.js `view`) */
              view: false },

    assets: [
      /* the people, the spirits and the things made for this chapter (masters/v27.0/make.sh) */
      /* >>> this chapter's own keys: written by masters/v27.0/keys.py (edit its table, not this list) >>> */
      'p4amma', 'p4ammam', 'p4ammah', 'p4ravi', 'p4ravim', 'p4ravih', 'p4mala', 'p4malam', 'p4malah', 'p4oppress',
      'p4wander', 'p4large', 'p4appa', 'w4wheelchair', 'w4prayershelf', 'w4vilakku', 'w4waterbowl', 'w4bigbowl',
      'w4sofa', 'w4cabinet', 'w4dintable', 'w4dinechair', 'w4framesmall', 'w4hugger', 'w4folder', 'w4gate',
      'w4frameport', 'w4armchair', 'w4tubelight', 'w4tvconsole', 'w4stool', 'w4standfan', 'w4shoerack', 'w4tulsi',
      'w4doorleaf', 'w4fridge', 'w4pilltray', 'w4clock', 'w4phonetable', 'w4bed', 'w4commode', 'w4poles',
      'w4thoranam', 'w4altartray', 'w4coffee', 'w4garland', 'w4angsana', 'w4foxpalm', 'w4streetlamp', 'w4bougain',
      'w4corrpots', 'w4bicycle', 'w4clothesrack', 'w4t_kali', 'w4t_ganesha', 'w4t_murugan', 'w4t_appa',
      'w4t_oldphoto', 'w4t_oldphotofull', 'iconwater',
      /* <<< this chapter's own keys <<< */
      /* Grandmaster Pho, Chad's own model, as chapter 3 cast him (reuseInEpisode) */
      'pho'
    ],
    /* FRESH (chaptertest): what this chapter takes from the chapters of its own episode, declared (Chad, v17.4) */
    reuse: {},
    reuseInEpisode: { pho: "Grandmaster Pho himself, Chad's own model in his look D, as chapter 3 cast him: the same man, come to Singapore" },
    placeholders: {},
    items: ['holywater',                         // the small silver bowl, given in the blessing (kit.give: c_story.js takeWater)
            'amulet'],                           // (shown, never given: his Luang Phor Phiboon amulet in the call, kit.unlock gold, c_story.js; its model warmed by the curtain)

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
      /* (18 Nov) said under the reticle when the eye is pressed while his teacher holds his sight shut (the engine's visionHeldSay) */
      visionHeld: 'Grandmaster Pho closed your Spirit Vision. Breathe.',
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
      objLook: 'Look at each spirit · {n}/3',
      hotLook: 'Look',
      objClose: 'Close your Spirit Vision',
      // PLAY III · the blessing (§4.3)
      objWater: 'Take the holy water',
      hotWater: 'Take the holy water',
      dipHere: 'Fill it again at his bowl.',
      objHold: 'Keep the green spirits away from Amma',
      guardTitle: 'PROTECT AMMA',
      /* (Chad, 18 Nov: "I think the 'hold the room' instructions are too long and can be shortened , but it still needs to
         read natural, direct and straightforward."; the button shows water now, not the word FLICK, and its refill an arrow) */
      /* (19 Nov, R96: its sentence on the strain, approved by Chad as written, after the sentence on Spirit Vision) */
      guardBrief: 'Grandmaster Pho is blessing Amma. Keep the green spirits away from her. Open your Spirit Vision to see them, and tap the water button to flick holy water at them. Spirit Vision strains you. Close it when the ring turns red, and open it again when it empties. Refill at his bowl with the arrow button. If her bar runs out, the blessing fails.',
      guardBriefKey: 'Grandmaster Pho is blessing Amma. Keep the green spirits away from her. Open your Spirit Vision (V) to see them, and click or press Space to flick holy water at them. Spirit Vision strains you. Close it when the ring turns red, and open it again when it empties. Refill at his bowl with R. If her bar runs out, the blessing fails.',
      // the fight's stakes and the call (Chad, 18 Nov: plan §0 R16 to R29)
      ammaBar: 'Amma',
      objGold: 'Flick the golden water',
      // the card when her life runs out: what happened, over Master Z's own words (the case file S1·12, word for word)
      lostSay: 'Too many green spirits reached Amma. Her cry broke the blessing, and it could not be finished.',
      lostTeach: 'Learning when to open myself and when to close is the true path of cultivation. Today I can use these sensitivities to help others, which is the point of them.',
      noAltar: 'Not at her altar.',
      // the chant's captions: the Pali as chanted over its meaning (v21.31), Thanissaro Bhikkhu's A Chanting Guide,
      // word for word (docs/research/V27.0-BLESSING.md §1.3; docs/research/V27.0-VERDICTS.md B13, B14)
      cap1: 'Katā me rakkhā, Katā me parittā. Paṭikkamantu bhūtāni.',
      cap1Sub: 'I have made this protection, I have made this spell. May the beings depart.',
      cap2: 'Dukkhappattā ca niddukkhā, Bhayappattā ca nibbhayā, Sokappattā ca nissokā, Hontu sabbe’pi pāṇino.',
      cap2Sub: 'May all beings: who have fallen into suffering be without suffering, who have fallen into danger be without danger, who have fallen into sorrow be without sorrow.',
      // the card's What you did
      noteHistory: 'You learned her history before you used your Spirit Vision.',
      noteAppa: 'You flicked holy water at her husband, who was watching over her.',
      noteNerve: 'You kept your Spirit Vision open too long. Your teacher closed it for you.',
      noteKept: 'You kept the green spirits away from her family.'
    },
    sayPrefix: 'q4'
  };
