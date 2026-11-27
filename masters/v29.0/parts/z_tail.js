  /* ================================================================ THE FILMS AND THE FOUR ENDINGS · TODO-FILM, every one
     (FILMS, M7: the plan's 9, shot by shot, with its sound column and its lenses phone / desk)
     EACH IS A STUB: a few seconds of the place as it stands, with no word said and no sound cued, ending as its kind
     must (the opening on its black, the title over it; a film from play back in play with the picture clear; an ending
     on its black, the card over it). So the chapter runs from its first frame to its four cards and nothing soft-locks.
     WHEN ONE IS BUILT: its lines are SAID.<place>, in the script's order; its clock is made by tl() from SECS, so a
     measured take moves everything after it (v5.15); its pictures are the stage's (c_yfilm.js) and are a pure function
     of the film's clock (v6.4); every cue is a literal call of the film language's sound verb, with the sound's name in
     quotes, in the film's own source, so the engine can read it and warm it (v10.2), and none is written past the film's
     last track (v12.3). A cue needs its sound in the build first (its take in assets/audio, its row in main.js's
     STING_SAMPLE): chaptertest fails a cue that plays nothing, which is why a stub cues none. A chant's captions are
     CHANTS.<key>, timed on the take's breaths (kit.captions). */
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

  /* THE OPENING · "Blue hour" (the plan's 9.1: about 68 s; skip from 3 s) · TODO-FILM
     Black, the street's bed, his thought (zv51o1); the crane down the shophouse row at blue hour to Marcus waiting by the
     stair door, a taxi drawing in (zv51o2); his eyes out of the taxi (mk51o1, ph51o1); the stair, the tube flickering; the
     landing, her door, Grace (mk51o2, gr51o1, ph51o2); inside, he kneels by the windows and in the black glass her
     reflection faces the stairs (zv51o3); the card. Play begins where the film left him, at his place by her windows (no
     "Loading" after an opening film: v15.3). Its lines: SAID.open. It begins on black (v4.6) and keeps its black at its
     end, the title over it (v14.1). */
  function intro(c, s, api) {
    const { tr, step, fade, rawK } = api, T = STUB.open;
    tr(0, T, () => {}, rawK);
    fade(0.5, 1.6, 1, 0);
    fade(T - 0.9, T - 0.2, 0, 1);
    step(T, () => {});
    c.keepFade = true; c.endFade = 1;
  }

  /* THE KEEPSAKE (the plan's 9.2: about 42 s), from the room into the breaking · TODO-FILM
     Pho's open hand across the cloth (ph51k1); her hand that will not open; the packet set apart on a small white plate;
     the bowl in his hands (ph51k2); three drops of wax and the chant begins (ph51ratana, captioned from CHANTS); into the
     event's brief. Its lines: SAID.keepsake. */
  function filmKeepsake(c, s, api) { stubFilm(c, s, api); }

  /* THE CORD (the plan's 9.3: about 55 s), from the breaking · TODO-FILM
     The last strand snaps by itself, in slow motion: a wisp of red slips round his wrist under the bowl and is gone; Grace
     breathes out and cries (ph51c1); her phone face down (zv51c1); the packet bound in white thread (ph51c2, ph51c3,
     mk51c1, gr51c1); the bottle for his altar (ph51c4, ph51c5); his look at his wrist (zv51c2). Its lines: SAID.cord. */
  function filmCord(c, s, api) { stubFilm(c, s, api); }

  /* HOME (the plan's 9.4: about 50 s; 11:52 PM), into three o'clock · TODO-FILM
     The corridor, the keycard, his dark flat and the city through the glass; the bottle on his altar; his phone on its
     charger; the shower, the bed, 11:58; his eyes closing (zv51h1); 3:00. Play begins in bed. Its lines: SAID.home. */
  function filmHome(c, s, api) { stubFilm(c, s, api); }

  /* THE FOUR ENDINGS (the plan's 9.8), each a whole story: its own beginning, then THE BARRIER (its 9.7, the case file's:
     the call on the speaker, the white thread, CLOSE THE CIRCLE inside it by eventWait (W.evCircleTitle), the
     Jinapañjara through the phone with its captions, the gold rising and the red threads burning, the release) and THE
     DAWN (its 9.9: Pho at the door with breakfast, the thread wound up, the ending's own line, the thread tied on his
     wrist). Each ending's lines: SAID.endA to SAID.endD, with SAID.barrier and SAID.dawn. Then the four lines and the
     lesson card. TODO-FILM: all four, and the barrier and the dawn they share. */
  /* A · "CALL GRANDMASTER PHO NOW." (best): he knows at once that it is more than him, and asks */
  function scCall(c, s, api) { stubEnding(c, s, api); }
  /* B · "DON'T WAKE HIM. IT'S THREE IN THE MORNING." (good): humility misread; 3:41, the call made at last */
  function scWait(c, s, api) { stubEnding(c, s, api); }
  /* C · "IT'S ONLY A MIGRAINE. TAKE A PILL AND SLEEP." (bad): dismissal before looking; 3:22, the call */
  function scPill(c, s, api) { stubEnding(c, s, api); }
  /* D · "OPEN SPIRIT VISION AND FIND WHO'S DOING THIS." (worst): curiosity dressed as courage; a thread wraps his wrist at
     the balcony's door (he never goes past its frame), then the call */
  function scSeek(c, s, api) { stubEnding(c, s, api); }

  (window.__CHAPTERS__ = window.__CHAPTERS__ || {}).e5c1 = Object.assign(DATA, {
    build,
    intro,
    films: { keepsake: filmKeepsake, cord: filmCord, home: filmHome },
    scenes: [scCall, scWait, scPill, scSeek]
  });
})();
