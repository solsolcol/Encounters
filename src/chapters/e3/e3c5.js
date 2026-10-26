/* Episode 3 · Chapter 5 · "The Children On My Altar"
   ---------------------------------------------------------------------------
   THE FIFTH AND LAST CHAPTER OF CASE FILE 3, "How It All Began" — S1·10,
   "Opening Myself To My Own Kumanthong". While he was still searching for
   answers he began keeping Kumanthong; one night he deliberately opened
   himself to his own, one after another, and each one took him over in its
   own way.

   THE PURPOSE (Chad, 25 Oct 2026 — every line here is held to it): to clear
   the misconception that Kumanthong are yin baby spirits. Those given a home
   at a temple are kept out of compassion — children with nowhere to go,
   believed to help a kind keeper a little while the merit made for them
   carries them on toward a better birth. Keeping them is a promise for life:
   water, a drink, incense and merit, every day; never for greed; never asked
   for anything wrong. They are felt for, never feared. "This is not just
   cheap horror entertainment and jump scare." (docs/V23.0-E3C5-PLAN.md §2.4
   to §2.7.)

   THREE WORLDS (the far plane is 160 m, v8.9: none is ever drawn from another):
   - WORLD R, x 0: his room at night, the altar under the window and the three
     on it — where he cares for them, and where he opens himself to them.
   - WORLD S, x +250: the Golden Mile owner's shop after closing (chapter 4's
     World H, by its own code) — the opening film, the counter where he meets
     them and makes his promise (play), and the epilogue.
   - WORLD M, x −250: a temple — its hall by candlelight (the counter's film
     M) and at first light (ending D). Seen only in films.

   PREVIEW (the forty-second seam): until its sound is recorded (CP11) the
   chapter declares `preview` — registered, out of the run, opened only by a
   ?ch=e3c5 link; its planned sounds are named in `plannedSounds` and stay
   silent until then.

   docs/V23.0-E3C5-PLAN.md is the build's memory, checkpoint by checkpoint. */

(() => {
  'use strict';

  let S = null;

  /* ---------------------------------------------------- the light presets
     The room's light is ALL presets and painted glows — never a new light
     (v15.1: a light count changed on screen builds shaders on screen). Five
     stops each, so the sky tweens between any two (chapter 4's shape). CP4
     and CP5 tune them by photograph; §10.2 lists the rest to come. */
  const SHOP_EVE = {                // WORLD S after hours: half the shop's tubes on, the corridor dimmer
    stops: [[0.00, '#3a3a3e'], [0.12, '#333338'], [0.35, '#2c2c31'], [0.65, '#25252a'], [1.00, '#1e1e22']],
    bg: 0x1e1e22, fog: [0x26262a, 0.006],
    hemi: [0xf4ecdc, 0x4a4036, 0.78], key: [0xfff0d8, 0.62, 2, 8, 4], fill: [0xc8d4f0, 0.24],
    stars: 0, moon: 0, sun: 0, clouds: 0,
    vmHemi: [0xf4ecdc, 0x4a4036, 0.85], vmKey: [0xfff0d8, 0.66]
  };
  const NIGHT = {                   // WORLD R at 22:50: the desk lamp on, the city through the window
    stops: [[0.00, '#141c30'], [0.12, '#10182a'], [0.35, '#0c1222'], [0.65, '#080c18'], [1.00, '#04060e']],
    bg: 0x060a14, fog: [0x060a14, 0.0004],
    hemi: [0xc8bcae, 0x1a1418, 0.55], key: [0xffc890, 0.55, -2, 3, -1], fill: [0x8a9ad0, 0.16],
    stars: 0, moon: 0, sun: 0, clouds: 0,
    vmHemi: [0xc8b8a0, 0x1a1418, 0.6], vmKey: [0xffc888, 0.55]
  };

  const DATA = {
    id: 5,
    episode: 3,
    title: 'The Children On My Altar',
    cardLabel: 'Chapter 5',
    cardTitle: 'The Children On My Altar',
    brief: 'Months into your search, the amulet shop owner at Golden Mile asks you to come by after closing. He has three Kumanthong he wants you to meet, and taking them in would be a promise for life.',
    prompt: 'Almost three in the morning. The three are quiet again. You know now what each of them never had, and you promised to look after them for life. What do you do?',
    /* four different KINDS of answer (v21.30; §4.7): to stay inside them, to tell the world, to keep them for what
       they give, to keep caring with his own door shut */
    choices: [
      { k: 'A', text: 'Open yourself to them again — and stay as long as they want.',
        d: { sanity: -18, awareness: -9, wisdom: -27 }, verdict: 'worst', critical: true,
        say: 'I promised to look after them. In the end, there was no one left to do it.',
        teach: 'Loving them is not becoming them. Even with no ill intent on either side, Kumanthong are regarded in traditional belief as Yin while a living person carries Yang, and immersing yourself in them again and again wears away your own balance. Once you are lost, the care and the merit you promised them stop.' },
      { k: 'B', text: 'Post it all on the amulet forum — let everyone know it\'s real.',
        d: { sanity: -9, awareness: 6, wisdom: -12 }, verdict: 'bad',
        say: 'They were children, not a horror story. I showed strangers the way in.',
        teach: 'They are children, not a horror story. You do not need possession, trance or dramatic manifestations to prove a spiritual connection. Told as a thrill, a dangerous experiment becomes an invitation, and strangers take one in without knowing what it asks of them.' },
      { k: 'C', text: 'Talk to them every day — and wish for everything you want.',
        d: { sanity: -15, awareness: -6, wisdom: -18 }, verdict: 'bad',
        say: 'I stopped giving to them. I only kept asking.',
        teach: 'Do not be driven by greed. Kumanthong kept with compassion are kept first for their sake; whatever help they give is a gift, not a wage, and the ones from a temple are believed never to help with anything wrong. Kept for wealth, care turns into a bargain, and the wanting never stops.' },
      { k: 'D', text: 'Keep caring for them — but never open yourself to them again.',
        d: { sanity: 15, awareness: 24, wisdom: 30 }, verdict: 'best',
        say: 'I kept my promise every day, and I kept my own door shut.',
        teach: 'This is loving kindness: you care for them every day, you make merit in their names, and you ask for nothing back, for as long as you live. That merit, it is believed, is what helps them on toward a better birth. Treat the tradition with respect, and stay in control of yourself.' }
    ],
    /* Chad's purpose first, then S1·10's own lesson; the second person; no Pali tag (§2.3 9); its beliefs said as
       beliefs (§2.7) */
    core: 'Kumanthong given a home at a temple are not the trapped, blood-fed spirits of frightening stories. Kept well, they are kept out of compassion: children with nowhere to go, believed to help a kind keeper a little and to be carried toward a better birth by the merit he makes for them. Never keep one for greed or ask one for anything wrong. Take one in only if you can care for it, and make merit for it, for life — and never invite one to enter or take control of you.',

    /* S42: registered, out of the run, until its sound is recorded (CP11 takes this out) */
    preview: true,

    /* units metres, y up. WORLD R (x 0): the room x −1.6…1.6, z −1.8 (the desk wall) … 1.8 (the door wall), the
       window and the altar on the right wall (x 1.6). WORLD S (x +250): chapter 4's World H by its own numbers under
       a group offset — the shop x −4.5…4.5, z −7…0, the corridor z 0…5, the owner's counter along x 2.9…3.5.
       WORLD M (x −250): seen only in films. Play begins at the counter's front, facing the owner (rev 4). */
    spawn:     { x: 250 + 2.30, y: 1.62, z: -2.45, rot: -Math.PI / 2 },
    shrine:    { x: 1.41, z: 0.40 },          // the engine's anchor (ghost: null): the altar under the window
    ghostHome: { x: 1.41, z: 0.40 },
    bounds:    { minX: -262, maxX: 262, minZ: -10, maxZ: 8 },

    /* NO HAUNTING (the eleventh leak): nothing hunts him — he opens the door himself */
    ghost: null,
    fireLight: null,
    daylight: SHOP_EVE,                      // the world the chapter begins in; the room's NIGHT is a tween away

    /* the three kumanthong (CP1: one file each, a near and a far level over the same vertices); CP4 and CP5 add the
       room's and the shop's, and the temple's */
    assets: ['kumanred', 'kumanshy', 'kumanlittle'],
    items: [],

    musicVol: 0,
    /* the beds arrive with the sound (CP11): k5shopair and k5mall at the counter, k5nightbed and k5fan in the room,
       k5deep, k5dawnbed, k5under (§9.3) */
    ambience: { beds: [] },
    voiceLine: null,

    /* the sounds the chapter is written against and that are not recorded yet (§9.2–§9.4) — a preview chapter may
       cue them (chaptertest), and each plays nothing until it has a file; CP11 empties this list */
    plannedSounds: [
      // the opening film, the counter, the home film
      'k5bundle', 'k5figset', 'k5bellsfaint', 'k5wind', 'k5pen', 'k5chantlow', 'k5door', 'k5switch', 'k5unwrap', 'k5rain',
      'k5shutter', 'k5shopbell',
      // the offerings
      'k5bag', 'k5bottleout', 'k5ratchet', 'k5stiff', 'k5seal', 'k5hiss', 'k5capoff', 'k5foam', 'k5tear', 'k5slide',
      'k5bubbles', 'k5plip', 'k5bend', 'k5set', 'k5spark', 'k5flick', 'k5catch', 'k5wave', 'k5sand', 'k5wai',
      // the openings and the three possessions
      'k5loosen', 'k5glint', 'k5rise', 'k5enter', 'k5enter2', 'k5leave', 'k5leave2',
      'k5stamp', 'k5rattle', 'k5thud', 'k5slurp', 'k5slam', 'k5bump',
      'k5scurry', 'k5giggle', 'k5peek', 'k5scuttle', 'k5coin', 'k5bonk',
      'k5bells', 'k5hair', 'k5tick', 'k5pull', 'k5surface',
      // the endings
      'k5calm', 'k5koel', 'k5window', 'k5doorbell', 'k5buzz', 'k5wake', 'k5type', 'k5post', 'k5ping', 'k5scroll', 'k5dm',
      'k5delete', 'k5tape', 'k5slip', 'k5pin', 'k5crumple', 'k5tbell', 'k5pour', 'k5ground', 'k5lights',
      // the beds
      'k5nightbed', 'k5deep', 'k5dawnbed', 'k5under', 'k5fan', 'k5shopair', 'k5mall',
      // the music: one lullaby, told five ways
      'k5lullaby', 'k5theme', 'k5care', 'k5night', 'k5red', 'k5shy', 'k5lonely', 'k5climb', 'k5after',
      'k5endA', 'k5endB', 'k5endC', 'k5endD', 'k5epi'
    ],

    words: {
      approach: '',                          // no floating label (v12.5): the orders name what to do
      act: 'E to act',
      actTouch: 'Tap to act',
      interact: 'E to choose what you do',
      interactTouch: 'Tap to choose what you do',
      actLine: 'Press E to choose what you do',
      actLineTouch: 'Tap to choose what you do',
      // THE COUNTER (rev 4)
      objLookBundle: 'Look at what he has brought out',
      objMeet: 'Meet each of them · {n}/3',
      objCard: 'Read his card',
      objPromise: 'Give him your promise',
      objTake: 'Take them home',
      hotBundle: 'What he has brought out',
      hotRed: 'The red one',
      hotShy: 'The shy one',
      hotLittle: 'The little one',
      hotCard: 'His card',
      hotPromise: 'I promise',
      hotBag: 'Take them home',
      // THE ROOM
      objSit: 'Sit with them',
      hotMat: 'Sit with them'
    },
    sayPrefix: 'z5'
  };

  /* every line's length — the plan's ESTIMATE until CP11 measures the takes (the registry's `est` rows); the line
     queue books its window by it, so a voice never starts over another. The names are QUOTED on purpose: build.py
     gives a sound to a chapter's own pack only when the chapter names it in quotes (v21.1) */
  const SECS = {
    /* the opening film, the counter, the home film */ 'z5pro1': 4.6, 'z5yinq': 8.5, 'z5children': 2.6, 'z5promise': 2.0,
      'z5pro2': 4.4, 'z5pro3': 4.2, 'z5pro4': 6.0,
      'ow5hello': 4.2, 'ow5yin': 15.0, 'ow5monk': 17.5, 'ow5red': 8.0, 'ow5shy': 8.5, 'ow5little': 5.5, 'ow5give': 10.0,
      'ow5never': 8.5, 'ow5wrong': 11.5, 'ow5promise': 16.0, 'ow5careful': 4.5,
    /* the offerings */ 'z5water': 2.4, 'z5bag': 4.6, 'z5red': 2.8, 'z5shy': 2.4, 'z5little': 2.4, 'z5stiff': 1.6, 'z5incense': 1.4,
      'z5eat': 3.0, 'z5dedic': 5.0,
    /* the question and the openings */ 'z5wonder': 3.6, 'z5ask': 5.5, 'z5loose': 2.4,
    /* the red one */ 'z5b1': 2.2, 'z5b2': 2.6, 'z5b3': 1.8, 'z5b4': 2.4, 'z5back1': 2.4, 'z5back1b': 3.6, 'z5again1': 1.4,
    /* the shy one */ 'z5s1': 2.4, 'z5s2': 2.2, 'z5s3': 2.0, 'z5s4': 3.4, 'z5back2': 0.6, 'z5back2b': 4.0, 'z5again2': 2.2,
    /* the little one, and come back */ 'z5l1': 2.2, 'z5l2': 2.2, 'z5l3': 2.6, 'z5sob': 2.0, 'z5out': 6.0, 'z5come': 2.6,
      'z5gasp': 3.0, 'z5time': 2.6, 'z5felt': 5.2, 'z5fasc': 3.6,
    /* A */ 'z5A1': 3.4, 'z5A2': 2.8, 'z5A3': 2.2, 'z5Agig': 1.0, 'z5A4': 2.0, 'z5A5': 4.6, 'z5A6': 4.6, 'ma5vm': 6.0,
    /* B */ 'z5B1': 3.0, 'z5B2': 3.4, 'z5B3': 2.6, 'z5B4': 5.0, 'z5B5': 3.8, 'z5B6': 5.8,
    /* C */ 'z5C1': 2.8, 'z5C2': 3.0, 'z5C3': 5.6, 'z5C4': 5.4, 'z5Cevil': 2.8, 'z5Claugh': 2.5, 'z5C5': 3.2, 'z5C6': 4.6, 'z5C7': 4.4,
    /* D */ 'z5D1': 3.4, 'z5D2': 4.0, 'z5D3': 4.4, 'z5D4': 8.0, 'z5D5': 7.0, 'z5D6': 4.4, 'mk5teach': 6.0, 'mk5yatha': 12.12,
    /* the epilogue */ 'z5epi0': 9.0, 'z5epi1': 7.4, 'z5epi2': 3.0, 'z5epi3': 4.2,
    /* the cards */ 'z5A': 4.4, 'z5B': 4.0, 'z5C': 3.0, 'z5D': 3.6
  };

  const smooth = k => k * k * (3 - 2 * k);
  const cl01 = x => Math.max(0, Math.min(1, x));

  function build(ctx) {
    const { THREE, GLTFLoader, scene, camera, yaw, pitch, LOW, kit,
            assetBytes, rescueTextures, getState, startDecision, worldSfx, warmSounds, soundOff, unifySkeletons } = ctx;

    /* (the v21.1 TDZ law: everything a builder or a frame asks for is declared up here, before anything is built) */
    const owned = [];
    let alive = true;
    const parsedGlb = new Map();
    const madeTex = [];
    const mats = [];
    const M = (o) => { const m = new THREE.MeshStandardMaterial(o); mats.push(m); return m; };

    /* ------------------------------------------------------------- the map */
    const SX = 250, MX = -250;                            // WORLD S's and WORLD M's x
    const ROOM  = { x0: -1.6, x1: 1.6, z0: -1.8, z1: 1.8, H: 2.7 };
    const WIN   = { z0: -0.2, z1: 1.0, y0: 0.9, y1: 2.1 };            // on the right wall (x 1.6)
    const ALTAR = { x0: 1.22, x1: 1.60, z0: -0.30, z1: 1.10, top: 0.70, riser: 0.10 };
    const MAT   = { x: 0.62, z: 0.40 };                   // where he sits, before the altar, facing it (+x)
    const DESK  = { x0: -1.0, x1: 0.3, z0: -1.8, z1: -1.22, top: 0.74 };
    const BED   = { x0: -1.6, x1: -0.66, z0: -1.8, z1: 0.30 };
    const DOOR  = { x: 0.9, w: 0.84, h: 2.05 };           // on the front wall (z 1.8)
    const R_ARRIVE = { x: 0.9, z: 1.25 };                 // just inside the door, facing into the room
    const SHOP  = { x0: -4.5, x1: 4.5, z0: -7.0, z1: 0.0, H: 2.9 };   // WORLD S, local (chapter 4's World H numbers)
    const MALL  = { x0: -14, x1: 14, z0: 0.0, z1: 5.0, H: 3.6 };
    const RCNT  = { x0: 2.9, x1: 3.5, z0: -1.0, z1: -3.9, top: 1.0 };   // the owner's counter, its face to −x
    const OWN   = { x: 3.98, z: -2.45 };                  // the owner, behind it, facing −x
    const S_SPAWN = { x: SX + 2.30, z: -2.45 };           // the counter's front, facing him (DATA.spawn)
    /* the three, LEFT to RIGHT as he faces them (he faces +x at both, so left is −z): the red one, the shy one, the
       little one — heights in metres with their bases (§4.1 1) */
    const KIDS = [
      { key: 'red',    asset: 'kumanred',    h: 0.26, slot: 0, preset: 'RED',   lens: 84, motif: 'k5red',    toy: 'car',      capTurns: 1.5, yieldSecs: 4.0 },
      { key: 'shy',    asset: 'kumanshy',    h: 0.20, slot: 1, preset: 'AMBER', lens: 90, motif: 'k5shy',    toy: 'ball',     capTurns: 1.5, yieldSecs: 2.0 },
      { key: 'little', asset: 'kumanlittle', h: 0.24, slot: 2, preset: 'BLUE',  lens: 62, motif: 'k5lonely', toy: 'pinwheel', capTurns: 2.0, yieldSecs: 0.6, auto: true }
    ];
    const ALTAR_Z = [0.05, 0.40, 0.75];                   // each one's place along the riser
    const CNT_Z = [-2.75, -2.45, -2.15];                  // and on the red cloth on the glass
    const KID_LOD = 0.9;                                  // the near level inside this (§6: only for a figure in macro)

    /* ----------------------------------------------------------- materials */
    const matWallR  = M({ color: 0xd8d2c4, roughness: 0.92 });    // WORLD R (CP4 ports chapter 4's room)
    const matFloorR = M({ color: 0x8a6a4a, roughness: 0.6 });
    const matCeilR  = M({ color: 0xe8e4da, roughness: 0.95 });
    const matWallS  = M({ color: 0xf1ece2, roughness: 0.92 });    // WORLD S (CP5 ports chapter 4's World H)
    const matFloorS = M({ color: 0xd8d0c0, roughness: 0.35 });
    const matMall   = M({ color: 0x8a8478, roughness: 0.5 });
    const matWallM  = M({ color: 0xe6dccb, roughness: 0.9 });     // WORLD M (CP5 ports chapter 4's temple)
    const matFloorM = M({ color: 0x9a7a52, roughness: 0.4 });
    const matWood   = M({ color: 0x3e2414, roughness: 0.5 });
    const matLacq   = M({ color: 0x2a0e08, roughness: 0.35 });
    const matRed    = M({ color: 0x8e1d14, roughness: 0.6 });
    const matGlass  = M({ color: 0xbfd8d8, roughness: 0.05, metalness: 0.1, transparent: true, opacity: 0.35 });
    const matMat    = M({ color: 0x9a8058, roughness: 0.95 });
    const matCloth  = M({ color: 0xc8c0b0, roughness: 0.95 });
    const matProxy  = M({ color: 0x8d7a66, roughness: 0.9 });
    const matNight  = new THREE.MeshBasicMaterial({ color: 0x0a1226, fog: false }); mats.push(matNight);   // the window, until CP4 paints its four states

    const world = new THREE.Group();
    scene.add(world);
    const worldR = new THREE.Group(); world.add(worldR);
    const worldS = new THREE.Group(); worldS.position.x = SX; world.add(worldS);   // its own numbers, offset
    const worldM = new THREE.Group(); worldM.position.x = MX; worldM.visible = false; world.add(worldM);

    const walls = [], solids = [];
    const box = (w, h, d, x, y, z, mat, parent = world, cast = true) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
      m.position.set(x, y, z); m.castShadow = cast && !LOW; m.receiveShadow = true;
      parent.add(m); return m;
    };
    const floorAt = (w, d, x, z, mat, parent) => {
      const f = new THREE.Mesh(new THREE.PlaneGeometry(w, d), mat);
      f.rotation.x = -Math.PI / 2; f.position.set(x, 0, z); f.receiveShadow = true; parent.add(f); return f;
    };
    const ceilAt = (w, d, x, y, z, mat, parent) => {
      const c = new THREE.Mesh(new THREE.PlaneGeometry(w, d), mat);
      c.rotation.x = Math.PI / 2; c.position.set(x, y, z); parent.add(c); return c;
    };

    /* ------------------------------------------------- one parse per asset */
    function parseOnce(key) {
      if (!parsedGlb.has(key)) {
        parsedGlb.set(key, assetBytes(key).then(BUF => new Promise((res, rej) =>
          new GLTFLoader().parse(BUF, '', (gltf) => {
            rescueTextures(gltf, BUF);
            if (unifySkeletons) unifySkeletons(gltf.scene);
            res({ scene: gltf.scene, animations: gltf.animations });
          }, rej))));
      }
      return parsedGlb.get(key);
    }

    /* ------------------------------------------------------- WORLD R (CP2) */
    {
      const G = worldR, W2 = ROOM.x1 - ROOM.x0, D2 = ROOM.z1 - ROOM.z0;
      floorAt(W2, D2, 0, 0, matFloorR, G);
      ceilAt(W2, D2, 0, ROOM.H, 0, matCeilR, G);
      const T = 0.1;
      walls.push(box(W2 + 2 * T, ROOM.H, T, 0, ROOM.H / 2, ROOM.z0 - T / 2, matWallR, G, false));        // the desk wall
      walls.push(box(T, ROOM.H, D2, ROOM.x0 - T / 2, ROOM.H / 2, 0, matWallR, G, false));               // the bed wall
      // the door wall, with the door's opening (the door itself at CP4)
      const dL = DOOR.x - DOOR.w / 2, dR = DOOR.x + DOOR.w / 2;
      walls.push(box(dL - ROOM.x0, ROOM.H, T, (ROOM.x0 + dL) / 2, ROOM.H / 2, ROOM.z1 + T / 2, matWallR, G, false));
      walls.push(box(ROOM.x1 - dR, ROOM.H, T, (dR + ROOM.x1) / 2, ROOM.H / 2, ROOM.z1 + T / 2, matWallR, G, false));
      box(DOOR.w, ROOM.H - DOOR.h, T, DOOR.x, DOOR.h + (ROOM.H - DOOR.h) / 2, ROOM.z1 + T / 2, matWallR, G, false);
      walls.push(box(DOOR.w, DOOR.h, 0.04, DOOR.x, DOOR.h / 2, ROOM.z1 + T + 0.02, matWood, G, false));   // shut, until CP4 hangs it
      // the window wall, built round the window
      const wx = ROOM.x1 + T / 2;
      walls.push(box(T, ROOM.H, WIN.z0 - ROOM.z0, wx, ROOM.H / 2, (ROOM.z0 + WIN.z0) / 2, matWallR, G, false));
      walls.push(box(T, ROOM.H, ROOM.z1 - WIN.z1, wx, ROOM.H / 2, (WIN.z1 + ROOM.z1) / 2, matWallR, G, false));
      box(T, WIN.y0, WIN.z1 - WIN.z0, wx, WIN.y0 / 2, (WIN.z0 + WIN.z1) / 2, matWallR, G, false);
      box(T, ROOM.H - WIN.y1, WIN.z1 - WIN.z0, wx, WIN.y1 + (ROOM.H - WIN.y1) / 2, (WIN.z0 + WIN.z1) / 2, matWallR, G, false);
      const night = new THREE.Mesh(new THREE.PlaneGeometry(WIN.z1 - WIN.z0, WIN.y1 - WIN.y0), matNight);
      night.rotation.y = -Math.PI / 2; night.position.set(ROOM.x1 + T + 0.02, (WIN.y0 + WIN.y1) / 2, (WIN.z0 + WIN.z1) / 2); G.add(night);
      // the altar under the window: the cabinet, the runner, the riser
      solids.push(box(ALTAR.x1 - ALTAR.x0, ALTAR.top, ALTAR.z1 - ALTAR.z0, (ALTAR.x0 + ALTAR.x1) / 2, ALTAR.top / 2, (ALTAR.z0 + ALTAR.z1) / 2, matLacq, G));
      box(ALTAR.x1 - ALTAR.x0 + 0.02, 0.006, ALTAR.z1 - ALTAR.z0 - 0.1, (ALTAR.x0 + ALTAR.x1) / 2, ALTAR.top + 0.003, (ALTAR.z0 + ALTAR.z1) / 2, matRed, G, false);
      box(0.16, ALTAR.riser, ALTAR.z1 - ALTAR.z0 - 0.12, ALTAR.x1 - 0.1, ALTAR.top + ALTAR.riser / 2 + 0.006, (ALTAR.z0 + ALTAR.z1) / 2, matRed, G);
      // the mat before it, the desk and the bed (CP4 builds them out)
      box(0.9, 0.012, 0.7, MAT.x, 0.006, MAT.z, matMat, G, false);
      solids.push(box(DESK.x1 - DESK.x0, DESK.top, DESK.z1 - DESK.z0, (DESK.x0 + DESK.x1) / 2, DESK.top / 2, (DESK.z0 + DESK.z1) / 2, matWood, G));
      solids.push(box(BED.x1 - BED.x0, 0.45, BED.z1 - BED.z0, (BED.x0 + BED.x1) / 2, 0.225, (BED.z0 + BED.z1) / 2, matCloth, G));
    }

    /* ------------------------------------------------------- WORLD S (CP2) */
    {
      const G = worldS;
      floorAt(SHOP.x1 - SHOP.x0, SHOP.z1 - SHOP.z0, 0, (SHOP.z0 + SHOP.z1) / 2, matFloorS, G);
      ceilAt(SHOP.x1 - SHOP.x0, SHOP.z1 - SHOP.z0, 0, SHOP.H, (SHOP.z0 + SHOP.z1) / 2, matWallS, G);
      const T = 0.12;
      walls.push(box(SHOP.x1 - SHOP.x0 + 2 * T, SHOP.H, T, 0, SHOP.H / 2, SHOP.z0 - T / 2, matWallS, G, false));
      walls.push(box(T, SHOP.H, SHOP.z1 - SHOP.z0, SHOP.x0 - T / 2, SHOP.H / 2, (SHOP.z0 + SHOP.z1) / 2, matWallS, G, false));
      walls.push(box(T, SHOP.H, SHOP.z1 - SHOP.z0, SHOP.x1 + T / 2, SHOP.H / 2, (SHOP.z0 + SHOP.z1) / 2, matWallS, G, false));
      // the glass front onto the corridor, with its door (rooted at the counter, he never walks out: CP5 decides)
      walls.push(box(SHOP.x1 - SHOP.x0 - 1.2, 2.4, 0.03, 0.6, 1.2, SHOP.z1, matGlass, G, false));
      walls.push(box(0.2, 2.4, 0.03, SHOP.x0 + 0.1, 1.2, SHOP.z1, matGlass, G, false));
      floorAt(MALL.x1 - MALL.x0, MALL.z1 - MALL.z0, 0, (MALL.z0 + MALL.z1) / 2, matMall, G);
      walls.push(box(MALL.x1 - MALL.x0, MALL.H, T, 0, MALL.H / 2, MALL.z1 + T / 2, matMall, G, false));
      // the owner's counter, the cloth on its glass
      solids.push(box(RCNT.x1 - RCNT.x0, RCNT.top, RCNT.z0 - RCNT.z1, (RCNT.x0 + RCNT.x1) / 2, RCNT.top / 2, (RCNT.z0 + RCNT.z1) / 2, matWood, G));
      box(0.34, 0.004, 0.86, (RCNT.x0 + RCNT.x1) / 2 - 0.05, RCNT.top + 0.002, OWN.z, matRed, G, false);
    }

    /* ------------------------------------------------------- WORLD M (CP2) */
    {
      const G = worldM;
      floorAt(16, 16, 0, -6, matFloorM, G);
      box(16, 6, 0.3, 0, 3, -14, matWallM, G, false);
    }

    /* ------------------------------------------------ THE THREE (CP1's scans)
       ONE parse each; a LOD per place — the near level only for a figure close to the lens (KID_LOD), the far one
       wearing the near one's material over the same vertices. Each file is baked base-down on y 0, height 1.0,
       facing +z (CP1), so a place is a position, a turn and a height in metres. */
    const kidLive = KIDS.map(K => ({ K, altar: null, counter: null, ready: false }));
    function kidLOD(src, h) {
      const lod = new THREE.LOD();
      const near = src.near.clone(), far = src.far.clone();
      const wn = new THREE.Group(); wn.add(near);
      const wf = new THREE.Group(); wf.add(far);
      lod.addLevel(wn, 0); lod.addLevel(wf, KID_LOD);
      const g = new THREE.Group(); g.add(lod); g.scale.setScalar(h);
      return g;
    }
    for (const L of kidLive) {
      const K = L.K;
      parseOnce(K.asset).then(({ scene: sc }) => {
        if (!alive) return;
        const near = sc.getObjectByName(K.asset + '_near'), far = sc.getObjectByName(K.asset + '_far');
        if (!near || !far) throw new Error(`${K.asset}: no ${K.asset}_near / ${K.asset}_far node`);
        far.traverse(m => { if (m.isMesh) m.material = near.material; });
        for (const o of [near, far]) o.traverse(m => { if (m.isMesh) { m.castShadow = false; m.receiveShadow = false; } });
        const src = { near, far };
        // on the riser under the window, facing into the room (−x): a model at ry θ faces (sin θ, 0, cos θ)
        L.altar = kidLOD(src, K.h);
        L.altar.position.set(ALTAR.x1 - 0.1, ALTAR.top + ALTAR.riser + 0.006, ALTAR_Z[K.slot]);
        L.altar.rotation.y = -Math.PI / 2;
        worldR.add(L.altar);
        // and on the red cloth on the owner's glass, facing him (−x as well)
        L.counter = kidLOD(src, K.h);
        L.counter.position.set((RCNT.x0 + RCNT.x1) / 2 - 0.05, RCNT.top + 0.004, CNT_Z[K.slot]);
        L.counter.rotation.y = -Math.PI / 2;
        worldS.add(L.counter);
        L.ready = true;
      }).catch(e => { console.warn('e3c5: ' + K.asset + ' could not be placed — ' + (e && e.message)); if (ctx.loadFail) ctx.loadFail(K.asset, e); });
    }

    /* ------------------------------------------------------ the chapter clock */
    const PHASES = ['counter', 'care', 'sit', 'open1', 'open2', 'open3', 'after', 'decide'];
    let phase = 'counter';
    let booted = false, preplaced = '';       // preplaced: the world a Continue was put in under the chapter card
    const dayClock = { t: 0 };
    let lastWall = 0;
    const todo = [];
    function after(secs, fn) { todo.push({ at: dayClock.t + secs, fn }); todo.sort((a, b) => a.at - b.at); }
    function runTodo() { while (todo.length && todo[0].at <= dayClock.t) todo.shift().fn(); }
    function dropTodo() { todo.length = 0; }
    const heard = new Set();

    const speak = { until: 0, pending: null };
    function speakReset() { speak.until = 0; speak.pending = null; }
    /* A LINE IS A BEAT, HEARD OR NOT (e3c3's law): a muted game speaks it silently on its own length, and a line whose
       bytes have not landed is held a moment (v8.0) and then spoken silently, so a beat chained on a line's start never
       stops the chapter — which is also how a PLANNED line (no take yet, CP11) passes: silently, on its estimate */
    function sayLine(name, vol = 1, onStart, pan) {
      if (dayClock.t < speak.until) return false;
      const start = () => { speak.until = dayClock.t + (SECS[name] || 2.5) + 0.25; heard.add(name); if (onStart) onStart(); };
      if ((soundOff && soundOff()) || !worldSfx) { start(); return true; }
      if (worldSfx(name, vol, 1, pan)) { start(); return true; }
      speak.pending = { name, vol, start, pan, give: dayClock.t + 1.6 };
      speak.until = dayClock.t + 0.2;
      return true;
    }
    function runSpeak() {
      const q = speak.pending;
      if (!q || dayClock.t < speak.until) return;
      if (dayClock.t > q.give || (soundOff && soundOff())) { speak.pending = null; q.start(); return; }
      if (worldSfx(q.name, q.vol, 1, q.pan)) { speak.pending = null; q.start(); }
      else speak.until = dayClock.t + 0.2;
    }
    /* one voice at a time, in order, never dropped (the v9.5 queue) */
    const lineQ = [];
    function queueLine(name, onStart, vol = 1, pan = 0) { lineQ.push({ name, onStart, vol, pan }); }
    function queueGap(secs) { lineQ.push({ gap: secs }); }
    function queueFn(fn) { lineQ.push({ fn }); }
    function runQueue() {
      if (!lineQ.length || speak.pending || dayClock.t < speak.until) return;
      const q = lineQ.shift();
      if (q.fn) { q.fn(); return; }
      if (q.gap) { speak.until = dayClock.t + q.gap; return; }
      sayLine(q.name, q.vol, q.onStart, q.pan);
    }
    const quiet = () => !lineQ.length && !speak.pending && dayClock.t >= speak.until;

    /* ------------------------------------------------------------ the phases */
    const W = DATA.words;
    const worldOf = (x) => x > 100 ? 'S' : x < -100 ? 'M' : 'R';
    let worldRun = 0;                          // a world change's run token (a reset or a second change cancels the first)
    let wDark = false;                         // a world arrived in under its black: the order and the marks wait for the picture
    let decOpen = false;                       // the decision has opened by itself once (until then the pile is not pressable)
    function setPhase(p, tag) {
      phase = p;
      if (kit) kit.setPhase(tag ? p + ':' + tag : p);
      objectiveFor(p, tag);
    }
    function objectiveFor(p) {
      if (!kit) return;
      if (wDark) { kit.objective(null, { complete: false }); return; }
      const o = { counter: W.objTake, sit: W.objSit, decide: null }[p];
      kit.objective(o || null);
    }

    /* ------------------------------------------------------- between worlds
       Under the kit's black: the player put down in the next world, its light, a warm of everything (kit.warm — the
       curtain's own), then the black lifts (chapter 4's toWorld) */
    function placeIn(w) {
      if (w === 'R') {
        yaw.position.x = R_ARRIVE.x; yaw.position.z = R_ARRIVE.z;
        yaw.rotation.y = 0; pitch.rotation.x = -0.05;          // into the room, the altar on the right (CP4 aims it)
      } else {
        yaw.position.x = S_SPAWN.x; yaw.position.z = S_SPAWN.z;
        yaw.rotation.y = DATA.spawn.rot; pitch.rotation.x = -0.12;
      }
      if (kit) { kit.daylight(w === 'R' ? NIGHT : null, 0); kit.pose('standing', { secs: 0.05 }); }
    }
    function toWorld(w, resumed, at, tag) {
      const run = ++worldRun;
      const cold = resumed && preplaced === w;           // put there under the chapter card already: no black of its own
      if (kit) { kit.root(false); kit.presence(0); if (!cold) kit.fade(1, 0.01); }
      if (!cold) placeIn(w);
      wDark = !resumed;
      setPhase(at || (w === 'R' ? 'sit' : 'counter'), tag);
      const warmed = !cold && kit && kit.warm ? kit.warm() : Promise.resolve(0);
      warmed.then(() => {
        if (!alive || run !== worldRun) return;
        if (kit) kit.fade(0, resumed ? 1.2 : 1.6);
        wDark = false; objectiveFor(phase);
        if (phase === 'decide') { sitDown(true); openDecision(); }
      });
    }

    /* ------------------------------------------------------- the counter (CP2)
       CP5 plays the counter in full (§4.0b): the misconception and its answer, film M, each child met, the card, the
       promise. Here, the one order that carries him home. */
    function takeHome() {
      if (phase !== 'counter' || !quiet()) return false;
      const done = () => { if (alive) toWorld('R', false, 'sit'); };
      if (!kit || !kit.film || !kit.film('home', { onDone: done })) done();
      return true;
    }

    /* -------------------------------------------------------- the room (CP2)
       CP6 plays the offerings, CP7 the question and the openings (§4.2–§4.6). Here, the mat and the decision. */
    let seated = false;
    function sitDown(resumed) {
      seated = true;
      yaw.position.x = MAT.x; yaw.position.z = MAT.z;
      if (kit) {
        kit.root(true);
        kit.pose('lying', { y: 0.90, yaw: -Math.PI / 2, span: 0.9, pitchLo: -0.6, pitchHi: 0.5, secs: resumed ? 0.05 : 0.9 });
      }
    }
    function openDecision() {
      decOpen = true;
      if (getState() === 'play') startDecision();
    }
    function sitWithThem() {
      if (phase !== 'sit' || seated || !quiet()) return false;
      sitDown(false);
      setPhase('decide');
      after(1.2, () => openDecision());
      return true;
    }

    /* ------------------------------------------------------- the decision */
    const _ndc = new THREE.Vector3();
    const INTERACT_R = 2.4;
    const PILE_POS = new THREE.Vector3((ALTAR.x0 + ALTAR.x1) / 2, 0, (ALTAR.z0 + ALTAR.z1) / 2);   // the altar
    const pile = new THREE.Group(); pile.position.copy(PILE_POS); world.add(pile);
    const pileLive = () => decOpen && phase === 'decide' && worldOf(yaw.position.x) === 'R';
    function pileDist() { return Math.hypot(yaw.position.x - PILE_POS.x, yaw.position.z - PILE_POS.z); }
    function pileScreen() { camera.updateMatrixWorld(); return _ndc.set(PILE_POS.x, ALTAR.top + 0.2, PILE_POS.z).project(camera); }
    function pileInView() {
      if (!pileLive()) return false;
      const n = pileScreen();
      return n.z < 1 && Math.abs(n.x) < 1.1 && Math.abs(n.y) < 1.1;
    }
    function pointerHitsPile() { return pileLive() && pileDist() < INTERACT_R; }
    function interactPile() {
      if (!pileLive()) return false;
      startDecision();
      return true;
    }

    /* ------------------------------------------------------------- hotspots
       Anchors at EYE height on the thing itself (the v7.5 law) */
    const hotspots = [
      { id: 'bag', pos: { x: SX + (RCNT.x0 + RCNT.x1) / 2 - 0.05, y: RCNT.top + 0.2, z: OWN.z }, radius: 2.4, prompt: W.hotBag, markY: 0.12,
        enabled: () => phase === 'counter' && quiet(), onInteract() { return takeHome(); } },
      { id: 'mat', pos: { x: MAT.x, y: 0.9, z: MAT.z }, radius: 1.6, prompt: W.hotMat, markY: -0.3,
        enabled: () => phase === 'sit' && !seated && quiet(), onInteract() { return sitWithThem(); } }
    ];
    for (const h of hotspots) { const en = h.enabled; h.enabled = () => !wDark && (!en || en()); }   // none under an arrival's black

    /* ---------------------------------------------------------- per frame */
    const wallNow = () => performance.now() / 1000;
    function updateNotes(dt, t) {
      const now = wallNow();
      const st = getState();
      const live = st === 'play' || st === 'unlock' || st === 'choose';
      /* a Continue into the room is put there UNDER the chapter card, so the card lifts on the world it resumes in */
      if (!booted && !preplaced && kit) {
        const RA = resumeAt(kit.getPhase());
        if (RA) { preplaced = RA.w; placeIn(RA.w); }
      }
      if (!live) { lastWall = 0; return; }
      if (lastWall) dayClock.t += Math.min(0.5, now - lastWall);
      lastWall = now;
      if (!booted) {
        booted = true;
        applyPhase(kit ? kit.getPhase() : null);
      }
      runTodo(); runSpeak(); runQueue();
    }
    function updatePile() {}
    function updateFire() {}
    function updateSlow() {}

    /* ------------------------------------------------------------ a resume
       A Continue lands on the order still open, in its world (§10.1). Until CP6 there are no offerings, so a care
       phase resumes at the mat. */
    function resumeAt(p0) {
      const tag = String(p0 || '').split(':'), p = PHASES.includes(tag[0]) ? tag[0] : 'counter';
      if (PHASES.indexOf(p) >= PHASES.indexOf('care')) return { w: 'R', at: p === 'decide' ? 'decide' : 'sit' };
      return null;
    }
    function applyPhase(p) {
      const RA = resumeAt(p);
      if (RA) { toWorld(RA.w, true, RA.at); return; }
      setPhase('counter');
    }

    /* ---------------------------------------------------------- lifecycle */
    function snap() { return { phase }; }
    function restore() {}
    function reset() {
      dropTodo(); speakReset(); lineQ.length = 0; heard.clear();
      booted = false; preplaced = ''; dayClock.t = 0; lastWall = 0;
      worldRun++; wDark = false; decOpen = false; seated = false;
      worldM.visible = false;
      for (const h of hotspots) { h.done = false; h.dwellT = 0; }
      if (kit) {
        kit.root(false); kit.pose('standing', { secs: 0.05 });
        if (kit.pray) kit.pray(false, { secs: 0 });
        kit.presence(0);
        kit.daylight(null, 0);
        kit.setPhase('counter');
      }
      phase = 'counter';
    }
    function blockers() {
      const out = [];
      const b = (o, pad = 0.20) => { o.updateWorldMatrix(true, false); const bb = new THREE.Box3().setFromObject(o); bb.expandByScalar(pad); out.push(bb); };
      const solid = (o, pad = 0.14) => { o.updateWorldMatrix(true, false); const bb = new THREE.Box3().setFromObject(o); bb.expandByScalar(pad); bb.min.y = 0; bb.max.y = Math.max(bb.max.y, 1.40); out.push(bb); };
      for (const w of walls) b(w);
      for (const s of solids) solid(s);
      return out;
    }
    function dispose() {
      alive = false;
      const geos = new Set(), ms = new Set();
      world.traverse(o => {
        if (o.geometry) geos.add(o.geometry);
        if (o.material) for (const m of (Array.isArray(o.material) ? o.material : [o.material])) ms.add(m);
      });
      /* the parsed scans hold the geometry and the material the clones share: freed once, through the parse */
      for (const p of parsedGlb.values()) p.then(({ scene: sc }) => sc.traverse(o => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) for (const m of (Array.isArray(o.material) ? o.material : [o.material])) {
          for (const k of ['map', 'roughnessMap', 'metalnessMap', 'normalMap', 'emissiveMap', 'alphaMap']) m[k]?.dispose?.();
          m.dispose();
        }
      })).catch(() => {});
      scene.remove(world);
      for (const o of owned) { if (o.parent) o.parent.remove(o); o.dispose?.(); }
      owned.length = 0;
      for (const g of geos) g.dispose();
      for (const m of ms) {
        for (const k of ['map', 'roughnessMap', 'metalnessMap', 'normalMap', 'emissiveMap', 'alphaMap']) m[k]?.dispose?.();
        m.dispose();
      }
      for (const m of mats) m.dispose();
      for (const t of madeTex) t?.dispose?.();
      world.clear();
      S = null;
    }

    return (S = {
      world, blockers: blockers(),
      ready: () => true,
      pile: { pos: PILE_POS, radius: INTERACT_R, group: pile,
              dist: pileDist, screen: pileScreen, inView: pileInView,
              hits: pointerHitsPile, interact: interactPile,
              glow: () => 0 },
      drum: null, ash: null, embers: null, heroNote: null, smoke: null, flying: null,
      jossTips: [], fireLight: null,
      /* the sky where he is: the room, at the origin, keeps the engine's own; the shop and the temple carry theirs with
         them (chapter 4's L4-2 — away from the origin the engine's sky stood out of reach) */
      skyAt: () => worldOf(yaw.position.x) === 'R' ? null : { x: yaw.position.x, z: yaw.position.z },
      get noteStorm() { return 1; },
      set noteStorm(v) {},
      film: { SX, MX, ROOM, SHOP, RCNT, OWN, MAT, R_ARRIVE, S_SPAWN, worldM },
      pileVia: { what: 'his room\'s mat (the home film carries him there)', x: MAT.x, z: MAT.z },
      arrivals: [{ what: 'his room (the home film puts him inside its door)', x: R_ARRIVE.x, z: R_ARRIVE.z }],
      get phase() { return phase; },
      setPhase, applyPhase, after, dayClock, sayLine,
      kids: () => kidLive.map(L => ({ key: L.K.key, ready: L.ready })),
      info: () => ({ phase, t: +dayClock.t.toFixed(2), queued: lineQ.length, heard: [...heard], world: worldOf(yaw.position.x),
                     until: +speak.until.toFixed(2), pending: speak.pending ? speak.pending.name : null,
                     seated, decOpen, kids: kidLive.map(L => L.K.key + (L.ready ? '' : '?')) }),
      hotspots,
      updateNotes, updatePile, updateFire, updateSlow,
      snap, restore, reset, dispose
    });
  }

  /* ============================================================== THE FILMS
     Stubs until CP9 (the opening film and the home film), CP5 (the counter's films M and K) and CP7 (the three
     possessions). Each begins and ends as it will: the opening film on black and back to it (the v4.6 law, the card
     over its black); a film from play out of the picture into black, its black handed to the kit's fade (v21.0). */
  function introFilm(c, s, api) {
    const { step, fade, stage } = api;
    const F = stage.film;
    c.keepFade = true;
    c.endFade = 1;
    fade(0, 0, 1, 1);
    // O1 · the corridor at closing time, the shop's glass ahead (CP9 walks it)
    step(0, () => { api.yaw.position.set(F.SX + 0.6, 1.62, 3.4); api.yaw.rotation.y = 0; api.pitch.rotation.x = -0.04; });
    fade(0.6, 1.6, 1, 0);
    fade(3.4, 4.2, 0, 1);
    step(4.4, () => {});
  }
  function playFilm(c, api) {                  // the shape every film from play keeps (CP5, CP7, CP9 fill each)
    const { step, fade } = api;
    c.keepFade = true;                         // its last black is handed to the kit's fade: the next world lifts it
    c.endFade = 1;
    fade(0, 0.6, 0, 1);
    step(1.2, () => {});
  }
  function madeFilm(c, s, api) { playFilm(c, api); }       // film M · "Where They Came From" (CP5)
  function cardFilm(c, s, api) { playFilm(c, api); }       // film K · "The Card" (CP5)
  function homeFilm(c, s, api) { playFilm(c, api); }       // "Every Day" (CP9)
  function redFilm(c, s, api) { playFilm(c, api); }        // possession 1 · the red one (CP7)
  function shyFilm(c, s, api) { playFilm(c, api); }        // possession 2 · the shy one (CP7)
  function littleFilm(c, s, api) { playFilm(c, api); }     // possession 3 · the little one, and COME BACK (CP7)

  /* ============================================================ THE ENDINGS
     Stubs until CP8: each holds the decision's picture a moment and goes to black, the card over its black. */
  function endStub(c, api) {
    const { step, fade } = api;
    step(0, () => {});
    fade(1.2, 2.2, 0, 1);
    step(2.4, () => {});
    c.endFade = 1;
  }
  function scStay(c, s, api) { endStub(c, api); }          // A · stay inside them
  function scTell(c, s, api) { endStub(c, api); }          // B · tell the world
  function scWish(c, s, api) { endStub(c, api); }          // C · wish for it all
  function scCare(c, s, api) { endStub(c, api); }          // D · care for them, the door kept shut

  (window.__CHAPTERS__ = window.__CHAPTERS__ || {}).e3c5 = Object.assign(DATA, {
    build,
    scenes: [scStay, scTell, scWish, scCare],
    intro: introFilm,
    films: { made: madeFilm, card: cardFilm, home: homeFilm, red: redFilm, shy: shyFilm, little: littleFilm }
  });
})();
