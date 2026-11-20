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
    const OLDPHOTO_AT = { x: ROOMS.dining.x0 + 0.481, y: 1.13, z: 5.89 };          // the picture's middle in its frame (c_props.js)
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
    /* (R101) his teacher's word to a peek in the history, "Not yet. First, we listen.": said at the NEXT PAUSE between
       lines, never behind the rest of what is queued (a source's lines run to twenty seconds and more; a word that late
       answers nothing), and a line already begun is never cut (one voice at a time, v5.30); the family's telling goes on
       after it. Never once he has begun telling his teacher what he heard: his teacher's answer (ph4h1) says it then */
    function peekLine() {
      if (heard.has('q4h3') || lineQ.some(q => q.name === 'q4h3')) return;
      say('ph4h2', cast.pho);
      lineQ.unshift(lineQ.pop(), { gap: 0.5 });
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
    const WARM_HISTORY = ['ph4h0', 'rv4h1', 'rv4h2', 'ml4h1', 'q4h1', 'ml4h2', 'ml4h3', 'q4h2', 'am4h1', 'q4h3', 'ph4h1', 'ph4h2',
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
    /* the old photograph, looked at (R50, Chad, 18 Nov: "When looking at the old photo, i want the old photo to pop up in
       the middle of the screen in its full high resolution so that the player can actually see what it is, with a button
       to close it once the player is done seeing it."): the engine's window (kit.picture, the fifty-eighth seam) holds the
       photograph whole, drawn from its own file. Mala's first line ("That's Amma...") is begun as it opens and plays on
       under it; the window stands the chapter's clock still, so her second follows once he has closed it and her first is
       done. The count, the receipt and the order come after her lines, as they always did. Refused (no window), her two
       lines are said as they always were. `ar`: its shape until its bytes land (the file's own 1024 by 772) */
    function lookOld() {
      if (!learn('o', [['ml4h2', cast.mala], ['ml4h3', cast.mala]])) return false;
      runQueue();
      /* (R50: the picture at its master's own size, 1168 x 880, where the frame on the cabinet draws the 1024 copy) */
      if (kit && kit.picture) kit.picture('w4t_oldphotofull', { ar: 1168 / 880 });
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
       his teacher closes his sight for him for a few seconds ("I am closing your Spirit Vision. Breathe."): every timed phase has a failure state
       that ends it, and nothing soft-locks (v7.4) */
    /* (19 Nov, Chad, R95/R96: "the game tells the player to close their spirit vision for no apparent reason", and once it is
       shut "the player does not know when to turn it back on": the strain is DRAWN, the ring on the eye (the fifty-ninth
       seam), and the eye asks again only once the ring is empty. Shut at the red mark, the ring empties in 2.4 s, as his
       teacher's "Now open it again" is said (ph4b6, 1.8 s in): at 1/9 a second it took 7.6 s, and the eye had asked him to
       open after 3 with the heart still half up: the two asks had no reason a player could see) */
    const HEAT = { up: 1 / 32, down: 1 / 2.8, drain: 1.4, floor: 15, low: 26 };
    const STRAIN_WARN = 0.85, STRAIN_EMPTY = 0.02;     // (the ring red from here, and the eye asking to close; the ring read empty)
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
      /* the ring on the eye: his heart's strain as it is (R96); gone once the fight is done */
      if (kit.visionStrain) kit.visionStrain(phase === 'kept' ? null : Math.min(1, play.heat), { warn: STRAIN_WARN });
    }
    /* "I am closing your Spirit Vision. Breathe." His sight shut for him and held shut for a few seconds; a price on the card (§4.3) */
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
          queueFn(() => { play.busy = false;
            /* (opened while he was still speaking: "Now open your Spirit Vision" is pressed the moment it is heard, and
               onVision lets a switch pass under his line; left there, the order said "Open" over an open sight and the
               spirits could not be looked at until he shut it and opened it again. Build 21, found in the lab) */
            if (visOpen() && !play.opened) { play.opened = true; saveMark(); }
            objectiveFor('sight', { complete: false }); if (kit && kit.visionUrge && !visOpen()) kit.visionUrge(true); }); }); }
      else objectiveFor('sight', { complete: false });
    }
    /* the engine tells the stage every time he opens or shuts his sight (stage.onVision) */
    function onVision(on) {
      /* (in the fight the eye button's ask is worked out again on the next frame, from his sight as it now is: urgeTick) */
      if (play.fight && play.fight.on) { play.fight.urge = null;
        /* (R96) the first time he shuts it himself in the fight: "Good. Breathe. Now open it again. They are still coming." */
        if (!on && !play.fight.shutSaid && play.fight.call !== 'shown') play.fight.shutWant = true; }
      else if (kit && kit.visionUrge) kit.visionUrge(false);
      if (on && (phase === 'history' || phase === 'sight')) oppressLooks();
      /* (Chad, 19 Nov, R100/R101, "Do #3 only": opening his sight during the history cost him the card's note with nobody
         saying why; the first time, his teacher stops him once. Nothing is shut for him: the note stays the price. Once a
         run: the save's `p` mark keeps it from coming again after a Continue) */
      if (phase === 'history' && on && !play.peeked) { play.peeked = true; saveMark(); peekLine(); }
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
                        'u4goldgather', 'u4goldhover', 'u4golddive', 'u4goldmerge',          /* (R110: the amulet's moment, every beat of it) */
                        'u4swglint', 'u4swbloom',                                            /* (R122: the swirl's own two) */
                        'ph4b3', 'ph4b4', 'ph4b5', 'ph4b6', 'ph4b7', 'q4f1', 'q4f2', 'ph4f1', 'q4f3', 'ph4f2', 'q4f4', 'ph4f3', 'rv4f1', 'ml4B2', 'rv4A2', 'u4visoff',
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
      bowlsOnStool(true);                                                  // (R53: on his stool, in the black)
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
    /* THE BOWLS ON HIS STOOL (Chad, 18 Nov evening, R53: "place the holy water bowl, and the water recharge bowl on top of the
       red chair, so it is easier to access for the player"): from the blessing on, when Grandmaster Pho has left his red
       stool for her chair, both bowls stand on it, its seat 0.445 m up, where they were on the floor at its foot: his large
       bowl on the seat's middle, and the small silver one resting in its water, its rim over the water (the seat is some
       0.29 m across, the large bowl 0.33 and the small 0.155: the two cannot stand side by side on it). Moved in the black
       (blessStage), put back on the floor for the history and the sight (storyReset); the order's mark, the press on the
       small bowl and the dip's reach follow them, and the large bowl's column on the floor goes up with it */
    const DIP_AT = { x: BOWL.x, z: BOWL.z }, SMALLBOWL_FLOOR = Object.assign({}, SMALLBOWL_AT);
    let waterLast = null;                                                // (R58: the water offered only in the blessing, once taken)
    const BOWLS_UP = { x: STOOL.x, z: STOOL.z, y: STOOL_TOP, small: { dx: 0.03, dz: -0.035, y: 0.097 } };
    let bowlsUp = false;
    function bowlsOnStool(up) {
      bowlsUp = !!up;
      const big = (things.w4bigbowl || [])[0], hs = STORY_SPOTS.find(h => h.id === 'water');
      if (up) { DIP_AT.x = BOWLS_UP.x; DIP_AT.z = BOWLS_UP.z;
        Object.assign(SMALLBOWL_AT, { x: BOWLS_UP.x + BOWLS_UP.small.dx, y: BOWLS_UP.y + BOWLS_UP.small.y + 0.04, z: BOWLS_UP.z + BOWLS_UP.small.dz });
        if (big) big.position.set(BOWLS_UP.x, BOWLS_UP.y, BOWLS_UP.z);
        bowlOnFloor.position.set(BOWLS_UP.x + BOWLS_UP.small.dx, BOWLS_UP.y + BOWLS_UP.small.y, BOWLS_UP.z + BOWLS_UP.small.dz);
        if (bigBowlBox) bigBowlBox.set(new THREE.Vector3(0, 60, 0), new THREE.Vector3(0, 61, 0)); }
      else { DIP_AT.x = BOWL.x; DIP_AT.z = BOWL.z; Object.assign(SMALLBOWL_AT, SMALLBOWL_FLOOR);
        if (big) big.position.set(BOWL.x, 0, BOWL.z);
        bowlOnFloor.position.set(SMALLBOWL_FLOOR.x, 0, SMALLBOWL_FLOOR.z);
        if (bigBowlBox && bigBowlBox0) bigBowlBox.copy(bigBowlBox0); }
      if (hs) { hs.pos.x = SMALLBOWL_AT.x; hs.pos.z = SMALLBOWL_AT.z; hs.pos.y = up ? SMALLBOWL_AT.y + 0.12 : 0.3; }
    }
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
      batch: { every: 1.8, min: 7, max: 9, r0: 1.7, r1: 2.8 },
      /* (R109: after the gold's wave has cleared the room, MORE of them, twelve, rise round her 0.85 s later: the struck burn
         out in half a second, so every body is free again by then) */
      back: { at: 0.85, n: 12 } };
    const REACH = { me: 0.75, amma: 0.62, pho: 0.6, ravi: 0.55, mala: 0.55 };
    /* AMMA'S LIFE IN HIS KEEPING (Chad, 18 Nov: "There must be consequences if the spirit entities in green gets to the lady in
       wheelchair. Everytime the green spirits get to her, she screams one time, and her health bar drops. Put a health bar on
       the lady in wheelchair. If her health bar drops to 0, the player loses this game and chapter and has to restart
       again"): a green one that reaches her takes 9 of her 100 (the large one 16), and again every 4.5 s it stays; she cries
       out each time (her three cries in turn, never two within 0.6 s); from the surge until 4 s into the gold she is never
       taken under 15 (the call is the story's, and comes whatever he did), and at 0 the chapter is lost (ammaLost) */
    const LIFE = { wander: 9, large: 16, again: 4.5, floor: 15, grace: 4 };
    const CRIES = ['u4ascream1', 'u4ascream2', 'u4ascream3'];
    /* THE DART (Chad, 18 Nov evening: "add some green spirits that should fly immediately at fast speed to her once in a
       while to cause instant damage, as any player that keeps spamming the water at the bowl area can indefinitely prevent
       any green spirits from even reaching her. Its way too easy, there must be some green spirits that can immediately fly
       to her in an invulnerable state and cause immediate damage out of the player's control"): every so often one of them,
       from a door or a corner away from her and from him, gathers itself (0.35 s, rising off the floor and burning bright,
       its shriek heard from where it is) and flies straight at her, fast (5.2 m a second: under a second from any door), the
       water passing through it; it strikes her at once (10 of her 100, her cry, her bar) and then clings and feeds like any
       other until the water sends it back. The first 15 s in, then every 14 to 20 s, up to 4 s sooner as the blessing nears
       the surge; through the surge and the call too (her floor of 15 holds there); never under the amulet nor in his gold.
       Its own seeded stream (v6.15: the fight's other draws stay as they were) */
    const DART = { first: 15, gap: [14, 20], sooner: 4, wind: 0.35, speed: 5.2, lift: 0.7, land: 0.3, dmg: 10, away: 2.4, clear: 1.6 };
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
                               saidMala: false, saidRavi: false, seed: 0x4c4f0d, dartAt: DART.first, darts: 0, dartHits: 0, dseed: 0x0da47e,
                               vseed: 0x5f1e0d, voxAt: 2.5, voxBigAt: 0, voxLast: '', voxUntil: [],
                               /* (R96) his teacher's word the first time he shuts it himself; the big moments he is called to */
                               shutWant: false, shutSaid: false, shutSaidAt: null, bigDone: new Set(), bigCall: null };
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
      if (w.list.some(r => r[3] === 'large')) { say('q4f2', null); phoQueued('ph4f1'); }   // "What is that...?" / "That big one is strong. Keep flicking the holy water at it until it goes."
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
    /* THE DART (R44, its constants by LIFE above) */
    function dartRnd() { const F = play.fight; F.dseed = (F.dseed * 1103515245 + 12345) >>> 0; return (F.dseed >>> 8) / 16777216; }
    function dartTick(wdt) {
      const F = play.fight; if (F.call === 'shown' || F.call === 'gold') return;
      if ((F.dartAt -= wdt) > 0) return;
      F.dartAt = DART.gap[0] + (DART.gap[1] - DART.gap[0]) * dartRnd() - DART.sooner * Math.min(1, F.k / FIGHT.surgeAt);
      dartLaunch();
    }
    /* from a door or a corner away from her and from him (none: none flies this time; and none when sixteen are in the room) */
    function dartLaunch() {
      const F = play.fight, me = yaw.position;
      const keys = Object.keys(FROM).filter(k => { const a = FROM[k]; return Math.hypot(a.x - CHAIR.x, a.z - CHAIR.z) > DART.away && Math.hypot(a.x - me.x, a.z - me.z) > DART.clear; });
      if (!keys.length) return null;
      const at = FROM[keys[Math.floor(dartRnd() * keys.length)]], jx = (dartRnd() - 0.5) * 0.4, jz = (dartRnd() - 0.5) * 0.4;
      const P = freeBody(); if (!P) return null;
      const x = at.x + jx, z = at.z + jz, tg = FAMILY.amma();
      put(P, x, z, faceTo(x, z, tg.x, tg.z));
      take(P, 'crawl', 0.15);
      const S = { P, to: 'amma', v: DART.speed, need: 1, hits: 0, state: 'wind', wind: 0, y0: P.group.position.y, t: 0, back: 0, fedAt: -99, dart: true, land: 0 };
      F.shapes.push(S); F.darts++;
      fx('u4sv5', 0.95, panOf(P.group.position));                       // (its shriek, from where it gathers itself)
      return S;
    }
    function dartStep(S, wdt, tg, dx, dz, d) {
      const P = S.P;
      P.group.rotation.y = faceTo(P.group.position.x, P.group.position.z, tg.x, tg.z);
      if (S.state === 'wind') {
        S.wind += wdt; const u = Math.min(1, S.wind / DART.wind);
        P.group.position.y = S.y0 + DART.lift * u * (2 - u);
        if (P.fx) P.fx.set('uFill', SPIRIT.wander.fill + (0.8 - SPIRIT.wander.fill) * u);
        if (u >= 1) S.state = 'dart';
        return;
      }
      if (d > REACH.amma) { const step = Math.min(d - REACH.amma, DART.speed * wdt); P.group.position.x += dx / d * step; P.group.position.z += dz / d * step; }
      if (Math.hypot(tg.x - P.group.position.x, tg.z - P.group.position.z) <= REACH.amma + 1e-3) dartStrike(S);
    }
    /* it reaches her: at once, and nothing he does could stop it */
    function dartStrike(S) {
      const F = play.fight, P = S.P;
      S.state = 'feed'; S.fedAt = S.t; S.land = DART.land; F.fed++; F.families++; F.dartHits++;
      if (P.fx) { P.fx.set('uFill', 1); const run = play.run; after(0.35, () => { if (live(run) && P.fx && S.state !== 'leave' && S.state !== 'gone') P.fx.set('uFill', SPIRIT.wander.fill); }); }
      voxPlay('u4sv5', P.group.position, 0.9);
      ammaHurt(S, DART.dmg);
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
        if (S.state === 'leave') { S.leave += wdt; const u = Math.min(1, S.leave / (S.quick || 1.1)); P.alpha = 1 - u; if (P.fx) { P.fx.set('uAlpha', 1 - u); P.fx.set('uFill', 0.1 + 0.9 * (1 - u) * (1 - u) + (HIT_FILL - 1) * hitBoost(P) * (1 - u)); } P.group.position.y += wdt * 0.35;
          if (u >= 1) { S.state = 'gone'; P.group.visible = false; P.gone = true; } continue; }
        const tg = FAMILY[S.to](), dx = tg.x - P.group.position.x, dz = tg.z - P.group.position.z, d = Math.hypot(dx, dz);
        /* THE DART (R44): gathered, then flown at her out of the water's reach; and, struck, it comes down to feed */
        if (S.state === 'wind' || S.state === 'dart') { dartStep(S, wdt, tg, dx, dz, d); if (!F.on) return; continue; }
        if (S.land > 0) { S.land = Math.max(0, S.land - wdt); const u = S.land / DART.land; P.group.position.y = flatGround(P.group.position.x, P.group.position.z) + DART.lift * u * u; }
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
    function ammaHurt(S, amt = null) {
      const F = play.fight; if (!F || !F.on || F.lost) return;
      const floor = (F.call && F.call !== 'gold') || (F.call === 'gold' && F.goldT < LIFE.grace) ? LIFE.floor : 0;
      F.hp = Math.max(Math.min(F.hp, floor), F.hp - (amt != null ? amt : S.P === spirits.large ? LIFE.large : LIFE.wander));
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
      F.lost = true; F.on = false; F.chantHeld = true; shadesOff();
      fightMusOff(); chantStop(); chantNow = null; lineQ.length = 0;
      if (kit) { kit.bar(null); kit.captions(null); if (kit.health) kit.health(null); if (kit.visionUrge) kit.visionUrge(false);
        if (kit.edge) kit.edge(null); if (kit.ammoInf) kit.ammoInf(false); if (kit.sprayColor) kit.sprayColor(null); }
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
      /* (a dart in its flight is out of the water's reach: R44) */
      if (P) { const S = F.shapes.find(q => q.P === P && q.state !== 'gone' && q.state !== 'leave' && q.state !== 'wind' && q.state !== 'dart'); if (S) reached.push(S); }
      if (r && r.ray) for (const S of F.shapes) {
        if (S.state === 'gone' || S.state === 'leave' || S.state === 'wind' || S.state === 'dart' || reached.includes(S)) continue;
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
    /* (R60, Chad, 18 Nov evening: "when the holy water hits the green spirit, can you add an effect to show that they got
       hit by it? For example, flashing the silohuette of the green spirits brighter for a short moment"): the whole
       silhouette burns near white for a moment and settles back to its green over a third of a second (it was its own
       green filled to 0.9 for a quarter second, and read as nothing on a phone), the one released as it begins to go,
       the large one each of the three times */
    /* (R81, Chad, 18 Nov: "the holy water spraying onto the green spirits effect that i wanted, is still not obvious enough,
       and is sometimes totally missing". Measured in the code: the flash was the spirit's own colour lifted for a third of
       a second, and the one RELEASED by the water, nearly every one, was already fading as it flashed, its fill written
       over every frame by its going; in the gold nothing flashed at all. Now the silhouette burns pure white and holds a
       tenth of a second before it settles over 0.4 s, the one released as brightly as it goes (hitBoost), and every
       strike bursts where it lands, through his sight: hitBurst below) */
    const _hitC = new THREE.Color(), HIT_HOLD = 0.1, HIT_FADE = 0.4, HIT_FILL = 3.0;
    /* (R81, build 30: photographed through his sight on a held clock, the white flash and the white burst were lost on the
       vision's light negative of the room, a white haze over a near-white floor, and the struck one went from green to
       nothing. The strike is the WATER's colour now, deep enough to read on that light room: the silhouette burns in it and
       the burst throws it; in his gold, gold) */
    /* (build 32: the gold is the chapter's own, WAVE_GOLD's; 0xffb424 read orange on the negative) */
    const HIT_HUE = { water: { body: 0x46cfff, flash: 0x9fe6ff, ring: 0x46cfff, spark: 0x7fdcff },
                      gold: { body: 0xffc94a, flash: 0xffe7a0, ring: 0xffc94a, spark: 0xffd76a } };
    const hitHue = () => (play.fight && play.fight.call === 'gold' ? HIT_HUE.gold : HIT_HUE.water);
    const hitBoost = (P) => { const d = P.hitT0 != null ? wallNow() - P.hitT0 : 99; return d < HIT_HOLD ? 1 : Math.max(0, 1 - (d - HIT_HOLD) / HIT_FADE); };
    function hitFlash(S, delay = 0) {
      const P = S.P; hitBurst(S, delay); if (!P.fx) return;
      const look = P === spirits.large ? SPIRIT.large : SPIRIT.wander, base = new THREE.Color(look.color), run = play.run, t0 = wallNow() + delay;
      const hc = new THREE.Color(hitHue().body);
      P.hitT0 = t0; if (delay <= 0) P.fx.set('uColor', hc);
      /* (one released goes out by its own fill, lifted by hitBoost; one staggered is filled bright here) */
      const fill = () => S.state !== 'leave' && S.state !== 'gone';
      if (fill() && delay <= 0) P.fx.set('uFill', HIT_FILL);
      const step = () => { if (!live(run) || !P.fx || P.hitT0 !== t0) return; const d = wallNow() - t0;
        if (d >= 0) { const u = Math.min(1, Math.max(0, d - HIT_HOLD) / HIT_FADE);
          P.fx.set('uColor', _hitC.copy(hc).lerp(base, u * u));
          if (fill()) P.fx.set('uFill', HIT_FILL + (look.fill - HIT_FILL) * u * u);
          if (u >= 1) return; }
        requestAnimationFrame(step); };
      requestAnimationFrame(step);
    }
    /* THE BURST where the water lands (R81): a flash in the water's colour swelling out (gold in his gold: hitHue), a ring thrown wide, six sparks flung off and
       falling, half a second on the wall clock; drawn through his sight only, where the green ones are; sized by the one
       struck (its sphere); eight at once, the oldest given back first */
    const HITFX = { slots: 16, sparks: 6, flash: 0.24, ring: 0.5, spark: 0.46 };   // (R109: sixteen at once, so every one the gold's wave strikes bursts whole)
    const hitFx = { slots: null, next: 0 };
    function hitTex(ring) {
      const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d'), r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
      if (ring) { r.addColorStop(0, 'rgba(255,255,255,0)'); r.addColorStop(0.6, 'rgba(255,255,255,0)'); r.addColorStop(0.8, 'rgba(255,255,255,1)'); r.addColorStop(0.9, 'rgba(255,255,255,0.4)'); r.addColorStop(1, 'rgba(255,255,255,0)'); }
      else { r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(0.28, 'rgba(255,255,255,0.9)'); r.addColorStop(0.6, 'rgba(255,255,255,0.28)'); r.addColorStop(1, 'rgba(255,255,255,0)'); }
      g.fillStyle = r; g.fillRect(0, 0, 128, 128); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
    }
    function hitSprite(tex, col) {
      const m = new THREE.SpriteMaterial({ map: tex, color: col, transparent: true, depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending, fog: false });
      mats.push(m); const sp = new THREE.Sprite(m); sp.visible = false; sp.renderOrder = 32;
      if (ctx.visionLayer != null) sp.layers.set(ctx.visionLayer); world.add(sp); return sp;
    }
    function hitBurst(S, delay = 0) {
      const m = S.P.hit; if (!m) return;
      if (!hitFx.slots) { const glow = dipTex(), ring = hitTex(true), core = hitTex(false); owned.push(glow, ring, core); hitFx.slots = [];
        for (let i = 0; i < HITFX.slots; i++) hitFx.slots.push({ flash: hitSprite(core, 0xffffff), ring: hitSprite(ring, 0xd8ffd2),
          sparks: Array.from({ length: HITFX.sparks }, () => hitSprite(glow, 0xeeffe8)), dirs: Array.from({ length: HITFX.sparks }, () => new THREE.Vector3()),
          at: new THREE.Vector3(), t0: -99, r: 0.4 }); }
      const B = hitFx.slots[hitFx.next]; hitFx.next = (hitFx.next + 1) % HITFX.slots;
      const hue = hitHue(); B.flash.material.color.set(hue.flash); B.ring.material.color.set(hue.ring); for (const sp of B.sparks) sp.material.color.set(hue.spark);
      B.t0 = wallNow() + delay; B.at.copy(m.position); B.r = Math.max(0.3, Math.min(0.9, m.scale.x || 0.4));
      const turn = hitFx.next * 1.7;
      B.dirs.forEach((v, i) => { const a = i * 2.39996 + turn, y = ((i * 0.618 + 0.25) % 1) - 0.3; v.set(Math.cos(a), y, Math.sin(a)).normalize(); });
    }
    function hitFxTick() {
      if (!hitFx.slots) return;
      const now = wallNow();
      for (const B of hitFx.slots) {
        const d = now - B.t0, uf = d / HITFX.flash, ur = d / HITFX.ring, us = d / HITFX.spark;
        if (d >= 0 && uf < 1) { B.flash.position.copy(B.at); B.flash.scale.setScalar(B.r * (0.9 + 1.3 * (1 - (1 - uf) * (1 - uf)))); B.flash.material.opacity = 1 - uf * uf; B.flash.visible = true; }
        else B.flash.visible = false;
        if (d >= 0 && ur < 1) { const e = 1 - (1 - ur) * (1 - ur); B.ring.position.copy(B.at); B.ring.scale.setScalar(B.r * (0.8 + 3.4 * e)); B.ring.material.opacity = 1 - ur; B.ring.visible = true; }
        else B.ring.visible = false;
        for (let i = 0; i < B.sparks.length; i++) { const sp = B.sparks[i];
          if (d >= 0 && us < 1) { const e = 1 - (1 - us) * (1 - us); sp.position.copy(B.at).addScaledVector(B.dirs[i], B.r * (0.3 + 2.6 * e)); sp.position.y -= 0.4 * us * us;
            sp.scale.setScalar(B.r * 0.34 * (1 - 0.6 * us)); sp.material.opacity = 1 - us; sp.visible = true; }
          else sp.visible = false; }
      }
    }
    function hitFxReset() { if (!hitFx.slots) return; for (const B of hitFx.slots) { B.t0 = -99; B.flash.visible = B.ring.visible = false; for (const sp of B.sparks) sp.visible = false; } }
    function strike(S) {
      const P = S.P; S.hits++;
      if (S.hits >= S.need) { S.state = 'leave'; S.leave = 0; hitFlash(S); return true; }
      S.back = 0.8; S.state = 'come'; hitFlash(S); voxPlay(P === spirits.large ? 'u4svL' : 'u4sv5', P.group.position, 0.8); return false;
    }
    function goldFlick() {
      const F = play.fight; let n = 0;
      camera.updateMatrixWorld(); _frm.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse); _frus.setFromProjectionMatrix(_frm);
      for (const S of F.shapes) {
        if (S.state === 'gone' || S.state === 'leave') continue;
        const m = S.P.hit; if (!m || !m.visible) continue;
        _fsph.center.copy(m.position); _fsph.radius = m.scale.x; if (!_frus.intersectsSphere(_fsph)) continue;
        S.state = 'leave'; S.leave = -0.25 * ((n * 0.6180339887) % 1); n++;       // (each on its own beat over a quarter second: v6.15)
        hitFlash(S, -S.leave);                                                      // (R81: each one seen struck, on its beat)
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
    /* HE BREAKS OFF HIS CHANT TO SPEAK (18 Nov: his "Close. Breathe." and his word after the water reached Appa were said over
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
      const F = play.fight; F.ended = true; F.on = false; fightMusOff(); chantStop(); chantNow = null; shadesOff();
      /* (each shape still in the room goes on its own beat: a golden-ratio spread over 0.4 s by its place in the list, the
         same on every run and every replay: v6.15, nothing random unseeded) */
      F.shapes.forEach((S, i) => { if (S.state !== 'gone' && S.state !== 'leave') { S.state = 'leave'; S.leave = -0.4 * ((i * 0.6180339887) % 1); } });
      if (kit) { kit.bar(null); kit.captions(null); if (kit.health) kit.health(null); if (kit.visionUrge) kit.visionUrge(false);
        if (kit.edge) kit.edge(null); if (kit.ammoInf) kit.ammoInf(false); if (kit.sprayColor) kit.sprayColor(null); }
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
      if (F.call === 'gold') { F.goldT += wdt; if ((F.batchAt -= wdt) <= 0) { F.batchAt = FIGHT.batch.every; goldBatch(F.backN || 0); F.backN = 0; } }
      dartTick(wdt);
      shutLineTick(open);
      bigTick(open);
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
       release its power, and a circular halo glow effect releases from the amulet outwards"): its own entrance, 5.2 s (the
       engine's showcase; at 4.2 the hover had one second, too short to read as a bob): born from gathered light, it turns
       and hovers (R113: 5.58 s since the gathering was slowed, the 0.38 s it waits longer added, so the hover
       keeps its length); 1.2 s before the end it RELEASES ITS POWER (the
       room shakes, halos go out, its sound), and the golden wave goes through the room from that moment; then it goes down
       into the holy water */
    const WAVE_GOLD = { color: 0xffc552, secs: 3.2, reach: 14, trail: 0.12 };
    /* (R122, Chad, 20 Nov: "Build the castlevania style, but save the current version first. I only want to see how the
       castlevania option will look like"): HOW ITS LIGHT GATHERS. 'swirl', the Castlevania way, remade from every frame of
       his video (R123 to R125): soft blue orbs all over the screen, each on its own way in with a train of copies behind it,
       resting in a cloud, winding into a whirlpool that closes into a pinwheel, a white ball and a white flash, the amulet
       born in the flash (the engine's scSwirl), with its own two sounds: a glitter of small bells through the whirlpool,
       and a run rising into one held chord that lands on the flash (u4swbloom lands 1.0 s in: bloomLead). It is born 1.89 s
       later than build 50's, so the showcase is 1.89 s longer and the hover keeps its length. 'lines' is build 50's
       gathering, kept whole (deploy 6aff6c8fd102a95fa284455d): one word puts it back */
    const SHOW_GATHER = 'swirl';
    function showAmulet() {
      const F = play.fight; if (!F || !F.on) return;
      F.call = 'shown'; F.urge = null; F.released = false; if (kit && kit.visionUrge) kit.visionUrge(false);
      const go = () => { if (play.fight === F && F.on) goldBegin(); };
      const release = () => { if (play.fight !== F) return; F.released = true; if (kit && kit.wave) kit.wave(WAVE_GOLD); };
      const how = SHOW_GATHER === 'swirl' ? { gather: 'swirl', auto: 7.47, gatherSound: 'u4swglint', bloomSound: 'u4swbloom', bloomLead: 1.0 }
                                          : { auto: 5.58, gatherSound: 'u4goldgather' };
      if (!(kit && kit.unlock && kit.unlock('amulet', Object.assign({ showcase: true, sound: 'u4goldcall', releaseSound: 'u4goldpower', onRelease: release, onClose: go,
                                                   hoverSound: 'u4goldhover', intoSound: 'u4golddive', mergeSound: 'u4goldmerge' }, how)))) go();
    }
    /* EMPOWERED (R26 to R29: "the entire screen seem to have a golden vignette to show the new empowered status, and now the
       water being flicked becomes golden glow instead"): the gold at the edges of his sight (the fifty-sixth seam), the water
       gold; the amulet's light strikes every one in the room at once (nova, below: R109); his heart steadied; his teacher's
       word, and his chant again; and the swarm, back at once */
    function goldBegin() {
      const F = play.fight; F.call = 'gold'; F.goldT = 0; F.batchAt = FIGHT.back.at; F.backN = FIGHT.back.n; F.urge = null;
      /* (its light went out through the room from him at the showcase's release, every thing and every outline it crossed
         burning gold, as his sight's own wave does: the fifty-seventh seam. Chad: "empowers with a golden glow that spreads
         throughout the scene, tracing every item and silhouette similar to how the spirit vision works". Build 21: 14 m in
         3.2 s with a slow trail, so the room stays traced in gold while it fades: at 26 m in 2.6 s it crossed the room in a
         fifth of a second and was gone. Here, as it merges into the water, its second wave: the nova's, R109) */
      if (kit) { if (kit.edge) kit.edge({ color: [255, 196, 84], k: 0.85, secs: 1.2 }); if (kit.sprayColor) kit.sprayColor(0xffc24a, { size: 1.6 }); if (kit.ammo) kit.ammo(DATA.weapon.rounds);
        if (kit.ammoInf) kit.ammoInf(true); }                                   // (R56: the count reads the infinity sign)
      if (!F.released) fx('u4goldpower', 1, 0);
      /* (the amulet's light reaches her too: her life at least half back. 18 Nov, photographed: held at 15 through the surge,
         she came into the gold two touches from the loss, and the power he was given was spent guarding a last breath) */
      F.hp = Math.max(F.hp, 50); if (kit && kit.health) kit.health({ k: F.hp / 100 });
      nova();
      play.heat = Math.min(play.heat, 0.5);
      if (kit && kit.pulse) kit.pulse({ bpm: 124, secs: 2.2 });
      objectiveFor('bless');
      queueLine('ph4f3', () => talk(cast.phoB, SECS.ph4f3 || 3));            // "Luang Phor Phiboon is with you. Flick the golden water at the green spirits!"
      queueFn(() => { F.chantHeld = false; if (play.fight === F && F.on && chantNow) chantSing(chantNow); });
    }
    /* THE NOVA (R109, Chad, 19 Nov: "Also it should let out a wave of powerful AOE energy that immediately clears all green
       spirits in one shot. But of course, even after that one shot clear, many more green spirits appear again almost
       instantly after, and player has to spray the golden water at them to keep playing and clearing the green spirits.
       The moment of instant clearing is just to show the power of lp phiboon and not to end the play moment there"): as it
       merges into the water a second wave of its gold goes out from him through the room, quicker and brighter than the
       release's (the whole room in a third of a second, half as bright again: kit.wave's `k`), and every green one, seen or
       not, is struck the moment its front reaches it (kitWave's own curve: the front at reach (1 - (1 - u)^2.2)), bursting
       in gold and burning out in half a second; the sound of a room of them going at once. Twelve more rise round her 0.85 s
       later (FIGHT.back) and the swarm goes on: the golden water is his for the rest of the blessing */
    const WAVE_NOVA = { color: 0xffd36a, secs: 1.4, reach: 14, trail: 0.12, k: 1.5 };
    function nova() {
      const F = play.fight; if (!F) return 0;
      if (kit && kit.wave) kit.wave(WAVE_NOVA);
      let n = 0;
      for (const S of F.shapes) {
        if (S.state === 'gone' || S.state === 'leave') continue;
        const m = S.P.hit, at = m && m.visible ? m.position : S.P.group.position;
        const f = Math.min(0.999, Math.hypot(at.x - yaw.position.x, at.z - yaw.position.z) / WAVE_NOVA.reach);
        const delay = WAVE_NOVA.secs * (1 - Math.pow(1 - f, 1 / 2.2));
        S.state = 'leave'; S.leave = -delay; S.quick = 0.5; hitFlash(S, delay); n++;
      }
      fx('u4goldclear', 0.95, 0);
      if (n) F.lastStrike = F.t;
      return n;
    }
    /* a batch of five to seven from the room's edges, most of them for her (R28: "the green entities should swarm in the
       screen in dramatic numbers, filling the screen with many of them"); `many` asks for that many (the return: R109) */
    function goldBatch(many) {
      const B = FIGHT.batch, n = many > 0 ? many : B.min + Math.floor(fightRnd() * (B.max - B.min + 1)), a0 = fightRnd() * Math.PI * 2;
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
    /* (R96) THE GREEN ONES, FAINT AND DARK, while his sight is shut in the fight (c_scast.js shadeOf): eased in over a third of
       a second once his sight is home, each as faint as it is there (a released one fades with its glow), hidden the moment
       his sight opens and whenever the fight is not on (a film never runs this: the fight's end and the loss hide them first) */
    let shadeK = 0;
    const GREENS = () => spirits.wander.concat([spirits.large]);
    function shadesOff() {
      shadeK = 0;
      for (const P of GREENS()) if (P && P.shade && P.shade.on) { P.shade.on = false; P.shade.u.uShA.value = 0; for (const t of P.shade.twins) t.visible = false; }
    }
    function shadeTick(wdt) {
      const F = play.fight, v = kit && kit.vision ? kit.vision() : null;
      if (!F || !F.on || !v || v.on || v.r > 0.01 || F.call === 'shown' || getState() !== 'play') { if (shadeK > 0 || F) shadesOff(); return; }
      shadeK = Math.min(1, shadeK + wdt * 3);
      for (const P of GREENS()) {
        if (!P || !P.shade) continue;
        const a = SHADE.a * shadeK * (P.alpha != null ? P.alpha : 1), on = a > 0.004 && !P.gone;
        P.shade.u.uShA.value = a;
        if (on !== P.shade.on) { P.shade.on = on; for (const t of P.shade.twins) t.visible = on; }
      }
    }
    /* (R96) THE FIRST TIME HE SHUTS IT HIMSELF in the fight, his teacher says when to open it again: said as soon as a voice
       is free, while it is still shut (opened before it could be said, it waits for the next time he shuts it) */
    function shutLineTick(open) {
      const F = play.fight; if (!F.shutWant) return;
      if (open || play.closeHold || F.call === 'shown') { F.shutWant = false; return; }
      if (phoSpeaks('ph4b6', () => talk(cast.phoB, SECS.ph4b6 || 4.4))) { F.shutWant = false; F.shutSaid = true; F.shutSaidAt = F.t; }
    }
    /* (R96: "You can't miss the climax") THE BIG MOMENTS: the rush (the surge, until his call), the big one (while it is in the
       room) and the golden water. Shut through one of them, once the ring on the eye is empty (and not straight after his
       teacher's ph4b6), his teacher calls "Open it, now!"; still shut three seconds after the call, his sight is opened for
       him. Each moment once: seen, by him or for him, it is not called again. Never under the showcase, nor while his
       teacher holds his sight shut */
    const BIG_GRACE = 3;
    function bigNow() {
      const F = play.fight;
      if (F.call === 'gold') return 'gold';
      /* (the rush runs on into his call for help: measured on build 39, the rush handed to the call 7 s after it began, before
         the 3 s after "Open it, now!" were out, and his sight was never opened for him) */
      if (F.call === 'surge' || F.call === 'asking') return 'surge';
      if (!F.call && F.shapes.some(S => S.P === spirits.large && (S.state === 'come' || S.state === 'feed'))) return 'large';
      return null;
    }
    function bigTick(open) {
      const F = play.fight, m = bigNow();
      if (!m || F.bigDone.has(m)) { F.bigCall = null; return; }
      if (open) { F.bigDone.add(m); F.bigCall = null; return; }
      if (play.closeHold || F.shutWant) return;
      if (!F.bigCall || F.bigCall.m !== m) {
        if (play.heat > STRAIN_EMPTY || (F.shutSaidAt !== null && F.t - F.shutSaidAt < 5)) return;
        if (phoSpeaks('ph4b7', () => talk(cast.phoB, SECS.ph4b7 || 1.5))) F.bigCall = { m, at: F.t + (SECS.ph4b7 || 1.5) + BIG_GRACE };
        return;
      }
      if (F.t >= F.bigCall.at && kit && kit.vision) { kit.vision(true); F.bigDone.add(m); F.bigCall = null; F.urge = null; F.shutFor = 0; }
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
       the surge and the gold, once the ring on the eye is empty otherwise: R96); CLOSE when it is open and his heart is near
       its limit (the ring red, STRAIN_WARN: past 1 his nerve drains); nothing under the showcase or while his sight is held
       shut for him */
    function urgeTick(open, live) {
      const F = play.fight; let u = false;
      if (F.call === 'shown' || play.closeHold) u = false;
      else if (open) u = play.heat >= STRAIN_WARN && F.call !== 'gold' ? 'close' : false;
      else if (live && (play.heat <= STRAIN_EMPTY || F.t < 8 || F.call)) u = 'open';      // (R96: once the ring is empty; at once at the start and at the big moments)
      if (u !== F.urge) { F.urge = u; if (kit && kit.visionUrge) kit.visionUrge(u); }
    }
    /* THE TURNING POINT: the trance's film, and the decision at its end (the plan's §4.4) */
    function trance() {
      if (!kit || !kit.film) { openDecision(); return; }
      const run = play.run;
      if (!kit.film('trance', { onDone: () => { if (live(run)) { atTurn(); openDecision(); } } })) openDecision();
    }
    /* THE PICTURE WHILE HE CHOOSES (build 21, found on a phone at its real size, 390 x 844: a film from play gives the
       player's look back as it was before it, so the decision opened over wherever he had last looked in the fight, and
       the window covers the lower 57 % of such a screen: the turning point it asks about was out of sight or behind it.
       Episode 4 chapter 2's law, v25.5: HE IS SEEN WHILE THE CHOICE IS MADE.) The decision finds him where the trance's
       last frame stood him, looking where it looked, through the play lens it ended on; while the window is open his look
       is eased (0.8 s, the wall clock) so her face stands in the clear band of THIS screen, from under the stats (where
       they lie over the screen's middle) to the window's top edge, low in the band so the thing on her back and his
       teacher's hand on her head have room over her; where the band is too short, her chin is put just over the window's
       edge. Every ending begins on this look (DEC_EYE, DEC_AT), so the window going is no jump. A Step back gives him
       the look as it stands: nothing is put back, so nothing snaps */
    const DEC = { on: false, t0: 0, p0: 0, y0: 0, p1: null, y1: 0, w: 0, h: 0, at: null, eye: null };
    const _dcE = new THREE.Vector3();
    function atTurn() { camAt(S_EYE, END_AIM()); fLens(PLAY_FOV); DEC.on = false; DEC.at = null; DEC.eye = null; }
    function decideSolve() {
      const P = document.querySelector('#decide .panel'); if (!P || !P.offsetHeight) return null;
      const H = window.innerHeight, W = window.innerWidth, S = document.getElementById('stats'), sr = S ? S.getBoundingClientRect() : null;
      const top = sr && sr.width > 0 && sr.left < W / 2 + 50 && sr.right > W / 2 - 50 ? sr.bottom + 8 : H * 0.07;
      const bot = P.offsetTop; if (bot - top < 48) return null;
      camera.getWorldPosition(_dcE);
      const fc = headOf(cast.amma, AMMA_FACE), tf = Math.tan(camera.fov * Math.PI / 360), hd = Math.hypot(fc[0] - _dcE.x, fc[2] - _dcE.z);
      const elev = (y) => Math.atan2(y - _dcE.y, hd);
      const solve = (y, sy) => elev(y) - Math.atan((H / 2 - sy) / (H / 2) * tf);
      let th = solve(fc[1], top + (bot - top) * 0.7);
      /* (the head's middle: her chin is 12 cm under it) */
      if (H / 2 - (H / 2) * Math.tan(elev(fc[1] - 0.12) - th) / tf > bot - 8) th = solve(fc[1] - 0.12, bot - 8);
      return { p: Math.max(-1.3, Math.min(0.6, th)), y: Math.atan2(-(fc[0] - _dcE.x), -(fc[2] - _dcE.z)) };
    }
    function decideLook(now, st) {
      if (st !== 'decide' || phase !== 'kept') { DEC.on = false; return; }
      if (!DEC.on || DEC.w !== window.innerWidth || DEC.h !== window.innerHeight) {
        DEC.on = true; DEC.t0 = now; DEC.p0 = pitch.rotation.x; DEC.y0 = yaw.rotation.y; DEC.p1 = null;
        DEC.w = window.innerWidth; DEC.h = window.innerHeight; }
      if (DEC.p1 == null) {
        const s = decideSolve(); if (!s) { DEC.t0 = now; return; }
        DEC.p1 = s.p; DEC.y1 = DEC.y0 + angTo(DEC.y0, s.y);
        camera.getWorldPosition(_dcE); const d = 1.2, cp = Math.cos(DEC.p1);
        DEC.eye = [_dcE.x, _dcE.y, _dcE.z];
        DEC.at = [_dcE.x - Math.sin(DEC.y1) * cp * d, _dcE.y + Math.sin(DEC.p1) * d, _dcE.z - Math.cos(DEC.y1) * cp * d];
      }
      const k = smo(c01((now - DEC.t0) / 0.8));
      pitch.rotation.x = lp(DEC.p0, DEC.p1, k);
      yaw.rotation.y = lp(DEC.y0, DEC.y1, k);
    }
    /* where every ending's first frame stands and looks: the decision's own look when it was solved from the place the
       trance left him (a Step back and a walk elsewhere starts the ending from the trance's own last frame instead) */
    const DEC_EYE = () => S_EYE;
    const DEC_AT = () => (DEC.at && DEC.eye && Math.hypot(DEC.eye[0] - S_EYE[0], DEC.eye[2] - S_EYE[2]) < 0.1 ? DEC.at : END_AIM());
    /* every sound the four endings and their close play, warmed as the decision opens (the scenes cue the close's from a
       helper, which the engine's own reading of a scene cannot see) */
    function openDecision() {
      decOpen = true;
      if (warmSounds) warmSounds(['u4scuffle', 'rv4A1', 'u4cry', 'ml4A1', 'u4torn', 'u4endA', 'u4stand', 'am4A1', 'rv4A2', 'ph4A1', 'q4A1',
                      'u4flick', 'u4hiss', 'u4nooo', 'u4patter', 'ml4B1', 'u4chill', 'u4heart', 'u4fall', 'ph4B0', 'ml4B2', 'u4endB', 'ml4B3', 'ph4B1', 'q4B1',
                      'u4tile', 'q4C0', 'u4tile2', 'rv4C1', 'u4endC', 'am4C1', 'ph4C1', 'q4C1', 'u4visoff', 'u4vison', 'u4goldpower', 'u4goldclear', 'ph4D0', 'rv4D1', 'u4endD', 'q4R1', 'rv4R1', 'ml4R1',
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
        enabled: () => phase === 'history' && !play.busy && !play.learned.has('o'), onInteract() { return lookOld(); } },
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
    function reloadRefusal() { return Math.hypot(yaw.position.x - DIP_AT.x, yaw.position.z - DIP_AT.z) < 1.5 ? null : W.dipHere; }
    /* THE REFILL SEEN (R63, Chad, 18 Nov evening: "when player reloads the holy water bowl, show a visual effect going or
       flying from the water bowl towards the player to show that it successfully reloaded. This is for visual feedback
       purpose."): at each dip that took (stage.onReload), eighteen motes of the water's light rise out of his teacher's
       bowl and fly, each on its own arc, to just under the middle of his sight, shrinking and fading as they reach him
       (half a second; gold in his gold, the water's pale blue otherwise). On the wall clock, so a slow phone sees all of it;
       drawn in the world and through the vision alike */
    const DIPFX = { n: 18, secs: [0.42, 0.62], stagger: 0.012, arc: 0.28, size: [0.055, 0.018] };
    const dipFx = { sprites: null, motes: [], t0: 0 };
    function dipTex() {
      const c = document.createElement('canvas'); c.width = c.height = 64; const g = c.getContext('2d');
      const r = g.createRadialGradient(32, 32, 0, 32, 32, 32); r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(0.35, 'rgba(255,255,255,0.55)'); r.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = r; g.fillRect(0, 0, 64, 64); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
    }
    function dipBurst() {
      if (!dipFx.sprites) { const tex = dipTex(); owned.push(tex); dipFx.sprites = [];
        for (let i = 0; i < DIPFX.n; i++) { const m = new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, depthTest: false, blending: THREE.AdditiveBlending, fog: false });
          mats.push(m); const sp = new THREE.Sprite(m); sp.visible = false; sp.renderOrder = 30; if (ctx.visionLayer != null) sp.layers.enable(ctx.visionLayer); world.add(sp); dipFx.sprites.push(sp); } }
      const F = play.fight, gold = !!(F && F.on && F.call === 'gold'), col = gold ? 0xffd27a : 0xbfe8ff, now = wallNow();
      const y0 = (bowlsUp ? BOWLS_UP.y : 0) + 0.15;
      dipFx.motes = dipFx.sprites.map((sp, i) => { const a = i * 2.39996, r = 0.03 + 0.09 * ((i * 0.618) % 1);
        sp.material.color.set(col);
        return { sp, t0: now + i * DIPFX.stagger, T: DIPFX.secs[0] + (DIPFX.secs[1] - DIPFX.secs[0]) * ((i * 0.37) % 1),
          a: new THREE.Vector3(DIP_AT.x + Math.cos(a) * r, y0, DIP_AT.z + Math.sin(a) * r), jx: (((i * 0.71) % 1) - 0.5) * 0.12, jy: (((i * 0.43) % 1) - 0.5) * 0.06 }; });
    }
    const _dpE = new THREE.Vector3(), _dpF = new THREE.Vector3(), _dpU = new THREE.Vector3(), _dpR = new THREE.Vector3(), _dpP = new THREE.Vector3();
    function dipFxTick() {
      if (!dipFx.motes.length) return;
      const now = wallNow(); let live = 0;
      camera.updateMatrixWorld(); camera.getWorldPosition(_dpE); camera.getWorldDirection(_dpF);
      _dpR.crossVectors(_dpF, THREE.Object3D.DEFAULT_UP).normalize(); _dpU.crossVectors(_dpR, _dpF).normalize();
      for (const M of dipFx.motes) { const u = (now - M.t0) / M.T;
        if (u < 0 || u >= 1) { M.sp.visible = false; if (u < 0) live++; continue; } live++;
        const e = u * u * (3 - 2 * u);
        _dpP.copy(_dpE).addScaledVector(_dpF, 0.42).addScaledVector(_dpU, -0.13 + M.jy).addScaledVector(_dpR, M.jx);   // (just under the middle of his sight)
        M.sp.position.copy(M.a).lerp(_dpP, e); M.sp.position.y += DIPFX.arc * 4 * e * (1 - e);
        const s = DIPFX.size[0] + (DIPFX.size[1] - DIPFX.size[0]) * e; M.sp.scale.setScalar(s);
        M.sp.material.opacity = Math.min(1, u * 6) * (1 - Math.max(0, (u - 0.7) / 0.3)); M.sp.visible = true; }
      if (!live) dipFx.motes = [];
    }
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
      shadeTick(wdt);                                                     // (R96: the green ones as faint dark shapes while his sight is shut)
      dipFxTick();                                                        // (R63: the refill seen)
      hitFxTick();                                                        // (R81: every strike seen)
      /* (R58, Chad, 18 Nov evening: "why reloading and continuing game allows me to flick water even before that part of
         the gameplay begins"): the bag keeps the water from a run that reached the blessing (a Continue, a loss's start
         again), and the engine has the water out whenever the bowl is in his hand. So it is offered only in the blessing,
         once he has taken it: derived on the frame (v11.1), written only when it changes, asked again after a reset */
      const waterUp = phase === 'bless' && !!play.water;
      if (kit && kit.weaponOut && waterLast !== waterUp) { waterLast = waterUp; kit.weaponOut(waterUp ? null : false); }
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
      shadesOff();
      play.fanK = 1; play.fanTo = 1; play.scareSeed = SCARE_SEED; play.scareAt = 0; play.scared = new Set(); play.doorTo = -0.12; play.doorK = -0.12;
      play.fogged = false; play.fogAt = 0; fogK = 0; fogTo = 0; lampK = 0; lampTo = 0; crownK = 0; crownTo = 0; oppLooked = ''; wanderNext = 2;
      decOpen = false; altarBlock = false; bowlOnFloor.visible = true; chantNow = null; bowlsOnStool(false); waterLast = null; hitFxReset();
      DEC.on = false; DEC.p1 = null; DEC.at = null; DEC.eye = null;
      for (const P of spirits.wander.concat([spirits.large, spirits.appa, spirits.oppress])) { P.gone = false; P.alpha = 1; }
      if (kit) { kit.bar(null); if (kit.weaponBlock) kit.weaponBlock(null); if (kit.visionUrge) kit.visionUrge(false);
        if (kit.health) kit.health(null); if (kit.edge) kit.edge(null); if (kit.ammoInf) kit.ammoInf(false); if (kit.sprayColor) kit.sprayColor(null); }
      lookAt0('FLAT'); castHome(); spiritsHome(); soundReset(); whenReady(cast.phoB, (P) => bowSet(P, 0));
    }
    function storySnap() { return { phase, learned: [...play.learned], looked: [...play.looked], water: play.water, fight: play.fight ? +play.fight.k.toFixed(3) : null, heat: +play.heat.toFixed(2),
      hp: play.fight ? play.fight.hp : null, call: play.fight ? play.fight.call : null }; }

