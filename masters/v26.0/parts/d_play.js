    /* ================================================================ THE PLAY (the plan's §4.1, §4.3, §9)
       Every beat on the chapter clock (wall time, v7.1); every line through the queue, one voice at a time; each beat's
       receipt in the phase string, so a Continue lands where a reload would. */
    const PHASES = ['arrive', 'baisri', 'tables', 'place', 'festival', 'seen', 'check', 'dawn', 'knelt', 'told', 'breath', 'taught', 'decide'];
    let phase = 'arrive';
    let booted = false;
    const dayClock = { t: 0 };
    let lastWall = 0;
    const todo = [];
    function after(secs, fn) { todo.push({ at: dayClock.t + secs, fn }); todo.sort((a, b) => a.at - b.at); }
    function runTodo() { while (todo.length && todo[0].at <= dayClock.t) todo.shift().fn(); }
    function dropTodo() { todo.length = 0; }
    const heard = new Set();
    const speak = { until: 0, pending: null, voiceTo: 0 };
    function speakReset() { speak.until = 0; speak.pending = null; speak.voiceTo = 0; }
    /* A LINE IS A BEAT, HEARD OR NOT (e3c3's law): a muted game speaks it silently on its own length, a line whose bytes
       have not landed is held a moment (v8.0) and then spoken silently, so a beat chained on a line never stops */
    function sayLine(name, vol = 1, onStart, pan) {
      if (dayClock.t < speak.until) return false;
      const start = () => { speak.voiceTo = dayClock.t + (SECS[name] || 2.5); speak.until = speak.voiceTo + 0.25; heard.add(name); if (onStart) onStart(); };
      if ((soundOff && soundOff()) || !worldSfx) { start(); return true; }
      if (worldSfx(name, vol, 1, pan)) { start(); return true; }
      speak.pending = { name, vol, start, pan, give: dayClock.t + 1.6 };
      speak.until = dayClock.t + 0.2;
      return true;
    }
    function runSpeak() {
      const q = speak.pending;
      if (!q || dayClock.t < speak.until) return;
      if (dayClock.t > q.give || (soundOff && soundOff())) { speak.pending = null; q.start(); return; }
      if (worldSfx(q.name, q.vol, 1, q.pan)) { speak.pending = null; q.start(); }
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

    const W = DATA.words;
    const play = { run: 0, busy: false };
    let decOpen = false;
    function mark() { return ''; }
    function readMark(p0) {
      const [p1] = String(p0 || '').split(':');
      return { p: PHASES.includes(p1) ? p1 : 'arrive' };
    }
    function setPhase(p, opts) { phase = p; if (kit) kit.setPhase(p + ':' + mark()); objectiveFor(p, opts); }
    function objectiveFor(p, opts) {
      if (!kit) return;
      let o = null, wp = null;
      if (p === 'arrive') { o = W.objTon; }
      kit.objective(o, opts);
      kit.waypoint(wp);
    }
    /* THE LOOK: which of the looks the ground wears (a preset of light, the painted shade, and what only that day draws) */
    let lookName = 'DAY1';
    function look(name, secs = 0) {
      if (kit) kit.daylight(PRESETS[name] || null, secs);
      lookName = name;
      const two = name === 'DAWN' || name === 'OPENED' || name === 'SHUT' || name === 'AFTERNOON' || name === 'DUSK';
      dayOne.visible = name === 'DAY1'; dayTwo.visible = two; nightG.visible = name === 'NIGHT';
      crowdSolid(dayOne.visible);
      paintShade(name === 'OPENED' || name === 'SHUT' ? 'DAWN' : name);
    }
    function openDecision() { decOpen = true; if (getState() === 'play') startDecision(); }

    /* ---------------------------------------------------------------- the decision: Grandmaster Pho, on his bench */
    const _ndc = new THREE.Vector3();
    const INTERACT_R = 3.4;
    const PILE_POS = new THREE.Vector3(PHO_AT[0], 0, PHO_AT[1]);              // (he is the chapter's pile: where he sits, not the bench's middle)
    const pile = new THREE.Group(); pile.position.copy(PILE_POS); world.add(pile);
    const pileLive = () => decOpen && phase === 'decide';
    function pileDist() { return Math.hypot(yaw.position.x - PILE_POS.x, yaw.position.z - PILE_POS.z); }
    function pileScreen() { camera.updateMatrixWorld(); return _ndc.set(PILE_POS.x, 1.0, PILE_POS.z).project(camera); }
    function pileInView() { if (!pileLive()) return false; const n = pileScreen(); return n.z < 1 && Math.abs(n.x) < 1.1 && Math.abs(n.y) < 1.1; }
    function pointerHitsPile() { return pileLive() && pileDist() < INTERACT_R; }
    function interactPile() { if (!pileLive()) return false; startDecision(); return true; }

    const hotspots = [];

    /* ---------------------------------------------------------------- the frame */
    function arriveBegin() { setPhase('arrive', { complete: false }); look('DAY1', 0); }
    function applyPhase(p0) {
      const R = readMark(p0);
      arriveBegin();
      return R;
    }
    let windClock = 0;
    function updateNotes(dt, t) {
      const st = getState();
      const now = wallNow(), wdt = lastWall ? Math.min(0.25, now - lastWall) : 0; lastWall = now;
      if (st !== 'cine') { windClock += wdt; windTick(windClock); peopleTick(wdt, true); peopleLevels(); lodTick(); }
      if (st !== 'play') return;
      if (!booted) { booted = true; applyPhase(kit ? kit.getPhase() : null); }
      dayClock.t += wdt;
      runTodo(); runSpeak(); runQueue();
    }
    function updatePile() {}
    function updateFire() {}
    function updateSlow() {}

