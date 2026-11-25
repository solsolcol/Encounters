
  /* ================================================================ THE FILMS' CLOCKS AND CUES (M9; their pictures are the
     stage's: c_yfilm.js FILMS5, reached as stage.films). Each clock is built by tl() from SECS (a_head.js), so a measured
     take moves everything after it (v5.15): a list of ['line', gap], [secs] (a pause) and ['@mark'] (a named moment).
     Every cue is a literal call of the film language's sound verb in the film's own source, so the engine's reading of a
     scene warms it and chaptertest checks it (v10.2, v14.16), and none is written past the film's last track (v12.3).
     THE VOICES are the lines' own takes (masters/v28.0/voices/install.py), each on its measured start. THE SOUNDS AND THE
     MUSIC are the chapter's own (masters/v28.0/sound/manifest.json: every name a STING_SAMPLE row; each cue's volume the
     manifest's gain, the measured picks standing until Chad's ear); the places' beds are the play's, written by each film
     frame by frame (c_yfilm.js fmBeds). Every stretch of a second and a half with no voice is held by a sound with a reason:
     the film's music under all of it, and what is happening in the picture (v21.30) */

  /* THE OPENING (the plan's 4.0): the case over black; the car, the number, Jun's line, Ton's; the chime and the doors;
     his teacher out first, then Ton, then Jun; his step out; the sour; his thought; black, the title over it */
  const OP5 = tl(0.5, [['q5o1', 0.55], ['ju5o1', 0.3], ['tn5o1', 0.4], ['@chime'], [0.45], ['@open'], [1.5], ['@out'], [0.8], ['@tonOut'], [0.8], ['@junOut'], [0.6],
                       ['@step'], [1.4], ['@sour'], [1.3], ['q5o2', 0.6], ['@black'], [0.9], ['@end']]);
  OP5.num2 = 7.6; OP5.num3 = OP5.chime - 0.5;                                   // the number over the doors: 2 while the shot is on it, then 3 as the car arrives
  /* (R105, 24 Nov 2026: Chad, "Intro cutscene can be improved further". It opens now on the estate at dusk (c_yfilm.js FILMS5.open:
     its first shot, a crane tilting up from the playground to the east block over the lamps coming on), and cuts into the lift
     at OP5.estate, under his first line; the lift's hum and cable come in on the cut, and the number climbs while it is seen) */
  OP5.estate = 6.3;
  function intro(c, s, api) {
    const { tr, step, sfx, sfxFade, fade, rawK, stage } = api, F = stage.films.open, T = OP5;
    step(0, () => F.begin(api, s));
    tr(0, T.end, (k, t) => F.frame(t), rawK);
    fade(1.3, 2.8, 1, 0);                                                      // (v7.7: the picture comes up as he speaks)
    sfx(T.estate - 0.05, 'u5lifthum', 0.55); sfx(T.estate + 13.75, 'u5lifthum', 0.55);   // the car's hum from the cut into it (its 14.2 s, twice, end to end)
    sfx(0.3, 'u5m1open', 0.7);                                                 // M1: a drone with no tune, dread
    sfx(T.q5o1, 'q5o1', 1);                                                    // "Case two. A devotee's home. He had been quarrelling with people outside, and at home he could not rest."
    sfx(T.estate + 0.4, 'u5cable', 0.45);                                      // the cable, as the picture comes up on the number
    sfx(T.ju5o1, 'ju5o1', 1);                                                  // "Mr Koh says the lights keep going off. Electrician came three times already."
    sfx(T.tn5o1, 'tn5o1', 1);                                                  // "He also says he fights with everybody. His own words."
    sfx(T.chime - 1.1, 'u5cable', 0.5);                                        // the car slowing
    sfx(T.chime, 'u5chime', 0.8);                                              // the chime
    sfx(T.open - 0.05, 'u5liftopen', 0.8);                                     // the doors open on the walkway
    sfxFade(T.out + 0.6, T.step + 0.8, 'u5lifthum');                           // the car's hum left behind as they step out
    sfx(T.open + 0.9, 'u5playground', 0.3);                                    // the last voices of a playground below
    sfx(T.out + 0.35, 'u5phostep', 0.4); sfx(T.out + 0.95, 'u5phostep', 0.34); sfx(T.out + 1.55, 'u5phostep', 0.26);   // his teacher out first
    sfx(T.tonOut + 0.4, 'u5step2', 0.3); sfx(T.tonOut + 1.0, 'u5step1', 0.24);                                          // Ton
    sfx(T.junOut + 0.3, 'u5step1', 0.3); sfx(T.junOut + 0.9, 'u5step2', 0.24);                                          // Jun
    sfx(T.step + 0.1, 'u5step2', 0.45); sfx(T.step + 0.7, 'u5step1', 0.45);                                             // his own two steps out
    sfx(T.sour, 'u5souring', 0.8);                                             // and it hits him: the picture sours
    sfx(T.sour + 0.05, 'u5zbreath', 0.5);                                      // (R105) his breath caught as it reaches him
    sfx(T.sour + 1.0, 'u5heart', 0.55); sfx(T.sour + 1.7, 'u5heart', 0.6);     // his breath stopped; his heart
    sfx(T.q5o2, 'q5o2', 1);                                                    // "The doors opened, then a pungent smell hit me." (R105)
    fade(T.black, T.end - 0.15, 0, 1);
    sfxFade(T.black, T.end - 0.2, 'u5m1open');                                 // (the music goes down with the picture: v15.3)
    step(T.end, () => F.end());
    c.keepFade = true; c.endFade = 1;
  }

  /* THE DEVOTEE (the plan's 4.2): his doors open, he comes to his gate; his greeting; the court; the slippers; his room,
     his three lines; his teacher's two. It ends on the view the hunt begins in */
  /* (R46: the court 2.6 m longer: his walk to the gate 1.4 s longer (was 6.2) and the walk in 1.4 s longer (was 2.7)) */
  const DV5 = tl(0, [[0.8], ['@door'], [1.6], ['@walk'], [7.6], ['@cut1'], [0.35], ['ko5d1', 0.5], ['@in'], [4.1], ['@slip'], [2.7], ['@room'], [0.6],
                     ['ko5d2', 0.35], ['ko5d3', 0.6], ['ko5d4', 0.6], ['ph5d1', 0.45], ['ph5d2', 0.3], ['@turn'], [1.3], ['@end']]);
  function filmDevotee(c, s, api) {
    const { tr, step, sfx, sfxFade, fade, rawK, stage } = api, F = stage.films.devotee, T = DV5;
    step(0, () => F.begin(api, s));
    tr(0, T.end, (k, t) => F.frame(t), rawK);
    fade(0, 0.8, 1, 0);
    sfx(T.door, 'u5doors', 0.6);                                               // his front doors, across the court
    sfx(T.door + 0.6, 'u5m3room', 0.7);                                        // M3: a figure like a clock that does not quite keep time
    /* (R33: M3's body ends 36.9 s into its file, and the film runs 52.9 s: from 38.3 s its sound had gone, under "I know I
       have a mouth" and both of his teacher's lines, and the fade at the end faded nothing. The piece again, da capo, on
       its own clock: its last note sounds 36.0 s into the file, its pulse 0.375 s, and the second copy's first note (0.37
       s into it) lands one pulse after the first copy's last, so no beat is doubled; measured in the mix, the joint holds
       -19 to -32 dBFS through its first second, and the piece goes on at its own quiet opening (-29 to -44 between its
       notes), about 9 dB under its ending, under the voices. The fade below takes it down with the film's last second) */
    sfx(T.door + 0.6 + 36.0, 'u5m3room', 0.7);
    sfx(T.walk + 0.4, 'u5step1', 0.18); sfx(T.walk + 1.0, 'u5step2', 0.2); sfx(T.walk + 1.6, 'u5step1', 0.22); sfx(T.walk + 2.2, 'u5step2', 0.24);
    sfx(T.walk + 2.8, 'u5step1', 0.26); sfx(T.walk + 3.4, 'u5step2', 0.28); sfx(T.walk + 4.0, 'u5step1', 0.3); sfx(T.walk + 4.6, 'u5step2', 0.32);
    sfx(T.walk + 5.2, 'u5step1', 0.34); sfx(T.walk + 5.8, 'u5step2', 0.36);   // his steps down his court, nearer
    sfx(T.walk + 6.4, 'u5step1', 0.38); sfx(T.walk + 7.0, 'u5step2', 0.4);     // (R46: two more, the court longer)
    sfx(T.cut1 - 0.15, 'u5gate', 0.75);                                        // the gate, opened by his hand (the cut)
    sfx(T.ko5d1, 'ko5d1', 1);                                                  // "Grandmaster. You came. I did not know who else to ask."
    sfx(T.in + 0.5, 'u5phostep', 0.32); sfx(T.in + 1.1, 'u5phostep', 0.3); sfx(T.in + 1.7, 'u5phostep', 0.28); sfx(T.in + 2.3, 'u5phostep', 0.26);   // his teacher ahead
    sfx(T.in + 0.25, 'u5step1', 0.45); sfx(T.in + 0.8, 'u5step2', 0.45); sfx(T.in + 1.35, 'u5step1', 0.45); sfx(T.in + 1.9, 'u5step2', 0.45);
    sfx(T.in + 2.45, 'u5step1', 0.42);                                         // his own, up the court between the planters
    sfx(T.in + 2.9, 'u5phostep', 0.24); sfx(T.in + 3.5, 'u5phostep', 0.22);   // (R46: the walk in 1.4 s longer: his teacher's and his own on)
    sfx(T.in + 3.0, 'u5step2', 0.4); sfx(T.in + 3.55, 'u5step1', 0.38);
    sfx(T.slip + 1.0, 'u5tile1', 0.4); sfx(T.slip + 1.65, 'u5tile1', 0.36);    // the slippers left; bare feet on his tiles
    sfx(T.room + 0.5, 'u5lamptick', 0.4);                                      // the fourth lamp, flickering
    sfx(T.ko5d2, 'ko5d2', 1);                                                  // "At night somebody knocks. Inside the house. ..."
    sfx(T.ko5d3, 'ko5d3', 1);                                                  // "Three weeks. My workers say I am short-tempered. I say I am not sleeping!"
    sfx(T.ko5d3 + 2.6, 'u5lamptick', 0.28);
    sfx(T.ko5d4, 'ko5d4', 1);                                                  // "I know I have a mouth. I have quarrelled with people. More than a few."
    sfx(T.ph5d1, 'ph5d1', 1);                                                  // "We will look first."
    sfx(T.ph5d2, 'ph5d2', 1);                                                  // "Use your nose. Then your Spirit Vision. ..."
    sfx(T.turn - 0.2, 'u5lamptick', 0.32);
    sfxFade(T.end - 1.4, T.end - 0.1, 'u5m3room');
    step(T.end, () => F.end());
    /* (it ends where the hunt begins, inside his doors: that view is kept, v19.2) */
    c.keep.view = true;
  }

  /* THE PREPARATION, AND THE TURN (the plan's 4.4): night; the stick unwrapped and taken; the thread; his teacher's two
     words; the lamps sink, his sight opens, the nine lift their heads, turn, come; his protection's colour (the forty-third
     seam's fade in a colour); out of his eyes, to the fight's boom */
  const PR5 = tl(0, [[0.3], ['@lit'], [3.2], ['@unwrap'], [4.6], ['@take'], [3.4], ['@thread'], [0.5], ['ph5p1', 0.35], ['ko5p1', 0.2], ['@noans'], [1.6], ['@teacher'], [1.0],
                     ['ph5p2', 0.6], ['@plant'], [1.0], ['@sink'], [1.1], ['@open'], [2.4], ['@heads'], [1.6], ['@turn'], [1.6], ['@come'], [2.6], ['@hands'], [1.0],
                     ['@violet'], [0.4], ['q5p1', 0.4], ['@leave'], [5.8], ['@rest'], [2.0], ['@end']]);
  const VIOLET5 = '#6b3fe2';                                                   // his protection's colour (the plan's 11: neither gold nor white)
  function filmPrepare(c, s, api) {
    const { tr, step, sfx, sfxFade, fade, rawK, stage } = api, F = stage.films.prepare, T = PR5;
    step(0, () => F.begin(api, s));
    tr(0, T.end, (k, t) => F.frame(t, api), rawK);
    fade(0, 1.2, 1, 0);                                                        // (a time cut: night now)
    sfx(0.3, 'u5m6prep', 0.7);                                                 // M6: ritual, a slow drum, a reed's long line, gathering
    sfx(T.unwrap + 0.2, 'u5unwrap', 0.7);                                      // Ton unwraps the Naga stick
    sfx(T.take - 0.1, 'u5robe', 0.55);                                         // his teacher's sleeve as he takes it (the cut)
    sfx(T.take + 1.4, 'u5bagdown', 0.6);                                       // Jun lays the black bag down before the doorway
    sfx(T.thread - 0.4, 'u5unwind', 0.65);                                     // and draws the white thread across it
    sfx(T.ph5p1, 'ph5p1', 1);                                                  // "Stay behind the thread. Whatever you hear, do not come out."
    sfx(T.ko5p1, 'ko5p1', 1);                                                  // "What will I hear?"
    sfx(T.teacher - 0.7, 'u5phostep', 0.4); sfx(T.teacher - 0.1, 'u5phostep', 0.38); sfx(T.teacher + 0.5, 'u5phostep', 0.34);   // to the court's middle
    sfx(T.ph5p2, 'ph5p2', 1);                                                  // "Stand with me. Do not open to them. Whatever comes, stand."
    sfx(T.plant, 'u5plant', 0.8);                                              // the stick set upright on the paving
    sfx(T.sink, 'u5lampsink', 0.75);                                           // the lamps sink
    sfx(T.open, 'u5vison', 0.85);                                              // his sight opened without his asking: the wave out from him
    sfx(T.open + 0.45, 'u5heart', 0.6); sfx(T.open + 1.05, 'u5heart', 0.65); sfx(T.open + 1.65, 'u5heart', 0.7);
    sfx(T.heads, 'u5nhide', 0.3);                                              // the nine, where they stood all evening: they lift their heads
    sfx(T.turn, 'u5nslip', 0.32);                                              // they turn, toward the one whose senses are open
    sfx(T.come, 'u5ncome', 0.45);                                              // they come
    sfx(T.come + 0.5, 'u5souring', 0.8);                                       // the picture sours hard
    sfx(T.come + 1.6, 'u5gather1', 0.6); sfx(T.come + 2.3, 'u5zbreath', 0.75); // one at him; his breath
    sfx(T.violet - 0.1, 'u5turn', 0.8);                                        // the picture floods with his protection's colour
    sfxFade(T.violet + 0.2, T.violet + 0.9, 'u5ncome'); sfxFade(T.violet + 0.2, T.violet + 0.9, 'u5nslip'); sfxFade(T.violet + 0.2, T.violet + 0.9, 'u5nhide');
    sfx(T.q5p1, 'q5p1', 1);                                                    // "And then I was not alone in my body."
    sfx(T.leave + 0.3, 'u5cagehum', 0.4);                                      // his cage of light, whole
    sfx(T.leave + 0.9, 'u5murmur1', 0.45);                                     // his lips moving: his murmur
    /* (R33 took both down over the film's last 1.9 s, when nothing sounded under the brief. Since then the brief has his
       murmur and the cage's hum of its own (c_fightstage.js fsSoundFrame), which came straight back: a dip. R75's debug,
       V4: so they play to the hand-off, where the engine takes the film's down in 0.3 s as the brief's come up) */
    fade(T.violet, T.violet + 0.6, 0, 1, VIOLET5);
    fade(T.leave, T.leave + 2.2, 1, 0, VIOLET5);
    sfxFade(T.end - 1.6, T.end - 0.1, 'u5m6prep');
    step(T.end, () => F.end());
    /* (it ends on its own picture, the fight's boom, so the mode opens on exactly it: v19.2's keep.view) */
    c.keep.view = true;
  }

  /* TOGETHER (the plan's 5.5, stage 5): the ONE film inside the fight; it cannot be skipped the first time (the fight asks
     for it with kit.film's noSkip). The stick planted; the Naga rises out of it, stoops on the tall shape and goes through the
     three it bursts into, rings the court and goes home into the stick; the three laid low; Mr Koh's warmth; the boom again */
  /* (R63, R64, R69, R70, 23 Nov 2026: the film rebuilt, its clock now the film's own (c_yfilm.js FILMS5.together.tl(): every
     mark read from where the flight reaches it, in STORY seconds); each pierce HOLDS the picture a moment, so a cue is laid at
     the REAL second its mark falls on (F.real). Its sounds: the score from the first frame; the stick planted; the Naga of
     water surging up, its climb at speed and its CRY as its eyes kindle (R70); his line over the court; the stoop down onto
     the shape and the shape bursting; each pierce a stack of sound: the struck blow (u5nagahit1-3), its own water through it
     (u5pierce1-3) and the fire hissing out (u5douse), with a flash in the water's white-blue, the screen shaken and the phone
     buzzed; its ring round the court; its rush home into the stick and the stick's head bursting with light (the together
     press's burst again, its call answered); the three laid; Mr Koh; the boom) */
  /* THE FILM'S CLOCK WRITTEN OUT (R75's harness run, 23 Nov 2026). The film's marks come from its flight at run time
     (FILMS5.together.tl(): the court's fixed marks, the flight's pace, the Naga's made length), so chaptertest's walk of
     every film's cues, made without a world, read each mark as nothing and the film as one second long. These are the same
     marks in story seconds, read off build 48's live clock; the film draws from its live clock, is walked from these when
     there is no world, and says so on the console the moment the two part by more than a fiftieth of a second. Each pierce
     is held a moment (c_yfilm.js NAGA_HIT5: a twelfth of its pace for 0.16 s), which TOG5_REAL carries the same way */
  /* (R75's debug, V7: Mr Koh's line 1.1 s later, the three laid held for it: ko5c2, back and end each 1.1 later) */
  /* (R122 idea 6, the Naga called up like a summon: every mark 1.4 s later, the summon's darkening first; the stick's strike
     and the gold title written out too; and each pierce in slow motion, its speed eased down to 0.15 and back over 0.9 s of
     the real clock (c_yfilm.js NAGA_HIT5, nagaS5): TOG5_REAL the same sum) */
  /* (build 90: each slow centred on its hit, slowest as the head goes through her, its first coming in 0.45 s before it) */
  const TOG5 = { plant: 5.0, rise: 6.8, kindle: 7.35, cry: 7.55, top: 9.0555, ph5c2: 9.1755, stoop: 12.6055, apart: 13.4368, swoop: 13.5454,
                 p1: 14.2425, p2: 14.8688, p3: 15.4223, climb: 15.8196, ring: 16.7176, low: 17.0223, ringOut: 18.8982, home: 20.0839,
                 tail: 22.0839, ko5c2: 24.6839, back: 29.2139, end: 30.8139, strike: 6.65, title: 7.55,
                 reach: 0.3, close: 0.85, zk: 0.85, pk: 1.25, braid: 2.0, lit: 3.3, lift: 4.7, lifted: 5.6, drive: 6.45 };
  const TOG5_REAL = (T, tau) => { const H = 0.9, r = 0.15, sOf = (d) => d - (1 - r) * (d / 2 - H * Math.sin(2 * Math.PI * d / H) / (4 * Math.PI)), SH = sOf(H);
    const inv = (v) => { let a = 0, b = H; for (let i = 0; i < 40; i++) { const m = 0.5 * (a + b); if (sOf(m) < v) a = m; else b = m; } return 0.5 * (a + b); };
    let add = 0;
    for (const p of [T.p1, T.p2, T.p3]) { const s0 = p - SH / 2; if (tau <= s0) break; const d = tau - s0; if (d < SH) return s0 + add + inv(d); add += H - SH; }
    return tau + add; };
  function filmTogether(c, s, api) {
    const { tr, step, sfx, sfxFade, fade, rawK, stage } = api, F = stage.films.together;
    const L0 = F && F.tl ? F.tl() : null, live = !!L0 && typeof L0.end === 'number' && isFinite(L0.end);
    const T = live ? L0 : TOG5, R = (x) => (live ? F.real(x) : TOG5_REAL(TOG5, x)), END = R(T.end);
    if (live) { const off = Object.keys(TOG5).filter(k => !(Math.abs(L0[k] - TOG5[k]) < 0.02) || !(Math.abs(F.real(TOG5[k]) - TOG5_REAL(TOG5, TOG5[k])) < 0.02));
      if (off.length) console.error('e4c5: the Naga film\'s live clock has parted from TOG5 (z_tail.js) at ' + off.join(', ') + ': write its new marks there'); }
    /* (every cue below written out whole, its sound's own name in quotes and a time that holds no call: the engine warms a film's sounds by reading its
       own source, and a name passed through a list, or a time written with a call in it, is not read: the pierces' blows and
       waters, the three laid, the ring, the burst and Mr Koh's line were cold the first time the film played) */
    const P1 = R(T.p1), P2 = R(T.p2), P3 = R(T.p3), LOW = R(T.low), CLIMB = R(T.climb), RING = R(T.ring), RINGOUT = R(T.ringOut),
          HOME = R(T.home), TAIL = R(T.tail), KO = R(T.ko5c2), BACK = R(T.back);
    const FLASH = '#DFF5FF';
    step(0, () => F.begin(api, s));
    tr(0, END, (k, t) => F.frame(t), rawK);
    /* (R64: it opens on the white of the press, everyone set at their marks under it) */
    fade(0, 0.5, 0.85, 0, FLASH);
    /* (R122 idea 6: the screen darkens as he raises the stick (the bars drawn in with it: c_yfilm.js); the dark lifts as the
       water rises round the stick at its strike; the gold NAGA as it rides up) */
    /* (R146, Chad, 25 Nov 2026: "For the start of the naga cutscene, why does the scene suddenly turn dim and dark? It is
       quite hard to see."; R147: "Whats the dim effect for? I dont understand". The darkening, R122's summon (the screen
       dimmed to half from 0.55 s and given back at the strike), was timed for the film's old opening and since R129 lay
       over the whole prologue; a darkening he cannot read the purpose of serves nothing (his v9.5 rule), so it is gone:
       the summon is the bars drawn in, the strike, the water rising and their sounds. Its sound stays, as the two of them
       lift the stick) */
    sfx(T.lift - 0.25, 'u5summon', 0.85);                                      // the summoning, as the stick is lifted
    sfx(T.strike + 0.05, 'u5waterup', 0.9);                                    // the water rising round the planted stick
    sfx(T.title, 'u5title', 0.85);                                             // the NAGA word (R126: toned down)
    sfx(0.05, 'u5m9naga', 0.75);                                               // M9: both themes at once, the only time in the chapter
    sfx(0.1, 'u5shapeloop', 0.5);                                              // the tall shape standing over him
    /* (R129: the prologue. His student's arm to the stick and his hand closed on it; the violet in his fist, the gold in
       his teacher's; the two wound up the shaft together; its head takes their light; the two of them lift it, and drive it down) */
    sfx(T.reach + 0.05, 'u5robe', 0.32);                                       // his student's sleeve as his arm comes to the stick
    sfx(T.zk, 'u5auraup', 0.6);                                                // the violet in his student's fist
    sfx(T.pk, 'u5windup', 0.5);                                                // the gold gathering in his
    sfx(T.braid, 'u5togfill', 0.85);                                           // the two powers wound up the shaft together
    sfx(T.lit - 0.05, 'u5togrise', 0.7);                                       // the carved head taking their light
    sfx(T.lift, 'u5robe', 0.5);                                                // their arms come up with the stick
    sfx(T.drive - 0.02, 'u5swing1', 0.6);                                      // and drive it down
    /* (R149, Chad, 25 Nov 2026: "make the camera rumble and charge up before the naga gets summoned out of the stick": the
       ground's rumble under the charge, rising out of silence as their two powers are wound up the shaft and swelling to its
       loudest as they drive it down, ending under the strike (3.95 s, made from its take turned round: sound/pick.py); the
       camera's own rumble, its jolt at the strike and the push gathering speed are c_yfilm.js's (RUMBLE5); and the phone
       trembles with it, lightly as they lift it, more as they hold it high and drive it, once at the strike) */
    sfx(T.strike - 3.92, 'u5rumble', 0.6);                                     // the ground's rumble under the charge
    step(T.lift, () => { if (api.kit && api.kit.buzz) api.kit.buzz([14, 90, 14, 80, 16, 70, 16, 60, 18, 52, 18, 46, 20, 40, 20, 34]); });
    step(T.lifted, () => { if (api.kit && api.kit.buzz) api.kit.buzz([22, 30, 24, 26, 26, 22, 28, 18, 30, 16, 32, 14, 34, 12, 36, 10, 38, 10, 40, 10]); });
    step(T.drive, () => { if (api.kit && api.kit.buzz) api.kit.buzz([50, 20, 60]); });
    step(T.strike, () => { if (api.kit && api.kit.buzz) api.kit.buzz([80]); });
    sfx(T.plant + 1.65, 'u5plant', 0.9);                                       // and plants it
    sfx(T.rise - 0.05, 'u5nagawater', 1.0);                                    // the Naga of water surging up out of its head
    sfx(T.rise + 0.35, 'u5nagaclimb', 0.9);                                    // R70: its climb at speed
    sfx(T.cry, 'u5nagacry', 1.0);                                              // R70: its cry, its eyes kindling
    sfx(T.rise + 0.6, 'u5mist', 0.3);
    sfx(T.ph5c2, 'ph5c2', 1);                                                  // "The Naga protects us. It always has." (R151)
    /* (R75's debug, V6: his one line stood only 4 dB over the water's surge (full, 5 s from the rise), M9 and the cry's tail,
       where the house's rule is 10 to 15: the surge has done its work by his first word and goes out under it) */
    sfxFade(T.ph5c2 - 0.3, T.ph5c2 + 0.35, 'u5nagawater');
    sfx(T.stoop - 0.1, 'u5nagadive', 0.9);                                     // over, and down onto the shape
    sfxFade(T.apart - 0.2, T.apart + 0.6, 'u5shapeloop');
    sfx(T.apart - 0.04, 'u5shockhit', 0.75);                                   // the shape struck by its passing
    sfx(T.apart, 'u5shapebreak', 0.9);                                         // and bursting into its three
    fade(T.apart, T.apart + 0.05, 0, 0.35, FLASH); fade(T.apart + 0.05, T.apart + 0.35, 0.35, 0, FLASH);
    sfx(T.apart + 1.2, 'u5cagewhole', 0.6);                                    // his cage whole again
    sfx(T.swoop + 0.1, 'u5nagapass', 0.8);                                     // round the west of the court and down onto the arc
    /* each pierce: the blow, its own water through it, its fire hissing out */
    sfx(P1 - 0.45, 'u5slowin', 0.75);                                          // (R122 idea 6: the slow motion coming in at the first)
    sfx(P1 - 0.04, 'u5nagahit1', 1.0); sfx(P1, 'u5pierce1', 0.85); sfx(P1 + 0.14, 'u5douse', 0.75);
    sfx(P2 - 0.04, 'u5nagahit2', 1.0); sfx(P2, 'u5pierce2', 0.85); sfx(P2 + 0.14, 'u5douse', 0.75);
    sfx(P3 - 0.04, 'u5nagahit3', 1.0); sfx(P3, 'u5pierce3', 0.85); sfx(P3 + 0.14, 'u5douse', 0.75);
    /* with a flash in the water's white-blue and the phone buzzed, each harder than the last */
    [[P1, [40, 30, 70]], [P2, [45, 30, 80]], [P3, [60, 30, 120]]].forEach(([h, buzz], j) => {
      fade(h, h + 0.04, 0, 0.6 + 0.1 * j, FLASH); fade(h + 0.04, h + 0.42, 0.6 + 0.1 * j, 0, FLASH);
      step(h, () => { if (api.kit && api.kit.buzz) api.kit.buzz(buzz); });
    });
    sfx(LOW, 'u5laid', 0.8);                                                   // the three sunk low, cool
    sfx(CLIMB + 0.1, 'u5nagawrap', 0.85);                                      // up into its ring round the court
    sfx(RING + 0.4, 'u5mist', 0.28);
    sfx(RINGOUT - 0.3, 'u5nagapass', 0.75);                                    // the spiral down
    sfx(HOME - 0.35, 'u5nagadive', 0.85);                                      // its rush home into the stick
    sfx(TAIL - 0.05, 'u5togpress', 1.0);                                       // the stick's head bursting with light: its call answered
    fade(TAIL, TAIL + 0.06, 0, 0.7, FLASH); fade(TAIL + 0.06, TAIL + 0.6, 0.7, 0, FLASH);
    step(TAIL, () => { if (api.kit && api.kit.buzz) api.kit.buzz([30, 40, 90]); });
    sfx(KO, 'ko5c2', 1);                                                       // "It is... warm. Why is it warm?"
    sfxFade(BACK - 0.2, END - 0.1, 'u5m9naga'); sfxFade(END - 1.0, END - 0.1, 'u5mist');
    step(END, () => F.end());
    c.keep.view = true;
  }

  /* THE BAG TIED (the plan's 4.6): back into his eyes; the rooms; the knot; Ton's line, his; Mr Koh's window and his two
     words from his teacher; at the lift, "Was it real?"; the next case seeded; the doors close on black (the collector's
     film begins on it, with the card) */
  const BT5 = tl(0, [[0.3], ['@thin'], [1.6], ['@violet'], [0.9], ['@eyes'], [0.8], ['@lamp1'], [0.8], ['@lamp2'], [1.2], ['@room1'], [4.4], ['@room2'], [3.6], ['@room3'], [3.6],
                     ['@knot'], [2.6], ['@tied'], [1.0], ['tn5b1', 0.4], ['q5b1', 0.8], ['@window'], [1.4], ['ko5b1', 0.4], ['ph5b1', 0.6], ['@wai'], [1.2], ['ph5b2', 0.4], ['ph5b3', 0.8],
                     ['@lift'], [0.8], ['q5b2', 0.35], ['ph5b4', 0.4], ['ph5b5', 0.5], ['@doors'], [0.6], ['ju5b1', 0.3], ['ph5b6', 0.5], ['@in'], [3.8], ['@close'], [1.2], ['@black'], [0.8], ['@end']]);
  function filmBagTied(c, s, api) {
    const { tr, step, sfx, sfxFade, fade, rawK, stage } = api, F = stage.films.bagtied, T = BT5;
    step(0, () => F.begin(api, s));
    tr(0, T.end, (k, t) => F.frame(t, api), rawK);
    sfx(0.0, 'u5murmur1', 0.45);                                               // his murmur, still: it stops in the middle of a breath
    sfxFade(T.thin + 0.5, T.thin + 0.62, 'u5murmur1');
    sfx(0.05, 'u5cagethin', 0.4); sfxFade(T.thin + 0.3, T.thin + 1.5, 'u5cagethin');   // the cage, thinning
    fade(T.violet, T.violet + 0.45, 0, 1, VIOLET5); fade(T.eyes - 0.15, T.eyes + 0.7, 1, 0, VIOLET5);
    sfx(T.violet - 0.1, 'u5turn', 0.7);                                        // back through the violet, into his eyes
    sfx(T.eyes + 0.1, 'u5zbreath', 0.7);                                       // his own breath, in his own body
    sfx(T.eyes + 0.6, 'u5heart', 0.55); sfx(T.eyes + 1.3, 'u5heart', 0.5);
    sfx(T.eyes + 0.5, 'u5m11light', 0.7);                                      // M11: the house lighter, plain and warm
    /* (R33: M11 runs 39.3 s, full to 38.1 s of its file and then a second's fall, so it ended inside "Mend what you
       can..." and "see a doctor" had no music, and its fade at the lift faded nothing. The piece again, da capo: its pulse
       0.84 s, and the second copy laid so its first notes fall on the first copy's own beat (its first sound with the first
       copy's last, 38.13 s into the file; its first pulse, 0.64 s into it, on the next beat), over the first one's fall;
       measured in the mix, the joint holds -23 to -32 dBFS and the piece goes on at its opening, about 5 dB under its
       body, until the black at the lift takes it down with the picture) */
    sfx(T.eyes + 0.5 + 38.1, 'u5m11light', 0.7);
    sfx(T.lamp1, 'u5lampflare', 0.35); sfx(T.lamp2, 'u5lampflare', 0.35);      // the court's lamps come back, one, then the other
    sfx(T.room1 + 0.35, 'u5baginhale', 0.7); sfx(T.room1 + 2.3, 'u5bagblow', 0.7);   // the living room: his breath drawn, blown into the bag
    sfx(T.room2 + 0.3, 'u5baginhale', 0.7); sfx(T.room2 + 2.2, 'u5bagblow', 0.7);    // the dining room
    sfx(T.room3 + 0.3, 'u5baginhale', 0.7); sfx(T.room3 + 2.2, 'u5bagblow', 0.7);    // the terrace door
    sfx(T.knot + 0.15, 'u5bagtie', 0.75);                                      // the knot: the bag's own cord, tightly
    sfx(T.tied + 0.1, 'u5curtain', 0.5);                                       // Mr Koh draws his curtains back
    sfx(T.tn5b1, 'tn5b1', 1);                                                  // "Brother. Before he took it from me. It was shaking. ..."
    sfx(T.q5b1, 'q5b1', 1);                                                    // "I believe you felt it."
    sfx(T.window - 0.6, 'u5window', 0.7);                                      // a window opened: the night air
    sfx(T.window + 0.5, 'u5flicker', 0.6);                                     // the fourth lamp flickers once, and holds
    sfx(T.ko5b1, 'ko5b1', 1);                                                  // "It is... lighter. Is it lighter? Or is it me."
    sfx(T.ph5b1, 'ph5b1', 1);                                                  // "Both can be true."
    sfx(T.ph5b2, 'ph5b2', 1);                                                  // "Mend what you can with the people you quarrelled with. ..."
    sfx(T.ph5b3, 'ph5b3', 1);                                                  // "And if you still do not sleep, see a doctor. ..."
    fade(T.lift - 0.4, T.lift, 0, 1); fade(T.lift + 0.1, T.lift + 0.6, 1, 0);   // (a scene change happens in the black: v16.1)
    sfxFade(T.lift - 0.4, T.lift, 'u5m11light');
    sfx(T.lift + 0.4, 'u5m12lift', 0.7);                                       // M12: at the lift, his teacher's lesson: almost nothing
    /* (R33: M12 falls under -35 dBFS 20.5 s into its 24.8, so Jun's news, "Tomorrow.", the doors and the hum on the black
       had none, and its fade with the black faded nothing. A held chord with no beat: the second copy comes in as the
       first begins its fall, its own second of rising laid over it; measured in the mix, the joint holds -31 to -38 dBFS
       (the body before it -29 to -34), and the black takes it down with the picture) */
    sfx(T.lift + 0.4 + 20.2, 'u5m12lift', 0.7);
    sfx(T.q5b2, 'q5b2', 1);                                                    // "Grandmaster. The smell. Was it real?"
    sfx(T.ph5b4, 'ph5b4', 1);                                                  // "You smelled it. They did not. That is a fact about you. ..."
    sfx(T.ph5b5, 'ph5b5', 1);                                                  // "Your nose is open. Last time it was your sight. An open door is not a skill."
    sfx(T.doors - 0.55, 'u5chime', 0.75); sfx(T.doors - 0.05, 'u5liftopen', 0.75);   // the car arrives; its doors
    sfx(T.ju5b1, 'ju5b1', 1);                                                  // "Master, the man with the collection. He called again. Tomorrow, three o'clock?"
    sfx(T.ph5b6, 'ph5b6', 1);                                                  // "Tomorrow."
    /* (R75's debug, F8: everyone goes in now, his teacher after Ton, he last, the doors closing in front of him: their steps
       where their feet go. The doors had closed between him and the two inside while these steps walked him in) */
    sfx(T.in + 1.25, 'u5phostep', 0.35); sfx(T.in + 1.85, 'u5phostep', 0.3); sfx(T.in + 2.2, 'u5step1', 0.3); sfx(T.in + 2.45, 'u5phostep', 0.3); sfx(T.in + 2.75, 'u5step2', 0.35);   // in
    /* (R75's debug: the cut inside waits for his teacher at his place, his last steps and his own to the doors: 3.8 s from
       in to close, was 3.0, his teacher's bare shoulder had crossed the edge of a phone's frame as the cut came) */
    sfx(T.in + 3.05, 'u5phostep', 0.26); sfx(T.in + 3.25, 'u5step1', 0.3);
    sfx(T.close - 0.05, 'u5liftshut', 0.75);                                   // the doors close
    sfx(T.close + 0.4, 'u5lifthum', 0.4);                                      // the car's hum again, on the black
    fade(T.black, T.end - 0.1, 0, 1);
    sfxFade(T.black, T.end - 0.15, 'u5m12lift'); sfxFade(T.black, T.end - 0.15, 'u5lifthum');
    step(T.end, () => F.end());
    c.keepFade = true; c.endFade = 1;
  }

  /* THE COLLECTOR, THE FILM IN (the plan's 4.7): the card on black; the room in daylight; the pieces laid; his words */
  const CO5 = tl(0, [[0.3], ['@card'], [2.6], ['@up'], [1.4], ['@case'], [2.2], ['@laid'], [0.6], ['co5t1', 0.6], ['@laugh'], [1.35], ['co5t2', 0.4], ['@end']]);
  /* (the laugh is heard for 1.15 s from its mark, u5colaugh's sound from 0.15 to 1.30 s of its file: his next line waits
     0.2 s past it, so his voice is never over his own laugh) */
  function filmCollector(c, s, api) {
    const { tr, step, sfx, sfxFade, fade, rawK, stage } = api, F = stage.films.collector, T = CO5;
    step(0, () => F.begin(api, s));
    tr(0, T.end, (k, t) => F.frame(t), rawK);
    fade(T.up, T.up + 1.2, 1, 0);
    sfx(0.3, 'u5m13shop', 0.65);                                               // M13: an afternoon, a soft plucked figure (under the card, then the room)
    sfx(T.up + 0.2, 'u5farchime', 0.3);                                        // a far chime as the room comes up
    sfx(T.case + 0.3, 'u5clasp', 0.75);                                        // the case's clasps
    sfx(T.case + 1.0, 'u5lay1', 0.6); sfx(T.case + 1.35, 'u5lay2', 0.6); sfx(T.case + 1.7, 'u5lay1', 0.55);
    sfx(T.laid - 0.25, 'u5lay3', 0.7); sfx(T.laid + 0.25, 'u5lay2', 0.55);    // laid out one after another, quickly, heard as the shot finds them
    sfx(T.co5t1, 'co5t1', 1);                                                  // "Twenty. Twenty-one, with this one. I started with one."
    sfx(T.laugh - 0.15, 'u5colaugh', 0.6);                                     // his small laugh (its sound from 0.15 s into the file)
    sfx(T.co5t2, 'co5t2', 1);                                                  // "Lately nothing goes right. I am tired all the time. And there is a smell. ..."
    sfxFade(T.end - 1.2, T.end - 0.1, 'u5m13shop');
    step(T.end, () => F.end());
    /* (it ends on his seat's view, where the table's play seats him: kept) */
    c.keep.view = true;
  }

  /* THE FOUR ENDINGS (the plan's 4.9): each its own beats, THE RITE at its `rite` (its own beats RT5, from there), the
     smell gone ("I feel lighter. My head is quieter."), its own close, and THE LAST PICTURE at its `close` (CL5) */
  /* (R33: his sight shuts over the film's 1.4 s, c_yfilm.js fmVision, so from `unsee` 11.0 it was still shutting across
     the cut to the bag at 11.6: the room stayed inside the vision's edge, its look whole (vis.k 1, the edge's first six
     metres) until about 12.0 and gone at 12.4, so the bag's close shot opened in Spirit Vision's look and lost it half a
     second after the cut. From 10.2 it is shut exactly on the cut, and the bag is seen in plain daylight) */
  const RT5 = { see: 0.3, dip: 1.4, away: 2.4, unsee: 10.2, bag: 11.6, string: 12.2, end: 14.4 };
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
  /* ONE BODY FOR THE FOUR (each scene is this function with its letter), so the engine's reading of any scene's own source
     (main.js cuesOf, which warms a scene's cues as the decision opens) finds every cue of every ending, the rite's and the
     close's among them: none is cued from a helper it cannot see */
  function mkEnding5(k) {
    return function (c, s, api) {
      const { tr, step, sfx, sfxFade, fade, rawK, stage } = api, F = stage.films.ending, E = EN5[k], r0 = E.rite, c0 = E.close, R = RT5;
      step(0, () => F.begin(k, api, s));
      tr(0, E.end, (kk, t) => F.frame(k, t, api), rawK);
      /* each ending's own colour, from its first picture to its close (M15 to M18), and its own beats */
      if (k === 'A') {
        sfx(0.2, 'u5m15endA', 0.6);                                            // M15: an order obeyed, unresolved
        /* (R75's debug, V2: M15's body holds to 41 s of its 49.3 and is under -32 dBFS from 41.5, so his teacher's last words
           and "He will buy again..." had no music until M19, and the close's fade faded nothing. The piece again, da capo, as
           B's (R33): its pulse 0.417 s, its last strong note 40.90 s into the file, the second copy's first (0.05 s into
           it) one pulse after it) */
        sfx(0.2 + 41.27, 'u5m15endA', 0.6);
        sfx(E.co5A1, 'co5A1', 1);                                              // "All? Even the ones that did nothing?"
        sfx(E.q5A1, 'q5A1', 1);                                                // "All."
        sfx(E.push + 0.25, 'u5slide', 0.7);                                    // the case pushed across the cloth, as a man pays a fine
        sfx(E.co5A2, 'co5A2', 1); sfx(E.ph5A1, 'ph5A1', 1);
        sfx(E.gone - 0.4, 'u5farchime', 0.4);                                  // the door's chime as he goes
        sfx(E.ph5A2, 'ph5A2', 1); sfx(E.q5A2, 'q5A2', 1);
        sfxFade(c0 - 0.3, c0 + 0.8, 'u5m15endA');
      } else if (k === 'B') {
        sfx(0.2, 'u5m16endB', 0.6);                                            // M16: a man finding out, plain warmth
        /* (R33: M16 falls from 45.5 s of its 49.7 and is under -45 dBFS by 47, so the end of his teacher's words and "He
           put them down himself." had no music until M19, and its fade with the close faded nothing. The piece again, da
           capo: its pulse 0.42 s, its last note 45.13 s into the file, and the second copy's first (0.05 s into it) one
           pulse after it; measured in the mix, the joint holds -27 to -38 dBFS, as the body before it, and the close takes
           it down under M19) */
        sfx(0.2 + 45.5, 'u5m16endB', 0.6);
        sfx(E.co5B1, 'co5B1', 1); sfx(E.co5B2, 'co5B2', 1); sfx(E.co5B3, 'co5B3', 1); sfx(E.co5B4, 'co5B4', 1);
        sfx(E.lid + 0.15, 'u5lid', 0.75);                                      // the case's lid shut by his own hand
        sfx(E.lid + 0.85, 'u5slide', 0.65);                                    // and the case pushed across
        sfx(E.co5B5, 'co5B5', 1); sfx(E.q5B1, 'q5B1', 1);
        sfx(E.gone - 0.4, 'u5farchime', 0.4);                                  // the door's chime as he goes
        sfx(E.ph5B1, 'ph5B1', 1); sfx(E.q5B2, 'q5B2', 1);
        sfxFade(c0 - 0.3, c0 + 0.8, 'u5m16endB');
      } else if (k === 'C') {
        sfx(0.2, 'u5m17endC', 0.6);                                            // M17: a small alarm that steadies
        sfx(E.co5C1, 'co5C1', 1);                                              // "Three! Only three."
        sfx(E.three + 0.1, 'u5slide', 0.5);                                    // the three pushed across with one finger
        sfx(E.pack + 0.15, 'u5foam', 0.7); sfx(E.pack + 0.75, 'u5foam', 0.6);  // the seventeen fitted back into their foam
        sfx(E.see, 'u5vison', 0.8);                                            // his sight opened on the case
        sfx(E.see + 1.3, 'u5pcwarm', 0.4);                                     // something small his nose never caught lifts its head
        sfx(E.ph5C1 + 0.2, 'u5visoff', 0.7);                                   // his sight shut again for the talk
        sfx(E.ph5C1, 'ph5C1', 1); sfx(E.co5C2, 'co5C2', 1); sfx(E.ph5C2, 'ph5C2', 1);
        sfx(E.across + 0.2, 'u5slide', 0.7);                                   // all twenty go across
        sfx(E.q5C1, 'q5C1', 1);
        sfxFade(c0 - 0.3, c0 + 0.8, 'u5m17endC');
      } else {
        sfx(0.2, 'u5m18endD', 0.6);                                            // M18: a wry turn
        sfx(E.co5D1, 'co5D1', 1);                                              // "Yes. Yes! I know a man. Proper monks' pieces, all blessed. I can have twenty by Friday."
        sfx(E.co5D1 + 3.6, 'u5count', 0.5); sfx(E.co5D1 + 5.4, 'u5count', 0.45);   // already counting on the table
        sfx(E.ph5D1, 'ph5D1', 1); sfx(E.ph5D2, 'ph5D2', 1);
        sfx(E.q5D1, 'q5D1', 1);
        sfxFade(c0 - 0.3, c0 + 0.8, 'u5m18endD');
      }
      /* THE RITE (RT5 from r0): his sight held open (ending C's is open already); the fan dipped and thrown every 2.2 s,
         its whisk and the water falling on the pieces; the presences crying out and coming away; his sight shut; the
         pieces gathered into the bag on a cut; the white string wound and knotted; the heaviness lifting */
      sfx(r0 + R.see, 'u5vison', 0.8);
      sfx(r0 + R.see + 0.5, 'u5heart', 0.5); sfx(r0 + R.see + 1.2, 'u5heart', 0.5);
      sfx(r0 + R.dip + 0.35, 'u5whisk1', 0.7); sfx(r0 + R.dip + 0.95, 'u5drops', 0.6);
      sfx(r0 + R.dip + 2.55, 'u5whisk2', 0.7); sfx(r0 + R.dip + 3.15, 'u5drops', 0.6);
      sfx(r0 + R.dip + 4.75, 'u5whisk1', 0.7); sfx(r0 + R.dip + 5.35, 'u5drops', 0.6);
      sfx(r0 + R.dip + 6.95, 'u5whisk2', 0.7); sfx(r0 + R.dip + 7.55, 'u5drops', 0.6);
      sfx(r0 + R.dip + 9.15, 'u5whisk1', 0.65); sfx(r0 + R.dip + 9.75, 'u5drops', 0.5);
      /* (R33: five throws, as the picture draws them: c_yfilm.js throws while the rite's clock is between RT5.dip and
         RT5.bag, every 2.2 s from 1.4. A sixth whisk and its water were heard at 12.75 and 13.35 s, after the cut to the
         tied bag, over the string being wound) */
      sfx(r0 + R.away, 'u5pcangry', 0.7); sfx(r0 + R.away + 0.3, 'u5pcry1', 0.6);                     // the angry one, as the water reaches it
      sfx(r0 + R.away + 0.7, 'u5pchungry', 0.7); sfx(r0 + R.away + 1.1, 'u5pcry2', 0.55);              // the hungry one
      sfx(r0 + R.away + 1.4, 'u5pcwarm', 0.65);                                                       // the one looking for energy
      sfx(r0 + R.unsee, 'u5visoff', 0.8);                                      // his sight shut
      sfx(r0 + R.bag - 0.1, 'u5pgather', 0.75);                                // the pieces gathered into the black bag (the cut)
      sfx(r0 + R.string, 'u5string', 0.75);                                    // the white string wound and knotted, chanted over
      sfx(r0 + R.end - 0.6, 'u5lighter', 0.7);                                 // the heaviness lifting
      sfx(E.co5z1, 'co5z1', 1);                                                // "I feel lighter. My head is quieter."
      /* THE CLOSE: the last picture (the bag, the string, his teacher's hand on it, the case open and empty beside it),
         the student's theme alone, quiet (M19), and the lesson */
      sfx(c0 - 0.6, 'u5m19card', 0.6);
      sfx(c0 + CL5.q, 'q5z1', 1);                                              // "Understanding first. Then possession."
      fade(c0 + CL5.black, E.end - 0.1, 0, 1);
      sfxFade(c0 + CL5.black, E.end - 0.15, 'u5m19card');
      step(E.end, () => F.end());
      c.endFade = 1; c.keepFade = true;
    };
  }
  /* A · "NONE OF THEM. LET THEM ALL GO." (good): the right act and no understanding, an order; he will buy again */
  const scNone = mkEnding5('A');
  /* B · "TELL ME WHAT EACH ONE IS, AND WHERE IT CAME FROM." (best): the case file's own plain questions, and the man
     answers them himself; he closes the case's lid and pushes it across the cloth */
  const scTell = mkEnding5('B');
  /* C · "THESE THREE ARE THE WORST. THE REST FEEL QUIET." (bad): the student made his appraiser; on a piece already
     packed, something his nose never caught lifts its head */
  const scThree = mkEnding5('C');
  /* D · "KEEP THE HOLY ONES. THE YIN ONES ARE THE TROUBLE." (worst): a rule about kinds of object, which the case file
     refuses in its first sentence; he is already counting twenty more on his fingers */
  const scHoly = mkEnding5('D');

  (window.__CHAPTERS__ = window.__CHAPTERS__ || {}).e4c5 = Object.assign(DATA, {
    build,
    intro,
    films: { devotee: filmDevotee, prepare: filmPrepare, together: filmTogether, bagtied: filmBagTied, collector: filmCollector },
    scenes: [scNone, scTell, scThree, scHoly]
  });
})();
