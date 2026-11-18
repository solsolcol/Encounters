  /* ====================================================== THIS CHAPTER'S DRAWN SURFACES' HELPERS (chapter 3's own) */
//@@COPY 9015-9015 :: function rng(seed)
//@@COPY 9059-9063 :: function done(THREE, c, rep) {
//@@COPY 9097-9097 :: function noMip(THREE, t)

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
    A: { grab: 0.0, rv: 0.3, cry: 0.9, scream: 2.95, torn: 6.1, white: 6.3, open: 7.6, rise: 9.0, call: 12.6, still: 13.2, go: 14.4, rv2: 14.7, ph: 17.4, q: 24.2, close: 28.2 },
    B: { throw: 0.15, splash: 0.55, comes: 0.9, white: 2.3, floor: 2.55, go: 3.3, push: 3.3, falter: 3.5, ml2: 4.0, back: 5.6, cry: 6.2, torn: 9.6, white2: 9.8, open: 11.4, rise: 12.0, ok: 16.0, ph: 17.6, q: 24.6, close: 28.4 },
    C: { step: 0.0, say: 0.7, kneel: 5.4, mala: 6.4, rv: 7.3, cry: 8.6, torn: 12.2, white: 12.4, open: 13.8, look: 14.6, my: 14.9, rise: 15.4, ph: 21.0, q: 26.8, close: 30.9 },
    D: { shut: 0.2, reach: 1.0, ph0: 1.9, kneel: 4.6, rv: 4.7, cry: 7.8, torn: 11.2, white: 11.4, open: 12.8, rise: 13.6, ml: 14.8, ph: 19.4, q: 28.8, close: 33.4 }
  };

  /* THE OPENING FILM's clock (c_ufilm.js FILMS.open draws to it) */
  const OP = { q1: 0.8, est: 7.6, q2: 8.4, turn: 13.6, walk: 14.6, at: 20.2, latch: 20.6, cut1: 21.3, rv: 22.2, cut2: 25.0, inside: 27.4, drop: 28.6, look: 29.0, flick: 31.6, flickEnd: 32.9, black: 33.4, end: 34.6 };
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
    a.sfx(E.ph, 'ph4A1', 1);                            // "You kept the blessing. You forgot the son. His fear was only love."
    a.sfx(E.q, 'q4A1', 1);                              // "I saw a man in the way. He was her son."
    a.sfxFade(E.close - 2.0, E.close + 0.5, 'u4endA');
  }); }
  /* B · THROW THE WATER AT THE THING ON HER BACK (bad) */
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
    a.sfx(E.ph, 'ph4B1', 1);                            // "Your part was the water and the room. The work was mine. Today you were lucky."
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
  /* D · KEEP YOUR PLACE: HOLD THE WATER, STAY CLOSED, TRUST YOUR TEACHER (good) */
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
    a.sfx(E.ph, 'ph4D1', 1);                            // "You held. That is where it starts. But there were two of them afraid in this room..."
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
