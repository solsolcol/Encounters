    /* ================================================================ THE STORY'S SKELETON (the tracker's M1; PLAY builds
       it out: M6, the plan's 8)
       THE PHASES (the plan's 8: "each a save"): room -> breaking -> night -> ask.
         room      her front room, the evening: the four orders, the four things to look at, Spirit Vision (8.1)  TODO-PLAY
         breaking  KEEP THE WATER STILL, briefed with START, three surges, never failed (8.2)                 TODO-PLAY
         night     three o'clock: the PRESSURE walk from his bed to his phone (8.3)                           TODO-PLAY
         ask       his phone in his hand at 3:03: the decision is open, and opens again after a step back (9.6)
       A Continue lands at the START of its phase, and what was found in a phase rides the phase string, as episode 4's
       did: 'room:w,l,p' is the room with the water poured, the candle lit and her phone looked at. The phase string is the
       save's only receipt (v7.3).
       BETWEEN THE PHASES, the films (z_tail.js): the opening before `room`; `keepsake` into the breaking; `cord` and then
       `home` into the night. The next phase is BOOKED before its film begins (a film from play saves first: v21.1), so a
       game closed in the middle of a film comes back at the start of the phase the film hands to. Each ending carries the
       barrier (its 9.7, with CLOSE THE CIRCLE inside it) and the dawn (its 9.9).
       IN THIS SKELETON each order is one thing to press, and what is pressed says its own lines and hands on: so the whole
       chapter can be walked to its four endings, and nothing soft-locks. */
    const W = DATA.words;
    const PHASES = ['room', 'breaking', 'night', 'ask'];
    /* THE RECEIPTS a phase can carry on the phase string (the plan's 8):
         room      w the water poured, l the candle lit, p her phone, g her reflection, h her hands, k the packet (and asked
                   where it is from), v Spirit Vision on Grace (the red line seen)
         breaking  (none: the event is one beat, and a Continue opens its brief again)
         night     u up out of bed, f his footsteps seen at the bedroom door */
    const RECEIPTS = { room: ['w', 'l', 'p', 'g', 'h', 'k', 'v'], breaking: [], night: ['u', 'f'], ask: [] };
    const LOOKS = ['p', 'g', 'h', 'k'];
    const play = { run: 0, busy: false, found: new Set() };
    let phase = null, booted = false, decOpen = false, lookName = 'LAMP';
    const live = (run) => alive && run === play.run;
    const looksFound = () => LOOKS.filter(c => play.found.has(c)).length;

    function mark() { return (RECEIPTS[phase] || []).filter(c => play.found.has(c)).join(','); }
    function readMark(p0) {
      const [p1, tag = ''] = String(p0 || '').split(':');
      const p = PHASES.includes(p1) ? p1 : 'room', f = new Set(tag.split(',').filter(Boolean));
      return { p, found: RECEIPTS[p].filter(c => f.has(c)) };
    }
    function saveMark() { if (kit) kit.setPhase(phase + ':' + mark()); }
    /* something found in this phase: its receipt and the save */
    function got(c) { play.found.add(c); saveMark(); }
    /* A PHASE BOOKED: the phase string says it from now, with nothing found in it yet; the order that was up is done, and
       the new phase's order waits for whatever hands off to it (v21.21) */
    function book(p) {
      phase = p; play.found = new Set();
      if (kit) { kit.setPhase(p + ':'); kit.objective(null); kit.waypoint(null); }
    }

    /* ---------------------------------------------------------------- the light of each phase (the chapter's own presets) */
    const LOOK_OF = { room: 'LAMP', breaking: 'LAMP', night: 'NIGHT', ask: 'NIGHT' };
    function lookAt0(name, secs = 0) { lookName = name; if (kit && kit.daylight) kit.daylight(PRESETS[name] || LAMP, secs); }

    /* ---------------------------------------------------------------- the chapter's clock and its one voice at a time
       (chapter 3's queue, as episode 4 copies it). The clock runs in play only, on wall time, so a panel stands it still
       while a voice plays on (v21.21); the line queue and every timer of the play run on it. */
    const dayClock = { t: 0 };
    const todo = [];
    function after(secs, fn) { todo.push({ at: dayClock.t + secs, fn }); todo.sort((a, b) => a.at - b.at); }
    function runTodo() { while (todo.length && todo[0].at <= dayClock.t) todo.shift().fn(); }
    function dropTodo() { todo.length = 0; }
    const heard = new Set();
    const speak = { until: 0, pending: null, voiceTo: 0 };
    function speakReset() { speak.until = 0; speak.pending = null; speak.voiceTo = 0; }
    /* A LINE WHOSE TAKE HAS NOT LANDED IS SHOWN (TODO-SOUND): its words at the foot of the screen for its provisional
       length, under who says them, so the skeleton can be read. It shows ONLY when the line's bytes never came (the give-up
       below): the day a take lands under its key, the line is heard and its caption is gone, with nothing here to change. */
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
    function say(name) { if (!LINES[name]) console.warn('e5c1: no line ' + name + ' in the script'); queueLine(name); }
    /* what follows the lines now queued, once every one of them is done (v21.21); dropped if the phase has been left */
    function andThen(fn) { const run = play.run; queueFn(() => { if (live(run)) fn(); }); }

    /* ---------------------------------------------------------------- the orders (one at a time, after the lines that
       hand off to them: v21.21; COMPLETE only for what he did: v8.7), each marked where it lives (v14.8) */
    function objectiveFor(opts) {
      if (!kit || play.busy) return;                           // a line is handing off: the order waits for it
      let o = null, wp = null;
      if (phase === 'room') {
        if (!play.found.has('w')) { o = W.objPour; wp = SPOT.jug; }
        else if (!play.found.has('l')) { o = W.objLight; wp = SPOT.lighter; }
        else if (looksFound() < 4) o = W.objWatch;
        else if (!play.found.has('v')) { o = W.objVision; wp = SPOT.grace; }
      }
      else if (phase === 'breaking') { o = W.evStillTitle; wp = SPOT.bowl; }
      else if (phase === 'night') {
        if (!play.found.has('u')) o = W.objGetUp;
        else { o = W.objPhone; wp = SPOT.phone; }
      }
      kit.objective(o, opts);
      kit.waypoint(wp);
    }

    /* ---------------------------------------------------------------- a film from play, and what it hands to. A film
       the engine will not play (not in play, or no such film) costs the film, never the story: its hand-off runs */
    function film(key, next) {
      const run = play.run, go = () => { if (live(run)) next(); };
      if (!kit || !kit.film || !kit.film(key, { onDone: go })) go();
    }

    /* WHERE THE STAND-INS LIE (each at the height a mark is read at: v7.5). TODO-WORLD: each becomes the thing itself */
    const SPOT = {
      jug:     { x: 0.35, y: 0.55, z: 0.25 },
      lighter: { x: -0.25, y: 0.55, z: 0.2 },
      phone:   { x: DATA.shrine.x, y: 0.85, z: DATA.shrine.z },
      grace:   { x: 0, y: 1.0, z: -1.4 },
      glass:   { x: ROOM.x1 - 0.05, y: 1.4, z: -0.6 },
      hands:   { x: 0.25, y: 0.6, z: -1.2 },
      packet:  { x: -0.4, y: 0.55, z: -1.15 },
      bowl:    { x: 0.2, y: 0.55, z: 0.15 },
      bed:     { x: 203.4, y: 0.9, z: 2.6 }
    };

    /* ================================================================ PLAY I · THE ROOM (the plan's 8.1) · TODO-PLAY
       To be built: kneeling at his place (he does not walk, as at chapter 5's table); the jug poured into the brass bowl,
       the lighter; the four things to look at, each a press on the thing itself (the aim dot on a desktop), each
       answered; the packet's question to Grace and her answer; Spirit Vision on Grace, the red line under the door;
       her two stand-ups on the phase's clock (40 s and 110 s: gr51r2, mk51r2, ph51r5; gr51r3 the second time).
       THE STAND-IN: one press for each order, in the plan's order; the four looks in any order. All found: the film of
       the keepsake. */
    function roomBegin(found) { play.found = new Set(found); lookAt0(LOOK_OF.room); objectiveFor({ complete: false }); if (roomDone()) roomEnd(); }
    const roomDone = () => ['w', 'l', 'v'].every(c => play.found.has(c)) && looksFound() === 4;
    function roomDo(c, lines) {
      if (phase !== 'room' || play.busy || play.found.has(c)) return false;
      play.busy = true; if (kit) kit.waypoint(null);
      for (const n of lines) say(n);
      andThen(() => { play.busy = false; got(c); if (roomDone()) roomEnd(); else objectiveFor({ complete: false }); });
      return true;
    }
    function roomEnd() {
      play.busy = true; if (kit) { kit.objective(null); kit.waypoint(null); }
      andThen(() => { play.busy = false; book('breaking'); film('keepsake', () => breakingBegin()); });
    }

    /* ================================================================ PLAY II · THE BREAKING (the plan's 8.2) · TODO-PLAY
       To be built: KEEP THE WATER STILL, the hold-it-steady event (`steady`) with its own picture (`bowl`: ENGINE, M2),
       briefed with START (W.evStillTitle, evStillTouch, evStillKey); three surges with the chant swelling; a surge out
       of the ring too long taken once more, once (ph51s1); never failed; Spirit Vision held open by the scene.
       THE STAND-IN: one press. Then the cord and the film of home, into three o'clock. */
    function breakingBegin() { lookAt0(LOOK_OF.breaking); objectiveFor({ complete: false }); }
    function still() {
      if (phase !== 'breaking' || play.busy) return false;
      book('night');
      film('cord', () => film('home', () => { worldPhase('night'); nightBegin([]); }));   // (TODO-FILM: home's own last picture puts him in bed)
      return true;
    }

    /* ================================================================ PLAY III · THREE O'CLOCK (the plan's 8.3) · TODO-PLAY
       To be built: waking in bed at 3:00; the pressure in waves (the eighty-first seam, kit.press: ENGINE, M2), the heart,
       the sound closing; the tip told once (W.tipPress); the knee at full pressure; Spirit Vision forced open for four
       seconds at the bedroom door, his own footsteps red (zv51n4); the trembling things (zv51n1 to zv51n3); the phone.
       THE STAND-IN: get up (a press by the bed), then the phone on the dining table. The phone pressed: the decision. */
    function nightBegin(found) { play.found = new Set(found); lookAt0(LOOK_OF.night); objectiveFor({ complete: false }); }
    function getUp() {
      if (phase !== 'night' || play.busy || play.found.has('u')) return false;
      play.busy = true;
      say('zv51n1');                                           // "Like my head was in a vice."
      andThen(() => { play.busy = false; got('u'); objectiveFor({ complete: false }); });
      return true;
    }
    function atPhone() {
      if (phase !== 'night' || play.busy || !play.found.has('u')) return false;
      book('ask'); askBegin();
      return true;
    }

    /* ================================================================ THE DECISION (the plan's 9.6): 3:03, his teacher's
       name on his phone's screen. Not timed; the world is held while the panel is open (v11.4). It opens here, and
       again at the table after a step back (d_play.js: the pile is live only while the question stands) */
    function openDecision() {
      decOpen = true;
      if (getState() === 'play') startDecision();
    }
    function askBegin() { lookAt0(LOOK_OF.ask); const run = play.run; after(0.6, () => { if (live(run)) openDecision(); }); }

    /* ---------------------------------------------------------------- the things he can press (each offered only in
       its phase, only while no line is handing off, and never once it is done: derived, so a replay needs nothing put
       back). TODO-PLAY: every one is a stand-in */
    const roomLive = () => phase === 'room' && !play.busy;
    const hotspots = [
      { id: 'jug', pos: SPOT.jug, radius: 1.8, prompt: W.hotJug,
        enabled: () => roomLive() && !play.found.has('w'), onInteract() { return roomDo('w', []); } },
      { id: 'lighter', pos: SPOT.lighter, radius: 1.8, prompt: W.hotLighter,
        enabled: () => roomLive() && play.found.has('w') && !play.found.has('l'), onInteract() { return roomDo('l', []); } },
      { id: 'phoneher', pos: SPOT.grace, radius: 2.6, prompt: W.hotPhone,
        enabled: () => roomLive() && play.found.has('l') && !play.found.has('p'), onInteract() { return roomDo('p', ['zv51r1', 'ph51r1']); } },
      { id: 'glass', pos: SPOT.glass, radius: 2.6, prompt: W.hotGlass,
        enabled: () => roomLive() && play.found.has('l') && !play.found.has('g'), onInteract() { return roomDo('g', ['zv51r2', 'ph51r2']); } },
      { id: 'hands', pos: SPOT.hands, radius: 2.6, prompt: W.hotHands,
        enabled: () => roomLive() && play.found.has('l') && !play.found.has('h'), onInteract() { return roomDo('h', ['zv51r3', 'ph51r3']); } },
      { id: 'packet', pos: SPOT.packet, radius: 2.6, prompt: W.hotPacket,
        enabled: () => roomLive() && play.found.has('l') && !play.found.has('k'), onInteract() { return roomDo('k', ['zv51r4', 'ph51r4', 'zv51r5', 'gr51r1', 'mk51r1']); } },
      { id: 'vision', pos: SPOT.grace, radius: 2.6, prompt: W.objVision,
        enabled: () => roomLive() && looksFound() === 4 && !play.found.has('v'), onInteract() { return roomDo('v', ['zv51r6']); } },
      { id: 'still', pos: SPOT.bowl, radius: 2.0, prompt: W.hotStill,
        enabled: () => phase === 'breaking' && !play.busy, onInteract() { return still(); } },
      { id: 'getup', pos: SPOT.bed, radius: 2.2, prompt: W.hotGetUp,
        enabled: () => phase === 'night' && !play.busy && !play.found.has('u'), onInteract() { return getUp(); } },
      { id: 'phone', pos: SPOT.phone, radius: 2.0, prompt: W.hotPhoneHis,
        enabled: () => phase === 'night' && !play.busy && play.found.has('u'), onInteract() { return atPhone(); } }
    ];

    /* ---------------------------------------------------------------- a phase set from outside (a probe; the walk
       test's later grounds) and a phase applied from the save (a Continue, the selector, a replay: every phase is
       covered, and anything else is the room) */
    function setPhase(p) { applyPhase(PHASES.includes(p) ? p : 'room'); saveMark(); }
    function applyPhase(saved) {
      const R = readMark(saved);
      /* (a jump from one phase to another drops what the last one had queued: its lines, its timers, its busy hand-off:
         the v21.25 law, a phase jump leaves the line queue full) */
      phase = R.p; play.run++; play.busy = false; play.found = new Set(R.found); decOpen = false;
      lineQ.length = 0; speakReset(); dropTodo();
      if (kit && kit.captions) kit.captions(null);
      worldPhase(R.p);
      if (R.p === 'room') roomBegin(R.found);
      else if (R.p === 'breaking') breakingBegin();
      else if (R.p === 'night') nightBegin(R.found);
      else askBegin();
    }
    function storyReset() {
      play.run++; play.busy = false; play.found = new Set(); decOpen = false;
      if (kit && kit.captions) kit.captions(null);
      lookAt0('LAMP');
    }
    function storySnap() { return { phase, found: [...play.found], busy: play.busy, decOpen, look: lookName }; }
