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

  /* PREVIEW ONLY (the tracker's D12): the chapter is shown to Chad at milestones before its voices are made (M7), and a
     build with no voice in it cannot be followed. So while the chapter is a preview each line's words stand as a
     caption for as long as it is "said" (d_play.js subs; y_stage.js filmSubs). The table and both readers go when the
     chapter leaves preview; SUBS false turns them off before that (once the takes are in). */
  const SUBS = true;
  /* WORDS BEGIN */
  const WORDS = {      // PREVIEW ONLY: 104 lines, written by masters/v26.0/script/words.py
    'q3o1': "For years I had been searching for the answers to the same questions.",
    'q3o2': "Why was I so sensitive?",
    'q3o3': "Could any of it be used to help others?",
    'q3o4': "How could I cultivate enough to control it — and eventually use it at will?",
    'q3o5': "I had met many practitioners and many masters. Some gave me advice. Some gave me experiences. Nobody could really explain the truth of it to me.",
    'q3o6': "I was attending a Wai Kru ceremony in Thailand where many masters and practitioners were present.",
    'q3v': "So many masters in one place. I did not know where to look.",
    'tn3a1': "Ton: You are from the forum, right? First time?",
    'q3p1': "First time.",
    'tn3a2': "Ton: Take one. It is yours to present, when you are ready. Pay respect at the tables first.",
    'tn3d1': "Ton: For the Thevadas. To show respect.",
    'q3m0': "I knew those hands. Mine had moved like that, by themselves.",
    'q3m1': "One by one they went up with their bai sri, and some of them went somewhere I could not follow.",
    'q3w1': "Only one person caught my attention.",
    'q3w2': "He was dressed in white and carried the presence of a true master.",
    'q3w3': "That person was Grandmaster Pho, and something inside me knew I had to speak to him one day.",
    'q3u1': "Not here. Not now.",
    'q3u2': "It passed. He was looking straight at me.",
    'tn3m1': "Ton: You are next. Go.",
    'q3u3': "Not yet. The last time I knelt to a master I did not know, I went home in a fog.",
    'tn3m2': "Ton: Okay. Nobody pushes here. Keep it. When you are ready.",
    'q3c1': "The one in white. Who is he?",
    'tn3c1': "Ton: That is Grandmaster Pho. Don't take my word. Ask the people who have sat with him.",
    'q3c2': "Auntie, can I ask you about him?",
    'ds3c1': "The woman at his bench: I came like you, with questions. Sit with him first. Then decide for yourself.",
    'tn3c2': "Ton: Tomorrow morning he receives people. Come early. I bring you.",
    'q3c3': "I had learned to ask first. Everything I heard said the same thing: go and sit with him.",
    'tn3n1': "Ton: Come. He is free now.",
    'ph3g1': "Grandmaster Pho: Sit. Ton tells me you carry questions. Put them down here.",
    'q3t1': "Since I was a boy I have felt things other people did not.",
    'q3t2': "When I listen to chanting, my hands move by themselves. In temples my body bows in ways I never learned.",
    'q3t3': "On Buddha Day something danced in my body for fifteen minutes. A medium called it a ghost, and it roared at him.",
    'q3t4': "I pick up a piece in a shop and cold runs up my arm.",
    'q3t5': "I kept three kumanthong, and I opened myself to them, one by one. I should not have.",
    'q3t6': "After one trip a fog sat on my mind until a hermit cleared it.",
    'q3t7': "I don't know why I am like this. I don't know what it is for. I don't know how to stop it, or how to use it.",
    'q3t8': "He listened.",
    'q3a1': "Then he said things that shocked me. He knew the answers to every question I had been carrying for years.",
    'ph3n1': "Grandmaster Pho: When it takes your hands, you are awake. You watch it happen. You did not tell me that part.",
    'ph3n2': "Grandmaster Pho: That is what frightens you. Not the moving. The watching.",
    'ph3n3': "Grandmaster Pho: You ask why. What you feel was not put into you. It was there already, asleep.",
    'ph3n4': "Grandmaster Pho: The ink, the chanting, the pieces you held... they did not give it to you. They woke it.",
    'ph3n5': "Grandmaster Pho: The rest of that answer is heavy. I will give it when you can carry it.",
    'ph3n6': "Grandmaster Pho: What is it for? A lamp is not lit for the lamp. It is lit for whoever is in the room.",
    'ph3n7': "Grandmaster Pho: And how to use it... you ask that first. It comes last.",
    'ph3g2': "Grandmaster Pho: First, control.",
    'ph3g3': "Grandmaster Pho: To feel is not enough. A door that cannot close is not a door. It is a hole in the wall, and everything walks through.",
    'ph3g4': "Grandmaster Pho: With control you open when you choose. You close when you choose.",
    'ph3g5': "Grandmaster Pho: When to open. When to close. That is the whole practice.",
    'ph3b0': "Grandmaster Pho: I show you. Breathe with me.",
    'ph3b1': "Grandmaster Pho: Open.",
    'ph3b2': "Grandmaster Pho: Close.",
    'ph3b3': "Grandmaster Pho: Again. This time you choose when.",
    'ph3b4': "Grandmaster Pho: Once more. It will pull. Close anyway.",
    'ph3bx': "Grandmaster Pho: Close.",
    'ph3by': "Grandmaster Pho: You did not open. Do not be afraid of it.",
    'ph3b5': "Grandmaster Pho: Good. Now it is yours to open, and yours to close.",
    'ph3p1': "Grandmaster Pho: This is a path. It does not end this morning.",
    'ph3p2': "Grandmaster Pho: First you learn to hold it. That is years.",
    'ph3p3': "Grandmaster Pho: Then you use it for others. Not for yourself.",
    'q3A0': "Then teach me. I will walk it.",
    'ph3A1': "Grandmaster Pho: You say yes quickly. Yes to what?",
    'q3A1': "To hold it first. However many years. And then to use it for others. Not for myself.",
    'ph3A2': "Grandmaster Pho: Good. Remember the order when it is slow. Slow is where people leave.",
    'tn3A1': "Ton: New ones roll the mats, bro.",
    'q3A2': "I had imagined something grander. My path began with other people's mats.",
    'q3A3': "I did not mind. For once I knew what I was doing, and who I was doing it under.",
    'q3B0': "I sell amulets. I came into all of this for my business. I never asked for a path.",
    'ph3B1': "Grandmaster Pho: Nobody asks.",
    'ph3B2': "Grandmaster Pho: Tell me again how you came to this mat. Slowly.",
    'q3B1': "A Sak Yant, for luck. Then another. A shop I kept going back to. Pieces I picked up to see what they would do. Three children I took home. A master I went to about my business.",
    'ph3B3': "Grandmaster Pho: Who carried you?",
    'q3B2': "Nobody. I walked.",
    'q3B3': "I sat there angry until the light went yellow. He never once looked my way.",
    'q3B4': "All right. Teach me.",
    'ph3B4': "Grandmaster Pho: A man who walked here can walk on.",
    'q3B5': "I had not chosen the road. I had taken every step of it myself.",
    'q3C0': "Why me? Of everyone in that shop, in that temple... why me?",
    'ph3C1': "Grandmaster Pho: Why me... that question has no floor. A man can fall in it his whole life.",
    'ph3C2': "Grandmaster Pho: Ask a better one. For whom?",
    'q3C1': "I had asked why it had happened to me. He turned my head and showed me who was waiting.",
    'ph3C3': "Grandmaster Pho: What you have is for them. Not for you. One day. Not yet. First you hold it.",
    'q3C2': "Then that is why.",
    'q3C3': "Teach me.",
    'q3C4': "I had asked why me. I was given something to do with it instead.",
    'q3D0': "Can you make it stop? I don't want a path. I want my life back.",
    'ph3D1': "Grandmaster Pho: You are tired of it. I understand.",
    'ph3D2': "Grandmaster Pho: I can teach you to close. I cannot take the door away.",
    'ph3D3': "Grandmaster Pho: Close. And this time, stay.",
    'q3D1': "For the first time in years, it was quiet.",
    'q3D2': "The chanting came, and I waited for it to take me. Nothing. My hands were only my hands.",
    'q3D3': "And then I understood what I had been afraid of all those years. It was never the door. It was that I could not shut it.",
    'q3D4': "If I can close it, I can carry it. Teach me the rest.",
    'ph3D4': "Grandmaster Pho: Fear never closed it. You did.",
    'q3D5': "I had asked him to take it away. He gave me the handle, and I found I could keep it.",
    'ph3z0': "Grandmaster Pho: Yesterday you would not kneel to a man you did not know. Good. Keep that.",
    'ph3z1': "Grandmaster Pho: It is not the flowers you give a teacher. It is your trust. Give that slowly.",
    'q3z1': "Yesterday I watched people go where I could not follow. Today I opened the door a hand's width, and shut it myself.",
    'ph3z2': "Grandmaster Pho: Tomorrow we begin.",
    'q3K1': "For the first time in my life I had found the teacher who could guide me to the real answers, and I will always be grateful for it.",
    'q3A': "I said yes. He made me say what to.",
    'q3B': "I told him I never chose it. He asked who had carried me.",
    'q3C': "I asked why me. He showed me for whom.",
    'q3D': "I asked him to take it away. He gave me the handle."
  };
  /* WORDS END */

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
  const BETW = tl(0, [[0.6], ['@n1'], [4.2], ['@n2'], [3.3], ['@n3'], [3.8], ['@n4'], [4.0], ['@n5'], [2.0], ['tn3n1', 0.9]]);

  /* THE TELLING (§4.3 P7): his eight sentences, a breath between each; "He listened."; a short black */
  const TELL = tl(0, [[0.9], ['q3t1', 0.7], ['q3t2', 0.8], ['q3t3', 0.8], ['q3t4', 0.8], ['q3t5', 0.9], ['q3t6', 0.8], ['q3t7', 1.5], ['q3t8', 1.5], ['@black'], [0.6]]);
  /* THE ANSWERS (§4.3 P8): out of that black; his line; Grandmaster Pho's seven; his eyes close a moment (@blink); the
     first teaching, four lines; it ends in the clear on play's own picture */
  const ANSW = tl(0, [[0.6], ['q3a1', 0.9], ['ph3n1', 0.8], ['ph3n2', 1.2], ['ph3n3', 0.8], ['ph3n4', 1.0], ['ph3n5', 1.3], ['ph3n6', 1.2], ['ph3n7', 1.1],
                      ['@blink'], [0.9], ['ph3g2', 1.4], ['ph3g3', 1.0], ['ph3g4', 0.9], ['ph3g5', 1.2]]);

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
     two lines; both the old man's hands laid on it; a handful of petals; ONE BREATH, played (the film waits for it);
     his line; the bai sri taken from him and set on the table; "Tomorrow we begin."; the case file's last words */
  const CLOSE = tl(0, [[0.7], ['@take'], [3.5], ['ph3z0', 0.8], ['ph3z1', 0.9], ['@hands'], [3.0], ['@petals'], [3.8], ['@breath'], [1.4], ['q3z1', 1.0],
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
      'e4hermitam', 'e4hermitaf', 'e4hermitb', 'e4hermitbm', 'e4hermitbf', 'e4red', 'e4redm', 'e4redf', 'e4white',
      'e4whitem', 'e4whitef', 'e4dancera', 'e4danceram', 'e4danceraf', 'e4dancerb', 'e4dancerbm', 'e4dancerbf',
      'e4deva', 'e4devam', 'e4devaf', 'e4devb', 'e4devbm', 'e4devbf', 'e4devc', 'e4devcm', 'e4devcf', 'e4devd',
      'e4devdm', 'e4devdf', 'e4deve', 'e4devem', 'e4devef', 'e4devf', 'e4devfm', 'e4devff', 'e4devg', 'e4devgm',
      'e4devgf', 'e4devh', 'e4devhm', 'e4devhf', 'pho', 'phof', 'w3baisri', 'w3naga', 'w3wheel', 'w3parasol',
      'w3tower', 'w3candle', 'w3fan', 'w3nagastaff', 'w3pewter', 'w3purple', 'w3fruit', 'w3sweets', 'w3khantok',
      'w3puff', 'w3chair', 'w3lowtable', 'w3bench', 'w3sofa', 'w3petalbowl', 'w3petalsteel', 'w3smallbaisri',
      'w3candlemid', 'w3candlesmall', 'w3kratip', 'w3chicken', 'w3coconut', 'w3soda', 'w3water', 'w3matroll',
      'w3shirt', 'w3nagafount', 'w3nagagreen', 'w3nagawhite', 'w3ganesha', 'w3croton', 'w3dracaena', 'w3waterjar',
      'w3walllamp', 'w3t_turf', 'w3t_petalturf', 'w3t_earth', 'w3t_gravel', 'w3t_redplank', 'w3t_tin', 'w3t_brick',
      'w3t_skirt', 'w3t_satin', 'w3t_mat', 'w3t_carpet', 'w3t_swag', 'w3t_banner', 'w3t_treeline', 'w3t_redroof',
      'w3t_hallbrick', 'w3t_steptile', 'w3t_lawn', 'w3t_kalae', 'w3t_fretwork', 'w3t_sign',
      /* <<< this chapter's own keys <<< */
      /* the trees of this episode's first chapter (reuseInEpisode) */
      'e4raintree', 'e4mango', 'e4raintreehd', 'e4mangohd',
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
             monkshop: "Chad's monk, for the three monks who sit under the east tent as monks sit at a real Wai Kru (photograph 2): the one monk he has made, as episode 3 chapter 3's shop wears him",
             monkrow: "the same monk's light cut (episode 3 chapter 2's row), drawn for those three when they are far across the turf" },
    reuseInEpisode: { e4raintree: "the rain tree of chapter 1's countryside, standing round the ground: the same country's trees, and no tree is built in code (v24.20)",
                      e4mango: "the mango of chapter 1's countryside, likewise",
                      e4raintreehd: "the same rain tree at its fuller level, for the one that stands over the turf",
                      e4mangohd: "the same mango at its fuller level, for the one behind the chief canopy",
                      e4bag: "his own bag, the one chapter 2 packed: on his counter in the opening film, and beside his bai sri on the sill of the rented room (the film between the days)",
                      e4notebook: "his own notebook, the one chapter 2's coda left open on his counter: the opening film reads its next page" },
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
      // the opening film: what he types under the forum's thread (the thread's own words are chapter 2's, shown again)
      forumReply: "I'll come. First time.",
      forumSent: 'Sent',
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

