/* Episode 2 · Chapter 2 · "Nobody There"
   ---------------------------------------------------------------------------
   The nights between. Night after night the shower in the block beside bed
   one turns itself on, and it always starts at three. This morning, at the
   cookhouse, he has decided to say something: ask three of the men who sleep
   in that room what they heard, then tell the encik — who is standing in the
   corner watching the recruits eat, the way he always is.

   Two sets in one chapter. The FILM is the bunk at night — a compact pocket
   eighty metres off the cookhouse, built from Chad's bunk bed and the block's
   door, dressed only for its shots (chapter 4's diorama precedent) — the same
   corner from four angles, four nights, one clock. PLAY is the COOKHOUSE:
   long pink-topped tables on steel frames, attached benches, trays, a servery,
   an open side onto the camp. Six admintee doze over breakfast; the encik is
   the chapter's PILE, so this costs the engine nothing.

   Built against the same contract as chapters 1–5, the fixture and e2c1:
   build(ctx) -> stage, scenes[i](c, s, api), intro(c, s, api). The plan is
   docs/V10.0-E2C2-PLAN.md.

   ENGINE SEAMS TOUCHED: none.                                              */

(() => {
  'use strict';

  let S = null;

  const DATA = {
    id: 2,
    episode: 2,
    title: 'Nobody There',
    cardLabel: 'Chapter 2',
    cardTitle: 'Nobody There<br>Breakfast, The Cookhouse',
    brief: 'Night after night, at three in the morning, the shower beside bed one turns itself on. This morning you have decided to say something. Ask three bunkmates what they heard. Then tell the encik.',
    prompt: 'The encik is watching the recruits eat. You have asked three men. Now you are standing in front of him. What do you say?',
    choices: [
      { k: 'A', text: '"Encik, something happened. I don\'t know what."',
        d: { sanity: 18, awareness: 24, wisdom: 30 }, verdict: 'best',
        say: 'I told him what I knew, and only that. He didn\'t laugh.',
        teach: 'Document before interpreting. Wisdom can include: I don\'t know yet.' },
      { k: 'B', text: '"Encik, the bunk is haunted. I\'m sure."',
        d: { sanity: -12, awareness: -9, wisdom: -30 }, verdict: 'worst', critical: true,
        say: 'I said I was sure. I wasn\'t. Now nobody will listen.',
        teach: 'Confirmation bias can make ordinary events feel like proof.' },
      { k: 'C', text: '"Never mind encik, I think I was just tired."',
        d: { sanity: 9, awareness: -21, wisdom: -21 }, verdict: 'bad',
        say: 'I called it nothing. It wasn\'t nothing. Three a.m. knew that.',
        teach: 'Scepticism is not the same as dismissal.' },
      { k: 'D', text: '"Encik, what do you think it is?"',
        d: { sanity: 15, awareness: 21, wisdom: 30 }, verdict: 'good',
        say: 'He gave me three answers and one rule. The rule was the answer.',
        teach: 'Good guidance expands your thinking; it does not replace your judgement.' }
    ],
    core: 'What you say about a thing becomes what is known about it. Say what you know — not less, and not more.<br><i>Sammā vācā — right speech: true, useful, and in its time.</i>',

    /* units metres, y up. The cookhouse hall is x −9…9, z −7…7; the servery
       runs along the −x wall, the +z side is open to the camp between
       pillars, the encik's corner is +x, −z. The night pocket for the film
       stands eighty metres off at z −80, outside the bounds. */
    spawn:     { x: -5.0, y: 1.62, z: 0, rot: -Math.PI / 2 },   // by the servery, facing down the middle aisle
    shrine:    { x: 7.6, z: -5.6 },                            // the engine's anchor: the encik's corner
    ghostHome: { x: 7.6, z: -5.6 },                            // unused (ghost: null)
    bounds:    { minX: -8.6, maxX: 8.6, minZ: -6.6, maxZ: 6.6 },

    /* the eleventh leak (v4.3): no haunting from the engine. This chapter's
       haunting is the film's, and the memory of it. */
    ghost: null,

    /* a Tekong morning — e2c1's MORNING, the one its film opens in */
    daylight: {
      stops: [[0.00, '#e9e4d6'], [0.22, '#d5dde2'], [0.48, '#b7c9d6'],
              [0.76, '#98b3c8'], [1.00, '#86a6c0']],
      bg: 0xb7c9d6,
      fog: [0xcfd8dc, 0.010],
      hemi: [0xe6eaee, 0x8a8478, 0.95],
      key: [0xfff1dc, 0.75, 20, 16, 4],
      fill: [0xbfcdd8, 0.32],
      stars: 0, moon: 0,
      sun: 0.35, clouds: 0.6,
      vmHemi: [0xeef1f4, 0x9a9488, 0.9],
      vmKey: [0xfff2dc, 0.65]
    },

    assets: ['admintee', 'encik2', 'bunkbed'],

    /* the explore music is chapter 1's title theme; the cookhouse has its own
       room tone and the episode's dread under it. `showerrun` and `clocktick`
       are the film's and scene C's, written up by the chapter (a loop at 0 is
       never decoded until it is asked for). */
    musicVol: 0,
    ambience: { beds: [['cookamb', 0.30], ['e2dread', 0.20], ['showerrun', 0], ['clocktick', 0]] },

    words: {
      approach: 'the encik',
      act: 'E to speak to the encik',
      actTouch: 'Tap to speak to the encik',
      interact: 'E to speak to the encik',
      interactTouch: 'Tap to speak to the encik',
      presence: 'Something followed you here.',
      objAsk: 'Ask three bunkmates what they heard · {n}/3',
      objEncik: 'Tell the encik',
      hotBuddy: 'Ask your buddy',
      hotBunkmate: 'Ask your bunkmate',
      hotRecruit: 'Ask him'
    },
    sayPrefix: 'n2'
  };

  /* the night the FILM is shot in — e2c1's NIGHT */
  const NIGHT = {
    stops: [[0.00, '#1a1714'], [0.20, '#121420'], [0.45, '#0b1020'],
            [0.75, '#060912'], [1.00, '#03050a']],
    bg: 0x070a10,
    fog: [0x090d14, 0.020],
    hemi: [0x2c3652, 0x0f1114, 0.55],
    key: [0x8fa4c8, 0.35, 20, 16, 4],
    fill: [0x4e6086, 0.18],
    stars: 0.9, moon: 0,
    sun: 0, clouds: 0.25,
    vmHemi: [0x2e3a58, 0x0c0e12, 0.5],
    vmKey: [0x8ea3cc, 0.42]
  };

  /* the measured length of every line said outside a cutscene */
  const SECS = { b2hear: 6.32, k2three: 4.64, r2siao: 3.2 };

  const hash = (i, s) => { const x = Math.sin(i * 127.1 + s * 311.7) * 43758.5453; return x - Math.floor(x); };

  function build(ctx) {
    const { THREE, GLTFLoader, cloneSkinned, scene, camera, yaw, LOW, kit,
            assetBytes, rescueTextures, redoShadows, cnv, makeHellNote,
            getState, startDecision, worldSfx, warmSounds, HEAD_RE } = ctx;

    const owned = [];
    let alive = true;

    /* ------------------------------------------------------------- the map */
    const H = { x: 9.0, z: 7.0, h: 4.2, wall: 0.18 };
    const ROW_Z = [-4.6, -1.55, 1.55, 4.6];
    const TBL = { x0: -2.9, x1: 4.1, w: 0.80, top: 0.76, bench: 0.68, seat: 0.46, benchW: 0.32 };
    const OURS = 2;                                    // the section's table
    const ENC = { x: 7.6, z: -5.6 };                    // his corner
    ENC.ry = Math.atan2(1.0 - ENC.x, 0 - ENC.z);        // a model faces +z at ry 0: aimed at the hall's middle
    const COUNTER = { x: -7.4, d: 0.8, z0: -4.2, z1: 4.2, h: 0.92 };
    const PK = { x: 0, z: -80 };                        // the night pocket's origin

    /* ----------------------------------------------------------- textures */
    const noteTex = makeHellNote();                     // the contract wants one
    const terrazzo = makeTerrazzo(THREE, cnv);
    const pinkTex = makeLaminate(THREE, cnv);
    const menuTex = makeMenu(THREE, cnv);
    const clock = makeClock(THREE, cnv);

    const matWall = new THREE.MeshStandardMaterial({ color: 0xe6dfcd, roughness: 0.96 });
    const matDado = new THREE.MeshStandardMaterial({ color: 0x6f8f6a, roughness: 0.9 });
    const matCeil = new THREE.MeshStandardMaterial({ color: 0xd9d6cc, roughness: 0.99 });
    const matFloor = new THREE.MeshStandardMaterial({ map: terrazzo, roughness: 0.55, metalness: 0.02 });
    const matPink = new THREE.MeshStandardMaterial({ map: pinkTex, roughness: 0.35, metalness: 0.02 });
    const matSteel = new THREE.MeshStandardMaterial({ color: 0x9aa0a6, roughness: 0.35, metalness: 0.85 });
    const matFrame = new THREE.MeshStandardMaterial({ color: 0x4d5257, roughness: 0.5, metalness: 0.7 });
    const matBench = new THREE.MeshStandardMaterial({ color: 0xc46f86, roughness: 0.5 });
    const matTray = new THREE.MeshStandardMaterial({ color: 0x8a5a3a, roughness: 0.7 });
    const matPlate = new THREE.MeshStandardMaterial({ color: 0xf0ede4, roughness: 0.4 });
    const matFood = new THREE.MeshStandardMaterial({ color: 0xb8863c, roughness: 0.9 });
    const matCup = new THREE.MeshStandardMaterial({ color: 0x2f5f9a, roughness: 0.5 });
    const matTube = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xfff6e6, emissiveIntensity: 1.4, roughness: 0.4 });
    const matPillar = new THREE.MeshStandardMaterial({ color: 0xd8d2c0, roughness: 0.95 });
    const matGrass = new THREE.MeshStandardMaterial({ color: 0x7d9a5c, roughness: 1 });
    const matBlock = new THREE.MeshStandardMaterial({ color: 0xcfc4a8, roughness: 0.95 });
    const matMenu = new THREE.MeshStandardMaterial({ map: menuTex, roughness: 0.9 });
    const matGlass = new THREE.MeshStandardMaterial({ color: 0xcfe6ee, transparent: true, opacity: 0.28, roughness: 0.1, metalness: 0.1 });
    const matProxy = new THREE.MeshStandardMaterial({ color: 0x3b4238, roughness: 0.9 });

    const world = new THREE.Group();
    scene.add(world);

    /* ---------------------------------------------------------- the shell */
    const walls = [], solids = [];
    const box = (w, h, d, x, y, z, mat, parent = world) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
      m.position.set(x, y, z); m.castShadow = !LOW; m.receiveShadow = true;
      parent.add(m); return m;
    };
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(H.x * 2, H.z * 2), matFloor);
    floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; world.add(floor);
    const ceil = new THREE.Mesh(new THREE.PlaneGeometry(H.x * 2, H.z * 2), matCeil);
    ceil.rotation.x = Math.PI / 2; ceil.position.y = H.h; world.add(ceil);
    // three solid walls (−x, −z, +x) with a painted dado
    walls.push(box(H.wall, H.h, H.z * 2, -H.x - H.wall / 2, H.h / 2, 0, matWall));
    walls.push(box(H.x * 2, H.h, H.wall, 0, H.h / 2, -H.z - H.wall / 2, matWall));
    walls.push(box(H.wall, H.h, H.z * 2, H.x + H.wall / 2, H.h / 2, 0, matWall));
    box(0.02, 1.1, H.z * 2, H.x - 0.01, 0.55, 0, matDado);
    box(H.x * 2, 1.1, 0.02, 0, 0.55, -H.z + 0.01, matDado);
    box(0.02, 1.1, H.z * 2, -H.x + 0.01, 0.55, 0, matDado);
    /* the +z side is OPEN — a Tekong cookhouse breathes: a parapet, pillars,
       a beam, and the camp beyond it */
    const parapet = box(H.x * 2, 1.05, 0.25, 0, 0.525, H.z + 0.125, matPillar);
    walls.push(parapet);
    for (let x = -H.x; x <= H.x + 0.01; x += 3.0) {
      const p = box(0.36, H.h, 0.36, x, H.h / 2, H.z + 0.12, matPillar);
      solids.push(p);
    }
    box(H.x * 2 + 0.4, 0.5, 0.4, 0, H.h - 0.25, H.z + 0.12, matPillar);
    // outside: a field and a far block, so the openings look onto something
    const field = new THREE.Mesh(new THREE.PlaneGeometry(80, 60), matGrass);
    field.rotation.x = -Math.PI / 2; field.position.set(0, -0.01, H.z + 30); field.receiveShadow = true;
    world.add(field);
    box(40, 12, 10, 4, 6, H.z + 34, matBlock);
    box(1.2, 5, 1.2, -14, 2.5, H.z + 12, matBlock);      // a lamp post
    box(1.2, 5, 1.2, 12, 2.5, H.z + 16, matBlock);

    /* fluorescent fittings: three rows of four, on the ceiling */
    const tubes = [], tubeLights = [];
    const TUBE_I = LOW ? 14 : 9;
    for (const z of [-4.2, 0, 4.2]) for (const x of [-6.5, -2.2, 2.2, 6.5]) {
      const f = box(1.3, 0.08, 0.2, x, H.h - 0.06, z, matFrame);
      const t = box(1.2, 0.03, 0.06, x, H.h - 0.11, z, matTube);
      tubes.push(t);
      if (Math.abs(x) < 3 || z === 0) {                  // eight lights, not twelve
        const L = new THREE.PointLight(0xfff3e0, TUBE_I, 9, 1.6);
        L.position.set(x, H.h - 0.3, z); world.add(L); tubeLights.push(L);
      }
    }

    /* ------------------------------------------------------- the servery */
    const counter = box(COUNTER.d, COUNTER.h, COUNTER.z1 - COUNTER.z0, COUNTER.x, COUNTER.h / 2, 0, matSteel);
    solids.push(counter);
    box(COUNTER.d + 0.1, 0.04, COUNTER.z1 - COUNTER.z0 + 0.1, COUNTER.x, COUNTER.h + 0.02, 0, matSteel);
    // bain-marie wells with something in them
    for (let z = COUNTER.z0 + 0.6; z < COUNTER.z1 - 0.3; z += 0.75) {
      box(0.5, 0.02, 0.6, COUNTER.x, COUNTER.h + 0.05, z, matFrame);
      box(0.42, 0.06, 0.52, COUNTER.x, COUNTER.h + 0.08, z, [matFood, matPlate, matCup][Math.floor(hash(z * 10, 3) * 3)]);
    }
    // the sneeze guard and its posts
    box(0.02, 0.45, COUNTER.z1 - COUNTER.z0, COUNTER.x + 0.3, COUNTER.h + 0.5, 0, matGlass);
    for (const z of [COUNTER.z0, 0, COUNTER.z1]) box(0.03, 0.55, 0.03, COUNTER.x + 0.3, COUNTER.h + 0.45, z, matFrame);
    // the kitchen wall behind: a hatch and the menu board
    box(3.2, 1.6, 0.06, -H.x + 0.04, 1.75, -1.0, matFrame);
    box(3.0, 1.4, 0.02, -H.x + 0.08, 1.75, -1.0, new THREE.MeshStandardMaterial({ color: 0x1c1f22, roughness: 0.9 }));
    const menu = new THREE.Mesh(new THREE.PlaneGeometry(2.0, 1.2), matMenu);
    menu.position.set(-H.x + 0.02, 2.2, 2.4); menu.rotation.y = Math.PI / 2; world.add(menu);
    // a stack of trays, a water dispenser, a bin
    box(0.5, 0.35, 0.36, -6.6, 0.175 + COUNTER.h, -4.6, matTray);
    box(0.45, 1.5, 0.45, -8.4, 0.75, 6.0, matSteel);
    box(0.5, 0.8, 0.5, 8.4, 0.4, 6.2, matFrame);

    /* ---------------------------------------------------------- the tables
       Chad's photograph: pink laminate tops on a steel frame with the benches
       attached. Four rows along x; the section's is ROW_Z[OURS]. */
    const tables = [];
    const trays = [];
    function mkTray(x, z, ry, dressed) {
      const g = new THREE.Group();
      g.position.set(x, TBL.top + 0.01, z); g.rotation.y = ry;
      const tr = box(0.42, 0.02, 0.30, 0, 0.01, 0, matTray, g);
      if (dressed) {
        const pl = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.09, 0.02, 14), matPlate);
        pl.position.set(-0.08, 0.03, 0.02); g.add(pl);
        const fd = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 6), matFood);
        fd.scale.set(1, 0.5, 1); fd.position.set(-0.08, 0.05, 0.02); g.add(fd);
        const cp = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.03, 0.09, 10), matCup);
        cp.position.set(0.13, 0.06, -0.06); g.add(cp);
        const sp = box(0.12, 0.006, 0.02, 0.10, 0.025, 0.08, matSteel, g);
        sp.rotation.y = 0.3;
      }
      world.add(g); trays.push(g); return g;
    }
    ROW_Z.forEach((z, ri) => {
      const cx = (TBL.x0 + TBL.x1) / 2, len = TBL.x1 - TBL.x0;
      const top = box(len, 0.04, TBL.w, cx, TBL.top - 0.02, z, matPink);
      const frame = new THREE.Group(); world.add(frame);
      for (const x of [TBL.x0 + 0.35, cx, TBL.x1 - 0.35]) {
        box(0.05, TBL.top - 0.04, 0.05, x, (TBL.top - 0.04) / 2, z - 0.25, matFrame, frame);
        box(0.05, TBL.top - 0.04, 0.05, x, (TBL.top - 0.04) / 2, z + 0.25, matFrame, frame);
        box(0.05, 0.05, TBL.bench * 2 + 0.2, x, 0.12, z, matFrame, frame);        // the foot rail the benches hang off
        for (const s of [-1, 1]) box(0.05, TBL.seat - 0.12, 0.05, x, (TBL.seat + 0.12) / 2, z + s * TBL.bench, matFrame, frame);
      }
      for (const s of [-1, 1]) box(len, 0.04, TBL.benchW, cx, TBL.seat, z + s * TBL.bench, matBench);
      tables.push({ top, z });
      // trays: every seat at ours, a scatter elsewhere
      for (const s of [-1, 1]) for (const x of [-1.6, 0.6, 2.8]) {
        const ours = ri === OURS;
        if (ours || hash(ri * 7 + x, 11) < 0.45) mkTray(x + (ours ? 0 : (hash(x, ri) - 0.5) * 0.3), z - s * 0.22, s > 0 ? Math.PI : 0, ours || hash(x, ri + 5) < 0.6);
      }
    });

    /* -------------------------------------------------- the seated section
       Six on `Sit_and_Doze_Off` (the take with no fold — v8.0's law), three
       a side, hips on the bench. One parse, six clones. A man who is asked
       SITS UP: his take crosses to `Chair_Sit_Idle_M` parked inside its
       upright window for the length of his line, then back to dozing. */
    const SEAT_X = [-1.6, 0.6, 2.8];
    const OURS_Z = ROW_Z[OURS];
    const SEATS = [];                                   // { x, z, ry, id }
    for (const [i, x] of SEAT_X.entries()) SEATS.push({ x, z: OURS_Z - TBL.bench, ry: 0, i });            // facing +z, into the table
    for (const [i, x] of SEAT_X.entries()) SEATS.push({ x, z: OURS_Z + TBL.bench, ry: Math.PI, i: i + 3 });
    const WHO = { buddy: 0, recruit: 2, bunkmate: 4 };  // which seat is whose
    const DOZE = 'Sit_and_Doze_Off', SITUP = 'Chair_Sit_Idle_M';
    const CULL_SPHERE = {
      admintee: { x: 0.067, y: 0.870, z: 0.011, r: 1.376 },
      encik2:   { x: 0.015, y: 0.832, z: -0.037, r: 1.253 },
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
    const seated = { rigs: [], ready: false, group: new THREE.Group() };
    world.add(seated.group);
    const proxies = SEATS.map(sp => {
      const p = new THREE.Mesh(new THREE.CapsuleGeometry(0.2, 0.7, 4, 8), matProxy);
      p.position.set(sp.x, 0.75, sp.z); p.castShadow = !LOW; seated.group.add(p); return p;
    });
    assetBytes('admintee').then(BUF => new GLTFLoader().parse(BUF, '', (gltf) => {
      if (!alive) return;
      rescueTextures(gltf, BUF);
      gltf.scene.traverse(o => { if (o.isMesh) { o.castShadow = !LOW; o.receiveShadow = false; } });
      wideBounds(gltf.scene, 'admintee');
      gltf.scene.updateMatrixWorld(true);
      const v = new THREE.Vector3(); let lo = Infinity, hi = -Infinity, crown = false;
      gltf.scene.traverse(o => { if (!o.isBone) return; o.getWorldPosition(v); lo = Math.min(lo, v.y); hi = Math.max(hi, v.y); if (/HeadTop_End/.test(o.name)) crown = true; });
      const s = 1.70 / (((hi - lo) / (crown ? 1 : 0.935)) || 1.7);
      const dozeClip = gltf.animations.find(a => a.name === DOZE) || gltf.animations[0];
      const sitClip = gltf.animations.find(a => a.name === SITUP) || dozeClip;
      SEATS.forEach((sp, i) => {
        const g = new THREE.Group();
        g.position.set(sp.x, 0, sp.z); g.rotation.y = sp.ry; g.scale.setScalar(s);
        const m = cloneSkinned(gltf.scene);
        wideBounds(m, 'admintee');
        g.add(m); seated.group.add(g);
        const mixer = new THREE.AnimationMixer(m);
        const doze = mixer.clipAction(dozeClip), sit = mixer.clipAction(sitClip);
        doze.play(); doze.time = dozeClip.duration * hash(i, 4);
        mixer.update(0.0001);
        /* hips on the bench: a seated take's legs fold under, so the man is
           grounded by his HIPS to the seat, not by his feet to the floor */
        m.updateMatrixWorld(true);
        let hip = null; m.traverse(o => { if (o.isBone && !hip && /Hips/.test(o.name)) hip = o; });
        if (hip) { hip.getWorldPosition(v); m.position.y += (TBL.seat + 0.10 - (v.y - g.position.y)) / s; }
        proxies[i].visible = false;
        seated.rigs.push({ g, m, mixer, doze, sit, up: false, rate: 0.85 + hash(i, 9) * 0.3 });
        doze.setEffectiveTimeScale(seated.rigs[i].rate);
      });
      seated.ready = true;
      redoShadows();
    }, (err) => { console.warn('admintee failed', err); seated.ready = true; }))
      .catch(err => { console.warn('admintee failed', err); seated.ready = true; });
    /* sit up for `secs`, then slump back. A hard cut to a frame inside the
       upright window, because a doze-to-sit crossfade passes through the
       fold the idle take carries. */
    function sitUp(i, secs, rate) {
      const r = seated.rigs[i];
      if (!r) return;
      r.sit.reset(); r.sit.setEffectiveTimeScale(rate || 0.55); r.sit.setEffectiveWeight(1);
      r.sit.play(); r.sit.time = r.sit.getClip().duration * 0.02;
      r.doze.stop(); r.mixer.update(0.0001);
      r.up = true;
      if (secs > 0) after(secs, () => { if (r.up) sitDown(i); });
    }
    function sitDown(i) {
      const r = seated.rigs[i];
      if (!r) return;
      r.doze.reset(); r.doze.setEffectiveTimeScale(r.rate); r.doze.setEffectiveWeight(1);
      r.doze.play(); r.doze.time = r.doze.getClip().duration * hash(i, 4);
      r.sit.stop(); r.mixer.update(0.0001);
      r.up = false;
    }
    function allSitDown() { seated.rigs.forEach((r, i) => { if (r.up) sitDown(i); }); }

    /* ----------------------------------------------------------- the encik */
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
      assetBytes(key).then(BUF => new GLTFLoader().parse(BUF, '', (gltf) => {
        if (!alive) return;
        rescueTextures(gltf, BUF);
        const g = gltf.scene;
        g.traverse(o => { if (o.isMesh) { o.castShadow = !LOW; o.receiveShadow = false; } });
        wideBounds(g, key);
        group.add(g); rig.model = g;
        if (gltf.animations && gltf.animations.length) {
          rig.mixer = new THREE.AnimationMixer(g);
          rig.acts = {};
          for (const clip of gltf.animations) rig.acts[clip.name] = rig.mixer.clipAction(clip);
          if (opts.idle && rig.acts[opts.idle]) { rig.play(opts.idle, 1, 0); rig.mixer.update(0.001); }
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
      }, (err) => { console.warn(key + ' failed to load', err); rig.ready = true; }))
        .catch(err => { console.warn(key + ' failed to load', err); rig.ready = true; });
      return rig;
    }
    const encik = mkRig('encik2', { x: ENC.x, z: ENC.z, ry: ENC.ry, height: 1.72, idle: 'Idle_9' });
    const ENC_TALK = ['Talk_with_Left_Hand_on_Hip', 'Talk_with_Left_Hand_Raised'];
    const putEncik = () => {
      encik.group.position.set(ENC.x, 0, ENC.z); encik.group.rotation.y = ENC.ry;
      if (encik.acts && encik.idle) encik.play(encik.idle, 1, 0);
    };

    /* ------------------------------------------------ THE NIGHT POCKET
       The bunk's corner at three in the morning, eighty metres off the
       cookhouse and outside its bounds: a slab, two walls, Chad's bunk bed
       with the pillow to the wall, the toilet door standing ajar with the
       block's cold light behind it, the clock, the fan. Every material is
       fog-free (the memory-bubble recipe), because the film shoots it under
       NIGHT fog from eighty metres out. */
    const pocket = new THREE.Group();
    pocket.position.set(PK.x, 0, PK.z);
    pocket.visible = false;
    world.add(pocket);
    const nf = (mat) => { const m = mat.clone(); m.fog = false; return m; };
    const pWall = nf(new THREE.MeshStandardMaterial({ color: 0xbdb6a4, roughness: 0.96 }));
    const pFloor = nf(new THREE.MeshStandardMaterial({ map: terrazzo, color: 0x8a8a86, roughness: 0.6 }));
    const pDark = nf(new THREE.MeshStandardMaterial({ color: 0x0a0c10, roughness: 1 }));
    const pDoor = nf(new THREE.MeshStandardMaterial({ color: 0x6f7a72, roughness: 0.7 }));
    const pGlow = nf(new THREE.MeshStandardMaterial({ color: 0x9fc4ff, emissive: 0x7fb0ff, emissiveIntensity: 1.6, roughness: 1 }));
    const pMat = nf(new THREE.MeshStandardMaterial({ color: 0x2f4a3c, roughness: 0.95 }));
    const pClock = nf(new THREE.MeshStandardMaterial({ map: clock.tex, emissiveMap: clock.tex, emissive: 0xffffff, emissiveIntensity: 0.30, roughness: 0.85, transparent: true }));
    const P = { x: 3.6, z: 3.0, h: 3.0 };
    const pf = new THREE.Mesh(new THREE.PlaneGeometry(P.x * 2, P.z * 2), pFloor);
    pf.rotation.x = -Math.PI / 2; pocket.add(pf);
    const pc = new THREE.Mesh(new THREE.PlaneGeometry(P.x * 2, P.z * 2), pWall);
    pc.rotation.x = Math.PI / 2; pc.position.y = P.h; pocket.add(pc);
    box(0.16, P.h, P.z * 2, -P.x - 0.08, P.h / 2, 0, pWall, pocket);            // −x wall, the bed's head
    const PDOOR = { x: -1.2, w: 0.9, h: 2.05 };
    box(P.x + PDOOR.x - PDOOR.w / 2, P.h, 0.16, (-P.x + PDOOR.x - PDOOR.w / 2) / 2, P.h / 2, P.z + 0.08, pWall, pocket);
    box(P.x - PDOOR.x - PDOOR.w / 2, P.h, 0.16, (PDOOR.x + PDOOR.w / 2 + P.x) / 2, P.h / 2, P.z + 0.08, pWall, pocket);
    box(PDOOR.w, P.h - PDOOR.h, 0.16, PDOOR.x, (P.h + PDOOR.h) / 2, P.z + 0.08, pWall, pocket);
    box(0.16, P.h, P.z * 2, P.x + 0.08, P.h / 2, 0, pDark, pocket);             // +x: the dark of the rest of the bunk
    box(P.x * 2, P.h, 0.16, 0, P.h / 2, -P.z - 0.08, pDark, pocket);
    // beyond the door: a lit box (the block) and the water's cold light
    box(2.4, P.h, 2.0, PDOOR.x, P.h / 2, P.z + 1.2, pGlow.clone(), pocket).material.emissiveIntensity = 0.5;
    const doorLight = new THREE.PointLight(0x8fb8ff, 0, 6, 1.5);
    doorLight.position.set(PDOOR.x, 1.4, P.z + 0.5); pocket.add(doorLight);
    const doorPivot = new THREE.Group();
    doorPivot.position.set(PDOOR.x + PDOOR.w / 2, 0, P.z); pocket.add(doorPivot);
    const doorLeaf = box(PDOOR.w, PDOOR.h, 0.05, -PDOOR.w / 2, PDOOR.h / 2, 0, pDoor, doorPivot);
    const DOOR_AJAR = -0.14, DOOR_OPEN = -0.62;           // negative swings the leaf into the block (v9.1)
    doorPivot.rotation.y = DOOR_AJAR;
    const nightLight = new THREE.PointLight(0x5f7bb8, 0, 9, 1.6);
    nightLight.position.set(0.5, 2.4, 0); pocket.add(nightLight);
    // the clock on the door wall, and the fan
    const clockFace = new THREE.Mesh(new THREE.CircleGeometry(0.19, 32), pClock);
    clockFace.position.set(1.2, 2.3, P.z - 0.03); clockFace.rotation.y = Math.PI; pocket.add(clockFace);
    const fan = new THREE.Group(); fan.position.set(0.2, P.h - 0.35, 0.3); pocket.add(fan);
    box(0.06, 0.35, 0.06, 0, 0.17, 0, pDoor, fan);
    const fanBlades = new THREE.Group(); fan.add(fanBlades);
    for (let i = 0; i < 3; i++) { const b = box(0.55, 0.01, 0.10, 0.3, 0, 0, pDoor, fanBlades); const w = new THREE.Group(); w.rotation.y = i * Math.PI * 2 / 3; w.add(b); fanBlades.add(w); }
    // his bed: the bunk with its pillow end to the −x wall
    const BED = { x: -2.45, z: 1.4, len: 1.9, wid: 0.9, low: 0.55, high: 1.55 };
    const bedGroup = new THREE.Group(); bedGroup.position.set(BED.x, 0, BED.z); pocket.add(bedGroup);
    const mattress = box(BED.len, 0.12, BED.wid, 0, BED.low - 0.06, 0, pMat, bedGroup);
    const mattressHi = box(BED.len, 0.12, BED.wid, 0, BED.high - 0.06, 0, pMat, bedGroup);
    const BUNK = { len: 2.004, wid: 1.313, deckLo: 0.592, deckHi: 1.575 };
    const BUNK_SX = BED.len / BUNK.len, BUNK_SZ = BED.wid / BUNK.wid;
    const BUNK_SY = (BED.high - BED.low) / (BUNK.deckHi - BUNK.deckLo);
    const BUNK_DY = BED.low - BUNK.deckLo * BUNK_SY;
    let bunkModel = null;
    assetBytes('bunkbed').then(BUF => new GLTFLoader().parse(BUF, '', (gltf) => {
      if (!alive) return;
      rescueTextures(gltf, BUF);
      const m = gltf.scene;
      m.traverse(o => { if (o.isMesh) { o.castShadow = false; o.receiveShadow = true; for (const mm of (Array.isArray(o.material) ? o.material : [o.material])) mm.fog = false; } });
      m.scale.set(BUNK_SX, BUNK_SY, BUNK_SZ); m.position.set(0, BUNK_DY, 0);
      bedGroup.add(m); bunkModel = m;
      mattress.visible = mattressHi.visible = false;
    })).catch(() => {});
    // the blanket over him, from the pillow
    const blanket = box(0.9, 0.05, 0.86, 0.45, BED.low + 0.08, 0, nf(new THREE.MeshStandardMaterial({ color: 0x3a5a48, roughness: 0.98 })), bedGroup);
    blanket.visible = false;

    // the pocket's mix: written into the chapter's declared beds
    let showerVol = 0, tickVol = 0;
    function mixBeds() {
      for (const b of DATA.ambience.beds) {
        if (b[0] === 'showerrun') b[1] = showerVol;
        if (b[0] === 'clocktick') b[1] = tickVol;
      }
    }
    function setNight(on) {
      pocket.visible = on;
      nightLight.intensity = on ? 4.6 : 0;
      doorLight.intensity = on ? 2.6 : 0;
      for (const L of tubeLights) L.intensity = on ? 0 : TUBE_I;
      for (const t of tubes) t.material.emissiveIntensity = on ? 0 : 1.4;
      showerVol = 0; tickVol = on ? 0.35 : 0; mixBeds();
      clock.set('03:00');
    }
    function setShower(on, vol = 0.6) { showerVol = on ? vol : 0; mixBeds(); }

    /* ----------------------------------------------------------- the pile
       The encik IS the pile: walk up, act, four choices. Offered only once
       the three men have been asked. */
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
    function pileInView() {
      if (phase !== 'encik') return false;
      if (pileDist() < 1.5) return true;
      const n = pileScreen();
      return n.z < 1 && Math.abs(n.x) < 0.97 && Math.abs(n.y) < 0.97;
    }
    function pointerHitsPile(cx, cy) {
      if (phase !== 'encik' || pileDist() > INTERACT_R) return false;
      const n = pileScreen();
      if (n.z > 1) return false;
      const sx = (n.x * 0.5 + 0.5) * innerWidth, sy = (-n.y * 0.5 + 0.5) * innerHeight;
      return Math.hypot(cx - sx, cy - sy) < Math.min(innerWidth, innerHeight) * 0.16;
    }
    function interactPile() {
      if (getState() !== 'play' || phase !== 'encik' || pileDist() >= INTERACT_R) return false;
      startDecision();
      return true;
    }

    /* ------------------------------------------------------------- the day
       Two phases: `ask` (the three men, in any order) and `encik`. The men
       already asked ride in the phase string — `ask:buddy,recruit` — so a
       resume lands on the same count (v7.3's law). */
    let phase = 'ask';
    let booted = false;
    const dayClock = { t: 0 };
    let lastWall = 0;
    const todo = [];
    function after(secs, fn) { todo.push({ at: dayClock.t + secs, fn }); todo.sort((a, b) => a.at - b.at); }
    function runTodo() { while (todo.length && todo[0].at <= dayClock.t) todo.shift().fn(); }
    function dropTodo() { todo.length = 0; }
    const asked = new Set();
    const ASK_ORDER = ['buddy', 'bunkmate', 'recruit'];

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
    if (warmSounds) warmSounds(['b2hear', 'k2three', 'r2siao']);

    function setPhase(p) { phase = p; if (kit) kit.setPhase(p === 'ask' ? 'ask:' + [...asked].join(',') : p); }
    function objAsk() {
      if (!kit) return;
      kit.objective(DATA.words.objAsk.replace('{n}', String(asked.size)));
      kit.waypoint(null);
    }
    function objEncik() {
      if (!kit) return;
      kit.objective(DATA.words.objEncik);
      kit.waypoint({ x: ENC.x - 0.6, y: 1.2, z: ENC.z + 0.6 });
    }
    function askOne(id, line) {
      const seat = WHO[id];
      const ok = sayLine(line, 1, () => sitUp(seat, (SECS[line] || 3) + 0.6));
      if (!ok) return false;
      if (asked.has(id)) return true;
      asked.add(id);
      setPhase('ask');
      objAsk();                                  // 1/3, 2/3, 3/3 — each a beat
      if (asked.size >= 3) after(1.8, () => { if (phase === 'ask') { setPhase('encik'); objEncik(); } });
      return true;
    }
    function applyPhase(p) {
      asked.clear();
      if (typeof p === 'string' && p.startsWith('ask:')) {
        for (const id of p.slice(4).split(',')) if (WHO[id] !== undefined) asked.add(id);
      }
      if (p === 'encik' || asked.size >= 3) { for (const id of ASK_ORDER) asked.add(id); setPhase('encik'); objEncik(); return; }
      setPhase('ask'); objAsk();
    }

    /* ------------------------------------------------------------ hotspots */
    const hotspots = [
      { id: 'buddy', pos: { x: SEATS[WHO.buddy].x, y: 1.15, z: SEATS[WHO.buddy].z }, radius: 2.0, prompt: DATA.words.hotBuddy,
        enabled: () => phase === 'ask' && !asked.has('buddy'),
        onInteract() { return askOne('buddy', 'b2hear'); } },
      { id: 'bunkmate', pos: { x: SEATS[WHO.bunkmate].x, y: 1.15, z: SEATS[WHO.bunkmate].z }, radius: 2.0, prompt: DATA.words.hotBunkmate,
        enabled: () => phase === 'ask' && !asked.has('bunkmate'),
        onInteract() { return askOne('bunkmate', 'k2three'); } },
      { id: 'recruit', pos: { x: SEATS[WHO.recruit].x, y: 1.15, z: SEATS[WHO.recruit].z }, radius: 2.0, prompt: DATA.words.hotRecruit,
        enabled: () => phase === 'ask' && !asked.has('recruit'),
        onInteract() { return askOne('recruit', 'r2siao'); } }
    ];

    /* ---------------------------------------------------------- per frame */
    function updateNotes(dt, t) {
      // the mixers run in every state (v5.19): a cutscene owns the poses, never the clocks
      for (const r of seated.rigs) if (r.mixer && seated.group.visible) r.mixer.update(dt);
      if (encik.mixer && encik.group.visible) encik.mixer.update(dt);
      if (pocket.visible) fanBlades.rotation.y += dt * 6.5;
      if (getState() !== 'play') { lastWall = 0; return; }
      // the chapter's clock runs on WALL time (v7.1's law), only in play
      const now = performance.now() / 1000;
      if (lastWall) dayClock.t += Math.min(0.5, now - lastWall);   // capped at half a second a frame, as e2c1's is, so a stalled tab never skips a beat
      lastWall = now;
      if (!booted) { booted = true; applyPhase(kit ? kit.getPhase() : null); }
      runTodo(); runSpeak();
    }
    function updatePile(t) {
      if (getState() === 'cine') { pileRing.visible = false; return; }
      const on = phase === 'encik';
      const near = THREE.MathUtils.clamp((7 - pileDist()) / (7 - INTERACT_R), 0, 1);
      pileRing.visible = on && near > 0.01;
      pileRing.material.opacity = near * (0.5 + 0.3 * Math.sin(t * 2.6));
    }
    function updateFire(t) {
      if (getState() === 'cine' || pocket.visible) return;
      const fl = 1 - (Math.random() < 0.015 ? 0.08 : 0);
      for (const L of tubeLights) L.intensity = TUBE_I * fl;
    }
    function updateSlow() {}

    /* ---------------------------------------------------------- lifecycle */
    function snap() {
      return { night: pocket.visible, door: doorPivot.rotation.y, blanket: blanket.visible,
               showerVol, tickVol, up: seated.rigs.map(r => r.up) };
    }
    function restore(s) {
      setNight(!!s.night);
      doorPivot.rotation.y = s.door; blanket.visible = !!s.blanket;
      showerVol = s.showerVol || 0; tickVol = s.tickVol || 0; mixBeds();
      allSitDown();
      putEncik();
      encik.group.visible = true;
    }
    function reset() {
      setNight(false); doorPivot.rotation.y = DOOR_AJAR; blanket.visible = false;
      allSitDown(); putEncik(); encik.group.visible = true;
      dropTodo(); speakReset();
      asked.clear(); booted = false; dayClock.t = 0; lastWall = 0;
      if (kit) { kit.daylight(null, 0); kit.presence(0); kit.setPhase('ask:'); }
      phase = 'ask';
    }
    function blockers() {
      const out = [];
      const b = (o, pad = 0.20) => { o.updateWorldMatrix(true, false); const bb = new THREE.Box3().setFromObject(o); bb.expandByScalar(pad); out.push(bb); };
      const solid = (o, pad = 0.14) => { o.updateWorldMatrix(true, false); const bb = new THREE.Box3().setFromObject(o); bb.expandByScalar(pad); bb.min.y = 0; bb.max.y = Math.max(bb.max.y, 1.40); out.push(bb); };
      for (const w of walls) b(w);
      for (const s of solids) solid(s);
      // a table and its two benches are one column
      for (const tb of tables) {
        const bb = new THREE.Box3(new THREE.Vector3(TBL.x0 - 0.14, 0, tb.z - TBL.bench - TBL.benchW / 2 - 0.14),
                                  new THREE.Vector3(TBL.x1 + 0.14, 1.40, tb.z + TBL.bench + TBL.benchW / 2 + 0.14));
        out.push(bb);
      }
      // the encik: nobody walks through him
      out.push(new THREE.Box3(new THREE.Vector3(ENC.x - 0.42, 0, ENC.z - 0.42), new THREE.Vector3(ENC.x + 0.42, 1.8, ENC.z + 0.42)));
      return out;
    }
    function dispose() {
      alive = false;
      const geos = new Set(), mats = new Set();
      world.traverse(o => {
        if (o.geometry) geos.add(o.geometry);
        if (o.material) for (const m of (Array.isArray(o.material) ? o.material : [o.material])) mats.add(m);
      });
      scene.remove(world);
      for (const o of owned) { o.parent?.remove(o); o.dispose?.(); }
      owned.length = 0;
      encik.mixer?.stopAllAction();
      for (const r of seated.rigs) r.mixer?.stopAllAction();
      for (const g of geos) g.dispose();
      for (const m of mats) {
        for (const k of ['map', 'roughnessMap', 'normalMap', 'emissiveMap', 'alphaMap']) m[k]?.dispose?.();
        m.dispose();
      }
      for (const t of [noteTex, terrazzo, pinkTex, menuTex, clock.tex]) t?.dispose?.();
      world.clear();
      S = null;
    }

    const readyAt = performance.now();
    return (S = {
      world, noteTex, blockers: blockers(),
      ready: () => (encik.ready && seated.ready) || performance.now() - readyAt > 12000,
      pile: { pos: PILE_POS, radius: INTERACT_R, group: pile,
              dist: pileDist, screen: pileScreen, inView: pileInView,
              hits: pointerHitsPile, interact: interactPile,
              glow: () => pileRing.material.opacity },
      drum: doorPivot, ash: null, embers: null, heroNote: null, smoke: null, flying: null,
      jossTips: [], fireLight: tubeLights[0],
      get noteStorm() { return 1; },
      set noteStorm(v) {},
      // the chapter's own
      H, TBL, ROW_Z, OURS, SEATS, WHO, ENC, PK, P, BED, PDOOR, DOOR_AJAR, DOOR_OPEN,
      encik, ENC_TALK, seated, sitUp, sitDown, allSitDown,
      pocket, setNight, setShower, doorPivot, doorLight, nightLight, clock, clockFace, blanket, fanBlades,
      tubeLights, tubes,
      sayLine, asked, after, dayClock,
      get phase() { return phase; },
      setPhase, applyPhase,
      askInfo: () => ({ phase, asked: [...asked], obj: kit && kit.getPhase ? kit.getPhase() : null }),
      speakInfo: () => ({ t: +dayClock.t.toFixed(2), until: +speak.until.toFixed(2), pending: speak.pending ? speak.pending.name : null }),
      updateNotes, updatePile, updateFire, updateSlow,
      setNoteTexture() {},
      snap, restore, reset, dispose,
      hotspots
    });
  }

  /* ---------------------------------------------------------- textures ---- */
  function makeTerrazzo(THREE, cnv) {
    const s = 512, [c, ctx] = cnv(s);
    ctx.fillStyle = '#b9b3a4'; ctx.fillRect(0, 0, s, s);
    for (let i = 0; i < 2600; i++) {
      const v = 120 + Math.floor(hash(i, 1) * 90);
      ctx.fillStyle = `rgba(${v},${v - 6},${v - 14},0.9)`;
      ctx.fillRect(hash(i, 2) * s, hash(i, 3) * s, 1 + hash(i, 4) * 3, 1 + hash(i, 5) * 3);
    }
    ctx.strokeStyle = 'rgba(60,60,60,0.35)'; ctx.lineWidth = 2; ctx.strokeRect(1, 1, s - 2, s - 2);
    const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(18, 14);
    t.colorSpace = THREE.SRGBColorSpace; return t;
  }
  function makeLaminate(THREE, cnv) {
    const s = 256, [c, ctx] = cnv(s);
    ctx.fillStyle = '#d98ba1'; ctx.fillRect(0, 0, s, s);
    for (let i = 0; i < 900; i++) {
      ctx.fillStyle = `rgba(255,255,255,${0.04 + hash(i, 21) * 0.08})`;
      ctx.fillRect(hash(i, 22) * s, hash(i, 23) * s, 2, 2);
    }
    const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(6, 1);
    t.colorSpace = THREE.SRGBColorSpace; return t;
  }
  function makeMenu(THREE, cnv) {
    const s = 512, [c, ctx] = cnv(s);
    ctx.fillStyle = '#f4f1e6'; ctx.fillRect(0, 0, s, s);
    ctx.strokeStyle = '#22303c'; ctx.lineWidth = 8; ctx.strokeRect(12, 12, s - 24, s - 24);
    ctx.fillStyle = '#22303c'; ctx.textAlign = 'center';
    ctx.font = 'bold 54px sans-serif'; ctx.fillText('BREAKFAST', s / 2, 96);
    ctx.font = '38px sans-serif';
    ['Bee hoon · Egg', 'Bread · Kaya', 'Milo · Coffee', '0600 – 0700'].forEach((l, i) => ctx.fillText(l, s / 2, 190 + i * 72));
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
  }
  /* an analog wall clock whose set('HH:MM') parses the string into hand angles */
  function makeClock(THREE, cnv) {
    const w = 256, [c, ctx] = cnv(w);
    const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace;
    const cx = w / 2, cy = w / 2, R = w / 2;
    const hand = (a, len, wid, col, back) => {
      ctx.strokeStyle = col; ctx.lineWidth = wid; ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(cx - Math.sin(a) * back, cy + Math.cos(a) * back);
      ctx.lineTo(cx + Math.sin(a) * len, cy - Math.cos(a) * len);
      ctx.stroke();
    };
    const set = (text) => {
      const m = /^(\d{1,2}):(\d{2})$/.exec(String(text || '')) || [0, 0, 0];
      const hh = (+m[1] || 0) % 12, mm = +m[2] || 0;
      ctx.clearRect(0, 0, w, w);
      ctx.fillStyle = '#20242a'; ctx.beginPath(); ctx.arc(cx, cy, R - 3, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#f2efe6'; ctx.beginPath(); ctx.arc(cx, cy, R - 14, 0, Math.PI * 2); ctx.fill();
      for (let i = 0; i < 60; i++) {
        const a = i / 60 * Math.PI * 2, big = i % 5 === 0;
        const r0 = R - 22, r1 = r0 - (big ? 16 : 7);
        ctx.strokeStyle = big ? '#1b1f24' : '#8b8f95'; ctx.lineWidth = big ? 5 : 2;
        ctx.beginPath(); ctx.moveTo(cx + Math.sin(a) * r0, cy - Math.cos(a) * r0); ctx.lineTo(cx + Math.sin(a) * r1, cy - Math.cos(a) * r1); ctx.stroke();
      }
      ctx.fillStyle = '#1b1f24'; ctx.font = 'bold 26px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      for (let n = 1; n <= 12; n++) { const a = n / 12 * Math.PI * 2, r = R - 52; ctx.fillText(String(n), cx + Math.sin(a) * r, cy - Math.cos(a) * r + 1); }
      hand((hh + mm / 60) / 12 * Math.PI * 2, R - 92, 11, '#1b1f24', 16);
      hand(mm / 60 * Math.PI * 2, R - 40, 8, '#1b1f24', 20);
      hand(Math.PI * 1.2, R - 34, 3, '#c0392b', 24);
      ctx.fillStyle = '#1b1f24'; ctx.beginPath(); ctx.arc(cx, cy, 8, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#c0392b'; ctx.beginPath(); ctx.arc(cx, cy, 4, 0, Math.PI * 2); ctx.fill();
      tex.needsUpdate = true;
    };
    set('03:00');
    return { tex, set };
  }

  /* ------------------------------------------------------------ THE FILM
     Fifty seconds. The same corner of the bunk, four nights, four angles —
     from the pillow, from the floor, from the ceiling's corner, and the clock
     itself — and every one of them at three in the morning, with the water
     starting on the hour. Then black, his line, and the cookhouse in daylight
     with the section already at the table. It begins on BLACK and lifts on
     its own fade (cinetest's contract). */
  const pk = (stage, x, y, z) => ({ x: stage.PK.x + x, y, z: stage.PK.z + z });
  function intro(c, s, api) {
    const { tr, step, sfx, fade, camTo, yawTo, pitchTo, faceFrom, rawK, smoothK, duck, stage, armR, kit } = api;
    const DOOR = pk(stage, stage.PDOOR.x, 1.0, stage.P.z);
    const CLOCK = pk(stage, 1.2, 2.3, stage.P.z);
    const PILLOW = pk(stage, stage.BED.x - 0.62, stage.BED.low + 0.36, stage.BED.z);
    const FLOOR = pk(stage, 2.3, 0.32, -0.9);
    const HIGH = pk(stage, 2.7, 2.55, 2.3);
    const ATCLOCK = pk(stage, 1.2, 2.25, stage.P.z - 0.82);
    const BEDAT = pk(stage, stage.BED.x, 0, stage.BED.z);
    const SPAWN = { x: DATA.spawn.x, y: 1.62, z: DATA.spawn.z };
    const Y_PIL = faceFrom(PILLOW.x, PILLOW.z, DOOR.x, DOOR.z);
    const Y_FLOOR = faceFrom(FLOOR.x, FLOOR.z, DOOR.x, DOOR.z);
    const Y_HIGH = faceFrom(HIGH.x, HIGH.z, BEDAT.x, BEDAT.z);
    const Y_HIGH2 = faceFrom(HIGH.x, HIGH.z, DOOR.x, DOOR.z);
    const Y_CLOCK = faceFrom(ATCLOCK.x, ATCLOCK.z, CLOCK.x, CLOCK.z);
    const Y_HALL = DATA.spawn.rot;

    step(0, () => {
      armR.visible = false;
      if (kit) kit.daylight(NIGHT, 0);
      stage.setNight(true);
      stage.blanket.visible = true;
      duck('cookamb', 0);
      stage.doorPivot.rotation.y = stage.DOOR_AJAR;
      stage.clock.set('03:00');
    });
    fade(0.0, 0.3, 1, 1);
    /* NIGHT ONE (0.3–10.2) — from the pillow, along the room to the door.
       The water starts at five. */
    fade(0.3, 2.6, 1, 0);
    camTo(0, 10.2, PILLOW, PILLOW, rawK);
    yawTo(0, 10.2, Y_PIL - 0.22, Y_PIL + 0.04, smoothK);
    pitchTo(0, 10.2, 0.02, 0.05, smoothK);
    step(5.0, () => stage.setShower(true, 0.55));
    sfx(5.0, 'drip', 0.5);
    sfx(6.6, 'bunkcreak', 0.35);
    fade(9.3, 10.2, 0, 1);
    /* NIGHT TWO (10.2–19.0) — from the floor across the room: the light
       under the door, the water already running. */
    step(10.2, () => { stage.setShower(true, 0.7); stage.doorLight.intensity = 3.4; });
    camTo(10.2, 19.0, FLOOR, { x: FLOOR.x - 0.25, y: FLOOR.y, z: FLOOR.z + 0.1 }, smoothK);
    yawTo(10.2, 19.0, Y_FLOOR, Y_FLOOR, rawK);
    pitchTo(10.2, 19.0, 0.10, 0.06, smoothK);
    fade(10.2, 11.4, 1, 0);
    sfx(14.5, 'drip', 0.45);
    fade(18.0, 19.0, 0, 1);
    /* NIGHT THREE (19.0–27.6) — from the ceiling's corner, down over the bed
       to the door, which opens a hand's width by itself. */
    step(19.0, () => { stage.setShower(true, 0.5); stage.doorLight.intensity = 2.6; stage.doorPivot.rotation.y = stage.DOOR_AJAR; });
    camTo(19.0, 27.6, HIGH, HIGH, rawK);
    yawTo(19.0, 27.6, Y_HIGH, Y_HIGH2, smoothK);
    pitchTo(19.0, 27.6, -0.62, -0.30, smoothK);
    fade(19.0, 20.2, 1, 0);
    sfx(22.6, 'dooropen2', 0.32);
    tr(22.6, 25.0, k => { stage.doorPivot.rotation.y = stage.DOOR_AJAR + (stage.DOOR_OPEN - stage.DOOR_AJAR) * 0.55 * k; }, smoothK);
    sfx(24.4, 'dread', 0.5);
    fade(26.6, 27.6, 0, 1);
    /* NIGHT FOUR (27.6–35.0) — the clock, full frame. 02:59; the minute hand
       moves; the water starts on the hour. */
    step(27.6, () => { stage.setShower(false); stage.doorPivot.rotation.y = stage.DOOR_AJAR; stage.doorLight.intensity = 1.8; stage.clock.set('02:59'); });
    camTo(27.6, 35.0, ATCLOCK, { x: ATCLOCK.x, y: ATCLOCK.y, z: ATCLOCK.z + 0.12 }, smoothK);
    yawTo(27.6, 35.0, Y_CLOCK, Y_CLOCK, rawK);
    pitchTo(27.6, 35.0, 0.03, 0.03, rawK);
    fade(27.6, 28.8, 1, 0);
    step(31.2, () => { stage.clock.set('03:00'); stage.setShower(true, 0.8); });
    sfx(31.2, 'boom', 0.28);
    sfx(31.4, 'dread', 0.7);
    fade(34.0, 35.0, 0, 1);
    /* 35–43 black: the water fades, his line. */
    tr(35.0, 37.5, k => { stage.setShower(true, 0.8 * (1 - k)); }, rawK);
    sfx(36.2, 'n2pro');                          // 6.72 s → 42.9
    /* 43.2 THE COOKHOUSE, in daylight, the section already at the table */
    step(43.2, () => {
      stage.setNight(false);
      stage.blanket.visible = false;
      if (kit) kit.daylight(null, 0);
      duck('cookamb', 1);
    });
    camTo(43.2, 49.4, SPAWN, { x: SPAWN.x + 0.9, y: 1.62, z: SPAWN.z }, smoothK);
    yawTo(43.2, 49.4, Y_HALL + 0.18, Y_HALL - 0.06, smoothK);
    pitchTo(43.2, 49.4, -0.02, -0.02, rawK);
    fade(43.2, 45.4, 1, 0);
    fade(48.6, 50.2, 0, 1);
    step(50.4, () => { armR.visible = true; });
    c.endFade = 1;
    c.keepFade = true;
  }

  /* ---------------------------------------------------------- the scenes
     All four from where the player stands in front of the encik, whose line
     rides one of his two talk takes. The hands go away (the v4.91 rule) and
     come back on the last step. His ask is the first cue of every scene. */
  const P = (s) => ({ x: s.yawPos.x, y: s.yawPos.y, z: s.yawPos.z });
  const encSay = (stage, sfx, step, after, at, name, secs, take) => {
    sfx(at, name);
    step(at, () => { stage.encik.play(take, 1, 0.3); });
    step(at + secs + 0.2, () => { if (stage.encik.cur === take) stage.encik.play('Idle_9', 1, 0.4); });
  };

  /* A · "ENCIK, SOMETHING HAPPENED. I DON'T KNOW WHAT." (19.5 s) He doesn't
     laugh. His answer, and then he walks off along the wall; the table is
     still noisy behind you. Nothing changed, which is the point. */
  function scTell(c, s, api) {
    const { tr, step, sfx, fade, yawTo, pitchTo, faceFrom, rawK, smoothK, duck, stage, handsRoot, yaw } = api;
    const P0 = P(s);
    const E = stage.ENC;
    const AWAY = { x: E.x - 5.6, z: E.z + 0.2 };
    const Y_E = faceFrom(P0.x, P0.z, E.x, E.z);
    step(0, () => { handsRoot.visible = false; });
    yawTo(0, 1.0, s.yawRot, Y_E, smoothK);
    pitchTo(0, 1.0, s.pitchX, 0.04, smoothK);
    sfx(0.5, 'n2askA');                          // 3.52 s → 4.0
    encSay(stage, sfx, step, null, 4.6, 'e2A', 9.92, stage.ENC_TALK[0]);   // → 14.5
    /* 14.9 he goes: a turn, then the walk take along the wall, out of the corner */
    step(14.9, () => { stage.encik.play('Walking', 1, 0.3); });
    tr(14.9, 18.6, k => {
      const g = stage.encik.group;
      g.position.x = E.x + (AWAY.x - E.x) * k; g.position.z = E.z + (AWAY.z - E.z) * k;
      g.rotation.y = Math.atan2(AWAY.x - E.x, AWAY.z - E.z);
    }, rawK);
    /* the lens FOLLOWS him — his bearing from the player is not linear in
       the walk, so the yaw is read off his real position every frame */
    tr(14.9, 18.6, () => { const g = stage.encik.group.position; yaw.rotation.y = faceFrom(P0.x, P0.z, g.x, g.z); }, rawK);
    tr(12.0, 18.0, k => { duck('cookamb', 1 + 0.25 * k); }, rawK);     // the table has not noticed anything
    fade(17.6, 19.0, 0, 1);
    step(19.3, () => { handsRoot.visible = true; });
    c.endFade = 1;
  }

  /* B · "ENCIK, THE BUNK IS HAUNTED. I'M SURE." (17.5 s, critical) "You saw?"
     "No, but—" "Don't talk cock! Go back and eat your breakfast!" The whole
     table has gone quiet — every head up, turned. His line to himself. */
  function scSure(c, s, api) {
    const { tr, step, sfx, fade, yawTo, pitchTo, faceFrom, rawK, smoothK, duck, stage, handsRoot } = api;
    const P0 = P(s);
    const E = stage.ENC;
    const T = { x: 0.6, z: stage.ROW_Z[stage.OURS] };
    const Y_E = faceFrom(P0.x, P0.z, E.x, E.z), Y_T = faceFrom(P0.x, P0.z, T.x, T.z);
    step(0, () => { handsRoot.visible = false; });
    yawTo(0, 1.0, s.yawRot, Y_E, smoothK);
    pitchTo(0, 1.0, s.pitchX, 0.04, smoothK);
    sfx(0.5, 'n2askB');                          // 2.32 s → 2.8
    encSay(stage, sfx, step, null, 3.4, 'e2saw', 0.88, stage.ENC_TALK[1]);     // → 4.3
    sfx(4.8, 'n2nobut');                         // 1.68 s → 6.5
    encSay(stage, sfx, step, null, 6.6, 'e2cock', 3.04, stage.ENC_TALK[0]);    // → 9.6
    /* the room hears it: the clatter dies, six heads come up */
    tr(7.4, 9.2, k => { duck('cookamb', 1 - 0.85 * k); }, rawK);
    step(8.2, () => { for (let i = 0; i < stage.SEATS.length; i++) stage.sitUp(i, 0, 0.35 + (i % 3) * 0.1); });
    yawTo(9.8, 12.8, Y_E, Y_T, smoothK);          // a half turn: the table is behind him
    pitchTo(9.8, 12.8, 0.04, -0.06, smoothK);
    sfx(11.8, 'n2B1');                           // 2.72 s → 14.5
    fade(15.4, 16.9, 0, 1);
    step(17.3, () => { handsRoot.visible = true; stage.allSitDown(); });
    c.endFade = 1;
  }

  /* C · "NEVER MIND ENCIK, I THINK I WAS JUST TIRED." (20.8 s) He looks at
     you a beat too long. "Ok." Cut to three in the morning: it starts again,
     and you are awake, and you know you were not tired. */
  function scNever(c, s, api) {
    const { tr, step, sfx, fade, camTo, yawTo, pitchTo, faceFrom, rawK, smoothK, duck, stage, handsRoot, kit } = api;
    const P0 = P(s);
    const E = stage.ENC;
    const dx = E.x - P0.x, dz = E.z - P0.z, d = Math.hypot(dx, dz);
    const NEAR = { x: E.x - dx / d * 1.05, y: 1.60, z: E.z - dz / d * 1.05 };
    const Y_E = faceFrom(P0.x, P0.z, E.x, E.z);
    const DOOR = pk(stage, stage.PDOOR.x, 1.0, stage.P.z);
    const PILLOW = pk(stage, stage.BED.x - 0.62, stage.BED.low + 0.36, stage.BED.z);
    const Y_PIL = faceFrom(PILLOW.x, PILLOW.z, DOOR.x, DOOR.z);
    step(0, () => { handsRoot.visible = false; });
    yawTo(0, 1.0, s.yawRot, Y_E, smoothK);
    pitchTo(0, 1.0, s.pitchX, 0.04, smoothK);
    sfx(0.5, 'n2askC');                          // 2.96 s → 3.5
    /* the look: a slow push in on him, and nothing from him */
    camTo(3.6, 8.0, P0, NEAR, smoothK);
    pitchTo(3.6, 8.0, 0.04, 0.10, smoothK);
    encSay(stage, sfx, step, null, 8.2, 'e2ok', 0.64, stage.ENC_TALK[1]);      // → 8.9
    fade(10.2, 11.2, 0, 1);
    /* 11.2 THREE IN THE MORNING */
    step(11.2, () => {
      if (kit) kit.daylight(NIGHT, 0);
      stage.setNight(true); stage.blanket.visible = true;
      stage.doorPivot.rotation.y = stage.DOOR_AJAR;
      duck('cookamb', 0);
      stage.clock.set('03:00');
    });
    camTo(11.2, 20.8, PILLOW, PILLOW, rawK);
    yawTo(11.2, 20.8, Y_PIL - 0.15, Y_PIL + 0.05, smoothK);
    pitchTo(11.2, 20.8, 0.02, 0.04, smoothK);
    fade(11.2, 12.6, 1, 0);
    step(13.6, () => stage.setShower(true, 0.7));
    sfx(13.6, 'dread', 0.6);
    sfx(15.6, 'n2C1');                           // 1.76 s → 17.4
    sfx(18.2, 'drip', 0.5);
    fade(18.8, 20.2, 0, 1);
    step(20.6, () => { handsRoot.visible = true; stage.setNight(false); stage.blanket.visible = false; if (kit) kit.daylight(null, 0); duck('cookamb', 1); });
    c.endFade = 1;
  }

  /* D · "ENCIK, WHAT DO YOU THINK IT IS?" (16.0 s) His non-answer in his two
     talking takes, and then the shrug: the episode's whole lesson, said early,
     by a man with twenty years. */
  function scAsk(c, s, api) {
    const { step, sfx, fade, yawTo, pitchTo, faceFrom, smoothK, stage, handsRoot } = api;
    const P0 = P(s);
    const E = stage.ENC;
    const Y_E = faceFrom(P0.x, P0.z, E.x, E.z);
    step(0, () => { handsRoot.visible = false; });
    yawTo(0, 1.0, s.yawRot, Y_E, smoothK);
    pitchTo(0, 1.0, s.pitchX, 0.04, smoothK);
    sfx(0.5, 'n2askD');                          // 1.92 s → 2.4
    encSay(stage, sfx, step, null, 3.0, 'e2D1', 3.92, stage.ENC_TALK[0]);     // → 6.9
    encSay(stage, sfx, step, null, 7.6, 'e2D2', 6.24, stage.ENC_TALK[1]);     // → 13.8
    fade(14.4, 15.8, 0, 1);
    step(16.0, () => { handsRoot.visible = true; });
    c.endFade = 1;
  }

  (window.__CHAPTERS__ = window.__CHAPTERS__ || {}).e2c2 = Object.assign(DATA, {
    build,
    intro,
    scenes: [scTell, scSure, scNever, scAsk]
  });
})();
