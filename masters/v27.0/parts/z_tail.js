  /* ====================================================== THIS CHAPTER'S DRAWN SURFACES' HELPERS (chapter 3's own) */
//@@COPY 9015-9015 :: function rng(seed)
//@@COPY 9059-9063 :: function done(THREE, c, rep) {
//@@COPY 9097-9097 :: function noMip(THREE, t)

  /* THE FILMS' CLOCKS (c_ufilm.js draws to them): the trance's, each ending's, and the close's, every one from its start */
  const TR = { ml1: 2.6, ml2: 5.7, open: 7.6, claw: 7.6, cry: 10.6, rush: 12.7, rv: 13.05, back: 15.2, end: 17.6 };
  /* the close's own clock, from its start: Pho's dedication; the green shapes go; she rises (if she has not), walks;
     the ash; her palms; his sight closing; Pho's word; black */
  const CL = { z0: 0.6, go: 2.0, steps: 11.6, ash: 15.0, palms: 17.2, bell: 18.4, shut: 20.2, z1: 21.6, black: 29.0, end: 31.2 };
  /* each ending's clock: its lines and beats, and where its close begins */
  const EN = {
    A: { grab: 0.0, cry: 0.9, scream: 1.6, torn: 6.1, white: 6.3, open: 7.6, rise: 9.0, still: 12.5, go: 14.2, ph: 17.4, q: 24.2, close: 28.2 },
    B: { throw: 0.15, splash: 0.55, comes: 0.9, white: 2.3, floor: 2.55, go: 3.3, push: 3.3, falter: 3.5, back: 5.6, cry: 6.2, torn: 9.6, white2: 9.8, open: 11.4, rise: 12.0, ph: 17.6, q: 24.6, close: 28.4 },
    C: { step: 0.0, say: 0.7, kneel: 5.4, mala: 6.4, cry: 8.6, torn: 12.2, white: 12.4, open: 13.8, look: 14.6, rise: 15.4, ph: 21.0, q: 26.8, close: 30.9 },
    D: { shut: 0.2, reach: 1.0, ph0: 1.9, kneel: 4.6, cry: 7.8, torn: 11.2, white: 11.4, open: 12.8, rise: 13.6, ph: 19.4, q: 28.8, close: 33.4 }
  };

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
    a.sfx(E.cry, 'u4cry', 0.85);                        // the cry peaks
    a.sfx(E.scream, 'u4gaspf', 0.9);                    // Mala, at them both
    a.sfx(E.torn - 0.1, 'u4torn', 0.85);                // torn from her
    flash(a, E.white); a.sfxFade(E.white, E.white + 1.2, 'u4cry');
    a.sfx(E.open - 0.4, 'u4endA', 0.5);
    a.sfx(E.rise + 0.2, 'u4stand', 0.75);               // she stands, and her son is not beside her
    a.sfx(E.ph, 'ph4A1', 1);                            // "You kept the blessing. You forgot the son. His fear was only love."
    a.sfx(E.q, 'q4A1', 1);                              // "I saw a man in the way. He was her son."
    a.sfxFade(E.close - 2.0, E.close + 0.5, 'u4endA');
  }); }
  /* B · THROW THE WATER AT THE THING ON HER BACK (bad) */
  function scThrow(c, s, api) { endingScene(c, s, api, 'B', (E, a) => {
    a.sfx(E.throw, 'u4flick', 1); a.sfx(E.splash, 'u4patter', 1); a.sfx(E.splash + 0.08, 'u4dip', 0.6);   // the whole bowl
    a.sfx(E.comes, 'u4chill', 0.95);                    // it lets go of her and comes at him
    a.sfx(E.comes + 0.35, 'u4heart', 0.9); a.sfx(E.comes + 0.95, 'u4heart', 0.7);   // his heart, and then it stalls
    flash(a, E.white, 1.4); a.sfx(E.floor + 0.15, 'u4fall', 0.85);               // white; he is on the floor
    a.sfx(E.go, 'ph4B0', 1);                            // "Go."
    a.sfx(E.cry, 'u4cry', 0.85);                        // the cry rises again
    a.sfx(E.torn - 0.1, 'u4torn', 0.85);
    flash(a, E.white2); a.sfxFade(E.white2, E.white2 + 1.1, 'u4cry');
    a.sfx(E.open - 0.6, 'u4endB', 0.5);
    a.sfx(E.rise + 0.2, 'u4stand', 0.75);
    a.sfx(E.ph, 'ph4B1', 1);                            // "Your part was the water and the room. The work was mine. Today you were lucky."
    a.sfx(E.q, 'q4B1', 1);                              // "I saw it, and thought it was mine to fight."
    a.sfxFade(E.close - 2.0, E.close + 0.5, 'u4endB');
  }); }
  /* C · GO TO HIM: TELL HIM SHE IS SAFE, AND STAY WITH HIM (best) */
  function scGo(c, s, api) { endingScene(c, s, api, 'C', (E, a) => {
    a.sfx(0.05, 'u4tile', 0.6);                         // he steps between them
    a.sfx(E.say, 'q4C0', 1);                            // "She's not being hurt. It's leaving her. Stay with her. Hold her hand."
    a.sfx(E.kneel + 0.5, 'u4tile2', 0.5);               // Ravi kneels by her
    a.sfx(E.cry, 'u4cry', 0.85);
    a.sfx(E.torn - 0.1, 'u4torn', 0.85);
    flash(a, E.white); a.sfxFade(E.white, E.white + 1.2, 'u4cry');
    a.sfx(E.open - 0.8, 'u4endC', 0.5);
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
    a.sfx(E.cry, 'u4cry', 0.55);                        // heard, not seen: his sight is shut
    a.sfx(E.torn - 0.1, 'u4torn', 0.65);
    flash(a, E.white, 1.2, 0.75); a.sfxFade(E.white, E.white + 1.2, 'u4cry');
    a.sfx(E.open - 0.8, 'u4endD', 0.5);
    a.sfx(E.rise + 0.2, 'u4stand', 0.75);
    a.sfx(E.ph, 'ph4D1', 1);                            // "You held. That is where it starts. But there were two of them afraid in this room..."
    a.sfx(E.q, 'q4D1', 1);                              // "I kept to my part. Next time I'll see the people too."
    a.sfxFade(E.close - 2.0, E.close + 0.5, 'u4endD');
  }); }

  (window.__CHAPTERS__ = window.__CHAPTERS__ || {}).e4c4 = Object.assign(DATA, {
    build,
    films: { trance: filmTrance },
    scenes: [scHold, scThrow, scGo, scKeep]
  });
})();
