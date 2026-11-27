  function build(ctx) {
    /* ================================================================ THE MACHINERY, COPIED (masters/v29.0/assemble.py
       pins episode 4 chapter 5's file by its sha1; chapters are copied, not bundled: v6.11). Its build's head: the engine's
       kit taken from ctx, the TDZ law's declarations, the speed-ups' switches (v26.11), the small helpers */
//@@COPY 617-759 :: const { THREE, GLTFLoader, cloneSkinned, scene, camera, yaw, pitch, LOW, kit, cnv, loadImageTexture,

    /* ================================================================ THE PLACES · TODO-WORLD (the plan's 5; M5)
       THE SKELETON'S PLACES: plain shells of floor and walls in the chapter's light, nothing of the story's dressing. Units
       metres, y up. Three pocket worlds, each past the lens's far plane (160 m) from the others, so none is ever drawn from
       another (v8.9):
         HER FRONT ROOM at the origin (the plan's 5.3: about 5.5 x 8 m, the upper floor of a shophouse): the tall windows on
                   its +x wall over the street, the front door in its -x wall off the stair landing; the low table in the
                   middle, Grandmaster Pho on a cushion at it facing the door side, Grace on the sofa across from him,
                   Marcus on the rattan chair by the door; he kneels at Pho's right, by the windows
         THE SHOPHOUSE ROW AND THE STAIR 200 m along -x (the plan's 5.1 and 5.2; the opening film's only)
         HIS FLAT 200 m along +x (the plan's 5.4): one living and dining room with its glass on +z, the dining table where
                   his phone charges (the decision's anchor), the bedroom at the +x end, the altar on the -x wall
       WHAT IS BUILT HERE (WORLD): every place of the plan's 5 and its look beat by beat (its 4.3), every thing a real model
       (the plan's 7), the reflection behind her window's glass (its 12), the city outside his glass as built slabs. When
       the places stand, `blockers()` (d_play.js) is their walls and furniture, each a column from the floor; `stage.keepIn`
       the ground he is kept on, `stage.arrivals` where a scene change puts him down, `stage.grounds` each later ground. */
    const ROOM = { x0: -2.75, x1: 2.75, z0: -4.0, z1: 4.0, ceil: 3.4, cx: 0, cz: 0 };
    const STREET = { x0: -212.0, x1: -188.0, z0: -6.0, z1: 6.0, cx: -200.0, cz: 0 };
    const FLAT = { x0: 194.0, x1: 206.0, z0: -4.5, z1: 4.5, ceil: 2.8, cx: 200.0, cz: 0 };
    const EYE = 1.62;
    const world = new THREE.Group(); world.name = 'e5c1'; scene.add(world);
    const solids = [];
    const matProxy = M({ color: 0x8d7a66, roughness: 0.9 });
    /* a thing he cannot walk through: a box, never drawn (collision is a column from the floor: v5.03) */
    const solidBox = (w, h, d, x, y, z, ry = 0) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), matProxy);
      m.position.set(x, y, z); m.rotation.y = ry; m.visible = false; world.add(m); solids.push(m); return m;
    };
    /* a solid by its two corners on the floor */
    const solidXZ = (x0, z0, x1, z1, h = 2.2) => solidBox(Math.abs(x1 - x0), h, Math.abs(z1 - z0), (x0 + x1) / 2, h / 2, (z0 + z1) / 2);

    /* ------------------------------------------------- one parse per asset, many of one, a model stood (chapter 3's own,
       as chapters 4 and 5 copied them), and the merged pieces of what never moves */
//@@COPY 808-1186 :: function parseOnce(key) {

    /* ================================================================ THE PEOPLE: chapter 3's machinery, as chapters 4 and
       5 copied it and mended it (one skeleton and several skins a person, the takes at weights, the films' poses by the
       clock, the feet set down by their own lowest contact, the head's and the shoulders' restraint, the hands laid by
       numbers, the levels by the lens), and its posture laws for a body sat or stood up straight. Every one of its laws
       was learned on those chapters' bodies; see its own notes. The one change (assemble.py EDITS): the bodies drawn
       without mipmaps are this chapter's (p51) and its stand-ins' as their own chapters drew them. */
//@@COPY 2355-4477 :: /* ================================================================ THE PEOPLE (the plan's §3.3, §6.1; the tracker's §5)

    /* ---------------------------------------------- the ground: one level everywhere he walks (her room and his flat are
       each flat, and at one height: the walk test floods them whole). TODO-WORLD: a step or a raised floor goes here */
    function flatGround(x, z) { return 0; }

    /* ---------------------------------------------- the shells: a floor, walls of the room's height, a ceiling (seen from
       inside only), each in a plain painted colour (no lamp is added on screen: v15.1) */
    const shellMats = { floor: M({ color: 0x7a5a40, roughness: 0.85 }), wall: M({ color: 0xd8ccb8, roughness: 0.95 }),
                        ceil: M({ color: 0xe8e0d4, roughness: 1.0, side: THREE.BackSide }), street: M({ color: 0x5a5a5e, roughness: 0.95 }),
                        tile: M({ color: 0x9a7e64, roughness: 0.9 }), dark: M({ color: 0x3a3430, roughness: 0.9 }),
                        flatFloor: M({ color: 0xb8b0a4, roughness: 0.7 }), flatWall: M({ color: 0xe4e2de, roughness: 0.95 }),
                        glass: M({ color: 0x1a2236, roughness: 0.2, metalness: 0.0 }), cloth: M({ color: 0xf4f2ec, roughness: 0.95 }) };
    function slab(mat, w, h, d, x, y, z, solid) {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat); m.position.set(x, y, z); world.add(m);
      if (solid) solids.push(m);
      return m;
    }
    function shell(R, floorMat, wallMat, opts = {}) {
      const w = R.x1 - R.x0, d = R.z1 - R.z0, t = 0.12, h = R.ceil || 3.0;
      const f = new THREE.Mesh(new THREE.PlaneGeometry(w, d), floorMat); f.rotation.x = -Math.PI / 2; f.position.set((R.x0 + R.x1) / 2, 0, (R.z0 + R.z1) / 2); world.add(f);
      if (!opts.open) {
        slab(wallMat, w + 2 * t, h, t, (R.x0 + R.x1) / 2, h / 2, R.z0 - t / 2, true);
        slab(wallMat, w + 2 * t, h, t, (R.x0 + R.x1) / 2, h / 2, R.z1 + t / 2, true);
        slab(opts.wallX0 || wallMat, t, h, d, R.x0 - t / 2, h / 2, (R.z0 + R.z1) / 2, true);
        slab(opts.wallX1 || wallMat, t, h, d, R.x1 + t / 2, h / 2, (R.z0 + R.z1) / 2, true);
        const c = new THREE.Mesh(new THREE.PlaneGeometry(w, d), shellMats.ceil); c.rotation.x = -Math.PI / 2; c.position.set((R.x0 + R.x1) / 2, h, (R.z0 + R.z1) / 2); world.add(c);
      }
    }
    /* HER FRONT ROOM: the windows' wall drawn dark (the night behind the glass), the low table under its white cloth, the
       sofa, the rattan chair (plain blocks for the stand-in only: each becomes a real model of the plan's 7) */
    shell(ROOM, shellMats.floor, shellMats.wall, { wallX1: shellMats.glass });
    const ROOMTHINGS = {
      table: { x: 0, z: 0, w: 1.1, d: 0.6, h: 0.42 },
      sofa:  { x: 0, z: -1.45, w: 1.6, d: 0.8, h: 0.45 },
      chair: { x: -1.75, z: -1.9, w: 0.6, d: 0.6, h: 0.45 },
      door:  { x: ROOM.x0, z: -2.6 }
    };
    { const T = ROOMTHINGS.table; slab(shellMats.dark, T.w, T.h, T.d, T.x, T.h / 2, T.z, true); slab(shellMats.cloth, T.w + 0.06, 0.01, T.d + 0.06, T.x, T.h + 0.005, T.z); }
    { const T = ROOMTHINGS.sofa; slab(shellMats.dark, T.w, T.h, T.d, T.x, T.h / 2, T.z, true); }
    { const T = ROOMTHINGS.chair; slab(shellMats.tile, T.w, T.h, T.d, T.x, T.h / 2, T.z, true); }
    /* THE SHOPHOUSE ROW: the five-foot way's floor and a row's face (the opening film's crane: the plan's 9.1) */
    shell(STREET, shellMats.street, shellMats.wall, { open: true });
    slab(shellMats.wall, STREET.x1 - STREET.x0, 7.5, 0.3, STREET.cx, 3.75, STREET.z0, false);
    /* HIS FLAT: the glass on +z, the dining table (his phone's charger: the decision's anchor), his bed in the bedroom end */
    shell(FLAT, shellMats.flatFloor, shellMats.flatWall);
    const FLATTHINGS = {
      dining: { x: DATA.shrine.x, z: DATA.shrine.z, w: 1.4, d: 0.8, h: 0.75 },
      bed:    { x: 204.4, z: 2.6, w: 1.6, d: 2.0, h: 0.5 },
      altar:  { x: FLAT.x0 + 0.25, z: 0.8, w: 0.45, d: 0.9, h: 0.9 },
      door:   { x: FLAT.x0, z: -3.6 }
    };
    { const T = FLATTHINGS.dining; slab(shellMats.dark, T.w, T.h, T.d, T.x, T.h / 2, T.z, true); }
    { const T = FLATTHINGS.bed; slab(shellMats.cloth, T.w, T.h, T.d, T.x, T.h / 2, T.z, true); }
    { const T = FLATTHINGS.altar; slab(shellMats.dark, T.w, T.h, T.d, T.x, T.h / 2, T.z, true); }

    /* ================================================================ WHERE EACH PHASE PUTS HIM AND THE PEOPLE (the
       plan's 8: each phase a save, a Continue lands at its start). `at` is where he stands at the phase's start; a
       person's station is where that person is while the phase is played (TODO-WORLD: from the places as built) */
    const STATION = {
      room:     { at: { x: 0.95, z: 0.55, ry: 0.35 },
                  pho: { x: 0, z: 0.7, ry: Math.PI }, grace: { x: 0, z: -1.4, ry: 0 }, marcus: { x: -1.75, z: -1.9, ry: 0.9 } },
      night:    { at: { x: 203.4, z: 2.6, ry: Math.PI / 2 } }
    };
    STATION.breaking = STATION.room;
    STATION.ask = { at: { x: DATA.shrine.x + 0.9, z: DATA.shrine.z, ry: Math.PI / 2 } };

    /* ====================================================== THE DRAWN SURFACES' HELPERS (chapter 3's own, as chapters 4
       and 5 have them) */
//@@COPY 4604-4610 :: function rng(seed)
