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
  const SECS = {      // 69 of 69 MEASURED from their takes; the rest estimated at the speaker's pace
    /* him */
    'q4o1': 6.65, 'q4o2': 4.73, 'q4h1': 3.61, 'q4h2': 3.53, 'q4h3': 9.77, 'q4s1': 4.01, 'q4s2': 3.05, 'q4s3': 4.09,
    'q4f1': 2.97, 'q4f2': 2.89, 'q4f3': 2.33, 'q4f4': 3.61, 'q4A1': 3.53, 'q4B1': 3.21, 'q4C0': 6.41, 'q4C1': 3.69,
    'q4D1': 4.25, 'q4A': 4.25, 'q4B': 3.29, 'q4C': 3.85, 'q4D': 4.65,
    /* Ravi */
    'rv4o1': 2.6, 'rv4h1': 8.33, 'rv4h2': 6.73, 'rv4f1': 1.93, 'rv4t1': 1.77, 'rv4A1': 2.51, 'rv4A2': 0.61,
    'rv4C1': 2.58, 'rv4D1': 2.98,
    /* Grandmaster Pho */
    'ph4h0': 7.53, 'ph4h1': 6.81, 'ph4s0': 8.57, 'ph4s1': 3.58, 'ph4s2': 6.17, 'ph4s3': 8.45, 'ph4s4': 9.77,
    'ph4b0': 4.86, 'ph4b1': 4.65, 'ph4b2': 7.78, 'ph4b3': 4.36, 'ph4b4': 4.41, 'ph4b5': 5.2, 'ph4f1': 4.95,
    'ph4f2': 2.59, 'ph4f3': 5.37, 'ph4A1': 6.61, 'ph4B0': 0.62, 'ph4B1': 9.13, 'ph4C1': 5.13, 'ph4D0': 2.24,
    'ph4D1': 11.05, 'ph4z0': 10.56, 'ph4z1': 6.63,
    /* Mala */
    'ml4h1': 14.65, 'ml4h2': 9.61, 'ml4h3': 7.61, 'ml4t1': 1.13, 'ml4t2': 1.45, 'ml4A1': 2.27, 'ml4B1': 1.62,
    'ml4B2': 1.01, 'ml4B3': 1.38, 'ml4D1': 1.93, 'ml4z1': 2.56,
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
      { k: 'D', text: 'Keep your place: hold the holy water, close your Spirit Vision, trust your teacher',
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
    vision: { heart: { bpm: 112, rest: 76, sound: 'u4heart', vol: 0.55, secs: 2.2, restSecs: 4.5 },
              sound: { on: 'u4vison', off: 'u4visoff', vol: 0.85, bed: ['u4visbed', 0.56], music: ['u4vismus', 0.32], duck: 0.6 } },
    /* THE HOLY WATER (the fifty-first seam, plan §6): his own hands, the small silver bowl in his left, a flick of the
       right hand's fingers a press, a dip at Grandmaster Pho's bowl to fill it again; the HUD says the chapter's words */
    /* the holy water is IN HIS HANDS only once Grandmaster Pho has given him the bowl (the item, given in the blessing):
       until then the hands are his own and empty (an item-less weapon is always out) */
    /* (Chad, 18 Nov: "make the aoe of the water flicking bigger, and slightly increase the amount of times the water can be
       flicked before reloading": fourteen flicks a bowl where there were ten, and the drops thrown wider, as wide as what a
       flick now reaches: c_story.js onShot) */
    weapon: { hands: 'own', pose: 'bowl', item: 'holywater', rounds: 14, endless: true, fireGap: 0.35, spray: { count: 16, spread: 0.24 },
              words: { fire: 'FLICK', reload: 'DIP' }, shot: 'u4flick', reload: 'u4dip', empty: 'uiclick',
              /* (Chad, 18 Nov: "Flick icon can be a spraying water icon instead of a word."): the button draws water flung
                 (shell.html .wpnIco-spray), FLICK stays its name for a screen reader; no AIM (the water has no zoom) */
              icon: 'spray' },

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
      'w4t_oldphoto', 'iconwater',
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
      guardBrief: 'Grandmaster Pho is blessing Amma. Keep the green spirits away from her. Open your Spirit Vision to see them, and tap the water button to flick holy water at them. Refill at his bowl with the arrow button. If her bar runs out, the blessing fails.',
      guardBriefKey: 'Grandmaster Pho is blessing Amma. Keep the green spirits away from her. Open your Spirit Vision (V) to see them, and click or press Space to flick holy water at them. Refill at his bowl with R. If her bar runs out, the blessing fails.',
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
    /* ONE PASS FOR A FLAT CARD (v26.11, the speed-ups' first: no memory made and thrown away each frame). three draws a
       see-through two-sided material in two passes, its back faces and then its front faces, and looks its program up
       again before each (renderObject sets material.needsUpdate both times: two look-ups a card a frame, each a
       hundred-field object built and thrown away, and a draw that paints nothing). A card that is ONE FLAT FACE is wholly
       front or wholly back to any eye, so of the two passes one draws nothing and the other draws every triangle in the
       geometry's own order; one pass (forceSinglePass) draws the same triangles in the same order, and an unlit material
       that reads no normal (MeshBasicMaterial with no envMap) shades them the same. Only such cards are given it, where
       they are made (the sun's rays, the taper's flame, the place to kneel), and each is checked when the world is built
       (onePassCheck): a material given it whose every user is not one flat plain card is drawn as three draws it, and the
       console says so. `?opt=onePass:0` draws all of them as three does: the proof compares the two pixel for pixel. */
    const ONEPASS = !ctx.opt || ctx.opt('onePass');
    /* NO LIST MADE AND THROWN AWAY EACH FRAME (v26.11): where a frame made a new list or a new turn to hold numbers it had
       (a hand's resting finger turns, two lists joined to walk them), it keeps one and fills it again: the same numbers
       copied into it in the same order, so every turn laid after it is the same to the bit. `?opt=noGarbage:0` makes
       them anew as before (the proof compares every bone of every body, the two ways) */
    let NOGARB = !ctx.opt || ctx.opt('noGarbage');                   // (a probe turns it over in one page: stage.garb)
    /* A BONE'S ANGLES WORKED OUT WHEN THEY ARE READ (v26.11, the speed-ups' second: the bones' arithmetic without the
       machinery's overhead). three keeps every object's turn twice, as a quaternion and as three angles, and each time the
       quaternion changes it works the angles out again at once (Object3D's onQuaternionChange: a rotation matrix and an
       arcsine and two arctangents). A body's bones turn thousands of times a frame (every take writes each one, every pose
       laid after it turns it again) and nothing ever reads their angles: the matrices are made from the quaternion. So a
       bone's quaternion only marks its angles stale, and they are worked out, by three's own setFromQuaternion on the same
       quaternion, the moment anything reads or writes any of them: every read gives the very numbers the old way held, and
       a write to one angle finds the others as the old way had them. Proved by every angle read both ways after the same
       turns (stage.lazyProof) and every bone compared. `?opt=lazyRot:0` leaves three's way */
    const LAZYROT = !ctx.opt || ctx.opt('lazyRot');
    const FASTTWINS = !ctx.opt || ctx.opt('fastTwins');               // (the seams' twins found by whole-number cells: twinsFast)
    const FASTSKIN = !ctx.opt || ctx.opt('fastSkin');                 // (a posed vertex with each bone's matrix made once a pose: skinVertex)
    const SHEETONCE = !ctx.opt || ctx.opt('sheetOnce');               // (a body's sheet set up once, never uploaded again for nothing: c_cast.js sheetOf)
    const KEEPSHARED = !ctx.opt || ctx.opt('keepShared');             // (a film's full body gives back only what no other body draws: c_cast.js fullOff)
    function lazyRot(o) { if (LAZYROT) lazyInstall(o); }
    const LAZY = new WeakSet();
    function lazyInstall(o) {
      const q = o.quaternion, e = o.rotation;
      if (!q || !e || LAZY.has(e)) return;
      let dirty = false, x = e._x, y = e._y, z = e._z, order = e._order;
      const sync = () => { dirty = false; e.setFromQuaternion(q, undefined, false); };
      Object.defineProperty(e, '_x', { get() { if (dirty) sync(); return x; }, set(v) { if (dirty) sync(); x = v; }, configurable: true });
      Object.defineProperty(e, '_y', { get() { if (dirty) sync(); return y; }, set(v) { if (dirty) sync(); y = v; }, configurable: true });
      Object.defineProperty(e, '_z', { get() { if (dirty) sync(); return z; }, set(v) { if (dirty) sync(); z = v; }, configurable: true });
      Object.defineProperty(e, '_order', { get() { if (dirty) sync(); return order; }, set(v) { if (dirty) sync(); order = v; }, configurable: true });
      LAZY.add(e);
      q._onChange(() => { dirty = true; });
    }
    /* (a probe's: the angles back to three's own way on this object, the numbers as they stand) */
    function lazyUninstall(o) {
      const q = o.quaternion, e = o.rotation;
      if (!q || !e || !LAZY.has(e)) return;
      const x = e._x, y = e._y, z = e._z, order = e._order;
      delete e._x; delete e._y; delete e._z; delete e._order;
      e._x = x; e._y = y; e._z = z; e._order = order;
      LAZY.delete(e);
      q._onChange(() => { e.setFromQuaternion(q, undefined, false); });
    }
    /* (the proof, for a probe: pairs of objects, one turned the old way and one the new, put through the same long string
       of turns and reads, every read and every quaternion compared bit for bit; then every bone of every body read
       against its angles worked out afresh from its quaternion. Answers the count of numbers compared and of those
       that differed) */
    function lazyProof(seed = 1, steps = 4000) {
      let r = seed >>> 0; const rnd = () => ((r = (r * 1664525 + 1013904223) >>> 0) / 4294967296);
      const same = (a, b) => Object.is(a, b);
      let n = 0, bad = 0; const chk = (a, b) => { n++; if (!same(a, b)) bad++; };
      const A = [], Bq = [];
      for (let i = 0; i < 6; i++) { const a = new THREE.Object3D(), b = new THREE.Object3D(); lazyInstall(b); A.push(a); Bq.push(b); }
      const tq = new THREE.Quaternion(), te = new THREE.Euler(), ax = new THREE.Vector3(), arr = [0, 0, 0, 0], orders = ['XYZ', 'YXZ', 'ZXY', 'ZYX', 'YZX', 'XZY'];
      for (let k = 0; k < steps; k++) {
        const i = Math.floor(rnd() * A.length), a = A[i], b = Bq[i], op = Math.floor(rnd() * 12);
        const v = [rnd() * 2 - 1, rnd() * 2 - 1, rnd() * 2 - 1, rnd() * 2 - 1], ang = (rnd() * 2 - 1) * 3.2;
        tq.set(v[0], v[1], v[2], v[3]).normalize();
        for (const o of [a, b]) {
          if (op === 0) o.quaternion.copy(tq);
          else if (op === 1) o.quaternion.slerp(tq, 0.37);
          else if (op === 2) o.quaternion.premultiply(tq);
          else if (op === 3) { arr[0] = tq.x; arr[1] = tq.y; arr[2] = tq.z; arr[3] = tq.w; o.quaternion.fromArray(arr); }
          else if (op === 4) o.rotation.x = ang;
          else if (op === 5) o.rotation.y = ang;
          else if (op === 6) o.rotation.set(ang, -ang * 0.5, ang * 0.25, orders[k % 6]);
          else if (op === 7) o.rotation.reorder(orders[(k + 3) % 6]);
          else if (op === 8) o.quaternion.setFromAxisAngle(ax.set(v[0], v[1], v[2]).normalize(), ang);
          else if (op === 9) o.rotateY(ang);
          else if (op === 10) o.quaternion.invert();
          else o.lookAt(v[0] * 5, v[1] * 5, v[2] * 5);
        }
        if (rnd() < 0.5) { chk(a.rotation.x, b.rotation.x); chk(a.rotation.y, b.rotation.y); chk(a.rotation.z, b.rotation.z); chk(a.rotation.order, b.rotation.order); }
        chk(a.quaternion.x, b.quaternion.x); chk(a.quaternion.y, b.quaternion.y); chk(a.quaternion.z, b.quaternion.z); chk(a.quaternion.w, b.quaternion.w);
      }
      for (let i = 0; i < A.length; i++) { const a = A[i], b = Bq[i]; const ea = a.rotation.toArray(), eb = b.rotation.toArray(); for (let j = 0; j < 4; j++) chk(ea[j], eb[j]);
        a.updateMatrix(); b.updateMatrix(); for (let j = 0; j < 16; j++) chk(a.matrix.elements[j], b.matrix.elements[j]); }
      let bones = 0, boneBad = 0;
      world.traverse(o => { if (!o.isBone || !LAZY.has(o.rotation)) return; bones++; te.setFromQuaternion(o.quaternion, o.rotation.order, false);
        if (!same(te.x, o.rotation.x) || !same(te.y, o.rotation.y) || !same(te.z, o.rotation.z)) boneBad++; });
      return { compared: n, differed: bad, lazyBones: bones, bonesDiffering: boneBad };
    }
    function flatCard(g) {
      const p = g && g.attributes && g.attributes.position; if (!p || (g.morphAttributes && g.morphAttributes.position)) return false;
      const ix = g.index ? g.index.array : null, n = ix ? ix.length : p.count;
      let have = false, nx = 0, ny = 0, nz = 0, ax = 0, ay = 0, az = 0, off = 0, size = 0;
      for (let t = 0; t + 2 < n; t += 3) {
        const a = ix ? ix[t] : t, b = ix ? ix[t + 1] : t + 1, c = ix ? ix[t + 2] : t + 2;
        const Ax = p.getX(a), Ay = p.getY(a), Az = p.getZ(a), ux = p.getX(b) - Ax, uy = p.getY(b) - Ay, uz = p.getZ(b) - Az, wx = p.getX(c) - Ax, wy = p.getY(c) - Ay, wz = p.getZ(c) - Az;
        const cx = uy * wz - uz * wy, cy = uz * wx - ux * wz, cz = ux * wy - uy * wx, L = Math.hypot(cx, cy, cz);
        if (!(L > 1e-12)) continue;
        if (!have) { nx = cx / L; ny = cy / L; nz = cz / L; ax = Ax; ay = Ay; az = Az; have = true; }
        if ((cx * nx + cy * ny + cz * nz) / L < 0.999999) return false;                    // (a triangle facing another way)
        for (let k = 0; k < 3; k++) { const X = Ax + (k === 1 ? ux : k === 2 ? wx : 0), Y = Ay + (k === 1 ? uy : k === 2 ? wy : 0), Z = Az + (k === 1 ? uz : k === 2 ? wz : 0);
          off = Math.max(off, Math.abs((X - ax) * nx + (Y - ay) * ny + (Z - az) * nz)); size = Math.max(size, Math.hypot(X - ax, Y - ay, Z - az)); }
      }
      return have && off <= 1e-6 * Math.max(size, 1e-6);
    }
    function onePassCheck() {
      const users = new Map();
      world.traverse(o => { if (!o.material) return; for (const m of [].concat(o.material)) if (m && m.forceSinglePass) { if (!users.has(m)) users.set(m, []); users.get(m).push(o); } });
      for (const [m, os] of users) {
        const bad = !m.isMeshBasicMaterial || !!m.envMap ? m.type : (os.find(o => !o.isMesh || o.isInstancedMesh || o.isSkinnedMesh || o.isBatchedMesh || !flatCard(o.geometry)) || null);
        if (!bad) continue;
        m.forceSinglePass = false;
        console.warn('onePass: a material given one pass is drawn in two (' + (typeof bad === 'string' ? bad : (bad.name || bad.type) + ' is not one flat plain card') + ')');
      }
      return users.size;
    }
    const wallNow = () => performance.now() / 1000;
    const have = (key) => DATA.assets.includes(key);      // a thing is asked for only once its file is in the build
    const waiting = new Set();                            // the keys the world names that have not landed yet (stage.info)
    const c01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v), smo = (k) => k * k * (3 - 2 * k), sgk = (t, a, b) => c01((t - a) / (b - a));
    const lp = (a, b, k) => a + (b - a) * k, lp3 = (a, b, k) => [lp(a[0], b[0], k), lp(a[1], b[1], k), lp(a[2], b[2], k)];
    const angTo = (a, b) => Math.atan2(Math.sin(b - a), Math.cos(b - a));
    const isNarrow = () => camera.aspect < 1;
    const TOUCHY = !!((window.matchMedia && matchMedia('(pointer: coarse)').matches) || 'ontouchstart' in window);   // (the engine's HAS_TOUCH: which words a brief gives)


    /* ------------------------------------------------------------- HER FLAT'S PLAN (docs/research/V27.0-HDB.md)
       The build sheet's Plan A: HDB's 4-room Model A corridor unit of 1993 to 96 (107 m2). The origin is the middle of
       her main door's opening on the corridor's face; +z into the flat, +x to the right of someone walking in, y up; her
       floor at 0, the corridor's at -0.10. Every place in this chapter is one of these numbers. */
    const FL = { x0: -3.65, x1: 6.55, z0: 0, z1: 10.10, ceil: 2.55, face: 0.18, wall: 0.12, corr: -0.10 };
    const ROOMS = {
      living:  { x0: -0.80, x1: 2.85, z0: 0, z1: 5.15 },     // her altar on its far wall, her chair before it
      hers:    { x0: 2.85, x1: 6.55, z0: 0, z1: 3.55 },      // her bed, behind a folding partition folded open
      passage: { x0: 2.85, x1: 6.55, z0: 3.55, z1: 5.10 },
      dining:  { x0: 3.05, x1: 6.55, z0: 5.10, z1: 10.10 },  // the table, the cabinet, the kitchen at its back
      master:  { x0: -0.80, x1: 3.05, z0: 5.15, z1: 10.10 }, // shut
      bed3:    { x0: -3.65, x1: -0.80, z0: 0, z1: 4.25 },    // shut (its door eases open a hand's width: a scare)
      nook:    { x0: -1.75, x1: -0.80, z0: 4.25, z1: 5.40 },
      store:   { x0: -3.65, x1: -1.75, z0: 4.25, z1: 5.40 },
      bed2:    { x0: -3.65, x1: -0.80, z0: 5.40, z1: 10.10 },
      bath2:   { x0: 3.05, x1: 4.60, z0: 8.45, z1: 11.00 }
    };
    /* the openings: doors (x or z along their wall, their width) and windows (with their sill and head) */
    const DOOR_MAIN = { x0: -0.50, x1: 0.50, h: 2.10 };
    const DOOR_BED3 = { z0: 2.70, z1: 3.60, h: 2.10 };       // in the living room's left wall (x -0.80)
    const DOOR_MASTER = { x0: 1.55, x1: 2.35, h: 2.10 };     // in its back wall (z 5.15)
    const DOOR_STORE = { z0: 4.45, z1: 5.25, h: 2.10 };      // in the nook's left side (x -1.75)
    const DOOR_BED2 = { x0: -1.75, x1: -0.95, h: 2.10 };     // in the nook's back (z 5.40)
    const DOOR_BATH2 = { x0: 3.35, x1: 4.10, h: 2.10 };      // in bath 2's front (z 8.45), from the kitchen
    const WIN_LIVING = { x0: 0.62, x1: 2.80, sill: 0.90, head: 2.10 };
    const WIN_HERS = { x0: 2.95, x1: 6.40, sill: 0.90, head: 2.10 };
    const WIN_BED3 = { x0: -3.45, x1: -1.00, sill: 0.90, head: 2.10 };
    const WIN_KITCHEN = { x0: 4.65, x1: 6.45, sill: 1.00, head: 2.10 };
    /* THE CORRIDOR (HDB's access balcony): 1.75 m wide, its floor 0.10 below hers, a parapet 1.0 m high at its edge, its
       ceiling the floor above's slab; her neighbours' doors every 10.2 m; the lift lobby along it to the west */
    const CORR = { z0: -1.75, z1: 0, x0: -26, x1: 26, para: -1.90, paraTop: 0.90, soffit: 2.65 };
    const LOBBY = { x0: -21.5, x1: -16.5 };
    /* her neighbours' doors along the corridor (every 10.2 m; the one where the lift lobby opens has none) */
    const NEIGHBOURS = [-20.4, -10.2, 10.2, 20.4].filter(nx => !(nx > LOBBY.x0 - 0.6 && nx < LOBBY.x1 + 0.6));
    /* THE ESTATE: her block on the 8th storey (her floor 20.4 m above the ground); the next block across, 40 m out */
    const GROUND_Y = -20.4;
    const ACROSS = { z: -42, x0: -60, x1: 45, d: 12, storeys: 13, storey: 2.85 };
    /* where people and things stand (c_people.js, c_props.js read these): her chair before her altar, a metre and a bit
       out; Grandmaster Pho's stool at her right; his bowl on the floor at the chair's foot */
    const ALTAR = { x: -0.15, z: 5.15, shelf: 1.50 };
    const CHAIR = { x: -0.15, z: 3.85, ry: 0 };             // she faces her altar (+z): a body and a thing at a turn of 0 face +z
    const STOOL = { x: 0.62, z: 3.55 };
    const BOWL = { x: 0.35, z: 3.20 };
    /* her kuthu vilakku on the floor beside her shrine's right end, below Appa's photograph: where Mala kneels to light it
       (18 Nov, measured: her kneeling take's right hand rides 0.085 m to her right and 0.30 before her, 0.57 m up, so it
       stands over the lamp's wick at 0.43; set before the shrine's middle, her knees were in her mother's footrest) */
    const VILAKKU = { x: 0.32, z: 4.80 };

    const world = new THREE.Group();
    scene.add(world);
    const solids = [];
    const matProxy = M({ color: 0x8d7a66, roughness: 0.9 });
    /* a thing he cannot walk through: a box, never drawn (collision is a column from the floor: v5.03) */
    const solidBox = (w, h, d, x, y, z, ry = 0) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), matProxy);
      m.position.set(x, y, z); m.rotation.y = ry; m.visible = false; world.add(m); solids.push(m); return m;
    };

    /* ------------------------------------------------- one parse per asset (chapter 3's own, copied) */
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
        const fast = FASTTWINS ? twinsFast(pa, si, sw, tol, near) : -1;
        if (fast >= 0) { n += fast; mine += fast; }
        else {
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
        }
        if (mine) { si.needsUpdate = true; sw.needsUpdate = true; }
      });
      if (n) twinMends[key] = n;
    }

    /* (v26.11, FASTTWINS: the speed-ups' third, the load's own work. The search above built a text key for every vertex and
       twenty-seven more for its neighbours' cells, on every vertex of every body file: 31 of the 96 seconds this box took
       to reach play. Here the same cells, of the same Math.floor(v / tol), are keyed by one exact whole number (the three
       cell numbers in mixed radix over the file's own range of cells, -0 the same as 0 as the text was), each cell's list
       in the vertices' own order, the neighbours visited in the same order, each position read once (the same doubles
       getX gives), the same distance test: so every vertex finds the same twins in the same order and is mended with the
       same weights. A file with a coordinate that is not a finite number takes the search above. `?opt=fastTwins:0`
       takes it always; the proof hashes every mended skin both ways (stage.twinHash)) */
    function twinsFast(pa, si, sw, tol, near) {
      const N = pa.count, X = new Float64Array(N), Y = new Float64Array(N), Z = new Float64Array(N), C = new Float64Array(3 * N);
      let x0 = Infinity, y0 = Infinity, z0 = Infinity, x1 = -Infinity, y1 = -Infinity, z1 = -Infinity;
      for (let i = 0; i < N; i++) {
        const x = pa.getX(i), y = pa.getY(i), z = pa.getZ(i);
        if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(z)) return -1;
        X[i] = x; Y[i] = y; Z[i] = z;
        const cx = Math.floor(x / tol), cy = Math.floor(y / tol), cz = Math.floor(z / tol);
        C[3 * i] = cx; C[3 * i + 1] = cy; C[3 * i + 2] = cz;
        if (cx < x0) x0 = cx; if (cx > x1) x1 = cx; if (cy < y0) y0 = cy; if (cy > y1) y1 = cy; if (cz < z0) z0 = cz; if (cz > z1) z1 = cz;
      }
      if (!(N > 0)) return 0;
      const sy = y1 - y0 + 3, sz = z1 - z0 + 3;
      if (!((x1 - x0 + 3) * sy * sz < 4503599627370496)) return -1;          // (2^52: every key an exact whole number)
      const key = (a, b2, c) => ((a - x0 + 1) * sy + (b2 - y0 + 1)) * sz + (c - z0 + 1);
      const cells = new Map();
      for (let i = 0; i < N; i++) { const k = key(C[3 * i], C[3 * i + 1], C[3 * i + 2]); let c = cells.get(k); if (!c) cells.set(k, c = []); c.push(i); }
      const dom = (i) => { let k = 0; for (let q = 1; q < 4; q++) if (sw.getComponent(i, q) > sw.getComponent(i, k)) k = q; return si.getComponent(i, k); };
      const weightOn = (i, bone) => { let w = 0; for (let q = 0; q < 4; q++) if (si.getComponent(i, q) === bone) w += sw.getComponent(i, q); return w; };
      /* (a neighbour's key is the vertex's own plus a fixed whole number, in the old order: a, then b2, then c, each -1 to
         1; and the distance test is decided by the squares where they are clear of tol by a millionth of a millionth,
         Math.hypot only in between, so every decision is Math.hypot's own) */
      const syz = sy * sz, OFF = [], t2 = tol * tol, t2lo = t2 * (1 - 1e-9), t2hi = t2 * (1 + 1e-9);
      for (let a = -1; a <= 1; a++) for (let b2 = -1; b2 <= 1; b2++) for (let c = -1; c <= 1; c++) OFF.push(a * syz + b2 * sz + c);
      let mine = 0; const tw = [];
      for (let i = 0; i < N; i++) {
        const x = X[i], y = Y[i], z = Z[i], kc = key(C[3 * i], C[3 * i + 1], C[3 * i + 2]); tw.length = 0;
        for (let o = 0; o < 27; o++) {
          const l = cells.get(kc + OFF[o]); if (!l) continue;
          for (const j of l) { if (j === i) continue; const dx = X[j] - x, dy = Y[j] - y, dz = Z[j] - z, q = dx * dx + dy * dy + dz * dz;
            if (q > t2hi) continue; if (q < t2lo || Math.hypot(dx, dy, dz) <= tol) tw.push(j); }
        }
        if (tw.length < 2) continue;
        const d0 = dom(tw[0]);
        if (!tw.every(j => dom(j) === d0) || weightOn(i, d0) > 0 || near(dom(i), d0)) continue;
        for (let q = 0; q < 4; q++) { si.setComponent(i, q, si.getComponent(tw[0], q)); sw.setComponent(i, q, sw.getComponent(tw[0], q)); }
        mine++;
      }
      return mine;
    }

    /* ------------------------------------------------- the flat's surfaces (none from a picture yet: every one is
       painted below; the table stays so the copied loaders read their own) */
    const SURF = {};
    const surfTex = new Map();
    function surfLoad(name) {
      if (!surfTex.has(name)) {
        const key = 'w4t_' + name;
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

    /* (a seeded stream, v6.15: every scatter in this chapter is the same scatter on every run. `rng` is at the file's
       foot, beside the drawn surfaces that also use it) */

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
        /* (o.near: a copy that is only ever seen close, in his hands: its full level always, and no place in the world
           for lodTick to measure) */
        if (near.length && far.length && o.near) { for (const q of far) q.visible = false; }
        else if (near.length && far.length) { g.updateWorldMatrix(true, true); const bb = new THREE.Box3().setFromObject(m), c = bb.getCenter(new THREE.Vector3());
          for (const q of near) q.visible = false;
          standLods.push({ near, far, c, r: 0, size: Math.max(0.05, bb.max.y - bb.min.y), on: false, g, moves: !!o.moves }); }
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
      for (const L of standLods) { if (L.g && L.moves) L.g.getWorldPosition(L.c).y += L.size / 2;                // (a thing the play carries about is measured where it is now)
        const d = Math.max(0.05, _sl2.distanceTo(L.c)), on = L.size / (d * span) > STOCK_NEAR;
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


    /* ================================================================ HER FLAT'S SURFACES
       Painted here (cnv: a canvas, done: its texture), each at its own real size so a metre on the wall is a metre of
       its picture (the batched quads' UVs are metres). A 1990s HDB flat: homogeneous ceramic floor tiles in the living
       rooms and her room, small white wall tiles in the kitchen, painted plaster walls, a tiled skirting, a plaster
       ceiling. The colours are an old flat's: the paint a tired cream, the tiles a speckled beige. */
    const rep = (t, tu, tv) => { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(1 / tu, 1 / tv); return t; };
    /* the floor: 300 mm speckled beige ceramic tiles, their grout a little darker, a few worn paler */
    const mFloor = (() => { const W = 512, T = 128, [c, x] = cnv(W), r = rng(41207);
      x.fillStyle = '#bba78c'; x.fillRect(0, 0, W, W);
      for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) {
        const k = 0.92 + r() * 0.12, base = [196 * k, 178 * k, 150 * k];
        x.fillStyle = `rgb(${base[0] | 0},${base[1] | 0},${base[2] | 0})`; x.fillRect(i * T + 2, j * T + 2, T - 4, T - 4);
        for (let s = 0; s < 700; s++) { const v = r(); x.fillStyle = v < 0.5 ? 'rgba(120,96,70,0.28)' : 'rgba(250,240,220,0.3)';
          x.fillRect(i * T + 2 + r() * (T - 4), j * T + 2 + r() * (T - 4), 1 + r() * 1.6, 1 + r() * 1.6); }
      }
      x.strokeStyle = 'rgba(90,76,60,0.55)'; x.lineWidth = 3;
      for (let i = 0; i <= 4; i++) { x.beginPath(); x.moveTo(i * T, 0); x.lineTo(i * T, W); x.stroke(); x.beginPath(); x.moveTo(0, i * T); x.lineTo(W, i * T); x.stroke(); }
      const t = tex(done(THREE, c, true)); rep(t, 1.2, 1.2); t.anisotropy = 8;
      return M({ map: t, roughness: 0.42, metalness: 0 }); })();
    /* the kitchen's floor: smaller terracotta-red quarry tiles (150 mm) */
    const mKitFloor = (() => { const W = 256, T = 64, [c, x] = cnv(W), r = rng(7713);
      x.fillStyle = '#6e3a2a'; x.fillRect(0, 0, W, W);
      for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) { const k = 0.9 + r() * 0.16;
        x.fillStyle = `rgb(${(150 * k) | 0},${(78 * k) | 0},${(56 * k) | 0})`; x.fillRect(i * T + 2, j * T + 2, T - 4, T - 4); }
      const t = tex(done(THREE, c, true)); rep(t, 0.6, 0.6); return M({ map: t, roughness: 0.6 }); })();
    /* the walls: plaster painted a tired cream, only faintly uneven (18 Nov, photographed: 1600 blotches of up to 12 px
       laid over one another read as a speckled wallpaper under the tube, which an HDB wall's paint is not; now a few
       hundred soft ones, fainter) */
    const wallPaint = (hex, seed) => { const W = 256, [c, x] = cnv(W), r = rng(seed);
      x.fillStyle = hex; x.fillRect(0, 0, W, W);
      /* (soft round spots, a radial fall each: squares, however faint, read as tiles of a pattern) */
      /* (18 Nov, photographed on a phone: 260 of them at 2 % read as damp stains on every wall; a painted HDB wall is even:
         a few, at under 1 %, so it is paint and not a flat colour) */
      for (let s = 0; s < 120; s++) { const cx = r() * W, cy = r() * W, q = 8 + r() * 26, dark = r() < 0.5;
        const g = x.createRadialGradient(cx, cy, 0, cx, cy, q); g.addColorStop(0, dark ? 'rgba(0,0,0,0.007)' : 'rgba(255,255,255,0.009)'); g.addColorStop(1, 'rgba(0,0,0,0)');
        x.fillStyle = g; x.fillRect(cx - q, cy - q, q * 2, q * 2); }
      const t = tex(done(THREE, c, true)); rep(t, 1.4, 1.4); return t; };
    const mWall = M({ map: wallPaint('#d9cdb4', 3301), roughness: 0.92 });
    const mWallHers = M({ map: wallPaint('#cfd8c8', 3302), roughness: 0.92 });      // her room a pale green, as she chose it once
    const mWallOut = M({ map: wallPaint('#c9c2b2', 3303), roughness: 0.95 });      // the corridor's face: HDB's grey-cream
    const mCeil = M({ color: 0xe6e4de, roughness: 0.95, emissive: 0x2c2b28 });   // (a ceiling under its own tube is lit: painted light)
    /* the skirting: a strip of the floor's tile, 100 mm high, round every wall */
    const mSkirt = M({ color: 0x9c8a72, roughness: 0.5 });
    /* the kitchen's walls: white 150 mm tiles to 1.5 m, paint above */
    const mKitTile = (() => { const W = 256, T = 64, [c, x] = cnv(W);
      x.fillStyle = '#d8dcd8'; x.fillRect(0, 0, W, W); x.fillStyle = '#f2f3f0';
      for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) x.fillRect(i * T + 2, j * T + 2, T - 4, T - 4);
      const t = tex(done(THREE, c, true)); rep(t, 0.6, 0.6); return M({ map: t, roughness: 0.25 }); })();
    /* a door's leaf where no model stands (a bedroom's, a bath's, her neighbours'): a veneer of brown timber */
    const mVeneer = (() => { const W = 128, H = 256, c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d'), r = rng(9921);
      x.fillStyle = '#7a5434'; x.fillRect(0, 0, W, H);
      for (let i = 0; i < 90; i++) { x.strokeStyle = `rgba(${40 + r() * 30},${22 + r() * 16},${10},${0.18 + r() * 0.2})`; x.lineWidth = 1 + r() * 2;
        const xx = r() * W; x.beginPath(); x.moveTo(xx, 0); x.bezierCurveTo(xx + r() * 8 - 4, H * 0.3, xx + r() * 8 - 4, H * 0.7, xx + r() * 6 - 3, H); x.stroke(); }
      const t = tex(new THREE.CanvasTexture(c)); t.colorSpace = THREE.SRGBColorSpace; rep(t, 0.9, 2.1);
      return M({ map: t, roughness: 0.55 }); })();
    const mFrame = M({ color: 0xcfd2d4, roughness: 0.4, metalness: 0.5 });          // the windows' aluminium
    const mGrille = M({ color: 0xe4e4de, roughness: 0.6, metalness: 0.2 });         // the grilles, painted white
    /* the glass at night: dark, holding a faint picture of the room (nothing is mirrored for real) */
    const mGlassNight = M({ color: 0x0a0d14, roughness: 0.08, metalness: 0.2, transparent: true, opacity: 0.32, depthWrite: false });
    /* the corridor's floor: grey terrazzo with darker chips; its parapet and soffit painted */
    const mCorrFloor = (() => { const W = 256, [c, x] = cnv(W), r = rng(5150);
      x.fillStyle = '#8f8d88'; x.fillRect(0, 0, W, W);
      for (let s = 0; s < 2600; s++) { const v = r(); x.fillStyle = v < 0.4 ? 'rgba(50,50,48,0.5)' : v < 0.8 ? 'rgba(200,198,190,0.5)' : 'rgba(140,110,80,0.5)'; const q = 1 + r() * 3; x.fillRect(r() * W, r() * W, q, q); }
      const t = tex(done(THREE, c, true)); rep(t, 1.0, 1.0); return M({ map: t, roughness: 0.5 }); })();
    const mSoffit = M({ color: 0xbab6ac, roughness: 0.95 });
    /* the corridor's LED battens: the light itself, unlit and bright (painted light: v9.4) */
    const mBatten = B({ color: 0xf2f6ff });

    /* ================================================================ THE SHELL
       Walls are boxes (a wall's thickness drawn, so an opening shows its reveal), split round their openings: below a
       window's sill, above its head and between, above a door's head. Each piece is also a SOLID where it stands on
       walkable floor (collision is a column from the floor: v5.03). */
    /* a wall along x (z fixed at its middle `zc`, thickness d) from x0 to x1, with openings [{x0, x1, y0, y1}] */
    function wallX(mat, zc, d, x0, x1, opens = [], y0 = 0, y1 = FL.ceil, solid = true) {
      const cuts = opens.slice().sort((a, b) => a.x0 - b.x0); let at = x0;
      const piece = (a, b, ya, yb, sol) => { if (b - a < 0.005 || yb - ya < 0.005) return;
        box(mat, (a + b) / 2, (ya + yb) / 2, zc, b - a, yb - ya, d, 0, mat, false);
        if (sol && solid) solidBox(b - a, Math.max(1.2, yb - ya), d, (a + b) / 2, Math.max(0.6, (ya + yb) / 2), zc); };
      for (const o of cuts) { piece(at, o.x0, y0, y1, true); piece(o.x0, o.x1, y0, o.y0, o.y0 > 0.6); piece(o.x0, o.x1, o.y1, y1, false); at = o.x1; }
      piece(at, x1, y0, y1, true);
    }
    /* a wall along z (x fixed at `xc`, thickness d) from z0 to z1, with openings [{z0, z1, y0, y1}] */
    function wallZ(mat, xc, d, z0, z1, opens = [], y0 = 0, y1 = FL.ceil, solid = true) {
      const cuts = opens.slice().sort((a, b) => a.z0 - b.z0); let at = z0;
      const piece = (a, b, ya, yb, sol) => { if (b - a < 0.005 || yb - ya < 0.005) return;
        box(mat, xc, (ya + yb) / 2, (a + b) / 2, d, yb - ya, b - a, 0, mat, false);
        if (sol && solid) solidBox(d, Math.max(1.2, yb - ya), b - a, xc, Math.max(0.6, (ya + yb) / 2), (a + b) / 2); };
      for (const o of cuts) { piece(at, o.z0, y0, y1, true); piece(o.z0, o.z1, y0, o.y0, o.y0 > 0.6); piece(o.z0, o.z1, o.y1, y1, false); at = o.z1; }
      piece(at, z1, y0, y1, true);
    }
    /* a window in a wall along x: its aluminium frame, its glass (two sliding panes) and, where it looks on the corridor,
       its grille of white bars */
    function windowX(o, zc, d, grille) {
      const w = o.x1 - o.x0, h = o.head - o.sill, zf = zc;                               // in the wall's middle
      const fr = 0.04;
      box(mFrame, (o.x0 + o.x1) / 2, o.sill + fr / 2, zf, w, fr, d * 0.6);
      box(mFrame, (o.x0 + o.x1) / 2, o.head - fr / 2, zf, w, fr, d * 0.6);
      box(mFrame, o.x0 + fr / 2, (o.sill + o.head) / 2, zf, fr, h, d * 0.6);
      box(mFrame, o.x1 - fr / 2, (o.sill + o.head) / 2, zf, fr, h, d * 0.6);
      const n = Math.max(2, Math.round(w / 0.9));
      for (let i = 1; i < n; i++) box(mFrame, o.x0 + (w * i) / n, (o.sill + o.head) / 2, zf, 0.035, h, d * 0.5);
      glass.push({ x0: o.x0, x1: o.x1, y0: o.sill, y1: o.head, z: zf });
      if (grille) { const gz = zc - d / 2 - 0.05;                                          // on the corridor's side
        for (let gx = o.x0 + 0.11; gx < o.x1 - 0.05; gx += 0.12) bar(mGrille, [gx, o.sill, gz], [gx, o.head, gz], 0.008, 6);
        for (const gy of [o.sill + 0.02, (o.sill + o.head) / 2, o.head - 0.02]) bar(mGrille, [o.x0, gy, gz], [o.x1, gy, gz], 0.01, 6); }
    }
    const glass = [];
    /* (R36) the rooms behind her neighbours' corridor windows: six cells, curtains lit warm or cool, a television's blue,
       two dark; painted light (an unlit picture: v9.4) */
    function nbRooms() {
      const n = 6, W = 256, H = 128, c = document.createElement('canvas'); c.width = W; c.height = H * n; const x = c.getContext('2d'), rr = rng(5512);
      const looks = [['#e7b46c', 0.9], ['#f0d6a4', 0.85], ['#cfdbe8', 0.8], ['#7a92d4', 0.75], ['#15161b', 0], ['#1b1a1f', 0]];
      looks.forEach(([col, glow], i) => { const y0 = i * H;
        x.fillStyle = col; x.fillRect(0, y0, W, H);
        if (glow) { for (let px = 0; px < W; px += 6) { x.fillStyle = `rgba(0,0,0,${0.04 + 0.08 * Math.abs(Math.sin(px * 0.7 + i))})`; x.fillRect(px, y0, 3, H); }
          const g = x.createRadialGradient(W * 0.5, y0 + H * 0.2, 4, W * 0.5, y0 + H * 0.2, W * 0.7); g.addColorStop(0, 'rgba(255,255,240,0.35)'); g.addColorStop(1, 'rgba(0,0,0,0.15)');
          x.fillStyle = g; x.fillRect(0, y0, W, H); }
        else { x.fillStyle = 'rgba(120,130,150,0.08)'; x.fillRect(W * 0.2, y0 + 10, W * 0.15, H - 20); } });
      const t = tex(done(THREE, c, false)); const m = B({ map: t });
      const at = (mat, a, b, cc, d, k) => {
        const Bt = batchOf(mat), v0 = 1 - (k + 1) / n + 0.002, v1 = 1 - k / n - 0.002;
        const P = [a, b, cc, a, cc, d], U = [[0, v0], [1, v0], [1, v1], [0, v0], [1, v1], [0, v1]];
        for (let i = 0; i < 6; i++) { Bt.p.push(P[i][0], P[i][1], P[i][2]); Bt.n.push(0, 0, -1); Bt.u.push(U[i][0], U[i][1]); } };
      return { m, at, n };
    }
    function buildShell() {
      const F = FL, h = F.ceil, t = F.wall, R = ROOMS;
      /* the floors: tiles in the living rooms, her room and the passage; quarry tiles in the kitchen; the corridor's
         terrazzo 0.10 down. (Each floor is laid under its walls, so no seam shows at a wall's foot) */
      floor(mFloor, R.living.x0, F.face, R.living.x1, R.living.z1);
      floor(mFloor, R.hers.x0, F.face, R.hers.x1, R.passage.z1);
      floor(mFloor, R.nook.x0, R.nook.z0, R.nook.x1, R.nook.z1);
      /* the dining room is the living room's tile; the kitchen at its back (from z 7.6, where its tiled walls begin) its
         own red quarry tile (18 Nov, photographed: the whole dining room had been laid in the kitchen's) */
      floor(mFloor, R.dining.x0, R.dining.z0, R.dining.x1, 7.6);
      floor(mKitFloor, R.dining.x0, 7.6, R.dining.x1, R.dining.z1);
      floor(mCorrFloor, CORR.x0, CORR.z0, CORR.x1, CORR.z1 + 0.002, F.corr);
      /* the ceilings (over everything walked, and over the corridor: the floor above) */
      const ceil = (x0, z0, x1, z1, y) => quad(mCeil, [x0, y, z0], [x1, y, z0], [x1, y, z1], [x0, y, z1]);
      ceil(R.living.x0, F.face, R.living.x1, R.living.z1, h); ceil(R.hers.x0, F.face, R.hers.x1, R.passage.z1, h);
      ceil(R.dining.x0, R.dining.z0, R.dining.x1, R.dining.z1, h); ceil(R.nook.x0, R.nook.z0, R.nook.x1, R.nook.z1, h);
      quad(mSoffit, [CORR.x0, CORR.soffit, CORR.para], [CORR.x1, CORR.soffit, CORR.para], [CORR.x1, CORR.soffit, F.face], [CORR.x0, CORR.soffit, F.face]);
      /* THE FRONT FACADE (z 0 to 0.18): her door, the living room's window, her room's, bedroom 3's (on the corridor) */
      const fz = F.face / 2;
      wallX(mWallOut, fz, F.face, F.x0, F.x1, [
        { x0: WIN_BED3.x0, x1: WIN_BED3.x1, y0: WIN_BED3.sill, y1: WIN_BED3.head },
        { x0: DOOR_MAIN.x0, x1: DOOR_MAIN.x1, y0: 0, y1: DOOR_MAIN.h },
        { x0: WIN_LIVING.x0, x1: WIN_LIVING.x1, y0: WIN_LIVING.sill, y1: WIN_LIVING.head },
        { x0: WIN_HERS.x0, x1: WIN_HERS.x1, y0: WIN_HERS.sill, y1: WIN_HERS.head }]);
      windowX(WIN_LIVING, fz, F.face, true); windowX(WIN_HERS, fz, F.face, true); windowX(WIN_BED3, fz, F.face, true);
      /* the corridor's face of the facade continues past her flat to her neighbours', and up to the soffit: each flat its
         own plan's three windows on the corridor (bedroom 3's, the living room's, the main bedroom's), framed and grilled
         as hers are, a lit room or a dark one behind each (R36, 18 Nov: the walk to her gate passed blank walls) */
      const nbWins = [];
      for (const nx of NEIGHBOURS) for (const [a, b] of [[WIN_BED3.x0, WIN_BED3.x1], [WIN_LIVING.x0, WIN_LIVING.x1], [WIN_HERS.x0, WIN_HERS.x1]]) {
        const x0 = Math.max(CORR.x0 + 0.3, nx + a), x1 = Math.min(CORR.x1 - 0.3, nx + b); if (x1 - x0 < 0.8) continue;
        nbWins.push({ x0, x1, sill: 0.9, head: 2.1 }); }
      const opens = (ws) => ws.map(w => ({ x0: w.x0, x1: w.x1, y0: w.sill, y1: w.head }));
      wallX(mWallOut, fz, F.face, CORR.x0, F.x0, opens(nbWins.filter(w => w.x1 <= F.x0)), 0, CORR.soffit, false);
      wallX(mWallOut, fz, F.face, F.x1, CORR.x1, opens(nbWins.filter(w => w.x0 >= F.x1)), 0, CORR.soffit, false);
      { const rooms = nbRooms(), nr = rng(5511);
        nbWins.forEach((w, i) => { windowX(w, fz, F.face, true);
          const k = (nr() * rooms.n) | 0, z = F.face + 0.28;                       // the room behind it: its curtains, lit or not
          rooms.at(rooms.m, [w.x1 + 0.1, w.sill - 0.1, z], [w.x0 - 0.1, w.sill - 0.1, z], [w.x0 - 0.1, w.head + 0.1, z], [w.x1 + 0.1, w.head + 0.1, z], k); }); }
      box(mWallOut, (F.x0 + F.x1) / 2, (h + CORR.soffit) / 2, fz, F.x1 - F.x0, CORR.soffit - h, F.face);
      /* THE BACK FACADE (z 10.10): the kitchen's casement window over the laundry poles */
      wallX(mWall, F.z1 + 0.09, 0.18, R.dining.x0 + 1.55, R.dining.x1, [{ x0: WIN_KITCHEN.x0, x1: WIN_KITCHEN.x1, y0: WIN_KITCHEN.sill, y1: WIN_KITCHEN.head }]);
      windowX(WIN_KITCHEN, F.z1 + 0.09, 0.18, false);
      /* THE PARTY WALLS (x -3.65 and 6.55), on the walked side only */
      wallZ(mWallHers, R.hers.x1 + 0.09, 0.18, F.face, R.passage.z1);
      wallZ(mWall, R.dining.x1 + 0.09, 0.18, R.dining.z0, F.z1);
      /* THE LIVING ROOM: its left wall (bedroom 3's, its door shut but for a hand's width), its back wall (her altar's,
         and the main bedroom's door, shut), the nook open to it */
      wallZ(mWall, R.living.x0 - t / 2, t, F.face, R.bed3.z1 + t / 2, [{ z0: DOOR_BED3.z0, z1: DOOR_BED3.z1, y0: 0, y1: DOOR_BED3.h }]);
      wallX(mWall, R.living.z1 + t / 2, t, R.living.x0 - t, R.master.x1 + t / 2, [{ x0: DOOR_MASTER.x0, x1: DOOR_MASTER.x1, y0: 0, y1: DOOR_MASTER.h }]);
      /* the nook: bedroom 3's back wall over it, the store's door at its west end, bedroom 2's at its back */
      wallX(mWall, R.bed3.z1 + t / 2, t, R.nook.x0 - t / 2, R.living.x0 - t / 2);
      wallZ(mWall, R.nook.x0 - t / 2, t, R.nook.z0, R.nook.z1 + t / 2, [{ z0: DOOR_STORE.z0, z1: DOOR_STORE.z1, y0: 0, y1: DOOR_STORE.h }]);
      wallX(mWall, R.nook.z1 + t / 2, t, R.nook.x0 - t / 2, R.living.x0, [{ x0: DOOR_BED2.x0, x1: DOOR_BED2.x1, y0: 0, y1: DOOR_BED2.h }]);
      wallZ(mWall, R.living.x0 - t / 2, t, R.nook.z1, R.living.z1 + t);                    // the main bedroom's west wall at the nook
      /* HER ROOM: its back wall to the passage (the folding partition stands open at x 2.85: c_props.js) */
      wallX(mWallHers, R.hers.z1 + t / 2, t, R.hers.x0 + 0.95, R.hers.x1);
      /* the main bedroom's east wall along the dining room, and bath 2's walls with its door (shut) */
      wallZ(mWall, R.dining.x0 - t / 2, t, R.passage.z1, F.z1);
      wallX(mKitTile, R.bath2.z0 - t / 2, t, R.bath2.x0, R.bath2.x1 + t / 2, [{ x0: DOOR_BATH2.x0, x1: DOOR_BATH2.x1, y0: 0, y1: DOOR_BATH2.h }]);
      wallZ(mKitTile, R.bath2.x1 + t / 2, t, R.bath2.z0, F.z1);
      /* the kitchen's tiled skin over the back walls to 1.5 m (inside the dining room's back third) */
      quad(mKitTile, [R.dining.x1 - 0.002, 0, 7.6], [R.dining.x1 - 0.002, 0, F.z1], [R.dining.x1 - 0.002, 1.5, F.z1], [R.dining.x1 - 0.002, 1.5, 7.6], 7.6, 0);
      /* the doors that stay shut: each doorway's leaf is the door's own model (c_props.js DOORS; bedroom 3's stands a
         hand's width open); here only what stops him walking through */
      solidBox(DOOR_MASTER.x1 - DOOR_MASTER.x0, 2.1, 0.1, (DOOR_MASTER.x0 + DOOR_MASTER.x1) / 2, 1.05, R.living.z1 + 0.05);
      solidBox(0.1, 2.1, DOOR_STORE.z1 - DOOR_STORE.z0, R.nook.x0 - 0.05, 1.05, (DOOR_STORE.z0 + DOOR_STORE.z1) / 2);
      solidBox(DOOR_BED2.x1 - DOOR_BED2.x0, 2.1, 0.1, (DOOR_BED2.x0 + DOOR_BED2.x1) / 2, 1.05, R.nook.z1 + 0.05);
      solidBox(DOOR_BATH2.x1 - DOOR_BATH2.x0, 2.1, 0.1, (DOOR_BATH2.x0 + DOOR_BATH2.x1) / 2, 1.05, R.bath2.z0 - 0.05);
      solidBox(0.1, 2.1, DOOR_BED3.z1 - DOOR_BED3.z0, R.living.x0 - 0.06, 1.05, (DOOR_BED3.z0 + DOOR_BED3.z1) / 2);
      /* the skirting round the walked rooms (100 mm of the tile, standing 6 mm proud of the paint) */
      const sk = (a, b) => wall(mSkirt, a[0], a[1], b[0], b[1], 0, 0.1);
      sk([R.living.x0 + 0.006, F.face + 0.006], [R.living.x0 + 0.006, R.living.z1 - 0.006]);
      sk([R.living.x1 - 1.2, R.living.z1 - 0.006], [R.living.x0 + 0.006, R.living.z1 - 0.006]);
      sk([R.hers.x1 - 0.006, F.face + 0.006], [R.hers.x1 - 0.006, R.passage.z1]);
    }

    /* ================================================================ OUTSIDE HER DOOR
       The corridor: her neighbours' doors and gates every 10.2 m (painted: their leaves are veneer and their grilles bars),
       the battens over it, its parapet at its edge; the lift lobby to the west (the opening film, M7). */
    function buildCorridor() {
      const c = CORR, y0 = FL.corr;
      /* the parapet: a wall 0.15 thick, a coping on top, from end to end but where the lift lobby opens */
      box(mWallOut, (c.x0 + c.x1) / 2, (y0 + c.paraTop) / 2, c.para + 0.075, c.x1 - c.x0, c.paraTop - y0, 0.15, 0, mWallOut, false);
      box(mSoffit, (c.x0 + c.x1) / 2, c.paraTop + 0.03, c.para + 0.075, c.x1 - c.x0, 0.06, 0.24);
      /* the slab's edge above, and the floor's edge below (the facade's bands, seen from across) */
      box(mWallOut, (c.x0 + c.x1) / 2, c.soffit + 0.2, c.para + 0.1, c.x1 - c.x0, 0.4, 0.2);
      box(mWallOut, (c.x0 + c.x1) / 2, y0 - 0.25, c.para + 0.1, c.x1 - c.x0, 0.3, 0.2);
      /* the battens: a 1.2 m LED fitting under the soffit every 7 m, its body and its lit diffuser, and the light it
         throws: a pool on the soffit round it, on the wall and the floor under it, on the parapet across (R36, 18 Nov:
         the corridor's lights were slivers in an evenly lit tunnel) */
      const mFix = M({ color: 0xd8d8d2, roughness: 0.6, metalness: 0.2 });
      const poolTex = (() => { const W = 128, cv = document.createElement('canvas'); cv.width = cv.height = W; const x = cv.getContext('2d');
        const g = x.createRadialGradient(W / 2, W / 2, 1, W / 2, W / 2, W / 2); g.addColorStop(0, 'rgba(255,250,238,0.42)'); g.addColorStop(0.45, 'rgba(255,250,238,0.14)'); g.addColorStop(1, 'rgba(255,250,238,0)');
        x.fillStyle = g; x.fillRect(0, 0, W, W); return tex(done(THREE, cv, false)); })();
      const mPoolC = new THREE.MeshBasicMaterial({ map: poolTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }); mats.push(mPoolC);
      const pool = (cx, cy, cz, w, h, ax) => {           // a pool laid on a surface: 'y' a ceiling or floor, '-z' the wall, '+z' the parapet
        const hw = w / 2, hh = h / 2, Bt = batchOf(mPoolC);
        const P = ax === 'yd' ? [[cx - hw, cy, cz - hh], [cx + hw, cy, cz - hh], [cx + hw, cy, cz + hh], [cx - hw, cy, cz + hh]]
                : ax === 'yu' ? [[cx - hw, cy, cz + hh], [cx + hw, cy, cz + hh], [cx + hw, cy, cz - hh], [cx - hw, cy, cz - hh]]
                : ax === '-z' ? [[cx + hw, cy - hh, cz], [cx - hw, cy - hh, cz], [cx - hw, cy + hh, cz], [cx + hw, cy + hh, cz]]
                : [[cx - hw, cy - hh, cz], [cx + hw, cy - hh, cz], [cx + hw, cy + hh, cz], [cx - hw, cy + hh, cz]];
        const U = [[0, 0], [1, 0], [1, 1], [0, 0], [1, 1], [0, 1]], I = [0, 1, 2, 0, 2, 3];
        const nn = ax === 'yd' ? [0, -1, 0] : ax === 'yu' ? [0, 1, 0] : ax === '-z' ? [0, 0, -1] : [0, 0, 1];
        for (let i = 0; i < 6; i++) { const q = P[I[i]]; Bt.p.push(q[0], q[1], q[2]); Bt.n.push(nn[0], nn[1], nn[2]); Bt.u.push(U[i][0], U[i][1]); } };
      for (let x = -24.5; x <= 24.5; x += 7) {
        box(mFix, x, c.soffit - 0.024, -0.9, 1.26, 0.048, 0.09);
        box(mBatten, x, c.soffit - 0.052, -0.9, 1.2, 0.008, 0.06);
        pool(x, c.soffit - 0.004, -0.9, 3.6, 1.7, 'yd');
        pool(x, 1.45, -0.004, 4.2, 2.6, '-z');
        pool(x, y0 + 0.004, -0.85, 3.2, 1.6, 'yu');
        pool(x, 0.5, c.para + 0.155, 3.4, 1.1, '+z');
      }
      /* the town gas pipe along the corridor's wall under the soffit, yellow, on its brackets; each flat's electricity
         meter box by its door and its number over it; the corridor's two ends: a wall of vent blocks before the stair */
      const mGas = M({ color: 0xd2b031, roughness: 0.55, metalness: 0.1 }), mBox = M({ color: 0x8d8b84, roughness: 0.5, metalness: 0.35 });
      bar(mGas, [c.x0, 2.38, -0.07], [c.x1, 2.38, -0.07], 0.022, 8);
      for (let gx = c.x0 + 0.6; gx < c.x1; gx += 1.6) box(mBox, gx, 2.38, -0.04, 0.03, 0.07, 0.08);
      const plates = (() => { const W = 512, H = 64, cv = document.createElement('canvas'); cv.width = W; cv.height = H * 4; const x = cv.getContext('2d');
        x.fillStyle = '#e8e5dc'; x.fillRect(0, 0, W, H * 4); x.fillStyle = '#1e1e22'; x.font = 'bold 44px Arial, Helvetica, sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle';
        ['#08-210', '#08-212', '#08-214', '#08-216'].forEach((t, i) => x.fillText(t, W / 2, H * i + H / 2));
        return B({ map: tex(done(THREE, cv, false)) }); })();
      const doors = [0, ...NEIGHBOURS].sort((a, b) => a - b);
      doors.forEach((dx, i) => {
        box(mBox, dx - 0.75, 1.62, -0.055, 0.3, 0.42, 0.11);
        const k = Math.min(3, i), v0 = 1 - (k + 1) / 4 + 0.01, v1 = 1 - k / 4 - 0.01, Bt = batchOf(plates);
        /* (u runs from the +x end: seen from the corridor +x is on the left, and the plates were mirrored: build 20) */
        const P = [[dx + 0.16, 2.2, -0.006], [dx - 0.16, 2.2, -0.006], [dx - 0.16, 2.26, -0.006], [dx + 0.16, 2.26, -0.006]], U = [[0, v0], [1, v0], [1, v1], [0, v1]], I = [0, 1, 2, 0, 2, 3];
        for (let j = 0; j < 6; j++) { const q = P[I[j]]; Bt.p.push(q[0], q[1], q[2]); Bt.n.push(0, 0, -1); Bt.u.push(U[I[j]][0], U[I[j]][1]); }
      });
      const mVent = B({ map: (() => { const W = 256, cv = document.createElement('canvas'); cv.width = cv.height = W; const x = cv.getContext('2d');
        x.fillStyle = '#8f8a80'; x.fillRect(0, 0, W, W);
        for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) { x.fillStyle = '#23242a'; x.fillRect(i * 32 + 5, j * 32 + 5, 22, 22);
          x.fillStyle = 'rgba(220,214,190,0.22)'; x.fillRect(i * 32 + 9, j * 32 + 9, 14, 14); }
        const t = tex(done(THREE, cv, true)); rep(t, 0.9, 0.9); return t; })() });
      quad(mVent, [c.x1 - 0.02, y0, c.z1], [c.x1 - 0.02, y0, c.para + 0.15], [c.x1 - 0.02, c.soffit, c.para + 0.15], [c.x1 - 0.02, c.soffit, c.z1]);
      quad(mVent, [c.x0 + 0.02, y0, c.para + 0.15], [c.x0 + 0.02, y0, c.z1], [c.x0 + 0.02, c.soffit, c.z1], [c.x0 + 0.02, c.soffit, c.para + 0.15]);
      /* the corridor's own collision (the opening film walks it; play never does: the gate is shut behind them) */
      solidBox(c.x1 - c.x0, 1.2, 0.15, (c.x0 + c.x1) / 2, 0.5, c.para + 0.075);
    }

    /* ================================================================ THE ESTATE AT NIGHT
       (Chad, 18 Nov: "i think the intro cutscene can be improved much further, for example the hdb blocks at the start look
       way too basic and need to be improved much more. See how you can improve the intro cutscene without being too draggy.
       Improve the environment, props, assets, etc where needed.")
       What the opening film sees from her corridor on the 8th storey, built as a real estate is (docs/research/V27.0-HDB.md
       §2.3). THE BLOCK ACROSS, 40 m out: a thirteen-storey corridor slab of the early 1990s, as hers is, its corridor side to
       her. A void deck under it, lit by its tubes; on each of twelve storeys an access corridor 1.9 m deep with its parapet,
       the slab's edge under it and the next slab over it, an LED batten every 7 m and the light it throws on the ceiling,
       the wall and the floor; behind each parapet a row of flats of her own plan (bedroom 3's window, the door behind its
       grille gate, the living room's window, the main bedroom's), each a household of its own: lit warm, cool or by a
       television, or dark; the gate shut or the door open on a lit room; shoes, pots, a bicycle, a red altar lamp by a
       door, the unit's number. The party walls stand out of the face as fins; a lift core with its lobby lit brighter and
       its motor room above the roof, the block's number painted on it; a stair tower at each end; on the roof its frame,
       its tanks and its masts. Below: a road with its markings, the footpaths and the grass, the estate's trees and its
       street lamps (real models, made for this chapter), their light on the ground, a covered walkway lit by its tubes.
       Beyond and between: the blocks of the estate round it and the taller blocks of a newer one, every corridor a lit line
       and every window its own, fading into the haze; the city's glow low in the sky. Painted light throughout (v9.4: no
       light is added), every size true. Seeded (v6.15): the same estate on every run. */
    function buildEstate() {
      const A = ACROSS, G = GROUND_Y, SH = A.storey, NS = A.storeys, TOP = G + NS * SH;
      const WZ = A.z, PZ = A.z + 1.9, PO = PZ + 0.15;            // the flats' corridor wall; the parapet's inner and outer faces
      const BAY = 10.2, STAIR = 6.6, LOBBY_I = 4;                 // a unit's frontage; a stair tower's width; the bay the lift lobby is
      const r = rng(270042);
      const canvas = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return [c, c.getContext('2d')]; };
      const lit = (c, rx, ry) => { const t = tex(done(THREE, c, true)); if (rx) rep(t, rx, ry); t.anisotropy = 8; return t; };
      /* a quad whose UVs are given (an atlas's cell), not metres */
      function quadUV(mat, a, b, c, d, u0, v0, u1, v1) {
        const Bt = batchOf(mat);
        const ax = b[0] - a[0], ay = b[1] - a[1], az = b[2] - a[2], dx = d[0] - a[0], dy = d[1] - a[1], dz = d[2] - a[2];
        let nx = ay * dz - az * dy, ny = az * dx - ax * dz, nz = ax * dy - ay * dx; const nl = Math.hypot(nx, ny, nz) || 1; nx /= nl; ny /= nl; nz /= nl;
        const P = [a, b, c, a, c, d], U = [[u0, v0], [u1, v0], [u1, v1], [u0, v0], [u1, v1], [u0, v1]];
        for (let i = 0; i < 6; i++) { Bt.p.push(P[i][0], P[i][1], P[i][2]); Bt.n.push(nx, ny, nz); Bt.u.push(U[i][0], U[i][1]); }
      }

      /* ---------------------------------------------- THE FLATS BEHIND THE PARAPETS: an atlas of households
         Twelve frontages of her plan, 10.2 m by 2.6 m each at 100 px a metre, every one a different household under the
         corridor's light; drawn on the corridor wall bay by bay, a seeded deal so no two neighbours are the same. A lobby
         cell for the lift's storeys. */
      const NV = 12, PXM = 100, CW = 1024, CH = 260, [ac, ax] = canvas(CW, CH * (NV + 1));
      const WALLC = ['#a49a87', '#a8a08e', '#9f9888', '#aaa290', '#a19786'];
      const CURT = ['#f0c27e', '#e8b070', '#f4d39a', '#d99a7a', '#e7c6a0', '#c8d6e6', '#e2e6ee', '#d6c2e0', '#b9d3a8', '#f2dcb6'];
      const DOORC = ['#5c3b27', '#6d4a30', '#7b2b23', '#3f5a4a', '#4b3a2e', '#6b5a48', '#2f3f5a'];
      function windowAt(x, ox, oy, rr, x0, x1, sill, head, look) {
        const X = (m) => ox + m * PXM, Y = (m) => oy + CH - m * PXM;
        const L = X(x0), R = X(x1), T = Y(head), Bm = Y(sill);
        /* the opening's reveal and its aluminium frame */
        x.fillStyle = '#5b5850'; x.fillRect(L - 4, T - 4, R - L + 8, Bm - T + 8);
        if (look === 'dark') {
          const g = x.createLinearGradient(L, T, R, Bm); g.addColorStop(0, '#1d1f27'); g.addColorStop(0.55, '#121319'); g.addColorStop(1, '#191a20');
          x.fillStyle = g; x.fillRect(L, T, R - L, Bm - T);
          x.fillStyle = 'rgba(160,170,190,0.10)'; x.fillRect(L + (R - L) * 0.15, T + 4, (R - L) * 0.12, Bm - T - 8);   // a reflection
        } else {
          const base = look === 'tv' ? '#7f97d8' : look === 'cool' ? '#dbe4ef' : CURT[(rr() * CURT.length) | 0];
          x.fillStyle = base; x.fillRect(L, T, R - L, Bm - T);
          /* curtains' folds, a gap between the two halves where the room shows brighter */
          const gap = L + (R - L) * (0.3 + rr() * 0.4), gw = rr() < 0.5 ? 0 : 6 + rr() * 26;
          for (let px = L; px < R; px += 5) { x.fillStyle = `rgba(0,0,0,${0.05 + 0.07 * Math.abs(Math.sin(px * 0.9 + rr()))})`; x.fillRect(px, T, 2.5, Bm - T); }
          if (gw) { x.fillStyle = look === 'tv' ? 'rgba(200,215,255,0.8)' : 'rgba(255,244,220,0.85)'; x.fillRect(gap, T, gw, Bm - T); }
          const g = x.createLinearGradient(0, T, 0, Bm); g.addColorStop(0, 'rgba(255,255,255,0.18)'); g.addColorStop(1, 'rgba(0,0,0,0.18)');
          x.fillStyle = g; x.fillRect(L, T, R - L, Bm - T);
        }
        /* louvres (the older blocks' corridor windows) or two sliding panes */
        if (rr() < 0.55) { x.fillStyle = 'rgba(40,40,44,0.55)'; for (let py = T + 9; py < Bm; py += 10) x.fillRect(L, py, R - L, 1.6); }
        else { x.fillStyle = '#6a675f'; x.fillRect((L + R) / 2 - 2, T, 4, Bm - T); }
        /* a grille over it, white or dark (fitted by owners: most have one) */
        if (rr() < 0.85) { x.fillStyle = rr() < 0.6 ? 'rgba(222,222,214,0.95)' : 'rgba(40,40,42,0.95)';
          for (let px = L + 6; px < R - 2; px += 12) x.fillRect(px, T - 2, 2.4, Bm - T + 4);
          x.fillRect(L - 3, (T + Bm) / 2 - 1.5, R - L + 6, 3); }
        /* the sill */
        x.fillStyle = '#8a8476'; x.fillRect(L - 8, Bm, R - L + 16, 5);
      }
      function household(x, ox, oy, rr, v) {
        const X = (m) => ox + m * PXM, Y = (m) => oy + CH - m * PXM;
        /* the wall, lit from the battens over the corridor: brighter near the ceiling, a little dimmer down to the floor */
        x.fillStyle = WALLC[v % WALLC.length]; x.fillRect(ox, oy, CW, CH);
        const g = x.createLinearGradient(0, oy, 0, oy + CH); g.addColorStop(0, 'rgba(255,248,232,0.16)'); g.addColorStop(0.45, 'rgba(255,248,232,0.04)'); g.addColorStop(1, 'rgba(0,0,0,0.26)');
        x.fillStyle = g; x.fillRect(ox, oy, CW, CH);
        for (let s = 0; s < 220; s++) { x.fillStyle = `rgba(${rr() < 0.5 ? '0,0,0' : '255,255,255'},0.03)`; x.fillRect(ox + rr() * CW, oy + rr() * CH, 3 + rr() * 9, 3 + rr() * 9); }
        /* its skirting, a tiled dado on some */
        x.fillStyle = 'rgba(70,64,56,0.55)'; x.fillRect(ox, Y(0.12), CW, 0.12 * PXM);
        /* the downpipe at the party wall, the gas riser by it */
        x.fillStyle = '#6f6c66'; x.fillRect(X(10.02), oy, 9, CH); x.fillStyle = '#c9b33c'; x.fillRect(X(9.86), Y(2.6), 4, CH);
        /* bedroom 3's window, the living room's, the main bedroom's (her plan's places, from the bay's left) */
        const looks = ['warm', 'warm', 'cool', 'tv', 'dark', 'dark', 'warm', 'cool', 'dark', 'warm'];
        const pick = () => looks[(rr() * looks.length) | 0];
        windowAt(x, ox, oy, rr, 0.2, 2.65, 0.9, 2.1, pick());
        windowAt(x, ox, oy, rr, 4.27, 6.45, 0.9, 2.1, pick());
        windowAt(x, ox, oy, rr, 6.6, 10.0, 0.9, 2.1, pick());
        /* the door: its frame, the leaf or, open, the lit room behind; the grille gate in front of it */
        const open = rr() < 0.28, DL = X(3.65), DR = X(4.55), DT = Y(2.1), DB = Y(0);
        x.fillStyle = '#4a463f'; x.fillRect(DL - 5, DT - 5, DR - DL + 10, DB - DT + 5);
        if (open) { const gg = x.createLinearGradient(0, DT, 0, DB); gg.addColorStop(0, '#f6d9a2'); gg.addColorStop(1, '#b98d5a');
          x.fillStyle = gg; x.fillRect(DL, DT, DR - DL, DB - DT);
          x.fillStyle = 'rgba(60,40,28,0.55)'; x.fillRect(DL + 10, Y(1.0), DR - DL - 20, 0.45 * PXM);        // a sofa's back in the room
        } else { x.fillStyle = DOORC[(rr() * DOORC.length) | 0]; x.fillRect(DL, DT, DR - DL, DB - DT);
          x.fillStyle = 'rgba(255,255,255,0.08)'; x.fillRect(DL + 4, DT + 4, 4, DB - DT - 8);
          x.fillStyle = '#c8a24a'; x.fillRect(DR - 14, Y(1.05), 8, 3); }
        x.fillStyle = rr() < 0.7 ? 'rgba(36,36,38,0.96)' : 'rgba(210,210,204,0.95)';
        for (let px = DL + 3; px < DR; px += 8) x.fillRect(px, DT + 14, 2.2, DB - DT - 14);
        x.fillRect(DL - 2, DT + 4, DR - DL + 4, 10); x.fillRect(DL - 2, Y(1.05), DR - DL + 4, 3); x.fillRect((DL + DR) / 2 - 1.5, DT + 4, 3, DB - DT - 4);
        /* by the door: the unit's number, the meter box, and on some a red altar lamp (Chinese households) or the mango
           leaves over the door (Indian ones) */
        x.fillStyle = '#e8e4d8'; x.fillRect(DR + 8, Y(1.75), 20, 9);
        x.fillStyle = '#7d7a72'; x.fillRect(DL - 46, Y(1.75), 30, 38);
        const deity = rr();
        if (deity < 0.3) { const gl = x.createRadialGradient(DL - 22, Y(1.05), 1, DL - 22, Y(1.05), 22); gl.addColorStop(0, 'rgba(255,60,40,0.95)'); gl.addColorStop(1, 'rgba(255,40,20,0)');
          x.fillStyle = gl; x.fillRect(DL - 46, Y(1.05) - 24, 48, 48); x.fillStyle = '#ff6a4a'; x.fillRect(DL - 26, Y(1.1), 8, 10); }
        else if (deity < 0.42) { x.fillStyle = '#2f6a2a'; for (let i = 0; i < 9; i++) { x.beginPath(); x.ellipse(DL + 4 + i * 10, DT + 6, 3.5, 8, 0, 0, Math.PI * 2); x.fill(); } }
        /* along the wall: a shoe rack, pots, a bicycle (most hidden by the parapet from her storey; seen on the lower ones) */
        if (rr() < 0.8) { const sx = X(rr() < 0.5 ? 2.75 : 4.7); x.fillStyle = '#3a3a3c'; x.fillRect(sx, Y(0.5), 0.8 * PXM, 0.5 * PXM);
          for (let i = 0; i < 9; i++) { x.fillStyle = ['#2b2b2b', '#6a4a30', '#a0a0a0', '#2c4a7a', '#8a2a2a'][(rr() * 5) | 0]; x.fillRect(sx + 4 + (i % 4) * 18, Y(0.12 + ((i / 4) | 0) * 0.17), 14, 5); } }
        const pots = (rr() * 4) | 0;
        for (let i = 0; i < pots; i++) { const px = X(0.4 + rr() * 9.2), h = 0.35 + rr() * 0.6;
          x.fillStyle = ['#7a4a2e', '#2a3a2a', '#9a9a92'][(rr() * 3) | 0]; x.fillRect(px - 9, Y(0.28), 18, 0.28 * PXM);
          x.fillStyle = `rgb(${40 + rr() * 30},${80 + rr() * 50},${40 + rr() * 25})`;
          for (let k = 0; k < 7; k++) { x.beginPath(); x.ellipse(px + (rr() - 0.5) * 30, Y(0.28 + rr() * h), 6 + rr() * 9, 5 + rr() * 8, 0, 0, Math.PI * 2); x.fill(); } }
        if (rr() < 0.18) { const bx = X(5.2 + rr() * 3); x.strokeStyle = '#1e1e20'; x.lineWidth = 3;
          for (const wx of [bx, bx + 105]) { x.beginPath(); x.arc(wx, Y(0.33), 31, 0, Math.PI * 2); x.stroke(); }
          x.beginPath(); x.moveTo(bx, Y(0.33)); x.lineTo(bx + 45, Y(0.85)); x.lineTo(bx + 105, Y(0.33)); x.moveTo(bx + 45, Y(0.85)); x.lineTo(bx + 30, Y(0.33)); x.stroke(); }
      }
      for (let v = 0; v < NV; v++) household(ax, 0, v * CH, rng(9100 + v * 37), v);
      /* the lift lobby's cell: tiled walls under bright tubes, two stainless lift doors, the call button, the floor's number */
      { const ox = 0, oy = NV * CH, X = (m) => ox + m * PXM, Y = (m) => oy + CH - m * PXM;
        ax.fillStyle = '#c9c8bf'; ax.fillRect(ox, oy, CW, CH);
        ax.strokeStyle = 'rgba(120,118,108,0.5)'; ax.lineWidth = 1;
        for (let px = 0; px < CW; px += 15) { ax.beginPath(); ax.moveTo(px, oy); ax.lineTo(px, oy + CH); ax.stroke(); }
        for (let py = oy; py < oy + CH; py += 15) { ax.beginPath(); ax.moveTo(0, py); ax.lineTo(CW, py); ax.stroke(); }
        for (const lx of [1.1, 3.0]) { const g = ax.createLinearGradient(X(lx), 0, X(lx + 1.1), 0); g.addColorStop(0, '#9ea2a6'); g.addColorStop(0.5, '#d9dde0'); g.addColorStop(1, '#8e9296');
          ax.fillStyle = '#5a5c5e'; ax.fillRect(X(lx) - 6, Y(2.15) - 6, 1.1 * PXM + 12, 2.15 * PXM + 6);
          ax.fillStyle = g; ax.fillRect(X(lx), Y(2.15), 1.1 * PXM, 2.15 * PXM); ax.fillStyle = '#4a4c4e'; ax.fillRect(X(lx + 0.55) - 1, Y(2.15), 2, 2.15 * PXM);
          ax.fillStyle = '#ff5a3a'; ax.fillRect(X(lx + 0.4), Y(2.4), 0.3 * PXM, 0.12 * PXM); }
        ax.fillStyle = '#e8e8e0'; ax.fillRect(X(2.6), Y(1.25), 10, 16);
        ax.fillStyle = 'rgba(255,255,255,0.12)'; ax.fillRect(ox, oy, CW, CH * 0.4); }
      const atlasT = lit(ac); atlasT.wrapS = atlasT.wrapT = THREE.ClampToEdgeWrapping;
      const mFlats = B({ map: atlasT, fog: true });

      /* ---------------------------------------------- the corridor's ceiling and floor, lit by its battens (7 m apart) */
      const strip = (W, Hh, base, hot, edge, seed, terr) => { const [c, x] = canvas(W, Hh), rr = rng(seed);
        x.fillStyle = base; x.fillRect(0, 0, W, Hh);
        if (terr) for (let s = 0; s < 2600; s++) { const v = rr(); x.fillStyle = v < 0.5 ? 'rgba(30,30,28,0.35)' : 'rgba(220,216,206,0.25)'; x.fillRect(rr() * W, rr() * Hh, 1 + rr() * 2, 1 + rr() * 2); }
        const g = x.createRadialGradient(W / 2, Hh * 0.5, 4, W / 2, Hh * 0.5, W * 0.48); g.addColorStop(0, hot); g.addColorStop(0.35, edge); g.addColorStop(1, 'rgba(0,0,0,0)');
        x.globalCompositeOperation = 'lighter'; x.fillStyle = g; x.fillRect(0, 0, W, Hh); x.globalCompositeOperation = 'source-over';
        return c; };
      /* (these and every atlas below are laid with their own UVs, quadUV: one picture a tile, so no repeat is set on them) */
      const mCeil7 = B({ map: lit(strip(512, 128, '#55524b', 'rgba(255,250,236,0.62)', 'rgba(255,250,236,0.18)', 7101)), fog: true });
      const mFloor7 = B({ map: lit(strip(512, 128, '#3a3833', 'rgba(255,248,230,0.42)', 'rgba(255,248,230,0.12)', 7102, true)), fog: true });
      const mBat = B({ color: 0xf6f9ff, fog: true });
      /* the parapet's outer face (its paint, its accent band, a coping catching the corridor's light on its edge, rain
         streaks under it), the slab's edge under it: a 5 m tile */
      const ACC = '#5b3a30';
      const mPara = B({ fog: true, map: lit((() => { const [c, x] = canvas(512, 160), rr = rng(7103);
        /* (a step darker at build 20: the night is the lit corridors') */
        x.fillStyle = '#48453f'; x.fillRect(0, 0, 512, 160);
        x.fillStyle = ACC; x.fillRect(0, 60, 512, 22);                                   // the block's band of colour
        x.fillStyle = '#8f8a7e'; x.fillRect(0, 0, 512, 7);                               // the coping's lit edge
        x.fillStyle = '#34322e'; x.fillRect(0, 7, 512, 6);                               // its shadow
        x.fillStyle = '#2c2a27'; x.fillRect(0, 128, 512, 32);                            // the slab's edge
        for (let s = 0; s < 70; s++) { const sx = rr() * 512, sw = 2 + rr() * 6, sl = 20 + rr() * 90;
          const g = x.createLinearGradient(0, 13, 0, 13 + sl); g.addColorStop(0, 'rgba(20,18,16,0.35)'); g.addColorStop(1, 'rgba(20,18,16,0)');
          x.fillStyle = g; x.fillRect(sx, 13, sw, sl); }
        return c; })()) });
      const mParaIn = B({ color: 0x6e695f, fog: true });                                // its inner face and top, in the corridor's light
      const mFin = B({ fog: true, map: lit((() => { const [c, x] = canvas(64, 512);
        /* (the parapets' paint: drawn near black they read as poles, build 20) */
        const g = x.createLinearGradient(0, 0, 0, 512); g.addColorStop(0, '#403d39'); g.addColorStop(0.7, '#4a4741'); g.addColorStop(1, '#58544c');
        x.fillStyle = g; x.fillRect(0, 0, 64, 512); x.fillStyle = 'rgba(255,255,255,0.05)'; x.fillRect(0, 0, 6, 512); return c; })()) });
      const mDark = B({ color: 0x24242a, fog: true });                                  // ends and backs, in the night
      const mRoofEdge = B({ color: 0x302f34, fog: true });

      /* ---------------------------------------------- THE BLOCK ACROSS, storey by storey */
      /* nine flats a storey between the stair towers (105 m: 6.6 + 9 x 10.2 + 6.6), the lift lobby in the fifth */
      const bays = []; for (let bx = A.x0 + STAIR; bx + BAY <= A.x1 - STAIR + 0.01; bx += BAY) bays.push(bx);
      const LX = bays[LOBBY_I] + BAY / 2;
      const deal = rng(4404);
      for (let s = 1; s < NS; s++) {
        const fl = G + s * SH, ce = fl + SH - 0.25;
        /* the floor slab's edge and the parapet (outer face, inner face, top), end to end */
        quadUV(mPara, [A.x0, fl - 0.30, PO], [A.x1, fl - 0.30, PO], [A.x1, fl + 1.0, PO], [A.x0, fl + 1.0, PO], 0, 0, (A.x1 - A.x0) / 5, 1);
        quad(mParaIn, [A.x1, fl, PZ], [A.x0, fl, PZ], [A.x0, fl + 1.0, PZ], [A.x1, fl + 1.0, PZ]);
        quad(mParaIn, [A.x0, fl + 1.0, PO + 0.03], [A.x1, fl + 1.0, PO + 0.03], [A.x1, fl + 1.0, PZ], [A.x0, fl + 1.0, PZ]);
        /* the corridor's floor and ceiling, its battens */
        quadUV(mFloor7, [A.x0, fl + 0.01, PZ], [A.x1, fl + 0.01, PZ], [A.x1, fl + 0.01, WZ], [A.x0, fl + 0.01, WZ], 0, 0, (A.x1 - A.x0) / 7, 1);
        quadUV(mCeil7, [A.x0, ce, WZ], [A.x1, ce, WZ], [A.x1, ce, PZ], [A.x0, ce, PZ], 0, 0, (A.x1 - A.x0) / 7, 1);
        for (let bx = A.x0 + 3.5; bx < A.x1; bx += 7) box(mBat, bx, ce - 0.03, (WZ + PZ) / 2, 1.2, 0.04, 0.08);
        /* the flats behind it, bay by bay (and the lift lobby's cell where the lobby is) */
        for (const [bi, bx] of bays.entries()) {
          const lobby = bi === LOBBY_I;
          const v = lobby ? NV : (deal() * NV) | 0, flip = deal() < 0.5;
          const v0 = 1 - (v + 1) / (NV + 1), v1 = 1 - v / (NV + 1), u0 = flip ? 1 : 0, u1 = flip ? 0 : 1;
          quadUV(mFlats, [bx, fl, WZ], [bx + BAY, fl, WZ], [bx + BAY, ce, WZ], [bx, ce, WZ], u0, v0 + 0.0004, u1, v1 - 0.0004);
        }
      }
      /* the ends past the first and last bays: the stair towers (their vents lit dimly, the stair's lamp in each) */
      const stairT = lit((() => { const [c, x] = canvas(128, 512), rr = rng(7105);
        x.fillStyle = '#2e2d30'; x.fillRect(0, 0, 128, 512);
        for (let s = 0; s < 13; s++) { const y = 512 - (s + 1) * 512 / 13;
          for (let i = 0; i < 6; i++) for (let j = 0; j < 4; j++) { x.fillStyle = s ? `rgba(230,220,190,${0.25 + rr() * 0.25})` : 'rgba(40,40,40,1)'; x.fillRect(22 + i * 15, y + 8 + j * 8, 9, 5); } }
        return c; })());
      const mStair = B({ map: stairT, fog: true });
      for (const sx of [A.x0 + STAIR / 2, A.x1 - STAIR / 2]) {
        const hw = STAIR / 2;
        quadUV(mStair, [sx - hw, G, PO + 1.02], [sx + hw, G, PO + 1.02], [sx + hw, TOP + 1.4, PO + 1.02], [sx - hw, TOP + 1.4, PO + 1.02], 0, 0, 1, 1);
        box(mDark, sx, (G + TOP + 1.4) / 2, (WZ + PO + 1.0) / 2 - 3, STAIR, TOP + 1.4 - G, PO + 1.0 - WZ + 6);
      }
      /* the party walls standing out of the face as fins, ground to roof, between every two flats */
      for (let i = 0; i <= bays.length; i++) { const fx = (i < bays.length ? bays[i] : bays[bays.length - 1] + BAY);
        quadUV(mFin, [fx - 0.2, G, PO + 0.35], [fx + 0.2, G, PO + 0.35], [fx + 0.2, TOP + 0.6, PO + 0.35], [fx - 0.2, TOP + 0.6, PO + 0.35], 0, 0, 1, 1);
        quad(mDark, [fx - 0.2, G, WZ], [fx - 0.2, G, PO + 0.35], [fx - 0.2, TOP + 0.6, PO + 0.35], [fx - 0.2, TOP + 0.6, WZ]);
        quad(mDark, [fx + 0.2, G, PO + 0.35], [fx + 0.2, G, WZ], [fx + 0.2, TOP + 0.6, WZ], [fx + 0.2, TOP + 0.6, PO + 0.35]); }
      /* the block's body behind its corridor face, its roof slab and parapet against the sky */
      box(mDark, (A.x0 + A.x1) / 2, (G + SH + TOP) / 2, WZ - 0.02 - (A.d - 0.02) / 2, A.x1 - A.x0, TOP - G - SH, A.d - 0.02);
      quad(mDark, [A.x0, G, WZ - A.d], [A.x1, G, WZ - A.d], [A.x1, G + SH, WZ - A.d], [A.x0, G + SH, WZ - A.d]);   // the void deck's back
      { const zb = WZ - A.d - 0.2, zf = PO - 0.02;                                       // the roof's parapet round its slab
        box(mRoofEdge, (A.x0 + A.x1) / 2, TOP + 0.4, (zb + zf) / 2, A.x1 - A.x0 + 0.4, 1.4, zf - zb); }
      quadUV(mPara, [A.x0, TOP - 0.3, PO + 0.01], [A.x1, TOP - 0.3, PO + 0.01], [A.x1, TOP + 1.1, PO + 0.01], [A.x0, TOP + 1.1, PO + 0.01], 0, 0, (A.x1 - A.x0) / 5, 1);
      /* THE LIFT CORE: its shaft above the roof, the motor room, the block's number on it, the lobby's tubes brighter */
      const numT = lit((() => { const [c, x] = canvas(256, 512);
        x.fillStyle = '#3a3633'; x.fillRect(0, 0, 256, 512); x.fillStyle = '#6b3f31'; x.fillRect(0, 0, 256, 30);
        x.fillStyle = '#e9e2d0'; x.font = 'bold 132px Arial, Helvetica, sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle';
        x.fillText('2', 128, 118); x.fillText('3', 128, 262); x.fillText('6', 128, 406);
        return c; })());
      const mNum = B({ map: numT, fog: true });
      quadUV(mNum, [LX - 2.4, TOP + 0.2, PO + 0.62], [LX + 2.4, TOP + 0.2, PO + 0.62], [LX + 2.4, TOP + 6.6, PO + 0.62], [LX - 2.4, TOP + 6.6, PO + 0.62], 0, 0, 1, 1);
      box(mDark, LX, TOP + 3.4, (WZ + PO + 0.6) / 2 - 1.5, 4.8, 6.4, PO + 0.6 - WZ + 3);
      box(mRoofEdge, LX, TOP + 6.75, (WZ + PO + 0.6) / 2 - 1.5, 5.4, 0.3, PO + 0.6 - WZ + 3.6);
      /* the roof's frame (the period's pitched concrete frames over the roof) and its water tanks and masts */
      for (const fx of [A.x0 + 12, A.x0 + 34, A.x1 - 30, A.x1 - 10]) {
        for (const dz of [-1, 1]) bar(mRoofEdge, [fx - 4, TOP + 1.1, WZ - A.d / 2 + dz * 4], [fx, TOP + 4.2, WZ - A.d / 2 + dz * 4], 0.18, 4);
        for (const dz of [-1, 1]) bar(mRoofEdge, [fx + 4, TOP + 1.1, WZ - A.d / 2 + dz * 4], [fx, TOP + 4.2, WZ - A.d / 2 + dz * 4], 0.18, 4);
        bar(mRoofEdge, [fx, TOP + 4.2, WZ - A.d / 2 - 4], [fx, TOP + 4.2, WZ - A.d / 2 + 4], 0.16, 4);
      }
      box(mDark, LX + 7, TOP + 2.2, WZ - A.d / 2, 6, 2.2, 4);
      for (const mx of [A.x0 + 22, A.x1 - 22, LX - 9]) post(mRoofEdge, mx, WZ - A.d / 2 + 2, 0.04, TOP + 1.1, TOP + 6.5, 5);
      /* THE VOID DECK: open under the block, its columns, the tubes on its ceiling and their light on the floor, the
         letter boxes' lit panel by the lift */
      const mVoidCeil = B({ map: lit(strip(512, 256, '#4a4842', 'rgba(255,250,236,0.75)', 'rgba(255,250,236,0.22)', 7106)), fog: true });
      const mVoidFloor = B({ map: lit(strip(512, 256, '#2e2d2a', 'rgba(255,248,230,0.45)', 'rgba(255,248,230,0.10)', 7107, true)), fog: true });
      quadUV(mVoidCeil, [A.x0, G + SH - 0.3, WZ - A.d], [A.x1, G + SH - 0.3, WZ - A.d], [A.x1, G + SH - 0.3, PO], [A.x0, G + SH - 0.3, PO], 0, 0, (A.x1 - A.x0) / 5.1, (PO - WZ + A.d) / 5);
      quadUV(mVoidFloor, [A.x0, G + 0.02, PO], [A.x1, G + 0.02, PO], [A.x1, G + 0.02, WZ - A.d], [A.x0, G + 0.02, WZ - A.d], 0, 0, (A.x1 - A.x0) / 5.1, (PO - WZ + A.d) / 5);
      for (let cx = A.x0 + 4.4; cx <= A.x1 - 4.3; cx += 5.1) for (const cz of [PO - 0.4, WZ - A.d + 0.5]) box(mParaIn, cx, G + SH / 2, cz, 0.6, SH, 0.6);
      for (let tx = A.x0 + 6.95; tx < A.x1 - 4; tx += 5.1) for (const tz of [WZ - 2, WZ - 7]) box(mBat, tx, G + SH - 0.34, tz, 1.2, 0.04, 0.1);
      { const [c, x] = canvas(256, 128); x.fillStyle = '#8c8a80'; x.fillRect(0, 0, 256, 128); x.fillStyle = '#5c5a52';
        for (let i = 0; i < 16; i++) for (let j = 0; j < 6; j++) x.fillRect(4 + i * 15.8, 6 + j * 20, 13, 17);
        quadUV(B({ map: lit(c), fog: true }), [LX - 2.2, G + 0.4, WZ - 0.9], [LX + 2.2, G + 0.4, WZ - 0.9], [LX + 2.2, G + 2.0, WZ - 0.9], [LX - 2.2, G + 2.0, WZ - 0.9], 0, 0, 1, 1); }

      /* ---------------------------------------------- THE GROUND between the blocks and round them */
      const mGrass = B({ fog: true, map: lit((() => { const [c, x] = canvas(256, 256), rr = rng(7108);
        x.fillStyle = '#16200f'; x.fillRect(0, 0, 256, 256);
        for (let s = 0; s < 3000; s++) { x.fillStyle = `rgba(${30 + rr() * 30},${50 + rr() * 40},${20 + rr() * 20},0.5)`; x.fillRect(rr() * 256, rr() * 256, 2, 2); }
        return c; })(), 6, 6) });
      const mRoad = B({ color: 0x1b1c1f, fog: true });
      const mPath = B({ color: 0x3c3a36, fog: true });
      const mLine = B({ color: 0x8c8a82, fog: true });
      const mKerb = B({ color: 0x55534d, fog: true });
      floor(mGrass, -160, -150, 160, 60, G);
      floor(mRoad, -160, -35.2, 160, -28.0, G + 0.02);                                    // the road along the block across
      for (let lx = -150; lx < 150; lx += 6) floor(mLine, lx, -31.68, lx + 3, -31.52, G + 0.03);
      floor(mPath, -160, -38.6, 160, -35.2, G + 0.025); floor(mPath, -160, -28.0, 160, -25.6, G + 0.025);   // its footpaths
      box(mKerb, 0, G + 0.08, -35.2, 320, 0.16, 0.18); box(mKerb, 0, G + 0.08, -28.0, 320, 0.16, 0.18);
      floor(mPath, -160, -6.0, 160, -3.2, G + 0.025);                                     // the path under her own block
      /* the covered walkway along her block's foot: its roof on posts, the tubes under it lit (seen over the parapet) */
      const WK = { z: -12.5, w: 3.0, h: 3.0 };
      box(mDark, 0, G + WK.h + 0.08, WK.z, 120, 0.16, WK.w);
      quad(B({ color: 0xcfc9b8, fog: true }), [-60, G + WK.h, WK.z + WK.w / 2], [60, G + WK.h, WK.z + WK.w / 2], [60, G + WK.h, WK.z - WK.w / 2], [-60, G + WK.h, WK.z - WK.w / 2]);
      for (let px = -58; px <= 58; px += 6) for (const pz of [WK.z - 1.35, WK.z + 1.35]) post(mParaIn, px, pz, 0.06, G, G + WK.h, 6);
      floor(mPath, -60, WK.z - WK.w / 2, 60, WK.z + WK.w / 2, G + 0.03);
      /* the street lamps' light on the ground (painted pools: their heads are the models') */
      const poolT = lit((() => { const [c, x] = canvas(128, 128); const g = x.createRadialGradient(64, 64, 2, 64, 64, 62);
        g.addColorStop(0, 'rgba(255,246,226,0.55)'); g.addColorStop(0.4, 'rgba(255,240,215,0.22)'); g.addColorStop(1, 'rgba(255,240,215,0)');
        x.fillStyle = g; x.fillRect(0, 0, 128, 128); return c; })());
      const mPool = new THREE.MeshBasicMaterial({ map: poolT, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: true }); mats.push(mPool);
      /* each lamp's pole on a footpath 0.6 m from the kerb, its arm over the road (s: the way it reaches in z). The model
         (its photographs and its box, 18 Nov): 1.99 m long, the arm reaching -x at a turn of 0, the pole 0.75 m from the
         box's middle on its +x side, the head's middle 1.45 m out from the pole; turned a quarter to reach the road */
      const LAMPS = [];
      for (let lx = -96; lx <= 96; lx += 24) LAMPS.push({ x: lx, zp: -27.4, s: -1 });
      for (let lx = -84; lx <= 84; lx += 24) LAMPS.push({ x: lx, zp: -35.8, s: 1 });
      for (const L of LAMPS) { const pz = L.zp + L.s * 1.45;
        quadUV(mPool, [L.x - 7, G + 0.05, pz + 7], [L.x + 7, G + 0.05, pz + 7], [L.x + 7, G + 0.05, pz - 7], [L.x - 7, G + 0.05, pz - 7], 0, 0, 1, 1); }
      many('w4streetlamp', LAMPS.map(L => ({ x: L.x, y: G, z: L.zp + L.s * 0.75, ry: L.s < 0 ? -Math.PI / 2 : Math.PI / 2 })), world, 0.02);
      /* the estate's trees: angsanas along the road and the paths, foxtail palms in the gaps */
      const TREES = [], PALMS = [], tr = rng(7110);
      for (let tx = -84; tx <= 84; tx += 16) { if (tr() < 0.15) continue; TREES.push({ x: tx + (tr() - 0.5) * 4, y: G, z: -23.2 + (tr() - 0.5) * 2, ry: tr() * 6.28, s: 0.85 + tr() * 0.3 }); }
      for (const [tx, tz] of [[-68, -36], [-74, -50], [54, -33], [61, -47], [-30, -8.5], [-13, -9], [16, -8.5], [33, -9]]) TREES.push({ x: tx, y: G, z: tz, ry: tr() * 6.28, s: 0.8 + tr() * 0.3 });
      for (let tx = -90; tx <= 90; tx += 13) { if (tr() < 0.35) continue; PALMS.push({ x: tx + (tr() - 0.5) * 3, y: G, z: -17.5 + (tr() - 0.5) * 3, ry: tr() * 6.28, s: 0.9 + tr() * 0.2 }); }
      /* in bands 32 m wide, each its own instanced mesh, so the frame draws only the trees it looks at (an instanced mesh
         is culled whole by the sphere round all its copies: one mesh for the street was every tree in every frame) */
      const bands = (list) => { const byBand = new Map(); for (const it of list) { const band = Math.floor((it.x + 200) / 32); if (!byBand.has(band)) byBand.set(band, []); byBand.get(band).push(it); } return [...byBand.values()]; };
      for (const grp of bands(TREES)) many('w4angsana', grp, world, 0.03);
      for (const grp of bands(PALMS)) many('w4foxpalm', grp, world, 0.03);

      /* ---------------------------------------------- THE BLOCKS ROUND THEM, and the newer estate's taller ones beyond:
         each its corridor lines and its windows, painted at a storey's true size, fading into the haze */
      const farT = (seed, cols, rows) => { const [c, x] = canvas(512, 512), rr = rng(seed), cw = 512 / cols, rh = 512 / rows;
        x.fillStyle = '#1d1d23'; x.fillRect(0, 0, 512, 512);
        for (let j = 0; j < rows; j++) { const y0 = j * rh;
          x.fillStyle = 'rgba(205,214,232,0.55)'; x.fillRect(0, y0 + rh * 0.08, 512, Math.max(1.5, rh * 0.07));      // the corridor's lit line
          x.fillStyle = '#2a2a30'; x.fillRect(0, y0 + rh * 0.66, 512, rh * 0.1);                                         // the parapet's band
          for (let i = 0; i < cols; i++) { const v = rr(); if (v > 0.62) continue;
            x.fillStyle = v < 0.3 ? '#e9c487' : v < 0.48 ? '#d7e0ea' : v < 0.54 ? '#8ea4dc' : '#f0b878';
            x.fillRect(i * cw + cw * 0.2, y0 + rh * 0.22, cw * 0.55, rh * 0.36); } }
        return c; };
      const FAR = [[7120, 24, 13], [7121, 20, 30], [7122, 28, 16]].map(([sd, cols, rows]) => ({ m: B({ map: lit(farT(sd, cols, rows)), fog: true }), W: cols * 3.4, H: rows * 2.85 }));
      const [mFarA, mFarB, mFarC] = FAR;
      const slab = (F, x0, z0, x1, z1, h, d = 12) => {               // a block from (x0, z0) to (x1, z1), its lit face toward her
        const nx = z1 - z0, nz = -(x1 - x0), nl = Math.hypot(nx, nz), ox = nx / nl * d, oz = nz / nl * d;
        quadUV(F.m, [x0, G, z0], [x1, G, z1], [x1, G + h, z1], [x0, G + h, z0], 0, 0, nl / F.W, h / F.H);
        quad(mDark, [x0 + ox, G, z0 + oz], [x0, G, z0], [x0, G + h, z0], [x0 + ox, G + h, z0 + oz]);
        quad(mDark, [x1, G, z1], [x1 + ox, G, z1 + oz], [x1 + ox, G + h, z1 + oz], [x1, G + h, z1]);
        quad(mRoofEdge, [x0, G + h, z0], [x1, G + h, z1], [x1 + ox, G + h, z1 + oz], [x0 + ox, G + h, z0 + oz]);
      };
      slab(mFarA, -128, -8, -74, -46, 37.05);                          // a block turned toward her, west of the one across
      slab(mFarA, 66, -52, 118, -20, 37.05);                           // and one east of it
      slab(mFarC, -150, -112, -60, -128, 45.6);                        // the next row behind, three storeys taller
      slab(mFarC, 40, -120, 140, -104, 45.6);
      /* (the newer estate's towers, 34 to 40 storeys: from her storey they must rise past the block across's roof, 21.6
         degrees up, to be seen over it at 150 to 200 m) */
      slab(mFarB, -46, -150, -8, -158, 108.3, 14);
      slab(mFarB, 18, -176, 52, -182, 114.0, 14);
      slab(mFarB, -96, -190, -64, -200, 102.6, 14);
      slab(mFarB, 84, -168, 112, -176, 96.9, 14);
      /* her own block's corridor face below her storey (each storey's band, its lit line and the parapet) */
      for (let s = 1; s <= 7; s++) { const y = -s * 2.85;
        const zo = CORR.para - 0.075;
        quadUV(mPara, [CORR.x1, y - 0.3, zo], [CORR.x0, y - 0.3, zo], [CORR.x0, y + 1.0, zo], [CORR.x1, y + 1.0, zo], 0, 0, (CORR.x1 - CORR.x0) / 5, 1);
        box(mBat, 0, y + 2.5, CORR.para + 0.6, CORR.x1 - CORR.x0, 0.02, 0.02); }
    }

    /* the glass of every window, drawn last (see-through: after the opaque) */
    function buildGlass() {
      for (const g of glass) quad(mGlassNight, [g.x0, g.y0, g.z], [g.x1, g.y0, g.z], [g.x1, g.y1, g.z], [g.x0, g.y1, g.z]);
    }

    /* ---------------------------------------------- the ground under him: her floor, the corridor 0.10 below it */
    function flatGround(x, z) { return z < FL.face * 0.5 ? FL.corr : 0; }

    buildShell();
    buildCorridor();
    buildEstate();
    buildGlass();
    flush(world);
    /* ================================================================ THE PEOPLE: chapter 3's machinery, copied whole
       (one skeleton and several skins a person, the takes at weights, the films' poses by the clock, the feet set down by
       their own lowest contact, the head's and the shoulders' restraint, the hands laid by numbers, the levels by the
       lens). Every one of its laws was learned on chapter 3's bodies and holds for these: see its own notes below. The
       one change (assemble.py EDITS): the bodies this chapter made are keyed p4, and the ground under them is the flat's
       (flatGround). */
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
       rig laid on each by tools/riglod.mjs), and `<key>h` is the generator's own model with every triangle: for the two
       he speaks to face to face, and since v26.4 for the four seated masters and the woman lighting the candles (Chad, 13
       Nov 2026, of the brown hermit drawn from his 30,665-triangle body where he stood over him: "Why is the brown lersi
       so blocky here"; "30k triangles up close should never have been allowed"; and, told what a full body costs a
       phone: "Only the important people like ton, candle lighter female, seated masters, pho, and those that already are
       built this way can retain."). A crowd's driver takes none: its members never draw one.
       Each lighter or fuller skin is bound to the near body's own bones by name, so it
       wears every take and costs no skeleton; which one is drawn is chosen every frame from the lens (and so at a cut
       from the cut's own lens: v24.22), with a little slack so a person standing on a boundary does not flicker. */
    const people = [];
    /* NO SHRUNKEN COPIES OF A GENERATED BODY'S PAINT (v5.11's law, found again on 12 Nov: photographed on a phone's frame,
       every dark head on the turf was speckled white, a child's most of all). A generated body's sheet is hundreds of
       small patches packed edge to edge, each padded into its neighbours: black hair lies flush against white cloth.
       Every shrunken copy of the sheet averages one patch with the next, so a head drawn small is sampled from white
       and black mixed, along every seam of its hair. Plain sampling of the sheet itself never reaches past a texel,
       and the padding makes that texel the patch's own colour. Every body this chapter made (keys e4...), at every
       level; Chad's own models (Grandmaster Pho, the monk) are as he gave them and are not touched. */
    const NOMIP = /^p4/;
    /* v26.1 · A SHEET LAID OUT AGAIN WITH ROOM BETWEEN ITS CHARTS IS DRAWN WITH MIPMAPS (Chad, 12 Nov 2026: the faces
       "absolutely butchered", "really bad" on a 720p phone, "absolutely horrendous" on his own phone). Drawn without them, a
       face with more texels than the phone has pixels was SAMPLED: it sparkled and crawled as anything moved, and a still
       picture hides that. Every level of every body this chapter made is now baked into a sheet with a margin round each
       chart (masters/v26.0/people.sh REPAINT, tools/repaint.py), named `repainted`: such a sheet takes mipmaps and a
       little anisotropy, because averaging it can no longer bleed one chart into the next (v5.11's own answer). A sheet of
       any other name is drawn as it was. */
    /* (and A FACE BAKED ON A SHEET OF ITS OWN, `detail` (v26.3, Ton's: Chad, 13 Nov 2026, "the male character that the player
       keeps talking to, his face is too low res and compressed and blocky looking, improve it"). His full model kept the
       generator's flush charts (the repaint overlapped on its 310,000 triangles), so it was drawn without mipmaps, and from
       where he is talked to his face had three texels a pixel, sampled. His head's charts are baked by Blender into a 2048
       sheet of their own with a gutter round each (tools/rebake.py DETHANDS=0, masters/v26.3/make.sh), 1.6 times the
       texels, so it takes mipmaps as a repainted sheet does. Grandmaster Pho's own `detail` is his and is not touched) */
    /* A POSED VERTEX WITH EACH BONE'S MATRIX MADE ONCE A POSE (v26.11, FASTSKIN: the speed-ups' third, the load's own
       work). three's getVertexPosition multiplies a bone's world matrix by its inverse bind for every weight of every
       vertex it is asked for, and the chapter asks for every vertex of every body, at every moment it measures (the
       feet on the ground, the seats, the shins, the room round a body: several seconds of the load on this box). The
       product is the same sixteen numbers for every vertex of one pose, so it is made once a pose and a bone, by the
       same multiplyMatrices, and every vertex then takes three's own steps with it in the same order: the same base
       position (Mesh's, morphs and all), the same bind, the same weighted sum, the same inverse. `?opt=fastSkin:0` asks
       three every time; the proof reads every vertex of every body both ways (stage.skinProof) */
    const _svI = new THREE.Vector4(), _svW = new THREE.Vector4(), _svB = new THREE.Vector4(), _sv4 = new THREE.Vector4(), _svMats = new WeakMap();
    function skinMats(q) {
      const S = q.skeleton, bones = S.bones, inv = S.boneInverses;
      let L = _svMats.get(q); if (!L || L.length !== bones.length) { L = bones.map(() => new THREE.Matrix4()); _svMats.set(q, L); }
      for (let b = 0; b < bones.length; b++) L[b].multiplyMatrices(bones[b].matrixWorld, inv[b]);
      return L;
    }
    function skinVertex(q, i, target, L) {
      THREE.Mesh.prototype.getVertexPosition.call(q, i, target);
      const g = q.geometry;
      _svI.fromBufferAttribute(g.attributes.skinIndex, i); _svW.fromBufferAttribute(g.attributes.skinWeight, i);
      _svB.set(target.x, target.y, target.z, 1); target.set(0, 0, 0);
      _svB.applyMatrix4(q.bindMatrix);
      for (let k = 0; k < 4; k++) { const w = _svW.getComponent(k); if (w !== 0) { const b = _svI.getComponent(k); target.addScaledVector(_sv4.copy(_svB).applyMatrix4(L[b]), w); } }
      return target.applyMatrix4(q.bindMatrixInverse);
    }
    /* (v26.11: ONCE. A body made for one film borrows the near body's sheet (addLevel), and setting it up again asked the
       chip for a second upload of the same picture with the same settings, at the film's start. A sheet this has already
       set, whose settings are still the ones it set, is left as it is: what is on the chip is what that upload would have
       put there. `?opt=sheetOnce:0` sets it again as before) */
    const SHEETED = new WeakSet();
    function sheetOf(key, t) {
      if (t.name === 'repainted' || (t.name === 'detail' && NOMIP.test(key))) {
        if (SHEETONCE && SHEETED.has(t) && t.generateMipmaps === true && t.minFilter === THREE.LinearMipmapLinearFilter && t.anisotropy === 4) return t;
        t.generateMipmaps = true; t.minFilter = THREE.LinearMipmapLinearFilter; t.anisotropy = 4; t.needsUpdate = true; SHEETED.add(t); return t; }
      if (!NOMIP.test(key)) return t;
      if (SHEETONCE && SHEETED.has(t) && t.generateMipmaps === false && t.minFilter === THREE.LinearFilter) return t;
      SHEETED.add(t);
      return noMip(THREE, t);
    }
    /* (the children's runs and their skip too: c_crowd.js) */
    const WALKS = /^(walkdance|Run_02|Run_03|Walking)$/;                                 // (the takes that travel: the dancers' walk-dance, the children's two runs)
    /* (the full model's reach was 2.7 m until 12 Nov. Photographed at 2.55 m at both levels, on a phone's frame and a
       desktop's, magnified: no difference to be seen at that distance, and the full model is 310,000 triangles. At
       2.2 m (taken up inside 2.05, let go past 2.35, measured from the lens) it is drawn where he has walked up to
       talk, which is what it was made for: the view from his place in the line, where the woman at the bench stood
       inside the old reach, went from 832,000 triangles to 563,000. It was NOT the spawn's weight, as I first wrote:
       from the spawn Ton was already outside the old reach's own taking-up (2.51 m from the lens). That was the
       sandals behind him: c_zfx.js) */
    /* (v26.1: the near body drawn to 7 m, where it was 5.4, and the mid to 14, where it was 11.5: Chad, 12 Nov 2026, "even on
       the phone, i want a higher rendering budget". Each body's paint is laid out with margins and drawn with mipmaps
       now (sheetOf, above), and the face has three times the robe's share of each sheet: where the near body hands over,
       its face is drawn at about the mid body's own detail, so nothing pops; measured on the brown hermit, 1,091 texels a
       metre on the near face and 186 on the mid's, against a phone's 166 pixels a metre of a face at 7 m) */
    const LEVELS = [['h', 2.2], ['', 7.0], ['m', 14], ['f', Infinity]];         // each skin's suffix and how far it is drawn to
    const _pv = new THREE.Vector3(), _pq = new THREE.Quaternion(), _lens = new THREE.Vector3();
    /* the soft dark under a body (a phone draws no shadows, so a contact shadow is painted: v9.3) */
    const blobTex = (() => { const [c, x] = cnv(64); const g = x.createRadialGradient(32, 32, 2, 32, 32, 31);
      x.clearRect(0, 0, 64, 64);
      g.addColorStop(0, 'rgba(0,0,0,0.62)'); g.addColorStop(0.55, 'rgba(0,0,0,0.3)'); g.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = g; x.fillRect(0, 0, 64, 64); return tex(done(THREE, c, false)); })();
    const blobGeo = new THREE.PlaneGeometry(1, 1); blobGeo.rotateX(-Math.PI / 2);        // (dispose() finds it through the world, as it finds every geometry)
    const blobMat = B({ map: blobTex, transparent: true, depthWrite: false, opacity: 0.8, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });
    const blob = (parent, w = 0.85, d = 0.7) => { const m = new THREE.Mesh(blobGeo, blobMat); m.position.y = 0.014; m.scale.set(w, 1, d); m.renderOrder = 2; parent.add(m); return m; };

    /* A WALK THAT IS NOT A LOOP, MADE ONE (o.loops: { take: [from, to, blend] }). A written take (text-to-motion) starts
       from standing and stops in mid-stride: played round, it jumps at its end. So one whole cycle of it is cut out, from
       a heel's strike to the same heel's next (tools/probes/gait.mjs reads the strikes), where the pace has settled; the
       hips' travel over that cycle is taken out evenly (the group travels: WALKS, below), and over the last `blend`
       seconds every joint is eased onto what it was doing one cycle earlier, so the end IS the start. v5.20: what is
       missing is made from what the file has. */
    const _lqa = new THREE.Quaternion(), _lqb = new THREE.Quaternion();
    function loopOf(clip, t0, t1, blend) {
      const L = t1 - t0, N = Math.max(8, Math.round(L * 30)), times = new Float32Array(N + 1); let travel = null;
      for (let i = 0; i <= N; i++) times[i] = L * i / N;
      const tracks = clip.tracks.map(tr => { const n = tr.getValueSize(), it = tr.createInterpolant(new Float32Array(n)), isQ = /\.quaternion$/.test(tr.name), hip = /Hips\.position$/.test(tr.name);
        const at = (t) => Array.from(it.evaluate(Math.max(0, Math.min(clip.duration, t))));
        const a0 = hip ? at(t0) : null, a1 = hip ? at(t1) : null;
        if (hip) travel = [a1[0] - a0[0], a1[2] - a0[2]];
        const val = (t) => { const v = at(t); if (hip) { const k = (t - t0) / L; v[0] -= (a1[0] - a0[0]) * k; v[2] -= (a1[2] - a0[2]) * k; } return v; };
        const out = new Float32Array((N + 1) * n);
        for (let i = 0; i <= N; i++) { const a = val(t0 + times[i]), w = blend > 0 ? smo(c01((times[i] - (L - blend)) / blend)) : 0;
          if (w > 0) { const b = val(t0 + times[i] - L);
            if (isQ) { _lqa.fromArray(a).slerp(_lqb.fromArray(b), w).toArray(a); } else for (let k = 0; k < n; k++) a[k] += (b[k] - a[k]) * w; }
          out.set(a, i * n); }
        return new tr.constructor(tr.name, times, out); });
      const made = new THREE.AnimationClip(clip.name, L, tracks); made.travel = travel;
      return made;
    }
    /* THE CROSS-LEGGED SEAT (v26.18: Chad, 16 Nov 2026, the morning's meeting moved inside the main hall: "Grandmaster pho
       is seated inside the main hall, waiting for the player", its inside "exactly the same as the photos"; in his
       photographs 2 to 4 of it the master sits cross-legged on the dais, in white, his lower cloth smooth over both
       knees, his right hand over the front of his lap, his left in it). o.cross seats a body so, from what its own
       file has (v5.20), and it is asked for by one person only, the hall's Grandmaster Pho: the bench's is a person of
       his own and is exactly as he was. Every step was photographed in the pose lab before the next was built, and
       three first tries were refused by photograph (the tracker's log, docs/V26.18-E4C3-HALL.md):
       1. THE TAKES ARE MIXED (crossTakes). His own floor take cannot be drawn close: its robe below the waist is a
          slab with a torn notch (one tube of cloth cannot wrap two crossed legs: v24.47), and it leans back 23
          degrees. So his hips, his legs and the bones of his robe below the waist are HELD at one moment of it
          (K.low at K.at), and everything above comes from a bench take, as it moves. His spine is given the turn that
          keeps his trunk as the bench take has it IN THE WORLD (the two takes hold his hips 27 degrees apart), and
          then his trunk is stood upright and square: over the stretch named (t0 to t1) its own frame is read (his
          left, his spine's line, his front) and turned onto a trunk leaning `lean` degrees forward (measured: his
          bench rest leans 16.5 degrees forward, 5.5 to his left and is turned 8; his bench talk leans back 6).
       2. HIS ROBE IS ENDED IN A LEVEL HEM, K.hem over the cushion (crossHem): his robe below the waist is a skin of its
          own and is not drawn; of his main skin, his legs are not drawn, nor any triangle wholly under the hem (his
          arms aside); a low point of a triangle that crosses the hem is brought up onto it, where the pose has it,
          and set back through its own skinning (a point his robe's waist bone carried is given to his spine: the hem
          is of one piece with his trunk, and NO point of him is his hip bone's). An ARM is what an arm's bones carry
          AND stands within a hand's breadth of the arm's own line: the cloth that hangs from his left arm is carried
          by it too, and is cloth. Hidden by "any point the robe carries", icicles 8 cm long hung from him.
       3. THE CLOTH OVER HIS LEGS IS MADE (masters/v26.18/pho/lapcloth.py, in Blender, on his skin as the game poses
          it; K.lap its key): laid taut on a ring under the hem and on his legs, then let settle. Its top leans with
          his trunk: it is bound here to his spine and his hips, each point's share of his spine read off its height
          under the ring and its way out from his waist's middle (so nothing rides on an attribute a pack might
          drop). It takes his robe's own look (o.look, after this), so the two are one white.
       4. HIS HANDS REST ON THE CLOTH (crossHands), by numbers read off photograph 3: where each palm's middle lies,
          the way its fingers run, how far down the cloth's fall they may follow it, where its elbow stands.
       His hip joint rides K.hips over the cushion's top (the lowest of his legs 6 mm over it), and the person's
       group stands ON the cushion's top: put() him there with its height. */
    const CROSS_LOW = /^(mixamorig:?)?(Hips|(Left|Right)(UpLeg|Leg|Foot|Toe\w*)|(Left|Right)LegGraft\w*|Skirt\w*|Cloth\w*)\./;
    const _cxA = new THREE.Vector3(), _cxB = new THREE.Vector3();
    function crossTakes(P, animations, K) {
      const Lw = animations.find(c => c.name === K.low); if (!Lw) { console.warn(P.key + ': no take ' + K.low + ' to sit cross-legged in'); return; }
      const bone = (nm) => { const re = new RegExp('^(mixamorig:?)?' + nm + '$'); for (const n in P.bone) if (re.test(n)) return P.bone[n]; return null; };
      const held = [], hipQ = new THREE.Quaternion();
      for (const t of Lw.tracks) { if (!CROSS_LOW.test(t.name)) continue; const v = Array.from(t.createInterpolant(new Float32Array(t.getValueSize())).evaluate(K.at)); held.push([t, v]); if (/Hips\.quaternion$/.test(t.name)) hipQ.fromArray(v); }
      const nk = bone('Neck'), sp = bone('Spine'), la = bone('LeftArm'), ra = bone('RightArm');
      P.group.updateWorldMatrix(true, false);
      for (const name in K.takes) { const U = animations.find(c => c.name === name), A0 = P.acts[name], F = K.takes[name];
        if (!U || !A0) { console.warn(P.key + ': no take ' + name + ' to sit cross-legged with'); continue; }
        const fix = new THREE.Quaternion();
        if (nk && sp && la && ra && P.hips && P.hips.parent) { const u = new THREE.Vector3(), s = new THREE.Vector3(), N = 9, t0 = F.t0 || 0, t1 = F.t1 != null ? F.t1 : U.duration;
          for (const k in P.acts) P.acts[k].setEffectiveWeight(k === name ? 1 : 0);
          for (let i = 0; i < N; i++) { A0.time = t0 + (t1 - t0) * i / (N - 1); P.mixer.update(0); P.group.updateWorldMatrix(false, true);
            nk.getWorldPosition(_cxA); P.group.worldToLocal(_cxA); sp.getWorldPosition(_cxB); P.group.worldToLocal(_cxB); u.add(_cxA.sub(_cxB).normalize());
            la.getWorldPosition(_cxA); P.group.worldToLocal(_cxA); ra.getWorldPosition(_cxB); P.group.worldToLocal(_cxB); s.add(_cxA.sub(_cxB).normalize()); }
          A0.setEffectiveWeight(0);
          u.normalize(); s.addScaledVector(u, -s.dot(u)).normalize(); const f = new THREE.Vector3().crossVectors(s, u).normalize(), Ln = (F.lean || 0) * Math.PI / 180;
          const M0 = new THREE.Matrix4().makeBasis(s, u, f), M1 = new THREE.Matrix4().makeBasis(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, Math.cos(Ln), Math.sin(Ln)), new THREE.Vector3(0, -Math.sin(Ln), Math.cos(Ln)));
          const Rg = new THREE.Quaternion().setFromRotationMatrix(M1.multiply(M0.transpose())), aw = new THREE.Quaternion(), gw = new THREE.Quaternion();
          P.hips.parent.getWorldQuaternion(aw); P.group.getWorldQuaternion(gw); const c = aw.invert().multiply(gw); fix.copy(c).multiply(Rg).multiply(c.clone().invert()); }
        const tracks = U.tracks.filter(t => !CROSS_LOW.test(t.name)).map(t => t.clone());
        for (const [t, v] of held) tracks.push(new t.constructor(t.name, [0, U.duration], v.concat(v)));
        const hT = U.tracks.find(t => /Hips\.quaternion$/.test(t.name)), sT = tracks.find(t => /Spine\.quaternion$/.test(t.name));
        if (hT && sT) { const it = hT.createInterpolant(new Float32Array(4)), inv = hipQ.clone().invert(), a = new THREE.Quaternion(), b = new THREE.Quaternion(), vals = sT.values;
          /* (F.sway: on a bench his hips rock as he talks and all of him goes with them; cross-legged his seat is planted, and
             the whole of that rocking, given to his spine, swayed his trunk 15 degrees each way: so his hips' turn is taken
             only `sway` of the way from its middle over the take) */
          const mid = new THREE.Quaternion(), sway = F.sway != null ? F.sway : 1;
          if (sway < 1) { const acc = [0, 0, 0, 0], M = 24; for (let i = 0; i < M; i++) { a.fromArray(it.evaluate(U.duration * i / (M - 1))); if (i && a.x * acc[0] + a.y * acc[1] + a.z * acc[2] + a.w * acc[3] < 0) a.set(-a.x, -a.y, -a.z, -a.w); acc[0] += a.x; acc[1] += a.y; acc[2] += a.z; acc[3] += a.w; } mid.fromArray(acc).normalize(); }
          for (let i = 0; i < sT.times.length; i++) { a.fromArray(it.evaluate(sT.times[i])); if (sway < 1) a.copy(b.copy(mid).slerp(a, sway)); b.fromArray(vals, i * 4); a.multiply(b).premultiply(fix).premultiply(inv).normalize();
            if (i && (a.x * vals[i * 4 - 4] + a.y * vals[i * 4 - 3] + a.z * vals[i * 4 - 2] + a.w * vals[i * 4 - 1]) < 0) a.set(-a.x, -a.y, -a.z, -a.w);
            a.toArray(vals, i * 4); } }
        A0.stop(); P.mixer.uncacheAction(A0.getClip());
        const clip = new THREE.AnimationClip(name, U.duration, tracks), A = P.mixer.clipAction(clip); A.enabled = true; A.setEffectiveWeight(0); A.play(); P.acts[name] = A; P.w[name] = 0; }
    }
    /* (his hands on the cloth: `top` is the cloth's height under a point of his own frame) */
    function crossHands(P, spec, top) {
      const A = armsOf(P), R = {}, rep = {}; P.restHands = null; if (!A) return null;
      const loc = (b, out) => { b.getWorldPosition(out); return P.group.worldToLocal(out); };
      for (const [sd, sg] of [['L', 1], ['R', -1]]) { const a = A[sd], sp = spec[sd]; if (!sp) continue;
        hingeOf(a, sg);
        const d = new THREE.Vector3(Math.sin(sp.yaw), 0, Math.cos(sp.yaw)), e = 0.03, x = sp.x, z = sp.z, y = top(x, z);
        if (!(y > -1)) { console.warn(P.key + ': no cloth under his ' + sd + ' hand at ' + x + ', ' + z); continue; }
        const sl = Math.max(-(sp.slope != null ? sp.slope : 0.4), Math.min(0.2, (top(x + d.x * e, z + d.z * e) - top(x - d.x * e, z - d.z * e)) / (2 * e)));
        const gx = (top(x + 0.03, z) - top(x - 0.03, z)) / 0.06, gz = (top(x, z + 0.03) - top(x, z - 0.03)) / 0.06;
        if (!isFinite(sl) || !isFinite(gx) || !isFinite(gz)) { console.warn(P.key + ': the cloth ends under his ' + sd + ' hand'); continue; }
        const f = new THREE.Vector3(d.x, sl, d.z).normalize(), n = new THREE.Vector3(gx, -1, gz).normalize(); n.addScaledVector(f, -n.dot(f)).normalize();
        const HM = a.fingers ? null : handAxes(P, A, sd), PALM = sp.palm != null ? sp.palm : (HM ? HM.len * 0.45 : a.palm), OFF = sp.off != null ? sp.off : (HM ? Math.max(0.015, HM.depth) : 0.022);
        const Cp = new THREE.Vector3(x, y + (sp.lift || 0), z), W = Cp.clone().addScaledVector(f, -PALM).addScaledVector(n, -OFF);
        const Sh = loc(a.up, new THREE.Vector3()), lu = loc(a.fore, new THREE.Vector3()).distanceTo(Sh), lf = loc(a.hand, new THREE.Vector3()).distanceTo(loc(a.fore, new THREE.Vector3()));
        R[sd] = { W, pdir: new THREE.Vector3().fromArray(sp.pole).normalize(), f, n, fing: [] };
        if (sp.follow) { const fl = sp.follow.map(nm => P.bone[nm]).filter(b => b && b.parent === a.up.parent).map(b => ({ b, q: new THREE.Quaternion(), on: false })); if (fl.length) R[sd].fol = fl; }
        if (HM) { R[sd].fL = HM.fL; R[sd].nL = HM.nL; R[sd].aL = HM.aL; }
        rep[sd] = { palm: [x, +y.toFixed(3), z], wrist: W.toArray().map(q => +q.toFixed(3)), reach: +(W.distanceTo(Sh) / (lu + lf)).toFixed(3), slope: +sl.toFixed(2) }; }
      P.restHands = { how: 'lap', R, hold: spec.hold || null }; return rep;
    }
    /* (his robe's hem, cut in the pose he stands in now) */
    function crossHem(P, q, HEM) {
      const g = q.geometry, pos = g.attributes.position, si = g.attributes.skinIndex, sw = g.attributes.skinWeight, idx = g.index, n = pos.count, v = new THREE.Vector3(), bones = q.skeleton.bones;
      if (!pos || !si || !sw || !idx) return null;
      const sideB = bones.map(b => /^(mixamorig:?)?Left(Arm|ForeArm|Hand)/.test(b.name) ? 1 : (/^(mixamorig:?)?Right(Arm|ForeArm|Hand)/.test(b.name) ? 2 : 0));
      const legB = bones.map(b => /(UpLeg|Leg|Foot|Toe)/.test(b.name)), robeB = bones.map(b => /^(Skirt|Cloth)/.test(b.name)), spineI = bones.findIndex(b => /^(mixamorig:?)?Spine$/.test(b.name));
      P.group.updateWorldMatrix(true, true); P.group.updateMatrixWorld(true);
      const SM = skinMats(q), toG = new THREE.Matrix4().copy(P.group.matrixWorld).invert().multiply(q.matrixWorld), A = armsOf(P), w3 = new THREE.Vector3(), w4 = new THREE.Vector3(), w5 = new THREE.Vector3();
      const line = (sd) => { const a = A && A[sd]; if (!a) return null; const pts = [a.up, a.fore, a.hand].map(b => P.group.worldToLocal(b.getWorldPosition(new THREE.Vector3()))), tip = a.hand.children.find(c => c.isBone);
        if (tip) pts.push(P.group.worldToLocal(tip.getWorldPosition(new THREE.Vector3()))); return pts; };
      const LN = [null, line('L'), line('R')], RAD = [0.085, 0.085, 0.1];
      const near = (p, pts) => { if (!pts) return true; for (let k = 0; k < pts.length - 1; k++) { const a = pts[k], ab = w3.copy(pts[k + 1]).sub(a), t = c01(ab.dot(w4.copy(p).sub(a)) / ab.lengthSq()); if (w5.copy(a).addScaledVector(ab, t).distanceTo(p) < RAD[k]) return true; } return false; };
      const V = new Float32Array(n * 3), Y = new Float32Array(n), arm = new Uint8Array(n), leg = new Uint8Array(n), robe = new Uint8Array(n), below = new Uint8Array(n);
      for (let i = 0; i < n; i++) { skinVertex(q, i, v, SM); V[i * 3] = v.x; V[i * 3 + 1] = v.y; V[i * 3 + 2] = v.z; v.applyMatrix4(toG); Y[i] = v.y; const aw = [0, 0, 0]; let lw = 0, rw = 0;
        for (let c = 0; c < 4; c++) { const j = si.getComponent(i, c), w = sw.getComponent(i, c); if (sideB[j]) aw[sideB[j]] += w; else if (legB[j]) lw += w; else if (robeB[j]) rw += w; }
        const sd = aw[1] >= aw[2] ? 1 : 2; arm[i] = aw[sd] > 0.5 && near(v, LN[sd]) ? 1 : 0; leg[i] = lw > 0.5 ? 1 : 0; robe[i] = rw > 0.5 ? 1 : 0; below[i] = !arm[i] && (leg[i] || robe[i] || Y[i] < HEM) ? 1 : 0; }
      const a = idx.array, out = new a.constructor(a.length), acc = new Float64Array(n * 5); let m = 0, cut = 0;
      for (let i = 0; i < a.length; i += 3) { const T = [a[i], a[i + 1], a[i + 2]], nb = below[T[0]] + below[T[1]] + below[T[2]];
        if (nb === 3 || (leg[T[0]] && leg[T[1]] && leg[T[2]])) continue;
        out[m++] = T[0]; out[m++] = T[1]; out[m++] = T[2]; if (!nb) continue; cut++;
        for (const p of T) if (below[p]) for (const u of T) if (!below[u] && Y[u] >= HEM) { acc[p * 5] += V[u * 3]; acc[p * 5 + 1] += V[u * 3 + 1]; acc[p * 5 + 2] += V[u * 3 + 2]; acc[p * 5 + 3] += Y[u]; acc[p * 5 + 4] += 1; } }
      /* (a triangle with a low point that nothing it keeps can bring up is not drawn either: the cloth that ran from his sleeve to his robe below the waist) */
      let m2 = 0, dropped = 0; for (let i = 0; i < m; i += 3) { const T0 = out[i], T1 = out[i + 1], T2 = out[i + 2];
        if ((below[T0] && !acc[T0 * 5 + 4]) || (below[T1] && !acc[T1 * 5 + 4]) || (below[T2] && !acc[T2 * 5 + 4])) { dropped++; continue; } out[m2++] = T0; out[m2++] = T1; out[m2++] = T2; }
      const copyOf = (at) => { const c2 = new THREE.BufferAttribute(new at.array.constructor(n * at.itemSize), at.itemSize, at.normalized); for (let i = 0; i < n; i++) for (let k = 0; k < at.itemSize; k++) c2.setComponent(i, k, at.getComponent(i, k)); return c2; };
      const p2 = copyOf(pos), si2 = copyOf(si), sw2 = copyOf(sw), Mq = new THREE.Matrix4(), Mb = new THREE.Matrix4(), e = new Float64Array(16); let moved = 0, given = 0;
      for (let p = 0; p < n; p++) { const c = acc[p * 5 + 4]; if (!c) continue; const my = acc[p * 5 + 3] / c, k = c01((HEM - Y[p]) / Math.max(1e-6, my - Y[p]));
        v.set(V[p * 3] + (acc[p * 5] / c - V[p * 3]) * k, V[p * 3 + 1] + (acc[p * 5 + 1] / c - V[p * 3 + 1]) * k, V[p * 3 + 2] + (acc[p * 5 + 2] / c - V[p * 3 + 2]) * k);
        e.fill(0);
        if (robe[p] && spineI >= 0) { const E0 = SM[spineI].elements; for (let x = 0; x < 16; x++) e[x] = E0[x]; si2.setXYZW(p, spineI, 0, 0, 0); sw2.setXYZW(p, 1, 0, 0, 0); given++; }
        else for (let c2 = 0; c2 < 4; c2++) { const w = sw.getComponent(p, c2); if (!w) continue; const E0 = SM[si.getComponent(p, c2)].elements; for (let x = 0; x < 16; x++) e[x] += E0[x] * w; }
        Mb.fromArray(e); Mq.copy(q.bindMatrixInverse).multiply(Mb).multiply(q.bindMatrix).invert(); v.applyMatrix4(Mq); p2.setXYZ(p, v.x, v.y, v.z); moved++; }
      const g2 = new THREE.BufferGeometry(); for (const k in g.attributes) g2.setAttribute(k, k === 'position' ? p2 : (k === 'skinIndex' ? si2 : (k === 'skinWeight' ? sw2 : g.attributes[k])));
      g2.setIndex(new THREE.BufferAttribute(out.slice(0, m2), 1)); g2.boundingSphere = g.boundingSphere; g2.boundingBox = g.boundingBox; q.geometry = g2;
      return { drawn: m2 / 3, of: a.length / 3, crossing: cut, moved, given, dropped };
    }
    function crossDress(P, K, lap) {
      const skins = P.lv[1], bone = (nm) => { const re = new RegExp('^(mixamorig:?)?' + nm + '$'); for (const n in P.bone) if (re.test(n)) return P.bone[n]; return null; };
      const spine = bone('Spine'), rest = K.ref[0]; if (!skins || !spine || !P.hips || !P.acts[rest]) { console.warn(P.key + ': cannot be seated cross-legged (no skin, spine, hips or rest)'); return; }
      const rep = P.crossRep = {};
      /* (his rest, as he will sit in it) */
      for (const k in P.acts) { P.w[k] = k === rest ? 1 : 0; P.acts[k].setEffectiveWeight(P.w[k]); }
      P.acts[rest].time = K.ref[1]; personSettle(P); P.mixer.update(0); P.group.updateWorldMatrix(true, true); P.group.updateMatrixWorld(true);
      const robe = skins.find(q => /\(both sides\)$/.test([].concat(q.material)[0].name)), main = skins.find(q => !/\)$/.test([].concat(q.material)[0].name));
      if (robe) { if (robe.parent) robe.parent.remove(robe); skins.splice(skins.indexOf(robe), 1); }
      /* (the cloth: its points in his own frame, in metres, whatever the pack did to the file's numbers) */
      let top = () => -Infinity;
      /* (HIS BEADS: Chad, 16 Nov 2026, of this seat: "The beads get cut off". His two black strands close in a V on his
         robe below the waist, which is not drawn here: so the cloth's file carries them on again from the hem, his own
         beads laid over the cloth in a hanging loop (masters/v26.18/pho/beadtail.py: a mesh named 'beads', its points
         in his own frame, its coordinates his body sheet's). It is drawn with his body's own material and bound as the
         cloth is; a hand rests on the cloth, so the beads are not part of `top`.) */
      if (lap) { let src = null, beads = null; lap.scene.updateMatrixWorld(true);
        lap.scene.traverse(q => { if (!q.isMesh) return; if (/beads/i.test(q.name) || (q.parent && /beads/i.test(q.parent.name))) beads = beads || q; else src = src || q; });
        const C = 0.015, cells = new Map(), gI = new THREE.Matrix4().copy(P.group.matrixWorld).invert(), inv = [spine, P.hips].map(b => new THREE.Matrix4().multiplyMatrices(gI, b.matrixWorld).invert());
        for (const [from, material, name] of [[src, src && src.material, 'lap'], [beads, main && [].concat(main.material)[0], 'beads']]) { if (!from || !material || (name === 'beads' && !P.lap)) continue;
          const g0 = from.geometry, p0 = g0.attributes.position, n0 = g0.attributes.normal, n = p0.count, pos = new Float32Array(n * 3), nor = new Float32Array(n * 3), si = new Uint8Array(n * 4), sw = new Float32Array(n * 4);
          const v = new THREE.Vector3(), nm = new THREE.Matrix3().getNormalMatrix(from.matrixWorld);
          for (let i = 0; i < n; i++) { v.fromBufferAttribute(p0, i).applyMatrix4(from.matrixWorld); pos[i * 3] = v.x; pos[i * 3 + 1] = v.y; pos[i * 3 + 2] = v.z;
            if (name === 'lap') { const ck = Math.round(v.x / C) * 4096 + Math.round(v.z / C), cy = cells.get(ck); if (cy === undefined || v.y > cy) cells.set(ck, v.y); }
            const w = smo(c01((v.y - (K.ringY - K.reach)) / K.reach)) * (1 - smo(c01((Math.hypot(v.x - K.middle[0], v.z - K.middle[1]) - 0.2) / 0.1)));
            si[i * 4 + 1] = 1; sw[i * 4] = w; sw[i * 4 + 1] = 1 - w;
            if (n0) { v.fromBufferAttribute(n0, i).applyMatrix3(nm).normalize(); nor[i * 3] = v.x; nor[i * 3 + 1] = v.y; nor[i * 3 + 2] = v.z; } }
          const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); if (n0) g.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
          if (g0.attributes.uv) g.setAttribute('uv', g0.attributes.uv); g.setIndex(g0.index); g.setAttribute('skinIndex', new THREE.BufferAttribute(si, 4)); g.setAttribute('skinWeight', new THREE.BufferAttribute(sw, 4));
          if (!n0) g.computeVertexNormals();
          const mesh = new THREE.SkinnedMesh(g, material); mesh.castShadow = false; mesh.receiveShadow = false; mesh.frustumCulled = false; mesh.name = name;
          P.model.add(mesh); mesh.bind(new THREE.Skeleton([spine, P.hips], inv.map(m4 => m4.clone())), new THREE.Matrix4()); skins.push(mesh); P[name] = mesh;
          rep[name] = { points: n, triangles: g0.index ? g0.index.count / 3 : n / 3 }; }
        if (P.lap) top = (x, z) => { const a = Math.round(x / C), b = Math.round(z / C); let best = -Infinity; for (let dx = -1; dx <= 1; dx++) for (let dz = -1; dz <= 1; dz++) { const y = cells.get((a + dx) * 4096 + (b + dz)); if (y !== undefined && y > best) best = y; } return best; }; }
      else console.warn(P.key + ': the cloth over his legs has not landed: he is drawn without it');
      P.crossTop = top;
      if (K.hands && P.lap) { rep.hands = crossHands(P, K.hands, top); if (P.restHands) restHandsLay(P); P.group.updateWorldMatrix(true, true); }
      if (main && K.hem != null) rep.hem = crossHem(P, main, K.hem);
      armsBack(P); P.cross = K;
    }
    function mkPerson(key, x, z, ry, o = {}) {
      const P = { key, o, group: new THREE.Group(), ready: false, acts: {}, w: {}, off: {}, offY: {}, cur: o.take || 'Idle_3', fade: 0.4, win: o.win || null,
                  mixer: null, model: null, head: null, hips: null, bone: {}, lv: [null, null, null, null], lvNow: -1, force: null, members: [],
                  hidden: !!o.hidden, driver: !!o.driver, filmT: null, rate: o.rate || 1, phase: o.phase || 0, clock: (o.phase || 0) * 10, then: [],
                  span: null, gaze: null, gazeK: 0, rest: { take: o.take || 'Idle_3', win: o.win ? Object.assign({}, o.win) : null }, talkTake: o.talk || null, actN: 0 };
      P.group.position.set(x, o.y || 0, z); P.group.rotation.y = ry; P.group.visible = false; (o.parent || world).add(P.group);
      people.push(P);
      if (!have(key)) { waiting.add(key); return P; }
      if (o.cross && o.cross.lap && !have(o.cross.lap)) waiting.add(o.cross.lap);
      (o.cross && o.cross.lap && have(o.cross.lap) ? Promise.all([parseOnce(key), parseOnce(o.cross.lap)]).then(([body, lap]) => { P.lapSrc = lap; return body; }) : parseOnce(key)).then(({ scene: src, animations }) => {
        if (!alive) return;
        const m = cloneSkinned(src), skins = [];
        m.traverse(q => {
          if (q.isSkinnedMesh) { q.castShadow = false; q.receiveShadow = false; q.frustumCulled = false; skins.push(q); }
          if (q.isBone) { P.bone[q.name] = q; lazyRot(q); if (/^(mixamorig:?)?Head$/.test(q.name)) P.head = q; if (/^(mixamorig:?)?Hips$/.test(q.name)) P.hips = q; }
        });
        if (o.s) m.scale.multiplyScalar(o.s);
        for (const q of skins) for (const mm of [].concat(q.material)) if (mm && mm.map) sheetOf(key, mm.map);
        P.group.add(m); P.model = m; P.lv[1] = skins;
        P.mixer = new THREE.AnimationMixer(m);
        for (const clip0 of animations) {
          let clip = clip0;
          if (o.loops && o.loops[clip0.name]) clip = loopOf(clip0, o.loops[clip0.name][0], o.loops[clip0.name][1], o.loops[clip0.name][2]);
          /* a walk is walked ON THE SPOT here: the group is what travels (so a path is a path), and the take's own
             travel over the ground is taken out of its hips (their sway and their rise kept) */
          if (WALKS.test(clip.name)) { if (clip === clip0) clip = clip0.clone(); const tr0 = clip.tracks.find(t => /Hips\.position$/.test(t.name));
            if (tr0) { const v = tr0.values, n = v.length / 3, x0 = v[0], z0 = v[2], x1 = v[(n - 1) * 3], z1 = v[(n - 1) * 3 + 2];
              for (let i = 0; i < n; i++) { const k = n > 1 ? i / (n - 1) : 0; v[i * 3] -= (x1 - x0) * k; v[i * 3 + 2] -= (z1 - z0) * k; }
              /* (what was taken out, over the take's length, in the hips' own frame: a loop cut from a longer take has
                 handed on its share. A take that really travels is paced by this, exactly: `pace`, below) */
              (P.travel = P.travel || {})[clip.name] = [(clip.travel ? clip.travel[0] : 0) + (x1 - x0), (clip.travel ? clip.travel[1] : 0) + (z1 - z0)]; } }
          const a = P.mixer.clipAction(clip); a.enabled = true; a.setEffectiveWeight(0); a.play(); P.acts[clip.name] = a; P.w[clip.name] = 0;
        }
        /* A TAKE MADE FROM TWO (o.mix: [[name, upper, lower, at]]): the upper body of one take on the legs of another, held
           at one of its moments. Two of the written takes are right above the waist and wrong below it (the arms rising
           wide of photograph 12 kneel with the shins in the air: the tracker's §5), and a body's own grounded kneel is
           already in its file (v5.20: what is missing is made from what the file has). Hips and legs from `lower` at
           `at` seconds, held; everything above from `upper`, as it moves */
        if (o.mix) for (const [name, up, low, at] of o.mix) { const U = animations.find(c => c.name === up), L = animations.find(c => c.name === low);
          if (!U || !L) { console.warn(key + ': no take to mix ' + name + ' from (' + up + ', ' + low + ')'); continue; }
          const LOWER = /^(Hips|(Left|Right)(UpLeg|Leg|Foot|Toe\w*))\./, tracks = U.tracks.filter(t => !LOWER.test(t.name)).map(t => t.clone());
          for (const t of L.tracks) { if (!LOWER.test(t.name)) continue; const n = t.getValueSize(), T = t.times; let i = 0; while (i < T.length - 1 && T[i + 1] <= (at || 0)) i++;
            const v = Array.from(t.values.slice(i * n, i * n + n)); tracks.push(new t.constructor(t.name, [0, U.duration], v.concat(v))); }
          const clip = new THREE.AnimationClip(name, U.duration, tracks), a = P.mixer.clipAction(clip); a.enabled = true; a.setEffectiveWeight(0); a.play(); P.acts[name] = a; P.w[name] = 0; }
        if (o.cross) crossTakes(P, animations, o.cross);
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
        /* SEATED BY HIS OWN BODY (Chad, 12 Nov 2026, of the monks: "their body is clipping through the seats"; v16.8: a
           sitter is seated on his posed skin). A hip joint held a fixed way over a seat seats nobody: where a rig's hip
           joints ride in its body is the rig's own (Chad's monk's sit 17 cm over his knees in every seated take he
           has, Grandmaster Pho's 6: tools/probes/sitread.mjs), and so is how long its legs are. The three monks sat
           with their hips at the middle of a chair 0.93 m deep, their shins coming down through its seat and their
           soles a hand's length under the ground. Two ways, each read from the take posed at its window's start:
           o.seat.legs ({ edge, r, apron, sole }): a man on a CHAIR. He is set down by his SOLES (the lowest of what
             rides his feet stands `sole` from the ground: a seated man's feet reach the floor, whatever the seat),
             and brought forward until his SHINS (knee joint to ankle joint, read at the seat's top and at the foot of
             its apron) stand a calf's half-thickness `r` past the seat's front face, `edge` ahead of his spot. What
             is drawn of a robe below his thighs lies in the seat, as cloth does.
           o.seat.floor ({ sink }): a man sitting CROSS-LEGGED on a seat's top, in a take made for the floor: the
             lowest of all his skin (its second hundredth: the crossed ankles go under, as episode 3's cushion has
             them) is set `sink` into the seat's top.
           (updateMatrixWorld, not updateWorldMatrix: only the former is a skinned mesh's own, and it is there that
           the matrix a posed point is brought back through is made again. Without it every point came back in the
           world's frame and was moved by the group once more: a first build of this seated the monks metres from their
           chairs, caught by the boot check's printed numbers) */
        if (P.hips && o.seat && (o.seat.legs || o.seat.floor || o.seat.down) && skins[0] && skins[0].skeleton) for (const name in P.acts) { if (o.seat.takes && !o.seat.takes.test(name)) continue;
          for (const k in P.acts) P.acts[k].setEffectiveWeight(k === name ? 1 : 0);
          P.acts[name].time = P.win && P.win[name] ? P.win[name][0] : 0; P.mixer.update(0); P.model.position.set(0, 0, 0); P.group.updateWorldMatrix(true, false); P.group.updateMatrixWorld(true);
          const ys = [], feet = [];
          for (const q of skins) { const pos = q.geometry.attributes.position, si = q.geometry.attributes.skinIndex, sw = q.geometry.attributes.skinWeight; if (!pos || !si || !sw || !q.skeleton) continue;
            const foot = q.skeleton.bones.map(b => /^(mixamorig:?)?(Left|Right)(Foot|Toe\w*)$/.test(b.name));
            const SM = FASTSKIN ? skinMats(q) : null;
            for (let i = 0; i < pos.count; i++) { if (SM) skinVertex(q, i, _pv, SM); else q.getVertexPosition(i, _pv); _pv.applyMatrix4(q.matrixWorld); P.group.worldToLocal(_pv); ys.push(_pv.y);
              let fw = 0; for (let c = 0; c < 4; c++) if (foot[si.getComponent(i, c)]) fw += sw.getComponent(i, c); if (fw >= 0.5) feet.push(_pv.y); } }
          if (ys.length < 30) { console.warn(key + ': too little skin to seat him by'); continue; }
          /* (his spot in the model's own frame: what `centre` or `ref` set for this take) */
          const oz = P.off[name] ? P.off[name][1] : 0, rec = {}; let lift = 0, fwd = 0;
          if (o.seat.floor) { ys.sort((u, v2) => u - v2); const low = ys[Math.floor(ys.length * 0.02)]; lift = (o.seat.y - (o.seat.floor.sink != null ? o.seat.floor.sink : 0.01)) - low; rec.low = +low.toFixed(3); }
          else if (o.seat.down) { const keepLegs = P.restLegs, r = seatDown(P, name, o.seat, skins); if (!r) { P.restLegs = keepLegs; continue; }
            P.restLegs = keepLegs && name !== (o.take || 'Idle_3') ? keepLegs : r.legs; P.offY[name] = -r.lift; P.off[name] = [P.off[name] ? P.off[name][0] : 0, oz - r.fwd];
            (P.seated = P.seated || {})[name] = r.rep; continue; }
          else { const K = o.seat.legs, bone = (nm) => { const re = new RegExp('^(mixamorig:?)?' + nm + '$'); for (const n in P.bone) if (re.test(n)) return P.bone[n]; return null; };
            if (!feet.length) { console.warn(key + ': nothing rides his feet to set him down by'); continue; }
            let sole = Infinity; for (const y of feet) if (y < sole) sole = y;
            lift = (K.sole != null ? K.sole : -0.005) - sole;
            let back = Infinity, thigh = Infinity;
            for (const sd of ['Left', 'Right']) { const kn = bone(sd + 'Leg'), an = bone(sd + 'Foot'); if (!kn || !an) continue;
              kn.getWorldPosition(_pv); P.group.worldToLocal(_pv); const ky = _pv.y + lift, kz = _pv.z - oz;
              an.getWorldPosition(_pv); P.group.worldToLocal(_pv); const ay = _pv.y + lift, az = _pv.z - oz;
              P.hips.getWorldPosition(_pv); P.group.worldToLocal(_pv); thigh = Math.min(thigh, (ky + _pv.y + lift) / 2 - o.seat.y);
              for (const h of [o.seat.y, o.seat.y - (K.apron != null ? K.apron : 0.14)]) { const t = ky > ay ? Math.max(0, Math.min(1, (ky - h) / (ky - ay))) : 0; back = Math.min(back, kz + t * (az - kz)); } }
            if (!(back < Infinity)) { console.warn(key + ': no knees and ankles to seat him by'); continue; }
            fwd = Math.max(0, K.edge + (K.r != null ? K.r : 0.055) - back);
            rec.sole = +sole.toFixed(3); rec.back = +back.toFixed(3); rec.thigh = +thigh.toFixed(3);
            /* (a thigh's own half-thickness is some 8 cm: an axis nearer the seat than 4 is a body in the wood) */
            if (thigh < 0.04) console.warn(key + ': set down by his soles, his thighs lie in the seat (their axis ' + (thigh * 100).toFixed(0) + ' cm over it): this seat is too high for this take'); }
          if (!(Math.abs(lift) < 0.8) || fwd > 0.45) { console.warn(key + ': the seat read from his body is not a seat (up ' + lift.toFixed(2) + ' m, forward ' + fwd.toFixed(2) + ' m): left on his hips'); continue; }
          P.offY[name] = -lift; P.off[name] = [P.off[name] ? P.off[name][0] : 0, oz - fwd];
          rec.lift = +lift.toFixed(3); rec.fwd = +fwd.toFixed(3); (P.seated = P.seated || {})[name] = rec; }
        /* FEET ON THE GROUND (Chad, 13 Nov 2026: "You didn't notice many masters have their feet sunk clipping into the
           ground?"). A take holds a body at its own height, and a take made on another body (the library's, a written
           one) keeps that body's hips: on legs of another length the soles go under the ground. Measured by
           tools/probes/feetscan.mjs at the morning's start: 57 of 67 people had a foot more than a centimetre under
           the turf, the standing cast 3 to 6 cm, the crowd to 6. So every take that does not sit is set down by the
           body's own lowest contact over the part of it that is played (its window, or the whole take): a STANDING
           take by its soles (what rides the feet), a LOW one (a kneel, a bow to the ground: the hips at under 0.75 of
           their standing height, so a man kneeling upright counts) by the lowest of all its skin. It is set GROUND_SOLE into the ground under the
           person's spot (a body sinks a little into what it rests on, v9.3). This is the measure SINK and the dancers'
           o.sink took by hand, each once on one body, and it replaces them where it is made (groundTakes, below) */
        if (P.hips && o.seat && o.seat.rise && skins[0] && skins[0].skeleton) riseCurve(P, o.seat.rise, skins);
        if (P.hips && skins[0] && skins[0].skeleton) groundTakes(P, skins);
        if (o.headDamp) headDampInit(P);
        if (o.shoulders !== null) shouldersInit(P);
        /* THE GROUND A WALK OR A RUN COVERS IN A SECOND (o.pace: asked for by whoever moves the group, who drives the take's
           rate from the ground covered: v7.1). The library's walks and runs come on the spot (their hips travel nowhere:
           measured, a few millimetres a second), so the pace is read from the foot that is down: under a body that stays
           where it is, a planted foot goes back at the pace the body would go forward. Each foot at thirty-two moments of
           the take, in the person's own frame; a foot is down while it is within 3.5 cm of the lowest either reaches.
           A TAKE THAT TRAVELS (the dancers' written walk: nine tenths of a metre in the two seconds kept of it) is not read that way: its pace is the
           travel taken out of its hips over its length, exactly, and `heading` the way that travel went from the body's
           own front (this walk goes 21 degrees to her left). Moved at that pace along that line, the hips do over the
           ground just what the take had them do, and a planted foot stays where it was planted. Read from the foot
           that is down, this slow walk gave half its pace (0.21 m a second for 0.46: the foot is flat while the body
           waits over it, and the body's advance comes as the heel lifts), and the file crossed with every foot
           sliding back a hand's length a step: measured in the game on 12 Nov, a planted foot 17 cm in one stance */
        if (o.pace) { const LF = P.bone.LeftFoot || P.bone['mixamorig:LeftFoot'], RF = P.bone.RightFoot || P.bone['mixamorig:RightFoot'];
          if (LF && RF) for (const name in P.acts) { if (!WALKS.test(name)) continue;
            const A = P.acts[name], d = A.getClip().duration, N = 32, F = [[], []];
            const tv = P.travel && P.travel[name];
            if (tv && P.hips && P.hips.parent) { const par = P.hips.parent; P.group.updateWorldMatrix(true, true);
              _pv.set(tv[0], 0, tv[1]); par.localToWorld(_pv); P.group.worldToLocal(_pv); const ax = _pv.x, az = _pv.z;
              _pv.set(0, 0, 0); par.localToWorld(_pv); P.group.worldToLocal(_pv);
              const dx = ax - _pv.x, dz = az - _pv.z, sp = Math.hypot(dx, dz) / d;
              if (sp > 0.05) { (P.pace = P.pace || {})[name] = sp; (P.heading = P.heading || {})[name] = Math.atan2(dx, dz); continue; } }
            for (const k in P.acts) P.acts[k].setEffectiveWeight(k === name ? 1 : 0);
            for (let i = 0; i <= N; i++) { A.time = Math.min(d - 1e-4, d * i / N); P.mixer.update(0); P.group.updateWorldMatrix(true, true);
              [LF, RF].forEach((b, j) => { b.getWorldPosition(_pv); P.group.worldToLocal(_pv); F[j].push([_pv.y, _pv.z]); }); }
            let lo = Infinity; for (const f of F) for (const q of f) lo = Math.min(lo, q[0]);
            let back = 0, n = 0; for (const f of F) for (let i = 0; i < N; i++) if (f[i][0] < lo + 0.035 && f[i + 1][0] < lo + 0.035) { back += f[i][1] - f[i + 1][1]; n++; }
            if (n > 2 && back > 0) (P.pace = P.pace || {})[name] = back / (n * d / N); } }
        if (!P.acts[P.cur]) { console.warn(key + ' has no take ' + P.cur + ' (it has: ' + Object.keys(P.acts).join(', ') + ')'); P.cur = Object.keys(P.acts)[0]; }
        for (const k in P.acts) { P.w[k] = k === P.cur ? 1 : 0; P.acts[k].setEffectiveWeight(P.w[k]); P.acts[k].time = (P.phase * P.acts[k].getClip().duration) % P.acts[k].getClip().duration; }
        /* (for a look: which way the face looks, from the head's BIND turn, never from the bone's own axes: v6.8. Every
           body here is prepped with its face along +z in its bind pose, so the head's turn since its bind, applied to
           +z, is the face's direction now) */
        if (P.head && skins[0] && skins[0].skeleton) { const sk = skins[0].skeleton, bi = sk.bones.indexOf(P.head);
          if (bi >= 0) { const bm = new THREE.Matrix4().copy(sk.boneInverses[bi]).invert().premultiply(skins[0].bindMatrix);
            P.headRest = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().extractRotation(bm)).invert(); } }
        P.ready = true; P.group.visible = !P.hidden && !P.driver;
        if (!P.driver && !o.noBlob) P.blob = blob(P.group, o.blobW || 0.85, o.blobD || 0.7);
        personSettle(P); windowTime(P); P.mixer.update(0);
        if (o.cross) { crossDress(P, o.cross, P.lapSrc || null); personSettle(P); windowTime(P); P.mixer.update(0); }
        if (o.handsOn) restHands(P, o.handsOn);
        if (ctx.cullBySphere && !P.driver) ctx.cullBySphere(P.group, 0, 0.9, 0, 1.9);
        for (const M0 of P.members) memberSkin(M0, 1);
        if (o.look) o.look(m);
        if (o.skins !== false) for (const i of [0, 2, 3]) if (i || (!P.driver && !o.fullFilm)) addLevel(P, i);
        if (o.fullFilm && have(P.key + LEVELS[0][0])) parseOnce(P.key + LEVELS[0][0]).catch(() => {});
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
          if (mat.map) sheetOf(P.key, mat.map);
          const mesh = new THREE.SkinnedMesh(sm.geometry, mat);
          mesh.castShadow = false; mesh.receiveShadow = false; mesh.frustumCulled = false; mesh.visible = false;
          P.model.add(mesh); mesh.bind(new THREE.Skeleton(bones, sm.skeleton.boneInverses), sm.bindMatrix); made.push(mesh); });
        if (!made.length) return;
        P.lv[i] = made; P.lvNow = -1;
        if (ctx.cullBySphere && !P.driver) ctx.cullBySphere(P.group, 0, 0.9, 0, 1.9);
        for (const M0 of P.members) memberSkin(M0, i);
      }).catch(err => { console.warn(key + ' failed to load', err); if (ctx.loadFail) ctx.loadFail(key, err); });
    }
    /* (v26.8, Chad, 13 Nov 2026, of the woman raising her bai sri to the brown hermit, with my picture of it: "look at how
       bad and blocky the arms look , are these the full res models?"; they were not, and his answer to the two who go up:
       "Yes, full models", for those close film shots only) A FULL BODY FOR ONE FILM (o.fullFilm): read with the chapter, so
       nothing is decoded while the world is on screen, but laid on the bones only when the film that brings it close
       begins, and given back when it ends (its buffers and its own sheets out of the phone's graphics memory: about 50 MB
       each, v26.5's measure). The film first shows it after a black (the festival's second half begins under the cut's
       black), so its upload is never on screen. A sheet the full body borrows from the near one is not given back */
    function fullOn(P) { if (P && P.o.fullFilm && !P.lv[0]) whenReady(P, () => { if (!P.lv[0]) addLevel(P, 0); }); }
    /* (v26.11: AND NOTHING ANOTHER BODY DRAWS. A full body is read once a file and shared (parseOnce), so the film's two
       share their shapes and sheets with whoever else wears the same body at full detail all chapter (a man of the
       waiting line wears the second one's, e4devc): given back as the film ended, they were taken off the chip under him
       too, and put back on it, on screen, the next time the player walked up to him. What any other body draws, at any
       level, is kept now, as the near body's own always was; what is this body's alone is given back as before. Nothing
       drawn changes. `?opt=keepShared:0` gives everything back as before) */
    function fullOff(P) {
      if (!P || !P.o.fullFilm || !P.lv[0]) return;
      const near = new Set(); for (const q of P.lv[1] || []) for (const mt of [].concat(q.material)) near.add(mt);
      const keep = new Set();
      if (KEEPSHARED) for (const Q of people) if (Q !== P) for (const L of Q.lv) if (L) for (const q of L) {
        keep.add(q.geometry); for (const mt of [].concat(q.material)) { keep.add(mt); for (const k in mt) { const v = mt[k]; if (v && v.isTexture) keep.add(v); } } }
      for (const m of P.lv[0]) { P.model.remove(m); if (!keep.has(m.geometry)) m.geometry.dispose();
        for (const mt of [].concat(m.material)) if (!near.has(mt) && !keep.has(mt)) for (const k in mt) { const v = mt[k]; if (v && v.isTexture && !keep.has(v)) v.dispose(); } }
      P.lv[0] = null; P.lvNow = -1;
      /* (and the cull's list of the body's meshes read again without them: v26.8, the engine gives a re-registered
         body its own masks back first) */
      if (ctx.cullBySphere && !P.driver) ctx.cullBySphere(P.group, 0, 0.9, 0, 1.9);
    }
    const whenReady = (P, fn) => { if (!P) return; if (P.ready) fn(P); else P.then.push(fn); };
    /* the model slid so the body stands on the person's spot whatever its takes' own offsets, by their weights */
    /* (and set down: two written takes hold the whole body a few centimetres over the ground, measured on a devotee) */
    const SINK = { prostrate: 0.046, offer: 0.049 };
    /* FEET ON THE GROUND, read (mkPerson, above). For each take a body has that does not sit: the lowest of what touches
       the ground over the part of it that is played, and the height that sets that GROUND_SOLE under the person's spot
       (P.offY, with P.grounded saying it was read; P.groundRep keeps what was read, for a probe: feet, all, hips as a
       share of their standing height, low, off). The skin is read where it stands furthest out: of each bone's share of
       it, the points furthest along 64 ways (the feet's) or 14 (the rest's), because the lowest point of a posed body is
       one of its outermost, so a body is read at a thousand points and not at its tens of thousands, each exactly posed
       (getVertexPosition), at GROUND_N moments of a window or GROUND_NW of a whole take. Bodies of one file wearing a
       take in one window share a reading (groundMemo): a crowd of drivers costs it once */
    const GROUND_SOLE = -0.003, GROUND_N = 8, GROUND_NW = 12, GROUND_LOW = 0.75, groundMemo = new Map(), groundPts = new Map();
    const _grV = new THREE.Vector3(), _grI = new THREE.Matrix4(), _grM = new THREE.Matrix4();
    function sphereDirs(n) { const out = [], g = Math.PI * (3 - Math.sqrt(5)); for (let i = 0; i < n; i++) { const y = 1 - 2 * (i + 0.5) / n, r = Math.sqrt(1 - y * y), a = g * i; out.push([Math.cos(a) * r, y, Math.sin(a) * r]); } return out; }
    const DIRS_FOOT = sphereDirs(64), DIRS_BODY = [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]].concat([-1, 1].flatMap(x => [-1, 1].flatMap(y => [-1, 1].map(z => [x / Math.sqrt(3), y / Math.sqrt(3), z / Math.sqrt(3)]))));
    function groundPoints(P, skins) {
      if (groundPts.has(P.key)) return groundPts.get(P.key);
      /* (each point is kept as WHICH skin and which of its vertices, never the skin itself: every person of one file shares
         this list, and read through the first one's mesh, a crowd's driver was read in somebody else's pose: v26.2) */
      const out = { foot: [], body: [] };
      for (let si0 = 0; si0 < skins.length; si0++) { const q = skins[si0], pos = q.geometry.attributes.position, si = q.geometry.attributes.skinIndex, sw = q.geometry.attributes.skinWeight; if (!pos || !si || !sw || !q.skeleton) continue;
        const foot = q.skeleton.bones.map(b => /^(mixamorig:?)?(Left|Right)(Foot|Toe\w*)$/.test(b.name)), best = new Map();
        for (let i = 0; i < pos.count; i++) { let bj = -1, bw = -1, fw = 0;
          for (let c = 0; c < 4; c++) { const w = sw.getComponent(i, c), j = si.getComponent(i, c); if (w > bw) { bw = w; bj = j; } if (foot[j]) fw += w; }
          const isF = fw >= 0.5, key2 = bj * 2 + (isF ? 1 : 0), D = isF ? DIRS_FOOT : DIRS_BODY;
          let B = best.get(key2); if (!B) best.set(key2, B = { f: isF, v: new Float64Array(D.length).fill(-Infinity), i: new Int32Array(D.length).fill(-1) });
          const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
          for (let d = 0; d < D.length; d++) { const u = x * D[d][0] + y * D[d][1] + z * D[d][2]; if (u > B.v[d]) { B.v[d] = u; B.i[d] = i; } } }
        for (const B of best.values()) { const seen = new Set(); for (const i of B.i) if (i >= 0 && !seen.has(i)) { seen.add(i); (B.f ? out.foot : out.body).push([si0, i]); } } }
      groundPts.set(P.key, out); return out;
    }
    function groundTakes(P, skins) {
      const o = P.o, seatT = (nm) => !!o.seat && (!o.seat.takes || o.seat.takes.test(nm));
      const sk = skins[0].skeleton, hi = sk.bones.indexOf(P.hips); if (hi < 0) return;
      P.model.position.set(0, 0, 0);
      const poseAt = (A, t) => { A.time = t; P.mixer.update(0); P.group.updateWorldMatrix(true, false); P.group.updateMatrixWorld(true); _grI.copy(P.group.matrixWorld).invert(); };
      const only = (name) => { for (const k in P.acts) P.acts[k].setEffectiveWeight(k === name ? 1 : 0); };
      const momentsOf = (name) => { const A = P.acts[name], d = A.getClip().duration, W = P.win && P.win[name], N = W ? GROUND_N : GROUND_NW, ts = [];
        for (let i = 0; i < N; i++) ts.push(W ? ((W[0] + W[1] * i / (N - 1)) % d + d) % d : Math.min(d - 1e-3, d * i / (N - 1)));
        return ts; };
      /* (the hips' standing height: the highest they stand in any of this body's takes that do not sit. Read from the
         bind pose it came out at 2 to 15 cm on these files, and every take was left as it was: v26.2's first build) */
      let standH = groundPts.has(P.key + '|H') ? groundPts.get(P.key + '|H') : -Infinity;
      if (!(standH > -Infinity)) { for (const name in P.acts) { if (seatT(name)) continue; only(name);
          for (const t of momentsOf(name)) { poseAt(P.acts[name], t); standH = Math.max(standH, P.hips.getWorldPosition(_grV).applyMatrix4(_grI).y); } }
        groundPts.set(P.key + '|H', standH); }
      if (!(standH > 0.3)) { if (standH > -Infinity) console.warn(P.key + ': no standing height to read its takes against (' + standH.toFixed(2) + ')'); return; }
      const PTS = groundPoints(P, skins);
      const lowOf = (list) => { let m = Infinity; const mats = new Map(), sms = new Map();
        for (const [k, i] of list) { const q = skins[k]; if (!q) continue; let M = mats.get(q); if (!M) { M = new THREE.Matrix4().multiplyMatrices(_grI, q.matrixWorld); mats.set(q, M); }
          if (FASTSKIN) { let SM = sms.get(q); if (!SM) { SM = skinMats(q).map(x => x.clone()); sms.set(q, SM); } skinVertex(q, i, _grV, SM); } else q.getVertexPosition(i, _grV);
          _grV.applyMatrix4(M); if (_grV.y < m) m = _grV.y; } return m; };
      for (const name in P.acts) { if (seatT(name)) continue;
        const A = P.acts[name], d = A.getClip().duration, W = P.win && P.win[name], memo = P.key + '|' + name + '|' + (W ? W[0] + ',' + W[1] : '');
        let R = groundMemo.get(memo);
        if (!R) { const ts = momentsOf(name); only(name);
          let hipsLo = Infinity; for (const t of ts) { poseAt(A, t); hipsLo = Math.min(hipsLo, P.hips.getWorldPosition(_grV).applyMatrix4(_grI).y); }
          const low = hipsLo < GROUND_LOW * standH; let feet = Infinity, all = Infinity;
          for (let n = 0; n < ts.length; n++) { poseAt(A, ts[n]); feet = Math.min(feet, lowOf(PTS.foot));
            if (low || n === 0) all = Math.min(all, feet, lowOf(PTS.body)); }
          const contact = low ? all : feet;
          R = { feet: +feet.toFixed(4), all: +all.toFixed(4), hips: +(hipsLo / standH).toFixed(2), low, off: +(contact - GROUND_SOLE).toFixed(4) };
          if (!(Math.abs(R.off) < 0.2)) { console.warn(P.key + ': ' + name + ' read as standing ' + R.off.toFixed(3) + ' m off the ground: left as it was'); R.skip = true; }
          groundMemo.set(memo, R); }
        (P.groundRep = P.groundRep || {})[name] = R;
        if (R.skip) continue;
        P.offY[name] = R.off; (P.grounded = P.grounded || {})[name] = true; }
    }
    /* A RISE FROM A SEAT, on the ground (o.seat.rise: the name of the take he stands up in). Seated he is set on his seat
       by his bottom and his legs are laid down to the ground (seatDown); stood up he is set down by his soles, as any
       standing take is. Between, the take's own hips say how far he has risen: at each of 25 moments of it the height his
       hips have climbed from where he sits to the highest they reach, eased, takes him from the one height to the other
       (P.rise[name], read in personSettle at the take's own moment). Grandmaster Pho rises from his bench in play and in
       the films: on his seat's height his soles stood 7 cm under the ground the whole way up */
    function riseCurve(P, name, skins) {
      const A = P.acts[name]; if (!A || !(P.offY[name] != null)) return;
      const PTS = groundPoints(P, skins), d = A.getClip().duration, N = 25, ts = [], hs = [], fs = [];
      for (const k in P.acts) P.acts[k].setEffectiveWeight(k === name ? 1 : 0);
      P.model.position.set(0, 0, 0);
      for (let i = 0; i < N; i++) { const t = Math.min(d - 1e-3, d * i / (N - 1)); A.time = t; P.mixer.update(0); P.group.updateWorldMatrix(true, false); P.group.updateMatrixWorld(true);
        _grI.copy(P.group.matrixWorld).invert(); let m = Infinity;
        const sms = FASTSKIN ? new Map() : null;
        for (const [k, j] of PTS.foot) { const q = skins[k]; if (!q) continue; _grM.multiplyMatrices(_grI, q.matrixWorld);
          if (sms) { let SM = sms.get(q); if (!SM) { SM = skinMats(q).map(x => x.clone()); sms.set(q, SM); } skinVertex(q, j, _grV, SM); } else q.getVertexPosition(j, _grV);
          _grV.applyMatrix4(_grM); if (_grV.y < m) m = _grV.y; }
        ts.push(t); hs.push(P.hips.getWorldPosition(_grV).applyMatrix4(_grI).y); fs.push(m); }
      const W = P.win && P.win[name], t0 = W ? W[0] : 0; let h0 = hs[0]; for (let i = 0; i < N; i++) if (ts[i] <= t0) h0 = hs[i];
      const h1 = Math.max(...hs), seat = P.offY[name], off = [];
      if (!(h1 - h0 > 0.15)) { console.warn(P.key + ': ' + name + ' does not rise (' + (h1 - h0).toFixed(2) + ' m): left on its seat'); return; }
      const ks = [];
      for (let i = 0; i < N; i++) { const u = Math.max(0, Math.min(1, ((hs[i] - h0) / (h1 - h0) - 0.15) / 0.7)), k = u * u * (3 - 2 * u);
        off.push(seat + k * ((fs[i] - GROUND_SOLE) - seat)); ks.push(k); }
      (P.rise = P.rise || {})[name] = { ts, off, k: ks };
      (P.groundRep = P.groundRep || {})[name] = { seat: +seat.toFixed(4), stood: +(fs[N - 1] - GROUND_SOLE).toFixed(4), rise: +(h1 - h0).toFixed(3) };
    }
    /* HEAD TURNS RESTRAINED (o.headDamp: { take: [k, reference take] }; Chad, 13 Nov 2026: "for the audience looking left
       and right, i think the angle to left and right is too extreme, and can be slightly restrained", and "When
       grandmaster pho talks, his head also moves too much to the right, i think the head movement can be greatly
       restrained"). Measured (tools/probes/headturn.mjs): the kneel's look round swept the face from 54 degrees to one
       side to 61 to the other, and Grandmaster Pho's talk turned his face up to 56 degrees to his right. So while a take
       named here is worn, the turns of the upper chest, the neck and the head are laid `k` of the way from a reference to
       where the take puts them: the reference is that take's own middle (the mean of those turns over its window: the look
       round about its centre) or another take's (his talk about his rest, which faces his front). The motion is the
       take's, smaller, and nothing else moves. Laid after the mixer has posed the body every frame (the mixer writes those
       turns again each frame), in play and in a film's pose alike, before a look (gaze) is laid over it */
    const _hdQ = new THREE.Quaternion();
    function headDampInit(P) {
      const D = P.o.headDamp, bones = [];
      for (const nm of ['Spine2', 'Neck', 'Head']) { const re = new RegExp('^(mixamorig:?)?' + nm + '$'); for (const n in P.bone) if (re.test(n)) { bones.push(P.bone[n]); break; } }
      if (!D || !bones.length) return;
      const meanOf = (name) => { const A = P.acts[name]; if (!A) return null; const d = A.getClip().duration, W = P.win && P.win[name], N = 24, acc = bones.map(() => [0, 0, 0, 0]), first = [];
        for (const k in P.acts) P.acts[k].setEffectiveWeight(k === name ? 1 : 0);
        for (let i = 0; i < N; i++) { A.time = W ? ((W[0] + W[1] * i / (N - 1)) % d + d) % d : d * i / N; P.mixer.update(0);
          bones.forEach((b, j) => { const q = b.quaternion; if (i === 0) first[j] = q.clone();
            const s = q.x * first[j].x + q.y * first[j].y + q.z * first[j].z + q.w * first[j].w < 0 ? -1 : 1; acc[j][0] += q.x * s; acc[j][1] += q.y * s; acc[j][2] += q.z * s; acc[j][3] += q.w * s; }); }
        return acc.map(v => new THREE.Quaternion(v[0], v[1], v[2], v[3]).normalize()); };
      P.hd = { bones, take: {} };
      for (const name in D) { const spec = [].concat(D[name]), M = P.acts[name] ? meanOf(spec[1] || name) : null; if (M) P.hd.take[name] = { k: +spec[0], M }; }
    }
    function headDampLay(P) {
      const H = P.hd; if (!H) return;
      let best = null, bw = 0, cut = 0;
      for (const n in H.take) { const w = P.w[n] || 0; if (w > 0) { cut += w * (1 - H.take[n].k); if (w > bw) { bw = w; best = n; } } }
      if (!best || !(cut > 1e-4)) return;
      const M = H.take[best].M, kk = 1 - Math.min(1, cut);
      if (NOGARB) { const L = H.bones; for (let j = 0; j < L.length; j++) { const b = L[j]; _hdQ.copy(b.quaternion); b.quaternion.copy(M[j]).slerp(_hdQ, kk); } }
      else H.bones.forEach((b, j) => { _hdQ.copy(b.quaternion); b.quaternion.copy(M[j]).slerp(_hdQ, kk); });
      H.bones[0].updateWorldMatrix(false, true);
    }
    /* THE SHOULDERS LET DOWN (o.shoulders: { take: k }; v26.8, Chad, 13 Nov 2026: "ton's natural resting posture while
       standing, has his shoulders very raised and tensed up, make it look more natural"). Measured (tools/probes/
       jointscan.mjs: the collar bone's rise from its root at the neck out to the shoulder joint, against the body's own A
       pose, its neutral): the library's stand, laid on these bodies, holds both collar bones 27 to 49 degrees over their
       neutral, a full shrug (Ton 37 and 49), on everyone who wears it: it was made on a body whose arms begin level, and
       its collar bones came over raised. So while a take named here is worn, each collar bone is laid `k` of the way from
       where the take holds it to its bind pose with the take's own motion about its middle kept (the mean of its turn over
       the take's window: a breath that lifts the shoulders still lifts them), and the upper arm is given back its turn
       against the collar bone's parent, so the arm hangs and swings exactly as the take has it and only the shoulder
       comes down. Laid after the mixer and before any hand is laid (a hand on a thing reaches from the shoulder as it now
       is), taken off by armsBack() before the mixer runs again (v11.5) */
    /* (v26.8, Chad, the same evening, when the same shrug had been measured on everyone else who stands and left for his
       word: "there are also many other standing audience models all with the same raised shoulder problem, fix all of
       them the way you fixed Ton. All of them." So it is every body's: the stand and the talk let down wherever a body has
       them, unless it says `shoulders: null`) */
    const STAND_SH = { Idle_3: 1, Stand_and_Chat: 1 };
    const _sdq = new THREE.Quaternion(), _sdq2 = new THREE.Quaternion();
    function shouldersInit(P) {
      const asked = P.o.shoulders !== undefined, D = asked ? P.o.shoulders : STAND_SH; if (!D) return;
      if (!Object.keys(D).some(n => P.acts[n])) return;
      const bone = (nm) => { const re = new RegExp('^(mixamorig:?)?' + nm + '$'); for (const n in P.bone) if (re.test(n)) return P.bone[n]; return null; };
      const S = [];
      for (const S0 of ['Left', 'Right']) { const cl = bone(S0 + 'Shoulder'), up = bone(S0 + 'Arm'); if (!cl || !up || up.parent !== cl) continue;
        const qb = bindLocal(P, cl); if (qb) S.push({ cl, up, qb, scl: new THREE.Quaternion(), sup: new THREE.Quaternion(), M: {} }); }
      if (!S.length) { if (asked) console.warn(P.key + ': o.shoulders asked, and no collar bone with its upper arm under it'); return; }
      /* (each take's middle turn of each collar bone, over the window the take is worn in: headDampInit's measure) */
      for (const name in D) { const A = P.acts[name]; if (!A) continue; const d = A.getClip().duration, W = P.win && P.win[name], N = 24, acc = S.map(() => [0, 0, 0, 0]), first = [];
        for (const k in P.acts) P.acts[k].setEffectiveWeight(k === name ? 1 : 0);
        for (let i = 0; i < N; i++) { A.time = W ? ((W[0] + W[1] * i / (N - 1)) % d + d) % d : d * i / N; P.mixer.update(0);
          S.forEach((R, j) => { const q = R.cl.quaternion; if (i === 0) first[j] = q.clone();
            const sg = q.x * first[j].x + q.y * first[j].y + q.z * first[j].z + q.w * first[j].w < 0 ? -1 : 1; acc[j][0] += q.x * sg; acc[j][1] += q.y * sg; acc[j][2] += q.z * sg; acc[j][3] += q.w * sg; }); }
        S.forEach((R, j) => { R.M[name] = new THREE.Quaternion(acc[j][0], acc[j][1], acc[j][2], acc[j][3]).normalize(); }); }
      P.shd = { S, take: Object.assign({}, D), on: false };
    }
    function shouldersLay(P) {
      const H = P.shd; if (!H) return;
      let best = null, bw = 0, k = 0;
      for (const n in H.take) { const w = P.w[n] || 0; if (w > 0 && H.S[0].M[n]) { k += w * H.take[n]; if (w > bw) { bw = w; best = n; } } }
      if (!best || !(k > 1e-4)) return;
      k = Math.min(1, k);
      for (const R of H.S) {
        R.scl.copy(R.cl.quaternion); R.sup.copy(R.up.quaternion);
        /* the collar bone: its bind pose, with the take's motion about its middle laid on it; k of the way there */
        _sdq.copy(R.M[best]).invert().premultiply(R.cl.quaternion); _sdq2.copy(R.qb).multiply(_sdq);
        R.cl.quaternion.slerp(_sdq2, k);
        /* the upper arm: the same turn against the collar bone's parent as before (old collar * old arm = new collar * new arm) */
        R.up.quaternion.copy(R.cl.quaternion).invert().multiply(R.scl).multiply(R.sup);
        R.cl.updateWorldMatrix(false, true);
      }
      H.on = true;
    }
    function riseOff(R, t, which = 'off') {
      const ts = R.ts, V = R[which], n = ts.length; if (t <= ts[0]) return V[0]; if (t >= ts[n - 1]) return V[n - 1];
      let i = 1; while (i < n - 1 && ts[i] < t) i++; const u = (t - ts[i - 1]) / (ts[i] - ts[i - 1]); return V[i - 1] + (V[i] - V[i - 1]) * u;
    }
    function personSettle(P) {
      if (!P.model) return; let ox = 0, oz = 0, oy = 0, rk = 0;
      /* (o.sink: a body's own measure for a take: the same written walk lays one dancer's feet 2.5 cm under the turf and
         the other's 1 cm over it: gait.mjs, each ankle against where it stands at rest) */
      const SK = P.o.sink;
      for (const k in P.w) { const w = P.w[k], f = P.off[k]; if (w > 0 && f) { ox += f[0] * w; oz += f[1] * w; }
        const sk = P.grounded && P.grounded[k] ? 0 : (SK && SK[k] != null ? SK[k] : SINK[k]); if (w > 0 && sk) oy += sk * w;
        const oyk = P.rise && P.rise[k] ? riseOff(P.rise[k], P.acts[k].time) : P.offY[k]; if (w > 0 && oyk) oy += oyk * w;
        if (w > 0 && P.rise && P.rise[k]) rk += w * riseOff(P.rise[k], P.acts[k].time, 'k'); }
      P.riseK = rk;
      P.model.position.x = -ox; P.model.position.z = -oz; P.model.position.y = -oy;
    }
    /* A WINDOW of a take (o.win: { take: [from, length, seconds] }): a take that is right only for part of its length is
       played back and forth inside that part, eased at both ends (the seated idle leans far forward for five of its ten
       seconds: only its upright ends are a master's rest). The window may run past the take's end: it wraps.
       THERE AND BACK TAKES `seconds` (Chad, 12 Nov 2026: "grandmaster pho is bobbing and bouncing too much in his
       passive pose, slow down the bobbing significantly"). Unsaid, it is twice the window's own length, the take's own
       pace: and a SHORT window at the take's own pace is a bob (his rest was 0.3 s of a take there and back every
       0.6 s: his head at 15 cm a second, measured by tools/probes/windowread.mjs; held half risen on 0.28 s of the rise
       it went 16 cm there and back every 0.56 s). A window that is a REST says its seconds. */
    function windowTime(P) {
      if (!P.win) return;
      for (const name in P.win) { const A = P.acts[name]; if (!A || !(P.w[name] > 0)) continue;
        const W = P.win[name], [from, len] = W, d = A.getClip().duration, u = (P.clock / (W[2] > 0 ? W[2] : len * 2)) % 1, k = 0.5 - 0.5 * Math.cos(u * 2 * Math.PI);
        A.time = (((from + k * len) % d) + d) % d; A.timeScale = 0; }
    }
    /* which take a person wears from now on (eased over `fade` seconds); `restart` begins it at its start */
    function take(P, name, fade = 0.4, restart = false) {
      if (!P) return false;
      if (!P.ready) { P.cur = name; P.then.push(() => take(P, name, 0, restart)); return true; }
      if (!P.acts[name]) { console.warn(P.key + ' has no take ' + name); return false; }
      if (restart || P.cur !== name) { if (restart || P.w[name] < 0.01) P.acts[name].time = 0; }
      if (P.span && P.span.name !== name) P.span = null;
      if (!(P.win && P.win[name]) && !(P.span && P.span.name === name)) P.acts[name].timeScale = 1;       // (a take once windowed runs again when its window is gone)
      P.cur = name; P.fade = fade; P.filmT = null;
      if (!(fade > 0)) { for (const k in P.acts) { P.w[k] = k === name ? 1 : 0; P.acts[k].setEffectiveWeight(P.w[k]); } personSettle(P); }
      return true;
    }
    /* a film's pose: this take at this moment of its own length (held at its end, or wrapped if `loop`), absolutely */
    /* (a take a body does not have fails silently and the man stands as he was: v11.2. A film that asks for one is
       told so once, in the console, where every probe of this chapter reads it) */
    const _noTake = new Set();
    function noTake(P, name) { const k = P.key + ':' + name; if (_noTake.has(k)) return; _noTake.add(k); console.warn(P.key + ' has no take ' + name + ' (a film asked for it; it has: ' + Object.keys(P.acts).join(', ') + ')'); }
    /* (v26.8: an optional THIRD take, name3 at k3 from t3, so a body blended between two takes can go on into a third
       from exactly where it stands: the brown hermit sits up at 0.42 of his laying-on take, and at the petals the
       film switched to the whole of it in one frame, his lean jumping from about ten degrees to twenty-five. Absent,
       every weight is what it was) */
    function pose(P, name, t, loop = false, name2 = null, k2 = 0, t2 = 0, name3 = null, k3 = 0, t3 = 0) {
      if (!P || !P.ready) return;
      if (!P.acts[name]) { noTake(P, name); return; }
      if (name2 && !P.acts[name2]) noTake(P, name2);
      if (name3 && !P.acts[name3]) noTake(P, name3);
      for (const k in P.acts) { const w = k === name ? 1 - (name2 ? k2 : 0) - (name3 ? k3 : 0) : (k === name2 ? k2 : (k === name3 ? k3 : 0)); P.w[k] = w; P.acts[k].setEffectiveWeight(w); }
      const A = P.acts[name], d = A.getClip().duration; A.time = loop ? ((t % d) + d) % d : Math.max(0, Math.min(d - 1e-3, t));
      if (name2 && P.acts[name2]) { const A2 = P.acts[name2], d2 = A2.getClip().duration; A2.time = Math.max(0, Math.min(d2 - 1e-3, t2)); }
      if (name3 && P.acts[name3]) { const A3 = P.acts[name3], d3 = A3.getClip().duration; A3.time = Math.max(0, Math.min(d3 - 1e-3, t3)); }
      P.cur = name; P.filmT = t; armsBack(P); personSettle(P); P.mixer.update(0);
      if (P.hd) headDampLay(P);
      if (P.shd) shouldersLay(P);
      if (P.restLegs) seatLegsLay(P);
      if (P.restHands && !(P.layK > 0)) restHandsLay(P);
      if (!P.htLate) handsTrue(P);
    }
    /* (v26.18: a person put somewhere stands on the floor that is there: the hall's is 0.48 m up, its steps between; on the
       ground of the Wai Kru that is 0, as it was) */
    function put(P, x, z, ry, y = flatGround(x, z)) { if (!P) return; P.group.position.set(x, y, z); if (ry != null) P.group.rotation.y = ry; }
    const faceTo = (x, z, tx, tz) => Math.atan2(tx - x, tz - z);                 // the turn that faces a +z-facing body at a point
    /* every frame of play: weights eased on the wall clock, takes run, bodies settled */
    function peopleTick(wdt, live) {
      for (const P of people) {
        if (!P.ready || (!P.group.visible && !P.driver) || (P.driver && P.idle)) continue;
        if (P.filmT != null && !live) continue;                                  // a film holds its people where it posed them
        if (P.filmT != null) { P.filmT = null; }
        let moved = false;
        for (const k in P.acts) { const to = k === P.cur ? 1 : 0, w = P.w[k];
          if (w !== to) { const st = P.fade > 0 ? wdt / P.fade : 1; P.w[k] = to > w ? Math.min(to, w + st) : Math.max(to, w - st); P.acts[k].setEffectiveWeight(P.w[k]); moved = true; } }
        if (moved) personSettle(P);
        P.clock += wdt * P.rate; windowTime(P);
        if (P.span) spanTick(P, wdt);
        if (P.rise) personSettle(P);
        armsBack(P);
        P.mixer.update(wdt * P.rate);
        if (P.hd) headDampLay(P);
        if (P.shd) shouldersLay(P);
        if (P.gaze || P.gazeK > 0) gazeTick(P, wdt);
        if (P.lay || P.layK > 0) layTick(P, wdt);
        if (P.restLegs) seatLegsLay(P);
        if (P.restHands && !(P.layK > 0)) restHandsLay(P);
        if (!P.htLate) handsTrue(P);
      }
    }
    /* A TAKE PLAYED ONCE between two of its own moments, over `secs` seconds, eased at both ends (t1 may be before t0:
       a rise played backwards is a sitting down), then HELD on a small window at its end (o.hold: seconds of the take,
       back and forth from where it stopped; negative runs back; o.holdSecs: how long that takes there and back, where
       the hold is a stillness and not a beat) or handed on (o.then). A rise from a seat, a throw, a
       bow. Its window and its end are the person's own state, so reset() need only name a take again. */
    function span(P, name, t0, t1, secs, o = {}) {
      if (!P) return;
      whenReady(P, () => { if (!P.acts[name]) { console.warn(P.key + ' has no take ' + name); return; }
        if (P.win && P.win[name]) delete P.win[name];
        P.span = { name, t0, t1, secs: Math.max(0.05, secs), u: 0, hold: o.hold != null ? o.hold : 0, holdSecs: o.holdSecs > 0 ? o.holdSecs : 0, then: o.then || null, n: ++P.actN };
        take(P, name, o.fade != null ? o.fade : 0.4); P.acts[name].time = t0; P.acts[name].timeScale = 0; });
    }
    function spanTick(P, wdt) {
      const Sp = P.span, A = P.acts[Sp.name]; if (!A) { P.span = null; return; }
      Sp.u = Math.min(1, Sp.u + wdt / Sp.secs);                                 // (wall seconds, whatever the person's own rate: a bow is in time with the ground)
      const d = A.getClip().duration; A.time = Math.max(0, Math.min(d - 1e-3, Sp.t0 + (Sp.t1 - Sp.t0) * smo(Sp.u))); A.timeScale = 0;
      if (Sp.u < 1) return;
      P.span = null;
      if (Sp.hold) { (P.win = P.win || {})[Sp.name] = Sp.holdSecs > 0 ? [Sp.t1, Sp.hold, Sp.holdSecs] : [Sp.t1, Sp.hold]; P.clock = 0; }
      if (Sp.then) Sp.then(P);
    }
    /* a take with a window of its own from now on (a pose held: both hands laid forward), or with none (it runs whole);
       `secs`, where said, is how long the window takes there and back (windowTime) */
    function hold(P, name, from, len, fade = 0.5, secs = 0) {
      if (!P) return;
      whenReady(P, () => { if (!P.acts[name]) return; P.span = null; ++P.actN;
        if (len == null) { if (P.win) delete P.win[name]; } else { (P.win = P.win || {})[name] = secs > 0 ? [from, len, secs] : [from, len]; P.clock = 0; }
        take(P, name, fade); if (len == null) P.acts[name].timeScale = 1; });
    }
    /* back to the take a person was built in, and its window */
    function rest(P, fade = 0.6) {
      if (!P) return;
      whenReady(P, () => { P.span = null; ++P.actN; const R = P.rest;
        if (R.win && R.win[R.take]) { (P.win = P.win || {})[R.take] = R.win[R.take]; P.clock = 0; }
        take(P, R.take, fade); });
    }
    /* a person who speaks plays his talking take from the line's own start, and goes back to rest after it (v11.4);
       whatever he is given to do meanwhile wins (the act's number has moved on) */
    function talk(P, secs, name) {
      if (!P) return;
      whenReady(P, () => { const tk = name || P.talkTake; if (!tk || !P.acts[tk]) return;
        if (P.win && P.win[tk]) delete P.win[tk];
        P.span = null; const n = ++P.actN; take(P, tk, 0.35); P.acts[tk].timeScale = 1;
        after(Math.max(0.4, secs - 0.15), () => { if (P.actN === n) rest(P, 0.5); }); });
    }
    /* A LOOK (v6.9): the head eased onto a point (or the lens) within a neck's reach, laid on after the mixer has
       written the take and so never stacked (the take writes the head again before the next look is laid). The face's
       own direction is the head's turn since its bind (headRest), not the bone's axes. */
    const _lkq = new THREE.Quaternion(), _lkq2 = new THREE.Quaternion(), _lkq3 = new THREE.Quaternion(), _lkv = new THREE.Vector3(), _lkv2 = new THREE.Vector3(), _lkz = new THREE.Vector3();
    function gaze(P, target, o = {}) { if (!P) return; P.gaze = target ? { target, reach: o.reach != null ? o.reach : 0.75, secs: o.secs || 0.9, down: o.down != null ? o.down : 0.03 } : null; if (!target) P.gazeOut = o.secs || 0.9; }
    function gazeTick(P, wdt) {
      const G = P.gaze, secs = G ? G.secs : (P.gazeOut || 0.9);
      P.gazeK = G ? Math.min(1, P.gazeK + wdt / secs) : Math.max(0, P.gazeK - wdt / secs);
      const L = G || P.gazeLast; if (G) P.gazeLast = G;
      if (!L || !(P.gazeK > 0) || !P.head || !P.headRest) return;
      const tg = L.target === 'lens' ? camera.getWorldPosition(_lkv2) : _lkv2.set(L.target[0], L.target[1], L.target[2]);
      P.group.updateWorldMatrix(true, true);
      P.head.getWorldPosition(_lkv); P.head.getWorldQuaternion(_lkq);
      /* the face's direction now, in the world: the head's turn since its bind, applied to +z */
      _lkz.set(0, 0, 1).applyQuaternion(P.headRest).applyQuaternion(_lkq).normalize();
      _lkv2.sub(_lkv); _lkv2.y -= L.down * _lkv2.length(); _lkv2.normalize();
      const ang = Math.acos(Math.max(-1, Math.min(1, _lkz.dot(_lkv2)))); if (ang < 1e-3) return;
      const k = smo(P.gazeK) * Math.min(1, L.reach / ang);
      _lkq3.setFromUnitVectors(_lkz, _lkv2); _lkq2.identity().slerp(_lkq3, k);        // the turn, in the world
      /* onto the head bone: world' = turn * world, so local' = parentWorld^-1 * turn * world */
      const par = P.head.parent; par.getWorldQuaternion(_lkq3);
      P.head.quaternion.copy(_lkq3.invert().multiply(_lkq2).multiply(_lkq));
    }
    /* a film's look: the head turned onto a point (or the lens) by k, now, with no clock of its own (after pose()) */
    function lookNow(P, target, k = 1, reach = 0.75, down = 0.03) {
      if (!P || !P.ready || !P.head || !P.headRest || !(k > 0)) return;
      const tg = target === 'lens' ? camera.getWorldPosition(_lkv2) : _lkv2.set(target[0], target[1], target[2]);
      P.group.updateWorldMatrix(true, true);
      P.head.getWorldPosition(_lkv); P.head.getWorldQuaternion(_lkq);
      _lkz.set(0, 0, 1).applyQuaternion(P.headRest).applyQuaternion(_lkq).normalize();
      tg.sub(_lkv); tg.y -= down * tg.length(); tg.normalize();
      const ang = Math.acos(Math.max(-1, Math.min(1, _lkz.dot(tg)))); if (ang < 1e-3) return;
      _lkq3.setFromUnitVectors(_lkz, tg); _lkq2.identity().slerp(_lkq3, smo(c01(k)) * Math.min(1, reach / ang));
      P.head.parent.getWorldQuaternion(_lkq3);
      P.head.quaternion.copy(_lkq3.invert().multiply(_lkq2).multiply(_lkq));
    }
    /* HANDS LAID ON A THING (photograph 5: the kneeling man raises his bai sri in both hands and the seated master "has
       both his hands on it too": that is the empowerment, Chad's §0). A take holds a body's hands where that body's own
       motion puts them, and no two takes of two bodies put four hands on one bowl. So the BOWL is the truth and the
       hands go to it: each arm solved as two bones onto its wrist's place, the elbow down and out (v24.21's solver,
       below), and the hand turned so its palm lies on the thing with its fingers along it. Laid on after the take has
       posed the body, and UNDONE before the mixer runs again (the v11.5 law: the mixer writes a bone only when its
       take's value changes, so a turn left in a bone would be turned again from itself).
       A hand's own axes are MEASURED on the body, once (v25.3: "each hand's own surface and thumb side"), from its
       bind pose: armsOf. */
    const _ia = new THREE.Vector3(), _ib = new THREE.Vector3(), _ic = new THREE.Vector3(), _it = new THREE.Vector3(), _ie = new THREE.Vector3(),
          _ipo = new THREE.Vector3(), _iu = new THREE.Vector3(), _iv = new THREE.Vector3(), _ig = new THREE.Vector3(),
          _iqa = new THREE.Quaternion(), _iqb = new THREE.Quaternion(), _iqp = new THREE.Quaternion();
    function armTo(a, target, pole) {
      a.up.updateWorldMatrix(true, true);
      a.up.getWorldPosition(_ia); a.fore.getWorldPosition(_ib); a.hand.getWorldPosition(_ic);
      const la = _ia.distanceTo(_ib), lb = _ib.distanceTo(_ic);
      _it.copy(target).sub(_ia); let d = _it.length(); if (d < 1e-5 || la < 1e-5 || lb < 1e-5) return;
      _it.divideScalar(d); d = THREE.MathUtils.clamp(d, Math.abs(la - lb) + 1e-3, la + lb - 1e-3);
      _ipo.copy(pole).sub(_ia); _ipo.addScaledVector(_it, -_ipo.dot(_it)); if (_ipo.lengthSq() < 1e-10) return; _ipo.normalize();
      const ca = THREE.MathUtils.clamp((la * la + d * d - lb * lb) / (2 * la * d), -1, 1), sa = Math.sqrt(1 - ca * ca);
      _ie.copy(_ia).addScaledVector(_it, la * ca).addScaledVector(_ipo, la * sa);
      _iu.copy(_ib).sub(_ia).normalize(); _iv.copy(_ie).sub(_ia).normalize();
      _iqa.setFromUnitVectors(_iu, _iv); a.up.getWorldQuaternion(_iqb); _iqa.multiply(_iqb);
      a.up.parent.getWorldQuaternion(_iqp); a.up.quaternion.copy(_iqa.premultiply(_iqp.invert()));
      a.up.updateWorldMatrix(false, true);
      a.fore.getWorldPosition(_ib); a.hand.getWorldPosition(_ic);
      _iu.copy(_ic).sub(_ib).normalize(); _iv.copy(target).sub(_ib).normalize();
      _iqa.setFromUnitVectors(_iu, _iv); a.fore.getWorldQuaternion(_iqb); _iqa.multiply(_iqb);
      a.fore.parent.getWorldQuaternion(_iqp); a.fore.quaternion.copy(_iqa.premultiply(_iqp.invert()));
      a.fore.updateWorldMatrix(false, true);
    }
    const ARMS = { L: ['LeftArm', 'LeftForeArm', 'LeftHand'], R: ['RightArm', 'RightForeArm', 'RightHand'] };
    const _hb = new THREE.Vector3(), _hf = new THREE.Vector3(), _hn = new THREE.Vector3(), _ha = new THREE.Vector3(), _hW = new THREE.Vector3(), _hP = new THREE.Vector3(),
          _hL = new THREE.Vector3(), _hm = new THREE.Matrix4(), _hm2 = new THREE.Matrix4(), _hq = new THREE.Quaternion(), _hq2 = new THREE.Quaternion();
    function armsOf(P) {
      if (P.arms !== undefined) return P.arms;
      P.arms = null;
      const bone = (nm) => { const re = new RegExp('^(mixamorig:?)?' + nm + '$'); for (const n in P.bone) if (re.test(n)) return P.bone[n]; return null; };
      const skins = P.lv[1]; if (!skins || !skins.length) return null;
      /* (a bone's place and turn in the bind pose, from whichever skin is bound to it) */
      const bindOf = (b) => { if (!b) return null; for (const sm of skins) { const i = sm.skeleton.bones.indexOf(b); if (i >= 0) return new THREE.Matrix4().copy(sm.skeleton.boneInverses[i]).invert(); } return null; };
      const at = (b) => { const m = bindOf(b); return m ? new THREE.Vector3().setFromMatrixPosition(m) : null; };
      const out = {}, v = new THREE.Vector3();
      for (const sd of ['L', 'R']) {
        const S0 = sd === 'L' ? 'Left' : 'Right', side = sd === 'L' ? 1 : -1;
        const up = bone(S0 + 'Arm'), fore = bone(S0 + 'ForeArm'), hand = bone(S0 + 'Hand'); if (!up || !fore || !hand) return null;
        const mh = bindOf(hand), ph = at(hand), pf = at(fore); if (!mh || !ph || !pf) return null;
        let f, nrm, palm;
        const pMid = at(bone(S0 + 'HandMiddle1')), pOut = at(bone(S0 + 'HandPinky1')) || at(bone(S0 + 'HandRing1')), pIn = at(bone(S0 + 'HandIndex1')) || pMid;
        if (pMid && pOut && pIn) {
          /* A RIG WITH FINGERS: the fingers' line runs from the wrist to the middle finger's root; across the palm runs
             from the little finger's root to the first finger's; the palm faces their cross (a left hand held out flat,
             fingers along +x and thumb to +z, faces down: +x cross +z; a right hand is its mirror) */
          f = pMid.clone().sub(ph); palm = 0.55 * f.length(); f.normalize();
          const ac = pIn.clone().sub(pOut); ac.addScaledVector(f, -ac.dot(f)).normalize();
          nrm = new THREE.Vector3().crossVectors(f, ac).multiplyScalar(side).normalize();
        } else {
          /* A RIG WITH NONE: the forearm's line carried on; the palm's normal is the thin axis of the skin the hand bone
             carries, about that line, signed to face down and in (as an A pose or a T pose holds a palm) */
          f = ph.clone().sub(pf).normalize();
          const u = new THREE.Vector3(0, 1, 0); if (Math.abs(f.y) > 0.9) u.set(0, 0, 1); u.addScaledVector(f, -u.dot(f)).normalize(); const w = new THREE.Vector3().crossVectors(f, u);
          let n = 0, su = 0, sw = 0, suu = 0, sww = 0, suw = 0, len = 0;
          for (const sm of skins) { const hi = sm.skeleton.bones.indexOf(hand), g = sm.geometry, pos = g.attributes.position, si = g.attributes.skinIndex, sk = g.attributes.skinWeight; if (hi < 0 || !si || !sk) continue;
            for (let i = 0; i < pos.count; i++) { let wt = 0; for (let j = 0; j < 4; j++) if (si.getComponent(i, j) === hi) wt += sk.getComponent(i, j);
              if (wt < 0.6) continue;
              v.fromBufferAttribute(pos, i).applyMatrix4(sm.bindMatrix).sub(ph); const a = v.dot(u), b = v.dot(w); len = Math.max(len, v.dot(f));
              n++; su += a; sw += b; suu += a * a; sww += b * b; suw += a * b; } }
          if (n < 12) { console.warn(P.key + ': the ' + sd + ' hand has no fingers and no skin of its own to measure'); return null; }
          const cuu = suu / n - (su / n) * (su / n), cww = sww / n - (sw / n) * (sw / n), cuw = suw / n - (su / n) * (sw / n), th = 0.5 * Math.atan2(2 * cuw, cuu - cww) + Math.PI / 2;
          nrm = u.clone().multiplyScalar(Math.cos(th)).addScaledVector(w, Math.sin(th)).normalize();
          const ref = nrm.x * -side - nrm.y;                                     // (down and in: the left hand is at +x of a body that faces +z)
          if (Math.abs(ref) < 0.2) console.warn(P.key + ': the ' + sd + ' palm faces neither down nor in at rest (' + ref.toFixed(2) + '): its side is a guess');
          if (ref < 0) nrm.negate();
          palm = 0.3 * Math.max(0.12, Math.min(0.24, len));
        }
        const ri = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().extractRotation(mh)).invert();
        const fL = f.clone().applyQuaternion(ri), nL = nrm.clone().applyQuaternion(ri), aL = new THREE.Vector3().crossVectors(nL, fL);
        out[sd] = { up, fore, hand, fL, nL, aL, palm, side, fingers: !!(pMid && pOut && pIn), wrote: false, qUp: new THREE.Quaternion(), qFore: new THREE.Quaternion(), qHand: new THREE.Quaternion() };
      }
      P.arms = out; return out;
    }
    /* (before a body's mixer runs: what was laid on its arms is taken off) */
    function armsBack(P) { const HT0 = P.ht; if (HT0 && HT0.on) { for (const R of HT0.W) if (R.on) { R.fore.quaternion.copy(R.sf); R.hand.quaternion.copy(R.sh); R.on = false; }
        for (const R of HT0.J) if (R.on) { R.b.quaternion.copy(R.sv); R.on = false; }
        for (const R of HT0.K) if (R.on) { R.b.quaternion.copy(R.sv); R.on = false; } HT0.on = false; }
      const LG = P.restLegs; if (LG && LG.wrote) { for (const sd in LG.R) { const r = LG.R[sd]; r.up.quaternion.copy(r.qUp); r.fore.quaternion.copy(r.qFore); r.foot.quaternion.copy(r.qFoot);
        if (r.gUp) r.gUp.quaternion.copy(r.qGUp); if (r.gLow) r.gLow.quaternion.copy(r.qGLow); } LG.wrote = false; }
      const A = P.arms; if (A) for (const sd in A) { const a = A[sd];
      if (a.curled) { for (const F of a.fing) F.b.quaternion.copy(F.q); if (a.fingRest) { for (const F of a.fingRest) F.b.quaternion.copy(F.q); a.fingRest = null; } a.curled = false; }
      if (!a.wrote) continue; a.up.quaternion.copy(a.qUp); a.fore.quaternion.copy(a.qFore); a.hand.quaternion.copy(a.qHand); a.wrote = false; }
      const RH0 = P.restHands; if (RH0) for (const sd in RH0.R) { const fl = RH0.R[sd].fol; if (fl) for (const F of fl) if (F.on) { F.b.quaternion.copy(F.q); F.on = false; } }
      /* (the shoulders let down were laid first, under every hand: so they are taken off last) */
      const SH = P.shd; if (SH && SH.on) { for (const R of SH.S) { R.cl.quaternion.copy(R.scl); R.up.quaternion.copy(R.sup); } SH.on = false; } }
    /* A HAND CLOSED ROUND A THING (the woman with the taper): each finger's three joints turned by `th` radians toward
       the palm's own facing, about the hand's own measured across-axis as it lies in the world now. Laid on after
       handTo() and taken off by armsBack() before the mixer runs again, as every laid pose is (v11.5). A rig with no
       finger bones is left as it is. */
    function curlFingers(P, sd, th) {
      const As = P && P.ready ? armsOf(P) : null, a = As && As[sd]; if (!a) return;
      if (!a.fing) { a.fing = []; const S0 = sd === 'L' ? 'Left' : 'Right';
        for (const f of ['Index', 'Middle', 'Ring', 'Pinky']) for (let i = 1; i <= 3; i++) { const b = P.bone[S0 + 'Hand' + f + i] || P.bone['mixamorig:' + S0 + 'Hand' + f + i]; if (b) a.fing.push({ b, q: new THREE.Quaternion(), i }); } }
      if (!a.fing.length) return;
      if (!a.curled) { for (const F of a.fing) F.q.copy(F.b.quaternion); a.curled = true; }
      a.hand.getWorldQuaternion(_hq); _hf.copy(a.fL).applyQuaternion(_hq); _hn.copy(a.nL).applyQuaternion(_hq); _ha.crossVectors(_hf, _hn).normalize();
      for (const F of a.fing) { _hq.setFromAxisAngle(_ha, th * (F.i === 3 ? 0.7 : 1)); F.b.parent.getWorldQuaternion(_hq2);
        /* world' = turn * world, so local' = parentWorld^-1 * turn * parentWorld * local */
        F.b.quaternion.premultiply(_hq2).premultiply(_hq).premultiply(_hq2.invert()); }
    }
    /* (v26.11, NOGARB) a hand's resting turns, kept before a pose is laid on them: ONE list a hand and a caller (`key`),
       its turns copied in again each time (the same numbers a new list held: q copied from the bone as clone() made it;
       `i` the joint's own, or the one given), where a new list and a new turn for each joint were made every frame */
    function restList(a, key, from, i1) {
      let L = a[key];
      if (!L || L.length !== from.length) { L = a[key] = from.map(F => ({ b: F.b, q: new THREE.Quaternion(), i: 0 })); }
      for (let j = 0; j < from.length; j++) { const F = from[j], R = L[j]; R.b = F.b; R.q.copy(F.b.quaternion); R.i = i1 > 0 ? i1 : F.i; }
      return L;
    }
    /* (v26.8) A HAND OPENED ROUND A THING HELD FROM BELOW (photograph 5: the kneeling man's fingers spread up the bowl's
       sides, straight and a little bent, where the woman's take left hers closed in fists against it, Chad: "the arms of
       the female ... dont look very natural and abit awkward while holding the bai sri"): each finger's and the thumb's
       joints laid at the body's own A pose (open, relaxed: the generated people were made in it), then the four fingers
       bent toward the palm by `curl` radians at their three joints (the bowl's curve), about the hand's own across-axis.
       Laid after handTo() and taken off by armsBack() before the mixer runs again (the same bookkeeping curlFingers
       keeps). A rig with no finger bones is left as it is */
    function fingersOpen(P, sd, k = 1, curl = [0.18, 0.22, 0.12]) {
      const As = P && P.ready ? armsOf(P) : null, a = As && As[sd]; if (!a || !(k > 0)) return;
      if (!a.fing) { a.fing = []; const S0 = sd === 'L' ? 'Left' : 'Right';
        for (const f of ['Index', 'Middle', 'Ring', 'Pinky']) for (let i = 1; i <= 3; i++) { const b = P.bone[S0 + 'Hand' + f + i] || P.bone['mixamorig:' + S0 + 'Hand' + f + i]; if (b) a.fing.push({ b, q: new THREE.Quaternion(), i }); } }
      if (!a.thumb) { a.thumb = []; const S0 = sd === 'L' ? 'Left' : 'Right';
        for (let i = 1; i <= 3; i++) { const b = P.bone[S0 + 'HandThumb' + i] || P.bone['mixamorig:' + S0 + 'HandThumb' + i]; if (b) a.thumb.push({ b, q: new THREE.Quaternion(), i }); } }
      if (!a.fing.length) return;
      if (!a.curled) { for (const F of a.fing) F.q.copy(F.b.quaternion); a.fingRest = NOGARB ? restList(a, 'frT', a.thumb, 0) : a.thumb.map(F => ({ b: F.b, q: F.b.quaternion.clone(), i: F.i })); a.curled = true; }
      if (NOGARB) { for (const F of a.fing) { if (!F.qb) F.qb = bindLocal(P, F.b) || F.b.quaternion.clone(); F.b.quaternion.copy(F.qb); }
        for (const F of a.thumb) { if (!F.qb) F.qb = bindLocal(P, F.b) || F.b.quaternion.clone(); F.b.quaternion.copy(F.qb); } }
      else for (const F of a.fing.concat(a.thumb)) { if (!F.qb) F.qb = bindLocal(P, F.b) || F.b.quaternion.clone(); F.b.quaternion.copy(F.qb); }
      a.hand.updateWorldMatrix(true, true);
      a.hand.getWorldQuaternion(_hq); _hf.copy(a.fL).applyQuaternion(_hq); _hn.copy(a.nL).applyQuaternion(_hq); _ha.crossVectors(_hf, _hn).normalize();
      for (const F of a.fing) { _hq.setFromAxisAngle(_ha, curl[F.i - 1] || 0); F.b.parent.getWorldQuaternion(_hq2);
        F.b.quaternion.premultiply(_hq2).premultiply(_hq).premultiply(_hq2.invert()); F.b.updateWorldMatrix(false, true); }
      /* (part of the way, while the hold begins or ends: each joint eased from the take's own) */
      if (k < 0.999) { for (const F of a.fing) { _hq.copy(F.b.quaternion); F.b.quaternion.copy(F.q).slerp(_hq, k); }
        for (const F of a.fingRest) { _hq.copy(F.b.quaternion); F.b.quaternion.copy(F.q).slerp(_hq, k); }
        a.hand.updateWorldMatrix(false, true); }
    }
    /* ONE HAND onto a thing, by k: its palm's middle at `at` (a point of the thing's surface), its fingers along `f`,
       its palm facing `n` (into the thing). o: { back: how far behind the palm's middle the wrist is, in metres (the
       hand's own measure unless said); off: how far the wrist stands off the surface; out, down: the elbow's side,
       from the shoulder } */
    function handTo(P, sd, at, f, n, k = 1, o = {}) {
      const As = P && P.ready ? armsOf(P) : null, a = As && As[sd]; if (!a || !(k > 0)) return false;
      if (!a.wrote) { a.qUp.copy(a.up.quaternion); a.qFore.copy(a.fore.quaternion); a.qHand.copy(a.hand.quaternion); a.wrote = true; }
      P.group.updateWorldMatrix(true, true);
      const ks = smo(c01(k));
      _hf.set(f[0], f[1], f[2]).normalize(); _hn.set(n[0], n[1], n[2]); _hn.addScaledVector(_hf, -_hn.dot(_hf)).normalize();
      _hW.set(at[0], at[1], at[2]).addScaledVector(_hf, -(o.back != null ? o.back : a.palm)).addScaledVector(_hn, -(o.off != null ? o.off : 0.022));
      a.hand.getWorldPosition(_hb); _hW.set(lp(_hb.x, _hW.x, ks), lp(_hb.y, _hW.y, ks), lp(_hb.z, _hW.z, ks));
      a.up.getWorldPosition(_hP); P.group.getWorldQuaternion(_hq); _hL.set(1, 0, 0).applyQuaternion(_hq);
      _hP.addScaledVector(_hL, a.side * (o.out != null ? o.out : 0.3)); _hP.y -= (o.down != null ? o.down : 0.32);
      /* (o.aft: the elbow drawn behind the body too, for a hand held at the hip: the woman with the taper. Absent, nothing moves) */
      if (o.aft) { _hL.set(0, 0, 1).applyQuaternion(_hq); _hP.addScaledVector(_hL, -o.aft); }
      armTo(a, _hW, _hP);
      _ha.crossVectors(_hn, _hf); _hm.makeBasis(_ha, _hn, _hf); _hm2.makeBasis(a.aL, a.nL, a.fL).transpose(); _hm.multiply(_hm2); _hq.setFromRotationMatrix(_hm);
      a.hand.parent.getWorldQuaternion(_hq2); _hq.premultiply(_hq2.invert());
      if (ks < 0.999) a.hand.quaternion.slerp(_hq, ks); else a.hand.quaternion.copy(_hq);
      a.hand.updateWorldMatrix(false, true);
      return true;
    }
    /* both hands, from a grip (baiGrip below) */
    function handsTo(P, grip, k = 1) { if (!grip) return; for (const sd of ['L', 'R']) if (grip[sd]) handTo(P, sd, grip[sd].at, grip[sd].f, grip[sd].n, k, grip[sd]); }
    /* WHERE TWO HANDS LIE ON A BAI SRI that stands at `c` (the middle of its foot, in the world) drawn at size s, for a
       body at `from` (so "forward" is from the body to the bowl). ON it (a master's: the palms down and in on the tiers
       of marigold above the bowl's rim, the fingers forward and a little down) or UNDER it (the one who offers it: the
       palms up and in under the bowl's swell, the fingers forward and up). The bowl's measures are the model's own
       (tools/probes/bands.mjs: the foot 0.09 m wide, the swell 0.13 at 0.15 m, the rim 0.19 at 0.21, tiers above) */
    function baiGrip(c, s, from, how = 'on') {
      const fx = c[0] - from[0], fz = c[2] - from[1], d = Math.hypot(fx, fz) || 1, F = [fx / d, fz / d], Lf = [F[1], -F[0]], out = {};
      for (const [sd, sg] of [['L', 1], ['R', -1]]) {
        if (how === 'on') { const r = 0.128 * s, y = 0.285 * s;
          out[sd] = { at: [c[0] + Lf[0] * sg * r - F[0] * 0.035, c[1] + y, c[2] + Lf[1] * sg * r - F[1] * 0.035],
                      f: [F[0] * 0.9 - Lf[0] * sg * 0.32, -0.3, F[1] * 0.9 - Lf[1] * sg * 0.32], n: [-Lf[0] * sg * 0.62, -0.78, -Lf[1] * sg * 0.62], out: 0.3, down: 0.3 }; }
        else { const r = 0.112 * s, y = 0.105 * s;
          out[sd] = { at: [c[0] + Lf[0] * sg * r - F[0] * 0.03, c[1] + y, c[2] + Lf[1] * sg * r - F[1] * 0.03],
                      f: [F[0] * 0.85 - Lf[0] * sg * 0.22, 0.48, F[1] * 0.85 - Lf[1] * sg * 0.22], n: [-Lf[0] * sg * 0.8, 0.55, -Lf[1] * sg * 0.8], out: 0.22, down: 0.4 }; }
      }
      return out;
    }
    /* WHERE TWO HANDS CARRY A TRAY that stands at `c` (the middle of its foot, in the world), its foot r in radius, for a
       body at `from`: the palms up under its foot at either side, the fingers forward and a little in */
    function trayGrip(c, r, from) {
      const fx = c[0] - from[0], fz = c[2] - from[1], d = Math.hypot(fx, fz) || 1, F = [fx / d, fz / d], Lf = [F[1], -F[0]], out = {};
      for (const [sd, sg] of [['L', 1], ['R', -1]])
        out[sd] = { at: [c[0] + Lf[0] * sg * r * 0.84 - F[0] * 0.03, c[1] - 0.004, c[2] + Lf[1] * sg * r * 0.84 - F[1] * 0.03],
                    f: [F[0] * 0.92 - Lf[0] * sg * 0.3, 0.1, F[1] * 0.92 - Lf[1] * sg * 0.3], n: [-Lf[0] * sg * 0.25, 0.95, -Lf[1] * sg * 0.25], out: 0.2, down: 0.42 };
      return out;
    }
    /* in play: a body's hands eased onto a grip and off it again (a grip may be a function, answering where the thing
       is now); in a film handsTo() is called by the film's own clock */
    function lay(P, grip, o = {}) { if (!P) return; if (grip) { P.lay = { grip, secs: o.secs || 0.8 }; P.layLast = P.lay; } else { P.lay = null; P.layOut = o.secs || 0.8; } }
    function layTick(P, wdt) {
      const G = P.lay, secs = G ? G.secs : (P.layOut || 0.8);
      P.layK = G ? Math.min(1, (P.layK || 0) + wdt / secs) : Math.max(0, (P.layK || 0) - wdt / secs);
      const L = G || P.layLast; if (!L || !(P.layK > 0)) return;
      handsTo(P, typeof L.grip === 'function' ? L.grip() : L.grip, P.layK);
    }
    /* HIS HANDS AT REST (o.handsOn; Chad, 12 Nov 2026, of the three monks as they first went live: "Look at the arms
       and hands of those monks, its completely unacceptable, how did that pass your review?"). MINE, both times: a
       seated take lays a body's hands where the body it was made on had its thighs, and on these robed bodies they went
       into the cloth; my first fix sent each palm flat onto the lap whatever the arm had to do (the wrists broke back,
       the elbows flared, the fingers stood stiff: claws), and my second moved the take's own arm as little as it could
       (the take's fingers closed into fists on the robe; Chad's monk's hands hung in the air before his knees). Both
       went past me in small pictures; and my third, the first laid as below, sent both elbows back and IN, inside his
       flank, the forearms out through the roll of his robe at the waist (an elbow bent toward a point behind the wrist,
       and by the shortest arc), seen only when the pictures were opened full size. So a rest is now DESIGNED as a body
       rests, and every one is photographed full size, high res, from before him, from each side and close on each
       hand, before it is built on (tracker §15.5).
       how 'lap': THE PALMS ON THE THIGHS, THE ELBOWS AT HIS SIDES. Each palm's middle on what is drawn of his lap (his
         body without his arms, read as heights up to 30 cm over his hip joints: `top`), wherever along the thigh leaves
         the reach from shoulder to wrist `ratio` of the arm's length (0.87, an elbow bent as an arm at rest bends it),
         the thigh's middle preferred where it cannot be had (or at `at`, if given); `out` to its outer side. The elbow
         behind the line from shoulder to wrist and below it, turned out from his side a step at a time until the upper
         arm and the forearm, each swept at its own thickness, clear what is drawn of him; the arm solved about its own
         elbow's hinge, read off his take (armHinge). The fingers carried on along the forearm's own line seen from
         above, a quarter of the way toward the thigh's, following the cloth's slope, the palm facing the cloth; the
         wrist `off` above it. Fingers with bones are his file's own at rest (the bind pose: a relaxed open hand), each
         joint curled by `curl` toward the palm, the little finger most. Measured once, on the take he rests in at its
         window's start, and reported (P.restRep: where, the reach, how far turned out, the wrist's bend).
       A HAND OF ONE PIECE (Chad's monk: no finger bones; each hand is his scan's, open, the fingers spread and a little
         cupped: tools/probes/handaxes.mjs, and photographed) is laid the same way by its own measured axes (handAxes).
         Palms joined before his chest were tried first, episode 3's solve and then one of mine, and refused by
         photograph: open spread fingers cannot press flat, and from in front the two hands showed as two open palms
         side by side.
       Laid every frame after the mixer has posed him, and taken off before it runs again (armsBack: the v11.5 law) */
    const _rhA = new THREE.Vector3(), _rhB = new THREE.Vector3(), _rhC = new THREE.Vector3(), _rhD = new THREE.Vector3(), _rhQ = new THREE.Quaternion(), _rhQ2 = new THREE.Quaternion();
    const FINGERS = ['Index', 'Middle', 'Ring', 'Pinky'];
    /* (a bone's turn in its parent in the bind pose, from the skin's own inverse binds) */
    function bindLocal(P, b) {
      for (const sm of P.lv[1] || []) { const sk = sm.skeleton, i = sk.bones.indexOf(b), ip = b.parent ? sk.bones.indexOf(b.parent) : -1; if (i < 0 || ip < 0) continue;
        const m = new THREE.Matrix4().copy(sk.boneInverses[ip]).multiply(new THREE.Matrix4().copy(sk.boneInverses[i]).invert());     // (the parent's bind inverted, times this bone's bind)
        const q = new THREE.Quaternion(); m.decompose(new THREE.Vector3(), q, new THREE.Vector3()); return q; }
      return null;
    }
    /* A MAN SITTING ON A CHAIR AS PHOTOGRAPH 2'S MONKS SIT (o.seat.down: { y, sink, edge, r, apron, sole }): his bottom
       on the seat, his feet flat on the ground below his knees, whatever take he sits in. Chad's monk's chair-sits
       perch, made for a seat some 8 cm higher than this chair's (his hip joints 17 cm over his knees, his thighs sloping
       thirty-three degrees: sitread.mjs), so set down by his soles his bottom hung over the seat, and set on the seat his
       feet went under the ground. So his bottom is set on the seat (the second hundredth of the skin his hips and
       thighs carry, `sink` into it), and each LEG is solved as two bones (armTo, the arms' own solver) from his hip
       joint to where the take puts that ankle, on the ground (its sole `sole` from it), the knee forward; each foot
       keeps the turn the take gives it in the world. Then he is brought forward until his shins, between the seat's
       top and the foot of its apron, stand `r` past its front face (`edge` ahead of his spot), feet and all. Laid every
       frame after the mixer has posed him and taken off before it runs again (armsBack), as a hand's grip is */
    function seatDown(P, name, SE, skins) {
      const bone = (nm) => { const re = new RegExp('^(mixamorig:?)?' + nm + '$'); for (const n in P.bone) if (re.test(n)) return P.bone[n]; return null; };
      const v = new THREE.Vector3(), loc = (b) => { b.getWorldPosition(v); return P.group.worldToLocal(v.clone()); };
      const under = [], feet = { Left: [], Right: [] };
      for (const q of skins) { const pos = q.geometry.attributes.position, si = q.geometry.attributes.skinIndex, sw = q.geometry.attributes.skinWeight; if (!pos || !si || !sw || !q.skeleton) continue;
        const role = q.skeleton.bones.map(b => /^(mixamorig:?)?(Hips|(Left|Right)UpLeg)$/.test(b.name) ? 'U' : /^(mixamorig:?)?Left(Foot|Toe\w*)$/.test(b.name) ? 'Left' : /^(mixamorig:?)?Right(Foot|Toe\w*)$/.test(b.name) ? 'Right' : '');
        const SM = FASTSKIN ? skinMats(q) : null;
        for (let i = 0; i < pos.count; i++) { const w = { U: 0, Left: 0, Right: 0 }; for (let c = 0; c < 4; c++) { const r = role[si.getComponent(i, c)]; if (r) w[r] += sw.getComponent(i, c); }
          if (w.U < 0.5 && w.Left < 0.5 && w.Right < 0.5) continue; if (SM) skinVertex(q, i, v, SM); else q.getVertexPosition(i, v); v.applyMatrix4(q.matrixWorld); P.group.worldToLocal(v);
          if (w.U >= 0.5) under.push([v.y, v.z, v.x]); else feet[w.Left >= 0.5 ? 'Left' : 'Right'].push([v.x, v.y, v.z]); } }
      const H = loc(P.hips), K = SE.down, legs = { R: {}, wrote: false, keepKnee: K.knees === 'keep', tuck: K.tuck !== false };
      /* (his bottom: `hipOver` under his hip joints. Read from his skin it cannot be: his scan is his robe, and what
         hangs lowest under his hips in a seated take is the robe's skirt, 24 to 31 cm down (measured twice, and lifted
         off the chair both times: photographed). A seated man's hip joints stand some 12 to 15 cm over the seat
         (measured on the two new monks in the library's chair-sit: 15, in thick robes) */
      const bottom = H.y - (K.hipOver != null ? K.hipOver : 0.13), drop = bottom - (SE.y - (K.sink != null ? K.sink : 0.01));
      for (const S0 of ['Left', 'Right']) { const up = bone(S0 + 'UpLeg'), fore = bone(S0 + 'Leg'), foot = bone(S0 + 'Foot'); if (!up || !fore || !foot || !feet[S0].length) { console.warn(P.key + ': no ' + S0 + ' leg to seat'); return null; }
        const A0 = loc(foot), K0 = loc(fore);
        let sole = Infinity; for (const q of feet[S0]) if (q[1] < sole) sole = q[1];
        let footQ = P.group.getWorldQuaternion(new THREE.Quaternion()).invert().multiply(foot.getWorldQuaternion(new THREE.Quaternion()));
        /* A FOOT LAID FLAT (K.flat: v26.2 debug, the masters' feet on the ground). A chair-sit made for a higher seat
           holds the foot toe down; set on the ground as the take has it, the foot stood on its toes. So the foot is turned
           about its own breadth until the lowest of its heel and the lowest of its toes are level (the sole flat on the
           ground), the turn taken at the ankle, and the ankle set by the sole so turned */
        if (K.flat) { const toe = bone(S0 + 'ToeBase'), T0 = toe ? loc(toe) : null;
          if (T0) { const fd = new THREE.Vector3(T0.x - A0.x, 0, T0.z - A0.z); if (fd.lengthSq() > 1e-6) { fd.normalize();
            let s0 = Infinity, s1 = -Infinity; for (const q of feet[S0]) { const u = (q[0] - A0.x) * fd.x + (q[2] - A0.z) * fd.z; if (u < s0) s0 = u; if (u > s1) s1 = u; }
            const span = s1 - s0, heel = [0, Infinity], toes = [0, Infinity];
            for (const q of feet[S0]) { const u = (q[0] - A0.x) * fd.x + (q[2] - A0.z) * fd.z;
              if (u < s0 + 0.3 * span && q[1] < heel[1]) { heel[0] = u; heel[1] = q[1]; } if (u > s1 - 0.3 * span && q[1] < toes[1]) { toes[0] = u; toes[1] = q[1]; } }
            if (span > 0.08 && heel[1] < Infinity && toes[1] < Infinity && toes[0] - heel[0] > 0.05) {
              const d3 = new THREE.Vector3().copy(fd).multiplyScalar(toes[0] - heel[0]); d3.y = toes[1] - heel[1]; d3.normalize();
              const qF = new THREE.Quaternion().setFromUnitVectors(d3, fd); footQ = qF.clone().multiply(footQ);
              sole = Infinity; const pv = new THREE.Vector3();
              for (const q of feet[S0]) { pv.set(q[0] - A0.x, q[1] - A0.y, q[2] - A0.z).applyQuaternion(qF); if (pv.y + A0.y < sole) sole = pv.y + A0.y; }
              (legs.flat = legs.flat || {})[S0] = +(Math.atan2(d3.y, Math.hypot(d3.x, d3.z)) * 180 / Math.PI).toFixed(1); } } } }
        /* (the ankle where the take has it across the ground, its sole on it; the knee's pole well ahead of the take's knee) */
        legs.R[S0] = { up, fore, foot, ank: new THREE.Vector3(A0.x, A0.y - sole + (K.sole != null ? K.sole : -0.005), A0.z), pole: new THREE.Vector3(K0.x * 1.15, K0.y + 0.1, K0.z + 0.6),
          footQ, qUp: new THREE.Quaternion(), qFore: new THREE.Quaternion(), qFoot: new THREE.Quaternion(),
          /* (a body whose legs are a graft on bones of their own beside its own legs: Grandmaster Pho's, leggraft.mjs,
             thigh and shin hung from his hips. They are turned as his own legs are turned, or his shins would stay
             where the take has them while his feet went where the seat lays them) */
          gUp: bone(S0 + 'LegGraftUp'), gLow: bone(S0 + 'LegGraftLow'), qGUp: new THREE.Quaternion(), qGLow: new THREE.Quaternion() }; }
      /* lowered by `drop`: the targets in the group's frame are where the ground is, so they do not move with him */
      P.restLegs = legs; P.model.position.set(0, -drop, 0); P.group.updateMatrixWorld(true); seatLegsLay(P);
      /* forward until the shins clear the seat's front face */
      let back = Infinity; const apron = K.apron != null ? K.apron : 0.14;
      for (const S0 in legs.R) { const r = legs.R[S0], Kn = loc(r.fore), An = loc(r.foot);
        for (const h of [SE.y, SE.y - apron]) { const t = Kn.y > An.y ? Math.max(0, Math.min(1, (Kn.y - h) / (Kn.y - An.y))) : 0; back = Math.min(back, Kn.z + t * (An.z - Kn.z) - H.z); } }
      const fwd = Math.max(0, K.edge + (K.r != null ? K.r : 0.055) - back);
      /* (measured with his model at the group's origin; played, it stands where `centre` puts his hips, `off`, and
         `fwd` further forward: the feet go with him) */
      const off = P.off[name] || [0, 0];
      for (const S0 in legs.R) { const r = legs.R[S0]; r.ank.x -= off[0]; r.ank.z += fwd - off[1]; r.pole.x -= off[0]; r.pole.z += fwd - off[1]; }
      armsBack(P); P.model.position.set(0, 0, 0); P.group.updateMatrixWorld(true);
      return { legs, lift: -drop, fwd, rep: { bottom: +bottom.toFixed(3), drop: +drop.toFixed(3), fwd: +fwd.toFixed(3), shins: +back.toFixed(3), flat: legs.flat || null } };
    }
    /* A KNEEL LAID ON THE FLOOR (v26.18). The kneel the woman who serves him and Ton wear in the hall was made on
       another body, and on theirs it knelt with the shins in the air: measured in the lab, her knees 13 and 16 cm over
       the tile, her ankles 15 and 17, the whole body held up on the tips of her toes behind her (the lowest of her skin),
       and the same on Ton. A real kneel sits back on the heels: the knees on the floor in front, the shins flat along it,
       the tops of the feet flat behind, the hips a little over the heels. So the body is let down (`drop`), the take's
       thigh kept to its own heading in plan and brought down until the knee is on the floor, the shin laid flat back
       along its own heading, and the foot turned to point back along the floor: the legs laid by the seated legs' own
       layer (seatLegsLay, armTo), only while the kneel is worn (P.kneelTakes, seatShare). Measured at the window's middle
       of the take; its own legs barely move across the window (the knees 2 cm) */
    function kneelLegs(P, name = 'seiza', K = {}) {
      if (!P || !P.ready || !P.acts[name] || !P.hips || P.kneelTakes) return null;
      const drop = K.drop != null ? K.drop : 0.09, kneeY = K.knee != null ? K.knee : 0.065, ankY = K.ankle != null ? K.ankle : 0.065, toeY = K.toe != null ? K.toe : 0.055;
      const bone = (nm) => { const re = new RegExp('^(mixamorig:?)?' + nm + '$'); for (const n in P.bone) if (re.test(n)) return P.bone[n]; return null; };
      armsBack(P);
      const W = P.win && P.win[name], A = P.acts[name], d = A.getClip().duration, w0 = {};
      for (const k in P.acts) { w0[k] = P.acts[k].getEffectiveWeight(); P.acts[k].setEffectiveWeight(k === name ? 1 : 0); }
      const t0 = A.time; A.time = W ? (((W[0] + W[1] / 2) % d) + d) % d : d / 2; P.mixer.update(0);
      const m0 = P.model.position.clone(); P.model.position.set(0, 0, 0); P.group.updateMatrixWorld(true);
      const inv = new THREE.Matrix4().copy(P.group.matrixWorld).invert(), gq = P.group.getWorldQuaternion(new THREE.Quaternion()).invert();
      const loc = (b) => b.getWorldPosition(new THREE.Vector3()).applyMatrix4(inv);
      const legs = { R: {}, kneel: true }, rep = {};
      for (const S0 of ['Left', 'Right']) {
        const up = bone(S0 + 'UpLeg'), fore = bone(S0 + 'Leg'), foot = bone(S0 + 'Foot'), toe = bone(S0 + 'ToeBase');
        if (!up || !fore || !foot || !toe) { console.warn(P.key + ': no ' + S0 + ' leg to kneel'); legs.R = null; break; }
        const H = loc(up), Kn = loc(fore), An = loc(foot), Tn = loc(toe);
        const L1 = H.distanceTo(Kn), L2 = Kn.distanceTo(An), L3 = An.distanceTo(Tn);
        H.y -= drop;
        const th = new THREE.Vector2(Kn.x - H.x, Kn.z - H.z).normalize(), dy1 = H.y - kneeY, r1 = Math.sqrt(Math.max(0, L1 * L1 - dy1 * dy1));
        const knee = new THREE.Vector3(H.x + th.x * r1, kneeY, H.z + th.y * r1);
        const sh = new THREE.Vector2(An.x - Kn.x, An.z - Kn.z).normalize(), dy2 = kneeY - ankY, r2 = Math.sqrt(Math.max(0, L2 * L2 - dy2 * dy2));
        const ank = new THREE.Vector3(knee.x + sh.x * r2, ankY, knee.z + sh.y * r2);
        const ft = new THREE.Vector2(Tn.x - An.x, Tn.z - An.z).normalize(), dy3 = ankY - toeY, r3 = Math.sqrt(Math.max(0, L3 * L3 - dy3 * dy3));
        const vNow = new THREE.Vector3().subVectors(Tn, An).normalize(), vNew = new THREE.Vector3(ft.x * r3, toeY - ankY, ft.y * r3).normalize();
        const footQ = new THREE.Quaternion().setFromUnitVectors(vNow, vNew).multiply(gq.clone().multiply(foot.getWorldQuaternion(new THREE.Quaternion())));
        /* (the pole points out from the hip-to-ankle line through the knee wanted, so the solve puts the knee there and
           nowhere lower: a pole set under and before it drew the knees 2 cm into the tile, measured in the hall) */
        const ax = new THREE.Vector3().subVectors(ank, H).normalize(), foot0 = H.clone().addScaledVector(ax, new THREE.Vector3().subVectors(knee, H).dot(ax));
        const pole = knee.clone().addScaledVector(new THREE.Vector3().subVectors(knee, foot0).normalize(), 0.5);
        legs.R[S0] = { up, fore, foot, ank, pole, footQ,
          qUp: new THREE.Quaternion(), qFore: new THREE.Quaternion(), qFoot: new THREE.Quaternion(), gUp: null, gLow: null, qGUp: new THREE.Quaternion(), qGLow: new THREE.Quaternion() };
        rep[S0] = { kneeWas: +Kn.y.toFixed(3), ankleWas: +An.y.toFixed(3), toeWas: +Tn.y.toFixed(3), knee: [knee.x, knee.z].map(v => +v.toFixed(3)), ankle: [ank.x, ank.z].map(v => +v.toFixed(3)) };
      }
      A.time = t0; for (const k in P.acts) P.acts[k].setEffectiveWeight(w0[k]); P.model.position.copy(m0); P.mixer.update(0); P.group.updateMatrixWorld(true);
      if (!legs.R) return null;
      P.offY[name] = (P.offY[name] || 0) + drop; P.restLegs = legs; P.kneelTakes = new RegExp('^' + name + '$');
      personSettle(P); P.kneelRep = rep; return rep;
    }
    /* THE KNEELERS' HANDS ON THEIR THIGHS (v26.18). Laid on the floor, the kneel's own arms hung straight down past the
       thighs to the tile, photographed from her side and front in the hall: a woman kneeling to serve, and Ton kneeling
       beside the mat, rest their hands on their thighs. The seated people's own layer lays them (restHands, 'lap': the
       hands on what the body offers under them), solved in the kneel at its window's middle and drawn only while the
       kneel is worn (`only`), with the kneeling crowd's own options (c_crowd.js KNEEL_HANDS: the wrist solved against
       its forearm; the monks' options left her wrists 35 degrees toward the thumb, jointscan) */
    function kneelHands(P, name = 'seiza', K = { how: 'lap', out: 0.035, inner: 0, turn: 0.2 }) {
      if (!P || !P.ready || !P.acts[name] || !P.kneelTakes) return null;
      const W = P.win && P.win[name], A = P.acts[name], d = A.getClip().duration, w0 = {}, pw0 = Object.assign({}, P.w);
      for (const k in P.acts) { w0[k] = P.acts[k].getEffectiveWeight(); P.acts[k].setEffectiveWeight(k === name ? 1 : 0); }
      for (const k in P.w) P.w[k] = 0; P.w[name] = 1;
      const t0 = A.time; A.time = W ? (((W[0] + W[1] / 2) % d) + d) % d : d / 2; P.mixer.update(0); personSettle(P); P.group.updateMatrixWorld(true);
      const r = restHands(P, K);
      if (P.restHands) P.restHands.only = new RegExp('^' + name + '$');
      armsBack(P); A.time = t0; for (const k in P.acts) P.acts[k].setEffectiveWeight(w0[k]);
      for (const k in P.w) delete P.w[k]; Object.assign(P.w, pw0); P.mixer.update(0); personSettle(P); P.group.updateMatrixWorld(true);
      return r;
    }
    const _slA = new THREE.Vector3(), _slB = new THREE.Vector3(), _slQ = new THREE.Quaternion();
    const _slQ1 = new THREE.Quaternion(), _slQ2 = new THREE.Quaternion(), _slQ3 = new THREE.Quaternion(), _slQ4 = new THREE.Quaternion(), _slQd = new THREE.Quaternion(), _slQp = new THREE.Quaternion();
    /* (how far he wears a take that SITS, by the takes' weights: a seated man's legs are laid only while he sits. In the
       late afternoon's photograph the masters stand in Idle_3, and laid there their feet were pinned to where they
       sit: v26.2 debug. A fade between a seat and a stand lays them that share of the way) */
    const _slT = new THREE.Quaternion();
    function seatShare(P) { if (P.kneelTakes) { let k = 0; for (const n in P.w) if (P.kneelTakes.test(n)) k += P.w[n]; return Math.min(1, k); }
      const so = P.o.seat; if (!so || !so.takes) return 1 - (P.riseK || 0); let k = 0; for (const n in P.w) if (so.takes.test(n)) k += P.w[n]; return Math.min(1, k) * (1 - (P.riseK || 0)); }
    /* THE SHIN SWUNG, THE KNEE KEPT (o.seat.down.knees 'keep': Grandmaster Pho). His robe below the waist is cloth baked
       round each take's own thighs (robesim, robeshell: v24.47), so legs laid from the hip (armTo) lifted his knees
       through it: skin through the white, photographed (v26.2 debug). So his thigh stays as the take has it and only the
       shin turns about the knee, the ankle brought to the height the seat lays it at, kept to the take's own reach
       aside, the rest of its reach forward or (`tuck`) back under the seat: a man sitting with his feet drawn in */
    const _skK = new THREE.Vector3(), _skA = new THREE.Vector3(), _skF = new THREE.Vector3(), _skL = new THREE.Vector3(), _skN = new THREE.Vector3(), _skQ = new THREE.Quaternion(), _skP = new THREE.Quaternion();
    function shinTo(r, yT, tuck) {
      r.fore.getWorldPosition(_skK); r.foot.getWorldPosition(_skA);
      const L = _skK.distanceTo(_skA); if (!(L > 1e-4)) return;
      const dy = Math.max(-L + 1e-4, Math.min(L - 1e-4, yT - _skK.y));
      _skF.set(0, 0, 1).applyQuaternion(_slQ); _skF.y = 0; _skF.normalize();            // (the body's front, flat)
      const ax = _skA.x - _skK.x, az = _skA.z - _skK.z, along = ax * _skF.x + az * _skF.z;
      _skL.set(ax - along * _skF.x, 0, az - along * _skF.z);                            // (the take's reach aside, kept)
      const room = L * L - dy * dy - _skL.lengthSq(), c = room > 0 ? Math.sqrt(room) * (tuck ? -1 : Math.sign(along) || 1) : 0;
      _skN.set(_skK.x + _skL.x + _skF.x * c, _skK.y + dy, _skK.z + _skL.z + _skF.z * c);
      _skA.sub(_skK).normalize(); _skN.sub(_skK).normalize();
      _skQ.setFromUnitVectors(_skA, _skN); r.fore.getWorldQuaternion(_skP); _skQ.multiply(_skP);
      r.fore.parent.getWorldQuaternion(_skP); r.fore.quaternion.copy(_skP.invert().multiply(_skQ)); r.fore.updateWorldMatrix(false, true);
    }
    function seatLegsLay(P) {
      const LG = P.restLegs; if (!LG) return;
      const share = seatShare(P); if (!(share > 0.001)) return;
      P.group.updateWorldMatrix(true, true); P.group.getWorldQuaternion(_slQ);
      for (const S0 in LG.R) { const r = LG.R[S0];
        if (!LG.wrote) { r.qUp.copy(r.up.quaternion); r.qFore.copy(r.fore.quaternion); r.qFoot.copy(r.foot.quaternion);
          if (r.gUp) r.qGUp.copy(r.gUp.quaternion); if (r.gLow) r.qGLow.copy(r.gLow.quaternion); }
        if (r.gUp) { r.up.getWorldQuaternion(_slQ1); r.fore.getWorldQuaternion(_slQ2); r.gUp.getWorldQuaternion(_slQ3); if (r.gLow) r.gLow.getWorldQuaternion(_slQ4); }
        _slA.copy(r.ank); P.group.localToWorld(_slA); _slB.copy(r.pole); P.group.localToWorld(_slB);
        if (LG.keepKnee) shinTo(r, _slA.y, LG.tuck); else armTo({ up: r.up, fore: r.fore, hand: r.foot }, _slA, _slB);
        r.foot.parent.getWorldQuaternion(_hq2); _hq.copy(_slQ).multiply(r.footQ); r.foot.quaternion.copy(_hq2.invert().multiply(_hq)); r.foot.updateWorldMatrix(false, true);
        /* (a graft's thigh turned in the world as his own thigh was, and its shin as his own shin: D = after x before^-1) */
        if (r.gUp) { r.up.getWorldQuaternion(_slQd).multiply(_slQ1.invert()); _slQ3.premultiply(_slQd);
          r.gUp.parent.getWorldQuaternion(_slQp); r.gUp.quaternion.copy(_slQp.invert().multiply(_slQ3)); r.gUp.updateWorldMatrix(false, true);
          if (r.gLow) { r.fore.getWorldQuaternion(_slQd).multiply(_slQ2.invert()); _slQ4.premultiply(_slQd);
            r.gLow.parent.getWorldQuaternion(_slQp); r.gLow.quaternion.copy(_slQp.invert().multiply(_slQ4)); r.gLow.updateWorldMatrix(false, true); } }
        /* (part of the way, while he goes from sitting to standing or back: each turn eased from the take's own) */
        if (share < 0.999) { for (const [b, q0] of [[r.up, r.qUp], [r.fore, r.qFore], [r.foot, r.qFoot], [r.gUp, r.qGUp], [r.gLow, r.qGLow]]) { if (!b) continue;
            _slT.copy(b.quaternion); b.quaternion.copy(q0).slerp(_slT, share); }
          r.up.updateWorldMatrix(false, true); if (r.gUp) r.gUp.updateWorldMatrix(false, true); } }
      LG.wrote = true;
    }
    /* A HAND OF ONE PIECE, MEASURED (tools/probes/handaxes.mjs reads the same from the file): its skin in the hand bone's
       own bind frame, and its three axes (the longest is the fingers' line, signed toward the tip bone; the shortest, the
       palm's facing, signed toward his middle as his arms hang at his sides in the bind pose); how long the hand is
       along its fingers and how far the palm's skin stands from the bone. Chad's monk's tip bone lies 27 to 31 degrees
       off his fingers' line: laid by it, his two hands met only at the heels, in a V */
    function handAxes(P, A, sd) {
      const a = A[sd], hand = a.hand, tip = hand.children.find(ch => ch.isBone), pts = [], S0 = sd === 'L' ? 'Left' : 'Right', v = new THREE.Vector3(); let ri = null;
      for (const o of P.lv[1] || []) { if (!o.skeleton) continue; const bi = o.skeleton.bones.indexOf(hand), ti = tip ? o.skeleton.bones.indexOf(tip) : -1, sI = o.geometry.attributes.skinIndex, sW = o.geometry.attributes.skinWeight; if (bi < 0 || !sI || !sW) continue;
        const bw = new THREE.Matrix4().copy(o.skeleton.boneInverses[bi]).invert(); if (!ri) ri = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().extractRotation(bw)).invert();
        const pos = o.geometry.attributes.position, bwI = o.skeleton.boneInverses[bi];
        for (let i = 0; i < pos.count; i++) { let w = 0; for (let k = 0; k < 4; k++) { const j = sI.getComponent(i, k); if (j === bi || (ti >= 0 && j === ti)) w += sW.getComponent(i, k); } if (w < 0.6) continue;
          v.fromBufferAttribute(pos, i).applyMatrix4(o.bindMatrix).applyMatrix4(bwI); pts.push(v.clone()); } }
      if (pts.length < 30 || !ri) { console.warn(P.key + ': too little skin on his ' + S0 + ' hand to measure'); return null; }
      const mean = new THREE.Vector3(); for (const q of pts) mean.add(q); mean.multiplyScalar(1 / pts.length);
      const Cv = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]; for (const q of pts) { const d = [q.x - mean.x, q.y - mean.y, q.z - mean.z]; for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) Cv[r][c] += d[r] * d[c]; }
      const axes = []; for (let e = 0; e < 3; e++) { let x = [0.3 + e, 0.7, 0.2 - e];
        for (let it = 0; it < 300; it++) { x = [0, 1, 2].map(r => Cv[r][0] * x[0] + Cv[r][1] * x[1] + Cv[r][2] * x[2]); const l = Math.hypot(x[0], x[1], x[2]) || 1; x = x.map(u => u / l); }
        const lam = [0, 1, 2].reduce((sm, r) => sm + (Cv[r][0] * x[0] + Cv[r][1] * x[1] + Cv[r][2] * x[2]) * x[r], 0); axes.push(new THREE.Vector3(x[0], x[1], x[2]));
        for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) Cv[r][c] -= lam * x[r] * x[c]; }
      const fL = axes[0].clone(); if (tip ? fL.dot(tip.position) < 0 : fL.dot(a.fL) < 0) fL.negate();
      let len = 0; for (const q of pts) len = Math.max(len, q.dot(fL));
      const nL = axes[2].clone().addScaledVector(fL, -axes[2].dot(fL)).normalize();
      { const bw = nL.clone().applyQuaternion(ri.clone().invert()); if (bw.x * (S0 === 'Left' ? 1 : -1) > 0) nL.negate(); }
      const ds = pts.map(q => q.dot(nL)).sort((x, y) => x - y);
      return { fL, nL, aL: new THREE.Vector3().crossVectors(nL, fL).normalize(), len, depth: ds[Math.floor(ds.length * 0.97)] };
    }
    function restHands(P, K = {}) {
      const A = P && P.ready ? armsOf(P) : null, skins = P.lv[1]; P.restHands = null; P.restRep = null;
      if (!A || !skins || !skins.length) return null;
      const bone = (nm) => { const re = new RegExp('^(mixamorig:?)?' + nm + '$'); for (const n in P.bone) if (re.test(n)) return P.bone[n]; return null; };
      armsBack(P); P.group.updateWorldMatrix(true, false); P.group.updateMatrixWorld(true);
      /* (his legs where his seat lays them: the lap the hands lie on is theirs) */
      if (P.restLegs) { seatLegsLay(P); P.group.updateMatrixWorld(true); }
      /* (the take's own turns kept, so that what is solved here is taken off again: armsBack) */
      for (const sd in A) { const a = A[sd]; a.qUp.copy(a.up.quaternion); a.qFore.copy(a.fore.quaternion); a.qHand.copy(a.hand.quaternion); a.wrote = true; }
      const loc = (b, out) => { b.getWorldPosition(out); return P.group.worldToLocal(out); };
      const R = {}, rep = {};
      /* how 'lap': his body without his arms, as heights over the ground on a grid in his own frame */
      const CELL = 0.012, X0 = -0.6, Z0 = -0.6, NX = 100, NZ = 112, H = new Float32Array(NX * NZ).fill(-Infinity), v = new THREE.Vector3();
      /* (and the same points in cells of 3 cm, so an arm can be swept through him at its own thickness: clearSeg) */
      const VC = 0.03, vox = new Map(), vk = (x, y, z) => ((Math.floor(x / VC) + 512) * 1024 + (Math.floor(y / VC) + 512)) * 1024 + (Math.floor(z / VC) + 512);
      /* (the heights are his LAP's: nothing over his hip joints by more than 30 cm is read into them. Sought nearer his
         hips, a palm's place came under his face, and the highest thing drawn there was his nose) */
      const hipB = bone('Hips'), LAPTOP = hipB ? loc(hipB, new THREE.Vector3()).y + 0.3 : Infinity;
      for (const q of skins) { const pos = q.geometry.attributes.position, si = q.geometry.attributes.skinIndex, sw = q.geometry.attributes.skinWeight; if (!pos || !si || !sw || !q.skeleton) continue;
        const arm = q.skeleton.bones.map(b => /(Shoulder|Arm|Hand)/.test(b.name));
        const SM = FASTSKIN ? skinMats(q) : null;
        for (let i = 0; i < pos.count; i++) { let a = 0; for (let c = 0; c < 4; c++) if (arm[si.getComponent(i, c)]) a += sw.getComponent(i, c); if (a > 0.3) continue;
          if (SM) skinVertex(q, i, v, SM); else q.getVertexPosition(i, v); v.applyMatrix4(q.matrixWorld); P.group.worldToLocal(v);
          { const k = vk(v.x, v.y, v.z); let L = vox.get(k); if (!L) vox.set(k, L = []); L.push(v.x, v.y, v.z); }
          if (v.y > LAPTOP) continue;
          const cx = Math.round((v.x - X0) / CELL), cz = Math.round((v.z - Z0) / CELL); if (cx < 0 || cz < 0 || cx >= NX || cz >= NZ) continue; if (v.y > H[cz * NX + cx]) H[cz * NX + cx] = v.y; } }
      const H2 = new Float32Array(NX * NZ); for (let cz = 0; cz < NZ; cz++) for (let cx = 0; cx < NX; cx++) { let m = -Infinity; for (let dz = -1; dz <= 1; dz++) for (let dx = -1; dx <= 1; dx++) { const x = cx + dx, z = cz + dz; if (x >= 0 && z >= 0 && x < NX && z < NZ && H[z * NX + x] > m) m = H[z * NX + x]; } H2[cz * NX + cx] = m; }
      const top = (x, z) => { const cx = Math.round((x - X0) / CELL), cz = Math.round((z - Z0) / CELL); return cx < 0 || cz < 0 || cx >= NX || cz >= NZ ? -Infinity : H2[cz * NX + cx]; };
      const OUT = K.out != null ? K.out : 0.01, TURN = K.turn != null ? K.turn : 0.2, OFF0 = K.off != null ? K.off : 0.022, RATIO = K.ratio != null ? K.ratio : 0.87;
      const CURL = K.curl || [0.22, 0.38, 0.22], SPREAD = [1.0, 1.06, 1.14, 1.24];
      /* (is anything drawn of him within r of p? and is a segment clear of him at that thickness, from `from` of its
         length on, a ball of radius skipR about skipC aside: the cloth a palm lies on) */
      const nearBody = (p, r) => { const n = Math.ceil(r / VC), cx = Math.floor(p.x / VC), cy = Math.floor(p.y / VC), cz = Math.floor(p.z / VC), r2 = r * r;
        for (let dx = -n; dx <= n; dx++) for (let dy = -n; dy <= n; dy++) for (let dz = -n; dz <= n; dz++) {
          const L = vox.get(((cx + dx + 512) * 1024 + (cy + dy + 512)) * 1024 + (cz + dz + 512)); if (!L) continue;
          for (let i = 0; i < L.length; i += 3) { const x = L[i] - p.x, y = L[i + 1] - p.y, z = L[i + 2] - p.z; if (x * x + y * y + z * z < r2) return true; } }
        return false; };
      const clearSeg = (A0, B0, r, from, skipC, skipR) => { const p = new THREE.Vector3();
        for (let s = 0; s <= 12; s++) { const u = from + (1 - from) * s / 12; p.lerpVectors(A0, B0, u); if (skipC && p.distanceTo(skipC) < skipR) continue; if (nearBody(p, r)) return false; }
        return true; };
      for (const [sd, S0, sg] of [['L', 'Left', 1], ['R', 'Right', -1]]) {
        const a = A[sd], bu = bone(S0 + 'UpLeg'), bk = bone(S0 + 'Leg'); if (!bu || !bk) continue;
        const U = loc(bu, new THREE.Vector3()), Kn = loc(bk, new THREE.Vector3()), Sh = loc(a.up, new THREE.Vector3()), E0 = loc(a.fore, new THREE.Vector3()), W0 = loc(a.hand, new THREE.Vector3());
        const la = Sh.distanceTo(E0), lb = E0.distanceTo(W0), th = new THREE.Vector3(Kn.x - U.x, 0, Kn.z - U.z).normalize(), across = new THREE.Vector3(th.z, 0, -th.x); if (across.x * sg < 0) across.negate();
        const HM = a.fingers ? null : handAxes(P, A, sd), PALM = HM ? HM.len * 0.45 : a.palm, OFF = HM ? Math.max(0.015, HM.depth) : OFF0;
        const phi = -sg * TURN, fh = new THREE.Vector3(th.x * Math.cos(phi) + th.z * Math.sin(phi), 0, -th.x * Math.sin(phi) + th.z * Math.cos(phi));
        let best = null;
        /* (WHERE ON THE THIGH. With `at`, the palm there or as near it as his arm reaches. Without, wherever along the
           thigh leaves his elbow bent as a resting arm is bent: the reach from his shoulder to his wrist `ratio` of the
           arm's whole length (0.87: about 120 degrees inside the elbow). At a fixed share of the thigh, the long arms of
           the two monks made here reached their knees all but straight: photographed full size, 12 Nov) */
        /* (the hand's frame with its palm's middle at Cp and its fingers toward d seen from above: the fingers following
           the cloth's slope along d, the palm facing the cloth. A hand at rest lies within twenty degrees of level along
           its fingers, and its palm within twenty-five of facing straight down: the cloth's slope is followed only that far) */
        const frameAt = (Cp, d) => { const e = 0.03, cx = Cp.x, cz = Cp.z, sl = (top(cx + d.x * e, cz + d.z * e) - top(cx - d.x * e, cz - d.z * e)) / (2 * e), gx = (top(cx + 0.025, cz) - top(cx - 0.025, cz)) / 0.05, gz = (top(cx, cz + 0.025) - top(cx, cz - 0.025)) / 0.05;
          if (!isFinite(sl) || !isFinite(gx) || !isFinite(gz)) return null;
          const f = new THREE.Vector3(d.x, Math.max(-0.36, Math.min(0.15, sl)), d.z).normalize(), nS = new THREE.Vector3(-gx, 1, -gz).normalize();
          if (nS.y < Math.cos(0.44)) { const hz = Math.hypot(nS.x, nS.z) || 1; nS.set(nS.x / hz * Math.sin(0.44), Math.cos(0.44), nS.z / hz * Math.sin(0.44)); }
          /* (K.palmUp, v26.6: THE PALM TURNED UP, the hand's back on the cloth, for a body whose take holds its forearms
             rolled palm up: the hermit in the pale yellow shawl's wrists stood wrung 56 to 77 degrees at every setting of
             a palm laid down. A seated sage's hands rest so on his knees as often as palm down. Absent, all as it was) */
          const n = K.palmUp ? nS.clone() : nS.clone().negate(); n.addScaledVector(f, -n.dot(f)).normalize();
          /* (K.palmTilt, v26.6: { L, R } radians, the palm turned about the fingers' line toward his middle, the hand on its
             little finger's edge that much: a resting hand lies so as often as flat, and the forearm turns that much less.
             Absent, flat as before) */
          const tilt = K.palmTilt && K.palmTilt[sd]; if (tilt) n.applyAxisAngle(f, sg * (K.palmUp ? -tilt : tilt)).normalize();
          return { f, n, W: Cp.clone().addScaledVector(f, -PALM).addScaledVector(n, K.palmUp ? OFF : -OFF) }; };
        const ts = K.at != null ? Array.from({ length: 13 }, (_, k) => K.at - 0.04 * k) : Array.from({ length: 15 }, (_, k) => 0.28 + 0.04 * k);
        for (const t of ts) {
          /* (on the CREST of what is drawn over the thigh: the highest point across its line within six centimetres of
             `out`, the inner one where two are within 4 mm. Laid where the robe falls away down the thigh's outer side,
             a hand followed that slope and hung down it, fingers to the floor: photographed on monk B's left, 12 Nov) */
          /* (`inner`: how far toward his middle the crest may be sought. On a robe that drapes one lap over both knees the
             crest is between them, and both hands went to it, one on the other: photographed on Chad's monk) */
          let cx = 0, cz = 0, cy = -Infinity;
          for (let o = -(K.inner != null ? K.inner : 0.06); o <= 0.0601; o += 0.01) { const x = U.x + (Kn.x - U.x) * t + across.x * (OUT + o), z = U.z + (Kn.z - U.z) * t + across.z * (OUT + o), y = top(x, z); if (y > cy + 0.004) { cx = x; cz = z; cy = y; } }
          if (!(cy > 0.05)) continue;
          const Cp = new THREE.Vector3(cx, cy, cz), fr = frameAt(Cp, fh); if (!fr) continue;
          const { f, n, W } = fr, dS = W.distanceTo(Sh);
          if (dS > la + lb - 0.012 || dS < Math.abs(la - lb) + 0.03) continue;
          /* (and nearer the thigh's middle where the reach cannot be had: where every place on it left his arm straighter
             than that, the nearest to his shoulder was his hip crease, and his elbow went out to his side as a hand on a
             hip does: Chad's monk's right, photographed full size, 12 Nov) */
          const score = K.at != null ? 0 : Math.abs(dS / (la + lb) - RATIO) + 0.25 * Math.abs(t - 0.55);
          if (!best || score < best.score) best = { t, Cp, W, f, n, score, ratio: dS / (la + lb) };
          if (K.at != null) break; }
        if (!best) { console.warn(P.key + ': his ' + S0 + ' hand cannot reach his thigh: left as the take has it'); continue; }
        /* (his elbow's HINGE, read off the take he rests in. The takes on these rigs keep the forearm in one plane of the
           upper arm's frame, 0.0 degrees out of it at every key (masters/v25.3/measure/hinge.cjs, run on each monk's
           file: the tracker's §15.3), so one flexed moment names it; and the forearm's turn about its own line is kept as
           the take has it, as theirs never roll it) */
        if (!a.hinge) { const uL = a.fore.position.clone().normalize(), dL = a.hand.position.clone().normalize().applyQuaternion(a.fore.quaternion);
          const h = new THREE.Vector3().crossVectors(uL, dL); if (h.length() < 0.08) h.set(0.8, 0, sg > 0 ? -0.6 : 0.6); h.normalize();
          const flex = Math.atan2(new THREE.Vector3().crossVectors(uL, dL).dot(h), uL.dot(dL));
          a.hinge = { uL, h, rest: new THREE.Quaternion().setFromAxisAngle(h, -flex).multiply(a.fore.quaternion) }; }
        /* THE ELBOW (12 Nov, the first pictures of it seen full size: both elbows had gone back and IN, inside his flank,
           and each forearm came out through the roll of his robe at his waist). An arm at rest has its elbow behind the
           line from the shoulder to the wrist and below it, turned out from the side only as far as it must be: so it is
           turned out from straight behind a step at a time until the upper arm and the forearm, each swept at its own
           thickness, pass clear of what is drawn of him without his arms (the cloth under the palm aside). The arm is
           then solved as an arm, about its own elbow's hinge (armHinge) */
        const back = th.clone().negate();
        const findElbow = (Wt, Cpt) => { const T = Wt.clone().sub(Sh).normalize(), dW = Math.min(Sh.distanceTo(Wt), la + lb - 1e-3), ca = (la * la + dW * dW - lb * lb) / (2 * la * dW), sa = Math.sqrt(Math.max(0, 1 - ca * ca));
          let B = across.clone();
          for (let psi = 0.35; psi <= 1.56; psi += 0.087) {
            const Bp = back.clone().multiplyScalar(Math.cos(psi)).addScaledVector(across, Math.sin(psi)); Bp.y -= 0.4;
            Bp.addScaledVector(T, -Bp.dot(T)); if (Bp.lengthSq() < 1e-8) continue; B = Bp.normalize();
            const E = Sh.clone().addScaledVector(T, la * ca).addScaledVector(B, la * sa);
            if (clearSeg(Sh, E, 0.045, 0.3) && clearSeg(E, Wt, 0.035, 0, Cpt, 0.12)) return { pdir: B, psi, E, clear: true }; }
          return { pdir: B, psi: 1.56, E: Sh.clone().addScaledVector(T, la * ca).addScaledVector(B, la * sa), clear: false }; };
        let el = findElbow(best.W, best.Cp);
        /* (THE HAND ALONG ITS FOREARM: its fingers carried on along the forearm's own line seen from above, a quarter of
           the way toward the thigh's, and the elbow found again for that wrist. Laid along the thigh while the forearm came
           in from his side, each wrist was bent sideways, by up to fifty degrees: photographed full size, 12 Nov) */
        /* (K.along, v26.7: the forearm's share of that line; K.alongIt, how many times the step is taken, the elbow
           found again for each new wrist; K.handYaw { L, R }, radians the line is then turned about the upright before
           the hand is laid along it. At a quarter toward the thigh, the hermit in the pale yellow shawl's left hand,
           palm up, stood bent 35 degrees toward its little finger, the end of a real wrist's range (jointscan, v26.7's
           build); the whole way along the forearm four times over, the elbow moved each time and left the wrist bent 38
           to 47 degrees toward the thumb and the forearm wrung 115 to 122. Absent, a share of 0.75 and one step, as before) */
        { const SH = K.along != null ? K.along : 0.75, IT = K.alongIt || 1, YW = K.handYaw && K.handYaw[sd];
          for (let it = 0; it < IT; it++) { const fa = best.W.clone().sub(el.E); fa.y = 0;
            if (!(fa.lengthSq() > 1e-6)) break; const d2 = fa.normalize().multiplyScalar(SH).addScaledVector(th, 1 - SH); d2.y = 0; d2.normalize();
            if (YW) d2.applyAxisAngle(new THREE.Vector3(0, 1, 0), YW); const fr = frameAt(best.Cp, d2);
            if (!(fr && fr.W.distanceTo(Sh) < la + lb - 0.012)) break; best.f = fr.f; best.n = fr.n; best.W = fr.W; el = findElbow(best.W, best.Cp); } }
        /* (K.flexMax, v26.3: THE WRIST KEPT NEAR STRAIGHT. The brown hermit's body is short from hip to shoulder, so his
           elbow hangs at the height of his knees and his forearm climbs to them; his hand, laid along the cloth where it
           falls away over the knee, was bent down at the wrist 40 degrees (measured, tools/probes/jointscan.mjs; a real
           man's palm rests on top of the knee with the wrist near straight and only the fingers curving down over it:
           masters/v26.3/make.sh). So the hand is turned up about its own across-axis, its palm's middle where it was,
           until it bends toward the palm no more than flexMax from the forearm's line, the elbow found again each time) */
        const flexHold = () => { for (let it = 0; it < 4; it++) {
          const e = best.W.clone().sub(el.E).normalize(), f = best.f, n = best.n, ne = n.clone().addScaledVector(e, -n.dot(e)); if (ne.lengthSq() < 1e-8) break; ne.normalize();
          const flex = Math.atan2(f.dot(ne), f.dot(e)); if (flex <= K.flexMax + 0.005) break;
          const ax = new THREE.Vector3().crossVectors(n, f).normalize(), q = new THREE.Quaternion().setFromAxisAngle(ax, flex - K.flexMax);
          best.f = f.clone().applyQuaternion(q).normalize(); best.n = n.clone().applyQuaternion(q).normalize();
          best.W = best.Cp.clone().addScaledVector(best.f, -PALM).addScaledVector(best.n, K.palmUp ? OFF : -OFF);
          el = findElbow(best.W, best.Cp); } };
        if (K.flexMax != null) flexHold();
        /* (K.wristSolve, v26.7: THE HAND'S LINE SOLVED AGAINST ITS FOREARM. Laid along a line of fixed shares (above),
           the hermit in the pale yellow shawl's left wrist, palm up, stood 35 degrees toward its little finger; a whole
           share, 40 the same way; turned 26 degrees by hand either way, 35 toward the thumb or 50 toward the little
           finger, the forearm wrung past its range (jointscan, v26.7): each new wrist moves the elbow found for it. So
           the hand's line over the cloth is tried every four degrees within sixty either side of where it stands, the
           elbow found for each, and the one kept whose wrist is nearest straight with its forearm turned within a
           forearm's range and its elbow clear of him, each measured as tools/probes/jointscan.mjs measures it) */
        /* (K.flexAfter, v26.8: THE WRIST KEPT NEAR STRAIGHT WHILE ITS LINE IS SOLVED. wristSolve lays the hand again along the
           cloth's slope for each line it tries and lets the wrist bend toward the palm up to 25 degrees; on a body whose rest
           holds it to flexMax (the brown hermit's, v26.3) each line tried is held to flexMax first, its elbow found again,
           and only then measured. Held after the pick instead, the hold moved his elbow and undid the pick: his left wrist
           stood 25 to 34 degrees toward its little finger, worse than the 20 to 27 it was mended for (jointscan, v26.9's
           first build). holdOf is flexHold's own turn, on a line being tried. Absent, all as it was) */
        const holdOf = (fr, e0) => { let f = fr.f, n = fr.n, W = fr.W, e1 = e0;
          for (let it = 0; it < 4; it++) { const e = W.clone().sub(e1.E).normalize(), ne = n.clone().addScaledVector(e, -n.dot(e)); if (ne.lengthSq() < 1e-8) break; ne.normalize();
            const flex = Math.atan2(f.dot(ne), f.dot(e)); if (flex <= K.flexMax + 0.005) break;
            const ax = new THREE.Vector3().crossVectors(n, f).normalize(), q = new THREE.Quaternion().setFromAxisAngle(ax, flex - K.flexMax);
            f = f.clone().applyQuaternion(q).normalize(); n = n.clone().applyQuaternion(q).normalize();
            W = best.Cp.clone().addScaledVector(f, -PALM).addScaledVector(n, K.palmUp ? OFF : -OFF); e1 = findElbow(W, best.Cp); }
          return { fr: { f, n, W }, el: e1 }; };
        if (K.wristSolve) { const wsUp = new THREE.Vector3(0, 1, 0), wsD0 = new THREE.Vector3(best.f.x, 0, best.f.z), DG = 180 / Math.PI;
          if (wsD0.lengthSq() > 1e-8) { wsD0.normalize(); let wsPick = null;
            for (let wsK = -15; wsK <= 15; wsK++) { let wsFr = frameAt(best.Cp, wsD0.clone().applyAxisAngle(wsUp, wsK * 4 / DG)); if (!wsFr || wsFr.W.distanceTo(Sh) >= la + lb - 0.012) continue;
              let wsEl = findElbow(wsFr.W, best.Cp); if (!wsEl.clear) continue;
              if (K.flexAfter && K.flexMax != null) { const wsH = holdOf(wsFr, wsEl); wsFr = wsH.fr; wsEl = wsH.el; if (!wsEl.clear) continue; }
              const wsE = wsFr.W.clone().sub(wsEl.E).normalize(), wsU = wsEl.E.clone().sub(Sh).normalize(), wsRad = new THREE.Vector3().crossVectors(wsFr.n, wsFr.f).multiplyScalar(sg);
              const wsRe = wsRad.clone().addScaledVector(wsE, -wsRad.dot(wsE)).normalize(), wsNe = wsFr.n.clone().addScaledVector(wsE, -wsFr.n.dot(wsE)).normalize();
              const wsDev = Math.atan2(wsFr.f.dot(wsRe), wsFr.f.dot(wsE)) * DG, wsFlex = Math.atan2(wsFr.f.dot(wsNe), wsFr.f.dot(wsE)) * DG;
              const wsMed = new THREE.Vector3().crossVectors(wsU, wsE).normalize().multiplyScalar(sg), wsDn = wsU.clone().addScaledVector(wsE, -wsU.dot(wsE)).normalize();
              const wsTurn = Math.atan2(wsNe.dot(wsDn), wsNe.dot(wsMed)) * DG;
              const wsC = Math.max(0, Math.abs(wsDev) - 8) ** 2 + 2 * Math.max(0, Math.abs(wsTurn) - 85) ** 2 + Math.max(0, Math.abs(wsFlex) - 25) ** 2 + 0.01 * wsK * wsK;
              if (!wsPick || wsC < wsPick.c) wsPick = { c: wsC, fr: wsFr, el: wsEl, dev: wsDev, turn: wsTurn, flex: wsFlex, yaw: wsK * 4 }; }
            if (wsPick) { best.f = wsPick.fr.f; best.n = wsPick.fr.n; best.W = wsPick.fr.W; el = wsPick.el;
              best.solve = { yaw: wsPick.yaw, dev: +wsPick.dev.toFixed(1), turn: +wsPick.turn.toFixed(1), flex: +wsPick.flex.toFixed(1) }; } } }
        if (!el.clear) console.warn(P.key + ': his ' + S0 + ' arm finds no way clear of his body: laid turned out as far as was tried');
        const pdir = el.pdir, psiAt = el.psi;
        /* the fingers: his file's own at rest, each joint curled toward the palm about the hand's own across-axis,
           worked out once in the hand's own frame */
        /* (K.gather, v26.3: THE FINGERS TOGETHER. A hand at rest on a knee holds its fingers side by side; the brown
           hermit's file rests them apart, and laid from it his fingers stood 12 to 16 degrees apart, gaps a rake's:
           Chad, 13 Nov 2026, "You dont see the problem with the hands and fingers?". Each finger's first joint is turned
           about the palm's facing toward the middle finger's line, by `gather` of what it stands apart at rest) */
        let gat = null;
        if (K.gather) { const mh = bindWorldOf(P, a.hand); if (mh) { const rh = new THREE.Quaternion(); mh.decompose(new THREE.Vector3(), rh, new THREE.Vector3()); rh.invert();
          const dirOf = (fn) => { const b1 = bone(S0 + 'Hand' + fn + '1'), b2 = bone(S0 + 'Hand' + fn + '2'), m1 = b1 && bindWorldOf(P, b1), m2 = b2 && bindWorldOf(P, b2); if (!m1 || !m2) return null;
            const dd = new THREE.Vector3().setFromMatrixPosition(m2).sub(new THREE.Vector3().setFromMatrixPosition(m1)).applyQuaternion(rh); return Math.atan2(dd.dot(a.aL), dd.dot(a.fL)); };
          const tl = FINGERS.map(dirOf), tm = tl[1]; if (tm != null) gat = tl.map(t0 => t0 == null ? 0 : -K.gather * (t0 - tm));
          /* (K.converge: TOUCHING, NOT ONLY PARALLEL. Drawn together to his middle finger's line, his fingers lay side by
             side with a gap between each, being thinner than his knuckles are apart (photographed, v26.3, after the
             scan read them 0 to 2 degrees apart). A resting hand's fingers aim a little in, at a point some way before
             the middle knuckle, and touch: each finger's first joint is turned to aim at that point, K.converge metres
             before the middle knuckle along the middle finger's line) */
          if (K.converge && tm != null) { const kn = (fn) => { const b1 = bone(S0 + 'Hand' + fn + '1'), m1 = b1 && bindWorldOf(P, b1); return m1 ? new THREE.Vector3().setFromMatrixPosition(m1) : null; };
            const pm = kn('Middle'), ph0 = new THREE.Vector3().setFromMatrixPosition(mh); if (pm) {
              const toH = (w) => w.clone().sub(ph0).applyQuaternion(rh), pmH = toH(pm);
              const cH = pmH.clone().addScaledVector(a.fL, Math.cos(tm) * K.converge).addScaledVector(a.aL, Math.sin(tm) * K.converge);
              gat = FINGERS.map((fn, fi) => { const pk = kn(fn); if (!pk || tl[fi] == null) return 0; const dd = cH.clone().sub(toH(pk)); return Math.atan2(dd.dot(a.aL), dd.dot(a.fL)) - tl[fi]; }); } } } }
        /* (a finger's three turns at a curl of k times CURL: kept, so that K.drape can find each finger's own) */
        const fingerQs = (fi, k) => { const out = []; let rel = new THREE.Quaternion(); const ax = a.aL.clone();
          for (let j = 1; j <= 3; j++) { const b = bone(S0 + 'Hand' + FINGERS[fi] + j); if (!b) break; const q0 = bindLocal(P, b); if (!q0) break;
            /* (this joint's parent turned in the hand's frame is `rel`; the across-axis in that parent's frame) */
            /* (toward the palm is a turn the other way about the across-axis: armsOf's aL is the palm's facing crossed
               with the fingers' line, and a finger turned about the fingers' line crossed with the palm's facing goes
               toward the palm) */
            const axP = ax.clone().applyQuaternion(rel.clone().invert()).normalize(), ang = CURL[j - 1] * SPREAD[fi] * k;
            const qj = new THREE.Quaternion().setFromAxisAngle(axP, -ang);
            if (j === 1 && gat) qj.multiply(new THREE.Quaternion().setFromAxisAngle(a.nL, gat[fi]));
            qj.multiply(q0);
            out.push({ b, q: qj, fi }); rel = rel.multiply(qj); }
          return out; };
        const fing = []; for (let fi = 0; fi < FINGERS.length; fi++) fing.push(...fingerQs(fi, 1));
        /* (K.thumb 'bind', v26.7: THE THUMB AS HIS FILE RESTS IT. A take's thumb is posed for the hand it was made with,
           and a palm turned up carries it with the palm: the hermit in the pale yellow shawl's thumbs stood lifted 42
           degrees off his palms and turned across them, toward his little fingers, pointing up (measured; the reference
           picture's lie out beside the palm, barely lifted). His file's own rest has each thumb 26 degrees out from his
           index finger and 11 to 18 off the palm: laid so, joint by joint, while the rest is laid. Absent, the take's) */
        if (K.thumb === 'bind') for (let j = 1; j <= 3; j++) { const b = bone(S0 + 'HandThumb' + j), q0 = b && bindLocal(P, b); if (q0) fing.push({ b, q: q0, fi: -1 }); }
        R[sd] = { W: best.W, pdir, f: best.f, n: best.n, fing, fingerQs };
        /* (a hand of one piece is laid by its own measured axes: armsOf's, for a hand with no finger bones, is the
           forearm's line carried on) */
        if (!a.fingers) { const m = handAxes(P, A, sd); if (m) { R[sd].fL = m.fL; R[sd].nL = m.nL; R[sd].aL = m.aL; } }
        rep[sd] = { at: +best.t.toFixed(2), reach: +best.ratio.toFixed(3), turnedOut: +(psiAt * 180 / Math.PI).toFixed(0), palm: best.Cp.toArray().map(u => +u.toFixed(3)) }; if (best.solve) rep[sd].solve = best.solve; }
      P.restHands = { how: 'lap', R }; P.restRep = rep;
      /* (once laid, the elbow and the wrist's bend are read and reported: what a picture of it must agree with) */
      restHandsLay(P); P.group.updateMatrixWorld(true);
      /* (K.drape, v26.3: EACH FINGER CURLED UNTIL ITS TIP RESTS ON WHAT IS DRAWN OF HIS LAP, r over it: a palm on top of a
         knee has its fingers curving down over the kneecap's front, each as far as it reaches the cloth, no further and no
         less. Found finger by finger by halving, on the curl from 0.3 to `max` times CURL) */
      if (K.drape && !K.palmUp) { for (const sd in R) { const S0 = sd === 'L' ? 'Left' : 'Right', r = R[sd]; if (!r.fingerQs) continue; const kk = [];
          for (let fi = 0; fi < FINGERS.length; fi++) {
            const t4 = bone(S0 + 'Hand' + FINGERS[fi] + '4'), t3 = bone(S0 + 'Hand' + FINGERS[fi] + '3'); if (!t3) { kk.push(null); continue; }
            const tipAt = (out) => { if (t4) t4.getWorldPosition(out); else { t3.getWorldPosition(out); const e3 = t3.matrixWorld.elements; out.add(new THREE.Vector3(e3[4], e3[5], e3[6]).normalize().multiplyScalar(0.02)); } return P.group.worldToLocal(out); };
            const tryK = (kv) => { const qs = r.fingerQs(fi, kv); for (const F of qs) F.b.quaternion.copy(F.q); if (qs[0]) qs[0].b.updateWorldMatrix(false, true); const tp = tipAt(new THREE.Vector3()); return tp.y - top(tp.x, tp.z) - (K.drape.r != null ? K.drape.r : 0.008); };
            if (!isFinite(tryK(1))) { kk.push(null); for (const F of r.fing) if (F.fi === fi) F.b.quaternion.copy(F.q); continue; }
            let lo = K.drape.min != null ? K.drape.min : 0.3, hi = K.drape.max || 2, k = 1;
            for (let it = 0; it < 12; it++) { k = 0.5 * (lo + hi); const gk = tryK(k); if (!isFinite(gk)) break; if (gk > 0) lo = k; else hi = k; }
            kk.push(+k.toFixed(2)); r.fing = r.fing.filter(F => F.fi !== fi).concat(r.fingerQs(fi, k)); }
          rep[sd].drape = kk; }
        restHandsLay(P); P.group.updateMatrixWorld(true); }
      for (const sd in R) { const a = A[sd]; loc(a.up, _rhA); loc(a.fore, _rhB); loc(a.hand, _rhC);
        const fa = _rhC.clone().sub(_rhB).normalize(), bend = Math.acos(Math.max(-1, Math.min(1, fa.dot(R[sd].f)))) * 180 / Math.PI;
        rep[sd].elbow = _rhB.toArray().map(u => +u.toFixed(3)); rep[sd].elbowOut = +((Math.abs(_rhB.x) - Math.abs(_rhA.x))).toFixed(3); rep[sd].wristBend = +bend.toFixed(0); }
      armsBack(P); P.group.updateMatrixWorld(true); return rep;
    }
    /* AN ARM SOLVED AS AN ARM (v25.3's law; episode 4 chapter 2's armSolve, made for any rig whose hinge has been read):
       the elbow on the pole's side of the reach, the upper arm's line run to it with its hinge square to the arm's plane
       (so the shoulder rolls, as a shoulder does), and the forearm flexed about that hinge onto the wrist, its turn about
       its own line kept as the take has it. armTo (chapter 1's) turns each bone by the shortest arc, which bends an
       elbow sideways, out of its hinge: the monks' first rest */
    const _ahS = new THREE.Vector3(), _ahE = new THREE.Vector3(), _ahW = new THREE.Vector3(), _ahT = new THREE.Vector3(), _ahP = new THREE.Vector3(),
          _ahU = new THREE.Vector3(), _ahH = new THREE.Vector3(), _ahZ = new THREE.Vector3(), _ahV = new THREE.Vector3(), _ahZl = new THREE.Vector3(),
          _ahM = new THREE.Matrix4(), _ahM2 = new THREE.Matrix4(), _ahQ = new THREE.Quaternion(), _ahQp = new THREE.Quaternion();
    /* AN ELBOW'S HINGE read off the pose its arm stands in now (the takes on these rigs keep the forearm in one plane of the
       upper arm's frame: masters/v25.3/measure/hinge.cjs), as restHands reads it for the monks; kept on the arm. Read
       before anything is laid on the arm (v26.1, for the woman with the taper) */
    /* (v26.1: `hm`, a hinge MEASURED off another of the body's takes, in the upper arm's own frame. One who stands with her
       arms straight gives no hinge from her rest, and the guess put her elbow's crease 16 degrees off the one her own
       takes bend it about) */
    function hingeOf(a, sg, hm) {
      if (a.hinge) return a.hinge;
      const uL = a.fore.position.clone().normalize(), dL = a.hand.position.clone().normalize().applyQuaternion(a.fore.quaternion);
      const h = hm ? new THREE.Vector3().fromArray(hm) : new THREE.Vector3().crossVectors(uL, dL);
      if (hm) h.addScaledVector(uL, -h.dot(uL)); else if (h.length() < 0.08) h.set(0.8, 0, sg > 0 ? -0.6 : 0.6);
      h.normalize();
      const flex = Math.atan2(new THREE.Vector3().crossVectors(uL, dL).dot(h), uL.dot(dL));
      a.hinge = { uL, h, rest: new THREE.Quaternion().setFromAxisAngle(h, -flex).multiply(a.fore.quaternion) };
      return a.hinge;
    }
    /* (the class of v26.1's first taper: a point that is not a number never reaches a bone. Once NaN is written into an
       arm it stays there, for the take does not write it back, and the arm is not drawn; so it is refused, and said) */
    const armBad = new Set();
    function armHinge(a, target, pdir) {
      if (!(Number.isFinite(target.x + target.y + target.z) && Number.isFinite(pdir.x + pdir.y + pdir.z))) {
        if (!armBad.has(a)) { armBad.add(a); console.warn('armHinge: a target that is not a number, refused'); } return; }
      const G = a.hinge; if (!G) { armTo(a, target, _ahP.copy(target).add(pdir)); return; }
      a.up.updateWorldMatrix(true, true);
      a.up.getWorldPosition(_ahS); a.fore.getWorldPosition(_ahE); a.hand.getWorldPosition(_ahW);
      const la = _ahS.distanceTo(_ahE), lb = _ahE.distanceTo(_ahW);
      _ahT.copy(target).sub(_ahS); const d0 = _ahT.length(); if (d0 < 1e-5 || la < 1e-5 || lb < 1e-5) return;
      _ahT.divideScalar(d0); const d = THREE.MathUtils.clamp(d0, Math.abs(la - lb) + 1e-3, la + lb - 1e-3);
      _ahP.copy(pdir).addScaledVector(_ahT, -pdir.dot(_ahT)); if (_ahP.lengthSq() < 1e-10) return; _ahP.normalize();
      const ca = THREE.MathUtils.clamp((la * la + d * d - lb * lb) / (2 * la * d), -1, 1), sa = Math.sqrt(1 - ca * ca);
      _ahU.copy(_ahT).multiplyScalar(ca).addScaledVector(_ahP, sa);                       // the upper arm's line
      _ahH.crossVectors(_ahP, _ahT).normalize(); _ahZ.crossVectors(_ahU, _ahH);           // its hinge, flexion positive
      _ahV.copy(_ahT).multiplyScalar(d).addScaledVector(_ahU, -la).normalize();          // the forearm's line
      _ahZl.crossVectors(G.uL, G.h);
      _ahM.makeBasis(_ahU, _ahH, _ahZ); _ahM2.makeBasis(G.uL, G.h, _ahZl).transpose(); _ahM.multiply(_ahM2);
      _ahQ.setFromRotationMatrix(_ahM); a.up.parent.getWorldQuaternion(_ahQp); a.up.quaternion.copy(_ahQ.premultiply(_ahQp.invert()));
      a.up.updateWorldMatrix(false, true);
      a.fore.quaternion.setFromAxisAngle(G.h, Math.acos(THREE.MathUtils.clamp(_ahU.dot(_ahV), -1, 1))).multiply(G.rest);
      a.fore.updateWorldMatrix(false, true);
    }
    /* (every frame, after the take has posed him) */
    /* (laid while he RESTS, by the rest take's weight: v26.3, the brown hermit, whose films bless with his hands (handson,
       petals, palmover) out of the same rest. A body with one take, the monks, rests in it always) */
    const _rhT = new THREE.Quaternion();
    function restHandsLay(P) {
      const RH = P.restHands, A = RH ? armsOf(P) : null; if (!A) return;
      const rt = P.rest && P.rest.take; let share = rt && P.w[rt] != null ? Math.min(1, P.w[rt]) : 1;
      /* (v26.18: the takes a rest's hands stay laid through too. The hall's Grandmaster Pho talks with his hands in his lap:
         his talk is a bench's, and its left hand, which lay on his thigh there, hung in the air over his crossed legs) */
      if (RH.hold) for (const k in P.w) if (k !== rt && RH.hold.test(k)) share = Math.min(1, share + P.w[k]);
      /* (v26.18: hands laid for one take only (a kneel), whatever the person's rest is: kneelHands) */
      if (RH.only) { share = 0; for (const k in P.w) if (RH.only.test(k)) share += P.w[k]; share = Math.min(1, share); }
      if (!(share > 0.001)) return;
      P.group.updateWorldMatrix(true, true); P.group.getWorldQuaternion(_rhQ);
      for (const sd in RH.R) { const a = A[sd], r = RH.R[sd];
        if (!a.wrote) { a.qUp.copy(a.up.quaternion); a.qFore.copy(a.fore.quaternion); a.qHand.copy(a.hand.quaternion); a.wrote = true; }
        _rhA.copy(r.W); P.group.localToWorld(_rhA); _rhB.copy(r.pdir).applyQuaternion(_rhQ);
        armHinge(a, _rhA, _rhB);
        _rhC.copy(r.f).applyQuaternion(_rhQ); _rhD.copy(r.n).applyQuaternion(_rhQ);
        _ha.crossVectors(_rhD, _rhC); _hm.makeBasis(_ha, _rhD, _rhC); _hm2.makeBasis(r.aL || a.aL, r.nL || a.nL, r.fL || a.fL).transpose(); _hm.multiply(_hm2); _hq.setFromRotationMatrix(_hm);
        a.hand.parent.getWorldQuaternion(_hq2); a.hand.quaternion.copy(_hq2.invert().multiply(_hq)); a.hand.updateWorldMatrix(false, true);
        if (r.fing.length) { if (!a.fing) a.fing = []; if (!a.curled) { a.fingRest = NOGARB ? restList(a, 'frR', r.fing, 1) : r.fing.map(F => ({ b: F.b, q: F.b.quaternion.clone(), i: 1 })); a.curled = true; }
          for (const F of r.fing) F.b.quaternion.copy(F.q); }
        /* (part of the way, while a gesture fades in or out: each turn eased from the take's own) */
        if (share < 0.999) { if (NOGARB) { _rhT.copy(a.up.quaternion); a.up.quaternion.copy(a.qUp).slerp(_rhT, share);
            _rhT.copy(a.fore.quaternion); a.fore.quaternion.copy(a.qFore).slerp(_rhT, share);
            _rhT.copy(a.hand.quaternion); a.hand.quaternion.copy(a.qHand).slerp(_rhT, share); }
          else for (const [b, q0] of [[a.up, a.qUp], [a.fore, a.qFore], [a.hand, a.qHand]]) { _rhT.copy(b.quaternion); b.quaternion.copy(q0).slerp(_rhT, share); }
          if (a.fingRest) for (const F of a.fingRest) { _rhT.copy(F.b.quaternion); F.b.quaternion.copy(F.q).slerp(_rhT, share); }
          a.up.updateWorldMatrix(false, true); }
        /* (v26.18: bones that carry cloth hanging from this arm, and are its upper arm's brothers (his sleeve's drape), are
           given the turn the laying gave the upper arm: left as the take had them, the sleeve stood where the take's arm
           was and the laid arm came through it) */
        if (r.fol) { _rhT.copy(a.qUp).invert().premultiply(a.up.quaternion);
          for (const F of r.fol) { if (!F.on) { F.q.copy(F.b.quaternion); F.on = true; } F.b.quaternion.copy(F.q).premultiply(_rhT); } } }
    }
    /* THE HANDS HELD TRUE (v26.3: Chad, 13 Nov 2026, "You dont see the problem with the hands and fingers?", and of my
       answer, "Stop pretending you know what is the problem"). MEASURED on every person (tools/probes/jointscan.mjs),
       two faults that no real hand makes:
       1. FINGERS BENT SIDEWAYS at their middle and end joints, which are hinges (the brown hermit's grip in v26.2: 54 to
          70 degrees; the hermit in white, the master in white and two of the crowd's bodies in their takes, 30 to 50):
          a take made on another body and carried over by turns puts a finger's bend into a joint whose rest stands
          differently. Each such joint keeps only its turn about its own hinge (the knuckles' line as the body stands at
          rest, in the joint's parent's frame), and never bends backward past HT.back.
       2. A HAND WRUNG ROUND ON ITS FOREARM (my lap rest for the brown hermit: 77 and 111 degrees; the seated takes, 50 to
          64): a rig with no twist bones carries the forearm's whole turn at the wrist, and the skin there twists like a
          sweet's wrapper (the taper woman's, v26.3's first fix of her arm). A forearm turns along its length, so HT.roll of
          the hand's turn about the forearm's line beyond HT.free is laid on the forearm, about its own line, and the hand
          turned back by as much: the hand stays exactly where and as it was.
       3. A FINGER ROLLED ON ITS OWN LINE at its knuckle, which no finger does more than a few degrees: what a take
          carried over by turns leaves there turns the whole finger's bend aside. Its knuckle keeps its bend and its
          spread, and loses the roll.
       Laid last of a body's lays, on every body drawn and on a crowd's drivers (whose bones its members wear; a first
       pass laid it on the near skins only, and the joint scan, which reads every body from wherever it stands, read the
       far ones unmended), and taken off before the mixer runs again (armsBack: the v11.5 law). A body whose
       arm is laid after the people's own tick (the taper woman's, taperTick) says so (P.htLate) and is held true there,
       after it: laid under that lay, the wrist's share would be saved as that lay's rest and laid again every frame */
    const HT = { free: 25 * Math.PI / 180, roll: 0.5, back: -5 * Math.PI / 180 };
    const _htQ = new THREE.Quaternion(), _htQ2 = new THREE.Quaternion();
    function bindWorldOf(P, b) { for (const sm of P.lv[1] || []) { const i = sm.skeleton.bones.indexOf(b); if (i >= 0) return new THREE.Matrix4().copy(sm.skeleton.boneInverses[i]).invert(); } return null; }
    function handsTrueInit(P) {
      P.ht = null; const out = { J: [], W: [], K: [], on: false };
      const bone = (nm) => { const re = new RegExp('^(mixamorig:?)?' + nm + '$'); for (const n in P.bone) if (re.test(n)) return P.bone[n]; return null; };
      for (const [S0, side] of [['Left', 1], ['Right', -1]]) {
        const hand = bone(S0 + 'Hand'), fore = bone(S0 + 'ForeArm'); if (!hand || !fore) continue;
        /* (the wrist: the forearm's line in its own frame, and the hand's turn in it at rest) */
        const qh0 = bindLocal(P, hand);
        if (qh0 && hand.parent === fore && hand.position.lengthSq() > 1e-10) out.W.push({ fore, hand, qh0, ax: hand.position.clone().normalize(), sf: new THREE.Quaternion(), sh: new THREE.Quaternion(), on: false });
        /* (the fingers: the knuckles' line and the palm's facing at rest, in the bind's world) */
        const at = (n) => { const b = bone(S0 + 'Hand' + n), m = b ? bindWorldOf(P, b) : null; return m ? new THREE.Vector3().setFromMatrixPosition(m) : null; };
        const pI = at('Index1'), pM = at('Middle1'), pK = at('Pinky1') || at('Ring1'), mh = bindWorldOf(P, hand); if (!pI || !pM || !pK || !mh) continue;
        const ph = new THREE.Vector3().setFromMatrixPosition(mh), f = pM.clone().sub(ph).normalize(), kl = pI.clone().sub(pK); kl.addScaledVector(f, -kl.dot(f)).normalize();
        const nrm = new THREE.Vector3().crossVectors(f, kl).multiplyScalar(side).normalize();
        for (const fn of ['Index', 'Middle', 'Ring', 'Pinky']) {
          const k1 = bone(S0 + 'Hand' + fn + '1'), k2 = bone(S0 + 'Hand' + fn + '2'), q1 = k1 && bindLocal(P, k1);
          if (k1 && k2 && q1 && k2.parent === k1 && k2.position.lengthSq() > 1e-12) out.K.push({ b: k1, q0: q1, ax: k2.position.clone().normalize(), sv: new THREE.Quaternion(), on: false }); }
        for (const fn of ['Index', 'Middle', 'Ring', 'Pinky']) for (let j = 2; j <= 3; j++) {
          const b = bone(S0 + 'Hand' + fn + j); if (!b || !b.parent) continue;
          const q0 = bindLocal(P, b), mp = bindWorldOf(P, b.parent); if (!q0 || !mp) continue;
          const rp = new THREE.Quaternion(); mp.decompose(new THREE.Vector3(), rp, new THREE.Vector3()); rp.invert();
          const u = b.position.clone(); if (u.lengthSq() < 1e-12) continue; u.normalize();
          const ax = kl.clone().applyQuaternion(rp); ax.addScaledVector(u, -ax.dot(u)); if (ax.lengthSq() < 1e-8) continue; ax.normalize();
          /* (which way about it closes the finger: its next bone turned a little about it, against the palm's facing) */
          const ch = b.children.find(x => x.isBone), c = (ch && ch.position.lengthSq() > 1e-12 ? ch.position.clone() : new THREE.Vector3(0, 1, 0)).normalize().applyQuaternion(q0);
          const np = nrm.clone().applyQuaternion(rp), sg = Math.sign(new THREE.Vector3().crossVectors(ax, c).dot(np)) || 1;
          out.J.push({ b, q0, ax, sg, max: (j === 2 ? 115 : 95) * Math.PI / 180, sv: new THREE.Quaternion(), on: false }); }
      }
      if (out.J.length || out.W.length || out.K.length) P.ht = out;
    }
    function handsTrue(P) {
      if (P.ht === undefined) handsTrueInit(P);
      const H = P.ht; if (!H || H.on) return;
      H.on = true;
      /* 0. each knuckle: its turn from the rest with its roll about the finger's own line taken out (swing kept) */
      for (const R of H.K) { const b = R.b; R.sv.copy(b.quaternion); R.on = true;
        _htQ.copy(R.q0).invert().multiply(b.quaternion);                                         // (its turn from the rest, in its own frame)
        const d = _htQ.x * R.ax.x + _htQ.y * R.ax.y + _htQ.z * R.ax.z, tl = Math.hypot(d, _htQ.w); if (!(tl > 1e-9)) continue;
        _htQ2.set(R.ax.x * d / tl, R.ax.y * d / tl, R.ax.z * d / tl, _htQ.w / tl);                // (the roll)
        b.quaternion.copy(R.q0).multiply(_htQ.multiply(_htQ2.invert())); }
      /* 1. each finger's middle and end joint: only its turn about its own hinge, from the rest */
      for (const R of H.J) { const b = R.b; R.sv.copy(b.quaternion); R.on = true;
        _htQ.copy(R.q0).invert(); _htQ2.copy(b.quaternion).multiply(_htQ);                       // (its turn from the rest, in its parent's frame)
        const d = _htQ2.x * R.ax.x + _htQ2.y * R.ax.y + _htQ2.z * R.ax.z;
        let ang = 2 * Math.atan2(d, _htQ2.w); if (ang > Math.PI) ang -= 2 * Math.PI; if (ang < -Math.PI) ang += 2 * Math.PI;
        const fl = Math.max(HT.back, Math.min(R.max, ang * R.sg));
        b.quaternion.setFromAxisAngle(R.ax, fl * R.sg).multiply(R.q0); }
      /* 2. the hand's turn about the forearm's line, shared with the forearm */
      for (const R of H.W) { R.sf.copy(R.fore.quaternion); R.sh.copy(R.hand.quaternion); R.on = true;
        _htQ.copy(R.qh0).invert(); _htQ2.copy(R.hand.quaternion).multiply(_htQ);                // (the hand's turn from its rest, in the forearm's frame)
        const d = _htQ2.x * R.ax.x + _htQ2.y * R.ax.y + _htQ2.z * R.ax.z;
        let tw = 2 * Math.atan2(d, _htQ2.w); if (tw > Math.PI) tw -= 2 * Math.PI; if (tw < -Math.PI) tw += 2 * Math.PI;
        if (Math.abs(tw) <= HT.free) continue;
        const mv = HT.roll * tw;
        _htQ.setFromAxisAngle(R.ax, mv); R.fore.quaternion.multiply(_htQ);
        _htQ.setFromAxisAngle(R.ax, -mv); R.hand.quaternion.premultiply(_htQ); }
    }
    /* the middle of a person's two hands, in the world (what a raised bowl is stood on) */
    const HANDS = { L: /^(mixamorig:?)?LeftHand$/, R: /^(mixamorig:?)?RightHand$/ };
    function handsMid(P, out) {
      if (!P || !P.ready) return null;
      if (!P.handL) for (const n in P.bone) { if (HANDS.L.test(n)) P.handL = P.bone[n]; if (HANDS.R.test(n)) P.handR = P.bone[n]; }
      if (!P.handL || !P.handR) return null;
      P.group.updateWorldMatrix(true, true);
      P.handL.getWorldPosition(out); P.handR.getWorldPosition(_lkv); return out.add(_lkv).multiplyScalar(0.5);
    }
    /* where a take would hold a person's hands at one of its moments, in the person's own frame (measured, then the
       take the person wears is put back): a body is stood where two pairs of hands can meet on one bowl */
    function handsAt(P, name, t, out, sd) {
      if (!P || !P.ready || !P.acts[name]) return null;
      armsBack(P);
      const keep = {}; for (const k in P.acts) { keep[k] = [P.acts[k].getEffectiveWeight(), P.acts[k].time]; P.acts[k].setEffectiveWeight(k === name ? 1 : 0); }
      const w0 = Object.assign({}, P.w); for (const k in P.w) P.w[k] = k === name ? 1 : 0;
      P.acts[name].time = t; personSettle(P); P.mixer.update(0);
      const ok = handsMid(P, out); if (ok && sd) (sd === 'L' ? P.handL : P.handR).getWorldPosition(out);      // (sd: that one hand, not the middle of the two)
      if (ok) P.group.worldToLocal(out);
      for (const k in P.acts) { P.acts[k].setEffectiveWeight(keep[k][0]); P.acts[k].time = keep[k][1]; }
      Object.assign(P.w, w0); personSettle(P); P.mixer.update(0);
      return ok ? out : null;
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
    /* (v26.8: A LEVEL BY THE SIZE ON THE SCREEN. A level was chosen by the distance from the lens alone, so a film's narrow
       lens drew a man far off as big as one beside him and gave him the far man's body: the brown hermit, 2.3 m from the
       lens at the festival's bai sri through a 26 to 45 degree lens, as big on the screen as a man 0.7 to 1.3 m away in
       play's 72, drawn from his 30,000 triangles where his full model is made for that (Chad: "look at how bad and blocky
       the arms look , are these the full res models?"). The distance is now read through the lens: times the lens's
       half-height against play's. Play's own lens reads exactly as before) */
    const LENS0 = Math.tan(72 * Math.PI / 360);
    function peopleLevels(cam = camera) {
      cam.getWorldPosition(_lens);
      const lk = Math.tan((cam.fov || 72) * Math.PI / 360) / LENS0;
      for (const P of people) { if (!P.ready || P.driver) { if (P.driver && P.ready && P.lvShown !== -2) { for (let i = 0; i < 4; i++) if (P.lv[i]) for (const m of P.lv[i]) m.visible = false; P.lvShown = -2; } continue; }
        if (!P.group.visible) continue;
        /* (o.lodK: a child is two thirds of a grown body's height, and is drawn at each level two thirds as far) */
        const g = P.group.position, d = lk * Math.hypot(g.x - _lens.x, g.y + 1.0 - _lens.y, g.z - _lens.z) / (P.o.lodK || 1);
        showLevel(P, P.force != null ? P.force : levelFor(P.lvNow < 0 ? 3 : P.lvNow, d, P.lv[0] ? 0 : 1)); }
      for (const M0 of crowd) { if (!M0.group.visible || !M0.D.ready) continue;
        const g = M0.group.position, d = lk * Math.hypot(g.x - _lens.x, g.y + 0.8 - _lens.y, g.z - _lens.z);
        showLevel(M0, levelFor(M0.lvNow < 0 ? 3 : M0.lvNow, d, 1)); }
    }

    /* THE CAST OF DAY ONE AND DAY TWO. Who they are is the plan's §3.3. Each stands or sits where the photographs put
       their kind: the masters under their tents on the west side, the monks under the east one, Grandmaster Pho under the
       gold. (The crowd, the dancers and those who go up are placed by the play and the films.) */
    /* ================================================================ HER FLAT'S THINGS (M5; the build sheet's 30 things)
       Every one a real model (a checked picture on white, Meshy at its highest and its own remesh, tools/prepmeshy.mjs:
       masters/v27.0/props/TABLE.txt), prepped in real metres with its origin on its base's middle and its front along +z,
       so a place here is a place and `ry` turns its front. A thing stands only once its file has landed (stand() leaves an
       empty group until then); its collision is a column from the floor, its FOOTPRINT the model's own extent as measured
       in its file (18 Nov: `w`, `d` below, before its turn), so the blockers stand before the model does (v24.0: they must
       be in the array before build() returns).
       The living room: her altar on the far wall facing the door; her chair before it, Grandmaster Pho's stool at her
       right and his bowl at its foot; the sofa under the corridor window looking into the room; the TV on the left wall;
       the coffee table, an armchair, a standing fan. Her room behind its folded partition: her bed with its rail, the
       commode. The dining room: the table with her hospital folder, the display cabinet. The kitchen: the fridge, the
       laundry out of the window. Outside: the gate, the shoe rack, a tulsi in its pot, the mango leaves over the door.
       A thing whose height a place depends on is placed by its measured size: a ceiling's fan and tube HANG from it (their
       origin is their lowest point, so each stands its own height under the ceiling), the dining table is drawn at a dining
       table's 0.75 m (its file's 0.571 is a squat generation: its height scaled, nothing else), and what lies on a table
       lies on that table's measured top. */
    const TOP = { coffee: 0.444, dintable: 0.75 };            // the coffee table's top (its file), the dining table's (drawn)
    /* HOW EACH THING TAKES THE LIGHT (18 Nov, photographed: the altar's shelves drew WHITE). A generator paints every
       model as a metal-roughness sheet whose roughness runs down to 0, and stand() lifts the reflections of anything
       with a metal sheet three-fold (bronzeLift: for brass and gold); a varnished shelf a little below the eye, seen at a
       grazing angle, then mirrors the room's light whole. So a thing that is not metal is drawn as what it is: its metal
       sheet dropped (a non-metal), its roughness one even finish (varnished timber 0.55, painted or plastic 0.5, cloth
       and paper 0.85), reflections at their plain strength (the house's way for a generated piece: chapter 3's hall,
       b_world2.js); the metal ones keep their sheets, the brass at the full lift, the painted steel at half.
       (Measured from the files' own sheets, 18 Nov: the brass lamp's and the bowls' metal 0.7 to 0.9; the wheelchair's,
       the tubes', the rack's and the gate's 0.16 to 0.46; every piece of furniture under 0.05.) */
    const MATTE = { wood: 0.55, paint: 0.5, cloth: 0.85 };
    const matte = (r) => (m) => m.traverse(q => { if (!q.isMesh) return; for (const mt of [].concat(q.material)) {
      mt.metalnessMap = null; mt.metalness = 0; mt.roughnessMap = null; mt.roughness = r; mt.envMapIntensity = 1; mt.needsUpdate = true; } });
    const LOOK = {
      /* (18 Nov, photographed: her shrine's shelves drew pale at the eye's grazing angle even matte at 0.55: its varnish
         is a softer one, its reflection halved) */
      w4prayershelf: { done: (m) => { matte(0.78)(m); m.traverse(q => { if (q.isMesh) for (const mt of [].concat(q.material)) mt.envMapIntensity = 0.5; }); } }, w4frameport: { done: matte(MATTE.wood) }, w4sofa: { done: matte(MATTE.cloth) },
      w4armchair: { done: matte(MATTE.cloth) }, w4coffee: { done: matte(MATTE.wood) }, w4tvconsole: { done: matte(MATTE.wood) },
      w4cabinet: { done: matte(MATTE.wood) }, w4dintable: { done: matte(MATTE.wood) }, w4dinechair: { done: matte(MATTE.wood) },
      w4folder: { done: matte(MATTE.cloth) }, w4fridge: { done: matte(MATTE.paint) }, w4stool: { done: matte(MATTE.paint) },
      w4hugger: { done: matte(MATTE.paint) }, w4tulsi: { done: matte(MATTE.cloth) }, w4clock: { done: matte(MATTE.paint) },
      w4phonetable: { done: matte(MATTE.wood) }, w4bed: { done: matte(MATTE.cloth) }, w4commode: { done: matte(MATTE.paint) },
      w4garland: { done: matte(MATTE.cloth) }, w4thoranam: { done: matte(MATTE.cloth) }, w4poles: { done: matte(MATTE.cloth) },
      w4doorleaf: { done: matte(MATTE.wood) },
      w4wheelchair: { lift: 1.5 }, w4gate: { lift: 1.5 }, w4shoerack: { lift: 1.5 }, w4standfan: { lift: 1.5 },
      w4tubelight: { lift: 1.5 }, w4pilltray: { lift: 1.5 }
      /* (the brass: w4vilakku, w4bigbowl, w4waterbowl, w4altartray, at stand()'s own lift of 3) */
    };
    const DINE_SY = 0.75 / 0.571;                             // the dining table's height drawn: 0.75 m from its file's 0.571
    const PROPS = [
      // key            x       y      z      ry               foot [w, d] (the file's own extent)   (what)
      ['w4wheelchair', CHAIR.x, 0, CHAIR.z, CHAIR.ry,          [0.65, 1.00]],   // her chair, facing her altar
      ['w4stool',      STOOL.x, 0, STOOL.z, -0.4,             [0.40, 0.39]],   // Grandmaster Pho's, at her left (+x: she faces +z)
      ['w4bigbowl',    BOWL.x, 0, BOWL.z, 0,                  [0.33, 0.33]],   // his bowl on the floor: he dips here
      // her altar: a wall-mounted cabinet (the research's "floating unit", [32]), its back on the wall, its base at 1.15
      ['w4prayershelf', ALTAR.x, 1.15, ROOMS.living.z1 - 0.226 - 0.004, Math.PI, null],
      /* (18 Nov, measured and photographed: the tray is a whole puja set on a plate, 0.25 m across and 0.15 high, its bell,
         its small lamp, its kalasam pot, its camphor holder and its incense: the tall kuthu vilakku stands beside it on the
         floor, not on it, where it was set sunk 11 cm into the pot) */
      ['w4altartray',  ALTAR.x - 0.30, 0, ALTAR.z - 0.36, Math.PI, null],      // her puja tray before the altar, on the floor
      ['w4vilakku',    VILAKKU.x, 0, VILAKKU.z, 0,             null],         // the kuthu vilakku at the shrine's right end (Mala kneels to light it)
      // Appa's photograph on the wall at the altar's right (its back on the wall), and its garland
      ['w4frameport',  0.62, 1.30, ROOMS.living.z1 - 0.011 - 0.004, Math.PI, null],
      /* (the garland is a V of jasmine and marigold 0.45 wide and 0.54 tall, its two ends at its top: hung at the frame's
         top corners, 1.71 up, before its glass, its tassel below the frame) */
      ['w4garland',    0.62, 1.71 - 0.542, ROOMS.living.z1 - 0.004 - 0.022 - 0.035 - 0.002, Math.PI, null],
      // the sofa under the corridor window, its back to the front wall; the coffee table before it; the armchair at the
      // room's right, facing the TV across it; a standing fan between them
      ['w4sofa',       1.72, 0, FL.face + 0.456 + 0.01, 0,     [1.90, 0.91]],
      ['w4coffee',     1.72, 0, 1.70, 0,                      [1.10, 0.77]],
      ['w4pilltray',   1.95, TOP.coffee, 1.70, 0.3,           null],           // her medicine tray on the coffee table
      ['w4armchair',   2.17, 0, 2.78, -Math.PI / 2,           [0.85, 1.26]],
      ['w4standfan',   2.50, 0, 1.55, -2.4,                   [0.57, 0.45]],
      // the TV on the left wall facing into the room, between the main door's open leaf and bedroom 3's door
      ['w4tvconsole',  ROOMS.living.x0 + 0.25 + 0.005, 0, 1.92, Math.PI / 2, [1.50, 0.50]],
      ['w4clock',      ROOMS.living.x0 + 0.02, 2.05, 1.92, Math.PI / 2, null],
      // the ceilings': a hugger fan over the living room and one in her room (turned in the frame), and the tubes
      ['w4hugger',     1.0, FL.ceil - 0.222 - 0.004, 2.40, 0, null],
      ['w4hugger',     4.7, FL.ceil - 0.222 - 0.004, 1.80, 0, null],
      ['w4tubelight',  0.2, FL.ceil - 0.109 - 0.003, 3.60, 0, null],           // the tube that dies in the blessing
      ['w4tubelight',  4.85, FL.ceil - 0.109 - 0.003, 6.65, Math.PI / 2, null], // the dining room's
      ['w4phonetable', 4.45, 0, ROOMS.passage.z0 + 0.12 + 0.20, 0, [0.50, 0.38]], // in the passage, against her room's back wall
      // her room
      ['w4bed',        5.95, 0, 1.75, -Math.PI / 2,           [1.00, 2.00]],
      ['w4commode',    4.95, 0, 0.75, 0.2,                    [0.55, 0.55]],
      // the dining room and the kitchen
      ['w4cabinet',    ROOMS.dining.x0 + 0.28 + 0.005, 0, 6.15, Math.PI / 2, [0.86, 0.56]],
      ['w4dintable',   4.85, 0, 6.65, Math.PI / 2,            [1.20, 0.85]],
      ['w4dinechair',  4.22, 0, 6.35, Math.PI / 2,            [0.48, 0.64]],
      ['w4dinechair',  4.22, 0, 6.95, Math.PI / 2,            [0.48, 0.64]],
      ['w4dinechair',  5.48, 0, 6.35, -Math.PI / 2,           [0.48, 0.64]],
      ['w4dinechair',  5.48, 0, 6.95, -Math.PI / 2,           [0.48, 0.64]],
      ['w4folder',     4.80, TOP.dintable + 0.001, 6.40, 0.25, null],          // her hospital letters, on the table
      ['w4fridge',     ROOMS.dining.x1 - 0.382 - 0.01, 0, 8.70, -Math.PI / 2, [0.76, 0.76]],
      ['w4poles',      5.55, 1.15, FL.z1 + 0.55, 0,           null],           // the laundry out of the kitchen window
      // outside her door: the gate on the facade's face, the mango leaves over the door, the shoe rack, the tulsi
      ['w4gate',       0, FL.corr, -0.051 - 0.006, 0,         null],
      /* (the thoranam's rope is 0.245 up its file, its leaves hanging from it: tied across the doorway's head, 2.09 up, at
         its outer edge inside the gate, the leaves over the top of the door) */
      ['w4thoranam',   0, 2.09 - 0.245, 0.05, 0,              null],
      ['w4shoerack',   -1.55, FL.corr, -0.193 - 0.012, Math.PI, null],
      ['w4tulsi',      1.35, FL.corr, -1.45, 0,               null]
    ];
    const things = {};
    for (const [key, x, y, z, ry, foot] of PROPS) {
      const g = stand(key, x, y, z, ry, LOOK[key] || {});
      if (key === 'w4dintable') g.scale.y = DINE_SY;
      (things[key] = things[key] || []).push(g);
      /* (the footprint as a column, turned with the thing: blockers() takes its box in the world, which holds it whole) */
      if (foot) solidBox(foot[0], 1.2, foot[1], x, 0.6, z, ry);
    }

    /* THE PICTURES IN THEIR FRAMES (masters/v27.0/SOURCES.md). The portrait frame's picture is a flat face 4.7 mm before its
       back with its opening's middle 0.20 m up, measured on the model (tools/probes/planez.mjs: its inner corners at z
       0.004 to 0.005); a picture is laid 1.2 mm before it, whole at its own aspect inside the opening's 0.295 m height.
       Lit as the room is (the lamp alone lights it in the dark), never unlit. Until a picture lands its plane is hidden:
       the frame shows its own blank mount */
    function picLoad(key) {
      if (!have(key)) { waiting.add(key); return Promise.resolve(null); }
      return loadImageTexture(key, 'image/jpeg').then(t => { if (!t || !alive) return null; madeTex.push(t);
        t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping; t.repeat.set(1, -1); t.offset.set(0, 1); t.needsUpdate = true; return t; }).catch(() => null);
    }
    /* (18 Nov, photographed: laid at 6.2 mm, the frame's own mount, which is not flat (its points 1.6 to 7.5 mm), stood
       over the top of the photograph in a pale band: laid at 8.5 mm, under the frame's lip at 9 to 10.6) */
    const PIC = { y: 0.20, z: 0.0085, h: 0.295 };
    const pics = {};
    function picIn(g, key, s = 1, P = PIC) {
      const m = M({ color: 0xffffff, roughness: 0.55, metalness: 0 });
      const pl = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), m); pl.visible = false; owned.push(pl.geometry);
      pl.position.set(0, P.y * s, P.z * s); if (P.rx) pl.rotation.x = P.rx; g.add(pl); pics[key] = pl;
      picLoad(key).then(t => { if (!t) return; const im = t.image, a = im && im.width ? im.width / im.height : 0.72;
        m.map = t; m.needsUpdate = true; pl.scale.set(P.h * s * a, P.h * s, 1); pl.visible = true; });
      return pl;
    }
    /* Appa's photograph in its frame on the wall */
    for (const g of things.w4frameport || []) picIn(g, 'w4t_appa');
    /* HER OLD PHOTOGRAPH (the plan's source 4: "a young woman in a yellow sari, eyes wide, a crowd round her, a temple's
       festival"): the small standing frame on the display cabinet's middle shelf, behind its glass, turned a little to
       the passage he comes in by; the picture laid in it (measured on the frame, tools/probes/planez.mjs: its card at z
       0.032 to 0.033, its opening 0.219 by 0.165 about 0.100 up; the picture 1.5 mm before the card, under the lip at 0.038).
       The cabinet's shelf is 1.06 m up its file (tools/probes/surfaces.mjs), its depth -0.20 to 0.24 */
    /* (18 Nov, photographed from where he stands: laid on the card the picture was under the frame's own glass, which the
       generator painted grey, and the cabinet's brass pot stood before the frame: the picture now lies before the glass,
       under the lip's edge, and the frame stands at the shelf's front, the pot behind it) */
    /* (18 Nov, photographed again on the live build: only the picture's top fifth showed. The glass is not upright: it
       leans back, its front at z 0.049 at the opening's foot and 0.035 at its head (tools/probes/frontz.mjs, the front-most
       surface over the opening; planez sees only points, and the glass is two big triangles), so an upright picture at
       0.040 stood behind it below 0.16 m. The picture is laid on the glass, 2 mm before it and leaning with it) */
    /* (18 Nov, photographed on build 21h: its left side ran a slant through the picture. The frame stood 4 cm into the
       cabinet's middle post (its local x -0.04 to 0.04, front at 0.26) and over the blue bowl in the right bay
       (tools/probes/propfit.mjs: 1,398 of its points inside the cabinet, 14 of 63 of the picture's inside the post). The
       right bay's middle shelf is clear from the bowl's edge (its x 0.19) to the stile (0.33), 14 cm: the frame drawn at
       0.6 (15 by 12 cm, a small standing frame; the picture 13 by 10) stands there, a little turned to the passage, its
       base on the shelf's top (1.068). Measured: nothing of it inside the cabinet but its base resting on the shelf,
       and the picture seen whole from the room) */
    const PIC_SMALL = { y: 0.100, z: 0.0442, h: 0.162, rx: -0.0848 }, FRAME_S = 0.6;
    const CAB = { x: ROOMS.dining.x0 + 0.28 + 0.005, z: 6.15 };
    const oldFrame = stand('w4framesmall', CAB.x + 0.17, 1.068, CAB.z - 0.259, Math.PI / 2 + 0.10, { lift: 1.5, s: FRAME_S });
    picIn(oldFrame, 'w4t_oldphoto', FRAME_S, PIC_SMALL);
    things.oldFrame = [oldFrame];
    /* HER SHRINE'S THREE: Kali in the middle, Ganesha at her left as one stands before it, Murugan at her right; each in
       the portrait frame drawn small, standing on the shrine's middle shelf and leaning back on its back panel (measured
       on the shrine: the shelf's top 0.335 up its file, the panel's face 0.19 behind its middle; the shrine is turned to
       the room, so its own +x is the room's -x: the right of one who faces it) */
    const SHRINE = { shelf: 0.337, back: -0.181, lean: 0.10 };
    if (things.w4prayershelf && things.w4prayershelf[0]) {
      const sh = things.w4prayershelf[0];
      for (const [key, x, s] of [['w4t_kali', 0, 0.62], ['w4t_ganesha', -0.19, 0.48], ['w4t_murugan', 0.19, 0.48]]) {
        const f = stand('w4frameport', x, SHRINE.shelf, SHRINE.back + 0.011 * s + 0.02, 0, { parent: sh, s, ...LOOK.w4frameport });
        f.rotation.x = -SHRINE.lean;
        picIn(f, key, s);
        (things.shrinePics = things.shrinePics || []).push(f);
      }
    }

    /* THE DOORS: every doorway's leaf is the one door model (a flush door of varnished timber, its lever and hinges),
       drawn to its doorway's width; her main door stands open into the room on its hinge, bedroom 3's a hand's width.
       Until the model lands (and if it never does) a plain veneer leaf stands in each doorway, so no shut room is ever
       seen through: hidden the moment the model is in (v4.7: a stand-in that hides on landing) */
    const DOOR_W = 0.938, DOOR_H = 2.10;                      // the model's own leaf (its file's extent)
    const doorLeaves = [], doorStandIns = [];
    function door(w, hinge, ry, open, at) {
      /* `hinge` [x, z]: the leaf turns about it; `ry`: the leaf's turn when SHUT (its face along the wall); `open`: how far
         it is turned from shut (radians, into the room); `at`: the leaf's middle from its hinge when shut (-w/2 or +w/2 along
         its own x) */
      const pivot = new THREE.Group(); pivot.position.set(hinge[0], 0, hinge[1]); pivot.rotation.y = ry + open; world.add(pivot);
      const leaf = stand('w4doorleaf', at, 0, 0, 0, { parent: pivot, ...LOOK.w4doorleaf });
      leaf.scale.set((w - 0.02) / DOOR_W, 2.06 / DOOR_H, 1);
      const si = new THREE.Mesh(new THREE.BoxGeometry(w - 0.02, 2.06, 0.04), mVeneer);
      si.position.set(at, 1.03, 0); si.visible = !have('w4doorleaf'); pivot.add(si); owned.push(si.geometry);
      doorLeaves.push({ pivot, leaf, shut: ry, open }); doorStandIns.push(si);
      return pivot;
    }
    const R2 = ROOMS;
    /* her main door: hinged at the doorway's right (x 0.50), standing open a quarter turn into the room; its middle to the
       -x of its hinge, so the model's own hinged edge (its +x) is the one on the pivot; and a column where it stands */
    /* (18 Nov, photographed from the corridor: the model's hinged edge is ragged, a strip the generator tore; its pivot
       stands inside the jamb and the wall's thickness, so that end of the leaf is in the wall and the leaf comes out of
       it at the wall's face) */
    door(1.0, [DOOR_MAIN.x1 + 0.03, FL.face - 0.08], 0, Math.PI / 2, -0.5);
    solidBox(0.06, 2.1, 1.0, DOOR_MAIN.x1 + 0.03, 1.05, FL.face - 0.08 + 0.5);
    /* her grille gate, shut behind them once the opening film has brought him in (it is drawn shut in play): a column
       across the doorway's outer face, or he walked through it into the corridor (18 Nov, walktest: 15.7 square metres
       reached outside her flat, out to -3.70, -1.60) */
    solidBox(DOOR_MAIN.x1 - DOOR_MAIN.x0 + 0.04, 2.1, 0.08, 0, 1.0, -0.06);
    door(DOOR_MASTER.x1 - DOOR_MASTER.x0, [DOOR_MASTER.x0, R2.living.z1 + 0.05], 0, 0, (DOOR_MASTER.x1 - DOOR_MASTER.x0) / 2);
    door(DOOR_BED2.x1 - DOOR_BED2.x0, [DOOR_BED2.x0, R2.nook.z1 + 0.05], 0, 0, (DOOR_BED2.x1 - DOOR_BED2.x0) / 2);
    door(DOOR_BATH2.x1 - DOOR_BATH2.x0, [DOOR_BATH2.x0, R2.bath2.z0 - 0.05], 0, 0, (DOOR_BATH2.x1 - DOOR_BATH2.x0) / 2);
    door(DOOR_STORE.z1 - DOOR_STORE.z0, [R2.nook.x0 - 0.05, DOOR_STORE.z0], -Math.PI / 2, 0, (DOOR_STORE.z1 - DOOR_STORE.z0) / 2);
    /* bedroom 3's, a hand's width open (its scare eases it further: d_play turns doorLeaves[5].pivot) */
    door(DOOR_BED3.z1 - DOOR_BED3.z0, [R2.living.x0 - 0.06, DOOR_BED3.z0], -Math.PI / 2, -0.12, (DOOR_BED3.z1 - DOOR_BED3.z0) / 2);
    /* her neighbours' doors and gates along the corridor: the same door, the same gate, shut */
    for (const nx of NEIGHBOURS) {
      door(0.92, [nx - 0.46, 0.02], 0, 0, 0.46);
      stand('w4gate', nx, FL.corr, -0.051 - 0.006, 0, LOOK.w4gate);
    }
    /* (R36, 18 Nov) her neighbours' lives along the corridor, against their walls inside SCDF's 1.2 m clear from the
       parapet (docs/research/V27.0-HDB.md §2.1): a shoe rack at each door, a bougainvillea, three pots, a bicycle, a
       clothes rack out to dry. Clear of the opening film's walk (x -6 to -2 by the parapet side) */
    for (const nx of NEIGHBOURS) stand('w4shoerack', nx - 1.55, FL.corr, -0.193 - 0.012, Math.PI, LOOK.w4shoerack);
    /* each against the wall (its face at z 0) by its own box, measured from its file (18 Nov): the bougainvillea 0.74 x
       0.63 (turned 0.4, 0.44 deep), the pots 1.0 x 0.49, the bicycle 1.70 x 0.71, the rack 1.35 x 0.75; 1.5 cm clear */
    stand('w4bougain', 12.6, FL.corr, -0.45, 0.4, { lift: 1.5 });
    stand('w4corrpots', 14.6, FL.corr, -0.262, Math.PI, { lift: 1.5 });
    stand('w4corrpots', -8.4, FL.corr, -0.262, Math.PI, { lift: 1.5 });
    stand('w4bicycle', 17.4, FL.corr, -0.37, Math.PI, { lift: 1.5 });
    stand('w4clothesrack', 23.0, FL.corr, -0.39, Math.PI, { lift: 1.5 });
    if (have('w4doorleaf')) parseOnce('w4doorleaf').then(() => { for (const s of doorStandIns) s.visible = false; },
      () => { for (const s of doorStandIns) s.visible = true; });
    /* ================================================================ THE CAST (the plan's §8; masters/v27.0/people.sh)
       Her family and her teacher's: AMMA in her wheelchair before her altar; RAVI, her son, by the standing fan toward
       her room's window; MALA, her daughter, by the sofa; GRANDMASTER PHO on his stool at her left (a body at a turn of 0
       faces +z, so +x is its left) and, a body of his own as chapter 3's hall had, STANDING BEHIND HER CHAIR for the
       blessing (the two are one model; the one not in the story is hidden, and the swap is made on a cut).
       And four who are not alive, each drawn ONLY through Spirit Vision (ctx.spirit: the vision's own layer, a glowing
       silhouette that the world's pass never draws): the one on her back (crimson), Appa by his photograph (pale blue),
       the hungry ones and the large one of the blessing (green). None of them casts a contact shadow (noBlob): nothing
       of them is in the world.
       Every place is a number the plan or a measure gave (the tracker's log, 18 Nov): the wheelchair's seat 0.44 m, its
       front edge 0.28 ahead of its middle, its footrest 0.10 up from 0.35 to 0.50 ahead; the stool's top 0.445. */
    const cast = {};
    const WHEEL = { seat: 0.44, front: 0.28, foot: 0.10 };
    const STOOL_TOP = 0.445;
    /* chapter 3's numbers for a man set on a seat by his own body (its c_cast.js MASTER_DOWN, PHO_BREATH, PHO_TALK_HEAD,
       each with its reason there): the bottom on the seat, each leg solved down to the floor, the feet laid flat */
    const MASTER_DOWN = { hipOver: 0.11, sink: 0.01, sole: GROUND_SOLE, edge: -9, flat: true };
    const PHO_BREATH = 6;
    const PHO_TALK_HEAD = { Sitting_Answering_Questions: [0.3, 'Sit_to_Stand_Transition_M'] };
    /* (standing, his talk's head held as his seated one is: Chad's word on chapter 3's, "greatly restrained", v26.3; its
       head swings 9 cm side to side in its own file: tools/probes/takepath.mjs) */
    const PHO_STAND_HEAD = { Talk_with_Hands_Open: [0.3, 'Sit_to_Stand_Transition_M'] };
    /* the shoulders let down in every standing and talking take (v26.8, every standing person) */
    const STAND_SHOULDERS = { Idle_3: 1, Stand_and_Chat: 1, Listening_Gesture: 1, Talk_with_Hands_Open: 1, Talk_with_Right_Hand_Open: 1, Walking: 1 };

    /* LOOK D on Grandmaster Pho (Chad's pick, v24.52: "unlit, except for the robe"), chapter 3's own (c_cast.js lookD,
       its reason there): his face, hands and beads laid back at their own colour after the tone mapping, the robe lit.
       `level` is the hour's: under the tube he is lit as the room is (1); by the lamp alone the laid colour is dimmed */
    const phoLook = { k: { value: 1 }, level: { value: 1 }, lift: { value: 0.55 } };
    function lookD(model) {
      model.traverse(q => { if (!q.isMesh) return;
        const list = [].concat(q.material).map(m0 => { const mt = m0.clone(); mats.push(mt); const WHOLE = /\(face and hands\)$/.test(m0.name);
          mt.onBeforeCompile = (sh) => { sh.uniforms.uK = phoLook.k; sh.uniforms.uLevel = phoLook.level; sh.uniforms.uLift = phoLook.lift;
            sh.fragmentShader = 'uniform float uLevel;\nuniform float uK;\nuniform float uLift;\n' + sh.fragmentShader.replace('#include <tonemapping_fragment>', '#include <tonemapping_fragment>\n'
              + (WHOLE ? 'float skn = 1.0;\n' : 'vec3 sc = pow(max(diffuseColor.rgb, vec3(1e-4)), vec3(1.0 / 2.2)); float mxc = max(sc.r, max(sc.g, sc.b)); float skn = smoothstep(0.12, 0.25, (mxc - min(sc.r, min(sc.g, sc.b))) / max(mxc, 1e-4));\n')
              + 'float kS = clamp(uK * skn, 0.0, 1.0); vec3 unl = diffuseColor.rgb * uLevel;\n'
              + 'gl_FragColor.rgb += (1.0 - kS) * uK * uLift * max(vec3(0.0), unl * 0.9 - gl_FragColor.rgb);\n'
              + 'gl_FragColor.rgb = mix(gl_FragColor.rgb, unl, kS);'); };
          mt.customProgramCacheKey = () => 'phoLookD' + (WHOLE ? ':whole' : ''); return mt; });
        q.material = Array.isArray(q.material) ? list : list[0]; });
    }

    /* ---------------------------------------------------------------- where each stands (the floor plan's numbers) */
    const AT = {
      ravi: { x: 2.62, z: 2.02 },                       // by the standing fan, her room's window behind him to his left
      mala: { x: 0.95, z: 2.40 },                       // by the sofa's end, beside her mother
      phoS: { x: STOOL.x, z: STOOL.z },                 // his stool at her left
      phoB: { x: CHAIR.x + 0.14, z: CHAIR.z - 0.72 },   // behind her chair, for the blessing: his hips here (18 Nov: his stand
                                                        // took his body 27 cm behind the mark, where his rise from a seat
                                                        // leaves him; `centre` now puts his hips on it, a hand behind her handles)
      appa: { x: 0.95, z: 4.72 }                        // by his own photograph on the altar's wall, turned to her
    };
    const HER_HEAD = () => { const P = cast.amma; if (P && P.ready && P.head) { P.head.getWorldPosition(_pv); return [_pv.x, _pv.y + 0.06, _pv.z]; } return [CHAIR.x, 1.18, CHAIR.z - 0.05]; };

    function buildCast() {
      /* AMMA, in her wheelchair, facing her altar. She sits as a woman sits in a wheelchair: her bottom on its seat (her
         hip joints `hipOver` above it), each leg solved down to the FOOTREST from there (its top, `sole`), and brought
         forward until her shins clear the seat's front. Her seated rest (`wsit`, written for her) back and forth over
         its own still middle; her talk the library's seated answer; her turn of the head to him (`wturn`) the opening
         film's and play's one beat of it. Within 2.2 m her full model is drawn (v26.5: the story turns on her) */
      cast.amma = mkPerson('p4amma', CHAIR.x, CHAIR.z, CHAIR.ry, { take: 'wsit', centre: true, phase: 0.2,
        win: { wsit: [2.0, 3.6, 12] }, talk: 'Sitting_Answering_Questions',
        seat: { y: WHEEL.seat, takes: /^(Sitting_Answering_Questions|wsit|wturn|trance)$/,
                down: { hipOver: 0.11, sink: 0.015, sole: WHEEL.foot + 0.004, edge: WHEEL.front, r: 0.055, apron: 0.14, flat: true } },
        headDamp: { Sitting_Answering_Questions: [0.45, 'wsit'] }, skins: { 0: 'p4ammah', 2: 'p4ammam' }, blobW: 0.8, blobD: 1.05 });   // (her shadow is her chair's too; no far body in a flat of ten metres)
      cast.amma.home = { x: CHAIR.x, z: CHAIR.z, ry: CHAIR.ry };
      /* RAVI and MALA, standing, turned to their mother; each talks in the library's chat (its head's turn measured
         before it is cast: tools/probes/headturn.mjs) and rests in its stand */
      cast.ravi = mkPerson('p4ravi', AT.ravi.x, AT.ravi.z, faceTo(AT.ravi.x, AT.ravi.z, CHAIR.x, CHAIR.z), { take: 'Idle_3', phase: 0.55,
        talk: 'Stand_and_Chat', shoulders: STAND_SHOULDERS, skins: { 0: 'p4ravih', 2: 'p4ravim' }, blobW: 0.8, blobD: 0.6 });
      cast.ravi.home = { x: AT.ravi.x, z: AT.ravi.z, ry: faceTo(AT.ravi.x, AT.ravi.z, CHAIR.x, CHAIR.z) };
      cast.mala = mkPerson('p4mala', AT.mala.x, AT.mala.z, faceTo(AT.mala.x, AT.mala.z, CHAIR.x, CHAIR.z), { take: 'Idle_3', phase: 0.15,
        talk: 'Stand_and_Chat', shoulders: STAND_SHOULDERS, skins: { 0: 'p4malah', 2: 'p4malam' }, blobW: 0.75, blobD: 0.6 });
      cast.mala.home = { x: AT.mala.x, z: AT.mala.z, ry: faceTo(AT.mala.x, AT.mala.z, CHAIR.x, CHAIR.z) };
      /* GRANDMASTER PHO ON HIS STOOL (Chad's own model in his look D, as chapter 3 cast him on his bench: the same
         numbers, the stool's top for the bench's), turned to her; his rest the start of his rise from a seat, both hands
         on his knees, there and back in a slow breath; his talk the seated answer, his head's turn restrained */
      const phoRy = faceTo(AT.phoS.x, AT.phoS.z, CHAIR.x, CHAIR.z + 0.15);
      cast.pho = mkPerson('pho', AT.phoS.x, AT.phoS.z, phoRy, { take: 'Sit_to_Stand_Transition_M', centre: true,
        win: { Sit_to_Stand_Transition_M: [0.02, 0.3, PHO_BREATH] },
        seat: { y: STOOL_TOP, takes: /^Sit/, down: Object.assign({}, MASTER_DOWN, { knees: 'keep', tuck: true }), rise: 'Sit_to_Stand_Transition_M' },
        skins: false, look: lookD, blobW: 0.9, blobD: 0.9, talk: 'Sitting_Answering_Questions', headDamp: PHO_TALK_HEAD });
      cast.pho.home = { x: AT.phoS.x, z: AT.phoS.z, ry: phoRy };
      /* GRANDMASTER PHO STANDING BEHIND HER CHAIR (the blessing): the same body standing, at rest on the end of his rise
         (upright, both arms down), his right hand laid on her head (handOnHead, c_story.js) */
      const phoBRy = faceTo(AT.phoB.x, AT.phoB.z, CHAIR.x, CHAIR.z);
      cast.phoB = mkPerson('pho', AT.phoB.x, AT.phoB.z, phoBRy, { take: 'Sit_to_Stand_Transition_M', hidden: true,
        win: { Sit_to_Stand_Transition_M: [5.85, 0.25, PHO_BREATH] }, skins: false, look: lookD, blobW: 0.9, blobD: 0.8,
        centre: true, talk: 'Talk_with_Hands_Open', headDamp: PHO_STAND_HEAD });
      cast.phoB.home = { x: AT.phoB.x, z: AT.phoB.z, ry: phoBRy };
    }
    buildCast();
    /* WHERE A TAKE CARRIES A BODY: its hips over the floor from the take's first moment to `t`, in the person's own
       group's metres (its hips' track read through the fixed frame the armature stands in). Measured 18 Nov: her rise
       ends 0.35 m before the chair's middle and her steps carry her 0.29 m a second; Ravi's rush runs 2.94 m */
    const _htv = new THREE.Vector3();
    function hipsFrame(P) { if (!P._hm && P.hips) { P.group.updateWorldMatrix(true, true); P._hm = new THREE.Matrix3().setFromMatrix4(new THREE.Matrix4().copy(P.group.matrixWorld).invert().multiply(P.hips.parent.matrixWorld)); } return P._hm; }
    function hipsTravel(P, name, t) {
      const A = P.acts && P.acts[name], M = hipsFrame(P); if (!A || !M) return [0, 0];
      const tr = A.getClip().tracks.find(q => /Hips\.position$/.test(q.name)); if (!tr) return [0, 0];
      const v = tr.values, T = tr.times, n = T.length; let i = 0; while (i < n - 2 && T[i + 1] <= t) i++;
      const u = n > 1 ? c01((t - T[i]) / Math.max(1e-6, T[i + 1] - T[i])) : 0, j = Math.min(n - 1, i + 1);
      _htv.set(lp(v[i * 3], v[j * 3], u) - v[0], lp(v[i * 3 + 1], v[j * 3 + 1], u) - v[1], lp(v[i * 3 + 2], v[j * 3 + 2], u) - v[2]).applyMatrix3(M);
      return [_htv.x, _htv.z];
    }
    /* RAVI'S RUSH CARRIES HIS GROUP (18 Nov: at his mark he was not drawn: the renderer tests a body's sphere round its
       group, and the rush had carried his body three metres from it). Its travel over the floor is taken out of his hips
       as he lands and kept (P.rushPath, in his group's metres, every key of the take); a film moves his group along it
       (c_ufilm.js rushAt), so his body goes exactly where the take took it and his sphere goes with him. Kept on the clip
       too, so a second build of the chapter (a replay) finds it already taken out and reads it back */
    whenReady(cast.ravi, (P) => {
      const A = P.acts.rush, M = hipsFrame(P); if (!A || !M) { console.warn('p4ravi: no rush to carry'); return; }
      const clip = A.getClip(), tr = clip.tracks.find(q => /Hips\.position$/.test(q.name)); if (!tr) return;
      clip.userData = clip.userData || {};
      if (!clip.userData.rushPath) {
        const v = tr.values, T = tr.times, n = T.length, D = new Float32Array(n * 2), Mi = M.clone().invert(), d = new THREE.Vector3();
        for (let i = 0; i < n; i++) { d.set(v[i * 3] - v[0], v[i * 3 + 1] - v[1], v[i * 3 + 2] - v[2]).applyMatrix3(M); D[i * 2] = d.x; D[i * 2 + 1] = d.z;
          d.y = 0; d.applyMatrix3(Mi); v[i * 3] -= d.x; v[i * 3 + 1] -= d.y; v[i * 3 + 2] -= d.z; }
        clip.userData.rushPath = { T: Float32Array.from(T), D };
      }
      P.rushPath = clip.userData.rushPath;
    });

    /* ---------------------------------------------------------------- THE ONES ONLY THE VISION SHOWS (the plan's §4.2, §4.3)
       Each is a body made for it and drawn as light: its meshes handed to the engine (ctx.spirit), which moves them onto
       the vision's own layer. Their colours keep their meaning all chapter: crimson the one on her back, pale blue Appa,
       green the hungry ones; her goddess is a DARK BLUE LIGHT round her altar and never a figure (the standing rule);
       GOLD is Grandmaster Pho's alone (Chad, v25.5). A spirit's glow is read and set through P.fx (uAlpha, uFill, uRim) */
    /* (18 Nov, photographed through the vision on a phone: a generated body is many layers deep (its clothes, its rags),
       and a spirit is drawn over everything with no test of its own depth, so its fill summed through every layer and the
       one on her back read as a red block that hid her. Each is now its RIM, with a breath of fill. A glow laid over a
       body the world draws (his gold, her altar's blue) is drawn on its front surface only (xray 0: its own back layers
       stand behind the world's depth and drop out), or his robe's folds summed into an orange sheet) */
    /* (18 Nov: once the glow's own front surface passed its depth test whole (src/vision.js), her altar's rim lit every
       grazing face of it (its inner walls, its shelf) solid blue, a paint and not a light: photographed at three strengths
       (`$S/e4c4/auralab`), the most even taken, a light ON it: fill 0.14, rim 0.22, where it was 0.03 and 1.1) */
    const SPIRIT = {
      oppress: { color: 0xff2238, fill: 0.025, rim: 2.3, flicker: 0.35, power: 2.0, xray: 0 },
      appa:    { color: 0xbfe2ff, fill: 0.04, rim: 1.6, flicker: 0.05, power: 2.4 },
      wander:  { color: 0x8cff5e, fill: 0.02, rim: 2.0, flicker: 0.3, power: 2.2 },
      large:   { color: 0x5cff7a, fill: 0.025, rim: 2.2, flicker: 0.25, power: 2.0 },
      altar:   { color: 0x2f4dff, fill: 0.14, rim: 0.22, flicker: 0.08, power: 2.0, xray: 0 },
      pho:     { color: 0xffc456, fill: 0.0, rim: 0.5, flicker: 0.04, power: 3.0, xray: 0 }
    };
    function spiritOf(P, look) {
      whenReady(P, () => { P.fx = ctx.spirit ? ctx.spirit(P.model, look) : null; P.glow = 1; if (P.fx) P.fx.set('uAlpha', P.alpha != null ? P.alpha : 1); });
      return P;
    }
    /* THE ONE ON HER BACK: crouched on her shoulders, its arms round her chest, its weight on her (its `cling`, written
       for it). It rides her chair, turned as she is. (18 Nov: first set over her seat, its hips stood at 1.01 m over her
       head's base at 0.85, and it floated over her head in the photographs (tools/probes/bonesat.mjs); placed by
       photograph (tools/probes/spiritlab.mjs, variant A2): its chest against her upper back, tipped back 15 degrees so it
       hugs her rather than hunching over her, its head beside hers over her right shoulder, its arms over her shoulders
       and across her chest. Drawn only where she does not hide it (xray 0): through her, its folded legs read from her
       front as feet in her lap) */
    const OPP_AT = { x: CHAIR.x - 0.115, y: 0.075, z: CHAIR.z - 0.452 }, OPP_TILT = -0.262;
    const spirits = {};
    spirits.oppress = spiritOf(mkPerson('p4oppress', OPP_AT.x, OPP_AT.z, CHAIR.ry, { y: OPP_AT.y, take: 'cling', centre: true, noBlob: true, skins: false }), SPIRIT.oppress);
    whenReady(spirits.oppress, (P) => { P.group.rotation.x = OPP_TILT; });
    /* IT RIDES HER (18 Nov: in the trance she sits up and forward of the recline it was placed on, and in the film's
       photographs it hung in the air behind her chair, a hand's breadth and more off her back): it is carried by her
       upper back (her Spine02) as if it were one of her bones, from exactly where the photograph placed it against her
       seated rest (her `wsit` at OPP_REF_T, inside the window play holds her in). Read once, as both bodies land, her own
       pose put back after; laid every frame after she is posed (play, every film), so where she leans, it leans */
    const OPP_REF_T = 3.0, OPP_REF = { m: null };
    /* HER CROWN: the top of her head as her skin has it. Her head bone sits at the base of her skull: a palm laid 9.5 cm
       over it was inside her head, its fingertips out at her ears in the trance's first picture (18 Nov). Read once below,
       and carried by her head bone after (a fallback until she lands) */
    const CROWN_LOCAL = new THREE.Vector3(0, 0.19, 0), _crw = new THREE.Vector3();
    const HER_CROWN = () => { const A = cast.amma; if (A && A.ready && A.head) { A.head.updateWorldMatrix(true, false); _crw.copy(CROWN_LOCAL); A.head.localToWorld(_crw); return [_crw.x, _crw.y, _crw.z]; } return [CHAIR.x, 1.1, CHAIR.z - 0.15]; };
    /* HER BROW, read off her skin the same way (18 Nov: the ash put by a guess at the head bone's height reached her chin
       and then her nose): the most forward point of her head's skin in its top 9 cm, over her eyebrows, where the ash is
       drawn. She faces +z in the seated rest it is read from */
    const BROW_LOCAL = new THREE.Vector3(0, 0.11, 0.09);
    const HER_BROW = () => { const A = cast.amma; if (A && A.ready && A.head) { A.head.updateWorldMatrix(true, false); _crw.copy(BROW_LOCAL); A.head.localToWorld(_crw); return [_crw.x, _crw.y, _crw.z]; } return [CHAIR.x, 1.05, CHAIR.z]; };
    const _om = new THREE.Matrix4(), _om2 = new THREE.Matrix4(), _os = new THREE.Vector3();
    function herBack(A) { if (A._back === undefined) { A._back = null; for (const n in A.bone) if (/^(mixamorig:?)?Spine02$/.test(n)) { A._back = A.bone[n]; break; } } return A._back; }
    whenReady(cast.amma, (A) => whenReady(spirits.oppress, (P) => {
      const bk = herBack(A); if (!bk || OPP_REF.m) return;
      const keep = {}; for (const k in A.acts) keep[k] = [A.acts[k].time, A.w[k]];
      const cur = A.cur, ft = A.filmT;
      put(A, CHAIR.x, CHAIR.z, CHAIR.ry); pose(A, 'wsit', OPP_REF_T); bk.updateWorldMatrix(true, false);
      put(P, OPP_AT.x, OPP_AT.z, CHAIR.ry, OPP_AT.y); P.group.rotation.x = OPP_TILT; P.group.updateWorldMatrix(true, false);
      OPP_REF.m = new THREE.Matrix4().copy(bk.matrixWorld).invert().multiply(P.group.matrixWorld);
      /* (her crown, read off the same seated rest: the highest point of the skin her head bone carries, in that bone's
         own frame) */
      const hb = A.head; A.group.updateWorldMatrix(true, true);
      if (hb) { let best = null; const v = new THREE.Vector3();
        for (const m of (A.lv[1] || [])) { if (!m.isSkinnedMesh || !m.geometry.attributes.skinIndex) continue; const bi = m.skeleton.bones.indexOf(hb); if (bi < 0) continue;
          const SI = m.geometry.attributes.skinIndex, SW = m.geometry.attributes.skinWeight;
          for (let i = 0; i < SI.count; i++) { let w = 0; for (let k = 0; k < 4; k++) if (SI.getComponent(i, k) === bi) w += SW.getComponent(i, k); if (w < 0.5) continue;
            m.getVertexPosition(i, v); m.localToWorld(v); if (!best || v.y > best.y) best = v.clone(); } }
        if (best) CROWN_LOCAL.copy(hb.worldToLocal(best)); else console.warn('p4amma: no skin on her head bone to read her crown from');
        if (best) { let brow = null;
          for (const m of (A.lv[1] || [])) { if (!m.isSkinnedMesh || !m.geometry.attributes.skinIndex) continue; const bi = m.skeleton.bones.indexOf(hb); if (bi < 0) continue;
            const SI = m.geometry.attributes.skinIndex, SW = m.geometry.attributes.skinWeight;
            for (let i = 0; i < SI.count; i++) { let w = 0; for (let k = 0; k < 4; k++) if (SI.getComponent(i, k) === bi) w += SW.getComponent(i, k); if (w < 0.5) continue;
              m.getVertexPosition(i, v); m.localToWorld(v); if (v.y < best.y - 0.09) continue; if (!brow || v.z > brow.z) brow = v.clone(); } }
          if (brow) BROW_LOCAL.copy(hb.worldToLocal(brow)); } }
      for (const k in A.acts) { A.acts[k].time = keep[k][0]; A.w[k] = keep[k][1]; A.acts[k].setEffectiveWeight(keep[k][1]); }
      A.cur = cur; A.filmT = ft; A.mixer.update(0);
    }));
    /* in play, every frame after the people are posed (play never moves it: the water does not, c_story.js) */
    function oppRidePlay() { const P = spirits.oppress; if (P && P.ready && P.group.visible) oppRide(P); }
    /* lay it on her back where she is posed now (its own take is its own: only its place and its turn are hers) */
    function oppRide(P = spirits.oppress) {
      const A = cast.amma, bk = A && A.ready ? herBack(A) : null;
      if (!P || !P.ready) return;
      if (!OPP_REF.m || !bk) { put(P, OPP_AT.x, OPP_AT.z, CHAIR.ry, OPP_AT.y); P.group.rotation.set(OPP_TILT, CHAIR.ry, 0); return; }
      bk.updateWorldMatrix(true, false);
      _om.multiplyMatrices(bk.matrixWorld, OPP_REF.m);
      const par = P.group.parent; if (par) { par.updateWorldMatrix(true, false); _om2.copy(par.matrixWorld).invert(); _om.premultiply(_om2); }
      _om.decompose(P.group.position, P.group.quaternion, _os);
    }
    /* APPA, her late husband, standing by his photograph, looking at her; still (his stand, its window its calmest);
       his turn of the head is to her, and once, if water is thrown at him, to the student */
    spirits.appa = spiritOf(mkPerson('p4appa', AT.appa.x, AT.appa.z, faceTo(AT.appa.x, AT.appa.z, CHAIR.x, CHAIR.z), { take: 'Idle_3', phase: 0.3, noBlob: true, skins: false }), SPIRIT.appa);
    /* THE HUNGRY ONES: one body, many of them (each its own clone; mirrored and sized a little apart so no two are one
       shape twice). Two wait in the corners from the start (by the kitchen, under the dining table: §4.2); the rest
       are the blessing's waves, hidden until they come */
    /* (sixteen: Chad, 18 Nov, the end of the blessing: "the green entities should swarm in the screen in dramatic numbers,
       filling the screen with many of them"; each a 15,799-triangle clone of one body, drawn in the vision only. The
       fight never has more than sixteen in the room at once: c_story.js freeBody) */
    const WANDER_N = 16;
    spirits.wander = [];
    for (let i = 0; i < WANDER_N; i++) {
      const P = mkPerson('p4wander', 0, 0, 0, { take: i % 2 ? 'creep' : 'crawl', phase: 0.13 * i, hidden: true, noBlob: true, skins: false, s: 0.94 + 0.03 * (i % 4) });
      P.slot = i; spirits.wander.push(spiritOf(P, SPIRIT.wander));
    }
    const CORNERS = [{ x: 5.95, z: 9.55, ry: -2.6 }, { x: 4.85, z: 6.65, ry: Math.PI }];   // the kitchen's far corner; under the dining table
    spirits.large = spiritOf(mkPerson('p4large', 0, 0, 0, { take: 'lumber', hidden: true, noBlob: true, skins: false }), SPIRIT.large);
    function spiritsHome() {
      whenReady(spirits.oppress, (P) => { oppRide(P); P.group.visible = true; P.alpha = 1; if (P.fx) P.fx.set('uAlpha', 1); rest(P, 0); });
      whenReady(spirits.appa, (P) => { put(P, AT.appa.x, AT.appa.z, faceTo(AT.appa.x, AT.appa.z, CHAIR.x, CHAIR.z)); P.group.visible = true; P.alpha = 1; if (P.fx) P.fx.set('uAlpha', 1); rest(P, 0); });
      spirits.wander.forEach((P, i) => whenReady(P, (Q) => {
        const C = CORNERS[i]; Q.alpha = 1; if (Q.fx) Q.fx.set('uAlpha', 1);
        if (C) { put(Q, C.x, C.z, C.ry); Q.group.visible = true; take(Q, 'crawl', 0); } else Q.group.visible = false; }));
      whenReady(spirits.large, (P) => { P.group.visible = false; });
    }
    spiritsHome();
    /* HER GODDESS'S LIGHT: a dark blue glow laid over her altar (the shelf, its pictures, the lamp) in the vision only,
       twins of their own meshes (ctx.spiritAura): a light, never a figure. And GRANDMASTER PHO, in the vision, the one
       person in the room who stands in gold, faintly (gold is his alone: Chad, v25.5) */
    const auras = [], altarAuras = [];
    /* (a thing's twins are made once its model is in its group: stand() asked for the parse first, so its own handler,
       which puts the model in, has run before this one) */
    function auraOn(key, look) {
      const groups = things[key] || []; if (!groups.length || !have(key)) return;
      parseOnce(key).then(() => { if (!alive) return; for (const g of groups) { const a = ctx.spiritAura ? ctx.spiritAura(g, look) : null; if (a) { auras.push(a); altarAuras.push(a); } } }, () => {});
    }
    for (const k of ['w4prayershelf', 'w4vilakku']) auraOn(k, SPIRIT.altar);
    for (const P of [cast.pho, cast.phoB]) whenReady(P, (Q) => { const a = ctx.spiritAura ? ctx.spiritAura(Q.model, SPIRIT.pho) : null; if (a) { auras.push(a); Q.aura = a; } });

    /* WHAT THE WATER CAN REACH (the engine raycasts the lens's line into stage.shootables()): a sphere round each
       spirit's middle, drawn by nobody (its material is never drawn) and on the world's layer, where the ray looks.
       A skinned body is not raycast (its every point skinned on the processor, every shot) */
    const hitGeo = new THREE.SphereGeometry(1, 12, 8), hitMat = new THREE.MeshBasicMaterial({ visible: false });
    owned.push(hitGeo); mats.push(hitMat);
    function hitBall(P, r, up) { const m = new THREE.Mesh(hitGeo, hitMat); m.scale.setScalar(r); m.visible = false; m.userData.up = up; m.name = 'hit:' + P.key; world.add(m); P.hit = m; return m; }
    /* (18 Nov, Chad: "make the aoe of the water flicking bigger": the green ones' spheres 0.5 m where they were 0.36, the
       large one's 0.72 where it was 0.55, and every green one near the flick's line is reached too: c_story.js onShot.
       Appa's and the one on her back's stay as they were: a flick reaches him only when it is aimed at him) */
    hitBall(spirits.oppress, 0.32, 0.25); hitBall(spirits.appa, 0.36, 1.0); hitBall(spirits.large, 0.72, 1.05);
    for (const P of spirits.wander) hitBall(P, 0.5, 0.22);
    /* the altar, so a shot at it can be refused (Not at her altar.): her shelf's column, from the floor to its top */
    const altarHit = new THREE.Mesh(new THREE.BoxGeometry(0.95, 2.1, 0.7), hitMat); altarHit.position.set(ALTAR.x, 1.05, ALTAR.z - 0.32); altarHit.visible = false; altarHit.name = 'hit:altar';
    world.add(altarHit); owned.push(altarHit.geometry);
    const _hp = new THREE.Vector3();
    function hitsTick() {
      for (const P of [spirits.oppress, spirits.appa, spirits.large].concat(spirits.wander)) { const m = P.hit; if (!m) continue;
        const on = !!(P.ready && P.group.visible && !(P.gone));
        m.visible = on; if (!on) continue;
        if (P.hips) { P.hips.getWorldPosition(_hp); m.position.set(_hp.x, _hp.y + (P === spirits.appa ? 0.2 : 0.05), _hp.z); }
        else m.position.set(P.group.position.x, P.group.position.y + m.userData.up, P.group.position.z); }
    }
    /* ================================================================ THE STORY IN PLAY (the plan's §4.1 to §4.3)
       Three phases, each its own receipt on the save (v7.3: the phase string is the only receipt):
         history  HISTORY FIRST: five sources (Ravi, Mala, the clinic's letters, the old photograph, Appa's), her one line
                  to him, and what he tells his teacher;
         sight    THE SIGHT: Spirit Vision opened at his teacher's word, the three presences looked at (aim and press),
                  closed again, and Grandmaster Pho's reading;
         bless    THE BLESSING: Mala lights her lamp, the room goes dark, he takes the holy water, and he KEEPS THE ROOM
                  through the chant (HOLD THE ROOM, the fifty-second seam) in three waves;
         kept     the room kept: the trance's film and the decision at the turning point.
       Nothing in it tests a finger's speed (Chad's rule of v24.12): the shapes are slow, the aim generous, and what is
       asked is discernment (not the husband, not the altar) and open and close (open to see, shut to breathe). */
    const W = DATA.words;
    const PHASES = ['history', 'sight', 'bless', 'kept'];
    const play = { run: 0, busy: false, learned: new Set(), spoke: false, told: false, peeked: false,
                   opened: false, looked: new Set(), closed: false, read: false,
                   water: false, briefed: false, fight: null, appaGone: false, nerveOut: false, held: 0, heat: 0, heatStep: 0,
                   lit: false, dark: 0, fanK: 1, fanTo: 1, scareAt: 0, scareSeed: 0, scared: new Set(), doorTo: -0.12, doorK: -0.12,
                   fogged: false, fogAt: 0, closeHold: 0, breathSaid: -99 };
    let decOpen = false;
    const live = (run) => alive && run === play.run;
    const HEAD_OF = (P, dy = 0.08, fb) => { if (P && P.ready && P.head && P.group.visible) { P.head.getWorldPosition(_pv); return { x: _pv.x, y: _pv.y + dy, z: _pv.z }; } return fb; };
    const AMMA_HEAD = () => HEAD_OF(cast.amma, 0.1, { x: CHAIR.x, y: 1.25, z: CHAIR.z });
    const PHO_HEAD = () => { const P = cast.phoB.group.visible ? cast.phoB : cast.pho; return HEAD_OF(P, 0.1, { x: P.group.position.x, y: P.group.visible && P === cast.phoB ? 1.8 : 1.3, z: P.group.position.z }); };
    const RAVI_HEAD = () => HEAD_OF(cast.ravi, 0.1, { x: cast.ravi.group.position.x, y: 1.75, z: cast.ravi.group.position.z });
    const MALA_HEAD = () => HEAD_OF(cast.mala, 0.1, { x: cast.mala.group.position.x, y: 1.62, z: cast.mala.group.position.z });
    /* the five sources' places, measured from the things themselves (c_props.js) */
    const FOLDER_AT = { x: 4.80, y: 0.80, z: 6.40 };
    const OLDPHOTO_AT = { x: ROOMS.dining.x0 + 0.481, y: 1.13, z: 5.89 };          // the picture's middle in its frame (c_props.js)
    const APPA_PHOTO_AT = { x: 0.62, y: 1.50, z: ROOMS.living.z1 - 0.03 };
    const SMALLBOWL_AT = { x: BOWL.x + 0.30, y: 0.04, z: BOWL.z - 0.12 };
    const LAMP_AT = { x: VILAKKU.x, y: 0.43, z: VILAKKU.z };
    /* Mala KNEELING at it (her kneel's right hand over its wick, measured: tools/probes/takepath.mjs ABS=1 kneelhold), and
       the stand she was built in, given back whenever the family goes home */
    const MALA_LAMP = { x: VILAKKU.x + 0.085, z: VILAKKU.z - 0.30 };
    const MALA_KNEEL = { take: 'kneelhold', win: { kneelhold: [2.5, 1.0, 6.0] } }, MALA_STAND = cast.mala.rest;

    /* ---------------------------------------------------------------- the receipts (§9 of the plan: the phase string)
       history: r m f o a (each source learned), k (her line heard), p (he opened his sight before he had listened);
       sight:   v (opened), l1 l2 l3 (each presence looked at);  bless: w (the water taken), x (the water thrown at Appa) */
    function mark() {
      const t = [...play.learned];
      if (play.spoke) t.push('k');
      if (play.peeked) t.push('p');
      if (play.opened) t.push('v');
      for (const c of play.looked) t.push('l' + c);
      if (play.water) t.push('w');
      if (play.appaGone) t.push('x');
      return t.join(',');
    }
    function readMark(p0) {
      const [p1, tag = ''] = String(p0 || '').split(':');
      const p = PHASES.includes(p1) ? p1 : 'history', f = new Set(tag.split(',').filter(Boolean));
      return { p, learned: ['r', 'm', 'f', 'o', 'a'].filter(c => f.has(c)), spoke: f.has('k'), peeked: f.has('p'), opened: f.has('v'),
               looked: ['1', '2', '3'].filter(c => f.has('l' + c)), water: f.has('w'), appaGone: f.has('x') };
    }
    function setPhase(p, opts) { phase = p; if (kit) kit.setPhase(p + ':' + mark()); objectiveFor(p, opts); }
    function saveMark() { if (kit) kit.setPhase(phase + ':' + mark()); }
    function bank(note, s = 0, a = 0) {
      if (!kit || !note) return;
      const got = kit.getConduct ? kit.getConduct().notes : [];
      if (!got.includes(note)) kit.conduct({ note, s, a });
    }

    /* ---------------------------------------------------------------- the orders (one at a time, after the lines that
       hand off to them: v21.21; COMPLETE only for what he did: v8.7) */
    function objectiveFor(p, opts) {
      if (!kit) return;
      if (play.busy) return;                                   // a line is handing off: the order waits for it
      let o = null, wp = null;
      if (p === 'history') {
        if (play.learned.size < 5) o = W.objHistory.replace('{n}', String(play.learned.size));
        else if (!play.spoke) { o = W.objAmma; wp = AMMA_HEAD(); }
        else if (!play.told) { o = W.objTell; wp = PHO_HEAD(); }
      } else if (p === 'sight') {
        if (!play.opened) o = W.objOpen;
        else if (play.looked.size < 3) o = W.objLook.replace('{n}', String(play.looked.size));
        else if (!play.closed) o = W.objClose;
      } else if (p === 'bless') {
        if (!play.water) { o = W.objWater; wp = SMALLBOWL_AT; }
        else if (play.fight && play.fight.on) o = play.fight.call === 'gold' ? W.objGold : W.objHold;
      }
      kit.objective(o, opts);
      kit.waypoint(wp);
      if (p === 'sight') urgeSight();
    }

    /* ---------------------------------------------------------------- a line said by one of them (v11.4: he talks
       from its own start and rests after it); `face`: the speaker turns his head to the lens while he says it */
    function say(name, P, face = true) {
      queueLine(name, () => { if (P) { talk(P, SECS[name] || 2.5); if (face) { gaze(P, 'lens', { reach: 0.6, secs: 0.8 }); after((SECS[name] || 2.5) + 0.6, () => { if (P.gaze && P.gaze.target === 'lens') gaze(P, null); }); } } });
    }

    /* ---------------------------------------------------------------- THE LOOK (the flat lit by its tube; or dark)
       and every person at home: the family where they stand, Grandmaster Pho on his stool, his standing self hidden */
    let lookName = 'FLAT';
    function lookAt0(name, secs = 0) {
      lookName = name; if (kit) kit.daylight(PRESETS[name] || FLAT, secs);
      phoLook.level.value = name === 'DARK' ? 0.55 : 1;
      tubeLevel(name === 'DARK' ? 0 : 1);
      if (name !== 'DARK') { play.fanTo = 1; }
    }
    function castHome() {
      cast.mala.rest = MALA_STAND;
      for (const k of ['amma', 'ravi', 'mala']) whenReady(cast[k], (P) => { put(P, P.home.x, P.home.z, P.home.ry); P.group.visible = true; gaze(P, null, { secs: 0.01 }); rest(P, 0); });
      whenReady(cast.pho, (P) => { put(P, P.home.x, P.home.z, P.home.ry); P.group.visible = true; gaze(P, null, { secs: 0.01 }); rest(P, 0); });
      whenReady(cast.phoB, (P) => { P.group.visible = false; });
      castSolid();
    }
    /* the people he cannot walk through: a column for each who stands (blockers() hands these boxes to the engine; they
       are moved in place, never replaced) */
    const castBlock = {};
    for (const k of ['ravi', 'mala', 'phoB']) castBlock[k] = new THREE.Box3(new THREE.Vector3(0, 60, 0), new THREE.Vector3(0, 61, 0));
    function castSolid() { for (const k in castBlock) { const P = cast[k], b = castBlock[k], on = !!(P && P.group.visible), g = P.group.position, r = 0.32;
      b.min.set(g.x - r, on ? 0 : 60, g.z - r); b.max.set(g.x + r, on ? 1.5 : 61, g.z + r); } }
    for (const k in castBlock) whenReady(cast[k], castSolid);

    /* ================================================================ PLAY I · HISTORY FIRST (§4.1) */
    const WARM_HISTORY = ['ph4h0', 'rv4h1', 'rv4h2', 'ml4h1', 'q4h1', 'ml4h2', 'ml4h3', 'q4h2', 'am4h1', 'q4h3', 'ph4h1',
                          'u4tubetick', 'u4fanslow', 'u4doorease', 'u4breath', 'u4fog', 'u4sting', 'u4tile', 'u4tile2',
                          'u4os1', 'u4os2', 'u4os3', 'u4os4', 'u4os5', 'u4os6'];
    function historyBegin(R, fresh) {
      lookAt0('FLAT'); castHome(); spiritsHome();
      play.learned = new Set(R.learned); play.spoke = R.spoke; play.peeked = R.peeked; play.told = false;
      setPhase('history', { complete: false });
      if (warmSounds) warmSounds(WARM_HISTORY);
      const run = play.run;
      if (fresh || !play.learned.size) after(1.4, () => { if (!live(run) || phase !== 'history' || heard.has('ph4h0')) return;
        play.busy = true; say('ph4h0', cast.pho); queueFn(() => { play.busy = false; objectiveFor('history', { complete: false }); }); });
      scareArm();
    }
    /* one source: its lines, then the count goes up (and the order with it) */
    function learn(c, lines) {
      if (play.busy || play.learned.has(c) || phase !== 'history') return false;
      play.busy = true; if (kit) kit.waypoint(null);
      for (const [name, P, face] of lines) say(name, P, face !== false);
      queueFn(() => { play.learned.add(c); play.busy = false; saveMark(); objectiveFor('history');
        if (play.learned.size === 5) { const run = play.run; after(0.6, () => { if (live(run)) objectiveFor('history', { complete: false }); }); } });
      return true;
    }
    /* the clinic's letter, read: its words on the screen while he thinks his line */
    function readLetters() {
      if (!learn('f', [['q4h1', null]])) return false;
      if (kit && kit.captions) kit.captions([{ at: 0, end: 7.5, text: W.letter, sub: W.letterSub }]);
      return true;
    }
    /* Amma, to him, quietly: her head turns to him, not to her teacher */
    function ammaSpeaks() {
      if (play.busy || play.spoke || play.learned.size < 5) return false;
      play.busy = true; if (kit) kit.waypoint(null);
      whenReady(cast.amma, (P) => gaze(P, 'lens', { reach: 0.9, secs: 1.4 }));
      queueGap(1.2);
      queueLine('am4h1', () => talk(cast.amma, SECS.am4h1 || 1.8));
      queueGap(0.8);
      queueFn(() => { play.spoke = true; play.busy = false; saveMark(); objectiveFor('history');
        const run = play.run; after(2.5, () => { if (live(run)) whenReady(cast.amma, (P) => gaze(P, null, { secs: 1.6 })); }); });
      return true;
    }
    /* what he tells his teacher, and his answer: the phase is complete */
    function tellPho() {
      if (play.busy || !play.spoke || play.told) return false;
      play.busy = true; if (kit) kit.waypoint(null);
      /* (he looked before he listened: no receipt for listening first; history before conclusions is the lesson) */
      say('q4h3', null);
      say('ph4h1', cast.pho);
      queueFn(() => { play.told = true; play.busy = false;
        if (!play.peeked) bank(W.noteHistory, 0, 3);
        if (kit) kit.objective(null);
        const run = play.run; after(1.6, () => { if (live(run)) sightBegin(readMark('sight:' + mark()), true); }); });
      return true;
    }

    /* ---------------------------------------------------------------- THE HOUSE WHILE HE LISTENS (§4.1: horror,
       never cheap; a seeded stream on the chapter clock, one at a time, never over a line; in the phases they fit) */
    const SCARE_SEED = 0x4c4d;
    function scareArm() { play.scareAt = dayClock.t + 9; }
    function scareRnd() { play.scareSeed = (play.scareSeed * 1103515245 + 12345) >>> 0; return (play.scareSeed >>> 8) / 16777216; }
    function scareTick() {
      if ((phase !== 'history' && phase !== 'sight') || play.busy || dayClock.t < play.scareAt || dayClock.t < speak.until) return;
      const near = Math.hypot(yaw.position.x - CHAIR.x, yaw.position.z - CHAIR.z) < 1.7;
      const pool = ['tube', 'fan', 'ecg'].concat(play.scared.has('door') ? [] : ['door']).concat(near ? ['breath', 'breath'] : []);
      const k = pool[Math.floor(scareRnd() * pool.length)];
      play.scareAt = dayClock.t + 10 + scareRnd() * 8;
      play.scared.add(k);
      if (k === 'tube') { fx('u4tubetick', 0.55, panOf(TUBE_AT)); tubeFlicker(); }
      else if (k === 'fan') { fx('u4fanslow', 0.6, panOf(FAN_AT)); play.fanTo = 0.25; const run = play.run; after(1.3, () => { if (live(run) && phase !== 'bless') play.fanTo = 1; }); }
      else if (k === 'door') { fx('u4doorease', 0.6, panOf(BED3_DOOR)); play.doorTo = -0.34; }
      else if (k === 'breath') { fx('u4breath', 0.7, 0); if (kit && kit.chill) { kit.chill(0.35, { secs: 0.5 }); const run = play.run; after(2.2, () => { if (live(run) && kit) kit.chill(0, { secs: 1.2 }); }); } }
      else if (k === 'ecg') { if (kit && kit.pulse && !visOpen()) { kit.pulse({ erratic: 0.8, secs: 0.3 }); const run = play.run; after(1.6, () => { if (live(run) && kit && !visOpen()) kit.pulse({ erratic: 0, secs: 1.2 }); }); } }
    }
    /* where the sounds come from (panned by the lens's own heading) */
    const TUBE_AT = { x: 0.2, z: 3.6 }, FAN_AT = { x: 1.0, z: 2.4 }, BED3_DOOR = { x: ROOMS.living.x0, z: (DOOR_BED3.z0 + DOOR_BED3.z1) / 2 };
    function panOf(p) { const a = Math.atan2(-(p.x - yaw.position.x), -(p.z - yaw.position.z)), d = angTo(yaw.rotation.y, a); return Math.max(-0.8, Math.min(0.8, -Math.sin(d))); }
    /* the tube's own light: its emissive tube, and the room's key dipped with it */
    const tubeMats = [];
    if (have('w4tubelight')) parseOnce('w4tubelight').then(() => { for (const g of (things.w4tubelight || []).slice(0, 1)) g.traverse(q => { if (q.isMesh) for (const m of [].concat(q.material)) if (m.emissive) { tubeMats.push(m); m.userData.e0 = m.emissiveIntensity; if (m.emissive.getHex() === 0) { m.emissive.set(0xeaf2ff); m.emissiveIntensity = 0.0; m.userData.e0 = 0.0; } } }); }, () => {});
    function tubeLevel(k) { for (const m of tubeMats) m.emissiveIntensity = (m.userData.e0 || 0) * k; }
    function tubeFlicker() {
      const run = play.run, base = PRESETS[lookName] || FLAT;
      const dip = Object.assign({}, base, { key: [base.key[0], base.key[1] * 0.45, base.key[2], base.key[3], base.key[4]], hemi: [base.hemi[0], base.hemi[1], base.hemi[2] * 0.6] });
      const step = (t, f) => after(t, () => { if (live(run) && phase !== 'bless' && phase !== 'kept') f(); });
      step(0, () => { if (kit) kit.daylight(dip, 0.03); tubeLevel(0.2); });
      step(0.09, () => { if (kit) kit.daylight(base, 0.03); tubeLevel(1); });
      step(0.21, () => { if (kit) kit.daylight(dip, 0.03); tubeLevel(0.2); });
      step(0.28, () => { if (kit) kit.daylight(base, 0.05); tubeLevel(1); });
    }
    /* THE FAN (the hugger over the living room turns; the dining room's too) */
    let fanSpin = 0;
    function fanTick(wdt) {
      play.fanK += (play.fanTo - play.fanK) * Math.min(1, wdt * (play.fanTo < play.fanK ? 1.6 : 0.8));
      fanSpin += wdt * 7.5 * play.fanK;
      for (const g of things.w4hugger || []) { const m = g.userData.model; if (m) m.rotation.y = fanSpin; }
    }
    /* bedroom 3's door, a hand's width further each time it is asked (its pivot is doorLeaves[5]) */
    function doorTick(wdt) { const D = doorLeaves[5]; if (!D) return; play.doorK += (play.doorTo - play.doorK) * Math.min(1, wdt * 0.6); D.pivot.rotation.y = D.shut + play.doorK; }
    /* APPA'S PHOTOGRAPH: stood before long, its glass fogs for a moment and clears (once; §4.1) */
    const fogMat = new THREE.MeshBasicMaterial({ color: 0xe8eef2, transparent: true, opacity: 0, depthWrite: false });
    const fogPane = new THREE.Mesh(new THREE.PlaneGeometry(0.27, 0.36), fogMat);
    fogPane.position.set(0.62, 1.50, ROOMS.living.z1 - 0.004 - 0.023); fogPane.rotation.y = Math.PI; fogPane.renderOrder = 3; world.add(fogPane);
    owned.push(fogPane.geometry); mats.push(fogMat);
    let fogK = 0, fogTo = 0;
    function fogTick(wdt) {
      if (phase === 'history' && !play.fogged && !play.busy) {
        const d = Math.hypot(yaw.position.x - APPA_PHOTO_AT.x, yaw.position.z - APPA_PHOTO_AT.z);
        play.fogAt = d < 1.6 ? play.fogAt + wdt : 0;
        if (play.fogAt > 3.5) { play.fogged = true; fogTo = 0.55; fx('u4fog', 0.6, panOf(APPA_PHOTO_AT)); const run = play.run; after(1.8, () => { if (live(run)) fogTo = 0; }); }
      }
      fogK += (fogTo - fogK) * Math.min(1, wdt * (fogTo > fogK ? 1.4 : 0.7)); fogMat.opacity = fogK; fogPane.visible = fogK > 0.01;
    }

    /* ================================================================ SPIRIT VISION'S PRICE (§4.2, §4.3)
       His heart climbs while his sight is open and settles while it is shut: past its limit the picture throbs and his
       nerve (Sanity) drains. Open to see; shut to breathe (chapter 3's teaching, with a price). If his nerve runs low,
       his teacher closes his sight for him for a few seconds ("I am closing your Spirit Vision. Breathe."): every timed phase has a failure state
       that ends it, and nothing soft-locks (v7.4) */
    const HEAT = { up: 1 / 32, down: 1 / 9, drain: 1.4, floor: 15, low: 26 };
    const sanityNow = () => { const v = kit && kit.stat ? kit.stat('sanity') : null; return Number.isFinite(v) ? v : 100; };
    const visOpen = () => { const v = kit && kit.vision ? kit.vision() : null; return !!(v && (v.on || v.held)); };
    function heatTick(wdt) {
      if (!kit || !kit.vision) return;
      const v = kit.vision(); if (!v) return;
      const open = v.on && !play.closeHold;
      play.heat = Math.max(0, Math.min(1.3, play.heat + (open ? HEAT.up : -HEAT.down) * wdt));
      /* (empowered, his heart is steadied: it never passes 0.7 while the golden water is his, so the swarm is fought with his
         sight open and nothing shuts it for him: R26) */
      if (play.fight && play.fight.on && play.fight.call === 'gold') play.heat = Math.min(play.heat, 0.7);
      const step = play.heat >= 1 ? 3 : play.heat >= 0.75 ? 2 : play.heat >= 0.45 ? 1 : 0;
      if (open && step !== play.heatStep) {
        play.heatStep = step;
        if (kit.pulse) kit.pulse(step === 3 ? { bpm: 168, secs: 1.2, erratic: 0.5 } : step === 2 ? { bpm: 148, secs: 2 } : step === 1 ? { bpm: 132, secs: 2.5 } : { bpm: 118, secs: 2.4 });
        if (kit.smear) kit.smear(step === 3 ? 0.45 : 0, { secs: 0.6 });
      } else if (!open && play.heatStep) { play.heatStep = 0; if (kit.smear) kit.smear(0, { secs: 0.8 }); }
      if (open && play.heat >= 1 && getState() === 'play') {
        const room = sanityNow() - HEAT.floor;
        if (room > 0) kit.award('sanity', -Math.min(room, HEAT.drain * wdt), { minigame: true });
      }
      /* (shut for him only when his heart is PAST ITS LIMIT and his nerve low: 18 Nov, played by a finger, a fight that had
         cost him his nerve (the shapes that reach him take it too) shut his sight the instant he opened it, every time, and
         he could never see the room again. Held shut, his heart cools (5.5 s of HEAT.down), so he has some seconds of sight
         before it is past its limit again) */
      if (open && play.heat >= 1 && sanityNow() < HEAT.low && !play.closeHold && !play.busy && (phase === 'sight' || phase === 'bless')) nerveOut();
      if (play.closeHold && (play.closeHold -= wdt) <= 0) { play.closeHold = 0; kit.vision(null); }
    }
    /* "I am closing your Spirit Vision. Breathe." His sight shut for him and held shut for a few seconds; a price on the card (§4.3) */
    function nerveOut() {
      if (!kit || !kit.vision) return;
      kit.vision(false); kit.vision({ r: 0, moving: false }); play.closeHold = 5.5;
      play.nerveOut = true; bank(W.noteNerve, -4, 0);
      /* (his word the first time, and in the blessing at most once in 30 s: shut again later, the sight's own closing sound
         says it; 18 Nov) */
      const now = wallNow();
      if (!heard.has('ph4b1') || (phase === 'bless' && now - play.breathSaid > 30)) { play.breathSaid = now;
        phoSpeaks('ph4b1', () => talk(cast.phoB.group.visible ? cast.phoB : cast.pho, SECS.ph4b1 || 2)); }
    }

    /* ================================================================ PLAY II · THE SIGHT (§4.2) */
    const WARM_SIGHT = ['ph4s0', 'q4s1', 'q4s2', 'q4s3', 'ph4s1', 'ph4s2', 'ph4s3', 'ph4s4', 'u4sting', 'u4vison', 'u4visbed', 'u4heart'];
    function sightBegin(R, fresh) {
      lookAt0('FLAT'); castHome(); spiritsHome();
      play.learned = new Set(['r', 'm', 'f', 'o', 'a']); play.spoke = true; play.told = true; play.peeked = R.peeked;
      play.opened = R.opened; play.looked = new Set(R.looked); play.closed = false; play.read = false;
      setPhase('sight', { complete: false });
      if (warmSounds) warmSounds(WARM_SIGHT);
      const run = play.run;
      if (fresh || !play.opened) { play.busy = true;
        after(fresh ? 0.4 : 1.2, () => { if (!live(run)) return; say('ph4s0', cast.pho);
          queueFn(() => { play.busy = false;
            /* (opened while he was still speaking: "Now open your Spirit Vision" is pressed the moment it is heard, and
               onVision lets a switch pass under his line; left there, the order said "Open" over an open sight and the
               spirits could not be looked at until he shut it and opened it again. Build 21, found in the lab) */
            if (visOpen() && !play.opened) { play.opened = true; saveMark(); }
            objectiveFor('sight', { complete: false }); if (kit && kit.visionUrge && !visOpen()) kit.visionUrge(true); }); }); }
      else objectiveFor('sight', { complete: false });
    }
    /* the engine tells the stage every time he opens or shuts his sight (stage.onVision) */
    function onVision(on) {
      /* (in the fight the eye button's ask is worked out again on the next frame, from his sight as it now is: urgeTick) */
      if (play.fight && play.fight.on) play.fight.urge = null;
      else if (kit && kit.visionUrge) kit.visionUrge(false);
      if (on && (phase === 'history' || phase === 'sight')) oppressLooks();
      if (phase === 'history' && on && !play.peeked) { play.peeked = true; saveMark(); }
      if (phase === 'sight' && !play.busy) {
        if (on && !play.opened) { play.opened = true; saveMark(); const run = play.run; after(1.4, () => { if (live(run)) objectiveFor('sight'); }); }
        else if (!on && play.opened && play.looked.size >= 3 && !play.closed) { play.closed = true; readingBegin(); }
      }
      if (phase === 'sight' && !play.busy) urgeSight();
    }
    /* THE EYE BUTTON ASKS (Chad, 18 Nov: "When the game wants to prompt the user to enter or exit spirit vision, there also
       should be a different set of glow colour pulsating effect on the spirit vision icon so that the player clearly knows
       what to do"): in the sight, OPEN while there is something left to look at and his sight is shut, CLOSE once all three
       are seen and it is still open (the order says the same); nothing while a line hands off */
    function urgeSight() {
      if (!kit || !kit.visionUrge || phase !== 'sight') return;
      const open = visOpen();
      kit.visionUrge(!play.opened || play.looked.size < 3 ? (open ? false : 'open') : (!play.closed && open ? 'close' : false));
    }
    /* as the wave reaches it, the one on her back turns its head and looks at him: his heart kicks, a low sting
       (once a phase: the first time the wave finds it) */
    let oppLooked = '';
    function oppressLooks() {
      if (oppLooked === phase) return; oppLooked = phase;
      const run = play.run;
      after(0.55, () => { if (!live(run)) return;
        whenReady(spirits.oppress, (P) => { span(P, 'oturn', 0, 2.2, 1.4, { hold: 0.35, holdSecs: 3 }); gaze(P, 'lens', { reach: 1.1, secs: 0.6 }); });
        fx('u4sting', 0.8, panOf(CHAIR));
        if (kit && kit.pulse) kit.pulse({ bpm: 150, secs: 0.4, erratic: 0.3 });
        after(4.5, () => { if (!live(run)) return; whenReady(spirits.oppress, (P) => { gaze(P, null, { secs: 1.5 }); rest(P, 1.2); }); }); });
    }
    /* each presence, looked at by aiming at it and pressing (pressAim: the twenty-eighth seam) */
    function lookPresence(c, line) {
      if (play.busy || play.looked.has(c) || !visOpen()) return false;
      play.busy = true;
      say(line, null);
      queueFn(() => { play.looked.add(c); play.busy = false; saveMark(); objectiveFor('sight');
        if (play.looked.size >= 3) { play.busy = true; say('ph4s1', cast.pho); queueFn(() => { play.busy = false; objectiveFor('sight'); if (!visOpen() && !play.closed) { play.closed = true; readingBegin(); } }); } });
      return true;
    }
    /* his teacher's reading, in the case file's own words; then the blessing */
    function readingBegin() {
      if (play.read) return; play.read = true; play.busy = true;
      if (kit) kit.objective(null);
      const run = play.run;
      after(0.9, () => { if (!live(run)) return;
        say('ph4s2', cast.pho); say('ph4s3', cast.pho); say('ph4s4', cast.pho);
        queueFn(() => { play.busy = false; after(0.8, () => { if (live(run)) blessBegin(readMark('bless:' + mark()), true); }); }); });
    }

    /* ================================================================ PLAY III · THE BLESSING (§4.3) */
    const WARM_BLESS = ['ph4b0', 'ph4b1', 'ph4b2', 'u4match', 'u4tubedie', 'u4fanstop', 'u4tvdie', 'u4flick', 'u4patter', 'u4dip', 'u4whisper',
                        'u4release', 'u4large', 'u4gaspf', 'u4gaspm', 'u4chill', 'u4husband', 'u4vison', 'u4visbed', 'u4heart', 'uiclick',
                        'u4fightmus', 'u4fightloop', 'u4chant1', 'u4chant2',
                        /* (18 Nov: her cries, the surge, the call and the gold; every line of the fight's stakes) */
                        'u4ascream1', 'u4ascream2', 'u4ascream3', 'u4surge', 'u4goldcall', 'u4goldpower', 'u4goldflick', 'u4goldclear', 'u4sting',
                        'ph4b3', 'ph4b4', 'ph4b5', 'q4f1', 'q4f2', 'ph4f1', 'q4f3', 'ph4f2', 'q4f4', 'ph4f3', 'rv4f1', 'ml4B2', 'rv4A2', 'u4visoff',
                        /* (18 Nov: the green ones' own voices) */
                        'u4sv1', 'u4sv2', 'u4sv3', 'u4sv4', 'u4sv5', 'u4svL'];
    function blessBegin(R, fresh) {
      play.learned = new Set(['r', 'm', 'f', 'o', 'a']); play.spoke = true; play.told = true; play.opened = true; play.looked = new Set(['1', '2', '3']);
      play.closed = true; play.read = true; play.peeked = R.peeked; play.water = R.water; play.appaGone = R.appaGone;
      if (warmSounds) warmSounds(WARM_BLESS);
      if (kit && kit.vision) kit.vision(false);
      const run = play.run;
      if (fresh) {
        /* the change of places in the black (v16.1: a scene change happens in the black): Grandmaster Pho up from his
           stool and behind her chair; the order waits for Mala's lamp and the room going dark */
        play.busy = true; setPhase('bless', { complete: false }); if (kit) kit.fade(1, 0.5);
        after(0.6, () => { if (!live(run)) return; blessStage(); if (kit) kit.fade(0, 0.7);
          after(0.9, () => { if (!live(run)) return; say('ph4b0', cast.phoB);
            queueFn(() => { lightLamp(() => { if (!live(run)) return; roomDies(() => { if (!live(run)) return; play.busy = false; objectiveFor('bless'); }); }); }); }); });
      } else {
        blessStage(); lampLit(true); roomDark(true); setPhase('bless', { complete: false });
        if (play.water) { giveWater(true); after(0.8, () => { if (live(run)) briefFight(); }); }
      }
    }
    /* who stands where for the blessing */
    function blessStage() {
      lookAt0('FLAT');
      castHome();
      whenReady(cast.pho, (P) => { P.group.visible = false; });
      whenReady(cast.phoB, (P) => { put(P, P.home.x, P.home.z, P.home.ry); P.group.visible = true; rest(P, 0); });
      /* Mala kneeling at her mother's lamp, to light it and to keep it through the night (18 Nov: she was sent to the lamp
         from the fan in full view and back again, and her lighting take, made for a lamp at head height, lit a floor lamp
         at 1.6 m); Ravi by the fan */
      whenReady(cast.mala, (P) => { put(P, MALA_LAMP.x, MALA_LAMP.z, 0); P.rest = MALA_KNEEL; rest(P, 0); });
      spiritsHome();
      /* Appa stands between his family and the dark (§4.3) */
      whenReady(spirits.appa, (P) => { if (play.appaGone) { P.group.visible = false; P.gone = true; return; } put(P, APPA_GUARD.x, APPA_GUARD.z, faceTo(APPA_GUARD.x, APPA_GUARD.z, CHAIR.x, CHAIR.z + 1.2)); });
      castSolid();
    }
    const APPA_GUARD = { x: 1.72, z: 2.85 };
    /* MALA LIGHTS HER MOTHER'S LAMP: she goes to it, lights its wick, and its flame takes; in the vision the altar's glow
       brightens a little */
    function lightLamp(done) {
      const run = play.run;
      /* (she kneels there already, placed in the black: the match, the flame taking under her hands, and the room goes) */
      after(0.6, () => { if (!live(run)) return; fx('u4match', 0.7, panOf(LAMP_AT)); });
      after(1.1, () => { if (!live(run)) return; lampLit(false); });
      after(2.8, () => { if (!live(run)) return; if (done) done(); });
    }
    /* the lamp's flame: three small flames on its top dish, additive, flickering on the chapter's clock */
    const flameTex = (() => { const [c, x] = cnv(64); const g = x.createRadialGradient(32, 40, 2, 32, 36, 30);
      g.addColorStop(0, 'rgba(255,248,210,1)'); g.addColorStop(0.35, 'rgba(255,190,80,0.85)'); g.addColorStop(1, 'rgba(255,120,20,0)'); x.fillStyle = g; x.fillRect(0, 0, 64, 64); return tex(done(THREE, c, false)); })();
    const flameMat = new THREE.SpriteMaterial({ map: flameTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, color: 0xffffff });
    mats.push(flameMat);
    const flames = [0, 1, 2].map(i => { const s = new THREE.Sprite(flameMat); const a = i * 2.094; s.position.set(LAMP_AT.x + Math.cos(a) * 0.055, LAMP_AT.y + 0.03, LAMP_AT.z + Math.sin(a) * 0.055); s.scale.set(0.035, 0.06, 1); s.visible = false; world.add(s); return s; });
    let lampK = 0, lampTo = 0;
    function lampLit(now) { lampTo = 1; if (now) lampK = 1; }
    function lampTick(wdt, t) {
      lampK += (lampTo - lampK) * Math.min(1, wdt * 1.2);
      for (let i = 0; i < flames.length; i++) { const f = flames[i]; f.visible = lampK > 0.02; if (!f.visible) continue;
        const fl = 0.85 + 0.15 * Math.sin(t * 13 + i * 2) + 0.08 * Math.sin(t * 31 + i);
        f.scale.set(0.034 * lampK * fl, 0.062 * lampK * (0.9 + 0.2 * Math.sin(t * 9 + i * 3)), 1); }
      for (const a of altarAuras) if (a.set) a.set('uFill', SPIRIT.altar.fill + 0.05 * lampK);   // (her lamp lit: her goddess's light a little brighter)
    }
    /* THE ROOM TURNS: the tube light dies, the fan stops, the TV dies; the lamp and the estate through the grilles are
       all the light there is (the DARK look). A beat of near black first, where Mala goes back to her brother */
    function roomDies(done) {
      const run = play.run;
      fx('u4tubedie', 0.75, panOf(TUBE_AT)); tubeFlicker();
      after(0.5, () => { if (!live(run)) return; fx('u4fanstop', 0.6, panOf(FAN_AT)); play.fanTo = 0; });
      after(1.1, () => { if (!live(run)) return; fx('u4tvdie', 0.5, panOf({ x: ROOMS.living.x0 + 0.3, z: 1.92 })); roomDark(false); });
      after(3.2, () => { if (!live(run)) return; if (done) done(); });
    }
    function roomDark(now) {
      lookName = 'DARK'; if (kit) kit.daylight(DARK, now ? 0 : 1.6); tubeLevel(0);
      play.fanTo = 0; if (now) play.fanK = 0;
      phoLook.level.value = 0.55;
    }
    /* THE HOLY WATER: the small silver bowl by his teacher's large one; taken, it is his (ITEM UNLOCKED, rare) */
    const bowlOnFloor = stand('w4waterbowl', SMALLBOWL_AT.x, 0, SMALLBOWL_AT.z, 0.4, { lift: 3 });
    const bowlHold = new THREE.Group();
    stand('w4waterbowl', 0, -0.035, 0, 0, { parent: bowlHold, lift: 3, near: true });
    bowlHold.scale.setScalar(0.62);
    if (kit && kit.weaponHold) kit.weaponHold(bowlHold, { pos: [-0.02, -0.075, -0.15], rot: [0.12, 0, 0] });
    function giveWater(now) {
      play.water = true; bowlOnFloor.visible = false;
      if (kit) { if (!kit.has('holywater') && !kit.equipped('holywater')) kit.give('holywater'); kit.equip('holywater'); kit.urge(null); }
      if (!now) saveMark();
    }
    function takeWater() {
      if (play.busy || play.water || phase !== 'bless') return false;
      /* (the order is done the moment the bowl is in his hands: 18 Nov, played by a finger, "Take the holy water" came back
         under the fight's brief after the splash, the order cleared nowhere: objectiveFor waits while play is busy) */
      play.busy = true; if (kit) { kit.waypoint(null); kit.objective(null); }
      giveWater(false);
      const run = play.run, go = () => { if (!live(run)) return; play.busy = false; briefFight(); };
      if (kit && kit.unlock && kit.unlock('holywater', { onClose: go })) return true;
      after(0.4, go); return true;
    }
    /* THE BRIEF (instructions first, a START, its own moving picture: Chad's rules of v8.7 and v18.2) */
    function briefFight() {
      if (!kit || play.briefed) return;
      play.briefed = true;
      const run = play.run;
      kit.event({ kind: 'guard', label: W.guardTitle, brief: TOUCHY ? W.guardBrief : W.guardBriefKey }).then((r) => {
        if (!live(run)) return;
        if (!r || r.aborted) { play.briefed = false; return; }
        fightBegin();
      });
    }

    /* ---------------------------------------------------------------- THE FIGHT: three waves over the chant
       Green shapes come out of the dark (the kitchen, the passage, the bedrooms, the door) toward the lamp and the
       blessing, to Amma, her teacher, her children and him: hungry ones come for a share of what is given (§2.10).
       A flick of water that reaches one sends it back, flaring and sighing (released, never destroyed: §2.9). One that
       reaches a family member chills them (Awareness falls); one that reaches him takes his nerve and throws the
       picture; one that reaches Grandmaster Pho or Amma slows the blessing. Appa stands between his family and the dark
       (the hungry ones are slowed near him); water thrown at him makes him turn, look at the student and fade for the
       night. The altar cannot be aimed at. Nothing ends it but the chant. */
    const FROM = { bed3: { x: ROOMS.living.x0 + 0.15, z: 3.15 }, master: { x: 1.95, z: ROOMS.living.z1 - 0.15 }, passage: { x: 3.25, z: 4.3 },
                   kitchen: { x: 5.6, z: 9.2 }, corner0: CORNERS[0], corner1: CORNERS[1], door: { x: 0.0, z: 0.45 }, store: { x: -1.3, z: 4.8 } };
    const FAMILY = { ravi: () => cast.ravi.group.position, mala: () => cast.mala.group.position, amma: () => cast.amma.group.position,
                     pho: () => cast.phoB.group.position, me: () => yaw.position };
    const FIGHT = { secs: 116, waves: [
      /* (18 Nov: Mala keeps her mother's lamp, kneeling at the shrine's right end, so what comes for her comes along the
         back wall from the master bedroom's door; the shape under the dining table goes for her brother by the fan: from
         there to her it crawled through the master bedroom's wall, and from bedroom 3 to her through her mother's chair) */
      { at: 2.5, list: [['corner0', 'amma', 0.30], ['corner1', 'ravi', 0.28], ['bed3', 'me', 0.30]] },
      { at: 38, list: [['master', 'ravi', 0.34], ['passage', 'pho', 0.33], ['door', 'me', 0.34], ['kitchen', 'amma', 0.32]] },
      { at: 76, list: [['master', 'mala', 0.37], ['store', 'me', 0.36], ['passage', 'amma', 0.34], ['kitchen', 'amma', 0.26, 'large']] } ],
      /* THE SURGE (Chad, 18 Nov: "when there are too many green entities coming towards the end"; "this dramatic sequence
         should happen only at the end when many green entities appear and it feels impossible for the player to clear. The
         player needs to feel desperate first"): at the blessing's 0.70, twelve at once from every door and corner, quick, most
         of them for her, and two more every 1.6 s while it lasts; the blessing held at 0.82 until the call is answered. He
         calls after 7 s of it (after 4 if her life is under 40) */
      surgeAt: 0.70, hold: 0.82, trickle: 1.6, callAfter: 7, callLow: { secs: 4, hp: 40 },
      surge: [['door', 'amma', 0.46], ['bed3', 'amma', 0.44], ['master', 'amma', 0.45], ['passage', 'amma', 0.47], ['kitchen', 'amma', 0.44],
              ['store', 'amma', 0.45], ['corner0', 'amma', 0.43], ['corner1', 'pho', 0.44], ['door', 'me', 0.45], ['bed3', 'ravi', 0.42],
              ['master', 'mala', 0.43], ['passage', 'me', 0.46]],
      /* EMPOWERED, to the blessing's end (R28, R29: "the green entities should swarm in the screen in dramatic numbers ... they
         keep spawning even after getting cleared ... until the whole timer is completed"): a batch of seven to nine every
         1.8 s, rising round HER, 1.7 to 2.8 m out on every side (through her walls and floor, as they do), so they come at
         her where he is looking; never more than sixteen in the room (freeBody). (18 Nov, photographed: from the room's
         doors, five to seven at a time, six were in the room and most of them out of his view) */
      batch: { every: 1.8, min: 7, max: 9, r0: 1.7, r1: 2.8 } };
    const REACH = { me: 0.75, amma: 0.62, pho: 0.6, ravi: 0.55, mala: 0.55 };
    /* AMMA'S LIFE IN HIS KEEPING (Chad, 18 Nov: "There must be consequences if the spirit entities in green gets to the lady in
       wheelchair. Everytime the green spirits get to her, she screams one time, and her health bar drops. Put a health bar on
       the lady in wheelchair. If her health bar drops to 0, the player loses this game and chapter and has to restart
       again"): a green one that reaches her takes 9 of her 100 (the large one 16), and again every 4.5 s it stays; she cries
       out each time (her three cries in turn, never two within 0.6 s); from the surge until 4 s into the gold she is never
       taken under 15 (the call is the story's, and comes whatever he did), and at 0 the chapter is lost (ammaLost) */
    const LIFE = { wander: 9, large: 16, again: 4.5, floor: 15, grace: 4 };
    const CRIES = ['u4ascream1', 'u4ascream2', 'u4ascream3'];
    /* GRANDMASTER PHO CALLS HIM BACK TO HIS SIGHT (Chad, 18 Nov: "If the player gets out of spirit vision for too long and is
       not doing anything to chase the green spirits away, grandmaster pho will have a voice line that tells him to go back
       into spirit vision to chase the entities away. This voiceline can keep repeating as long as the player is not in
       spirit vision"): six seconds shut with green ones in the room and none of them reached by his water in those six, then
       again eleven seconds after each; never while his sight is held shut for him, nor in the call; his three lines in turn */
    const NAG = { first: 6, again: 11, lines: ['ph4b3', 'ph4b4', 'ph4b5'] };
    function fightBegin() {
      const F = play.fight = { on: true, t: 0, k: 0, wave: 0, shapes: [], fed: 0, families: 0, famCost: 0, captions: 0, ended: false,
                               hp: 100, cries: 0, criedAt: -99, lost: false, call: null, callT: 0, trickleAt: 0, goldT: 0, batchAt: 0,
                               cleared: 0, chantHeld: false, shutFor: 0, nagNext: NAG.first, nags: 0, lastStrike: -99, urge: null,
                               saidMala: false, saidRavi: false, seed: 0x4c4f0d,
                               vseed: 0x5f1e0d, voxAt: 2.5, voxBigAt: 0, voxLast: '', voxUntil: [] };
      if (kit) { kit.bar(0); if (kit.health) kit.health({ label: W.ammaBar, k: 1, at: () => { const h = AMMA_HEAD(); return [h.x, h.y + 0.32, h.z]; } }); }
      objectiveFor('bless');
      /* the two in the corners are the first wave's: they wake */
      whenReady(cast.phoB, (P) => handOnHead(P, true));
      fightMusOn();
    }
    function shapeOf(i, large) {
      const P = large ? spirits.large : spirits.wander[i]; if (!P || !P.ready) return null;
      P.group.visible = true; P.gone = false; P.alpha = 1; if (P.fx) { P.fx.set('uAlpha', 1); P.fx.set('uFill', large ? SPIRIT.large.fill : SPIRIT.wander.fill); }
      return P;
    }
    let wanderNext = 2;
    function waveStart(w) {
      const F = play.fight, run = play.run;
      for (const [from, to, v, kind] of w.list) {
        const large = kind === 'large';
        const P = large ? shapeOf(0, true) : from === 'corner0' ? shapeOf(0) : from === 'corner1' ? shapeOf(1) : freeBody();
        if (!P) continue;
        const at = FROM[from]; if (!/^corner/.test(from)) put(P, at.x, at.z, faceTo(at.x, at.z, FAMILY[to]().x, FAMILY[to]().z));
        take(P, large ? 'lumber' : (P.slot % 2 ? 'creep' : 'crawl'), 0.4);
        F.shapes.push({ P, to, v, need: large ? 3 : 1, hits: 0, state: 'come', t: 0, back: 0, fedAt: -99 });
      }
      if (w.list.some(r => r[3] === 'large')) fx('u4large', 0.8, panOf(FROM.kitchen));
      fx('u4whisper', 0.55, 0);
      /* (Chad, 18 Nov: "Have some dramatic voicelines along the way"): the second wave, his; the large one, his and his
         teacher's word on it */
      if (w === FIGHT.waves[1]) say('q4f1', null);                       // "More of them. From the doors."
      if (w.list.some(r => r[3] === 'large')) { say('q4f2', null); phoQueued('ph4f1'); }   // "What is that...?" / "That big one is strong. Keep flicking the holy water at it until it goes."
      void run;
    }
    /* a free body for one more of them: one no living shape in the fight is wearing (one still fading wears it too), taken in
       turn from where the last was taken; none, and nothing more comes (never more than sixteen in the room). The two that
       wait in the corners are the first wave's */
    function freeBody() {
      const F = play.fight, used = new Set();
      for (const S of F.shapes) if (S.state !== 'gone') used.add(S.P);
      for (let n = 0; n < WANDER_N; n++) {
        const i = (wanderNext + n) % WANDER_N, P = spirits.wander[i];
        if (used.has(P) || !P.ready || (i < 2 && F.wave < 1)) continue;
        wanderNext = i + 1; return shapeOf(i);
      }
      return null;
    }
    /* the fight's own seeded stream (v6.15: nothing random unseeded; begun again with every fight) */
    function fightRnd() { const F = play.fight; F.seed = (F.seed * 1103515245 + 12345) >>> 0; return (F.seed >>> 8) / 16777216; }
    /* THE GREEN ONES' OWN VOICES (Chad, 18 Nov: "Each entity should also make its own sounds and voices , like groaning
       sounds or angry sounds"): now and then one of them is heard from where it is, a groan, a snarl, a moan or a rasp
       (never the same twice running); the large one growls in its own deeper voice; one that reaches someone, or is struck
       and not yet sent, shrieks. Panned by where it stands, quieter further off and while anyone speaks, never more than
       two at once, closer together in the swarm. A cosmetic stream of its own (v6.15: the fight's own draws stay as they
       were), begun again with every fight */
    const VOX = ['u4sv1', 'u4sv2', 'u4sv3', 'u4sv4'], VOX_LEN = { u4sv1: 1.8, u4sv2: 1.4, u4sv3: 2.2, u4sv4: 1.4, u4sv5: 1.2, u4svL: 2.8 };
    function voxRnd() { const F = play.fight; F.vseed = (F.vseed * 1664525 + 1013904223) >>> 0; return F.vseed / 4294967296; }
    function voxPlay(name, at, vol) {
      const F = play.fight; if (!F || !at) return false;
      F.voxUntil = F.voxUntil.filter(u => u > F.t);
      if (F.voxUntil.length >= 2) return false;
      const d = Math.hypot(at.x - yaw.position.x, at.z - yaw.position.z), near = Math.max(0.4, Math.min(1, 2.4 / Math.max(1, d)));
      fx(name, vol * near * (dayClock.t < speak.until ? 0.6 : 1), panOf(at));
      F.voxUntil.push(F.t + VOX_LEN[name]); return true;
    }
    function voxTick() {
      const F = play.fight; if (!F || !F.on || F.t < F.voxAt) return;
      const live = F.shapes.filter(S => (S.state === 'come' || S.state === 'feed') && S.P.group.visible);
      if (!live.length) { F.voxAt = F.t + 0.8; return; }
      const big = live.find(S => S.P === spirits.large), small = live.filter(S => S !== big);
      let S = null, name = '';
      if (big && F.t >= F.voxBigAt) { S = big; name = 'u4svL'; F.voxBigAt = F.t + 3.6 + 2.2 * voxRnd(); }
      else if (small.length) {
        S = small[Math.floor(voxRnd() * small.length)];
        let k = Math.floor(voxRnd() * VOX.length); if (VOX[k] === F.voxLast) k = (k + 1 + Math.floor(voxRnd() * (VOX.length - 1))) % VOX.length;
        name = VOX[k];
      }
      if (S && voxPlay(name, S.P.group.position, name === 'u4svL' ? 0.9 : S.state === 'feed' ? 0.72 : 0.58) && name !== 'u4svL') F.voxLast = name;
      F.voxAt = F.t + (F.call === 'gold' || F.call === 'surge' || F.call === 'asking' ? 0.5 + 0.45 * voxRnd() : 1.0 + 1.2 * voxRnd());
    }
    /* one more of them, at a door or a corner (a hand's spread round it, so a batch never stands in one place), for one of
       the people in the room */
    function spawnAt(from, to, v) {
      const F = play.fight, P = freeBody(); if (!P) return null;
      const at = FROM[from], x = at.x + (fightRnd() - 0.5) * 0.5, z = at.z + (fightRnd() - 0.5) * 0.5, tg = FAMILY[to]();
      put(P, x, z, faceTo(x, z, tg.x, tg.z));
      take(P, P.slot % 2 ? 'creep' : 'crawl', 0.3);
      const S = { P, to, v, need: 1, hits: 0, state: 'come', t: 0, back: 0, fedAt: -99 };
      F.shapes.push(S); return S;
    }
    function fightTick(wdt) {
      const F = play.fight; if (!F || !F.on) return;
      if (getState() !== 'play') return;
      F.t += wdt; fightMusTick();
      while (F.wave < FIGHT.waves.length && F.t >= FIGHT.waves[F.wave].at) waveStart(FIGHT.waves[F.wave++]);
      /* the blessing's own pace: slowed while anything crowds her or her teacher (empowered, at its full pace: R29) */
      let slow = 1; if (F.call !== 'gold') for (const S of F.shapes) if (S.state === 'feed' && (S.to === 'amma' || S.to === 'pho')) slow *= 0.5;
      /* (never under a third of its pace: crowded, the blessing slows, and a fight left alone still ends in about five
         minutes, not twelve: 18 Nov) */
      F.k = Math.min(1, F.k + wdt / FIGHT.secs * Math.max(0.35, slow));
      stakesTick(wdt); if (!F.on) return;
      voxTick();
      if (kit) kit.bar(F.k);
      if (!F.chantHeld) while (F.captions < CHANT.length && F.k > CHANT[F.captions].at) chantSing(CHANT[F.captions++]);
      const appa = spirits.appa, ag = appa.group.position;
      for (const S of F.shapes) {
        const P = S.P; if (S.state === 'gone') continue;
        S.t += wdt;
        if (S.state === 'leave') { S.leave += wdt; const u = Math.min(1, S.leave / 1.1); P.alpha = 1 - u; if (P.fx) { P.fx.set('uAlpha', 1 - u); P.fx.set('uFill', 0.1 + 0.9 * (1 - u) * (1 - u)); } P.group.position.y += wdt * 0.35;
          if (u >= 1) { S.state = 'gone'; P.group.visible = false; P.gone = true; } continue; }
        const tg = FAMILY[S.to](), dx = tg.x - P.group.position.x, dz = tg.z - P.group.position.z, d = Math.hypot(dx, dz);
        if (S.back > 0) { S.back -= wdt; const k = Math.min(1, wdt * 1.6); P.group.position.x -= dx / Math.max(0.01, d) * 0.9 * k; P.group.position.z -= dz / Math.max(0.01, d) * 0.9 * k; continue; }
        if (S.state === 'come') {
          let v = S.v;
          /* Appa's watch: near him, the ones that come for his family are slowed */
          if (!play.appaGone && appa.group.visible && (S.to === 'ravi' || S.to === 'mala') && Math.hypot(ag.x - P.group.position.x, ag.z - P.group.position.z) < 1.3) v *= 0.3;
          if (d > REACH[S.to]) { P.group.position.x += dx / d * v * wdt; P.group.position.z += dz / d * v * wdt; P.group.rotation.y = faceTo(P.group.position.x, P.group.position.z, tg.x, tg.z); P.group.position.y = flatGround(P.group.position.x, P.group.position.z); }
          else { S.state = 'feed'; feed(S); if (!F.on) return; }
        } else if (S.state === 'feed') {
          if (S.to === 'me') { if (d > REACH.me + 0.5) S.state = 'come'; else if (S.t - S.fedAt > 4) feed(S); }
          else if (S.t - S.fedAt > (S.to === 'amma' ? LIFE.again : 6)) feed(S);
          if (!F.on) return;                                     // (her life ran out on this one: the loss has begun)
          P.group.rotation.y = faceTo(P.group.position.x, P.group.position.z, tg.x, tg.z);
        }
      }
      if (F.k >= 1 && !F.ended) fightEnd();
    }
    /* one reaches its mark: what it costs */
    function feed(S) {
      const F = play.fight; S.fedAt = S.t; F.fed++;
      if (S.to !== 'me') voxPlay(S.P === spirits.large ? 'u4svL' : 'u4sv5', S.P.group.position, 0.62);
      if (S.to === 'me') {
        fx('u4chill', 0.8, 0);
        const room = sanityNow() - HEAT.floor; if (room > 0) kit.award('sanity', -Math.min(room, 6), { minigame: true });
        if (kit.chill) { kit.chill(0.7, { secs: 0.25 }); const run = play.run; after(1.6, () => { if (live(run) && kit) kit.chill(0, { secs: 1.2 }); }); }
        if (kit.smear) { kit.smear(0.55, { secs: 0.2 }); const run = play.run; after(1.0, () => { if (live(run) && kit) kit.smear(0, { secs: 0.8 }); }); }
        if (kit.pulse) kit.pulse({ bpm: 160, secs: 0.5, erratic: 0.4 });
        S.back = 1.2; S.state = 'come';
      } else if (S.to === 'ravi' || S.to === 'mala') {
        F.families++;
        fx(S.to === 'ravi' ? 'u4gaspm' : 'u4gaspf', 0.75, panOf(FAMILY[S.to]()));
        /* (what reaches her children costs his awareness, up to 10 in the fight: 18 Nov, a slow finger let one reach them 78
           times, each a 2, and the stat was gone by the fight's middle; past the cap they still gasp, and still count) */
        if (F.famCost < 10) { F.famCost += 2; kit.award('awareness', -2, { minigame: true }); }
        /* (Mala kneeling at the lamp gasps where she kneels: her scream is a standing take, and it stood her up and knelt her
           down again in a second) */
        const P = cast[S.to]; if (P === cast.mala && P.rest !== MALA_KNEEL) whenReady(P, (Q) => { span(Q, 'scream', 0.4, 2.2, 1.0, { then: () => rest(Q, 0.8) }); });
      } else if (S.to === 'amma') { F.families++; ammaHurt(S); }
    }
    /* one reaches her: what it takes of her life, her cry, her children's, and the loss at 0 */
    function ammaHurt(S) {
      const F = play.fight; if (!F || !F.on || F.lost) return;
      const floor = (F.call && F.call !== 'gold') || (F.call === 'gold' && F.goldT < LIFE.grace) ? LIFE.floor : 0;
      F.hp = Math.max(Math.min(F.hp, floor), F.hp - (S.P === spirits.large ? LIFE.large : LIFE.wander));
      if (kit && kit.health) kit.health({ k: F.hp / 100 });
      const now = wallNow();
      if (now - F.criedAt > 0.6) { F.criedAt = now; fx(CRIES[F.cries++ % CRIES.length], 0.9, panOf(CHAIR)); }
      /* her children, the first times they see her hurt (Mala kneels at the lamp: her word without a standing take) */
      if (!F.saidMala && F.hp <= 80) { F.saidMala = true; say('ml4B2', null); }                 // "Amma!"
      else if (!F.saidRavi && F.hp <= 55) { F.saidRavi = true; say('rv4f1', cast.ravi, false); }   // "Amma! What's happening to her?"
      if (F.hp <= 0) ammaLost();
    }
    /* HER LIFE RUNS OUT: the chapter is lost (the fifty-third seam, kit.lose): its own film (FILMS.lost), its card's two lines,
       the save put back at the chapter's start, Retry from there (Chad: "the player loses this game and chapter and has to
       restart again") */
    function ammaLost() {
      const F = play.fight; if (!F || F.lost) return;
      F.lost = true; F.on = false; F.chantHeld = true;
      fightMusOff(); chantStop(); chantNow = null; lineQ.length = 0;
      if (kit) { kit.bar(null); kit.captions(null); if (kit.health) kit.health(null); if (kit.visionUrge) kit.visionUrge(false);
        if (kit.edge) kit.edge(null); if (kit.sprayColor) kit.sprayColor(null); }
      if (!kit || !kit.lose || !kit.lose({ film: 'lost', say: W.lostSay, teaching: W.lostTeach })) play.loseWait = true;   // (refused: asked again on the next frame of play)
    }
    /* the water reaches one (stage.onShot): released, or staggered (the large one takes three) */
    const hitOwner = new Map();
    for (const P of [spirits.oppress, spirits.appa, spirits.large].concat(spirits.wander)) if (P.hit) hitOwner.set(P.hit, P);
    /* THE FLICK'S REACH (Chad, 18 Nov: "make the aoe of the water flicking bigger"): every green one whose middle is within
       0.42 m of the flick's line, and 0.11 m more for each metre out (a metre at most), out to 8 m, is reached with the one
       the line struck; Appa only when it is aimed at him (his sphere is the one the line must meet: "Not everything you see
       is against you"). AND THE GOLDEN WATER (R27: "every flick from it clears all green entities on the whole screen in a
       single flick"): every green one inside his view is sent back, and the bowl stays full */
    const FAN = { r0: 0.42, perM: 0.11, max: 1.0, far: 8 };
    const _fr = new THREE.Vector3(), _fq = new THREE.Vector3(), _frus = new THREE.Frustum(), _frm = new THREE.Matrix4(), _fsph = new THREE.Sphere();
    function onShot(r) {
      const F = play.fight;
      if (F && F.on && F.call === 'gold') { goldFlick(); return; }
      const P = r && r.object ? hitOwner.get(r.object) : null;
      if (r && r.point) fx('u4patter', 0.5, panOf(r.point));
      if (P === spirits.appa) { appaStruck(); return; }
      if (P === spirits.oppress) return;                     // (her teacher's work, not the water's: it does not move)
      if (!F || !F.on) return;
      const reached = [];
      if (P) { const S = F.shapes.find(q => q.P === P && q.state !== 'gone' && q.state !== 'leave'); if (S) reached.push(S); }
      if (r && r.ray) for (const S of F.shapes) {
        if (S.state === 'gone' || S.state === 'leave' || reached.includes(S)) continue;
        const m = S.P.hit; if (!m || !m.visible) continue;
        _fr.copy(m.position).sub(r.ray.origin); const along = _fr.dot(r.ray.direction);
        if (along < 0.15 || along > FAN.far) continue;
        _fq.copy(r.ray.direction).multiplyScalar(along).add(r.ray.origin);
        if (_fq.distanceTo(m.position) <= Math.min(FAN.max, FAN.r0 + FAN.perM * along)) reached.push(S);
      }
      let sent = 0;
      for (const S of reached) if (strike(S)) sent++;
      if (reached.length) F.lastStrike = F.t;
      if (sent) fx('u4release', Math.min(0.95, 0.7 + 0.08 * (sent - 1)), panOf(reached[0].P.group.position));
    }
    /* the water on one of them: sent back (released), or staggered back (the large one takes three) */
    function strike(S) {
      const P = S.P; S.hits++;
      if (P.fx) { P.fx.set('uFill', 0.9); const run = play.run; after(0.25, () => { if (live(run) && P.fx && S.state !== 'leave') P.fx.set('uFill', P === spirits.large ? SPIRIT.large.fill : SPIRIT.wander.fill); }); }
      if (S.hits >= S.need) { S.state = 'leave'; S.leave = 0; return true; }
      S.back = 0.8; S.state = 'come'; voxPlay(P === spirits.large ? 'u4svL' : 'u4sv5', P.group.position, 0.8); return false;
    }
    function goldFlick() {
      const F = play.fight; let n = 0;
      camera.updateMatrixWorld(); _frm.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse); _frus.setFromProjectionMatrix(_frm);
      for (const S of F.shapes) {
        if (S.state === 'gone' || S.state === 'leave') continue;
        const m = S.P.hit; if (!m || !m.visible) continue;
        _fsph.center.copy(m.position); _fsph.radius = m.scale.x; if (!_frus.intersectsSphere(_fsph)) continue;
        S.state = 'leave'; S.leave = -0.25 * ((n * 0.6180339887) % 1); n++;       // (each on its own beat over a quarter second: v6.15)
      }
      fx('u4goldflick', 0.9, 0);
      if (n) { fx('u4goldclear', Math.min(1, 0.78 + 0.03 * n), 0); F.lastStrike = F.t; F.cleared += n; }
      if (kit && kit.ammo) kit.ammo(DATA.weapon.rounds);       // (the golden water never runs dry: no dip in the swarm)
    }
    /* WATER THROWN AT APPA: he turns, looks at the student, and fades for the rest of the night (a price on the card,
       and his teacher's word after) */
    function appaStruck() {
      if (play.appaGone) return;
      play.appaGone = true; saveMark(); bank(W.noteAppa, 0, -4);
      const P = spirits.appa, run = play.run;
      fx('u4husband', 0.8, panOf(P.group.position));
      whenReady(P, (Q) => { span(Q, 'aturn', 0, 2.4, 1.6, { hold: 0.2, holdSecs: 3 }); gaze(Q, 'lens', { reach: 1.0, secs: 0.9 }); });
      let u = 0; const fade = () => { if (!live(run)) return; u = Math.min(1, u + 1 / 50); P.alpha = 1 - u; if (P.fx) P.fx.set('uAlpha', 1 - u); if (u < 1) after(0.05, fade); else { P.group.visible = false; P.gone = true; } };
      after(1.6, fade);
      after(2.2, () => { if (live(run)) phoSoon('ph4b2'); });
    }
    /* the end of the chant: the shapes thin away; silence but for the lamp's flame and her breathing */
    /* HIS CHANT (the plan's D13; masters/v27.0/chant/build.py): each line sung by him while its words are on screen,
       twice with a breath between (its caption stands for both), from where he stands; four times through the blessing
       at its own pace (the bar), the two lines in turn. Only ever under its caption: a chant with words is captioned
       (v21.31) */
    const CHANT_GAP = 1.2;
    const CHANT = [{ at: 0.06, n: 'u4chant1', len: 5.98, cap: 'cap1' }, { at: 0.30, n: 'u4chant2', len: 8.94, cap: 'cap2' },
                   { at: 0.55, n: 'u4chant1', len: 5.98, cap: 'cap1' }, { at: 0.80, n: 'u4chant2', len: 8.94, cap: 'cap2' }];
    let chantNodes = [], chantNow = null, chantTok = 0;
    function chantStop() { chantTok++; for (const a of chantNodes) { try { a.stop(); } catch (e) { } } chantNodes = []; }
    function chantLine(C) {
      chantStop(); chantNow = C; if (!worldSfx || (soundOff && soundOff())) return;
      const tok = chantTok, g = cast.phoB.group.position, sing = () => { if (tok !== chantTok) return;
        const a = worldSfx(C.n, 0.95, 1, panAt(g.x, g.z)); if (!a) return;
        chantNodes.push(a); a.addEventListener('ended', () => { const i = chantNodes.indexOf(a); if (i >= 0) chantNodes.splice(i, 1); }); };
      sing(); const run = play.run; after(C.len + CHANT_GAP, () => { if (live(run) && play.fight && play.fight.on) sing(); });
    }
    /* a chant line sung, its caption with it (both of its times and the breath between) */
    function chantSing(C) {
      chantLine(C);
      if (kit && kit.captions) kit.captions([{ at: 0, end: 2 * C.len + CHANT_GAP + 0.4, text: W[C.cap], sub: W[C.cap + 'Sub'] }]);
    }
    /* HE BREAKS OFF HIS CHANT TO SPEAK (18 Nov: his "Close. Breathe." and his word after the water reached Appa were said over
       his own chant, one man chanting and talking at once): the line he is singing fades in a quarter of a second, he
       speaks, and then begins that line again from its start, under its caption. Between lines nothing is cut */
    /* (a line refused while another voice is live is never taken as said, and his chant is never broken off for a line
       that does not come: 18 Nov, sayLine's refusal is never ignored, v9.5) */
    function phoSpeaks(name, onStart) {
      if (dayClock.t < speak.until || speak.pending || lineQ.length) return false;
      chantBreak((SECS[name] || 2.5) + 0.9);
      return sayLine(name, 1, onStart);
    }
    /* the line he is singing faded in a quarter of a second; begun again from its start `resumeIn` seconds later, unless the
       chant has moved on or is held (the call) */
    function chantBreak(resumeIn) {
      const F = play.fight, singing = !!(F && F.on && chantNow && chantNodes.length);
      if (!singing) return;
      const tok = ++chantTok, nodes = chantNodes; chantNodes = [];
      for (const a of nodes) { try { const g = a.__g && a.__g.gain, t = a.context.currentTime;
        if (g) { g.cancelScheduledValues(t); g.setValueAtTime(g.value, t); g.linearRampToValueAtTime(0.0001, t + 0.25); }
        a.stop(t + 0.3); } catch (e) { } }
      if (kit && kit.captions) kit.captions(null);
      if (resumeIn == null) return;
      const C = chantNow, run = play.run;
      after(resumeIn, () => { if (live(run) && play.fight && play.fight.on && !play.fight.chantHeld && chantTok === tok) chantSing(C); });
    }
    /* his word in the order of the lines (the queue), his chant broken off as it begins */
    function phoQueued(name) { queueFn(() => chantBreak((SECS[name] || 2.5) + 0.9)); queueLine(name, () => talk(cast.phoB, SECS[name] || 2.5)); }
    /* his word as soon as the room is quiet for it (asked again every half second, a few seconds at most) */
    function phoSoon(name, tries = 12) {
      const run = play.run;
      const go = (n) => { if (!live(run)) return; if (!phoSpeaks(name, () => talk(cast.phoB, SECS[name] || 2.6)) && n > 0) after(0.5, () => go(n - 1)); };
      go(tries);
    }
    function fightEnd() {
      const F = play.fight; F.ended = true; F.on = false; fightMusOff(); chantStop(); chantNow = null;
      /* (each shape still in the room goes on its own beat: a golden-ratio spread over 0.4 s by its place in the list, the
         same on every run and every replay: v6.15, nothing random unseeded) */
      F.shapes.forEach((S, i) => { if (S.state !== 'gone' && S.state !== 'leave') { S.state = 'leave'; S.leave = -0.4 * ((i * 0.6180339887) % 1); } });
      if (kit) { kit.bar(null); kit.captions(null); if (kit.health) kit.health(null); if (kit.visionUrge) kit.visionUrge(false);
        if (kit.edge) kit.edge(null); if (kit.sprayColor) kit.sprayColor(null); }
      if (F.families <= 1) bank(W.noteKept, 0, 4);
      whenReady(cast.phoB, (P) => handOnHead(P, false));
      if (kit && kit.vision) kit.vision(false);
      setPhase('kept');
      const run = play.run;
      after(2.6, () => { if (live(run)) trance(); });
    }
    /* ---------------------------------------------------------------- THE STAKES AND THE CALL (Chad's two messages of
       18 Nov: plan §0 R16 to R29), every frame of the fight after the blessing's pace: the surge, the call, the golden
       swarm; his teacher calling him back to his sight; and what the eye button asks */
    function stakesTick(wdt) {
      const F = play.fight, open = visOpen();
      let live = 0; for (const S of F.shapes) if (S.state === 'come' || S.state === 'feed') live++;
      if (!open && !play.closeHold) F.shutFor += wdt; else F.shutFor = 0;
      if (!F.call && F.k >= FIGHT.surgeAt) surgeBegin();
      if (F.call === 'surge') { F.callT += wdt; if (F.callT >= FIGHT.callAfter || (F.callT >= FIGHT.callLow.secs && F.hp < FIGHT.callLow.hp)) callBegin(); }
      if ((F.call === 'surge' || F.call === 'asking') && (F.trickleAt -= wdt) <= 0) {
        F.trickleAt = FIGHT.trickle; const keys = Object.keys(FROM);
        for (let i = 0; i < 2; i++) spawnAt(keys[Math.floor(fightRnd() * keys.length)], fightRnd() < 0.75 ? 'amma' : 'me', 0.44 + 0.06 * fightRnd());
      }
      if (F.call && F.call !== 'gold') F.k = Math.min(F.k, FIGHT.hold);          // (the blessing stalls under the swarm until the call is answered)
      if (F.call === 'gold') { F.goldT += wdt; if ((F.batchAt -= wdt) <= 0) { F.batchAt = FIGHT.batch.every; goldBatch(); } }
      nagTick(open, live);
      urgeTick(open, live);
      if (F.shapes.length > 48) F.shapes = F.shapes.filter(S => S.state !== 'gone');      // (the gone, let go of)
    }
    /* THE SURGE: twelve at once from every door and corner, the room's whisper rising, his heart kicking */
    function surgeBegin() {
      const F = play.fight; F.call = 'surge'; F.callT = 0; F.trickleAt = FIGHT.trickle;
      if (kit && kit.itemWarm) kit.itemWarm('amulet');                          // (his amulet's model ready before it is called: R33)
      for (const [from, to, v] of FIGHT.surge) spawnAt(from, to, v);
      fx('u4surge', 0.95, 0); fx('u4whisper', 0.75, 0);
      if (kit && kit.pulse) kit.pulse({ bpm: 172, secs: 1.0, erratic: 0.5 });
    }
    /* THE CALL: he shouts to his teacher; his teacher breaks off his chant for his word; he calls out; the amulet answers */
    function callBegin() {
      const F = play.fight; F.call = 'asking';
      say('q4f3', null);                                                      // "Grandmaster, there are way too many of them!"
      queueFn(() => chantHush());                                              // (his chant broken off for his word, and held until the gold)
      queueLine('ph4f2', () => talk(cast.phoB, SECS.ph4f2 || 2.6));           // "Call out to Luang Phor Phiboon, now!"
      say('q4f4', null);                                                      // "Luang Phor Phiboon... please, help us."
      queueFn(() => showAmulet());
    }
    function chantHush() { const F = play.fight; if (F) F.chantHeld = true; chantBreak(null); }
    /* HIS AMULET (Chad: "the luang phor phiboon amulet in its full 3d rotating model suddenly and dramatically appears in the
       middle of the screen in a golden glow enveloping it, seemingly empowering the user, and then disappears away"; and,
       of build 19's: "there is no need for text at the top and bottom, and i want the effect to be different from the
       'item unlocked' effect. It should not totally obscure the whole screen"): the fifty-fifth seam's SHOWCASE, no words,
       nothing over the room but its light; the fight stands still under it. Its model was made ready under the chapter's
       curtain (`items`), and warmed again at the surge. Build 21 (Chad, 18 Nov: "design a new nicer effect ... The rays
       you showed come from the item unlocked effect"; "floating hovering slight subtle bobbing ... the screen shakes as it
       release its power, and a circular halo glow effect releases from the amulet outwards"): its own entrance, 5.2 s (the
       engine's showcase; at 4.2 the hover had one second, too short to read as a bob): born from gathered light, it turns
       and hovers; 1.2 s before the end it RELEASES ITS POWER (the
       room shakes, halos go out, its sound), and the golden wave goes through the room from that moment; then it goes down
       into the holy water */
    const WAVE_GOLD = { color: 0xffc552, secs: 3.2, reach: 14, trail: 0.12 };
    function showAmulet() {
      const F = play.fight; if (!F || !F.on) return;
      F.call = 'shown'; F.urge = null; F.released = false; if (kit && kit.visionUrge) kit.visionUrge(false);
      const go = () => { if (play.fight === F && F.on) goldBegin(); };
      const release = () => { if (play.fight !== F) return; F.released = true; if (kit && kit.wave) kit.wave(WAVE_GOLD); };
      if (!(kit && kit.unlock && kit.unlock('amulet', { showcase: true, auto: 5.2, sound: 'u4goldcall', releaseSound: 'u4goldpower', onRelease: release, onClose: go }))) go();
    }
    /* EMPOWERED (R26 to R29: "the entire screen seem to have a golden vignette to show the new empowered status, and now the
       water being flicked becomes golden glow instead"): the gold at the edges of his sight (the fifty-sixth seam), the water
       gold; the amulet's light sends back every one in the room at once; his heart steadied; his teacher's word, and his
       chant again; and the swarm */
    function goldBegin() {
      const F = play.fight; F.call = 'gold'; F.goldT = 0; F.batchAt = 1.0; F.urge = null;
      /* (and its light goes out through the room from him, every thing and every outline it crosses burning gold, as his
         sight's own wave does: the fifty-seventh seam. Chad: "empowers with a golden glow that spreads throughout the scene,
         tracing every item and silhouette similar to how the spirit vision works") */
      /* (sent from the showcase's release when it ran, with its sound: here only when it could not be shown. Build 21: 14 m in
         3.2 s with a slow trail, so the room stays traced in gold while it fades: at 26 m in 2.6 s it crossed the room in a
         fifth of a second and was gone) */
      if (!F.released && kit && kit.wave) kit.wave(WAVE_GOLD);
      if (kit) { if (kit.edge) kit.edge({ color: [255, 196, 84], k: 0.85, secs: 1.2 }); if (kit.sprayColor) kit.sprayColor(0xffc24a, { size: 1.6 }); if (kit.ammo) kit.ammo(DATA.weapon.rounds); }
      if (!F.released) fx('u4goldpower', 1, 0);
      /* (the amulet's light reaches her too: her life at least half back. 18 Nov, photographed: held at 15 through the surge,
         she came into the gold two touches from the loss, and the power he was given was spent guarding a last breath) */
      F.hp = Math.max(F.hp, 50); if (kit && kit.health) kit.health({ k: F.hp / 100 });
      let i = 0; for (const S of F.shapes) if (S.state !== 'gone' && S.state !== 'leave') { S.state = 'leave'; S.leave = -0.5 * ((i++ * 0.6180339887) % 1); }
      if (i) fx('u4goldclear', 0.9, 0);
      play.heat = Math.min(play.heat, 0.5);
      if (kit && kit.pulse) kit.pulse({ bpm: 124, secs: 2.2 });
      objectiveFor('bless');
      queueLine('ph4f3', () => talk(cast.phoB, SECS.ph4f3 || 3));            // "Luang Phor Phiboon is with you. Flick the golden water at the green spirits!"
      queueFn(() => { F.chantHeld = false; if (play.fight === F && F.on && chantNow) chantSing(chantNow); });
    }
    /* a batch of five to seven from the room's edges, most of them for her (R28: "the green entities should swarm in the
       screen in dramatic numbers, filling the screen with many of them") */
    function goldBatch() {
      const B = FIGHT.batch, n = B.min + Math.floor(fightRnd() * (B.max - B.min + 1)), a0 = fightRnd() * Math.PI * 2;
      let made = 0;
      for (let i = 0; i < n; i++) {
        const u = fightRnd(), to = u < 0.62 ? 'amma' : u < 0.80 ? 'me' : u < 0.88 ? 'pho' : u < 0.94 ? 'ravi' : 'mala';
        const a = a0 + (i + 0.5 * fightRnd()) * (Math.PI * 2 / n), r = B.r0 + (B.r1 - B.r0) * fightRnd();
        const x = CHAIR.x + Math.sin(a) * r, z = CHAIR.z + Math.cos(a) * r;
        if (Math.hypot(x - yaw.position.x, z - yaw.position.z) < 1.2) continue;      // (never risen on top of him)
        if (!spawnRound(x, z, to, 0.40 + 0.1 * fightRnd())) break; made++; }
      if (made) fx(made > 4 ? 'u4surge' : 'u4whisper', 0.55, 0);
    }
    /* one more of them where it is asked to rise (the gold's ring round her) */
    function spawnRound(x, z, to, v) {
      const F = play.fight, P = freeBody(); if (!P) return null;
      const tg = FAMILY[to](); put(P, x, z, faceTo(x, z, tg.x, tg.z));
      take(P, P.slot % 2 ? 'creep' : 'crawl', 0.3);
      const S = { P, to, v, need: 1, hits: 0, state: 'come', t: 0, back: 0, fedAt: -99 };
      F.shapes.push(S); return S;
    }
    function nagTick(open, live) {
      const F = play.fight;
      if (open) { F.nagNext = NAG.first; return; }
      if (play.closeHold || !live || F.call === 'asking' || F.call === 'shown' || F.shutFor < F.nagNext) return;
      if (F.t - F.lastStrike < NAG.first) { F.nagNext = F.shutFor + 1; return; }      // (his water is reaching them blind: he is doing something)
      const name = NAG.lines[F.nags % NAG.lines.length];
      if (phoSpeaks(name, () => talk(cast.phoB, SECS[name] || 2.6))) { F.nags++; F.nagNext = F.shutFor + (SECS[name] || 2.6) + NAG.again; }
      else F.nagNext = F.shutFor + 0.5;                                               // (a voice is live: asked again in half a second)
    }
    /* THE EYE BUTTON IN THE FIGHT: OPEN when his sight is shut with green ones in the room (straight away at the start and in
       the surge and the gold, after 3 s otherwise); CLOSE when it is open and his heart is near its limit (0.85: past 1 his
       nerve drains); nothing under the showcase or while his sight is held shut for him */
    function urgeTick(open, live) {
      const F = play.fight; let u = false;
      if (F.call === 'shown' || play.closeHold) u = false;
      else if (open) u = play.heat >= 0.85 && F.call !== 'gold' ? 'close' : false;
      else if (live && (F.shutFor >= 3 || F.t < 8 || F.call)) u = 'open';
      if (u !== F.urge) { F.urge = u; if (kit && kit.visionUrge) kit.visionUrge(u); }
    }
    /* THE TURNING POINT: the trance's film, and the decision at its end (the plan's §4.4) */
    function trance() {
      if (!kit || !kit.film) { openDecision(); return; }
      const run = play.run;
      if (!kit.film('trance', { onDone: () => { if (live(run)) { atTurn(); openDecision(); } } })) openDecision();
    }
    /* THE PICTURE WHILE HE CHOOSES (build 21, found on a phone at its real size, 390 x 844: a film from play gives the
       player's look back as it was before it, so the decision opened over wherever he had last looked in the fight, and
       the window covers the lower 57 % of such a screen: the turning point it asks about was out of sight or behind it.
       Episode 4 chapter 2's law, v25.5: HE IS SEEN WHILE THE CHOICE IS MADE.) The decision finds him where the trance's
       last frame stood him, looking where it looked, through the play lens it ended on; while the window is open his look
       is eased (0.8 s, the wall clock) so her face stands in the clear band of THIS screen, from under the stats (where
       they lie over the screen's middle) to the window's top edge, low in the band so the thing on her back and his
       teacher's hand on her head have room over her; where the band is too short, her chin is put just over the window's
       edge. Every ending begins on this look (DEC_EYE, DEC_AT), so the window going is no jump. A Step back gives him
       the look as it stands: nothing is put back, so nothing snaps */
    const DEC = { on: false, t0: 0, p0: 0, y0: 0, p1: null, y1: 0, w: 0, h: 0, at: null, eye: null };
    const _dcE = new THREE.Vector3();
    function atTurn() { camAt(S_EYE, END_AIM()); fLens(PLAY_FOV); DEC.on = false; DEC.at = null; DEC.eye = null; }
    function decideSolve() {
      const P = document.querySelector('#decide .panel'); if (!P || !P.offsetHeight) return null;
      const H = window.innerHeight, W = window.innerWidth, S = document.getElementById('stats'), sr = S ? S.getBoundingClientRect() : null;
      const top = sr && sr.width > 0 && sr.left < W / 2 + 50 && sr.right > W / 2 - 50 ? sr.bottom + 8 : H * 0.07;
      const bot = P.offsetTop; if (bot - top < 48) return null;
      camera.getWorldPosition(_dcE);
      const fc = headOf(cast.amma, AMMA_FACE), tf = Math.tan(camera.fov * Math.PI / 360), hd = Math.hypot(fc[0] - _dcE.x, fc[2] - _dcE.z);
      const elev = (y) => Math.atan2(y - _dcE.y, hd);
      const solve = (y, sy) => elev(y) - Math.atan((H / 2 - sy) / (H / 2) * tf);
      let th = solve(fc[1], top + (bot - top) * 0.7);
      /* (the head's middle: her chin is 12 cm under it) */
      if (H / 2 - (H / 2) * Math.tan(elev(fc[1] - 0.12) - th) / tf > bot - 8) th = solve(fc[1] - 0.12, bot - 8);
      return { p: Math.max(-1.3, Math.min(0.6, th)), y: Math.atan2(-(fc[0] - _dcE.x), -(fc[2] - _dcE.z)) };
    }
    function decideLook(now, st) {
      if (st !== 'decide' || phase !== 'kept') { DEC.on = false; return; }
      if (!DEC.on || DEC.w !== window.innerWidth || DEC.h !== window.innerHeight) {
        DEC.on = true; DEC.t0 = now; DEC.p0 = pitch.rotation.x; DEC.y0 = yaw.rotation.y; DEC.p1 = null;
        DEC.w = window.innerWidth; DEC.h = window.innerHeight; }
      if (DEC.p1 == null) {
        const s = decideSolve(); if (!s) { DEC.t0 = now; return; }
        DEC.p1 = s.p; DEC.y1 = DEC.y0 + angTo(DEC.y0, s.y);
        camera.getWorldPosition(_dcE); const d = 1.2, cp = Math.cos(DEC.p1);
        DEC.eye = [_dcE.x, _dcE.y, _dcE.z];
        DEC.at = [_dcE.x - Math.sin(DEC.y1) * cp * d, _dcE.y + Math.sin(DEC.p1) * d, _dcE.z - Math.cos(DEC.y1) * cp * d];
      }
      const k = smo(c01((now - DEC.t0) / 0.8));
      pitch.rotation.x = lp(DEC.p0, DEC.p1, k);
      yaw.rotation.y = lp(DEC.y0, DEC.y1, k);
    }
    /* where every ending's first frame stands and looks: the decision's own look when it was solved from the place the
       trance left him (a Step back and a walk elsewhere starts the ending from the trance's own last frame instead) */
    const DEC_EYE = () => S_EYE;
    const DEC_AT = () => (DEC.at && DEC.eye && Math.hypot(DEC.eye[0] - S_EYE[0], DEC.eye[2] - S_EYE[2]) < 0.1 ? DEC.at : END_AIM());
    /* every sound the four endings and their close play, warmed as the decision opens (the scenes cue the close's from a
       helper, which the engine's own reading of a scene cannot see) */
    function openDecision() {
      decOpen = true;
      if (warmSounds) warmSounds(['u4scuffle', 'rv4A1', 'u4cry', 'ml4A1', 'u4torn', 'u4endA', 'u4stand', 'am4A1', 'rv4A2', 'ph4A1', 'q4A1',
                      'u4flick', 'u4patter', 'u4dip', 'ml4B1', 'u4chill', 'u4heart', 'u4fall', 'ph4B0', 'ml4B2', 'u4endB', 'ml4B3', 'ph4B1', 'q4B1',
                      'u4tile', 'q4C0', 'u4tile2', 'rv4C1', 'u4endC', 'am4C1', 'ph4C1', 'q4C1', 'u4visoff', 'ph4D0', 'rv4D1', 'u4endD', 'ml4D1',
                      'ph4D1', 'q4D1', 'u4closemus', 'ph4z0', 'u4release', 'u4steps', 'ml4z1', 'am4z1', 'u4bell', 'ph4z1']);
      if (getState() === 'play') startDecision();
    }
    function keptBegin() { blessStage(); lampLit(true); roomDark(true); setPhase('kept', { complete: false }); const run = play.run; after(1.0, () => { if (live(run)) trance(); }); }

    /* ---------------------------------------------------------------- HIS HAND ON HER HEAD (the blessing): the right
       palm laid on the crown of her head, the fingers forward, the elbow out and down; eased on and off. The point is
       read from her own head each frame (her body breathes) */
    let crownK = 0, crownTo = 0;
    function handOnHead(P, on) { crownTo = on ? 1 : 0; }
    /* (laid after the people's frame has posed him, and taken off by armsBack before the mixer runs again: v11.5. Run
       wherever the people are posed live, play and the decision alike: updateNotes. Her head moves (the trance sits her
       up and forward), so his bow is read from it each frame: bowFor) */
    function crownTick(wdt) {
      crownK += (crownTo - crownK) * Math.min(1, wdt * 1.5);
      const P = cast.phoB; if (!P.ready || !P.group.visible) return;
      const h = HER_CROWN();
      bowSet(P, crownK > 0.01 ? crownK * bowFor(P, h) : 0);         // (the mixer lays it on at his next frame)
      if (crownK > 0.01) crownHand(P, h, crownK);
    }
    /* the palm on the crown (h: the top of her head, HER_CROWN), the fingers forward and a little down, the elbow out and down;
       and, while he bows, his other arm let hang straight from its shoulder (a bow tips the arms with the trunk) */
    function crownHand(P, h, k) {
      const g = P.group.position, fx0 = h[0] - g.x, fz0 = h[2] - g.z, fl = Math.hypot(fx0, fz0) || 1;
      handTo(P, 'R', [h[0] - fx0 / fl * 0.02, h[1] + 0.012, h[2] - fz0 / fl * 0.02], [fx0 / fl, -0.25, fz0 / fl], [0, -1, 0], k, { out: 0.32, down: 0.3 });
      const B = P.bow, bw = B ? B.a.getEffectiveWeight() * B.max : 0;
      if (bw > 2 && B.lsh) { B.lsh.getWorldPosition(_bwv); P.group.getWorldQuaternion(_bwq); _bwx.set(1, 0, 0).applyQuaternion(_bwq);
        handTo(P, 'L', [_bwv.x + _bwx.x * 0.04, _bwv.y - 0.6, _bwv.z + _bwx.z * 0.04], [0, -1, 0], [-_bwx.x, 0, -_bwx.z], k * Math.min(1, (bw - 2) / 8), { out: 0.12, down: 0.7 }); }
    }
    /* HIS BOW FROM THE WAIST (18 Nov: in the trance she sits up and forward, and her crown stood 0.6 to 0.8 m out from the
       right shoulder of a man upright behind her chair's handles; his arm reaches about 0.6: in the film's photographs his
       arm pointed at her head across the air). His trunk is turned forward about his own left-right line at his hip
       joints, as far as the reach asks and no further (bowFor), by an ADDITIVE take in his own mixer (bowSet): a turn
       laid on a bone after the mixer would be laid on itself again wherever the take holds that bone still (the v11.5
       law), and a take of the mixer's own is undone by the mixer. Its numbers are read once off his stand as he lands */
    const BOW_MAX = 38, _bwv = new THREE.Vector3(), _bwq = new THREE.Quaternion(), _bwx = new THREE.Vector3(), _bwp = new THREE.Vector3(), _bws = new THREE.Vector3();
    const boneOfP = (P, nm) => { const re = new RegExp('^(mixamorig:?)?' + nm + '$'); for (const n in P.bone) if (re.test(n)) return P.bone[n]; return null; };
    whenReady(cast.phoB, (P) => {
      const hp = boneOfP(P, 'Hips'), lu = boneOfP(P, 'LeftUpLeg'), ru = boneOfP(P, 'RightUpLeg'), sh = boneOfP(P, 'RightArm'), el = boneOfP(P, 'RightForeArm'), wr = boneOfP(P, 'RightHand'), lsh = boneOfP(P, 'LeftArm');
      if (!hp || !lu || !ru || !sh || !el || !wr || !P.mixer) { console.warn('phoB: no bones to bow with'); P.bow = null; return; }
      put(P, P.home.x, P.home.z, P.home.ry); pose(P, 'Sit_to_Stand_Transition_M', 5.85); P.group.updateWorldMatrix(true, true);
      const inv = new THREE.Matrix4().copy(P.group.matrixWorld).invert(), at = (b) => b.getWorldPosition(new THREE.Vector3()).applyMatrix4(inv);
      const piv = at(hp), s0 = at(sh), e0 = at(el), w0 = at(wr), reach = s0.distanceTo(e0) + e0.distanceTo(w0) + 0.07;
      /* (the bow is at his hip joints, as a body bows: his hips turned about his own left-right line, read in the hips'
         frame as he stands, and each thigh turned back by the same turn seen from it, so his legs stand where they stood:
         a thigh's back-turn is its own turn's conjugate of the hips', exact at any share of the bow) */
      const qg = P.group.getWorldQuaternion(new THREE.Quaternion()), qh = hp.getWorldQuaternion(new THREE.Quaternion());
      const ax = new THREE.Vector3(1, 0, 0).applyQuaternion(qg).applyQuaternion(qh.invert()).normalize();
      const dH = new THREE.Quaternion().setFromAxisAngle(ax, BOW_MAX * Math.PI / 180), dHi = dH.clone().invert();
      const dL = lu.quaternion.clone().invert().multiply(dHi).multiply(lu.quaternion), dR = ru.quaternion.clone().invert().multiply(dHi).multiply(ru.quaternion);
      const tr = (b, q) => new THREE.QuaternionKeyframeTrack(b.name + '.quaternion', [0, 1], [q.x, q.y, q.z, q.w, q.x, q.y, q.z, q.w]);
      const clip = new THREE.AnimationClip('bow', 1, [tr(hp, dH), tr(lu, dL), tr(ru, dR)], THREE.AdditiveAnimationBlendMode);
      const a = P.mixer.clipAction(clip); a.blendMode = THREE.AdditiveAnimationBlendMode; a.setEffectiveWeight(0); a.play();
      P.bow = { a, max: BOW_MAX, piv, sh: s0, reach, lsh };
    });
    /* the bow, in degrees, that brings the crown `h` within nine tenths of his reach (his shoulder turned with his trunk
       about the spine's joint, in his own frame) */
    function bowFor(P, h) {
      const B = P.bow; if (!B) return 0;
      P.group.updateWorldMatrix(true, false); _bwp.set(h[0], h[1] + 0.012, h[2]);
      const y = B.sh.y - B.piv.y, z = B.sh.z - B.piv.z;
      for (let d = 0; d <= B.max; d += 0.5) { const th = d * Math.PI / 180;
        _bws.set(B.sh.x, B.piv.y + y * Math.cos(th) - z * Math.sin(th), B.piv.z + y * Math.sin(th) + z * Math.cos(th)).applyMatrix4(P.group.matrixWorld);
        if (_bws.distanceTo(_bwp) <= B.reach * 0.9) return d; }
      return B.max;
    }
    function bowSet(P, deg) { const B = P.bow; if (!B) return; B.a.setEffectiveWeight(Math.max(0, Math.min(1, deg / B.max))); }

    /* ================================================================ WHAT HE CAN PRESS (stage.hotspots)
       Each a press (tap, click or E: Chad's rule of v21.9), each with its mark on the thing, each offered only while it
       is live and no line is handing off (v12.5, v21.21). A mark rides the person it is on (spotsTick). */
    const _hv = new THREE.Vector3();
    const markHit = (posF, frac = 0.1) => (x, y) => { const p = posF(); camera.updateMatrixWorld(); _hv.set(p.x, p.y, p.z).project(camera);
      return _hv.z < 1 && Math.hypot(x - _hv.x, (y - _hv.y) / Math.max(0.3, camera.aspect)) < frac; };
    const hsRavi = { id: 'ravi', pos: { x: 0, y: 1.6, z: 0 }, radius: 2.4, prompt: W.hotRavi, hits: markHit(RAVI_HEAD, 0.13),
      enabled: () => phase === 'history' && !play.busy && !play.learned.has('r'), onInteract() { return learn('r', [['rv4h1', cast.ravi], ['rv4h2', cast.ravi]]); } };
    const hsMala = { id: 'mala', pos: { x: 0, y: 1.5, z: 0 }, radius: 2.4, prompt: W.hotMala, hits: markHit(MALA_HEAD, 0.13),
      enabled: () => phase === 'history' && !play.busy && !play.learned.has('m'), onInteract() { return learn('m', [['ml4h1', cast.mala]]); } };
    const hsAmma = { id: 'amma', pos: { x: CHAIR.x, y: 1.2, z: CHAIR.z }, radius: 1.9, prompt: W.hotAmma, hits: markHit(AMMA_HEAD, 0.13),
      enabled: () => phase === 'history' && !play.busy && play.learned.size === 5 && !play.spoke, onInteract() { return ammaSpeaks(); } };
    const hsTell = { id: 'tell', pos: { x: STOOL.x, y: 1.3, z: STOOL.z }, radius: 2.4, prompt: W.hotTell, hits: markHit(PHO_HEAD, 0.13),
      enabled: () => phase === 'history' && !play.busy && play.spoke && !play.told, onInteract() { return tellPho(); } };
    /* the three presences, looked at through the vision: aim, and press (the mark grows when it is aimed at) */
    const lookSpot = (c, P, line, frac) => ({ id: 'look' + c, pos: { x: 0, y: 1.0, z: 0 }, radius: 9, aim: 0.24, pressAim: true, markFar: 9, markY: 0.15, prompt: W.hotLook,
      hits: markHit(() => { const h = P().hit; return h ? h.position : { x: 0, y: -9, z: 0 }; }, frac),
      enabled: () => phase === 'sight' && !play.busy && play.opened && visOpen() && !play.looked.has(c), onInteract() { return lookPresence(c, line); } });
    const hsLook1 = lookSpot('1', () => spirits.oppress, 'q4s1', 0.12), hsLook2 = lookSpot('2', () => spirits.appa, 'q4s2', 0.12), hsLook3 = lookSpot('3', () => spirits.wander[1], 'q4s3', 0.14);
    const STORY_SPOTS = [hsRavi, hsMala,
      { id: 'folder', pos: { x: FOLDER_AT.x, y: FOLDER_AT.y, z: FOLDER_AT.z }, radius: 1.8, prompt: W.hotFolder, markY: 0.25, hits: markHit(() => FOLDER_AT, 0.1),
        enabled: () => phase === 'history' && !play.busy && !play.learned.has('f'), onInteract() { return readLetters(); } },
      { id: 'old', pos: { x: OLDPHOTO_AT.x, y: OLDPHOTO_AT.y, z: OLDPHOTO_AT.z }, radius: 1.9, prompt: W.hotOld, markY: 0.3, hits: markHit(() => OLDPHOTO_AT, 0.1),
        enabled: () => phase === 'history' && !play.busy && !play.learned.has('o'), onInteract() { return learn('o', [['ml4h2', cast.mala], ['ml4h3', cast.mala]]); } },
      { id: 'appa', pos: { x: APPA_PHOTO_AT.x, y: APPA_PHOTO_AT.y, z: APPA_PHOTO_AT.z }, radius: 1.9, prompt: W.hotAppa, markY: 0.3, hits: markHit(() => APPA_PHOTO_AT, 0.1),
        enabled: () => phase === 'history' && !play.busy && !play.learned.has('a'), onInteract() { return learn('a', [['q4h2', null]]); } },
      hsAmma, hsTell, hsLook1, hsLook2, hsLook3,
      { id: 'water', pos: { x: SMALLBOWL_AT.x, y: 0.3, z: SMALLBOWL_AT.z }, radius: 1.8, prompt: W.hotWater, markY: 0.3, hits: markHit(() => SMALLBOWL_AT, 0.1),
        enabled: () => phase === 'bless' && !play.busy && !play.water, onInteract() { return takeWater(); } }];
    function spotsTick() {
      const r = RAVI_HEAD(); Object.assign(hsRavi.pos, r); hsRavi.pos.y -= 0.35;
      const m = MALA_HEAD(); Object.assign(hsMala.pos, m); hsMala.pos.y -= 0.35;
      const p = PHO_HEAD(); hsTell.pos.x = p.x; hsTell.pos.z = p.z; hsTell.pos.y = p.y - 0.4;
      for (const [hs, P] of [[hsLook1, spirits.oppress], [hsLook2, spirits.appa], [hsLook3, spirits.wander[1]]]) { const h = P.hit; if (h) { hs.pos.x = h.position.x; hs.pos.y = h.position.y - 0.15; hs.pos.z = h.position.z; } }
    }

    /* ---------------------------------------------------------------- WHERE THE WATER GOES (the engine's shot path)
       stage.shootables: what the lens's line may reach. stage.reloadRefusal: the bowl is dipped again only at his
       teacher's large bowl. And the altar: a shot whose line meets her altar before anything else is refused, the HUD
       saying why (kit.weaponBlock, derived on the frame: v11.6) */
    function shootables() { const out = []; for (const P of [spirits.appa, spirits.large].concat(spirits.wander)) if (P.hit && P.hit.visible) out.push(P.hit); return out; }
    function reloadRefusal() { return Math.hypot(yaw.position.x - BOWL.x, yaw.position.z - BOWL.z) < 1.5 ? null : W.dipHere; }
    const _ray = new THREE.Raycaster(), _ab = new THREE.Box3(), _hit = new THREE.Vector3();
    let altarBlock = false;
    function altarTick() {
      if (!kit || !kit.weaponBlock) return;
      let block = false;
      /* (never in the gold, whose flick takes every green one in view whatever stands behind them; and never while the
         flick's reach would take a green one in front of her altar: 18 Nov, from the room's south side she sits between him
         and her altar, and every flick at what was on her was refused) */
      const F = play.fight;
      if (phase === 'bless' && play.water && getState() === 'play' && !(F && F.on && F.call === 'gold')) {
        _ray.setFromCamera({ x: 0, y: 0 }, camera);
        altarHit.updateWorldMatrix(true, false); _ab.setFromObject(altarHit);
        const pt = _ray.ray.intersectBox(_ab, _hit);
        if (pt) { const dA = _ray.ray.origin.distanceTo(pt); block = true;
          for (const P of [spirits.appa, spirits.large].concat(spirits.wander)) { const h = P.hit; if (!h || !h.visible) continue;
            const s = new THREE.Sphere(h.position, h.scale.x); if (_ray.ray.intersectsSphere(s) && _ray.ray.origin.distanceTo(h.position) - h.scale.x < dA) { block = false; break; } }
          if (block && F && F.on) for (const S of F.shapes) {
            if (S.state !== 'come' && S.state !== 'feed') continue;
            const m = S.P.hit; if (!m || !m.visible) continue;
            _fr.copy(m.position).sub(_ray.ray.origin); const along = _fr.dot(_ray.ray.direction);
            if (along < 0.15 || along > Math.min(FAN.far, dA)) continue;
            _fq.copy(_ray.ray.direction).multiplyScalar(along).add(_ray.ray.origin);
            if (_fq.distanceTo(m.position) <= Math.min(FAN.max, FAN.r0 + FAN.perM * along)) { block = false; break; } } }
      }
      if (block !== altarBlock) { altarBlock = block; kit.weaponBlock(block ? W.noAltar : null); }
    }

    /* ---------------------------------------------------------------- the story's frame, its start and its reset */
    function storyTick(wdt, t) {
      spotsTick(); hitsTick(); scareTick(); doorTick(wdt); heatTick(wdt); altarTick();   // (the fan, the lamp and the glass: updateNotes, film or play; his hand on her head: updateNotes, play and the decision)
      fightTick(wdt);
      if (play.loseWait && getState() === 'play' && kit && kit.lose && kit.lose({ film: 'lost', say: W.lostSay, teaching: W.lostTeach })) play.loseWait = false;
    }
    function applyPhase(saved) {
      const R = readMark(saved);
      /* (a jump from one phase to another drops what the last one had queued: its lines, its timers, its busy hand-off:
         the v21.25 law, a phase jump leaves the line queue full) */
      phase = R.p; play.run++; play.busy = false; lineQ.length = 0; speakReset();
      if (R.p === 'history') historyBegin(R, !saved || !R.learned.length);
      else if (R.p === 'sight') sightBegin(R, false);
      else if (R.p === 'bless') blessBegin(R, false);
      else keptBegin();
    }
    function storyReset() {
      play.run++; play.busy = false; play.learned = new Set(); play.spoke = false; play.told = false; play.peeked = false;
      play.opened = false; play.looked = new Set(); play.closed = false; play.read = false; play.water = false; play.briefed = false;
      play.fight = null; play.appaGone = false; play.nerveOut = false; play.heat = 0; play.heatStep = 0; play.closeHold = 0; play.breathSaid = -99; play.loseWait = false;
      play.fanK = 1; play.fanTo = 1; play.scareSeed = SCARE_SEED; play.scareAt = 0; play.scared = new Set(); play.doorTo = -0.12; play.doorK = -0.12;
      play.fogged = false; play.fogAt = 0; fogK = 0; fogTo = 0; lampK = 0; lampTo = 0; crownK = 0; crownTo = 0; oppLooked = ''; wanderNext = 2;
      decOpen = false; altarBlock = false; bowlOnFloor.visible = true; chantNow = null;
      DEC.on = false; DEC.p1 = null; DEC.at = null; DEC.eye = null;
      for (const P of spirits.wander.concat([spirits.large, spirits.appa, spirits.oppress])) { P.gone = false; P.alpha = 1; }
      if (kit) { kit.bar(null); if (kit.weaponBlock) kit.weaponBlock(null); if (kit.visionUrge) kit.visionUrge(false);
        if (kit.health) kit.health(null); if (kit.edge) kit.edge(null); if (kit.sprayColor) kit.sprayColor(null); }
      lookAt0('FLAT'); castHome(); spiritsHome(); soundReset(); whenReady(cast.phoB, (P) => bowSet(P, 0));
    }
    function storySnap() { return { phase, learned: [...play.learned], looked: [...play.looked], water: play.water, fight: play.fight ? +play.fight.k.toFixed(3) : null, heat: +play.heat.toFixed(2),
      hp: play.fight ? play.fight.hp : null, call: play.fight ? play.fight.call : null }; }

    /* ====================================================== THE FLAT'S SOUND (M8; masters/v27.0/sound.sh made every file)
       THE BEDS, each eased toward what the beat wants (chapter 3's mixBeds; the engine ducks every bed 8 dB under a voice):
       the living room's own tone (its fan and fridge and the building round it) and the estate's night at the windows
       while the lights are on, and history's quiet music under them; once the room dies (the blessing), the dark room,
       and the wanderers' whispers while any of them is on the floor. Spirit Vision's own bed and music are the engine's
       (DATA.vision.sound), brought up with its wave while the world's beds are drawn back under it (its duck).
       THE LEVELS: every bed file is at -30 dBFS by its average (sound.sh), so a volume here says where it stands with
       nobody speaking: the room at -35 (the house's quiet place), the windows at -38 under it, the dark room at -34, the
       whispers at -35 and round him; history's music (a loop at its own -3 dBFS peak, -29 by its average) at -36 under the room.
       In a film the beds are the film's (filmBed: a film writes it from its own clock; every film cues the rest itself) */
    const BED = { flat: 0.56, estate: 0.4, hist: 0.45, dark: 0.63, whisper: 0.56, corr: 0.56 };
    const bedMix = { flat: 0, estate: 0, hist: 0, dark: 0, whisper: 0, corr: 0 };
    const filmBed = { on: false, flat: 0, estate: 0, hist: 0, dark: 0, whisper: 0, corr: 0 };
    const BED_EASE = { flat: 1.0, estate: 1.0, hist: 1.8, dark: 1.2, whisper: 0.8, corr: 0.8 };
    function mixBeds(wdt, st) {
      if (!(wdt > 0)) return;
      const want = { flat: 0, estate: 0, hist: 0, dark: 0, whisper: 0, corr: 0 };
      if (st === 'cine') { if (filmBed.on) for (const k in want) want[k] = filmBed[k]; }
      else if (st === 'title' || st === 'chapter') { /* all at 0: the title and the card hear nothing of the flat */ }
      else {
        const dark = lookName === 'DARK';
        want.flat = dark ? 0 : BED.flat; want.estate = BED.estate * (dark ? 0 : 1);
        want.dark = dark ? BED.dark : 0;
        want.hist = phase === 'history' && !dark ? BED.hist : 0;
        const F = play.fight; want.whisper = F && F.on ? BED.whisper * Math.min(1, F.shapes.filter(S => S.state !== 'gone').length / 2) : 0;
      }
      for (const k in bedMix) bedMix[k] += (want[k] - bedMix[k]) * (1 - Math.exp(-wdt / BED_EASE[k]));
      const B = DATA.ambience.beds; B[0][1] = bedMix.flat; B[1][1] = bedMix.estate; B[2][1] = bedMix.hist; B[3][1] = bedMix.dark; B[4][1] = bedMix.whisper; B[5][1] = bedMix.corr;
    }
    /* THE FIGHT'S MUSIC, one pass from the fight's first second (a bed runs from the chapter's start, so a piece that builds
       in three waves is begun where the fight begins): a one-shot, held so the fight's end, a bookmark and a reset can stop
       it; at 0.35 its average stands about 11 dB under a voice. A film is never under it (a scene stops the world's sounds) */
    /* (18 Nov: the blessing runs 116 s at its own pace and slows while the shapes crowd her or her teacher, so a fight may
       outlast the one pass, 150 s, and was silent after it. Its body, looped (sound.sh u4fightloop: the flattest 48 s of
       the same take, its join crossfaded, padded for the insets), comes in under the pass's last 3 s and holds to the
       end: fightMusTick, on the fight's frames) */
    let fightMus = null, fightLoop = null;
    const FIGHT_VOL = 0.35;
    function fightMusOn() { fightMusOff(); if (worldSfx && !(soundOff && soundOff())) { fightMus = worldSfx('u4fightmus', FIGHT_VOL, 1, 0) || null; if (fightMus && fightMus.context) fightMus.__t0 = fightMus.context.currentTime; } }
    function fightMusOff() { for (const a of [fightMus, fightLoop]) if (a) { try { a.stop(); } catch (e) { } } fightMus = null; fightLoop = null; }
    function fightMusTick() {
      if (!fightMus || fightLoop || !fightMus.buffer || !fightMus.context || fightMus.__t0 == null) return;
      const ac = fightMus.context, now = ac.currentTime, left = fightMus.buffer.duration - (now - fightMus.__t0);
      if (left > 3.2 || !worldSfx) return;
      const L = worldSfx('u4fightloop', FIGHT_VOL, 1, 0); if (!L || !L.buffer) return;
      fightLoop = L; L.loop = true; L.loopStart = 0.06; L.loopEnd = Math.max(0.2, L.buffer.duration - 0.06);
      if (L.__g) { L.__g.gain.cancelScheduledValues(now); L.__g.gain.setValueAtTime(0, now); L.__g.gain.linearRampToValueAtTime(FIGHT_VOL, now + 3); }
      if (fightMus.__g) { fightMus.__g.gain.cancelScheduledValues(now); fightMus.__g.gain.setValueAtTime(FIGHT_VOL, now); fightMus.__g.gain.linearRampToValueAtTime(0, now + Math.max(0.2, left - 0.1)); }
    }
    /* THE ESTATE'S OWN NOISES, one at a time on the chapter's clock from their own seeded stream (e3c3's shape, v21.13): a
       lift's chime far down the corridor, slippers passing outside the gate, the rubbish chute, a dog far off, a gecko on
       the wall, a motorbike far below. Each panned to where it comes from, a third quieter while a line is said, never two
       at once; in history and the sight only (the blessing has its own sound); in play only; reset() rewinds the stream.
       Each file's loudest twentieth of a second is at -14 dBFS (sound.sh), so these stand at -27 to -30, under the room */
    const AMB_SEED = 0x2704;
    let ambSeed = AMB_SEED, ambAt = 0, ambBusy = 0, ambLast = '', ambN = 0;
    function ambRand() {
      ambSeed = (ambSeed + 0x6D2B79F5) | 0; let t = ambSeed;
      t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }
    function panAt(x, z) {
      const dx = x - yaw.position.x, dz = z - yaw.position.z, a = Math.atan2(dx, -dz) + yaw.rotation.y;
      return THREE.MathUtils.clamp(Math.sin(a) * 0.75, -0.75, 0.75);
    }
    const AMB = [
      { n: 'u4os1', v: 0.2, len: 4.0, at: () => ({ x: 6, z: -2.5 }) },                                    // the lift, down the corridor
      { n: 'u4os2', v: 0.24, len: 4.0, at: () => ({ x: 0.4 + ambRand() * 2, z: -1.4 }) },                 // slippers, past the gate
      { n: 'u4os3', v: 0.2, len: 3.0, at: () => ({ x: 4, z: -2.0 }) },                                    // the rubbish chute
      { n: 'u4os4', v: 0.16, len: 3.0, at: () => ({ x: -8, z: 2 + ambRand() * 4 }) },                     // a dog, far off, out of the windows
      { n: 'u4os5', v: 0.2, len: 2.0, at: () => ({ x: ambRand() < 0.5 ? ROOMS.living.x0 : ROOMS.living.x1, z: 1 + ambRand() * 3 }) },   // a gecko, on a wall
      { n: 'u4os6', v: 0.16, len: 5.0, at: () => ({ x: -12, z: ambRand() * 6 }) },                        // a motorbike, far below
    ];
    function ambTick() {
      if (!worldSfx || (soundOff && soundOff())) return;
      if (!(phase === 'history' || phase === 'sight') || play.busy) { ambAt = 0; return; }
      if (!ambAt) { ambAt = dayClock.t + 4 + ambRand() * 6; return; }
      if (dayClock.t < ambAt || dayClock.t < ambBusy) return;
      let k = Math.floor(ambRand() * AMB.length);
      if (AMB[k].n === ambLast) k = (k + 1 + Math.floor(ambRand() * (AMB.length - 1))) % AMB.length;
      const sd = AMB[k], at = sd.at();
      const vol = sd.v * (dayClock.t < speak.until ? 0.66 : 1) * (0.85 + 0.3 * ambRand());
      if (worldSfx(sd.n, vol, 0.95 + 0.1 * ambRand(), panAt(at.x, at.z))) {
        ambN++; ambLast = sd.n; ambBusy = dayClock.t + sd.len + 0.8;
        ambAt = dayClock.t + 10 + ambRand() * 12;
      } else ambAt = dayClock.t + 1.5;
    }
    /* HIS BARE FEET ON HER TILES (his shoes are at the rack outside, as a guest's are): the two takes a phone plays, dealt
       from a seeded stream so no fall comes twice running (the engine asks every footfall, stage.stepSound, v16.0) */
    const STEPS_TILE = ['u4tile', 'u4tile2'];
    const TILE_SEED = 0x2705;
    let tileSeed = TILE_SEED, tileLast = -1;
    function stepNext() {
      tileSeed = (tileSeed * 1664525 + 1013904223) >>> 0;
      let j = Math.floor(tileSeed / 4294967296 * (STEPS_TILE.length - (tileLast < 0 ? 0 : 1)));
      if (tileLast >= 0 && j >= tileLast) j++;
      tileLast = j; return STEPS_TILE[j];
    }
    function soundReset() {
      ambSeed = AMB_SEED; ambAt = 0; ambBusy = 0; ambLast = ''; ambN = 0; for (const k in bedMix) bedMix[k] = 0; filmBed.on = false;
      tileSeed = TILE_SEED; tileLast = -1; fightMusOff(); chantStop();
    }
    /* ================================================================ THE FILMS' PICTURES (M7; the plan's §4.4 to §4.5)
       Every film is HIS EYES (the grown Master Zavier is never seen: CLAUDE.md, v24.56): the lens stands where he
       stands, turns and narrows, and never moves through the people. Every picture is a pure function of the film's
       clock (v6.4): people are POSED at the moment the clock asks for (pose), a look laid on at once (lookNow), the
       vision's wave held at the radius the clock gives it (kit.vision({ r })), so a seek, a skip and a slow phone land on
       the same picture. A shot is a track of keys (track): a key's eye, its aim and its lens for a phone and a desk; a
       move between two keys is eased (a smooth function of the clock, v25.5), a key marked `cut` is a cut. A phone's
       frame is a third of a desk's width, so a group a desk holds is a phone's pan from one face to the next. */
    const FM = { key: '', once: new Set(), lit: '', must: null, endK: 0 };
    const PLAY_FOV = camera.fov;                                              // the lens play is seen through (a film that ends in the clear ends on it)
    const _ffv = new THREE.Vector3();
    function fLook(name, secs = 0) { if (FM.lit !== name) { FM.lit = name; lookAt0(name, secs); } }
    function onceAt(id, t, at, fn, span = 1.5) { if (t >= at && t < at + span && !FM.once.has(id)) { FM.once.add(id); fn(); } }
    function fLens(f) { if (Math.abs(camera.fov - f) > 1e-3) { camera.fov = f; camera.updateProjectionMatrix(); } }
    function camAt(p, q, roll = 0) {
      yaw.position.set(p[0], p[1], p[2]);
      const dx = q[0] - p[0], dy = q[1] - p[1], dz = q[2] - p[2];
      yaw.rotation.y = Math.atan2(-dx, -dz); pitch.rotation.x = Math.atan2(dy, Math.hypot(dx, dz));
      camera.rotation.z = roll;
      stockLod();                                  // (the levels of detail for THIS frame's lens, never the last one's: v24.22)
    }
    function headOf(P, fb) { if (P && P.ready && P.head && P.group.visible) { P.head.getWorldPosition(_ffv); return [_ffv.x, _ffv.y, _ffv.z]; } return fb; }
    function shot(eye, at, fPhone, fDesk, roll = 0) { fLens(isNarrow() ? fPhone : fDesk); camAt(eye, at, roll); }
    const v3 = (o) => (typeof o === 'function' ? o() : o);
    /* a track of keys: { t, eye, at, fp, fd, roll, cut }. Between two keys the lens eases from one to the next; a key
       marked `cut` is jumped to at its time (the one before it held until then) */
    /* (a shot's keys must run forward in time: the close's family shot ran 21.6 then 21.3 and never held, and nothing
       said so (18 Nov). Said now, once for each pair, as a console error every probe counts) */
    const keysBad = new Set();
    function track(t, K) {
      for (let j = 1; j < K.length; j++) if (K[j].t < K[j - 1].t) { const w = (K[j - 1].name || '') + '@' + K[j - 1].t.toFixed(2) + ' > ' + (K[j].name || '') + '@' + K[j].t.toFixed(2);
        if (!keysBad.has(w)) { keysBad.add(w); console.error('e4c4: a film\'s camera keys run backwards in time: ' + w); } }
      let i = 0; while (i < K.length - 1 && t >= K[i + 1].t) i++;
      const A = K[i], B = K[i + 1];
      if (!B || B.cut) { shot(v3(A.eye), v3(A.at), A.fp, A.fd, A.roll || 0); FM.shot = A.name || ''; return; }
      const u = smo(c01((t - A.t) / Math.max(1e-3, B.t - A.t)));
      const fl = lp(isNarrow() ? A.fp : A.fd, isNarrow() ? B.fp : B.fd, u);
      fLens(fl); camAt(lp3(v3(A.eye), v3(B.eye), u), lp3(v3(A.at), v3(B.at), u), lp(A.roll || 0, B.roll || 0, u));
      FM.shot = (A.name || '') + '>' + (B.name || '');
    }
    /* a take run between two of its own moments over a stretch of the film's clock (eased at both ends) */
    const runOf = (t, t0, t1, a, b) => lp(a, b, smo(c01((t - t0) / (t1 - t0))));
    /* a take held on a small stretch of itself, there and back on the film's clock (a stillness that breathes) */
    const pingOf = (t, from, len, secs) => from + len * (0.5 - 0.5 * Math.cos(Math.PI * 2 * t / secs));

    /* WHERE EVERYONE IS AT THE TURNING POINT (the trance's last frame is where every ending begins) */
    /* (18 Nov: from 1.12, 4.45 her face was a profile in every close shot of the trance; here she is three quarters to him,
       a pace from her left knee, clear of the lamp at the altar's foot and of Appa by his photograph) */
    const S_EYE = [0.55, 1.62, 4.42];                                         // he stands at her front left, by her goddess's wall
    /* where he watches the close from: her front left, before Appa's photograph and the master bedroom's door (18 Nov,
       photographed twice: from 1.12, 4.45 Ravi stood on the line from his eyes to her, his back filling every shot, and
       his teacher's word was a dark doorway and an arm; from 1.30, 4.93, against the wall, her altar's cabinet stood
       across the line to Mala and Appa stood a step from the lens). Here he is in front of the cabinet's face, Mala is
       seen at her right beyond her, Ravi kneels at her left below her face, and his teacher stands clear behind her */
    const CLOSE_EYE = [1.30, 1.62, 4.55];
    /* (ending B: where the thing comes to, a hand's breadth from his eyes, on the line from her back to him; and that line) */
    const TOWARD = (() => { const dx = CHAIR.x - S_EYE[0], dz = CHAIR.z - 0.3 - S_EYE[2], l = Math.hypot(dx, dz); return [dx / l, dz / l]; })();
    const COMES = [S_EYE[0] + TOWARD[0] * 0.36, 1.1, S_EYE[2] + TOWARD[1] * 0.36];
    /* RAVI'S RUSH IS THE TAKE'S OWN (its travel, 2.94 m, measured: tools/probes/takepath.mjs). His group stands where the
       take begins, at the room's edge in the passage to the kitchen, turned so the take's own line (8.5 degrees to his
       right of his front) ends a step from her chair, R1, clear of the armchair's back. (18 Nov: he was moved from the
       sofa's end to R1 while the take travelled too, so his body ran five metres and through the wall, and the armchair
       stood across that line; every hold of the take's end at R1 put him three metres past it) */
    const RS = { x: 3.70, z: 4.00, ry: -1.621 }, R1 = { x: 0.82, z: 3.42 };
    /* ENDING C'S LENSES (18 Nov, re-staged from its photographs: aimed at R1, his face came to a phone's edge; and once
       he knelt, from over his shoulder, his head hid her face through the cry, the light and her eyes opening). His head
       where the decision holds him, measured (tools/probes/e4c4who.mjs: 0.88, 1.44, 3.45); the eye he speaks to him from;
       and the two of them from her front left a step back, his head (where he kneels, KNEEL_R) and her face 16 degrees
       apart from there, inside a phone's 31 at 62 degrees of lens (to be read in the photographs) */
    const CR_HEAD = [0.88, 1.44, 3.45], CR_EYE = [0.57, 1.6, 4.04], CK_EYE = [0.95, 1.55, 4.75], CK_AT = [0.045, 0.97, 3.87];
    /* where Ravi kneels at her side in C and D: a little behind her left hand, so from her front left (C's two-shot) and
       from where he keeps his place (D) the kneeling son's head stands clear of her face (it hid it when he knelt level
       with her); and Grandmaster Pho's head as he bows over her with his hand on her head (measured: e4c4who.mjs) */
    const KNEEL_R = { x: CHAIR.x + 0.45, z: CHAIR.z - 0.05 }, PHO_BOW = [-0.13, 1.40, 3.51];
    /* (the rush take's hips over the floor, its own metres, every quarter second: tools/probes/takepath.mjs, 18 Nov) */
    const RUSH_HIPS = [[-0.01, -0.03], [-0.01, 0.0], [-0.02, 0.06], [-0.03, 0.22], [-0.08, 0.61], [-0.21, 1.22], [-0.35, 1.82], [-0.43, 2.24], [-0.43, 2.63], [-0.43, 2.82], [-0.44, 2.86], [-0.45, 2.89]];
    const RUSH_AT = (tk) => { const f = Math.max(0, Math.min(RUSH_HIPS.length - 1.001, tk / 0.25)), i = Math.floor(f), u = f - i, A = RUSH_HIPS[i], B = RUSH_HIPS[i + 1];
      return [lp(A[0], B[0], u) - RUSH_HIPS[0][0], lp(A[1], B[1], u) - RUSH_HIPS[0][1]]; };
    /* Ravi where his rush has carried him at the take's moment tk: his group moved along the travel taken out of his
       hips (c_scast.js, P.rushPath), turned with him; the take posed by the caller */
    function rushXZ(P, tk) {
      const R = P.rushPath; let ax = 0, az = 0;
      if (R) { const T = R.T, n = T.length; let i = 0; while (i < n - 2 && T[i + 1] <= tk) i++; const u = c01((tk - T[i]) / Math.max(1e-6, T[i + 1] - T[i])), k = Math.min(n - 1, i + 1);
        ax = lp(R.D[i * 2], R.D[k * 2], u); az = lp(R.D[i * 2 + 1], R.D[k * 2 + 1], u); }
      const c = Math.cos(RS.ry), sn = Math.sin(RS.ry);
      return { x: RS.x + ax * c + az * sn, z: RS.z - ax * sn + az * c };
    }
    function rushAt(P, tk, dx = 0, dz = 0) { const q = rushXZ(P, tk); put(P, q.x + dx, q.z + dz, RS.ry); }
    /* HELD WHERE HIS RUSH STOPPED (18 Nov, read through ending C by tools/probes/e4c4who.mjs): the decision holds him at
       the take's 2.5 s, straining (its 2.45 to 2.57 there and back in 1.4 s, c_ufilm.js trance end); the endings that
       hold him go on from exactly that, his group where the decision left it and only the strain in the take */
    function rushHeld(P, t) { rushAt(P, 2.5); pose(P, 'rush', pingOf(t, 2.45, 0.12, 1.4)); }
    const lpA = (a, b, k) => a + Math.atan2(Math.sin(b - a), Math.cos(b - a)) * k;
    /* TO HER SIDE AND DOWN ONTO THE KNEES (18 Nov, read through ending C: the kneel take is kneeling from its first
       frame, so at the beat Ravi's head dropped half a metre in one frame and he then slid 0.8 m over the floor on his
       knees to her side; Mala the same, 0.4 m; ending D's Ravi the same). Now: from where he stands at t0 a walk paced
       by the ground it covers (1.29 m a second of the walking take: ending A's measure) at a slow 0.62 m a second,
       turned out of his stance along the way and to her at its end, eased into a standing breath as he arrives; at
       `kneelAt` (or on arrival) down onto his knees, the stand eased into the kneel over `down` seconds while the kneel
       take runs from its start; `kt(td)` the kneel take's moment once down (its first 4.2 s by default). `from` is the
       take and moment he stands in before he goes, so the walk begins out of it */
    function walkKneel(P, t, t0, A, B, ryEnd, from, o = {}) {
      const L = Math.hypot(B.x - A.x, B.z - A.z), T = L > 0.02 ? Math.max(0.5, L / 0.62) : 0;
      const h = L > 0.02 ? faceTo(A.x, A.z, B.x, B.z) : ryEnd, tw = t - t0, down = o.down || 1.1;
      const kAt = o.kneelAt != null ? Math.max(o.kneelAt, t0 + T) : t0 + T, idleT = (q) => 3 + q * 0.4;
      if (tw < T) {
        const s = L * smo(c01(tw / T)), u = s / L, a0 = o.ry0 != null ? o.ry0 : h;
        put(P, lp(A.x, B.x, u), lp(A.z, B.z, u), lpA(lpA(a0, h, smo(c01(tw / 0.35))), ryEnd, smo(c01((tw - T + 0.35) / 0.35))));
        const into = smo(c01(tw / 0.4)), outOf = smo(c01((tw - T + 0.4) / 0.4));
        if (outOf <= 0) pose(P, 'Walking', s / 1.29, true, from[0], 1 - into, from[1]);
        else pose(P, 'Idle_3', idleT(tw), true, 'Walking', 1 - outOf, s / 1.29);
        return;
      }
      put(P, B.x, B.z, ryEnd);
      if (t < kAt) { pose(P, 'Idle_3', idleT(tw), true); return; }
      const td = t - kAt, k = smo(c01(td / down));
      pose(P, 'kneelhold', o.kt ? o.kt(td) : Math.min(4.2, td), false, 'Idle_3', 1 - k, idleT(kAt - t0));
    }
    const MALA_T = { x: -0.55, z: 4.42 };                                     // Mala at her mother's right hand, before her
    const AMMA_FACE = [CHAIR.x, 1.02, CHAIR.z + 0.08];
    const RAVI_RY = RS.ry;
    /* the picture the decision opens over (the trance's last, every ending's first). A phone's frame is a third of a desk's
       width: from where he stands, Ravi at R1 is 67 degrees round from her face and cannot share it, so a phone holds
       her, the thing on her back and his teacher's bowed head over her (what he must choose about); a desk holds them all */
    const END_AIM = () => (isNarrow() ? [CHAIR.x - 0.05, 1.2, CHAIR.z - 0.13] : [lp(R1.x, CHAIR.x, 0.55), 1.15, lp(R1.z, CHAIR.z, 0.55)]);
    /* her goddess's light in her (§4.4: a light, never a figure): a dark blue glow laid over her own body in the vision,
       made once at the build so it is never compiled on screen, unseen (alpha 0) until a film raises it */
    let ammaAura = null;
    whenReady(cast.amma, (P) => { ammaAura = ctx.spiritAura ? ctx.spiritAura(P.model, { color: 0x2f4dff, fill: 0.0, rim: 1.3, flicker: 0.06, power: 2.0, xray: 0 }) : null;
      if (ammaAura) { ammaAura.set('uAlpha', 0); auras.push(ammaAura); } });
    function goddess(k) { if (ammaAura) { ammaAura.set('uAlpha', k > 0.001 ? 1 : 0); ammaAura.set('uFill', 0.16 * k); ammaAura.set('uRim', 0.4 + 1.1 * k); } }
    /* the vision held by a film's clock: out from his eyes over `secs` from `t0` (the engine's own curve), full after */
    const VR = 70;
    function visionAt(t, t0, secs = 1.6, t1 = Infinity, back = 1.0) {
      if (!kit || !kit.vision) return;
      if (t < t0) { kit.vision({ r: 0, moving: false }); return; }
      if (t < t0 + secs) { const u = (t - t0) / secs; kit.vision({ r: VR * (0.30 * u + 0.70 * u * u * u), moving: true }); return; }
      if (t < t1) { kit.vision({ r: VR, moving: false }); return; }
      if (t < t1 + back) { const u = 1 - (t - t1) / back; kit.vision({ r: VR * (0.30 * u + 0.70 * u * u * u), moving: true }); return; }
      kit.vision({ r: 0, moving: false });
    }
    /* Grandmaster Pho behind her chair with his right palm on the crown of her head (crownTick's own hand and bow,
       c_story.js), stood and posed by the film each frame: the bow is set before his pose (the mixer lays it on), the
       hand after; k eases both on and off */
    function phoBless(t, k) {
      const P = cast.phoB; if (!P.ready) return; P.group.visible = true; put(P, P.home.x, P.home.z, P.home.ry);
      const h = HER_CROWN();
      bowSet(P, k > 0.01 ? k * bowFor(P, h) : 0);
      pose(P, 'Sit_to_Stand_Transition_M', pingOf(t, 5.85, 0.25, PHO_BREATH));
      if (k > 0.01) crownHand(P, h, k);
    }

    const _obq = new THREE.Quaternion(), _ofq = new THREE.Quaternion(), _ofe = new THREE.Euler();
    const FILMS = {};
    /* ---------------------------------------------------------------- THE TRANCE (§4.4; its clock: TR)
       From his place at her front left: her deep breath, her back straightening, her eyes opening wide, her hands lifting
       open; Mala, at her right hand, knowing it before anyone ("It's Amman."); then his sight forced open, the wave out
       from him: the crimson thing on her back clawing at her shoulders and a dark blue light rising in her; its cry; and
       Ravi breaking from the sofa toward his mother, his eyes turned to him by the shout, and back to her. It ends on
       the live room: the decision opens over it */
    /* (its clock, TR, is the chapter's own, z_tail.js: chaptertest reads a film's length from it) */
    FILMS.trance = {
      begin(api) {
        if (api && api.handsRoot) api.handsRoot.visible = false;
        FM.once = new Set();
        whenReady(cast.pho, (P) => { P.group.visible = false; });
        whenReady(cast.mala, (P) => { put(P, MALA_T.x, MALA_T.z, faceTo(MALA_T.x, MALA_T.z, CHAIR.x, CHAIR.z)); });
        whenReady(cast.ravi, (P) => { rushAt(P, 0); });
        spiritsHome(); castSolid();
        filmBed.on = true; for (const k in filmBed) if (k !== 'on') filmBed[k] = 0; filmBed.dark = BED.dark;      // the dark room under every silence
      },
      frame(t) {
        fLook('DARK');
        /* her: the breath, the back straightening, the hands lifting; held trembling on the take's last stretch */
        whenReady(cast.amma, (P) => pose(P, 'trance', t < 9.9 ? t : pingOf(t - 9.9, 8.2, 1.5, 3.2)));
        phoBless(t, 1);
        /* Mala: still, watching her mother; at her second line her palms meet before her chest (the end of her lamp's
           take: its own pressing of the palms and the small bow) */
        whenReady(cast.mala, (P) => { if (t < TR.ml2 - 0.4) { pose(P, 'Idle_3', 2 + t * 0.4, true); }
          else pose(P, 'lightlamp', runOf(t, TR.ml2 - 0.4, TR.ml2 + 1.4, 4.4, 5.6));
          lookNow(P, AMMA_FACE, 1, 0.9); });
        /* Ravi: still at the room's edge until the cry, then his rush (the take carries him, from its standing start, eased
           out of his rest over its first 0.3 s): three quick steps to a step from her chair; his eyes to him at his
           shout, and back to her */
        whenReady(cast.ravi, (P) => {
          if (t < TR.rush) { rushAt(P, 0); pose(P, 'Idle_3', 3 + t * 0.35, true); lookNow(P, AMMA_FACE, 1, 0.9); }
          else { const b = smo(c01((t - TR.rush) / 0.3)), kL = smo(c01((t - TR.rv + 0.15) / 0.35)) * (1 - smo(c01((t - TR.back) / 0.9))), tk = Math.min(2.6, (t - TR.rush) * 1.05);
            rushAt(P, tk); pose(P, 'rush', tk, false, 'Idle_3', 1 - b, 3 + TR.rush * 0.35);
            lookNow(P, lp3(AMMA_FACE, S_EYE, kL), 1, 0.9); }
        });
        /* the one on her back: its cling, its claws at her shoulders as the light rises in her, then its cry */
        whenReady(spirits.oppress, (P) => { oppRide(P);
          if (t < TR.claw) pose(P, 'cling', 2 + t * 0.3);
          else if (t < TR.cry) pose(P, 'claw', (t - TR.claw) * 0.9);
          else pose(P, 'cry', t - TR.cry < 4.4 ? t - TR.cry : pingOf(t - TR.cry - 4.4, 2.6, 1.6, 2.4)); });
        visionAt(t, TR.open, 1.6);
        goddess(smo(c01((t - TR.open - 0.6) / 6)));
        /* THE LENS: her face (three quarters, a pace off); a turn to Mala for her two lines; back to her as the vision
           opens, wide enough for the thing on her back and his teacher's bowed head behind; drawn to the shout, Ravi
           caught at the room's edge and followed in to her chair; then all of them. (Ravi's marks are where the rush take
           puts his body at those moments: RS turned by RS.ry, its hips' own travel) */
        const RV = (tk, y) => { const h = RUSH_AT(tk); return [RS.x - 0.05 * h[0] - 0.9987 * h[1], y, RS.z + 0.9987 * h[0] - 0.05 * h[1]]; };
        track(t, [
          { t: 0, name: 'her', eye: S_EYE, at: [CHAIR.x - 0.01, 0.99, CHAIR.z - 0.05], fp: 46, fd: 40 },
          { t: TR.ml1 - 0.5, name: 'her', eye: S_EYE, at: [CHAIR.x - 0.015, 0.99, CHAIR.z], fp: 46, fd: 40 },
          { t: TR.ml1 + 0.3, name: 'mala', eye: S_EYE, at: [MALA_T.x + 0.01, 1.36, MALA_T.z + 0.09], fp: 46, fd: 42 },
          { t: TR.ml2 + 1.6, name: 'mala', eye: S_EYE, at: [MALA_T.x + 0.05, 1.37, MALA_T.z + 0.08], fp: 46, fd: 42 },
          { t: TR.open + 0.3, name: 'vision', eye: S_EYE, at: [CHAIR.x - 0.1, 1.04, CHAIR.z + 0.13], fp: 56, fd: 48 },
          { t: TR.cry + 0.4, name: 'vision', eye: S_EYE, at: [CHAIR.x - 0.1, 1.06, CHAIR.z + 0.11], fp: 58, fd: 50 },
          { t: TR.cry + 1.8, name: 'cry', eye: S_EYE, at: [CHAIR.x - 0.13, 1.32, CHAIR.z - 0.1], fp: 66, fd: 56 },
          { t: TR.rv - 0.1, name: 'cry', eye: S_EYE, at: [CHAIR.x - 0.13, 1.34, CHAIR.z - 0.13], fp: 66, fd: 56 },
          { t: TR.rv + 0.55, name: 'ravi', eye: S_EYE, at: RV(0.95, 1.32), fp: 60, fd: 54 },
          { t: TR.rush + 1.6, name: 'ravi', eye: S_EYE, at: RV(1.68, 1.25), fp: 60, fd: 54 },
          { t: TR.back, name: 'ravi', eye: S_EYE, at: [R1.x, 1.32, R1.z], fp: 60, fd: 56 },
          { t: TR.back + 1.0, name: 'end', eye: S_EYE, at: END_AIM, fp: 64, fd: 58 },
          { t: TR.end, name: 'end', eye: S_EYE, at: END_AIM, fp: PLAY_FOV, fd: PLAY_FOV }
        ]);
      },
      /* the room as the decision finds it, held still while he chooses: Ravi a step from her, the cry, the light in her,
         his teacher's hand on her head, the vision open (the endings take it from here) */
      end() {
        fLens(PLAY_FOV); filmBed.on = false;
        whenReady(cast.ravi, (P) => { rushAt(P, 2.5); hold(P, 'rush', 2.45, 0.12, 0.2, 1.4); });
        whenReady(cast.amma, (P) => hold(P, 'trance', 8.2, 1.5, 0.3, 3.2));
        whenReady(cast.mala, (P) => hold(P, 'lightlamp', 5.4, 0.2, 0.3, 2.5));
        whenReady(spirits.oppress, (P) => hold(P, 'cry', 2.6, 1.6, 0.3, 2.4));
        if (kit && kit.vision) kit.vision({ r: VR, moving: false });
        handOnHead(cast.phoB, true); crownK = 1;
      }
    };

    /* ---------------------------------------------------------------- HER LIFE RUNS OUT (its clock: LO, z_tail.js)
       Chad, 18 Nov: "If her health bar drops to 0, the player loses this game and chapter and has to restart again". The
       film the loss plays before its card (the fifty-third seam, kit.lose: c_story.js ammaLost). From his place at her front
       left, his sight forced open: the green ones on her, round her chair; her last cry; his teacher's hand lifted from her
       head, his chant already broken off; Mala's gasp at the lamp; Ravi's "Amma..."; her eyes turned to him; his sight shut,
       the wave home; the dark room; black. Every place a function of the film's clock (seven of them round her chair, each
       a fixed spot by its slot: v6.4) */
    const LOST_RING = [[0.62, -0.02], [-0.64, 0.04], [0.30, 0.68], [-0.36, 0.62], [0.54, -0.44], [-0.52, -0.42], [0.02, 0.90]];
    FILMS.lost = {
      begin(api) {
        if (api && api.handsRoot) api.handsRoot.visible = false;
        FM.once = new Set();
        whenReady(cast.pho, (P) => { P.group.visible = false; });
        whenReady(cast.mala, (P) => { put(P, MALA_LAMP.x, MALA_LAMP.z, 0); });
        whenReady(cast.ravi, (P) => { put(P, AT.ravi.x, AT.ravi.z, faceTo(AT.ravi.x, AT.ravi.z, CHAIR.x, CHAIR.z)); });
        spirits.wander.forEach((P, i) => whenReady(P, (Q) => {
          const R = LOST_RING[i]; Q.group.visible = !!R; Q.gone = !R; if (!R) return;
          const x = CHAIR.x + R[0], z = CHAIR.z + R[1]; put(Q, x, z, faceTo(x, z, CHAIR.x, CHAIR.z));
          Q.alpha = 1; if (Q.fx) { Q.fx.set('uAlpha', 1); Q.fx.set('uFill', SPIRIT.wander.fill); } }));
        whenReady(spirits.large, (P) => { P.group.visible = false; P.gone = true; });
        castSolid();
        filmBed.on = true; for (const k in filmBed) if (k !== 'on') filmBed[k] = 0; filmBed.dark = BED.dark;
      },
      frame(t) {
        fLook('DARK');
        whenReady(cast.amma, (P) => { put(P, CHAIR.x, CHAIR.z, CHAIR.ry); pose(P, 'wsit', pingOf(t, 2.0, 3.6, 12));
          if (t > LO.turn) lookNow(P, 'lens', smo(c01((t - LO.turn) / 1.6)), 1.35, 0.05); });
        phoBless(t, 1 - smo(c01((t - LO.lift) / 0.8)));
        whenReady(cast.mala, (P) => { pose(P, 'kneelhold', pingOf(t, 2.5, 1.0, 6.0)); lookNow(P, AMMA_FACE, 1, 0.9); });
        whenReady(cast.ravi, (P) => { pose(P, 'Idle_3', 3 + t * 0.35, true); lookNow(P, AMMA_FACE, 1, 0.9); });
        whenReady(spirits.oppress, (P) => { oppRide(P); pose(P, 'cling', 2 + t * 0.3); });
        spirits.wander.forEach((P, i) => { if (LOST_RING[i]) whenReady(P, (Q) => pose(Q, i % 2 ? 'creep' : 'crawl', 0.37 * i + t * 0.9, true)); });
        goddess(0);
        visionAt(t, 0.05, 0.9, LO.shut, 1.0);
        /* (18 Nov, photographed on build 19: from S_EYE, 0.9 m off, the lens looked 10 to 17 cm past her face and a phone
           saw her chin and the green ones' backs; from CLOSE_EYE, as the close's own shots of her, at her head as it sits
           in the loss's take, the ring of them round her and her face both held) */
        track(t, [
          { t: 0, name: 'her', eye: CLOSE_EYE, at: [CHAIR.x - 0.04, 0.92, CHAIR.z - 0.02], fp: 60, fd: 50 },
          { t: LO.turn, name: 'her', eye: CLOSE_EYE, at: [CHAIR.x - 0.02, 0.97, CHAIR.z - 0.04], fp: 50, fd: 44 },
          { t: LO.shut + 1.0, name: 'her', eye: CLOSE_EYE, at: [CHAIR.x - 0.01, 0.99, CHAIR.z - 0.05], fp: 40, fd: 36 },
          { t: LO.end, name: 'her', eye: CLOSE_EYE, at: [CHAIR.x - 0.01, 0.99, CHAIR.z - 0.05], fp: 40, fd: 36 }
        ]);
      },
      end() {
        fLens(PLAY_FOV); filmBed.on = false;
        if (kit && kit.vision) kit.vision({ r: 0, moving: false });
        whenReady(cast.phoB, (P) => bowSet(P, 0));
      }
    };

    /* ---------------------------------------------------------------- THE FOUR ENDINGS (§4.5) AND THE CLOSE
       Each ending begins on the trance's last frame (Ravi a step from her chair, the thing crying on her back, his
       teacher's hand on her head) and is a whole story: what he did, how it was answered, what it cost him, what he was
       told; then THE CLOSE, the same for all four: the release dedicated to all beings, the green shapes easing out of
       the room, her first steps to her altar, the sacred ash on her forehead, her palms together, his sight closing,
       and his teacher's word to the family. Every picture here is his eyes */
    const STAND = { x: CHAIR.x, z: CHAIR.z + 0.62 };                         // where her first steps take her, before her altar
    /* ending A: his eyes as he holds Ravi from behind (pulled back with him as the struggle drags them both), and
       Ravi's way to her afterwards, round the stool's far side to her left */
    /* (18 Nov: from her side of him Ravi was 29 degrees out of a phone's frame, the struggle never seen: the eye is now
       behind his shoulder on the line from him to her, and is pulled back with him, against the armchair's end) */
    const A_EYE = [[R1.x + 0.58, 1.62, R1.z - 0.28], [R1.x + 0.68, 1.62, R1.z - 0.36]];
    const A_WALK = [{ x: R1.x + 0.32, z: R1.z + 0.42 }, { x: R1.x - 0.02, z: R1.z + 0.56 }];
    const STEPS_TK = 0.9;                                                     // her steps take run to here: 0.28 m by its own travel
    const MALA_C = { x: CHAIR.x - 0.42, z: CHAIR.z + 0.82 };                 // Mala at her right in the close
    /* Ravi KNEELS at her left in the close (his kneel's own take), looking up at her: on his knees his head is a third of
       a metre under her face from every place the close looks from, and clear of the chair, the lamp and her steps */
    /* (a step behind her left since 18 Nov: at her side he knelt on the line from the merit's eye to her palms, and the
       lamp's shot was the back of his head, photographed) */
    const RAVI_C = { x: CHAIR.x + 0.47, z: CHAIR.z + 0.40 };
    /* the last green shapes in the close (A, B, C: his sight still open): two of the night's wanderers going out by the
       room's open door as his teacher gives them a share of the merit, each crawling its own take's travel toward the
       doorway (its hips go 0.9 m in the 2.3 s it is seen, clear of the bowl, the TV and the sofa) and fading */
    const CLOSE_WANDER = [{ x: 0.60, z: 2.50 }, { x: 0.25, z: 0.72 }].map(W => ({ ...W, ry: faceTo(W.x, W.z, 0, -0.4) }));
    /* Appa in the close (his sight still open in A, B, C): standing in the room between the shapes' way out and her
       chair, turned to her, while the merit is given; he does not go with them. (18 Nov, photographed: by his photograph,
       his own place, he stood a step from the close's lens and laid himself over his teacher's shoulder) */
    const APPA_C = { x: 0.10, z: 1.64 };
    /* (the endings' clocks, EN, and the close's, CL, are the chapter's own, z_tail.js: chaptertest reads each scene's length
       from them) */
    /* her rise from the chair (§4.5: "she stands up out of the chair"), standing still after: the rise take run over its
       own five seconds, then held breathing on its end */
    /* (out of her trance's held breath over its first 0.4 s, so her body does not jump the 5 cm between the two takes'
       first moments) */
    function ammaRise(t, t0) { whenReady(cast.amma, (P) => { put(P, CHAIR.x, CHAIR.z, CHAIR.ry);
      pose(P, 'rise', t - t0 < 4.9 ? Math.max(0, t - t0) : pingOf(t - t0 - 4.9, 4.6, 0.3, 3.0), false, 'trance', 1 - smo(c01((t - t0) / 0.4)), pingOf(t, 8.2, 1.5, 3.2)); }); }
    function ammaTrance(t) { whenReady(cast.amma, (P) => { put(P, CHAIR.x, CHAIR.z, CHAIR.ry); pose(P, 'trance', pingOf(t, 8.2, 1.5, 3.2)); }); }
    /* the one on her back: its cry, then torn from her (thrown back and gone in the light) */
    function oppressAt(t, cry, torn) {
      whenReady(spirits.oppress, (P) => {
        if (t >= torn + 1.2) { P.group.visible = false; return; }
        P.group.visible = true; oppRide(P);
        if (t < cry) pose(P, 'cry', pingOf(t, 2.6, 1.6, 2.4));
        else if (t < torn) pose(P, 'cry', Math.min(4.4, 0.4 + (t - cry) * 1.1));
        /* (torn away: its cry's own arch, the head thrown back and the arms flung wide, thrown back off her and up, and
           gone in the light. Its written `torn` begins three metres in the air and falls to the floor: measured 18 Nov,
           tools/probes/takepath.mjs, and not used) */
        else { const k = smo(c01((t - torn) / 1.1)); pose(P, 'cry', lp(1.0, 1.9, k)); P.group.position.z -= 0.6 * k; P.group.position.y += 0.25 * k; }
        if (P.fx) P.fx.set('uAlpha', t < torn ? 1 : 1 - smo(c01((t - torn - 0.3) / 0.9))); });
    }
    /* the green shapes still in the room ease and go as the merit is dedicated */
    function wanderersAt(t, go) {
      spirits.wander.forEach((P, i) => { if (!P.ready || !P.group.visible) return; const k = 1 - smo(c01((t - go - i * 0.6) / 2.2)); P.alpha = k; if (P.fx) P.fx.set('uAlpha', k); });
    }
    FILMS.ending = {
      begin(k, api) {
        if (api && api.handsRoot) api.handsRoot.visible = false;
        FM.once = new Set(); FM.key = k;
        whenReady(cast.pho, (P) => { P.group.visible = false; });
        whenReady(cast.mala, (P) => { put(P, MALA_T.x, MALA_T.z, faceTo(MALA_T.x, MALA_T.z, CHAIR.x, CHAIR.z)); });
        whenReady(cast.ravi, (P) => { put(P, R1.x, R1.z, RAVI_RY); });
        spiritsHome(); castSolid();
        filmBed.on = true; for (const q in filmBed) if (q !== 'on') filmBed[q] = 0; filmBed.dark = BED.dark;      // the dark room under every silence
      },
      frame(k, t, api) {
        fLook('DARK');
        const E = EN[k], c = t - E.close;
        if (c < 0) ENDS[k](t, E, api); else closeFrame(k, c, t);
      },
      end() { fLens(PLAY_FOV); goddess(0); filmBed.on = false; if (kit && kit.vision) kit.vision(null); }
    };
    const ENDS = {
      /* A · HE GRABS HIM AND HOLDS HIM BACK (worst). His arms round Ravi from the side, Ravi fighting him toward his
         mother, Mala screaming at them both; the cry peaks and the thing is torn from her in the light; she opens her
         eyes on a room of people struggling and stands, and her son is not beside her. Ravi goes still; then goes to her.
         His teacher, after; his own thought */
      A(t, E) {
        const RG = { x: R1.x + 0.05, z: R1.z - 0.05 };                       // Ravi, held
        ammaRise(t, E.rise); if (t < E.rise) ammaTrance(t);
        /* standing, she looks back over her shoulder for her son: held back, behind her (her face turned to him and to
           us; a neck's reach, the rest of the turn is his to see), and calls him ("Ravi?" at E.call: 18 Nov, photographed,
           said at 10.7 it fell while she was still pushing up out of the chair, her face down; he goes still on her voice) */
        if (t > E.call - 0.6) whenReady(cast.amma, (P) => lookNow(P, headOf(cast.ravi, [RG.x, 1.4, RG.z]), smo(c01((t - E.call + 0.6) / 1.0)), 1.25, 0.04));
        phoBless(t, 1 - smo(c01((t - E.rise + 0.4) / 0.8)));
        oppressAt(t, E.cry, E.torn); goddess(t < E.torn ? 1 : 1 - smo(c01((t - E.torn) / 1.5)));
        /* Ravi: fighting his hold until she rises (the take run to its end by then: it ran out and froze 3 s early);
           going still where the struggle has pulled him (his group drawn under him as the stand takes over, so his body
           stays put: the hips blend in a straight line between the two takes); then to her, round his teacher's stool by
           its far side, the walk paced by the ground it covers (1.29 m a second at its own rate, measured), and turned to
           her at the end */
        whenReady(cast.ravi, (P) => {
          const ds = hipsTravel(P, 'struggle', 5.9), c = Math.cos(RAVI_RY), sn = Math.sin(RAVI_RY);
          const DS = [ds[0] * c + ds[1] * sn, -ds[0] * sn + ds[1] * c], B0 = { x: RG.x + DS[0], z: RG.z + DS[1] };
          if (t < E.still) { put(P, RG.x, RG.z, RAVI_RY); pose(P, 'struggle', Math.min(5.9, t * 5.9 / E.still)); }
          else if (t < E.go) { const w = smo(c01((t - E.still) / 0.6)); put(P, RG.x + DS[0] * w, RG.z + DS[1] * w, RAVI_RY);
            pose(P, 'Idle_3', 3 + (t - E.still) * 0.4, true, 'struggle', 1 - w, 5.9); }
          else { const W1 = A_WALK[0], W2 = A_WALK[1], L1 = Math.hypot(W1.x - B0.x, W1.z - B0.z), L2 = Math.hypot(W2.x - W1.x, W2.z - W1.z), L = L1 + L2, T = L / 0.62;
            const sA = L * smo(c01((t - E.go) / T)), on1 = sA < L1, k1 = sA / Math.max(1e-3, L1), k2 = (sA - L1) / Math.max(1e-3, L2);
            const h1 = faceTo(B0.x, B0.z, W1.x, W1.z), h2 = faceTo(W1.x, W1.z, W2.x, W2.z), h3 = faceTo(W2.x, W2.z, CHAIR.x, CHAIR.z);
            const ry = sA < 0.25 ? lp(RAVI_RY, h1, smo(sA / 0.25)) : sA < L1 - 0.12 ? h1 : sA < L1 + 0.12 ? lp(h1, h2, smo((sA - L1 + 0.12) / 0.24)) : lp(h2, h3, smo(c01((sA - L + 0.25) / 0.25)));
            put(P, on1 ? lp(B0.x, W1.x, k1) : lp(W1.x, W2.x, k2), on1 ? lp(B0.z, W1.z, k1) : lp(W1.z, W2.z, k2), ry);
            const into = smo(c01((t - E.go) / 0.4)), outOf = smo(c01((t - E.go - T + 0.3) / 0.5));
            if (outOf <= 0) pose(P, 'Walking', sA / 1.29, true, 'Idle_3', 1 - into, 3 + (E.go - E.still) * 0.4);
            else pose(P, 'Idle_3', 3 + (t - E.go) * 0.4, true, 'Walking', 1 - outOf, sA / 1.29);
            lookNow(P, AMMA_FACE, smo(c01((t - E.go - 0.6) / 1)), 0.9); } });
        whenReady(cast.mala, (P) => { if (t < E.scream) pose(P, 'lightlamp', 5.4); else pose(P, 'scream', Math.min(3.9, (t - E.scream) * 0.9)); lookNow(P, [RG.x, 1.5, RG.z], 0.7, 0.9); });
        visionAt(t, -1, 0.1);
        /* THE LENS: in on Ravi's shoulder as he is caught (his mother beyond him); held through the cry; the light; out
           to her standing; on his teacher for his word */
        track(t, [
          { t: 0, name: 'S', eye: DEC_EYE, at: DEC_AT, fp: PLAY_FOV, fd: PLAY_FOV },
          { t: 0.55, name: 'held', eye: A_EYE[0], at: [CHAIR.x + 0.1, 1.15, CHAIR.z - 0.05], fp: 64, fd: 56 },
          { t: E.open, name: 'held', eye: A_EYE[1], at: [CHAIR.x + 0.08, 1.1, CHAIR.z], fp: 62, fd: 56 },
          { t: E.rise + 3.5, name: 'her', eye: A_EYE[1], at: [CHAIR.x, 1.4, CHAIR.z + 0.32], fp: 56, fd: 52 },
          { t: E.ph - 0.6, name: 'her', eye: A_EYE[1], at: [CHAIR.x + 0.02, 1.42, CHAIR.z + 0.32], fp: 56, fd: 52 },
          { t: E.ph + 0.4, name: 'pho', eye: A_EYE[1], at: [cast.phoB.home.x, 1.55, cast.phoB.home.z], fp: 46, fd: 42 },
          { t: E.close, name: 'pho', eye: A_EYE[1], at: [cast.phoB.home.x, 1.55, cast.phoB.home.z], fp: 46, fd: 42 }
        ]);
        phoTurn(t, E.ph, false, 'ph4A1');
      },
      /* B · HE THROWS THE WATER AT THE THING ON HER BACK (bad). The whole bowl at it: it lets go of her and comes at
         HIM, the vision filled with it, his heart stalling, the picture white. His teacher's hand leaves her head for the
         one moment it takes ("Go."); her trance falters; his hands return; the cry rises again and it is forced away.
         She opens her eyes and stands; he is on the floor. His teacher; his own thought */
      B(t, E) {
        const B_FLOOR = [S_EYE[0] + 0.1, 0.45, S_EYE[2] + 0.2];        // his eyes, on the floor
        ammaRise(t, E.rise);
        /* her trance falters while his hand is off her head (Mala's "Amma!"): her raised hands sink and her body gives
           toward her chair's rest, and comes back up as his hand returns */
        if (t < E.rise) { const f = smo(c01((t - E.falter) / 0.5)) * (1 - smo(c01((t - E.back) / 0.9)));
          if (f > 0.001) whenReady(cast.amma, (P) => { put(P, CHAIR.x, CHAIR.z, CHAIR.ry); pose(P, 'trance', pingOf(t, 8.2, 1.5, 3.2), false, 'wsit', 0.7 * f, 2.8); });
          else ammaTrance(t); }
        const off = t >= E.push && t < E.back;
        phoBless(t, off ? 1 - smo(c01((t - E.push) / 0.25)) : (t < E.push ? 1 : smo(c01((t - E.back) / 0.4))) * (1 - smo(c01((t - E.rise + 0.4) / 0.8))));
        /* the thing: off her back and at him (from her shoulder to a hand's breadth from his eyes), then back on her
           when his teacher's hand returns, its cry, and torn away */
        whenReady(spirits.oppress, (P) => {
          if (t >= E.torn + 1.2) { P.group.visible = false; return; }
          P.group.visible = true;
          const eye = COMES;
          if (t >= E.comes && t < E.back) {
            /* (off her back by m: from where it rides her to a hand's breadth from his eyes, turned to face him; back as
               his teacher's hand returns) */
            const u = smo(c01((t - E.comes) / 0.9)), w = smo(c01((t - E.go) / 0.5)), m = u * (1 - w);
            oppRide(P); _obq.copy(P.group.quaternion);
            const g = P.group.position, x = lp(g.x, eye[0], m), z = lp(g.z, eye[2], m), y = lp(g.y, eye[1] - 0.75, m);
            _ofq.setFromEuler(_ofe.set(0, faceTo(x, z, S_EYE[0], S_EYE[2]), 0));
            P.group.position.set(x, y, z); P.group.quaternion.slerpQuaternions(_obq, _ofq, m); pose(P, 'claw', (t - E.comes) * 1.2);
          } else { oppRide(P);
            if (t < E.comes) pose(P, 'cry', pingOf(t, 2.6, 1.6, 2.4));
            else if (t < E.torn) pose(P, 'cry', Math.min(4.4, 0.4 + (t - E.cry) * 1.1));
            else { const k = smo(c01((t - E.torn) / 1.1)); pose(P, 'cry', lp(1.0, 1.9, k)); P.group.position.z -= 0.6 * k; P.group.position.y += 0.25 * k; } }
          if (P.fx) P.fx.set('uAlpha', t < E.torn ? 1 : 1 - smo(c01((t - E.torn - 0.3) / 0.9))); });
        goddess(t < E.falter ? 1 : t < E.back ? 0.35 : t < E.torn ? lp(0.35, 1, smo(c01((t - E.back) / 1.2))) : 1 - smo(c01((t - E.torn) / 1.5)));
        whenReady(cast.ravi, (P) => { rushHeld(P, t); lookNow(P, AMMA_FACE, 1, 0.9); });
        /* Mala: crying out as the water hits her mother ("What are you doing?"), and at the falter ("Amma!"); her scream
           let go once her mother is up, and her eyes down to him on the floor ("Are you alright?") */
        whenReady(cast.mala, (P) => { if (t < E.splash) pose(P, 'lightlamp', 5.4);
          else { const r = smo(c01((t - E.rise - 1.2) / 1.4)); pose(P, 'scream', Math.min(3.9, (t - E.splash) * 0.8), false, 'Idle_3', r, 3 + t * 0.35); }
          lookNow(P, lp3(AMMA_FACE, B_FLOOR, smo(c01((t - E.ok + 0.5) / 0.6))), 0.8, 0.9); });
        visionAt(t, -1, 0.1);
        /* THE LENS: the throw (a lurch at her); the thing filling his eyes; white; his teacher's push seen through the
           white; then he is on the floor, looking up at her standing, and at his teacher */
        track(t, [
          { t: 0, name: 'S', eye: DEC_EYE, at: DEC_AT, fp: PLAY_FOV, fd: PLAY_FOV },
          { t: E.throw + 0.25, name: 'throw', eye: [S_EYE[0] + TOWARD[0] * 0.2, 1.58, S_EYE[2] + TOWARD[1] * 0.2], at: [CHAIR.x - 0.05, 1.0, CHAIR.z - 0.2], fp: 58, fd: 52 },
          { t: E.comes + 0.9, name: 'it', eye: [S_EYE[0] - TOWARD[0] * 0.06, 1.6, S_EYE[2] - TOWARD[1] * 0.06], at: [COMES[0], 1.3, COMES[2]], fp: 70, fd: 64 },
          { t: E.floor, name: 'down', eye: [S_EYE[0] - TOWARD[0] * 0.1, 1.58, S_EYE[2] - TOWARD[1] * 0.1], at: [COMES[0], 1.25, COMES[2]], fp: 68, fd: 62 },
          { t: E.floor + 0.6, name: 'floor', eye: [S_EYE[0] + 0.1, 0.42, S_EYE[2] + 0.2], at: [cast.phoB.home.x, 1.3, cast.phoB.home.z + 0.2], fp: 66, fd: 58, roll: 0.12 },
          { t: E.back + 0.6, name: 'floor', eye: [S_EYE[0] + 0.1, 0.42, S_EYE[2] + 0.2], at: [CHAIR.x + 0.2, 0.95, CHAIR.z], fp: 66, fd: 58, roll: 0.1 },
          { t: E.rise + 4.5, name: 'floor', eye: [S_EYE[0] + 0.1, 0.42, S_EYE[2] + 0.2], at: [CHAIR.x + 0.1, 1.2, CHAIR.z + 0.1], fp: 62, fd: 56, roll: 0.05 },
          { t: E.ph + 0.3, name: 'pho', eye: [S_EYE[0] + 0.1, 0.45, S_EYE[2] + 0.2], at: [cast.phoB.home.x, 1.55, cast.phoB.home.z], fp: 52, fd: 46 },
          { t: E.close, name: 'pho', eye: [S_EYE[0] + 0.1, 0.45, S_EYE[2] + 0.2], at: [cast.phoB.home.x, 1.55, cast.phoB.home.z], fp: 52, fd: 46 }
        ]);
        phoTurn(t, E.ph, true, 'ph4B1');
        /* his teacher's push: turned toward the thing that went for his student, both hands thrust out at it and held,
           then back to his stand as his hand goes back to her head (18 Nov, photographed: the cast that raises both arms
           threw his head back behind its own raised robe, and from the floor he read headless; this cast's thrust keeps
           his head up and forward, 1.34 m, over his hands: tools/probes/takepath.mjs) */
        if (t >= E.push - 0.05 && t < E.back) whenReady(cast.phoB, (P) => {
          const w = smo(c01((t - E.push) / 0.3)) * (1 - smo(c01((t - E.back + 0.45) / 0.45)));
          const d0 = faceTo(P.home.x, P.home.z, S_EYE[0], S_EYE[2]) - P.home.ry, d = Math.atan2(Math.sin(d0), Math.cos(d0));
          P.group.rotation.y = P.home.ry + d * w;
          /* (held at the take's 0.95: from 1.0 on it crosses both arms over his face, and from the floor, at its 1.32, he read
             headless again: build 13, photographed at 4.0) */
          pose(P, 'mage_soell_cast_3', runOf(t, E.push, E.push + 0.6, 0.5, 0.95), false, 'Sit_to_Stand_Transition_M', 1 - w, pingOf(t, 5.85, 0.25, PHO_BREATH)); });
      },
      /* C · HE GOES TO HIM (best). Between Ravi and the chair, his hands open, low: "She's not being hurt. It's leaving
         her. Stay with her. Hold her hand." Ravi kneels by the chair and takes her hand; Mala comes to the other side.
         The cry; the thing forced from her back; she opens her eyes, looks at her son, and stands, holding his hand */
      C(t, E) {
        const KR = KNEEL_R, KM = { x: CHAIR.x - 0.48, z: CHAIR.z + 0.2 };
        if (t < E.rise) ammaTrance(t); else ammaRise(t, E.rise);
        phoBless(t, 1 - smo(c01((t - E.rise + 0.4) / 0.8)));
        oppressAt(t, E.cry, E.torn); goddess(t < E.torn ? 1 : 1 - smo(c01((t - E.torn) / 1.5)));
        /* (Ravi held where his rush stopped, his eyes on the one who stops him; on "Hold her hand" he goes to her side and
           kneels, his eyes turning from him to her; Mala comes round to her other side and kneels too: walkKneel) */
        whenReady(cast.ravi, (P) => {
          if (t < E.kneel) { rushHeld(P, t); lookNow(P, CR_EYE, smo(c01((t - 0.5) / 0.8)), 0.8); }
          else { walkKneel(P, t, E.kneel, rushXZ(P, 2.5), KR, faceTo(KR.x, KR.z, CHAIR.x, CHAIR.z + 0.2), ['rush', pingOf(E.kneel, 2.45, 0.12, 1.4)],
              { ry0: RAVI_RY, kt: (td) => (t < E.rise ? Math.min(4.2, td) : runOf(t, E.rise + 0.6, E.rise + 3.6, 4.2, 0.2)) });
            lookNow(P, lp3(CR_EYE, AMMA_FACE, smo(c01((t - E.kneel) / 0.5))), 1, 0.9); } });
        whenReady(cast.mala, (P) => {
          if (t < E.mala) { pose(P, 'lightlamp', 5.4); lookNow(P, AMMA_FACE, 1, 0.9); }
          else { walkKneel(P, t, E.mala, MALA_T, KM, faceTo(KM.x, KM.z, CHAIR.x, CHAIR.z + 0.2), ['lightlamp', 5.4],
              { ry0: faceTo(MALA_T.x, MALA_T.z, CHAIR.x, CHAIR.z), kt: (td) => (t < E.rise ? Math.min(4.2, td) : runOf(t, E.rise + 0.8, E.rise + 3.8, 4.2, 0.2)) });
            lookNow(P, AMMA_FACE, 1, 0.9); } });
        /* she looks at her son before she stands */
        if (t >= E.look) whenReady(cast.amma, (P) => lookNow(P, headOf(cast.ravi, [KR.x, 0.9, KR.z]), smo(c01((t - E.look) / 0.8)), 1.0));
        visionAt(t, -1, 0.1);
        track(t, [
          { t: 0, name: 'S', eye: DEC_EYE, at: DEC_AT, fp: PLAY_FOV, fd: PLAY_FOV },
          { t: 0.65, name: 'ravi', eye: CR_EYE, at: CR_HEAD, fp: 58, fd: 50 },
          { t: E.kneel, name: 'ravi', eye: CR_EYE, at: CR_HEAD, fp: 58, fd: 50 },
          { t: E.kneel + 1.9, name: 'kneel', eye: CK_EYE, at: CK_AT, fp: 62, fd: 54 },
          { t: E.rise, name: 'kneel', eye: CK_EYE, at: CK_AT, fp: 62, fd: 54 },
          { t: E.rise + 2.8, name: 'stand', eye: CK_EYE, at: [CHAIR.x + 0.04, 1.22, CHAIR.z + 0.24], fp: 58, fd: 52 },
          { t: E.ph - 0.4, name: 'stand', eye: CK_EYE, at: [CHAIR.x + 0.04, 1.28, CHAIR.z + 0.28], fp: 58, fd: 52 },
          { t: E.ph + 0.5, name: 'pho', eye: CK_EYE, at: [cast.phoB.home.x, 1.58, cast.phoB.home.z], fp: 46, fd: 42 },
          { t: E.close, name: 'pho', eye: CK_EYE, at: [cast.phoB.home.x, 1.58, cast.phoB.home.z], fp: 46, fd: 42 }
        ]);
        phoTurn(t, E.ph, false, 'ph4C1');
      },
      /* D · HE KEEPS HIS PLACE (good). The bowl steady, his sight shut, his eyes on his teacher. Ravi reaches the chair;
         his teacher, without looking up: "Ravi. Hold her hand." He does. The cry is heard; the light; she opens her eyes
         and stands. His teacher; his own thought */
      D(t, E) {
        const KR = KNEEL_R;
        if (t < E.rise) ammaTrance(t); else ammaRise(t, E.rise);
        phoBless(t, 1 - smo(c01((t - E.rise + 0.4) / 0.8)));
        oppressAt(t, E.cry, E.torn); goddess(t < E.torn ? 1 : 1 - smo(c01((t - E.torn) / 1.5)));
        /* (Ravi reaches the chair: a step out of his rush toward her, standing there while his teacher speaks to him; on
           "Hold her hand" round to her side and down onto his knees: walkKneel, its two legs) */
        whenReady(cast.ravi, (P) => {
          const RX = rushXZ(P, 2.5), R2 = { x: RX.x - 0.12, z: RX.z + 0.18 }, r2 = faceTo(R2.x, R2.z, CHAIR.x, CHAIR.z);
          if (t < E.reach) rushHeld(P, t);
          else if (t < E.kneel) walkKneel(P, t, E.reach, RX, R2, r2, ['rush', pingOf(E.reach, 2.45, 0.12, 1.4)], { ry0: RAVI_RY, kneelAt: Infinity });
          else walkKneel(P, t, E.kneel, R2, KR, faceTo(KR.x, KR.z, CHAIR.x, CHAIR.z + 0.2), ['Idle_3', 3 + (E.kneel - E.reach) * 0.4],
            { ry0: r2, kt: (td) => (t < E.rise ? Math.min(4.2, td) : runOf(t, E.rise + 0.6, E.rise + 3.6, 4.2, 0.2)) });
          lookNow(P, AMMA_FACE, 1, 0.9); });
        whenReady(cast.mala, (P) => { pose(P, 'lightlamp', 5.4); lookNow(P, AMMA_FACE, 1, 0.9); });
        /* his sight shut at the start: the wave home to him */
        visionAt(t, -10, 0.1, E.shut, 1.0);
        track(t, [
          { t: 0, name: 'S', eye: DEC_EYE, at: DEC_AT, fp: PLAY_FOV, fd: PLAY_FOV },
          { t: 1.2, name: 'pho', eye: S_EYE, at: PHO_BOW, fp: 52, fd: 48 },
          { t: E.kneel + 0.6, name: 'pho', eye: S_EYE, at: PHO_BOW, fp: 52, fd: 48 },
          { t: E.kneel + 2.0, name: 'her', eye: S_EYE, at: [CHAIR.x + 0.09, 0.92, CHAIR.z + 0.08], fp: 60, fd: 52 },
          { t: E.rise, name: 'her', eye: S_EYE, at: [CHAIR.x + 0.09, 0.92, CHAIR.z + 0.08], fp: 60, fd: 52 },
          { t: E.rise + 2.8, name: 'stand', eye: S_EYE, at: [CHAIR.x + 0.04, 1.26, CHAIR.z + 0.26], fp: 58, fd: 52 },
          { t: E.ph - 0.4, name: 'stand', eye: S_EYE, at: [CHAIR.x + 0.04, 1.30, CHAIR.z + 0.28], fp: 58, fd: 52 },
          { t: E.ph + 0.5, name: 'pho', eye: S_EYE, at: [cast.phoB.home.x, 1.62, cast.phoB.home.z], fp: 46, fd: 42 },
          { t: E.close, name: 'pho', eye: S_EYE, at: [cast.phoB.home.x, 1.62, cast.phoB.home.z], fp: 46, fd: 42 }
        ]);
        phoTurn(t, E.ph, false, 'ph4D1');
      }
    };
    /* Grandmaster Pho turns his face to him for his word (and talks: his own talking take, the line's length) */
    /* (a man who talks to him turns his BODY to him, the head doing only the last of the turn, a neck's easy 26 degrees:
       the rule of v14.5. 18 Nov, photographed: ending A's eye is at his left, 93 degrees round; the head alone at its
       reach, over a talking take that turns his shoulders 15 degrees the other way, left him in profile looking away) */
    const _ptv = new THREE.Vector3();
    function phoTurn(t, ph, low = false, line = null) {
      phoTalk(t, ph, line);
      whenReady(cast.phoB, (P) => { if (t < ph - 0.6) return;
        const k = smo(c01((t - ph + 0.6) / 0.8)), to = low ? [S_EYE[0] + 0.1, 0.5, S_EYE[2] + 0.2] : null;
        if (to) _ptv.set(to[0], to[1], to[2]); else camera.getWorldPosition(_ptv);
        const h = P.home, d0 = faceTo(h.x, h.z, _ptv.x, _ptv.z) - h.ry, d = Math.atan2(Math.sin(d0), Math.cos(d0));
        P.group.rotation.y = h.ry + Math.sign(d) * Math.max(0, Math.abs(d) - 0.45) * k;
        lookNow(P, to || 'lens', k, 0.8, low ? 0 : 0.03); });
    }
    /* his talking take on the line's own start, eased in and out of his stand, for the line's measured length (the v11.4
       law: he talks while he speaks, and goes back to rest after); its head held (PHO_STAND_HEAD) */
    function phoTalk(t, at, line) {
      const L = line && SECS[line]; if (!L || t < at - 0.25 || t > at + L + 0.7) return;
      whenReady(cast.phoB, (P) => { const k = smo(c01((t - at + 0.25) / 0.4)) * (1 - smo(c01((t - at - L - 0.1) / 0.6)));
        pose(P, 'Talk_with_Hands_Open', Math.max(0, t - at), true, 'Sit_to_Stand_Transition_M', 1 - k, pingOf(t, 5.85, 0.25, PHO_BREATH)); });
    }
    /* THE CLOSE (§4.5, every ending): from his place at her front left again */
    /* her hips' place when the rise leaves her standing at her chair (its held end), measured once on her own body; and her
       group moved so her hips stand where a moment of her walk says (a function of the film's clock: seek-safe) */
    const _phv = new THREE.Vector3();
    function standA(P) { if (!P._standA) { put(P, CHAIR.x, CHAIR.z, CHAIR.ry); pose(P, 'rise', 4.75); P.group.updateWorldMatrix(true, true); P.hips.getWorldPosition(_phv); P._standA = [_phv.x, _phv.z]; } return P._standA; }
    function pinHips(P, x, z) { if (!P.hips) return; P.group.updateWorldMatrix(true, true); P.hips.getWorldPosition(_phv); P.group.position.x += x - _phv.x; P.group.position.z += z - _phv.z; }
    function closeFrame(k, c, tAll) {
      void EN;
      /* she stands (in every ending she has risen by now) and walks to her altar; the ash; her palms together */
      whenReady(cast.amma, (P) => {
        /* (each take carries her body from its own first moment: the rise left her standing RISEN before the chair's
           middle, the steps take the rest of the way to the altar by its own travel, so her mark moves only between
           takes. 18 Nov: her mark slid to the altar under a walking take that also walked: she ended in its wall) */
        const sk = Math.min(STEPS_TK, (c - CL.steps) * 0.55), stepEnd = CL.steps + STEPS_TK / 0.55;
        if (c < CL.steps) { put(P, CHAIR.x, CHAIR.z, CHAIR.ry); pose(P, 'rise', pingOf(c, 4.6, 0.3, 3.0)); }
        else {
          /* (her HIPS held where her own takes carry them: where the rise leaves them standing at her chair (measured once
             on the rise's held end, standA), then on by the steps' own travel, then still, the lamp's own small sway kept.
             18 Nov, measured from the close's photographs: her mark moved for the steps while the rise was still blended in
             carried her 0.31 m forward in half a second as she began to walk, out of the shot; and the lamp take's own
             offset carried her 0.48 m back toward her chair as her palms joined, out of the lamp's shot) */
          const A = standA(P); let hx = A[0], hz = A[1];
          put(P, CHAIR.x, CHAIR.z, CHAIR.ry);
          if (c < stepEnd) { const S = hipsTravel(P, 'steps', sk); hx += S[0]; hz += S[1];
            pose(P, 'steps', sk, false, 'rise', 1 - smo(c01((c - CL.steps) / 0.5)), 4.75); }
          else { const S = hipsTravel(P, 'steps', STEPS_TK); hx += S[0]; hz += S[1];
            if (c < CL.palms) pose(P, 'rise', pingOf(c - stepEnd, 4.6, 0.3, 3.0), false, 'steps', 1 - smo(c01((c - stepEnd) / 0.6)), STEPS_TK);
            /* (her palms joined at her chest and held there, upright: the take's last half-second is a deep bow, 0.31 m from
               hips to head, and held for ten seconds she stood folded over: 18 Nov, photographed) */
            else { const lt = runOf(c, CL.palms, CL.palms + 2.2, 3.4, 4.8), wl = smo(c01((c - CL.palms) / 0.5)), L = hipsTravel(P, 'lamp', lt), L0 = hipsTravel(P, 'lamp', 3.4);
              hx += (L[0] - L0[0]) * wl; hz += (L[1] - L0[1]) * wl;
              pose(P, 'lamp', lt, false, 'rise', 1 - wl, 4.75); } }
          pinHips(P, hx, hz); }
        lookNow(P, [ALTAR.x, 1.45, ALTAR.z], c < CL.palms ? smo(c01((c - CL.steps) / 1.5)) * 0.6 : 0, 0.6); });
      phoBless(tAll, 0);
      phoTalk(c, CL.z1, 'ph4z1');
      /* (his dedication said with his eyes on her and a little lowered; his word to the family to her son. 18 Nov: every
         look in the close went to AMMA_FACE, her face SEATED, a chest's height once she stands) */
      whenReady(cast.phoB, (P) => { const h = HER_HEAD(); lookNow(P, c > CL.z1 - 1 ? headOf(cast.ravi, [RAVI_C.x, 1.6, RAVI_C.z]) : [h[0], h[1] - 0.25, h[2]], 0.8, 0.8); });
      /* the family about her: Mala at her right hand (the ash), Ravi at her left */
      whenReady(cast.mala, (P) => { put(P, MALA_C.x, MALA_C.z, faceTo(MALA_C.x, MALA_C.z, STAND.x, STAND.z));
        pose(P, 'Idle_3', 3 + c * 0.3, true); lookNow(P, HER_HEAD(), 1, 0.9);
        /* (the ash on her FOREHEAD, her daughter's fingers drawn across her brow from her right side: 18 Nov, photographed
           at her chin and then at her nose, the point guessed from the head bone; now her brow as her skin has it,
           HER_BROW (c_scast.js), and from the side the wrist is 0.11 m nearer her daughter) */
        if (c > CL.ash - 0.6 && c < CL.ash + 1.8) { const h = HER_BROW(); handTo(P, 'R', [h[0] - 0.02, h[1], h[2]], [1, 0, 0], [0, 0, -1], smo(c01((c - CL.ash + 0.6) / 0.6)) * (1 - smo(c01((c - CL.ash - 1.2) / 0.6))), { out: 0.25, down: 0.35 }); } });
      /* (Ravi turns his head to his teacher as he is spoken to: a neck's reach, his body still turned to her) */
      whenReady(cast.ravi, (P) => { put(P, RAVI_C.x, RAVI_C.z, faceTo(RAVI_C.x, RAVI_C.z, STAND.x, STAND.z)); pose(P, 'kneelhold', pingOf(c, 2.6, 0.8, 6.0));
        const h = HER_HEAD(), ph = cast.phoB.home, k = smo(c01((c - CL.z1 + 0.9) / 0.9));
        lookNow(P, [lp(h[0], ph.x, k), lp(h[1], 1.55, k), lp(h[2], ph.z, k)], 1, 1.0); });
      whenReady(spirits.oppress, (P) => { P.group.visible = false; });
      whenReady(spirits.appa, (P) => { if (P.gone) return; put(P, APPA_C.x, APPA_C.z, faceTo(APPA_C.x, APPA_C.z, CHAIR.x, CHAIR.z + 0.3)); pose(P, 'Idle_3', 2 + c * 0.3, true); });
      spirits.wander.forEach((P, i) => whenReady(P, (Q) => { const W = CLOSE_WANDER[i]; if (!W) return;
        put(Q, W.x, W.z, W.ry); Q.group.visible = true; pose(Q, 'crawl', Math.max(0, c - CL.go + 1.0) * 0.6); }));
      wanderersAt(c, CL.go);
      /* his sight: still open from the ending (but D's, shut already), closing after her palms */
      if (k !== 'D') visionAt(c, -10, 0.1, CL.shut, 1.0); else visionAt(c, 1e9);
      /* THE LENS (18 Nov, re-staged): his teacher whole as he dedicates the merit, the last green shapes going out low
         past him; to her, risen at her chair; her steps to her altar; in on the ash between her and her daughter; her
         palms and her lamp; his sight closing on her; out to her family about her in the room's own colours; and over her
         son's shoulder to his teacher for his word. Every aim is where its subject stands (a phone's frame is 35 degrees:
         his teacher and the shapes share it, her family shares it, but not both) */
      /* (THE FAMILY, 18 Nov, re-staged: from the merit's eye they stood in one line from the lens, her son's head under her
         and her daughter behind the altar's post, and the shot's two keys ran backwards in time, so it never held. Now from
         behind and to their left, by his teacher's stool: the three before her altar, her lamp lit between them, her
         chair empty in the corner of the frame. Cut to and cut away: its own eye) */
      const ph = cast.phoB.home, FAM_EYE = [0.80, 1.55, 3.40], FAM = [-0.12, 1.12, 4.75];
      track(c, [
        { t: 0, name: 'merit', eye: CLOSE_EYE, at: [0.05, 1.09, 2.39], fp: 58, fd: 52, cut: true },
        { t: 6.6, name: 'merit', eye: CLOSE_EYE, at: [0.02, 1.13, 2.47], fp: 58, fd: 52 },
        { t: 9.8, name: 'her', eye: CLOSE_EYE, at: [CHAIR.x + 0.05, 1.30, CHAIR.z + 0.30], fp: 56, fd: 50 },
        { t: CL.steps + 0.2, name: 'her', eye: CLOSE_EYE, at: [CHAIR.x + 0.05, 1.30, CHAIR.z + 0.30], fp: 56, fd: 50 },
        { t: CL.steps + 1.6, name: 'her', eye: CLOSE_EYE, at: [STAND.x + 0.02, 1.34, STAND.z], fp: 54, fd: 50 },
        { t: CL.ash - 0.5, name: 'ash', eye: CLOSE_EYE, at: [lp(STAND.x, MALA_C.x, 0.4), 1.45, lp(STAND.z, MALA_C.z, 0.4)], fp: 48, fd: 44 },
        { t: CL.ash + 1.5, name: 'ash', eye: CLOSE_EYE, at: [lp(STAND.x, MALA_C.x, 0.4), 1.45, lp(STAND.z, MALA_C.z, 0.4)], fp: 48, fd: 44 },
        { t: CL.palms + 0.4, name: 'lamp', eye: CLOSE_EYE, at: [STAND.x + 0.02, 1.22, STAND.z + 0.16], fp: 54, fd: 50 },
        { t: CL.shut + 0.2, name: 'lamp', eye: CLOSE_EYE, at: [STAND.x + 0.02, 1.22, STAND.z + 0.16], fp: 54, fd: 50 },
        { t: CL.fam, name: 'family', eye: FAM_EYE, at: FAM, fp: 62, fd: 54, cut: true },
        { t: CL.z1 - 0.35, name: 'family', eye: FAM_EYE, at: [FAM[0] + 0.03, FAM[1] + 0.02, FAM[2]], fp: 60, fd: 52 },
        { t: CL.z1 - 0.3, name: 'pho', eye: CLOSE_EYE, at: [ph.x + 0.05, 1.5, ph.z + 0.05], fp: 50, fd: 46, cut: true },
        { t: CL.end, name: 'pho', eye: CLOSE_EYE, at: [ph.x + 0.05, 1.5, ph.z + 0.05], fp: 50, fd: 46 }
      ]);
    }
    /* what a scene reaches of the films (stage.films): the clocks, and each film's three hands */
    const filmsApi = {
      trance: FILMS.trance,
      lost: FILMS.lost,
      begin: (k, c, api) => FILMS.ending.begin(k, api),
      frame: (k, t, api) => FILMS.ending.frame(k, t, api),
      end: () => FILMS.ending.end()
    };

    /* ---------------------------------------------------------------- THE OPENING FILM (§4.0; its clock: OP, z_tail.js)
       Black, and his voice; the estate from her corridor at night; a lift's chime far off and the walk along the corridor
       to her gate, his teacher in white waiting at it, the kolam on the floor, the mango leaves over the door; Ravi at the
       grille, the latch; in the black the gate swung back; Ravi in her doorway, his welcome; in the black his teacher
       goes in before him; the room as he crosses it to her left side: the tube, the fan, her goddess on the wall, Amma in
       her wheelchair facing it, Mala beside her; the room's sound drops, his heart twice, and her head turns, slowly,
       not to his teacher, to HIM; and for a held breath his sight opens by itself (no training yet holds it shut): the
       crimson shape on her back, its face turned to him too. Black: the title.
       (The plan's §4.0 has the shape seen in a dark window's reflection; a reflection of the vision's own layer would need
       a mirror pass the engine does not have, so the same beat is his sight flickering open on its own: the tracker, D-list) */
    const KOLAM = (() => {
      const [c, x] = cnv(512); x.clearRect(0, 0, 512, 512);
      x.strokeStyle = '#ffffff'; x.fillStyle = '#ffffff'; x.lineCap = 'round'; x.lineJoin = 'round';
      const C = 256, n = 8;
      /* a lotus of eight petals round a ring of dots, and a square of loops round it: rice flour, drawn by a hand */
      x.lineWidth = 7;
      for (let i = 0; i < n; i++) { const a = i * Math.PI * 2 / n;
        x.save(); x.translate(C, C); x.rotate(a); x.beginPath(); x.moveTo(0, -40); x.quadraticCurveTo(52, -112, 0, -178); x.quadraticCurveTo(-52, -112, 0, -40); x.stroke(); x.restore(); }
      x.lineWidth = 6; x.beginPath(); x.arc(C, C, 34, 0, Math.PI * 2); x.stroke();
      for (let i = 0; i < n; i++) { const a = (i + 0.5) * Math.PI * 2 / n; x.beginPath(); x.arc(C + Math.sin(a) * 120, C - Math.cos(a) * 120, 9, 0, Math.PI * 2); x.fill(); }
      x.lineWidth = 5;
      for (let i = 0; i < 4; i++) { const a = i * Math.PI / 2 + Math.PI / 4;
        x.save(); x.translate(C, C); x.rotate(a); x.beginPath(); x.moveTo(-150, -150); x.quadraticCurveTo(0, -250, 150, -150); x.stroke();
        x.beginPath(); x.arc(0, -214, 16, 0, Math.PI * 2); x.stroke(); x.restore(); }
      x.lineWidth = 4; x.strokeRect(40, 40, 432, 432);
      for (let i = 0; i < 9; i++) for (const [px, py] of [[40 + i * 54, 20], [40 + i * 54, 492], [20, 40 + i * 54], [492, 40 + i * 54]]) { x.beginPath(); x.arc(px, py, 5, 0, Math.PI * 2); x.fill(); }
      const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
      const m = new THREE.MeshBasicMaterial({ map: t, transparent: true, depthWrite: false, color: 0xd8d4c8, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });
      const g = new THREE.PlaneGeometry(0.86, 0.86), me = new THREE.Mesh(g, m);
      me.rotation.x = -Math.PI / 2; me.position.set(0, FL.corr + 0.003, -0.78); me.renderOrder = 1;
      world.add(me); owned.push(g, t); mats.push(m);
      return me;
    })();
    void KOLAM;
    const PHO_GATE = { x: -0.42, z: -0.74 }, RAVI_DOOR = { x: 0.06, z: 0.26 }, PHO_IN = { x: 0.3, z: 4.18 }, RAVI_IN = { x: 1.55, z: 1.22 };
    const O_EYE = [0.98, 1.62, 3.32];                                         // where he stops, at her left side
    FILMS.open = {
      begin(api) {
        if (api && api.handsRoot) api.handsRoot.visible = false;
        FM.once = new Set(); castHome(); spiritsHome(); whenReady(cast.phoB, (P) => bowSet(P, 0));
        whenReady(cast.pho, (P) => { P.group.visible = false; });
        filmBed.on = true; for (const k in filmBed) if (k !== 'on') filmBed[k] = 0;
      },
      frame(t) {
        const T = OP, inside = t >= T.cut2;
        fLook('FLAT');
        /* the beds by place: the estate and the corridor outside, the room inside, and the room's sound dropping as she
           turns to him */
        filmBed.estate = t < T.cut1 ? BED.estate * (t < T.turn ? 1.2 : 0.8) : (inside ? BED.estate * 0.6 : BED.estate * 0.8);
        filmBed.corr = t < T.cut2 ? BED.corr : 0;
        filmBed.flat = inside ? BED.flat * (1 - 0.75 * smo(c01((t - T.drop) / 0.8))) : 0;
        /* her gate: shut until the first black, swung back (out of sight) after it */
        for (const g of (things.w4gate || []).slice(0, 1)) g.visible = t < T.cut1 + 0.3;
        /* his teacher: at her gate, then (in the second black) in the room before her, at her left */
        whenReady(cast.phoB, (P) => { P.group.visible = true;
          if (!inside) put(P, PHO_GATE.x, PHO_GATE.z, 0); else put(P, PHO_IN.x, PHO_IN.z, faceTo(PHO_IN.x, PHO_IN.z, CHAIR.x, CHAIR.z));
          pose(P, 'Sit_to_Stand_Transition_M', pingOf(t, 5.85, 0.25, PHO_BREATH));
          if (inside) lookNow(P, AMMA_FACE, 1, 0.8); });
        /* Ravi: behind the grille, then in her doorway, his welcome; then aside, in the room */
        whenReady(cast.ravi, (P) => {
          if (!inside) { put(P, RAVI_DOOR.x, t < T.cut1 ? RAVI_DOOR.z + 0.25 : RAVI_DOOR.z, Math.PI);
            if (t >= T.rv && t < T.rv + 2.7) pose(P, 'Talk_with_Hands_Open', (t - T.rv) * 1.0); else pose(P, 'Idle_3', 2 + t * 0.35, true);
            lookNow(P, t < T.cut1 ? [PHO_GATE.x, 1.7, PHO_GATE.z] : 'lens', 1, 0.8); }
          else { put(P, RAVI_IN.x, RAVI_IN.z, faceTo(RAVI_IN.x, RAVI_IN.z, CHAIR.x, CHAIR.z)); pose(P, 'Idle_3', 4 + t * 0.35, true); lookNow(P, AMMA_FACE, 1, 0.8); } });
        whenReady(cast.mala, (P) => { put(P, MALA_T.x, MALA_T.z, faceTo(MALA_T.x, MALA_T.z, CHAIR.x, CHAIR.z)); pose(P, 'Idle_3', 1 + t * 0.35, true); lookNow(P, inside && t > T.inside ? 'lens' : AMMA_FACE, inside && t > T.inside ? smo(c01((t - T.inside) / 1.2)) * 0.6 : 1, 0.8); });
        /* her: in her chair before her goddess; her head turning to him (past his teacher) as the room's sound drops */
        whenReady(cast.amma, (P) => { pose(P, 'wsit', pingOf(t, 2.0, 3.6, 12)); if (t > T.look) lookNow(P, 'lens', smo(c01((t - T.look) / 2.0)), 1.35, 0.05); });
        /* the one on her back, seen only in the flicker; its face turned to him with hers */
        whenReady(spirits.oppress, (P) => { oppRide(P); pose(P, 'cling', 2 + t * 0.3); if (t > T.look) lookNow(P, 'lens', smo(c01((t - T.look - 0.4) / 1.6)), 1.3); });
        /* his sight, open for a held breath by itself */
        if (kit && kit.vision) {
          const u = c01((t - T.flick) / (T.flickEnd - T.flick)), r = t < T.flick || t > T.flickEnd ? 0 : 7 * Math.sin(Math.PI * u);
          kit.vision({ r, moving: r > 0.01 });
        }
        /* THE LENS */
        track(t, [
          /* (R36, 18 Nov: the picture comes up after 2.6 s of black, not 7.6 (v7.7: no long black), on the sky over the
             estate, the block across's roof and the newer towers beyond; and comes down across the block's lit storeys
             while he speaks, to its middle, before he turns to the corridor) */
          { t: 0, name: 'sky', eye: [-6.0, 1.52, -1.35], at: [-20, 26, -60], fp: 54, fd: 48 },
          { t: T.est + 0.4, name: 'sky', eye: [-6.0, 1.52, -1.35], at: [-20, 26, -60], fp: 54, fd: 48 },
          { t: T.turn, name: 'estate', eye: [-6.0, 1.5, -1.3], at: [-2, 3.5, -42], fp: 52, fd: 46 },
          { t: T.walk, name: 'corridor', eye: [-6.0, 1.5, -1.05], at: [2, 1.35, -0.85], fp: 60, fd: 54 },
          /* (18 Nov, photographed on build 19: from behind his teacher's shoulder the gate and Ravi behind it were his
             back; from here, nearer the parapet and further back, his teacher stands at the right in profile and Ravi's
             face is behind the grille in the middle) */
          { t: T.at, name: 'gate', eye: [-2.0, 1.55, -1.6], at: [-0.15, 1.55, 0.0], fp: 58, fd: 52 },
          { t: T.cut1 + 0.6, name: 'door', eye: [0.48, 1.5, -1.05], at: [RAVI_DOOR.x, 1.6, RAVI_DOOR.z], fp: 50, fd: 46, cut: true },
          { t: T.cut2, name: 'door', eye: [0.48, 1.5, -1.05], at: [RAVI_DOOR.x, 1.6, RAVI_DOOR.z], fp: 50, fd: 46 },
          { t: T.cut2 + 0.5, name: 'in', eye: [0.1, 1.6, 0.45], at: [CHAIR.x, 1.1, CHAIR.z], fp: 62, fd: 56, cut: true },
          { t: T.inside, name: 'in', eye: [0.45, 1.62, 1.7], at: [CHAIR.x + 0.1, 1.05, CHAIR.z], fp: 62, fd: 56 },
          /* (18 Nov, photographed on build 19: aimed at 1.0 m over a point 10 cm before the chair's middle, a phone had her
             face at its right edge and Mala's head cut away above; her head as it sits in her chair is 5 cm behind the
             chair's middle: the loss's measure) */
          { t: T.look, name: 'her', eye: O_EYE, at: [CHAIR.x - 0.01, 0.99, CHAIR.z - 0.05], fp: 52, fd: 46 },
          { t: T.end, name: 'her', eye: O_EYE, at: [CHAIR.x - 0.01, 0.99, CHAIR.z - 0.05], fp: 47, fd: 43 }
        ]);
      },
      /* play begins in the history (historyBegin stages everyone again): her gate shut behind them, the beds play's */
      end() { fLens(PLAY_FOV); filmBed.on = false; for (const g of (things.w4gate || []).slice(0, 1)) g.visible = true; if (kit && kit.vision) kit.vision(null); }
    };
    filmsApi.open = FILMS.open;
    /* ================================================================ PLAY (M6: the phases of the plan's §4.1 to §4.3)
       FIRST LIGHT (M5): the flat stands, walked, and nothing in it plays yet. The phase string is the save's receipt
       (v7.3); every later phase will be applied from it here. */
    let phase = null, booted = false;
    const wallClock = { t: 0 };
    let lastWall0 = 0, lastWall = 0, pausedAt = 0;
    /* THE CHAPTER'S CLOCK (chapter 3's dayClock): it runs in play only, on wall time, so a panel stands it still while a
       voice plays on; the line queue and every timer of the play run on it (chapter 3's, copied) */
    const dayClock = { t: 0 };
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
    /* a line said by someone: he talks from its own start and rests after it (v11.4) */
    function line(name, who, onStart) { queueLine(name, () => { if (who) talk(who, SECS[name] || 2.5); if (onStart) onStart(); }); }
    /* a sound of the place, if its file is in the build (M7 makes them; until one lands its cue is simply silent) */
    function fx(name, vol = 1, pan = 0) { if (worldSfx && !(soundOff && soundOff())) worldSfx(name, vol, 1, pan); }
    /* the things he can press (c_story.js: the five sources, her, his teacher, the three presences, the water) */
    const hotspots = STORY_SPOTS;

    /* the decision's anchor (the engine's pile): her chair. The decision is opened by the trance's film at the turning
       point (M7), never by walking up to her; until then the pile is never live */
    const INTERACT_R = 2.6;
    const PILE_POS = new THREE.Vector3(CHAIR.x, 0, CHAIR.z);
    const pile = new THREE.Group(); world.add(pile);
    const _ndc = new THREE.Vector3();
    const pileLive = () => decOpen && phase === 'kept';
    function pileDist() { return Math.hypot(yaw.position.x - PILE_POS.x, yaw.position.z - PILE_POS.z); }
    function pileScreen() { camera.updateMatrixWorld(); return _ndc.set(PILE_POS.x, PILE_POS.y + 1.0, PILE_POS.z).project(camera); }
    function pileInView() { if (!pileLive()) return false; const n = pileScreen(); return n.z < 1 && Math.abs(n.x) < 1.1 && Math.abs(n.y) < 1.1; }
    function pointerHitsPile() { return pileLive() && pileDist() < INTERACT_R; }
    function interactPile() { if (!pileLive()) return false; startDecision(); return true; }

    /* THE FRAME: the people's clocks, their levels from the lens, the two-level things' levels */
    function updateNotes(dt, t) {
      const st = getState();
      const now = wallNow(), raw = lastWall0 ? Math.max(0, now - lastWall0) : 0, wdt = Math.min(0.25, raw); lastWall0 = now;
      wallClock.t += wdt;
      peopleTick(wdt, st !== 'cine');
      if (st !== 'cine') { crownTick(wdt); oppRidePlay(); peopleLevels(); lodTick(); }
      decideLook(now, st);
      /* the room's own motion runs under a film too (the fan, the lamp's flames, the photograph's glass) */
      fanTick(wdt); lampTick(wdt, wallClock.t); fogTick(wdt);
      mixBeds(wdt, st);
      const liveSt = st === 'play';
      if (!liveSt) { if (!pausedAt) pausedAt = now; lastWall = 0; return; }
      /* a voice plays on under a panel while the chapter's clock stands still: its booking comes forward by the time the
         panel was up, as far as the voice's own end (e3c3's v21.21 law) */
      if (pausedAt) { const away = Math.max(0, now - pausedAt); pausedAt = 0;
        if (speak.voiceTo > dayClock.t) { const cut = Math.min(away, speak.voiceTo - dayClock.t); speak.until -= cut; speak.voiceTo -= cut; } }
      if (lastWall) dayClock.t += Math.min(0.5, now - lastWall);
      lastWall = now;
      if (!booted) { booted = true; applyPhase(kit ? kit.getPhase() : null); }
      runTodo(); runSpeak(); runQueue();
      storyTick(wdt, wallClock.t); ambTick();
    }
    function updatePile() {}
    function updateFire() {}
    function updateSlow() {}

    function snap() { return { phase, story: storySnap() }; }
    function restore() {}
    function reset() { phase = null; booted = false; dropTodo(); speakReset(); lineQ.length = 0; heard.clear(); dayClock.t = 0; lastWall = 0; pausedAt = 0; storyReset(); }

    /* what he cannot walk through: every solid of the shell and the furniture, a column from the floor (v5.03) */
    function blockers() {
      const out = [];
      const solid = (o, pad = 0.14) => { o.updateWorldMatrix(true, false); const bb = new THREE.Box3().setFromObject(o); bb.expandByScalar(pad); bb.min.y = 0; bb.max.y = Math.max(bb.max.y, 1.40); out.push(bb); };
      for (const s of solids) solid(s);
      for (const k in castBlock) out.push(castBlock[k]);            // (moved in place by castSolid: never replaced)
      return out;
    }

    function dispose() {
      alive = false;
      const geos = new Set(), ms = new Set(), skels = new Set();
      world.traverse(o => {
        if (o.isSkinnedMesh && o.skeleton) skels.add(o.skeleton);
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

    onePassCheck();
    /* the ground he is kept on (stage.keepIn): the living room and the nook, her room, the passage, the dining room and
       the kitchen. The bedrooms and the baths are behind shut doors; the corridor is the opening film's */
    const KEEP_BOXES = [
      { minX: ROOMS.living.x0, maxX: ROOMS.living.x1, minZ: FL.face, maxZ: ROOMS.living.z1 },
      { minX: ROOMS.nook.x0, maxX: ROOMS.nook.x1, minZ: ROOMS.nook.z0, maxZ: ROOMS.nook.z1 },
      { minX: ROOMS.hers.x0, maxX: ROOMS.hers.x1, minZ: FL.face, maxZ: ROOMS.passage.z1 },
      { minX: ROOMS.dining.x0, maxX: ROOMS.dining.x1, minZ: ROOMS.dining.z0, maxZ: ROOMS.dining.z1 }];
    const KEEP = { what: 'her flat', boxes: KEEP_BOXES,
      minX: Math.min(...KEEP_BOXES.map(q => q.minX)), maxX: Math.max(...KEEP_BOXES.map(q => q.maxX)),
      minZ: Math.min(...KEEP_BOXES.map(q => q.minZ)), maxZ: Math.max(...KEEP_BOXES.map(q => q.maxZ)) };
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
      arrivals: [],
      keepIn: KEEP,
      groundAt: flatGround,
      get phase() { return phase; },
      setPhase, applyPhase,
      presets: PRESETS,
      plan: { FL, ROOMS, CORR, ALTAR, CHAIR, STOOL, BOWL },
      info: () => ({ phase, t: +dayClock.t.toFixed(2), queued: lineQ.length, heard: [...heard], until: +speak.until.toFixed(2),
                     pending: speak.pending ? speak.pending.name : null, applied: booted, waiting: [...waiting].sort(), mends: twinMends }),
      sayLine, queueLine, queueFn, queueGap, dayClock, after,
      who: () => people.filter(P => !P.driver).map(P => ({ key: P.key, ready: P.ready, take: P.cur })),
      /* (a probe's handle on one person: tools/probes/bonesat.mjs reads its bones where the world draws them) */
      person: (key, i) => people.filter(P => P.key === key)[i || 0] || null,
      /* (tools/probes/headturn.mjs reads a talking head through these) */
      /* (tools/probes/e4c4drive.mjs reads the play's own state and the spirits through these: the fight's shapes, what is
         learned and looked at) */
      dbg: { cast, headDampLay, play, spirits },
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
      /* the fiftieth and fifty-first seams: his sight opened or shut; what the water may reach, what it reached, and
         where the bowl is filled again */
      onVision, shootables, onShot, reloadRefusal,
      films: filmsApi,                                                          // the films' pictures (c_ufilm.js), for the scenes
      stepSound: stepNext,                                                      // his bare feet on her tiles (c_tsound.js)
      amb: () => ({ n: ambN, last: ambLast, next: +ambAt.toFixed(2), beds: Object.assign({}, bedMix) }),
      updateNotes, updatePile, updateFire, updateSlow,
      snap, restore, reset, dispose
    });
  }
  /* ====================================================== THIS CHAPTER'S DRAWN SURFACES' HELPERS (chapter 3's own) */
  function rng(seed) { let s = seed >>> 0 || 1; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
  function done(THREE, c, rep) {
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
    if (rep) { t.wrapS = t.wrapT = THREE.RepeatWrapping; }
    return t;
  }
  function noMip(THREE, t) { t.generateMipmaps = false; t.minFilter = THREE.LinearFilter; t.needsUpdate = true; return t; }

  /* THE FILMS' CLOCKS (c_ufilm.js draws to them): the trance's, each ending's, and the close's, every one from its start */
  const TR = { ml1: 2.6, ml2: 5.7, open: 7.6, claw: 7.6, cry: 10.6, rush: 12.7, rv: 13.05, back: 15.2, end: 17.6 };
  /* the loss's (her life run out: c_ufilm.js FILMS.lost): her cry, his teacher's hand lifted, Mala's gasp, Ravi's word, her
     eyes to him, his sight shut, black */
  const LO = { cry: 0.35, lift: 1.4, gasp: 2.2, rv: 3.0, turn: 3.1, shut: 5.0, black: 6.1, end: 7.0 };
  /* the close's own clock, from its start: Pho's dedication; the green shapes go; she rises (if she has not), walks;
     the ash; her palms; his sight closing; her family before her altar (fam); Pho's word; black */
  const CL = { z0: 0.6, go: 2.0, steps: 11.6, slow: 12.0, ash: 15.0, palms: 17.2, thank: 17.3, bell: 18.7, shut: 20.2, fam: 21.3, z1: 23.0, black: 30.4, end: 32.6 };
  /* each ending's clock: its lines and beats, and where its close begins */
  const EN = {
    A: { grab: 0.0, rv: 0.3, cry: 0.9, scream: 2.95, torn: 6.1, white: 6.3, open: 7.6, rise: 9.0, call: 12.6, still: 13.2, go: 14.4, rv2: 14.7, ph: 17.4, q: 24.56, close: 28.56 },
    B: { throw: 0.15, splash: 0.55, comes: 0.9, white: 2.3, floor: 2.55, go: 3.3, push: 3.3, falter: 3.5, ml2: 4.0, back: 5.6, cry: 6.2, torn: 9.6, white2: 9.8, open: 11.4, rise: 12.0, ok: 16.0, ph: 17.6, q: 27.32, close: 31.12 },
    C: { step: 0.0, say: 0.7, kneel: 5.4, mala: 6.4, rv: 7.3, cry: 8.6, torn: 12.2, white: 12.4, open: 13.8, look: 14.6, my: 14.9, rise: 15.4, ph: 21.0, q: 26.8, close: 30.9 },
    D: { shut: 0.2, reach: 1.0, ph0: 1.9, kneel: 4.6, rv: 4.7, cry: 7.8, torn: 11.2, white: 11.4, open: 12.8, rise: 13.6, ml: 14.8, ph: 19.4, q: 31.24, close: 35.84 }
  };

  /* THE OPENING FILM's clock (c_ufilm.js FILMS.open draws to it) */
  const OP = { q1: 0.8, est: 2.6, q2: 8.4, turn: 13.6, walk: 14.6, at: 20.2, latch: 20.6, cut1: 21.3, rv: 22.2, cut2: 25.0, inside: 27.4, drop: 28.6, look: 29.0, flick: 31.6, flickEnd: 32.9, black: 33.4, end: 34.6 };
  /* THE OPENING FILM (the plan's §4.0): its pictures are the stage's; here its clock's one track, its fades and its cues.
     It begins on black (v4.6) and ends on black, the title over it */
  function intro(c, s, api) {
    const { tr, step, fade, sfx, sfxFade, rawK, stage } = api, F = stage.films.open, T = OP;
    step(0, () => F.begin(api));
    tr(0, T.end, (k, t) => F.frame(t), rawK);
    sfx(0.3, 'u4openmus', 0.55);                        // the opening's own music, from the black
    sfx(T.q1, 'q4o1', 1);                               // "Training began the next morning. Open. Close. Every day, for months."
    fade(T.est, T.est + 1.4, 1, 0);
    sfx(T.q2, 'q4o2', 1);                               // "When Grandmaster Pho came to Singapore, a family asked him to see their mother."
    sfx(T.turn + 0.1, 'u4os1', 0.45);                   // a lift's chime, far down the corridor
    sfx(T.walk + 0.2, 'u4sandals', 0.6);                // his own steps along it
    sfx(T.latch, 'u4gate', 0.7);                        // Ravi at the grille: the latch
    fade(T.cut1, T.cut1 + 0.25, 0, 1); fade(T.cut1 + 0.35, T.cut1 + 0.65, 1, 0);
    sfx(T.rv, 'rv4o1', 1);                              // "Grandmaster. Thank you for coming. Please, come in."
    fade(T.cut2 - 0.25, T.cut2, 0, 1); fade(T.cut2 + 0.1, T.cut2 + 0.45, 1, 0);
    sfx(T.cut2 + 0.6, 'u4tile', 0.45); sfx(T.cut2 + 1.25, 'u4tile2', 0.45); sfx(T.cut2 + 1.9, 'u4tile', 0.45); sfx(T.cut2 + 2.6, 'u4tile2', 0.4);   // his bare feet on her tiles
    sfx(T.drop + 0.4, 'u4heart', 0.7); sfx(T.drop + 1.2, 'u4heart', 0.8);         // the room's sound drops; his heart, twice
    sfx(T.flick, 'u4vison', 0.45); sfx(T.flickEnd - 0.5, 'u4visoff', 0.45);       // his sight, open for a held breath by itself
    fade(T.black, T.black + 0.6, 0, 1);
    sfxFade(T.black - 0.6, T.end - 0.05, 'u4openmus');
    step(T.end, () => F.end());
    c.keepFade = true; c.endFade = 1;
  }

  /* THE TRANCE (the plan's §4.4), a film from play at the turning point; the decision opens where it ends (c_story.js
     trance()). Its pictures are the stage's (c_ufilm.js FILMS.trance); here are its clock's one track and its cues */
  function filmTrance(c, s, api) {
    const { tr, step, fade, sfx, sfxFade, rawK, stage } = api, F = stage.films, T = TR;
    step(0, () => F.trance.begin(api));
    tr(0, T.end, (k, t) => F.trance.frame(t), rawK);
    fade(0, 0.7, 1, 0);
    sfx(0.2, 'u4trancemus', 0.6);                       // her goddess's drums and her bell: hers and her people's, never the spirit's
    sfx(T.ml1, 'ml4t1', 1);                             // "Amma?"
    sfx(T.ml2, 'ml4t2', 1);                             // "It's Amman."
    sfx(T.open, 'u4vison', 0.85);                       // his sight forced open: the wave out from him
    sfx(T.open + 0.35, 'u4heart', 0.7); sfx(T.open + 0.95, 'u4heart', 0.75); sfx(T.open + 1.5, 'u4heart', 0.8);
    sfx(T.cry, 'u4cry', 0.8);                           // the thing on her back cries out, and holds on
    sfx(T.rush + 0.15, 'u4tile', 0.5); sfx(T.rush + 0.6, 'u4tile2', 0.55); sfx(T.rush + 1.05, 'u4tile', 0.6);   // Ravi's bare feet
    sfx(T.rv, 'rv4t1', 1);                              // "Stop it! You're hurting her!"
    sfxFade(T.end - 1.5, T.end - 0.05, 'u4trancemus');
    step(T.end, () => F.trance.end());
  }

  /* HER LIFE RUNS OUT (Chad, 18 Nov): the film the loss plays before its card (c_story.js ammaLost, kit.lose). Its pictures
     are the stage's (c_ufilm.js FILMS.lost); here its clock's one track, its fades and its cues. It ends on its black (the
     card lies over it) */
  function filmLost(c, s, api) {
    const { tr, step, fade, sfx, sfxFade, rawK, stage } = api, F = stage.films, T = LO;
    step(0, () => F.lost.begin(api));
    tr(0, T.end, (k, t) => F.lost.frame(t), rawK);
    fade(0, 0.5, 1, 0);
    sfx(0.05, 'u4vison', 0.8);                          // his sight forced open: the wave out from him
    sfx(0.25, 'u4sting', 0.8);                          // the low sting under what he sees
    sfx(T.cry, 'u4ascream2', 1);                        // her last cry
    sfx(T.gasp, 'u4gaspf', 0.75);                       // Mala at the lamp
    sfx(T.rv, 'rv4A2', 1);                              // Ravi: "Amma..."
    sfx(T.rv + 0.95, 'u4heart', 0.75); sfx(T.rv + 1.55, 'u4heart', 0.7);   // his own heart, under her eyes on him
    sfx(T.shut, 'u4visoff', 0.85);                      // his sight shut: the wave home to him
    sfx(T.shut + 0.6, 'u4whisper', 0.45);               // and in the dark, theirs
    fade(T.black, T.end - 0.1, 0, 1);
    sfxFade(T.black, T.end - 0.05, 'u4whisper');
    c.keepFade = true; c.endFade = 1;
    step(T.end, () => F.lost.end());
  }

  /* THE FOUR ENDINGS (the plan's §4.5), each a whole story, each with THE CLOSE: their pictures are the stage's
     (c_ufilm.js FILMS.ending, ENDS and closeFrame); here are each one's clock's track, its fades and its cues. Each ends
     on its black (the card lies over it) */
  function endingScene(c, s, api, k, cues) {
    const { tr, step, fade, sfx, sfxFade, rawK, stage } = api, F = stage.films, E = EN[k], C = CL, t0 = E.close, total = t0 + C.end;
    step(0, () => F.begin(k, c, api));
    tr(0, total, (kk, t) => F.frame(k, t, api), rawK);
    cues(E, { sfx, sfxFade, fade });
    /* THE CLOSE: the merit dedicated; the green shapes go; her first steps; the bell at her altar; his sight closing;
       his teacher's word to the family; black */
    sfx(t0 - 1.6, 'u4closemus', 0.5);
    sfx(t0 + C.z0, 'ph4z0', 1);                         // "May all beings, without limit, without end, have a share in the merit just now made..."
    sfx(t0 + C.go, 'u4release', 0.45); sfx(t0 + C.go + 1.5, 'u4release', 0.35);
    sfx(t0 + C.steps + 0.1, 'u4steps', 0.75);           // her first steps, to her altar
    sfx(t0 + C.slow, 'ml4z1', 1);                       // her daughter beside her: "Slowly, Amma. Slowly."
    sfx(t0 + C.thank, 'am4z1', 1);                      // her palms joined at her lamp: "Thank you, Mother."
    sfx(t0 + C.bell, 'u4bell', 0.55);                   // at her altar
    if (k !== 'D') sfx(t0 + C.shut, 'u4visoff', 0.8);  // his sight closing: the wave home to him
    sfx(t0 + C.z1, 'ph4z1', 1);                         // "Keep seeing her doctors. What happened tonight is what happened tonight. It is not a promise."
    fade(t0 + C.black, t0 + C.end - 0.2, 0, 1);
    sfxFade(t0 + C.black - 0.5, t0 + C.end - 0.05, 'u4closemus');
    step(total, () => F.end());
    c.endFade = 1; c.keepFade = true;
  }
  const flash = (a, t, d = 1.2, top = 1) => { a.fade(t, t + 0.18, 0, top, '#ffffff'); a.fade(t + 0.18, t + 0.18 + d, top, 0, '#ffffff'); };
  /* A · GRAB HIM AND HOLD HIM BACK (worst) */
  function scHold(c, s, api) { endingScene(c, s, api, 'A', (E, a) => {
    a.sfx(0.05, 'u4scuffle', 0.85);                     // his arms round him; Ravi fighting toward his mother
    a.sfx(E.rv, 'rv4A1', 1);                            // "Let go of me! Amma! Amma!"
    a.sfx(E.cry, 'u4cry', 0.85);                        // the cry peaks
    a.sfx(E.scream, 'ml4A1', 1);                        // Mala, at them both: "Stop it! Both of you, stop!"
    a.sfx(E.torn - 0.1, 'u4torn', 0.85);                // torn from her
    flash(a, E.white); a.sfxFade(E.white, E.white + 1.2, 'u4cry');
    a.sfx(E.open - 0.4, 'u4endA', 0.5);
    a.sfx(E.rise + 0.2, 'u4stand', 0.75);               // she stands, and her son is not beside her
    a.sfx(E.call, 'am4A1', 1);                          // she looks back for him: "Ravi?"
    a.sfx(E.rv2, 'rv4A2', 1);                           // let go, he goes to her: "Amma..."
    a.sfx(E.ph, 'ph4A1', 1);                            // "You protected the blessing. You forgot her son. His fear was only love."
    a.sfx(E.q, 'q4A1', 1);                              // "I saw a man in the way. He was her son."
    a.sfxFade(E.close - 2.0, E.close + 0.5, 'u4endA');
  }); }
  /* B · THROW THE HOLY WATER AT THE SPIRIT ON HER BACK (bad) */
  function scThrow(c, s, api) { endingScene(c, s, api, 'B', (E, a) => {
    a.sfx(E.throw, 'u4flick', 1); a.sfx(E.splash, 'u4patter', 1); a.sfx(E.splash + 0.08, 'u4dip', 0.6);   // the whole bowl
    a.sfx(E.splash, 'ml4B1', 1);                        // Mala, the water on her mother: "What are you doing?"
    a.sfx(E.comes, 'u4chill', 0.95);                    // it lets go of her and comes at him
    a.sfx(E.comes + 0.35, 'u4heart', 0.9); a.sfx(E.comes + 0.95, 'u4heart', 0.7);   // his heart, and then it stalls
    flash(a, E.white, 1.4); a.sfx(E.floor + 0.15, 'u4fall', 0.85);               // white; he is on the floor
    a.sfx(E.go, 'ph4B0', 1);                            // "Go."
    a.sfx(E.ml2, 'ml4B2', 1);                           // his hand off her head, her trance falters: "Amma!"
    a.sfx(E.cry, 'u4cry', 0.85);                        // the cry rises again
    a.sfx(E.torn - 0.1, 'u4torn', 0.85);
    flash(a, E.white2); a.sfxFade(E.white2, E.white2 + 1.1, 'u4cry');
    a.sfx(E.open - 0.6, 'u4endB', 0.5);
    a.sfx(E.rise + 0.2, 'u4stand', 0.75);
    a.sfx(E.ok, 'ml4B3', 1);                            // Mala, down to him on the floor: "Are you alright?"
    a.sfx(E.ph, 'ph4B1', 1);                            // "Your part was the holy water, and keeping the spirits away from her. The work was mine..."
    a.sfx(E.q, 'q4B1', 1);                              // "I saw it, and thought it was mine to fight."
    a.sfxFade(E.close - 2.0, E.close + 0.5, 'u4endB');
  }); }
  /* C · GO TO HIM: TELL HIM SHE IS SAFE, AND STAY WITH HIM (best) */
  function scGo(c, s, api) { endingScene(c, s, api, 'C', (E, a) => {
    a.sfx(0.05, 'u4tile', 0.6);                         // he steps between them
    a.sfx(E.say, 'q4C0', 1);                            // "She's not being hurt. It's leaving her. Stay with her. Hold her hand."
    a.sfx(E.kneel + 0.5, 'u4tile2', 0.5);               // Ravi kneels by her
    a.sfx(E.rv, 'rv4C1', 1);                            // her hand in his: "I'm here, Amma. I'm right here."
    a.sfx(E.cry, 'u4cry', 0.85);
    a.sfx(E.torn - 0.1, 'u4torn', 0.85);
    flash(a, E.white); a.sfxFade(E.white, E.white + 1.2, 'u4cry');
    a.sfx(E.open - 0.8, 'u4endC', 0.5);
    a.sfx(E.my, 'am4C1', 1);                            // her eyes open on her son: "My boy."
    a.sfx(E.rise + 0.2, 'u4stand', 0.75);               // she stands, holding his hand
    a.sfx(E.ph, 'ph4C1', 1);                            // "You saw what was there, and you told him only what you knew. Nothing more."
    a.sfx(E.q, 'q4C1', 1);                              // "I didn't promise him anything. I told him what I saw."
    a.sfxFade(E.close - 2.0, E.close + 0.5, 'u4endC');
  }); }
  /* D · KEEP YOUR PLACE: HOLD THE HOLY WATER, CLOSE YOUR SPIRIT VISION, TRUST YOUR TEACHER (good) */
  function scKeep(c, s, api) { endingScene(c, s, api, 'D', (E, a) => {
    a.sfx(E.shut, 'u4visoff', 0.85);                    // his sight shut: the wave home to him
    a.sfx(E.ph0, 'ph4D0', 1);                           // "Ravi. Hold her hand."
    a.sfx(E.kneel + 0.5, 'u4tile2', 0.5);
    a.sfx(E.rv, 'rv4D1', 1);                            // he does: "Okay. Okay. I've got you, Amma."
    a.sfx(E.cry, 'u4cry', 0.55);                        // heard, not seen: his sight is shut
    a.sfx(E.torn - 0.1, 'u4torn', 0.65);
    flash(a, E.white, 1.2, 0.75); a.sfxFade(E.white, E.white + 1.2, 'u4cry');
    a.sfx(E.open - 0.8, 'u4endD', 0.5);
    a.sfx(E.rise + 0.2, 'u4stand', 0.75);
    a.sfx(E.ml, 'ml4D1', 1);                            // Mala, at the lamp: "Amma... you're standing."
    a.sfx(E.ph, 'ph4D1', 1);                            // "You kept your place. That is where it starts. But there were two people afraid in this room..."
    a.sfx(E.q, 'q4D1', 1);                              // "I kept to my part. Next time I'll see the people too."
    a.sfxFade(E.close - 2.0, E.close + 0.5, 'u4endD');
  }); }

  (window.__CHAPTERS__ = window.__CHAPTERS__ || {}).e4c4 = Object.assign(DATA, {
    build,
    intro,
    films: { trance: filmTrance, lost: filmLost },
    scenes: [scHold, scThrow, scGo, scKeep]
  });
})();
