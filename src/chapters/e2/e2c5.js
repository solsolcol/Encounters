/* Episode 2 · Chapter 5 · "The Last Question"
   ---------------------------------------------------------------------------
   THE CHAPTER THAT CLOSES CASE FILE 2. Months after the outfield, days from
   ORD, at his infantry camp on the mainland — a different camp, a different
   unit, and no night in it anywhere. He is on clearance: hand the rifle back
   to the armskote, the torch back to the stores, sign the form at the company
   office. Every item the episode taught him to reach for when he was
   frightened, handed across a counter to a bored storeman. That is episode
   1's burning of the note, in uniform. (The beads from when he was twelve
   stay in the bag, and nothing in the chapter mentions it.)

   And then, across the apron, the Tekong encik — the man who shrugged at him
   in the cookhouse in chapter 2. He takes the chance to speak to him, and
   halfway through the small talk the encik brings the Hawk Company bunk up
   himself: "You remember the question you asked me?"

   THE ENCIK IS THE PILE, so the decision is the engine's own and this chapter
   costs no new seam. The four options are Chad's, verbatim, and the encik
   answers ALL FOUR in full — four different answers, not one speech four
   times: a story, a confirmation, a correction, a reason.

   ONE DELIBERATE ABSENCE: `e2dread`, the bed that has run under every frame
   of episode 2 since v10.4, is not declared here. The release, heard.

   Built against the same contract as chapters 1–5, the fixture and e2c1–c4:
   build(ctx) -> stage, scenes[i](c, s, api), intro(c, s, api).
   The plan is docs/V14.0-E2C5-PLAN.md.

   ENGINE SEAMS TOUCHED: none.                                              */

(() => {
  'use strict';

  let S = null;

  const DATA = {
    id: 5,
    episode: 2,
    title: 'The Last Question',
    cardLabel: 'Chapter 5',
    cardTitle: 'The Last Question',
    brief: 'Days from ORD, at your infantry camp. Clear your kit — the armskote, the stores, the company office — and then walk over to the man across the apron you have not seen since Tekong.',
    prompt: 'He has brought the three o\'clock shower up himself, and he is waiting for an answer.',
    choices: [
      { k: 'A', text: '"Who was it, encik? What was his story?"',
        d: { sanity: 15, awareness: 21, wisdom: 24 }, verdict: 'good',
        say: 'I asked who he was. Encik told me, and then told me to leave it there.',
        teach: 'A story can be received as a teaching or collected as a lead. Take the lesson; leave the rest where it is.' },
      { k: 'B', text: '"I don\'t think about it anymore, encik."',
        d: { sanity: 21, awareness: 24, wisdom: 30 }, verdict: 'best',
        say: 'I had already let it go. He only confirmed I was right to.',
        teach: 'Attention is the connection. Stop giving a thing yours, and it stops giving you its.' },
      { k: 'C', text: '"I think I was just too stressed."',
        d: { sanity: -18, awareness: -12, wisdom: -30 }, verdict: 'worst', critical: true,
        say: 'I called it stress. He wouldn\'t let me.',
        teach: 'An ordinary explanation you do not believe is not scepticism. It is a lid.' },
      { k: 'D', text: '"Why didn\'t you tell me then, encik?"',
        d: { sanity: -6, awareness: 12, wisdom: -18 }, verdict: 'bad',
        say: 'I wanted a reason I was owed. He gave me one. It didn\'t help.',
        teach: 'Somebody else\'s account is not your experience, and being owed one is not the same as needing one.' }
    ],
    core: 'The departed stay where their attachments are. So do the living. He was held by a shower in a bunk; you were held by a question — and what let you go was that you stopped holding on.',

    /* units metres, y up. THE APRON runs along x, x −14…14. The COMPANY LINE
       stands along −z (its face at z −8.0); the STORES BLOCK along +z (its
       face at z 7.5) with the armskote, the stores and the company office
       counters in it. The encik stands out on the tarmac in front of the
       stores, where the film's last shot finds him. */
    spawn:     { x: -10.0, y: 1.62, z: 0.6, rot: -Math.PI / 2 },   // out of his own block, facing down the apron
    shrine:    { x: 7.0, z: 4.2 },                                 // the engine's anchor: where the encik stands
    ghostHome: { x: 7.0, z: 4.2 },                                 // unused (ghost: null)
    bounds:    { minX: -13.2, maxX: 13.2, minZ: -7.2, maxZ: 6.2 },

    /* the eleventh leak (v4.3): NO HAUNTING. There is nothing in this chapter
       to be afraid of, and nothing follows him round it. */
    ghost: null,

    /* A LATE AFTERNOON — the brightest, most ordinary light in the episode,
       and the first chapter of either episode with no darkness in it at all.
       The sun is low and off the −x end, so the blocks throw their length
       across the apron and the whole place reads as knocking-off time. */
    daylight: {
      stops: [[0.00, '#f6dcb4'], [0.12, '#e8caa0'], [0.34, '#c3bdaa'],
              [0.64, '#83a3c0'], [1.00, '#4d80b5']],
      bg: 0xcac2ac,
      fog: [0xd9cdb6, 0.0060],
      /* v14.1: MEASURED AGAINST ITS OWN PREMISE. The chapter says "the
         brightest, most ordinary light in the episode" and it photographed
         as dusk, for two reasons that compound. The key sat at (-18, 8, 5) —
         23 degrees of elevation, so the tarmac took cos(67) = 0.39 of an
         already-low 1.05, about a third of what chapter 3's ten-in-the-
         morning puts on its car park. And it came from +z, the STORES side,
         so the walkway roof at y 4.30 shaded every counter, the recesses and
         the encik, which is the half of the apron the chapter is played in.
         It comes over the company line now, at a low warm 24 degrees, so it
         lights the stores block's face and throws the long shadows the
         chapter was written for; hemi and fill lift the rest. */
      hemi: [0xffe6c4, 0x8a7f66, 1.25],
      key: [0xffd6a0, 1.55, -20, 11, -14],
      fill: [0xc9d6e6, 0.42],
      stars: 0, moon: 0,
      sun: 0.85, clouds: 0.35,
      vmHemi: [0xfff0dc, 0x9a8f78, 0.95],
      vmKey: [0xffe2b4, 0.80]
    },

    assets: ['encik2', 'admintee', 'botak', 'tree1', 'tree2', 'tree3', 'tree4'],

    /* ONE BED, and it is e2c1's `campamb` rather than a new one. Both takes of
       the sound generated for this chapter came back with 73 % and 81 % of
       their energy under 120 Hz — rumble a phone speaker cannot play, which
       is the measure that disqualified exactly this at v9.2. `campamb` passed
       it and is the same camp. build.py COMPUTES the pack split, so a second
       chapter cueing a sound is the whole declaration: it moves into the
       SHARED pack, with no duplicate bytes.

       AND NO `e2dread`. It has been under every frame of this episode since
       v10.4. Its absence is the chapter. */
    musicVol: 0,
    ambience: { beds: [['campamb', 0.30]] },

    words: {
      /* an EMPTY approach word means no floating label on a person (v13.0) */
      approach: '',
      /* v14.2: `act`/`actTouch` are the BOOT HINT along the bottom of the
         screen (`setHint`), not the badge — and they said "E to speak to
         the encik" from the chapter's first frame, while the HUD was
         ordering the player to the armskote and the encik would not answer
         until all three counters were done. e2c4 hit the same thing at
         v12.2 and settled it the same way: the hint stays neutral and the
         BADGE (`interact`) names the thing, because the badge only appears
         on something that is actually live. */
      act: 'E to act',
      actTouch: 'Tap to act',
      interact: 'E to speak to the encik',
      interactTouch: 'Tap to speak to the encik',
      objClear: 'Clear your kit · {n}/3',
      objEncik: 'Speak to the encik',
      hotArms: 'Hand in your rifle',
      hotStores: 'Hand in your torch',
      hotOffice: 'Sign your clearance form'
    },
    sayPrefix: 'n5'
  };

  /* the measured length of every line said OUTSIDE a cutscene */
  const SECS = { n5hi: 3.16, e5hi: 1.80, n5ord: 3.40, e5ord: 3.32, e5turn: 4.83,
                 c5arms: 5.04, c5store: 2.25, c5form: 3.24 };

  const hash = (i, s) => { const x = Math.sin(i * 127.1 + s * 311.7) * 43758.5453; return x - Math.floor(x); };

  function build(ctx) {
    const { THREE, GLTFLoader, cloneSkinned, scene, camera, yaw, LOW, kit, plantTrees,
            assetBytes, rescueTextures, redoShadows, cnv, makeHellNote, makeConcrete, makeGrass,
            getState, startDecision, worldSfx, warmSounds, HEAD_RE } = ctx;

    const owned = [];
    let alive = true;

    /* ------------------------------------------------------------- the map */
    const APRON = { x: 14.0, z0: -8.0, z1: 7.5 };
    const LINE  = { z: -8.0, x0: -14.0, x1: 8.0, h: 7.2 };      // the company line, two storeys
    const STORE = { z: 7.5, x0: -7.0, x1: 12.0, h: 4.2 };       // the stores block
    const ARMS   = { x: -3.6, z: 6.9 };
    const STORES = { x: 1.6, z: 6.9 };
    const OFFICE = { x: 8.4, z: 6.9 };
    const ENC = { x: 7.0, z: 4.2 };
    ENC.ry = Math.atan2(0 - ENC.x, 0 - ENC.z);                  // a model faces +z at ry 0: aimed back down the apron

    /* ----------------------------------------------------------- textures */
    const noteTex = makeHellNote();                             // the contract wants one
    const grassTex = makeGrass ? makeGrass() : null;
    const cTex = makeConcrete ? makeConcrete() : null;
    const tarmacTex = makeTarmac(THREE, cnv);
    const formTex = makeForm(THREE, cnv);
    const boardTex = makeNotice(THREE, cnv);
    const shutTex = makeShutter(THREE, cnv);
    const madeTex = [noteTex, tarmacTex, formTex, boardTex, shutTex];

    const matTarmac = new THREE.MeshStandardMaterial({ map: tarmacTex, roughness: 0.95 });
    const matGrass = new THREE.MeshStandardMaterial(grassTex ? { map: grassTex.map, roughnessMap: grassTex.rough, color: 0x9fb37a, roughness: 1 } : { color: 0x7d9a5c, roughness: 1 });
    /* makeConcrete() hands back { map, rough }, NOT a texture — the same
       shape makeGrass() has one line above. Assigning the whole object as
       `map` gave three.js something with no `.matrix`, and
       refreshMaterialUniforms threw on every frame that drew the block. */
    const matBlock = new THREE.MeshStandardMaterial(cTex ? { map: cTex.map, roughnessMap: cTex.rough, color: 0xdfd8c4, roughness: 0.95 } : { color: 0xdfd8c4, roughness: 0.95 });
    const matBand = new THREE.MeshStandardMaterial({ color: 0x8e9b74, roughness: 0.9 });
    const matWhite = new THREE.MeshStandardMaterial({ color: 0xe9e6dc, roughness: 0.9 });
    const matSteel = new THREE.MeshStandardMaterial({ color: 0x9aa0a6, roughness: 0.4, metalness: 0.7 });
    const matFrame = new THREE.MeshStandardMaterial({ color: 0x4d5257, roughness: 0.55, metalness: 0.6 });
    const matDark  = new THREE.MeshStandardMaterial({ color: 0x23262a, roughness: 0.95 });
    // the inside of a stores hatch: dark, but not a hole (v14.1)
    const matRecess = new THREE.MeshStandardMaterial({ color: 0x6b6357, roughness: 0.95 });
    const matStrip = new THREE.MeshStandardMaterial({ color: 0xf2f4f0, emissive: 0xd8e2ea,
                                                      emissiveIntensity: 0.9, roughness: 0.6 });
    const matShut  = new THREE.MeshStandardMaterial({ map: shutTex, roughness: 0.6, metalness: 0.35 });
    const matWood  = new THREE.MeshStandardMaterial({ color: 0x8a6b4a, roughness: 0.8 });
    const matGreen = new THREE.MeshStandardMaterial({ color: 0x4f5a3c, roughness: 0.9 });
    const matProxy = new THREE.MeshStandardMaterial({ color: 0x3b4238, roughness: 0.9 });
    const matForm  = new THREE.MeshStandardMaterial({ map: formTex, roughness: 0.92 });
    const matBoard = new THREE.MeshStandardMaterial({ map: boardTex, roughness: 0.92 });

    const world = new THREE.Group();
    scene.add(world);

    const walls = [], solids = [];
    const box = (w, h, d, x, y, z, mat, parent = world) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
      m.position.set(x, y, z); m.castShadow = !LOW; m.receiveShadow = true;
      parent.add(m); return m;
    };

    /* ------------------------------------------------------------ the ground
       Tarmac over the apron, grass beyond it on both sides. */
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), matGrass);
    ground.rotation.x = -Math.PI / 2; ground.position.y = -0.02; ground.receiveShadow = true; world.add(ground);
    const apron = new THREE.Mesh(new THREE.PlaneGeometry(APRON.x * 2 + 4, APRON.z1 - APRON.z0 + 1.2), matTarmac);
    apron.rotation.x = -Math.PI / 2;
    apron.position.set(0, 0, (APRON.z0 + APRON.z1) / 2);
    apron.receiveShadow = true; world.add(apron);
    // a painted kerb line down each long edge
    box(APRON.x * 2 + 4, 0.012, 0.14, 0, 0.006, APRON.z0 + 0.5, matWhite);
    box(APRON.x * 2 + 4, 0.012, 0.14, 0, 0.006, APRON.z1 - 0.5, matWhite);

    /* ------------------------------------------------- the company line (−z)
       Two storeys of balconies with a stair tower, along the whole −z side. */
    function mkBlock(o, storeys, balcony) {
      const len = o.x1 - o.x0, cx = (o.x0 + o.x1) / 2;
      const face = box(len, o.h, 0.9, cx, o.h / 2, o.z - 0.45, matBlock);
      walls.push(face);
      box(len + 0.5, 0.26, 1.4, cx, o.h + 0.1, o.z - 0.45, matWhite);          // the parapet cap
      for (let s = 0; s < storeys; s++) {
        const y = 0.2 + s * (o.h / storeys);
        box(len, 0.16, 0.2, cx, y + (o.h / storeys) - 0.5, o.z + 0.04, matBand);   // the band under each floor
        if (!balcony) continue;
        // the balcony rail and its uprights
        box(len, 0.08, 0.06, cx, y + (o.h / storeys) - 0.42, o.z + 0.12, matWhite);
        for (let x = o.x0 + 0.9; x < o.x1; x += 1.8) box(0.06, 0.9, 0.06, x, y + (o.h / storeys) - 0.85, o.z + 0.12, matWhite);
      }
      /* doors and louvred windows along the face. v14.1: the guard was
         `o.x1 - 0.8`, but the widest thing this loop DRAWS is the window at
         `x + 1.6` (half-width 0.65), so the last one hung 0.85 m past the end
         of the block in mid-air — and one step earlier it would have been
         buried in the stair tower (x1-3 … x1). The guard is the window's own
         far edge plus the tower's footprint. */
      for (let x = o.x0 + 1.4; x < o.x1 - 4.6; x += 3.2) {
        for (let s = 0; s < storeys; s++) {
          const y = 0.1 + s * (o.h / storeys);
          box(0.95, 2.05, 0.05, x, y + 1.02, o.z + 0.03, matDark);
          box(1.30, 0.80, 0.05, x + 1.6, y + 1.60, o.z + 0.03, matFrame);
          for (let k = 0; k < 5; k++) box(1.24, 0.06, 0.07, x + 1.6, y + 1.30 + k * 0.15, o.z + 0.05, matWhite);
        }
      }
      // a stair tower at the +x end
      box(3.0, o.h + 0.6, 2.6, o.x1 - 1.5, (o.h + 0.6) / 2, o.z - 1.1, matBlock);
      return face;
    }
    mkBlock(LINE, 2, true);
    /* the stores block: single storey, a long roof over a walkway */
    /* v14.1: THE FACE HAS REAL HOLES IN IT NOW. It was one solid 19 m box
       from z 7.50 to 8.40, and everything the counters were dressed with —
       the rifle rack, the stores shelves, and the STOREMAN who speaks all
       three clearance lines — was built at z 7.95-8.65, i.e. inside the
       concrete. The armskote grille stood over a flat wall and the clerk was
       a voice from nowhere. This is v9.1's toilet doorway again: left, right
       and between segments, a sill under each opening and a lintel over it,
       and a dark back panel 0.88 m in so the hole is a recess and not a view
       of the sky. The player can never pass z 6.2 (the chapter's own bound),
       so none of this changes where anyone can walk. */
    const OPEN = { y0: 1.06, y1: 2.66, hw: 1.45 };          // the hatch, in world y
    const HOLES = [ARMS.x, STORES.x];                       // the office is a door in a solid wall
    const segs = [[STORE.x0, HOLES[0] - OPEN.hw], [HOLES[0] + OPEN.hw, HOLES[1] - OPEN.hw],
                  [HOLES[1] + OPEN.hw, STORE.x1]];
    for (const [a, b2] of segs) {
      if (b2 - a < 0.02) continue;
      walls.push(box(b2 - a, STORE.h, 0.9, (a + b2) / 2, STORE.h / 2, STORE.z + 0.45, matBlock));
    }
    for (const hx of HOLES) {
      // the sill — a BLOCKER too, so the wall is still a wall at the engine's
      // one collision sample (y = 1.00, and the sill's top is 1.06)
      walls.push(box(OPEN.hw * 2, OPEN.y0, 0.9, hx, OPEN.y0 / 2, STORE.z + 0.45, matBlock));
      box(OPEN.hw * 2, STORE.h - OPEN.y1, 0.9, hx, (STORE.h + OPEN.y1) / 2, STORE.z + 0.45, matBlock); // the lintel
      box(OPEN.hw * 2 + 0.1, OPEN.y1 - OPEN.y0 + 0.2, 0.06, hx, (OPEN.y0 + OPEN.y1) / 2, STORE.z + 0.86, matRecess);  // the recess back
      /* and a strip light under the lintel — EMISSIVE, not a real light, so
         the hatch reads without a fourth shadow-casting lamp on a phone
         (v9.4's flag stand: lit without a light) */
      box(OPEN.hw * 1.7, 0.05, 0.10, hx, OPEN.y1 - 0.09, STORE.z + 0.30, matStrip);
    }
    box(STORE.x1 - STORE.x0 + 1.6, 0.20, 2.8, (STORE.x0 + STORE.x1) / 2, STORE.h + 0.1, STORE.z - 0.6, matBand);   // the walkway roof
    /* v14.1: PLACED TO MISS THE COUNTERS. The old run started at x -6.0 and
       stepped 3.4 m, which put a post within a metre of all three counter
       centres — photographed, one stood dead across the stores hatch, and a
       post between the player and the thing he has to act on is the one
       place a post must not be. These sit between the counters instead, no
       nearer than 2.6 m to any of them. */
    for (const x of [-6.4, -1.0, 5.0, 11.4]) {
      const p = box(0.24, STORE.h, 0.24, x, STORE.h / 2, STORE.z - 1.8, matWhite); solids.push(p);
    }

    /* ---------------------------------------------------------- the counters
       Three of them, in the stores block's face: the armskote (a steel grille
       over a counter, a rifle rack visible behind it), the stores (a roller
       shutter half up over a counter, racks behind), and the company office
       (a door, a notice board, a bench outside it). */
    function mkCounter(at, kind) {
      const g = new THREE.Group(); g.position.set(at.x, 0, at.z); world.add(g);
      const top = box(2.6, 0.10, 0.62, 0, 0.98, 0, matSteel, g); solids.push(top);
      box(2.6, 0.92, 0.50, 0, 0.46, 0.08, matFrame, g);
      /* v14.1: THE FAKE OPENING IS GONE. Every counter used to draw a
         2.9 x 1.55 m dark panel on the wall to suggest a hatch. The armskote
         and the stores have a REAL hole now (see the face above), and at the
         office the panel was doing active harm: photographed, it sat 1.5 cm
         in FRONT of the office's own wooden door and hid the top metre of
         it, and since the encik stands right there it put a black slab
         behind him in all four outcome scenes. The office is a door, a
         notice board and a counter, which is what a company office is. */
      if (kind === 'arms') {
        // a steel grille, and a rifle rack behind it in the dark
        for (let k = 0; k < 11; k++) box(0.05, 1.45, 0.05, -1.30 + k * 0.26, 1.82, 0.56, matSteel, g);
        box(2.6, 0.06, 0.06, 0, 1.12, 0.56, matSteel, g);
        box(2.6, 0.06, 0.06, 0, 2.52, 0.56, matSteel, g);
        for (let k = 0; k < 9; k++) {
          const r = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.82, 0.07), matGreen);
          r.position.set(-1.0 + k * 0.25, 1.75, 0.95); r.rotation.z = 0.05; g.add(r);
        }
        box(2.4, 0.06, 0.4, 0, 1.30, 0.95, matFrame, g);
      } else if (kind === 'stores') {
        // a roller shutter, half up
        box(2.9, 0.95, 0.06, 0, 2.62, 0.58, matShut, g);
        box(2.9, 0.10, 0.12, 0, 2.12, 0.58, matFrame, g);
        for (const z of [0.95, 1.32]) for (let k = 0; k < 4; k++) box(2.2, 0.05, 0.40, 0, 1.25 + k * 0.42, z, matFrame, g);
        // a tray of torches on the counter, and a clipboard
        for (let k = 0; k < 6; k++) box(0.05, 0.05, 0.20, -0.75 + k * 0.10, 1.06, -0.12, matDark, g);
        box(0.46, 0.02, 0.32, 0.85, 1.05, -0.05, matWood, g);
      } else {
        // the company office: a door, a notice board beside it, a bench outside
        // the wall's front plane is z 7.50 = local 0.60, so the door sat
        // exactly in it and z-fought along its whole face (v14.1)
        box(1.05, 2.15, 0.07, -0.2, 1.08, 0.545, matWood, g);
        box(0.07, 0.07, 0.10, 0.22, 1.05, 0.45, matSteel, g);
        /* a PlaneGeometry faces +z, and the player is always on the -z side
           of this block, so this board was back-face culled and never once
           drawn (v14.1) */
        const nb = new THREE.Mesh(new THREE.PlaneGeometry(1.15, 0.82), matBoard);
        nb.position.set(1.35, 1.60, 0.52); nb.rotation.y = Math.PI; g.add(nb);
        box(1.5, 0.06, 0.34, 0.4, 0.44, -1.15, matWood, g); solids.push(box(1.5, 0.44, 0.34, 0.4, 0.22, -1.15, matFrame, g));
        // the clearance form, face up on the counter
        const fm = new THREE.Mesh(new THREE.PlaneGeometry(0.30, 0.42), matForm);
        fm.rotation.x = -Math.PI / 2; fm.position.set(-0.55, 1.035, -0.10); g.add(fm);
      }
      return g;
    }
    const cArms   = mkCounter(ARMS,   'arms');
    const cStores = mkCounter(STORES, 'stores');
    const cOffice = mkCounter(OFFICE, 'office');

    /* ------------------------------------------------------------ dressing */
    // a few parked vehicles at the −x end, nose in to the line
    for (let i = 0; i < 3; i++) {
      const x = -12.4 + i * 2.6, z = -5.4;
      const v = new THREE.Group(); v.position.set(x, 0, z); world.add(v);
      box(2.0, 0.95, 4.4, 0, 0.90, 0, matGreen, v);
      box(1.9, 0.75, 1.9, 0, 1.70, -1.0, matGreen, v);
      for (const s of [-1, 1]) for (const zz of [-1.5, 1.5]) {
        const w = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.3, 12), matDark);
        w.rotation.z = Math.PI / 2; w.position.set(s * 1.0, 0.42, zz); v.add(w);
      }
      solids.push(box(2.2, 1.4, 4.6, x, 0.7, z, matGreen));
      solids[solids.length - 1].visible = false;
    }
    // bins and a hose reel against the stores block
    solids.push(box(0.62, 0.95, 0.62, -6.0, 0.475, 6.4, matGreen));
    solids.push(box(0.62, 0.95, 0.62, -5.2, 0.475, 6.4, matGreen));
    // v14.1: on the wall (face at z 7.50), not floating 0.51 m off it
    box(0.5, 0.5, 0.18, 11.2, 1.30, STORE.z - 0.09, matFrame);
    // a flagpole at the +x end of the apron, bare (episode 2's convention since v10.2)
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.09, 8.0, 10), matWhite);
    pole.position.set(12.4, 4.0, -1.0); world.add(pole);
    const ball = new THREE.Mesh(new THREE.SphereGeometry(0.11, 10, 8), matWhite);
    ball.position.set(12.4, 8.05, -1.0); world.add(ball);
    solids.push(box(0.9, 0.34, 0.9, 12.4, 0.17, -1.0, matWhite));

    /* ---------------------------------------------------------------- trees
       Round the outside, well clear of the apron and of the sight-line from
       the spawn to the encik. */
    let treeStand = null;
    if (plantTrees) {
      const spots = [];
      for (let i = 0; i < 26; i++) {
        const r = hash(i, 5);
        const side = i % 2 ? 1 : -1;
        const x = -26 + hash(i, 11) * 52;
        const z = side > 0 ? 13.0 + r * 16 : -15.0 - r * 16;
        if (Math.abs(x) < 15 && side > 0 && z < 15) continue;
        /* `h` IS THE HEIGHT IN METRES, and it is the key plantTrees reads.
           This said `s` and meant a scale, so every instance composed with
           `undefined * jitter` = NaN and all 51 trees in the chapter were
           garbage geometry — black shards, one clump of which stood in the
           film. The trees are normalised to height 1.0 at prep (v6.15), so
           the author's 0.85-1.35 spread is kept by scaling a real height. */
        spots.push({ x, z, h: 7.2 * (0.85 + hash(i, 17) * 0.5) });
      }
      treeStand = plantTrees(world, spots, { tint: 0xd8c9a4, shadow: !LOW, lowKeep: 0.45, roughness: 0.92 });
    }

    /* ------------------------------------------------------------- the cast */
    const CULL_SPHERE = {
      encik2:   { x: 0.015, y: 0.832, z: -0.037, r: 1.253 },
      admintee: { x: 0.067, y: 0.870, z: 0.011, r: 1.376 },
      botak:    { x: 0.041, y: 0.860, z: 0.020, r: 1.320 }
    };
    function wideBounds(root, key) {
      const d = CULL_SPHERE[key];
      root.traverse(o => {
        if (!o.isMesh) return;
        o.frustumCulled = true;
        if (!d || !o.isSkinnedMesh) return;
        const sp = new THREE.Sphere(new THREE.Vector3(d.x, d.y, d.z), d.r * 1.25);
        o.boundingSphere = sp.clone();
        if (o.geometry) o.geometry.boundingSphere = sp.clone();
      });
    }
    /* v14.1: ONE PARSE PER ASSET. `admintee` was GLTF-parsed twice — once for
       the storeman and once for the apron extra — so the chapter held two full
       copies of a 44.5k-triangle rig and its 2048 px sheets, and `cloneSkinned`
       sat destructured out of ctx and unused. Every rig now takes a CLONE and
       the parsed original is never added to the scene and never touched, which
       is the v9.1 law ("every copy is made before any is touched") in the form
       that cannot be got wrong: no copy is ever taken from a mutated one.
       SkeletonUtils.clone shares geometry and materials, so dispose()'s sweep
       over `world` still frees them. */
    const parsedGlb = new Map();
    function parseOnce(key) {
      if (!parsedGlb.has(key)) {
        parsedGlb.set(key, assetBytes(key).then(BUF => new Promise((res, rej) =>
          new GLTFLoader().parse(BUF, '', (gltf) => { rescueTextures(gltf, BUF); res(gltf); }, rej))));
      }
      return parsedGlb.get(key);
    }
    function mkRig(key, opts) {
      const group = new THREE.Group();
      group.position.set(opts.x, 0, opts.z); group.rotation.y = opts.ry || 0;
      world.add(group);
      const proxy = new THREE.Mesh(new THREE.CapsuleGeometry(0.2, opts.height - 0.4, 4, 8), matProxy);
      proxy.position.y = opts.height / 2; proxy.castShadow = !LOW; group.add(proxy);
      const rig = { key, group, proxy, model: null, mixer: null, acts: null, cur: null, head: null,
                    ready: false, height: opts.height, idle: opts.idle || null };
      rig.play = (name, ts = 1, fade = 0.34, once = false, at) => {
        if (!rig.mixer || !rig.acts || !rig.acts[name]) return false;
        if (rig.cur === name && at === undefined) return true;
        const nx = rig.acts[name], old = rig.cur && rig.cur !== name && rig.acts[rig.cur];
        nx.reset(); nx.setEffectiveTimeScale(ts); nx.setEffectiveWeight(1);
        nx.setLoop(once ? THREE.LoopOnce : THREE.LoopRepeat, Infinity);
        nx.clampWhenFinished = once;
        if (at !== undefined) {
          nx.play(); nx.time = nx.getClip().duration * at; nx.paused = true;
          for (const a of Object.values(rig.acts)) if (a !== nx) a.stop();
          rig.mixer.update(0);
        } else if (fade > 0) {
          nx.paused = false; nx.fadeIn(fade).play();
          if (old) old.fadeOut(fade);
        } else {
          nx.paused = false; nx.play();
          for (const a of Object.values(rig.acts)) if (a !== nx) a.stop();
          rig.mixer.update(0.0001);
        }
        rig.cur = name;
        return true;
      };
      parseOnce(key).then((gltf) => {
        if (!alive) return;
        const g = cloneSkinned(gltf.scene);
        g.traverse(o => { if (o.isMesh) { o.castShadow = !LOW; o.receiveShadow = false; } });
        wideBounds(g, key);
        group.add(g); rig.model = g;
        if (gltf.animations && gltf.animations.length) {
          rig.mixer = new THREE.AnimationMixer(g);
          rig.acts = {};
          for (const clip of gltf.animations) rig.acts[clip.name] = rig.mixer.clipAction(clip);
          /* v14.1: an idle may be PARKED on one frame (`at`, a fraction of the
             clip). The apron's second man was given `Walking` and played it at
             full rate standing still — a recruit marching for ever and going
             nowhere, in the middle of the chapter's only open space. 0.117 is
             e2c1's measured standing frame for this rig (v8.0): the feet
             closest together and the hands lowest. */
          if (opts.idle && rig.acts[opts.idle]) { rig.play(opts.idle, 1, 0, false, opts.at); rig.mixer.update(0.001); }
        }
        g.updateMatrixWorld(true);
        const v = new THREE.Vector3(); let lo = Infinity, hi = -Infinity, crown = false;
        g.traverse(o => {
          if (!o.isBone) return;
          o.getWorldPosition(v); lo = Math.min(lo, v.y); hi = Math.max(hi, v.y);
          if (/HeadTop_End/.test(o.name)) crown = true;
          if (HEAD_RE.test(o.name) && !rig.head) rig.head = o;
        });
        if (isFinite(lo) && hi > lo) {
          const span = (hi - lo) / (crown ? 1 : 0.935);
          const s = opts.height / span;
          g.scale.setScalar(s); g.updateMatrixWorld(true);
          let lo2 = Infinity;
          g.traverse(o => { if (o.isBone) { o.getWorldPosition(v); lo2 = Math.min(lo2, v.y); } });
          g.position.y += -(lo2 - group.position.y);
        }
        proxy.visible = false; rig.ready = true; redoShadows();
      }).catch(err => { console.warn(key + ' failed to load', err); rig.ready = true; });
      return rig;
    }

    const encik = mkRig('encik2', { x: ENC.x, z: ENC.z, ry: ENC.ry, height: 1.72, idle: 'Idle_9' });
    const ENC_TALK = ['Talk_with_Left_Hand_on_Hip', 'Talk_with_Left_Hand_Raised'];
    const putEncik = () => {
      encik.group.position.set(ENC.x, 0, ENC.z); encik.group.rotation.y = ENC.ry;
      if (encik.acts && encik.idle) encik.play(encik.idle, 1, 0);
    };

    /* THE STOREMAN behind the armskote grille. v14.1: he stood at z 8.40,
       which is the BACK plane of the block — outside the building, with 0.9 m
       of concrete between him and the player. He is in the recess now, 0.55 m
       behind the hatch and 0.31 m off its back panel, so he reads from the
       chest up over the counter, which is what a man behind a counter looks
       like. And the two men on the apron: the first stood inside the third
       parked truck (its padded box runs x -8.30..-6.10, z -7.70..-3.10). */
    const storeman = mkRig('admintee', { x: ARMS.x + 0.2, z: ARMS.z + 1.15, ry: Math.PI, height: 1.70, idle: 'Idle_9' });
    /* v14.1: photographed at t=9 and t=12, the first man's shoulder and arm
       filled the right of the frame — the shot-2 camera passes 1.2 m from
       where he stood. Both are out on the line now, 5-8 m from the lens,
       which is where "men crossing" reads as men crossing. */
    const EXTRA = [{ x: -2.0, z: -4.2, ry: -1.2, idle: 'Idle_9', key: 'admintee' },
                   { x: 1.2, z: -5.2, ry: 2.1, idle: 'Walking', at: 0.117, key: 'botak' }];
    const extras = EXTRA.map((p) => mkRig(p.key,
      { x: p.x, z: p.z, ry: p.ry, height: 1.70, idle: p.idle, at: p.at }));

    /* ----------------------------------------------------------- the pile
       THE ENCIK IS THE PILE: walk up, act, four choices. Offered only once
       the kit is clear and the turn has come. */
    const PILE_POS = new THREE.Vector3(ENC.x, 0, ENC.z);
    const INTERACT_R = 2.6;
    const pile = new THREE.Group(); pile.position.copy(PILE_POS); world.add(pile);
    const pileRing = new THREE.Mesh(
      new THREE.RingGeometry(0.55, 0.70, 24),
      new THREE.MeshBasicMaterial({ color: 0x63d6c8, transparent: true, opacity: 0,
        side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false, fog: false }));
    pileRing.rotation.x = -Math.PI / 2; pileRing.position.y = 0.02; pileRing.visible = false;
    pile.add(pileRing);
    const _ndc = new THREE.Vector3();
    const syncCamera = () => { camera.updateWorldMatrix(true, false); camera.matrixWorldInverse.copy(camera.matrixWorld).invert(); };
    function pileDist() { return Math.hypot(yaw.position.x - PILE_POS.x, yaw.position.z - PILE_POS.z); }
    function pileScreen() { syncCamera(); return _ndc.set(PILE_POS.x, 1.45, PILE_POS.z).project(camera); }
    function pileLive() { return phase === 'spot' || phase === 'decide'; }
    function pileInView() {
      if (!pileLive()) return false;
      if (pileDist() < 1.5) return true;
      const n = pileScreen();
      return n.z < 1 && Math.abs(n.x) < 0.97 && Math.abs(n.y) < 0.97;
    }
    function pointerHitsPile(cx, cy) {
      if (!pileLive() || pileDist() > INTERACT_R) return false;
      const n = pileScreen();
      if (n.z > 1) return false;
      const sx = (n.x * 0.5 + 0.5) * innerWidth, sy = (-n.y * 0.5 + 0.5) * innerHeight;
      return Math.hypot(cx - sx, cy - sy) < Math.min(innerWidth, innerHeight) * 0.16;
    }
    function interactPile() {
      if (getState() !== 'play' || pileDist() >= INTERACT_R) return false;
      if (phase === 'spot') { beginTalk(); return true; }
      if (phase === 'decide') { startDecision(); return true; }
      return false;
    }

    /* ---------------------------------------------------------- the clock
       Four phases: `clear` (the three counters, in any order), `spot` (walk
       to him), `talk` (the exchange, rooted), `decide`. What has been handed
       in is DERIVED FROM THE BAG wherever it can be (the v11.6 law), so a
       resume lands on the right count whatever was saved. */
    let phase = 'clear';
    let booted = false;
    const dayClock = { t: 0 };
    let lastWall = 0;
    const todo = [];
    function after(secs, fn) { todo.push({ at: dayClock.t + secs, fn }); todo.sort((a, b) => a.at - b.at); }
    function runTodo() { while (todo.length && todo[0].at <= dayClock.t) todo.shift().fn(); }
    function dropTodo() { todo.length = 0; }
    const done = new Set();                       // 'arms' | 'stores' | 'office'

    const speak = { until: 0, pending: null };
    function speakReset() { speak.until = 0; speak.pending = null; }
    function sayLine(name, vol = 1, onStart) {
      if (!worldSfx) return false;
      if (dayClock.t < speak.until) return false;
      const start = () => { speak.until = dayClock.t + (SECS[name] || 2.5) + 0.25; if (onStart) onStart(); };
      if (worldSfx(name, vol)) { start(); return true; }
      speak.pending = { name, vol, start, give: dayClock.t + 3 };
      speak.until = dayClock.t + 0.2;
      return true;
    }
    function runSpeak() {
      const q = speak.pending;
      if (!q || dayClock.t < speak.until) return;
      if (dayClock.t > q.give) { speak.pending = null; return; }
      if (worldSfx(q.name, q.vol)) { speak.pending = null; q.start(); }
      else speak.until = dayClock.t + 0.2;
    }
    /* A QUEUE OF LINES, each waiting for the one before it (the v9.5
       count-off's shape): `sayLine` refuses a line while another speaks, and
       on a one-frame-a-second box several `after` slots flush in one tick, so
       a conversation laid out by hand would lose its middle and report
       nothing. */
    const lineQ = [];
    function queueLine(name, onStart) { lineQ.push({ name, onStart }); }
    function queueFn(fn) { lineQ.push({ fn }); }
    function queueGap(secs) { lineQ.push({ gap: secs }); }
    function runQueue() {
      if (!lineQ.length || speak.pending || dayClock.t < speak.until) return;
      const q = lineQ[0];
      if (q.fn) { lineQ.shift(); q.fn(); return; }
      if (q.gap) { lineQ.shift(); speak.until = dayClock.t + q.gap; return; }
      lineQ.shift();
      sayLine(q.name, 1, q.onStart);
    }
    if (warmSounds) warmSounds(['n5hi', 'e5hi', 'n5ord', 'e5ord', 'e5turn',
                                'c5arms', 'c5store', 'c5form',
                                'riflerack', 'armsdoor', 'storecount', 'storedesk', 'platoonmarch']);

    /* A PLATOON GOES PAST, now and then, somewhere else in the camp. It is an
       EVENT on the chapter's own deterministic stream, and `reset()` clears
       it (the v8.1/v9.2 law). No march during the conversation: two men
       talking is the whole chapter. */
    let marchAt = 0, marchSeed = 0, marchN = 0;
    function marchBook(first) {
      if (!first) marchN++;
      const r = hash(marchN, 71 + marchSeed);
      marchAt = dayClock.t + (first ? 14 + 14 * r : 48 + 40 * r);
    }
    function marchTick() {
      if (!marchAt) marchBook(true);
      if (dayClock.t < marchAt) return;
      if (phase === 'spot' || phase === 'talk' || phase === 'decide') { marchAt = dayClock.t + 12; return; }
      /* v14.2: AND NOT WHEN HE IS ALMOST AT THE ENCIK. The phase gate above
         stops a pass-by STARTING during the talk, and cannot stop one
         already in flight — `platoonmarch` is a 16 s one-shot, so a pass-by
         begun a second before `spot` plays its whole tail over "Encik? Encik,
         it's me. Hawk Company.", which is the quiet two-man exchange the
         chapter is built on. There is no way to know the future, but there
         is a good proxy for it: a player within 8 m of him is about to speak
         to him. Holding off there closes almost the whole window, and costs
         nothing — the apron is 30 m across, so the pass-bys still run
         wherever the player actually spends the clearance. */
      if (pileDist() < 8.0) { marchAt = dayClock.t + 6; return; }
      /* v14.1: and the BOOKING follows the sound, not the other way round —
         `worldSfx` hands back null for a sample that has not decoded, so a
         pass-by that never played used to count as one and push the next
         one a minute out. `marchN` now means "passes heard", as it does in
         e2c1 (v9.2). */
      if (worldSfx && worldSfx('platoonmarch', 0.30)) marchBook(false);
      else marchAt = dayClock.t + 1.5;
    }

    function setPhase(p) {
      phase = p;
      if (!kit) return;
      kit.setPhase(p === 'clear' ? 'clear:' + [...done].join(',') : p);
    }
    function objClear() {
      if (!kit) return;
      kit.objective(DATA.words.objClear.replace('{n}', String(done.size)));
      const next = !done.has('arms') ? ARMS : !done.has('stores') ? STORES : OFFICE;
      /* v14.1: the office has a BENCH outside it (mkCounter's `office` branch,
         local (0.4, -1.15), a 1.5 x 0.34 solid) and the diamond was planted
         inside its blocker — a waypoint on a spot nobody can stand on. */
      kit.waypoint(next === OFFICE ? { x: next.x - 1.5, y: 1.2, z: next.z - 1.3 }
                                   : { x: next.x, y: 1.2, z: next.z - 1.3 });
    }
    function objEncik() {
      if (!kit) return;
      kit.objective(DATA.words.objEncik);
      kit.waypoint({ x: ENC.x - 0.9, y: 1.2, z: ENC.z - 1.0 });
    }
    /* Each counter banks its own note, and the NOTE IS THE RECEIPT (v7.3) —
       `kit.conduct` dedupes on it, so a resume can never pay twice. */
    function handIn(id, item, line, snd) {
      if (done.has(id)) return false;
      if (kit && item && kit.has && kit.has(item)) kit.take(item);
      done.add(id);
      if (worldSfx && snd) worldSfx(snd, 0.9);
      if (id === 'arms' && worldSfx) after(1.1, () => worldSfx('armsdoor', 0.7));
      /* v14.1: QUEUED, not said. `sayLine` REFUSES a line while another is
         still playing and hands back false, and this ignored it — so on the
         natural left-to-right route the armskote's 5.04 s line was still
         running when the player reached the stores counter two seconds later
         and `c5store` was dropped on the floor with no error. The queue is
         the one the conversation already uses (the v9.5 count-off's shape):
         a held line lands as soon as the mouth is free, which reads as the
         previous clerk finishing behind your shoulder. */
      queueLine(line);
      if (kit) kit.conduct({ note: CLEAR_NOTE[id], s: 0, a: 0 });
      setPhase('clear');
      if (done.size >= 3) {
        /* the one award, and ITS OWN NOTE IS THE RECEIPT (v7.3): a resume
           that re-runs this can never pay it twice, because kitConduct
           refuses a note the card already carries */
        if (kit) kit.conduct({ note: 'Cleared your kit before you spoke to him.', s: 4, a: 4 });
        setPhase('spot'); objEncik();
      } else objClear();
      return true;
    }
    const CLEAR_NOTE = {
      arms:   'Handed your rifle back.',
      stores: 'Handed your torch back.',
      office: 'Signed your clearance.'
    };

    /* --------------------------------------------------------- the talk
       Not a cutscene: a scripted exchange IN PLAY, so the player is inside
       it and can look at his face. `kit.root` holds him where he stands —
       he is in a conversation, which is what root is for. */
    function encTalk(take, secs) {
      encik.play(take, 1, 0.3);
      after(secs + 0.2, () => { if (encik.cur === take) encik.play('Idle_9', 1, 0.4); });
    }
    function beginTalk() {
      if (phase !== 'spot') return;
      setPhase('talk');
      if (kit) { kit.root(true); kit.objective(''); kit.waypoint(null); }
      /* v14.1: the queue is NOT emptied here. It used to be, and the only
         thing that can be in it at this point is a clerk line the player
         walked away from — binning it is the very bug the queue was added
         to fix. `beginTalk` can only run once (it returns unless the phase
         is `spot`, and sets `talk` on its first line), so nothing stale can
         be carried in. */
      queueLine('n5hi');
      queueGap(0.35);
      queueLine('e5hi', () => encTalk(ENC_TALK[0], SECS.e5hi));
      queueGap(0.5);
      queueLine('n5ord');
      queueGap(0.3);
      queueLine('e5ord', () => encTalk(ENC_TALK[0], SECS.e5ord));
      queueGap(1.4);                                   // the beat before he turns it
      queueLine('e5turn', () => encTalk(ENC_TALK[1], SECS.e5turn));
      queueGap(1.1);                                   // and the beat after: nothing, the camp carrying on
      queueFn(() => {
        setPhase('decide');
        if (kit) kit.root(false);
        startDecision();                               // it opens by itself (e2c3's precedent)
      });
    }
    function applyPhase(p) {
      done.clear();
      /* THE PHASE STRING IS THE RECEIPT. setPhase writes `clear:` plus the
         list every time a counter is done, so it already names exactly what
         has been handed in — and it is the ONLY thing that can, because the
         office form is not an item and the bag can never account for it.
         THE BAG IS NEVER READ AS A RECEIPT. It was, and it was wrong in
         exactly the case that matters most: on the first frame of a fresh
         run nothing has issued anything yet, so an empty bag read as two
         counters already handed in, the phase string was rewritten to say
         so, and the arms and stores hotspots were dead for the whole
         chapter. An empty bag means "he has not been given his kit", never
         "he has handed it in". */
      if (typeof p === 'string' && p.startsWith('clear:')) {
        for (const id of p.slice(6).split(',')) if (CLEAR_NOTE[id]) done.add(id);
      }
      /* AND THE BAG IS MADE TO MATCH IT, both ways: he carries whatever he
         has not yet handed in and nothing he has. That is what ISSUES his
         kit on the first frame of a fresh run, where nothing has called
         reset() and the bag arrives empty. */
      if (kit && kit.has && kit.give && kit.take) {
        for (const [id, item] of [['arms', 'rifle'], ['stores', 'torch']]) {
          const want = !done.has(id) && p !== 'talk' && p !== 'decide' && p !== 'spot';
          if (want && !kit.has(item)) kit.give(item);
          if (!want && kit.has(item)) kit.take(item);
        }
        /* v14.1: `kit.give` starts the bag button's equip pulse, which is
           right for a torch a chapter OFFERS (e2c3) and wrong for kit a
           chapter ISSUES so it can be handed back. It was telling the player
           to equip the two things he is here to get rid of. */
        if (kit.urge) kit.urge(null);
      }
      /* `spot` IS a receipt in itself: the phase is only ever set once all
         three counters are done, so a save that names it means the clearance
         is over even though the bag can only ever account for two of the
         three (the office form is not an item). Without this a resume taken
         after the clearance landed back in `clear` with the office still to
         do, and the player was sent to hand in a form he had already
         handed in. */
      if (p === 'talk' || p === 'decide' || p === 'spot' || done.size >= 3) {
        done.add('arms'); done.add('stores'); done.add('office');
        /* THE CONVERSATION IS SPENT on a resume: nobody hears the turn twice,
           and nobody is left standing rooted with no dialogue running. */
        if (p === 'talk' || p === 'decide') { setPhase('decide'); if (kit) { kit.root(false); kit.objective(DATA.words.objEncik); kit.waypoint({ x: ENC.x - 0.9, y: 1.2, z: ENC.z - 1.0 }); } return; }
        setPhase('spot'); objEncik(); return;
      }
      setPhase('clear'); objClear();
    }

    /* ------------------------------------------------------------ hotspots
       v14.1: THE ANCHORS SIT AT EYE HEIGHT, ON THE COUNTER. They used to sit
       0.7 m in FRONT of each counter at y 1.30 — which is z 6.20, the exact
       maxZ the chapter's own bounds stop the player at. So walking straight
       up to a counter, which is the only thing anyone does, put the anchor
       DIRECTLY UNDER THE LENS: `hotspotVisible` projects it to NDC and it
       left the frame, the badge went out, and the press fell through. This
       is the v7.5 law ("a doorway's floor point is 44 degrees under the lens
       from a metre away") met a second time. From the bound the anchor is
       now 0.70 m out and 0.07 m under the eye — dead ahead. */
    const hotspots = [
      { id: 'arms', pos: { x: ARMS.x, y: 1.55, z: ARMS.z }, radius: 2.4, prompt: DATA.words.hotArms,
        enabled: () => phase === 'clear' && !done.has('arms'),
        onInteract() { return handIn('arms', 'rifle', 'c5arms', 'riflerack'); } },
      { id: 'stores', pos: { x: STORES.x, y: 1.55, z: STORES.z }, radius: 2.4, prompt: DATA.words.hotStores,
        enabled: () => phase === 'clear' && !done.has('stores'),
        onInteract() { return handIn('stores', 'torch', 'c5store', 'storedesk'); } },
      { id: 'office', pos: { x: OFFICE.x, y: 1.55, z: OFFICE.z }, radius: 2.4, prompt: DATA.words.hotOffice,
        enabled: () => phase === 'clear' && !done.has('office'),
        onInteract() { return handIn('office', null, 'c5form', 'storecount'); } }
    ];

    /* ---------------------------------------------------------- per frame */
    function updateNotes(dt, t) {
      // the mixers run in every state (v5.19): a cutscene owns the poses, never the clocks
      if (encik.mixer && encik.group.visible) encik.mixer.update(dt);
      if (storeman.mixer && storeman.group.visible) storeman.mixer.update(dt);
      for (const e of extras) if (e.mixer && e.group.visible) e.mixer.update(dt);
      if (getState() !== 'play') { lastWall = 0; return; }
      // the chapter's clock runs on WALL time (v7.1's law), only in play
      const now = performance.now() / 1000;
      if (lastWall) dayClock.t += Math.min(0.5, now - lastWall);
      lastWall = now;
      if (!booted) { booted = true; applyPhase(kit ? kit.getPhase() : null); }
      runTodo(); runSpeak(); runQueue(); marchTick();
    }
    function updatePile(t) {
      if (getState() === 'cine') { pileRing.visible = false; return; }
      const on = pileLive();
      const near = THREE.MathUtils.clamp((8 - pileDist()) / (8 - INTERACT_R), 0, 1);
      pileRing.visible = on && near > 0.01;
      pileRing.material.opacity = near * (0.5 + 0.3 * Math.sin(t * 2.6));
    }
    function updateFire() {}
    function updateSlow() {}

    /* ---------------------------------------------------------- lifecycle */
    function snap() { return { cur: encik.cur, x: encik.group.position.x, z: encik.group.position.z, ry: encik.group.rotation.y }; }
    function restore(s) {
      putEncik();
      encik.group.visible = true;
      if (kit) kit.root(false);
    }
    function reset() {
      putEncik(); encik.group.visible = true;
      dropTodo(); speakReset(); lineQ.length = 0;
      done.clear(); booted = false; dayClock.t = 0; lastWall = 0;
      marchAt = 0; marchN = 0; marchSeed = (marchSeed + 1) % 97;
      if (kit) {
        kit.root(false);
        kit.daylight(null, 0); kit.presence(0);
        /* the kit goes back in the bag, so a replay has something to hand in
           (the v8.1 law, in the bag's form) */
        if (kit.give) { if (!kit.has('rifle')) kit.give('rifle'); if (!kit.has('torch')) kit.give('torch'); }
        if (kit.urge) kit.urge(null);
        kit.setPhase('clear:');
      }
      phase = 'clear';
    }
    function blockers() {
      const out = [];
      const b = (o, pad = 0.20) => { o.updateWorldMatrix(true, false); const bb = new THREE.Box3().setFromObject(o); bb.expandByScalar(pad); out.push(bb); };
      const solid = (o, pad = 0.14) => { o.updateWorldMatrix(true, false); const bb = new THREE.Box3().setFromObject(o); bb.expandByScalar(pad); bb.min.y = 0; bb.max.y = Math.max(bb.max.y, 1.40); out.push(bb); };
      for (const w of walls) b(w);
      for (const s of solids) solid(s);
      // the three counters are columns, so the player stops at them rather than in them
      for (const c of [ARMS, STORES, OFFICE]) {
        out.push(new THREE.Box3(new THREE.Vector3(c.x - 1.45, 0, c.z - 0.45),
                                new THREE.Vector3(c.x + 1.45, 1.40, c.z + 0.95)));
      }
      // the encik: nobody walks through him
      out.push(new THREE.Box3(new THREE.Vector3(ENC.x - 0.42, 0, ENC.z - 0.42),
                              new THREE.Vector3(ENC.x + 0.42, 1.8, ENC.z + 0.42)));
      // v14.1: nor through the two men on the line
      for (const e of EXTRA) out.push(new THREE.Box3(new THREE.Vector3(e.x - 0.40, 0, e.z - 0.40),
                                                     new THREE.Vector3(e.x + 0.40, 1.8, e.z + 0.40)));
      return out;
    }
    function dispose() {
      alive = false;
      if (treeStand) treeStand.userData.disposeTrees?.();   // BEFORE the sweep: the kit's maps are shared (v6.15)
      const geos = new Set(), mats = new Set();
      world.traverse(o => {
        if (o.geometry) geos.add(o.geometry);
        if (o.material) for (const m of (Array.isArray(o.material) ? o.material : [o.material])) mats.add(m);
      });
      scene.remove(world);
      for (const o of owned) { o.parent?.remove(o); o.dispose?.(); }
      owned.length = 0;
      encik.mixer?.stopAllAction();
      storeman.mixer?.stopAllAction();
      for (const e of extras) e.mixer?.stopAllAction();
      for (const g of geos) g.dispose();
      for (const m of mats) {
        for (const k of ['map', 'roughnessMap', 'normalMap', 'emissiveMap', 'alphaMap']) m[k]?.dispose?.();
        m.dispose();
      }
      for (const t of madeTex) t?.dispose?.();
      world.clear();
      S = null;
    }

    const readyAt = performance.now();
    return (S = {
      world, noteTex, blockers: blockers(),
      ready: () => encik.ready || performance.now() - readyAt > 12000,
      pile: { pos: PILE_POS, radius: INTERACT_R, group: pile,
              dist: pileDist, screen: pileScreen, inView: pileInView,
              hits: pointerHitsPile, interact: interactPile,
              glow: () => pileRing.material.opacity },
      // the engine's chapter-1 handles, unused here
      drum: null, ash: null, embers: null, heroNote: null, smoke: null, flying: null,
      jossTips: [], fireLight: null,
      get noteStorm() { return 1; },
      set noteStorm(v) {},
      // the chapter's own
      APRON, LINE, STORE, ARMS, STORES, OFFICE, ENC,
      encik, ENC_TALK, storeman, extras, putEncik,
      cArms, cStores, cOffice,
      sayLine, after, dayClock, done,
      get phase() { return phase; },
      setPhase, applyPhase, beginTalk,
      clearInfo: () => ({ phase, done: [...done], obj: kit && kit.getPhase ? kit.getPhase() : null }),
      speakInfo: () => ({ t: +dayClock.t.toFixed(2), until: +speak.until.toFixed(2),
                          pending: speak.pending ? speak.pending.name : null, queued: lineQ.length }),
      ambient: () => ({ marchAt: +marchAt.toFixed(1), marchN,
                        beds: DATA.ambience.beds.map(b => [b[0], +b[1].toFixed(3)]) }),
      hotspots,
      updateNotes, updatePile, updateFire, updateSlow,
      snap, restore, reset, dispose
    });
  }

  /* ------------------------------------------------------------- textures */
  function makeTarmac(THREE, cnv) {
    const [c, x] = cnv(256);
    // v14.1: a shade up. #3e4044 is about 6 % linear albedo, which under a
    // low sun is a black hole with white kerb lines painted on it.
    x.fillStyle = '#54565c'; x.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 9000; i++) {
      const g = 56 + Math.random() * 62;
      x.fillStyle = 'rgba(' + g + ',' + g + ',' + (g + 4) + ',0.5)';
      x.fillRect(Math.random() * 256, Math.random() * 256, 1.4, 1.4);
    }
    for (let i = 0; i < 16; i++) {
      x.strokeStyle = 'rgba(40,42,46,0.20)'; x.lineWidth = 1 + Math.random();
      x.beginPath(); x.moveTo(Math.random() * 256, Math.random() * 256);
      x.lineTo(Math.random() * 256, Math.random() * 256); x.stroke();
    }
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
    /* v14.1: 14 x 8 over a 32 m apron made each tile 2.3 m, so the 26 random
       strokes read from the player's own eye as scribbles a metre long. */
    t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(34, 18);
    return t;
  }
  function makeForm(THREE, cnv) {
    const [c, x] = cnv(128);
    x.fillStyle = '#efe9da'; x.fillRect(0, 0, 128, 128);
    x.fillStyle = '#2a3140'; x.fillRect(10, 12, 64, 6);
    x.fillStyle = '#6a7180';
    for (let i = 0; i < 9; i++) x.fillRect(10, 30 + i * 9, 100 - (i % 3) * 18, 3);
    x.strokeStyle = '#8a3020'; x.lineWidth = 2; x.strokeRect(70, 96, 46, 20);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
  }
  function makeNotice(THREE, cnv) {
    const [c, x] = cnv(128);
    x.fillStyle = '#7d6a4e'; x.fillRect(0, 0, 128, 128);
    for (let i = 0; i < 6; i++) {
      const w = 26 + Math.random() * 22, h = 22 + Math.random() * 18;
      x.fillStyle = ['#f2ece0', '#e8eef0', '#f6f0d8'][i % 3];
      x.fillRect(8 + (i % 3) * 40, 10 + Math.floor(i / 3) * 52, w, h);
      x.fillStyle = '#7b8290';
      for (let k = 0; k < 4; k++) x.fillRect(11 + (i % 3) * 40, 15 + Math.floor(i / 3) * 52 + k * 5, w - 8, 2);
    }
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
  }
  function makeShutter(THREE, cnv) {
    const [c, x] = cnv(128);
    x.fillStyle = '#9aa1a6'; x.fillRect(0, 0, 128, 128);
    for (let y = 0; y < 128; y += 8) {
      x.fillStyle = 'rgba(60,66,70,0.45)'; x.fillRect(0, y, 128, 2);
      x.fillStyle = 'rgba(220,226,230,0.28)'; x.fillRect(0, y + 3, 128, 2);
    }
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
    t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(3, 1);
    return t;
  }

  /* ------------------------------------------------------------- the film
     35 s, one set, no pocket. It ends ON THE RECOGNITION, so play opens with
     the encik already standing there and the player deciding when to walk
     over — Chad's "I took the chance to speak to him" is the player's to
     take. */
  function intro(c, s, api) {
    const { step, sfx, fade, camTo, yawTo, pitchTo, faceFrom, rawK, smoothK, stage, armR, kit } = api;
    const E = stage.ENC;

    const A = { x: -11.5, y: 1.80, z: -1.2 };          // the apron, wide
    /* v14.1: B was (-8.0, -3.6), which is INSIDE the third parked truck's
       footprint (x -8.3..-6.1, z -7.7..-3.1) — the shot skimmed 33 cm over
       a cargo deck and looked into a cab two metres away.
       v14.2: AND MOVING IT OUT IN Z ALONE WAS NOT ENOUGH. Photographed at
       t=9 from (-8.2, -1.9), the camera was clear of the footprint and the
       centre ray missed both the cargo roof and the cab — every number said
       it was fixed — and the frame still had the truck's flank filling its
       whole left half at 1.3 m, because x -8.2 sits INSIDE the truck's own
       x-slab, so the thing was beside the lens rather than in front of it.
       On a phone, which crops to the centre third, that is worse, not
       better: ~70 % of the frame width. The lens is clear of the row in X
       as well now, and the pan runs AWAY from it onto the two men, so the
       trucks are the receding row on the left they were dressed to be.
       A centre-ray miss is not a clear frame — photograph it (v6.17). */
    const B = { x: -6.4,  y: 1.70, z: -0.2 };          // clear of the parked row, looking down the line
    const C = { x: -2.0,  y: 1.45, z: 1.4 };           // the form, then the tilt to the stores
    const D = { x:  1.0,  y: 1.66, z: 0.6 };           // across the apron
    const D2 = { x: 3.6,  y: 1.66, z: 1.8 };           // the push-in

    step(0, () => {
      armR.visible = false;
      stage.putEncik();
      stage.encik.group.visible = true;
    });
    fade(0.0, 0.0, 1, 1);
    fade(0.55, 2.40, 1, 0);

    // 1 · the apron in the afternoon, a slow drift
    camTo(0.0, 8.6, A, { x: -9.4, y: 1.74, z: -0.4 }, rawK);
    yawTo(0.0, 8.6, faceFrom(A.x, A.z, 6.0, -1.0), faceFrom(-9.4, -0.4, 8.0, -0.6), rawK);
    pitchTo(0.0, 2.0, 0.10, 0.0, smoothK);
    sfx(0.85, 'n5pro1');                               // 3.08 s → 3.93

    // 2 · the company line, and two men out on the apron
    step(8.6, () => {});
    /* v14.1: and it PANS ALONG the line rather than into it. Photographed at
       t=9, the old start aimed 6 m dead into the block's face and filled the
       frame with balcony rail; it opens looking DOWN the company line with
       the parked row at the left edge, and sweeps 14 degrees onto the two
       men — away from the trucks, so they leave frame as the pan lands. */
    camTo(8.6, 13.0, B, { x: -3.8, y: 1.70, z: -0.5 }, rawK);
    yawTo(8.6, 13.0, faceFrom(B.x, B.z, -2.6, -6.2), faceFrom(-3.8, -0.5, 1.2, -5.2), rawK);
    sfx(4.60, 'n5pro2');                               // 7.55 s → 12.15

    // 3 · the clearance form in his hands, and the tilt up to the stores
    camTo(13.0, 19.4, C, { x: -0.6, y: 1.60, z: 2.2 }, smoothK);
    yawTo(13.0, 19.4, faceFrom(C.x, C.z, -1.4, 5.4), faceFrom(-0.6, 2.2, 0.6, 6.6), smoothK);
    /* v14.1: THE SIGN WAS INVERTED. `pitch.rotation.x` positive is looking
       UP (e2c3's torch-down beat is -0.80), so +0.55 opened this shot on
       31.5 degrees of empty sky and then tilted DOWN, the opposite of what
       its own comments said. It starts on the tarmac ahead of his boots —
       there is no form prop, because the film hides the hands at step 0 —
       and lifts to the block. */
    pitchTo(13.0, 15.4, -0.40, -0.36, smoothK);        // down, at the ground ahead
    pitchTo(15.6, 19.4, -0.36, 0.02, smoothK);         // and up to the block
    sfx(13.30, 'n5pro3');                              // 4.44 s → 17.74

    // 4 · across the apron: a figure by the stores block, and the push-in
    step(19.4, () => {});
    camTo(19.4, 28.6, D, D2, smoothK);
    yawTo(19.4, 28.6, faceFrom(D.x, D.z, E.x, E.z), faceFrom(D2.x, D2.z, E.x, E.z), smoothK);
    pitchTo(19.4, 22.0, 0.02, -0.02, smoothK);
    sfx(20.60, 'n5pro4');                              // 1.96 s → 22.56
    /* v14.1: and the camp carries on somewhere else while he looks at him.
       The last eleven seconds of this film were the room tone and nothing
       else, under a slow push-in; a platoon going past at the far end is the
       one sound this camp makes on its own, it is already in the chapter's
       pack and already warmed, and it costs nothing. */
    sfx(23.50, 'platoonmarch', 0.22);

    fade(29.4, 32.4, 0, 1);
    step(33.2, () => { armR.visible = true; });
    c.endFade = 1;
    /* v14.1: and THE BLACK STAYS. Every other intro in the game sets this
       and this one did not, so `cineEnd`'s `clearCineFade()` dissolved the
       film's own black and showed the apron for a beat under the chapter
       card. `playChapterCard`'s cover() clears the overlay once the card is
       opaque. */
    c.keepFade = true;
  }

  /* ------------------------------------------------------------ the scenes
     Each is the encik's full answer, and each answer is a DIFFERENT thing —
     a story, a confirmation, a correction, a reason. No scare in any of them,
     and no ghost anywhere: the figure that ran through chapters 1–4 is simply
     not in this chapter, and nothing says so.

     `n5close` — the closing teaching of the whole episode — is cued under the
     fade in all four, so it carries on UNDER THE OUTCOME CARD (e2c4's `n4dawn`
     shape) instead of adding eleven seconds to every scene. */

  const P = (s) => ({ x: s.yawPos.x, y: s.yawPos.y, z: s.yawPos.z });

  /* v14.1: A FIXED STANDOFF, not a fraction of wherever the player stopped.
     All four scenes framed the encik as `P0 + (E - P0) * k`, so the shot's
     distance was k times whatever the player happened to leave between
     himself and the man — anywhere from 0.75 m (pressed against his blocker)
     to 2.6 m (the edge of the interact radius). The same scene played as a
     medium two-shot or as a face filling the frame depending on where you
     stopped walking, and no framing decision in any of them could be trusted.
     This puts the lens a stated number of metres from him along the line the
     player is already on, so the ANGLE is still his approach and only the
     distance is the director's. e2c2's precedent. */
  function shot(P0, E, d, y = 1.62) {
    const dx = P0.x - E.x, dz = P0.z - E.z;
    const L = Math.hypot(dx, dz) || 1;
    return { x: E.x + dx / L * d, y, z: E.z + dz / L * d };
  }
  const IN = 1.55, WIDE = 2.40;

  /* his talk take rides his line. THE CUE ITSELF is always written as a
     literal quoted name in the scene — the engine finds a scene's cues by
     READING ITS SOURCE (`CUE_RE`), and a name passed through a helper is
     invisible to that scan, which at v10.0 left six encik lines undecoded on
     the first decision of a fresh load (v10.2). */
  function encTalk(stage, step, at, secs, take) {
    step(at, () => stage.encik.play(take, 1, 0.30));
    step(at + secs + 0.15, () => { if (stage.encik.cur === take) stage.encik.play('Idle_9', 1, 0.40); });
  }
  /* AND HE GOES. v14.1: this used to be one `step` that snapped him 66
     degrees in a single frame and left him standing there for the last three
     seconds of every scene — the comment promised "out of frame down the
     walkway" and he never took a pace. `encik2.glb` ships `Walking`, so he
     turns over 0.7 s and walks three metres in place while the group glides
     under him (the v5.07/v8.2 shape: play the take, glide the group), at
     1.15 m/s against the take's own ~1.38 m stride, which is why the rate is
     0.85. He leaves AWAY from the camera, so he never walks into the lens,
     and along the apron rather than into the block or the walkway pillars at
     z 5.70. `restore()`/`reset()` put him back — `putEncik` already did. */
  function encGo(stage, api, at, camX) {
    const { step, tr, rawK, smoothK } = api;
    const E = stage.ENC;
    const dir = camX <= E.x ? 1 : -1;
    const ry0 = E.ry, ry1 = dir > 0 ? Math.PI / 2 : -Math.PI / 2;
    let d = ry1 - ry0;
    while (d > Math.PI) d -= Math.PI * 2;
    while (d < -Math.PI) d += Math.PI * 2;
    step(at, () => { stage.encik.play('Walking', 0.85, 0.30); });
    tr(at, at + 0.70, k => { stage.encik.group.rotation.y = ry0 + d * k; }, smoothK);
    tr(at + 0.70, at + 3.30, k => { stage.encik.group.position.x = E.x + dir * 3.0 * k; }, rawK);
  }

  /* A · THE STORY (good) — the recruit in bed one, and the line that is the
     episode's teaching: the departed stay where their attachments are. */
  function scStory(c, s, api) {
    const { step, sfx, fade, camTo, yawTo, pitchTo, faceFrom, smoothK, stage, handsRoot } = api;
    const P0 = P(s), E = stage.ENC;
    const Y_E = faceFrom(P0.x, P0.z, E.x, E.z);
    step(0, () => { handsRoot.visible = false; });
    yawTo(0, 1.0, s.yawRot, Y_E, smoothK);
    pitchTo(0, 1.0, s.pitchX, 0.03, smoothK);

    sfx(0.55, 'n5askA');                                        // 2.04 → 2.59
    sfx(3.10, 'e5A1'); encTalk(stage, step, 3.10, 8.75, stage.ENC_TALK[0]);   // → 11.85
    // in on him for the story
    camTo(3.10, 12.4, P0, shot(P0, E, IN), smoothK);
    sfx(12.50, 'e5A2'); encTalk(stage, step, 12.50, 5.41, stage.ENC_TALK[1]); // → 17.91
    sfx(18.50, 'e5A3'); encTalk(stage, step, 18.50, 8.75, stage.ENC_TALK[0]); // → 27.25
    // and wider again for the attachment line, so the camp is around it
    camTo(27.0, 37.6, shot(P0, E, IN), shot(P0, E, WIDE, 1.66), smoothK);
    sfx(27.90, 'e5A4'); encTalk(stage, step, 27.90, 9.40, stage.ENC_TALK[1]); // → 37.30  · the teaching
    /* v14.1: THE CLOSING THEME IS 44 SECONDS LONG AND IT WAS CUED 0.2 s
       BEFORE THE FADE. Every cue a scene fires joins `cineVoices`, and
       `cineEnd`'s `stopCineVoices` keeps only the sources in `liveVoices` —
       the voice takes — so the theme that closes the whole episode was
       ramped out 3.4 s after it started, in three of the four endings, and
       was never cued at all in the fourth. It comes in under his last
       answer now, where the bed is what a closing theme is for, and hands
       over to `n5close` and the card. Measured flat at about -24 dBFS RMS
       for its first 36 s, so there is no swell to miss and nothing to
       re-cut; at 0.75 under the v5.27 duck it sits ~17 dB below the cast. */
    sfx(34.20, 'e5theme', 0.75);
    sfx(38.10, 'e5A5'); encTalk(stage, step, 38.10, 5.56, stage.ENC_TALK[0]); // → 43.66
    encGo(stage, api, 44.2, P0.x);
    sfx(45.10, 'n5close');                                      // runs on under the card
    fade(44.8, 47.4, 0, 1);
    step(48.0, () => { handsRoot.visible = true; });
    c.endFade = 1;
  }

  /* B · THE CONFIRMATION (best) — he says it first, and the encik tells him
     the whole of it because he has earned it. */
  function scLetGo(c, s, api) {
    const { step, sfx, fade, camTo, yawTo, pitchTo, faceFrom, smoothK, stage, handsRoot } = api;
    const P0 = P(s), E = stage.ENC;
    const Y_E = faceFrom(P0.x, P0.z, E.x, E.z);
    step(0, () => { handsRoot.visible = false; });
    yawTo(0, 1.0, s.yawRot, Y_E, smoothK);
    pitchTo(0, 1.0, s.pitchX, 0.03, smoothK);

    sfx(0.55, 'n5askB');                                        // 1.72 → 2.27
    sfx(2.90, 'e5B1'); encTalk(stage, step, 2.90, 1.65, stage.ENC_TALK[0]);   // → 4.55
    camTo(2.90, 18.0, P0, shot(P0, E, IN), smoothK);
    sfx(5.20, 'e5B2'); encTalk(stage, step, 5.20, 12.36, stage.ENC_TALK[1]);  // → 17.56
    sfx(18.20, 'e5B3'); encTalk(stage, step, 18.20, 7.71, stage.ENC_TALK[0]); // → 25.91
    camTo(25.8, 32.6, shot(P0, E, IN), shot(P0, E, WIDE, 1.66), smoothK);
    sfx(24.00, 'e5theme', 0.75);                                // the close, under his last answer
    sfx(26.60, 'e5B4'); encTalk(stage, step, 26.60, 4.52, stage.ENC_TALK[1]); // → 31.12  · quiet, first time in years
    encGo(stage, api, 31.9, P0.x);
    sfx(32.70, 'n5close');
    fade(32.4, 35.0, 0, 1);
    step(35.6, () => { handsRoot.visible = true; });
    c.endFade = 1;
  }

  /* C · THE ONE LINE (worst) — he brushes it off, and the encik does not
     answer that. One sentence, and he goes. The shortest scene in the
     episode, by design. */
  function scStress(c, s, api) {
    const { step, sfx, fade, camTo, yawTo, pitchTo, faceFrom, smoothK, stage, handsRoot } = api;
    const P0 = P(s), E = stage.ENC;
    const Y_E = faceFrom(P0.x, P0.z, E.x, E.z);
    step(0, () => { handsRoot.visible = false; });
    yawTo(0, 1.0, s.yawRot, Y_E, smoothK);
    pitchTo(0, 1.0, s.pitchX, 0.03, smoothK);

    sfx(0.55, 'n5askC');                                        // 1.96 → 2.51
    // a beat of nothing: he does not answer that straight away
    camTo(2.6, 12.4, P0, shot(P0, E, 1.75), smoothK);
    sfx(3.60, 'e5C'); encTalk(stage, step, 3.60, 8.12, stage.ENC_TALK[0]);    // → 11.72
    /* v14.1: and THIS scene had no `e5theme` at all — a player who picks the
       worst option was the one player who reached the end of the episode
       with no music under it. */
    sfx(7.40, 'e5theme', 0.75);
    encGo(stage, api, 12.5, P0.x);
    sfx(13.00, 'n5close');
    fade(12.8, 15.2, 0, 1);
    step(15.8, () => { handsRoot.visible = true; });
    c.endFade = 1;
  }

  /* D · THE REASON (bad) — he asks to be owed an answer, and gets one: the
     boy the encik told once, and what it cost him. */
  function scWhy(c, s, api) {
    const { step, sfx, fade, camTo, yawTo, pitchTo, faceFrom, smoothK, stage, handsRoot } = api;
    const P0 = P(s), E = stage.ENC;
    const Y_E = faceFrom(P0.x, P0.z, E.x, E.z);
    step(0, () => { handsRoot.visible = false; });
    yawTo(0, 1.0, s.yawRot, Y_E, smoothK);
    pitchTo(0, 1.0, s.pitchX, 0.03, smoothK);

    sfx(0.55, 'n5askD');                                        // 2.04 → 2.59
    sfx(3.10, 'e5D1'); encTalk(stage, step, 3.10, 10.42, stage.ENC_TALK[1]);  // → 13.52
    camTo(3.10, 14.2, P0, shot(P0, E, IN), smoothK);
    sfx(14.30, 'e5D2'); encTalk(stage, step, 14.30, 4.52, stage.ENC_TALK[0]); // → 18.82
    camTo(19.0, 27.4, shot(P0, E, IN), shot(P0, E, WIDE, 1.66), smoothK);
    sfx(18.00, 'e5theme', 0.75);                                // the close, under his last answer
    sfx(19.50, 'e5D3'); encTalk(stage, step, 19.50, 7.00, stage.ENC_TALK[1]); // → 26.50
    encGo(stage, api, 27.2, P0.x);
    sfx(28.00, 'n5close');
    fade(27.7, 30.3, 0, 1);
    step(30.9, () => { handsRoot.visible = true; });
    c.endFade = 1;
  }

  (window.__CHAPTERS__ = window.__CHAPTERS__ || {}).e2c5 = Object.assign(DATA, {
    build,
    intro,
    scenes: [scStory, scLetGo, scStress, scWhy]
  });
})();
