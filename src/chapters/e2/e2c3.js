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
    id: 3,
    episode: 2,
    title: 'The Pressure',
    cardLabel: 'Chapter 3',
    cardTitle: 'The Pressure<br>Outfield, Night One',
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
    core: 'Sometimes you feel something before you see anything at all. That alone proves nothing. Improve your seeing before you act — and do not make the dark darker to prove you are brave.<br><i>Sati — attention, kept where it can see.</i>',

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
    torch: { on: true, angle: 0.40, intensity: 24, distance: 26, penumbra: 0.6 },

    assets: ['fbosling', 'sleeper', 'tree1', 'tree2', 'tree3', 'tree4'],

    musicVol: 0,
    /* the jungle, all night, keyed to nothing; the episode's dread under it
       at chapter 1's level (v10.7); `tonner` is the film's and starts at 0 */
    ambience: { beds: [['junglenight', 0.34], ['e2dread', 1.0], ['tonner', 0]] },

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
      hotFeet: 'Look down at your boots'
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
  const SECS = { n3spot1: 3.16, n3spot2: 2.69, n3spot3: 2.85, b3here: 3.16, n3spot5: 2.93, n3spot6: 5.49, n3press: 6.77, n3look: 7.16, n3still: 2.69 };

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
    // laterite: orange-brown road with two ruts and gravel
    const roadTex = mt(paint(512, (cx, S) => {
      cx.fillStyle = '#7a4a2c'; cx.fillRect(0, 0, S, S);
      for (let i = 0; i < 1800; i++) { const g = hash(i, 11); cx.fillStyle = `rgba(${120 + g * 60},${80 + g * 40},${50 + g * 20},0.5)`; cx.fillRect(hash(i, 12) * S, hash(i, 13) * S, 2 + g * 4, 2 + g * 3); }
      cx.fillStyle = 'rgba(40,24,14,0.45)'; cx.fillRect(S * 0.28, 0, S * 0.09, S); cx.fillRect(S * 0.63, 0, S * 0.09, S);
    }, [1, 18]));
    // the wall of jungle beside the road, at dusk: canopy silhouette under a sky
    const wallTex = mt(paint(1024, (cx, S) => {
      const g = cx.createLinearGradient(0, 0, 0, S * 0.55); g.addColorStop(0, '#4a5a7a'); g.addColorStop(1, '#d8a070');
      cx.fillStyle = g; cx.fillRect(0, 0, S, S);
      for (let i = 0; i < 900; i++) {
        const x = hash(i, 21) * S, h = S * (0.42 + hash(i, 22) * 0.2), w = S * (0.012 + hash(i, 23) * 0.03);
        cx.fillStyle = `rgba(${14 + hash(i, 24) * 14},${26 + hash(i, 25) * 20},${18 + hash(i, 26) * 10},0.96)`;
        for (const ox of [-S, 0, S]) { cx.beginPath(); cx.ellipse(x + ox, S - h * 0.6, w * 3, h * 0.45, 0, 0, 7); cx.fill(); cx.fillRect(x + ox - w / 2, S - h * 0.55, w, h * 0.55); }
      }
      cx.fillStyle = '#0d1410'; cx.fillRect(0, S * 0.72, S, S * 0.28);
    }, [10, 1]));
    wallTex.wrapT = THREE.ClampToEdgeWrapping;
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
    for (let i = 0; i < 88; i++) {
      const a = hash(i, 51) * Math.PI * 2, r = 8.2 + hash(i, 52) * 24 * (hash(i, 53) < 0.5 ? 0.35 : 1);
      const x = CENTRE.x + Math.cos(a) * r, z = CENTRE.z + Math.sin(a) * r;
      if (Math.abs(x) < 2.4 && z > 9) continue;                          // the track
      if (Math.hypot(x - FIG.x, z - FIG.z) < 2.2 || Math.hypot(x - LOG.x, z - LOG.z) < 2.4) continue;
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
      new GLTFLoader().parse(BUF, '', (gltf) => { rescueTextures(gltf, BUF); res(gltf); }, rej))));
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
          }
        }
        proxy.visible = false; rig.ready = true; redoShadows();
        if (opts.onReady) opts.onReady(rig);
      }).catch(err => { console.warn(key + ' failed to load', err); rig.ready = true; });
      rigs.push(rig);
      return rig;
    }
    /* `fbosling` is prepped to 1.74 m; the kneel take's own hips sit 0.53 m
       up (models doc §3), so a kneeling man is scaled off the MODEL's known
       standing height rather than measured on the kneel (a folded pose is a
       shorter box, which asks for a bigger man — the v5.05 law). */
    const KNEEL = 'Gesture_with_Hand_on_Gun';
    const cmd    = mkRig('fbosling', { x: CMD.x, z: CMD.z, ry: CMD.ry, height: 1.74, idle: KNEEL, rate: 0.5, lift: 0.015 });
    const buddy  = mkRig('fbosling', { x: BUDDY.x, z: BUDDY.z, ry: BUDDY.ry, height: 1.74, idle: 'Idle_6' });
    const kneel1 = mkRig('fbosling', { x: KNEEL1.x, z: KNEEL1.z, ry: KNEEL1.ry, height: 1.74, idle: KNEEL, rate: 0.35, phase: 0.45, lift: 0.015 });
    const kneel2 = mkRig('fbosling', { x: KNEEL2.x, z: KNEEL2.z, ry: KNEEL2.ry, height: 1.74, idle: KNEEL, rate: 0.4, phase: 0.8, lift: 0.015 });
    /* one man flat on his back on his pack: the sleeper statue, laid on the
       ground by its own box (it lies along its z with the head at −z) */
    const lieRoot = new THREE.Group(); lieRoot.position.set(LIE1.x, 0, LIE1.z); lieRoot.rotation.y = LIE1.ry; world.add(lieRoot);
    let lieReady = false;
    loadGltf('sleeper').then(gltf => {
      if (!alive) return;
      const m = gltf.scene.clone();
      m.traverse(o => { if (o.isMesh) { o.castShadow = !LOW; o.receiveShadow = false; } });
      m.updateMatrixWorld(true);
      const bb = new THREE.Box3().setFromObject(m);
      const size = bb.getSize(new THREE.Vector3());
      const sc = Math.min(1, 1.75 / Math.max(size.x, size.z));
      m.scale.setScalar(sc); m.position.y = -bb.min.y * sc + 0.02;
      if (size.x > size.z) m.rotation.y = Math.PI / 2;
      lieRoot.add(m); lieReady = true; redoShadows();
    }).catch(err => { console.warn('sleeper failed', err); lieReady = true; });

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
    const runner = mkRig('fbosling', { x: RUN_HOME.x, z: RUN_HOME.z, ry: 0, height: 1.74, idle: 'Idle_6', noProxy: true,
      onReady: (r) => ghostify(r, { grey: 0.8, glow: 0x30405a, alpha: 0.6 }) });
    runner.ghostA = 0;
    runner.group.visible = false;
    /* the pressed-down patch of litter the beam lands on where he was, and
       which lifts back by itself (scene A) */
    const patch = new THREE.Mesh(new THREE.CircleGeometry(0.22, 14), nfm({ map: litterTex, color: 0x3a3226, roughness: 1 }));
    patch.rotation.x = -Math.PI / 2; patch.position.y = 0.015; patch.visible = false; patch.userData.moves = true; world.add(patch);

    /* ---------------------------------------------- THE ROAD POCKET (film)
       A stretch of laterite road at last light, 150 m off and inside its own
       painted dusk (chapter 1's memory-pocket recipe: a bubble whose back
       wall is a depth surface, so the harbour 150 m away never shows through
       it). The tonner stands on it with the section in the back; the road
       and the jungle wall either side SCROLL so the truck reads as moving;
       at the road's +z end the track goes into real trees, where the file
       forms and walks in. Every material is fog-free. */
    const pocket = new THREE.Group();
    pocket.position.set(PK.x, 0, PK.z);
    pocket.visible = false;
    world.add(pocket);
    const pbox = (w, h, d, x, y, z, mat) => box(w, h, d, x, y, z, mat, pocket);
    const skyMat = new THREE.MeshBasicMaterial({ map: duskSky, side: THREE.BackSide, fog: false });
    const sky = new THREE.Mesh(new THREE.SphereGeometry(130, 32, 18), skyMat); sky.position.y = 0; pocket.add(sky);
    const pGround = new THREE.Mesh(new THREE.PlaneGeometry(260, 260), nf({ map: litterTex, color: 0x5a4a34, roughness: 1 }));
    pGround.rotation.x = -Math.PI / 2; pGround.position.y = -0.03; pocket.add(pGround);
    const matRoad = nf({ map: roadTex, roughness: 1 });
    const road = new THREE.Mesh(new THREE.PlaneGeometry(7.5, 220), matRoad); road.rotation.x = -Math.PI / 2; road.position.set(0, 0, -95); pocket.add(road);
    const matWall = nf({ map: wallTex, roughness: 1, side: THREE.DoubleSide });
    const wallL = new THREE.Mesh(new THREE.PlaneGeometry(240, 16), matWall); wallL.position.set(-8.5, 7.5, -100); wallL.rotation.y = Math.PI / 2; pocket.add(wallL);
    const wallR = new THREE.Mesh(new THREE.PlaneGeometry(240, 16), matWall.clone()); wallR.position.set(8.5, 7.5, -100); wallR.rotation.y = -Math.PI / 2; pocket.add(wallR);
    wallR.material.map = wallTex.clone(); wallR.material.map.needsUpdate = true; madeTex.push(wallR.material.map);
    // THE TONNER: a cab, a bed, the canvas tilt on hoops, wheels, a tail-gate that drops
    const matOlive = nf({ color: 0x3d4a32, roughness: 0.85 });
    const matCanvas = nf({ color: 0x4a5236, roughness: 0.98, side: THREE.DoubleSide });
    const matTyre = nf({ color: 0x0c0d0d, roughness: 0.9 });
    const matBedFloor = nf({ color: 0x2c2a22, roughness: 0.95 });
    const truck = new THREE.Group(); truck.position.set(0, 0, 0); pocket.add(truck);
    const TB = { w: 2.3, len: 4.6, floor: 1.05, h: 1.95 };
    const bed = new THREE.Mesh(new THREE.BoxGeometry(TB.w, 0.08, TB.len), matBedFloor); bed.position.set(0, TB.floor, 0); truck.add(bed);
    box(TB.w, 0.6, 0.05, 0, TB.floor + 0.3, -TB.len / 2, matOlive, truck);
    for (const sx of [-1, 1]) {
      box(0.05, 0.5, TB.len, sx * TB.w / 2, TB.floor + 0.25, 0, matOlive, truck);
      const cw = new THREE.Mesh(new THREE.PlaneGeometry(TB.len, TB.h - 0.5), matCanvas); cw.position.set(sx * (TB.w / 2 + 0.02), TB.floor + 0.5 + (TB.h - 0.5) / 2, 0); cw.rotation.y = Math.PI / 2; truck.add(cw);
      for (let i = 0; i < 3; i++) { const w = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.32, 14), matTyre); w.rotation.z = Math.PI / 2; w.position.set(sx * 1.15, 0.5, -1.4 + i * 1.5 + (i === 0 ? -1.9 : 0)); truck.add(w); }
    }
    const roofC = new THREE.Mesh(new THREE.PlaneGeometry(TB.w + 0.1, TB.len), matCanvas); roofC.rotation.x = Math.PI / 2; roofC.position.set(0, TB.floor + TB.h, 0); truck.add(roofC);
    for (let i = 0; i < 4; i++) { const hoop = box(TB.w + 0.12, 0.05, 0.05, 0, TB.floor + TB.h - 0.02, -TB.len / 2 + 0.2 + i * 1.4, matOlive, truck); hoop.visible = true; }
    box(TB.w, 2.1, 2.0, 0, 1.6, -TB.len / 2 - 1.05, matOlive, truck);                                    // the cab
    const tailPivot = new THREE.Group(); tailPivot.position.set(0, TB.floor, TB.len / 2); truck.add(tailPivot);
    box(TB.w, 0.55, 0.05, 0, 0.275, 0, matOlive, tailPivot);
    tailPivot.rotation.x = 0;                                                                              // up = closed; −π/2 = dropped
    const benchL = box(0.4, 0.05, TB.len - 0.4, -TB.w / 2 + 0.22, TB.floor + 0.48, 0, matOlive, truck);
    const benchR = box(0.4, 0.05, TB.len - 0.4, TB.w / 2 - 0.22, TB.floor + 0.48, 0, matOlive, truck);
    /* the riders: standing in the bed holding the hoops, two rows facing in */
    const riders = [];
    for (const [rx, rz] of [[-0.62, -1.5], [0.62, -1.7], [-0.62, -0.2], [0.62, 0.0], [-0.62, 1.15]]) {
      const r = mkRig('fbosling', { parent: truck, x: rx, z: rz, ry: rx < 0 ? Math.PI / 2 : -Math.PI / 2, height: 1.74, idle: 'Idle_6', phase: hash(riders.length, 61) });
      r.group.position.y = TB.floor + 0.04;
      riders.push(r);
    }
    /* THE TRACK MOUTH at the road's +z end: the road stops, a trodden strip
       goes on into real trees, and the file forms there at the drop-off */
    const TRACK_Z0 = 6;
    const track = new THREE.Mesh(new THREE.PlaneGeometry(2.0, 60), nf({ map: litterTex, color: 0x6a5a44, roughness: 1 }));
    track.rotation.x = -Math.PI / 2; track.position.set(0, 0.005, TRACK_Z0 + 30); pocket.add(track);
    const pocketTrees = plantTrees ? plantTrees(pocket, (() => {
      const out = [];
      for (let i = 0; i < 70; i++) {
        const z = TRACK_Z0 - 2 + hash(i, 71) * 60, side = hash(i, 72) < 0.5 ? -1 : 1, x = side * (2.6 + hash(i, 73) * 9);
        out.push({ x, z, h: 6.5 + hash(i, 74) * 5 });
      }
      for (let i = 0; i < 20; i++) out.push({ x: (hash(i, 75) - 0.5) * 60, z: TRACK_Z0 + 62 + hash(i, 76) * 10, h: 7 + hash(i, 77) * 4 });
      return out;
    })(), { seed: 29, tint: new THREE.Color(0.78, 0.88, 0.72), roughness: 0.96, fog: false, lowKeep: 0.6 }) : null;
    const cmdFilm = mkRig('fbosling', { parent: pocket, x: 1.3, z: TRACK_Z0 + 1.4, ry: -0.8, height: 1.74, idle: KNEEL, rate: 0.9, lift: 0.015 });
    const file = [];
    for (let i = 0; i < 5; i++) {
      const r = mkRig('fbosling', { parent: pocket, x: (i % 2 ? 0.25 : -0.25), z: TRACK_Z0 + 2.6 + i * 1.7, ry: 0, height: 1.74, idle: 'Idle_6', phase: hash(i, 81) });
      r.home = { x: r.group.position.x, z: r.group.position.z };
      file.push(r);
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
    if (warmSounds) warmSounds(['n3spot1', 'n3spot2', 'n3spot3', 'b3here', 'n3spot5', 'n3spot6',
                                'stingpress', 'ghostlaugh', 'legpress', 'n3press', 'n3look', 'n3still',
                                'ghostrunleaf', 'leaflift', 'leafdraw', 'n3A1', 'n3A2', 'n3B1', 'n3B2',
                                'n3C1', 'n3C2', 'b3C1', 'b3C2', 'b3C3', 'n3D1', 'n3D2', 's3hiss', 'b3D']);

    let jungleK = 1;                                   // the bed, ducked under "nothing around..."
    function mixBeds() {
      for (const b of DATA.ambience.beds) {
        if (b[0] === 'junglenight') b[1] = 0.34 * jungleK;
        if (b[0] === 'tonner') b[1] = 0;
      }
    }
    function setPhase(p) {
      phase = p;
      if (kit) kit.setPhase(p === 'look' ? 'look:' + [...seen].join(',') : p);
    }
    function objLook() {
      if (!kit) return;
      kit.objective(DATA.words.objLook.replace('{n}', String(seen.size)));
      kit.waypoint(null);
    }
    /* THE SIX SPOTS. Seeing one says its line, counts it (1/6 · 2/6 … each
       an OBJECTIVE COMPLETE beat, v8.7) and, on the sixth, starts the
       pressure. Five is the chemlights across the ring and six is the ground
       at his own feet on the ring's side — both unlocked in that order, so
       the last thing the objective makes him do is stand with his BACK to the
       jungle, looking down. The pressure comes from behind. */
    const SPOT_LINE = { 1: 'n3spot1', 2: 'n3spot2', 3: 'n3spot3', 4: 'b3here', 5: 'n3spot5', 6: 'n3spot6' };
    function seeSpot(n) {
      if (phase !== 'look' || seen.has(n)) return false;
      const ok = sayLine(SPOT_LINE[n], 1);
      if (!ok) return false;
      seen.add(n);
      setPhase('look');
      objLook();
      if (seen.size >= 6) after((SECS[SPOT_LINE[6]] || 4) + 1.5, () => { if (phase === 'look') beginPressure(); });
      return true;
    }
    /* THE PRESSURE. A shake the chapter performs on the lens (roll and a
       kick down on the pitch, decaying over 0.45 s), the sting, the laugh
       from behind, the buzz, then his line — then the objective turns to the
       ground and PRESENCE drains until the beam is on it. */
    let shakeT = 0, shakeBase = 0, pressT = 0;
    let downT = 0, looked = false;
    function beginPressure(resume) {
      setPhase('pressure');
      if (kit) { kit.objective(null, { complete: false }); kit.waypoint(null); }
      shakeT = 0.45; shakeBase = pitch.rotation.x; pressT = 0;
      if (worldSfx) worldSfx('stingpress', 0.95);
      if (kit) kit.haptic([120, 60, 180]);
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
      if (typeof p === 'string' && p.startsWith('look:')) {
        for (const s of p.slice(5).split(',')) { const n = parseInt(s, 10); if (n >= 1 && n <= 6) seen.add(n); }
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
       Torch spots: `dwell` 0.8 s inside `aim` of the reticle, no press —
       the eighteenth seam. Enabled only while the torch is on: no beam, no
       looking, and the marks vanish with it (the objective says why). */
    const torchOn = () => !kit || !kit.torchIsOn || kit.torchIsOn();
    const spotOn = (n, needs) => () => phase === 'look' && !seen.has(n) && torchOn() && (needs === undefined || seen.has(needs));
    const hotspots = [
      { id: 'fig', pos: { x: FIG.x, y: 1.4, z: FIG.z }, radius: 12, dwell: 0.8, aim: 0.11, prompt: DATA.words.hotSpot, markY: 0.9,
        enabled: spotOn(1), onInteract() { return seeSpot(1); } },
      { id: 'log', pos: { x: LOG.x, y: 0.5, z: LOG.z }, radius: 12, dwell: 0.8, aim: 0.11, prompt: DATA.words.hotSpot,
        enabled: spotOn(2), onInteract() { return seeSpot(2); } },
      { id: 'gap', pos: { x: GAP.x, y: 1.5, z: GAP.z }, radius: 13, dwell: 0.8, aim: 0.11, prompt: DATA.words.hotSpot,
        enabled: spotOn(3), onInteract() { return seeSpot(3); } },
      { id: 'buddy', pos: { x: BUDDY.x, y: 1.15, z: BUDDY.z }, radius: 9, dwell: 0.8, aim: 0.12, prompt: DATA.words.hotBuddy,
        enabled: spotOn(4), onInteract() { return seeSpot(4); } },
      { id: 'chem', pos: { x: CMD.x + 0.2, y: 0.6, z: CMD.z + 0.5 }, radius: 13, dwell: 0.8, aim: 0.11, prompt: DATA.words.hotSpot, markY: 0.7,
        enabled: spotOn(5, 4), onInteract() { return seeSpot(5); } },
      { id: 'feet', pos: { x: HIS.x, y: 0.12, z: HIS.z + 0.95 }, radius: 2.6, dwell: 0.8, aim: 0.14, prompt: DATA.words.hotFeet, markY: 0.35, anyView: true,
        enabled: spotOn(6, 5), onInteract() { return seeSpot(6); } }
    ];

    /* ---------------------------------------------------------- per frame */
    function updateNotes(dt, t) {
      for (const r of rigs) if (r.mixer && r.group.visible && (r.group.parent !== truck && r.group.parent !== pocket || pocket.visible)) r.mixer.update(dt);
      if (pocket.visible) {
        if (roadK > 0) { matRoad.map.offset.y -= dt * 0.75 * roadK; wallL.material.map.offset.x -= dt * 0.045 * roadK; wallR.material.map.offset.x += dt * 0.045 * roadK; }
        truck.rotation.z = Math.sin(t * 3.1) * 0.006 * roadK; truck.position.y = Math.sin(t * 5.3) * 0.012 * roadK;
        skyMat.color.setScalar(skyK);
      }
      if (getState() !== 'play') { lastWall = 0; return; }
      const now = performance.now() / 1000;
      if (lastWall) dayClock.t += Math.min(0.5, now - lastWall);
      lastWall = now;
      if (!booted) { booted = true; applyPhase(kit ? kit.getPhase() : null); }
      // the shake: roll and a kick down, decaying — the chapter owns the lens for half a second
      if (shakeT > 0) {
        shakeT = Math.max(0, shakeT - dt);
        const a = shakeT / 0.45;
        pressT += dt;
        camera.rotation.z = Math.sin(pressT * 43) * 0.07 * a * a;
        pitch.rotation.x = shakeBase - 0.10 * Math.sin(Math.PI * (1 - a)) * a + Math.sin(pressT * 31) * 0.03 * a * a;
        if (shakeT <= 0) camera.rotation.z = 0;
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
      for (const r of file) if (r.home) { r.group.position.x = r.home.x; r.group.position.z = r.home.z; if (r.acts) r.play('Idle_6', 1, 0); }
      if (kit) kit.daylight(null, 0);
    }
    function reset() {
      pocket.visible = false; roadK = 0; skyK = 1;
      runner.group.position.set(RUN_HOME.x, 0, RUN_HOME.z); runner.group.rotation.y = 0; ghostAlpha(runner, 0);
      patch.visible = false; patch.scale.setScalar(1);
      camera.rotation.z = 0;
      dropTodo(); speakReset(); lineQ.length = 0;
      seen.clear(); booted = false; dayClock.t = 0; lastWall = 0;
      shakeT = 0; downT = 0; looked = false; jungleK = 1; mixBeds();
      for (const r of file) if (r.home) { r.group.position.x = r.home.x; r.group.position.z = r.home.z; }
      if (kit) { kit.daylight(null, 0); kit.presence(0); kit.setPhase('look:'); if (kit.torchOn) kit.torchOn(true); }
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
      if (pocketTrees) pocketTrees.userData.disposeTrees?.();
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
      ready: () => (cmd.ready && buddy.ready && riders.every(r => r.ready) && lieReady) || performance.now() - readyAt > 12000,
      pile: { pos: PILE_POS, radius: INTERACT_R, group: pile,
              dist: pileDist, screen: pileScreen, inView: pileInView,
              hits: pointerHitsPile, interact: interactPile,
              glow: () => pileRing.material.opacity },
      drum: null, ash: null, embers: null, heroNote: null, smoke: null, flying: null,
      jossTips: [], fireLight: chem,
      get noteStorm() { return 1; },
      set noteStorm(v) {},
      // the chapter's own
      HIS, CENTRE, BUDDY, KNEEL1, KNEEL2, LIE1, CMD, FIG, LOG, GAP, PK, TB, TRACK_Z0, RUN_HOME,
      cmd, buddy, kneel1, kneel2, runner, cmdFilm, file, riders, ghostAlpha, patch,
      pocket, truck, tailPivot, chem,
      setRoad: (k) => { roadK = k; }, setSky: (k) => { skyK = k; }, setJungle: (k) => { jungleK = k; mixBeds(); },
      sayLine, seen, after, dayClock,
      get phase() { return phase; },
      setPhase, applyPhase, beginPressure,
      lookInfo: () => ({ phase, seen: [...seen], obj: kit && kit.getPhase ? kit.getPhase() : null, downT: +downT.toFixed(2), looked, shakeT: +shakeT.toFixed(2) }),
      speakInfo: () => ({ t: +dayClock.t.toFixed(2), until: +speak.until.toFixed(2), pending: speak.pending ? speak.pending.name : null, queued: lineQ.length }),
      ambient: () => ({ jungleK, beds: DATA.ambience.beds.map(b => [b[0], +b[1].toFixed(3)]) }),
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
    const PK = stage.PK, TB = stage.TB, TZ = stage.TRACK_Z0;
    const P = (x, y, z) => ({ x: PK.x + x, y, z: PK.z + z });
    const HIS = stage.HIS;
    step(0, () => {
      armR.visible = false;
      stage.pocket.visible = true; stage.setRoad(1); stage.setSky(1);
      /* the file and the kneeling commander stand at the track's mouth,
         which is straight out of the back of a truck that is still driving
         (found by render: five men on the road behind a moving tonner).
         They are hidden until the tail-gate drops. */
      for (const r of stage.file) r.group.visible = false;
      stage.cmdFilm.group.visible = false;
      stage.tailPivot.rotation.x = 0;
      if (kit) { kit.daylight(DUSK, 0); if (kit.torchOn) kit.torchOn(false); }
      stage.runner.group.visible = false;
    });
    fade(0.0, 0.3, 1, 1);
    /* the beds: the jungle held down under the truck, the dread at a third */
    tr(0, 0.1, () => { duck('junglenight', 0.15); duck('e2dread', 0.35); }, rawK);
    /* 0.8 ON THE TONNER (0.8–17): from the front of the bed looking out the
       back, the section standing either side, the road unrolling behind */
    sfx(0.2, 'tonner', 0.85);
    sfx(13.6, 'tonner', 0.85);
    const CAM_T = P(0, TB.floor + 1.55, -1.9);
    camTo(0.3, 17.0, CAM_T, P(0.05, TB.floor + 1.52, -1.7), smoothK);
    yawTo(0.3, 17.0, Math.PI + 0.05, Math.PI - 0.06, smoothK);       // facing +z: out of the back
    pitchTo(0.3, 17.0, -0.02, 0.02, smoothK);
    fade(0.8, 3.0, 1, 0);
    sfx(1.6, 'n3pro1');                          // "I thought the shower incident was going to be the only strange encounter in my army life. It wasn't."
    sfx(9.6, 'n3pro2');                         // "Months later, I was posted to Infantry... and here we are, on the first night of our outfield exercise..."
    fade(16.2, 17.0, 0, 1);
    /* 17 THE DROP-OFF (17.2–26): the brakes, the tail-gate dropping, the
       file forming at the track's mouth, the commander kneeling with his
       hand up, the last light through the leaves */
    step(17.0, () => { stage.setRoad(0); stage.truck.position.z = 0; for (const r of stage.file) r.group.visible = true; stage.cmdFilm.group.visible = true; });
    sfx(17.1, 'tailgate', 0.9);
    tr(17.2, 17.9, k => { stage.tailPivot.rotation.x = -Math.PI / 2 * k; }, smoothK);
    step(17.2, () => { for (const r of stage.file) if (r.acts) r.play('Idle_6', 1, 0); });
    camTo(17.4, 26.0, P(3.4, 1.55, TZ - 1.2), P(2.9, 1.5, TZ - 0.4), smoothK);
    yawTo(17.4, 26.0, faceFrom(PK.x + 3.4, PK.z + TZ - 1.2, PK.x + 0.4, PK.z + TZ + 5), faceFrom(PK.x + 2.9, PK.z + TZ - 0.4, PK.x + 0.2, PK.z + TZ + 6), smoothK);
    pitchTo(17.4, 26.0, -0.04, -0.02, smoothK);
    fade(17.4, 18.6, 1, 0);
    sfx(19.0, 's3brief');                        // "Single file. Five metres. Nobody talks. We harbour before dark."
    fade(25.2, 26.0, 0, 1);
    /* 26 THE WALK IN (26–34.5): first person at the file's tail, the backs
       ahead going grey, the light draining to night */
    step(26.0, () => {
      if (kit) kit.daylight(NIGHT_TWEEN, 8.0);
      for (const r of stage.file) if (r.acts) r.play('Walking', 1, 0.2);
    });
    tr(26.0, 34.5, k => { stage.setSky(1 - 0.92 * k); }, smoothK);
    sfx(26.2, 'bootsleaf', 0.75);
    sfx(27.0, 'n3pro3');                         // "We walked in as the light went. Dug our scrapes. Then there was nothing to do but wait for morning."
    const WALK = 14;
    tr(26.0, 34.5, k => { for (const r of stage.file) if (r.home) r.group.position.z = r.home.z + WALK * k; }, rawK);
    camTo(26.0, 34.5, P(0, 1.60, TZ + 0.2), P(0, 1.60, TZ + 0.2 + WALK), rawK);
    yawTo(26.0, 34.5, Math.PI + 0.03, Math.PI - 0.03, smoothK);
    pitchTo(26.0, 34.5, -0.03, -0.06, smoothK);
    fade(26.0, 27.2, 1, 0);
    fade(33.6, 34.5, 0, 1);
    /* 34.5 THE HARBOUR (34.5–46.5): the real world at night, from above the
       ring, coming down into his scrape and turning out to the trees */
    step(34.5, () => {
      stage.pocket.visible = false; stage.setRoad(0);
      for (const r of stage.file) if (r.acts) r.play('Idle_6', 1, 0);
      if (kit) kit.daylight(null, 0);
    });
    tr(34.5, 36.5, k => { duck('junglenight', 0.15 + 0.85 * k); duck('e2dread', 0.35 + 0.65 * k); }, rawK);
    camTo(34.5, 44.2, { x: 0.4, y: 3.6, z: 13.5 }, { x: HIS.x, y: 1.62, z: HIS.z }, smoothK);
    yawTo(34.5, 44.2, 0.08, 0.0, smoothK);
    pitchTo(34.5, 44.2, -0.34, -0.02, smoothK);
    fade(34.5, 36.4, 1, 0);
    sfx(36.0, 'n3pro4');                         // "I was at the very rear of my section. Facing away from the others. Looking out into the dark."
    step(44.2, () => { if (kit && kit.torchOn) kit.torchOn(true); });
    sfx(44.2, 'torchclick', 0.7);
    yawTo(44.4, 46.6, 0.0, 0.42, smoothK);
    yawTo(46.6, 48.4, 0.42, -0.12, smoothK);
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
    step(0, () => { handsRoot.visible = false; if (kit && kit.torchOn) kit.torchOn(true); });
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
    step(0, () => { handsRoot.visible = false; });
    yawTo(0, 1.3, s.yawRot, s.yawRot + 0.55, smoothK);
    pitchTo(0, 1.3, s.pitchX, -1.05, smoothK);
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
    step(0, () => { handsRoot.visible = false; });
    yawTo(0, 1.2, s.yawRot, Y_B, smoothK);
    pitchTo(0, 1.2, s.pitchX, -0.06, smoothK);
    sfx(1.4, 'n3C1');                            // "Eh. You feel that?"
    sfx(3.8, 'b3C1');                            // "Feel what?" 2.43 s → 6.2
    sfx(6.5, 'n3C2');                            // "...my leg. Something pressed on it." 2.51 s → 9.0
    sfx(9.4, 'b3C2');                            // "Nothing there. Maybe root. Or you fell asleep sitting." 4.36 s → 13.8
    step(10.5, () => { if (kit) kit.presence(0); });
    sfx(14.2, 'b3C3');                           // "Face the front. I face mine. Relief at four." 4.83 s → 19.0
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
    step(0, () => { handsRoot.visible = false; });
    pitchTo(0, 0.8, s.pitchX, -0.1, smoothK);
    sfx(0.6, 'n3D1');                            // "Who's there?"
    step(2.3, () => { if (kit) kit.presence(0); });
    sfx(3.2, 's3hiss');                          // "TWO. Shut up." 1.88 s → 5.1
    sfx(5.3, 'b3D');                             // "Siao ah?" 1.49 s → 6.8
    /* the undergrowth moving away behind him: the litter patch dragged out
       into the fog, 8 m, never a figure */
    yawTo(5.6, 7.0, s.yawRot, s.yawRot + Math.PI, smoothK);
    pitchTo(5.6, 7.0, -0.1, -0.22, smoothK);
    step(5.8, () => { stage.patch.position.set(P0.x + B.x * 1.2, 0.015, P0.z + B.z * 1.2); stage.patch.scale.setScalar(1); stage.patch.visible = true; });
    sfx(6.1, 'leafdraw', 0.6);
    tr(6.1, 9.6, k => { stage.patch.position.x = P0.x + B.x * (1.2 + 7 * k); stage.patch.position.z = P0.z + B.z * (1.2 + 7 * k); }, k => k * k);
    step(9.6, () => { stage.patch.visible = false; });
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
