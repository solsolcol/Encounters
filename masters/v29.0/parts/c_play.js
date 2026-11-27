    /* ================================================================ THE PLAY (masters/v29.0/parts/c_play.js: PLAY's, M6;
       the plan's 8, its 9.6 and 9.10, its 12 and 13; masters/v29.0/PLAY.md writes out every number the films read)
       THE PHASES (the plan's 8: "each a save"): room -> breaking -> night -> ask.
         room      her front room, the evening: kneeling at his place by her windows (he does not walk, as at chapter 5's
                   table); the four orders one at a time; the four things to look at, each a press on the thing itself
                   (the aim dot on a desktop), each answered; Spirit Vision on Grace, the red line under her door; her two
                   stand-ups on the phase's clock (40 s and 110 s) (8.1)
         breaking  KEEP THE WATER STILL: the steady kind with its own picture (`bowl`), briefed with START; three surges of
                   8, 10 and 12 s, a surge taken once more at most, never failed; Spirit Vision held open (8.2)
         night     three o'clock: in bed, up by a press, then the PRESSURE walk to his phone: in waves, harder as he moves
                   or looks, easing as he stands; the tip told once; the knee at full pressure; Spirit Vision forced open
                   for four seconds at the bedroom door, his own footsteps red and the threads; the trembling things; the
                   phone picked up by a press (8.3)
         ask       his phone in his hand at 3:03: the decision (9.6), opened again at the table after a step back
       A Continue lands at the START of its phase, and what was found rides the phase string ('room:w,l,p': the water poured,
       the candle lit, her phone looked at). The phase string is the save's only receipt (v7.3).
       BETWEEN THE PHASES, the films (z_tail.js, FILMS-1): the opening before `room`; `keepsake` into the breaking; `cord`
       and then `home` into the night. The next phase is BOOKED before its film begins (a film from play saves first:
       v21.1), so a game closed in the middle of a film comes back at the start of the phase the film hands to. */
    const W = DATA.words;
    const PHASES = ['room', 'breaking', 'night', 'ask'];
    /* THE RECEIPTS a phase can carry on the phase string:
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
    const myX = () => yaw.position.x, myZ = () => yaw.position.z;
    const distTo = (x, z) => Math.hypot(myX() - x, myZ() - z);

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
      if (kit) { kit.setPhase(p + ':'); kit.objective(null); kit.waypoint(null); if (kit.visionUrge) kit.visionUrge(false); }
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
    const lineBusy = () => dayClock.t < speak.until || !!speak.pending || lineQ.length > 0;
    /* A LINE WHOSE TAKE HAS NOT LANDED IS SHOWN: its words at the foot of the screen for its length, under who says them.
       It shows ONLY when the line's bytes never came (the give-up below) */
    function showLine(name) {
      const L = LINES[name];
      if (!L || !kit || !kit.captions) return;
      kit.captions([{ at: 0, end: (SECS[name] || 2.5) + 0.4, text: L[2], sub: WHO[L[0]] || '' }]);
    }
    /* WHO SAYS IT TALKS FROM THE LINE'S OWN START and rests after (v11.4), and looks at whom he says it to */
    const SPEAKER = { ph: () => cast.pho, gr: () => cast.grace, mk: () => cast.marcus };
    function speakerStarts(name) {
      const L = LINES[name], f = L && SPEAKER[L[0]]; if (!f) return;
      const P = f(); if (!P || !P.ready || P.hidden) return;
      if (P.talkTake && !(P === cast.grace && grace5.up)) talk(P, SECS[name] || 2.5);
      gaze(P, 'lens', { secs: 0.7, reach: 0.7 });
      after((SECS[name] || 2.5) + 0.6, () => { if (P.gaze && P.gaze.target === 'lens') gazeRest(P); });
    }
    /* A LINE IS A BEAT, HEARD OR NOT (e3c3's law): a muted game speaks it silently on its own length, a line whose bytes
       have not landed is held a moment (v8.0) and then spoken silently, so a beat chained on a line never stops */
    function sayLine(name, vol = 1, onStart, pan) {
      if (dayClock.t < speak.until) return false;
      const start = (silent) => { speak.voiceTo = dayClock.t + (SECS[name] || 2.5); speak.until = speak.voiceTo + 0.25; heard.add(name); speakerStarts(name); if (silent) showLine(name); if (onStart) onStart(); };
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
    /* a line of the script, by its key */
    function say(name) { if (!LINES[name]) console.warn('e5c1: no line ' + name + ' in the script'); queueLine(name); }
    /* what follows the lines now queued, once every one of them is done (v21.21); dropped if the phase has been left */
    function andThen(fn) { const run = play.run; queueFn(() => { if (live(run)) fn(); }); }

    /* ================================================================ THE CHANT ACROSS THREE PIECES (the Ratana, ph51ratana:
       44.36 s, take c; its six verses on its breaths, lines.json `times`). It begins in the film of the keepsake at 32.0
       (FILMS-1 calls `stage.chant.begin()` in a step there), runs on under KEEP THE WATER STILL, and its last verse is
       under the first 8 s of the cord: ONE chant, never restarted, never a seam.
       HOW, AND WHY SO: the engine plays a sample only from its start (snd) and cuts a film's cues as the film ends
       (stopCineVoices), so the chant is the PLAY's, a world sound (worldSfx: on the effects path, never a voice bus; it
       outlives a film's end and is taken down at the title by stopWorldSfx). The take holds six verses, 34 s of which are
       left when the keepsake's film hands over; the event and its pauses are longer and the brief waits on the player. So
       Grandmaster Pho DRAWS BREATH AND WAITS at a breath between verses: the take's own playhead is held still exactly in
       the silence between two verses (the source's playback rate set to 0 on the audio clock, at the breath's middle, and
       to 1 again when the next verse may begin). Nothing is cut and nothing is played twice: it sounds like one man
       chanting, verse by verse, at the pace of the work. A verse is let go ("released") by the play:
         v1 (0.06 - 9.58)   at begin
         v2 .. v5           one at each surge's start (and the next too, while that surge has 4 s left and more verses are
                            left than surges); a surge taken once more takes one
         v6 (38.92 - 44.24) the last: 2.7 s after the event ends (so its last word lands at 8.0 s of the cord: the plan's 9.3)
       Each verse's caption (CHANTS.ph51ratana, the Pali over its meaning) is laid as its verse begins, on wall time, so it
       works muted (v21.31). Its level swells with each surge (its own gain, never over 1: v23.1). A probe reads it:
       `stage.chant.state()` */
    const RATANA = (() => {
      const KEY = 'ph51ratana', VERSES = [[0.06, 9.58], [10.0, 15.34], [15.74, 24.02], [24.46, 29.8], [30.18, 38.52], [38.92, 44.24]];
      const VOL = { base: 0.62, swell: 0.95 };
      const R = { on: false, src: null, pos: 0, rate: 1, released: 0, verse: -1, holdAt: null, vol: VOL.base, t0: 0, last: 0, done: false, finishAt: null };
      const capOf = (i) => { const c = CHANTS[KEY] && CHANTS[KEY][i]; return c ? [{ at: 0, end: VERSES[i][1] - VERSES[i][0] + 0.3, text: c[0], sub: c[1] }] : null; };
      const actxOf = () => (R.src && R.src.context) || null;
      const gapMid = (i) => (VERSES[i][1] + VERSES[i + 1][0]) / 2;      // the breath after verse i
      function setRate(r, when) {
        R.rate = r;
        const A = actxOf(); if (!A || !R.src || !R.src.playbackRate) return;
        try { const t = Math.max(A.currentTime, when || 0); R.src.playbackRate.cancelScheduledValues(A.currentTime); R.src.playbackRate.setValueAtTime(r, t); } catch {}
      }
      /* the hold at the breath after the last verse let go, on the audio clock (exact, whatever a frame takes) */
      function armHold() {
        const i = R.released - 1; if (i < 0 || i >= VERSES.length - 1) { R.holdAt = null; return; }
        R.holdAt = gapMid(i);
        const A = actxOf(); if (!A || !R.src) return;
        if (R.pos < R.holdAt && R.rate > 0) { try { R.src.playbackRate.cancelScheduledValues(A.currentTime); R.src.playbackRate.setValueAtTime(0, A.currentTime + (R.holdAt - R.pos)); } catch {} }
      }
      return {
        /* (the film of the keepsake, at 32.0; and the breaking itself on a Continue: it never begins twice) */
        begin() {
          if (R.on || R.done) return false;
          Object.assign(R, { on: true, pos: 0, rate: 1, released: 1, verse: -1, vol: VOL.base, last: wallNow(), finishAt: null });
          R.src = (worldSfx && !(soundOff && soundOff())) ? worldSfx(KEY, VOL.base, 1, 0) : null;
          armHold();
          return true;
        },
        /* a verse more may begin (the play: each surge) */
        release(n = 1) {
          if (!R.on) return;
          const was = R.released; R.released = Math.min(VERSES.length, R.released + n);
          if (R.released === was) return;
          if (R.rate === 0) { R.rate = 1; setRate(1, 0); }
          armHold();
        },
        /* the last verse, `at` seconds from now (wall time) */
        finish(at = 0) { if (R.on) R.finishAt = wallNow() + Math.max(0, at); },
        swell(on, secs = 1.2) {
          if (!R.on) return; R.vol = on ? VOL.swell : VOL.base;
          const A = actxOf(); if (!A || !R.src || !R.src.__g) return;
          try { const g = R.src.__g.gain, t = A.currentTime; g.cancelScheduledValues(t); g.setValueAtTime(g.value, t); g.linearRampToValueAtTime(R.vol, t + secs); } catch {}
        },
        left() { return R.on ? VERSES.length - R.released : 0; },
        stop() {
          if (R.src) { const A = actxOf(); try { if (A && R.src.__g) { const g = R.src.__g.gain, t = A.currentTime; g.cancelScheduledValues(t); g.setValueAtTime(g.value, t); g.linearRampToValueAtTime(0.0001, t + 0.4); } R.src.stop(A ? A.currentTime + 0.42 : 0); } catch {} }
          R.src = null; R.on = false; R.finishAt = null;
        },
        reset() { this.stop(); R.done = false; R.released = 0; R.verse = -1; R.pos = 0; },
        /* every frame (wall time): the playhead read as the audio has it (held at a breath, or running), each verse's caption
           laid as it begins, the end of the take */
        tick() {
          if (!R.on) return;
          const now = wallNow(), dt = Math.min(0.25, Math.max(0, now - R.last)); R.last = now;
          if (R.finishAt != null && now >= R.finishAt) { R.finishAt = null; this.release(VERSES.length); }
          if (R.rate > 0) { R.pos += dt * R.rate; if (R.holdAt != null && R.pos >= R.holdAt) { R.pos = R.holdAt; R.rate = 0; } }
          let v = -1; for (let i = 0; i < VERSES.length; i++) if (R.pos >= VERSES[i][0] - 0.02 && R.pos < VERSES[i][1]) v = i;
          if (v >= 0 && v !== R.verse) { R.verse = v; const cp = capOf(v); if (cp && kit && kit.captions) kit.captions(cp); }
          if (R.pos >= VERSES[VERSES.length - 1][1] + 0.15) { R.on = false; R.done = true; R.src = null; }
        },
        state() { return { on: R.on, done: R.done, pos: +R.pos.toFixed(2), rate: R.rate, released: R.released, verse: R.verse, holdAt: R.holdAt, sounding: !!R.src }; }
      };
    })();

    /* ---------------------------------------------------------------- the orders (one at a time, after the lines that
       hand off to them: v21.21; COMPLETE only for what he did: v8.7), each marked where it lives (v14.8) */
    function objectiveFor(opts) {
      if (!kit || play.busy) return;                           // a line is handing off: the order waits for it
      let o = null, wp = null, urge = false;
      if (phase === 'room') {
        if (!play.found.has('w')) { o = W.objPour; wp = SPOT.jug; }
        else if (!play.found.has('l')) { o = W.objLight; wp = SPOT.lighter; }
        else if (looksFound() < 4) o = W.objWatch;
        else if (!play.found.has('v')) { o = W.objVision; urge = true; }
      }
      else if (phase === 'night') {
        if (!play.found.has('u')) o = W.objGetUp;
        else { o = W.objPhone; wp = SPOT.phone; }
      }
      kit.objective(o, opts);
      kit.waypoint(wp);
      if (kit.visionUrge) kit.visionUrge(urge ? 'open' : false);
    }

    /* ---------------------------------------------------------------- a film from play, and what it hands to. A film
       the engine will not play (not in play, or no such film) costs the film, never the story: its hand-off runs */
    function film(key, next) {
      const run = play.run, go = () => { if (live(run)) next(); };
      unseat();
      if (!kit || !kit.film || !kit.film(key, { onDone: go, layFirst: true })) go();
    }

    /* ================================================================ WHERE HE IS AND WHAT HE PRESSES (each mark at the
       height it is read at: v7.5; each a press on the thing itself: v14.7, the aim dot on a desktop: the eightieth seam) */
    const SPOT = {
      jug:     { x: ON_CLOTH.jug.x, y: 0.42, z: ON_CLOTH.jug.z },
      lighter: { x: ON_CLOTH.lighter.x, y: CLOTH_Y + 0.12, z: ON_CLOTH.lighter.z },
      phone:   { x: DATA.shrine.x, y: 0.85, z: DATA.shrine.z },
      grace:   { x: HER.grace.x, y: 1.0, z: HER.grace.z },
      herPhone: { x: HER.grace.x - 0.33, y: HER.sofa.seat + 0.02, z: HER.grace.z + 0.1 },
      glass:   { x: MIRROR_X - 0.03, y: 1.12, z: 1.08 },            // her reflection on window B, as seen from his place (WORLD.md 1)
      packet:  { x: HER.bag.x + 0.02, y: HER.bag.y + 0.1, z: HER.bag.z },
      bowl:    { x: ON_CLOTH.bowl.x, y: CLOTH_Y + 0.1, z: ON_CLOTH.bowl.z },
      bed:     { x: HIS.getUp.x, y: 0.95, z: HIS.getUp.z },          // (where he will stand: the walk test reaches it)
      bedDoor: { x: HIS.bedDoor.x, z: HIS.bedDoor.z }
    };
    /* KNEELING AT HIS PLACE (the plan's 8.1, as chapter 5 seats him at its table: kit.pose 'lying' is the engine's way to hold
       the eye low, kit.root keeps him there). The look is free about the room from Grace on his right across the table to
       the glass on his left (82 degrees apart, WORLD.md 1), and down to the jug at his knee. Play begins looking at the cloth
       and Grace (what the play needs first in his line of sight, v12.3): the films that hand to the room end on this look */
    const KNEEL = { y: KNEEL_EYE, yaw: -0.15, span: 1.2, lo: -1.05, hi: 0.55, startYaw: 0.55, get pitch() { return isNarrow() ? -0.6 : -0.5; } };
    const LIE = { y: STATION.night.bed.y, yaw: 1.15, span: 1.3, lo: -0.35, hi: 1.3, startYaw: STATION.night.bed.ry, pitch: STATION.night.bed.pitch };
    let seated = null;
    function seatHim(at, P) {
      if (!kit) return;
      yaw.position.set(at.x, P.y, at.z);
      yaw.rotation.y = P.startYaw != null ? P.startYaw : P.yaw; pitch.rotation.x = P.pitch;
      if (kit.pose) kit.pose('lying', { y: P.y, yaw: P.yaw, span: P.span, pitchLo: P.lo, pitchHi: P.hi, secs: 0.05 });
      if (kit.root) kit.root(true);
      seated = P;
    }
    function unseat() { if (seated && kit) { if (kit.root) kit.root(false); } seated = null; }

    /* ================================================================ WHAT THE PLAY DRAWS (light without a lamp added: v9.4)
       THE WATER in the brass bowl (poured by the first order); HER PHONE on the sofa beside her, its screen lighting every
       20 s; and in SPIRIT VISION only (ctx.spirit: drawn in the vision's own layer, nowhere else) the spell's thin RED line
       from her chest along the floor and out under her door, a slow pulse travelling along it toward the door, taut when she
       stands and fraying with each flick of the fan; the packet's knot a dull red glow; at three o'clock his own footsteps
       and the threads. Red is the spell's alone (the plan's 4.5) */
    const RED = 0xff2233;
    const fx = { line: [], lineMats: [], knot: null, foot: [], threads: [], fray: 0, taut: 0, phoneLit: 0, water: null, waterK: 0 };
    /* the water: a disc inside the bowl's lip (the bowl's own measure: its rim's height and radius read off its model when it lands) */
    {
      const wm = new THREE.MeshBasicMaterial({ color: 0x9fb4c2, transparent: true, opacity: 0, depthWrite: false }); mats.push(wm);
      const wg = new THREE.CircleGeometry(1, 40); wg.rotateX(-Math.PI / 2);
      const w = new THREE.Mesh(wg, wm); w.visible = false; w.renderOrder = 2; world.add(w); fx.water = w;
      const sheen = new THREE.MeshBasicMaterial({ color: 0xffd49a, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }); mats.push(sheen);
      const sg = new THREE.CircleGeometry(0.16, 20); sg.rotateX(-Math.PI / 2);
      const sh = new THREE.Mesh(sg, sheen); sh.position.y = 0.002; w.add(sh); fx.sheen = sh;
    }
    const BOWLFIT = { r: 0.12, y: CLOTH_Y + 0.07, got: false };
    function bowlFit() {
      const b = things.holyBowl; if (!b || BOWLFIT.got || !b.userData.model) return;
      b.updateWorldMatrix(true, true); const bb = new THREE.Box3().setFromObject(b.userData.model); if (bb.isEmpty()) return;
      BOWLFIT.got = true; BOWLFIT.r = Math.max(0.05, 0.42 * Math.min(bb.max.x - bb.min.x, bb.max.z - bb.min.z)); BOWLFIT.y = bb.min.y + 0.72 * (bb.max.y - bb.min.y);
    }
    function waterTick(wdt) {
      bowlFit();
      const w = fx.water, want = play.found.has('w') || phase !== 'room' ? 1 : 0;
      fx.waterK += (want * (fx.pourT > 0 ? Math.min(1, 1 - fx.pourT / 2.0) : 1) - fx.waterK) * Math.min(1, wdt * 3);
      if (fx.pourT > 0) fx.pourT = Math.max(0, fx.pourT - wdt);
      const b = things.holyBowl, onCloth = b && b.visible && b.parent;
      w.visible = !!onCloth && fx.waterK > 0.01;
      if (!w.visible) return;
      w.position.set(b.position.x, BOWLFIT.y - 0.03 * (1 - fx.waterK), b.position.z); w.scale.setScalar(BOWLFIT.r * (0.85 + 0.15 * fx.waterK));
      w.material.opacity = 0.62 * fx.waterK;
      const lit = phase === 'room' && !play.found.has('l') ? 0.35 : 1;
      fx.sheen.material.opacity = 0.22 * fx.waterK * lit; fx.sheen.position.set(-0.25, 0.002, 0.2);
    }
    /* her phone, on the sofa's cushion beside her (her hands are on her bag's strap) */
    const herPhone = place('herPhone', 'w51phone', SPOT.herPhone.x, HER.sofa.seat - 0.005, SPOT.herPhone.z, 2.6);
    { const gm = new THREE.MeshBasicMaterial({ color: 0xbfe0ff, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending }); mats.push(gm);
      const gg = new THREE.PlaneGeometry(0.11, 0.2); gg.rotateX(-Math.PI / 2);
      const g = new THREE.Mesh(gg, gm); g.position.set(SPOT.herPhone.x, HER.sofa.seat + 0.025, SPOT.herPhone.z); g.rotation.y = 2.6; g.renderOrder = 3; world.add(g); fx.phoneGlow = g; }
    /* the red line (and the knot) in Spirit Vision: sixteen short lengths of one curve, each its own glow, so a pulse can run
       along it toward the door */
    const LINE_N = 16;
    const lineCurve = (chest, k) => new THREE.CatmullRomCurve3([
      chest, new THREE.Vector3(chest.x - 0.05, 0.42 + 0.06 * k, chest.z - 0.5), new THREE.Vector3(-0.35, 0.03, -1.25),
      new THREE.Vector3(-1.55, 0.02 + 0.04 * k, -1.95), new THREE.Vector3(-2.55, 0.02, -2.33), new THREE.Vector3(FRONT.x0 - 0.25, 0.015, HER.door.z)]);
    const lineChest = new THREE.Vector3(HER.grace.x, 0.9, HER.grace.z + 0.1), _lc = new THREE.Vector3();
    let lineBuilt = null;
    function lineBuild(force) {
      const key = lineChest.x.toFixed(2) + lineChest.y.toFixed(2) + lineChest.z.toFixed(2) + (fx.taut > 0.5 ? 't' : '');
      if (!force && key === lineBuilt) return; lineBuilt = key;
      const C = lineCurve(lineChest.clone(), fx.taut);
      for (let i = 0; i < LINE_N; i++) {
        const pts = []; for (let j = 0; j <= 4; j++) pts.push(C.getPoint((i + j / 4) / LINE_N));
        const g = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 4, 0.0065, 6, false);
        let m = fx.line[i];
        if (!m) { m = new THREE.Mesh(g, new THREE.MeshBasicMaterial()); m.frustumCulled = false; world.add(m); fx.line[i] = m;
          const sp = ctx.spirit ? ctx.spirit(m, { color: RED, fill: 0.55, rim: 1.2, flicker: 0.15, xray: 0.55 }) : null; fx.lineMats[i] = sp; }
        else { m.geometry.dispose(); m.geometry = g; }
      }
    }
    { const kg = new THREE.SphereGeometry(0.03, 12, 10), km = new THREE.Mesh(kg, new THREE.MeshBasicMaterial());
      km.position.set(SPOT.packet.x, SPOT.packet.y - 0.03, SPOT.packet.z); km.frustumCulled = false; world.add(km);
      fx.knot = ctx.spirit ? ctx.spirit(km, { color: RED, fill: 0.5, rim: 1.4, flicker: 0.3 }) : null; fx.knotMesh = km; }
    function graceChest(out) {
      const P = cast.grace, b = P && P.ready && (P.bone.Spine2 || P.bone['mixamorig:Spine2'] || P.bone.Spine1 || P.bone.Neck);
      if (b) { b.getWorldPosition(out); out.y -= 0.06; return out; }
      return out.set(HER.grace.x, 0.9, HER.grace.z + 0.1);
    }
    function lineTick(t) {
      const inRoom = phase === 'room' || phase === 'breaking';
      for (const m of fx.line) if (m) m.visible = inRoom;
      if (fx.knotMesh) fx.knotMesh.visible = inRoom;
      if (!inRoom) return;
      graceChest(_lc); if (_lc.distanceTo(lineChest) > 0.03) lineChest.copy(_lc);
      lineBuild(false);
      for (let i = 0; i < LINE_N; i++) { const sp = fx.lineMats[i]; if (!sp) continue;
        /* the pulse: a brighter swell running from her chest to the door every 1.15 s (52 a minute: M3's pulse) */
        const u = i / LINE_N, ph = ((t * 0.87 - u) % 1 + 1) % 1, pul = Math.exp(-Math.pow((ph - 0.5) / 0.12, 2));
        const fr = fx.fray > 0 ? (0.55 + 0.45 * Math.sin(t * 13 + i * 2.7)) : 1;
        sp.set('uAlpha', (0.55 + 0.45 * pul + 0.35 * fx.taut) * (1 - 0.6 * fx.fray * (1 - fr)) * (1 - 0.35 * fx.fray));
        sp.set('uFlick', 0.15 + 0.6 * fx.fray); }
      if (fx.knot) fx.knot.set('uAlpha', (0.55 + 0.25 * Math.sin(t * 2.2)) * (1 - 0.5 * fx.fray));
    }

    /* ================================================================ PLAY I · THE ROOM (the plan's 8.1)
       Kneeling; the jug poured into the brass bowl; the lighter; the four things to look at, each a press on the thing (the
       aim dot on a desktop), each answered; the packet's question to Grace and her answer; Spirit Vision on Grace, the red
       line under the door; her two stand-ups on the phase's clock (40 s and 110 s). All found: the film of the keepsake */
    const room5 = { t0: 0, ups: 0, phoneAt: 0 };
    const grace5 = { up: false, reflK: 0, reflWant: 0 };
    function roomBegin(found) {
      play.found = new Set(found); lookAt0(LOOK_OF.room); seatHim(STATION.room.at, KNEEL);
      if (kit && kit.vision) { kit.vision(null); kit.vision(false); }
      warm('room');
      room5.t0 = dayClock.t; room5.ups = 0; room5.phoneAt = dayClock.t + 6;
      things.holyBowl && (things.holyBowl.visible = true);
      if (WORLD.candleLit) WORLD.candleLit('candle2', play.found.has('l'));
      gazeRest(cast.pho); gazeRest(cast.marcus); gazeRest(cast.grace);
      objectiveFor({ complete: false });
      if (roomDone()) roomEnd();
    }
    const roomDone = () => ['w', 'l', 'v'].every(c => play.found.has(c)) && looksFound() === 4;
    /* a look answered: his thought and his teacher's word (or the packet's question), then the next order */
    function roomDo(c, lines, before) {
      if (phase !== 'room' || play.busy || play.found.has(c)) return false;
      play.busy = true; if (kit) kit.waypoint(null);
      if (before) before();
      for (const n of lines) { if (n === '|') queueGap(1.4); else say(n); }
      andThen(() => { play.busy = false; got(c); if (roomDone()) roomEnd(); else objectiveFor({ complete: false }); });
      return true;
    }
    /* THE FIRST TWO ORDERS: his hands at the jug and at the lighter (a reach of the hands' library), the water rising in the
       bowl, the candle catching (WORLD.candleLit) */
    function pour() {
      return roomDo('w', [], () => {
        if (kit.handPose) { kit.handPose('reach', 1, { secs: 0.5 }); after(2.2, () => { if (phase === 'room') kit.handPose(null, 0, { secs: 0.6 }); }); }
        fx.pourT = 2.0; sfx5('u51pour', 0.7); after(2.3, () => sfx5('u51brass', 0.4));
        queueGap(2.6);
      });
    }
    function lightCandle() {
      return roomDo('l', [], () => {
        if (kit.handPose) { kit.handPose('reach', 0.85, { secs: 0.4 }); after(1.8, () => { if (phase === 'room') kit.handPose(null, 0, { secs: 0.6 }); }); }
        sfx5('u51lighter', 0.7); after(0.9, () => { sfx5('u51wick', 0.6); if (WORLD.candleLit) WORLD.candleLit('candle2', true); });
        queueGap(1.8);
      });
    }
    /* HER PHONE lights up every 20 s (the plan's 8.1), buzzing; she leans toward the door (her look goes over her shoulder) */
    function phoneTick(wdt) {
      fx.phoneLit = Math.max(0, fx.phoneLit - wdt / 2.6);
      if (fx.phoneGlow) fx.phoneGlow.material.opacity = 0.75 * smo(c01(fx.phoneLit * 1.6));
      if (phase !== 'room' || dayClock.t < room5.phoneAt) return;
      room5.phoneAt = dayClock.t + 20;
      fx.phoneLit = 1; sfx5('u51buzz', 0.45, panTo(SPOT.herPhone.x, SPOT.herPhone.z));
      if (cast.grace && !grace5.up) { gaze(cast.grace, [HER.door.x, 1.0, HER.door.z], { secs: 0.8, reach: 0.8 }); const run = play.run; after(3.2, () => { if (live(run) && !grace5.up) gazeRest(cast.grace); }); }
      pullFor(3);
    }
    /* M3, the pull: heard wherever the pull is shown (her phone, her standing, the red line), a few seconds at a time */
    let pullTill = 0;
    function pullFor(secs) { pullTill = Math.max(pullTill, dayClock.t + secs); }
    /* HER TWO STAND-UPS (the plan's 8.1, on the phase's clock: 40 s and 110 s). Each time her reflection turns to the stairs
       first, then she stands (rise), "I should go."; Marcus "Grace, please."; Grandmaster Pho "Sit. A little longer."; she
       sits again (rise played back). The red line pulls taut while she is up. A stand-up waits for a line in progress */
    const UPS = [40, 110];
    function standTick() {
      if (phase !== 'room' || room5.ups >= UPS.length || grace5.up || play.busy || lineBusy() || roomDone()) return;
      if (dayClock.t - room5.t0 < UPS[room5.ups]) return;
      const n = room5.ups++, run = play.run, G = cast.grace;
      if (!G || !G.ready) return;
      grace5.up = true; grace5.reflWant = 1;                     // her reflection turns first
      play.busy = true; if (kit) kit.waypoint(null);
      const RISE = (G.acts.rise && G.acts.rise.getClip().duration) || 4.97;
      after(0.9, () => { if (!live(run)) return; sfx5('u51stand', 0.55, panTo(HER.grace.x, HER.grace.z)); pullFor(9);
        gaze(G, [HER.door.x, 1.2, HER.door.z], { secs: 1.0, reach: 0.85 });
        span(G, 'rise', 0, RISE - 0.05, 2.4, { hold: 0, fade: 0.35 }); });
      after(2.6, () => { if (!live(run)) return;
        say(n ? 'gr51r3' : 'gr51r2'); say('mk51r2'); say('ph51r5');
        andThen(() => { grace5.reflWant = 0; gaze(G, null, { secs: 1.0 });
          span(G, 'rise', RISE - 0.05, 0, 2.4, { fade: 0.3, then: (P) => { if (P === cast.grace) { rest(P, 0.5); } } });
          after(2.6, () => { if (!live(run)) return; grace5.up = false; play.busy = false; sfx5('u51sofa', 0.4, panTo(HER.grace.x, HER.grace.z)); objectiveFor({ complete: false }); }); }); });
    }
    /* her reflection, a beat ahead of her: the hook WORLD gives (WORLD.reflect.set 'grace' { face }: the turn her mirrored
       body faces in the room), eased on the wall clock */
    function graceReflTick(wdt) {
      grace5.reflK += (grace5.reflWant - grace5.reflK) * Math.min(1, wdt * 2.2);
      fx.taut += ((grace5.up ? 1 : 0) - fx.taut) * Math.min(1, wdt * 2.5);
      if (!WORLD.reflect || !WORLD.reflect.set) return;
      const G = cast.grace; if (!G) return;
      const g = G.group.position, door = Math.atan2(HER.door.x - g.x, HER.door.z - g.z), k = smo(c01(grace5.reflK));
      /* (at rest her reflection stands half turned to the stairs already, the plan's 9.1: "it faces the stairs"; on her
         stand-up it turns the rest of the way) */
      const rest0 = G.group.rotation.y, half = rest0 + angTo(rest0, door) * 0.55;
      if (phase === 'room' || phase === 'breaking') WORLD.reflect.set('grace', { face: half + angTo(half, door) * k });
    }
    /* THE LOOKS: her phone, her reflection, her hands, the packet (any order, once the candle is lit) */
    const _hv = new THREE.Vector3();
    const markHit = (posF, frac = 0.09) => function (x, y) {
      const p = posF(), r = Math.min(innerWidth, innerHeight) * frac;
      camera.updateMatrixWorld();
      const pts = [[p.x, p.y, p.z]];
      if (this && this.pos) pts.push([this.pos.x, (this.pos.y ?? 1.0) + (this.markY ?? 0.55), this.pos.z]);
      return pts.some(([px, py, pz]) => { _hv.set(px, py, pz).project(camera);
        return _hv.z < 1 && Math.hypot(x - (_hv.x * 0.5 + 0.5) * innerWidth, y - (-_hv.y * 0.5 + 0.5) * innerHeight) < r; });
    };
    const graceHands = { x: HER.grace.x + 0.15, y: 0.68, z: HER.grace.z + 0.12 };
    function handsTick() {
      const G = cast.grace; if (!G || !G.ready) return;
      const L = G.bone.LeftHand || G.bone['mixamorig:LeftHand'], R = G.bone.RightHand || G.bone['mixamorig:RightHand'];
      if (!L || !R) return; L.getWorldPosition(_hv); const ax = _hv.x, ay = _hv.y, az = _hv.z; R.getWorldPosition(_hv);
      graceHands.x = (ax + _hv.x) / 2; graceHands.y = (ay + _hv.y) / 2; graceHands.z = (az + _hv.z) / 2;
    }
    const lookLive = (c) => () => phase === 'room' && !play.busy && play.found.has('l') && !play.found.has(c) && !grace5.up;
    const lookSpot = (id, c, posF, lines, prompt) => ({ id, pos: posF(), radius: 3.2, aim: 0.2, pressAim: true, aimDot: true, markFar: 3.4, markY: 0,
      prompt, hits: markHit(posF, 0.075), enabled: lookLive(c), onInteract() { return roomDo(c, lines, () => { pullFor(4); lookFace(c); }); } });
    /* (while a look is answered, Grandmaster Pho turns his eyes to what was looked at, then to him for his word) */
    function lookFace(c) {
      const at = c === 'p' ? SPOT.herPhone : c === 'g' ? SPOT.glass : c === 'h' ? graceHands : SPOT.packet;
      gaze(cast.pho, [at.x, at.y, at.z], { secs: 0.8, reach: 0.7 });
      if (c === 'k') { const run = play.run; after(SECS.zv51r4 + SECS.ph51r4 + 0.6, () => { if (live(run)) gaze(cast.grace, 'lens', { secs: 0.8 }); }); }
    }
    /* SPIRIT VISION ON GRACE (the fourth order): the eye opened (a press), and the red line seen from her chest to the door */
    const visOpen = () => { const v = kit && kit.vision ? kit.vision() : null; return !!(v && v.on && !(v.held && v.held.lock)); };
    function visionTick() {
      if (phase !== 'room' || play.busy || play.found.has('v') || looksFound() < 4) return;
      const v = kit && kit.vision ? kit.vision() : null; if (!v || !v.on || !(v.k > 0.85)) return;
      graceChest(_hv); _hv.project(camera); if (!(_hv.z < 1 && Math.abs(_hv.x) < 0.9 && Math.abs(_hv.y) < 0.9)) return;
      pullFor(6); roomDo('v', ['zv51r6']);
    }
    function roomEnd() {
      play.busy = true; if (kit) { kit.objective(null); kit.waypoint(null); if (kit.visionUrge) kit.visionUrge(false); }
      andThen(() => { play.busy = false; if (kit && kit.vision) kit.vision(false); book('breaking');
        film('keepsake', () => breakingBegin()); });
    }

    /* ================================================================ PLAY II · THE BREAKING · KEEP THE WATER STILL (8.2)
       The hold-it-steady kind (episode 3 chapter 4's Yin locket, declared) with its own picture, `bowl`; briefed first with
       START (v8.7), nothing timed before it. The bowl in his hands (the hands' library's own `bowl`: the left palm under
       it, the right's fingertips over the water; a copy of Grandmaster Pho's own bowl, the water in it), the lens looking
       down into it (phone 50 / desk 44 degrees); the candle's light on the water is the mark. THREE SURGES of 8, 10 and 12
       s, each with the chant swelling; between them Grandmaster Pho dips his fan and flicks the water over Grace and the
       packet (the scene's part: nothing to press), and the red line frays. Out of the ring too long (the kind's own slip,
       1.6 s together): a little water spills, his teacher's hand comes under the bowl, "Slowly. Again.", and that surge is
       taken once more, ONCE in the whole breaking: from then on nothing slips, so it can never hold him (v7.4). Graded on
       the share of the time the light stayed in: it moves Sanity and Awareness only (v7.0). Spirit Vision held open */
    /* (the event's picture and the hands' pose are both named "bowl" in DOUBLE quotes: the same word in single quotes is
       another chapter's sound, and build.py reads a single-quoted name as this chapter asking for it) */
    const SURGE = [8, 10, 12];
    const BRK = { ring: 0.17, amp0: [0.28, 0.32, 0.36], amp1: [0.6, 0.72, 0.84], grace: 1.6, gap: 4.2 };
    const brk = { i: 0, retook: false, shares: [], spills: 0, on: false, held: null };
    function holdBowl(on) {
      if (!kit) return;
      if (!on) { if (brk.held) { if (kit.hold) kit.hold(null, { hand: 'left' }); brk.held = null; } if (kit.handPose) kit.handPose(null, 0, { secs: 0.4 });
        if (things.holyBowl) things.holyBowl.visible = true; return; }
      if (kit.handPose) kit.handPose("bowl", 1, { secs: 0.6, p: 0 });
      if (brk.held || !have('w4bigbowl')) return;
      parseOnce('w4bigbowl').then(({ scene: src }) => {
        if (!alive || phase !== 'breaking' || brk.held) return;
        const g = new THREE.Group(), m = src.clone(true); m.traverse(q => { if (q.isMesh) { q.material = q.material.clone(); mats.push(q.material); if (q.material.color) q.material.color.multiply(new THREE.Color(0xffd9a0)); q.frustumCulled = false; } });
        m.updateMatrixWorld(true); const bb = new THREE.Box3().setFromObject(m), cx = (bb.min.x + bb.max.x) / 2, cz = (bb.min.z + bb.max.z) / 2;
        m.position.set(-cx, -bb.min.y, -cz); g.add(m);
        const wm = new THREE.MeshBasicMaterial({ color: 0x9fb4c2, transparent: true, opacity: 0.62, depthWrite: false }); mats.push(wm);
        const r = 0.42 * Math.min(bb.max.x - bb.min.x, bb.max.z - bb.min.z), wg = new THREE.CircleGeometry(r, 40); wg.rotateX(-Math.PI / 2);
        const w = new THREE.Mesh(wg, wm); w.position.y = 0.72 * (bb.max.y - bb.min.y); g.add(w);
        const s2 = new THREE.MeshBasicMaterial({ color: 0xffd49a, transparent: true, opacity: 0.32, depthWrite: false, blending: THREE.AdditiveBlending }); mats.push(s2);
        const sg = new THREE.CircleGeometry(r * 0.28, 20); sg.rotateX(-Math.PI / 2); const sh = new THREE.Mesh(sg, s2); sh.position.set(-r * 0.25, w.position.y + 0.002, r * 0.2); g.add(sh);
        g.userData.water = w; g.userData.sheen = sh;
        g.scale.setScalar(BOWLHELD.s);
        brk.held = g;
        if (kit.hold) kit.hold(g, { hand: 'left', pos: BOWLHELD.pos, rot: BOWLHELD.rot });
        if (things.holyBowl) things.holyBowl.visible = false;
      }).catch(() => {});
    }
    /* where the bowl stands in his left hand (the hands' own frame: kit.hold's left), its size in it */
    const BOWLHELD = { pos: [0.075, 0.035, -0.02], rot: [0, 0, 0], s: 0.62 };
    function breakingBegin() {
      lookAt0(LOOK_OF.breaking); seatHim(STATION.room.at, Object.assign({}, KNEEL, { startYaw: STATION.room.at.ry, get pitch() { return -0.95; } }));
      warm('breaking');
      if (things.holyBowl) things.holyBowl.visible = true;
      if (WORLD.candleLit) WORLD.candleLit('candle2', true);
      Object.assign(brk, { i: 0, retook: false, shares: [], spills: 0, on: true });
      holdBowl(true);
      if (kit.lens) kit.lens(isNarrow() ? 50 : 44, { secs: 0.6 });
      if (kit.vision) { kit.vision(true); kit.vision({ lock: true, why: W.visionHeld }); }
      if (!RATANA.state().on) RATANA.begin();                  // (a Continue into the breaking: the chant begins at its start)
      gazeRest(cast.pho); gaze(cast.grace, null, { secs: 0.6 }); gaze(cast.marcus, [HER.grace.x, 1.0, HER.grace.z], { secs: 0.8 });
      objectiveFor({ complete: false });
      const run = play.run; after(0.4, () => { if (live(run)) surge(0, false); });
    }
    function surge(i, again) {
      if (phase !== 'breaking' || !kit || !kit.event) return;
      brk.i = i; const run = play.run, first = i === 0 && !again;
      kit.event({ kind: 'steady', label: W.evStillTitle, brief: first ? (TOUCHY ? W.evStillTouch : W.evStillKey) : undefined, demo: "bowl",
        prompt: W.evStillTitle,
        secs: SURGE[i], ring: BRK.ring, amp0: BRK.amp0[i], amp1: BRK.amp1[i], tug0: 0.35 + 0.1 * i, tug1: 0.7 + 0.15 * i, tugGap0: 2.0, tugGap1: 1.1,
        grace: brk.retook ? Infinity : BRK.grace, pass: 0.5, seed: 31 + i * 7 + (again ? 3 : 0), lead: 0.8,
        onBegin: () => { if (!live(run)) return; RATANA.release(1); RATANA.swell(true); sfx5('u51tremor', 0.45); if (kit.tremble) kit.tremble(0.35, { secs: 0.5 }); },
        onDrift: (k) => { if (kit.tremble) kit.tremble(0.25 + 0.6 * Math.min(1, k), { secs: 0.15 }); brk.drift = k; },
        onTug: () => { sfx5('u51tremor', 0.32 + 0.08 * i); }
      }).then(r => {
        if (!live(run) || !r || r.aborted) return;
        RATANA.swell(false); if (kit.tremble) kit.tremble(0, { secs: 0.6 });
        if (!r.ok && r.score === 0 && !brk.retook && !r.skipped && r.t < SURGE[i] - 0.05) { spill(i); return; }
        brk.shares.push(r.score);
        kit.award('awareness', Math.round(1 + 2 * r.score), { minigame: true });
        if (i < SURGE.length - 1) flick(i, () => surge(i + 1, false));
        else breakingDone();
      });
      /* (another verse while this surge still has four seconds and more verses are left than the surges to come) */
      const tAt = dayClock.t;
      const more = () => { if (!live(run) || phase !== 'breaking') return; const st = RATANA.state();
        if (st.on && st.rate === 0 && RATANA.left() > (SURGE.length - 1 - i) + 1 && dayClock.t - tAt < SURGE[i] - 4) RATANA.release(1); };
      for (const dt of [5.8, 9.0]) after(dt + (first ? 0 : 0), more);
    }
    /* out of the ring too long: the spill, his teacher's hand, "Slowly. Again.", the surge once more */
    function spill(i) {
      const run = play.run; brk.retook = true; brk.spills++;
      sfx5('u51spill', 0.6); kit.award('sanity', -4, { minigame: true });
      if (kit.flash) kit.flash({ color: 'rgba(170,190,210,0.18)', secs: 0.4 });
      gaze(cast.pho, 'lens', { secs: 0.5 }); say('ph51s1');
      andThen(() => { if (live(run)) after(0.6, () => { if (live(run)) surge(i, true); }); });
    }
    /* BETWEEN THE SURGES: the fan dipped and flicked over Grace and the packet (his seated toss of the left hand, the
       nearest take he has: people/RECORD.md 6), and the red line frays */
    function flick(i, next) {
      const run = play.run, P = cast.pho;
      sfx5('u51dip', 0.55, panTo(HER.pho.x, HER.pho.z));
      if (P && P.ready && P.acts.Sit_Cheer_with_Left_Hand) { const d = P.acts.Sit_Cheer_with_Left_Hand.getClip().duration;
        span(P, 'Sit_Cheer_with_Left_Hand', 0.2, Math.min(d - 0.05, 1.7), 1.3, { fade: 0.3, then: (Q) => after(0.4, () => { if (Q === cast.pho) rest(Q, 0.5); }) }); }
      gaze(P, [HER.grace.x, 0.9, HER.grace.z], { secs: 0.5 });
      after(1.2, () => { if (!live(run)) return; sfx5('u51flick', 0.6, panTo(HER.grace.x, HER.grace.z)); sfx5('u51fray', 0.45, panTo(HER.grace.x, HER.grace.z));
        fx.fray = Math.min(1, fx.fray + 0.34); });
      after(BRK.gap, () => { if (live(run)) { gazeRest(P); next(); } });
    }
    function breakingDone() {
      const run = play.run; brk.on = false;
      const share = brk.shares.length ? brk.shares.reduce((a, b) => a + b, 0) / brk.shares.length : 0;
      if (brk.spills === 0) kit.award('sanity', 3, { minigame: true });
      brk.share = +share.toFixed(3);
      RATANA.finish(2.7);                                      // its last verse lands its last word at 8.0 s of the cord
      book('night');
      after(0.3, () => { if (!live(run)) return; holdBowl(false); if (kit.lens) kit.lens(null, { secs: 0.3 }); if (kit.vision) { kit.vision(null); kit.vision(false); }
        film('cord', () => film('home', () => { worldPhase('night'); nightBegin([]); })); });
    }

    /* ================================================================ PLAY III · THREE O'CLOCK · THE PRESSURE WALK (8.3)
       He wakes in bed (the film of home leaves him lying there: STATION.night.bed). "Something is pressing on your head. Get
       up." (a press). "Get to your phone." (marked from the moment it is the goal). THE PRESSURE, 0 to 1, comes in WAVES, one
       every 7 to 9 s (up by 0.15 over 1.5 s, then back a little); it presses harder while he moves and while Spirit Vision is
       open, and eases slowly while he stands still. SEEN (kit.press: the picture pressed in from every edge, the colour
       draining there), FELT (kit.pulse: the heart on the HUD and the phone's buzz, 70 to 140 a minute) and HEARD (kit.hush:
       the world's sound closing down to his blood and his breath; M6's three layers entering at 0.2, 0.5 and 0.8; the
       tinnitus over 0.6). His steps slow as it rises. TOLD ONCE, plainly (a caption, no timer). NEVER A FAIL: at full
       pressure he sinks to one knee for two seconds and it falls back to 0.7. At the bedroom door the strongest wave forces
       Spirit Vision open for four seconds: his own footsteps red from the front door to his bed, thin red threads coming in
       under the front door and through the glass and following them. What he meets, each with its reason: the glass of
       water on his bedside trembling with each wave; the pictures in the passage tapping the wall; the glass doors ticking
       as if pressed from outside; the bottle of holy water on his altar trembling. At the table he picks up his phone: 3:03,
       his teacher's name. The decision */
    const PR = { up: 0.018, look: 0.03, ease: 0.035, floor: 0.12, waveUp: 0.15, waveRise: 1.5, waveKeep: 0.33, gap: [7, 9], knee: 2.0, after: 0.7, slow: 0.6 };
    const night5 = { p: 0, waves: [], nextWave: 0, kneeT: 0, tipSaid: false, forced: 0, said: new Set(), last: null, getUpT: 0, from: null, moving: 0, seed: 0x5101, waveN: 0, ask: false };
    function nRand() { night5.seed = (night5.seed + 0x6D2B79F5) | 0; let t = night5.seed; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }
    function nightBegin(found) {
      play.found = new Set(found); lookAt0(LOOK_OF.night); warm('night');
      Object.assign(night5, { p: found.includes('u') ? 0.3 : 0.18, waves: [], nextWave: dayClock.t + 2.5, kneeT: 0, tipSaid: found.includes('u'), forced: 0, said: new Set(), last: null, getUpT: 0, from: null, moving: 0, seed: 0x5101, waveN: 0, ask: false });
      if (WORLD.bedDoor) WORLD.bedDoor(1);
      if (kit && kit.vision) { kit.vision(null); kit.vision(false); }
      footSet(found.includes('f') ? 1 : 0);
      if (found.includes('u')) { unseat(); if (kit.pose) kit.pose('standing', { secs: 0.05 }); const a = STATION.night.at; yaw.position.set(a.x, yaw.position.y, a.z); yaw.rotation.y = a.ry; pitch.rotation.x = -0.05; }
      else seatHim(STATION.night.bed, LIE);
      if (kit.pulse) kit.pulse({ bpm: 82, secs: 2, sound: 'u51heart', vol: 0.5 });
      objectiveFor({ complete: false });
    }
    function getUp() {
      if (phase !== 'night' || play.busy || play.found.has('u')) return false;
      play.busy = true; const run = play.run, a = STATION.night.at;
      night5.getUpT = 1.4; night5.from = { x: myX(), z: myZ(), ry: yaw.rotation.y, pitch: pitch.rotation.x };
      unseat(); if (kit.pose) kit.pose('standing', { secs: 1.4 }); if (kit.root) kit.root(true);
      sfx5('u51floor', 0.5);
      after(1.5, () => { if (!live(run)) return; if (kit.root) kit.root(false); play.busy = false; got('u'); objectiveFor({ complete: false });
        night5.nextWave = Math.min(night5.nextWave, dayClock.t + 1.5); });
      return true;
    }
    /* the rise from the bed to where he stands (eased on the wall clock), the look turned to the bedroom door */
    function getUpTick(wdt) {
      if (!(night5.getUpT > 0) || !night5.from) return;
      night5.getUpT = Math.max(0, night5.getUpT - wdt); const k = smo(1 - night5.getUpT / 1.4), F = night5.from, a = STATION.night.at;
      yaw.position.x = lp(F.x, a.x, k); yaw.position.z = lp(F.z, a.z, k);
      yaw.rotation.y = F.ry + angTo(F.ry, a.ry) * k; pitch.rotation.x = lp(F.pitch, -0.05, k);
      if (night5.getUpT === 0) night5.from = null;
    }
    /* a wave: up by 0.15 over 1.5 s, then back a third of it (a stronger one at the bedroom door) */
    function waveAt(k) { night5.waves.push({ t: 0, k }); night5.waveN++; waveMeets(); }
    function waveVal(w) { const r = PR.waveRise; return w.t < r ? smo(w.t / r) : PR.waveKeep + (1 - PR.waveKeep) * Math.exp(-(w.t - r) / 1.2); }
    let lastPos = null;
    function pressureTick(wdt) {
      if (phase !== 'night' && phase !== 'ask') { lastPos = null; return; }
      const asking = phase === 'ask';
      /* how much he moved this frame (and his steps slowed by the pressure: the walk is the engine's, so the step is taken
         back by the share the pressure asks, along the line he just walked, which he has already been through) */
      const x = myX(), z = myZ();
      if (lastPos && phase === 'night' && !(night5.getUpT > 0) && !seated) {
        const dx = x - lastPos.x, dz = z - lastPos.z, d = Math.hypot(dx, dz);
        const f = 1 - PR.slow * night5.p;
        if (d > 1e-5 && d < 0.6 && f < 1) { yaw.position.x = lastPos.x + dx * f; yaw.position.z = lastPos.z + dz * f; }
        night5.moving = d / Math.max(1e-3, wdt);
      } else night5.moving = 0;
      lastPos = { x: yaw.position.x, z: yaw.position.z };
      const up = play.found.has('u');
      if (!asking) {
        /* the waves, on the chapter's clock */
        if (dayClock.t >= night5.nextWave) { night5.nextWave = dayClock.t + PR.gap[0] + (PR.gap[1] - PR.gap[0]) * nRand(); waveAt(PR.waveUp); }
        const moving = night5.moving > 0.25, look = visOpen();
        let base = night5.p - night5.waves.reduce((s, w) => s + w.k * waveVal(w), 0);
        if (night5.kneeT > 0) { night5.kneeT = Math.max(0, night5.kneeT - wdt); if (night5.kneeT === 0) kneeUp(); }
        else base += ((moving ? PR.up : 0) + (look ? PR.look : 0) - (!moving && !look ? PR.ease : 0)) * wdt * (up ? 1 : 0.4);
        base = Math.max(PR.floor, Math.min(1.2, base));
        for (const w of night5.waves) w.t += wdt;
        /* a wave's rise spent, what it keeps goes into the base */
        night5.waves = night5.waves.filter(w => { if (w.t > PR.waveRise + 5) { base += w.k * PR.waveKeep; return false; } return true; });
        night5.p = Math.min(1, base + night5.waves.reduce((s, w) => s + w.k * waveVal(w), 0));
        if (night5.p >= 0.999 && !(night5.kneeT > 0) && up && !(night5.getUpT > 0)) kneeDown();
        if (up && !night5.tipSaid && night5.waveN >= 1 && !lineBusy()) { night5.tipSaid = true; if (kit.captions) kit.captions([{ at: 0, end: 7, text: W.tipPress, sub: '' }]); }
      }
      /* SEEN, FELT, HEARD (nothing presses under a panel: v11.4 — at the decision it stands where it was, no waves) */
      const p = night5.p;
      if (kit.press) kit.press(p, { secs: 0.12 });
      if (kit.pulse) kit.pulse({ bpm: 70 + 70 * p, secs: 1.5, erratic: p > 0.8 ? 0.25 : 0, sound: 'u51heart', vol: 0.35 + 0.3 * p });
      if (kit.hush) kit.hush(Math.min(0.85, p * 0.95), { secs: 0.25, floor: 1 - 0.45 * p });
      if (kit.lens) kit.lens(72 - 10 * p, { secs: 0.3 });
    }
    /* full pressure: down on one knee for two seconds, and it falls back to 0.7 (never a fail: v7.4) */
    function kneeDown() {
      night5.kneeT = PR.knee; sfx5('u51knee', 0.7);
      if (kit.pose) kit.pose('lying', { y: 0.95, yaw: yaw.rotation.y, span: 3.2, pitchLo: -0.9, pitchHi: 0.6, secs: 0.5 });
      if (kit.root) kit.root(true);
      if (kit.buzz) kit.buzz([40, 60, 40]);
    }
    function kneeUp() {
      night5.p = PR.after; night5.waves = [];
      if (kit.pose) kit.pose('standing', { secs: 0.9 });
      if (kit.root && !seated) kit.root(false);
    }
    /* WHAT HE MEETS, with each wave (and once each, his thought: "Like my head was in a vice." after he is up; "Not a
       headache..." in the passage; "The water I brought home was shaking." where the bottle is) */
    const shake = new Map();
    function shakeThing(o, k, secs = 1.6) { if (!o) return; const s = shake.get(o) || { t: 0, k: 0, base: o.position.clone(), rot: o.rotation.clone() }; s.t = secs; s.k = Math.max(s.k, k); shake.set(o, s); }
    function shakeTick(wdt, t) {
      for (const [o, s] of shake) { s.t = Math.max(0, s.t - wdt);
        const a = s.k * (s.t / 1.6);
        o.position.set(s.base.x + Math.sin(t * 61) * 0.0025 * a, s.base.y + Math.abs(Math.sin(t * 47)) * 0.0015 * a, s.base.z + Math.cos(t * 53) * 0.0025 * a);
        o.rotation.set(s.rot.x + Math.sin(t * 37) * 0.02 * a, s.rot.y, s.rot.z + Math.cos(t * 41) * 0.02 * a);
        if (s.t === 0) { o.position.copy(s.base); o.rotation.copy(s.rot); shake.delete(o); } }
    }
    function waveMeets() {
      if (phase !== 'night') return;
      sfx5('u51wave', 0.55);
      const x = myX(), z = myZ(), up = play.found.has('u');
      if (x > BED.x0 - 0.3) { shakeThing(things.bedGlass, 1); sfx5('u51glass', 0.5, panTo(things.bedGlass ? things.bedGlass.position.x : x, things.bedGlass ? things.bedGlass.position.z : z)); }
      if (Math.abs(x - (PASS.x0 + PASS.x1) / 2) < 3.2) { shakeThing(things.frame0, 1.4); shakeThing(things.frame1, 1.4); sfx5('u51frames', 0.5, panTo((PASS.x0 + PASS.x1) / 2, PASS.z1)); }
      if (x < LIV.x1 + 1.5) { sfx5(night5.waveN % 2 ? 'u51gtick1' : 'u51gtick2', 0.55, panTo(x + (nRand() - 0.5) * 3, LIV.z1)); }
      if (distTo(HIS.altar.x, HIS.altar.z) < 5.2 && things.bottle && things.bottle.visible) { shakeThing(things.bottle, 1.6, 2.2); sfx5('u51bottle', 0.6, panTo(HIS.altar.x, HIS.altar.z)); }
      if (!up || lineBusy()) return;
      if (!night5.said.has('n1')) { night5.said.add('n1'); say('zv51n1'); }
      else if (!night5.said.has('n2') && x > PASS.x0 - 0.8 && x < PASS.x1 + 0.3) { night5.said.add('n2'); say('zv51n2'); }
      else if (!night5.said.has('n3') && distTo(HIS.altar.x, HIS.altar.z) < 5.2) { night5.said.add('n3'); say('zv51n3'); }
    }
    /* THE BEAT NEVER LEFT TO CHANCE (v21.17): at the bedroom door, the strongest wave, and Spirit Vision forced open for four
       seconds: his footsteps lit red from the front door in, a few at a time, and the threads coming in after them */
    function doorTick(wdt) {
      if (phase !== 'night' || !play.found.has('u')) return;
      if (night5.forced > 0) {
        night5.forced = Math.max(0, night5.forced - wdt);
        if (night5.forced === 0) { if (kit.vision) { kit.vision(null); kit.vision(false); } }
        return;
      }
      if (play.found.has('f') || night5.kneeT > 0) return;
      if (Math.hypot(myX() - SPOT.bedDoor.x, myZ() - SPOT.bedDoor.z) > 1.05) return;
      night5.forced = 4.0; got('f');
      waveAt(0.26);
      if (kit.vision) { kit.vision(true); kit.vision({ lock: true, why: W.visionHeld }); }
      sfx5('u51vison', 1.0); footSet(0); fx.footRun = 0;
      lineQ.length = 0; say('zv51n4');
    }
    /* the footsteps (FILMPLACE.steps, the film of home's own walk) and the threads, in Spirit Vision only */
    const FOOT = FILMPLACE.steps;
    { const fg = new THREE.CircleGeometry(1, 16); fg.rotateX(-Math.PI / 2);
      for (let i = 0; i < FOOT.length; i++) {
        const [x, z] = FOOT[i], [x2, z2] = FOOT[Math.min(FOOT.length - 1, i + 1)], [x0, z0] = FOOT[Math.max(0, i - 1)];
        const ang = Math.atan2(x2 - x0, z2 - z0), side = (i % 2 ? 1 : -1) * 0.1;
        const m = new THREE.Mesh(fg, new THREE.MeshBasicMaterial()); m.scale.set(0.05, 1, 0.12);
        m.position.set(x + Math.cos(ang) * side, 0.012, z - Math.sin(ang) * side); m.rotation.y = ang; m.frustumCulled = false; world.add(m);
        fx.foot.push({ m, sp: ctx.spirit ? ctx.spirit(m, { color: RED, fill: 1.1, rim: 0.4, flicker: 0.2, xray: 0.8 }) : null, k: 0 }); }
      const TH = [[[HIS.door.x, -2.45], [HX - 3.4, -1.6], [HX - 3.2, -0.6]], [[HIS.door.x + 0.3, -2.45], [HX - 2.6, -1.2], [HX - 2.0, -0.1]],
                  [[HX - 1.4, LIV.z1 - 0.05], [HX - 0.9, 1.1], [HX - 0.8, 0.2]], [[HX + 1.0, LIV.z1 - 0.05], [HX + 1.3, 1.6], [HX + 1.4, 0.8]],
                  [[HX + 5.6, BED.z1 - 0.05], [HX + 5.4, 1.6], [HX + 5.6, 0.7]], [[HX + 2.0, LIV.z1 - 0.05], [HX + 2.5, 1.5], [HX + 2.6, 0.95]]];
      for (const T of TH) { const c = new THREE.CatmullRomCurve3(T.map(([x, z]) => new THREE.Vector3(x, 0.02, z)));
        const g = new THREE.TubeGeometry(c, 24, 0.0045, 5, false), m = new THREE.Mesh(g, new THREE.MeshBasicMaterial()); m.frustumCulled = false; world.add(m);
        g.setDrawRange(0, 0); fx.threads.push({ m, g, n: g.index ? g.index.count : g.attributes.position.count, k: 0, sp: ctx.spirit ? ctx.spirit(m, { color: RED, fill: 0.6, rim: 1.2, flicker: 0.35, xray: 0.6 }) : null }); } }
    function footSet(k) { for (const f of fx.foot) f.k = k; for (const t of fx.threads) t.k = k; }
    function footTick(wdt, t) {
      const show = phase === 'night' || phase === 'ask';
      for (const f of fx.foot) f.m.visible = show;
      for (const th of fx.threads) th.m.visible = show;
      if (!show) return;
      if (night5.forced > 0 || play.found.has('f')) fx.footRun = (fx.footRun || 0) + wdt;
      const run = fx.footRun || 0;
      fx.foot.forEach((f, i) => { const want = run > 0 ? c01((run - i * 0.22) / 0.35) : f.k; f.k = Math.max(f.k, want);
        if (f.sp) f.sp.set('uAlpha', f.k * (0.75 + 0.25 * Math.sin(t * 2.0 + i))); });
      for (const th of fx.threads) { const want = run > 0 ? c01((run - 0.8) / 3.0) : th.k; th.k = Math.max(th.k, want);
        th.g.setDrawRange(0, Math.floor(th.n * th.k / 6) * 6); if (th.sp) th.sp.set('uAlpha', 0.8 * th.k); }
    }
    /* the phone picked up (a press), its screen in his hand: 3:03, his teacher's name; the decision */
    function atPhone() {
      if (phase !== 'night' || play.busy || !play.found.has('u') || night5.kneeT > 0) return false;
      sfx5('u51phoneup', 0.6);
      if (things.hisPhone) things.hisPhone.visible = false;
      holdPhone(true);
      book('ask'); askBegin();
      return true;
    }
    const phone5 = { g: null };
    function holdPhone(on) {
      if (!kit || !kit.hold) return;
      if (!on) { if (phone5.g) kit.hold(null); phone5.g = null; if (things.hisPhone) things.hisPhone.visible = true; return; }
      if (phone5.g) return;
      const cv = document.createElement('canvas'); cv.width = 256; cv.height = 512; const x = cv.getContext('2d'); x.fillStyle = '#070b12'; x.fillRect(0, 0, 256, 512);
      x.fillStyle = '#dfe8f4'; x.textAlign = 'center'; x.font = '300 74px sans-serif'; x.fillText('3:03', 128, 150);
      x.font = '22px sans-serif'; x.fillStyle = '#9fb0c6'; x.fillText('Grandmaster Pho', 128, 300);
      x.fillStyle = '#2f9e5a'; x.beginPath(); x.arc(128, 420, 34, 0, Math.PI * 2); x.fill();
      const tx = new THREE.CanvasTexture(cv); tx.colorSpace = THREE.SRGBColorSpace; madeTex.push(tx);
      const sm = new THREE.MeshBasicMaterial({ map: tx, toneMapped: false }); mats.push(sm);
      const g = new THREE.Group(), body = new THREE.Mesh(new THREE.PlaneGeometry(0.068, 0.136), sm); g.add(body);
      if (things.hisPhone && things.hisPhone.userData.model) { const m = things.hisPhone.userData.model.clone(true); m.traverse(q => { if (q.isMesh) q.frustumCulled = false; });
        m.rotation.x = Math.PI / 2; m.position.z = -0.006; g.add(m); }
      phone5.g = g; kit.hold(g, { pos: PHONEHELD.pos, rot: PHONEHELD.rot });
    }
    const PHONEHELD = { pos: [-0.045, 0.06, -0.035], rot: [0.35, 0.25, 0] };

    /* ================================================================ THE DECISION (the plan's 9.6): 3:03, his teacher's
       name on his phone's screen. Not timed; the world is held while the panel is open (v11.4). It opens here, and again
       at the table after a step back (d_play.js: the pile is live only while the question stands) */
    function openDecision() {
      decOpen = true;
      if (getState() === 'play') startDecision();
    }
    function askBegin() {
      lookAt0(LOOK_OF.ask); warm('ask');
      if (kit && kit.vision) { kit.vision(null); kit.vision(false); }
      if (!phone5.g) holdPhone(true);
      night5.p = Math.max(0.35, Math.min(0.75, night5.p || 0.5)); night5.waves = [];
      footSet(1);
      night5.handed = false;
      const run = play.run; after(0.6, () => { if (live(run)) openDecision(); });
    }

    /* ================================================================ THE PLAY'S SOUND (the plan's 11; every sound in main.js's
       STING_SAMPLE, made by SOUND: masters/v29.0/sound/picks.json): the beds of each place eased by place and beat (the
       engine ducks every bed under a voice), M2 under the room and M3 laid over it wherever the pull is shown, the water's
       lap under the event, and at three o'clock the night thinned to almost nothing as the pressure rises, M6's three
       layers entering at 0.2, 0.5 and 0.8, the tinnitus over 0.6, his breath faster with it, the threads' dry rustle while
       his sight is open on them. In a film every one is the film's (`stage.beds.film`, when a film writes it), else 0 */
    const BED_NAMES = ['flat', 'night', 'three', 'm2', 'm3', 'm6a', 'm6b', 'm6c', 'lap', 'tin', 'brth', 'threads'];
    const BED_SND = { flat: 'u51bflat', night: 'u51bnight', three: 'u51bthree', m2: 'u51m2room', m3: 'u51m3pull', m6a: 'u51m6a', m6b: 'u51m6b', m6c: 'u51m6c',
                      lap: 'u51lap', tin: 'u51tinnitus', brth: 'u51breath', threads: 'u51threads' };
    const BED_VOL = { flat: 0.55, night: 0.5, three: 0.55, m2: 0.3, m3: 0.26, m6a: 0.32, m6b: 0.3, m6c: 0.3, lap: 0.32, tin: 0.16, brth: 0.32, threads: 0.3 };
    const BED_EASE = { flat: 1.2, night: 1.2, three: 1.0, m2: 2.0, m3: 0.8, m6a: 1.2, m6b: 1.2, m6c: 1.2, lap: 0.5, tin: 0.8, brth: 0.6, threads: 0.4 };
    const BEDS = { mix: {}, film: null }, BED_AT = {};
    for (const k of BED_NAMES) BEDS.mix[k] = 0;
    DATA.ambience.beds.forEach((b, i) => { for (const k in BED_SND) if (BED_SND[k] === b[0]) BED_AT[k] = i; });
    function bedsTick(wdt, st) {
      if (!(wdt > 0)) return;
      const want = {}; for (const k of BED_NAMES) want[k] = 0;
      if (st === 'cine') { if (BEDS.film) for (const k in BEDS.film) if (k in want) want[k] = BEDS.film[k]; }
      else if (st !== 'title' && st !== 'chapter' && phase) {
        if (phase === 'room') { want.flat = BED_VOL.flat; want.m2 = BED_VOL.m2; if (dayClock.t < pullTill || visOpen()) want.m3 = BED_VOL.m3; }
        else if (phase === 'breaking') { want.flat = BED_VOL.flat * 0.6; want.lap = ev5() ? BED_VOL.lap * (0.6 + 0.4 * Math.min(1, brk.drift || 0)) : 0; }
        else {
          const p = night5.p || 0;
          want.night = BED_VOL.night * Math.max(0, 1 - p * 1.4); want.three = BED_VOL.three * Math.min(1, p * 1.6);
          want.m6a = p >= 0.2 ? BED_VOL.m6a : 0; want.m6b = p >= 0.5 ? BED_VOL.m6b : 0; want.m6c = p >= 0.8 ? BED_VOL.m6c : 0;
          want.tin = p > 0.6 ? BED_VOL.tin * (p - 0.6) / 0.4 : 0; want.brth = play.found.has('u') || phase === 'ask' ? BED_VOL.brth * (0.4 + 0.6 * p) : 0;
          want.threads = visOpen() || night5.forced > 0 ? BED_VOL.threads : 0;
          if (phase === 'ask') { for (const k of ['m6b', 'm6c', 'tin']) want[k] *= 0.5; }
        }
      }
      const B = DATA.ambience.beds;
      for (const n of BED_NAMES) { BEDS.mix[n] += (want[n] - BEDS.mix[n]) * (1 - Math.exp(-wdt / BED_EASE[n])); if (B[BED_AT[n]]) B[BED_AT[n]][1] = BEDS.mix[n]; }
    }
    const ev5 = () => !!(kit && kit.eventActive && kit.eventActive());
    /* a one-shot of the play (a literal name, warmed with its phase: v10.2), panned to where it comes from */
    function sfx5(name, vol, pan = 0) { if (worldSfx && !(soundOff && soundOff())) worldSfx(name, vol, 1, pan); }
    function panTo(x, z) { const dx = x - myX(), dz = z - myZ(), a = Math.atan2(dx, -dz) + yaw.rotation.y; return THREE.MathUtils.clamp(Math.sin(a) * 0.75, -0.75, 0.75); }
    const WARM = {
      room: ['u51bflat', 'u51m2room', 'u51m3pull', 'u51pour', 'u51brass', 'u51lighter', 'u51wick', 'u51buzz', 'u51stand', 'u51sofa', 'u51vison', 'u51visoff', 'ph51ratana'],
      breaking: ['u51bflat', 'u51lap', 'u51tremor', 'u51spill', 'u51dip', 'u51flick', 'u51fray', 'ph51ratana', 'ph51s1'],
      night: ['u51bnight', 'u51bthree', 'u51m6a', 'u51m6b', 'u51m6c', 'u51tinnitus', 'u51breath', 'u51threads', 'u51heart', 'u51wave', 'u51glass', 'u51frames',
              'u51gtick1', 'u51gtick2', 'u51bottle', 'u51floor', 'u51knee', 'u51vison', 'u51visoff', 'u51phoneup'],
      ask: ['u51bthree', 'u51m6a', 'u51heart']
    };
    function warm(p) { if (warmSounds && WARM[p]) warmSounds(WARM[p]); }
    function soundReset() { for (const k of BED_NAMES) BEDS.mix[k] = 0; BEDS.film = null; pullTill = 0; for (const b of DATA.ambience.beds) b[1] = 0; }

    /* ---------------------------------------------------------------- the people at rest in the room: Grandmaster Pho's eyes
       on Grace, Grace's on her own lap and the door, Marcus's on Grace */
    function gazeRest(P) {
      if (!P) return;
      if (P === cast.pho) gaze(P, [HER.grace.x, 0.95, HER.grace.z], { secs: 1.0, reach: 0.6 });
      else if (P === cast.marcus) gaze(P, [HER.grace.x, 0.95, HER.grace.z], { secs: 1.0, reach: 0.6 });
      else gaze(P, null, { secs: 1.0 });
    }

    /* ---------------------------------------------------------------- the things he can press (each offered only in its
       phase, only while no line is handing off, and never once it is done: derived, so a replay needs nothing put back) */
    const roomLive = () => phase === 'room' && !play.busy && !grace5.up;
    const hotspots = [
      { id: 'jug', pos: SPOT.jug, radius: 1.6, prompt: W.hotJug, markY: 0, hits: markHit(() => ({ x: ON_CLOTH.jug.x, y: 0.12, z: ON_CLOTH.jug.z }), 0.1),
        enabled: () => roomLive() && !play.found.has('w'), onInteract() { return pour(); } },
      { id: 'lighter', pos: SPOT.lighter, radius: 1.6, prompt: W.hotLighter, markY: 0, hits: markHit(() => ON_CLOTH.lighter, 0.09),
        enabled: () => roomLive() && play.found.has('w') && !play.found.has('l'), onInteract() { return lightCandle(); } },
      lookSpot('phoneher', 'p', () => SPOT.herPhone, ['zv51r1', 'ph51r1'], W.hotPhone),
      lookSpot('glass', 'g', () => SPOT.glass, ['zv51r2', 'ph51r2'], W.hotGlass),
      lookSpot('hands', 'h', () => graceHands, ['zv51r3', 'ph51r3'], W.hotHands),
      lookSpot('packet', 'k', () => SPOT.packet, ['zv51r4', 'ph51r4', 'zv51r5', '|', 'gr51r1', 'mk51r1'], W.hotPacket),
      { id: 'getup', pos: SPOT.bed, radius: 2.4, prompt: W.hotGetUp, markY: 0,
        enabled: () => phase === 'night' && !play.busy && !play.found.has('u'), onInteract() { return getUp(); } },
      { id: 'phone', pos: SPOT.phone, radius: 1.7, prompt: W.hotPhoneHis, markY: 0, hits: markHit(() => FILMPLACE.phoneAt, 0.09),
        enabled: () => phase === 'night' && !play.busy && play.found.has('u') && !(night5.kneeT > 0), onInteract() { return atPhone(); } }
    ];
    /* (a look-spot's mark follows what it marks: her hands move with her take) */
    function spotsTick() { const h = hotspots.find(q => q.id === 'hands'); if (h) { h.pos = { x: graceHands.x, y: graceHands.y, z: graceHands.z }; } }

    /* ================================================================ THE PLAY'S FRAME (d_play.js calls it every frame of
       play, after the line queue; the chant's and the effects' every frame whatever the state) */
    function storyTick(wdt) {
      if (phase === 'room') { handsTick(); spotsTick(); phoneTick(wdt); standTick(); visionTick(); }
      else if (phase === 'night') { getUpTick(wdt); doorTick(wdt); }
      pressureTick(wdt);
    }
    function fxTick(wdt, st) {
      const t = wallClock.t;
      waterTick(wdt); lineTick(t); graceReflTick(wdt); footTick(wdt, t); shakeTick(wdt, t); RATANA.tick(); bedsTick(wdt, st);
      /* (an ending begins from the decision: once, on its first frame, the play's hold on the sound, the heart and the lens is
         given back, so an ending's film starts clean and lays its own pressure: PLAY.md 2. Never again after, so a film's
         own settings are never overwritten) */
      if (st === 'cine' && phase === 'ask' && !night5.handed && kit) { night5.handed = true;
        if (kit.hush) kit.hush(0, { secs: 0.4 }); if (kit.pulse) kit.pulse(null); if (kit.lens) kit.lens(null, { secs: 0 }); }
    }

    /* ---------------------------------------------------------------- a phase set from outside (a probe; the walk
       test's later grounds) and a phase applied from the save (a Continue, the selector, a replay: every phase is
       covered, and anything else is the room) */
    function setPhase(p) { applyPhase(PHASES.includes(p) ? p : 'room'); saveMark(); }
    function playClear() {
      if (!kit) return;
      if (kit.press) kit.press(0, { secs: 0 }); if (kit.pulse) kit.pulse(null); if (kit.hush) kit.hush(0, { secs: 0 }); if (kit.lens) kit.lens(null, { secs: 0 });
      if (kit.tremble) kit.tremble(0, { secs: 0 }); if (kit.visionUrge) kit.visionUrge(false);
      holdBowl(false); holdPhone(false); unseat(); if (kit.pose) kit.pose('standing', { secs: 0.05 });
      grace5.up = false; grace5.reflWant = 0; fx.fray = 0; fx.taut = 0;
      for (const [o, s] of shake) { o.position.copy(s.base); o.rotation.copy(s.rot); } shake.clear();
    }
    function applyPhase(saved) {
      const R = readMark(saved);
      /* (a jump from one phase to another drops what the last one had queued: its lines, its timers, its busy hand-off:
         the v21.25 law, a phase jump leaves the line queue full) */
      phase = R.p; play.run++; play.busy = false; play.found = new Set(R.found); decOpen = false;
      lineQ.length = 0; speakReset(); dropTodo();
      if (kit && kit.captions) kit.captions(null);
      if (kit && kit.eventActive && kit.eventActive() && kit.abortEvent) kit.abortEvent();
      if (R.p !== 'breaking') RATANA.stop();
      playClear();
      if (things.hisPhone) things.hisPhone.visible = true;
      worldPhase(R.p);
      if (R.p === 'room') roomBegin(R.found);
      else if (R.p === 'breaking') breakingBegin();
      else if (R.p === 'night') nightBegin(R.found);
      else { nightBegin(['u', 'f']); phase = 'ask'; const a = STATION.ask.at; yaw.position.set(a.x, yaw.position.y, a.z); yaw.rotation.y = a.ry; askBegin(); }
    }
    function storyReset() {
      play.run++; play.busy = false; play.found = new Set(); decOpen = false;
      if (kit && kit.captions) kit.captions(null);
      RATANA.reset(); playClear(); soundReset();
      Object.assign(room5, { t0: 0, ups: 0, phoneAt: 0 }); Object.assign(grace5, { up: false, reflK: 0, reflWant: 0 });
      Object.assign(brk, { i: 0, retook: false, shares: [], spills: 0, on: false });
      Object.assign(night5, { p: 0, waves: [], nextWave: 0, kneeT: 0, tipSaid: false, forced: 0, said: new Set(), getUpT: 0, from: null, moving: 0, seed: 0x5101, waveN: 0, handed: false });
      fx.waterK = 0; fx.pourT = 0; fx.phoneLit = 0; fx.footRun = 0; footSet(0); lastPos = null;
      if (things.holyBowl) things.holyBowl.visible = true; if (things.hisPhone) things.hisPhone.visible = true;
      if (WORLD.candleLit) WORLD.candleLit('candle2', null);
      lookAt0('LAMP');
    }
    function storySnap() { return { phase, found: [...play.found], busy: play.busy, decOpen, look: lookName, pressure: +(night5.p || 0).toFixed(3),
      chant: RATANA.state(), brk: { i: brk.i, retook: brk.retook, shares: brk.shares.slice(), spills: brk.spills, share: brk.share },
      grace: { up: grace5.up, ups: room5.ups }, night: { waves: night5.waveN, knee: night5.kneeT > 0, forced: +night5.forced.toFixed(2), tip: night5.tipSaid, said: [...night5.said] } }; }
