    /* ================================================================ THE STORY IN PLAY (the plan's §4.1 to §4.3)
       Three phases, each its own receipt on the save (v7.3: the phase string is the only receipt):
         history  HISTORY FIRST: five sources (Ravi, Mala, the clinic's letters, the old photograph, Appa's), her one line
                  to him, and what he tells his teacher;
         sight    THE SIGHT: Spirit Vision opened at his teacher's word, the three presences looked at (aim and press),
                  closed again, and Grandmaster Pho's reading;
         bless    THE BLESSING: Mala lights her lamp, the room goes dark, he takes the holy water, and he KEEPS THE ROOM
                  through the chant (HOLD THE ROOM, the fifty-second seam) in three waves;
         kept     the room kept: the trance's film and the decision at the turning point.
       Nothing in it tests a finger's speed (Chad's rule of v24.12): the shapes are slow, the aim generous, and what is
       asked is discernment (not the husband, not the altar) and open and close (open to see, shut to breathe). */
    const W = DATA.words;
    const PHASES = ['history', 'sight', 'bless', 'kept'];
    const play = { run: 0, busy: false, learned: new Set(), spoke: false, told: false, peeked: false,
                   opened: false, looked: new Set(), closed: false, read: false,
                   water: false, briefed: false, fight: null, appaGone: false, nerveOut: false, held: 0, heat: 0, heatStep: 0,
                   lit: false, dark: 0, fanK: 1, fanTo: 1, scareAt: 0, scareSeed: 0, scared: new Set(), doorTo: -0.12, doorK: -0.12,
                   fogged: false, fogAt: 0, closeHold: 0 };
    let decOpen = false;
    const live = (run) => alive && run === play.run;
    const HEAD_OF = (P, dy = 0.08, fb) => { if (P && P.ready && P.head && P.group.visible) { P.head.getWorldPosition(_pv); return { x: _pv.x, y: _pv.y + dy, z: _pv.z }; } return fb; };
    const AMMA_HEAD = () => HEAD_OF(cast.amma, 0.1, { x: CHAIR.x, y: 1.25, z: CHAIR.z });
    const PHO_HEAD = () => { const P = cast.phoB.group.visible ? cast.phoB : cast.pho; return HEAD_OF(P, 0.1, { x: P.group.position.x, y: P.group.visible && P === cast.phoB ? 1.8 : 1.3, z: P.group.position.z }); };
    const RAVI_HEAD = () => HEAD_OF(cast.ravi, 0.1, { x: cast.ravi.group.position.x, y: 1.75, z: cast.ravi.group.position.z });
    const MALA_HEAD = () => HEAD_OF(cast.mala, 0.1, { x: cast.mala.group.position.x, y: 1.62, z: cast.mala.group.position.z });
    /* the five sources' places, measured from the things themselves (c_props.js) */
    const FOLDER_AT = { x: 4.80, y: 0.80, z: 6.40 };
    const OLDPHOTO_AT = { x: ROOMS.dining.x0 + 0.30, y: 1.25, z: 6.15 };
    const APPA_PHOTO_AT = { x: 0.62, y: 1.50, z: ROOMS.living.z1 - 0.03 };
    const SMALLBOWL_AT = { x: BOWL.x + 0.30, y: 0.04, z: BOWL.z - 0.12 };
    const LAMP_AT = { x: ALTAR.x + 0.08, y: 0.43, z: ALTAR.z - 0.38 };

    /* ---------------------------------------------------------------- the receipts (§9 of the plan: the phase string)
       history: r m f o a (each source learned), k (her line heard), p (he opened his sight before he had listened);
       sight:   v (opened), l1 l2 l3 (each presence looked at);  bless: w (the water taken), x (the water thrown at Appa) */
    function mark() {
      const t = [...play.learned];
      if (play.spoke) t.push('k');
      if (play.peeked) t.push('p');
      if (play.opened) t.push('v');
      for (const c of play.looked) t.push('l' + c);
      if (play.water) t.push('w');
      if (play.appaGone) t.push('x');
      return t.join(',');
    }
    function readMark(p0) {
      const [p1, tag = ''] = String(p0 || '').split(':');
      const p = PHASES.includes(p1) ? p1 : 'history', f = new Set(tag.split(',').filter(Boolean));
      return { p, learned: ['r', 'm', 'f', 'o', 'a'].filter(c => f.has(c)), spoke: f.has('k'), peeked: f.has('p'), opened: f.has('v'),
               looked: ['1', '2', '3'].filter(c => f.has('l' + c)), water: f.has('w'), appaGone: f.has('x') };
    }
    function setPhase(p, opts) { phase = p; if (kit) kit.setPhase(p + ':' + mark()); objectiveFor(p, opts); }
    function saveMark() { if (kit) kit.setPhase(phase + ':' + mark()); }
    function bank(note, s = 0, a = 0) {
      if (!kit || !note) return;
      const got = kit.getConduct ? kit.getConduct().notes : [];
      if (!got.includes(note)) kit.conduct({ note, s, a });
    }

    /* ---------------------------------------------------------------- the orders (one at a time, after the lines that
       hand off to them: v21.21; COMPLETE only for what he did: v8.7) */
    function objectiveFor(p, opts) {
      if (!kit) return;
      if (play.busy) return;                                   // a line is handing off: the order waits for it
      let o = null, wp = null;
      if (p === 'history') {
        if (play.learned.size < 5) o = W.objHistory.replace('{n}', String(play.learned.size));
        else if (!play.spoke) { o = W.objAmma; wp = AMMA_HEAD(); }
        else if (!play.told) { o = W.objTell; wp = PHO_HEAD(); }
      } else if (p === 'sight') {
        if (!play.opened) o = W.objOpen;
        else if (play.looked.size < 3) o = W.objLook.replace('{n}', String(play.looked.size));
        else if (!play.closed) o = W.objClose;
      } else if (p === 'bless') {
        if (!play.water) { o = W.objWater; wp = SMALLBOWL_AT; }
        else if (play.fight && play.fight.on) o = W.objHold;
      }
      kit.objective(o, opts);
      kit.waypoint(wp);
    }

    /* ---------------------------------------------------------------- a line said by one of them (v11.4: he talks
       from its own start and rests after it); `face`: the speaker turns his head to the lens while he says it */
    function say(name, P, face = true) {
      queueLine(name, () => { if (P) { talk(P, SECS[name] || 2.5); if (face) { gaze(P, 'lens', { reach: 0.6, secs: 0.8 }); after((SECS[name] || 2.5) + 0.6, () => { if (P.gaze && P.gaze.target === 'lens') gaze(P, null); }); } } });
    }

    /* ---------------------------------------------------------------- THE LOOK (the flat lit by its tube; or dark)
       and every person at home: the family where they stand, Grandmaster Pho on his stool, his standing self hidden */
    let lookName = 'FLAT';
    function lookAt0(name, secs = 0) {
      lookName = name; if (kit) kit.daylight(PRESETS[name] || FLAT, secs);
      phoLook.level.value = name === 'DARK' ? 0.55 : 1;
      tubeLevel(name === 'DARK' ? 0 : 1);
      if (name !== 'DARK') { play.fanTo = 1; }
    }
    function castHome() {
      for (const k of ['amma', 'ravi', 'mala']) whenReady(cast[k], (P) => { put(P, P.home.x, P.home.z, P.home.ry); P.group.visible = true; gaze(P, null, { secs: 0.01 }); rest(P, 0); });
      whenReady(cast.pho, (P) => { put(P, P.home.x, P.home.z, P.home.ry); P.group.visible = true; gaze(P, null, { secs: 0.01 }); rest(P, 0); });
      whenReady(cast.phoB, (P) => { P.group.visible = false; });
      castSolid();
    }
    /* the people he cannot walk through: a column for each who stands (blockers() hands these boxes to the engine; they
       are moved in place, never replaced) */
    const castBlock = {};
    for (const k of ['ravi', 'mala', 'phoB']) castBlock[k] = new THREE.Box3(new THREE.Vector3(0, 60, 0), new THREE.Vector3(0, 61, 0));
    function castSolid() { for (const k in castBlock) { const P = cast[k], b = castBlock[k], on = !!(P && P.group.visible), g = P.group.position, r = 0.32;
      b.min.set(g.x - r, on ? 0 : 60, g.z - r); b.max.set(g.x + r, on ? 1.5 : 61, g.z + r); } }
    for (const k in castBlock) whenReady(cast[k], castSolid);

    /* ================================================================ PLAY I · HISTORY FIRST (§4.1) */
    const WARM_HISTORY = ['ph4h0', 'rv4h1', 'rv4h2', 'ml4h1', 'q4h1', 'ml4h2', 'ml4h3', 'q4h2', 'am4h1', 'q4h3', 'ph4h1',
                          'u4tubetick', 'u4fanslow', 'u4doorease', 'u4breath', 'u4fog', 'u4sting', 'u4tile', 'u4tile2',
                          'u4os1', 'u4os2', 'u4os3', 'u4os4', 'u4os5', 'u4os6'];
    function historyBegin(R, fresh) {
      lookAt0('FLAT'); castHome(); spiritsHome();
      play.learned = new Set(R.learned); play.spoke = R.spoke; play.peeked = R.peeked; play.told = false;
      setPhase('history', { complete: false });
      if (warmSounds) warmSounds(WARM_HISTORY);
      const run = play.run;
      if (fresh || !play.learned.size) after(1.4, () => { if (!live(run) || phase !== 'history' || heard.has('ph4h0')) return;
        play.busy = true; say('ph4h0', cast.pho); queueFn(() => { play.busy = false; objectiveFor('history', { complete: false }); }); });
      scareArm();
    }
    /* one source: its lines, then the count goes up (and the order with it) */
    function learn(c, lines) {
      if (play.busy || play.learned.has(c) || phase !== 'history') return false;
      play.busy = true; if (kit) kit.waypoint(null);
      for (const [name, P, face] of lines) say(name, P, face !== false);
      queueFn(() => { play.learned.add(c); play.busy = false; saveMark(); objectiveFor('history');
        if (play.learned.size === 5) { const run = play.run; after(0.6, () => { if (live(run)) objectiveFor('history', { complete: false }); }); } });
      return true;
    }
    /* the clinic's letter, read: its words on the screen while he thinks his line */
    function readLetters() {
      if (!learn('f', [['q4h1', null]])) return false;
      if (kit && kit.captions) kit.captions([{ at: 0, end: 7.5, text: W.letter, sub: W.letterSub }]);
      return true;
    }
    /* Amma, to him, quietly: her head turns to him, not to her teacher */
    function ammaSpeaks() {
      if (play.busy || play.spoke || play.learned.size < 5) return false;
      play.busy = true; if (kit) kit.waypoint(null);
      whenReady(cast.amma, (P) => gaze(P, 'lens', { reach: 0.9, secs: 1.4 }));
      queueGap(1.2);
      queueLine('am4h1', () => talk(cast.amma, SECS.am4h1 || 1.8));
      queueGap(0.8);
      queueFn(() => { play.spoke = true; play.busy = false; saveMark(); objectiveFor('history');
        const run = play.run; after(2.5, () => { if (live(run)) whenReady(cast.amma, (P) => gaze(P, null, { secs: 1.6 })); }); });
      return true;
    }
    /* what he tells his teacher, and his answer: the phase is complete */
    function tellPho() {
      if (play.busy || !play.spoke || play.told) return false;
      play.busy = true; if (kit) kit.waypoint(null);
      /* (he looked before he listened: no receipt for listening first; history before conclusions is the lesson) */
      say('q4h3', null);
      say('ph4h1', cast.pho);
      queueFn(() => { play.told = true; play.busy = false;
        if (!play.peeked) bank(W.noteHistory, 0, 3);
        if (kit) kit.objective(null);
        const run = play.run; after(1.6, () => { if (live(run)) sightBegin(readMark('sight:' + mark()), true); }); });
      return true;
    }

    /* ---------------------------------------------------------------- THE HOUSE WHILE HE LISTENS (§4.1: horror,
       never cheap; a seeded stream on the chapter clock, one at a time, never over a line; in the phases they fit) */
    const SCARE_SEED = 0x4c4d;
    function scareArm() { play.scareAt = dayClock.t + 9; }
    function scareRnd() { play.scareSeed = (play.scareSeed * 1103515245 + 12345) >>> 0; return (play.scareSeed >>> 8) / 16777216; }
    function scareTick() {
      if ((phase !== 'history' && phase !== 'sight') || play.busy || dayClock.t < play.scareAt || dayClock.t < speak.until) return;
      const near = Math.hypot(yaw.position.x - CHAIR.x, yaw.position.z - CHAIR.z) < 1.7;
      const pool = ['tube', 'fan', 'ecg'].concat(play.scared.has('door') ? [] : ['door']).concat(near ? ['breath', 'breath'] : []);
      const k = pool[Math.floor(scareRnd() * pool.length)];
      play.scareAt = dayClock.t + 10 + scareRnd() * 8;
      play.scared.add(k);
      if (k === 'tube') { fx('u4tubetick', 0.55, panOf(TUBE_AT)); tubeFlicker(); }
      else if (k === 'fan') { fx('u4fanslow', 0.6, panOf(FAN_AT)); play.fanTo = 0.25; const run = play.run; after(1.3, () => { if (live(run) && phase !== 'bless') play.fanTo = 1; }); }
      else if (k === 'door') { fx('u4doorease', 0.6, panOf(BED3_DOOR)); play.doorTo = -0.34; }
      else if (k === 'breath') { fx('u4breath', 0.7, 0); if (kit && kit.chill) { kit.chill(0.35, { secs: 0.5 }); const run = play.run; after(2.2, () => { if (live(run) && kit) kit.chill(0, { secs: 1.2 }); }); } }
      else if (k === 'ecg') { if (kit && kit.pulse && !visOpen()) { kit.pulse({ erratic: 0.8, secs: 0.3 }); const run = play.run; after(1.6, () => { if (live(run) && kit && !visOpen()) kit.pulse({ erratic: 0, secs: 1.2 }); }); } }
    }
    /* where the sounds come from (panned by the lens's own heading) */
    const TUBE_AT = { x: 0.2, z: 3.6 }, FAN_AT = { x: 1.0, z: 2.4 }, BED3_DOOR = { x: ROOMS.living.x0, z: (DOOR_BED3.z0 + DOOR_BED3.z1) / 2 };
    function panOf(p) { const a = Math.atan2(-(p.x - yaw.position.x), -(p.z - yaw.position.z)), d = angTo(yaw.rotation.y, a); return Math.max(-0.8, Math.min(0.8, -Math.sin(d))); }
    /* the tube's own light: its emissive tube, and the room's key dipped with it */
    const tubeMats = [];
    if (have('w4tubelight')) parseOnce('w4tubelight').then(() => { for (const g of (things.w4tubelight || []).slice(0, 1)) g.traverse(q => { if (q.isMesh) for (const m of [].concat(q.material)) if (m.emissive) { tubeMats.push(m); m.userData.e0 = m.emissiveIntensity; if (m.emissive.getHex() === 0) { m.emissive.set(0xeaf2ff); m.emissiveIntensity = 0.0; m.userData.e0 = 0.0; } } }); }, () => {});
    function tubeLevel(k) { for (const m of tubeMats) m.emissiveIntensity = (m.userData.e0 || 0) * k; }
    function tubeFlicker() {
      const run = play.run, base = PRESETS[lookName] || FLAT;
      const dip = Object.assign({}, base, { key: [base.key[0], base.key[1] * 0.45, base.key[2], base.key[3], base.key[4]], hemi: [base.hemi[0], base.hemi[1], base.hemi[2] * 0.6] });
      const step = (t, f) => after(t, () => { if (live(run) && phase !== 'bless' && phase !== 'kept') f(); });
      step(0, () => { if (kit) kit.daylight(dip, 0.03); tubeLevel(0.2); });
      step(0.09, () => { if (kit) kit.daylight(base, 0.03); tubeLevel(1); });
      step(0.21, () => { if (kit) kit.daylight(dip, 0.03); tubeLevel(0.2); });
      step(0.28, () => { if (kit) kit.daylight(base, 0.05); tubeLevel(1); });
    }
    /* THE FAN (the hugger over the living room turns; the dining room's too) */
    let fanSpin = 0;
    function fanTick(wdt) {
      play.fanK += (play.fanTo - play.fanK) * Math.min(1, wdt * (play.fanTo < play.fanK ? 1.6 : 0.8));
      fanSpin += wdt * 7.5 * play.fanK;
      for (const g of things.w4hugger || []) { const m = g.userData.model; if (m) m.rotation.y = fanSpin; }
    }
    /* bedroom 3's door, a hand's width further each time it is asked (its pivot is doorLeaves[5]) */
    function doorTick(wdt) { const D = doorLeaves[5]; if (!D) return; play.doorK += (play.doorTo - play.doorK) * Math.min(1, wdt * 0.6); D.pivot.rotation.y = D.shut + play.doorK; }
    /* APPA'S PHOTOGRAPH: stood before long, its glass fogs for a moment and clears (once; §4.1) */
    const fogMat = new THREE.MeshBasicMaterial({ color: 0xe8eef2, transparent: true, opacity: 0, depthWrite: false });
    const fogPane = new THREE.Mesh(new THREE.PlaneGeometry(0.27, 0.36), fogMat);
    fogPane.position.set(0.62, 1.50, ROOMS.living.z1 - 0.004 - 0.023); fogPane.rotation.y = Math.PI; fogPane.renderOrder = 3; world.add(fogPane);
    owned.push(fogPane.geometry); mats.push(fogMat);
    let fogK = 0, fogTo = 0;
    function fogTick(wdt) {
      if (phase === 'history' && !play.fogged && !play.busy) {
        const d = Math.hypot(yaw.position.x - APPA_PHOTO_AT.x, yaw.position.z - APPA_PHOTO_AT.z);
        play.fogAt = d < 1.6 ? play.fogAt + wdt : 0;
        if (play.fogAt > 3.5) { play.fogged = true; fogTo = 0.55; fx('u4fog', 0.6, panOf(APPA_PHOTO_AT)); const run = play.run; after(1.8, () => { if (live(run)) fogTo = 0; }); }
      }
      fogK += (fogTo - fogK) * Math.min(1, wdt * (fogTo > fogK ? 1.4 : 0.7)); fogMat.opacity = fogK; fogPane.visible = fogK > 0.01;
    }

    /* ================================================================ SPIRIT VISION'S PRICE (§4.2, §4.3)
       His heart climbs while his sight is open and settles while it is shut: past its limit the picture throbs and his
       nerve (Sanity) drains. Open to see; shut to breathe (chapter 3's teaching, with a price). If his nerve runs low,
       his teacher closes his sight for him for a few seconds ("Close. Breathe."): every timed phase has a failure state
       that ends it, and nothing soft-locks (v7.4) */
    const HEAT = { up: 1 / 32, down: 1 / 9, drain: 1.4, floor: 15, low: 26 };
    const sanityNow = () => { const v = kit && kit.stat ? kit.stat('sanity') : null; return Number.isFinite(v) ? v : 100; };
    const visOpen = () => { const v = kit && kit.vision ? kit.vision() : null; return !!(v && (v.on || v.held)); };
    function heatTick(wdt) {
      if (!kit || !kit.vision) return;
      const v = kit.vision(); if (!v) return;
      const open = v.on && !play.closeHold;
      play.heat = Math.max(0, Math.min(1.3, play.heat + (open ? HEAT.up : -HEAT.down) * wdt));
      const step = play.heat >= 1 ? 3 : play.heat >= 0.75 ? 2 : play.heat >= 0.45 ? 1 : 0;
      if (open && step !== play.heatStep) {
        play.heatStep = step;
        if (kit.pulse) kit.pulse(step === 3 ? { bpm: 168, secs: 1.2, erratic: 0.5 } : step === 2 ? { bpm: 148, secs: 2 } : step === 1 ? { bpm: 132, secs: 2.5 } : { bpm: 118, secs: 2.4 });
        if (kit.smear) kit.smear(step === 3 ? 0.45 : 0, { secs: 0.6 });
      } else if (!open && play.heatStep) { play.heatStep = 0; if (kit.smear) kit.smear(0, { secs: 0.8 }); }
      if (open && play.heat >= 1 && getState() === 'play') {
        const room = sanityNow() - HEAT.floor;
        if (room > 0) kit.award('sanity', -Math.min(room, HEAT.drain * wdt), { minigame: true });
      }
      if (open && sanityNow() < HEAT.low && !play.closeHold && !play.busy && (phase === 'sight' || phase === 'bless')) nerveOut();
      if (play.closeHold && (play.closeHold -= wdt) <= 0) { play.closeHold = 0; kit.vision(null); }
    }
    /* "Close. Breathe." His sight shut for him and held shut for a few seconds; a price on the card (§4.3) */
    function nerveOut() {
      if (!kit || !kit.vision) return;
      kit.vision(false); kit.vision({ r: 0, moving: false }); play.closeHold = 5.5;
      play.nerveOut = true; bank(W.noteNerve, -4, 0);
      if (!heard.has('ph4b1') || phase === 'bless') sayLine('ph4b1', 1, () => talk(cast.phoB.group.visible ? cast.phoB : cast.pho, SECS.ph4b1 || 2));
    }

    /* ================================================================ PLAY II · THE SIGHT (§4.2) */
    const WARM_SIGHT = ['ph4s0', 'q4s1', 'q4s2', 'q4s3', 'ph4s1', 'ph4s2', 'ph4s3', 'ph4s4', 'u4sting', 'u4vison', 'u4visbed', 'u4heart'];
    function sightBegin(R, fresh) {
      lookAt0('FLAT'); castHome(); spiritsHome();
      play.learned = new Set(['r', 'm', 'f', 'o', 'a']); play.spoke = true; play.told = true; play.peeked = R.peeked;
      play.opened = R.opened; play.looked = new Set(R.looked); play.closed = false; play.read = false;
      setPhase('sight', { complete: false });
      if (warmSounds) warmSounds(WARM_SIGHT);
      const run = play.run;
      if (fresh || !play.opened) { play.busy = true;
        after(fresh ? 0.4 : 1.2, () => { if (!live(run)) return; say('ph4s0', cast.pho);
          queueFn(() => { play.busy = false; objectiveFor('sight', { complete: false }); if (kit && kit.visionUrge && !visOpen()) kit.visionUrge(true); }); }); }
      else objectiveFor('sight', { complete: false });
    }
    /* the engine tells the stage every time he opens or shuts his sight (stage.onVision) */
    function onVision(on) {
      if (kit && kit.visionUrge) kit.visionUrge(false);
      if (on && (phase === 'history' || phase === 'sight')) oppressLooks();
      if (phase === 'history' && on && !play.peeked) { play.peeked = true; saveMark(); }
      if (phase === 'sight' && !play.busy) {
        if (on && !play.opened) { play.opened = true; saveMark(); const run = play.run; after(1.4, () => { if (live(run)) objectiveFor('sight'); }); }
        else if (!on && play.opened && play.looked.size >= 3 && !play.closed) { play.closed = true; readingBegin(); }
      }
    }
    /* as the wave reaches it, the one on her back turns its head and looks at him: his heart kicks, a low sting
       (once a phase: the first time the wave finds it) */
    let oppLooked = '';
    function oppressLooks() {
      if (oppLooked === phase) return; oppLooked = phase;
      const run = play.run;
      after(0.55, () => { if (!live(run)) return;
        whenReady(spirits.oppress, (P) => { span(P, 'oturn', 0, 2.2, 1.4, { hold: 0.35, holdSecs: 3 }); gaze(P, 'lens', { reach: 1.1, secs: 0.6 }); });
        fx('u4sting', 0.8, panOf(CHAIR));
        if (kit && kit.pulse) kit.pulse({ bpm: 150, secs: 0.4, erratic: 0.3 });
        after(4.5, () => { if (!live(run)) return; whenReady(spirits.oppress, (P) => { gaze(P, null, { secs: 1.5 }); rest(P, 1.2); }); }); });
    }
    /* each presence, looked at by aiming at it and pressing (pressAim: the twenty-eighth seam) */
    function lookPresence(c, line) {
      if (play.busy || play.looked.has(c) || !visOpen()) return false;
      play.busy = true;
      say(line, null);
      queueFn(() => { play.looked.add(c); play.busy = false; saveMark(); objectiveFor('sight');
        if (play.looked.size >= 3) { play.busy = true; say('ph4s1', cast.pho); queueFn(() => { play.busy = false; objectiveFor('sight'); if (!visOpen() && !play.closed) { play.closed = true; readingBegin(); } }); } });
      return true;
    }
    /* his teacher's reading, in the case file's own words; then the blessing */
    function readingBegin() {
      if (play.read) return; play.read = true; play.busy = true;
      if (kit) kit.objective(null);
      const run = play.run;
      after(0.9, () => { if (!live(run)) return;
        say('ph4s2', cast.pho); say('ph4s3', cast.pho); say('ph4s4', cast.pho);
        queueFn(() => { play.busy = false; after(0.8, () => { if (live(run)) blessBegin(readMark('bless:' + mark()), true); }); }); });
    }

    /* ================================================================ PLAY III · THE BLESSING (§4.3) */
    const WARM_BLESS = ['ph4b0', 'ph4b1', 'ph4b2', 'u4match', 'u4tubedie', 'u4fanstop', 'u4tvdie', 'u4flick', 'u4patter', 'u4dip', 'u4whisper',
                        'u4release', 'u4large', 'u4gaspf', 'u4gaspm', 'u4chill', 'u4husband', 'u4vison', 'u4visbed', 'u4heart', 'uiclick',
                        'u4fightmus', 'u4chant1', 'u4chant2'];
    function blessBegin(R, fresh) {
      play.learned = new Set(['r', 'm', 'f', 'o', 'a']); play.spoke = true; play.told = true; play.opened = true; play.looked = new Set(['1', '2', '3']);
      play.closed = true; play.read = true; play.peeked = R.peeked; play.water = R.water; play.appaGone = R.appaGone;
      if (warmSounds) warmSounds(WARM_BLESS);
      if (kit && kit.vision) kit.vision(false);
      const run = play.run;
      if (fresh) {
        /* the change of places in the black (v16.1: a scene change happens in the black): Grandmaster Pho up from his
           stool and behind her chair; the order waits for Mala's lamp and the room going dark */
        play.busy = true; setPhase('bless', { complete: false }); if (kit) kit.fade(1, 0.5);
        after(0.6, () => { if (!live(run)) return; blessStage(); if (kit) kit.fade(0, 0.7);
          after(0.9, () => { if (!live(run)) return; say('ph4b0', cast.phoB);
            queueFn(() => { lightLamp(() => { if (!live(run)) return; roomDies(() => { if (!live(run)) return; play.busy = false; objectiveFor('bless'); }); }); }); }); });
      } else {
        blessStage(); lampLit(true); roomDark(true); setPhase('bless', { complete: false });
        if (play.water) { giveWater(true); after(0.8, () => { if (live(run)) briefFight(); }); }
      }
    }
    /* who stands where for the blessing */
    function blessStage() {
      lookAt0('FLAT');
      castHome();
      whenReady(cast.pho, (P) => { P.group.visible = false; });
      whenReady(cast.phoB, (P) => { put(P, P.home.x, P.home.z, P.home.ry); P.group.visible = true; rest(P, 0); });
      /* Mala and Ravi together by the fan, out of the way of the work (they have no seat in this flat that their files
         sit in: they stand together) */
      whenReady(cast.mala, (P) => { put(P, 2.22, 2.34, faceTo(2.22, 2.34, CHAIR.x, CHAIR.z)); rest(P, 0); });
      spiritsHome();
      /* Appa stands between his family and the dark (§4.3) */
      whenReady(spirits.appa, (P) => { if (play.appaGone) { P.group.visible = false; P.gone = true; return; } put(P, APPA_GUARD.x, APPA_GUARD.z, faceTo(APPA_GUARD.x, APPA_GUARD.z, CHAIR.x, CHAIR.z + 1.2)); });
      castSolid();
    }
    const APPA_GUARD = { x: 1.72, z: 2.85 };
    /* MALA LIGHTS HER MOTHER'S LAMP: she goes to it, lights its wick, and its flame takes; in the vision the altar's glow
       brightens a little */
    function lightLamp(done) {
      const run = play.run;
      whenReady(cast.mala, (P) => { put(P, LAMP_AT.x + 0.42, LAMP_AT.z - 0.55, faceTo(LAMP_AT.x + 0.42, LAMP_AT.z - 0.55, LAMP_AT.x, LAMP_AT.z)); span(P, 'lightlamp', 0, 5.9, 5.9, { hold: 0.2, holdSecs: 4 }); });
      after(2.6, () => { if (!live(run)) return; fx('u4match', 0.7, panOf(LAMP_AT)); lampLit(false); });
      after(5.6, () => { if (!live(run)) return; whenReady(cast.mala, (P) => { put(P, 2.22, 2.34, faceTo(2.22, 2.34, CHAIR.x, CHAIR.z)); rest(P, 0.3); }); if (done) done(); });
    }
    /* the lamp's flame: three small flames on its top dish, additive, flickering on the chapter's clock */
    const flameTex = (() => { const [c, x] = cnv(64); const g = x.createRadialGradient(32, 40, 2, 32, 36, 30);
      g.addColorStop(0, 'rgba(255,248,210,1)'); g.addColorStop(0.35, 'rgba(255,190,80,0.85)'); g.addColorStop(1, 'rgba(255,120,20,0)'); x.fillStyle = g; x.fillRect(0, 0, 64, 64); return tex(done(THREE, c, false)); })();
    const flameMat = new THREE.SpriteMaterial({ map: flameTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, color: 0xffffff });
    mats.push(flameMat);
    const flames = [0, 1, 2].map(i => { const s = new THREE.Sprite(flameMat); const a = i * 2.094; s.position.set(LAMP_AT.x + Math.cos(a) * 0.055, LAMP_AT.y + 0.03, LAMP_AT.z + Math.sin(a) * 0.055); s.scale.set(0.035, 0.06, 1); s.visible = false; world.add(s); return s; });
    let lampK = 0, lampTo = 0;
    function lampLit(now) { lampTo = 1; if (now) lampK = 1; }
    function lampTick(wdt, t) {
      lampK += (lampTo - lampK) * Math.min(1, wdt * 1.2);
      for (let i = 0; i < flames.length; i++) { const f = flames[i]; f.visible = lampK > 0.02; if (!f.visible) continue;
        const fl = 0.85 + 0.15 * Math.sin(t * 13 + i * 2) + 0.08 * Math.sin(t * 31 + i);
        f.scale.set(0.034 * lampK * fl, 0.062 * lampK * (0.9 + 0.2 * Math.sin(t * 9 + i * 3)), 1); }
      for (const a of altarAuras) if (a.set) a.set('uFill', SPIRIT.altar.fill + 0.05 * lampK);   // (her lamp lit: her goddess's light a little brighter)
    }
    /* THE ROOM TURNS: the tube light dies, the fan stops, the TV dies; the lamp and the estate through the grilles are
       all the light there is (the DARK look). A beat of near black first, where Mala goes back to her brother */
    function roomDies(done) {
      const run = play.run;
      fx('u4tubedie', 0.75, panOf(TUBE_AT)); tubeFlicker();
      after(0.5, () => { if (!live(run)) return; fx('u4fanstop', 0.6, panOf(FAN_AT)); play.fanTo = 0; });
      after(1.1, () => { if (!live(run)) return; fx('u4tvdie', 0.5, panOf({ x: ROOMS.living.x0 + 0.3, z: 1.92 })); roomDark(false); });
      after(3.2, () => { if (!live(run)) return; if (done) done(); });
    }
    function roomDark(now) {
      lookName = 'DARK'; if (kit) kit.daylight(DARK, now ? 0 : 1.6); tubeLevel(0);
      play.fanTo = 0; if (now) play.fanK = 0;
      phoLook.level.value = 0.55;
    }
    /* THE HOLY WATER: the small silver bowl by his teacher's large one; taken, it is his (ITEM UNLOCKED, rare) */
    const bowlOnFloor = stand('w4waterbowl', SMALLBOWL_AT.x, 0, SMALLBOWL_AT.z, 0.4, { lift: 3 });
    const bowlHold = new THREE.Group();
    stand('w4waterbowl', 0, -0.035, 0, 0, { parent: bowlHold, lift: 3, near: true });
    bowlHold.scale.setScalar(0.62);
    if (kit && kit.weaponHold) kit.weaponHold(bowlHold, { pos: [-0.02, -0.075, -0.15], rot: [0.12, 0, 0] });
    function giveWater(now) {
      play.water = true; bowlOnFloor.visible = false;
      if (kit) { if (!kit.has('holywater') && !kit.equipped('holywater')) kit.give('holywater'); kit.equip('holywater'); kit.urge(null); }
      if (!now) saveMark();
    }
    function takeWater() {
      if (play.busy || play.water || phase !== 'bless') return false;
      play.busy = true; if (kit) kit.waypoint(null);
      giveWater(false);
      const run = play.run, go = () => { if (!live(run)) return; play.busy = false; briefFight(); };
      if (kit && kit.unlock && kit.unlock('holywater', { onClose: go })) return true;
      after(0.4, go); return true;
    }
    /* THE BRIEF (instructions first, a START, its own moving picture: Chad's rules of v8.7 and v18.2) */
    function briefFight() {
      if (!kit || play.briefed) return;
      play.briefed = true;
      const run = play.run;
      kit.event({ kind: 'guard', label: W.guardTitle, brief: TOUCHY ? W.guardBrief : W.guardBriefKey }).then((r) => {
        if (!live(run)) return;
        if (!r || r.aborted) { play.briefed = false; return; }
        fightBegin();
      });
    }

    /* ---------------------------------------------------------------- THE FIGHT: three waves over the chant
       Green shapes come out of the dark (the kitchen, the passage, the bedrooms, the door) toward the lamp and the
       blessing, to Amma, her teacher, her children and him: hungry ones come for a share of what is given (§2.10).
       A flick of water that reaches one sends it back, flaring and sighing (released, never destroyed: §2.9). One that
       reaches a family member chills them (Awareness falls); one that reaches him takes his nerve and throws the
       picture; one that reaches Grandmaster Pho or Amma slows the blessing. Appa stands between his family and the dark
       (the hungry ones are slowed near him); water thrown at him makes him turn, look at the student and fade for the
       night. The altar cannot be aimed at. Nothing ends it but the chant. */
    const FROM = { bed3: { x: ROOMS.living.x0 + 0.15, z: 3.15 }, master: { x: 1.95, z: ROOMS.living.z1 - 0.15 }, passage: { x: 3.25, z: 4.3 },
                   kitchen: { x: 5.6, z: 9.2 }, corner0: CORNERS[0], corner1: CORNERS[1], door: { x: 0.0, z: 0.45 }, store: { x: -1.3, z: 4.8 } };
    const FAMILY = { ravi: () => cast.ravi.group.position, mala: () => cast.mala.group.position, amma: () => cast.amma.group.position,
                     pho: () => cast.phoB.group.position, me: () => yaw.position };
    const FIGHT = { secs: 116, waves: [
      { at: 2.5, list: [['corner0', 'amma', 0.30], ['corner1', 'mala', 0.28], ['bed3', 'me', 0.30]] },
      { at: 38, list: [['master', 'ravi', 0.34], ['passage', 'pho', 0.33], ['door', 'me', 0.34], ['kitchen', 'amma', 0.32]] },
      { at: 76, list: [['bed3', 'mala', 0.37], ['store', 'me', 0.36], ['passage', 'amma', 0.34], ['kitchen', 'amma', 0.26, 'large']] } ] };
    const REACH = { me: 0.75, amma: 0.62, pho: 0.6, ravi: 0.55, mala: 0.55 };
    function fightBegin() {
      const F = play.fight = { on: true, t: 0, k: 0, wave: 0, shapes: [], fed: 0, families: 0, captions: 0, ended: false };
      if (kit) { kit.bar(0); }
      objectiveFor('bless');
      /* the two in the corners are the first wave's: they wake */
      whenReady(cast.phoB, (P) => handOnHead(P, true));
      fightMusOn();
    }
    function shapeOf(i, large) {
      const P = large ? spirits.large : spirits.wander[i]; if (!P || !P.ready) return null;
      P.group.visible = true; P.gone = false; P.alpha = 1; if (P.fx) { P.fx.set('uAlpha', 1); P.fx.set('uFill', large ? SPIRIT.large.fill : SPIRIT.wander.fill); }
      return P;
    }
    let wanderNext = 2;
    function waveStart(w) {
      const F = play.fight, run = play.run;
      for (const [from, to, v, kind] of w.list) {
        const large = kind === 'large';
        const P = large ? shapeOf(0, true) : from === 'corner0' ? shapeOf(0) : from === 'corner1' ? shapeOf(1) : shapeOf(wanderNext++ % WANDER_N);
        if (!P) continue;
        const at = FROM[from]; if (!/^corner/.test(from)) put(P, at.x, at.z, faceTo(at.x, at.z, FAMILY[to]().x, FAMILY[to]().z));
        take(P, large ? 'lumber' : (P.slot % 2 ? 'creep' : 'crawl'), 0.4);
        F.shapes.push({ P, to, v, need: large ? 3 : 1, hits: 0, state: 'come', t: 0, back: 0, fedAt: -99 });
      }
      if (w.list.some(r => r[3] === 'large')) fx('u4large', 0.8, panOf(FROM.kitchen));
      fx('u4whisper', 0.55, 0);
      void run;
    }
    function fightTick(wdt) {
      const F = play.fight; if (!F || !F.on) return;
      if (getState() !== 'play') return;
      F.t += wdt;
      while (F.wave < FIGHT.waves.length && F.t >= FIGHT.waves[F.wave].at) waveStart(FIGHT.waves[F.wave++]);
      /* the blessing's own pace: slowed while anything crowds her or her teacher */
      let slow = 1; for (const S of F.shapes) if (S.state === 'feed' && (S.to === 'amma' || S.to === 'pho')) slow *= 0.5;
      F.k = Math.min(1, F.k + wdt / FIGHT.secs * Math.max(0.15, slow));
      if (kit) kit.bar(F.k);
      while (F.captions < CHANT.length && F.k > CHANT[F.captions].at) { const C = CHANT[F.captions++]; chantLine(C);
        if (kit && kit.captions) kit.captions([{ at: 0, end: 2 * C.len + CHANT_GAP + 0.4, text: W[C.cap], sub: W[C.cap + 'Sub'] }]); }
      const appa = spirits.appa, ag = appa.group.position;
      for (const S of F.shapes) {
        const P = S.P; if (S.state === 'gone') continue;
        S.t += wdt;
        if (S.state === 'leave') { S.leave += wdt; const u = Math.min(1, S.leave / 1.1); P.alpha = 1 - u; if (P.fx) { P.fx.set('uAlpha', 1 - u); P.fx.set('uFill', 0.1 + 0.9 * (1 - u) * (1 - u)); } P.group.position.y += wdt * 0.35;
          if (u >= 1) { S.state = 'gone'; P.group.visible = false; P.gone = true; } continue; }
        const tg = FAMILY[S.to](), dx = tg.x - P.group.position.x, dz = tg.z - P.group.position.z, d = Math.hypot(dx, dz);
        if (S.back > 0) { S.back -= wdt; const k = Math.min(1, wdt * 1.6); P.group.position.x -= dx / Math.max(0.01, d) * 0.9 * k; P.group.position.z -= dz / Math.max(0.01, d) * 0.9 * k; continue; }
        if (S.state === 'come') {
          let v = S.v;
          /* Appa's watch: near him, the ones that come for his family are slowed */
          if (!play.appaGone && appa.group.visible && (S.to === 'ravi' || S.to === 'mala') && Math.hypot(ag.x - P.group.position.x, ag.z - P.group.position.z) < 1.3) v *= 0.3;
          if (d > REACH[S.to]) { P.group.position.x += dx / d * v * wdt; P.group.position.z += dz / d * v * wdt; P.group.rotation.y = faceTo(P.group.position.x, P.group.position.z, tg.x, tg.z); P.group.position.y = flatGround(P.group.position.x, P.group.position.z); }
          else { S.state = 'feed'; feed(S); }
        } else if (S.state === 'feed') {
          if (S.to === 'me') { if (d > REACH.me + 0.5) S.state = 'come'; else if (S.t - S.fedAt > 4) feed(S); }
          else if (S.t - S.fedAt > 6) feed(S);
          P.group.rotation.y = faceTo(P.group.position.x, P.group.position.z, tg.x, tg.z);
        }
      }
      if (F.k >= 1 && !F.ended) fightEnd();
    }
    /* one reaches its mark: what it costs */
    function feed(S) {
      const F = play.fight; S.fedAt = S.t; F.fed++;
      if (S.to === 'me') {
        fx('u4chill', 0.8, 0);
        const room = sanityNow() - HEAT.floor; if (room > 0) kit.award('sanity', -Math.min(room, 6), { minigame: true });
        if (kit.chill) { kit.chill(0.7, { secs: 0.25 }); const run = play.run; after(1.6, () => { if (live(run) && kit) kit.chill(0, { secs: 1.2 }); }); }
        if (kit.smear) { kit.smear(0.55, { secs: 0.2 }); const run = play.run; after(1.0, () => { if (live(run) && kit) kit.smear(0, { secs: 0.8 }); }); }
        if (kit.pulse) kit.pulse({ bpm: 160, secs: 0.5, erratic: 0.4 });
        S.back = 1.2; S.state = 'come';
      } else if (S.to === 'ravi' || S.to === 'mala') {
        F.families++;
        fx(S.to === 'ravi' ? 'u4gaspm' : 'u4gaspf', 0.75, panOf(FAMILY[S.to]()));
        kit.award('awareness', -2, { minigame: true });
        const P = cast[S.to]; if (P === cast.mala) whenReady(P, (Q) => { span(Q, 'scream', 0.4, 2.2, 1.0, { then: () => rest(Q, 0.8) }); });
      } else if (S.to === 'amma') { F.families++; fx('u4gaspf', 0.6, panOf(CHAIR)); }
    }
    /* the water reaches one (stage.onShot): released, or staggered (the large one takes three) */
    const hitOwner = new Map();
    for (const P of [spirits.oppress, spirits.appa, spirits.large].concat(spirits.wander)) if (P.hit) hitOwner.set(P.hit, P);
    function onShot(r) {
      const P = r && r.object ? hitOwner.get(r.object) : null;
      if (r && r.point) fx('u4patter', 0.5, panOf(r.point));
      if (!P) return;
      if (P === spirits.appa) { appaStruck(); return; }
      if (P === spirits.oppress) return;                     // (her teacher's work, not the water's: it does not move)
      const F = play.fight; if (!F || !F.on) return;
      const S = F.shapes.find(q => q.P === P); if (!S || S.state === 'gone' || S.state === 'leave') return;
      S.hits++;
      if (P.fx) { P.fx.set('uFill', 0.9); const run = play.run; after(0.25, () => { if (live(run) && P.fx && S.state !== 'leave') P.fx.set('uFill', P === spirits.large ? SPIRIT.large.fill : SPIRIT.wander.fill); }); }
      if (S.hits >= S.need) { S.state = 'leave'; S.leave = 0; fx('u4release', 0.7, panOf(P.group.position)); }
      else { S.back = 0.8; S.state = 'come'; }
    }
    /* WATER THROWN AT APPA: he turns, looks at the student, and fades for the rest of the night (a price on the card,
       and his teacher's word after) */
    function appaStruck() {
      if (play.appaGone) return;
      play.appaGone = true; saveMark(); bank(W.noteAppa, 0, -4);
      const P = spirits.appa, run = play.run;
      fx('u4husband', 0.8, panOf(P.group.position));
      whenReady(P, (Q) => { span(Q, 'aturn', 0, 2.4, 1.6, { hold: 0.2, holdSecs: 3 }); gaze(Q, 'lens', { reach: 1.0, secs: 0.9 }); });
      let u = 0; const fade = () => { if (!live(run)) return; u = Math.min(1, u + 1 / 50); P.alpha = 1 - u; if (P.fx) P.fx.set('uAlpha', 1 - u); if (u < 1) after(0.05, fade); else { P.group.visible = false; P.gone = true; } };
      after(1.6, fade);
      after(2.2, () => { if (live(run)) sayLine('ph4b2', 1, () => talk(cast.phoB, SECS.ph4b2 || 2.6)); });
    }
    /* the end of the chant: the shapes thin away; silence but for the lamp's flame and her breathing */
    /* HIS CHANT (the plan's D13; masters/v27.0/chant/build.py): each line sung by him while its words are on screen,
       twice with a breath between (its caption stands for both), from where he stands; four times through the blessing
       at its own pace (the bar), the two lines in turn. Only ever under its caption: a chant with words is captioned
       (v21.31) */
    const CHANT_GAP = 1.2;
    const CHANT = [{ at: 0.06, n: 'u4chant1', len: 5.98, cap: 'cap1' }, { at: 0.30, n: 'u4chant2', len: 8.94, cap: 'cap2' },
                   { at: 0.55, n: 'u4chant1', len: 5.98, cap: 'cap1' }, { at: 0.80, n: 'u4chant2', len: 8.94, cap: 'cap2' }];
    let chantNodes = [];
    function chantStop() { for (const a of chantNodes) { try { a.stop(); } catch (e) { } } chantNodes = []; }
    function chantLine(C) {
      chantStop(); if (!worldSfx || (soundOff && soundOff())) return;
      const g = cast.phoB.group.position, sing = () => { const a = worldSfx(C.n, 0.95, 1, panAt(g.x, g.z)); if (a) chantNodes.push(a); };
      sing(); const run = play.run; after(C.len + CHANT_GAP, () => { if (live(run) && play.fight && play.fight.on) sing(); });
    }
    function fightEnd() {
      const F = play.fight; F.ended = true; F.on = false; fightMusOff(); chantStop();
      /* (each shape still in the room goes on its own beat: a golden-ratio spread over 0.4 s by its place in the list, the
         same on every run and every replay: v6.15, nothing random unseeded) */
      F.shapes.forEach((S, i) => { if (S.state !== 'gone' && S.state !== 'leave') { S.state = 'leave'; S.leave = -0.4 * ((i * 0.6180339887) % 1); } });
      if (kit) { kit.bar(null); kit.captions(null); }
      if (F.families <= 1) bank(W.noteKept, 0, 4);
      whenReady(cast.phoB, (P) => handOnHead(P, false));
      if (kit && kit.vision) kit.vision(false);
      setPhase('kept');
      const run = play.run;
      after(2.6, () => { if (live(run)) trance(); });
    }
    /* THE TURNING POINT: the trance's film, and the decision at its end (the plan's §4.4) */
    function trance() {
      if (!kit || !kit.film) { openDecision(); return; }
      const run = play.run;
      if (!kit.film('trance', { onDone: () => { if (live(run)) openDecision(); } })) openDecision();
    }
    /* every sound the four endings and their close play, warmed as the decision opens (the scenes cue the close's from a
       helper, which the engine's own reading of a scene cannot see) */
    function openDecision() {
      decOpen = true;
      if (warmSounds) warmSounds(['u4scuffle', 'u4cry', 'u4gaspf', 'u4torn', 'u4endA', 'u4stand', 'ph4A1', 'q4A1', 'u4flick', 'u4patter', 'u4dip',
                      'u4chill', 'u4heart', 'u4fall', 'ph4B0', 'u4endB', 'ph4B1', 'q4B1', 'u4tile', 'q4C0', 'u4tile2', 'u4endC', 'ph4C1', 'q4C1',
                      'u4visoff', 'ph4D0', 'u4endD', 'ph4D1', 'q4D1', 'u4closemus', 'ph4z0', 'u4release', 'u4steps', 'u4bell', 'ph4z1']);
      if (getState() === 'play') startDecision();
    }
    function keptBegin() { blessStage(); lampLit(true); roomDark(true); setPhase('kept', { complete: false }); const run = play.run; after(1.0, () => { if (live(run)) trance(); }); }

    /* ---------------------------------------------------------------- HIS HAND ON HER HEAD (the blessing): the right
       palm laid on the crown of her head, the fingers forward, the elbow out and down; eased on and off. The point is
       read from her own head each frame (her body breathes) */
    let crownK = 0, crownTo = 0;
    function handOnHead(P, on) { crownTo = on ? 1 : 0; }
    /* (laid after the people's frame has posed him, and taken off by armsBack before the mixer runs again: v11.5. Run
       wherever the people are posed live, play and the decision alike: updateNotes. Her head moves (the trance sits her
       up and forward), so his bow is read from it each frame: bowFor) */
    function crownTick(wdt) {
      crownK += (crownTo - crownK) * Math.min(1, wdt * 1.5);
      const P = cast.phoB; if (!P.ready || !P.group.visible) return;
      const h = HER_CROWN();
      bowSet(P, crownK > 0.01 ? crownK * bowFor(P, h) : 0);         // (the mixer lays it on at his next frame)
      if (crownK > 0.01) crownHand(P, h, crownK);
    }
    /* the palm on the crown (h: the top of her head, HER_CROWN), the fingers forward and a little down, the elbow out and down;
       and, while he bows, his other arm let hang straight from its shoulder (a bow tips the arms with the trunk) */
    function crownHand(P, h, k) {
      const g = P.group.position, fx0 = h[0] - g.x, fz0 = h[2] - g.z, fl = Math.hypot(fx0, fz0) || 1;
      handTo(P, 'R', [h[0] - fx0 / fl * 0.02, h[1] + 0.012, h[2] - fz0 / fl * 0.02], [fx0 / fl, -0.25, fz0 / fl], [0, -1, 0], k, { out: 0.32, down: 0.3 });
      const B = P.bow, bw = B ? B.a.getEffectiveWeight() * B.max : 0;
      if (bw > 2 && B.lsh) { B.lsh.getWorldPosition(_bwv); P.group.getWorldQuaternion(_bwq); _bwx.set(1, 0, 0).applyQuaternion(_bwq);
        handTo(P, 'L', [_bwv.x + _bwx.x * 0.04, _bwv.y - 0.6, _bwv.z + _bwx.z * 0.04], [0, -1, 0], [-_bwx.x, 0, -_bwx.z], k * Math.min(1, (bw - 2) / 8), { out: 0.12, down: 0.7 }); }
    }
    /* HIS BOW FROM THE WAIST (18 Nov: in the trance she sits up and forward, and her crown stood 0.6 to 0.8 m out from the
       right shoulder of a man upright behind her chair's handles; his arm reaches about 0.6: in the film's photographs his
       arm pointed at her head across the air). His trunk is turned forward about his own left-right line at his hip
       joints, as far as the reach asks and no further (bowFor), by an ADDITIVE take in his own mixer (bowSet): a turn
       laid on a bone after the mixer would be laid on itself again wherever the take holds that bone still (the v11.5
       law), and a take of the mixer's own is undone by the mixer. Its numbers are read once off his stand as he lands */
    const BOW_MAX = 38, _bwv = new THREE.Vector3(), _bwq = new THREE.Quaternion(), _bwx = new THREE.Vector3(), _bwp = new THREE.Vector3(), _bws = new THREE.Vector3();
    const boneOfP = (P, nm) => { const re = new RegExp('^(mixamorig:?)?' + nm + '$'); for (const n in P.bone) if (re.test(n)) return P.bone[n]; return null; };
    whenReady(cast.phoB, (P) => {
      const hp = boneOfP(P, 'Hips'), lu = boneOfP(P, 'LeftUpLeg'), ru = boneOfP(P, 'RightUpLeg'), sh = boneOfP(P, 'RightArm'), el = boneOfP(P, 'RightForeArm'), wr = boneOfP(P, 'RightHand'), lsh = boneOfP(P, 'LeftArm');
      if (!hp || !lu || !ru || !sh || !el || !wr || !P.mixer) { console.warn('phoB: no bones to bow with'); P.bow = null; return; }
      put(P, P.home.x, P.home.z, P.home.ry); pose(P, 'Sit_to_Stand_Transition_M', 5.85); P.group.updateWorldMatrix(true, true);
      const inv = new THREE.Matrix4().copy(P.group.matrixWorld).invert(), at = (b) => b.getWorldPosition(new THREE.Vector3()).applyMatrix4(inv);
      const piv = at(hp), s0 = at(sh), e0 = at(el), w0 = at(wr), reach = s0.distanceTo(e0) + e0.distanceTo(w0) + 0.07;
      /* (the bow is at his hip joints, as a body bows: his hips turned about his own left-right line, read in the hips'
         frame as he stands, and each thigh turned back by the same turn seen from it, so his legs stand where they stood:
         a thigh's back-turn is its own turn's conjugate of the hips', exact at any share of the bow) */
      const qg = P.group.getWorldQuaternion(new THREE.Quaternion()), qh = hp.getWorldQuaternion(new THREE.Quaternion());
      const ax = new THREE.Vector3(1, 0, 0).applyQuaternion(qg).applyQuaternion(qh.invert()).normalize();
      const dH = new THREE.Quaternion().setFromAxisAngle(ax, BOW_MAX * Math.PI / 180), dHi = dH.clone().invert();
      const dL = lu.quaternion.clone().invert().multiply(dHi).multiply(lu.quaternion), dR = ru.quaternion.clone().invert().multiply(dHi).multiply(ru.quaternion);
      const tr = (b, q) => new THREE.QuaternionKeyframeTrack(b.name + '.quaternion', [0, 1], [q.x, q.y, q.z, q.w, q.x, q.y, q.z, q.w]);
      const clip = new THREE.AnimationClip('bow', 1, [tr(hp, dH), tr(lu, dL), tr(ru, dR)], THREE.AdditiveAnimationBlendMode);
      const a = P.mixer.clipAction(clip); a.blendMode = THREE.AdditiveAnimationBlendMode; a.setEffectiveWeight(0); a.play();
      P.bow = { a, max: BOW_MAX, piv, sh: s0, reach, lsh };
    });
    /* the bow, in degrees, that brings the crown `h` within nine tenths of his reach (his shoulder turned with his trunk
       about the spine's joint, in his own frame) */
    function bowFor(P, h) {
      const B = P.bow; if (!B) return 0;
      P.group.updateWorldMatrix(true, false); _bwp.set(h[0], h[1] + 0.012, h[2]);
      const y = B.sh.y - B.piv.y, z = B.sh.z - B.piv.z;
      for (let d = 0; d <= B.max; d += 0.5) { const th = d * Math.PI / 180;
        _bws.set(B.sh.x, B.piv.y + y * Math.cos(th) - z * Math.sin(th), B.piv.z + y * Math.sin(th) + z * Math.cos(th)).applyMatrix4(P.group.matrixWorld);
        if (_bws.distanceTo(_bwp) <= B.reach * 0.9) return d; }
      return B.max;
    }
    function bowSet(P, deg) { const B = P.bow; if (!B) return; B.a.setEffectiveWeight(Math.max(0, Math.min(1, deg / B.max))); }

    /* ================================================================ WHAT HE CAN PRESS (stage.hotspots)
       Each a press (tap, click or E: Chad's rule of v21.9), each with its mark on the thing, each offered only while it
       is live and no line is handing off (v12.5, v21.21). A mark rides the person it is on (spotsTick). */
    const _hv = new THREE.Vector3();
    const markHit = (posF, frac = 0.1) => (x, y) => { const p = posF(); camera.updateMatrixWorld(); _hv.set(p.x, p.y, p.z).project(camera);
      return _hv.z < 1 && Math.hypot(x - _hv.x, (y - _hv.y) / Math.max(0.3, camera.aspect)) < frac; };
    const hsRavi = { id: 'ravi', pos: { x: 0, y: 1.6, z: 0 }, radius: 2.4, prompt: W.hotRavi, hits: markHit(RAVI_HEAD, 0.13),
      enabled: () => phase === 'history' && !play.busy && !play.learned.has('r'), onInteract() { return learn('r', [['rv4h1', cast.ravi], ['rv4h2', cast.ravi]]); } };
    const hsMala = { id: 'mala', pos: { x: 0, y: 1.5, z: 0 }, radius: 2.4, prompt: W.hotMala, hits: markHit(MALA_HEAD, 0.13),
      enabled: () => phase === 'history' && !play.busy && !play.learned.has('m'), onInteract() { return learn('m', [['ml4h1', cast.mala]]); } };
    const hsAmma = { id: 'amma', pos: { x: CHAIR.x, y: 1.2, z: CHAIR.z }, radius: 1.9, prompt: W.hotAmma, hits: markHit(AMMA_HEAD, 0.13),
      enabled: () => phase === 'history' && !play.busy && play.learned.size === 5 && !play.spoke, onInteract() { return ammaSpeaks(); } };
    const hsTell = { id: 'tell', pos: { x: STOOL.x, y: 1.3, z: STOOL.z }, radius: 2.4, prompt: W.hotTell, hits: markHit(PHO_HEAD, 0.13),
      enabled: () => phase === 'history' && !play.busy && play.spoke && !play.told, onInteract() { return tellPho(); } };
    /* the three presences, looked at through the vision: aim, and press (the mark grows when it is aimed at) */
    const lookSpot = (c, P, line, frac) => ({ id: 'look' + c, pos: { x: 0, y: 1.0, z: 0 }, radius: 9, aim: 0.24, pressAim: true, markFar: 9, markY: 0.15, prompt: W.hotLook,
      hits: markHit(() => { const h = P().hit; return h ? h.position : { x: 0, y: -9, z: 0 }; }, frac),
      enabled: () => phase === 'sight' && !play.busy && play.opened && visOpen() && !play.looked.has(c), onInteract() { return lookPresence(c, line); } });
    const hsLook1 = lookSpot('1', () => spirits.oppress, 'q4s1', 0.12), hsLook2 = lookSpot('2', () => spirits.appa, 'q4s2', 0.12), hsLook3 = lookSpot('3', () => spirits.wander[1], 'q4s3', 0.14);
    const STORY_SPOTS = [hsRavi, hsMala,
      { id: 'folder', pos: { x: FOLDER_AT.x, y: FOLDER_AT.y, z: FOLDER_AT.z }, radius: 1.8, prompt: W.hotFolder, markY: 0.25, hits: markHit(() => FOLDER_AT, 0.1),
        enabled: () => phase === 'history' && !play.busy && !play.learned.has('f'), onInteract() { return readLetters(); } },
      { id: 'old', pos: { x: OLDPHOTO_AT.x, y: OLDPHOTO_AT.y, z: OLDPHOTO_AT.z }, radius: 1.9, prompt: W.hotOld, markY: 0.3, hits: markHit(() => OLDPHOTO_AT, 0.1),
        enabled: () => phase === 'history' && !play.busy && !play.learned.has('o'), onInteract() { return learn('o', [['ml4h2', cast.mala], ['ml4h3', cast.mala]]); } },
      { id: 'appa', pos: { x: APPA_PHOTO_AT.x, y: APPA_PHOTO_AT.y, z: APPA_PHOTO_AT.z }, radius: 1.9, prompt: W.hotAppa, markY: 0.3, hits: markHit(() => APPA_PHOTO_AT, 0.1),
        enabled: () => phase === 'history' && !play.busy && !play.learned.has('a'), onInteract() { return learn('a', [['q4h2', null]]); } },
      hsAmma, hsTell, hsLook1, hsLook2, hsLook3,
      { id: 'water', pos: { x: SMALLBOWL_AT.x, y: 0.3, z: SMALLBOWL_AT.z }, radius: 1.8, prompt: W.hotWater, markY: 0.3, hits: markHit(() => SMALLBOWL_AT, 0.1),
        enabled: () => phase === 'bless' && !play.busy && !play.water, onInteract() { return takeWater(); } }];
    function spotsTick() {
      const r = RAVI_HEAD(); Object.assign(hsRavi.pos, r); hsRavi.pos.y -= 0.35;
      const m = MALA_HEAD(); Object.assign(hsMala.pos, m); hsMala.pos.y -= 0.35;
      const p = PHO_HEAD(); hsTell.pos.x = p.x; hsTell.pos.z = p.z; hsTell.pos.y = p.y - 0.4;
      for (const [hs, P] of [[hsLook1, spirits.oppress], [hsLook2, spirits.appa], [hsLook3, spirits.wander[1]]]) { const h = P.hit; if (h) { hs.pos.x = h.position.x; hs.pos.y = h.position.y - 0.15; hs.pos.z = h.position.z; } }
    }

    /* ---------------------------------------------------------------- WHERE THE WATER GOES (the engine's shot path)
       stage.shootables: what the lens's line may reach. stage.reloadRefusal: the bowl is dipped again only at his
       teacher's large bowl. And the altar: a shot whose line meets her altar before anything else is refused, the HUD
       saying why (kit.weaponBlock, derived on the frame: v11.6) */
    function shootables() { const out = []; for (const P of [spirits.appa, spirits.large].concat(spirits.wander)) if (P.hit && P.hit.visible) out.push(P.hit); return out; }
    function reloadRefusal() { return Math.hypot(yaw.position.x - BOWL.x, yaw.position.z - BOWL.z) < 1.5 ? null : W.dipHere; }
    const _ray = new THREE.Raycaster(), _ab = new THREE.Box3(), _hit = new THREE.Vector3();
    let altarBlock = false;
    function altarTick() {
      if (!kit || !kit.weaponBlock) return;
      let block = false;
      if (phase === 'bless' && play.water && getState() === 'play') {
        _ray.setFromCamera({ x: 0, y: 0 }, camera);
        altarHit.updateWorldMatrix(true, false); _ab.setFromObject(altarHit);
        const pt = _ray.ray.intersectBox(_ab, _hit);
        if (pt) { const dA = _ray.ray.origin.distanceTo(pt); block = true;
          for (const P of [spirits.appa, spirits.large].concat(spirits.wander)) { const h = P.hit; if (!h || !h.visible) continue;
            const s = new THREE.Sphere(h.position, h.scale.x); if (_ray.ray.intersectsSphere(s) && _ray.ray.origin.distanceTo(h.position) - h.scale.x < dA) { block = false; break; } } }
      }
      if (block !== altarBlock) { altarBlock = block; kit.weaponBlock(block ? W.noAltar : null); }
    }

    /* ---------------------------------------------------------------- the story's frame, its start and its reset */
    function storyTick(wdt, t) {
      spotsTick(); hitsTick(); scareTick(); doorTick(wdt); heatTick(wdt); altarTick();   // (the fan, the lamp and the glass: updateNotes, film or play; his hand on her head: updateNotes, play and the decision)
      fightTick(wdt);
    }
    function applyPhase(saved) {
      const R = readMark(saved);
      /* (a jump from one phase to another drops what the last one had queued: its lines, its timers, its busy hand-off:
         the v21.25 law, a phase jump leaves the line queue full) */
      phase = R.p; play.run++; play.busy = false; lineQ.length = 0; speakReset();
      if (R.p === 'history') historyBegin(R, !saved || !R.learned.length);
      else if (R.p === 'sight') sightBegin(R, false);
      else if (R.p === 'bless') blessBegin(R, false);
      else keptBegin();
    }
    function storyReset() {
      play.run++; play.busy = false; play.learned = new Set(); play.spoke = false; play.told = false; play.peeked = false;
      play.opened = false; play.looked = new Set(); play.closed = false; play.read = false; play.water = false; play.briefed = false;
      play.fight = null; play.appaGone = false; play.nerveOut = false; play.heat = 0; play.heatStep = 0; play.closeHold = 0;
      play.fanK = 1; play.fanTo = 1; play.scareSeed = SCARE_SEED; play.scareAt = 0; play.scared = new Set(); play.doorTo = -0.12; play.doorK = -0.12;
      play.fogged = false; play.fogAt = 0; fogK = 0; fogTo = 0; lampK = 0; lampTo = 0; crownK = 0; crownTo = 0; oppLooked = ''; wanderNext = 2;
      decOpen = false; altarBlock = false; bowlOnFloor.visible = true;
      for (const P of spirits.wander.concat([spirits.large, spirits.appa, spirits.oppress])) { P.gone = false; P.alpha = 1; }
      if (kit) { kit.bar(null); if (kit.weaponBlock) kit.weaponBlock(null); if (kit.visionUrge) kit.visionUrge(false); }
      lookAt0('FLAT'); castHome(); spiritsHome(); soundReset(); whenReady(cast.phoB, (P) => bowSet(P, 0));
    }
    function storySnap() { return { phase, learned: [...play.learned], looked: [...play.looked], water: play.water, fight: play.fight ? +play.fight.k.toFixed(3) : null, heat: +play.heat.toFixed(2) }; }

