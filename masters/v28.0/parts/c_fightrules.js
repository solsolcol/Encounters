
    /* ================================================================ THE CLEANSING'S RULES (masters/v28.0/parts/c_fightrules.js)
       The tag-team fight of the plan's 5, REDESIGNED for Chad's R14 (21 Nov 2026): "Zavier needs actual abilities that
       do something or synergize with pho abilities so that it is a real reason to switch back and forth between
       characters for real gameplay. Like an ability to lock a prai in a bubble to stop it from escaping."
       docs/V28.0-FIGHT.md is the specification; THIS PART IS ITS ONE SET OF RULES AND ITS ONE TABLE OF NUMBERS, so what
       is played and what is tested are one function (v8.7): tools/probes/fightsim.mjs loads this very file in Node and
       plays it ten thousand times a simulated player.

       PURE. No page, no THREE, no clock and no randomness of its own (no Date, no performance, no Math.random): a fight
       is ONE PLAIN OBJECT (FIGHT.create), moved on by FIGHT.step(fight, input, dt, io), which answers what happened as a
       list of events for the pictures and the sounds. io.rand is the chapter's seeded stream (v6.15: a replay rewinds
       it), io.secs(key) a line's length (the chapter's SECS). Because the fight is plain data, a retry, a replay and a
       probe's diff all read it as it is (v8.1, v8.2).

       THE IDEA IN FIVE LINES (the spec's 1):
         1. Nothing is destroyed. A Prai is tired, and a tired one is gathered into the black bag: nine to nought.
         2. They come for Master Zavier, whose senses are open. His Lersi's cage of light holds them at its bars, and wears.
         3. Grandmaster Pho's fire only CHASES a free Prai away (it flees and hides, and comes back unseen); it TIRES a Prai
            only once Master Zavier has BOUND it in a bubble (bound, it cannot move, slip, hide or rise again). Only
            Master Zavier SMELLS out the hidden; only Grandmaster Pho BAGS the tired. So every Prai is the pair's work.
         4. The golden SHOCKWAVE gathers every bound Prai at once; while it is gathered they rush to break it, so Master
            Zavier LENDS his teacher his cage for those seconds, and stands with nothing round him. Twice (six left, and
            four) the Prai cling to the house: the bag is shut, and only the gold can take them.
         5. Losing begins the FIGHT again (Chad's R14: "Fight restarts"); nothing is ever played for him.

       HOW THE CHAPTER USES IT (c_story.js, when the fight is built: the tracker's M8):
         const fight = FIGHT.create({ sanity: <his sanity> });      (guard left at 0 in the game: the engine's evCut guards
           the drain events once, below; `guard` is for the simulation, which has no engine, to play the same sum)
         every frame of the mode:  const ev = FIGHT.step(fight, input, dt, { rand, secs: k => SECS[k] });
           input = { act } or { slot } (the button pressed: one a frame, the main one first), { mx, mz } (the stick, by
           the screen: up is -z, down the court), { pick: id } (a tap on a Prai) or { pickCloud: id } (a tap on a stale
           cloud), { sanity } (the engine's own number after its guards, fed back every frame).
           Each event is drawn and sounded by the chapter: { e: 'say', key } is a line of the script (also a caption);
           { e: 'drain', amt } is a cost the chapter passes through kitAward('sanity', -amt, { minigame: true }), so a
           worn piece guards here too (v14.13); { e: 'stage', to } moves the mode (the Naga's film, the card, the end).
         FIGHT.hud(fight) is the screen: each button's face, wait, lock and pulse (v8.1: whatever the fight obeys is on
         the screen); FIGHT.need(fight) what the moment asks for (the pulse, and the prompt's words).
       Only the part's one name, FIGHT, is declared in build(): every other name lives inside it (v6.11). */
    const FIGHT = (() => {
      'use strict';

      /* ------------------------------------------------------------------ THE NUMBERS (the spec's 7: the one table) */
      const NUM = {
        // THE COURT, in metres: x across it, z down it (the house's doorway, and the thread across it, at z -3.0; the
        // gate, and the camera behind and above the one he plays, at +3.0). The play area of the plan's 8.1
        /* (R37, 23 Nov: Chad, "increase the total walkable area size of the entire fight sequence area by at least 50% bigger
           ... the current area feels too restrictive to walk in". The court was 3.9 by 6.0 m inside the yard's 5.2 by 8.4,
           and the two of them walked 3.2 by 4.9 m of it (15.7 square metres), held 0.65 m off each side wall and 2.3 m short
           of the gate by lines nobody could see. Now the court is the yard: 0.15 m off its side walls (x 2.45) and 0.4 m
           short of the gate's low wall (its inner face at the yard's z -13.8; the two planters moved into the gate's corners
           to give the room: b_world.js PLANT_Z), 4.9 by 7.7 m; the two of them walk 4.2 by 6.6 m of it, 27.7 square metres
           less the planters' corners, 1.7 times what they had. Was courtX 1.95, courtZ1 3.0) */
        /* (R46, 23 Nov: Chad's pick "Bigger yard + roomy end": the yard 8.0 by 11.0 m (b_world.js COURT), the court the yard
           as R37 made it: 0.15 m off its side walls (x 3.85) and 0.4 m short of the gate's low wall (its inner face at the
           yard's z -16.4, court z 7.7), 7.7 by 10.3 m; the two of them walk 7.0 by 9.2 m of it, 64 square metres less the
           planters' corners, 2.3 times R37's. Was courtX 2.45, courtZ1 4.7) */
        courtX: 3.85, courtZ0: -3.0, courtZ1: 7.3,
        praiIn: 0.2,                          // a Prai keeps this far inside the court's walls
        notch: { z: 5.35, x: 2.86 },          // (R37; R46 5.35 and 2.86, was 2.75 and 1.45: the planters' inner faces x 3.16 and
                                              // -3.24 from z 5.65) and out of the planters in the gate's corners: past z 2.75 it keeps
                                              // within x 1.45 of the middle (their inner faces x 1.76 and -1.84 from
                                              // z 3.05: a Prai's own half-width, 0.3, to spare)
        threadZ: -2.7,                        // and never comes nearer the doorway, or the three behind the thread, than this
        bodyX: 3.5, bodyZ0: -2.3, bodyZ1: 6.9, // where the two of them may stand (R46: was 2.1 and 4.3; R37: was 1.6 and 2.6; the planters in the
                                              // gate's corners stop them as every solid does, the mode's own slide)
        wallOff: 1.6, wallSlide: 0.6,         // from the surge on, both stand this far off the court's walls, eased in at this
        /* (R46: the ROOMY END, his pick: the Naga's loop 0.62 m in from the bigger yard's walls (local x 3.38, its gate end's
           run at court z 6.75), so from the surge on the two stand within x 2.25 (1.13 m from its body, as before) and up to
           z 4.5 toward the gate (2.25 m from its run): 4.5 by 5.9 m, 26.6 square metres, 4.7 times the 1.7 by 3.3 m they had,
           and the lens pulled back over it (c_cast.js PULL5). Was offZ1 1.9) */
        offZ1: 4.5,                           // (R37: 1.6 with the court at the yard's walls, so they stand inside the Naga's
                                              // loop as before, which lies 0.62 m in from the yard's walls: x 0.85 as before;
                                              // and toward the gate no further than the old court let them, z 1.9 (offZ1):
                                              // with the court's length let out to 4.7 the simulator's careful player could
                                              // end the surge on the gate side of his student, and in the lane inside the
                                              // Naga (1.7 m wide, the cage 2.9 across) never got round him to the last three:
                                              // 6 campaigns of 300 stalled, none with offZ1. Was wallOff 1.1 in the smaller court)
                                              // pace where the surge finds one nearer (never a snap): the Naga's body lies
                                              // 0.27 to 0.97 m off them round the court, and passed through whoever stood
                                              // within about a metre of one (FILMS-2, 21 Nov)
        zavAt: [0, 0.7], phoAt: [1.15, 2.0],
        lessonAt: [0.6, -1.6],                // where the lesson's Prai stands and strains toward him (0.6 to the side, 21 Nov:
                                              // at [0, -1.5] it stood straight behind his student from the first lens, the
                                              // line of sight 0.38 m from his middle at head height; here 0.78 m clear: FIGHT-IN)
        laidAt: [[-1.8, -1.12], [0, -1.7], [1.8, -1.12]],   // where the Naga lays the last three (stage 6): FIXED (R64), on its arc across the house side
        entryAt: [[-1.57, -2.46], [1.56, -2.46], [0.08, -2.45, 0.09], [-1.75, -1.25], [1.75, -1.25], [-1.02, -2.3, 0.39], [0.86, -2.09, 0.58], [-0.51, -2.6]],
                                              // (R25, 21 Nov: spread so no two touch: each body's own ground at every 20 cm
                                              // of height (tools/probes/footprint.mjs), turned to face him, 12 cm apart or
                                              // more, clear of the slippers, the bag, the reel, the cloth and the wall lamps,
                                              // one only before the doorway; the two heavies had stood 0.46 m into each
                                              // other and a hide on the slippers, FILMS' clipscan of the turn: FIGHT-IN)
                                              // A slot's third number is a beat, in seconds, before its first move once risen:
                                              // each that rises nearer him than its old slot did waits what its own pace takes
                                              // to cover the difference, so it reaches him on the old line's timing (the 3rd
                                              // 0.05 m at 0.55, the 6th 0.22 m at 0.55, the 7th, a heavy, 0.46 m at 0.8: no
                                              // clear slot at its old 3.38 m); one that rises farther, none
        entryJitter: 0.25,
        // THE TWO OF THEM
        phoWalk: 2.3, zavWalk: 2.6,           // (R25, 21 Nov: "the characters walking speed feels sluggish, make it faster")
                                              // his own Running's pace at full stick (2.31 m/s, measured from his file; his
                                              // Walking plays below about 1.8). Was 1.2. His student RUNS (R34, 23 Nov:
                                              // "master zavier walking speed can be made faster. Also make him use a running
                                              // animation"): his own running take's pace, about 2.6 m/s (the stage plays it);
                                              // was 1.4, his Walking at 1.14 its rate, and 0.6 before that. Nothing of the
                                              // court leans on it: the bodies are clamped and kept apart a step at a time,
                                              // and what is at him or at his bars goes where he goes (praiTick's carry)
        apart: 1.45,                          // Grandmaster Pho never stands inside his student's cage (its bars 1.0, and himself)
        switchLock: 0.8,                      // nothing pressed inside it is spent by the one who arrives
        aiFar: 3.0, aiHome: [1.15, 1.3],      // the unplayed Grandmaster Pho walks back beside his student once this far
        // THE CAGE (his Lersi's, round him from the first moment to the last, never pressed for: the case file)
        cageR: 1.0, pressR: 1.3, himR: 0.55, waitR: 2.5, pressMax: 3,
        // (R73, 23 Nov 2026: his question, too easy now? With the smell his own and the bag reaching the court (R62, R71) the
        //  careful first-timer of fightsim won 100 of 100 fights at the first try; this morning 69 %. A shorter bind alone
        //  changed nothing (100 % at 6, 7, 8 and 10 s). His option 2, the default until he picks: the bind 7 s (was 10), the
        //  Prai a little faster, two free from the start and three from 24 s (were one and two), the cage worn a little
        //  faster (6, was 4): 95 of 100 at the first try, 100 within two, 3:07)
        cageMax: 100, wear: 6, mend: 6, whole: 30,
        // HIS SANITY (the game's own stat)
        drain: 2, gather: 2.0, lostAt: 12, floor: 40, surgeTo: 13, surgeSecs: 3,
        // (R82, 24 Nov 2026, Chad: "I think the fight needs a little more difficulty, maybe add a damage to sanity if the prais
        //  breaks out of the bind, and damage over time to sanity when the prais gets too close to zavier's protection cage or
        //  clings to the cage"): a bound one breaking out of its bubble costs breakHit at once; each free one within closeR of
        //  him (coming close, clinging to his bars, or through them and not yet at him) costs closeDrain a second while it
        //  stays; one already at him costs `drain`, as before, never both. Both 0: the fight before R82, bit for bit.
        //  Sized by short runs of fightsim (300 fights a player, R22): 4 and 0.8 left the careful first-timer 1.7 % at the
        //  first try, a cliff (0.10 to 0.15 a second took him from 68 % to 3 % with a 2-3 hit); the hit is what tells (3
        //  alone: 20 %; the drain alone at 0.08: 94 %). At 1 and 0.15: careful 80.0 % first try (was 95.7), 98.0 % within
        //  two; slow 100; late 97.3 and 100; the masher 7.0 % (was 14.7); every invariant held
        breakHit: 1, closeDrain: 0.15, closeR: 1.6,
        // THE PRAI
        paceCome: 0.75, paceSlip: 0.95, paceHide: 0.7, paceHidden: 0.6, rush: 2.2,   // (R73: were 0.6, 0.8, 0.55, 0.5)
        enterSecs: 1.0, hideAfter: 1.5, weave: 0.9, weaveSecs: 1.8,
        fleeSecs: 1.0, fleePace: 2.5, lurkSecs: 1.5, // a Prai chased away flees, sinks, and lies still a while before it comes on
        /* (R43, 23 Nov: Chad, "The prais also have some automatic walking logic that slowly walks around, taking into account
           body collision with other prais and models, pathfinding, etc." Each one on the court is a body, a disc of praiR
           (a woman's shoulders, 0.4 m across, and her arms' swing); a bubble round a bound one a disc of bubR (it is drawn
           0.62 m round); Grandmaster Pho a disc of phoR. None stands in another: met, they are set apart (praiBodies). Its
           way to him is steered round what stands ahead of it within steerLook (steerAround): round the side its way
           already passes, never through. And while three are at his bars, one that waits its turn PROWLS round him at
           prowl, a little out from the bars (prowlIn), turning back where a wall, a planter or another shuts its way, no
           sooner than prowlTurn after its last turn) */
        praiR: 0.26, bubR: 0.62, phoR: 0.34, steerLook: 1.4, prowl: 0.3, prowlIn: 0.3, prowlTurn: 1.2,
        slidePush: 3.0, slideThrow: 6.0,      // (R43: how fast a setback carries it back, and the gold throws it: slideTick)
        bubGrow: 0.3,                         // (R43: a bubble's disc grows round the bound one over this: prR)
        /* (R43: the things that stand on the court, each [x, z, r] in its frame: the open black bag and the thread's reel
           set down for the rite before the house (b_world.js RITE: 1.35 and 1.2 m off its face, 0.35 m either side of the
           gate's line) and the slippers by his door (Jun's duffel stays with him behind the thread). A Prai goes round each
           as it goes round a body. The chapter hands the places as they stand when the fight is made (c_fightstage.js
           fsProps); these are the same numbers, for the simulation, which has no world) */
        props: [[-0.35, -1.75, 0.22], [0.35, -1.9, 0.12], [0.52, -2.55, 0.18]],
        // FIRE (Grandmaster Pho's main act)
        // (R75's GE: R21's guard against a masher, the smell's price gone with its button: fightsim, 300 a player, masher
        // 74.7 % to 15.3 % first try, careful 95.7 % both, slow, late and optimal unchanged)
        emptyFire: 3, switchCost: 2, switchSpam: 1.0,
        fireWait: 1.1, flight: 0.7, fireReach: 6.5, push: 0.7, stopSecs: 0.8, aiFireWait: 3.3,
        ringSecs: 6,                          // a tired Prai's ring closes over this; then it rises again, and hides
        // BAG
        bagReach: 2.5, bagSecs: 1.0,           // (R71: bagReach no longer read by the rules: the bag reaches the whole court)
        bagStagger: 0.18,                      // (R71: when one press takes several, each is in the bag this long after the one before)
        // THE GOLDEN SHOCKWAVE (his own R3: "travels as a circle outwards but with long cooldown"); its wait a fifth
        // shorter at his R34 (23 Nov: "make it slightly easier to charge up the shockwave skill, it takes too long to
        // charge it up"): 40 s, was 50 (the holds' own waits below likewise; the wait after a break is a penalty, kept)
        waveWait: 40, waveBroken: 15, windSecs: 1.5, ringSpeed: 7, ringMax: 8.5, breakDist: 0.8, throwZ: -2.45, throwStop: 2.0,
        // BIND (Master Zavier's main act: Chad's "lock a prai in a bubble to stop it from escaping")
        bindWait: 3.5, bindReach: 6.5, bubbleSecs: 7, bubbleMax: 3,   // (R73: the bind 7 s, was 10)
        stillMax: 20,                         // the most a bubble stands still in all (the gold's grace, the lent cage, the gold
                                              // gathered and gone out: 8 + 9 + 1.5 + 1.2 is under it)
        bubbleLongest: 27,                    // so a bubble's longest stand: bubbleSecs + stillMax (R73: 7 + 20)
        // (R75's debug: a lend's 6 s begin again once in his teacher's hands, once a lend, so its longest is 6 before the
        // switch, 6 after it, and the gold gathered and gone out under it: 6 + 6 + 1.5 + 1.21 + 0.3, was 9)
        lendLongest: 15.1,                    // a lend, and the gold gathered and loosed under it
        // A SMELL OPENED FOR NOTHING COSTS HIM (Chad's R21: "A button masher should not win so easily"): with nothing hidden,
        // they feel him open, and it costs his sanity, seen on its bar (and said once: ph5fg)
        smellCost: 4,
        // SMELL (only he finds a Prai that has gone unseen)
        smellWait: 2.5, showSecs: 4.0, staleSecs: 3.0,
        // (R62: his smell goes out BY ITSELF: a hidden one that has begun to come on is found once it has lain smellBeat under
        //  the paving, so its sinking is seen first; the lesson's after smellLesson, so "It hid." is read first)
        smellBeat: 0.8, smellLesson: 1.6,
        drawSecs: 3.0, drawPace: 2.5, drawWear: 3.0,   // a breath taken for nothing (nothing hidden) draws every free Prai on, faster and harder
        // LEND (his cage over his teacher while the gold is gathered)
        lendSecs: 6.0, lendAfter: 0.3,           // (pressed with the cage lent, the gold keeps the cage round him until it has gone out)
        // STAGE 3, THE FIGHT: the eight left after the lesson, in this order, each at its time while fewer than freeAt
        // allows are free on the court (one at a time once he asks his teacher to lead: after three losses)
        kinds3: ['come', 'slip', 'hide', 'come', 'slip', 'hide', 'slip', 'hide'],
        due3: [0, 12, 26, 42, 58, 74, 90, 106], entryGap: 1.5, leadMax: 1, breather: 8,
        freeAt: [[0, 2], [24, 3]],             // how many may be free on the court at once: two, then three from 24 s (R73: were one and two)
        // HOLD THE LINE, twice: at six left and at four the bag no longer takes them, the gold gathers itself anew
        // (holdSecs), and only it can take them; after a wave that took none, holdRetry. The first hold ends when the gold
        // has gathered; the last, at three. While a hold stands they come on at holdPace (the gathering gold weighs on
        // them), and once the gold is ready a bubble waits goldGrace for it. (R34: holdSecs 32 and holdRetry 10, a fifth
        // shorter, were 40 and 12. What it costs, fightsim 300 fights, 23 Nov: the careful first-timer 69.0% at the first
        // try and 93.7% within two, against 76.7 and 97.0 at 40, its losses in the first hold 31 where they were 3 (the
        // first gold, taught in that hold, comes ready sooner, with fewer bound); 34 s measured 85.7 and 97.3, 36 s 78.3
        // and 92.3: at 300 fights the rates are noisy, the first hold's losses are not. The long wait at 40 changes
        // nothing for him: the holds set the wait before it runs out. TAKEN: 34, the shortest of the three that keeps the
        // careful player as sure within two tries as he was (97.3), still 6 s quicker than 40: Chad's "slightly easier")
        holdAt: [6, 4], holdSecs: 34, holdRetry: 10, holdPace: 0.62, goldGrace: 8,   // (R73: holdPace 0.62, was 0.45)
        // STAGES 4 TO 6
        togetherAfter: 1.5, togetherSecs: 2.1, filmGuard: 40,   // (R128: 2.1 s, was 1.5 (R122), 1.2 before: the cut-in's 2.0 s plays out before the Naga's film)
        // THE VOICE (one at a time, v5.30; a need's prompt never closer than needCap to the last line)
        needAfter: 1.0, urgentAfter: 0.5, needEvery: 12, lineGap: 0.25, needCap: 4.0, colourLate: 4.0, lessonLate: 10.0, holdLate: 30.0,
        // THE FRAME: no step moves the fight more than this (a slow phone gets a slower fight, never a jump)
        dtMax: 0.1
      };

      /* ------------------------------------------------------------------ THE PRAI'S STATES (the spec's 4: the one list)
         Each: is it seen; how long it can stand in it (a timed state: its own end is its exit, and its failure); and
         every state it can go to. A loss puts stage 3's eight back to `waiting` (a reset, not a move). fightsim.mjs fails a
         move that is not listed here, a state entered and never left, and a timed state stood in past its time. A state
         stood in under a LESSON's hold (the first use waits for him) is logged with a star and has no time limit. */
      const STATES = {
        waiting:  { seen: 0, secs: '',           exits: ['entering', 'shape'] },
        entering: { seen: 1, secs: 'enterSecs',  exits: ['coming', 'shape'] },
        coming:   { seen: 1, secs: '',           exits: ['pressing', 'through', 'hidden', 'fleeing', 'bound', 'rushing', 'shape'] },
        pressing: { seen: 1, secs: '',           exits: ['coming', 'through', 'fleeing', 'bound', 'rushing', 'shape'] },
        through:  { seen: 1, secs: '',           exits: ['coming', 'fleeing', 'bound', 'rushing', 'shape'] },
        fleeing:  { seen: 1, secs: 'fleeSecs',   exits: ['hidden', 'shape'] },
        hidden:   { seen: 0, secs: '',           exits: ['shown', 'beneath', 'shape'] },
        beneath:  { seen: 0, secs: '',           exits: ['shown', 'shape'] },
        shown:    { seen: 1, secs: 'showSecs',   exits: ['hidden', 'beneath', 'fleeing', 'bound', 'rushing', 'shape'] },
        bound:    { seen: 1, secs: 'bubbleLongest', exits: ['coming', 'hidden', 'held', 'gathered', 'shape'] },
        held:     { seen: 1, secs: 'bubbleLongest', exits: ['tired', 'drawn', 'gathered', 'shape'] },
        tired:    { seen: 1, secs: 'ringSecs',   exits: ['hidden', 'held', 'drawn', 'shape'] },
        rushing:  { seen: 1, secs: 'windSecs',   exits: ['coming', 'shown', 'hidden', 'bound', 'shape'] },
        drawn:    { seen: 1, secs: 'bagSecs',    exits: ['gathered', 'shape'] },
        gathered: { seen: 0, secs: '',           exits: [] },
        shape:    { seen: 1, secs: '',           exits: ['laid'] },
        laid:     { seen: 1, secs: '',           exits: ['drawn'] }
      };
      /* the fight's own stages (the plan's 5.5: the lesson, the fight, the surge, the Naga, the last three); and the
         fight's own timed things, each with the number that bounds it */
      const STAGES = ['brief', 'learn', 'fight', 'surge', 'naga', 'last', 'lost', 'won'];
      const TIMED = { wind: 'windSecs', lend: 'lendLongest', lock: 'switchLock', fill: 'togetherSecs', naga: 'filmGuard' };

      /* ------------------------------------------------------------------ THE WORDS SAID (keys of masters/v28.0/script/
         lines.json; the words are there, never here). A NEED's three wordings by who is played: the first, other words,
         and the short one that is said from then on (the plan's 7.1). A ONCE line is said at its moment, or dropped if
         the moment has passed (v5.30): its number is its priority (3 a lesson, 2 praise, 0 the colour of the court) */
      const NEEDLINES = {
        Lfire:    { pho: ['ph5f1', 'ph5f1', 'ph5f1'] },
        // the lesson's needs and the fight's are the SAME needs: what the lesson taught, the fight goes on asking in other
        // words (its first wordings are the lesson's own lines, said once there)
        shown:    { pho: ['ph5nt1', 'ph5nt2', 'ph5ns3'], zav: ['ph5f8', 'ph5ns2', 'ph5f4'] },
        bound:    { pho: ['ph5f6', 'ph5nq1', 'ph5f1'], zav: ['ph5f5', 'ph5nc2', 'ph5nc3'] },
        // (R71: no "Go to it". R75's debug, GK: its first wording is the lesson's, whose Prai is held and cannot rise: "BAG it."
        // there, and "before it rises" from the next, in the fight, where a tired one does)
        tired:    { pho: ['ph5nd3', 'ph5nd2', 'ph5nd3'], zav: ['ph5ni1', 'ph5ni2', 'ph5ni2'] },
        keep:     { zav: ['ph5nr1', 'ph5nr2', 'ph5f4'] },
        slip:     { pho: ['ph5nw1', 'ph5nw2', 'ph5ns3'], zav: ['ph5nx1', 'ph5nx2', 'ph5f4'] },
        come:     { pho: ['ph5nk2', 'ph5nt2', 'ph5ns3'], zav: ['ph5ng1', 'ph5ng2', 'ph5f4'] },
        // what costs him while it stands: said at once, and short (the words come before the cost: the plan's 7.1)
        press:    { pho: ['ph5na3', 'ph5nt2', 'ph5ns3'], zav: ['ph5nb1', 'ph5nb2', 'ph5f4'] },
        cage:     { pho: ['ph5na1', 'ph5na2', 'ph5f1'] },
        athimF:   { pho: ['ph5nj1', 'ph5nj2', 'ph5f1'] },
        athimS:   { pho: ['ph5nk1', 'ph5nw2', 'ph5ns3'] },
        athimB:   { zav: ['ph5nl1', 'ph5nl2', 'ph5f4'] },
        athimSw:  { zav: ['ph5nl3', 'ph5no2', 'ph5no2'] },
        // the golden shockwave
        waveL:    { pho: ['ph5f9', 'ph5nu1', 'ph5ns3'], zav: ['ph5f9', 'ph5nv1', 'ph5nv3'] },
        waveB:    { pho: ['ph5fd', 'ph5nt2', 'ph5ns3'], zav: ['ph5fd', 'ph5f4', 'ph5f4'] },
        waveLend: { pho: ['ph5nu1', 'ph5nu2', 'ph5ns3'], zav: ['ph5nv1', 'ph5nv2', 'ph5nv3'] },
        waveSafe: { pho: ['ph5nh1', 'ph5nh2', 'ph5nh2'] },
        waveGo:   { pho: ['ph5np1', 'ph5nh2', 'ph5nh2'], zav: ['ph5no1', 'ph5no2', 'ph5no2'] },
        together: { pho: ['ph5ca', 'ph5cb', 'ph5cb'], zav: ['ph5ca', 'ph5cb', 'ph5cb'] },
        last:     { pho: ['ph5nd3', 'ph5nd3', 'ph5nd3'] }
      };
      const ONCE = {
        ph5l2: 3, q5c0: 3, ph5f0: 3, ph5f2: 3, ph5fa: 3, ph5fc: 3, ph5f10: 3, ph5fe: 3, ph5fh: 3, ph5fi: 3, ph5fj: 3, ph5ne1: 3, ph5c1: 3, ph5c3: 3, ph5c4: 3,
        ph5g1: 2, ph5g2: 2, ph5g3: 2, ph5g4: 2,
        q5c1: 0, q5c2: 3, q5c3: 0, q5c4: 0, q5c5: 0,
        tn5c0: 0, ko5c1: 0, tn5c1: 0, ju5c1: 0, tn5c2: 0, ju5c2: 3, tn5c3: 0,
        /* (R110/R111, 24 Nov 2026: his question when they keep breaking out of the bind and his teacher's answer, in the open
           fight or in a hold; and his call the first time the moment asks for the shockwave itself) */
        q5fb1: 3, ph5fb1: 3, ph5fb2: 3, q5fw1: 3
      };
      /* the needs that cost him while they stand: their prompt is said at once, ahead of praise and colour */
      const URGENT = { athimF: 1, athimS: 1, athimB: 1, athimSw: 1, beneath: 1, cage: 1, press: 1, waveGo: 1 };
      /* (said straight away, never queued: the card has opened and the fight's clock stands still under it) */
      const ONLOSS = 'ph5l1';
      const LINES_SAID = (() => {
        const s = new Set([ONLOSS]);
        for (const id in NEEDLINES) for (const w in NEEDLINES[id]) for (const k of NEEDLINES[id][w]) s.add(k);
        for (const k in ONCE) s.add(k);
        return [...s].sort();
      })();

      /* the three buttons each of them has, and the switch (the plan's 5.6: the same places for both; the pictures change) */
      /* (R62, 23 Nov 2026: Chad, "removing the manual smell button. Have Zavier auto smell throughout the fight whenever
         needed so player does not have to micromanage the smell button": his second button is gone, and his SMELL goes out
         by itself whenever it is needed, whoever is played: smellTick) */
      const SLOT = { pho: { main: 'FIRE', second: 'SHOCKWAVE', third: 'BAG' }, zav: { main: 'BIND', third: 'LEND' } };
      const PHO_ACTS = { FIRE: 1, SHOCKWAVE: 1, BAG: 1 }, ZAV_ACTS = { BIND: 1, LEND: 1 };

      /* ------------------------------------------------------------------ small things */
      const dist = (ax, az, bx, bz) => { const dx = ax - bx, dz = az - bz; return Math.sqrt(dx * dx + dz * dz); };
      const isP = (st) => st.who === 'pho';
      const atHim = (p) => p.st === 'through' || p.st === 'beneath' || (p.st === 'shown' && p.at === 2);
      /* (R82: a free one too close to his cage, or clinging to it: coming within closeR, at his bars, rushing, shown, or
         through the bars and not yet at him) */
      const CLOSE_ST = { coming: 1, pressing: 1, through: 1, rushing: 1, shown: 1 };
      const closeTo = (st, p) => !!CLOSE_ST[p.st] && Math.hypot(p.x - st.zav.x, p.z - st.zav.z) <= st.n.closeR;
      const free = (p) => p.st === 'entering' || p.st === 'coming' || p.st === 'pressing' || p.st === 'through' || p.st === 'fleeing' ||
                          p.st === 'hidden' || p.st === 'beneath' || p.st === 'shown' || p.st === 'rushing';
      const onCourt = (p) => p.st !== 'waiting' && p.st !== 'gathered';
      const seenFree = (p) => p.st === 'coming' || p.st === 'pressing' || p.st === 'through' || p.st === 'shown';
      const bubbles = (st) => { let k = 0; for (const p of st.prai) if (p.st === 'bound' || p.st === 'held') k++; return k; };
      function clampPrai(n, p) {
        const xm = n.courtX - n.praiIn, z0 = Math.max(n.courtZ0 + n.praiIn, n.threadZ), z1 = n.courtZ1 - n.praiIn;
        if (p.x < -xm) p.x = -xm; else if (p.x > xm) p.x = xm;
        if (p.z < z0) p.z = z0; else if (p.z > z1) p.z = z1;
        if (n.notch && p.z > n.notch.z) { if (p.x < -n.notch.x) p.x = -n.notch.x; else if (p.x > n.notch.x) p.x = n.notch.x; }
      }
      /* (FROM THE SURGE ON: off the walls. How far the nearer wall is; each body eased in where it is nearer; and no step
         taking it nearer again) */
      const offWalls = (st) => st.stage === 'surge' || st.stage === 'naga' || st.stage === 'last';
      const farZ = (n) => Math.min(n.courtZ1, (n.offZ1 != null ? n.offZ1 : Infinity) + n.wallOff);   // (R37: offZ1)
      const wallGap = (n, b) => Math.min(n.courtX - Math.abs(b.x), b.z - n.courtZ0, farZ(n) - b.z);
      function wallEase(st, b, dt) {
        const n = st.n, xm = n.courtX - n.wallOff, z0 = n.courtZ0 + n.wallOff, z1 = farZ(n) - n.wallOff, s = n.wallSlide * dt, ox = b.x, oz = b.z;
        if (b.x > xm) b.x = Math.max(xm, b.x - s); else if (b.x < -xm) b.x = Math.min(-xm, b.x + s);
        if (b.z < z0) b.z = Math.min(z0, b.z + s); else if (b.z > z1) b.z = Math.max(z1, b.z - s);
        return [b.x - ox, b.z - oz];
      }
      /* (and never into his student's cage as either is eased: Grandmaster Pho set back out to its ring along the line from
         his student, round it toward the court's middle where that line meets a wall) */
      function wallApart(st) {
        const n = st.n, ph = st.pho, z = st.zav; let dx = ph.x - z.x, dz = ph.z - z.z, d = Math.sqrt(dx * dx + dz * dz);
        if (d >= n.apart) return;
        if (d < 1e-6) { dx = -z.x || 1; dz = -z.z; d = Math.sqrt(dx * dx + dz * dz) || 1; }
        const xm = n.courtX - n.wallOff, z0 = n.courtZ0 + n.wallOff, z1 = farZ(n) - n.wallOff, a0 = Math.atan2(dz, dx), r = n.apart + 1e-3;
        for (let i = 0; i <= 36; i++) for (const sg of i ? [1, -1] : [1]) { const a = a0 + sg * i * Math.PI / 36, qx = z.x + Math.cos(a) * r, qz = z.z + Math.sin(a) * r;
          if (Math.abs(qx) <= xm + 1e-6 && qz >= z0 - 1e-6 && qz <= z1 + 1e-6) { ph.x = qx; ph.z = qz; return; } }
        ph.x = z.x + dx / d * r; ph.z = z.z + dz / d * r;
      }
      function wallHold(st, b, ox, oz) {
        if (!offWalls(st)) return;
        const n = st.n, xm = n.courtX - n.wallOff, z0 = n.courtZ0 + n.wallOff, z1 = farZ(n) - n.wallOff;
        if (Math.abs(b.x) > xm && Math.abs(b.x) > Math.abs(ox)) b.x = Math.sign(b.x) * Math.max(xm, Math.abs(ox));
        if (b.z < z0 && b.z < oz) b.z = Math.min(z0, oz); else if (b.z > z1 && b.z > oz) b.z = Math.max(z1, oz);
      }
      function clampBody(n, b) {
        if (b.x < -n.bodyX) b.x = -n.bodyX; else if (b.x > n.bodyX) b.x = n.bodyX;
        if (b.z < n.bodyZ0) b.z = n.bodyZ0; else if (b.z > n.bodyZ1) b.z = n.bodyZ1;
      }
      function fresh(id, kind) {
        // at: 0 free in the court, 1 at the cage's bars, 2 at him. hold, a lesson's hold: '' none; 'stand' the lesson's
        // Prai stands where it is; 'hide' it waits under the paving for the first SMELL; 'show' then shown for the first
        // BIND; 'keep' a bubble that stands still until the lesson's bag; 'grace' a bubble that stands still until the
        // first golden shockwave. lurk: a Prai chased away lies still this long before it comes on
        return { id, kind, st: 'waiting', x: 0, z: 0, t: 0, at: 0, ring: 0, bub: 0, stood: 0, show: 0, gath: 0, stop: 0,
                 hideIn: 0, lurk: 0, ph: 0, due: 0, fx: 0, fz: 0, hold: '', was: '',
                 sx: 0, sz: 0, sv: 0, pdir: 0, pturn: 0, bt: 0 };   // (R43: where a slide takes it, and at what pace; a prowl's way and its turn)
      }

      /* ------------------------------------------------------------------ a fight */
      function create(opts) {
        const o = opts || {};
        const n = Object.assign({}, NUM, o.num || {});
        const s0 = Number.isFinite(o.sanity) ? Math.max(0, Math.min(100, o.sanity)) : 100;
        const st = {
          v: 2, n, stage: 'brief', t: 0, stageT: 0, who: 'pho', lock: 0, lockUntil: 0, drawT: 0,
          owe: 0,                                 // a one-off cost to his sanity, taken where the drain is
          left: 9, losses: 0, lead: false,
          sanity: s0, open: s0, raised: false, preSurge: 0, guard: Math.max(0, Math.min(0.9, +o.guard || 0)),
          // (waveFrom: the wait the gold's present wait began from, which its button's ring is a share of; the zav's cx and
          // cz: where he stood at the last step, so what is at him and at his bars is carried where he goes)
          pho: { x: n.phoAt[0], z: n.phoAt[1], fireWait: 0, aiWait: n.aiFireWait, waveWait: n.waveWait, waveFrom: n.waveWait, wind: 0, ring: null, draw: 0 },
          zav: { x: n.zavAt[0], z: n.zavAt[1], cx: n.zavAt[0], cz: n.zavAt[1], bindWait: 0, smellWait: 0, look: 0 },
          cage: { str: n.cageMax, broken: false, lent: 0, lentUp: 0, lentFor: 0 },
          prai: [], clouds: [], flights: [], nextCloud: 1, lastEntry: -99, together: 0, joined: 0, film: 0,
          firsts: {}, lesson: { wave: '' }, hold: 0, holdsDone: 0, goldAt: -1, seen: { swap: false, bind: false, smell: false, shock: false },
          brk: { plain: 0, hold: 0 },             // (R111: break-outs from the bind in the fight, in the open and in a hold)
          voice: { until: 0, last: -99, q: [], need: '', needSince: 0, needSaid: -99, count: {} },
          said: {}, cur: null,
          log: { dwell: {}, trans: {}, stage: {}, timed: {} },
          stats: { fires: 0, chased: 0, slipped: 0, binds: 0, smells: 0, lends: 0, waves: 0, broken: 0, bags: 0, byWave: 0,
                   switches: 0, refused: 0, stale: 0, rose: 0, drained: 0, breaks: 0, lines: 0, length: 0, emptySmell: 0, wallFilm: 0, wallLast: 0 },
          ev: []
        };
        st.prai.push(fresh(1, 'come'));
        for (let i = 0; i < 8; i++) st.prai.push(fresh(2 + i, n.kinds3[i]));
        return st;
      }

      /* ------------------------------------------------------------------ moving between states (every move is logged:
         the longest stand in each state, and every move made, so the simulation reads this file's state list against the
         rules as they ran) */
      function setSt(st, p, to, why) {
        const from = p.st;
        if (from === to) return;
        const L = st.log, key = from + (p.hold ? '*' : '');
        if (!(p.t <= (L.dwell[key] || 0))) L.dwell[key] = p.t;
        const tk = from + '>' + to;
        L.trans[tk] = (L.trans[tk] || 0) + 1;
        p.st = to; p.t = 0;
        if (p.hold === 'show' && to !== 'shown') p.hold = '';      // the lesson's shown Prai has been answered
        st.ev.push({ e: 'state', id: p.id, from, to, why: why || '' });
      }
      /* the same state begun again (the gold shows a Prai already shown), or a lesson's hold let go while the state goes
         on: the stand so far is logged as it was, and its clock starts again */
      function restart(st, p, newHold) {
        const L = st.log, key = p.st + (p.hold ? '*' : '');
        if (!(p.t <= (L.dwell[key] || 0))) L.dwell[key] = p.t;
        p.t = 0; p.hold = newHold;
      }
      function setStage(st, to) {
        const L = st.log;
        if (!(st.stageT <= (L.stage[st.stage] || 0))) L.stage[st.stage] = st.stageT;
        st.stage = to; st.stageT = 0;
        st.ev.push({ e: 'stage', to });
      }
      function timed(st, what, secs) { const L = st.log.timed; if (!(secs <= (L[what] || 0))) L[what] = secs; }

      /* ------------------------------------------------------------------ the voice: one line at a time */
      function sayOnce(st, key, late) {
        if (st.said[key]) return;
        st.said[key] = 1;
        const prio = ONCE[key] === undefined ? 1 : ONCE[key];
        st.voice.q.push({ key, prio, by: st.t + (late !== undefined ? late : (prio >= 2 ? st.n.lessonLate : st.n.colourLate)) });
      }
      function voiceTick(st, io) {
        if (st.joined) return;                                   // (joined: the line in the air is the last before the Naga)
        const v = st.voice, n = st.n, nd = st.cur;
        const id = nd && NEEDLINES[nd.id] && NEEDLINES[nd.id][isP(st) ? 'pho' : 'zav'] ? nd.id : '';
        if (id !== v.need) { v.need = id; v.needSince = st.t; v.needSaid = -99; }
        if (v.q.length) { let w = 0; for (let i = 0; i < v.q.length; i++) if (v.q[i].by >= st.t) v.q[w++] = v.q[i]; v.q.length = w; }
        if (st.t < v.until) return;
        let best = -1;
        for (let i = 0; i < v.q.length; i++) if (best < 0 || v.q[i].prio > v.q[best].prio) best = i;
        // the order: a need that costs him while it stands (said at once, ahead of everything, so the words always come
        // before the cost: the plan's 7.1; and while it stands nothing else begins); then a lesson's line; then praise;
        // then any other need; then the colour of the court
        const urgent = !!(id && (URGENT[id] || (st.hold > 0 && (id === 'waveLend' || id === 'waveSafe'))));   // in a hold the gold is the way out
        const due = !!id && st.t - v.needSince >= (urgent ? n.urgentAfter : n.needAfter) && st.t - v.needSaid >= n.needEvery &&
                    (urgent || st.t - v.last >= n.needCap);
        const qp = best >= 0 ? v.q[best].prio : -1;
        let key = '', fromNeed = false;
        if (urgent) {
          // while something costs him, nothing else is begun: only the words that answer it, when they are due (a lesson's
          // line waits for the moment to pass; it was a long line begun in such a moment that kept the next order unsaid)
          if (!due) return;
          const words = NEEDLINES[id][isP(st) ? 'pho' : 'zav'], c = v.count[id] || 0;
          key = words[Math.min(c, words.length - 1)]; v.count[id] = c + 1; fromNeed = true;
        } else if (qp >= 2 || (qp >= 0 && !due)) { key = v.q[best].key; v.q.splice(best, 1); }
        else if (due) {
          const words = NEEDLINES[id][isP(st) ? 'pho' : 'zav'], c = v.count[id] || 0;
          key = words[Math.min(c, words.length - 1)]; v.count[id] = c + 1; fromNeed = true;
        }
        if (!key) return;
        const secs = (io && io.secs ? +io.secs(key) : 0) || 2.5;
        v.last = st.t; v.until = st.t + secs + n.lineGap;
        if (fromNeed) v.needSaid = st.t;
        st.stats.lines++;
        st.ev.push({ e: 'say', key, need: fromNeed ? id : '' });
        if (key === 'ko5c1') sayOnce(st, 'tn5c1', 3.0);          // Ton answers Mr Koh
      }

      /* ------------------------------------------------------------------ what can be pressed, and why not (the HUD and
         the press read the same answer: a lock is said, never pressed, v21.28; no button is a lie, v14.2) */
      function why(st, act) {
        const n = st.n, P = isP(st), ph = st.pho, z = st.zav;
        if (act === 'START') return st.stage === 'brief' ? '' : 'stage';
        if (act === 'RESUME') return st.stage === 'brief' ? '' : 'stage';      // (R153: a Continue taken up at the surge)
        if (act === 'RETRY') return st.stage === 'lost' ? '' : 'stage';
        if (act === 'LEAD') return st.stage === 'lost' && st.losses >= 3 ? '' : 'stage';
        if (act === 'FILMDONE') return st.stage === 'naga' ? '' : 'stage';
        if (act === 'TOGETHER') return st.stage === 'surge' && st.stageT >= n.togetherAfter && !st.together && !st.joined &&
                                       wallGap(n, st.pho) >= n.wallOff - 0.01 && wallGap(n, st.zav) >= n.wallOff - 0.01 ? '' : 'stage';
        if (st.stage !== 'learn' && st.stage !== 'fight' && st.stage !== 'last') return 'stage';
        if (st.lock > 0) return 'lock';
        if (act === 'SWITCH') return st.seen.swap && st.stage !== 'last' ? '' : 'stage';
        if (PHO_ACTS[act] && !P) return 'notYours';
        if (ZAV_ACTS[act] && P) return 'notYours';
        if (act === 'FIRE') { if (ph.wind > 0 || ph.draw > 0 || st.stage === 'last') return 'busy'; return ph.fireWait > 0 ? 'wait' : ''; }
        if (act === 'BAG') {
          if (ph.wind > 0 || ph.draw > 0 || ph.ring) return 'busy';
          if (!bagTarget(st, 0)) return 'none';
          if (st.stage === 'fight' && st.hold) return 'gold';      // they cling: only the gold takes them now
          return '';
        }
        if (act === 'SHOCKWAVE') {
          if (!st.seen.shock || st.stage !== 'fight') return 'stage';
          if (ph.wind > 0 || ph.ring || ph.draw > 0) return 'busy';
          if (ph.waveWait > 0) return 'wait';
          let any = false; for (const p of st.prai) if (onCourt(p) && p.st !== 'drawn') { any = true; break; }
          if (!any) return 'none';
          if (!st.firsts.wave) { if (!(st.cage.lent > 0)) return 'lendFirst'; if (!bubbles(st)) return 'bindFirst'; }
          return '';
        }
        if (act === 'BIND') {
          if (!st.seen.bind) return 'stage';
          if (z.bindWait > 0) return 'wait';
          if (bubbles(st) >= n.bubbleMax) return 'full';
          return bindTarget(st, 0) ? '' : 'none';
        }
        if (act === 'SMELL') return 'stage';                       // (R62: never a press: smellTick)
        if (act === 'LEND') {
          if (!st.seen.shock || st.stage !== 'fight') return 'stage';
          if (ph.wind > 0 || ph.ring) return 'busy';
          if (ph.waveWait > 0) return 'wait';
          return st.cage.lent > 0 ? 'busy' : '';
        }
        return 'stage';
      }
      function refuse(st, act, w) { st.stats.refused++; st.ev.push({ e: 'refused', act, why: w }); }
      /* the gold's wait set, with the wait it began from kept beside it: the button's ring runs from full to empty whatever
         the wait (40 s, a hold's 32, 15 after a break, 10 in a hold: R34). It was read as a share of the long wait, so a
         hold's wait began with the ring part-empty and the ring jumped */
      function setWave(ph, secs) { ph.waveWait = secs; ph.waveFrom = secs; }
      /* WHAT THE SCREEN ASKS THIS ACT TO ACT ON (L3-01): the need's target, when the need asks for this very act. The
         mark over it is drawn picked, so a press with no tap of its own goes there (no button is a lie, v14.2); a tap
         picks for itself, and a need for another act leaves the act to the game's own order */
      const askOf = (st, act) => st.cur && st.cur.act === act && st.cur.target ? st.cur.target : 0;

      /* ------------------------------------------------------------------ the game aims (the plan's 5.6: nothing is aimed
         by hand and nothing is timed; a tap on a Prai picks it). FIRE goes first to a bound Prai (it tires it), then to a
         Prai at him (it chases it off him), then to one at the cage's bars, then to one on its way; a Prai that slips
         the fire, last of all. IN A HOLD the game's own order passes a bound Prai by (the spec's 6: "A bound one is left
         bound in a hold (the gold's to gather: fire would tire it, and a tired one rises again)"; the last hold's careful
         presses at his breaking cage had tired three bound ones before the one at his bars: L3-01); a tap on one still
         picks it, his own act */
      function onFlight(st, id) { for (const f of st.flights) if (f.id === id && !f.ai) return true; return false; }
      function fireTarget(st, pick) {
        const n = st.n, ph = st.pho, z = st.zav;
        let best = null, bs = 1e9;
        for (const p of st.prai) {
          if (pick && p.id !== pick) continue;
          let r;
          if (p.st === 'bound' && !pick && st.hold > 0) continue;
          if (p.st === 'bound') r = 0;
          else if (p.st === 'through' || (p.st === 'shown' && p.at === 2)) r = p.kind === 'slip' ? 9 : 1;
          else if (p.st === 'pressing') r = p.kind === 'slip' ? 9 : 2;
          else if (p.st === 'coming' || p.st === 'shown') r = p.kind === 'slip' ? 9 : 3;
          else continue;
          if (onFlight(st, p.id)) r += 20;                       // a ball already on its way to it comes last
          const dP = dist(ph.x, ph.z, p.x, p.z);
          /* (R75's debug, GI: a bound Prai stands still, and his fire reaches it wherever it stands on the court, as the
             lesson's one does: the reach was the court's when it was set (6.5 m on a court 7 m across) and R46 doubled the
             court, so "FIRE" was said, and the button asked, at one he could not reach) */
          if (dP > n.fireReach && p.st !== 'bound' && st.stage !== 'learn') continue;
          const s = r * 100 + (r === 0 ? dP : dist(z.x, z.z, p.x, p.z));
          if (s < bs) { bs = s; best = p; }
        }
        return best;
      }
      /* BIND holds, first, what is at him; then what presses his cage (it wears it); then a Prai shown by the smell (it
         will sink); then one that slips the fire; then a tired one whose ring is closing; then the nearest */
      function bindable(p) {
        return p.st === 'coming' || p.st === 'pressing' || p.st === 'through' || p.st === 'shown' || p.st === 'tired' || p.st === 'rushing';
      }
      function bindTarget(st, pick) {
        const n = st.n, z = st.zav;
        let best = null, bs = 1e9;
        for (const p of st.prai) {
          if (pick && p.id !== pick) continue;
          if (!bindable(p)) continue;
          const d = dist(z.x, z.z, p.x, p.z);
          if (d > n.bindReach) continue;
          let r;
          if (atHim(p)) r = 0;
          else if (p.st === 'pressing') r = 1;
          else if (p.st === 'shown') r = 2;
          else if (p.kind === 'slip' && p.st !== 'tired') r = 3;
          else if (p.st === 'tired' && p.ring < n.ringSecs / 2) r = 4;
          else if (p.st === 'rushing') r = 5;
          else if (p.st === 'tired') r = 6;
          else r = 7;
          const s = r * 100 + d;
          if (s < bs) { bs = s; best = p; }
        }
        return best;
      }
      function bagTarget(st, pick) {
        const n = st.n, ph = st.pho;
        let best = null, bs = 1e9;
        for (const p of st.prai) {
          if (pick && p.id !== pick) continue;
          if (p.st !== 'tired' && p.st !== 'held' && p.st !== 'laid') continue;
          const d = dist(ph.x, ph.z, p.x, p.z);                    // (R71: no reach: the court is his; the nearest named first)
          if (d < bs) { bs = d; best = p; }
        }
        return best;
      }

      /* ------------------------------------------------------------------ the acts */
      function doAct(st, act, input) {
        /* a switch told by NAME (input.to, 'pho' or 'zavier': the engine's own report of a switch it made) to the one already
           played is already done, and nothing is spent or refused: the chapter's forced switch at BEGIN AGAIN (and at the
           surge), told back to the rules as a press, had flipped them to the other one for a second (L3-03). A switch with
           no name is the press itself, and goes to the other one */
        if (act === 'SWITCH' && input && (input.to === 'pho' || input.to === 'zavier') && input.to === st.who) return;
        const w = why(st, act);
        if (w) { refuse(st, act, w); return; }                    // (the game's buttons never send such a press: v21.28)
        const n = st.n, ph = st.pho, z = st.zav;
        switch (act) {
          case 'START': begin(st); return;
          case 'RESUME': resume(st); return;
          case 'RETRY': case 'LEAD': beginFight(st, act === 'LEAD'); return;
          case 'FILMDONE': layThree(st); return;
          case 'TOGETHER': st.together = n.togetherSecs; st.ev.push({ e: 'together' }); return;
          case 'SWITCH':
            /* (R75's debug, GE: R21's guard against a button masher (an empty smell's price) went with the smell button at
               R62. A switch made straight back, inside switchSpam of the last, is the masher's own signature and costs him
               switchCost of his sanity: a careful pair switches, acts, and switches back well outside it) */
            if (n.switchCost > 0 && st.stage === 'fight' && st.t - (st.lastSw == null ? -99 : st.lastSw) < n.switchSpam) { st.owe += n.switchCost; st.stats.spam = (st.stats.spam || 0) + 1; }
            st.lastSw = st.t;
            st.who = isP(st) ? 'zavier' : 'pho'; st.lock = n.switchLock; st.lockUntil = st.t + n.switchLock; st.stats.switches++;
            /* (R75's debug: THE SLOWEST HAND'S GOLD. A lend's 6 s ran out under a hand that took 3 s a press: lend, "Now
               switch to me.", the switch, and the gold pressed 0.6 s after the cage had come back; "Switch to Zavier, and
               lend me your cage.", round and round, never won and never lost (fightsim, a follower 3.2 s a press: 27
               minutes at the cap). The cage is in his teacher's hands once the switch reaches him: its 6 s begin again
               there, once a lend. A lend never switched to still runs out in 6 s: V28.0-FIGHT.md, "lends, then never switches") */
            if (isP(st) && st.cage.lent > 0 && !st.cage.lentUp) { st.cage.lent = Math.max(st.cage.lent, n.lendSecs); st.cage.lentUp = 1; }
            if (!isP(st)) { st.seen.bind = true; st.seen.smell = true; }   // his two buttons, the first time he is played
            st.ev.push({ e: 'switch', to: st.who });
            return;
          case 'FIRE': {
            ph.fireWait = n.fireWait; st.stats.fires++;
            let target = null, cloud = 0;
            if (input && input.pickCloud) { for (const c of st.clouds) if (c.id === input.pickCloud) cloud = c.id; }
            const ask = askOf(st, 'FIRE');
            if (!cloud) target = (input && input.pick ? fireTarget(st, input.pick) : null) || (ask ? fireTarget(st, ask) : null) || fireTarget(st, 0);
            const f = { id: target ? target.id : 0, cloud, t: n.flight, ai: false, x: 0, z: 0 };
            /* (R75's debug, GE: and a fireball thrown at nothing at all (no Prai and no cloud for it) costs him emptyFire: the
               screen never asks for one, so only a masher throws it) */
            if (!target && !cloud && n.emptyFire > 0 && st.stage === 'fight') { st.owe += n.emptyFire; st.stats.emptyFire = (st.stats.emptyFire || 0) + 1; }
            if (target) { f.x = target.x; f.z = target.z; }
            else if (cloud) { for (const c of st.clouds) if (c.id === cloud) { f.x = c.x; f.z = c.z; } }
            else { f.x = ph.x * 0.5; f.z = ph.z - 2.2; }       // nothing to aim at: it rises and falls on the open paving
            st.flights.push(f);
            st.ev.push({ e: 'fireball', id: f.id, x: f.x, z: f.z, ai: false });
            if (st.stats.fires === 1) sayOnce(st, 'ko5c1', 8.0);
            return;
          }
          case 'BAG': {
            /* (R71, 23 Nov 2026: Chad, "make pho's bag ability have unlimited aoe and range, he should not have to walk so
               close to the prai to bag it": one press draws EVERY Prai that can be bagged, wherever it stands on the court,
               from wherever he stands; the nearest first in the events, so the stage's first draw is the nearest one's) */
            const all = [];
            for (const p of st.prai) if (p.st === 'tired' || p.st === 'held' || p.st === 'laid') all.push(p);
            all.sort((a, b) => dist(ph.x, ph.z, a.x, a.z) - dist(ph.x, ph.z, b.x, b.z));
            ph.draw = n.bagSecs + Math.max(0, all.length - 1) * n.bagStagger;
            /* (in the bag one after another, the nearest first, bagStagger apart: so each is seen and heard going in, and the
               count falls by one at a time, as the gold's does) */
            all.forEach((p, i) => { setSt(st, p, 'drawn', 'bag'); p.t = -i * n.bagStagger; p.hold = ''; st.stats.bags++; st.ev.push({ e: 'bag', id: p.id, n: all.length }); });
            return;
          }
          case 'SHOCKWAVE':
            ph.wind = n.windSecs; st.stats.waves++;
            if (st.cage.lent > 0) st.cage.lent = Math.max(st.cage.lent, n.windSecs + n.ringMax / n.ringSpeed + n.lendAfter);   // it stands until the gold is out
            st.ev.push({ e: 'windup' });
            for (const p of st.prai) if (seenFree(p)) { p.was = p.st; p.stop = 0; setSt(st, p, 'rushing', 'the gold gathers'); }
            return;
          case 'BIND': {
            if (input && input.pickCloud) {                     // a bubble closed on a stale cloud holds nothing
              let hit = false; for (const c of st.clouds) if (c.id === input.pickCloud) hit = true;
              if (hit) { z.bindWait = n.bindWait; st.stats.stale++; st.ev.push({ e: 'bind', id: 0, stale: true }); sayOnce(st, 'q5c3'); return; }
            }
            const ask = askOf(st, 'BIND');
            const p = (input && input.pick ? bindTarget(st, input.pick) : null) || (ask ? bindTarget(st, ask) : null) || bindTarget(st, 0);
            z.bindWait = n.bindWait; st.stats.binds++;
            const lessonShown = p.hold === 'show';
            p.stop = 0; p.bub = n.bubbleSecs; p.stood = 0;
            setSt(st, p, p.st === 'tired' ? 'held' : 'bound', 'bind');
            p.hold = st.stage === 'learn' ? 'keep' : st.lesson.wave === 'pending' ? 'grace' : '';
            if (st.stage === 'fight' && bubbles(st) >= n.bubbleMax) sayOnce(st, 'ph5fj');   // his hands are full: told once, as they fill
            if (lessonShown) sayOnce(st, 'ph5g4');
            st.ev.push({ e: 'bind', id: p.id });
            if (st.stats.binds === 1) sayOnce(st, 'q5c5');
            return;
          }
          case 'LEND':
            st.cage.lent = n.lendSecs; st.cage.lentUp = 0; st.cage.lentFor = 0; st.stats.lends++;
            for (const p of st.prai) if (p.st === 'pressing') { p.gath = n.gather; p.at = 2; setSt(st, p, 'through', 'the cage is lent'); }
            st.ev.push({ e: 'lend' });
            return;
        }
      }

      /* ------------------------------------------------------------------ the stages */
      function enter(st, p, x, z, newHold) {
        p.x = x; p.z = z; clampPrai(st.n, p); p.hold = newHold || ''; p.stop = 0; p.at = 0; p.lurk = 0;
        setSt(st, p, 'entering', 'its turn');
        st.lastEntry = st.stageT;
        st.ev.push({ e: 'enter', id: p.id, kind: p.kind });
      }
      function begin(st) {                                       // START: the lesson, on one Prai
        const n = st.n;
        if (st.sanity < n.floor) { st.sanity = n.floor; st.raised = true; st.ev.push({ e: 'sanity', to: n.floor }); sayOnce(st, 'ph5l2'); }
        st.open = st.sanity;
        setStage(st, 'learn');
        sayOnce(st, 'q5c0'); sayOnce(st, 'ph5f0'); sayOnce(st, 'tn5c0', 14.0);
        enter(st, st.prai[0], n.lessonAt[0], n.lessonAt[1], 'stand');
      }
      function beginFight(st, lead) {                            // stage 3: from the lesson, or begun again after a loss
        const n = st.n, fromLoss = st.stage === 'lost';
        setStage(st, 'fight');
        for (let i = 0; i < 8; i++) { const p = fresh(2 + i, n.kinds3[i]); p.due = n.due3[i]; st.prai[1 + i] = p; }
        st.left = 8; st.lead = !!lead;
        st.cage.str = n.cageMax; st.cage.broken = false; st.cage.lent = 0; st.cage.lentUp = 0; st.cage.lentFor = 0;
        st.flights.length = 0; st.clouds.length = 0; st.lastEntry = -99; st.drawT = 0; st.goldAt = -1; st.owe = 0;
        // (a breath taken for nothing in the lost fight, and what it cost, are not carried into the next)
        const ph = st.pho, z = st.zav;
        ph.wind = 0; ph.ring = null; ph.draw = 0; ph.fireWait = 0; ph.aiWait = n.aiFireWait;
        setWave(ph, n.waveWait); z.bindWait = 0; z.smellWait = 0;
        st.lesson.wave = st.firsts.wave ? 'done' : ''; st.hold = 0; st.holdsDone = 0;
        if (fromLoss) {
          st.sanity = st.open; st.ev.push({ e: 'sanity', to: st.open });
          st.who = 'pho'; st.lock = 0; st.lockUntil = 0;
          ph.x = n.phoAt[0]; ph.z = n.phoAt[1]; z.x = n.zavAt[0]; z.z = n.zavAt[1]; z.cx = z.x; z.cz = z.z;
          st.voice.q.length = 0; st.voice.until = 0; st.voice.need = ''; st.voice.count = {};
        } else sayOnce(st, 'ph5fc');
      }
      function lose(st) {
        setStage(st, 'lost'); st.losses++;
        st.voice.q.length = 0; st.voice.until = 0;
        st.ev.push({ e: 'lost', losses: st.losses });
        st.ev.push({ e: 'say', key: ONLOSS, need: '' });
      }
      function surge(st) {                                       // stage 4: the last three draw together over him
        setStage(st, 'surge');
        /* (Grandmaster Pho is played from the surge on: TOGETHER is his main button, and the stage switches the engine to
           him. Left on Master Zavier, as when he had switched while the last gold gathered, the rules painted TOGETHER on
           his student's button while the engine showed Grandmaster Pho's, and nothing could end the surge: L3-02) */
        st.who = 'pho';
        st.preSurge = st.sanity;
        const ph = st.pho;
        ph.wind = 0; ph.ring = null; ph.draw = 0; st.cage.lent = 0; st.flights.length = 0; st.clouds.length = 0; st.lock = 0; st.lockUntil = 0; st.drawT = 0;
        for (const p of st.prai) if (p.st !== 'gathered') {
          setSt(st, p, 'shape', 'the surge');
          p.hold = ''; p.bub = 0; p.show = 0; p.stop = 0; p.at = 0; p.gath = 0; p.x = st.zav.x; p.z = st.zav.z - 0.2;
        }
        st.voice.q.length = 0;
        sayOnce(st, 'q5c2'); sayOnce(st, 'ju5c2', 6.0);
        st.ev.push({ e: 'surge' });
      }
      /* R153 (25 Nov 2026, Chad: "If i refresh the browser right after the naga cutscene has completed and proceeded to the bag
         the remaining prais, and i press 'continue' game from the title screen, i want it to continue from the part where the
         'together' button shows up on the screen."): A FIGHT TAKEN UP AT THE SURGE. The chapter's save says the surge was
         reached (its phase 'fight:tg': c_story.js fightMark5), and a Continue lands with the fight as it stood there:
         everything taught and seen, six in the bag (the lesson's one and five of the eight: the lab's toSurge, the same six),
         both holds of the fight behind him, and the surge itself (its lines, its sound, its music; the TOGETHER button after
         its togetherAfter), from where the court is set out for the fight. Only from the brief: nothing else is ever asked */
      function resume(st) {
        const n = st.n;
        st.open = st.sanity;
        st.firsts.boundFire = st.firsts.wave = st.firsts.waveOut = true; st.lesson.wave = 'done';
        st.seen.swap = st.seen.bind = st.seen.smell = st.seen.shock = true;
        st.hold = 0; st.holdsDone = n.holdAt.length;
        for (let i = 0; i < 8; i++) { const p = fresh(2 + i, n.kinds3[i]); p.due = n.due3[i]; st.prai[1 + i] = p; }
        for (let i = 0; i < 6; i++) st.prai[i].st = 'gathered';
        st.left = 3; st.stats.resumed = (st.stats.resumed || 0) + 1;
        surge(st);
      }
      /* (R47, 23 Nov: Chad, "The naga should pierce through all the prai's bodies ... As it pierces through each prai, the fire
         of each prai is extinguished and it cools them down": the Naga's film flings the three apart and its head goes through
         all three in one low pass; the film reads their places (c_fightstage.js fsNagaGo) and the last stage lays them there) */
      /* R64 (23 Nov 2026, Chad: "it needs to properly rearrange all the characters, prai, and the naga for proper staging for
         the cutscene so that the positions are always reliably fixed during the cutscene no matter how the player plays it"):
         as the Naga is called, the two of them are set at the fight's first marks (NUM.phoAt, NUM.zavAt) and the three's places
         are the fixed ones on its arc (NUM.laidAt); the film begins on them under its white, and the last stage after it begins
         from them too. (Through R47 the places were chosen from where the two happened to stand: spotsFor, retired) */
      function nagaMarks(st) {
        const n = st.n;
        st.pho.x = n.phoAt[0]; st.pho.z = n.phoAt[1]; st.zav.x = n.zavAt[0]; st.zav.z = n.zavAt[1];
        for (const p of st.prai) if (p.st === 'shape') { p.x = st.zav.x; p.z = st.zav.z; }
        st.three = n.laidAt.map(q => q.slice());
      }
      function layThree(st) {                                    // the Naga's film is over: stage 6
        const n = st.n, at3 = st.three && st.three.length === 3 ? st.three : n.laidAt;
        let i = 0;
        for (const p of st.prai) if (p.st === 'shape') {
          const at = at3[Math.min(i++, at3.length - 1)];
          p.x = at[0]; p.z = at[1]; setSt(st, p, 'laid', 'the Naga lays it down');
        }
        st.sanity = Math.max(st.sanity, st.preSurge);             // what the surge pressed out of him comes back
        st.ev.push({ e: 'sanity', to: st.sanity });
        st.who = 'pho'; st.lock = 0; st.lockUntil = 0;
        /* (where the film left them: where they stood as it began, off the walls since the surge; it was the fight's first
           places, which stand 0.8 m off a wall and snapped him there as play came back) */
        /* (and the voice begins again from nothing: the rules' clock stood still through the film, which spoke its own lines,
           so a line begun as TOGETHER was pressed still "played" after it and held back the last stage's first, and the
           surge's own lines left queued would have been said over the three: L3-06) */
        st.voice.q.length = 0; st.voice.until = 0;
        setStage(st, 'last');
        sayOnce(st, 'ph5c1'); sayOnce(st, 'ph5c3');
      }

      const ph0 = (st) => st.pho;
      function stageTick(st, dt, io) {
        const n = st.n;
        if (st.stage === 'learn') {
          if (st.prai[0].st === 'gathered') beginFight(st, false);
        } else if (st.stage === 'fight') {
          // the next one comes: in its order, at its time, while fewer than freeMax are free; and never a court left empty
          let freeN = 0, present = 0, next = null;
          for (const p of st.prai) { if (free(p)) freeN++; if (onCourt(p) && p.id > 1) present++; if (!next && p.st === 'waiting' && p.id > 1) next = p; }
          if (next) {
            if (present === 0 && next.due > st.stageT + n.breather) next.due = st.stageT + n.breather;
            let cap = 1; for (const [at, k] of n.freeAt) if (st.stageT >= at) cap = k;
            if (st.stageT >= next.due && freeN < (st.lead ? n.leadMax : cap) && st.stageT - st.lastEntry >= n.entryGap) {
              const at = n.entryAt[(next.id - 2) % n.entryAt.length], j = n.entryJitter;
              const r1 = io && io.rand ? io.rand() : 0.5, r2 = io && io.rand ? io.rand() : 0.5;
              enter(st, next, at[0] + (r1 - 0.5) * 2 * j, at[1] + (r2 - 0.5) * j); next.stop = at[2] || 0;   // (its beat once risen: entryAt)
            }
          }
          // a hold begins: at six left, and at four (each once a fight)
          if (!st.hold && st.holdsDone < n.holdAt.length && st.left <= n.holdAt[st.holdsDone] && st.left > 3) {
            st.hold = st.holdsDone + 1; st.seen.shock = true;
            /* (its wait is the hold's own, from now, also when the hold begins under the gold's ring: a ring that gathers the
               count to exactly six had left the long wait set as it went out (50 s for the hold's 40, when it was found); the ring's
               end changes it only if it ends the hold, and the wait does not run while the ring is out. A hold cannot begin
               while the gold gathers: nothing is bagged or gathered then) */
            /* (R75's GG: a gold already taught and waiting, its lesson's words still asking him to lend, stays ready: the
               slowest player, whose 40 s ran out before six were left, was told the gold was ready and then had it taken
               back for 34 s while the words still asked for it, v14.2) */
            if (!(ph0(st).wind > 0) && st.lesson.wave !== 'pending') setWave(ph0(st), n.holdSecs);
            st.ev.push({ e: 'hold', n: st.hold, secs: ph0(st).waveWait });
            sayOnce(st, st.hold === n.holdAt.length ? 'ph5fh' : 'ph5fi', n.holdLate);   // the last hold, or the first
          }
          // the golden shockwave is taught the first time it is ready (in the first hold, or its own wait run out)
          if (!st.firsts.wave && !st.lesson.wave && st.pho.waveWait <= 0) {
            st.lesson.wave = 'pending'; st.pho.waveWait = 0; st.seen.shock = true;
            for (const p of st.prai) if ((p.st === 'bound' || p.st === 'held') && !p.hold) restart(st, p, 'grace');
            st.ev.push({ e: 'waveReady', first: true });
          }
          if (st.left <= 3) surge(st);
        } else if (st.stage === 'surge') {
          /* (off the walls before the Naga is called: each eased in; the tall shape over his student goes with him) */
          const [zx, zz] = wallEase(st, st.zav, dt); wallEase(st, st.pho, dt); wallApart(st);
          if (zx || zz) for (const p of st.prai) if (p.st === 'shape') { p.x += zx; p.z += zz; }
          if (st.preSurge > n.surgeTo && st.stageT <= n.surgeSecs + dt) {
            st.sanity = Math.max(n.surgeTo, st.sanity - (st.preSurge - n.surgeTo) / n.surgeSecs * dt);
          }
          if (st.together > 0) {
            timed(st, 'fill', n.togetherSecs - st.together + dt);
            st.together -= dt;
            if (st.together <= 0) { st.together = 0; st.joined = 1; st.voice.q.length = 0; }
          }
          /* (R75's debug, the fight lens's GA: the fill done while a line was still being said, the Naga was called at once
             and its film held back for the line: the two set at their marks in plain play, held there, the boom easing in.
             Joined, the fight now plays on as it was, no new line begun, until the line in the air has been said; then the
             Naga is called, and the marks are laid under the film's opening white (R64: "this rearranging should not be seen
             by the player") */
          if (st.joined && st.t >= st.voice.until) { st.joined = 0; setStage(st, 'naga'); st.film = 0; nagaMarks(st); st.ev.push({ e: 'naga' });
            if (Math.min(wallGap(n, st.pho), wallGap(n, st.zav)) < n.wallOff - 0.01) st.stats.wallFilm++; }
        } else if (st.stage === 'naga') {
          st.film += dt; timed(st, 'naga', st.film);
          if (st.film >= n.filmGuard) layThree(st);               // a film that never says it ended cannot hold the fight
        } else if (st.stage === 'last') {
          wallEase(st, st.zav, dt); wallEase(st, st.pho, dt); wallApart(st);
          if (Math.min(wallGap(n, st.pho), wallGap(n, st.zav)) < n.wallOff - 0.01) st.stats.wallLast += dt;
          /* (won once the last bag's line has been said, or its moment has passed: from 'won' the voice is not stepped, so a
             line still playing at the last bag had left "Come. It is over for you too." in the queue for ever: L3-06. Its
             moment is lessonLate, so this waits 10 s at the most) */
          let lastLine = false; for (const q of st.voice.q) if (q.key === 'ph5c4') lastLine = true;
          if (st.left <= 0 && !lastLine) { setStage(st, 'won'); st.stats.length = st.t; st.ev.push({ e: 'won', sanity: st.sanity }); }
        }
      }

      /* ------------------------------------------------------------------ the bodies */
      function moveBody(st, b, other, speed, mx, mz, dt) {
        const n = st.n;
        let m = Math.sqrt(mx * mx + mz * mz);
        if (!(m > 0.05)) return;
        if (m > 1) { mx /= m; mz /= m; m = 1; }
        const ox = b.x, oz = b.z;
        b.x += mx * speed * dt; b.z += mz * speed * dt;
        clampBody(n, b);
        let dx = b.x - other.x, dz = b.z - other.z, d = Math.sqrt(dx * dx + dz * dz);
        if (d < n.apart) {                                        // he slides round his student's cage, never through it
          if (d < 1e-6) { dx = ox - other.x; dz = oz - other.z; d = Math.sqrt(dx * dx + dz * dz) || 1; }
          b.x = other.x + dx / d * n.apart; b.z = other.z + dz / d * n.apart;
          clampBody(n, b);
          if (dist(b.x, b.z, other.x, other.z) < n.apart - 1e-6) { b.x = ox; b.z = oz; }
        }
        wallHold(st, b, ox, oz);
      }
      function aiTick(st, dt) {
        const n = st.n, ph = st.pho, z = st.zav;
        if (!isP(st)) {
          // Grandmaster Pho, left alone, keeps the far ones back: now and then a fireball that sets a Prai on its way back a
          // step. It never chases one away (that sends it into hiding: his student's work), never tires one, never bags,
          // never the gold (the plan's 5.7); and he stays beside his student
          ph.aiWait -= dt;
          if (ph.aiWait <= 0 && ph.wind <= 0 && ph.draw <= 0 && st.stage === 'fight') {
            let best = null, bs = 1e9;
            for (const p of st.prai) {
              if (!((p.st === 'coming' || p.st === 'shown') && p.at === 0 && p.kind !== 'slip' && p.stop <= 0)) continue;
              if (dist(ph.x, ph.z, p.x, p.z) > n.fireReach) continue;
              const d = dist(z.x, z.z, p.x, p.z);
              if (d < bs) { bs = d; best = p; }
            }
            if (best) {
              ph.aiWait = n.aiFireWait;
              st.flights.push({ id: best.id, cloud: 0, t: n.flight, ai: true, x: best.x, z: best.z });
              st.ev.push({ e: 'fireball', id: best.id, x: best.x, z: best.z, ai: true });
            }
          }
          if (ph.wind <= 0 && ph.draw <= 0 && dist(ph.x, ph.z, z.x, z.z) > n.aiFar) {
            const hx = z.x + n.aiHome[0], hz = z.z + n.aiHome[1], dx = hx - ph.x, dz = hz - ph.z, d = Math.sqrt(dx * dx + dz * dz);
            if (d > 0.1) moveBody(st, ph, z, n.phoWalk, dx / d, dz / d, dt);
          }
          z.look = 0;
        } else {
          // Master Zavier, left alone: the cage and the murmur go on; his head turns toward a Prai that has hidden
          let best = 0, bs = 1e9;
          for (const p of st.prai) if (p.st === 'hidden' || p.st === 'beneath') { const d = dist(z.x, z.z, p.x, p.z); if (d < bs) { bs = d; best = p.id; } }
          z.look = best;
        }
      }

      /* ------------------------------------------------------------------ the fire in the air, the gold, the ring */
      function pushBack(st, p, by, stop) {
        const z = st.zav, dx = p.x - z.x, dz = p.z - z.z, d = Math.sqrt(dx * dx + dz * dz) || 1;
        slideTo(st.n, p, p.x + dx / d * by, p.z + dz / d * by, st.n.slidePush);   // (R43: carried back, never put: slideTick)
        p.stop = stop;
      }
      /* (R43: A PRAI SET BACK IS CARRIED THERE, NEVER PUT: fast, easing in over its last few centimetres, so the picture
         follows it. The fire's setback had moved it 0.7 m in one step and the gold across the court, each drawn as a jump.
         The place is the one it was put at (in the court); a bubble, a lesson's hold or the bag stops the slide where it is) */
      function slideTo(n, p, x, z, speed) { const c = { x, z }; clampPrai(n, c); p.sx = c.x; p.sz = c.z; p.sv = speed; }
      function slideTick(n, p, dt) {
        if (!(p.sv > 0)) return;
        if (prFixed(p) || p.st === 'drawn' || !prBody(p)) { p.sv = 0; return; }
        const dx = p.sx - p.x, dz = p.sz - p.z, d = Math.sqrt(dx * dx + dz * dz);
        if (d < 0.005) { p.x = p.sx; p.z = p.sz; p.sv = 0; return; }
        const stp = Math.min(d, Math.max(p.sv * 0.35, Math.min(p.sv, d * 6)) * dt);
        p.x += dx / d * stp; p.z += dz / d * stp; clampPrai(n, p);
      }
      function chase(st, p) {                                    // chased away: it flees to the far side, and sinks there
        const n = st.n, z = st.zav;
        const dx = p.x - z.x, dz = p.z - z.z, d = Math.sqrt(dx * dx + dz * dz) || 1;
        p.fx = Math.max(-(n.courtX - n.praiIn), Math.min(n.courtX - n.praiIn, p.x + dx / d * 1.2));
        p.fz = n.throwZ;
        p.stop = 0; p.at = 0; p.gath = 0; p.show = 0;
        setSt(st, p, 'fleeing', 'the fire chases it away');
        st.stats.chased++;
        if (st.stage === 'learn') st.seen.swap = true;          // the switch appears the moment the lesson first needs it
      }
      function land(st, f) {
        const n = st.n;
        if (f.cloud) { st.stats.stale++; st.ev.push({ e: 'land', id: 0, result: 'stale', x: f.x, z: f.z }); sayOnce(st, 'q5c3'); return; }
        const p = f.id ? st.prai[f.id - 1] : null;
        let result = 'empty';
        if (p && f.ai) {
          if ((p.st === 'coming' || p.st === 'shown') && p.at === 0) { pushBack(st, p, n.push, n.stopSecs); result = 'setback'; }
        } else if (p) {
          if (p.st === 'bound') {                                 // it cannot run: the fire tires it
            p.ring = n.ringSecs; setSt(st, p, 'held', 'fire on a bound one'); result = 'tired';
            if (st.stage === 'learn') sayOnce(st, 'ph5fa');
            else if (!st.firsts.boundFire) { st.firsts.boundFire = true; sayOnce(st, 'ph5g2'); }
          } else if (p.kind === 'slip' && (p.st === 'coming' || p.st === 'pressing' || p.st === 'through' || p.st === 'shown')) {
            result = 'slipped'; st.stats.slipped++;
          } else if (p.st === 'coming' || p.st === 'pressing' || p.st === 'through' || p.st === 'shown') {
            chase(st, p); result = 'chased';
            if (st.stage === 'learn') sayOnce(st, 'ph5f2');
          }
        }
        st.ev.push({ e: 'land', id: f.id, result, x: f.x, z: f.z });
      }
      function flightsTick(st, dt) {
        let w = 0;
        for (let i = 0; i < st.flights.length; i++) {
          const f = st.flights[i];
          f.t -= dt;
          if (f.t <= 0) land(st, f); else st.flights[w++] = f;
        }
        st.flights.length = w;
      }
      function windTick(st, dt) {
        const n = st.n, ph = st.pho;
        if (!(ph.wind > 0)) return;
        const lent = st.cage.lent > 0;
        timed(st, 'wind', n.windSecs - ph.wind + dt);
        ph.wind -= dt;
        let broken = false;
        for (const p of st.prai) {
          if (p.st !== 'rushing') continue;
          const dx = ph.x - p.x, dz = ph.z - p.z, d = Math.sqrt(dx * dx + dz * dz) || 1;
          const stopAt = lent ? n.pressR : n.breakDist * 0.5;
          const stp = Math.min(n.rush * dt, Math.max(0, d - stopAt));
          p.x += dx / d * stp; p.z += dz / d * stp; clampPrai(n, p);
          if (!lent && d - stp <= n.breakDist) broken = true;
        }
        if (broken) {
          ph.wind = 0; setWave(ph, st.hold ? Math.min(n.waveBroken, n.holdRetry) : n.waveBroken); st.stats.broken++;
          for (const p of st.prai) if (p.st === 'rushing') { setSt(st, p, p.was === 'shown' ? (p.show > 0 ? 'shown' : 'hidden') : 'coming', 'the gold broke'); p.at = 0; }
          st.ev.push({ e: 'broken' });
          st.said.ph5fe = 0; sayOnce(st, 'ph5fe');               // (said each time it happens)
        } else if (ph.wind <= 0) {
          ph.wind = 0; setWave(ph, st.hold ? n.holdRetry : n.waveWait);
          /* (out from where the stick's foot strikes the paving when the stage says where that is (ph.strike: opt-in, the
             sim never sets it), else from where he stands) */
          const sx = ph.strike ? ph.strike.x : ph.x, sz = ph.strike ? ph.strike.z : ph.z;
          ph.ring = { r: 0, x: sx, z: sz, touched: 0, gathered: 0 };
          /* (crowded round him: the ring's first instant. R75's debug, GB: these were thrown with no word to the stage, so the
             ones nearest him, the most seen, had no blast, no flinch, no shake and no sound of R61's; each is told now, a
             moment apart (`after`), so each is heard and felt as its own hit) */
          let nh = 0;
          for (const p of st.prai) if (p.st === 'rushing') { ph.ring.touched |= 1 << p.id; st.ev.push({ e: 'waveHit', id: p.id, gathers: false, after: 0.07 * nh++ }); throwBack(st, p, ph.ring); }
          st.ev.push({ e: 'wave', x: sx, z: sz });
          if (!st.firsts.waveOut) { st.firsts.waveOut = true; sayOnce(st, 'ju5c1', 5.0); }
        }
      }
      /* the ring drives a free Prai back to the far side and stills it there; what was under the paving it shows */
      function throwBack(st, p, circle) {
        const n = st.n, under = p.st === 'hidden' || p.st === 'beneath' || p.st === 'shown' || (p.st === 'rushing' && p.was === 'shown');
        slideTo(n, p, Math.max(-(n.courtX - n.praiIn), Math.min(n.courtX - n.praiIn, p.x + (p.x - circle.x) * 0.5)), n.throwZ, n.slideThrow);   // (R43: thrown, not put)
        p.stop = n.throwStop; p.at = 0; p.gath = 0; p.lurk = 0;
        if (under) { p.show = n.showSecs; if (p.st === 'shown') restart(st, p, p.hold); else setSt(st, p, 'shown', 'the gold shows it'); }
        else setSt(st, p, 'coming', 'the gold drives it back');
      }
      function ringTick(st, dt) {
        const n = st.n, ph = st.pho, circle = ph.ring;
        if (!circle) return;
        circle.r += n.ringSpeed * dt;
        let took = false;                                         // the count falls by one a step: a second one the ring has
        for (const p of st.prai) {                                // reached is gathered on the next (one mark, one note, at a time)
          const bit = 1 << p.id;
          if (circle.touched & bit) continue;
          if (p.st === 'waiting' || p.st === 'gathered' || p.st === 'drawn' || p.st === 'entering' || p.st === 'fleeing' || p.st === 'shape' || p.st === 'laid' || p.st === 'tired') continue;
          if (dist(circle.x, circle.z, p.x, p.z) > circle.r) continue;
          if (took && (p.st === 'bound' || p.st === 'held')) continue;
          circle.touched |= bit;
          // (R61: each one the gold reaches is STRUCK, told once each, in the order it reaches them: the stage's blast, sound, shake)
          st.ev.push({ e: 'waveHit', id: p.id, gathers: p.st === 'bound' || p.st === 'held' });
          if (p.st === 'bound' || p.st === 'held') {
            // gathered at once: never past the three the surge waits on, and never the count jumped (the plan's 5.5)
            if (st.stage === 'fight' && st.left - 1 < 3) { if (p.st === 'bound') { p.ring = n.ringSecs; setSt(st, p, 'held', 'the gold'); } continue; }
            setSt(st, p, 'gathered', 'the gold'); p.hold = ''; st.left--; circle.gathered++; st.stats.byWave++; took = true;
            st.ev.push({ e: 'gathered', id: p.id, by: 'wave', left: st.left });
            leftLines(st);
          } else throwBack(st, p, circle);
        }
        if (circle.r >= n.ringMax && !took) {                     // (it goes out only once a step has taken nothing more)
          ph.ring = null;
          if (st.cage.lent > n.lendAfter) st.cage.lent = n.lendAfter;
          if (!st.firsts.wave) {
            st.firsts.wave = true; st.lesson.wave = 'done';
            for (const p of st.prai) if (p.hold === 'grace') restart(st, p, '');
            sayOnce(st, 'ph5f10');
            if (circle.gathered) sayOnce(st, 'ph5g3');
            sayOnce(st, 'q5c4', 14.0);                             // his thought on the first lend, in the relief after the gold
          }
          st.ev.push({ e: 'waveDone', gathered: circle.gathered });
          if (st.hold && st.hold < n.holdAt.length && st.left < n.holdAt[st.hold - 1]) {
            // the bag opens again; the gold's long wait
            st.holdsDone = st.hold; st.hold = 0; setWave(ph, n.waveWait);
            st.ev.push({ e: 'holdEnd' });
          }
        }
      }

      /* ------------------------------------------------------------------ the Prai */
      function towardHim(st, p, pace, stopAt, dt, weave) {
        const z = st.zav, dx = z.x - p.x, dz = z.z - p.z, d = Math.sqrt(dx * dx + dz * dz) || 1e-6;
        if (d <= stopAt + 1e-6) return true;
        const stp = Math.min(pace * dt, d - stopAt);
        /* (R43: one that is seen goes round what stands in its way; one under the paving goes under it) */
        const u = p.st === 'hidden' || p.st === 'beneath' ? null : steerAround(st, p, dx / d, dz / d, d);
        if (u) { p.x += u[0] * stp; p.z += u[1] * stp; } else { p.x += dx / d * stp; p.z += dz / d * stp; }
        if (weave) { p.ph += dt; const s = Math.sin(p.ph * 2 * Math.PI / st.n.weaveSecs) * weave * dt; p.x += -dz / d * s; p.z += dx / d * s; }
        clampPrai(st.n, p);
        return dist(z.x, z.z, p.x, p.z) <= stopAt + 1e-3;
      }
      /* R43: THE BODIES ON THE COURT. What stands on the paving as a body: everything seen and not being drawn into the bag;
         what cannot be moved by another (a bubble, a tired one, one rising, one a lesson holds where it is) */
      const prBody = (p) => p.st === 'coming' || p.st === 'pressing' || p.st === 'through' || p.st === 'shown' || p.st === 'rushing' ||
                            p.st === 'fleeing' || p.st === 'bound' || p.st === 'held' || p.st === 'tired' || p.st === 'entering';
      const prFixed = (p) => p.st === 'bound' || p.st === 'held' || p.st === 'tired' || p.st === 'entering' || !!p.hold;
      /* (a bubble's disc grows round the bound one over bubGrow, so what stood beside it is moved out of it, never jumped) */
      const prR = (n, p) => (p.st === 'bound' || p.st === 'held') ? n.praiR + (n.bubR - n.praiR) * Math.min(1, (p.bt || 0) / Math.max(0.01, n.bubGrow || 0.3)) : n.praiR;
      /* its way (ux, uz: a unit step toward its goal, `far` metres off) turned round each body that stands ahead of it, within
         steerLook and nearer than its goal, whose disc its line would cross: away from the side the body stands on, the more
         the nearer its line runs to the body's middle and the nearer the body is. A body dead ahead is passed on the side
         this one's number gives (the same answer every run). Grandmaster Pho is a body to it; its goal, his student, is not */
      function steerAround(st, p, ux, uz, far) {
        const n = st.n; if (!(n.steerLook > 0)) return null;
        let sx = ux, sz = uz, turned = false;
        const one = (ox, oz, r) => {
          const rx = ox - p.x, rz = oz - p.z, along = rx * ux + rz * uz;
          if (along <= 0.02 || along > Math.min(n.steerLook, far)) return;
          const lat = rx * -uz + rz * ux, clear = r + n.praiR + 0.06;
          if (Math.abs(lat) >= clear) return;
          const side = lat > 1e-6 ? -1 : lat < -1e-6 ? 1 : (p.id % 2 ? 1 : -1);   // (the body on its left: it goes right)
          const k = 1.6 * (1 - Math.abs(lat) / clear) * (1 - along / Math.min(n.steerLook, far) * 0.6);
          sx += -uz * side * k; sz += ux * side * k; turned = true;
        };
        one(st.pho.x, st.pho.z, n.phoR);
        for (const q of st.prai) if (q !== p && prBody(q)) one(q.x, q.z, prR(n, q));
        for (const t of n.props || []) one(t[0], t[1], t[2]);
        if (!turned) return null;
        const L = Math.sqrt(sx * sx + sz * sz) || 1; return [sx / L, sz / L];
      }
      /* one that waits its turn while three are at his bars: round him, a little out from the bars, slowly (prowl), each its
         own way (its number), turning back where its way is shut (a wall, a planter, or a body just ahead) */
      function prowl(st, p, d, dt) {
        const n = st.n, z = st.zav; if (!(n.prowl > 0) || d < 1e-6) return;
        if (!p.pdir) p.pdir = p.id % 2 ? 1 : -1;
        if (p.pturn > 0) p.pturn -= dt;
        const ox = (p.x - z.x) / d, oz = (p.z - z.z) / d, tx = -oz * p.pdir, tz = ox * p.pdir;
        const want = Math.min(n.waitR, n.pressR + n.prowlIn), s = n.prowl * dt, pull = (want - d) * Math.min(1, dt * 1.5);
        let shut = false;
        const ax = p.x + tx * (n.praiR * 2 + 0.12), az = p.z + tz * (n.praiR * 2 + 0.12);
        for (const q of st.prai) if (q !== p && prBody(q) && dist(ax, az, q.x, q.z) < prR(n, q) + n.praiR) shut = true;
        if (dist(ax, az, st.pho.x, st.pho.z) < n.phoR + n.praiR) shut = true;
        for (const t of n.props || []) if (dist(ax, az, t[0], t[1]) < t[2] + n.praiR) shut = true;
        const bx = p.x, bz = p.z;
        if (!shut) { p.x += tx * s + ox * pull; p.z += tz * s + oz * pull; clampPrai(n, p); }
        if ((shut || dist(bx, bz, p.x, p.z) < s * 0.35) && !(p.pturn > 0)) { p.pdir = -p.pdir; p.pturn = n.prowlTurn; }
      }
      /* every body on the court set apart from every other it stands in, and out of Grandmaster Pho: two that meet each
         give half the overlap along the line between them (one that cannot move gives none: the other all of it); one at
         his bars, or at him, is then set back on its ring round him (so it slides round), and each kept in the court.
         Three passes, in the nine's own order: the same answer every run */
      function praiBodies(st) {
        const n = st.n, z = st.zav, ph = st.pho, L = st.prai;
        if (!(n.praiR > 0)) return;
        for (let pass = 0; pass < 3; pass++) {
          let moved = false;
          for (let i = 0; i < L.length; i++) { const a = L[i]; if (!prBody(a)) continue;
            for (let j = i + 1; j < L.length; j++) { const b = L[j]; if (!prBody(b)) continue;
              const fa = prFixed(a), fb = prFixed(b); if (fa && fb) continue;
              let dx = b.x - a.x, dz = b.z - a.z, d = Math.sqrt(dx * dx + dz * dz); const need = prR(n, a) + prR(n, b);
              if (d >= need - 1e-4) continue;
              if (d < 1e-6) { dx = (a.id % 2 ? 1 : -1) * 0.01; dz = 0.01; d = Math.sqrt(dx * dx + dz * dz); }
              const over = need - d, ux = dx / d, uz = dz / d, ka = fa ? 0 : fb ? 1 : 0.5, kb = 1 - ka;
              a.x -= ux * over * ka; a.z -= uz * over * ka; b.x += ux * over * kb; b.z += uz * over * kb; moved = true; } }
          for (const p of L) { if (!prBody(p) || prFixed(p)) continue;
            for (const o of [[ph.x, ph.z, n.phoR]].concat(n.props || [])) {             // (out of him, and out of each thing on the court)
              const dx = p.x - o[0], dz = p.z - o[1], d = Math.sqrt(dx * dx + dz * dz), need = o[2] + n.praiR;
              if (d < need - 1e-4) { const ux = d > 1e-6 ? dx / d : (p.id % 2 ? 1 : -1), uz = d > 1e-6 ? dz / d : 0; p.x = o[0] + ux * need; p.z = o[1] + uz * need; moved = true; } } }
          for (const p of L) { if (!prBody(p) || prFixed(p)) continue;
            if (p.st === 'pressing') toRing(st, p, n.pressR);
            clampPrai(n, p); }
          if (!moved) break;
        }
        /* (what three passes leave standing in a body that cannot move, or in him, is held there by the court's edge or by
           his bars: it is set at the NEAREST clear place instead, on its ring if it has one (rings of 4 cm, 24 ways round,
           out to a metre and a half; the same answer every run)) */
        for (const p of L) { if (!prBody(p) || prFixed(p)) continue;
          if (!prIn(st, p, p.x, p.z)) continue;
          const ring = p.st === 'pressing' ? n.pressR : 0;
          let best = null;
          if (ring) { const a0 = Math.atan2(p.z - z.z, p.x - z.x);
            for (let k = 1; k <= 36 && !best; k++) for (const sg of [1, -1]) { const a = a0 + sg * k * Math.PI / 36, qx = z.x + Math.cos(a) * ring, qz = z.z + Math.sin(a) * ring;
              const c = { x: qx, z: qz }; clampPrai(n, c); if (Math.abs(c.x - qx) + Math.abs(c.z - qz) < 1e-6 && !prIn(st, p, qx, qz)) { best = c; break; } } }
          else for (let r = 0.04; r <= 1.5 && !best; r += 0.04) for (let k = 0; k < 24; k++) { const a = k * Math.PI / 12, qx = p.x + Math.cos(a) * r, qz = p.z + Math.sin(a) * r;
              const c = { x: qx, z: qz }; clampPrai(n, c); if (Math.abs(c.x - qx) + Math.abs(c.z - qz) < 1e-6 && !prIn(st, p, qx, qz)) { best = c; break; } }
          /* (R75's debug, GN: his ring all taken (his teacher on it and three bubbles round his bars), a pressing one found no
             clear place on it and was left standing in a body. It stands, still pressing, just outside the ring instead, on
             the nearest clear place out from it along its own line first) */
          if (ring && !best) { const a0 = Math.atan2(p.z - z.z, p.x - z.x);
            for (let r = ring + 0.04; r <= ring + 1.5 && !best; r += 0.04) for (let k = 0; k <= 36 && !best; k++) for (const sg of k ? [1, -1] : [1]) {
              const a = a0 + sg * k * Math.PI / 36, qx = z.x + Math.cos(a) * r, qz = z.z + Math.sin(a) * r;
              const c = { x: qx, z: qz }; clampPrai(n, c); if (Math.abs(c.x - qx) + Math.abs(c.z - qz) < 1e-6 && !prIn(st, p, qx, qz)) { best = c; break; } } }
          if (best) { p.x = best.x; p.z = best.z; }
        }
      }
      /* (whether a body of praiR at x, z stands in another body on the court, or in Grandmaster Pho) */
      function prIn(st, p, x, z) {
        const n = st.n;
        if (Math.hypot(x - st.pho.x, z - st.pho.z) < n.phoR + n.praiR - 0.01) return true;
        for (const t of n.props || []) if (Math.hypot(x - t[0], z - t[1]) < t[2] + n.praiR - 0.01) return true;
        for (const q of st.prai) if (q !== p && prBody(q) && Math.hypot(x - q.x, z - q.z) < prR(n, q) + n.praiR - 0.01) return true;
        return false;
      }
      /* a Prai set back on the ring r round him (his bars: pressR), along the line from him where the court allows it, else
         round him toward the court's middle (the nearest place on the ring inside it): where a wall stood between, the
         carry or his own walk had put one inside his bars */
      function toRing(st, p, r) {
        const n = st.n, z = st.zav, xm = n.courtX - n.praiIn, z0 = Math.max(n.courtZ0 + n.praiIn, n.threadZ), z1 = n.courtZ1 - n.praiIn;
        let dx = p.x - z.x, dz = p.z - z.z;
        if (Math.abs(Math.sqrt(dx * dx + dz * dz) - r) <= 0.02) return;
        if (dx * dx + dz * dz < 1e-12) { dx = -z.x || 1e-3; dz = -z.z; }
        const a0 = Math.atan2(dz, dx);
        for (let i = 0; i <= 36; i++) for (const sg of i ? [1, -1] : [1]) {
          const a = a0 + sg * i * Math.PI / 36, qx = z.x + Math.cos(a) * r, qz = z.z + Math.sin(a) * r;
          if (Math.abs(qx) <= xm && qz >= z0 && qz <= z1 && !(n.notch && qz > n.notch.z && Math.abs(qx) > n.notch.x)) { p.x = qx; p.z = qz; return; }
        }
        p.x = z.x + Math.cos(a0) * r; p.z = z.z + Math.sin(a0) * r; clampPrai(n, p);
      }
      function praiTick(st, dt) {
        const n = st.n, z = st.zav, cage = st.cage, lent = cage.lent > 0, holds = !cage.broken && !lent;
        // a bubble does not run down while the cage is lent, nor while the gold is gathered and goes out, nor, in a hold,
        // for goldGrace seconds from the moment the gold is ready (a bubble never ends in the instant the gold is asked
        // for). In all, a bubble stands still stillMax seconds at most, however often the cage is lent or the gold made
        // ready (a cage lent and lent again, the gold never loosed, had held one bubble 36 s), so a bubble is still a
        // timed thing with a longest stand: bubbleLongest
        const ph = st.pho, goldNow = st.hold > 0 && ph.waveWait <= 0 && !(ph.wind > 0) && !ph.ring;
        if (!goldNow) st.goldAt = -1; else if (!(st.goldAt >= 0)) st.goldAt = st.t;
        const still = lent || ph.wind > 0 || !!ph.ring || (goldNow && st.t - st.goldAt < n.goldGrace);
        const drawn = (st.drawT > 0 ? n.drawPace : 1) * (st.hold ? n.holdPace : 1);   // his senses opened wide draw them on; the gathering gold weighs on them
        let pressing = 0;
        for (const p of st.prai) if (p.st === 'pressing') pressing++;
        /* WHAT IS AT HIM GOES WHERE HE GOES (L3-04): one that presses his bars, one past them, one up under him and one shown
           beside him are carried by however far he has moved since the last step (his walk, or the stage stepping him out of
           the lens's line); they had stood where they reached him and worn his cage, or taken his sanity, from metres off,
           the violet flare drawn on his bars facing a Prai far away. So walking away from them is no way out (only BIND,
           and his teacher's fire), and what is drawn at him is what is counted at him (v8.7) */
        const cdx = z.x - z.cx, cdz = z.z - z.cz, carry = cdx !== 0 || cdz !== 0;
        z.cx = z.x; z.cz = z.z;
        for (const p of st.prai) {
          p.t += dt;
          if (carry && (p.st === 'pressing' || p.st === 'through' || p.st === 'beneath' || (p.st === 'shown' && p.at === 2))) {
            p.x += cdx; p.z += cdz; clampPrai(n, p);
          }
          slideTick(n, p, dt);                                    // (R43: a setback or a throw carries it there)
          p.bt = (p.st === 'bound' || p.st === 'held') ? (p.bt || 0) + dt : 0;   // (R43: how long its bubble has stood)
          switch (p.st) {
            case 'entering':
              if (p.t >= n.enterSecs) { setSt(st, p, 'coming', 'risen'); if (p.kind === 'hide') p.hideIn = n.hideAfter; }
              break;
            case 'coming': {
              if (p.stop > 0) { p.stop -= dt; break; }
              if (p.hold === 'stand') break;                        // the lesson's Prai strains where it stands
              if (p.kind === 'hide') {
                p.hideIn -= dt;
                if (p.hideIn <= 0) { p.at = 0; p.lurk = 0; setSt(st, p, 'hidden', 'it sinks into the paving'); break; }
              }
              const pace = (p.kind === 'slip' ? n.paceSlip : p.kind === 'hide' ? n.paceHide : n.paceCome) * drawn;
              const wv = p.kind === 'slip' ? n.weave : 0;
              if (!holds) { if (towardHim(st, p, pace, n.himR, dt, wv)) { p.gath = n.gather; p.at = 2; setSt(st, p, 'through', lent ? 'the cage is lent' : 'the cage is broken'); } break; }
              const d = dist(z.x, z.z, p.x, p.z);
              // three at the bars: the rest wait, in view (and one he walks into is pushed out by his bars, never left
              // standing inside them while his cage holds)
              if (pressing >= n.pressMax && d <= n.waitR + 0.05) { if (d < n.pressR - 0.02) toRing(st, p, n.pressR); else prowl(st, p, d, dt); break; }   // (R43: it prowls)
              if (towardHim(st, p, pace, n.pressR, dt, wv) && pressing < n.pressMax) { p.at = 1; pressing++; toRing(st, p, n.pressR); setSt(st, p, 'pressing', 'at the bars'); }
              break;
            }
            case 'pressing':
              // it wears the cage (cageTick); carried with him (above), and kept at his bars where a wall or his walk would
              // have put it inside them
              toRing(st, p, n.pressR);
              break;
            case 'through':
              towardHim(st, p, 1.0, n.himR, dt, 0);
              if (p.gath > 0) { p.gath -= dt; if (p.gath <= 0) st.ev.push({ e: 'reach', id: p.id }); }
              break;
            case 'fleeing': {
              const dx = p.fx - p.x, dz = p.fz - p.z, d = Math.sqrt(dx * dx + dz * dz);
              if (d > 1e-3) { const stp = Math.min(n.fleePace * dt, d); p.x += dx / d * stp; p.z += dz / d * stp; clampPrai(n, p); }
              if (p.t >= n.fleeSecs) {
                p.lurk = n.lurkSecs;
                if (st.stage === 'learn') p.hold = 'hide';            // the lesson's Prai waits there for his first SMELL
                setSt(st, p, 'hidden', 'it sinks where it fled');
              }
              break;
            }
            case 'hidden':
              if (p.hold === 'hide') break;
              if (p.lurk > 0) { p.lurk -= dt; break; }
              if (towardHim(st, p, n.paceHidden * drawn, n.himR, dt, 0)) { p.gath = n.gather; p.at = 2; setSt(st, p, 'beneath', 'under him'); }
              break;
            case 'beneath':
              if (p.gath > 0) { p.gath -= dt; if (p.gath <= 0) st.ev.push({ e: 'reach', id: p.id }); }
              break;
            case 'shown':
              if (p.hold !== 'show') p.show -= dt;
              if (p.stop > 0) p.stop -= dt;
              else if (p.hold !== 'show' && p.at !== 2 && !(p.lurk > 0)) { if (towardHim(st, p, n.paceHidden * drawn, n.himR, dt, 0)) { p.at = 2; p.gath = n.gather; } }
              else if (p.lurk > 0) p.lurk -= dt;
              if (p.at === 2 && p.gath > 0) { p.gath -= dt; if (p.gath <= 0) st.ev.push({ e: 'reach', id: p.id }); }
              if (p.show <= 0) {
                st.clouds.push({ id: st.nextCloud++, x: p.x, z: p.z, t: n.staleSecs });   // the smell stays where it was
                setSt(st, p, p.at === 2 ? 'beneath' : 'hidden', 'the smell thins');
              }
              break;
            case 'bound':
              if (p.hold !== 'keep' && p.hold !== 'grace') {
                if (still && p.stood + dt <= n.stillMax + 1e-9) p.stood += dt;
                else { p.bub -= dt; if (p.bub <= 0) { p.bub = 0; unbind(st, p); } }
              }
              break;
            case 'held':
              if (p.hold !== 'keep' && p.hold !== 'grace') {
                if (still && p.stood + dt <= n.stillMax + 1e-9) p.stood += dt;
                else { p.bub -= dt; if (p.bub <= 0) { p.bub = 0; setSt(st, p, 'tired', 'the bubble ends'); p.hold = ''; } }
              }
              break;
            case 'tired':
              p.ring -= dt;
              if (p.ring <= 0) {                                    // it rises again, and slips away into the paving
                p.ring = 0; p.at = 0; p.lurk = 0; st.stats.rose++;
                setSt(st, p, 'hidden', 'it rises again');
                st.ev.push({ e: 'rise', id: p.id });
                if (st.stats.rose === 1) sayOnce(st, 'ph5ne1');
              }
              break;
            case 'drawn':
              if (p.t >= n.bagSecs) {
                setSt(st, p, 'gathered', 'into the bag'); st.left--;
                if (!st.prai.some(q => q.st === 'drawn')) st.pho.draw = 0;   // (R71: his draw ends with the last of them)
                st.ev.push({ e: 'gathered', id: p.id, by: 'bag', left: st.left });
                leftLines(st);
              }
              break;
          }
        }
        praiBodies(st);                                           // (R43: none stands in another, nor in Grandmaster Pho)
        // the stale clouds thin and go
        if (st.clouds.length) { let w = 0; for (const c of st.clouds) { c.t -= dt; if (c.t > 0) st.clouds[w++] = c; } st.clouds.length = w; }
      }
      function unbind(st, p) {
        p.at = 0;
        if (p.kind === 'hide') { st.clouds.push({ id: st.nextCloud++, x: p.x, z: p.z, t: st.n.staleSecs }); p.lurk = 0; setSt(st, p, 'hidden', 'the bubble ends: it slips under'); }
        else setSt(st, p, 'coming', 'the bubble ends');
        p.hold = '';
        st.ev.push({ e: 'unbind', id: p.id });
        /* (R82: a break-out from the bind costs him, in the fight; the lesson's bubbles teach, and cost nothing) */
        if (st.stage === 'fight' && st.n.breakHit > 0) { st.owe += st.n.breakHit; st.stats.breakHits = (st.stats.breakHits || 0) + 1; st.ev.push({ e: 'breakHit', id: p.id }); }
        /* (R110/R111, 24 Nov 2026: Chad, "The user will just keep binding the prais and the prais keep breaking out of the cage,
           and the player will wonder whats going on and what they need to do"; "Zavier should have some voicelines saying
           'they keep breaking out of the binding cage? What should i do?' ... and pho will answer him". At the second break-out
           in the open fight his student asks and his teacher says what to do (the bind lasts seconds: bind, switch, fire,
           bag); at the second in a hold, the teacher says what a hold asks (bind them, shield him, the shockwave). Queued in
           that order with time to be said: a line already in the air, or a need that costs him, is let finish first) */
        if (st.stage === 'fight') { const k = st.hold > 0 ? 'hold' : 'plain'; st.brk = st.brk || { plain: 0, hold: 0 }; st.brk[k]++;
          if (st.brk[k] === 2) { if (!st.said.q5fb1) sayOnce(st, 'q5fb1', 20); sayOnce(st, k === 'hold' ? 'ph5fb2' : 'ph5fb1', 26); } }
      }
      function leftLines(st) {
        if (st.stage === 'learn') sayOnce(st, 'ph5g1');
        if (st.stage === 'fight' && st.left <= 5 && st.left > 3) sayOnce(st, 'q5c1');   // (R71: a bag of two may pass five)
        if (st.stage === 'last' && st.left === 0) sayOnce(st, 'ph5c4');
      }

      /* ------------------------------------------------------------------ the cage, and his sanity */
      function cageTick(st, dt) {
        const n = st.n, c = st.cage;
        if (c.lent > 0) {
          c.lentFor = (c.lentFor || 0) + dt; timed(st, 'lend', c.lentFor);   // (from the lend's own start: its 6 s may begin again)
          c.lent -= dt;
          if (c.lent <= 0) { c.lent = 0; st.ev.push({ e: 'lendEnd' }); }
          return;                                                 // round his teacher it is neither worn nor mended
        }
        let pressing = 0, busy = false;
        for (const p of st.prai) { if (p.st === 'pressing') pressing++; if (p.st === 'pressing' || atHim(p)) busy = true; }
        if (!c.broken && pressing) {
          c.str -= n.wear * pressing * dt * (st.drawT > 0 ? n.drawWear : 1);
          if (c.str <= 0) {
            c.str = 0; c.broken = true; st.stats.breaks++;
            for (const p of st.prai) if (p.st === 'pressing') { p.gath = n.gather; p.at = 2; setSt(st, p, 'through', 'the cage breaks'); }
            st.ev.push({ e: 'cageBreak' });
          }
        } else if (!busy && c.str < n.cageMax) {
          c.str = Math.min(n.cageMax, c.str + n.mend * dt);
          if (c.broken && c.str >= n.whole) { c.broken = false; st.ev.push({ e: 'cageWhole' }); }
        }
        if (c.str < 25 && st.stage === 'fight') sayOnce(st, 'tn5c2', 5.0);
      }
      function sanityTick(st, dt, fed) {
        const n = st.n;
        if (st.stage !== 'fight') { st.owe = 0; return; }
        let k = 0, near = 0;
        for (const p of st.prai) { if (atHim(p) && p.gath <= 0) k++; else if (n.closeDrain > 0 && closeTo(st, p)) near++; }
        const owe = st.owe; st.owe = 0;
        if (!k && !near && !owe) return;
        const amt = (n.drain * k * dt + n.closeDrain * near * dt + owe) * (1 - st.guard);
        if (near) st.stats.closeT = (st.stats.closeT || 0) + dt;
        st.sanity -= amt; st.stats.drained += amt;
        st.ev.push({ e: 'drain', amt });
        /* (where the engine feeds its own number back, the loss is judged on THAT, the next step (step(), at its top): it is
           what his bar shows, after a worn piece's guard has cut this drain (evCut, v14.13). Judged here on the uncut sum,
           a smell opened for nothing at 15.5 with the Sak Yant worn lost the fight with his bar at 12.7: L3-08. The
           simulation feeds nothing, and plays the guard's sum itself: judged here, at once) */
        if (!fed && st.sanity <= n.lostAt) lose(st);
      }

      /* ------------------------------------------------------------------ WHAT THE MOMENT ASKS FOR (the button that grows
         and shrinks, chapter 4's R47; the words his teacher says, the plan's 7.1). One answer for the screen and the
         voice, from what is on the screen (never a count of seconds): { id, act, target, ready, move }. `ready` false:
         the act is the right one and its wait is nearly over (its ring fills on the button); `move`: walk to the target */
      function need(st) {
        const n = st.n, P = isP(st), ph = st.pho, z = st.zav;
        const mk = (id, act, target, ready, move) => ({ id, act, target: target ? target.id : 0, ready: ready !== false, move: !!move });
        const lock = st.lock > 0;
        switch (st.stage) {
          case 'brief': return mk('start', 'START');
          case 'lost': return mk('retry', 'RETRY');
          case 'won': case 'naga': return null;
          case 'surge': return st.stageT >= n.togetherAfter && !st.together && !st.joined ? mk('together', 'TOGETHER') : null;
          case 'last': {
            if (ph.draw > 0) return null;
            const b = bagTarget(st, 0);
            if (b) return mk('last', 'BAG', b);
            let best = null, bs = 1e9;
            for (const p of st.prai) if (p.st === 'laid') { const d = dist(ph.x, ph.z, p.x, p.z); if (d < bs) { bs = d; best = p; } }
            return best ? mk('last', 'BAG', best, false, true) : null;
          }
          case 'learn': {
            const p = st.prai[0];
            if (p.st === 'entering' || p.st === 'fleeing' || p.st === 'drawn' || p.st === 'gathered') return null;
            if (p.st === 'coming') return P ? mk('Lfire', 'FIRE', p, ph.fireWait <= 0 && !onFlight(st, p.id) && !lock) : null;
            if (p.st === 'hidden') return null;                    // (R62: his smell finds it by itself)
            if (p.st === 'shown') return P ? mk('shown', 'SWITCH', p, !lock) : mk('shown', 'BIND', p, z.bindWait <= 0 && !lock);
            if (p.st === 'bound') return P ? mk('bound', 'FIRE', p, ph.fireWait <= 0 && !onFlight(st, p.id) && !lock) : mk('bound', 'SWITCH', p, !lock);
            if (p.st === 'held') return P ? (ph.draw > 0 ? null : bagNeed(st, 'tired', p, mk)) : mk('tired', 'SWITCH', p, !lock);
            return null;
          }
        }
        // ---- stage 3, THE FIGHT: what is on the court, in one pass
        let aHim = null, aHimSlip = null, aBen = null, aBound = null, aTired = null, aKeep = null, aShown = null, aSlip = null,
            aHid = null, aCome = null, aPress = null, aPressCome = null, freeNear = 0, bound = 0, seenN = 0;
        for (const p of st.prai) {
          const s = p.st;
          if (s === 'bound' || s === 'held') bound++;
          if (seenFree(p)) seenN++;
          if (atHim(p) && s !== 'beneath') { if (p.kind === 'slip') { if (!aHimSlip) aHimSlip = p; } else if (!aHim || p.gath < aHim.gath) aHim = p; }
          else if (s === 'beneath') { if (!aBen) aBen = p; }
          else if (s === 'bound') { if (!onFlight(st, p.id) && (!aBound || dist(ph.x, ph.z, p.x, p.z) < dist(ph.x, ph.z, aBound.x, aBound.z))) aBound = p; }
          else if (s === 'tired' || s === 'held') {
            if (!aTired || dist(ph.x, ph.z, p.x, p.z) < dist(ph.x, ph.z, aTired.x, aTired.z)) aTired = p;
            if (s === 'tired' && p.ring < n.ringSecs / 2 && (!aKeep || p.ring < aKeep.ring)) aKeep = p;
          }
          else if (s === 'shown') { if (!aShown || p.show < aShown.show) aShown = p; }
          else if (s === 'hidden') { if (!aHid) aHid = p; }
          else if (s === 'pressing') { if (!aPress) aPress = p; if (p.kind !== 'slip' && !onFlight(st, p.id)) aPressCome = p; }
          else if (s === 'coming' && p.kind === 'slip') { if (!aSlip || dist(z.x, z.z, p.x, p.z) < dist(z.x, z.z, aSlip.x, aSlip.z)) aSlip = p; }
          else if (s === 'coming') { if (!onFlight(st, p.id) && (!aCome || dist(z.x, z.z, p.x, p.z) < dist(z.x, z.z, aCome.x, aCome.z))) aCome = p; }
          if (seenFree(p) && dist(ph.x, ph.z, p.x, p.z) - n.breakDist <= n.rush * n.windSecs) freeNear++;
        }
        const lentGo = st.cage.lent > 0 && ph.waveWait <= 0 && ph.wind <= 0 && !ph.ring;
        const waveReady = st.seen.shock && ph.waveWait <= 0 && ph.wind <= 0 && !ph.ring;
        const worth = (st.hold > 0) ? bound > 0 : (bound > 0 || seenN >= 2);   // in the hold the gold takes only what is bound
        const pending = st.lesson.wave === 'pending' || ((st.hold > 0) && waveReady && !bound);
        const full = bubbles(st) >= n.bubbleMax;
        // the gold first, the moment it is ready with something bound (the lesson's own wave aside): it gathers what is
        // bound and throws back everything else, what is at him included, so nothing else the moment holds is worth more
        const goldFirst = waveReady && bound > 0 && !st.lesson.wave.startsWith('pend');
        const fireOk = ph.fireWait <= 0, bindOk = z.bindWait <= 0 && !full;   // (R62: no smell to ask for)
        const bindSoon = !full && z.bindWait <= 1.5;
        if (P) {
          // GRANDMASTER PHO, PLAYED: what only he can do, first (chase off what is at his student, tire the bound, bag the
          // tired, loose the gold under the lent cage); then send him to his student for what only his student can do
          if (ph.wind > 0 || ph.draw > 0) return null;           // the act in hand finishes first
          if (lentGo) return mk('waveGo', 'SHOCKWAVE');
          if (goldFirst) return freeNear ? mk('waveLend', 'SWITCH', null, !lock) : mk('waveSafe', 'SHOCKWAVE');
          if (aHim) return mk('athimF', 'FIRE', aHim, fireOk && !lock);                    // chase it off him
          if (aHimSlip && !full) return mk('athimS', 'SWITCH', aHimSlip, !lock);
          if (waveReady && bound && !st.lesson.wave.startsWith('pend')) return freeNear ? mk('waveLend', 'SWITCH', null, !lock) : mk('waveSafe', 'SHOCKWAVE');
          if (st.lesson.wave === 'pending' && bound) return mk('waveL', 'SWITCH', null, !lock);
          // (in the hold a bound Prai is left bound: still, harmless, and the gold's to gather. Fire would tire it, and a
          // tired one rises again and hides; and the bag is closed)
          if (aBound && !(st.hold > 0)) return mk('bound', 'FIRE', aBound, fireOk && !lock);   // (his fire reaches a bound one anywhere: GI)
          if (aTired && !(st.hold > 0)) return bagNeed(st, 'tired', aTired, mk);
          if (aPressCome && st.cage.str < 35) return mk('cage', 'FIRE', aPressCome, fireOk && !lock);   // the cage nearly gone: chase it off
          if (pending) return bound ? mk('waveL', 'SWITCH', null, !lock) : mk('waveB', 'SWITCH', null, !lock);
          if (aPress && !full) return mk('press', 'SWITCH', aPress, !lock);
          if (aPressCome && full) return mk('cage', 'FIRE', aPressCome, fireOk && !lock);   // his hands are full: chase it off his cage
          if (aShown && !full) return mk('shown', 'SWITCH', aShown, !lock);
          if (waveReady && worth) return freeNear ? mk('waveLend', 'SWITCH', null, !lock) : mk('waveSafe', 'SHOCKWAVE');
          if (aSlip && !full) return mk('slip', 'SWITCH', aSlip, !lock);
          if (aCome && !full) return mk('come', 'SWITCH', aCome, !lock);
          return null;
        }
        // MASTER ZAVIER, PLAYED: what is at him, what is under him, what presses his cage; what the smell has shown; the
        // golden shockwave's lesson; what hides and what slips; then back to his teacher for what only his teacher can do.
        // A BIND asked for a Prai past his reach asks him to walk to it, as his teacher's FIRE and BAG do (L3-12: the mark
        // lit over the far one while the press bound another, or was refused "Nothing in reach")
        const bindAsk = (id, p, ok) => p && dist(z.x, z.z, p.x, p.z) > n.bindReach ? mk(id, 'BIND', p, false, true) : mk(id, 'BIND', p, ok);
        if (lentGo) return mk('waveGo', 'SWITCH', null, !lock);
        if (goldFirst && !(st.cage.lent > 0)) return mk('waveLend', 'LEND', null, !lock);
        if ((aHim || aHimSlip) && bindSoon) return bindAsk('athimB', aHim || aHimSlip, bindOk && !lock);
        if (aHim) return mk('athimSw', 'SWITCH', aHim, !lock);                // his BIND is far off: his teacher's fire chases it off
        if (aHimSlip && !full) return mk('athimB', 'BIND', aHimSlip, false);   // the fire cannot touch it: his BIND, as soon as it is back
        // (three bubbles already stand: his hands are full, and what frees one is his teacher's fire and bag, below)
        if (waveReady && bound && !(st.cage.lent > 0)) return mk(st.lesson.wave === 'pending' ? 'waveL' : 'waveLend', 'LEND', null, !lock);   // the gold, the way out
        if (aPress && bindSoon) return bindAsk('press', aPress, bindOk && !lock);
        if (aShown && (bindOk || (bindSoon && z.bindWait < aShown.show))) return bindAsk('shown', aShown, bindOk && !lock);
        if (pending) {
          if (!bound) { const t = bindTarget(st, 0); if (t && bindSoon) return mk('waveB', 'BIND', t, bindOk && !lock); }
          else if (!(st.cage.lent > 0)) return mk('waveL', 'LEND', null, !lock);
        }
        if (aSlip && bindSoon) return bindAsk('slip', aSlip, bindOk && !lock);
        if (aBound && !(st.hold > 0)) return mk('bound', 'SWITCH', aBound, !lock);
        if (aTired) {
          if (aKeep && bindOk) return bindAsk('keep', aKeep, !lock);
          if (!(st.hold > 0)) return mk('tired', 'SWITCH', aTired, !lock);
        }
        if (waveReady && worth && !(st.cage.lent > 0)) return mk('waveLend', 'LEND', null, !lock);
        if (aCome && bindSoon) return bindAsk('come', aCome, bindOk && !lock);
        return null;
      }
      /* (in the hold, a Prai that is not bound when the gold goes out is not gathered: the prompts above already bind what
         presses and what comes; the gold's own prompts are waveLend and waveGo) */
      function bagNeed(st, id, p, mk) {
        const n = st.n, ph = st.pho;
        const d = dist(ph.x, ph.z, p.x, p.z);
        return mk(id, 'BAG', p, st.lock <= 0 && !ph.ring && !(d < 0));   // (R71: no reach: never 'walk to it')
      }

      /* R62 (23 Nov 2026, Chad: "Have Zavier auto smell throughout the fight whenever needed so player does not have to
         micromanage the smell button"): HIS SMELL GOES OUT BY ITSELF, whoever is played, the moment it is needed: one under
         him at once; a hidden one that has begun to come on (its lurk over) once it has lain smellBeat under the paving, so
         its sinking is seen before it is found; the lesson's smellLesson after it sank. Never sooner than smellWait after the
         last (one under him aside), so each is one breath drawn in, never a flicker. It finds every hidden one at once, as the
         press did; with nothing hidden it never goes out, so nothing is opened for nothing (the draw and its cost are held at
         zero: v8.6) */
      function smellTick(st) {
        if (st.stage !== 'learn' && st.stage !== 'fight') return;
        const n = st.n, z = st.zav;
        let due = false;
        for (const p of st.prai) {
          if (p.st === 'beneath') { due = true; break; }
          if (p.st !== 'hidden' || z.smellWait > 0) continue;
          if (p.hold === 'hide') { if (p.t >= n.smellLesson) { due = true; break; } continue; }
          if (!(p.lurk > 0) && p.t >= n.smellBeat) { due = true; break; }
        }
        if (!due) return;
        z.smellWait = n.smellWait; st.stats.smells++;
        let k = 0;
        for (const p of st.prai) if (p.st === 'hidden' || p.st === 'beneath') {
          p.show = n.showSecs; if (p.hold === 'hide') p.hold = 'show';
          setSt(st, p, 'shown', 'smell'); k++;
        }
        st.ev.push({ e: 'smell', found: k, auto: true });
      }

      /* ------------------------------------------------------------------ ONE STEP OF THE FIGHT */
      const NONE = {};
      function step(st, input, dt, io) {
        st.ev.length = 0;
        const n = st.n;
        const inp = input || NONE;
        // the engine's own number, after its guards (v14.13); at the loss's line, the fight is lost (sanityTick)
        const fed = Number.isFinite(inp.sanity);
        if (fed) st.sanity = inp.sanity;
        if (fed && st.stage === 'fight' && st.sanity <= n.lostAt) { lose(st); st.cur = need(st); return st.ev; }
        dt = Number.isFinite(dt) ? Math.max(0, Math.min(n.dtMax, dt)) : 0;
        let act = inp.act || (inp.slot ? slotAct(st, inp.slot) : '');
        if (st.stage === 'brief' || st.stage === 'lost' || st.stage === 'won') {
          if (act) doAct(st, act, inp);
          if (st.stage === 'brief' || st.stage === 'lost' || st.stage === 'won') { st.cur = need(st); return st.ev; }
          act = '';
        }
        st.t += dt; st.stageT += dt;
        // the waits run on whoever is played (the switch is rewarded: what one began goes on while the other works)
        const ph = st.pho, z = st.zav;
        if (st.lock > 0) { st.lock = st.lockUntil - st.t; if (!(st.lock > 1e-9)) st.lock = 0; timed(st, 'lock', n.switchLock - st.lock); }
        if (st.drawT > 0) st.drawT = Math.max(0, st.drawT - dt);
        if (ph.fireWait > 0) ph.fireWait = Math.max(0, ph.fireWait - dt);
        if (z.bindWait > 0) z.bindWait = Math.max(0, z.bindWait - dt);
        if (z.smellWait > 0) z.smellWait = Math.max(0, z.smellWait - dt);
        if (ph.waveWait > 0 && st.stage === 'fight' && ph.wind <= 0 && !ph.ring) ph.waveWait = Math.max(0, ph.waveWait - dt);
        if (ph.draw > 0) ph.draw = Math.max(0, ph.draw - dt);
        if (act) doAct(st, act, inp);
        // the stick moves the one he plays, by the screen (never while the gold is gathered or the bag is drawing)
        const mx = +inp.mx || 0, mz = +inp.mz || 0;
        if (mx || mz) {
          if (isP(st)) { if (ph.wind <= 0 && ph.draw <= 0) moveBody(st, ph, z, n.phoWalk, mx, mz, dt); }
          else moveBody(st, z, ph, n.zavWalk, mx, mz, dt);
          const b = isP(st) ? ph : z;
          if (b.z < -2.0 && st.stage === 'fight') sayOnce(st, 'tn5c3');   // walked to the doorway where the three stand
        }
        aiTick(st, dt);
        flightsTick(st, dt);
        windTick(st, dt);
        ringTick(st, dt);
        praiTick(st, dt);
        smellTick(st);
        cageTick(st, dt);
        sanityTick(st, dt, fed);
        if (st.stage !== 'lost') stageTick(st, dt, io);
        st.cur = need(st);
        cueTick(st);
        if (st.stage !== 'lost') voiceTick(st, io);
        return st.ev;
      }
      /* (R110, 24 Nov 2026: Chad, "have some voicelines that tell player to use the shockwave ability at the right time, i
         think this is not clear enough to the user": the first time the moment asks for the shockwave itself (it is ready, Prai
         are bound, and it is the next press), his student calls it out once; his teacher's own orders for it go on as needs) */
      function cueTick(st) {
        if (st.stage !== 'fight' || st.said.q5fw1) return;
        const nd = st.cur;
        if (nd && (nd.id === 'waveSafe' || nd.id === 'waveGo')) sayOnce(st, 'q5fw1');
      }
      function slotAct(st, slot) {
        if (slot === 'swap') return 'SWITCH';
        if (slot === 'together') return 'TOGETHER';
        const s = SLOT[isP(st) ? 'pho' : 'zav'];
        return s[slot] || '';
      }

      /* ------------------------------------------------------------------ THE SCREEN (the plan's 5.6): each button, its
         face, whether it is on the screen (a button with nothing behind it is not offered: v12.5; a control appears when
         it is first needed), whether it can be pressed and why not (said, never pressed: v21.28), its wait as a ring,
         and whether the moment asks for it */
      function hud(st) {
        const n = st.n, P = isP(st), nd = st.cur, ph = st.pho, z = st.zav;
        const inPlay = st.stage === 'learn' || st.stage === 'fight' || st.stage === 'last';
        const waitOf = (act) => act === 'FIRE' ? ph.fireWait / n.fireWait : act === 'BIND' ? z.bindWait / n.bindWait :
          act === 'SMELL' ? z.smellWait / n.smellWait : (act === 'SHOCKWAVE' || act === 'LEND') ? ph.waveWait / (ph.waveFrom > 0 ? ph.waveFrom : n.waveWait) : 0;
        const btn = (slot, act, shown) => {
          const w = shown ? why(st, act) : 'stage';
          /* (R75's debug, GI: a button asks only when pressing it now does what is asked: never through its wait or a lock,
             nor while the need is to walk to it first) */
          return { slot, act, shown: !!shown, live: !w, why: w, wait: Math.max(0, Math.min(1, waitOf(act))), pulse: !!(nd && nd.act === act && nd.ready && !nd.move) };
        };
        const s = SLOT[P ? 'pho' : 'zav'];
        return {
          stage: st.stage, who: st.who, left: st.left, sanity: st.sanity, losses: st.losses,
          cage: { str: st.cage.str / n.cageMax, broken: st.cage.broken, lent: st.cage.lent > 0 },
          objective: objectiveOf(st),
          main: btn('main', s.main, inPlay && (P ? st.stage !== 'last' : st.seen.bind)),
          second: btn('second', s.second, !!s.second && st.stage === 'fight' && st.seen.shock),   // (R62: his teacher's alone)
          third: btn('third', s.third, inPlay && (P ? !!bagTarget(st, 0) : (st.seen.shock && ph.waveWait <= 0 && st.stage === 'fight'))),
          swap: { slot: 'swap', act: 'SWITCH', face: P ? 'zavier' : 'pho', shown: st.seen.swap && (st.stage === 'learn' || st.stage === 'fight'),
                  live: !why(st, 'SWITCH'), why: why(st, 'SWITCH'), wait: st.lock / n.switchLock, pulse: !!(nd && nd.act === 'SWITCH' && nd.ready && !nd.move) },
          together: { shown: st.stage === 'surge' && !st.joined, live: !why(st, 'TOGETHER'), fill: st.together ? 1 - st.together / n.togetherSecs : 0 },
          retry: { shown: st.stage === 'lost', lead: st.stage === 'lost' && st.losses >= 3 },
          bubbles: bubbles(st)
        };
      }
      function objectiveOf(st) {
        // the words are the chapter's (DATA.words, the sheet's): this names which, and the count it carries
        /* (`step`: the lesson's objective's place in its order, 1 to 4, and 5 for the fight it opens on, so the stage marks
           one COMPLETE only when the lesson goes forward: his fire on the Prai the smell had shown chases it to hiding
           again, and "Master Zavier: bind it." had shown COMPLETE as it was undone, L3-07, v8.7) */
        if (st.stage === 'learn') {
          const p = st.prai[0];
          const key = p.st === 'coming' || p.st === 'entering' ? 'objFight1' : p.st === 'hidden' || p.st === 'fleeing' ? 'objFight1b'
                    : p.st === 'shown' ? 'objFight2' : 'objFight2b';
          return { key, step: { objFight1: 1, objFight1b: 2, objFight2: 3, objFight2b: 4 }[key] };
        }
        /* (R110/R112: in a hold, and while the shockwave's own lesson waits, the order says the NEXT thing to do: bind them,
           then shield him the first time, then the shockwave; the words are the chapter's, a_head.js objFight3h/w/s/g) */
        if (st.stage === 'fight') {
          const hold = st.hold > 0, plain = { key: 'objFight3', n: st.left, step: 5 };
          if (!hold && st.lesson.wave !== 'pending') return plain;
          let bound = 0; for (const p of st.prai) if (p.st === 'bound' || p.st === 'held') bound++;
          const ph = st.pho, ready = st.seen.shock && ph.waveWait <= 0 && ph.wind <= 0 && !ph.ring;
          /* (the shockwave's lesson waits for one bound and the wave ready) */
          if (!hold && (!bound || !ready)) return plain;
          if (!bound) return { key: 'objFight3h', step: 5 };
          if (!ready) return { key: 'objFight3w', step: 5 };
          if (!st.firsts.wave && !(st.cage.lent > 0)) return { key: 'objFight3s', step: 5 };
          return { key: 'objFight3g', step: 5 };
        }
        if (st.stage === 'surge') return { key: 'objFight4' };
        // (the last three bagged, nothing is asked while his last line is said)
        if (st.stage === 'last') return st.left > 0 ? { key: 'objFight6' } : null;
        return null;
      }

      return Object.freeze({ NUM, STATES, STAGES, TIMED, NEEDLINES, ONCE, ONLOSS, LINES: LINES_SAID, SLOT,
                             create, step, need, hud, why });
    })();
