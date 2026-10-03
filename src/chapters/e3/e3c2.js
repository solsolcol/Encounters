/* Episode 3 · Chapter 2 · "The Hands That Moved"
   ---------------------------------------------------------------------------
   THE SECOND CHAPTER OF CASE FILE 3, "How It All Began" — S1·07, "How It All
   Began · Part Two". After his first Sak Yant he kept going back; business
   got better, life got smoother, and he became "extremely sensitive in
   spiritual settings. Something in me was waking up." When he heard chanting
   his hands began to move on their own — "slow and graceful, almost like the
   traditional movements of a Thevada" — and then it happened in temples:
   "I would kneel to pray like everyone else, and sometimes before I could
   properly begin, my body would start moving." He was frightened, and most
   of all of being seen.

   THE EPISODE'S AXIS IS CONTROL. Chapter 1 was ASKING (full control); this
   is HANDS — he loses his body's smallest part. The player keeps the camera
   and the legs; the hands are taken, and the play is the fight to keep them.

   A DIFFERENT TEMPLE (Chad, 2 Oct 2026: "chp 2 temple should be a different
   temple to look fresh for the player"). Chapter 1 is a white-and-gold Lanna
   wat seen from OUTSIDE at DAWN; this is the INSIDE of a central-Thai
   ordination hall at DUSK going into night — black-lacquer columns stencilled
   in gold, a polished dark stone floor, a deep blue-and-gold back wall behind
   a great gilded Buddha, rows of laypeople in white, the monks on a raised
   platform along the side wall chanting the evening service.

   PLAY: take a chant book from the shelf by the door, press gold leaf onto
   the small Buddha image (on its back, where nobody sees — the Thai saying),
   find the free mat in the third row and kneel; bow three times with the
   hall; chant. Then the chant swells and his hands rise out of the añjali on
   their own (the engine's `kit.hands`, the twenty-fourth seam) and the
   player fights them through three swells — HOLD while it swells, LET GO and
   breathe in the ebb (the `resist` event, the twenty-fifth). Each slip
   sweeps the hands wider, sways him, and turns a head. At the peak the hands
   go whatever the score; his shadow on the floor has a crown; the woman
   beside him is looking; and the decision opens by itself.

   The four options are the approved plan's (docs/V16.0-EPISODE3-PLAN.md §3,
   chapter 2): force it down (bad), rise and step outside (good), let it run
   (worst), stay still and resolve to ask someone who truly knows (best — what
   he did). The teaching is S1·07's own lesson, verbatim.

   docs/V18.0-E3C2-PLAN.md is the build's memory.                          */

(() => {
  'use strict';

  let S = null;

  const DATA = {
    id: 2,
    episode: 3,
    title: 'The Hands That Moved',
    cardLabel: 'Chapter 2',
    cardTitle: 'The Hands That Moved',
    brief: 'A temple hall in Thailand at dusk, the evening chant already begun. Take a chant book, press gold leaf onto the small Buddha, find your place in the rows, and kneel with everyone else.',
    prompt: 'The chant is at its height. Your hands are moving on their own, and the people around you have started to look.',
    choices: [
      { k: 'A', text: 'Press your hands together hard and force it to stop.',
        d: { sanity: -9, awareness: 6, wisdom: -12 }, verdict: 'bad',
        say: 'I forced it down. It did not go away.',
        teach: 'What you suppress without understanding has not gone. It is only waiting.' },
      { k: 'B', text: 'Rise quietly, bow, and step outside.',
        d: { sanity: 9, awareness: 12, wisdom: 15 }, verdict: 'good',
        say: 'I stepped outside, and let it pass.',
        teach: 'Stepping away quietly harms no one. The real work is understanding it afterwards.' },
      { k: 'C', text: 'Let it run, and see what it becomes.',
        d: { sanity: -18, awareness: -9, wisdom: -27 }, verdict: 'worst', critical: true,
        say: 'I let it run, to see what it was.',
        teach: 'Do not chase these states out of curiosity.' },
      { k: 'D', text: 'Stay still, breathe, and resolve to ask someone who truly knows.',
        d: { sanity: 15, awareness: 24, wisdom: 30 }, verdict: 'best',
        say: 'I kept still, and went looking for someone who knew.',
        teach: 'Seek to understand it properly, from people who know far more than you.' }
    ],
    core: 'If something like this ever happens to you, the important thing is what you do next. Do not imitate these states, do not provoke them, and do not chase them out of curiosity. And if something is affecting your health or your mind, see a doctor as well.',

    /* units metres, y up; -z is toward the Buddha. THE HALL: its inner faces
       x -6.5…6.5, z -22 (the Buddha's wall) … 2 (the door wall); the doors in
       the middle of the front wall; two rows of seven black columns at x ±3.7;
       the monks' platform along the EAST wall (the side wall, never beside
       the Buddha — Chad's ruling at v16.9); the laypeople in four rows of six
       across the nave with an aisle down the middle; his mat the WEST end of
       the third row, reached from the west aisle between two columns. */
    spawn:     { x: 0, y: 1.62, z: 0.9, rot: 0 },
    shrine:    { x: -2.9, z: -7.8 },         // the engine's anchor: his own mat (ghost: null)
    ghostHome: { x: -2.9, z: -7.8 },
    bounds:    { minX: -6.2, maxX: 6.2, minZ: -21.0, maxZ: 1.7 },

    /* NO HAUNTING (the eleventh leak). Nothing comes for him here; something
       comes THROUGH him. The presence the HUD reports is the people looking. */
    ghost: null,

    /* DUSK INTO NIGHT. The windows are the last deep blue of the evening,
       the hall is warm lamplight and candles, and the great Buddha is the
       brightest thing in it. */
    daylight: {
      stops: [[0.00, '#3a2a3e'], [0.10, '#3d3550'], [0.30, '#26305a'],
              [0.60, '#151d3e'], [1.00, '#0a0f24']],
      bg: 0x141a33,
      fog: [0x1b1620, 0.010],
      hemi: [0xffd7a6, 0x2a1a12, 0.62],
      key: [0xffc98a, 1.05, -2, 9, 8],
      fill: [0x7f92c8, 0.20],
      stars: 0.35, moon: 0,
      sun: 0, clouds: 0,
      vmHemi: [0xffe2bd, 0x5a4232, 0.86],
      vmKey: [0xffcf98, 0.78]
    },

    /* the stand-in cast (docs/E3-MODELS.md, chapter 2): the laypeople are
       existing characters re-posed sitting cross-legged on the floor (the
       monk's own floor take, retargeted; masters/v18.0/crowd) and dressed in
       white; the monks are Chad's monk at crowd detail; the Thevada is seen
       only as a crowned shadow and a gold glimpse at the edge of the frame */
    assets: ['lay_admintee', 'lay_botak', 'lay_granny', 'lay_scold', 'lay_sitwoman', 'monkrow',
             'thaikit', 'slipper', 'admintee', 'tree1', 'tree2', 'tree3', 'tree4'],

    /* THE SOUND. The evening chant (`e3vesper`) is the chapter's music; the
       hall's room tone under it; the dusk outside near the doors; and the
       tension bed (`e3pull`) comes up only while the hands are fighting him.
       mixBeds() writes all four every frame. */
    musicVol: 0,
    ambience: { beds: [['hallamb', 0.40], ['e3vesper', 0.30], ['e3pull', 0.0], ['templedusk', 0.20]] },
    voiceLine: 'z2arrive',

    words: {
      approach: '',
      act: 'E to act',
      actTouch: 'Tap to act',
      interact: 'E to choose what you do',
      interactTouch: 'Tap to choose what you do',
      objBook: 'Take a chant book from the shelf',
      objLeaf: 'Press gold leaf onto the small Buddha',
      objPlace: 'Find the free mat in the third row and kneel',
      objChant: 'Chant with the hall',
      objHands: 'Keep your hands still',
      hotBook: 'Take a chant book',
      hotLeaf: 'Press gold leaf',
      evHands: 'Keep your hands still',
      evHandsBrief: 'Your hands are starting to rise on their own. TAP as fast as you can: every tap pulls them back down, and the chant makes it harder. Slow down for even one second and they are no longer yours.',
      presence: 'People are looking at you'
    },
    sayPrefix: 'z2'
  };

  /* the measured length of every line said OUTSIDE a cutscene
     (masters/v18.0: the installed files, ffprobe) */
  const SECS = { z2arrive: 2.69, z2leaf: 3.71, z2kneel: 3.71, z2slip1: 3.00, z2slip2: 2.93, z2peak: 2.04,
                 lw2look: 2.72, lw2pull: 2.59 };

  const hash = (i, s) => { const x = Math.sin(i * 127.1 + s * 311.7) * 43758.5453; return x - Math.floor(x); };
  const smooth = k => k * k * (3 - 2 * k);

  function build(ctx) {
    const { THREE, GLTFLoader, cloneSkinned, scene, camera, yaw, pitch, LOW, kit, plantTrees,
            assetBytes, rescueTextures, redoShadows, cnv, makeHellNote,
            getState, startDecision, worldSfx, warmSounds } = ctx;

    const owned = [];
    let alive = true;
    const parsedGlb = new Map();
    const madeTex = [];
    const tex = (t) => { madeTex.push(t); return t; };

    /* ------------------------------------------------------------- the map */
    const HALL = { x0: -6.5, x1: 6.5, z0: -22.0, z1: 2.0, H: 7.2, T: 0.45 };
    const DOOR = { hw: 1.15, h: 3.75 };
    const COLX = 3.7, COLZ = [-1.2, -3.8, -6.4, -9.0, -11.6, -14.2, -16.8], COLW = 0.62;
    const WINZ = [-2.5, -5.1, -7.7, -10.3, -12.9, -15.5];
    const WIN = { w: 1.15, h: 2.7, sill: 1.55 };
    const PED = { z: -20.4 };                         // the Buddha's pedestal
    const ALT = { x: 0, z: -18.15 };                  // the altar table before it
    const MPLAT = { x0: 4.45, x1: 6.5, z0: -16.2, z1: -5.6, h: 0.45 };    // the monks' platform, east wall
    const MONKS = Array.from({ length: 9 }, (_, i) => ({ x: 5.4, z: -15.4 + i * 1.15 }));
    const ROWZ = [-10.2, -9.0, -7.8, -6.6];
    const ROWX = [-2.9, -1.9, -0.9, 0.9, 1.9, 2.9];
    const PLACE = { x: -2.9, z: -7.8 };               // his mat: the west end of the third row
    const NEIGH = { x: -1.9, z: -7.8 };               // the woman beside him
    const YAI = { x: -1.9, z: -9.0 }, KID = { x: -0.9, z: -9.0 }, FRONT = { x: -2.9, z: -9.0 };
    const SHELF = { x: -3.6, z: 1.72 };               // the chant books, by the door
    const LEAF = { x: -6.05, z: -3.8 };               // the gold-leaf table, west wall
    const CANDLES = { z: -5.45, x0: -2.7, x1: 2.7 };  // the candle stand behind the rows (his shadow falls forward from it)

    /* ----------------------------------------------------------- materials */
    const noteTex = makeHellNote();
    madeTex.push(noteTex);
    const floorTex = tex(makeStoneFloor(THREE, cnv)); floorTex.repeat.set(6, 11);
    const lacTex = tex(makeLacquerCol(THREE, cnv));
    const cofTex = tex(makeCoffers(THREE, cnv)); cofTex.repeat.set(4, 8);
    const dadoTex = tex(makeDado(THREE, cnv)); dadoTex.repeat.set(8, 1);
    const blueTex = tex(makeBlueGold(THREE, cnv)); blueTex.repeat.set(3, 2);
    const wallTex = tex(makeCreamWall(THREE, cnv)); wallTex.repeat.set(6, 3);
    const goldTex = tex(makeGoldBand(THREE, cnv)); goldTex.repeat.set(10, 1);
    const tileTex = tex(makeRoofTiles(THREE, cnv, '#c96a2e', '#5e2a10')); tileTex.repeat.set(6, 4);
    const matFloor = new THREE.MeshStandardMaterial({ map: floorTex, roughness: 0.42, metalness: 0.05 });   // (0.32 put a hot spot of the Buddha lamp on the stone in front of every row)
    const matCol   = new THREE.MeshStandardMaterial({ map: lacTex, roughness: 0.32, metalness: 0.2 });
    const matCoffer = new THREE.MeshStandardMaterial({ map: cofTex, roughness: 0.7, side: THREE.DoubleSide,
                                                       emissive: 0xffffff, emissiveMap: cofTex, emissiveIntensity: 0.10 });
    const matDado  = new THREE.MeshStandardMaterial({ map: dadoTex, roughness: 0.55 });
    const matBlue  = new THREE.MeshStandardMaterial({ map: blueTex, roughness: 0.35, metalness: 0.25,
                                                      emissive: 0xffffff, emissiveMap: blueTex, emissiveIntensity: 0.16 });
    const matWall  = new THREE.MeshStandardMaterial({ map: wallTex, roughness: 0.9 });
    const matGoldB = new THREE.MeshStandardMaterial({ map: goldTex, roughness: 0.35, metalness: 0.5, emissive: 0x2a1a04, emissiveIntensity: 0.6 });
    const matGold  = new THREE.MeshStandardMaterial({ color: 0xd9a63c, roughness: 0.3, metalness: 0.55, emissive: 0x3a2406, emissiveIntensity: 0.6 });
    const matGoldHot = new THREE.MeshStandardMaterial({ color: 0xffd27a, roughness: 0.25, metalness: 0.6, emissive: 0x6a4410, emissiveIntensity: 0.9 });
    const matRed   = new THREE.MeshStandardMaterial({ color: 0x8e1d14, roughness: 0.5 });
    const matRedD  = new THREE.MeshStandardMaterial({ color: 0x5a1009, roughness: 0.6 });
    const matWood  = new THREE.MeshStandardMaterial({ color: 0x4a2a18, roughness: 0.55 });
    const matWoodL = new THREE.MeshStandardMaterial({ color: 0x8a5a34, roughness: 0.6 });
    const matWhite = new THREE.MeshStandardMaterial({ color: 0xf2eee4, roughness: 0.85 });
    const matCream = new THREE.MeshStandardMaterial({ color: 0xe9dfc8, roughness: 0.9 });
    const matDark  = new THREE.MeshStandardMaterial({ color: 0x15100e, roughness: 0.8 });
    const matTile  = new THREE.MeshStandardMaterial({ map: tileTex, roughness: 0.6, side: THREE.DoubleSide });
    const matMat   = new THREE.MeshStandardMaterial({ map: tex(makeReedMat(THREE, cnv)), roughness: 0.95 });
    const matProxy = new THREE.MeshStandardMaterial({ color: 0x8d7a66, roughness: 0.9 });
    const matTube  = new THREE.MeshBasicMaterial({ color: 0xf2f6ff });
    const matBulb  = new THREE.MeshBasicMaterial({ color: 0xffe2a8 });
    const matFlame = new THREE.MeshBasicMaterial({ color: 0xffc46a, transparent: true, opacity: 0.95, depthWrite: false, blending: THREE.AdditiveBlending });

    const world = new THREE.Group();
    scene.add(world);

    const walls = [], solids = [];
    const box = (w, h, d, x, y, z, mat, parent = world, cast = true) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
      m.position.set(x, y, z); m.castShadow = cast && !LOW; m.receiveShadow = true;
      parent.add(m); return m;
    };
    const hid = (m) => { m.visible = false; return m; };
    const cyl = (r0, r1, h, x, y, z, mat, seg = 14, parent = world) => {
      const m = new THREE.Mesh(new THREE.CylinderGeometry(r0, r1, h, seg), mat);
      m.position.set(x, y, z); m.castShadow = !LOW; m.receiveShadow = true;
      parent.add(m); return m;
    };

    /* THE THAI KIT (v16.6's file, shared with chapter 1): one parse, every
       piece a clone; a primitive it replaces stays drawn until it lands */
    const GOLD_T = 0xffd88c;
    function thai(name, x, y, z, o = {}) {
      const g = new THREE.Group(); g.position.set(x, y, z); g.rotation.y = o.ry || 0;
      if (o.s) g.scale.setScalar(o.s);
      (o.parent || world).add(g);
      parseOnce('thaikit').then(gltf => {
        if (!alive) return;
        const src = gltf.scene.getObjectByName('thai_' + name);
        if (!src) throw new Error('thaikit has no thai_' + name);
        const m = src.clone(true);
        m.position.set(0, 0, 0);
        m.traverse(q => {
          if (!q.isMesh) return;
          q.castShadow = o.cast !== false && !LOW; q.receiveShadow = true;
          if (o.tint) { q.material = q.material.clone(); q.material.color.multiply(new THREE.Color(o.tint));
                        if (o.glow) { q.material.emissive = new THREE.Color(o.tint); q.material.emissiveIntensity = o.glow; if (q.material.map) q.material.emissiveMap = q.material.map; } }
        });
        g.add(m);
        for (const h of (o.hide || [])) if (h) h.visible = false;
        if (o.then) o.then(g, m);
      }).catch(err => { console.warn('thaikit failed to load', err); ctx.loadFail && ctx.loadFail('thaikit', err); });
      return g;
    }

    /* ------------------------------------------------------------ the floor */
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(HALL.x1 - HALL.x0, HALL.z1 - HALL.z0), matFloor);
    floor.rotation.x = -Math.PI / 2; floor.position.set(0, 0, (HALL.z0 + HALL.z1) / 2); floor.receiveShadow = true;
    world.add(floor);
    // a red runner down the middle aisle to the Buddha
    const runner = new THREE.Mesh(new THREE.PlaneGeometry(1.25, 17.6), new THREE.MeshStandardMaterial({ map: tex(makeRunner(THREE, cnv)), roughness: 0.9 }));
    runner.material.map.repeat.set(1, 7);
    runner.rotation.x = -Math.PI / 2; runner.position.set(0, 0.006, -8.9); runner.receiveShadow = true; world.add(runner);

    /* ------------------------------------------------------------ the walls
       Each long wall is built round its windows (piers between the openings,
       a sill under and a lintel over each), so the windows are real openings
       onto the dusk, with a gold frame and a pointed crown. */
    const T = HALL.T, H = HALL.H;
    function longWall(x, sgn) {
      const xc = x + sgn * T / 2;
      const edges = [HALL.z1];
      for (const z of WINZ) edges.push(z + WIN.w / 2, z - WIN.w / 2);
      edges.push(HALL.z0);
      for (let i = 0; i < edges.length; i += 2) {
        const za = edges[i], zb = edges[i + 1], len = za - zb;
        walls.push(box(T, H, len, xc, H / 2, (za + zb) / 2, matWall));
        // the dado: a dark red skirting band with a gold rule along its top
        const d = box(0.04, 1.15, len, x + sgn * 0.02, 0.575, (za + zb) / 2, matDado, world, false); d.castShadow = false;
      }
      for (const z of WINZ) {
        walls.push(box(T, WIN.sill, WIN.w, xc, WIN.sill / 2, z, matWall));
        box(0.04, 1.15, WIN.w, x + sgn * 0.02, 0.575, z, matDado, world, false);
        const top = WIN.sill + WIN.h;
        walls.push(box(T, H - top, WIN.w, xc, top + (H - top) / 2, z, matWall));
        // the gold frame, inside face: two jambs, a sill, and the pointed crown
        const fx = x + sgn * 0.035;
        box(0.07, WIN.h + 0.1, 0.09, fx, WIN.sill + WIN.h / 2, z - WIN.w / 2 - 0.02, matGold, world, false);
        box(0.07, WIN.h + 0.1, 0.09, fx, WIN.sill + WIN.h / 2, z + WIN.w / 2 + 0.02, matGold, world, false);
        box(0.12, 0.09, WIN.w + 0.24, fx, WIN.sill - 0.03, z, matGold, world, false);
        const crown = new THREE.Mesh(new THREE.ShapeGeometry(crownShape(THREE, WIN.w + 0.34, 0.95)), matGoldB);
        crown.position.set(x + sgn * 0.03, top, z); crown.rotation.y = sgn > 0 ? -Math.PI / 2 : Math.PI / 2; world.add(crown);
        // the open shutters, lacquer and gold, folded back against the inner wall
        for (const s of [-1, 1]) {
          const sh = box(0.04, WIN.h, WIN.w / 2, x + sgn * 0.09, WIN.sill + WIN.h / 2, z + s * (WIN.w / 2 + WIN.w / 4 + 0.05), matCol, world, false);
          sh.rotation.y = 0;
        }
      }
    }
    longWall(HALL.x0, -1);
    longWall(HALL.x1, 1);
    // the back wall, behind the Buddha: deep blue glass and gold
    walls.push(box(HALL.x1 - HALL.x0 + 2 * T, H, T, 0, H / 2, HALL.z0 - T / 2, matBlue));
    // the front wall, with the doorway
    for (const s of [-1, 1]) {
      const w = (HALL.x1 - HALL.x0) / 2 - DOOR.hw + T;
      walls.push(box(w, H, T, s * (DOOR.hw + w / 2), H / 2, HALL.z1 + T / 2, matWall));
      box(w, 1.15, 0.04, s * (DOOR.hw + w / 2), 0.575, HALL.z1 - 0.02, matDado, world, false);
    }
    walls.push(box(DOOR.hw * 2, H - DOOR.h, T, 0, DOOR.h + (H - DOOR.h) / 2, HALL.z1 + T / 2, matWall));
    // the door frame, gilded, and the two leaves open into the hall against the wall
    box(0.14, DOOR.h + 0.14, 0.2, -DOOR.hw - 0.05, DOOR.h / 2, HALL.z1 - 0.06, matGold, world, false);
    box(0.14, DOOR.h + 0.14, 0.2, DOOR.hw + 0.05, DOOR.h / 2, HALL.z1 - 0.06, matGold, world, false);
    box(DOOR.hw * 2 + 0.38, 0.16, 0.22, 0, DOOR.h + 0.06, HALL.z1 - 0.06, matGold, world, false);
    const dcrown = new THREE.Mesh(new THREE.ShapeGeometry(crownShape(THREE, DOOR.hw * 2 + 0.7, 1.4)), matGoldB);
    dcrown.position.set(0, DOOR.h + 0.12, HALL.z1 - 0.05); world.add(dcrown);
    const leaves = [];
    for (const s of [-1, 1]) {
      const pivot = new THREE.Group(); pivot.position.set(s * DOOR.hw, 0, HALL.z1 - 0.05); world.add(pivot);
      const leaf = box(DOOR.hw, DOOR.h - 0.05, 0.08, -s * DOOR.hw / 2, (DOOR.h - 0.05) / 2, 0, matCol, pivot, false);
      // a gold panel on each leaf (a guardian's painted outline would be here)
      box(DOOR.hw * 0.8, DOOR.h * 0.78, 0.01, -s * DOOR.hw / 2, DOOR.h * 0.48, 0.045, matGoldB, pivot, false);
      pivot.rotation.y = s * 1.45;           // open, folded back against the front wall
      leaves.push(pivot);
      solids.push(hid(box(0.25, 2, DOOR.hw, s * (DOOR.hw - 0.12), 1, HALL.z1 - DOOR.hw / 2 - 0.05, matProxy)));
    }
    // the doorway itself is closed to the player (the endings use it)
    walls.push(hid(box(DOOR.hw * 2, 3, 0.3, 0, 1.5, HALL.z1 + 0.35, matProxy)));

    /* ----------------------------------------------------------- the columns
       Black lacquer, gold stencilled lotus bands, a gilt lotus capital; a
       fluorescent tube on the inner face of every second one (Thai halls
       have them) and a small loudspeaker on one. */
    const tubes = [];
    for (const sx of [-COLX, COLX]) for (let i = 0; i < COLZ.length; i++) {
      const z = COLZ[i];
      solids.push(box(COLW, H, COLW, sx, H / 2, z, matCol));
      const cap = cyl(COLW * 0.5, COLW * 0.85, 0.55, sx, H - 0.28, z, matGoldB, 8);
      cap.rotation.y = Math.PI / 4;
      box(COLW + 0.06, 0.16, COLW + 0.06, sx, 0.08, z, matGold, world, false);
      if (i % 2 === 1) {
        const tb = box(0.05, 1.2, 0.05, sx - Math.sign(sx) * (COLW / 2 + 0.03), 3.6, z, matTube, world, false);
        tb.castShadow = false; tubes.push(tb);
      }
    }
    // one loudspeaker on the west column nearest the rows, for the monks' microphone
    box(0.26, 0.42, 0.22, -COLX + 0.42, 4.6, -6.4, matDark, world, false);

    /* ----------------------------------------------------------- the ceiling
       Dark red coffers with gold rosettes — chapter 1's ceiling is plain pale
       teak; this one is deliberately the other thing — on beams. */
    const ceil = new THREE.Mesh(new THREE.PlaneGeometry(HALL.x1 - HALL.x0, HALL.z1 - HALL.z0), matCoffer);
    ceil.rotation.x = Math.PI / 2; ceil.position.set(0, H, (HALL.z0 + HALL.z1) / 2); world.add(ceil);
    for (const sx of [-COLX, COLX]) box(0.36, 0.42, HALL.z1 - HALL.z0, sx, H - 0.21, (HALL.z0 + HALL.z1) / 2, matWood, world, false);
    for (const z of COLZ) box(HALL.x1 - HALL.x0, 0.32, 0.3, 0, H - 0.16, z, matWood, world, false);
    // the beams' gold stencil band along both long beams
    for (const sx of [-COLX, COLX]) for (const s of [-1, 1]) {
      const b = new THREE.Mesh(new THREE.PlaneGeometry(HALL.z1 - HALL.z0, 0.3), matGoldB);
      b.position.set(sx + s * 0.181, H - 0.24, (HALL.z0 + HALL.z1) / 2); b.rotation.y = s * Math.PI / 2; world.add(b);
    }

    /* the light fittings: three glass chandeliers down the nave, ceiling fans
       in the aisles (from the kit, turning), a lamp on a long rod over each
       aisle bay */
    const chand = [];
    for (const z of [-4.6, -10.4, -15.8]) {
      const g = new THREE.Group(); g.position.set(0, H - 2.2, z); world.add(g);
      cyl(0.01, 0.01, 2.0, 0, 1.2, 0, matGold, 4, g);
      for (let ring = 0; ring < 2; ring++) {
        const R = 0.55 - ring * 0.22, y = -ring * 0.28;
        const tor = new THREE.Mesh(new THREE.TorusGeometry(R, 0.02, 6, 28), matGold); tor.rotation.x = Math.PI / 2; tor.position.y = y; g.add(tor);
        for (let i = 0; i < 8 - ring * 3; i++) {
          const a = i / (8 - ring * 3) * Math.PI * 2;
          const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 6), matBulb);
          bulb.position.set(Math.cos(a) * R, y + 0.06, Math.sin(a) * R); g.add(bulb);
          const drop = new THREE.Mesh(new THREE.OctahedronGeometry(0.03), matGoldHot);
          drop.position.set(Math.cos(a + 0.3) * R, y - 0.12, Math.sin(a + 0.3) * R); g.add(drop);
        }
      }
      chand.push(g);
    }
    const fans = [];
    for (const sx of [-5.1, 5.1]) for (const z of [-3.8, -9.0, -14.2]) {
      if (sx > 0 && z < -5) continue;            // not over the monks
      const pivot = new THREE.Group(); pivot.position.set(sx, H - 1.6, z); world.add(pivot);
      cyl(0.015, 0.015, 1.0, sx, H - 0.5, z, matDark, 4);
      const g = box(1.5, 0.02, 0.18, 0, 0, 0, matWood, pivot, false);
      const g2 = box(0.18, 0.02, 1.5, 0, 0, 0, matWood, pivot, false);
      thai('ceilfan', 0, -0.7, 0, { s: 0.55, cast: false, parent: pivot, hide: [g, g2] });
      fans.push(pivot);
    }

    /* ----------------------------------------------------------- THE BUDDHA
       A great gilded Buddha in the earth-touching posture on a three-tier
       red-and-gold pedestal, a flame aureole behind him on the blue wall, two
       seven-tier umbrellas either side, the altar table before him with
       candles, incense, lotus and offerings. Lit from below by his candles —
       the brightest thing in the hall. (Stand-in: the kit's Buddha at scale;
       Chad's model takes its place.) */
    const PT = [[6.2, 0.95, 3.2, matRed], [4.8, 0.7, 2.6, matGoldB], [3.6, 0.45, 2.1, matRedD]];
    let py = 0;
    for (const [w, h, d, m] of PT) {
      const b = box(w, h, d, 0, py + h / 2, PED.z, m); solids.push(b);
      box(w + 0.06, 0.07, d + 0.06, 0, py + h - 0.02, PED.z, matGold, world, false);
      py += h;
    }
    const PED_TOP = py;                                   // 2.10
    // the aureole: concentric gold flame rings on the blue
    const aureole = new THREE.Group(); aureole.position.set(0, PED_TOP + 2.4, HALL.z0 + 0.06); world.add(aureole);
    for (let i = 0; i < 3; i++) {
      const r0 = 1.55 + i * 0.32;
      const ring = new THREE.Mesh(new THREE.RingGeometry(r0, r0 + 0.12, 48, 1, 0, Math.PI), i === 1 ? matGoldHot : matGold);
      ring.position.y = -0.4; aureole.add(ring);
    }
    const flames = new THREE.InstancedMesh(new THREE.ConeGeometry(0.07, 0.34, 4), matGoldHot, 26);
    { const d = new THREE.Object3D();
      for (let i = 0; i < 26; i++) { const a = (i + 0.5) / 26 * Math.PI, r = 2.32;
        d.position.set(Math.cos(a) * r, -0.4 + Math.sin(a) * r, 0); d.rotation.set(0, 0, a - Math.PI / 2); d.updateMatrix(); flames.setMatrixAt(i, d.matrix); }
      flames.instanceMatrix.needsUpdate = true; flames.computeBoundingSphere(); aureole.add(flames); }
    const buddhaProxy = new THREE.Group(); world.add(buddhaProxy);
    { // a stand-in drawn until the kit's Buddha lands
      const base = cyl(1.3, 1.45, 0.8, 0, PED_TOP + 0.4, PED.z, matGold, 20, buddhaProxy);
      const body = new THREE.Mesh(new THREE.SphereGeometry(0.9, 18, 14), matGold); body.scale.set(1, 1.35, 0.8);
      body.position.set(0, PED_TOP + 1.8, PED.z); buddhaProxy.add(body);
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.42, 16, 12), matGold); head.position.set(0, PED_TOP + 3.3, PED.z); buddhaProxy.add(head);
      void base;
    }
    thai('buddha', 0, PED_TOP, PED.z + 0.15, { s: 7.6, tint: GOLD_T, glow: 0.22, hide: [buddhaProxy] });
    // the seven-tier umbrellas
    for (const s of [-1, 1]) {
      const x = s * 2.75, g = new THREE.Group(); g.position.set(x, 0, PED.z + 1.2); world.add(g);
      cyl(0.035, 0.035, 5.2, 0, 2.6, 0, matGold, 6, g);
      for (let i = 0; i < 7; i++) {
        const r = 0.62 - i * 0.07, y = 2.4 + i * 0.42;
        const tier = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.92, r, 0.16, 18, 1, true), i % 2 ? matGoldHot : matWhite);
        tier.position.y = y; g.add(tier);
        const rim = new THREE.Mesh(new THREE.TorusGeometry(r, 0.018, 4, 24), matGold); rim.rotation.x = Math.PI / 2; rim.position.y = y - 0.08; g.add(rim);
      }
      solids.push(hid(box(0.3, 2, 0.3, x, 1, PED.z + 1.2, matProxy)));
    }
    // the altar table, its candles, incense, lotus, offerings
    solids.push(box(3.0, 0.8, 0.85, ALT.x, 0.4, ALT.z, matRedD));
    box(3.06, 0.05, 0.9, ALT.x, 0.82, ALT.z, matGold, world, false);
    box(2.0, 0.35, 0.6, ALT.x, 1.02, ALT.z - 0.12, matRed);           // a riser for the images
    for (let i = -2; i <= 2; i++) {
      if (i === 0) continue;
      thai('buddha', ALT.x + i * 0.55, 1.2, ALT.z - 0.14, { s: 0.85, tint: GOLD_T, glow: 0.15 });
    }
    const candleFl = [];
    for (let i = 0; i < 12; i++) {
      const cx = ALT.x - 1.32 + i * 0.24, cz = ALT.z + 0.28;
      cyl(0.018, 0.018, 0.22, cx, 0.96, cz, matCream, 6);
      const f = new THREE.Mesh(new THREE.ConeGeometry(0.014, 0.05, 6), matFlame); f.position.set(cx, 1.1, cz); world.add(f); candleFl.push(f);
    }
    thai('incense', ALT.x, 0.845, ALT.z + 0.18, { s: 0.6, cast: false });
    for (const s of [-1, 1]) {
      thai('orchid', ALT.x + s * 1.2, 1.37, ALT.z - 0.1, { s: 0.45, cast: false });
      thai('phan', ALT.x + s * 0.7, 0.845, ALT.z + 0.22, { s: 0.75, cast: false });
      thai('lotusbowl', ALT.x + s * 2.15, 0, ALT.z + 0.3, { s: 0.7, cast: false });
    }
    // incense smoke over the altar
    const smokeN = LOW ? 18 : 36;
    const smokeG = new THREE.BufferGeometry();
    smokeG.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(smokeN * 3), 3));
    const smoke = new THREE.Points(smokeG, new THREE.PointsMaterial({ color: 0xd8d2c8, size: 0.09, transparent: true, opacity: 0.25, depthWrite: false }));
    smoke.userData.seed = Array.from({ length: smokeN }, (_, i) => hash(i, 3));
    smoke.frustumCulled = false; world.add(smoke);

    // the warm light of the Buddha's candles, and the one over his rows
    const buddhaLight = new THREE.PointLight(0xffc06e, LOW ? 18 : 26, 16, 1.6);
    buddhaLight.position.set(0, 2.2, PED.z + 2.8); world.add(buddhaLight);
    const rowLight = new THREE.PointLight(0xffb871, 5.5, 7, 1.8);
    rowLight.position.set(-1.2, 1.3, CANDLES.z + 0.4); world.add(rowLight);

    /* -------------------------------------------- THE MONKS' PLATFORM (east)
       A raised platform along the side wall, a red carpet edged in gold, a
       low back screen, nine monks seated cross-legged facing across the
       hall, a ceremonial fan before each, a microphone stand before the
       senior monk at the Buddha's end. */
    solids.push(box(MPLAT.x1 - MPLAT.x0, MPLAT.h, MPLAT.z1 - MPLAT.z0, (MPLAT.x0 + MPLAT.x1) / 2, MPLAT.h / 2, (MPLAT.z0 + MPLAT.z1) / 2, matWood));
    box(MPLAT.x1 - MPLAT.x0 - 0.1, 0.02, MPLAT.z1 - MPLAT.z0 - 0.1, (MPLAT.x0 + MPLAT.x1) / 2, MPLAT.h + 0.01, (MPLAT.z0 + MPLAT.z1) / 2, matRed, world, false);
    box(0.05, 0.06, MPLAT.z1 - MPLAT.z0, MPLAT.x0 + 0.03, MPLAT.h + 0.01, (MPLAT.z0 + MPLAT.z1) / 2, matGold, world, false);
    for (const m of MONKS) {
      thai('cushflat', m.x + 0.05, MPLAT.h + 0.012, m.z, { s: 1.25, ry: Math.PI / 2, cast: false });
      // the talapat: an oval fan on a stick, planted before him
      const fan = new THREE.Group(); fan.position.set(m.x - 0.55, MPLAT.h, m.z); fan.rotation.y = Math.PI / 2; world.add(fan);
      cyl(0.008, 0.008, 0.7, 0, 0.35, 0, matWoodL, 4, fan);
      const leaf = new THREE.Mesh(new THREE.CircleGeometry(0.17, 18), new THREE.MeshStandardMaterial({ color: 0x8a5420, roughness: 0.7, side: THREE.DoubleSide }));
      leaf.scale.set(0.8, 1.15, 1); leaf.position.y = 0.82; fan.add(leaf);
      const rim = new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.008, 4, 22), matGold); rim.scale.set(0.8, 1.15, 1); rim.position.y = 0.82; fan.add(rim);
    }
    { const lead = MONKS[0];
      cyl(0.012, 0.012, 0.9, lead.x - 0.6, MPLAT.h + 0.45, lead.z + 0.12, matDark, 5);
      const mic = new THREE.Mesh(new THREE.SphereGeometry(0.03, 8, 6), matDark); mic.position.set(lead.x - 0.5, MPLAT.h + 0.92, lead.z + 0.12); world.add(mic); }

    /* --------------------------------------------- BY THE DOOR, AND THE ROWS */
    // the chant-book shelf: a low lacquered cabinet with open shelves of red books
    // (turned a half-turn so its OPEN face, local +z, faces into the hall;
    // the solid that blocks is an invisible box of the same footprint)
    const shelf = new THREE.Group(); shelf.position.set(SHELF.x, 0, SHELF.z - 0.22); shelf.rotation.y = Math.PI; world.add(shelf);
    { const c = box(1.5, 1.15, 0.4, 0, 0.575, 0, matWood, shelf); c.visible = false; solids.push(c); }
    box(1.5, 1.15, 0.03, 0, 0.575, -0.185, matWood, shelf);                         // the back
    for (const sx of [-1, 1]) box(0.04, 1.15, 0.4, sx * 0.73, 0.575, 0, matWood, shelf);   // the sides
    for (const y of [0.12, 0.45, 0.78, 1.13]) box(1.5, 0.035, 0.4, 0, y, 0, matWood, shelf);   // the boards and the top
    const bookMats = [0x8c1b14, 0xa3241a, 0x7a1610, 0x99301e].map(c => new THREE.MeshStandardMaterial({ color: c, roughness: 0.75 }));
    const books = [];
    for (let row = 0; row < 3; row++) for (let i = 0; i < 18; i++) {
      const b = box(0.06, 0.2, 0.15, -0.66 + i * 0.077, 0.24 + row * 0.33, 0.02, bookMats[(i + row) % 4], shelf, false);
      b.rotation.z = (hash(i, row) - 0.5) * 0.08;
      if (row === 2 && i === 7) books.push(b);           // the one he takes
    }
    { const sign = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.28), new THREE.MeshBasicMaterial({ map: tex(makeSignTex(THREE, cnv, 'บทสวดมนต์ · CHANT BOOKS', '#3a0d08', '#f1d38a', 0.32)), toneMapped: false }));
      sign.position.set(0, 1.45, 0.205); shelf.add(sign); }

    // the gold-leaf table: a small seated Buddha patched with leaf, a tray of
    // leaf in paper squares, a candle, a donation box
    const leafT = new THREE.Group(); leafT.position.set(LEAF.x, 0, LEAF.z); leafT.rotation.y = Math.PI / 2; world.add(leafT);
    solids.push(box(1.3, 0.85, 0.65, 0, 0.425, 0, matRedD, leafT));
    box(1.36, 0.04, 0.7, 0, 0.87, 0, matGold, leafT, false);
    const smallBuddha = new THREE.Group(); smallBuddha.position.set(0, 0.89, -0.05); leafT.add(smallBuddha);
    thai('buddha', 0, 0, 0, { s: 1.15, tint: GOLD_T, glow: 0.18, parent: smallBuddha });
    // patches of leaf already on him, and the ones he will add (on his BACK)
    const patchMat = new THREE.MeshStandardMaterial({ color: 0xffe08a, roughness: 0.25, metalness: 0.6, emissive: 0xc8962a, emissiveIntensity: 0.55, side: THREE.DoubleSide });
    const myLeaf = [];
    for (let i = 0; i < 9; i++) {
      const p = new THREE.Mesh(new THREE.PlaneGeometry(0.022, 0.018), patchMat);
      const back = i >= 6;
      p.position.set((hash(i, 1) - 0.5) * 0.16, 0.12 + hash(i, 2) * 0.36, back ? -0.15 : 0.15);
      p.rotation.set(0, back ? Math.PI : 0, hash(i, 3) * 1.2);
      smallBuddha.add(p); if (back) { p.visible = false; myLeaf.push(p); }
    }
    const leafTray = box(0.3, 0.03, 0.22, 0.42, 0.9, 0.12, matWoodL, leafT, false);
    for (let i = 0; i < 6; i++) box(0.06, 0.003, 0.06, 0.32 + (i % 3) * 0.08, 0.918, 0.07 + Math.floor(i / 3) * 0.09, new THREE.MeshStandardMaterial({ color: i % 2 ? 0xf3e7cf : 0xe6cf90, roughness: 0.8 }), leafT, false);
    void leafTray;
    const leafFl = (() => { cyl(0.02, 0.02, 0.2, -0.45, 0.97, 0.15, matCream, 6, leafT);
                           const f = new THREE.Mesh(new THREE.ConeGeometry(0.016, 0.05, 6), matFlame); f.position.set(-0.45, 1.1, 0.15); leafT.add(f); return f; })();
    { const db = box(0.3, 0.42, 0.3, 0.8, 0.21, 0.5, matCol, leafT); solids.push(db);
      box(0.18, 0.01, 0.03, 0.8, 0.425, 0.5, matDark, leafT, false); }
    const flyLeaf = new THREE.Mesh(new THREE.PlaneGeometry(0.04, 0.04), patchMat);
    flyLeaf.visible = false; world.add(flyLeaf);

    // the candle stand behind the rows: a long low gilt rack of lit candles
    // (his shadow, and the crowned one, fall forward from it)
    solids.push(box(CANDLES.x1 - CANDLES.x0, 0.75, 0.4, 0, 0.375, CANDLES.z, matRedD));
    box(CANDLES.x1 - CANDLES.x0 + 0.06, 0.04, 0.46, 0, 0.77, CANDLES.z, matGold, world, false);
    const rackFl = [];
    for (let i = 0; i < 22; i++) {
      const cx = CANDLES.x0 + 0.12 + i * 0.25, h = 0.12 + hash(i, 7) * 0.12;
      cyl(0.016, 0.016, h, cx, 0.79 + h / 2, CANDLES.z, matCream, 6);
      const f = new THREE.Mesh(new THREE.ConeGeometry(0.013, 0.045, 6), matFlame); f.position.set(cx, 0.81 + h, CANDLES.z); world.add(f); rackFl.push(f);
    }

    // the mats: a reed mat under every place in the rows, a book stand before each
    const myStand = new THREE.Group(); world.add(myStand);
    for (let r = 0; r < ROWZ.length; r++) for (let c = 0; c < ROWX.length; c++) {
      const x = ROWX[c], z = ROWZ[r];
      const m = new THREE.Mesh(new THREE.PlaneGeometry(0.85, 0.95), matMat); m.rotation.x = -Math.PI / 2; m.position.set(x, 0.008, z + 0.05); m.receiveShadow = true; world.add(m);
      if (hash(c, r) < 0.6 || (x === PLACE.x && z === PLACE.z)) {
        const st = new THREE.Group(); st.position.set(x, 0, z - 0.52); (x === PLACE.x && z === PLACE.z ? myStand : world).add(st);
        box(0.3, 0.012, 0.2, 0, 0.17, 0, matWood, st, false).rotation.x = -0.6;
        box(0.02, 0.17, 0.02, -0.12, 0.085, 0.04, matWood, st, false); box(0.02, 0.17, 0.02, 0.12, 0.085, 0.04, matWood, st, false);
      }
    }
    // his book, on his stand once he kneels
    const myBook = box(0.15, 0.012, 0.2, 0, 0.185, -0.015, bookMats[0], myStand, false);
    myBook.rotation.x = -0.6; myBook.visible = false;
    myStand.position.set(0, 0, 0);
    // the book in his hand while he walks (on the lens, like chapter 1's tray)
    const handBook = new THREE.Group(); camera.add(handBook); handBook.position.set(0.17, -0.2, -0.38); handBook.rotation.set(-0.9, 0.25, 0.1);
    box(0.1, 0.014, 0.14, 0, 0, 0, bookMats[0], handBook, false);
    box(0.098, 0.012, 0.135, 0, 0.008, 0, new THREE.MeshStandardMaterial({ color: 0xf1e8d4, roughness: 0.9 }), handBook, false);
    handBook.visible = false;

    // the glowing place to kneel (chapter 1's zone, in gold)
    const zone = mkZone(PLACE.x, PLACE.z + 0.05);

    /* -------------------------------------- outside: the porch and the dusk
       The film's last shot and scene B look at the hall from its steps, so
       the front of the building is built: the facade with its gilded doorway
       and gables, a tiled roof, the porch, steps down to the courtyard, the
       slippers on the steps, two lamps, the trees beyond. */
    const outside = new THREE.Group(); world.add(outside);
    // the porch, paved in the courtyard's slabs (flat cream filled the frame in scene B)
    const matPorch = new THREE.MeshStandardMaterial({ map: tex(makeSlabs(THREE, cnv)), roughness: 0.85, color: 0xf2e6d2 });
    matPorch.map.repeat.set(5, 1.3);
    box(HALL.x1 - HALL.x0 + 3, 0.2, 4.0, 0, -0.1, HALL.z1 + 2.45, matPorch, outside);
    // the steps, each one SOLID to the courtyard, and the base the hall and its
    // porch stand on (the first film frames showed thin slabs over blue void)
    for (let i = 0; i < 6; i++) { const top = -0.2 - i * 0.2; box(5.0, top + 1.4, 0.36, 0, (top - 1.4) / 2, HALL.z1 + 4.6 + i * 0.36, matCream, outside); }
    box(HALL.x1 - HALL.x0 + 3, 1.2, HALL.z1 - HALL.z0 + 4.3, 0, -0.8, (HALL.z0 + HALL.z1 + 4.4) / 2, matCream, outside, false);   // the base
    box(HALL.x1 - HALL.x0 + 3.3, 0.08, 0.1, 0, -0.04, HALL.z1 + 4.47, matGold, outside, false);                                        // its gold lip
    // the facade's face: the door framed and crowned in gold OUTSIDE too, two
    // tall shuttered windows with their crowns, and a red-and-gold dado (the
    // first photographs of the doors at dusk showed a blank cream wall)
    { const zf = HALL.z1 + T + 0.03;
      for (const s2 of [-1, 1]) box(0.16, DOOR.h + 0.16, 0.08, s2 * (DOOR.hw + 0.08), DOOR.h / 2, zf, matGold, outside, false);
      box(DOOR.hw * 2 + 0.48, 0.18, 0.08, 0, DOOR.h + 0.09, zf, matGold, outside, false);
      const oc = new THREE.Mesh(new THREE.ShapeGeometry(crownShape(THREE, DOOR.hw * 2 + 0.8, 1.6)), matGoldB);
      oc.position.set(0, DOOR.h + 0.18, zf + 0.01); outside.add(oc);
      for (const s2 of [-1, 1]) {
        const wx = s2 * 2.35;
        box(0.86, 1.9, 0.05, wx, 1.95, zf, matCol, outside, false);                                   // the shutter, lacquer
        box(0.64, 1.6, 0.02, wx, 1.95, zf + 0.03, matGoldB, outside, false);                          // its gilt panel
        for (const s3 of [-1, 1]) box(0.09, 2.06, 0.07, wx + s3 * 0.47, 1.95, zf + 0.01, matGold, outside, false);
        box(1.04, 0.1, 0.07, wx, 0.92, zf + 0.01, matGold, outside, false);
        const wc = new THREE.Mesh(new THREE.ShapeGeometry(crownShape(THREE, 1.2, 0.95)), matGoldB);
        wc.position.set(wx, 2.96, zf + 0.01); outside.add(wc);
      }
      box(HALL.x1 - HALL.x0 + 0.9, 0.5, 0.04, 0, 0.25, zf, matRedD, outside, false);
      box(HALL.x1 - HALL.x0 + 0.9, 0.05, 0.05, 0, 0.52, zf + 0.005, matGold, outside, false); }
    const yard = new THREE.Mesh(new THREE.PlaneGeometry(70, 80), new THREE.MeshStandardMaterial({ map: tex(makeSlabs(THREE, cnv)), roughness: 0.9 }));
    yard.material.map.repeat.set(19, 22);
    yard.rotation.x = -Math.PI / 2; yard.position.set(0, -1.4, HALL.z1 + 8); yard.receiveShadow = true; outside.add(yard);
    for (const s of [-1, 1]) {
      // porch columns, white with gold capitals, and the gables over the porch
      for (const x of [3.2, 6.6]) { box(0.5, 4.8, 0.5, s * x, 2.4, HALL.z1 + 4.0, matWhite, outside); cyl(0.32, 0.45, 0.4, s * x, 4.9, HALL.z1 + 4.0, matGold, 8, outside); }
      const lamp = new THREE.Group(); lamp.position.set(s * 3.4, -1.4, HALL.z1 + 9.0); outside.add(lamp);
      cyl(0.05, 0.07, 3.2, 0, 1.6, 0, matDark, 6, lamp);
      const glow = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 10), matBulb); glow.position.y = 3.3; lamp.add(glow);
      lamp.traverse(o => { o.castShadow = false; });   // (its globe threw two head-shaped shadows on the facade)
    }
    // the roof: two tiers of orange tile over the facade, a gable of red and gold
    function gable(z, w, h, y0, mat, tile) {
      const g = new THREE.Group(); g.position.set(0, y0, z); outside.add(g);
      const tri = new THREE.Mesh(new THREE.ShapeGeometry(triShape(THREE, w, h)), mat); tri.position.z = 0.02; g.add(tri);
      // the naga bargeboards: a gold edge up each side to the chofa at the top
      for (const s of [-1, 1]) {
        const L = Math.hypot(w / 2, h);
        const b = box(L + 0.2, 0.16, 0.12, s * w / 4, h / 2, 0.06, matGold, g, false);
        b.rotation.z = -s * Math.atan2(h, w / 2);
      }
      const chofa = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.06, 6, 12, Math.PI * 1.2), matGold);
      chofa.position.set(0, h + 0.3, 0.06); chofa.rotation.z = 0.6; g.add(chofa);
      return g;
    }
    gable(HALL.z1 + 4.25, 15.0, 3.8, 5.0, new THREE.MeshStandardMaterial({ map: tex(makeGableCarve(THREE, cnv)), roughness: 0.5, metalness: 0.2 }), matTile);
    gable(HALL.z1 + 1.0, 13.6, 4.6, H + 0.6, new THREE.MeshStandardMaterial({ map: tex(makeGableCarve(THREE, cnv)), roughness: 0.5, metalness: 0.2 }), matTile);
    // roof slabs (dark undersides, tiled tops) over the porch and the hall
    for (const [z0, z1, w, h, y0] of [[HALL.z1 + 4.25, HALL.z1 + 0.6, 15.0, 3.8, 5.0], [HALL.z1 + 1.0, HALL.z0 - 0.6, 13.6, 4.6, H + 0.6]]) {
      for (const s of [-1, 1]) {
        const L = Math.hypot(w / 2, h), len = z0 - z1;
        const slab = box(L, 0.14, len, s * w / 4, y0 + h / 2, (z0 + z1) / 2, matTile, outside, false);
        slab.rotation.z = -s * Math.atan2(h, w / 2);
      }
    }
    // the slippers on the porch, Chad's model (v16.9), people's pairs left at the door
    const slipCols = [0x2b5fa6, 0x1d1d1d, 0xa33a2c, 0xd9d2c3, 0x3d6b3c, 0x8a5a2b, 0x5a3f8f, 0xc28d1f, 0x222f4a, 0x7a1f1f];
    parseOnce('slipper').then(gltf => {
      if (!alive) return;
      const one = gltf.scene.getObjectByName('one') || gltf.scene;
      let mesh = null; one.traverse(o => { if (o.isMesh && !mesh) mesh = o; });
      if (!mesh) return;
      const N = 26, im = new THREE.InstancedMesh(mesh.geometry, mesh.material.clone(), N * 2);
      const d = new THREE.Object3D(); let k = 0;
      for (let i = 0; i < N; i++) {
        const row = i % 2, x = -4.6 + Math.floor(i / 2) * 0.72 + (hash(i, 4) - 0.5) * 0.2, z = HALL.z1 + 0.6 + row * 0.55 + (hash(i, 5) - 0.5) * 0.15;
        const ry = (hash(i, 6) - 0.5) * 0.9 + (row ? Math.PI : 0);
        for (const side of [-1, 1]) {
          d.position.set(x + side * 0.07, 0.003, z + (side > 0 ? 0.02 : 0)); d.rotation.set(0, ry + side * 0.06, 0); d.scale.setScalar(1); d.updateMatrix();
          im.setMatrixAt(k, d.matrix); im.setColorAt(k, new THREE.Color(slipCols[i % slipCols.length])); k++;
        }
      }
      im.instanceMatrix.needsUpdate = true; if (im.instanceColor) im.instanceColor.needsUpdate = true;
      im.computeBoundingSphere(); im.castShadow = false; outside.add(im);
    }).catch(err => { console.warn('slipper failed to load', err); ctx.loadFail && ctx.loadFail('slipper', err); });
    // trees beyond the courtyard (the kit, v6.15), seen through the windows and in the film
    const treeSpots = [];
    for (let i = 0; i < 18; i++) {
      const side = i % 2 ? 1 : -1, a = hash(i, 9);
      treeSpots.push({ x: side * (11 + a * 9), z: -24 + i * 2.6 + hash(i, 10) * 2, h: 7 + hash(i, 11) * 5 });
    }
    for (let i = 0; i < 6; i++) treeSpots.push({ x: -14 + i * 5.6, z: HALL.z1 + 17 + hash(i, 12) * 5, h: 8 + hash(i, 13) * 4 });
    let treeStand = null;
    if (plantTrees) treeStand = plantTrees(outside, treeSpots.map(p => ({ x: p.x, y: -1.4, z: p.z, h: p.h })), { seed: 22, tint: 0x6a7090, lowKeep: 0.6 });

    /* ------------------------------------------------------------ the zones */
    function mkZone(x, z) {
      const g = new THREE.Group(); g.position.set(x, 0.02, z); g.visible = false; world.add(g);
      const disc = new THREE.Mesh(new THREE.CircleGeometry(0.5, 32),
        new THREE.MeshBasicMaterial({ color: 0xf2c46a, transparent: true, opacity: 0.22, depthWrite: false, fog: false }));
      disc.rotation.x = -Math.PI / 2; g.add(disc);
      const ring = new THREE.Mesh(new THREE.RingGeometry(0.46, 0.54, 40),
        new THREE.MeshBasicMaterial({ color: 0xffd98a, transparent: true, opacity: 0.8, depthWrite: false, fog: false,
                                      blending: THREE.AdditiveBlending, side: THREE.DoubleSide }));
      ring.rotation.x = -Math.PI / 2; ring.position.y = 0.004; g.add(ring);
      const wave = new THREE.Mesh(new THREE.RingGeometry(0.48, 0.54, 40), ring.material.clone());
      wave.rotation.x = -Math.PI / 2; wave.position.y = 0.006; wave.userData.moves = true; g.add(wave);
      g.userData = { disc, ring, wave };
      return g;
    }
    function zoneTick(g, t) {
      if (!g.visible) return;
      const { disc, ring, wave } = g.userData;
      const k = (t % 2.0) / 2.0;
      wave.scale.setScalar(1 + k * 0.9); wave.material.opacity = 0.7 * (1 - k);
      ring.material.opacity = 0.6 + 0.3 * Math.sin(t * 3.1);
      disc.material.opacity = 0.18 + 0.08 * Math.sin(t * 3.1);
    }

    /* ------------------------------------------------------------- the cast
       THE LAYPEOPLE. Five characters re-posed SITTING ON THE FLOOR (the
       monk's own Sit_Cross_Legged_on_Floor, retargeted in world space by
       tools/retarget.mjs, then simplified for a crowd: masters/v18.0/crowd),
       each dressed in white on a copy of its own texture. A clone is sized
       from its BIND pose (a standing skeleton — the v5.05 law), handed the
       floor take parked on one frame, grounded on its POSED SKIN (v5.21), and
       then its arms are brought into añjali by a two-bone solve (prayArms).
       No mixer runs after that: the pose is the bones' own locals, and only
       a bow, a head or a hero's look writes them again. */
    const KIND = {
      lay_admintee: { h: 1.70, take: 'Sit_Cross_Legged_on_Floor' },
      lay_botak:    { h: 1.68, take: 'Sit_Cross_Legged_on_Floor' },
      lay_granny:   { h: 1.52, take: 'Sit_Cross_Legged_on_Floor' },
      lay_scold:    { h: 1.55, take: 'Sit_Cross_Legged_on_Floor', own: true },   // her patterned sarong cannot be told from her skin by colour: she keeps her own clothes
      lay_sitwoman: { h: 1.60, take: 'Sit_Cross_Legged_on_Floor' },
      admintee:     { h: 1.70, take: 'Chair_Sit_Idle_M' },
      monkrow:      { h: 1.70, take: 'Sit_Cross_Legged_on_Floor' }
    };
    function parseOnce(key) {
      if (!parsedGlb.has(key)) {
        parsedGlb.set(key, assetBytes(key).then(BUF => new Promise((res, rej) =>
          new GLTFLoader().parse(BUF, '', (gltf) => {
            rescueTextures(gltf, BUF);
            res({ scene: gltf.scene, animations: gltf.animations });
          }, rej))));
      }
      return parsedGlb.get(key);
    }
    /* white clothes on a copy of each kind's sheet: every pixel that is not
       skin and not hair goes to a warm white at its own brightness. One copy
       per KIND (every clone of a kind shares it). */
    const whiteCache = new Map();
    /* which texels of a sheet are SKIN (1) or DARK (2: hair, trousers, the
       empty atlas) — everything else is cloth and goes white. Hue alone left
       blotches: a print or a check with skin-hued threads (the first
       photographs had pink and brown flecks all over the white shirts). So a
       texel is skin only when, among the non-dark texels of a 13x13 window
       round it, most are skin-coloured — a skin island stays whole right to
       its edge against the empty atlas, a pattern falls away. Prototyped on
       the five sheets offline before it went in (masters/v18.0 notes). */
    function skinMap(p, W, Hh) {
      const N = W * Hh, raw = new Uint8Array(N);
      for (let n = 0, i = 0; n < N; n++, i += 4) {
        const r = p[i], g = p[i + 1], b = p[i + 2], L = 0.30 * r + 0.59 * g + 0.11 * b;
        const mx = Math.max(r, g, b), mn = Math.min(r, g, b), sat = mx ? (mx - mn) / mx : 0;
        let hue = 0;
        if (mx !== mn) hue = mx === r ? 60 * (((g - b) / (mx - mn)) % 6) : mx === g ? 60 * ((b - r) / (mx - mn) + 2) : 60 * ((r - g) / (mx - mn) + 4);
        if (hue < 0) hue += 360;
        if (L < 42) raw[n] = 2;
        else if (hue >= 4 && hue <= 38 && sat > 0.21 && sat < 0.66 && L > 58 && r > g + 10) raw[n] = 1;
      }
      const R = 6, out = new Uint8Array(N), W1 = W + 1;
      const integ = (cls) => { const S = new Int32Array(W1 * (Hh + 1));
        for (let y = 0; y < Hh; y++) { let row = 0; for (let x = 0; x < W; x++) { row += raw[y * W + x] === cls ? 1 : 0; S[(y + 1) * W1 + x + 1] = S[y * W1 + x + 1] + row; } }
        return S; };
      const S0 = integ(0), S1 = integ(1);
      const box = (S, x0, y0, x1, y1) => S[y1 * W1 + x1] - S[y0 * W1 + x1] - S[y1 * W1 + x0] + S[y0 * W1 + x0];
      for (let y = 0; y < Hh; y++) for (let x = 0; x < W; x++) {
        const n = y * W + x;
        if (raw[n] === 2) { out[n] = 2; continue; }
        const x0 = Math.max(0, x - R), y0 = Math.max(0, y - R), x1 = Math.min(W, x + R + 1), y1 = Math.min(Hh, y + R + 1);
        const sk = box(S1, x0, y0, x1, y1), cl = box(S0, x0, y0, x1, y1);
        if (raw[n] === 1 ? sk > (sk + cl) * 0.62 : sk > (sk + cl) * 0.9) out[n] = 1;   // a cloth texel deep in skin is skin too (a pore, a shadow)
      }
      return out;
    }
    function whiteOf(m) {
      if (whiteCache.has(m)) return whiteCache.get(m);
      const c = m.clone();
      c.roughness = 0.85; c.metalness = 0;
      owned.push({ dispose: () => c.dispose() });
      whiteCache.set(m, c);
      /* the sheet may not have decoded yet when the first clone of a kind is
         dressed (the loader hands textures over asynchronously), so the
         recolour waits for its image rather than giving up on it — the first
         photographs had every admin tee still in olive */
      const paint = (tries) => {
        if (!alive) return;
        const img = m.map && m.map.image;
        if (!img || !img.width) { if (m.map && tries < 150) setTimeout(() => paint(tries + 1), 200); return; }
        try {
          const W = img.width, Hh = img.height, cv = document.createElement('canvas');
          cv.width = W; cv.height = Hh;
          const x = cv.getContext('2d'); x.drawImage(img, 0, 0);
          const d = x.getImageData(0, 0, W, Hh), p = d.data;
          const cls = skinMap(p, W, Hh);
          for (let i = 0, n = 0; i < p.length; i += 4, n++) {
            if (cls[n]) continue;                         // skin, and the dark of hair and trousers, stay
            const L = 0.30 * p[i] + 0.59 * p[i + 1] + 0.11 * p[i + 2];
            const v = Math.min(255, 172 + L * 0.40);
            p[i] = v; p[i + 1] = v * 0.988; p[i + 2] = v * 0.955;
          }
          x.putImageData(d, 0, 0);
          const t = new THREE.CanvasTexture(cv);
          t.colorSpace = m.map.colorSpace; t.flipY = m.map.flipY; t.wrapS = m.map.wrapS; t.wrapT = m.map.wrapT;
          t.anisotropy = 4; madeTex.push(t); c.map = t; c.needsUpdate = true;
        } catch (err) { console.warn('white recolour failed', err); }
      };
      paint(0);
      return c;
    }
    /* a monk's robe: saffron on a copy of the monk's own sheet is already
       his; the crowd monk keeps its own colours */
    const _v = new THREE.Vector3(), _v2 = new THREE.Vector3(), _v3 = new THREE.Vector3(), _q = new THREE.Quaternion(), _q2 = new THREE.Quaternion();
    const boneOf = (r, re) => r.bones.find(b => re.test(b.name)) || null;
    function mkSitter(key, x, z, ry, o = {}) {
      const group = new THREE.Group(); group.position.set(x, o.y || 0, z); group.rotation.y = ry; (o.parent || world).add(group);
      const H0 = (o.h || KIND[key].h) * 0.55;
      const proxy = new THREE.Mesh(new THREE.CapsuleGeometry(0.2, Math.max(0.1, H0 - 0.4), 4, 8), matProxy);
      proxy.position.y = H0 / 2 + 0.1; proxy.castShadow = !LOW; group.add(proxy);
      const r = { key, group, proxy, model: null, bones: [], head: null, headRest: null, spine: [], lookYaw: 0, lookPitch: 0,
                  lookW: 0, lookTo: 0, bow: 0, bowRest: null, ready: false, x, z, ry };
      parseOnce(key).then((gltf) => {
        if (!alive) return;
        const g = cloneSkinned(gltf.scene);
        g.traverse(o2 => {
          if (o2.isBone) r.bones.push(o2);
          if (!o2.isMesh) return;
          o2.castShadow = !LOW && !!o.cast; o2.receiveShadow = false;
          if (o.white !== false && !(KIND[key] && KIND[key].own)) o2.material = Array.isArray(o2.material) ? o2.material.map(whiteOf) : whiteOf(o2.material);
          o2.frustumCulled = true;
          if (o2.isSkinnedMesh) { const sp = new THREE.Sphere(new THREE.Vector3(0, 0.6, 0), 1.3); o2.boundingSphere = sp.clone(); if (o2.geometry) o2.geometry.boundingSphere = sp.clone(); }
        });
        group.add(g); r.model = g;
        // size from the BIND pose (standing)
        g.updateMatrixWorld(true);
        let lo = Infinity, hi = -Infinity;
        for (const b of r.bones) { b.getWorldPosition(_v); lo = Math.min(lo, _v.y); hi = Math.max(hi, _v.y); }
        const crown = r.bones.some(b => /HeadTop_End|head_end/.test(b.name));
        if (isFinite(lo) && hi > lo) g.scale.multiplyScalar((o.h || KIND[key].h) / ((hi - lo) / (crown ? 1 : 0.935)));
        // the floor take, parked on one frame
        const clip = (gltf.animations || []).find(c => c.name === (o.take || KIND[key].take)) || (gltf.animations || [])[0];
        if (clip) {
          const mixer = new THREE.AnimationMixer(g), act = mixer.clipAction(clip);
          act.play(); act.time = clip.duration * (o.at ?? 0.1); act.paused = true; mixer.update(0);
          owned.push({ dispose: () => mixer.stopAllAction() });
        }
        g.updateMatrixWorld(true);
        // grounded on the posed skin (what is actually on the floor)
        let sl = Infinity;
        g.traverse(o2 => {
          if (!o2.isSkinnedMesh) return;
          o2.skeleton.update();
          const n = o2.geometry.attributes.position.count;
          for (let i = 0; i < n; i += 7) { o2.getVertexPosition(i, _v); _v.applyMatrix4(o2.matrixWorld); if (_v.y < sl) sl = _v.y; }
        });
        if (isFinite(sl)) g.position.y += group.position.y + 0.012 - sl;
        g.updateMatrixWorld(true);
        r.head = boneOf(r, /(^|[^A-Za-z])Head(_\d+)?$|mixamorigHead(_\d+)?$/);
        /* the retargeted floor take leaves some heads tipped back at the
           ceiling (the source's neck is not theirs): stand each head up, a
           little bowed, from its own crown bone — chanting people look down
           at the book, not up at the roof */
        if (r.head) {
          const top = r.head.children.find(ch => ch.isBone && /HeadTop|head_end/i.test(ch.name)) || r.head.children.find(ch => ch.isBone);
          if (top) {
            const fwd = new THREE.Vector3(Math.sin(ry), 0, Math.cos(ry));
            const hp = r.head.getWorldPosition(new THREE.Vector3()), tp = top.getWorldPosition(new THREE.Vector3());
            aimBone(r.head, tp.sub(hp).normalize(), new THREE.Vector3(0, 1, 0).multiplyScalar(Math.cos(o.nod ?? 0.22)).addScaledVector(fwd, Math.sin(o.nod ?? 0.22)).normalize());
            g.updateMatrixWorld(true);
          }
          r.headRest = r.head.quaternion.clone();
        }
        r.spine = [boneOf(r, /Spine(_\d+)?$/), boneOf(r, /Spine1(_\d+)?$|Spine01(_\d+)?$/)].filter(Boolean);
        if (o.pray !== false) prayArms(r);
        r.bowRest = r.spine.map(b => ({ b, q: b.quaternion.clone() }));
        proxy.visible = false; r.ready = true;
        if (o.then) o.then(r);
        redoShadows();
      }).catch(err => { console.warn(key + ' failed to load', err); ctx.loadFail && ctx.loadFail(key, err); r.ready = true; });
      return r;
    }
    /* AÑJALI by a two-bone solve, once, in world space: each hand is put in
       front of the chest, a palm's breadth apart, the elbow falling down and
       out (a pole below and outside the shoulder), and the hand turned so its
       fingers point up. Solved on the parked pose, and then left alone. */
    function prayArms(r) {
      const g = r.model; if (!g) return;
      g.updateMatrixWorld(true);
      const fwd = new THREE.Vector3(Math.sin(r.ry), 0, Math.cos(r.ry));
      const side = new THREE.Vector3(fwd.z, 0, -fwd.x);              // the rig's LEFT
      const chestB = boneOf(r, /LeftShoulder(_\d+)?$/);
      const chest = chestB && chestB.parent ? chestB.parent : null;
      if (!chest) return;
      chest.getWorldPosition(_v3);
      const up = new THREE.Vector3(0, 1, 0);
      for (const sd of [1, -1]) {
        const S = sd > 0 ? 'Left' : 'Right';
        const arm = boneOf(r, new RegExp(S + 'Arm(_\\d+)?$')), fore = boneOf(r, new RegExp(S + 'ForeArm(_\\d+)?$')), hand = boneOf(r, new RegExp(S + 'Hand(_\\d+)?$'));
        if (!arm || !fore || !hand) continue;
        const sh = arm.getWorldPosition(new THREE.Vector3()), el = fore.getWorldPosition(new THREE.Vector3()), wr = hand.getWorldPosition(new THREE.Vector3());
        const a = sh.distanceTo(el), b = el.distanceTo(wr);
        const T0 = _v3.clone().addScaledVector(fwd, 0.10 + a * 0.55).addScaledVector(up, -0.09).addScaledVector(side, sd * 0.035);
        const dvec = T0.clone().sub(sh); let dl = dvec.length();
        dl = Math.min(Math.max(dl, Math.abs(a - b) + 0.01), a + b - 0.005);
        const dir = dvec.normalize();
        const pole = up.clone().multiplyScalar(-1).addScaledVector(side, sd * 0.55).addScaledVector(fwd, -0.15).normalize();
        const n = pole.addScaledVector(dir, -pole.dot(dir)).normalize();
        const cosA = (a * a + dl * dl - b * b) / (2 * a * dl), sinA = Math.sqrt(Math.max(0, 1 - cosA * cosA));
        const elbow = sh.clone().addScaledVector(dir, a * cosA).addScaledVector(n, a * sinA);
        aimBone(arm, el.clone().sub(sh).normalize(), elbow.clone().sub(sh).normalize());
        g.updateMatrixWorld(true);
        const el2 = fore.getWorldPosition(new THREE.Vector3()), wr2 = hand.getWorldPosition(new THREE.Vector3());
        const T1 = sh.clone().addScaledVector(dir, dl);
        aimBone(fore, wr2.clone().sub(el2).normalize(), T1.clone().sub(el2).normalize());
        g.updateMatrixWorld(true);
        // the hand: its own length runs on from the forearm; point it up and a little forward
        const el3 = fore.getWorldPosition(new THREE.Vector3()), wr3 = hand.getWorldPosition(new THREE.Vector3());
        const tip = hand.children.find(ch => ch.isBone);
        const hdir = tip ? tip.getWorldPosition(new THREE.Vector3()).sub(wr3).normalize() : wr3.clone().sub(el3).normalize();
        aimBone(hand, hdir, up.clone().multiplyScalar(0.92).addScaledVector(fwd, 0.25).addScaledVector(side, -sd * 0.12).normalize());
        g.updateMatrixWorld(true);
      }
    }
    // turn a bone so that a world direction `from` (its child, now) becomes `to`
    function aimBone(bone, from, to) {
      _q.setFromUnitVectors(from, to);
      bone.getWorldQuaternion(_q2);
      _q2.premultiply(_q);
      const pq = bone.parent ? bone.parent.getWorldQuaternion(new THREE.Quaternion()) : new THREE.Quaternion();
      bone.quaternion.copy(pq.invert().multiply(_q2));
    }
    /* a head's look: ABSOLUTE from its rest (never stacked on itself — the
       v11.5 law; no mixer runs here to put it back) */
    const _e = new THREE.Euler();
    function headTick(r, wdt) {
      if (!r.head || !r.headRest) return;
      r.lookW += (r.lookTo - r.lookW) * (1 - Math.exp(-wdt * 3.2));
      if (r.lookW < 0.002 && r.lookTo === 0) { r.head.quaternion.copy(r.headRest); return; }
      // toward the player, in the head's own terms: yaw by the bearing, pitch down a little
      const dx = yaw.position.x - r.x, dz = yaw.position.z - r.z;
      let a = Math.atan2(dx, dz) - r.ry; while (a > Math.PI) a -= 2 * Math.PI; while (a < -Math.PI) a += 2 * Math.PI;
      a = THREE.MathUtils.clamp(a, -1.25, 1.25);
      _e.set(-0.08 * r.lookW, a * r.lookW, 0, 'YXZ');
      r.head.quaternion.copy(r.headRest).multiply(_q.setFromEuler(_e));
      // a body that turns to look turns the shoulders a little too
      if (r.spine[1] && r.bowRest) {
        const sp = r.bowRest.find(p => p.b === r.spine[1]);
        if (sp && r.bow < 0.01) { _e.set(0, a * 0.35 * r.lookW, 0, 'YXZ'); r.spine[1].quaternion.copy(sp.q).multiply(_q.setFromEuler(_e)); }
      }
    }
    /* the krap: a bow from the waist, hands still together at the chest */
    const _ax = new THREE.Vector3();
    function bowTick(r) {
      if (!r.bowRest || !r.bowRest.length) return;
      if (r.bow < 0.001 && !r.bowWas) return;
      r.bowWas = r.bow > 0.001;
      const side = _ax.set(Math.cos(r.ry), 0, -Math.sin(r.ry));   // the rig's right, in the world
      r.bowRest.forEach((p, i) => {
        const ang = r.bow * (i === 0 ? 0.62 : 0.38);
        const pq = p.b.parent.getWorldQuaternion(_q2);
        const loc = side.clone().applyQuaternion(pq.clone().invert());
        p.b.quaternion.copy(p.q).premultiply(_q.setFromAxisAngle(loc, ang));
      });
    }

    /* the rows: 23 places and his. Three are people in the scene: the woman
       beside him (sitwoman — the hero, nearest the lens), Yai in front of her
       (the granny) with her grandson beside her (the botak recruit, small),
       and the man in front of him. Everyone else is dealt from the four kinds
       on a fixed seed so the rows are varied and the same every load. */
    const deal = ['lay_granny', 'lay_scold', 'lay_admintee', 'lay_botak'];
    const crowd = [];
    let neighbour = null, yai = null, kid = null, frontMan = null;
    const keep = (r, c) => !LOW || r >= 1 && r <= 3 && c <= 3;          // a phone keeps the rows near him
    for (let r = 0; r < ROWZ.length; r++) for (let c = 0; c < ROWX.length; c++) {
      const x = ROWX[c], z = ROWZ[r];
      if (x === PLACE.x && z === PLACE.z) continue;
      const jx = (hash(r, c + 11) - 0.5) * 0.08, jz = (hash(r, c + 13) - 0.5) * 0.08, ry = Math.PI + (hash(r, c + 17) - 0.5) * 0.14;
      let p = null;
      if (x === NEIGH.x && z === NEIGH.z) { p = neighbour = mkSitter('lay_sitwoman', x, z, Math.PI - 0.05, { cast: true, at: 0.15 }); }
      else if (x === YAI.x && z === YAI.z) { p = yai = mkSitter('lay_granny', x, z, Math.PI + 0.06, { cast: true, at: 0.2 }); }
      else if (x === KID.x && z === KID.z) { p = kid = mkSitter('lay_botak', x, z, Math.PI - 0.08, { h: 1.22, cast: true, at: 0.3 }); }
      else if (x === FRONT.x && z === FRONT.z) { p = frontMan = mkSitter('lay_admintee', x, z, Math.PI + 0.03, { cast: true, at: 0.45 }); }
      else if (keep(r, c)) {
        // women on the left of the aisle mostly, men on the right mostly
        const left = x < 0, pick = Math.floor(hash(r * 7 + c, 31) * 100);
        const key = left ? (pick % 4 === 0 ? deal[2 + pick % 2] : deal[pick % 2]) : (pick % 4 === 0 ? deal[pick % 2] : deal[2 + pick % 2]);
        p = mkSitter(key, x + jx, z + jz, ry, { at: hash(r, c) * 0.6 });
      }
      if (p) { crowd.push(p); p.row = r; p.col = c; }
    }
    // the monks, at crowd detail, facing across the hall
    const monks = MONKS.map((m, i) => (LOW && i % 2) ? null : mkSitter('monkrow', m.x, m.z, -Math.PI / 2, { y: MPLAT.h, white: false, pray: i !== 0, at: 0.1 + hash(i, 41) * 0.5, cast: false })).filter(Boolean);

    /* ------------------------------------------- THE THEVADA: SHADOW AND GLIMPSE
       Nothing in this chapter has a body but the people. What rises with his
       hands is seen two ways and never straight on: as HIS SHADOW on the floor
       ahead of his mat, thrown by the candle rack behind him — a kneeling man's
       shadow whose arms rise with his hands and on whose head a tiered crown
       grows as they do — and as a faint gold figure at the EDGE of the frame,
       behind him, that is gone when he turns to look at it. Both are drawn on
       a canvas from the same numbers as the hands. */
    const shadowCv = document.createElement('canvas'); shadowCv.width = 256; shadowCv.height = 256;
    const shadowTex = tex(new THREE.CanvasTexture(shadowCv)); shadowTex.colorSpace = THREE.SRGBColorSpace;
    // thrown LONG by the candle rack behind him, from his knees forward across
    // the light mats of the rows ahead — where a shadow reads (first placed
    // short, on the dark stone under the man in front, it never showed)
    const shadow = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 3.6), new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false, opacity: 0.0, color: 0x000000 }));
    shadow.rotation.x = -Math.PI / 2; shadow.position.set(PLACE.x + 0.05, 0.016, PLACE.z - 0.45 - 1.8); shadow.renderOrder = 2; world.add(shadow);
    const glimCv = document.createElement('canvas'); glimCv.width = 256; glimCv.height = 256;
    const glimTex = tex(new THREE.CanvasTexture(glimCv)); glimTex.colorSpace = THREE.SRGBColorSpace;
    const glimpse = new THREE.Sprite(new THREE.SpriteMaterial({ map: glimTex, transparent: true, depthWrite: false, opacity: 0, blending: THREE.AdditiveBlending, fog: false }));
    glimpse.scale.set(1.5, 1.5, 1); glimpse.position.set(PLACE.x - 0.95, 1.05, PLACE.z + 0.75); glimpse.visible = false; world.add(glimpse);
    /* the figure: kneeling, the body a soft wedge, the head, and — with k —
       a chada crown (three narrowing tiers and a spire) and two arms lifted
       into a dancer's curve with the fingers bent back */
    function drawFigure(x, k, t, gold) {
      const W = 256;
      x.clearRect(0, 0, W, W);
      const cx = W / 2;
      if (gold) {
        const gr = x.createRadialGradient(cx, 120, 6, cx, 120, 120);
        gr.addColorStop(0, `rgba(255,214,120,${0.30 * k})`); gr.addColorStop(1, 'rgba(255,214,120,0)');
        x.fillStyle = gr; x.fillRect(0, 0, W, W);
      }
      x.fillStyle = gold ? 'rgba(255,214,128,0.9)' : 'rgba(0,0,0,1)';
      x.strokeStyle = x.fillStyle; x.lineCap = 'round'; x.lineJoin = 'round';
      // the kneeling body
      x.beginPath(); x.moveTo(cx - 46, 236); x.quadraticCurveTo(cx - 52, 170, cx - 30, 128); x.lineTo(cx + 30, 128);
      x.quadraticCurveTo(cx + 52, 170, cx + 46, 236); x.closePath(); x.fill();
      // the head
      x.beginPath(); x.arc(cx, 108, 17, 0, Math.PI * 2); x.fill();
      // the crown, growing with k
      if (k > 0.05) {
        const c = Math.min(1, (k - 0.05) / 0.6);
        x.globalAlpha = c;
        x.beginPath(); x.moveTo(cx - 15, 98); x.lineTo(cx - 11, 82); x.lineTo(cx + 11, 82); x.lineTo(cx + 15, 98); x.fill();
        x.beginPath(); x.moveTo(cx - 10, 84); x.lineTo(cx - 7, 70); x.lineTo(cx + 7, 70); x.lineTo(cx + 10, 84); x.fill();
        x.beginPath(); x.moveTo(cx - 6, 72); x.lineTo(cx, 30 + 10 * (1 - c)); x.lineTo(cx + 6, 72); x.fill();
        x.globalAlpha = 1;
      }
      // the arms: from the clasp at the chest (k 0) out into the dance (k 1)
      x.lineWidth = 9;
      for (const s of [-1, 1]) {
        const ph = t * (s > 0 ? 0.83 : 0.77) + (s > 0 ? 0 : 1.7);
        const sx = cx + s * 26, sy = 136;
        const ex = cx + s * (12 + 42 * k + 6 * Math.sin(ph) * k), ey = 168 - 34 * k + 8 * Math.sin(ph * 1.3) * k;
        const hx = cx + s * (4 + 64 * k + 10 * Math.sin(ph * 0.9) * k), hy = 140 - 70 * k + 10 * Math.sin(ph * 1.2) * k;
        x.beginPath(); x.moveTo(sx, sy); x.quadraticCurveTo(ex, ey, hx, hy); x.stroke();
        // the hand, fingers curling back
        x.lineWidth = 5;
        x.beginPath(); x.moveTo(hx, hy); x.quadraticCurveTo(hx + s * 10 * k, hy - 14, hx + s * (16 * k + 2), hy - 10 - 6 * k); x.stroke();
        x.lineWidth = 9;
      }
    }
    let figAt = 0;
    function figureTick(wdt, t) {
      const k = kit && kit.getHands ? kit.getHands() : 0;
      const st = getState();
      const on = (st === 'play' || st === 'decide') && seated && k > 0.02;
      // the shadow: always there when he kneels (a plain kneeling shadow at k 0)
      shadow.visible = !!seated && (st === 'play' || st === 'decide' || st === 'cine');
      shadow.material.opacity = seated ? 0.32 + 0.48 * k : 0;
      if (t - figAt > 0.07 && shadow.visible) {
        figAt = t;
        drawFigure(shadowCv.getContext('2d'), k, t, false); shadowTex.needsUpdate = true;
      }
      // the glimpse: only at the edge of the frame, gone when looked at
      let want = 0;
      if (on) {
        camera.getWorldDirection(_v);
        _v2.copy(glimpse.position).sub(camera.getWorldPosition(_v3)).normalize();
        const ang = Math.acos(THREE.MathUtils.clamp(_v.dot(_v2), -1, 1));
        want = k * THREE.MathUtils.smoothstep(ang, 0.42, 0.62) * (1 - THREE.MathUtils.smoothstep(ang, 0.95, 1.2));
      }
      glimpse.material.opacity += (want * 0.55 - glimpse.material.opacity) * (1 - Math.exp(-wdt * (want > glimpse.material.opacity ? 1.2 : 6)));
      glimpse.visible = glimpse.material.opacity > 0.01;
      if (glimpse.visible && t - (figureTick.g || 0) > 0.09) {
        figureTick.g = t; drawFigure(glimCv.getContext('2d'), Math.max(0.4, k), t, true); glimTex.needsUpdate = true;
      }
    }

    /* ------------------------------------------------------ the chapter clock */
    const PHASES = ['book', 'leaf', 'place', 'chant', 'fight', 'peak', 'decide'];
    const pIdx = (p) => PHASES.indexOf(p);
    let phase = 'book';
    let booted = false;
    const dayClock = { t: 0 };
    let lastWall = 0;
    const todo = [];
    function after(secs, fn) { todo.push({ at: dayClock.t + secs, fn }); todo.sort((a, b) => a.at - b.at); }
    function runTodo() { while (todo.length && todo[0].at <= dayClock.t) todo.shift().fn(); }
    function dropTodo() { todo.length = 0; }
    const heard = new Set();
    let seated = null, turning = null, bowing = null, fight = null, leafing = null, peakT = 0;

    const speak = { until: 0, pending: null };
    function speakReset() { speak.until = 0; speak.pending = null; }
    function sayLine(name, vol = 1, onStart, pan) {
      if (!worldSfx) return false;
      if (dayClock.t < speak.until) return false;
      const start = () => { speak.until = dayClock.t + (SECS[name] || 2.5) + 0.25; if (onStart) onStart(); };
      if (worldSfx(name, vol, 1, pan)) { start(); return true; }
      speak.pending = { name, vol, start, pan, give: dayClock.t + 3 };
      speak.until = dayClock.t + 0.2;
      return true;
    }
    function runSpeak() {
      const q = speak.pending;
      if (!q || dayClock.t < speak.until) return;
      if (dayClock.t > q.give) { speak.pending = null; return; }
      if (worldSfx(q.name, q.vol, 1, q.pan)) { speak.pending = null; q.start(); }
      else speak.until = dayClock.t + 0.2;
    }
    const lineQ = [];
    function queueLine(name, onStart, vol = 1) { lineQ.push({ name, onStart, vol }); }
    function runQueue() {
      if (!lineQ.length || speak.pending || dayClock.t < speak.until) return;
      const q = lineQ.shift();
      sayLine(q.name, q.vol, q.onStart, q.name.startsWith('lw2') ? panAt(NEIGH.x, NEIGH.z) : 0);
    }
    function panAt(x, z) {
      const dx = x - yaw.position.x, dz = z - yaw.position.z;
      const a = Math.atan2(dx, -dz) + yaw.rotation.y;
      return THREE.MathUtils.clamp(Math.sin(a) * 0.75, -0.75, 0.75);
    }
    if (warmSounds) warmSounds(['z2leaf', 'z2kneel', 'z2slip1', 'z2slip2', 'z2peak', 'lw2look', 'lw2pull',
                                'pageturn', 'goldleaf', 'matkneel', 'handsrise', 'handslip', 'whispers',
                                'chantswell', 'chantstop', 'templedoor', 'coins', 'e3bell', 'e3gong', 'yantwarm', 'barestep',
                                /* fired from helpers the engine's source scan cannot read (v10.2) */
                                'z2close', 'z2next', 'e3close2', 'step']);

    /* ------------------------------------------------------------ the phases */
    function setPhase(p) {
      phase = p;
      if (kit) kit.setPhase(p);
      objectiveFor(p);
      syncProps();
    }
    function objectiveFor(p) {
      if (!kit) return;
      const W = DATA.words;
      const obj = { book: W.objBook, leaf: W.objLeaf, place: W.objPlace, chant: W.objChant, fight: W.objHands }[p];
      kit.objective(obj || null);
      const wp = { book: { x: SHELF.x, y: 1.3, z: SHELF.z - 0.3 },
                   leaf: { x: LEAF.x + 0.3, y: 1.3, z: LEAF.z },
                   place: { x: PLACE.x, y: 0.9, z: PLACE.z } }[p];
      kit.waypoint(wp || null);
    }
    function syncProps() {
      const i = pIdx(phase);
      handBook.visible = i >= 1 && i <= 2 && !seated && getState() === 'play';
      myBook.visible = !!seated || i >= 3;
      zone.visible = phase === 'place' && !seated;
      for (const b of books) b.visible = i < 1;
      for (let k = 0; k < myLeaf.length; k++) myLeaf[k].visible = i >= 2 || (leafing && k < (leafing.n || 0));
    }

    /* 1 · THE BOOK */
    function takeBook() {
      if (phase !== 'book') return false;
      if (worldSfx) worldSfx('pageturn', 0.8);
      if (kit) kit.conduct({ note: 'Took a chant book, like everyone else.', s: 0, a: 2 });
      setPhase('leaf');
      return true;
    }
    /* 2 · THE GOLD LEAF — on the image's BACK, where nobody sees it */
    function pressLeaf() {
      if (phase !== 'leaf' || leafing) return false;
      if (worldSfx) { worldSfx('coins', 0.55); after(0.8, () => worldSfx('goldleaf', 0.85)); }
      leafing = { t0: dayClock.t, n: 0 };
      after(1.2, () => queueLine('z2leaf'));
      after(4.6, () => {
        leafing = null;
        if (kit) kit.conduct({ note: 'Pressed gold leaf on the back of the Buddha, where nobody sees it.', s: 2, a: 3 });
        setPhase('place');
      });
      return true;
    }
    function leafTick() {
      if (!leafing) { flyLeaf.visible = false; return; }
      const t = dayClock.t - leafing.t0;
      // a square of leaf lifts from the tray and settles on his back, three times
      const k = (t - 0.6) / 1.1;
      if (k > 0 && k < 3) {
        const i = Math.floor(k), u = k - i;
        const from = leafT.localToWorld(_v.set(0.32 + i * 0.08, 0.95, 0.07));
        const to = myLeaf[i].getWorldPosition(_v2);
        flyLeaf.visible = u < 0.95;
        flyLeaf.position.lerpVectors(from, to, smooth(u)); flyLeaf.position.y += Math.sin(u * Math.PI) * 0.12;
        flyLeaf.rotation.set(u * 3, u * 2, 0);
        if (u > 0.9) leafing.n = Math.max(leafing.n, i + 1);
      } else flyLeaf.visible = false;
      syncProps();
    }
    /* 3 · THE MAT: step into the glow and he kneels, the book on his stand,
       hands together, facing the Buddha */
    const faceBuddha = () => Math.atan2(-(0 - PLACE.x), -(PED.z - PLACE.z));
    function kneel() {
      if (phase !== 'place' || seated) return;
      seated = 'mat';
      yaw.position.x = PLACE.x; yaw.position.z = PLACE.z;
      if (kit) kit.root(true);
      if (worldSfx) worldSfx('matkneel', 0.8);
      turnTo(faceBuddha(), 1.0, { y: 0.98, span: 1.35, lo: -0.75, hi: 0.55 }, () => {
        if (kit && kit.pray) kit.pray(true, { secs: 1.2, y: -0.33 });
      });
      syncProps();
      setPhase('chant');
      chantSeq();
    }
    function turnTo(to, secs, o, done) {
      turning = { t: 0, from: yaw.rotation.y, to, secs, y: o.y, span: o.span, lo: o.lo, hi: o.hi, done };
    }
    function turnTick(wdt) {
      if (!turning) return;
      const T2 = turning;
      T2.t += wdt / T2.secs;
      const k = smooth(Math.min(1, T2.t));
      let d = T2.to - T2.from; while (d > Math.PI) d -= Math.PI * 2; while (d < -Math.PI) d += Math.PI * 2;
      yaw.rotation.y = T2.from + d * k;
      if (kit) kit.pose('lying', { y: T2.y, yaw: yaw.rotation.y, span: 0.02, pitchLo: T2.lo, pitchHi: T2.hi, secs: 0.9 });
      if (T2.t >= 1) {
        turning = null;
        if (kit) kit.pose('lying', { y: T2.y, yaw: T2.to, span: T2.span, pitchLo: T2.lo, pitchHi: T2.hi, secs: 0.05 });
        if (T2.done) T2.done();
      }
    }
    /* 4 · THE CHANT: the hall bows three times (the krap) and he bows with
       it; the bell; his line to himself; and then the swells */
    function chantSeq() {
      after(1.6, () => { if (worldSfx) worldSfx('e3bell', 0.5, 1, panAt(0, PED.z)); bowing = { t0: dayClock.t }; });
      after(9.2, () => queueLine('z2kneel'));
      after(14.5, () => beginFight());
    }
    function bowTickAll() {
      const t = bowing ? dayClock.t - bowing.t0 : -1;
      for (const r of crowd) {
        let b = 0;
        if (t >= 0) {
          const off = hash(r.row || 0, (r.col || 0) + 3) * 0.35;
          for (const [a0, a1] of [[0.2, 2.2], [2.5, 4.5], [4.8, 6.8]]) {
            const u = (t - off - a0) / (a1 - a0);
            if (u > 0 && u < 1) b = Math.sin(u * Math.PI);
          }
        }
        r.bow = b;
      }
      // he bows too, with them (the lens goes down and comes back up)
      if (t >= 0 && t < 7.3 && seated && !fight) {
        let dip = 0;
        for (const [a0, a1] of [[0.25, 2.25], [2.55, 4.55], [4.85, 6.85]]) { const u = (t - a0) / (a1 - a0); if (u > 0 && u < 1) dip = Math.sin(u * Math.PI); }
        pitch.rotation.x = -0.10 - dip * 0.62;
      }
      if (t > 7.6) bowing = null;
    }
    /* 5 · THE HANDS — the resist event. The chant swells three times; the
       hands follow the event's k; every slip turns a head and costs the
       player; the third swell beats the grip whatever he does. */
    function yantOn() { return kit && ['yantgaoyord', 'yanthahtaew', 'yantsroi'].some(id => kit.equipped(id)); }
    function beginFight() {
      if (phase !== 'chant' || fight) return;
      setPhase('fight');
      fight = { slips: 0, k: 0 };
      if (!kit) return;
      /* (Chad, 3 Oct) a RAPID-TAP fight: every tap pulls the hands back down;
         the rate it takes climbs from 5.5 to 7.5 taps a second over twelve
         seconds of chant; one second too slow and they are gone. */
      kit.event({
        kind: 'resist', label: DATA.words.evHands, brief: DATA.words.evHandsBrief, demo: 'rapid',
        secs: 12, rate0: 5.5, rate1: 7.5, window: 0.75, grace: 1.0, lead: 0.6,
        award: { stat: 'sanity', lo: -10, hi: 6 },
        onBegin: () => {
          if (!worldSfx) return;
          worldSfx('e3gong', 0.45, 1, panAt(MONKS[0].x, MONKS[0].z));
          // the chant swells under it three times as the rate climbs
          worldSfx('chantswell', 0.7, 1, 0);
          after(4.2, () => { if (fight && !fight.result && worldSfx) worldSfx('chantswell', 0.8, 1, 0); });
          after(8.4, () => { if (fight && !fight.result && worldSfx) { worldSfx('chantswell', 0.9, 1, 0); worldSfx('handsrise', 0.7, 1, 0); } });
          // the yant he chose in chapter 1 warms on his back
          if (yantOn()) { kit.flash({ color: 'rgba(255,196,96,0.22)', secs: 0.9 }); worldSfx('yantwarm', 0.55); }
        },
        onRise: (k, danger) => {
          // the hands rise exactly as close as the player is to losing them,
          // and a little tremble rides on them while he holds
          fight.k = k;
          if (kit.hands) kit.hands(Math.min(1, 0.06 + k * 0.85), { secs: 0.12 });
          if (k > 0.35 && !fight.warned) { fight.warned = true; if (worldSfx) worldSfx('handsrise', 0.6, 1, 0); }
          if (k < 0.05) fight.warned = false;
          void danger;
        },
        onSlip: () => {
          // LOST: the hands are no longer his
          fight.slips++;
          if (worldSfx) { worldSfx('handslip', 1.0); worldSfx('chantswell', 0.9, 0.96, 0); }
          if (kit.haptic) kit.haptic([60, 30, 90, 30, 120]);
          kit.flash({ color: 'rgba(255,120,80,0.28)', secs: 0.6 });
          if (neighbour) neighbour.lookTo = 1;
          if (frontMan) frontMan.lookTo = 1;
          queueLine('z2slip1');
          if (worldSfx) worldSfx('whispers', 0.5, 1, panAt(NEIGH.x, NEIGH.z));
        }
      }).then(r => {
        fight.result = r;
        if (r && !r.aborted) {
          kit.conduct({ note: r.ok ? 'Kept your hands down through the chant.' : 'Lost your hands to the chant, in front of everyone.', s: 0, a: r.ok ? 4 : -2, minigame: !r.ok });
          beginPeak(!!r.ok);
        }
      });
    }
    /* 6 · THE PEAK: whatever the score, it takes them; the faces turn; his
       line; and the decision opens by itself */
    function beginPeak(held) {
      if (phase !== 'fight') return;
      setPhase('peak');
      peakT = dayClock.t;
      if (held) {
        /* HELD: the chant ends and his hands are still his — pressed down,
           shaking in the clasp; one face has seen; it is not over */
        if (kit) { kit.hands(0.32, { secs: 1.2 }); kit.presence(0.25); }
        if (worldSfx) worldSfx('handsrise', 0.5, 0.9, 0);
        after(1.0, () => { if (neighbour) neighbour.lookTo = 1; });
        after(1.6, () => queueLine('z2peak'));
        after(4.6, () => { setPhase('decide'); if (getState() === 'play') startDecision(); });
        return;
      }
      /* LOST: it takes them all the way up; the faces turn */
      if (kit) { kit.hands(1, { secs: 2.4 }); kit.presence(0.55); }
      if (worldSfx) { worldSfx('chantswell', 0.9, 0.96, 0); worldSfx('handsrise', 0.9, 0.85, 0); }
      if (yantOn() && kit) kit.flash({ color: 'rgba(255,196,96,0.28)', secs: 1.4 });
      after(0.8, () => { if (neighbour) neighbour.lookTo = 1; });
      after(1.4, () => { if (yai) yai.lookTo = 1; if (worldSfx) worldSfx('whispers', 0.6, 1, panAt(YAI.x, YAI.z)); });
      after(1.9, () => { if (frontMan) frontMan.lookTo = 1; if (kid) kid.lookTo = 1; });
      after(2.0, () => queueLine('z2peak'));
      after(5.2, () => { setPhase('decide'); if (getState() === 'play') startDecision(); });
    }

    /* ------------------------------------------------------------- hotspots
       Anchors at EYE height (the v7.5 law), on the thing itself. */
    const hotspots = [
      { id: 'book', pos: { x: SHELF.x, y: 1.25, z: SHELF.z - 0.25 }, radius: 2.4, prompt: DATA.words.hotBook,
        enabled: () => phase === 'book', onInteract() { return takeBook(); } },
      { id: 'leaf', pos: { x: LEAF.x + 0.35, y: 1.3, z: LEAF.z }, radius: 2.3, prompt: DATA.words.hotLeaf,
        enabled: () => phase === 'leaf' && !leafing, onInteract() { return pressLeaf(); } }
    ];

    /* ------------------------------------------------------------- the pile
       HIS OWN PLACE IS THE PILE: at the peak the decision opens by itself; a
       player who closes it chooses again from where he kneels. */
    const PILE_POS = new THREE.Vector3(PLACE.x, 0, PLACE.z - 0.6);
    const INTERACT_R = 2.0;
    const pile = new THREE.Group(); pile.position.copy(PILE_POS); world.add(pile);
    const _ndc = new THREE.Vector3();
    const syncCamera = () => { camera.updateWorldMatrix(true, false); camera.matrixWorldInverse.copy(camera.matrixWorld).invert(); };
    function pileDist() { return Math.hypot(yaw.position.x - PILE_POS.x, yaw.position.z - PILE_POS.z); }
    function pileScreen() { syncCamera(); return _ndc.set(PILE_POS.x, 0.6, PILE_POS.z - 1.0).project(camera); }
    function pileLive() { return phase === 'decide'; }
    function pileInView() {
      if (!pileLive()) return false;
      const n = pileScreen();
      return n.z < 1 && Math.abs(n.x) < 0.97 && Math.abs(n.y) < 0.97;
    }
    function pointerHitsPile() { return pileLive() && pileDist() < INTERACT_R; }
    function interactPile() {
      if (getState() !== 'play' || pileDist() >= INTERACT_R || phase !== 'decide') return false;
      startDecision(); return true;
    }

    /* ---------------------------------------------------------- per frame */
    function inHall(x, z) { return x > HALL.x0 && x < HALL.x1 && z > HALL.z0 && z < HALL.z1; }
    function watchTick() {
      const x = yaw.position.x, z = yaw.position.z;
      if (phase === 'place' && !seated && Math.hypot(x - PLACE.x, z - PLACE.z) < 0.55) kneel();
    }
    /* THE BEDS: the room tone always; the chant louder in the rows than by
       the door, and FULL through the fight and the peak; the dusk outside
       only near the doors; the tension bed only while the hands fight him */
    let lastMix = 0;
    const mixK = { chant: 0.3, pull: 0, dusk: 0.2 };
    function mixBeds(wdt) {
      const st0 = getState(), st = st0 === 'choose' || st0 === 'unlock' ? 'play' : st0;
      const z = yaw.position.z;
      const nearDoor = THREE.MathUtils.clamp((z + 3) / 5, 0, 1);
      let chant = 0.32 + 0.22 * (1 - nearDoor), pull = 0;
      if (st === 'play') {
        if (phase === 'chant') chant = 0.62;
        if (phase === 'fight') { chant = 0.68; pull = 0.30 + 0.35 * (fight ? fight.k : 0); }
        if (phase === 'peak' || phase === 'decide') { chant = 0.72; pull = 0.62; }
      } else if (st === 'decide') { chant = 0.6; pull = 0.5; }
      else if (st !== 'cine') { chant = 0.3; }
      /* the opening film has its own sounds: the hall is not heard under the
         memories (play's first frame has not come yet — `booted` — so this is
         the film and never an ending) */
      const film = st === 'cine' && !booted;
      if (film) { chant = 0; pull = 0; }
      mixK.chant += (chant - mixK.chant) * (1 - Math.exp(-wdt / (film ? 0.2 : 1.0)));
      mixK.pull += (pull - mixK.pull) * (1 - Math.exp(-wdt / 1.4));
      mixK.dusk += ((film ? 0 : 0.08 + 0.32 * nearDoor) - mixK.dusk) * (1 - Math.exp(-wdt / (film ? 0.2 : 1.2)));
      DATA.ambience.beds[0][1] = film ? 0 : 0.40;
      DATA.ambience.beds[1][1] = mixK.chant;
      DATA.ambience.beds[2][1] = mixK.pull;
      DATA.ambience.beds[3][1] = mixK.dusk;
    }
    function lifeTick(t, wdt) {
      for (const f of fans) f.rotation.y += wdt * 2.4;
      for (let i = 0; i < candleFl.length; i++) candleFl[i].scale.y = 1 + Math.sin(t * 11 + i * 1.7) * 0.18 + Math.sin(t * 23 + i) * 0.08;
      for (let i = 0; i < rackFl.length; i++) rackFl[i].scale.y = 1 + Math.sin(t * 9 + i * 2.3) * 0.2;
      leafFl.scale.y = 1 + Math.sin(t * 12) * 0.2;
      for (let i = 0; i < chand.length; i++) chand[i].rotation.y = Math.sin(t * 0.2 + i) * 0.04;
      rowLight.intensity = 5.5 * (0.92 + 0.08 * Math.sin(t * 7.3) * Math.sin(t * 3.1));
      const a = smoke.geometry.attributes.position, seed = smoke.userData.seed, N = seed.length;
      for (let i = 0; i < N; i++) {
        const k = ((t * 0.11 + seed[i]) % 1);
        a.array[i * 3] = ALT.x + Math.sin(k * 9 + i) * 0.06 * (1 + k * 3);
        a.array[i * 3 + 1] = 0.9 + k * 1.9;
        a.array[i * 3 + 2] = ALT.z + 0.18 + Math.cos(k * 7 + i) * 0.05 * (1 + k * 2);
      }
      a.needsUpdate = true;
      zoneTick(zone, t);
    }
    function peopleTick(wdt) {
      for (const r of crowd) { if (!r.ready || !r.model) continue; bowTick(r); }
      for (const r of crowd) if (r.ready && (r.lookTo > 0 || r.lookW > 0.002)) headTick(r, wdt);
      for (const r of monks) if (r.ready && (r.lookTo > 0 || r.lookW > 0.002)) headTick(r, wdt);
    }
    function updateNotes(dt, t) {
      const nowW = performance.now() / 1000;
      const wdt = lastMix ? Math.min(0.5, nowW - lastMix) : 0;
      lastMix = nowW;
      lifeTick(t, wdt);
      mixBeds(wdt);
      peopleTick(wdt);
      figureTick(wdt, t);
      handBook.visible = getState() === 'play' && pIdx(phase) >= 1 && pIdx(phase) <= 2 && !seated;
      if (getState() !== 'play') { lastWall = 0; return; }
      const now = performance.now() / 1000;
      if (lastWall) dayClock.t += Math.min(0.5, now - lastWall);
      lastWall = now;
      if (!booted) { booted = true; applyPhase(kit ? kit.getPhase() : null); }
      runTodo(); runSpeak(); runQueue();
      watchTick(); turnTick(wdt); bowTickAll(); leafTick();
    }
    function updatePile() {}
    function updateFire() {}
    function updateSlow() {}

    /* ------------------------------------------------------------ a resume
       Every phase is its own receipt. A resume inside the chant or the fight
       kneels him again and starts the chant over (the hands begin still); a
       resume at the decision kneels him at the peak, hands up, and asks. */
    function applyPhase(p) {
      if (!PHASES.includes(p)) p = 'book';
      seated = null; turning = null; bowing = null; fight = null; leafing = null;
      for (const r of [neighbour, yai, kid, frontMan]) if (r) { r.lookTo = 0; }
      if (kit) { kit.pose('standing', { secs: 0.05 }); kit.root(false); if (kit.pray) kit.pray(false, { secs: 0 }); if (kit.hands) kit.hands(0, { secs: 0 }); kit.presence(0); }
      if (p === 'chant' || p === 'fight') p = 'place';
      if (p === 'peak' || p === 'decide') {
        yaw.position.x = PLACE.x; yaw.position.z = PLACE.z; yaw.rotation.y = faceBuddha();
        seated = 'mat';
        if (kit) {
          kit.root(true);
          kit.pose('lying', { y: 0.98, yaw: faceBuddha(), span: 1.35, pitchLo: -0.75, pitchHi: 0.55, secs: 0.05 });
          if (kit.pray) kit.pray(true, { secs: 0, y: -0.33 });
          if (kit.hands) kit.hands(1, { secs: 0.6 });
          kit.presence(0.5);
        }
        for (const r of [neighbour, yai, frontMan]) if (r) r.lookTo = 1;
        setPhase('decide');
        return;
      }
      setPhase(p);
    }

    /* ---------------------------------------------------------- lifecycle */
    function snap() { return { phase }; }
    function restore() {
      if (kit) kit.root(false);
      handBook.visible = false;
      for (const l of leaves) l.rotation.y = Math.sign(l.position.x) * 1.45;
    }
    function reset() {
      dropTodo(); speakReset(); lineQ.length = 0; heard.clear();
      booted = false; dayClock.t = 0; lastWall = 0;
      seated = null; turning = null; bowing = null; fight = null; leafing = null; peakT = 0;
      for (const r of crowd) { r.bow = 0; r.lookTo = 0; r.lookW = 0; }
      for (const l of leaves) l.rotation.y = Math.sign(l.position.x) * 1.45;
      if (kit) {
        kit.root(false); kit.pose('standing', { secs: 0.05 });
        if (kit.pray) kit.pray(false, { secs: 0 });
        if (kit.hands) kit.hands(0, { secs: 0 });
        kit.presence(0);
        kit.setPhase('book');
      }
      phase = 'book';
      syncProps();
    }
    function blockers() {
      const out = [];
      const b = (o, pad = 0.20) => { o.updateWorldMatrix(true, false); const bb = new THREE.Box3().setFromObject(o); bb.expandByScalar(pad); out.push(bb); };
      const solid = (o, pad = 0.14) => { o.updateWorldMatrix(true, false); const bb = new THREE.Box3().setFromObject(o); bb.expandByScalar(pad); bb.min.y = 0; bb.max.y = Math.max(bb.max.y, 1.40); out.push(bb); };
      for (const w of walls) b(w);
      for (const s of solids) solid(s);
      // the rows: the people are there, so the mats are not walked on — but
      // HIS mat is reached from the west aisle (the row's west end is open)
      for (const z of ROWZ) {
        out.push(new THREE.Box3(new THREE.Vector3(-2.45, 0, z - 0.42), new THREE.Vector3(-0.45, 1.4, z + 0.42)));
        out.push(new THREE.Box3(new THREE.Vector3(0.45, 0, z - 0.42), new THREE.Vector3(3.35, 1.4, z + 0.42)));
        if (z !== PLACE.z) out.push(new THREE.Box3(new THREE.Vector3(-3.35, 0, z - 0.42), new THREE.Vector3(-2.45, 1.4, z + 0.42)));
      }
      return out;
    }
    function dispose() {
      alive = false;
      if (treeStand) treeStand.userData.disposeTrees?.();
      camera.remove(handBook);
      const geos = new Set(), mats = new Set();
      const sweep = (root) => root.traverse(o => {
        if (o.geometry) geos.add(o.geometry);
        if (o.material) for (const m of (Array.isArray(o.material) ? o.material : [o.material])) mats.add(m);
      });
      sweep(world); sweep(handBook);
      scene.remove(world);
      for (const o of owned) { if (o.parent) o.parent.remove(o); o.dispose?.(); }
      owned.length = 0;
      for (const g of geos) g.dispose();
      for (const m of mats) {
        for (const k of ['map', 'roughnessMap', 'normalMap', 'emissiveMap', 'alphaMap']) m[k]?.dispose?.();
        m.dispose();
      }
      for (const t of madeTex) t?.dispose?.();
      world.clear();
      S = null;
    }

    /* ============================================================ THE FILM SETS
       Five pockets far outside the hall (the far plane is 160 m: distance
       does the hiding, v8.9). Fog-free, painted light (the v4.9 recipe). */
    const film = buildFilm(ctx, world, { tex, parseOnce, thai, box, cyl, alive: () => alive, owned, mkSitter, whiteOf, matFloor, matMat, matCream, matFlame, matGold, matDark, matWood, makeSignTex, KIND, HALL });
    function filmTick(t) { if (getState() === 'cine') film.tick(t); }

    const readyAt = performance.now();
    return (S = {
      world, noteTex, blockers: blockers(),
      ready: () => (crowd.every(r => r.ready) && monks.every(r => r.ready)) || performance.now() - readyAt > 15000,
      pile: { pos: PILE_POS, radius: INTERACT_R, group: pile,
              dist: pileDist, screen: pileScreen, inView: pileInView,
              hits: pointerHitsPile, interact: interactPile,
              glow: () => 0 },
      drum: null, ash: null, embers: null, heroNote: null, smoke: null, flying: null,
      jossTips: [], fireLight: null,
      get noteStorm() { return 1; },
      set noteStorm(v) {},
      stepSound: () => (inHall(yaw.position.x, yaw.position.z) ? 'barestep' : null),
      // the chapter's own, for the film and the scenes
      HALL, DOOR, PLACE, NEIGH, YAI, KID, FRONT, PED, ALT, MONKS, SHELF, LEAF, CANDLES, ROWZ, ROWX,
      neighbour: () => neighbour, yai: () => yai, kid: () => kid, frontMan: () => frontMan, crowd, monks,
      shadow, glimpse, drawShadow: (k, t) => { drawFigure(shadowCv.getContext('2d'), k, t, false); shadowTex.needsUpdate = true; },
      lookAll: (k) => { for (const r of crowd) r.lookTo = k; for (const r of monks) r.lookTo = k; },
      leaves, film, myBook, myStand,
      get phase() { return phase; },
      setPhase, applyPhase, after, dayClock, sayLine,
      info: () => ({ phase, seated, t: +dayClock.t.toFixed(2), queued: lineQ.length, heard: [...heard],
                     until: +speak.until.toFixed(2), pending: speak.pending ? speak.pending.name : null,
                     fight: fight ? { k: +(fight.k || 0).toFixed(2), slips: fight.slips, swell: fight.swell } : null,
                     crowd: crowd.length, crowdReady: crowd.filter(r => r.ready).length, monks: monks.length,
                     beds: DATA.ambience.beds.map(b => [b[0], +b[1].toFixed(3)]) }),
      hotspots,
      updateNotes: (dt, t) => { updateNotes(dt, t); filmTick(t); },
      updatePile, updateFire, updateSlow,
      snap, restore, reset, dispose
    });
  }

  /* ============================================================ THE FILM SETS
     Four pockets 300 m out (the far plane is 160 m: none sees another or the
     hall, v8.9), every material unlit and fog-free (the v4.9 recipe — a
     memory has its own light painted in), and the hall's own front for the
     last shot. Nothing here casts a shadow. */
  function buildFilm(ctx, world, h) {
    const { THREE, cnv, LOW } = ctx;
    const root = new THREE.Group(); world.add(root);
    const basic = (o) => new THREE.MeshBasicMaterial({ fog: false, ...o });
    const fbox = (w, hh, d, x, y, z, m, p) => { const b = new THREE.Mesh(new THREE.BoxGeometry(w, hh, d), m); b.position.set(x, y, z); p.add(b); return b; };
    const P = { yant: { x: 300, z: 0 }, office: { x: 0, z: 300 }, flat: { x: -300, z: 0 }, floor: { x: 0, z: -300 } };
    const pock = (o) => { const g = new THREE.Group(); g.position.set(o.x, 0, o.z); root.add(g); return g; };

    /* 1 · THE SECOND YANT: no room, only what is in front of the lens — a
       bare shoulder, the healed first yant beside new lines going in, the
       steel tip of the rod, one lamp's warmth. */
    const Y = pock(P.yant);
    const skinTex = h.tex(makeBackSkin(THREE, cnv));
    /* a man's back, from behind and a little above: the torso a tapered
       cylinder flattened front to back (its −z face, u = 0.5, is the one the
       lens sees — the yant is painted there), the shoulders' round, the neck
       and the dark nape of the head at the top of the frame. Unlit paint with
       the shading drawn in (the spine's groove, the blades), as the other
       pockets are. (The first cut was one half-sphere: on screen an egg.) */
    const skinM = basic({ map: skinTex });
    const skinFlat = basic({ color: 0xa4704e });
    const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.205, 0.165, 0.62, 64, 1, true), skinM);
    torso.scale.z = 0.58; torso.position.set(0, 1.12, 0); Y.add(torso);
    for (const sx of [-1, 1]) {
      const sh = new THREE.Mesh(new THREE.SphereGeometry(0.075, 24, 16), skinFlat);
      sh.scale.set(1.25, 0.8, 0.95); sh.position.set(sx * 0.19, 1.405, 0.0); Y.add(sh);
    }
    const yoke = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.205, 0.07, 48, 1, false), skinFlat);
    yoke.scale.z = 0.58; yoke.position.set(0, 1.465, 0); Y.add(yoke);
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.062, 0.12, 24), skinFlat); neck.position.set(0, 1.55, 0.01); Y.add(neck);
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.1, 32, 24), basic({ color: 0x15110e })); head.scale.set(0.92, 1.08, 1.0); head.position.set(0, 1.69, 0.03); Y.add(head);
    const back = torso;
    // the lamp's warmth: BEHIND the shoulder, a rim round it (the lens is at
    // z −0.6 looking +z, so the plane must not stand between them)
    const lampG = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 1.8), basic({ map: h.tex(makeGlow(THREE, cnv, '255,190,110')), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide }));
    lampG.position.set(0.5, 1.6, 0.4); Y.add(lampG);
    fbox(6, 6, 0.1, 0, 2, 1.6, basic({ color: 0x0c0806 }), Y);
    const rod = new THREE.Group(); Y.add(rod);
    { const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.0022, 0.0042, 0.62, 10), basic({ color: 0x5c6166 }));
      shaft.rotation.x = Math.PI / 2; shaft.position.z = -0.31; rod.add(shaft);
      const tip = new THREE.Mesh(new THREE.ConeGeometry(0.004, 0.03, 6), basic({ color: 0x1a1a1a })); tip.rotation.x = -Math.PI / 2; tip.position.z = 0.015; rod.add(tip); }
    rod.rotation.set(0.35, -0.5, 0);

    /* 2 · HIS BUSINESS, BIGGER: a ROADEYE shopfront office at evening — the
       lit sign, staff at their desks, boxes to the ceiling, the van at the
       kerb with its side door open and then slammed */
    const O = pock(P.office);
    const street = new THREE.Mesh(new THREE.PlaneGeometry(40, 24), basic({ color: 0x1a1c22 })); street.rotation.x = -Math.PI / 2; street.position.set(0, 0, 4); O.add(street);
    fbox(40, 0.15, 3.2, 0, 0.075, -0.4, basic({ color: 0x5b5a58 }), O);                           // the pavement
    fbox(16, 6, 0.3, 0, 3, -6.2, basic({ color: 0x2a2724 }), O);                                  // the back wall
    fbox(16, 0.1, 6, 0, 3.4, -3.2, basic({ color: 0xe8ecf0 }), O);                                // the lit ceiling
    fbox(16, 0.05, 6, 0, 0.16, -3.2, basic({ color: 0x8c8a86 }), O);                              // the floor
    for (const sx of [-1, 1]) fbox(0.3, 4.2, 0.3, sx * 7.5, 2.1, -1.0, basic({ color: 0x3a3836 }), O);
    fbox(15.2, 0.6, 0.25, 0, 3.75, -1.0, basic({ map: h.tex(h.makeSignTex(THREE, cnv, 'ROADEYE  ·  DASHCAMS', '#0c1a33', '#ffd25a', 0.18)) }), O);
    const glass = new THREE.Mesh(new THREE.PlaneGeometry(14.6, 3.2), basic({ color: 0x9fc4e8, transparent: true, opacity: 0.12, depthWrite: false })); glass.position.set(0, 1.75, -1.0); O.add(glass);
    const boxTex = h.tex(makeBoxTex(THREE, cnv));
    const boxMat = basic({ map: boxTex });
    for (let i = 0; i < 64; i++) { const c = i % 8, r = Math.floor(i / 8); if (r > 5 - (c % 3)) continue; fbox(0.62, 0.42, 0.5, -6.2 + c * 0.64, 0.4 + r * 0.43, -5.6, boxMat, O); }
    for (let i = 0; i < 3; i++) {
      const dx = -1.8 + i * 2.6;
      fbox(1.6, 0.06, 0.8, dx, 0.78, -3.0, basic({ color: 0xd8d2c6 }), O);
      fbox(0.55, 0.36, 0.04, dx, 1.05, -3.3, basic({ color: 0x14202e }), O);
      fbox(0.5, 0.31, 0.01, dx, 1.05, -3.27, basic({ color: 0x6fa8dc }), O);
      fbox(0.48, 0.45, 0.48, dx, 0.42, -2.25, basic({ color: 0x23262b }), O);   // the chair
    }
    // (the take folds a man over his knees through its middle: parked on its
    // upright frames, its first eighth and last sixth — v8.0's measure)
    const staff = [0, 1, 2].map(i => h.mkSitter('admintee', -1.8 + i * 2.6, -2.35, Math.PI, { pray: false, take: 'Chair_Sit_Idle_M', at: [0.04, 0.9, 0.08][i], nod: 0.3, parent: O }));
    for (let i = 0; i < 3; i++) fbox(0.46, 0.5, 0.05, -1.8 + i * 2.6, 0.85, -2.02, basic({ color: 0x23262b }), O);   // the chairs' backs
    /* (a white box van stood at the kerb here and slammed its door: in the
       photographs it was a toy, and its door striped the frame — the van is
       a SOUND now, off the edge of the shot, and the lens goes in to the
       people instead) */
    // the room round them: side walls, ceiling strips, the banner over the stock, a tiled floor
    for (const sx of [-1, 1]) fbox(0.2, 3.6, 5.6, sx * 7.9, 1.8, -3.4, basic({ color: 0x2f2b28 }), O);
    for (let i = 0; i < 3; i++) fbox(3.0, 0.04, 0.14, -4.5 + i * 4.5, 3.33, -3.2, basic({ color: 0xffffff }), O);
    fbox(5.2, 0.7, 0.04, -3.6, 3.0, -6.0, basic({ map: h.tex(h.makeSignTex(THREE, cnv, 'ROADEYE · SEE THE ROAD', '#0c1a33', '#ffd25a', 0.2)) }), O);
    { const ft = h.tex(makeOfficeFloor(THREE, cnv)); ft.wrapS = ft.wrapT = THREE.RepeatWrapping; ft.repeat.set(8, 3);
      fbox(16, 0.05, 6, 0, 0.17, -3.2, basic({ map: ft }), O); }
    fbox(0.9, 1.5, 0.02, 4.6, 1.9, -6.0, basic({ color: 0x1a3a5a }), O);                  // a poster of the product
    fbox(0.8, 0.5, 0.025, 4.6, 2.2, -5.99, basic({ color: 0xd8e2ec }), O);
    const vanDoor = new THREE.Object3D();
    // a counter by the door with the cameras on show, and a trolley of stock going out
    fbox(2.2, 0.95, 0.6, -4.6, 0.475, -1.9, basic({ color: 0x1d2633 }), O);
    for (let i = 0; i < 5; i++) { fbox(0.09, 0.06, 0.07, -5.4 + i * 0.4, 1.0, -1.9, basic({ color: 0x0c0c0e }), O); fbox(0.03, 0.03, 0.005, -5.4 + i * 0.4, 1.0, -1.865, basic({ color: 0x5fa0e0 }), O); }
    fbox(0.7, 0.06, 1.0, 3.6, 0.22, 1.0, basic({ color: 0x4a4a4c }), O);
    fbox(0.04, 0.9, 0.04, 3.6, 0.65, 0.52, basic({ color: 0x4a4a4c }), O);
    for (let i = 0; i < 4; i++) fbox(0.6, 0.4, 0.46, 3.6 + (i % 2 ? 0.0 : 0.0), 0.47 + i * 0.41, 1.0, boxMat, O);   // the trolley's stack
    const lampO = new THREE.Mesh(new THREE.PlaneGeometry(6, 6), basic({ map: h.tex(makeGlow(THREE, cnv, '255,214,150')), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
    lampO.position.set(-6, 4.2, 3); O.add(lampO);

    /* 3 · HIS FLAT AT NIGHT: the floor, a low table, his phone playing the
       chant, the city through the window */
    const F = pock(P.flat);
    fbox(8, 0.05, 8, 0, 0, 0, basic({ color: 0x3a2e26 }), F);
    fbox(8, 4, 0.1, 0, 2, -3.0, basic({ color: 0x24201e }), F);
    const city = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 1.8), basic({ map: h.tex(makeCityNight(THREE, cnv)) })); city.position.set(0.6, 1.5, -2.94); F.add(city);
    fbox(3.3, 0.06, 0.08, 0.6, 2.42, -2.92, basic({ color: 0x101010 }), F); fbox(3.3, 0.06, 0.08, 0.6, 0.58, -2.92, basic({ color: 0x101010 }), F);
    fbox(1.1, 0.06, 0.6, 0, 0.38, -0.9, basic({ color: 0x5a3b26 }), F);                   // the low table
    for (const lx of [-0.5, 0.5]) for (const lz of [-1.15, -0.65]) fbox(0.05, 0.35, 0.05, lx, 0.18, lz, basic({ color: 0x3a2618 }), F);
    const phone = fbox(0.08, 0.01, 0.16, 0.12, 0.42, -0.8, basic({ color: 0x111111 }), F);
    const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.07, 0.145), basic({ map: h.tex(makePhoneChant(THREE, cnv)) })); screen.rotation.x = -Math.PI / 2; screen.position.set(0.12, 0.427, -0.8); F.add(screen);
    void phone;
    const phoneGlow = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.8), basic({ map: h.tex(makeGlow(THREE, cnv, '170,200,255')), transparent: true, opacity: 0.5, depthWrite: false, blending: THREE.AdditiveBlending }));
    phoneGlow.rotation.x = -Math.PI / 2; phoneGlow.position.set(0.12, 0.44, -0.8); F.add(phoneGlow);
    fbox(2.2, 0.5, 0.8, -1.9, 0.25, 0.4, basic({ color: 0x2d3440 }), F);                  // the sofa's edge
    fbox(2.2, 0.6, 0.2, -1.9, 0.6, 0.75, basic({ color: 0x262c36 }), F);

    /* 4 · A TEMPLE FLOOR, CLOSE: dark stone, a candle, the knees of the two
       people kneeling either side of him in white */
    const T = pock(P.floor);
    const tf = new THREE.Mesh(new THREE.PlaneGeometry(6, 6), h.matFloor); tf.rotation.x = -Math.PI / 2; T.add(tf);
    const tm = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 1.0), h.matMat); tm.rotation.x = -Math.PI / 2; tm.position.y = 0.006; T.add(tm);
    const tc = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.24, 8), h.matCream); tc.position.set(0.18, 0.12, -0.75); T.add(tc);
    const tcf = new THREE.Mesh(new THREE.ConeGeometry(0.016, 0.05, 6), h.matFlame); tcf.position.set(0.18, 0.27, -0.75); T.add(tcf);
    const tlamp = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 1.4), basic({ map: h.tex(makeGlow(THREE, cnv, '255,200,120')), transparent: true, opacity: 0.6, depthWrite: false, blending: THREE.AdditiveBlending }));
    tlamp.position.set(0.18, 0.3, -0.75); T.add(tlamp);
    const sideL = h.mkSitter('lay_granny', -0.85, 0.05, Math.PI + 0.05, { parent: T, at: 0.3 });
    const sideR = h.mkSitter('lay_admintee', 0.85, 0.05, Math.PI - 0.05, { parent: T, at: 0.5 });
    const tlight = new THREE.PointLight(0xffc27a, 2.4, 3.2, 1.6); tlight.position.set(0.18, 0.5, -0.6); T.add(tlight);
    // the hall around him, out of focus in the dark: a lacquered wall, two
    // columns with their gold bands, and far off the gilded image's glow
    // (the first cut floated the hands over a floor in an empty blue void)
    const encl = new THREE.Mesh(new THREE.BoxGeometry(16, 10, 14), basic({ color: 0x0d0908, side: THREE.BackSide })); encl.position.set(0, 4.98, -1.5); T.add(encl);
    fbox(9, 7, 0.2, 0, 3.5, -4.2, basic({ color: 0x140d0a }), T);
    for (const sx of [-1.7, 1.9]) {
      fbox(0.42, 8, 0.42, sx, 4, -3.1, basic({ color: 0x0b0807 }), T);
      for (const y of [0.35, 1.9, 3.4]) fbox(0.44, 0.06, 0.44, sx, y, -3.1, basic({ color: 0x8a6a2c }), T);
    }
    const farGlow = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 3.6), basic({ map: h.tex(makeGlow(THREE, cnv, '255,190,90')), transparent: true, opacity: 0.45, depthWrite: false, blending: THREE.AdditiveBlending }));
    farGlow.position.set(0.15, 1.5, -4.05); T.add(farGlow);
    for (const sx of [-1, 1]) fbox(9, 0.02, 0.12, 0, 0.003, -0.5 + sx * 1.6, basic({ color: 0x4a120e }), T);   // the mats' red borders, either side

    /* 5 · THE DOORS: two people in white walk up the steps and in, ahead of
       him (the admin tee's own walk, glided on the cine clock) */
    const walkers = [];
    const WALK = [[{ x: -0.7, z: 13.5 }, { x: -0.55, z: 8.6 }, { x: -0.4, z: 4.4 }, { x: -0.2, z: 2.6 }],
                  [{ x: 0.85, z: 15.0 }, { x: 0.6, z: 8.6 }, { x: 0.45, z: 4.4 }, { x: 0.25, z: 2.6 }]];
    h.parseOnce('admintee').then(gltf => {
      if (!h.alive()) return;
      for (let i = 0; i < 2; i++) {
        const g = ctx.cloneSkinned(gltf.scene);
        g.traverse(o => { if (o.isMesh) { o.material = Array.isArray(o.material) ? o.material.map(h.whiteOf) : h.whiteOf(o.material); o.frustumCulled = false; } });
        const grp = new THREE.Group(); grp.add(g); grp.visible = false; world.add(grp);
        g.updateMatrixWorld(true);
        let lo = Infinity, hi = -Infinity; const v = new THREE.Vector3();
        g.traverse(o => { if (o.isBone) { o.getWorldPosition(v); lo = Math.min(lo, v.y); hi = Math.max(hi, v.y); } });
        if (hi > lo) g.scale.multiplyScalar((i ? 1.58 : 1.66) / (hi - lo));
        const mixer = new THREE.AnimationMixer(g), clip = gltf.animations.find(c => c.name === 'Walking');
        if (clip) mixer.clipAction(clip).play();
        h.owned.push({ dispose: () => mixer.stopAllAction() });
        walkers.push({ grp, g, mixer, path: WALK[i], last: 0 });
      }
    }).catch(err => { console.warn('admintee failed to load', err); ctx.loadFail && ctx.loadFail('admintee', err); });

    // the yant shot's strikes and the rod, the van's door, the walkers — all on the cine clock
    let lastT = 0;
    function tick(t) {
      const ct = (window.__enc && window.__enc.cine && window.__enc.cine.t) ? window.__enc.cine.t() : t;
      // the rod: a strike every ~0.45 s into the skin, faster as the shot runs
      const per = 0.48 - Math.min(0.14, ct * 0.012), ph = (ct % per) / per;
      const hit = ph < 0.18 ? ph / 0.18 : 1 - (ph - 0.18) / 0.82;
      // the tip on the last row still going in (x −0.08, y 1.18), touching the skin (z −0.115) on each strike
      rod.position.set(-0.075 + Math.sin(ct * 0.7) * 0.012, 1.185 - Math.sin(ct * 0.4) * 0.006, -0.128 - (1 - hit) * 0.045);
      // the van's side door slides shut
      vanDoor.position.x = 0.3 - Math.min(1, Math.max(0, (ct - 16.0) / 0.4)) * 1.15;
      // the walkers
      const dt = Math.max(0, Math.min(0.1, ct - lastT)); lastT = ct;
      for (let i = 0; i < walkers.length; i++) {
        const w = walkers[i], u = (ct - 44.2 - i * 0.9) / 8.4;
        w.grp.visible = u > 0 && u < 1;
        if (!w.grp.visible) continue;
        const seg = Math.min(w.path.length - 2, Math.floor(u * (w.path.length - 1))), f = u * (w.path.length - 1) - seg;
        const a = w.path[seg], b = w.path[seg + 1];
        const x = a.x + (b.x - a.x) * f, z = a.z + (b.z - a.z) * f;
        // the porch top is 0; six risers of 0.2 run from z 6.42 to 8.78 down to the courtyard at −1.4
        const y = z >= 8.78 ? -1.4 : z > 6.42 ? -0.2 * Math.ceil((z - 6.42) / 0.36 + 1e-6) : 0;
        w.grp.position.set(x, Math.min(0, y), z);
        w.grp.rotation.y = Math.atan2(b.x - a.x, b.z - a.z);
        w.mixer.update(dt);
      }
      void staff; void sideL; void sideR;
    }
    return { root, P, tick, rod, vanDoor, walkers, tlight };
  }
  /* the film's own paint */
  function makeBackSkin(THREE, cnv) {
    // a 1024 x 512 wrap: u 0.5 is the middle of his back, toward the lens
    // (a square sheet, drawn at half height and stretched: the wrap is 1.0 m
    // round and 0.62 m tall, so a texel is taller than it is wide)
    const [c, x] = cnv(1024), W = 1024, S = 512, r = rng(71), mid = W / 2;
    x.scale(1, 2);
    // the skin, darker toward the flanks (the wrap's shading), warm in the lamp
    const g = x.createLinearGradient(0, 0, W, 0);
    g.addColorStop(0, '#4a2c1c'); g.addColorStop(0.3, '#8a5a3c'); g.addColorStop(0.5, '#c8916a');
    g.addColorStop(0.7, '#8a5a3c'); g.addColorStop(1, '#4a2c1c');
    x.fillStyle = g; x.fillRect(0, 0, W, S);
    // the shoulder blades: two soft lights, the hollow between them
    for (const sx of [-1, 1]) {
      const bg = x.createRadialGradient(mid + sx * 95, S * 0.3, 8, mid + sx * 95, S * 0.3, 120);
      bg.addColorStop(0, 'rgba(240,190,150,0.35)'); bg.addColorStop(1, 'rgba(240,190,150,0)');
      x.fillStyle = bg; x.fillRect(0, 0, W, S);
    }
    // the spine's groove
    const sp = x.createLinearGradient(mid - 18, 0, mid + 18, 0);
    sp.addColorStop(0, 'rgba(60,30,18,0)'); sp.addColorStop(0.5, 'rgba(60,30,18,0.45)'); sp.addColorStop(1, 'rgba(60,30,18,0)');
    x.fillStyle = sp; x.fillRect(mid - 18, S * 0.08, 36, S * 0.92);
    // the healed first yant: a pyramid of script under nine peaks, faded blue-black, on the left
    x.strokeStyle = 'rgba(26,32,50,0.7)'; x.lineWidth = 2.6;
    const ox = mid - 92;
    for (let row = 0; row < 5; row++) {
      const n = 9 - row * 2;
      for (let i = 0; i < n; i++) {
        const cx = ox + (i - (n - 1) / 2) * 15, cy = S * 0.52 - row * 22;
        x.beginPath(); x.moveTo(cx - 5, cy); x.quadraticCurveTo(cx, cy - 10, cx + 5, cy); x.stroke();
        x.beginPath(); x.arc(cx, cy + 5, 3, 0, Math.PI * 1.6); x.stroke();
      }
    }
    for (let i = 0; i < 9; i++) { const cx = ox + (i - 4) * 15; x.beginPath(); x.moveTo(cx - 6, S * 0.52 - 4 * 22 - 14); x.lineTo(cx, S * 0.52 - 4 * 22 - 34); x.lineTo(cx + 6, S * 0.52 - 4 * 22 - 14); x.stroke(); }
    // the new lines going in, on the right: crisper, darker, a little red and raised round them
    x.strokeStyle = 'rgba(170,40,30,0.28)'; x.lineWidth = 8;
    for (let i = 0; i < 6; i++) { x.beginPath(); x.moveTo(mid + 40, S * 0.22 + i * 20); x.lineTo(mid + 120 + r() * 20, S * 0.22 + i * 20); x.stroke(); }
    x.strokeStyle = 'rgba(10,10,16,0.95)'; x.lineWidth = 2.6;
    for (let i = 0; i < 6; i++) {
      x.beginPath(); x.moveTo(mid + 40, S * 0.22 + i * 20);
      const len = i === 5 ? 3 : 7;                 // the last row is still going in
      for (let k = 0; k < len; k++) x.quadraticCurveTo(mid + 40 + k * 11 + 5, S * 0.22 + i * 20 - 7, mid + 40 + k * 11 + 11, S * 0.22 + i * 20);
      x.stroke();
    }
    for (let i = 0; i < 6000; i++) { const v = r() * 30; x.fillStyle = `rgba(${120 + v},${80 + v},${60 + v},0.12)`; x.fillRect(r() * W, r() * S, 2, 2); }
    return done(THREE, c, false);
  }
  function makeOfficeFloor(THREE, cnv) {
    const S = 128, [c, x] = cnv(S);
    x.fillStyle = '#6e6a64'; x.fillRect(0, 0, S, S);
    x.fillStyle = '#7a756e'; x.fillRect(2, 2, S / 2 - 4, S / 2 - 4); x.fillRect(S / 2 + 2, S / 2 + 2, S / 2 - 4, S / 2 - 4);
    x.strokeStyle = 'rgba(40,36,32,0.6)'; x.lineWidth = 2; x.strokeRect(0, 0, S / 2, S / 2); x.strokeRect(S / 2, S / 2, S / 2, S / 2);
    return done(THREE, c, true);
  }
  function makeGlow(THREE, cnv, rgb) {
    const S = 128, [c, x] = cnv(S);
    const g = x.createRadialGradient(S / 2, S / 2, 2, S / 2, S / 2, S / 2);
    g.addColorStop(0, `rgba(${rgb},0.9)`); g.addColorStop(0.35, `rgba(${rgb},0.25)`); g.addColorStop(1, `rgba(${rgb},0)`);
    x.fillStyle = g; x.fillRect(0, 0, S, S);
    return done(THREE, c, false);
  }
  function makeBoxTex(THREE, cnv) {
    const S = 128, [c, x] = cnv(S);
    x.fillStyle = '#c7a477'; x.fillRect(0, 0, S, S);
    x.fillStyle = '#0c1a33'; x.fillRect(10, 40, 108, 36);
    x.fillStyle = '#ffd25a'; x.font = 'bold 20px sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('ROADEYE', 64, 58);
    x.strokeStyle = 'rgba(80,60,30,0.6)'; x.lineWidth = 3; x.strokeRect(2, 2, S - 4, S - 4);
    return done(THREE, c, false);
  }
  function makeCityNight(THREE, cnv) {
    const S = 512, [c, x] = cnv(S), r = rng(73);
    const g = x.createLinearGradient(0, 0, 0, S); g.addColorStop(0, '#05080f'); g.addColorStop(0.7, '#141c34'); g.addColorStop(1, '#251f2e');
    x.fillStyle = g; x.fillRect(0, 0, S, S);
    for (let i = 0; i < 22; i++) {
      const w = 20 + r() * 50, xx = r() * S, hh = (0.3 + r() * 0.55) * S;
      x.fillStyle = '#0b0f1a'; x.fillRect(xx, S - hh, w, hh);
      for (let wy = S - hh + 6; wy < S - 4; wy += 8) for (let wx = xx + 3; wx < xx + w - 3; wx += 6)
        if (r() < 0.3) { x.fillStyle = r() < 0.8 ? 'rgba(255,214,140,0.9)' : 'rgba(170,210,255,0.9)'; x.fillRect(wx, wy, 3, 4); }
    }
    return done(THREE, c, false);
  }
  function makePhoneChant(THREE, cnv) {
    const S = 128, [c, x] = cnv(S);
    x.fillStyle = '#16121c'; x.fillRect(0, 0, S, S);
    x.fillStyle = '#d9a64a'; x.beginPath(); x.arc(S / 2, S * 0.35, 18, 0, Math.PI * 2); x.fill();
    x.fillStyle = '#efe6d2'; for (let i = 0; i < 9; i++) x.fillRect(16, S * 0.6 + i * 3, 96 - (i % 3) * 18, 1.4);
    x.fillStyle = '#d9a64a'; x.fillRect(16, S * 0.9, 96, 3);
    return done(THREE, c, false);
  }

  /* ============================================================= textures
     All drawn, none downloaded (CSP-safe). Seeded, so the same every load. */
  function rng(seed) { let s = seed >>> 0 || 1; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
  function done(THREE, c, rep) {
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
    if (rep) { t.wrapS = t.wrapT = THREE.RepeatWrapping; }
    return t;
  }
  /* polished dark stone, laid in big squares: a deep grey-brown with a soft
     veining, so the candles and the gold glint in it */
  function makeStoneFloor(THREE, cnv) {
    const S = 512, [c, x] = cnv(S), r = rng(31);
    for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) {
      const g = 38 + r() * 12;
      x.fillStyle = `rgb(${g + 6},${g},${g - 4})`; x.fillRect(i * 256, j * 256, 256, 256);
      for (let k = 0; k < 16; k++) {
        x.strokeStyle = `rgba(${120 + r() * 60},${110 + r() * 50},${100 + r() * 40},${0.05 + r() * 0.06})`;
        x.lineWidth = 0.6 + r() * 1.6;
        x.beginPath(); let px = i * 256 + r() * 256, py = j * 256 + r() * 256; x.moveTo(px, py);
        for (let s2 = 0; s2 < 5; s2++) { px += (r() - 0.5) * 90; py += (r() - 0.5) * 90; x.lineTo(px, py); }
        x.stroke();
      }
      const gr = x.createLinearGradient(i * 256, j * 256, i * 256 + 256, j * 256 + 256);
      gr.addColorStop(0, 'rgba(255,240,220,0.04)'); gr.addColorStop(1, 'rgba(0,0,0,0.06)');
      x.fillStyle = gr; x.fillRect(i * 256, j * 256, 256, 256);
    }
    x.fillStyle = 'rgba(12,10,9,0.9)'; x.fillRect(0, 0, S, 2); x.fillRect(0, 255, S, 2); x.fillRect(0, 0, 2, S); x.fillRect(255, 0, 2, S);
    return done(THREE, c, true);
  }
  /* a black lacquered column: gold stencilled lotus bands at the foot and
     under the capital, a scatter of gold flowers between, a long gold rule */
  function makeLacquerCol(THREE, cnv) {
    const S = 512, [c, x] = cnv(S), r = rng(37);
    x.fillStyle = '#120c0a'; x.fillRect(0, 0, S, S);
    const gold = (a) => `rgba(222,176,82,${a})`;
    const band = (y0, h) => {
      x.fillStyle = gold(0.95); x.fillRect(0, y0, S, 3); x.fillRect(0, y0 + h - 3, S, 3);
      for (let i = 0; i < 8; i++) {
        const cx = i * 64 + 32, cy = y0 + h / 2;
        x.beginPath(); x.moveTo(cx, cy - h * 0.38); x.quadraticCurveTo(cx + 24, cy, cx, cy + h * 0.38); x.quadraticCurveTo(cx - 24, cy, cx, cy - h * 0.38);
        x.fillStyle = gold(0.9); x.fill();
        x.beginPath(); x.arc(cx + 32, cy, 4, 0, Math.PI * 2); x.fill();
      }
    };
    band(470, 42); band(0, 30);
    for (let i = 0; i < 90; i++) {
      const fx = r() * S, fy = 40 + r() * 420;
      x.fillStyle = gold(0.55);
      for (let p = 0; p < 4; p++) { x.beginPath(); x.ellipse(fx + Math.cos(p * Math.PI / 2) * 4, fy + Math.sin(p * Math.PI / 2) * 4, 3.4, 1.7, p * Math.PI / 2, 0, Math.PI * 2); x.fill(); }
    }
    for (let i = 0; i < 4; i++) { x.fillStyle = gold(0.8); x.fillRect(i * 128 + 2, 30, 2, 440); }
    return done(THREE, c, false);
  }
  /* the coffered ceiling: dark red panels framed in gold, a gold rosette in each */
  function makeCoffers(THREE, cnv) {
    const S = 256, [c, x] = cnv(S);
    x.fillStyle = '#3a0c08'; x.fillRect(0, 0, S, S);
    x.fillStyle = '#5c160e'; x.fillRect(14, 14, S - 28, S - 28);
    x.strokeStyle = '#c9963c'; x.lineWidth = 6; x.strokeRect(10, 10, S - 20, S - 20);
    x.lineWidth = 2; x.strokeRect(22, 22, S - 44, S - 44);
    x.fillStyle = '#d8a84c';
    for (let p = 0; p < 8; p++) { x.save(); x.translate(S / 2, S / 2); x.rotate(p * Math.PI / 4); x.beginPath(); x.ellipse(0, -22, 9, 22, 0, 0, Math.PI * 2); x.fill(); x.restore(); }
    x.beginPath(); x.arc(S / 2, S / 2, 10, 0, Math.PI * 2); x.fillStyle = '#f2d389'; x.fill();
    return done(THREE, c, true);
  }
  /* the dado: dark red with a gold rule along the top and a running motif */
  function makeDado(THREE, cnv) {
    const S = 256, [c, x] = cnv(S);
    x.fillStyle = '#4e0f0a'; x.fillRect(0, 0, S, S);
    x.fillStyle = '#c99a42'; x.fillRect(0, 0, S, 12); x.fillRect(0, 20, S, 3);
    for (let i = 0; i < 4; i++) { x.beginPath(); x.moveTo(i * 64, 23); x.lineTo(i * 64 + 32, 52); x.lineTo(i * 64 + 64, 23); x.fillStyle = '#a4782f'; x.fill(); }
    return done(THREE, c, true);
  }
  /* the wall behind the Buddha: deep blue glass with a lattice of gold stars */
  function makeBlueGold(THREE, cnv) {
    const S = 256, [c, x] = cnv(S), r = rng(43);
    x.fillStyle = '#0d1f4e'; x.fillRect(0, 0, S, S);
    for (let i = 0; i < 400; i++) { const v = 20 + r() * 40; x.fillStyle = `rgba(${v},${v + 30},${v + 110},0.5)`; x.fillRect((r() * 32 | 0) * 8, (r() * 32 | 0) * 8, 7, 7); }
    x.strokeStyle = 'rgba(214,170,80,0.85)'; x.lineWidth = 2;
    for (let i = 0; i <= 4; i++) { x.beginPath(); x.moveTo(i * 64, 0); x.lineTo(i * 64, S); x.stroke(); x.beginPath(); x.moveTo(0, i * 64); x.lineTo(S, i * 64); x.stroke(); }
    x.fillStyle = '#e7bb5c';
    for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) {
      const cx = i * 64 + 32, cy = j * 64 + 32;
      x.beginPath();
      for (let p = 0; p < 8; p++) { const a = p * Math.PI / 4, rr = p % 2 ? 6 : 15; x.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr); }
      x.closePath(); x.fill();
    }
    return done(THREE, c, true);
  }
  /* cream limewash with a faint warmth */
  function makeCreamWall(THREE, cnv) {
    const S = 256, [c, x] = cnv(S), r = rng(47);
    x.fillStyle = '#d9cdb2'; x.fillRect(0, 0, S, S);
    for (let i = 0; i < 1600; i++) { const v = 196 + r() * 30; x.fillStyle = `rgba(${v},${v - 10},${v - 30},0.25)`; x.fillRect(r() * S, r() * S, 3, 3); }
    return done(THREE, c, true);
  }
  /* a gold stencil band (window crowns, the beams, the umbrellas) */
  function makeGoldBand(THREE, cnv) {
    const S = 256, [c, x] = cnv(S);
    x.fillStyle = '#8a1a10'; x.fillRect(0, 0, S, S);
    x.fillStyle = '#d6a648';
    for (let i = 0; i < 4; i++) {
      const cx = i * 64 + 32;
      x.beginPath(); x.moveTo(cx, 20); x.quadraticCurveTo(cx + 30, 128, cx, 236); x.quadraticCurveTo(cx - 30, 128, cx, 20); x.fill();
      x.beginPath(); x.arc(cx + 32, 128, 10, 0, Math.PI * 2); x.fill();
    }
    x.fillRect(0, 0, S, 10); x.fillRect(0, S - 10, S, 10);
    return done(THREE, c, true);
  }
  function makeRoofTiles(THREE, cnv, a, b) {
    const S = 256, [c, x] = cnv(S);
    x.fillStyle = a; x.fillRect(0, 0, S, S);
    for (let row = 0; row < 8; row++) for (let i = 0; i < 8; i++) {
      const ox = (row % 2) * 16;
      x.fillStyle = b; x.beginPath(); x.arc(i * 32 + ox, row * 32 + 30, 16, 0, Math.PI); x.fill();
      x.fillStyle = 'rgba(255,255,255,0.06)'; x.fillRect(i * 32 + ox - 14, row * 32 + 4, 28, 6);
    }
    return done(THREE, c, true);
  }
  function makeReedMat(THREE, cnv) {
    const S = 256, [c, x] = cnv(S), r = rng(53);
    x.fillStyle = '#b9a26d'; x.fillRect(0, 0, S, S);
    for (let i = 0; i < S; i += 4) { x.fillStyle = `rgba(${120 + r() * 50},${100 + r() * 40},${50 + r() * 30},0.5)`; x.fillRect(0, i, S, 2); }
    x.strokeStyle = '#7a1e18'; x.lineWidth = 8; x.strokeRect(6, 6, S - 12, S - 12);
    return done(THREE, c, false);
  }
  function makeRunner(THREE, cnv) {
    const S = 256, [c, x] = cnv(S);
    x.fillStyle = '#8c1a12'; x.fillRect(0, 0, S, S);
    x.fillStyle = '#d0a04a'; x.fillRect(0, 0, 18, S); x.fillRect(S - 18, 0, 18, S);
    x.fillStyle = '#a8261a'; for (let i = 0; i < 4; i++) { x.beginPath(); x.arc(S / 2, i * 64 + 32, 18, 0, Math.PI * 2); x.fill(); }
    return done(THREE, c, true);
  }
  function makeSlabs(THREE, cnv) {
    const S = 256, [c, x] = cnv(S), r = rng(59);
    x.fillStyle = '#6f6a62'; x.fillRect(0, 0, S, S);
    for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) { const g = 100 + r() * 30; x.fillStyle = `rgb(${g},${g - 4},${g - 10})`; x.fillRect(i * 128 + 2, j * 128 + 2, 124, 124); }
    return done(THREE, c, true);
  }
  function makeGableCarve(THREE, cnv) {
    const S = 512, [c, x] = cnv(S), r = rng(61);
    x.fillStyle = '#7d140c'; x.fillRect(0, 0, S, S);
    x.strokeStyle = '#d9aa4e'; x.lineWidth = 5;
    for (let i = 0; i < 46; i++) {
      const cx = r() * S, cy = r() * S, rr = 14 + r() * 30;
      x.beginPath(); x.arc(cx, cy, rr, r() * 6, r() * 6 + 3.6); x.stroke();
    }
    x.fillStyle = '#e8bf62'; x.beginPath(); x.arc(S / 2, S * 0.62, 70, 0, Math.PI * 2); x.fill();
    x.fillStyle = '#7d140c'; x.beginPath(); x.arc(S / 2, S * 0.62, 52, 0, Math.PI * 2); x.fill();
    x.fillStyle = '#e8bf62'; x.beginPath(); x.arc(S / 2, S * 0.62, 26, 0, Math.PI * 2); x.fill();
    return done(THREE, c, false);
  }
  function makeSignTex(THREE, cnv, text, bg, fg, aspect) {
    const S = 512, [c, x] = cnv(S);
    x.fillStyle = bg; x.fillRect(0, 0, S, S);
    x.save(); x.scale(1, aspect);
    const Hh = S / aspect;
    x.strokeStyle = fg; x.lineWidth = Math.max(2, Hh * 0.05); x.strokeRect(Hh * 0.08, Hh * 0.08, S - Hh * 0.16, Hh - Hh * 0.16);
    let px = Math.floor(Hh * 0.42); x.font = 'bold ' + px + 'px sans-serif';
    while (x.measureText(text).width > S * 0.88 && px > 6) { px -= 2; x.font = 'bold ' + px + 'px sans-serif'; }
    x.fillStyle = fg; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(text, S / 2, Hh * 0.54);
    x.restore();
    return done(THREE, c, false);
  }
  /* the pointed gold crown over a Thai window or door: a flame-tipped arch */
  function crownShape(THREE, w, h) {
    const s = new THREE.Shape();
    s.moveTo(-w / 2, 0);
    s.quadraticCurveTo(-w * 0.40, h * 0.50, -w * 0.10, h * 0.74);
    s.quadraticCurveTo(-w * 0.02, h * 0.84, 0, h);
    s.quadraticCurveTo(w * 0.02, h * 0.84, w * 0.10, h * 0.74);
    s.quadraticCurveTo(w * 0.40, h * 0.50, w / 2, 0);
    s.lineTo(-w / 2, 0);
    return s;
  }
  function triShape(THREE, w, h) {
    const s = new THREE.Shape();
    s.moveTo(-w / 2, 0); s.lineTo(w / 2, 0); s.lineTo(0, h); s.lineTo(-w / 2, 0);
    return s;
  }

  /* ============================================================== THE FILM
     ~55 s, his own voice over four memories and then the hall's doors: the
     second yant going in, the business bigger, his own hand lifting off his
     knee at home while the chant plays on his phone, his hands coming apart
     on a temple floor and snapping back — and the ordination hall at dusk,
     people in white going in ahead of him. `e3film2` runs under it all. */
  function intro(c, s, api) {
    const { step, sfx, fade, camTo, yawTo, pitchTo, faceFrom, rawK, smoothK, stage, armR, handsRoot, tr } = api;
    const F = stage.film, P = F.P;
    const at = (o, x, y, z) => ({ x: o.x + x, y, z: o.z + z });
    step(0, () => { handsRoot.visible = false; });
    fade(0.0, 0.0, 1, 1);
    sfx(0.2, 'e3film2', 0.85);

    // 1 · THE SECOND YANT (0 – 10): skin, the rod, the lamp
    fade(0.6, 2.2, 1, 0);
    // close on the new lines and the rod's tip, the shoulder's curve at the frame's edge
    // an extreme close-up: skin, script and the steel tip fill the frame —
    // the body's outline (primitives, as a stand-in) never enters it
    camTo(0.0, 10.0, at(P.yant, -0.02, 1.25, -0.33), at(P.yant, -0.04, 1.22, -0.27), smoothK);
    yawTo(0.0, 10.0, faceFrom(P.yant.x - 0.02, P.yant.z - 0.33, P.yant.x - 0.06, P.yant.z), faceFrom(P.yant.x - 0.04, P.yant.z - 0.27, P.yant.x - 0.07, P.yant.z), smoothK);
    pitchTo(0.0, 10.0, -0.16, -0.12, smoothK);
    for (const t of [0.9, 1.4, 1.9, 2.4, 2.85, 3.3, 3.75, 4.2, 4.6, 5.0, 5.4, 5.8, 6.2, 6.6, 7.0, 7.4, 7.8, 8.2]) sfx(t, 'yantap', 0.5);
    sfx(2.2, 'z2pro1');                               // 5.15 s → 7.35
    fade(9.3, 10.0, 0, 1);

    // 2 · HIS BUSINESS, BIGGER (10 – 20.5): the shopfront at evening, the van
    fade(10.2, 11.2, 1, 0);
    // in from the pavement, through the open front, to the desks
    camTo(10.0, 20.5, at(P.office, -1.6, 1.55, 3.2), at(P.office, -0.4, 1.45, 0.2), smoothK);
    yawTo(10.0, 20.5, faceFrom(P.office.x - 1.6, P.office.z + 3.2, P.office.x - 0.6, P.office.z - 3.0), faceFrom(P.office.x - 0.4, P.office.z + 0.2, P.office.x + 0.6, P.office.z - 3.0), smoothK);
    pitchTo(10.0, 20.5, -0.06, -0.12, smoothK);
    sfx(10.3, 'officeamb2', 0.7);
    sfx(11.2, 'z2pro2');                              // 5.88 s → 17.08
    sfx(16.0, 'slidevan', 0.75);
    fade(19.8, 20.5, 0, 1);

    // 3 · HIS FLAT AT NIGHT (20.5 – 35.6): the chant on his phone, and his hand lifts
    step(20.5, () => { handsRoot.visible = true; armR.visible = true; api.handsPose(0, 0, { from: 'rest' }); });
    fade(20.7, 21.8, 1, 0);
    camTo(20.5, 35.6, at(P.flat, 0.02, 0.96, 0.18), at(P.flat, 0.0, 0.94, 0.12), smoothK);
    yawTo(20.5, 21.0, faceFrom(P.flat.x, P.flat.z + 0.18, P.flat.x + 0.1, P.flat.z - 0.9), faceFrom(P.flat.x, P.flat.z + 0.18, P.flat.x + 0.1, P.flat.z - 0.9), rawK);
    pitchTo(20.5, 25.5, -0.50, -0.44, smoothK);
    sfx(20.6, 'flatnight', 0.85);
    sfx(21.8, 'z2pro3');                              // 6.35 s → 28.15
    tr(25.5, 31.4, (k) => { api.handsPose(0.85 * smooth(k), 0.8 + (25.5 + k * 5.9) * 0.62, { from: 'rest' }); }, rawK);
    pitchTo(25.5, 30.2, -0.44, -0.12, smoothK);       // his eyes follow it up
    sfx(25.8, 'handsrise', 0.5);
    sfx(28.6, 'z2pro4');                              // 6.53 s → 35.13
    sfx(31.5, 'handslip', 0.55);
    tr(31.4, 32.4, (k) => { api.handsPose(0.85 * (1 - smooth(k)), 4.5 + k * 0.4, { from: 'rest' }); }, rawK);
    step(32.45, () => { const m = api.rightHand(); if (m) api.setHandCurl(m, 1); });
    pitchTo(31.4, 33.0, -0.12, -0.46, smoothK);
    fade(35.0, 35.6, 0, 1);

    // 4 · A TEMPLE FLOOR, CLOSE (35.6 – 44.0): the hands come apart, and snap back
    step(35.6, () => { api.handsPose(0, 0); });
    fade(35.8, 36.8, 1, 0);
    camTo(35.6, 44.0, at(P.floor, 0.0, 0.98, 0.16), at(P.floor, 0.0, 0.97, 0.12), rawK);
    yawTo(35.6, 40.6, faceFrom(P.floor.x, P.floor.z + 0.16, P.floor.x + 0.1, P.floor.z - 0.8), faceFrom(P.floor.x, P.floor.z + 0.16, P.floor.x + 0.1, P.floor.z - 0.8), rawK);
    pitchTo(35.6, 37.0, -0.40, -0.36, smoothK);
    sfx(35.8, 'e3vesper', 0.32);
    sfx(36.4, 'z2pro5');                              // 5.56 s → 41.96
    tr(37.4, 40.2, (k) => { api.handsPose(0.6 * smooth(k), 1.0 + k * 2.2); }, rawK);
    sfx(37.6, 'handsrise', 0.45);
    tr(40.2, 40.5, (k) => { api.handsPose(0.6 * (1 - k), 3.2); }, rawK);
    sfx(40.25, 'handslip', 0.8);
    // he glances left, then right, at the knees either side of him: did they see?
    yawTo(40.7, 41.4, faceFrom(P.floor.x, P.floor.z + 0.16, P.floor.x + 0.1, P.floor.z - 0.8), faceFrom(P.floor.x, P.floor.z + 0.16, P.floor.x - 0.9, P.floor.z + 0.0), smoothK);
    yawTo(41.6, 42.4, faceFrom(P.floor.x, P.floor.z + 0.16, P.floor.x - 0.9, P.floor.z + 0.0), faceFrom(P.floor.x, P.floor.z + 0.16, P.floor.x + 0.9, P.floor.z + 0.0), smoothK);
    yawTo(42.6, 43.3, faceFrom(P.floor.x, P.floor.z + 0.16, P.floor.x + 0.9, P.floor.z + 0.0), faceFrom(P.floor.x, P.floor.z + 0.16, P.floor.x + 0.1, P.floor.z - 0.8), smoothK);
    fade(43.4, 44.0, 0, 1);

    // 5 · THE HALL'S DOORS AT DUSK (44.0 – 55.2): people in white going in ahead of him
    step(44.0, () => { handsRoot.visible = false; });
    fade(44.2, 45.8, 1, 0);
    camTo(44.0, 53.6, { x: 0.35, y: 0.25, z: 15.2 }, { x: 0.1, y: 0.42, z: 9.6 }, smoothK);
    yawTo(44.0, 53.6, faceFrom(0.35, 15.2, 0.0, 2.0), faceFrom(0.1, 9.6, 0.0, 2.0), smoothK);
    pitchTo(44.0, 53.6, 0.16, 0.20, smoothK);
    sfx(44.0, 'templedusk', 0.7);
    sfx(44.4, 'e3vesper', 0.32);
    sfx(45.8, 'z2pro6');                              // 5.64 s → 51.44
    sfx(52.6, 'e3bell', 0.35);
    fade(53.6, 55.0, 0, 1);
    step(55.1, () => { handsRoot.visible = true; armR.visible = true; });
    c.endFade = 1;
    c.keepFade = true;
  }

  /* ============================================================ THE ENDINGS
     Each begins where play left him: kneeling in the third row, his hands up
     in the gesture, the faces turned. Each is a different answer to the same
     moment; all four close on his line inside the scene and the last one over
     the black (the v15.3 shape). */
  const P0 = (s) => ({ x: s.yawPos.x, y: s.yawPos.y, z: s.yawPos.z });
  function ending(c, api, T) {
    const { step, sfx, sfxFade, fade, handsRoot } = api;
    fade(T, T + 2.4, 0, 1);
    sfxFade(T + 0.4, T + 6.6, 'e3close2');
    sfx(T + 2.8, 'z2next');                           // 7.08 s
    step(T + 10.2, () => { handsRoot.visible = true; });
    c.endFade = 1;
  }
  // where play left the hands: high after a lost fight, low in the clasp after a held one
  const hk = (api) => { const f = api.handsFrom(); return { k: Math.max(0.25, f.k || 0.25), t: f.t || 0 }; };

  /* A · FORCE IT DOWN (bad) — the prayer held by force, the shaking, the woman who asks */
  function scForce(c, s, api) {
    const { sfx, tr, step, yawTo, pitchTo, faceFrom, smoothK, rawK, stage, camera } = api;
    const p0 = P0(s), H0 = hk(api), N = stage.NEIGH;
    let shake = 0;
    tr(0, 1.2, (k) => { api.handsPose(H0.k, H0.t + k * 1.0); }, rawK);
    // he wrenches them back into the clasp — the proper prayer, forced — and
    // holds it there, trembling, until it stops. (A curled fist built on the
    // clasp threaded one hand's fingers through the other's in every try
    // photographed; the clasp itself is clean, and it is the truer image:
    // the prayer held by force.)
    tr(1.2, 12.0, (k, t) => {
      const u = Math.min(1, (t - 1.2) / 1.1);
      shake = (1 - Math.min(1, Math.max(0, (t - 6) / 6))) * 0.010;
      api.handsPose(H0.k * (1 - smooth(u)), H0.t + 1.0 + u * 0.3);
      const L = api.prayerArm();
      api.armR.position.y += 0.03 * smooth(u); api.armR.position.x += Math.sin(t * 41) * shake;
      if (L) { L.position.y += 0.03 * smooth(u); L.position.x += Math.sin(t * 37 + 1) * shake; }
      camera.rotation.z = Math.sin(t * 33) * shake * 0.6;
    }, rawK);
    step(12.0, () => { camera.rotation.z = 0; });
    sfx(1.3, 'handslip', 0.9);
    sfx(2.7, 'handslip', 0.55);
    // she leans to him and asks; he turns to her; she looks away
    step(3.6, () => { const n = stage.neighbour(); if (n) n.lookTo = 1; });
    sfx(4.0, 'lw2look');                              // 2.72 s → 6.72
    yawTo(4.2, 5.2, s.yawRot, faceFrom(p0.x, p0.z, N.x, N.z - 0.2), smoothK);
    pitchTo(4.2, 5.2, s.pitchX, -0.18, smoothK);
    yawTo(7.0, 8.0, faceFrom(p0.x, p0.z, N.x, N.z - 0.2), s.yawRot, smoothK);
    step(7.6, () => { const n = stage.neighbour(); if (n) n.lookTo = 0; });
    pitchTo(7.4, 9.0, -0.18, -0.30, smoothK);          // down at his own hands, pressed together and shaking
    sfx(7.6, 'z2A1');                                 // 5.25 s → 12.85
    sfx(12.6, 'e3close2', 0.9);
    pitchTo(13.0, 21.0, -0.30, 0.10, smoothK);         // and up, slowly, to the Buddha
    sfx(13.4, 'z2close');                             // 8.36 s → 21.76
    ending(c, api, 21.9);
  }

  /* B · RISE QUIETLY, BOW, AND STEP OUTSIDE (good) — out through the rows
     with his eyes down, onto the steps, the chant behind the doors */
  function scStepOut(c, s, api) {
    const { sfx, tr, step, camTo, yawTo, pitchTo, faceFrom, smoothK, rawK, stage, handsRoot, duck } = api;
    const p0 = P0(s), H0 = hk(api), PL = stage.PLACE;
    tr(0, 1.6, (k) => { api.handsPose(H0.k * (1 - smooth(k)), H0.t + k * 0.8); }, rawK);
    // the wai to the Buddha
    yawTo(0, 1.2, s.yawRot, faceFrom(p0.x, p0.z, 0, -20.4), smoothK);
    pitchTo(1.7, 2.5, s.pitchX, -0.72, smoothK);
    pitchTo(2.5, 3.3, -0.72, -0.05, smoothK);
    // he stands, and the hands go
    step(3.4, () => { handsRoot.visible = false; });
    const up = { x: PL.x - 0.15, y: 1.62, z: PL.z + 0.05 };
    camTo(3.4, 4.6, p0, up, smoothK);
    sfx(3.6, 'matkneel', 0.6);
    // west to the aisle, then north along it to the doors, eyes down
    const aisle = { x: -4.95, y: 1.62, z: PL.z + 0.1 }, near = { x: -4.95, y: 1.62, z: 0.2 }, door = { x: -0.2, y: 1.62, z: 1.5 },
          porch = { x: 0.1, y: 1.62, z: 3.6 };
    yawTo(4.4, 5.2, faceFrom(p0.x, p0.z, 0, -20.4), faceFrom(up.x, up.z, aisle.x, aisle.z), smoothK);
    pitchTo(4.4, 5.2, -0.05, -0.32, smoothK);
    camTo(5.0, 7.0, up, aisle, rawK);
    step(5.4, () => { const n = stage.neighbour(); if (n) n.lookTo = 1; });
    yawTo(6.8, 7.6, faceFrom(up.x, up.z, aisle.x, aisle.z), faceFrom(aisle.x, aisle.z, near.x, near.z), smoothK);
    camTo(7.4, 13.4, aisle, near, rawK);
    step(9.0, () => { const n = stage.neighbour(); if (n) n.lookTo = 0; });
    yawTo(13.0, 13.9, faceFrom(aisle.x, aisle.z, near.x, near.z), faceFrom(near.x, near.z, door.x, door.z), smoothK);
    camTo(13.5, 15.6, near, door, rawK);
    yawTo(15.4, 16.0, faceFrom(near.x, near.z, door.x, door.z), faceFrom(door.x, door.z, porch.x, porch.z), smoothK);
    camTo(15.8, 17.6, door, porch, rawK);
    for (const t of [5.2, 5.9, 6.6, 7.6, 8.3, 9.0, 9.7, 10.4, 11.1, 11.8, 12.5, 13.2, 13.9, 14.6, 15.3, 16.0, 16.7]) sfx(t, 'barestep', 0.42);
    // the dusk outside comes up, the chant falls behind the doors
    sfx(15.9, 'templedusk', 0.8);
    tr(15.8, 19.0, (k) => { duck('e3vesper', 1 - 0.7 * k); duck('hallamb', 1 - 0.8 * k); }, rawK);
    // on the steps: his right hand, still trembling, settling
    step(18.0, () => { handsRoot.visible = true; api.armR.visible = true; api.handsPose(0.22, 0, { from: 'rest' }); });
    tr(18.0, 25.0, (k, t) => { api.handsPose(0.22 * (1 - smooth(k)) + 0.03 * Math.sin(t * 9) * (1 - k), 0.5 + k * 2, { from: 'rest' }); }, rawK);
    pitchTo(17.6, 19.0, -0.32, -0.45, smoothK);
    sfx(19.4, 'z2B1');                                // 6.35 s → 25.75
    step(25.2, () => { handsRoot.visible = false; });
    sfx(25.4, 'e3close2', 0.9);
    pitchTo(25.6, 32.0, -0.45, 0.42, smoothK);         // up at the night over the courtyard
    sfx(26.0, 'z2close');                             // 8.36 s → 34.36
    ending(c, api, 34.5);
  }

  /* C · LET IT RUN (worst) — it takes all of him; the chant falters; the
     whole hall turns; Yai pulls her grandson close; and then it leaves him */
  function scLetRun(c, s, api) {
    const { sfx, tr, step, yawTo, pitchTo, faceFrom, smoothK, rawK, stage, camera, duck } = api;
    const p0 = P0(s), H0 = hk(api), Y = stage.YAI;
    let tFlow = H0.t;
    tr(0, 18.0, (k, t) => {
      const fall = Math.min(1, Math.max(0, (t - 14.0) / 4.0));
      tFlow = H0.t + t * (1.5 - 0.9 * fall);
      // from wherever play left them, up into the full gesture in the first 1.2 s
      api.handsPose(Math.min(1, H0.k + (1 - H0.k) * smooth(Math.min(1, t / 1.2))) * (1 - smooth(fall)), tFlow);
      const amp = 1 - 0.7 * fall;
      camera.rotation.z = amp * (0.12 * Math.sin(t * 0.9) + 0.03 * Math.sin(t * 2.3));
      stage.drawShadow(1 - fall * 0.8, t);
    }, rawK);
    // the body turns with it: the lens sways side to side
    tr(0, 14.0, (k, t) => { api.yaw.rotation.y = s.yawRot + 0.34 * Math.sin(t * 0.55) * Math.min(1, t / 2); }, rawK);
    step(0.1, () => { stage.shadow.material.opacity = 0.78; });
    sfx(0.4, 'handsrise', 0.85);
    sfx(0.8, 'chantswell', 0.8);
    sfx(3.4, 'handsrise', 0.7);
    // Yai pulls her grandson to her; whispering spreads
    step(2.6, () => { const y = stage.yai(); if (y) y.lookTo = 1; const kd = stage.kid(); if (kd) kd.lookTo = 1; });
    sfx(3.2, 'lw2pull');                              // 2.59 s → 5.79
    sfx(4.4, 'whispers', 0.7);
    // the monks' chant falters, and stops
    // his eyes drop to the floor ahead: the shadow on the mats is not his
    pitchTo(4.6, 5.8, s.pitchX, -0.55, smoothK);
    pitchTo(7.4, 8.4, -0.55, s.pitchX, smoothK);
    sfx(6.6, 'chantstop', 0.85);
    tr(6.6, 9.4, (k) => { duck('e3vesper', 1 - k); }, rawK);
    step(8.2, () => { stage.lookAll(1); });
    sfx(9.6, 'handsrise', 0.6);
    sfx(10.4, 'z2C1');                                // 6.53 s → 16.93
    // it leaves him: the hands drop, the lens slumps forward
    tr(14.0, 18.6, (k) => { api.yaw.rotation.y = s.yawRot; }, rawK);
    pitchTo(15.6, 18.6, s.pitchX, -0.62, smoothK);   // (s.pitchX again by 8.4)
    step(18.6, () => { camera.rotation.z = 0; stage.shadow.material.opacity = 0.22; });
    sfx(18.4, 'handslip', 0.6);
    sfx(18.8, 'e3close2', 0.85);
    sfx(19.4, 'z2close');                             // 8.36 s → 27.76
    pitchTo(20.0, 27.0, -0.62, -0.25, smoothK);
    void p0; void Y; void yawTo; void faceFrom;
    ending(c, api, 27.9);
  }

  /* D · STAY STILL, BREATHE, AND RESOLVE TO ASK SOMEONE WHO TRULY KNOWS
     (best) — he neither fights nor follows; it slows; it settles into his lap;
     the faces turn away; the chant goes on */
  function scStill(c, s, api) {
    const { sfx, tr, step, pitchTo, smoothK, rawK, stage, camera, duck } = api;
    const H0 = hk(api);
    tr(0, 7.0, (k, t) => {
      const u = smooth(Math.min(1, t / 6.4));
      api.handsPose(H0.k * (1 - u), H0.t + t * (0.9 - 0.7 * u));
      camera.rotation.z = (1 - u) * 0.05 * Math.sin(t * 0.6);
      stage.drawShadow(H0.k * (1 - u), t);
    }, rawK);
    // into the lap: the clasp lowers and the fingers rest
    tr(7.0, 9.4, (k) => { api.handsPose(0, H0.t + 6); api.armR.position.y -= 0.16 * smooth(k); const L = api.prayerArm(); if (L) L.position.y -= 0.16 * smooth(k); }, rawK);
    step(9.45, () => { camera.rotation.z = 0; });
    tr(9.4, 15.0, () => { api.handsPose(0, H0.t + 6); api.armR.position.y -= 0.16; const L = api.prayerArm(); if (L) L.position.y -= 0.16; }, rawK);
    pitchTo(0.6, 6.8, s.pitchX, -0.5, smoothK);
    sfx(1.0, 'matkneel', 0.35);
    // the faces turn away, one by one
    step(3.2, () => { const n = stage.neighbour(); if (n) n.lookTo = 0; });
    step(4.6, () => { const y = stage.yai(); if (y) y.lookTo = 0; const kd = stage.kid(); if (kd) kd.lookTo = 0; });
    step(5.8, () => { const f = stage.frontMan(); if (f) f.lookTo = 0; });
    tr(4.0, 9.0, (k) => { duck('e3vesper', 1 - 0.25 * k); }, rawK);
    sfx(8.2, 'z2D1');                                 // 6.19 s → 14.39
    sfx(14.2, 'e3close2', 0.9);
    pitchTo(14.4, 22.0, -0.5, 0.16, smoothK);          // up, to the Buddha
    sfx(15.0, 'z2close');                             // 8.36 s → 23.36
    ending(c, api, 23.5);
  }

  (window.__CHAPTERS__ = window.__CHAPTERS__ || {}).e3c2 = Object.assign(DATA, {
    build,
    intro,
    scenes: [scForce, scStepOut, scLetRun, scStill]
  });
})();
