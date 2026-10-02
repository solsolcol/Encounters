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
      { k: 'A', text: 'Clench your fists and force it to stop.',
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
      evHandsBrief: 'The chant will swell, and your hands will start to rise on their own. HOLD while it swells to keep them still. When it ebbs, LET GO and breathe. Hold too long and you are only holding your breath.',
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
    const matFloor = new THREE.MeshStandardMaterial({ map: floorTex, roughness: 0.24, metalness: 0.05 });
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
    const shelf = new THREE.Group(); shelf.position.set(SHELF.x, 0, SHELF.z - 0.22); world.add(shelf);
    solids.push(box(1.5, 1.15, 0.4, 0, 0.575, 0, matWood, shelf));
    const bookMats = [0x8c1b14, 0xa3241a, 0x7a1610, 0x99301e].map(c => new THREE.MeshStandardMaterial({ color: c, roughness: 0.75 }));
    const books = [];
    for (let row = 0; row < 3; row++) for (let i = 0; i < 18; i++) {
      const b = box(0.06, 0.2, 0.15, -0.66 + i * 0.077, 0.24 + row * 0.33, 0.06, bookMats[(i + row) % 4], shelf, false);
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
    const patchMat = new THREE.MeshStandardMaterial({ color: 0xffd36e, roughness: 0.2, metalness: 0.9, emissive: 0x6a4a10, emissiveIntensity: 0.6, side: THREE.DoubleSide });
    const myLeaf = [];
    for (let i = 0; i < 9; i++) {
      const p = new THREE.Mesh(new THREE.PlaneGeometry(0.035, 0.035), patchMat);
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
    box(HALL.x1 - HALL.x0 + 3, 0.2, 4.0, 0, -0.1, HALL.z1 + 2.45, matCream, outside);                       // the porch
    for (let i = 0; i < 6; i++) box(5.0, 0.2, 0.36, 0, -0.3 - i * 0.2, HALL.z1 + 4.6 + i * 0.36, matCream, outside);   // the steps
    const yard = new THREE.Mesh(new THREE.PlaneGeometry(60, 40), new THREE.MeshStandardMaterial({ map: tex(makeSlabs(THREE, cnv)), roughness: 0.9 }));
    yard.material.map.repeat.set(16, 11);
    yard.rotation.x = -Math.PI / 2; yard.position.set(0, -1.4, HALL.z1 + 26); yard.receiveShadow = true; outside.add(yard);
    for (const s of [-1, 1]) {
      // porch columns, white with gold capitals, and the gables over the porch
      for (const x of [3.2, 6.6]) { box(0.5, 4.8, 0.5, s * x, 2.4, HALL.z1 + 4.0, matWhite, outside); cyl(0.32, 0.45, 0.4, s * x, 4.9, HALL.z1 + 4.0, matGold, 8, outside); }
      const lamp = new THREE.Group(); lamp.position.set(s * 3.4, -1.4, HALL.z1 + 9.0); outside.add(lamp);
      cyl(0.05, 0.07, 3.2, 0, 1.6, 0, matDark, 6, lamp);
      const glow = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 10), matBulb); glow.position.y = 3.3; lamp.add(glow);
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
      lay_scold:    { h: 1.55, take: 'Sit_Cross_Legged_on_Floor' },
      lay_sitwoman: { h: 1.60, take: 'Sit_Cross_Legged_on_Floor' },
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
          for (let i = 0; i < p.length; i += 4) {
            const r = p[i], g = p[i + 1], b = p[i + 2], L = 0.30 * r + 0.59 * g + 0.11 * b;
            const skin = r > g + 12 && g > b && r - b > 30 && r - b < 150 && L > 55 && L < 230 && (r - g) < 80;   // skin leads red by a clear margin; an olive tee does not
            const hair = L < 40;
            if (skin || hair) continue;
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
      const group = new THREE.Group(); group.position.set(x, o.y || 0, z); group.rotation.y = ry; world.add(group);
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
          if (o.white !== false) o2.material = Array.isArray(o2.material) ? o2.material.map(whiteOf) : whiteOf(o2.material);
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
        const clip = (gltf.animations || []).find(c => c.name === KIND[key].take) || (gltf.animations || [])[0];
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
    const shadow = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 2.1), new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false, opacity: 0.0, color: 0x000000 }));
    shadow.rotation.x = -Math.PI / 2; shadow.position.set(PLACE.x + 0.05, 0.015, PLACE.z - 1.35); shadow.renderOrder = 2; world.add(shadow);
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
      shadow.material.opacity = seated ? 0.22 + 0.40 * k : 0;
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
      kit.event({
        kind: 'resist', label: DATA.words.evHands, brief: DATA.words.evHandsBrief,
        swells: [{ at: 2.4, len: 5.0, pull: 0.40 }, { at: 11.0, len: 6.0, pull: 0.58 }, { at: 20.5, len: 7.0, pull: 0.98 }],
        award: { stat: 'sanity', per: 1.2, hi: 6 }, missCost: 6,
        onBegin: () => { if (worldSfx) worldSfx('e3gong', 0.45, 1, panAt(MONKS[0].x, MONKS[0].z)); },
        onSwell: (i) => {
          if (worldSfx) { worldSfx('chantswell', 0.75, 1, 0); worldSfx('handsrise', 0.55 + 0.15 * i, 1, 0); }
          fight.swell = i;
          // the yant he chose in chapter 1 warms on his back as they rise
          if (yantOn()) { kit.flash({ color: 'rgba(255,196,96,0.22)', secs: 0.9 }); if (worldSfx) worldSfx('yantwarm', 0.55); }
        },
        onEbb: () => { fight.swell = -1; },
        onRise: (k) => { fight.k = k; if (kit.hands) kit.hands(Math.min(1, k * 0.92), { secs: 0.18 }); },
        onSlip: (n) => {
          fight.slips++;
          if (worldSfx) worldSfx('handslip', 0.9);
          if (kit.haptic) kit.haptic([40, 30, 60]);
          kit.flash({ color: 'rgba(255,190,90,0.20)', secs: 0.4 });
          // a head turns
          const who = [neighbour, frontMan, yai][Math.min(2, n)];
          if (who) who.lookTo = 1;
          if (n === 0) queueLine('z2slip1');
          if (n === 1) { queueLine('z2slip2'); if (worldSfx) worldSfx('whispers', 0.45, 1, panAt(NEIGH.x, NEIGH.z)); }
          kit.presence(Math.min(0.6, 0.18 * fight.slips));
        }
      }).then(r => {
        fight.result = r;
        if (r && !r.aborted) {
          kit.conduct({ note: r.ok ? 'Held your hands still through the chant — almost.' : 'Lost your hands to the chant, in front of everyone.', s: 0, a: r.ok ? 3 : -1 });
          beginPeak();
        }
      });
    }
    /* 6 · THE PEAK: whatever the score, it takes them; the faces turn; his
       line; and the decision opens by itself */
    function beginPeak() {
      if (phase !== 'fight') return;
      setPhase('peak');
      peakT = dayClock.t;
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
      mixK.chant += (chant - mixK.chant) * (1 - Math.exp(-wdt / 1.0));
      mixK.pull += (pull - mixK.pull) * (1 - Math.exp(-wdt / 1.4));
      mixK.dusk += (0.08 + 0.32 * nearDoor - mixK.dusk) * (1 - Math.exp(-wdt / 1.2));
      DATA.ambience.beds[0][1] = 0.40;
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
      for (const r of [neighbour, yai, kid, frontMan]) if (r && r.ready) headTick(r, wdt);
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
    const film = buildFilm(ctx, world, { tex, parseOnce, thai, box, cyl, alive: () => alive, owned, mkSitter });
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
     (filled in at CP5 — docs/V18.0-E3C2-PLAN.md §4.2) */
  function buildFilm(ctx, world, h) {
    const root = new ctx.THREE.Group(); world.add(root);
    return { root, P: {}, tick() {} };
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
     (CP5) */
  function intro(c, s, api) {
    const { fade, step } = api;
    step(0, () => {});
    fade(0.0, 0.5, 1, 1);
    c.endFade = 1;
    c.keepFade = true;
  }

  /* ============================================================ THE ENDINGS
     (CP6) */
  function scForce(c, s, api) { api.fade(0, 1, 0, 1); c.endFade = 1; }
  function scStepOut(c, s, api) { api.fade(0, 1, 0, 1); c.endFade = 1; }
  function scLetRun(c, s, api) { api.fade(0, 1, 0, 1); c.endFade = 1; }
  function scStill(c, s, api) { api.fade(0, 1, 0, 1); c.endFade = 1; }

  (window.__CHAPTERS__ = window.__CHAPTERS__ || {}).e3c2 = Object.assign(DATA, {
    build,
    intro,
    scenes: [scForce, scStepOut, scLetRun, scStill]
  });
})();
