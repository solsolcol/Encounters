
    /* ================================================================ THE STORY'S SKELETON (the tracker's M5c)
       THE PHASES (the plan's 4: "each a save"): walk -> hunt -> fight -> table -> ask.
         walk   the walkway, from a step outside the lift to his gate (4.1)                              TODO-PLAY
         hunt   the home and its court: the three stains, the armchair, the nine (4.3)                   TODO-PLAY
         fight  THE CLEANSING: the tag team in third person, from its brief (4.5 and the whole of 5)     TODO-FIGHT
         table  the collector's pieces on the white cloth, the next afternoon (4.7)                      TODO-PLAY
         ask    the collector has asked: the decision is open, and opens again after a step back (4.8)
       A Continue lands at the START of its phase (the fight at its brief; after a loss, where the fight's own rules put
       him), and what was found in a phase rides the phase string, as chapter 4's history did: 'hunt:s1,s3' is the hunt
       with two stains found. The phase string is the save's only receipt (v7.3).
       BETWEEN THE PHASES, the films (z_tail.js): the opening before `walk`; `devotee` into the hunt; `prepare` into the
       fight; `together` inside it (the Naga); `bagtied` and then `collector` into the table. The next phase is BOOKED
       before its film begins (a film from play saves first: v21.1), so a game closed in the middle of a film comes back
       at the start of the phase the film hands to.
       IN THIS SKELETON each phase is one thing to press (three in the hunt), and what is pressed says the phase's own
       closing lines and hands on: so the whole chapter can be walked to its four endings, and nothing soft-locks. */
    const W = DATA.words;
    const PHASES = ['walk', 'hunt', 'fight', 'table', 'ask'];
    /* THE RECEIPTS a phase can carry on the phase string (the plan's 4.1, 4.3, 4.7). The skeleton writes the three
       stains; the others are named so that the play built here finds its letters waiting:
         walk   t Ton asked, j Jun asked, d the drain smelled
         hunt   s1 s2 s3 the three stains (the shoe cabinet, the planter's foot, the threshold), a the armchair, n the nine seen
         table  m he has smelled the pieces, k1 k2 k3 the three presences looked at (angry, hungry, looking for energy) */
    const RECEIPTS = { walk: ['t', 'j', 'd'], hunt: ['s1', 's2', 's3', 'a', 'n'], fight: [], table: ['m', 'k1', 'k2', 'k3'], ask: [] };
    const STAINS = ['s1', 's2', 's3'];
    const play = { run: 0, busy: false, found: new Set() };
    let phase = null, booted = false, decOpen = false, lookName = 'DUSK';
    const live = (run) => alive && run === play.run;
    const stainsFound = () => STAINS.filter(c => play.found.has(c)).length;

    function mark() { return (RECEIPTS[phase] || []).filter(c => play.found.has(c)).join(','); }
    function readMark(p0) {
      const [p1, tag = ''] = String(p0 || '').split(':');
      const p = PHASES.includes(p1) ? p1 : 'walk', f = new Set(tag.split(',').filter(Boolean));
      return { p, found: RECEIPTS[p].filter(c => f.has(c)) };
    }
    function saveMark() { if (kit) kit.setPhase(phase + ':' + mark()); }
    /* something found in this phase: its receipt and the save. The order follows from whoever calls (a count going up
       is not a completion, v8.7; the last of a count is, and whatever closes the count says so) */
    function got(c) { play.found.add(c); saveMark(); }
    /* A PHASE BOOKED: the phase string says it from now, with nothing found in it yet; the order that was up is done
       (COMPLETE, for what he did), and the new phase's order waits for whatever hands off to it (v21.21) */
    function book(p) {
      phase = p; play.found = new Set();
      if (kit) { kit.setPhase(p + ':'); kit.objective(null); kit.waypoint(null); }
    }

    /* ---------------------------------------------------------------- the light of each phase (the chapter's own
       presets; TODO-WORLD: the dusk going to night over the court is a tween of the film before the fight) */
    const LOOK_OF = { walk: 'DUSK', hunt: 'DUSK', fight: 'NIGHT', table: 'DAY', ask: 'DAY' };
    function lookAt0(name, secs = 0) { lookName = name; if (kit && kit.daylight) kit.daylight(PRESETS[name] || DUSK, secs); }

    /* ---------------------------------------------------------------- the chapter's clock and its one voice at a time
       (chapter 3's queue, as chapter 4 copies it). The clock runs in play only, on wall time, so a panel stands it
       still while a voice plays on (v21.21); the line queue and every timer of the play run on it. */
    const dayClock = { t: 0 };
    const todo = [];
    function after(secs, fn) { todo.push({ at: dayClock.t + secs, fn }); todo.sort((a, b) => a.at - b.at); }
    function runTodo() { while (todo.length && todo[0].at <= dayClock.t) todo.shift().fn(); }
    function dropTodo() { todo.length = 0; }
    const heard = new Set();
    const speak = { until: 0, pending: null, voiceTo: 0 };
    function speakReset() { speak.until = 0; speak.pending = null; speak.voiceTo = 0; }
    /* A LINE WHOSE TAKE HAS NOT LANDED IS SHOWN (TODO-VOICE): its words at the foot of the screen for its provisional
       length, under who says them, so the skeleton can be read. It shows ONLY when the line's bytes never came (the
       give-up below): the day a take lands under its key, the line is heard and its caption is gone, with nothing here
       to change. (The fight's own captions, on for every prompt whether or not the sound is, are the fight's: the
       plan's 7.1.) */
    function showLine(name) {
      const L = LINES[name];
      if (!L || !kit || !kit.captions) return;
      kit.captions([{ at: 0, end: (SECS[name] || 2.5) + 0.4, text: L[2], sub: WHO[L[0]] || '' }]);
    }
    /* A LINE IS A BEAT, HEARD OR NOT (e3c3's law): a muted game speaks it silently on its own length, a line whose bytes
       have not landed is held a moment (v8.0) and then spoken silently, so a beat chained on a line never stops */
    function sayLine(name, vol = 1, onStart, pan) {
      if (dayClock.t < speak.until) return false;
      const start = (silent) => { speak.voiceTo = dayClock.t + (SECS[name] || 2.5); speak.until = speak.voiceTo + 0.25; heard.add(name); if (silent) showLine(name); if (onStart) onStart(); };
      if ((soundOff && soundOff()) || !worldSfx) { start(false); return true; }
      if (worldSfx(name, vol, 1, pan)) { start(false); return true; }
      speak.pending = { name, vol, start, pan, give: dayClock.t + 1.6 };
      speak.until = dayClock.t + 0.2;
      return true;
    }
    function runSpeak() {
      const q = speak.pending;
      if (!q || dayClock.t < speak.until) return;
      if (soundOff && soundOff()) { speak.pending = null; q.start(false); return; }
      if (dayClock.t > q.give) { speak.pending = null; q.start(true); return; }
      if (worldSfx(q.name, q.vol, 1, q.pan)) { speak.pending = null; q.start(false); }
      else speak.until = dayClock.t + 0.2;
    }
    const lineQ = [];
    function queueLine(name, onStart, vol = 1, pan = 0) { lineQ.push({ name, onStart, vol, pan }); }
    function queueFn(fn) { lineQ.push({ fn }); }
    function queueGap(gap) { lineQ.push({ gap }); }
    function runQueue() {
      if (!lineQ.length || speak.pending || dayClock.t < speak.until) return;
      const q = lineQ.shift();
      if (q.fn) { q.fn(); return; }
      if (q.gap) { speak.until = dayClock.t + q.gap; return; }
      sayLine(q.name, q.vol, q.onStart, q.pan);
    }
    /* a line of the script, by its key (TODO-PLAY: who says it talks from its own start and rests after: v11.4) */
    function say(name) { if (!LINES[name]) console.warn('e4c5: no line ' + name + ' in the script'); queueLine(name); }
    /* what follows the lines now queued, once every one of them is done (v21.21); dropped if the phase has been left */
    function andThen(fn) { const run = play.run; queueFn(() => { if (live(run)) fn(); }); }

    /* ---------------------------------------------------------------- the orders (one at a time, after the lines that
       hand off to them: v21.21; COMPLETE only for what he did: v8.7). TODO-PLAY: the plan's own orders are in the words
       (objAsk, objFollow with its input, objHunt, objSmell, objLook) and the fight's in its draft; the skeleton shows
       only what its stand-ins can truthfully ask */
    function objectiveFor(opts) {
      if (!kit || play.busy) return;                           // a line is handing off: the order waits for it
      let o = null, wp = null;
      if (phase === 'walk') { o = W.objFollow; wp = SPOT.gate; }
      else if (phase === 'hunt') { if (stainsFound() < 3) o = W.objHunt.replace('{n}', String(stainsFound())); }
      else if (phase === 'fight') { o = W.hotCleanse; wp = SPOT.court; }
      else if (phase === 'table') { o = W.hotPieces; wp = SPOT.pieces; }
      kit.objective(o, opts);
      kit.waypoint(wp);
    }

    /* ---------------------------------------------------------------- a film from play, and what it hands to. A film
       the engine will not play (not in play, or no such film) costs the film, never the story: its hand-off runs */
    function film(key, next) {
      const run = play.run, go = () => { if (live(run)) next(); };
      if (!kit || !kit.film || !kit.film(key, { onDone: go })) go();
    }

    /* ================================================================ PLAY I · THE WALKWAY (the plan's 4.1) · TODO-PLAY
       To be built: the asks of Ton and Jun (q5w1, tn5w1, tn5w2, ju5w1), his teacher's two lines once both are asked
       (ph5w1, ph5w2) and the SMELL button with them; SMELL's threads; the drain, the decoy (q5w2, ju5w2, ph5w4); the
       true trail round the turn to the gate; the eye dimmed and saying why (ph5w3); the prompts while a need stands
       (ph5w6, ph5w7, tn5w3, tn5w4, q5w4); the followers who walk with him and are not solid to him.
       THE STAND-IN: the gate, at the end of the floor. Pressed, it says the gate's own two lines and hands to the
       devotee's film. */
    function walkBegin() { lookAt0(LOOK_OF.walk); objectiveFor({ complete: false }); }
    function atGate() {
      if (phase !== 'walk' || play.busy) return false;
      play.busy = true; if (kit) kit.waypoint(null);
      say('ph5w5');                                            // "The spiritual sense of your nose is already open. That is why it reached you, and not them."
      say('q5w3');                                             // "We were not even at his door."
      andThen(() => { play.busy = false; book('hunt'); film('devotee', () => huntBegin([])); });
      return true;
    }

    /* ================================================================ PLAY II · THE HUNT (the plan's 4.3) · TODO-PLAY
       To be built: SMELL and Spirit Vision at each of the three places (the mark pressed, the eye asked for, he looks, he
       closes: chapter 4's strain, ph5v1 and ph5v2); the nine, seen the first time his Spirit Vision is open in the court
       (ph5h1, q5h4, ph5h2), standing where he must search; the armchair, where his nose is behind the truth (ph5h4,
       q5h5); the hints (ph5h5 to ph5h7); every order of finding walked by a probe before it ships (chapter 4's R137).
       THE STAND-IN: three places on the floor, in any order; each says his own line of what he perceives and where.
       The count on the order is derived on the frame from what is found (v11.6). All three found: his teacher's belief,
       and the film of the preparation. */
    function huntBegin(found) { play.found = new Set(found); lookAt0(LOOK_OF.hunt); objectiveFor({ complete: false }); if (stainsFound() === 3) huntDone(); }
    function findStain(c, line) {
      if (phase !== 'hunt' || play.busy || play.found.has(c)) return false;
      play.busy = true;
      say(line);
      andThen(() => { play.busy = false; got(c); if (stainsFound() === 3) huntDone(); else objectiveFor({ complete: false }); });
      return true;
    }
    function huntDone() {
      play.busy = true; if (kit) { kit.objective(null); kit.waypoint(null); }
      say('ph5h3');                                            // "I believe somebody poured this here: the oil of nine Prai. I believe it was people who are angry with him."
      andThen(() => { play.busy = false; book('fight'); film('prepare', () => fightBegin()); });
    }

    /* ================================================================ THE CLEANSING (the plan's 4.5 and 5) · TODO-FIGHT
       To be built on the engine's third-person seams (the tracker's M4) and the fight's rules (c_fightrules.js, the
       tracker's M3a, when it is here): the brief with its looping picture and START (W.fightTitle, W.fightBrief1 to 3);
       the camera behind and above the played one; Grandmaster Pho with the Naga stick and Master Zavier in his cage;
       the nine; the switch; every prompt of the script's fight lines, each also a caption; the film `together` (the
       Naga) inside it; the loss, which begins the FIGHT again and never the chapter (W.lostSay, W.lostAgain); the mode
       holding the save from its opening until it is left for good, so a Continue lands at the brief.
       THE STAND-IN: one thing to press in the middle of the floor. It passes the fight, says nothing (every line of
       the fight is a draft), and hands to the film of the bag tied, the card of the next afternoon and the collector's
       film in. */
    function fightBegin() { lookAt0(LOOK_OF.fight); objectiveFor({ complete: false }); }
    function cleanse() {
      if (phase !== 'fight' || play.busy) return false;
      book('table');
      film('bagtied', () => film('collector', () => tableBegin([])));
      return true;
    }

    /* ================================================================ PLAY III · THE COLLECTOR (the plan's 4.7) · TODO-PLAY
       To be built: seated at the table (he looks; he does not walk); SMELL, the threads rising from the pieces (q5t1);
       Spirit Vision and the three presences, each a look answered by a press (ph5t1, ph5t2, ph5t3); the doctor, said to
       the man's face before anything is decided, so in every ending (co5t3, ph5t4, co5t4); the prompts (ph5t5, ph5t6);
       then the question.
       THE STAND-IN: the pieces, pressed. The collector looks down at his rows, and up at the student: his two lines,
       and the decision opens on the second. */
    function tableBegin(found) { play.found = new Set(found); lookAt0(LOOK_OF.table); objectiveFor({ complete: false }); }
    function atPieces() {
      if (phase !== 'table' || play.busy) return false;
      play.busy = true; if (kit) kit.waypoint(null);
      say('co5t5');                                            // "All right. But some of these must be fine. I chose them one by one."
      say('co5t6');                                            // "You. You can tell. Which ones can I keep?"
      andThen(() => { play.busy = false; book('ask'); askBegin(); });
      return true;
    }

    /* ================================================================ THE DECISION (the plan's 4.8): he is asking you
       which ones he can keep. Not timed. It opens here, and again at the table after a step back (d_play.js: the pile
       is live only while the question stands). TODO-PLAY: the collector's patience after 30 s (co5t7); the picture
       while he chooses (chapter 4's law: what he is asked about is seen while the choice is made) */
    function openDecision() {
      decOpen = true;
      if (getState() === 'play') startDecision();
    }
    function askBegin() { lookAt0(LOOK_OF.ask); const run = play.run; after(0.6, () => { if (live(run)) openDecision(); }); }

    /* ---------------------------------------------------------------- the things he can press (each offered only in
       its phase, only while no line is handing off, and never once it is done: derived, so a replay needs nothing put
       back). TODO-PLAY: every one is a stand-in */
    const hotspots = [
      { id: 'gate', pos: SPOT.gate, radius: 2.0, prompt: W.hotGate,
        enabled: () => phase === 'walk' && !play.busy, onInteract() { return atGate(); } },
      { id: 'stain1', pos: SPOT.stain1, radius: 1.8, prompt: W.hotStain,
        enabled: () => phase === 'hunt' && !play.busy && !play.found.has('s1'), onInteract() { return findStain('s1', 'q5h1'); } },
      { id: 'stain2', pos: SPOT.stain2, radius: 1.8, prompt: W.hotStain,
        enabled: () => phase === 'hunt' && !play.busy && !play.found.has('s2'), onInteract() { return findStain('s2', 'q5h2'); } },
      { id: 'stain3', pos: SPOT.stain3, radius: 1.8, prompt: W.hotStain,
        enabled: () => phase === 'hunt' && !play.busy && !play.found.has('s3'), onInteract() { return findStain('s3', 'q5h3'); } },
      { id: 'cleanse', pos: SPOT.court, radius: 2.0, prompt: W.hotCleanse,
        enabled: () => phase === 'fight' && !play.busy, onInteract() { return cleanse(); } },
      { id: 'pieces', pos: SPOT.pieces, radius: 2.0, prompt: W.hotPieces,
        enabled: () => phase === 'table' && !play.busy, onInteract() { return atPieces(); } }
    ];

    /* ---------------------------------------------------------------- a phase set from outside (a probe; the walk
       test's later grounds) and a phase applied from the save (a Continue, the selector, a replay: every phase is
       covered, and anything else is the walkway) */
    function setPhase(p) { applyPhase(PHASES.includes(p) ? p : 'walk'); saveMark(); }
    function applyPhase(saved) {
      const R = readMark(saved);
      /* (a jump from one phase to another drops what the last one had queued: its lines, its timers, its busy hand-off:
         the v21.25 law, a phase jump leaves the line queue full) */
      phase = R.p; play.run++; play.busy = false; play.found = new Set(R.found); decOpen = false;
      lineQ.length = 0; speakReset(); dropTodo();
      if (kit && kit.captions) kit.captions(null);
      if (R.p === 'walk') walkBegin();
      else if (R.p === 'hunt') huntBegin(R.found);
      else if (R.p === 'fight') fightBegin();
      else if (R.p === 'table') tableBegin(R.found);
      else askBegin();
    }
    function storyReset() {
      play.run++; play.busy = false; play.found = new Set(); decOpen = false;
      if (kit && kit.captions) kit.captions(null);
      lookAt0('DUSK');
    }
    function storySnap() { return { phase, found: [...play.found], busy: play.busy, decOpen, look: lookName }; }
