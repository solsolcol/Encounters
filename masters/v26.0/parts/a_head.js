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
  /* (the night's key is the candles' own light: warm, low, from before the tables, so what stands on them is lit on
     the faces he sees; the fog is thick and black, so the light dies a few metres behind them and the hall is dark) */
  const NIGHT = sky({                 // the night between: the offering tables by their own candles; black and gold
    stops: [[0.00, '#15121a'], [0.12, '#100f17'], [0.35, '#0b0b13'], [0.65, '#07080e'], [1.00, '#04050a']],
    bg: 0x06070b, fog: [0x08070a, 0.05],
    hemi: [0x343650, 0x1a120a, 0.13], key: [0xffa850, 0.62, 1.5, 1.7, 10], fill: [0x3c4468, 0.05],
    stars: 0.9, moon: 0.3,
    vmHemi: [0x3a3c58, 0x1a130c, 0.4], vmKey: [0xffb868, 0.4] });
  /* THE RENTED ROOM (the film between the days): the window from inside. The key comes in through it (from the north,
     low); the engine's fill stands south and above, which in that room is the lamp behind him */
  const ROOM0 = sky({                 // the last of the night: the window dark blue, stars
    stops: [[0.00, '#1c2233'], [0.10, '#181d2e'], [0.30, '#111627'], [0.60, '#0b0f1c'], [1.00, '#070a14']],
    bg: 0x0c0f1a, fog: [0x0c0f1a, 0.004],
    hemi: [0x4a4a66, 0x2a1c10, 0.42], key: [0x8aa2d4, 0.55, 0, 3.4, -10], fill: [0xffb878, 0.26],
    stars: 0.85, moon: 0,
    vmHemi: [0x3a3c58, 0x1a130c, 0.4], vmKey: [0xffb868, 0.4] });
  const ROOM1 = sky({                 // the same window at first light
    stops: [[0.00, '#f8c88e'], [0.16, '#f2ba8c'], [0.36, '#b8aebe'], [0.62, '#7088b4'], [1.00, '#405488']],
    bg: 0x9a94a0, fog: [0xa29a9c, 0.004],
    hemi: [0x9a98b0, 0x3a2a1c, 0.66], key: [0xffc68c, 1.2, 0, 2.2, -10], fill: [0xffc088, 0.2],
    stars: 0.06, moon: 0,
    vmHemi: [0x3a3c58, 0x1a130c, 0.4], vmKey: [0xffb868, 0.4] });
  /* (photographed beside day one, the first dawn was day one a little yellower: an even light and no mist to see. The
     sun is low in the east-south-east, BEHIND the bench as he walks up to it, so the morning is a backlight: the sky's
     own light is held down and cooled, the key is deeper gold, and the air is thick enough that the far side of the
     turf goes into it) */
  const DAWN = sky({                  // day two, early: a low gold sun, ground mist, long shadows across the turf
    stops: [[0.00, '#f8cf98'], [0.08, '#f4cba6'], [0.24, '#d6cfc6'], [0.55, '#9db9d6'], [1.00, '#6a94c4']],
    bg: 0xeccfa8, fog: [0xecd4b0, 0.016],
    hemi: [0xe4e2ec, 0x8a8058, 0.72], key: [0xffb866, 2.0, 22, 7.5, 9], fill: [0xa8bcdc, 0.2],
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
    stops: [[0.00, '#fb923a'], [0.16, '#f4743a'], [0.38, '#e25c3e'], [0.64, '#b84a4e'], [1.00, '#5e3660']],
    bg: 0xa06a66, fog: [0xa87068, 0.006],
    hemi: [0xd4a498, 0x3c3630, 0.5], key: [0xff8c4a, 0.9, -24, 4, 3], fill: [0x7078a8, 0.2],
    sun: 0.6, clouds: 0.4, stars: 0.15,
    vmHemi: [0xdcc0b0, 0x4a4640, 0.66], vmKey: [0xffa868, 0.55] });
  /* (the same dusk with the door open: ending B's close is at dusk, and OPEN there is that dusk widened and warmed) */
  const DUSKOPEN = Object.assign({}, DUSK, { bg: 0xb88470, fog: [0xc08a70, 0.0075], hemi: [0xf4ceb0, 0x4c4238, 0.9], key: [0xffb070, 1.35, -24, 4, 3], fill: [0x8c94c4, 0.32] });
  /* HIS COUNTER AT NIGHT (the opening film): the shop dark, one lamp over the glass. The key is that lamp: warm, from
     above and a little behind him; nothing else is lit */
  const COUNTER = sky({
    stops: [[0.00, '#0c0906'], [0.5, '#0a0806'], [1.00, '#070605']],
    bg: 0x0a0806, fog: [0x0a0806, 0.02],
    hemi: [0x5a4a3c, 0x1a120c, 0.34], key: [0xffd6a4, 1.9, -1.6, 8, -3.2], fill: [0x39425a, 0.1],
    vmHemi: [0x5a4a3c, 0x1a120c, 0.4], vmKey: [0xffd6a4, 0.6] });
  const PRESETS = { DAY1, NIGHT, DAWN, OPENED, SHUT, AFTERNOON, DUSK, DUSKOPEN, ROOM0, ROOM1, COUNTER };

  /* every line's length: an ESTIMATE at the speaker's pace until its take is measured at M7 (the registry will carry
     the same numbers); the queue books its window by it and every film's times are built from it, so a re-said line
     moves what follows it. The names are QUOTED on purpose: build.py gives a sound to a chapter's own pack only when
     the chapter names it in quotes (v21.1). Written by masters/v26.0/script/secs.py from masters/v26.0/script/lines.py. */
  /* SECS BEGIN */
  const SECS = {      // 93 of 93 MEASURED from their takes; the rest estimated at the speaker's pace
    /* him */
    'q3o1': 4.01, 'q3o2': 1.69, 'q3o3': 2.89, 'q3o4': 5.37, 'q3o5': 11.85, 'q3o6': 6.17, 'q3v': 4.41, 'q3p1': 0.97,
    'q3m0': 5.69, 'q3m1': 5.93, 'q3w1': 2.33, 'q3w2': 4.25, 'q3w3': 6.81, 'q3u1': 1.93, 'q3u2': 3.13, 'q3u3': 6.49,
    'q3c1': 2.81, 'q3c2': 2.33, 'q3c3': 7.21, 'q3t1': 7.13, 'q3t2': 5.49, 'q3t3': 6.33, 'q3t4': 4.17, 'q3t8': 1.07,
    'q3a1': 7.61, 'q3A0': 2.33, 'q3A1': 7.61, 'q3A2': 6.01, 'q3A3': 6.09, 'q3B0': 5.69, 'q3B1': 15.05, 'q3B2': 2.89,
    'q3B3': 5.21, 'q3B4': 1.83, 'q3B5': 5.69, 'q3C0': 7.05, 'q3C1': 6.57, 'q3C2': 1.21, 'q3C3': 1.77, 'q3C4': 5.13,
    'q3D0': 5.93, 'q3D1': 2.97, 'q3D2': 7.85, 'q3D3': 10.21, 'q3D4': 4.33, 'q3D5': 5.85, 'q3z1': 7.61, 'q3K1': 8.01,
    'q3A': 3.45, 'q3B': 4.17, 'q3C': 4.09, 'q3D': 3.85,
    /* Ton */
    'tn3a1': 2.89, 'tn3a2': 6.33, 'tn3d1': 2.65, 'tn3m1': 1.45, 'tn3m2': 4.56, 'tn3c1': 5.61, 'tn3c2': 4.25,
    'tn3n1': 1.61, 'tn3A1': 2.09,
    /* the woman at his bench */
    'ds3c1': 7.37, 'ds3p1': 2.03,
    /* Grandmaster Pho */
    'ph3g1': 4.41, 'ph3n1': 8.73, 'ph3n2': 5.75, 'ph3n3': 11.37, 'ph3n4': 6.57, 'ph3b0': 1.87, 'ph3b1': 0.71,
    'ph3b2': 0.73, 'ph3b3': 3.04, 'ph3b4': 4.1, 'ph3bx': 0.77, 'ph3by': 3.29, 'ph3b5': 5.77, 'ph3p1': 6.09,
    'ph3A1': 3.13, 'ph3A2': 5.53, 'ph3B1': 1.38, 'ph3B2': 3.93, 'ph3B3': 1.53, 'ph3B4': 2.89, 'ph3C1': 6.09,
    'ph3C2': 2.33, 'ph3C3': 9.12, 'ph3D1': 3.04, 'ph3D2': 4.49, 'ph3D3': 2.95, 'ph3D4': 2.73, 'ph3z0': 6.14,
    'ph3z1': 6.25, 'ph3z2': 1.77
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

  /* THE FILM OF THE FESTIVAL (§4.1 P3): the dance; the cut to the masters, and those who go up; the lens along the
     masters to the one in white */
  const FEST = tl(0, [['@dance'], [3.2], ['tn3d1', 1.07], ['q3m0', 1.4], ['@cut'], [1.2], ['@masters'], [1.8], ['q3m1', 2.4],
                      ['@sweep'], [4.2], ['q3w1', 0.64], ['q3w2', 0.6], ['q3w3', 0.3], ['@black'], [1.2]]);
  /* (the moments inside it that the pictures and the cues both read. The cut to the man whose arms rise lands on the
     second half of the line said over it, "and some of them went somewhere I could not follow": HALF is where that
     half begins, as a share of the take, re-measured from the take's own word timings when it is made) */
  { const T = FEST, HALF = 0.51;
    T.man = T.q3m1 + HALF * SECS['q3m1'];     // the cut to the man
    T.pet = T.masters + 3.0;                  // the hermit's hands leave her bai sri for a handful of petals
    T.throw = T.pet + 1.7;                    // and it is thrown
    T.low = T.man + 0.4;                      // she sets her bai sri down (behind the cut)
    T.pho = T.q3w2 - 0.12;                    // the cut in to the man in white
    T.cheer = T.q3w2 + 1.3;                   // his own handful, over those who kneel to him (photograph 1)
    T.throw2 = T.cheer + 1.3; }

  /* THE NIGHT BETWEEN (§4.2): five pictures and no word until the last. The group's photograph in the afternoon, his
     bai sri still in his hands; the banners against a red evening; the offering tables by their own candles; his bai
     sri on the sill of a rented room as the window pales; first light on the turf, and Ton */
  const BETW = tl(0, [[0.6], ['@n1'], [0.8], ['ds3p1', 1.4], ['@n2'], [3.3], ['@n3'], [3.8], ['@n4'], [4.0], ['@n5'], [2.0], ['tn3n1', 0.9]]);

  /* THE TELLING (§4.3 P7; v26.8, Chad, 13 Nov 2026: "Just focus on his sensitivity, him unable to control his body
     movements when hearing chanting, him feeling the distinct energy of different amulets, and him opening up his body
     to kumanthongs before. Be direct and straightforward."): his four sentences, a breath between each; "He listened.";
     a short black */
  const TELL = tl(0, [[0.9], ['q3t1', 0.8], ['q3t2', 0.9], ['q3t3', 0.9], ['q3t4', 1.5], ['q3t8', 1.5], ['@black'], [0.6]]);
  /* THE ANSWERS (§4.3 P8; v26.8, Chad: "greatly shortened and more straight to the point. Start with talking about how
     different people bring different things and baramee from past lives to the present life, how the player is born with
     a gift and a mission, and how he should learn to control it by opening and closing at will"): out of that black; his
     line; Grandmaster Pho's three; his eyes close a moment (@blink); the first teaching in one line; it ends in the clear
     on play's own picture */
  const ANSW = tl(0, [[0.6], ['q3a1', 0.9], ['ph3n1', 1.1], ['ph3n2', 1.2], ['ph3n3', 1.0], ['@blink'], [0.7], ['ph3n4', 2.2]]);
  /* (where the words a look is cued on begin inside each take, in seconds from its start: the picked takes' own word
     timings (faster-whisper on this machine, v26.8). Re-measure them when a take changes: "Different" and "and
     different baramee" in ph3n1; "You were born" and "and with a mission" in ph3n2; "Without control" and "You opened"
     in ph3n3; "To open" in ph3n4) */
  const ANSW_WORDS = { n1diff: 5.00, n1and: 7.08, n2born: 2.56, n2and: 4.00, n3wo: 2.86, n3you: 7.14, n4to: 2.48 };

  /* THE FOUR ENDINGS (§4.5): each its own road to the same place; `close` is where the close all four share begins */
  const ENDT = {
    A: tl(0, [[0.9], ['q3A0', 0.5], ['@long'], [1.8], ['ph3A1', 0.7], ['q3A1', 0.8], ['ph3A2', 0.9], ['@bow'], [3.2], ['@ton'], [1.3], ['tn3A1', 0.7],
              ['@mats'], [1.6], ['q3A2', 1.0], ['q3A3', 1.4], ['@close']]),
    B: tl(0, [[0.9], ['q3B0', 0.9], ['ph3B1', 0.8], ['ph3B2', 1.0], ['q3B1', 0.9], ['ph3B3', 0.4], ['@silence'], [2.6], ['q3B2', 1.4],
              ['@edge'], [1.7], ['q3B3', 1.2], ['@dusk'], [3.6], ['@back'], [1.3], ['q3B4', 0.9], ['ph3B4', 1.1], ['q3B5', 1.3], ['@close']]),
    C: tl(0, [[0.9], ['q3C0', 0.9], ['ph3C1', 0.8], ['ph3C2', 0.5], ['@turn'], [3.2], ['q3C1', 1.1], ['@backto'], [1.5], ['ph3C3', 1.0],
              ['q3C2', 0.5], ['@bow'], [3.0], ['q3C3', 1.0], ['q3C4', 1.3], ['@close']]),
    D: tl(0, [[0.9], ['q3D0', 0.9], ['ph3D1', 0.8], ['ph3D2', 1.0], ['ph3D3', 0.5], ['@shut'], [2.8], ['q3D1', 1.5], ['@sit'], [3.4],
              ['@chant'], [3.4], ['q3D2', 1.2], ['q3D3', 1.2], ['@back'], [1.4], ['q3D4', 0.9], ['ph3D4', 1.1], ['q3D5', 1.3], ['@close']])
  };
  /* THE CLOSE (§4.6), on its own clock from each ending's `close`: he takes his bai sri up and raises it; his teacher's
     two lines; both the old man's hands laid on it; a handful of petals; HIS OWN LIGHT, his hands shaking and in hand
     (v26.8: the breath once played here is shown instead); his line; the bai sri taken from him and set on the table;
     "Tomorrow we begin."; the case file's last words */
  const CLOSE = tl(0, [[0.7], ['@take'], [3.5], ['ph3z0', 0.8], ['ph3z1', 0.9], ['@hands'], [3.0], ['@petals'], [3.8], ['@glow'], [4.8], ['q3z1', 1.0],
                       ['@give'], [4.6], ['ph3z2', 1.8], ['q3K1', 1.2], ['@black'], [1.8]]);

  /* THE OPENING FILM, THE QUESTIONS (§4.0): the forum's thread on his laptop, and his answer typed; his notebook, the
     three questions underlined as he asks them, and the page turned; what he takes, and it packed; then the turf */
  const OPENT = tl(0, [[1.0], ['@o1'], [1.3], ['q3o1', 2.6], ['@o2'], [1.7], ['q3o2', 0.8], ['q3o3', 0.8], ['q3o4', 1.0], ['q3o5', 0.9], ['@o3'], [5.2],
                       ['@o4'], [2.6], ['q3o6', 3.4], ['@black'], [1.4]]);

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
    shrine:    { x: 6.33, z: 9.03 },          // the engine's anchor (ghost: null): where Grandmaster Pho sits, the chapter's pile (c_cast.js PHO_AT)
    ghostHome: { x: 6.33, z: 9.03 },
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
      'e4hermitam', 'e4hermitaf', 'e4hermitah', 'e4hermitb', 'e4hermitbm', 'e4hermitbf', 'e4hermitbh', 'e4red',
      'e4redm', 'e4redf', 'e4redh', 'e4white', 'e4whitem', 'e4whitef', 'e4whiteh', 'e4dancera', 'e4danceram',
      'e4danceraf', 'e4dancerb', 'e4dancerbm', 'e4dancerbf', 'e4deva', 'e4devam', 'e4devaf', 'e4devah', 'e4devb',
      'e4devbm', 'e4devbf', 'e4devc', 'e4devcm', 'e4devcf', 'e4devch', 'e4devd', 'e4devdm', 'e4devdf', 'e4deve',
      'e4devem', 'e4devef', 'e4devf', 'e4devfm', 'e4devff', 'e4devfh', 'e4devg', 'e4devgm', 'e4devgf', 'e4devh',
      'e4devhm', 'e4devhf', 'e4girl', 'e4girlm', 'e4girlf', 'e4boy', 'e4boym', 'e4boyf', 'e4monkb', 'e4monkbm',
      'e4monkbf', 'e4monkc', 'e4monkcm', 'e4monkcf', 'pho', 'phof', 'w3baisri', 'w3naga', 'w3wheel', 'w3parasol',
      'w3tower', 'w3candle', 'w3fan', 'w3nagastaff', 'w3pewter', 'w3purple', 'w3fruit', 'w3sweets', 'w3khantok',
      'w3puff', 'w3chair', 'w3lowtable', 'w3bench', 'w3sofa', 'w3petalbowl', 'w3petalsteel', 'w3smallbaisri',
      'w3candlemid', 'w3candlesmall', 'w3kratip', 'w3chicken', 'w3coconut', 'w3soda', 'w3water', 'w3matroll',
      'w3shirt', 'w3chrys', 'w3roses', 'w3claypot', 'w3pchair', 'w3horns', 'w3taper', 'w3glass', 'w3tissue',
      'w3nagafount', 'w3nagagreen', 'w3nagawhite', 'w3ganesha', 'w3croton', 'w3dracaena', 'w3waterjar', 'w3walllamp',
      'w3t_turf', 'w3t_petalturf', 'w3t_earth', 'w3t_gravel', 'w3t_redplank', 'w3t_tin', 'w3t_brick', 'w3t_skirt',
      'w3t_satin', 'w3t_mat', 'w3t_carpet', 'w3t_bluemat', 'w3t_swag', 'w3t_banner', 'w3t_treeline', 'w3t_redroof',
      'w3t_hallbrick', 'w3t_steptile', 'w3t_lawn', 'w3t_kalae', 'w3t_fretwork', 'w3t_sign', 'w3banana2',
      'w3frangipani', 'w3isanhouse', 'w3tank', 'w3aircon', 'w3scooter', 'w3t_render', 'w3t_cloudbank',
      'w3t_cloudtall', 'w3t_cloudflat', 'w3t_cloudthree', 'w3t_cirrus',
      /* <<< this chapter's own keys <<< */
      /* the trees of this episode's first chapter (reuseInEpisode) */
      'e4raintree', 'e4mango', 'e4raintreehd', 'e4mangohd',
      /* his palms and his banana, as chapter 1 has them (reuseInEpisode): the groves round the ground (v26.1) */
      'e4palm1', 'e4palm2', 'e4palm1far', 'e4palm2far', 'e4banana',
      /* his bag, as chapter 2 packed it, and his notebook (reuseInEpisode) */
      'e4bag', 'e4notebook',
      /* his laptop, and the sandals left at the turf's edge (reuse) */
      'filmlaptop', 'slipper',
      /* Chad's monk as episode 3 has him (reuse). (Grandmaster Pho, Chad's own model, cast here for the first time, is
         in the keys above.) */
      'monkshop', 'monkrow'
    ],
    /* FRESH (chaptertest) asks a chapter of episode 4 to declare what it takes from episodes 1 to 3 (`reuse`), and what
       it shares with the chapters of its own episode (`reuseInEpisode`): Chad, v17.4, "any reuse is declared" */
    reuse: { filmlaptop: "his own laptop on his counter (episode 3 chapter 1's, as chapters 1 and 2 of this episode have it): its screen the forum's thread chapter 2 ended on, in the opening film",
             slipper: "Chad's sandals, for the rows of them left at the turf's edge as at any Thai ceremony ground (the opening film): the one sandal he has given, a colour a pair",
             monkshop: "Chad's monk, in the middle chair of the three monks who sit under the east tent as monks sit at a real Wai Kru (photograph 2): the one monk he has made, sitting on its chair with its feet down, its hands on its thighs; met before in episode 3 chapter 3's shop, sitting on the floor; the two either side of him are new (Chad, 12 Nov 2026: \"can we have different monks?\")",
             monkrow: "the same monk's light cut (episode 3 chapter 2's row), drawn for him when he is far across the turf" },
    reuseInEpisode: { e4raintree: "the rain tree of chapter 1's countryside, standing round the ground: the same country's trees, and no tree is built in code (v24.20)",
                      e4mango: "the mango of chapter 1's countryside, likewise",
                      e4raintreehd: "the same rain tree at its fuller level, for the one that stands over the turf",
                      e4mangohd: "the same mango at its fuller level, for the one behind the chief canopy",
                      e4palm1far: "Chad's coconut palm (chapter 1's countryside), at its light level: groves of them stand round the ground 16 to 45 m out, where the bare earth ran to the painted ring of trees (Chad, 12 Nov 2026: \"Add more trees, fill out empty spaces\")",
                      e4palm2far: "Chad's second palm, likewise",
                      e4palm1: "Chad's coconut palm at its full level, for the groves within 32 m of the middle of the ground",
                      e4palm2: "Chad's second palm at its full level, likewise",
                      e4banana: "Chad's banana (chapter 1's clumps round the compound), in clumps round the ground's edges beside the chapter's own second banana",
                      e4bag: "his own bag, the one chapter 2 packed: on his counter in the opening film, and beside his bai sri on the sill of the rented room (the film between the days)",
                      e4notebook: "his own notebook, the one chapter 2's coda left open on his counter: the opening film reads its next page" },
    placeholders: {},
    items: [],

    musicVol: 0,
    /* the beds, every one at 0 here: mixBeds sets each by the day, the place he stands and the beat (M7) */
    /* THE BEDS, every one at 0 here: mixBeds (d_play.js) sets each by the day and the beat, and a film sets its own
       (filmBeds, y_stage.js). Loops, made at masters/v26.0/sound.sh: the festival's crowd, its music over the
       loudspeakers, the morning's birds, the world heard OPEN (the breath's own level), the night's crickets (the
       night between; ending B's dusk), the pull (a low drone that follows the pull's own number) and his shop at night
       (the opening film: its 45 s are longer than one pass of the take) */
    ambience: { beds: [['x3festbed', 0], ['x3festmus', 0], ['x3birds', 0], ['x3open', 0], ['x3crickets', 0], ['x3pull', 0], ['x3shophum', 0]] },
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
      // the opening film: what he types under the forum's thread (the thread's own words are chapter 2's, shown again)
      forumReply: "I'll come. First time.",
      forumSent: 'Sent',
      // OPEN AND CLOSE (§4.3 P9): the event's own words
      breathTitle: 'OPEN AND CLOSE',
      breathBrief: 'Hold your finger anywhere on the screen: the lotus opens and its light climbs the ring. Let go when the light is in the gold mark. Three times.',
      breathBriefKey: 'Hold the mouse button, E or Space: the lotus opens and its light climbs the ring. Let go when the light is in the gold mark. Three times.',
      breathWhere: 'Hold to open. Let go in the gold.',
      breathWhereKey: 'Hold the mouse, E or Space to open. Let go in the gold.',
      breathOpen: 'HOLD',
      breathClose: 'LET GO',
      // the chant's captions (the three lines of homage that go with the three bows): the Pali as chanted over its
      // meaning (v21.31), from Thanissaro Bhikkhu's A Chanting Guide: its Morning Chanting, read on the book's own page on
      // 12 Nov 2026 and matched word for word, its ampersand and its Saṅgha included (docs/research/V26.0-WAIKRU-VERDICTS.md)
      cap1: 'Arahaṁ sammā-sambuddho bhagavā. Buddhaṁ bhagavantaṁ abhivādemi.',
      cap1Sub: 'The Blessed One is Worthy & Rightly Self-awakened. I bow down before the Awakened, Blessed One.',
      cap2: 'Svākkhāto bhagavatā dhammo. Dhammaṁ namassāmi.',
      cap2Sub: 'The Dhamma is well-expounded by the Blessed One. I pay homage to the Dhamma.',
      cap3: 'Supaṭipanno bhagavato sāvaka-saṅgho. Saṅghaṁ namāmi.',
      cap3Sub: 'The Saṅgha of the Blessed One’s disciples has practiced well. I pay respect to the Saṅgha.',
      // the card's What you did
      noteAsked: 'You asked the people who knew him before you went near him.',
      noteBreath3: 'You closed in time, three breaths of three.',
      noteBreath2: 'You closed in time twice. Once he had to close it for you.',
      noteBreath1: 'Twice he had to close it for you.',
      noteBreath0: 'Three times he had to close it for you.',
      // the belief, said as belief (the card's note for the homage and the line: §4.7)
      noteTrance: 'At a Wai Kru some people go into trance when a master blesses them: they tremble, or their arms rise, or they dance. Some believers say it comes to those whose faith is strong. Master Z’s own word on such states: “Do not imitate these states, do not provoke them, and do not chase them out of curiosity.”'
    },
    sayPrefix: 'q3'
  };

