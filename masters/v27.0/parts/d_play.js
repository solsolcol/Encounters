    /* ================================================================ PLAY (M6: the phases of the plan's §4.1 to §4.3)
       FIRST LIGHT (M5): the flat stands, walked, and nothing in it plays yet. The phase string is the save's receipt
       (v7.3); every later phase will be applied from it here. */
    let phase = null, booted = false;
    const wallClock = { t: 0 };
    let lastWall0 = 0, lastWall = 0, pausedAt = 0;
    /* THE CHAPTER'S CLOCK (chapter 3's dayClock): it runs in play only, on wall time, so a panel stands it still while a
       voice plays on; the line queue and every timer of the play run on it (chapter 3's, copied) */
    const dayClock = { t: 0 };
//@@COPY 6474-6513 :: const todo = [];
    /* the things he can press (c_story.js: the five sources, her, his teacher, the three presences, the water) */
    const hotspots = STORY_SPOTS;

    /* the decision's anchor (the engine's pile): her chair. The decision is opened by the trance's film at the turning
       point (M7), never by walking up to her; until then the pile is never live */
    const INTERACT_R = 2.6;
    const PILE_POS = new THREE.Vector3(CHAIR.x, 0, CHAIR.z);
    const pile = new THREE.Group(); world.add(pile);
    const _ndc = new THREE.Vector3();
    const pileLive = () => decOpen && phase === 'kept';
    function pileDist() { return Math.hypot(yaw.position.x - PILE_POS.x, yaw.position.z - PILE_POS.z); }
    function pileScreen() { camera.updateMatrixWorld(); return _ndc.set(PILE_POS.x, PILE_POS.y + 1.0, PILE_POS.z).project(camera); }
    function pileInView() { if (!pileLive()) return false; const n = pileScreen(); return n.z < 1 && Math.abs(n.x) < 1.1 && Math.abs(n.y) < 1.1; }
    function pointerHitsPile() { return pileLive() && pileDist() < INTERACT_R; }
    function interactPile() { if (!pileLive()) return false; startDecision(); return true; }

    /* THE FRAME: the people's clocks, their levels from the lens, the two-level things' levels */
    function updateNotes(dt, t) {
      const st = getState();
      const now = wallNow(), raw = lastWall0 ? Math.max(0, now - lastWall0) : 0, wdt = Math.min(0.25, raw); lastWall0 = now;
      wallClock.t += wdt;
      peopleTick(wdt, st !== 'cine');
      if (st !== 'cine') { crownTick(wdt); oppRidePlay(); peopleLevels(); lodTick(); }
      decideLook(now, st);
      /* the room's own motion runs under a film too (the fan, the lamp's flames, the photograph's glass) */
      fanTick(wdt); lampTick(wdt, wallClock.t); fogTick(wdt);
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
      storyTick(wdt, wallClock.t); ambTick();
    }
    function updatePile() {}
    function updateFire() {}
    function updateSlow() {}

    function snap() { return { phase, story: storySnap() }; }
    function restore() {}
    function reset() { phase = null; booted = false; dropTodo(); speakReset(); lineQ.length = 0; heard.clear(); dayClock.t = 0; lastWall = 0; pausedAt = 0; storyReset(); }

    /* what he cannot walk through: every solid of the shell and the furniture, a column from the floor (v5.03) */
    function blockers() {
      const out = [];
      const solid = (o, pad = 0.14) => { o.updateWorldMatrix(true, false); const bb = new THREE.Box3().setFromObject(o); bb.expandByScalar(pad); bb.min.y = 0; bb.max.y = Math.max(bb.max.y, 1.40); out.push(bb); };
      for (const s of solids) { solid(s); if (s === bigBowlSolid) { bigBowlBox = out[out.length - 1]; bigBowlBox0 = bigBowlBox.clone(); } }
      for (const k in castBlock) out.push(castBlock[k]);            // (moved in place by castSolid: never replaced)
      return out;
    }

    function dispose() {
      alive = false;
      const geos = new Set(), ms = new Set(), skels = new Set();
      world.traverse(o => {
        if (o.isSkinnedMesh && o.skeleton) skels.add(o.skeleton);
        if (o.geometry) geos.add(o.geometry);
        if (o.material) for (const m of (Array.isArray(o.material) ? o.material : [o.material])) ms.add(m);
      });
      for (const p of parsedGlb.values()) p.then(({ scene: sc }) => sc.traverse(o => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) for (const m of (Array.isArray(o.material) ? o.material : [o.material])) {
          for (const k of ['map', 'roughnessMap', 'metalnessMap', 'normalMap', 'emissiveMap', 'alphaMap']) m[k]?.dispose?.();
          m.dispose();
        }
      })).catch(() => {});
      scene.remove(world);
      for (const o of owned) { if (o.parent) o.parent.remove(o); o.dispose?.(); }
      owned.length = 0;
      for (const g of geos) g.dispose();
      for (const k of skels) k.dispose();
      for (const m of ms) {
        for (const k of ['map', 'roughnessMap', 'metalnessMap', 'normalMap', 'emissiveMap', 'alphaMap']) m[k]?.dispose?.();
        m.dispose();
      }
      for (const m of mats) m.dispose();
      for (const t of madeTex) t?.dispose?.();
      world.clear();
      S = null;
    }

    onePassCheck();
    /* the ground he is kept on (stage.keepIn): the living room and the nook, her room, the passage, the dining room and
       the kitchen. The bedrooms and the baths are behind shut doors; the corridor is the opening film's */
    const KEEP_BOXES = [
      { minX: ROOMS.living.x0, maxX: ROOMS.living.x1, minZ: FL.face, maxZ: ROOMS.living.z1 },
      { minX: ROOMS.nook.x0, maxX: ROOMS.nook.x1, minZ: ROOMS.nook.z0, maxZ: ROOMS.nook.z1 },
      { minX: ROOMS.hers.x0, maxX: ROOMS.hers.x1, minZ: FL.face, maxZ: ROOMS.passage.z1 },
      { minX: ROOMS.dining.x0, maxX: ROOMS.dining.x1, minZ: ROOMS.dining.z0, maxZ: ROOMS.dining.z1 },
      /* (18 Nov, walktest on the live build: he stood 4 cm into the main door's opening, 0.0 m2 "outside" a flat drawn to
         the wall's inner face. The opening is hers up to her shut grille gate, whose column (c_props.js) stands across
         its outer face from z -0.10 to -0.02: the doorway is in, the corridor is still out) */
      { minX: DOOR_MAIN.x0, maxX: DOOR_MAIN.x1, minZ: -0.02, maxZ: FL.face }];
    const KEEP = { what: 'her flat', boxes: KEEP_BOXES,
      minX: Math.min(...KEEP_BOXES.map(q => q.minX)), maxX: Math.max(...KEEP_BOXES.map(q => q.maxX)),
      minZ: Math.min(...KEEP_BOXES.map(q => q.minZ)), maxZ: Math.max(...KEEP_BOXES.map(q => q.maxZ)) };
    return (S = {
      world, noteTex, blockers: blockers(),
      /* (R51, Chad, 18 Nov 2026: "in the intro cutscene, when the camera pans across the hdb towards the corridor and
         door of the flat, there is a huge long stutter that happens. How to fix that issue or improve it?". The curtain
         was told the world was ready at once, so every body and every thing of the flat and the estate was unpacked
         (parsed, cloned, its takes grounded) and its programs compiled while the opening film played, under its pan
         across the estate. The world is ready now only when every body is and no model is still being unpacked, so all
         of it is done under the curtain and warmed with the rest before the black lifts (v14.15: nothing heavy while the
         world is on screen). A model that never lands holds it six quiet seconds at most (the engine's own rule)) */
      ready: () => parsePend === 0 && people.every(P => P.ready),
      pile: { pos: PILE_POS, radius: INTERACT_R, group: pile,
              dist: pileDist, screen: pileScreen, inView: pileInView,
              hits: pointerHitsPile, interact: interactPile,
              glow: () => 0 },
      drum: null, ash: null, embers: null, heroNote: null, smoke: null, flying: null,
      jossTips: [], fireLight: null,
      skyAt: () => null,
      arrivals: [],
      keepIn: KEEP,
      groundAt: flatGround,
      get phase() { return phase; },
      setPhase, applyPhase,
      presets: PRESETS,
      plan: { FL, ROOMS, CORR, ALTAR, CHAIR, STOOL, BOWL },
      info: () => ({ phase, t: +dayClock.t.toFixed(2), queued: lineQ.length, heard: [...heard], until: +speak.until.toFixed(2),
                     pending: speak.pending ? speak.pending.name : null, applied: booted, waiting: [...waiting].sort(), mends: twinMends }),
      sayLine, queueLine, queueFn, queueGap, dayClock, after,
      who: () => people.filter(P => !P.driver).map(P => ({ key: P.key, ready: P.ready, take: P.cur })),
      /* (a probe's handle on one person: tools/probes/bonesat.mjs reads its bones where the world draws them) */
      person: (key, i) => people.filter(P => P.key === key)[i || 0] || null,
      /* (tools/probes/headturn.mjs reads a talking head through these) */
      /* (tools/probes/e4c4drive.mjs reads the play's own state and the spirits through these: the fight's shapes, what is
         learned and looked at) */
      dbg: { cast, headDampLay, play, spirits, pose },
      census: () => {
        let meshes = 0, tris = 0; const texs = new Set();
        world.traverse(o => { if (!o.isMesh && !o.isLine && !o.isLineSegments) return; let v = true; for (let q = o; q; q = q.parent) if (!q.visible) { v = false; break; }
          if (!v) return; meshes++;
          const g = o.geometry, n = g.index ? g.index.count / 3 : (g.attributes.position ? g.attributes.position.count / 3 : 0);
          tris += n * (o.isInstancedMesh ? o.count : 1);
          for (const m of [].concat(o.material)) for (const k of ['map', 'normalMap', 'roughnessMap', 'metalnessMap', 'emissiveMap']) if (m && m[k] && m[k].image) texs.add(m[k].source || m[k]); });
        let mb = 0; for (const s of texs) { const im = s.data || s.image; if (im && im.width) mb += im.width * im.height * 4 * 1.33 / 1048576; }
        return { meshes, tris: Math.round(tris), textures: texs.size, texMB: +mb.toFixed(1) };
      },
      hotspots,
      /* the fiftieth and fifty-first seams: his sight opened or shut; what the water may reach and what it reached (R141:
         nothing to fill again: the water never runs out) */
      onVision, shootables, onShot,
      films: filmsApi,                                                          // the films' pictures (c_ufilm.js), for the scenes
      stepSound: stepNext,                                                      // his bare feet on her tiles (c_tsound.js)
      amb: () => ({ n: ambN, last: ambLast, next: +ambAt.toFixed(2), beds: Object.assign({}, bedMix) }),
      updateNotes, updatePile, updateFire, updateSlow,
      snap, restore, reset, dispose
    });
  }
