
  /* ================================================================ THE FILMS AND THE FOUR ENDINGS · TODO-FILM, every one
     EACH IS A STUB: a few seconds of the place as it stands, with no word said and no sound cued, ending as its kind
     must (the opening on its black, the title over it; a film from play back in play with the picture clear; an ending
     on its black, the card over it). So the chapter runs from its first frame to its four cards and nothing soft-locks.
     WHEN ONE IS BUILT: its lines are SAID.<place>, in the script's order; its clock is made by tl() from SECS, so a
     measured take moves everything after it (v5.15); its pictures are the stage's (a `films` handle on the stage, as
     chapter 4's c_ufilm.js) and are a pure function of the film's clock (v6.4); every cue is a literal call of the
     film language's sound verb, with the sound's name in quotes, in the film's own source, so the engine can read it
     and warm it (v10.2, v14.16), and none is written past the film's last track (v12.3). A cue needs its sound in the
     build first (its take in assets/audio, its row in main.js's STING_SAMPLE): chaptertest fails a cue that plays
     nothing, which is why a stub cues none (and why this comment does not spell one out: the scan reads comments too). */
  const STUB = { open: 4.0, film: 3.4, ending: 4.0 };          // seconds; a film from play is past 3.0 so that Skip is offered too

  /* a film from play, as a stub: the picture held where he stands, then play again */
  function stubFilm(c, s, api) {
    const { tr, step, rawK } = api, T = STUB.film;
    tr(0, T, () => {}, rawK);
    step(T, () => {});
  }
  /* an ending, as a stub: the picture held, then its black, which the outcome card lies over */
  function stubEnding(c, s, api) {
    const { tr, step, fade, rawK } = api, T = STUB.ending;
    tr(0, T, () => {}, rawK);
    fade(T - 1.0, T - 0.2, 0, 1);
    step(T, () => {});
    c.endFade = 1; c.keepFade = true;
  }

  /* THE OPENING FILM (the plan's 4.0: dusk; about 65 s; skip from 3 s) · TODO-FILM
     Black, a lift's hum, his thought (q5o1); inside a lift car through his eyes, Grandmaster Pho in white in front of
     him, Ton with something long wrapped in cloth, Jun with a duffel bag (ju5o1, tn5o1); the chime, the doors open on an
     open walkway in orange evening light, one step out and the picture SOURS (q5o2); the title. Play begins where the
     film left him, a step outside the lift. Its lines: SAID.open.
     It begins on black (v4.6) and keeps its black at its end, the title over it (v14.1). */
  function intro(c, s, api) {
    const { tr, step, fade, rawK } = api, T = STUB.open;
    tr(0, T, () => {}, rawK);
    fade(0.5, 1.6, 1, 0);
    fade(T - 0.9, T - 0.2, 0, 1);
    step(T, () => {});
    c.keepFade = true; c.endFade = 1;
  }

  /* THE DEVOTEE (the plan's 4.2: about 45 s), from the gate into the hunt · TODO-FILM
     Mr Koh opens his doors before they reach them, a wai to Grandmaster Pho, awkward and meant; the court crossed, in
     which nothing looks wrong to an ordinary eye and never will; his living room, curtains drawn at dusk, three lamps
     on and a fourth flickering; what has been happening to him, and that he has quarrelled with people (he does not
     say who, and nobody asks); "We will look first."; his teacher's order to the student. Its lines: SAID.devotee. */
  function filmDevotee(c, s, api) { stubFilm(c, s, api); }

  /* THE PREPARATION, AND THE TURN (the plan's 4.4: about 50 s), from the hunt into the fight · TODO-FILM
     Night now. Ton unwraps the Naga stick and Grandmaster Pho takes it; Jun lays the black bag down and draws white
     thread across the doorway, the household behind it; "Stand with me."; the stick set upright, the lamps sink, his
     Spirit Vision opens without his asking and the nine lift their heads; they turn toward the one whose senses are
     open, and come; the picture goes to the one flat colour of his protection (q5p1), a murmur begins; THE CAMERA
     LEAVES HIS EYES, and for the first time in the game Master Zavier is SEEN (Chad's R3 and R5), the picture coming
     to rest exactly where the fight's camera stands, so the film hands to the fight with no cut. Its lines: SAID.prepare. */
  function filmPrepare(c, s, api) { stubFilm(c, s, api); }

  /* TOGETHER (the plan's 5.5, stage 5: 25 s; it cannot be skipped the first time: kit.film's noSkip and
     ctx.sealedBefore, the forty-first seam), the ONE film inside the fight · TODO-FILM, FIGHT-DRAFT
     Grandmaster Pho plants the Naga stick. The Naga rises from its head, ruby and vast, and lays its long body once
     round the court's edge, between the nine and everyone in the court and at its door; the tall shape comes apart
     into its three, and they sink low and lie tired. The fight's mode is left before it and entered again after it,
     under its own fades (the plan's 5.11). NOT YET PLAYED: the stand-in for the fight passes it by. */
  function filmTogether(c, s, api) { stubFilm(c, s, api); }

  /* THE BAG TIED (the plan's 4.6: about 60 s), from the fight to the next afternoon · TODO-FILM
     The last of the nine is in the bag; the cage of light thins and the murmur stops in the middle of a breath; the
     camera goes back INTO his eyes, and the hands in front of him are his own again and shaking. Three shorter
     pictures of the rooms, the bag still open in Grandmaster Pho's hand; ONLY THEN the knot, the bag's own cord, tied
     "tightly" (no sacred string and no chant here: both are case three's); what Ton felt in his hands; Mr Koh's windows
     opened on night air, "Both can be true.", his teacher's two lines to him; at the lift, "Was it real?" and the case
     file's second lesson; the next case seeded; the lift's doors close on black; the card W.cardNext, "The next
     afternoon." Its lines: SAID.bagtied. */
  function filmBagTied(c, s, api) { stubFilm(c, s, api); }

  /* THE COLLECTOR, the film in (the plan's 4.7: 20 s), into the table · TODO-FILM
     Daylight. A low table covered with a white cloth, Grandmaster Pho seated behind it, a ceiling fan turning, the
     afternoon in the window; a man in his thirties sets down a padded case and lays its pieces out himself, quickly,
     the way a man gets rid of something: about twenty, in rows. Its lines: the first two of SAID.table (co5t1, co5t2). */
  function filmCollector(c, s, api) { stubFilm(c, s, api); }

  /* THE FOUR ENDINGS (the plan's 4.9), each a whole story, each ending that afternoon, and in each THE RITE, seen: the
     case file's own. Grandmaster Pho chants low and sprinkles holy water over the pieces with the fan; the film holds
     his Spirit Vision open for the rite's length; as the water touches them the presences cry out and come away from
     the pieces, each leaving the light of the table, thin and far (none is shown destroyed); the pieces are gathered
     into a black bag, sealed with white sacred string and chanted over "so that nothing could escape"; the smell goes
     (co5z1). THE LAST PICTURE, in every ending: the black bag on the white cloth, the string round its neck,
     Grandmaster Pho's hand resting on it, the empty foam case open beside it (q5z1). Then the lesson card.
     Each ending's lines: SAID.endA to SAID.endD, then SAID.close. TODO-FILM: all four, and the rite they share. */
  /* A · "NONE OF THEM. LET THEM ALL GO." (good): the right act and no understanding, an order; he will buy again */
  function scNone(c, s, api) { stubEnding(c, s, api); }
  /* B · "TELL ME WHAT EACH ONE IS, AND WHERE IT CAME FROM." (best): the case file's own plain questions, and the man
     answers them himself; he closes the case's lid and pushes it across the cloth */
  function scTell(c, s, api) { stubEnding(c, s, api); }
  /* C · "THESE THREE ARE THE WORST. THE REST FEEL QUIET." (bad): the student made his appraiser; on a piece already
     packed, something his nose never caught lifts its head */
  function scThree(c, s, api) { stubEnding(c, s, api); }
  /* D · "KEEP THE HOLY ONES. THE YIN ONES ARE THE TROUBLE." (worst): a rule about kinds of object, which the case file
     refuses in its first sentence; he is already counting twenty more on his fingers */
  function scHoly(c, s, api) { stubEnding(c, s, api); }

  (window.__CHAPTERS__ = window.__CHAPTERS__ || {}).e4c5 = Object.assign(DATA, {
    build,
    intro,
    films: { devotee: filmDevotee, prepare: filmPrepare, together: filmTogether, bagtied: filmBagTied, collector: filmCollector },
    scenes: [scNone, scTell, scThree, scHoly]
  });
})();
