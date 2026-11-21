
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
    const RECEIPTS = { walk: ['t', 'j', 'd', 'e'], hunt: ['s1', 's2', 's3', 'a', 'n'], fight: [], table: ['m', 'k1', 'k2', 'k3'], ask: [] };
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
      phase = p; play.found = new Set(); worldPhase(p);           // (the world's hook: b_xpeople.js)
      if (kit) { kit.setPhase(p + ':'); kit.objective(null); kit.waypoint(null); }
    }

    /* ---------------------------------------------------------------- the light of each phase (the chapter's own
       presets; TODO-WORLD: the dusk going to night over the court is a tween of the film before the fight) */
    const LOOK_OF = { walk: 'DUSK', hunt: 'EVENING', fight: 'NIGHT', table: 'DAY', ask: 'DAY' };   // (the world's: the plan's 8.1 hours; EVENING is a_head.js's)
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
    /* a line of the script, by its key. WHO SAYS IT TALKS from the line's own start and rests after it (v11.4): his
       teacher standing or seated, Ton, Jun, Mr Koh, the collector at the table */
    const TALKER = { pho: () => { const S0 = castOf('phoS'); return S0 && S0.group.visible ? S0 : castOf('pho'); },
                     ton: () => castOf('ton'), jun: () => castOf('jun'), koh: () => castOf('koh'),
                     collector: () => { const C = castOf('col'); return C && C.group.visible ? C : null; } };
    function say(name) {
      const L = LINES[name]; if (!L) { console.warn('e4c5: no line ' + name + ' in the script'); queueLine(name); return; }
      const P = TALKER[L[0]] ? TALKER[L[0]]() : null;
      queueLine(name, P ? () => talk(P, SECS[name] || 2.5) : null);
    }
    /* what follows the lines now queued, once every one of them is done (v21.21); dropped if the phase has been left */
    function andThen(fn) { const run = play.run; queueFn(() => { if (live(run)) fn(); }); }
    /* a voice is speaking, or is waiting to (one voice at a time: v5.30) */
    const lineBusy = () => lineQ.length > 0 || !!speak.pending || dayClock.t < speak.until;
    /* the input, beside the order, for the device he is on (v18.5): no voice ever names one */
    const smellIn = () => TOUCH5 ? W.smellTouch : W.smellKey;

    /* ---------------------------------------------------------------- the orders (one at a time, after the lines that
       hand off to them: v21.21; COMPLETE only for what he did: v8.7; a count going up is not a completion). Each is
       derived on the frame from what is found (v11.6), and the next place is marked once it is the goal (v14.8) */
    function objectiveFor(opts = { complete: false }) {
      if (!kit || play.busy) return;
      let o = null, wp = null;
      if (phase === 'walk') {
        if (!asked()) o = W.objAsk;
        else { o = W.objFollow + '  ·  ' + smellIn(); if (walk5.wp) wp = SPOT.gate; }
      } else if (phase === 'hunt') {
        if (hunt5.pending && !visOpen()) o = W.objOpen;
        else if (stainsFound() < 3 || !play.found.has('n')) o = W.objHunt.replace('{n}', String(stainsFound()));
        if (hunt5.wp) { const q = nearestUnfound(); if (q) wp = { x: q.x, y: 0.9, z: q.z }; }
      } else if (phase === 'fight') { o = W.hotCleanse; wp = SPOT.court; }
      else if (phase === 'table') {
        if (!play.found.has('m')) o = W.objSmell + '  ·  ' + smellIn();
        else if (lookedN() < 3) o = W.objLook;
      }
      kit.objective(o, opts);
      kit.waypoint(wp);
    }
    /* what his sight is asked for: the eye asks to OPEN for it (urgeTick), and "When you feel better" is said only while
       there is still something to look at (strainTick) */
    function sightAsk() {
      if (phase === 'hunt') return !!hunt5.pending;
      if (phase === 'table') return play.found.has('m') && lookedN() < 3 && !play.busy;
      return false;
    }
    function sightNeeded() {
      if (phase === 'hunt') return stainsFound() < 3 || !play.found.has('n');
      if (phase === 'table') return play.found.has('m') && lookedN() < 3;
      return false;
    }

    /* ---------------------------------------------------------------- a film from play, and what it hands to. A film
       the engine will not play (not in play, or no such film) costs the film, never the story: its hand-off runs */
    function film(key, next) {
      const run = play.run, go = () => { if (live(run)) next(); };
      if (!kit || !kit.film || !kit.film(key, { onDone: go })) go();
    }
    /* A NEED'S PROMPTS (the plan's 7.1): while a need stands its line comes round again, never over another voice, in
       turn through its wordings; the times are seconds since the need began, the last one's gap repeating */
    function nagTick(N, live0, sinceT) {
      if (!N || !live0) return;
      const t = dayClock.t - sinceT;
      while (N.i < N.at.length && t >= N.at[N.i][0]) {
        if (play.busy || lineBusy()) return;                      // (it waits for any live voice, and is said then)
        const a = N.at[N.i++];
        if (a[1] === 'pulse') { if (N.pulse) N.pulse(); continue; }
        if (!a[2] || !heard.has(a[1])) say(a[1]);
      }
      if (N.i >= N.at.length && N.every) {
        if (N.next == null) N.next = t + N.every[0];
        if (t >= N.next && !play.busy && !lineBusy()) { say(N.every[1][N.k++ % N.every[1].length]); N.next = t + N.every[0]; }
      }
    }

    /* ================================================================ PLAY I · THE WALKWAY (the plan's 4.1)
       Told: "Something smells. Ask the others." with a mark on Ton and on Jun (a press each, v21.9). Both asked (either
       order), his teacher: "Your nose has opened..." and "Follow it. SMELL." and the SMELL button is his. The eye is not
       offered here: dimmed, and pressed it says why in his teacher's voice, once ("Not yet. First your nose."). The decoy,
       the drain, nine metres on; the true trail on round the turn to the gate; at the gate, the gate's two lines, and the
       devotee's film. RECEIPTS on the phase string: t Ton asked, j Jun asked, d the drain smelled, e the eye's line said */
    const walk5 = { given: -1, best: 0, maxS: 0, idle: 0, since: null, wp: false, tonCalled: false, nag: null, drain: false };
    const asked = () => play.found.has('t') && play.found.has('j');
    function walkBegin() {
      lookAt0(LOOK_OF.walk); castPhase('walk'); warm5('walk');
      if (kit && kit.vision) { kit.vision(null); kit.vision(false); }
      Object.assign(walk5, { given: -1, best: wayS(myX(), myZ()), maxS: 0, idle: 0, since: null, wp: false, tonCalled: false, nag: null, drain: false });
      smellButton(false);
      if (asked()) giveSmell();
      objectiveFor();
    }
    function askOne(c, P, lines) {
      if (phase !== 'walk' || play.busy || play.found.has(c)) return false;
      play.busy = true;
      if (P) { P.group.rotation.y = faceTo(P.group.position.x, P.group.position.z, myX(), myZ()); gaze(P, 'lens', { secs: 0.6, reach: 0.75 }); }
      for (const L of lines) { if (typeof L === 'number') queueGap(L); else say(L); }
      andThen(() => { play.busy = false; got(c);
        if (!asked()) { objectiveFor(); return; }
        play.busy = true;
        say('ph5w1');                                          // "Your nose has opened. They cannot smell it. You can."
        say('ph5w2');                                          // "Do not say what it is yet. Follow it. SMELL."
        andThen(() => { play.busy = false; giveSmell(); objectiveFor(); }); });
      return true;
    }
    function giveSmell() {
      smellButton(true); walk5.given = dayClock.t;
      /* SMELL not pressed: 8 s the button asks and his teacher says it; 20 s again in other words; Ton once; then every
         15 s, in turn (4.1; his R20 of chapter 4: a line "can keep repeating" while the thing is not done) */
      walk5.nag = { i: 0, k: 0, next: null, pulse: () => smellButton(true, { pulse: true }),
                    at: [[8, 'pulse'], [8, 'ph5w6'], [20, 'ph5w7'], [35, 'tn5w4', true]], every: [15, ['ph5w6', 'ph5w7']] };
    }
    function walkTick(wdt) {
      const sp = wayS(myX(), myZ());
      walk5.maxS = Math.max(walk5.maxS, sp);
      /* he walks on past six metres without asking: Ton calls, once; they come to him (walkersTick) */
      if (!asked() && !walk5.tonCalled && sp > 6 && !play.busy && !lineBusy()) { walk5.tonCalled = true; say('tn5w3'); }
      if (walk5.given < 0) return;
      if (smell.presses === 0) nagTick(walk5.nag, true, walk5.given);
      /* nothing done (no step on toward the gate) for 40 s: his teacher walks on ahead and waits at the gate, and the
         gate is marked; the gate is marked too once SMELL has gone unpressed for 20 s (the way on, 4.1) */
      /* (on the chapter's clock, as every wait of the play is: a sum of frame steps ran slow on a slow phone, where each
         step is capped, and his teacher never walked on in a probe at five seconds a frame) */
      if (sp > walk5.best + 0.5 || walk5.since == null) { walk5.best = Math.max(walk5.best, sp); walk5.since = dayClock.t; }
      walk5.idle = dayClock.t - walk5.since;
      if (!walk5.wp && (walk5.idle > 40 || (smell.presses === 0 && dayClock.t - walk5.given > 20))) { walk5.wp = true; objectiveFor(); }
      if (walk5.idle > 40) phoWalksAhead();
    }
    /* (his first press of the eye on the walkway: shut again at once, his teacher's word, and the eye held dimmed for
       the rest of it; a press after that is answered by the engine with the same words: words.visionHeld) */
    function walkEye() {
      if (!kit || !kit.vision) return;
      kit.vision(false);
      if (!play.found.has('e')) { got('e'); say('ph5w3'); return; }   // "Not yet. First your nose."
      /* (after his word, a press is answered with the same words on the screen: a lock always says why, v8.1. Not the
         engine's hold, kit.vision({ r }): held, the world is drawn through the vision's own pass at a radius of nothing,
         every frame of the walkway, and his teacher's gold showed through it) */
      if (kit.captions && !lineBusy()) kit.captions([{ at: 0, end: 2.2, text: W.visionHeld, sub: WHO.pho || '' }]);
    }
    function atDrain() {
      if (phase !== 'walk' || play.busy || play.found.has('d')) return false;
      play.busy = true;
      say('q5w2');                                             // "A drain. That one I understand."
      say('ju5w2');                                            // "That one even I can smell."
      say('ph5w4');                                            // "Good. Now the other one."
      andThen(() => { play.busy = false; got('d'); objectiveFor(); });
      return true;
    }
    function atGate() {
      if (phase !== 'walk' || play.busy || walk5.given < 0) return false;
      play.busy = true; if (kit) { kit.objective(null); kit.waypoint(null); }
      say('ph5w5');                                            // "The spiritual sense of your nose is already open. That is why it reached you, and not them."
      say('q5w3');                                             // "We were not even at his door."
      andThen(() => { play.busy = false; book('hunt'); film('devotee', () => huntBegin([])); });
      return true;
    }

    /* ================================================================ PLAY II · THE HUNT (the plan's 4.3)
       Told: "Find where the smell is strongest. 0/3". SMELL shows the way (a place is offered to press once a SMELL has
       shown it, or once the hints mark it); at each, the mark is pressed, the eye asks to be opened, he looks, and says
       what he perceives and where. The nine stand in the court, seen only in Spirit Vision: the first time his sight is
       open in the court (or with them in front of him) the wave runs out and they are there. The armchair: his nose
       behind the truth. All three found and the nine seen: his teacher's belief, and the film of the preparation.
       RECEIPTS: s1 s2 s3 the stains, a the armchair, n the nine seen. The count is derived on the frame, never stored */
    const hunt5 = { pending: null, since: 0, wp: false, shown: new Set(), hints: new Set(), nag: null };
    const PLACE_OF = { s1: { line: 'q5h1', hint: 'ph5h6' }, s2: { line: 'q5h2', hint: 'ph5h5' }, s3: { line: 'q5h3', hint: 'ph5h7' } };
    function huntBegin(found) {
      play.found = new Set(found); lookAt0(LOOK_OF.hunt); castPhase('hunt'); warm5('hunt');
      if (kit && kit.vision) kit.vision(null);
      smellButton(true);
      Object.assign(hunt5, { pending: null, since: dayClock.t, wp: false, nag: null }); hunt5.shown = new Set(); hunt5.hints = new Set();
      objectiveFor();
      if (stainsFound() === 3 && play.found.has('n')) huntDone();
    }
    /* what a SMELL has shown him (the places within the threads' reach of where he stood) */
    function huntSmelled() {
      for (const c of ['s1', 's2', 's3', 'a']) { const q = c === 'a' ? HUNT5.arm : HUNT5[c]; if (distTo(q.x, q.z) < (c === 's3' ? 11 : 7.5)) hunt5.shown.add(c); }
      hunt5.since = dayClock.t;
    }
    function lookHere(c) {
      if (phase !== 'hunt' || play.busy || play.found.has(c)) return false;
      if (!visOpen()) { hunt5.pending = c; objectiveFor(); return true; }   // (the eye asks: urgeTick)
      resolveLook(c); return true;
    }
    function resolveLook(c) {
      hunt5.pending = null; play.busy = true; if (kit) kit.waypoint(null);
      const nineNow = !play.found.has('n') && (inCourt(myX(), myZ(), 0.8) || c === 's2' || c === 's3');
      if (nineNow) nineLines(false);
      if (c === 'a') { say('ph5h4'); say('q5h5'); }           // "Nothing is there now. A smell stays after what made it has gone." / "My nose was sure."
      else say(PLACE_OF[c].line);
      andThen(() => { play.busy = false; got(c); if (nineNow) got('n'); hunt5.wp = false; hunt5.since = dayClock.t;
        if (huntReady()) { huntDone(); return; }
        if (nineNow && stainsFound() < 3) { play.busy = true; say('ph5h2'); andThen(() => { play.busy = false; objectiveFor(); }); return; }
        objectiveFor(); });
    }
    const huntReady = () => stainsFound() === 3 && play.found.has('n');
    /* "Nine Prai." (quietly, already beside him) "They were already there." */
    function nineLines(alone) {
      phoBeside();
      say('ph5h1'); say('q5h4');
      if (!alone) return;
      play.busy = true;
      if (stainsFound() < 3) say('ph5h2');                     // "Now find where it was poured."
      andThen(() => { play.busy = false; got('n'); hunt5.since = dayClock.t; if (huntReady()) huntDone(); else objectiveFor(); });
    }
    function huntTick() {
      const open = visOpen();
      /* a place pressed with his sight shut: it is looked at once his sight is open there; walked away from, let go */
      if (hunt5.pending) { const q = hunt5.pending === 'a' ? HUNT5.arm : HUNT5[hunt5.pending];
        if (distTo(q.x, q.z) > 4.2) { hunt5.pending = null; objectiveFor(); }
        else if (open && !play.busy && !lineBusy()) resolveLook(hunt5.pending); }
      if (open && !play.busy && !play.found.has('n') && (inCourt() || nineInView()) && !lineBusy()) nineLines(true);
      /* the order keeps up with his sight (the ask to open is the order while a place waits for it) */
      if (!play.busy) objectiveFor();
      /* HE IDLES (4.3): 12 s the SMELL button asks; 25 s his teacher names the nearest place by a thing on the screen;
         45 s that place is marked */
      if (play.busy || lineBusy()) return;
      const t = dayClock.t - hunt5.since, q = nearestUnfound();
      if (t > 12) smellButton(true, { pulse: true });
      if (t > 25 && q && !hunt5.hints.has(q.c)) { hunt5.hints.add(q.c); say(PLACE_OF[q.c].hint); }
      if (t > 45 && q && !hunt5.wp) { hunt5.wp = true; hunt5.shown.add(q.c); objectiveFor(); }
    }
    function huntDone() {
      play.busy = true; hunt5.pending = null;
      if (kit) { kit.objective(null); kit.waypoint(null); }
      say('ph5h3');                                            // "I believe somebody poured this here: the oil of nine Prai. I believe it was people who are angry with him."
      andThen(() => { play.busy = false; smellButton(false); book('fight'); film('prepare', () => fightBegin()); });
    }

    /* ================================================================ THE CLEANSING (the plan's 4.5 and 5; the tracker's M8)
       The tag-team fight in third person: masters/v28.0/parts/c_fightstage.js drives the fight's rules (c_fightrules.js,
       docs/V28.0-FIGHT.md) on the engine's tag mode (seams 60 to 65, docs/V28.0-SEAMS.md). Here are its hand-offs: the
       court set out and the mode opened behind the brief (whichever way he came: the preparation's film, or a Continue
       landing at the fight's phase, at its brief, since the mode holds the save from its opening), START, the Naga's film
       inside it, the loss that begins the FIGHT again (never the chapter: Chad's R14), and at the last bag the bag tied,
       the card of the next afternoon and the collector's film in. If the mode cannot open (no kit, no bodies), the
       skeleton's stand-in is offered instead (one thing to press in the court), so nothing soft-locks (v7.4) */
    function fightBegin() {
      lookName = 'TRANCE';
      if (!fightOpen()) { lookAt0(LOOK_OF.fight); objectiveFor({ complete: false }); return; }
      fightBrief();
    }
    function cleanse() {
      if (phase !== 'fight' || play.busy) return false;
      if (FS5.on) fightLeave();
      book('table');
      film('bagtied', () => film('collector', () => tableBegin([])));
      return true;
    }

    /* ================================================================ PLAY III · THE COLLECTOR (the plan's 4.7)
       Seated at the table (he looks; he does not walk). Told: "Something smells. SMELL." The threads rise from the
       pieces themselves (his thought). Then: "Open Spirit Vision. Look at the pieces." Three presences, each a look
       answered by a press, in any order. All three looked at: the doctor, heard before anything is decided ("Is it
       these?", his teacher to the man's face, "My wife says the same."), then the collector's question, and the
       decision opens on it. RECEIPTS: m he has smelled the pieces, k1 k2 k3 the three looked at */
    const table5 = { since: 0, smellNag: null, lookNag: null };
    const lookedN = () => ['k1', 'k2', 'k3'].filter(c => play.found.has(c)).length;
    /* seated on his cushion across the table from his teacher: the eye at a seated man's height, the look free about the
       table, his feet still (kit.pose 'lying' is the engine's way to hold the eye low; kit.root keeps him there) */
    /* (pitch: he looks down at the pieces on the cloth as play begins, what the play needs first in his line of sight, v12.3;
       a film that hands to the table ends on this look) */
    const SIT5 = { y: 1.02, span: 1.05, lo: -1.0, hi: 0.5, pitch: -0.38 };   // (R25: at -0.5 his teacher's face stood under the HUD's objective on a phone; -0.38 keeps it clear and the pieces in view)
    function seatHim() {
      if (!kit) return;
      yaw.position.set(STATION.table.at.x, yaw.position.y, STATION.table.at.z);
      yaw.rotation.y = STATION.table.at.ry; pitch.rotation.x = SIT5.pitch;
      if (kit.pose) kit.pose('lying', { y: SIT5.y, yaw: STATION.table.at.ry, span: SIT5.span, pitchLo: SIT5.lo, pitchHi: SIT5.hi, secs: 0.05 });
      if (kit.root) kit.root(true);
    }
    function tableBegin(found) {
      play.found = new Set(found); lookAt0(LOOK_OF.table); castPhase('table'); seatHim(); warm5('table');
      if (kit && kit.vision) kit.vision(null);
      smellButton(true);
      table5.since = dayClock.t;
      /* SMELL not pressed: 10 s the button asks; 25 s his teacher; then every 15 s (4.7) */
      table5.smellNag = { i: 0, k: 0, next: null, pulse: () => smellButton(true, { pulse: true }), at: [[10, 'pulse'], [25, 'ph5t5']], every: [15, ['ph5t5']] };
      /* his sight not opened once he has smelled them: 30 s "Look, so that you know what you are answering."; every 20 s */
      table5.lookNag = { i: 0, k: 0, next: null, at: [[30, 'ph5t6']], every: [20, ['ph5t6']] };
      objectiveFor();
      if (lookedN() === 3) tableQuestion();
    }
    function tableSmelled() {
      if (phase !== 'table' || play.found.has('m') || play.busy) return;
      play.busy = true;
      const run = play.run;
      after(1.0, () => { if (!live(run)) return; say('q5t1');  // "I caught it too. It was not coming from anywhere in the room. It was coming from them."
        andThen(() => { play.busy = false; got('m'); table5.since = dayClock.t; objectiveFor(); }); });
    }
    function lookPresence(c, line) {
      if (phase !== 'table' || play.busy || play.found.has(c) || !visOpen()) return false;
      play.busy = true;
      if (c === 'k1') pres.angry.flinch = 1;                   // (the angry one flinches when it is looked at)
      presSound(c);
      say(line);
      andThen(() => { play.busy = false; got(c); if (lookedN() === 3) tableQuestion(); else objectiveFor(); });
      return true;
    }
    function tableQuestion() {
      play.busy = true; if (kit) kit.objective(null);
      const run = play.run;
      after(0.6, () => { if (!live(run)) return;
        say('co5t3');                                          // "Is it these? Is this why I am sick?"
        say('ph5t4');                                          // "Your health: see a doctor. That comes first, whatever we find on this table. Both can be true."
        say('co5t4');                                          // "My wife says the same."
        queueGap(0.6);
        say('co5t5');                                          // "All right. But some of these must be fine. I chose them one by one."
        say('co5t6');                                          // "You. You can tell. Which ones can I keep?"
        andThen(() => { play.busy = false; smellButton(false); if (kit && kit.vision) kit.vision(false); book('ask'); askBegin(); }); });
    }
    function tableTick() {
      if (!play.found.has('m')) nagTick(table5.smellNag, smell.presses === 0 || true, table5.since);
      else if (lookedN() < 3) { const v = kit && kit.vision ? kit.vision() : null; nagTick(table5.lookNag, !(v && v.on) && sight.heat < 0.05, table5.since); }
    }

    /* ================================================================ THE DECISION (the plan's 4.8): he is asking you
       which ones he can keep. Not timed. It opens on his question, and again at the table after a step back (d_play.js:
       the pile is live only while the question stands). Read with his sight open, the eye is shut by the window first
       (6.2); after 30 s without an answer the collector says, once, "Take your time. I am not going anywhere." (wall
       time: the chapter's clock stands still under the window, d_play.js) */
    const ask5 = { wall: 0 };
    function openDecision() {
      decOpen = true;
      if (kit && kit.vision) kit.vision(false);
      if (getState() === 'play') startDecision();
    }
    function askBegin() {
      lookAt0(LOOK_OF.ask); castPhase('ask'); seatHim(); ask5.wall = 0;
      const run = play.run; after(0.6, () => { if (live(run)) openDecision(); });
    }
    function askPatience(wdt) {
      if (phase !== 'ask' || !decOpen || heard.has('co5t7')) return;
      ask5.wall += wdt;
      if (ask5.wall > 30) { heard.add('co5t7'); if (worldSfx && !(soundOff && soundOff())) worldSfx('co5t7', 1, 1, 0); }
    }

    /* ---------------------------------------------------------------- THE THINGS HE CAN PRESS (each offered only in its
       phase, only while no line is handing off, and never once it is done: derived, so a replay needs nothing put back).
       Every one a tap target on a phone (v12.5: its mark, or the thing itself), each tagged with the ground the walk test
       tries it in (v26.18: GROUNDS, b_xpeople.js) */
    const G_WALK = undefined, G_HUNT = GROUNDS[0].what, G_TABLE = GROUNDS[2].what;
    const headOf = (n, y = 1.62) => () => { const P = castOf(n); const g = P ? P.group.position : { x: 0, z: 0 }; return { x: g.x, y, z: g.z }; };
    const hsTon = { id: 'ton', pos: { x: STATION.walk.ton.x, y: 1.55, z: STATION.walk.ton.z }, radius: 3.0, prompt: W.hotTon, markY: 0.3, hits: markHit5(headOf('ton', 1.55), 0.12),
      enabled: () => phase === 'walk' && !play.busy && !play.found.has('t'), onInteract() { return askOne('t', castOf('ton'), ['q5w1', 'tn5w1', 0.7, 'tn5w2']); } };
    const hsJun = { id: 'jun', pos: { x: STATION.walk.jun.x, y: 1.55, z: STATION.walk.jun.z }, radius: 3.0, prompt: W.hotJun, markY: 0.3, hits: markHit5(headOf('jun', 1.55), 0.12),
      enabled: () => phase === 'walk' && !play.busy && !play.found.has('j'), onInteract() { return askOne('j', castOf('jun'), ['q5w1', 'ju5w1']); } };
    const stainSpot = (c, at, y) => ({ id: 'stain' + c.slice(1), pos: { x: at.x, y, z: at.z }, radius: 1.8, prompt: W.hotStain, markY: 0.2, ground: G_HUNT,
      hits: markHit5(() => ({ x: at.x, y: 0.1, z: at.z }), 0.1),
      enabled: () => phase === 'hunt' && !play.busy && !play.found.has(c) && hunt5.shown.has(c) && hunt5.pending !== c, onInteract() { return lookHere(c); } });
    const lookSpot5 = (c, k, line) => ({ id: 'look' + c.slice(1), pos: { x: TABLE5.P[k].x, y: TABLE5.P[k].y, z: TABLE5.P[k].z }, radius: 3, aim: 0.13, pressAim: true,
      markFar: 3, markY: 0.12, prompt: W.hotLook, ground: G_TABLE, hits: markHit5(presAt(k), 0.07),
      enabled: () => phase === 'table' && !play.busy && play.found.has('m') && visOpen() && !play.found.has(c), onInteract() { return lookPresence(c, line); } });
    const hotspots = [hsTon, hsJun,
      { id: 'drain', pos: { x: FLOOR.DRAIN.x, y: 0.9, z: FLOOR.DRAIN.z }, radius: 1.9, prompt: W.hotDrain, markY: 0.1, hits: markHit5(() => ({ x: FLOOR.DRAIN.x, y: 0.05, z: FLOOR.DRAIN.z }), 0.1),
        enabled: () => phase === 'walk' && !play.busy && walk5.drain && !play.found.has('d'), onInteract() { return atDrain(); } },
      { id: 'gate', pos: SPOT.gate, radius: 2.0, prompt: W.hotGate, markY: 0, hits: markHit5(() => ({ x: GATE.x, y: 1.0, z: WALK.turnZ }), 0.12),
        enabled: () => phase === 'walk' && !play.busy && walk5.given >= 0, onInteract() { return atGate(); } },
      stainSpot('s1', HUNT5.s1, 0.9), stainSpot('s2', HUNT5.s2, 0.9), stainSpot('s3', HUNT5.s3, 0.9),
      { id: 'armchair', pos: { x: HUNT5.arm.x, y: 1.0, z: HUNT5.arm.z }, radius: 1.8, prompt: W.hotStain, markY: 0.2, ground: G_HUNT, hits: markHit5(() => ({ x: HUNT5.arm.x, y: 0.7, z: HUNT5.arm.z }), 0.1),
        enabled: () => phase === 'hunt' && !play.busy && !play.found.has('a') && hunt5.shown.has('a') && hunt5.pending !== 'a', onInteract() { return lookHere('a'); } },
      { id: 'cleanse', pos: SPOT.court, radius: 2.0, prompt: W.hotCleanse,
        enabled: () => phase === 'fight' && !play.busy && FS5.fallback, onInteract() { return cleanse(); } },   // (only if the mode could not open)
      lookSpot5('k1', 'angry', 'ph5t1'), lookSpot5('k2', 'hungry', 'ph5t2'), lookSpot5('k3', 'energy', 'ph5t3')
    ];

    /* THE PLAY'S FRAME (d_play.js, in play only, after the line queue): the people who walk with him keep their marks; each
       phase's prompts; SMELL told of where he stood */
    function storyTick(wdt) {
      for (const [h, n] of [[hsTon, 'ton'], [hsJun, 'jun']]) { const P = castOf(n); if (P) { h.pos.x = P.group.position.x; h.pos.z = P.group.position.z; } }
      if (phase === 'walk') walkTick(wdt);
      else if (phase === 'hunt') huntTick();
      else if (phase === 'table') tableTick();
      else if (phase === 'fight') fightTick(wdt);               // (the cleansing's frame: c_fightstage.js)
    }
    /* what a press of SMELL means in each phase (c_play.js smellPress tells it) */
    smell.onPress = () => {
      if (phase === 'walk') {
        const sp = wayS(myX(), myZ());
        if (distTo(FLOOR.DRAIN.x, FLOOR.DRAIN.z) < 8) walk5.drain = true;     // (the drain is offered once a SMELL has shown it)
        if (walk5.maxS - sp > 4 && sp < 4.5 && !heard.has('q5w4') && !lineBusy()) { say('q5w4'); if (worldSfx) worldSfx('u5weaker', 0.6, 1, 0); }   // "Weaker here." (once)
      } else if (phase === 'hunt') huntSmelled();
      else if (phase === 'table') tableSmelled();
    };
    /* the engine tells the stage every time he opens or shuts his sight (stage.onVision) */
    function onVision(on) {
      if (phase === 'walk' && on) { walkEye(); return; }
      if (phase === 'hunt' || phase === 'table') objectiveFor();
    }

    /* ---------------------------------------------------------------- a phase set from outside (a probe; the walk
       test's later grounds) and a phase applied from the save (a Continue, the selector, a replay: every phase is
       covered, and anything else is the walkway) */
    function setPhase(p) { applyPhase(PHASES.includes(p) ? p : 'walk'); saveMark(); }
    function applyPhase(saved) {
      const R = readMark(saved);
      fightReset();                                            // (a fight left open is left: its mode, its brief, its loops)
      /* (a jump from one phase to another drops what the last one had queued: its lines, its timers, its busy hand-off:
         the v21.25 law, a phase jump leaves the line queue full) */
      phase = R.p; play.run++; play.busy = false; play.found = new Set(R.found); decOpen = false;
      worldPhase(R.p);                                         // (the world's hook: a Continue lands at the phase's start)
      lineQ.length = 0; speakReset(); dropTodo();
      if (kit && kit.captions) kit.captions(null);
      if (kit && kit.pose) kit.pose('standing', { secs: 0.05 });
      if (kit && kit.root) kit.root(false);
      smellButton(false); smell.t = -1;
      if (R.p === 'walk') walkBegin();
      else if (R.p === 'hunt') huntBegin(R.found);
      else if (R.p === 'fight') { castPhase('fight'); fightBegin(); }
      else if (R.p === 'table') tableBegin(R.found);
      else askBegin();
    }
    function storyReset() {
      fightReset();                                            // (the cleansing's own reset: c_fightstage.js)
      play.run++; play.busy = false; play.found = new Set(); decOpen = false;
      if (kit && kit.captions) kit.captions(null);
      lookAt0('DUSK');
    }
    function storySnap() { return { phase, found: [...play.found], busy: play.busy, decOpen, look: lookName, smell: smell.presses, smellT: +smell.t.toFixed(2), heat: +sight.heat.toFixed(3), pending: hunt5.pending, wp: walk5.wp || hunt5.wp,
                                     walkers: walkers.list.map(w => [w.n, w.ahead ? 1 : 0, +w.s.toFixed(2)]), walkIdle: +walk5.idle.toFixed(1), given: walk5.given, fight: fightSnap() }; }
