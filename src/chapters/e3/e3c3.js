/* Episode 3 · Chapter 3 · "The Dance On Buddha Day"
   ---------------------------------------------------------------------------
   THE THIRD CHAPTER OF CASE FILE 3, "How It All Began" — S1·08, "The Journey
   To Seek The Truth". Buddha Day, in Singapore, at an amulet shop he often
   visits. Paying respect to the main Buddha, something comes into his body:
   fully conscious, he cannot stop himself, and what the body performs is a
   traditional dance, "as though dancing for the god to see". People rush in
   and cannot stop him; they give up and let him dance for fifteen minutes;
   afterwards they urge him to see a medium that night. At the medium the same
   presence walks him forward and BOWS him; the medium says, without much
   hesitation, that it is a ghost possessing him — and the nature of it
   changes: something monkey-like comes through and he ROARS at the man.

   THE EPISODE'S AXIS IS CONTROL. Chapter 1 was ASKING, chapter 2 HANDS (the
   player could fight them). This is VOICE: the player cannot stop the body
   at all — only stay aware of what is around him (the STAY PRESENT minigame,
   the case file's own "I was conscious the whole time") — and at the medium
   his legs walk him forward on their own.

   TWO PLACES, one chapter (Chad, 19 Oct 2026: "The player still gets to
   browse the amulet shop in play, get the lp tim amulet. And then the buddha
   day celebration starts, and that's when the trance begins. Then cutscene
   takes over, and the staff and customers urge him to see a medium, and the
   player is then transported to the next playable section with the chinese
   medium scene"):
   - WORLD A, the amulet shop in an old Singapore mall, Buddha Day noon: the
     owner gives him the LP Tim Khun Paen, the celebration's chant, the trance
     beginning in play, and the cutscene taking over (`kit.film`, the
     twenty-sixth seam — a cutscene from PLAY that hands back to PLAY).
   - WORLD B, a shophouse shrine that night, a pocket past the far plane: the
     incense, the wait, two readings given with complete certainty, the walk
     he cannot stop, the bow, "It is a ghost possessing you", the roar.

   The four options are the approved plan's (docs/V16.0-EPISODE3-PLAN.md §3,
   chapter 3): accept it whole (bad), tell him he is wrong (worst), thank him
   and put it out of mind (good), thank him and hold his reading as one view,
   and keep seeking (best — the case file's own lesson). The teaching is
   S1·08's lesson, verbatim.

   docs/V21.0-E3C3-PLAN.md is the build's memory.                           */

(() => {
  'use strict';

  let S = null;

  const DATA = {
    id: 3,
    episode: 3,
    title: 'The Dance On Buddha Day',
    cardLabel: 'Chapter 3',
    cardTitle: 'The Dance On Buddha Day',
    brief: 'Buddha Day, at the amulet shop you often visit in Singapore. Look around, see the owner at his counter, and join his chanting at the altar.',
    prompt: 'The medium has given his reading, and something roared back at him through you. What do you do with what he said?',
    choices: [
      { k: 'A', text: 'Accept it: it is a ghost. Do every ritual he says.',
        d: { sanity: -9, awareness: 6, wisdom: -12 }, verdict: 'bad',
        say: 'I took his word, and did everything he said.',
        teach: 'A reading is one person\'s understanding, through their own training. Taken whole, the first explanation ends the search before it begins.' },
      { k: 'B', text: 'Tell him he is wrong.',
        d: { sanity: -18, awareness: -9, wisdom: -27 }, verdict: 'worst', critical: true,
        say: 'I told him he was wrong.',
        teach: 'Answering one certainty with another is the same mistake, and provoking what you cannot identify is never safe.' },
      { k: 'C', text: 'Thank him, leave, and put it out of mind.',
        d: { sanity: 9, awareness: 12, wisdom: 15 }, verdict: 'good',
        say: 'I thanked him, and tried to forget it.',
        teach: 'Leaving politely harms no one. But a question put away does not answer itself.' },
      { k: 'D', text: 'Thank him, hold his reading as one view, and keep seeking the truth.',
        d: { sanity: 15, awareness: 24, wisdom: 30 }, verdict: 'best',
        say: 'I thanked him, and kept looking for the truth.',
        teach: 'Respect the one who reads for you, and hold what he says as one view. The truth is still yours to seek.' }
    ],
    core: 'Not every practitioner will read the same experience the same way. Every medium, master and practitioner interprets through their own knowledge, training and tradition — and being called a master does not make an interpretation infallible. I could not prove it was a ghost. I could not prove it was not. I could not even prove it was something else entirely. What I realised that night is that I could not simply accept the first explanation I was handed. If I wanted the truth, I had to go and seek it, learn it, and find it for myself. That is worth remembering whoever you consult, and about anything you are ever told with certainty.',

    /* units metres, y up. WORLD A, THE SHOP: its inner faces x -4.5…4.5,
       z -7 (the altar's wall) … 0 (the glass front onto the mall); the mall
       corridor past the glass, z 0…5. WORLD B, THE SHRINE: a pocket at
       x -250 (the far plane is 160 m: neither is ever drawn from the other,
       v8.9), its shutter front at z 0, the five-foot way z 0…2.2. */
    spawn:     { x: -0.4, y: 1.62, z: -1.0, rot: 0.25 },
    shrine:    { x: -0.9, z: -4.6 },          // the engine's anchor: his mat at the celebration (ghost: null)
    ghostHome: { x: -0.9, z: -4.6 },
    bounds:    { minX: -262, maxX: 4.3, minZ: -9.8, maxZ: 2.0 },

    /* NO HAUNTING (the eleventh leak). Nothing comes for him; something comes
       THROUGH him. */
    ghost: null,

    /* NOON, INDOORS. The shop is under a mall's roof; the sky is only ever
       seen through the film's pockets and the shrine's night (kit.daylight). */
    daylight: {
      stops: [[0.00, '#cfe2f2'], [0.10, '#b9d4ec'], [0.30, '#8fb8e0'],
              [0.60, '#6a9ad0'], [1.00, '#4a7cbc']],
      bg: 0xb8cde0,
      fog: [0xd8d2c4, 0.004],
      hemi: [0xfff4e2, 0x6a5a48, 0.95],
      key: [0xfff0dc, 0.85, 2, 8, 4],
      fill: [0xcfe0ff, 0.35],
      stars: 0, moon: 0,
      sun: 0, clouds: 0,
      vmHemi: [0xfff2e0, 0x6a5a48, 0.95],
      vmKey: [0xfff0dc, 0.80]
    },

    /* the stand-in cast (docs/V21.0-E3C3-PLAN.md §3) — each behind its own
       key, so a model of Chad's is a one-line swap */
    assets: ['buddhahd', 'buddhalod', 'timkp', 'timkplod', 'thaikit', 'hanuman', 'medium', 'owner', 'staffman',
             'cg_woman2hd', 'cg_man2hd', 'sitclap', 'sitshout', 'botak'],
    items: ['timkp'],

    musicVol: 0,
    ambience: { beds: [] },
    voiceLine: null,

    words: {
      approach: '',
      act: 'E to act',
      actTouch: 'Tap to act',
      interact: 'E to choose what you do',
      interactTouch: 'Tap to choose what you do',
      actLine: 'Press E to choose what you do',
      actLineTouch: 'Tap to choose what you do',
      objBrowse: 'Look around the shop',
      objOwner: 'See the owner at his counter',
      objWear: 'Open your bag and wear the LP Tim Khun Paen',
      objJoin: 'Join the chanting at the altar',
      objChant: 'Chant with them',
      objIncense: 'Light incense at the urn',
      objWait: 'Sit and wait for your turn',
      objWatch: 'Wait for your turn',
      hotOwner: 'Talk to the owner',
      hotMat: 'Kneel on the mat',
      hotIncense: 'Take three joss sticks',
      hotStool: 'Sit on the stool',
      evAware: 'Stay present',
      evAwareBrief: 'Something has come into your body, and you cannot stop it. But you are still here. Tap each thing you notice, the moment it shows itself.',
      presence: 'Something is moving your body.',
      presenceWarn: 'Sanity drops while it holds you.',
      noteTim: 'Wore the LP Tim Khun Paen the owner gave you.',
      noteAware: 'Stayed aware of everything around you, though your body was not yours.',
      noteLost: 'Lost track of where you were while your body danced.',
      noteIncense: 'Lit incense at the medium\'s urn before you sat.'
    },
    sayPrefix: 'z3'
  };

  /* the measured length of every line said OUTSIDE a cutscene
     (masters/v21.0: the installed files, ffprobe) */
  const SECS = {
    z3pro1: 2.35, z3pro2: 6.03, z3pro3: 4.0, z3pro4: 6.84, ow3hello: 5.96, z3look1: 6.27,
    z3look2: 4.44, z3look3: 5.15, z3look4: 3.71, ow3call: 2.43, ow3gift1: 8.44, ow3gift2: 3.47,
    z3thanks: 4.21, ow3good: 2.85, ow3namo: 19.15, z3shift1: 3.47, z3shift2: 4.28, ow3eh: 2.93,
    sm3hold: 2.38, sm3cannot: 2.32, st3uncle: 2.35, cu3amitabha: 3.71, ow3let: 2.43, z3breath: 3.0,
    ow3know: 2.04, z3knew: 5.64, st3trance: 2.59, cu3unclean: 4.26, ow3medium: 5.56, z3night: 2.69,
    z3shrine: 4.7, as3sit: 3.63, dv3wife: 3.55, md3read1: 7.16, md3drink: 3.32, dv3father: 4.68,
    md3read2: 3.92, md3done: 1.52, as3next: 1.88, z3walk: 4.44, md3ghost: 1.7, md3chant: 4.05,
    as3back: 2.51, z3A1: 2.51, md3A1: 2.12, md3A2: 0.57, as3A: 3.87, z3A2: 4.05,
    z3B1: 2.35, md3B1: 1.18, as3B: 3.27, z3B2: 4.91, z3thank: 1.96, md3C: 2.43,
    z3C2: 5.96, md3D: 1.23, z3D2: 6.77, z3D3: 4.44, z3close: 8.44, z3next: 3.87,
    z3A: 2.93, z3B: 1.57, z3C: 2.27, z3D: 3.08
  };

  const hash = (i, s) => { const x = Math.sin(i * 127.1 + s * 311.7) * 43758.5453; return x - Math.floor(x); };
  const smooth = k => k * k * (3 - 2 * k);

  function build(ctx) {
    const { THREE, GLTFLoader, cloneSkinned, scene, camera, yaw, pitch, LOW, kit, plantTrees,
            assetBytes, rescueTextures, redoShadows, cnv, makeHellNote,
            getState, startDecision, worldSfx, warmSounds, HEAD_RE } = ctx;

    const owned = [];
    let alive = true;
    const parsedGlb = new Map();
    const madeTex = [];
    const tex = (t) => { madeTex.push(t); return t; };

    /* ------------------------------------------------------------- the map
       WORLD A, THE SHOP: inner faces x -4.5…4.5, z -7 (the altar's wall) … 0
       (the glass front onto the mall), a 2.9 m T-bar ceiling. Glass counters
       down both sides — the staff's on the left, the OWNER's on the right
       with the LP Tim in its own case on top — wall cabinets of framed
       amulets behind the left, the old masters' photographs behind the
       right, the altar against the back wall and the celebration's mats in
       front of it. The mall's corridor runs past the glass, z 0…5. */
    const SHOP = { x0: -4.5, x1: 4.5, z0: -7.0, z1: 0.0, H: 2.9 };
    const MALL = { x0: -14, x1: 14, z0: 0.0, z1: 5.0, H: 3.6 };
    const SHR = { x: -250, z: 0 };                       // WORLD B's origin
    const SHRINE_IN = { x0: SHR.x - 4.5, x1: SHR.x + 4.5, z0: -10.0, z1: 0.0, H: 3.4 };
    const MAT = { x: -0.9, z: -4.6 };                    // his mat at the celebration
    const DOOR = { x0: -0.62, x1: 0.62, h: 2.25 };       // the glass double door (shut in play)
    const LCNT = { x0: -3.5, x1: -2.9, z0: -0.9, z1: -4.1, top: 1.0 };   // the staff's counter, its glass face to +x
    const RCNT = { x0: 2.9, x1: 3.5, z0: -1.0, z1: -3.9, top: 1.0 };     // the OWNER's counter, its face to -x
    const ALTAR = { x: 0, z: -6.69, w: 2.3, d: 0.62, h: 0.92 };         // the altar cabinet, its back to the wall
    const MATS = [{ x: -1.6, z: -5.5 }, { x: -0.55, z: -5.5 }, { x: 0.55, z: -5.5 }, { x: 1.6, z: -5.5 },
                  { x: MAT.x, z: MAT.z }, { x: 0.35, z: -4.6 }];
    const OWN = { x: 3.98, z: -2.45 };                   // the owner, behind his counter
    const STAFF = { x: -3.92, z: -2.35 };                // the staff man, behind the other
    const LPT = { x: 3.1, z: -2.0 };                     // the LP Tim's case on the owner's counter
    const CLOCK = { x: 0, y: 2.56, z: -0.06 };           // over the door, inside, facing the shop

    /* ----------------------------------------------------------- materials */
    const noteTex = makeHellNote();
    madeTex.push(noteTex);
    const tileTex = tex(makeShopTiles(THREE, cnv)); tileTex.repeat.set((SHOP.x1 - SHOP.x0) / 1.2, (SHOP.z1 - SHOP.z0) / 1.2);
    const terrTex = tex(makeTerrazzo(THREE, cnv)); terrTex.repeat.set((MALL.x1 - MALL.x0) / 1.2, (MALL.z1 - MALL.z0) / 1.2);
    const ceilTex = tex(makeCeilGrid(THREE, cnv)); ceilTex.repeat.set((SHOP.x1 - SHOP.x0) / 1.2, (SHOP.z1 - SHOP.z0) / 1.2);
    const mallCeilTex = tex(makeCeilGrid(THREE, cnv)); mallCeilTex.repeat.set((MALL.x1 - MALL.x0) / 1.2, (MALL.z1 - MALL.z0) / 1.2);
    const matFloor  = new THREE.MeshStandardMaterial({ map: tileTex, roughness: 0.32, metalness: 0.05 });
    const matTerr   = new THREE.MeshStandardMaterial({ map: terrTex, roughness: 0.45, metalness: 0.04 });
    const matCeil   = new THREE.MeshStandardMaterial({ map: ceilTex, roughness: 0.95 });
    const matMallCeil = new THREE.MeshStandardMaterial({ map: mallCeilTex, roughness: 0.95 });
    const matWall   = new THREE.MeshStandardMaterial({ color: 0xf1ece2, roughness: 0.92 });
    const matWallB  = new THREE.MeshStandardMaterial({ color: 0xe6dccb, roughness: 0.92 });   // the mall's
    const matDark   = new THREE.MeshStandardMaterial({ color: 0x15100e, roughness: 0.8 });
    const matRed    = new THREE.MeshStandardMaterial({ color: 0x8e1d14, roughness: 0.42 });
    const matRedD   = new THREE.MeshStandardMaterial({ color: 0x5a1009, roughness: 0.55 });
    const matGold   = new THREE.MeshStandardMaterial({ color: 0xd9a63c, roughness: 0.3, metalness: 0.55, emissive: 0x3a2406, emissiveIntensity: 0.6 });
    const matWood   = new THREE.MeshStandardMaterial({ color: 0x3e2414, roughness: 0.5 });
    const matWoodL  = new THREE.MeshStandardMaterial({ color: 0x8a5a34, roughness: 0.55 });
    const matSteel  = new THREE.MeshStandardMaterial({ color: 0xb8bcc2, roughness: 0.3, metalness: 0.7 });
    const matAlu    = new THREE.MeshStandardMaterial({ color: 0xc9ccd0, roughness: 0.35, metalness: 0.6 });
    const matChrome = new THREE.MeshStandardMaterial({ color: 0xe8ecf0, roughness: 0.12, metalness: 0.9 });
    const matCream  = new THREE.MeshStandardMaterial({ color: 0xe9dfc8, roughness: 0.9 });
    const matBlack  = new THREE.MeshStandardMaterial({ color: 0x1a1a1c, roughness: 0.45 });
    const matWhite  = new THREE.MeshStandardMaterial({ color: 0xf4f2ec, roughness: 0.6 });
    const matProxy  = new THREE.MeshStandardMaterial({ color: 0x8d7a66, roughness: 0.9 });
    const matGlass  = new THREE.MeshStandardMaterial({ color: 0xd8e6ee, roughness: 0.06, metalness: 0.1, transparent: true, opacity: 0.13,
                                                        depthWrite: false, side: THREE.DoubleSide });
    const matGlassS = new THREE.MeshStandardMaterial({ color: 0xe8f0f4, roughness: 0.05, metalness: 0.1, transparent: true, opacity: 0.22,
                                                        depthWrite: false, side: THREE.DoubleSide });   // a shelf's, seen edge-on
    const matPanel  = new THREE.MeshBasicMaterial({ color: 0xf6f8ff });                                 // an LED ceiling panel
    const matTube   = new THREE.MeshBasicMaterial({ color: 0xeef4ff });
    const matLED    = new THREE.MeshBasicMaterial({ color: 0xfff4e0 });
    const matFlame  = new THREE.MeshBasicMaterial({ color: 0xffc46a, transparent: true, opacity: 0.95, depthWrite: false, blending: THREE.AdditiveBlending });
    const matMat    = new THREE.MeshStandardMaterial({ map: tex(makeReedMat(THREE, cnv)), roughness: 0.95 });

    const world = new THREE.Group();
    scene.add(world);
    const shopG = new THREE.Group(); world.add(shopG);      // WORLD A
    const mallG = new THREE.Group(); world.add(mallG);      // the corridor past the glass

    const walls = [], solids = [];
    const box = (w, h, d, x, y, z, mat, parent = world, cast = true) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
      m.position.set(x, y, z); m.castShadow = cast && !LOW; m.receiveShadow = true;
      parent.add(m); return m;
    };
    const cyl = (r0, r1, h, x, y, z, mat, seg = 14, parent = world) => {
      const m = new THREE.Mesh(new THREE.CylinderGeometry(r0, r1, h, seg), mat);
      m.position.set(x, y, z); m.castShadow = !LOW; m.receiveShadow = true;
      parent.add(m); return m;
    };
    const plane = (w, h, mat, x, y, z, ry = 0, parent = world) => {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat);
      m.position.set(x, y, z); m.rotation.y = ry; m.receiveShadow = true;
      parent.add(m); return m;
    };
    const texMat = (t, o = {}) => new THREE.MeshStandardMaterial({ map: tex(t), roughness: 0.8, ...o });
    /* an invisible box that is only a blocker (collision reads it whether it
       is drawn or not) */
    const hidBox = (w, h, d, x, y, z, parent = shopG) => { const m = box(w, h, d, x, y, z, matProxy, parent, false); m.visible = false; return m; };

    /* ------------------------------------------------- one parse per asset */
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

    /* THE THAI KIT (v16.6's file): one parse, every piece a clone; a primitive
       it replaces stays drawn until it lands. Chad's Buddha (v18.8) takes the
       kit Buddha's place at the kit's footprint — a LOD per image, the
       PRINCIPAL one (`hd`) the full statue while it is big on screen. */
    const BUDDHA_H = 0.527, BUDDHA_ENV = 0.15, _bMat = new Map();
    function buddhaMat(m) {
      let c = _bMat.get(m);
      if (!c) { c = m.clone(); c.envMap = scene.environment || null; c.envMapIntensity = BUDDHA_ENV; _bMat.set(m, c); owned.push({ dispose: () => c.dispose() }); }
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
      if (name === 'buddha') return chadBuddha(g, o);
      parseOnce('thaikit').then(gltf => {
        if (!alive) return;
        const src = gltf.scene.getObjectByName('thai_' + name);
        if (!src) throw new Error('thaikit has no thai_' + name);
        const m = src.clone(true);
        m.position.set(0, 0, 0);
        m.traverse(q => {
          if (!q.isMesh) return;
          q.castShadow = o.cast !== false && !LOW; q.receiveShadow = true;
          if (o.tint) { q.material = q.material.clone(); q.material.color.multiply(new THREE.Color(o.tint)); owned.push({ dispose: () => q.material.dispose() }); }
        });
        g.add(m);
        for (const h of (o.hide || [])) if (h) h.visible = false;
        if (o.then) o.then(g, m);
      }).catch(err => { console.warn('thaikit failed to load', err); ctx.loadFail && ctx.loadFail('thaikit', err); });
      return g;
    }

    /* ============================================== WORLD A · THE SHOP
       ------------------------------------------------- floor, ceiling, walls */
    {
      const W = SHOP.x1 - SHOP.x0, D = SHOP.z1 - SHOP.z0;
      const fl = new THREE.Mesh(new THREE.PlaneGeometry(W, D), matFloor);
      fl.rotation.x = -Math.PI / 2; fl.position.set(0, 0, (SHOP.z0 + SHOP.z1) / 2); fl.receiveShadow = true; shopG.add(fl);
      const ce = new THREE.Mesh(new THREE.PlaneGeometry(W, D), matCeil);
      ce.rotation.x = Math.PI / 2; ce.position.set(0, SHOP.H, (SHOP.z0 + SHOP.z1) / 2); shopG.add(ce);
      walls.push(box(W + 0.4, SHOP.H, 0.2, 0, SHOP.H / 2, SHOP.z0 - 0.1, matWall, shopG, false));
      walls.push(box(0.2, SHOP.H, D, SHOP.x0 - 0.1, SHOP.H / 2, (SHOP.z0 + SHOP.z1) / 2, matWall, shopG, false));
      walls.push(box(0.2, SHOP.H, D, SHOP.x1 + 0.1, SHOP.H / 2, (SHOP.z0 + SHOP.z1) / 2, matWall, shopG, false));
      // a skirting all round, dark wood
      box(W, 0.1, 0.02, 0, 0.05, SHOP.z0 + 0.01, matWood, shopG, false);
      box(0.02, 0.1, D, SHOP.x0 + 0.01, 0.05, (SHOP.z0 + SHOP.z1) / 2, matWood, shopG, false);
      box(0.02, 0.1, D, SHOP.x1 - 0.01, 0.05, (SHOP.z0 + SHOP.z1) / 2, matWood, shopG, false);
      // six LED panels in the grid and a downlight over each counter's run
      for (const px of [-1.5, 1.5]) for (const pz of [-1.2, -3.0, -4.8]) {
        const p = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 1.2), matPanel);
        p.rotation.x = Math.PI / 2; p.position.set(px, SHOP.H - 0.005, pz); shopG.add(p);
      }
      for (const [dx, dz] of [[-3.2, -1.4], [-3.2, -2.6], [-3.2, -3.8], [3.2, -1.5], [3.2, -2.6], [3.2, -3.6], [0, -6.2]]) {
        const d = new THREE.Mesh(new THREE.CircleGeometry(0.07, 16), matLED);
        d.rotation.x = Math.PI / 2; d.position.set(dx, SHOP.H - 0.006, dz); shopG.add(d);
      }
      // the split air-conditioner over the staff's side, and its trunking
      box(0.95, 0.3, 0.24, -4.36, 2.55, -5.2, matWhite, shopG, false).rotation.y = Math.PI / 2;
      box(0.02, 0.04, 0.6, -4.25, 2.4, -5.2, matDark, shopG, false);
    }

    /* ---------------------------------------------------- the glass front
       Aluminium mullions, a transom at the door's head, a solid bulkhead over
       it (the clock hangs there), the door's long chrome pulls and its brass
       bell, the shop's name in gold leaf on the glass. The front is ONE
       blocker the whole width: the door is shut in play. */
    {
      const yT = DOOR.h, bulk = SHOP.H - yT;
      walls.push(box(SHOP.x1 - SHOP.x0, SHOP.H, 0.12, 0, SHOP.H / 2, 0.06, matGlass, shopG, false));
      box(SHOP.x1 - SHOP.x0, bulk, 0.16, 0, yT + bulk / 2, 0.02, matWall, shopG, false);           // the bulkhead
      box(SHOP.x1 - SHOP.x0, 0.06, 0.1, 0, yT, 0.03, matAlu, shopG, false);                         // the transom
      box(SHOP.x1 - SHOP.x0, 0.06, 0.1, 0, 0.03, 0.03, matAlu, shopG, false);                       // the sill
      for (const mx of [SHOP.x0 + 0.04, -2.6, DOOR.x0, 0, DOOR.x1, 2.6, SHOP.x1 - 0.04]) box(0.06, yT, 0.1, mx, yT / 2, 0.03, matAlu, shopG, false);
      // the door's pulls and its bell
      for (const s of [-1, 1]) { const p = cyl(0.014, 0.014, 0.9, s * 0.1, 1.05, -0.06, matChrome, 8, shopG);
        cyl(0.01, 0.01, 0.06, s * 0.1, 1.48, -0.03, matChrome, 6, shopG).rotation.x = Math.PI / 2;
        cyl(0.01, 0.01, 0.06, s * 0.1, 0.62, -0.03, matChrome, 6, shopG).rotation.x = Math.PI / 2; p.castShadow = false; }
      const bell = cyl(0.02, 0.045, 0.07, DOOR.x1 - 0.12, yT - 0.08, -0.05, matGold, 12, shopG); bell.castShadow = false;
      // the name in gold leaf, twice: on the left pane and the right (it reads backwards from inside, as it should)
      const nameM = new THREE.MeshBasicMaterial({ map: tex(makeGlassName(THREE, cnv)), transparent: true, depthWrite: false, side: THREE.DoubleSide });
      for (const sx of [-1.6, 1.6]) plane(1.8, 0.675, nameM, sx, 1.62, 0.005, 0, shopG);
      // an OPEN sign hanging in the door, and the opening hours
      const openM = texMat(makeSignTxt(THREE, cnv, 'OPEN  营业中', '#1f6a3a', '#fff6d0', 3.2), { emissive: 0xffffff, emissiveIntensity: 0.12 });
      openM.emissiveMap = openM.map; plane(0.36, 0.12, openM, -0.3, 1.72, -0.02, 0, shopG);
      plane(0.36, 0.12, texMat(makeSignTxt(THREE, cnv, 'THANK YOU  谢谢', '#1f6a3a', '#fff6d0', 3.2)), -0.3, 1.72, -0.022, Math.PI, shopG);
      for (const s of [-1, 1]) box(0.003, yT - 1.78, 0.003, -0.3 + s * 0.15, (yT + 1.78) / 2, -0.021, matBlack, shopG, false);   // its cord
    }

    /* ------------------------------------------------- a glass counter
       A dark-wood plinth, a glass box over velvet trays (two levels), chrome
       edges, an LED strip under the top's customer edge. `face` is the side
       the customer stands on (+1 = +x, -1 = -x). */
    const trayTex = [0, 1, 2, 3].map(i => tex(makeVelvetTray(THREE, cnv, 11 + i * 7)));
    function counter(c, face, seed) {
      const g = new THREE.Group(); shopG.add(g);
      const w = c.x1 - c.x0, L = c.z0 - c.z1, cx = (c.x0 + c.x1) / 2, cz = (c.z0 + c.z1) / 2;
      box(w, 0.36, L, cx, 0.18, cz, matWood, g);
      box(w + 0.02, 0.03, L + 0.02, cx, 0.375, cz, matChrome, g, false);
      const vel = new THREE.MeshStandardMaterial({ map: trayTex[seed % 4], roughness: 0.9 });
      const vel2 = new THREE.MeshStandardMaterial({ map: trayTex[(seed + 1) % 4], roughness: 0.9 });
      const t1 = new THREE.Mesh(new THREE.PlaneGeometry(L - 0.06, w - 0.08), vel); t1.rotation.set(-Math.PI / 2, 0, face > 0 ? Math.PI / 2 : -Math.PI / 2);
      t1.position.set(cx, 0.4, cz); g.add(t1);
      box(w - 0.04, 0.012, L - 0.04, cx, 0.68, cz, matGlassS, g, false);                               // the glass shelf
      const t2 = t1.clone(); t2.material = vel2; t2.position.y = 0.69; g.add(t2);
      // the glass: front, back, ends, top — the top a touch thicker, with a chrome rim
      box(0.012, 0.62, L, face > 0 ? c.x1 : c.x0, 0.69, cz, matGlass, g, false);
      box(0.012, 0.62, L, face > 0 ? c.x0 : c.x1, 0.69, cz, matGlass, g, false);
      for (const zz of [c.z0, c.z1]) box(w, 0.62, 0.012, cx, 0.69, zz, matGlass, g, false);
      box(w, 0.016, L, cx, c.top, cz, matGlassS, g, false);
      for (const zz of [c.z0, c.z1]) box(w + 0.02, 0.022, 0.02, cx, c.top, zz, matChrome, g, false);
      for (const xx of [c.x0, c.x1]) box(0.02, 0.022, L + 0.02, xx, c.top, cz, matChrome, g, false);
      for (const zz of [c.z0, c.z1]) for (const xx of [c.x0, c.x1]) box(0.022, 0.62, 0.022, xx, 0.69, zz, matChrome, g, false);
      const led = box(0.01, 0.012, L - 0.08, face > 0 ? c.x1 - 0.03 : c.x0 + 0.03, c.top - 0.03, cz, matLED, g, false);
      led.castShadow = false;
      solids.push(box(w, c.top, L, cx, c.top / 2, cz, matProxy, g, false)); g.children[g.children.length - 1].visible = false;
      return g;
    }
    counter(LCNT, 1, 0);
    counter(RCNT, -1, 2);

    /* -------------------------------------------- the owner's working end
       A wooden top at the back of his counter: the loupe, the lamp, the till,
       a receipt book, a calculator, his phone, his tea. */
    {
      const z = RCNT.z1 + 0.42, x = (RCNT.x0 + RCNT.x1) / 2, y = RCNT.top + 0.008;
      box(0.62, 0.02, 0.8, x, y, z, matWoodL, shopG);
      box(0.3, 0.16, 0.26, x + 0.08, y + 0.09, z - 0.2, matBlack, shopG);                   // the till
      box(0.22, 0.02, 0.18, x + 0.08, y + 0.18, z - 0.2, matDark, shopG).rotation.x = -0.4;
      box(0.12, 0.012, 0.16, x - 0.12, y + 0.016, z + 0.12, matDark, shopG);                 // the calculator
      box(0.16, 0.012, 0.22, x - 0.1, y + 0.014, z - 0.1, matCream, shopG);                  // the receipt book
      box(0.075, 0.008, 0.15, x + 0.14, y + 0.012, z + 0.22, matBlack, shopG).rotation.y = 0.3;   // his phone
      cyl(0.035, 0.03, 0.07, x + 0.18, y + 0.045, z + 0.04, matWhite, 12, shopG);            // his tea
      const lamp = new THREE.Group(); lamp.position.set(x + 0.2, y, z + 0.34); shopG.add(lamp);
      cyl(0.06, 0.07, 0.02, 0, 0.01, 0, matBlack, 14, lamp); cyl(0.008, 0.008, 0.34, 0, 0.18, 0, matChrome, 6, lamp);
      const sh = cyl(0.03, 0.07, 0.08, -0.06, 0.34, 0, matBlack, 14, lamp); sh.rotation.z = 0.7;
      const loupe = new THREE.Group(); loupe.position.set(x - 0.18, y + 0.01, z + 0.32); shopG.add(loupe);
      cyl(0.02, 0.02, 0.018, 0, 0.009, 0, matBlack, 14, loupe);
      cyl(0.018, 0.018, 0.004, 0, 0.02, 0, matGlassS, 14, loupe);
    }

    /* ----------------------------------- THE LP TIM, in its own case
       On a red velvet stand under a little acrylic box at the front of his
       counter: "he never lets anyone hold that one". It is CHAD'S model — the
       light copy (timkplod) from across the shop, the full one (timkp) within
       1.4 m, the v14.14 rule (every amulet at full quality up close). */
    const lpCase = new THREE.Group(); lpCase.position.set(LPT.x, RCNT.top + 0.01, LPT.z); shopG.add(lpCase);
    box(0.13, 0.03, 0.13, 0, 0.015, 0, matWood, lpCase);
    box(0.11, 0.012, 0.11, 0, 0.036, 0, new THREE.MeshStandardMaterial({ color: 0x7a0c12, roughness: 0.95 }), lpCase);
    const lpLid = box(0.12, 0.16, 0.12, 0, 0.042 + 0.08, 0, matGlassS, lpCase, false);
    const lpAmulet = new THREE.LOD(); lpAmulet.position.set(0, 0.042 + 0.055, 0); lpAmulet.rotation.y = -Math.PI / 2; lpCase.add(lpAmulet);
    const lpHalo = new THREE.Mesh(new THREE.PlaneGeometry(0.34, 0.34), new THREE.MeshBasicMaterial({ map: tex(makeGlowTex(THREE, cnv, [255, 214, 140])),
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.55 }));
    lpHalo.position.set(0, 0.1, 0); lpHalo.rotation.y = -Math.PI / 2; lpCase.add(lpHalo);
    const lpProxy = box(0.05, 0.065, 0.012, 0, 0.042 + 0.055, 0, matGold, lpCase, false);   // stands until the models land
    Promise.all([parseOnce('timkplod'), parseOnce('timkp')]).then(([lo, hd]) => {
      if (!alive) return;
      const H = 0.075;
      for (const [src, d] of [[hd.scene, 0], [lo.scene, 1.4]]) {
        const m = src.clone(true); m.scale.setScalar(H);
        m.traverse(q => { if (q.isMesh) { q.castShadow = false; q.receiveShadow = false; } });
        lpAmulet.addLevel(m, d);
      }
      lpProxy.visible = false;
    }).catch(err => { console.warn('the LP Tim failed to load', err); ctx.loadFail && ctx.loadFail('timkp', err); });

    /* ------------------------------------------------ the wall cabinets
       Three tall glass cabinets on the staff's wall, five shelves each, every
       shelf a row of framed amulets (an atlas of eight kinds, one instanced
       mesh per kind) and a strip of light under each shelf's front. */
    const atlas = tex(makeAmuletAtlas(THREE, cnv));
    const kindMats = Array.from({ length: 8 }, (_, k) => {
      const t = atlas.clone(); t.needsUpdate = true; t.repeat.set(0.25, 0.5); t.offset.set((k % 4) * 0.25, k < 4 ? 0.5 : 0); madeTex.push(t);
      return new THREE.MeshStandardMaterial({ map: t, roughness: 0.6 });
    });
    {
      const CAB = { x: SHOP.x0 + 0.22, d: 0.4, h: 2.1, zs: [-0.95, -2.25, -3.55], w: 1.2 };
      const frames = [], faces = Array.from({ length: 8 }, () => []);
      let n = 0;
      for (const cz of CAB.zs) {
        box(CAB.d, 0.24, CAB.w, CAB.x, 0.12, cz, matWood, shopG);                                    // plinth
        box(CAB.d, 0.06, CAB.w, CAB.x, CAB.h, cz, matWood, shopG);                                   // crown
        box(0.02, CAB.h - 0.24, CAB.w, CAB.x - CAB.d / 2 + 0.01, 0.24 + (CAB.h - 0.24) / 2, cz, matRedD, shopG, false);   // back
        for (const s of [-1, 1]) box(CAB.d, CAB.h - 0.24, 0.03, CAB.x, 0.24 + (CAB.h - 0.24) / 2, cz + s * CAB.w / 2, matWood, shopG, false);
        box(0.012, CAB.h - 0.3, CAB.w - 0.04, CAB.x + CAB.d / 2, 0.24 + (CAB.h - 0.24) / 2, cz, matGlass, shopG, false);   // the glass doors
        box(0.012, CAB.h - 0.3, 0.012, CAB.x + CAB.d / 2 + 0.006, 0.24 + (CAB.h - 0.24) / 2, cz, matChrome, shopG, false);
        for (let sh = 0; sh < 5; sh++) {
          const y = 0.32 + sh * 0.34;
          box(CAB.d - 0.04, 0.012, CAB.w - 0.06, CAB.x, y, cz, matGlassS, shopG, false);
          box(0.008, 0.01, CAB.w - 0.1, CAB.x + CAB.d / 2 - 0.03, y + 0.31, cz, matLED, shopG, false);
          for (let i = 0; i < 8; i++) {
            const zz = cz - CAB.w / 2 + 0.1 + i * 0.143, k = (i * 3 + sh * 5 + n) % 8;
            frames.push([CAB.x - 0.08, y + 0.075, zz]);
            faces[k].push([CAB.x - 0.0715, y + 0.075, zz]);
          }
        }
        solids.push(hidBox(CAB.d, CAB.h, CAB.w, CAB.x, CAB.h / 2, cz));
        n++;
      }
      void 0;
      const fG = new THREE.BoxGeometry(0.016, 0.12, 0.095), m4 = new THREE.Matrix4();
      const fI = new THREE.InstancedMesh(fG, matGold, frames.length); frames.forEach((p, i) => fI.setMatrixAt(i, m4.makeTranslation(...p)));
      fI.castShadow = false; shopG.add(fI);
      const pG = new THREE.PlaneGeometry(0.08, 0.105), rot = new THREE.Matrix4().makeRotationY(Math.PI / 2);
      faces.forEach((list, k) => {
        if (!list.length) return;
        const I = new THREE.InstancedMesh(pG, kindMats[k], list.length);
        list.forEach((p, i) => I.setMatrixAt(i, new THREE.Matrix4().makeTranslation(...p).multiply(rot)));
        I.castShadow = false; shopG.add(I);
      });
    }

    /* ------------------------------------------- the owner's wall: THE OLD MASTERS
       Nine framed photographs over a low cabinet behind his counter — the
       faces soft on purpose: no real master's likeness — the shop's Thai
       calendar beside them, a shelf of boxed cases under. */
    {
      const wx = SHOP.x1 - 0.012;
      plane(1.9, 1.9, texMat(makeMastersWall(THREE, cnv), { roughness: 0.55, alphaTest: 0.5 }), wx, 1.78, -2.5, -Math.PI / 2, shopG);
      box(0.4, 0.86, 2.8, SHOP.x1 - 0.2, 0.43, -2.45, matWood, shopG);                             // the low cabinet
      box(0.42, 0.03, 2.82, SHOP.x1 - 0.2, 0.875, -2.45, matWoodL, shopG);
      const br = texMat(makeBoxRow(THREE, cnv));
      for (const zz of [-1.6, -3.3]) plane(1.1, 0.27, br, SHOP.x1 - 0.405, 0.6, zz, -Math.PI / 2, shopG);
      plane(0.42, 0.63, texMat(makeCalendar(THREE, cnv)), wx - 0.002, 1.55, -4.15, -Math.PI / 2, shopG);
      solids.push(hidBox(0.4, 0.9, 2.8, SHOP.x1 - 0.2, 0.45, -2.45));
      // a small shelf-shrine over the photographs: a Buddha, a garland, two candles
      box(0.28, 0.03, 0.7, SHOP.x1 - 0.14, 2.62, -2.5, matRed, shopG);
      thai('buddha', SHOP.x1 - 0.15, 2.635, -2.5, { s: 0.42, ry: -Math.PI / 2, parent: shopG, cast: false });
    }

    /* ---------------------------------------------------- the clock
       Over the door, inside. Its hands are meshes, so the trance's fifteen
       minutes can pass on it (stage.clockTo). */
    const clockG = new THREE.Group(); clockG.position.set(CLOCK.x, CLOCK.y, CLOCK.z); clockG.rotation.y = Math.PI; shopG.add(clockG);
    {
      const face = new THREE.Mesh(new THREE.CircleGeometry(0.17, 32), texMat(makeClockFace(THREE, cnv), { roughness: 0.6 }));
      face.position.z = 0.012; clockG.add(face);
      const rim = new THREE.Mesh(new THREE.TorusGeometry(0.175, 0.012, 8, 32), matBlack); rim.position.z = 0.012; clockG.add(rim);
    }
    const hourHand = new THREE.Group(), minHand = new THREE.Group();
    for (const [hand, L, wd] of [[hourHand, 0.09, 0.012], [minHand, 0.13, 0.008]]) {
      const b = new THREE.Mesh(new THREE.BoxGeometry(wd, L, 0.004), matBlack); b.position.set(0, L / 2 - 0.015, 0); hand.add(b);
      hand.position.z = 0.02; clockG.add(hand);
    }
    function clockTo(h, m) {
      minHand.rotation.z = -(m / 60) * Math.PI * 2;
      hourHand.rotation.z = -((h % 12) + m / 60) / 12 * Math.PI * 2;
    }
    clockTo(12, 6);

    /* ------------------------------------------------------- THE ALTAR
       A red-lacquer cabinet with gilt rims against the back wall, three tiers
       on it, Chad's Buddha on the top tier (the principal image), two smaller
       images below it, the red board of gilt lattice behind; candles, the
       incense pot, orchids and fruit on the front tier; lilies in tall vases
       either side, lotus bowls on the floor for Vesak, a red valance over the
       whole, and a strip of warm light washing the board. */
    const altarG = new THREE.Group(); shopG.add(altarG);
    const ALT_TOP = ALTAR.h, T1 = ALT_TOP + 0.22, T2 = T1 + 0.22, T3 = T2 + 0.2;
    {
      const { x, z, w, d, h } = ALTAR;
      box(w, h, d, x, h / 2, z, matRed, altarG);
      box(w + 0.04, 0.04, d + 0.04, x, h, z, matGold, altarG);
      box(w + 0.04, 0.08, d + 0.04, x, 0.04, z, matGold, altarG);
      for (const s of [-1, 1]) {                                     // drawer and cupboard fronts with gilt pulls
        box(w * 0.42, 0.2, 0.012, x + s * w * 0.23, h - 0.16, z + d / 2 + 0.006, matRedD, altarG, false);
        box(w * 0.42, 0.5, 0.012, x + s * w * 0.23, 0.38, z + d / 2 + 0.006, matRedD, altarG, false);
        cyl(0.012, 0.012, 0.04, x + s * w * 0.23, h - 0.16, z + d / 2 + 0.02, matGold, 8, altarG).rotation.x = Math.PI / 2;
      }
      const tier = (tw, th, td, ty, tz) => { box(tw, th, td, x, ty - th / 2, tz, matRed, altarG); box(tw + 0.03, 0.025, td + 0.03, x, ty, tz, matGold, altarG); };
      tier(1.9, 0.22, 0.44, T1, z - 0.07);
      tier(1.4, 0.22, 0.32, T2, z - 0.13);
      tier(0.8, 0.2, 0.24, T3, z - 0.18);
      solids.push(hidBox(w, 1.4, d, x, 0.7, z));
      // the board behind
      plane(2.5, 1.9, texMat(makeAltarScreen(THREE, cnv), { roughness: 0.5, emissive: 0x3a0804, emissiveIntensity: 0.3 }), x, 1.92, SHOP.z0 + 0.012, 0, altarG);
      // a red valance with a gilt fringe across the ceiling over it
      box(2.9, 0.22, 0.04, x, SHOP.H - 0.11, z + 0.1, matRed, altarG, false);
      box(2.9, 0.03, 0.05, x, SHOP.H - 0.225, z + 0.1, matGold, altarG, false);
      // THE IMAGES: Chad's Buddha, the principal on the top tier, two smaller on the second
      thai('buddha', x, T3, z - 0.18, { s: 1.62, hd: true, hdAt: 3.5, parent: altarG });
      for (const s of [-1, 1]) thai('buddha', x + s * 0.5, T2, z - 0.13, { s: 0.78, parent: altarG });
      // the front tier: candles, the incense pot, orchids, trays of fruit, a small bell
      for (const s of [-1, 1]) {
        thai('candle', x + s * 0.82, T1, z + 0.08, { s: 0.55, cast: false, parent: altarG });
        thai('orchid', x + s * 0.62, T1, z - 0.02, { s: 0.38, cast: false, parent: altarG });
        thai('phan', x + s * 0.32, T1, z + 0.1, { s: 0.42, cast: false, parent: altarG });
      }
      thai('incense', x, T1, z + 0.1, { s: 0.42, cast: false, parent: altarG });
      // fruit: oranges and apples heaped on two plates on the cabinet's top
      const orange = new THREE.MeshStandardMaterial({ color: 0xf08a1e, roughness: 0.6 }), apple = new THREE.MeshStandardMaterial({ color: 0xb8241a, roughness: 0.4 });
      for (const s of [-1, 1]) {
        cyl(0.13, 0.11, 0.02, x + s * 0.98, ALT_TOP + 0.01, z + 0.18, matGold, 18, altarG);
        for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2;
          const f = new THREE.Mesh(new THREE.SphereGeometry(0.038, 12, 10), i % 2 ? apple : orange);
          f.position.set(x + s * 0.98 + Math.cos(a) * 0.065, ALT_TOP + 0.055, z + 0.18 + Math.sin(a) * 0.065); altarG.add(f); }
        const top = new THREE.Mesh(new THREE.SphereGeometry(0.04, 12, 10), orange); top.position.set(x + s * 0.98, ALT_TOP + 0.11, z + 0.18); altarG.add(top);
      }
      // the candle flames (painted light)
      for (const s of [-1, 1]) { const f = new THREE.Mesh(new THREE.SphereGeometry(0.012, 8, 6), matFlame); f.scale.set(1, 2.2, 1); f.position.set(x + s * 0.82, T1 + 0.25, z + 0.08); altarG.add(f); }
      // lilies either side, lotus bowls on the floor in front of them
      for (const s of [-1, 1]) {
        thai('lily', x + s * 1.48, 0, z + 0.05, { s: 0.8, parent: altarG });
        thai('lotusbowl', x + s * 1.55, 0, z + 0.62, { s: 0.55, cast: false, parent: altarG });
      }
      // the warm wash on the board (painted: no light)
      const wash = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 1.6), new THREE.MeshBasicMaterial({ map: tex(makeGlowTex(THREE, cnv, [255, 190, 110])),
        transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.32 }));
      wash.position.set(x, 1.95, SHOP.z0 + 0.03); altarG.add(wash);
      // the radio on its own little table, where the chant comes from
      box(0.42, 0.62, 0.36, x + 1.95, 0.31, z + 0.02, matWood, altarG);
      const radio = box(0.32, 0.16, 0.14, x + 1.95, 0.7, z + 0.02, matBlack, altarG);
      for (const s of [-1, 1]) { const sp = new THREE.Mesh(new THREE.CircleGeometry(0.045, 16), matDark); sp.position.set(x + 1.95 + s * 0.1, 0.7, z + 0.095); altarG.add(sp); }
      solids.push(hidBox(0.42, 0.8, 0.36, x + 1.95, 0.4, z + 0.02));
      void radio;
    }

    /* ------------------------------------------ the back corners
       Left: shelves of images and boxed amulets for sale. Right: the water
       dispenser, a standing fan, and the curtained way to the back room. */
    {
      const sx = -3.0, sz = SHOP.z0 + 0.22;
      box(2.2, 0.04, 0.4, sx, 0.02, sz, matWood, shopG);
      for (const y of [0.55, 1.05, 1.55, 2.05]) box(2.2, 0.03, 0.4, sx, y, sz, matWoodL, shopG);
      for (const s of [-1, 1]) box(0.04, 2.1, 0.4, sx + s * 1.1, 1.05, sz, matWood, shopG);
      const br = texMat(makeBoxRow(THREE, cnv));
      for (const y of [0.565, 1.565]) plane(2.1, 0.32, br, sx, y + 0.16, sz + 0.02, 0, shopG);
      for (let i = 0; i < 4; i++) thai('buddha', sx - 0.75 + i * 0.5, 1.065, sz, { s: 0.5, parent: shopG, cast: false });
      for (let i = 0; i < 3; i++) thai('deity', sx - 0.6 + i * 0.6, 2.065, sz, { s: 0.42, parent: shopG, cast: false });
      solids.push(hidBox(2.2, 2.1, 0.42, sx, 1.05, sz));
      // the water dispenser, its blue bottle, the cups
      box(0.32, 1.0, 0.32, 3.95, 0.5, -6.6, matWhite, shopG);
      cyl(0.13, 0.13, 0.42, 3.95, 1.21, -6.6, new THREE.MeshStandardMaterial({ color: 0x7ab4e6, roughness: 0.15, transparent: true, opacity: 0.75 }), 16, shopG);
      solids.push(hidBox(0.36, 1.4, 0.36, 3.95, 0.7, -6.6));
      thai('standfan', 3.2, 0, -6.55, { s: 0.9, ry: -0.6, parent: shopG });
      // the back room's doorway on the right wall, a maroon curtain in it
      box(0.04, 2.15, 1.0, SHOP.x1 - 0.02, 1.075, -5.6, matWood, shopG, false);
      plane(0.92, 2.0, new THREE.MeshStandardMaterial({ color: 0x6a1420, roughness: 0.95, side: THREE.DoubleSide }), SHOP.x1 - 0.05, 1.0, -5.6, -Math.PI / 2, shopG);
    }

    /* ------------------------------------------------------- VESAK
       Lotus lanterns over the mats, strings of Buddhist flags across the
       ceiling, the banner over the altar's valance. */
    const flagTex = tex(makeBuddhistFlag(THREE, cnv));
    {
      const flagM = new THREE.MeshStandardMaterial({ map: flagTex, roughness: 0.9, side: THREE.DoubleSide });
      const fG = new THREE.PlaneGeometry(0.2, 0.13);
      const fl = [];
      const string = (x0, z0, x1, z1, y, n) => {
        for (let i = 0; i <= n; i++) {
          const k = i / n, sag = Math.sin(k * Math.PI) * 0.14;
          fl.push([x0 + (x1 - x0) * k, y - sag - 0.07, z0 + (z1 - z0) * k, Math.atan2(x1 - x0, z1 - z0) + Math.PI / 2]);
        }
      };
      string(-4.3, -1.0, 4.3, -1.0, 2.82, 22); string(-4.3, -3.2, 4.3, -3.2, 2.82, 22); string(-4.3, -5.3, 4.3, -5.3, 2.82, 22);
      const I = new THREE.InstancedMesh(fG, flagM, fl.length), m = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler();
      fl.forEach(([x, y, z, ry], i) => { e.set(0, ry, 0.08 * Math.sin(i * 1.7)); q.setFromEuler(e); m.compose(new THREE.Vector3(x, y, z), q, new THREE.Vector3(1, 1, 1)); I.setMatrixAt(i, m); });
      I.castShadow = false; shopG.add(I);
      // the lanterns: pink lotus paper lanterns, petals in two rings, a tassel
      const petalG = new THREE.SphereGeometry(0.07, 10, 8); petalG.scale(0.55, 1.2, 0.3);
      const pink = new THREE.MeshStandardMaterial({ color: 0xf4a2bc, roughness: 0.8, emissive: 0xf08aa8, emissiveIntensity: 0.25 });
      const white = new THREE.MeshStandardMaterial({ color: 0xfff2f4, roughness: 0.8, emissive: 0xffe8ee, emissiveIntensity: 0.2 });
      const lanterns = [[-1.6, -4.0], [0, -4.4], [1.6, -4.0], [-0.8, -2.2], [0.8, -2.2]];
      for (const [lx, lz] of lanterns) {
        const L = new THREE.Group(); L.position.set(lx, 2.3, lz); shopG.add(L);
        cyl(0.003, 0.003, SHOP.H - 2.3 - 0.12, 0, (SHOP.H - 2.3) / 2 + 0.06, 0, matDark, 4, L).castShadow = false;
        for (let ring = 0; ring < 2; ring++) for (let i = 0; i < 8; i++) {
          const a = i / 8 * Math.PI * 2 + ring * 0.39, p = new THREE.Mesh(petalG, ring ? white : pink);
          p.position.set(Math.cos(a) * (0.09 - ring * 0.04), 0.06 + ring * 0.04, Math.sin(a) * (0.09 - ring * 0.04));
          p.rotation.set(0, -a + Math.PI / 2, 0); p.rotateX(0.5 - ring * 0.25); L.add(p);
        }
        const t = cyl(0.008, 0.02, 0.18, 0, -0.08, 0, new THREE.MeshStandardMaterial({ color: 0xf2c12e, roughness: 0.8 }), 6, L); t.castShadow = false;
      }
      const ban = texMat(makeVesakBanner(THREE, cnv), { emissive: 0xffffff, emissiveIntensity: 0.12 }); ban.emissiveMap = ban.map;
      plane(1.6, 0.3, ban, 0, 2.5, ALTAR.z + 0.13, 0, shopG);
    }

    /* ----------------------------------------------- the celebration's mats */
    {
      for (const m of MATS) {
        const p = new THREE.Mesh(new THREE.PlaneGeometry(0.62, 0.82), matMat); p.rotation.x = -Math.PI / 2; p.position.set(m.x, 0.006, m.z); p.receiveShadow = true; shopG.add(p);
      }
    }

    /* ============================================== THE MALL, past the glass
       An old Singapore shopping centre's corridor: terrazzo, a low ceiling of
       fluorescent troughs, square columns clad in tile, the neighbours' fronts
       on both sides, the Vesak banner across. Nothing out here is walkable in
       play — it is what the glass looks onto, and the film's way in. */
    {
      const W = MALL.x1 - MALL.x0, D = MALL.z1 - MALL.z0, mz = (MALL.z0 + MALL.z1) / 2;
      const fl = new THREE.Mesh(new THREE.PlaneGeometry(W, D), matTerr); fl.rotation.x = -Math.PI / 2; fl.position.set(0, 0, mz); fl.receiveShadow = true; mallG.add(fl);
      const ce = new THREE.Mesh(new THREE.PlaneGeometry(W, D), matMallCeil); ce.rotation.x = Math.PI / 2; ce.position.set(0, MALL.H, mz); mallG.add(ce);
      for (let i = 0; i < 7; i++) { const t = box(2.4, 0.04, 0.12, -12 + i * 4, MALL.H - 0.02, mz, matTube, mallG, false); t.castShadow = false; }
      // the neighbours across the corridor (facing -z) and on our side (facing +z)
      const kinds = ['travel', 'grocery', 'food', 'massage', 'gold', 'phone', 'shutter'];
      for (let i = 0; i < 7; i++) {
        const xx = MALL.x0 + 2 + i * 4;
        plane(3.9, 2.95, texMat(makeShopfront(THREE, cnv, kinds[i]), { roughness: 0.4, emissive: 0xffffff, emissiveIntensity: 0.18 }), xx, 1.48, MALL.z1 - 0.01, Math.PI, mallG);
        box(0.12, MALL.H, 0.2, xx + 1.98, MALL.H / 2, MALL.z1 + 0.05, matWallB, mallG, false);
      }
      for (const m of mallG.children) if (m.material && m.material.map && m.material.emissiveIntensity === 0.18) m.material.emissiveMap = m.material.map;
      for (const [xx, k] of [[-11.5, 'phone'], [-7.5, 'grocery'], [7.5, 'gold'], [11.5, 'shutter']]) {
        const mt = texMat(makeShopfront(THREE, cnv, k), { roughness: 0.4, emissive: 0xffffff, emissiveIntensity: 0.18 }); mt.emissiveMap = mt.map;
        plane(3.9, 2.95, mt, xx, 1.48, MALL.z0 - 0.02, 0, mallG);
      }
      box(SHOP.x0 - MALL.x0, MALL.H, 0.2, (MALL.x0 + SHOP.x0) / 2, MALL.H / 2, -0.14, matWallB, mallG, false);
      box(MALL.x1 - SHOP.x1, MALL.H, 0.2, (MALL.x1 + SHOP.x1) / 2, MALL.H / 2, -0.14, matWallB, mallG, false);
      box(SHOP.x1 - SHOP.x0, MALL.H - SHOP.H, 0.2, 0, SHOP.H + (MALL.H - SHOP.H) / 2, 0.04, matWallB, mallG, false);
      for (const s of [-1, 1]) box(0.2, MALL.H, D + 0.4, s * MALL.x1, MALL.H / 2, mz, matWallB, mallG, false);
      // the shop's own lightbox over its front
      const lbM = new THREE.MeshBasicMaterial({ map: tex(makeLightbox(THREE, cnv)) });
      plane(4.2, 0.6, lbM, 0, SHOP.H + 0.36, 0.15, 0, mallG);
      // two columns clad in small tiles
      for (const s of [-1, 1]) box(0.6, MALL.H, 0.6, s * 7.0, MALL.H / 2, 3.2, new THREE.MeshStandardMaterial({ color: 0xcfc6b4, roughness: 0.6 }), mallG);
      // HAPPY VESAK DAY over the corridor, readable from the shop's glass and from the corridor both
      const vb = texMat(makeVesakBanner(THREE, cnv), { emissive: 0xffffff, emissiveIntensity: 0.15, side: THREE.DoubleSide }); vb.emissiveMap = vb.map;
      plane(3.2, 0.6, vb, 0, 3.05, 2.6, Math.PI, mallG);
      plane(3.2, 0.6, vb, 0, 3.05, 2.62, 0, mallG);
    }

    /* ============================================== THE PEOPLE
       Stand-ins until Chad's models land (docs/V21.0-E3C3-PLAN.md §3, each a
       one-line swap). One parse per asset, every rig a clone. A STANDING rig
       is sized on its own idle (the v5.05 law); a SEATED one on its seated
       take, its plastic stool then put under its measured hips (the seat is
       ours, the hip height is the take's); a KNEELING one sized on its bind
       pose and grounded on its posed skin (e3c2's congregation). Culling
       spheres from the posed skin (v18.5 / v19.1). */
    const _v = new THREE.Vector3(), _cv = new THREE.Vector3(), _cm = new THREE.Matrix4();
    function skinCull(r, pad = 1.35, minR = 0) {
      if (!r.model) return;
      r.model.updateMatrixWorld(true);
      const bb = new THREE.Box3();
      r.model.traverse(o => {
        if (!o.isSkinnedMesh) return;
        o.skeleton.update();
        const n = o.geometry.attributes.position.count, step = Math.max(1, Math.floor(n / 4000));
        for (let i = 0; i < n; i += step) { o.getVertexPosition(i, _cv); _cv.applyMatrix4(o.matrixWorld); bb.expandByPoint(_cv); }
      });
      if (bb.isEmpty()) return;
      const sph = bb.getBoundingSphere(new THREE.Sphere()), R = Math.max(sph.radius * pad, minR);
      r.model.traverse(o => {
        if (!o.isSkinnedMesh) return;
        o.frustumCulled = true;
        _cm.copy(o.matrixWorld).invert();
        const k = o.matrixWorld.getMaxScaleOnAxis() || 1;
        o.boundingSphere = new THREE.Sphere(sph.center.clone().applyMatrix4(_cm), R / k);
      });
      r.culled = true;
    }
    function lowestBone(g) {
      let lo = Infinity;
      g.traverse(o => { if (o.isBone) { o.getWorldPosition(_v); lo = Math.min(lo, _v.y); } });
      return lo;
    }
    function skinLow(g) {
      let lo = Infinity;
      g.updateMatrixWorld(true);
      g.traverse(o => {
        if (!o.isSkinnedMesh) return;
        o.skeleton.update();
        const n = o.geometry.attributes.position.count;
        for (let i = 0; i < n; i += 5) { o.getVertexPosition(i, _cv); _cv.applyMatrix4(o.matrixWorld); if (_cv.y < lo) lo = _cv.y; }
      });
      return lo;
    }
    /* a red or blue plastic stool, its top at `top` (group-local) */
    function plasticStool(parent, x, z, top, color) {
      const g = new THREE.Group(); g.position.set(x, 0, z); parent.add(g);
      const m = new THREE.MeshStandardMaterial({ color, roughness: 0.45 });
      owned.push({ dispose: () => m.dispose() });
      cyl(0.17, 0.15, 0.03, 0, top - 0.015, 0, m, 20, g);
      for (let i = 0; i < 4; i++) { const a = i / 4 * Math.PI * 2 + Math.PI / 4;
        const l = cyl(0.018, 0.024, top - 0.03, Math.cos(a) * 0.13, (top - 0.03) / 2, Math.sin(a) * 0.13, m, 6, g);
        l.rotation.z = Math.cos(a) * 0.08; l.rotation.x = -Math.sin(a) * 0.08; }
      return g;
    }
    const rigs = [];
    function mkRig(key, opts) {
      const parent = opts.parent || shopG;
      const group = new THREE.Group();
      group.position.set(opts.x, opts.y || 0, opts.z); group.rotation.y = opts.ry || 0;
      parent.add(group);
      const ph = opts.seated ? 1.1 : opts.kneel ? 0.95 : opts.height;
      const proxy = new THREE.Mesh(new THREE.CapsuleGeometry(0.2, Math.max(0.1, ph - 0.4), 4, 8), matProxy);
      proxy.position.y = ph / 2 + 0.05; proxy.castShadow = !LOW; group.add(proxy);
      const rig = { key, group, proxy, model: null, mixer: null, acts: null, cur: null, head: null, hips: null,
                    ready: false, height: opts.height, idle: opts.idle || null, floor: opts.y || 0,
                    headWrote: null, nod: 0, nodT: 0, nodW: 0, lookYaw: 0, lookPitch: 0, look: opts.look || 0, lookK: 0,
                    talkUntil: 0, stool: null, opts };
      rig.play = (name, ts = 1, fade = 0.34, once = false, at) => {
        if (!rig.mixer || !rig.acts || !rig.acts[name]) return false;
        if (rig.cur === name && at === undefined) { rig.acts[name].setEffectiveTimeScale(ts); return true; }
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
        group.add(g); rig.model = g;
        g.traverse(o => {
          if (!o.isBone) return;
          if (HEAD_RE.test(o.name) && !rig.head) rig.head = o;
          if (/Hips(_\d+)?$/.test(o.name) && !rig.hips) rig.hips = o;
        });
        if (gltf.animations && gltf.animations.length) {
          rig.mixer = new THREE.AnimationMixer(g);
          rig.acts = {};
          for (const clip of gltf.animations) rig.acts[clip.name] = rig.mixer.clipAction(clip);
          owned.push({ dispose: () => rig.mixer && rig.mixer.stopAllAction() });
        }
        // size: on the bind pose (a kneeler), else on its own take
        const sizeOn = opts.kneel ? null : (opts.sizeOn || opts.idle);
        if (sizeOn && rig.acts && rig.acts[sizeOn]) { rig.play(sizeOn, 1, 0, false, opts.sizeAt ?? opts.at ?? 0); rig.mixer.update(0.001); }
        g.updateMatrixWorld(true);
        let lo = Infinity, hi = -Infinity, crown = false;
        g.traverse(o => {
          if (!o.isBone) return;
          o.getWorldPosition(_v); lo = Math.min(lo, _v.y); hi = Math.max(hi, _v.y);
          if (/HeadTop_End|head_end/.test(o.name)) crown = true;
        });
        if (isFinite(lo) && hi > lo) {
          const span = (hi - lo) / (crown ? 1 : 0.935);
          g.scale.multiplyScalar(opts.height / span); g.updateMatrixWorld(true);
        }
        if (rig.acts && opts.idle && rig.acts[opts.idle]) {
          if (opts.at !== undefined) rig.play(opts.idle, 1, 0, false, opts.at);
          else rig.play(opts.idle, opts.rate || 1, 0);
          rig.mixer.update(0.0001);
        }
        g.updateMatrixWorld(true);
        if (opts.kneel) {
          const sl = skinLow(g);
          if (isFinite(sl)) g.position.y += group.position.y - 0.004 - sl;
        } else {
          const lb = lowestBone(g);
          if (isFinite(lb)) g.position.y += group.position.y - lb + (opts.footLift ?? 0.02);
        }
        g.updateMatrixWorld(true);
        if (opts.seated && rig.hips) {
          rig.hips.getWorldPosition(_v);
          const local = group.worldToLocal(_v.clone());
          rig.stool = plasticStool(group, local.x, local.z - 0.02, Math.max(0.3, local.y - 0.1), opts.stool || 0xc8261c);
        }
        if (opts.then) opts.then(rig);
        g.updateMatrixWorld(true);
        skinCull(rig, 1.35, (opts.height || 1.7) * 0.8);
        proxy.visible = false; rig.ready = true; redoShadows();
      }).catch(err => { console.warn(key + ' failed to load', err); ctx.loadFail && ctx.loadFail(key, err); rig.ready = true; });
      rigs.push(rig);
      return rig;
    }
    /* THE HEAD (e3c1's law): put back what the mixer last wrote before it
       runs again, so a turn never stacks on the frame a take holds still */
    const _q = new THREE.Quaternion(), _e = new THREE.Euler(), _hp = new THREE.Vector3(), _cp = new THREE.Vector3();
    function headPre(rig) { if (rig.head && rig.headWrote) rig.head.quaternion.copy(rig.headWrote); }
    function headPost(rig, wdt) {
      if (!rig.head) return;
      if (!rig.headWrote) rig.headWrote = new THREE.Quaternion();
      rig.headWrote.copy(rig.head.quaternion);
      // the look: toward the lens, within a neck's reach, eased
      let ty = 0, tp = 0;
      if (rig.look > 0 && rig.group.visible) {
        rig.head.getWorldPosition(_hp); camera.getWorldPosition(_cp);
        const dx = _cp.x - _hp.x, dz = _cp.z - _hp.z, dy = _cp.y - _hp.y;
        const fwd = rig.group.rotation.y, a = Math.atan2(dx, dz) - fwd;
        const yawTo = Math.atan2(Math.sin(a), Math.cos(a));
        if (Math.abs(yawTo) < 1.6 && Math.hypot(dx, dz) < 7) { ty = THREE.MathUtils.clamp(yawTo, -1.0, 1.0); tp = THREE.MathUtils.clamp(-Math.atan2(dy, Math.hypot(dx, dz)), -0.4, 0.35); }
      }
      const k = 1 - Math.exp(-wdt * 3.0);
      rig.lookYaw += (ty * rig.look - rig.lookYaw) * k; rig.lookPitch += (tp * rig.look - rig.lookPitch) * k;
      rig.nodT += wdt;
      const target = rig.nod > 0 ? 1 : 0;
      rig.nodW += (target - rig.nodW) * (1 - Math.exp(-wdt * 5));
      if (rig.nod > 0) rig.nod = Math.max(0, rig.nod - wdt);
      const dip = rig.nodW * (0.06 * Math.sin(rig.nodT * 4.2) + 0.04 * Math.sin(rig.nodT * 1.7 + 1));
      if (Math.abs(dip) + Math.abs(rig.lookYaw) + Math.abs(rig.lookPitch) < 1e-4) return;
      _e.set(dip + rig.lookPitch, rig.lookYaw, 0, 'YXZ');
      _q.setFromEuler(_e);
      rig.head.quaternion.multiply(_q);
    }
    /* a line said with the talking take under it, then back to rest */
    function talk(rig, secs, take = 'Talk_with_Hands_Open') {
      if (!rig || !rig.acts || !rig.acts[take]) { if (rig) rig.nod = secs; return; }
      rig.play(take, 1, 0.3);
      rig.talkUntil = dayClock.t + secs;
    }
    function peopleTick(wdt) {
      for (const r of rigs) {
        if (!r.mixer || !r.group.visible) continue;
        if (r.talkUntil && dayClock.t > r.talkUntil) { r.talkUntil = 0; if (r.idle) r.play(r.idle, r.opts.rate || 1, 0.4); }
        headPre(r);
        r.mixer.update(wdt);
        headPost(r, wdt);
      }
      passerTick(wdt);
    }

    /* THE SHOP'S PEOPLE, before the chant */
    const SIT_W = 'mixamo.com', SHOUT = 'Armature|Sit_Shout_Hands_on_Mouth|baselayer';
    const owner  = mkRig('owner', { x: OWN.x, z: OWN.z, ry: -Math.PI / 2, height: 1.66, idle: 'Idle_9', look: 1 });
    const staff  = mkRig('staffman', { x: STAFF.x, z: STAFF.z, ry: Math.PI / 2, height: 1.73, idle: 'Idle_9', look: 0.6 });
    const girl   = mkRig('cg_woman2hd', { x: -0.62, z: -6.02, ry: Math.PI, height: 1.6, idle: 'kneel', kneel: true });
    const manW   = mkRig('cg_man2hd', { x: 0.55, z: -5.5, ry: Math.PI, height: 1.72, idle: 'pray', kneel: true });
    const auntie = mkRig('sitclap', { x: -2.45, z: -4.85, ry: Math.PI * 0.82, height: 1.22, idle: SIT_W, at: 0.05, seated: true, stool: 0xc8261c });
    const youth  = mkRig('sitshout', { x: 2.42, z: -4.85, ry: -Math.PI * 0.82, height: 1.27, idle: SHOUT, at: 0.0, seated: true, stool: 0x2a64b4 });
    const passer = mkRig('botak', { parent: mallG, x: -10, z: 2.9, ry: Math.PI / 2, height: 1.72, idle: 'Walking' });
    const PASS = { x0: -12.2, x1: 12.2, z: 2.9, v: 1.3, dir: 1 };
    function passerTick(wdt) {
      if (!passer.ready || !passer.group.visible) return;
      const g = passer.group;
      g.position.x += PASS.dir * PASS.v * wdt;
      if (g.position.x > PASS.x1) { PASS.dir = -1; g.rotation.y = -Math.PI / 2; }
      if (g.position.x < PASS.x0) { PASS.dir = 1; g.rotation.y = Math.PI / 2; }
    }

    /* --------------------------------------------- WORLD B · placeholder shell */
    const matFloorB = new THREE.MeshStandardMaterial({ color: 0xd9d2c4, roughness: 0.6 });
    const matWallBB = new THREE.MeshStandardMaterial({ color: 0xece6da, roughness: 0.9 });
    const matFloor0 = matFloorB;
    const floorB = new THREE.Mesh(new THREE.PlaneGeometry(9, 12.2), matFloor0);
    floorB.rotation.x = -Math.PI / 2; floorB.position.set(SHR.x, 0, -3.9); floorB.receiveShadow = true;
    world.add(floorB);
    walls.push(box(9, SHRINE_IN.H, 0.2, SHR.x, SHRINE_IN.H / 2, SHRINE_IN.z0 - 0.1, matRed));
    walls.push(box(0.2, SHRINE_IN.H, 12.2, SHRINE_IN.x0 - 0.1, SHRINE_IN.H / 2, -3.9, matWallBB));
    walls.push(box(0.2, SHRINE_IN.H, 12.2, SHRINE_IN.x1 + 0.1, SHRINE_IN.H / 2, -3.9, matWallBB));
    walls.push(box(9, SHRINE_IN.H, 0.2, SHR.x, SHRINE_IN.H / 2, 2.3, matDark));

    /* ------------------------------------------------------ the chapter clock */
    const PHASES = ['browse', 'owner', 'wear', 'join', 'chant', 'trance',
                    'arrive', 'wait', 'called', 'decide'];
    let phase = 'browse';
    let booted = false;
    const dayClock = { t: 0 };
    let lastWall = 0;
    const todo = [];
    function after(secs, fn) { todo.push({ at: dayClock.t + secs, fn }); todo.sort((a, b) => a.at - b.at); }
    function runTodo() { while (todo.length && todo[0].at <= dayClock.t) todo.shift().fn(); }
    function dropTodo() { todo.length = 0; }
    const heard = new Set();

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
      sayLine(q.name, q.vol, q.onStart, 0);
    }

    /* ------------------------------------------------------------ the phases */
    const inShrine = (x) => x < -100;
    function setPhase(p, opts) {
      phase = p;
      if (kit) kit.setPhase(p);
      objectiveFor(p, opts);
    }
    function objectiveFor(p, opts) {
      if (!kit) return;
      const W = DATA.words;
      const obj = { browse: W.objBrowse, owner: W.objOwner, wear: W.objWear, join: W.objJoin,
                    chant: W.objChant, arrive: W.objIncense, wait: W.objWait }[p];
      kit.objective(obj || null, opts);
      kit.waypoint(null);
    }

    /* ------------------------------------------------------- the decision */
    const _ndc = new THREE.Vector3();
    const PILE_POS = new THREE.Vector3(SHR.x, 0, -5.4);   // the medium's table
    const INTERACT_R = 2.4;
    const pile = new THREE.Group(); pile.position.copy(PILE_POS); world.add(pile);
    const pileLive = () => phase === 'decide' && inShrine(yaw.position.x);
    function pileDist() { return Math.hypot(yaw.position.x - PILE_POS.x, yaw.position.z - PILE_POS.z); }
    function pileScreen() { camera.updateMatrixWorld(); return _ndc.set(PILE_POS.x, 1.0, PILE_POS.z).project(camera); }
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

    const hotspots = [];

    /* ------------------------------------------------------------ the frame */
    let lastFrame = 0;
    function updateNotes(dt, t) {
      /* the people's clocks run in play AND under a film (v5.19: a guard that
         owns the poses must not own the clocks) — on wall time */
      const now = performance.now() / 1000;
      const wdt = lastFrame ? Math.min(0.1, now - lastFrame) : 0; lastFrame = now;
      const st = getState();
      if (st === 'play' || st === 'cine') peopleTick(wdt);
      if (st !== 'play') { lastWall = 0; return; }
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

    /* ------------------------------------------------------------ a resume */
    function applyPhase(p) {
      const tag = String(p || '').split(':');
      p = tag[0];
      if (!PHASES.includes(p)) p = 'browse';
      setPhase(p);
    }

    /* ---------------------------------------------------------- lifecycle */
    function snap() { return { phase }; }
    function restore() {}
    function reset() {
      dropTodo(); speakReset(); lineQ.length = 0; heard.clear();
      booted = false; dayClock.t = 0; lastWall = 0;
      if (kit) {
        kit.root(false); kit.pose('standing', { secs: 0.05 });
        if (kit.pray) kit.pray(false, { secs: 0 });
        if (kit.hands) kit.hands(0, { secs: 0 });
        kit.presence(0);
        kit.setPhase('browse');
      }
      phase = 'browse';
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
      const geos = new Set(), mats = new Set();
      const sweep = (root) => root.traverse(o => {
        if (o.geometry) geos.add(o.geometry);
        if (o.material) for (const m of (Array.isArray(o.material) ? o.material : [o.material])) mats.add(m);
      });
      sweep(world);
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

    return (S = {
      world, noteTex, blockers: blockers(),
      ready: () => true,
      pile: { pos: PILE_POS, radius: INTERACT_R, group: pile,
              dist: pileDist, screen: pileScreen, inView: pileInView,
              hits: pointerHitsPile, interact: interactPile,
              glow: () => 0 },
      drum: null, ash: null, embers: null, heroNote: null, smoke: null, flying: null,
      jossTips: [], fireLight: null,
      get noteStorm() { return 1; },
      set noteStorm(v) {},
      SHOP, MALL, SHR, MAT,
      pileVia: { what: 'the mat at the altar (the trance carries him to the shrine)', x: MAT.x, z: MAT.z },   // walktest: the medium is behind a scene change
      get phase() { return phase; },
      setPhase, applyPhase, after, dayClock, sayLine,
      info: () => ({ phase, t: +dayClock.t.toFixed(2), queued: lineQ.length, heard: [...heard],
                     until: +speak.until.toFixed(2), pending: speak.pending ? speak.pending.name : null }),
      hotspots,
      updateNotes, updatePile, updateFire, updateSlow,
      snap, restore, reset, dispose
    });
  }

  /* ============================================================ THE FILM
     Context only (Chad: "The opening film should not already have him
     trancing. It should only set the stage and context for what is about to
     happen"). CP9 builds it; until then, three seconds of black lifting. */
  function intro(c, s, api) {
    const { fade } = api;
    fade(0, 3.0, 1, 1);
    c.keepFade = true;
    c.endFade = 1;
  }

  /* ============================================================ THE ENDINGS
     CP8 builds them; until then each is a short fade so the chapter can be
     played end to end while it is half-built. */
  function ending(secs) {
    return (c, s, api) => {
      const { fade } = api;
      fade(secs * 0.6, secs, 0, 1);
      c.endFade = 1;
    };
  }
  const scAccept = ending(3.0), scWrong = ending(3.0), scLeave = ending(3.0), scSeek = ending(3.0);

  /* ================================================== THE DRAWN SURFACES
     Every sheet is drawn here, on a canvas (CSP-safe, no download). The words
     on the signs are world art, not the sheet's (the jetty sign's precedent,
     v14.5): a shop is called what its lightbox says. */
  function rng(seed) { let s = seed >>> 0 || 1; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
  function done(THREE, c, rep) {
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
    if (rep) { t.wrapS = t.wrapT = THREE.RepeatWrapping; }
    return t;
  }
  function sized(cnv, W, H) { const [c, x] = cnv(W); c.height = H; return [c, x]; }
  /* a soft round glow (painted light: additive, no lamp) */
  function makeGlowTex(THREE, cnv, rgb) {
    const S = 128, [c, x] = cnv(S);
    const g = x.createRadialGradient(64, 64, 2, 64, 64, 64);
    g.addColorStop(0, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},1)`); g.addColorStop(0.35, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},0.45)`); g.addColorStop(1, `rgba(${rgb[0]},${rgb[1]},${rgb[2]},0)`);
    x.fillStyle = g; x.fillRect(0, 0, S, S);
    return done(THREE, c, false);
  }
  /* a small printed sign: words on a coloured card, sized to its aspect */
  function makeSignTxt(THREE, cnv, text, bg, fg, aspect) {
    const W = 512, H = Math.round(W / aspect), [c, x] = sized(cnv, W, H);
    x.fillStyle = bg; x.fillRect(0, 0, W, H);
    x.strokeStyle = fg; x.lineWidth = Math.max(2, H * 0.05); x.strokeRect(H * 0.08, H * 0.08, W - H * 0.16, H - H * 0.16);
    let px = Math.floor(H * 0.56); x.font = 'bold ' + px + 'px sans-serif';
    while (x.measureText(text).width > W * 0.86 && px > 6) { px -= 2; x.font = 'bold ' + px + 'px sans-serif'; }
    x.fillStyle = fg; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(text, W / 2, H * 0.54);
    return done(THREE, c, false);
  }
  /* the shop's floor: 600 mm porcelain, warm white, a faint vein, grout */
  function makeShopTiles(THREE, cnv) {
    const S = 512, [c, x] = cnv(S), r = rng(3);
    for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) {
      const g = 226 + r() * 10;
      x.fillStyle = `rgb(${g},${g - 4},${g - 12})`; x.fillRect(i * 256, j * 256, 256, 256);
      for (let k = 0; k < 6; k++) {                      // soft veining
        x.strokeStyle = `rgba(150,140,128,${0.05 + r() * 0.06})`; x.lineWidth = 1 + r() * 2;
        x.beginPath(); let px = i * 256 + r() * 256, py = j * 256 + r() * 256; x.moveTo(px, py);
        for (let q = 0; q < 5; q++) { px += r() * 60 - 30; py += r() * 60 - 30; x.lineTo(px, py); }
        x.stroke();
      }
      const gr = x.createLinearGradient(i * 256, j * 256, i * 256 + 256, j * 256 + 256);   // a polish sheen
      gr.addColorStop(0, 'rgba(255,255,255,0.0)'); gr.addColorStop(0.5, 'rgba(255,255,255,0.08)'); gr.addColorStop(1, 'rgba(255,255,255,0.0)');
      x.fillStyle = gr; x.fillRect(i * 256, j * 256, 256, 256);
    }
    x.fillStyle = '#b9b0a2'; for (const p of [0, 255]) { x.fillRect(0, p, S, 2); x.fillRect(p, 0, 2, S); }
    return done(THREE, c, true);
  }
  /* the old mall's terrazzo: cream, chips of grey, rust, black and white,
     brass divider strips on a 1.2 m grid */
  function makeTerrazzo(THREE, cnv) {
    const S = 512, [c, x] = cnv(S), r = rng(19);
    x.fillStyle = '#d8ccb4'; x.fillRect(0, 0, S, S);
    const cols = ['#8c8478', '#6e3b28', '#2a2622', '#f2ece0', '#a89c88', '#b7643e'];
    for (let i = 0; i < 5200; i++) {
      x.fillStyle = cols[(r() * cols.length) | 0];
      x.globalAlpha = 0.45 + r() * 0.5;
      const w = 1 + r() * 5, h = 1 + r() * 4;
      x.beginPath(); x.ellipse(r() * S, r() * S, w, h, r() * 3, 0, Math.PI * 2); x.fill();
    }
    x.globalAlpha = 1;
    const gr = x.createRadialGradient(S * 0.4, S * 0.6, 20, S * 0.4, S * 0.6, S * 0.7);   // a century of feet
    gr.addColorStop(0, 'rgba(255,250,240,0.10)'); gr.addColorStop(1, 'rgba(90,80,60,0.10)');
    x.fillStyle = gr; x.fillRect(0, 0, S, S);
    x.fillStyle = '#a8864a'; x.fillRect(0, 0, S, 3); x.fillRect(0, 0, 3, S);
    return done(THREE, c, true);
  }
  /* the 600 mm T-bar ceiling: fissured mineral tiles in a thin grey grid */
  function makeCeilGrid(THREE, cnv) {
    const S = 512, [c, x] = cnv(S), r = rng(23);
    x.fillStyle = '#ece9e2'; x.fillRect(0, 0, S, S);
    for (let i = 0; i < 2600; i++) { x.fillStyle = `rgba(120,116,108,${0.05 + r() * 0.12})`; x.fillRect(r() * S, r() * S, 1 + r() * 2, 1); }
    x.fillStyle = '#9a968e'; for (const p of [0, 254]) { x.fillRect(0, p, S, 4); x.fillRect(p, 0, 4, S); }
    return done(THREE, c, true);
  }
  /* the shop's name on its glass in gold leaf: Thai, Chinese and English, as a
     Singapore Thai-amulet shop writes it (transparent between the letters) */
  function makeGlassName(THREE, cnv) {
    const [c, x] = sized(cnv, 1024, 384);
    x.clearRect(0, 0, 1024, 384);
    const gold = x.createLinearGradient(0, 0, 0, 384);
    gold.addColorStop(0, '#ffe6a0'); gold.addColorStop(0.5, '#d4a23e'); gold.addColorStop(1, '#a8761e');
    x.textAlign = 'center'; x.textBaseline = 'middle';
    x.shadowColor = 'rgba(40,20,0,0.6)'; x.shadowBlur = 4;
    x.fillStyle = gold; x.font = 'bold 92px sans-serif'; x.fillText('พระเครื่องสยาม', 512, 92);
    x.font = 'bold 64px sans-serif'; x.fillText('暹 罗 佛 牌', 512, 200);
    x.font = 'bold 56px serif'; x.fillText('SIAM AMULET HOUSE', 512, 300);
    x.shadowBlur = 0; x.strokeStyle = '#d4a23e'; x.lineWidth = 3;
    x.beginPath(); x.moveTo(170, 248); x.lineTo(854, 248); x.stroke();
    return done(THREE, c, false);
  }
  /* the lightbox over the front, facing the corridor */
  function makeLightbox(THREE, cnv) {
    const [c, x] = sized(cnv, 1024, 192);
    const g = x.createLinearGradient(0, 0, 0, 192); g.addColorStop(0, '#b01c14'); g.addColorStop(1, '#7a0e08');
    x.fillStyle = g; x.fillRect(0, 0, 1024, 192);
    x.strokeStyle = '#f2c14e'; x.lineWidth = 6; x.strokeRect(8, 8, 1008, 176);
    x.fillStyle = '#ffe08a'; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.font = 'bold 70px sans-serif'; x.fillText('SIAM AMULET HOUSE  暹罗佛牌', 512, 72);
    x.fillStyle = '#fff4dc'; x.font = 'bold 34px sans-serif'; x.fillText('พระเครื่อง · AMULETS · BUDDHA IMAGES · 佛像', 512, 142);
    return done(THREE, c, false);
  }
  /* a neighbouring shopfront in the old mall: a sign band and a window */
  function makeShopfront(THREE, cnv, kind) {
    const W = 512, H = 384, [c, x] = sized(cnv, W, H), r = rng(kind.length * 7 + 3);
    const K = {
      grocery: { band: '#1f6a3a', ink: '#fff4c8', name: 'THAI MART  ร้านค้าไทย', sub: 'Fresh from Bangkok daily' },
      travel:  { band: '#174a8c', ink: '#ffffff', name: 'BANGKOK TRAVEL', sub: 'Bus · Air · Tours  ทัวร์' },
      massage: { band: '#b03a6a', ink: '#fff0f6', name: 'THAI MASSAGE  นวดไทย', sub: 'Foot · Body · Herbal' },
      gold:    { band: '#7a1a10', ink: '#ffd76a', name: '金店 GOLDSMITH', sub: '916 · 999 Gold' },
      phone:   { band: '#202020', ink: '#7fe0ff', name: 'MOBILE CENTRE', sub: 'Repair · Top-up · SIM' },
      shutter: { band: '#5a5a5a', ink: '#e8e8e8', name: 'TO LET', sub: 'Enquiries 9xxx xxxx' },
      food:    { band: '#c46a10', ink: '#fff6e0', name: 'THAI KITCHEN  อาหารไทย', sub: 'Boat noodles · Tom yum' }
    }[kind] || { band: '#444', ink: '#fff', name: kind.toUpperCase(), sub: '' };
    x.fillStyle = '#3a3a3e'; x.fillRect(0, 0, W, H);
    x.fillStyle = K.band; x.fillRect(0, 0, W, 86);
    x.fillStyle = K.ink; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.font = 'bold 40px sans-serif'; x.fillText(K.name, W / 2, 34);
    x.font = '22px sans-serif'; x.fillText(K.sub, W / 2, 68);
    if (kind === 'shutter' || kind === 'massage') {               // a roller shutter, part or all the way down
      const top = kind === 'massage' ? 230 : 92;
      x.fillStyle = '#d8dad6'; x.fillRect(10, 92, W - 20, H - 102);
      x.fillStyle = '#9ea29c'; x.fillRect(10, top, W - 20, H - top - 10);
      for (let y = top; y < H - 10; y += 9) { x.fillStyle = 'rgba(40,40,40,0.35)'; x.fillRect(10, y, W - 20, 2); }
      if (kind === 'massage') { x.fillStyle = '#f6c8da'; for (let i = 0; i < 3; i++) x.fillRect(40 + i * 150, 110, 110, 100); }
      return done(THREE, c, false);
    }
    // the window: a glass box of goods
    x.fillStyle = '#e8eef0'; x.fillRect(10, 92, W - 20, H - 102);
    if (kind === 'grocery' || kind === 'food') {
      for (let sh = 0; sh < 4; sh++) {
        const y = 110 + sh * 66;
        x.fillStyle = '#9a9a9a'; x.fillRect(16, y + 56, W - 32, 4);
        for (let i = 0; i < 18; i++) {
          x.fillStyle = `hsl(${(r() * 360) | 0},${55 + r() * 30}%,${40 + r() * 25}%)`;
          const w = 16 + r() * 10, h = 26 + r() * 26; x.fillRect(20 + i * 26.5, y + 56 - h, w, h);
        }
      }
    } else if (kind === 'travel') {
      for (let i = 0; i < 3; i++) {                                // posters: a temple at sunset, a beach, a city
        const px = 26 + i * 160;
        const gr = x.createLinearGradient(0, 110, 0, 340);
        gr.addColorStop(0, ['#f2a046', '#4ab0e0', '#8a6ad0'][i]); gr.addColorStop(1, ['#7a2a1a', '#e8d8a0', '#202040'][i]);
        x.fillStyle = gr; x.fillRect(px, 110, 140, 200);
        x.fillStyle = 'rgba(20,10,10,0.75)';
        if (i === 0) { x.beginPath(); x.moveTo(px + 70, 160); x.lineTo(px + 110, 260); x.lineTo(px + 30, 260); x.fill(); x.fillRect(px + 20, 260, 100, 30); }
        if (i === 2) for (let k = 0; k < 6; k++) x.fillRect(px + 10 + k * 21, 200 + (k * 37 % 50), 16, 110);
        x.fillStyle = '#fff'; x.font = 'bold 18px sans-serif'; x.fillText(['BANGKOK', 'PHUKET', 'HAT YAI'][i], px + 70, 330);
      }
    } else if (kind === 'gold') {
      x.fillStyle = '#2a0c08'; x.fillRect(16, 100, W - 32, H - 116);
      for (let i = 0; i < 60; i++) { x.strokeStyle = `rgba(255,${190 + r() * 50},${70 + r() * 40},0.9)`; x.lineWidth = 2;
        x.beginPath(); x.arc(30 + r() * (W - 60), 120 + r() * 230, 6 + r() * 12, 0, Math.PI * 2); x.stroke(); }
    } else if (kind === 'phone') {
      for (let i = 0; i < 4; i++) for (let j = 0; j < 3; j++) {
        x.fillStyle = '#1a1a1a'; x.fillRect(40 + i * 112, 110 + j * 84, 52, 74);
        x.fillStyle = `hsl(${(r() * 360) | 0},60%,55%)`; x.fillRect(44 + i * 112, 116 + j * 84, 44, 60);
      }
    }
    const sheen = x.createLinearGradient(0, 92, W, H);            // the glass
    sheen.addColorStop(0, 'rgba(255,255,255,0.16)'); sheen.addColorStop(0.4, 'rgba(255,255,255,0)'); sheen.addColorStop(0.6, 'rgba(255,255,255,0.08)'); sheen.addColorStop(1, 'rgba(255,255,255,0)');
    x.fillStyle = sheen; x.fillRect(10, 92, W - 20, H - 102);
    return done(THREE, c, false);
  }
  /* one amulet in its case, for the atlas: k picks the kind */
  function drawAmulet(x, cx, cy, s, k, r) {
    const casing = k % 3 === 0 ? '#d6a640' : k % 3 === 1 ? '#c8ccd2' : '#2a2a2a';
    const clay = ['#c9b48e', '#8a6a44', '#5a4a3a', '#d8c8a4', '#b08a5a', '#7a5a3a', '#e0d0b0', '#a07a50'][k % 8];
    x.save(); x.translate(cx, cy);
    const shape = (pad) => {
      x.beginPath();
      if (k === 2) { x.moveTo(0, -s - pad); x.lineTo(s * 0.8 + pad, s * 0.8 + pad); x.lineTo(-s * 0.8 - pad, s * 0.8 + pad); x.closePath(); }
      else if (k === 3 || k === 5) x.arc(0, 0, s * (k === 5 ? 1.0 : 0.8) + pad, 0, Math.PI * 2);
      else if (k === 4) { x.moveTo(-s * 0.6 - pad, s + pad); x.lineTo(-s * 0.6 - pad, -s * 0.3); x.lineTo(0, -s - pad); x.lineTo(s * 0.6 + pad, -s * 0.3); x.lineTo(s * 0.6 + pad, s + pad); x.closePath(); }
      else if (k === 7) { x.rect(-s * 0.25 - pad, -s - pad, s * 0.5 + 2 * pad, 2 * s + 2 * pad); }
      else x.rect(-s * 0.62 - pad, -s - pad, s * 1.24 + 2 * pad, 2 * s + 2 * pad);
    };
    x.fillStyle = casing; shape(s * 0.12); x.fill();
    x.fillStyle = clay; shape(0); x.fill();
    // the image on its face: a seated figure under an arch, or a monk's head on a coin
    x.fillStyle = 'rgba(40,24,10,0.55)';
    if (k === 3 || k === 5) { x.beginPath(); x.arc(0, -s * 0.15, s * 0.32, 0, Math.PI * 2); x.fill(); x.fillRect(-s * 0.4, s * 0.15, s * 0.8, s * 0.35); }
    else if (k === 7) { for (let i = -3; i <= 3; i++) x.fillRect(-s * 0.2, i * s * 0.26, s * 0.4, s * 0.06); }
    else {
      x.beginPath(); x.arc(0, -s * 0.38, s * 0.16, 0, Math.PI * 2); x.fill();
      x.beginPath(); x.moveTo(-s * 0.36, s * 0.42); x.quadraticCurveTo(0, -s * 0.3, s * 0.36, s * 0.42); x.closePath(); x.fill();
      x.fillRect(-s * 0.46, s * 0.42, s * 0.92, s * 0.1);
      if (k === 0) { x.strokeStyle = 'rgba(40,24,10,0.5)'; x.lineWidth = 2; x.beginPath(); x.arc(0, -s * 0.1, s * 0.5, Math.PI, 0); x.stroke(); }
    }
    x.fillStyle = 'rgba(255,255,255,0.22)'; x.beginPath(); x.ellipse(-s * 0.2, -s * 0.5, s * 0.25, s * 0.1, -0.5, 0, Math.PI * 2); x.fill();
    x.restore();
  }
  /* red velvet under a counter's glass, rows of cased amulets on it */
  function makeVelvetTray(THREE, cnv, seed) {
    const [c, x] = sized(cnv, 1024, 256), r = rng(seed);
    const g = x.createLinearGradient(0, 0, 0, 256); g.addColorStop(0, '#6a0c10'); g.addColorStop(1, '#4a0608');
    x.fillStyle = g; x.fillRect(0, 0, 1024, 256);
    for (let i = 0; i < 1800; i++) { x.fillStyle = `rgba(${r() < 0.5 ? '120,20,24' : '30,0,2'},${r() * 0.3})`; x.fillRect(r() * 1024, r() * 256, 2, 2); }
    for (let row = 0; row < 3; row++) for (let i = 0; i < 16; i++) {
      drawAmulet(x, 34 + i * 63 + (row % 2) * 12, 46 + row * 80, 24, (i + row * 3 + (seed % 5)) % 8, r);
      x.fillStyle = '#f4ecd8'; x.fillRect(22 + i * 63 + (row % 2) * 12, 78 + row * 80, 26, 9);   // its price tag
    }
    return done(THREE, c, false);
  }
  /* framed amulets, one kind to a cell, for the wall cabinets */
  function makeAmuletAtlas(THREE, cnv) {
    const [c, x] = sized(cnv, 1024, 512), r = rng(77);
    for (let k = 0; k < 8; k++) {
      const cx = (k % 4) * 256, cy = ((k / 4) | 0) * 256;
      x.fillStyle = '#efe6d0'; x.fillRect(cx, cy, 256, 256);
      x.fillStyle = '#5a0a0c'; x.fillRect(cx + 18, cy + 18, 220, 220);                    // the velvet of the frame's mount
      drawAmulet(x, cx + 128, cy + 128, 70, k, r);
    }
    return done(THREE, c, false);
  }
  /* THE OLD MASTERS — nine framed photographs of venerable monks, the kind
     every amulet shop hangs behind its counter: sepia, a vignette, the robe
     over the left shoulder and the right bare, a gilt frame, a brass plate
     that names a TITLE only (Luang Phor, Luang Pu, Kruba, Phra Ajarn). The
     faces are drawn soft and generic on purpose: no real master's likeness. */
  function drawMonkPhoto(x, px, py, w, h, v, r) {
    x.save(); x.beginPath(); x.rect(px, py, w, h); x.clip();
    const sep = (k, a = 1) => { const L = [[238, 226, 200], [214, 196, 160], [176, 150, 112], [128, 102, 72], [84, 64, 44], [46, 34, 24]][k]; return `rgba(${L[0]},${L[1]},${L[2]},${a})`; };
    // the backdrop: a studio wall or a wat's, light at the top
    const bg = x.createLinearGradient(0, py, 0, py + h);
    bg.addColorStop(0, sep(v % 3 === 2 ? 2 : 1)); bg.addColorStop(1, sep(v % 3 === 2 ? 3 : 2));
    x.fillStyle = bg; x.fillRect(px, py, w, h);
    const seated = v % 3 === 1, fan = v === 4 || v === 7;
    const cx = px + w * (0.5 + (r() - 0.5) * 0.04);
    if (fan) {                                              // a talipat fan behind him
      x.fillStyle = sep(1, 0.9); x.beginPath(); x.ellipse(cx + w * 0.16, py + h * 0.3, w * 0.2, h * 0.26, 0.2, 0, Math.PI * 2); x.fill();
      x.strokeStyle = sep(3, 0.5); x.lineWidth = 1.5;
      for (let i = -4; i <= 4; i++) { x.beginPath(); x.moveTo(cx + w * 0.16, py + h * 0.54); x.lineTo(cx + w * 0.16 + Math.sin(i * 0.3 + 0.2) * w * 0.2, py + h * 0.3 - Math.cos(i * 0.3) * h * 0.25); x.stroke(); }
      x.fillStyle = sep(4); x.fillRect(cx + w * 0.155, py + h * 0.52, w * 0.012, h * 0.5);
    }
    const headR = seated ? w * 0.085 : w * 0.15;
    const hy = seated ? py + h * 0.3 : py + h * 0.4;
    const sw = seated ? w * 0.26 : w * 0.44;                // half the shoulders
    const sy = hy + headR * 1.45;
    // the body: his bare right shoulder and arm (the viewer's left), skin
    x.fillStyle = sep(2);
    x.beginPath(); x.moveTo(cx - sw * 0.25, sy - headR * 0.2); x.quadraticCurveTo(cx - sw, sy, cx - sw * 1.02, sy + headR * 1.4);
    x.lineTo(cx - sw * 0.95, py + h); x.lineTo(cx, py + h); x.closePath(); x.fill();
    // the robe: over his left shoulder, across the chest, under the right arm
    const rg = x.createLinearGradient(cx - sw, sy, cx + sw, py + h);
    rg.addColorStop(0, sep(3)); rg.addColorStop(1, sep(4));
    x.fillStyle = rg; x.beginPath();
    x.moveTo(cx + sw * 0.1, sy - headR * 0.25); x.quadraticCurveTo(cx + sw * 0.95, sy - headR * 0.05, cx + sw * 1.05, sy + headR * 1.2);
    x.lineTo(cx + sw * 1.1, py + h); x.lineTo(cx - sw * 0.9, py + h);
    x.lineTo(cx - sw * 0.92, sy + headR * 2.6); x.quadraticCurveTo(cx - sw * 0.3, sy + headR * 1.6, cx + sw * 0.1, sy - headR * 0.25);
    x.fill();
    x.strokeStyle = sep(5, 0.35); x.lineWidth = 2;          // its folds, along the drape
    for (let i = 0; i < 6; i++) { const t = 0.15 + i * 0.13; x.beginPath();
      x.moveTo(cx - sw * (0.8 - t), sy + headR * (2.4 - t * 2)); x.quadraticCurveTo(cx + sw * (t * 0.6), sy + headR * (1.6 + t), cx + sw * (0.2 + t), py + h); x.stroke(); }
    if (seated) {                                           // the platform, crossed legs, hands in the lap
      x.fillStyle = sep(2); x.fillRect(px, py + h * 0.9, w, h * 0.1);
      x.fillStyle = sep(5, 0.4); x.fillRect(px, py + h * 0.9, w, h * 0.012);
      const lg = x.createLinearGradient(0, py + h * 0.7, 0, py + h * 0.92);
      lg.addColorStop(0, sep(3)); lg.addColorStop(1, sep(4));
      x.fillStyle = lg; x.beginPath();
      x.moveTo(cx - w * 0.17, py + h * 0.7); x.lineTo(cx + w * 0.17, py + h * 0.7);
      x.quadraticCurveTo(cx + w * 0.4, py + h * 0.74, cx + w * 0.39, py + h * 0.86);
      x.quadraticCurveTo(cx + w * 0.36, py + h * 0.91, cx, py + h * 0.91);
      x.quadraticCurveTo(cx - w * 0.36, py + h * 0.91, cx - w * 0.39, py + h * 0.86);
      x.quadraticCurveTo(cx - w * 0.4, py + h * 0.74, cx - w * 0.17, py + h * 0.7); x.fill();
      x.strokeStyle = sep(5, 0.3); x.lineWidth = 1.5;
      for (let i = 0; i < 4; i++) { x.beginPath(); x.moveTo(cx - w * (0.3 - i * 0.04), py + h * (0.76 + i * 0.03)); x.quadraticCurveTo(cx, py + h * (0.8 + i * 0.03), cx + w * (0.3 - i * 0.04), py + h * (0.76 + i * 0.03)); x.stroke(); }
      x.fillStyle = sep(1); x.beginPath(); x.ellipse(cx - w * 0.02, py + h * 0.735, w * 0.06, h * 0.022, 0.15, 0, Math.PI * 2); x.fill();
      x.fillStyle = sep(2); x.beginPath(); x.ellipse(cx + w * 0.03, py + h * 0.742, w * 0.055, h * 0.02, -0.1, 0, Math.PI * 2); x.fill();
    }
    // the neck and the shaved head, lit from the upper left
    x.fillStyle = sep(2); x.fillRect(cx - headR * 0.42, hy + headR * 0.6, headR * 0.84, headR * 0.95);
    x.fillStyle = sep(3, 0.5); x.fillRect(cx + headR * 0.1, hy + headR * 0.6, headR * 0.32, headR * 0.95);
    for (const s of [-1, 1]) { x.fillStyle = sep(2); x.beginPath(); x.ellipse(cx + s * headR * 0.92, hy + headR * 0.1, headR * 0.16, headR * 0.3, 0, 0, Math.PI * 2); x.fill(); }
    const hg = x.createRadialGradient(cx - headR * 0.35, hy - headR * 0.45, headR * 0.1, cx, hy, headR * 1.15);
    hg.addColorStop(0, sep(0)); hg.addColorStop(0.55, sep(1)); hg.addColorStop(1, sep(3));
    x.fillStyle = hg; x.beginPath(); x.ellipse(cx, hy, headR * 0.86, headR * 1.05, 0, 0, Math.PI * 2); x.fill();
    // a face, soft: brows, lowered eyes, the nose's shadow, a closed mouth, age
    const f = headR, ey = hy + f * 0.05, dark = sep(5, 0.55), mid = sep(4, 0.35);
    x.lineCap = 'round';
    x.strokeStyle = mid; x.lineWidth = Math.max(1, f * 0.07);
    for (const s of [-1, 1]) { x.beginPath(); x.moveTo(cx + s * f * 0.12, ey - f * 0.2); x.quadraticCurveTo(cx + s * f * 0.34, ey - f * 0.3, cx + s * f * 0.52, ey - f * 0.18); x.stroke(); }
    x.strokeStyle = dark; x.lineWidth = Math.max(1, f * 0.06);
    for (const s of [-1, 1]) { x.beginPath(); x.moveTo(cx + s * f * 0.16, ey); x.quadraticCurveTo(cx + s * f * 0.32, ey + f * 0.06, cx + s * f * 0.48, ey - f * 0.01); x.stroke(); }
    x.fillStyle = sep(3, 0.45); x.beginPath(); x.moveTo(cx - f * 0.02, ey + f * 0.04); x.lineTo(cx + f * 0.1, ey + f * 0.38); x.lineTo(cx - f * 0.08, ey + f * 0.4); x.closePath(); x.fill();
    x.strokeStyle = dark; x.lineWidth = Math.max(1, f * 0.05);
    x.beginPath(); x.moveTo(cx - f * 0.18, ey + f * 0.6); x.quadraticCurveTo(cx, ey + f * 0.64, cx + f * 0.18, ey + f * 0.6); x.stroke();
    if (v % 2 === 0) { x.strokeStyle = mid; x.lineWidth = Math.max(1, f * 0.035);           // an old man's lines
      for (const s of [-1, 1]) { x.beginPath(); x.moveTo(cx + s * f * 0.2, ey + f * 0.34); x.quadraticCurveTo(cx + s * f * 0.3, ey + f * 0.5, cx + s * f * 0.24, ey + f * 0.66); x.stroke(); }
      x.beginPath(); x.moveTo(cx - f * 0.3, hy - f * 0.55); x.lineTo(cx + f * 0.3, hy - f * 0.55); x.stroke(); }
    if (v === 5) {                                          // round spectacles, as some of the old masters wore
      x.strokeStyle = sep(5, 0.7); x.lineWidth = Math.max(1, f * 0.05);
      for (const s of [-1, 1]) { x.beginPath(); x.arc(cx + s * f * 0.32, ey, f * 0.2, 0, Math.PI * 2); x.stroke(); }
      x.beginPath(); x.moveTo(cx - f * 0.12, ey - f * 0.02); x.lineTo(cx + f * 0.12, ey - f * 0.02); x.stroke();
    }
    // the photograph's age: a vignette, grain, a foxed corner
    const vg = x.createRadialGradient(px + w / 2, py + h * 0.45, w * 0.2, px + w / 2, py + h * 0.5, w * 0.78);
    vg.addColorStop(0, 'rgba(40,26,12,0)'); vg.addColorStop(1, 'rgba(40,26,12,0.55)');
    x.fillStyle = vg; x.fillRect(px, py, w, h);
    for (let k = 0; k < 900; k++) { x.fillStyle = `rgba(${r() < 0.5 ? '255,240,210' : '50,34,16'},${r() * 0.1})`; x.fillRect(px + r() * w, py + r() * h, 1.5, 1.5); }
    x.fillStyle = 'rgba(150,110,50,0.18)'; x.beginPath(); x.arc(px + (v % 2 ? w : 0), py + h, w * 0.18, 0, Math.PI * 2); x.fill();
    x.restore();
  }
  function makeMastersWall(THREE, cnv) {
    const S = 1024, [c, x] = sized(cnv, S, S), r = rng(31);
    x.clearRect(0, 0, S, S);                             // the wall shows between the frames (alphaTest)
    const TITLES = ['หลวงพ่อ', 'หลวงปู่', 'ครูบา', 'พระอาจารย์', 'หลวงพ่อ', 'หลวงปู่', 'ครูบา', 'หลวงพ่อ', 'หลวงปู่'];
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) {
      const v = i + j * 3, cw = S / 3, fx = i * cw + 14, fy = j * cw + 10, fw = cw - 28, fh = cw - 20;
      // the gilt frame: outer moulding, a dark rebate, a cream mat
      const fg = x.createLinearGradient(fx, fy, fx + fw, fy + fh);
      fg.addColorStop(0, '#f2cf7a'); fg.addColorStop(0.45, '#b8862a'); fg.addColorStop(1, '#7a5418');
      x.fillStyle = fg; x.fillRect(fx, fy, fw, fh);
      x.strokeStyle = 'rgba(255,236,170,0.7)'; x.lineWidth = 2; x.strokeRect(fx + 6, fy + 6, fw - 12, fh - 12);
      x.fillStyle = '#3a2410'; x.fillRect(fx + 16, fy + 16, fw - 32, fh - 32);
      x.fillStyle = '#efe6d0'; x.fillRect(fx + 20, fy + 20, fw - 40, fh - 40);
      const pw = fw - 72, ph = fh - 98;
      drawMonkPhoto(x, fx + 36, fy + 34, pw, ph, v, r);
      x.strokeStyle = 'rgba(60,40,20,0.5)'; x.lineWidth = 1; x.strokeRect(fx + 36, fy + 34, pw, ph);
      // the brass plate under it: a title, never a name
      const plY = fy + fh - 54, plW = fw * 0.5;
      const pg = x.createLinearGradient(0, plY, 0, plY + 24); pg.addColorStop(0, '#f4d88a'); pg.addColorStop(1, '#a8781e');
      x.fillStyle = pg; x.fillRect(fx + (fw - plW) / 2, plY, plW, 24);
      x.fillStyle = '#4a2a08'; x.font = 'bold 15px sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle';
      x.fillText(TITLES[v], fx + fw / 2, plY + 12);
      x.fillStyle = 'rgba(255,255,255,0.08)'; x.beginPath();                                // the glass's glare
      x.moveTo(fx + 36, fy + 34); x.lineTo(fx + 36 + pw * 0.5, fy + 34); x.lineTo(fx + 36, fy + 34 + ph * 0.6); x.closePath(); x.fill();
    }
    return done(THREE, c, false);
  }
  /* a Thai wall calendar: the red header, a temple picture, the month's grid */
  function makeCalendar(THREE, cnv) {
    const [c, x] = sized(cnv, 256, 384);
    x.fillStyle = '#fbf7ee'; x.fillRect(0, 0, 256, 384);
    x.fillStyle = '#b21a12'; x.fillRect(0, 0, 256, 40);
    x.fillStyle = '#ffe08a'; x.font = 'bold 22px sans-serif'; x.textAlign = 'center'; x.fillText('พฤษภาคม 2569', 128, 28);
    const g = x.createLinearGradient(0, 44, 0, 196); g.addColorStop(0, '#f6b04a'); g.addColorStop(1, '#8a2a12');
    x.fillStyle = g; x.fillRect(12, 46, 232, 150);
    x.fillStyle = '#e8b030'; x.beginPath(); x.moveTo(128, 70); x.lineTo(168, 180); x.lineTo(88, 180); x.fill();   // a chedi
    x.fillStyle = '#3a2a2a'; x.font = '15px sans-serif';
    for (let d = 0; d < 31; d++) { const col = d % 7, row = (d / 7) | 0; x.fillStyle = d === 30 ? '#b21a12' : '#3a2a2a'; x.fillText(String(d + 1), 26 + col * 34, 226 + row * 32); }
    return done(THREE, c, false);
  }
  /* the wall clock's face (the hands are meshes, so the time can pass) */
  function makeClockFace(THREE, cnv) {
    const S = 256, [c, x] = cnv(S);
    x.fillStyle = '#fbfaf6'; x.beginPath(); x.arc(128, 128, 124, 0, Math.PI * 2); x.fill();
    x.strokeStyle = '#2a2a2a'; x.lineWidth = 6; x.stroke();
    x.fillStyle = '#1a1a1a'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.font = 'bold 26px sans-serif';
    for (let h = 1; h <= 12; h++) { const a = h / 12 * Math.PI * 2; x.fillText(String(h), 128 + Math.sin(a) * 96, 128 - Math.cos(a) * 96); }
    for (let m = 0; m < 60; m++) { const a = m / 60 * Math.PI * 2, L = m % 5 ? 6 : 12; x.lineWidth = m % 5 ? 2 : 4;
      x.beginPath(); x.moveTo(128 + Math.sin(a) * 118, 128 - Math.cos(a) * 118); x.lineTo(128 + Math.sin(a) * (118 - L), 128 - Math.cos(a) * (118 - L)); x.stroke(); }
    return done(THREE, c, false);
  }
  /* HAPPY VESAK DAY, gold on saffron, lotuses at the ends */
  function makeVesakBanner(THREE, cnv) {
    const [c, x] = sized(cnv, 1024, 192);
    const g = x.createLinearGradient(0, 0, 0, 192); g.addColorStop(0, '#f6a316'); g.addColorStop(1, '#d4700a');
    x.fillStyle = g; x.fillRect(0, 0, 1024, 192);
    x.strokeStyle = '#fff2c0'; x.lineWidth = 5; x.strokeRect(10, 10, 1004, 172);
    const lotus = (cx) => {
      for (let i = -2; i <= 2; i++) { x.fillStyle = i % 2 ? '#f8b8c8' : '#f490aa';
        x.save(); x.translate(cx, 120); x.rotate(i * 0.36); x.beginPath(); x.ellipse(0, -34, 14, 38, 0, 0, Math.PI * 2); x.fill(); x.restore(); }
    };
    lotus(90); lotus(934);
    x.fillStyle = '#7a1a08'; x.textAlign = 'center'; x.textBaseline = 'middle';
    x.font = 'bold 76px serif'; x.fillText('HAPPY VESAK DAY', 512, 82);
    x.font = 'bold 34px sans-serif'; x.fillText('卫塞节快乐 · สุขสันต์วันวิสาขบูชา', 512, 148);
    return done(THREE, c, false);
  }
  /* the Buddhist flag: blue, yellow, red, white, orange, and the sixth band
     that is all five together */
  function makeBuddhistFlag(THREE, cnv) {
    const [c, x] = sized(cnv, 240, 160);
    const cols = ['#2b5fb4', '#f2c12e', '#c8261c', '#f6f4ee', '#e8781e'];
    for (let i = 0; i < 5; i++) { x.fillStyle = cols[i]; x.fillRect(i * 40, 0, 40, 160); }
    for (let i = 0; i < 5; i++) { x.fillStyle = cols[i]; x.fillRect(200, i * 32, 40, 32); }
    return done(THREE, c, false);
  }
  /* the red board behind the shop's Buddha (chapter 1's v19.1 lai rot nam,
     redrawn at a shop's size) */
  function makeAltarScreen(THREE, cnv) {
    const W = 768, H = 640, [c, x] = sized(cnv, W, H), r = rng(41);
    const GOLD = '#d7a548', GOLD2 = '#f0cf7a', DEEP = '#6d140e';
    const g = x.createRadialGradient(W / 2, H * 0.42, 50, W / 2, H * 0.5, W * 0.72);
    g.addColorStop(0, '#7a1a12'); g.addColorStop(1, '#5a0f0a');
    x.fillStyle = g; x.fillRect(0, 0, W, H);
    const B = 70, P = 80;
    x.save(); x.beginPath(); x.rect(B, B, W - 2 * B, H - 2 * B); x.clip();
    x.strokeStyle = GOLD; x.lineWidth = 2.5;
    for (let k = -H; k < W + H; k += P) { x.beginPath(); x.moveTo(k, 0); x.lineTo(k + H, H); x.stroke(); x.beginPath(); x.moveTo(k, H); x.lineTo(k + H, 0); x.stroke(); }
    const flower = (cx, cy, rr) => {
      x.fillStyle = GOLD;
      for (let i = 0; i < 4; i++) { x.save(); x.translate(cx, cy); x.rotate(i * Math.PI / 2);
        x.beginPath(); x.moveTo(0, 0); x.bezierCurveTo(rr * 0.55, -rr * 0.35, rr * 0.75, -rr * 0.05, rr, 0); x.bezierCurveTo(rr * 0.75, rr * 0.05, rr * 0.55, rr * 0.35, 0, 0); x.fill(); x.restore(); }
      x.fillStyle = GOLD2; x.beginPath(); x.arc(cx, cy, rr * 0.2, 0, Math.PI * 2); x.fill();
    };
    for (let row = 0, y = 0; y <= H + P; row++, y += P / 2) for (let xx = (row % 2) * P / 2; xx <= W + P; xx += P) flower(xx, y, 20);
    x.restore();
    x.fillStyle = DEEP; x.fillRect(0, 0, W, B); x.fillRect(0, H - B, W, B); x.fillRect(0, 0, B, H); x.fillRect(W - B, 0, B, H);
    x.strokeStyle = GOLD; x.lineWidth = 5; x.strokeRect(10, 10, W - 20, H - 20); x.lineWidth = 3; x.strokeRect(B - 6, B - 6, W - 2 * B + 12, H - 2 * B + 12);
    for (let i = 0; i < 900; i++) { x.fillStyle = `rgba(${r() < 0.5 ? '255,220,150' : '30,6,4'},${r() * 0.07})`; x.fillRect(r() * W, r() * H, 2 + r() * 3, 1 + r() * 2); }
    return done(THREE, c, false);
  }
  function makeReedMat(THREE, cnv) {
    const S = 256, [c, x] = cnv(S), r = rng(13);
    x.fillStyle = '#b89a62'; x.fillRect(0, 0, S, S);
    for (let i = 0; i < S; i += 4) { const v = 150 + r() * 50; x.fillStyle = `rgb(${v},${v * 0.82 | 0},${v * 0.52 | 0})`; x.fillRect(0, i, S, 3); }
    x.fillStyle = '#7a1c14'; x.fillRect(0, 0, S, 14); x.fillRect(0, S - 14, S, 14);                   // its red binding
    return done(THREE, c, false);
  }
  /* boxes of amulet cases on the back shelves, labels in Thai and English */
  function makeBoxRow(THREE, cnv) {
    const [c, x] = sized(cnv, 512, 128), r = rng(53);
    x.fillStyle = '#3a2a1e'; x.fillRect(0, 0, 512, 128);
    for (let i = 0; i < 12; i++) {
      const w = 34 + r() * 8; x.fillStyle = ['#e8e0cc', '#c8a050', '#d8d4cc', '#8a1a14', '#f2ecd8'][(r() * 5) | 0];
      x.fillRect(6 + i * 42, 20 + r() * 20, w, 108);
      x.fillStyle = 'rgba(60,30,10,0.8)'; x.font = 'bold 12px sans-serif'; x.fillText(['LP', 'พระ', '#', 'AJ', 'วัด'][i % 5] + ((i * 37) % 90 + 10), 10 + i * 42, 70);
    }
    return done(THREE, c, false);
  }

  (window.__CHAPTERS__ = window.__CHAPTERS__ || {}).e3c3 = Object.assign(DATA, {
    build,
    intro,
    scenes: [scAccept, scWrong, scLeave, scSeek]
  });
})();
