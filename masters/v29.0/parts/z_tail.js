  /* ================================================================ THE FILMS' CLOCKS AND CUES (masters/v29.0/parts/z_tail.js:
     FILMS-1's, M7: the opening, the keepsake, the cord and home; their pictures are the stage's, c_yfilm.js FILMS1, reached as
     api.stage.films.films). Each clock is built from SECS (a_head.js) by tl() and by marks laid after each measured line, so a
     measured take moves everything after it (v5.15). Every cue is a literal call of the film language's sound verb in the
     film's own source, so the engine's reading of a scene warms it and chaptertest checks it (v10.2), none is written past the
     film's last track (v12.3), and each lands on its second: an effect is cued its own hit early (masters/v29.0/sound/
     picks.json: `hit`, the moment in its file the sound's event lands). The voices are the lines' own takes, each on its
     measured start, one at a time. THE BEDS: the street's, the stair's and the corridor's are these films' own cues; her
     flat's, his flat's and the two music beds of the room (M2, M3) are the play's loops, each film writing how loud it wants
     them every frame (stage.beds.film: PLAY.md 5). THE CHANT (Grandmaster Pho's Ratana, from the keepsake's 32 s to the cord's
     8 s) is the play's world sound (stage.chant: PLAY.md 1): the keepsake begins it by a step and cues no copy of it, and lays
     none of its captions. masters/v29.0/FILMS.md is the record. */
  const STUB = { open: 4.0, film: 3.4, ending: 4.0 };          // (the endings' stubs, y_endings.js, FILMS-2's until theirs land)
  /* an ending, as a stub: the picture held, then its black, which the outcome card lies over */
  function stubEnding(c, s, api) {
    const { tr, step, fade, rawK } = api, T = STUB.ending;
    tr(0, T, () => {}, rawK);
    fade(T - 1.0, T - 0.2, 0, 1);
    step(T, () => {});
    c.endFade = 1; c.keepFade = true;
  }

  /* THE OPENING · "Blue hour" (the plan's 9.1). The plan's seconds where its lines allow them; where a measured line runs
     longer than the plan's gap, what follows waits for it (Marcus's first line is 3.91 s: his teacher answers at 21.3 s, not
     20.0; the stair from 24.6 s) */
  const OP51 = (() => {
    const T = { moto: 0.0, o1: 1.0, up: 2.0, o2: 2.6, m1: 3.5, bus: 8.0, fan: 12.5, taxi: 13.0, stop: 14.85, out: 15.5, door: 15.6, mk1: 17.0 };
    T.ph1 = T.mk1 + SECS.mk51o1 + 0.35;                        // "Thank you. Show us the way."
    T.look = T.ph1 + 0.75;                                      // Marcus looks up at her windows (M3's first breath)
    T.turn = T.ph1 + SECS.ph51o1 + 0.05;                        // Marcus to the stair door
    T.stair = T.turn + 0.85;                                    // the cut to the stair
    T.climb = T.stair + 0.3;
    T.tube = T.stair + 5.0;                                     // the tube flickers twice; Marcus stops and looks back down
    T.land = T.stair + 10.0;                                    // the cut to the landing
    T.knock = T.land + 0.6;                                     // the first knock (the second 0.29 s after)
    T.mk2 = T.land + 1.5;                                       // "Grace? They're here."
    T.lock = T.mk2 + SECS.mk51o2 - 0.9;                         // the lock, the door's old hinge (under his line's end)
    T.gr1 = Math.max(T.mk2 + SECS.mk51o2 + 0.3, T.lock + 1.4);  // "Come in. Sorry about the mess."
    T.ph2 = T.gr1 + SECS.gr51o1 + 0.2;                          // "Thank you for letting us in."
    T.inn = Math.max(T.land + 12.0, T.ph2 + SECS.ph51o2 + 1.3); // the cut inside
    T.cloth = T.inn + 0.5;                                      // the cloth shaken out
    T.o3 = T.inn + 1.0;                                         // "She had let us in. But something kept turning her back to the door."
    T.gecko = T.inn + 2.5;
    T.kneel = T.inn + 3.35;                                     // he kneels at his place (eased over 1.2 s)
    T.m3b = T.inn + 4.0;                                        // M3: a low cello note bending down
    T.turnG = T.kneel + 1.2;                                    // his look to the glass, over 1.8 s
    T.narrow = T.turnG + 1.8;                                   // the lens narrows on the glass over 7 s
    T.sofa = T.inn + 10.0;                                      // she comes to the sofa; her reflection follows a beat late
    T.black = T.inn + 14.0;                                     // black: the title over it
    T.end = T.black + 1.7;
    return T;
  })();
  function intro(c, s, api) {
    const { tr, step, sfx, sfxFade, fade, rawK, stage } = api, T = OP51, F = stage.films.films.open;
    step(0, () => F.begin(api, s));
    tr(0, T.end, (k, t) => F.frame(t), rawK);
    fade(T.up, T.up + 1.2, 1, 0);                                              // (2.0: the picture comes up over 1.2 s)
    /* THE STREET: the coffee shop closing, a motorbike, the case over black; the row at blue hour; a bus; the fan above */
    sfx(0.0, 'u51bstreet', 0.55); sfx(19.4, 'u51bstreet', 0.5);               // (two of its 20 s, the second under the five-foot way's end)
    sfxFade(T.stair - 0.4, T.stair + 0.3, 'u51bstreet');
    sfx(T.moto, 'u51moto', 0.75);                                              // a motorbike passing, left to right (its pass at 1.4 s)
    sfx(T.o1, 'zv51o1', 1);                                                    // "Case four."
    sfx(T.o2, 'zv51o2', 1);                                                    // "A man asked us to come and see his colleague. He said she was not herself."
    sfx(T.m1, 'u51m1blue', 0.7);                                               // M1 "Blue Hour": solo khim, slow; strings from 8 s
    sfx(T.bus, 'u51busaway', 0.6);                                             // a bus pulling away, the air-brake's hiss
    sfx(T.fan - 0.76, 'u51fantick', 0.5);                                      // the fan's tick from her window above
    sfx(T.taxi - 0.29, 'u51taxiin', 0.8);                                      // the taxi's tyres on wet tarmac, its indicator
    /* HIS EYES ON THE FIVE-FOOT WAY: the taxi's door shut behind him and away; his steps; Marcus's line, his teacher's */
    sfx(T.door - 0.58, 'u51taxiout', 0.75);                                    // its door shut, and away up the street
    sfx(T.out - 0.25, 'u51walk', 0.55); sfxFade(T.mk1 - 0.4, T.mk1 + 0.2, 'u51walk');   // his steps out onto the tiles
    sfx(T.mk1 - 1.3, 'u51shoe', 0.32); sfx(T.mk1 - 0.75, 'u51shoe', 0.36);    // Marcus's two steps to meet them
    sfx(T.mk1, 'mk51o1', 1);                                                   // "Thank you for coming, Grandmaster. She said you can come up."
    sfx(T.ph1, 'ph51o1', 1);                                                   // "Thank you. Show us the way."
    sfx(T.turn + 0.1, 'u51shoe', 0.34); sfx(T.turn + 0.45, 'u51shoe', 0.36);  // Marcus to the stair door
    sfx(T.turn + 0.3, 'u51shoe', 0.4); sfx(T.turn + 0.85, 'u51shoe', 0.44);   // and his own, after his teacher
    /* THE STAIR: the tube's hum, their steps on terrazzo, the flicker */
    sfx(T.stair - 0.1, 'u51bstair', 0.55);
    sfx(T.stair + 0.15, 'u51stair', 0.6); sfx(T.tube + 1.3, 'u51stair', 0.55);   // the climb (6 s each, the second after the stop)
    sfx(T.tube, 'u51tube', 0.7);                                               // the tube flickers twice, its hum dropping out
    /* THE LANDING: two knocks, Marcus's line, the lock and the old hinge, Grace's line, his teacher's thanks */
    sfx(T.knock - 0.82, 'u51knock', 0.8);                                      // (its knocks 0.82 and 1.11 s into it)
    sfx(T.mk2, 'mk51o2', 1);                                                   // "Grace? They're here."
    sfx(T.lock - 1.31, 'u51unlock', 0.7); sfx(T.lock + 0.1, 'u51hinge', 0.6);  // the lock; the door's old hinge as it opens
    sfx(T.gr1, 'gr51o1', 1);                                                   // "Come in. Sorry about the mess."
    sfx(T.ph2, 'ph51o2', 1);                                                   // "Thank you for letting us in."
    sfxFade(T.inn - 0.6, T.inn + 0.2, 'u51bstair');
    /* INSIDE: her room's bed (the play's: the fan, the street below, a neighbour's TV) from the cut; the cloth shaken out;
       his thought; a gecko; M3's low note; her steps and the sofa's give, heard; the silence as her reflection turns */
    sfx(T.cloth - 0.61, 'u51cloth', 0.7);                                      // the cloth shaken out over the table
    sfx(T.o3, 'zv51o3', 1);                                                    // "She had let us in. But something kept turning her back to the door."
    sfx(T.gecko, 'u51gecko', 0.45);                                            // a gecko's chirp
    sfx(T.sofa + 0.5, 'u51tile', 0.22); sfx(T.sofa + 1.1, 'u51tile', 0.2); sfx(T.sofa + 1.7, 'u51tile', 0.2); sfx(T.sofa + 2.3, 'u51tile', 0.18);   // her steps, soft
    sfx(T.sofa + 3.6 - 0.43, 'u51sofa', 0.55);                                 // the sofa's give as she sits
    fade(T.black, T.end - 0.25, 0, 1);
    sfxFade(T.black, T.end - 0.2, 'u51m1blue');                                // (the music goes down with the picture: v15.3)
    step(T.end, () => F.end());
    c.keepFade = true; c.endFade = 1;
  }

  /* THE KEEPSAKE (the plan's 9.2): from the room, into the breaking's brief */
  const KS51 = (() => {
    const T = { hand: 0.0, k1: 0.8, bag: 6.0, pull: 9.0, give: 12.5, place: 14.0, turn: 22.0, k2: 23.0, lift: 26.0, chant: 32.0, wax: 35.0, m4: 38.0 };
    T.k2 = Math.max(T.k2, T.k1 + SECS.ph51k1 + 0.4);
    T.end = 42.0;
    return T;
  })();
  function filmKeepsake(c, s, api) {
    const { tr, step, sfx, sfxFade, rawK, stage } = api, T = KS51, F = stage.films.films.keepsake;
    step(0, () => F.begin(api, s));
    tr(0, T.end, (k, t) => F.frame(t), rawK);
    sfx(T.k1, 'ph51k1', 1);                                                    // "May I hold it? Only for a while."
    sfx(T.pull - 0.1, 'u51zip', 0.6);                                          // her bag's zip
    sfx(T.place + 0.5 - 0.04, 'u51plate', 0.6);                                // porcelain on cloth
    sfx(T.k2, 'ph51k2', 1);                                                    // "Hold the water. Whatever happens, keep it still."
    sfx(T.lift - 0.18, 'u51bowlup', 0.7);                                      // brass lifted off the cloth, the water's small slap
    /* THE CHANT begins (the play's own world sound: it carries on under the event and into the cord, PLAY.md 1) */
    step(T.chant, () => { const ch = stage && stage.chant; if (ch && ch.begin) ch.begin(); });
    sfx(T.wax - 0.03, 'u51wax', 0.6); sfx(T.wax + 1.5 - 0.03, 'u51wax', 0.6); sfx(T.wax + 3.0 - 0.03, 'u51wax', 0.6);   // a tiny hiss with each drop
    sfx(T.m4, 'u51m4break', 0.5); sfxFade(T.end - 1.4, T.end - 0.1, 'u51m4break');   // M4's prelude: a bowed metal drone, low strings
    step(T.end, () => F.end());
    /* (it ends on its own view, the lens down into the bowl in his hands: the breaking begins there, PLAY.md 2) */
    c.keep.view = true;
  }

  /* THE CORD (the plan's 9.3): from the breaking, straight into home. Where a measured line runs past the plan's next
     second, the next waits for it (his teacher's two lines to Grace and Marcus are 5.37 and 4.41 s: the bottle at 47 s) */
  const CD51 = (() => {
    const T = { snap: 8.6, cry: 12.0, c1: 15.0, phone: 24.0, z1: 29.0, wrap: 32.0, c2: 33.0 };
    T.c3 = Math.max(37.5, T.c2 + SECS.ph51c2 + 0.35);          // "Don't let her meet him alone. A friend is medicine too."
    T.m1 = Math.max(41.0, T.c3 + SECS.ph51c3 + 0.3);           // "I won't. Thank you, Grandmaster."
    T.g1 = Math.max(43.0, T.m1 + SECS.mk51c1 + 0.25);          // "Thank you."
    T.pour = Math.max(44.0, T.g1 + SECS.gr51c1 + 0.3);         // the bowl to his teacher; the pour; the cork
    T.give = T.pour + 2.8;                                      // the bottle held out to him
    T.c4 = T.give + 0.4;                                        // "For your altar."
    T.take = T.give + 1.3;                                      // his hands take it
    T.c5 = T.c4 + SECS.ph51c4 + 0.45;                           // "You held it well."
    T.wrist = T.c5 + SECS.ph51c5 + 0.3;                         // his look drops to his wrist for 1.5 s
    T.z2 = T.wrist;                                             // "My part was small. I only held the water."
    T.black = T.z2 + SECS.zv51c2 + 0.5;
    T.end = T.black + 1.1;
    return T;
  })();
  function filmCord(c, s, api) {
    const { tr, step, sfx, sfxFade, fade, rawK, stage } = api, T = CD51, F = stage.films.films.cord;
    step(0, () => F.begin(api, s));
    tr(0, T.end, (k, t) => F.frame(t), rawK);
    /* (the chant's last verse is the play's, let go before this film began: its last word at about 8 s) */
    sfx(T.snap - 0.6, 'u51vison', 0.55);                                       // Spirit Vision forced open as the strand goes
    sfx(T.snap - 0.86, 'u51snap', 0.85);                                       // a taut string snapping (its reverse swell before it)
    sfx(T.snap + 0.1 - 0.25, 'u51whoosh', 0.7);                                // a low whoosh crossing toward him
    sfx(T.snap + 0.4 - 0.15, 'u51wrist', 0.65);                                // a thin glassy ring as it touches his wrist
    sfx(T.snap + 2.7, 'u51visoff', 0.45);
    sfx(T.c1, 'ph51c1', 1);                                                    // "It's alright. It's finished."
    sfx(T.phone, 'u51buzz', 0.55); sfx(T.phone + 0.85, 'u51buzz', 0.55); sfx(T.phone + 1.7, 'u51buzz', 0.5);   // her phone's vibration
    sfx(T.phone + 3.0 - 0.07, 'u51facedown', 0.6);                             // face down
    sfx(T.z1, 'zv51c1', 1);                                                    // "For the first time all evening, she let it ring."
    sfx(T.wrap + 0.6 - 0.4, 'u51fold', 0.55);                                  // cloth folded
    sfx(T.c2, 'ph51c2', 1);                                                    // "Rest tonight. Tomorrow, stay close to people who listen to you."
    sfx(T.c3, 'ph51c3', 1);                                                    // "Don't let her meet him alone. A friend is medicine too."
    sfx(T.m1 - 1.6, 'u51knot', 0.45);                                          // the thread wound and knotted
    sfx(T.m1, 'mk51c1', 1);                                                    // "I won't. Thank you, Grandmaster."
    sfx(T.g1, 'gr51c1', 1);                                                    // "Thank you."
    sfx(T.pour + 0.6 - 0.94, 'u51pour', 0.6);                                  // the pour into the bottle
    sfx(T.pour + 2.2 - 0.53, 'u51cork', 0.6);                                  // the cork
    sfx(T.c4, 'ph51c4', 1);                                                    // "For your altar."
    sfx(T.c5, 'ph51c5', 1);                                                    // "You held it well."
    sfx(T.z2, 'zv51c2', 1);                                                    // "My part was small. I only held the water."
    fade(T.black, T.end - 0.15, 0, 1);
    step(T.end, () => F.end());
    c.keepFade = true; c.endFade = 1; c.keep.view = true;
  }

  /* HOME (the plan's 9.4; 11:52 PM): from the cord's black, into three o'clock in bed */
  const HM51 = (() => {
    const T = { m5: 0.5, card: 6.2, lock: 6.6, door: 7.0, altar: 10.0, setb: 12.5, palms: 14.0, phone: 18.0, charge: 19.0, keys: 21.0, bed: 24.0,
                shower: 24.0, showerOff: 28.0, sit: 28.4, lie: 31.0, clock: 34.0, close: 40.0, h1: 41.0, tick: 45.0, press: 46.0, open: 49.5 };
    T.h1 = Math.max(T.h1, T.close + 0.8);
    T.cut = T.open;
    T.end = T.open + 4.6;                                       // the clock read (3:00), the ceiling again, and the room: where play begins
    return T;
  })();
  function filmHome(c, s, api) {
    const { tr, step, sfx, sfxFade, fade, rawK, stage } = api, T = HM51, F = stage.films.films.home;
    step(0, () => F.begin(api, s));
    tr(0, T.end, (k, t) => F.frame(t), rawK);
    fade(0, 0.9, 1, 0);                                                        // (from the cord's black)
    sfx(0.0, 'u51bcorr', 0.55);                                                // the corridor's hush, the air vents
    sfx(0.1, 'u51carpet', 0.6);                                                // his steps on carpet
    sfx(T.m5, 'u51m5city', 0.7);                                               // M5 "Night City": an electric piano, two chords, a pad
    sfx(2.6, 'u51liftfar', 0.3);                                               // a lift's motor far off
    sfx(T.card - 0.36, 'u51keycard', 0.7);                                     // the reader's beep
    sfx(T.lock - 0.49, 'u51clunk', 0.7);                                       // the lock's clunk
    sfx(T.door - 0.31, 'u51door', 0.6);                                        // the door
    sfxFade(T.door + 1.0, T.door + 2.6, 'u51bcorr');
    sfx(T.setb - 0.05, 'u51setglass', 0.6);                                    // glass on wood
    sfx(T.palms - 0.38, 'u51palms', 0.55);                                     // his palms meeting
    sfx(T.charge - 0.18, 'u51charger', 0.55);                                  // the charger's chirp
    sfx(T.keys - 0.05, 'u51keys', 0.5);                                        // the keys in a bowl
    sfx(T.shower, 'u51shower', 0.55); sfxFade(T.showerOff - 0.1, T.showerOff + 0.25, 'u51shower');
    sfx(T.showerOff, 'u51showeroff', 0.6);                                     // the shower off
    sfx(T.lie + 0.6 - 0.17, 'u51liedown', 0.6);                                // the bed
    sfx(T.clock, 'u51clock', 0.55);                                            // the clock's soft tick
    sfx(T.h1, 'zv51h1', 1);                                                    // "Everyone thought that was the end of it."
    sfx(T.tick, 'u51clock', 0.5);                                              // a clock ticking
    sfx(T.press, 'u51press', 0.55);                                            // the pressure's tone, rising very low
    sfxFade(T.open - 0.05, T.open + 0.05, 'u51press'); sfxFade(T.open - 0.05, T.open + 0.05, 'u51clock');   // cut to silence as his eyes open
    sfx(T.open + 1.0, 'u51clock', 0.45);                                       // the clock again, in the silence
    step(T.end, () => F.end());
    /* (it ends on its own view, lying in bed: three o'clock begins there, PLAY.md 2) */
    c.keep.view = true;
  }

  /* THE MODELS ONLY THESE FILMS USE (declared, v17.4), asked for with the chapter's own: Grandmaster Pho standing (episode 4
     chapter 5's copy of his body with finger bones) and the taxi's driver */
  for (const k of ['p5pho', 'p5collector']) if (!DATA.assets.includes(k)) DATA.assets.push(k);
  Object.assign(DATA.reuseInEpisode, {
    p5pho: "Grandmaster Pho STANDING, episode 4 chapter 5's copy of his body with finger bones on his right hand (R26), his own takes and look D: on the five-foot way, the stair and her landing in the opening (FILMS-2 stands him at the dawn with it)",
    p5collector: "the taxi's driver in the opening, at the wheel behind the windscreen at dusk for the two seconds the taxi draws in: the collector of episode 4 chapter 5's last case, his seated take's quiet window (v24.22: every moving vehicle has its driver)" });

  (window.__CHAPTERS__ = window.__CHAPTERS__ || {}).e5c1 = Object.assign(DATA, {
    build,
    intro,
    films: { keepsake: filmKeepsake, cord: filmCord, home: filmHome },
    scenes: [scCall, scWait, scPill, scSeek]
  });
})();
