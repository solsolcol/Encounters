  /* ================================================================ THE FOUR ENDINGS, THE BARRIER AND THE DAWN: THEIR CLOCKS
     AND CUES (masters/v29.0/parts/y_endings.js: helper FILMS-2's from M7; their pictures are c_yfilm2.js's, reached as
     stage.films.ends2; masters/v29.0/ENDINGS.md is the record: every mark below with its reason). The registration that
     names scCall, scWait, scPill and scSeek stays in z_tail.js.
     THE FOUR ENDINGS (the plan's 9.8), each a whole story (v21.30): its own beginning, then THE BARRIER (its 9.7, the case
     file's: the call on the speaker, the white thread, CLOSE THE CIRCLE inside it by eventWait, the Jinapañjara through the
     phone with its captions, the gold rising and the red threads burning, the release) and THE DAWN (its 9.9: his teacher
     at the door with breakfast, the thread wound up, the ending's own line, the thread tied on his wrist). Then the four
     lines (zv51A to zv51D, the engine's under the card: its 9.10) and the lesson card (DATA.core: its 9.11).
     EVERY CLOCK is built by tl() from SECS (v5.15: a measured take moves what follows it); Grandmaster Pho's words on the
     phone are timed by their lines (SECS) and cued as their phone copies (`<key>tel`: band-limited, the plan's 11.1).
     EVERY CUE is a literal call of the film language's sound verb in the scene's own source (v10.2, v14.16): the four scenes
     are ONE function with its letter (mkEnding2), so the engine's reading of any ending's source finds every cue of every
     ending, the barrier's and the dawn's among them; none is written past the film's last track (v12.3). The beds are the
     play's (PLAY.md 5: stage.beds.film, written by the picture every frame); the music and the effects are cued here.
     Every stretch of a second and a half with no voice is held by a sound with a reason (v21.30): the night's beds and its
     pressure, his steps and his breath, the call, the chant, the music, the dawn's birds. */

  /* WHERE EACH ENDING LEAVES HIM FOR THE BARRIER, and the walk from there to his bag by his front door and on to the middle
     of the room (the paths are c_yfilm2.js's, walked over these seconds: about 0.8 m a second, a man in pain; `rise` is the
     getting up first, from wherever the ending had him down). Measured from the paths (ENDINGS.md 2) */
  const WALK2 = {
    A: { rise: 0, bag: 5.6, circle: 4.6 },
    B: { rise: 1.6, bag: 5.2, circle: 4.6 },
    C: { rise: 2.0, bag: 3.6, circle: 4.6 },
    D: { rise: 1.4, bag: 6.0, circle: 4.6 }
  };
  /* THE BARRIER'S MARKS from b0 (the plan's 9.7, its measured lines): his teacher's two lines on the speaker; the walk to the
     bag, the zip, the spool; the walk to the middle of the room and the sit; CLOSE THE CIRCLE (the film waits on it); "Good.
     Now stay inside..."; the Jinapañjara (its four verses on the take's breaths: lines.json `times`); the gold over its first
     verse, Spirit Vision opened at its second and the threads coming (the insert of his door's foot), the first touch and the
     slow motion at its third, the last surge, the break at its fourth; the quiet, his question, the last words; he lies down;
     the black */
  const JINA_T = [[0.06, 9.32], [9.66, 18.1], [18.48, 27.4], [27.68, 36.46]];      // ph51jina's verses on its take's breaths (lines.json `times`)
  const SLOW2 = { len: 1.5, rate: 0.4, ramp: 0.22 };                               // the threads meeting the gold (the plan's 4.4: once in each ending)
  function bar2(b0, w) {
    const T = tl(b0, [[0.35], ['ph51x1', 0.35], ['ph51x2', 0]]);
    T.b0 = b0;
    T.walk0 = T.ph51x2 + 2.2;                                                      // ("Get the white thread from your bag." and he goes)
    T.rise1 = w.rise;
    T.bag = T.walk0 + w.rise + w.bag;
    T.zip = T.bag + 0.75; T.spool = T.zip + 1.45;
    T.sit0 = T.spool + 0.9 + w.circle;
    T.circle = T.sit0 + 1.6;                                                       // CLOSE THE CIRCLE (eventWait: the film's clock stands here)
    T.after = T.circle + 0.6;
    T.ph51x4 = T.circle + 0.5;
    T.chant = T.ph51x4 + SECS.ph51x4 + 0.6;
    const c0 = T.chant;
    T.verse = JINA_T.map(v => c0 + v[0]);
    T.vis0 = c0 + JINA_T[1][0] - 0.2;                                              // his sight opened by the film at the second verse
    T.door0 = T.vis0 + 2.2; T.door1 = T.door0 + 2.6;                               // the insert: his door's foot, the threads under it
    T.touch = c0 + JINA_T[2][0] - 0.1;                                             // the first thread meets the gold: the slow motion
    T.surge = c0 + JINA_T[2][1] - 1.2;                                             // the last surge, the vice at its loudest
    T.brk = c0 + JINA_T[3][0] - 0.1;                                               // it breaks
    T.vis1 = T.brk + 2.6;                                                          // his sight let go, the curls gone out
    T.calm = T.brk + 4.0;
    T.m7 = T.brk - 19.75;                                                          // M7: its swell (19.5 to 20 s of the take) on the break
    T.chantEnd = c0 + SECS.ph51jina;
    const Q = tl(T.chantEnd, [[0.7], ['ph51x5', 0.55], ['zv51x1', 0.45], ['ph51x6', 0]]);
    Object.assign(T, { ph51x5: Q.ph51x5, zv51x1: Q.zv51x1, ph51x6: Q.ph51x6 });
    T.lie = T.ph51x6 + 3.2;                                                        // ("... Rest." and he lies down inside the circle)
    T.black = Q.end + 0.5; T.end = T.black + 1.3;
    /* the slow motion's own clock for the threads and the sparks: slowed to SLOW2.rate over SLOW2.len from the first touch */
    T.slow0 = T.touch;
    return T;
  }
  /* the effects' clock through the slow motion: t on the film's clock to the threads' own (a smooth slowing in and out; after
     it the threads run SLOW2.len x (1 - rate) behind the film, which nothing after them needs: the surge, the break and the
     chant are the film's) */
  function slow2(t, t0) {
    const a = t0, r = SLOW2.ramp, b = t0 + SLOW2.len, k = 1 - SLOW2.rate;
    const plat = (x) => (x <= a ? 0 : x < a + r ? (x - a) * (x - a) / (2 * r) : x <= b - r ? r / 2 + (x - a - r) : x < b ? (b - a - r / 2) - (b - x) * (b - x) / (2 * r) : b - a - r);
    return t - k * plat(t);
  }
  function slow2Inv(e, t0) { let lo = e, hi = e + SLOW2.len * 2; for (let i = 0; i < 30; i++) { const m = (lo + hi) / 2; if (slow2(m, t0) < e) lo = m; else hi = m; } return (lo + hi) / 2; }

  /* THE DAWN'S MARKS from d0 (the plan's 9.9): the morning on his floor, the knock; his teacher at the door with breakfast;
     the thread wound up; at the table his "I only held the water.", his teacher's answer and the ending's own line; the
     thread tied on his wrist, the last words; the picture and the music fade together (v15.3) */
  function dawn2(d0, k) {
    const own = { A: [['ph51A3', 0.8]], B: [['ph51B4', 0.8]], C: [['ph51C3', 0.8]], D: [['ph51D3', 1.1], ['ph51D4', 0.9]] }[k];
    const T = tl(d0, [[1.2], ['@wake'], [2.6], ['@knock'], [1.9], ['@door'], [0.9], ['ph51w1', 0.6], ['@inside'], [2.2], ['@wind'], [5.4], ['@table'], [2.2],
                      ['zv51w1', 0.45], ['ph51w2', 0.8]].concat(own, [['@tie'], [0.4], ['ph51w3', 0.5], ['zv51w2', 0.6], ['@black']]));
    T.d0 = d0; T.end = T.black + 1.6;
    return T;
  }

  /* EACH ENDING'S OWN BEGINNING, its marks from 0 (the plan's 9.8, its measured lines), then the barrier from b0 and the dawn
     from d0, all on the ending's one clock */
  const EN2 = {};
  {
    /* A · "CALL GRANDMASTER PHO NOW." (best): his thumb on his teacher's name; the call rings twice and he answers */
    const A = tl(0, [[0.45], ['@ring'], [4.4], ['@connect'], [0.4], ['ph51A1', 0.35], ['zv51A1', 0.35], ['ph51A2', 0.3]]);
    A.clock = '3:03';
    EN2.A = A;
  }
  for (const k of ['A']) {
    const E = EN2[k];
    E.b0 = E.end;
    E.bar = bar2(E.b0, WALK2[k]);
    E.d0 = E.bar.end;
    E.dawn = dawn2(E.d0, k);
    E.end = E.dawn.end;
    E.slow = (t) => slow2(t, E.bar.slow0);                                         // the threads' own clock through the slow motion
    E.jina = JINA_T;
  }
  /* (until each is built, B, C and D are A's story with their own letter: TODO-FILMS-2) */
  for (const k of ['B', 'C', 'D']) EN2[k] = EN2.A;

  /* ONE BODY FOR THE FOUR (each scene is this function with its letter, so the engine's reading of any scene's own source
     finds every cue of every ending: main.js cuesOf) */
  function mkEnding2(k) {
    return function (c, s, api) {
      const { tr, step, sfx, sfxFade, fade, rawK, stage, eventWait } = api, F = stage.films.ends2, E = EN2[k], B = E.bar, D = E.dawn;
      step(0, () => F.begin(k, api, s, E));
      tr(0, E.end, (kk, t) => F.frame(t), rawK);
      /* ================================ EACH ENDING'S OWN BEGINNING */
      if (k === 'A') {
        sfx(0.15, 'u51phoneup', 0.45);                                             // his thumb on the name
        sfx(E.ring + 0.15, 'u51ring', 0.75); sfx(E.ring + 3.15, 'u51ring', 0.75);   // the call rings twice (a Singapore ring)
        sfx(E.connect, 'u51connect', 0.8);                                         // and he answers
        sfx(E.ph51A1, 'ph51A1tel', 1);                                             // "I'm here. Tell me what you feel."
        sfx(E.zv51A1, 'zv51A1', 1);                                                // "My head... it's like something's crushing it from every side."
        sfx(E.ph51A2, 'ph51A2tel', 1);                                             // "Listen to me, and do exactly what I say."
        sfx(1.6, 'u51wave', 0.45);                                                 // a wave of it as he calls
        for (let t = 0.3; t < E.b0; t += 0.7) sfx(t, 'u51heart', 0.32);            // his heart, fast
      }
      /* ================================ THE BARRIER (the plan's 9.7) */
      sfx(B.ph51x1, 'ph51x1tel', 1);                                               // "The one who made the spell felt it break. He is sending it back, to find out who helped her."
      sfx(B.ph51x1 + 2.4, 'u51wave', 0.5);                                         // a wave; the picture pinches
      sfx(B.ph51x2, 'ph51x2tel', 1);                                               // "Get the white thread from your bag. Sit on the floor, in the middle of the room."
      for (let t = B.walk0 + B.rise1 + 0.25; t < B.bag - 0.1; t += 0.64) sfx(t, 'u51tile', 0.34);   // his bare feet on the tiles, to the bag
      sfx(B.zip, 'u51zip', 0.7);                                                   // his bag's zip, his hand in it
      for (let t = B.spool + 1.15; t < B.sit0 + 0.2; t += 0.64) sfx(t, 'u51tile', 0.34);   // to the middle of the room
      sfx(B.sit0 + 0.4, 'u51floor', 0.4);                                          // down onto the floor
      sfx(B.sit0 + 0.7, 'u51wave', 0.45);
      for (let t = B.b0 + 0.4; t < B.circle; t += 0.68) sfx(t, 'u51heart', 0.3);   // his heart, through all of it
      sfx(B.circle - 0.2, 'u51spool', 0.55);                                       // the thread drawn off the spool as he begins
      /* CLOSE THE CIRCLE: the film's clock stands on it until the thread is laid (its drag and "Close it." are the event's own,
         c_yfilm2.js circleTick); the spark's tiny chime as the film goes on */
      eventWait(B.circle, F.circleOpts(), (r) => F.circleDone(r));
      sfx(B.circle + 0.02, 'u51closed', 0.75);
      sfx(B.ph51x4, 'ph51x4tel', 1);                                               // "Good. Now stay inside. Whatever you hear, stay inside."
      /* the Jinapañjara through the phone, its captions on its breaths (kit.captions, wall time: v21.31) */
      sfx(B.chant, 'ph51jinatel', 1);
      step(B.chant, () => F.chantOn());
      sfx(B.m7, 'u51m7circle', 0.7);                                               // M7 The Circle: low strings and khim under the chant, rising to the break
      sfx(B.vis0, 'u51vison', 0.85);                                               // his sight opened, held by the film
      sfx(B.door0 + 0.2, 'u51gtick1', 0.45); sfx(B.door0 + 1.7, 'u51gtick2', 0.4);  // the glass ticking, pressed from outside
      sfx(B.touch - 0.87, 'u51swell', 0.65);                                       // the deep swell, its peak on the first touch
      for (let i = 0; i < 7; i++) sfx(slow2Inv(B.touch + i * 0.32, B.slow0) - 0.46, 'u51burn', i ? 0.5 : 0.75);   // each thread meeting the gold: a hiss and a crackle
      sfx(B.surge - 1.81, 'u51vice', 0.8);                                         // the last surge, the vice at its loudest
      sfx(B.brk - 0.96, 'u51bloom', 0.75);                                         // it breaks: a soft bloom
      sfx(B.brk + 0.3, 'u51pop', 0.6);                                             // his ears pop
      sfx(B.brk + 0.6, 'u51exhale', 0.75);                                         // the long breath out
      sfx(B.brk + 1.5, 'u51ticklast', 0.5);                                        // the bottle's last tick on the wood as its water stills
      sfx(B.vis1, 'u51visoff', 0.6);                                               // his sight let go
      sfx(B.ph51x5, 'ph51x5tel', 1);                                               // "It's gone. Breathe."
      sfx(B.zv51x1, 'zv51x1', 1);                                                  // "Who was it?"
      sfx(B.ph51x6, 'ph51x6tel', 1);                                               // "Who it was does not matter tonight. Rest. I will come in the morning."
      sfx(B.lie + 0.5, 'u51floor', 0.3);                                           // he lies down inside the circle
      fade(B.black, B.end - 0.05, 0, 1);
      /* ================================ THE DAWN (the plan's 9.9) */
      if (k === 'A') sfx(D.d0 + 0.05, 'u51m8dawnA', 0.7);                         // M8 Dawn, warm and full
      sfx(D.d0, 'u51bdawn', 0.5); sfx(D.d0 + 28.5, 'u51bdawn', 0.5);               // the morning outside (a koel, mynas, a far train; the AC off)
      sfx(D.d0 + 0.5, 'u51koel', 0.5);
      fade(D.d0 + 0.05, D.d0 + 1.3, 1, 0);
      sfx(D.knock - 0.82, 'u51knock', 0.7);                                        // a knock at his door
      sfx(D.ph51w1, 'ph51w1', 1);                                                  // "Eat first. You fought all night, even sitting still."
      sfx(D.zv51w1, 'zv51w1', 1);                                                  // "I only held the water."
      sfx(D.ph51w2, 'ph51w2', 1);                                                  // "That was enough for it to find you. There is no 'only'. Whoever helps becomes part of it."
      if (k === 'A') sfx(D.ph51A3, 'ph51A3', 1);                                   // "You called at once. That is the first protection: knowing when something is more than you."
      sfx(D.tie + 0.3, 'u51knot', 0.6);                                            // the thread drawn and knotted twice
      sfx(D.ph51w3, 'ph51w3', 1);                                                  // "Before we help anyone, we protect ourselves. From now on, we prepare first."
      sfx(D.zv51w2, 'zv51w2', 1);                                                  // "I had thought I was only there to assist my teacher."
      fade(D.black, D.end - 0.1, 0, 1);
      if (k === 'A') sfxFade(D.black, D.end - 0.15, 'u51m8dawnA');                 // the music down with the picture (v15.3)
      sfxFade(D.black, D.end - 0.15, 'u51bdawn');
      step(E.end, () => F.end());
      c.endFade = 1; c.keepFade = true;
    };
  }
  /* A · "CALL GRANDMASTER PHO NOW." (best): he knows at once that it is more than him, and asks */
  const scCall = mkEnding2('A');
  /* B · "DON'T WAKE HIM. IT'S THREE IN THE MORNING." (good): humility misread; 3:41, the call made at last */
  const scWait = mkEnding2('B');
  /* C · "IT'S ONLY A MIGRAINE. TAKE A PILL AND SLEEP." (bad): dismissal before looking; 3:22, the call */
  const scPill = mkEnding2('C');
  /* D · "OPEN SPIRIT VISION AND FIND WHO'S DOING THIS." (worst): curiosity dressed as courage; a thread wraps his wrist at
     the balcony's door (he never goes past its frame), then the call */
  const scSeek = mkEnding2('D');
