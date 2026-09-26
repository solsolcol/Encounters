/* EPISODE 2 · CHAPTER 3 · THE PRESSURE — v11.0
   Outfield, night one. The section resting by the shell scrapes they dug,
   and him at the rear one, closest to the jungle, with a torch and nothing to
   do but look. Then the weight on his leg.

   Chad's shape (docs/V11.0-E2C3-PLAN.md): narration and storytelling first
   in the film; play is the harbour at night with an objective to look around
   and shine the torch at spots in the jungle for curiosity; the camera shakes
   with a sting and the eerie laugh; "Something was pressing against my leg";
   the objective turns to shining the torch down; "nothing around... no
   one..."; "But I still feel the pressure on my leg..."; the four options;
   and option A turns the view 180 degrees onto a transparent soldier already
   running away on leaf-litter footsteps. Every mechanic here is LOOKING.

   One engine seam (the eighteenth): a hotspot with `dwell` fires when the
   reticle has rested on it — a thing you can only look at has no button.
   Everything else is the kit as it stood at v10.8.                        */
(() => {
  const DATA = {
    /* v14.15: the items this chapter can hand out (kit.give), so the engine prepares
       their models behind the entry curtain rather than in play. chaptertest checks it. */
    items: ['torch'],
    id: 3,
    episode: 2,
    title: 'The Pressure',
    cardLabel: 'Chapter 3',
    cardTitle: 'The Pressure',
    brief: 'Infantry. The first night of the outfield exercise, in a harbour dug into the jungle. You have the rear scrape, the one facing out into the dark. Nothing to do but wait for morning — so look around.',
    prompt: 'Something is pressing on your leg. Not a feeling: weight. The torch is on the ground at your feet and there is nothing there. What do you do?',
    choices: [
      { k: 'A', text: 'Shine the torch on the source of the pressure',
        d: { sanity: 9, awareness: 18, wisdom: 21 }, verdict: 'good',
        say: 'I put the light on it before I moved. It ran. Light was the one thing it wouldn\'t stay for.',
        teach: 'Courage does not require deliberately removing your own safety advantages.' },
      { k: 'B', text: 'Reach down into the dark',
        d: { sanity: -12, awareness: 9, wisdom: -9 }, verdict: 'bad',
        say: 'I reached into the dark before I looked. My hand still remembers what moved.',
        teach: 'Making observation harder is not bravery.' },
      { k: 'C', text: 'Ask your buddy if he felt it',
        d: { sanity: 6, awareness: 21, wisdom: 24 }, verdict: 'best',
        say: 'I asked him. He felt nothing. Two of us, one night, two different nights.',
        teach: 'Independent context can narrow possibilities without forcing a conclusion.' },
      { k: 'D', text: '"Who\'s there?"',
        d: { sanity: -6, awareness: 6, wisdom: -12 }, verdict: 'worst',
        say: 'I called out to it. It stopped the moment I did. I gave it my voice.',
        teach: 'Provocation and investigation are not the same thing.' }
    ],
    core: 'A feeling is not proof. The weight on your leg is vedanā, a sensation. The fear that follows it is saṅkhāra, the story your mind builds on top. Look for the ordinary first, and do not feed the story.<br><i>Vedanā-khandha · Saṅkhāra-khandha — the feeling, and what the mind makes of it. Do not engage. Do not provoke. Observe.</i>',

    /* units metres, y up. The harbour is a clearing about 12 m across at
       the end of a track; the ring of scrapes sits round (0, 4) and HIS is
       the rear one at the origin, facing −z into the trees. The track leaves
       the clearing at +z. The film's road pocket stands 150 m off at −z,
       inside its own painted dusk. */
    spawn:     { x: 0, y: 1.62, z: 0, rot: 0 },        // his scrape, facing the jungle
    shrine:    { x: 7.0, z: 10.4 },                        // the engine's anchor for HER; unused (ghost: null) and out of prompt range
    ghostHome: { x: 7.0, z: 10.4 },
    bounds:    { minX: -7.2, maxX: 7.2, minZ: -4.6, maxZ: 10.6 },

    ghost: null,

    /* NIGHT in secondary jungle: no moon, a cold blue hemisphere barely
       there, a light fog so the trees three metres out are the last thing
       with edges. The torch is what you see by. */
    daylight: {
      stops: [[0.00, '#05070a'], [0.30, '#04060a'], [1.00, '#020305']],
      bg: 0x04060a,
      fog: [0x060a0d, 0.055],
      hemi: [0x24304a, 0x0a0e0a, 0.32],
      key: [0x5a6a8a, 0.08, 10, 20, -6],
      fill: [0x2a3448, 0.06],
      stars: 0.35, moon: 0,
      sun: 0, clouds: 0,
      vmHemi: [0x262f44, 0x0a0c10, 0.35],
      vmKey: [0x8ea3cc, 0.25]
    },

    /* the play kit's one data declaration: a torch, ON, white — this
       chapter is about curiosity, so the player gets the whole beam */
    torch: { on: false, item: 'torch', angle: 0.40, intensity: 24, distance: 26, penumbra: 0.6,
             model: 'flashlight', click: 'torchclick' },   // v11.1: Chad's flashlight in the hand while it is on; F or the button, with its switch. v11.6: OFF and an ITEM — it lies on the ground until he picks it up and equips it

    assets: ['fbosling', 'kamaz', 'forest', 'tree1', 'tree2', 'tree3', 'tree4', 'flashlight'],   // v11.6: the flashlight is a world prop too   // v11.2: Chad's truck and forest for the film; the sleeper statue is gone (the rig sleeps on its own take)

    musicVol: 0,
    /* the jungle, all night, keyed to nothing; the episode's dread under it
       at chapter 1's level (v10.7); `tonner` is the film's and starts at 0 */
    ambience: { beds: [['junglenight', 0.34], ['junglelife', 0.30], ['e2dread', 1.0], ['tonner', 0]] },   // v11.3: the wildlife bed beside the insects

    words: {
      approach: 'the ground at your feet',
      act: 'E to look down',
      actTouch: 'Tap to look down',
      interact: 'E to look down',
      interactTouch: 'Tap to look down',
      presence: 'Something is pressing on your leg.',
      objLook: 'Look around. Shine the torch into the jungle · {n}/6',
      objDown: 'Shine the torch down. On the ground.',
      hotSpot: 'Hold the torch on it',
      hotBuddy: 'Hold the torch on him',
      hotFeet: 'Look down at your boots',
      /* v11.6 (Chad): the torch is picked up, equipped and switched on
         before the night begins — three orders, one line each */
      objPick: 'Pick up the torch on the ground',
      objEquip: 'Picked up Torch. Equip now to use.',
      objSwitch: 'Turn on the torch · press F',
      objSwitchTouch: 'Turn on the torch · tap the torch icon',
      hotTorch: 'E to pick up the torch',
      hotTorchTouch: 'Tap to pick up the torch'
    },
    sayPrefix: 'n3'
  };

  /* the last light, painted for the film's road pocket, and what the world
     tweens down to over the walk in */
  const DUSK = {
    stops: [[0.00, '#3b4a6b'], [0.35, '#6b5a5c'], [0.70, '#b06a4a'], [1.00, '#e8b27a']],
    bg: 0x8a6a5a,
    fog: [0x6a5a58, 0.006],
    hemi: [0xffd0a0, 0x3a3a2a, 0.85],
    key: [0xffb070, 0.55, -20, 6, 10],
    fill: [0x6a70a0, 0.25],
    stars: 0, moon: 0,
    sun: 0.35, clouds: 0.3,
    vmHemi: [0xffd8b0, 0x3a3a2a, 0.8],
    vmKey: [0xffb070, 0.5]
  };

  /* the measured length of every line said outside a cutscene (masters/v11.0) */
  const SECS = { n3spot1: 3.16, n3spot2: 2.69, n3spot3: 2.85, b3here: 2.5, n3spot5: 2.93, n3spot6: 5.49, n3press: 6.35, n3look: 5.80, n3still: 2.69, k3bush: 5.51 };   // v11.4: k3bush (masters/v11.4); v11.6: n3press and n3look re-said panicked and faster (masters/v11.6); v13.0: n3press re-said [terrified], 5.64 -> 6.35 (masters/v13.0) — the beat after it is stated in SECS.n3press, so it moves with the take

  const hash = (i, s) => { const x = Math.sin(i * 127.1 + s * 311.7) * 43758.5453; return x - Math.floor(x); };

  function build(ctx) {
    const { THREE, GLTFLoader, cloneSkinned, scene, camera, yaw, pitch, LOW, kit, plantTrees,
            assetBytes, rescueTextures, redoShadows, cnv, makeHellNote, makeGrass,
            getState, startDecision, worldSfx, warmSounds, HEAD_RE } = ctx;

    const owned = [];
    let alive = true;

    /* ------------------------------------------------------------- the map */
    const HIS = { x: 0, z: 0 };
    const CENTRE = { x: 0, z: 4.0 };
    /* the section, resting: where each man is and which way he faces (a
       Mixamo rig at ry 0 faces +z). His scrape is the rear one; the buddy's
       is beside it; the commander's chemlights are across the ring. */
    const BUDDY  = { x: -2.7, z: 1.1, ry: Math.PI + 0.35 };
    const KNEEL1 = { x: 3.1, z: 1.6, ry: Math.PI - 0.4 };
    const KNEEL2 = { x: -3.6, z: 4.8, ry: -0.7 };
    const LIE1   = { x: 3.8, z: 4.9, ry: 0.4 };
    const CMD    = { x: 0.5, z: 7.7, ry: Math.PI };
    const SCRAPES = [HIS, BUDDY, KNEEL1, KNEEL2, LIE1, CMD];
    const PK = { x: 0, z: -150 };                       // the film's road pocket
    /* v11.2: the film's set is Chad's forest (assets/forest.glb) at FOREST.S
       times its file scale. The number is MEASURED against the road: 0.39
       units wide in the ground sheet, which at x8 is 3.1 m — a laterite
       track a 2.9 m Kamaz fits with a boot's width to spare; the trees come
       out 6–16 m, the trunks half a metre. ROAD is the road's centreline in
       FILE units, traced off the ground sheet (dbg-road: eyeballed waypoints
       refined to the dark ruts' peak in every eighth row, mapped to world
       space through the mesh's own UVs, smoothed, resampled to 37 points
       2.8 m apart). The truck drives it and the file walks the end of it. */
    const FOREST = { S: 8 };
    const ROAD = [[1.302,0.079,5.062], [1.032,0.135,4.843], [0.777,0.188,4.607], [0.542,0.138,4.35], [0.294,0.082,4.106], [0.028,0.06,3.883], [-0.241,0.017,3.663], [-0.493,-0.025,3.424], [-0.692,-0.044,3.141], [-0.852,-0.066,2.832], [-1.092,-0.041,2.584], [-1.375,-0.021,2.382], [-1.651,-0.027,2.171], [-1.866,-0.044,1.901], [-2.013,-0.031,1.586], [-2.086,-0.018,1.252], [-1.978,-0.036,0.924], [-1.958,-0.033,0.579], [-1.845,-0.004,0.268], [-1.572,-0.063,0.055], [-1.297,-0.039,-0.156], [-1.099,-0.066,-0.439], [-0.89,-0.031,-0.714], [-0.599,-0.019,-0.902], [-0.291,-0.013,-1.064], [0.02,-0.008,-1.22], [0.33,-0.009,-1.378], [0.638,-0.016,-1.539], [0.942,-0.024,-1.708], [1.236,-0.029,-1.894], [1.512,-0.029,-2.106], [1.765,-0.017,-2.344], [1.985,-0.012,-2.613], [2.133,-0.022,-2.926], [2.247,-0.04,-3.254], [2.385,-0.007,-3.573], [2.384,0.001,-3.916]];

    /* ----------------------------------------------------------- textures */
    const noteTex = makeHellNote();                     // the contract wants one
    const paint = (S, fn, repeat) => {
      const [c, cx] = cnv(S); fn(cx, S);
      const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
      if (repeat) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(repeat[0], repeat[1]); }
      return t;
    };
    const madeTex = [noteTex];
    const mt = (t) => { madeTex.push(t); return t; };
    // leaf litter: dark, wet, a hand of browns and one green in ten
    const litterTex = mt(paint(512, (cx, S) => {
      cx.fillStyle = '#17140f'; cx.fillRect(0, 0, S, S);
      for (let i = 0; i < 2600; i++) {
        const x = hash(i, 1) * S, y = hash(i, 2) * S, r = 3 + hash(i, 3) * 9, a = hash(i, 4) * Math.PI;
        const g = hash(i, 5);
        cx.fillStyle = g < 0.1 ? `rgba(${40 + g * 200},${70 + g * 120},${30},0.85)`
                              : `rgba(${38 + g * 40},${28 + g * 28},${14 + g * 12},${0.55 + g * 0.4})`;
        cx.save(); cx.translate(x, y); cx.rotate(a); cx.beginPath(); cx.ellipse(0, 0, r, r * 0.45, 0, 0, 7); cx.fill(); cx.restore();
      }
    }, [14, 14]));
    // a fern card: fronds on transparent, drawn from the base
    const fernTex = mt(paint(256, (cx, S) => {
      cx.clearRect(0, 0, S, S);
      for (let f = 0; f < 7; f++) {
        const a = -Math.PI / 2 + (f - 3) * 0.32, L = S * (0.55 + hash(f, 7) * 0.4);
        cx.strokeStyle = `rgba(${30 + f * 6},${70 + hash(f, 8) * 50},${28},0.95)`; cx.lineWidth = 3;
        cx.beginPath(); cx.moveTo(S / 2, S); cx.lineTo(S / 2 + Math.cos(a) * L, S + Math.sin(a) * L); cx.stroke();
        for (let k = 0.15; k < 1; k += 0.07) {
          const px = S / 2 + Math.cos(a) * L * k, py = S + Math.sin(a) * L * k, w = S * 0.09 * (1 - k);
          cx.fillStyle = `rgba(${34 + f * 5},${80 + hash(f * 9 + k * 30, 9) * 50},${30},0.9)`;
          cx.beginPath(); cx.ellipse(px, py, w, w * 0.35, a + Math.PI / 2, 0, 7); cx.fill();
        }
      }
    }));
    const duskSky = mt(paint(512, (cx, S) => {
      const g = cx.createLinearGradient(0, 0, 0, S);
      g.addColorStop(0, '#2a3654'); g.addColorStop(0.42, '#6b5a5c'); g.addColorStop(0.5, '#c07a52'); g.addColorStop(0.56, '#e8b27a'); g.addColorStop(1, '#3a2a24');
      cx.fillStyle = g; cx.fillRect(0, 0, S, S);
    }));
    const grassTex = makeGrass ? makeGrass() : null;

    const world = new THREE.Group();
    scene.add(world);
    const nfm = (o) => new THREE.MeshStandardMaterial(Object.assign({}, o));
    const nf = (o) => new THREE.MeshStandardMaterial(Object.assign({ fog: false }, o));
    const box = (w, h, d, x, y, z, mat, parent = world) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
      m.position.set(x, y, z); m.castShadow = !LOW; m.receiveShadow = true;
      parent.add(m); return m;
    };

    /* --------------------------------------------------------- the ground */
    const matLitter = nfm({ map: litterTex, color: 0x9a8a6a, roughness: 1 });
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(120, 120), matLitter);
    ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; world.add(ground);
    const matMud = nfm({ color: 0x0f0c08, roughness: 1 });
    const matSpoil = nfm({ map: litterTex, color: 0x6a5a40, roughness: 1 });
    const matPack = nfm({ color: 0x2c3a2a, roughness: 0.95 });
    const matRifle = nfm({ color: 0x15171a, roughness: 0.55, metalness: 0.4 });
    const solids = [];
    /* THE SCRAPES, already dug (Chad: "everyone is just resting by their
       shellscrape they digged"): a dark rectangle where the earth is gone,
       the spoil heaped on the outer lip, a pack and a rifle on it. Each lies
       tangent to the ring, outboard of its man. */
    for (const s of SCRAPES) {
      const dx = s.x - CENTRE.x, dz = s.z - CENTRE.z, d = Math.hypot(dx, dz) || 1;
      const ox = dx / d, oz = dz / d;                    // outward
      const g = new THREE.Group(); g.position.set(s.x + ox * 0.95, 0, s.z + oz * 0.95); g.rotation.y = Math.atan2(ox, oz); world.add(g);
      const hole = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 0.62), matMud); hole.rotation.x = -Math.PI / 2; hole.position.y = 0.012; g.add(hole);
      const spoil = box(1.9, 0.20, 0.38, 0, 0.10, 0.48, matSpoil, g); spoil.rotation.x = 0.18;
      box(0.42, 0.34, 0.26, 0.55, 0.37, 0.50, matPack, g);
      const rifle = box(0.9, 0.05, 0.06, -0.35, 0.24, 0.50, matRifle, g); rifle.rotation.y = 0.12;
    }

    /* ------------------------------------------------------- undergrowth */
    const matFern = nfm({ map: fernTex, transparent: false, alphaTest: 0.5, side: THREE.DoubleSide, roughness: 1, color: 0x8a9a7a });
    const FERN_N = LOW ? 110 : 190;
    const ferns = new THREE.InstancedMesh(new THREE.PlaneGeometry(1.1, 1.1), matFern, FERN_N);
    {
      const mtx = new THREE.Matrix4(), q = new THREE.Quaternion(), p = new THREE.Vector3(), sc = new THREE.Vector3();
      for (let i = 0; i < FERN_N; i++) {
        const a = hash(i, 31) * Math.PI * 2, r = 5.4 + hash(i, 32) * 11;
        let x = CENTRE.x + Math.cos(a) * r, z = CENTRE.z + Math.sin(a) * r;
        if (Math.abs(x) < 1.4 && z > 8) x += 2.2 * Math.sign(x || 1);      // keep the track open
        const h = 0.7 + hash(i, 33) * 0.7;
        p.set(x, h * 0.5, z); q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), hash(i, 34) * Math.PI); sc.set(h, h, 1);
        mtx.compose(p, q, sc); ferns.setMatrixAt(i, mtx);
      }
      ferns.instanceMatrix.needsUpdate = true; ferns.computeBoundingSphere(); ferns.castShadow = false; world.add(ferns);
    }
    /* the strangler fig ahead of his scrape (spot 1) and the fallen log
       (spot 2): the two things the torch finds first, built of primitives */
    const matBark = nfm({ color: 0x3a3028, roughness: 0.98 });
    const FIG = { x: -1.2, z: -6.5 };
    {
      const g = new THREE.Group(); g.position.set(FIG.x, 0, FIG.z); world.add(g);
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.62, 9, 10), matBark); trunk.position.y = 4.5; trunk.castShadow = !LOW; g.add(trunk);
      for (let i = 0; i < 9; i++) {
        const a = i / 9 * Math.PI * 2, r = 0.9 + hash(i, 41) * 0.6;
        const root = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.11, 2.6, 6), matBark);
        root.position.set(Math.cos(a) * r * 0.55, 1.1, Math.sin(a) * r * 0.55); root.rotation.z = Math.cos(a) * 0.55; root.rotation.x = -Math.sin(a) * 0.55; g.add(root);
      }
      solids.push(trunk);
    }
    const LOG = { x: -5.2, z: -3.2 };
    {
      const log = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.34, 4.2, 9), matBark); log.rotation.z = Math.PI / 2; log.rotation.y = 0.5; log.position.set(LOG.x, 0.3, LOG.z); log.castShadow = !LOW; world.add(log); solids.push(log);
      const matFungus = nfm({ color: 0xc9b58a, roughness: 0.9 });
      for (let i = 0; i < 5; i++) { const f = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.05, 0.05, 8), matFungus); f.position.set(LOG.x + (i - 2) * 0.55, 0.52, LOG.z + (i - 2) * 0.3); f.rotation.z = 0.4; world.add(f); }
    }
    const GAP = { x: 5.6, z: -7.4 };

    /* ------------------------------------------------------------ the trees
       Chad's kit, dealt from seed 23: a ring round the clearing from 8 m out
       with a corridor left open for the track at +z, thicker further out.
       The two trunks either side of GAP are placed by hand — "a gap between
       two trunks, going nowhere". Trunks inside the bounds get a blocker. */
    const TREE_AT = [[4.7, -7.7, 8.2], [6.6, -7.1, 7.6]];
    /* v11.3 (Chad: "increase the density of trees, add more trees in the
       playable night scene"): 88 candidates → 230, with a second, closer
       band from 6.0 m — and a SIGHT-LINE rule the first stand only had by
       luck: no trunk within 1.1 m of the line from his scrape to any of the
       six torch spots (the fig, the log, the gap's two trunks, the buddy,
       the chemlights), or within 1.6 m of any man, or on the track. A
       forest that hides what the objective asks him to look at is a puzzle
       with no answer. Measured after: the stand is 2.4x denser and every
       spot is still looked at by `dwellFires` in the probe. */
    const LOOK_AT = [[FIG.x, FIG.z], [LOG.x, LOG.z], [4.7, -7.7], [6.6, -7.1], [BUDDY.x, BUDDY.z], [CMD.x + 0.2, CMD.z + 0.5]];
    const segDist = (px, pz, ax, az, bx, bz) => { const vx = bx - ax, vz = bz - az, t = Math.max(0, Math.min(1, ((px - ax) * vx + (pz - az) * vz) / (vx * vx + vz * vz || 1))); return Math.hypot(px - (ax + vx * t), pz - (az + vz * t)); };
    for (let i = 0; i < 230; i++) {
      const a = hash(i, 51) * Math.PI * 2, r = i < 88 ? 8.2 + hash(i, 52) * 24 * (hash(i, 53) < 0.5 ? 0.35 : 1) : 6.0 + hash(i, 52) * 22 * (hash(i, 53) < 0.6 ? 0.4 : 1);
      const x = CENTRE.x + Math.cos(a) * r, z = CENTRE.z + Math.sin(a) * r;
      if (Math.abs(x) < 2.4 && z > 9) continue;                          // the track
      if (Math.hypot(x - FIG.x, z - FIG.z) < 2.2 || Math.hypot(x - LOG.x, z - LOG.z) < 2.4) continue;
      if (LOOK_AT.some(([tx, tz]) => segDist(x, z, HIS.x, HIS.z, tx, tz) < 1.1)) continue;
      if (SCRAPES.some(m => Math.hypot(x - m.x, z - m.z) < 1.6)) continue;
      if (TREE_AT.some(([tx, tz]) => Math.hypot(x - tx, z - tz) < 1.5)) continue;   // no two trunks in one spot
      TREE_AT.push([x, z, 6.5 + hash(i, 54) * 4.5]);
    }
    const treeStand = plantTrees ? plantTrees(world, TREE_AT.map(([x, z, h]) => ({ x, z, h })),
      { seed: 23, tint: new THREE.Color(0.72, 0.86, 0.70), roughness: 0.97, lowKeep: 0.6 }) : null;
    const treeBlockers = TREE_AT.filter(([x, z]) => x > DATA.bounds.minX - 0.5 && x < DATA.bounds.maxX + 0.5 && z > DATA.bounds.minZ - 0.5 && z < DATA.bounds.maxZ + 0.5)
      .map(([x, z]) => new THREE.Box3(new THREE.Vector3(x - 0.42, 0, z - 0.42), new THREE.Vector3(x + 0.42, 2.5, z + 0.42)));

    /* --------------------------------------------------------- the lights */
    const chem = new THREE.PointLight(0xff2a1a, 1.4, 5.5, 1.8); chem.position.set(CMD.x + 0.3, 0.35, CMD.z + 0.6); world.add(chem);
    const matChem = nfm({ color: 0xff3020, emissive: 0xff2a10, emissiveIntensity: 1.6, roughness: 0.6 });
    for (const [dx, dz] of [[0.3, 0.6], [-0.4, 0.9]]) { const c = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.15, 6), matChem); c.position.set(CMD.x + dx, 0.08, CMD.z + dz); c.rotation.z = 0.9; world.add(c); }
    const fill = new THREE.PointLight(0x2a3a5a, 0.35, 16, 1.6); fill.position.set(0, 5, 4); world.add(fill);

    /* ------------------------------------------------------------ the cast
       ONE parse per model, cloned (`cloneSkinned`, the v4.8 seam), so the
       section, the film's riders and the runner share geometry and maps. */
    const CULL_SPHERE = { fbosling: { x: 0.056, y: 0.837, z: 0.212, r: 1.379 } };
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
    const gltfCache = {};
    const loadGltf = (key) => gltfCache[key] || (gltfCache[key] = assetBytes(key).then(BUF => new Promise((res, rej) =>
      new GLTFLoader().parse(BUF, '', (gltf) => {
        rescueTextures(gltf, BUF);
        /* v15: the scene and the takes, not the parser — a resolved gltf holds
           its parser, and the parser a whole copy of the file's binary chunk
           and its image slices, for as long as the cache lives */
        res({ scene: gltf.scene, animations: gltf.animations });
      }, rej))));
    const matProxy = nfm({ color: 0x2c3328, roughness: 0.9 });
    const rigs = [];
    function mkRig(key, opts) {
      const parent = opts.parent || world;
      const group = new THREE.Group();
      group.position.set(opts.x, 0, opts.z); group.rotation.y = opts.ry || 0;
      parent.add(group);
      const proxy = new THREE.Mesh(new THREE.CapsuleGeometry(0.2, opts.height - 0.4, 4, 8), matProxy);
      proxy.position.y = opts.height / 2; proxy.castShadow = !LOW; group.add(proxy);
      if (opts.noProxy) proxy.visible = false;
      const rig = { key, group, proxy, model: null, mixer: null, acts: null, cur: null, head: null,
                    ready: false, height: opts.height, idle: opts.idle || null, rate: opts.rate || 1, at: opts.at };
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
      loadGltf(key).then(gltf => {
        if (!alive) return;
        const g = cloneSkinned(gltf.scene);
        g.traverse(o => { if (o.isMesh) { o.castShadow = !LOW; o.receiveShadow = false; } });
        wideBounds(g, key);
        group.add(g); rig.model = g;
        /* sized and grounded from the BIND pose's bones BEFORE any take is
           applied (v3.8's law, and v9.1's: this rig's bind pose is a Mixamo
           T-pose standing up) — a kneeling take is a shorter box and would
           ask for a bigger man (the v5.05 law). The take goes on after. */
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
          g.scale.setScalar(opts.height / span); g.updateMatrixWorld(true);
          let lo2 = Infinity;
          g.traverse(o => { if (o.isBone) { o.getWorldPosition(v); lo2 = Math.min(lo2, v.y); } });
          g.position.y += -(lo2 - group.position.y) + (opts.lift || 0);
        }
        if (gltf.animations && gltf.animations.length) {
          rig.mixer = new THREE.AnimationMixer(g);
          rig.acts = {};
          for (const clip of gltf.animations) rig.acts[clip.name] = rig.mixer.clipAction(clip);
          if (opts.idle && rig.acts[opts.idle]) {
            rig.play(opts.idle, rig.rate, 0, false, opts.at);
            if (opts.phase) { rig.acts[opts.idle].time = rig.acts[opts.idle].getClip().duration * opts.phase; }
            rig.mixer.update(0.001);
          } else if (opts.idle) {
            /* v11.2: a take a rig does not carry is a bind pose with no error —
               `Idle_6` was asked of this file for two releases (LEARNINGS) */
            console.warn(`${key}: no take named ${opts.idle} — it has ${Object.keys(rig.acts).join(', ')}`);
          }
        }
        proxy.visible = false; rig.ready = true; redoShadows();
        if (opts.onReady) opts.onReady(rig);
      }).catch(err => { console.warn(key + ' failed to load', err); ctx.loadFail && ctx.loadFail(key, err); rig.ready = true; });
      rigs.push(rig);
      return rig;
    }
    /* `fbosling` is prepped to 1.74 m; the kneel take's own hips sit 0.53 m
       up (models doc §3), so a kneeling man is scaled off the MODEL's known
       standing height rather than measured on the kneel (a folded pose is a
       shorter box, which asks for a bigger man — the v5.05 law). */
    const KNEEL = 'Gesture_with_Hand_on_Gun';
    const cmd    = mkRig('fbosling', { x: CMD.x, z: CMD.z, ry: CMD.ry, height: 1.74, idle: KNEEL, rate: 0.5, lift: 0.015 });
    const buddy  = mkRig('fbosling', { x: BUDDY.x, z: BUDDY.z, ry: BUDDY.ry, height: 1.74, idle: 'Idle_3' });   // v11.2: Idle_3 — this rig's idle (Idle_6 is the no-sling file's, and a take a rig does not have is a bind pose with no error)
    const kneel1 = mkRig('fbosling', { x: KNEEL1.x, z: KNEEL1.z, ry: KNEEL1.ry, height: 1.74, idle: KNEEL, rate: 0.35, phase: 0.45, lift: 0.015 });
    const kneel2 = mkRig('fbosling', { x: KNEEL2.x, z: KNEEL2.z, ry: KNEEL2.ry, height: 1.74, idle: KNEEL, rate: 0.4, phase: 0.8, lift: 0.015 });
    /* one man flat on his back beside his scrape: the rig's own
       Sleep_Normally (v11.2 — Chad's nine-take file; the statue is gone).
       Measured on the take: he lies along the rig's z with the head at −z,
       face up, arms folded, and the body is held 0.85 m OVER the origin
       (Mixamo keeps a sleeper's hips at standing height), so `lift` brings
       the back down onto the litter; a body sinks a little into leaf litter
       (the v9.3 law), which is where the last few centimetres go. */
    const lie = mkRig('fbosling', { x: LIE1.x, z: LIE1.z, ry: LIE1.ry, height: 1.74, idle: 'Sleep_Normally', rate: 0.8, lift: -0.58 });   // measured: at −0.80 the field pack under his back went 0.255 m into the litter; he lies ON it

    /* THE RUNNER — the same figure as the man in the shower, the tenth man and
       the man at the flagpole (`fbosling`, so no new download), ghostified
       and hidden until scene A puts the torch on him. PALER than the v4.9
       treatment: under a torch in a black jungle a dark-grey ghost is a
       shadow, and this one has to be seen for half a second at the beam's
       edge before he is gone. */
    const GHOST_A = 0.6;
    function ghostify(rig, look) {
      const grey = look && look.grey !== undefined ? look.grey : 0.35;
      const glow = look && look.glow !== undefined ? look.glow : 0x0a0c14;
      rig.ghostBase = look && look.alpha !== undefined ? look.alpha : GHOST_A;
      const mats = [];
      rig.model.traverse(o => {
        if (!o.isMesh) return;
        o.castShadow = false;
        /* HIS OWN MATERIALS. This chapter parses each model ONCE and clones
           it (`cloneSkinned`), and SkeletonUtils.clone shares materials by
           reference — so treating the runner's in place made the five riders
           in the tonner and the whole section grey and, at the runner's
           resting alpha of 0, invisible (found by probe: every rider present,
           posed and in frame, opacity 0). e2c1 never met this because its
           mkRig parses afresh per rig. The clones share the maps, and the
           dispose sweep collects every material in the world, so they cost
           nothing to free. */
        o.material = Array.isArray(o.material) ? o.material.map(m => m.clone()) : o.material.clone();
        for (const m of (Array.isArray(o.material) ? o.material : [o.material])) {
          m.transparent = true; m.opacity = rig.ghostBase; m.color.setScalar(grey);
          m.emissive?.setHex(glow); m.depthWrite = false;
          mats.push(m);
        }
      });
      rig.ghostMats = mats;
      if (rig.ghostA !== undefined) ghostAlpha(rig, rig.ghostA);
    }
    function ghostAlpha(rig, k) {
      rig.ghostA = k;
      if (rig.ghostMats) for (const m of rig.ghostMats) m.opacity = (rig.ghostBase || GHOST_A) * k;
      const on = k > 0.002;
      if (rig.group.visible !== on) rig.group.visible = on;
    }
    const RUN_HOME = { x: 0, z: -30, ry: 0 };
    const runner = mkRig('fbosling', { x: RUN_HOME.x, z: RUN_HOME.z, ry: 0, height: 1.74, idle: 'Idle_3', noProxy: true,
      onReady: (r) => ghostify(r, { grey: 0.8, glow: 0x30405a, alpha: 0.6 }) });
    runner.ghostA = 0;
    runner.group.visible = false;
    /* the pressed-down patch of litter the beam lands on where he was, and
       which lifts back by itself (scene A) */
    /* v11.6 (Chad): THE TORCH ON THE GROUND. Play opens with his bare hands
       and the torch lying switched ON beside his scrape — a step in front
       and to the right, its beam grazing the litter toward the spoil heap —
       so the first thing the chapter asks is to pick it up. Chad's own
       flashlight model (the viewmodel's file, parsed once more here as a
       world prop), a spot from its lens, a warm glow at the head and an
       additive cone so the BEAM reads in the dark from any angle. Hidden
       the moment it is picked up; the film lights it at 44.2 where the hand
       torch used to click on. */
    const GT = { x: 0.30, z: -0.70, ry: -0.60 };
    const gtorch = new THREE.Group(); gtorch.position.set(GT.x, 0.018, GT.z); gtorch.rotation.y = GT.ry; world.add(gtorch);
    const gtLight = new THREE.SpotLight(0xfff1d6, 0, 9, 0.46, 0.55, 1.6);
    gtLight.position.set(0, 0.0, -0.10); gtLight.target.position.set(0, -0.03, -6); gtLight.castShadow = false;
    gtorch.add(gtLight); gtorch.add(gtLight.target);
    const gtGlow = new THREE.PointLight(0xffd9a0, 0, 0.9, 1.6); gtGlow.position.set(0, 0.03, -0.14); gtorch.add(gtGlow);
    /* the beam is a SHORT flare at the lens, not the whole throw: the first
       cone was four metres, double-sided and flat-alpha, and photographed
       as a grey slab standing in the dark (LEARNINGS) — the lit ground
       under the spot is what says "on". A cylinder's v runs 0 at its −y
       end, which after the quarter turn is the lens, to 1 at the far end;
       the gradient is bright there and gone by the far rim. */
    const gtBeamTex = mt((() => { const [c, cx] = cnv(64); const g = cx.createLinearGradient(0, 0, 0, 64);
      g.addColorStop(0, 'rgba(255,224,176,0)'); g.addColorStop(0.5, 'rgba(255,224,176,0.18)'); g.addColorStop(0.92, 'rgba(255,224,176,0.9)'); g.addColorStop(1, 'rgba(255,224,176,0.3)');
      cx.fillStyle = g; cx.fillRect(0, 0, 64, 64); return new THREE.CanvasTexture(c); })());
    const gtBeamMat = new THREE.MeshBasicMaterial({ map: gtBeamTex, color: 0xffffff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.FrontSide, fog: false });
    const gtBeam = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.012, 1.6, 18, 1, true), gtBeamMat);
    gtBeam.rotation.x = -Math.PI / 2; gtBeam.position.set(0, 0.0, -0.10 - 0.8); gtorch.add(gtBeam);
    let gtOn = false;
    function gtorchSet(on) { gtOn = !!on; gtLight.intensity = gtOn ? 9 : 0; gtGlow.intensity = gtOn ? 1.6 : 0; gtBeamMat.opacity = gtOn ? 0.22 : 0; }
    function gtorchShow(v) { gtorch.visible = !!v; if (!v) gtorchSet(false); }
    gtorchShow(false);
    loadGltf('flashlight').then(gltf => {
      if (!alive) return;
      const m = gltf.scene.clone();
      m.traverse(o => {
        if (!o.isMesh) return;
        o.castShadow = false; o.receiveShadow = false;
        o.material = (Array.isArray(o.material) ? o.material : [o.material]).map(mm => {
          const c = mm.clone();
          if (c.color) c.color.setScalar(2.2);                                   // the v11.3 lift: the body's sheet averages 33/255
          if (c.emissive && !c.emissiveMap) { c.emissive.setHex(0x1a1614); c.emissiveIntensity = 1; }
          return c;
        });
        if (o.material.length === 1) o.material = o.material[0];
      });
      gtorch.add(m);
    }).catch(err => { console.warn('ground torch failed', err); ctx.loadFail && ctx.loadFail('flashlight', err); });
    const patch = new THREE.Mesh(new THREE.CircleGeometry(0.22, 14), nfm({ map: litterTex, color: 0x3a3226, roughness: 1 }));
    patch.rotation.x = -Math.PI / 2; patch.position.y = 0.015; patch.visible = false; patch.userData.moves = true; world.add(patch);

    /* v11.4 (Chad: "that soldier should have a talking animation"): A MAN WHO
       SPEAKS MOVES. `talk(rig, secs)` puts a standing rig on the file's own
       talking take for the length of his line and hands him back to his
       idle, stated in dayClock through after() — and restore() and reset()
       put every talker back, because a take a beat set must be cleared by
       whatever ends that beat (the v9.6 law). The kneeling man cannot use it
       (the talking take is a STANDING one: he would rise to speak and drop
       again), so he TURNS HIS HEAD to the player instead — chapter 5's
       head-look, weight eased in on his line and out after it. */
    const TALK = 'Talk_with_Left_Hand_Raised';
    const talkers = new Set();
    function talk(rig, secs) {
      if (!rig.acts || !rig.acts[TALK]) return false;
      rig.play(TALK, 1, 0.25); talkers.add(rig);
      after(secs, () => talkEnd(rig));
      return true;
    }
    function talkEnd(rig) { if (!talkers.has(rig)) return; talkers.delete(rig); if (rig.idle && rig.acts) rig.play(rig.idle, rig.rate, 0.3); }
    function talkReset() { for (const r of [...talkers]) talkEnd(r); }
    const _lookP = new THREE.Vector3(), _lookH = new THREE.Vector3();
    const kneelLook = { x: 0, y: 0, w: 0, want: 0, saved: new THREE.Quaternion(), hasSaved: false };
    /* v11.4 fix (Chad: "spins his head when talking"): the look is laid on
       AFTER the mixer, and three.js's PropertyMixer only writes a bone whose
       interpolated value differs from the ORIGINAL it saved — so on a frame
       where the kneel take's head sits still, the mixer leaves our turned
       bone alone and the next frame's addition stacks on it. Chapter 5's
       clips move the head every frame and never met this. The bone is now
       put back to what the mixer last wrote BEFORE the mixer runs again
       (`headUndo`), so every frame's offset is added to the clip's pose and
       never to last frame's. */
    function headUndo(rig, st) { if (st.hasSaved && rig.head) rig.head.quaternion.copy(st.saved); }
    function headLook(rig, st, dt) {
      const head = rig.head; if (!head) return;
      st.saved.copy(head.quaternion); st.hasSaved = true;
      const w = st.w;
      camera.getWorldPosition(_lookP); head.getWorldPosition(_lookH);
      const dx = _lookP.x - _lookH.x, dz = _lookP.z - _lookH.z, flat = Math.hypot(dx, dz);
      let dy = Math.atan2(dx, dz) - rig.group.rotation.y; dy = Math.atan2(Math.sin(dy), Math.cos(dy));
      const YAW = 0.8, PIT = 0.34, EYE_UP = 0.11, DOWN_BIAS = 0.10;
      const wy = Math.abs(dy) > YAW + 0.9 ? 0 : Math.max(-YAW, Math.min(YAW, dy));
      const wx = flat < 0.05 ? 0 : Math.max(-PIT, Math.min(PIT, Math.atan2(_lookP.y - (_lookH.y + EYE_UP), flat) - DOWN_BIAS));
      const k = Math.min(1, dt * 3.5);
      st.y += (wy * w - st.y) * k; st.x += (wx * w - st.x) * k;
      head.rotation.y += st.y;
      head.rotation.x += (-st.x - head.rotation.x) * 0.88 * w;
    }

    /* v11.4 (Chad: "every 10 seconds in the playable scene, the ghost soldier
       should be running around the jungle in the very far background, fade
       in and out while running, each run about 2-3 seconds"): THE FAR RUNS.
       The same runner scenes A and D use, on his own deterministic stream,
       crossing the trees 15–22 m out on a tangent — never through the ring —
       for 2–3 s at the run take's own speed, in over the first 15 % and out
       over the last 20 %, a faint leaf-litter run panned to his side. Stated
       in dayClock, so a run never advances under a panel: one caught by the
       decision opening is ENDED on that frame rather than left hanging at
       half alpha behind the options, and restore()/reset() end one too. */
    let farAt = 0, farRun = null, farN = 0, farSeed = 29;
    const farRand = () => { farSeed = (farSeed * 1664525 + 1013904223) >>> 0; return farSeed / 4294967296; };
    const FAR_GAP = [7.5, 9.5], FAR_R = [15, 22], FAR_SPD = 2.6;
    /* at twenty metres the torch's cone gives him nothing and the close-up
       glow (0x30405a, right for a man crossing the beam in scene A) is a
       shadow between trunks — photographed from the ring, he was not there.
       The far runs wear a paler self-light and hand the scenes' one back. */
    const FAR_GLOW = 0xa4b4d8, NEAR_GLOW = 0x30405a;   // photographed at 0x8a9cc4: a figure, but a faint one
    const runnerGlow = (hex) => { if (runner.ghostMats) for (const m of runner.ghostMats) m.emissive?.setHex(hex); };
    function farEnd() {
      farRun = null; ghostAlpha(runner, 0); runnerGlow(NEAR_GLOW);
      if (runner.idle && runner.acts) runner.play(runner.idle, 1, 0);
      runner.group.position.set(RUN_HOME.x, 0, RUN_HOME.z); runner.group.rotation.y = 0;
    }
    function farTick() {
      /* v12.5: and neither does anything RUN out there while he is saying so.
         The far pass carries `ghostrunleaf` — vegetation moving, by name. */
      if (phase === 'pressure' || phase === 'decide') { if (farRun) farEnd(); farAt = 0; return; }
      if (!farAt) { farAt = dayClock.t + 4 + farRand() * 4; return; }
      if (!farRun) {
        if (dayClock.t < farAt || !runner.ready || !runner.acts) return;
        const a = farRand() * Math.PI * 2, r = FAR_R[0] + farRand() * (FAR_R[1] - FAR_R[0]);
        const cx = Math.sin(a) * r, cz = Math.cos(a) * r;
        const dur = 2.0 + farRand() * 1.0, L = FAR_SPD * dur, s = farRand() < 0.5 ? -1 : 1;
        const dx = Math.cos(a) * s, dz = -Math.sin(a) * s;          // the tangent, either way round
        farRun = { t0: dayClock.t, dur, ax: cx - dx * L / 2, az: cz - dz * L / 2, bx: cx + dx * L / 2, bz: cz + dz * L / 2 };
        runner.group.position.set(farRun.ax, 0, farRun.az); runner.group.rotation.y = Math.atan2(dx, dz);
        ghostAlpha(runner, 0.01); runnerGlow(FAR_GLOW); runner.play('Running', 1, 0.1);
        if (worldSfx) worldSfx('ghostrunleaf', 0.12, 1, Math.sin(a - yaw.rotation.y) * 0.8);
        farN++;
        return;
      }
      const k = (dayClock.t - farRun.t0) / farRun.dur;
      if (k >= 1) { farEnd(); farAt = dayClock.t + FAR_GAP[0] + farRand() * (FAR_GAP[1] - FAR_GAP[0]); return; }
      runner.group.position.x = farRun.ax + (farRun.bx - farRun.ax) * k;
      runner.group.position.z = farRun.az + (farRun.bz - farRun.az) * k;
      ghostAlpha(runner, 1.35 * Math.max(0.01, Math.min(1, k / 0.15, (1 - k) / 0.2)));   // 1.35 x the 0.6 base: 0.81 at the crest, still a ghost
    }

    /* ---------------------------------------------- THE ROAD POCKET (film)
       Chad's forest with its road (v11.2), 150 m off and inside its own
       painted dusk (chapter 1's memory-pocket recipe: a bubble whose back
       wall is a depth surface, so the harbour 150 m away never shows through
       it). Chad's Kamaz DRIVES the road with the section dozing on its
       benches and the player on the front of the left one, looking out of
       the open back; it stops two thirds of the way along, the file forms
       behind it, and the walk in is the road ahead. Every material is
       fog-free. Why the forest is the FILM's and not the harbour's:
       docs/V11.0-E2C3-PLAN.md §18. */
    const pocket = new THREE.Group();
    pocket.position.set(PK.x, 0, PK.z);
    pocket.visible = false;
    world.add(pocket);
    const pbox = (w, h, d, x, y, z, mat) => box(w, h, d, x, y, z, mat, pocket);
    const skyMat = new THREE.MeshBasicMaterial({ map: duskSky, side: THREE.BackSide, fog: false });
    const sky = new THREE.Mesh(new THREE.SphereGeometry(130, 32, 18), skyMat); sky.position.y = 0; pocket.add(sky);
    const pGround = new THREE.Mesh(new THREE.PlaneGeometry(320, 320), nf({ map: litterTex, color: 0x5a4a34, roughness: 1 }));
    pGround.rotation.x = -Math.PI / 2; pGround.position.y = -2.6; pocket.add(pGround);   // under the forest's deepest dip (−0.31 × FOREST.S)
    /* THE FOREST: the ground with the road painted into it and 1,480 tree
       cards, joined to three meshes offline (tools/prepforest.mjs), at
       FOREST.S, every material fog-free, the leaf cards a MASK cutout
       (v6.16's law). It lands async and `ready()` waits for it: a film that
       opens on a bare plane and pops a forest in is worse than a longer
       black. */
    const forest = new THREE.Group(); forest.scale.setScalar(FOREST.S); pocket.add(forest);
    let forestReady = false;
    loadGltf('forest').then(gltf => {
      if (!alive) return;
      const g = gltf.scene;
      g.traverse(o => {
        if (!o.isMesh || !o.material) return;
        const m = o.material;
        m.fog = false; m.roughness = 0.95; m.metalness = 0;
        if (m.alphaTest > 0 || m.transparent) { m.transparent = false; m.alphaTest = 0.45; m.side = THREE.DoubleSide; m.depthWrite = true; }
        if (m.map) m.map.anisotropy = 4;
        m.needsUpdate = true;
        o.castShadow = false; o.receiveShadow = false; o.frustumCulled = true;
      });
      forest.add(g); forestReady = true;
    }).catch(err => { console.warn('forest failed', err); ctx.loadFail && ctx.loadFail('forest', err); forestReady = true; });

    /* THE ROAD, AS NUMBERS: `roadAt(s, off)` is the point s metres along the
       traced centreline (off metres to the RIGHT of travel) in POCKET
       coordinates, with the terrain's own height there and the heading a
       vehicle driving it holds (0 = toward −z, the truck model's forward).
       The heading is read over a 5 m window rather than off one 2.8 m
       segment, so a polyline's corners are a steering wheel turning and not
       a truck snapping its nose. */
    const roadLen = (() => { let L = 0; for (let i = 1; i < ROAD.length; i++) L += Math.hypot(ROAD[i][0] - ROAD[i - 1][0], ROAD[i][2] - ROAD[i - 1][2]); return L * FOREST.S; })();
    function roadPos(s) {
      const S = FOREST.S; let acc = 0; s = Math.max(0, Math.min(roadLen, s));
      for (let i = 1; i < ROAD.length; i++) {
        const a = ROAD[i - 1], b = ROAD[i]; const seg = Math.hypot(b[0] - a[0], b[2] - a[2]) * S;
        if (acc + seg >= s || i === ROAD.length - 1) {
          const k = Math.max(0, Math.min(1, (s - acc) / seg));
          return { x: (a[0] + (b[0] - a[0]) * k) * S, y: (a[1] + (b[1] - a[1]) * k) * S, z: (a[2] + (b[2] - a[2]) * k) * S };
        }
        acc += seg;
      }
    }
    function roadAt(s, off = 0) {
      const p = roadPos(s), q0 = roadPos(s - 2.5), q1 = roadPos(s + 2.5);
      const dx = q1.x - q0.x, dz = q1.z - q0.z, dh = Math.hypot(dx, dz) || 1;
      return { x: p.x - dz / dh * off, y: p.y, z: p.z + dx / dh * off,
               ry: Math.atan2(-dx, -dz), pitch: Math.atan2(q1.y - q0.y, dh) };
    }

    // THE TONNER: Chad's Kamaz 5330 (assets/kamaz.glb, tools/preptruck.mjs) — cab at −z, open rear at +z, wheels on y = 0
    const TB = { w: 2.78, len: 4.56, floor: 1.48, seat: 1.93, h: 1.62 };   // the bed, MEASURED off the model: inner width and length, the floor, the bench seats, the headroom
    const truck = new THREE.Group(); truck.rotation.order = 'YXZ'; pocket.add(truck);
    let truckReady = false, truckBaseY = 0;
    loadGltf('kamaz').then(gltf => {
      if (!alive) return;
      const g = gltf.scene;
      g.traverse(o => { if (!o.isMesh || !o.material) return; o.material.fog = false; o.material.needsUpdate = true; if (o.material.map) o.material.map.anisotropy = 4; o.castShadow = false; o.receiveShadow = false; });
      truck.add(g); truckReady = true;
    }).catch(err => { console.warn('kamaz failed', err); ctx.loadFail && ctx.loadFail('kamaz', err); truckReady = true; });
    const tailPivot = new THREE.Group(); tailPivot.position.set(0, TB.floor, TB.len / 2); truck.add(tailPivot);   // the model's rear is open; the name the film and restore() know, now empty
    /* THE RIDERS: seven on the benches, dozing on the rig's own sitting take
       (Sit_and_Doze_Off — sampled seventeen times across its 17 s, the head
       stays 0.62 m over the hips throughout: an upright doze with no fold,
       v8.0's law). Its hips sit 0.54 m over the rig's origin and the bench
       0.45 over the floor, so a man whose origin is ON THE FLOOR sits on the
       bench; his hips land 0.05 m ahead of his origin, so x ±1.10 puts them
       over the bench centres at ±1.05, facing the aisle. The player is the
       seventh man, on the front of the left bench, and nobody sits within
       two metres of him on it — found by render: a man one seat along on
       the same bench is a helmet filling the right of the frame. */
    const riders = [];
    for (const [rx, rz] of [[-1.10, 0.35], [-1.10, 1.25], [1.10, -1.45], [1.10, -0.55], [1.10, 0.35], [1.10, 1.25]]) {
      const r = mkRig('fbosling', { parent: truck, x: rx, z: rz, ry: rx < 0 ? Math.PI / 2 : -Math.PI / 2, height: 1.74,
                                    idle: 'Sit_and_Doze_Off', phase: hash(riders.length, 61), rate: 0.9 + hash(riders.length, 62) * 0.2 });
      r.group.position.y = TB.floor;
      riders.push(r);
    }
    const CAM_SEAT = { x: -1.05, y: TB.floor + 1.12, z: -1.55 };   // a seated eye: the bench + 0.67
    /* THE DRIVE: from just inside the forest's edge to the brakes, 0.64 of
       the road, over the film's 0.3–17.0 (the film eases it: fast, then
       slowing to the stop). The camera RIDES: it is computed from the truck's
       own matrix every frame, so a seek lands on the same frame. */
    const DRIVE = { s0: 3.0, s1: roadLen * 0.64 };
    function driveTo(k) {
      const p = roadAt(DRIVE.s0 + (DRIVE.s1 - DRIVE.s0) * k);
      truck.position.set(p.x, p.y, p.z); truckBaseY = p.y;
      truck.rotation.x = p.pitch; truck.rotation.y = p.ry;
      truck.updateWorldMatrix(true, false);
    }
    const _seat = new THREE.Vector3();
    function rideCam(t) {
      _seat.set(CAM_SEAT.x, CAM_SEAT.y, CAM_SEAT.z); truck.localToWorld(_seat);
      yaw.position.copy(_seat);
      yaw.rotation.y = truck.rotation.y + Math.PI + 0.30 + Math.sin(t * 0.7) * 0.03;   // out of the back, turned to the aisle and the opening
      pitch.rotation.x = -0.04 - truck.rotation.x + Math.sin(t * 1.3) * 0.01;
    }
    /* THE DROP-OFF, all of it deterministic from the stop: the file forms
       on the road behind the tail-gate facing the truck, the commander
       kneels off the right verge facing back down the file, the camera
       stands off the left verge BEHIND the last man and pans up the line
       to the truck. Heights are the terrain's, off `roadAt`. */
    const DROP = { cam0: roadAt(DRIVE.s1 - 13.5, -3.0), cam1: roadAt(DRIVE.s1 - 12.0, -2.6), look: roadAt(DRIVE.s1 - 5.0) };   // the whole file AHEAD of the lens (found by render: level with it, the men read as facing away from the truck)
    const cmdFilm = (() => {
      const p = roadAt(DRIVE.s1 - 3.4, 1.6);
      /* a Mixamo rig at ry 0 faces +z (v10.3) and `ry` off roadAt is the
         truck's, whose forward is −z: ALONG the road is ry + π, back down it
         is ry. He faces back down the file, turned a little to the road. */
      const r = mkRig('fbosling', { parent: pocket, x: p.x, z: p.z, ry: p.ry + 0.5, height: 1.74, idle: KNEEL, rate: 0.9, lift: 0.015 });
      r.group.position.y = p.y; return r;
    })();
    const file = [];
    for (let i = 0; i < 5; i++) {
      const p = roadAt(DRIVE.s1 - 4.0 - 1.25 * i, i % 2 ? 0.3 : -0.3);
      const r = mkRig('fbosling', { parent: pocket, x: p.x, z: p.z, ry: p.ry + Math.PI, height: 1.74, idle: 'Idle_3', phase: hash(i, 81) });   // facing the truck
      r.group.position.y = p.y;
      r.home = { x: p.x, y: p.y, z: p.z, ry: p.ry + Math.PI };
      file.push(r);
    }
    function fileHome() { for (const r of file) if (r.home) { r.group.position.set(r.home.x, r.home.y, r.home.z); r.group.rotation.y = r.home.ry; } }
    /* THE WALK IN: the road AHEAD of the truck (the cut having put the
       section past it), 2.2 m between men and the nearest 2.5 m ahead of
       the lens, the lead man ending 3 m short of the road's end; the camera
       at the file's tail, on the terrain, looking up the road. Backs to the
       camera: ry + π (found by render — the first pass had five men
       moonwalking toward the lens). */
    const WALK = 14, WALK_S0 = DRIVE.s1 + 7.5;
    function walkIn(k, t) {
      file.forEach((r, j) => { const p = roadAt(WALK_S0 + 2.5 + 2.2 * (4 - j) + WALK * k, j % 2 ? 0.25 : -0.25); r.group.position.set(p.x, p.y, p.z); r.group.rotation.y = p.ry + Math.PI; });
      const c = roadAt(WALK_S0 + WALK * k);
      yaw.position.set(PK.x + c.x, c.y + 1.60 + Math.sin(t * 6.3) * 0.02, PK.z + c.z);
      yaw.rotation.y = c.ry + Math.sin(t * 0.9) * 0.03;
    }
    let roadK = 0;                                     // 1 while the truck is "moving" (the road and the walls scroll)
    let skyK = 1;                                      // the pocket's painted sky, darkened over the walk in

    /* ---------------------------------------------------------- the pile
       The ground at his feet IS the pile: the decision opens by itself at
       the end of the pressure beat, and a press on the ground reopens it. */
    const PILE_POS = new THREE.Vector3(HIS.x, 0, HIS.z);
    const INTERACT_R = 3.0;
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
    function pileScreen() { syncCamera(); return _ndc.set(PILE_POS.x, 0.2, PILE_POS.z).project(camera); }
    function pileInView() { return phase === 'decide'; }
    function pointerHitsPile(cx, cy) { return phase === 'decide' && pileDist() < INTERACT_R; }
    function interactPile() {
      if (getState() !== 'play' || phase !== 'decide' || pileDist() >= INTERACT_R) return false;
      startDecision();
      return true;
    }

    /* ------------------------------------------------------------ the night
       Three phases: `look` (the six spots, in the phase string as
       `look:1,3,5`), `pressure` (the beat, re-run whole on a resume) and
       `decide`. The chapter's clock runs on wall time (v7.1's law). */
    let phase = 'look';
    let booted = false;
    let gear = -1;                                     // v11.6: 0 pick it up · 1 equip it · 2 switch it on, derived from the bag each frame
    const TOUCH = matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
    const dayClock = { t: 0 };
    let lastWall = 0;
    const todo = [];
    function after(secs, fn) { todo.push({ at: dayClock.t + secs, fn }); todo.sort((a, b) => a.at - b.at); }
    function runTodo() { while (todo.length && todo[0].at <= dayClock.t) todo.shift().fn(); }
    function dropTodo() { todo.length = 0; }
    const seen = new Set();
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
    if (warmSounds) warmSounds(['torchclick', 'n3spot1', 'n3spot2', 'n3spot3', 'b3here', 'n3spot5', 'n3spot6',
                                'stingpress', 'ghostlaugh', 'legpress', 'n3press', 'n3look', 'n3still',
                                'ghostrunleaf', 'leaflift', 'leafdraw', 'n3A1', 'n3A2', 'n3B1', 'n3B2',
                                'n3C1', 'n3C2', 'b3C1', 'b3C2', 'b3C3', 'n3D1', 'n3D2', 's3hiss', 'b3D',
                                'bushrustle1', 'bushrustle2', 'bushrustle3', 'nightcall1', 'nightcall2', 'k3bush', 'torchpick']);

    let jungleK = 1;                                   // the bed, ducked under "nothing around..."
    function mixBeds() {
      for (const b of DATA.ambience.beds) {
        if (b[0] === 'junglenight') b[1] = 0.34 * jungleK;
        if (b[0] === 'junglelife') b[1] = 0.30 * jungleK;
        if (b[0] === 'tonner') b[1] = 0;
      }
    }
    function setPhase(p) {
      phase = p;
      if (kit) kit.setPhase(p === 'look' ? 'look:' + [...seen].join(',') + (kneelSaid ? ',k' : '') : p);   // v11.4: `k` — the kneeling man has spoken
    }
    function objLook() {
      if (!kit) return;
      kit.objective(DATA.words.objLook.replace('{n}', String(seen.size)));
      kit.waypoint(null);
    }
    /* v11.6 (Chad): THE TORCH IS EARNED. Play opens on his bare hands with
       the torch lit on the ground: pick it up (E, or a tap), then open the
       bag and equip it — the bag button pulses until he does — then switch
       it on (F, or the torch icon, which only appears once it is in his
       hand). Each is an order the HUD completes; the third completion is
       the night's own "Look around". The step is DERIVED from the bag and
       the switch every frame rather than stored, so a Continue lands on the
       right order whatever was saved, and unequipping the torch later
       simply asks again (without a COMPLETE for going backwards — a HUD
       that congratulates a step undone is lying, v8.7). */
    function beginGear() {
      setPhase('gear'); gear = -1;
      if (kit && kit.take) kit.take('torch');          // a replay finds it on the ground again
      if (kit && kit.torchOn) kit.torchOn(false);
      gearStep(true);
    }
    function gearStep(first) {
      if (phase !== 'gear' || !kit) return;
      const has = kit.has ? kit.has('torch') : true, eq = kit.equipped ? kit.equipped('torch') : true;
      const want = !has ? 0 : !eq ? 1 : !torchOn() ? 2 : 3;
      if (want === 3) { gtorchShow(false); beginLook(); return; }
      if (want === gear) return;
      const back = want < gear;                        // undone, not completed
      gear = want;
      const opts = (first || back) ? { complete: false } : undefined;
      if (want === 0) { gtorchShow(true); gtorchSet(true); kit.objective(DATA.words.objPick, opts); }
      else if (want === 1) { gtorchShow(false); kit.objective(DATA.words.objEquip, opts); if (kit.urge) kit.urge('torch'); }
      else { gtorchShow(false); kit.objective(TOUCH ? DATA.words.objSwitchTouch : DATA.words.objSwitch, opts); }
      kit.waypoint(null);
    }
    function pickTorch() {
      if (phase !== 'gear' || gear !== 0 || !kit || !kit.give) return false;
      if (!kit.give('torch')) return false;
      gtorchShow(false);
      if (worldSfx) worldSfx('torchpick', 0.9);
      gearStep();
      return true;
    }
    function beginLook() { setPhase('look'); objLook(); }
    /* THE SIX SPOTS. Seeing one says its line, counts it (1/6 · 2/6 … each
       an OBJECTIVE COMPLETE beat, v8.7) and, on the sixth, starts the
       pressure. Five is the chemlights across the ring and six is the ground
       at his own feet on the ring's side — both unlocked in that order, so
       the last thing the objective makes him do is stand with his BACK to the
       jungle, looking down. The pressure comes from behind. */
    const SPOT_LINE = { 1: 'n3spot1', 2: 'n3spot2', 3: 'n3spot3', 4: 'b3here', 5: 'n3spot5', 6: 'n3spot6' };
    function seeSpot(n) {
      if (phase !== 'look' || seen.has(n)) return false;
      const ok = sayLine(SPOT_LINE[n], 1, n === 4 ? () => talk(buddy, (SECS.b3here || 2.5) + 0.2) : undefined);   // v11.4: he talks through it
      if (!ok) return false;
      seen.add(n);
      setPhase('look');
      objLook();
      if (seen.size >= 6) after((SECS[SPOT_LINE[6]] || 4) + 1.5, () => { if (phase === 'look') beginPressure(); });
      return true;
    }
    /* v11.4 (Chad): THE KNEELING MAN under the torch says his one line —
       "There's someone running around in the bushes, but the next section is
       at least a kilometer away..." — once, off the objective's count, head
       turned to the player for the length of it. He rides the phase string
       as `k` so a resume does not make him say it twice. */
    let kneelSaid = false;
    function seeKneel() {
      if (phase !== 'look' || kneelSaid) return false;
      const ok = sayLine('k3bush', 1, () => { kneelLook.want = 1; after((SECS.k3bush || 4) + 0.4, () => { kneelLook.want = 0; }); });
      if (!ok) return false;
      kneelSaid = true; setPhase('look');
      return true;
    }
    /* THE PRESSURE. A shake the chapter performs on the lens (roll and a
       kick down on the pitch, decaying over 0.45 s), the sting, the laugh
       from behind, the buzz, then his line — then the objective turns to the
       ground and PRESENCE drains until the beam is on it. */
    /* v11.1 (Chad): "the shake is way too fast and ends too fast ... more
       like a camera stumble because the player almost stumbled". 0.45 s of
       43 Hz jitter is a buzz; this is a body catching itself — the head
       drops, the world rolls once and lurches sideways, and it all settles
       over SHAKE_SECS. Applied as DELTAS on yaw and pitch so the mouse still
       owns the look underneath it. The player is ROOTED, hit for -10/-10 on
       the frame, and BLEEDS 3 sanity a second under the red frame until he
       answers (kit.root / kit.hurt, v11.1). */
    const SHAKE_SECS = 1.9;
    let shakeT = 0, shakeBase = 0, pressT = 0, yawOff = 0, pitchOff = 0;
    let downT = 0, looked = false;
    function beginPressure(resume) {
      setPhase('pressure');
      if (kit) { kit.objective(null, { complete: false }); kit.waypoint(null); }
      shakeT = SHAKE_SECS; shakeBase = pitch.rotation.x; pressT = 0; yawOff = 0; pitchOff = 0;
      if (worldSfx) worldSfx('stingpress', 0.95);
      if (kit) {
        kit.haptic([120, 60, 180, 80, 240]);
        kit.root(true);
        if (!resume) { kit.award('sanity', -10); kit.award('awareness', -10); }   // once; a resume has already paid
        kit.hurt({ perSec: 1.5 });   // v11.3: halved (Chad: "the sanity damage per second is too fast")
        if (kit.flash) kit.flash({ color: 'rgba(150,20,16,0.55)', secs: 0.7 });
      }
      after(0.25, () => { if (worldSfx) { worldSfx('legpress', 0.7); worldSfx('ghostlaugh', 0.5, 1, 0.65); } });
      after(0.55, () => sayLine('n3press'));
      after(0.55 + (SECS.n3press || 5) + 0.3, () => {
        if (phase !== 'pressure') return;
        if (kit) {
          kit.objective(DATA.words.objDown);
          const fx = -Math.sin(yaw.rotation.y), fz = -Math.cos(yaw.rotation.y);
          kit.waypoint({ x: yaw.position.x + fx * 0.7, y: 0.12, z: yaw.position.z + fz * 0.7 });
          kit.presence(0.3);
        }
        downT = 0; looked = false;
      });
    }
    function onLooked() {
      looked = true;
      if (kit) { kit.presence(0); kit.waypoint(null); }
      jungleK = 0.2; mixBeds();
      queueLine('n3look');
      queueGap(0.6);
      queueLine('n3still');
      queueGap(0.3);
      queueFn(() => {
        if (phase !== 'pressure') return;
        setPhase('decide');
        if (kit) kit.objective(null);
        after(0.4, () => { if (getState() === 'play' && phase === 'decide') startDecision(); });
      });
    }
    function applyPhase(p) {
      seen.clear();
      if (p == null || p === '') { beginGear(); return; }            // v11.6: a fresh night begins with the torch on the ground
      if (p === 'gear') { setPhase('gear'); gear = -1; gearStep(true); return; }   // a Continue: the bag says which order stands
      /* past the pickup — this run, or a save from before the torch was an
         item — he has it, it is in his hand, and it is on */
      gtorchShow(false);
      if (kit && kit.equip) kit.equip('torch');
      if (kit && kit.torchOn) kit.torchOn(true);
      if (typeof p === 'string' && p.startsWith('look:')) {
        for (const s of p.slice(5).split(',')) { if (s === 'k') { kneelSaid = true; continue; } const n = parseInt(s, 10); if (n >= 1 && n <= 6) seen.add(n); }
      }
      if (p === 'decide') {
        setPhase('decide');
        if (kit) { kit.objective(null); kit.waypoint(null); kit.presence(0); }
        return;
      }
      if (p === 'pressure' || seen.size >= 6) {
        for (let n = 1; n <= 6; n++) seen.add(n);
        beginPressure(true);
        return;
      }
      setPhase('look'); objLook();
    }

    /* ------------------------------------------------------------ hotspots
       Torch spots: `dwell` 0.8 s inside `aim` of the reticle — the eighteenth
       seam. Enabled only while the torch is on: no beam, no looking, and the
       marks vanish with it (the objective says why).
       v12.5: the cones were a QUARTER of the beam they are aimed with — the
       torch's own half-angle is 0.40 rad, so a tree could be lit square in
       the middle of the light and still count for nothing, which is what "the
       tree cannot be clicked" felt like from the player's side. Each is about
       half the beam now, so a thing plainly IN the light counts. Measured
       from the scrape, the closest two of the seven anchors are 47° apart
       (the three trees; the people and the ground are further), against the
       23° two 0.20 cones would need to touch — no look can answer two. */
    const torchOn = () => !kit || !kit.torchIsOn || kit.torchIsOn();
    const spotOn = (n, needs) => () => phase === 'look' && !seen.has(n) && torchOn() && (needs === undefined || seen.has(needs));
    const hotspots = [
      /* v11.6: the torch on the ground — a PRESS, inside 1.6 m from any
         view (a thing at your feet is under the lens, the `feet` spot's
         reason); the hotspot mark stands over it until it is taken */
      { id: 'torch', pos: { x: GT.x, y: 0.25, z: GT.z }, radius: 1.6, prompt: TOUCH ? DATA.words.hotTorchTouch : DATA.words.hotTorch, markY: 0.22, anyView: true,
        enabled: () => phase === 'gear' && gear === 0 && gtorch.visible, onInteract() { return pickTorch(); } },
      { id: 'fig', pos: { x: FIG.x, y: 1.4, z: FIG.z }, radius: 12, dwell: 0.8, aim: 0.20, prompt: DATA.words.hotSpot, markY: 0.9,
        enabled: spotOn(1), onInteract() { return seeSpot(1); } },
      { id: 'log', pos: { x: LOG.x, y: 0.5, z: LOG.z }, radius: 12, dwell: 0.8, aim: 0.20, prompt: DATA.words.hotSpot,
        enabled: spotOn(2), onInteract() { return seeSpot(2); } },
      { id: 'gap', pos: { x: GAP.x, y: 1.5, z: GAP.z }, radius: 13, dwell: 0.8, aim: 0.20, prompt: DATA.words.hotSpot,
        enabled: spotOn(3), onInteract() { return seeSpot(3); } },
      { id: 'buddy', pos: { x: BUDDY.x, y: 1.15, z: BUDDY.z }, radius: 9, dwell: 0.8, aim: 0.22, prompt: DATA.words.hotBuddy,
        enabled: spotOn(4), onInteract() { return seeSpot(4); } },
      { id: 'chem', pos: { x: CMD.x + 0.2, y: 0.6, z: CMD.z + 0.5 }, radius: 13, dwell: 0.8, aim: 0.20, prompt: DATA.words.hotSpot, markY: 0.7,
        enabled: spotOn(5, 4), onInteract() { return seeSpot(5); } },
      /* v11.4: the kneeling man to his right, once, off the count — the anchor
         at a kneeling man's head (the KNEEL take's hips sit 0.53 m up) */
      { id: 'kneel', pos: { x: KNEEL1.x, y: 1.0, z: KNEEL1.z }, radius: 9, dwell: 0.8, aim: 0.22, prompt: DATA.words.hotBuddy, markY: 0.75,
        enabled: () => phase === 'look' && !kneelSaid && torchOn(), onInteract() { return seeKneel(); } },
      { id: 'feet', pos: { x: HIS.x, y: 0.12, z: HIS.z + 0.95 }, radius: 2.6, dwell: 0.8, aim: 0.28, prompt: DATA.words.hotFeet, markY: 0.35, anyView: true,
        enabled: spotOn(6, 5), onInteract() { return seeSpot(6); } }
    ];

    /* v11.3 (Chad: "shuffling noises in the bushes"): THE BUSHES. Something
       moves in the undergrowth every 12–28 s and a far animal calls every
       24–52 s, from the chapter's own deterministic stream (v9.2's
       platoonmarch shape), PANNED to a side so the ear turns before the
       torch does — which is the chapter. Stated in `dayClock` and cleared by
       reset() (the v8.1 law); never during the pressure's own beat, whose
       silence is the point ("not even the sound of vegetation moving"). */
    let bushAt = 0, callAt = 0, bushSeed = 13, bushN = 0, callN = 0;
    const bushRand = () => { bushSeed = (bushSeed * 1664525 + 1013904223) >>> 0; return bushSeed / 4294967296; };
    const BUSH_GAP = [12, 28], CALL_GAP = [24, 52];
    function bushTick() {
      if (!worldSfx) return;
      /* v12.5: THIS GUARD NAMED TWO PHASES THAT DO NOT EXIST. The chapter's
         phases are gear, look, pressure and decide; `press` and `down` were
         never any of them, so since v11.3 the bushes have rustled and the
         animals called straight through the beat whose whole point is that
         they do not — under "Nothing around... no one... no footsteps... not
         even the sound of vegetation moving around me." */
      if (phase === 'pressure' || phase === 'decide') { bushAt = 0; callAt = 0; return; }
      if (!bushAt) bushAt = dayClock.t + 6 + bushRand() * 10;
      if (!callAt) callAt = dayClock.t + 14 + bushRand() * 16;
      if (dayClock.t >= bushAt) {
        const name = 'bushrustle' + (1 + Math.floor(bushRand() * 3)), pan = (bushRand() < 0.5 ? -1 : 1) * (0.45 + bushRand() * 0.45);
        if (worldSfx(name, 0.32 + bushRand() * 0.30, 0.92 + bushRand() * 0.16, pan)) { bushN++; bushAt = dayClock.t + BUSH_GAP[0] + bushRand() * (BUSH_GAP[1] - BUSH_GAP[0]); }
        else bushAt = dayClock.t + 1.5;
      }
      if (dayClock.t >= callAt) {
        const name = 'nightcall' + (1 + Math.floor(bushRand() * 2)), pan = (bushRand() - 0.5) * 1.4;
        if (worldSfx(name, 0.18 + bushRand() * 0.14, 0.9 + bushRand() * 0.2, pan)) { callN++; callAt = dayClock.t + CALL_GAP[0] + bushRand() * (CALL_GAP[1] - CALL_GAP[0]); }
        else callAt = dayClock.t + 1.5;
      }
    }

    /* ---------------------------------------------------------- per frame */
    function updateNotes(dt, t) {
      headUndo(kneel1, kneelLook);   // v11.4: the clip's head back before the mixer writes (or does not)
      for (const r of rigs) if (r.mixer && r.group.visible && (r.group.parent !== truck && r.group.parent !== pocket || pocket.visible)) r.mixer.update(dt);
      /* v11.4: the kneeling man's head, laid on AFTER his mixer wrote the pose */
      kneelLook.w += (kneelLook.want - kneelLook.w) * Math.min(1, dt * 2.2);
      if (kneelLook.w > 0.002 || Math.abs(kneelLook.y) > 0.002 || Math.abs(kneelLook.x) > 0.002) headLook(kneel1, kneelLook, dt); else kneelLook.hasSaved = false;
      if (farRun && getState() !== 'play') farEnd();   // v11.4: never a ghost frozen at half alpha behind a panel
      if (pocket.visible) {
        truck.rotation.z = Math.sin(t * 3.1) * 0.006 * roadK; truck.position.y = truckBaseY + Math.sin(t * 5.3) * 0.012 * roadK;
        skyMat.color.setScalar(skyK);
      }
      if (getState() !== 'play') { lastWall = 0; return; }
      const now = performance.now() / 1000;
      if (lastWall) dayClock.t += Math.min(0.5, now - lastWall);
      lastWall = now;
      if (!booted) { booted = true; applyPhase(kit ? kit.getPhase() : null); }
      bushTick(); farTick();
      if (phase === 'gear') gearStep();   // v11.6: the bag and the switch decide the order on screen
      // the shake: roll and a kick down, decaying — the chapter owns the lens for half a second
      if (shakeT > 0) {
        shakeT = Math.max(0, shakeT - dt);
        pressT += dt;
        const a = shakeT / SHAKE_SECS;                         // 1 -> 0, the settle
        const k = Math.min(1, pressT / SHAKE_SECS);            // 0 -> 1
        camera.rotation.z = Math.sin(pressT * 6.5) * 0.11 * a * a + Math.sin(pressT * 2.3) * 0.045 * a;
        const dip = -0.26 * Math.sin(Math.PI * Math.min(1, k * 1.6)) * (0.35 + 0.65 * a) - Math.sin(pressT * 9) * 0.02 * a * a;
        const yo = Math.sin(pressT * 4.1) * 0.09 * a;
        pitch.rotation.x += dip - pitchOff; pitchOff = dip;
        yaw.rotation.y += yo - yawOff; yawOff = yo;
        if (shakeT <= 0) { camera.rotation.z = 0; pitch.rotation.x -= pitchOff; yaw.rotation.y -= yawOff; pitchOff = 0; yawOff = 0; }
      }
      // the torch down on the ground, held: the line that answers it
      if (phase === 'pressure' && !looked && kit && kit.getPresence() > 0) {
        const down = torchOn() && pitch.rotation.x < -0.85;
        downT = down ? downT + dt : Math.max(0, downT - dt * 2);
        if (downT >= 1.0) onLooked();
      }
      runTodo(); runSpeak(); runQueue();
    }
    function updatePile(t) {
      if (getState() === 'cine') { pileRing.visible = false; return; }
      const on = phase === 'decide';
      pileRing.visible = on;
      pileRing.material.opacity = on ? 0.35 + 0.25 * Math.sin(t * 2.6) : 0;
    }
    function updateFire(t) {
      chem.intensity = 1.4 + Math.sin(t * 7.3) * 0.12 + Math.sin(t * 2.1) * 0.08;
    }
    function updateSlow() {}

    /* ---------------------------------------------------------- lifecycle */
    function snap() {
      return { run: { x: runner.group.position.x, z: runner.group.position.z, ry: runner.group.rotation.y, a: runner.ghostA || 0 },
               patch: { v: patch.visible, x: patch.position.x, z: patch.position.z, s: patch.scale.x },
               pocket: pocket.visible, roadK, skyK, jungleK, roll: camera.rotation.z };
    }
    function restore(s) {
      pocket.visible = !!s.pocket; roadK = s.roadK || 0; skyK = s.skyK ?? 1;
      runner.group.position.set(s.run.x, 0, s.run.z); runner.group.rotation.y = s.run.ry; ghostAlpha(runner, s.run.a || 0);
      if (runner.acts && runner.idle) runner.play(runner.idle, 1, 0);
      patch.visible = !!s.patch.v; patch.position.x = s.patch.x; patch.position.z = s.patch.z; patch.scale.setScalar(s.patch.s || 1);
      jungleK = s.jungleK ?? 1; mixBeds();
      camera.rotation.z = s.roll || 0;
      tailPivot.rotation.x = 0;
      fileHome(); for (const r of file) if (r.acts) r.play('Idle_3', 1, 0);
      if (kit) kit.daylight(null, 0);
      talkReset(); if (buddy.acts) buddy.play('Idle_3', 1, 0);   // v11.4: a scene's talking take ends with the scene
      if (farRun) farEnd();
    }
    function reset() {
      pocket.visible = false; roadK = 0; skyK = 1;
      runner.group.position.set(RUN_HOME.x, 0, RUN_HOME.z); runner.group.rotation.y = 0; ghostAlpha(runner, 0);
      patch.visible = false; patch.scale.setScalar(1);
      camera.rotation.z = 0;
      dropTodo(); speakReset(); lineQ.length = 0;
      seen.clear(); booted = false; dayClock.t = 0; lastWall = 0;
      shakeT = 0; downT = 0; looked = false; jungleK = 1; mixBeds(); yawOff = 0; pitchOff = 0;
      bushAt = 0; callAt = 0; bushSeed = 13; bushN = 0; callN = 0;   // v11.3: the bushes are stated in dayClock too
      if (farRun) farEnd(); farAt = 0; farN = 0; farSeed = 29;          // v11.4: and the far runs
      talkReset(); kneelSaid = false; kneelLook.want = 0; kneelLook.w = 0; kneelLook.x = 0; kneelLook.y = 0;
      /* v12.5: the accumulated LOOK is run state, the v8.1 law again — and
         visible now that the mark draws it, so a replay would open on a
         half-filled ring. e2c4 has cleared it since v12.3; this chapter,
         which is where the seam was written, never did. */
      for (const h of hotspots) { h.dwellT = 0; h.done = false; }
      if (kit) { if (kit.hurt) kit.hurt(null); if (kit.root) kit.root(false); }
      fileHome();
      if (kit) { kit.daylight(null, 0); kit.presence(0); kit.setPhase(null); if (kit.torchOn) kit.torchOn(false); if (kit.take) kit.take('torch'); }   // v11.6: a fresh night starts with the torch on the ground, not in his hand
      gear = -1; gtorchShow(false);
      phase = 'look';
    }
    function blockers() {
      const out = [];
      const solid = (o, pad = 0.14) => { o.updateWorldMatrix(true, false); const bb = new THREE.Box3().setFromObject(o); bb.expandByScalar(pad); bb.min.y = 0; bb.max.y = Math.max(bb.max.y, 1.40); out.push(bb); };
      for (const s of solids) solid(s);
      for (const b of treeBlockers) out.push(b);
      for (const m of [BUDDY, KNEEL1, KNEEL2, LIE1, CMD]) out.push(new THREE.Box3(new THREE.Vector3(m.x - 0.45, 0, m.z - 0.45), new THREE.Vector3(m.x + 0.45, 1.8, m.z + 0.45)));
      return out;
    }
    function dispose() {
      alive = false;
      if (treeStand) treeStand.userData.disposeTrees?.();
      const geos = new Set(), mats = new Set();
      world.traverse(o => {
        if (o.geometry) geos.add(o.geometry);
        if (o.material) for (const m of (Array.isArray(o.material) ? o.material : [o.material])) mats.add(m);
      });
      scene.remove(world);
      for (const o of owned) { o.parent?.remove(o); o.dispose?.(); }
      owned.length = 0;
      for (const r of rigs) r.mixer?.stopAllAction();
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
      ready: () => (cmd.ready && buddy.ready && lie.ready && riders.every(r => r.ready) && forestReady && truckReady) || performance.now() - readyAt > 20000,
      pile: { pos: PILE_POS, radius: INTERACT_R, group: pile,
              dist: pileDist, screen: pileScreen, inView: pileInView,
              hits: pointerHitsPile, interact: interactPile,
              glow: () => pileRing.material.opacity },
      drum: null, ash: null, embers: null, heroNote: null, smoke: null, flying: null,
      jossTips: [], fireLight: chem,
      get noteStorm() { return 1; },
      set noteStorm(v) {},
      // the chapter's own
      HIS, CENTRE, BUDDY, KNEEL1, KNEEL2, LIE1, CMD, FIG, LOG, GAP, PK, TB, RUN_HOME, FOREST, ROAD, DRIVE, DROP, roadLen,
      cmd, buddy, kneel1, kneel2, lie, runner, cmdFilm, file, riders, ghostAlpha, patch,
      pocket, truck, tailPivot, forest, chem, roadAt, driveTo, rideCam, walkIn, fileHome,
      setRoad: (k) => { roadK = k; }, setSky: (k) => { skyK = k; }, setJungle: (k) => { jungleK = k; mixBeds(); },
      sayLine, seen, after, dayClock,
      get phase() { return phase; },
      setPhase, applyPhase, beginPressure,
      gtorchShow, gtorchSet, pickTorch, GT, get gear() { return gear; },   // v11.6
      lookInfo: () => ({ phase, seen: [...seen], obj: kit && kit.getPhase ? kit.getPhase() : null, downT: +downT.toFixed(2), looked, shakeT: +shakeT.toFixed(2) }),
      speakInfo: () => ({ t: +dayClock.t.toFixed(2), until: +speak.until.toFixed(2), pending: speak.pending ? speak.pending.name : null, queued: lineQ.length }),
      ambient: () => ({ jungleK, beds: DATA.ambience.beds.map(b => [b[0], +b[1].toFixed(3)]), bush: { at: +bushAt.toFixed(1), callAt: +callAt.toFixed(1), fired: bushN, calls: callN, t: +dayClock.t.toFixed(1), trees: TREE_AT.length },
                        far: { at: +farAt.toFixed(1), n: farN, run: farRun ? { k: +((dayClock.t - farRun.t0) / farRun.dur).toFixed(2), x: +runner.group.position.x.toFixed(2), z: +runner.group.position.z.toFixed(2), a: +(runner.ghostA || 0).toFixed(2) } : null },
                        kneel: { said: kneelSaid, w: +kneelLook.w.toFixed(2), y: +kneelLook.y.toFixed(2) }, talking: [...talkers].map(r => r.cur),
                        gear: { step: gear, on: gtOn, vis: gtorch.visible } }),
      updateNotes, updatePile, updateFire, updateSlow,
      setNoteTexture() {},
      snap, restore, reset, dispose,
      hotspots
    });
  }

  /* ------------------------------------------------------------ THE FILM
     Narration and storytelling first (Chad): the tonner at last light, the
     drop-off and the brief, the walk in as the light goes, and the harbour
     at night from above coming down into his scrape, where play begins. */
  function intro(c, s, api) {
    const { tr, step, sfx, fade, camTo, yawTo, pitchTo, faceFrom, rawK, smoothK, duck, stage, armR, kit } = api;
    const PK = stage.PK, D = stage.DROP;
    const P = (x, y, z) => ({ x: PK.x + x, y, z: PK.z + z });
    const HIS = stage.HIS;
    step(0, () => {
      armR.visible = false;
      stage.pocket.visible = true; stage.setRoad(1); stage.setSky(1); stage.driveTo(0);
      /* the file and the kneeling commander stand on the road behind the
         truck's STOP, which is straight out of the back of a truck that is
         still driving (found by render at v11.0: five men on the road behind
         a moving tonner). They are hidden until it has stopped. */
      for (const r of stage.file) r.group.visible = false;
      stage.cmdFilm.group.visible = false;
      stage.tailPivot.rotation.x = 0;
      if (kit) { kit.daylight(DUSK, 0); if (kit.torchOn) kit.torchOn(false); }
      stage.runner.group.visible = false;
    });
    fade(0.0, 0.3, 1, 1);
    /* the beds: the jungle held down under the truck, the dread at a third */
    tr(0, 0.1, () => { duck('junglenight', 0.15); duck('e2dread', 0.35); }, rawK);
    /* 0.8 ON THE TONNER (0.8–17): seated on the front of the left bench
       looking out of the open back, the section dozing either side, the
       forest road unrolling behind as Chad's Kamaz drives it (v11.2). The
       camera rides the truck — computed from its matrix every frame — and
       the drive eases out to the stop. */
    sfx(0.2, 'tonner', 0.85);
    sfx(13.6, 'tonner', 0.85);
    tr(0.3, 17.0, (k, t) => { stage.driveTo(1 - (1 - k) * (1 - k)); stage.rideCam(t); }, rawK);
    fade(0.8, 3.0, 1, 0);
    sfx(1.6, 'n3pro1');                          // "I thought the shower incident was going to be the only strange encounter in my army life. It wasn't."
    sfx(9.6, 'n3pro2');                         // "Months later, I was posted to Infantry... and here we are, on the first night of our outfield exercise..."
    fade(16.2, 17.0, 0, 1);
    /* 17 THE DROP-OFF (17.2–26): the brakes, the tail-gate dropping, the
       file forming at the track's mouth, the commander kneeling with his
       hand up, the last light through the leaves */
    step(17.0, () => { stage.setRoad(0); stage.driveTo(1); stage.fileHome(); for (const r of stage.file) r.group.visible = true; stage.cmdFilm.group.visible = true; });
    sfx(17.1, 'tailgate', 0.9);
    step(17.2, () => { for (const r of stage.file) if (r.acts) r.play('Idle_3', 1, 0); });
    camTo(17.4, 26.0, P(D.cam0.x, D.cam0.y + 1.55, D.cam0.z), P(D.cam1.x, D.cam1.y + 1.5, D.cam1.z), smoothK);
    yawTo(17.4, 26.0, faceFrom(PK.x + D.cam0.x, PK.z + D.cam0.z, PK.x + D.look.x, PK.z + D.look.z), faceFrom(PK.x + D.cam1.x, PK.z + D.cam1.z, PK.x + D.look.x, PK.z + D.look.z), smoothK);
    pitchTo(17.4, 26.0, -0.04, -0.02, smoothK);
    fade(17.4, 18.6, 1, 0);
    sfx(19.0, 's3brief');                        // "Single file. Five metres. Nobody talks. We harbour before dark."
    fade(25.2, 26.0, 0, 1);
    /* 26 THE WALK IN (26–34.5): first person at the file's tail, the backs
       ahead going grey, the light draining to night */
    step(26.0, () => {
      if (kit) kit.daylight(NIGHT_TWEEN, 8.0);
      for (const r of stage.file) if (r.acts) r.play('Walking', 1.2, 0.2);
    });
    tr(26.0, 34.5, k => { stage.setSky(1 - 0.92 * k); }, smoothK);
    sfx(26.2, 'bootsleaf', 0.75);
    sfx(27.0, 'n3pro3');                         // "We walked in as the light went. Dug our scrapes. Then there was nothing to do but wait for morning."
    tr(26.0, 34.5, (k, t) => stage.walkIn(k, t), rawK);   // the men and the camera up the road ahead of the truck, on the terrain
    pitchTo(26.0, 34.5, -0.03, -0.06, smoothK);
    fade(26.0, 27.2, 1, 0);
    fade(33.6, 34.5, 0, 1);
    /* 34.5 THE HARBOUR (34.5–46.5): the real world at night, from above the
       ring, coming down into his scrape and turning out to the trees */
    step(34.5, () => {
      stage.pocket.visible = false; stage.setRoad(0); stage.fileHome();
      for (const r of stage.file) if (r.acts) r.play('Idle_3', 1, 0);
      if (kit) kit.daylight(null, 0);
    });
    tr(34.5, 36.5, k => { duck('junglenight', 0.15 + 0.85 * k); duck('e2dread', 0.35 + 0.65 * k); }, rawK);
    camTo(34.5, 44.2, { x: 0.4, y: 3.6, z: 13.5 }, { x: HIS.x, y: 1.62, z: HIS.z }, smoothK);
    yawTo(34.5, 44.2, 0.08, 0.0, smoothK);
    pitchTo(34.5, 44.2, -0.34, -0.02, smoothK);
    fade(34.5, 36.4, 1, 0);
    sfx(36.0, 'n3pro4');                         // "I was at the very rear of my section. Facing away from the others. Looking out into the dark."
    /* v11.6: the torch clicks on ON THE GROUND beside the scrape, not in his
       hand — he has none yet — and the lens drops onto it, the beam out
       across the litter, which is the first thing play will ask him to
       pick up */
    step(44.2, () => { stage.gtorchShow(true); stage.gtorchSet(true); });
    sfx(44.2, 'torchclick', 0.7);
    yawTo(44.4, 46.4, 0.0, -0.36, smoothK);
    pitchTo(44.4, 46.4, -0.02, -0.80, smoothK);
    fade(47.6, 48.6, 0, 1);
    step(48.8, () => { armR.visible = true; });
    c.endFade = 1;
    c.keepFade = true;
  }
  /* the walk-in's target: the chapter's own night (the declaration) */
  const NIGHT_TWEEN = null;

  /* ---------------------------------------------------------- the scenes
     All four begin where the decision opened: in his scrape, the torch on
     the ground at his feet, the jungle BEHIND him (the sixth spot put him
     facing the ring). `behind` is read off his real yaw, so it is right
     whichever way he stood. Hands hidden in all four. */
  const P = (s) => ({ x: s.yawPos.x, y: s.yawPos.y, z: s.yawPos.z });
  const behindOf = (s) => ({ x: Math.sin(s.yawRot), z: Math.cos(s.yawRot) });   // yaw θ faces (−sin θ, −cos θ)

  /* A · SHINE THE TORCH ON THE SOURCE OF THE PRESSURE (12.4 s) — Chad's scene.
     The view turns 180 degrees backwards with the beam sweeping the litter,
     and in the half-second before the turn is square a transparent soldier
     is already running into the trees on leaf-litter footsteps — gone before
     there is a full view of him. The beam lands where he was: a pressed
     patch that lifts back by itself. */
  function scShine(c, s, api) {
    const { tr, step, sfx, fade, yawTo, pitchTo, rawK, smoothK, stage, handsRoot, kit } = api;
    const P0 = P(s), B = behindOf(s);
    const Y1 = s.yawRot + Math.PI;
    const AT = { x: P0.x + B.x * 1.35, z: P0.z + B.z * 1.35 };
    const TO = { x: P0.x + B.x * 7.2, z: P0.z + B.z * 7.2 };
    const RUN_T0 = 0.55, RUN_T1 = 2.35;              // 5.85 m in 1.8 s = 3.25 m/s: a sprint
    step(0, () => { handsRoot.visible = false; if (kit && kit.torchOn) kit.torchOn(true); if (kit && kit.hurt) { kit.hurt(null); kit.root(false); } });
    /* the turn: slow off the mark, then the whip */
    yawTo(0.25, 1.35, s.yawRot, Y1, k => k * k * (3 - 2 * k));
    pitchTo(0.25, 1.35, s.pitchX, -0.58, smoothK);
    step(RUN_T0, () => {
      const g = stage.runner;
      g.group.position.set(AT.x, 0, AT.z);
      g.group.rotation.y = Math.atan2(B.x, B.z);       // facing the way he runs
      stage.ghostAlpha(g, 0);
      g.play('Running', 1, 0.1);
      stage.patch.position.set(P0.x + B.x * 1.0, 0.015, P0.z + B.z * 1.0);
      stage.patch.scale.setScalar(1); stage.patch.visible = true;
    });
    tr(RUN_T0, RUN_T0 + 0.18, k => { stage.ghostAlpha(stage.runner, k); }, rawK);
    tr(RUN_T0, RUN_T1, k => {
      stage.runner.group.position.x = AT.x + (TO.x - AT.x) * k;
      stage.runner.group.position.z = AT.z + (TO.z - AT.z) * k;
    }, rawK);
    tr(1.55, RUN_T1, k => { stage.ghostAlpha(stage.runner, 1 - k); }, rawK);
    step(RUN_T1 + 0.05, () => {
      const g = stage.runner;
      stage.ghostAlpha(g, 0);
      if (g.idle) g.play(g.idle, 1, 0);
      g.group.position.set(stage.RUN_HOME.x, 0, stage.RUN_HOME.z);
    });
    sfx(0.55, 'ghostrunleaf', 0.9);
    sfx(1.6, 'ghostlaugh', 0.22);
    /* the litter lifting back where the weight was; the pressure lifts with it */
    sfx(2.5, 'leaflift', 0.7);
    tr(2.5, 3.2, k => { stage.patch.scale.setScalar(1 - 0.85 * k); }, smoothK);
    step(2.6, () => { if (kit) kit.presence(0); });
    step(3.3, () => { stage.patch.visible = false; });
    sfx(3.7, 'n3A1');                            // "...gone. Whatever it was. As soon as the light touched it."
    sfx(8.3, 'n3A2');                            // "I didn't chase it."
    fade(10.6, 11.8, 0, 1);
    step(12.2, () => { handsRoot.visible = true; });
    c.endFade = 1;
  }

  /* B · REACH DOWN INTO THE DARK (12.2 s). The torch stays down; the lens
     tilts after his hand into the leaf litter beside the leg — and the
     leaves are moving, something drawing back from his fingers. */
  function scReach(c, s, api) {
    const { tr, step, sfx, fade, yawTo, pitchTo, rawK, smoothK, stage, handsRoot, kit } = api;
    const P0 = P(s), B = behindOf(s);
    step(0, () => { handsRoot.visible = false; if (kit && kit.hurt) { kit.hurt(null); kit.root(false); } });
    /* v11.1 (Chad): the torch goes OFF before the hand goes down — he reaches
       into the dark, which is the option's whole name */
    sfx(0.3, 'torchclick', 0.8);
    step(0.3, () => { if (kit && kit.torchOn) kit.torchOn(false); });
    yawTo(0.5, 1.7, s.yawRot, s.yawRot + 0.55, smoothK);
    pitchTo(0.5, 1.7, s.pitchX, -1.05, smoothK);
    step(0.9, () => {
      stage.patch.position.set(P0.x + B.x * 0.55 - Math.cos(s.yawRot) * 0.35, 0.015, P0.z + B.z * 0.55 + Math.sin(s.yawRot) * 0.35);
      stage.patch.scale.setScalar(1.1); stage.patch.visible = true;
    });
    sfx(2.0, 'leafdraw', 0.85);
    tr(2.0, 3.6, k => { stage.patch.position.x += B.x * 0.0045; stage.patch.position.z += B.z * 0.0045; stage.patch.scale.setScalar(1.1 - 0.5 * k); }, rawK);
    step(2.0, () => { if (kit) kit.presence(0.45); });
    step(3.7, () => { stage.patch.visible = false; });
    pitchTo(3.4, 4.2, -1.05, -0.35, smoothK);
    sfx(4.1, 'n3B1');                            // "Cold. Something was there. Something moved."
    step(5.6, () => { if (kit) kit.presence(0); });
    sfx(8.2, 'n3B2');                            // "I should have looked first."
    fade(10.4, 11.6, 0, 1);
    step(12.0, () => { handsRoot.visible = true; });
    c.endFade = 1;
  }

  /* C · ASK YOUR BUDDY IF HE FELT IT (21.4 s). A whisper to the next
     scrape; "Feel what?"; the pressure lifts while he is talking,
     unremarked; two beams facing out into the same dark. */
  function scAsk(c, s, api) {
    const { step, sfx, fade, camTo, yawTo, pitchTo, faceFrom, rawK, smoothK, stage, handsRoot, kit } = api;
    const P0 = P(s), BD = stage.BUDDY;
    const Y_B = faceFrom(P0.x, P0.z, BD.x, BD.z);
    step(0, () => { handsRoot.visible = false; if (kit && kit.hurt) { kit.hurt(null); kit.root(false); } });
    yawTo(0, 1.2, s.yawRot, Y_B, smoothK);
    pitchTo(0, 1.2, s.pitchX, -0.06, smoothK);
    sfx(1.4, 'n3C1');                            // "Eh. You feel that?"
    sfx(3.8, 'b3C1');                            // "Feel what?" 2.43 s → 6.2
    /* v11.4 (Chad: "that soldier should have a talking animation"): the
       buddy on the file's talking take for each of his three lines, back to
       his idle between them — measured against the takes' own lengths */
    const TK = 'Talk_with_Left_Hand_Raised', bd = () => stage.buddy;
    step(3.8, () => { if (bd().acts) bd().play(TK, 1, 0.25); });
    step(5.0, () => { if (bd().acts) bd().play('Idle_3', 1, 0.3); });
    sfx(6.5, 'n3C2');                            // "...my leg. Something pressed on it." 2.51 s → 9.0
    sfx(9.4, 'b3C2');                            // "Nothing there. Maybe root. Or you fell asleep sitting." 4.36 s → 13.8
    step(9.4, () => { if (bd().acts) bd().play(TK, 1, 0.25); });
    step(13.7, () => { if (bd().acts) bd().play('Idle_3', 1, 0.3); });
    step(10.5, () => { if (kit) kit.presence(0); });
    sfx(14.2, 'b3C3');                           // "Face the front. I face mine. Relief at four." 4.83 s → 19.0
    step(14.2, () => { if (bd().acts) bd().play(TK, 1, 0.25); });
    step(19.2, () => { if (bd().acts) bd().play('Idle_3', 1, 0.3); });
    /* the pull up and back over both scrapes */
    camTo(15.0, 20.6, P0, { x: P0.x + 1.2, y: 3.4, z: P0.z + 2.6 }, smoothK);
    yawTo(15.0, 20.6, Y_B, faceFrom(P0.x + 1.2, P0.z + 2.6, (P0.x + BD.x) / 2, (P0.z + BD.z) / 2 - 2), smoothK);
    pitchTo(15.0, 20.6, -0.06, -0.55, smoothK);
    fade(19.8, 21.0, 0, 1);
    step(21.4, () => { handsRoot.visible = true; });
    c.endFade = 1;
  }

  /* D · "WHO'S THERE?" (12.5 s). Out loud, across the harbour. Silence, the
     commander's hiss, the buddy's — and the pressure lifts on the frame his
     voice ends, exactly as if answered. Something moves away through the
     undergrowth behind him, unseen. */
  function scWho(c, s, api) {
    const { tr, step, sfx, fade, yawTo, pitchTo, rawK, smoothK, stage, handsRoot, kit } = api;
    const P0 = P(s), B = behindOf(s);
    step(0, () => { handsRoot.visible = false; if (kit && kit.hurt) { kit.hurt(null); kit.root(false); } });
    pitchTo(0, 0.8, s.pitchX, -0.1, smoothK);
    sfx(0.6, 'n3D1');                            // "Who's there?"
    step(2.3, () => { if (kit) kit.presence(0); });
    sfx(3.2, 's3hiss');                          // "TWO. Shut up." 1.88 s → 5.1
    sfx(5.3, 'b3D');                             // "Siao ah?" 1.49 s → 6.8
    /* v11.1 (Chad): the ghost soldier runs away behind him with the laugh,
       as scene A's does — he turns on his own shout and catches the back of
       a man already going */
    const AT = { x: P0.x + B.x * 1.35, z: P0.z + B.z * 1.35 }, TO = { x: P0.x + B.x * 7.2, z: P0.z + B.z * 7.2 };
    const R0 = 5.9, R1 = 7.7;
    yawTo(5.6, 7.0, s.yawRot, s.yawRot + Math.PI, smoothK);
    pitchTo(5.6, 7.0, -0.1, -0.22, smoothK);
    step(R0, () => { const g = stage.runner; g.group.position.set(AT.x, 0, AT.z); g.group.rotation.y = Math.atan2(B.x, B.z); stage.ghostAlpha(g, 0); g.play('Running', 1, 0.1); });
    tr(R0, R0 + 0.18, k => { stage.ghostAlpha(stage.runner, k); }, rawK);
    tr(R0, R1, k => { stage.runner.group.position.x = AT.x + (TO.x - AT.x) * k; stage.runner.group.position.z = AT.z + (TO.z - AT.z) * k; }, rawK);
    tr(6.9, R1, k => { stage.ghostAlpha(stage.runner, 1 - k); }, rawK);
    step(R1 + 0.05, () => { const g = stage.runner; stage.ghostAlpha(g, 0); if (g.idle) g.play(g.idle, 1, 0); g.group.position.set(stage.RUN_HOME.x, 0, stage.RUN_HOME.z); });
    sfx(5.9, 'ghostrunleaf', 0.9);
    sfx(6.4, 'ghostlaugh', 0.3);
    sfx(7.6, 'n3D2');                            // "It stopped. Right when I asked." 3.16 s → 10.8
    fade(10.9, 12.1, 0, 1);
    step(12.5, () => { handsRoot.visible = true; });
    c.endFade = 1;
  }

  (window.__CHAPTERS__ = window.__CHAPTERS__ || {}).e2c3 = Object.assign(DATA, {
    build,
    intro,
    scenes: [scShine, scReach, scAsk, scWho]
  });
})();
