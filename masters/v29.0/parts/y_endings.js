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
  function bar2(b0, w, k) {
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
    /* D: the band of red light still round his wrist once his sight has gone; the gold burns it off (a white flash at the
       wrist, a sharp hiss) */
    if (k === 'D') { T.wrist0 = T.vis1 + 0.2; T.burn = T.wrist0 + 1.5; T.calm = T.burn + 1.6; }
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

  /* THE DAWN'S MARKS from d0 (the plan's 9.9): the morning on his floor (his head to the glass, sitting up), the knock; his
     teacher at the door with breakfast, and in past him; the thread wound up from the floor; at the table his "I only held
     the water.", his teacher's answer and the ending's own line; the white thread tied on his wrist and knotted twice, his
     eyes up to his teacher's face for the last words; his thought; the picture and the music go down together (v15.3).
     M8 decays from its 41st second, under "Before we help anyone ... we prepare first." as the plan has it (its last chord
     under the line); his thought is said in the morning's quiet after it, the birds outside */
  function dawn2(d0, k) {
    const own = { A: [['ph51A3', 0.8]], B: [['ph51B4', 0.8]], C: [['ph51C3', 0.8]], D: [['ph51D3', 1.1], ['ph51D4', 0.9]] }[k];
    const T = tl(d0, [[1.2], ['@wake'], [1.3], ['@sit'], [1.3], ['@knock'], [1.9], ['@door'], [0.9], ['ph51w1', 0.5], ['@inside'], [1.8], ['@wind'], [5.0], ['@table'], [1.8],
                      ['zv51w1', 0.45], ['ph51w2', 0.8]].concat(own, [['@tie'], [0.4], ['ph51w3', 0.5], ['zv51w2', 0.6], ['@black']]));
    T.knot1 = T.tie + 1.5; T.knot2 = T.tie + 3.0;                                  // knotted twice, under the first half of his line
    /* his eyes up to his teacher's face for "From now on, we prepare first." (the line's second sentence, about 3.4 s into
       it): only once his teacher's hands have left the knot and his own hand is down out of the picture, so the look that
       rises never carries a held hand up with it (the hands' pass is drawn from the lens, not from the world) */
    T.up = T.tie + 3.9;
    T.d0 = d0; T.end = T.black + 1.6;
    /* M8 "Dawn" (45.09 s, its last chord ringing out over its last 3.6 s) begins where it ENDS with the picture: the dawn runs
       48 to 51 s on its measured lines, so begun at 0 (the plan's 9.9) it fell silent before his last thought and left the
       black with no music; begun here its last chord sounds under the thought and fades with the picture (v15.3) */
    T.m8 = T.end - 45.1;
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
    /* B · "DON'T WAKE HIM." (good): the phone face down; to the sofa as he says it; his palms together; two waves; his sight
       forced open on the threads at his feet; his thought; the oven's clock, 3:41; on the floor, a slit; the crawl; the call */
    const B = tl(0, [[0.3], ['@down'], [0.7], ['@flat'], [0.2], ['zv51B1', 0]]);
    B.walk = B.zv51B1 + 1.2; B.sit = B.walk + 3.6; B.pray = B.sit + 1.2; B.wave1 = B.pray + 1.2; B.wave2 = B.wave1 + 2.2; B.forced = B.wave2 + 0.8;
    Object.assign(B, tl(B.forced + 0.3, [['zv51B2', 0.4], ['@cut'], [2.6], ['@floor'], [1.6], ['@crawl'], [3.2], ['@reach'], [0.9], ['@ring'], [0.9], ['@connect'], [0.3],
                                         ['ph51B1', 0.35], ['zv51B3', 0.4], ['ph51B2', 0.35], ['zv51B4', 0.4], ['ph51B3', 0.3]]));
    B.clock = '3:41';
    EN2.B = B;
    /* C · "IT'S ONLY A MIGRAINE." (bad): to the kitchen as he says it; the drawer, the pills, the tap; to his sofa, lying back,
       the cushion over his eyes; a wave, the glass doors ticking; his sight open on its own; his thought; the call, 3:22 */
    const C = tl(0, [[0.3], ['zv51C1', 0]]);
    C.walk = C.zv51C1 + 0.5; C.drawer = C.walk + 3.2; C.pills = C.drawer + 0.9; C.tap = C.pills + 1.2; C.sofa0 = C.tap + 2.2; C.lie = C.sofa0 + 4.0;
    C.cushion = C.lie + 1.4; C.wave = C.cushion + 1.0; C.forced = C.wave + 1.8;
    Object.assign(C, tl(C.forced + 0.5, [['zv51C2', 0.4], ['@phone'], [0.8], ['@ring'], [1.6], ['@connect'], [0.3], ['ph51C1', 0.35], ['zv51C3', 0.35], ['ph51C2', 0.3]]));
    C.clock = '3:22';
    EN2.C = C;
    /* D · "OPEN SPIRIT VISION AND FIND WHO'S DOING THIS." (worst): his sight opened on purpose; to his balcony's door after the
       threads; the door slid open, the night's air; in the doorway, his hand on its frame; one thread turns at 10.0 and
       lunges: the band round his wrist; he tears himself back inside at 13.0, the door slides shut; on his knees, the call */
    const D = tl(0, [[0.3], ['zv51D1', 0.2], ['@vis'], [0.4], ['@walk'], [2.0], ['@door'], [0.5], ['@slide'], [1.2], ['@air'], [0.6], ['@step'], [1.5], ['@look'], [2.0],
                     ['@turn'], [0.8], ['@lunge'], [0.3], ['@wrap'], [1.9], ['@tear'], [0.6], ['@slam'], [0.6], ['@knees'], [1.8], ['@phone'], [0.8], ['@ring'], [1.1],
                     ['@connect'], [0.3], ['ph51D1', 0.35], ['zv51D2', 0.35], ['ph51D2', 0.3]]);
    D.clock = '3:05';
    EN2.D = D;
  }
  for (const k of ['A', 'B', 'C', 'D']) {
    const E = EN2[k];
    E.b0 = E.end;
    E.bar = bar2(E.b0, WALK2[k], k);
    E.d0 = E.bar.end;
    E.dawn = dawn2(E.d0, k);
    E.end = E.dawn.end;
    E.slow = (t) => slow2(t, E.bar.slow0);                                         // the threads' own clock through the slow motion
    E.jina = JINA_T;
  }

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
      } else if (k === 'B') {
        sfx(E.flat - 0.05, 'u51facedown', 0.7);                                   // the phone set face down on the table
        sfx(E.zv51B1, 'zv51B1', 1);                                                // "It's three in the morning. He worked all evening. Let him sleep."
        for (let t = E.walk + 0.35; t < E.sit; t += 0.66) sfx(t, 'u51tile', 0.32);  // to his sofa
        sfx(E.sit + 0.3, 'u51sofa', 0.55);                                         // down onto it
        sfx(E.pray + 0.2, 'u51palms', 0.5);                                        // his palms together
        sfx(E.pray + 0.9, 'u51exhale', 0.45);                                      // breathing as he was taught
        sfx(E.wave1 - 1.24, 'u51wave', 0.55); sfx(E.wave2 - 1.24, 'u51wave', 0.65); // a wave; another
        sfx(E.forced, 'u51vison', 1.0);                                            // his sight forced open by the strain
        sfx(E.zv51B2, 'zv51B2', 1);                                                // "I told myself I could carry it till morning."
        sfx(E.cut + 0.1, 'u51clock', 0.45);                                        // the oven's clock, 3:41
        sfx(E.floor - 0.2, 'u51wave', 0.6);                                        // on the floor against the sofa, the picture a slit
        for (let t = E.crawl + 0.2; t < E.reach - 0.2; t += 0.55) sfx(t, 'u51floor', 0.28);   // he crawls to his table
        sfx(E.reach + 0.25, 'u51phoneup', 0.6);                                    // his phone taken from the table
        sfx(E.ring + 0.1, 'u51ring', 0.75);                                        // one ring: he answers at once
        sfx(E.connect, 'u51connect', 0.8);
        sfx(E.ph51B1, 'ph51B1tel', 1);                                             // "How long has it been like this?"
        sfx(E.zv51B3, 'zv51B3', 1);                                                // "Since three."
        sfx(E.ph51B2, 'ph51B2tel', 1);                                             // "Forty minutes. Why did you wait?"
        sfx(E.zv51B4, 'zv51B4', 1);                                                // "I didn't want to wake you."
        sfx(E.ph51B3, 'ph51B3tel', 1);                                             // "You held the water for her. Now let me hold it for you."
        for (let t = 0.4; t < E.cut; t += 0.72) sfx(t, 'u51heart', 0.3);           // his heart
        for (let t = E.floor; t < E.b0; t += 0.6) sfx(t, 'u51heart', 0.34);        // and faster, forty minutes on
      } else if (k === 'C') {
        sfx(E.zv51C1, 'zv51C1', 1);                                                // "It's a migraine. That's all it is."
        for (let t = E.walk + 0.3; t < E.drawer; t += 0.64) sfx(t, 'u51tile', 0.32);   // to the kitchen
        sfx(E.drawer + 0.1, 'u51drawer', 0.7);                                     // the drawer
        sfx(E.pills + 0.2, 'u51foil', 0.75);                                       // a strip of pills, the foil's crackle
        sfx(E.tap + 0.2, 'u51tap', 0.6);                                           // water from the tap
        for (let t = E.sofa0 + 0.4; t < E.lie; t += 0.64) sfx(t, 'u51tile', 0.32);  // to his sofa
        sfx(E.lie + 0.4, 'u51sofa', 0.55);                                         // he lies back on it
        sfx(E.cushion - 0.3, 'u51cushion', 0.7);                                   // a cushion over his eyes
        sfx(E.wave - 1.24, 'u51wave', 0.6);                                        // a wave
        sfx(E.wave + 0.4, 'u51gtick1', 0.5); sfx(E.wave + 1.3, 'u51gtick2', 0.5);  // the glass doors ticking, as if pressed from outside
        sfx(E.forced, 'u51vison', 1.0);                                            // his sight open on its own
        sfx(E.zv51C2, 'zv51C2', 1);                                                // "The pills did nothing. It was still pressing."
        sfx(E.phone - 0.1, 'u51phoneup', 0.5);                                     // his phone out
        sfx(E.ring + 0.1, 'u51ring', 0.75);                                        // the call
        sfx(E.connect, 'u51connect', 0.8);
        sfx(E.ph51C1, 'ph51C1tel', 1);                                             // "Tell me."
        sfx(E.zv51C3, 'zv51C3', 1);                                                // "It's just a migraine, I think. It won't stop."
        sfx(E.ph51C2, 'ph51C2tel', 1);                                             // "This is not a headache. A headache does not follow you home."
        for (let t = 0.4; t < E.b0; t += 0.74) sfx(t, 'u51heart', 0.28);           // his heart
      } else {
        sfx(E.zv51D1, 'zv51D1', 1);                                                // "Who's doing this?"
        sfx(E.vis, 'u51vison', 0.9);                                               // his sight opened on purpose
        for (let t = E.walk + 0.3; t < E.door; t += 0.64) sfx(t, 'u51tile', 0.32);  // after the threads, to his balcony's door
        sfx(E.slide - 0.3, 'u51slide', 0.75);                                      // the door slid open
        sfx(E.air, 'u51bbalc', 0.6);                                               // the night's air rushes in: wind, the city louder, the expressway
        sfx(E.turn - 0.2, 'u51threads', 0.5);                                      // one of them turns, a dry rustle
        sfx(E.wrap - 1.23, 'u51band', 0.85);                                       // a band of red light round his wrist (its crackle tight on the wrap)
        sfx(E.wrap, 'u51visoff', 0.7);                                             // his sight slammed shut
        sfx(E.wrap - 0.4, 'u51wave', 0.8);                                         // the pressure doubled
        sfx(E.slam - 1.03, 'u51slam', 0.75);                                       // the door slides shut in the wind
        sfx(E.knees, 'u51knee', 0.6);                                              // on his knees
        sfx(E.phone, 'u51phoneup', 0.5);
        sfx(E.ring + 0.1, 'u51ring', 0.75);
        sfx(E.connect, 'u51connect', 0.8);
        sfx(E.ph51D1, 'ph51D1tel', 1);                                             // "I'm here."
        sfx(E.zv51D2, 'zv51D2', 1);                                                // "It's outside. It's looking for me."
        sfx(E.ph51D2, 'ph51D2tel', 1);                                             // "Then stop looking for it. Sit down. Now."
        for (let t = 0.4; t < E.wrap; t += 0.7) sfx(t, 'u51heart', 0.3);           // his heart
        for (let t = E.wrap; t < E.b0; t += 0.52) sfx(t, 'u51heart', 0.36);        // and racing
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
      step(B.chantEnd + 0.4, () => F.chantOff());
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
      if (k === 'D') { sfx(B.burn - 0.2, 'u51wburn', 0.8); sfx(B.burn + 0.15, 'u51exhale', 0.5); }   // the band burned off his wrist: a white flash, a sharp hiss
      sfx(B.ph51x5, 'ph51x5tel', 1);                                               // "It's gone. Breathe."
      sfx(B.zv51x1, 'zv51x1', 1);                                                  // "Who was it?"
      sfx(B.ph51x6, 'ph51x6tel', 1);                                               // "Who it was does not matter tonight. Rest. I will come in the morning."
      sfx(B.lie + 0.5, 'u51floor', 0.3);                                           // he lies down inside the circle
      fade(B.black, B.end - 0.05, 0, 1);
      /* ================================ THE DAWN (the plan's 9.9) */
      if (k === 'A') sfx(D.m8, 'u51m8dawnA', 0.7);                                // M8 Dawn, warm and full
      else if (k === 'B') sfx(D.m8, 'u51m8dawnB', 0.7);                           // tender, a solo piano
      else if (k === 'C') sfx(D.m8, 'u51m8dawnC', 0.7);                           // light
      else sfx(D.m8, 'u51m8dawnD', 0.7);                                          // low strings, warming at the thread
      sfx(D.d0, 'u51bdawn', 0.5); sfx(D.d0 + 28.5, 'u51bdawn', 0.5);               // the morning outside (a koel, mynas, a far train; the AC off)
      sfx(D.d0 + 0.5, 'u51koel', 0.5);
      fade(D.d0 + 0.05, D.d0 + 1.3, 1, 0);
      sfx(D.sit + 0.15, 'u51floor', 0.25);                                         // he sits up on the floor
      sfx(D.sit + 0.5, 'u51exhale', 0.4);                                          // a breath out: the night over
      sfx(D.knock - 0.82, 'u51knock', 0.7);                                        // a knock at his door
      sfx(D.door - 0.1, 'u51unlock', 0.5);                                         // the latch
      sfx(D.door + 0.15, 'u51door', 0.6);                                          // the door drawn open
      for (let t = D.inside + 0.2; t < D.wind - 0.1; t += 0.62) sfx(t, 'u51tile', 0.24);   // his teacher's soft steps in past him
      sfx(D.wind + 0.25, 'u51rewind', 0.6);                                        // the thread drawn in over the floor and wound
      sfx(D.wind + 2.7, 'u51drag', 0.45);
      sfx(D.table + 0.25, 'u51paper', 0.55);                                       // the paper bag opened on the table
      sfx(D.table + 0.95, 'u51cups', 0.55);                                        // the two cups of kopi set down
      sfx(D.table + 5.2, 'u51mynah', 0.35);                                        // the morning outside his glass
      sfx(D.ph51w1, 'ph51w1', 1);                                                  // "Eat first. You fought all night, even sitting still."
      sfx(D.zv51w1, 'zv51w1', 1);                                                  // "I only held the water."
      sfx(D.ph51w2, 'ph51w2', 1);                                                  // "That was enough for it to find you. There is no 'only'. Whoever helps becomes part of it."
      if (k === 'A') sfx(D.ph51A3, 'ph51A3', 1);                                   // "You called at once. That is the first protection: knowing when something is more than you."
      else if (k === 'B') sfx(D.ph51B4, 'ph51B4', 1);                              // "A student who won't wake his teacher is protecting the wrong person."
      else if (k === 'C') sfx(D.ph51C3, 'ph51C3', 1);                              // "Don't believe too fast. Don't dismiss too fast either. Look first. Then ask."
      else { sfx(D.ph51D3, 'ph51D3', 1); sfx(D.ph51D4, 'ph51D4', 1); }            // "You went to a stranger's door and knocked. It answered." ... "Curiosity is not courage."
      sfx(D.tie + 0.3, 'u51knot', 0.6);                                            // the thread drawn round his wrist and knotted
      sfx(D.knot2 - 1.1, 'u51knot', 0.45);                                         // and knotted again
      sfx(D.ph51w3, 'ph51w3', 1);                                                  // "Before we help anyone, we protect ourselves. From now on, we prepare first."
      sfx(D.zv51w2, 'zv51w2', 1);                                                  // "I had thought I was only there to assist my teacher."
      fade(D.black, D.end - 0.1, 0, 1);
      if (k === 'A') sfxFade(D.black, D.end - 0.15, 'u51m8dawnA');                 // the music down with the picture (v15.3)
      else if (k === 'B') sfxFade(D.black, D.end - 0.15, 'u51m8dawnB');
      else if (k === 'C') sfxFade(D.black, D.end - 0.15, 'u51m8dawnC');
      else sfxFade(D.black, D.end - 0.15, 'u51m8dawnD');
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
