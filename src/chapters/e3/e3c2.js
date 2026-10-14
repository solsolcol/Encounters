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
   player fights them by TAPPING (the `resist` event, the twenty-fifth —
   since v18.1 a rapid-tap fight: the rate it takes climbs from 5 to 6.5 taps
   a second over twelve seconds of chant, and one second too slow in all
   loses). Held: the peak is small, one face glances. Lost: the hands go all
   the way, his shadow on the floor has a crown, the hall turns to look. The
   decision opens by itself either way.

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
    prompt: 'The chant is at its height. Your hands have moved on their own, and the people around you have seen it.',   // v18.4: true whether he held them or lost them
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
    assets: ['lay_admintee', 'lay_botak', 'lay_granny', 'lay_scold', 'lay_sitwoman', 'lay_sitwomanhd', 'lay_adminteehd', 'lay_grannyhd', 'lay_botakhd', 'monkrow',
             'thaikit', 'slipper', 'admintee', 'tree1', 'tree2', 'tree3', 'tree4', 'buddhahd', 'buddhalod',
             'filmoffice', 'sitangry', 'sitclap'],   // v19.2: the film's office, and the two at its desks

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
      /* v18.5: the line Step back leaves on screen — without it the engine's
         fallback said "Tap the glowing pile of notes to look again" here */
      actLine: 'Press E to choose what you do',
      actLineTouch: 'Tap to choose what you do',
      objBook: 'Take a chant book from the shelf',
      objLeaf: 'Press gold leaf onto the small Buddha',
      objPlace: 'Find the free mat at the end of the third row from the front',
      objChant: 'Chant with the hall',
      objHands: 'Tap fast to keep your hands down',
      hotBook: 'Take a chant book',
      hotLeaf: 'Press gold leaf',
      evHands: 'Keep your hands still',
      evHandsBrief: 'Your hands are starting to rise on their own. TAP as fast as you can: every tap pulls them back down, and the chant makes it harder. Slow down for even one second and they are no longer yours.',
      presence: 'People are looking at you.',
      presenceWarn: 'Sanity drops while they stare.',
      /* v18.5: the notes on the card are the chapter's words, so the sheet carries them */
      noteBook: 'Took a chant book, like everyone else.',
      noteLeaf: 'Pressed gold leaf on the back of the Buddha, where nobody sees it.',
      noteHeld: 'Kept your hands down through the chant.',
      noteLost: 'Lost your hands to the chant, in front of everyone.'
    },
    sayPrefix: 'z2'
  };

  /* the measured length of every line said OUTSIDE a cutscene
     (masters/v18.0: the installed files, ffprobe) */
  const SECS = { z2arrive: 2.27, z2leaf: 4.05, z2kneel: 4.60, z2slip1: 1.88, z2slip2: 1.80, z2peak: 2.19,
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
    /* v19.2: the coffers ON the beams — a 3.25 × 3 m tile ignored them (a beam
       ran a third into a coffer, another 10 cm from a rosette): three coffers
       between the long beams, one bay of 2.6 m between cross beams, the grid
       offset so its lines fall on the beams at x ±COLX and on COLZ */
    const cofTex = tex(makeCoffers(THREE, cnv)), cofU = (HALL.x1 - HALL.x0) / (2 * COLX / 3);
    cofTex.repeat.set(cofU, (HALL.z1 - HALL.z0) / (COLZ[0] - COLZ[1]));
    cofTex.offset.set(1 - ((-COLX - HALL.x0) / (HALL.x1 - HALL.x0)) * cofU, -(((COLZ[0] - HALL.z0) / (COLZ[0] - COLZ[1])) % 1));
    const dadoTex = tex(makeDado(THREE, cnv));   // v19.2: tiled per box (uvScale, DADO_TILE), not repeat 8 on every length
    const blueTex = tex(makeBlueGold(THREE, cnv)); blueTex.repeat.set(8, 5);   // v19.2: a fine glass mosaic (at 3 × 2 the cells were a metre wide: bathroom tiles)
    const wallTex = tex(makeCreamWall(THREE, cnv)); wallTex.repeat.set(6, 3);
    const goldTex = tex(makeGoldBand(THREE, cnv)); goldTex.repeat.set(10, 1);
    const tileTex = tex(makeRoofTiles(THREE, cnv, '#c96a2e', '#5e2a10')); tileTex.repeat.set(6, 4);
    const matFloor = new THREE.MeshStandardMaterial({ map: floorTex, roughness: 0.55, metalness: 0.05 });   // v19.2: 0.55 (at 0.42 the Buddha lamp still made a blown-out pool mid-frame in every ending)   // (0.32 put a hot spot of the Buddha lamp on the stone in front of every row)
    const matCol   = new THREE.MeshStandardMaterial({ map: lacTex, roughness: 0.32, metalness: 0.2 });
    // v19.2: the columns get a sheet drawn at THEIR proportions (0.62 × 7.2 m): the square one was stretched 11.6:1 up them, its flowers gold dashes
    const matColumn = new THREE.MeshStandardMaterial({ map: tex(makeLacquerColumn(THREE, cnv)), roughness: 0.32, metalness: 0.2 });
    /* v19.2: a box's UVs are 0..1 on every face whatever its size, so a fixed
       texture repeat came out a different size on every box (the dado's gold
       zigzag 3.6 cm under a window, 40 cm behind the Buddha): scale a box's
       u (and v) by its own length */
    const uvScale = (m, su, sv = 1) => { const uv = m.geometry.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * su, uv.getY(i) * sv); uv.needsUpdate = true; return m; };
    const DADO_TILE = 0.64;
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
    /* v18.8 · CHAD'S BUDDHA (his Phra Buddha Chinnarat scan, every map kept —
       "make sure all instances of buddha statues in the entire game, across
       episode 3 all chapters, are all using this new buddha statue model ...
       It needs to have its metallic sheen, texture, etc. It needs to look
       perfect"). It takes the kit Buddha's place at the kit's footprint: its
       base on the group's origin and 0.527 m tall before the group's own scale,
       so every placement keeps its size, and no tint (its gold is its own).
       One THREE.LOD per image. A PRINCIPAL image (`hd: true`) carries EVERY
       triangle (588,799, buddhahd) while it is big on screen — under 4 x its
       height away — the smoothed 123k cut further out, and a 30k cut sharing
       that cut's vertices once it is small (12 x). Every other image (under a
       metre tall) is the smoothed cut — no facet on its face, proven by close
       render — and the 30k cut beyond 4 x its height. Its
       metal reflects the room environment at its own strength (the world's is
       0.05, kept low for everything else); the materials are shared clones,
       and the dispose sweep never frees an envMap. */
    const BUDDHA_H = 0.527, BUDDHA_ENV = 0.15, _bMat = new Map();   // 0.15: bracketed in the hall at 0 / 0.15 / 0.3 / 0.5 — 0 left the unlit images bronze-dark, 0.3 up washed the gold pale
    function buddhaMat(m) {
      let c = _bMat.get(m);
      if (!c) { c = m.clone(); c.envMap = scene.environment || null; c.envMapIntensity = BUDDHA_ENV; _bMat.set(m, c); }
      return c;
    }
    function chadBuddha(g, o) {
      Promise.all([parseOnce('buddhahd'), parseOnce('buddhalod')]).then(([hd, lo]) => {
        if (!alive) return;
        const bb = new THREE.Box3().setFromObject(hd.scene), k = BUDDHA_H / (bb.max.y - bb.min.y), h = BUDDHA_H * (o.s || 1);
        const lod = new THREE.LOD();
        const level = (src, d) => {
          const w = new THREE.Group(); w.scale.setScalar(k); w.position.y = -bb.min.y * k;
          const m = src.clone(true); w.add(m);
          m.traverse(q => { if (!q.isMesh) return; q.castShadow = o.cast !== false && !LOW; q.receiveShadow = true; q.material = buddhaMat(q.material); });
          lod.addLevel(w, d);
        };
        /* only the PRINCIPAL images (`hd: true` — the ones the player stands
           before) carry the full statue; at 589k a level, three of them drawn
           at once at e3c1's altar was 2.6M triangles a frame */
        /* v19.2: `hdAt` (× height) — the hall's principal at 4.7 m tall drew
           every one of its 589k triangles from anywhere within 19 m, the whole
           nave: three quarters of the kneeling frame's triangles for ~390
           device pixels of statue on a phone, through the chant and the fight,
           where a hot phone drops taps. A phone draws the smoothed 123k cut
           there (the same shape at that size); a desktop is unchanged. */
        if (o.hd) { level(hd.scene, 0); level(lo.scene.getObjectByName('buddha_mid'), (o.hdAt || 4) * h); }
        else level(lo.scene.getObjectByName('buddha_mid'), 0);
        level(lo.scene.getObjectByName('buddha_far'), (o.hd ? 12 : 4) * h);
        g.add(lod);
        for (const x of (o.hide || [])) if (x) x.visible = false;
        if (o.then) o.then(g, lod);
      }).catch(err => { console.warn('buddha failed to load', err); ctx.loadFail && ctx.loadFail('buddhahd', err); });
      return g;
    }
    function thai(name, x, y, z, o = {}) {
      const g = new THREE.Group(); g.position.set(x, y, z); g.rotation.y = o.ry || 0;
      if (o.s) g.scale.setScalar(o.s);
      (o.parent || world).add(g);
      if (name === 'buddha') return chadBuddha(g, o);   // v18.8: Chad's statue, not the kit's
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
        /* v18.4: `sgn` points OUTWARD, so every trim sits at x − sgn·d: at
           x + sgn·d the dado was coplanar with the wall's face (z-fighting
           down both long walls) and the frames, crowns and shutters were
           buried in the masonry */
        const d = uvScale(box(0.04, 1.15, len, x - sgn * 0.02, 0.575, (za + zb) / 2, matDado, world, false), len / DADO_TILE); d.castShadow = false;
      }
      for (const z of WINZ) {
        walls.push(box(T, WIN.sill, WIN.w, xc, WIN.sill / 2, z, matWall));
        uvScale(box(0.04, 1.15, WIN.w, x - sgn * 0.02, 0.575, z, matDado, world, false), WIN.w / DADO_TILE);
        const top = WIN.sill + WIN.h;
        walls.push(box(T, H - top, WIN.w, xc, top + (H - top) / 2, z, matWall));
        // the gold frame, inside face: two jambs, a sill, and the pointed crown
        const fx = x - sgn * 0.035;
        box(0.07, WIN.h + 0.1, 0.09, fx, WIN.sill + WIN.h / 2, z - WIN.w / 2 - 0.02, matGold, world, false);
        box(0.07, WIN.h + 0.1, 0.09, fx, WIN.sill + WIN.h / 2, z + WIN.w / 2 + 0.02, matGold, world, false);
        box(0.12, 0.09, WIN.w + 0.24, fx, WIN.sill - 0.03, z, matGold, world, false);
        const crown = new THREE.Mesh(new THREE.ShapeGeometry(crownShape(THREE, WIN.w + 0.34, 0.95)), matGold);   // v19.2: solid gilt (the band texture, repeated by the shape's metre UVs, shimmered as red pinstripes)
        crown.position.set(x - sgn * 0.075, top, z); crown.rotation.y = sgn > 0 ? -Math.PI / 2 : Math.PI / 2; world.add(crown);
        // the open shutters, lacquer and gold, folded back against the inner wall
        for (const s of [-1, 1]) {
          const sh = box(0.04, WIN.h, WIN.w / 2, x - sgn * 0.03, WIN.sill + WIN.h / 2, z + s * (WIN.w / 2 + WIN.w / 4 + 0.05), matCol, world, false);
          sh.rotation.y = 0;
        }
      }
    }
    longWall(HALL.x0, -1);
    longWall(HALL.x1, 1);
    // the back wall, behind the Buddha: deep blue glass and gold
    walls.push(box(HALL.x1 - HALL.x0 + 2 * T, H, T, 0, H / 2, HALL.z0 - T / 2, matBlue));
    uvScale(box(HALL.x1 - HALL.x0, 1.15, 0.04, 0, 0.575, HALL.z0 + 0.03, matDado, world, false), (HALL.x1 - HALL.x0) / DADO_TILE).castShadow = false;   // v19.2: the dado along it too (it ran bare into the floor)
    // the front wall, with the doorway
    for (const s of [-1, 1]) {
      const w = (HALL.x1 - HALL.x0) / 2 - DOOR.hw + T;
      walls.push(box(w, H, T, s * (DOOR.hw + w / 2), H / 2, HALL.z1 + T / 2, matWall));
      uvScale(box(w, 1.15, 0.04, s * (DOOR.hw + w / 2), 0.575, HALL.z1 - 0.02, matDado, world, false), w / DADO_TILE);
    }
    walls.push(box(DOOR.hw * 2, H - DOOR.h, T, 0, DOOR.h + (H - DOOR.h) / 2, HALL.z1 + T / 2, matWall));
    // the door frame, gilded, and the two leaves open into the hall against the wall
    box(0.14, DOOR.h + 0.14, 0.2, -DOOR.hw - 0.05, DOOR.h / 2, HALL.z1 - 0.06, matGold, world, false);
    box(0.14, DOOR.h + 0.14, 0.2, DOOR.hw + 0.05, DOOR.h / 2, HALL.z1 - 0.06, matGold, world, false);
    box(DOOR.hw * 2 + 0.38, 0.16, 0.22, 0, DOOR.h + 0.06, HALL.z1 - 0.06, matGold, world, false);
    const dcrown = new THREE.Mesh(new THREE.ShapeGeometry(crownShape(THREE, DOOR.hw * 2 + 0.7, 1.4)), matGold);
    dcrown.position.set(0, DOOR.h + 0.12, HALL.z1 - 0.05); dcrown.rotation.y = Math.PI; world.add(dcrown);   // v18.5: facing INTO the hall (it faced the wall and was culled)
    uvScale(box(DOOR.hw * 2, 0.05, 0.45, 0, -0.025, HALL.z1 + 0.225, matFloor, world, false), DOOR.hw * 2 / (HALL.x1 - HALL.x0), 0.45 / (HALL.z1 - HALL.z0));   // v19.2: at the floor's own scale (its 6 × 11 repeat drew grout every 2 cm here)   // v18.5: the threshold — the doorway had no floor between the hall and the porch
    const leaves = [];
    for (const s of [-1, 1]) {
      const pivot = new THREE.Group(); pivot.position.set(s * DOOR.hw, 0, HALL.z1 - 0.05); world.add(pivot);
      const leaf = box(DOOR.hw, DOOR.h - 0.05, 0.08, -s * DOOR.hw / 2, (DOOR.h - 0.05) / 2, 0, matCol, pivot, false);
      // a gold panel on each leaf (a guardian's painted outline would be here)
      box(DOOR.hw * 0.8, DOOR.h * 0.78, 0.01, -s * DOOR.hw / 2, DOOR.h * 0.48, 0.045, matGold, pivot, false);   // v19.2: solid gilt (the beam band at 10× drew forty pinstripes on it)
      /* v18.4: −s·(π − 0.12) — INTO the hall and folded back along the
         front wall, as this comment always said. s·1.45 swung both leaves
         OUT onto the porch, while their colliders stood inside the hall
         beside the spawn, invisible walls on the way to the shelf */
      pivot.rotation.y = -s * (Math.PI - 0.12);
      leaves.push(pivot);
      solids.push(hid(box(DOOR.hw, 2, 0.2, s * (DOOR.hw * 1.5), 1, HALL.z1 - 0.14, matProxy)));
    }
    // the doorway itself is closed to the player (the endings use it)
    walls.push(hid(box(DOOR.hw * 2, 3, 0.3, 0, 1.5, HALL.z1 + 0.35, matProxy)));

    /* ----------------------------------------------------------- the columns
       Black lacquer, gold stencilled lotus bands, a gilt lotus capital; a
       fluorescent tube on the inner face of every second one (Thai halls
       have them) and a small loudspeaker on one. */
    const tubes = [];
    const tubeGlowM = new THREE.MeshBasicMaterial({ map: tex(makeGlow(THREE, cnv, '200,225,255')), transparent: true, opacity: 0.35, depthWrite: false, blending: THREE.AdditiveBlending });
    for (const sx of [-COLX, COLX]) for (let i = 0; i < COLZ.length; i++) {
      const z = COLZ[i];
      solids.push(box(COLW, H, COLW, sx, H / 2, z, matColumn));
      /* v19.2: the capital FLARES under the beam (radiusTop is cyl's first
         number — 0.31 over 0.527 was a funnel the column's corners broke
         out of), in solid gilt */
      const cap = cyl(COLW * 0.98, COLW * 0.80, 0.55, sx, H - 0.28, z, matGold, 8);
      cap.rotation.y = Math.PI / 4;
      box(COLW + 0.06, 0.16, COLW + 0.06, sx, 0.08, z, matGold, world, false);
      if (i % 2 === 1) {
        const tb = box(0.05, 1.2, 0.05, sx - Math.sign(sx) * (COLW / 2 + 0.03), 3.6, z, matTube, world, false);
        tb.castShadow = false; tubes.push(tb);
        // v19.2: its glow on the lacquer (a bare tube read as a scratch on the screen)
        const tg = new THREE.Mesh(new THREE.PlaneGeometry(0.30, 1.5), tubeGlowM); tg.position.set(sx - Math.sign(sx) * (COLW / 2 + 0.004), 3.6, z); tg.rotation.y = -Math.sign(sx) * Math.PI / 2; world.add(tg);
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
    /* v19.2: a FITTING, not two rings in the air — a ceiling canopy, a rod
       you can see, a gilt bowl at the hub and spokes out to both rings, the
       crystal drops hanging FROM the rings. Bulbs, drops and spokes are one
       instanced draw each (they were 78 meshes, each its own geometry). */
    const chand = [];
    const bulbG = new THREE.SphereGeometry(0.045, 8, 6), dropG = new THREE.OctahedronGeometry(0.03), spokeG = new THREE.CylinderGeometry(0.008, 0.008, 1, 4);
    const _cm = new THREE.Matrix4(), _cq = new THREE.Quaternion(), _cs = new THREE.Vector3(), _cp = new THREE.Vector3(), _cup = new THREE.Vector3(0, 1, 0);
    for (const z of [-4.6, -10.4, -15.8]) {
      const g = new THREE.Group(); g.position.set(0, H - 2.2, z); world.add(g);
      cyl(0.13, 0.09, 0.06, 0, 2.17, 0, matGold, 12, g);                // the ceiling canopy
      cyl(0.018, 0.018, 2.0, 0, 1.15, 0, matGold, 6, g);                // the rod
      cyl(0.11, 0.045, 0.17, 0, 0.0, 0, matGold, 12, g);                // the hub's bowl
      const fin = new THREE.Mesh(new THREE.SphereGeometry(0.05, 10, 8), matGold); fin.position.y = -0.38; g.add(fin);
      cyl(0.012, 0.012, 0.3, 0, -0.23, 0, matGold, 4, g);               // the stem to the finial
      const bulbs = new THREE.InstancedMesh(bulbG, matBulb, 13), drops = new THREE.InstancedMesh(dropG, matGoldHot, 13), spokes = new THREE.InstancedMesh(spokeG, matGold, 13);
      let nb = 0;
      for (let ring = 0; ring < 2; ring++) {
        const R = 0.55 - ring * 0.22, y = -ring * 0.28, n = 8 - ring * 3;
        const tor = new THREE.Mesh(new THREE.TorusGeometry(R, 0.02, 6, 28), matGold); tor.rotation.x = Math.PI / 2; tor.position.y = y; g.add(tor);
        for (let i = 0; i < n; i++, nb++) {
          const a = i / n * Math.PI * 2;
          bulbs.setMatrixAt(nb, _cm.makeTranslation(Math.cos(a) * R, y + 0.06, Math.sin(a) * R));
          _cs.set(1, 2.4, 1); _cp.set(Math.cos(a + 0.3) * R, y - 0.092, Math.sin(a + 0.3) * R);
          drops.setMatrixAt(nb, _cm.compose(_cp, _cq.identity(), _cs));
          // a spoke from the hub out to this bulb's place on the ring
          const h0 = new THREE.Vector3(0, ring ? -0.07 : 0.05, 0), h1 = new THREE.Vector3(Math.cos(a) * R, y, Math.sin(a) * R);
          const d = h1.clone().sub(h0), L = d.length();
          _cq.setFromUnitVectors(_cup, d.normalize()); _cs.set(1, L, 1); _cp.copy(h0).add(h1).multiplyScalar(0.5);
          spokes.setMatrixAt(nb, _cm.compose(_cp, _cq, _cs));
        }
      }
      for (const im of [bulbs, drops, spokes]) { im.instanceMatrix.needsUpdate = true; im.computeBoundingSphere(); im.castShadow = false; g.add(im); }
      chand.push(g);
    }
    const fans = [];
    for (const sx of [-5.1, 5.1]) for (const z of [-3.8, -9.0, -14.2]) {
      if (sx > 0 && z < -5) continue;            // not over the monks
      const pivot = new THREE.Group(); pivot.position.set(sx, H - 1.6, z); world.add(pivot);
      cyl(0.015, 0.015, 1.63, sx, H - 0.815, z, matDark, 4);   // v18.4: down to the kit fan's top (H − 1.63), not 0.63 m short of it
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
    /* v19.2: not shown — Chad's statue carries its own flame arch, so these
       made two halos one inside the other: the doubling he had taken out of
       chapter 1 at v19.1 ("remove the half circle thing behind the main
       buddha statue") */
    aureole.visible = false;
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
    /* v18.8 (Chad: "The principal buddha statue in the main hall should also
       use this as a large statue"): his statue at x9.0 — 4.74 m to the tip of
       its own flame arch (6.84 m, under the 7.2 m ceiling; the nearest
       cross-beam is at z -16.8), 3.2 m wide on the pedestal's 3.6 m top tier
       and 1.85 m deep on its 2.1, so it sits the tier rather than overhanging
       it; the hall's gold flame rings stand round its arch on the blue */
    thai('buddha', 0, PED_TOP, PED.z + 0.1, { s: 9.0, hd: true, hdAt: LOW ? 1.9 : 4, tint: GOLD_T, glow: 0.22, hide: [buddhaProxy] });
    // the seven-tier umbrellas
    for (const s of [-1, 1]) {
      const x = s * 2.75, g = new THREE.Group(); g.position.set(x, 0, PED.z + 1.2); world.add(g);
      cyl(0.035, 0.035, 5.2, 0, 2.6, 0, matGold, 6, g);
      for (let i = 0; i < 7; i++) {
        const r = 0.62 - i * 0.07, y = 2.4 + i * 0.42;
        const tier = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.92, r * 1.06, 0.2, 18, 1, false), i % 2 ? matGoldHot : matWhite);   // v19.2: closed and a little flared (open, from below, they were hoops)
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
      thai('buddha', ALT.x + i * 0.42, 1.2, ALT.z - 0.14, { s: 0.85, tint: GOLD_T, glow: 0.15 });   // v18.5: 0.42 apart, on the riser (at 0.55 the outer two hung off its ends)
    }
    const candleFl = [];
    for (let i = 0; i < 12; i++) {
      const cx = ALT.x - 1.32 + i * 0.24, cz = ALT.z + 0.38;   // v18.5: along the front edge, clear of the pot and the phans
      cyl(0.018, 0.018, 0.22, cx, 0.96, cz, matCream, 6);
      const f = new THREE.Mesh(new THREE.ConeGeometry(0.014, 0.05, 6), matFlame); f.position.set(cx, 1.1, cz); world.add(f); candleFl.push(f);
    }
    thai('incense', ALT.x, 0.845, ALT.z + 0.27, { s: 0.6, cast: false });   // v18.5: in front of the riser (it stood half inside it)
    for (const s of [-1, 1]) {
      thai('orchid', ALT.x + s * 1.25, 0.845, ALT.z - 0.1, { s: 0.45, cast: false });   // v18.5: on the table beyond the riser (it floated half a metre up, inside an image)
      thai('phan', ALT.x + s * 0.7, 0.845, ALT.z + 0.30, { s: 0.75, cast: false });     // v18.5: clear of the riser's face
      thai('lotusbowl', ALT.x + s * 2.15, 0, ALT.z + 0.3, { s: 0.7, cast: false });
      solids.push(hid(box(0.6, 0.7, 0.6, ALT.x + s * 2.15, 0.35, ALT.z + 0.3, matProxy)));   // v18.5: and it stops a walker
    }
    // incense smoke over the altar
    const smokeN = LOW ? 18 : 36;
    const smokeG = new THREE.BufferGeometry();
    smokeG.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(smokeN * 3), 3));
    // v19.2: soft round puffs (a Points material with no map draws hard grey SQUARES) from the sticks' tips, not from inside the pot
    const smoke = new THREE.Points(smokeG, new THREE.PointsMaterial({ map: tex(makeGlow(THREE, cnv, '226,220,212')), color: 0xffffff, size: 0.17, transparent: true, opacity: 0.2, depthWrite: false }));
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
    for (let mi = 0; mi < MONKS.length; mi++) {
      const m = MONKS[mi];
      if (LOW && mi % 2) continue;      // v19.2: a phone builds every other monk — and so every other cushion and fan (they stood before nobody)
      thai('cushflat', m.x + 0.05, MPLAT.h + 0.012, m.z, { s: 1.25, ry: Math.PI / 2, cast: false });
      // the talapat: an oval fan on a stick, planted before him
      // v19.2: BESIDE him, leaning on its stick — planted 0.55 m in front it hid every monk's face behind a brown disc
      const fan = new THREE.Group(); fan.position.set(m.x - 0.22, MPLAT.h, m.z + 0.42); fan.rotation.set(0, Math.PI / 2, 0.12); world.add(fan);
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
    { const sign = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.28), new THREE.MeshBasicMaterial({ map: tex(makeSignTex(THREE, cnv, 'บทสวดมนต์ · CHANT BOOKS', '#3a0d08', '#f1d38a', 0.9 / 0.28)), toneMapped: false }));
      sign.position.set(0, 1.30, 0.12); shelf.add(sign); }   // v18.5: standing on the shelf's top (it floated 16 cm over it)

    // the gold-leaf table: a small seated Buddha patched with leaf, a tray of
    // leaf in paper squares, a candle, a donation box
    const leafT = new THREE.Group(); leafT.position.set(LEAF.x, 0, LEAF.z); leafT.rotation.y = Math.PI / 2; world.add(leafT);
    solids.push(box(1.3, 0.85, 0.65, 0, 0.425, 0, matRedD, leafT));
    box(1.36, 0.04, 0.7, 0, 0.87, 0, matGold, leafT, false);
    const smallBuddha = new THREE.Group(); smallBuddha.position.set(0, 0.89, -0.05); leafT.add(smallBuddha);
    const leafPatches = [];
    /* v18.8: Chad's statue is not the kit's shape (a flame-arch halo stands
       behind the body), so once it lands every patch is cast along its own
       line onto the real surface — the front ones onto the chest and base,
       the back ones onto the statue's back — against the 123k level (close
       to the surface to a millimetre, and a ninth of the triangles to test) */
    thai('buddha', 0, 0, 0, { s: 1.15, hd: true, tint: GOLD_T, glow: 0.18, parent: smallBuddha, then: (g, lod) => {
      if (!lod || !lod.levels || !lod.levels[1]) return;
      smallBuddha.updateMatrixWorld(true);
      const target = lod.levels[1].object, rc = new THREE.Raycaster(), o = new THREE.Vector3(), dir = new THREE.Vector3();
      const was = target.visible; target.visible = true;
      for (const p of leafPatches) {
        const back = p.userData.back;
        o.set(p.position.x, p.position.y, back ? -0.6 : 0.6); smallBuddha.localToWorld(o);
        dir.set(0, 0, back ? 1 : -1).transformDirection(smallBuddha.matrixWorld);
        rc.set(o, dir);
        const hit = rc.intersectObject(target, true)[0];
        if (hit) p.position.z = smallBuddha.worldToLocal(hit.point.clone()).z + (back ? -0.003 : 0.003);
      }
      target.visible = was;
    } });
    // patches of leaf already on him, and the ones he will add (on his BACK)
    const patchMat = new THREE.MeshStandardMaterial({ color: 0xe9c46a, roughness: 0.35, metalness: 0.7, emissive: 0xc8962a, emissiveIntensity: 0.14, side: THREE.DoubleSide });   // v19.2: 0.55 self-light read as yellow sticky notes
    const myLeaf = [];
    for (let i = 0; i < 9; i++) {
      const p = new THREE.Mesh(new THREE.PlaneGeometry(0.022, 0.018), patchMat);
      const back = i >= 6;
      const py = 0.12 + hash(i, 2) * (i >= 6 ? 0.36 : 0.18);   // v19.2: the front ones below the neck (one sat across his eye)
      // v18.5: ON him — at ±0.15 (his box's extreme) they hung 14 cm in front of the chest and 7 cm off the back
      p.position.set((hash(i, 1) - 0.5) * 0.12, py, back ? -0.085 : (py < 0.24 ? 0.08 : 0.02));
      p.rotation.set(0, back ? Math.PI : 0, hash(i, 3) * 1.2);
      p.userData.back = back; leafPatches.push(p);
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
    /* v19.2: two OPEN gilt racks either side of the runner — one solid
       5.4 × 0.75 m red box was the first thing play showed: a wall across a
       phone's whole frame at chest height, the runner running into its face.
       The collider stays one piece (nothing about where he can walk moves). */
    solids.push(hid(box(CANDLES.x1 - CANDLES.x0, 0.75, 0.4, 0, 0.375, CANDLES.z, matRedD)));
    for (const [xa, xb] of [[CANDLES.x0, -0.78], [0.78, CANDLES.x1]]) {
      const w = xb - xa, cx = (xa + xb) / 2;
      box(w + 0.06, 0.04, 0.46, cx, 0.77, CANDLES.z, matGold, world, false);          // the tray
      box(w, 0.03, 0.40, cx, 0.22, CANDLES.z, matRedD, world, false);                 // a low shelf
      for (const lx of [xa + 0.04, xb - 0.04]) for (const lz of [-0.18, 0.18]) box(0.03, 0.75, 0.03, lx, 0.375, CANDLES.z + lz, matGold, world, false);
    }
    /* v19.2: and a gilt rope across the runner between them, on two brass
       posts — the collider is one piece, so the open gap was an invisible
       wall to a player walking the runner; now what stops him is in view */
    for (const sx of [-1, 1]) {
      cyl(0.11, 0.13, 0.03, sx * 0.66, 0.015, CANDLES.z, matGold, 12);
      cyl(0.022, 0.026, 0.84, sx * 0.66, 0.43, CANDLES.z, matGold, 8);
      const ball = new THREE.Mesh(new THREE.SphereGeometry(0.045, 12, 8), matGold); ball.position.set(sx * 0.66, 0.87, CANDLES.z); world.add(ball);
    }
    { const pts = []; for (let i = 0; i <= 16; i++) { const u = i / 16; pts.push(new THREE.Vector3(-0.66 + 1.32 * u, 0.82 - 0.16 * Math.sin(Math.PI * u), CANDLES.z)); }
      world.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 24, 0.018, 6, false), new THREE.MeshStandardMaterial({ color: 0x9e1b14, roughness: 0.75 }))); }
    /* v19.2: the rack's candles and flames, the mats, the stands and the books
       on them are INSTANCED, one draw each — they were ~200 meshes, each its
       own geometry, the heaviest thing in a phone's view down the nave */
    const _im = new THREE.Matrix4(), _iq = new THREE.Quaternion(), _ie = new THREE.Euler(), _ip = new THREE.Vector3(), _is = new THREE.Vector3(1, 1, 1);
    const inst = (geo, mat, list, place, o = {}) => {
      if (!list.length) return null;
      const im = new THREE.InstancedMesh(geo, mat, list.length);
      list.forEach((it, i) => { _ie.set(0, 0, 0); _is.set(1, 1, 1); place(it, _ip, _ie, _is); im.setMatrixAt(i, _im.compose(_ip, _iq.setFromEuler(_ie), _is)); if (o.col) im.setColorAt(i, o.col(it)); });
      im.instanceMatrix.needsUpdate = true; if (im.instanceColor) im.instanceColor.needsUpdate = true;
      im.computeBoundingSphere(); im.castShadow = false; im.receiveShadow = !!o.recv; world.add(im); return im;
    };
    const rackSpots = [];
    for (let i = 0; i < 22; i++) {
      const cx = CANDLES.x0 + 0.12 + i * 0.25, h = 0.12 + hash(i, 7) * 0.12;
      if (Math.abs(cx) < 0.85) continue;          // (the aisle: no tray there now)
      rackSpots.push([cx, h]);
    }
    inst(new THREE.CylinderGeometry(0.016, 0.016, 1, 6), matCream, rackSpots, ([cx, h], p, e, sc) => { p.set(cx, 0.79 + h / 2, CANDLES.z); sc.set(1, h, 1); });
    const rackF = inst(new THREE.ConeGeometry(0.013, 0.045, 6), matFlame, rackSpots, ([cx, h], p) => { p.set(cx, 0.81 + h, CANDLES.z); });
    const rackFlicker = (t) => {
      if (!rackF) return;
      rackSpots.forEach(([cx, h], i) => rackF.setMatrixAt(i, _im.compose(_ip.set(cx, 0.81 + h, CANDLES.z), _iq.identity(), _is.set(1, 1 + Math.sin(t * 9 + i * 2.3) * 0.2, 1))));
      rackF.instanceMatrix.needsUpdate = true;
    };

    // the mats: a reed mat under every place in the rows, a book stand before each
    const myStand = new THREE.Group(); world.add(myStand);
    const matPage = new THREE.MeshStandardMaterial({ color: 0xf1e8d4, roughness: 0.9 });
    const matSpots = [], standSpots = [];
    for (let r = 0; r < ROWZ.length; r++) for (let c = 0; c < ROWX.length; c++) {
      const x = ROWX[c], z = ROWZ[r], mine = x === PLACE.x && z === PLACE.z;
      // v19.2: a phone lays no mat where it seats nobody (a back row of empty mats and stands read as a congregation that never came)
      if (LOW && r > 2 && !mine) continue;
      matSpots.push([x, z]);
      if (mine) {
        const st = new THREE.Group(); st.position.set(x, 0, z - 0.52); myStand.add(st);
        box(0.3, 0.012, 0.2, 0, 0.17, 0, matWood, st, false).rotation.x = 0.6;   // v18.5: tilted to the READER (−0.6 faced the Buddha)
        // (v19.2: legs to the board's underside — at 0.17 they stood 2 cm through it — and two at the high edge)
        box(0.02, 0.135, 0.02, -0.12, 0.0675, 0.04, matWood, st, false); box(0.02, 0.135, 0.02, 0.12, 0.0675, 0.04, matWood, st, false);
        box(0.02, 0.19, 0.02, -0.12, 0.095, -0.05, matWood, st, false); box(0.02, 0.19, 0.02, 0.12, 0.095, -0.05, matWood, st, false);
      } else if (hash(c, r) < 0.6) {
        // v19.2: and a chant book open on it, where someone kneels (every stand was a bare board, against "like everyone else")
        standSpots.push([x, z - 0.52, (!LOW || r <= 2) ? (r + c) % bookMats.length : -1]);
      }
    }
    inst(new THREE.PlaneGeometry(0.85, 0.95), matMat, matSpots, ([x, z], p, e) => { p.set(x, 0.008, z + 0.05); e.set(-Math.PI / 2, 0, 0); }, { recv: true });
    inst(new THREE.BoxGeometry(0.3, 0.012, 0.2), matWood, standSpots, ([x, z], p, e) => { p.set(x, 0.17, z); e.set(0.6, 0, 0); }, { recv: true });
    const legSpots = [];
    for (const [x, z] of standSpots) for (const sx of [-0.12, 0.12]) { legSpots.push([x + sx, z + 0.04, 0.135]); legSpots.push([x + sx, z - 0.05, 0.19]); }
    inst(new THREE.BoxGeometry(0.02, 1, 0.02), matWood, legSpots, ([x, z, h], p, e, sc) => { p.set(x, h / 2, z); sc.set(1, h, 1); }, { recv: true });
    const bookSpots = standSpots.filter(it => it[2] >= 0), bookCol = bookMats.map(m => m.color.clone());
    inst(new THREE.BoxGeometry(0.15, 0.012, 0.2), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.75 }), bookSpots,
         ([x, z], p, e) => { p.set(x, 0.185, z - 0.015); e.set(0.6, 0, 0); }, { col: (it) => bookCol[it[2]] });
    // their open pages (v19.2 — the stand books were closed red slabs)
    inst(new THREE.BoxGeometry(0.13, 0.004, 0.17), matPage, bookSpots,
         ([x, z], p, e) => { p.set(x, 0.185 + 0.008 * Math.cos(0.6), z - 0.015 + 0.008 * Math.sin(0.6)); e.set(0.6, 0, 0); });
    // his book, on his stand once he kneels
    // (v19.2: at HIS stand — myStand sits at the world's origin, so (0, 0.185, −0.015) put the book on the floor by the doors)
    const myBook = box(0.15, 0.012, 0.2, PLACE.x, 0.185, PLACE.z - 0.52 - 0.015, bookMats[0], myStand, false);
    myBook.rotation.x = 0.6; myBook.visible = false;
    box(0.13, 0.004, 0.17, 0, 0.008, 0, matPage, myBook, false);
    myStand.position.set(0, 0, 0);
    // the book in his hand while he walks (on the lens, like chapter 1's tray)
    const handBook = new THREE.Group(); camera.add(handBook); handBook.position.set(-0.16, -0.2, -0.38); handBook.rotation.set(-0.9, -0.25, -0.1);   // v18.5: the LEFT side — at +0.17 the right hand (drawn after the world) painted over it
    /* v19.2: drawn OVER the world, as the hands are (its own materials) — at
       0.38 m it sank into the shelf's sign the moment he took it, and into
       any column he walked up to (collision keeps the eye 0.14–0.20 m off) */
    const hbM = [bookMats[0].clone(), new THREE.MeshStandardMaterial({ color: 0xf1e8d4, roughness: 0.9 })];
    for (const m of hbM) { m.depthTest = false; m.depthWrite = false; }
    box(0.1, 0.014, 0.14, 0, 0, 0, hbM[0], handBook, false).renderOrder = 10;
    box(0.098, 0.012, 0.135, 0, 0.008, 0, hbM[1], handBook, false).renderOrder = 11;
    handBook.visible = false;

    // the glowing place to kneel (chapter 1's zone, in gold)
    const zone = mkZone(PLACE.x, PLACE.z);   // v19.2: on the point the kneel tests (it was drawn 5 cm off it)

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
    /* v19.2: OUTSIDE is dusk — the hall's warm key light lit the paving beige
       as if in sun under a navy sky; the steps, the base and the yard take
       darker, cooler copies of their colours (the hall keeps its own) */
    const matCreamOut = matCream.clone(); matCreamOut.color.setHex(0x8f8a92); owned.push({ dispose: () => matCreamOut.dispose() });
    for (let i = 0; i < 6; i++) { const top = -0.2 - i * 0.2; box(5.0, top + 1.4, 0.36, 0, (top - 1.4) / 2, HALL.z1 + 4.6 + i * 0.36, matCreamOut, outside);
      box(5.0, 0.03, 0.05, 0, top + 0.012, HALL.z1 + 4.6 + i * 0.36 + 0.155, matGold, outside, false); }   // v19.2: a gilt nosing, so the flight reads as steps, not cream stripes
    box(HALL.x1 - HALL.x0 + 3, 1.2, HALL.z1 - HALL.z0 + 4.3, 0, -0.8, (HALL.z0 + HALL.z1 + 4.4) / 2, matCreamOut, outside, false);   // the base
    box(HALL.x1 - HALL.x0 + 3.3, 0.08, 0.1, 0, -0.04, HALL.z1 + 4.47, matGold, outside, false);                                        // its gold lip
    // the facade's face: the door framed and crowned in gold OUTSIDE too, two
    // tall shuttered windows with their crowns, and a red-and-gold dado (the
    // first photographs of the doors at dusk showed a blank cream wall)
    { const zf = HALL.z1 + T + 0.03;
      for (const s2 of [-1, 1]) box(0.16, DOOR.h + 0.16, 0.08, s2 * (DOOR.hw + 0.08), DOOR.h / 2, zf, matGold, outside, false);
      box(DOOR.hw * 2 + 0.48, 0.18, 0.08, 0, DOOR.h + 0.09, zf, matGold, outside, false);
      const oc = new THREE.Mesh(new THREE.ShapeGeometry(crownShape(THREE, DOOR.hw * 2 + 0.8, 1.6)), matGold);
      oc.position.set(0, DOOR.h + 0.18, zf + 0.01); outside.add(oc);
      for (const s2 of [-1, 1]) {
        const wx = s2 * 2.35;
        box(0.86, 1.9, 0.05, wx, 1.95, zf, matCol, outside, false);                                   // the shutter, lacquer
        box(0.64, 1.6, 0.02, wx, 1.95, zf + 0.03, matGold, outside, false);                           // its gilt panel
        for (const s3 of [-1, 1]) box(0.09, 2.06, 0.07, wx + s3 * 0.47, 1.95, zf + 0.01, matGold, outside, false);
        box(1.04, 0.1, 0.07, wx, 0.92, zf + 0.01, matGold, outside, false);
        const wc = new THREE.Mesh(new THREE.ShapeGeometry(crownShape(THREE, 1.2, 0.95)), matGold);
        wc.position.set(wx, 2.96, zf + 0.01); outside.add(wc);
      }
      /* v19.2: the dado stops at the door's jambs — one 13.9 m board ran
         straight across the open doorway, a knee-high red wall the film's
         walkers waded through and the camera looked over */
      { const xo = (HALL.x1 - HALL.x0 + 0.9) / 2, xi = DOOR.hw + 0.16, dw = xo - xi;
        for (const s2 of [-1, 1]) {
          box(dw, 0.5, 0.04, s2 * (xi + dw / 2), 0.25, zf, matRedD, outside, false);
          box(dw, 0.05, 0.05, s2 * (xi + dw / 2), 0.52, zf + 0.005, matGold, outside, false);
        } } }
    const lampHaloM = new THREE.SpriteMaterial({ map: tex(makeGlow(THREE, cnv, '255,214,150')), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.85 });
    const lampPoolM = new THREE.MeshBasicMaterial({ map: tex(makeGlow(THREE, cnv, '255,190,120')), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.32 });
    const yard = new THREE.Mesh(new THREE.PlaneGeometry(70, 80), new THREE.MeshStandardMaterial({ map: tex(makeSlabs(THREE, cnv)), roughness: 0.9, color: 0x6c6878 }));
    yard.material.map.repeat.set(19, 22);
    yard.rotation.x = -Math.PI / 2; yard.position.set(0, -1.4, HALL.z1 + 8); yard.receiveShadow = true; outside.add(yard);
    for (const s of [-1, 1]) {
      // porch columns, white with gold capitals, and the gables over the porch
      for (const x of [3.2, 6.6]) { box(0.5, 4.8, 0.5, s * x, 2.4, HALL.z1 + 4.0, matWhite, outside); cyl(0.32, 0.45, 0.4, s * x, 4.9, HALL.z1 + 4.0, matGold, 8, outside); }
      const lamp = new THREE.Group(); lamp.position.set(s * 1.35, -1.4, HALL.z1 + 8.5); outside.add(lamp);   // v19.2: flanking the foot of the steps, inside a phone's frame from the head of the flight (±1.6 cut the globes at the edge)
      cyl(0.05, 0.07, 3.2, 0, 1.6, 0, matDark, 6, lamp);
      const glow = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 10), matBulb); glow.position.y = 3.3; lamp.add(glow);
      /* v19.2: a halo round the globe and its light painted on the paving —
         a flat white ball lit nothing (no PointLight: that changes the light
         count and builds shaders on screen, v15.1) */
      const halo = new THREE.Sprite(lampHaloM); halo.scale.set(1.2, 1.2, 1); halo.position.y = 3.3; lamp.add(halo);
      const pool = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 4.2), lampPoolM); pool.rotation.x = -Math.PI / 2; pool.position.y = 0.012; lamp.add(pool);
      lamp.traverse(o => { o.castShadow = false; });   // (its globe threw two head-shaped shadows on the facade)
    }
    // the roof: two tiers of orange tile over the facade, a gable of red and gold
    function gable(z, w, h, y0, mat, tile) {
      const g = new THREE.Group(); g.position.set(0, y0, z); outside.add(g);
      mat.side = THREE.DoubleSide;   // v18.5: scene B looks up at the porch gable from BEHIND
      const tg = new THREE.ShapeGeometry(triShape(THREE, w, h)), tu = tg.attributes.uv, tp = tg.attributes.position;
      for (let i = 0; i < tu.count; i++) tu.setXY(i, tp.getX(i) / w + 0.5, tp.getY(i) / h);   // v19.2: 0..1 over the triangle
      const tri = new THREE.Mesh(tg, mat); tri.position.z = 0.02; g.add(tri);
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
    gable(HALL.z1 + 4.25, 15.0, 3.8, 5.0, new THREE.MeshStandardMaterial({ map: tex(makeGableCarve(THREE, cnv, 15.0, 3.8)), roughness: 0.5, metalness: 0.2 }), matTile);
    gable(HALL.z1 + 1.0, 13.6, 4.6, H + 0.6, new THREE.MeshStandardMaterial({ map: tex(makeGableCarve(THREE, cnv, 13.6, 4.6)), roughness: 0.5, metalness: 0.2 }), matTile);
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
      /* v18.5: the geometry WITH its node's own transform baked in, as
         chapter 1 does (plantSlippers) — the raw quantized geometry is ±1, so
         every slipper here was drawn 2 m long, a band of giant straps across
         the porch reaching into the doorway */
      const one = gltf.scene.getObjectByName('one') || gltf.scene;
      let mesh = null; one.traverse(o => { if (o.isMesh && !mesh) mesh = o; });
      if (!mesh) return;
      mesh.updateWorldMatrix(true, false);
      const left = mesh.geometry.clone(); left.applyMatrix4(mesh.matrixWorld); left.computeVertexNormals();
      const right = left.clone(); right.scale(-1, 1, 1);
      if (right.index) { const ix = right.index.array; for (let i = 0; i < ix.length; i += 3) { const t = ix[i + 1]; ix[i + 1] = ix[i + 2]; ix[i + 2] = t; } right.index.needsUpdate = true; }
      right.computeVertexNormals();
      const smat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.62 });
      const N = 26, ims = [new THREE.InstancedMesh(left, smat, N), new THREE.InstancedMesh(right, smat, N)];
      const d = new THREE.Object3D(), col = new THREE.Color();
      for (let i = 0; i < N; i++) {
        const row = i % 2;
        let x = -4.6 + Math.floor(i / 2) * 0.72 + (hash(i, 4) - 0.5) * 0.2;
        if (Math.abs(x) < 0.95) x = x < 0 ? -5.32 : 4.76;   // v19.2: to the rows' ends — the doorway's path stays clear (pairs lay across it, and the walk out went through them)
        const z = HALL.z1 + 0.6 + row * 0.55 + (hash(i, 5) - 0.5) * 0.15;
        const ry = (hash(i, 6) - 0.5) * 0.9 + (row ? Math.PI : 0);
        [-1, 1].forEach((side, j) => {
          const off = side * 0.056;
          d.position.set(x + off * Math.cos(ry), 0.002, z - off * Math.sin(ry)); d.rotation.set(0, ry + side * 0.05, 0); d.updateMatrix();
          ims[j].setMatrixAt(i, d.matrix); ims[j].setColorAt(i, col.setHex(slipCols[i % slipCols.length]));
        });
      }
      for (const im of ims) {
        im.instanceMatrix.needsUpdate = true; if (im.instanceColor) im.instanceColor.needsUpdate = true;
        im.computeBoundingSphere(); im.castShadow = false; outside.add(im);
      }
    }).catch(err => { console.warn('slipper failed to load', err); ctx.loadFail && ctx.loadFail('slipper', err); });
    // trees beyond the courtyard (the kit, v6.15), seen through the windows and in the film
    /* v19.2: the compound's low white wall with its gold coping, and a gate on
       the axis — the yard ran to the horizon like the edge of a level */
    { const wy = -1.4, wh = 1.3, zw = HALL.z1 + 25, xw = 16;
      for (const [w, d, x, z] of [[xw - 1.5, 0.3, -(xw + 1.5) / 2, zw], [xw - 1.5, 0.3, (xw + 1.5) / 2, zw],
                                  [0.3, zw - HALL.z1 - 4, -xw, (zw + HALL.z1 + 4) / 2], [0.3, zw - HALL.z1 - 4, xw, (zw + HALL.z1 + 4) / 2]]) {
        box(w, wh, d, x, wy + wh / 2, z, matWhite, outside, false);
        box(w + (d > 1 ? 0.1 : 0.12), 0.08, d + (d > 1 ? 0.12 : 0.1), x, wy + wh + 0.04, z, matGold, outside, false);
      }
      for (const sx of [-1, 1]) { box(0.6, 3.4, 0.6, sx * 1.8, wy + 1.7, zw, matWhite, outside, false); cyl(0.36, 0.48, 0.5, sx * 1.8, wy + 3.65, zw, matGold, 8, outside); }
      box(4.4, 0.3, 1.0, 0, wy + 3.55, zw, matRed, outside, false);
      box(4.6, 0.06, 1.1, 0, wy + 3.73, zw, matGold, outside, false); }
    const treeSpots = [];
    for (let i = 0; i < 18; i++) {
      const side = i % 2 ? 1 : -1, a = hash(i, 9);
      treeSpots.push({ x: side * (11 + a * 9), z: -24 + i * 2.6 + hash(i, 10) * 2, h: 7 + hash(i, 11) * 5 });
    }
    for (let i = 0; i < 6; i++) treeSpots.push({ x: -14 + i * 5.6, z: HALL.z1 + 17 + hash(i, 12) * 5, h: 8 + hash(i, 13) * 4 });
    let treeStand = null;
    if (plantTrees) treeStand = plantTrees(outside, treeSpots.map(p => ({ x: p.x, y: -1.4, z: p.z, h: p.h })), { seed: 22, tint: 0x4c5270, lowKeep: 0.6 });   // (v19.2: darker — they stood olive in full light at dusk)

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
      lay_scold:    { h: 1.55, take: 'Sit_Cross_Legged_on_Floor' },   // v19.2: dressed white like everyone (her sarong is told from her skin by WHERE it is on her body now, not by colour)
      lay_sitwoman: { h: 1.60, take: 'Sit_Cross_Legged_on_Floor' },
      lay_sitwomanhd: { h: 1.60, take: 'Sit_Cross_Legged_on_Floor' },
      // v19.2: the three nearest him at full detail too (the crowd cuts are 6.8k-10k triangles, faceted at 1.2 m)
      lay_adminteehd: { h: 1.70, take: 'Sit_Cross_Legged_on_Floor' },
      lay_grannyhd:   { h: 1.52, take: 'Sit_Cross_Legged_on_Floor' },
      lay_botakhd:    { h: 1.68, take: 'Sit_Cross_Legged_on_Floor' },
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
        if (L < 42 && !(L > 14 && hue >= 48 && hue <= 110 && sat > 0.28)) raw[n] = 2;   // v18.5: not the olive of a shirt in the scan's own shadow
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
    const whiteGeos = new Map();
    /* v19.2: each bone's BODY REGION (1 head and neck, 2 hands, 3 legs, 0 the
       rest), kept on the geometry so coverLabels can decide an island by where
       on the body it is — the colour test alone has failed three photographic
       passes (white specks in hair, a white patch across an eye, white
       fingertips, saw-toothed collars) */
    function boneRegions(mesh) {
      const geo = mesh && mesh.geometry;
      if (!geo || geo.userData.boneCls || !mesh.skeleton) return;
      geo.userData.boneCls = Uint8Array.from(mesh.skeleton.bones, (b) => {
        const n = b.name;
        if (/head|neck|jaw|eye/i.test(n)) return 1;
        if (/hand|finger|thumb|index|middle|ring|pinky/i.test(n) && !/forearm/i.test(n)) return 2;
        if (/leg|thigh|knee|calf|shin/i.test(n) && !/foot|toe/i.test(n)) return 3;
        return 0;
      });
    }
    function whiteOf(m, geo, mesh) {
      if (mesh) boneRegions(mesh);
      if (geo && geo.isBufferGeometry) { const gs = whiteGeos.get(m) || []; if (!gs.includes(geo)) gs.push(geo); whiteGeos.set(m, gs); }
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
          /* v18.5: WHITE SPECKS IN EVERY HEAD OF HAIR. The scan baked
             olive flecks into its hair (and its padding follows each island
             in the island's own colours), and an olive fleck is "not skin,
             not dark", so it went white with the shirt: specks along every
             hairline, plain at the distance he kneels from the next row.
             The decision is made per UV island now (coverLabels). */
          const lab = coverLabels(cls, W, Hh, whiteGeos.get(m));
          for (let i = 0, n = 0; i < p.length; i += 4, n++) {
            if (lab[n]) continue;                         // skin, and the dark of hair and trousers, stay
            const L = 0.30 * p[i] + 0.59 * p[i + 1] + 0.11 * p[i + 2];
            const v = Math.min(255, 188 + L * 0.30);   // v19.2: darks lifted (172 + 0.4L left black shorts a grey 180 under the dusk light — not white)
            p[i] = v; p[i + 1] = v * 0.988; p[i + 2] = v * 0.955;
          }
          x.putImageData(d, 0, 0);
          const t = new THREE.CanvasTexture(cv);
          t.colorSpace = m.map.colorSpace; t.flipY = m.map.flipY; t.wrapS = m.map.wrapS; t.wrapT = m.map.wrapT;
          t.anisotropy = 4; madeTex.push(t); c.map = t; c.needsUpdate = true;
        } catch (err) { console.warn('white recolour failed', err); }
      };
      setTimeout(() => paint(0), 0);   // after the whole model has registered its meshes
      return c;
    }
    /* each texel's class, decided per UV ISLAND and spread into the padding.
       An island is a connected run of triangles in UV space (vertices are
       split at UV seams, so the index graph's components are the islands).
       In an island that is mostly hair or trousers or skin — under a fifth
       shirt-coloured — a shirt-coloured texel with hair (and skin) all round
       it is a fleck the scan baked into the hair, and keeps its own colour;
       everything else shirt-coloured goes white.
       Every texel no triangle covers takes the class of the nearest one that
       is covered (a breadth-first fill), so padding follows its island.
       With no UVs, the classes as they were. */
    function coverLabels(cls, W, Hh, geos) {
      if (!geos || !geos.length) return cls;
      const N = W * Hh, isl = new Int32Array(N).fill(-1);
      const cloth = [], tot = [], trg = new Uint8Array(N);   // trg: each texel's TRIANGLE region (v19.2, below)
      let base = 0;
      for (const geo of geos) {
        const uv = geo.attributes.uv; if (!uv) continue;
        const idx = geo.index, nV = uv.count, nT = (idx ? idx.count : nV) / 3;
        const par = new Int32Array(nV); for (let i = 0; i < nV; i++) par[i] = i;
        const find = (i) => { while (par[i] !== i) { par[i] = par[par[i]]; i = par[i]; } return i; };
        const vi = (t, k) => idx ? idx.getX(t * 3 + k) : t * 3 + k;
        for (let t = 0; t < nT; t++) { const a0 = find(vi(t, 0)), a1 = find(vi(t, 1)), a2 = find(vi(t, 2)); par[a1] = a0; par[find(a2)] = a0; }
        const ids = new Map();
        const sI = geo.attributes.skinIndex, sW = geo.attributes.skinWeight, bc = geo.userData.boneCls;
        for (let t = 0; t < nT; t++) {
          const a = vi(t, 0), b = vi(t, 1), c2 = vi(t, 2), r = find(a);
          if (!ids.has(r)) { ids.set(r, base + ids.size); cloth.push(0); tot.push(0); }
          const id = ids.get(r), tw = [0, 0, 0, 0];   // [all, head, hand, leg] skin weight on this triangle
          if (sI && sW && bc) for (const v of [a, b, c2]) for (let k = 0; k < 4; k++) {
            const w = sW.getComponent(v, k); if (!w) continue;
            const cl = bc[sI.getComponent(v, k)] || 0; tw[0] += w; if (cl) tw[cl] += w;
          }
          let rg = !tw[0] ? 0 : tw[1] + tw[2] > tw[0] * 0.5 ? 1 : tw[3] > tw[0] * 0.5 ? 2 : 3;
          const ax = uv.getX(a) * W, ay = uv.getY(a) * Hh, bx = uv.getX(b) * W, by = uv.getY(b) * Hh, cx = uv.getX(c2) * W, cy = uv.getY(c2) * Hh;
          const x0 = Math.max(0, Math.floor(Math.min(ax, bx, cx))), x1 = Math.min(W - 1, Math.ceil(Math.max(ax, bx, cx)));
          const y0 = Math.max(0, Math.floor(Math.min(ay, by, cy))), y1 = Math.min(Hh - 1, Math.ceil(Math.max(ay, by, cy)));
          for (const [vx, vy] of [[ax, ay], [bx, by], [cx, cy]]) {
            const qx = Math.min(W - 1, Math.max(0, vx | 0)), qy = Math.min(Hh - 1, Math.max(0, vy | 0)); isl[qy * W + qx] = id; trg[qy * W + qx] = rg;
          }
          const den = (by - cy) * (ax - cx) + (cx - bx) * (ay - cy);
          if (Math.abs(den) < 1e-9) continue;
          /* v19.2: a SLIVER — a hair-thin triangle whose UVs run hundreds of
             texels across the sheet (the scans' exports carry them at seams).
             Painted by its own region it drew white lines straight across the
             man in front's face and specks through his hair; it covers no
             surface anyone sees, so it decides nothing */
          const Lm = Math.max(Math.hypot(bx - ax, by - ay), Math.hypot(cx - bx, cy - by), Math.hypot(ax - cx, ay - cy));
          if (Lm > W * 0.04 && Math.abs(den) < Lm * Lm * 0.06) continue;
          const inside = (x, y) => { const px = x + 0.5, py = y + 0.5;
            const l1 = ((by - cy) * (px - cx) + (cx - bx) * (py - cy)) / den, l2 = ((cy - ay) * (px - cx) + (ax - cx) * (py - cy)) / den;
            return l1 >= -0.02 && l2 >= -0.02 && 1 - l1 - l2 >= -0.02; };
          if (rg === 3) {                     // a garment triangle is decided on its own texels
            let nt = 0, ns = 0, nd = 0;
            for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) if (inside(x, y)) { nt++; const c = cls[y * W + x]; if (c === 1) ns++; else if (c === 2) nd++; }
            if (nt) rg = ns >= nt * 0.45 ? 3 : nd >= nt * 0.6 && tw[1] > tw[0] * 0.02 ? 5 : 4;
          }
          for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) if (inside(x, y)) { isl[y * W + x] = id; trg[y * W + x] = rg; }
        }
        base += ids.size;
      }
      if (!base) return cls;
      for (let n = 0; n < N; n++) { const id = isl[n]; if (id < 0) continue; tot[id]++; if (!cls[n]) cloth[id]++; }
      const W1 = W + 1, I1 = new Int32Array(W1 * (Hh + 1)), I2 = new Int32Array(W1 * (Hh + 1));
      for (let y = 0; y < Hh; y++) { let r1 = 0, r2 = 0; for (let x = 0; x < W; x++) { const c = cls[y * W + x]; r1 += c === 1 ? 1 : 0; r2 += c === 2 ? 1 : 0;
        I1[(y + 1) * W1 + x + 1] = I1[y * W1 + x + 1] + r1; I2[(y + 1) * W1 + x + 1] = I2[y * W1 + x + 1] + r2; } }
      const R = Math.max(2, Math.round(W / 170));
      const fleck = (n) => {          // a shirt-coloured texel with hair (and skin) all round it
        const x = n % W, y = (n / W) | 0, x0 = Math.max(0, x - R), y0 = Math.max(0, y - R), x1 = Math.min(W, x + R + 1), y1 = Math.min(Hh, y + R + 1);
        const A = (x1 - x0) * (y1 - y0), bx = (I) => I[y1 * W1 + x1] - I[y0 * W1 + x1] - I[y1 * W1 + x0] + I[y0 * W1 + x0];
        const dk = bx(I2), sk = bx(I1);
        return dk >= A * 0.3 && dk + sk >= A * 0.7;
      };
      const lab = new Uint8Array(N), seen = new Uint8Array(N), q = new Int32Array(N);
      let qh = 0, qt = 0;
      /* v19.2: decided by where on the body each TRIANGLE is, from its skin
         weights — an island was too coarse, because the Meshy scans pack a
         face, a neck and half a blouse into one island (Yai's printed blouse
         stayed grey, the island being mostly head). 1 HEAD, NECK and HANDS
         keep every texel (hair, faces, ears, nails — never cloth). 2 LEGS go
         white whole, knees and shins too (white trousers and sarongs to the
         ankle, as an evening chant is dressed; the feet are their own bones).
         The rest is GARMENT, decided on the triangle's own texels: 3 mostly
         skin (a bare arm, a neckline) keeps its skin and its shadows; 5 mostly
         dark with any head weight (hair down the back) keeps the dark; 4
         anything else goes white whole, the print's skin-hued flecks with it.
         0 no weights: the colour test by island, as before. */
      for (let n = 0; n < N; n++) {
        const id = isl[n]; if (id < 0) continue;
        const rg = trg[n], c = cls[n];
        lab[n] = rg === 1 ? 1 : rg === 2 || rg === 4 ? 0 : rg === 3 ? c : rg === 5 ? (c === 2 ? 2 : 0)
               : cloth[id] > tot[id] * 0.8 ? (c === 1 ? 1 : 0) : c || (cloth[id] < tot[id] * 0.2 && fleck(n) ? 2 : 0);
        seen[n] = 1; q[qt++] = n;
      }
      while (qh < qt) {
        const n = q[qh++], x = n % W, y = (n / W) | 0, l = lab[n];
        if (x > 0 && !seen[n - 1]) { seen[n - 1] = 1; lab[n - 1] = l; q[qt++] = n - 1; }
        if (x < W - 1 && !seen[n + 1]) { seen[n + 1] = 1; lab[n + 1] = l; q[qt++] = n + 1; }
        if (y > 0 && !seen[n - W]) { seen[n - W] = 1; lab[n - W] = l; q[qt++] = n - W; }
        if (y < Hh - 1 && !seen[n + W]) { seen[n + W] = 1; lab[n + W] = l; q[qt++] = n + W; }
      }
      return lab;
    }
    /* a monk's robe: saffron on a copy of the monk's own sheet is already
       his; the crowd monk keeps its own colours */
    const _v = new THREE.Vector3(), _v2 = new THREE.Vector3(), _v3 = new THREE.Vector3(), _q = new THREE.Quaternion(), _q2 = new THREE.Quaternion();
    const boneOf = (r, re) => r.bones.find(b => re.test(b.name)) || null;
    const sitShadowG = new THREE.PlaneGeometry(0.95, 0.85);
    const sitShadowM = new THREE.MeshBasicMaterial({ map: tex(makeContactShadow(THREE, cnv)), color: 0x000000, transparent: true, opacity: 0.62, depthWrite: false });
    function mkSitter(key, x, z, ry, o = {}) {
      const group = new THREE.Group(); group.position.set(x, o.y || 0, z); group.rotation.y = ry; (o.parent || world).add(group);
      const H0 = (o.h || KIND[key].h) * 0.55;
      const proxy = new THREE.Mesh(new THREE.CapsuleGeometry(0.2, Math.max(0.1, H0 - 0.4), 4, 8), matProxy);
      proxy.position.y = H0 / 2 + 0.1; proxy.castShadow = !LOW; group.add(proxy);
      /* v19.2: a CONTACT SHADOW painted under every sitter, on a phone as on a
         desktop — LOW casts no shadows at all, so nobody touched the floor
         (the v9.3 law: a body that measures right still floats without the
         dark where it meets the ground). One shared plane and texture. */
      if (o.shadow !== false) { const cs = new THREE.Mesh(sitShadowG, sitShadowM); const k = (o.h || KIND[key].h) / 1.6;
        cs.scale.set(k, k, 1); cs.rotation.x = -Math.PI / 2; cs.position.set(0, 0.011, 0.04); cs.renderOrder = 1; group.add(cs); }
      const r = { key, group, proxy, model: null, bones: [], head: null, headRest: null, spine: [], lookYaw: 0, lookPitch: 0,
                  lookW: 0, lookTo: 0, bow: 0, bowRest: null, ready: false, x, z, ry };
      parseOnce(key).then((gltf) => {
        if (!alive) return;
        const g = cloneSkinned(gltf.scene);
        g.traverse(o2 => {
          if (o2.isBone) r.bones.push(o2);
          if (!o2.isMesh) return;
          o2.castShadow = !LOW && !!o.cast; o2.receiveShadow = false;
          if (o.white !== false && !(KIND[key] && KIND[key].own)) o2.material = Array.isArray(o2.material) ? o2.material.map(mm => whiteOf(mm, o2.geometry, o2)) : whiteOf(o2.material, o2.geometry, o2);
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
        /* grounded on the posed skin (what is actually on the floor) —
           v19.2: on the SEAT. The lowest point of the retargeted floor take is
           the crossed ankles, and grounding those left every seat 3–7 cm over
           the mat; the seat (the skin the hips carry) now rests a few mm into
           the mat, the ankles at most 4.5 cm under it */
        let sl = Infinity, seat = Infinity;
        g.traverse(o2 => {
          if (!o2.isSkinnedMesh) return;
          o2.skeleton.update();
          const hb = o2.skeleton.bones.map(b => /hips|pelvis/i.test(b.name));
          const sI = o2.geometry.attributes.skinIndex, sW = o2.geometry.attributes.skinWeight;
          const n = o2.geometry.attributes.position.count;
          for (let i = 0; i < n; i += 7) {
            o2.getVertexPosition(i, _v); _v.applyMatrix4(o2.matrixWorld); if (_v.y < sl) sl = _v.y;
            if (sI && sW) { let w = 0; for (let k = 0; k < 4; k++) if (hb[sI.getComponent(i, k)]) w += sW.getComponent(i, k); if (w > 0.5 && _v.y < seat) seat = _v.y; }
          }
        });
        if (isFinite(sl)) {
          const fl = group.position.y;
          g.position.y += isFinite(seat) ? Math.max(fl - 0.004 - seat, fl - 0.045 - sl) : fl + 0.012 - sl;
        }
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
          // v19.2: the neck takes part of every look
          if (r.head.parent && r.head.parent.isBone && /neck/i.test(r.head.parent.name)) { r.neck = r.head.parent; r.neckRest = r.neck.quaternion.clone(); }
        }
        /* v19.2: the spine by HIERARCHY, lowest first — by name the Meshy rigs
           (Hips > Spine02 > Spine01 > Spine) gave their CHEST the bow's big
           share, so the women folded at the neck while the men bowed from the
           waist */
        { const hips = r.bones.find(b => b.children.some(ch => ch.isBone && /spine/i.test(ch.name)));
          const s0 = hips && hips.children.find(ch => ch.isBone && /spine/i.test(ch.name));
          const s1 = s0 && s0.children.find(ch => ch.isBone && /spine/i.test(ch.name));
          r.spine = s0 ? [s0, s1].filter(Boolean) : [boneOf(r, /Spine(_\d+)?$/), boneOf(r, /Spine1(_\d+)?$|Spine01(_\d+)?$/)].filter(Boolean); }
        if (o.pray !== false) prayArms(r);
        r.bowRest = r.spine.map(b => ({ b, q: b.quaternion.clone() }));
        /* v18.5: THE CULLING SPHERE, IN THE MESH'S OWN SPACE. The one set above
           is 1.3 m only where a mesh's world scale is 1 — the Meshy women's
           mesh hangs under an Armature at 0.01, so theirs was 1.3 CENTIMETRES,
           and grounding then put it under the floor: thirteen of the
           twenty-three sitters (the woman beside him and Yai among them) were
           culled whenever that point left the frame. Now a 1.3 m sphere round
           the body, wherever and at whatever scale the mesh is. */
        g.updateMatrixWorld(true);
        const wc = group.getWorldPosition(new THREE.Vector3()).add(new THREE.Vector3(0, 0.6, 0));
        g.traverse(o2 => {
          if (!o2.isSkinnedMesh) return;
          const inv = o2.matrixWorld.clone().invert(), ws = o2.getWorldScale(new THREE.Vector3());
          const sp = new THREE.Sphere(wc.clone().applyMatrix4(inv), 1.3 / Math.max(1e-6, Math.min(ws.x, ws.y, ws.z)));
          o2.boundingSphere = sp; if (o2.geometry) o2.geometry.boundingSphere = sp.clone();
        });
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
      /* v19.2: a rig whose hands carry no finger bone (the Meshy women —
         the woman beside him, Yai, every granny) RESTS ITS HANDS ON ITS
         THIGHS instead of praying: the hand could only be aimed along the
         forearm, and the take's bent wrist crossed one hand 6.5 cm through
         the other at 37° — the women nearest the lens looked broken. Apart,
         nothing can cross, and a resting hand IS aimed along its forearm.
         (Left in the take's own pose they held their arms out like wings.) */
      const hbL = boneOf(r, /LeftHand(_\d+)?$/), lap = !!(hbL && !hbL.children.some(ch => ch.isBone));
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
        const T0 = lap ? _v3.clone().addScaledVector(fwd, 0.16 + a * 0.45).addScaledVector(up, -0.40).addScaledVector(side, sd * 0.15)
                       : _v3.clone().addScaledVector(fwd, 0.10 + a * 0.55).addScaledVector(up, -0.09).addScaledVector(side, sd * 0.035);
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
        aimBone(hand, hdir, lap ? fwd.clone().multiplyScalar(0.85).addScaledVector(up, -0.5).normalize()
                                : up.clone().multiplyScalar(0.92).addScaledVector(fwd, 0.25).addScaledVector(side, -sd * 0.12).normalize());
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
    /* v19.2: THE LOOK IN WORLD SPACE. The head turned about its own bone's
       local axis, which on the Meshy rigs leans 18–22° off the head's up and
       further by the nod — so a woman turning to him cocked her head 32°
       onto her shoulder and tipped her chin up; the shoulders' 35% came on
       top of the head's full turn, so every look overshot him; and the row
       IN FRONT, clamped at 72°, stared at the side wall. Now the bearing is
       SHARED (shoulders 30%, the waist too for someone behind him, the head
       the rest), the head turns about world up and tips to his eye, and a man
       directly in front keeps to the side he started turning to. */
    const _up = new THREE.Vector3(0, 1, 0), _lookD = new THREE.Vector3(), _pAx = new THREE.Vector3(), _q3 = new THREE.Quaternion();
    function spineTurn(r, b, ang) {
      const sp = r.bowRest && r.bowRest.find(p => p.b === b); if (!sp) return;
      const pq = b.parent.getWorldQuaternion(_q2);
      const loc = _pAx.copy(_up).applyQuaternion(pq.invert());
      b.quaternion.copy(sp.q).premultiply(_q.setFromAxisAngle(loc, ang));
    }
    function headTick(r, wdt) {
      if (!r.head || !r.headRest) return;
      r.lookW += (r.lookTo - r.lookW) * (1 - Math.exp(-wdt * 3.2));
      if (r.lookW < 0.002 && r.lookTo === 0) { r.head.quaternion.copy(r.headRest); if (r.neck && r.neckRest) r.neck.quaternion.copy(r.neckRest); r.lookSide = 0; return; }
      const w = r.lookW;
      const dx = yaw.position.x - r.x, dz = yaw.position.z - r.z;
      let a = Math.atan2(dx, dz) - r.ry; while (a > Math.PI) a -= 2 * Math.PI; while (a < -Math.PI) a += 2 * Math.PI;
      if (r.lookSide && Math.abs(a) > 2.4 && Math.sign(a) !== r.lookSide) a += r.lookSide * 2 * Math.PI;   // (no flip across his back)
      r.lookSide = Math.sign(a) || 1;
      const sh = THREE.MathUtils.clamp(a * 0.3, -0.45, 0.45);
      const waist = Math.abs(a) > 1.75 ? Math.sign(a) * Math.min(0.45, Math.abs(a) - 1.55) : 0;
      // the rest shared between the NECK and the head (on the head bone alone a 66° turn stretched the neck into a twisted tube)
      const rem = a - sh - waist, nk = r.neck ? THREE.MathUtils.clamp(rem * 0.45, -0.5, 0.5) : 0;
      const hd = THREE.MathUtils.clamp(rem - nk, -0.85, 0.85);
      if (r.neck && r.neckRest) {
        r.neck.parent.updateWorldMatrix(true, false);
        const npq = r.neck.parent.getWorldQuaternion(_q2);
        r.neck.quaternion.copy(r.neckRest).premultiply(_q.setFromAxisAngle(_pAx.copy(_up).applyQuaternion(npq.invert()), nk * w));
      }
      if (r.bow < 0.01) {
        if (r.spine[0]) spineTurn(r, r.spine[0], waist * w);
        if (r.spine[1]) spineTurn(r, r.spine[1], sh * w);
        r.spineFresh = true;
      }
      // the head: from its rest, about world up, then tipped toward his eye
      r.head.parent.updateWorldMatrix(true, false);
      const pq = r.head.parent.getWorldQuaternion(_q3);
      _q2.copy(pq).multiply(r.headRest);                                  // the rest, in the world
      _q2.premultiply(_q.setFromAxisAngle(_up, hd * w));
      const th = r.ry + (sh + waist + nk + hd) * w;
      _lookD.set(Math.sin(th), 0, Math.cos(th));
      r.head.getWorldPosition(_v); camera.getWorldPosition(_v2);
      const tip = THREE.MathUtils.clamp(Math.atan2(_v2.y - _v.y, Math.hypot(_v2.x - _v.x, _v2.z - _v.z)), -0.35, 0.3);
      _pAx.crossVectors(_lookD, _up).normalize();
      _q2.premultiply(_q.setFromAxisAngle(_pAx, tip * w));
      r.head.quaternion.copy(pq.invert()).multiply(_q2);
    }
    /* the krap: a bow from the waist, hands still together at the chest */
    const _ax = new THREE.Vector3();
    function bowTick(r) {
      if (!r.bowRest || !r.bowRest.length) return;
      if (r.bow < 0.001 && !r.bowWas) return;
      r.bowWas = r.bow > 0.001;
      const side = _ax.set(Math.cos(r.ry), 0, -Math.sin(r.ry));   // the rig's right, in the world
      r.spineFresh = true;
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
    /* a phone keeps the rows near him — v19.2: the rows IN FRONT of him
       (0–2), which his kneeling view sees; v18's 1–3 kept the row behind him
       and left the front row's mats and stands empty in the middle of his
       frame for the whole chant, fight and peak */
    const keep = (r, c) => !LOW || r <= 2;      // (v19.2: every column — c ≤ 3 left the right of the aisle one man per row)
    for (let r = 0; r < ROWZ.length; r++) for (let c = 0; c < ROWX.length; c++) {
      const x = ROWX[c], z = ROWZ[r];
      if (x === PLACE.x && z === PLACE.z) continue;
      const jx = (hash(r, c + 11) - 0.5) * 0.08, jz = (hash(r, c + 13) - 0.5) * 0.08, ry = Math.PI + (hash(r, c + 17) - 0.5) * 0.14;
      let p = null;
      // v19.2: the woman beside him at FULL detail — the peak and ending A frame her face at a metre (the crowd cut's face was the smear Chad turned down at v5.31)
      if (x === NEIGH.x && z === NEIGH.z) { p = neighbour = mkSitter('lay_sitwomanhd', x, z, Math.PI - 0.05, { cast: true, at: 0.15 }); }
      else if (x === YAI.x && z === YAI.z) { p = yai = mkSitter('lay_grannyhd', x, z, Math.PI + 0.06, { cast: true, at: 0.2 }); }
      else if (x === KID.x && z === KID.z) { p = kid = mkSitter('lay_botakhd', x, z, Math.PI - 0.08, { h: 1.22, cast: true, at: 0.3 }); }
      else if (x === FRONT.x && z === FRONT.z) { p = frontMan = mkSitter('lay_adminteehd', x, z, Math.PI + 0.03, { cast: true, at: 0.45 }); }
      else if (keep(r, c)) {
        // women on the left of the aisle mostly, men on the right mostly
        const left = x < 0, pick = Math.floor(hash(r * 7 + c, 31) * 100);
        let key = left ? (pick % 4 === 0 ? deal[2 + pick % 2] : deal[pick % 2]) : (pick % 4 === 0 ? deal[pick % 2] : deal[2 + pick % 2]);
        // v19.2: never Yai's own model within 2.5 m of her (a copy's head showed over hers in the peak's shot)
        if (key === 'lay_granny' && Math.hypot(x - YAI.x, z - YAI.z) < 2.5) key = 'lay_admintee';
        p = mkSitter(key, x + jx, z + jz, ry, { at: hash(r, c) * 0.6 });
      }
      if (p) { crowd.push(p); p.row = r; p.col = c; }
    }
    // the monks, at crowd detail, facing across the hall
    const monks = MONKS.map((m, i) => (LOW && i % 2) ? null : mkSitter('monkrow', m.x, m.z, -Math.PI / 2, { y: MPLAT.h + 0.06, white: false, pray: i !== 0, at: 0.1 + hash(i, 41) * 0.5, cast: false, shadow: false })).filter(Boolean);

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
    // v18.5: in the gap beside the man in front (centred on his line, it lay under his body)
    /* v19.2: and ADDED to the world again — v18.5 wrote that note into the
       middle of this line, which turned `world.add(shadow)` into comment text,
       so from v18.5 to v19.1 the shadow was drawn every frame onto nothing:
       no shadow in play, at the peak, or in any ending */
    shadow.rotation.x = -Math.PI / 2; shadow.position.set(PLACE.x + 0.75, 0.016, PLACE.z - 0.45 - 1.8);   // (x +0.75: at +0.5 its crowned head fell behind the man in front, from his eye)
    shadow.renderOrder = 2; world.add(shadow);
    const glimCv = document.createElement('canvas'); glimCv.width = 256; glimCv.height = 256;
    const glimTex = tex(new THREE.CanvasTexture(glimCv)); glimTex.colorSpace = THREE.SRGBColorSpace;
    const glimpse = new THREE.Sprite(new THREE.SpriteMaterial({ map: glimTex, transparent: true, depthWrite: false, opacity: 0, blending: THREE.AdditiveBlending, fog: false }));
    // v18.5: in front of him (it stood 141° behind him); v19.2: placed per screen in figureTick, and added to the world (the same lost line)
    glimpse.scale.set(1.3, 1.3, 1); glimpse.position.set(PLACE.x + 0.9, 1.35, PLACE.z - 1.8);
    glimpse.visible = false; world.add(glimpse);
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
    let figAt = 0, figT0 = 0;                          // figT0: play's figure clock when a scene took it (v19.2)
    const shAt = { k: -1, t: -9 };                     // the last shadow a scene drew (v19.2: throttled like play's)
    function figureTick(wdt, t) {
      const k = kit && kit.getHands ? kit.getHands() : 0;
      const st = getState();
      const on = (st === 'play' || st === 'decide') && seated && k > 0.02;
      // the shadow: always there when he kneels (a plain kneeling shadow at k 0)
      shadow.visible = !!seated && (st === 'play' || st === 'decide' || st === 'cine');
      /* v18.4: under a cutscene the SCENE owns the shadow — its crown (C),
         its fade as he stands (B) — so play's plain kneeling figure is not
         drawn over it every 0.07 s (C's crown flickered at ~14 Hz, and below
         14 fps was never seen at all) */
      if (st === 'cine') {
        glimpse.visible = false; glimpse.material.opacity = 0;
        /* v18.5 started every scene on the plain kneeling shadow here; v19.2:
           this runs AFTER the scene's own first frame (cineUpdate comes before
           updateNotes), so it overwrote what every scene drew and dropped a
           crowned 0.8 shadow to a plain 0.32 under hands still raised. Every
           scene now draws its own from the level play left (A and B forcing it
           down, C up, D settling), on a clock continuous with play's. */
        figureTick.cine = true; figureTick.lastK = -1;   // (a scene draws on the same canvas: play redraws its own when it comes back)
        return;
      }
      figureTick.cine = false; figT0 = t; shAt.k = -1;   // the scene's first frame carries on from here
      shadow.material.opacity = seated ? 0.32 + 0.48 * k : 0;
      // v19.2: and not again while the hands are still — at k 0 the drawing is the same every time, and it went up 14 times a second through the chant
      if (t - figAt > 0.07 && shadow.visible && !(k < 0.02 && figureTick.lastK < 0.02)) {
        figAt = t; figureTick.lastK = k;
        drawFigure(shadowCv.getContext('2d'), k, t, false); shadowTex.needsUpdate = true;
      }
      // the glimpse: only at the edge of the frame, gone when looked at
      let want = 0;
      if (on) {
        const hf = Math.atan(Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2) * camera.aspect);
        /* v19.2: placed for THIS screen — right of his line to the Buddha by
           0.68 of the frame's half-width, the middle of the band the fade
           below shows, 2.0 m out and lifted over the heads of the row ahead.
           v18.5's spot was 0.55 rad out on every screen: past a phone's edge
           (half-width 0.32), and on a desktop half behind the west column. */
        if (figureTick.hf !== hf) {
          figureTick.hf = hf;
          const dx = 0 - PLACE.x, dz = PED.z - PLACE.z, L = Math.hypot(dx, dz), fx = dx / L, fz = dz / L;
          const ca = Math.cos(hf * 0.68), sa = Math.sin(hf * 0.68);
          // right of a heading (fx, fz) is (−fz, fx)
          glimpse.position.set(PLACE.x + 2.0 * (fx * ca - fz * sa), 1.35, PLACE.z + 2.0 * (fz * ca + fx * sa));
        }
        camera.getWorldDirection(_v);
        _v2.copy(glimpse.position).sub(camera.getWorldPosition(_v3)).normalize();
        const ang = Math.acos(THREE.MathUtils.clamp(_v.dot(_v2), -1, 1));
        /* v18.5: the edge of THIS screen's frame — fixed angles (0.42–1.2 rad)
           were past the edge of a phone (0.32 rad half-width) and, with the
           glimpse 141° behind him, it could never be seen on any device */
        want = k * THREE.MathUtils.smoothstep(ang, hf * 0.55, hf * 0.8) * (1 - THREE.MathUtils.smoothstep(ang, hf * 1.0, hf * 1.25));
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
    let heldWas = false;      // v18.4: how the fight went, so a resume at the peak restages THAT peak

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
    function setPhase(p, opts) {
      phase = p;
      if (kit) kit.setPhase((p === 'peak' || p === 'decide') && heldWas ? p + ':held' : p);
      objectiveFor(p, opts);
      syncProps();
    }
    function objectiveFor(p, opts) {
      if (!kit) return;
      const W = DATA.words;
      // (v19.2: none in the fight — its panel says it, and three copies of one order took 41% of a phone)
      const obj = { book: W.objBook, leaf: W.objLeaf, place: W.objPlace, chant: W.objChant }[p];
      /* v18.4: `opts.complete === false` — the chant is not COMPLETED by
         the hands rising out of it, and a LOST fight is not one either (the
         v8.7 lie: OBJECTIVE COMPLETE, a chime and a buzz on the frame his
         hands were taken) */
      kit.objective(obj || null, opts);
      // (v19.2: on the hotspots' own anchors — two markers in two places for one thing)
      const wp = { book: { x: SHELF.x, y: 1.5, z: SHELF.z - 0.32 },
                   leaf: { x: LEAF.x, y: 1.35, z: LEAF.z },
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
      if (kit) kit.conduct({ note: DATA.words.noteBook, s: 0, a: 2 });
      setPhase('leaf');
      return true;
    }
    /* 2 · THE GOLD LEAF — on the image's BACK, where nobody sees it */
    function pressLeaf() {
      if (phase !== 'leaf' || leafing) return false;
      if (worldSfx) { worldSfx('coins', 0.55); after(0.8, () => worldSfx('goldleaf', 0.85)); }
      leafing = { t0: dayClock.t, n: 0 };
      if (kit) kit.waypoint(null);   // v19.2: the marker goes with the press (it sat on the statue's chest through the 4.6 s the leaf takes)
      after(1.2, () => queueLine('z2leaf'));
      after(4.6, () => {
        leafing = null;
        if (kit) kit.conduct({ note: DATA.words.noteLeaf, s: 2, a: 3 });
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
      /* v19.2: he GLIDES onto the mat and his eyes come level as he turns —
         the position was set outright (a half-metre jump in one frame) and
         the pose's pitch range clamped a downward look up to −0.75 on the
         same frame */
      if (kit) kit.root(true);
      if (worldSfx) worldSfx('matkneel', 0.8);
      // (pitch 0: on a phone at −0.10 the great Buddha's face sat behind the objective box and the stat bars)
      turnTo(faceBuddha(), 1.0, { y: 0.98, span: 1.35, lo: -0.75, hi: 0.55, pos: PLACE, pitch: 0.0 }, () => {
        if (kit && kit.pray) kit.pray(true, { secs: 1.2, y: -0.33 });
      });
      syncProps();
      setPhase('chant');
      chantSeq();
    }
    function turnTo(to, secs, o, done) {
      turning = { t: 0, from: yaw.rotation.y, to, secs, y: o.y, span: o.span, lo: o.lo, hi: o.hi, done,
                  pos: o.pos || null, p0: { x: yaw.position.x, z: yaw.position.z }, pitch: o.pitch, pt0: pitch.rotation.x };
    }
    function turnTick(wdt) {
      if (!turning) return;
      const T2 = turning;
      T2.t += wdt / T2.secs;
      const k = smooth(Math.min(1, T2.t));
      let d = T2.to - T2.from; while (d > Math.PI) d -= Math.PI * 2; while (d < -Math.PI) d += Math.PI * 2;
      yaw.rotation.y = T2.from + d * k;
      if (T2.pos) { yaw.position.x = T2.p0.x + (T2.pos.x - T2.p0.x) * k; yaw.position.z = T2.p0.z + (T2.pos.z - T2.p0.z) * k; }
      if (T2.pitch != null) pitch.rotation.x = T2.pt0 + (T2.pitch - T2.pt0) * k;
      // (the range widened to wherever the eyes are while they come to it — no clamp snap)
      if (kit) kit.pose('lying', { y: T2.y, yaw: yaw.rotation.y, span: 0.02, pitchLo: Math.min(T2.lo, pitch.rotation.x - 0.01), pitchHi: Math.max(T2.hi, pitch.rotation.x + 0.01), secs: 0.9 });
      if (T2.t >= 1) {
        turning = null;
        if (kit) kit.pose('lying', { y: T2.y, yaw: T2.to, span: T2.span, pitchLo: T2.lo, pitchHi: T2.hi, secs: 0.05 });
        if (T2.done) T2.done();
      }
    }
    /* 4 · THE CHANT: the hall bows three times (the krap) and he bows with
       it; the bell; his line to himself; and then the swells */
    function chantSeq() {
      after(1.6, () => {
        if (worldSfx) worldSfx('e3bell', 0.5, 1, panAt(0, PED.z));
        bowing = { t0: dayClock.t, applied: 0 };
        // v19.2: the krap is made TO the Buddha — a player looking at the woman beside him bowed into her lap
        let dy = faceBuddha() - yaw.rotation.y; while (dy > Math.PI) dy -= Math.PI * 2; while (dy < -Math.PI) dy += Math.PI * 2;
        if (Math.abs(dy) > 0.25 && !turning) turnTo(faceBuddha(), 0.8, { y: 0.98, span: 1.35, lo: -0.75, hi: 0.55 });
      });
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
      /* v19.2: the dip RIDES ON HIS OWN LOOK — an absolute pitch snapped the
         view level at the bell and ignored every up/down swipe for 7.3 s.
         `applied` is what the bow actually added (after the range), so his
         own look is pitch − applied whatever he does meanwhile. */
      if (t >= 0 && t < 7.3 && seated && !fight && bowing) {
        let dip = 0;
        for (const [a0, a1] of [[0.25, 2.25], [2.55, 4.55], [4.85, 6.85]]) { const u = (t - a0) / (a1 - a0); if (u > 0 && u < 1) dip = Math.sin(u * Math.PI); }
        const base = pitch.rotation.x - bowing.applied;
        const p2 = Math.max(-0.75, Math.min(0.55, base - dip * 0.62));
        pitch.rotation.x = p2; bowing.applied = p2 - base;
      }
      /* v18.5: the shadow maps are drawn on demand; while the hall bows the
         casters (the people nearest him, desktop only) move, so redraw them
         a few times a second rather than leave upright shadows under bowed
         backs */
      if (t >= 0 && !LOW && (!bowTickAll.at || t - bowTickAll.at > 0.2 || t < bowTickAll.at)) { bowTickAll.at = t; redoShadows(); }
      if (t > 7.6) { bowing = null; bowTickAll.at = 0; if (!LOW) redoShadows(); }
    }
    /* 5 · THE HANDS — the resist event, a rapid-tap fight (v18.1). The hands
       follow the event's danger (onRise); the first time they get away he
       says so; losing turns the faces and costs sanity. */
    function yantOn() { return kit && ['yantgaoyord', 'yanthahtaew', 'yantsroi'].some(id => kit.equipped(id)); }
    function beginFight() {
      if (phase !== 'chant' || fight) return;
      setPhase('fight', { complete: false });
      fight = { slips: 0, k: 0 };
      if (!kit) return;
      /* (Chad, 3 Oct) a RAPID-TAP fight: every tap pulls the hands back down;
         the rate it takes climbs from 5 to 6.5 taps a second (v18.3: really
         measured now — see evFrame) over twelve
         seconds of chant; one second too slow and they are gone. */
      kit.event({
        kind: 'resist', label: DATA.words.evHands, brief: DATA.words.evHandsBrief, demo: 'rapid',
        secs: 12, rate0: 5.0, rate1: 6.5, window: 0.75, grace: 1.0, lead: 1.0,
        award: { stat: 'sanity', lo: -10, hi: 6 },
        onBegin: () => {
          /* v19.2: FRAMED — the overlay takes every touch for 12 s, so the
             fight played at whatever angle he had: looking up, the shadow and
             its growing crown sat behind his own hands */
          turnTo(faceBuddha(), 0.6, { y: 0.98, span: 1.35, lo: -0.75, hi: 0.55, pitch: -0.05 });
          if (!worldSfx) return;
          worldSfx('e3gong', 0.45, 1, panAt(MONKS[0].x, MONKS[0].z));
          // the chant swells under it three times as the rate climbs
          // (v18.5: 0.6 / 0.7 / 0.8 — at 0.9 the third swell grazed full scale over the beds)
          worldSfx('chantswell', 0.6, 1, 0);
          after(4.2, () => { if (fight && !fight.result && worldSfx) worldSfx('chantswell', 0.7, 1, 0); });
          after(8.4, () => { if (fight && !fight.result && worldSfx) { worldSfx('chantswell', 0.8, 1, 0); worldSfx('handsrise', 0.6, 1, 0); } });
          // the yant he chose in chapter 1 warms on his back
          if (yantOn()) { kit.flash({ color: 'rgba(255,196,96,0.22)', secs: 0.9 }); worldSfx('yantwarm', 0.55); }
        },
        onRise: (k, danger) => {
          // the hands rise exactly as close as the player is to losing them,
          // and a little tremble rides on them while he holds
          fight.k = k;
          if (kit.hands) kit.hands(Math.min(1, 0.06 + k * 0.85), { secs: 0.12 });
          if (k > 0.35 && !fight.warned) {
            fight.warned = true; if (worldSfx) worldSfx('handsrise', 0.6, 1, 0);
            /* v18.5: "No... not now." the first time they get away from him —
               since v18.1 the fight had no first slip, so this take was said on
               the LOSS and its partner, "Stop... stop.", was never heard */
            if (!fight.said) { fight.said = true; queueLine('z2slip1'); }
          }
          // (v18.5: once a fight — re-armed below 0.05 it restarted every second or two for a player wavering at the line)
          void danger;
        },
        onSlip: () => {
          // LOST: the hands are no longer his
          fight.slips++;
          // (v18.5: the swell is beginPeak's — two identical copies on one frame clipped at +5.5 dBFS)
          if (worldSfx) worldSfx('handslip', 1.0);
          if (kit.haptic) kit.haptic([60, 30, 90, 30, 120]);
          kit.flash({ color: 'rgba(255,120,80,0.28)', secs: 0.6 });
          if (neighbour) neighbour.lookTo = 1;
          if (frontMan) frontMan.lookTo = 1;
          queueLine('z2slip2');
          if (worldSfx) worldSfx('whispers', 0.5, 1, panAt(NEIGH.x, NEIGH.z));
        }
      }).then(r => {
        if (!fight) return;          // v18.4: a reset mid-fight aborts the event AND nulls `fight` first
        fight.result = r;
        if (getState() !== 'play') return;   // v18.5: the loss's −10 can faint him inside evResolve; no peak over the faint
        if (r && !r.aborted) {
          kit.conduct({ note: r.ok ? DATA.words.noteHeld : DATA.words.noteLost, s: 0, a: r.ok ? 4 : -2, minigame: !r.ok });
          beginPeak(!!r.ok);
        }
      });
    }
    /* 6 · THE PEAK: whatever the score, it takes them; the faces turn; his
       line; and the decision opens by itself */
    function beginPeak(held) {
      if (phase !== 'fight') return;
      heldWas = !!held;
      setPhase('peak', held ? undefined : { complete: false });
      peakT = dayClock.t;
      /* v19.2: the faces that turn are ON SCREEN — a phone's frame is 37°
         wide and every one of them sat outside it, so the payoff happened
         off-screen under a banner saying people were looking. His head turns
         to the woman beside him as she turns, and back toward the Buddha
         before the decision; the banner comes up when someone has looked. */
      const toNeigh = Math.atan2(-(NEIGH.x - PLACE.x), -((NEIGH.z - 0.2) - PLACE.z));
      const toYai = Math.atan2(-(YAI.x - PLACE.x), -(YAI.z - PLACE.z));
      const LOOK = { y: 0.98, span: 1.35, lo: -0.75, hi: 0.55 };
      if (held) {
        /* HELD: the chant ends and his hands are still his — pressed down,
           shaking in the clasp; one face has seen; it is not over (v19.2: at
           a tremble in the clasp, with no rising sting — 0.32 and the sting
           on the frame he WON read as having slipped) */
        if (kit) kit.hands(0.10, { secs: 0.6 });
        after(1.0, () => { if (neighbour) neighbour.lookTo = 1; if (kit) kit.presence(0.25); turnTo(toNeigh, 1.1, { ...LOOK, pitch: -0.12 }); });
        after(1.6, () => queueLine('z2peak'));
        after(3.3, () => { if (!turning) turnTo(faceBuddha(), 1.1, { ...LOOK, pitch: -0.10 }); });   // v19.2: −0.10 — the whole statue stands on a phone's decision panel (at 0 its lap went under it)
        after(4.6, () => { setPhase('decide'); if (getState() === 'play') startDecision(); });
        return;
      }
      /* LOST: it takes them all the way up; the faces turn */
      if (kit) kit.hands(1, { secs: 2.4 });
      if (worldSfx) { worldSfx('chantswell', 0.9, 0.96, 0); worldSfx('handsrise', 0.9, 0.85, 0); }
      if (yantOn() && kit) kit.flash({ color: 'rgba(255,196,96,0.28)', secs: 1.4 });
      after(0.8, () => { if (neighbour) neighbour.lookTo = 1; if (kit) kit.presence(0.55); turnTo(toNeigh, 1.1, { ...LOOK, pitch: -0.12 }); });
      after(1.4, () => { if (yai) yai.lookTo = 1; if (worldSfx) worldSfx('whispers', 0.6, 1, panAt(YAI.x, YAI.z)); });
      after(1.9, () => { if (frontMan) frontMan.lookTo = 1; if (kid) kid.lookTo = 1; });
      after(2.0, () => queueLine('z2peak'));
      after(2.6, () => { if (!turning) turnTo(toYai, 1.0, { ...LOOK, pitch: -0.10 }); });
      after(4.0, () => { if (!turning) turnTo(faceBuddha(), 1.0, { ...LOOK, pitch: -0.10 }); });
      after(5.2, () => { setPhase('decide'); if (getState() === 'play') startDecision(); });
    }

    /* ------------------------------------------------------------- hotspots
       Anchors at EYE height (the v7.5 law), on the thing itself. */
    const hotspots = [
      /* v18.4: both anchors at 1.5 m on the HALL side of their own padded
         blockers — at 1.25 / 1.3 m, standing at the shelf or the table put
         them 45–70 degrees under a level gaze, out of the frame, so the
         phone's only press (the badge) went out at arm's length (v7.5) */
      { id: 'book', pos: { x: SHELF.x, y: 1.5, z: SHELF.z - 0.32 }, radius: 2.4, prompt: DATA.words.hotBook, markY: 0,   // (v19.2: the mark at the anchor — 0.55 over it climbed into the stat bars)
        enabled: () => phase === 'book', onInteract() { return takeBook(); } },
      /* v19.2: on the statue itself (v7.5's law) — 0.6 m out it sat 0.135 m
         into the hall from the table's padded edge, under the eye of a
         player standing at the table, and the phone's only press went out */
      { id: 'leaf', pos: { x: LEAF.x, y: 1.35, z: LEAF.z }, radius: 2.6, prompt: DATA.words.hotLeaf, markY: 0.2,
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
      /* v19.2: an ENDING keeps the decision's tension until its scene lets
         it go (duck 'e3pull'): it drained in the first three seconds of all
         four, so C — the worst, the escalation — ran flatter than the card */
      else if (booted && phase === 'decide') { pull = 0.5; }
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
      rackFlicker(t);
      leafFl.scale.y = 1 + Math.sin(t * 12) * 0.2;
      for (let i = 0; i < chand.length; i++) chand[i].rotation.y = Math.sin(t * 0.2 + i) * 0.04;
      rowLight.intensity = 5.5 * (0.92 + 0.08 * Math.sin(t * 7.3) * Math.sin(t * 3.1));
      const a = smoke.geometry.attributes.position, seed = smoke.userData.seed, N = seed.length;
      for (let i = 0; i < N; i++) {
        const k = ((t * 0.11 + seed[i]) % 1);
        a.array[i * 3] = ALT.x + Math.sin(k * 9 + i) * 0.06 * (1 + k * 3);
        a.array[i * 3 + 1] = 1.26 + k * 1.7;
        a.array[i * 3 + 2] = ALT.z + 0.27 + Math.cos(k * 7 + i) * 0.05 * (1 + k * 2);
      }
      a.needsUpdate = true;
      zoneTick(zone, t);
    }
    /* v19.2: A BREATH — every sitter's chest rises and settles a little, each
       on its own phase (the hall was thirty statues through half a minute of
       chant). On top of whatever the bow and the look wrote this frame: the
       full breath on a freshly written bone, else only its change since the
       last frame, so it never stacks. */
    let breathT = 0;
    function breathe(r, i) {
      const b = r.spine[1] || r.spine[0]; if (!b || !b.parent) return;
      const v = 0.014 * Math.sin(breathT * 1.5 + i * 2.39);
      const d = r.spineFresh ? v : v - (r.breathWas || 0);
      r.spineFresh = false; r.breathWas = v;
      if (Math.abs(d) < 1e-6) return;
      const side = _ax.set(Math.cos(r.ry), 0, -Math.sin(r.ry));
      const pq = b.parent.getWorldQuaternion(_q2);
      b.quaternion.premultiply(_q.setFromAxisAngle(side.applyQuaternion(pq.invert()), d));
    }
    function peopleTick(wdt) {
      breathT += wdt;
      for (const r of crowd) { if (!r.ready || !r.model) continue; bowTick(r); }
      for (const r of crowd) if (r.ready && (r.lookTo > 0 || r.lookW > 0.002)) headTick(r, wdt);
      for (const r of monks) if (r.ready && (r.lookTo > 0 || r.lookW > 0.002)) headTick(r, wdt);
      for (let i = 0; i < crowd.length; i++) if (crowd[i].ready && crowd[i].model) breathe(crowd[i], i);
      for (let i = 0; i < monks.length; i++) if (monks[i].ready && monks[i].model) breathe(monks[i], i + 31);
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
      /* v19.2: kept INSIDE a portrait phone's frame (e3c1's tray law, v16.x):
         at a fixed −0.16 the book sat 23° left of the lens, and a phone's
         half-width is 18.6°, so on the only device Chad plays on the book in
         his hand was never on screen (photographed: phone-run-A, 006–016) */
      if (handBook.visible) handBook.position.x = -Math.min(0.16, 0.38 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.aspect * 0.55);
      if (getState() !== 'play') { lastWall = 0; return; }
      const now = performance.now() / 1000;
      if (lastWall) dayClock.t += Math.min(0.5, now - lastWall);
      lastWall = now;
      if (!booted) {
        booted = true;
        /* v18.5: the engine says this chapter's voiceLine ('z2arrive') about
           2 s into play, outside the chapter's own speech window — so a quick
           press of the gold leaf put "z2leaf" on top of it. Book the window. */
        const p0 = kit ? kit.getPhase() : null;
        /* and only a run that starts at the door hears it at all — the engine
           replays the voiceLine on every entry, so a resume on the mat or at
           the peak heard "The evening chant had already started." (the engine
           reads DATA.voiceLine when the line fires, ~2 s from now) */
        const fresh = !p0 || String(p0).split(':')[0] === 'book';
        DATA.voiceLine = fresh ? 'z2arrive' : null;
        if (fresh) speak.until = Math.max(speak.until, dayClock.t + 2.2 + (SECS.z2arrive || 2.7) + 0.3);
        applyPhase(p0);
      }
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
      const tag = String(p || '').split(':');
      p = tag[0]; heldWas = tag[1] === 'held';
      if (!PHASES.includes(p)) p = 'book';
      seated = null; turning = null; bowing = null; fight = null; leafing = null;
      for (const r of [neighbour, yai, kid, frontMan]) if (r) { r.lookTo = 0; }
      if (kit) { kit.pose('standing', { secs: 0.05 }); kit.root(false); if (kit.pray) kit.pray(false, { secs: 0 }); if (kit.hands) kit.hands(0, { secs: 0 }); kit.presence(0); }
      if (p === 'chant' || p === 'fight') {
        /* v18.5: kneel him straight back down — via 'place' the mat's
           objective was set and then "completed" on the same frame by the
           kneel watchTick does, an OBJECTIVE COMPLETE for nothing he did */
        phase = 'place';
        kneel();
        return;
      }
      if (p === 'peak' || p === 'decide') {
        yaw.position.x = PLACE.x; yaw.position.z = PLACE.z; yaw.rotation.y = faceBuddha();
        seated = 'mat';
        if (kit) {
          kit.root(true);
          kit.pose('lying', { y: 0.98, yaw: faceBuddha(), span: 1.35, pitchLo: -0.75, pitchHi: 0.55, secs: 0.05 });
          pitch.rotation.x = -0.10;   // v19.2: the live peak's framing (the statue whole above a phone's decision panel)
          if (kit.pray) kit.pray(true, { secs: 0, y: -0.33 });
          /* v18.4: the peak he actually had — held: the hands pressed down
             and shaking, one face; lost: up, and the faces */
          if (kit.hands) kit.hands(heldWas ? 0.10 : 1, { secs: 0.6 });   // v19.2: as the live held peak (0.32 read as having slipped)
          kit.presence(heldWas ? 0.25 : 0.5);
        }
        for (const r of heldWas ? [neighbour] : [neighbour, yai, frontMan]) if (r) r.lookTo = 1;
        setPhase('decide');
        /* v18.5: and ASK, as the comment above always said — a resume used
           to leave him rooted with his hands up, draining, and no card */
        after(1.0, () => { if (phase === 'decide' && getState() === 'play') startDecision(); });
        return;
      }
      setPhase(p);
    }

    /* ---------------------------------------------------------- lifecycle */
    function snap() { return { phase }; }
    function restore() {
      if (kit) kit.root(false);
      handBook.visible = false;
      for (const l of leaves) l.rotation.y = -Math.sign(l.position.x) * (Math.PI - 0.12);
    }
    function reset() {
      dropTodo(); speakReset(); lineQ.length = 0; heard.clear();
      booted = false; dayClock.t = 0; lastWall = 0;
      DATA.voiceLine = 'z2arrive';   // v18.5: the boot decides again whether it is said
      seated = null; turning = null; bowing = null; fight = null; leafing = null; peakT = 0; heldWas = false;
      figureTick.lastK = -1;
      if (kit && kit.daylight) kit.daylight(null, 0);   // v19.2: ending B brings the stars out; a replay starts on the chapter's own dusk
      /* v18.4: and put every head and spine BACK — headTick only runs while
         a look is live, so zeroing the weights left whoever was looking when
         the last scene ended frozen half-turned through the replay; and the
         monks, whom scene C turns with lookAll, were never reset at all */
      for (const r of [...crowd, ...monks]) {
        r.bow = 0; r.bowWas = false; r.lookTo = 0; r.lookW = 0;
        if (r.head && r.headRest) r.head.quaternion.copy(r.headRest);
        if (r.neck && r.neckRest) r.neck.quaternion.copy(r.neckRest);
        if (r.bowRest) for (const q of r.bowRest) q.b.quaternion.copy(q.q);
        r.spineFresh = true; r.lookSide = 0;      // (v19.2: the breath starts over from rest)
      }
      for (const l of leaves) l.rotation.y = -Math.sign(l.position.x) * (Math.PI - 0.12);
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
      DATA.voiceLine = 'z2arrive';   // v18.5: DATA outlives the build
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
    const film = buildFilm(ctx, world, { tex, parseOnce, thai, box, cyl, alive: () => alive, owned, mkSitter, whiteOf, matFloor, matMat, matCream, matFlame, matGold, matDark, matWood, makeSignTex, KIND, HALL, kit, scene });
    /* v18.4: the film's clock is the INTRO's — run under an ending (scene B
       is 44.7 s long) it put a walker on the courtyard at 44.2 s and left
       him standing there, frozen mid-stride, through the replay */
    function filmTick(t) {
      if (getState() === 'cine' && !booted) { film.tick(t); film.tlight.intensity = 2.4; }
      else {
        for (const w of film.walkers) if (w.grp.visible) w.grp.visible = false;
        /* v19.2: and the floor pocket's candle light OFF — it stayed on all
           chapter, a third point light in every lit pixel of the hall on the
           phone, for a set 300 m away (darkLights drops it 20 frames later) */
        if (film.tlight.intensity) film.tlight.intensity = 0;
      }
    }

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
      /* v19.2: a scene's shadow — `t` is the scene's clock, carried on from
         play's (figT0) so the arms do not jump at the handover; `op` its
         opacity; redrawn only when the level moves or, with arms up, every
         0.07 s as play does (C and D re-uploaded it every frame to their end) */
      shadow, glimpse, drawShadow: (k, t, op) => {
        if (op != null) shadow.material.opacity = op;
        if (Math.abs(k - shAt.k) < 0.01 && (k < 0.02 || Math.abs(t - shAt.t) < 0.07)) return;
        shAt.k = k; shAt.t = t;
        drawFigure(shadowCv.getContext('2d'), k, figT0 + t, false); shadowTex.needsUpdate = true;
      },
      lookAll: (k) => { for (const r of crowd) r.lookTo = k; for (const r of monks) r.lookTo = k; },
      leaves, film, myBook, myStand,
      get phase() { return phase; },
      setPhase, applyPhase, after, dayClock, sayLine,
      info: () => ({ phase, seated, t: +dayClock.t.toFixed(2), queued: lineQ.length, heard: [...heard],
                     until: +speak.until.toFixed(2), pending: speak.pending ? speak.pending.name : null,
                     fight: fight ? { k: +(fight.k || 0).toFixed(2), slips: fight.slips } : null, held: heldWas,
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
    /* v19.2 · THE INK, SHARP. The back's wrap is 1024 texels ROUND THE WHOLE
       TORSO, and this shot sees about 0.13 m of it on a phone — a hundred
       texels — so the yant was fat zigzags magnified six times (photographed:
       phone-film/005). The ink is its own layer now: a band of the same
       tapered wrap a hair outside the skin, 1.2 rad round the middle of the
       back from y 1.00 to 1.42, carrying its own 1024 x 1536 sheet (about
       4 px a millimetre) — the healed first yant left of the spine (the one
       he chose in chapter 1), and the new one going in to its right: the five
       rows of Hah Taew in Khom script, the last row half done, fresh ink
       raised red round every stroke. */
    const YB = { y0: 1.00, y1: 1.42, th: 1.2 };
    const rAt = (y) => 0.165 + (0.205 - 0.165) * (y - 0.81) / 0.62;
    /* which yant he chose in chapter 1 — asked again when the film starts
       (at boot the chapter is built before the bag is loaded, and asking then
       throws: the first test build never reached the title) */
    const pickYant = () => { try { return h.kit.equipped('yanthahtaew') ? 'hah' : h.kit.equipped('yantsroi') ? 'sroi' : 'gao'; } catch (e) { return 'gao'; } };
    let firstYant = pickYant();
    const inkM = basic({ map: makeYantInk(THREE, cnv, firstYant), transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });
    const yantRedo = () => {
      const w = pickYant(); if (w === firstYant) return;
      firstYant = w; const old = inkM.map; inkM.map = makeYantInk(THREE, cnv, w); inkM.needsUpdate = true; old.dispose();
    };
    const ink = new THREE.Mesh(new THREE.CylinderGeometry(rAt(YB.y1) + 0.0008, rAt(YB.y0) + 0.0008, YB.y1 - YB.y0, 96, 1, true, Math.PI - YB.th / 2, YB.th), inkM);
    ink.position.y = (YB.y0 + YB.y1) / 2 - torso.position.y; ink.renderOrder = 1; torso.add(ink);
    // the lamp's warmth: BEHIND the shoulder, a rim round it (the lens is at
    // z −0.6 looking +z, so the plane must not stand between them)
    const lampG = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 1.8), basic({ map: h.tex(makeGlow(THREE, cnv, '255,190,110')), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide }));
    lampG.position.set(0.5, 1.6, 0.4); Y.add(lampG);
    fbox(6, 6, 0.1, 0, 2, 1.6, basic({ color: 0x0c0806 }), Y);
    /* the rod (khem sak): a thin steel needle, its origin AT THE POINT and
       the shaft running back from it. (v18.0's point was a cone put on
       backwards — its wide end at the skin — so on screen it was a black
       dart; and its shaft was a flat grey paint.) Lit steel, catching the
       room's light and the lamp. */
    const steel = new THREE.MeshStandardMaterial({ color: 0xc9ccd1, metalness: 0.9, roughness: 0.28, fog: false,
                                                   envMap: (h.scene && h.scene.environment) || null, envMapIntensity: 1.1, emissive: 0x2a2622, emissiveIntensity: 0.6 });
    const rod = new THREE.Group(); Y.add(rod);
    { const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.0026, 0.0028, 0.6, 14), steel);
      shaft.rotation.x = Math.PI / 2; shaft.position.z = -0.028 - 0.3; rod.add(shaft);
      const needle = new THREE.Mesh(new THREE.ConeGeometry(0.0026, 0.028, 14), steel);
      needle.rotation.x = Math.PI / 2; needle.position.z = -0.014; rod.add(needle);          // apex on +z: the point is at the origin
      const inked = new THREE.Mesh(new THREE.ConeGeometry(0.0009, 0.007, 10), basic({ color: 0x0a0a10 }));
      inked.rotation.x = Math.PI / 2; inked.position.z = -0.0034; rod.add(inked); }
    /* where it strikes: the next letter of the half-done fifth row, ON the
       skin, the shaft back along the skin's normal tipped out to the right
       of the frame (v18.5: away from the lens, or the near plane cuts it) */
    const STRIKE = (() => {
      // the band maps its millimetres to angle linearly (u → θ), so the point is found the way it was drawn
      const yy = YB.y1 - YANT_INK.strikeY / 1000 * (YB.y1 - YB.y0) / (YANT_INK.mmH / 1000), r = rAt(yy), th = YANT_INK.strikeX / YANT_INK.mmW * YB.th;
      const p = new THREE.Vector3(-r * Math.sin(th), yy, -r * Math.cos(th) * 0.58);
      const out = new THREE.Vector3(-Math.sin(th), 0, -Math.cos(th) * 0.58).normalize();
      return { p, out };
    })();
    rod.position.copy(STRIKE.p);
    { const away = STRIKE.out.clone().multiplyScalar(0.55).add(new THREE.Vector3(-0.78, -0.2, 0)).normalize();
      rod.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), away.clone().negate());   // the group's +z (the point) INTO the skin, its shaft back along `away`
      rod.userData = { strike: STRIKE.p.clone(), away }; }

    /* 2 · HIS BUSINESS, BIGGER: a ROADEYE shopfront office at evening — the
       lit sign, staff at their desks, boxes to the ceiling, the van at the
       kerb with its side door open and then slammed */
    const O = pock(P.office);
    const street = new THREE.Mesh(new THREE.PlaneGeometry(40, 24), basic({ color: 0x1a1c22 })); street.rotation.x = -Math.PI / 2; street.position.set(0, 0, 4); O.add(street);
    fbox(40, 0.15, 3.2, 0, 0.075, -0.4, basic({ color: 0x5b5a58 }), O);                           // the pavement
    fbox(16, 6, 0.3, 0, 3, -6.2, basic({ color: 0x2a2724 }), O);                                  // the back wall
    fbox(16, 0.1, 6, 0, 3.4, -3.2, basic({ color: 0xe8ecf0 }), O);                                // the lit ceiling
    // (v18.5: the plain floor that lay 1 cm under the tiled one, and z-fought with it at the front, is gone)
    for (const sx of [-1, 1]) fbox(0.3, 4.2, 0.3, sx * 7.5, 2.1, -1.0, basic({ color: 0x3a3836 }), O);
    fbox(15.2, 0.6, 0.25, 0, 3.75, -1.0, basic({ map: h.tex(h.makeSignTex(THREE, cnv, 'ROADEYE  ·  DASHCAMS', '#0c1a33', '#ffd25a', 15.2 / 0.6)) }), O);
    const glass = new THREE.Mesh(new THREE.PlaneGeometry(14.6, 3.2), basic({ color: 0x9fc4e8, transparent: true, opacity: 0.12, depthWrite: false })); glass.position.set(0, 1.75, -1.0); O.add(glass);
    const boxTex = h.tex(makeBoxTex(THREE, cnv));
    const boxMat = basic({ map: boxTex });
    for (let i = 0; i < 64; i++) { const c = i % 8, r = Math.floor(i / 8); if (r > 5 - (c % 3)) continue; fbox(0.62, 0.42, 0.5, -6.2 + c * 0.64, 0.4 + r * 0.43, -5.6, boxMat, O); }
    for (let i = 0; i < 3; i++) {
      const dx = -1.8 + i * 2.6;
      fbox(1.6, 0.06, 0.8, dx, 0.78, -3.0, basic({ color: 0xd8d2c6 }), O);
      for (const lx of [-0.75, 0.75]) for (const lz of [-0.35, 0.35]) fbox(0.04, 0.56, 0.04, dx + lx, 0.47, -3.0 + lz, basic({ color: 0x8a8580 }), O);   // v18.5: legs (the desks floated)
      fbox(0.05, 0.14, 0.05, dx, 0.88, -3.32, basic({ color: 0x14202e }), O);   // and the monitor's stand
      fbox(0.55, 0.36, 0.04, dx, 1.05, -3.3, basic({ color: 0x14202e }), O);
      fbox(0.5, 0.31, 0.01, dx, 1.05, -3.27, basic({ color: 0x6fa8dc }), O);
      fbox(0.48, 0.45, 0.48, dx, 0.42, -2.25, basic({ color: 0x23262b }), O);   // the chair
    }
    // (the take folds a man over his knees through its middle: parked on its
    // upright frames, its first eighth and last sixth — v8.0's measure)
    /* (v18.5's staff were episode 2's recruit — army tee, PT shorts, bare
       feet — on black cubes: v19.2 seats two civilians in the real office
       below instead) */
    const staff = [];
    for (let i = 0; i < 3; i++) fbox(0.46, 0.5, 0.05, -1.8 + i * 2.6, 0.85, -2.02, basic({ color: 0x23262b }), O);   // the chairs' backs
    /* (a white box van stood at the kerb here and slammed its door: in the
       photographs it was a toy, and its door striped the frame — the van is
       a SOUND now, off the edge of the shot, and the lens goes in to the
       people instead) */
    // the room round them: side walls, ceiling strips, the banner over the stock, a tiled floor
    for (const sx of [-1, 1]) fbox(0.2, 3.6, 5.6, sx * 7.9, 1.8, -3.4, basic({ color: 0x2f2b28 }), O);
    for (let i = 0; i < 3; i++) fbox(3.0, 0.04, 0.14, -4.5 + i * 4.5, 3.33, -3.2, basic({ color: 0xffffff }), O);
    fbox(5.2, 0.7, 0.04, -3.6, 3.0, -6.0, basic({ map: h.tex(h.makeSignTex(THREE, cnv, 'ROADEYE · SEE THE ROAD', '#0c1a33', '#ffd25a', 5.2 / 0.7)) }), O);
    { const ft = h.tex(makeOfficeFloor(THREE, cnv)); ft.wrapS = ft.wrapT = THREE.RepeatWrapping; ft.repeat.set(8, 3);
      fbox(16, 0.05, 6, 0, 0.17, -3.2, basic({ map: ft }), O); }
    /* v19.2 · HIS BUSINESS, BIGGER — IN A REAL OFFICE. The drawn set above
       photographed as a black box under a glaring white lid, its fascia never
       on screen, two of episode 2's recruits barefoot on black cubes (the
       reviewers' first three findings). It stays only as the fallback: Chad's
       office (filmoffice, the Mersus office chapter 1's film uses at night)
       takes the shot when it lands, in its own coordinates at the pocket's
       origin, at EVENING with its lights on — two people at the pair of big
       monitors on the long white table (the chairs measured off the file:
       cushion tops 0.554 at (0.845, 2.143) and (2.403, 2.143), facing −z),
       sales dashboards on the screens, a ROADEYE pull-up banner and stock by
       the glass, and the sky going orange through the rotunda behind them.
       Painted, not lit (a real light changes the light COUNT — v15.1): every
       material unlit, its colour times a warm ambient and two pools. */
    const offNew = new THREE.Group(); offNew.visible = false; O.add(offNew);
    const oldOffice = O.children.filter(o => o !== offNew);
    const eU = {
      nAmb: { value: new THREE.Color(0.36, 0.35, 0.33) },
      nPA: { value: new THREE.Vector3(P.office.x + 1.6, 1.3, P.office.z + 2.1) }, nCA: { value: new THREE.Color(0.30, 0.28, 0.25) }, nRA: { value: 4.2 },
      nPB: { value: new THREE.Vector3(P.office.x + 7.6, 1.6, P.office.z - 0.8) }, nCB: { value: new THREE.Color(0.30, 0.17, 0.08) }, nRB: { value: 5.5 },
    };
    const eveMat = (src) => {
      const m = new THREE.MeshBasicMaterial({ map: src.map || null, color: src.color ? src.color.clone() : 0xffffff, fog: false,
        transparent: !!src.transparent, opacity: src.opacity ?? 1, side: THREE.DoubleSide, alphaTest: src.alphaTest || 0, depthWrite: src.depthWrite !== false });
      m.onBeforeCompile = (sh) => {
        Object.assign(sh.uniforms, eU);
        sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vNW;')
          .replace('#include <fog_vertex>', '#include <fog_vertex>\nvNW = (modelMatrix * vec4(transformed, 1.0)).xyz;');
        sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nvarying vec3 vNW;\nuniform vec3 nAmb, nPA, nCA, nPB, nCB;\nuniform float nRA, nRB;')
          .replace('#include <opaque_fragment>', 'float kA = 1.0 - smoothstep(0.0, nRA, distance(vNW, nPA));\nfloat kB = 1.0 - smoothstep(0.0, nRB, distance(vNW, nPB));\noutgoingLight *= nAmb + nCA * kA + nCB * kB * kB;\n#include <opaque_fragment>');
      };
      m.customProgramCacheKey = () => 'e3c2eve';
      return m;
    };
    // the dusk outside, round every window of the floor
    const duskTex = h.tex(makeDuskCity(THREE, cnv)); duskTex.wrapS = THREE.RepeatWrapping; duskTex.repeat.set(3, 1);
    const dusk = new THREE.Mesh(new THREE.CylinderGeometry(17, 17, 12, 48, 1, true), basic({ map: duskTex, side: THREE.BackSide }));
    dusk.position.set(0, 3.2, 0); offNew.add(dusk);
    // sales on the screens that face the room (centre, facing, width, height off the file)
    const dashTex = h.tex(makeDashboard(THREE, cnv));
    for (const [mx, my, mz, ry, w, hh] of [[0.475, 1.186, 1.845, 0.017, 0.96, 0.55], [2.506, 1.186, 1.845, 0.017, 0.94, 0.55],
                                            [1.32, 1.115, 1.918, -0.417, 0.53, 0.40], [1.786, 1.106, 2.055, 0.665, 0.50, 0.37]]) {
      const sc = new THREE.Mesh(new THREE.PlaneGeometry(w, hh), basic({ map: dashTex }));
      sc.position.set(mx + Math.sin(ry) * 0.024, my, mz + Math.cos(ry) * 0.024); sc.rotation.y = ry; offNew.add(sc);
    }
    // the screens' glow on the table under them
    const glowM = basic({ color: 0x6aa8ff, transparent: true, opacity: 0.12, blending: THREE.AdditiveBlending, depthWrite: false });
    for (const gx of [0.475, 2.506]) { const gq = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 0.6), glowM); gq.rotation.x = -Math.PI / 2; gq.position.set(gx, 0.845, 2.15); offNew.add(gq); }
    // a ROADEYE pull-up banner and a stack of stock by the glass, in the shot behind them
    const banTex = h.tex(makeBannerTex(THREE, cnv));
    const ban = new THREE.Mesh(new THREE.PlaneGeometry(0.85, 2.05), basic({ map: banTex }));
    ban.position.set(3.35, 1.08, -0.35); ban.rotation.y = -0.78; offNew.add(ban);   // between her desk and the pillar, turned to the lens
    fbox(0.9, 0.06, 0.28, 3.35, 0.03, -0.35, basic({ color: 0x2a2c30 }), offNew).rotation.y = -0.78;
    for (let i = 0; i < 9; i++) { const c2 = i % 3, r2 = Math.floor(i / 3); if (r2 === 2 && c2 === 2) continue; fbox(0.62, 0.42, 0.5, 4.3 + c2 * 0.64, 0.21 + r2 * 0.43, -0.6, boxMat, offNew); }
    h.parseOnce('filmoffice').then(gltf => {
      if (!h.alive()) return;
      const g = gltf.scene.clone(true), mats = new Map();
      g.traverse(o => {
        if (!o.isMesh) return;
        o.castShadow = o.receiveShadow = false;
        const ms = Array.isArray(o.material) ? o.material : [o.material];
        const nm = ms.map(m => { if (!mats.has(m)) mats.set(m, eveMat(m)); return mats.get(m); });
        o.material = Array.isArray(o.material) ? nm : nm[0];
      });
      offNew.add(g); offNew.visible = true;
      for (const o of oldOffice) o.visible = false;
    }).catch(err => { console.warn('filmoffice failed to load', err); ctx.loadFail && ctx.loadFail('filmoffice', err); });
    /* the two at the desks: episode 1's tentage sitters, in their own clothes
       (the man in the dark sweater, the woman in a white blouse — the pink
       shirt read as a bare back from behind), seated by the POSED
       skin on the cushion — the hips over its middle, a little back, the
       underside of the thighs ON it (v16.8, e3c1's fitSeat) */
    const _sv = new THREE.Vector3(), _sv2 = new THREE.Vector3();
    const seatOn = (r, sx, sz, top) => {
      const g = r.model; if (!g) return;
      const hips = r.bones.find(b => /Hips(_\d+)?$/.test(b.name)); if (!hips) return;
      g.updateMatrixWorld(true); hips.getWorldPosition(_sv);
      const wx = P.office.x + sx, wz = P.office.z + sz;
      r.group.position.x += wx - _sv.x; r.group.position.z += wz - _sv.z;
      r.group.updateMatrixWorld(true); hips.getWorldPosition(_sv);
      let under = Infinity;
      g.traverse(o2 => {
        if (!o2.isSkinnedMesh) return;
        const n = o2.geometry.attributes.position.count, st = Math.max(1, Math.floor(n / 6000));
        for (let i = 0; i < n; i += st) { o2.getVertexPosition(i, _sv2); _sv2.applyMatrix4(o2.matrixWorld); if (Math.abs(_sv2.x - _sv.x) < 0.2 && Math.abs(_sv2.z - _sv.z) < 0.15) under = Math.min(under, _sv2.y); }
      });
      if (isFinite(under)) r.group.position.y += top + 0.006 - under;
      r.group.updateMatrixWorld(true);
    };
    const desk1 = h.mkSitter('sitangry', 0.85, 2.25, Math.PI + 0.12, { parent: offNew, h: 1.72, take: 'mixamo.com', at: 0, white: false, pray: false, nod: 0.32,
      then: (r) => seatOn(r, 0.845, 2.22, 0.554) });
    const desk2 = h.mkSitter('sitclap', 2.40, 2.25, Math.PI - 0.10, { parent: offNew, h: 1.62, take: 'mixamo.com', at: 0, white: false, pray: false, nod: 0.30,
      then: (r) => seatOn(r, 2.403, 2.22, 0.554) });
    void desk1; void desk2;
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
    // v19.2: the window's sides and mullions, a curtain each side, a lamp's warmth at the left (it was an empty box)
    for (const wx of [-1.0, -0.2, 1.0, 2.2]) fbox(0.06, 1.9, 0.08, wx, 1.5, -2.92, basic({ color: 0x101010 }), F);
    for (const [cx, cw] of [[-1.25, 0.6], [2.45, 0.6]]) fbox(cw, 2.2, 0.04, cx, 1.45, -2.86, basic({ color: 0x2a1c1c }), F);
    { const lg = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 1.6), basic({ map: h.tex(makeGlow(THREE, cnv, '255,190,120')), transparent: true, opacity: 0.35, depthWrite: false, blending: THREE.AdditiveBlending }));
      lg.position.set(-1.1, 1.1, -2.4); F.add(lg); }
    fbox(1.1, 0.06, 0.6, 0, 0.38, -0.9, basic({ color: 0x5a3b26 }), F);                   // the low table
    for (const lx of [-0.5, 0.5]) for (const lz of [-1.15, -0.65]) fbox(0.05, 0.35, 0.05, lx, 0.18, lz, basic({ color: 0x3a2618 }), F);
    // (v19.2: 0.15 m left — the rising hand looked like it was reaching for it)
    const phone = fbox(0.08, 0.01, 0.16, -0.03, 0.42, -0.8, basic({ color: 0x111111 }), F);
    const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.07, 0.145), basic({ map: h.tex(makePhoneChant(THREE, cnv)) })); screen.rotation.x = -Math.PI / 2; screen.position.set(-0.03, 0.427, -0.8); F.add(screen);
    void phone;
    const phoneGlow = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.8), basic({ map: h.tex(makeGlow(THREE, cnv, '170,200,255')), transparent: true, opacity: 0.5, depthWrite: false, blending: THREE.AdditiveBlending }));
    phoneGlow.rotation.x = -Math.PI / 2; phoneGlow.position.set(-0.03, 0.44, -0.8); F.add(phoneGlow);
    /* v19.2: HIS LEGS, crossed on the floor before the low table — the
       hand rested on nothing (the reviewers: "a floating, pointing hand with
       no knee, leg or lap under it"). Dark trousers, the phone's cool light
       on the near shin, his feet in grey socks. */
    { const trou = basic({ color: 0x1f222b }), trouLit = basic({ color: 0x2c3442 }), sock = basic({ color: 0x2b2d33 });
      const limb = (a, b, r, m) => {
        const A = new THREE.Vector3(...a), B = new THREE.Vector3(...b), L = A.distanceTo(B);
        const cap = new THREE.Mesh(new THREE.CapsuleGeometry(r, L, 6, 14), m);
        cap.position.copy(A).add(B).multiplyScalar(0.5); cap.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), B.clone().sub(A).normalize()); F.add(cap); return cap;
      };
      limb([0.13, 0.12, 0.30], [0.40, 0.13, -0.05], 0.078, trou);          // the right thigh, out to the knee
      limb([-0.13, 0.12, 0.30], [-0.40, 0.13, -0.05], 0.078, trou);        // the left
      limb([0.40, 0.10, -0.06], [-0.10, 0.08, -0.30], 0.058, trouLit);     // the right shin, across in front
      limb([-0.40, 0.12, -0.06], [0.12, 0.17, -0.24], 0.056, trou);        // the left, over it
      // the feet: rounded, in dark socks (grey boxes read as paper on the floor)
      limb([-0.08, 0.06, -0.32], [-0.26, 0.05, -0.30], 0.042, sock);
      limb([0.10, 0.15, -0.25], [0.27, 0.13, -0.20], 0.040, sock);
    }
    fbox(2.2, 0.5, 0.8, -1.9, 0.25, 0.4, basic({ color: 0x2d3440 }), F);                  // the sofa's edge
    fbox(2.2, 0.6, 0.2, -1.9, 0.6, 0.75, basic({ color: 0x262c36 }), F);

    /* 4 · A TEMPLE FLOOR, CLOSE: dark stone, a candle, the knees of the two
       people kneeling either side of him in white */
    const T = pock(P.floor);
    /* v19.2: the hall's own tiles at the hall's own size (sharing its material
       put the hall's 6 × 11 repeat on a 6 m plane: half-size, squashed) */
    const tfm = h.matFloor.clone(); tfm.map = h.matFloor.map.clone(); tfm.map.repeat.set(6 / 2.17, 6 / 2.18); tfm.map.needsUpdate = true;
    const tf = new THREE.Mesh(new THREE.PlaneGeometry(6, 6), tfm); tf.rotation.x = -Math.PI / 2; T.add(tf);
    // (v19.2: the mat forward under his hands — centred on z 0 it ended at the frame's bottom edge)
    const tm = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 1.1), h.matMat); tm.rotation.x = -Math.PI / 2; tm.position.set(0, 0.006, -0.45); T.add(tm);
    // the candle off the hands' axis (between his palms it looked held, as they parted)
    const tc = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.24, 8), h.matCream); tc.position.set(0.30, 0.12, -1.0); T.add(tc);
    const tcf = new THREE.Mesh(new THREE.ConeGeometry(0.016, 0.05, 6), h.matFlame); tcf.position.set(0.30, 0.27, -1.0); T.add(tcf);
    /* v19.2: THE ROW AHEAD, kneeling in white on their own mats — on a phone
       the shot was huge hands over bare tiles, a red stripe and a glow, and
       nobody there while he says he was afraid someone would see */
    for (const [ax, az] of [[-0.38, -1.25], [0.46, -1.30]]) {
      const am = new THREE.Mesh(new THREE.PlaneGeometry(0.85, 1.0), h.matMat); am.rotation.x = -Math.PI / 2; am.position.set(ax, 0.005, az); T.add(am);
    }
    const aheadL = h.mkSitter('lay_botak', -0.38, -1.25, Math.PI + 0.04, { parent: T, at: 0.15 });
    const aheadR = h.mkSitter('lay_sitwoman', 0.46, -1.30, Math.PI - 0.05, { parent: T, at: 0.65 });
    void aheadL; void aheadR;
    const tlamp = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 1.4), basic({ map: h.tex(makeGlow(THREE, cnv, '255,200,120')), transparent: true, opacity: 0.6, depthWrite: false, blending: THREE.AdditiveBlending }));
    tlamp.scale.setScalar(0.6); tlamp.position.set(0.30, 0.3, -1.0); T.add(tlamp);
    // v19.2: a little ahead of him (z −0.35), so the glance goes down to a lap, not 80° round to a face
    const sideL = h.mkSitter('lay_grannyhd', -0.85, -0.35, Math.PI + 0.05, { parent: T, at: 0.3 });
    const sideR = h.mkSitter('lay_adminteehd', 0.85, -0.35, Math.PI - 0.05, { parent: T, at: 0.5 });
    const tlight = new THREE.PointLight(0xffc27a, 2.4, 3.2, 1.6); tlight.position.set(0.30, 0.5, -0.85); T.add(tlight);
    // the hall around him, out of focus in the dark: a lacquered wall, two
    // columns with their gold bands, and far off the gilded image's glow
    // (the first cut floated the hands over a floor in an empty blue void)
    const encl = new THREE.Mesh(new THREE.BoxGeometry(16, 10, 14), basic({ color: 0x0d0908, side: THREE.BackSide })); encl.position.set(0, 4.98, -1.5); T.add(encl);
    fbox(9, 7, 0.2, 0, 3.5, -4.2, basic({ color: 0x140d0a }), T);
    for (const sx of [-1.15, 1.25]) {     // v19.2: inside a phone's frame (at −1.7 / 1.9 they were 27–30° out)
      fbox(0.42, 8, 0.42, sx, 4, -3.1, basic({ color: 0x0b0807 }), T);
      for (const y of [0.35, 1.9, 3.4]) fbox(0.44, 0.06, 0.44, sx, y, -3.1, basic({ color: 0x8a6a2c }), T);
    }
    const farGlow = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 3.6), basic({ map: h.tex(makeGlow(THREE, cnv, '255,190,90')), transparent: true, opacity: 0.45, depthWrite: false, blending: THREE.AdditiveBlending }));
    farGlow.position.set(0.15, 1.5, -4.05); farGlow.material.opacity = 0.32; T.add(farGlow);
    // v19.2: and in it, far off, the image itself on its dais (a glow alone said nothing)
    fbox(1.3, 0.7, 0.8, 0.15, 0.35, -3.75, basic({ color: 0x5a1009 }), T);
    fbox(1.34, 0.05, 0.84, 0.15, 0.71, -3.75, basic({ color: 0xb8892e }), T);
    h.thai('buddha', 0.15, 0.73, -3.75, { s: 2.3, tint: 0xffd88c, glow: 0.3, parent: T });
    /* (the two 9 m red strips that stood for the mats' borders are gone with
       the real mats ahead) */

    /* 5 · THE DOORS: two people in white walk up the steps and in, ahead of
       him (the admin tee's own walk, glided on the cine clock) */
    const walkers = [];
    /* v18.5: on through the doors into the hall — the paths ended on the
       porch and the walkers blinked out there, in full view, before the fade */
    const WALK = [[{ x: -0.7, z: 13.5 }, { x: -0.55, z: 8.6 }, { x: -0.4, z: 4.4 }, { x: -0.2, z: 2.6 }, { x: -0.3, z: -2.5 }],
                  [{ x: 0.85, z: 15.0 }, { x: 0.6, z: 8.6 }, { x: 0.45, z: 4.4 }, { x: 0.25, z: 2.6 }, { x: 0.35, z: -2.5 }]];
    h.parseOnce('admintee').then(gltf => {
      if (!h.alive()) return;
      for (let i = 0; i < 2; i++) {
        const g = ctx.cloneSkinned(gltf.scene);
        g.traverse(o => { if (o.isMesh) { o.material = Array.isArray(o.material) ? o.material.map(mm => h.whiteOf(mm, o.geometry, o)) : h.whiteOf(o.material, o.geometry, o); o.frustumCulled = false; } });
        const grp = new THREE.Group(); grp.add(g); grp.visible = false; world.add(grp);
        g.updateMatrixWorld(true);
        let lo = Infinity, hi = -Infinity; const v = new THREE.Vector3();
        g.traverse(o => { if (o.isBone) { o.getWorldPosition(v); lo = Math.min(lo, v.y); hi = Math.max(hi, v.y); } });
        if (hi > lo) g.scale.multiplyScalar((i ? 1.58 : 1.66) / (hi - lo));
        const mixer = new THREE.AnimationMixer(g), clip = gltf.animations.find(c => c.name === 'Walking');
        if (clip) { const a = mixer.clipAction(clip); a.play(); a.time = i * 0.5; }   // v19.2: half a stride out of step
        h.owned.push({ dispose: () => mixer.stopAllAction() });
        walkers.push({ grp, g, mixer, path: WALK[i], last: 0 });
      }
    }).catch(err => { console.warn('admintee failed to load', err); ctx.loadFail && ctx.loadFail('admintee', err); });

    // the yant shot's strikes and the rod, the van's door, the walkers — all on the cine clock
    let lastT = 0;
    function tick(t) {
      const ct = (window.__enc && window.__enc.cine && window.__enc.cine.t) ? window.__enc.cine.t() : t;
      // the rod: in fast to each tap (80 ms) and out slowly (0.32 s), on the taps' own table
      let hit = 0;
      for (const tp of YANT_TAPS) {
        if (ct < tp - 0.08) break;
        hit = ct < tp ? 1 - (tp - ct) / 0.08 : Math.max(0, 1 - (ct - tp) / 0.32);
      }
      // the point on the half-done row, ON the skin at each strike and 4 cm back along the shaft between them;
      // a hand's slow drift along the row as it goes (v19.2: from the measured strike point, not typed numbers)
      { const U = rod.userData;
        rod.position.copy(U.strike).addScaledVector(U.away, 0.0005 + (1 - hit) * 0.04);
        rod.position.x += Math.sin(ct * 0.7) * 0.0025; rod.position.y += -Math.sin(ct * 0.4) * 0.004; }
      // the van's side door slides shut
      vanDoor.position.x = 0.3 - Math.min(1, Math.max(0, (ct - 16.0) / 0.4)) * 1.15;
      // the walkers
      const dt = Math.max(0, Math.min(0.5, ct - lastT)); lastT = ct;   // v19.2: the cine clock's own cap (0.1 let them skate below 10 fps)
      for (let i = 0; i < walkers.length; i++) {
        /* v18.5: by DISTANCE at the take's own pace (1.35 m/s) — equal TIME per
           leg made them skate at 2.3 m/s on the long legs and 0.6 on the short */
        const w = walkers[i], P2 = w.path;
        let dist = (ct - 44.2 - i * 0.9) * 1.35, seg = 0;
        w.grp.visible = dist > 0;
        if (!w.grp.visible) continue;
        while (seg < P2.length - 2 && dist > Math.hypot(P2[seg + 1].x - P2[seg].x, P2[seg + 1].z - P2[seg].z)) { dist -= Math.hypot(P2[seg + 1].x - P2[seg].x, P2[seg + 1].z - P2[seg].z); seg++; }
        const a = P2[seg], b = P2[seg + 1], f = Math.min(1, dist / Math.max(1e-6, Math.hypot(b.x - a.x, b.z - a.z)));
        const x = a.x + (b.x - a.x) * f, z = a.z + (b.z - a.z) * f;
        /* the porch top is 0; six treads of 0.36 from z 6.42 (tops −0.2 … −1.2)
           and the courtyard at −1.4 from 8.58. v19.2: a RAMP through the treads'
           middles — a step function lifted them 20 cm at a time, one jump every
           quarter second, over a flat-ground walk */
        const y = THREE.MathUtils.clamp(-0.15 - (z - 6.6) * (0.2 / 0.36), -1.4, 0);   // (5 cm up: the feet clear each nosing rather than sink into it)
        w.grp.position.set(x, Math.min(0, y), z);
        w.grp.rotation.y = Math.atan2(b.x - a.x, b.z - a.z);
        w.mixer.update(dt);
      }
      void staff; void sideL; void sideR;
    }
    return { root, P, tick, rod, vanDoor, walkers, tlight, yantRedo };
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
    // (v19.2: the yants are their own sharp layer now — makeYantInk)
    for (let i = 0; i < 6000; i++) { const v = r() * 30; x.fillStyle = `rgba(${120 + v},${80 + v},${60 + v},0.12)`; x.fillRect(r() * W, r() * S, 2, 2); }
    return done(THREE, c, false);
  }
  /* v19.2 · the yants on his back, drawn in millimetres on the ink band
     (1.2 rad of the wrap round the spine, y 1.42 down to 1.00): x is the arc
     length from the band's left edge, the spine at its middle; y down from
     the top. The letters are e3c1's v19.1 Khom strokes (no phone font has the
     script). LEFT of the spine, the healed first yant he chose in chapter 1,
     settled into the skin; RIGHT of it, the second going in now — Hah Taew's
     five rows, crisp black, each stroke raised red, the fifth row half done
     where the needle is. */
  /* v19.2: the film's temple-floor clasp, at play's own height less a touch so
     the joined fingers read over the bottom bar (an opening film runs before
     the chapter's first kit.pray: it was chapter 1's −0.235, thumbs showing) */
  const FLOOR_Y = -0.31;
  /* v19.2: the needle's strikes and their sound from ONE table — the strikes
     ran on their own shortening period and met the taps by chance (up to
     175 ms apart, and four silent strikes at the end) */
  const YANT_TAPS = [0.9, 1.4, 1.9, 2.4, 2.85, 3.3, 3.75, 4.2, 4.6, 5.0, 5.4, 5.8, 6.2, 6.6, 7.0, 7.4, 7.8, 8.2];
  const YANT_INK = { W: 1024, H: 1536, mmW: 1.2 * 190.8, mmH: 420, spine: 0.6 * 190.8, cols: [26, 41, 56, 71, 86], top: 112, bot: 300, step: 13.6, strikeX: 86 };
  YANT_INK.strikeY = 236;
  function makeYantInk(THREE, cnv, first) {
    const Y = YANT_INK, [c, x] = cnv(Y.W);
    c.height = Y.H;
    x.clearRect(0, 0, Y.W, Y.H);
    x.setTransform(Y.W / Y.mmW, 0, 0, Y.H / Y.mmH, 0, 0);       // millimetres
    const sp = Y.spine;
    // THE HEALED ONE: dark blue-black, a little soft, settled
    const healed = (draw) => {
      x.strokeStyle = 'rgba(34,42,62,0.32)'; x.lineWidth = 1.9; draw();
      x.strokeStyle = 'rgba(22,28,44,0.82)'; x.lineWidth = 0.75; draw();
    };
    healed(() => {
      if (first === 'hah') {
        for (let i = 0; i < 5; i++) {
          const cx = sp - 22 - i * 14;
          for (let yy = 120; yy < 290; yy += 12.5) khomInk(x, cx, yy, 10.5, i * 31 + yy);
          unalomeInk(x, cx, 114, 46, 7);
        }
      } else if (first === 'sroi') {
        for (let row = 0; row < 3; row++) {
          const R = 52 + row * 13;
          for (let a = 0.18; a < Math.PI - 0.18; a += 0.21) khomInk(x, sp - 62 - Math.cos(a) * R * 0.75, 120 + Math.sin(a) * R, 9.5, row * 17 + a * 40);
        }
        for (const s of [-1, 1]) unalomeInk(x, sp - 62 + s * 48, 118, 40, 6);
      } else {
        // Gao Yord: the stepped pyramid of cells, 9-7-5-3-1, the ovals and an unalome on the peaks
        const cell = 9.6, base = 268;
        for (let row = 0; row < 5; row++) {
          const n = 9 - row * 2, yy = base - row * cell * 1.05;
          for (let i = 0; i < n; i++) {
            const cx = sp - 58 + (i - (n - 1) / 2) * cell;
            x.strokeRect(cx - cell / 2, yy - cell / 2, cell, cell);
            khomInk(x, cx, yy, cell * 0.78, row * 13 + i * 7);
          }
        }
        for (let i = 0; i < 9; i += 2) { const cx = sp - 58 + (i - 4) * cell, top = base - 4 * cell * 1.05 - cell / 2 - (i === 4 ? 6 : 0); unalomeInk(x, cx, top, i === 4 ? 44 : 30, 5); }
      }
    });
    // THE NEW ONE: raised red under every stroke, then the ink, black and crisp
    const fresh = (draw) => {
      x.strokeStyle = 'rgba(178,52,40,0.30)'; x.lineWidth = 2.6; draw();
      x.strokeStyle = 'rgba(8,8,14,0.96)'; x.lineWidth = 0.95; draw();
    };
    fresh(() => {
      Y.cols.forEach((dx, i) => {
        const cx = sp + dx, last = i === Y.cols.length - 1;
        const end = last ? Y.strikeY - Y.step * 0.9 : Y.bot;
        for (let yy = Y.top + Y.step / 2, n = 0; yy < end; yy += Y.step, n++) khomInk(x, cx, yy, Y.step * 0.86, i * 23 + n * 5);
        unalomeInk(x, cx, Y.top - 2, 52, 7);
        if (!last) unalomeInk(x, cx, Y.bot + 2, -38, 6);
      });
    });
    // ink beaded at the newest letters, and a smear where the needle works
    x.fillStyle = 'rgba(10,10,16,0.55)';
    for (let i = 0; i < 14; i++) { const a = i * 2.4, d = 1.2 + (i % 4) * 1.1; x.beginPath(); x.arc(sp + Y.strikeX + Math.cos(a) * d, Y.strikeY - 2 + Math.sin(a) * d, 0.35 + (i % 3) * 0.12, 0, Math.PI * 2); x.fill(); }
    x.fillStyle = 'rgba(150,40,30,0.18)'; x.beginPath(); x.ellipse(sp + Y.strikeX, Y.strikeY - 6, 6, 9, 0, 0, Math.PI * 2); x.fill();
    return done(THREE, c, false);
  }
  /* e3c1's v19.1 Khom letters (drawn strokes in a 10 x 10 box) and the
     unalome, for the film's close-up */
  const KHOM_INK = [
    'M2.3 7.6m-0.9 0a0.9 0.9 0 1 0 1.8 0a0.9 0.9 0 1 0-1.8 0M3.2 7.6V3.6Q3.2 2.2 4.6 2.2Q6 2.2 6 3.6V8.4M6 3.6Q6 2.2 7.3 2.2Q8.6 2.2 8.6 3.6V8.2Q8.6 9.2 9.4 8.8',
    'M3 3.3m-0.9 0a0.9 0.9 0 1 1 1.8 0a0.9 0.9 0 1 1-1.8 0M2.1 3.6Q2.4 8.4 5.2 8.4Q8 8.4 8 5.2V2.4Q8 1.4 9 1.8',
    'M2.6 7.4m-0.8 0a0.8 0.8 0 1 0 1.6 0a0.8 0.8 0 1 0-1.6 0M3.4 7.4V2.6M3.4 7.6Q5 9.2 6.6 7.4Q7.8 6 7.8 2.6V8.6',
    'M3.4 4.4m-0.8 0a0.8 0.8 0 1 1 1.6 0a0.8 0.8 0 1 1-1.6 0M2.6 4.6Q2.6 8.4 5.4 8.4Q8.2 8.4 8.2 5.4Q8.2 2 5.4 2Q3.6 2 3.4 3.6',
    'M2.8 3.2m-0.8 0a0.8 0.8 0 1 1 1.6 0a0.8 0.8 0 1 1-1.6 0M3.6 3.4Q3.4 5.2 2.6 5.6Q2.2 8.4 5.2 8.4Q8 8.4 8 5.4V2.2',
    'M2.4 2.6Q5 1.4 7.6 2.6Q4.6 3.6 4.4 5.4Q4.4 6.6 6 6.6Q7.4 6.8 6.6 8.6Q6 9.4 4.6 9',
    'M2.6 7.4m-0.8 0a0.8 0.8 0 1 0 1.6 0a0.8 0.8 0 1 0-1.6 0M3.4 7.4V3.8Q3.4 2.2 5 2.2Q6.6 2.2 6.6 3.8V7.6Q6.6 8.6 7.6 8.4Q8.6 8.2 8.4 6.8Q8.2 6 7.6 6.4',
    'M5 3.6m-1 0a1 1 0 1 1 2 0a1 1 0 1 1-2 0M5 7.2m-1 0a1 1 0 1 1 2 0a1 1 0 1 1-2 0',
    'M2.2 6.2Q3.4 2.8 5.2 4.8Q6.4 6.4 7.4 3.6Q7.8 2.4 8.8 2.8',
    'M2.6 7.4m-0.8 0a0.8 0.8 0 1 0 1.6 0a0.8 0.8 0 1 0-1.6 0M3.4 7.4V2.6M3.4 7.6Q5 9.2 6.6 7.4V2.4Q6.6 1.6 7.6 1.8L8.8 1.2',
    'M2.6 3.4m-0.8 0a0.8 0.8 0 1 1 1.6 0a0.8 0.8 0 1 1-1.6 0M3.4 3.4V7.4Q3.4 8.4 4.6 8Q6 7.4 6 5.6V7.6Q6 8.6 7.4 8.4Q8.4 8 8.4 2.4',
    'M2.4 2.4V7.2Q2.4 8.4 3.6 8L5 5.4L6.4 8Q7.6 8.4 7.6 7.2V2.4M7.6 2.4m-0.8 0a0.8 0.8 0 1 1 1.6 0a0.8 0.8 0 1 1-1.6 0',
    'M2.6 3m-0.8 0a0.8 0.8 0 1 1 1.6 0a0.8 0.8 0 1 1-1.6 0M3.4 3.2Q3.6 5 2.8 5.4Q2.4 8.4 4.2 8.4Q5.6 8.4 5.6 6.4V3.4Q5.6 2.2 7 2.2Q8.4 2.2 8.4 3.6V8.6',
    'M2.6 7.2m-0.8 0a0.8 0.8 0 1 0 1.6 0a0.8 0.8 0 1 0-1.6 0M3.4 7.2V3.8Q3.4 2.2 5.4 2.2Q7.6 2.2 7.6 4.4V8.4Q7.6 9.6 6.4 9.8',
    'M3 4Q3 2 5 2Q7.6 2 7.6 4.8Q7.6 8.4 5 8.4Q3 8.4 3 6.6Q3 5.6 4.2 5.6Q5.2 5.8 5 6.8',
    'M3.2 4.6m-0.8 0a0.8 0.8 0 1 1 1.6 0a0.8 0.8 0 1 1-1.6 0M4 4.6Q5.6 5 6.4 4Q7.8 2.4 7 1.8M6.4 4Q7.4 6.6 6.4 8.4Q5.6 9.2 4.4 8.6'
  ];
  let khomInkP = null;
  /* one letter, `size` mm square, centred on (cx, cy); the stroke width is the caller's, in mm */
  function khomInk(x, cx, cy, size, n) {
    if (!khomInkP) khomInkP = KHOM_INK.map(d => new Path2D(d));
    const m = Math.abs(Math.round(n)), j = ((m * 37) % 11 - 5) / 5;
    const lw = x.lineWidth, k = size / 10;
    x.save(); x.translate(cx, cy); x.rotate(j * 0.07); x.scale(k, k); x.translate(-5, -5);
    x.lineWidth = lw / k; x.lineCap = 'round'; x.lineJoin = 'round';
    x.stroke(khomInkP[m % KHOM_INK.length]);
    x.restore();
  }
  /* the unalome: a curl at its root, switchbacks narrowing as it rises, then
     the straight line; h < 0 hangs it down */
  function unalomeInk(x, bx, by, h, w) {
    const up = h >= 0 ? 1 : -1, H = Math.abs(h);
    x.save(); x.translate(bx, by); x.scale(1, -up);
    x.lineCap = 'round'; x.lineJoin = 'round';
    const r0 = w * 0.32;
    x.beginPath();
    for (let i = 0; i <= 40; i++) {
      const t = i / 40, a = -Math.PI / 2 + t * Math.PI * 2 * 1.6, rr = r0 * (0.25 + 0.75 * t);
      const px = Math.cos(a) * rr, py = r0 + Math.sin(a) * rr;
      i ? x.lineTo(px, py) : x.moveTo(px, py);
    }
    let y = r0 * 2.1;
    for (let i = 0; i < 5; i++) {
      const a = (w / 2) * (1 - i / 6), dy = w * 0.36 * (1 - i * 0.08), sx = i % 2 ? -1 : 1;
      x.quadraticCurveTo(sx * a * 1.25, y + dy * 0.2, sx * a * 0.2, y + dy * 0.75);
      x.quadraticCurveTo(-sx * a * 0.6, y + dy * 0.95, 0, y + dy);
      y += dy;
    }
    x.lineTo(0, Math.max(y + w * 0.3, H));
    x.stroke();
    x.restore();
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
  /* v19.2: the office's evening — the sky going orange at the horizon over a
     city in silhouette with its first lights on */
  function makeDuskCity(THREE, cnv) {
    const W = 1024, H = 512, [c, x] = cnv(W), r = rng(91);
    c.height = H;
    const g = x.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, '#3a4e7a'); g.addColorStop(0.42, '#8a6f8e'); g.addColorStop(0.62, '#e39a6a'); g.addColorStop(0.72, '#f2b878'); g.addColorStop(1, '#5a4a52');
    x.fillStyle = g; x.fillRect(0, 0, W, H);
    for (let i = 0; i < 46; i++) {
      const w = 24 + r() * 60, xx = r() * W, hh = (0.12 + r() * 0.30) * H, top = H * 0.72 - hh + r() * 30;
      x.fillStyle = r() < 0.5 ? '#3a3440' : '#2e2a36'; x.fillRect(xx, top, w, H - top);
      for (let wy = top + 5; wy < H - 4; wy += 7) for (let wx = xx + 3; wx < xx + w - 3; wx += 6)
        if (r() < 0.22) { x.fillStyle = 'rgba(255,214,150,0.85)'; x.fillRect(wx, wy, 3, 3); }
    }
    return done(THREE, c, false);
  }
  /* v19.2: a sales dashboard — the business, getting better */
  function makeDashboard(THREE, cnv) {
    const W = 512, H = 300, [c, x] = cnv(W), r = rng(19);
    c.height = H;
    x.fillStyle = '#0f1726'; x.fillRect(0, 0, W, H);
    x.fillStyle = '#16223a'; x.fillRect(0, 0, W, 34);
    x.fillStyle = '#ffd25a'; x.font = 'bold 18px sans-serif'; x.textBaseline = 'middle'; x.fillText('ROADEYE', 14, 18);
    x.fillStyle = '#9fb4d6'; x.font = '13px sans-serif'; x.fillText('Sales · this month', 110, 18);
    // three tiles
    const tiles = [['ORDERS', '1,284', '+38%'], ['REVENUE', '$96.4k', '+41%'], ['RETURNS', '0.8%', '-0.3']];
    tiles.forEach((t, i) => {
      const tx = 12 + i * 166; x.fillStyle = '#1b2a45'; x.fillRect(tx, 44, 156, 62);
      x.fillStyle = '#8aa0c4'; x.font = '12px sans-serif'; x.fillText(t[0], tx + 10, 58);
      x.fillStyle = '#ffffff'; x.font = 'bold 24px sans-serif'; x.fillText(t[1], tx + 10, 84);
      x.fillStyle = '#5be08a'; x.font = 'bold 13px sans-serif'; x.fillText(t[2], tx + 104, 84);
    });
    // the curve, climbing
    x.strokeStyle = '#2a3a58'; x.lineWidth = 1;
    for (let i = 0; i < 5; i++) { x.beginPath(); x.moveTo(12, 130 + i * 34); x.lineTo(W - 12, 130 + i * 34); x.stroke(); }
    const pts = []; for (let i = 0; i <= 24; i++) pts.push([16 + i * 20, 262 - (i * i) * 0.19 - r() * 10]);
    const fill = x.createLinearGradient(0, 130, 0, 270); fill.addColorStop(0, 'rgba(91,224,138,0.45)'); fill.addColorStop(1, 'rgba(91,224,138,0)');
    x.fillStyle = fill; x.beginPath(); x.moveTo(pts[0][0], 270); for (const [px, py] of pts) x.lineTo(px, py); x.lineTo(pts[pts.length - 1][0], 270); x.fill();
    x.strokeStyle = '#5be08a'; x.lineWidth = 3; x.beginPath(); pts.forEach(([px, py], i) => (i ? x.lineTo(px, py) : x.moveTo(px, py))); x.stroke();
    return done(THREE, c, false);
  }
  /* v19.2: a pull-up banner, the kind every young company stands by its door */
  function makeBannerTex(THREE, cnv) {
    const W = 256, H = 620, [c, x] = cnv(W);
    c.height = H;
    const g = x.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#0c1a33'); g.addColorStop(1, '#162a52');
    x.fillStyle = g; x.fillRect(0, 0, W, H);
    x.fillStyle = '#ffd25a'; x.font = 'bold 44px sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.fillText('ROADEYE', W / 2, 92);
    x.fillStyle = '#ffffff'; x.font = 'bold 22px sans-serif'; x.fillText('DASHCAMS', W / 2, 136);
    // a dashcam, drawn
    x.fillStyle = '#1e1e22'; x.fillRect(58, 230, 140, 84); x.fillStyle = '#3a3c42'; x.fillRect(66, 238, 124, 68);
    x.fillStyle = '#0a0a0c'; x.beginPath(); x.arc(128, 272, 26, 0, Math.PI * 2); x.fill();
    x.strokeStyle = '#6aa8ff'; x.lineWidth = 4; x.beginPath(); x.arc(128, 272, 17, 0, Math.PI * 2); x.stroke();
    x.fillStyle = '#9fb4d6'; x.font = '20px sans-serif'; x.fillText('SEE THE ROAD.', W / 2, 400);
    x.fillStyle = '#ffd25a'; x.fillRect(40, 440, W - 80, 4);
    x.fillStyle = '#ffffff'; x.font = '16px sans-serif'; x.fillText('4K · NIGHT VISION', W / 2, 480); x.fillText('GPS · PARKING MODE', W / 2, 508);
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
  /* v19.2: a column's own sheet, 128 × 1488 for its 0.62 × 7.2 m face (about
     206 px a metre both ways): a lotus band at its foot, another under the
     capital, gold rules down its edges, small gilt flowers between */
  function makeLacquerColumn(THREE, cnv) {
    const W = 128, Hh = 1488, [c, x] = cnv(W), r = rng(39), pm = Hh / 7.2;
    c.height = Hh;
    x.fillStyle = '#120c0a'; x.fillRect(0, 0, W, Hh);
    const gold = (a) => `rgba(222,176,82,${a})`;
    const band = (yTop, h) => {       // yTop in metres from the column's TOP
      const y0 = yTop * pm, hp = h * pm;
      x.fillStyle = gold(0.95); x.fillRect(0, y0, W, 4); x.fillRect(0, y0 + hp - 4, W, 4);
      for (let i = 0; i < 2; i++) {
        const cx = i * 64 + 32, cy = y0 + hp / 2;
        x.beginPath(); x.moveTo(cx, cy - hp * 0.36); x.quadraticCurveTo(cx + 22, cy, cx, cy + hp * 0.36); x.quadraticCurveTo(cx - 22, cy, cx, cy - hp * 0.36);
        x.fillStyle = gold(0.9); x.fill();
      }
    };
    band(0.6, 0.38); band(7.2 - 0.62, 0.42);
    x.fillStyle = gold(0.8); x.fillRect(3, 0.98 * pm, 3, (7.2 - 0.62 - 0.98) * pm); x.fillRect(W - 6, 0.98 * pm, 3, (7.2 - 0.62 - 0.98) * pm);
    for (let i = 0; i < 46; i++) {
      const fx = 18 + r() * (W - 36), fy = (1.05 + r() * (7.2 - 0.62 - 1.15)) * pm;
      x.fillStyle = gold(0.55);
      for (let p = 0; p < 4; p++) { x.beginPath(); x.ellipse(fx + Math.cos(p * Math.PI / 2) * 4, fy + Math.sin(p * Math.PI / 2) * 4, 3.4, 1.7, p * Math.PI / 2, 0, Math.PI * 2); x.fill(); }
    }
    return done(THREE, c, false);
  }
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
  /* v19.2: a soft dark ellipse for where a sitter meets the floor */
  function makeContactShadow(THREE, cnv) {
    const S = 128, [c, x] = cnv(S);
    const g = x.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
    g.addColorStop(0, 'rgba(255,255,255,0.85)'); g.addColorStop(0.45, 'rgba(255,255,255,0.55)'); g.addColorStop(1, 'rgba(255,255,255,0)');
    x.fillStyle = g; x.fillRect(0, 0, S, S);
    return done(THREE, c, false);
  }
  /* v19.2: drawn to the gable's OWN triangle (w × h metres) and mapped onto
     it 0..1 — ShapeGeometry's UVs are the shape's metres, so the old 512 px
     square sampled one square metre of carving and smeared its edge texels
     across the other forty: a flat red sheet with gold streaks, the first
     thing the doors shot opens on */
  function makeGableCarve(THREE, cnv, w, h) {
    const W = 1024, Hh = Math.max(128, Math.round(W * h / w)), [c, x] = cnv(W), r = rng(61);
    c.height = Hh;
    x.fillStyle = '#6e110a'; x.fillRect(0, 0, W, Hh);
    // the panel inside the gilt bargeboards: a dark red ground with gold kanok
    // scrolls laid along the slopes, rows of flame leaves toward the apex
    x.save(); x.beginPath(); x.moveTo(W * 0.03, Hh); x.lineTo(W / 2, Hh * 0.03); x.lineTo(W * 0.97, Hh); x.closePath(); x.clip();
    x.fillStyle = '#7d140c'; x.fillRect(0, 0, W, Hh);
    const leaf = (cx, cy, sz, ang) => {
      x.save(); x.translate(cx, cy); x.rotate(ang);
      x.beginPath(); x.moveTo(0, sz); x.quadraticCurveTo(sz * 0.55, sz * 0.25, 0, -sz); x.quadraticCurveTo(-sz * 0.55, sz * 0.25, 0, sz); x.fill();
      x.restore();
    };
    x.fillStyle = '#d6a648';
    const step = Hh / 9;
    for (let row = 0; row < 9; row++) {
      const y = Hh - step * (row + 0.6), half = (W / 2) * (y / Hh);
      const n = Math.max(1, Math.round(half * 2 / (step * 1.15)));
      for (let i = 0; i < n; i++) {
        const xx = W / 2 - half + (i + 0.5) * (half * 2 / n);
        leaf(xx, y, step * 0.42, (xx - W / 2) / W * 1.2 + (r() - 0.5) * 0.15);
      }
    }
    x.strokeStyle = '#e8bf62'; x.lineWidth = Math.max(2, Hh * 0.012);
    for (let i = 0; i < 26; i++) {
      const cy = Hh * (0.35 + r() * 0.6), span = (W / 2) * (cy / Hh), cx = W / 2 + (r() * 2 - 1) * span * 0.85, rr = step * (0.25 + r() * 0.3);
      x.beginPath(); x.arc(cx, cy, rr, r() * 6, r() * 6 + 3.6); x.stroke();
    }
    x.restore();
    // the gilt border inside the slopes and along the base
    x.strokeStyle = '#e8bf62'; x.lineWidth = Math.max(4, Hh * 0.03);
    x.beginPath(); x.moveTo(W * 0.04, Hh * 0.985); x.lineTo(W / 2, Hh * 0.04); x.lineTo(W * 0.96, Hh * 0.985); x.closePath(); x.stroke();
    // the medallion at the heart of the panel (a deity's place on a real gable)
    const mx = W / 2, my = Hh * 0.66, mr = Math.min(Hh * 0.2, W * 0.07);
    x.fillStyle = '#e8bf62'; x.beginPath(); x.arc(mx, my, mr, 0, Math.PI * 2); x.fill();
    x.fillStyle = '#7d140c'; x.beginPath(); x.arc(mx, my, mr * 0.74, 0, Math.PI * 2); x.fill();
    x.fillStyle = '#e8bf62'; x.beginPath(); x.arc(mx, my, mr * 0.36, 0, Math.PI * 2); x.fill();
    for (let i = 0; i < 12; i++) leaf(mx + Math.cos(i / 12 * Math.PI * 2) * mr * 1.25, my + Math.sin(i / 12 * Math.PI * 2) * mr * 1.25, mr * 0.28, i / 12 * Math.PI * 2 + Math.PI / 2);
    return done(THREE, c, false);
  }
  /* v19.2: `aspect` is the plane's WIDTH ÷ HEIGHT, and the canvas takes the
     plane's own proportions, so a letter is drawn the shape it is seen.
     (v18.0 passed height ÷ width — 0.32, 0.18, 0.2 — into a square canvas
     that scaled its y BY that number: every letter was squashed twice, and
     the chant-book shelf's sign and both ROADEYE signs read as a thin dashed
     line. Photographed: phone-look/011-shelf-h3.) */
  function makeSignTex(THREE, cnv, text, bg, fg, aspect) {
    const W = aspect > 8 ? 2048 : 1024, Hh = Math.max(32, Math.round(W / aspect)), [c, x] = cnv(W);
    c.height = Hh;
    x.fillStyle = bg; x.fillRect(0, 0, W, Hh);
    const m = Math.min(W, Hh);
    x.strokeStyle = fg; x.lineWidth = Math.max(2, m * 0.05); x.strokeRect(m * 0.1, m * 0.1, W - m * 0.2, Hh - m * 0.2);
    let px = Math.floor(Hh * 0.5); x.font = 'bold ' + px + 'px sans-serif';
    while (x.measureText(text).width > W * 0.86 && px > 6) { px -= 2; x.font = 'bold ' + px + 'px sans-serif'; }
    x.fillStyle = fg; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(text, W / 2, Hh * 0.54);
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
    const { step, sfx, sfxFade, fade, camTo, yawTo, pitchTo, faceFrom, rawK, smoothK, stage, armR, handsRoot, tr } = api;
    const F = stage.film, P = F.P;
    const at = (o, x, y, z) => ({ x: o.x + x, y, z: o.z + z });
    step(0, () => { handsRoot.visible = false; F.yantRedo && F.yantRedo(); });   // v19.2: the healed yant is the one he chose (the bag is loaded by now)
    fade(0.0, 0.0, 1, 1);
    sfx(0.2, 'e3film2', 0.85);

    // 1 · THE SECOND YANT (0 – 10): skin, the rod, the lamp
    fade(0.6, 2.2, 1, 0);
    // close on the new lines and the rod's tip, the shoulder's curve at the frame's edge
    // an extreme close-up: skin, script and the steel tip fill the frame —
    // the body's outline (primitives, as a stand-in) never enters it
    /* v19.2: from the healed first yant across the spine to the new one, then
       in onto the needle at the half-done row — on a phone's centre crop the
       first frame holds both yants (the old one left of the spine, the new
       one right), the last the five rows and the point */
    // v19.2: from wider (0.43 m off the skin, both yants and the spine in a phone's frame) in to the needle
    camTo(0.0, 10.0, at(P.yant, -0.005, 1.23, -0.54), at(P.yant, -0.045, 1.215, -0.31), smoothK);
    yawTo(0.0, 10.0, faceFrom(P.yant.x - 0.005, P.yant.z - 0.54, P.yant.x - 0.02, P.yant.z), faceFrom(P.yant.x - 0.045, P.yant.z - 0.31, P.yant.x - 0.09, P.yant.z), smoothK);
    pitchTo(0.0, 10.0, -0.12, -0.10, smoothK);
    for (const t of YANT_TAPS) sfx(t, 'yantap', 0.5);
    sfx(2.2, 'z2pro1');                               // 5.64 s → 7.84
    fade(9.3, 10.0, 0, 1);

    // 2 · HIS BUSINESS, BIGGER (10 – 20.5): the shopfront at evening, the van
    fade(10.2, 11.2, 1, 0);
    /* v19.2: in Chad's office (buildFilm) — a slow push past the two at
       their screens, toward the glass and the evening behind them */
    camTo(10.0, 20.5, at(P.office, -1.1, 1.36, 4.1), at(P.office, -0.15, 1.30, 3.35), smoothK);
    yawTo(10.0, 20.5, faceFrom(P.office.x - 1.1, P.office.z + 4.1, P.office.x + 3.0, P.office.z + 1.2), faceFrom(P.office.x - 0.15, P.office.z + 3.35, P.office.x + 3.2, P.office.z + 1.35), smoothK);
    pitchTo(10.0, 20.5, -0.10, -0.13, smoothK);
    sfx(10.3, 'officeamb2', 0.7);
    sfx(11.2, 'z2pro2');                              // 6.84 s → 18.04
    sfx(16.0, 'slidevan', 0.75);
    fade(19.8, 20.5, 0, 1);

    /* v19.2: the hand in the FLAT's light — the viewmodel keeps the hall's
       warm dusk rig, so in a room lit only by a phone the hand was the
       brightest thing in it. Cool and low here, the chapter's own from the
       temple floor on (a later track wins; a skip applies both) */
    const VMD = DATA.daylight;
    tr(20.5, 35.6, () => { api.vmHemi.color.setHex(0x34466e); api.vmHemi.groundColor.setHex(0x0a0b10); api.vmHemi.intensity = 0.34; api.vmKey.color.setHex(0xb4ccff); api.vmKey.intensity = 0.30; }, rawK);
    tr(35.6, 55.2, () => { api.vmHemi.color.setHex(VMD.vmHemi[0]); api.vmHemi.groundColor.setHex(VMD.vmHemi[1]); api.vmHemi.intensity = VMD.vmHemi[2]; api.vmKey.color.setHex(VMD.vmKey[0]); api.vmKey.intensity = VMD.vmKey[1]; }, rawK);
    // 3 · HIS FLAT AT NIGHT (20.5 – 35.6): the chant on his phone, and his hand lifts
    /* v19.2: the hand RESTS (fingers together, part-way to the prayer hand —
       the engine's rest is its walking pose, index out, and read as pointing
       at the phone), on his crossed legs (buildFilm), and the lens holds
       still until it lifts (a tilt slid the world under it: it crept onto
       the table) */
    const RELAX = 0.85;
    step(20.5, () => { handsRoot.visible = true; armR.visible = true; });
    tr(20.5, 25.5, () => { api.handsPose(0, 0, { from: 'rest', relax: RELAX }); }, rawK);
    fade(20.7, 21.8, 1, 0);
    camTo(20.5, 35.6, at(P.flat, 0.02, 0.96, 0.18), at(P.flat, 0.0, 0.94, 0.12), smoothK);
    yawTo(20.5, 21.0, faceFrom(P.flat.x, P.flat.z + 0.18, P.flat.x + 0.1, P.flat.z - 0.9), faceFrom(P.flat.x, P.flat.z + 0.18, P.flat.x + 0.1, P.flat.z - 0.9), rawK);
    pitchTo(20.5, 25.5, -0.66, -0.66, smoothK);      // v19.2: down at his lap and the phone on the table (at −0.5 his legs were under the bottom bar)
    sfx(20.6, 'flatnight', 0.85);
    sfx(21.8, 'z2pro3');                              // 5.72 s → 27.52
    /* v19.2: up through the whole of "Slow. Graceful. Like a Thevada's. And I
       wasn't doing it." — it dropped at 31.4, with two sentences still to
       say over a parked hand */
    tr(25.5, 33.9, (k, t) => { api.handsPose(0.85 * smooth(Math.min(1, (t - 25.5) / 5.9)), 0.8 + t * 0.62, { from: 'rest', relax: RELAX }); }, rawK);
    pitchTo(25.5, 30.2, -0.66, -0.12, smoothK);       // his eyes follow it up
    sfx(25.8, 'handsrise', 0.5);
    sfx(28.6, 'z2pro4');                              // 6.84 s → 35.44, under the dip
    sfx(34.0, 'handslip', 0.55);
    tr(33.9, 34.6, (k) => { api.handsPose(0.85 * (1 - smooth(k)), 0.8 + (33.9 + k * 0.7) * 0.62, { from: 'rest', relax: RELAX }); }, rawK);   // v19.2: the rise's own clock carried on (a new one jumped the hand 5 cm and 26° on the slip)
    /* and he holds it DOWN: pressed onto his leg, trembling, until it stops
       (v19.2: the old step set the walking curl — the pose it already had —
       and the track above wrote over it anyway: the beat never happened) */
    tr(34.6, 35.6, (k, t) => {
      api.handsPose(0, 0, { from: 'rest', relax: RELAX });
      const q = 1 - smooth(Math.min(1, (t - 34.6) / 1.0));
      armR.position.y -= 0.022 * smooth(Math.min(1, (t - 34.6) / 0.35));
      armR.position.x += Math.sin(t * 37) * 0.0024 * q; armR.position.z += Math.sin(t * 29 + 1) * 0.0016 * q;
    }, rawK);
    pitchTo(34.0, 35.0, -0.12, -0.62, smoothK);
    fade(35.0, 35.6, 0, 1);

    // 4 · A TEMPLE FLOOR, CLOSE (35.6 – 44.0): the hands come apart, and snap back
    /* v18.4: a TRACK, not a step — cineSeek re-applies every passed track
       every frame, so after a once-step here shot 3's hand (31.4 – 32.4,
       from 'rest') was written back over it until 37.4: the floor shot
       faded in on one hand on a knee and the clasp popped in later */
    tr(35.6, 37.4, () => { api.handsPose(0, 0, { y: FLOOR_Y }); }, rawK);
    fade(35.8, 36.8, 1, 0);
    camTo(35.6, 44.0, at(P.floor, 0.0, 0.98, 0.16), at(P.floor, 0.0, 0.97, 0.12), rawK);
    yawTo(35.6, 40.6, faceFrom(P.floor.x, P.floor.z + 0.16, P.floor.x + 0.1, P.floor.z - 0.8), faceFrom(P.floor.x, P.floor.z + 0.16, P.floor.x + 0.1, P.floor.z - 0.8), rawK);
    pitchTo(35.6, 37.0, -0.40, -0.36, smoothK);
    sfx(35.8, 'e3vesper', 0.32);
    sfx(36.4, 'z2pro5');                              // 4.75 s → 41.15
    tr(37.4, 40.2, (k) => { api.handsPose(0.6 * smooth(k), 1.0 + k * 2.2, { y: FLOOR_Y }); }, rawK);
    sfx(37.6, 'handsrise', 0.45);
    tr(40.2, 40.5, (k) => { api.handsPose(0.6 * (1 - k), 3.2, { y: FLOOR_Y }); }, rawK);
    sfx(40.25, 'handslip', 0.8);
    /* he glances left, then right, at the knees either side of him: did they
       see? (v19.2: the neighbours sit a little AHEAD of him now and the eyes
       go DOWN to their laps — knelt exactly beside him they were 80° off
       each side, so the glance was a 160° whip in 0.8 s that ended face to
       face with the man on the right) */
    const GL = { x: 0.55, z: -0.45 };
    yawTo(40.6, 41.6, faceFrom(P.floor.x, P.floor.z + 0.16, P.floor.x + 0.1, P.floor.z - 0.8), faceFrom(P.floor.x, P.floor.z + 0.16, P.floor.x - GL.x, P.floor.z + GL.z), smoothK);
    pitchTo(40.6, 41.4, -0.36, -0.75, smoothK);
    yawTo(41.7, 42.8, faceFrom(P.floor.x, P.floor.z + 0.16, P.floor.x - GL.x, P.floor.z + GL.z), faceFrom(P.floor.x, P.floor.z + 0.16, P.floor.x + GL.x, P.floor.z + GL.z), smoothK);
    yawTo(42.9, 43.6, faceFrom(P.floor.x, P.floor.z + 0.16, P.floor.x + GL.x, P.floor.z + GL.z), faceFrom(P.floor.x, P.floor.z + 0.16, P.floor.x + 0.1, P.floor.z - 0.8), smoothK);
    pitchTo(42.9, 43.6, -0.75, -0.36, smoothK);
    fade(43.4, 44.0, 0, 1);
    /* (v18.4 faded the floor's chant here and re-cued it for the doors, from
       its first phrase again; v19.2: ONE chant carries across the cut — the
       floor's cue runs 28 s, to 63.8, and goes down with the doors' fade) */

    // 5 · THE HALL'S DOORS AT DUSK (44.0 – 55.2): people in white going in ahead of him
    step(44.0, () => { handsRoot.visible = false; });
    fade(44.2, 45.8, 1, 0);
    camTo(44.0, 53.6, { x: 0.35, y: 0.25, z: 15.2 }, { x: 0.1, y: 0.42, z: 9.6 }, smoothK);
    yawTo(44.0, 53.6, faceFrom(0.35, 15.2, 0.0, 2.0), faceFrom(0.1, 9.6, 0.0, 2.0), smoothK);
    /* v19.2: OPEN ON THE ROOFLINE against the dusk, then down onto the doors
       as they climb — framed at 0.16 a phone saw a cropped gable as a red
       ceiling over a flat cream wall: no sky, nothing to say it was dusk */
    pitchTo(44.0, 47.5, 0.42, 0.18, smoothK);
    pitchTo(47.5, 53.6, 0.18, 0.20, smoothK);
    sfx(44.0, 'templedusk', 0.7);
    sfx(45.8, 'z2pro6');                              // 6.77 s → 52.57
    sfx(52.6, 'e3bell', 0.35);
    fade(53.6, 55.0, 0, 1);
    sfxFade(53.6, 55.0, 'e3vesper');                 // v18.5: the doors' chant and the dusk go down WITH the picture (they were cut at 55.1)
    sfxFade(53.6, 55.0, 'templedusk');
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
  /* v19.2: THE PICTURE STAYS UNDER HIS LAST LINE. The black used to come up at
     T and "Then came Buddha Day" was said over 7.5 s of nothing — on a phone,
     a screen that looks hung (photographed: every ending, 6–8 s of black), and
     the shape Chad turned down at v15.3 ("cuts to black too suddenly while the
     closing voiceline is still talking"). Now the last image holds and drifts
     a little (a breath of the lens up), and the picture and the music go down
     TOGETHER over the line's last three seconds. */
  function ending(c, api, T) {
    const { step, tr, sfx, sfxFade, fade, handsRoot, pitch, smoothK } = api;
    let hold = null;
    step(T, () => { hold = { p: pitch.rotation.x }; });
    tr(T, T + 10.2, (k) => { if (hold) pitch.rotation.x = hold.p + 0.05 * k; }, smoothK);
    sfx(T + 2.6, 'z2next');                           // 7.47 s → T + 10.07, inside the scene (v18.6: 2.8 → 2.6)
    fade(T + 7.2, T + 10.1, 0, 1);
    sfxFade(T + 7.2, T + 10.1, 'e3close2');
    step(T + 10.2, () => { handsRoot.visible = true; });   // (the engine keeps the walking hand off under the card — keep.view — and restart() brings it back)
    c.endFade = 1;
    c.keep.view = true;   // v19.2: the outcome card lies over THIS picture, not over him back on his mat with the walking hand
  }
  // where play left the hands: high after a lost fight, low in the clasp after a held one
  // (v19.2: a held fight leaves them at 0.10 now — the old 0.25 floor jumped them up on the first frame)
  const hk = (api) => { const f = api.handsFrom(); return { k: f.k > 0 ? f.k : 0.25, t: f.t || 0, roll: f.roll || 0 }; };
  /* v19.2: the lens's tilt where play left it, let go over 0.8 s — the engine
     levels it before a scene's first frame, so every ending after a lost
     fight began with the horizon snapping straight (up to 4°) */
  const rollOut = (H0, t) => H0.roll * (1 - smooth(Math.min(1, t / 0.8)));
  // the shadow's opacity for a level of the hands (play's own rule)
  const shOp = (k) => 0.32 + 0.48 * k;

  /* A · FORCE IT DOWN (bad) — the prayer held by force, the shaking, the woman who asks */
  function scForce(c, s, api) {
    const { sfx, tr, step, yawTo, pitchTo, faceFrom, smoothK, rawK, stage, camera, duck } = api;
    const p0 = P0(s), H0 = hk(api), N = stage.NEIGH;
    let shake = 0;
    tr(0, 1.2, (k, t) => {
      api.handsPose(H0.k, H0.t + k * 1.0);
      camera.rotation.z = rollOut(H0, t);
      if (t <= 1.2) stage.drawShadow(H0.k, t, shOp(H0.k));   // (the next track owns it from 1.2; re-applied, this would fight it)
    }, rawK);
    // he wrenches them back into the clasp — the proper prayer, forced — and
    // holds it there, trembling, until it stops. (A curled fist built on the
    // clasp threaded one hand's fingers through the other's in every try
    // photographed; the clasp itself is clean, and it is the truer image:
    // the prayer held by force.)
    tr(1.2, 12.0, (k, t) => {
      const u = Math.min(1, (t - 1.2) / 1.1);
      shake = (1 - Math.min(1, Math.max(0, (t - 6) / 6))) * 0.010;
      api.handsPose(H0.k * (1 - smooth(u)), H0.t + 1.0 + u * 0.3);
      stage.drawShadow(H0.k * (1 - smooth(u)), t, shOp(H0.k * (1 - smooth(u))));   // v19.2: the shadow comes down with them
      const L = api.prayerArm();
      api.armR.position.y += 0.03 * smooth(u); api.armR.position.x += Math.sin(t * 41) * shake;
      if (L) { L.position.y += 0.03 * smooth(u); L.position.x += Math.sin(t * 37 + 1) * shake; }
      camera.rotation.z = Math.sin(t * 33) * shake * 0.6;
      // v19.2: as his eyes go up to the Buddha (13–21 s) the clasp sinks to the bottom bar, not riding up with the gaze
      const sink = 0.11 * smooth(Math.min(1, Math.max(0, (t - 13) / 8)));
      if (sink) { api.armR.position.y -= sink; if (L) L.position.y -= sink; }
    }, rawK);
    step(12.0, () => { camera.rotation.z = 0; });
    sfx(1.3, 'handslip', 0.9);
    sfx(2.7, 'handslip', 0.55);
    tr(1.2, 3.0, (k) => { duck('e3pull', 1 - k); }, rawK);   // v19.2: the tension goes as the clasp is forced
    // she leans to him and asks; he turns to her; she looks away
    // (v19.2: from a side-glance — she had looked since the peak, so "she turns to him" showed nothing)
    step(0, () => { const n = stage.neighbour(); if (n) n.lookTo = 0.35; });
    step(3.6, () => { const n = stage.neighbour(); if (n) n.lookTo = 1; });
    sfx(4.0, 'lw2look');                              // 2.72 s → 6.72
    yawTo(4.2, 5.2, s.yawRot, faceFrom(p0.x, p0.z, N.x, N.z - 0.2), smoothK);
    pitchTo(4.2, 5.2, s.pitchX, -0.18, smoothK);
    yawTo(7.0, 8.0, faceFrom(p0.x, p0.z, N.x, N.z - 0.2), s.yawRot, smoothK);
    step(7.6, () => { const n = stage.neighbour(); if (n) n.lookTo = 0; });
    pitchTo(7.4, 9.0, -0.18, -0.30, smoothK);          // down at his own hands, pressed together and shaking
    sfx(7.6, 'z2A1');                                 // 4.21 s → 11.81
    sfx(12.6, 'e3close2', 0.9);
    pitchTo(13.0, 21.0, -0.30, 0.10, smoothK);         // and up, slowly, to the Buddha
    /* v19.2: and TURNED to him — only the pitch moved, so a player who chose
       while looking anywhere but the Buddha closed on a column (a phone's
       frame is 37° wide) */
    yawTo(13.0, 15.5, s.yawRot, faceFrom(p0.x, p0.z, 0, -20.4), smoothK);
    sfx(13.4, 'z2close');                             // 8.44 s → 21.84
    ending(c, api, 21.9);
  }

  /* B · RISE QUIETLY, BOW, AND STEP OUTSIDE (good) — out through the rows
     with his eyes down, onto the steps, the chant behind the doors */
  function scStepOut(c, s, api) {
    const { sfx, tr, step, camTo, yawTo, pitchTo, faceFrom, smoothK, rawK, stage, handsRoot, duck } = api;   // (camTo: the rise only — the walk is one track, v19.2)
    const p0 = P0(s), H0 = hk(api), PL = stage.PLACE;
    tr(0, 1.6, (k, t) => {
      api.handsPose(H0.k * (1 - smooth(k)), H0.t + k * 0.8);
      stage.drawShadow(H0.k * (1 - smooth(k)), t, shOp(H0.k * (1 - smooth(k))));
    }, rawK);
    tr(0, 0.8, (k) => { api.camera.rotation.z = H0.roll * (1 - k); }, smoothK);   // v19.2: the play tilt let go
    // the wai to the Buddha
    yawTo(0, 1.2, s.yawRot, faceFrom(p0.x, p0.z, 0, -20.4), smoothK);
    pitchTo(1.7, 2.5, s.pitchX, -0.72, smoothK);
    pitchTo(2.5, 3.3, -0.72, -0.05, smoothK);
    // he stands, and the hands go — DOWN out of the frame first (v19.2: they
    // blinked out in one frame as he rose, with nothing to cover it)
    tr(2.8, 3.4, (k) => { api.handsPose(0, H0.t + 0.8); api.armR.position.y -= 0.14 * smooth(k); const L = api.prayerArm(); if (L) L.position.y -= 0.14 * smooth(k); }, rawK);
    step(3.4, () => { handsRoot.visible = false; });
    tr(3.4, 4.6, (k) => { stage.shadow.material.opacity = 0.32 * (1 - k); }, rawK);   // v18.4: and his kneeling shadow with him
    tr(3.4, 6.0, (k) => { duck('e3pull', 1 - k); }, rawK);   // v19.2: the tension goes as he stands
    const up = { x: PL.x - 0.15, y: 1.62, z: PL.z + 0.05 };
    camTo(3.4, 4.6, p0, up, smoothK);
    sfx(3.6, 'matkneel', 0.6);
    /* v19.2: the way out, SQUARE ONTO THE DOOR — west through the gap
       between two columns to the aisle, north up it, across the front of the
       hall to the middle, and straight out through the doorway to the head
       of the steps. The old route walked at the west window, then at the
       blank end wall until it filled a phone, then cut across with the
       doorway's side reveal in the middle of the frame, and stopped under the
       porch roof 2.9 m short of the steps (the flight never read) */
    const aisle = { x: -4.95, y: 1.62, z: PL.z + 0.5 }, near = { x: -4.95, y: 1.62, z: -0.35 }, front = { x: 0, y: 1.62, z: 0.35 },
          door = { x: 0, y: 1.62, z: 2.45 }, porch = { x: 0, y: 1.62, z: 5.2 };
    const WALK = [up, aisle, near, front, door, porch], W0 = 5.6, WV = 1.4, WE = 0.6;
    const segL = WALK.slice(1).map((q, i) => Math.hypot(q.x - WALK[i].x, q.z - WALK[i].z));
    const walkL = segL.reduce((a, b) => a + b, 0), walkV = WV, W1 = W0 + walkL / walkV + WE, DT = W1 - 17.6;   // DT: everything after the walk moves with it
    const atLen = (d) => { d = Math.max(0, d); for (let i = 0; i < segL.length; i++) { if (d <= segL[i] || i === segL.length - 1) { const f = Math.min(1, d / segL[i]); return { x: WALK[i].x + (WALK[i + 1].x - WALK[i].x) * f, y: 1.62, z: WALK[i].z + (WALK[i + 1].z - WALK[i].z) * f }; } d -= segL[i]; } };
    const tAt = (d) => W0 + WE / 2 + d / walkV;          // when the walk passes arc length d (outside the eases)
    const dAt = (t) => { const D = W1 - W0, tt = Math.min(D, Math.max(0, t - W0));
      return tt < WE ? walkV * tt * tt / (2 * WE) : tt > D - WE ? walkL - walkV * (D - tt) * (D - tt) / (2 * WE) : walkV * (tt - WE / 2); };
    // each leg's heading, unwrapped along the route, so a look-ahead heading can be unwrapped against it
    const segH = []; for (let i = 0; i < segL.length; i++) { let hh = faceFrom(WALK[i].x, WALK[i].z, WALK[i + 1].x, WALK[i + 1].z); if (i) { while (hh - segH[i - 1] > Math.PI) hh -= 2 * Math.PI; while (hh - segH[i - 1] < -Math.PI) hh += 2 * Math.PI; } segH.push(hh); }
    const LOOK = 2.6;
    const headAt = (d) => {
      let i = 0, dd = d; while (i < segL.length - 1 && dd > segL[i]) { dd -= segL[i]; i++; }
      const q = atLen(d), a = atLen(Math.min(walkL, d + LOOK));
      if (Math.hypot(a.x - q.x, a.z - q.z) < 0.4) return segH[segH.length - 1];
      let hh = faceFrom(q.x, q.z, a.x, a.z); while (hh - segH[i] > Math.PI) hh -= 2 * Math.PI; while (hh - segH[i] < -Math.PI) hh += 2 * Math.PI;
      return hh;
    };
    /* as he rises he turns to go — one 1.6 s turn to where the walk heads (a
       glance at the woman first made the turn back a 180° whip in 0.6 s past
       a column at arm's length; she is 90° off his right, out of a phone's
       frame, so it showed nothing). She looks up at him as he goes. */
    step(3.6, () => { const n = stage.neighbour(); if (n) n.lookTo = 1; });
    const toBud = faceFrom(p0.x, p0.z, 0, -20.4);
    yawTo(4.0, W0, toBud, headAt(0), smoothK);
    pitchTo(4.0, W0, -0.05, -0.22, smoothK);
    step(6.8, () => { const n = stage.neighbour(); if (n) n.lookTo = 0; });
    tr(W0, W1 + 0.4, (k, t) => {
      const d = dAt(t), q = atLen(d); api.yaw.position.set(q.x, q.y, q.z);
      api.yaw.rotation.y = headAt(d);
    }, rawK);
    const steps = []; for (let i = 0; W0 + 0.1 + i * 0.6 < W1 - 0.2; i++) steps.push(+(W0 + 0.1 + i * 0.6).toFixed(2));
    for (const t of steps) sfx(t, 'barestep', 0.42);      // (the literal call shape: the engine finds a scene's sounds by reading it, v10.2)
    // the dusk outside comes up, the chant falls behind the doors — as he reaches the doorway
    const tDoor = tAt(segL[0] + segL[1] + segL[2]);
    sfx(tDoor, 'templedusk', 0.8);
    tr(tDoor - 0.1, tDoor + 3.1, (k) => { duck('e3vesper', 1 - 0.7 * k); duck('hallamb', 1 - 0.8 * k); }, rawK);
    // at the head of the steps: his right hand, still trembling, settling — it RISES
    // into the frame and goes back down out of it (v19.2: it popped in whole
    // at 18.0 and vanished at 25.2, the lens all but still both times)
    const T2 = 18.0 + DT;
    step(T2, () => { handsRoot.visible = true; api.armR.visible = true; api.handsPose(0.22, 0, { from: 'rest', relax: 0.85 }); api.armR.position.y -= 0.14; });
    tr(T2, T2 + 7.0, (k, t) => {
      api.handsPose(0.22 * (1 - smooth(k)) + 0.03 * Math.sin(t * 9) * (1 - k), 0.5 + k * 2, { from: 'rest', relax: 0.85 });   // (v19.2: fingers at rest — the walking curl pointed)
      api.armR.position.y -= 0.14 * (1 - smooth(Math.min(1, (t - T2) / 0.7))) + 0.14 * smooth(Math.min(1, Math.max(0, (t - T2 - 6.4) / 0.6)));
    }, rawK);
    pitchTo(W1 - 0.6, W1 + 1.4, -0.22, -0.40, smoothK);    // down the steps to his hand
    sfx(18.9 + DT, 'z2B1');                           // 7.39 s (v18.6: 19.4 → 18.9; v19.2: after the longer walk)
    step(25.2 + DT, () => { handsRoot.visible = false; });
    sfx(25.4 + DT, 'e3close2', 0.9);
    pitchTo(25.6 + DT, 32.0 + DT, -0.40, 0.42, smoothK);   // up at the night over the courtyard
    // the stars come out over the courtyard as he looks up (v19.2: the held frame was a flat navy)
    step(25.6 + DT, () => { if (api.kit && api.kit.daylight) api.kit.daylight({ stars: 0.95 }, 6); });
    sfx(26.6 + DT, 'z2close');                        // 8.44 s (v18.6: 26.0 → 26.6, clear of z2B1)
    ending(c, api, 35.0 + DT);
  }

  /* C · LET IT RUN (worst) — it takes all of him; the chant falters; the
     whole hall turns; Yai pulls her grandson close; and then it leaves him */
  function scLetRun(c, s, api) {
    const { sfx, tr, step, yawTo, pitchTo, faceFrom, smoothK, rawK, stage, camera, duck } = api;
    const p0 = P0(s), H0 = hk(api), Y = stage.YAI;
    let tFlow = H0.t;
    const op0 = shOp(H0.k);
    tr(0, 18.0, (k, t) => {
      const fall = Math.min(1, Math.max(0, (t - 14.0) / 4.0));
      /* v19.2: the flow time INTEGRATES the rate (1.5 → 0.6 over the fall);
         t × rate(t) went BACKWARDS from 14 s, so the gesture rewound at 2.3×
         while the hands were still up */
      const d = Math.min(4, Math.max(0, t - 14));
      tFlow = H0.t + 1.5 * Math.min(t, 14) + 1.5 * d - 0.1125 * d * d + 0.6 * Math.max(0, t - 18);
      // from wherever play left them, up into the full gesture in the first 1.2 s
      const rise = Math.min(1, H0.k + (1 - H0.k) * smooth(Math.min(1, t / 1.2)));
      api.handsPose(rise * (1 - smooth(fall)), tFlow);
      const amp = 1 - fall;             // v18.4: to ZERO at 18 — the track re-applies at k 1 to the end, so 0.3 left the lens swaying through the close
      camera.rotation.z = amp * (0.12 * Math.sin(t * 0.9) + 0.03 * Math.sin(t * 2.3)) + rollOut(H0, t);
      // the shadow rises with them and keeps a faint crown after (v19.2: from play's level, not a pop to the crowned figure)
      const opUp = op0 + (0.78 - op0) * smooth(Math.min(1, t / 0.6));
      stage.drawShadow(rise * (1 - fall * 0.8), t, opUp + (0.22 - opUp) * smooth(fall));
    }, rawK);
    /* the body turns with it: the lens sways side to side — and settles back
       to where he faced as the hands drop (v19.2: ONE track; a second one
       took over at 14.0 and jumped the heading 19° in one frame) */
    /* v19.2: the swing SIZED TO THE SCREEN (0.34 rad is a third of a
       desktop's half-width and more than a phone's whole one: the subject was
       replaced, not swayed — a black column filled the frame), and for her
       line it settles on Yai and the boy (both were off a phone's frame) */
    const hfC = Math.atan(Math.tan(camera.fov * Math.PI / 360) * camera.aspect);
    const ampC = 0.34 * Math.min(1, Math.tan(hfC) / 1.15);
    let dPair = faceFrom(p0.x, p0.z, (Y.x + stage.KID.x) / 2, Y.z) - s.yawRot; while (dPair > Math.PI) dPair -= 2 * Math.PI; while (dPair < -Math.PI) dPair += 2 * Math.PI;
    tr(0, 18.6, (k, t) => {
      const out = smooth(Math.min(1, Math.max(0, (t - 14) / 4.6)));
      const pair = smooth(Math.min(1, Math.max(0, (t - 2.6) / 0.8))) * (1 - smooth(Math.min(1, Math.max(0, (t - 6.2) / 0.9))));
      api.yaw.rotation.y = s.yawRot + dPair * pair - ampC * Math.sin(t * 0.55) * Math.min(1, t / 2) * (1 - out) * (1 - pair);
    }, rawK);   // v18.5: RIGHT first, toward Yai as she pulls the boy close (left put her off a phone's frame for her whole line)
    tr(14.0, 18.0, (k) => { duck('e3pull', 1 - k); }, rawK);   // v19.2: the tension held until it leaves him
    sfx(0.4, 'handsrise', 0.85);
    sfx(0.8, 'chantswell', 0.8);
    sfx(3.4, 'handsrise', 0.7);
    // Yai pulls her grandson to her; whispering spreads
    step(2.6, () => { const y = stage.yai(); if (y) y.lookTo = 1; const kd = stage.kid(); if (kd) kd.lookTo = 1; });
    sfx(3.2, 'lw2pull');                              // 2.59 s → 5.79
    sfx(4.4, 'whispers', 0.7);
    // the monks' chant falters, and stops
    // his eyes drop to the floor ahead: the shadow on the mats is not his
    pitchTo(7.0, 7.8, s.pitchX, -0.55, smoothK);      // v19.2: after her line (at 4.6 the eyes dropped to the floor 1.4 s into it)
    pitchTo(8.6, 9.6, -0.55, s.pitchX, smoothK);
    sfx(6.6, 'chantstop', 0.85);
    tr(6.6, 9.4, (k) => { duck('e3vesper', 1 - k); }, rawK);
    step(8.2, () => { stage.lookAll(1); });
    sfx(9.6, 'handsrise', 0.6);
    sfx(10.4, 'z2C1');                                // 6.61 s → 17.01
    // it leaves him: the hands drop, the lens slumps forward
    pitchTo(15.6, 18.6, s.pitchX, -0.62, smoothK);   // (s.pitchX again by 8.4)
    step(18.6, () => { camera.rotation.z = 0; });
    sfx(18.4, 'handslip', 0.6);
    sfx(18.8, 'e3close2', 0.85);
    sfx(19.4, 'z2close');                             // 8.44 s → 27.84
    pitchTo(20.0, 27.0, -0.62, -0.02, smoothK);      // v19.2: up to the WHOLE statue (at −0.25 the top bar cut it at the neck)
    step(38.05, () => stage.lookAll(0));              // and the hall turns back to the chant in the black (the card showed them still staring)
    void p0; void Y; void yawTo; void faceFrom;
    ending(c, api, 27.9);
  }

  /* D · STAY STILL, BREATHE, AND RESOLVE TO ASK SOMEONE WHO TRULY KNOWS
     (best) — he neither fights nor follows; it slows; it settles into his lap;
     the faces turn away; the chant goes on */
  function scStill(c, s, api) {
    const { sfx, tr, step, pitchTo, yawTo, faceFrom, smoothK, rawK, stage, camera, duck } = api;
    const H0 = hk(api), p0 = P0(s), N = stage.NEIGH;
    tr(0, 7.0, (k, t) => {
      const s6 = Math.min(1, t / 6.4), u = smooth(s6);
      // v19.2: the flow INTEGRATES its slowing rate (0.9 → 0.2); t × rate ran it backwards from 3.5 s
      const flow = 0.9 * t - 0.7 * 6.4 * (s6 ** 3 - 0.5 * s6 ** 4) - 0.7 * Math.max(0, t - 6.4);
      api.handsPose(H0.k * (1 - u), H0.t + flow);
      camera.rotation.z = (1 - u) * 0.05 * Math.sin(t * 0.6) + rollOut(H0, t);
      stage.drawShadow(H0.k * (1 - u), t, shOp(H0.k * (1 - u)));
    }, rawK);
    tr(0, 7.0, (k) => { duck('e3pull', 1 - k); }, rawK);   // v19.2: the tension settles with him
    /* into the lap: the clasp lowers, and his hand comes to REST in view on
       his knee (v19.2: the clasp sank 16 cm out of the frame and the picture
       froze for five seconds through the ending's key line) */
    tr(7.0, 7.8, (k) => { api.handsPose(0, H0.t + 6); api.armR.position.y -= 0.16 * smooth(k); const L = api.prayerArm(); if (L) L.position.y -= 0.16 * smooth(k); }, rawK);
    step(7.85, () => { camera.rotation.z = 0; });
    tr(7.8, 15.0, (k, t) => {
      api.handsPose(0, 0, { from: 'rest', relax: 0.85 });
      api.armR.position.y -= 0.10 * (1 - smooth(Math.min(1, (t - 7.8) / 0.8))) + 0.12 * smooth(Math.min(1, Math.max(0, (t - 14.4) / 0.6)));
    }, rawK);
    /* first a glance at the woman who saw — she turns back to the chant ON
       camera (she sat 77° off a phone's frame, and turned away unseen) — then
       down, and the lens keeps breathing through his line */
    yawTo(1.2, 2.3, s.yawRot, faceFrom(p0.x, p0.z, N.x, N.z - 0.2), smoothK);
    pitchTo(1.2, 2.3, s.pitchX, -0.15, smoothK);
    yawTo(4.0, 5.1, faceFrom(p0.x, p0.z, N.x, N.z - 0.2), s.yawRot, smoothK);
    pitchTo(4.6, 7.0, -0.15, -0.5, smoothK);
    pitchTo(7.0, 14.4, -0.5, -0.42, smoothK);
    sfx(1.0, 'matkneel', 0.35);
    // the faces turn away, one by one
    step(2.9, () => { const n = stage.neighbour(); if (n) n.lookTo = 0; });
    step(4.6, () => { const y = stage.yai(); if (y) y.lookTo = 0; const kd = stage.kid(); if (kd) kd.lookTo = 0; });
    step(5.8, () => { const f = stage.frontMan(); if (f) f.lookTo = 0; });
    tr(4.0, 9.0, (k) => { duck('e3vesper', 1 - 0.25 * k); }, rawK);
    sfx(7.6, 'z2D1');                                 // 7.55 s → 15.15 (v18.6: 8.2 → 7.6)
    sfx(14.2, 'e3close2', 0.9);
    pitchTo(14.4, 22.0, -0.42, 0.16, smoothK);         // up, to the Buddha (from where the breathing lens left it)
    yawTo(14.4, 16.9, s.yawRot, faceFrom(p0.x, p0.z, 0, -20.4), smoothK);   // v19.2: and turned to him (A's fix)
    sfx(15.5, 'z2close');                             // 8.44 s → 23.94 (v18.6: 15.0 → 15.5, clear of z2D1)
    ending(c, api, 24.0);
  }

  (window.__CHAPTERS__ = window.__CHAPTERS__ || {}).e3c2 = Object.assign(DATA, {
    build,
    intro,
    scenes: [scForce, scStepOut, scLetRun, scStill]
  });
})();
