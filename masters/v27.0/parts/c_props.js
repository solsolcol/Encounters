    /* ================================================================ HER FLAT'S THINGS (M5; the build sheet's 30 things)
       Every one a real model (a checked picture on white, Meshy at its highest and its own remesh, tools/prepmeshy.mjs:
       masters/v27.0/props/TABLE.txt), prepped in real metres with its origin on its base's middle and its front along +z,
       so a place here is a place and `ry` turns its front. A thing stands only once its file has landed (stand() leaves an
       empty group until then); its collision is a column from the floor, its FOOTPRINT written here (the model's own
       extent measured at prep, `foot` [width, depth] before its turn), so the blockers stand before the model does
       (v24.0: they must be in the array before build() returns).
       The living room: her altar on the far wall facing the door; her chair before it, Grandmaster Pho's stool at her
       right and his bowl at its foot; the sofa under the corridor window looking into the room; the TV on the left wall;
       the coffee table, an armchair, a standing fan. Her room behind its folded partition: her bed with its rail, the
       commode. The dining room: the table with her hospital folder, the display cabinet with her old photograph. The
       kitchen: the fridge, the laundry out of the window. Outside: the gate, the shoe rack, a tulsi in its pot, the
       mango leaves over the door. (Positions are the first layout: each is set again once its model is measured and
       photographed in place, M5.) */
    const PROPS = [
      // key            x      y      z      ry              foot [w, d]   (what)
      ['w4wheelchair', CHAIR.x, 0, CHAIR.z, 0,              [0.65, 1.05]],  // her chair, facing her altar
      ['w4stool',      STOOL.x, 0, STOOL.z, -0.4,           [0.40, 0.40]],  // Grandmaster Pho's, at her right
      ['w4bigbowl',    BOWL.x, 0, BOWL.z, 0,                null],          // his bowl on the floor: he dips here
      ['w4prayershelf', ALTAR.x, 1.15, ALTAR.z - 0.16, Math.PI, null],      // her altar on the far wall (its base at 1.15: its shelf at 1.5)
      ['w4altartray',  ALTAR.x, 0, ALTAR.z - 0.42, Math.PI, null],          // the brass tray before it, on the floor
      ['w4vilakku',    ALTAR.x + 0.02, 0.03, ALTAR.z - 0.42, 0, null],      // the kuthu vilakku on the tray (lit by Mala in the blessing)
      ['w4frameport',  0.78, 1.25, ALTAR.z - 0.03, Math.PI, null],          // Appa's photograph, on the wall at the altar's right
      ['w4garland',    0.78, 1.63, ALTAR.z - 0.07, Math.PI, null],          // its garland, fresh
      ['w4sofa',       1.72, 0, FL.face + 0.45, 0,          [1.90, 0.85]],  // under the corridor window, looking in
      ['w4coffee',     1.72, 0, 1.62, 0,                    [1.10, 0.55]],
      ['w4pilltray',   1.95, 0.42, 1.62, 0.3,               null],          // her medicine tray on the coffee table (its height set once the table is measured)
      ['w4armchair',   2.42, 0, 2.62, -1.95,                [0.85, 0.80]],
      ['w4standfan',   2.62, 0, 1.05, -2.4,                 [0.45, 0.45]],
      ['w4tvconsole',  ROOMS.living.x0 + 0.24, 0, 1.85, Math.PI / 2, [1.50, 0.45]],
      ['w4clock',      ROOMS.living.x0 + 0.02, 2.02, 1.85, Math.PI / 2, null],
      ['w4hugger',     1.0, FL.ceil - 0.02, 2.05, 0,        null],          // the living room's ceiling fan (turned in the frame)
      ['w4tubelight',  1.0, FL.ceil - 0.01, 3.65, 0,        null],          // the tube that dies in the blessing
      ['w4hugger',     4.7, FL.ceil - 0.02, 1.8, 0,         null],          // her room's
      ['w4tubelight',  4.8, FL.ceil - 0.01, 6.0, Math.PI / 2, null],        // the dining room's
      ['w4phonetable', 4.45, 0, ROOMS.passage.z0 + 0.2, 0,  [0.50, 0.38]],  // in the passage, against her room's back wall
      // her room
      ['w4bed',        5.95, 0, 1.75, -Math.PI / 2,          [1.00, 2.00]],
      ['w4commode',    4.95, 0, 0.75, 0.2,                  [0.55, 0.55]],
      // the dining room and the kitchen
      ['w4cabinet',    ROOMS.dining.x0 + 0.24, 0, 6.15, Math.PI / 2, [1.00, 0.42]],
      ['w4dintable',   4.85, 0, 6.65, Math.PI / 2,          [1.20, 0.80]],
      ['w4dinechair',  4.25, 0, 6.35, Math.PI / 2,          [0.45, 0.45]],
      ['w4dinechair',  4.25, 0, 6.95, Math.PI / 2,          [0.45, 0.45]],
      ['w4dinechair',  5.45, 0, 6.35, -Math.PI / 2,         [0.45, 0.45]],
      ['w4dinechair',  5.45, 0, 6.95, -Math.PI / 2,         [0.45, 0.45]],
      ['w4folder',     4.8, 0.77, 6.4, 0.25,                null],          // her hospital letters, on the table
      ['w4fridge',     ROOMS.dining.x1 - 0.36, 0, 8.7, -Math.PI / 2, [0.60, 0.65]],
      ['w4poles',      5.55, 1.15, FL.z1 + 0.55, 0,         null],          // the laundry out of the kitchen window
      // outside her door
      ['w4gate',       0, FL.corr, -0.09, 0,                null],          // the steel grille gate, shut behind them in play
      ['w4thoranam',   0, 2.16, -0.03, 0,                   null],          // mango leaves over the door
      ['w4shoerack',   -1.55, FL.corr, -0.22, Math.PI,      null],
      ['w4tulsi',      1.35, FL.corr, -1.45, 0,             null]
    ];
    const things = {};
    for (const [key, x, y, z, ry, foot] of PROPS) {
      const g = stand(key, x, y, z, ry);
      (things[key] = things[key] || []).push(g);
      /* (the footprint as a column, turned with the thing: blockers() takes its box in the world, which holds it whole) */
      if (foot) solidBox(foot[0], 1.2, foot[1], x, 0.6, z, ry);
    }
