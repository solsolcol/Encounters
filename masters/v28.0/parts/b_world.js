
  function build(ctx) {
    const { THREE, scene, camera, yaw, kit, getState, startDecision, worldSfx, soundOff, makeHellNote } = ctx;

    /* (the v21.1 TDZ law: everything a builder or a frame asks for is declared up here, before anything is built) */
    const owned = [];
    let alive = true;
    const madeTex = [];
    const tex = (t) => { madeTex.push(t); return t; };
    /* the contract wants a note texture (the engine's note prop reads it at boot) */
    const noteTex = tex(makeHellNote ? makeHellNote() : new THREE.DataTexture(new Uint8Array([200, 170, 90, 255]), 1, 1));
    const mats = [];
    const M = (o) => { const m = new THREE.MeshStandardMaterial(o); mats.push(m); return m; };
    const wallNow = () => performance.now() / 1000;
    const world = new THREE.Group(); world.name = 'e4c5'; scene.add(world);

    /* ================================================================ THE WORLD · TODO-WORLD (the plan's 8; M6)
       THE SKELETON'S GROUND: one bare floor the size of the chapter's bounds, lit by the chapter's daylight (the dusk:
       no lamp is added on screen, v15.1). Nothing else is drawn, and nothing here is a place of the story.
       WHAT IS BUILT HERE (the plan's 8.1 and 8.2, and its 9.4 for the things, every one a real model):
         case two   the lift car (the opening film), the lift landing, about 24 m of open walkway with one turn and a
                    drain's grating at its edge, his gate between two posts, his court (5.2 m by 8.4 m, open to the sky:
                    two planters, a path, two wall lamps, the doors), and one L-shaped living and dining room (7.2 m
                    across) with its terrace doors. Dusk on the walkway; the court at dusk, then night for the cleansing.
         case three a room of its own, where Grandmaster Pho receives people in Singapore: about 4 m by 5 m in daylight,
                    a low table and a white cloth, a small altar shelf behind him, one window, a ceiling fan.
       When the places stand: `blockers()` (d_play.js) is their walls and furniture, each a column from the floor;
       `stage.keepIn` names the ground he is kept on, `stage.arrivals` where a scene change puts him down, and
       `stage.grounds` each later ground (the court at night, the receiving room), so walktest floods every one. */
    const FLOOR = { x0: DATA.bounds.minX, x1: DATA.bounds.maxX, z0: DATA.bounds.minZ, z1: DATA.bounds.maxZ };
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(FLOOR.x1 - FLOOR.x0, FLOOR.z1 - FLOOR.z0), M({ color: 0x8a8580, roughness: 0.95, metalness: 0 }));
    floor.name = 'floor'; floor.rotation.x = -Math.PI / 2;
    floor.position.set((FLOOR.x0 + FLOOR.x1) / 2, 0, (FLOOR.z0 + FLOOR.z1) / 2);
    floor.receiveShadow = true;
    world.add(floor);
    /* the solids he cannot walk through: none yet (the bounds hold him on the floor) */
    const solids = [];

    /* WHERE THE STAND-INS LIE along the floor, from the near end to the far (each at the height a mark is read at: v7.5).
       TODO-WORLD: each becomes a place of the story (the gate between its posts; the shoe cabinet, the planter's foot
       and the threshold; the court's middle; the table) */
    const SPOT = {
      gate:   { x: 0, y: 1.4, z: 3.2 },
      stain1: { x: -2.4, y: 1.0, z: 0.8 },
      stain2: { x: 0, y: 1.0, z: -0.4 },
      stain3: { x: 2.4, y: 1.0, z: 0.8 },
      court:  { x: 0, y: 1.4, z: -2.4 },
      pieces: { x: 0, y: 1.0, z: -4.6 }
    };
