    /* ================================================================ THE CHAPTER'S SHARED CAST (masters/v29.0/parts/c_cast.js)
       Begun by WORDS (M1) as the skeleton's cast; CAST (M3) swaps Grace's and Marcus's own bodies in, and the FILMS and
       PLAY pieces pose them. ONE BODY EACH, so nothing is cast twice (two bodies of one man cost a phone twice and drift
       apart). Each is a person of chapter 3's machinery (mkPerson), posed by the films' clock (pose) and by the play's
       wall clock (take, hold, rest, talk):
         cast.pho     Grandmaster Pho SEATED cross-legged on his cushion at Grace's low table, in his look D (Chad's pick,
                      v24.52: "unlit, except for the robe"), every posture law episode 4 learned on him: copied here number
                      for number (a declared reuse). Standing at dawn he is chapter 5's copy with finger bones (p5pho):
                      FILMS adds that body with the dawn
         cast.grace   GRACE (the plan's 6). STAND-IN until her own body lands (M3, `p51grace`): Mala, Amma's daughter,
                      whom the player met only in episode 4 chapter 4 (her mother's flat), standing by the sofa
         cast.marcus  MARCUS (the plan's 6). STAND-IN until his own body lands (M3, `p51marcus`): the collector, whom the
                      player met only in episode 4 chapter 5's last case (the receiving room), seated on the rattan chair
       (Neither stand-in is admintee, granny or yinkeeper, each of whom Chad has ruled out.) Nobody is a block figure: a body
       is not drawn at all until its model has landed (v21.16). */

    /* ---------------------------------------------------------------- GRANDMASTER PHO'S LAWS, copied from episode 4
       chapter 5 as it shipped (assemble.py pins its sha1): his robe's flecks, his posture numbers, his look D, the dark
       specks painted over his robe's cover (its R33), and chapter 3's numbers for him seated cross-legged */
//@@COPY 4633-6153 :: /* R43 (Chad, 18 Nov 2026: "There are also some skin colour bits
//@@COPY 12714-12970 :: /* R33 (23 Nov 2026; R28, the brown bits on his robe). WRITTEN BY tools/phodark.py

    /* ---------------------------------------------------------------- THE CAST */
    const cast = {};
    const at0 = (p, k) => (STATION[p] && STATION[p][k]) || null;
    /* GRANDMASTER PHO SEATED CROSS-LEGGED on his cushion at her low table (the plan's 5.3 and 8.1): chapter 3's hall seat,
       its numbers (CROSS) and its cloth (w3pholap, a declared reuse), as episode 4 chapter 5 seats him in case three.
       TODO-WORLD: the cushion's own height when its model stands (chapter 5's was 0.12 m) */
    const CUSHION_TOP = 0.12;
    { const S0 = at0('room', 'pho');
      cast.pho = mkPerson('pho', S0.x, S0.z, S0.ry, { y: CUSHION_TOP, take: 'Sit_to_Stand_Transition_M', centre: true,
        win: { Sit_to_Stand_Transition_M: [0.02, 0.3, PHO_BREATH] }, seat: { y: 0, over: CROSS.hips, takes: /^Sit/ }, skins: false, look: lookD, blobW: 1.05, blobD: 0.85,
        talk: 'Sitting_Answering_Questions', headDamp: PHO_TALK_HEAD, cross: CROSS });
      cast.pho.home = { x: S0.x, z: S0.z, ry: S0.ry, y: CUSHION_TOP }; }
    /* GRACE (STAND-IN: p4mala, as episode 4 chapter 4 cast her: her rest, her talk, her full body within 2.2 m). TODO-CAST:
       her own body, `p51grace`, seated on the sofa (the plan's 8.1: her two stand-ups at 40 s and 110 s) */
    { const S0 = at0('room', 'grace');
      cast.grace = mkPerson('p4mala', S0.x, S0.z, S0.ry, { take: 'Idle_3', phase: 0.15,
        talk: 'Stand_and_Chat', skins: { 0: 'p4malah' }, blobW: 0.75, blobD: 0.6 });
      cast.grace.home = { x: S0.x, z: S0.z, ry: S0.ry }; }
    /* MARCUS (STAND-IN: p5collector, as episode 4 chapter 5 seated him in case three: his sit, his full body). TODO-CAST:
       his own body, `p51marcus`, on the rattan chair by the door. TODO-WORLD: the chair's seat height (here the plain block's 0.45 m) */
    { const S0 = at0('room', 'marcus');
      cast.marcus = mkPerson('p5collector', S0.x, S0.z, S0.ry, { take: 'Sitting_Answering_Questions', centre: true, skins: false,
        win: { Sitting_Answering_Questions: [0.2, 1.2, 9] }, talk: 'Sitting_Answering_Questions', blobW: 0.8, blobD: 0.8,
        seat: { y: 0.45, takes: /^Sit/, down: Object.assign({}, MASTER_DOWN, { hipOver: 0.1, edge: -9 }) },
        shoulders: { Sitting_Answering_Questions: 0.5, Idle_3: 1 },
        headDamp: { Sitting_Answering_Questions: [0.3, 'Sitting_Answering_Questions'] } });
      cast.marcus.home = { x: S0.x, z: S0.z, ry: S0.ry, y: 0.45 }; }

    /* ================================================================ THE WORLD'S PHASES (the hooks: c_play.js book() and
       applyPhase() call worldPhase, d_play.js's frame calls worldFrame, its reset worldReset). The evening's three stand
       in her room in the room and the breaking; nobody stands in his flat at night (he is alone: the plan's 8.3) */
    let worldAt = null;
    function standAt(P, st) {
      if (!P) return;
      if (!st) { P.hidden = true; P.group.visible = false; return; }
      P.hidden = false; put(P, st.x, st.z, st.ry, st.y != null ? st.y : (P.home && P.home.y) || 0);
      if (P.ready) P.group.visible = true;
    }
    function worldPhase(p, place = true) {
      const st = STATION[p] || STATION.room; worldAt = p;
      standAt(cast.pho, st.pho ? Object.assign({ y: CUSHION_TOP }, st.pho) : null);
      standAt(cast.grace, st.grace || null); standAt(cast.marcus, st.marcus ? Object.assign({ y: 0.45 }, st.marcus) : null);
      if (place && st.at) { yaw.position.set(st.at.x, EYE, st.at.z); yaw.rotation.y = st.at.ry; pitch.rotation.x = -0.04; }
    }
    function worldFrame(wdt, st) {
      peopleTick(wdt, st !== 'cine');
      if (st !== 'cine') { peopleLevels(); lodTick(); }
    }
    function worldReset() { worldAt = null; worldPhase('room', false); }
    /* ready only once every model is unpacked and every body that has landed is set up: all of it under the curtain
       (episode 4 chapter 4's R51; v14.15) */
    function worldReady() { return parsePend === 0 && people.every(P => P.ready || !have(P.key)); }
    /* the sky stands over him: over his flat or the street when he is in one (200 m off: the dome is 150 m), else the origin */
    function worldSkyAt() { const x = yaw.position.x; return x > 100 ? { x: FLAT.cx, z: FLAT.cz } : x < -100 ? { x: STREET.cx, z: STREET.cz } : null; }

    /* WHERE A SCENE CHANGE PUTS HIM DOWN (walktest floods from each): his flat, where the film of home leaves him in bed */
    const ARRIVALS = [
      { what: 'his flat, where the film of home leaves him', x: STATION.night.at.x, z: STATION.night.at.z }
    ];
    /* THE GROUND HE IS KEPT ON (stage.keepIn): her front room, and his flat */
    const KEEP = { what: 'her front room and his flat', boxes: [
      { minX: ROOM.x0, maxX: ROOM.x1, minZ: ROOM.z0, maxZ: ROOM.z1 },
      { minX: FLAT.x0, maxX: FLAT.x1, minZ: FLAT.z0, maxZ: FLAT.z1 } ] };
    /* EACH LATER GROUND, walked by the walk test (v26.18): his flat at three o'clock, put in place as a Continue lands */
    const GROUNDS = [
      { what: 'his flat at three in the morning', enter: () => { if (S && S.setPhase) S.setPhase('night'); }, ready: () => worldAt === 'night' && worldReady() }
    ];
    /* EACH THING TO PRESS IS TRIED BY THE WALK TEST IN THE GROUND IT BELONGS TO (v26.18 `ground`): the night's in his flat */
    const GROUND_OF = { getup: GROUNDS[0].what, phone: GROUNDS[0].what };
    function worldHotspots(list) { for (const h of list) if (h && GROUND_OF[h.id] && !h.ground) h.ground = GROUND_OF[h.id]; return list; }
