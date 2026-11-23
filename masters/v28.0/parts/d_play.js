
    /* ================================================================ THE FRAME, AND THE STAGE HANDED TO THE ENGINE */
    const wallClock = { t: 0 };
    let lastWall0 = 0, lastWall = 0, pausedAt = 0;

    /* the decision's anchor (the engine's pile): the collector's table, at the far end of the floor (TODO-WORLD: the
       low table in the receiving room). The decision is opened by the collector's question, never by walking up to
       it; the pile is live only while the question stands, so a decision stepped back from is opened again there */
    const INTERACT_R = 2.6;
    const PILE_POS = new THREE.Vector3(DATA.shrine.x, 0, DATA.shrine.z);
    const pile = new THREE.Group(); pile.position.copy(PILE_POS); world.add(pile);
    const _ndc = new THREE.Vector3();
    const pileLive = () => decOpen && phase === 'ask';
    function pileDist() { return Math.hypot(yaw.position.x - PILE_POS.x, yaw.position.z - PILE_POS.z); }
    function pileScreen() { camera.updateMatrixWorld(); return _ndc.set(PILE_POS.x, PILE_POS.y + 1.0, PILE_POS.z).project(camera); }
    function pileInView() { if (!pileLive()) return false; const n = pileScreen(); return n.z < 1 && Math.abs(n.x) < 1.1 && Math.abs(n.y) < 1.1; }
    function pointerHitsPile() { return pileLive() && pileDist() < INTERACT_R; }
    /* (opened again after a step back by the same door as the first time, c_story.js openDecision, so the window shuts his
       sight here too: the plan's 6.2, v11.4; straight to startDecision it opened over an open eye, its bed and music on) */
    function interactPile() { if (!pileLive() || getState() !== 'play') return false; openDecision(); return true; }

    /* THE FRAME (chapter 4's): the chapter's clock runs in play only; a voice plays on under a panel while the clock
       stands still, so its booking comes forward by the time the panel was up, as far as the voice's own end (e3c3's
       v21.21 law); the saved phase is applied on the first frame of play, never before (v9.3) */
    function updateNotes(dt, t) {
      const st = getState();
      const now = wallNow(), raw = lastWall0 ? Math.max(0, now - lastWall0) : 0, wdt = Math.min(0.25, raw); lastWall0 = now;
      wallClock.t += wdt;
      carryPrime(st);                                          // (a carried thing's hold, made before the people's tick: c_play.js)
      worldFrame(wdt, st);                                     // (the world's hook: its people and levels)
      playFrame(wdt, st);                                      // (the play's: SMELL's threads, the walkers, the strain: c_play.js)
      carryTick(st);                                           // (what Ton and Jun carry, laid after the play's frame and its settle: c_play.js)
      if (st === 'decide') askPatience(wdt);                   // (the collector's patience runs on wall time under the window)
      if (st !== 'play') { if (!pausedAt) pausedAt = now; lastWall = 0; return; }
      if (pausedAt) { const away = Math.max(0, now - pausedAt); pausedAt = 0;
        if (speak.voiceTo > dayClock.t) { const cut = Math.min(away, speak.voiceTo - dayClock.t); speak.until -= cut; speak.voiceTo -= cut; } }
      if (lastWall) dayClock.t += Math.min(0.5, now - lastWall);
      lastWall = now;
      if (!booted) { booted = true; applyPhase(kit ? kit.getPhase() : null); }
      runTodo(); runSpeak(); runQueue();
      if (booted) storyTick(wdt);
    }
    function updatePile() {}
    function updateFire() {}
    function updateSlow() {}

    function snap() { return { phase, story: storySnap() }; }
    function restore() {}
    /* A SAME-CHAPTER REPLAY never runs build() again: everything a run changes is put back here (v8.1) */
    function reset() {
      phase = null; booted = false; dropTodo(); speakReset(); lineQ.length = 0; heard.clear();
      dayClock.t = 0; wallClock.t = 0; lastWall0 = 0; lastWall = 0; pausedAt = 0;
      storyReset(); playReset(); worldReset();
      /* the rite's things a run sets down or carries, put away as build() leaves them (a replay began with the reel of thread
         and the staff's cloth on the court's paving where the fight set them: nothing took them up again), and whatever of
         the fight a run's last film left standing (as a film that hands to the play clears it: c_yfilm.js endPhase5) */
      for (const n of ['threadReel', 'staffCloth', 'bagOpen', 'bagTied']) if (things[n]) things[n].visible = false;
      STICK5.to('away'); DUFFEL5.to('away'); fmShow(cast.zav, false);
      THREAD5.set(false); CAGE5.set(null); TRANCE5.set(0); TRANCE5.pools(null, null, 0, 0); TRANCE5.gold(0); NAGA5.set(0, 0, 0, 0, 0);
    }

    /* what he cannot walk through: every solid of the place, a column from the floor (v5.03). TODO-WORLD: none yet */
    function blockers() {
      const out = [];
      for (const s of solids) { s.updateWorldMatrix(true, false); const bb = new THREE.Box3().setFromObject(s); bb.expandByScalar(0.14); bb.min.y = 0; bb.max.y = Math.max(bb.max.y, 1.40); out.push(bb); }
      /* (R37: the fight's lens stop at the gate (b_world.js boomStop) is no solid until the fight's phase turns it on
         (b_xpeople.js blockOn, which keeps its whole box here): over the walkway he walks it in every other phase) */
      { const i = solids.indexOf(boomStop); if (i >= 0) { block0.set(boomStop, out[i].clone()); out[i].makeEmpty(); } }
      return out;
    }

    function dispose() {
      alive = false;
      const geos = new Set(), ms = new Set();
      world.traverse(o => {
        if (o.geometry) geos.add(o.geometry);
        if (o.material) for (const m of (Array.isArray(o.material) ? o.material : [o.material])) ms.add(m);
      });
      scene.remove(world);
      for (const o of owned) { if (o.parent) o.parent.remove(o); if (o.dispose) o.dispose(); }
      owned.length = 0;
      for (const g of geos) g.dispose();
      for (const m of ms) {
        for (const k of ['map', 'roughnessMap', 'metalnessMap', 'normalMap', 'emissiveMap', 'alphaMap']) if (m[k] && m[k].dispose) m[k].dispose();
        m.dispose();
      }
      for (const m of mats) m.dispose();
      for (const t of madeTex) if (t && t.dispose) t.dispose();
      world.clear();
      S = null;
    }

    return (S = {
      world, noteTex, blockers: blockers(),
      /* TODO-WORLD: true only once every body is ready and no model is still being unpacked, so all of it is done under
         the curtain and warmed before the black lifts (chapter 4's R51; v14.15) */
      ready: () => worldReady(),
      pile: { pos: PILE_POS, radius: INTERACT_R, group: pile,
              dist: pileDist, screen: pileScreen, inView: pileInView,
              hits: pointerHitsPile, interact: interactPile,
              glow: () => 0 },
      drum: null, ash: null, embers: null, heroNote: null, smoke: null, flying: null,
      jossTips: [], fireLight: null,
      skyAt: () => worldSkyAt(),
      /* TODO-WORLD: where a scene change puts him down (`arrivals`), the ground he is kept on (`keepIn`), each later
         ground for the walk test (`grounds`: the court at night, the receiving room), and the floor's height (`groundAt`) */
      arrivals: ARRIVALS, keepIn: KEEP, grounds: GROUNDS, groundAt: flatGround, things: FLOOR.things,
      get phase() { return phase; },
      setPhase, applyPhase, onVision,
      presets: PRESETS,
      plan: { FLOOR, SPOT },
      info: () => ({ phase, mark: mark(), t: +dayClock.t.toFixed(2), queued: lineQ.length, heard: [...heard], until: +speak.until.toFixed(2),
                     pending: speak.pending ? speak.pending.name : null, applied: booted, busy: play.busy, decOpen }),
      sayLine, queueLine, queueFn, queueGap, dayClock, after,
      /* (a probe's handle on the script as the chapter holds it) */
      script: { SECS, LINES, SAID },
      films: FILMS5API,                                          // (the films' pictures and the cast's handles: c_yfilm.js, c_cast.js)
      hotspots: worldHotspots(hotspots),                         // (the world's: each tagged with the ground the walk test tries it in)
      updateNotes, updatePile, updateFire, updateSlow,
      snap, restore, reset, dispose
    });
  }
