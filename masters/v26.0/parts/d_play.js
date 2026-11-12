    /* ================================================================ THE PLAY (the plan's §4.1, §4.3, §9)
       Every beat on the chapter clock (wall time, v7.1); every line through the queue, one voice at a time; each beat's
       receipt in the phase string, so a Continue lands where a reload would.
       The plan's §3.7, "cinematic in play": the ground answers his feet (things happen at his marks, not on a clock);
       his look is borrowed gently and given back; his hands are the actor (the bai sri carried all day); nothing is on
       the screen but the world in the set pieces. */
    const PHASES = ['arrive', 'baisri', 'tables', 'place', 'festival', 'seen', 'check', 'dawn', 'knelt', 'told', 'breath', 'taught', 'decide'];
    const DAY_TWO = new Set(['dawn', 'knelt', 'told', 'breath', 'taught', 'decide']);
    let phase = 'arrive';
    let booted = false, preplaced = '';
    const dayClock = { t: 0 };
    let lastWall = 0, pausedAt = 0, lastWall0 = 0;
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
    /* a line said by someone: he talks from its own start and rests after it (v11.4) */
    function line(name, who, onStart) { queueLine(name, () => { if (who) talk(who, SECS[name] || 2.5); if (onStart) onStart(); }); }
    /* a sound of the place, if its file is in the build (M7 makes them; until one lands its cue is simply silent) */
    function fx(name, vol = 1, pan = 0) { if (worldSfx && !(soundOff && soundOff())) worldSfx(name, vol, 1, pan); }

    /* ---- THE GROUND'S SOUND (M7). THE BEDS, each eased toward what the day and the beat want: the festival's crowd
       and its music over the loudspeakers (day one), the morning's birds (day two), the world heard OPEN (the breath's
       own level: the game's sound there, with kit.hush closing it), the pull's drone (the pull's own number: however
       long he stands in it). In a film the beds are the film's (filmBed: y_stage.js writes it from the film's clock;
       every film cues the rest of its sound itself). The engine ducks every bed under a voice (8 dB). The order is
       DATA.ambience.beds'.
       THE LEVELS are set from each file's measured level (masters/v26.0/sound/levels.py -> LEVELS.txt: the median of
       its seconds), to where the bed stands with nobody speaking: the quiet places at the house's -35 dBFS (the morning's
       birds, the night, his shop a little under), and DAY ONE LOUD, as the real one is (Chad: "festive, loud, and
       colourful"): its music over the loudspeakers at -26.5 and the crowd at -31 under it, -25 together, which a
       voice (-16) still stands 17 dB over through the duck. The world heard open at -28.5 when it is wide; the pull's
       drone at -30 at its height, the ground's noise fallen away under it */
    const BED = { fest: 0.64, mus: 0.38, birds: 0.56, open: 0.75, crick: 0.56, pull: 0.62, shop: 0.56 };
    const bedMix = { fest: 0, mus: 0, birds: 0, open: 0, crick: 0, pull: 0, shop: 0 };
    const filmBed = { on: false, fest: 0, mus: 0, birds: 0, open: 0, crick: 0, pull: 0, shop: 0 };
    const BED_EASE = { fest: 1.0, mus: 1.6, birds: 1.0, open: 0.22, crick: 0.8, pull: 0.3, shop: 0.5 };
    const DAY1 = new Set(['arrive', 'baisri', 'tables', 'place', 'festival', 'seen', 'check']);
    function mixBeds(wdt, st) {
      if (!(wdt > 0)) return;
      const want = { fest: 0, mus: 0, birds: 0, open: 0, crick: 0, pull: 0, shop: 0 };
      if (st === 'cine') { if (filmBed.on) for (const k in want) want[k] = filmBed[k]; }
      /* (on the title and the chapter's card nothing is heard: the engine holds every bed at 0 there. Nothing is RAISED
         there either: this frame runs under the title too, and the opening film began on a second of day one's crowd,
         eased down from the level play would have had: my own fault, found by the sound probe's first reading) */
      else if (st === 'title' || st === 'chapter') { /* all at 0 */ }
      else if (DAY1.has(phase)) {
        /* (the pull: the ground's own noise falls away under it, the music first; kit.hush closes the bus besides) */
        const pk = play.pull ? smo(c01(play.pull.k)) : 0;
        want.fest = BED.fest * (1 - 0.5 * pk) * (phase === 'check' ? 0.8 : 1); want.mus = BED.mus * (1 - pk) * (phase === 'check' ? 0.8 : 1);
        want.pull = BED.pull * pk;
        if (play.chanting) { want.mus = 0; want.fest *= 0.55; }                             // the chant is on the loudspeakers, and the ground is bowing
      } else { want.birds = BED.birds; if (phase === 'breath') want.open = BED.open * Math.max(0, open.shown); }
      for (const k in bedMix) bedMix[k] += (want[k] - bedMix[k]) * (1 - Math.exp(-wdt / BED_EASE[k]));
      const B = DATA.ambience.beds; B[0][1] = bedMix.fest; B[1][1] = bedMix.mus; B[2][1] = bedMix.birds; B[3][1] = bedMix.open; B[4][1] = bedMix.crick; B[5][1] = bedMix.pull; B[6][1] = bedMix.shop;
    }
    /* where a sound of the ground is, on his screen */
    function panAt(x, z) {
      const dx = x - yaw.position.x, dz = z - yaw.position.z, a = Math.atan2(dx, -dz) + yaw.rotation.y;
      return THREE.MathUtils.clamp(Math.sin(a) * 0.75, -0.75, 0.75);
    }
    /* THE GROUND'S OWN NOISES, one at a time on the chapter's clock from their own seeded stream (e3c3's shape, v21.13):
       on day one a child running past, the loudspeaker's crackle, the flags and banners in a gust, bottles in a crate, a
       master's hand bell, a burst of clapping; on day two a dove in the tree, a motorbike on the road, a far temple's
       bell, the flags. Each panned to where it comes from, a third quieter while a line is being said. Never two at
       once; never in the bows, the line and the pull, or OPEN AND CLOSE (those have their own sound); in play only;
       reset() rewinds the stream (v8.1). Every one-shot file has its loudest twentieth of a second at -14 dBFS (sound.sh), so a
       volume here says where it stands: day one's at -23 or so over a ground at -25 (heard as the ground's own, never
       in front of it), the morning's at -29 over birds at -35 */
    const AMB_SEED = 0x2603;
    let ambSeed = AMB_SEED, ambAt = 0, ambBusy = 0, ambLast = '', ambN = 0;
    /* (which wick the taper stood at when last looked at, and what the children were doing: extrasSound, below) */
    let wickAt = -1, kidsPh = '';
    function ambRand() {
      ambSeed = (ambSeed + 0x6D2B79F5) | 0; let t = ambSeed;
      t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }
    const ambSide = (lo, hi) => (ambRand() < 0.5 ? -1 : 1) * (lo + ambRand() * (hi - lo));
    const AMB = {
      one: [
        { n: 'x3os1', v: 0.36, len: 3.0, at: () => ({ x: ambSide(2, 9), z: 2 + ambRand() * 8 }) },          // a child, somewhere among the mats
        { n: 'x3os2', v: 0.28, len: 3.0, at: () => ({ x: 0, z: -13 }) },                                    // the loudspeakers, at the hall
        { n: 'x3os3', v: 0.36, len: 4.0, at: () => ({ x: ambSide(0, 4), z: -2 + ambRand() * 4 }) },         // the pole's flags and the banners
        { n: 'x3os4', v: 0.34, len: 2.5, at: () => ({ x: 9 + ambRand() * 3, z: ambSide(1, 6) }) },          // bottles, at the east tents
        { n: 'x3os5', v: 0.34, len: 2.5, at: () => ({ x: -9.5, z: ambSide(0, 4) }) },                       // a hand bell, along the masters' row
        { n: 'x3os6', v: 0.36, len: 4.0, at: () => ({ x: -8, z: 2 + ambRand() * 3 }) },                     // clapping, by the masters
      ],
      two: [
        { n: 'x3os7', v: 0.18, len: 3.0, at: () => ({ x: 9, z: 8 }) },                                      // a dove, in the tree by his bench
        { n: 'x3os8', v: 0.16, len: 5.0, at: () => ({ x: ambSide(20, 40), z: 25 }) },                       // a motorbike, on the road
        { n: 'x3os9', v: 0.18, len: 5.0, at: () => ({ x: -40, z: -10 }) },                                  // a far temple's bell
        { n: 'x3os3', v: 0.17, len: 4.0, at: () => ({ x: ambSide(0, 4), z: -2 + ambRand() * 4 }) },         // the flags
      ],
    };
    function ambTick() {
      if (!worldSfx || (soundOff && soundOff())) return;
      const one = phase === 'arrive' || phase === 'baisri' || phase === 'tables' || phase === 'seen' || phase === 'check';
      const two = phase === 'dawn' || phase === 'decide';
      if (!(one || two) || play.bow || play.pull) { ambAt = 0; return; }
      if (!ambAt) { ambAt = dayClock.t + 3 + ambRand() * 5; return; }
      if (dayClock.t < ambAt || dayClock.t < ambBusy) return;
      const pool = one ? AMB.one : AMB.two;
      let k = Math.floor(ambRand() * pool.length);
      if (pool[k].n === ambLast) k = (k + 1 + Math.floor(ambRand() * (pool.length - 1))) % pool.length;
      const sd = pool[k], at = sd.at();
      const vol = sd.v * (dayClock.t < speak.until ? 0.66 : 1) * (0.85 + 0.3 * ambRand());
      if (worldSfx(sd.n, vol, 0.95 + 0.1 * ambRand(), panAt(at.x, at.z))) {
        ambN++; ambLast = sd.n; ambBusy = dayClock.t + sd.len + 0.8;
        ambAt = dayClock.t + (one ? 6 + ambRand() * 8 : 9 + ambRand() * 11);
      } else ambAt = dayClock.t + 1.5;
    }
    function ambReset() { ambSeed = AMB_SEED; ambAt = 0; ambBusy = 0; ambLast = ''; ambN = 0; for (const k in bedMix) bedMix[k] = 0; filmBed.on = false; wickAt = -1; kidsPh = ''; }

    const W = DATA.words;
    const play = { run: 0, busy: false, turning: null, bow: null, bai: false, baiP: 0, baiTo: 0, baiSecs: 1, knelt: false, homage: false,
                   pull: null, looked: false, asked: new Set(), checked: false, bowed: false, breath: null, lookEase: null };
    let decOpen = false;
    const live = (run) => alive && run === play.run;
    /* the receipts inside a phase (§9): the homage made; who has been asked; the bow made; how the breaths went */
    function mark() {
      const t = [];
      if (phase === 'place' && play.homage) t.push('h');
      if (phase === 'check') { if (play.asked.has('ton')) t.push('t'); if (play.asked.has('aunt')) t.push('a'); if (play.checked) t.push('x'); }
      if (phase === 'knelt' && play.bowed) t.push('b');
      if (play.breath) t.push('c' + play.breath.closed, 'f' + play.breath.held);
      return t.join(',');
    }
    function readMark(p0) {
      const [p1, tag = ''] = String(p0 || '').split(':');
      const p = PHASES.includes(p1) ? p1 : 'arrive', f = new Set(tag.split(',').filter(Boolean));
      const num = (c) => { for (const v of f) if (v[0] === c && /^\d$/.test(v.slice(1))) return +v.slice(1); return null; };
      return { p, homage: f.has('h'), ton: f.has('t'), aunt: f.has('a'), checked: f.has('x'), bowed: f.has('b'), closed: num('c'), held: num('f') };
    }
    function setPhase(p, opts) { phase = p; if (kit) kit.setPhase(p + ':' + mark()); objectiveFor(p, opts); }
    function saveMark() { if (kit) kit.setPhase(phase + ':' + mark()); }        // a beat inside a phase banks its receipt the moment it counts
    function bank(note, a = 0) {
      if (!kit || !note) return;
      const got = kit.getConduct ? kit.getConduct().notes : [];
      if (!got.includes(note)) kit.conduct({ note, s: 0, a });
    }

    /* ---------------------------------------------------------------- places (x east, z south; the tracker's §10) */
    const EYE = 1.62;
    const KNEEL = { y: 0.9, span: 1.2, lo: -0.9, hi: 0.55 };                  // his eye sat back on his heels, and how far he may look about
    const TON_HEAD = () => { const g = cast.ton.group.position; return { x: g.x, y: cast.ton.seated ? 0.95 : 1.52, z: g.z }; };
    const TABLES_AT = { x: 0, z: -8.85 };                                     // where he stands to pay his respects, on the gravel before the tables
    const BUDDHA = { x: WHEEL.x, y: 1.95, z: WHEEL.z };                       // where he looks as he pays his respects: the hub of the wheel of marigolds (the small seated image photograph 10 shows before it is not made until Chad says what it is: a sacred image is never guessed)
    const PLACE = { x: -2.25, z: 1.25 };                                      // his place on the turf, at the north-east corner of the group's rows
    const PLACE_RY = Math.atan2(-(0 - PLACE.x), -(-11.2 - PLACE.z));          // (a look's yaw: toward the offering tables)
    const TON_PLACE = { x: PLACE.x - 1.05, z: PLACE.z + 0.12 };
    /* second in the line at his bench, half a step to one side of the one who kneels: straight behind him the young man
       was hidden by the player's own bai sri the moment he sat back on his heels (photographed) */
    const LINE_AT = (() => { const [x, z] = benchAt(0.95, 3.05); return { x, z }; })();
    const TON_LINE = (() => { const [x, z] = benchAt(-0.7, 3.65); return { x, z }; })();
    /* the woman at his bench, on day one: at the carpet's edge beside the lime pole, where each bai sri is handed to her
       (by the table, the pole stood between her and anyone who came to ask her: photographed) */
    const AUNT_LINE = (() => { const [x, z] = benchAt(1.5, 2.1), [kx, kz] = benchAt(0.46, 1.3); return { x, z, ry: faceTo(x, z, kx, kz) }; })();
    const YM_B = 1.28;                                                        // how far before the bench the young man kneels (then moved so the two pairs of hands meet: ymPlace)
    const DAWN_AT = { x: 2.1, z: 3.6 };                                       // where the morning finds him
    /* HIS HANDS, KNEELING: on his knees, under the frame's foot. The walking hand the engine draws stood in the middle of
       a phone's frame across his teacher's lap (photographed); it is put away the way a carried thing's hand is (kit.hold
       `bare`, with nothing in it), and comes back for a bow (kit.pray draws both) and when he stands */
    const noHand = new THREE.Group();
    function handsAway(on) { play.away = !!on; if (!kit || !kit.hold) return; if (!on && kit.holding && kit.holding() === noHand) kit.hold(null); }
    function awayTick() { if (!play.away || !kit || !kit.hold || play.bai) return; if (kit.praying && kit.praying()) return; if (!kit.holding()) kit.hold(noHand, { bare: true }); }
    /* Ton, the morning after: a dozen degrees to the right of the line from where the player stands to Grandmaster Pho,
       2.6 m off, so a portrait phone holds him whole beside the bench (he stood at its edge, cut in half: photographed) */
    const TON_DAWN = (() => { const a = Math.atan2(PHO_AT[0] - DAWN_AT.x, PHO_AT[1] - DAWN_AT.z) - 0.21; return { x: DAWN_AT.x + Math.sin(a) * 2.6, z: DAWN_AT.z + Math.cos(a) * 2.6 }; })();
    /* before Grandmaster Pho, on the carpet's outer half: 2.2 m from him, so his whole seated figure stands in a phone's
       frame (at 1.5 m his chest filled it under the canopy's roof: photographed) */
    const KNEEL2 = (() => { const [x, z] = benchAt(0.46, 2.25); return { x, z }; })();
    const PHO_HEAD = { x: PHO_AT[0], y: 1.3, z: PHO_AT[1] };
    const yawTo = (x, z, tx, tz) => Math.atan2(-(tx - x), -(tz - z));         // the look's yaw from a place onto a point
    const phoYawFrom = (p) => yawTo(p.x, p.z, PHO_AT[0], PHO_AT[1]);
    const AUNT_HEAD = () => { const g = cast.aunt.group.position; return { x: g.x, y: 1.42, z: g.z }; };

    /* a person turned to a heading over a moment (never a snap: v14.5) */
    const turns = [];
    function turnPerson(P, to, secs) { if (!P) return; for (let i = turns.length - 1; i >= 0; i--) if (turns[i].P === P) turns.splice(i, 1); turns.push({ P, from: P.group.rotation.y, to, t: 0, secs: Math.max(0.05, secs) }); }
    function turnsTick(wdt) { for (let i = turns.length - 1; i >= 0; i--) { const T2 = turns[i]; T2.t = Math.min(1, T2.t + wdt / T2.secs); T2.P.group.rotation.y = T2.from + angTo(T2.from, T2.to) * smo(T2.t); if (T2.t >= 1) turns.splice(i, 1); } }

    /* the orders (§4.1, §4.3). `complete: false` where the change is not his doing (the v8.7 lie) */
    function objectiveFor(p, opts) {
      if (!kit) return;
      let o = null, wp = null;
      if (p === 'arrive') { if (!play.busy) { o = W.objTon; wp = TON_HEAD(); } }
      else if (p === 'baisri') { if (!play.busy) { o = W.objTables; wp = { x: TABLES_AT.x, y: 1.25, z: TABLES_AT.z - 1.0 }; } }
      else if (p === 'tables') { o = W.objPlace; wp = { x: PLACE.x, y: 0.5, z: PLACE.z }; }
      else if (p === 'place') { if (play.knelt && !play.homage && !play.busy) o = W.objHomage; }
      else if (p === 'festival') { if (play.pull && play.pull.offer && !play.looked) { o = W.objLook; wp = PHO_HEAD_NOW(); } else if (!play.looked) o = W.objLine; }
      else if (p === 'check') { if (!play.checked && !play.busy) { o = W.objCheck; wp = !play.asked.has('ton') ? TON_HEAD() : !play.asked.has('aunt') ? AUNT_HEAD() : null; } }
      else if (p === 'dawn') { o = W.objGo; wp = { x: KNEEL2.x, y: 0.5, z: KNEEL2.z }; }
      else if (p === 'knelt') { if (!play.busy) o = play.bowed ? W.objTell : W.objBow; }
      kit.objective(o, opts);
      kit.waypoint(wp);
    }
    const _ph = new THREE.Vector3();
    function PHO_HEAD_NOW() { const P = cast.pho; if (P && P.ready && P.head) { P.head.getWorldPosition(_ph); return { x: _ph.x, y: _ph.y + 0.06, z: _ph.z }; } return PHO_HEAD; }

    /* THE LOOK: which of the looks the ground wears (a preset of light, the painted shade, and what only that day draws) */
    let lookName = 'DAY1';
    const PHO_LEVEL = { DAY1: 1, DAWN: 0.86, OPENED: 1, SHUT: 0.8, AFTERNOON: 0.95, DUSK: 0.62, NIGHT: 0.3 };   // the unlit share of his look, dimmed to the hour (c_cast.js lookD)
    function look(name, secs = 0) {
      if (kit) kit.daylight(PRESETS[name] || null, secs);
      lookName = name;
      const two = name === 'DAWN' || name === 'OPENED' || name === 'SHUT' || name === 'AFTERNOON' || name === 'DUSK';
      dayOne.visible = name === 'DAY1'; dayTwo.visible = two; nightG.visible = name === 'NIGHT'; duskG.visible = name === 'DUSK';
      crowdSolid(dayOne.visible);
      paintShade(name === 'OPENED' || name === 'SHUT' ? 'DAWN' : name);
      phoLook.level.value = PHO_LEVEL[name] != null ? PHO_LEVEL[name] : 1;
    }
    function openDecision() { decOpen = true; if (getState() === 'play') startDecision(); }

    /* ---------------------------------------------------------------- his look, borrowed and given back (v11.1)
       A glide and a turn to a heading with the eye easing to its height (chapter 2's turnTo), and for a standing man a
       plain ease of the look onto a point; the player's own look is his again the moment either ends. */
    function turnTo(to, secs, o, done) {
      play.turning = { t: 0, from: yaw.rotation.y, to, secs, y: o.y, span: o.span, lo: o.lo, hi: o.hi, done, stand: !!o.stand,
                       pos: o.pos || null, p0: { x: yaw.position.x, z: yaw.position.z }, pitch: o.pitch, pt0: pitch.rotation.x };
    }
    function turnTick(wdt) {
      const T2 = play.turning; if (!T2) return;
      T2.t += wdt / T2.secs;
      const k = smo(Math.min(1, T2.t));
      yaw.rotation.y = T2.from + angTo(T2.from, T2.to) * k;
      if (T2.pos) { yaw.position.x = T2.p0.x + (T2.pos.x - T2.p0.x) * k; yaw.position.z = T2.p0.z + (T2.pos.z - T2.p0.z) * k; }
      if (T2.pitch != null) pitch.rotation.x = T2.pt0 + (T2.pitch - T2.pt0) * k;
      if (kit && !T2.stand) kit.pose('lying', { y: T2.y, yaw: yaw.rotation.y, span: 0.02, pitchLo: Math.min(T2.lo, pitch.rotation.x - 0.01), pitchHi: Math.max(T2.hi, pitch.rotation.x + 0.01), secs: 0.9 });
      if (T2.t >= 1) {
        play.turning = null;
        if (kit && !T2.stand) kit.pose('lying', { y: T2.y, yaw: T2.to, span: T2.span, pitchLo: T2.lo, pitchHi: T2.hi, secs: 0.05 });
        if (T2.done) T2.done();
      }
    }
    /* standing: the look eased onto a point (and, with `pos`, his feet to a spot) */
    function lookAt(pt, secs, done, pos) {
      const px = pos ? pos.x : yaw.position.x, pz = pos ? pos.z : yaw.position.z, d = Math.hypot(pt.x - px, pt.z - pz);
      turnTo(yawTo(px, pz, pt.x, pt.z), secs, { stand: true, pos: pos || null, pitch: Math.atan2(pt.y - yaw.position.y, Math.max(0.3, d)) }, done);
    }

    /* ---------------------------------------------------------------- THE BAI SRI IN HIS HANDS
       Carried all day, his hands under the frame's foot (c_zfx.js BAI says why): low while he walks, only the top of its
       cone in sight; raised when he offers it. It rides the hands' own frame (kit.hold, the hand out of sight), so it
       bobs with his steps and shakes when his hands do. `p`: -1 gone down under the frame, 0 carried, 1 raised, 2 held
       high before his face; eased on the wall clock. */
    const _bq0 = new THREE.Quaternion(), _bv0 = new THREE.Vector3();
    function baiHands(on, o = {}) {
      play.bai = !!on;
      if (!kit) return;
      if (on) {
        if (o.p != null) play.baiP = o.p;
        if (o.from != null) { play.baiP = o.from; play.baiTo = o.p != null ? o.p : 0; play.baiSecs = Math.max(0.05, o.secs != null ? o.secs : 0.7); } else play.baiTo = play.baiP;
        kit.hold(handBai, { bare: true }); baiPlace();
      } else {
        if (kit.holding && kit.holding() === handBai) kit.hold(null);
        handBaiHolder.add(handBai);
        play.baiP = play.baiTo = 0;
      }
    }
    function baiRaise(p, secs = 1.2) { play.baiTo = p; play.baiSecs = Math.max(0.05, secs); }
    /* where it stands in the hands' frame at p (a smooth path through its places), and the pull laid on it */
    function baiPlace() {
      const A = handBai.parent; if (!A || A === handBaiHolder) return;
      const p = play.baiP, Pu = play.pull, k = Pu ? smo(Pu.k) : 0, t = dayClock.t;
      const seg = p < 0 ? [BAI.carry, BAI.down, smo(c01(-p))] : p <= 1 ? [BAI.carry, BAI.raise, smo(c01(p))] : [BAI.raise, BAI.high, smo(c01(p - 1))];
      let x = lp(seg[0][0], seg[1][0], seg[2]), y = lp(seg[0][1], seg[1][1], seg[2]), z = lp(seg[0][2], seg[1][2], seg[2]), tilt = 0;
      /* the pull: his hands begin to lift it and to sway with it, slowly, by themselves */
      if (k > 0) { y += k * (0.05 + 0.022 * Math.sin(t * 0.9) + 0.01 * Math.sin(t * 2.3)); x += k * 0.02 * Math.sin(t * 0.62); tilt = k * 0.09 * Math.sin(t * 0.62 + 0.6); }
      _bq0.copy(A.quaternion).invert();
      handBai.position.copy(_bv0.set(x, y, z).sub(A.position).applyQuaternion(_bq0));
      handBai.quaternion.copy(_bq0); handBai.rotateY(BAI.yaw); if (tilt) handBai.rotateZ(tilt);
    }
    function baiTick(wdt) {
      if (!play.bai || !kit) return;
      if (kit.holding && kit.holding() !== handBai && getState() === 'play') kit.hold(handBai, { bare: true });   // (a film let go of it: it is his again)
      if (play.baiP !== play.baiTo) { const st = wdt / play.baiSecs * Math.max(1, Math.abs(play.baiTo - play.baiP) > 1 ? 2 : 1); play.baiP = play.baiTo > play.baiP ? Math.min(play.baiTo, play.baiP + st) : Math.max(play.baiTo, play.baiP - st); }
      baiPlace();
    }

    /* ================================================================ P1 · TON, AND THE BAI SRI */
    const WARM_DAY1 = ['q3v', 'tn3a1', 'q3p1', 'tn3a2', 'q3u1', 'q3u2', 'tn3m1', 'q3u3', 'tn3m2', 'q3c1', 'tn3c1', 'q3c2', 'ds3c1', 'tn3c2', 'q3c3',
                       'x3baitake', 'x3baiset', 'x3kneel', 'x3bowall', 'x3petals', 'x3chant', 'x3tone',
                       'x3step', 'x3os1', 'x3os2', 'x3os3', 'x3os4', 'x3os5', 'x3os6', 'x3wick'];
    const WARM_DAY2 = ['ph3g1', 'ph3b0', 'ph3b1', 'ph3b2', 'ph3b3', 'ph3b4', 'ph3bx', 'ph3by', 'ph3b5', 'ph3p1', 'ph3p2', 'ph3p3', 'x3kneel', 'x3baiset', 'x3bell',
                       'x3step', 'x3os3', 'x3os7', 'x3os8', 'x3os9'];
    function dayOneStage() {
      look('DAY1', 0); auraAt(0, 0); mistK = 1; burstsClear();
      zoneAt(null);
      whenReady(cast.pho, (P) => { rest(P, 0); gaze(P, null); });
      whenReady(cast.ym, (P) => { P.group.visible = false; }); ymBai.visible = false;
      whenReady(cast.aunt, (P) => { put(P, P.home.x, P.home.z, P.home.ry); rest(P, 0); P.group.visible = true; castSolid(); });
      dayCast(true);
    }
    /* who is on the ground: the other masters and the monks on day one only (the next morning he sits alone) */
    function dayCast(one) { for (const P of [cast.hermitA, cast.red, cast.hermitB, cast.white].concat(cast.monks)) whenReady(P, (Q) => { Q.group.visible = one; }); }
    function tonHome() { whenReady(cast.ton, (P) => { put(P, P.home.x, P.home.z, P.home.ry); P.seated = false; rest(P, 0); P.rest.take = 'Idle_3'; take(P, 'Idle_3', 0); P.group.visible = true; castSolid(); }); }
    function arriveBegin() {
      dayOneStage(); setFormation('arrive'); tonHome();
      baiPut(myBai, TON_BAI.x, TON_BAI.y, TON_BAI.z, TON_BAI.ry);
      setPhase('arrive', { complete: false });
      if (warmSounds) warmSounds(WARM_DAY1);
      const run = play.run;
      after(4.2, () => { if (live(run) && phase === 'arrive' && !play.busy && !heard.has('q3v')) queueLine('q3v'); });
    }
    function tonTalk() {
      if (phase !== 'arrive' || play.busy) return false;
      const run = play.run; play.busy = true; objectiveFor('arrive');
      /* he is stood a stated distance before Ton and turned to his face (v14.1: never from wherever he happened to stop),
         and held there while they speak; Ton turns to him */
      { const g = cast.ton.group.position, dx = yaw.position.x - g.x, dz = yaw.position.z - g.z, d = Math.hypot(dx, dz) || 1, r = Math.max(1.9, Math.min(2.3, d));
        const at = { x: g.x + dx / d * r, z: g.z + dz / d * r };
        if (kit) kit.root(true);
        lookAt({ x: g.x, y: 1.5, z: g.z }, 0.8, null, at);
        whenReady(cast.ton, (P) => turnPerson(P, faceTo(g.x, g.z, at.x, at.z), 0.5)); }
      line('tn3a1', cast.ton); queueGap(0.3); line('q3p1'); queueGap(0.3);
      /* "Take one.": he turns to the table, takes it up and holds it out in both hands (his own take), and it is the
         player's when the line has said so */
      queueLine('tn3a2', () => { if (!live(run)) return;
        const P = cast.ton, g = P.group.position, toTable = faceTo(g.x, g.z, TON_BAI.x, TON_BAI.z), toHim = faceTo(g.x, g.z, yaw.position.x, yaw.position.z);
        P.actN++; turnPerson(P, toTable, 0.4); hold(P, 'give', 0.18, 0.5, 0.4);                       // his hands come up before his chest as he turns to the table
        after(0.45, () => { if (live(run)) play.tonGive = { k: 0 }; fx('x3baitake', 0.3, -0.3); });   // it is in his hands
        after(0.95, () => { if (!live(run)) return; turnPerson(P, toHim, 0.55); span(P, 'give', 0.5, 1.9, 1.4, { fade: 0.2, hold: 1.5 }); });   // and held out to him in both
        after(1.7, () => { if (live(run)) lookAt({ x: myBai.position.x, y: myBai.position.y + 0.3, z: myBai.position.z }, 1.0); });           // his eyes go down to it
        after(3.1, () => { if (!live(run)) return; play.tonGive = null; myBai.visible = false; fx('x3baitake', 0.36); baiHands(true, { from: -1, p: 0, secs: 0.8 });
          span(P, 'give', 3.6, 5.85, 1.9, { fade: 0.3, then: (Q) => rest(Q, 0.7) });
          after(0.9, () => { if (live(run)) lookAt({ x: g.x, y: 1.5, z: g.z }, 1.1); }); }); });                                                // and back up to Ton
      queueFn(() => { if (!live(run)) return; play.busy = false; play.tonGive = null; if (kit) kit.root(false); if (!play.bai) { myBai.visible = false; baiHands(true, { from: -1, p: 0, secs: 0.5 }); } setPhase('baisri'); });
      return true;
    }
    /* THE OFFERING TABLES: he raises the bai sri in both hands to the small Buddha at the centre of the wheel, and bows his head */
    function payRespects() {
      if (phase !== 'baisri' || play.busy || !play.bai) return false;
      const run = play.run; play.busy = true; objectiveFor('baisri');
      if (kit) kit.root(true);
      lookAt(BUDDHA, 1.1, () => { if (!live(run)) return;
        baiRaise(1, 1.4);
        after(1.5, () => { if (!live(run)) return; play.bow = { t: 0, prev: 0, n: 1, secs: 3.4, depth: 0.5, run, sound: '', done: () => {
          baiRaise(0, 1.3);
          after(1.2, () => { if (!live(run)) return; if (kit) kit.root(false); play.busy = false; tonToPlace(); setPhase('tables'); }); } }; }); });
      return true;
    }
    /* Ton goes to his group while the player's eyes are on the tables (a change made where no shot can see it: v24.12) */
    function tonToPlace() { whenReady(cast.ton, (P) => { put(P, TON_PLACE.x, TON_PLACE.z, faceTo(TON_PLACE.x, TON_PLACE.z, 0, -11.2)); P.seated = true; P.rest.take = 'seiza'; P.rest.win = { seiza: [0.4, 6.8] }; rest(P, 0); castSolid(); }); }

    /* ================================================================ P2 · A PLACE; P3 · THE HOMAGE */
    function kneelPlace(instant) {
      if (play.knelt && !instant) return false;
      play.knelt = true; zoneAt(null);
      if (kit) kit.root(true);
      /* the bai sri goes down out of his hands under the frame's foot, and stands on the turf before him */
      /* (a metre before him and a little to his left: nearer, it stood under the frame's foot and behind his own hand) */
      const front = { x: PLACE.x - Math.sin(PLACE_RY) * 1.0 - Math.cos(PLACE_RY) * 0.3, z: PLACE.z - Math.cos(PLACE_RY) * 1.0 + Math.sin(PLACE_RY) * 0.3 };
      const setDown = () => { baiHands(false); baiPut(myBai, front.x, 0.012, front.z, 0.6); handsAway(true); };
      if (instant) {
        setDown();
        yaw.position.x = PLACE.x; yaw.position.z = PLACE.z; yaw.rotation.y = PLACE_RY; pitch.rotation.x = -0.05;
        if (kit) kit.pose('lying', { y: KNEEL.y, yaw: PLACE_RY, span: KNEEL.span, pitchLo: KNEEL.lo, pitchHi: KNEEL.hi, secs: 0.05 });
        return true;
      }
      const run = play.run; play.busy = true;
      fx('x3kneel', 0.32); setPhase('place'); baiRaise(-1, 0.9);                // (it goes down under the frame's foot as he kneels, and is on the turf before him when he looks)
      turnTo(PLACE_RY, 1.1, Object.assign({ pos: PLACE, pitch: -0.3 }, KNEEL), () => { if (!live(run)) return; fx('x3baiset', 0.36); setDown();
        after(0.5, () => { if (!live(run)) return; play.busy = false; objectiveFor('place', { complete: false }); }); });
      return true;
    }
    /* THE HOMAGE: the monks' chant over the loudspeakers; the whole ground makes the krap three times on its three
       lines and once more for the teachers, and he with it, his hands joined. Each line is captioned as it is chanted
       (v21.31), timed from the homage's own start so it is right when the game is muted. */
    const HOMAGE = { bow: 5.6, n: 4, lead: 1.2 };
    /* WHERE EACH LINE OF THE CHANT IS in its file, seconds from its start (masters/v26.0/chant/timing.json: the lines
       are laid where the bows are, and measured there): on the ground's loudspeakers, and from the temple across the
       fields (ending D). The captions stand on these, so they are right when the game is muted (v21.31) */
    const CHANT = { near: [[1.4, 6.6], [7.0, 10.9], [12.6, 18.0]], far: [[0.5, 5.7], [6.1, 10.0], [11.7, 17.1]] };
    function homage() {
      if (phase !== 'place' || !play.knelt || play.homage || play.busy) return false;
      const run = play.run; play.busy = true; objectiveFor('place');
      handsAway(false);
      if (kit) { kit.pray(true, { secs: 0.9, y: -0.3 });
        kit.pose('lying', { y: KNEEL.y, yaw: PLACE_RY, span: 0.02, pitchLo: -1.4, pitchHi: KNEEL.hi, secs: 0.3 });
        if (kit.captions) kit.captions([1, 2, 3].map((k) => ({ at: CHANT.near[k - 1][0], end: CHANT.near[k - 1][1], text: W['cap' + k], sub: W['cap' + k + 'Sub'] }))); }
      fx('x3chant', 0.64); play.chanting = true;                               // (the loudspeakers carry the chant now: the ground's music stops for it, mixBeds)
      whenReady(cast.ton, (P) => hold(P, 'prostrate', 0.15, 0.85, 0.6));
      after(HOMAGE.lead, () => { if (!live(run)) return;
        play.bow = { t: 0, prev: 0, n: HOMAGE.n, secs: HOMAGE.bow * HOMAGE.n, depth: 1.0, run, sound: 'x3bowall', done: () => homageDone(run) };
        for (let k = 0; k < HOMAGE.n; k++) after(k * HOMAGE.bow, () => { if (!live(run)) return; crowdBow(HOMAGE.bow - 0.25, k === HOMAGE.n - 1);
          span(cast.ton, 'prostrate', KRAP.from, KRAP.to, HOMAGE.bow - 0.3, { fade: 0.4, hold: k === HOMAGE.n - 1 ? 0 : -0.35, then: k === HOMAGE.n - 1 ? (P) => rest(P, 0.9) : null }); }); });
      return true;
    }
    function homageDone(run) {
      if (!live(run)) return;
      play.homage = true; play.chanting = false; saveMark();
      if (kit) { kit.pray(false, { secs: 1.2 }); kit.pose('lying', { y: KNEEL.y, yaw: PLACE_RY, span: KNEEL.span, pitchLo: KNEEL.lo, pitchHi: KNEEL.hi, secs: 0.3 }); if (kit.captions) kit.captions(null); }
      after(1.4, () => { if (live(run)) festivalBegin(); });
    }
    /* THE BOWS, his own: the view lowered to the ground and brought back, laid on his look as a delta and taken off again
       (v11.1), once for each bow of `n` over `secs` */
    function bowTick(wdt) {
      const Bw = play.bow; if (!Bw) return;
      if (!live(Bw.run)) { play.bow = null; return; }
      const t0 = Bw.t; Bw.t += wdt;
      const one = Bw.secs / Bw.n, u = Math.min(1, Bw.t / Bw.secs);
      const ph = (Bw.t % one) / one, d = -Bw.depth * Math.pow(Math.sin(Math.PI * Math.min(1, ph * 1.12)), 2) * (u < 1 ? 1 : 0);
      pitch.rotation.x += d - Bw.prev; Bw.prev = d;
      if (Bw.sound) for (let k = 0; k < Bw.n; k++) { const at = k * one + one * 0.3; if (t0 < at && Bw.t >= at) fx(Bw.sound, 0.36); }
      if (u >= 1) { pitch.rotation.x -= Bw.prev; play.bow = null; if (Bw.done) Bw.done(); }
    }

    /* ================================================================ THE FILM OF THE FESTIVAL, THEN P4 · THE LINE AND THE PULL */
    function festivalBegin() {
      const run = play.run;
      const ok = kit && kit.film && kit.film('festival', { onDone: () => { if (live(run)) lineBegin(false); } });
      if (!ok) lineBegin(false);
    }
    /* the line at Grandmaster Pho's bench, as the film leaves it: the throngs before the masters, the young man kneeling
       before the bench, the player second, Ton at his shoulder */
    function lineStage() {
      look('DAY1', 0); setFormation('bless'); zoneAt(null);
      whenReady(cast.ton, (P) => { put(P, TON_LINE.x, TON_LINE.z, faceTo(TON_LINE.x, TON_LINE.z, PHO_AT[0], PHO_AT[1])); P.seated = false; P.rest.take = 'Idle_3'; P.rest.win = null; rest(P, 0); castSolid(); });
      whenReady(cast.aunt, (P) => { put(P, AUNT_LINE.x, AUNT_LINE.z, AUNT_LINE.ry); rest(P, 0); castSolid(); });
      ymPlace();
      myBai.visible = false;
    }
    /* THE YOUNG MAN IS STOOD WHERE FOUR HANDS CAN MEET ON ONE BOWL: where Grandmaster Pho's two hands are when he lays
       them forward (his own take, at its stillest moment) and where the young man's are when he raises his bai sri are
       both measured on the bodies (handsAt), and the young man is moved so that the two middles stand over one another */
    const PHO_ON = { take: 'Sitting_Answering_Questions', from: 3.5, len: 1.2 }, YM_UP = 2.6;
    function ymPlace() {
      const Y = cast.ym, Ph = cast.pho; if (!Y || !Ph) return;
      const [bx, bz] = benchAt(0.46, YM_B), ry = faceTo(bx, bz, PHO_AT[0], PHO_AT[1]);
      put(Y, bx, bz, ry);
      whenReady(Y, () => whenReady(Ph, () => {
        play.ymHands = meetHands(Ph, PHO_ON.take, PHO_ON.from + PHO_ON.len * 0.5, Y, 'offer', YM_UP);
        Y.group.visible = true; rest(Y, 0);
        baiPut(ymBai, Y.group.position.x, 0.012, Y.group.position.z, 0.4); ymBai.visible = false; }));
    }
    function lineBegin(resumed) {
      const run = play.run;
      lineStage();
      yaw.position.set(LINE_AT.x, EYE, LINE_AT.z); yaw.rotation.y = phoYawFrom(LINE_AT); pitch.rotation.x = -0.08;
      if (kit) { kit.pose('standing', { secs: 0.05 }); kit.root(true); if (kit.getFade && kit.getFade() > 0.01) kit.fade(0, 1.1); }
      play.knelt = false; play.looked = false; play.busy = true; play.pull = null; handsAway(false);
      baiHands(true, { p: 0, secs: 0.01 });
      setPhase('festival', { complete: false });
      /* THE BLESSING AHEAD OF HIM (photographs 5 and 6), then the pull */
      const T = { up: 1.2, on: 2.6, petals: 6.4, down: 9.6, trance: 10.4, rise: 11.2, pull: 12.0, say: 15.5 };
      after(T.up, () => { if (!live(run)) return; ymBai.visible = true; play.ymCarry = true; span(cast.ym, 'offer', 5.9, YM_UP, 1.5, { hold: 0.5, fade: 0.5 }); lay(cast.ym, ymGrip, { secs: 0.5 }); fx('x3baitake', 0.22, 0.2); });
      after(T.on, () => { if (!live(run)) return; hold(cast.pho, PHO_ON.take, PHO_ON.from, PHO_ON.len, 0.9); lay(cast.pho, phoGrip, { secs: 1.0 }); });
      after(T.petals, () => { if (!live(run)) return; lay(cast.pho, null, { secs: 0.45 }); span(cast.pho, 'Sit_Cheer_with_Left_Hand', 0.15, 2.5, 2.7, { fade: 0.5, then: (P) => rest(P, 0.8) });
        after(1.3, () => { if (!live(run)) return; const Y = cast.ym.group.position, h = PHO_HAND_UP(); petalBurst(h, [Y.x, Y.z], dayClock.t, { r: 0.7, up: 1.2 }); fx('x3petals', 0.45, 0.2); }); });
      after(T.down, () => { if (!live(run)) return; lay(cast.ym, null, { secs: 0.5 });
        span(cast.ym, 'offer', YM_UP + 0.5, 6.4, 1.6, { fade: 0.2, then: (P) => { play.ymCarry = false; ymSetDown(); take(P, 'sway', 1.4); } }); });
      after(T.rise, () => { if (live(run)) span(cast.pho, 'Sit_to_Stand_Transition_M', 0.3, 2.25, 2.6, { fade: 0.6, hold: 0.28 }); });
      after(T.pull, () => { if (!live(run)) return; play.pull = { k: 0, to: 1, secs: 9, offer: false }; });
      after(T.say, () => { if (!live(run)) return; queueLine('q3u1');
        queueFn(() => { if (!live(run)) return;
          /* he stands, and has lifted his eyes: he is looking straight at him */
          span(cast.pho, 'Sit_to_Stand_Transition_M', 2.25, 3.4, 1.8, { fade: 0.3, hold: 0.5 }); gaze(cast.pho, 'lens', { secs: 1.6, reach: 0.9 });
          play.pull.offer = true; play.busy = false; objectiveFor('festival', { complete: false }); }); });
    }
    /* where his raised hand is at the top of the throw */
    /* FOUR HANDS ON ONE BOWL (photograph 5), in play as in the film: the young man's bai sri rides his take's hands
       (measured before anything is laid on them: the grip is asked for before the hands are moved), his own hands
       hold it under its swell, and Grandmaster Pho's are laid on it from above */
    const ymGrip = () => { if (play.ymCarry) baiOnHands(ymBai, cast.ym, -0.03); const p = ymBai.position, g = cast.ym.group.position; return baiGrip([p.x, p.y, p.z], BAI.s, [g.x, g.z], 'under'); };
    const phoGrip = () => { const p = ymBai.position, g = cast.pho.group.position; return baiGrip([p.x, p.y, p.z], BAI.s, [g.x, g.z], 'on'); };
    /* (lowered, it is set down on the carpet before his knees) */
    function ymSetDown() { const Y = cast.ym.group, p = ymBai.position, ry = Y.rotation.y; play.ymSet = { from: [p.x, p.y, p.z], to: [Y.position.x + Math.sin(ry) * 0.46, 0.012, Y.position.z + Math.cos(ry) * 0.46], k: 0 }; }
    function PHO_HAND_UP() { const P = cast.pho; if (P && P.handR) { P.group.updateWorldMatrix(true, true); P.handR.getWorldPosition(_ph); return [_ph.x, _ph.y + 0.08, _ph.z]; } return [PHO_AT[0], 1.75, PHO_AT[1] - 0.3]; }
    /* the pull, every frame: his hands, his heart, the edges of the day and its sound, all on one number */
    function pullTick(wdt) {
      const Pu = play.pull; if (!Pu || !kit) return;
      if (Pu.k !== Pu.to) { const st = wdt / Pu.secs; Pu.k = Pu.to > Pu.k ? Math.min(Pu.to, Pu.k + st) : Math.max(Pu.to, Pu.k - st); }
      const k = smo(Pu.k);
      if (kit.tremble) kit.tremble(0.55 * k, { secs: 0.2 });
      if (kit.pulse) kit.pulse(k > 0.02 ? { bpm: 72 + 54 * k, erratic: 0.25 * k, vol: 0.5 * k } : null);
      if (kit.chill) kit.chill(0.5 * k, { secs: 0.2, tint: 'grey' });
      if (kit.hush && !Pu.hushOwn) kit.hush(0.55 * k, { secs: 0.2 });
      if (Pu.to === 0 && Pu.k === 0) { play.pull = null; if (kit.tremble) kit.tremble(0, { secs: 0.3 }); if (kit.pulse) kit.pulse(null); if (kit.chill) kit.chill(0, { secs: 0.5 }); if (kit.hush) kit.hush(0, { secs: 0.6 }); }
    }
    /* LOOK AT HIM: one press. The lens narrows a little on the man in white while the day's sound closes down to one
       tone; he does nothing but look. The hands come down, the heart slows, and the music is only music again. */
    function lookAtHim() {
      const Pu = play.pull;
      if (phase !== 'festival' || !Pu || !Pu.offer || play.looked || play.busy) return false;
      const run = play.run; play.looked = true; play.busy = true; objectiveFor('festival');
      Pu.hushOwn = true;
      if (kit.hush) kit.hush(1, { secs: 1.3 }); if (kit.lens) kit.lens(46, { secs: 1.7 });
      fx('x3tone', 0.45);
      lookAt(PHO_HEAD_NOW(), 1.5, () => { if (!live(run)) return;
        Pu.to = 0; Pu.secs = 3.2;
        after(3.4, () => { if (!live(run)) return;
          if (kit.lens) kit.lens(null, { secs: 2.4 }); if (kit.hush) kit.hush(0, { secs: 2.6 });
          gaze(cast.pho, null, { secs: 1.4 });
          span(cast.pho, 'Sit_to_Stand_Transition_M', 3.4, 0.3, 3.4, { fade: 0.3, then: (P) => rest(P, 0.8) });
          whenReady(cast.ym, (P) => { P.rest.take = 'seiza'; rest(P, 2.0); });
          setPhase('seen');
          after(1.2, () => { if (live(run)) seenLines(run); }); }); });
      return true;
    }
    function seenLines(run) {
      play.busy = true;
      queueLine('q3u2'); queueGap(0.4); line('tn3m1', cast.ton); queueGap(0.3); queueLine('q3u3'); queueGap(0.3); line('tn3m2', cast.ton);
      queueFn(() => { if (live(run)) checkBegin(false); });
    }

    /* ================================================================ P5 · THE CHECK */
    function checkBegin(resumed) {
      play.busy = false; play.pull = null;
      if (kit) { kit.root(false); if (resumed) { kit.pose('standing', { secs: 0.05 }); if (kit.getFade && kit.getFade() > 0.01) kit.fade(0, 0.9); } }
      setPhase('check', { complete: false });
      if (play.asked.size >= 2 && !play.checked) { const run = play.run; after(0.8, () => { if (live(run)) checkClose(run); }); }
    }
    function ask(who) {
      if (phase !== 'check' || play.busy || play.asked.has(who) || play.checked) return false;
      const run = play.run; play.busy = true; play.asked.add(who); saveMark(); objectiveFor('check');
      const P = who === 'ton' ? cast.ton : cast.aunt;
      whenReady(P, (Q) => { Q.group.rotation.y = faceTo(Q.group.position.x, Q.group.position.z, yaw.position.x, yaw.position.z); });
      if (who === 'ton') { queueLine('q3c1'); queueGap(0.3); line('tn3c1', cast.ton); }
      else { queueLine('q3c2'); queueGap(0.3); line('ds3c1', cast.aunt); }
      queueFn(() => { if (!live(run)) return; play.busy = false;
        if (play.asked.size >= 2) checkClose(run); else objectiveFor('check', { complete: false }); });
      return true;
    }
    function checkClose(run) {
      play.busy = true; objectiveFor('check');
      queueGap(0.4); line('tn3c2', cast.ton); queueGap(0.4); queueLine('q3c3');
      queueFn(() => { if (!live(run)) return; play.checked = true; bank(W.noteAsked, 3); saveMark(); play.busy = false; betweenBegin(); });
    }

    /* ================================================================ THE NIGHT BETWEEN (a film), THEN DAY TWO */
    function betweenBegin() {
      const run = play.run;
      const ok = kit && kit.film && kit.film('between', { onDone: () => { if (live(run)) dawnBegin(false); } });
      if (!ok) dawnBegin(false);
    }
    function dawnStage() {
      look('DAWN', 0); auraAt(0, 0); mistK = 1; burstsClear(); zoneAt(null);
      whenReady(cast.ym, (P) => { P.group.visible = false; }); ymBai.visible = false;
      whenReady(cast.pho, (P) => { rest(P, 0); gaze(P, null); });
      whenReady(cast.ton, (P) => { put(P, TON_DAWN.x, TON_DAWN.z, faceTo(TON_DAWN.x, TON_DAWN.z, DAWN_AT.x, DAWN_AT.z)); P.seated = false; P.rest.take = 'Idle_3'; P.rest.win = null; rest(P, 0); castSolid(); });
      whenReady(cast.aunt, (P) => { put(P, P.home.x, P.home.z, P.home.ry); rest(P, 0); castSolid(); });
      dayCast(false);
    }
    function dawnBegin(resumed) {
      dawnStage();
      yaw.position.set(DAWN_AT.x, EYE, DAWN_AT.z); yaw.rotation.y = phoYawFrom(DAWN_AT); pitch.rotation.x = -0.04;
      if (kit) { kit.pose('standing', { secs: 0.05 }); kit.root(false); if (kit.getFade && kit.getFade() > 0.01) kit.fade(0, 1.4); }
      play.knelt = false; play.bowed = false; play.busy = false; handsAway(false);
      myBai.visible = false; baiHands(true, { p: 0, secs: 0.01 });
      zoneAt(KNEEL2);
      setPhase('dawn', { complete: false });
      if (warmSounds) warmSounds(WARM_DAY2);
    }
    /* P6 · he kneels on the carpet before him, and sets the bai sri down beside him */
    /* (0.45 m before the low table's front edge: at 1.5 m before the bench its bowl stood under the table's edge and its
       candle came up through the table's top: photographed from above in the close) */
    /* (and ON the carpet, whose edge is 0.95 m to the sitters' right of the bench's middle: at 0.98 it stood on the turf) */
    const BESIDE = (() => { const [x, z] = benchAt(0.8, 1.9); return { x, z }; })();                   // beside his left knee and a little before it
    function kneelPho(instant) {
      if (play.knelt && !instant) return false;
      play.knelt = true; zoneAt(null);
      if (kit) kit.root(true);
      const ry = phoYawFrom(KNEEL2), setDown = () => { baiHands(false); baiPut(myBai, BESIDE.x, 0.012, BESIDE.z, 0.6); handsAway(true); };
      if (instant) {
        setDown();
        yaw.position.x = KNEEL2.x; yaw.position.z = KNEEL2.z; yaw.rotation.y = ry; pitch.rotation.x = 0.16;
        if (kit) kit.pose('lying', { y: KNEEL.y, yaw: ry, span: KNEEL.span, pitchLo: KNEEL.lo, pitchHi: KNEEL.hi, secs: 0.05 });
        return true;
      }
      const run = play.run; play.busy = true;
      fx('x3kneel', 0.32); setPhase('knelt'); baiRaise(-1, 0.9);
      turnTo(ry, 1.1, Object.assign({ pos: KNEEL2, pitch: 0.16 }, KNEEL), () => { if (!live(run)) return; fx('x3baiset', 0.36); setDown();
        after(0.5, () => { if (!live(run)) return; play.busy = false; objectiveFor('knelt', { complete: false }); }); });
      return true;
    }
    /* one bow, the bow owed a teacher; then he is told to sit */
    function bowPho() {
      if (phase !== 'knelt' || !play.knelt || play.bowed || play.busy) return false;
      const run = play.run, ry = phoYawFrom(KNEEL2); play.busy = true; objectiveFor('knelt');
      handsAway(false);
      if (kit) { kit.pray(true, { secs: 0.8, y: -0.3 }); kit.pose('lying', { y: KNEEL.y, yaw: ry, span: 0.02, pitchLo: -1.4, pitchHi: KNEEL.hi, secs: 0.3 }); }
      after(0.9, () => { if (!live(run)) return;
        play.bow = { t: 0, prev: 0, n: 1, secs: 4.6, depth: 1.05, run, sound: 'x3kneel', done: () => { if (!live(run)) return;
          play.bowed = true; saveMark();
          if (kit) { kit.pray(false, { secs: 1.1 }); kit.pose('lying', { y: KNEEL.y, yaw: ry, span: KNEEL.span, pitchLo: KNEEL.lo, pitchHi: KNEEL.hi, secs: 0.3 }); }
          after(1.25, () => { if (live(run)) handsAway(true); });
          after(0.7, () => { if (!live(run)) return; line('ph3g1', cast.pho);
            queueFn(() => { if (!live(run)) return; play.busy = false; objectiveFor('knelt', { complete: false }); }); }); } }; });
      return true;
    }
    /* P7, P8 · the telling and the answers: two films, one after the other */
    function tellAll() {
      if (phase !== 'knelt' || !play.bowed || play.busy || !kit || !kit.film) return false;
      const run = play.run; play.busy = true; objectiveFor('knelt');
      const next = () => { if (!live(run)) return; const ok2 = kit.film('answers', { onDone: () => { if (live(run)) toldBegin(false); } }); if (!ok2) toldBegin(false); };
      const ok = kit.film('tell', { onDone: next });
      if (!ok) next();
      return true;
    }
    function toldBegin(resumed) {
      const run = play.run;
      play.busy = true; setPhase('told', { complete: false }); handsAway(true);
      if (kit && kit.getFade && kit.getFade() > 0.01) kit.fade(0, 1.0);
      after(resumed ? 1.0 : 0.6, () => { if (!live(run)) return; line('ph3b0', cast.pho); queueFn(() => { if (live(run)) breathBegin(); }); });
    }

    /* ================================================================ P9 · OPEN AND CLOSE (the forty-sixth seam)
       Hold to open, let go to close. While he holds, THE WORLD COMES IN: the light widens, the morning's mist thins, the
       gold on Grandmaster Pho rises, and (M7) every sound of the ground comes near. Each breath has a band that is
       enough, seconds wide, and an edge beyond it; nothing here tests a finger's speed. Three breaths: he is told when;
       he chooses when; it pulls, and he closes anyway. */
    const BREATHS = [{ enough: 2.6, edge: 7.5, told: true, lead: 1.4 }, { enough: 2.4, edge: 5.6 }, { enough: 2.4, edge: 5.2, pull: 1.3 }];
    const open = { k: 0, shown: -1, over: 0 };
    function breathBegin() {
      if (!kit || !kit.event) { taughtBegin(false, { closed: 0, held: 0 }); return; }
      const run = play.run;
      play.busy = true; setPhase('breath', { complete: false });
      const said = { open: false };
      kit.event({
        kind: 'breath', low: true, title: W.breathTitle, prompt: W.breathTitle, label: W.breathTitle,
        brief: TOUCHY ? W.breathBrief : W.breathBriefKey, whereWord: TOUCHY ? W.breathWhere : W.breathWhereKey,
        openWord: W.breathOpen, closeWord: W.breathClose, restWord: '', breaths: BREATHS, gain: 2, cost: 2, idle: 22, at: { sx: 0.5, sy: 0.74 },
        onLevel: (k, held, i, st) => { open.k = k; open.i = i; open.st = st;
          if (st === 'wait' && i === 0 && !said.open) { said.open = true; fxLine('ph3b1'); }
          if (i === 2 && (st === 'open' || st === 'pull')) play.pull3 = k; else play.pull3 = 0; },
        onEnough: (i) => { if (i === 0) fxLine('ph3b2'); },
        onBreath: (rep) => { if (!live(run)) return 0;
          if (rep.result === 'held') { open.over = 1; fxLine('ph3bx'); if (kit.flash) kit.flash({ color: '#fff6e0', secs: 0.9, k: 0.55 });
            /* (he closes it for him, and THEN says what the next breath asks: held to its edge, the second breath went
               straight to the third with "It will pull. Close anyway." never said. The finger's play-through found it,
               on a box slow enough to hold two breaths past their edge) */
            const nx = rep.i === 0 ? 'ph3b3' : rep.i === 1 ? 'ph3b4' : null;
            if (!nx) return 1.6;
            const gap = (SECS.ph3bx || 0.8) + 0.9;
            after(gap, () => { if (live(run) && phase === 'breath') fxLine(nx); });
            return gap + (SECS[nx] || 3.5) + 0.4; }
          if (rep.result === 'unopened' && rep.again) { fxLine('ph3by'); return (SECS.ph3by || 5) + 0.5; }
          const next = rep.i + 1;
          if (next === 1) { fxLine('ph3b3'); return (SECS.ph3b3 || 3.5) + 0.4; }
          if (next === 2) { fxLine('ph3b4'); return (SECS.ph3b4 || 4.2) + 0.4; }
          return 0.6; },
        onIdle: (i) => { if (i === 0) fxLine('ph3b1'); }
      }).then((r) => { if (!live(run) || phase !== 'breath') return; open.k = 0; play.pull3 = 0;
        if (r && r.aborted) return;                                              // (a film or a reset took it: whoever did owns what is next)
        taughtBegin(false, { closed: r && r.closed != null ? r.closed : 0, held: r && r.held != null ? r.held : 0 }); });
    }
    /* a line said INSIDE the event: its clock is the event's, and the queue is held while a panel is up; it is one voice
       at a time because the event waits each line's length before the next breath is live (onBreath's answer) */
    function fxLine(name) { heard.add(name); whenReady(cast.pho, (P) => talk(P, SECS[name] || 1.2)); if (worldSfx && !(soundOff && soundOff())) worldSfx(name, 1, 1, 0); }
    /* the world laid on the level, every frame: the light, the mist, the gold; past the band, the white and the lag */
    const _lerpHex = (a, b, k) => _c1.setHex(a).lerp(_c2.setHex(b), k).getHex(), _c1 = new THREE.Color(), _c2 = new THREE.Color();
    function dayBlend(A, Bp, k) {
      const n = (x, y) => x + (y - x) * k, arr = (x, y, col) => x.map((v, i) => (col[i] ? _lerpHex(v, y[i], k) : n(v, y[i])));
      return { stops: A.stops.map((s, i) => [n(s[0], Bp.stops[i][0]), '#' + _c1.set(s[1]).lerp(_c2.set(Bp.stops[i][1]), k).getHexString()]),
               bg: _lerpHex(A.bg, Bp.bg, k), fog: arr(A.fog, Bp.fog, [1, 0]), hemi: arr(A.hemi, Bp.hemi, [1, 1, 0]), key: arr(A.key, Bp.key, [1, 0, 0, 0, 0]),
               fill: arr(A.fill, Bp.fill, [1, 0]), stars: 0, moon: 0, sun: n(A.sun, Bp.sun), clouds: n(A.clouds, Bp.clouds),
               vmHemi: arr(A.vmHemi, Bp.vmHemi, [1, 1, 0]), vmKey: arr(A.vmKey, Bp.vmKey, [1, 0]) };
    }
    function openTick(wdt, t) {
      if (phase !== 'breath' && open.shown <= 0 && open.over <= 0) return;
      const live2 = phase === 'breath', k = live2 ? open.k : 0, e = smo(c01(k / 0.9));
      if (Math.abs(e - open.shown) > 0.004 || (!live2 && open.shown !== 0)) { open.shown = live2 ? e : 0;
        if (kit) kit.daylight(open.shown > 0 ? dayBlend(DAWN, OPENED, open.shown) : PRESETS.DAWN, 0);
        phoLook.level.value = PHO_LEVEL.DAWN + (PHO_LEVEL.OPENED - PHO_LEVEL.DAWN) * open.shown; mistK = 1 - 0.7 * open.shown; }
      auraAt(open.shown * 0.95, t);
      /* the third breath pulls: his hands begin to drift as they did in the line */
      if (kit && kit.tremble) kit.tremble(live2 ? 0.4 * smo(c01((play.pull3 || 0) * 1.4 - 0.5)) : 0, { secs: 0.2 });
      /* held to the edge: the picture lags and shakes a moment, and settles */
      if (open.over > 0) { open.over = Math.max(0, open.over - wdt / 1.8); if (kit && kit.smear) kit.smear(0.6 * open.over, { secs: 0.1 }); }
    }
    function taughtBegin(resumed, res) {
      const run = play.run;
      play.breath = res || play.breath || { closed: 0, held: 0 };
      play.busy = true; setPhase('taught', { complete: false });
      const c = play.breath.closed;
      bank(c >= 3 ? W.noteBreath3 : c === 2 ? W.noteBreath2 : c === 1 ? W.noteBreath1 : W.noteBreath0, 0);
      after(resumed ? 1.0 : 0.9, () => { if (!live(run)) return;
        line('ph3b5', cast.pho); queueGap(0.6); line('ph3p1', cast.pho); queueGap(0.35); line('ph3p2', cast.pho); queueGap(0.35); line('ph3p3', cast.pho);
        queueFn(() => { if (live(run)) decideBegin(false); }); });
    }
    function decideBegin(resumed) {
      play.busy = false;
      setPhase('decide', { complete: false });
      /* the four endings share one close, and its cues are fired by a helper (endingScene): the engine warms a scene's
         cues by reading that scene's OWN source, so these would play nothing the first time. Warmed here by name, a
         whole ending before they are wanted (chaptertest reads this list, and fails a cue of the close it lacks) */
      if (warmSounds) warmSounds(['x3closemus', 'x3baitake', 'ph3z0', 'ph3z1', 'x3tone', 'x3petals', 'q3z1', 'x3lastmus', 'x3baiset', 'ph3z2', 'q3K1']);
      if (resumed) after(0.6, openDecision); else openDecision();
    }

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

    /* ---------------------------------------------------------------- the hotspots (each pressed, never looked at: v21.9) */
    const _hv = new THREE.Vector3();
    const markHit = (posF, frac = 0.1) => (x, y) => { const p = posF(); camera.updateMatrixWorld(); _hv.set(p.x, p.y, p.z).project(camera);
      return _hv.z < 1 && Math.hypot(x - _hv.x, (y - _hv.y) / Math.max(0.3, camera.aspect)) < frac; };
    const hsTon = { id: 'ton', pos: { x: 0, y: 1.5, z: 0 }, radius: 2.9, prompt: W.hotTon, hits: markHit(TON_HEAD, 0.14),
      enabled: () => phase === 'arrive' && !play.busy, onInteract() { return tonTalk(); } };
    const hsAskTon = { id: 'askTon', pos: { x: 0, y: 1.5, z: 0 }, radius: 2.9, prompt: W.hotAskTon, hits: markHit(TON_HEAD, 0.14),
      enabled: () => phase === 'check' && !play.busy && !play.checked && !play.asked.has('ton'), onInteract() { return ask('ton'); } };
    const hsAskAunt = { id: 'askAunt', pos: { x: 0, y: 1.42, z: 0 }, radius: 2.9, prompt: W.hotAskAunt, hits: markHit(AUNT_HEAD, 0.14),
      enabled: () => phase === 'check' && !play.busy && !play.checked && !play.asked.has('aunt'), onInteract() { return ask('aunt'); } };
    const hsLook = { id: 'look', pos: { x: PHO_HEAD.x, y: PHO_HEAD.y, z: PHO_HEAD.z }, radius: 9, prompt: W.hotLook, anyView: true, hits: markHit(PHO_HEAD_NOW, 0.16),
      enabled: () => phase === 'festival' && !!play.pull && play.pull.offer && !play.looked && !play.busy, onInteract() { return lookAtHim(); } };
    const hotspots = [
      hsTon,
      { id: 'tables', pos: { x: TABLES_AT.x, y: 1.25, z: TABLES_AT.z - 1.0 }, radius: 2.6, prompt: W.hotTables, hits: markHit(() => BUDDHA, 0.2),
        enabled: () => phase === 'baisri' && play.bai && !play.busy, onInteract() { return payRespects(); } },
      { id: 'place', pos: { x: PLACE.x, y: 0.9, z: PLACE.z }, radius: 2.3, prompt: W.hotPlace, mark: false,
        enabled: () => phase === 'tables' && !play.knelt && !play.busy, onInteract() { return kneelPlace(false); } },
      /* (pressed from where he kneels, named by the badge, no mark: chapter 2's rule for a press made kneeling) */
      { id: 'homage', pos: { x: PLACE.x, y: 0.9, z: PLACE.z }, radius: 4, anyView: true, prompt: W.hotHomage, mark: false,
        enabled: () => phase === 'place' && play.knelt && !play.homage && !play.busy && !play.turning, onInteract() { return homage(); } },
      hsLook, hsAskTon, hsAskAunt,
      { id: 'kneel2', pos: { x: KNEEL2.x, y: 0.9, z: KNEEL2.z }, radius: 2.3, prompt: W.hotKneel, mark: false,
        enabled: () => phase === 'dawn' && !play.knelt && !play.busy, onInteract() { return kneelPho(false); } },
      { id: 'bow2', pos: { x: PHO_HEAD.x, y: 1.0, z: PHO_HEAD.z }, radius: 4, anyView: true, prompt: W.hotBow, mark: false,
        enabled: () => phase === 'knelt' && play.knelt && !play.bowed && !play.busy && !play.turning, onInteract() { return bowPho(); } },
      { id: 'tell', pos: { x: PHO_HEAD.x, y: 1.0, z: PHO_HEAD.z }, radius: 4, anyView: true, prompt: W.hotTell, mark: false,
        enabled: () => phase === 'knelt' && play.bowed && !play.busy, onInteract() { return tellAll(); } }
    ];
    /* a mark rides the person it is on */
    function hotTick() {
      const t = TON_HEAD(); hsTon.pos.x = hsAskTon.pos.x = t.x; hsTon.pos.y = hsAskTon.pos.y = t.y; hsTon.pos.z = hsAskTon.pos.z = t.z;
      const a = AUNT_HEAD(); hsAskAunt.pos.x = a.x; hsAskAunt.pos.z = a.z;
      const h = PHO_HEAD_NOW(); hsLook.pos.x = h.x; hsLook.pos.y = h.y; hsLook.pos.z = h.z;
    }

    /* ---------------------------------------------------------------- the frame */
    let windClock = 0;
    function updateNotes(dt, t) {
      const st = getState();
      const now = wallNow(), raw = lastWall0 ? Math.max(0, now - lastWall0) : 0, wdt = Math.min(0.25, raw); lastWall0 = now;
      /* (the people's own clocks run in a film too, v5.19: a film holds only those it has posed) */
      windClock += wdt; windTick(windClock); peopleTick(wdt, st !== 'cine'); mistTick(windClock); hazeTick(windClock); flamesTick(windClock); bulbsTick(windClock);
      /* (after the people: what is laid on a body's arm is laid on the pose its take has just written) */
      taperTick(windClock); kidsTick(wdt, st);
      if (st !== 'cine') { peopleLevels(); lodTick(); zoneTick(now); }
      /* a Continue is placed before the card (the v4.8 contract): the saved moment's picture stands under it */
      if (!booted && !preplaced && kit) { const w0 = preStage(kit.getPhase()); if (w0) preplaced = w0; }
      mixBeds(wdt, st);
      const liveSt = st === 'play';
      if (!liveSt) { if (!pausedAt) pausedAt = now; lastWall = 0; return; }
      /* a voice plays on under a panel while the chapter's clock stands still: its booking comes forward by the time the
         panel was up, as far as the voice's own end (e3c3's v21.21 law) */
      if (pausedAt) { const away = Math.max(0, now - pausedAt); pausedAt = 0;
        if (speak.voiceTo > dayClock.t) { const cut = Math.min(away, speak.voiceTo - dayClock.t); speak.until -= cut; speak.voiceTo -= cut; } }
      if (lastWall) dayClock.t += Math.min(0.5, now - lastWall);
      lastWall = now;
      if (!booted) { booted = true; applyPhase(kit ? kit.getPhase() : null); }
      runTodo(); runSpeak(); runQueue();
      playTick(now, wdt);
    }
    function playTick(now, wdt) {
      hotTick();
      turnTick(wdt); bowTick(wdt); baiTick(wdt); awayTick(); pullTick(wdt); openTick(wdt, windClock);
      ambTick(); extrasSound();
      burstsTick(dayClock.t);
      /* what a person carries rides his hands */
      if (play.tonGive) { const G = play.tonGive; G.k = Math.min(1, G.k + wdt / 0.45);                   // lifted off the table into his hands, then carried by them
        if (handsMid(cast.ton, _hv)) { const k = smo(G.k); myBai.position.set(lp(TON_BAI.x, _hv.x, k), lp(TON_BAI.y, _hv.y - 0.02, k), lp(TON_BAI.z, _hv.z, k)); } }
      turnsTick(wdt);
      if (play.ymCarry && !(cast.ym.lay || cast.ym.layK > 0)) baiOnHands(ymBai, cast.ym, -0.03);     // (while his hands are laid on it, the grip itself carries it: ymGrip)
      if (play.ymSet) { const G = play.ymSet; G.k = Math.min(1, G.k + wdt / 0.5); const k = smo(G.k); ymBai.position.set(lp(G.from[0], G.to[0], k), lp(G.from[1], G.to[1], k * k), lp(G.from[2], G.to[2], k)); if (G.k >= 1) play.ymSet = null; }
      /* he walks onto the place: he kneels (the press is offered too) */
      if (phase === 'tables' && !play.knelt && !play.busy && Math.hypot(yaw.position.x - PLACE.x, yaw.position.z - PLACE.z) < 0.45) kneelPlace(false);
      if (phase === 'dawn' && !play.knelt && !play.busy && Math.hypot(yaw.position.x - KNEEL2.x, yaw.position.z - KNEEL2.z) < 0.45) kneelPho(false);
      if (phase === 'tables' && !zone.g.visible && !play.knelt) zoneAt(PLACE);
    }
    /* TWO SOUNDS THAT BELONG TO SOMEONE (13 Nov). The wick catching, each time the taper's tip comes to a candle: heard
       by one who stands near her, quieter the further he is. And the child's laugh the ground already had, the
       children's own when they break into a run, at their place. Each waits its turn with the ground's other
       one-shots (one at a time, never over a line, never in the bow or the pull) */
    function extrasSound() {
      if (!worldSfx || (soundOff && soundOff())) return;
      const free = dayClock.t >= ambBusy && dayClock.t >= speak.until && !play.bow && !play.pull;
      if (taper.on && taper.P.ready) { const u = ((windClock % TAPER.T) + TAPER.T) % TAPER.T, at = u < 3 ? 0 : (u >= 4.5 && u < 7.5 ? 1 : -1);
        if (at >= 0 && at !== wickAt && free) { const wx = TAPER.at[0] - 0.2, wz = TAPER.at[1] - 0.84, d = Math.hypot(yaw.position.x - wx, yaw.position.z - wz);
          if (d < 6 && worldSfx('x3wick', 0.3 * c01(1.25 - d / 6), 1, panAt(wx, wz))) ambBusy = dayClock.t + 1.4; }
        wickAt = at; }
      const ph = kidsDir.ph;
      if (ph !== kidsPh) { kidsPh = ph;
        if ((ph === 'runE' || ph === 'runW') && free && dayOne.visible && kids[0].P.ready) { const g = kids[0].P.group.position;
          if (worldSfx('x3os1', 0.34, 1, panAt(g.x, g.z))) { ambLast = 'x3os1'; ambBusy = dayClock.t + 3.8; } } }
    }
    function updatePile() {}
    function updateFire() {}
    function updateSlow() {}

    /* ------------------------------------------------------------ a resume (§9)
       A CONTINUE IS PLACED BEFORE THE CARD (the v4.8 contract): under the chapter card the saved moment's picture is set,
       so nothing jumps when play begins; applyPhase does it all again on the first live frame, idempotently. The world's
       state (day one, day two, the formation) is derived from the phase and never stored beside it (§9). */
    function preStage(p0) {
      const R = readMark(p0);
      if (R.p === 'arrive') return '';
      if (DAY_TWO.has(R.p)) { dawnStage();
        const knelt = R.p !== 'dawn';
        if (knelt) { yaw.position.x = KNEEL2.x; yaw.position.z = KNEEL2.z; yaw.rotation.y = phoYawFrom(KNEEL2); pitch.rotation.x = 0.16; baiPut(myBai, BESIDE.x, 0.012, BESIDE.z, 0.6);
          if (kit) kit.pose('lying', { y: KNEEL.y, yaw: phoYawFrom(KNEEL2), span: KNEEL.span, pitchLo: KNEEL.lo, pitchHi: KNEEL.hi, secs: 0.05 }); }
        else { yaw.position.set(DAWN_AT.x, EYE, DAWN_AT.z); yaw.rotation.y = phoYawFrom(DAWN_AT); pitch.rotation.x = -0.04; myBai.visible = false; }
        return R.p; }
      dayOneStage();
      if (R.p === 'festival' || R.p === 'seen' || R.p === 'check') { lineStage(); yaw.position.set(LINE_AT.x, EYE, LINE_AT.z); yaw.rotation.y = phoYawFrom(LINE_AT); pitch.rotation.x = -0.08; return R.p; }
      setFormation('arrive');
      if (R.p === 'baisri') { tonHome(); myBai.visible = false; return R.p; }
      tonToPlace();
      if (R.p === 'tables') { myBai.visible = false; yaw.position.set(TABLES_AT.x, EYE, TABLES_AT.z); yaw.rotation.y = Math.PI; pitch.rotation.x = 0; return R.p; }
      if (R.p === 'place') { kneelPlace(true); play.knelt = false; return R.p; }
      return '';
    }
    function applyPhase(p0) {
      const R = readMark(p0);
      play.homage = R.homage; play.asked = new Set([R.ton && 'ton', R.aunt && 'aunt'].filter(Boolean)); play.checked = R.checked; play.bowed = R.bowed;
      play.breath = R.closed != null ? { closed: R.closed, held: R.held || 0 } : null;
      play.knelt = false; play.looked = false; play.pull = null; play.busy = false;
      if (R.p === 'arrive') { arriveBegin(); return; }
      if (DAY_TWO.has(R.p)) {
        dawnBegin(true);
        if (R.p === 'dawn') return;
        play.bowed = R.bowed;                                                    // (dawnBegin begins a fresh morning and forgets the bow: its receipt is given back. The resume sweep found it: a Continue after his bow offered the bow again)
        kneelPho(true); setPhase('knelt', { complete: false });
        if (R.p === 'knelt') { if (!play.bowed) return; play.busy = true; const run = play.run;
          after(0.8, () => { if (!live(run)) return; line('ph3g1', cast.pho); queueFn(() => { if (live(run)) { play.busy = false; objectiveFor('knelt', { complete: false }); } }); }); return; }
        play.bowed = true;
        if (R.p === 'told' || R.p === 'breath') { toldBegin(true); return; }
        if (R.p === 'taught') { taughtBegin(true, play.breath); return; }
        play.breath = play.breath || { closed: 0, held: 0 };
        decideBegin(true); return;
      }
      /* day one */
      dayOneStage();
      if (warmSounds) warmSounds(WARM_DAY1);
      if (R.p === 'festival') { lineBegin(true); return; }
      if (R.p === 'seen') { lineStage(); baiHands(true, { p: 0, secs: 0.01 }); if (kit) kit.root(true); play.looked = true; setPhase('seen', { complete: false }); const run = play.run; after(0.8, () => { if (live(run)) seenLines(run); }); return; }
      if (R.p === 'check') { lineStage(); baiHands(true, { p: 0, secs: 0.01 }); play.looked = true;
        if (play.checked) { betweenBegin(); return; }
        checkBegin(true); return; }
      setFormation('arrive');
      if (R.p === 'baisri') { tonHome(); myBai.visible = false; baiHands(true, { p: 0, secs: 0.01 }); setPhase('baisri', { complete: false }); return; }
      tonToPlace();
      if (R.p === 'tables') { myBai.visible = false; baiHands(true, { p: 0, secs: 0.01 }); zoneAt(PLACE); setPhase('tables', { complete: false }); return; }
      /* place */
      kneelPlace(true); setPhase('place', { complete: false });
      if (play.homage) { const run = play.run; play.busy = true; after(0.7, () => { if (live(run)) festivalBegin(); }); }
    }

