    /* ================================================================ THE CHAPTER'S SHARED CAST (masters/v29.0/parts/c_cast.js)
       Begun by WORDS (M1) as the skeleton's cast; CAST (M3) swaps Grace's and Marcus's own bodies in, and the FILMS and
       PLAY pieces pose them. ONE BODY EACH, so nothing is cast twice (two bodies of one man cost a phone twice and drift
       apart). Each is a person of chapter 3's machinery (mkPerson), posed by the films' clock (pose) and by the play's
       wall clock (take, hold, rest, talk):
         cast.pho     Grandmaster Pho SEATED cross-legged on his cushion at Grace's low table, in his look D (Chad's pick,
                      v24.52: "unlit, except for the robe"), every posture law episode 4 learned on him: copied here number
                      for number (a declared reuse). Standing at dawn he is chapter 5's copy with finger bones (p5pho):
                      FILMS adds that body with the dawn
         cast.grace   GRACE (the plan's 6): her own body, `p51grace` (CAST's first throw, which stays: Chad has not
                      answered on her second), seated on her sofa
         cast.marcus  MARCUS (the plan's 6): his own body, `p51marcus`, seated on the rattan chair by her door
       (PLAY swapped the stand-ins, Mala and the collector, for these on 27 Nov 2026.) Nobody is a block figure: a body
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
    /* GRACE (the plan's 6; CAST's first throw, `p51grace`, her full body `p51graceh` within 2.2 m: v26.5) ON HER SOFA (its
       cushions' top 0.51 m, measured: WORLD.md), seated by her own posed skin (seatDown, as chapter 5 seats its sitters).
       Her rest is `gsofa` (written for her: restless, the hands working the strap) inside its clean window only: at 0.6 of
       its length her right forearm goes into her hip (people/RECORD.md 4), so the window is its first quarter, there and
       back slowly. She stands up twice in the room (the plan's 8.1) by `rise` (seat.rise: her height laid from her own
       feet as she comes up) and sits again by the same take played back. She has met the player only here (a new body). */
    const GRACE_SEAT = (STATION.room.grace && STATION.room.grace.y) || 0.51;
    const GRACE_SITS = /^(gsofa|wsit|gcry|palmover|Sitting_Answering_Questions|rise)$/;
    { const S0 = at0('room', 'grace');
      cast.grace = mkPerson('p51grace', S0.x, S0.z, S0.ry, { y: 0, take: 'gsofa', centre: true,
        win: { gsofa: [0.25, 1.6, 7.5] }, skins: { 0: 'p51graceh' }, blobW: 0.75, blobD: 0.6,
        seat: { y: GRACE_SEAT, takes: GRACE_SITS, down: Object.assign({}, MASTER_DOWN, { hipOver: 0.1, edge: -9 }), rise: 'rise' },
        headDamp: { gsofa: [0.5, 'gsofa'] } });
      cast.grace.home = { x: S0.x, z: S0.z, ry: S0.ry, y: 0 }; }
    /* HER FEET FLAT WHEN SHE STANDS (PLAY, 27 Nov; MEASURED, tools/probes/e5c1lab.mjs: at the end of `rise` her ankles stand
       0.19 m up and her toes 0.03, against 0.125 and 0.028 standing in her Idle_3. The written take stands her up on tiptoe,
       and grounded by her toes she was held 7 cm up with her heels in the air for the whole of a stand-up: "floating"). The
       take's foot and toe turns are laid, in memory (her file untouched: v12.4), toward her own standing feet (Idle_3's first
       moment) by how far she has risen at each moment (the rise curve's own k: 0 seated, so a seated foot is the take's), and
       the rise is grounded again from the feet it now has (riseCurve, as her setting-up did). One change to the clip, so the
       films that stand her up or sit her down wear it too. Done once: a replay never builds again, and the clip is hers */
    const FEETFLAT = new WeakSet();
    function riseFeetFlat(P) {
      const A = P.acts.rise, I = P.acts.Idle_3, R = P.rise && P.rise.rise, skins = P.lv && P.lv[1];
      if (!A || !I || !R || !skins || !skins[0]) return;
      const clip = A.getClip(); if (FEETFLAT.has(clip)) return; FEETFLAT.add(clip);
      const ic = I.getClip(), qa = new THREE.Quaternion(), qb = new THREE.Quaternion(), done = [];
      for (const tr of clip.tracks) {
        const m = /(Left|Right)(Foot|ToeBase)\.quaternion$/.exec(tr.name); if (!m) continue;
        const it = ic.tracks.find(u => u.name.endsWith(m[1] + m[2] + '.quaternion')); if (!it) continue;
        qb.fromArray(it.values, 0);
        for (let i = 0; i < tr.times.length; i++) {
          const k = riseOff(R, tr.times[i], 'k'); if (!(k > 0)) continue;
          qa.fromArray(tr.values, i * 4); if (qa.dot(qb) < 0) qb.set(-qb.x, -qb.y, -qb.z, -qb.w);
          qa.slerp(qb, k).toArray(tr.values, i * 4); }
        done.push(m[1] + m[2]); }
      if (!done.length) return;
      const keep = Object.assign({}, P.w), kt = {}; for (const k in P.acts) kt[k] = P.acts[k].time;
      riseCurve(P, 'rise', skins);
      for (const k in P.acts) { P.acts[k].setEffectiveWeight(keep[k] || 0); P.acts[k].time = kt[k]; }
      personSettle(P); P.mixer.update(0);
      P.feetFlat = done;
    }
    whenReady(cast.grace, riseFeetFlat);
    /* MARCUS (the plan's 6; `p51marcus`, his full body `p51marcush`: CAST-3 is making him again without glasses at Chad's
       word, R7, under the same keys, so a new body drops in here unchanged) ON THE RATTAN CHAIR by her door (its cushion's
       top 0.42 m, measured), seated by his own posed skin; his rest the seated talk's upright first second, there and back
       slowly (Chair_Sit_Idle_M sinks his fingertips into his thighs: people/RECORD.md 8.4). A new body: met only here */
    const MARCUS_SEAT = (STATION.room.marcus && STATION.room.marcus.y) || 0.42;
    { const S0 = at0('room', 'marcus');
      cast.marcus = mkPerson('p51marcus', S0.x, S0.z, S0.ry, { y: 0, take: 'Sitting_Answering_Questions', centre: true,
        skins: { 0: 'p51marcush' }, win: { Sitting_Answering_Questions: [0.2, 1.0, 9] }, talk: 'Sitting_Answering_Questions', blobW: 0.8, blobD: 0.8,
        seat: { y: MARCUS_SEAT, takes: /^(Sit|Chair)/, down: Object.assign({}, MASTER_DOWN, { hipOver: 0.1, edge: -9 }) },
        shoulders: { Sitting_Answering_Questions: 0.5, Idle_3: 1 },
        headDamp: { Sitting_Answering_Questions: [0.3, 'Sitting_Answering_Questions'] } });
      cast.marcus.home = { x: S0.x, z: S0.z, ry: S0.ry, y: 0 }; }

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
      /* (a sitter's group stands on the FLOOR: seatDown lays the body on its seat, `seat.y` above it; a station's y is its seat's height) */
      standAt(cast.grace, st.grace ? Object.assign({}, st.grace, { y: 0 }) : null); standAt(cast.marcus, st.marcus ? Object.assign({}, st.marcus, { y: 0 }) : null);
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
