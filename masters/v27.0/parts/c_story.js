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
                   fogged: false, fogAt: 0, closeHold: 0, breathSaid: -99 };
    let decOpen = false;
    const live = (run) => alive && run === play.run;
    const HEAD_OF = (P, dy = 0.08, fb) => { if (P && P.ready && P.head && P.group.visible) { P.head.getWorldPosition(_pv); return { x: _pv.x, y: _pv.y + dy, z: _pv.z }; } return fb; };
    const AMMA_HEAD = () => HEAD_OF(cast.amma, 0.1, { x: CHAIR.x, y: 1.25, z: CHAIR.z });
    const PHO_HEAD = () => { const P = cast.phoB.group.visible ? cast.phoB : cast.pho; return HEAD_OF(P, 0.1, { x: P.group.position.x, y: P.group.visible && P === cast.phoB ? 1.8 : 1.3, z: P.group.position.z }); };
    const RAVI_HEAD = () => HEAD_OF(cast.ravi, 0.1, { x: cast.ravi.group.position.x, y: 1.75, z: cast.ravi.group.position.z });
    const MALA_HEAD = () => HEAD_OF(cast.mala, 0.1, { x: cast.mala.group.position.x, y: 1.62, z: cast.mala.group.position.z });
    /* the five sources' places, measured from the things themselves (c_props.js) */
    const FOLDER_AT = { x: 4.80, y: 0.80, z: 6.40 };
    const OLDPHOTO_AT = { x: ROOMS.dining.x0 + 0.385, y: 1.17, z: 6.07 };          // the picture's middle in its frame (c_props.js)
    const APPA_PHOTO_AT = { x: 0.62, y: 1.50, z: ROOMS.living.z1 - 0.03 };
    const SMALLBOWL_AT = { x: BOWL.x + 0.30, y: 0.04, z: BOWL.z - 0.12 };
    const LAMP_AT = { x: VILAKKU.x, y: 0.43, z: VILAKKU.z };
    /* Mala KNEELING at it (her kneel's right hand over its wick, measured: tools/probes/takepath.mjs ABS=1 kneelhold), and
       the stand she was built in, given back whenever the family goes home */
    const MALA_LAMP = { x: VILAKKU.x + 0.085, z: VILAKKU.z - 0.30 };
    const MALA_KNEEL = { take: 'kneelhold', win: { kneelhold: [2.5, 1.0, 6.0] } }, MALA_STAND = cast.mala.rest;

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
        else if (play.fight && play.fight.on) o = play.fight.call === 'gold' ? W.objGold : W.objHold;
      }
      kit.objective(o, opts);
      kit.waypoint(wp);
      if (p === 'sight') urgeSight();
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
      cast.mala.rest = MALA_STAND;
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
      /* (empowered, his heart is steadied: it never passes 0.7 while the golden water is his, so the swarm is fought with his
         sight open and nothing shuts it for him: R26) */
      if (play.fight && play.fight.on && play.fight.call === 'gold') play.heat = Math.min(play.heat, 0.7);
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
      /* (shut for him only when his heart is PAST ITS LIMIT and his nerve low: 18 Nov, played by a finger, a fight that had
         cost him his nerve (the shapes that reach him take it too) shut his sight the instant he opened it, every time, and
         he could never see the room again. Held shut, his heart cools (5.5 s of HEAT.down), so he has some seconds of sight
         before it is past its limit again) */
      if (open && play.heat >= 1 && sanityNow() < HEAT.low && !play.closeHold && !play.busy && (phase === 'sight' || phase === 'bless')) nerveOut();
      if (play.closeHold && (play.closeHold -= wdt) <= 0) { play.closeHold = 0; kit.vision(null); }
    }
    /* "Close. Breathe." His sight shut for him and held shut for a few seconds; a price on the card (§4.3) */
    function nerveOut() {
      if (!kit || !kit.vision) return;
      kit.vision(false); kit.vision({ r: 0, moving: false }); play.closeHold = 5.5;
      play.nerveOut = true; bank(W.noteNerve, -4, 0);
      /* (his word the first time, and in the blessing at most once in 30 s: shut again later, the sight's own closing sound
         says it; 18 Nov) */
      const now = wallNow();
      if (!heard.has('ph4b1') || (phase === 'bless' && now - play.breathSaid > 30)) { play.breathSaid = now;
        phoSpeaks('ph4b1', () => talk(cast.phoB.group.visible ? cast.phoB : cast.pho, SECS.ph4b1 || 2)); }
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
      /* (in the fight the eye button's ask is worked out again on the next frame, from his sight as it now is: urgeTick) */
      if (play.fight && play.fight.on) play.fight.urge = null;
      else if (kit && kit.visionUrge) kit.visionUrge(false);
      if (on && (phase === 'history' || phase === 'sight')) oppressLooks();
      if (phase === 'history' && on && !play.peeked) { play.peeked = true; saveMark(); }
      if (phase === 'sight' && !play.busy) {
        if (on && !play.opened) { play.opened = true; saveMark(); const run = play.run; after(1.4, () => { if (live(run)) objectiveFor('sight'); }); }
        else if (!on && play.opened && play.looked.size >= 3 && !play.closed) { play.closed = true; readingBegin(); }
      }
      if (phase === 'sight' && !play.busy) urgeSight();
    }
    /* THE EYE BUTTON ASKS (Chad, 18 Nov: "When the game wants to prompt the user to enter or exit spirit vision, there also
       should be a different set of glow colour pulsating effect on the spirit vision icon so that the player clearly knows
       what to do"): in the sight, OPEN while there is something left to look at and his sight is shut, CLOSE once all three
       are seen and it is still open (the order says the same); nothing while a line hands off */
    function urgeSight() {
      if (!kit || !kit.visionUrge || phase !== 'sight') return;
      const open = visOpen();
      kit.visionUrge(!play.opened || play.looked.size < 3 ? (open ? false : 'open') : (!play.closed && open ? 'close' : false));
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
                        'u4fightmus', 'u4fightloop', 'u4chant1', 'u4chant2',
                        /* (18 Nov: her cries, the surge, the call and the gold; every line of the fight's stakes) */
                        'u4ascream1', 'u4ascream2', 'u4ascream3', 'u4surge', 'u4goldcall', 'u4goldpower', 'u4goldflick', 'u4goldclear', 'u4sting',
                        'ph4b3', 'ph4b4', 'ph4b5', 'q4f1', 'q4f2', 'ph4f1', 'q4f3', 'ph4f2', 'q4f4', 'ph4f3', 'rv4f1', 'ml4B2', 'rv4A2', 'u4visoff',
                        /* (18 Nov: the green ones' own voices) */
                        'u4sv1', 'u4sv2', 'u4sv3', 'u4sv4', 'u4sv5', 'u4svL'];
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
      /* Mala kneeling at her mother's lamp, to light it and to keep it through the night (18 Nov: she was sent to the lamp
         from the fan in full view and back again, and her lighting take, made for a lamp at head height, lit a floor lamp
         at 1.6 m); Ravi by the fan */
      whenReady(cast.mala, (P) => { put(P, MALA_LAMP.x, MALA_LAMP.z, 0); P.rest = MALA_KNEEL; rest(P, 0); });
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
      /* (she kneels there already, placed in the black: the match, the flame taking under her hands, and the room goes) */
      after(0.6, () => { if (!live(run)) return; fx('u4match', 0.7, panOf(LAMP_AT)); });
      after(1.1, () => { if (!live(run)) return; lampLit(false); });
      after(2.8, () => { if (!live(run)) return; if (done) done(); });
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
      /* (the order is done the moment the bowl is in his hands: 18 Nov, played by a finger, "Take the holy water" came back
         under the fight's brief after the splash, the order cleared nowhere: objectiveFor waits while play is busy) */
      play.busy = true; if (kit) { kit.waypoint(null); kit.objective(null); }
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
      /* (18 Nov: Mala keeps her mother's lamp, kneeling at the shrine's right end, so what comes for her comes along the
         back wall from the master bedroom's door; the shape under the dining table goes for her brother by the fan: from
         there to her it crawled through the master bedroom's wall, and from bedroom 3 to her through her mother's chair) */
      { at: 2.5, list: [['corner0', 'amma', 0.30], ['corner1', 'ravi', 0.28], ['bed3', 'me', 0.30]] },
      { at: 38, list: [['master', 'ravi', 0.34], ['passage', 'pho', 0.33], ['door', 'me', 0.34], ['kitchen', 'amma', 0.32]] },
      { at: 76, list: [['master', 'mala', 0.37], ['store', 'me', 0.36], ['passage', 'amma', 0.34], ['kitchen', 'amma', 0.26, 'large']] } ],
      /* THE SURGE (Chad, 18 Nov: "when there are too many green entities coming towards the end"; "this dramatic sequence
         should happen only at the end when many green entities appear and it feels impossible for the player to clear. The
         player needs to feel desperate first"): at the blessing's 0.70, twelve at once from every door and corner, quick, most
         of them for her, and two more every 1.6 s while it lasts; the blessing held at 0.82 until the call is answered. He
         calls after 7 s of it (after 4 if her life is under 40) */
      surgeAt: 0.70, hold: 0.82, trickle: 1.6, callAfter: 7, callLow: { secs: 4, hp: 40 },
      surge: [['door', 'amma', 0.46], ['bed3', 'amma', 0.44], ['master', 'amma', 0.45], ['passage', 'amma', 0.47], ['kitchen', 'amma', 0.44],
              ['store', 'amma', 0.45], ['corner0', 'amma', 0.43], ['corner1', 'pho', 0.44], ['door', 'me', 0.45], ['bed3', 'ravi', 0.42],
              ['master', 'mala', 0.43], ['passage', 'me', 0.46]],
      /* EMPOWERED, to the blessing's end (R28, R29: "the green entities should swarm in the screen in dramatic numbers ... they
         keep spawning even after getting cleared ... until the whole timer is completed"): a batch of seven to nine every
         1.8 s, rising round HER, 1.7 to 2.8 m out on every side (through her walls and floor, as they do), so they come at
         her where he is looking; never more than sixteen in the room (freeBody). (18 Nov, photographed: from the room's
         doors, five to seven at a time, six were in the room and most of them out of his view) */
      batch: { every: 1.8, min: 7, max: 9, r0: 1.7, r1: 2.8 } };
    const REACH = { me: 0.75, amma: 0.62, pho: 0.6, ravi: 0.55, mala: 0.55 };
    /* AMMA'S LIFE IN HIS KEEPING (Chad, 18 Nov: "There must be consequences if the spirit entities in green gets to the lady in
       wheelchair. Everytime the green spirits get to her, she screams one time, and her health bar drops. Put a health bar on
       the lady in wheelchair. If her health bar drops to 0, the player loses this game and chapter and has to restart
       again"): a green one that reaches her takes 9 of her 100 (the large one 16), and again every 4.5 s it stays; she cries
       out each time (her three cries in turn, never two within 0.6 s); from the surge until 4 s into the gold she is never
       taken under 15 (the call is the story's, and comes whatever he did), and at 0 the chapter is lost (ammaLost) */
    const LIFE = { wander: 9, large: 16, again: 4.5, floor: 15, grace: 4 };
    const CRIES = ['u4ascream1', 'u4ascream2', 'u4ascream3'];
    /* GRANDMASTER PHO CALLS HIM BACK TO HIS SIGHT (Chad, 18 Nov: "If the player gets out of spirit vision for too long and is
       not doing anything to chase the green spirits away, grandmaster pho will have a voice line that tells him to go back
       into spirit vision to chase the entities away. This voiceline can keep repeating as long as the player is not in
       spirit vision"): six seconds shut with green ones in the room and none of them reached by his water in those six, then
       again eleven seconds after each; never while his sight is held shut for him, nor in the call; his three lines in turn */
    const NAG = { first: 6, again: 11, lines: ['ph4b3', 'ph4b4', 'ph4b5'] };
    function fightBegin() {
      const F = play.fight = { on: true, t: 0, k: 0, wave: 0, shapes: [], fed: 0, families: 0, famCost: 0, captions: 0, ended: false,
                               hp: 100, cries: 0, criedAt: -99, lost: false, call: null, callT: 0, trickleAt: 0, goldT: 0, batchAt: 0,
                               cleared: 0, chantHeld: false, shutFor: 0, nagNext: NAG.first, nags: 0, lastStrike: -99, urge: null,
                               saidMala: false, saidRavi: false, seed: 0x4c4f0d,
                               vseed: 0x5f1e0d, voxAt: 2.5, voxBigAt: 0, voxLast: '', voxUntil: [] };
      if (kit) { kit.bar(0); if (kit.health) kit.health({ label: W.ammaBar, k: 1, at: () => { const h = AMMA_HEAD(); return [h.x, h.y + 0.32, h.z]; } }); }
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
        const P = large ? shapeOf(0, true) : from === 'corner0' ? shapeOf(0) : from === 'corner1' ? shapeOf(1) : freeBody();
        if (!P) continue;
        const at = FROM[from]; if (!/^corner/.test(from)) put(P, at.x, at.z, faceTo(at.x, at.z, FAMILY[to]().x, FAMILY[to]().z));
        take(P, large ? 'lumber' : (P.slot % 2 ? 'creep' : 'crawl'), 0.4);
        F.shapes.push({ P, to, v, need: large ? 3 : 1, hits: 0, state: 'come', t: 0, back: 0, fedAt: -99 });
      }
      if (w.list.some(r => r[3] === 'large')) fx('u4large', 0.8, panOf(FROM.kitchen));
      fx('u4whisper', 0.55, 0);
      /* (Chad, 18 Nov: "Have some dramatic voicelines along the way"): the second wave, his; the large one, his and his
         teacher's word on it */
      if (w === FIGHT.waves[1]) say('q4f1', null);                       // "More of them. From the doors."
      if (w.list.some(r => r[3] === 'large')) { say('q4f2', null); phoQueued('ph4f1'); }   // "What is that...?" / "A heavy one. Again, and again, until it goes."
      void run;
    }
    /* a free body for one more of them: one no living shape in the fight is wearing (one still fading wears it too), taken in
       turn from where the last was taken; none, and nothing more comes (never more than sixteen in the room). The two that
       wait in the corners are the first wave's */
    function freeBody() {
      const F = play.fight, used = new Set();
      for (const S of F.shapes) if (S.state !== 'gone') used.add(S.P);
      for (let n = 0; n < WANDER_N; n++) {
        const i = (wanderNext + n) % WANDER_N, P = spirits.wander[i];
        if (used.has(P) || !P.ready || (i < 2 && F.wave < 1)) continue;
        wanderNext = i + 1; return shapeOf(i);
      }
      return null;
    }
    /* the fight's own seeded stream (v6.15: nothing random unseeded; begun again with every fight) */
    function fightRnd() { const F = play.fight; F.seed = (F.seed * 1103515245 + 12345) >>> 0; return (F.seed >>> 8) / 16777216; }
    /* THE GREEN ONES' OWN VOICES (Chad, 18 Nov: "Each entity should also make its own sounds and voices , like groaning
       sounds or angry sounds"): now and then one of them is heard from where it is, a groan, a snarl, a moan or a rasp
       (never the same twice running); the large one growls in its own deeper voice; one that reaches someone, or is struck
       and not yet sent, shrieks. Panned by where it stands, quieter further off and while anyone speaks, never more than
       two at once, closer together in the swarm. A cosmetic stream of its own (v6.15: the fight's own draws stay as they
       were), begun again with every fight */
    const VOX = ['u4sv1', 'u4sv2', 'u4sv3', 'u4sv4'], VOX_LEN = { u4sv1: 1.8, u4sv2: 1.4, u4sv3: 2.2, u4sv4: 1.4, u4sv5: 1.2, u4svL: 2.8 };
    function voxRnd() { const F = play.fight; F.vseed = (F.vseed * 1664525 + 1013904223) >>> 0; return F.vseed / 4294967296; }
    function voxPlay(name, at, vol) {
      const F = play.fight; if (!F || !at) return false;
      F.voxUntil = F.voxUntil.filter(u => u > F.t);
      if (F.voxUntil.length >= 2) return false;
      const d = Math.hypot(at.x - yaw.position.x, at.z - yaw.position.z), near = Math.max(0.4, Math.min(1, 2.4 / Math.max(1, d)));
      fx(name, vol * near * (dayClock.t < speak.until ? 0.6 : 1), panOf(at));
      F.voxUntil.push(F.t + VOX_LEN[name]); return true;
    }
    function voxTick() {
      const F = play.fight; if (!F || !F.on || F.t < F.voxAt) return;
      const live = F.shapes.filter(S => (S.state === 'come' || S.state === 'feed') && S.P.group.visible);
      if (!live.length) { F.voxAt = F.t + 0.8; return; }
      const big = live.find(S => S.P === spirits.large), small = live.filter(S => S !== big);
      let S = null, name = '';
      if (big && F.t >= F.voxBigAt) { S = big; name = 'u4svL'; F.voxBigAt = F.t + 3.6 + 2.2 * voxRnd(); }
      else if (small.length) {
        S = small[Math.floor(voxRnd() * small.length)];
        let k = Math.floor(voxRnd() * VOX.length); if (VOX[k] === F.voxLast) k = (k + 1 + Math.floor(voxRnd() * (VOX.length - 1))) % VOX.length;
        name = VOX[k];
      }
      if (S && voxPlay(name, S.P.group.position, name === 'u4svL' ? 0.9 : S.state === 'feed' ? 0.72 : 0.58) && name !== 'u4svL') F.voxLast = name;
      F.voxAt = F.t + (F.call === 'gold' || F.call === 'surge' || F.call === 'asking' ? 0.5 + 0.45 * voxRnd() : 1.0 + 1.2 * voxRnd());
    }
    /* one more of them, at a door or a corner (a hand's spread round it, so a batch never stands in one place), for one of
       the people in the room */
    function spawnAt(from, to, v) {
      const F = play.fight, P = freeBody(); if (!P) return null;
      const at = FROM[from], x = at.x + (fightRnd() - 0.5) * 0.5, z = at.z + (fightRnd() - 0.5) * 0.5, tg = FAMILY[to]();
      put(P, x, z, faceTo(x, z, tg.x, tg.z));
      take(P, P.slot % 2 ? 'creep' : 'crawl', 0.3);
      const S = { P, to, v, need: 1, hits: 0, state: 'come', t: 0, back: 0, fedAt: -99 };
      F.shapes.push(S); return S;
    }
    function fightTick(wdt) {
      const F = play.fight; if (!F || !F.on) return;
      if (getState() !== 'play') return;
      F.t += wdt; fightMusTick();
      while (F.wave < FIGHT.waves.length && F.t >= FIGHT.waves[F.wave].at) waveStart(FIGHT.waves[F.wave++]);
      /* the blessing's own pace: slowed while anything crowds her or her teacher (empowered, at its full pace: R29) */
      let slow = 1; if (F.call !== 'gold') for (const S of F.shapes) if (S.state === 'feed' && (S.to === 'amma' || S.to === 'pho')) slow *= 0.5;
      /* (never under a third of its pace: crowded, the blessing slows, and a fight left alone still ends in about five
         minutes, not twelve: 18 Nov) */
      F.k = Math.min(1, F.k + wdt / FIGHT.secs * Math.max(0.35, slow));
      stakesTick(wdt); if (!F.on) return;
      voxTick();
      if (kit) kit.bar(F.k);
      if (!F.chantHeld) while (F.captions < CHANT.length && F.k > CHANT[F.captions].at) chantSing(CHANT[F.captions++]);
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
          else { S.state = 'feed'; feed(S); if (!F.on) return; }
        } else if (S.state === 'feed') {
          if (S.to === 'me') { if (d > REACH.me + 0.5) S.state = 'come'; else if (S.t - S.fedAt > 4) feed(S); }
          else if (S.t - S.fedAt > (S.to === 'amma' ? LIFE.again : 6)) feed(S);
          if (!F.on) return;                                     // (her life ran out on this one: the loss has begun)
          P.group.rotation.y = faceTo(P.group.position.x, P.group.position.z, tg.x, tg.z);
        }
      }
      if (F.k >= 1 && !F.ended) fightEnd();
    }
    /* one reaches its mark: what it costs */
    function feed(S) {
      const F = play.fight; S.fedAt = S.t; F.fed++;
      if (S.to !== 'me') voxPlay(S.P === spirits.large ? 'u4svL' : 'u4sv5', S.P.group.position, 0.62);
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
        /* (what reaches her children costs his awareness, up to 10 in the fight: 18 Nov, a slow finger let one reach them 78
           times, each a 2, and the stat was gone by the fight's middle; past the cap they still gasp, and still count) */
        if (F.famCost < 10) { F.famCost += 2; kit.award('awareness', -2, { minigame: true }); }
        /* (Mala kneeling at the lamp gasps where she kneels: her scream is a standing take, and it stood her up and knelt her
           down again in a second) */
        const P = cast[S.to]; if (P === cast.mala && P.rest !== MALA_KNEEL) whenReady(P, (Q) => { span(Q, 'scream', 0.4, 2.2, 1.0, { then: () => rest(Q, 0.8) }); });
      } else if (S.to === 'amma') { F.families++; ammaHurt(S); }
    }
    /* one reaches her: what it takes of her life, her cry, her children's, and the loss at 0 */
    function ammaHurt(S) {
      const F = play.fight; if (!F || !F.on || F.lost) return;
      const floor = (F.call && F.call !== 'gold') || (F.call === 'gold' && F.goldT < LIFE.grace) ? LIFE.floor : 0;
      F.hp = Math.max(Math.min(F.hp, floor), F.hp - (S.P === spirits.large ? LIFE.large : LIFE.wander));
      if (kit && kit.health) kit.health({ k: F.hp / 100 });
      const now = wallNow();
      if (now - F.criedAt > 0.6) { F.criedAt = now; fx(CRIES[F.cries++ % CRIES.length], 0.9, panOf(CHAIR)); }
      /* her children, the first times they see her hurt (Mala kneels at the lamp: her word without a standing take) */
      if (!F.saidMala && F.hp <= 80) { F.saidMala = true; say('ml4B2', null); }                 // "Amma!"
      else if (!F.saidRavi && F.hp <= 55) { F.saidRavi = true; say('rv4f1', cast.ravi, false); }   // "Amma! What's happening to her?"
      if (F.hp <= 0) ammaLost();
    }
    /* HER LIFE RUNS OUT: the chapter is lost (the fifty-third seam, kit.lose): its own film (FILMS.lost), its card's two lines,
       the save put back at the chapter's start, Retry from there (Chad: "the player loses this game and chapter and has to
       restart again") */
    function ammaLost() {
      const F = play.fight; if (!F || F.lost) return;
      F.lost = true; F.on = false; F.chantHeld = true;
      fightMusOff(); chantStop(); chantNow = null; lineQ.length = 0;
      if (kit) { kit.bar(null); kit.captions(null); if (kit.health) kit.health(null); if (kit.visionUrge) kit.visionUrge(false);
        if (kit.edge) kit.edge(null); if (kit.sprayColor) kit.sprayColor(null); }
      if (!kit || !kit.lose || !kit.lose({ film: 'lost', say: W.lostSay, teaching: W.lostTeach })) play.loseWait = true;   // (refused: asked again on the next frame of play)
    }
    /* the water reaches one (stage.onShot): released, or staggered (the large one takes three) */
    const hitOwner = new Map();
    for (const P of [spirits.oppress, spirits.appa, spirits.large].concat(spirits.wander)) if (P.hit) hitOwner.set(P.hit, P);
    /* THE FLICK'S REACH (Chad, 18 Nov: "make the aoe of the water flicking bigger"): every green one whose middle is within
       0.42 m of the flick's line, and 0.11 m more for each metre out (a metre at most), out to 8 m, is reached with the one
       the line struck; Appa only when it is aimed at him (his sphere is the one the line must meet: "Not everything you see
       is against you"). AND THE GOLDEN WATER (R27: "every flick from it clears all green entities on the whole screen in a
       single flick"): every green one inside his view is sent back, and the bowl stays full */
    const FAN = { r0: 0.42, perM: 0.11, max: 1.0, far: 8 };
    const _fr = new THREE.Vector3(), _fq = new THREE.Vector3(), _frus = new THREE.Frustum(), _frm = new THREE.Matrix4(), _fsph = new THREE.Sphere();
    function onShot(r) {
      const F = play.fight;
      if (F && F.on && F.call === 'gold') { goldFlick(); return; }
      const P = r && r.object ? hitOwner.get(r.object) : null;
      if (r && r.point) fx('u4patter', 0.5, panOf(r.point));
      if (P === spirits.appa) { appaStruck(); return; }
      if (P === spirits.oppress) return;                     // (her teacher's work, not the water's: it does not move)
      if (!F || !F.on) return;
      const reached = [];
      if (P) { const S = F.shapes.find(q => q.P === P && q.state !== 'gone' && q.state !== 'leave'); if (S) reached.push(S); }
      if (r && r.ray) for (const S of F.shapes) {
        if (S.state === 'gone' || S.state === 'leave' || reached.includes(S)) continue;
        const m = S.P.hit; if (!m || !m.visible) continue;
        _fr.copy(m.position).sub(r.ray.origin); const along = _fr.dot(r.ray.direction);
        if (along < 0.15 || along > FAN.far) continue;
        _fq.copy(r.ray.direction).multiplyScalar(along).add(r.ray.origin);
        if (_fq.distanceTo(m.position) <= Math.min(FAN.max, FAN.r0 + FAN.perM * along)) reached.push(S);
      }
      let sent = 0;
      for (const S of reached) if (strike(S)) sent++;
      if (reached.length) F.lastStrike = F.t;
      if (sent) fx('u4release', Math.min(0.95, 0.7 + 0.08 * (sent - 1)), panOf(reached[0].P.group.position));
    }
    /* the water on one of them: sent back (released), or staggered back (the large one takes three) */
    function strike(S) {
      const P = S.P; S.hits++;
      if (P.fx) { P.fx.set('uFill', 0.9); const run = play.run; after(0.25, () => { if (live(run) && P.fx && S.state !== 'leave') P.fx.set('uFill', P === spirits.large ? SPIRIT.large.fill : SPIRIT.wander.fill); }); }
      if (S.hits >= S.need) { S.state = 'leave'; S.leave = 0; return true; }
      S.back = 0.8; S.state = 'come'; voxPlay(P === spirits.large ? 'u4svL' : 'u4sv5', P.group.position, 0.8); return false;
    }
    function goldFlick() {
      const F = play.fight; let n = 0;
      camera.updateMatrixWorld(); _frm.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse); _frus.setFromProjectionMatrix(_frm);
      for (const S of F.shapes) {
        if (S.state === 'gone' || S.state === 'leave') continue;
        const m = S.P.hit; if (!m || !m.visible) continue;
        _fsph.center.copy(m.position); _fsph.radius = m.scale.x; if (!_frus.intersectsSphere(_fsph)) continue;
        S.state = 'leave'; S.leave = -0.25 * ((n * 0.6180339887) % 1); n++;       // (each on its own beat over a quarter second: v6.15)
      }
      fx('u4goldflick', 0.9, 0);
      if (n) { fx('u4goldclear', Math.min(1, 0.78 + 0.03 * n), 0); F.lastStrike = F.t; F.cleared += n; }
      if (kit && kit.ammo) kit.ammo(DATA.weapon.rounds);       // (the golden water never runs dry: no dip in the swarm)
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
      after(2.2, () => { if (live(run)) phoSoon('ph4b2'); });
    }
    /* the end of the chant: the shapes thin away; silence but for the lamp's flame and her breathing */
    /* HIS CHANT (the plan's D13; masters/v27.0/chant/build.py): each line sung by him while its words are on screen,
       twice with a breath between (its caption stands for both), from where he stands; four times through the blessing
       at its own pace (the bar), the two lines in turn. Only ever under its caption: a chant with words is captioned
       (v21.31) */
    const CHANT_GAP = 1.2;
    const CHANT = [{ at: 0.06, n: 'u4chant1', len: 5.98, cap: 'cap1' }, { at: 0.30, n: 'u4chant2', len: 8.94, cap: 'cap2' },
                   { at: 0.55, n: 'u4chant1', len: 5.98, cap: 'cap1' }, { at: 0.80, n: 'u4chant2', len: 8.94, cap: 'cap2' }];
    let chantNodes = [], chantNow = null, chantTok = 0;
    function chantStop() { chantTok++; for (const a of chantNodes) { try { a.stop(); } catch (e) { } } chantNodes = []; }
    function chantLine(C) {
      chantStop(); chantNow = C; if (!worldSfx || (soundOff && soundOff())) return;
      const tok = chantTok, g = cast.phoB.group.position, sing = () => { if (tok !== chantTok) return;
        const a = worldSfx(C.n, 0.95, 1, panAt(g.x, g.z)); if (!a) return;
        chantNodes.push(a); a.addEventListener('ended', () => { const i = chantNodes.indexOf(a); if (i >= 0) chantNodes.splice(i, 1); }); };
      sing(); const run = play.run; after(C.len + CHANT_GAP, () => { if (live(run) && play.fight && play.fight.on) sing(); });
    }
    /* a chant line sung, its caption with it (both of its times and the breath between) */
    function chantSing(C) {
      chantLine(C);
      if (kit && kit.captions) kit.captions([{ at: 0, end: 2 * C.len + CHANT_GAP + 0.4, text: W[C.cap], sub: W[C.cap + 'Sub'] }]);
    }
    /* HE BREAKS OFF HIS CHANT TO SPEAK (18 Nov: "Close. Breathe." and his word after the water reached Appa were said over
       his own chant, one man chanting and talking at once): the line he is singing fades in a quarter of a second, he
       speaks, and then begins that line again from its start, under its caption. Between lines nothing is cut */
    /* (a line refused while another voice is live is never taken as said, and his chant is never broken off for a line
       that does not come: 18 Nov, sayLine's refusal is never ignored, v9.5) */
    function phoSpeaks(name, onStart) {
      if (dayClock.t < speak.until || speak.pending || lineQ.length) return false;
      chantBreak((SECS[name] || 2.5) + 0.9);
      return sayLine(name, 1, onStart);
    }
    /* the line he is singing faded in a quarter of a second; begun again from its start `resumeIn` seconds later, unless the
       chant has moved on or is held (the call) */
    function chantBreak(resumeIn) {
      const F = play.fight, singing = !!(F && F.on && chantNow && chantNodes.length);
      if (!singing) return;
      const tok = ++chantTok, nodes = chantNodes; chantNodes = [];
      for (const a of nodes) { try { const g = a.__g && a.__g.gain, t = a.context.currentTime;
        if (g) { g.cancelScheduledValues(t); g.setValueAtTime(g.value, t); g.linearRampToValueAtTime(0.0001, t + 0.25); }
        a.stop(t + 0.3); } catch (e) { } }
      if (kit && kit.captions) kit.captions(null);
      if (resumeIn == null) return;
      const C = chantNow, run = play.run;
      after(resumeIn, () => { if (live(run) && play.fight && play.fight.on && !play.fight.chantHeld && chantTok === tok) chantSing(C); });
    }
    /* his word in the order of the lines (the queue), his chant broken off as it begins */
    function phoQueued(name) { queueFn(() => chantBreak((SECS[name] || 2.5) + 0.9)); queueLine(name, () => talk(cast.phoB, SECS[name] || 2.5)); }
    /* his word as soon as the room is quiet for it (asked again every half second, a few seconds at most) */
    function phoSoon(name, tries = 12) {
      const run = play.run;
      const go = (n) => { if (!live(run)) return; if (!phoSpeaks(name, () => talk(cast.phoB, SECS[name] || 2.6)) && n > 0) after(0.5, () => go(n - 1)); };
      go(tries);
    }
    function fightEnd() {
      const F = play.fight; F.ended = true; F.on = false; fightMusOff(); chantStop(); chantNow = null;
      /* (each shape still in the room goes on its own beat: a golden-ratio spread over 0.4 s by its place in the list, the
         same on every run and every replay: v6.15, nothing random unseeded) */
      F.shapes.forEach((S, i) => { if (S.state !== 'gone' && S.state !== 'leave') { S.state = 'leave'; S.leave = -0.4 * ((i * 0.6180339887) % 1); } });
      if (kit) { kit.bar(null); kit.captions(null); if (kit.health) kit.health(null); if (kit.visionUrge) kit.visionUrge(false);
        if (kit.edge) kit.edge(null); if (kit.sprayColor) kit.sprayColor(null); }
      if (F.families <= 1) bank(W.noteKept, 0, 4);
      whenReady(cast.phoB, (P) => handOnHead(P, false));
      if (kit && kit.vision) kit.vision(false);
      setPhase('kept');
      const run = play.run;
      after(2.6, () => { if (live(run)) trance(); });
    }
    /* ---------------------------------------------------------------- THE STAKES AND THE CALL (Chad's two messages of
       18 Nov: plan §0 R16 to R29), every frame of the fight after the blessing's pace: the surge, the call, the golden
       swarm; his teacher calling him back to his sight; and what the eye button asks */
    function stakesTick(wdt) {
      const F = play.fight, open = visOpen();
      let live = 0; for (const S of F.shapes) if (S.state === 'come' || S.state === 'feed') live++;
      if (!open && !play.closeHold) F.shutFor += wdt; else F.shutFor = 0;
      if (!F.call && F.k >= FIGHT.surgeAt) surgeBegin();
      if (F.call === 'surge') { F.callT += wdt; if (F.callT >= FIGHT.callAfter || (F.callT >= FIGHT.callLow.secs && F.hp < FIGHT.callLow.hp)) callBegin(); }
      if ((F.call === 'surge' || F.call === 'asking') && (F.trickleAt -= wdt) <= 0) {
        F.trickleAt = FIGHT.trickle; const keys = Object.keys(FROM);
        for (let i = 0; i < 2; i++) spawnAt(keys[Math.floor(fightRnd() * keys.length)], fightRnd() < 0.75 ? 'amma' : 'me', 0.44 + 0.06 * fightRnd());
      }
      if (F.call && F.call !== 'gold') F.k = Math.min(F.k, FIGHT.hold);          // (the blessing stalls under the swarm until the call is answered)
      if (F.call === 'gold') { F.goldT += wdt; if ((F.batchAt -= wdt) <= 0) { F.batchAt = FIGHT.batch.every; goldBatch(); } }
      nagTick(open, live);
      urgeTick(open, live);
      if (F.shapes.length > 48) F.shapes = F.shapes.filter(S => S.state !== 'gone');      // (the gone, let go of)
    }
    /* THE SURGE: twelve at once from every door and corner, the room's whisper rising, his heart kicking */
    function surgeBegin() {
      const F = play.fight; F.call = 'surge'; F.callT = 0; F.trickleAt = FIGHT.trickle;
      if (kit && kit.itemWarm) kit.itemWarm('amulet');                          // (his amulet's model ready before it is called: R33)
      for (const [from, to, v] of FIGHT.surge) spawnAt(from, to, v);
      fx('u4surge', 0.95, 0); fx('u4whisper', 0.75, 0);
      if (kit && kit.pulse) kit.pulse({ bpm: 172, secs: 1.0, erratic: 0.5 });
    }
    /* THE CALL: he shouts to his teacher; his teacher breaks off his chant for his word; he calls out; the amulet answers */
    function callBegin() {
      const F = play.fight; F.call = 'asking';
      say('q4f3', null);                                                      // "Grandmaster, there are way too many of them!"
      queueFn(() => chantHush());                                              // (his chant broken off for his word, and held until the gold)
      queueLine('ph4f2', () => talk(cast.phoB, SECS.ph4f2 || 2.6));           // "Call out to Luang Phor Phiboon, now!"
      say('q4f4', null);                                                      // "Luang Phor Phiboon... please, help us."
      queueFn(() => showAmulet());
    }
    function chantHush() { const F = play.fight; if (F) F.chantHeld = true; chantBreak(null); }
    /* HIS AMULET (Chad: "the luang phor phiboon amulet in its full 3d rotating model suddenly and dramatically appears in the
       middle of the screen in a golden glow enveloping it, seemingly empowering the user, and then disappears away"; and,
       of build 19's: "there is no need for text at the top and bottom, and i want the effect to be different from the
       'item unlocked' effect. It should not totally obscure the whole screen"): the fifty-fifth seam's SHOWCASE, no words,
       nothing over the room but its light; the fight stands still under it. Its model was made ready under the chapter's
       curtain (`items`), and warmed again at the surge. Build 21 (Chad, 18 Nov: "design a new nicer effect ... The rays
       you showed come from the item unlocked effect"; "floating hovering slight subtle bobbing ... the screen shakes as it
       release its power, and a circular halo glow effect releases from the amulet outwards"): its own entrance, 4.2 s (the
       engine's showcase): born from gathered light, it turns and hovers; 1.2 s before the end it RELEASES ITS POWER (the
       room shakes, halos go out, its sound), and the golden wave goes through the room from that moment; then it goes down
       into the holy water */
    const WAVE_GOLD = { color: 0xffc552, secs: 3.2, reach: 14, trail: 0.12 };
    function showAmulet() {
      const F = play.fight; if (!F || !F.on) return;
      F.call = 'shown'; F.urge = null; F.released = false; if (kit && kit.visionUrge) kit.visionUrge(false);
      const go = () => { if (play.fight === F && F.on) goldBegin(); };
      const release = () => { if (play.fight !== F) return; F.released = true; if (kit && kit.wave) kit.wave(WAVE_GOLD); };
      if (!(kit && kit.unlock && kit.unlock('amulet', { showcase: true, auto: 4.2, sound: 'u4goldcall', releaseSound: 'u4goldpower', onRelease: release, onClose: go }))) go();
    }
    /* EMPOWERED (R26 to R29: "the entire screen seem to have a golden vignette to show the new empowered status, and now the
       water being flicked becomes golden glow instead"): the gold at the edges of his sight (the fifty-sixth seam), the water
       gold; the amulet's light sends back every one in the room at once; his heart steadied; his teacher's word, and his
       chant again; and the swarm */
    function goldBegin() {
      const F = play.fight; F.call = 'gold'; F.goldT = 0; F.batchAt = 1.0; F.urge = null;
      /* (and its light goes out through the room from him, every thing and every outline it crosses burning gold, as his
         sight's own wave does: the fifty-seventh seam. Chad: "empowers with a golden glow that spreads throughout the scene,
         tracing every item and silhouette similar to how the spirit vision works") */
      /* (sent from the showcase's release when it ran, with its sound: here only when it could not be shown. Build 21: 14 m in
         3.2 s with a slow trail, so the room stays traced in gold while it fades: at 26 m in 2.6 s it crossed the room in a
         fifth of a second and was gone) */
      if (!F.released && kit && kit.wave) kit.wave(WAVE_GOLD);
      if (kit) { if (kit.edge) kit.edge({ color: [255, 196, 84], k: 0.85, secs: 1.2 }); if (kit.sprayColor) kit.sprayColor(0xffc24a, { size: 1.6 }); if (kit.ammo) kit.ammo(DATA.weapon.rounds); }
      if (!F.released) fx('u4goldpower', 1, 0);
      /* (the amulet's light reaches her too: her life at least half back. 18 Nov, photographed: held at 15 through the surge,
         she came into the gold two touches from the loss, and the power he was given was spent guarding a last breath) */
      F.hp = Math.max(F.hp, 50); if (kit && kit.health) kit.health({ k: F.hp / 100 });
      let i = 0; for (const S of F.shapes) if (S.state !== 'gone' && S.state !== 'leave') { S.state = 'leave'; S.leave = -0.5 * ((i++ * 0.6180339887) % 1); }
      if (i) fx('u4goldclear', 0.9, 0);
      play.heat = Math.min(play.heat, 0.5);
      if (kit && kit.pulse) kit.pulse({ bpm: 124, secs: 2.2 });
      objectiveFor('bless');
      queueLine('ph4f3', () => talk(cast.phoB, SECS.ph4f3 || 3));            // "Now you are not alone. Send them back."
      queueFn(() => { F.chantHeld = false; if (play.fight === F && F.on && chantNow) chantSing(chantNow); });
    }
    /* a batch of five to seven from the room's edges, most of them for her (R28: "the green entities should swarm in the
       screen in dramatic numbers, filling the screen with many of them") */
    function goldBatch() {
      const B = FIGHT.batch, n = B.min + Math.floor(fightRnd() * (B.max - B.min + 1)), a0 = fightRnd() * Math.PI * 2;
      let made = 0;
      for (let i = 0; i < n; i++) {
        const u = fightRnd(), to = u < 0.62 ? 'amma' : u < 0.80 ? 'me' : u < 0.88 ? 'pho' : u < 0.94 ? 'ravi' : 'mala';
        const a = a0 + (i + 0.5 * fightRnd()) * (Math.PI * 2 / n), r = B.r0 + (B.r1 - B.r0) * fightRnd();
        const x = CHAIR.x + Math.sin(a) * r, z = CHAIR.z + Math.cos(a) * r;
        if (Math.hypot(x - yaw.position.x, z - yaw.position.z) < 1.2) continue;      // (never risen on top of him)
        if (!spawnRound(x, z, to, 0.40 + 0.1 * fightRnd())) break; made++; }
      if (made) fx(made > 4 ? 'u4surge' : 'u4whisper', 0.55, 0);
    }
    /* one more of them where it is asked to rise (the gold's ring round her) */
    function spawnRound(x, z, to, v) {
      const F = play.fight, P = freeBody(); if (!P) return null;
      const tg = FAMILY[to](); put(P, x, z, faceTo(x, z, tg.x, tg.z));
      take(P, P.slot % 2 ? 'creep' : 'crawl', 0.3);
      const S = { P, to, v, need: 1, hits: 0, state: 'come', t: 0, back: 0, fedAt: -99 };
      F.shapes.push(S); return S;
    }
    function nagTick(open, live) {
      const F = play.fight;
      if (open) { F.nagNext = NAG.first; return; }
      if (play.closeHold || !live || F.call === 'asking' || F.call === 'shown' || F.shutFor < F.nagNext) return;
      if (F.t - F.lastStrike < NAG.first) { F.nagNext = F.shutFor + 1; return; }      // (his water is reaching them blind: he is doing something)
      const name = NAG.lines[F.nags % NAG.lines.length];
      if (phoSpeaks(name, () => talk(cast.phoB, SECS[name] || 2.6))) { F.nags++; F.nagNext = F.shutFor + (SECS[name] || 2.6) + NAG.again; }
      else F.nagNext = F.shutFor + 0.5;                                               // (a voice is live: asked again in half a second)
    }
    /* THE EYE BUTTON IN THE FIGHT: OPEN when his sight is shut with green ones in the room (straight away at the start and in
       the surge and the gold, after 3 s otherwise); CLOSE when it is open and his heart is near its limit (0.85: past 1 his
       nerve drains); nothing under the showcase or while his sight is held shut for him */
    function urgeTick(open, live) {
      const F = play.fight; let u = false;
      if (F.call === 'shown' || play.closeHold) u = false;
      else if (open) u = play.heat >= 0.85 && F.call !== 'gold' ? 'close' : false;
      else if (live && (F.shutFor >= 3 || F.t < 8 || F.call)) u = 'open';
      if (u !== F.urge) { F.urge = u; if (kit && kit.visionUrge) kit.visionUrge(u); }
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
      if (warmSounds) warmSounds(['u4scuffle', 'rv4A1', 'u4cry', 'ml4A1', 'u4torn', 'u4endA', 'u4stand', 'am4A1', 'rv4A2', 'ph4A1', 'q4A1',
                      'u4flick', 'u4patter', 'u4dip', 'ml4B1', 'u4chill', 'u4heart', 'u4fall', 'ph4B0', 'ml4B2', 'u4endB', 'ml4B3', 'ph4B1', 'q4B1',
                      'u4tile', 'q4C0', 'u4tile2', 'rv4C1', 'u4endC', 'am4C1', 'ph4C1', 'q4C1', 'u4visoff', 'ph4D0', 'rv4D1', 'u4endD', 'ml4D1',
                      'ph4D1', 'q4D1', 'u4closemus', 'ph4z0', 'u4release', 'u4steps', 'ml4z1', 'am4z1', 'u4bell', 'ph4z1']);
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
      /* (never in the gold, whose flick takes every green one in view whatever stands behind them; and never while the
         flick's reach would take a green one in front of her altar: 18 Nov, from the room's south side she sits between him
         and her altar, and every flick at what was on her was refused) */
      const F = play.fight;
      if (phase === 'bless' && play.water && getState() === 'play' && !(F && F.on && F.call === 'gold')) {
        _ray.setFromCamera({ x: 0, y: 0 }, camera);
        altarHit.updateWorldMatrix(true, false); _ab.setFromObject(altarHit);
        const pt = _ray.ray.intersectBox(_ab, _hit);
        if (pt) { const dA = _ray.ray.origin.distanceTo(pt); block = true;
          for (const P of [spirits.appa, spirits.large].concat(spirits.wander)) { const h = P.hit; if (!h || !h.visible) continue;
            const s = new THREE.Sphere(h.position, h.scale.x); if (_ray.ray.intersectsSphere(s) && _ray.ray.origin.distanceTo(h.position) - h.scale.x < dA) { block = false; break; } }
          if (block && F && F.on) for (const S of F.shapes) {
            if (S.state !== 'come' && S.state !== 'feed') continue;
            const m = S.P.hit; if (!m || !m.visible) continue;
            _fr.copy(m.position).sub(_ray.ray.origin); const along = _fr.dot(_ray.ray.direction);
            if (along < 0.15 || along > Math.min(FAN.far, dA)) continue;
            _fq.copy(_ray.ray.direction).multiplyScalar(along).add(_ray.ray.origin);
            if (_fq.distanceTo(m.position) <= Math.min(FAN.max, FAN.r0 + FAN.perM * along)) { block = false; break; } } }
      }
      if (block !== altarBlock) { altarBlock = block; kit.weaponBlock(block ? W.noAltar : null); }
    }

    /* ---------------------------------------------------------------- the story's frame, its start and its reset */
    function storyTick(wdt, t) {
      spotsTick(); hitsTick(); scareTick(); doorTick(wdt); heatTick(wdt); altarTick();   // (the fan, the lamp and the glass: updateNotes, film or play; his hand on her head: updateNotes, play and the decision)
      fightTick(wdt);
      if (play.loseWait && getState() === 'play' && kit && kit.lose && kit.lose({ film: 'lost', say: W.lostSay, teaching: W.lostTeach })) play.loseWait = false;
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
      play.fight = null; play.appaGone = false; play.nerveOut = false; play.heat = 0; play.heatStep = 0; play.closeHold = 0; play.breathSaid = -99; play.loseWait = false;
      play.fanK = 1; play.fanTo = 1; play.scareSeed = SCARE_SEED; play.scareAt = 0; play.scared = new Set(); play.doorTo = -0.12; play.doorK = -0.12;
      play.fogged = false; play.fogAt = 0; fogK = 0; fogTo = 0; lampK = 0; lampTo = 0; crownK = 0; crownTo = 0; oppLooked = ''; wanderNext = 2;
      decOpen = false; altarBlock = false; bowlOnFloor.visible = true; chantNow = null;
      for (const P of spirits.wander.concat([spirits.large, spirits.appa, spirits.oppress])) { P.gone = false; P.alpha = 1; }
      if (kit) { kit.bar(null); if (kit.weaponBlock) kit.weaponBlock(null); if (kit.visionUrge) kit.visionUrge(false);
        if (kit.health) kit.health(null); if (kit.edge) kit.edge(null); if (kit.sprayColor) kit.sprayColor(null); }
      lookAt0('FLAT'); castHome(); spiritsHome(); soundReset(); whenReady(cast.phoB, (P) => bowSet(P, 0));
    }
    function storySnap() { return { phase, learned: [...play.learned], looked: [...play.looked], water: play.water, fight: play.fight ? +play.fight.k.toFixed(3) : null, heat: +play.heat.toFixed(2),
      hp: play.fight ? play.fight.hp : null, call: play.fight ? play.fight.call : null }; }

