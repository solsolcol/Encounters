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
      'w3puff', 'w3chair', 'w3lowtable', 'w3bench', 'w3sofa', 'w3petalsteel', 'w3smallbaisri', 'w3candlemid',
      'w3candlesmall', 'w3kratip', 'w3chicken', 'w3coconut', 'w3soda', 'w3water', 'w3matroll', 'w3shirt', 'w3chrys',
      'w3roses', 'w3claypot', 'w3pchair', 'w3horns', 'w3taper', 'w3glass', 'w3tissue', 'w3nagafount', 'w3nagagreen',
      'w3nagawhite', 'w3ganesha', 'w3croton', 'w3dracaena', 'w3waterjar', 'w3walllamp', 'w3t_turf', 'w3t_petalturf',
      'w3t_earth', 'w3t_gravel', 'w3t_redplank', 'w3t_tin', 'w3t_brick', 'w3t_skirt', 'w3t_satin', 'w3t_mat',
      'w3t_carpet', 'w3t_bluemat', 'w3t_swag', 'w3t_banner', 'w3t_treeline', 'w3t_redroof', 'w3t_hallbrick',
      'w3t_steptile', 'w3t_lawn', 'w3t_kalae', 'w3t_fretwork', 'w3t_sign', 'w3banana2', 'w3frangipani',
      'w3isanhouse', 'w3tank', 'w3aircon', 'w3scooter', 'w3t_render', 'w3t_cloudbank', 'w3t_cloudtall',
      'w3t_cloudflat', 'w3t_cloudthree', 'w3t_cirrus',
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
    const TOUCHY = !!((window.matchMedia && matchMedia('(pointer: coarse)').matches) || 'ontouchstart' in window);   // (the engine's HAS_TOUCH: which words a brief gives)

    /* ------------------------------------------------------------- THE GROUND'S PLAN (the tracker's §10)
       x east, z south, the origin the middle of the turf. Every place in this chapter is one of these numbers. */
    const TURF = { x0: -10, x1: 10, z0: -9, z1: 12, strip: 2 };
    const GRAVEL = { z0: -10.5, z1: -9 };
    const TABLES = { x0: -2.5, x1: 2.5, z0: -12.4, z1: -10.0, tops: [0.75, 1.05, 1.35], step: 0.8 };   // three steps, the lowest in front (south)
    const WHEEL = { x: 0, z: -12.0 };
    const PARASOL = { x: 0, z: -12.75 };
    /* (v26.2 debug: at z -13.6 the pole went up through the parasol's canopy, 1.04 m from its middle, inside its 1.3 m rim:
       measured, tools/probes/clipscan.mjs. Behind it now, clear of the drawn-larger parasol's rim, before the banners) */
    const POLE = { x: 0.6, z: -14.3, h: 10 };
    /* photographs 13 to 16; its front 9 m behind the tables (8, 10). Measured on 15, the front square on: the skirt rises
       1.5 m and the gable 2.2 m above it, the gable's foot is 6.6 m wide; from 16 the skirt is steep enough to show its
       tiles to a man standing before it, so both tiers are pitched at about thirty degrees */
    const HALL = { x0: -5, x1: 5, z0: -29.7, z1: -21.7, floor: 0.48, wall: 3.1, over: 1.6, overS: 0.9, rise: 1.5, pitch: 30 * Math.PI / 180, gable: 2.2 };
    const SHED = { x0: -16, x1: -10.5, z0: -14, z1: -8, eave: 2.4 };
    const TENT_W1 = { x: -9, z: -1 }, TENT_W2 = { x: -9, z: 5 }, TENT_E = { x: 9, z: -2 };
    const TENT = { w: 4, eave: 2.2, peak: 3.3 };
    /* THE MONKS' ROW under the east tent (photograph 2): three carved armchairs in one line, and the spot of each monk
       who sits in one. One table for the chairs, their blocker and the sitters (v16.7). The chair is drawn at 1.11 of
       its file: 0.946 m deep (its front face `half` ahead of its middle), its seat's top 0.466 m up, 0.708 m clear
       between its arms (tools/probes/seatread.mjs assets/w3chair.glb 1.11). The chairs stand 21 cm behind the
       sitters' spots: a seat that deep is sat on at its front, the shins down before its front face (c_cast.js:
       o.seat.legs), and the one who sits cross-legged sits back in it (`deep`: his hips behind the seat's middle) */
    const MONKS = { x: 10.22, zs: [-3.2, -2.0, -0.8], chair: 10.43, s: 1.11, half: 0.473, deep: 0.135 };
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
      carpet: [0x74202a, 'image/jpeg'], bluemat: [0x86c9c0, 'image/jpeg'], swag: [0xf2f0e4, 'image/webp'], banner: [0xe8e8e8, 'image/webp'], treeline: [0x4c7a3a, 'image/webp'],
      redroof: [0xc8483f, 'image/jpeg'], hallbrick: [0x9a4f3f, 'image/jpeg'], steptile: [0xc98c80, 'image/jpeg'], lawn: [0x5c9a35, 'image/jpeg'],
      kalae: [0x5a4a40, 'image/webp'], fretwork: [0x7a2a26, 'image/webp'], sign: [0xece8dc, 'image/webp'],
      render: [0xbdbebf, 'image/jpeg']                      // (v26.1: the grey building's rendered walls, masters/v26.1/env)
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
      /* (v26.2: the upper tier 2.0 wide and the lower 2.2, out to the posts' feet as photograph 15 has it, so each small Ganesha
         sits on the top BESIDE the basin's end, between it and a post; at 1.8 the basin left no room and both stood half
         inside its wall) */
      box(mTeal, hall.fountain.x, 0.1, hall.fountain.z, 2.2, 0.2, 1.4); box(mTeal, hall.fountain.x, 0.3, hall.fountain.z - 0.06, 2.0, 0.2, 1.12);
      hall.west = { x: H.x0 - 1.7, z: zf + 1.35, top: 0.5 };  box(mTeal, hall.west.x, 0.25, hall.west.z, 2.4, 0.5, 0.95);
      hall.east = { x: H.x1 + 0.3, z: zf + 1.0, top: 0.55 }; box(mTeal, hall.east.x, 0.275, hall.east.z, 1.8, 0.55, 0.95);
      /* (each lamp's back plate on its post's front, the post 0.11 round about zf + 0.07: the lamp 0.106 from its back to its
         middle, so its middle stands at zf + 0.29; at zf + 0.2 its back half was inside the post, v26.2) */
      hall.lampAt = [[H.x0 - 0.02, fl + 1.95, zf + 0.29], [H.x1 + 0.02, fl + 1.95, zf + 0.29]];
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
      /* the small golden Ganesha at each end of the basin, turned to it (photographs 13 and 15): each on the top between the
         basin and a post, 4.6 cm clear of the basin's wall and of the top's edges (fitted to both models' own points,
         tools/probes/fitbeside.mjs, v26.2; at F.x +/- 0.72 each stood half inside the basin's wall) */
      stand('w3ganesha', F.x + 0.85, F.top, F.z + 0.25, -1.6);
      stand('w3ganesha', F.x - 0.85, F.top, F.z + 0.25, 1.6, { done: (m) => { m.scale.x *= -1; } });
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
      /* (v26.1: its walls rendered and weathered, and its louvres lit as the wall is: drawn unlit, they glowed white in its
         shade. Its frames, sills, roof and eave are b_world3.js's buildEdges) */
      const mGrey = surf('render', { tile: 3, roughness: 0.95 }), mLouvre = M({ map: tex(makeLouvre(THREE, cnv)), color: 0xe4e7e8, roughness: 0.6 });
      wall(mGrey, GREY.x1, GREY.z, GREY.x0 - 6, GREY.z, 0, GREY.h); wall(mGrey, GREY.x0 - 6, GREY.z, GREY.x0 - 6, GREY.z + 6, 0, GREY.h);
      for (const x of [6.6, 4.2, 1.8, -0.6, -3.0]) { const g = new THREE.PlaneGeometry(1.1, 1.3); const m = new THREE.Mesh(g, mLouvre);
        m.position.set(x, 1.95, GREY.z - 0.012); m.rotation.y = Math.PI; world.add(m); owned.push(m); }
      box(mGrey, 1.0, GREY.h + 0.08, GREY.z + 0.2, 15.1, 0.16, 1.2);           // (v26.1: under its new roof, not out past its ends)
    }

    /* ================================================================ A TENT (photographs 10, 11, 1)
       A green steel frame, a peaked green roof, and a valance of cloth round the eave with swags draped over it. */
    const mFrameGreen = M({ color: 0x1f7a3a, roughness: 0.5, metalness: 0.3 });
    const satinMats = new Map();
    const satin = (hex) => { let m = satinMats.get(hex); if (!m) satinMats.set(hex, m = surf('satin', { tile: [0.7, 0.7], mirror: 'u', tint: hex, roughness: 0.42, side: THREE.DoubleSide })); return m; };
    /* (the same cloth with its folds drawn two and a half times as wide: a band of it seen from a few metres, in a narrow
       lens, with the folds at their first size and a gold tint in the shade, was a plank of wood: photographed in the
       films at Grandmaster Pho's bench) */
    const satinWideMats = new Map();
    const satinWide = (hex) => { let m = satinWideMats.get(hex); if (!m) satinWideMats.set(hex, m = surf('satin', { tile: [1.8, 0.9], mirror: 'u', tint: hex, roughness: 0.42, side: THREE.DoubleSide })); return m; };
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
        const vm = (o.wide ? satinWide : satin)(o.valance != null ? o.valance : 0xf4f4f0);
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
      /* the orange and gold parasol over it (v26.2 debug: drawn a tenth larger, its canopy lifted clear of the wheel's top,
         which it touched at 2.72 m: measured) */
      stand('w3parasol', PARASOL.x, 0, PARASOL.z, 0, { s: 1.1 });
      many('w3naga', [{ x: 1.15, y: y2, z: -11.95, ry: -0.5 }, { x: 1.6, y: y2, z: -12.1, ry: -0.75 }, { x: 2.05, y: y2, z: -11.9, ry: -1.0 }], world, 0.8);
      many('w3tower', [{ x: -3.25, y: 0, z: -11.0, ry: 0.3 }, { x: 3.25, y: 0, z: -11.0, ry: 2.1 }], world, 2.8);
      /* (M8, the photographs laid beside the game: NO bai sri in a golden bowl stands on the offering tables in any of
         them (3, 4, 9, 10): those are the devotees' own, carried and presented. The six I stood here at M3 are gone, and
         the tables hold what the photographs show instead: white chrysanthemums in silver bowls either side of the
         fruit before the wheel and at the ends, roses at the front corners, soda in rows of red, green and orange) */
      many('w3chrys', [{ x: -0.92, y: y2, z: -11.86, ry: 0.4, s: 1.3 }, { x: 0.7, y: y2, z: -11.8, ry: 2.1, s: 1.3 }, { x: -2.08, y: y1, z: -11.22, ry: 1.2, s: 1.3 }, { x: 2.08, y: y1, z: -11.22, ry: 3.4, s: 1.3 }], world, 0.3);   // (a bunch is as wide as a fruit tray in photograph 9: the model at 1.3. Its full level is 36,700 triangles, Hunyuan's least, and all four are drawn if one is in view: the size given here brings it in inside 7 m, where the far level's dome would begin to show its facets)
      many('w3roses', [{ x: 2.14, y: y0, z: -10.46, ry: 0.25 }, { x: -2.2, y: y0, z: -10.46, ry: -0.3 }], world, 0.25);
      many('w3pewter', [{ x: -1.55, y: y2, z: zb - 0.05, ry: 0.7 }, { x: -0.45, y: y1, z: zm + 0.1, ry: 1.9 }, { x: 0.5, y: y1, z: zm + 0.1, ry: 0.3 }], world, 0.5);
      many('w3fruit', [{ x: -1.65, y: y1, z: zm + 0.16, ry: 0.2 }, { x: 0, y: y1, z: zm - 0.12, ry: 1.1 }, { x: 1.65, y: y1, z: zm + 0.16, ry: 2.4 }, { x: -0.4, y: y0, z: zf - 0.1, ry: 0.6 }, { x: 1.2, y: y1, z: zm - 0.12, ry: 1.7 }], world, 0.3);
      many('w3sweets', [{ x: -1.76, y: y0, z: zf - 0.1, ry: 0.3 }, { x: 0.5, y: y0, z: zf - 0.12, ry: 1.5 }, { x: -1.12, y: y2, z: -12.18, ry: 2.6 }], world, 0.2);
      many('w3khantok', [{ x: -1.1, y: y0, z: zf - 0.08, ry: 0.9 }, { x: 1.22, y: y0, z: zf - 0.06, ry: 2.0 }], world, 0.25);
      const talls = [{ x: -2.95, y: 0, z: -10.25, ry: 0.2 }, { x: 2.95, y: 0, z: -10.25, ry: 1.4 }, { x: -2.2, y: y2, z: -12.2, ry: 0 }, { x: 2.3, y: y2, z: -12.25, ry: 0.8 }];
      many('w3candle', talls, world, 1.25);
      many('w3purple', [{ x: -3.9, y: 0, z: -10.2, ry: 0.5 }, { x: 3.9, y: 0, z: -10.2, ry: 2.2 }], world, 1.1);
      for (const sx of [-1, 1]) solidBox(0.7, 1.5, 0.7, sx * 3.25, 0.75, -11.0);
      /* THE SMALLER OFFERINGS (photographs 9, 10, 3): small candles in pink and blue along the front edge; candles in
         clay pots between the bai sri; soda in rows of red, green and orange, and water; baskets of sticky rice; a
         boiled chicken on its plate; green coconuts; small bai sri of leaf and lotus bud. One model each: a colour is a
         turn of its hue, and where each stands is a seeded scatter of a hand's width, so no row is ruled */
      const rnd = rng(9126), j = (k = 0.03) => (rnd() - 0.5) * 2 * k, turn = () => rnd() * 6.283;
      const hued = (deg) => (made) => { for (const im of made) hueTurn(im.material, deg); };
      const smalls = []; for (let x = -2.31; x <= 2.32; x += 0.33) smalls.push({ x: x + j(0.02), y: y0, z: -10.09 + j(0.012), ry: turn() });
      many('w3candlesmall', smalls.filter((_, i) => i % 2 === 0), world, 0.24);                    // pink, as made
      many('w3candlesmall', smalls.filter((_, i) => i % 2 === 1), world, 0.24, hued(-118));        // and blue
      const mids = [-1.62, -0.82, 0.86, 1.64].map(x => ({ x: x + j(), y: y1, z: zm - 0.3 + j(), ry: turn() }))
        .concat([{ x: -0.5, y: y2, z: zb - 0.22, ry: 0 }, { x: 0.55, y: y2, z: zb - 0.2, ry: 1 }])
        /* (photograph 10: yellow candles of this height stand among everything on the front step too) */
        .concat([-1.9, -0.95, 0.25, 1.05].map(x => ({ x: x + j(0.015), y: y0, z: -10.72 + j(0.01), ry: turn() })));
      many('w3candlemid', mids, world, 0.66);
      /* (every candle's wick, for the night's flames: c_zfx.js. `s` is the flame's size on a candle of that size) */
      stageList.flames = talls.map(c => ({ x: c.x, y: c.y + 1.25, z: c.z, s: 1.7 })).concat(mids.map(c => ({ x: c.x, y: c.y + 0.66, z: c.z, s: 1.15 })), smalls.map(c => ({ x: c.x, y: c.y + 0.24, z: c.z, s: 0.7 })));
      const rows = (x0, zs, xs) => { const L = []; for (const z of zs) for (const dx of xs) L.push({ x: x0 + dx + j(0.006), y: y0, z: z + j(0.006), ry: turn() }); return L; };
      const sodaZ = [-10.33, -10.42, -10.51];
      const soda = [rows(0.02, sodaZ, [-0.09]), rows(0.02, sodaZ, [0]), rows(0.02, sodaZ, [0.09])];   // red, green, orange
      /* a row of six along a step's edge, two of each colour side by side (photograph 9: red red, green green, orange orange) */
      const sodaRow = (x0, y, z) => { for (let i = 0; i < 6; i++) soda[i >> 1].push({ x: x0 + i * 0.09 + j(0.006), y, z: z + j(0.008), ry: turn() }); };
      sodaRow(-1.58, y2, -11.68); sodaRow(0.78, y1, -10.88); sodaRow(-1.25, y1, -10.88); sodaRow(1.46, y0, -10.7);
      many('w3soda', soda[0], world, 0.22);                                                        // red
      many('w3soda', soda[1], world, 0.22, hued(112));                                             // green
      many('w3soda', soda[2], world, 0.22, hued(26));                                              // orange
      many('w3water', rows(0.86, [-10.34, -10.43], [-0.045, 0.045]), world, 0.21);
      many('w3kratip', [{ x: -0.78, y: y0, z: -10.36, ry: 0.4 }, { x: -0.7, y: y0, z: -10.5, ry: 2.0 }, { x: -0.8, y: y0, z: -10.62, ry: 4.1 },
                        { x: -1.76, y: y2, z: -11.7, ry: 1.1 }, { x: -0.12, y: y1, z: -10.9, ry: 3.0 }, { x: -0.24, y: y1, z: -10.98, ry: 5.2 }], world, 0.14);
      many('w3chicken', [{ x: 1.6, y: y0, z: -10.42, ry: 0.5 }], world, 0.3);
      many('w3coconut', [{ x: -1.5, y: y0, z: -10.36, ry: 0.3 }, { x: -1.44, y: y0, z: -10.6, ry: 2.6 }, { x: 0.36, y: y1, z: zm + 0.3, ry: 1.2 }], world, 0.19);
      many('w3smallbaisri', [{ x: -2.05, y: y2, z: -11.86, ry: 0.6 }, { x: -1.18, y: y1, z: -11.3, ry: 2.4 }], world, 0.38);
      /* the clay pot of sand on the gravel before the tables, where the spent sticks go (photograph 10) */
      many('w3claypot', [{ x: 0.85, y: 0, z: -9.68, ry: 0.7 }], world, 0.32);
      solidBox(0.5, 0.7, 0.5, 0.85, 0.35, -9.68);
      namesSheet();
    }
    /* THE SHEET ON THE WHEEL (photographs 4, 9, 10): a printed list clipped to the great bai sri's left side. In the
       photographs it is a list of names: nobody's name is copied (the repository is public, and they are real people),
       so it is drawn as what a phone sees of it at that distance, rows of grey that cannot be read (words drawn into
       the world are art: v14.5). A sheet of paper is a flat thing: this is its real shape, not a stand-in */
    function namesSheet() {
      const [c, x] = cnv(256); c.height = 362;
      x.fillStyle = '#f4f3ee'; x.fillRect(0, 0, 256, 362);
      x.fillStyle = '#3d5a86'; x.fillRect(18, 16, 220, 15);                                      // its heading: one bar
      const r = rng(5512);
      for (let i = 0; i < 24; i++) { const y = 40 + i * 12.6;
        x.fillStyle = i % 2 ? '#e3e6ec' : '#f4f3ee'; x.fillRect(18, y - 1.5, 220, 12.6);         // ruled rows, shaded in turn
        x.fillStyle = '#5a5d66'; x.fillRect(22, y + 2.5, 9, 5);                                    // a number
        x.fillStyle = '#44464e'; let px = 40; for (let w = 0, n = 2 + Math.floor(r() * 3); w < n; w++) { const len = 14 + r() * 30; x.fillRect(px, y + 2.5, len, 5); px += len + 5; } }
      const t = tex(new THREE.CanvasTexture(c)); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
      const m = new THREE.Mesh(new THREE.PlaneGeometry(0.297, 0.42), M({ map: t, roughness: 0.9, side: THREE.DoubleSide }));
      m.position.set(WHEEL.x - 0.37, TABLES.tops[2] + 0.7, WHEEL.z + 0.2); m.rotation.set(-0.12, 0.1, 0.17, 'YXZ');
      world.add(m); owned.push(m);
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
      const rows = (T0, n, key, size, own = -1) => {
        const h = foldTable(T0.x, T0.z, T0.ry), c = Math.cos(T0.ry), s = Math.sin(T0.ry), L = [];
        for (let i = 0; i < n; i++) { const lx = -0.72 + (i % (n / 2)) * (1.44 / (n / 2 - 1)), lz = i < n / 2 ? -0.17 : 0.18;
          L.push({ x: T0.x + lx * c + lz * s, y: h, z: T0.z - lx * s + lz * c, ry: rnd() * 6.28, s: size }); }
        many(key, L.filter((_, i) => i !== own), world, 0.6);
        return L;
      };
      stageList.tonBai = rows(TON_TABLE, 8, 'w3baisri', 0.85, 7)[7];           // Ton's group's, at the way in: one of them is his (the corner by Ton is his own: a thing by itself, c_zfx.js)
      rows(WEST_TABLE, 10, 'w3pewter', 1);                                     // the table by the west tents (photographs 11, 12)
    }
    const stageList = {};

    /* ================================================================ THE TENTS, AND WHAT IS UNDER THEM */
    const mCarpet = surf('carpet', { tile: [2.4, 1.6], clamp: true, roughness: 0.95 });
    const mMat = surf('mat', { tile: 1.1, mirror: 'uv', roughness: 0.9 });
    const mStripe = surf('mat', { tile: 0.8, mirror: 'uv', tint: 0xc8d8ff, roughness: 0.9 });
    /* (the turquoise mat with round flowers that lies by the hermit's sofa: photograph 12. One picture, one mat) */
    const mBlueMat = surf('bluemat', { tile: [1.9, 1.26], clamp: true, roughness: 0.92 });
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
      /* (12 Nov, the plan's lists read against the build: its "blue patterned mat" and "the small real things on the low
         tables: glasses, a roll of tissue" were never made. Photograph 12: a turquoise mat with round flowers lies by
         the hermit's sofa and under its end; a bottle of water and a glass of red soda stand by his bowl of petals) */
      rug(mBlueMat, -9.92, -2.6, 1.9, 1.26, 0, 0.0085);
      many('w3glass', [{ x: -9.32, y: 0.008, z: -1.92, ry: 0.6 }], world, 0.15);
      many('w3water', [{ x: -9.46, y: 0.008, z: -1.74, ry: 2.2 }], world, 0.21);
      /* (v26.2 debug: at (-7.0, 1.0) it stood on the tent's corner pole, which went up through it: Chad's picture, measured.
         Along the tent's open front now, 0.74 m from the pole, clear of those who kneel there at the blessing and of the
         stack of rolled mats ending A lays south of it; and a thing he walks round) */
      many('w3purple', [{ x: -6.75, y: 0, z: 0.3, ry: 1.0 }], world, 1.1); solidBox(0.62, 1.4, 0.62, -6.75, 0.7, 0.3);
      /* west tent 2: the hermit in the yellow shawl */
      rug(mMat, -8.1, 5.0, 3.2, 1.8, Math.PI / 2);
      many('w3sofa', [{ x: -10.25, y: 0, z: 5.0, ry: Math.PI / 2 }], world, 0.9);
      solidBox(1.0, 1.4, 1.5, -10.3, 0.7, 5.0);
      /* the east tent: the monks' row, the naga staff and the peacock fan, low round trays with coconuts and water */
      rug(mMat, 8.1, -2.0, 3.6, 1.8, Math.PI / 2);
      many('w3chair', MONKS.zs.map(z => ({ x: MONKS.chair, y: 0, z, ry: -Math.PI / 2, s: MONKS.s })), world, 1.28);   // (a tall carved armchair, drawn at 1.28 m: its seat 0.466 m up)
      /* (one blocker for the row, as it was: from the sitters' knees, half a metre ahead of their spots, to the chairs' backs) */
      { const x0 = MONKS.x - 0.5, x1 = MONKS.chair + MONKS.half; solidBox(x1 - x0, 1.4, 3.6, (x0 + x1) / 2, 0.7, -2.0); }
      many('w3khantok', [{ x: 9.2, y: 0, z: -2.6, ry: 0.4 }, { x: 9.2, y: 0, z: -1.2, ry: 1.9 }], world, 0.25);
      stand('w3nagastaff', 10.55, 0, -3.75, 0.3);
      /* (the fan 4 cm clear of the third monk's chair: at z -0.15 its grille's edge stood in the chair's back corner, v26.2) */
      stand('w3fan', 10.5, 0.02, -0.05, -1.2);
      /* THE CHIEF CANOPY (photographs 1, 5, 6): a dark top, a valance of gold and lime in swags, one pole wrapped in
         puffs of lime cloth; maroon carpets deep in petals; his bench, a carved chair, a low dark table */
      /* (its drapes are deep: photographs 5 and 6 are taken under them, and what fills their top is swags of lime, gold
         and orange satin, not the dark cloth over them) */
      /* (v26.8, Chad, 13 Nov 2026: "when grandmaster pho stands up to look at the player for the first time ... the cover
         sheet of the tent's top covers grandmaster pho's face". Its swags hung to 1.58 m at their middles, a standing man's
         face: from where he waits in line the swag across the canopy's front hid Grandmaster Pho's head from the neck up,
         and the lens narrowed onto the swag. Photograph 6 has them over the head of the master who stands under them, the
         lowest at about 1.85 m: so here, ends 0.25 m under the eave and middles 0.45, where they were 0.36 and 0.72) */
      const C = tent(CHIEF.x, CHIEF.z, { w: CHIEF.w, eave: CHIEF.eave, peak: CHIEF.peak, ry: CHIEF.ry, roof: satinRoof(0x2c4632, 0x1d2c22), valance: 0xf2c63c, wide: true, band: 0.4,
        swags: 3, swagCols: [0xb6d62e, 0xe2a61a, 0xf08a1c], swagDepth: 0.56, swagDrop: 0.2, swagStep: 1 });
      for (const [x, z] of C) solidBox(0.16, 2.2, 0.16, x, 1.1, z);
      /* THE LIME POLE (photographs 1, 5, 6): the canopy's front right pole, the one before the bench's right hand, wrapped
         from the ground to the eave in seven gathered tiers of lime cloth, each wider than it is tall and a little
         narrower than the one under it. The model is one puff of white satin (0.75 m tall, 0.52 across): each is drawn
         wider and pressed down to 0.46 m about its own foot, and tinted */
      /* (v26.2 debug: seven tiers 0.46 m tall on a rise of 0.31 reached 2.33 m, through the gold valance and the swags at
         the canopy's corner (measured: tools/probes/clipscan.mjs). Seven tiers 0.40 m tall on a rise of 0.245 end at
         1.88 m, under the valance, still overlapping so no pole shows between) */
      { const [px, pz] = C[0], tiers = [0, 1, 2, 3, 4, 5, 6].map(k => ({ x: px, y: 0.01 + k * 0.245, z: pz, ry: k * 1.9, s: 1.22 - k * 0.04 }));
        many('w3puff', tiers, world, 0.75, (made) => { const m4 = new THREE.Matrix4(), sq = new THREE.Matrix4();
          for (const im of made) { im.material.color.set(0xa6d82a);
            tiers.forEach((t, i) => { im.getMatrixAt(i, m4);
              sq.makeTranslation(0, t.y, 0).multiply(m4.clone().makeScale(1, 0.40 / (0.75 * t.s), 1)).multiply(new THREE.Matrix4().makeTranslation(0, -t.y, 0));
              im.setMatrixAt(i, sq.multiply(m4)); });
            im.instanceMatrix.needsUpdate = true; im.computeBoundingSphere(); } }); }
      /* his bench (brown hardwood: the model came lacquer red, its hue turned and darkened here), drawn 2.05 m long for
         two; the low table at his right hand's front with a bai sri set down on it; a carved chair
         beyond it; maroon carpets before the bench where people kneel; purple flowers at both ends */
      const BA = (a, b) => benchAt(a, b), along = BENCH.ry + Math.PI / 2;
      { const [x1, z1] = BA(0.15, 1.95), [x2, z2] = BA(-1.95, 1.8); rug(mCarpet, x1, z1, 2.4, 1.6, along); rug(mCarpet, x2, z2, 2.4, 1.6, along + 0.07, 0.009); }
      stand('w3bench', BENCH.x, 0, BENCH.z, BENCH.ry, { s: 1.1, done: (m) => { m.scale.x *= 1.24; m.traverse(q => { if (q.isMesh) { hueTurn(q.material, 17); q.material.color.multiplyScalar(0.72); } }); } });
      solidBox(2.2, 1.4, 0.8, BENCH.x, 0.7, BENCH.z, BENCH.ry);
      { const [x, z] = BA(2.25, -0.05); stand('w3chair', x, 0, z, BENCH.ry - 0.25, { s: 1.11 }); solidBox(0.9, 1.4, 0.9, x, 0.7, z, BENCH.ry); }
      /* (v26.2 debug, measured by tools/probes/clipscan.mjs: the low table, a metre square at (1.05, 1.1), stood in the lime
         pole's lowest puffs, under Grandmaster Pho's right foot and in the knee of the young man who kneels before him (and
         his bai sri, set on it at the last, stood in its glass). Drawn 0.7 m square now, a little to his right, every one of
         them 15 cm or more clear; and what stands on it is laid out on its smaller top, the bai sri's place left free) */
      const TB = BA(1.2, 0.95);
      stand('w3lowtable', TB[0], 0, TB[1], BENCH.ry + 0.12, { done: (m) => { m.scale.x *= 0.7; m.scale.z *= 0.7; } }); solidBox(0.74, 1.0, 0.74, TB[0], 0.5, TB[1], BENCH.ry);
      /* (v26.8: the two golden bowls of petals, one on this table and one on the carpet by his foot, taken out at Chad's
         word: "Actually is it even necessary to have this petal bowl? Or just remove it from the game", and his pick,
         "Remove it". The steel bowl under the west tent stays: photograph 11) */
      { const [wx, wz] = BA(1.38, 0.78);
        many('w3pewter', [{ x: wx, y: 0.38, z: wz, ry: 0.8 }], world, 0.5); }
      { const [gx, gz] = BA(0.95, 1.2), [tx, tz] = BA(1.12, 1.22); many('w3glass', [{ x: gx, y: 0.38, z: gz, ry: 1.3 }], world, 0.15); many('w3tissue', [{ x: tx, y: 0.38, z: tz, ry: 0.4 }], world, 0.11); }
      { const [ax, az] = BA(-1.55, 0.15), [cx2, cz2] = BA(2.95, 0.7); many('w3purple', [{ x: ax, y: 0, z: az, ry: 2.0 }, { x: cx2, y: 0, z: cz2, ry: 0.4 }], world, 1.1);
        /* (v26.2 debug: he could walk into the flowers, the lens inside the bouquet: each a thing he walks round) */
        solidBox(0.62, 1.4, 0.62, ax, 0.7, az); solidBox(0.62, 1.4, 0.62, cx2, 0.7, cz2); }
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
      /* (v26.2 debug, measured by tools/probes/clipscan.mjs and seen in Chad's pictures of 13 Nov 2026: the row behind the
         tables stood under the parasol's rim (and its west end under the open shed's roof); the west row's first hung
         through the shed's roof and beams on its bamboo, its last through the west tent's eave. The row stands 0.8 m
         further back; the west row between the shed and the first tent, and one between the two tents) */
      order.forEach((c, i) => put(-11 + i * (22 / 13), -15.3 + (rnd() - 0.5) * 0.5, c, 0.2 + rnd() * 0.5));
      [['pink', -6.9], ['white', -5.6], ['yellow', -4.3], ['red', 2.0]].forEach(([c, z]) => put(-11.5 + (rnd() - 0.5) * 0.3, z, c, 1.4 + rnd() * 0.4));
      /* EACH IS ONE CLOTH, hanging DOWN from its own origin (so a turn about the origin is a swing from the tip), turned to
         face the middle of the ground (v26.2 debug: the picture crossed with itself read as a square pillar close by, and
         from far off as a red or yellow block: Chad's pictures) */
      for (const b of banners.list) b.ry = Math.atan2(0 - b.x, 1.5 - b.z) + (b.ry - Math.PI / 2) * 0.25;
      const g = new THREE.BufferGeometry(), w = BANNER.w / 2, h = BANNER.h, P = [], U = [], N = [];
      for (const [ax, az] of [[1, 0]]) {
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
      /* (v26.2 debug: each string tied to a real thing. Two ran into the trees' crowns, their flags among the leaves, and one
         onto the shed's roof, its last flags through the tin (Chad's pictures; measured). They end now where each first
         meets its tree's leaves (tools/probes/stringend.mjs), on the tents' and the chief canopy's peaks, the two
         loudspeaker poles' tops, the shed's gable end, the hall's gable and the grey building's fascia) */
      const ends = [[-20.5, 6.9, -1.5], [14.25, 6.25, -16.35], [-9, 3.4, -1], [9, 3.4, -2], [5.47, 3.15, 9.85], [-9, 3.4, 5], [-9.7, 3.75, -9.35], [10.7, 3.75, -8.1], [0, 6.8, -20], [-13.25, 3.75, -7.45], [3, 4.15, 12.32], [-5, 4.15, 12.32]];
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
      /* (v26.2 debug, Chad's pictures of 13 Nov 2026 and tools/probes/clipscan.mjs: the huge tree's trunk went up through the
         lower shed roof behind the west tents; the mango stood inside the red plank building behind the chief canopy, its
         crown through both roofs; the north-east tree's crown took in a power pole, the wires and a banner; and the four
         crowns met the groves' palms. Each stands now where its crown, at every height, clears every roof, wall, pole,
         wire, banner and other crown by 0.3 m (masters/v26.2/trees: the crowns measured from the files,
         tools/probes/treeprofile.mjs, and the nearest such place solved for each, the four first) */
      { key: 'e4raintreehd', x: -21.15, z: -1.1, h: 13.5, ry: 0.4 },     // the huge tree west of the turf (photograph 10)
      { key: 'e4mangohd', x: 13.75, z: 20.6, h: 9.5, ry: 2.1 },        // the tree behind the chief canopy's buildings
      { key: 'e4raintreehd', x: 23.4, z: -17.75, h: 10.5, ry: 3.0 },    // north-east (photograph 8)
      /* (v26.2 debug: this one at its fuller level too. Ending B looks up past the chief canopy into its crown from
         12 m, and the light file's crown, its leaves remeshed into big flat shards (v24.27), read there as crumpled foil.
         Its files are the same tree; the fuller one is already loaded for the tree over the turf) */
      { key: 'e4mango', x: -13.5, z: 16, h: 8.5, ry: 5.0 }         // south-west, by the way in
    ];
    /* LEAVES ARE NOT FOIL (v26.2 debug, Chad's picture of the tree behind the chief canopy, 13 Nov 2026: its crown shone like
       crumpled foil). The generated trees came with a metal-roughness sheet that reads their leaves as polished and partly
       metal (the v25.5 law for a generated body's paint, applied where it is drawn): metal off, a leaf's rough finish, their
       own colour and relief kept */
    function leafMatte(mt) { for (const m of [].concat(mt)) { if (!m || !('roughness' in m)) continue;
      m.metalnessMap = null; m.metalness = 0; m.roughnessMap = null; m.roughness = 0.88; m.needsUpdate = true; } }
    function buildTrees() {
      for (const T0 of TREES) stand(T0.key, T0.x, 0, T0.z, T0.ry, { h: T0.h, lift: 1, done: (m) => m.traverse(q => { if (q.isMesh) leafMatte(q.material); }) });
      const R = 64, Hh = 20;
      const g = new THREE.CylinderGeometry(R, R, Hh, 56, 1, true);
      const uv = g.attributes.uv; for (let k = 0; k < uv.count; k++) uv.setX(k, uv.getX(k) * 5);
      const mRing = B({ color: SURF.treeline[0], alphaTest: 0.5, side: THREE.BackSide, fog: true, transparent: false });
      surfLoad('treeline').then(t0 => { if (!t0 || !alive) return; const t = t0.clone(); t.needsUpdate = true; madeTex.push(t);
        t.wrapS = THREE.RepeatWrapping; t.wrapT = THREE.ClampToEdgeWrapping; t.repeat.set(1, -1); t.offset.set(0, 1); mRing.map = t; mRing.color.set(0xd8dcd4); mRing.needsUpdate = true; });
      const ring = new THREE.Mesh(g, mRing); ring.position.y = Hh / 2 - 1.2; ring.renderOrder = -5; world.add(ring); owned.push(ring);
      stageList.ring = ring;
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
      /* (and a few at the way in, carried there on people's feet: what his eyes open on. Its own field and its own seed,
         so the field above is the scatter it was) */
      petalField(LOW ? 170 : 300, 5103, around(DATA.spawn.x, 10.6, 2.6), dayOne);
      /* day two: yesterday's petals everywhere, trodden into the turf */
      petalField(LOW ? 6500 : 11000, 5102, mix((rnd) => [TURF.x0 + rnd() * (TURF.x1 - TURF.x0), TURF.z0 + rnd() * (TURF.z1 - TURF.z0)],
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

    /* ================================================================ THE SKY: CLOUDS, THE SUN'S GLARE, RAYS (v26.1)
       Chad, 12 Nov 2026: "I think the overall environment can be improved further with much more details ... and i think
       the skybox can be added and improved with much better detail, especially adding clouds, sun, rays, etc." The
       engine's sky is a gradient dome with its sun disc and a thin layer of cloud; over it now, painted (v15.1: no lamp):
       1. CLOUDS: photographic cards (GPT Image at its best, a transparent ground: masters/v26.1/env/refs, looked at over a
          blue before use) stood round the horizon above the line of the trees, each turned to face the middle of the
          ground: a long low bank of fair-weather cumulus in four places, tall and flat ones higher between them, a cluster
          of small ones, and wisps of cirrus higher still. A cloud lit from its upper right is turned round where the sun
          stands on the left of it, so every cloud is lit from the sun's side;
       2. THE SUN'S GLARE: a soft halo and a bright core where the hour's key light comes from, drawn additively and hidden
          by whatever stands before it;
       3. RAYS: shafts of light slanting down through the crowns of the two great trees along the sun's line, each turned
          about its own length to face the lens, breathing a little as leaves move.
       All of it follows the hour (the look, d_play.js `look`, y_stage.js `lit`): white at the late morning, warm at dawn,
       rose at dusk; no rays in the flat light of ending D or after the sun is down; nothing at night or indoors. The sky
       stands where the stage's sky stands (`skyAt`: a film's pocket set has its own). Its far side is inside the far plane
       (160 m) from anywhere on the ground. */
    Object.assign(SURF, { cloudbank: [0xffffff, 'image/webp'], cloudtall: [0xffffff, 'image/webp'], cloudflat: [0xffffff, 'image/webp'],
                          cloudthree: [0xffffff, 'image/webp'], cirrus: [0xffffff, 'image/webp'] });
    const SKY_R = 110;
    /* each card: its azimuth (degrees from north, toward the east), the elevation of its middle and its width (degrees, as
       seen from the middle of the ground), its picture and that picture's height for its width */
    const SKY_CARDS = [
      { az: 15, el: 17, w: 70, key: 'cloudbank', hw: 878 / 2048 }, { az: 105, el: 16, w: 66, key: 'cloudbank', hw: 878 / 2048 },
      { az: 196, el: 17.5, w: 72, key: 'cloudbank', hw: 878 / 2048 }, { az: 287, el: 16.5, w: 68, key: 'cloudbank', hw: 878 / 2048 },
      { az: 62, el: 25, w: 30, key: 'cloudtall', hw: 764 / 1024 }, { az: 248, el: 26, w: 32, key: 'cloudtall', hw: 764 / 1024 },
      { az: 160, el: 29, w: 38, key: 'cloudflat', hw: 579 / 1024 }, { az: 334, el: 28, w: 36, key: 'cloudflat', hw: 579 / 1024 },
      { az: 136, el: 22, w: 22, key: 'cloudthree', hw: 764 / 1024 }, { az: 302, el: 21, w: 24, key: 'cloudthree', hw: 764 / 1024 },
      { az: 38, el: 40, w: 60, key: 'cirrus', hw: 579 / 1024 }, { az: 214, el: 42, w: 58, key: 'cirrus', hw: 579 / 1024 }
    ];
    /* the hour's sky: the clouds' colour and strength, the glare's colour and strength, the rays' strength */
    const SKY_LOOK = {
      DAY1: { cloud: [1, 1, 1, 1], sun: [1, 0.95, 0.84, 1], rays: 0.15 },
      DAWN: { cloud: [1, 0.87, 0.76, 0.95], sun: [1, 0.76, 0.46, 1], rays: 0.17 },
      OPENED: { cloud: [1, 0.9, 0.8, 1], sun: [1, 0.82, 0.55, 1], rays: 0.19 },
      SHUT: { cloud: [0.82, 0.84, 0.88, 0.9], sun: null, rays: 0 },
      AFTERNOON: { cloud: [1, 0.95, 0.86, 1], sun: [1, 0.88, 0.66, 1], rays: 0.13 },
      DUSK: { cloud: [0.96, 0.64, 0.52, 0.85], sun: [1, 0.55, 0.3, 0.75], rays: 0 },
      DUSKOPEN: { cloud: [1, 0.7, 0.56, 0.9], sun: [1, 0.6, 0.34, 0.85], rays: 0 }
    };
    const skyFx = { g: new THREE.Group(), drift: new THREE.Group(), cards: [], halo: null, core: null, burst: null, rays: [], rayMat: null, look: '', dir: new THREE.Vector3(0, 1, 0) };
    /* (v26.8, Chad, 13 Nov 2026: "Have the clouds or sky box move slowly like clouds drifting, without affecting the tree
       background") THE CLOUDS DRIFT: the cards alone turn about the ground's middle, a tenth of a degree a second (a bank
       crosses its own width in about twelve minutes; watched for ten seconds, one degree: a cloud on the move, not one
       sliding). The sun, its glare and rays, the sky's gradient and the ring of trees stand still. On the wind's clock,
       wall time, as the leaves and the rays are (a film cut never moves them) */
    const DRIFT = 0.1 * Math.PI / 180;
    /* the sun's own rays: thin streaks of light out from its core, of seeded lengths and strengths, each soft along its
       length and across it (a picture drawn once; it turns very slowly, so the streaks are never quite still) */
    function makeSunBurst() {
      const N = 512, [c, x] = cnv(N); x.clearRect(0, 0, N, N); x.globalCompositeOperation = 'lighter';
      const rnd = rng(5309), cx = N / 2;
      for (let i = 0; i < 26; i++) {
        const a = (i / 26) * 6.283 + (rnd() - 0.5) * 0.18, len = cx * (0.45 + 0.55 * rnd()), wd = 0.010 + 0.022 * rnd(), k = 0.25 + 0.75 * rnd();
        x.save(); x.translate(cx, cx); x.rotate(a);
        const g = x.createLinearGradient(0, 0, len, 0); g.addColorStop(0, `rgba(255,250,235,${(0.55 * k).toFixed(3)})`); g.addColorStop(0.35, `rgba(255,246,225,${(0.22 * k).toFixed(3)})`); g.addColorStop(1, 'rgba(255,240,215,0)');
        x.fillStyle = g; x.beginPath(); x.moveTo(0, 0); x.lineTo(len, -len * wd); x.lineTo(len, len * wd); x.closePath(); x.fill(); x.restore();
      }
      return tex(done(THREE, c, false));
    }
    function makeRay() {
      const [c, x] = cnv(64, 256); x.clearRect(0, 0, 64, 256);
      const img = x.createImageData(64, 256), rnd = rng(9137), streak = [];
      for (let i = 0; i < 64; i++) streak.push(0.75 + 0.25 * rnd());
      for (let v = 0; v < 256; v++) for (let u = 0; u < 64; u++) {
        const k = v / 255, across = (u - 31.5) / 31.5, side = Math.exp(-across * across * 3.2), along = Math.pow(1 - k, 1.6) * c01(k / 0.08);
        const a = 255 * side * along * streak[u], o = (v * 64 + u) * 4; img.data[o] = img.data[o + 1] = img.data[o + 2] = 255; img.data[o + 3] = a; }
      x.putImageData(img, 0, 0);
      return tex(done(THREE, c, false));
    }
    function buildSky() {
      skyFx.g.name = 'v26.1 sky'; world.add(skyFx.g); owned.push(skyFx.g); skyFx.drift.name = 'v26.8 drifting clouds'; skyFx.g.add(skyFx.drift);
      const d2r = Math.PI / 180, sunAz = Math.atan2(17, -10);                   // (DAY1's key, east-south-east: which side a card is lit from)
      for (const C of SKY_CARDS) {
        const az = C.az * d2r, w = 2 * SKY_R * Math.tan(C.w * d2r / 2), h = w * C.hw;
        const m = B({ color: 0xffffff, transparent: true, depthWrite: false, fog: false, opacity: 0 });
        const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), m);
        mesh.position.set(Math.sin(az) * SKY_R, 1.6 + Math.tan(C.el * d2r) * SKY_R, -Math.cos(az) * SKY_R);
        mesh.lookAt(0, mesh.position.y, 0); mesh.renderOrder = -4; mesh.frustumCulled = false; skyFx.drift.add(mesh);
        /* (lit from its upper right in its picture: turned round where the sun is to the left of it as it is looked at) */
        const flip = Math.sin(sunAz - az) < 0;
        surfLoad(C.key).then(t0 => { if (!t0 || !alive) return; const t = t0.clone(); t.needsUpdate = true; madeTex.push(t);
          t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping; t.repeat.set(flip ? -1 : 1, -1); t.offset.set(flip ? 1 : 0, 1); m.map = t; m.needsUpdate = true; C.ready = true; });
        skyFx.cards.push({ mesh, m, C });
      }
      const glow = tex(makeGlow(THREE, cnv));
      const sm = (s) => { const m = new THREE.SpriteMaterial({ map: glow, color: 0xffffff, transparent: true, depthWrite: false, fog: false, blending: THREE.AdditiveBlending, opacity: 0 }); mats.push(m);
        const sp = new THREE.Sprite(m); sp.scale.set(s, s, 1); sp.renderOrder = -3; sp.frustumCulled = false; skyFx.g.add(sp); return sp; };
      skyFx.halo = sm(SKY_R * 0.62); skyFx.core = sm(SKY_R * 0.14);
      { const m = new THREE.SpriteMaterial({ map: makeSunBurst(), color: 0xffffff, transparent: true, depthWrite: false, fog: false, blending: THREE.AdditiveBlending, opacity: 0 }); mats.push(m);
        const sp = new THREE.Sprite(m); sp.scale.set(SKY_R * 0.95, SKY_R * 0.95, 1); sp.renderOrder = -3; sp.frustumCulled = false; skyFx.g.add(sp); skyFx.burst = sp; }
      /* the rays: under the two great trees' crowns (b_world2.js TREES: the rain tree west of the turf, the mango behind
         the chief canopy), each from a place in the crown, seeded */
      skyFx.rayMat = B({ map: makeRay(), color: 0xfff1d6, transparent: true, depthWrite: false, fog: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, opacity: 0 });
      const rnd = rng(4129), g0 = new THREE.PlaneGeometry(1, 1); g0.translate(0, -0.5, 0);
      for (const [T0, n] of [[TREES[0], 10], [TREES[1], 6]]) for (let i = 0; i < n; i++) {
        const an = rnd() * 6.283, r = T0.h * (0.12 + 0.3 * Math.sqrt(rnd())), y = T0.h * (0.55 + 0.22 * rnd());
        const mesh = new THREE.Mesh(g0, skyFx.rayMat); mesh.frustumCulled = false; mesh.renderOrder = 3; world.add(mesh); owned.push(mesh);
        skyFx.rays.push({ mesh, at: new THREE.Vector3(T0.x + Math.cos(an) * r, y, T0.z + Math.sin(an) * r), w: 0.3 + 0.6 * rnd(), ph: rnd() * 6.283, f: 0.35 + 0.5 * rnd() });
      }
    }
    const _skC = new THREE.Vector3(), _skX = new THREE.Vector3(), _skV = new THREE.Vector3(), _skZ = new THREE.Vector3(), _skM = new THREE.Matrix4();
    /* every frame, in play and in a film (d_play.js updateNotes): where the sky stands, the hour's colours when the hour
       changes, and the rays turned to the lens */
    function skyTick(t) {
      const at = FL.sky; skyFx.g.position.set(at ? at.x : 0, 0, at ? at.z : 0);
      const L = SKY_LOOK[lookName] || null;
      if (skyFx.look !== lookName) {
        skyFx.look = lookName;
        const P0 = PRESETS[lookName], k = P0 && P0.key; if (k) skyFx.dir.set(k[2], k[3], k[4]).normalize();
        for (const c of skyFx.cards) { c.m.visible = !!L; if (L) { c.m.color.setRGB(L.cloud[0], L.cloud[1], L.cloud[2]); c.m.opacity = L.cloud[3]; } }
        for (const s of [skyFx.halo, skyFx.core, skyFx.burst]) { s.visible = !!(L && L.sun); if (L && L.sun) { s.material.color.setRGB(L.sun[0], L.sun[1], L.sun[2]); s.position.copy(skyFx.dir).multiplyScalar(SKY_R * 0.98); } }
        skyFx.halo.material.opacity = L && L.sun ? 0.42 * L.sun[3] : 0; skyFx.core.material.opacity = L && L.sun ? 0.9 * L.sun[3] : 0;
        skyFx.burst.material.opacity = L && L.sun ? 0.5 * L.sun[3] : 0;
        skyFx.rayMat.opacity = L ? L.rays : 0;
        for (const r of skyFx.rays) r.mesh.visible = !!(L && L.rays > 0 && skyFx.dir.y > 0.12);
      }
      if (skyFx.burst.visible) skyFx.burst.material.rotation = t * 0.012;
      skyFx.drift.rotation.y = -t * DRIFT;
      if (!(L && L.rays > 0 && skyFx.dir.y > 0.12)) return;
      camera.getWorldPosition(_skC);
      const d = skyFx.dir;
      /* (light scattered out of a shaft is seen most looking toward the light and hardly at all looking away: in the first
         photographs a shaft seen with the sun behind him lay across the grey wall as a pale smear) */
      camera.getWorldDirection(_skV); const toward = c01((_skV.dot(d) - 0.25) / 0.6);
      skyFx.rayMat.opacity = L.rays * toward * toward * (3 - 2 * toward);
      for (const r of skyFx.rays) {
        const len = Math.min(16, (r.at.y - 0.05) / d.y);
        _skV.copy(_skC).sub(r.at); _skX.crossVectors(d, _skV); if (_skX.lengthSq() < 1e-8) continue; _skX.normalize(); _skZ.crossVectors(_skX, d);
        _skM.makeBasis(_skX, d, _skZ); r.mesh.quaternion.setFromRotationMatrix(_skM);
        const breathe = 0.72 + 0.28 * Math.sin(t * r.f + r.ph);
        r.mesh.position.copy(r.at); r.mesh.scale.set(r.w * breathe, len, 1);
      }
    }
    buildSky();

    /* ================================================================ THE GROUND'S EDGES FILLED, ITS BUILDINGS FINISHED (v26.1)
       Chad, 12 Nov 2026: "i can find many empty spaces at the peripheral background, and the side buildings all have very
       basic and simple details ... Add more trees, fill out empty spaces, improve the overall environment much further."
       His photograph 10 is a ground ringed by big trees, tin roofs and houses, and from the middle of the game's ground the
       bare earth ran out to the painted ring of trees 64 m away on every side. Now:
       1. GROVES: the trees of this country stood round the ground between 16 and 45 m out, each kind one InstancedMesh a
          part (manyOf): his coconut palms and his banana (reuseInEpisode), the episode's rain tree and mango, a second
          banana and a frangipani made for this chapter (a checked picture on white, then Meshy at its highest settings:
          masters/v26.1/env);
       2. a stilt house of the district out past the way in, its water tank and a motorbike by it; a motorbike and a tank at
          the way in; the compressors of the grey building's cooling on its wall;
       3. THE GREY BUILDING as his photographs 5 and 6 show it: rendered walls with their weather streaks (a picture made
          for it: masters/v26.1/env/refs/render.png, made seamless), the louvred windows in dark frames on concrete sills,
          a plinth, a deep eave in shadow, a dark tin roof with its gable, a fascia, a gutter and its downpipe;
       4. THE RED HOUSE east of the turf finished: its back slope and both gables, a soffit and a fascia under the eave,
          trims, and its windows given open shutters and curtains; the red plank building behind the chief canopy and the
          white building behind the west tents given windows of their own.
       Nothing here stands on ground he can walk (stage.keepIn), so nothing here needs a blocker. */
    const R26 = rng(2611), turn26 = () => R26() * 6.283;
    /* [x, z, height in metres] (east, south). (v26.2 debug: placed again so no crown passes through another, a building,
       the power lines or a pole: Chad's picture of a palm growing up through a rain tree beyond the shed, 13 Nov 2026.
       Each is the nearest place to where it stood that clears all of them at every height: masters/v26.2/trees) */
    const GROVES = {
      /* (his palms at their full level within 32 m of the middle, where the light level's fronds came out soft against
         the sky in the first photographs; at the light level beyond) */
      e4palm1: [[-31.15, -14.45, 13], [-26.2, 15.2, 14.5], [20.95, 11.1, 14], [11, 29.25, 14], [12.25, 37.5, 13]],
      e4palm1far: [[-38.25, -4, 15], [-8.6, -35.2, 14], [9.9, -27.85, 12], [-26.15, 34.75, 13], [-16.7, 23.5, 12]],
      e4palm2: [[-16.4, -17.4, 12.5], [33.95, -12.7, 13.5], [27.9, 14.9, 12.5], [7.15, 22.45, 12], [-8.25, 23.85, 12.5]],
      e4palm2far: [[-35.2, -21.2, 13.5], [5.8, -37.8, 13], [-16, 31, 12.5]],
      e4banana: [[-19.6, -3.8, 4.2], [-19.25, 9.3, 3.8], [-21, 12, 4.4], [-24, -6, 4], [18.25, -11, 4], [16.2, 14.95, 4], [-0.9, 21, 3.8], [-12.35, 21.85, 4.2]],
      w3banana2: [[-20.05, 2.1, 3.6], [-22.5, 7, 3.4], [-26, -1, 3.8], [24, 3, 3.6], [-0.4, 25.5, 3.4], [-26.5, 19.5, 3.8]],
      e4raintree: [[-41.45, 11.65, 12], [-24, -27, 11], [19, -39.5, 12], [34.5, 2, 13], [-3, 36, 12]],
      e4mango: [[-33.55, 25.45, 9], [-2, -42, 10], [32.05, -29.85, 9.5], [22.5, 24, 9]],
      w3frangipani: [[-4.75, 22.3, 4.4], [3.3, 22.55, 4.6], [14.15, -10.3, 4.2]]
    };
    /* a grove: every copy fitted to its height by the file's own height, its foot on the ground, turned its own seeded way;
       the lift a tree standing alone is given (stand: lift 1) */
    function grove(key, list) {
      if (!list.length) return;
      if (!have(key)) { waiting.add(key); return; }
      const turns = list.map(() => turn26());
      parseOnce(key).then(({ scene: src }) => {
        if (!alive) return;
        src.updateMatrixWorld(true);
        const bb = new THREE.Box3().setFromObject(src), H0 = Math.max(1e-3, bb.max.y - bb.min.y);
        manyOf(key, list.map(([x, z, h], i) => { const s = h / H0; return { x, y: -bb.min.y * s, z, ry: turns[i], s }; }), world, 1,
          (made) => { for (const im of made) { bronzeLift(im, 1); if (/^e4(raintree|mango)/.test(key)) leafMatte(im.material); } });
      }).catch(err => { console.warn(key + ' failed to load', err); if (ctx.loadFail) ctx.loadFail(key, err); });
    }
    /* the things by the houses: [key, x, y, z, turn] (a turn of 0 faces the model's own front to the south, +z; the
       compressors' wall plates are behind them, so turned round they hang on the grey wall, 0.3 m up on their brackets;
       v26.2 debug: 3 cm further out, their backs had sunk into the wall's plinth: measured, tools/probes/clipscan.mjs) */
    const EDGE_THINGS = [
      ['w3isanhouse', -24, 0, 26.5, Math.atan2(24, -26.5)],          // its front toward the middle of the ground
      ['w3tank', -19.4, 0, 24.2, 0.6], ['w3scooter', -20.6, 0, 21.4, 2.2],
      ['w3tank', -7.3, 0, 15.6, -1.2], ['w3scooter', -7.9, 0, 13.9, 1.25],
      ['w3aircon', 3.0, 0.3, GREY.z - 0.24, Math.PI], ['w3aircon', -4.75, 0.3, GREY.z - 0.24, Math.PI]
    ];
    /* a cloth hung inside a window: soft folds down it, a little lighter at its hem (one picture, every curtain) */
    function makeCurtain() {
      const [c, x] = cnv(64, 128); const g = x.createLinearGradient(0, 0, 64, 0);
      for (let i = 0; i <= 8; i++) { const k = i / 8, f = 0.5 + 0.5 * Math.cos(k * Math.PI * 6); g.addColorStop(k, `rgb(${Math.round(196 + 44 * f)},${Math.round(200 + 40 * f)},${Math.round(204 + 38 * f)})`); }
      x.fillStyle = g; x.fillRect(0, 0, 64, 128);
      x.fillStyle = 'rgba(255,255,255,0.18)'; x.fillRect(0, 116, 64, 12);
      /* (one curtain is about 0.3 m by 1.1 m, and a quad's UVs are metres: the picture spread over one) */
      const t = tex(done(THREE, c, false)); t.wrapS = THREE.RepeatWrapping; t.repeat.set(1 / 0.3, 1 / 1.1); return t;
    }
    /* the shadow a deep eave lays on the wall under it: darkest under the eave, gone 0.8 m down */
    function makeEaveShade() {
      const [c, x] = cnv(4, 64); const g = x.createLinearGradient(0, 0, 0, 64);
      g.addColorStop(0, 'rgba(18,16,14,0.55)'); g.addColorStop(0.45, 'rgba(18,16,14,0.22)'); g.addColorStop(1, 'rgba(18,16,14,0)');
      x.fillStyle = g; x.fillRect(0, 0, 4, 64);
      return tex(done(THREE, c, false));
    }
    function buildEdges() {
      for (const key of Object.keys(GROVES)) grove(key, GROVES[key]);
      /* (the tank's steel came from the generator fully metal: with nothing round it to reflect it drew black (v11.3). It is
         read as a brushed steel's paint here, its own silver showing, the v25.5 law applied where it is drawn) */
      const steel = (m) => m.traverse(q => { if (q.isMesh) for (const mt of [].concat(q.material)) if ('metalness' in mt) { mt.metalness = 0.35; mt.roughness = 0.55; mt.needsUpdate = true; } });
      for (const [key, x, y, z, ry] of EDGE_THINGS) stand(key, x, y, z, ry, { lift: 1, done: key === 'w3tank' ? steel : null });
      const mAlu = M({ color: 0x4a4f53, roughness: 0.55, metalness: 0.35 }), mSill = M({ color: 0xd2d0c8, roughness: 0.9 });
      const mPlinth = surf('render', { tile: 3, roughness: 0.95, tint: 0x8f8f8a }), mRender = surf('render', { tile: 3, roughness: 0.95 });
      const mTinBrown = surf('tin', { tile: 1.8, roughness: 0.7, side: THREE.DoubleSide, tint: 0x7a5546 });
      const mCurtain = M({ map: makeCurtain(), roughness: 0.9 }), mCurtainRose = M({ map: mCurtain.map, color: 0xf1c9c4, roughness: 0.9 });
      const mSoffit = M({ color: 0xe8e2d4, roughness: 0.9, side: THREE.DoubleSide });
      /* ---- 3. THE GREY BUILDING: its front faces north (the turf), its face at z = GREY.z */
      const zf = GREY.z, gx0 = GREY.x0 - 6, gx1 = GREY.x1;
      for (const x of [6.6, 4.2, 1.8, -0.6, -3.0]) {
        const w = 1.1, h = 1.3, y = 1.95, fr = 0.055, pd = 0.045;
        box(mAlu, x, y + h / 2 + fr / 2, zf - pd / 2, w + 2 * fr, fr, pd); box(mAlu, x, y - h / 2 - fr / 2, zf - pd / 2, w + 2 * fr, fr, pd);
        box(mAlu, x - w / 2 - fr / 2, y, zf - pd / 2, fr, h, pd); box(mAlu, x + w / 2 + fr / 2, y, zf - pd / 2, fr, h, pd);
        box(mAlu, x, y, zf - 0.02, 0.04, h, 0.03);
        box(mSill, x, y - h / 2 - fr - 0.035, zf - 0.075, w + 0.28, 0.07, 0.15);
        box(mRender, x, y + h / 2 + fr + 0.08, zf - 0.012, w + 0.34, 0.14, 0.024);
      }
      box(mPlinth, (gx0 + gx1) / 2, 0.23, zf - 0.016, gx1 - gx0, 0.46, 0.032);
      box(mPlinth, gx0 - 0.016, 0.23, zf + 3, 0.032, 0.46, 6);
      /* its roof: a gable along its length, the north slope over the turf, the eave 0.9 m out */
      const eY = 4.22, rY = 5.95, eZ = zf - 0.9, rZ = zf + 3, bZ = zf + 6.9, rx0 = gx0 - 0.6, rx1 = gx1 + 0.1;
      quad(mTinBrown, [rx1, eY, eZ], [rx0, eY, eZ], [rx0, rY, rZ], [rx1, rY, rZ]);
      quad(mTinBrown, [rx0, eY, bZ], [rx1, eY, bZ], [rx1, rY, rZ], [rx0, rY, rZ]);
      /* its gable ends and its back, the gables up under the roof's own line (4.58 m where the slopes cross the walls) */
      planar(mRender, [[gx0, GREY.h, zf], [gx0, GREY.h, zf + 6], [gx0, 4.58, zf + 6], [gx0, rY - 0.04, rZ], [gx0, 4.58, zf]]);
      planar(mRender, [[gx1, GREY.h, zf + 6], [gx1, GREY.h, zf], [gx1, 4.58, zf], [gx1, rY - 0.04, rZ], [gx1, 4.58, zf + 6]]);
      wall(mRender, gx1, zf + 6, gx1, zf, 0, GREY.h); wall(mRender, gx0, zf + 6, gx1, zf + 6, 0, GREY.h);
      quad(mSoffit, [rx0, eY - 0.06, eZ + 0.02], [rx1, eY - 0.06, eZ + 0.02], [rx1, GREY.h - 0.02, zf - 0.005], [rx0, GREY.h - 0.02, zf - 0.005]);
      box(mWhite, (rx0 + rx1) / 2, eY - 0.08, eZ - 0.02, rx1 - rx0, 0.2, 0.04);
      bar(mAlu, [rx0 + 0.1, eY - 0.2, eZ - 0.09], [rx1, eY - 0.2, eZ - 0.09], 0.055, 8);
      bar(mAlu, [gx0 + 0.25, eY - 0.22, eZ - 0.09], [gx0 + 0.25, eY - 0.6, zf - 0.07], 0.04, 6);
      post(mAlu, gx0 + 0.25, zf - 0.07, 0.04, 0.05, eY - 0.6, 6);
      /* the shadow of that eave on the wall */
      const shadeM = B({ map: makeEaveShade(), transparent: true, depthWrite: false, fog: true });
      const shM = new THREE.Mesh(new THREE.PlaneGeometry(gx1 - gx0, 0.85), shadeM);
      shM.position.set((gx0 + gx1) / 2, GREY.h - 0.425, zf - 0.006); shM.rotation.y = Math.PI; shM.renderOrder = 1; world.add(shM); owned.push(shM);
      /* ---- 4. THE RED HOUSE east of the turf (it faces west, its face at x = HOUSE.x) */
      const Hh = HOUSE, xf = Hh.x, zA = Hh.z0 - 0.6, zB = Hh.z1 + 0.6, ridgeX = Hh.x + 4.5;
      quad(mTin, [ridgeX, Hh.h, zA], [ridgeX, Hh.h, zB], [Hh.x + 9.8, Hh.h - 1.55, zB], [Hh.x + 9.8, Hh.h - 1.55, zA]);
      tri(mRedPlank, [Hh.x + 9, Hh.h - 1.4, Hh.z0], [Hh.x, Hh.h - 1.4, Hh.z0], [ridgeX, Hh.h - 0.06, Hh.z0]);
      tri(mRedPlank, [Hh.x, Hh.h - 1.4, Hh.z1], [Hh.x + 9, Hh.h - 1.4, Hh.z1], [ridgeX, Hh.h - 0.06, Hh.z1]);
      wall(mRedPlank, Hh.x + 9, Hh.z1, Hh.x + 9, Hh.z0, 0, Hh.h - 1.4);
      quad(mSoffit, [Hh.x - 0.78, Hh.h - 1.6, zB], [Hh.x - 0.78, Hh.h - 1.6, zA], [Hh.x, Hh.h - 1.4, zA], [Hh.x, Hh.h - 1.4, zB]);
      box(mWhite, Hh.x - 0.8, Hh.h - 1.64, (zA + zB) / 2, 0.04, 0.2, zB - zA);
      box(mWhite, xf - 0.022, 0.72, (Hh.z0 + Hh.z1) / 2, 0.03, 0.08, Hh.z1 - Hh.z0);
      for (const z of [Hh.z0 + 0.07, Hh.z1 - 0.07]) box(mWhite, xf - 0.022, (0.7 + Hh.h - 1.4) / 2, z, 0.03, Hh.h - 2.1, 0.14);
      for (const [i, z] of [-4.5, -1.5, 1.5, 4.2].entries()) {
        /* two shutters of red planks in white frames, swung open flat against the planks beside the window */
        for (const s of [-1, 1]) {
          const cz = z + s * 0.83;
          box(mRedPlank, xf - 0.05, 2.05, cz, 0.03, 1.08, 0.48);
          for (const dz of [-0.225, 0.225]) box(mWhite, xf - 0.068, 2.05, cz + dz, 0.012, 1.08, 0.035);
          for (const dy of [-0.52, 0.52]) box(mWhite, xf - 0.068, 2.05 + dy, cz, 0.012, 0.04, 0.48);
        }
        /* curtains drawn to each side inside */
        for (const s of [-1, 1]) {
          const m = i % 2 ? mCurtainRose : mCurtain, cz = z + s * 0.33;
          quad(m, [xf - 0.016, 1.52, cz - 0.15], [xf - 0.016, 1.52, cz + 0.15], [xf - 0.016, 2.58, cz + 0.15], [xf - 0.016, 2.58, cz - 0.15]);
        }
      }
      /* the red plank building behind the chief canopy: its window's curtains, the fascia of its eave */
      const P0 = PLANK;
      for (const s of [-1, 1]) quad(mCurtain, [10.8 + s * 0.36 + 0.14, 1.27, P0.z - 0.016], [10.8 + s * 0.36 - 0.14, 1.27, P0.z - 0.016], [10.8 + s * 0.36 - 0.14, 2.43, P0.z - 0.016], [10.8 + s * 0.36 + 0.14, 2.43, P0.z - 0.016]);
      box(mWhite, (P0.x0 - 0.4 + P0.x1 + 2) / 2, 3.47, P0.z - 0.72, P0.x1 + 2 - (P0.x0 - 0.4), 0.17, 0.04);
      /* the white building behind the west tents (photograph 10): its windows, dark glass in black frames */
      const mBlack = M({ color: 0x1b1c1d, roughness: 0.6 }), mGlass = M({ color: 0x23292c, roughness: 0.15, metalness: 0.6 });
      for (const z of [-3.6, 1.9, 7.2]) {
        wall(mGlass, -12.365, z + 0.55, -12.365, z - 0.55, 1.22, 2.12);
        box(mBlack, -12.35, 2.15, z, 0.04, 0.05, 1.2); box(mBlack, -12.35, 1.19, z, 0.04, 0.05, 1.2);
        for (const dz of [-0.575, 0, 0.575]) box(mBlack, -12.35, 1.67, z + dz, 0.04, 0.92, 0.045);
      }
      flush();
    }
    buildEdges();
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
    const NOMIP = /^e4/;
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
    function sheetOf(key, t) {
      if (t.name === 'repainted' || (t.name === 'detail' && NOMIP.test(key))) { t.generateMipmaps = true; t.minFilter = THREE.LinearMipmapLinearFilter; t.anisotropy = 4; t.needsUpdate = true; return t; }
      return NOMIP.test(key) ? noMip(THREE, t) : t;
    }
    /* (the children's runs and their skip too: c_crowd.js) */
    const WALKS = /^(walkdance|Run_02|Run_03)$/;                                 // (the takes that travel: the dancers' walk-dance, the children's two runs)
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
    function mkPerson(key, x, z, ry, o = {}) {
      const P = { key, o, group: new THREE.Group(), ready: false, acts: {}, w: {}, off: {}, offY: {}, cur: o.take || 'Idle_3', fade: 0.4, win: o.win || null,
                  mixer: null, model: null, head: null, hips: null, bone: {}, lv: [null, null, null, null], lvNow: -1, force: null, members: [],
                  hidden: !!o.hidden, driver: !!o.driver, filmT: null, rate: o.rate || 1, phase: o.phase || 0, clock: (o.phase || 0) * 10, then: [],
                  span: null, gaze: null, gazeK: 0, rest: { take: o.take || 'Idle_3', win: o.win ? Object.assign({}, o.win) : null }, talkTake: o.talk || null, actN: 0 };
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
            for (let i = 0; i < pos.count; i++) { q.getVertexPosition(i, _pv); _pv.applyMatrix4(q.matrixWorld); P.group.worldToLocal(_pv); ys.push(_pv.y);
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
    function fullOff(P) {
      if (!P || !P.o.fullFilm || !P.lv[0]) return;
      const near = new Set(); for (const q of P.lv[1] || []) for (const mt of [].concat(q.material)) near.add(mt);
      for (const m of P.lv[0]) { P.model.remove(m); m.geometry.dispose();
        for (const mt of [].concat(m.material)) if (!near.has(mt)) for (const k in mt) { const v = mt[k]; if (v && v.isTexture) v.dispose(); } }
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
      const lowOf = (list) => { let m = Infinity; const mats = new Map();
        for (const [k, i] of list) { const q = skins[k]; if (!q) continue; let M = mats.get(q); if (!M) { M = new THREE.Matrix4().multiplyMatrices(_grI, q.matrixWorld); mats.set(q, M); }
          q.getVertexPosition(i, _grV); _grV.applyMatrix4(M); if (_grV.y < m) m = _grV.y; } return m; };
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
        for (const [k, j] of PTS.foot) { const q = skins[k]; if (!q) continue; _grM.multiplyMatrices(_grI, q.matrixWorld); q.getVertexPosition(j, _grV); _grV.applyMatrix4(_grM); if (_grV.y < m) m = _grV.y; }
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
      H.bones.forEach((b, j) => { _hdQ.copy(b.quaternion); b.quaternion.copy(M[j]).slerp(_hdQ, kk); });
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
    function put(P, x, z, ry, y = 0) { if (!P) return; P.group.position.set(x, y, z); if (ry != null) P.group.rotation.y = ry; }
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
      if (!a.curled) { for (const F of a.fing) F.q.copy(F.b.quaternion); a.fingRest = a.thumb.map(F => ({ b: F.b, q: F.b.quaternion.clone(), i: F.i })); a.curled = true; }
      for (const F of a.fing.concat(a.thumb)) { if (!F.qb) F.qb = bindLocal(P, F.b) || F.b.quaternion.clone(); F.b.quaternion.copy(F.qb); }
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
        for (let i = 0; i < pos.count; i++) { const w = { U: 0, Left: 0, Right: 0 }; for (let c = 0; c < 4; c++) { const r = role[si.getComponent(i, c)]; if (r) w[r] += sw.getComponent(i, c); }
          if (w.U < 0.5 && w.Left < 0.5 && w.Right < 0.5) continue; q.getVertexPosition(i, v); v.applyMatrix4(q.matrixWorld); P.group.worldToLocal(v);
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
    const _slA = new THREE.Vector3(), _slB = new THREE.Vector3(), _slQ = new THREE.Quaternion();
    const _slQ1 = new THREE.Quaternion(), _slQ2 = new THREE.Quaternion(), _slQ3 = new THREE.Quaternion(), _slQ4 = new THREE.Quaternion(), _slQd = new THREE.Quaternion(), _slQp = new THREE.Quaternion();
    /* (how far he wears a take that SITS, by the takes' weights: a seated man's legs are laid only while he sits. In the
       late afternoon's photograph the masters stand in Idle_3, and laid there their feet were pinned to where they
       sit: v26.2 debug. A fade between a seat and a stand lays them that share of the way) */
    const _slT = new THREE.Quaternion();
    function seatShare(P) { const so = P.o.seat; if (!so || !so.takes) return 1 - (P.riseK || 0); let k = 0; for (const n in P.w) if (so.takes.test(n)) k += P.w[n]; return Math.min(1, k) * (1 - (P.riseK || 0)); }
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
        for (let i = 0; i < pos.count; i++) { let a = 0; for (let c = 0; c < 4; c++) if (arm[si.getComponent(i, c)]) a += sw.getComponent(i, c); if (a > 0.3) continue;
          q.getVertexPosition(i, v); v.applyMatrix4(q.matrixWorld); P.group.worldToLocal(v);
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
      const rt = P.rest && P.rest.take, share = rt && P.w[rt] != null ? Math.min(1, P.w[rt]) : 1; if (!(share > 0.001)) return;
      P.group.updateWorldMatrix(true, true); P.group.getWorldQuaternion(_rhQ);
      for (const sd in RH.R) { const a = A[sd], r = RH.R[sd];
        if (!a.wrote) { a.qUp.copy(a.up.quaternion); a.qFore.copy(a.fore.quaternion); a.qHand.copy(a.hand.quaternion); a.wrote = true; }
        _rhA.copy(r.W); P.group.localToWorld(_rhA); _rhB.copy(r.pdir).applyQuaternion(_rhQ);
        armHinge(a, _rhA, _rhB);
        _rhC.copy(r.f).applyQuaternion(_rhQ); _rhD.copy(r.n).applyQuaternion(_rhQ);
        _ha.crossVectors(_rhD, _rhC); _hm.makeBasis(_ha, _rhD, _rhC); _hm2.makeBasis(r.aL || a.aL, r.nL || a.nL, r.fL || a.fL).transpose(); _hm.multiply(_hm2); _hq.setFromRotationMatrix(_hm);
        a.hand.parent.getWorldQuaternion(_hq2); a.hand.quaternion.copy(_hq2.invert().multiply(_hq)); a.hand.updateWorldMatrix(false, true);
        if (r.fing.length) { if (!a.fing) a.fing = []; if (!a.curled) { a.fingRest = r.fing.map(F => ({ b: F.b, q: F.b.quaternion.clone(), i: 1 })); a.curled = true; }
          for (const F of r.fing) F.b.quaternion.copy(F.q); }
        /* (part of the way, while a gesture fades in or out: each turn eased from the take's own) */
        if (share < 0.999) { for (const [b, q0] of [[a.up, a.qUp], [a.fore, a.qFore], [a.hand, a.qHand]]) { _rhT.copy(b.quaternion); b.quaternion.copy(q0).slerp(_rhT, share); }
          if (a.fingRest) for (const F of a.fingRest) { _rhT.copy(F.b.quaternion); F.b.quaternion.copy(F.q).slerp(_rhT, share); }
          a.up.updateWorldMatrix(false, true); } }
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
    const cast = {};
    const SIT_E = Math.PI / 2, SIT_W = -Math.PI / 2;                            // seated facing east; facing west
    const REST = { Chair_Sit_Idle_M: [9.4, 2.85] };                             // the seated idle's upright window (it wraps its end)
    /* THE KNEEL'S WINDOW, there and back in 34 seconds (Chad, 12 Nov 2026: "The audience's facing left and right animation
       plays too fast and can be slowed down"). The take's own pace sent the head 24 cm round its look to either side and
       back in 13.6 s, at up to 11 cm a second (tools/probes/windowread.mjs on e4deva); at 34 s it is 4.4 at its fastest:
       a calm look round. Every kneeler wears it: the crowd (c_crowd.js SIT), the young man, Ton when he kneels */
    const SEIZA_WIN = [0.4, 6.8, 34];
    /* (and its look round RESTRAINED, a little: Chad, 13 Nov 2026, "slightly restrained so they are not looking so far
       left and so far right". 0.6 of the take's own turn about its middle: the face swept 54 and 61 degrees either side,
       now about 33 and 36 (headDamp, headturn.mjs). Every kneeler wears it with the window). (v26.8, Chad, 13 Nov 2026,
       evening: "the looking left and right passive animation of all the audience can further reduce the range of motion,
       as they still look very far left and very far right and abit awkward": 0.35 of it, about 19 and 21 degrees either
       side: still a look round, a calm one, not a stare ahead) */
    const SEIZA_LOOK = { seiza: [0.35] };
    const PHO_AT = benchAt(0.46, 0.04);                                          // Grandmaster Pho's place: the bench's east end
    /* each seat's top in metres, MEASURED on its model (tools/probes/seatmeasure.mjs: the sofa's cushion 0.46 and sat
       into by 3 cm; the bench's slats 0.40 and the chair's seat 0.39, each at the size b_world2.js draws it) */
    /* (v26.2 debug: the bench made again, its first seat's slats having come back from the generator torn and wavy. Its
       frame's top is where the old slats were, 0.40 of its file, and its slats lie 4 to 5 cm inside it, 0.35: the two who
       sit on it keep their height, on the frame, their robes over the slats, so nothing they sit in moved) */
    /* (the monks' armchair is drawn at 1.11 of its file, where its seat's top is 0.42 m up: 0.466. It was written here
       as 0.43, the file's own, and the three sat four centimetres into it: measured from the chair's own mesh, 12 Nov) */
    const SEATS = { sofa: 0.43, bench: 0.44, chair: 0.466 };
    /* (v26.2 debug: THE MASTERS' FEET ON THE GROUND. Set on their seats by their hips, the sitters on the sofas and the
       bench had their soles 3 to 8.5 cm under the ground: feetscan.mjs. So they sit as the monk in the middle sits
       (o.seat.down): the bottom where it was (hipOver 0.11 with sink 0.01 puts the hip joints 0.10 over the seat, the
       height they were given), each leg solved down to the ground from there, and nobody moved forward (edge: a sofa
       and a bench are not his chair)) */
    const MASTER_DOWN = { hipOver: 0.11, sink: 0.01, sole: GROUND_SOLE, edge: -9, flat: true };
    /* (and brought forward until their shins clear the front of what they sit on, as the monks are: Chad, 13 Nov 2026, "This
       lersi is clipping into the seat", of the hermit in white in this build's own test, his shins laid down through his
       sofa's cushion and his toes out of its front. `edge` is that front's distance ahead of the sitter's spot, measured on
       the models as drawn (tools/probes/glbbox.mjs): a sofa 0.846 m deep at x -10.25, its sitters at -10.17, its cushion's
       face 2 cm inside its arms; the bench 0.712 deep, the master in white 4 cm before its middle) */
    const SOFA_DOWN = Object.assign({}, MASTER_DOWN, { edge: 0.423 - 0.08 - 0.02 }), BENCH_DOWN = Object.assign({}, MASTER_DOWN, { edge: 0.356 - 0.04 });
    function buildCast() {
      const tonAt = [TON_TABLE.x + 1.25, TON_TABLE.z + 0.35];
      /* (lodK 1.25: his full model drawn to 2.75 m, not 2.2: he is talked to from 1.9 to 2.3 m, where the lighter body's soft
         face was what was seen. In the line he stands 1.8 m from the player, inside the old reach: no new cost there) */
      /* (v26.8: his shoulders let down in his stand and his talk: shouldersLay) */
      cast.ton = mkPerson('e4ton', tonAt[0], tonAt[1], faceTo(tonAt[0], tonAt[1], DATA.spawn.x, DATA.spawn.z), { take: 'Idle_3', talk: 'Stand_and_Chat', headDamp: SEIZA_LOOK, lodK: 1.25, shoulders: { Idle_3: 1, Stand_and_Chat: 1 } });
      cast.ton.home = { x: tonAt[0], z: tonAt[1], ry: faceTo(tonAt[0], tonAt[1], DATA.spawn.x, DATA.spawn.z) };
      /* the woman at his bench stands by the low table at his right hand, turned to those who kneel (photograph 6) */
      { const [ax, az] = benchAt(1.95, 0.95), [kx, kz] = benchAt(0.3, 1.9);
        cast.aunt = mkPerson('e4bench', ax, az, faceTo(ax, az, kx, kz), { take: 'Idle_3', phase: 0.4, talk: 'Stand_and_Chat' });
        cast.aunt.home = { x: ax, z: az, ry: faceTo(ax, az, kx, kz) }; }
      /* THE YOUNG MAN WHO GOES UP at Grandmaster Pho's bench (photographs 5 and 6): the man in the group's shirt, a
         person of his own (he raises his bai sri, and goes somewhere the player cannot follow). Stood by the play, where
         his raised hands and the master's can meet on one bowl (ymPlace) */
      cast.ym = mkPerson('e4devg', PHO_AT[0], PHO_AT[1] - 1.4, 0, { take: 'seiza', centre: true, win: { seiza: SEIZA_WIN }, headDamp: SEIZA_LOOK, hidden: true, blobW: 0.95, blobD: 1.0 });
      /* (each on his sofa: its cushion's top is SEATS.sofa, his hips a little forward of the sofa's own middle) */
      const seat = (key, x, z, phase) => { const P = mkPerson(key, x, z, SIT_E, { take: 'Chair_Sit_Idle_M', centre: true, win: REST, phase, blobW: 1.0, blobD: 1.1,
        seat: { y: SEATS.sofa, takes: /^(Chair_Sit|Sitting_|handson|petals|palmover)/, down: SOFA_DOWN } }); P.home = { x, z, ry: SIT_E }; return P; };
      /* (THE BROWN HERMIT'S HANDS ON HIS LAP: Chad, 13 Nov 2026, "the brown lersi hands and arms look weird". His seated
         rest hung both arms straight down through his lap, the fingers out under the robe between his knees, as the
         monks' did before their hands were laid (o.handsOn, 'lap': palms on the thighs, elbows at his sides). The same
         rest, his; his gestures in the films are his takes', and he rests between them) */
      cast.hermitA = seat('e4hermita', -10.17, -2.2, 0.1);
      /* (v26.3: and his hands as a real man's rest on his knees, from the measure and a photograph of one: the fingers
         together, the wrist within eight degrees of straight, each finger curled down over the knee until it rests on it;
         the wrist's turn shared with the forearm, as every body's is now: handsTrue) */
      /* (his fingers are thin for his knuckles' spread, so laid over the knee they show a gap between each, whatever their
         aim (photographed, v26.3). Curled under into a loose hand further back on the thigh, they dug into the robe as if
         clutching it (photographed the same day): worse, and taken back out. What stands is the palm on the knee and the
         fingers over it, the gaps said to Chad) */
      cast.hermitA.o.handsOn = { how: 'lap', gather: 1, converge: 0.11, curl: [0.30, 0.60, 0.30], flexMax: 8 * Math.PI / 180, drape: { r: 0.008, min: 0.8, max: 1.5 } };
      cast.red = seat('e4red', -10.17, -0.95, 0.55);
      /* (v26.5: Chad, 13 Nov 2026, "Look at the fingers of the red master, its butchered". His seated rest hung his left
         hand down into his trousers, the cloth cutting the fingers off (photographed on both bodies; his joints measured
         within a real hand's ranges: the cloth, not the bones). The brown hermit's rest as it stood, solved on his body,
         set his hands at his belly with his elbows 4 to 9 cm behind his shoulders (jointscan); with the palm at his knee
         (`at` 1.0 along the thigh), as a seated man's rests (the photograph of one, v26.3), every joint of both arms
         measures within a real body's at every moment sampled. A copy each, so no man's rest is another's) */
      const kneeRest = () => { const A = cast.hermitA.o.handsOn; return Object.assign({}, A, { curl: A.curl.slice(), drape: Object.assign({}, A.drape), at: 1.0 }); };
      cast.red.o.handsOn = kneeRest();
      /* the second master in white sits at Grandmaster Pho's left on the same bench (photographs 1, 5, 6) */
      { const [wx, wz] = benchAt(-0.52, 0.04);
        cast.white = mkPerson('e4white', wx, wz, BENCH.ry, { take: 'Chair_Sit_Idle_M', centre: true, win: REST, phase: 0.8, blobW: 1.0, blobD: 1.1,
          seat: { y: SEATS.bench, takes: /^(Chair_Sit|Sitting_|handson|petals|palmover)/, down: BENCH_DOWN } }); cast.white.home = { x: wx, z: wz, ry: BENCH.ry }; }
      /* (and the master in white's: his seated rest sank his right hand into his thigh, photographed from his side; the
         same rest at his knee measures within a real body's too) */
      cast.white.o.handsOn = kneeRest();
      cast.hermitB = seat('e4hermitb', -10.17, 5.0, 0.3);
      /* (v26.6: his seated rest hung both forearms into his robe, his fingertips out of it before his knees (found
         photographing his full body, v26.5). A palm laid down on his knee wrung his wrists 56 to 77 degrees at every
         setting: his take holds his forearms rolled palm up. So his hands rest palm up on his knees, the backs of his
         hands on his robe, as a seated sage's often do. Measured (jointscan) on the running game: flat palm up at the knee,
         his right forearm turned 102 to 106 degrees, past a forearm's; each hand tipped 20 degrees onto its little
         finger's edge (palmTilt), the forearms clear, an elbow 3 to 4 cm behind his shoulder at one moment in four; the
         palm 0.16 of his thigh further on (`at` 1.16, over the front of the knee), every joint within a real body's at
         all twelve moments sampled on the running game; built, his right forearm read 100.2 degrees at one moment in
         eight, so tipped 23 degrees (0.40): within a real body's at all sixteen moments sampled) */
      /* (v26.7, set beside its reference picture (masters/v26.3/make.sh): his fingers curled as the brown hermit's are
         over a kneecap stood cupped like a beggar's, 33 to 53 degrees at their middle joints, where the picture's lie
         gently curved; his thumbs stood up off his palms; his left wrist was bent 35 degrees toward its little finger.
         So his fingers are curled about half as much at the middle and end joints (curl), his thumbs rest as his file
         rests them (thumb), and each hand's line over his knee is solved against its forearm (wristSolve)) */
      cast.hermitB.o.handsOn = Object.assign(kneeRest(), { palmUp: true, palmTilt: { L: -0.40, R: -0.40 }, at: 1.16, curl: [0.30, 0.32, 0.16], thumb: 'bind', wristSolve: true });
      /* (v26.8: the brown hermit's left wrist and the master in white's right stood bent sideways toward the little finger
         20 to 27 degrees (and the white master's left 15.5 toward the thumb), past where a resting wrist lies (jointscan
         on v26.8's build). Each hand's line is solved against its forearm as the pale-yellow hermit's is (wristSolve),
         every line tried held within flexMax of straight first (flexAfter). New objects, made after every copy
         above, so the red master's rest and the pale-yellow hermit's stand exactly as they were) */
      cast.hermitA.o.handsOn = Object.assign({}, cast.hermitA.o.handsOn, { wristSolve: true, flexAfter: true });
      cast.white.o.handsOn = Object.assign({}, cast.white.o.handsOn, { wristSolve: true, flexAfter: true });
      /* GRANDMASTER PHO (Chad's own model, prepared over v24.38 to v24.56: masters/v24.56/PLAN.md), on his bench under
         the gold canopy, facing the offering tables and those who kneel to him. His look is D, Chad's pick ("unlit, except for the robe", v24.52):
         lookD below. His rest is the first half second of his seated take, back and forth (the rest of it is talk). Far
         across the turf he is drawn from a lighter cut of the same body (permissive: fit for distance only, v21.8). */
      /* (his rest, judged on every seated take of his file at its first and last moments: the start of his rise from
         a seat, where he sits upright with both hands on his knees; its first third of a second, back and forth. His
         talk take holds both hands out before his chest from its first frame: that is talk, not rest) */
      /* (and that third of a second is there and back in PHO_BREATH seconds, a slow breath: at the take's own pace it
         was a bob every 0.6 s, his head at 15 cm a second. Now 1.5 at its fastest: windowread.mjs) */
      const PHO_BREATH = 6;
      /* (HIS HEAD WHEN HE TALKS, GREATLY RESTRAINED: Chad, 13 Nov 2026, "When grandmaster pho talks, his head also moves too
         much to the right, i think the head movement can be greatly restrained". His talk turned his face from 5 degrees
         to his left to 56 to his right (headturn.mjs); now 0.3 of that turn, about his rest, which faces his front) */
      const PHO_TALK_HEAD = { Sitting_Answering_Questions: [0.3, 'Sit_to_Stand_Transition_M'] };
      cast.pho = mkPerson('pho', PHO_AT[0], PHO_AT[1], BENCH.ry, { take: 'Sit_to_Stand_Transition_M', centre: true,
        win: { Sit_to_Stand_Transition_M: [0.02, 0.3, PHO_BREATH] }, seat: { y: SEATS.bench, takes: /^Sit/, down: Object.assign({}, MASTER_DOWN, { knees: 'keep', tuck: true }), rise: 'Sit_to_Stand_Transition_M' }, skins: { 3: 'phof' }, look: lookD, blobW: 1.1, blobD: 1.2,
        talk: 'Sitting_Answering_Questions', headDamp: PHO_TALK_HEAD });
      cast.pho.home = { x: PHO_AT[0], z: PHO_AT[1], ry: BENCH.ry };
      /* THE MONKS' ROW under the east tent, on chairs, facing the turf (photograph 2): THREE DIFFERENT MONKS (Chad,
         12 Nov 2026: "the 3 monks are the same model, can we have different monks? And their body is clipping through
         the seats"). His own monk (declared: `reuse`) keeps the middle chair, his far skin episode 3's row; either
         side of him sit two made here end to end (an older, heavy monk in deep maroon and a slim young one in a dark
         reddish brown: photograph 2's row is mixed, and the tracker's §5 has their ids).
         THE TWO NEW MONKS wear the library's seated idle and sit as men sit on a chair: set down by their soles and
         brought forward by their shins (o.seat.legs), which on a seat 0.93 m deep is its front; their hands laid on
         their laps where the robe is drawn (o.handsOn). Each rests on 1.3 s of the idle's upright end (10.0 to 0.6 s
         of it: the head goes 4 cm a way; the masters' longer window catches the start of its lean, 18 cm), there and
         back in seven and a half and six and a half seconds, so no two breathe together: windowread.mjs.
         HIS MONK SITS ON THE CHAIR WITH HIS FEET DOWN, as photograph 2's monks sit (cross-legged on it was tried and
         refused by photograph: his feet went through the chair's sides). Every chair-sit his file has perches, made
         for a seat some 8 cm higher (the hip joints 17 cm over the knees, the thighs sloping thirty-three degrees:
         sitread.mjs), so his bottom is set on the seat and each leg solved down to the ground from it (o.seat.down,
         seatDown). His hands are laid on his thighs as the others' are; he rests on 0.6 s of his thumbs-up take
         where its end runs into its start, the thumb down (sitread.mjs), there and back in nine seconds */
      const MONK_SEAT = { y: SEATS.chair, takes: /^Chair_Sit/, legs: { edge: MONKS.x - (MONKS.chair - MONKS.half), r: 0.055, apron: 0.14, sole: -0.005 } };
      const MONK_HANDS = { how: 'lap' };
      cast.monks = [
        mkPerson('e4monkb', MONKS.x, MONKS.zs[0], SIT_W, { take: 'Chair_Sit_Idle_M', centre: true, win: { Chair_Sit_Idle_M: [10.0, 1.3, 7.5] }, phase: 0.05, seat: MONK_SEAT, handsOn: MONK_HANDS, blobW: 1.0, blobD: 1.1 }),
        mkPerson('monkshop', MONKS.x, MONKS.zs[1], SIT_W, { take: 'Sit_Thumbs_Up_Right', centre: true, win: { Sit_Thumbs_Up_Right: [3.5, 0.6, 9] }, phase: 0.5,
          seat: { y: SEATS.chair, takes: /^Sit_Thumbs/, down: { edge: MONKS.x - (MONKS.chair - MONKS.half), r: 0.055, apron: 0.14, sole: -0.005, sink: 0.01 } },
          handsOn: { how: 'lap', out: 0.035, inner: 0, turn: 0.2 }, skins: { 3: 'monkrow' }, blobW: 1.0, blobD: 1.1 }),
        mkPerson('e4monkc', MONKS.x, MONKS.zs[2], SIT_W, { take: 'Chair_Sit_Idle_M', centre: true, win: { Chair_Sit_Idle_M: [10.0, 1.3, 6.5] }, phase: 0.85, seat: MONK_SEAT, handsOn: MONK_HANDS, blobW: 1.0, blobD: 1.1 })];
    }
    /* LOOK D on Grandmaster Pho: after the tone mapping, the scan's own colour is laid back wherever the texel is
       saturated (his skin, his beads, the gold) and over the whole of his face-and-hands part; the white robe keeps the
       scene's light and its folds. `level` scales the laid colour to the hour (an unlit colour ignores the sun: at dawn
       or by candle it must be dimmed by hand): look() sets it. tools/probes/phoingame.mjs is where it was proved.
       `lift` (M8): THE MAN IN WHITE MUST READ WHITE. Day two is a backlit dawn (its sun behind his bench): the robe,
       lit only by the sky there, came out mid-grey under a face laid at 0.86, in every close shot of the morning: a
       teacher in grey, darker than his own skin. So where the robe's lit colour falls under nine tenths of its own
       colour at that hour, it is lifted `lift` of the way back to it: never past it, and nothing where the sun already
       has it brighter. Its folds stay: they are the light's (kept in part) and the scan's own. Photographed at 0, 0.4,
       0.55 and 0.75 in the morning's close shot and at 0 and 0.55 on day one (masters/v26.0: the tracker's log, M8):
       0.55 is white with its folds; 0.75 is whiter and flat. Under his canopy he sits in shade on day one too, and is
       lifted there as well: among three hundred in white, he is the one who reads as white. */
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
    buildCast();
    /* THE DANCERS (§4.1 P3: "dancers in traditional thai clothes ... dancing to show respect to the tewadas", Chad). Six
       women in white and gold on the open turf, in two rows of three, turned to Grandmaster Pho's canopy: two bodies,
       each drawn three times from one hidden driver (they dance in unison, as a troupe does), every other one mirrored.
       The film of the festival poses the two drivers from its own clock. In PLAY they are on the ground all of day one
       (c_crowd.js, "the dancers on the ground": they wait, they cross ahead of him, they stand by after their dance), so
       a driver rests in its stand and its walk's pace is measured; the film stands them on their dance places. */
    const danceG = new THREE.Group(); danceG.visible = false; world.add(danceG);
    const DANCE = { c: [0.2, -2.6], gap: 1.35, row: 0.75 };
    /* THEIR WALK-DANCE is written for them (masters/v26.0/people/MOTIONS.txt `walkdance2`; Chad, 12 Nov 2026: "this
       looping walk dance is just like a simple walk and dance at the same time"): she walks with small steps, both
       arms out from her sides, rising and falling in turn. Two of its cycles, heel to heel (4.633 to 7.4 s: gait.mjs,
       where its pace has settled: 0.92 m a second, straight ahead within a degree), made a loop; the file walks it
       slowed to a dance's pace (c_crowd.js DWALK.rate). The walk written for their one crossing, `procession`, went
       with that crossing (its take is out of their files; the motion is kept in masters/v26.0/src). The library's
       walk on them was a stride: photographed crossing the ground, and refused. */
    const DLOOP = { walkdance: [4.633, 7.4, 0.35],
    /* (v26.8, Chad: "when the dancers start dancing, and they switch positions, they clip and collide into each other":
       the film's second dance walked 2.6 m to one side, the mirrored dancers the other way, into their neighbours. The
       film dances only their dance made in place, the whole 14.6 s: made a loop here, its last 1.2 s eased onto its
       first pose (its hips come back within 10 cm of where they began, so the ease carries no step); people.sh) */
                    dance1: [0, 9.95, 1.2] };
    /* (each body's feet set on the turf by her own measure, gait.mjs: in this walk the second dancer's ankles never come
       lower than 10.5 cm, where they stand at 8.3 at rest: she walked two and a half centimetres over the grass. The
       first dancer's come to 7.5 and 8.1 against 8.1: left as they are) */
    const dancers = { A: mkDriver('e4dancera', { take: 'Idle_3', pace: true, loops: DLOOP }),
                      B: mkDriver('e4dancerb', { take: 'Idle_3', pace: true, phase: 0.37, loops: DLOOP, sink: { walkdance: 0.024 } }), at: [], ry: 0, m: [] };
    { const fx = PHO_AT[0] - DANCE.c[0], fz = PHO_AT[1] - DANCE.c[1], fl = Math.hypot(fx, fz), f = [fx / fl, fz / fl], r = [f[1], -f[0]], ry = Math.atan2(f[0], f[1]);
      for (let row = 0; row < 2; row++) for (let k = -1; k <= 1; k++) { const x = DANCE.c[0] + f[0] * (row ? -DANCE.row : DANCE.row) + r[0] * k * DANCE.gap, z = DANCE.c[1] + f[1] * (row ? -DANCE.row : DANCE.row) + r[1] * k * DANCE.gap;
        const D = (row + k + 2) % 2 ? dancers.B : dancers.A;
        dancers.m.push(mkMember(D, x, z, ry, { parent: danceG, mirror: k === 1 || (row === 1 && k === 0), s: 0.97 + 0.02 * ((row * 3 + k + 4) % 3), blobW: 0.8, blobD: 0.7 })); dancers.at.push([x, z]); }
      dancers.ry = ry; }
    /* THOSE WHO GO UP at the west tent in the film (photographs 11 and 12): a woman who raises her bai sri to the hermit
       and goes quite still; a man heaped with petals whose arms rise wide (his own take's upper body on a grounded
       kneel: o.mix). Each is stood where his hands and the master's can meet (meetHands) */
    cast.goA = mkPerson('e4deva', -9.2, -2.2, Math.PI / 2 * -1, { take: 'seiza', centre: true, hidden: true, blobW: 0.95, blobD: 1.0, fullFilm: true });
    cast.goB = mkPerson('e4devc', -9.2, -0.95, Math.PI / 2 * -1, { take: 'seiza', centre: true, hidden: true, blobW: 0.95, blobD: 1.0, mix: [['armsup', 'armsopen', 'seiza', 0.5]], fullFilm: true });
    /* PETALS LYING ON A BODY (photograph 12: "heaped with petals from his hair to his lap"). Each petal is laid on the
       body's own surface in its bind pose and given to the bone under it (the crown to the head, the shoulders to the
       collar bones, the lap to the thighs: a thigh's front is its top when a man kneels), so it rides him as he moves,
       and no height is guessed: the top of his hair and of his shoulders and the front of his thighs are read from his
       own skin. (My first heap was seventy clusters at heights typed in his group's frame: they stood inside his head
       and his shoulders, and the photograph showed a man with a few petals in his lap.) */
    function petalsOn(P, o = {}) {
      const skins = P.lv[1]; if (!skins || !skins.length) return null;
      const bone = (nm) => { const re = new RegExp('^(mixamorig:?)?' + nm + '$'); for (const n in P.bone) if (re.test(n)) return P.bone[n]; return null; };
      const bindOf = (b) => { if (!b) return null; for (const sm of skins) { const i = sm.skeleton.bones.indexOf(b); if (i >= 0) return new THREE.Matrix4().copy(sm.skeleton.boneInverses[i]).invert(); } return null; };
      const at = (b) => { const m = bindOf(b); return m ? new THREE.Vector3().setFromMatrixPosition(m) : null; };
      const pts = [], v = new THREE.Vector3();
      for (const sm of skins) { const pos = sm.geometry.attributes.position; for (let i = 0; i < pos.count; i++) { v.fromBufferAttribute(pos, i).applyMatrix4(sm.bindMatrix); pts.push(v.x, v.y, v.z); } }
      /* the skin's top over a spot of the floor plan, and its front before a spot of the body's front view */
      const topAt = (x, z, r, y0, y1) => { let m = -Infinity; const r2 = r * r; for (let i = 0; i < pts.length; i += 3) { const y = pts[i + 1]; if (y <= m || y < y0 || y > y1) continue; const dx = pts[i] - x, dz = pts[i + 2] - z; if (dx * dx + dz * dz <= r2) m = y; } return m; };
      const frontAt = (x, y, r, z0, z1) => { let m = -Infinity; const r2 = r * r; for (let i = 0; i < pts.length; i += 3) { const z = pts[i + 2]; if (z <= m || z < z0 || z > z1) continue; const dx = pts[i] - x, dy = pts[i + 1] - y; if (dx * dx + dy * dy <= r2) m = z; } return m; };
      const rnd = rng(o.seed || 9911), col = new THREE.Color(), e = new THREE.Euler(), q = new THREE.Quaternion(), q2 = new THREE.Quaternion(), m4 = new THREE.Matrix4(), up = new THREE.Vector3(0, 1, 0), nn = new THREE.Vector3(), made = [];
      /* one bone's petals: `spots` answers [x, y, z, nx, ny, nz] in the bind pose, or null where there is no skin */
      const strew = (b, n, spots) => { const mb = bindOf(b); if (!mb) return; const inv = mb.clone().invert(), im = new THREE.InstancedMesh(new THREE.PlaneGeometry(1, 1), petalAirMat, n); let k = 0;
        for (let i = 0; i < n * 3 && k < n; i++) { const sp = spots(); if (!sp) continue;
          nn.set(sp[3], sp[4], sp[5]).normalize(); q.setFromUnitVectors(up, nn); e.set(-Math.PI / 2 + (rnd() - 0.5) * 0.5, rnd() * 6.283, (rnd() - 0.5) * 0.5, 'YXZ'); q.multiply(q2.setFromEuler(e));
          const sz = (o.s || 0.042) * (0.75 + rnd() * 0.6);
          m4.compose(v.set(sp[0], sp[1], sp[2]).addScaledVector(nn, 0.004 + rnd() * 0.006), q, _ws.set(sz, sz, sz)).premultiply(inv);
          im.setMatrixAt(k, m4); im.setColorAt(k, col.setHSL(0.105 + rnd() * 0.04, 0.98, 0.5 + rnd() * 0.06, THREE.SRGBColorSpace)); k++; }
        im.count = k; _ws.set(1, 1, 1); im.instanceMatrix.needsUpdate = true; if (im.instanceColor) im.instanceColor.needsUpdate = true; im.frustumCulled = false; b.add(im); owned.push(im); made.push(im); };
      /* his hair: a cap round the crown, and forward onto his fringe (his face lifts in the trance: the crown tips
         away from whoever stands before him) */
      const ph = at(P.head);
      if (ph && o.head) strew(P.head, o.head, () => { const a = rnd() * 6.283, d = 0.1 * Math.sqrt(rnd()), dx = Math.cos(a) * d, dz = Math.sin(a) * d + 0.035, y = topAt(ph.x + dx, ph.z + dz, 0.022, ph.y + 0.04, ph.y + 0.45);
        return y > -1e9 ? [ph.x + dx, y, ph.z + dz, dx * 7, 1, dz * 7] : null; });
      /* his chest: a few caught in the folds of his shirt, high on it */
      const sp = bone('Spine2') || bone('Spine02') || bone('Spine1') || bone('Spine01'), pn = at(bone('LeftArm')), pm = at(bone('RightArm'));
      if (sp && pn && pm && o.chest) { const cy = (pn.y + pm.y) / 2, cx = (pn.x + pm.x) / 2, hw = Math.abs(pn.x - pm.x) / 2;
        strew(sp, o.chest, () => { const x = cx + (rnd() - 0.5) * 2 * hw * 0.8, y = cy - 0.03 - rnd() * 0.2, z = frontAt(x, y, 0.024, pn.z - 0.05, pn.z + 0.3);
          return z > -1e9 ? [x, y, z, (x - cx) * 2, 0.5, 1] : null; }); }
      /* his shoulders: along each collar bone, from beside the neck out to the arm */
      if (o.shoulders) for (const S0 of ['Left', 'Right']) { const cb = bone(S0 + 'Shoulder'), pa = at(bone(S0 + 'Arm')), pc = at(cb); if (!cb || !pa || !pc) continue;
        strew(cb, o.shoulders, () => { const u = 0.25 + rnd() * 0.8, x = pc.x + (pa.x - pc.x) * u, z = pc.z + (pa.z - pc.z) * u + (rnd() - 0.5) * 0.09, y = topAt(x, z, 0.022, pa.y - 0.06, pa.y + 0.14);
          return y > -1e9 ? [x, y, z, (pa.x - pc.x) * 0.6, 1, (z - pa.z) * 3] : null; }); }
      /* his lap: down the front of each thigh (which is its top, kneeling) */
      if (o.lap) for (const S0 of ['Left', 'Right']) { const tb = bone(S0 + 'UpLeg'), p0 = at(tb), p1 = at(bone(S0 + 'Leg')); if (!tb || !p0 || !p1) continue;
        strew(tb, o.lap, () => { const u = 0.06 + rnd() * 0.84, x = p0.x + (p1.x - p0.x) * u + (rnd() - 0.5) * 0.11, y = p0.y + (p1.y - p0.y) * u, z = frontAt(x, y, 0.024, p0.z - 0.02, p0.z + 0.3);
          return z > -1e9 ? [x, y, z, (x - p0.x) * 4, 0, 1] : null; }); }
      return made;
    }
    whenReady(cast.goB, (P) => { cast.goB.heap = petalsOn(P, { head: 64, shoulders: 30, chest: 14, lap: 60, seed: 9911 }); });
    /* a kneeler stood where his raised hands and a master's laid forward stand over one another (both measured on the
       bodies at the moments named); answers the two heights */
    const _mha = new THREE.Vector3(), _mhb = new THREE.Vector3();
    function meetHands(M0, mTake, mT, K0, kTake, kT) {
      const hp = handsAt(M0, mTake, mT, _mha), hy = handsAt(K0, kTake, kT, _mhb);
      if (!hp || !hy) return null;
      M0.group.updateWorldMatrix(true, false); M0.group.localToWorld(hp); K0.group.updateWorldMatrix(true, false); K0.group.localToWorld(hy);
      K0.group.position.x += hp.x - hy.x; K0.group.position.z += hp.z - hy.z;
      return { master: hp.y, kneeler: hy.y };
    }
    /* those of the cast who STAND where he walks are things he walks round: a column each, set where its person stands
       (the engine walks the very list it was handed, so a box is moved in place, and lifted clear when its person is
       not on the ground) */
    /* THE FOUR WHO WAIT THEIR TURN (ending C: "An old man. Two women. A young man ... Nobody is in distress; they are
       waiting"): people of their own, so each can look where he looks. The other endings borrow them: one kneels to
       Grandmaster Pho in ending B's afternoon while two wait; two roll mats and one carries one in ending A. Hidden
       until an ending stands them (a hidden person is not run: peopleTick) */
    const WAIT_AT = [[2.3, 3.0], [2.95, 3.35], [3.5, 3.85], [4.2, 4.05]].map(([a, b]) => benchAt(a, b));
    cast.wait = ['e4devh', 'e4deve', 'e4devb', 'e4devc'].map((key, i) => { const [x, z] = WAIT_AT[i];
      const P = mkPerson(key, x, z, faceTo(x, z, PHO_AT[0], PHO_AT[1]), { take: 'Idle_3', hidden: true, phase: 0.17 + 0.23 * i, blobW: 0.8, blobD: 0.7 });
      P.home = { x, z, ry: faceTo(x, z, PHO_AT[0], PHO_AT[1]) }; return P; });
    const castBlock = {};
    for (const k of ['ton', 'aunt']) castBlock[k] = new THREE.Box3(new THREE.Vector3(0, 60, 0), new THREE.Vector3(0, 61, 0));
    function castSolid() { for (const k in castBlock) { const P = cast[k], b = castBlock[k], on = !!(P && P.group.visible && !P.hidden && !P.noBlock), g = P.group.position, r = 0.45;
      b.min.set(g.x - r, on ? 0 : 60, g.z - r); b.max.set(g.x + r, on ? 1.5 : 61, g.z + r); } }
    for (const k in castBlock) whenReady(cast[k], castSolid);


    /* ================================================================ THE CROWD OF DAY ONE (the plan's §3.3; photographs 1, 8, 10, 12)
       Devotees in white on the turf. Eight bodies were made for them; a crowd of copies reads as copies, so WHO SITS WHERE
       IS SOLVED (Chad's rule, v5.29): a balanced deal of the eight over the places, then a seeded local search that swaps
       two people whenever the swap puts the same body further from its own copies; every other one is mirrored and each
       is a little taller or shorter. `stage.crowdStats()` reports what the solve reached, so the claim can be checked.

       Each body has three drivers (c_cast.js): two kneeling at different moments, one standing. So the people of one
       body do not all breathe together, and the whole crowd is twenty-four mixers.

       THE PHOTOGRAPHS SHOW THREE CROWDS, NOT ONE (the tracker's §12 "Formations"), so the same forty-seven people have a
       FORMATION for each: `arrive` (photograph 10: loose kneeling rows facing the offering tables, a line waiting at
       them, twos and threes at the edges), and `bless` (photographs 1, 5, 6, 11, 12: a throng kneeling before each
       master's seat, friends standing behind, a line at Grandmaster Pho's bench). A person keeps his body, his size and
       whether he kneels or stands; which seat he takes in a formation is solved the same way. A formation is changed in
       the black or on a cut, never under the player's eye (v24.12). Day two has nobody on the turf but two far off. */
    const DEVOTEES = ['e4deva', 'e4devb', 'e4devc', 'e4devd', 'e4deve', 'e4devf', 'e4devg', 'e4devh'];
    const crowdSeats = [];                                                       // the people: { kind: 'sit' | 'stand', body, mirror, s, half, member, at: { formation: seat } }
    const FORMS = { arrive: [], bless: [], photo: [] };
    /* the group's photograph (photograph 8): twelve kneel in one row before the offering tables, facing south */
    const PHOTO = { x0: -3.3, dx: 0.6, z: -5.2 };                                     // each: [{ x, z, ry, kind }]
    const crowdDrivers = {};                                                     // key -> { A, B, S }
    const crowdBlock = [], dawnBlock = [];
    /* how close he may come to one of them (v26.2 debug: buildCrowd) */
    const PERSONAL = { sit: 0.5, stand: 0.45 };
    let formNow = '';
    /* the line of sight from where Grandmaster Pho sits to the one who kneels to him, and the line that waits behind */
    const LANE = { a0: -0.35, a1: 1.45 };
    function planCrowd() {
      const R = rng(41203);
      const aim = (x, z) => faceTo(x, z, 0, -11.2);                              // toward the offering tables
      const A = FORMS.arrive, Bf = FORMS.bless;
      /* ---- ARRIVE. The sitting blocks: a jittered grid in each, and only so many of its places taken (loose rows) */
      const block = (x0, x1, z0, z1, n) => { const cells = [];
        for (let z = z0; z <= z1 + 1e-6; z += 1.18) for (let x = x0 + ((Math.round((z - z0) / 1.18) % 2) ? 0.5 : 0); x <= x1 + 1e-6; x += 1.08) cells.push([x, z]);
        for (let i = cells.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); const t = cells[i]; cells[i] = cells[j]; cells[j] = t; }
        for (const [x, z] of cells.slice(0, n)) { const px = x + (R() - 0.5) * 0.3, pz = z + (R() - 0.5) * 0.3;
          A.push({ x: px, z: pz, ry: aim(px, pz) + (R() - 0.5) * 0.3, kind: 'sit' }); } };
      block(-8.2, -3.4, 2.6, 6.6, 12);          // south-west of the middle (clear of his own place at its north-east corner)
      block(2.2, 5.4, 1.4, 5.2, 6);             // south-east, short of the chief canopy
      block(-6.4, -2.4, -6.6, -2.8, 8);         // north-west, before the west tent
      block(2.4, 6.4, -7.2, -3.6, 6);           // north-east, before the monks
      /* those who stand: in twos and threes at the edges, turned to one another or to the tables */
      const pair = (F, x, z, n, r = 0.55) => { const a0 = R() * 6.283;
        for (let i = 0; i < n; i++) { const a = a0 + i * 6.283 / n, px = x + Math.sin(a) * r, pz = z + Math.cos(a) * r;
          F.push({ x: px, z: pz, ry: n > 1 ? faceTo(px, pz, x, z) + (R() - 0.5) * 0.4 : aim(px, pz), kind: 'stand' }); } };
      /* (v26.2 debug: the pair by the west fence stood at (-9.6, -8.4), one of them in the fence with an arm through its top
         rail: Chad's picture, measured. They stand a step east of it now; the seeded stream draws as it did) */
      pair(A, -8.6, 10.6, 2); pair(A, 9.6, 3.6, 3, 0.62); pair(A, 8.9, 6.2, 1); pair(A, -8.9, -8.1, 2); pair(A, 4.4, -8.9, 2); pair(A, -1.9, 10.9, 1);
      /* the line waiting its turn at the offering tables (photograph 10), east of the middle so the way up it is his */
      for (let i = 0; i < 4; i++) { const px = 1.55 + (R() - 0.5) * 0.16, pz = -8.5 + i * 0.92 + (R() - 0.5) * 0.1; A.push({ x: px, z: pz, ry: aim(px, pz) + (R() - 0.5) * 0.16, kind: 'stand' }); }

      /* ---- BLESS. A throng kneels before each master's seat and faces him; their friends stand behind */
      const sitTo = (x, z, tx, tz) => Bf.push({ x: x + (R() - 0.5) * 0.18, z: z + (R() - 0.5) * 0.18, ry: faceTo(x, z, tx, tz) + (R() - 0.5) * 0.22, kind: 'sit' });
      const standTo = (x, z, tx, tz) => Bf.push({ x, z, ry: faceTo(x, z, tx, tz) + (R() - 0.5) * 0.3, kind: 'stand' });
      const bA = (a, b) => benchAt(a, b), PH = PHO_AT;
      /* before Grandmaster Pho's bench, either side of the lane the line comes up (ten) */
      for (const [a, b] of [[-1.55, 2.0], [-0.95, 2.35], [-2.65, 2.15], [-2.1, 2.95], [-1.4, 3.1], [2.0, 3.25], [2.5, 2.4], [-1.75, 4.0], [1.9, 4.2], [2.7, 3.5]]) { const [x, z] = bA(a, b); sitTo(x, z, PH[0], PH[1]); }
      /* before the hermit in brown and the master in red, on the mats under the west tent (nine); the two places right
         before their sofas are kept for those who go up */
      const iWest = Bf.length;
      /* (v26.2: the kneeler at the tent's south-east corner moved from (-7.3, 0.85) to (-7.55, 0.55): there her shoulder was in
         the tent's corner pole at (-7.0, 1.0), measured in the festival by tools/probes/clipscan.mjs) */
      for (const [x, z] of [[-8.3, -3.1], [-8.2, -1.55], [-8.3, 0.0], [-7.4, -2.6], [-7.3, -1.3], [-7.4, -0.2], [-7.55, 0.55], [-6.4, -2.0], [-6.3, -0.8]]) sitTo(x, z, -10.2, z > -1.6 ? -0.95 : -2.2);
      /* before the hermit in the yellow shawl (five) */
      for (const [x, z] of [[-8.4, 4.2], [-8.3, 5.8], [-7.4, 4.0], [-7.5, 5.1], [-7.4, 6.2]]) sitTo(x, z, -10.2, 5.0);
      /* before the monks' row (five) */
      for (const [x, z] of [[8.4, -3.4], [8.5, -2.2], [8.4, -1.0], [7.4, -2.8], [7.5, -1.6]]) sitTo(x, z, 10.2, -2.0);
      /* on the open turf, facing the tables (three) */
      const iOpen = Bf.length;
      for (const [x, z] of [[-3.4, -5.6], [-2.3, -5.1], [2.6, -5.4]]) sitTo(x, z, 0, -11.2);
      /* the line at his bench, behind the place the player stands (three); friends at the throng's edge (three) */
      for (const [a, b] of [[0.9, 4.2], [0.98, 5.1], [0.84, 6.0]]) { const [x, z] = bA(a, b); standTo(x, z, PH[0], PH[1]); }
      /* (v26.2 debug: the second friend stood at (3.0, 3.2), 0.43 m from the kneeler at (2.7, 3.5): their legs passed through
         one another, measured in the festival film by tools/probes/clipscan.mjs. A step further out) */
      for (const [a, b] of [[-2.9, 3.7], [3.45, 3.5], [3.3, 2.1]]) { const [x, z] = bA(a, b); standTo(x, z, PH[0], PH[1]); }
      /* behind the kneelers at the west tents (three); at the tables (two); by the monks (one); talking at the edges (three) */
      standTo(-5.5, -2.9, -10.2, -2.2); standTo(-5.4, -0.4, -10.2, -0.95); standTo(-6.3, 5.2, -10.2, 5.0);
      standTo(1.3, -8.7, 0, -11.2); standTo(-1.6, -8.8, 0, -11.2);
      standTo(6.5, -0.3, 10.2, -2.0);
      pair(Bf, -8.7, 10.6, 2); pair(Bf, 9.5, 4.0, 1);
      for (const k of ['sit', 'stand']) if (A.filter(s => s.kind === k).length !== Bf.filter(s => s.kind === k).length)
        console.warn('the crowd: ' + A.filter(s => s.kind === k).length + ' ' + k + ' at the way in, ' + Bf.filter(s => s.kind === k).length + ' at the blessing');

      /* THE SOLVE. A formation's cost: a pair of the same body costs the square of what they lack of six metres apart.
         ARRIVE deals the bodies evenly over its seats, then swaps bodies; each later formation gives the same people
         its own seats of their kind, then swaps two people's seats (same kind) while that parts copies further. */
      const N = A.length, body = new Int32Array(N);
      const order = Array.from({ length: N }, (_, i) => i);
      for (let i = N - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); const t = order[i]; order[i] = order[j]; order[j] = t; }
      order.forEach((seat, k) => { body[seat] = k % DEVOTEES.length; });
      const solve = (seatOf, canSwap, swap) => { let swaps = 0;
        const pairCost = (i, j) => { if (body[i] !== body[j]) return 0; const a = seatOf(i), b = seatOf(j), d = Math.hypot(a.x - b.x, a.z - b.z); return d < 6 ? (6 - d) * (6 - d) : 0; };
        const costOf = (i) => { let c = 0; for (let j = 0; j < N; j++) if (j !== i) c += pairCost(i, j); return c; };
        for (let it = 0; it < 6000; it++) { const a = Math.floor(R() * N), b = Math.floor(R() * N); if (a === b || !canSwap(a, b)) continue;
          const before = costOf(a) + costOf(b); swap(a, b);
          if (costOf(a) + costOf(b) < before - 1e-9) swaps++; else swap(a, b); }
        return swaps; };
      const swapsA = solve((i) => A[i], (a, b) => body[a] !== body[b], (a, b) => { const t = body[a]; body[a] = body[b]; body[b] = t; });
      for (let i = 0; i < N; i++) crowdSeats.push({ kind: A[i].kind, body: body[i], mirror: R() < 0.5, s: 0.955 + R() * 0.085, half: R() < 0.5 ? 'A' : 'B', at: { arrive: A[i] } });
      /* bless: the people of each kind onto that kind's seats in order, then the swaps */
      const seatB = new Int32Array(N); { const free = { sit: [], stand: [] }; Bf.forEach((s, k) => free[s.kind].push(k)); for (let i = 0; i < N; i++) seatB[i] = free[crowdSeats[i].kind].shift(); }
      const swapsB = solve((i) => Bf[seatB[i]], (a, b) => crowdSeats[a].kind === crowdSeats[b].kind && body[a] !== body[b], (a, b) => { const t = seatB[a]; seatB[a] = seatB[b]; seatB[b] = t; });
      for (let i = 0; i < N; i++) crowdSeats[i].at.bless = Bf[seatB[i]];
      /* PHOTO (photograph 8: "Twelve devotees in white kneel in a row on bright green turf, hands joined. Behind them
         stand eleven masters"): the blessing's ground, but the nine who knelt before the west tent's two masters and the
         three on the open turf kneel in one row before the offering tables, turned to the one who takes the picture.
         Everyone keeps his blessing seat's kind; then the same swaps, so no body kneels beside itself. (Made after
         everything above: the stream's numbers for the way in and the blessing are the ones they were.) */
      const Pf = FORMS.photo; for (const s0 of Bf) Pf.push(Object.assign({}, s0));
      [0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => iWest + i).concat([iOpen, iOpen + 1, iOpen + 2]).forEach((si, k) => {
        Pf[si] = { x: PHOTO.x0 + k * PHOTO.dx + (R() - 0.5) * 0.07, z: PHOTO.z + (R() - 0.5) * 0.09, ry: (R() - 0.5) * 0.1, kind: 'sit' }; });
      const seatP = Int32Array.from(seatB);
      const swapsP = solve((i) => Pf[seatP[i]], (a, b) => crowdSeats[a].kind === crowdSeats[b].kind && body[a] !== body[b], (a, b) => { const t = seatP[a]; seatP[a] = seatP[b]; seatP[b] = t; });
      for (let i = 0; i < N; i++) crowdSeats[i].at.photo = Pf[seatP[i]];
      crowdSeats.swaps = { arrive: swapsA, bless: swapsB, photo: swapsP };
    }
    /* (v26.2 debug: `seats` true also lists who sits or stands where in the formation, so a probe can name a person it
       photographs: tools/probes/clipscan.mjs) */
    function crowdStats(form = formNow || 'arrive', seats = false) {
      if (seats) return crowdSeats.map(s => ({ body: DEVOTEES[s.body], kind: s.kind, x: +s.at[form].x.toFixed(2), z: +s.at[form].z.toFixed(2) }));
      const N = crowdSeats.length, per = DEVOTEES.map(() => 0); let near = Infinity, sum = 0, touching = 0;
      const at = (i) => crowdSeats[i].at[form];
      for (let i = 0; i < N; i++) { per[crowdSeats[i].body]++; let best = Infinity;
        for (let j = 0; j < N; j++) if (j !== i && crowdSeats[j].body === crowdSeats[i].body) best = Math.min(best, Math.hypot(at(i).x - at(j).x, at(i).z - at(j).z));
        near = Math.min(near, best); sum += best; if (best < 1.6) touching++; }
      return { formation: form, people: N, sitting: crowdSeats.filter(s => s.kind === 'sit').length, standing: crowdSeats.filter(s => s.kind === 'stand').length,
               perBody: per, nearestSameBody: +near.toFixed(2), meanNearestSameBody: +(sum / N).toFixed(2), sameBodyWithin1m6: touching, swaps: crowdSeats.swaps[form], drivers: Object.keys(crowdDrivers).length * 3 };
    }
    /* each kneeling driver's rest: A sits on the heels, B sits too at the way in and holds a kneeling wai at the blessing
       (the krap's first second, back and forth); the bows of the homage are spans on both */
    const SIT = { seiza: SEIZA_WIN }, WAI = [0.15, 0.85];
    /* (each driver starts at its own place round the kneel's slower cycle: a person's clock starts at ten times its phase, so
       the phases are spread over 3.4 to keep the kneelers as far apart round it as they were round the take's own 13.6 s) */
    const SITSPREAD = SEIZA_WIN[2] / 10;
    /* (v26.3: THEIR HANDS ON THEIR THIGHS. The kneel was made on a body with thinner thighs, and on these, in their loose
       trousers, each hand sank into the thigh to the knuckles, its fingertips out through the cloth (photographed full
       size beside two of them, 13 Nov). A kneeler's palms rest on top of the thighs, as the masters' rest on their knees:
       the same lap rest (c_cast.js restHands), laid while the kneel is worn; their members wear the drivers' bones) */
    /* (v26.8: and each hand's line solved against its forearm (c_cast.js wristSolve, flexAfter): jointscan on v26.8's
       build read four kneelers' left wrists bent 27 to 45 degrees toward the thumb, past a real wrist's 20) */
    const KNEEL_HANDS = { how: 'lap', gather: 1, converge: 0.11, curl: [0.30, 0.60, 0.30], flexMax: 8 * Math.PI / 180, drape: { r: 0.008, min: 0.8, max: 1.5 }, wristSolve: true, flexAfter: true };
    /* (v26.8, row P: "fix all of them the way you fixed Ton. All of them." The stand and the talk were let down on every
       body; jointscan then read the same shrug on the kneelers, 12 to 17 degrees over the A pose in their kneel (Ton's
       stand was 37 and 49), so the kneel is let down the same way: KNEEL_SH, laid before their hands are laid on the lap) */
    const KNEEL_SH = { seiza: 1 };
    function buildCrowd() {
      planCrowd();
      for (const key of DEVOTEES) crowdDrivers[key] = {
        A: mkDriver(key, { take: 'seiza', centre: true, win: SIT, headDamp: SEIZA_LOOK, handsOn: KNEEL_HANDS, shoulders: KNEEL_SH, phase: (0.07 + 0.11 * DEVOTEES.indexOf(key)) * SITSPREAD }),
        B: mkDriver(key, { take: 'seiza', centre: true, win: SIT, headDamp: SEIZA_LOOK, handsOn: KNEEL_HANDS, shoulders: KNEEL_SH, phase: (0.55 + 0.09 * DEVOTEES.indexOf(key)) * SITSPREAD, rate: 0.86 }),
        S: mkDriver(key, { take: 'Idle_3', centre: true, phase: 0.13 * DEVOTEES.indexOf(key) }) };
      for (const s of crowdSeats) { const D = crowdDrivers[DEVOTEES[s.body]][s.kind === 'stand' ? 'S' : s.half], p = s.at.arrive;
        s.member = mkMember(D, p.x, p.z, p.ry, { s: s.s, mirror: s.mirror, parent: dayOne, blobW: s.kind === 'stand' ? 0.8 : 0.95, blobD: s.kind === 'stand' ? 0.7 : 1.0 });
        /* a person is a thing he walks round: a column from the ground (collide() samples at a metre). (v26.2 debug: 0.3 m
           each way let his eye come 10 cm from a woman's hair, Chad's picture: half a metre for one who kneels, whose knees
           reach forward, 0.45 for one who stands) */
        const r = PERSONAL[s.kind]; s.block = new THREE.Box3(new THREE.Vector3(p.x - r, 0, p.z - r), new THREE.Vector3(p.x + r, 1.5, p.z + r)); crowdBlock.push(s.block); }
      formNow = 'arrive';
      /* day two: two people far off by the offering tables, clearing up (the ground is not quite empty: §4.3) */
      for (const [key, x, z, ry] of [['e4devb', -3.3, -9.25, 2.6], ['e4devh', 3.9, -9.3, -2.2]]) { mkMember(crowdDrivers[key].S, x, z, ry, { parent: dayTwo, blobW: 0.8, blobD: 0.7 });
        dawnBlock.push(new THREE.Box3(new THREE.Vector3(x - 0.3, 60, z - 0.3), new THREE.Vector3(x + 0.3, 61, z + 0.3))); }
    }
    /* THE FORMATION, by name: every member onto his seat in it, his column with him; the kneelers' second driver to the
       pose the formation asks. Called in the black or on a cut. */
    function setFormation(name) {
      if (!FORMS[name]) return;
      formNow = name;
      const on = dayOne.visible;
      for (const s of crowdSeats) { const p = s.at[name], r = PERSONAL[s.kind]; s.member.group.position.set(p.x, 0, p.z); s.member.group.rotation.y = p.ry; s.member.lvNow = -1;
        s.block.min.set(p.x - r, on ? 0 : 60, p.z - r); s.block.max.set(p.x + r, on ? 1.5 : 61, p.z + r); }
      for (const key of DEVOTEES) { const D = crowdDrivers[key];
        if (name === 'bless' || name === 'photo') hold(D.B, 'prostrate', WAI[0], WAI[1], 0); else rest(D.B, 0);
        rest(D.A, 0); rest(D.S, 0); }
      { let sx = 0, sz = 0; for (const s of crowdSeats) { sx += s.at[name].x; sz += s.at[name].z; } crowdMid.x = sx / crowdSeats.length; crowdMid.z = sz / crowdSeats.length; }
      kidsForm(name); dancersForm(name); extrasLive();
    }
    /* (the middle of the crowd as it sits now: the crowd's own noise is fullest there, d_play.js mixBeds) */
    const crowdMid = { x: 0, z: 0 };
    /* THE WHOLE GROUND BOWS (the homage): every kneeling driver makes the krap once, from the kneeling wai down to the
       ground and back, over `secs`; the members follow because they are drawn from its bones. Then each is back at rest */
    const KRAP = { from: 0.2, to: 6.75 };
    function crowdBow(secs, last) {
      for (const key of DEVOTEES) for (const h of ['A', 'B']) { const D = crowdDrivers[key][h];
        span(D, 'prostrate', KRAP.from, KRAP.to, secs * (h === 'B' ? 1.0 : 0.96), { fade: 0.5, hold: last ? 0 : -0.35, then: last ? (P) => rest(P, 0.9) : null }); }
    }
    /* the crowd's columns stand only while the crowd does: the engine walks the very list it was handed, so each box is
       lifted clear of his head height when the crowd is gone, and set down again when it is back */
    function crowdSolid(on) { for (const b of crowdBlock) { b.min.y = on ? 0 : 60; b.max.y = on ? 1.5 : 61; }
      const two = dayTwo.visible; for (const b of dawnBlock) { b.min.y = two ? 0 : 60; b.max.y = two ? 1.5 : 61; }
      crowdLive(); }
    /* a driver nobody wears on this day is not run (twenty-four mixers for a crowd that is not drawn are a phone's heat
       for nothing: v15.0) */
    function crowdLive() {
      for (const P of people) { if (!P.driver) continue;
        P.idle = !P.members.some(m => m.group.visible && (!m.group.parent || m.group.parent.visible)); }
      extrasLive();
    }
    buildCrowd();

    /* ================================================================ THE WOMAN WITH THE TAPER
       (the plan's 4.1 P1: "a woman ahead of him lighting hers with a long taper"; photograph 10: at the head of the line
       that waits at the offering tables a woman in white holds a long yellow taper to the candles on the front step.)
       Found unbuilt by the audit of 12 Nov. A person of her own at the head of the game's line while the ground gathers
       (the `arrive` formation), nobody of the photograph copied: the young woman with the ponytail (the long-haired
       woman's body stands third in that same line: counted). Her LEFT hand carries the taper, the side he comes up on:
       its tip goes from one small candle's wick to the next, is drawn back, and goes again, on the day's own clock; her
       elbow stays at her side and her eyes are on the flame. The taper is a real model (w3taper, 0.70 m) laid along her
       fingers, and a flame stands on its tip. */
    /* (`hinge`: her left elbow's own, measured off her takes in her upper arm's frame (masters/v26.1/make.sh): 'prostrate'
       bends it 128.6 degrees about (0.607, 0, -0.794), 'seiza' 27 degrees within 6 degrees of that; her standing take is
       straight-armed and gives none. `wrist`: where her wrist rests from her shoulder, to her right, up and before her, in
       metres: the upper arm hanging, the forearm reaching forward level (her arm is 0.46 m to the wrist); it follows the
       wick by `follow`: half its way to her left or right, half its rise. `hold`: a probe's seam, a moment of her round
       to stand at; null in play) */
    /* (v26.3: Chad, 13 Nov 2026, "This arm is natural to you?" and "Biggest joke ever to see you call that arm natural", of
       her from her left side. MEASURED (tools/probes/jointscan.mjs): her elbow 4.5 cm behind her shoulder and folded 115
       degrees, her wrist 17 cm before her shoulder and bent 43 degrees toward the little finger, past what a wrist does.
       Why: she stood so near the wicks that the taper's 0.73 m from wrist to tip drew her hand back to her chest, the elbow
       solved toward a point behind her, and the taper leaned toward the thumb (up, her thumb being on top) so the hand
       had to bend down hard to bring it to the wick. A real woman lighting a candle with a long taper (photographed for
       it: masters/v26.3/make.sh) holds the elbow at her side under the shoulder, the forearm forward and near level, the
       taper along her fingers and a little down. So: `back`, she stands 6 cm further from the table; `wrist`, her wrist's
       place 24 cm before her shoulder, 22 under it, 6 out; `slant`, the taper a little toward the little finger (down);
       and her elbow solved toward a point under the shoulder, a little out and a little forward (taperTick)) */
    const TAPER = { at: [1.5, -9.25], back: 0.06, held: 0.12, len: 0.70, T: 12.5, slant: -0.1, hinge: [0.607, 0, -0.794], wrist: [-0.06, -0.22, 0.24], follow: [0.5, 0.5], roll: 0.65, turn: 0.7 };
    const taper = (() => {
      const y = TABLES.tops[0] + 0.245;
      const P = mkPerson('e4devf', TAPER.at[0], TAPER.at[1] + TAPER.back, Math.PI, { take: 'Idle_3', phase: 0.63, parent: dayOne, hidden: true, blobW: 0.8, blobD: 0.7 });
      P.htLate = true;                                                         // (her hands are held true after her arm is laid: taperTick)
      const g = stand('w3taper', 0, -40, 0, 0, { parent: dayOne, near: true }); g.visible = false;
      const gF = new THREE.PlaneGeometry(1, 1); gF.translate(0, 0.5, 0);
      const fl = new THREE.Mesh(gF, B({ map: tex(makeFlame(THREE, cnv)), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false, side: THREE.DoubleSide }));
      fl.renderOrder = 4; fl.visible = false; fl.frustumCulled = false; dayOne.add(fl); owned.push(fl);
      cast.taper = P; castBlock.taper = new THREE.Box3(new THREE.Vector3(0, 60, 0), new THREE.Vector3(0, 61, 0));
      /* two wicks of the front row (b_world2.js: every 0.33 m along z -10.09), and the taper held up between them (v26.1:
         it was drawn back 15 cm and up 20; with a taper this long that brought her hand to her shoulder, the elbow folded
         141 degrees and the wrist bent 74: measured, and moved out to where her arm holds it at rest) */
      return { P, g, fl, on: false, W: [[1.32, y, -10.09], [0.99, y, -10.09], [1.15, y + 0.12, -10.03]], tip: new THREE.Vector3(), hold: null };
    })();
    /* where the taper's tip is asked to be at a moment of her round (seconds), eased from stop to stop */
    const _tpA = [0, 0, 0];
    function taperAim(t) {
      const W = taper.W, u = ((t % TAPER.T) + TAPER.T) % TAPER.T;
      /* at the first wick 3 s; over to the second 1.5; there 3; drawn back 1.5; held back 2; down to the first 1.5 */
      const leg = (a, b, k, lift) => { const e = smo(c01(k)); _tpA[0] = lp(a[0], b[0], e); _tpA[1] = lp(a[1], b[1], e) + lift * Math.sin(Math.PI * e); _tpA[2] = lp(a[2], b[2], e); return _tpA; };
      if (u < 3) return leg(W[0], W[0], 0, 0);
      if (u < 4.5) return leg(W[0], W[1], (u - 3) / 1.5, 0.05);
      if (u < 7.5) return leg(W[1], W[1], 0, 0);
      if (u < 9) return leg(W[1], W[2], (u - 7.5) / 1.5, 0);
      if (u < 11) return leg(W[2], W[2], 0, 0);
      return leg(W[2], W[0], (u - 11) / 1.5, 0);
    }
    const _tpS = new THREE.Vector3(), _tpF = new THREE.Vector3(), _tpN = new THREE.Vector3(), _tpP = new THREE.Vector3(), _tpQ = new THREE.Quaternion(), _tpY = new THREE.Vector3(0, 1, 0), _tpC = new THREE.Vector3(),
          _tpT = new THREE.Vector3(), _tpW = new THREE.Vector3();
    const _tpR = new THREE.Vector3(), _tpU = new THREE.Vector3(), _tpB = new THREE.Vector3(), _tpPole = new THREE.Vector3(), _tpG = new THREE.Vector3(), _tpE = new THREE.Vector3(),
          _tpHf = new THREE.Vector3(), _tpHn = new THREE.Vector3(), _tpHa = new THREE.Vector3(), _tpHd = new THREE.Vector3(), _tpM = new THREE.Matrix4(), _tpM2 = new THREE.Matrix4(),
          _tpQ2 = new THREE.Quaternion(), _tpQ3 = new THREE.Quaternion(), _tpAim = new THREE.Vector3(), _tpD = new THREE.Vector3(), _tpQT = new THREE.Quaternion(), _tpQ4 = new THREE.Quaternion();
    /* her hand from her forearm's line: the fingers along it, bent ten degrees down at the wrist; the palm to her right (her
       middle: this is her left hand) and a little down, so the first finger and the thumb are on top (across, for a left
       hand, runs from the little finger to the first: armsOf); the taper out along the fingers, leaning by TAPER.slant
       toward the thumb (since v26.3 a negative lean: toward the little finger, down, as a held taper points to a wick
       below the hand) */
    function taperHand(fore, asIs) {
      if (asIs) _tpHf.copy(fore); else _tpHf.copy(fore).addScaledVector(_tpU, -0.18).normalize();
      _tpHn.copy(_tpR).addScaledVector(_tpU, -0.3); _tpHn.addScaledVector(_tpHf, -_tpHn.dot(_tpHf)).normalize();
      _tpHa.crossVectors(_tpHn, _tpHf).normalize();
      _tpHd.copy(_tpHf).addScaledVector(_tpHa, TAPER.slant).normalize();
    }
    function taperTick(t) {
      const T = taper, P = T.P;
      if (!T.on || !P.ready || !dayOne.visible) { if (P.ready) { P.group.rotation.y = Math.PI; handsTrue(P); } if (T.g.visible) { T.g.visible = false; T.fl.visible = false; } return; }
      const As = armsOf(P), a = As && As.L; if (!a) { handsTrue(P); return; }
      /* HOW SHE HOLDS IT, v26.1 (Chad, 12 Nov 2026: "The lady standing at the front of the altar lighting the candles have
         very weird distorted arms and hands while lighting the candle"). Photographed from her side, the old ask had her
         elbow solved by the shortest arc and her hand then turned to whatever the taper's line asked: the wrist folded
         back over the forearm and the taper ran through the hand at her waist. Now it is solved as a person holds a taper
         to a candle on a table before her, from the hand outward and in one pass (a first try moved the wrist by what the
         tip missed and solved again: the taper's half-metre lever swung the tip further each round, and her hand rose
         over her head):
         1. her wrist's RESTING PLACE is taken from her own shoulder (TAPER.wrist): the upper arm hanging, the forearm
            reaching forward level, the elbow near a right angle (a first try set the hand a fixed way back from each wick:
            the far wick, 0.4 m to her left, was then out of her reach, and the near one folded the wrist 54 degrees);
         2. the TAPER'S LINE is from that place to the wick; the hand is turned to carry it as a pen is held: the fingers
            along the line less the slant toward the thumb, the palm toward her middle and a little down, so the thumb
            and the first finger are on top;
         3. the WRIST is where that hand, so turned, puts the taper's tip on the wick; the arm is solved to it once,
            bending about its own measured hinge (armHinge; TAPER.hinge), the elbow down, a little out and back */
      /* (taperAim answers an array, read here as a point: copied as it was, v26.1's first build solved her arm from NaN and
         she stood with no left arm and no taper) */
      const Q = _tpAim.fromArray(taperAim(T.hold != null ? T.hold : t)), Lt = TAPER.len - TAPER.held + 0.012;
      /* SHE TURNS TOWARD THE WICK SHE LIGHTS (v26.3: reaching to the far wick, 0.51 m to her left, with her body square to
         the table, her arm went all but straight and her wrist bent 35 degrees toward the thumb: tools/probes/jointscan.mjs).
         A person lighting a row of candles turns her body to each: TAPER.turn of the way from square to facing the
         wick, on the day's clock, so a seek lands on the same turn; square again when she is not lighting */
      { let dY = Math.atan2(Q.x - P.group.position.x, Q.z - P.group.position.z) - Math.PI; while (dY > Math.PI) dY -= 2 * Math.PI; while (dY < -Math.PI) dY += 2 * Math.PI;
        P.group.rotation.y = Math.PI + TAPER.turn * dY; }
      P.group.updateWorldMatrix(true, true); P.group.getWorldQuaternion(_tpQ);
      _tpR.set(-1, 0, 0).applyQuaternion(_tpQ); _tpU.set(0, 1, 0); _tpB.set(0, 0, 1).applyQuaternion(_tpQ);   // her right, up, her front
      _tpPole.copy(_tpU).multiplyScalar(-1).addScaledVector(_tpR, -0.15).addScaledVector(_tpB, 0.15).normalize();   // the elbow: down under the shoulder, a little out to her left and forward (v26.3)
      hingeOf(a, 1, TAPER.hinge);
      if (!a.wrote) { a.qUp.copy(a.up.quaternion); a.qFore.copy(a.fore.quaternion); a.qHand.copy(a.hand.quaternion); a.wrote = true; }   // (armsBack gives them back before the mixer: v11.5)
      /* 1. her wrist's resting place (and where the wick takes it: a wick off to her left turns the forearm that way, not
         the wrist; a raised one raises the hand. Measured on the first pass of this: the wick 0.35 m to her left bent the
         wrist 45 degrees sideways, the raised one 42 degrees up) */
      a.up.getWorldPosition(_tpS); _tpC.copy(Q).sub(_tpS);
      const side = _tpC.dot(_tpR) - TAPER.wrist[0], rise = Q.y - taper.W[0][1];
      _tpS.addScaledVector(_tpR, TAPER.wrist[0] + TAPER.follow[0] * side).addScaledVector(_tpU, TAPER.wrist[1] + TAPER.follow[1] * rise).addScaledVector(_tpB, TAPER.wrist[2]);
      /* 2. the taper's line, and the hand turned to carry it (the fingers' line found in three rounds: it leans off the
         taper by the slant, which is measured about the fingers themselves) */
      _tpD.copy(Q).sub(_tpS).normalize(); _tpHf.copy(_tpD);
      for (let it = 0; it < 3; it++) { taperHand(_tpHf, true); _tpHf.copy(_tpD).addScaledVector(_tpHa, -TAPER.slant).normalize(); }
      taperHand(_tpHf, true);
      /* 3. the wrist that puts the tip on the wick, and the arm to it */
      _tpG.copy(Q).addScaledVector(_tpHd, -Lt).addScaledVector(_tpHf, -a.palm * 0.85).addScaledVector(_tpHa, -0.02).addScaledVector(_tpHn, -0.012);
      armHinge(a, _tpG, _tpPole);
      /* the hand turned to it: its own measured axes (across, palm, fingers) onto the ones asked */
      _tpM.makeBasis(_tpHa, _tpHn, _tpHf); _tpM2.makeBasis(a.aL, a.nL, a.fL).transpose(); _tpM.multiply(_tpM2); _tpQ2.setFromRotationMatrix(_tpM);
      /* THE FOREARM TAKES ITS SHARE OF THE TURN (v26.3: Chad, 13 Nov 2026, "the candle lighter female's arm still looks thin
         and distorted and strange"). The hand's turn about the forearm itself was all laid at the wrist, so the skin of
         her forearm, which rides both, was wrung: photographed from her left and from before her, half a forearm's width
         and pinched at the elbow. A forearm turns along its length (the radius rolls round the ulna), so TAPER.roll of
         that turn is laid on the forearm, about its own line, and the wrist keeps the rest; the hand ends where it was
         asked to be. T.twist keeps the turn read, in degrees, for a probe */
      a.fore.getWorldPosition(_tpE); a.hand.getWorldPosition(_tpW); _tpW.sub(_tpE).normalize();
      a.hand.getWorldQuaternion(_tpQ3); _tpQ3.invert().premultiply(_tpQ2);                  // (the turn still to make, in the world)
      { const d = _tpQ3.x * _tpW.x + _tpQ3.y * _tpW.y + _tpQ3.z * _tpW.z; _tpQT.set(_tpW.x * d, _tpW.y * d, _tpW.z * d, _tpQ3.w);
        if (_tpQT.lengthSq() > 1e-12) { _tpQT.normalize(); T.twist = +(2 * Math.atan2(d, _tpQ3.w) * 180 / Math.PI).toFixed(1);
          _tpQ3.identity().slerp(_tpQT, TAPER.roll); a.fore.getWorldQuaternion(_tpQ4); _tpQ4.premultiply(_tpQ3);
          a.fore.parent.getWorldQuaternion(_tpQ3); a.fore.quaternion.copy(_tpQ3.invert().multiply(_tpQ4)); a.fore.updateWorldMatrix(false, true); } }
      a.hand.parent.getWorldQuaternion(_tpQ3); a.hand.quaternion.copy(_tpQ3.invert().multiply(_tpQ2)); a.hand.updateWorldMatrix(false, true);
      /* THE ANSWER: the taper lies where the hand came to be, between the thumb and the first finger */
      a.hand.getWorldPosition(_tpS); a.hand.getWorldQuaternion(_tpQ);
      _tpF.copy(a.fL).applyQuaternion(_tpQ).normalize(); _tpN.copy(a.nL).applyQuaternion(_tpQ).normalize(); _tpW.crossVectors(_tpN, _tpF);
      _tpT.copy(_tpF).addScaledVector(_tpW, TAPER.slant).normalize();
      _tpP.copy(_tpS).addScaledVector(_tpF, a.palm * 0.85).addScaledVector(_tpW, 0.02).addScaledVector(_tpN, 0.012);
      T.g.position.copy(_tpP).addScaledVector(_tpT, -TAPER.held); T.g.quaternion.setFromUnitVectors(_tpY, _tpT); T.g.visible = true;
      T.tip.copy(_tpP).addScaledVector(_tpT, Lt);
      curlFingers(P, 'L', 0.62);
      handsTrue(P);
      camera.getWorldPosition(_tpC);
      const fk = 0.84 + 0.11 * Math.sin(t * 9.1) + 0.05 * Math.sin(t * 23.7);
      T.fl.position.copy(T.tip); T.fl.rotation.set(0, Math.atan2(_tpC.x - T.tip.x, _tpC.z - T.tip.z), 0.06 * Math.sin(t * 2.3)); T.fl.scale.set(0.026 * (1.12 - 0.12 * fk), 0.062 * fk, 1); T.fl.visible = true;
    }

    /* ================================================================ THE CHILDREN
       (the plan's 4.1: "a full ground, children running"; 3.7: "children among them"; photographs 1 and 11: a small girl
       among the people in white.) Found unbuilt by the same audit. A girl of seven and a boy of five, made here end to
       end like every person (masters/v26.0/people; nobody in a photograph is copied). WHILE THE GROUND GATHERS (the
       `arrive` formation) they chase one another along one line across the open turf south of the rows, between two
       places where they stop for breath: beside Ton's table, inside the first frame he sees, and on the turf before the
       chief canopy. The first run comes IN, so they are seen running in play's first seconds. AT THE BLESSINGS (`bless`,
       `photo`) each stands by a grown person at a master's seat, as the photographs have them.
       A running child is not solid: each stops short of him, and of the other, and waits. Their state is a run's, so it
       is integrated on the wall clock while he plays (frozen under a panel), set again by every setFormation (reset()
       names one), and in a film of the gathering they are not drawn (a film is its own clock's: v6.4). */
    const KID = { gap: 0.7, V: 2.5, acc: 4.5, restW: 7.5, restE: 9.5, lag: 0.9, give: 1.25 };
    /* (each: where the child stands, and what it faces: the girl beside the man at the edge of the throng before
       Grandmaster Pho's bench, the boy beside the one who stands behind the kneelers at the west tent) */
    const KID_STAND = [(() => { const [x, z] = benchAt(-3.5, 3.45); return [x, z, PHO_AT[0], PHO_AT[1]]; })(), [-5.0, 0.15, -10.17, -0.95]];
    const kidPath = (() => {
      const pts = [[-4.15, 7.3], [-1.6, 6.95], [0.6, 7.6], [1.25, 9.4], [0.3, 11.1]], out = [], N = 14;
      const cr = (p0, p1, p2, p3, t) => 0.5 * ((2 * p1) + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t * t + (-p0 + 3 * p1 - 3 * p2 + p3) * t * t * t);
      for (let i = 0; i < pts.length - 1; i++) { const a = pts[Math.max(0, i - 1)], b0 = pts[i], c = pts[i + 1], d = pts[Math.min(pts.length - 1, i + 2)];
        for (let k = 0; k < N; k++) out.push([cr(a[0], b0[0], c[0], d[0], k / N), cr(a[1], b0[1], c[1], d[1], k / N), 0]); }
      out.push([pts[pts.length - 1][0], pts[pts.length - 1][1], 0]);
      let L = 0; for (let i = 1; i < out.length; i++) { L += Math.hypot(out[i][0] - out[i - 1][0], out[i][1] - out[i - 1][1]); out[i][2] = L; }
      return { pts: out, L };
    })();
    /* the place s metres along it, and the way it runs there (west to east) */
    function kidAt(s, o) {
      const A = kidPath.pts; s = Math.max(0, Math.min(kidPath.L, s)); let i = 1; while (i < A.length - 1 && A[i][2] < s) i++;
      const a = A[i - 1], b0 = A[i], dl = Math.max(1e-6, b0[2] - a[2]), k = (s - a[2]) / dl;
      o.x = lp(a[0], b0[0], k); o.z = lp(a[1], b0[1], k); o.hx = (b0[0] - a[0]) / dl; o.hz = (b0[1] - a[1]) / dl; return o;
    }
    const kids = [['e4girl', 0.3, 'Run_02'], ['e4boy', 0.71, 'Run_03']].map(([key, phase, run], i) => {
      const P = mkPerson(key, 0, 0, 0, { take: 'Idle_3', phase, parent: dayOne, hidden: true, blobW: 0.55, blobD: 0.5, lodK: 0.66, pace: true });
      P.noBlock = true; cast[i ? 'boy' : 'girl'] = P; castBlock[i ? 'boy' : 'girl'] = new THREE.Box3(new THREE.Vector3(0, 60, 0), new THREE.Vector3(0, 61, 0));
      return { P, i, s: 0, v: 0, to: 0, wait: 0, run, moving: false, ry: 0, looks: false };
    });
    const kidsDir = { ph: '', t: 0, hold: false, toss: null, stops: 0 };
    const _ko = { x: 0, z: 0, hx: 0, hz: 1 }, _ko2 = { x: 0, z: 0, hx: 0, hz: 1 };
    function kidsForm(name) {
      const run = name === 'arrive';
      kidsDir.ph = run ? 'runW' : ''; kidsDir.t = 0; kidsDir.hold = false; kidsDir.toss = null; kidsDir.stops = 0;
      for (const K of kids) { const P = K.P; K.v = 0; K.moving = false; K.looks = false; P.noBlock = run; P.rate = 1;
        whenReady(P, () => { gaze(P, null); rest(P, 0); });
        if (run) { K.s = Math.min(kidPath.L, kidPath.L * 0.62 + K.i * 1.5); K.to = K.i * KID.gap; K.wait = 0.15 + K.i * 0.35;
          kidAt(K.s, _ko); K.ry = Math.atan2(-_ko.hx, -_ko.hz); put(P, _ko.x, _ko.z, K.ry); }
        else { const [x, z, tx, tz] = KID_STAND[K.i]; K.ry = faceTo(x, z, tx, tz); put(P, x, z, K.ry); } }
    }
    function kidsTick(wdt, st) {
      const D = kidsDir; if (!D.ph || !dayOne.visible) return;
      /* (not drawn in a film of the gathering; held as they are under a panel, their running stopped with them) */
      const drawn = st !== 'cine';
      for (const K of kids) { const P = K.P; if (P.ready && P.group.visible !== drawn) { P.group.visible = drawn; P.hidden = !drawn; } }
      if (st !== 'play') { for (const K of kids) if (K.moving) K.P.rate = 0; return; }
      D.t += wdt;
      const running = D.ph === 'runW' || D.ph === 'runE', dir = D.ph === 'runE' ? 1 : -1;
      let there = true;
      for (const K of kids) {
        const P = K.P; if (!P.ready) { there = false; continue; }
        const O = kids[1 - K.i]; let want = 0;
        kidAt(K.s, _ko);
        const px = yaw.position.x - _ko.x, pz = yaw.position.z - _ko.z, pd = Math.hypot(px, pz);
        if (running) { const left = Math.abs(K.to - K.s);
          if (K.wait > 0) K.wait -= wdt;
          else if (left > 0.02) { want = Math.min(KID.V, Math.sqrt(2 * KID.acc * left));
            /* he is in the way, or the other child is: slower, then stopped short, and waiting */
            if ((px * _ko.hx + pz * _ko.hz) * dir > -0.2 && pd < KID.give + 0.75) want *= c01((pd - KID.give) / 0.75);
            const ds = (O.s - K.s) * dir; if (ds > 0 && ds < 1.05) want *= c01((ds - 0.55) / 0.5); }
          if (left > 0.05) there = false; }
        K.v = want > K.v ? Math.min(want, K.v + KID.acc * wdt) : Math.max(want, K.v - KID.acc * 1.6 * wdt);
        if (K.v > 0) { K.s += dir * Math.min(K.v * wdt, Math.abs(K.to - K.s)); kidAt(K.s, _ko); }
        const mv = K.v > 0.35;
        if (mv !== K.moving) { K.moving = mv; take(P, mv ? K.run : 'Idle_3', mv ? 0.18 : 0.3); if (!mv) P.rate = 1; }
        /* (the run's own rate from the ground covered: v7.1) */
        if (K.moving) P.rate = Math.max(0.6, Math.min(1.3, K.v / ((P.pace && P.pace[K.run]) || KID.V)));
        /* running, a child faces the way it runs; stopped, it turns to the other child; and it looks at a grown man who comes near */
        let ry = K.ry;
        if (K.v > 0.05) ry = Math.atan2(_ko.hx * dir, _ko.hz * dir);
        else if (Math.abs(O.s - K.s) > 0.2) { kidAt(O.s, _ko2); ry = Math.atan2(_ko2.x - _ko.x, _ko2.z - _ko.z); }
        const dq = Math.atan2(Math.sin(ry - K.ry), Math.cos(ry - K.ry)); K.ry += Math.max(-7 * wdt, Math.min(7 * wdt, dq));
        P.group.position.set(_ko.x, 0, _ko.z); P.group.rotation.y = K.ry;
        const looks = !K.moving && pd < 3.2;
        if (looks !== K.looks) { K.looks = looks; gaze(P, looks ? 'lens' : null, { reach: 0.9, secs: 0.7 }); }
      }
      if (running && (there || D.t > 14)) { D.ph = D.ph === 'runW' ? 'restW' : 'restE'; D.t = 0;
        /* AT EVERY STOP THEY PLAY WITH THE PETALS (Chad, 12 Nov 2026: "The kids only play with the flowers once, and never
           again. I want the kids to play the flowers more often as they loop running around. It should happen more than
           once, and keep looping it every cycle"): a second after they stop, one jumps for joy and throws a handful up over
           the other, and the other answers a moment later; who throws first changes from stop to stop (d_play.js kidThrow).
           Not when they have come to watch him with Ton (kidsCall holds them: the girl's own throw is that stop's) */
        D.stops++; const a = D.stops % 2, b = 1 - a;
        D.toss = D.hold ? null : [{ i: a, at: 1.0 }, { i: b, at: 2.7 }]; }
      else if (!running && D.toss && D.toss.length && !D.hold && D.t >= D.toss[0].at) {
        const T0 = D.toss.shift(); kidThrow(kids[T0.i], kids[1 - T0.i]); }
      else if (!running && !D.hold && D.t > (D.ph === 'restW' ? KID.restW : KID.restE)) {
        const east = D.ph === 'restW'; D.ph = east ? 'runE' : 'runW'; D.t = 0;
        /* whoever stands further along goes first; the other gives chase a moment later */
        const order = kids.slice().sort((p, q) => east ? q.s - p.s : p.s - q.s);
        order[0].to = east ? kidPath.L : 0; order[0].wait = 0;
        order[1].to = east ? kidPath.L - KID.gap : KID.gap; order[1].wait = KID.lag; }
    }
    /* THE CHILDREN COME TO SEE (the plan's §3.7, picture 2: "a handful of petals thrown beside him (play)"). When he
       speaks to Ton they run to their place by Ton's table, wherever their chase has them, and stay there while the two
       men talk (children watch a stranger being given something); when the bai sri is in his hands the girl jumps for
       joy and throws up a handful of the petals that lie everywhere (d_play.js kidsToss, which owns the clock and the
       sound). Then their chase goes on. */
    function kidsCall() {
      const D = kidsDir; if (formNow !== 'arrive' || !D.ph) return;
      D.hold = true; D.toss = null;
      if (D.ph === 'restW') { D.t = 0; return; }
      if (D.ph === 'runW') return;                                               // (already on their way there)
      D.ph = 'runW'; D.t = 0;
      const order = kids.slice().sort((p, q) => p.s - q.s);
      order[0].to = 0; order[0].wait = 0; order[1].to = KID.gap; order[1].wait = KID.lag;
    }

    /* ================================================================ THE DANCERS ON THE GROUND
       THEY LOOP (Chad, 12 Nov 2026: "can you make the dancers dance more often in a looping manner going/dancing from
       one end of the venue, then dancing to the other end, then repeat and loop, during the gameplay sequence. The real
       full dance happens in the cutscene, while this looping walk dance is just like a simple walk and dance at the same
       time, looping for more visual flair."). This is the later word on the dancers in play, and it replaces what the
       release's closing pass built from the plan's §3.7 (a file that set off as the bai sri came into his hands,
       stood at his way until he came up past the first tent, crossed once and waited before the masters' tent).
       All of day one's play the six go up and down the open band between the rows in three pairs, in their WALK-DANCE
       (c_cast.js: a walk with the arms out and rising and falling in turn, written for them), from the east end of the
       band to the west end, where each turns about by way of the offering tables, stands a breath, and comes back; and
       again. The film's dance is its own stretch, on its own cut:
         `loop`   while the ground gathers and through his respects (the formation `arrive`), and again at the blessings
                  (`bless`: a shorter band, short of those who kneel before the west tent);
         `still`  for the homage: when the chant begins they stop where they are, turn to the offering tables and
                  stand, as the whole ground does (dancersStill);
         `dance`  the film's dance, on their dance places (the film poses the drivers and shows the group itself);
         `home`   any other ground of day one (the photograph): resting in three pairs by the monks' tent.
       Which of these it is on a Continue is read from the formation (dancersForm), never stored: a loop begins at the
       band's east end. A file is one thing: if he steps into its way the whole of it stops and waits for him, and goes
       on when he is clear (so nobody walks through anybody, and each column is solid wherever she is). The two drivers
       walk on the spot and the members travel (c_cast.js WALKS), each driver's rate from the ground the file covers
       (v7.1); pairs are one of each body, the two bodies half a stride apart so no pair steps together. A walking
       dancer is turned by her take's own heading, so her steps fall along the file's line (eased in and out with the
       take: standing, she faces the way she stands). On the ground all six are worn the same way round (a troupe's
       shawls lie on the same shoulder; the film's dance mirrors every other one, as it did). */
    const DWALK = { z: -0.75, lat: 0.42, gap: 1.25, x0: 2.2, x1: { arrive: -7.0, bless: -3.9 }, rate: 0.72, halt: 1.15, up: 0.6, down: 1.6, take: 'walkdance',
                    turn: 1.5, rest: 0.9, first: 1.2 };
    const DHOME = [[7.35, 1.05], [8.15, 1.0], [7.3, 1.95], [8.2, 2.0], [7.75, 2.85], [8.55, 2.8]];
    /* (d: how far the file has come from the band's east end; dir: +1 going west, -1 coming back; at: 'walk', or 'turn'
       at an end, t seconds into it) */
    const dancersDir = { ph: 'loop', d: 0, dir: 1, at: 'turn', t: 0, v: 0, walking: false, clear: 0, n: 0, wk: 0, laps: 0 };
    const danceBlock = dancers.m.map(() => new THREE.Box3(new THREE.Vector3(0, 60, 0), new THREE.Vector3(0, 61, 0)));
    const dancerSpot = (i, d) => { const pair = i >> 1, side = i & 1 ? 1 : -1; return [DWALK.x0 + pair * DWALK.gap - d, DWALK.z + side * DWALK.lat]; };
    const dLen = () => DWALK.x0 - (formNow === 'bless' ? DWALK.x1.bless : DWALK.x1.arrive);
    const NORTH = Math.PI, facing = (dir) => (dir > 0 ? -Math.PI / 2 : Math.PI / 2);     // (a body at 0 faces +z: west is -90 degrees, the tables' way 180)
    function dancersPlace() {
      /* (their columns stand wherever day one is the ground, shown or put away for a film; never on the next morning) */
      const D = dancersDir, on = dayOne.visible, r = 0.3;
      dancers.m.forEach((M0, i) => { let x, z, ry;
        if (D.ph === 'dance') { [x, z] = dancers.at[i]; ry = dancers.ry; }
        else if (D.ph === 'home') { [x, z] = DHOME[i]; const o = DHOME[i ^ 1]; ry = faceTo(x, z, o[0], o[1]) + (i & 1 ? 0.25 : -0.2); }
        else { [x, z] = dancerSpot(i, D.d); ry = D.ph === 'still' ? NORTH : facing(D.dir); }
        M0.group.position.set(x, 0, z); M0.group.rotation.y = ry; M0.lvNow = -1;
        M0.group.scale.x = D.ph === 'dance' && M0.o.mirror ? -M0.s : M0.s;
        danceBlock[i].min.set(x - r, on && D.ph !== 'dance' ? 0 : 60, z - r); danceBlock[i].max.set(x + r, on && D.ph !== 'dance' ? 1.5 : 61, z + r); });
    }
    /* where they are for this formation: on a ground they loop on, at the band's east end and about to set off west */
    function dancersForm(name = formNow) {
      const D = dancersDir; D.v = 0; D.clear = 0; D.walking = false; D.wk = 0; D.n++;
      D.ph = name === 'arrive' || name === 'bless' ? 'loop' : 'home';
      D.d = 0; D.dir = 1; D.at = 'turn'; D.t = DWALK.turn + DWALK.rest - DWALK.first; D.laps = 0;   // (they stand a moment, then set off)
      for (const Dr of [dancers.A, dancers.B]) { Dr.rate = 1; rest(Dr, 0); }
      for (const M0 of dancers.m) M0.turn = null;
      dancersPlace();
    }
    /* the film's dance: on their dance places (the film poses the drivers and shows the group itself) */
    function dancersDance() { const D = dancersDir; D.ph = 'dance'; D.v = 0; D.walking = false; D.wk = 0; for (const M0 of dancers.m) M0.turn = null; dancersPlace(); }
    /* THE HOMAGE: they stop where they are and turn to the offering tables (d_play.js, as the chant begins) */
    function dancersStill() {
      const D = dancersDir; if (D.ph !== 'loop') return;
      D.ph = 'still'; D.v = 0; D.wk = 0;
      if (D.walking) { D.walking = false; for (const Dr of [dancers.A, dancers.B]) { Dr.rate = 1; rest(Dr, 0.6); } }
      for (const M0 of dancers.m) M0.turn = { from: M0.group.rotation.y, to: NORTH, t: 0, secs: 1.3 };
    }
    function dancersTick(wdt, st) {
      const D = dancersDir;
      if (st === 'cine') return;                                                 // (a film shows or hides them itself: y_stage.js)
      const show = dayOne.visible;
      /* (shown, and solid, exactly while day one is the ground: a film puts the group away without telling this, and the
         night between changes the day inside a film, so what was last done is kept here and not read off the group) */
      if (danceG.visible !== show || D.shown !== show) { D.shown = show; danceG.visible = show; dancers.A.idle = dancers.B.idle = !show; dancersPlace(); }
      if (!show || st !== 'play') { if (D.walking) { dancers.A.rate = 0; dancers.B.rate = 0; } return; }
      if (D.ph === 'dance') dancersForm();                                       // (the film is over and nothing has said where they are: where the formation has them)
      if (D.ph !== 'loop') return;
      const A = dancers.A, B2 = dancers.B; if (!A.ready || !B2.ready) return;
      /* (a probe's still: tools/probes/e4c3beats.mjs holds the file in mid-step to photograph a walk on a box that draws a
         frame a second; never set in play) */
      if (D.freeze) { A.rate = 0; B2.rate = 0; return; }
      const TK = DWALK.take, L = dLen(), r = 0.3;
      /* (each body's own pace over the ground and the way its walk goes from its own front: c_cast.js `pace`. The file
         goes at the slower body's pace, slowed to a dance's, and each take is slowed to the file, so both walk with
         their feet planted) */
      const pA = (A.pace && A.pace[TK]) || 0.9, pB = (B2.pace && B2.pace[TK]) || 0.9, V = Math.min(pA, pB) * DWALK.rate;
      const hOf = (Dr) => (Dr.heading && Dr.heading[TK] != null ? Dr.heading[TK] : 0);
      if (D.at === 'turn') {
        /* at an end: stopped, each turns about (by way of the offering tables), they stand a breath, and set off again */
        D.t += wdt;
        if (D.t >= DWALK.turn + DWALK.rest) { D.at = 'walk'; D.clear = 1; }
      } else {
        /* is he in their way? within reach of any of them, or just ahead of the two who lead */
        let near = false; const px = yaw.position.x, pz = yaw.position.z, lead = D.dir > 0 ? 0 : dancers.m.length - 2;
        for (let i = 0; i < dancers.m.length && !near; i++) { const [x, z] = dancerSpot(i, D.d); if (Math.hypot(px - x, pz - z) < DWALK.halt) near = true; }
        { const [lx] = dancerSpot(lead, D.d); if (Math.hypot(px - (lx - D.dir * 0.75), pz - DWALK.z) < 1.0) near = true; }
        D.clear = near ? 0 : D.clear + wdt;
        /* (they slow into the end of the band: no faster than a stop from there asks) */
        const left = D.dir > 0 ? L - D.d : D.d, cap = Math.sqrt(Math.max(0, 2 * DWALK.down * 0.5 * left)) + 0.04;
        const want = near ? 0 : (D.v < 0.01 && D.clear < 0.4 ? 0 : Math.min(V, cap));   // (stopped for him, they wait a moment after he is clear)
        D.v = want > D.v ? Math.min(want, D.v + DWALK.up * wdt) : Math.max(want, D.v - DWALK.down * wdt);
        D.d = Math.max(0, Math.min(L, D.d + D.dir * D.v * wdt));
        if ((D.dir > 0 ? L - D.d : D.d) < 1e-3) {                                // the end of the band: they stop, and turn about
          D.v = 0; D.at = 'turn'; D.t = 0; D.laps++;
          dancers.m.forEach((M0) => { M0.turn = { from: M0.group.rotation.y, dq: -D.dir * Math.PI, t: 0, secs: DWALK.turn }; });
          D.dir = -D.dir; }
      }
      const mv = D.at === 'walk' && D.v > 0.08;
      if (mv !== D.walking) { D.walking = mv;
        if (mv) { take(A, TK, 0.5, true); take(B2, TK, 0.5, true); if (B2.acts[TK]) B2.acts[TK].time = B2.acts[TK].getClip().duration * 0.5; }
        else { A.rate = 1; B2.rate = 1; rest(A, 0.5); rest(B2, 0.5); } }
      if (D.walking) { A.rate = Math.max(0.35, Math.min(1.2, D.v / pA)); B2.rate = Math.max(0.35, Math.min(1.2, D.v / pB)); }
      D.wk = D.walking ? Math.min(1, D.wk + wdt / 0.5) : Math.max(0, D.wk - wdt / 0.5);
      /* (a body is turned so that its WALK goes along the band, not its front: by the take's own heading, eased in with the take) */
      const wkS = D.wk * D.wk * (3 - 2 * D.wk);
      dancers.m.forEach((M0, i) => { const [x, z] = dancerSpot(i, D.d); M0.group.position.set(x, 0, z); if (D.at === 'walk' && !M0.turn) M0.group.rotation.y = facing(D.dir) - hOf(M0.D) * wkS;
        danceBlock[i].min.set(x - r, 0, z - r); danceBlock[i].max.set(x + r, 1.5, z + r); });
    }
    /* (a turn, eased: about at an end of the band (`dq`, the way round given), or to a facing by the shorter way (`to`);
       apart from the walk's own tick so it runs on after the state has changed) */
    function dancersTurn(wdt) {
      for (const M0 of dancers.m) { const T = M0.turn; if (!T) continue; T.t = Math.min(1, T.t + wdt / (T.secs || 0.9));
        const k = T.t * T.t * (3 - 2 * T.t), dq = T.dq != null ? T.dq : Math.atan2(Math.sin(T.to - T.from), Math.cos(T.to - T.from));
        M0.group.rotation.y = T.from + dq * k; if (T.t >= 1) M0.turn = null; }
    }

    /* WHO OF THESE IS THERE: the woman with the taper only while the ground gathers; the children all of day one (in
       their chase, kidsTick draws them); none on any other day. Each one's own flag is set (a hidden person is not
       run, and castSolid stands a column only under one who is drawn: the children's only while they stand still) */
    function extrasLive() {
      const one = dayOne.visible, tp = one && formNow === 'arrive';
      taper.on = tp; taper.P.hidden = !tp; if (taper.P.ready) taper.P.group.visible = tp;
      if (!tp) { taper.g.visible = false; taper.fl.visible = false; }
      for (const K of kids) { if (one && kidsDir.ph) continue; K.P.hidden = !one; if (K.P.ready) K.P.group.visible = one; }
      castSolid();
    }
    whenReady(taper.P, (P) => { gaze(P, taper.W[0], { reach: 0.6, secs: 0.01, down: 0 }); extrasLive(); });
    for (const K of kids) whenReady(K.P, extrasLive);
    kidsForm('arrive'); dancersForm('arrive');

    /* ================================================================ WHAT THE PLAY MOVES, AND ITS EFFECTS (the plan's §3.7)
       His bai sri (one thing all day: on Ton's table, in Ton's hands, in his own, on the mat before him, beside him on
       the carpet the next morning); the young man's; the place to kneel; a handful of petals thrown; the gold that is
       Grandmaster Pho's alone; the morning's ground mist. Everything here is built hidden, so the curtain warms it
       (v14.15), and every motion is a function of a clock it is handed (wall time in play, the film's in a film). */

    /* ---- THE BAI SRI. In the world it is the model at the size the tables wear it. IN HIS HANDS it is drawn in the
       hands' own pass, where a thing 51 cm tall at a carrying distance would fill a phone from edge to edge: it is drawn
       at BAI.hand of the model, which on a phone's frame is what a thing that size looks like held before the chest.
       HIS HANDS ARE UNDER THE FRAME'S FOOT, as they are in the photograph of one held up (7: the hands at its bowl, the
       picture cut at the wrists) and as his own would be to his own eyes (a bowl raised before the face hides the
       hands that hold it). Six ways of drawing two hands on its bowl were photographed on a phone and a desktop and
       refused: the rig's fingers cannot wrap a bowl, and an arm that points at the lens fills the screen. Chad's own
       ruling for a thing a hand cannot be made to grip is the same (v23.0: "just have the bottle animate itself"). So:
       carried, only the top of its cone stands in the frame's foot; raised, its ring of marigolds and the rim of its
       bowl. One size wherever one shot follows another is kept by never showing the two in one picture: it goes down
       under the frame's foot, and stands on the mat on the next look (v25.4).
       Each place is where its BASE stands in the hands' own frame (metres: +x right, +y up, -z ahead). */
    const BAI = { s: 0.85, hand: 0.55, yaw: 0.5, carry: [0, -0.4, -0.46], raise: [0, -0.305, -0.49], high: [0, -0.262, -0.4], down: [0, -0.62, -0.46] };
    const TON_BAI = stageList.tonBai;                                              // its place on Ton's table (b_world2.js keeps the corner by Ton free for it)
    const myBai = stand('w3baisri', TON_BAI.x, TON_BAI.y, TON_BAI.z, TON_BAI.ry, { s: BAI.s, moves: true });
    const ymBai = stand('w3baisri', 0, 0, 0, 0.6, { s: BAI.s, moves: true }); ymBai.visible = false;
    /* WHAT THOSE WHO WAIT HAVE BROUGHT (endings B and C): a small bai sri on its brass tray each, carried in both hands.
       The tray's foot is 0.19 m in radius as the model is made (tools/probes/bands.mjs), drawn here at WAIT_TRAY.s */
    const WAIT_TRAY = { s: 0.8, r: 0.19 * 0.8 };
    const waitBai = [0, 1, 2, 3].map(() => { const g = stand('w3smallbaisri', 0, 0, 0, 0, { s: WAIT_TRAY.s, moves: true }); g.visible = false; return g; });
    const handBaiHolder = new THREE.Group();                                       // (never in a scene: where the hands' copy waits when nobody holds it)
    const handBai = stand('w3baisri', 0, 0, 0, 0, { s: BAI.hand, near: true, parent: handBaiHolder });
    const baiPut = (g, x, y, z, ry) => { g.position.set(x, y, z); if (ry != null) g.rotation.y = ry; g.visible = true; };
    /* a bai sri stood on a person's two hands (the bowl's foot between the palms): where the hands are this frame */
    const _bhm = new THREE.Vector3();
    function baiOnHands(g, P, dy = -0.04) { const m = handsMid(P, _bhm); if (!m) return false; g.position.set(m.x, m.y + dy, m.z); g.visible = true; return true; }

    /* ---- THE PLACE TO KNEEL: a soft ring on the ground, breathing (white: gold is one man's) */
    const zone = (() => {
      const g = new THREE.Group(); g.visible = false; world.add(g);
      const flatM = (geo, o) => { const m = new THREE.Mesh(geo, B(Object.assign({ color: 0xffffff, transparent: true, depthWrite: false, fog: false, side: THREE.DoubleSide }, o))); m.rotation.x = -Math.PI / 2; m.renderOrder = 3; g.add(m); return m; };
      const disc = flatM(new THREE.CircleGeometry(0.4, 32), { opacity: 0.18 });
      const ring = flatM(new THREE.RingGeometry(0.36, 0.43, 40), { opacity: 0.85 }); ring.position.y = 0.003;
      const wave = flatM(new THREE.RingGeometry(0.38, 0.43, 40), { opacity: 0.7 }); wave.position.y = 0.005;
      return { g, disc, ring, wave };
    })();
    function zoneAt(p) { if (!p) { zone.g.visible = false; return; } zone.g.position.set(p.x, 0.03, p.z); zone.g.visible = true; }
    function zoneTick(now) {
      if (!zone.g.visible) return;
      const k = (now % 2) / 2;
      zone.wave.scale.setScalar(1 + k * 0.9); zone.wave.material.opacity = 0.7 * (1 - k);
      zone.ring.material.opacity = 0.62 + 0.26 * Math.sin(now * 3.1); zone.disc.material.opacity = 0.15 + 0.07 * Math.sin(now * 3.1);
    }

    /* ---- A HANDFUL OF PETALS, THROWN. One small cluster of petals drawn many times (the ground's own petal and its
       material, so no new program is compiled on screen: v15.1). Each rises from the hand, is slowed by the air, and
       flutters down to where it will lie; where it is at any age is a pure function of that age, so a film can slow a
       throw or seek through it, and play runs it on the wall clock. When it has all landed it lies there until the
       ground is reset or the day changes. */
    /* (a petal in the AIR is one petal, at its real size: the ground's cluster of sixteen, thrown past a close lens,
       was a bunch of yellow blades a hand long: photographed in the film of the festival, and refused) */
    const petalAirMat = M({ color: 0xffffff, roughness: 0.75, alphaTest: 0.45, side: THREE.DoubleSide, map: tex(makePetal(THREE, cnv)) });
    const BURSTS = 4, BURST_N = LOW ? 110 : 170;
    const bursts = [];
    { const g0 = new THREE.PlaneGeometry(1, 1);
      for (let b = 0; b < BURSTS; b++) { const im = new THREE.InstancedMesh(g0, petalAirMat, BURST_N); im.frustumCulled = false; im.visible = false; im.count = BURST_N;
        const col = new THREE.Color(); for (let i = 0; i < BURST_N; i++) { im.setMatrixAt(i, _wm.makeScale(0, 0, 0)); im.setColorAt(i, col.setRGB(1, 1, 1)); }
        im.instanceMatrix.needsUpdate = true; im.instanceColor.needsUpdate = true; world.add(im); owned.push(im);
        bursts.push({ im, on: false, t0: 0, P: [], end: 0 }); } }
    /* (v26.1: THE CHILDREN'S OWN HANDFULS, a pool of their own so their throws at every stop of their chase never take a
       master's handful off the carpet. Each is a third of a master's; what they throw lies on the turf a while and sinks
       into it (`sink`), so the pool is never taken back from a handful still to be seen) */
    const KIDB = 6, KID_N = 48, kidPool = [];
    { const g0 = new THREE.PlaneGeometry(1, 1);
      for (let b = 0; b < KIDB; b++) { const im = new THREE.InstancedMesh(g0, petalAirMat, KID_N); im.frustumCulled = false; im.visible = false; im.count = KID_N;
        const col = new THREE.Color(); for (let i = 0; i < KID_N; i++) { im.setMatrixAt(i, _wm.makeScale(0, 0, 0)); im.setColorAt(i, col.setRGB(1, 1, 1)); }
        im.instanceMatrix.needsUpdate = true; im.instanceColor.needsUpdate = true; world.add(im); owned.push(im);
        kidPool.push({ im, on: false, t0: 0, P: [], end: 0, n: KID_N }); } }
    let kidNext = 0;
    const _ptq = new THREE.Quaternion(), _pte = new THREE.Euler(), _ptp = new THREE.Vector3(), _pts = new THREE.Vector3(), _ptq2 = new THREE.Quaternion();
    const FLAT_Q = new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI / 2, 0, 0));
    let burstNext = 0;
    const PETAL_SINK = 3;                                                     // (how long a child's petal takes to go into the turf)
    /* thrown from `from` [x, y, z] so that it falls round `to` [x, z] (`r`: how wide it lands; `s`: a petal's length, 3.4 cm
       unless said: a little over life, so a throw reads across the turf; a close lens asks for less); t0 on the clock it is run on.
       `n`: how many petals of the handful there are (a child's is a third of a master's); the rest of the mesh's copies are
       never shown. Unsaid, every copy is thrown and each lands where it always did */
    function petalBurst(from, to, t0, o = {}) {
      const kid = o.pool === kidPool, CAP = kid ? KID_N : BURST_N;
      const Bu = kid ? kidPool[kidNext++ % KIDB] : bursts[burstNext++ % BURSTS], rnd = rng(o.seed || (7001 + burstNext * 131)), r = o.r != null ? o.r : 0.55, yg = o.ground != null ? o.ground : 0.014, col = new THREE.Color();
      const nShown = o.n != null ? Math.min(CAP, o.n) : CAP;
      Bu.P.length = 0; Bu.t0 = t0; Bu.on = true; Bu.end = 0; Bu.im.visible = true; Bu.sink = o.sink || 0;
      for (let i = 0; i < CAP; i++) {
        if (i >= nShown) { Bu.P.push({ late: Infinity, land: 0 }); continue; }
        const an = rnd() * 6.283, d = r * Math.sqrt(rnd()), tx = to[0] + Math.cos(an) * d, tz = to[1] + Math.sin(an) * d;
        const p = { x0: from[0] + (rnd() - 0.5) * 0.08, y0: from[1] + (rnd() - 0.5) * 0.06, z0: from[2] + (rnd() - 0.5) * 0.08, tx, tz,
                    vy: (o.up != null ? o.up : 1.9) * (0.55 + rnd() * 0.9), vt: 0.75 + rnd() * 0.75, th: 0.42 + rnd() * 0.3, ty: 0.3 + rnd() * 0.12,
                    wob: 0.05 + rnd() * 0.08, wf: 2.2 + rnd() * 2.6, wp: rnd() * 6.283, sx: 1.6 + rnd() * 3.4, sz: 1.4 + rnd() * 3.2, ry: rnd() * 6.283,
                    s: (o.s != null ? o.s : 0.034) * (0.75 + rnd() * 0.6), late: rnd() * 0.22, land: 0, yg: yg + rnd() * 0.01 };
        /* when it lands: the age at which its height meets the ground (it only falls after its apex: bisected) */
        const yAt = (a) => p.y0 + p.vy * p.ty * (1 - Math.exp(-a / p.ty)) - p.vt * (a - p.ty * (1 - Math.exp(-a / p.ty)));
        let lo = 0, hi = 12; for (let k = 0; k < 22; k++) { const m = (lo + hi) / 2; if (yAt(m) > p.yg) lo = m; else hi = m; }
        p.land = hi; Bu.end = Math.max(Bu.end, hi + p.late + (Bu.sink ? Bu.sink + PETAL_SINK + 0.1 : 0.4));
        Bu.P.push(p);
        Bu.im.setColorAt(i, col.setHSL(0.105 + rnd() * 0.04, 0.98, 0.5 + rnd() * 0.07, THREE.SRGBColorSpace));
      }
      Bu.im.instanceColor.needsUpdate = true;
      burstAt(Bu, t0);
      return Bu;
    }
    function burstAt(Bu, t) {
      if (!Bu.on) return;
      const age0 = t - Bu.t0;
      for (let i = 0; i < Bu.P.length; i++) { const p = Bu.P[i], a = Math.max(0, age0 - p.late), al = Math.min(a, p.land), kh = 1 - Math.exp(-al / p.th), ky = 1 - Math.exp(-al / p.ty);
        if (age0 < p.late) { Bu.im.setMatrixAt(i, _wm.makeScale(0, 0, 0)); continue; }
        const fl = c01((a - p.land) / 0.25 + 1) * (a >= p.land ? 1 : 0), air = a < p.land ? 1 : 0;
        const x = p.x0 + (p.tx - p.x0) * kh + Math.sin(al * p.wf + p.wp) * p.wob * air * kh, z = p.z0 + (p.tz - p.z0) * kh + Math.cos(al * p.wf * 0.8 + p.wp) * p.wob * air * kh;
        let y = a >= p.land ? p.yg : Math.max(p.yg, p.y0 + p.vy * p.ty * ky - p.vt * (al - p.ty * ky));
        /* (a child's petal, `sink` seconds after it lands, goes down into the turf over PETAL_SINK seconds and is not drawn after) */
        if (Bu.sink && a > p.land + Bu.sink) { const ks = (a - p.land - Bu.sink) / PETAL_SINK; if (ks >= 1) { Bu.im.setMatrixAt(i, _wm.makeScale(0, 0, 0)); continue; } y = p.yg - 0.03 * smo(ks); }
        _pte.set(al * p.sx, p.ry + al * 0.9, al * p.sz, 'YXZ'); _ptq.setFromEuler(_pte);
        if (a >= p.land) { _pte.set(-Math.PI / 2, 0, p.ry, 'YXZ'); _ptq2.setFromEuler(_pte); _ptq.slerp(_ptq2, smo(c01((a - p.land) / 0.18))); }
        Bu.im.setMatrixAt(i, _wm.compose(_ptp.set(x, y, z), _ptq, _pts.set(p.s, p.s, p.s))); }
      Bu.im.instanceMatrix.needsUpdate = true;
    }
    /* play's own clock runs them (a film calls burstAt with its own); one that has all landed is drawn once more and left */
    function burstsTick(t) { for (const Bu of bursts) { if (!Bu.on || Bu.film) continue; burstAt(Bu, t); if (t - Bu.t0 > Bu.end) Bu.on = false; }
      for (const Bu of kidPool) { if (!Bu.on) continue; burstAt(Bu, t); if (t - Bu.t0 > Bu.end) { Bu.on = false; Bu.im.visible = false; } } }
    function burstsClear() { for (const Bu of bursts) { Bu.on = false; Bu.film = false; Bu.im.visible = false; }
      for (const Bu of kidPool) { Bu.on = false; Bu.im.visible = false; } }
    /* (v26.2 debug) PLAY'S PETALS COME TO REST WHEN A FILM BEGINS. Play's clock throws them (burstsTick) and play's frame
       does not run under a film, so a handful still in the air when a film began hung there for the whole film: the
       festival's showed petals stuck on a kneeling man's hair and down his thigh, the same in every shot. At a film's
       first frame (its cut) each is laid where it would come to rest: a grown hand's on the turf, a child's gone into it */
    function burstsLand() {
      for (const Bu of bursts) { if (!Bu.on || Bu.film) continue; burstAt(Bu, Bu.t0 + Bu.end); Bu.on = false; }
      for (const Bu of kidPool) { if (!Bu.on) continue; burstAt(Bu, Bu.t0 + Bu.end); Bu.on = false; Bu.im.visible = false; }
    }

    /* ---- THE GOLD (the plan's §3.4: his alone; chapter 2 kept its colours and strengths for him, CLAUDE.md). Painted
       light, never a lamp (v15.1): a soft light the shape of a man sitting, behind him, in two layers (the colour laid
       on as a colour and the glow added over it: added alone over a pale ground a colour sums to white, v8.8); a fan
       of rays turning slowly behind that; a pool of it on the carpet with one slow ring; and motes rising round him,
       behind him where they would cross his body. It breathes once in five seconds. `auraAt(k, t)`: its strength and
       the clock it is run on. */
    const AURA = { hue: 0xf0a41c, glow: 0xffc65a, mote: 0xffdc8c, motes: 64 };
    const AURA_K = { shade: 0.5, hue: 0.78, glow: 0.55, rays: 0.5, pool: 0.5, ring: 0.26, mote: 1 };
    const aura = (() => {
      const g = new THREE.Group(); g.position.set(PHO_AT[0], 0, PHO_AT[1]); g.rotation.y = BENCH.ry; g.visible = false; world.add(g);
      const tBody = tex(makeAuraBody(THREE, cnv)), tRays = tex(makeAuraRays(THREE, cnv)), tDot = tex(makeGlow(THREE, cnv)), tRing = tex(makeAuraRing(THREE, cnv));
      const sprite = (map, blending, w, h, y, z, order) => {
        const m = new THREE.SpriteMaterial({ map, transparent: true, opacity: 0, depthWrite: false, fog: false, blending }); mats.push(m);
        const s = new THREE.Sprite(m); s.scale.set(w, h, 1); s.position.set(0, y, z); s.renderOrder = order; g.add(s); return s;
      };
      /* behind them all a soft dark, because light is only seen against less light (v25.5) */
      const shade = sprite(tDot, THREE.NormalBlending, 4.6, 3.8, 1.25, -0.62, 0); shade.material.color.setHex(0x0b0906);
      const hue = sprite(tBody, THREE.NormalBlending, 2.1, 2.3, 1.18, -0.4, 1);
      const rays = sprite(tRays, THREE.AdditiveBlending, 3.0, 3.0, 1.28, -0.46, 2);
      const glow = sprite(tBody, THREE.AdditiveBlending, 1.8, 2.0, 1.05, -0.36, 3);
      const flat = (map, size, y) => { const m = B({ map, transparent: true, opacity: 0, depthWrite: false, fog: false, blending: THREE.AdditiveBlending });
        const o = new THREE.Mesh(new THREE.PlaneGeometry(size, size), m); o.rotation.x = -Math.PI / 2; o.position.set(0, y, 0.5); o.renderOrder = 3; g.add(o); return o; };
      const pool = flat(tDot, 3.2, 0.024), ring = flat(tRing, 1, 0.027);
      const N = AURA.motes, r = rng(9157), seed = [];
      for (let i = 0; i < N; i++) seed.push({ a: r() * 6.283, rad: 0.4 + r() * 0.7, T: 4.4 + r() * 3.6, ph: r(), sw: 0.4 + r() * 0.8, top: 1.5 + r() * 0.8 });
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(N * 3), 3)); geo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(N * 3), 3));
      const pm = new THREE.PointsMaterial({ map: tDot, size: 0.055, sizeAttenuation: true, transparent: true, depthWrite: false, fog: false, blending: THREE.AdditiveBlending, vertexColors: true }); mats.push(pm);
      const pts = new THREE.Points(geo, pm); pts.frustumCulled = false; pts.renderOrder = 4; g.add(pts); owned.push(pts);
      return { g, shade, hue, rays, glow, pool, ring, pts, seed, tm: new THREE.Color() };
    })();
    /* ---- HIS OWN LIGHT, IN THE CLOSE (v26.8, Chad, 13 Nov 2026: "the second minigame part, instead of playing the
       minigame, just show the player hands vibrating while a glow surronding him and his hands and his bai sri. all
       around his silohuette, to show that the player is now in control while vibrating"). He is never seen (every shot
       is his eyes: v24.56), so the glow round his silhouette is drawn as he would see it: a light all round the edge of
       his sight, a sheet laid over the hands' pass and fitted to its lens each frame; and a halo round the bai sri he
       holds up, shaking in his hands. WHITE, faint warm: the gold is Grandmaster Pho's alone (v25.5). `youGlowAt(k, t,
       at, vm)`: its strength, the film's clock, where the bai sri stands, and the film's hands' pass (or null) */
    const youGlow = (() => {
      const [c, x] = cnv(256), gr = x.createRadialGradient(128, 128, 54, 128, 128, 182);
      gr.addColorStop(0, 'rgba(255,255,255,0)'); gr.addColorStop(0.5, 'rgba(255,251,242,0.16)'); gr.addColorStop(0.82, 'rgba(255,248,234,0.62)'); gr.addColorStop(1, 'rgba(255,246,228,0.95)');
      x.fillStyle = gr; x.fillRect(0, 0, 256, 256);
      const tEdge = tex(new THREE.CanvasTexture(c)); tEdge.colorSpace = THREE.SRGBColorSpace;
      const edge = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), B({ map: tEdge, transparent: true, opacity: 0, depthTest: false, depthWrite: false, fog: false, blending: THREE.AdditiveBlending, toneMapped: false }));
      edge.renderOrder = 999; edge.frustumCulled = false; edge.visible = false; world.add(edge); owned.push(edge);
      const hm = new THREE.SpriteMaterial({ map: tex(makeGlow(THREE, cnv)), color: 0xfff7ea, transparent: true, opacity: 0, depthTest: false, depthWrite: false, fog: false, blending: THREE.AdditiveBlending }); mats.push(hm);
      const halo = new THREE.Sprite(hm); halo.renderOrder = 998; halo.visible = false; world.add(halo);
      return { edge, halo };
    })();
    function youGlowAt(k, t, at, vm) {
      const G = youGlow, on = k > 0.002;
      G.halo.visible = on; G.edge.visible = on && !!vm;
      if (!on) { if (G.edge.parent !== world) world.add(G.edge); return; }
      const br = 0.84 + 0.16 * Math.sin(t * 2 * Math.PI / 1.7);                  // (it breathes, a little faster than his teacher's)
      if (at) { G.halo.position.set(at[0], at[1] + 0.2, at[2]); G.halo.scale.set(0.95, 1.05, 1); }
      G.halo.material.opacity = 0.62 * k * br;
      /* (v26.8: the edge is laid before the film's OWN lens, in the world's pass, just past its near plane (0.08 m). It
         was laid in the hands' pass, which the engine skips while no hand of his is drawn, and a film hides his hands:
         photographed at its brightest, no light at the edge at all) */
      if (vm) {
        if (G.edge.parent !== camera) camera.add(G.edge);
        const d = 0.1, h = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * d;
        G.edge.position.set(0, 0, -d); G.edge.quaternion.identity(); G.edge.scale.set(h * camera.aspect * 1.04, h * 1.04, 1);
        G.edge.material.opacity = 0.7 * k * br;
      }
    }
    /* ---- HIS OWN HANDS ON HIS BAI SRI IN THE CLOSE (v26.8, row M). Chad, 13 Nov 2026, of the close: "just show the player
       hands vibrating while a glow surronding him and his hands and his bai sri. all around his silohuette, to show that the
       player is now in control while vibrating." v26.8 drew the bai sri shaking and the light, and not his hands: they were
       under the frame's foot, where play carries it (BAI above: six ways of drawing two hands of the hands' pass on its
       bowl were refused at v26.0, none of them touching it, for the hands' pass is drawn over the world and its arm is
       one rigid piece). So they are drawn IN THE WORLD here, where the bowl is, and a finger behind the bowl is behind it:
       his own arms (the engine's rig, arms.glb: both arms, with their elbows; the engine draws the right alone and shrinks
       the left away, and this copy gives the left back), stood at his shoulders under his eyes and solved onto the bowl
       as the chapter solves a master's hands (armsOf, handTo: two bones, the elbow down and out). The hold is his
       photograph 7's, the bai sri held up in two hands as its holder sees it: the forearms rising from the frame's lower
       corners, the palms on the bowl's sides under its swell, the fingers round them, the young man's offering in
       photograph 5 (baiGrip 'under'). `myArmsAt(api, eye, ya, c, k, glow, t)`: the film's api (the hands' model is the
       engine's, api.rightHand()), his eye, the way his body faces (a heading as eyes() takes it), the bai sri's foot in
       the world (or null), how far his hands are on it (0 under the frame, 1 on it), the glow, the film's clock */
    const MYARMS = { P: null, made: false, G: null, halos: [] };
    const SHOULD = { drop: 0.21, back: 0.05, reach: 0.6, lean: 0.16 };   // (his shoulders' middle against his eye; how far he leans to a bowl beyond reach)
    /* (MYGRIP: each finger's two nearer joints bent so far round the bowl's curve, the end joint 0.7 of it: c_cast.js
       curlFingers. MYARMS_SHOW: how far his hands must be on their way to the bowl before they are drawn) */
    const MYGRIP = 0.45, MYARMS_SHOW = 0.15;
    function myArmsMake(api) {
      if (MYARMS.made) return MYARMS.P; MYARMS.made = true;
      const src = api && api.rightHand && api.rightHand(); if (!src) { console.warn('his arms: the hands model is not here'); return null; }
      const m = cloneSkinned(src), bone = {};
      m.traverse(o => { if (o.isBone) bone[o.name] = o; if (o.isMesh) { o.material = o.material.clone(); o.frustumCulled = false; } });
      for (const n of ['upper_armL', 'handL']) if (bone[n]) bone[n].scale.setScalar(1);          // (the left the engine shrinks away, given back)
      const skins = []; m.traverse(o => { if (o.isSkinnedMesh) skins.push(o); });
      const piv = new THREE.Group(), G = new THREE.Group(); piv.add(m); G.add(piv); world.add(G); G.visible = false;
      /* (the rig's own frame, measured from its bones as they stand: across from the right shoulder to the left, forward
         from the shoulders to the hands; turned so its forward is the group's +z and its left +x, as a person's is) */
      G.updateMatrixWorld(true);
      /* (each hand given to its forearm: the rig carries both hands as children of its armature, beside the arms, because
         the engine moves the hand and its arm as one rigid piece and never bends an elbow. Bent here, a hand left with the
         armature stays where it was drawn and the skin of the wrist is drawn out to it in a long tube: photographed, the
         first build. Each hand stands at its forearm's end in the file (0.0 mm apart), so it is attached keeping where it
         is, and the arm carries it) */
      for (const sd of ['L', 'R']) { const fa = bone['forearm' + sd], hd = bone['hand' + sd]; if (fa && hd && hd.parent !== fa) fa.attach(hd); }
      const at = (n) => bone[n] ? bone[n].getWorldPosition(new THREE.Vector3()) : null;
      const sL = at('upper_armL'), sR = at('upper_armR'), hL = at('handL'), hR = at('handR');
      if (!sL || !sR || !hL || !hR) { console.warn('his arms: the rig has not the bones it should'); return null; }
      const mid = sL.clone().add(sR).multiplyScalar(0.5), xa = sL.clone().sub(sR).normalize(), za = hL.clone().add(hR).multiplyScalar(0.5).sub(mid);
      za.addScaledVector(xa, -za.dot(xa)).normalize(); const ya = new THREE.Vector3().crossVectors(za, xa).normalize();
      const R = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(xa, ya, za)).invert();
      piv.quaternion.copy(R); piv.position.copy(mid).applyQuaternion(R).negate();
      const map = { Arm: 'upper_arm', ForeArm: 'forearm', Hand: 'hand' }, fin = { Index: 'f_index0', Middle: 'f_middle0', Ring: 'f_ring0', Pinky: 'f_pinky0', Thumb: 'thumb0' };
      const P = { key: 'hisarms', ready: true, group: G, bone: {}, lv: { 1: skins } };
      for (const [sd, S0] of [['L', 'Left'], ['R', 'Right']]) {
        for (const k in map) P.bone[S0 + k] = bone[map[k] + sd];
        for (const k in fin) for (let i = 1; i <= 3; i++) P.bone[S0 + 'Hand' + k + i] = bone[fin[k] + i + sd]; }
      /* (his fingers, both hands: side by side, as a hand holding a bowl keeps them: the engine's prayer pose, the four
         straight and together. The rig ships them fanned, and the walking curl, laid about one axis across a fanned hand,
         bent every middle joint sideways, 28 to 37 degrees: measured on the first build (jointscan). The thumb as the
         walking hand holds it, out from the palm and a little curled. Curled round the bowl each frame (curlFingers, in
         myArmsAt). The left's copied over from the right by mirror, joint for joint, so the two are one hand twice) */
      if (api.setHandCurl) api.setHandCurl(m, 1);
      const th0 = {}; for (const nm in bone) if (/^thumb0[123]R$/.test(nm)) th0[nm] = bone[nm].quaternion.clone();
      if (api.setHandPrayer) api.setHandPrayer(m, 1);
      for (const nm in th0) bone[nm].quaternion.copy(th0[nm]);
      for (const nm in bone) { const r = /^(f_(index|middle|ring|pinky)|thumb)0([123])R$/.exec(nm); if (!r) continue;
        const bl = bone[nm.slice(0, -1) + 'L'], br = bone[nm]; if (bl) bl.quaternion.set(br.quaternion.x, -br.quaternion.y, -br.quaternion.z, br.quaternion.w); }
      const hm = new THREE.SpriteMaterial({ map: tex(makeGlow(THREE, cnv)), color: 0xfff7ea, transparent: true, opacity: 0, depthTest: false, depthWrite: false, fog: false, blending: THREE.AdditiveBlending }); mats.push(hm);
      for (let i = 0; i < 2; i++) { const sp = new THREE.Sprite(hm); sp.renderOrder = 998; sp.visible = false; world.add(sp); MYARMS.halos.push(sp); }
      MYARMS.G = G; MYARMS.P = P; return P;
    }
    /* HIS GRIP, as his photograph 7 holds a bai sri up before the eyes: each palm on the bowl's lower body under its swell,
       a little to his side of its middle (GRIP.round, in radians round from the side toward him), turned in to it; the
       fingers up its side and round it; so each thumb lies across the side toward him and the backs of his hands are what
       he sees, as in the photograph. The elbows low and in, under the bowl, the forearms rising to it. (baiGrip's
       'under', the one who offers a bai sri to a master seen from beside, set the fingers forward along the bowl: from
       his own eyes that put both hands behind it) */
    /* (the fingers point up the bowl's side only as it is raised before his eyes; held at his chest, below the frame, they
       point forward along it as a bowl held there is held: with the raised hold's fingers at his chest the joint scan read
       his wrists 36 to 55 degrees toward the thumb, which no wrist does. `raised`, 0 at his chest to 1 at his eyes) */
    const GRIP = { round: 0.42, up: 0.115, fUp: 0.82, fFwd: 0.38, fUp0: 0.3, fFwd0: 0.95, nUp: 0.18, out: 0.1, down: 0.46 };
    function myGrip(c, s, from, raised = 1) {
      const fx = c[0] - from[0], fz = c[2] - from[1], d = Math.hypot(fx, fz) || 1, F = [fx / d, fz / d], Lf = [F[1], -F[0]], out = {};
      const r = 0.112 * s, y = GRIP.up * s, ca = Math.cos(GRIP.round), sa = Math.sin(GRIP.round), kr = smo(c01(raised));
      const fu = lp(GRIP.fUp0, GRIP.fUp, kr), ff = lp(GRIP.fFwd0, GRIP.fFwd, kr);
      for (const [sd, sg] of [['L', 1], ['R', -1]]) {
        const rx = Lf[0] * sg * ca - F[0] * sa, rz = Lf[1] * sg * ca - F[1] * sa;          // (from the bowl's axis out to his palm)
        out[sd] = { at: [c[0] + rx * r, c[1] + y, c[2] + rz * r],
                    f: [F[0] * ff, fu, F[1] * ff], n: [-rx, GRIP.nUp, -rz], out: GRIP.out, down: GRIP.down };
      }
      return out;
    }
    function myArmsAt(api, eye, ya, c, k, glow, t, held, raised = 1) {
      /* (`held`: drawn from the close's first frame, under the frame's foot where nothing of them is seen, so the phone
         builds their shading under the close's black and not in the picture as his hands come up) */
      /* (and drawn only while they are on the bowl or near it: on their way down to his sides, below the frame, the hand
         turned for the bowl read the wrist 56 degrees toward the thumb (jointscan), so there they are not drawn at all) */
      const drawn = !!c && (k > MYARMS_SHOW || !!held);
      const P = drawn ? myArmsMake(api) : MYARMS.P;
      if (!P || !drawn) { if (MYARMS.G) MYARMS.G.visible = false; for (const sp of MYARMS.halos) sp.visible = false; return; }
      armsBack(P);
      const G = MYARMS.G, fx = -Math.sin(ya), fz = -Math.cos(ya), lx = -Math.cos(ya), lz = Math.sin(ya);
      /* (held and not on the bowl: drawn 1.2 m behind his eyes, where no look of his can see them) */
      if (!(k > MYARMS_SHOW)) { G.position.set(eye[0] - fx * 1.2, eye[1] - SHOULD.drop, eye[2] - fz * 1.2); G.rotation.set(0, ya + Math.PI, 0); G.visible = true;
        for (const sp of MYARMS.halos) sp.visible = false; return; }
      let gx = eye[0] - fx * SHOULD.back, gy = eye[1] - SHOULD.drop, gz = eye[2] - fz * SHOULD.back;
      /* (a bowl beyond his reach, on the carpet beside his knee: he leans to it, so far and no further) */
      { const dx = c[0] - gx, dy = c[1] + 0.09 - gy, dz = c[2] - gz, d = Math.hypot(dx, dy, dz), ex = Math.min(SHOULD.lean, Math.max(0, d - SHOULD.reach)) * smo(c01(k));
        if (ex > 0) { gx += dx / d * ex; gy += dy / d * ex; gz += dz / d * ex; } }
      G.position.set(gx, gy, gz); G.rotation.set(0, ya + Math.PI, 0); G.visible = true; G.updateMatrixWorld(true);
      const gr = myGrip(c, BAI.s, [eye[0], eye[2]], raised), ke = smo(c01(k));
      const palm = {};
      for (const sd of ['L', 'R']) { const g = gr[sd], sg = sd === 'L' ? 1 : -1;
        /* (from under the frame: below his chest and to his side, eased up onto the bowl) */
        const lo = [eye[0] + fx * 0.3 + lx * sg * 0.17, eye[1] - 0.62, eye[2] + fz * 0.3 + lz * sg * 0.17];
        palm[sd] = [lp(lo[0], g.at[0], ke), lp(lo[1], g.at[1], ke), lp(lo[2], g.at[2], ke)];
        handTo(P, sd, palm[sd], g.f, g.n, 1, g);
        curlFingers(P, sd, MYGRIP * ke); }
      /* the light round his hands as round the bai sri (it breathes with it): on each palm where it lies on the bowl (on
         the wrist it stood off at the frame's corners: photographed) */
      const on = glow > 0.002, br = 0.84 + 0.16 * Math.sin(t * 2 * Math.PI / 1.7);
      MYARMS.halos.forEach((sp, i) => { sp.visible = on; if (!on) return; const q = palm[i ? 'R' : 'L']; sp.position.set(q[0], q[1], q[2]); sp.scale.set(0.3, 0.3, 1); sp.material.opacity = 0.42 * glow * br; });
    }
    /* (his arms are a copy of the engine's own hand: its shape and its pictures are the engine's, drawn in every
       chapter's play, and never this chapter's to dispose. dispose() takes them out of the world before it disposes
       what is left there, and gives back only what this copy made: its materials and its bone sheet) */
    function myArmsDrop() {
      const G = MYARMS.G; if (!G) return;
      if (G.parent) G.parent.remove(G);
      G.traverse(o => { if (o.isSkinnedMesh && o.skeleton) o.skeleton.dispose(); if (o.isMesh) for (const m of [].concat(o.material)) m.dispose(); });
      MYARMS.G = null; MYARMS.P = null; MYARMS.made = false;
    }
    let auraK = 0;
    function auraAt(k, t) {
      const A = aura; auraK = k;
      A.g.visible = k > 0.002; if (!A.g.visible) return;
      const br = 0.86 + 0.14 * Math.sin(t * 2 * Math.PI / 5.2);
      A.shade.material.opacity = AURA_K.shade * k;
      A.hue.material.color.setHex(AURA.hue); A.hue.material.opacity = AURA_K.hue * k * br;
      A.glow.material.color.setHex(AURA.glow); A.glow.material.opacity = AURA_K.glow * k * (1.1 - 0.2 * br);
      A.rays.material.color.setHex(AURA.glow); A.rays.material.opacity = AURA_K.rays * k * br; A.rays.material.rotation = t * 0.06;
      A.pool.material.color.setHex(AURA.hue); A.pool.material.opacity = AURA_K.pool * k * br;
      { const u = (((t / 5.2) % 1) + 1) % 1, d = 1.5 + 1.3 * u; A.ring.scale.set(d, d, 1); A.ring.material.color.setHex(AURA.glow); A.ring.material.opacity = AURA_K.ring * k * Math.sin(Math.PI * u) * (1 - 0.5 * u); }
      const P = A.pts.geometry.attributes.position, V = A.pts.geometry.attributes.color; A.tm.setHex(AURA.mote);
      A.seed.forEach((s, i) => { const u = (((t / s.T + s.ph) % 1) + 1) % 1, a = s.a + s.sw * Math.sin(u * 4.4 + s.ph * 6.283), rr = s.rad * (1 - 0.3 * u);
        const mx = Math.cos(a) * rr, mz = Math.sin(a) * rr * 0.7;
        P.setXYZ(i, mx, 0.08 + s.top * u, mz > -0.05 && Math.abs(mx) < 0.55 ? -mz - 0.3 : mz - 0.1);     // (one that would rise before his body goes behind it: a mote on a face is a speck on a lip, v25.5)
        const al = AURA_K.mote * k * Math.pow(Math.sin(Math.PI * u), 1.4) * (0.55 + 0.45 * Math.sin(t * 3.1 + s.ph * 40));
        V.setXYZ(i, A.tm.r * al, A.tm.g * al, A.tm.b * al); });
      P.needsUpdate = true; V.needsUpdate = true;
    }

    /* ---- THE MORNING'S MIST (day two): a few wide soft sheets low over the turf, drifting; they thin as the light opens */
    const mist = (() => {
      const g = new THREE.Group(); dayTwo.add(g);
      const t0 = tex(makeGlow(THREE, cnv)), rnd = rng(6611), list = [];
      /* (seeded places over the turf, and eight said ones where the morning is looked at: before the chief bench, across
         the middle, by the west tents. The first fourteen were all seeded, faint, and none stood in the picture play
         begins the morning on: photographed three times, and not there) */
      const at = [[4.2, 6.0], [7.6, 6.6], [1.2, 8.4], [-3.2, 4.8], [-6.5, 8.6], [0.4, 0.2], [5.4, 1.0], [-5.2, -3.0]];
      for (let i = 0; i < (LOW ? 6 : 10); i++) at.push([TURF.x0 + rnd() * (TURF.x1 - TURF.x0), TURF.z0 + 2 + rnd() * (TURF.z1 - TURF.z0 - 3)]);
      for (const [x, z] of at) {
        const m = new THREE.SpriteMaterial({ map: t0, color: 0xffeccc, transparent: true, opacity: 0, depthWrite: false, fog: false }); mats.push(m);
        const s = new THREE.Sprite(m);
        s.scale.set(9 + rnd() * 7, 1.2 + rnd() * 0.9, 1); s.position.set(x, 0.34 + rnd() * 0.26, z); s.renderOrder = 2; g.add(s);
        list.push({ s, x, z, a: 0.5 + rnd() * 0.25, v: (rnd() - 0.5) * 0.12, ph: rnd() * 6.283 });
      }
      return { g, list };
    })();
    let mistK = 1;
    function mistTick(t) {
      if (!dayTwo.visible) return;
      for (const m of mist.list) { m.s.position.x = m.x + Math.sin(t * 0.05 + m.ph) * 1.4 + m.v * ((t % 40) - 20); m.s.material.opacity = m.a * mistK * (0.8 + 0.2 * Math.sin(t * 0.21 + m.ph)); }
    }

    /* ---- THE NIGHT'S FLAMES (§4.2: "the candles on the offering tables burning low in the dark"). One flame drawn on
       the wick of every candle that stands on the tables (their tops are the tables' own list: b_world2.js), each
       with its own flicker and lean, turned to the lens, and a soft glow round it. The light they give is the look's
       own key (NIGHT: warm and low, from before the tables), never a lamp a flame (v15.1). Drawn only at night. */
    const flames = (() => {
      const L = stageList.flames || [], n = L.length;
      const gF = new THREE.PlaneGeometry(1, 1); gF.translate(0, 0.5, 0);           // (a flame stands on its wick)
      const mF = B({ map: tex(makeFlame(THREE, cnv)), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false, side: THREE.DoubleSide });
      const mG = B({ map: tex(makeGlow(THREE, cnv)), color: 0xff9a3c, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false, opacity: 0.6, side: THREE.DoubleSide });
      const imF = new THREE.InstancedMesh(gF, mF, Math.max(1, n)), imG = new THREE.InstancedMesh(new THREE.PlaneGeometry(1, 1), mG, Math.max(1, n));
      imF.frustumCulled = false; imG.frustumCulled = false; imF.renderOrder = 4; imG.renderOrder = 3; imF.count = n; imG.count = n;
      nightG.add(imG); nightG.add(imF); owned.push(imF); owned.push(imG);
      const rnd = rng(7733), seed = L.map(() => ({ ph: rnd() * 6.283, f: 7 + rnd() * 6, g: 1.3 + rnd() * 1.4 }));
      return { L, imF, imG, seed };
    })();
    const _flp = new THREE.Vector3(), _fls = new THREE.Vector3(), _flc = new THREE.Vector3();
    function flamesTick(t) {
      if (!nightG.visible || !flames.L.length) return;
      camera.getWorldPosition(_flc);
      flames.L.forEach((c, i) => { const sd = flames.seed[i], fl = 0.82 + 0.12 * Math.sin(t * sd.f + sd.ph) + 0.06 * Math.sin(t * sd.f * 2.7 + sd.ph * 3);
        const ry = Math.atan2(_flc.x - c.x, _flc.z - c.z);
        _pte.set(0, ry, 0.07 * Math.sin(t * sd.g + sd.ph), 'YXZ'); _ptq.setFromEuler(_pte);
        flames.imF.setMatrixAt(i, _wm.compose(_flp.set(c.x, c.y - 0.004, c.z), _ptq, _fls.set(0.04 * c.s * (1.1 - 0.12 * fl), 0.095 * c.s * fl, 1)));
        const gs = 0.56 * c.s * (0.88 + 0.22 * fl);
        _pte.set(0, ry, 0, 'YXZ'); _ptq.setFromEuler(_pte);
        flames.imG.setMatrixAt(i, _wm.compose(_flp.set(c.x, c.y + 0.045 * c.s, c.z), _ptq, _fls.set(gs, gs, 1))); });
      flames.imF.instanceMatrix.needsUpdate = true; flames.imG.instanceMatrix.needsUpdate = true;
    }

    /* ---- THE RENTED ROOM (§4.2: "his bai sri on the sill of a rented room, beside his bag"): a window, its sill and the
       wall round it, and nothing else of a room: a pocket set far past the far plane, so the ground and the room never
       see one another (v8.9: distance does the hiding). His bai sri and his bag (chapter 2's own: reuseInEpisode) are
       the real models. Outside it is the real sky (the stage moves the sky there for the shot: skyAt), dark ground, a
       rain tree and the line of trees, dark against it. */
    const ROOM = { x: 300, z: 300, sill: 0.94, wall: 300 - 1.7, w: 0.92, h: 1.25 };
    const roomG = new THREE.Group(); world.add(roomG);
    const room = { ring: null, ringMat: null, ground: null, sync: null, tree: [] };
    function buildRoom() {
      const X = ROOM.x, Zw = ROOM.wall, sl = ROOM.sill, top = sl + ROOM.h, hw = ROOM.w / 2;
      const mWall = M({ color: 0xcfc6b2, roughness: 0.96 }), mWood = M({ color: 0x5c3d27, roughness: 0.72 });
      /* (the ground outside is a shape, not a lit surface: nothing lights a field before dawn) */
      const mGround = B({ color: 0x070a07 }); room.ground = mGround;
      /* the wall round the opening (narrow enough that a phone's frame holds both its sides), and the reveal's wood */
      box(mWall, X - hw - 1.0, 1.5, Zw, 2.0, 3.0, 0.16); box(mWall, X + hw + 1.0, 1.5, Zw, 2.0, 3.0, 0.16);
      box(mWall, X, sl / 2, Zw, ROOM.w, sl, 0.16); box(mWall, X, (top + 3.0) / 2, Zw, ROOM.w, 3.0 - top, 0.16);
      box(mWood, X - hw - 0.02, sl + ROOM.h / 2, Zw, 0.05, ROOM.h, 0.2); box(mWood, X + hw + 0.02, sl + ROOM.h / 2, Zw, 0.05, ROOM.h, 0.2); box(mWood, X, top + 0.02, Zw, ROOM.w + 0.09, 0.05, 0.2);
      /* the sill: a deep board, proud of the wall on the room's side */
      box(mWood, X, sl - 0.025, Zw + 0.13, ROOM.w + 0.2, 0.05, 0.5);
      /* two shutters, folded back against the wall outside */
      for (const sx of [-1, 1]) box(mWood, X + sx * (hw + 0.3), sl + ROOM.h / 2, Zw - 0.11, 0.46, ROOM.h, 0.035);
      /* the dark ground outside */
      floor(mGround, X - 90, ROOM.z - 110, X + 90, Zw - 0.2, -0.3);
      flush(roomG);
      /* his bai sri at the sill's inner edge; his bag behind it and to its right, against the reveal */
      stand('w3baisri', X - 0.15, sl, Zw + 0.21, 0.6, { s: BAI.s, near: true, parent: roomG });
      stand('e4bag', X + 0.2, sl, Zw + 0.05, -0.3, { parent: roomG });
      /* (the tree outside is a shape against the sky until the light comes: its own paint is held down, and let up as
         the window pales) */
      room.tree = [];
      stand('e4raintree', X - 3.6, -0.3, Zw - 27, 1.2, { h: 10.5, lift: 1, parent: roomG, done: (m) => m.traverse(q => { if (q.isMesh) { q.material.color.setScalar(0.05); room.tree.push(q.material); } }) });
      /* the line of trees round it: the ground's own ring again, low and far, its picture darkened to a shape against
         the sky (the ring's picture is laid on its material when it has loaded: this one takes it then) */
      if (stageList.ring) { const r0 = stageList.ring, mt = r0.material.clone(); mats.push(mt); mt.fog = false; mt.color.set(0x0b0f0b);
        const r2 = new THREE.Mesh(r0.geometry, mt); r2.scale.y = 0.5; r2.position.set(X, r0.position.y * 0.5 - 0.3, ROOM.z); r2.renderOrder = -5; roomG.add(r2); room.ring = r2; room.ringMat = mt;
        room.sync = () => { if (r0.material.map && mt.map !== r0.material.map) { mt.map = r0.material.map; mt.needsUpdate = true; } r2.visible = r0.visible; }; }
    }
    buildRoom();

    /* ---- THE ROLLED MATS (ending A: "New ones roll the mats, bro."): a stack by the west tents, one at each of the two
       who roll, the two on Ton's arms and the one the young man carries, and his own, carried in the hands' own pass
       and then laid on the stack. The model is one rolled reed mat, 1.2 m long along its own x, lying on the ground
       (made his way: a checked picture on white, then Meshy: masters/v26.0/make.sh) */
    const matsG = new THREE.Group(); world.add(matsG); matsG.visible = false;
    const MATS_AT = { x: -6.25, z: 1.9, ry: 0.32 };
    const rolled = { stack: [], own: null, ton: [], carry: null, rolls: [] };
    { const c = Math.cos(MATS_AT.ry), sn = Math.sin(MATS_AT.ry), rnd = rng(3391);
      /* (v26.2 debug: a roll is 0.232 m thick (tools/probes/glbbox.mjs w3matroll); laid 0.16 apart and 0.128 a level they
         sank into one another, the stack a solid bank of stripes. Side by side now, each level in the hollow between two
         below it: 0.24 apart, 0.2 a level. Then 0.27 apart: each roll's own small turn (up to 0.05 between two) brought
         two 0.232 rolls together at their ends, measured in ending A by tools/probes/clipscan.mjs; the hollow above two
         0.27 apart is 0.19 up, so 0.2 a level still rests each on the two below) */
      const at = (dz, lvl, dx = 0) => { const lx = dx + (rnd() - 0.5) * 0.08; return stand('w3matroll', MATS_AT.x + lx * c + dz * sn, lvl * 0.2, MATS_AT.z - lx * sn + dz * c, MATS_AT.ry + (rnd() - 0.5) * 0.05, { parent: matsG }); };
      for (const [dz, lvl] of [[-0.27, 0], [0, 0], [0.27, 0], [-0.135, 1], [0.135, 1]]) rolled.stack.push(at(dz, lvl));
      rolled.own = at(0, 2); rolled.own.visible = false;                           // his own: the stack's top, once he has laid it there
      for (let i = 0; i < 2; i++) rolled.ton.push(stand('w3matroll', 0, 0, 0, 0, { parent: matsG, moves: true }));
      rolled.carry = stand('w3matroll', 0, 0, 0, 0, { parent: matsG, moves: true });
      for (let i = 0; i < 2; i++) rolled.rolls.push(stand('w3matroll', 0, 0, 0, 0, { parent: matsG, moves: true })); }
    const handMatHolder = new THREE.Group();
    const handMat = stand('w3matroll', 0, 0, 0, 0, { s: 0.8, near: true, parent: handMatHolder });
    /* a mat lying across a person's two forearms (`n`: the second lies on the first). v26.2 debug (Chad's picture of ending
       A, 13 Nov 2026: Ton's cupped hands stood out of the front of his two mats, the mats sunk through his forearms and into
       each other): they LIE on his arms now. A mat's foot is its model's origin; it is set on his forearms' tops where it
       crosses them, 13 cm back from his wrists (each forearm's bone line there, from its elbow to its wrist, raised by a
       forearm's half-thickness), and the second on the first, 0.226 m up (a roll is 0.232 thick: the upper sits 6 mm into
       the one below, as one soft roll does on another). Read off his own bones on
       every frame, so his take's breathing carries them */
    const _mtv = new THREE.Vector3(), _mte = new THREE.Vector3(), _mtw = new THREE.Vector3();
    const FOREARMS = { L: /^(mixamorig:?)?LeftForeArm$/, R: /^(mixamorig:?)?RightForeArm$/ };
    function matOnArms(g, P, n = 0) { const m = handsMid(P, _mtv); if (!m) return false; const ry = P.group.rotation.y;
      if (!P.foreL) for (const k in P.bone) { if (FOREARMS.L.test(k)) P.foreL = P.bone[k]; if (FOREARMS.R.test(k)) P.foreR = P.bone[k]; }
      let top = m.y;
      if (P.foreL && P.foreR && P.handL && P.handR) { let y = 0;
        for (const [fb, hb] of [[P.foreL, P.handL], [P.foreR, P.handR]]) { fb.getWorldPosition(_mte); hb.getWorldPosition(_mtw);
          const k = Math.min(1, 0.13 / Math.max(0.05, _mte.distanceTo(_mtw))); y += _mtw.y + (_mte.y - _mtw.y) * k; }
        top = y / 2; }
      g.position.set(m.x - Math.sin(ry) * 0.13, top + 0.04 + n * 0.226, m.z - Math.cos(ry) * 0.13); g.rotation.set(0, ry + (n ? 0.07 : -0.04), 0); g.visible = true; return true; }

    /* ---- THE BULBS AT DUSK (ending B: "the bulbs under the shed's roof come on"): a string of bare bulbs along the eaves
       of the chief canopy and the three tents, each a small warm glow turned to the lens, and the pool of their light
       on the carpets before his bench. Painted light, never a lamp (v15.1). Drawn only at dusk. */
    const duskG = new THREE.Group(); world.add(duskG); duskG.visible = false;
    const bulbs = (() => {
      const L = [];
      const edge = (T0, w, e, ry, sides) => { const C = tentCorners(T0.x, T0.z, w, ry || 0);
        for (const k of sides) { const a = C[k], b = C[(k + 1) % 4], n = Math.max(2, Math.round(Math.hypot(b[0] - a[0], b[1] - a[1]) / 0.55));
          for (let i = 0; i <= n; i++) { const u = i / n, sag = Math.sin(Math.PI * ((u * 3) % 1)) * 0.05; L.push({ x: lp(a[0], b[0], u), y: e + 0.07 - sag, z: lp(a[1], b[1], u) }); } } };
      edge(CHIEF, CHIEF.w + 0.12, CHIEF.eave, CHIEF.ry, [0, 1, 2, 3]);
      for (const T0 of [TENT_W1, TENT_W2, TENT_E]) edge(T0, TENT.w + 0.12, TENT.eave, 0, [0, 1, 2, 3]);
      const n = L.length, mG = B({ map: tex(makeGlow(THREE, cnv)), color: 0xffb060, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false, side: THREE.DoubleSide });
      const im = new THREE.InstancedMesh(new THREE.PlaneGeometry(1, 1), mG, Math.max(1, n)); im.count = n; im.frustumCulled = false; im.renderOrder = 4; duskG.add(im); owned.push(im);
      /* the pool of their light: a soft warm disc on the ground under the chief canopy and before it */
      const mP = B({ map: mG.map, color: 0xffa050, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false, opacity: 0.3 });
      const g0 = new THREE.PlaneGeometry(1, 1); g0.rotateX(-Math.PI / 2);
      const [px, pz] = benchAt(0.2, 1.3), pool = new THREE.Mesh(g0, mP); pool.position.set(px, 0.022, pz); pool.scale.set(8.5, 1, 7); pool.renderOrder = 3; duskG.add(pool); owned.push(pool);
      const rnd = rng(8812), seed = L.map(() => rnd() * 6.283);
      return { L, im, seed };
    })();
    function bulbsTick(t) {
      if (!duskG.visible || !bulbs.L.length) return;
      camera.getWorldPosition(_flc);
      bulbs.L.forEach((c, i) => { const s = 0.3 * (0.94 + 0.06 * Math.sin(t * 2.3 + bulbs.seed[i]));
        _pte.set(0, Math.atan2(_flc.x - c.x, _flc.z - c.z), 0, 'YXZ'); _ptq.setFromEuler(_pte);
        bulbs.im.setMatrixAt(i, _wm.compose(_flp.set(c.x, c.y, c.z), _ptq, _fls.set(s, s, 1))); });
      bulbs.im.instanceMatrix.needsUpdate = true;
    }

    /* ---- HIS COUNTER AT NIGHT (the opening film, §4.0: "The laptop and notebook stand on a dark slice of his counter and
       nothing else of the shop is loaded"): a pocket set far past the far plane (v8.9), laid out as chapter 2's counter
       is (he sits on its -z side and looks +z): his laptop, its screen the forum's thread chapter 2 ended on (that
       chapter's own drawing and its own words, read from the chapter itself so the two can never differ); his notebook,
       its next page; his bag; a folded white shirt. One lamp: the look's own key (COUNTER) and a pool of it painted on
       the glass. */
    /* (along the glass, from his right hand to his left: his laptop, square to him; his notebook; then what he takes, the
       folded shirt before his bag, one behind the other so a phone's frame holds both) */
    const DESK = { x: -300, z: 300, top: 0.92, lap: [-0.2, 0.0], book: [0.3, -0.02], shirt: [0.73, -0.14], bag: [0.74, 0.2] };
    const LAP_UV = [0.99236, 0.60901, 0.003275, 0.19951];                       // the screen's own island on the model's sheet (measured for chapter 2: its LAP.uv)
    const deskG = new THREE.Group(); world.add(deskG); deskG.visible = false;
    const desk = { lapX: null, lapT: null, lapM: null, lapG: null, lapSig: '', fit: null, pageX: null, pageT: null, page: null, pageSig: '', bag: null, shirt: null, book: null };
    function buildDesk() {
      const X = DESK.x, Z = DESK.z, top = DESK.top;
      const mTop = M({ color: 0x2a1c12, roughness: 0.42 }), mEdge = M({ color: 0x191009, roughness: 0.7 }), mWall = M({ color: 0x15100c, roughness: 1 });
      box(mTop, X, top - 0.02, Z, 2.6, 0.04, 0.95); box(mEdge, X, (top - 0.04) / 2, Z + 0.1, 2.6, top - 0.04, 0.7);
      wall(mWall, X + 4, Z + 2.2, X - 4, Z + 2.2, 0, 3.4);                       // the dark of the shop behind it
      flush(deskG);
      /* the lamp's pool on the glass */
      { const mP = B({ map: tex(makeGlow(THREE, cnv)), color: 0xffb870, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false, opacity: 0.22 });
        const g0 = new THREE.PlaneGeometry(1, 1); g0.rotateX(-Math.PI / 2); const pool = new THREE.Mesh(g0, mP); pool.position.set(X + 0.1, top + 0.002, Z - 0.02); pool.scale.set(2.2, 1, 1.3); pool.renderOrder = 3; deskG.add(pool); owned.push(pool); }
      /* HIS LAPTOP: the model's own screen takes a drawn sheet (always mapped; only its colour lights it: v15.1) */
      { const [c, x] = cnv(1024); c.height = 720; x.fillStyle = '#000'; x.fillRect(0, 0, 1024, 720);
        const t = tex(new THREE.CanvasTexture(c)); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; t.repeat.set(LAP_UV[0], LAP_UV[1]); t.offset.set(LAP_UV[2], LAP_UV[3]);
        desk.lapX = x; desk.lapT = t; desk.lapM = B({ color: 0x050608, map: t });
        if (have('filmlaptop')) parseOnce('filmlaptop').then(({ scene: src }) => { if (!alive) return;
          const g = src.clone(true); g.position.set(X + DESK.lap[0], top, Z + DESK.lap[1]); g.rotation.y = -Math.PI / 2;
          g.traverse(o => { if (!o.isMesh) return; o.castShadow = false; const m = o.material; o.material = (m && m.name === 'screen') ? desk.lapM : m.clone(); if (o.material !== desk.lapM) mats.push(o.material); });
          deskG.add(g); desk.lapG = g; }).catch(err => { console.warn('filmlaptop failed to load', err); if (ctx.loadFail) ctx.loadFail('filmlaptop', err); });
        else waiting.add('filmlaptop'); }
      /* HIS NOTEBOOK, open, and its page: a drawn sheet laid ON the model's own pages (they bow up from the spine: a
         grid each of whose points is dropped onto the page under it, chapter 2's way) */
      { const bk = new THREE.Group(); bk.position.set(X + DESK.book[0], top, Z + DESK.book[1]); bk.rotation.y = 0.05; deskG.add(bk); desk.book = bk;
        const [c, x] = cnv(1024); c.height = 640; const t = tex(new THREE.CanvasTexture(c)); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
        const pg = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.28), M({ map: t, roughness: 0.85 })); pg.rotation.set(-Math.PI / 2, 0, Math.PI); pg.position.y = 0.0135; pg.visible = false; bk.add(pg); owned.push(pg);
        desk.pageX = x; desk.pageT = t; desk.page = pg;
        if (have('e4notebook')) parseOnce('e4notebook').then(({ scene: src }) => { if (!alive) return;
          const m = src.clone(true); m.rotation.set(0, Math.PI, 0); m.updateMatrixWorld(true);
          const bb = new THREE.Box3().setFromObject(m), sz = bb.getSize(new THREE.Vector3()); m.scale.setScalar(0.46 / sz.x); m.updateMatrixWorld(true); bb.setFromObject(m);
          m.position.set(-(bb.min.x + bb.max.x) / 2, -bb.min.y, -(bb.min.z + bb.max.z) / 2); m.traverse(o => { if (o.isMesh) o.castShadow = false; });
          bk.add(m); bk.updateWorldMatrix(true, true);
          const g = new THREE.PlaneGeometry(0.42, 0.28, 48, 8), pos = g.attributes.position, rc = new THREE.Raycaster(), meshes = []; m.traverse(q => { if (q.isMesh) meshes.push(q); });
          const o = new THREE.Vector3(), dn = new THREE.Vector3(0, -1, 0);
          for (let i = 0; i < pos.count; i++) { o.set(-pos.getX(i), 0.3, pos.getY(i)); bk.localToWorld(o); rc.set(o, dn);      // (the plane's (x, y) is the book's (-x, z))
            const hit = rc.intersectObjects(meshes, false)[0]; pos.setZ(i, (hit ? bk.worldToLocal(hit.point).y : 0.04) + 0.0015 - pg.position.y); }
          g.computeVertexNormals(); pg.geometry.dispose(); pg.geometry = g; pg.visible = true;
        }).catch(err => { console.warn('e4notebook failed to load', err); if (ctx.loadFail) ctx.loadFail('e4notebook', err); });
        else waiting.add('e4notebook'); }
      /* what he takes: his bag, and a folded white shirt */
      desk.bag = stand('e4bag', X + DESK.bag[0], top, Z + DESK.bag[1], 0.2, { parent: deskG });
      /* (the shirt was modelled standing, as its picture showed it: laid on its back here, its collar away from him) */
      desk.shirt = stand('w3shirt', X + DESK.shirt[0], top, Z + DESK.shirt[1], Math.PI - 0.12, { parent: deskG, done: (m) => { m.rotation.x = -Math.PI / 2; m.position.set(0, 0.026, 0.156); } }); desk.shirt.visible = false;
    }
    buildDesk();
    /* a point of the laptop's screen in the room, by where it is drawn on the screen's sheet (px of 1024 x 720): the
       screen is a flat piece of the model, so its own points and their places on the sheet give the plane (a least
       squares fit of place = A [u, v, 1], solved once the model has landed: chapter 2's lapPoint) */
    const _dkv = new THREE.Vector3();
    function deskScreen(cx, cy) {
      if (!desk.fit) { const g = desk.lapG; if (!g) return null;
        let mesh = null; g.traverse(o => { if (o.isMesh && o.material === desk.lapM) mesh = o; });
        const P = mesh && mesh.geometry.attributes.position, U = mesh && mesh.geometry.attributes.uv; if (!P || !U) return null;
        const Sm = [0, 0, 0, 0, 0, 0, 0, 0, 0], Bm = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
        for (let i = 0; i < P.count; i++) { const a = [U.getX(i), U.getY(i), 1], q = [P.getX(i), P.getY(i), P.getZ(i)];
          for (let r = 0; r < 3; r++) { for (let c2 = 0; c2 < 3; c2++) Sm[r * 3 + c2] += a[r] * a[c2]; for (let k = 0; k < 3; k++) Bm[r][k] += a[r] * q[k]; } }
        const m3 = new THREE.Matrix3().set(Sm[0], Sm[1], Sm[2], Sm[3], Sm[4], Sm[5], Sm[6], Sm[7], Sm[8]);
        if (Math.abs(m3.determinant()) < 1e-14) return null;
        const e = m3.invert().elements;                                         // (column-major: row r of column c at e[c * 3 + r])
        desk.fit = { mesh, X: [0, 1, 2].map(r => [0, 1, 2].map(k => e[r] * Bm[0][k] + e[3 + r] * Bm[1][k] + e[6 + r] * Bm[2][k])) }; }
      const u = (cx / 1024 - LAP_UV[2]) / LAP_UV[0], v = (1 - cy / 720 - LAP_UV[3]) / LAP_UV[1], Xf = desk.fit.X;
      desk.fit.mesh.updateWorldMatrix(true, false);
      desk.fit.mesh.localToWorld(_dkv.set(u * Xf[0][0] + v * Xf[1][0] + Xf[2][0], u * Xf[0][1] + v * Xf[1][1] + Xf[2][1], u * Xf[0][2] + v * Xf[1][2] + Xf[2][2]));
      return [_dkv.x, _dkv.y, _dkv.z];
    }
    /* a point of the notebook's page in the room, by where it is on the page's sheet (px of 1024 x 640) */
    function deskPage(cx, cy) { const pg = desk.page; if (!pg) return null; pg.updateWorldMatrix(true, false); pg.localToWorld(_dkv.set((cx / 1024 - 0.5) * 0.42, (0.5 - cy / 640) * 0.28, 0.012)); return [_dkv.x, _dkv.y, _dkv.z]; }
    /* THE SCREEN, drawn when what it shows changes: the thread chapter 2 ended on (its `post` page), and over its answer
       box what he has typed so far (n letters), the caret, and its button once it is sent; `on` 0 is a dark screen */
    function deskLap(on, n, caret, sent) {
      if (!desk.lapX) return;
      const sig = on ? [n, caret ? 1 : 0, sent ? 1 : 0].join('|') : 'off'; if (sig === desk.lapSig) return; desk.lapSig = sig;
      desk.lapM.color.setRGB(on ? 1 : 0.02, on ? 1 : 0.024, on ? 1 : 0.03);
      if (!on) return;
      const x = desk.lapX, C2 = (window.__CHAPTERS__ && window.__CHAPTERS__.e4c2) || {}, CW = FX1 - FX0;
      drawForum(x, { words: C2.words || {}, mode: 'post' });
      const rr = (px, py, w, h, r) => { x.beginPath(); x.moveTo(px + r, py); x.lineTo(px + w - r, py); x.quadraticCurveTo(px + w, py, px + w, py + r); x.lineTo(px + w, py + h - r);
        x.quadraticCurveTo(px + w, py + h, px + w - r, py + h); x.lineTo(px + r, py + h); x.quadraticCurveTo(px, py + h, px, py + h - r); x.lineTo(px, py + r); x.quadraticCurveTo(px, py, px + r, py); x.closePath(); };
      const F = (sz, w = '') => `${w} ${sz}px "Helvetica Neue", Helvetica, Arial, sans-serif`, txt = String(W.forumReply || '').slice(0, n);
      x.fillStyle = '#ffffff'; rr(FX0, 656, CW - 110, 40, 8); x.fill(); x.strokeStyle = sent ? '#d9e0e7' : '#7fa8d8'; x.lineWidth = 2; x.stroke();
      x.textAlign = 'left'; x.textBaseline = 'alphabetic';
      if (sent) { x.fillStyle = '#9aa6b2'; x.font = F(15); x.fillText('Write a reply…', FX0 + 16, 681);
        x.fillStyle = '#2f8a5a'; rr(FX1 - 98, 656, 98, 40, 8); x.fill(); x.fillStyle = '#ffffff'; x.font = F(15, 'bold'); x.textAlign = 'center'; x.fillText(W.forumSent || '', FX1 - 49, 681.5); x.textAlign = 'left';
        /* and his answer, the newest under the thread: over the count of replies */
        x.fillStyle = '#edf0f3'; x.fillRect(FX0, 484, 200, 20); x.fillStyle = '#6d7a88'; x.font = F(14, 'bold'); x.fillText('3 replies', FX0 + 4, 498); }
      else { x.fillStyle = '#1b2733'; x.font = F(21, 'bold'); x.fillText(txt + (caret ? '|' : ''), FX0 + 16, 683); }
      desk.lapT.needsUpdate = true;
    }
    /* THE PAGE, drawn when what it shows changes: his three questions in his own hand (art, not sheet strings: v14.5),
       each underlined by its k; `turn` 0 to 1 turns the leaf to a blank one */
    function deskLeaf(k1, k2, k3, turn) {
      if (!desk.pageX) return;
      const q = (v) => Math.round(c01(v) * 60), sig = [q(k1), q(k2), q(k3), q(turn)].join('|'); if (sig === desk.pageSig) return; desk.pageSig = sig;
      drawQuestions(desk.pageX, { k: [c01(k1), c01(k2), c01(k3)], turn: c01(turn) }); desk.pageT.needsUpdate = true;
    }

    /* ---- THE SANDALS LEFT AT THE TURF'S EDGE (the opening film: "green turf, yellow petals and rows of sandals"): Chad's
       own sandal (episode 3 chapter 1's: `reuse`), a left and a right of it a pair, a colour a pair, in two loose rows on
       the earth at the way in, his own way between them left clear. Nothing is drawn until the file is in. */
    (function sandals() {
      if (!have('slipper')) { waiting.add('slipper'); return; }
      const PAL = [0x1f2a4a, 0x1d1d1f, 0xb3261e, 0x2d6fb0, 0xd97aa5, 0x3f7a4c, 0xe8b830, 0x7a4a2a, 0xe6e1d6, 0xe0762a, 0x6a3aa0, 0x2a8a8a];
      const rnd = rng(1207), list = [];
      for (const z of [12.34, 12.74]) for (let x = -7.9; x <= -1.6; x += 0.36 + rnd() * 0.12) { if (Math.abs(x - DATA.spawn.x) < 0.3) continue; if (rnd() < 0.12) continue;
        list.push({ x: x + (rnd() - 0.5) * 0.06, z: z + (rnd() - 0.5) * 0.08, ry: Math.PI + (rnd() - 0.5) * 0.5, col: PAL[Math.floor(rnd() * PAL.length)] }); }
      list.push({ x: DATA.spawn.x + 0.02, z: 12.84, ry: Math.PI + 0.06, col: 0x1d1d1f });        // his own, where he steps out of them
      parseOnce('slipper').then((gltf) => { if (!alive) return;
        let one = null; gltf.scene.traverse(o => { if (o.isMesh && o.name === 'one') { const g = o.geometry.clone(); o.updateWorldMatrix(true, false); g.applyMatrix4(o.matrixWorld); g.computeVertexNormals(); one = g; } });
        if (!one) throw new Error('the sandal file has no single sandal');
        const right = one.clone(); right.scale(-1, 1, 1);
        if (right.index) { const ix = right.index.array; for (let i = 0; i < ix.length; i += 3) { const t = ix[i + 1]; ix[i + 1] = ix[i + 2]; ix[i + 2] = t; } right.index.needsUpdate = true; } right.computeVertexNormals();
        const mat = M({ color: 0xffffff, roughness: 0.62 }), d = new THREE.Object3D(), col = new THREE.Color();
        /* DRAWN IN SHORT LENGTHS OF A ROW (12 Nov; the same sandals in the same places, the picture bit for bit). They were
           two meshes for all fifty-odd, and a mesh is handed to the GPU whole if its sphere touches the view: the rows lie
           a step BEHIND where play begins, their one sphere (3.3 m) reached past the lens, and every frame he stood at
           the way in paid 152,768 triangles for sandals behind his back (counted by mesh: the spawn drew 1.12 million, 7 %
           over chapter 1's heaviest look, and I had put it down first to the bai sri and then to Ton's full model: both
           wrong). A length of a row is a metre and a half: its sphere no longer reaches a lens that looks away */
        const bins = new Map();
        for (const q of list) { const k = Math.floor((q.x + 8) / 1.6) + (q.z > 12.5 ? ':b' : ':a'); if (!bins.has(k)) bins.set(k, []); bins.get(k).push(q); }
        for (const part of bins.values()) for (const [g, off] of [[one, -0.056], [right, 0.056]]) { const im = new THREE.InstancedMesh(g, mat, part.length);
          part.forEach((q, i) => { d.position.set(q.x + off * Math.cos(q.ry), 0.004, q.z - off * Math.sin(q.ry)); d.rotation.set(0, q.ry, 0); d.updateMatrix(); im.setMatrixAt(i, d.matrix); im.setColorAt(i, col.setHex(q.col)); });
          im.instanceMatrix.needsUpdate = true; im.instanceColor.needsUpdate = true; im.computeBoundingSphere(); im.castShadow = false; world.add(im); owned.push(im); }
      }).catch(err => { console.warn('slipper failed to load', err); if (ctx.loadFail) ctx.loadFail('slipper', err); });
    })();

    /* ---- THE HAZE OVER THE OFFERING TABLES (day one; the plan's §3.7, look I: "a haze of incense and candle smoke that
       catches it"; photograph 3: thin smoke standing in the sun above the candles). A few tall soft sheets that rise
       slowly from the tables and from the pot of sand before them, lean with the air and thin as they climb: each a pure
       function of the clock it is handed. Faint: air that catches the light, not an effect (found missing by the audit
       of 12 Nov: the plan had it, the build did not) */
    const haze = (() => {
      const g = new THREE.Group(); dayOne.add(g);
      const t0 = tex(makeGlow(THREE, cnv)), rnd = rng(7741), list = [];
      for (const [x, z] of [[-1.7, -11.0], [-0.6, -11.5], [0.5, -10.9], [1.5, -11.4], [-0.1, -12.1], [2.1, -10.7], [-2.2, -11.8], [0.85, -9.7]]) {
        const m = new THREE.SpriteMaterial({ map: t0, color: 0xfff3e0, transparent: true, opacity: 0, depthWrite: false, fog: false }); mats.push(m);
        const sp = new THREE.Sprite(m); sp.renderOrder = 2; g.add(sp);
        list.push({ s: sp, x, z, w: 0.9 + rnd() * 0.8, T: 14 + rnd() * 9, ph: rnd(), a: 0.1 + rnd() * 0.06, dr: 0.5 + rnd() * 0.7, y0: z > -10 ? 0.4 : 1.5 });
      }
      return { g, list };
    })();
    function hazeTick(t) {
      if (!dayOne.visible) return;
      for (const h of haze.list) { const u = (((t / h.T + h.ph) % 1) + 1) % 1;
        h.s.position.set(h.x + h.dr * u * u + Math.sin(t * 0.23 + h.ph * 6.283) * 0.12 * (0.3 + u), h.y0 + 0.5 + 3.4 * u, h.z);
        h.s.scale.set(h.w * (0.7 + 1.1 * u), 1.3 + 1.6 * u, 1);
        h.s.material.opacity = h.a * Math.pow(Math.sin(Math.PI * Math.min(1, u * 1.15)), 1.2) * (1 - 0.35 * u); }
    }

    /* ---- THE PLASTIC CHAIRS AND THE LOUDSPEAKERS (the plan's §6.3; found unmade by the audit of 12 Nov).
       CHAIRS (photographs 5 and 6: white ones behind the master's bench, blue ones at its east side, people's things on
       them): one white model, the blue a tint of it (white times a colour is that colour). They are the day's: they
       stand with the crowd and are stacked away by the morning, so they are day one's group and their columns are the
       crowd's (lifted when the crowd is gone: crowdSolid). No far level: a chair's legs and slots ARE its outline. */
    (function chairsAndHorns() {
      const B2 = (a, b) => benchAt(a, b), to = benchAt(0.3, 2.2), r = 0.26;
      const seat = (a, b, turn) => { const [x, z] = B2(a, b); crowdBlock.push(new THREE.Box3(new THREE.Vector3(x - r, 0, z - r), new THREE.Vector3(x + r, 1.5, z + r)));
        return { x, y: 0, z, ry: faceTo(x, z, to[0], to[1]) + turn }; };
      /* (and two at the way in, by the tables of bai sri: the plan's §3.2, "plastic chairs in blue and white") */
      const at = (x, z, ry) => { crowdBlock.push(new THREE.Box3(new THREE.Vector3(x - r, 0, z - r), new THREE.Vector3(x + r, 1.5, z + r))); return { x, y: 0, z, ry }; };
      /* (each place its own mesh, 12 Nov: one mesh for the chairs at the bench AND the one at the way in had a sphere the
         width of the ground, so all of them were handed to the GPU wherever he looked. The same chairs, the same places) */
      const blue = (made) => { for (const im of made) im.material.color.set(0x2f62c8); };
      many('w3pchair', [seat(-1.7, -1.45, 0.12), seat(-0.6, -1.7, -0.08), seat(1.15, -1.55, 0.2)], dayOne, 0.8);
      many('w3pchair', [at(-9.2, 9.0, 1.45)], dayOne, 0.8);
      many('w3pchair', [seat(3.1, -0.75, -0.15), seat(3.6, -0.05, 0.1)], dayOne, 0.8, blue);
      many('w3pchair', [at(-9.25, 9.8, 1.7)], dayOne, 0.8, blue);
      /* LOUDSPEAKERS: a pair of grey horns on a steel pole at three corners of the ground, where the music and the
         chanting come from (the pole is a post: structure, like the tents' frames; the horns are the model) */
      const mPole = M({ color: 0x8b8e90, roughness: 0.55, metalness: 0.45 }), H = 4.1, list = [];
      /* (v26.2 debug: the north-west pole stood at -10.45, under the open shed's eave, and went up through its roof (Chad's
         picture of the corner by the fence); it stands clear of the eave now, outside the fence's corner) */
      for (const [x, z, ry] of [[-9.7, -9.35, 0.9], [10.7, -8.1, -0.8], [-9.5, 12.7, 2.3]]) {
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.04, H, 8), mPole); pole.position.set(x, H / 2, z); pole.matrixAutoUpdate = false; pole.updateMatrix();
        world.add(pole); owned.push(pole); solidBox(0.2, 2.2, 0.2, x, 1.1, z);
        list.push({ x, y: H - 0.3, z, ry });
      }
      /* (a pole a mesh: three poles at three corners of the ground made one sphere over all of it) */
      for (const horn of list) many('w3horns', [horn], world, 0.6);
    })();
    /* ================================================================ THE PLAY (the plan's §4.1, §4.3, §9)
       Every beat on the chapter clock (wall time, v7.1); every line through the queue, one voice at a time; each beat's
       receipt in the phase string, so a Continue lands where a reload would.
       The plan's §3.7, "cinematic in play": the ground answers his feet (things happen at his marks, not on a clock);
       his look is borrowed gently and given back; his hands are the actor (the bai sri carried all day); nothing is on
       the screen but the world in the set pieces. */
    const PHASES = ['arrive', 'baisri', 'tables', 'place', 'festival', 'seen', 'check', 'dawn', 'knelt', 'told', 'breath', 'taught', 'decide'];
    const DAY_TWO = new Set(['dawn', 'knelt', 'told', 'breath', 'taught', 'decide']);
    let phase = 'arrive';
    let booted = false, preplaced = '';
    const dayClock = { t: 0 };
    let lastWall = 0, pausedAt = 0, lastWall0 = 0;
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

    /* ---- THE GROUND'S SOUND (M7). THE BEDS, each eased toward what the day and the beat want: the festival's crowd
       and its music over the loudspeakers (day one), the morning's birds (day two), the world heard OPEN (the breath's
       own level: the game's sound there, with kit.hush closing it), the pull's drone (the pull's own number: however
       long he stands in it). In a film the beds are the film's (filmBed: y_stage.js writes it from the film's clock;
       every film cues the rest of its sound itself). The engine ducks every bed under a voice (8 dB). The order is
       DATA.ambience.beds'.
       THE LEVELS are set from each file's measured level (masters/v26.0/sound/levels.py -> LEVELS.txt: the median of
       its seconds), to where the bed stands with nobody speaking: the quiet places at the house's -35 dBFS (the morning's
       birds, the night, his shop a little under), and DAY ONE LOUD, as the real one is (Chad: "festive, loud, and
       colourful"): its music over the loudspeakers at -26.5 and the crowd at -31 under it, -25 together, which a
       voice (-16) still stands 17 dB over through the duck. The world heard open at -28.5 when it is wide; the pull's
       drone at -30 at its height, the ground's noise fallen away under it */
    const BED = { fest: 0.64, mus: 0.38, birds: 0.56, open: 0.75, crick: 0.56, pull: 0.62, shop: 0.56 };
    const bedMix = { fest: 0, mus: 0, birds: 0, open: 0, crick: 0, pull: 0, shop: 0 };
    const filmBed = { on: false, fest: 0, mus: 0, birds: 0, open: 0, crick: 0, pull: 0, shop: 0 };
    const BED_EASE = { fest: 1.0, mus: 1.6, birds: 1.0, open: 0.22, crick: 0.8, pull: 0.3, shop: 0.5 };
    const DAY1 = new Set(['arrive', 'baisri', 'tables', 'place', 'festival', 'seen', 'check']);
    /* THE MIX FOLLOWS WHERE HE STANDS (the plan's §3.7: "each tent, the tables and the open turf has its own sound"; left
       unbuilt until the release's closing pass: the beds were mixed by the beat alone). On day one, in play: the
       loudspeakers' music stands up to a decibel and a quarter over its level beside a horn and as much under it across
       the ground from all three, and it comes from where the horns are (the bed's own pan, eased); the crowd's noise is
       fullest in among the people and a decibel under at the ground's edges; and each of the ground's own noises
       (ambTick) is loudest where it is made. The levels written above are the middle of these */
    const HORNS = [[-9.7, -9.35], [10.7, -8.1], [-9.5, 12.7]];                  // (c_zfx.js: the three poles)
    let musPan = 0;
    function placeMix() {
      let w = 0, pan = 0; const x = yaw.position.x, z = yaw.position.z;
      for (const [hx, hz] of HORNS) { const d2 = Math.max(4, (hx - x) * (hx - x) + (hz - z) * (hz - z)), k = 1 / d2; w += k; pan += k * panAt(hx, hz); }
      const dh = 1 / Math.sqrt(w);                                               // one horn at this distance would sound as the three do
      return { mus: lp(1.15, 0.87, smo(c01((dh - 3) / 9))), pan: 0.5 * pan / w,
               fest: lp(1.06, 0.89, smo(c01((Math.hypot(x - crowdMid.x, z - crowdMid.z) - 4) / 9))) };
    }
    function mixBeds(wdt, st) {
      if (!(wdt > 0)) return;
      const want = { fest: 0, mus: 0, birds: 0, open: 0, crick: 0, pull: 0, shop: 0 };
      let panTo = 0;
      if (st === 'cine') { if (filmBed.on) for (const k in want) want[k] = filmBed[k]; }
      /* (on the title and the chapter's card nothing is heard: the engine holds every bed at 0 there. Nothing is RAISED
         there either: this frame runs under the title too, and the opening film began on a second of day one's crowd,
         eased down from the level play would have had: my own fault, found by the sound probe's first reading) */
      else if (st === 'title' || st === 'chapter') { /* all at 0 */ }
      else if (DAY1.has(phase)) {
        /* (the pull: the ground's own noise falls away under it, the music first; kit.hush closes the bus besides) */
        const pk = play.pull ? smo(c01(play.pull.k)) : 0;
        want.fest = BED.fest * (1 - 0.5 * pk) * (phase === 'check' ? 0.8 : 1); want.mus = BED.mus * (1 - pk) * (phase === 'check' ? 0.8 : 1);
        want.pull = BED.pull * pk;
        if (play.chanting) { want.mus = 0; want.fest *= 0.55; }                             // the chant is on the loudspeakers, and the ground is bowing
        if (st === 'play') { const PM = placeMix(); want.mus *= PM.mus; want.fest *= PM.fest; panTo = PM.pan; }
      } else { want.birds = BED.birds; if (phase === 'breath') want.open = BED.open * Math.max(0, open.shown); }
      for (const k in bedMix) bedMix[k] += (want[k] - bedMix[k]) * (1 - Math.exp(-wdt / BED_EASE[k]));
      musPan += (panTo - musPan) * (1 - Math.exp(-wdt / 0.7));
      const B = DATA.ambience.beds; B[0][1] = bedMix.fest; B[1][1] = bedMix.mus; B[2][1] = bedMix.birds; B[3][1] = bedMix.open; B[4][1] = bedMix.crick; B[5][1] = bedMix.pull; B[6][1] = bedMix.shop;
      B[1][2] = Math.abs(musPan) < 0.002 ? 0 : musPan;
    }
    /* where a sound of the ground is, on his screen */
    function panAt(x, z) {
      const dx = x - yaw.position.x, dz = z - yaw.position.z, a = Math.atan2(dx, -dz) + yaw.rotation.y;
      return THREE.MathUtils.clamp(Math.sin(a) * 0.75, -0.75, 0.75);
    }
    /* THE GROUND'S OWN NOISES, one at a time on the chapter's clock from their own seeded stream (e3c3's shape, v21.13):
       on day one a child running past, the loudspeaker's crackle, the flags and banners in a gust, bottles in a crate, a
       master's hand bell, a burst of clapping; on day two a dove in the tree, a motorbike on the road, a far temple's
       bell, the flags. Each panned to where it comes from, a third quieter while a line is being said. Never two at
       once; never in the bows, the line and the pull, or OPEN AND CLOSE (those have their own sound); in play only;
       reset() rewinds the stream (v8.1). Every one-shot file has its loudest twentieth of a second at -14 dBFS (sound.sh), so a
       volume here says where it stands: day one's at -23 or so over a ground at -25 (heard as the ground's own, never
       in front of it), the morning's at -29 over birds at -35 */
    const AMB_SEED = 0x2603;
    let ambSeed = AMB_SEED, ambAt = 0, ambBusy = 0, ambLast = '', ambN = 0;
    /* (which wick the taper stood at when last looked at, and what the children were doing: extrasSound, below) */
    let wickAt = -1, kidsPh = '';
    /* (how often each has sounded: a sound played through worldSfx is in no cue log, so the claim is made countable, v5.29) */
    const extrasHeard = { wick: 0, laugh: 0, toss: 0 };
    function ambRand() {
      ambSeed = (ambSeed + 0x6D2B79F5) | 0; let t = ambSeed;
      t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }
    const ambSide = (lo, hi) => (ambRand() < 0.5 ? -1 : 1) * (lo + ambRand() * (hi - lo));
    const AMB = {
      one: [
        { n: 'x3os1', v: 0.36, len: 3.0, at: () => ({ x: ambSide(2, 9), z: 2 + ambRand() * 8 }) },          // a child, somewhere among the mats
        { n: 'x3os2', v: 0.28, len: 3.0, at: () => ({ x: 0, z: -13 }) },                                    // the loudspeakers, at the hall
        { n: 'x3os3', v: 0.36, len: 4.0, at: () => ({ x: ambSide(0, 4), z: -2 + ambRand() * 4 }) },         // the pole's flags and the banners
        { n: 'x3os4', v: 0.34, len: 2.5, at: () => ({ x: 9 + ambRand() * 3, z: ambSide(1, 6) }) },          // bottles, at the east tents
        { n: 'x3os5', v: 0.34, len: 2.5, at: () => ({ x: -9.5, z: ambSide(0, 4) }) },                       // a hand bell, along the masters' row
        { n: 'x3os6', v: 0.36, len: 4.0, at: () => ({ x: -8, z: 2 + ambRand() * 3 }) },                     // clapping, by the masters
      ],
      two: [
        { n: 'x3os7', v: 0.18, len: 3.0, at: () => ({ x: 9, z: 8 }) },                                      // a dove, in the tree by his bench
        { n: 'x3os8', v: 0.16, len: 5.0, at: () => ({ x: ambSide(20, 40), z: 25 }) },                       // a motorbike, on the road
        { n: 'x3os9', v: 0.18, len: 5.0, at: () => ({ x: -40, z: -10 }) },                                  // a far temple's bell
        { n: 'x3os3', v: 0.17, len: 4.0, at: () => ({ x: ambSide(0, 4), z: -2 + ambRand() * 4 }) },         // the flags
      ],
    };
    function ambTick() {
      if (!worldSfx || (soundOff && soundOff())) return;
      const one = phase === 'arrive' || phase === 'baisri' || phase === 'tables' || phase === 'seen' || phase === 'check';
      const two = phase === 'dawn' || phase === 'decide';
      if (!(one || two) || play.bow || play.pull) { ambAt = 0; return; }
      if (!ambAt) { ambAt = dayClock.t + 3 + ambRand() * 5; return; }
      if (dayClock.t < ambAt || dayClock.t < ambBusy) return;
      const pool = one ? AMB.one : AMB.two;
      let k = Math.floor(ambRand() * pool.length);
      if (pool[k].n === ambLast) k = (k + 1 + Math.floor(ambRand() * (pool.length - 1))) % pool.length;
      const sd = pool[k], at = sd.at();
      /* (and by how far off it is made: full within five metres, three fifths across the ground) */
      const far = one ? lp(1, 0.6, smo(c01((Math.hypot(at.x - yaw.position.x, at.z - yaw.position.z) - 5) / 13))) : 1;
      const vol = sd.v * far * (dayClock.t < speak.until ? 0.66 : 1) * (0.85 + 0.3 * ambRand());
      if (worldSfx(sd.n, vol, 0.95 + 0.1 * ambRand(), panAt(at.x, at.z))) {
        ambN++; ambLast = sd.n; ambBusy = dayClock.t + sd.len + 0.8;
        ambAt = dayClock.t + (one ? 6 + ambRand() * 8 : 9 + ambRand() * 11);
      } else ambAt = dayClock.t + 1.5;
    }
    /* (v26.1) HIS FEET ON THE GRASS: eight falls of one walk on a lawn, cut apart so each ends before the next begins (a
       footfall comes every 0.22 s), dealt from a seeded stream so no fall comes twice running (Chad, 12 Nov 2026: "i dislike
       the walking sound effect, it does not sound like walking on grass ground, do a better sound effect for it please":
       masters/v26.1/sound/steps.sh). The engine asks every footfall (stage.stepSound, v16.0) */
    const STEPS_GRASS = ['x3grass1', 'x3grass2', 'x3grass3', 'x3grass4', 'x3grass5', 'x3grass6', 'x3grass7', 'x3grass8'];
    const STEP_SEED = 8807;
    let stepSeed = STEP_SEED, stepLast = -1;
    function stepNext() {
      stepSeed = (stepSeed * 1664525 + 1013904223) >>> 0;
      let i = Math.floor(stepSeed / 4294967296 * (STEPS_GRASS.length - (stepLast < 0 ? 0 : 1)));
      if (stepLast >= 0 && i >= stepLast) i++;
      stepLast = i; return STEPS_GRASS[i];
    }
    function ambReset() { ambSeed = AMB_SEED; ambAt = 0; ambBusy = 0; ambLast = ''; ambN = 0; for (const k in bedMix) bedMix[k] = 0; filmBed.on = false; wickAt = -1; kidsPh = ''; musPan = 0; stepSeed = STEP_SEED; stepLast = -1; }

    const W = DATA.words;
    const play = { run: 0, busy: false, turning: null, bow: null, bai: false, baiP: 0, baiTo: 0, baiSecs: 1, knelt: false, homage: false,
                   pull: null, looked: false, asked: new Set(), checked: false, bowed: false, breath: null, lookEase: null,
                   tonGive: null, ymCarry: false, ymSet: null, pull3: 0, ymHands: null, away: false, chanting: false };
    let decOpen = false;
    const live = (run) => alive && run === play.run;
    /* the receipts inside a phase (§9): the homage made; who has been asked; the bow made; how the breaths went */
    function mark() {
      const t = [];
      if (phase === 'place' && play.homage) t.push('h');
      if (phase === 'check') { if (play.asked.has('ton')) t.push('t'); if (play.asked.has('aunt')) t.push('a'); if (play.checked) t.push('x'); }
      if (phase === 'knelt' && play.bowed) t.push('b');
      if (play.breath) t.push('c' + play.breath.closed, 'f' + play.breath.held);
      return t.join(',');
    }
    function readMark(p0) {
      const [p1, tag = ''] = String(p0 || '').split(':');
      const p = PHASES.includes(p1) ? p1 : 'arrive', f = new Set(tag.split(',').filter(Boolean));
      const num = (c) => { for (const v of f) if (v[0] === c && /^\d$/.test(v.slice(1))) return +v.slice(1); return null; };
      return { p, homage: f.has('h'), ton: f.has('t'), aunt: f.has('a'), checked: f.has('x'), bowed: f.has('b'), closed: num('c'), held: num('f') };
    }
    function setPhase(p, opts) { phase = p; if (kit) kit.setPhase(p + ':' + mark()); objectiveFor(p, opts); }
    function saveMark() { if (kit) kit.setPhase(phase + ':' + mark()); }        // a beat inside a phase banks its receipt the moment it counts
    function bank(note, a = 0) {
      if (!kit || !note) return;
      const got = kit.getConduct ? kit.getConduct().notes : [];
      if (!got.includes(note)) kit.conduct({ note, s: 0, a });
    }

    /* ---------------------------------------------------------------- places (x east, z south; the tracker's §10) */
    const EYE = 1.62;
    const KNEEL = { y: 0.9, span: 1.2, lo: -0.9, hi: 0.55 };                  // his eye sat back on his heels, and how far he may look about
    const TON_HEAD = () => { const g = cast.ton.group.position; return { x: g.x, y: cast.ton.seated ? 0.95 : 1.52, z: g.z }; };
    const TABLES_AT = { x: 0, z: -8.85 };                                     // where he stands to pay his respects, on the gravel before the tables
    const BUDDHA = { x: WHEEL.x, y: 1.95, z: WHEEL.z };                       // where he looks as he pays his respects: the hub of the wheel of marigolds (the small seated image photograph 10 shows before it is not made until Chad says what it is: a sacred image is never guessed)
    const PLACE = { x: -2.25, z: 1.25 };                                      // his place on the turf, at the north-east corner of the group's rows
    const PLACE_RY = Math.atan2(-(0 - PLACE.x), -(-11.2 - PLACE.z));          // (a look's yaw: toward the offering tables)
    const TON_PLACE = { x: PLACE.x - 1.05, z: PLACE.z + 0.12 };
    /* second in the line at his bench, half a step to one side of the one who kneels: straight behind him the young man
       was hidden by the player's own bai sri the moment he sat back on his heels (photographed) */
    const LINE_AT = (() => { const [x, z] = benchAt(0.95, 3.05); return { x, z }; })();
    const TON_LINE = (() => { const [x, z] = benchAt(-0.7, 3.65); return { x, z }; })();
    /* the woman at his bench, on day one: at the carpet's edge beside the lime pole, where each bai sri is handed to her
       (by the table, the pole stood between her and anyone who came to ask her: photographed) */
    /* (v26.2 debug: at (1.5, 2.1) she stood 0.38 m from the lime pole's middle, inside its lowest puffs: measured,
       tools/probes/clipscan.mjs. A step to her right and back) */
    const AUNT_LINE = (() => { const [x, z] = benchAt(1.85, 2.5), [kx, kz] = benchAt(0.46, 1.3); return { x, z, ry: faceTo(x, z, kx, kz) }; })();
    const YM_B = 1.28;                                                        // how far before the bench the young man kneels (then moved so the two pairs of hands meet: ymPlace)
    const DAWN_AT = { x: 2.1, z: 3.6 };                                       // where the morning finds him
    /* HIS HANDS, KNEELING: on his knees, under the frame's foot. The walking hand the engine draws stood in the middle of
       a phone's frame across his teacher's lap (photographed); it is put away the way a carried thing's hand is (kit.hold
       `bare`, with nothing in it), and comes back for a bow (kit.pray draws both) and when he stands */
    const noHand = new THREE.Group();
    function handsAway(on) { play.away = !!on; if (!kit || !kit.hold) return; if (!on && kit.holding && kit.holding() === noHand) kit.hold(null); }
    function awayTick() { if (!play.away || !kit || !kit.hold || play.bai) return; if (kit.praying && kit.praying()) return; if (!kit.holding()) kit.hold(noHand, { bare: true }); }
    /* Ton, the morning after: a dozen degrees to the right of the line from where the player stands to Grandmaster Pho,
       2.6 m off, so a portrait phone holds him whole beside the bench (he stood at its edge, cut in half: photographed) */
    const TON_DAWN = (() => { const a = Math.atan2(PHO_AT[0] - DAWN_AT.x, PHO_AT[1] - DAWN_AT.z) - 0.21; return { x: DAWN_AT.x + Math.sin(a) * 2.6, z: DAWN_AT.z + Math.cos(a) * 2.6 }; })();
    /* before Grandmaster Pho, on the carpet's outer half: 2.2 m from him, so his whole seated figure stands in a phone's
       frame (at 1.5 m his chest filled it under the canopy's roof: photographed) */
    const KNEEL2 = (() => { const [x, z] = benchAt(0.46, 2.25); return { x, z }; })();
    const PHO_HEAD = { x: PHO_AT[0], y: 1.3, z: PHO_AT[1] };
    const yawTo = (x, z, tx, tz) => Math.atan2(-(tx - x), -(tz - z));         // the look's yaw from a place onto a point
    const phoYawFrom = (p) => yawTo(p.x, p.z, PHO_AT[0], PHO_AT[1]);
    const AUNT_HEAD = () => { const g = cast.aunt.group.position; return { x: g.x, y: 1.42, z: g.z }; };

    /* a person turned to a heading over a moment (never a snap: v14.5) */
    const turns = [];
    function turnPerson(P, to, secs) { if (!P) return; for (let i = turns.length - 1; i >= 0; i--) if (turns[i].P === P) turns.splice(i, 1); turns.push({ P, from: P.group.rotation.y, to, t: 0, secs: Math.max(0.05, secs) }); }
    function turnsTick(wdt) { for (let i = turns.length - 1; i >= 0; i--) { const T2 = turns[i]; T2.t = Math.min(1, T2.t + wdt / T2.secs); T2.P.group.rotation.y = T2.from + angTo(T2.from, T2.to) * smo(T2.t); if (T2.t >= 1) turns.splice(i, 1); } }

    /* the orders (§4.1, §4.3). `complete: false` where the change is not his doing (the v8.7 lie) */
    function objectiveFor(p, opts) {
      if (!kit) return;
      let o = null, wp = null;
      if (p === 'arrive') { if (!play.busy) { o = W.objTon; wp = TON_HEAD(); } }
      else if (p === 'baisri') { if (!play.busy) { o = W.objTables; wp = { x: TABLES_AT.x, y: 1.25, z: TABLES_AT.z - 1.0 }; } }
      else if (p === 'tables') { o = W.objPlace; wp = { x: PLACE.x, y: 0.5, z: PLACE.z }; }
      else if (p === 'place') { if (play.knelt && !play.homage && !play.busy) o = W.objHomage; }
      else if (p === 'festival') { if (play.pull && play.pull.offer && !play.looked) { o = W.objLook; wp = PHO_HEAD_NOW(); } else if (!play.looked) o = W.objLine; }
      else if (p === 'check') { if (!play.checked && !play.busy) { o = W.objCheck; wp = !play.asked.has('ton') ? TON_HEAD() : !play.asked.has('aunt') ? AUNT_HEAD() : null; } }
      else if (p === 'dawn') { o = W.objGo; wp = { x: KNEEL2.x, y: 0.5, z: KNEEL2.z }; }
      else if (p === 'knelt') { if (!play.busy) o = play.bowed ? W.objTell : W.objBow; }
      kit.objective(o, opts);
      kit.waypoint(wp);
    }
    const _ph = new THREE.Vector3();
    function PHO_HEAD_NOW() { const P = cast.pho; if (P && P.ready && P.head) { P.head.getWorldPosition(_ph); return { x: _ph.x, y: _ph.y + 0.06, z: _ph.z }; } return PHO_HEAD; }

    /* THE LOOK: which of the looks the ground wears (a preset of light, the painted shade, and what only that day draws) */
    let lookName = 'DAY1';
    const PHO_LEVEL = { DAY1: 1, DAWN: 0.86, OPENED: 1, SHUT: 0.8, AFTERNOON: 0.95, DUSK: 0.62, NIGHT: 0.3 };   // the unlit share of his look, dimmed to the hour (c_cast.js lookD)
    function look(name, secs = 0) {
      if (kit) kit.daylight(PRESETS[name] || null, secs);
      lookName = name;
      const two = name === 'DAWN' || name === 'OPENED' || name === 'SHUT' || name === 'AFTERNOON' || name === 'DUSK';
      dayOne.visible = name === 'DAY1'; dayTwo.visible = two; nightG.visible = name === 'NIGHT'; duskG.visible = name === 'DUSK';
      crowdSolid(dayOne.visible);
      paintShade(name === 'OPENED' || name === 'SHUT' ? 'DAWN' : name);
      phoLook.level.value = PHO_LEVEL[name] != null ? PHO_LEVEL[name] : 1;
    }
    function openDecision() { decOpen = true; if (getState() === 'play') startDecision(); }

    /* ---------------------------------------------------------------- his look, borrowed and given back (v11.1)
       A glide and a turn to a heading with the eye easing to its height (chapter 2's turnTo), and for a standing man a
       plain ease of the look onto a point; the player's own look is his again the moment either ends. */
    function turnTo(to, secs, o, done) {
      play.turning = { t: 0, from: yaw.rotation.y, to, secs, y: o.y, span: o.span, lo: o.lo, hi: o.hi, done, stand: !!o.stand,
                       pos: o.pos || null, p0: { x: yaw.position.x, z: yaw.position.z }, pitch: o.pitch, pt0: pitch.rotation.x };
    }
    function turnTick(wdt) {
      const T2 = play.turning; if (!T2) return;
      T2.t += wdt / T2.secs;
      const k = smo(Math.min(1, T2.t));
      yaw.rotation.y = T2.from + angTo(T2.from, T2.to) * k;
      if (T2.pos) { yaw.position.x = T2.p0.x + (T2.pos.x - T2.p0.x) * k; yaw.position.z = T2.p0.z + (T2.pos.z - T2.p0.z) * k; }
      if (T2.pitch != null) pitch.rotation.x = T2.pt0 + (T2.pitch - T2.pt0) * k;
      if (kit && !T2.stand) kit.pose('lying', { y: T2.y, yaw: yaw.rotation.y, span: 0.02, pitchLo: Math.min(T2.lo, pitch.rotation.x - 0.01), pitchHi: Math.max(T2.hi, pitch.rotation.x + 0.01), secs: 0.9 });
      if (T2.t >= 1) {
        play.turning = null;
        if (kit && !T2.stand) kit.pose('lying', { y: T2.y, yaw: T2.to, span: T2.span, pitchLo: T2.lo, pitchHi: T2.hi, secs: 0.05 });
        if (T2.done) T2.done();
      }
    }
    /* standing: the look eased onto a point (and, with `pos`, his feet to a spot) */
    function lookAt(pt, secs, done, pos) {
      const px = pos ? pos.x : yaw.position.x, pz = pos ? pos.z : yaw.position.z, d = Math.hypot(pt.x - px, pt.z - pz);
      turnTo(yawTo(px, pz, pt.x, pt.z), secs, { stand: true, pos: pos || null, pitch: Math.atan2(pt.y - yaw.position.y, Math.max(0.3, d)) }, done);
    }

    /* ---------------------------------------------------------------- THE BAI SRI IN HIS HANDS
       Carried all day, his hands under the frame's foot (c_zfx.js BAI says why): low while he walks, only the top of its
       cone in sight; raised when he offers it. It rides the hands' own frame (kit.hold, the hand out of sight), so it
       bobs with his steps and shakes when his hands do. `p`: -1 gone down under the frame, 0 carried, 1 raised, 2 held
       high before his face; eased on the wall clock. */
    const _bq0 = new THREE.Quaternion(), _bv0 = new THREE.Vector3();
    function baiHands(on, o = {}) {
      play.bai = !!on;
      if (!kit) return;
      if (on) {
        if (o.p != null) play.baiP = o.p;
        if (o.from != null) { play.baiP = o.from; play.baiTo = o.p != null ? o.p : 0; play.baiSecs = Math.max(0.05, o.secs != null ? o.secs : 0.7); } else play.baiTo = play.baiP;
        kit.hold(handBai, { bare: true }); baiPlace();
      } else {
        if (kit.holding && kit.holding() === handBai) kit.hold(null);
        handBaiHolder.add(handBai);
        play.baiP = play.baiTo = 0;
      }
    }
    function baiRaise(p, secs = 1.2) { play.baiTo = p; play.baiSecs = Math.max(0.05, secs); }
    /* where it stands in the hands' frame at p (a smooth path through its places), and the pull laid on it */
    function baiPlace() {
      const A = handBai.parent; if (!A || A === handBaiHolder) return;
      const p = play.baiP, Pu = play.pull, k = Pu ? smo(Pu.k) : 0, t = dayClock.t;
      const seg = p < 0 ? [BAI.carry, BAI.down, smo(c01(-p))] : p <= 1 ? [BAI.carry, BAI.raise, smo(c01(p))] : [BAI.raise, BAI.high, smo(c01(p - 1))];
      let x = lp(seg[0][0], seg[1][0], seg[2]), y = lp(seg[0][1], seg[1][1], seg[2]), z = lp(seg[0][2], seg[1][2], seg[2]), tilt = 0;
      /* the pull: his hands begin to lift it and to sway with it, slowly, by themselves */
      if (k > 0) { y += k * (0.05 + 0.022 * Math.sin(t * 0.9) + 0.01 * Math.sin(t * 2.3)); x += k * 0.02 * Math.sin(t * 0.62); tilt = k * 0.09 * Math.sin(t * 0.62 + 0.6); }
      _bq0.copy(A.quaternion).invert();
      handBai.position.copy(_bv0.set(x, y, z).sub(A.position).applyQuaternion(_bq0));
      handBai.quaternion.copy(_bq0); handBai.rotateY(BAI.yaw); if (tilt) handBai.rotateZ(tilt);
    }
    function baiTick(wdt) {
      if (!play.bai || !kit) return;
      if (kit.holding && kit.holding() !== handBai && getState() === 'play') kit.hold(handBai, { bare: true });   // (a film let go of it: it is his again)
      if (play.baiP !== play.baiTo) { const st = wdt / play.baiSecs * Math.max(1, Math.abs(play.baiTo - play.baiP) > 1 ? 2 : 1); play.baiP = play.baiTo > play.baiP ? Math.min(play.baiTo, play.baiP + st) : Math.max(play.baiTo, play.baiP - st); }
      baiPlace();
    }

    /* ================================================================ P1 · TON, AND THE BAI SRI */
    const WARM_DAY1 = ['q3v', 'tn3a1', 'q3p1', 'tn3a2', 'q3u1', 'q3u2', 'tn3m1', 'q3u3', 'tn3m2', 'q3c1', 'tn3c1', 'q3c2', 'ds3c1', 'tn3c2', 'q3c3',
                       'x3baitake', 'x3baiset', 'x3kneel', 'x3bowall', 'x3petals', 'x3chant', 'x3tone',
                       'x3grass1', 'x3grass2', 'x3grass3', 'x3grass4', 'x3grass5', 'x3grass6', 'x3grass7', 'x3grass8', 'x3os1', 'x3os2', 'x3os3', 'x3os4', 'x3os5', 'x3os6', 'x3wick'];
    const WARM_DAY2 = ['ph3g1', 'ph3b0', 'ph3b1', 'ph3b2', 'ph3b3', 'ph3b4', 'ph3bx', 'ph3by', 'ph3b5', 'ph3p1', 'x3kneel', 'x3baiset', 'x3bell',
                       'x3grass1', 'x3grass2', 'x3grass3', 'x3grass4', 'x3grass5', 'x3grass6', 'x3grass7', 'x3grass8', 'x3os3', 'x3os7', 'x3os8', 'x3os9'];
    function dayOneStage() {
      look('DAY1', 0); auraAt(0, 0); mistK = 1; burstsClear();
      zoneAt(null);
      whenReady(cast.pho, (P) => { rest(P, 0); gaze(P, null); });
      whenReady(cast.ym, (P) => { P.group.visible = false; }); ymBai.visible = false;
      whenReady(cast.aunt, (P) => { put(P, P.home.x, P.home.z, P.home.ry); rest(P, 0); P.group.visible = true; castSolid(); });
      dayCast(true);
    }
    /* who is on the ground: the other masters and the monks on day one only (the next morning he sits alone) */
    function dayCast(one) { for (const P of [cast.hermitA, cast.red, cast.hermitB, cast.white].concat(cast.monks)) whenReady(P, (Q) => { Q.group.visible = one; }); }
    function tonHome() { whenReady(cast.ton, (P) => { put(P, P.home.x, P.home.z, P.home.ry); P.seated = false; rest(P, 0); P.rest.take = 'Idle_3'; take(P, 'Idle_3', 0); P.group.visible = true; castSolid(); }); }
    function arriveBegin() {
      dayOneStage(); setFormation('arrive'); tonHome();
      baiPut(myBai, TON_BAI.x, TON_BAI.y, TON_BAI.z, TON_BAI.ry);
      setPhase('arrive', { complete: false });
      if (warmSounds) warmSounds(WARM_DAY1);
      const run = play.run;
      after(4.2, () => { if (live(run) && phase === 'arrive' && !play.busy && !heard.has('q3v')) queueLine('q3v'); });
    }
    /* THE GIRL'S HANDFUL OF PETALS (the plan's §3.7, picture 2: "a handful of petals thrown beside him (play)"). The
       children have come to Ton's table to watch (kidsCall); when the bai sri is in his hands and Ton has said his line,
       the girl jumps for joy and throws up what she has gathered off the turf: one jump of her own take (its fifth
       second: crouch, both arms thrown up, down again), a third of a master's handful let go as her hands pass her head,
       falling round her and toward him, her laugh with it; his eyes are on her for it (tonTalk). If the two of them are
       not there (he spoke to Ton as they ran in), nothing is thrown: a jump that begins from a run is a stumble. */
    const JUMP = { t0: 4.42, t1: 5.42, secs: 1.2, let: 0.56 };
    function kidsToss(run) {
      const D = kidsDir, K = kids[0], P = K.P; D.hold = false; D.t = 0;
      if (formNow !== 'arrive' || D.ph !== 'restW' || !P.ready || K.moving || !P.group.visible || !P.acts.Happy_jump) return false;
      const g = P.group.position, dx = yaw.position.x - g.x, dz = yaw.position.z - g.z, d = Math.hypot(dx, dz) || 1, ux = dx / d, uz = dz / d;
      span(P, 'Happy_jump', JUMP.t0, JUMP.t1, JUMP.secs, { fade: 0.22, then: (Q) => rest(Q, 0.35) });
      after(JUMP.let, () => { if (!live(run) || !P.group.visible) return;
        petalBurst([g.x + ux * 0.1, 1.62, g.z + uz * 0.1], [g.x + ux * 0.5, g.z + uz * 0.5], dayClock.t, { r: 0.6, up: 1.25, n: 56, s: 0.03, seed: 4417 });
        if (worldSfx && !(soundOff && soundOff())) { const pan = panAt(g.x, g.z);
          worldSfx('x3petals', 0.3, 1.08, pan);
          if (worldSfx('x3os1', 0.34, 1, pan)) { ambLast = 'x3os1'; ambBusy = dayClock.t + 3.6; extrasHeard.laugh++; } }
        extrasHeard.toss++; });
      return true;
    }
    /* THEIR PLAY AT EVERY STOP OF THEIR CHASE (c_crowd.js kidsTick schedules it; Chad, 12 Nov 2026: "keep looping it every
       cycle"). The child jumps for joy (its own jump: the girl's is JUMP above; the boy's, read from his take by
       tools/probes/takeheights.mjs, crouches at 0.6 s and has his right hand over his head at 1.0 to 1.2) and lets go of a
       handful as its hands pass its head, up over the other child, to fall round them both: a third of a master's handful,
       from the children's own pool, lying on the turf eighteen seconds and then going into it (c_zfx.js). The petals'
       rustle with it, quiet and by how near he is, never over a line, a bow or the pull; nothing is thrown in the pull */
    const BOYJUMP = { t0: 0.55, t1: 1.55, secs: 1.25, let: 0.62, hand: 1.12 };
    function kidThrow(K, O) {
      const P = K.P; if (!P.ready || !P.group.visible || K.moving || !P.acts.Happy_jump || play.pull || play.bow || formNow !== 'arrive') return false;
      const J = K.i ? BOYJUMP : JUMP, g = P.group.position, o = O.P.group.position, run = play.run;
      const dx = o.x - g.x, dz = o.z - g.z, d = Math.hypot(dx, dz) || 1, ux = dx / d, uz = dz / d, reach = Math.min(0.85, 0.55 * d + 0.25);
      span(P, 'Happy_jump', J.t0, J.t1, J.secs, { fade: 0.22, then: (Q) => rest(Q, 0.35) });
      const seed = 5101 + 97 * kidsDir.stops + 31 * K.i;
      after(J.let, () => { if (!live(run) || !P.group.visible || play.pull) return;
        petalBurst([g.x + ux * 0.1, J.hand || 1.62, g.z + uz * 0.1], [g.x + ux * reach, g.z + uz * reach], dayClock.t, { r: 0.55, up: 1.15, n: 40, s: 0.03, seed, pool: kidPool, sink: 18 });
        const dh = Math.hypot(yaw.position.x - g.x, yaw.position.z - g.z);
        if (worldSfx && !(soundOff && soundOff()) && dayClock.t >= speak.until && !play.bow && dh < 9) worldSfx('x3petals', 0.26 * c01(1.3 - dh / 9), K.i ? 1.14 : 1.06, panAt(g.x, g.z));
        extrasHeard.toss++; });
      return true;
    }
    function tonTalk() {
      if (phase !== 'arrive' || play.busy) return false;
      const run = play.run; play.busy = true; objectiveFor('arrive');
      kidsCall();
      /* he is stood a stated distance before Ton and turned to his face (v14.1: never from wherever he happened to stop),
         and held there while they speak; Ton turns to him */
      { const g = cast.ton.group.position, dx = yaw.position.x - g.x, dz = yaw.position.z - g.z, d = Math.hypot(dx, dz) || 1, r = Math.max(1.9, Math.min(2.3, d));
        const at = { x: g.x + dx / d * r, z: g.z + dz / d * r };
        if (kit) kit.root(true);
        lookAt({ x: g.x, y: 1.5, z: g.z }, 0.8, null, at);
        whenReady(cast.ton, (P) => turnPerson(P, faceTo(g.x, g.z, at.x, at.z), 0.5)); }
      line('tn3a1', cast.ton); queueGap(0.3); line('q3p1'); queueGap(0.3);
      /* "Take one.": he turns to the table, takes it up and holds it out in both hands (his own take), and it is the
         player's when the line has said so */
      queueLine('tn3a2', () => { if (!live(run)) return;
        const P = cast.ton, g = P.group.position, toTable = faceTo(g.x, g.z, TON_BAI.x, TON_BAI.z), toHim = faceTo(g.x, g.z, yaw.position.x, yaw.position.z);
        P.actN++; turnPerson(P, toTable, 0.4); hold(P, 'give', 0.18, 0.5, 0.4);                       // his hands come up before his chest as he turns to the table
        after(0.45, () => { if (live(run)) play.tonGive = { k: 0 }; fx('x3baitake', 0.3, -0.3); });   // it is in his hands
        after(0.95, () => { if (!live(run)) return; turnPerson(P, toHim, 0.55); span(P, 'give', 0.5, 1.9, 1.4, { fade: 0.2, hold: 1.5 }); });   // and held out to him in both
        after(1.7, () => { if (live(run)) lookAt({ x: myBai.position.x, y: myBai.position.y + 0.3, z: myBai.position.z }, 1.0); });           // his eyes go down to it
        after(3.1, () => { if (!live(run)) return; play.tonGive = null; myBai.visible = false; fx('x3baitake', 0.36); baiHands(true, { from: -1, p: 0, secs: 0.8 });
          span(P, 'give', 3.6, 5.85, 1.9, { fade: 0.3, then: (Q) => rest(Q, 0.7) });
          after(0.9, () => { if (live(run)) lookAt({ x: g.x, y: 1.5, z: g.z }, 1.1); }); }); });                                                // and back up to Ton
      /* and as Ton's line ends, the girl by the table jumps for joy and throws up her petals: his eyes go to her (borrowed
         for the moment it takes, v11.1: wherever he stood to speak to Ton, the throw is in his frame), and then the
         ground is his to walk */
      queueFn(() => { if (!live(run)) return;
        const tossed = kidsToss(run);
        if (tossed) { const g = kids[0].P.group.position; lookAt({ x: g.x, y: 1.3, z: g.z }, 0.75); }
        after(tossed ? 1.75 : 0, () => { if (!live(run)) return; play.busy = false; play.tonGive = null; if (kit) kit.root(false);
          if (!play.bai) { myBai.visible = false; baiHands(true, { from: -1, p: 0, secs: 0.5 }); } kidsDir.hold = false; setPhase('baisri'); }); });
      return true;
    }
    /* THE OFFERING TABLES: he raises the bai sri in both hands to the small Buddha at the centre of the wheel, and bows his head */
    function payRespects() {
      if (phase !== 'baisri' || play.busy || !play.bai) return false;
      const run = play.run; play.busy = true; objectiveFor('baisri');
      if (kit) kit.root(true);
      lookAt(BUDDHA, 1.1, () => { if (!live(run)) return;
        baiRaise(1, 1.4);
        after(1.5, () => { if (!live(run)) return; play.bow = { t: 0, prev: 0, n: 1, secs: 3.4, depth: 0.5, run, sound: '', done: () => {
          baiRaise(0, 1.3);
          after(1.2, () => { if (!live(run)) return; if (kit) kit.root(false); play.busy = false; tonToPlace(); setPhase('tables'); }); } }; }); });
      return true;
    }
    /* Ton goes to his group while the player's eyes are on the tables (a change made where no shot can see it: v24.12) */
    function tonToPlace() { whenReady(cast.ton, (P) => { put(P, TON_PLACE.x, TON_PLACE.z, faceTo(TON_PLACE.x, TON_PLACE.z, 0, -11.2)); P.seated = true; P.rest.take = 'seiza'; P.rest.win = { seiza: SEIZA_WIN }; rest(P, 0); castSolid(); }); }

    /* ================================================================ P2 · A PLACE; P3 · THE HOMAGE */
    function kneelPlace(instant) {
      if (play.knelt && !instant) return false;
      play.knelt = true; zoneAt(null);
      if (kit) kit.root(true);
      /* the bai sri goes down out of his hands under the frame's foot, and stands on the turf before him */
      /* (a metre before him and a little to his left: nearer, it stood under the frame's foot and behind his own hand) */
      const front = { x: PLACE.x - Math.sin(PLACE_RY) * 1.0 - Math.cos(PLACE_RY) * 0.3, z: PLACE.z - Math.cos(PLACE_RY) * 1.0 + Math.sin(PLACE_RY) * 0.3 };
      const setDown = () => { baiHands(false); baiPut(myBai, front.x, 0.012, front.z, 0.6); handsAway(true); };
      if (instant) {
        setDown();
        yaw.position.x = PLACE.x; yaw.position.z = PLACE.z; yaw.rotation.y = PLACE_RY; pitch.rotation.x = -0.05;
        if (kit) kit.pose('lying', { y: KNEEL.y, yaw: PLACE_RY, span: KNEEL.span, pitchLo: KNEEL.lo, pitchHi: KNEEL.hi, secs: 0.05 });
        return true;
      }
      const run = play.run; play.busy = true;
      fx('x3kneel', 0.32); setPhase('place'); baiRaise(-1, 0.9);                // (it goes down under the frame's foot as he kneels, and is on the turf before him when he looks)
      turnTo(PLACE_RY, 1.1, Object.assign({ pos: PLACE, pitch: -0.3 }, KNEEL), () => { if (!live(run)) return; fx('x3baiset', 0.36); setDown();
        after(0.5, () => { if (!live(run)) return; play.busy = false; objectiveFor('place', { complete: false }); }); });
      return true;
    }
    /* THE HOMAGE: the monks' chant over the loudspeakers; the whole ground makes the krap three times on its three
       lines and once more for the teachers, and he with it, his hands joined. Each line is captioned as it is chanted
       (v21.31), timed from the homage's own start so it is right when the game is muted. */
    const HOMAGE = { bow: 5.6, n: 4, lead: 1.2 };
    /* WHERE EACH LINE OF THE CHANT IS in its file, seconds from its start (masters/v26.0/chant/timing.json: the lines
       are laid where the bows are, and measured there): on the ground's loudspeakers, and from the temple across the
       fields (ending D). The captions stand on these, so they are right when the game is muted (v21.31) */
    const CHANT = { near: [[1.4, 6.6], [7.0, 10.9], [12.6, 18.0]], far: [[0.5, 5.7], [6.1, 10.0], [11.7, 17.1]] };
    function homage() {
      if (phase !== 'place' || !play.knelt || play.homage || play.busy) return false;
      const run = play.run; play.busy = true; objectiveFor('place');
      handsAway(false);
      if (kit) { kit.pray(true, { secs: 0.9, y: -0.3 });
        kit.pose('lying', { y: KNEEL.y, yaw: PLACE_RY, span: 0.02, pitchLo: -1.4, pitchHi: KNEEL.hi, secs: 0.3 });
        if (kit.captions) kit.captions([1, 2, 3].map((k) => ({ at: CHANT.near[k - 1][0], end: CHANT.near[k - 1][1], text: W['cap' + k], sub: W['cap' + k + 'Sub'] }))); }
      fx('x3chant', 0.64); play.chanting = true;                               // (the loudspeakers carry the chant now: the ground's music stops for it, mixBeds)
      dancersStill();                                                          // (and the dancers stop where they are and turn to the tables: c_crowd.js)
      whenReady(cast.ton, (P) => hold(P, 'prostrate', 0.15, 0.85, 0.6));
      after(HOMAGE.lead, () => { if (!live(run)) return;
        play.bow = { t: 0, prev: 0, n: HOMAGE.n, secs: HOMAGE.bow * HOMAGE.n, depth: 1.0, run, sound: 'x3bowall', done: () => homageDone(run) };
        for (let k = 0; k < HOMAGE.n; k++) after(k * HOMAGE.bow, () => { if (!live(run)) return; crowdBow(HOMAGE.bow - 0.25, k === HOMAGE.n - 1);
          span(cast.ton, 'prostrate', KRAP.from, KRAP.to, HOMAGE.bow - 0.3, { fade: 0.4, hold: k === HOMAGE.n - 1 ? 0 : -0.35, then: k === HOMAGE.n - 1 ? (P) => rest(P, 0.9) : null }); }); });
      return true;
    }
    function homageDone(run) {
      if (!live(run)) return;
      play.homage = true; play.chanting = false; saveMark();
      if (kit) { kit.pray(false, { secs: 1.2 }); kit.pose('lying', { y: KNEEL.y, yaw: PLACE_RY, span: KNEEL.span, pitchLo: KNEEL.lo, pitchHi: KNEEL.hi, secs: 0.3 }); if (kit.captions) kit.captions(null); }
      after(1.4, () => { if (live(run)) festivalBegin(); });
    }
    /* THE BOWS, his own: the view lowered to the ground and brought back, laid on his look as a delta and taken off again
       (v11.1), once for each bow of `n` over `secs` */
    function bowTick(wdt) {
      const Bw = play.bow; if (!Bw) return;
      if (!live(Bw.run)) { play.bow = null; return; }
      const t0 = Bw.t; Bw.t += wdt;
      const one = Bw.secs / Bw.n, u = Math.min(1, Bw.t / Bw.secs);
      const ph = (Bw.t % one) / one, d = -Bw.depth * Math.pow(Math.sin(Math.PI * Math.min(1, ph * 1.12)), 2) * (u < 1 ? 1 : 0);
      pitch.rotation.x += d - Bw.prev; Bw.prev = d;
      if (Bw.sound) for (let k = 0; k < Bw.n; k++) { const at = k * one + one * 0.3; if (t0 < at && Bw.t >= at) fx(Bw.sound, 0.36); }
      if (u >= 1) { pitch.rotation.x -= Bw.prev; play.bow = null; if (Bw.done) Bw.done(); }
    }

    /* ================================================================ THE FILM OF THE FESTIVAL, THEN P4 · THE LINE AND THE PULL */
    function festivalBegin() {
      const run = play.run;
      const ok = kit && kit.film && kit.film('festival', { onDone: () => { if (live(run)) lineBegin(false); } });
      if (!ok) lineBegin(false);
    }
    /* the line at Grandmaster Pho's bench, as the film leaves it: the throngs before the masters, the young man kneeling
       before the bench, the player second, Ton at his shoulder */
    function lineStage() {
      look('DAY1', 0); setFormation('bless'); zoneAt(null);
      whenReady(cast.ton, (P) => { put(P, TON_LINE.x, TON_LINE.z, faceTo(TON_LINE.x, TON_LINE.z, PHO_AT[0], PHO_AT[1])); P.seated = false; P.rest.take = 'Idle_3'; P.rest.win = null; rest(P, 0); castSolid(); });
      whenReady(cast.aunt, (P) => { put(P, AUNT_LINE.x, AUNT_LINE.z, AUNT_LINE.ry); rest(P, 0); castSolid(); });
      ymPlace();
      myBai.visible = false;
    }
    /* THE YOUNG MAN IS STOOD WHERE FOUR HANDS CAN MEET ON ONE BOWL: where Grandmaster Pho's two hands are when he lays
       them forward (his own take, at its stillest moment) and where the young man's are when he raises his bai sri are
       both measured on the bodies (handsAt), and the young man is moved so that the two middles stand over one another */
    const PHO_ON = { take: 'Sitting_Answering_Questions', from: 3.5, len: 1.2 }, YM_UP = 2.6;
    /* (his hands laid on it are a STILLNESS: a third of a second of that take round its middle, the pose the raised
       bai sri was solved to meet, there and back in six seconds. Played whole at the take's pace, 1.2 s there and back
       every 2.4, his head went 15 cm a way at 12 cm a second while his hands were pinned: Chad, 12 Nov, "bobbing and
       bouncing too much". And held half risen and standing, below, on a twentieth and a tenth of a second of the rise
       in six and seven seconds: on 0.28 and 0.5 s at the take's pace he bounced 16 and 11 cm, every half second and
       every second, all the while the player was offered the press) */
    const PHO_STILL = { len: 0.3, secs: 6 };
    function ymPlace() {
      const Y = cast.ym, Ph = cast.pho; if (!Y || !Ph) return;
      const [bx, bz] = benchAt(0.46, YM_B), ry = faceTo(bx, bz, PHO_AT[0], PHO_AT[1]);
      put(Y, bx, bz, ry);
      whenReady(Y, () => whenReady(Ph, () => {
        play.ymHands = meetHands(Ph, PHO_ON.take, PHO_ON.from + PHO_ON.len * 0.5, Y, 'offer', YM_UP);
        Y.group.visible = true; rest(Y, 0);
        baiPut(ymBai, Y.group.position.x, 0.012, Y.group.position.z, 0.4); ymBai.visible = false; }));
    }
    function lineBegin(resumed) {
      const run = play.run;
      lineStage();
      yaw.position.set(LINE_AT.x, EYE, LINE_AT.z); yaw.rotation.y = phoYawFrom(LINE_AT); pitch.rotation.x = -0.08;
      if (kit) { kit.pose('standing', { secs: 0.05 }); kit.root(true); if (kit.getFade && kit.getFade() > 0.01) kit.fade(0, 1.1); }
      play.knelt = false; play.looked = false; play.busy = true; play.pull = null; handsAway(false);
      baiHands(true, { p: 0, secs: 0.01 });
      setPhase('festival', { complete: false });
      /* THE BLESSING AHEAD OF HIM (photographs 5 and 6), then the pull */
      const T = { up: 1.2, on: 2.6, petals: 6.4, down: 9.6, trance: 10.4, rise: 11.2, pull: 12.0, say: 15.5 };
      after(T.up, () => { if (!live(run)) return; ymBai.visible = true; play.ymCarry = true; span(cast.ym, 'offer', 5.9, YM_UP, 1.5, { hold: 0.5, fade: 0.5 }); lay(cast.ym, ymGrip, { secs: 0.5 }); fx('x3baitake', 0.22, 0.2); });
      after(T.on, () => { if (!live(run)) return; hold(cast.pho, PHO_ON.take, PHO_ON.from + PHO_ON.len * 0.5 - PHO_STILL.len * 0.5, PHO_STILL.len, 0.9, PHO_STILL.secs); lay(cast.pho, phoGrip, { secs: 1.0 }); });
      after(T.petals, () => { if (!live(run)) return; lay(cast.pho, null, { secs: 0.45 }); span(cast.pho, 'Sit_Cheer_with_Left_Hand', 0.15, 2.5, 2.7, { fade: 0.5, then: (P) => rest(P, 0.8) });
        after(1.3, () => { if (!live(run)) return; const Y = cast.ym.group.position, h = PHO_HAND_UP(); petalBurst(h, [Y.x, Y.z], dayClock.t, { r: 0.7, up: 1.2, seed: 6151 }); fx('x3petals', 0.45, 0.2); }); });
      after(T.down, () => { if (!live(run)) return; lay(cast.ym, null, { secs: 0.5 });
        span(cast.ym, 'offer', YM_UP + 0.5, 6.4, 1.6, { fade: 0.2, then: (P) => { play.ymCarry = false; ymSetDown(); take(P, 'sway', 1.4); } }); });
      after(T.rise, () => { if (live(run)) span(cast.pho, 'Sit_to_Stand_Transition_M', 0.3, 2.25, 2.6, { fade: 0.6, hold: 0.05, holdSecs: 6 }); });
      after(T.pull, () => { if (!live(run)) return; play.pull = { k: 0, to: 1, secs: 9, offer: false }; });
      after(T.say, () => { if (!live(run)) return; queueLine('q3u1');
        queueFn(() => { if (!live(run)) return;
          /* he stands, and has lifted his eyes: he is looking straight at him */
          span(cast.pho, 'Sit_to_Stand_Transition_M', 2.25, 3.4, 1.8, { fade: 0.3, hold: 0.16, holdSecs: 7 }); gaze(cast.pho, 'lens', { secs: 1.6, reach: 0.9 });
          play.pull.offer = true; play.busy = false; objectiveFor('festival', { complete: false }); }); });
    }
    /* where his raised hand is at the top of the throw */
    /* FOUR HANDS ON ONE BOWL (photograph 5), in play as in the film: the young man's bai sri rides his take's hands
       (measured before anything is laid on them: the grip is asked for before the hands are moved), his own hands
       hold it under its swell, and Grandmaster Pho's are laid on it from above */
    const ymGrip = () => { if (play.ymCarry) baiOnHands(ymBai, cast.ym, -0.03); const p = ymBai.position, g = cast.ym.group.position; return baiGrip([p.x, p.y, p.z], BAI.s, [g.x, g.z], 'under'); };
    const phoGrip = () => { const p = ymBai.position, g = cast.pho.group.position; return baiGrip([p.x, p.y, p.z], BAI.s, [g.x, g.z], 'on'); };
    /* (lowered, it is set down on the carpet before his knees) */
    function ymSetDown() { const Y = cast.ym.group, p = ymBai.position, ry = Y.rotation.y; play.ymSet = { from: [p.x, p.y, p.z], to: [Y.position.x + Math.sin(ry) * 0.46, 0.012, Y.position.z + Math.cos(ry) * 0.46], k: 0 }; }
    function PHO_HAND_UP() { const P = cast.pho; if (P && P.handR) { P.group.updateWorldMatrix(true, true); P.handR.getWorldPosition(_ph); return [_ph.x, _ph.y + 0.08, _ph.z]; } return [PHO_AT[0], 1.75, PHO_AT[1] - 0.3]; }
    /* the pull, every frame: his hands, his heart, the edges of the day and its sound, all on one number */
    function pullTick(wdt) {
      const Pu = play.pull; if (!Pu || !kit) return;
      if (Pu.k !== Pu.to) { const st = wdt / Pu.secs; Pu.k = Pu.to > Pu.k ? Math.min(Pu.to, Pu.k + st) : Math.max(Pu.to, Pu.k - st); }
      const k = smo(Pu.k);
      if (kit.tremble) kit.tremble(0.55 * k, { secs: 0.2 });
      if (kit.pulse) kit.pulse(k > 0.02 ? { bpm: 72 + 54 * k, erratic: 0.25 * k, vol: 0.5 * k } : null);
      if (kit.chill) kit.chill(0.5 * k, { secs: 0.2, tint: 'grey' });
      if (kit.hush && !Pu.hushOwn) kit.hush(0.55 * k, { secs: 0.2 });
      if (Pu.to === 0 && Pu.k === 0) { play.pull = null; if (kit.tremble) kit.tremble(0, { secs: 0.3 }); if (kit.pulse) kit.pulse(null); if (kit.chill) kit.chill(0, { secs: 0.5 }); if (kit.hush) kit.hush(0, { secs: 0.6 }); }
    }
    /* LOOK AT HIM: one press. The lens narrows a little on the man in white while the day's sound closes down to one
       tone; he does nothing but look. The hands come down, the heart slows, and the music is only music again. */
    function lookAtHim() {
      const Pu = play.pull;
      if (phase !== 'festival' || !Pu || !Pu.offer || play.looked || play.busy) return false;
      const run = play.run; play.looked = true; play.busy = true; objectiveFor('festival');
      Pu.hushOwn = true;
      if (kit.hush) kit.hush(1, { secs: 1.3 }); if (kit.lens) kit.lens(46, { secs: 1.7 });
      fx('x3tone', 0.45);
      lookAt(PHO_HEAD_NOW(), 1.5, () => { if (!live(run)) return;
        Pu.to = 0; Pu.secs = 3.2;
        after(3.4, () => { if (!live(run)) return;
          if (kit.lens) kit.lens(null, { secs: 2.4 }); if (kit.hush) kit.hush(0, { secs: 2.6 });
          gaze(cast.pho, null, { secs: 1.4 });
          span(cast.pho, 'Sit_to_Stand_Transition_M', 3.4, 0.3, 3.4, { fade: 0.3, then: (P) => rest(P, 0.8) });
          whenReady(cast.ym, (P) => { P.rest.take = 'seiza'; rest(P, 2.0); });
          setPhase('seen');
          after(1.2, () => { if (live(run)) seenLines(run); }); }); });
      return true;
    }
    function seenLines(run) {
      play.busy = true;
      queueLine('q3u2'); queueGap(0.4); line('tn3m1', cast.ton); queueGap(0.3); queueLine('q3u3'); queueGap(0.3); line('tn3m2', cast.ton);
      queueFn(() => { if (live(run)) checkBegin(false); });
    }

    /* ================================================================ P5 · THE CHECK */
    function checkBegin(resumed) {
      play.busy = false; play.pull = null;
      if (kit) { kit.root(false); if (resumed) { kit.pose('standing', { secs: 0.05 }); if (kit.getFade && kit.getFade() > 0.01) kit.fade(0, 0.9); } }
      setPhase('check', { complete: false });
      if (play.asked.size >= 2 && !play.checked) { const run = play.run; after(0.8, () => { if (live(run)) checkClose(run); }); }
    }
    function ask(who) {
      if (phase !== 'check' || play.busy || play.asked.has(who) || play.checked) return false;
      const run = play.run; play.busy = true; play.asked.add(who); saveMark(); objectiveFor('check');
      const P = who === 'ton' ? cast.ton : cast.aunt;
      /* (turned to him over half a second: v14.5, never a snap. It was set outright, and the one asked swung round on
         the frame of the press: the v26.2 debug's code lens) */
      whenReady(P, (Q) => turnPerson(Q, faceTo(Q.group.position.x, Q.group.position.z, yaw.position.x, yaw.position.z), 0.55));
      if (who === 'ton') { queueLine('q3c1'); queueGap(0.3); line('tn3c1', cast.ton); }
      else { queueLine('q3c2'); queueGap(0.3); line('ds3c1', cast.aunt); }
      queueFn(() => { if (!live(run)) return; play.busy = false;
        if (play.asked.size >= 2) checkClose(run); else objectiveFor('check', { complete: false }); });
      return true;
    }
    function checkClose(run) {
      play.busy = true; objectiveFor('check');
      queueGap(0.4); line('tn3c2', cast.ton); queueGap(0.4); queueLine('q3c3');
      queueFn(() => { if (!live(run)) return; play.checked = true; bank(W.noteAsked, 3); saveMark(); play.busy = false; betweenBegin(); });
    }

    /* ================================================================ THE NIGHT BETWEEN (a film), THEN DAY TWO */
    function betweenBegin() {
      const run = play.run;
      const ok = kit && kit.film && kit.film('between', { onDone: () => { if (live(run)) dawnBegin(false); } });
      if (!ok) dawnBegin(false);
    }
    function dawnStage() {
      look('DAWN', 0); auraAt(0, 0); mistK = 1; burstsClear(); zoneAt(null);
      whenReady(cast.ym, (P) => { P.group.visible = false; }); ymBai.visible = false;
      whenReady(cast.pho, (P) => { rest(P, 0); gaze(P, null); });
      whenReady(cast.ton, (P) => { put(P, TON_DAWN.x, TON_DAWN.z, faceTo(TON_DAWN.x, TON_DAWN.z, DAWN_AT.x, DAWN_AT.z)); P.seated = false; P.rest.take = 'Idle_3'; P.rest.win = null; rest(P, 0); castSolid(); });
      whenReady(cast.aunt, (P) => { put(P, P.home.x, P.home.z, P.home.ry); rest(P, 0); castSolid(); });
      dayCast(false);
    }
    function dawnBegin(resumed) {
      dawnStage();
      yaw.position.set(DAWN_AT.x, EYE, DAWN_AT.z); yaw.rotation.y = phoYawFrom(DAWN_AT); pitch.rotation.x = -0.04;
      if (kit) { kit.pose('standing', { secs: 0.05 }); kit.root(false); if (kit.getFade && kit.getFade() > 0.01) kit.fade(0, 1.4); }
      play.knelt = false; play.bowed = false; play.busy = false; handsAway(false);
      myBai.visible = false; baiHands(true, { p: 0, secs: 0.01 });
      zoneAt(KNEEL2);
      setPhase('dawn', { complete: false });
      if (warmSounds) warmSounds(WARM_DAY2);
    }
    /* P6 · he kneels on the carpet before him, and sets the bai sri down beside him */
    /* (0.45 m before the low table's front edge: at 1.5 m before the bench its bowl stood under the table's edge and its
       candle came up through the table's top: photographed from above in the close) */
    /* (and ON the carpet, whose edge is 0.95 m to the sitters' right of the bench's middle: at 0.98 it stood on the turf) */
    const BESIDE = (() => { const [x, z] = benchAt(0.8, 1.9); return { x, z }; })();                   // beside his left knee and a little before it
    function kneelPho(instant) {
      if (play.knelt && !instant) return false;
      play.knelt = true; zoneAt(null);
      if (kit) kit.root(true);
      const ry = phoYawFrom(KNEEL2), setDown = () => { baiHands(false); baiPut(myBai, BESIDE.x, 0.012, BESIDE.z, 0.6); handsAway(true); };
      if (instant) {
        setDown();
        yaw.position.x = KNEEL2.x; yaw.position.z = KNEEL2.z; yaw.rotation.y = ry; pitch.rotation.x = 0.16;
        if (kit) kit.pose('lying', { y: KNEEL.y, yaw: ry, span: KNEEL.span, pitchLo: KNEEL.lo, pitchHi: KNEEL.hi, secs: 0.05 });
        return true;
      }
      const run = play.run; play.busy = true;
      fx('x3kneel', 0.32); setPhase('knelt'); baiRaise(-1, 0.9);
      turnTo(ry, 1.1, Object.assign({ pos: KNEEL2, pitch: 0.16 }, KNEEL), () => { if (!live(run)) return; fx('x3baiset', 0.36); setDown();
        after(0.5, () => { if (!live(run)) return; play.busy = false; objectiveFor('knelt', { complete: false }); }); });
      return true;
    }
    /* one bow, the bow owed a teacher; then he is told to sit */
    function bowPho() {
      if (phase !== 'knelt' || !play.knelt || play.bowed || play.busy) return false;
      const run = play.run, ry = phoYawFrom(KNEEL2); play.busy = true; objectiveFor('knelt');
      handsAway(false);
      if (kit) { kit.pray(true, { secs: 0.8, y: -0.3 }); kit.pose('lying', { y: KNEEL.y, yaw: ry, span: 0.02, pitchLo: -1.4, pitchHi: KNEEL.hi, secs: 0.3 }); }
      after(0.9, () => { if (!live(run)) return;
        play.bow = { t: 0, prev: 0, n: 1, secs: 4.6, depth: 1.05, run, sound: 'x3kneel', done: () => { if (!live(run)) return;
          play.bowed = true; saveMark();
          if (kit) { kit.pray(false, { secs: 1.1 }); kit.pose('lying', { y: KNEEL.y, yaw: ry, span: KNEEL.span, pitchLo: KNEEL.lo, pitchHi: KNEEL.hi, secs: 0.3 }); }
          after(1.25, () => { if (live(run)) handsAway(true); });
          after(0.7, () => { if (!live(run)) return; line('ph3g1', cast.pho);
            queueFn(() => { if (!live(run)) return; play.busy = false; objectiveFor('knelt', { complete: false }); }); }); } }; });
      return true;
    }
    /* P7, P8 · the telling and the answers: two films, one after the other */
    function tellAll() {
      if (phase !== 'knelt' || !play.bowed || play.busy || !kit || !kit.film) return false;
      const run = play.run; play.busy = true; objectiveFor('knelt');
      const next = () => { if (!live(run)) return; const ok2 = kit.film('answers', { onDone: () => { if (live(run)) toldBegin(false); } }); if (!ok2) toldBegin(false); };
      const ok = kit.film('tell', { onDone: next });
      if (!ok) next();
      return true;
    }
    function toldBegin(resumed) {
      const run = play.run;
      play.busy = true; setPhase('told', { complete: false }); handsAway(true);
      if (kit && kit.getFade && kit.getFade() > 0.01) kit.fade(0, 1.0);
      after(resumed ? 1.0 : 0.6, () => { if (!live(run)) return; line('ph3b0', cast.pho); queueFn(() => { if (live(run)) breathBegin(); }); });
    }

    /* ================================================================ P9 · OPEN AND CLOSE (the forty-sixth seam)
       Hold to open, let go to close. While he holds, THE WORLD COMES IN: the light widens, the morning's mist thins, the
       gold on Grandmaster Pho rises, and (M7) every sound of the ground comes near. Each breath has a band that is
       enough, seconds wide, and an edge beyond it; nothing here tests a finger's speed. Three breaths: he is told when;
       he chooses when; it pulls, and he closes anyway. */
    /* OPEN AND CLOSE BY A GATE (v26.3, Chad, 13 Nov 2026: "the mini game is hard to play, can you change the mechanism to
       something else, or something that is more fun and engaging?", and his pick of four: "Drag a glowing gate open with
       one finger: soft lights of presences drift in toward you. Drag it shut when you feel it is enough, before they crowd
       you." The engine's gate, the forty-ninth seam). The same three breaths, their bands now seconds WIDE OPEN: a drag up
       opens it, the lights come in as fast as it stands open, and a drag down shuts it; the third pulls (heavier to shut,
       and it creeps open while he lets go). Grandmaster Pho's lines are the breath's, unchanged */
    /* FILL TO THE GOLD MARK (v26.8, Chad, 13 Nov 2026: "the minigame, looks very buggy, and i still dont understand how to
       play it, nor is it fun. You need to improve it visually, and think of how to make it even more engaging and fun";
       of three ways put to him, his: "Fill to the gold mark: Hold to open the lotus, and let go when its light reaches a
       big gold mark. Three times; on the third the chanting pulls it faster"). The engine's breath (the forty-sixth
       seam) in its lotus look: hold anywhere and the lotus opens, its light climbing a ring; the big gold mark on the
       ring is the band; let go inside it. LET GO is said in the gold every time (`told`), so the rule is always on
       screen. The third breath fills faster the fuller it is (`accel`): the chanting pulling it. Each band is about
       two seconds of holding wide; nothing tests a finger's speed */
    const BREATHS = [{ enough: 2.6, edge: 4.8, told: true, lead: 1.4 }, { enough: 2.4, edge: 4.6, told: true }, { enough: 2.2, edge: 4.6, told: true, accel: 1.3 }];
    const open = { k: 0, shown: -1, over: 0, i: -1, st: '' };
    function breathBegin() {
      if (!kit || !kit.event) { taughtBegin(false, { closed: 0, held: 0 }); return; }
      const run = play.run;
      play.busy = true; setPhase('breath', { complete: false });
      const said = { open: false };
      kit.event({
        kind: 'breath', look: 'lotus', demo: 'lotus', low: true, title: W.breathTitle, prompt: W.breathTitle, label: W.breathTitle,
        brief: TOUCHY ? W.breathBrief : W.breathBriefKey, whereWord: TOUCHY ? W.breathWhere : W.breathWhereKey,
        openWord: W.breathOpen, closeWord: W.breathClose, restWord: '', breaths: BREATHS, gain: 2, cost: 2, idle: 22, fall: 1.4, at: { sx: 0.5, sy: 0.7 },
        /* (the world opens with the lotus: the light, the mist, the gold on his teacher, and every sound of the ground) */
        onLevel: (k, held, i, st) => { open.k = k; open.i = i; open.st = st;
          if (st === 'wait' && i === 0 && !said.open) { said.open = true; fxLine('ph3b1'); }
          if (i === 2 && (st === 'open' || st === 'pull')) play.pull3 = k; else play.pull3 = 0; },
        onEnough: (i) => { if (i === 0) fxLine('ph3b2'); },
        onBreath: (rep) => { if (!live(run)) return 0;
          if (rep.result === 'held') { open.over = 1; fxLine('ph3bx'); if (kit.flash) kit.flash({ color: '#fff6e0', secs: 0.9, k: 0.55 });
            /* (he closes it for him, and THEN says what the next breath asks: held to its edge, the second breath went
               straight to the third with "It will pull. Close anyway." never said. The finger's play-through found it,
               on a box slow enough to hold two breaths past their edge) */
            const nx = rep.i === 0 ? 'ph3b3' : rep.i === 1 ? 'ph3b4' : null;
            if (!nx) return 1.6;
            const gap = (SECS.ph3bx || 0.8) + 0.9;
            after(gap, () => { if (live(run) && phase === 'breath') fxLine(nx); });
            return gap + (SECS[nx] || 3.5) + 0.4; }
          if (rep.result === 'unopened' && rep.again) { fxLine('ph3by'); return (SECS.ph3by || 5) + 0.5; }
          const next = rep.i + 1;
          if (next === 1) { fxLine('ph3b3'); return (SECS.ph3b3 || 3.5) + 0.4; }
          if (next === 2) { fxLine('ph3b4'); return (SECS.ph3b4 || 4.2) + 0.4; }
          return 0.6; },
        onIdle: (i) => { if (i === 0) fxLine('ph3b1'); }
      }).then((r) => { if (!live(run) || phase !== 'breath') return; open.k = 0; play.pull3 = 0;
        if (r && r.aborted) return;                                              // (a film or a reset took it: whoever did owns what is next)
        taughtBegin(false, { closed: r && r.closed != null ? r.closed : 0, held: r && r.held != null ? r.held : 0 }); });
    }
    /* a line said INSIDE the event: its clock is the event's, and the queue is held while a panel is up; it is one voice
       at a time because the event waits each line's length before the next breath is live (onBreath's answer) */
    function fxLine(name) { heard.add(name); whenReady(cast.pho, (P) => talk(P, SECS[name] || 1.2)); if (worldSfx && !(soundOff && soundOff())) worldSfx(name, 1, 1, 0); }
    /* the world laid on the level, every frame: the light, the mist, the gold; past the band, the white and the lag */
    const _lerpHex = (a, b, k) => _c1.setHex(a).lerp(_c2.setHex(b), k).getHex(), _c1 = new THREE.Color(), _c2 = new THREE.Color();
    function dayBlend(A, Bp, k) {
      const n = (x, y) => x + (y - x) * k, arr = (x, y, col) => x.map((v, i) => (col[i] ? _lerpHex(v, y[i], k) : n(v, y[i])));
      return { stops: A.stops.map((s, i) => [n(s[0], Bp.stops[i][0]), '#' + _c1.set(s[1]).lerp(_c2.set(Bp.stops[i][1]), k).getHexString()]),
               bg: _lerpHex(A.bg, Bp.bg, k), fog: arr(A.fog, Bp.fog, [1, 0]), hemi: arr(A.hemi, Bp.hemi, [1, 1, 0]), key: arr(A.key, Bp.key, [1, 0, 0, 0, 0]),
               fill: arr(A.fill, Bp.fill, [1, 0]), stars: 0, moon: 0, sun: n(A.sun, Bp.sun), clouds: n(A.clouds, Bp.clouds),
               vmHemi: arr(A.vmHemi, Bp.vmHemi, [1, 1, 0]), vmKey: arr(A.vmKey, Bp.vmKey, [1, 0]) };
    }
    function openTick(wdt, t) {
      if (phase !== 'breath' && open.shown <= 0 && open.over <= 0) return;
      const live2 = phase === 'breath', k = live2 ? open.k : 0, e = smo(c01(k / 0.9));
      if (Math.abs(e - open.shown) > 0.004 || (!live2 && open.shown !== 0)) { open.shown = live2 ? e : 0;
        if (kit) kit.daylight(open.shown > 0 ? dayBlend(DAWN, OPENED, open.shown) : PRESETS.DAWN, 0);
        phoLook.level.value = PHO_LEVEL.DAWN + (PHO_LEVEL.OPENED - PHO_LEVEL.DAWN) * open.shown; mistK = 1 - 0.7 * open.shown; }
      auraAt(open.shown * 0.95, t);
      /* the third breath pulls: his hands begin to drift as they did in the line */
      if (kit && kit.tremble) kit.tremble(live2 ? 0.4 * smo(c01((play.pull3 || 0) * 1.4 - 0.5)) : 0, { secs: 0.2 });
      /* held to the edge: the picture lags and shakes a moment, and settles */
      if (open.over > 0) { open.over = Math.max(0, open.over - wdt / 1.8); if (kit && kit.smear) kit.smear(0.6 * open.over, { secs: 0.1 }); }
    }
    function taughtBegin(resumed, res) {
      const run = play.run;
      play.breath = res || play.breath || { closed: 0, held: 0 };
      play.busy = true; setPhase('taught', { complete: false });
      const c = play.breath.closed;
      bank(c >= 3 ? W.noteBreath3 : c === 2 ? W.noteBreath2 : c === 1 ? W.noteBreath1 : W.noteBreath0, 0);
      after(resumed ? 1.0 : 0.9, () => { if (!live(run)) return;
        line('ph3b5', cast.pho); queueGap(0.6); line('ph3p1', cast.pho);           // (v26.8: the road in one line, Chad's "greatly shortened")
        queueFn(() => { if (live(run)) decideBegin(false); }); });
    }
    function decideBegin(resumed) {
      play.busy = false;
      setPhase('decide', { complete: false });
      /* the four endings share one close, and its cues are fired by a helper (endingScene): the engine warms a scene's
         cues by reading that scene's OWN source, so these would play nothing the first time. Warmed here by name, a
         whole ending before they are wanted (chaptertest reads this list, and fails a cue of the close it lacks) */
      if (warmSounds) warmSounds(['x3closemus', 'x3baitake', 'ph3z0', 'ph3z1', 'x3tone', 'x3petals', 'q3z1', 'x3lastmus', 'x3baiset', 'ph3z2', 'q3K1']);
      if (resumed) after(0.6, openDecision); else openDecision();
    }

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

    /* ---------------------------------------------------------------- the hotspots (each pressed, never looked at: v21.9) */
    const _hv = new THREE.Vector3();
    const markHit = (posF, frac = 0.1) => (x, y) => { const p = posF(); camera.updateMatrixWorld(); _hv.set(p.x, p.y, p.z).project(camera);
      return _hv.z < 1 && Math.hypot(x - _hv.x, (y - _hv.y) / Math.max(0.3, camera.aspect)) < frac; };
    const hsTon = { id: 'ton', pos: { x: 0, y: 1.5, z: 0 }, radius: 2.9, prompt: W.hotTon, hits: markHit(TON_HEAD, 0.14),
      enabled: () => phase === 'arrive' && !play.busy, onInteract() { return tonTalk(); } };
    const hsAskTon = { id: 'askTon', pos: { x: 0, y: 1.5, z: 0 }, radius: 2.9, prompt: W.hotAskTon, hits: markHit(TON_HEAD, 0.14),
      enabled: () => phase === 'check' && !play.busy && !play.checked && !play.asked.has('ton'), onInteract() { return ask('ton'); } };
    const hsAskAunt = { id: 'askAunt', pos: { x: 0, y: 1.42, z: 0 }, radius: 2.9, prompt: W.hotAskAunt, hits: markHit(AUNT_HEAD, 0.14),
      enabled: () => phase === 'check' && !play.busy && !play.checked && !play.asked.has('aunt'), onInteract() { return ask('aunt'); } };
    const hsLook = { id: 'look', pos: { x: PHO_HEAD.x, y: PHO_HEAD.y, z: PHO_HEAD.z }, radius: 9, prompt: W.hotLook, anyView: true, hits: markHit(PHO_HEAD_NOW, 0.16),
      enabled: () => phase === 'festival' && !!play.pull && play.pull.offer && !play.looked && !play.busy, onInteract() { return lookAtHim(); } };
    const hotspots = [
      hsTon,
      { id: 'tables', pos: { x: TABLES_AT.x, y: 1.25, z: TABLES_AT.z - 1.0 }, radius: 2.6, prompt: W.hotTables, hits: markHit(() => BUDDHA, 0.2),
        enabled: () => phase === 'baisri' && play.bai && !play.busy, onInteract() { return payRespects(); } },
      { id: 'place', pos: { x: PLACE.x, y: 0.9, z: PLACE.z }, radius: 2.3, prompt: W.hotPlace, mark: false,
        enabled: () => phase === 'tables' && !play.knelt && !play.busy, onInteract() { return kneelPlace(false); } },
      /* (pressed from where he kneels, named by the badge, no mark: chapter 2's rule for a press made kneeling) */
      { id: 'homage', pos: { x: PLACE.x, y: 0.9, z: PLACE.z }, radius: 4, anyView: true, prompt: W.hotHomage, mark: false,
        enabled: () => phase === 'place' && play.knelt && !play.homage && !play.busy && !play.turning, onInteract() { return homage(); } },
      hsLook, hsAskTon, hsAskAunt,
      { id: 'kneel2', pos: { x: KNEEL2.x, y: 0.9, z: KNEEL2.z }, radius: 2.3, prompt: W.hotKneel, mark: false,
        enabled: () => phase === 'dawn' && !play.knelt && !play.busy, onInteract() { return kneelPho(false); } },
      { id: 'bow2', pos: { x: PHO_HEAD.x, y: 1.0, z: PHO_HEAD.z }, radius: 4, anyView: true, prompt: W.hotBow, mark: false,
        enabled: () => phase === 'knelt' && play.knelt && !play.bowed && !play.busy && !play.turning, onInteract() { return bowPho(); } },
      { id: 'tell', pos: { x: PHO_HEAD.x, y: 1.0, z: PHO_HEAD.z }, radius: 4, anyView: true, prompt: W.hotTell, mark: false,
        enabled: () => phase === 'knelt' && play.bowed && !play.busy, onInteract() { return tellAll(); } }
    ];
    /* a mark rides the person it is on */
    function hotTick() {
      const t = TON_HEAD(); hsTon.pos.x = hsAskTon.pos.x = t.x; hsTon.pos.y = hsAskTon.pos.y = t.y; hsTon.pos.z = hsAskTon.pos.z = t.z;
      const a = AUNT_HEAD(); hsAskAunt.pos.x = a.x; hsAskAunt.pos.z = a.z;
      const h = PHO_HEAD_NOW(); hsLook.pos.x = h.x; hsLook.pos.y = h.y; hsLook.pos.z = h.z;
    }

    /* ---------------------------------------------------------------- the frame */
    let windClock = 0;
    function updateNotes(dt, t) {
      const st = getState();
      const now = wallNow(), raw = lastWall0 ? Math.max(0, now - lastWall0) : 0, wdt = Math.min(0.25, raw); lastWall0 = now;
      /* (the people's own clocks run in a film too, v5.19: a film holds only those it has posed) */
      windClock += wdt; windTick(windClock); peopleTick(wdt, st !== 'cine'); mistTick(windClock); hazeTick(windClock); skyTick(windClock); flamesTick(windClock); bulbsTick(windClock);
      /* (after the people: what is laid on a body's arm is laid on the pose its take has just written) */
      taperTick(windClock); kidsTick(wdt, st); dancersTick(wdt, st); dancersTurn(wdt);
      if (st !== 'cine') { peopleLevels(); lodTick(); zoneTick(now); }
      /* a Continue is placed before the card (the v4.8 contract): the saved moment's picture stands under it */
      if (!booted && !preplaced && kit) { const w0 = preStage(kit.getPhase()); if (w0) preplaced = w0; }
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
      playTick(now, wdt);
    }
    function playTick(now, wdt) {
      hotTick();
      turnTick(wdt); bowTick(wdt); baiTick(wdt); awayTick(); pullTick(wdt); openTick(wdt, windClock);
      ambTick(); extrasSound();
      burstsTick(dayClock.t);
      /* what a person carries rides his hands */
      if (play.tonGive) { const G = play.tonGive; G.k = Math.min(1, G.k + wdt / 0.45);                   // lifted off the table into his hands, then carried by them
        if (handsMid(cast.ton, _hv)) { const k = smo(G.k); myBai.position.set(lp(TON_BAI.x, _hv.x, k), lp(TON_BAI.y, _hv.y - 0.02, k), lp(TON_BAI.z, _hv.z, k)); } }
      turnsTick(wdt);
      if (play.ymCarry && !(cast.ym.lay || cast.ym.layK > 0)) baiOnHands(ymBai, cast.ym, -0.03);     // (while his hands are laid on it, the grip itself carries it: ymGrip)
      if (play.ymSet) { const G = play.ymSet; G.k = Math.min(1, G.k + wdt / 0.5); const k = smo(G.k); ymBai.position.set(lp(G.from[0], G.to[0], k), lp(G.from[1], G.to[1], k * k), lp(G.from[2], G.to[2], k)); if (G.k >= 1) play.ymSet = null; }
      /* he walks onto the place: he kneels (the press is offered too) */
      if (phase === 'tables' && !play.knelt && !play.busy && Math.hypot(yaw.position.x - PLACE.x, yaw.position.z - PLACE.z) < 0.45) kneelPlace(false);
      if (phase === 'dawn' && !play.knelt && !play.busy && Math.hypot(yaw.position.x - KNEEL2.x, yaw.position.z - KNEEL2.z) < 0.45) kneelPho(false);
      if (phase === 'tables' && !zone.g.visible && !play.knelt) zoneAt(PLACE);
    }
    /* TWO SOUNDS THAT BELONG TO SOMEONE (12 Nov). The wick catching, each time the taper's tip comes to a candle: heard
       by one who stands near her, quieter the further he is. And the child's laugh the ground already had, the
       children's own when they break into a run, at their place. Each waits its turn with the ground's other
       one-shots (one at a time, never over a line, never in the bow or the pull) */
    function extrasSound() {
      if (!worldSfx || (soundOff && soundOff())) return;
      const free = dayClock.t >= ambBusy && dayClock.t >= speak.until && !play.bow && !play.pull;
      if (taper.on && taper.P.ready) { const u = ((windClock % TAPER.T) + TAPER.T) % TAPER.T, at = u < 3 ? 0 : (u >= 4.5 && u < 7.5 ? 1 : -1);
        if (at >= 0 && at !== wickAt && free) { const wx = TAPER.at[0] - 0.2, wz = TAPER.at[1] - 0.84, d = Math.hypot(yaw.position.x - wx, yaw.position.z - wz);
          if (d < 6 && worldSfx('x3wick', 0.3 * c01(1.25 - d / 6), 1, panAt(wx, wz))) { ambBusy = dayClock.t + 1.4; extrasHeard.wick++; } }
        wickAt = at; }
      const ph = kidsDir.ph;
      if (ph !== kidsPh) { kidsPh = ph;
        if ((ph === 'runE' || ph === 'runW') && free && dayOne.visible && kids[0].P.ready) { const g = kids[0].P.group.position;
          if (worldSfx('x3os1', 0.34, 1, panAt(g.x, g.z))) { ambLast = 'x3os1'; ambBusy = dayClock.t + 3.8; extrasHeard.laugh++; } } }
    }
    function updatePile() {}
    function updateFire() {}
    function updateSlow() {}

    /* ------------------------------------------------------------ a resume (§9)
       A CONTINUE IS PLACED BEFORE THE CARD (the v4.8 contract): under the chapter card the saved moment's picture is set,
       so nothing jumps when play begins; applyPhase does it all again on the first live frame, idempotently. The world's
       state (day one, day two, the formation) is derived from the phase and never stored beside it (§9). */
    function preStage(p0) {
      const R = readMark(p0);
      if (R.p === 'arrive') return '';
      if (DAY_TWO.has(R.p)) { dawnStage();
        const knelt = R.p !== 'dawn';
        if (knelt) { yaw.position.x = KNEEL2.x; yaw.position.z = KNEEL2.z; yaw.rotation.y = phoYawFrom(KNEEL2); pitch.rotation.x = 0.16; baiPut(myBai, BESIDE.x, 0.012, BESIDE.z, 0.6);
          if (kit) kit.pose('lying', { y: KNEEL.y, yaw: phoYawFrom(KNEEL2), span: KNEEL.span, pitchLo: KNEEL.lo, pitchHi: KNEEL.hi, secs: 0.05 }); }
        else { yaw.position.set(DAWN_AT.x, EYE, DAWN_AT.z); yaw.rotation.y = phoYawFrom(DAWN_AT); pitch.rotation.x = -0.04; myBai.visible = false; }
        return R.p; }
      dayOneStage();
      if (R.p === 'festival' || R.p === 'seen' || R.p === 'check') { lineStage(); yaw.position.set(LINE_AT.x, EYE, LINE_AT.z); yaw.rotation.y = phoYawFrom(LINE_AT); pitch.rotation.x = -0.08; return R.p; }
      setFormation('arrive');
      if (R.p === 'baisri') { tonHome(); myBai.visible = false; return R.p; }
      tonToPlace();
      if (R.p === 'tables') { myBai.visible = false; yaw.position.set(TABLES_AT.x, EYE, TABLES_AT.z); yaw.rotation.y = Math.PI; pitch.rotation.x = 0; return R.p; }
      if (R.p === 'place') { kneelPlace(true); play.knelt = false; return R.p; }
      return '';
    }
    function applyPhase(p0) {
      const R = readMark(p0);
      play.homage = R.homage; play.asked = new Set([R.ton && 'ton', R.aunt && 'aunt'].filter(Boolean)); play.checked = R.checked; play.bowed = R.bowed;
      play.breath = R.closed != null ? { closed: R.closed, held: R.held || 0 } : null;
      play.knelt = false; play.looked = false; play.pull = null; play.busy = false;
      if (R.p === 'arrive') { arriveBegin(); return; }
      if (DAY_TWO.has(R.p)) {
        dawnBegin(true);
        if (R.p === 'dawn') return;
        play.bowed = R.bowed;                                                    // (dawnBegin begins a fresh morning and forgets the bow: its receipt is given back. The resume sweep found it: a Continue after his bow offered the bow again)
        kneelPho(true); setPhase('knelt', { complete: false });
        if (R.p === 'knelt') { if (!play.bowed) return; play.busy = true; const run = play.run;
          after(0.8, () => { if (!live(run)) return; line('ph3g1', cast.pho); queueFn(() => { if (live(run)) { play.busy = false; objectiveFor('knelt', { complete: false }); } }); }); return; }
        play.bowed = true;
        if (R.p === 'told' || R.p === 'breath') { toldBegin(true); return; }
        if (R.p === 'taught') { taughtBegin(true, play.breath); return; }
        play.breath = play.breath || { closed: 0, held: 0 };
        decideBegin(true); return;
      }
      /* day one */
      dayOneStage();
      if (warmSounds) warmSounds(WARM_DAY1);
      if (R.p === 'festival') { lineBegin(true); return; }
      if (R.p === 'seen') { lineStage(); baiHands(true, { p: 0, secs: 0.01 }); if (kit) kit.root(true); play.looked = true; setPhase('seen', { complete: false }); const run = play.run; after(0.8, () => { if (live(run)) seenLines(run); }); return; }
      if (R.p === 'check') { lineStage(); baiHands(true, { p: 0, secs: 0.01 }); play.looked = true;
        if (play.checked) { betweenBegin(); return; }
        checkBegin(true); return; }
      setFormation('arrive');                                                         // (and the dancers begin their loop again: c_crowd.js dancersForm, which setFormation calls)
      if (R.p === 'baisri') { tonHome(); myBai.visible = false; baiHands(true, { p: 0, secs: 0.01 }); setPhase('baisri', { complete: false }); return; }
      tonToPlace();
      if (R.p === 'tables') { myBai.visible = false; baiHands(true, { p: 0, secs: 0.01 }); zoneAt(PLACE); setPhase('tables', { complete: false }); return; }
      /* place */
      kneelPlace(true); setPhase('place', { complete: false });
      if (play.homage) { const run = play.run; play.busy = true; after(0.7, () => { if (live(run)) festivalBegin(); }); }
    }

    /* ================================================================ THE FILMS' PICTURES (M6: each film's shots are
       written here; the cues are below the build) */
    /* Every film is HIS EYES (the grown Master Zavier is never seen: CLAUDE.md, v24.56): the lens stands where he
       kneels or stands, narrows and pans, and never moves through the people (the plan's §7). Every picture is a pure
       function of the film's clock (v6.4): people are POSED at the moment the clock asks for (pose), a look is laid on
       at once (lookNow), a throw of petals is where its age puts it (burstAt), so a seek, a skip and a slow phone land
       on the same picture. Whatever a film changes in the world is put back by the play that follows it (lineBegin,
       dawnBegin, toldBegin stage everything again), so a film skipped leaves what a film played leaves (v24.12). */
    const FL = { key: '', api: null, once: new Set(), must: null, lit: '', bursts: {}, vf: null, throwAt: null, throwPho: null, shot: '', sky: null, bai: false, wai: false, waiPos: null, waiQ: null, faces: {}, openK: 0, openOut: 0, litE: -1, litA: -1, goldMin: 0, tabled: false, rest0: null };
    const PLAY_FOV = camera.fov;                                              // the lens play is seen through (a film that ends in the clear ends on it)
    const _ffv = new THREE.Vector3();
    function fLook(name, secs = 0) { if (FL.lit !== name) { FL.lit = name; look(name, secs); } }
    function onceAt(id, t, at, fn, span = 1.5) { if (t >= at && t < at + span && !FL.once.has(id)) { FL.once.add(id); fn(); } }
    function fLens(f) { if (Math.abs(camera.fov - f) > 1e-3) { camera.fov = f; camera.updateProjectionMatrix(); } }
    function camAt(p, q, roll = 0) {
      yaw.position.set(p[0], p[1], p[2]);
      const dx = q[0] - p[0], dy = q[1] - p[1], dz = q[2] - p[2];
      yaw.rotation.y = Math.atan2(-dx, -dz); pitch.rotation.x = Math.atan2(dy, Math.hypot(dx, dz));
      camera.rotation.z = roll;
      stockLod();                                  // (v24.22) the stock's levels for THIS frame's lens, never the last one's (v25.0: one world)
    }
    /* where his FACE is, for a lens to frame: the head bone is the skull's base, 9 cm under the eyes, and a shot aimed
       at it put the eyes at the top of a phone's frame and cut them in the cab (CP9, by photograph) */
    function faceOf(P, fb) { const h = headOf(P, null); return h ? [h[0], h[1] + 0.08, h[2]] : fb; }
    /* where a person's head is (his look's target), or a fallback point */
    function headOf(P, fb) { if (P && P.ready && P.head && P.group.visible) { P.head.getWorldPosition(_ffv); return [_ffv.x, _ffv.y, _ffv.z]; } return fb; }
    function shot(eye, at, fPhone, fDesk, roll = 0) { fLens(isNarrow() ? fPhone : fDesk); camAt(eye, at, roll); }
    const FIT = { x: 0.84, y: 0.8, max: 74 };
    const _fitV = new THREE.Vector3();
    function fitProject(eye, psi, th, fov, P) {
      const cp = Math.cos(th), sp = Math.sin(th), cy = Math.cos(psi), sy = Math.sin(psi);
      _fitV.set(P[0] - eye[0], P[1] - eye[1], P[2] - eye[2]);
      const zc = -_fitV.x * cp * sy + _fitV.y * sp - _fitV.z * cp * cy;                  // along the look
      const xc = _fitV.x * cy - _fitV.z * sy;                                            // to the right
      const yc = _fitV.x * sp * sy + _fitV.y * cp + _fitV.z * sp * cy;                     // up
      const tv = Math.tan(fov * Math.PI / 360);
      return zc > 1e-3 ? [xc / (zc * tv * camera.aspect), yc / (zc * tv), xc, yc, zc] : [9, 9, xc, yc, zc];
    }
    function fit(eye, at, fl, must) {
      const dx = at[0] - eye[0], dy = at[1] - eye[1], dz = at[2] - eye[2];
      let psi = Math.atan2(-dx, -dz), th = Math.atan2(dy, Math.hypot(dx, dz)), fov = fl;
      const pts = (must || []).filter(Boolean);
      if (isNarrow() && pts.length) {
        const all = pts.concat([at]), psi0 = psi, th0 = th;
        /* (v25.5, Chad: "at the final last part when camera zooms into the call pong note, the camera bounces several
           times") THE LENS IS SOLVED, NOT STEPPED. v25.2 widened it two degrees at a time until the points fitted, one
           turn of the aim to each step: as a shot pushed in, the lens it was asked for narrowed smoothly and the lens it
           was given jumped back out by a step each time the points stopped fitting (measured on the note's push at a
           phone's size: twelve jumps of about 1.5 degrees in three seconds). Now, for one lens, the aim is turned until
           it settles (`aimFor`), and the lens is the narrowest that then holds every point, found by halving between
           the lens asked for and FIT.max: a smooth function of the eye, the aim and the lens asked for, so a push is
           one move. Where the asked lens already holds them, it is the asked lens exactly */
        const aimFor = (fv) => {
          let p = psi0, h = th0;
          const tv = Math.tan(fv * Math.PI / 360), AX = Math.atan(FIT.x * tv * camera.aspect), AY = Math.atan(FIT.y * tv);
          for (let it = 0; it < 40; it++) {
            /* each point's bearing and height from the look, in angles; the turn that centres their spread where it overflows */
            let a0 = Infinity, a1 = -Infinity, b0 = Infinity, b1 = -Infinity;
            for (const P of all) { const q = fitProject(eye, p, h, fv, P), ax = Math.atan2(q[2], q[4]), ay = Math.atan2(q[3], Math.hypot(q[2], q[4]));
              a0 = Math.min(a0, ax); a1 = Math.max(a1, ax); b0 = Math.min(b0, ay); b1 = Math.max(b1, ay); }
            const sx = a1 - a0 <= 2 * AX ? Math.min(Math.max(0, a1 - AX), a0 + AX) : (a0 + a1) / 2;
            const sy = b1 - b0 <= 2 * AY ? Math.min(Math.max(0, b1 - AY), b0 + AY) : (b0 + b1) / 2;
            p -= sx; h += sy;
            if (Math.abs(sx) + Math.abs(sy) < 1e-6) break;
          }
          let over = 0;                                                  // how far the worst point stands outside the safe part
          for (const P of all) { const q = fitProject(eye, p, h, fv, P); over = Math.max(over, Math.abs(q[0]) - FIT.x, Math.abs(q[1]) - FIT.y); }
          return { p, h, out: over > 1e-3 };
        };
        let A = aimFor(fov);
        if (A.out && fov < FIT.max) {
          const top = aimFor(FIT.max);
          if (top.out) { A = top; fov = FIT.max; }
          else { let lo = fov, hi = FIT.max; A = top;
            for (let it = 0; it < 22; it++) { const mid = (lo + hi) / 2, M = aimFor(mid); if (M.out) lo = mid; else { hi = mid; A = M; } }
            fov = hi; }
        }
        psi = A.p; th = A.h;
      }
      FL.must = pts.map(P => { const q = fitProject(eye, psi, th, fov, P); return [+q[0].toFixed(3), +q[1].toFixed(3)]; });
      const cp = Math.cos(th);
      return { at: [eye[0] - Math.sin(psi) * cp * 10, eye[1] + Math.sin(th) * 10, eye[2] - Math.cos(psi) * cp * 10], fl: fov };
    }
    /* a shot that must hold `must` on every screen: fit, then the lens and the aim */
    function fitShot(eye, at, fPhone, fDesk, must, roll = 0) { const F = fit(eye, at, isNarrow() ? fPhone : fDesk, must); fLens(F.fl); camAt(eye, F.at, roll); }
    const E0 = [PLACE.x, KNEEL.y, PLACE.z];                                   // his eye, kneeling at his place
    const E2 = [-5.0, EYE, -1.55];                                            // his eye, standing among the people before the west tent
    /* the festival's second half: those who go up (the woman before the hermit in brown, the man before the hermit in
       the yellow shawl), her bai sri raised and then set down at her left knee, and where he is to see each: at the
       north end of the masters' row, kneeling among those who wait, the two of them side on (PN: from standing height
       the lens looked down on the tops of two heads); beside the yellow hermit's sofa, standing, onto the man's face
       (PM) */
    /* (v26.8, Chad, 13 Nov 2026: "the arms of the female, and the arms of the brown lersi dont look very natural and abit
       awkward while holding the bai sri". Measured: the bowl's grip stood at 0.81 m, 0.5 m before her shoulders (0.76 m),
       so her arms went out dead straight; the hermit folded so far forward to reach it that his head (0.92 m) stood under
       his own hands. Photograph 5, the real one: the bowl raised above the kneeling man's bowed head, about 0.3 m before
       his face, his elbows bent near a right angle and his forearms rising steeply to it, his palms under it and his
       fingers spread up its sides; the seated master upright, his arms reaching forward to it at his chest. That kneeler
       kneels upright, his hips over his knees; she sits back on her heels, her head 0.25 m lower, and the master's chest
       is where it was: lifted to the top of her head (tried first), the bowl put the hermit's hands over his own
       shoulders and his face behind his arms (photographed). So it stands between the two, 0.31 m before her face with
       its foot at her chin: her elbows bend about 100 degrees, her forearms rising to it, and his hands meet it at his
       chin with a lean of about ten degrees) */
    const GO_A = [-9.16, -2.2], GO_B = [-9.15, 5.0], BAI_UP = [-9.53, 0.80, -2.2], BAI_DOWN = [-9.5, 0.012, -1.76];
    const PN = [-9.9, 1.08, -4.5], PM = [-10.4, EYE, 3.6];
    /* and where he stands for the man in white: 7.5 m before the bench, on the line that passes between Ton and those
       who wait their turn (measured in the bench's own frame against every seat of the `bless` formation) */
    const E3 = (() => { const [x, z] = benchAt(-0.22, 7.5); return [x, EYE, z]; })();
    const FILMS = {};

    /* ---------------------------------------------------------------- THE FESTIVAL (§4.1 P3; its clock: FEST)
       The dance, watched from where he kneels; a cut; those who go up at the west tent, watched from where he stands
       with Ton's group; the lens along the masters, and its stop on the man in white. */
    /* a film's own throw of petals: made once when the film's clock reaches it, run by that clock (so a seek lands on
       the same petals), and gone with the film */
    function filmBurst(id, t, t0, from, to, o) {
      if (t >= t0 && !FL.bursts[id] && from) { const Bu = petalBurst(from, to, t0, o); Bu.film = true; FL.bursts[id] = Bu; }
      if (FL.bursts[id]) burstAt(FL.bursts[id], t);
    }
    function filmBurstsEnd() { for (const id in FL.bursts) { const Bu = FL.bursts[id]; Bu.film = false; Bu.on = false; Bu.im.visible = false; } FL.bursts = {}; }
    FILMS.festival = {
      begin(api) {
        if (api.handsRoot) api.handsRoot.visible = false;
        FL.bursts = {}; FL.throwPho = null;
        fullOn(cast.goA); fullOn(cast.goB);                                     // (their full bodies, for this film's close shots only)
        /* those who go up: the woman before the hermit in brown, the man before the hermit in the yellow shawl */
        whenReady(cast.goA, (A) => put(A, GO_A[0], GO_A[1], -Math.PI / 2));
        whenReady(cast.goB, (Bm) => put(Bm, GO_B[0], GO_B[1], -Math.PI / 2));
        FL.throwAt = null;
        dancersDance();                                                          // (in play they stand at the masters' side: the dance is danced on its places)
      },
      frame(t, api) {
        const T = FEST, second = t >= T.cut + 0.62;                            // (the formation changes inside the cut's black)
        if ((formNow === 'bless') !== second) {
          setFormation(second ? 'bless' : 'arrive');
          if (second) { put(cast.ton, TON_LINE.x, TON_LINE.z, faceTo(TON_LINE.x, TON_LINE.z, PHO_AT[0], PHO_AT[1])); cast.ton.rest.take = 'Idle_3'; cast.ton.rest.win = null; rest(cast.ton, 0);
            put(cast.aunt, AUNT_LINE.x, AUNT_LINE.z, AUNT_LINE.ry); myBai.visible = false; }
          else { put(cast.ton, TON_PLACE.x, TON_PLACE.z, faceTo(TON_PLACE.x, TON_PLACE.z, 0, -11.2)); put(cast.aunt, cast.aunt.home.x, cast.aunt.home.z, cast.aunt.home.ry); }
          castSolid();
        }
        danceG.visible = !second;
        for (const P of [cast.goA, cast.goB]) if (P.ready) P.group.visible = second;
        if (!second && dancersDir.ph !== 'dance') dancersDance();              // (a seek back over the cut: the formation has stood them by)
        if (!second) {
          /* THE DANCE: the two drivers posed from the film's clock, their dance in place danced as a loop (v26.8: the
             second take, given them from 9 s, walked each dancer 1.2 m to one side and the mirrored ones the other, into
             their neighbours) */
          for (const D of [dancers.A, dancers.B]) pose(D, 'dance1', t, true);
          /* Ton, beside him, turns his head to say it */
          pose(cast.ton, 'seiza', 1.2 + 0.3 * Math.sin(t * 0.7), false);
          lookNow(cast.ton, 'lens', sgk(t, T.tn3d1 - 0.5, T.tn3d1 + 0.3) * (1 - sgk(t, T.q3m0 - 0.9, T.q3m0 - 0.2)), 1.2);
          const dc = [DANCE.c[0], 1.3, DANCE.c[1]], lead = [dancers.at[1][0], 1.36, dancers.at[1][1]];
          if (t < T.tn3d1 - 0.45) fitShot(E0, lp3([0.4, 1.3, -9.5], dc, smo(sgk(t, 0.1, 1.9))), 66, 56, dancers.at.map(p => [p[0], 1.65, p[1]]));
          else if (t < T.q3m0 - 0.75) shot(E0, [TON_PLACE.x, 0.98, TON_PLACE.z], 52, 42);
          else { const k = smo(sgk(t, T.q3m0 - 0.75, T.cut)); shot(E0, lead, lp(34, 25, k), lp(27, 20, k)); }
          auraAt(0, t);
        } else {
          const A = cast.goA, Bm = cast.goB, H = cast.hermitA, R = cast.red, HB = cast.hermitB, Ph = cast.pho, tm = t - T.masters;
          /* (where a hand lets its petals go: the take's own hand at its throw, measured once before the body is
             posed, so a seek and a play throw from one place) */
          if (!FL.throwAt && H.ready) { const v = handsAt(H, 'petals', 2.3, new THREE.Vector3(), 'R'); if (v) { H.group.localToWorld(v); FL.throwAt = [v.x, v.y + 0.05, v.z]; } }
          if (!FL.throwPho && Ph.ready) { const v = handsAt(Ph, 'Sit_Cheer_with_Left_Hand', 1.32, new THREE.Vector3(), 'R'); if (v) { Ph.group.localToWorld(v); FL.throwPho = [v.x, v.y + 0.08, v.z]; } }
          /* HER BAI SRI IS THE TRUTH, and the four hands go to it (handsTo): raised before her bowed head, riding her
             breath; then set down at her left knee (behind the cut to the man) */
          const kd = smo(sgk(t, T.low, T.low + 1.25)), bc = lp3(BAI_UP, BAI_DOWN, kd);
          bc[1] = lp(BAI_UP[1], BAI_DOWN[1], kd * kd) + 0.006 * Math.sin(tm * 1.3) * (1 - kd);
          baiPut(ymBai, bc[0], bc[1], bc[2], 0.4);
          /* the hermit in brown: from his rest both hands come onto it and lie there (photograph 5: the empowerment);
             then a handful of petals (his take from a little way in: the hand is already lifting); at rest again */
          const hs = 1.6 + 0.4 * Math.sin(tm * 0.9), idle = 9.6 + 0.3 * Math.sin(t * 0.5), kOn = smo(sgk(t, T.masters + 0.35, T.masters + 1.5)), tp = 0.6 + Math.max(0, t - T.pet);
          /* (v26.8: he sits up to it as photograph 5's master does, 0.42 of his take's lean forward (its 25 degrees: about
             ten) where it was all of it, and looks at the bai sri, not into his own arm) */
          if (t < T.pet) pose(H, 'Chair_Sit_Idle_M', idle, false, 'handson', 0.42 * kOn, hs);
          /* (v26.8: into the petals from the very blend he sat in, by pose's third take: the whole of his laying-on take
             here, as it was, made his lean jump fifteen degrees at the petals' first frame) */
          else if (tp < 3.9) { const kp = smo(sgk(t, T.pet, T.pet + 0.5));
            pose(H, 'Chair_Sit_Idle_M', idle, false, 'handson', 0.42 * (1 - kp), hs, 'petals', kp, tp); }
          else pose(H, 'petals', 3.9, false, 'Chair_Sit_Idle_M', smo(sgk(tp, 3.9, 4.6)), idle);
          const kHon = kOn * (1 - smo(sgk(t, T.pet - 0.1, T.pet + 0.45)));
          handsTo(H, baiGrip(bc, BAI.s, [H.group.position.x, H.group.position.z], 'on'), kHon);
          lookNow(H, [bc[0], bc[1] + 0.3, bc[2]], kHon, 0.6, 0);
          /* the woman: on her heels, her head bowed, the bowl raised in both hands above it, her fingers open round it; it
             is set down; she goes quite still */
          pose(A, 'seiza', 1.4 + 0.3 * Math.sin(tm * 0.7), false, 'sway', smo(sgk(t, T.low + 1.5, T.low + 2.8)), 0.3 + Math.max(0, t - T.low - 1.5) * 0.9);
          const kAh = 1 - smo(sgk(t, T.low + 1.2, T.low + 1.8));
          handsTo(A, baiGrip(bc, BAI.s, [A.group.position.x, A.group.position.z], 'under'), kAh);
          fingersOpen(A, 'L', kAh); fingersOpen(A, 'R', kAh);
          lookNow(A, [bc[0] - 0.25, 0.2, bc[2]], 0.75, 0.6, 0);
          if (A.ready) filmBurst('hermit', t, T.throw, FL.throwAt, [A.group.position.x - 0.12, A.group.position.z], { r: 0.5, up: 1.25, seed: 4471, s: 0.03 });
          /* the master in red speaks with those who kneel to him */
          pose(R, 'Sitting_Answering_Questions', 0.8 + tm, true);
          /* the hermit in the yellow shawl: his hand held out over the man; the man, heaped with petals, whose arms
             rise wide and whose face lifts (photograph 12) */
          pose(HB, 'palmover', 1.7 + 0.8 * (0.5 - 0.5 * Math.cos(tm * 0.5)), false);
          pose(Bm, 'armsup', 1.3 + (5.4 - 1.3) * smo(sgk(t, T.man + 0.3, T.man + 5.2)) + (t > T.man + 5.2 ? 0.1 * Math.sin((t - T.man - 5.2) * 1.1) : 0), false);
          lookNow(Bm, [GO_B[0] - 1.4, 2.5, GO_B[1]], 0.6 * smo(sgk(t, T.man + 0.6, T.man + 4.8)), 0.42, 0);
          if (t < T.man) {
            /* HANDS ON THE BAI SRI: from the row's end, kneeling among those who wait, the two of them side on with
               the bowl between them; a slow push as the hands are laid and the petals come */
            const k = smo(sgk(t, T.masters, T.man));
            fitShot(PN, [BAI_UP[0] + 0.02, lp(0.95, 0.92, k), BAI_UP[2]], lp(45, 40, k), lp(31, 26, k), [[-10.12, 1.24, -2.2], [GO_A[0] - 0.08, 1.0, GO_A[1]], [BAI_UP[0], BAI_UP[1] + 0.45, BAI_UP[2]], [BAI_UP[0], BAI_UP[1] - 0.05, BAI_UP[2]]]);
            auraAt(0, t);
          } else if (t < T.sweep) {
            /* THE TRANCE: from beside the hermit's sofa, the man's face and his arms as they rise */
            const k = smo(sgk(t, T.man, T.sweep));
            fitShot(PM, [GO_B[0], lp(0.92, 1.0, k), GO_B[1]], lp(50, 44, k), lp(34, 29, k), [[GO_B[0], 1.7, GO_B[1] - 0.72], [GO_B[0], 1.7, GO_B[1] + 0.72], [GO_B[0], 0.3, GO_B[1]]]);
            auraAt(0, t);
          } else if (t < T.pho) {
            /* THE LENS ALONG THE MASTERS: from the west tent (she kneels there still, her bai sri beside her) round by
               the north (the tables, the hall) and the east (the monks) to the gold canopy across the turf, where it
               slows, stops and begins to narrow. One move, eased at both ends; its lens a smooth function of the clock */
            const y0 = yawTo(E2[0], E2[2], -9.9, -1.6), y1 = yawTo(E2[0], E2[2], PHO_AT[0], PHO_AT[1]), ks = smo(sgk(t, T.sweep, T.sweep + 5.6));
            const ya = y0 + (y1 - y0) * ks, dPho = Math.hypot(PHO_AT[0] - E2[0], PHO_AT[1] - E2[2]), kz = smo(sgk(t, T.sweep + 4.4, T.pho));
            const ay = lp(lp(0.15, 1.45, smo(sgk(ks, 0, 0.3))), EYE + (1.45 - EYE) * 10 / dPho, smo(sgk(ks, 0.62, 1)));
            shot(E2, [E2[0] - Math.sin(ya) * 10, ay, E2[2] - Math.cos(ya) * 10], lp(58, 31, kz), lp(46, 24, kz));
            auraAt(0, t);
          } else {
            /* THE MAN IN WHITE: nearer, down the lane the line comes up, nothing between; the lens narrows on him. He
               is at his work: a handful of petals over those who kneel to him (photograph 1), then quite still, his
               eyes on them and never on the lens (that look is kept for the play: §4.1 P4). The gold comes up on him */
            const kc = smo(sgk(t, T.cheer, T.cheer + 0.45)) * (1 - smo(sgk(t, T.cheer + 2.25, T.cheer + 2.95)));
            pose(Ph, 'Sit_to_Stand_Transition_M', 0.16 + 0.13 * Math.sin(t * 0.8), false, 'Sit_Cheer_with_Left_Hand', kc, 0.15 + Math.max(0, t - T.cheer) * 0.9);
            { const [lx, lz] = benchAt(-1.2, 2.2); lookNow(Ph, [lx, 0.85, lz], 1, 0.45, 0.02); }
            { const [tx, tz] = benchAt(0.15, 1.7); filmBurst('pho', t, T.throw2, FL.throwPho, [tx, tz], { r: 0.95, up: 1.5, seed: 9127, s: 0.034 }); }
            const k = smo(sgk(t, T.pho, T.black)), [ax, az] = benchAt(0.52, 0.04);
            shot(E3, [ax, lp(1.0, 1.1, k), az], lp(27, 15, k), lp(19, 9.5, k));
            auraAt(0.4 * smo(sgk(t, T.q3w2 + 4.5, T.q3w3 + 3)), t);
          }
        }
      },
      /* (the dancers are the ground's again: where the formation has them, at rest; play's own frame shows them) */
      end() { danceG.visible = false; dancersForm(); for (const P of [cast.goA, cast.goB]) { P.group.visible = false; fullOff(P); } filmBurstsEnd(); auraAt(0, 0); }
    };

    /* ---------------------------------------------------------------- THE OPENING FILM (§4.0; its clock: OPENT)
       His counter at night: the forum's thread, and his answer typed; his notebook; what he takes; then the turf. */
    const OPEN_IN = [DATA.spawn.x, EYE, 12.98];                                  // where his eyes open: on the earth at the turf's edge, his sandals just off
    FILMS.open = {
      begin(api) { if (api.handsRoot) api.handsRoot.visible = false; FL.shot = ''; },
      stage(n) {
        FL.shot = n;
        if (n === 'desk') { lit('COUNTER', ''); deskG.visible = true; desk.bag.visible = true; desk.shirt.visible = false; if (desk.book) desk.book.visible = true; }
        else if (n === 'pack1') { desk.shirt.visible = true; deskLap(0); }
        else if (n === 'pack2') { desk.shirt.visible = false; if (desk.book) desk.book.visible = false; }
        else if (n === 'turf') { deskG.visible = false; lit('DAY1', 'one'); mistK = 1; setFormation('arrive'); dayCast(true); tonHome(); castSolid(); }
      },
      frame(t, api) {
        const T = OPENT, X = DESK.x, Z = DESK.z, top = DESK.top;
        const n = t >= T.o4 - 0.5 ? 'turf' : t >= T.o3 + 2.4 ? 'pack2' : t >= T.o3 ? 'pack1' : 'desk';
        if (n !== FL.shot) { if (n !== 'desk' && !FL.shot) FILMS.open.stage('desk'); FILMS.open.stage(n); }
        /* where he sits to pack: before the shirt and the bag */
        const eyeP = [X + 0.74, 1.42, Z - 0.74], bx = X + DESK.bag[0], bz = Z + DESK.bag[1], sx = X + DESK.shirt[0], sz = Z + DESK.shirt[1];
        if (n === 'desk') {
          /* THE SCREEN: the thread; his answer typed a letter at a time as he says the first line; sent */
          const typ = String(W.forumReply || ''), t0 = T.q3o1 + 1.0, tSend = T.q3o1 + SECS['q3o1'] + 0.9;
          const nCh = Math.max(0, Math.min(typ.length, Math.floor((t - t0) / 0.13))), kOff = smo(sgk(t, T.o2 + 0.5, T.o2 + 1.3));
          deskLap(kOff < 0.999, nCh, Math.floor(t * 2.2) % 2 === 0, t >= tSend);
          if (kOff > 0 && kOff < 0.999) desk.lapM.color.setScalar(1 - kOff);                // (his laptop shut: the screen goes down to dark as his eyes leave it)
          /* THE PAGE: each question underlined as he asks it; the leaf turned on the last sentence */
          const u = (a, d) => sgk(t, a + 0.35, a + 0.35 + d), tTurn = T.q3o5 + SECS['q3o5'] - 1.9;
          deskLeaf(u(T.q3o2, 1.3), u(T.q3o3, 2.2), u(T.q3o4, 3.4), smo(sgk(t, tTurn, tTurn + 1.5)));
          /* HIS EYES. On the screen, square to it (a phone's frame holds the thread's column whole); a slow push onto
             the answers and the box he types in; then he LEANS to his notebook (the eye itself goes over it, so its page
             is read square and not from the side: photographed) and down the page with his questions */
          const Q = (L, f) => L.map(([a, b]) => f(a, b)), mid = (P4) => [(P4[0][0] + P4[2][0]) / 2, (P4[0][1] + P4[2][1]) / 2, (P4[0][2] + P4[2][2]) / 2];
          const col = Q([[FX0, 118], [FX1, 118], [FX1, 708], [FX0, 708]], deskScreen), low = Q([[FX0, 470], [FX1, 470], [FX1, 708], [FX0, 708]], deskScreen);
          const leaf = Q([[540, 60], [1000, 60], [1000, 470], [540, 470]], deskPage);
          if (!col[0] || !leaf[0]) { shot([X, 1.36, Z - 0.66], [X, top + 0.1, Z], 50, 40); return; }
          const kb = smo(sgk(t, T.o2, T.o2 + 1.8)), kp = smo(sgk(t, T.q3o1 + 0.3, tSend - 0.4)), kq = smo(sgk(t, T.q3o2, T.q3o5 + 6));
          const cS = mid(col), cL = mid(leaf), eye = lp3([cS[0], 1.36, Z - 0.68], [cL[0], 1.46, cL[2] - 0.4], kb), nar = isNarrow();
          const F1 = fit(eye, cS, nar ? 46 : 34, col), F2 = fit(eye, mid(low), nar ? 30 : 22, low), F3 = fit(eye, cL, nar ? lp(40, 36, kq) : lp(30, 27, kq), leaf);
          fLens(lp(lp(F1.fl, F2.fl, kp), F3.fl, kb)); camAt(eye, lp3(lp3(F1.at, F2.at, kp), F3.at, kb));
        } else if (n === 'pack1') {
          /* WHAT HE TAKES: a folded white shirt, before his open bag */
          const k = smo(sgk(t, T.o3, T.o3 + 2.4));
          fitShot(eyeP, [lp(sx, bx, 0.5), top + lp(0.07, 0.09, k), lp(sz, bz, 0.45)], lp(52, 48, k), lp(38, 35, k), [[sx - 0.19, top, sz - 0.25], [sx + 0.19, top, sz - 0.25], [bx - 0.2, top + 0.3, bz + 0.14], [bx + 0.2, top + 0.3, bz + 0.14]]);     // (named a hand's width past the shirt's hem and the bag's top: the fit's own margin reaches under the film's bars)
        } else if (n === 'pack2') {
          /* PACKED: the bag alone on the glass */
          const k = smo(sgk(t, T.o3 + 2.4, T.o4 - 0.5));
          fitShot(eyeP, [bx, top + lp(0.12, 0.14, k), bz], lp(40, 36, k), lp(30, 27, k), [[bx - 0.2, top, bz - 0.14], [bx + 0.2, top, bz - 0.14], [bx - 0.2, top + 0.26, bz + 0.14], [bx + 0.2, top + 0.26, bz + 0.14]]);
        } else {
          /* THE TURF: his eyes open on the earth, his own sandals, the rows of others' and the grass with its petals; he
             steps out of his own and onto it; and up, to all of it. It ends on the very spot, heading and lens play
             begins in */
          const k = smo(sgk(t, T.o4 + 1.3, T.q3o6 + 3.4)), kUp = smo(sgk(t, T.o4 + 2.3, T.q3o6 + 4.6));
          const ez = lp(OPEN_IN[2], DATA.spawn.z, k), step = Math.sin(Math.PI * c01(k * 2.2)) * (k < 0.46 ? 1 : 0);
          const e2 = [DATA.spawn.x, EYE - 0.035 * step + 0.012 * Math.sin((OPEN_IN[2] - ez) * 2 * Math.PI / 0.7) * (1 - kUp), ez];
          eyes(e2, 0, lp(-1.02, 0, kUp), PLAY_FOV, PLAY_FOV);
        }
      },
      end() { if (FL.shot !== 'turf') FILMS.open.stage('turf'); deskG.visible = false; FL.shot = ''; }
    };

    /* ---------------------------------------------------------------- THE NIGHT BETWEEN (§4.2; its clock: BETW)
       Five pictures, each staged in the black before it. */
    /* a film's light: a look by name, and which day's dressing stands under it said apart (the afternoon of DAY ONE is
       a film's own: play's AFTERNOON is day two's). Called in the black (v16.1). */
    function lit(name, day) {
      if (kit) kit.daylight(PRESETS[name] || null, 0);
      lookName = name; FL.lit = name;
      dayOne.visible = /one/.test(day); dayTwo.visible = /two/.test(day); nightG.visible = /night/.test(day); duskG.visible = name === 'DUSK';
      crowdSolid(dayOne.visible);
      paintShade(name);
      phoLook.level.value = PHO_LEVEL[name] != null ? PHO_LEVEL[name] : 1;
      mistK = 0;
    }
    /* HIS BAI SRI IN HIS HANDS, IN A FILM: exactly as play carries it (the hands' own pass, his hands under the frame's
       foot, play's own place for it: baiPlace), so it is the size on the screen it has been all day whatever the
       film's lens is. (Stood in the world before the lens instead, a narrow lens showed four incense sticks.) */
    function filmBai(on, p = 0) {
      const A = FL.api; if (!A || !A.armR) return;
      const rh = A.rightHand && A.rightHand();
      if (!on) { if (FL.bai) { FL.bai = false; handBaiHolder.add(handBai); if (rh) rh.visible = true; if (A.handsRoot) A.handsRoot.visible = false; } return; }
      if (!FL.bai) { FL.bai = true; A.armR.add(handBai); }
      if (A.handsRoot) A.handsRoot.visible = true;
      A.armR.visible = true; if (rh) rh.visible = false;
      const keep = play.baiP, pull = play.pull; play.baiP = p; play.pull = null; baiPlace(); play.baiP = keep; play.pull = pull;
    }
    /* where he is for each: at the side of the photograph; before the tables, looking up; before the tables at night,
       a little lower (he has sat down on the turf); in the room, a pace back from its window */
    const BW = { eye1: [-5.0, EYE, -1.7], eye2: [-2.4, EYE, -6.3], eye3: [0.95, 1.5, -7.6], eye4: [ROOM.x + 0.03, 1.2, ROOM.wall + 1.8] };
    /* (v26.8, Chad, 13 Nov 2026: "make the masters stand more straightly in a row, they currently dont look like they are
       in a proper row, and there is alot of uneven spacing between each master, make them stand closer to each other so
       it actually looks like real photo taking") THE ROW AS A GROUP PHOTOGRAPH STANDS IT (photograph 8: the masters
       shoulder to shoulder directly behind the kneelers, square to the row, everyone looking at the one who takes it):
       five marks 0.66 m apart on one line 0.92 m behind the kneelers, centred on them, each master STOOD ON HIS MARK BY
       HIS HIPS (a standing take holds a body off its own origin: Grandmaster Pho's stand ends 31 cm behind his; the old
       row put origins 1.25 m apart and fanned them), and still: each held at a moment of his own stand where his
       shoulders are level within half a centimetre and his head straight (dbgupright: the four in Idle_3 at 9.0, 9.0,
       4.0 and 7.0 s). The woman who counts it in stands where a photographer would, in front of the row's middle, out
       of his frame on both screens (she is heard, not seen) */
    const PHOTO_ROW = { x0: -1.32, dx: 0.66, z: PHOTO.z - 0.92, hold: [9.0, 9.0, null, 4.0, 7.0] }, PHOTO_CAM = { x: 0, z: PHOTO.z + 5.5 };
    function hipsTo(P, x, z) { if (!P || !P.ready || !P.hips) return; P.group.updateWorldMatrix(true, true); P.hips.getWorldPosition(_ffv); P.group.position.x += x - _ffv.x; P.group.position.z += z - _ffv.z; }
    FILMS.between = {
      begin(api) { if (api.handsRoot) api.handsRoot.visible = false; FL.shot = ''; FL.bai = false; },
      stage(n) {
        FL.shot = n; filmBai(n === 'n1');
        const row = [cast.hermitB, cast.red, cast.pho, cast.white, cast.hermitA];
        FL.sky = n === 'n4' ? { x: ROOM.x, z: ROOM.z } : null;
        if (n === 'n1') {
          /* THE PHOTOGRAPH (photograph 8), late in the afternoon of day one: twelve kneel in a row before the tables,
             hands joined, and the masters stand behind them, Grandmaster Pho in their middle */
          lit('AFTERNOON', 'one'); setFormation('photo'); dayCast(true);
          row.forEach((P, i) => put(P, PHOTO_ROW.x0 + i * PHOTO_ROW.dx, PHOTO_ROW.z, 0));
          put(cast.ton, PHOTO.x0 + 12 * PHOTO.dx + 0.06, PHOTO.z + 0.04, -0.1); put(cast.aunt, PHOTO_CAM.x, PHOTO_CAM.z, faceTo(PHOTO_CAM.x, PHOTO_CAM.z, 0, PHOTO.z));
          for (const P of [cast.ym, cast.goA, cast.goB]) if (P.ready) P.group.visible = false;
          ymBai.visible = false; myBai.visible = false; castSolid();
          return;
        }
        /* (everyone the photograph stood up or moved is back where the days keep him, and at rest) */
        for (const P of row) { if (P.home) put(P, P.home.x, P.home.z, P.home.ry); if (P.ready) rest(P, 0); }
        for (const P of [cast.ton, cast.aunt]) { put(P, P.home.x, P.home.z, P.home.ry); if (P.ready) rest(P, 0); }
        myBai.visible = false;
        if (n === 'n2') { lit('DUSK', 'two'); setFormation('bless'); dayCast(false); }
        else if (n === 'n3') { lit('NIGHT', 'two night'); dayCast(false); }
        else if (n === 'n4') { lit('ROOM0', ''); if (room.sync) room.sync(); }
        else if (n === 'n5') dawnStage();
        castSolid();
      },
      frame(t, api) {
        const T = BETW, n = t >= T.n5 ? 'n5' : t >= T.n4 ? 'n4' : t >= T.n3 ? 'n3' : t >= T.n2 ? 'n2' : t >= T.n1 ? 'n1' : '';
        if (!n) return;                                                         // (play's own picture, going to black)
        if (n !== FL.shot) FILMS.between.stage(n);
        if (n === 'n1') {
          const u = t - T.n1, k = smo(sgk(t, T.n1, T.n2));
          /* every kneeler's hands are joined; the five behind them stand for the photograph, still, on their marks, and
             look at the one who takes it */
          const row = [cast.hermitB, cast.red, cast.pho, cast.white, cast.hermitA];
          DEVOTEES.forEach((key, i) => { const D = crowdDrivers[key]; pose(D.A, 'prostrate', 0.5 + 0.12 * Math.sin(u * 0.7 + i), false); pose(D.B, 'prostrate', 0.45 + 0.12 * Math.sin(u * 0.6 + i * 1.7), false); });
          row.forEach((P, i) => {
            if (P === cast.pho) pose(P, 'Sit_to_Stand_Transition_M', 4.3 + 0.04 * Math.sin(u * 0.9), false);
            else pose(P, 'Idle_3', PHOTO_ROW.hold[i] + 0.06 * Math.sin(u * 1.1 + i), false);
            hipsTo(P, PHOTO_ROW.x0 + i * PHOTO_ROW.dx, PHOTO_ROW.z);
            lookNow(P, [PHOTO_CAM.x, 1.45, PHOTO_CAM.z], 1, 0.5); });
          pose(cast.ton, 'seiza', 1.3 + 0.3 * Math.sin(u * 0.7), false); pose(cast.aunt, 'Idle_3', 2 + u, true);
          fitShot(BW.eye1, [lp(-0.2, 0.1, k), 1.12, PHOTO.z - 0.5], lp(58, 54, k), lp(40, 37, k),
            [[PHOTO.x0 - 0.45, 1.0, PHOTO.z], [PHOTO.x0 - 0.45, 0.1, PHOTO.z], [PHOTO.x0 + 12 * PHOTO.dx + 0.4, 1.0, PHOTO.z],
             [PHOTO_ROW.x0 - 0.4, 1.9, PHOTO_ROW.z], [PHOTO_ROW.x0 + 4 * PHOTO_ROW.dx + 0.4, 1.9, PHOTO_ROW.z]]);
          /* his own bai sri, still in his hands */
          filmBai(true, 0);
        } else if (n === 'n2') {
          /* THE BANNERS AGAINST A RED EVENING: he looks up, past the long banners to the pole in its tiers of satin
             and its strings of flags (looking west instead, the sky was behind a tree: photographed) */
          const k = smo(sgk(t, T.n2, T.n3)); shot(BW.eye2, [lp(0.2, 0.5, k), lp(4.6, 5.9, k), -13.9], 62, 50);
        } else if (n === 'n3') {
          /* THE OFFERING TABLES BY THEIR OWN CANDLES */
          const k = smo(sgk(t, T.n3, T.n4)); shot(BW.eye3, [lp(0.15, 0, k), lp(1.22, 1.36, k), -11.5], lp(48, 42, k), lp(36, 31, k));
        } else if (n === 'n4') {
          /* HIS BAI SRI ON THE SILL, BESIDE HIS BAG: the window pales behind it */
          const k = smo(sgk(t, T.n4 + 0.4, T.n5 - 0.3)), d = dayBlend(ROOM0, ROOM1, k);
          d.stars = lp(ROOM0.stars, ROOM1.stars, k); if (kit) kit.daylight(d, 0);
          if (room.ringMat) room.ringMat.color.setRGB(lp(0.01, 0.06, k), lp(0.014, 0.075, k), lp(0.012, 0.065, k));
          if (room.ground) room.ground.color.setRGB(lp(0.004, 0.022, k), lp(0.006, 0.03, k), lp(0.005, 0.022, k));
          for (const m of room.tree) m.color.setScalar(lp(0.04, 0.3, k));
          { const X = ROOM.x, Zw = ROOM.wall, sl = ROOM.sill, hw = ROOM.w / 2 + 0.06;
            fitShot(BW.eye4, [X, sl + lp(0.5, 0.46, k), Zw], lp(60, 54, k), lp(46, 41, k), [[X - hw, sl - 0.1, Zw], [X + hw, sl - 0.1, Zw], [X - hw, sl + 1.1, Zw], [X + hw, sl + 1.1, Zw]]); }
        } else {
          /* FIRST LIGHT ON THE TURF: his eyes come up from yesterday's petals to the bench across the turf, where one
             man sits; and Ton, beside him. It ends on the very picture play begins the morning in */
          const k = smo(sgk(t, T.n5 + 0.3, T.tn3n1 + 0.2)), ya = phoYawFrom(DAWN_AT), pi = lp(-0.6, -0.04, k), eye = [DAWN_AT.x, EYE, DAWN_AT.z];
          shot(eye, [eye[0] - Math.sin(ya) * Math.cos(pi) * 10, EYE + Math.sin(pi) * 10, eye[2] - Math.cos(ya) * Math.cos(pi) * 10], PLAY_FOV, PLAY_FOV);
          mistK = 1;
          /* Ton says it, and is at rest again before play has him */
          const tt = t - T.tn3n1, kt = smo(sgk(tt, -0.15, 0.25)) * (1 - smo(sgk(tt, SECS['tn3n1'] - 0.1, SECS['tn3n1'] + 0.55)));
          pose(cast.ton, 'Idle_3', 3 + (t - T.n5), true, 'Stand_and_Chat', kt, Math.max(0, tt));
          lookNow(cast.ton, 'lens', 1, 0.6);
        }
      },
      end() { if (FL.shot !== 'n5') FILMS.between.stage('n5'); filmBai(false); FL.shot = ''; FL.sky = null; myBai.visible = false; }
    };

    /* ---------------------------------------------------------------- THE TELLING AND THE ANSWERS (§4.3 P7, P8)
       He kneels before Grandmaster Pho and does not move: both films are ONE HELD LOOK from where he kneels, and every
       change in it is a move of his eyes (a push of the lens, a look away and back), never a cut on the man he is
       looking at (a lens that changes in one frame while the eye and its subject stay is a jolt: v25.5). The one place
       the lens changes unseen is behind his own eyelids, once, before the teaching. */
    /* (his eye, kneeling; and FOOT, the carpet at Grandmaster Pho's foot, deep in petals, where his eyes drop on "kumanthong".
       v26.8: a golden bowl of petals stood there and the drops looked into it; taken out at Chad's word, "Remove it") */
    const EK = [KNEEL2.x, KNEEL.y, KNEEL2.z], FOOT = benchAt(0.1, 0.72);
    /* his eyes from a place: a heading and a tilt (up is positive), at a lens */
    function eyes(eye, ya, pi, fPhone, fDesk, roll = 0) { const c = Math.cos(pi); shot(eye, [eye[0] - Math.sin(ya) * c * 10, eye[1] + Math.sin(pi) * 10, eye[2] - Math.cos(ya) * c * 10], fPhone, fDesk, roll); }
    const aimOf = (eye, p) => [yawTo(eye[0], eye[2], p[0], p[2]), Math.atan2(p[1] - eye[1], Math.hypot(p[0] - eye[0], p[2] - eye[2]))];
    /* THE TILT THAT HOLDS A FACE WELL at a lens: a face at the middle of the picture leaves its top half to whatever is
       over the man's head (the canopy's dark cloth: photographed, nearly half the frame). So the look rests below the
       face by a fifth of what the lens sees there (the film's band is 0.776 of the screen's height on a phone and a
       desktop alike), and never by so much that his crown leaves the picture. A smooth function of the lens */
    function faceTilt(eye, F, fPhone, fDesk) {
      const d = Math.hypot(F[0] - eye[0], F[2] - eye[2]), vis = 2 * d * Math.tan(THREE.MathUtils.degToRad(isNarrow() ? fPhone : fDesk) / 2) * 0.776;
      const off = Math.max(0, Math.min(0.2 * vis, 0.5 * vis - 0.2));
      return Math.atan2(F[1] - off - eye[1], d);
    }
    /* 0 before a; up to 1 over `up` seconds; held; down to 0 over the `down` seconds before b */
    const bump = (t, a, b, up = 0.8, down = up) => smo(sgk(t, a, a + up)) * (1 - smo(sgk(t, b - down, b)));
    /* WHERE A FACE IS, measured once on the body at its rest and then held: a film's look rests on that place and never
       rides the living head (v25.5: a look locked to a talking head sways the whole picture behind it) */
    function faceAt(id, P, restTake, restT) {
      if (!FL.faces[id] && P && P.ready) { pose(P, restTake, restT, false); const h = headOf(P, null); if (h) FL.faces[id] = [h[0], h[1] + 0.06, h[2]]; }
      return FL.faces[id] || [P.group.position.x, 1.3, P.group.position.z];
    }
    /* A SEATED MASTER SPEAKS, in a film: his talking take under each of his lines (eased in at the line's start and out
       at its end; each line begins the take somewhere else, so no two begin with one gesture), his rest between */
    function speaks(P, t, T, lines) {
      let k = 0, tt = 0;
      lines.forEach((ln, i) => { if (T[ln] == null) return; const a = T[ln], d = SECS[ln] || 2.5, kk = smo(sgk(t, a - 0.12, a + 0.4)) * (1 - smo(sgk(t, a + d - 0.3, a + d + 0.5)));
        if (kk > k) { k = kk; tt = i * 2.9 + (t - a); } });
      const A = P.ready && P.acts[P.talkTake], d = A ? A.getClip().duration : 1;
      pose(P, P.rest.take, 0.16 + 0.13 * Math.sin(t * 0.7), false, P.talkTake, k, ((tt % d) + d) % d);
      return k;
    }
    /* HIS HANDS IN A FILM: the clasp risen from under the frame to play's own height (kUp), and out of it into the slow
       gesture his hands make by themselves, by g (the engine's own: handsPose, the twenty-fourth seam). The arm's own
       pose is kept and given back when they go down (chapter 2's waiAt) */
    function handsFilm(kUp, g = 0, tFlow = 0) {
      const A = FL.api; if (!A || !A.handsPose || !A.armR) return;
      if (kUp <= 0.001) {
        if (FL.wai) { FL.wai = false; A.armR.position.copy(FL.waiPos); A.armR.quaternion.copy(FL.waiQ); const L = A.prayerArm && A.prayerArm(); if (L) L.visible = false; if (A.handsRoot) A.handsRoot.visible = false; }
        return;
      }
      if (!FL.wai) { FL.wai = true; FL.waiPos = A.armR.position.clone(); FL.waiQ = A.armR.quaternion.clone(); }
      if (A.handsRoot) A.handsRoot.visible = true;
      A.handsPose(c01(g), tFlow, { y: lp(-0.72, -0.3, smo(c01(kUp))) });
    }
    /* HIS HAND AT REST, LIFTED INTO HIS SIGHT by k: the walking hand exactly as play draws it (its own turn, its own
       fingers), raised by half the frame's half-height at its own depth, so it stands over the foot of the picture
       where a caption is. The arm's own place is kept and given back */
    function handStill(k) {
      const A = FL.api; if (!A || !A.armR || !A.vmCam) return;
      if (k <= 0.001) { if (FL.rest0) { A.armR.position.copy(FL.rest0); FL.rest0 = null; if (A.handsRoot) A.handsRoot.visible = false; } return; }
      if (!FL.rest0) FL.rest0 = A.armR.position.clone();
      const halfH = Math.tan(THREE.MathUtils.degToRad(A.vmCam.fov / 2)) * Math.abs(FL.rest0.z);
      if (A.handsRoot) A.handsRoot.visible = true; A.armR.visible = true;
      A.armR.position.set(FL.rest0.x, FL.rest0.y + halfH * 0.5 * smo(c01(k)), FL.rest0.z);
    }
    const filmChill = (k, tint) => { if (kit && kit.chill) kit.chill(k, { secs: 0, cine: k > 0, tint: tint || null }); };
    FILMS.tell = {
      begin(api) { if (api.handsRoot) api.handsRoot.visible = false; FL.wai = false; },
      frame(t, api) {
        const T = TELL, Ph = cast.pho, F = faceAt('pho', Ph, 'Sit_to_Stand_Transition_M', 0.16), [yF, pF] = aimOf(EK, F);
        /* he listens: quite still, his eyes on the one who speaks */
        pose(Ph, 'Sit_to_Stand_Transition_M', 0.16 + 0.13 * Math.sin(t * 0.7), false);
        lookNow(Ph, 'lens', 1, 0.5, 0);
        pose(cast.aunt, 'Idle_3', 2 + t, true);
        /* A LOOK OF ITS OWN FOR EACH SENTENCE (v26.8, Chad: "When grandmaster pho or the player talks for very long
           stretches, you should rotate between different camera panning, angles, etc, to make it less static and boring,
           so there is sustained visual interest"). Every change is still a move of his eyes or his lens, never a cut on
           the man he looks at (v25.5): his sensitivity, a slow push on the old man's face; the chanting, down at his own
           hands as they begin to move by themselves, the picture swaying with them; the amulets, to the beads on his
           teacher's chest, the edge of his sight gone cold for "I can feel its energy"; the kumanthong, he cannot hold
           the old man's eyes, and his own drop to the petals on the carpet at his teacher's foot; "He listened.", the face
           again, nearer. (The plan had him look up at the cloth overhead: photographed twice, it is the dark underside
           of a roof and an eave seen from below) */
        const kH = bump(t, T.q3t2 + 0.4, T.q3t2 + SECS['q3t2'] + 0.4, 0.9, 1.0), kN = bump(t, T.q3t3 + 0.3, T.q3t3 + SECS['q3t3'] + 0.3, 1.0, 1.1);
        const kC = bump(t, T.q3t4 + 0.5, T.q3t4 + SECS['q3t4'] + 0.9, 1.1, 1.2);
        const [yC, pC] = aimOf(EK, [FOOT[0], 0.02, FOOT[1]]), [yN, pN] = aimOf(EK, [F[0], F[1] - 0.34, F[2]]);
        /* and the slow push on the old man's face through the whole telling */
        const kp = smo(sgk(t, 0, T.q3t8)), fP = lp(46, 25, kp), fD = lp(34, 18.5, kp), pT = faceTilt(EK, F, fP, fD);
        /* "my body moves by itself": for that sentence his body remembers it, and the picture sways a little */
        const kS = bump(t, T.q3t2 + 1.0, T.q3t2 + SECS['q3t2'] + 0.2, 1.3, 1.4), sway = kS * 0.03 * Math.sin((t - T.q3t2) * 1.7);
        /* (v26.8: the drop WIDE, his eyes on the ground at his teacher's foot: at 38 degrees the bowl that stood there filled
           the frame and its heap read as dough; the bowl is gone now, at his word, and his eyes drop to the carpet's petals) */
        eyes(EK, yF + (yN - yF) * kN + (yC - yF) * kC + sway * 0.5, pT + (-0.6 - pT) * kH + (pN - pT) * kN + (pC - pT) * kC,
          lp(lp(lp(fP, 60, kH), 33, kN), 56, kC), lp(lp(lp(fD, 46, kH), 24, kN), 42, kC), sway);
        handsFilm(kH, 0.36 * bump(t, T.q3t2 + 1.1, T.q3t2 + SECS['q3t2'] - 0.2, 1.2, 1.2), t - T.q3t2);
        /* what the amulets' sentence remembers, laid over his sight for as long as it is said: the cold of a piece in
           the shop, its energy in his hand */
        filmChill(0.3 * bump(t, T.q3t3 + 1.7, T.q3t3 + SECS['q3t3'] + 0.5, 0.9, 1.1), null);
      },
      end() { handsFilm(0); filmChill(0); }
    };
    FILMS.answers = {
      begin(api) { if (api.handsRoot) api.handsRoot.visible = false; FL.wai = false; },
      frame(t, api) {
        const T = ANSW, Ph = cast.pho, Au = cast.aunt, W8 = ANSW_WORDS;
        phoFace(); phoTalkFace();                                                // (both his places measured before he is posed)
        const kTalk = speaks(Ph, t, T, ['ph3n1', 'ph3n2', 'ph3n3', 'ph3n4']);
        const F = phoF(kTalk), [yF, pF] = aimOf(EK, F);
        lookNow(Ph, 'lens', 1, 0.5, 0);
        pose(Au, 'Idle_3', 2 + t, true);
        /* A LOOK OF ITS OWN FOR EACH THING HE SAYS (v26.8, Chad: "When grandmaster pho or the player talks for very long
           stretches, you should rotate between different camera panning, angles, etc"), each on the word it is about,
           measured on the takes (ANSW_WORDS): "Different people bring different things", his eyes go down to what he
           brought, his bai sri on the carpet beside his knee, and come back up for "and different baramee"; "You were
           born with a gift", down to his own hands, risen into the picture, and up for "and with a mission"; "Without
           control, it will overwhelm you, and it will hurt you", a push on the old man's face and a greyness at the edge
           of his sight; "You opened your body to the kumanthong", he cannot hold the old man's eyes: down to the petals
           on the carpet at his teacher's foot; his eyes close a moment; "To open when you choose, and to close when you choose", he draws
           back and the gold rises on his teacher. Every change is a move of his eyes or his lens, never a cut (v25.5) */
        const kB = bump(t, T.ph3n1 + W8.n1diff - 0.15, T.ph3n1 + W8.n1and + 0.25, 0.9, 1.0), [yB, pB] = aimOf(EK, [BESIDE.x, 0.27, BESIDE.z]);
        const kH = bump(t, T.ph3n2 + W8.n2born - 0.2, T.ph3n2 + W8.n2and + 0.3, 0.8, 0.8);
        const kC = bump(t, T.ph3n3 + W8.n3you - 0.15, T.ph3n3 + SECS['ph3n3'] + 0.3, 1.0, 1.1), [yC, pC] = aimOf(EK, [FOOT[0], 0.02, FOOT[1]]);
        /* THE LENS, one smooth line through the whole film (its knots: [second, phone, desktop]); a second line after
           his eyes have closed and opened */
        const first = t < T.blink + 0.33;
        const L = first ? [[0, 54, 40], [T.q3a1 + SECS['q3a1'], 41, 30], [T.ph3n1 + W8.n1diff - 0.2, 30, 22], [T.ph3n1 + SECS['ph3n1'] + 0.3, 27, 20],
                           [T.ph3n2 + W8.n2born - 0.3, 22, 16], [T.ph3n2 + SECS['ph3n2'] + 0.3, 31, 23], [T.ph3n3 + W8.n3wo, 30, 22],
                           [T.ph3n3 + W8.n3you - 0.2, 21, 15], [T.blink, 24, 17]]
                        : [[T.blink, 20, 14], [T.ph3n4 + W8.n4to, 26, 18.5], [T.ph3n4 + SECS['ph3n4'] + 0.2, 44, 33], [T.end - 0.4, PLAY_FOV, PLAY_FOV]];
        let fP = L[0][1], fD = L[0][2];
        for (let i = 0; i < L.length - 1; i++) if (t >= L[i][0]) { const k = smo(sgk(t, L[i][0], L[i + 1][0])); fP = lp(L[i][1], L[i + 1][1], k); fD = lp(L[i][2], L[i + 1][2], k); }
        /* it ends on play's own picture: play's heading, tilt and lens from where he kneels */
        const kEnd = smo(sgk(t, T.ph3n4 + SECS['ph3n4'] + 0.3, T.end - 0.4)), yaP = phoYawFrom(KNEEL2), piP = 0.16;
        const pT = faceTilt(EK, F, fP, fD);
        /* (v26.8: the drop wide, to the carpet's petals, as in the telling) */
        eyes(EK, lp(yF + (yB - yF) * kB + (yC - yF) * kC, yaP, kEnd), lp(pT + (pB - pT) * kB + (-0.6 - pT) * kH + (pC - pT) * kC, piP, kEnd),
          lp(lp(lp(fP, 52, kB), 56, kH), 56, kC), lp(lp(lp(fD, 40, kB), 42, kH), 42, kC));
        /* "born with a gift": his own hands, risen into the picture, held still */
        handsFilm(kH, 0, 0);
        /* "it will overwhelm you, and it will hurt you": for those words, a greyness at the edge of his sight */
        filmChill(0.24 * bump(t, T.ph3n3 + W8.n3wo + 0.2, T.ph3n3 + W8.n3you + 0.1, 1.0, 1.0), 'grey');
        /* "to open when you choose, and to close when you choose": the gold rises on him, and settles */
        auraAt(0.36 * bump(t, T.ph3n4 + W8.n4to, T.ph3n4 + SECS['ph3n4'] + 1.2, 1.6, 2.0), t);
      },
      end() { filmChill(0); auraAt(0, 0); handsFilm(0); }
    };

    /* ---------------------------------------------------------------- THE FOUR ENDINGS, AND THE CLOSE (§4.5, §4.6)
       Each ending is his eyes from where he kneels before his teacher, with one stretch of its own somewhere else on
       the ground (the mats; the edge of the turf until dusk; the people who wait; the middle of an emptied ground), and
       each comes back to that carpet for the close all four share. Pictures only: the cues are below the build. */
    const lensAt = (t, L) => { let fP = L[0][1], fD = L[0][2]; for (let i = 0; i < L.length - 1; i++) if (t >= L[i][0]) { const k = smo(sgk(t, L[i][0], L[i + 1][0])); fP = lp(L[i][1], L[i + 1][1], k); fD = lp(L[i][2], L[i + 1][2], k); } return [fP, fD]; };
    const yawMix = (a, b, k) => a + angTo(a, b) * k;                          // from heading a to heading b the short way, by k (angTo: the signed short turn)
    const phoFace = () => faceAt('pho', cast.pho, 'Sit_to_Stand_Transition_M', 0.16);
    /* WHERE HIS FACE IS WHILE HE TALKS: his talking take leans him forward and sets his head a hand lower than his rest
       does (from 1.3 m, in a narrow lens, his face fell out of the foot of the picture: photographed on "Tomorrow we
       begin."). A look still never rides a living head (v25.5), so the take's own MEAN place is measured once, and the
       look glides between the two places by how much he is talking (`speaks` answers it: a smooth function of the
       film's clock) */
    function phoTalkFace() {
      const P = cast.pho;
      if (!FL.faces.phoTalk && P.ready && P.acts[P.talkTake]) { const d = P.acts[P.talkTake].getClip().duration, s = [0, 0, 0]; let n = 0;
        for (let i = 0; i < 12; i++) { pose(P, P.talkTake, (i + 0.5) / 12 * d, false); const h = headOf(P, null); if (h) { s[0] += h[0]; s[1] += h[1] + 0.06; s[2] += h[2]; n++; } }
        if (n) FL.faces.phoTalk = [s[0] / n, s[1] / n, s[2] / n]; }
      return FL.faces.phoTalk || phoFace();
    }
    const phoF = (k = 0) => (k > 0.001 ? lp3(phoFace(), phoTalkFace(), c01(k)) : phoFace());
    /* his eyes on Grandmaster Pho from an eye: the heading, and the tilt that holds the face well at this lens (k: how
       much he is talking) */
    function toPho(eye, fP, fD, k = 0) { const F = phoF(k); return [aimOf(eye, F)[0], faceTilt(eye, F, fP, fD)]; }
    /* HE BOWS (his eyes): forward and down over his knees with his hands joined, and up again; u from 0 to 1 */
    function bowEyes(eye, ya, p0, u, fP, fD) {
      const k = Math.sin(Math.PI * smo(c01(u))), fx = -Math.sin(ya), fz = -Math.cos(ya);
      eyes([eye[0] + fx * 0.24 * k, eye[1] - 0.3 * k, eye[2] + fz * 0.24 * k], ya, lp(p0, -1.2, k), fP, fD);
      handsFilm(c01(Math.min(u / 0.14, (1 - u) / 0.16)), 0);
    }
    /* A THING CARRIED IN A FILM, in the hands' own pass, his hands under the frame's foot (filmBai's way, for anything):
       `at` is its place in that pass's frame, `rot` its turn there */
    const _fhq = new THREE.Quaternion(), _fhe = new THREE.Euler(), _fhv = new THREE.Vector3();
    function filmCarry(obj, holder, on, at, rot) {
      const A = FL.api; if (!A || !A.armR) return;
      const rh = A.rightHand && A.rightHand();
      if (!on) { if (obj.parent === A.armR) { holder.add(obj); if (rh) rh.visible = true; if (A.handsRoot) A.handsRoot.visible = false; } return; }
      if (obj.parent !== A.armR) A.armR.add(obj);
      if (A.handsRoot) A.handsRoot.visible = true;
      A.armR.visible = true; if (rh) rh.visible = false;
      _fhq.copy(A.armR.quaternion).invert();
      obj.position.copy(_fhv.set(at[0], at[1], at[2]).sub(A.armR.position).applyQuaternion(_fhq));
      obj.quaternion.copy(_fhq).multiply(_bqe.setFromEuler(_fhe.set(rot[0], rot[1], rot[2], 'YXZ')));
    }
    const _bqe = new THREE.Quaternion();
    /* where his hand lets a handful of petals go: his own take's hand at its throw, measured once */
    function phoThrow() { const Ph = cast.pho; if (!FL.throwPho && Ph.ready) { const v = handsAt(Ph, 'Sit_Cheer_with_Left_Hand', 1.32, new THREE.Vector3(), 'R'); if (v) { Ph.group.localToWorld(v); FL.throwPho = [v.x, v.y + 0.08, v.z]; } } return FL.throwPho; }

    const EKN = (() => { const [x, z] = benchAt(0.46, 1.3); return [x, KNEEL.y, z]; })();              // his eye, knelt nearer: where two pairs of hands meet on one bowl
    /* (v26.2 debug: the low table is smaller and a little to the right, clear of his foot, of the young man's knee and of
       the lime pole (b_world2.js TB); the bai sri is set on its front left, where nothing else stands, and the woman
       stands at its right) */
    const TABLE_BAI = (() => { const [x, z] = benchAt(1.03, 0.8); return [x, 0.38, z]; })();           // where his bai sri is set down at the last: the low table at the old man's right hand
    const AUNT_TABLE = (() => { const [x, z] = benchAt(1.95, 1.1); return { x, z, ry: faceTo(x, z, TABLE_BAI[0], TABLE_BAI[2]) }; })();
    /* each ending's light at the close: the look it arrives in; what OPEN widens it to; the look it is left in */
    const END_LOOK = { A: ['DAWN', 'OPENED', 'DAWN'], B: ['DUSK', 'DUSKOPEN', 'DUSK'], C: ['DAWN', 'OPENED', 'DAWN'], D: ['SHUT', 'OPENED', 'DAWN'] };
    const shadeOf = (name) => (name === 'OPENED' || name === 'SHUT' ? 'DAWN' : name === 'DUSKOPEN' ? 'DUSK' : name);
    /* THOSE WHO WAIT CARRY WHAT THEY BROUGHT: a small bai sri on its tray, in both hands at the waist (a hand's width
       under the elbow's height, measured from that body's own shoulder), the hands solved onto the tray's foot. Called
       after the body's take is posed, every frame it is seen */
    const _wc = new THREE.Vector3();
    function waitCarry(i) {
      const P = cast.wait[i], b = waitBai[i], A = P.ready && P.group.visible ? armsOf(P) : null;
      if (!A || !A.L || !A.R) { b.visible = false; return; }
      const g = P.group, ry = g.rotation.y, fx = Math.sin(ry), fz = Math.cos(ry);
      g.updateWorldMatrix(true, true); A.L.up.getWorldPosition(_wc);
      const c = [g.position.x + fx * 0.29, _wc.y - 0.345, g.position.z + fz * 0.29];
      b.position.set(c[0], c[1], c[2]); b.rotation.y = ry + i * 1.3; b.visible = true;
      handsTo(P, trayGrip(c, WAIT_TRAY.r, [g.position.x, g.position.z]), 1);
    }
    /* the world as play left it at the decision: the morning of day two, Grandmaster Pho on his bench, his bai sri on the
       carpet beside him; and everything an ending may stand, put away */
    function endStage() {
      lit('DAWN', 'two'); mistK = 0.6; dayCast(false);
      for (const P of [cast.pho, cast.aunt]) { put(P, P.home.x, P.home.z, P.home.ry); if (P.ready) P.group.visible = true; }
      put(cast.ton, TON_DAWN.x, TON_DAWN.z, faceTo(TON_DAWN.x, TON_DAWN.z, KNEEL2.x, KNEEL2.z)); if (cast.ton.ready) cast.ton.group.visible = true;
      for (const P of cast.wait) { if (P.ready) P.group.visible = false; put(P, P.home.x, P.home.z, P.home.ry); }
      for (const b of waitBai) b.visible = false;
      for (const P of [cast.ym, cast.goA, cast.goB]) if (P.ready) P.group.visible = false;
      matsG.visible = false; rolled.own.visible = false; ymBai.visible = false;
      for (const g of rolled.ton.concat(rolled.rolls, [rolled.carry])) g.visible = false;
      baiPut(myBai, BESIDE.x, 0.012, BESIDE.z, 0.6); myBai.visible = true;
      auraAt(0, 0); FL.litE = -1; FL.litA = -1; FL.goldMin = 0; FL.shot = '';
      if (kit && kit.hush) kit.hush(0, { secs: 0 });
      castSolid();
    }
    function endTidy() {
      handsFilm(0); handStill(0); filmChill(0); filmBai(false); filmCarry(handMat, handMatHolder, false); youGlowAt(0, 0, null, null);
      myArmsAt(null, null, 0, null, 0, 0, 0);
      for (const P of cast.wait) if (P.ready) P.group.visible = false;
      for (const b of waitBai) b.visible = false;
      matsG.visible = false; auraAt(0, 0); filmBurstsEnd();
      if (kit && kit.hush) kit.hush(0, { secs: 0 });
      if (kit && kit.captions) kit.captions(null);
    }

    /* THE CLOSE'S LIGHT: the ending's own look; widened by e (the breath's level while it is played, eased shut after);
       and for the one ending that arrives closed, let up into the morning afterwards (a) */
    function closeLight(k, e, a, t) {
      const [base, opn, aft] = END_LOOK[k];
      if (Math.abs(e - FL.litE) > 0.004 || Math.abs(a - FL.litA) > 0.004) { FL.litE = e; FL.litA = a;
        let d = e > 0.004 ? dayBlend(PRESETS[base], PRESETS[opn], e) : PRESETS[base];
        if (a > 0.004) d = dayBlend(d, PRESETS[aft], a);
        if (kit) kit.daylight(d, 0);
        phoLook.level.value = lp(lp(PHO_LEVEL[base], PHO_LEVEL.OPENED, e), PHO_LEVEL[aft], a); mistK = base === 'DUSK' ? 0 : 0.6 - 0.4 * e; }
      auraAt(Math.max(e * 0.95, FL.goldMin || 0), t);
    }
    function closeStage(k) {
      const [base] = END_LOOK[k];
      endTidy();
      lit(base, 'two'); paintShade(shadeOf(base)); mistK = base === 'DUSK' ? 0 : 0.6; dayCast(false);
      for (const P of [cast.pho, cast.aunt]) { put(P, P.home.x, P.home.z, P.home.ry); if (P.ready) P.group.visible = true; }
      put(cast.ton, TON_DAWN.x, TON_DAWN.z, faceTo(TON_DAWN.x, TON_DAWN.z, KNEEL2.x, KNEEL2.z));
      baiPut(myBai, BESIDE.x, 0.012, BESIDE.z, 0.6); myBai.visible = true;
      FL.litE = -1; FL.litA = -1; FL.goldMin = 0; FL.tabled = false;
      castSolid();
    }
    /* (the bai sri raised before his eyes: how far before his eye, its foot how far below it, and where the look rests on
       it, over its foot. Raised as his photograph 7 holds one: the bowl at his eyes' height, seen from a little below, so
       his hands are seen on its sides under the ring of marigolds; held at his chest, looked down on, the marigolds hid
       both hands: photographed, v26.10's third build) */
    const HOLD = { d: 0.48, y: 0.12, mid: 0.24 };
    function closeFrame(tc, k, api) {
      const T = CLOSE, Ph = cast.pho, Au = cast.aunt;
      if (FL.shot !== 'close') { FL.shot = 'close'; closeStage(k); }
      /* THE EYE: from where he knelt, forward on his knees to where four hands can meet on one bowl */
      const kf = smo(sgk(tc, T.take + 1.3, T.take + 3.3)), eye = lp3(EK, EKN, kf);
      eye[1] += 0.016 * Math.abs(Math.sin(kf * Math.PI * 3));
      const F = phoFace(), yF = aimOf(eye, F)[0], fx = -Math.sin(yF), fz = -Math.cos(yF);
      /* THE LENS */
      /* (what this stretch must hold is TALL, not wide: his face over his two hands on the bowl, from 1.3 m. So a desktop is
         given nearly a phone's lens: at 50 it cut his brow at the top and his hands at the foot: photographed. And at 33
         and 30 his face from 1.3 m was brow to lip) */
      const [fP, fD] = lensAt(tc, [[0, 58, 46], [T.take + 3.3, 66, 64], [T.glow, 66, 64], [T.q3z1 + SECS['q3z1'], 60, 58], [T.give + 3.2, 60, 58], [T.ph3z2, 44, 40],
                                   [T.ph3z2 + SECS['ph3z2'] + 0.9, 40, 36], [T.q3K1 + 3.5, 48, 44], [T.black, 66, 62]]);
      /* THE LIGHT */
      /* (v26.8: the close's breath is no longer played, but shown (docs/V26.8-E4C3-NOTES.md M): his own light comes up on
         him and his bai sri while his hands shake, the world opening a little round him, and lets go as he says he shut
         the door himself; the after-light comes as it goes) */
      const kG = bump(tc, T.glow + 0.2, T.q3z1 + 2.0, 1.4, 1.6), e = 0.3 * kG;
      FL.goldMin = 0.24 * smo(sgk(tc, T.ph3z2, T.q3K1 + 2.5));
      closeLight(k, smo(c01(e / 0.9)), END_LOOK[k][0] !== END_LOOK[k][2] ? smo(sgk(tc, T.q3z1 + 0.3, T.q3z1 + 2.6)) : 0, tc);
      /* HIS BAI SRI: on the carpet beside him; taken up and raised before him in both hands; shaking as it rises in
         him; given into his teacher's hands; and, behind a bow of his head, on the table */
      /* (v26.8 row M: raised before his teacher at arm's length for the old man's hands to meet it (0.6 m out); drawn in
         and raised before his eyes, while his light rises and his hands hold it shaking (HOLD: where his arms hold a thing with their
         elbows bent, his arms being the engine's, 0.27 m to the elbow and 0.25 on to the wrist: at 0.6 they stood straight
         and short of it, measured), and held out again to be taken. Taken up from the carpet after his eyes have left it
         for his teacher's face, so the lift is never seen without the hands that make it) */
      /* (drawn in at his chest's height first, below the frame, then raised; lowered straight down before him again, his
         hands on it all the way (at no point out of his arms' reach: the joint scan read the wrists 57 degrees over as one
         move carried it out and down at once), let go below the frame, and only then held out for his teacher) */
      const kNear = bump(tc, T.glow - 1.6, T.give + 0.6, 1.0, 0.7), kUp = bump(tc, T.glow - 0.5, T.give - 0.2, 1.5, 0.9);
      const hd = lp(0.6, HOLD.d, kNear), hy = lp(0.42, HOLD.y, kUp);
      const H = [eye[0] + fx * hd, eye[1] - hy + 0.004 * Math.sin(tc * 1.3), eye[2] + fz * hd];
      const kl = smo(sgk(tc, T.take + 0.9, T.take + 2.7)), kg = smo(sgk(tc, T.give + 0.9, T.give + 2.0));
      const G1 = [PHO_AT[0] + Math.sin(BENCH.ry) * 0.5, 0.72, PHO_AT[1] + Math.cos(BENCH.ry) * 0.5];
      const tabled = tc >= T.give + 2.3;
      let bc = tabled ? TABLE_BAI.slice() : lp3(lp3([BESIDE.x, 0.012, BESIDE.z], H, kl), G1, kg);
      if (!tabled) { bc[1] += 0.1 * Math.sin(Math.PI * kl) * (1 - kl);                                 // (lifted in an arc, not dragged)
        const ks = smo(sgk(tc, T.petals + 2.2, T.glow + 0.4)) * (1 - smo(sgk(tc, T.q3z1, T.q3z1 + 1.6)));
        bc[0] += ks * 0.0045 * Math.sin(tc * 61); bc[1] += ks * 0.004 * Math.sin(tc * 53 + 1); bc[2] += ks * 0.0045 * Math.sin(tc * 47 + 2); }
      baiPut(myBai, bc[0], bc[1], bc[2], 0.6);
      youGlowAt(kG, tc, tabled ? null : bc, FL.api);
      /* HIS OWN HANDS ON IT (v26.8 row M: c_zfx.js myArmsAt): on it below the frame's foot before he draws it in, held
         while it shakes in his own light, and let go below the frame once it is held out to his teacher. Under the
         close's first black they are drawn once behind his eyes (`held`), so their shading is built where nothing is seen */
      const kMy = bump(tc, T.glow - 0.9, T.give + 0.1, 0.5, 0.5);
      myArmsAt(api || FL.api, eye, yF, tabled ? null : bc, kMy, kG, tc, tc < 0.8, kUp);
      /* GRANDMASTER PHO: he speaks; both his hands on the bowl; a handful of petals; his hands on it again to take it */
      phoFace(); phoTalkFace();
      let kTalk = 0;
      const kOn = bump(tc, T.hands, T.petals + 0.45, 1.3, 0.5), kTake = bump(tc, T.give + 0.2, T.give + 2.25, 0.9, 0.2);
      const kc = bump(tc, T.petals + 0.3, T.petals + 3.2, 0.45, 0.7), kh = Math.max(kOn, kTake);
      if (kh > 0.001) pose(Ph, 'Sit_to_Stand_Transition_M', 0.16, false, PHO_ON.take, kh, PHO_ON.from + 0.6 + 0.2 * Math.sin(tc * 0.8));
      else if (kc > 0.001) pose(Ph, 'Sit_to_Stand_Transition_M', 0.16, false, 'Sit_Cheer_with_Left_Hand', kc, 0.15 + Math.max(0, tc - T.petals - 0.3) * 0.9);
      else kTalk = speaks(Ph, tc, T, ['ph3z0', 'ph3z1']);                       // ("Tomorrow we begin." is said quite still: his rest, and his eyes)
      if (kh > 0.001 && !tabled) handsTo(Ph, baiGrip(bc, BAI.s, [Ph.group.position.x, Ph.group.position.z], 'on'), kh);
      /* (his eyes: on the one who kneels; on the bowl while his hands are on it) */
      const kpb = bump(tc, T.hands + 0.2, T.hands + 2.4, 0.7, 0.8);
      lookNow(Ph, 'lens', 1 - kpb, 0.5, 0); if (kpb > 0) lookNow(Ph, [bc[0], bc[1] + 0.3, bc[2]], kpb, 0.5, 0);
      const pt = phoThrow();
      filmBurst('close', tc, T.petals + 1.6, pt, [eye[0] + fx * 0.42, eye[2] + fz * 0.42], { r: 0.42, up: 1.15, seed: 5521, s: 0.03 });
      /* the woman at his bench: she takes it from him and sets it on the table (seen as her hands leave it) */
      if (tabled && !FL.tabled) { FL.tabled = true; put(Au, AUNT_TABLE.x, AUNT_TABLE.z, AUNT_TABLE.ry); castSolid(); }
      if (tabled) pose(Au, 'give', lp(3.7, 5.7, smo(sgk(tc, T.give + 2.4, T.give + 4.4))), false, 'Idle_3', smo(sgk(tc, T.give + 4.2, T.give + 5.4)), 2 + tc);
      else pose(Au, 'Idle_3', 2 + tc, true);
      /* HIS EYES: on his bai sri beside him; up to his teacher as he raises it; bowed a little while the old man's
         hands lie on it; to the table when it is set there; on the old man's face for "Tomorrow we begin."; and the
         whole of it at the last */
      const [yB, pB] = aimOf(eye, [BESIDE.x, 0.3, BESIDE.z]), kB = 1 - smo(sgk(tc, T.take + 0.4, T.take + 2.0));
      const pWide = Math.atan2(0.05, 1.2), pFace = faceTilt(eye, phoF(kTalk), fP, fD), kFace = smo(sgk(tc, T.give + 3.4, T.ph3z2)) * (1 - smo(sgk(tc, T.q3K1 + 3.5, T.black - 1)));
      const kBow = bump(tc, T.hands + 0.9, T.hands + 2.8, 0.8, 0.9) * 0.05, [yTb, pTb] = aimOf(eye, [TABLE_BAI[0], TABLE_BAI[1] + 0.34, TABLE_BAI[2]]);
      const kTb = tc >= T.give + 2.3 ? 1 - smo(sgk(tc, T.give + 3.5, T.ph3z2 - 0.1)) : 0;
      /* (v26.8 row M: while his own light rises in him and his hands shake, his eyes go with the bai sri he raises before
         them, his two hands on its bowl; and back to his teacher as he lowers it and the old man reaches to take it. The
         look rests on the bai sri where it is held (HOLD), never on the bowl as it shakes) */
      const kHold = bump(tc, T.glow - 0.4, T.give + 0.9, 1.6, 1.2);
      const pHold = aimOf(eye, [eye[0] + fx * HOLD.d, eye[1] - HOLD.y + HOLD.mid, eye[2] + fz * HOLD.d])[1];
      const ya = yawMix(yawMix(yF, yB, kB), yTb, kTb), pi = lp(lp(lp(lp(pWide, pFace, kFace) - kBow, pHold, kHold), pB, kB), pTb, kTb);
      eyes(eye, ya, pi, fP, fD);
    }

    FILMS.A = {
      begin(api) { if (api.handsRoot) api.handsRoot.visible = false; FL.wai = false; FL.bai = false; endStage(); },
      frame(t, api) {
        const T = ENDT.A, Ph = cast.pho, Tn = cast.ton;
        if (t >= T.close) { closeFrame(t - T.close, 'A', api); return; }
        const [o60, w60, w40, yng] = cast.wait;
        if (t < T.mats) {
          if (FL.shot !== 'a1') { FL.shot = 'a1';
            /* Ton, behind him, with an armful of rolled mats; by the west tents the ground is being cleared */
            const [tx, tz] = benchAt(-1.7, 5.1); put(Tn, tx, tz, faceTo(tx, tz, KNEEL2.x, KNEEL2.z)); matsG.visible = true; castSolid(); }      // (3.5 m off: at 1.9 m a kneeling eye saw two mats and no face)
          phoFace(); phoTalkFace(); const kTalk = speaks(Ph, t, T, ['ph3A1', 'ph3A2']); lookNow(Ph, 'lens', 1, 0.5, 0);
          pose(cast.aunt, 'Idle_3', 2 + t, true);
          pose(Tn, 'give', 2.6 + 0.12 * Math.sin(t * 0.8), false); lookNow(Tn, 'lens', 1, 0.7);
          /* (v26.2 debug: ONE mat on his arms. Two, lying on his forearms as they now do and not through them, stood 0.44 m
             tall at his chest and hid his face from the kneeling eye: photographed. The second is not drawn) */
          matOnArms(rolled.ton[0], Tn, 0); rolled.ton[1].visible = false;
          /* the yes; the long moment he is looked at; what he says yes to; the bow; and the turn to Ton behind him */
          const [fP, fD] = lensAt(t, [[0, 44, 33], [T.q3A0 + SECS['q3A0'], 40, 30], [T.ph3A1, 24, 17.5], [T.q3A1, 27, 20], [T.q3A1 + SECS['q3A1'], 23, 17], [T.ph3A2 + SECS['ph3A2'], 34, 25], [T.bow, 46, 34]]);
          const [yF, pT] = toPho(EK, fP, fD, kTalk);
          if (t < T.bow) eyes(EK, yF, pT, fP, fD);
          else if (t < T.ton) bowEyes(EK, yF, pT, (t - T.bow) / (T.ton - T.bow), 46, 34);
          else { handsFilm(0); const kT = smo(sgk(t, T.ton, T.ton + 1.5)), [yN, pN] = aimOf(EK, [Tn.group.position.x, 1.02, Tn.group.position.z]);
            eyes(EK, yawMix(yF, yN, kT), lp(pT, pN, kT), lp(46, 50, kT), lp(34, 36, kT)); }
        } else {
          if (FL.shot !== 'a2') { FL.shot = 'a2'; handsFilm(0);
            /* THE MATS: Ton has set his down and stands by the stack; two kneel and roll, one carries; he walks up with
               one in his arms */
            put(Tn, MATS_AT.x - 1.35, MATS_AT.z + 0.55, faceTo(MATS_AT.x - 1.35, MATS_AT.z + 0.55, A_W1[0], A_W1[1]));
            for (const g of rolled.ton) g.visible = false;
            put(w60, -7.55, -0.35, -1.9); put(w40, -8.15, 1.25, -1.35); put(yng, -5.5, 0.15, faceTo(-5.5, 0.15, MATS_AT.x, MATS_AT.z)); put(o60, -8.9, 3.3, 1.2);
            for (const P of cast.wait) if (P.ready) P.group.visible = true;
            castSolid(); }
          /* those who work: two on their knees with their hands on a mat, rolling it; one walking it to the stack; the
             old man watching, his hands behind him */
          [w60, w40].forEach((P, i) => { pose(P, 'prostrate', 2.35 + 0.22 * Math.sin(t * 1.5 + i * 2), false);
            const ry = P.group.rotation.y, g = rolled.rolls[i]; g.position.set(P.group.position.x + Math.sin(ry) * 0.62, 0, P.group.position.z + Math.cos(ry) * 0.62); g.rotation.set(0, ry, 0); g.visible = true; });
          /* (the young man carries one before him in both hands: his body has no take that holds a thing out, so the
             mat is the truth and his hands are solved under its two ends. Posed by a take he does not have, he stood with
             his arms down and the mat hung in the air beside him: photographed on a desktop) */
          pose(yng, 'Idle_3', 1 + t, true);
          { const g = yng.group, ry = g.rotation.y, fx = Math.sin(ry), fz = Math.cos(ry), c = [g.position.x + fx * 0.3, 1.0, g.position.z + fz * 0.3], m = rolled.carry;
            /* (v26.2 debug: the mat's foot at his hands' bones had his palms and fingers inside its lower half, measured in the
               film by tools/probes/clipscan.mjs: it rests ON his palms now, a palm's thickness above his wrists' bones) */
            m.position.set(c[0], c[1] - 0.064 + 0.045, c[2]); m.rotation.set(0, ry, 0); m.visible = true;
            for (const [sd, sg] of [['L', 1], ['R', -1]]) handTo(yng, sd, [c[0] + fz * sg * 0.3, c[1] - 0.064, c[2] - fx * sg * 0.3], [fx, 0.1, fz], [0, 1, 0], 1, { out: 0.2, down: 0.4 }); }
          pose(o60, 'Idle_3', 1 + t, true);
          pose(Tn, 'Idle_3', 3 + t, true); lookNow(Tn, 'lens', 1, 0.7);
          pose(Ph, 'Sit_to_Stand_Transition_M', 0.16 + 0.13 * Math.sin(t * 0.7), false); pose(cast.aunt, 'Idle_3', 2 + t, true);
          /* HE WALKS, a mat in his arms: across the turf to the stack, his eyes on those who roll and then on the stack */
          const kw = smo(sgk(t, T.mats + 0.5, T.q3A3 + 0.5)), ex = lp(A_W0[0], A_W1[0], kw), ez = lp(A_W0[1], A_W1[1], kw), dist = 3.62 * kw;
          const eye = [ex, EYE + 0.02 * Math.sin(dist * 2 * Math.PI / 0.72) * Math.min(1, 6 * kw * (1 - kw)), ez], ts = t - T.q3A3;
          const [yR, pR] = aimOf(eye, [-7.7, 0.5, 0.3]), [yS, pS] = aimOf(eye, [MATS_AT.x, 0.25, MATS_AT.z]), [yT, pT] = aimOf(eye, [Tn.group.position.x, 1.5, Tn.group.position.z]);
          const [yP, pP] = aimOf(eye, phoFace());
          const k1 = smo(sgk(t, T.q3A2 + 2.6, T.q3A3 - 0.2)), k2 = smo(sgk(ts, 0.1, 1.0)) * (1 - smo(sgk(ts, 1.5, 2.3)));
          const ya0 = yawMix(yawMix(yR, yS, k1), yT, k2), pi0 = lp(lp(lp(pR, -0.12, 0.6), pS, k1 * smo(sgk(ts, 1.5, 2.4))), pT, k2);
          /* (his eyes come UP off the stack first, and then go round to the far bench: turned and lifted on one ease, the
             middle of the move was a frame of turf) */
          const kUp = smo(sgk(ts, 3.3, 4.5)), kRound = smo(sgk(ts, 3.9, 6.3)), kz = smo(sgk(ts, 5.6, 8.8));
          eyes(eye, yawMix(ya0, yP, kRound), lp(lp(pi0, 0.02, kUp), pP, kRound), lp(60, 13, kz), lp(46, 9.5, kz));
          /* his own mat: under his arm as he walks; lowered onto the stack while his eyes are on Ton; and there, on the
             top of it, when they drop */
          const kdn = smo(sgk(ts, 0.3, 1.2));
          /* (a roll under his arm, its end pointing ahead of him: held across his body, a phone's frame saw a quarter of
             its length, a flat band of stripes) */
          if (ts < 1.25) filmCarry(handMat, handMatHolder, true, [0.07, lp(-0.3, -0.72, kdn), -0.62], [0.1, 1.45, 0]);
          else { filmCarry(handMat, handMatHolder, false); rolled.own.visible = true; }
        }
      },
      end() { endTidy(); }
    };
    const A_W0 = [-1.7, 2.95], A_W1 = [-5.3, 2.55];

    /* B · CHALLENGE THE PATH: he is asked to tell again how he came there; he sits apart until the light goes; he comes back */
    const B_EDGE = (() => { const [x, z] = benchAt(-4.6, 7.2); return [x, 0.86, z]; })();              // where he sits apart: before the bench and well to its side, the old man seen between the canopy's two front poles
    FILMS.B = {
      begin(api) { if (api.handsRoot) api.handsRoot.visible = false; FL.wai = false; FL.bai = false; endStage(); },
      frame(t, api) {
        const T = ENDT.B, Ph = cast.pho;
        if (t >= T.close) { closeFrame(t - T.close, 'B', api); return; }
        const [o60, w60, w40] = cast.wait;
        if (t < T.edge) {
          phoFace(); phoTalkFace(); const kTalk = speaks(Ph, t, T, ['ph3B1', 'ph3B2', 'ph3B3']); lookNow(Ph, 'lens', 1, 0.5, 0); pose(cast.aunt, 'Idle_3', 2 + t, true);
          const [fP, fD] = lensAt(t, [[0, 44, 33], [T.q3B0 + SECS['q3B0'], 38, 28], [T.ph3B1, 29, 21], [T.ph3B2 + SECS['ph3B2'], 33, 24], [T.q3B1 + 1, 50, 38], [T.q3B1 + 13, 50, 38],
                                      [T.q3B1 + SECS['q3B1'], 31, 23], [T.ph3B3 + 1.2, 22, 16], [T.q3B2, 23, 17], [T.edge, 28, 20]]);
          const [yF, pT] = toPho(EK, fP, fD, kTalk);
          /* "Tell me again how you came to this mat. Slowly.": his eyes go down to it, and come up one step with each
             thing he names, to the old man's face at the last */
          const ts = t - T.q3B1, at = [0, 2.2, 3.5, 6.2, 10.2, 12.8, 15.6], p0 = -0.96, kd = smo(sgk(ts, -1.0, 0.2));
          let pi = lp(pT, p0, kd);
          for (let i = 1; i < at.length; i++) pi += (pT - p0) / (at.length - 1) * smo(sgk(ts, at[i] - 0.2, at[i] + 0.9));
          eyes(EK, yF, pi, fP, fD);
        } else if (t < T.dusk) {
          if (FL.shot !== 'b2') { FL.shot = 'b2';
            /* the afternoon, from where he sits apart: one kneels to him, two wait */
            lit('AFTERNOON', 'two'); mistK = 0; myBai.visible = true;
            if (cast.ton.ready) cast.ton.group.visible = false;                 // (Ton has gone to help clear the ground: where the morning stood him he filled this picture, his back to it: photographed)
            put(o60, KNEEL2.x, KNEEL2.z, faceTo(KNEEL2.x, KNEEL2.z, PHO_AT[0], PHO_AT[1])); put(w60, cast.wait[1].home.x, cast.wait[1].home.z, cast.wait[1].home.ry); put(w40, cast.wait[2].home.x, cast.wait[2].home.z, cast.wait[2].home.ry);
            for (const P of [o60, w60, w40]) if (P.ready) P.group.visible = true;
            castSolid(); }
          const u = t - T.edge;
          pose(o60, 'seiza', 1.2 + 0.3 * Math.sin(u * 0.6), false); pose(w60, 'Idle_3', 1 + u, true); pose(w40, 'Idle_3', 4 + u, true); pose(cast.aunt, 'Idle_3', 2 + t, true);
          waitCarry(1); waitCarry(2);
          /* he talks with the one who kneels, and never once looks this way */
          { const A2 = Ph.ready && Ph.acts[Ph.talkTake], d = A2 ? A2.getClip().duration : 1; pose(Ph, Ph.talkTake, (1.3 + u) % d, false); }
          lookNow(Ph, [KNEEL2.x, 0.95, KNEEL2.z], 1, 0.5, 0);
          const k = smo(sgk(t, T.edge, T.dusk)), F = phoFace();
          /* (both of them WHOLE: the old man's far shoulder and the kneeler's back are named, not only their middles: a
             fit is given the extent of what it must hold, v25.5. Named by their middles, each was cut by an edge:
             photographed) */
          const [s0x, s0z] = benchAt(-0.1, 0.1), [k0x, k0z] = benchAt(0.46, 2.85);
          fitShot(B_EDGE, [lp(F[0], KNEEL2.x, 0.45), 0.95, lp(F[2], KNEEL2.z, 0.45)], lp(31, 28, k), lp(22, 19.5, k), [[F[0], F[1] + 0.18, F[2]], [s0x, 1.2, s0z], [k0x, 0.7, k0z], [KNEEL2.x, 0.08, KNEEL2.z]]);
        } else if (t < T.back) {
          if (FL.shot !== 'b3') { FL.shot = 'b3';
            /* dusk: they have gone; the bulbs along the eaves are on; he sits there still */
            lit('DUSK', 'two'); for (const P of cast.wait) if (P.ready) P.group.visible = false; for (const b of waitBai) b.visible = false; castSolid(); }
          pose(Ph, 'Sit_to_Stand_Transition_M', 0.16 + 0.13 * Math.sin(t * 0.7), false); pose(cast.aunt, 'Idle_3', 2 + t, true);
          const k = smo(sgk(t, T.dusk, T.back)), F = phoFace();
          shot(B_EDGE, [F[0] - 0.3, lp(1.75, 1.5, k), F[2]], lp(46, 40, k), lp(34, 29, k));
        } else {
          if (FL.shot !== 'b4') { FL.shot = 'b4'; }
          phoFace(); phoTalkFace(); const kTalk = speaks(Ph, t, T, ['ph3B4']); lookNow(Ph, 'lens', 1, 0.5, 0); pose(cast.aunt, 'Idle_3', 2 + t, true);
          const [fP, fD] = lensAt(t, [[T.back, 46, 34], [T.q3B4 + SECS['q3B4'], 36, 27], [T.ph3B4 + SECS['ph3B4'], 28, 20], [T.close, 32, 24]]);
          const [yF, pT] = toPho(EK, fP, fD, kTalk); eyes(EK, yF, pT, fP, fD);
        }
      },
      end() { endTidy(); }
    };

    /* C · ASK WHY: he is given a better question, and shown who is waiting */
    /* WHERE THEY WAIT, for this ending: at the far edge of the second carpet, 4 m to his right as he kneels and a little
       ahead of him (he turns his head, and does not look behind him), in a loose row ACROSS his line of sight, so a
       phone's frame holds all four. (Stood where the morning's line stood, the first of them was two metres off and
       filled the picture, and hid the other three: photographed) */
    /* (and clear of the canopy's front left pole, which stood between the second of them and the third when they waited
       at the carpet's side: photographed. From where he kneels the pole is five degrees outside this row's end) */
    const WAIT_C = (() => { const [cx, cz] = benchAt(-3.4, 3.0), d = Math.hypot(cx - KNEEL2.x, cz - KNEEL2.z), ux = (cx - KNEEL2.x) / d, uz = (cz - KNEEL2.z) / d, dep = [0.14, -0.1, 0.18, -0.05];
      return [-0.84, -0.28, 0.28, 0.84].map((s, i) => [cx - uz * s + ux * dep[i], cz + ux * s + uz * dep[i]]); })();     // (0.56 m apart: at 0.67 a phone's widest lens cut the first of them down his middle: photographed)
    FILMS.C = {
      begin(api) { if (api.handsRoot) api.handsRoot.visible = false; FL.wai = false; FL.bai = false; endStage(); },
      frame(t, api) {
        const T = ENDT.C, Ph = cast.pho, Wt = cast.wait;
        if (t >= T.close) { closeFrame(t - T.close, 'C', api); return; }
        if (FL.shot !== 'c1') { FL.shot = 'c1';
          Wt.forEach((P, i) => { put(P, WAIT_C[i][0], WAIT_C[i][1], faceTo(WAIT_C[i][0], WAIT_C[i][1], PHO_AT[0], PHO_AT[1]) + [0.1, -0.12, 0.06, -0.08][i]); if (P.ready) P.group.visible = true; });
          if (cast.ton.ready) cast.ton.group.visible = false; castSolid(); }
        const mid = [(WAIT_C[1][0] + WAIT_C[2][0]) / 2, 1.0, (WAIT_C[1][1] + WAIT_C[2][1]) / 2];
        phoFace(); phoTalkFace(); const kTalk = speaks(Ph, t, T, ['ph3C1', 'ph3C2', 'ph3C3']); pose(cast.aunt, 'Idle_3', 2 + t, true);
        /* "For whom?": his own eyes go to them first */
        const kq = bump(t, T.ph3C2 + 1.6, T.backto + 0.6, 0.9, 1.0);
        lookNow(Ph, 'lens', 1 - kq, 0.5, 0); if (kq > 0) lookNow(Ph, mid, kq, 0.6, 0);
        /* those who wait: they stand, and look to the old man on his bench; the first of them meets his eye, and nods */
        Wt.forEach((P, i) => { pose(P, 'Idle_3', 1.5 + i * 2.3 + t, true); waitCarry(i); });
        const kn = bump(t, T.q3C1 + 2.2, T.q3C1 + 6.4, 0.9, 1.0);
        lookNow(Wt[0], 'lens', kn, 0.7, 0.02 + 0.06 * kn * Math.max(0, Math.sin((t - T.q3C1 - 3.2) * 2.4)));
        const kW = smo(sgk(t, T.turn, T.turn + 2.4)) * (1 - smo(sgk(t, T.backto, T.backto + 1.5)));
        const [fP, fD] = lensAt(t, [[0, 44, 33], [T.q3C0 + SECS['q3C0'], 38, 28], [T.ph3C1 + SECS['ph3C1'], 27, 20], [T.turn, 29, 21],
                                    [T.backto + 1.5, 32, 24], [T.ph3C3 + SECS['ph3C3'], 25, 18], [T.bow, 46, 34]]);
        const [yF, pT] = toPho(EK, fP, fD, kTalk);
        /* his head is turned: the four of them, whole, in one picture (a fit, for this screen); a slow drift along them
           as he says what he was shown */
        const pan = smo(sgk(t, T.turn + 2.0, T.q3C1 + SECS['q3C1'])), must = [];
        for (const [wx, wz] of WAIT_C) { must.push([wx, 1.72, wz]); must.push([wx, 0.05, wz]); }
        /* (and the row's two ends by their far SHOULDERS, not their middles: a fit is given the extent of what it holds, v25.5) */
        { const ex = WAIT_C[3][0] - WAIT_C[0][0], ez = WAIT_C[3][1] - WAIT_C[0][1], el = Math.hypot(ex, ez) || 1;
          must.push([WAIT_C[0][0] - ex / el * 0.32, 1.3, WAIT_C[0][1] - ez / el * 0.32]); must.push([WAIT_C[3][0] + ex / el * 0.32, 1.3, WAIT_C[3][1] + ez / el * 0.32]); }
        const Fw = fit(EK, [mid[0], 0.95, mid[2]], isNarrow() ? 50 : 34, must), [yW0, pW] = aimOf(EK, Fw.at), yW = yW0 + 0.03 * (pan - 0.5);
        if (t >= T.bow && t < T.q3C3) bowEyes(EK, yF, pT, (t - T.bow) / (T.q3C3 - T.bow), 46, 34);
        else { handsFilm(0); eyes(EK, yawMix(yF, yW, kW), lp(pT, pW, kW), lp(fP, Fw.fl, kW), lp(fD, Fw.fl, kW)); }
      },
      end() { endTidy(); }
    };

    /* D · ASK TO MAKE IT STOP: he is taught to close and stay closed; he sits in the quiet; the chanting comes, and
       nothing takes him */
    const D_SIT = [PLACE.x, KNEEL.y, PLACE.z];
    FILMS.D = {
      begin(api) { if (api.handsRoot) api.handsRoot.visible = false; FL.wai = false; FL.bai = false; endStage(); },
      frame(t, api) {
        const T = ENDT.D, Ph = cast.pho;
        if (t >= T.close) { closeFrame(t - T.close, 'D', api); return; }
        pose(cast.aunt, 'Idle_3', 2 + t, true);
        if (t < T.sit) {
          /* (his eyes close on "stay", and open on a plain world: the look changes behind them) */
          if (t >= T.shut + 1.15 && FL.shot !== 'd2') { FL.shot = 'd2'; lit('SHUT', 'two'); paintShade('DAWN'); mistK = 0; if (kit && kit.hush) kit.hush(0.85, { secs: 0.8 }); }
          phoFace(); phoTalkFace(); const kTalk = speaks(Ph, t, T, ['ph3D1', 'ph3D2', 'ph3D3']); lookNow(Ph, 'lens', 1, 0.5, 0);
          const [fP, fD] = lensAt(t, [[0, 44, 33], [T.q3D0 + SECS['q3D0'], 36, 27], [T.ph3D2 + SECS['ph3D2'], 28, 20], [T.shut, 25, 18], [T.shut + 1.15, 25, 18], [T.shut + 1.2, 48, 36], [T.sit, 44, 33]]);
          const [yF, pT] = toPho(EK, fP, fD, kTalk); eyes(EK, yF, pT, fP, fD);
        } else if (t < T.back) {
          if (FL.shot !== 'd3') { FL.shot = 'd3'; myBai.visible = false; if (cast.ton.ready) cast.ton.group.visible = false; castSolid(); }   // (Ton is clearing the ground: where the morning stood him, his back filled the far look at the bench: photographed)
          pose(Ph, 'Sit_to_Stand_Transition_M', 0.16 + 0.13 * Math.sin(t * 0.7), false);
          /* THE EMPTIED GROUND, from where he knelt yesterday: the tables, the pole, two people clearing up; then the
             chanting from across the fields, and his own hand, which is only his hand; then, far off, the old man */
          const ts = t - T.chant, [yN, pN] = aimOf(D_SIT, [1.2, 1.9, -9.5]), [yP, pP] = aimOf(D_SIT, phoFace());
          const kH = smo(sgk(ts, 0.9, 2.4)) * (1 - smo(sgk(t, T.q3D3 + 0.3, T.q3D3 + 2.2))), kP = smo(sgk(t, T.q3D3 + 0.6, T.q3D3 + 3.4)), kz = smo(sgk(t, T.q3D3 + 2.6, T.back - 0.6));
          const drift = 0.05 * Math.sin((t - T.sit) * 0.25);
          eyes(D_SIT, yawMix(yN + drift, yP, kP), lp(lp(pN, -0.52, kH), pP, kP), lp(62, 12.5, kz), lp(48, 9.5, kz));
          /* HIS OWN HAND, the one the player has had all game, at its own rest, lifted a little into his sight as his eyes
             go down to it: and it does not move. (Two other ways were photographed and refused: at its walking place the
             hand lay at the frame's foot under the chant's words; the engine's `reach` pose lifted clear of them was a
             limp hand hanging from a bent wrist, seen from the side it was never made to be seen from) */
          handStill(kH);
          if (ts >= 0.3 && !FL.once.has('chant')) { FL.once.add('chant');
            if (kit && kit.captions) kit.captions([1, 2, 3].map((n) => ({ at: CHANT.far[n - 1][0], end: CHANT.far[n - 1][1], text: W['cap' + n], sub: W['cap' + n + 'Sub'] }))); }
        } else {
          if (FL.shot !== 'd4') { FL.shot = 'd4'; handStill(0); if (api.handsRoot) api.handsRoot.visible = false; myBai.visible = true; if (kit && kit.captions) kit.captions(null); }
          phoFace(); phoTalkFace(); const kTalk = speaks(Ph, t, T, ['ph3D4']); lookNow(Ph, 'lens', 1, 0.5, 0);
          const [fP, fD] = lensAt(t, [[T.back, 46, 34], [T.q3D4 + SECS['q3D4'], 34, 25], [T.ph3D4 + SECS['ph3D4'], 27, 20], [T.close, 31, 23]]);
          const [yF, pT] = toPho(EK, fP, fD, kTalk); eyes(EK, yF, pT, fP, fD);
        }
      },
      end() { endTidy(); }
    };

    /* THE FILMS' OWN BEDS (M7): the ground's loops under each film, a pure function of the film's clock (the rest of a
       film's sound is its cues: z_tail.js). Each is a share of play's own level (BED), so a film that begins or ends on
       play's picture begins and ends on play's sound */
    function filmBeds(key, t) {
      let fest = 0, mus = 0, birds = 0, crick = 0, open = 0, shop = 0;
      if (key === 'open') { const T = OPENT, k4 = smo(sgk(t, T.o4 + 0.2, T.o4 + 1.8)), kf = smo(sgk(t, T.o4 + 1.8, T.o4 + 3.6));
        birds = 0.8 * k4 * (1 - 0.7 * kf); fest = kf; mus = 0.3 * kf;                      // his eyes open on the turf: birds, then the ground's noise comes up over them (its loudspeakers only a hint: the film's own music is still playing, and two musics at once are a clash; play begins on the ground's own)
        shop = smo(sgk(t, T.o1 + 0.3, T.o1 + 1.6)) * (1 - smo(sgk(t, T.o4 - 1.4, T.o4 - 0.3))); }   // and before it, his shop at night: its fridge, the street far off
      else if (key === 'festival') { const T = FEST, kc = smo(sgk(t, T.cut + 0.3, T.cut + 1.5)), kp = smo(sgk(t, T.sweep + 3.6, T.pho + 0.5));
        fest = lp(0.75, 1, kc) * (1 - 0.8 * kp); mus = kc * (1 - kp); }                    // the dance has its own piece (a cue); the ground's music comes back at the cut, and all of it falls away for the man in white
      else if (key === 'between') { const T = BETW;
        fest = 0.6 * (1 - smo(sgk(t, T.n1 + 0.5, T.n1 + 3.6)));                           // the day's noise falls away under the night's music
        crick = smo(sgk(t, T.n3 - 0.2, T.n3 + 0.8)) * (1 - smo(sgk(t, T.n5 - 0.5, T.n5 + 0.6)));
        birds = smo(sgk(t, T.n5, T.n5 + 1.5)); }                                          // first light: play's own morning
      else if (key === 'tell' || key === 'answers') birds = 0.45;
      else if (key === 'A' || key === 'B' || key === 'C' || key === 'D') {
        const T = ENDT[key]; birds = 0.5;
        if (key === 'B') { birds = (0.5 + 0.6 * bump(t, T.silence, T.edge - 0.4, 0.6, 0.5)) * (1 - smo(sgk(t, T.edge - 0.5, T.edge + 0.1)));   // the long silence is held by the birds; the afternoon has its own bed (a cue)
          crick = smo(sgk(t, T.dusk, T.dusk + 1.0)); }                                    // dusk, and on through the close
        if (key === 'D') birds = 0.5 * (1 - smo(sgk(t, T.shut + 0.3, T.shut + 1.2))) + 0.25 * smo(sgk(t, T.back, T.back + 1.5));   // the world closes; he comes back to a quieter morning
        if (t >= T.close) { const tc = t - T.close; open = 0.6 * bump(tc, CLOSE.glow + 0.2, CLOSE.q3z1 + 2.0, 1.4, 1.6); }   // his own light in the close: the world heard a little open while it is on him
      }
      filmBed.on = true; filmBed.fest = BED.fest * fest; filmBed.mus = BED.mus * mus; filmBed.birds = BED.birds * birds; filmBed.crick = BED.crick * crick;
      filmBed.open = BED.open * open; filmBed.pull = 0; filmBed.shop = BED.shop * shop;
    }
    const films = {
      key: '',
      /* (the dancers: play has them on the ground all of day one; every film but the festival's was directed without
         them, so each begins with them put away, and play's frame shows them again) */
      begin(key, c, api) { FL.key = films.key = key; FL.api = api; FL.once.clear(); FL.lit = lookName; danceG.visible = false; burstsLand(); if (FILMS[key] && FILMS[key].begin) FILMS[key].begin(api); },
      /* (a film's own frame: play's frame does not run under it, so the levels are chosen here, from the film's lens: v24.22) */
      frame(key, t, api) { if (FILMS[key]) FILMS[key].frame(t, api);
        filmBeds(key, t);
        /* (a probe's viewfinder: tools/probes/e4c3beats.mjs tries a lens here before a shot is written; never set in play) */
        if (FL.vf) { fLens(FL.vf[6]); camAt([FL.vf[0], FL.vf[1], FL.vf[2]], [FL.vf[3], FL.vf[4], FL.vf[5]]); }
        peopleLevels(); lodTick(); },
      /* (HIS HANDS COME BACK when a film ends. Every film here hides them at its start, and the engine shows them again
         only after a film from play (v21.1): the opening film is not one, so play began with them hidden and the bai sri
         Ton hands him was never drawn until the festival's film had ended. Found at M8 by a photograph of it held) */
      end() { const F = FILMS[FL.key]; if (F && F.end) F.end(); if (FL.api && FL.api.handsRoot) FL.api.handsRoot.visible = true; FL.key = films.key = ''; FL.api = null; camera.rotation.z = 0; filmBed.on = false; },
    };

    /* ---------------------------------------------------------------- the stage's life */
    function snap() { return { phase }; }
    function restore() {}
    function reset() {
      films.end();
      dropTodo(); speakReset(); lineQ.length = 0; heard.clear(); turns.length = 0; ambReset();
      booted = false; preplaced = ''; dayClock.t = 0; lastWall = 0; lastWall0 = 0; pausedAt = 0;
      decOpen = false;
      for (const h of hotspots) { h.done = false; h.dwellT = 0; }
      /* everything a run changes is put back (v8.1: a same-chapter replay never runs build() again) */
      play.run++;
      Object.assign(play, { busy: false, turning: null, bow: null, bai: false, baiP: 0, baiTo: 0, baiSecs: 1, knelt: false, homage: false, pull: null, looked: false,
                            checked: false, bowed: false, breath: null, lookEase: null, tonGive: null, ymCarry: false, ymSet: null, pull3: 0, ymHands: null, away: false, chanting: false });
      play.asked = new Set(); open.k = 0; open.shown = -1; open.over = 0; open.i = -1; open.st = '';
      if (kit) {
        if (kit.abortEvent) kit.abortEvent();
        kit.objective(null, { complete: false });
        kit.root(false); kit.pose('standing', { secs: 0.05 });
        if (kit.hold) kit.hold(null);
        if (kit.pray) kit.pray(false, { secs: 0 });
        if (kit.tremble) kit.tremble(0, { secs: 0 });
        if (kit.pulse) kit.pulse(null);
        if (kit.chill) kit.chill(0, { secs: 0 });
        if (kit.smear) kit.smear(0, { secs: 0 });
        if (kit.hush) kit.hush(0, { secs: 0 });
        if (kit.lens) kit.lens(null, { secs: 0 });
        kit.presence(0);
        kit.daylight(null, 0);
        kit.setPhase('arrive');
        if (kit.captions) kit.captions(null);
        kit.waypoint(null);
      }
      handBaiHolder.add(handBai);
      phase = 'arrive';
      for (const P of people) { if (P.driver || !P.ready) continue; P.span = null; P.gaze = null; P.gazeK = 0; P.lay = null; P.layK = 0; armsBack(P); }
      whenReady(cast.pho, (P) => { P.rest.take = 'Sit_to_Stand_Transition_M'; });
      whenReady(cast.ym, (P) => { P.rest.take = 'seiza'; });
      /* (v8.1: "takes a scene set". Whoever a film or a beat left in a take of its own is back in the one he was built
         in: the man whose arms rose in the festival, the old man who knelt in an ending, both put away and both still
         in those takes when the run was read after a Retry (tools/probes/e4c3replay.mjs, 12 Nov). One who is still in
         his own is left alone, so his clock runs on and nobody on the bench falls into step with his neighbour. And
         every body's level is chosen afresh, as a first run chooses it: Grandmaster Pho has no middle body, and on a
         second run he was drawn in his full one from the spawn, held there by the band that stops a level flickering) */
      for (const P of people) { if (P.driver || !P.ready) continue; P.lvNow = -1; if (P.cur !== P.rest.take) rest(P, 0); }
      for (const M0 of crowd) M0.lvNow = -1;
      dayOneStage(); setFormation('arrive'); tonHome();
      baiPut(myBai, TON_BAI.x, TON_BAI.y, TON_BAI.z, TON_BAI.ry);
    }
    function blockers() {
      const out = [];
      const solid = (o, pad = 0.14) => { o.updateWorldMatrix(true, false); const bb = new THREE.Box3().setFromObject(o); bb.expandByScalar(pad); bb.min.y = 0; bb.max.y = Math.max(bb.max.y, 1.40); out.push(bb); };
      for (const s of solids) solid(s);
      for (const b of crowdBlock) out.push(b);                                   // the crowd, a column a person (lifted out of his way when they are gone: crowdSolid)
      for (const b of dawnBlock) out.push(b);                                    // the two who clear up on day two
      for (const b of danceBlock) out.push(b);                                   // the six dancers, wherever they stand or walk (c_crowd.js)
      for (const k in castBlock) out.push(castBlock[k]);                         // and those of the cast who stand on the turf (each follows its person: castSolid)
      return out;
    }
    function dispose() {
      alive = false;
      myArmsDrop();                                                                 // (the engine's own hand is not this chapter's to dispose: c_zfx.js)
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
      skyAt: () => FL.sky,                                                      // (the sky stands over the turf; a film's pocket set asks for it over itself)
      stepSound: stepNext,                                                      // his own feet on the grass: he left his sandals at the turf's edge (d_play.js STEPS_GRASS, v26.1)
      /* walktest: where play puts him besides the spawn, and the ground he must STAY on (v25.5): the turf, the gravel
         before the tables and the tents' fronts. He cannot leave it */
      /* (walktest reads the collision of the FIRST frame: the gathering, its people kneeling where the next morning
         finds him. So the morning's own arrival is not named here, where it would be tried against yesterday's crowd
         (it failed so the day the chapter was first put on walktest's list, 12 Nov): tools/probes/e4c3walk.mjs walks
         each of the chapter's three grounds in its own collision, from where each phase puts him) */
      arrivals: [{ what: 'in the line at his bench', x: LINE_AT.x, z: LINE_AT.z },
                 { what: 'kneeling at his place', x: PLACE.x, z: PLACE.z }, { what: 'kneeling before Grandmaster Pho', x: KNEEL2.x, z: KNEEL2.z }],
      keepIn: { what: 'the ground of the Wai Kru', minX: DATA.bounds.minX, maxX: DATA.bounds.maxX, minZ: DATA.bounds.minZ, maxZ: DATA.bounds.maxZ },
      get phase() { return phase; },
      setPhase, applyPhase, after, dayClock, sayLine, queueLine, queueFn, queueGap,
      look, presets: PRESETS, films, crowdStats, setFormation,
      /* for the probes (tools/probes/e4c3drive.mjs): the play's own state and its beats by name */
      dbg: { myGrip: GRIP, hold: HOLD, myArms: MYARMS, viewfinder(v) { FL.vf = v || null; }, clocks: { A: ENDT.A, B: ENDT.B, C: ENDT.C, D: ENDT.D, CLOSE, FEST, BETW, TELL, ANSW, OPEN: OPENT }, armsOf, handTo, handsTo, restHands, baiGrip, baiPut, play, open, cast, bursts, BAI, handBai, myBai, ymBai, petalBurst, auraAt, baiHands, baiRaise, lineBegin, dawnBegin, breathBegin, places: { PLACE, LINE_AT, KNEEL2, DAWN_AT, TABLES_AT }, dancers, dancersDir, danceBlock, dancerSpot, kids, kidsDir, kidPath, taper, extrasHeard, people, crowd, headDampLay },
      who: () => people.filter(P => !P.driver).map(P => ({ key: P.key, ready: P.ready, take: P.cur, skin: P.lvShown, skins: P.lv.map(v => (v ? 1 : 0)).join('') })),
      plan: { TURF, TABLES, HALL, TENT_W1, TENT_W2, TENT_E, CHIEF, BENCH, POLE, TON_TABLE, WEST_TABLE },
      /* the ground's own noises (ambTick): how many have sounded, and the last (a probe counts them over a stretch of play) */
      amb: () => ({ n: ambN, last: ambLast, next: +ambAt.toFixed(2), beds: Object.assign({}, bedMix), pan: +musPan.toFixed(3) }),
      /* Grandmaster Pho's look, for a probe that brackets it (tools/probes/e4c3beats.mjs: eval E.stage.phoLook.lift.value = 0.4) */
      phoLook,
      info: () => ({ phase, t: +dayClock.t.toFixed(2), queued: lineQ.length, heard: [...heard], until: +speak.until.toFixed(2),
                     pending: speak.pending ? speak.pending.name : null, decOpen, look: lookName, busy: play.busy, applied: booted,
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
  function rng(seed) { let s = seed >>> 0 || 1; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
  /* painted light: a soft glow; and the gold's three sheets (the master's aura as chapter 2 drew it and kept for him) */
  function makeGlow(THREE, cnv) {
    const S = 128, [c, x] = cnv(S);
    const g = x.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.25, 'rgba(255,255,255,0.55)'); g.addColorStop(0.6, 'rgba(255,255,255,0.14)'); g.addColorStop(1, 'rgba(255,255,255,0)');
    x.fillStyle = g; x.fillRect(0, 0, S, S);
    return done(THREE, c, false);
  }
  function makeAuraBody(THREE, cnv) {
    const S = 256, [c, x] = cnv(S);
    x.clearRect(0, 0, S, S); x.globalCompositeOperation = 'lighter';
    const blob = (cx, cy, rx, ry, a) => { x.save(); x.translate(cx, cy); x.scale(rx / 100, ry / 100);
      const g = x.createRadialGradient(0, 0, 0, 0, 0, 100);
      g.addColorStop(0, `rgba(255,255,255,${a})`); g.addColorStop(0.45, `rgba(255,255,255,${(a * 0.6).toFixed(3)})`); g.addColorStop(0.75, `rgba(255,255,255,${(a * 0.18).toFixed(3)})`); g.addColorStop(1, 'rgba(255,255,255,0)');
      x.fillStyle = g; x.fillRect(-100, -100, 200, 200); x.restore(); };
    blob(128, 178, 126, 72, 0.52); blob(128, 132, 92, 96, 0.5); blob(128, 82, 68, 74, 0.5);
    x.globalCompositeOperation = 'destination-in';
    const f = x.createLinearGradient(0, 0, 0, S); f.addColorStop(0, 'rgba(0,0,0,1)'); f.addColorStop(0.78, 'rgba(0,0,0,1)'); f.addColorStop(0.97, 'rgba(0,0,0,0)');
    x.fillStyle = f; x.fillRect(0, 0, S, S);
    x.globalCompositeOperation = 'source-over';
    return done(THREE, c, false);
  }
  function makeAuraRays(THREE, cnv) {
    const S = 512, [c, x] = cnv(S), r = rng(9161), N = 40;
    x.clearRect(0, 0, S, S); x.save(); x.translate(S / 2, S / 2); x.globalCompositeOperation = 'lighter';
    for (let i = 0; i < N; i++) {
      const a = (i + r() * 0.8) / N * Math.PI * 2, len = 150 + r() * 96, w = 0.014 + r() * 0.04, al = 0.1 + r() * 0.2;
      for (const [ww, aa] of [[w * 2.4, al * 0.35], [w * 1.4, al * 0.6], [w * 0.6, al]]) {
        const g = x.createRadialGradient(0, 0, 36, 0, 0, len); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(0.3, `rgba(255,255,255,${aa.toFixed(3)})`); g.addColorStop(1, 'rgba(255,255,255,0)');
        x.fillStyle = g; x.beginPath(); x.moveTo(0, 0); x.arc(0, 0, len, a - ww, a + ww); x.closePath(); x.fill();
      }
    }
    x.restore(); x.globalCompositeOperation = 'source-over';
    return done(THREE, c, false);
  }
  function makeAuraRing(THREE, cnv) {
    const S = 256, [c, x] = cnv(S);
    x.clearRect(0, 0, S, S);
    const g = x.createRadialGradient(128, 128, 0, 128, 128, 128);
    g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(0.6, 'rgba(255,255,255,0)'); g.addColorStop(0.8, 'rgba(255,255,255,0.7)'); g.addColorStop(0.86, 'rgba(255,255,255,0.7)'); g.addColorStop(1, 'rgba(255,255,255,0)');
    x.fillStyle = g; x.fillRect(0, 0, S, S);
    return done(THREE, c, false);
  }
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
    return noMip(THREE, done(THREE, c, false));
  }

  /* a cut-out picture of SMALL things is drawn without mipmaps: minified, its alpha averages under the cut, and what is
     far is not drawn at all (a turf "yellow with petals" was green ten metres off: photographed at dawn) */
  function noMip(THREE, t) { t.generateMipmaps = false; t.minFilter = THREE.LinearFilter; t.needsUpdate = true; return t; }
  /* one marigold petal (a ray floret: narrow at its base, broad and a little notched at its tip), filling its tile */
  function makePetal(THREE, cnv) {
    const [c, x] = cnv(64); x.clearRect(0, 0, 64, 64);
    x.save(); x.translate(32, 32);
    const g = x.createLinearGradient(-28, 0, 28, 0); g.addColorStop(0, '#ffe9a8'); g.addColorStop(0.45, '#ffffff'); g.addColorStop(1, '#fff3c4');
    x.fillStyle = g; x.beginPath(); x.moveTo(-29, 0); x.bezierCurveTo(-14, -9, 8, -19, 24, -13); x.quadraticCurveTo(31, -8, 26, -2); x.lineTo(29, 2); x.quadraticCurveTo(31, 9, 24, 13); x.bezierCurveTo(8, 19, -14, 9, -29, 0); x.fill();
    x.strokeStyle = 'rgba(190,120,20,0.5)'; x.lineWidth = 1.2; x.beginPath(); x.moveTo(-24, 0); x.lineTo(20, 0); x.moveTo(-10, -1); x.lineTo(18, -8); x.moveTo(-10, 1); x.lineTo(18, 8); x.stroke();
    x.restore();
    return noMip(THREE, done(THREE, c, false));
  }

  /* HIS LAPTOP'S FORUM: chapter 2's own drawing of it (the thread that chapter ended on is the opening film's first
     picture), copied whole so the two are one page */
  const FX0 = 192, FX1 = 832;
  function drawForum(x, o = {}) {
    const W = 1024, H = 720, Wd = o.words || {}, CW = FX1 - FX0;
    const F = (s, w = '') => `${w} ${s}px "Helvetica Neue", Helvetica, Arial, sans-serif`;
    const SERIF = (s, w = '') => `${w} ${s}px Georgia, "Times New Roman", serif`;
    const INK = '#1b2733', DIM = '#6d7a88', LINE = '#d9e0e7', GOLD = '#d9a441', TEAL = '#1e3338';
    const c01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
    x.setTransform(1, 0, 0, 1, 0, 0); x.globalAlpha = 1; x.textBaseline = 'alphabetic'; x.textAlign = 'left';
    const rr = (px, py, w, h, r) => { x.beginPath(); x.moveTo(px + r, py); x.lineTo(px + w - r, py); x.quadraticCurveTo(px + w, py, px + w, py + r); x.lineTo(px + w, py + h - r);
      x.quadraticCurveTo(px + w, py + h, px + w - r, py + h); x.lineTo(px + r, py + h); x.quadraticCurveTo(px, py + h, px, py + h - r); x.lineTo(px, py + r); x.quadraticCurveTo(px, py, px + r, py); x.closePath(); };
    const card = (px, py, w, h, fill = '#ffffff', edge = LINE, lw = 1.5) => { x.fillStyle = 'rgba(20,34,48,0.06)'; rr(px, py + 2, w, h, 9); x.fill();
      x.fillStyle = fill; rr(px, py, w, h, 9); x.fill(); x.strokeStyle = edge; x.lineWidth = lw; x.stroke(); };
    /* words onto lines no wider than w: the lines, as many as `max` (the last one closed with … if words are left) */
    const lines = (s, w, max = 9) => { const ws = String(s || '').split(' '), out = []; let line = '';
      for (let i = 0; i < ws.length; i++) { const t = line ? line + ' ' + ws[i] : ws[i];
        if (x.measureText(t).width > w && line) { out.push(line); line = ws[i]; if (out.length === max) { out[max - 1] += '…'; return out; } } else line = t; }
      if (line) out.push(line); return out; };
    const para = (s, px, py, w, lh, max) => { const L = lines(s, w, max); L.forEach((l, i) => x.fillText(l, px, py + i * lh)); return py + L.length * lh; };
    /* a member's round picture: a colour by who it is, and the first letter */
    const TINTS = ['#3f8f7b', '#c0703a', '#5a78b8', '#9a5aa8', '#b8923a', '#4f8fae', '#b85a6a', '#6a8a4a'];
    const face = (cx, cy, r, who) => { let h = 0; for (const ch of who) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
      x.fillStyle = TINTS[h % TINTS.length]; x.beginPath(); x.arc(cx, cy, r, 0, Math.PI * 2); x.fill();
      x.fillStyle = '#ffffff'; x.font = F(Math.round(r * 1.05), 'bold'); x.textAlign = 'center'; x.fillText(who.charAt(0).toUpperCase(), cx, cy + r * 0.37); x.textAlign = 'left'; };
    const chip = (px, py, label, fill, ink) => { x.font = F(12, 'bold'); const w = x.measureText(label).width + 16; x.fillStyle = fill; rr(px, py, w, 20, 10); x.fill(); x.fillStyle = ink; x.fillText(label, px + 8, py + 14.5); return w; };

    /* ---- the page, its header, its tabs */
    x.fillStyle = '#edf0f3'; x.fillRect(0, 0, W, H);
    const hg = x.createLinearGradient(0, 0, W, 0); hg.addColorStop(0, '#162a2e'); hg.addColorStop(0.5, '#22404a'); hg.addColorStop(1, '#162a2e');
    x.fillStyle = hg; x.fillRect(0, 0, W, 66);
    /* its mark: a lotus bud in a ring, drawn (no real site's) */
    { const mx = FX0 + 22, my = 33; x.strokeStyle = '#f0cf7e'; x.lineWidth = 2; x.beginPath(); x.arc(mx, my, 19, 0, Math.PI * 2); x.stroke();
      x.fillStyle = '#f0cf7e'; for (const a of [-0.55, 0, 0.55]) { x.save(); x.translate(mx, my + 9); x.rotate(a); x.beginPath(); x.moveTo(0, 0); x.quadraticCurveTo(-7, -11, 0, -21); x.quadraticCurveTo(7, -11, 0, 0); x.fill(); x.restore(); } }
    x.fillStyle = '#f3d68e'; x.font = SERIF(27, 'bold'); x.fillText(Wd.forumName || '', FX0 + 52, 33);
    x.fillStyle = '#a8c2bf'; x.font = F(13); x.fillText(Wd.forumSub || '', FX0 + 53, 52);
    /* a search field, and who is signed in */
    x.fillStyle = 'rgba(255,255,255,0.12)'; rr(FX1 - 210, 19, 158, 28, 14); x.fill();
    x.strokeStyle = 'rgba(255,255,255,0.55)'; x.lineWidth = 1.8; x.beginPath(); x.arc(FX1 - 192, 32, 5.5, 0, Math.PI * 2); x.moveTo(FX1 - 188, 36); x.lineTo(FX1 - 184, 40); x.stroke();
    face(FX1 - 18, 33, 15, 'newshop_sg');
    x.fillStyle = '#12232a'; x.fillRect(0, 66, W, 38);
    { let tx = FX0; x.font = F(15, 'bold');
      String(Wd.forumTabs || '').split('|').forEach((tab, i) => { const w = x.measureText(tab).width, on = i === 1;
        x.fillStyle = on ? '#f3d68e' : '#9db3b6'; x.fillText(tab, tx, 91); if (on) { x.fillStyle = '#f3d68e'; x.fillRect(tx, 100, w, 3); } tx += w + 30; }); }
    /* the page loading (a bar under the tabs) */
    if ((o.load || 0) > 0) { x.fillStyle = GOLD; x.fillRect(0, 104, W * c01(o.load) * 0.92, 3); }

    /* ---- the gutters: what a wide screen has room for (a phone's crop does not reach them) */
    { card(16, 122, 160, 236); x.fillStyle = DIM; x.font = F(12, 'bold'); x.fillText('BOARDS', 30, 146);
      String(Wd.forumBoards || '').split('|').forEach((b, i) => { const by = 158 + i * 32, on = b === (Wd.forumBoard || '');
        if (on) { x.fillStyle = '#eaf2f1'; rr(22, by, 148, 27, 6); x.fill(); x.fillStyle = '#2a6a62'; x.fillRect(22, by + 4, 3, 19); }
        x.fillStyle = TINTS[(i * 3 + 1) % TINTS.length]; rr(32, by + 7, 13, 13, 3); x.fill();
        x.fillStyle = on ? TEAL : '#44515e'; x.font = F(13, on ? 'bold' : ''); let lb = b; while (lb.length > 3 && x.measureText(lb).width > 112) lb = lb.slice(0, -2) + '…'; x.fillText(lb, 53, by + 18.5); });
      /* the lineage chart: a teacher and his students, boxes and lines, no names that could be read */
      const lx = FX1 + 16, lw = W - lx - 16; card(lx, 122, lw, 250); x.fillStyle = DIM; x.font = F(12, 'bold'); x.fillText('LINEAGE', lx + 14, 146);
      const cx0 = lx + lw / 2, nd = [[0, 176], [-38, 232], [38, 232], [-56, 288], [-18, 288], [40, 288], [-18, 342]];
      x.strokeStyle = '#8fada6'; x.lineWidth = 1.6;
      for (const [a, b] of [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5], [4, 6]]) { x.beginPath(); x.moveTo(cx0 + nd[a][0], nd[a][1]); x.lineTo(cx0 + nd[b][0], nd[b][1]); x.stroke(); }
      nd.forEach(([dx, y], i) => { x.fillStyle = i ? '#e6eeeb' : '#f5e6bd'; rr(cx0 + dx - 17, y - 11, 34, 22, 5); x.fill(); x.strokeStyle = i ? '#8fada6' : '#c9a655'; x.stroke();
        x.fillStyle = i ? '#a7bcb6' : '#c9a655'; x.fillRect(cx0 + dx - 10, y - 2, 20, 4); });
      card(lx, 386, lw, 92); x.fillStyle = DIM; x.font = F(12, 'bold'); x.fillText('ONLINE', lx + 14, 410);
      ['kopi_uncle', 'Mdm Tan', 'boonchai88', 'old_hand'].forEach((w2, i) => { face(lx + 28 + i * 33, 444, 13, w2); x.fillStyle = '#39b36b'; x.beginPath(); x.arc(lx + 38 + i * 33, 454, 4, 0, Math.PI * 2); x.fill(); }); }

    const crumb = (tail) => { x.font = F(14); x.fillStyle = DIM; let cx = FX0; const parts = ['Forums', Wd.forumBoard || ''].concat(tail ? [tail] : []);
      parts.forEach((p, i) => { const last = i === parts.length - 1; x.fillStyle = last ? INK : DIM; x.font = F(14, last ? 'bold' : ''); x.fillText(p, cx, 136); cx += x.measureText(p).width + 8;
        if (!last) { x.fillStyle = '#9aa6b2'; x.font = F(14); x.fillText('›', cx, 136); cx += 15; } }); };
    const button = (px, py, w, h, label, fill, ink) => { x.fillStyle = fill; rr(px, py, w, h, 8); x.fill(); x.fillStyle = ink; x.font = F(15, 'bold'); x.textAlign = 'center'; x.fillText(label, px + w / 2, py + h / 2 + 5.5); x.textAlign = 'left'; };
    const pointer = (cx, cy, click) => {
      if ((click || 0) > 0 && click < 1) { x.strokeStyle = `rgba(217,164,65,${(0.85 * (1 - click)).toFixed(3)})`; x.lineWidth = 3; x.beginPath(); x.arc(cx + 2, cy + 2, 8 + 20 * click, 0, Math.PI * 2); x.stroke(); }
      x.fillStyle = '#16181c'; x.strokeStyle = '#ffffff'; x.lineWidth = 2; x.lineJoin = 'round';
      x.beginPath(); x.moveTo(cx, cy); x.lineTo(cx, cy + 25); x.lineTo(cx + 6.5, cy + 19); x.lineTo(cx + 11.5, cy + 30); x.lineTo(cx + 16, cy + 28); x.lineTo(cx + 11, cy + 17.5); x.lineTo(cx + 19.5, cy + 17.5); x.closePath(); x.stroke(); x.fill(); };
    const mode = o.mode || 'list';

    if (mode === 'compose') {
      const title = Wd.postTitle || '', body = Wd.postBody || '', n = o.chars || 0, car = o.caret && !o.post ? '|' : '';
      const tT = title.slice(0, Math.min(n, title.length)), tB = body.slice(0, Math.max(0, n - title.length));
      crumb('New thread');
      card(FX0, 152, CW, 470);
      x.fillStyle = INK; x.font = SERIF(24, 'bold'); x.fillText('Start a new thread', FX0 + 24, 194);
      x.fillStyle = DIM; x.font = F(13, 'bold'); x.fillText('TITLE', FX0 + 24, 228); x.fillText('MESSAGE', FX0 + 24, 310);
      const field = (py, h, live) => { x.fillStyle = '#f7f9fb'; rr(FX0 + 24, py, CW - 48, h, 7); x.fill(); x.strokeStyle = live ? '#7fa8d8' : LINE; x.lineWidth = live ? 2 : 1.5; x.stroke(); };
      field(238, 48, n < title.length); field(320, 216, n >= title.length && !o.post);
      x.fillStyle = INK; x.font = F(21, 'bold'); x.fillText(tT + (n < title.length ? car : ''), FX0 + 38, 269);
      x.font = F(20); para(tB + (n >= title.length ? car : ''), FX0 + 38, 354, CW - 80, 30, 6);
      face(FX0 + 42, 580, 16, 'newshop_sg'); x.fillStyle = DIM; x.font = F(14); x.fillText('Posting as newshop_sg', FX0 + 68, 585);
      if (o.post) { button(FX1 - 158, 560, 134, 42, 'Posted', '#2f8a5a', '#ffffff');
        x.strokeStyle = '#ffffff'; x.lineWidth = 2.5; x.lineCap = 'round'; x.beginPath(); x.moveTo(FX1 - 140, 581); x.lineTo(FX1 - 134, 587); x.lineTo(FX1 - 124, 575); x.stroke(); x.lineCap = 'butt'; }
      else button(FX1 - 158, 560, 134, 42, 'Post thread', GOLD, '#2a2110');
      return;
    }
    if (mode === 'thread') {
      crumb();
      const n = Math.max(0, Math.min(5, o.n || 0)), full = Math.floor(n + 1e-6);
      card(FX0, 152, CW, 150);
      x.fillStyle = INK; x.font = SERIF(25, 'bold'); x.fillText(Wd.postTitle || '', FX0 + 22, 190);
      face(FX0 + 38, 222, 15, 'newshop_sg'); x.fillStyle = INK; x.font = F(14, 'bold'); x.fillText('newshop_sg', FX0 + 62, 220);
      x.fillStyle = DIM; x.font = F(13); x.fillText('4 days ago', FX0 + 62, 237);
      x.fillStyle = '#2a3643'; x.font = F(19); para(Wd.postBody || '', FX0 + 22, 272, CW - 44, 27, 2);
      x.fillStyle = DIM; x.font = F(14, 'bold'); x.textAlign = 'right'; x.fillText(`${full} ${full === 1 ? 'reply' : 'replies'}`, FX1 - 4, 136); x.textAlign = 'left';
      const reps = ['reply1', 'reply2', 'reply3', 'reply4', 'reply5'].map(k => Wd[k] || ''), who = ['kopi_uncle', 'Mdm Tan', 'boonchai88', 'pradit_sg', 'old_hand'];
      for (let i = 0; i < 5; i++) { const k = c01(n - i); if (k <= 0) break;
        const y = 316 + i * 78 + 14 * (1 - k); x.globalAlpha = k; card(FX0, y, CW, 68, i === full && k < 1 ? '#fffbee' : '#ffffff');
        face(FX0 + 36, y + 34, 17, who[i]);
        x.fillStyle = TEAL; x.font = F(14, 'bold'); x.fillText(who[i], FX0 + 64, y + 26);
        x.fillStyle = '#2a3643'; x.font = F(18); let rp = reps[i]; while (rp.length > 8 && x.measureText(rp).width > CW - 88) rp = rp.slice(0, -2) + '…'; x.fillText(rp, FX0 + 64, y + 50); x.globalAlpha = 1; }
      return;
    }
    if (mode === 'post') {
      /* the thread opened: its own words (the chapter's last picture, so a phone's crop holds every line: the column) */
      crumb(); x.globalAlpha = o.fade == null ? 1 : c01(o.fade);
      card(FX0, 152, CW, 318, '#ffffff', '#e0c476', 2);
      chip(FX0 + 22, 168, 'WAI KRU', '#f6e7bd', '#7a5a12'); chip(FX0 + 104, 168, 'UDON THANI', '#e3eef0', '#2a5f66');
      x.fillStyle = INK; x.font = SERIF(25, 'bold'); const ty = para(Wd.threadNew || '', FX0 + 22, 222, CW - 44, 31, 2);
      face(FX0 + 38, ty + 8, 15, 'ton_udon'); x.fillStyle = INK; x.font = F(14, 'bold'); x.fillText('ton_udon', FX0 + 62, ty + 6);
      x.fillStyle = DIM; x.font = F(13); x.fillText(Wd.threadNewSub || '', FX0 + 62, ty + 23);
      x.fillStyle = '#263240'; x.font = F(18.5); para(Wd.threadNewBody || '', FX0 + 22, ty + 56, CW - 44, 26.5, 7);
      x.fillStyle = DIM; x.font = F(14, 'bold'); x.fillText('2 replies', FX0 + 4, 498);
      [['kopi_uncle', Wd.threadNewReply1], ['Mdm Tan', Wd.threadNewReply2]].forEach(([w2, s], i) => { const y = 510 + i * 70; card(FX0, y, CW, 60);
        face(FX0 + 34, y + 30, 16, w2); x.fillStyle = TEAL; x.font = F(14, 'bold'); x.fillText(w2, FX0 + 60, y + 24);
        x.fillStyle = '#2a3643'; x.font = F(17); x.fillText(s || '', FX0 + 60, y + 46); });
      x.fillStyle = '#f7f9fb'; rr(FX0, 656, CW - 110, 40, 8); x.fill(); x.strokeStyle = LINE; x.lineWidth = 1.5; x.stroke();
      x.fillStyle = '#9aa6b2'; x.font = F(15); x.fillText('Write a reply…', FX0 + 16, 681); button(FX1 - 98, 656, 98, 40, 'Reply', GOLD, '#2a2110');
      x.globalAlpha = 1;
      return;
    }
    /* ---- the list: the board's threads, read down; the new one arriving at the top (the rest moved down for it) */
    crumb();
    button(FX1 - 122, 116, 122, 30, 'New thread', GOLD, '#2a2110');
    const keys = ['thread1', 'thread2', 'thread3', 'thread4', 'thread2b', 'thread3b', 'thread5', 'thread6', 'thread7', 'thread8'];
    const rows = keys.map(k => Wd[k] || '').filter(Boolean);
    const who = ['old_hand', 'pradit_sg', 'Mdm Tan', 'lersi_fan', 'kopi_uncle', 'boonchai88', 'ton_udon', 'ah_seng', 'nong_may', 'first_timer'];
    const tags = [['PINNED', '#f6e7bd', '#7a5a12'], ['ACCOUNTS', '#e3eef0', '#2a5f66'], ['GUIDE', '#e6ecf8', '#33508a'], ['ACCOUNTS', '#e3eef0', '#2a5f66'], ['GUIDE', '#e6ecf8', '#33508a'],
                  ['WAI KRU', '#f6e7bd', '#7a5a12'], ['WAI KRU', '#f6e7bd', '#7a5a12'], ['TEMPLES', '#efe6f4', '#6a3f86'], ['PICTURES', '#e9f2e4', '#3f6a2a'], ['NEWCOMERS', '#f8e9e4', '#8a4a33']];
    const newK = c01(o.newK || 0), NEWH = 104, PITCH = 92, top = 158, hov = c01(o.hover || 0);
    x.save(); x.beginPath(); x.rect(0, 150, W, H - 150); x.clip();
    const y0 = top - (o.scroll || 0);
    if (newK > 0) {
      const yN = y0 - (NEWH + 8) * (1 - newK); x.globalAlpha = newK;
      card(FX0, yN, CW, NEWH, hov > 0 ? '#fff1c9' : '#fff7df', '#e0b84a', 2 + hov);
      face(FX0 + 36, yN + 40, 20, 'ton_udon');
      const cw2 = chip(FX0 + 68, yN + 12, 'NEW', '#d9532f', '#ffffff'); chip(FX0 + 74 + cw2, yN + 12, 'WAI KRU', '#f6e7bd', '#7a5a12');
      x.fillStyle = INK; x.font = F(19.5, 'bold'); const ly = para(Wd.threadNew || '', FX0 + 68, yN + 56, CW - 96, 24, 2);
      if (hov > 0.5) { x.fillStyle = INK; x.fillRect(FX0 + 68, yN + 59, Math.min(CW - 96, x.measureText(lines(Wd.threadNew || '', CW - 96, 2)[0] || '').width), 1.5); }
      x.fillStyle = DIM; x.font = F(13.5); x.fillText('ton_udon · ' + (Wd.threadNewSub || ''), FX0 + 68, Math.max(ly, yN + 80) + 8);
      x.globalAlpha = 1;
    }
    rows.forEach((t, i) => { const yy = y0 + (NEWH + 8) * newK + i * PITCH; if (yy > H || yy + 84 < 150) return;
      card(FX0, yy, CW, 84);
      face(FX0 + 36, yy + 42, 20, who[i % who.length]);
      x.fillStyle = INK; x.font = F(19.5, 'bold'); let tt = t; while (tt.length > 8 && x.measureText(tt).width > CW - 176) tt = tt.slice(0, -2) + '…'; x.fillText(tt, FX0 + 68, yy + 36);
      x.fillStyle = DIM; x.font = F(13.5); const meta = `${who[i % who.length]} · ${2 + i} days ago`; x.fillText(meta, FX0 + 68, yy + 60);
      const tg = tags[i % tags.length]; chip(FX0 + 80 + x.measureText(meta).width, yy + 45.5, tg[0], tg[1], tg[2]);
      x.fillStyle = INK; x.font = F(18, 'bold'); x.textAlign = 'center'; x.fillText(String(12 + i * 7), FX1 - 44, yy + 40);
      x.fillStyle = DIM; x.font = F(12); x.fillText('replies', FX1 - 44, yy + 58); x.textAlign = 'left'; });
    x.restore();
    /* the list's own scroll bar, at the column's edge */
    { const full = rows.length * PITCH + (NEWH + 8) * newK + 16, view = H - 150, k = Math.min(1, view / full), at = c01((o.scroll || 0) / Math.max(1, full - view));
      x.fillStyle = 'rgba(30,50,60,0.10)'; rr(FX1 + 5, 156, 5, view - 12, 2.5); x.fill();
      x.fillStyle = 'rgba(30,50,60,0.38)'; rr(FX1 + 5, 156 + (view - 12) * (1 - k) * at, 5, (view - 12) * k, 2.5); x.fill(); }
    /* his finger on the pad: the pointer where the film has it, and its click */
    if (o.cx != null) pointer(o.cx, o.cy, o.click);
  }
  /* HIS NOTEBOOK'S NEXT PAGE (the opening film), 1024 x 640: on its left leaf the last of what chapter 2's coda showed
     (his list of masters checked, as faint lines: its words are not read here); on its right leaf THE THREE QUESTIONS,
     in his own hand, each underlined as he asks it (k 0 to 1); `turn` 0 to 1 turns that leaf over to a blank one.
     Words drawn in the world are art (v14.5): they are the case file's three questions as a man writes them to himself */
  const BOOK_HAND3 = '"Segoe Print", "Bradley Hand", "Comic Sans MS", "Chalkboard SE", cursive';
  function drawQuestions(x, o = {}) {
    const Wd = 1024, H = 640, k = o.k || [0, 0, 0], turn = o.turn || 0, r = rng(5519);
    x.setTransform(1, 0, 0, 1, 0, 0); x.globalAlpha = 1; x.textAlign = 'left'; x.textBaseline = 'alphabetic';
    const leaf = () => { x.fillStyle = '#f8f4e8'; x.fillRect(0, 0, Wd, H); x.fillStyle = '#e8dcc0'; x.fillRect(Wd / 2 - 3, 0, 6, H);
      x.strokeStyle = 'rgba(90,120,170,0.25)'; x.lineWidth = 1.5; for (let y = 70; y < H; y += 42) { x.beginPath(); x.moveTo(20, y); x.lineTo(Wd / 2 - 20, y); x.moveTo(Wd / 2 + 20, y); x.lineTo(Wd - 20, y); x.stroke(); } };
    leaf();
    /* the left leaf: lines of writing, too faint and too small to be read */
    x.strokeStyle = 'rgba(28,42,106,0.28)'; x.lineWidth = 2.2;
    for (let i = 0; i < 9; i++) { const y = 104 + i * 42 + (i > 4 ? 42 : 0); let px = 44; x.beginPath(); while (px < 430 - r() * 120) { const w = 26 + r() * 54; x.moveTo(px, y + r() * 3); x.lineTo(px + w, y + r() * 3); px += w + 12; } x.stroke(); }
    const Q = [['Why am I so sensitive?'], ['Can any of it be used', 'to help others?'], ['How do I cultivate enough', 'to control it... and use it', 'at will?']];
    const x0 = Wd / 2 + 44, kt = turn < 0.5 ? 1 : 0;
    if (kt) { let y = 108;
      Q.forEach((L, qi) => { x.fillStyle = '#1c2a6a'; x.font = `bold 30px ${BOOK_HAND3}`; let wmax = 0;
        L.forEach((ln, li) => { x.fillText(ln, x0, y + li * 42); wmax = Math.max(wmax, x.measureText(ln).width); });
        const yb = y + (L.length - 1) * 42 + 12, kk = k[qi];
        if (kk > 0) { x.strokeStyle = 'rgba(160,34,34,0.9)'; x.lineWidth = 3.5; x.lineCap = 'round'; x.beginPath(); x.moveTo(x0 - 4, yb + 1); x.quadraticCurveTo(x0 + wmax * kk * 0.5, yb + 5, x0 + wmax * kk, yb - 1); x.stroke(); x.lineCap = 'butt'; }
        y += L.length * 42 + 54; }); }
    /* the leaf turning: its edge sweeps from the right to the spine, a shadow before it; past the middle the new leaf is there */
    if (turn > 0 && turn < 1) { const ex = Wd - (Wd / 2 - 6) * turn * 1.0, sh = x.createLinearGradient(ex - 90, 0, ex, 0); sh.addColorStop(0, 'rgba(60,50,30,0)'); sh.addColorStop(1, 'rgba(60,50,30,0.34)');
      x.fillStyle = sh; x.fillRect(ex - 90, 0, 90, H); x.fillStyle = '#fbf8ee'; x.fillRect(ex, 0, Wd - ex, H); x.fillStyle = 'rgba(120,100,60,0.5)'; x.fillRect(ex, 0, 2, H); }
  }

  /* one candle flame: a teardrop, white-hot at its core and amber at its edge, a little blue at its foot; on black
     (it is added to the picture, and what is black adds nothing) */
  function makeFlame(THREE, cnv) {
    const [c, x] = cnv(64); x.fillStyle = '#000'; x.fillRect(0, 0, 64, 64);
    x.save(); x.beginPath(); x.moveTo(32, 2); x.bezierCurveTo(45, 22, 50, 40, 44, 52); x.bezierCurveTo(40, 62, 24, 62, 20, 52); x.bezierCurveTo(14, 40, 19, 22, 32, 2); x.closePath(); x.clip();
    const g = x.createRadialGradient(32, 46, 1, 32, 36, 30); g.addColorStop(0, 'rgb(255,250,228)'); g.addColorStop(0.28, 'rgb(255,216,124)'); g.addColorStop(0.62, 'rgb(240,128,36)'); g.addColorStop(1, 'rgb(90,24,0)');
    x.fillStyle = g; x.fillRect(0, 0, 64, 64);
    const b = x.createRadialGradient(32, 58, 0, 32, 58, 9); b.addColorStop(0, 'rgba(110,150,255,0.6)'); b.addColorStop(1, 'rgba(110,150,255,0)'); x.fillStyle = b; x.fillRect(18, 46, 28, 18);
    x.restore();
    return done(THREE, c, false);
  }

  /* ====================================================== THE FOUR ENDINGS (§4.5), EACH WITH THE CLOSE (§4.6)
     An ending's pictures are the stage's (y_stage.js FILMS.A to D, and closeFrame); here are its clock's one track, its
     fades and its cues, and the close's, which every ending shares. It ends on its black (the card lies over it). */
  function endingScene(c, api, k, cues) {
    const { tr, step, fade, sfx, sfxFade, rawK, stage } = api, T = ENDT[k], C = CLOSE, t0 = T.close, total = t0 + C.end;
    step(0, () => stage.films.begin(k, c, api));
    tr(0, total, (kk, t) => stage.films.frame(k, t, api), rawK);
    cues(T);
    /* THE CLOSE: out of a short black, on his bai sri beside him */
    fade(t0 - 0.5, t0, 0, 1); fade(t0, t0 + 0.15, 1, 1); fade(t0 + 0.15, t0 + 0.9, 1, 0);
    sfx(t0 - 4.5, 'x3closemus', 0.39);         // the close's music comes in under the ending's last line, and carries it
    sfx(t0 + C.take + 0.7, 'x3baitake', 0.32);  // his bai sri taken up
    sfx(t0 + C.ph3z0, 'ph3z0', 1);             // "Yesterday you would not kneel to a man you did not know. Good. Keep that."
    sfx(t0 + C.ph3z1, 'ph3z1', 1);             // "It is not the flowers you give a teacher. It is your trust. Give that slowly."
    sfx(t0 + C.hands + 1.0, 'x3tone', 0.28);    // both his hands on the bowl: the held tone, low
    sfx(t0 + C.petals + 1.6, 'x3petals', 0.4); // a handful of petals, falling past his eyes
    /* (v26.8: the breath is no longer played here (Chad: "i dont think there is a need for the same minigame to be played
       a second time"); its moment is shown: his own light on him and his bai sri while his hands shake. The held tone
       of his teacher's hands on the bowl carries it, and lets go with the light. The close's music is two cues: one to
       his light, ending unresolved; one after it, that resolves) */
    sfxFade(t0 + C.glow - 1.4, t0 + C.glow - 0.05, 'x3closemus');
    sfxFade(t0 + C.q3z1 + 0.4, t0 + C.q3z1 + 2.2, 'x3tone');
    sfx(t0 + C.q3z1 - 0.3, 'x3lastmus', 0.45); // his light is letting go: the close's second cue, resolved
    sfx(t0 + C.q3z1, 'q3z1', 1);               // "Yesterday I watched people go where I could not follow. Today I opened the door a hand's width..."
    fade(t0 + C.give + 1.9, t0 + C.give + 2.2, 0, 1); fade(t0 + C.give + 2.2, t0 + C.give + 2.6, 1, 1); fade(t0 + C.give + 2.6, t0 + C.give + 3.1, 1, 0);   // he bows his head as it is taken from him
    sfx(t0 + C.give + 2.45, 'x3baiset', 0.4);  // set down on the table: the last of the Wai Kru
    sfx(t0 + C.ph3z2, 'ph3z2', 1);             // "Tomorrow we begin."
    sfx(t0 + C.q3K1, 'q3K1', 1);               // "For the first time in my life I had found the teacher who could guide me to the real answers..."
    fade(t0 + C.black, t0 + C.end - 0.2, 0, 1);
    sfxFade(t0 + C.black - 0.6, t0 + C.end - 0.05, 'x3lastmus');
    step(total, () => stage.films.end());
    c.endFade = 1; c.keep.view = true;
  }
  /* A · ACCEPT YOUR PATH (best) */
  function scAccept(c, s, api) {
    const { sfx, sfxFade, fade } = api;
    endingScene(c, api, 'A', (T) => {
      sfx(T.q3A0, 'q3A0', 1);                  // "Then teach me. I will walk it."
      sfx(T.long + 0.2, 'x3endA', 0.5);        // the ending's music: plain and warm, under the long moment he is looked at
      sfx(T.ph3A1, 'ph3A1', 1);                // "You say yes quickly. Yes to what?"
      sfx(T.q3A1, 'q3A1', 1);                  // "To hold it first. However many years. And then to use it for others. Not for myself."
      sfx(T.ph3A2, 'ph3A2', 1);                // "Good. Remember the order when it is slow. Slow is where people leave."
      sfx(T.bow + 0.9, 'x3kneel', 0.32);        // he bows, once
      sfx(T.tn3A1, 'tn3A1', 1);                // "New ones roll the mats, bro."
      fade(T.mats - 0.4, T.mats, 0, 1); fade(T.mats, T.mats + 0.12, 1, 1); fade(T.mats + 0.12, T.mats + 0.7, 1, 0);
      sfx(T.mats + 0.5, 'x3matroll', 0.32);     // mats being rolled; bare feet on turf
      sfx(T.q3A2, 'q3A2', 1);                  // "I had imagined something grander. My path began with other people's mats."
      sfx(T.q3A3 + 0.9, 'x3matset', 0.4);     // his mat laid on the stack
      sfx(T.q3A3, 'q3A3', 1);                  // "I did not mind. For once I knew what I was doing, and who I was doing it under."
      sfxFade(T.close - 2.0, T.close, 'x3endA');
    });
  }
  /* B · CHALLENGE THE PATH (bad) */
  function scChallenge(c, s, api) {
    const { sfx, sfxFade, fade } = api;
    endingScene(c, api, 'B', (T) => {
      sfx(T.q3B0, 'q3B0', 1);                  // "I sell amulets. I came into all of this for my business. I never asked for a path."
      sfx(T.ph3B1, 'ph3B1', 1);                // "Nobody asks."
      sfx(T.ph3B2, 'ph3B2', 1);                // "Tell me again how you came to this mat. Slowly."
      sfx(T.q3B1, 'q3B1', 1);                  // "A Sak Yant, for luck. Then another. A shop I kept going back to..."
      sfx(T.q3B1 + 0.6, 'x3endB', 0.57);       // the ending's music: spare, each step of his own named over it
      sfx(T.ph3B3, 'ph3B3', 1);                // "Who carried you?"
      sfxFade(T.silence - 0.4, T.silence + 2.2, 'x3endB');   // the music lets go into the long silence (the birds hold it; then the afternoon, the dusk: the ground's own sound to the close)
      /* (the long silence is held by the birds, and dusk by the crickets, on through the close: the beds, filmBeds) */
      sfx(T.q3B2, 'q3B2', 1);                  // "Nobody. I walked."
      fade(T.edge - 0.4, T.edge, 0, 1); fade(T.edge, T.edge + 0.15, 1, 1); fade(T.edge + 0.15, T.edge + 0.8, 1, 0);
      sfx(T.edge + 0.3, 'x3afternoon', 0.5);   // the afternoon: cicadas, a broom on the turf, people talking low
      sfx(T.q3B3, 'q3B3', 1);                  // "I sat there angry until the light went yellow. He never once looked my way."
      fade(T.dusk - 0.4, T.dusk, 0, 1); fade(T.dusk, T.dusk + 0.15, 1, 1); fade(T.dusk + 0.15, T.dusk + 0.9, 1, 0);
      sfxFade(T.dusk - 0.5, T.dusk + 0.3, 'x3afternoon');
      sfx(T.dusk + 0.9, 'x3bulbs', 0.35);      // a switch, and the string of bulbs humming on
      fade(T.back - 0.4, T.back, 0, 1); fade(T.back, T.back + 0.15, 1, 1); fade(T.back + 0.15, T.back + 0.8, 1, 0);
      sfx(T.back + 0.2, 'x3kneel', 0.32);       // he kneels in front of him again
      sfx(T.q3B4, 'q3B4', 1);                  // "All right. Teach me."
      sfx(T.ph3B4, 'ph3B4', 1);                // "A man who walked here can walk on."
      sfx(T.q3B5, 'q3B5', 1);                  // "I had not chosen the road. I had taken every step of it myself."
    });
  }
  /* C · ASK WHY (good) */
  function scWhy(c, s, api) {
    const { sfx, sfxFade } = api;
    endingScene(c, api, 'C', (T) => {
      sfx(T.q3C0, 'q3C0', 1);                  // "Why me? Of everyone in that shop, in that temple... why me?"
      sfx(T.ph3C1, 'ph3C1', 1);                // "Why me... that question has no floor. A man can fall in it his whole life."
      sfx(T.ph3C2, 'ph3C2', 1);                // "Ask a better one. For whom?"
      sfx(T.turn + 0.2, 'x3endC', 0.45);        // the ending's music: it opens as his head is turned
      sfx(T.turn + 0.6, 'x3waiting', 0.32);    // those who wait: a cough, a low word, sandals shifted on the turf
      sfx(T.q3C1, 'q3C1', 1);                  // "I had asked why it had happened to me. He turned my head and showed me who was waiting."
      sfx(T.ph3C3, 'ph3C3', 1);                // "What you have is for them. Not for you. One day. Not yet. First you hold it."
      sfx(T.q3C2, 'q3C2', 1);                  // "Then that is why."
      sfx(T.bow + 0.9, 'x3kneel', 0.32);        // he bows
      sfx(T.q3C3, 'q3C3', 1);                  // "Teach me."
      sfx(T.q3C4, 'q3C4', 1);                  // "I had asked why me. I was given something to do with it instead."
      sfxFade(T.close - 2.0, T.close, 'x3endC');
    });
  }
  /* D · ASK TO MAKE IT STOP (worst) */
  function scStop(c, s, api) {
    const { sfx, sfxFade, fade } = api;
    endingScene(c, api, 'D', (T) => {
      sfx(T.q3D0, 'q3D0', 1);                  // "Can you make it stop? I don't want a path. I want my life back."
      sfx(T.ph3D1, 'ph3D1', 1);                // "You are tired of it. I understand."
      sfx(T.ph3D2, 'ph3D2', 1);                // "I can teach you to close. I cannot take the door away."
      sfx(T.ph3D3, 'ph3D3', 1);                // "Close. And this time, stay."
      fade(T.shut + 0.2, T.shut + 0.8, 0, 1); fade(T.shut + 0.8, T.shut + 1.5, 1, 1); fade(T.shut + 1.5, T.shut + 2.6, 1, 0);   // his eyes close, and open on a plain world
      sfx(T.shut + 0.7, 'x3shut', 0.5);        // the world's sound closing down: one soft falling tone, and the flat room of his own head
      sfx(T.q3D1, 'q3D1', 1);                  // "For the first time in years, it was quiet."
      fade(T.sit - 0.4, T.sit, 0, 1); fade(T.sit, T.sit + 0.15, 1, 1); fade(T.sit + 0.15, T.sit + 0.9, 1, 0);
      sfx(T.sit - 0.5, 'x3sweep', 0.6);        // the ground cleared round him: a broom, mats, far voices, all of it flat (it leads the black by half a second: his line is left one second of true quiet, never more: a longer bare stretch reads as a fault, v21.30)
      sfx(T.chant + 0.3, 'x3chantfar', 0.5);   // the chanting, from the temple across the fields, on its loudspeakers (captioned)
      sfx(T.q3D2, 'q3D2', 1);                  // "The chanting came, and I waited for it to take me. Nothing. My hands were only my hands."
      sfx(T.q3D3, 'q3D3', 1);                  // "And then I understood what I had been afraid of all those years..."
      sfx(T.q3D3 + 1.5, 'x3endD', 0.4);        // the ending's music: it comes in as his eyes rise to the far bench
      sfxFade(T.back - 1.2, T.back + 0.4, 'x3chantfar');
      fade(T.back - 0.4, T.back, 0, 1); fade(T.back, T.back + 0.15, 1, 1); fade(T.back + 0.15, T.back + 0.8, 1, 0);
      sfx(T.back + 0.2, 'x3kneel', 0.32);       // he goes back, and kneels
      sfx(T.q3D4, 'q3D4', 1);                  // "If I can close it, I can carry it. Teach me the rest."
      sfx(T.ph3D4, 'ph3D4', 1);                // "Fear never closed it. You did."
      sfx(T.q3D5, 'q3D5', 1);                  // "I had asked him to take it away. He gave me the handle, and I found I could keep it."
      sfxFade(T.close - 2.0, T.close, 'x3endD');
    });
  }

  /* ====================================================== THE FILMS FROM PLAY (the plan's §4.1 P3, §4.2, §4.3 P7 and P8)
     Each film's pictures are the stage's (y_stage.js: stage.films); here are its clock's tracks, its fades and its cues. */

  /* THE OPENING FILM, THE QUESTIONS (§4.0): it begins on black and ends on black (the chapter's card comes up over
     it: v14.1), on the light and the spot play begins in */
  function introFilm(c, s, api) {
    const { tr, step, fade, sfx, sfxFade, rawK, stage } = api, T = OPENT;
    c.keepFade = true; c.endFade = 1;
    step(0, () => stage.films.begin('open', c, api));
    tr(0, T.end, (k, t) => stage.films.frame('open', t, api), rawK);
    fade(0, T.o1, 1, 1); fade(T.o1, T.o1 + 1.5, 1, 0);
    sfx(0.4, 'x3openmus', 0.66);                 // the film's own cue, under all of it
    /* (the shop at night, its fridge and the street far off: a bed, filmBeds) */
    sfx(T.q3o1, 'q3o1', 1);                     // "For years I had been searching for the answers to the same questions."
    sfx(T.q3o1 + 1.0, 'x3keys', 0.32);           // typing it
    sfx(T.q3o1 + SECS['q3o1'] + 0.9, 'x3send', 0.4);   // sent
    sfx(T.o2 + 0.3, 'x3page', 0.32);             // his notebook drawn to him
    sfx(T.q3o2, 'q3o2', 1);                     // "Why was I so sensitive?"
    sfx(T.q3o2 + 0.5, 'x3pen', 0.35);           // the pen, under each as he asks it
    sfx(T.q3o3, 'q3o3', 1);                     // "Could any of it be used to help others?"
    sfx(T.q3o3 + 0.8, 'x3pen', 0.35);
    sfx(T.q3o4, 'q3o4', 1);                     // "How could I cultivate enough to control it — and eventually use it at will?"
    sfx(T.q3o4 + 1.2, 'x3pen', 0.35);
    sfx(T.q3o5, 'q3o5', 1);                     // "I had met many practitioners and many masters. Some gave me advice..."
    sfx(T.q3o5 + SECS['q3o5'] - 1.6, 'x3page', 0.36);    // the page turned to a blank one on its last sentence
    fade(T.o3 - 0.35, T.o3, 0, 1); fade(T.o3, T.o3 + 0.12, 1, 1); fade(T.o3 + 0.12, T.o3 + 0.6, 1, 0);
    sfx(T.o3 + 2.3, 'x3zip', 0.5);              // the zip: it is packed
    fade(T.o3 + 2.2, T.o3 + 2.4, 0, 1); fade(T.o3 + 2.4, T.o3 + 2.55, 1, 1); fade(T.o3 + 2.55, T.o3 + 2.9, 1, 0);
    fade(T.o4 - 1.3, T.o4 - 0.5, 0, 1); fade(T.o4 - 0.5, T.o4, 1, 1);
    sfx(T.o4 - 1.2, 'x3cabin', 0.34);            // under the black, an aircraft cabin's hum
    sfxFade(T.o4 + 0.2, T.o4 + 1.4, 'x3cabin'); //   ... gives way to morning birds (the bed itself: filmBeds)
    fade(T.o4, T.o4 + 1.5, 1, 0);
    /* (up, and the noise with it: the ground's own crowd and its music are the BEDS, brought up by filmBeds, so the film
       ends on play's own sound) */
    sfx(T.q3o6, 'q3o6', 1);                     // "I was attending a Wai Kru ceremony in Thailand where many masters and practitioners were present."
    fade(T.black, T.end - 0.2, 0, 1);
    sfxFade(T.black - 0.6, T.end - 0.05, 'x3openmus');
    step(T.end, () => stage.films.end());
  }

  /* THE NIGHT BETWEEN (§4.2): from play's picture (the check) to black; five pictures, each lifted out of a short black
     and let back into one (the day, the light and the ground change in those blacks: v16.1); it ENDS IN THE CLEAR on
     the very picture play begins the morning in (the same eye, heading and lens: v5.25), so nothing snaps and no
     black is spent between a picture and itself. One line in the photograph (the woman who counts it in), then no word
     until Ton's. */
  function betweenFilm(c, s, api) {
    const { tr, step, fade, sfx, sfxFade, rawK, stage } = api, T = BETW;
    step(0, () => stage.films.begin('between', c, api));
    tr(0, T.end, (k, t) => stage.films.frame('between', t, api), rawK);
    /* (pushed in the order they happen: a seek applies every track it has passed in the order they were pushed) */
    fade(0, T.n1, 0, 1);
    [T.n1, T.n2, T.n3, T.n4, T.n5].forEach((m, i) => { if (i) fade(m - 0.4, m, 0, 1); fade(m, m + 0.12, 1, 1); fade(m + 0.12, m + 0.62, 1, 0); });
    sfx(0.2, 'x3nightmus', 0.5);                // the film's own cue: the day's noise falls away under it
    sfx(T.ds3p1, 'ds3p1', 1);                   // "Three, two, one!" (v26.8: Chad, 13 Nov)
    sfx(T.ds3p1 + 1.95, 'x3shutter', 1);        // the photograph is taken, as "one!" ends (its energy, 1.58 to 1.96 s)
    /* (the night: crickets, frogs, a far dog, through the room's shot, then first light's birds: the beds, filmBeds) */
    sfx(T.n5 + 0.5, 'x3cock', 0.25);            // first light: a cock, far off
    sfx(T.tn3n1, 'tn3n1', 1);                   // "Come. He is free now."
    sfxFade(T.tn3n1 + 0.4, T.end - 0.05, 'x3nightmus');
    step(T.end, () => stage.films.end());
  }

  /* THE TELLING (§4.3 P7): from play's own picture (he has bowed, and kneels) in the clear; it ends on a short black
     that the answers lift. Under each sentence, very low, the sound it remembers */
  function tellFilm(c, s, api) {
    const { tr, step, fade, sfx, sfxFade, rawK, stage } = api, T = TELL;
    c.keepFade = true; c.endFade = 1;
    step(0, () => stage.films.begin('tell', c, api));
    tr(0, T.end, (k, t) => stage.films.frame('tell', t, api), rawK);
    sfx(0.2, 'x3tellmus', 0.62);                 // the telling's own cue, low
    sfx(T.q3t1, 'q3t1', 1);                     // "Since I was a boy, I have been very sensitive. I feel things other people cannot feel."
    sfx(T.q3t1 + 1.0, 'x3mem1', 0.2);           //   a void deck at night: a far lift, a burner's fire
    sfx(T.q3t2, 'q3t2', 1);                     // "When I hear chanting, my body moves by itself, and I cannot control it."
    sfx(T.q3t2 + 0.9, 'x3mem2', 0.2);           //   monks chanting, far (wordless here: a hum of it)
    sfx(T.q3t3, 'q3t3', 1);                     // "When I hold an amulet, I can feel its energy. Every amulet feels different."
    sfx(T.q3t3 + 1.4, 'x3mem4', 0.22);          //   a cold breath of air; glass counters ticking (the amulet shop)
    sfx(T.q3t4, 'q3t4', 1);                     // "And I once kept three kumanthong, and opened my body to them."
    sfx(T.q3t4 + 0.9, 'x3mem5', 0.2);           //   a music box, three notes, slow
    sfx(T.q3t8, 'q3t8', 1);                     // "He listened."
    fade(T.black, T.end - 0.1, 0, 1);
    sfxFade(T.black - 0.5, T.end, 'x3tellmus');
    step(T.end, () => stage.films.end());
  }
  /* THE ANSWERS (§4.3 P8): out of the telling's black (or, the telling skipped, out of play: the film's first fade is
     then a blink); his eyes close once before the teaching; it ends in the clear on play's own picture */
  function answersFilm(c, s, api) {
    const { tr, step, fade, sfx, sfxFade, rawK, stage } = api, T = ANSW;
    step(0, () => stage.films.begin('answers', c, api));
    tr(0, T.end, (k, t) => stage.films.frame('answers', t, api), rawK);
    fade(0, 0.25, 1, 1); fade(0.25, 1.5, 1, 0);
    sfx(0.3, 'x3answmus', 0.4);                 // the answers' own cue
    sfx(T.q3a1, 'q3a1', 1);                     // "Then he said things that shocked me. He knew the answers to every question..."
    sfx(T.ph3n1, 'ph3n1', 1);                   // "Every person is born carrying something from past lives. Different people bring different things, and different baramee."
    sfx(T.ph3n2, 'ph3n2', 1);                   // "You brought yours with you. You were born with a gift, and with a mission."
    sfx(T.ph3n3, 'ph3n3', 1);                   // "But sensitivity alone is not enough. Without control, it will overwhelm you, and it will hurt you. You opened your body to the kumanthong..."
    fade(T.blink, T.blink + 0.2, 0, 1); fade(T.blink + 0.2, T.blink + 0.46, 1, 1); fade(T.blink + 0.46, T.blink + 0.85, 1, 0);   // his eyes close a moment, and open
    sfx(T.blink + 0.1, 'x3bell', 0.25);          // one small bell, far, under his closed eyes
    sfx(T.ph3n4, 'ph3n4', 1);                   // "So first, you learn control. To open when you choose, and to close when you choose."
    sfx(T.ph3n4 + 2.2, 'x3tone', 0.25);         //   the gold rises on him: the held tone, low
    sfxFade(T.ph3n4 + SECS['ph3n4'] + 0.9, T.end, 'x3answmus'); sfxFade(T.ph3n4 + SECS['ph3n4'] - 0.4, T.ph3n4 + SECS['ph3n4'] + 2.6, 'x3tone');
    step(T.end, () => stage.films.end());
  }

  /* THE FESTIVAL (§4.1 P3): it begins on play's own picture (he kneels at his place) and ends on its black, which the
     line at Grandmaster Pho's bench lifts */
  function festivalFilm(c, s, api) {
    const { tr, step, fade, sfx, sfxFade, rawK, stage } = api, T = FEST;
    c.keepFade = true; c.endFade = 1;
    step(0, () => stage.films.begin('festival', c, api));
    tr(0, T.end, (k, t) => stage.films.frame('festival', t, api), rawK);
    sfx(0.05, 'x3dancemus', 0.55);              // the music changes: the dance's own piece, over the loudspeakers
    sfx(T.tn3d1, 'tn3d1', 1);                  // "For the Thevadas. To show respect."
    sfx(T.q3m0, 'q3m0', 1);                    // "I knew those hands. Mine had moved like that, by themselves."
    fade(T.cut, T.cut + 0.45, 0, 1); fade(T.cut + 0.45, T.cut + 0.8, 1, 1); fade(T.cut + 0.8, T.masters + 0.1, 1, 0);
    sfxFade(T.cut - 0.6, T.cut + 0.7, 'x3dancemus');
    /* (the festival's own music again, and the ground's noise: the beds, filmBeds) */
    sfx(T.q3m1, 'q3m1', 1);                    // "One by one they went up with their bai sri..."
    sfx(T.throw, 'x3petals', 0.4);             // the hermit's handful, falling on her
    sfx(T.man + 1.0, 'x3trance', 0.45);        // the man whose arms rise: a low voiced breath (wordless)
    sfx(T.pho - 0.05, 'x3tone', 0.32);          // the man in white: one held tone and a bell, on the cut to him
    sfx(T.pho + 0.6, 'x3sightmus', 0.7);      // and his own music, under the three sentences that name him
    sfx(T.throw2, 'x3petals', 0.36);            // his own handful
    sfx(T.q3w1, 'q3w1', 1);                    // "Only one person caught my attention."
    sfx(T.q3w2, 'q3w2', 1);                    // "He was dressed in white and carried the presence of a true master."
    sfx(T.q3w3, 'q3w3', 1);                    // "That person was Grandmaster Pho, and something inside me knew..."
    fade(T.black, T.end - 0.15, 0, 1);
    sfxFade(T.black - 0.4, T.end - 0.05, 'x3tone'); sfxFade(T.black - 0.5, T.end - 0.05, 'x3sightmus');
    step(T.end, () => stage.films.end());
  }

  (window.__CHAPTERS__ = window.__CHAPTERS__ || {}).e4c3 = Object.assign(DATA, {
    build,
    intro: introFilm,
    scenes: [scAccept, scChallenge, scWhy, scStop],
    films: { festival: festivalFilm, between: betweenFilm, tell: tellFilm, answers: answersFilm }
  });
})();
