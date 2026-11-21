    /* ================================================================ THE PEOPLE: chapter 3's machinery, as chapter 4 copied
       it and mended it (its c_people.js and its EDITS: one skeleton and several skins a person, the takes at weights, the
       films' poses by the clock, the feet set down by their own lowest contact, the head's and the shoulders' restraint,
       the hands laid by numbers, the levels by the lens; and a look as a neck makes it, R86 and R87), and its posture
       laws for a body sat or stood up straight (c_scast.js: Grandmaster Pho's, R42, R64, R76, R77, R88). Every one of its
       laws was learned on those chapters' bodies; see its own notes. The one change (assemble.py EDITS): the bodies this
       chapter made are keyed p5. The ground under every one is this chapter's floor (flatGround). */
//@@COPY 1657-3556 :: /* ================================================================ THE PEOPLE (the plan's §3.3, §6.1; the tracker's §5)
//@@COPY 5213-5435 :: /* A BODY SAT OR STOOD UP STRAIGHT (o.upright; R42, Chad, 18 Nov 2026: "From the very start of the intro cutscene to the

    /* ---------------------------------------------- the ground: one level everywhere he walks (the walkway, the court,
       the house and case three's room are each flat, and at one height: the walk test floods them whole) */
    function flatGround(x, z) { return 0; }

    /* ================================================================ THE CAST THE WORLD STANDS (the plan's 9.1;
       masters/v28.0/people/RECORD.md). MR KOH and JUN, each made here end to end, at three levels: the near body with
       his takes, the mid body beyond the second step, and every triangle of him within 2.2 m (v26.5: the story turns on
       both, and each is spoken to face to face). Each stands at his station for the phase (STATION), resting in his
       stand; each talks in his own take (headturn to be measured before a film directs it). Grandmaster Pho, Ton and the
       collector are cast by their builders (the play, the fight, the films): their stations are marked in STATION. */
    const cast = {};
    cast.koh = mkPerson('p5koh', STATION.hunt.koh.x, STATION.hunt.koh.z, STATION.hunt.koh.ry, { take: 'Idle_3', phase: 0.35,
      talk: 'Talk_with_Hands_Open', skins: { 0: 'p5kohh', 2: 'p5kohm' }, blobW: 0.85, blobD: 0.65 });
    cast.jun = mkPerson('p5jun', STATION.walk.jun.x, STATION.walk.jun.z, STATION.walk.jun.ry, { take: 'Idle_3', phase: 0.6,
      talk: 'Talk_with_Right_Hand_Open', skins: { 0: 'p5junh', 2: 'p5junm' }, blobW: 0.8, blobD: 0.6 });

    /* the collector's place at the table, MARKED (his rig is being mended: people/RECORD.md 3): an invisible stand-in
       of no shape, the handle a film or the play finds him by, until his body is cast */
    const collectorMark = new THREE.Object3D(); collectorMark.name = 'collector (marked)';
    collectorMark.position.set(STATION.table.collector.x, 0, STATION.table.collector.z); collectorMark.rotation.y = STATION.table.collector.ry; world.add(collectorMark);

    /* ================================================================ THE WORLD'S PHASES (the hooks: c_story.js book()
       and applyPhase() call worldPhase, d_play.js's frame calls worldFrame, its reset worldReset)
       The gate: shut on the walkway (he presses at it: 4.1), open from the hunt on (Mr Koh opens it in his film: 4.2), shut
       again for the cleansing (the court is closed; the camera never passes it: 5.6), and as it is when he is in case
       three's room. His door: shut on the walkway, open after. The court's lamps: lit from the cleansing (night). Each
       change is made on a phase's turn, which a film or a Continue's curtain covers (v24.12). */
    let worldAt = null;
    const blockOf = (solid) => (S && S.blockers) ? S.blockers[solids.indexOf(solid)] : null;
    const block0 = new Map();
    function blockOn(solid, on) {
      const b = blockOf(solid); if (!b) return;
      if (!block0.has(solid)) block0.set(solid, b.clone());
      if (on) b.copy(block0.get(solid)); else b.makeEmpty();
    }
    /* (feetscan, LEVEL=1, at every phase: a foot read 1.7 to 1.8 cm under its "floor", and that floor was each body's own
       contact shadow (a flat card 1.4 cm up, which the probe's ray down meets first): lifted 1.2 cm, the reading did not
       move, which proved it. Against the floor itself the soles stand 0.3 to 0.4 cm into it, as the grounding sets them
       (GROUND_SOLE): left as they are) */
    const FEET_LIFT = 0;
    function standAt(P, st) {
      if (!P) return;
      if (!st) { P.hidden = true; P.group.visible = false; return; }
      P.hidden = false; put(P, st.x, st.z, st.ry, FEET_LIFT);
      if (P.ready) P.group.visible = true;
    }
    function worldPhase(p, place = true) {
      const st = STATION[p] || STATION.walk; worldAt = p;
      const shut = p === 'walk' || p === 'fight';
      gateOpen(shut ? 0 : 1); blockOn(gateShut, shut); blockOn(gateOpenLeaf, !shut);
      doorOpen(p === 'walk' ? 0 : 1);
      courtLamps(p === 'fight' ? 1 : 0);
      liftDoors(0);
      standAt(cast.koh, st.koh); standAt(cast.jun, st.jun);
      if (place && st.at && p !== 'ask') { yaw.position.set(st.at.x, EYE, st.at.z); yaw.rotation.y = st.at.ry; pitch.rotation.x = -0.04; }
    }
    function worldFrame(wdt, st) {
      peopleTick(wdt, st !== 'cine');
      if (st !== 'cine') { peopleLevels(); lodTick(); }
    }
    function worldReset() { worldAt = null; for (const L of lights) lamp(lights.indexOf(L), 1); worldPhase('walk', false); }
    /* ready only once every model is unpacked and every body that has landed is set up: all of it under the curtain
       (chapter 4's R51; v14.15) */
    function worldReady() { return parsePend === 0 && people.every(P => P.ready || !have(P.key)); }
    /* the sky stands over him: over case three's room when he is in it (240 m off: the dome is 150 m), else the origin */
    function worldSkyAt() { return yaw.position.z > 120 ? { x: ROOM.cx, z: ROOM.cz } : null; }

    /* WHERE A SCENE CHANGE PUTS HIM DOWN (walktest floods from each): the hunt's start in his living room (the devotee's
       film leaves him there), and his seat in case three's room (the collector's film) */
    const ARRIVALS = [
      { what: 'the living room, where the devotee\'s film leaves him', x: STATION.hunt.at.x, z: STATION.hunt.at.z },
      { what: 'case three\'s room, where the collector\'s film seats him', x: STATION.table.at.x, z: STATION.table.at.z }
    ];
    /* THE GROUND HE IS KEPT ON (stage.keepIn): the walkway, his court and his two rooms; and case three's room */
    const KEEP = { what: 'the walkway, his court and home, and case three\'s room', boxes: [
      { minX: WALK.x0, maxX: WALK.edge, minZ: WALK.z0, maxZ: WALK.z1 },
      { minX: WALK.endX, maxX: WALK.x0, minZ: WALK.z0, maxZ: WALK.turnZ + 0.1 },
      { minX: COURT.x0, maxX: COURT.x1, minZ: COURT.z0, maxZ: HOUSE.face },
      { minX: LIVING.x0, maxX: LIVING.x1, minZ: HOUSE.face - 0.2, maxZ: LIVING.z1 },
      { minX: DINING.x0, maxX: DINING.x1, minZ: DINING.z0, maxZ: DINING.z1 },
      { minX: ROOM.x0, maxX: ROOM.x1, minZ: ROOM.z0, maxZ: ROOM.z1 } ] };
    /* EACH LATER GROUND, walked by the walk test (v26.18): the home with its gate open (the hunt), the court shut for the
       cleansing, and case three's room. Each put in place as a Continue lands (the phase set) */
    const GROUNDS = [
      { what: 'the home with its gate open (the hunt)', enter: () => { if (S && S.setPhase) S.setPhase('hunt'); }, ready: () => worldAt === 'hunt' && worldReady() },
      { what: 'the court shut for the cleansing', enter: () => { if (S && S.setPhase) S.setPhase('fight'); }, ready: () => worldAt === 'fight' && worldReady() },
      { what: 'case three\'s room (the table)', enter: () => { if (S && S.setPhase) S.setPhase('table'); }, ready: () => worldAt === 'table' && worldReady() }
    ];

    /* EACH THING TO PRESS IS TRIED BY THE WALK TEST IN THE GROUND IT BELONGS TO (v26.18 `ground`): the stains in the hunt's
       ground (the gate open), the cleansing in the court shut, the pieces in case three's room; the gate on the first
       frame. d_play.js hands the stage its hotspots through this (a hotspot the play adds later is tagged by its id) */
    const GROUND_OF = { stain1: GROUNDS[0].what, stain2: GROUNDS[0].what, stain3: GROUNDS[0].what, armchair: GROUNDS[0].what,
                        cleanse: GROUNDS[1].what, pieces: GROUNDS[2].what };
    function worldHotspots(list) { for (const h of list) if (h && GROUND_OF[h.id] && !h.ground) h.ground = GROUND_OF[h.id]; return list; }

    /* WHERE THE SKELETON'S STAND-INS LIE (each at the height a mark is read at: v7.5), now the story's own places: the
       gate between its posts (from the walkway), the floor under the shoe cabinet, the left planter's foot, the threshold
       between the gate posts, the court's middle, and the table's pieces */
    const SPOT = {
      gate:   { x: GATE.x, y: 1.4, z: WALK.turnZ - 0.7 },
      stain1: { x: SHOE.x, y: 0.9, z: SHOE.z + 0.55 },
      stain2: { x: COURT.x1 - 0.95, y: 0.9, z: PLANT_Z },
      stain3: { x: GATE.x, y: 0.9, z: WALK.turnZ + 0.35 },
      court:  { x: GATE.x, y: 1.4, z: -9.6 },
      pieces: { x: ROOM.cx, y: 0.9, z: ROOM.cz }
    };
    /* (the stage's plan handle: the places a probe or a builder reads) */
    const FLOOR = { WALK, COURT, GATE, HOUSE, LIVING, DINING, ROOM, LIFT, STATION, RITE, DRAIN: DRAIN_SPOT, SEAT, things, setDown, lamp, courtLamps, liftDoors, gateOpen, doorOpen, cast };

    /* ====================================================== THE DRAWN SURFACES' HELPERS (chapter 3's own, as chapter 4's) */
//@@COPY 8904-8904 :: function rng(seed)
//@@COPY 8905-8909 :: function done(THREE, c, rep) {
//@@COPY 8910-8910 :: function noMip(THREE, t)
