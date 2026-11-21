
  /* ================================================================ THE FILMS' CLOCKS AND CUES (M9; their pictures are the
     stage's: c_yfilm.js FILMS5, reached as stage.films). Each clock is built by tl() from SECS (a_head.js), so a measured
     take moves everything after it (v5.15): a list of ['line', gap], [secs] (a pause) and ['@mark'] (a named moment).
     Every cue is a literal call of the film language's sound verb in the film's own source (v10.2, v14.16), and none is
     written past the film's last track (v12.3).
     THE VOICES, until their takes are installed (masters/v28.0/voices/install.py): each line is V(api, at, key), its words
     shown at its measured time under who says them, so every film can be read; once the takes are in the build each V
     becomes its line's own cue, with nothing here to move. THE SOUNDS AND THE MUSIC are planned beat by beat in
     masters/v28.0/films/SOUNDS.md and go in once their files are installed (a cue that plays nothing fails chaptertest). */
  function V(api, at, key) {
    api.step(at, () => { const k = api.kit; if (k && k.captions && LINES[key]) k.captions([{ at: 0, end: (SECS[key] || 2.5) + 0.3, text: LINES[key][2], sub: WHO[LINES[key][0]] || '' }]); });
  }

  /* THE OPENING (the plan's 4.0): the case over black; the car, the number, Jun's line, Ton's; the chime and the doors;
     his teacher out first, then Ton, then Jun; his step out; the sour; his thought; black, the title over it */
  const OP5 = tl(0.5, [['q5o1', 0.55], ['ju5o1', 0.3], ['tn5o1', 0.4], ['@chime'], [0.45], ['@open'], [1.5], ['@out'], [0.8], ['@tonOut'], [0.8], ['@junOut'], [0.6],
                       ['@step'], [1.4], ['@sour'], [1.3], ['q5o2', 0.6], ['@black'], [0.9], ['@end']]);
  OP5.num2 = 10.6; OP5.num3 = OP5.chime - 0.5;                                  // the number over the doors: 2, then 3 as the car arrives
  function intro(c, s, api) {
    const { tr, step, fade, rawK, stage } = api, F = stage.films.open, T = OP5;
    step(0, () => F.begin(api, s));
    tr(0, T.end, (k, t) => F.frame(t), rawK);
    fade(1.3, 2.8, 1, 0);                                                      // (v7.7: the picture comes up as he speaks)
    V(api, T.q5o1, 'q5o1'); V(api, T.ju5o1, 'ju5o1'); V(api, T.tn5o1, 'tn5o1'); V(api, T.q5o2, 'q5o2');
    fade(T.black, T.end - 0.15, 0, 1);
    step(T.end, () => F.end());
    c.keepFade = true; c.endFade = 1;
  }

  /* THE DEVOTEE (the plan's 4.2): his doors open, he comes to his gate; his greeting; the court; the slippers; his room,
     his three lines; his teacher's two. It ends on the view the hunt begins in */
  const DV5 = tl(0, [[0.8], ['@door'], [1.6], ['@walk'], [6.2], ['@cut1'], [0.35], ['ko5d1', 0.5], ['@in'], [2.7], ['@slip'], [2.7], ['@room'], [0.6],
                     ['ko5d2', 0.35], ['ko5d3', 0.6], ['ko5d4', 0.6], ['ph5d1', 0.45], ['ph5d2', 0.3], ['@turn'], [1.3], ['@end']]);
  function filmDevotee(c, s, api) {
    const { tr, step, fade, rawK, stage } = api, F = stage.films.devotee, T = DV5;
    step(0, () => F.begin(api, s));
    tr(0, T.end, (k, t) => F.frame(t), rawK);
    fade(0, 0.8, 1, 0);
    for (const key of SAID.devotee) V(api, T[key], key);
    step(T.end, () => F.end());
  }

  /* THE PREPARATION, AND THE TURN (the plan's 4.4): night; the stick unwrapped and taken; the thread; his teacher's two
     words; the lamps sink, his sight opens, the nine lift their heads, turn, come; his protection's colour (the forty-third
     seam's fade in a colour); out of his eyes, to the fight's boom */
  const PR5 = tl(0, [[0.3], ['@lit'], [3.2], ['@unwrap'], [4.6], ['@take'], [3.4], ['@thread'], [0.5], ['ph5p1', 0.35], ['ko5p1', 0.2], ['@noans'], [1.6], ['@teacher'], [1.0],
                     ['ph5p2', 0.6], ['@plant'], [1.0], ['@sink'], [1.1], ['@open'], [2.4], ['@heads'], [1.6], ['@turn'], [1.6], ['@come'], [2.6], ['@hands'], [1.0],
                     ['@violet'], [0.4], ['q5p1', 0.4], ['@leave'], [5.8], ['@rest'], [2.0], ['@end']]);
  const VIOLET5 = '#6b3fe2';                                                   // his protection's colour (the plan's 11: neither gold nor white)
  function filmPrepare(c, s, api) {
    const { tr, step, fade, rawK, stage } = api, F = stage.films.prepare, T = PR5;
    step(0, () => F.begin(api, s));
    tr(0, T.end, (k, t) => F.frame(t, api), rawK);
    fade(0, 1.2, 1, 0);                                                        // (a time cut: night now)
    for (const key of SAID.prepare) V(api, T[key], key);
    fade(T.violet, T.violet + 0.6, 0, 1, VIOLET5);
    fade(T.leave, T.leave + 2.2, 1, 0, VIOLET5);
    step(T.end, () => F.end());
    /* (it ends on its own picture, the fight's boom, so the mode opens on exactly it: v19.2's keep.view) */
    c.keep.view = true;
  }

  /* TOGETHER (the plan's 5.5, stage 5): the ONE film inside the fight; it cannot be skipped the first time (the fight asks
     for it with kit.film's noSkip). The stick planted; the Naga rises and lays its body round the court; the tall shape
     comes apart into its three, laid low; Mr Koh's warmth; the boom again */
  const NG5 = tl(0, [[0.2], ['@plant'], [2.0], ['@rise'], [3.6], ['ph5c2', 0.6], ['@lay'], [6.0], ['@apart'], [3.2], ['@low'], [1.5], ['ko5c2', 0.5], ['@back'], [2.0], ['@end']]);
  function filmTogether(c, s, api) {
    const { tr, step, rawK, stage } = api, F = stage.films.together, T = NG5;
    step(0, () => F.begin(api, s));
    tr(0, T.end, (k, t) => F.frame(t), rawK);
    V(api, T.ph5c2, 'ph5c2'); V(api, T.ko5c2, 'ko5c2');
    step(T.end, () => F.end());
    c.keep.view = true;
  }

  /* THE BAG TIED (the plan's 4.6): back into his eyes; the rooms; the knot; Ton's line, his; Mr Koh's window and his two
     words from his teacher; at the lift, "Was it real?"; the next case seeded; the doors close on black (the collector's
     film begins on it, with the card) */
  const BT5 = tl(0, [[0.3], ['@thin'], [1.6], ['@violet'], [0.9], ['@eyes'], [0.8], ['@lamp1'], [0.8], ['@lamp2'], [1.2], ['@room1'], [4.4], ['@room2'], [3.6], ['@room3'], [3.6],
                     ['@knot'], [2.6], ['@tied'], [1.0], ['tn5b1', 0.4], ['q5b1', 0.8], ['@window'], [1.4], ['ko5b1', 0.4], ['ph5b1', 0.6], ['@wai'], [1.2], ['ph5b2', 0.4], ['ph5b3', 0.8],
                     ['@lift'], [0.8], ['q5b2', 0.35], ['ph5b4', 0.4], ['ph5b5', 0.5], ['@doors'], [0.6], ['ju5b1', 0.3], ['ph5b6', 0.5], ['@in'], [1.5], ['@close'], [1.2], ['@black'], [0.8], ['@end']]);
  function filmBagTied(c, s, api) {
    const { tr, step, fade, rawK, stage } = api, F = stage.films.bagtied, T = BT5;
    step(0, () => F.begin(api, s));
    tr(0, T.end, (k, t) => F.frame(t, api), rawK);
    fade(T.violet, T.violet + 0.45, 0, 1, VIOLET5); fade(T.eyes - 0.15, T.eyes + 0.7, 1, 0, VIOLET5);
    for (const key of SAID.bagtied) V(api, T[key], key);
    fade(T.lift - 0.4, T.lift, 0, 1); fade(T.lift + 0.1, T.lift + 0.6, 1, 0);   // (a scene change happens in the black: v16.1)
    fade(T.black, T.end - 0.1, 0, 1);
    step(T.end, () => F.end());
    c.keepFade = true; c.endFade = 1;
  }

  /* THE COLLECTOR, THE FILM IN (the plan's 4.7): the card on black; the room in daylight; the pieces laid; his words */
  const CO5 = tl(0, [[0.3], ['@card'], [2.6], ['@up'], [1.4], ['@case'], [2.2], ['@laid'], [0.6], ['co5t1', 0.6], ['@laugh'], [0.8], ['co5t2', 0.4], ['@end']]);
  function filmCollector(c, s, api) {
    const { tr, step, fade, rawK, stage } = api, F = stage.films.collector, T = CO5;
    step(0, () => F.begin(api, s));
    tr(0, T.end, (k, t) => F.frame(t), rawK);
    fade(T.up, T.up + 1.2, 1, 0);
    V(api, T.co5t1, 'co5t1'); V(api, T.co5t2, 'co5t2');
    step(T.end, () => F.end());
  }

  /* THE FOUR ENDINGS (the plan's 4.9): each its own beats, THE RITE at its `rite` (its own beats RT5, from there), the
     smell gone ("I feel lighter. My head is quieter."), its own close, and THE LAST PICTURE at its `close` (CL5) */
  const RT5 = { see: 0.3, dip: 1.4, away: 2.4, unsee: 11.0, bag: 11.6, string: 12.2, end: 14.4 };
  const CL5 = { q: 0.5, black: 4.4, end: 5.6 };
  const RITELEN5 = RT5.end + 0.3;
  const EN5 = {
    A: tl(0, [[0.3], ['co5A1', 0.3], ['q5A1', 0.4], ['@push'], [1.8], ['@rite'], [RITELEN5], ['co5z1', 0.8], ['@door'], [0.3], ['co5A2', 1.2], ['ph5A1', 0.6], ['@gone'], [0.6],
              ['ph5A2', 0.5], ['q5A2', 0.7], ['@close'], [CL5.end]]),
    B: tl(0, [[0.3], ['co5B1', 0.4], ['co5B2', 0.5], ['co5B3', 0.9], ['co5B4', 0.6], ['@lid'], [2.4], ['@rite'], [RITELEN5], ['co5z1', 0.8], ['@door'], [0.3], ['co5B5', 0.3], ['q5B1', 0.5],
              ['@gone'], [0.6], ['ph5B1', 0.6], ['q5B2', 0.7], ['@close'], [CL5.end]]),
    C: tl(0, [[0.3], ['co5C1', 0.3], ['@three'], [1.6], ['@pack'], [1.4], ['@see'], [2.4], ['ph5C1', 0.4], ['co5C2', 0.5], ['ph5C2', 0.6], ['@across'], [1.8], ['@rite'], [RITELEN5],
              ['co5z1', 0.8], ['q5C1', 0.7], ['@close'], [CL5.end]]),
    D: tl(0, [[0.3], ['co5D1', 0.5], ['ph5D1', 0.5], ['ph5D2', 0.6], ['@down'], [1.4], ['@rite'], [RITELEN5], ['co5z1', 0.8], ['q5D1', 0.7], ['@close'], [CL5.end]])
  };
  /* who speaks each ending's lines, for the films' talking takes: Grandmaster Pho's (to the collector, or 'me' to his
     student), the collector's */
  for (const k of ['A', 'B', 'C', 'D']) { const E = EN5[k];
    E.pho = SAID['end' + k].filter(key => LINES[key][0] === 'pho').map(key => [key, E[key], /^ph5(A2|B1|C2|D2)$/.test(key) ? 'me' : 'col']);
    E.col = SAID['end' + k].concat(['co5z1']).filter(key => LINES[key][0] === 'collector' && E[key] != null && (E.door == null || E[key] < E.door)).map(key => [key, E[key]]); }
  function endingScene(c, s, api, k) {
    const { tr, step, fade, rawK, stage } = api, F = stage.films.ending, E = EN5[k];
    step(0, () => F.begin(k, api, s));
    tr(0, E.end, (kk, t) => F.frame(k, t, api), rawK);
    for (const key of SAID['end' + k]) V(api, E[key], key);
    V(api, E.co5z1, 'co5z1');
    V(api, E.close + CL5.q, 'q5z1');
    fade(E.close + CL5.black, E.end - 0.1, 0, 1);
    step(E.end, () => F.end());
    c.endFade = 1; c.keepFade = true;
  }
  /* A · "NONE OF THEM. LET THEM ALL GO." (good): the right act and no understanding, an order; he will buy again */
  function scNone(c, s, api) { endingScene(c, s, api, 'A'); }
  /* B · "TELL ME WHAT EACH ONE IS, AND WHERE IT CAME FROM." (best): the case file's own plain questions, and the man
     answers them himself; he closes the case's lid and pushes it across the cloth */
  function scTell(c, s, api) { endingScene(c, s, api, 'B'); }
  /* C · "THESE THREE ARE THE WORST. THE REST FEEL QUIET." (bad): the student made his appraiser; on a piece already
     packed, something his nose never caught lifts its head */
  function scThree(c, s, api) { endingScene(c, s, api, 'C'); }
  /* D · "KEEP THE HOLY ONES. THE YIN ONES ARE THE TROUBLE." (worst): a rule about kinds of object, which the case file
     refuses in its first sentence; he is already counting twenty more on his fingers */
  function scHoly(c, s, api) { endingScene(c, s, api, 'D'); }

  (window.__CHAPTERS__ = window.__CHAPTERS__ || {}).e4c5 = Object.assign(DATA, {
    build,
    intro,
    films: { devotee: filmDevotee, prepare: filmPrepare, together: filmTogether, bagtied: filmBagTied, collector: filmCollector },
    scenes: [scNone, scTell, scThree, scHoly]
  });
})();
