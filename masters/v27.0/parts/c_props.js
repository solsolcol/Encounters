    /* ================================================================ HER FLAT'S THINGS (M5; the build sheet's 30 things)
       Every one a real model (a checked picture on white, Meshy at its highest and its own remesh, tools/prepmeshy.mjs:
       masters/v27.0/props/TABLE.txt), prepped in real metres with its origin on its base's middle and its front along +z,
       so a place here is a place and `ry` turns its front. A thing stands only once its file has landed (stand() leaves an
       empty group until then); its collision is a column from the floor, its FOOTPRINT the model's own extent as measured
       in its file (18 Nov: `w`, `d` below, before its turn), so the blockers stand before the model does (v24.0: they must
       be in the array before build() returns).
       The living room: her altar on the far wall facing the door; her chair before it, Grandmaster Pho's stool at her
       right and his bowl at its foot; the sofa under the corridor window looking into the room; the TV on the left wall;
       the coffee table, an armchair, a standing fan. Her room behind its folded partition: her bed with its rail, the
       commode. The dining room: the table with her hospital folder, the display cabinet. The kitchen: the fridge, the
       laundry out of the window. Outside: the gate, the shoe rack, a tulsi in its pot, the mango leaves over the door.
       A thing whose height a place depends on is placed by its measured size: a ceiling's fan and tube HANG from it (their
       origin is their lowest point, so each stands its own height under the ceiling), the dining table is drawn at a dining
       table's 0.75 m (its file's 0.571 is a squat generation: its height scaled, nothing else), and what lies on a table
       lies on that table's measured top. */
    const TOP = { coffee: 0.444, dintable: 0.75 };            // the coffee table's top (its file), the dining table's (drawn)
    /* HOW EACH THING TAKES THE LIGHT (18 Nov, photographed: the altar's shelves drew WHITE). A generator paints every
       model as a metal-roughness sheet whose roughness runs down to 0, and stand() lifts the reflections of anything
       with a metal sheet three-fold (bronzeLift: for brass and gold); a varnished shelf a little below the eye, seen at a
       grazing angle, then mirrors the room's light whole. So a thing that is not metal is drawn as what it is: its metal
       sheet dropped (a non-metal), its roughness one even finish (varnished timber 0.55, painted or plastic 0.5, cloth
       and paper 0.85), reflections at their plain strength (the house's way for a generated piece: chapter 3's hall,
       b_world2.js); the metal ones keep their sheets, the brass at the full lift, the painted steel at half.
       (Measured from the files' own sheets, 18 Nov: the brass lamp's and the bowls' metal 0.7 to 0.9; the wheelchair's,
       the tubes', the rack's and the gate's 0.16 to 0.46; every piece of furniture under 0.05.) */
    const MATTE = { wood: 0.55, paint: 0.5, cloth: 0.85 };
    const matte = (r) => (m) => m.traverse(q => { if (!q.isMesh) return; for (const mt of [].concat(q.material)) {
      mt.metalnessMap = null; mt.metalness = 0; mt.roughnessMap = null; mt.roughness = r; mt.envMapIntensity = 1; mt.needsUpdate = true; } });
    const LOOK = {
      /* (18 Nov, photographed: her shrine's shelves drew pale at the eye's grazing angle even matte at 0.55: its varnish
         is a softer one, its reflection halved) */
      w4prayershelf: { done: (m) => { matte(0.78)(m); m.traverse(q => { if (q.isMesh) for (const mt of [].concat(q.material)) mt.envMapIntensity = 0.5; }); } }, w4frameport: { done: matte(MATTE.wood) }, w4sofa: { done: matte(MATTE.cloth) },
      w4armchair: { done: matte(MATTE.cloth) }, w4coffee: { done: matte(MATTE.wood) }, w4tvconsole: { done: matte(MATTE.wood) },
      w4cabinet: { done: matte(MATTE.wood) }, w4dintable: { done: matte(MATTE.wood) }, w4dinechair: { done: matte(MATTE.wood) },
      w4folder: { done: matte(MATTE.cloth) }, w4fridge: { done: matte(MATTE.paint) }, w4stool: { done: matte(MATTE.paint) },
      w4hugger: { done: matte(MATTE.paint) }, w4tulsi: { done: matte(MATTE.cloth) }, w4clock: { done: matte(MATTE.paint) },
      w4phonetable: { done: matte(MATTE.wood) }, w4bed: { done: matte(MATTE.cloth) }, w4commode: { done: matte(MATTE.paint) },
      w4garland: { done: matte(MATTE.cloth) }, w4thoranam: { done: matte(MATTE.cloth) }, w4poles: { done: matte(MATTE.cloth) },
      w4doorleaf: { done: matte(MATTE.wood) },
      w4wheelchair: { lift: 1.5 }, w4gate: { lift: 1.5 }, w4shoerack: { lift: 1.5 }, w4standfan: { lift: 1.5 },
      w4tubelight: { lift: 1.5 }, w4pilltray: { lift: 1.5 }
      /* (the brass: w4vilakku, w4bigbowl, w4waterbowl, w4altartray, at stand()'s own lift of 3) */
    };
    const DINE_SY = 0.75 / 0.571;                             // the dining table's height drawn: 0.75 m from its file's 0.571
    const PROPS = [
      // key            x       y      z      ry               foot [w, d] (the file's own extent)   (what)
      ['w4wheelchair', CHAIR.x, 0, CHAIR.z, CHAIR.ry,          [0.65, 1.00]],   // her chair, facing her altar
      ['w4stool',      STOOL.x, 0, STOOL.z, -0.4,             [0.40, 0.39]],   // Grandmaster Pho's, at her left (+x: she faces +z)
      ['w4bigbowl',    BOWL.x, 0, BOWL.z, 0,                  [0.33, 0.33]],   // his bowl on the floor: he dips here
      // her altar: a wall-mounted cabinet (the research's "floating unit", [32]), its back on the wall, its base at 1.15
      ['w4prayershelf', ALTAR.x, 1.15, ROOMS.living.z1 - 0.226 - 0.004, Math.PI, null],
      /* (18 Nov, measured and photographed: the tray is a whole puja set on a plate, 0.25 m across and 0.15 high, its bell,
         its small lamp, its kalasam pot, its camphor holder and its incense: the tall kuthu vilakku stands beside it on the
         floor, not on it, where it was set sunk 11 cm into the pot) */
      ['w4altartray',  ALTAR.x - 0.30, 0, ALTAR.z - 0.36, Math.PI, null],      // her puja tray before the altar, on the floor
      ['w4vilakku',    VILAKKU.x, 0, VILAKKU.z, 0,             null],         // the kuthu vilakku at the shrine's right end (Mala kneels to light it)
      // Appa's photograph on the wall at the altar's right (its back on the wall), and its garland
      ['w4frameport',  0.62, 1.30, ROOMS.living.z1 - 0.011 - 0.004, Math.PI, null],
      /* (the garland is a V of jasmine and marigold 0.45 wide and 0.54 tall, its two ends at its top: hung at the frame's
         top corners, 1.71 up, before its glass, its tassel below the frame) */
      ['w4garland',    0.62, 1.71 - 0.542, ROOMS.living.z1 - 0.004 - 0.022 - 0.035 - 0.002, Math.PI, null],
      // the sofa under the corridor window, its back to the front wall; the coffee table before it; the armchair at the
      // room's right, facing the TV across it; a standing fan between them
      ['w4sofa',       1.72, 0, FL.face + 0.456 + 0.01, 0,     [1.90, 0.91]],
      ['w4coffee',     1.72, 0, 1.70, 0,                      [1.10, 0.77]],
      ['w4pilltray',   1.95, TOP.coffee, 1.70, 0.3,           null],           // her medicine tray on the coffee table
      ['w4armchair',   2.17, 0, 2.78, -Math.PI / 2,           [0.85, 1.26]],
      /* (R45, Chad, 18 Nov evening: "the indian man model when standing and speaking, clips into another object": Ravi
         stands at (2.62, 2.02) and the fan stood 0.49 m behind his left shoulder, its head at his own height, where his
         talk's hands and sway go; it stands 0.94 m from him now, still behind him by the window, clear of the right wall) */
      ['w4standfan',   2.45, 0, 1.10, -2.4,                   [0.57, 0.45]],
      // the TV on the left wall facing into the room, between the main door's open leaf and bedroom 3's door
      ['w4tvconsole',  ROOMS.living.x0 + 0.25 + 0.005, 0, 1.92, Math.PI / 2, [1.50, 0.50]],
      ['w4clock',      ROOMS.living.x0 + 0.02, 2.05, 1.92, Math.PI / 2, null],
      // the ceilings': a hugger fan over the living room and one in her room (turned in the frame), and the tubes
      ['w4hugger',     1.0, FL.ceil - 0.222 - 0.004, 2.40, 0, null],
      ['w4hugger',     4.7, FL.ceil - 0.222 - 0.004, 1.80, 0, null],
      ['w4tubelight',  0.2, FL.ceil - 0.109 - 0.003, 3.60, 0, null],           // the tube that dies in the blessing
      ['w4tubelight',  4.85, FL.ceil - 0.109 - 0.003, 6.65, Math.PI / 2, null], // the dining room's
      ['w4phonetable', 4.45, 0, ROOMS.passage.z0 + 0.12 + 0.20, 0, [0.50, 0.38]], // in the passage, against her room's back wall
      // her room
      ['w4bed',        5.95, 0, 1.75, -Math.PI / 2,           [1.00, 2.00]],
      ['w4commode',    4.95, 0, 0.75, 0.2,                    [0.55, 0.55]],
      // the dining room and the kitchen
      ['w4cabinet',    ROOMS.dining.x0 + 0.28 + 0.005, 0, 6.15, Math.PI / 2, [0.86, 0.56]],
      ['w4dintable',   4.85, 0, 6.65, Math.PI / 2,            [1.20, 0.85]],
      ['w4dinechair',  4.22, 0, 6.35, Math.PI / 2,            [0.48, 0.64]],
      ['w4dinechair',  4.22, 0, 6.95, Math.PI / 2,            [0.48, 0.64]],
      ['w4dinechair',  5.48, 0, 6.35, -Math.PI / 2,           [0.48, 0.64]],
      ['w4dinechair',  5.48, 0, 6.95, -Math.PI / 2,           [0.48, 0.64]],
      ['w4folder',     4.80, TOP.dintable + 0.001, 6.40, 0.25, null],          // her hospital letters, on the table
      ['w4fridge',     ROOMS.dining.x1 - 0.382 - 0.01, 0, 8.70, -Math.PI / 2, [0.76, 0.76]],
      ['w4poles',      5.55, 1.15, FL.z1 + 0.55, 0,           null],           // the laundry out of the kitchen window
      // outside her door: the gate on the facade's face, the mango leaves over the door, the shoe rack, the tulsi
      ['w4gate',       0, FL.corr, -0.051 - 0.006, 0,         null],
      /* (the thoranam's rope is 0.245 up its file, its leaves hanging from it: tied across the doorway's head, 2.09 up, at
         its outer edge inside the gate, the leaves over the top of the door) */
      ['w4thoranam',   0, 2.09 - 0.245, 0.05, 0,              null],
      ['w4shoerack',   -1.55, FL.corr, -0.193 - 0.012, Math.PI, null],
      ['w4tulsi',      1.35, FL.corr, -1.45, 0,               null]
    ];
    const things = {};
    /* (his teacher's large bowl's column, and the box blockers() makes of it: the bowl goes up onto the stool for the
       blessing, R53 in c_story.js, and its box on the floor goes with it) */
    let bigBowlSolid = null, bigBowlBox = null, bigBowlBox0 = null;
    for (const [key, x, y, z, ry, foot] of PROPS) {
      const g = stand(key, x, y, z, ry, LOOK[key] || {});
      if (key === 'w4dintable') g.scale.y = DINE_SY;
      (things[key] = things[key] || []).push(g);
      /* (the footprint as a column, turned with the thing: blockers() takes its box in the world, which holds it whole) */
      if (foot) { const sb = solidBox(foot[0], 1.2, foot[1], x, 0.6, z, ry); if (key === 'w4bigbowl') bigBowlSolid = sb; }
    }
    /* (R52) bedroom 3's bed, against its far wall: the flat's own bed model, its paint darkened as the room's is (its light
       is off; nothing is lit for it), seen only through the door's gap. (A colour multiplies in linear light: at 0.34 its white
       mattress read light grey through the gap on 21o, photographed; 0.12 sits it with the room's own floor and walls) */
    stand('w4bed', BED3_BED.x, 0, BED3_BED.z, -Math.PI / 2, { done: (m) => { matte(MATTE.cloth)(m);
      m.traverse(q => { if (q.isMesh) for (const mt of [].concat(q.material)) { mt.color.multiplyScalar(0.12); mt.envMapIntensity = 0.15; } }); } });

    /* THE PICTURES IN THEIR FRAMES (masters/v27.0/SOURCES.md). The portrait frame's picture is a flat face 4.7 mm before its
       back with its opening's middle 0.20 m up, measured on the model (tools/probes/planez.mjs: its inner corners at z
       0.004 to 0.005); a picture is laid 1.2 mm before it, whole at its own aspect inside the opening's 0.295 m height.
       Lit as the room is (the lamp alone lights it in the dark), never unlit. Until a picture lands its plane is hidden:
       the frame shows its own blank mount */
    function picLoad(key) {
      if (!have(key)) { waiting.add(key); return Promise.resolve(null); }
      return loadImageTexture(key, 'image/jpeg').then(t => { if (!t || !alive) return null; madeTex.push(t);
        t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping; t.repeat.set(1, -1); t.offset.set(0, 1); t.needsUpdate = true; return t; }).catch(() => null);
    }
    /* (18 Nov, photographed: laid at 6.2 mm, the frame's own mount, which is not flat (its points 1.6 to 7.5 mm), stood
       over the top of the photograph in a pale band: laid at 8.5 mm, under the frame's lip at 9 to 10.6) */
    const PIC = { y: 0.20, z: 0.0085, h: 0.295 };
    const pics = {};
    function picIn(g, key, s = 1, P = PIC) {
      const m = M({ color: 0xffffff, roughness: 0.55, metalness: 0 });
      const pl = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), m); pl.visible = false; owned.push(pl.geometry);
      pl.position.set(0, P.y * s, P.z * s); if (P.rx) pl.rotation.x = P.rx; g.add(pl); pics[key] = pl;
      picLoad(key).then(t => { if (!t) return; const im = t.image, a = im && im.width ? im.width / im.height : 0.72;
        m.map = t; m.needsUpdate = true; pl.scale.set(P.h * s * a, P.h * s, 1); pl.visible = true; });
      return pl;
    }
    /* Appa's photograph in its frame on the wall */
    for (const g of things.w4frameport || []) picIn(g, 'w4t_appa');
    /* HER OLD PHOTOGRAPH (the plan's source 4: "a young woman in a yellow sari, eyes wide, a crowd round her, a temple's
       festival"): the small standing frame on the display cabinet's middle shelf, behind its glass, turned a little to
       the passage he comes in by; the picture laid in it (measured on the frame, tools/probes/planez.mjs: its card at z
       0.032 to 0.033, its opening 0.219 by 0.165 about 0.100 up; the picture 1.5 mm before the card, under the lip at 0.038).
       The cabinet's shelf is 1.06 m up its file (tools/probes/surfaces.mjs), its depth -0.20 to 0.24 */
    /* (18 Nov, photographed from where he stands: laid on the card the picture was under the frame's own glass, which the
       generator painted grey, and the cabinet's brass pot stood before the frame: the picture now lies before the glass,
       under the lip's edge, and the frame stands at the shelf's front, the pot behind it) */
    /* (18 Nov, photographed again on the live build: only the picture's top fifth showed. The glass is not upright: it
       leans back, its front at z 0.049 at the opening's foot and 0.035 at its head (tools/probes/frontz.mjs, the front-most
       surface over the opening; planez sees only points, and the glass is two big triangles), so an upright picture at
       0.040 stood behind it below 0.16 m. The picture is laid on the glass, 2 mm before it and leaning with it) */
    /* (18 Nov, photographed on build 21h: its left side ran a slant through the picture. The frame stood 4 cm into the
       cabinet's middle post (its local x -0.04 to 0.04, front at 0.26) and over the blue bowl in the right bay
       (tools/probes/propfit.mjs: 1,398 of its points inside the cabinet, 14 of 63 of the picture's inside the post). The
       right bay's middle shelf is clear from the bowl's edge (its x 0.19) to the stile (0.33), 14 cm: the frame drawn at
       0.6 (15 by 12 cm, a small standing frame; the picture 13 by 10) stands there, a little turned to the passage, its
       base on the shelf's top (1.068). Measured: nothing of it inside the cabinet but its base resting on the shelf,
       and the picture seen whole from the room) */
    const PIC_SMALL = { y: 0.100, z: 0.0442, h: 0.162, rx: -0.0848 }, FRAME_S = 0.6;
    const CAB = { x: ROOMS.dining.x0 + 0.28 + 0.005, z: 6.15 };
    const oldFrame = stand('w4framesmall', CAB.x + 0.17, 1.068, CAB.z - 0.259, Math.PI / 2 + 0.10, { lift: 1.5, s: FRAME_S });
    picIn(oldFrame, 'w4t_oldphoto', FRAME_S, PIC_SMALL);
    things.oldFrame = [oldFrame];
    /* HER SHRINE'S THREE: Kali in the middle, Ganesha at her left as one stands before it, Murugan at her right; each in
       the portrait frame drawn small, standing on the shrine's middle shelf and leaning back on its back panel (measured
       on the shrine: the shelf's top 0.335 up its file, the panel's face 0.19 behind its middle; the shrine is turned to
       the room, so its own +x is the room's -x: the right of one who faces it) */
    const SHRINE = { shelf: 0.337, back: -0.181, lean: 0.10 };
    if (things.w4prayershelf && things.w4prayershelf[0]) {
      const sh = things.w4prayershelf[0];
      for (const [key, x, s] of [['w4t_kali', 0, 0.62], ['w4t_ganesha', -0.19, 0.48], ['w4t_murugan', 0.19, 0.48]]) {
        const f = stand('w4frameport', x, SHRINE.shelf, SHRINE.back + 0.011 * s + 0.02, 0, { parent: sh, s, ...LOOK.w4frameport });
        f.rotation.x = -SHRINE.lean;
        picIn(f, key, s);
        (things.shrinePics = things.shrinePics || []).push(f);
      }
    }

    /* THE DOORS: every doorway's leaf is the one door model (a flush door of varnished timber, its lever and hinges),
       drawn to its doorway's width; her main door stands open into the room on its hinge, bedroom 3's a hand's width.
       Until the model lands (and if it never does) a plain veneer leaf stands in each doorway, so no shut room is ever
       seen through: hidden the moment the model is in (v4.7: a stand-in that hides on landing) */
    const DOOR_W = 0.938, DOOR_H = 2.10;                      // the model's own leaf (its file's extent)
    const doorLeaves = [], doorStandIns = [];
    function door(w, hinge, ry, open, at, flip = false) {
      /* `hinge` [x, z]: the leaf turns about it; `ry`: the leaf's turn when SHUT (its face along the wall); `open`: how far
         it is turned from shut (radians, into the room); `at`: the leaf's middle from its hinge when shut (-w/2 or +w/2 along
         its own x) */
      const pivot = new THREE.Group(); pivot.position.set(hinge[0], 0, hinge[1]); pivot.rotation.y = ry + open; world.add(pivot);
      /* (`flip`: the leaf turned about its own middle so the model's hinged edge, its +x, lies at the pivot when `at` is
         +w/2: 19 Nov, photographed through bedroom 3's door after its scare, its hinges were drawn on the edge that swings) */
      const leaf = stand('w4doorleaf', at, 0, 0, flip ? Math.PI : 0, { parent: pivot, ...LOOK.w4doorleaf });
      leaf.scale.set((w - 0.02) / DOOR_W, 2.06 / DOOR_H, 1);
      const si = new THREE.Mesh(new THREE.BoxGeometry(w - 0.02, 2.06, 0.04), mVeneer);
      si.position.set(at, 1.03, 0); si.visible = !have('w4doorleaf'); pivot.add(si); owned.push(si.geometry);
      doorLeaves.push({ pivot, leaf, shut: ry, open }); doorStandIns.push(si);
      return pivot;
    }
    const R2 = ROOMS;
    /* her main door: hinged at the doorway's right (x 0.50), standing open a quarter turn into the room; its middle to the
       -x of its hinge, so the model's own hinged edge (its +x) is the one on the pivot; and a column where it stands */
    /* (18 Nov, photographed from the corridor: the model's hinged edge is ragged, a strip the generator tore; its pivot
       stands inside the jamb and the wall's thickness, so that end of the leaf is in the wall and the leaf comes out of
       it at the wall's face) */
    door(1.0, [DOOR_MAIN.x1 + 0.03, FL.face - 0.08], 0, Math.PI / 2, -0.5);
    solidBox(0.06, 2.1, 1.0, DOOR_MAIN.x1 + 0.03, 1.05, FL.face - 0.08 + 0.5);
    /* her grille gate, shut behind them once the opening film has brought him in (it is drawn shut in play): a column
       across the doorway's outer face, or he walked through it into the corridor (18 Nov, walktest: 15.7 square metres
       reached outside her flat, out to -3.70, -1.60) */
    solidBox(DOOR_MAIN.x1 - DOOR_MAIN.x0 + 0.04, 2.1, 0.08, 0, 1.0, -0.06);
    door(DOOR_MASTER.x1 - DOOR_MASTER.x0, [DOOR_MASTER.x0, R2.living.z1 + 0.05], 0, 0, (DOOR_MASTER.x1 - DOOR_MASTER.x0) / 2);
    door(DOOR_BED2.x1 - DOOR_BED2.x0, [DOOR_BED2.x0, R2.nook.z1 + 0.05], 0, 0, (DOOR_BED2.x1 - DOOR_BED2.x0) / 2);
    door(DOOR_BATH2.x1 - DOOR_BATH2.x0, [DOOR_BATH2.x0, R2.bath2.z0 - 0.05], 0, 0, (DOOR_BATH2.x1 - DOOR_BATH2.x0) / 2);
    door(DOOR_STORE.z1 - DOOR_STORE.z0, [R2.nook.x0 - 0.05, DOOR_STORE.z0], -Math.PI / 2, 0, (DOOR_STORE.z1 - DOOR_STORE.z0) / 2);
    /* bedroom 3's, a hand's width open (its scare eases it further: d_play turns doorLeaves[5].pivot) */
    door(DOOR_BED3.z1 - DOOR_BED3.z0, [R2.living.x0 - 0.06, DOOR_BED3.z0], -Math.PI / 2, -0.12, (DOOR_BED3.z1 - DOOR_BED3.z0) / 2, true);
    /* her neighbours' doors and gates along the corridor: the same door, the same gate, shut */
    for (const nx of NEIGHBOURS) {
      door(0.92, [nx - 0.46, 0.02], 0, 0, 0.46);
      stand('w4gate', nx, FL.corr, -0.051 - 0.006, 0, LOOK.w4gate);
    }
    /* (R36, 18 Nov) her neighbours' lives along the corridor, against their walls inside SCDF's 1.2 m clear from the
       parapet (docs/research/V27.0-HDB.md §2.1): a shoe rack at each door, a bougainvillea, three pots, a bicycle, a
       clothes rack out to dry. Clear of the opening film's walk (x -6 to -2 by the parapet side) */
    for (const nx of NEIGHBOURS) stand('w4shoerack', nx - 1.55, FL.corr, -0.193 - 0.012, Math.PI, LOOK.w4shoerack);
    /* each against the wall (its face at z 0) by its own box, measured from its file (18 Nov): the bougainvillea 0.74 x
       0.63 (turned 0.4, 0.44 deep), the pots 1.0 x 0.49, the bicycle 1.70 x 0.71, the rack 1.35 x 0.75; 1.5 cm clear */
    stand('w4bougain', 12.6, FL.corr, -0.45, 0.4, { lift: 1.5 });
    stand('w4corrpots', 14.6, FL.corr, -0.262, Math.PI, { lift: 1.5 });
    stand('w4corrpots', -8.4, FL.corr, -0.262, Math.PI, { lift: 1.5 });
    stand('w4bicycle', 17.4, FL.corr, -0.37, Math.PI, { lift: 1.5 });
    stand('w4clothesrack', 23.0, FL.corr, -0.39, Math.PI, { lift: 1.5 });
    if (have('w4doorleaf')) parseOnce('w4doorleaf').then(() => { for (const s of doorStandIns) s.visible = false; },
      () => { for (const s of doorStandIns) s.visible = true; });
