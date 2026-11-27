/* Episode 5 · Chapter 1 · "The Love Spell That Followed Me Home"
   ---------------------------------------------------------------------------
   THE FIRST CHAPTER OF CASE FILE 5, "The Signal And The Translator": S1·16, case four. A man asks Grandmaster Pho to
   see his colleague, Grace, at her own home (Chad, R3: "it should be the lady's house"); she keeps going back to a man
   who treated her badly. Pho finds a love spell and breaks it while Master Zavier holds the holy water; she comes back
   to herself. At three that morning, at home, something crushes his head from every side, looking for whoever helped
   her. He calls his teacher, who sets a barrier round him over the phone. "I had thought I was only there to assist my
   teacher."

   THIS FILE IS GENERATED (masters/v29.0/assemble.py, from masters/v29.0/parts/*.js and the script,
   masters/v29.0/script/lines.json): edit the parts and the script and assemble again, never this file.
   docs/V29.0-E5C1-PLAN.md is the design (its 0 Chad's words, the contract; its 8 the play, its 9 every film shot by
   shot, its 10 every line, its 11 the sound); docs/V29.0-E5C1-BUILD.md is where the build stands (read it first).

   WHAT THIS FILE IS TODAY: THE SKELETON (the tracker's M1). The chapter's data and every word of it are in place; its
   places, its play and its films are stand-ins, each marked where it stands with the piece that builds it:
     TODO-WORLD   the places (b_world.js: plain shells of the street, her front room and his flat; the plan's 5)
     TODO-CAST    Grace and Marcus (c_cast.js: two of the game's own people wearing the roles until theirs land; M3)
     TODO-PLAY    a phase's play (c_play.js: one thing to press for each order; the plan's 8)
     TODO-FILM    a film or an ending (z_tail.js: a few seconds each, ending as a film must; the plan's 9)
     TODO-SOUND   a line's take and its measured length (lines.json; every length here is PROVISIONAL), the beds, the
                  music, the effects (the plan's 11)
   A line whose take has not landed is spoken silently on its provisional length and shown as a caption, so the
   skeleton can be walked and read from its first frame to its four endings.

   CHAD'S DIRECTION (26 and 27 Nov 2026, the plan's 0): it happens in Singapore; the full plan, every creative choice,
   every film shot by shot (R1); the sound, the music, the effects and their timing (R2); the evening in the lady's own
   home; build it all now, from a tracker of milestones and checkpoints (R3).

   FAIRNESS (the standing rule: no practice and no practitioner is ever the villain). The man who treated her badly is
   never seen or heard, only his messages lighting her phone; the master who made the spell is never seen and never
   named, and Pho will not say who he is; Grace is never blamed ("She is not weak"); Marcus is a good friend. GOLD is
   Grandmaster Pho's alone, and only the barrier glows gold.

   THE ENDING STOPS AT DAWN THE NEXT MORNING, the white thread on his wrist: nothing of what he will become. */

(() => {
  'use strict';

  let S = null;

  /* ---------------------------------------------------- the light (painted, never a lamp added on screen: v15.1)
     TODO-WORLD: the four looks of the plan's 4.3, each a first guess to be set from photographs when its place is built */
  const sky = (o) => Object.assign({ stars: 0, moon: 0, sun: 0, clouds: 0 }, o);
  /* THE SHOPHOUSE ROW AT BLUE HOUR (7:20 PM): the sky deep blue, her windows amber, the street lamps sodium-orange */
  const BLUE = sky({
    stops: [[0.00, '#3a4a78'], [0.12, '#2f3f6e'], [0.35, '#243464'], [0.65, '#1b2856'], [1.00, '#121c44']],
    bg: 0x1e2a52, fog: [0x26305a, 0.006],
    hemi: [0x7f90c8, 0x4a3a30, 0.6], key: [0xffb46a, 0.55, -2.0, 1.6, 1.5], fill: [0x6070b0, 0.22],
    stars: 0.05, moon: 0,
    vmHemi: [0x8090c8, 0x4a3a30, 0.6], vmKey: [0xffb878, 0.45] });
  /* HER FRONT ROOM IN LAMPLIGHT (7:30 to 8:30 PM): warm white from a standing lamp and a table lamp, the windows black */
  const LAMP = sky({
    stops: [[0.00, '#1c2240'], [0.20, '#161c38'], [0.50, '#111632'], [0.80, '#0c1028'], [1.00, '#090c22']],
    bg: 0x14182e, fog: [0x14182e, 0.004],
    hemi: [0xffe2bc, 0x5a4636, 0.78], key: [0xffd2a0, 0.85, 1.2, 2.4, -0.8], fill: [0x8a7a70, 0.24],
    stars: 0, moon: 0,
    vmHemi: [0xffe2bc, 0x5a4636, 0.75], vmKey: [0xffd2a0, 0.55] });
  /* HIS FLAT AT NIGHT (11:52 PM and three o'clock): no lights on, the city's glow through the glass, cold blue-grey */
  const NIGHT = sky({
    stops: [[0.00, '#2a3448'], [0.15, '#202a40'], [0.40, '#171f36'], [0.70, '#10172c'], [1.00, '#0a0f22']],
    bg: 0x111829, fog: [0x111829, 0.005],
    hemi: [0x8a9ab8, 0x2a2a30, 0.42], key: [0xa8b8d8, 0.4, -1.5, 2.0, 2.0], fill: [0x5868a0, 0.2],
    stars: 0.1, moon: 0,
    vmHemi: [0x8a9ab8, 0x2a2a30, 0.45], vmKey: [0xa8b8d8, 0.35] });
  /* HIS FLAT AT DAWN (7:10 AM): low gold sun through the glass, long warm light across the floor */
  const DAWN = sky({
    stops: [[0.00, '#ffd9a0'], [0.12, '#f4c89a'], [0.35, '#c8c4d0'], [0.65, '#9cb4d8'], [1.00, '#7aa0d0']],
    bg: 0xd8c8b0, fog: [0xd8c8b8, 0.003],
    hemi: [0xfff0d8, 0x9a8670, 0.95], key: [0xffc888, 1.1, -3.0, 1.2, 1.0], fill: [0xa0b0d0, 0.25],
    stars: 0, moon: 0,
    vmHemi: [0xfff0d8, 0x9a8670, 0.9], vmKey: [0xffc888, 0.6] });
  const PRESETS = { BLUE, LAMP, NIGHT, DAWN };

//@@LINES

  /* A FILM'S TIMES are built from SECS (chapter 3's tl, as chapters 4 and 5 have it): a list of ['line', gap], [secs] (a
     pause) and ['@mark'] (a named moment); the answer maps every line and mark to its start on the film's own clock, and
     `end` to where the list ends, so the cues and the pictures read the same numbers, and a measured take moves
     everything after it (v5.15). TODO-FILM: every film of this chapter is timed this way from SAID and SECS. */
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
    id: 1,
    episode: 5,
    /* (the casebook's own title: v23.3) */
    title: 'The Love Spell That Followed Me Home',
    cardLabel: 'Chapter 1',
    cardTitle: 'The Love Spell That Followed Me Home',
    /* (DRAFT, mine: the case file's first sentences as a brief, at her home as Chad's R3 has it. The plan writes none) */
    brief: 'A man asked you and Grandmaster Pho to come and see his colleague at her home. He said she was not herself.',
    /* the prompt is the turning point's own question (the plan's 9.6), his phone in his hand at 3:03 */
    prompt: 'It’s three in the morning. Something is crushing your head. What do you do?',
    /* THE DECISION (the plan's 9.6: its default ranks A best, B good, C bad, D worst; not timed). Four KINDS of answer and
       four roads to the same place: he asks at once (A, the case file's own act), humility misread (B), dismissal before
       looking (C), curiosity dressed as courage (D). In all four he calls his teacher, the barrier is set, and at dawn he
       is still the student; none leaves the path. Checked against every earlier decision in the plan's 9.6.
       THE DELTAS are the episode before's own for each rank (episode 4: best 6/6/18, good 3/6/9, bad -6/3/-9, worst
       -3/0/-18): a default, the plan gives ranks and no numbers.
       EACH `say` is the plan's own line under the card (its 9.10; held to the script's zv51A to zv51D by the assembler).
       EACH `teach` (the case file's own sentence first, then what you did) is a DRAFT, mine: the plan writes none. */
    choices: [
      { k: 'A', text: 'Call Grandmaster Pho now.',
        d: { sanity: 6, awareness: 6, wisdom: 18 }, verdict: 'best',
        say: 'I called. He was already awake.',
        teach: 'Guidance, protection and knowing your own limits all matter, and they matter most where other practitioners are involved. You knew at once that this was more than you, and you asked.' },
      { k: 'B', text: 'Don’t wake him. It’s three in the morning.',
        d: { sanity: 3, awareness: 6, wisdom: 9 }, verdict: 'good',
        say: 'I waited. It cost me an hour.',
        teach: 'Helping someone does not automatically place you outside the situation. You protected your teacher’s sleep at your own cost, as if being a helper meant never needing help, and the night was longer for it.' },
      { k: 'C', text: 'It’s only a migraine. Take a pill and sleep.',
        d: { sanity: -6, awareness: 3, wisdom: -9 }, verdict: 'bad',
        say: 'I called it a headache. It wasn’t.',
        teach: 'Sometimes the person helping becomes part of the case. You named it a headache before you looked, and it went on pressing while you lay there.' },
      { k: 'D', text: 'Open Spirit Vision and find who’s doing this.',
        d: { sanity: -3, awareness: 0, wisdom: -18 }, verdict: 'worst', critical: true,
        say: 'I went looking. It found me first.',
        teach: 'When you involve yourself in another person’s spiritual problem, you may also be involving yourself in whatever conflict surrounds it. You went toward the thing that was looking for you, and it found you.' }
    ],
    /* THE LESSON CARD (the plan's 9.11, its default until Chad picks: v11.9): the case file's own sentences, 1 as the
       card's line and 4 under it, so the card carries the case's ordinary danger too. No Pali term (v11.10). */
    core: 'Wanting to help is not the same as being prepared to.<br><i>Whoever they are, they need people around them who will listen and help them stay safe.</i>',

    /* THE WORLD (masters/v29.0/parts/b_world.js; the plan's 5): units metres, y up. TODO-WORLD: three places of the
       skeleton, each a plain shell, each a pocket world past the lens's far plane (160 m) from the others (v8.9): her
       front room at the origin (he kneels at his place by her windows, a turn of 0 looking toward -z, across the low
       table at Grace on the sofa), the shophouse row and the stair 200 m along -x (the opening film's), and his flat
       200 m along +x (home, three o'clock, the barrier and the dawn). The decision's anchor is his dining table, where
       his phone is. The bounds hold all three (what he walks is held by walls: stage.keepIn names it). */
    spawn:     { x: 0.9, y: 0.95, z: 1.2, rot: 0 },
    shrine:    { x: 200.0, z: -1.6 },             // the engine's anchor (ghost: null): his dining table and his phone, the chapter's pile
    ghostHome: { x: 200.0, z: -1.6 },
    bounds:    { minX: -212.0, maxX: 212.0, minZ: -14.0, maxZ: 14.0 },

    ghost: null,
    fireLight: null,
    daylight: LAMP,
    render: { freePictures: true },
    /* SPIRIT VISION (chapter 4's fiftieth seam, as episode 4 chapters 4 and 5 tuned it): open in the room (the red line
       from Grace to the door), held open by the breaking and the barrier, forced open at the bedroom door at three
       o'clock (the plan's 8). TODO-SOUND: its own sounds (u51...), never another chapter's: a sound of another chapter
       named here would leave that chapter's pack. Until they land it is silent. */
    vision: { outSecs: 2.2, inSecs: 1.6, band: 0.27, line: 0.24,
              front: 0x3a96ff, glow: 0.32, burn: 3.2, laid: 0.55, linger: 0.7, detail: 1 },
    /* (in the run from its first build: Chad's rule of v27.0, every build a full release; never a preview chapter) */

    assets: [
      /* >>> this chapter's own keys: written by masters/v29.0/keys.py (edit its table, not this list) >>> */
      'p51grace', 'p51graceh', 'p51marcus', 'p51marcush', 'w51keepsake', 'w51bag', 'w51bottle', 'w51threadreel',
      /* <<< this chapter's own keys <<< */
      /* the shared cast's stand-ins and reuse (masters/v29.0/parts/c_cast.js), each declared in `reuseInEpisode`:
         Grandmaster Pho as episode 4 chapter 5 casts him seated (his own file, look D), the white cloth over his crossed
         legs; and until Grace and Marcus land (M3), the two of the game's people who wear their roles. (Standing, at
         dawn, he is chapter 5's copy with finger bones, p5pho: the FILMS piece adds it with his standing body) */
      'pho', 'w3pholap', 'p4mala', 'p4malah', 'p5collector'
    ],
    /* FRESH (chaptertest): what this chapter takes from episodes 1 to 3, declared (Chad, v17.4): nothing */
    reuse: {},
    /* what it takes from episode 4, declared all the same (v17.4: any reuse is declared), and what wears a role until
       its own model lands */
    reuseInEpisode: {
      pho: "Grandmaster Pho, Chad's own model, as episode 4 chapters 3 to 5 cast him (his look D): seated on his cushion at Grace's low table",
      w3pholap: "the white cloth over Grandmaster Pho's crossed legs, episode 4 chapter 3's hall: his seat at her table" },
    placeholders: {
      p4mala: "STAND-IN for Grace until her own body lands (M3): Mala, Amma's daughter, met only in episode 4 chapter 4 (her mother's flat)",
      p4malah: "Mala's full body, for within 2.2 m (v26.5), with the stand-in",
      p5collector: "STAND-IN for Marcus until his own body lands (M3): the collector, met only in episode 4 chapter 5's last case (the receiving room)" },
    items: [],

    musicVol: 0,
    /* THE BEDS (the plan's 11.3): TODO-SOUND, each a loop at 0 here, set by the play's mixer by place and beat once SOUND
       has made them (u51...). None is declared until its file exists: a bed named before then plays nothing. */
    ambience: { beds: [] },
    voiceLine: null,

    words: {
      approach: '',
      act: 'E to act',
      actTouch: 'Tap to act',
      interact: 'E to answer',
      interactTouch: 'Tap to answer',
      actLine: 'Press E to answer',
      actLineTouch: 'Tap to answer',
      /* EVERY WORD THE PLAYER READS IS PLAIN, DIRECT, EVERYDAY ENGLISH (Chad, R112 of episode 4 chapter 5). The orders are
         the plan's own (its 8), word for word; the marks' words are mine (each names the thing by what the player sees) */
      // THE ROOM (the plan's 8.1)
      objPour: 'Pour water into the bowl.',
      objLight: 'Light the candle.',
      objWatch: 'Watch Grace. Find what is pulling her.',
      objVision: 'Open Spirit Vision and look at Grace.',
      hotJug: 'Pour the water',
      hotLighter: 'Light the candle',
      hotPhone: 'Her phone',
      hotGlass: 'Her reflection',
      hotHands: 'Her hands',
      hotPacket: 'The packet in her bag',
      // THE BREAKING (the plan's 8.2): the event's brief, START first (v8.7); the input named for the device (v18.5)
      evStillTitle: 'Keep the water still.',
      evStillTouch: 'Hold the bowl steady. Drag to keep the light inside the ring.',
      evStillKey: 'Hold the bowl steady. Move the mouse to keep the light inside the ring.',
      // THREE O'CLOCK (the plan's 8.3)
      objGetUp: 'Something is pressing on your head. Get up.',
      objPhone: 'Get to your phone.',
      tipPress: 'It presses hardest when you move or have Spirit Vision open. Stand still and it eases.',
      hotGetUp: 'Get up',
      hotPhoneHis: 'Pick up your phone',
      // THE BARRIER (the plan's 9.7): CLOSE THE CIRCLE, the event inside the film
      evCircleTitle: 'Close the circle.',
      evCircleTouch: 'Lay the thread all the way round you. Circle your finger round the screen.',
      evCircleKey: 'Lay the thread all the way round you. Circle the mouse round the screen.',
      // THE SKELETON'S STAND-INS (TODO-PLAY): what is pressed until its play is built. Mine, not the plan's: each goes
      // when the play it stands for is built
      hotStill: 'Hold the bowl'
    },
    sayPrefix: 'zv51'
  };
