
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
            Zavier LENDS his teacher his cage for those seconds, and stands with nothing round him.
         5. Losing begins the FIGHT again (Chad's R14: "Fight restarts"); nothing is ever played for him.

       HOW THE CHAPTER USES IT (c_story.js, when the fight is built: the tracker's M8):
         const fight = FIGHT.create({ sanity: <his sanity>, guard: <the worn piece's evGuard> });
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
        courtX: 1.95, courtZ0: -3.0, courtZ1: 3.0,
        praiIn: 0.2,                          // a Prai keeps this far inside the court's walls
        threadZ: -2.7,                        // and never comes nearer the doorway, or the three behind the thread, than this
        bodyX: 1.6, bodyZ0: -2.3, bodyZ1: 2.6, // where the two of them may stand
        zavAt: [0, 0.7], phoAt: [1.15, 2.0],
        lessonAt: [0, -1.5],                  // where the lesson's Prai stands and strains toward him
        laidAt: [[-1.15, -0.8], [0, -1.35], [1.15, -0.8]],   // where the Naga lays the last three (stage 6)
        entryAt: [[-1.55, -2.45], [1.55, -2.45], [0, -2.5], [-1.75, -1.25], [1.75, -1.25], [-1.1, -2.5], [1.1, -2.5], [0.6, -2.5]],
        entryJitter: 0.25,
        // THE TWO OF THEM
        phoWalk: 1.2, zavWalk: 0.6,           // his own Walking's travel (v26.0); his student is a man led
        apart: 1.45,                          // Grandmaster Pho never stands inside his student's cage (its bars 1.0, and himself)
        switchLock: 0.6,                      // nothing pressed inside it is spent by the one who arrives
        aiFar: 3.0, aiHome: [1.15, 1.3],      // the unplayed Grandmaster Pho walks back beside his student once this far
        // THE CAGE (his Lersi's, round him from the first moment to the last, never pressed for: the case file)
        cageR: 1.0, pressR: 1.3, himR: 0.55, waitR: 2.5, pressMax: 3,
        cageMax: 100, wear: 5, mend: 6, whole: 30,
        // HIS SANITY (the game's own stat)
        drain: 2.5, gather: 1.5, lostAt: 12, floor: 40, surgeTo: 13, surgeSecs: 3,
        // THE PRAI
        paceCome: 0.6, paceSlip: 0.8, paceHide: 0.55, paceHidden: 0.5, rush: 2.2,
        enterSecs: 1.0, hideAfter: 1.5, weave: 0.9, weaveSecs: 1.8,
        fleeSecs: 1.0, fleePace: 2.5, lurkSecs: 3,   // a Prai chased away flees, sinks, and lies still a while before it comes on
        // FIRE (Grandmaster Pho's main act)
        fireWait: 1.1, flight: 0.7, fireReach: 5.5, push: 0.7, stopSecs: 0.8, aiFireWait: 3.3,
        ringSecs: 10,                         // a tired Prai's ring closes over this; then it rises again, and hides
        // BAG
        bagReach: 2.5, bagSecs: 1.0,
        // THE GOLDEN SHOCKWAVE (his own R3: "travels as a circle outwards but with long cooldown")
        waveWait: 40, waveBroken: 15, windSecs: 1.5, ringSpeed: 6, ringMax: 7, breakDist: 0.8, throwZ: -2.45, throwStop: 2.0,
        // BIND (Master Zavier's main act: Chad's "lock a prai in a bubble to stop it from escaping")
        bindWait: 3.5, bindReach: 5.5, bubbleSecs: 10, bubbleMax: 3,
        bubbleLongest: 19,                    // a bubble's own time and the longest lend (while his cage is lent the bubbles hold: the gold is coming)
        lendLongest: 9,                       // a lend, and the gold gathered and loosed under it
        // SMELL (only he finds a Prai that has gone unseen)
        smellWait: 2.5, showSecs: 4.0, staleSecs: 3.0,
        drawSecs: 3.0, drawPace: 2.0, drawWear: 2.0,   // a breath taken for nothing (nothing hidden) draws every free Prai on, faster and harder
        // LEND (his cage over his teacher while the gold is gathered)
        lendSecs: 6.0, lendAfter: 0.3,           // (pressed with the cage lent, the gold keeps the cage round him until it has gone out)
        // STAGE 3, THE FIGHT: the eight left after the lesson, in this order, each at its time while fewer than freeAt
        // allows are free on the court (one at a time once he asks his teacher to lead: after three losses)
        kinds3: ['come', 'slip', 'hide', 'come', 'slip', 'hide', 'slip', 'hide'],
        due3: [0, 12, 26, 42, 58, 74, 90, 106], entryGap: 1.5, leadMax: 1, breather: 8,
        freeAt: [[0, 1], [24, 2], [58, 3], [90, 4]],   // how many may be free on the court at once, rising as the fight goes on
        holdAt: [6, 4], holdSecs: 25, holdRetry: 12, holdPace: 1.0, goldGrace: 8,   // holdPace: how fast they move while the
                                              // gold is gathered; goldGrace: in a hold, how long a bubble waits for the gold   // HOLD THE LINE, twice: at six left and at four the bag no longer takes
                                              // them, the gold gathers itself anew (holdSecs), and only it can take them; after a wave
                                              // that took none, holdRetry. The first hold ends when the gold has gathered; the last, at three
        // STAGES 4 TO 6
        togetherAfter: 1.5, togetherSecs: 1.2, filmGuard: 40,
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
        hidden:   { pho: ['ph5f3', 'ph5ny2', 'ph5ns3'], zav: ['ph5f7', 'ph5nf2', 'ph5nf3'] },
        shown:    { pho: ['ph5nt1', 'ph5nt2', 'ph5ns3'], zav: ['ph5f8', 'ph5ns2', 'ph5f4'] },
        bound:    { pho: ['ph5f6', 'ph5nq1', 'ph5f1'], zav: ['ph5f5', 'ph5nc2', 'ph5nc3'] },
        tired:    { pho: ['ph5nd1', 'ph5nd2', 'ph5nd3'], zav: ['ph5ni1', 'ph5ni2', 'ph5ni2'] },
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
        beneath:  { pho: ['ph5nm1', 'ph5ny2', 'ph5ns3'], zav: ['ph5nn1', 'ph5nn2', 'ph5nf3'] },
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
        ph5l2: 3, q5c0: 3, ph5f0: 3, ph5f2: 3, ph5fa: 3, ph5fc: 3, ph5f10: 3, ph5fe: 3, ph5fg: 3, ph5fh: 3, ph5fi: 3, ph5ne1: 3, ph5c1: 3, ph5c3: 3, ph5c4: 3,
        ph5g1: 2, ph5g2: 2, ph5g3: 2, ph5g4: 2,
        q5c1: 0, q5c2: 3, q5c3: 0, q5c4: 0, q5c5: 0,
        tn5c0: 0, ko5c1: 0, tn5c1: 0, ju5c1: 0, tn5c2: 0, ju5c2: 3, tn5c3: 0
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
      const SLOT = { pho: { main: 'FIRE', second: 'SHOCKWAVE', third: 'BAG' }, zav: { main: 'BIND', second: 'SMELL', third: 'LEND' } };
      const PHO_ACTS = { FIRE: 1, SHOCKWAVE: 1, BAG: 1 }, ZAV_ACTS = { BIND: 1, SMELL: 1, LEND: 1 };

      /* ------------------------------------------------------------------ small things */
      const dist = (ax, az, bx, bz) => { const dx = ax - bx, dz = az - bz; return Math.sqrt(dx * dx + dz * dz); };
      const isP = (st) => st.who === 'pho';
      const atHim = (p) => p.st === 'through' || p.st === 'beneath' || (p.st === 'shown' && p.at === 2);
      const free = (p) => p.st === 'entering' || p.st === 'coming' || p.st === 'pressing' || p.st === 'through' || p.st === 'fleeing' ||
                          p.st === 'hidden' || p.st === 'beneath' || p.st === 'shown' || p.st === 'rushing';
      const onCourt = (p) => p.st !== 'waiting' && p.st !== 'gathered';
      const seenFree = (p) => p.st === 'coming' || p.st === 'pressing' || p.st === 'through' || p.st === 'shown';
      const bubbles = (st) => { let k = 0; for (const p of st.prai) if (p.st === 'bound' || p.st === 'held') k++; return k; };
      function clampPrai(n, p) {
        const xm = n.courtX - n.praiIn, z0 = Math.max(n.courtZ0 + n.praiIn, n.threadZ), z1 = n.courtZ1 - n.praiIn;
        if (p.x < -xm) p.x = -xm; else if (p.x > xm) p.x = xm;
        if (p.z < z0) p.z = z0; else if (p.z > z1) p.z = z1;
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
        return { id, kind, st: 'waiting', x: 0, z: 0, t: 0, at: 0, ring: 0, bub: 0, show: 0, gath: 0, stop: 0,
                 hideIn: 0, lurk: 0, ph: 0, due: 0, fx: 0, fz: 0, hold: '', was: '' };
      }

      /* ------------------------------------------------------------------ a fight */
      function create(opts) {
        const o = opts || {};
        const n = Object.assign({}, NUM, o.num || {});
        const s0 = Number.isFinite(o.sanity) ? Math.max(0, Math.min(100, o.sanity)) : 100;
        const st = {
          v: 2, n, stage: 'brief', t: 0, stageT: 0, who: 'pho', lock: 0, lockUntil: 0, drawT: 0,
          left: 9, losses: 0, lead: false,
          sanity: s0, open: s0, raised: false, preSurge: 0, guard: Math.max(0, Math.min(0.9, +o.guard || 0)),
          pho: { x: n.phoAt[0], z: n.phoAt[1], fireWait: 0, aiWait: n.aiFireWait, waveWait: n.waveWait, wind: 0, ring: null, draw: 0 },
          zav: { x: n.zavAt[0], z: n.zavAt[1], bindWait: 0, smellWait: 0, look: 0 },
          cage: { str: n.cageMax, broken: false, lent: 0 },
          prai: [], clouds: [], flights: [], nextCloud: 1, lastEntry: -99, together: 0, film: 0,
          firsts: {}, lesson: { wave: '' }, hold: 0, holdsDone: 0, goldAt: -1, seen: { swap: false, bind: false, smell: false, shock: false },
          voice: { until: 0, last: -99, q: [], need: '', needSince: 0, needSaid: -99, count: {} },
          said: {}, cur: null,
          log: { dwell: {}, trans: {}, stage: {}, timed: {} },
          stats: { fires: 0, chased: 0, slipped: 0, binds: 0, smells: 0, lends: 0, waves: 0, broken: 0, bags: 0, byWave: 0,
                   switches: 0, refused: 0, stale: 0, rose: 0, drained: 0, breaks: 0, lines: 0, length: 0 },
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
        if (act === 'RETRY') return st.stage === 'lost' ? '' : 'stage';
        if (act === 'LEAD') return st.stage === 'lost' && st.losses >= 3 ? '' : 'stage';
        if (act === 'FILMDONE') return st.stage === 'naga' ? '' : 'stage';
        if (act === 'TOGETHER') return st.stage === 'surge' && st.stageT >= n.togetherAfter && !st.together ? '' : 'stage';
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
        if (act === 'SMELL') { if (!st.seen.smell) return 'stage'; return z.smellWait > 0 ? 'wait' : ''; }
        if (act === 'LEND') {
          if (!st.seen.shock || st.stage !== 'fight') return 'stage';
          if (ph.wind > 0 || ph.ring) return 'busy';
          if (ph.waveWait > 0) return 'wait';
          return st.cage.lent > 0 ? 'busy' : '';
        }
        return 'stage';
      }
      function refuse(st, act, w) { st.stats.refused++; st.ev.push({ e: 'refused', act, why: w }); }

      /* ------------------------------------------------------------------ the game aims (the plan's 5.6: nothing is aimed
         by hand and nothing is timed; a tap on a Prai picks it). FIRE goes first to a bound Prai (it tires it), then to a
         Prai at him (it chases it off him), then to one at the cage's bars, then to one on its way; a Prai that slips
         the fire, last of all */
      function onFlight(st, id) { for (const f of st.flights) if (f.id === id && !f.ai) return true; return false; }
      function fireTarget(st, pick) {
        const n = st.n, ph = st.pho, z = st.zav;
        let best = null, bs = 1e9;
        for (const p of st.prai) {
          if (pick && p.id !== pick) continue;
          let r;
          if (p.st === 'bound') r = 0;
          else if (p.st === 'through' || (p.st === 'shown' && p.at === 2)) r = p.kind === 'slip' ? 9 : 1;
          else if (p.st === 'pressing') r = p.kind === 'slip' ? 9 : 2;
          else if (p.st === 'coming' || p.st === 'shown') r = p.kind === 'slip' ? 9 : 3;
          else continue;
          if (onFlight(st, p.id)) r += 20;                       // a ball already on its way to it comes last
          const dP = dist(ph.x, ph.z, p.x, p.z);
          if (dP > n.fireReach) continue;
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
          const d = dist(ph.x, ph.z, p.x, p.z);
          if (d > n.bagReach) continue;
          if (d < bs) { bs = d; best = p; }
        }
        return best;
      }

      /* ------------------------------------------------------------------ the acts */
      function doAct(st, act, input) {
        const w = why(st, act);
        if (w) { refuse(st, act, w); return; }
        const n = st.n, ph = st.pho, z = st.zav;
        switch (act) {
          case 'START': begin(st); return;
          case 'RETRY': case 'LEAD': beginFight(st, act === 'LEAD'); return;
          case 'FILMDONE': layThree(st); return;
          case 'TOGETHER': st.together = n.togetherSecs; st.ev.push({ e: 'together' }); return;
          case 'SWITCH':
            st.who = isP(st) ? 'zavier' : 'pho'; st.lock = n.switchLock; st.lockUntil = st.t + n.switchLock; st.stats.switches++;
            if (!isP(st)) { st.seen.bind = true; st.seen.smell = true; }   // his two buttons, the first time he is played
            st.ev.push({ e: 'switch', to: st.who });
            return;
          case 'FIRE': {
            ph.fireWait = n.fireWait; st.stats.fires++;
            let target = null, cloud = 0;
            if (input && input.pickCloud) { for (const c of st.clouds) if (c.id === input.pickCloud) cloud = c.id; }
            if (!cloud) target = (input && input.pick ? fireTarget(st, input.pick) : null) || fireTarget(st, 0);
            const f = { id: target ? target.id : 0, cloud, t: n.flight, ai: false, x: 0, z: 0 };
            if (target) { f.x = target.x; f.z = target.z; }
            else if (cloud) { for (const c of st.clouds) if (c.id === cloud) { f.x = c.x; f.z = c.z; } }
            else { f.x = ph.x * 0.5; f.z = ph.z - 2.2; }       // nothing to aim at: it rises and falls on the open paving
            st.flights.push(f);
            st.ev.push({ e: 'fireball', id: f.id, x: f.x, z: f.z, ai: false });
            if (st.stats.fires === 1) sayOnce(st, 'ko5c1', 8.0);
            return;
          }
          case 'BAG': {
            const p = (input && input.pick ? bagTarget(st, input.pick) : null) || bagTarget(st, 0);
            setSt(st, p, 'drawn', 'bag'); p.hold = ''; ph.draw = n.bagSecs; st.stats.bags++;
            st.ev.push({ e: 'bag', id: p.id });
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
            const p = (input && input.pick ? bindTarget(st, input.pick) : null) || bindTarget(st, 0);
            z.bindWait = n.bindWait; st.stats.binds++;
            const lessonShown = p.hold === 'show';
            p.stop = 0; p.bub = n.bubbleSecs;
            setSt(st, p, p.st === 'tired' ? 'held' : 'bound', 'bind');
            p.hold = st.stage === 'learn' ? 'keep' : st.lesson.wave === 'pending' ? 'grace' : '';
            if (lessonShown) sayOnce(st, 'ph5g4');
            st.ev.push({ e: 'bind', id: p.id });
            if (st.stats.binds === 1) sayOnce(st, 'q5c5');
            return;
          }
          case 'SMELL': {
            z.smellWait = n.smellWait; st.stats.smells++;
            let k = 0;
            for (const p of st.prai) if (p.st === 'hidden' || p.st === 'beneath') {
              p.show = n.showSecs; if (p.hold === 'hide') p.hold = 'show';
              setSt(st, p, 'shown', 'smell'); k++;
            }
            st.ev.push({ e: 'smell', found: k });
            if (!k && st.stage === 'fight') {                       // opened for nothing, he draws them on: faster and harder, a while
              st.drawT = n.drawSecs; st.ev.push({ e: 'drawn', secs: n.drawSecs });
              sayOnce(st, 'ph5fg');                                 // "Do not open yourself for nothing. They feel it."
            }
            return;
          }
          case 'LEND':
            st.cage.lent = n.lendSecs; st.stats.lends++;
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
        st.cage.str = n.cageMax; st.cage.broken = false; st.cage.lent = 0;
        st.flights.length = 0; st.clouds.length = 0; st.lastEntry = -99;
        const ph = st.pho, z = st.zav;
        ph.wind = 0; ph.ring = null; ph.draw = 0; ph.fireWait = 0; ph.aiWait = n.aiFireWait;
        ph.waveWait = n.waveWait; z.bindWait = 0; z.smellWait = 0;
        st.lesson.wave = st.firsts.wave ? 'done' : ''; st.hold = 0; st.holdsDone = 0;
        if (fromLoss) {
          st.sanity = st.open; st.ev.push({ e: 'sanity', to: st.open });
          st.who = 'pho'; st.lock = 0; st.lockUntil = 0;
          ph.x = n.phoAt[0]; ph.z = n.phoAt[1]; z.x = n.zavAt[0]; z.z = n.zavAt[1];
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
      function layThree(st) {                                    // the Naga's film is over: stage 6
        const n = st.n;
        let i = 0;
        for (const p of st.prai) if (p.st === 'shape') {
          const at = n.laidAt[Math.min(i++, n.laidAt.length - 1)];
          p.x = at[0]; p.z = at[1]; setSt(st, p, 'laid', 'the Naga lays it down');
        }
        st.sanity = Math.max(st.sanity, st.preSurge);             // what the surge pressed out of him comes back
        st.ev.push({ e: 'sanity', to: st.sanity });
        st.who = 'pho'; st.lock = 0; st.lockUntil = 0;
        st.pho.x = n.phoAt[0]; st.pho.z = n.phoAt[1]; st.zav.x = n.zavAt[0]; st.zav.z = n.zavAt[1];   // where the film left them
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
              enter(st, next, at[0] + (r1 - 0.5) * 2 * j, at[1] + (r2 - 0.5) * j);
            }
          }
          // a hold begins: at six left, and at four (each once a fight)
          if (!st.hold && st.holdsDone < n.holdAt.length && st.left <= n.holdAt[st.holdsDone] && st.left > 3) {
            st.hold = st.holdsDone + 1; st.seen.shock = true;
            if (!(ph0(st).wind > 0) && !ph0(st).ring) ph0(st).waveWait = n.holdSecs;
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
          if (st.preSurge > n.surgeTo && st.stageT <= n.surgeSecs + dt) {
            st.sanity = Math.max(n.surgeTo, st.sanity - (st.preSurge - n.surgeTo) / n.surgeSecs * dt);
          }
          if (st.together > 0) {
            timed(st, 'fill', n.togetherSecs - st.together + dt);
            st.together -= dt;
            if (st.together <= 0) { st.together = 0; setStage(st, 'naga'); st.film = 0; st.ev.push({ e: 'naga' }); }
          }
        } else if (st.stage === 'naga') {
          st.film += dt; timed(st, 'naga', st.film);
          if (st.film >= n.filmGuard) layThree(st);               // a film that never says it ended cannot hold the fight
        } else if (st.stage === 'last') {
          if (st.left <= 0) { setStage(st, 'won'); st.stats.length = st.t; st.ev.push({ e: 'won', sanity: st.sanity }); }
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
        p.x += dx / d * by; p.z += dz / d * by; clampPrai(st.n, p);
        p.stop = stop;
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
          } else if (p.kind === 'slip' && (p.st === 'coming' || p.st === 'pressing' || p.st === 'through')) {
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
          ph.wind = 0; ph.waveWait = st.hold ? Math.min(n.waveBroken, n.holdRetry) : n.waveBroken; st.stats.broken++;
          for (const p of st.prai) if (p.st === 'rushing') { setSt(st, p, p.was === 'shown' ? (p.show > 0 ? 'shown' : 'hidden') : 'coming', 'the gold broke'); p.at = 0; }
          st.ev.push({ e: 'broken' });
          st.said.ph5fe = 0; sayOnce(st, 'ph5fe');               // (said each time it happens)
        } else if (ph.wind <= 0) {
          ph.wind = 0; ph.waveWait = st.hold ? n.holdRetry : n.waveWait;
          ph.ring = { r: 0, x: ph.x, z: ph.z, touched: 0, gathered: 0 };
          for (const p of st.prai) if (p.st === 'rushing') { ph.ring.touched |= 1 << p.id; throwBack(st, p, ph.ring); }   // crowded round him: the ring's first instant
          st.ev.push({ e: 'wave', x: ph.x, z: ph.z });
          if (!st.firsts.waveOut) { st.firsts.waveOut = true; sayOnce(st, 'ju5c1', 5.0); }
        }
      }
      /* the ring drives a free Prai back to the far side and stills it there; what was under the paving it shows */
      function throwBack(st, p, circle) {
        const n = st.n, under = p.st === 'hidden' || p.st === 'beneath' || p.st === 'shown' || (p.st === 'rushing' && p.was === 'shown');
        p.x = Math.max(-(n.courtX - n.praiIn), Math.min(n.courtX - n.praiIn, p.x + (p.x - circle.x) * 0.5));
        p.z = n.throwZ; clampPrai(n, p); p.stop = n.throwStop; p.at = 0; p.gath = 0; p.lurk = 0;
        if (under) { p.show = n.showSecs; if (p.st === 'shown') restart(st, p, p.hold); else setSt(st, p, 'shown', 'the gold shows it'); }
        else setSt(st, p, 'coming', 'the gold drives it back');
      }
      function ringTick(st, dt) {
        const n = st.n, ph = st.pho, circle = ph.ring;
        if (!circle) return;
        circle.r += n.ringSpeed * dt;
        for (const p of st.prai) {
          const bit = 1 << p.id;
          if (circle.touched & bit) continue;
          if (p.st === 'waiting' || p.st === 'gathered' || p.st === 'drawn' || p.st === 'entering' || p.st === 'fleeing' || p.st === 'shape' || p.st === 'laid' || p.st === 'tired') continue;
          if (dist(circle.x, circle.z, p.x, p.z) > circle.r) continue;
          circle.touched |= bit;
          if (p.st === 'bound' || p.st === 'held') {
            // gathered at once: never past the three the surge waits on, and never the count jumped (the plan's 5.5)
            if (st.stage === 'fight' && st.left - 1 < 3) { if (p.st === 'bound') { p.ring = n.ringSecs; setSt(st, p, 'held', 'the gold'); } continue; }
            setSt(st, p, 'gathered', 'the gold'); p.hold = ''; st.left--; circle.gathered++; st.stats.byWave++;
            st.ev.push({ e: 'gathered', id: p.id, by: 'wave', left: st.left });
            leftLines(st);
          } else throwBack(st, p, circle);
        }
        if (circle.r >= n.ringMax) {
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
            st.holdsDone = st.hold; st.hold = 0; ph.waveWait = n.waveWait;        // the bag opens again; the gold's long wait
            st.ev.push({ e: 'holdEnd' });
          }
        }
      }

      /* ------------------------------------------------------------------ the Prai */
      function towardHim(st, p, pace, stopAt, dt, weave) {
        const z = st.zav, dx = z.x - p.x, dz = z.z - p.z, d = Math.sqrt(dx * dx + dz * dz) || 1e-6;
        if (d <= stopAt + 1e-6) return true;
        const stp = Math.min(pace * dt, d - stopAt);
        p.x += dx / d * stp; p.z += dz / d * stp;
        if (weave) { p.ph += dt; const s = Math.sin(p.ph * 2 * Math.PI / st.n.weaveSecs) * weave * dt; p.x += -dz / d * s; p.z += dx / d * s; }
        clampPrai(st.n, p);
        return dist(z.x, z.z, p.x, p.z) <= stopAt + 1e-3;
      }
      function praiTick(st, dt) {
        const n = st.n, z = st.zav, cage = st.cage, lent = cage.lent > 0, holds = !cage.broken && !lent;
        // a bubble does not run down while the cage is lent, nor, in a hold, for goldGrace seconds from the moment the gold
        // is ready, nor while the gold is gathered and goes out (a bubble never ends in the instant the gold is asked for;
        // the grace is a number, so a bubble is still a timed thing with a longest stand: bubbleLongest)
        const ph = st.pho, goldNow = st.hold > 0 && ph.waveWait <= 0 && !(ph.wind > 0) && !ph.ring;
        if (!goldNow) st.goldAt = -1; else if (!(st.goldAt >= 0)) st.goldAt = st.t;
        const still = lent || (st.hold > 0 && ((goldNow && st.t - st.goldAt < n.goldGrace) || ph.wind > 0 || !!ph.ring));
        const drawn = (st.drawT > 0 ? n.drawPace : 1) * (st.hold ? n.holdPace : 1);   // his senses opened wide draw them on; the gathering gold weighs on them
        let pressing = 0;
        for (const p of st.prai) if (p.st === 'pressing') pressing++;
        for (const p of st.prai) {
          p.t += dt;
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
              if (pressing >= n.pressMax && d <= n.waitR + 0.05) break;                // three at the bars: the rest wait, in view
              if (towardHim(st, p, pace, n.pressR, dt, wv) && pressing < n.pressMax) { p.at = 1; pressing++; setSt(st, p, 'pressing', 'at the bars'); }
              break;
            }
            case 'pressing':
              break;                                              // (it wears the cage: cageTick)
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
              if (p.hold !== 'keep' && p.hold !== 'grace' && !still) { p.bub -= dt; if (p.bub <= 0) { p.bub = 0; unbind(st, p); } }
              break;
            case 'held':
              if (p.hold !== 'keep' && p.hold !== 'grace' && !still) { p.bub -= dt; if (p.bub <= 0) { p.bub = 0; setSt(st, p, 'tired', 'the bubble ends'); p.hold = ''; } }
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
                setSt(st, p, 'gathered', 'into the bag'); st.left--; st.pho.draw = 0;
                st.ev.push({ e: 'gathered', id: p.id, by: 'bag', left: st.left });
                leftLines(st);
              }
              break;
          }
        }
        // the stale clouds thin and go
        if (st.clouds.length) { let w = 0; for (const c of st.clouds) { c.t -= dt; if (c.t > 0) st.clouds[w++] = c; } st.clouds.length = w; }
      }
      function unbind(st, p) {
        p.at = 0;
        if (p.kind === 'hide') { st.clouds.push({ id: st.nextCloud++, x: p.x, z: p.z, t: st.n.staleSecs }); p.lurk = 0; setSt(st, p, 'hidden', 'the bubble ends: it slips under'); }
        else setSt(st, p, 'coming', 'the bubble ends');
        p.hold = '';
        st.ev.push({ e: 'unbind', id: p.id });
      }
      function leftLines(st) {
        if (st.stage === 'learn') sayOnce(st, 'ph5g1');
        if (st.stage === 'fight' && st.left === 5) sayOnce(st, 'q5c1');
        if (st.stage === 'last' && st.left === 0) sayOnce(st, 'ph5c4');
      }

      /* ------------------------------------------------------------------ the cage, and his sanity */
      function cageTick(st, dt) {
        const n = st.n, c = st.cage;
        if (c.lent > 0) {
          timed(st, 'lend', n.lendSecs - c.lent + dt);
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
      function sanityTick(st, dt) {
        const n = st.n;
        if (st.stage !== 'fight') return;
        let k = 0;
        for (const p of st.prai) if (atHim(p) && p.gath <= 0) k++;
        if (!k) return;
        const amt = n.drain * k * dt * (1 - st.guard);
        st.sanity -= amt; st.stats.drained += amt;
        st.ev.push({ e: 'drain', amt });
        if (st.sanity <= n.lostAt) lose(st);
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
          case 'surge': return st.stageT >= n.togetherAfter && !st.together ? mk('together', 'TOGETHER') : null;
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
            if (p.st === 'hidden') return P ? mk('hidden', 'SWITCH', p, !lock) : mk('hidden', 'SMELL', p, z.smellWait <= 0 && !lock);
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
          if (atHim(p) && s !== 'beneath') { if (p.kind === 'slip' && s !== 'shown') { if (!aHimSlip) aHimSlip = p; } else if (!aHim || p.gath < aHim.gath) aHim = p; }
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
        const fireOk = ph.fireWait <= 0, bindOk = z.bindWait <= 0 && !full, smellOk = z.smellWait <= 0;
        const bindSoon = !full && z.bindWait <= 1.5, smellSoon = z.smellWait <= 1.5;
        if (P) {
          // GRANDMASTER PHO, PLAYED: what only he can do, first (chase off what is at his student, tire the bound, bag the
          // tired, loose the gold under the lent cage); then send him to his student for what only his student can do
          if (ph.wind > 0 || ph.draw > 0) return null;           // the act in hand finishes first
          if (lentGo) return mk('waveGo', 'SHOCKWAVE');
          if (goldFirst) return freeNear ? mk('waveLend', 'SWITCH', null, !lock) : mk('waveSafe', 'SHOCKWAVE');
          if (aHim) return mk('athimF', 'FIRE', aHim, fireOk && !lock);                    // chase it off him
          if (aHimSlip) return mk('athimS', 'SWITCH', aHimSlip, !lock);
          if (aBen) return mk('beneath', 'SWITCH', aBen, !lock);
          if (waveReady && bound && !st.lesson.wave.startsWith('pend')) return freeNear ? mk('waveLend', 'SWITCH', null, !lock) : mk('waveSafe', 'SHOCKWAVE');
          if (st.lesson.wave === 'pending' && bound) return mk('waveL', 'SWITCH', null, !lock);
          // (in the hold a bound Prai is left bound: still, harmless, and the gold's to gather. Fire would tire it, and a
          // tired one rises again and hides; and the bag is closed)
          if (aBound && !(st.hold > 0)) return dist(ph.x, ph.z, aBound.x, aBound.z) <= n.fireReach ? mk('bound', 'FIRE', aBound, fireOk && !lock) : mk('bound', 'FIRE', aBound, false, true);
          if (aTired && !(st.hold > 0)) return bagNeed(st, 'tired', aTired, mk);
          if (aPressCome && st.cage.str < 35) return mk('cage', 'FIRE', aPressCome, fireOk && !lock);   // the cage nearly gone: chase it off
          if (pending) return bound ? mk('waveL', 'SWITCH', null, !lock) : mk('waveB', 'SWITCH', null, !lock);
          if (aPress) return mk('press', 'SWITCH', aPress, !lock);
          if (aShown) return mk('shown', 'SWITCH', aShown, !lock);
          if (waveReady && worth) return freeNear ? mk('waveLend', 'SWITCH', null, !lock) : mk('waveSafe', 'SHOCKWAVE');
          if (aSlip) return mk('slip', 'SWITCH', aSlip, !lock);
          if (aHid) return mk('hidden', 'SWITCH', aHid, !lock);
          if (aCome) return mk('come', 'SWITCH', aCome, !lock);
          return null;
        }
        // MASTER ZAVIER, PLAYED: what is at him, what is under him, what presses his cage; what the smell has shown; the
        // golden shockwave's lesson; what hides and what slips; then back to his teacher for what only his teacher can do
        if (lentGo) return mk('waveGo', 'SWITCH', null, !lock);
        if (goldFirst && !(st.cage.lent > 0)) return mk('waveLend', 'LEND', null, !lock);
        if ((aHim || aHimSlip) && bindSoon) return mk('athimB', 'BIND', aHim || aHimSlip, bindOk && !lock);
        if (aHim) return mk('athimSw', 'SWITCH', aHim, !lock);                // his BIND is far off: his teacher's fire chases it off
        if (aHimSlip) return mk('athimB', 'BIND', aHimSlip, false);            // the fire cannot touch it: his BIND, as soon as it is back
        if (aBen && smellSoon) return mk('beneath', 'SMELL', aBen, smellOk && !lock);
        if (waveReady && bound && !(st.cage.lent > 0)) return mk(st.lesson.wave === 'pending' ? 'waveL' : 'waveLend', 'LEND', null, !lock);   // the gold, the way out
        if (aPress && bindSoon) return mk('press', 'BIND', aPress, bindOk && !lock);
        if (aShown && (bindOk || (bindSoon && z.bindWait < aShown.show))) return mk('shown', 'BIND', aShown, bindOk && !lock);
        if (pending) {
          if (!bound) { const t = bindTarget(st, 0); if (t && bindSoon) return mk('waveB', 'BIND', t, bindOk && !lock); }
          else if (!(st.cage.lent > 0)) return mk('waveL', 'LEND', null, !lock);
        }
        if (aHid && smellSoon) return mk('hidden', 'SMELL', aHid, smellOk && !lock);
        if (aSlip && bindSoon) return mk('slip', 'BIND', aSlip, bindOk && !lock);
        if (aBound && !(st.hold > 0)) return mk('bound', 'SWITCH', aBound, !lock);
        if (aTired) {
          if (aKeep && bindOk) return mk('keep', 'BIND', aKeep, !lock);
          if (!(st.hold > 0)) return mk('tired', 'SWITCH', aTired, !lock);
        }
        if (waveReady && worth && !(st.cage.lent > 0)) return mk('waveLend', 'LEND', null, !lock);
        if (aCome && bindSoon) return mk('come', 'BIND', aCome, bindOk && !lock);
        return null;
      }
      /* (in the hold, a Prai that is not bound when the gold goes out is not gathered: the prompts above already bind what
         presses and what comes; the gold's own prompts are waveLend and waveGo) */
      function bagNeed(st, id, p, mk) {
        const n = st.n, ph = st.pho;
        const d = dist(ph.x, ph.z, p.x, p.z);
        return d <= n.bagReach ? mk(id, 'BAG', p, st.lock <= 0 && !ph.ring) : mk(id, 'BAG', p, false, true);
      }

      /* ------------------------------------------------------------------ ONE STEP OF THE FIGHT */
      const NONE = {};
      function step(st, input, dt, io) {
        st.ev.length = 0;
        const n = st.n;
        const inp = input || NONE;
        if (Number.isFinite(inp.sanity)) st.sanity = inp.sanity;   // the engine's own number, after its guards (v14.13)
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
        cageTick(st, dt);
        sanityTick(st, dt);
        if (st.stage !== 'lost') stageTick(st, dt, io);
        st.cur = need(st);
        if (st.stage !== 'lost') voiceTick(st, io);
        return st.ev;
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
          act === 'SMELL' ? z.smellWait / n.smellWait : (act === 'SHOCKWAVE' || act === 'LEND') ? ph.waveWait / n.waveWait : 0;
        const btn = (slot, act, shown) => {
          const w = shown ? why(st, act) : 'stage';
          return { slot, act, shown: !!shown, live: !w, why: w, wait: Math.max(0, Math.min(1, waitOf(act))), pulse: !!(nd && nd.act === act) };
        };
        const s = SLOT[P ? 'pho' : 'zav'];
        return {
          stage: st.stage, who: st.who, left: st.left, sanity: st.sanity, losses: st.losses,
          cage: { str: st.cage.str / n.cageMax, broken: st.cage.broken, lent: st.cage.lent > 0 },
          objective: objectiveOf(st),
          main: btn('main', s.main, inPlay && (P ? st.stage !== 'last' : st.seen.bind)),
          second: btn('second', s.second, st.stage === 'fight' ? (P ? st.seen.shock : st.seen.smell) : (st.stage === 'learn' && !P && st.seen.smell)),
          third: btn('third', s.third, inPlay && (P ? !!bagTarget(st, 0) : (st.seen.shock && ph.waveWait <= 0 && st.stage === 'fight'))),
          swap: { slot: 'swap', act: 'SWITCH', face: P ? 'zavier' : 'pho', shown: st.seen.swap && (st.stage === 'learn' || st.stage === 'fight'),
                  live: !why(st, 'SWITCH'), why: why(st, 'SWITCH'), wait: st.lock / n.switchLock, pulse: !!(nd && nd.act === 'SWITCH') },
          together: { shown: st.stage === 'surge', live: !why(st, 'TOGETHER'), fill: st.together ? 1 - st.together / n.togetherSecs : 0 },
          retry: { shown: st.stage === 'lost', lead: st.stage === 'lost' && st.losses >= 3 },
          bubbles: bubbles(st)
        };
      }
      function objectiveOf(st) {
        // the words are the chapter's (DATA.words, the sheet's): this names which, and the count it carries
        if (st.stage === 'learn') {
          const p = st.prai[0];
          return { key: p.st === 'coming' || p.st === 'entering' ? 'objFight1' : p.st === 'hidden' || p.st === 'fleeing' ? 'objFight1b'
                       : p.st === 'shown' ? 'objFight2' : 'objFight2b' };
        }
        if (st.stage === 'fight') return st.hold ? { key: 'objFight3h' } : { key: 'objFight3', n: st.left };
        if (st.stage === 'surge') return { key: 'objFight4' };
        if (st.stage === 'last') return { key: 'objFight6' };
        return null;
      }

      return Object.freeze({ NUM, STATES, STAGES, TIMED, NEEDLINES, ONCE, ONLOSS, LINES: LINES_SAID, SLOT,
                             create, step, need, hud, why });
    })();
