/* EPISODE 2 · CHAPTER 4 · THE CYCLIST — v12.1
   Night two. An outfield live range: one firing line, eight lanes, targets
   out in the dark at a hundred, two hundred and three hundred metres, and a
   flare going up every serial to light them. The chapter spends its first
   half teaching one reflex — a shape crossing left to right out there is
   answered with the rifle — and then sends something across that is not a
   target, while the tower says on the radio that there is nobody out there
   at all.

   Chad's flow (docs/V12.0-E2C4-PLAN.md §0, his words): the drill first so
   the game trains you to shoot moving shapes; a shape crosses and everyone
   shouts there is someone there but the radio says nobody is; shoot it and
   it vanishes and returns nearer, three times, then the bell rings; hold
   and it crosses slow and close and turns its head; the decision opens with
   it still coming, on a clock; the other platoon crashes off the line
   shouting the film's own line; ending narration over the tonner at dawn.

   THE RANGE IS COMPRESSED, and the reason is the camera: its far plane is
   160 m (v8.9's law), so a target at a true 300 m is simply clipped away.
   The tower's commands say a hundred, two hundred and three hundred because
   that is what a range officer says; the geometry puts them at 62, 98 and
   132 m, which is inside the far plane and reads at the same angular size a
   real one would through a night sight. Nothing in the game measures it.

   Engine seams: NONE that are new. This is the chapter v12.0's rifle mode
   was built for, plus the kit as it stood at v11.6.                      */
(() => {
  const DATA = {
    id: 4,
    episode: 2,
    title: 'The Ghost Cyclist',
    cardLabel: 'Chapter 4',
    cardTitle: 'The Ghost Cyclist',
    brief: 'The live range, after dark. Eight lanes, live rounds, and a tower that runs everything. You are on lane six. Nobody fires until the tower says fire, and nobody — nobody — goes forward of the line.',
    prompt: 'It is still coming. The tower says the target area is empty, and everyone on the line can see it. Your rifle is loaded. What do you do?',
    choices: [
      { k: 'A', text: 'Keep your arc. Report it. Carry on.',
        d: { sanity: 15, awareness: 21, wisdom: 28 }, verdict: 'best',
        say: 'I kept my lane. I said what I saw, in the proper words, and then I carried on.',
        teach: 'Carry on with your duties, keep your mind clear, stay grounded.' },
      { k: 'B', text: 'Put the torch on it and go closer',
        d: { sanity: -9, awareness: 18, wisdom: -6 }, verdict: 'bad',
        say: 'I went out to look. The ground was empty, and the sound came from behind me.',
        teach: 'Not everything needs to be challenged or investigated.' },
      { k: 'C', text: 'Fire at it until it stops coming',
        d: { sanity: -24, awareness: 6, wisdom: -30 }, verdict: 'worst',
        say: 'I put a whole magazine into it. Every round brought it closer.',
        teach: 'Do not engage, do not provoke, and do not feed your own fear.' },
      { k: 'D', text: 'Get up and run',
        d: { sanity: -21, awareness: -15, wisdom: -24 }, verdict: 'bad',
        say: 'I ran. Five other men ran with me. Nobody looked back down the range.',
        teach: 'Your own experience and somebody else\'s account are two different things.' }
    ],
    core: 'Your own experience and somebody else\'s account are two different things. Not everything needs to be challenged or investigated. Carry on with your duties, keep your mind clear, and stay grounded.',

    /* units metres, y up. The firing line runs along x at z = 0, lanes 1 to
       8 left to right at 2.6 m spacing; HIS is lane six. Downrange is −z.
       The berm stands at z = −2.4 and is a blocker across the whole width,
       so in play there is no way forward of the line at all — which is what
       the safety brief says and what scene B has to break. */
    /* BESIDE the ammo table, not on it: the table is 2.2 x 0.9 at
       (-7.6, 8.6) and `solid()` pads a blocker by 0.14, so its box runs
       x -8.84..-6.36 — a spawn at -6.5 stands INSIDE it, and a blocked
       spawn fills nothing, so every walkable check fails with it
       (v7.9's lesson). -5.6 is 0.76 m clear of the pad. */
    /* v12.3: facing the FIRING POINT, which is the only thing the first
       objective asks for. rot 0 faces -z and the lane zone lies at
       (3.9, 0.35), i.e. 50 degrees off to the right — and the 72-degree lens
       is VERTICAL, so a portrait phone's horizontal half-view is about 21
       degrees: the glowing circle the player is told to walk into was not on
       his screen at the frame play began. atan2(-dx, -dz) puts it dead
       centre (forward is (-sin y, -cos y)). */
    spawn:     { x: -5.6, y: 1.62, z: 8.2, rot: -0.880 },   // beside the ammo point, facing the firing point
    shrine:    { x: 3.9, z: -1.2 },                    // the engine's anchor for HER; unused (ghost: null)
    ghostHome: { x: 3.9, z: -1.2 },
    bounds:    { minX: -13.0, maxX: 17.0, minZ: -2.0, maxZ: 10.5 },

    ghost: null,

    /* NIGHT on open ground: no moon, a colder and emptier sky than the
       jungle's, almost no fog because the whole chapter is about seeing a
       long way. The flare is what light there is, and it is a tween. */
    daylight: {
      stops: [[0.00, '#070910'], [0.30, '#05070c'], [1.00, '#020306']],
      bg: 0x05070c,
      fog: [0x070a10, 0.012],
      hemi: [0x26304a, 0x0a0e12, 0.30],
      key: [0x5a6a8a, 0.06, 10, 20, -6],
      fill: [0x2a3448, 0.05],
      stars: 0.55, moon: 0,
      sun: 0, clouds: 0,
      vmHemi: [0x262f44, 0x0a0c10, 0.34],
      vmKey: [0x8ea3cc, 0.24]
    },

    /* the flare, as a daylight declaration: the whole arc white for its
       seconds. `kit.daylight(FLARE, secs)` tweens to it and back. */
    /* THE TORCH IS THE SCENES' AND NOBODY ELSE'S (v12.2, said properly at
       v12.3). v12.2 tried to say it by declaring an inventory item the
       chapter never issues, so `torchAvail()` would stay false. That was
       wrong for the one player who matters: the BAG CARRIES ACROSS A
       CHAPTER (restart() puts the run's numbers back, never the inventory)
       and chapter 3 forces the torch into the hand slot to be playable at
       all — so anyone arriving here the way the episode is played arrived
       with it equipped, and the torch button, F and the hand swap were all
       live on a live range, which is exactly what Chad said must not
       happen. `player: false` says it outright; `kit.torchOn()` from a
       scene is still ungated (v11.6: "a film owns its light"), which is
       what scene B needs when he walks out with it. */
    torch: { on: false, player: false, angle: 0.36, intensity: 16, distance: 30, penumbra: 0.6,
             red: true, color: 0xff3a22, model: 'flashlight', click: 'torchclick' },

    /* RIFLE MODE (v12.0), and v12.2: THE RIFLE NEVER LEAVES HIS HANDS.
       Chad: "it should immediately start with the rifle equipped in hand, and
       on screen the rifle is already there. Player should not be allowed to
       unequip the rifle. Player should not be able to use the torch, or
       switch to normal hands. Just for this chapter, the rifle stays on at
       all times."

       That is ONE deleted word — `item`. `weaponAvail()` reads
       "const id = weaponDecl.item; if (!id) return true;", so a weapon with
       no inventory id is ALWAYS available: out from the first frame of play,
       nothing in the bag to unequip, and no path back to bare hands, since
       the weapon's own arms replace the hand and the torch whenever it is
       up. No engine change, and episode 1 declares no weapon at all.

       `kick` was 0.016 rad — 0.9 degrees, with no recovery, so it read as
       nothing per shot and as an 18-degree drift up the range over a
       magazine. The real recoil is the chapter's now (`recoil()` below), so
       the engine's is off. */
    /* v13.0 (Chad: "you can remove the reload system, ammo count system,
       those are unnecessary and overcomplicate the shooting mechanics,
       without having any impact on the game, just give the player unlimited
       ammo with no need for reload"). `rounds`/`mags` stay declared because
       the phase string still carries them and a resume still parses them —
       they simply never move, and neither the count nor the reload button is
       drawn. The engine's default is unlimited: false, so the fixture and
       episode 1 are untouched by construction. */
    weapon: { model: 'rifle', unlimited: true, rounds: 20, mags: 2, fireGap: 0.42, kick: 0,
              /* THE KICK, measured against the lens rather than guessed:
                 0.032 rad is 1.8 degrees, which on the 72-degree lens is
                 21 pixels of a 844-tall phone and on the 30-degree aim is
                 51 — a punch you see, and it springs all the way home in a
                 fifth of a second, so the next shot starts from the same
                 sight picture. 0.010 of sideways scatter stops a magazine
                 climbing in a dead straight line. */
              recoil: 0.032, recoilYaw: 0.010, recover: 0.20,
              /* THE CONE. A board is 1.05 x 1.5 m and the nearest bank is
                 62 m out: 11 x 16 pixels on a phone, 5 x 8 at the far bank.
                 1.7 degrees of assist is what turns "aim at the speck" into
                 "aim at the shape". */
              assist: 0.030,
              /* AND THE AIM: 72 degrees down to 30 is 2.4x, which makes the
                 near boards 39 px tall and the far ones 18 — visible. */
              zoom: 30,
              /* v13.1 — THE MUZZLE FLASH (Chad's Sketchfab cone). `flashPos` is
                 the engine's default, which IS this rifle's barrel tip: it
                 was measured off `main_Vector_D_0`'s skinned vertices at the
                 engine's own rest pose, so the number belongs there rather
                 than here. `flashSize` 0.18 m and `flashSecs` 0.07 are the
                 chapter's, bracketed by render on the night range. */
              flash: 'muzzle', flashSize: 0.18, flashSecs: 0.07,
              shot: 'rifleshot', reload: 'riflereload', empty: 'rifledry', cock: 'riflecock' },

    assets: ['fboaim', 'fbosling', 'ghostcyclist', 'rifle', 'flashlight', 'kamaz',
             'muzzle', 'ammocrate', 'ammomags',
             'tree1', 'tree2', 'tree3', 'tree4'],

    musicVol: 0,
    ambience: { beds: [['rangeamb', 0.36], ['e2dread', 1.0], ['flarehiss', 0], ['moverrail', 0], ['chain', 0]] },

    words: {
      approach: 'the target area',
      /* v12.2: these said "raise your rifle", which was true when play
         opened on empty hands and is a lie now that it is already up —
         photographed at the spawn, the boot hint read "Left thumb walks ·
         right thumb looks · Tap to raise your rifle" over a rifle that was
         plainly in shot. `act`/`actTouch` are the boot hint; `interact` is
         the badge on the decision object, which only appears in `decide`. */
      act: 'E to act',
      actTouch: 'Tap to act',
      interact: 'E to answer it',
      interactTouch: 'Tap to answer it',
      /* v12.3: an OBSERVATION, not an order. The drain starts in the stag,
         where the objective correctly says to wait on the line and there is
         nothing on the range to act on — a banner telling the player to act
         while the HUD above it tells him to wait is the v8.7 lie in its
         third direction. What is true at every moment this banner is up is
         that something is out there. */
      presence: 'Something is out there. Sanity level dropping.',
      objLine: 'Move to lane six',
      objLoad: 'Load on the order',
      objHold: 'On the line. Do NOT fire until the tower gives the order.',
      objS1: 'Static target, 100 metres. Fire on the order · {n}/3',
      /* v13.0: `objS2` (the pop-up serial) went with the serial — item 19.
         objS3 keeps its key so the mover's words are the words it has always
         had and Chad's sheet edits to it are not silently dropped. */
      objS3: 'Moving target, 200 metres · {n}/2',
      objCease: 'Cease fire. Stand fast.',
      objStag: 'Wait on the line. Weapons loaded.',
      objConfuse: 'Hold it in your sight. Do not fire.',
      objMoment: 'It is in the target area. Hold your sight on it, or decide.',
      hotRadio: 'E to key the radio',
      hotRadioTouch: 'Tap to key the radio',
      hotTrack: 'Keep it in your sight',
      loadBrief: 'LOAD ON THE ORDER',
      /* v13.0 (Chad: "the instructions in text can also be shorter") — 240
         characters to 122, because the picture above it now says most of it */
      loadBody: 'Magazine on. Cock. Safety catch on. TAP (or SPACE) as each bar reaches the band. Early counts against you.',
      loadGo: 'READY'
    },
    sayPrefix: 'n4'
  };

  /* the MEASURED length of every line the chapter says outside a cutscene
     (ffprobe on the shipped mp3, masters/v12.1/secs.json) — `sayLine`
     states its one-voice-at-a-time window in these, so a re-generated
     take that got longer cannot make two voices talk over each other */
  const SECS = {
    t4load: 5.80, t4ready: 2.59, t4fire1: 2.77, t4fire2: 4.60, t4fire3: 4.44,
    t4cease: 5.33, t4who: 5.25, t4neg: 6.43, t4roger: 4.05, t4endex: 5.33,
    t4man: 5.88, e4wait: 5.88, e4down: 3.79, e4line: 3.08, b4stag: 3.13,
    b4there: 2.35, b4float: 2.85, k4shout: 4.02, r4run: 3.47, n4pro1: 5.72,
    n4pro2: 6.53, n4report: 6.03, n4notarget: 1.80, n4back: 1.96, n4dawn: 9.48
  };

  /* the flare's light, as a daylight tween: the arc goes white and the sky
     with it, and it falls back over its own burn */
  const FLARE = {
    stops: [[0.00, '#2a3242'], [0.35, '#3a4152'], [1.00, '#10141c']],
    bg: 0x2a3242,
    /* v12.3: the flare lights the range and must NEVER thicken it. This
       declared 0.016 against the night's 0.012, so `applyDaylight` tweened
       the fog UP for exactly the seconds the boards are meant to be visible:
       at the pop-up bank the FogExp2 fraction went 74.9 % to 91.4 %, and at
       the far bank 91.9 % to 98.8 %. The light arrived and the air closed
       with it. At 0.009 the flare thins the air, which is what a flare
       looks like. */
    fog: [0x2a3038, 0.009],
    hemi: [0xbfd0e8, 0x2a3040, 1.15],
    key: [0xfff0d8, 0.85, 0, 40, -60],
    fill: [0x8a9ac0, 0.35],
    stars: 0.12, moon: 0,
    sun: 0, clouds: 0,
    vmHemi: [0xbfd0e8, 0x2a3040, 0.95],
    vmKey: [0xfff0d8, 0.75]
  };

  const hash = (i, s) => { const x = Math.sin(i * 127.1 + s * 311.7) * 43758.5453; return x - Math.floor(x); };
  const LANE = (n) => (n - 4.5) * 2.6;          // lane 1 .. 8, left to right

  function build(ctx) {
    const { THREE, GLTFLoader, cloneSkinned, scene, camera, yaw, pitch, LOW, kit, plantTrees,
            assetBytes, rescueTextures, cnv, getState, startDecision, worldSfx, warmSounds, HEAD_RE } = ctx;

    const world = new THREE.Group(); scene.add(world);
    const owned = [], madeTex = [], rigs = [], solids = [], boxes = [];
    let alive = true, S = null;

    const nfm = (o) => new THREE.MeshStandardMaterial(Object.assign({}, o));
    const box = (w, h, d, x, y, z, mat, parent = world) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
      m.position.set(x, y, z); m.castShadow = !LOW; m.receiveShadow = true;
      parent.add(m); return m;
    };

    const HIS = { x: LANE(6), z: 0 };              // his lane
    const BUD = { x: LANE(5), z: 0 };              // the buddy, lane five
    /* v13.0 (Chad: "You can also place the encik at the table with the live
       rounds"): the safety officer stands at the AMMO POINT, which is where a
       range's safety officer actually stands and what the film's second shot
       has claimed since v12.1 — it said "the safety officer beside it" while
       he was eleven metres away behind the firing line. The −x end of the
       table, so his blocker column is 3.5 m clear of the spawn. */
    const SAFETY = { x: -9.15, z: 8.75 };         // the safety officer at the ammo point
    const TOWER = { x: 14.2, z: 4.6 };
    const AMMO = { x: -7.6, z: 8.6 };
    const AMMO_TOP = 0.82;                        // the ammo table's own surface
    /* v13.1: build() scope, NOT the block below — a variable declared inside
       a block and read from a GLTF callback outside it throws a
       ReferenceError the loader's own catch then swallows whole, which is
       exactly how v8.4 shipped six men as green capsules (v8.5's law). */
    let ammoOld = null;                           // the primitives Chad's two models supersede
    const PILE_POS = new THREE.Vector3(HIS.x, 1.0, -1.35);   // the target area, straight out of his lane
    const INTERACT_R = 2.6;
    const RANGE = { s1: -62, s2: -98, s3: -132 };            // the compressed hundred, two hundred, three hundred

    /* ------------------------------------------------------------ the ground
       Bare laterite and lalang, mown flat on the firing point and rough out
       along the arc. One big plane with a painted tile — the arc has to read
       as an open strip a long way out, and a texture does that where a
       hundred meshes would not. */
    const gTex = (() => {
      const [c, g] = cnv(256);
      g.fillStyle = '#3a3628'; g.fillRect(0, 0, 256, 256);
      for (let i = 0; i < 2600; i++) {
        const x = Math.random() * 256, y = Math.random() * 256, r = 0.6 + Math.random() * 2.2;
        const v = Math.random();
        g.fillStyle = v < 0.45 ? 'rgba(74,68,48,0.55)' : v < 0.8 ? 'rgba(30,30,22,0.5)' : 'rgba(96,92,64,0.35)';
        g.beginPath(); g.arc(x, y, r, 0, 7); g.fill();
      }
      const t = new THREE.CanvasTexture(c);
      t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(24, 48); t.anisotropy = 4;
      madeTex.push(t); return t;
    })();
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(320, 340), nfm({ map: gTex, color: 0x9a9a92, roughness: 1 }));
    ground.rotation.x = -Math.PI / 2; ground.position.set(2, 0, -75); ground.receiveShadow = true; world.add(ground);

    /* the berm: the low mound the line fires over, and the one thing that
       makes "forward of the line" impossible in play */
    const matEarth = nfm({ color: 0x4a4436, roughness: 1 });
    const berm = box(46, 0.9, 1.6, 2, 0.45, -2.4, matEarth); solids.push(berm);
    for (let i = 0; i < 24; i++) {                       // sandbags along its top
      const b = box(0.52, 0.2, 0.3, -9.5 + i * 1.0, 0.98, -2.42, nfm({ color: 0x5a5344, roughness: 1 }));
      b.rotation.y = (hash(i, 3) - 0.5) * 0.3;
    }

    /* --------------------------------------------------------- the lanes */
    const matPost = nfm({ color: 0x3c3a30, roughness: 0.95 });
    const matPaint = nfm({ color: 0xd8d2bc, roughness: 0.9, emissive: 0x2a2620, emissiveIntensity: 0.4 });
    const lanes = [];
    for (let n = 1; n <= 8; n++) {
      const x = LANE(n);
      const marker = box(0.1, 1.05, 0.1, x - 1.05, 0.52, -0.2, matPost);
      const plate = box(0.34, 0.24, 0.03, x - 1.05, 1.16, -0.2, matPaint);
      /* the number, painted */
      const [c, g] = cnv(64);
      g.fillStyle = '#d8d2bc'; g.fillRect(0, 0, 64, 64);
      g.fillStyle = '#1a1a16'; g.font = 'bold 44px system-ui'; g.textAlign = 'center'; g.textBaseline = 'middle';
      g.fillText(String(n), 32, 35);
      const t = new THREE.CanvasTexture(c); madeTex.push(t);
      plate.material = nfm({ map: t, roughness: 0.9, emissive: 0x151412, emissiveIntensity: 0.5 });
      /* the firing point itself: a mat and a sandbag rest */
      const mat = box(1.9, 0.04, 1.6, x, 0.02, 0.35, nfm({ color: 0x2e3228, roughness: 1 }));
      const rest = box(1.0, 0.24, 0.42, x, 0.12, -0.55, nfm({ color: 0x5a5344, roughness: 1 }));
      lanes.push({ n, x, marker, plate, mat, rest });
    }

    /* --------------------------------------------------------- the targets
       A Figure 11 is a printed man on a board. It is DRAWN (no download),
       one texture shared by every target, and the boards are planes on
       posts — at sixty metres and beyond nothing else would read. */
    const figTex = (() => {
      const [c, g] = cnv(128);
      g.fillStyle = '#6e7256'; g.fillRect(0, 0, 128, 128);
      g.translate(16, 0);                                  // the man drawn in a 96-wide column of a 128 square
      g.fillStyle = '#23251c';
      g.beginPath(); g.ellipse(48, 30, 15, 18, 0, 0, 7); g.fill();               // head and helmet
      g.fillRect(30, 46, 36, 50);                                                 // chest
      g.beginPath(); g.moveTo(30, 48); g.lineTo(14, 84); g.lineTo(24, 88); g.lineTo(38, 58); g.fill();
      g.beginPath(); g.moveTo(66, 48); g.lineTo(82, 84); g.lineTo(72, 88); g.lineTo(58, 58); g.fill();
      g.fillStyle = 'rgba(255,255,255,0.10)'; g.fillRect(0, 96, 96, 32);
      const t = new THREE.CanvasTexture(c); madeTex.push(t); return t;
    })();
    /* a faint self-light on the boards: the range between flares is very
       dark and an olive board at a hundred metres was a black rectangle on
       black tarmac. A real target area is lit; this is the cheap version of
       lit, and it costs no light and no shadow pass. */
    const matFig = nfm({ map: figTex, roughness: 1, side: THREE.DoubleSide,
                         emissive: 0x6e7256, emissiveIntensity: 0.48 });
    /* v12.3, Chad: "make all targets bigger, its quite hard to aim them."
       He is right, and the arithmetic says how much. A Figure 11 is 1.05 x
       1.5 m, and this lens is 72 degrees VERTICAL: on a 390 x 844 phone a
       board 1.5 m tall subtends 844 * 1.5 / (2 * tan(36) * d) pixels — 14 px
       at 62 m, 9 at 98, 7 at 132. Under AIM's 30-degree lens that is 34 / 21
       / 16. A thumb cannot aim at nine pixels.
       So the board is scaled, and by DISTANCE rather than by a flat number,
       because a flat multiplier leaves the far bank exactly as unreadable as
       it was relative to the near one. `BOARD_K` is the base and the rest is
       d / 62, so every bank subtends the same angle and all three read alike:
       25 px on a phone at rest, 60 in AIM. It costs nothing in believability
       because there is not one object in the target area to judge a size
       against — the whole range is compressed already (the tower still calls
       them a hundred, two hundred and three hundred metres).
       The board's own y is half its height, so its bottom stays exactly on
       the pivot and the drop still folds it flat to the ground. */
    const BOARD_K = 1.8, BOARD_W = 1.05, BOARD_H = 1.5;
    function mkTarget(x, z, opts = {}) {
      const g = new THREE.Group(); g.position.set(x, 0, z); world.add(g);
      const k = BOARD_K * Math.max(1, Math.abs(z) / Math.abs(RANGE.s1));
      const w = BOARD_W * k, h = BOARD_H * k;
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.08 * k, 0.7, 0.08 * k), matPost);
      post.position.y = 0.35; g.add(post);
      const pivot = new THREE.Group(); pivot.position.y = 0.66; g.add(pivot);
      const board = new THREE.Mesh(new THREE.PlaneGeometry(w, h), matFig);
      board.position.y = h / 2; pivot.add(board);
      const T = { group: g, pivot, board, x, z, w, h, down: false, hit: false, kind: opts.kind || 'static' };
      T.set = (down) => { T.down = down; pivot.rotation.x = down ? -Math.PI / 2 : 0; };
      if (opts.down) T.set(true);
      return T;
    }
    /* v13.0 (item 17): EVERY bank is built DOWN. "All targets should be down,
       until the wave starts" holds from the chapter's first frame, not only
       between waves — the film opens on an arc with nothing standing in it,
       and so does play. `far` is scenery at 132 m and has always been down. */
    const statics = [4, 5, 6].map(n => mkTarget(LANE(n), RANGE.s1, { kind: 'static', down: true }));
    const popups  = [5, 6, 7].map(n => mkTarget(LANE(n), RANGE.s2, { kind: 'pop', down: true }));
    const far     = [3, 6].map(n => mkTarget(LANE(n), RANGE.s3, { kind: 'far', down: true }));

    /* the mover: a Figure 11 on a trolley that runs a rail across the arc */
    const rail = box(26, 0.06, 0.12, HIS.x, 0.07, RANGE.s2 + 3.0, nfm({ color: 0x2a2a26, roughness: 0.9 }));
    const mover = mkTarget(HIS.x - 12, RANGE.s2 + 3.0, { kind: 'mover', down: true });
    mover.group.position.y = 0.16;
    const MOVER = { x0: HIS.x - 12.5, x1: HIS.x + 12.5, t: 0, on: false, dir: 1 };

    /* --------------------------------------------------- behind the line */
    const matSteel = nfm({ color: 0x4a4e4a, roughness: 0.7, metalness: 0.2 });
    /* THE TOWER. v13.0, Chad: "the watch tower looks incomplete, can you make
       it look like a proper watch tower?" It was four legs, a deck, two rails
       and a horn — a table on stilts. A range control tower has a ROOF over
       the man in it, a LADDER he got up by, a kick plate so nothing rolls off
       the deck, a red obstruction light, the range's own red flag, and a MAN.
       All primitives; the only download is the soldier, and he is `fbosling`,
       which the chapter already parses for the safety officer. */
    const TOWER_DECK = 3.26;                     // the deck's top surface
    {
      const g = new THREE.Group(); g.position.set(TOWER.x, 0, TOWER.z); world.add(g);
      for (const [dx, dz] of [[-1.1, -1.1], [1.1, -1.1], [-1.1, 1.1], [1.1, 1.1]])
        { const l = new THREE.Mesh(new THREE.BoxGeometry(0.14, 3.2, 0.14), matSteel); l.position.set(dx, 1.6, dz); g.add(l); }
      /* cross-bracing on the two sides a player can see from the line */
      for (const dz of [-1.1, 1.1]) for (const sgn of [-1, 1]) {
        const br = new THREE.Mesh(new THREE.BoxGeometry(2.24, 0.07, 0.06), matSteel);
        br.position.set(0, 1.6, dz); br.rotation.z = sgn * 0.96; g.add(br);
      }
      const deck = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.12, 2.8), matSteel); deck.position.y = 3.2; g.add(deck);
      /* a kick plate all the way round, and the rail above it */
      for (const [dx, dz, w, d] of [[0, -1.38, 2.8, 0.05], [0, 1.38, 2.8, 0.05], [-1.38, 0, 0.05, 2.8], [1.38, 0, 0.05, 2.8]]) {
        const kp = new THREE.Mesh(new THREE.BoxGeometry(w, 0.34, d), nfm({ color: 0x40453e, roughness: 0.9 }));
        kp.position.set(dx, TOWER_DECK + 0.17, dz); g.add(kp);
      }
      for (const [dx, dz, w, d] of [[0, -1.35, 2.8, 0.08], [0, 1.35, 2.8, 0.08], [-1.35, 0, 0.08, 2.8], [1.35, 0, 0.08, 2.8]])
        { const r = new THREE.Mesh(new THREE.BoxGeometry(w, 0.07, d), matSteel); r.position.set(dx, 4.2, dz); g.add(r); }
      /* four corner posts and a roof with a small overhang */
      for (const [dx, dz] of [[-1.3, -1.3], [1.3, -1.3], [-1.3, 1.3], [1.3, 1.3]])
        { const p2 = new THREE.Mesh(new THREE.BoxGeometry(0.09, 2.0, 0.09), matSteel); p2.position.set(dx, TOWER_DECK + 1.0, dz); g.add(p2); }
      const roof = new THREE.Mesh(new THREE.BoxGeometry(3.15, 0.10, 3.15), nfm({ color: 0x4e534a, roughness: 0.92 }));
      roof.position.y = TOWER_DECK + 2.05; g.add(roof);
      const cap = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.09, 2.4), nfm({ color: 0x585d52, roughness: 0.92 }));
      cap.position.y = TOWER_DECK + 2.14; g.add(cap);
      /* the ladder, up the +z face, where the line cannot see through it */
      for (const dx of [-0.24, 0.24]) {
        const st = new THREE.Mesh(new THREE.BoxGeometry(0.05, 3.42, 0.05), matSteel);
        st.position.set(dx, 1.71, 1.52); g.add(st);
      }
      for (let i = 0; i < 10; i++) {
        const r = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.035, 0.035), matSteel);
        r.position.set(0, 0.28 + i * 0.33, 1.52); g.add(r);
      }
      const horn = new THREE.Mesh(new THREE.ConeGeometry(0.26, 0.42, 8, 1, true), nfm({ color: 0x5a5a52, roughness: 0.8, side: THREE.DoubleSide }));
      horn.position.set(-1.0, 4.0, -1.4); horn.rotation.x = Math.PI / 2 + 0.25; g.add(horn);
      /* the red obstruction light on the roof, and the range's red flag */
      const obs = new THREE.Mesh(new THREE.SphereGeometry(0.075, 8, 6),
        nfm({ color: 0xff3b22, emissive: 0xff2a10, emissiveIntensity: 2.6 }));
      obs.position.set(0, TOWER_DECK + 2.26, 0); g.add(obs);
      const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.034, 1.5, 6), matSteel);
      mast.position.set(1.34, TOWER_DECK + 2.9, -1.34); g.add(mast);
      const flag = new THREE.Mesh(new THREE.PlaneGeometry(0.62, 0.40),
        nfm({ color: 0xc41f14, roughness: 0.95, side: THREE.DoubleSide, emissive: 0x3a0603, emissiveIntensity: 0.8 }));
      flag.position.set(1.34 + 0.31, TOWER_DECK + 3.42, -1.34); g.add(flag);
      const lamp = new THREE.PointLight(0xffd0a0, 1.1, 9, 1.8); lamp.position.set(0, 3.6, 0); g.add(lamp);
      const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 6), nfm({ color: 0xffe0b0, emissive: 0xffc890, emissiveIntensity: 2.2 }));
      bulb.position.set(0, 3.55, 0); g.add(bulb);
      boxes.push(new THREE.Box3(new THREE.Vector3(TOWER.x - 1.4, 0, TOWER.z - 1.4), new THREE.Vector3(TOWER.x + 1.4, 3.4, TOWER.z + 1.4)));
    }
    /* THE AMMO POINT: a table, and on it the thing the chapter is about.
       v13.0, Chad: "the props of the live rounds dont look like anything like
       it." They were four olive boxes 46 cm long — at the film's one-metre
       shot that is four bricks. What a man actually sees on an ammo table is
       BRASS: loose rounds standing in a tray, magazines beside them, and the
       steel boxes they came out of. The rounds are near their real size
       (5.56 x 45 is 5.7 mm across and 57 mm long; these are 9 mm by 48, a
       shade fat so they still read on a phone), brass, metallic and lit by
       the red lamp that is already there — the one light in the shot. */
    {
      const t = box(2.2, 0.08, 0.9, AMMO.x, 0.78, AMMO.z, nfm({ color: 0x534e3e, roughness: 0.95 }));
      solids.push(t);
      for (const [dx, dz] of [[-1.0, -0.38], [1.0, -0.38], [-1.0, 0.38], [1.0, 0.38]])
        box(0.07, 0.78, 0.07, AMMO.x + dx, 0.39, AMMO.z + dz, matSteel);
      const TOP = AMMO_TOP;
      /* v13.1: everything the two Sketchfab models supersede goes in ONE
         group, so the swap is a single flag rather than a list of meshes
         somebody has to keep in step (the v9.1/v9.2 `supersede` lesson,
         where the posts and rails were missed twice). The table, its legs
         and the red lamp are NOT in here — they are not superseded. */
      ammoOld = new THREE.Group(); world.add(ammoOld);
      const matBrass = nfm({ color: 0xb08a3c, roughness: 0.32, metalness: 0.85 });
      const matLead  = nfm({ color: 0x8a6a46, roughness: 0.55, metalness: 0.3 });
      const matMag   = nfm({ color: 0x24261f, roughness: 0.82, metalness: 0.15 });
      const matCan   = nfm({ color: 0x3c4434, roughness: 0.94 });
      const matCanLid = nfm({ color: 0x323a2c, roughness: 0.94 });
      const matTray  = nfm({ color: 0x5c5f55, roughness: 0.7, metalness: 0.25 });

      /* two steel ammo boxes at the far end, lids up, with a handle each */
      for (const dx of [-0.82, -0.44]) {
        box(0.32, 0.17, 0.20, AMMO.x + dx, TOP + 0.085, AMMO.z - 0.16, matCan, ammoOld);
        box(0.33, 0.025, 0.21, AMMO.x + dx, TOP + 0.182, AMMO.z - 0.16, matCanLid, ammoOld);
        const h = new THREE.Mesh(new THREE.TorusGeometry(0.045, 0.008, 5, 10), matSteel);
        h.position.set(AMMO.x + dx, TOP + 0.205, AMMO.z - 0.16); h.rotation.y = Math.PI / 2; ammoOld.add(h);
        box(0.20, 0.012, 0.012, AMMO.x + dx, TOP + 0.13, AMMO.z - 0.262, nfm({ color: 0xb9b199, roughness: 1 }), ammoOld);   // the stencil
      }

      /* THE ROUNDS: a shallow open tray with six by three standing in it */
      box(0.30, 0.012, 0.19, AMMO.x + 0.08, TOP + 0.006, AMMO.z + 0.02, matTray, ammoOld);
      for (const [ddx, ddz, w, d] of [[0, -0.095, 0.30, 0.012], [0, 0.095, 0.30, 0.012],
                                      [-0.15, 0, 0.012, 0.19], [0.15, 0, 0.012, 0.19]])
        box(w, 0.036, d, AMMO.x + 0.08 + ddx, TOP + 0.024, AMMO.z + 0.02 + ddz, matTray, ammoOld);
      const caseGeo = new THREE.CylinderGeometry(0.0045, 0.0048, 0.040, 7);
      const tipGeo  = new THREE.ConeGeometry(0.0045, 0.013, 7);
      for (let i = 0; i < 18; i++) {
        const cx = AMMO.x + 0.08 + (-0.115 + (i % 6) * 0.046);
        const cz = AMMO.z + 0.02 + (-0.055 + Math.floor(i / 6) * 0.055);
        const c = new THREE.Mesh(caseGeo, matBrass); c.position.set(cx, TOP + 0.026, cz); ammoOld.add(c);
        const tp = new THREE.Mesh(tipGeo, matLead);  tp.position.set(cx, TOP + 0.0525, cz); ammoOld.add(tp);
      }
      /* four rounds lying loose beside the tray, because nobody's table is tidy */
      for (let i = 0; i < 4; i++) {
        const cx = AMMO.x + 0.42 + i * 0.026, cz = AMMO.z + 0.19 - i * 0.012;
        const c = new THREE.Mesh(caseGeo, matBrass);
        c.position.set(cx, TOP + 0.0048, cz); c.rotation.z = Math.PI / 2; c.rotation.y = 0.2 + i * 0.13; ammoOld.add(c);
      }

      /* MAGAZINES: four standing in a row at the near end, slightly tapered */
      for (let i = 0; i < 4; i++) {
        const mx = AMMO.x + 0.66 + i * 0.05;
        const m = new THREE.Mesh(new THREE.BoxGeometry(0.030, 0.185, 0.072), matMag);
        m.position.set(mx, TOP + 0.093, AMMO.z - 0.10); m.rotation.z = 0.05 - i * 0.02; ammoOld.add(m);
        box(0.032, 0.014, 0.074, mx, TOP + 0.190, AMMO.z - 0.10, matSteel, ammoOld);   // the feed lips
      }
      const lamp = new THREE.PointLight(0xff5530, 0.9, 7, 1.9); lamp.position.set(AMMO.x, 1.7, AMMO.z); world.add(lamp); owned.push(lamp);
    }

    /* --------------------------------------------------------- the trees
       Either side of the arc and behind the line, and NEVER in the strip:
       the whole chapter is a long look down an open lane. */
    const TREE_AT = [];
    for (let i = 0; i < 64; i++) {
      const side = i % 2 ? 1 : -1;
      const x = side * (17 + hash(i, 11) * 16);
      const z = 9 - hash(i, 17) * 120;
      TREE_AT.push([x, z, 6.5 + hash(i, 23) * 5]);
    }
    for (let i = 0; i < 14; i++) TREE_AT.push([-16 + hash(i, 31) * 34, 12 + hash(i, 37) * 10, 6 + hash(i, 41) * 4]);
    const treeStand = plantTrees ? plantTrees(world, TREE_AT.map(([x, z, h]) => ({ x, z, h })),
      { seed: 41, tint: new THREE.Color(0.66, 0.78, 0.66), roughness: 0.97, lowKeep: 0.55 }) : null;
    const treeBlockers = TREE_AT.filter(([x, z]) => x > DATA.bounds.minX - 1 && x < DATA.bounds.maxX + 1 && z > DATA.bounds.minZ - 1 && z < DATA.bounds.maxZ + 1)
      .map(([x, z]) => new THREE.Box3(new THREE.Vector3(x - 0.42, 0, z - 0.42), new THREE.Vector3(x + 0.42, 2.5, z + 0.42)));

    /* --------------------------------------------------------- the lights */
    /* the flare: one moving light high over the arc, its own object, so the
       shadows on the target boards swing as it drifts. The sky goes with it
       through kit.daylight — this is only the hot spot under it. */
    const flare = new THREE.PointLight(0xfff0d0, 0, 190, 1.35);
    flare.position.set(HIS.x, 48, -70); world.add(flare); owned.push(flare);
    const flareBall = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 6),
      nfm({ color: 0xfff6e0, emissive: 0xfff0c0, emissiveIntensity: 3, transparent: true, opacity: 0 }));
    flareBall.position.copy(flare.position); world.add(flareBall);
    const lineFill = new THREE.PointLight(0x30405a, 0.5, 26, 1.6); lineFill.position.set(HIS.x - 2, 4, 3); world.add(lineFill); owned.push(lineFill);

    /* ------------------------------------------------------------ the cast */
    /* only the safety officer is skinned now, so this is his sphere alone
       (v8.4: a SkinnedMesh keeps its own, computed once from whatever pose
       the file loads in, so a rig that raises its arms pops out of frame) */
    const CULL_SPHERE = { fbosling: { x: 0.056, y: 0.837, z: 0.212, r: 1.439 } };
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

    function mkRig(key, opts) {
      const group = new THREE.Group();
      group.position.set(opts.x, 0, opts.z); group.rotation.y = opts.ry || 0;
      (opts.parent || world).add(group);
      const proxy = new THREE.Mesh(new THREE.CapsuleGeometry(0.2, opts.height - 0.4, 4, 8), matProxy);
      proxy.position.y = opts.height / 2; proxy.castShadow = !LOW; group.add(proxy);
      if (opts.noProxy) proxy.visible = false;
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
        } else if (fade > 0) { nx.paused = false; nx.fadeIn(fade).play(); if (old) old.fadeOut(fade); }
        else { nx.paused = false; nx.play(); for (const a of Object.values(rig.acts)) if (a !== nx) a.stop(); rig.mixer.update(0.0001); }
        rig.cur = name;
        return true;
      };
      loadGltf(key).then(gltf => {
        if (!alive) return;
        const g = cloneSkinned(gltf.scene);
        g.traverse(o => { if (o.isMesh) { o.castShadow = !LOW; o.receiveShadow = false; } });
        wideBounds(g, key);
        group.add(g); rig.model = g;
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
          for (const c of gltf.animations) rig.acts[c.name] = rig.mixer.clipAction(c);
          rigs.push(rig);
        }
        proxy.visible = false;
        rig.ready = true;
        if (opts.onReady) opts.onReady(rig);
        if (rig.idle) rig.play(rig.idle, opts.rate || 1, 0);
        if (opts.pose) rig.play(opts.pose, 1, 0, false, opts.at ?? 0.12);
      }).catch(() => { rig.ready = true; });
      return rig;
    }

    /* ------------------------------------------- v13.1 THE AMMO POINT, REAL
       Chad: "Also use a mix of these 2 models, one is ammo crate, one is a
       bunch of magazines and bullets."

       Both arrive from `tools/prepammo.mjs` in REAL METRES with their origin
       on the base centre, so every number here is a place on the table and
       nothing is a scale factor: the crate is 0.620 long x 0.365 deep x
       0.167 high and the magazine pair 0.353 x 0.150 x 0.112, both measured
       off the shipped files. The crate's length is on its own Z, so a
       quarter turn lays it along the table's long axis — a NODE rotation,
       which quantization permits where a write to the vertices would not
       (the v9.0 law, used the other way round).

       TWO CRATES, STACKED, because that is what an ammo point looks like and
       because the top one's lid carries the model's own loose rounds where
       the film's second shot can see them. The upper is skewed 0.09 rad:
       nobody stacks a crate square.

       The primitives they supersede are HIDDEN, never removed (v9.0) — and
       hidden as ONE GROUP rather than as a list of meshes, because the list
       is what v9.1 and v9.2 each missed a piece of. They also stay standing
       until the bytes actually land, so a failed download costs a nicer prop
       and never the chapter (v4.7). */
    {
      const CRATE_H = 0.167;                      // the shipped crate's own height
      const placeAmmo = (key, x, y, z, ry) => loadGltf(key).then(gltf => {
        if (!alive) return null;
        const g = gltf.scene.clone(true);
        g.traverse(o => { if (o.isMesh) { o.castShadow = !LOW; o.receiveShadow = true; o.frustumCulled = true; } });
        g.position.set(x, y, z); g.rotation.y = ry;
        world.add(g);
        return g;
      });
      Promise.all([
        /* the two crates, at the -x end where the steel boxes stood */
        placeAmmo('ammocrate', AMMO.x - 0.62, AMMO_TOP, AMMO.z - 0.08, Math.PI / 2),
        placeAmmo('ammocrate', AMMO.x - 0.58, AMMO_TOP + CRATE_H, AMMO.z - 0.06, Math.PI / 2 + 0.09),
        /* and two sets of magazines along the near half, where a man draws
           them: 0.353 m long on their own x, so a small turn each keeps them
           inside the table's 2.2 x 0.9 and off each other */
        placeAmmo('ammomags', AMMO.x + 0.28, AMMO_TOP, AMMO.z + 0.02, 0.16),
        placeAmmo('ammomags', AMMO.x + 0.70, AMMO_TOP, AMMO.z - 0.12, -0.42),
      ]).then(g => {
        /* only once EVERY piece is standing — a half-dressed table with the
           primitives already gone is worse than either state */
        if (alive && g.every(Boolean) && ammoOld) ammoOld.visible = false;
      }).catch(e => console.error('ammo point models failed', e));
    }

    /* ------------------------------------------------------- THE FIRING LINE
       v12.2, Chad: "i thought i previously provided a static standing soldier
       who is in an aiming pose with rifle pointing outwards? All the shooters
       should use this model."

       He did, at v7.0, and docs/E2-SOLDIER-MODELS.md §107 specified it as
       `fboaim` and cast it at exactly this position — "the only figures in the
       set that show a shouldered weapon; on a firing line nobody moves, so a
       statue is not a compromise, it is correct." It was never prepped, so
       v12.1 dressed the line with `fbosling` and `admintee`: men standing
       about on a live range with their rifles slung, which is the one thing a
       range never looks like. `tools/prepaim.mjs` ships it now.

       It has NO RIG and NO CLIPS, and nothing on this line ever needed one —
       not one scene drove `buddy`, `safety` or `detail`, so the six of them
       have been standing still since v12.1 anyway, just in the wrong pose.
       Being static also makes them nearly free: one parse, seven clones that
       SHARE the geometry and the material.

       The prep's contract is what makes the placement trivial: boots on
       y = 0, the origin under the BODY (never under the box — a rifle held
       out in front pushes the bounding box a quarter of a metre downrange and
       a line is spaced by shoulders), and the RIFLE AIMING DOWN -Z, which is
       where the targets are, so every man is placed at ry = 0.

       Seven of them, one per lane except his own: the line is full now where
       it used to stop at lane four. Height, yaw and depth are dealt from the
       chapter's own stream so the row is not a photocopy — at night, with one
       model, that is the whole of the variation available and it is enough. */
    const AIM_H = 1.900;                       // the prepped model's own height, measured
    const aimKit = { geo: null };
    function mkAim(x, z, opts = {}) {
      const height = opts.height || 1.74;
      const group = new THREE.Group();
      group.position.set(x, 0, z); group.rotation.y = opts.ry || 0;
      world.add(group);
      const proxy = new THREE.Mesh(new THREE.CapsuleGeometry(0.2, height - 0.4, 4, 8), matProxy);
      proxy.position.y = height / 2; proxy.castShadow = !LOW; group.add(proxy);
      const man = { group, proxy, model: null, ready: false, height };
      loadGltf('fboaim').then(gltf => {
        if (!alive) return;
        /* a plain clone: with no skin, three.js shares the geometry and the
           material across every copy, which is the whole reason seven men on
           the line cost one man's memory */
        const g = gltf.scene.clone(true);
        g.traverse(o => { if (o.isMesh) { o.castShadow = !LOW; o.receiveShadow = false; o.frustumCulled = true; } });
        g.scale.setScalar(height / AIM_H);     // boots stay on y = 0: the prep grounded him
        group.add(g); man.model = g;
        proxy.visible = false; man.ready = true;
      }).catch(() => { man.ready = true; });
      return man;
    }

    /* every lane but his own, and lane five is the buddy who speaks */
    const LINE_LANES = [1, 2, 3, 4, 5, 7, 8];
    const lineMen = LINE_LANES.map((n, i) => mkAim(
      LANE(n), 0.20 + (hash(i, 19) - 0.5) * 0.16,
      { ry: (hash(i, 23) - 0.5) * 0.05, height: 1.70 + hash(i, 7) * 0.08 }));
    const buddy = lineMen[4];                  // lane five, the man who talks in the stag
    /* the safety officer keeps a RIG: he is the only man behind the line and
       the only one not shooting, so a slung rifle and a breathing idle are
       right on him and wrong on everybody else */
    /* ry = pi/2 faces +x (a Mixamo rig at 0 faces +z), so he looks along the
       table at whoever is drawing from it; 0.85 of it turns him a little
       toward the man in front of it. */
    const safety = mkRig('fbosling', { x: SAFETY.x, z: SAFETY.z, ry: Math.PI * 0.425, height: 1.76, idle: 'Idle_3' });
    /* v13.0: and a man ON the tower, at the downrange rail, looking out over
       the range — Chad's "add a fbo soldier standing on top of it". Same
       asset as the safety officer, so `loadGltf` parses it once and this
       costs one `cloneSkinned`; `CULL_SPHERE.fbosling` already covers every
       pose he can take. The GROUP carries the deck height rather than a
       `lift`, because mkRig grounds the model to `group.position.y` and the
       primitive proxy rides the group too — with a lift the placeholder
       would stand on the ground under the tower until the bytes landed. */
    const towerMan = mkRig('fbosling', { x: TOWER.x - 0.05, z: TOWER.z - 0.85, ry: Math.PI, height: 1.76, idle: 'Idle_3' });
    towerMan.group.position.y = TOWER_DECK;

    /* -------------------------------------------------- THE GHOST CYCLIST
       Chad's model: a soldier on a bicycle, one baked mesh, NO rig and no
       clips (measured: 0 bones, 0 animations). That is the beat rather than
       a limitation — a rider who does not pedal is more wrong than one who
       does. It is prepped facing −z with its wheels on y = 0, so it is
       aimed with a plain rotation.y and placed with nothing to correct. */
    const GHOST_A = 0.62;
    const cyc = { group: new THREE.Group(), model: null, mats: [], meshes: [], a: 0, ready: false };
    cyc.group.position.set(0, 0, -45); cyc.group.visible = false; world.add(cyc.group);
    const cycGlow = new THREE.PointLight(0xbcd0ff, 0, 14, 1.6); cycGlow.position.set(0, 1.1, 0); cyc.group.add(cycGlow);
    function cycAlpha(k) {
      cyc.a = k;
      /* v12.4: OPAQUE whenever he is actually being looked at. This model is
         not drawn correctly as a transparent object (see the loader), and he
         stands at full strength for the whole of play — only one scene fades
         him out at its end, and a figure on its way to nothing is the one
         moment the loss does not read. So the flag follows k rather than
         being set once, and it is only re-compiled when it actually flips. */
      const see = k < 0.999;
      for (const m of cyc.mats) {
        if (m.transparent !== see) { m.transparent = see; m.needsUpdate = true; }
        m.opacity = see ? k : 1;
      }
      cycGlow.intensity = 2.6 * k;
      const on = k > 0.002;
      if (cyc.group.visible !== on) cyc.group.visible = on;
    }
    loadGltf('ghostcyclist').then(gltf => {
      if (!alive) return;
      const g = gltf.scene;
      g.traverse(o => {
        if (!o.isMesh) return;
        o.castShadow = false; o.frustumCulled = false;
        o.material = Array.isArray(o.material) ? o.material.map(m => m.clone()) : o.material.clone();
        for (const m of (Array.isArray(o.material) ? o.material : [o.material])) {
          /* v12.4, Chad: "why cant u just use the ghost cyclist model the way
             i gave it to you?" — and he is right, because the ghost treatment
             was DESTROYING the model. Proven by changing ONE property on one
             material in one frame, with opacity at 1.0 in both:
               transparent: false -> the whole rider, head, torso, arms, legs
               transparent: true  -> the head and the torso are not drawn
             Alpha is not involved (it is 1.0 either way). Ruled out one render
             at a time: the model itself (solid it is perfect), lighting and
             normals (an UNLIT copy has the identical hole; all 14,463 normals
             are unit length), back-face culling (DoubleSide is the same), the
             base colour map (there is none — this file ships no maps at all),
             depth writing, depth precision (polygonOffset changes nothing),
             and anything behind him (lifted against open sky the torso is
             still simply absent). So this file will not survive being made
             transparent, and the fix is to stop making it transparent: it
             keeps the materials it was delivered with.
             The v12.3 depth pre-pass that used to sit below this is GONE with
             it — rendered in red on its own it draws a complete, correct
             silhouette, which proves it was never occluding anything. It was
             a no-op, and it was reported as a fix; it is not one. */
          cyc.mats.push(m);
        }
      });
      cyc.group.add(g); cyc.model = g; cyc.ready = true;
      /* v12.2: the shootable list gets the MESHES, not the group. The engine's
         plain ray is recursive and finds either, but the aim-assist cone
         measures a bounding sphere and a Group has no geometry to measure —
         so the one thing in the chapter the player most needs to be able to
         hit would have been the one thing assist could not help him hit. */
      g.traverse(o => { if (o.isMesh) cyc.meshes.push(o); });
      cycAlpha(cyc.a);
    }).catch(() => { cyc.ready = true; });
    /* the primitive fallback under it (v4.7's rule: a failed download costs
       a nicer prop, never the chapter) — two wheels and a rider's column */
    {
      const fb = new THREE.Group(); cyc.group.add(fb);
      const matFb = nfm({ color: 0xb0bcd8, emissive: 0x8fa6d8, emissiveIntensity: 0.5, transparent: true, opacity: 0.0 });
      for (const dz of [-0.62, 0.62]) {
        const w = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.03, 6, 16), matFb);
        w.position.set(0, 0.34, dz); w.rotation.y = Math.PI / 2; fb.add(w);
      }
      const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.17, 0.66, 4, 8), matFb);
      body.position.set(0, 1.02, 0.1); fb.add(body);
      cyc.fallback = fb; cyc.fbMat = matFb;
      cyc.fbMeshes = fb.children.filter(o => o.isMesh);   // v12.3: what the assist cone can measure
    }

    /* ------------------------------------------------ the tonner, parked
       Chad's Kamaz (v11.2) stands behind the line where the detail came in
       on it. It is the film's first shot — the camera sits in its bed and
       looks out at the range — and it dresses the rear of the range for the
       whole chapter, so it earns the download twice. It is prepped with the
       cab at −z, so parked nose-out it needs no turn. */
    const truck = new THREE.Group(); truck.position.set(-14.2, 0, 9.4); world.add(truck);
    let truckReady = false;
    {
      const fb = box(2.4, 2.2, 6.2, 0, 1.3, 0, nfm({ color: 0x3a4032, roughness: 0.95 }), truck);
      loadGltf('kamaz').then(gltf => {
        if (!alive) return;
        const g = gltf.scene;
        g.traverse(o => { if (o.isMesh) { o.castShadow = !LOW; o.receiveShadow = true; o.frustumCulled = true; } });
        truck.add(g); fb.visible = false; truckReady = true;
      }).catch(() => { truckReady = true; });
      boxes.push(new THREE.Box3(new THREE.Vector3(-15.6, 0, 6.2), new THREE.Vector3(-12.8, 2.6, 12.6)));
    }
    /* the kit on the ammo table: a rifle and a torch lying there, which is
       what the film ends on and what the first order asks him to pick up.
       Primitives, because the close-up is two seconds and the real rifle is
       the VIEWMODEL — a second copy of it on a table is a download for a
       prop nobody looks at twice. */
    const filmKit = new THREE.Group(); filmKit.position.set(AMMO.x, 0.83, AMMO.z);
    filmKit.visible = false;   // v12.2: the film shows it; play has it in his hands
    world.add(filmKit);
    {
      const dark = nfm({ color: 0x1c1f1a, roughness: 0.7, metalness: 0.25 });
      const body = new THREE.Mesh(new THREE.BoxGeometry(0.66, 0.06, 0.09), dark); body.position.set(-0.28, 0.03, 0); filmKit.add(body);
      const mag = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.16, 0.05), dark); mag.position.set(-0.30, -0.04, 0); filmKit.add(mag);
      const stock = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.09, 0.07), dark); stock.position.set(0.14, 0.03, 0); filmKit.add(stock);
      const tor = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.032, 0.20, 10),
        nfm({ color: 0x24262a, roughness: 0.6, metalness: 0.3 }));
      tor.rotation.z = Math.PI / 2; tor.position.set(0.30, 0.03, 0.22); filmKit.add(tor);
      const lens = new THREE.Mesh(new THREE.CircleGeometry(0.026, 10),
        nfm({ color: 0xffe6bc, emissive: 0xffc98a, emissiveIntensity: 1.1 }));
      lens.rotation.y = Math.PI / 2; lens.position.set(0.40, 0.03, 0.22); filmKit.add(lens);
    }

    /* ------------------------------------------------------------- the day
       Everything below this line runs on the CHAPTER's own clock, which is
       wall time, not the clamped frame delta (v7.1's law). */
    const dayClock = { t: 0 };
    let lastWall = 0, booted = false;
    let phase = 'line';
    const todo = [];
    function after(secs, fn) { todo.push({ at: dayClock.t + secs, fn }); todo.sort((a, b) => a.at - b.at); }
    function runTodo() { while (todo.length && todo[0].at <= dayClock.t) todo.shift().fn(); }
    function dropTodo() { todo.length = 0; }
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
    function queueLine(name, vol, onStart) { lineQ.push({ name, vol, onStart }); }
    function queueFn(fn) { lineQ.push({ fn }); }
    function queueGap(secs) { lineQ.push({ gap: secs }); }
    function runQueue() {
      if (!lineQ.length || speak.pending || dayClock.t < speak.until) return;
      const it = lineQ[0];
      if (it.fn) { lineQ.shift(); it.fn(); return; }
      if (it.gap !== undefined) { lineQ.shift(); speak.until = dayClock.t + it.gap; return; }
      if (sayLine(it.name, it.vol ?? 1, it.onStart)) lineQ.shift();
    }
    /* the PA under every tower line: the key-up, then the voice a beat later */
    function tower(name, vol = 1) {
      queueFn(() => { if (worldSfx) worldSfx('rangepa', 0.5); });
      queueGap(0.45);
      queueLine(name, vol);
    }

    /* awards carry their own RECEIPT (v7.3): bank() pays only what is not
       already on the card, so a Continue through a serial cannot pay twice */
    function bank(o) {
      if (!kit || !kit.conduct) return;
      const had = kit.getConduct ? (kit.getConduct().notes || []) : [];
      if (o.note && had.includes(o.note)) return;
      kit.conduct(o);
    }

    function setPhase(p) {
      phase = p;
      if (!kit) return;
      /* the rounds and the magazines ride the phase string, so a Continue in
         the played moment lands with the same magazine (the plan's §13) */
      if (p === 'moment') {
        const am = kit.ammo ? kit.ammo() : { rounds: 0, mags: 0 };
        kit.setPhase('moment:r' + am.rounds + 'm' + am.mags + 's' + shots);
      } else kit.setPhase(p);
    }

    /* ------------------------------------------------------------ the flare
       One launch, one burn, one death. The sky is the kit's daylight tween;
       the hot spot over the arc and the burning hiss are the chapter's. */
    /* v13.0 (Chad: "when the scene lights up, please show the flare going up,
       with sound effects") — the flare USED to appear at 46 m already
       burning, so the light arrived with nothing on screen to explain it.
       It is fired now: a spark leaves the ground short of the berm and
       CLIMBS for RISE seconds on `flarelaunch`, decelerating the way a
       rocket does, and only at the apex does `flarepop` fire and the sky
       open. The launch is off to his right and downrange, which is where a
       man at the firing point is already looking — a launch behind him
       would be a sound with no picture, which is the bug being fixed.
       `flarePlace(k)` is the ONE copy of that arc, so the film (whose
       `flareFrame` never runs — updateNotes returns early under a cutscene)
       draws exactly the climb play draws. */
    const FLARE_RISE = 1.55;
    /* THE BALL IS SIZED BY DISTANCE, and that is measured rather than chosen.
       At the tube it is ten metres away and at the apex eighty-eight, so a
       fixed world size is either a lantern in his face or (measured on the
       shipped build, radius 0.5 m) SEVEN PIXELS on a 390 px phone — which is
       why the first pass of the climb was invisible in the photograph even
       though every number said the flare was in frame. Scaling with distance
       holds it at roughly 38–50 px the whole way up: a bright spark you can
       watch climb, which is what item 11 asked for. */
    const _fv = new THREE.Vector3();
    function flareBallSize() {
      const d = flare.position.distanceTo(camera.getWorldPosition(_fv));
      flareBall.scale.setScalar(Math.max(0.6, Math.min(4.2, d * 0.045)));
    }
    /* WHERE it is fired from is a framing number, not a taste: from the
       firing point the launch has to be inside a PORTRAIT PHONE's horizontal
       half-view, which the 72-degree VERTICAL lens makes about 21 degrees
       (AUDIT Part One). At (HIS.x + 5.2, -4.2) it sat 36.6 degrees off the
       lane and a phone player would have heard a launch he could not see —
       the bug being fixed, in a different form. 2.2 m right and 6 m out is
       17.2 degrees: in frame on a phone, still clearly off his own lane. */
    const FLARE_FROM = { x: HIS.x + 2.2, y: 1.1, z: -6.0 };
    let flareApexX = HIS.x;
    function flarePlace(k) {
      const e = 1 - Math.pow(1 - Math.min(1, Math.max(0, k)), 2);
      flare.position.set(FLARE_FROM.x + (flareApexX - FLARE_FROM.x) * e,
                         FLARE_FROM.y + (46 - FLARE_FROM.y) * e,
                         FLARE_FROM.z + (-72 - FLARE_FROM.z) * e);
      flareBall.position.copy(flare.position);
      flareBallSize();
    }
    /* the launch's whole LOOK, one copy — the film borrows it exactly as it
       borrows the arc, because `flareFrame` never runs under a cutscene */
    function flareClimb(k) {
      flarePlace(k);
      flare.intensity = 40 + 120 * Math.max(0, Math.min(1, k));
      flareBall.material.opacity = 0.92;
    }
    let flareT = 0, flareLife = 0, flareOn = false, flareBurst = false;
    function flareUp(secs) {
      flareOn = true; flareT = 0; flareLife = secs; flareBurst = false;
      flareApexX = HIS.x + (Math.random() - 0.5) * 8;
      flarePlace(0);
      if (worldSfx) worldSfx('flarelaunch', 0.85);
      // the pop and the sky wait for the apex — see flareFrame
    }
    function flareDown() {
      if (!flareOn) return;
      flareOn = false; flareBurst = false;
      if (kit) kit.daylight(null, 2.2);
    }
    function flareFrame(dt) {
      if (flareOn) {
        flareT += dt;
        if (flareT < FLARE_RISE) {                            // THE CLIMB
          flareClimb(flareT / FLARE_RISE);
          mixBeds();
          return;
        }
        if (!flareBurst) {                                    // THE BURST
          flareBurst = true;
          if (worldSfx) worldSfx('flarepop', 0.9);
          if (kit) kit.daylight(FLARE, 1.2);
        }
        const b = flareT - FLARE_RISE;                        // the burn's own clock
        const k = Math.min(1, b / Math.max(0.01, flareLife));
        /* v13.0: a flare BURSTS. The old ramp took 1.1 s to reach full from
           ZERO, which after the climb meant the spark went dark for a frame
           and then faded up — measured on the shipped build, opacity 0 at the
           burst frame. Half its light on the frame it lights, full a quarter
           of a second later. */
        const up = Math.min(1, 0.5 + b / 0.25);
        const die = k > 0.82 ? 1 - (k - 0.82) / 0.18 : 1;      // and the fall
        const amp = up * die;
        flare.intensity = 260 * amp;
        flare.position.x += Math.sin(b * 0.7) * dt * 1.4;      // the drift under the parachute
        flare.position.y = 46 - b * 0.9;
        flareBall.position.copy(flare.position);
        flareBall.material.opacity = amp;
        flareBallSize();
        if (b >= flareLife) { flareDown(); }
      } else {
        flare.intensity *= Math.max(0, 1 - dt * 2.2);
        flareBall.material.opacity *= Math.max(0, 1 - dt * 2.2);
      }
      mixBeds();
    }

    /* ------------------------------------------------------------ the mover */
    function moverFrame(dt) {
      if (!MOVER.on) return;
      MOVER.t += dt * 0.085 * MOVER.dir;
      if (MOVER.t >= 1) { MOVER.t = 1; MOVER.dir = -1; }
      if (MOVER.t <= 0) { MOVER.t = 0; MOVER.dir = 1; }
      mover.group.position.x = MOVER.x0 + (MOVER.x1 - MOVER.x0) * MOVER.t;
    }

    /* ------------------------------------------------------- THE CYCLIST
       Its whole behaviour is one number: `pass`. 0 is the confusion's first
       crossing, far out; each shot brings it in. It crosses left to right —
       the direction the range has spent an hour teaching him to answer. */
    const PASS_Z = [-46, -33, -22, -8];        // far, nearer, nearer, the foot of the berm
    /* v12.2, Chad: "The ghost cyclist should also move faster." He was right
       and the numbers say why: 1.35 m/s is a slow WALK, and the model is a
       man on a bicycle, so it read as a statue being dragged sideways — 52 m
       at that speed is thirty-eight seconds of one pass. A bicycle is 4 to
       6 m/s; these are 3.6 to 4.8, which puts a pass at eleven to fourteen
       seconds and still leaves the last one standing still, which is the
       beat. */
    const PASS_SPD = [3.6, 4.2, 4.8, 0];       // m/s; the last one has stopped
    /* v12.3: the tracking cone OPENS as the thing speeds up. The dwell is
       1.2 s and the cone is a half-angle about the lens, so the time a pass
       spends inside a fixed cone falls with its speed: at PASS_Z -22 and
       4.8 m/s, 0.10 rad is 0.93 s of cone — under the dwell, so a player
       holding the sight perfectly still could not finish the drill on the
       third pass. These are the angles that keep every pass answerable. */
    const PASS_AIM = [0.10, 0.12, 0.15, 0.18];
    /* v13.0, Chad: "make it bigger when it passes by from left to right,
       since the player may be aiming in and may not see it at all." A man on
       a bicycle 46 m out is about 1.8 m of a frame 67 m tall at that
       distance — 1.2 % of the screen, ten pixels on an 844-tall phone, and
       less than half that through the 30-degree aim. Each pass is scaled by
       how FAR OUT it is, so the far one reads and the one stopped at the foot
       of the berm is left at its own size — which is also the size the four
       scenes were framed against, so they are untouched by construction. */
    const PASS_SCALE = [1.85, 1.55, 1.25, 1.00];
    /* AND HE FADES. He used to snap to full alpha and snap to nothing, so a
       player looking the other way saw an object that had simply always been
       there. `cycWant` is the target and the frame walks `cyc.a` to it; a
       SCENE still sets the alpha outright through `cycAlpha`, because
       `cycFrame` does not run under a cutscene and a ramp there would never
       advance. */
    const CYC_FADE = 1.1;                      // alpha per second
    let cycWant = 0;
    let pass = 0, cycT = 0, cycOn = false, cycStopped = false, shots = 0, tracked = 0, reported = false;
    let momentT = 0, bellDone = false;
    function cycStart(p, fadeIn) {
      pass = Math.max(0, Math.min(PASS_Z.length - 1, p));
      cycT = 0; cycOn = true; cycStopped = PASS_SPD[pass] === 0;
      cyc.group.position.set(HIS.x - 26, 0, PASS_Z[pass]);
      cyc.group.rotation.y = -Math.PI / 2;      // prepped facing −z, so a quarter turn puts him crossing to +x
      cyc.group.scale.setScalar(PASS_SCALE[pass] || 1);
      if (cycStopped) {
        cyc.group.position.set(HIS.x - 1.2, 0, PASS_Z[pass]);
        cyc.group.rotation.y = Math.PI;          // stopped, facing the line
      }
      cycWant = 1;
      cycAlpha(fadeIn ? 0.02 : 1);               // a scene gets him whole on its first frame
      if (cyc.fbMat) cyc.fbMat.opacity = cyc.ready && cyc.model ? 0 : GHOST_A;
    }
    function cycEnd(fadeOut) { cycOn = false; cycWant = 0; if (!fadeOut) cycAlpha(0); }
    function cycFrame(dt) {
      /* the fade runs whether or not he is crossing — it is what takes him
         off the range at the end of a pass */
      if (cyc.a !== cycWant) {
        const step = CYC_FADE * dt, d = cycWant - cyc.a;
        cycAlpha(Math.abs(d) <= step ? cycWant : cyc.a + Math.sign(d) * step);
      }
      if (!cycOn || cycStopped) return;
      cycT += dt;
      cyc.group.position.x += PASS_SPD[pass] * dt;
      /* OFF THE FAR EDGE. v13.0: on the HOLD branch it used to ring the bell
         the instant the first crossing finished — 14.4 s after the sighting —
         which gave the whole confusion (his line, the three shouts, lane
         five's shot and the tower) fourteen seconds to happen in and cut
         whatever was still speaking. And it meant a player who held his
         sight, which is the correct answer, saw the thing exactly ONCE,
         which is the other half of Chad's "may not see it at all".
         So a crossing that finishes with no round fired now takes it into the
         trees and BRINGS IT BACK NEARER a moment later, and the bell is the
         moment's own fifteen-second clock. The last pass is the stopped one
         and still ends the beat. */
      if (cyc.group.position.x > HIS.x + 26) {
        cycEnd(true);
        if (phase === 'moment' && shots === 0 && pass < PASS_Z.length - 2) {
          const p2 = pass + 1;
          after(1.6, () => { if (phase === 'moment' && shots === 0 && !bellDone) cycStart(p2, true); });
        } else onCrossed();
      }
    }

    /* the beds: the range's night tone always, the flare's hiss while one
       burns, the rail while the mover runs, and the chain keyed to how near
       the cyclist is — the quiet sound that says it is there (the ambient
       frame re-asserts every declared volume every frame, so this is where
       a chapter's mix lives) */
    /* v12.3: AND THEY GO QUIET WHEN PLAY DOES. `mixBeds` was only ever
       reached from `flareFrame`, which sits under updateNotes's
       `getState() !== 'play'` guard — while the ENGINE's ambient frame
       re-asserts every declared volume in every state that is in the world.
       So the last values written in play were held through the cutscene,
       the outcome card and the sealed card: a trolley rail grinding under
       the teaching, a flare hissing over the rank. These three are pure
       play mechanics and none of them exists once the options are up; the
       range's own night tone and the dread are the chapter's and stay. */
    function mixBeds() {
      const playing = getState() === 'play';
      const nearK = (playing && cycOn) ? Math.max(0, 1 - Math.hypot(cyc.group.position.x - HIS.x, cyc.group.position.z - HIS.z) / 50) : 0;
      for (const b of DATA.ambience.beds) {
        if (b[0] === 'flarehiss') b[1] = (playing && flareOn) ? 0.5 * Math.min(1, flareT / 0.8) : 0;
        if (b[0] === 'moverrail') b[1] = (playing && MOVER.on) ? 0.34 : 0;
        if (b[0] === 'chain') b[1] = 0.55 * nearK * cyc.a;
      }
    }

    /* ------------------------------------------------------ the serials
       The range is played with the RIFLE, not with a panel: the tower gives
       the order, the targets are `shootables()`, and `onShot` scores. That
       is the whole point of the chapter — the drill it teaches is the one
       the ghost exploits, so it has to be the same verb. */
    let hot = false, serial = 0, hits = 0, early = 0;
    /* v13.0, Chad: "the first wave of targets can be static, then straight to
       the moving targets after. Remove the 2nd wave of static targets, to
       quicken the chapter." So TWO serials, not three: the statics, then the
       mover. The pop-up bank is still built — it is scenery at 98 m and the
       film lowers it with everything else — but no serial runs on it, and
       `popSeq` went with the serial it existed for. Everything the serials do
       is table-driven now, so the number of them is one array length rather
       than a run of `if (n === 2)` branches. */
    const moverBank = [mover];
    const SER_TARGETS = [statics, moverBank];
    const SER_NEED    = [3, 2];
    const SER_KIND    = ['static', 'moving'];
    const SER_ORDER   = ['t4fire1', 't4fire3'];   // the mover keeps its own order
    const SER_LEAD    = [4.2, 4.4];               // how long the order takes
    const SER_SECS    = [28, 34];
    const SER_FLARE   = [20, 26];
    function objSerial() {
      if (!kit) return;
      const w = [DATA.words.objS1, DATA.words.objS3][serial - 1] || '';
      /* `complete: false` — the count is a REFRESH, not a completion. Without
         it every scoring hit changed the objective text and so fired the
         v8.7 OBJECTIVE COMPLETE banner, which covers the running count for
         1.35 s and congratulates the player for a serial he is in the middle
         of. The same lie in the same direction as the one v8.7 named. */
      /* v12.3: clamped, because serial two can bank a fourth hit inside the
         ~0.5 s the next board is up before endSerial's 1.4 s lands, and
         "4/3" is a HUD telling a lie about its own rule. */
      kit.objective(w.replace('{n}', String(Math.min(hits, SER_NEED[serial - 1] || hits))), { complete: false });
    }
    function beginSerial(n) {
      serial = n; hits = 0; hot = false; ending = false;
      setPhase('serial' + n);
      /* WAIT FOR THE ORDER is its own objective, not a silence. The tower
         takes four seconds to give it and every round fired inside those
         four seconds costs six sanity, so the screen has to say so — and it
         says it WITHOUT a completion banner (`complete: false`), because a
         HUD that congratulates you for a beat you have not done yet is the
         v8.7 lie in its other direction. It is also the drill the whole
         chapter turns on: the thing the ghost exploits at the end is that
         you were taught to wait to be told. */
      if (kit) kit.objective(DATA.words.objHold, { complete: false });
      /* v12.3, Chad: "the first round of targets come back up after they are
         all shot down, this made it hard to shoot the targets of subsequent
         rounds." He is right and it is one word. This loop raised EVERY
         static at the start of EVERY serial, so the three boards at 62 m
         stood back up for serials two and three — the biggest, nearest thing
         on the range, standing in front of the bank that is actually live and
         not shootable, because `shootables()` is scoped to the serial's own
         bank. It also contradicted `endSerial`, which had just lowered them
         on purpose at the cease-fire.
         A range runs ONE bank at a time: each serial raises its own and
         leaves the others flat. */
      /* v13.0, Chad: "the targets are already standing before the shooting
         starts. All targets should be down, until the wave starts, and then
         they go down again when the wave ends, and only the next wave's
         targets flip up." Every bank goes DOWN here and the serial's own
         comes up on the frame the order lands — which is also what a range
         does, and it makes the flare's light arrive on an empty arc and the
         boards flip up under it. (v12.3's finding stands underneath: a range
         runs ONE bank at a time, because `shootables()` is scoped to the live
         bank and a board standing in front of it steals the rounds.) */
      for (const t of statics) { t.hit = false; t.set(true); }
      for (const t of popups)  { t.hit = false; t.set(true); }
      mover.hit = false; MOVER.on = false; mover.set(true);
      flareUp(SER_FLARE[n - 1] || 20);
      tower(SER_ORDER[n - 1]);
      after(SER_LEAD[n - 1] || 4.2, () => {
        if (phase !== 'serial' + n) return;
        hot = true; objSerial();
        for (const t of (SER_TARGETS[n - 1] || [])) { t.hit = false; t.set(false); }   // THE WAVE FLIPS UP
        if (SER_TARGETS[n - 1] === moverBank) { MOVER.on = true; MOVER.t = 0; MOVER.dir = 1; }
      });
      /* v12.3: the clock that ENDS the serial is the clock on screen. It ran
         privately for 28 or 34 seconds with nothing in the HUD, so a player
         who missed had no way to know the beat was running out — the same
         thing v8.1 fixed for the bunk's evening. `kit.timer` paints M:SS
         beside the objective and reddens under ten. */
      if (kit) kit.timer(SER_SECS[n - 1] || 28);
      after(SER_SECS[n - 1] || 28, () => { if (phase === 'serial' + n) endSerial(); });
    }
    /* v13.0: `popSeq` is GONE with the pop-up serial it existed for (item 19).
       What it knew — that a board raised once and never again makes a count
       unreachable, so the sequence has to loop — is written into v12.3's
       record and into the mover's own come-back-up below, which is the same
       law in the one serial that still needs it. */
    /* ONCE. `endSerial` does not change `phase`, so the hit-count path and
       the serial's own timeout both saw `phase === 'serial' + n` and both
       fired: the cease-fire was called twice, the award banked twice and the
       next serial begun twice. `ending` is the guard and it is cleared by
       whatever starts the next serial. */
    let ending = false;
    function endSerial() {
      if (ending) return;
      ending = true;
      hot = false; MOVER.on = false;
      const n = serial;
      /* and the note is the truth: a serial that timed out with no hits at
         all used to bank "You shot the ... serial clean." onto the card */
      if (hits > 0) {
        bank({ a: Math.min(6, hits * 2),
               note: hits >= SER_NEED[n - 1]
                 ? 'You shot the ' + SER_KIND[n - 1] + ' serial clean.'
                 : 'You got rounds on the ' + SER_KIND[n - 1] + ' serial.' });
      }
      tower('t4cease');
      if (kit) { kit.timer(null); kit.objective(DATA.words.objCease, { complete: false }); }
      flareDown();
      /* the bank comes DOWN at the cease-fire. Otherwise the serial just shot
         leaves its un-hit boards standing in the target area while the next
         serial's scoping makes them unshootable — the biggest, nearest thing
         on the range, and rounds at it do nothing. */
      /* v13.0: EVERY bank, not just this serial's — "they go down again when
         the wave ends" (item 17). The others are already flat, so this only
         costs the loop, and it means one place says what the range looks like
         between waves. */
      for (const t of statics) t.set(true);
      for (const t of popups) t.set(true);
      mover.set(true);
      after(6.0, () => {
        if (n < SER_TARGETS.length) beginSerial(n + 1);
        else beginStag();
      });
    }

    /* the shot the chapter scores. The engine raycasts and hands the hit
       over; nothing here knows how a rifle works. */
    /* WHAT IS SHOOTABLE IS THE SERIAL'S OWN BANK, and that is a fix rather
       than a flourish. Measured on the shipped build: a shot aimed at the
       far bank (132 m) and a shot aimed at the pop-ups (98 m) both reported
       a hit at 62 m — the 1.7-degree assist cone at sixty metres is 1.85 m
       across, and a static board standing straight down the lane sits well
       inside it. So a player doing serial two correctly would have had his
       rounds silently stolen by serial one's boards, which are still up
       because he never shot them.
       A range runs one bank at a time and says so over the PA, so the
       shootable set is that bank and nothing else; outside a serial only the
       thing in the target area answers. The far pair are scenery and were
       never in SER_TARGETS at all. */
    function shootables() {
      const out = [];
      const bank = SER_TARGETS[serial - 1];
      if (hot && bank) for (const t of bank) { if (!t.down) out.push(t.board); }
      if (cycOn && cyc.a > 0.2) {
        if (cyc.meshes.length) for (const m of cyc.meshes) out.push(m);
        else if (cyc.model) out.push(cyc.model);
        /* v12.3: the fallback's MESHES, for the same reason as the model's.
           `weaponAssistHit` measures a bounding sphere and skips anything
           without geometry of its own, so a Group got the plain ray and no
           assist — and the fallback is what stands here when the download
           fails, i.e. exactly when the player needs the help most. */
        for (const m of (cyc.fbMeshes || [])) out.push(m);
      }
      return out;
    }
    function targetOf(obj) {
      for (const t of statics.concat(popups, far, [mover])) {
        let p = obj; while (p) { if (p === t.board) return t; p = p.parent; }
      }
      return null;
    }
    function isCyclist(obj) { let p = obj; while (p) { if (p === cyc.group) return true; p = p.parent; } return false; }
    function onShot(r) {
      if (!r) return;
      /* the played moment: a round into the thing in the target area. It is
         gone on the flash and back on the next flare, NEARER. */
      if (phase === 'moment' || phase === 'confuse') {
        /* v12.3: once the bell has gone the beat is OVER — the thing is
           stood at the foot of the berm and the decision is 1.6 s away.
           A round fired into that gap used to spend a life on the
           escalation ladder and take the cyclist off the range with
           `cycEnd()`, so the four options opened on empty tarmac with the
           presence banner still saying it was out there. */
        if (bellDone) return;
        if (r.hit && isCyclist(r.object)) onHitCyclist();
        else if (phase === 'moment') { shots++; onFiredAtIt(); }
        return;
      }
      if (!hot) {
        /* firing without the order is the one thing the range cannot have */
        early++;
        /* v12.3: QUEUED, not dropped. The one moment a player fires early is
           while the tower is still giving the order — and `sayLine` refuses a
           line while another speaks, so the reprimand that explains the six
           sanity he just lost was silent exactly when it was earned. */
        if (early === 1) { lineQ.length = 0; queueLine('e4wait'); }
        if (kit) { kit.conduct({ s: -6, note: 'You fired before the order.' }); kit.flash({ color: '#ff3a1c', secs: 0.35 }); }
        return;
      }
      if (!r.hit) return;
      const t = targetOf(r.object);
      if (!t || t.down || t.hit) return;
      t.hit = true;
      if (worldSfx) worldSfx('targethit', 0.8);
      after(0.25, () => { t.set(true); if (worldSfx) worldSfx('targetfall', 0.6); });
      if (SER_TARGETS[serial - 1] && SER_TARGETS[serial - 1].indexOf(t) >= 0) {
        hits++; objSerial();
        if (kit && kit.haptic) kit.haptic([15, 30, 15]);
        if (hits === SER_NEED[serial - 1]) after(1.4, () => { if (phase === 'serial' + serial) endSerial(); });
        /* THE MOVER COMES BACK UP. Serial three asks for two hits and there
           is exactly ONE moving target, and `t.hit` latches — so the second
           hit was unreachable and the serial could only ever end on its own
           clock. A real moving-target serial sends the trolley back across;
           so does this one. */
        else if (t === mover && phase === 'serial' + serial) {
          const sn = serial;
          after(2.4, () => {
            /* `ending` too, not just the phase: the cease-fire keeps the
               phase at the serial for six seconds, and without this the
               trolley (and its rail loop) started up again under the tower's
               cease-fire and ran on into the stag. */
            if (phase !== 'serial' + sn || ending) return;
            mover.hit = false; mover.set(false);
            MOVER.on = true;
          });
        }
      }
    }

    /* ------------------------------------------------------------ the stag
       The serials are done and the line stands loaded for the last one. The
       wait in the dark is where the buddy says the thing neither of them has
       said since last night, and where the presence starts. */
    function beginStag(resumed) {
      setPhase('stag');
      hot = false; ending = false; MOVER.on = false;
      if (kit) { kit.objective(DATA.words.objStag); kit.waypoint(null); kit.timer(null); }
      if (!resumed) {
        after(3.0, () => sayLine('b4stag'));
        /* v13.0, Chad: "the hud label 'something is out there' comes out even
           before the ghost cyclist appears." It did: the presence — and with
           it the red banner — was raised here, eight seconds before the
           thing was on the range, so the HUD announced a presence the player
           could not find. It is raised on the FRAME he is first seen now
           (beginConfuse), with its own sting. */
        after(16.0, () => beginConfuse());
      } else after(2.0, () => beginConfuse());
    }

    /* ------------------------------------------------- THE CONFUSION
       Chad's beat. The flare goes up for the last serial, the mover starts
       across — and there is a second shape crossing that is not on any rail,
       giving off its own light, a hand-span off the ground. Lane five fires.
       The tower asks who fired. The radio says the target area is empty. */
    function beginConfuse(resumed) {
      setPhase('confuse');
      /* the presence is NOT raised here — see the sighting below (item 20) */
      if (kit) kit.objective(DATA.words.objConfuse);
      flareUp(30);
      MOVER.on = true; MOVER.t = 0; MOVER.dir = 1; mover.set(false);
      tower('t4ready');
      /* THE HAND-OVER IS DERIVED FROM THE SPEED, not typed in. The arc is
         52 m wide and `cycFrame` calls `onCrossed()` — which rings the bell
         and opens the decision — the instant the thing reaches the far side.
         At v12.1's 1.35 m/s that took 38.5 s, comfortably past the hard-coded
         24.0 s hand-over; at v12.2's 3.6 m/s it takes 14.4 s, so the crossing
         finished at 17.6 s and rang the bell while the chapter was still in
         `confuse` — skipping the played MOMENT entirely, which is the
         chapter's signature beat and the only place the radio, the tracking
         drill, "It is in the target area. Decide." and n4dawn's setup live.
         Three quarters of the way across is the hand-over now, so the beat
         survives whatever the speed becomes. */
      const CROSS_M = 52, crossSecs = CROSS_M / Math.max(0.1, PASS_SPD[0]);
      const handOver = 3.2 + crossSecs * 0.72;                                   // 13.6 s at 3.6 m/s
      /* THE SIGHTING. Everything that says "there is something out there"
         happens on this frame and not before it (item 20): he fades up on the
         arc, the sting lands, the phone buzzes, and only THEN does the red
         banner come on. And EVERYONE SHOUTS (item 22, Chad's own three
         lines, in three different voices) — his own "That's not a target."
         first, because he is the one looking down the lane, then the buddy,
         the man at the far end and the bunkmate.

         It is ONE QUEUE, so every gap is the takes' own measured length and a
         re-generated take cannot make two voices talk over each other (the
         v9.5 count-off's law). `b4there` is dropped from this beat: it said
         "Sergeant! Got someone in the target area!" and `r4cyc` says the same
         thing in Chad's words, so keeping both would be the same man shouting
         it twice. The take stays in the pack. */
      after(3.2, () => {
        cycStart(0, true);
        if (worldSfx) worldSfx('stingcyc', 0.95);
        if (kit) { kit.presence(0.3); kit.haptic([40, 70, 40]); }
        lineQ.length = 0;
        queueLine('n4notarget');                                                // 1.80 s
        queueLine('b4cyc');                                                     // 2.12 s — the buddy
        queueLine('r4cyc');                                                     // 2.35 s — the far end
        queueLine('k4cyc');                                                     // 3.42 s — "DON'T SHOOT"
        queueFn(() => { if (worldSfx) worldSfx('rifleshot', 0.75); });          // and lane five fires anyway
        queueGap(0.5);
        tower('t4who');
        queueGap(0.35);
        tower('t4neg');
      });
      after(handOver, () => { if (phase === 'confuse') beginMoment(); });
      if (resumed) { dropTodo(); cycStart(Math.min(pass, 1), true); after(1.5, () => beginMoment()); }
    }

    /* ------------------------------------------------- THE PLAYED MOMENT
       Two things he can do with a loaded rifle and the game measures both.
       FIRE: it is gone on the flash and back on the next flare, nearer, and
       after the third it is at the foot of the berm with the bell.
       HOLD: it crosses the whole arc at walking pace and the bell rings as
       it passes his lane. Either way the decision opens on a clock. */
    function beginMoment(resumed) {
      setPhase('moment');
      momentT = 0;
      if (kit) {
        kit.objective(DATA.words.objMoment);
        kit.presence(0.55);
      }
      if (!cycOn) cycStart(resumed ? pass : 0, true);
      /* v13.0: QUEUED, not said. The sighting's three shouts and the tower's
         two radio lines are still running when the moment opens, and
         `sayLine` refuses a line while another speaks — so a `sayLine` here
         was a line DROPPED exactly when the beat was busiest (the v8.0 law:
         hold a line, never eat it). */
      if (!resumed) { queueGap(0.4); queueLine('b4float'); }
      /* the clock: it does not wait for ever. Fourteen seconds without a
         shot IS the hold branch, and the bell rings on its own. */
      after(15.0, () => { if (phase === 'moment' && shots === 0) onCrossed(); });
    }
    function onFiredAtIt() {
      /* a round into the target area at a thing the tower says is not there */
      if (kit) { kit.conduct({ s: -5, note: 'You fired at it.' }); kit.flash({ color: '#ff3a1c', secs: 0.3 }); }
      if (shots >= 3) { onBell(); return; }
      /* v12.3: RE-STAMP THE RECEIPT. `moment:r14m1s2` is written by
         setPhase, and beginMoment was its only caller — so the phase string
         was stamped once, at entry, with shots 0 and a full magazine. A
         Continue taken after two rounds therefore restored the FIRST pass
         with the rounds back, and the escalation the chapter is built on ran
         again from the start. setPhase is idempotent but for the string, so
         calling it here is the whole fix (v7.3's law: a resume lands where
         the player actually was). */
      setPhase('moment');
      cycEnd();
      sayLine('n4back');
      after(2.6, () => {
        /* v12.3: and 'confuse' too. The confusion is the first pass and the
           player CAN put a round into it there — onShot accepts the hit and
           spends a life for it — but the re-show was gated on 'moment'
           alone, so the one thing the chapter is about vanished for the rest
           of the beat and the hand-over arrived at an empty range. */
        if (phase !== 'moment' && phase !== 'confuse') return;
        flareUp(16);
        cycStart(Math.min(PASS_Z.length - 1, shots), true);
        if (kit) kit.presence(0.55 + 0.15 * shots);
      });
    }
    function onHitCyclist() { shots++; onFiredAtIt(); }
    /* it finished its crossing without being fired at — the hold branch */
    function onCrossed() {
      if (phase !== 'moment' && phase !== 'confuse') return;
      cycStart(PASS_Z.length - 1);          // stopped, at the foot of the berm, facing the line
      onBell();
    }
    function onBell() {
      if (bellDone) return;
      bellDone = true;
      cycStart(PASS_Z.length - 1);
      if (worldSfx) worldSfx('bikebell', 1);
      if (kit) { kit.presence(0.85); kit.haptic([40, 60, 40]); }
      after(1.6, () => openDecision());
    }
    function openDecision() {
      if (phase === 'decide') return;
      setPhase('decide');
      /* v12.3: the range's own voices stop at the decision. A queued tower
         line still working through `t4who` (5.25 s) or `t4neg` (6.43 s) when
         the bell came early — three rounds into the thing rings it around
         t 11-13, and the queue is laid out for t 12 — ran on under the four
         options and into the cutscene's first line, which is the overlap
         v5.30 spent a release removing everywhere else. Dropping the queue
         and the window is the chapter's half; `playCineFn` already stops
         play-time narration when a scene begins (v4.91). */
      dropTodo(); lineQ.length = 0; speakReset();
      if (kit) {
        kit.objective(null);
        /* the timed decision: the bar IS its approach (the plan's §4.7).
           Running out costs sanity and never wisdom. */
        kit.decisionClock(22, () => {
          if (kit) kit.conduct({ s: -8, note: 'You stood there until it reached the berm.' });
        });
      }
      after(0.4, () => { if (getState() === 'play') startDecision(); });
    }

    /* --------------------------------------------------------- the phases */
    /* the walk to lane six, and that is the whole of it. v12.1 opened on
       empty hands and made him fetch his kit from the ammo point first;
       Chad's call at v12.2 is that the rifle is already in his hands when
       play begins, so the fetch is gone and the first order is the one that
       matters. */
    function beginLine(resumed) {
      setPhase('line');
      /* v13.0 (item 17): nothing stands in the target area until a wave says
         so — including on a resume, which never plays the film */
      for (const t of statics) { t.hit = false; t.set(true); }
      for (const t of popups)  { t.hit = false; t.set(true); }
      mover.hit = false; MOVER.on = false; mover.set(true);
      if (!kit) return;
      if (kit.ammo) kit.ammo(DATA.weapon.rounds, DATA.weapon.mags);
      kit.objective(DATA.words.objLine);
      kit.waypoint({ x: HIS.x, y: 1.0, z: 0.35 });
    }
    function reachedLine() {
      if (phase !== 'line') return;
      if (kit) { kit.waypoint(null); kit.haptic(60); }
      if (worldSfx) worldSfx('hudlock', 0.8);
      beginLoad();
    }
    function beginLoad(resumed) {
      setPhase('load');
      if (!kit) return;
      kit.objective(DATA.words.objLoad);
      kit.waypoint(null);
      tower('t4load');
      after(resumed ? 0.5 : 5.4, () => {
        if (phase !== 'load' || !kit || !kit.event) { beginSerial(1); return; }
        /* v12.3, Chad: "The minigame seems broken and im not sure what its
           supposed to do." Two causes, and the second is v9.7's bug met in a
           second kind. THE WORDS said what a soldier does and never what a
           PLAYER does, and nothing on the track marked the moment to press —
           `loadBody` names the action now and the band is drawn (shell.html).
           THE WINDOWS sat inside a touchscreen's own latency: a press grades
           on |slotT - mid| / (span / 2), and at each 1.6 / lead 0.4 the
           half-span is 0.60 s, so with zone 1 PERFECT was 18 ms, GOOD 72 ms
           and anything past 204 ms BROKEN at -4 awareness — against a phone's
           own 50-100 ms tap latency. A player with flawless timing was
           charged for all three items.
           zone 2.5 puts the ladder where v9.7 put the heartbeat's: PERFECT
           45 ms, GREAT 105, GOOD 180, SLIGHT 300, BROKEN only past 510 ms.
           `each` 2.0 gives the first item a 1.6 s span to read, and the
           default accel 0.86 still tightens the two after it. Print the
           milliseconds whenever these move — that is the v9.7 rule. */
        kit.event({ kind: 'sequence', label: DATA.words.loadBrief,
                    items: [{ label: 'MAGAZINE' }, { label: 'COCK' }, { label: 'SAFETY' }],
                    brief: DATA.words.loadBody,
                    demo: 'bar',        // v13.0: the briefing SHOWS the timing before it asks for it
                    each: 2.0, lead: 0.4, zone: 2.5,
                    penalty: { stat: 'awareness', per: 1 },
                    award: { stat: 'awareness', per: 1, lo: -6, hi: 9 } })
          .then(r => {
            if (!alive) return;
            /* v12.3: kitReset resolves an open event as ABORTED, and the
               .then is a microtask — so it lands after restart() has already
               rebuilt the run, and the old drill scheduled the new run's
               first serial 1.4 s in, on top of whatever phase the replay was
               actually in. A replay taken at the drill got two serial ones. */
            if (!r || r.aborted) return;
            if (worldSfx) worldSfx('riflecock', 0.8);
            if (r && r.ok) bank({ a: 3, note: 'You loaded on the order, in order.' });
            after(1.4, () => beginSerial(1));
          });
      });
    }

    /* a resume lands in the right part of the night (v7.3's law) */
    function applyPhase(p) {
      const s = String(p || '');
      if (s.startsWith('moment')) {
        const m = /r(\d+)m(\d+)s(\d+)/.exec(s);
        if (m && kit && kit.ammo) kit.ammo(+m[1], +m[2]);
        if (m) shots = +m[3];
        pass = Math.min(PASS_Z.length - 1, shots);
        beginMoment(true);
        return;
      }
      /* v12.3: DO NOT pre-set the phase. `openDecision` opens with
         `if (phase === 'decide') return;`, so stamping it first made the
         resume a no-op: the autosave runs while the state is still 'play'
         for the 0.4 s between `setPhase('decide')` and `startDecision()`, and
         a Continue taken in that window came back to the range with no card,
         no clock, no objective and nothing to do. `bellDone` so the bell is
         not rung a second time. */
      if (s === 'decide') { bellDone = true; cycStart(PASS_Z.length - 1); openDecision(); return; }
      if (s === 'confuse') { beginConfuse(true); return; }
      if (s === 'stag') { beginStag(true); return; }
      if (s.startsWith('serial')) { beginSerial(Math.max(1, Math.min(SER_TARGETS.length, +s.slice(6) || 1))); return; }
      if (s === 'load') { beginLoad(true); return; }
      filmKit.visible = false;
      beginLine(true);
    }

    /* --------------------------------------------------------- the pile
       This chapter's "pile" is THE TARGET AREA straight out of his lane: the
       engine's own decision object, opened by `openDecision()` rather than
       by a walk-up, because a player who could walk to it would be forward
       of the line. `pointerHitsPile` answers only in `decide`, so nothing
       before the bell can trip it. */
    const pile = new THREE.Group(); pile.position.copy(PILE_POS); world.add(pile);
    const pileRing = new THREE.Mesh(
      new THREE.RingGeometry(0.55, 0.70, 24),
      new THREE.MeshBasicMaterial({ color: 0xff4a2a, transparent: true, opacity: 0,
        side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false, fog: false }));
    pileRing.rotation.x = -Math.PI / 2; pileRing.position.y = -0.98; pileRing.visible = false;
    pile.add(pileRing);
    const _ndc = new THREE.Vector3();
    const syncCamera = () => { camera.updateWorldMatrix(true, false); camera.matrixWorldInverse.copy(camera.matrixWorld).invert(); };
    /* v12.2: the approach prompt is the DECISION's or it is nothing.
       Photographed on a 390 px phone during serial one: "the target area"
       sat across the weapon HUD row, over the FIRE button, all the way
       through the shooting — because the engine offers the approach word on
       DISTANCE alone and the pile stands 1.7 m in front of the firing point.
       `pileInView` and `pointerHitsPile` were already decide-only; the
       distance was not. */
    function pileDist() {
      if (phase !== 'decide') return 999;
      return Math.hypot(yaw.position.x - PILE_POS.x, yaw.position.z - PILE_POS.z);
    }
    function pileScreen() { syncCamera(); return _ndc.set(PILE_POS.x, PILE_POS.y, PILE_POS.z).project(camera); }
    function pileInView() { return phase === 'decide'; }
    function pointerHitsPile() { return phase === 'decide'; }
    function interactPile() {
      if (getState() !== 'play' || phase !== 'decide') return false;
      startDecision();
      return true;
    }

    /* --------------------------------------------------------- THE LANE ZONE
       v12.2. The walk to lane six used to be a waypoint diamond and a
       1.3 m radius that existed only in `updateDay` — nothing on the ground
       said where the firing point was, and nothing said you had arrived. It
       is v8.7's bed zone here: `ZONE_R` is BOTH the radius the rim is drawn
       at and the radius tested, so what is shown and what fires cannot drift
       apart, and the wave phase comes off WALL time so it sweeps at the same
       speed however slow the frame rate is.

       Sodium, not e2c1's red: the objective HUD says the next order in
       sodium and a completion in jade, and on a live range a red circle on
       the ground means something else entirely. Two blends for the v8.8
       reason — a NORMAL-blended tint carries the hue on any ground, an
       ADDITIVE layer on top carries the light. */
    const ZONE_R = 1.35, GLOW_R = 2.1, RIM = ZONE_R / GLOW_R;
    const LINE_ZONE = { x: HIS.x, z: 0.35 };
    const SOD_DEEP = 0xb06000, SOD_HOT = 0xffab3a;
    function glowTex(stops) {
      const sz = 512, [c, g2] = cnv(sz);
      g2.clearRect(0, 0, sz, sz);
      const g = g2.createRadialGradient(sz / 2, sz / 2, 0, sz / 2, sz / 2, sz / 2);
      for (const [r, a] of stops) g.addColorStop(Math.max(0, Math.min(1, r)), `rgba(255,255,255,${a})`);
      g2.fillStyle = g; g2.fillRect(0, 0, sz, sz);
      const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
      madeTex.push(t); return t;
    }
    const zone = new THREE.Group();
    zone.position.set(LINE_ZONE.x, 0.02, LINE_ZONE.z); zone.visible = false; world.add(zone);
    const zonePlane = (tex, r, op, col, add) => {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(r * 2, r * 2),
        new THREE.MeshBasicMaterial({ map: tex, color: col, transparent: true, opacity: op,
          side: THREE.DoubleSide, depthWrite: false, fog: false,
          blending: add ? THREE.AdditiveBlending : THREE.NormalBlending }));
      m.rotation.x = -Math.PI / 2; m.renderOrder = add ? 4 : 3;
      m.userData.moves = true;        // v8.8: anything that animates its own transform is never frozen
      zone.add(m); return m;
    };
    const zoneFill = zonePlane(glowTex([[0, 0.26], [0.55, 0.36], [0.88, 0.72], [0.975, 0.95], [1, 0]]),
                               ZONE_R, 0.72, SOD_DEEP, false);
    const zoneRim = zonePlane(glowTex([[0, 0], [RIM * 0.93, 0], [RIM * 0.975, 0.75], [RIM, 1],
                                       [RIM * 1.03, 0.62], [RIM * 1.10, 0.22], [RIM * 1.26, 0.07], [1, 0]]),
                              GLOW_R, 0.95, SOD_HOT, true);
    const WAVES = 3, WAVE_SECS = 2.1, zoneWaves = [];
    const waveTex = glowTex([[0, 0], [0.80, 0], [0.905, 0.30], [0.965, 1], [0.99, 0.45], [1, 0]]);
    for (let i = 0; i < WAVES; i++) zoneWaves.push(zonePlane(waveTex, GLOW_R, 0.7, SOD_HOT, true));
    function drawZone() {
      const on = phase === 'line';
      if (zone.visible !== on) zone.visible = on;
      if (!on) return;
      const now = performance.now() / 1000;
      const br = 0.5 + 0.5 * Math.sin(now * 2.0);
      zoneFill.material.opacity = 0.50 + 0.16 * br;
      zoneRim.material.opacity = 0.70 + 0.28 * br;
      for (let i = 0; i < WAVES; i++) {
        const k = (((now / WAVE_SECS) + i / WAVES) % 1), e = k * (2 - k);
        zoneWaves[i].scale.setScalar(Math.max(0.001, 0.06 + 0.94 * e));
        zoneWaves[i].material.opacity = 0.75 * Math.min(1, k * 6) * (1 - k) * (1 - k);
      }
    }

    /* ------------------------------------------------------------ hotspots
       Two, and both are the chapter's premise rather than scenery.
       THE RADIO is a press at his own lane: the proper words, said once, in
       the confusion — the thing option A does and the thing the case file
       says to do. It is the only way to bank the report before the decision.
       TRACK is a `dwell` spot (the eighteenth seam, v11.0) whose `pos` is
       MUTATED every frame onto the cyclist: the engine reads h.pos.x on the
       frame, so a moving hotspot is a moving object and nothing else. It is
       the drill the range spent an hour teaching — hold the shape in your
       sight — and the chapter's whole trick is that obeying it is safe. */
    const TOUCH = matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
    const trackPos = { x: 0, y: 1.1, z: -45 };
    const hotspots = [
      /* v12.3: the radio waits for the THING. `beginConfuse` starts the
         cyclist at 3.2 s, and the radio was live from the phase's first
         frame — so the proper words could be said, and the award banked,
         about something that was not on the range yet, and the tower's
         reply landed on an empty arc. It is gated on the same condition the
         track spot uses, which is also the truth: there is nothing to
         report until there is something to report. */
      { id: 'radio', pos: { x: HIS.x + 0.55, y: 1.15, z: 0.45 }, radius: 2.4, anyView: true,
        prompt: TOUCH ? DATA.words.hotRadioTouch : DATA.words.hotRadio, markY: 0.5,
        enabled: () => (phase === 'confuse' || phase === 'moment') && cycOn && cyc.a > 0.3 && !reported,
        onInteract() { return doReport(); } },
      /* v12.3: `markFar` 60, because the drill had no cue on screen at any
         distance the cyclist is ever at — the marker walk clips at 16 m and
         the thing crosses between 22 and 46 — while the badge was owned by
         the radio at half a metre. At thirty metres the diamond renders
         small and dim, which is the right weight for an aid on a ghost.
         `aim` is per-pass for the same reason PASS_Z and PASS_SPD are: at
         4.2 m/s the third pass crosses a fixed 0.10 rad cone in 0.93 s
         against a 1.2 s dwell, so a player holding the sight perfectly
         still could not complete it. The cone opens as the thing speeds up.  */
      { id: 'track', pos: trackPos, radius: 60, markFar: 60, dwell: 1.2,
        get aim() { return PASS_AIM[Math.min(PASS_AIM.length - 1, pass)]; },
        prompt: DATA.words.hotTrack, markY: 0.8,
        enabled: () => (phase === 'confuse' || phase === 'moment') && cycOn && cyc.a > 0.3 && tracked < 1,
        onInteract() { return doTrack(); } },
    ];
    /* the proper words, keyed on the radio: what option A does, said before
       the decision ever opens. It is worth wisdom because it is the drill. */
    function doReport() {
      if (reported) return false;
      reported = true;
      if (worldSfx) worldSfx('rangepa', 0.45);
      queueGap(0.35);
      queueLine('n4report');
      queueGap(0.4);
      queueFn(() => { if (worldSfx) worldSfx('rangepa', 0.45); });
      queueGap(0.4);
      queueLine('t4roger');
      bank({ a: 4, note: 'You reported what you saw, in the proper words.' });
      return true;
    }
    /* the drill obeyed: the shape held in the sight instead of answered */
    function doTrack() {
      if (tracked) return false;
      tracked = 1;
      bank({ a: 3, note: 'You kept it in your sight and kept your lane.' });
      if (kit) kit.haptic(40);
      return true;
    }

    /* ---------------------------------------------------------- per frame */
    function updateNotes(dt, t) {
      for (const r of rigs) if (r.mixer && r.group.visible) r.mixer.update(dt);
      /* ABOVE the guard, the v5.19 shape: a guard meant to own the POSES
         must not silently own the mix as well. */
      mixBeds();
      if (getState() !== 'play') { lastWall = 0; return; }
      const now = performance.now() / 1000;
      /* WALL TIME, for everything that MOVES. `dt` is clamped to 0.05 s, so
         a phone under twenty frames a second ran the flare, the trolley and
         the cyclist at half speed or less — and it is hottest exactly when
         the chapter is busiest (v9.3's clock-mismatch law). The chapter's
         own clock has been on wall time since v7.1; these three were not. */
      const wdt = lastWall ? Math.min(0.5, now - lastWall) : 0.016;
      if (lastWall) dayClock.t += wdt;
      lastWall = now;
      if (!booted) { booted = true; applyPhase(kit ? kit.getPhase() : null); }
      flareFrame(wdt); moverFrame(wdt); cycFrame(wdt);
      /* the moving hotspot rides the thing it is on */
      trackPos.x = cyc.group.position.x; trackPos.z = cyc.group.position.z;
      /* THE WALK TO THE LINE, and reaching it is what ends it — the lane,
         not a button (v8.7's bed zone).

         v12.2: this used to read `phase === 'line' && drawn && ...`, and
         `drawn` only became true when the player found the ammo point's
         hotspot and pressed it. So a player who walked straight to lane six —
         which is what the objective's waypoint was pointing at as soon as he
         had his kit, and the only thing on a range anyone wants to do —
         arrived at the firing point and NOTHING HAPPENED: no load drill, no
         serial, no tower, and a rifle that could not fire either, because
         `weaponAvail()` was false with nothing in the hand slot. One
         conjunct, and it gated the whole chapter. It is gone with the beat
         it belonged to, and ZONE_R is both the circle drawn on the ground
         and the radius tested, so what is shown and what fires cannot drift
         apart (v8.7's law). */
      drawZone();
      if (phase === 'line'
          && Math.hypot(yaw.position.x - LINE_ZONE.x, yaw.position.z - LINE_ZONE.z) < ZONE_R) reachedLine();
      if (phase === 'moment') momentT += wdt;
      runTodo(); runSpeak(); runQueue();
    }
    /* the marker on the ground out in the target area, while the decision is
       open: the one thing on the screen that says where it is standing */
    function updatePile(t) {
      if (getState() === 'cine') { pileRing.visible = false; return; }
      const on = phase === 'decide';
      pileRing.visible = on;
      pileRing.material.opacity = on ? 0.30 + 0.22 * Math.sin(t * 3.1) : 0;
    }
    function updateFire(t) {
      /* the tower's lamp is the only steady light on the line; the flare is
         driven by its own frame. A faint sway so the range is never static. */
      lineFill.intensity = 0.5 + Math.sin(t * 0.7) * 0.06;
      if (cyc.a > 0) cycGlow.intensity = 2.6 * cyc.a * (0.85 + 0.15 * Math.sin(t * 2.3));
    }
    function updateSlow() {}

    /* ---------------------------------------------------------- lifecycle */
    function snap() {
      return { cyc: { x: cyc.group.position.x, y: cyc.group.position.y, z: cyc.group.position.z,
                      ry: cyc.group.rotation.y, a: cyc.a, on: cycOn },
               mover: { x: mover.group.position.x, t: MOVER.t, on: MOVER.on, down: mover.down },
               flare: { on: flareOn, t: flareT, life: flareLife, i: flare.intensity,
                        x: flare.position.x, y: flare.position.y },
               targets: statics.concat(popups, far, [mover]).map(x => x.down) };
    }
    function restore(s) {
      if (!s) return;
      cyc.group.position.set(s.cyc.x, s.cyc.y, s.cyc.z); cyc.group.rotation.y = s.cyc.ry;
      cycOn = !!s.cyc.on; cycAlpha(s.cyc.a || 0); cycWant = cyc.a;
      mover.group.position.x = s.mover.x; MOVER.t = s.mover.t; MOVER.on = !!s.mover.on; mover.set(!!s.mover.down);
      flareOn = !!s.flare.on; flareT = s.flare.t; flareLife = s.flare.life;
      flare.intensity = s.flare.i; flare.position.x = s.flare.x; flare.position.y = s.flare.y;
      flareBall.position.copy(flare.position);
      const all = statics.concat(popups, far, [mover]);
      if (s.targets) for (let i = 0; i < all.length; i++) all[i].set(!!s.targets[i]);
      if (kit) { if (kit.daylight) kit.daylight(flareOn ? FLARE : null, 0); if (kit.weaponOut) kit.weaponOut(null); }
      filmKit.visible = false;   // the film borrowed it; play never has it
      mixBeds();
    }
    /* a replay starts the night again: the flare out, the rail still, the
       thing gone, the receipts spent, the kit back at the ammo point
       (the v8.1 / v8.2 / v8.7 / v9.2 / v9.5 law, a sixth time) */
    function reset() {
      dropTodo(); speakReset(); lineQ.length = 0;
      booted = false; dayClock.t = 0; lastWall = 0;
      flareOn = false; flareT = 0; flareLife = 0; flare.intensity = 0;
      flare.position.set(HIS.x, 46, -72); flareBall.position.copy(flare.position); flareBall.material.opacity = 0;
      MOVER.on = false; MOVER.t = 0; MOVER.dir = 1; mover.group.position.x = MOVER.x0; mover.set(true);
      /* v13.0: DOWN, all of them — item 17's rule holds from the first frame
         of the chapter, not only between waves. (`far` is scenery and is what
         `set(true)` has always left it as.) */
      for (const t of statics.concat(popups, far, [mover])) { t.hit = false; t.set(true); }
      cycEnd(); cyc.group.position.set(0, 0, -45); cyc.group.rotation.y = -Math.PI / 2; cyc.group.scale.setScalar(1);
      pass = 0; cycT = 0; cycStopped = false; shots = 0; tracked = 0; reported = false;
      momentT = 0; bellDone = false; hot = false; serial = 0; hits = 0; early = 0; ending = false;
      /* v12.3: the accumulated LOOK is run state too. `dwellT` is the
         engine's counter on the chapter's own hotspot object, and reset()
         left it wherever the last run stopped — so a player looking at the
         thing when the bell rang banked the tracking award a few frames
         into the replay, for a look he had not taken (the v8.1 / v8.2 /
         v8.7 / v9.2 / v9.5 law, a seventh time). */
      for (const h of hotspots) { h.dwellT = 0; h.done = false; }
      filmKit.visible = false;
      mixBeds();
      if (kit) {
        kit.objective(null); kit.timer(null); kit.waypoint(null); kit.presence(0);
        kit.daylight(null, 0); kit.decisionClock(0); kit.setPhase(null);
        if (kit.hurt) kit.hurt(null); if (kit.root) kit.root(false);
        if (kit.torchOn) kit.torchOn(false);
        if (kit.weaponOut) kit.weaponOut(null);
        if (kit.ammo) kit.ammo(DATA.weapon.rounds, DATA.weapon.mags);
      }
      phase = 'line';
    }
    function blockers() {
      const out = [];
      const solid = (o, pad = 0.14) => {
        o.updateWorldMatrix(true, false);
        const bb = new THREE.Box3().setFromObject(o); bb.expandByScalar(pad);
        bb.min.y = 0; bb.max.y = Math.max(bb.max.y, 1.40); out.push(bb);
      };
      for (const s of solids) solid(s);
      for (const b of boxes) out.push(b);
      for (const b of treeBlockers) out.push(b);
      /* the men on the line: a column each, so nobody walks through a firer */
      for (const m of lineMen.map(x => ({ x: x.group.position.x, z: x.group.position.z })).concat([SAFETY]))
        out.push(new THREE.Box3(new THREE.Vector3(m.x - 0.45, 0, m.z - 0.45),
                                new THREE.Vector3(m.x + 0.45, 1.8, m.z + 0.45)));
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

    /* v8.0's law: a chapter RECORDS what it wants warm; the pack loader
       drains the set when the bytes land. Every line a hotspot or a phase
       can ask for on its first press has to be in here, or the first press
       is silent by construction. */
    if (warmSounds) warmSounds(['n4pro2', 'n4report', 't4roger', 't4load', 't4ready',
                                't4fire1', 't4fire2', 't4fire3', 't4cease', 't4who', 't4neg',
                                'e4wait', 'b4stag', 'b4there', 'b4float', 'n4notarget', 'n4back',
                                'rangepa', 'rifleshot', 'riflecock', 'flarepop', 'flarelaunch', 'targethit',
                                /* v13.0: the sting on the frame the cyclist is SEEN and the three
                                   shouts that land on it — all four are first-press sounds in the
                                   strictest sense: they play once, on one frame, and a cold one
                                   would simply be silent (the v8.0 law). */
                                'stingcyc', 'b4cyc', 'k4cyc', 'r4cyc',
                                /* v12.3: `hudlock` is the arrival at the lane, and it is the
                                   FIRST world sound the chapter asks for — the engine warms its
                                   own HUD cues but this one is played through `worldSfx`, so
                                   nothing decoded it and the one time it fires was silent
                                   (the v8.0 law, a fourth time). */
                                'targetfall', 'bikebell', 'hudlock']);

    const readyAt = performance.now();
    return (S = {
      world, noteTex: null, blockers: blockers(),
      ready: () => (safety.ready && towerMan.ready && lineMen.every(m => m.ready) && cyc.ready && truckReady)
                   || performance.now() - readyAt > 20000,
      pile: { pos: PILE_POS, radius: INTERACT_R, group: pile,
              dist: pileDist, screen: pileScreen, inView: pileInView,
              hits: pointerHitsPile, interact: interactPile,
              glow: () => pileRing.material.opacity },
      drum: null, ash: null, embers: null, heroNote: null, smoke: null, flying: null,
      jossTips: [], fireLight: lineFill,
      get noteStorm() { return 1; },
      set noteStorm(v) {},

      /* v12.0 rifle mode: what a round can hit, and what a round did */
      shootables, onShot,

      // the chapter's own, for the scenes and the probes
      HIS, BUD, SAFETY, TOWER, AMMO, RANGE, LANE, PILE_POS,
      buddy, safety, towerMan, lineMen, cyc, cycGlow, flare, flareBall, lineFill,
      statics, popups, far, mover, MOVER, rail, berm, lanes,
      cycStart, cycEnd, cycAlpha, flareUp, flareDown,
      /* v13.0: the film draws the same climb play draws (`flareFrame` never
         runs under a cutscene), so it borrows the arc rather than copying it */
      flarePlace, flareClimb, FLARE_RISE, FLARE_FROM,
      setMover: (on) => { MOVER.on = !!on; },
      /* the film and the scenes drive the burn themselves: updateNotes
         returns early when the state is not `play`, so flareFrame does not
         run under a cutscene and a flare left to the frame would hang */
      setFlare: (v) => { flare.intensity = v; flareBall.material.opacity = Math.min(1, v / 260); flareBallSize(); },
      FLARE, filmKit, truck,
      sayLine, after, dayClock, bank,
      get phase() { return phase; },
      setPhase, applyPhase, beginSerial, beginStag, beginConfuse, beginMoment, openDecision,
      lookInfo: () => ({ phase, serial, hits, hot, early, shots, tracked, reported,
                         pass, cycOn, cycA: +cyc.a.toFixed(2),
                         cyc: { x: +cyc.group.position.x.toFixed(2), z: +cyc.group.position.z.toFixed(2) },
                         flare: { on: flareOn, t: +flareT.toFixed(1), i: +flare.intensity.toFixed(0) },
                         mover: { on: MOVER.on, x: +mover.group.position.x.toFixed(2) },
                         obj: kit && kit.getPhase ? kit.getPhase() : null }),
      speakInfo: () => ({ t: +dayClock.t.toFixed(2), until: +speak.until.toFixed(2),
                          pending: speak.pending ? speak.pending.name : null, queued: lineQ.length }),
      ambient: () => ({ beds: DATA.ambience.beds.map(b => [b[0], +b[1].toFixed(3)]),
                        trees: TREE_AT.length, targets: statics.length + popups.length + far.length + 1 }),
      updateNotes, updatePile, updateFire, updateSlow,
      setNoteTexture() {},
      snap, restore, reset, dispose,
      hotspots
    });
  }

  /* ------------------------------------------------------------ THE FILM
     THREE shots, all in the range itself — there is no pocket, because the
     range at night IS the set and a film that shows it is the safety brief
     the chapter needs the player to have heard.

     v13.0, Chad's items 8, 11 and 12, which between them reshaped it:
       8 · "the intro cutscene should start from the live range area panning,
           and not the truck. Because on phone, the viewport doesnt see much
           of anything at the start." The tonner shot is GONE. It opened on a
           strip of dark ground framed by a tail-gate, which on a portrait
           phone's centre crop is a black rectangle with a lamp in the corner.
           The film opens on a PAN across the whole range instead — the line,
           the men on it, the berm, the dark beyond — so the first thing a
           phone sees is a moving picture of the place.
       11 · "when the scene lights up, please show the flare going up, with
           sound effects." It is fired on screen now: `flarelaunch`, the
           spark climbing on the chapter's own `flarePlace` arc with the lens
           following it up, and only at the apex the pop and the sky.
       12 · "should just end at the pan to lane 6 after tower says 'shooters
           watch your front, ready'. No need to have another view of the live
           rounds after." The fourth shot, back at the ammo table, is GONE,
           and the film ends on the pan that settles down his own lane.
     43.4 s -> 35.2 s.

     THE FLARE IS DRIVEN BY THE FILM. `updateNotes` returns early when the
     state is not `play`, so `flareFrame` does not run under a cutscene: a
     film that lights one has to burn it itself (`stage.setFlare`,
     `stage.flarePlace`) and hand the sky back with `kit.daylight(null, …)`
     BEFORE its own last frame — the old film handed it back at 36.4 s of a
     43.4 s timeline, and a shorter film would simply have left play under a
     flare sky. */
  function intro(c, s, api) {
    const { tr, step, sfx, fade, camTo, yawTo, pitchTo, faceFrom, rawK, smoothK, stage, armR, kit } = api;
    const HIS = stage.HIS, AMMO = stage.AMMO, TOWER = stage.TOWER;
    const RISE = stage.FLARE_RISE;
    const APEX = 24.2 + RISE;                    // 25.75 — the burst

    step(0, () => {
      armR.visible = false;
      stage.cycEnd(); stage.setFlare(0); stage.setMover(false);
      stage.filmKit.visible = true;
      for (const t of stage.statics) t.set(false);
      for (const t of stage.popups) t.set(true);
      stage.mover.set(true);
      if (kit) { kit.daylight(null, 0); if (kit.weaponOut) kit.weaponOut(false); if (kit.torchOn) kit.torchOn(false); }
    });
    fade(0.0, 0.3, 1, 1);

    /* 0.3 THE RANGE, PANNING (0.3–9.9): from behind the firing line and a
       little above it, the lens crossing the lanes, the men already lying on
       them, and the berm — and coming to rest looking out at ground with
       nothing in it. The camera drifts forward and left under the pan so the
       shot is never a still. */
    camTo(0.3, 9.9, { x: HIS.x + 5.0, y: 3.30, z: 9.8 }, { x: HIS.x + 1.2, y: 3.05, z: 8.4 }, smoothK);
    yawTo(0.3, 9.9, faceFrom(HIS.x + 5.0, 9.8, TOWER.x, TOWER.z),
                    faceFrom(HIS.x + 1.2, 8.4, HIS.x - 11.0, -26.0), smoothK);
    pitchTo(0.3, 9.9, -0.16, -0.05, smoothK);
    fade(0.4, 2.4, 1, 0);
    sfx(1.5, 'n4pro1');                    // "Night two. The live range. After last night, I was glad to have something to point at." (5.72 s)
    fade(9.1, 9.9, 0, 1);

    /* 10.1 THE AMMO POINT (10.1–19.3): the table under its red lamp, a rifle
       and a torch on it, the safety officer beside it. Magazines. (The old
       shot, unchanged, 1.5 s later.) */
    camTo(10.1, 19.3, { x: AMMO.x + 1.5, y: 1.58, z: AMMO.z + 1.9 }, { x: AMMO.x + 0.30, y: 1.30, z: AMMO.z + 1.05 }, smoothK);
    yawTo(10.1, 19.3, faceFrom(AMMO.x + 1.5, AMMO.z + 1.9, AMMO.x, AMMO.z), faceFrom(AMMO.x + 0.30, AMMO.z + 1.05, AMMO.x, AMMO.z), smoothK);
    pitchTo(10.1, 19.3, -0.20, -0.42, smoothK);
    fade(10.1, 11.5, 1, 0);
    sfx(10.8, 'riflereload', 0.7);
    sfx(11.8, 'n4pro2');                   // "Live rounds. Nobody fires until the tower says fire. Simple. Just watch your front." (6.53 s)
    sfx(12.9, 'riflecock', 0.65);
    fade(18.5, 19.3, 0, 1);

    /* 19.5 ON THE LINE, THE FLARE, AND THE PAN TO LANE SIX (19.5–35.2):
       behind his own lane looking out over the berm at ground that has
       nothing in it; the tower's order; THE FLARE FIRED, climbing on the
       same arc play uses, the lens riding up with it on the arc's OWN ease
       (a rocket decelerates, so a smoothstep would lag it at the start and
       overshoot at the end); the pop, the whole arc white, eight boards
       standing at a hundred metres where a second ago there was nothing —
       and then down and across the lit range, settling on lane six. */
    camTo(19.5, 35.2, { x: HIS.x - 1.1, y: 1.62, z: 5.0 }, { x: HIS.x, y: 1.62, z: 1.2 }, smoothK);
    /* the settle is NEGATIVE, which turns the lens toward the launch: forward
       is (−sin yaw, −cos yaw), so a positive yaw looks LEFT of downrange and
       a negative one right, where the flare is fired from. Measured on the
       shipped build with +0.16 the spark projected to ndc.x 1.44 at the frame
       it left the tube — 44 % past the right edge of a portrait phone, i.e.
       exactly the bug being fixed, in its third form. */
    yawTo(19.5, 24.1, faceFrom(HIS.x - 1.1, 5.0, TOWER.x, TOWER.z), -0.16, smoothK);
    pitchTo(19.5, 23.9, -0.02, -0.02, smoothK);
    fade(19.5, 20.7, 1, 0);
    sfx(20.2, 'rangepa', 0.5);
    sfx(20.8, 't4ready');                  // "Shooters. Watch your front. READY." (2.59 s)

    /* THE LAUNCH. `flarePlace(k)` is the chapter's own arc, so what the film
       shows and what play shows are the same climb. */
    step(24.2, () => stage.flareClimb(0));
    sfx(24.2, 'flarelaunch', 0.85);
    tr(24.2, APEX, (k) => stage.flareClimb(k), rawK);
    yawTo(24.1, APEX, -0.16, -0.10, smoothK);
    pitchTo(24.2, APEX, -0.02, 0.52, k => 1 - (1 - k) * (1 - k));   // the arc's own ease

    /* THE BURST, and the burn: up over 1.2 s, held, and falling over its
       last fifth, exactly as flareFrame burns one in play. */
    step(APEX, () => { if (kit) kit.daylight(stage.FLARE, 1.2); });
    sfx(APEX, 'flarepop', 0.95);
    tr(APEX, 35.2, (k, t) => {
      const e = t - APEX;
      const amp = Math.min(1, 0.5 + e / 0.25) * (k > 0.82 ? Math.max(0, 1 - (k - 0.82) / 0.18) : 1);
      stage.setFlare(260 * amp);
    }, rawK);
    pitchTo(APEX + 0.15, 29.1, 0.52, -0.05, smoothK);   // down the lit arc onto the range
    yawTo(APEX + 0.25, 29.4, -0.10, 0.22, smoothK);     // across the lit boards, left
    /* THE PAN TO LANE SIX — where the film ends (item 12) */
    yawTo(29.4, 33.6, 0.22, 0, smoothK);
    pitchTo(29.4, 33.6, -0.05, -0.02, smoothK);
    step(33.4, () => { if (kit) kit.daylight(null, 2.0); });
    fade(33.8, 34.8, 0, 1);
    /* v13.0 (item 17): and it puts the arc back EMPTY. The film raises the
       statics for its flare reveal, and nothing after it lowered them — so
       play began with three boards standing at a hundred metres before a
       single order had been given, which is exactly the "already standing"
       Chad reported. `beginLine` lowers them too, for a resume that never
       plays the film. */
    step(35.0, () => {
      armR.visible = true; stage.setFlare(0);
      for (const t of stage.statics) t.set(true);
      for (const t of stage.popups) t.set(true);
      stage.mover.set(true);
    });
    c.endFade = 1;
    c.keepFade = true;
  }

  /* ---------------------------------------------------------- the scenes
     All four begin where the decision opened: in his lane, facing downrange,
     the thing stopped at the foot of the berm. `P` and `F` read his real
     position and facing off the snapshot, so a scene is right whichever way
     he was standing. Hands hidden in A, B and D; C keeps the rifle, because
     C is what the rifle does. */
  const P = (s) => ({ x: s.yawPos.x, y: s.yawPos.y, z: s.yawPos.z });

  /* A · KEEP YOUR ARC. REPORT IT. CARRY ON. (20.8 s)
     He does not move. It finishes its crossing and goes into the tree line
     without a sound — and then, from the left, the OTHER detail comes off
     the line shouting the thing he decided not to shout. The range is
     closed by the tower. Five men saw it; he has his own, and it is a
     different thing from theirs, which is the lesson in a picture. */
  function scArc(c, s, api) {
    const { tr, step, sfx, fade, camTo, yawTo, pitchTo, rawK, smoothK, stage, handsRoot, kit } = api;
    const P0 = P(s), HIS = stage.HIS;
    step(0, () => {
      handsRoot.visible = false;
      if (kit) { if (kit.hurt) kit.hurt(null); if (kit.root) kit.root(false); if (kit.weaponOut) kit.weaponOut(false); }
      stage.cycStart(3);
      stage.setMover(false);
    });
    fade(0, 0.25, 0, 0);
    /* the dying flare over the whole scene */
    tr(0, 14.0, k => stage.setFlare(150 * Math.max(0, 1 - k)), rawK);
    /* 0–7.2 it crosses out to the right and goes into the trees */
    camTo(0, 7.2, { x: P0.x, y: 1.62, z: P0.z }, { x: P0.x, y: 1.62, z: P0.z }, rawK);
    yawTo(0, 7.2, 0.0, -0.44, smoothK);
    pitchTo(0, 7.2, -0.04, -0.02, smoothK);
    tr(0, 7.2, k => {
      stage.cyc.group.position.set(HIS.x - 1.2 + k * 17.5, 0, -8 - k * 2.0);
      stage.cyc.group.rotation.y = -Math.PI / 2;
      stage.cycAlpha(k > 0.78 ? Math.max(0, (1 - k) / 0.22) : 1);
    }, rawK);
    sfx(0.4, 'chain', 0.5);
    step(7.3, () => stage.cycEnd());
    /* 7.6 THE OTHER DETAIL COMES OFF THE LINE, to the left */
    yawTo(7.6, 9.4, -0.44, 1.15, smoothK);
    sfx(7.8, 'r4run');                     // "Get off the line! Somebody in the lalang! GO! GO!"
    sfx(11.5, 'k4shout');                  // "Eh, what is that? The bicycle! It's floating! Look over there!"
    tr(9.4, 12.6, (k, t) => { api.camera.rotation.z = Math.sin(t * 7.5) * 0.018 * (1 - k); }, rawK);
    sfx(15.8, 'e4down');                   // "STOP! Weapons DOWN! Muzzle down the range! DOWN!"
    /* 16 the tower closes the range, and the lens comes back to his own lane */
    yawTo(16.2, 19.8, 1.15, 0.0, smoothK);
    pitchTo(16.2, 19.8, -0.02, -0.12, smoothK);
    step(19.6, () => { api.camera.rotation.z = 0; });
    sfx(19.9, 'rangepa', 0.5);
    sfx(20.4, 't4endex');                  // "All lanes. Cease fire. Unload, clear weapons. The range is closed."
    fade(25.9, 26.9, 0, 1);
    step(27.0, () => { handsRoot.visible = true; });
    /* THE DAWN — and it has to fire INSIDE the scene's own length. `c.dur` is
       the maximum t1 of the TRACKS (playCineFn), and a sting is not a track,
       so a cue written past the last track is simply never reached: all four
       endings cued n4dawn 0.1-0.2 s after their last step, so the chapter's
       closing line — the sentence that loads chapter 5 — has never once
       played. It starts under the fade to black now and runs on under the
       card, which is what the note below always described, and chaptertest
       fails the build if any cue in any chapter is ever late again. */
    sfx(26.6, 'n4dawn');
    c.endFade = 1;
  }

  /* B · PUT THE TORCH ON IT AND GO CLOSER (22 s)
     Forward of the line, which the brief said never to do. The safety
     officer behind him, the tower calling a man on the range, the walk down
     the arc under a dying flare — and the ground where it was is empty. The
     chain starts again BEHIND him, between him and the line. */
  function scCloser(c, s, api) {
    const { tr, step, sfx, fade, camTo, yawTo, pitchTo, rawK, smoothK, stage, handsRoot, kit } = api;
    const P0 = P(s), HIS = stage.HIS;
    step(0, () => {
      handsRoot.visible = false;
      if (kit) { if (kit.hurt) kit.hurt(null); if (kit.root) kit.root(false); if (kit.weaponOut) kit.weaponOut(false); if (kit.torchOn) kit.torchOn(true); }
      stage.cycStart(3); stage.setMover(false);
    });
    fade(0, 0.25, 0, 0);
    tr(0, 16.0, k => stage.setFlare(120 * Math.max(0, 1 - k * 1.2)), rawK);
    /* 0–2.4 he stands. 2.4–11 over the berm and down the arc. */
    sfx(0.6, 'e4line');                    // "LANE SIX! GET BACK ON THE LINE! NOW!"
    sfx(4.6, 'rangepa', 0.5);
    sfx(5.2, 't4man');                     // "ALL LANES CEASE FIRE! Man on the range! Lane six is forward of the line!"
    camTo(0, 2.4, { x: P0.x, y: 1.62, z: P0.z }, { x: HIS.x, y: 1.66, z: -1.4 }, smoothK);
    camTo(2.4, 12.4, { x: HIS.x, y: 1.66, z: -1.4 }, { x: HIS.x + 0.6, y: 1.62, z: -9.6 }, smoothK);
    tr(2.4, 12.4, (k, t) => { api.yaw.position.y = 1.62 + Math.sin(t * 5.2) * 0.035; }, rawK);
    yawTo(0, 12.4, 0.0, 0.06, smoothK);
    pitchTo(0, 12.4, -0.04, -0.34, smoothK);
    step(2.5, () => { stage.cycEnd(); });   // it is not there when he gets there
    /* 12.4–16 the torch on empty ground, tyre tracks that stop */
    pitchTo(12.4, 16.0, -0.34, -0.62, smoothK);
    yawTo(12.4, 16.0, 0.06, -0.30, smoothK);
    /* 16.4 THE CHAIN, BEHIND HIM — and the turn */
    sfx(16.4, 'chain', 0.85);
    yawTo(17.2, 20.0, -0.30, Math.PI + 0.04, smoothK);
    pitchTo(17.2, 20.0, -0.62, -0.06, smoothK);
    step(19.0, () => { stage.cycStart(3); stage.cyc.group.position.set(HIS.x + 0.4, 0, -2.6); stage.cyc.group.rotation.y = 0; });
    sfx(20.2, 'bikebell', 0.9);
    tr(20.2, 22.0, (k, t) => { api.camera.rotation.z = Math.sin(t * 9) * 0.02 * (1 - k); }, rawK);
    fade(21.4, 22.6, 0, 1);
    step(22.8, () => { handsRoot.visible = true; api.camera.rotation.z = 0; if (kit && kit.torchOn) kit.torchOn(false); });
    sfx(22.4, 'n4dawn');                   // the dawn, under the card (scene A's note)
    c.endFade = 1;
  }

  /* C · FIRE AT IT UNTIL IT STOPS COMING (21 s)
     The rifle stays up — this is the one scene the weapon belongs in. Three
     more rounds; each flash empties the ground and each flare puts it back
     nearer, until it is close enough to see there is no face on it, and it
     does not move. Then the whole line is shouting at HIM, and the rifle is
     taken out of his hands. */
  function scFire(c, s, api) {
    const { tr, step, sfx, fade, yawTo, pitchTo, rawK, smoothK, stage, kit } = api;
    const HIS = stage.HIS;
    const at = (z, x) => { stage.cycStart(3); stage.cyc.group.position.set(HIS.x + (x || 0), 0, z); stage.cyc.group.rotation.y = Math.PI; };
    step(0, () => {
      if (kit) { if (kit.hurt) kit.hurt(null); if (kit.root) kit.root(false); if (kit.weaponOut) kit.weaponOut(true); }
      stage.setMover(false); at(-8);
    });
    fade(0, 0.25, 0, 0);
    yawTo(0, 21.0, 0.0, 0.0, rawK);
    pitchTo(0, 2.4, -0.04, -0.02, smoothK);
    /* three rounds: flash, gone, back nearer, on a flare each time */
    const round = (t0, z) => {
      sfx(t0, 'rifleshot', 0.9);
      step(t0, () => { stage.cycEnd(); stage.setFlare(240); });
      tr(t0, t0 + 0.14, k => stage.setFlare(240 * (1 - k)), rawK);
      step(t0 + 1.9, () => { at(z); stage.setFlare(140); });
      tr(t0 + 1.9, t0 + 3.4, k => stage.setFlare(140 * (1 - 0.55 * k)), rawK);
      sfx(t0 + 2.0, 'chain', 0.6);
    };
    round(1.2, -6.2); round(5.0, -4.6); round(8.8, -3.1);
    /* 12.6 it is close, and it is not a man */
    tr(12.6, 17.0, k => stage.setFlare(62 * (1 - k)), rawK);
    pitchTo(12.6, 15.4, -0.02, 0.02, smoothK);
    sfx(13.0, 'ghostlaugh', 0.55);
    sfx(15.6, 't4who');                    // "CEASE FIRE! Who fired? Lane five. What are you firing at?"
    step(16.0, () => { if (kit && kit.weaponOut) kit.weaponOut(false); });
    sfx(21.2, 'e4down');                   // "STOP! Weapons DOWN! Muzzle down the range! DOWN!" (t4who runs to 20.85)
    tr(16.0, 18.4, (k, t) => { api.camera.rotation.z = Math.sin(t * 6.5) * 0.02 * (1 - k); }, rawK);
    pitchTo(16.0, 20.0, 0.02, -0.34, smoothK);
    step(20.2, () => { api.camera.rotation.z = 0; });
    fade(25.2, 26.2, 0, 1);
    sfx(25.8, 'n4dawn');                   // the dawn, under the card (scene A's note)
    c.endFade = 1;
  }

  /* D · GET UP AND RUN (18.6 s)
     Off the line, the rifle dropped, the lalang — and straight into the
     other detail running the same way, shouting the same thing. Nobody
     looks back down the arc. */
  function scRun(c, s, api) {
    const { tr, step, sfx, fade, camTo, yawTo, pitchTo, rawK, smoothK, stage, handsRoot, kit } = api;
    const P0 = P(s), HIS = stage.HIS, AMMO = stage.AMMO;
    step(0, () => {
      handsRoot.visible = false;
      if (kit) { if (kit.hurt) kit.hurt(null); if (kit.root) kit.root(false); if (kit.weaponOut) kit.weaponOut(false); }
      stage.cycStart(3); stage.setMover(false);
    });
    fade(0, 0.25, 0, 0);
    tr(0, 12.0, k => stage.setFlare(110 * Math.max(0, 1 - k * 1.4)), rawK);
    sfx(0.3, 'bikebell', 0.85);
    /* 0.6 the turn and the run back past the ammo point */
    yawTo(0.6, 2.2, 0.0, Math.PI - 0.2, smoothK);
    camTo(1.4, 10.6, { x: P0.x, y: 1.62, z: P0.z }, { x: AMMO.x + 1.2, y: 1.62, z: AMMO.z + 2.6 }, rawK);
    tr(1.4, 10.6, (k, t) => {
      api.yaw.position.y = 1.62 + Math.abs(Math.sin(t * 8.4)) * 0.075;
      api.camera.rotation.z = Math.sin(t * 8.4) * 0.028;
    }, rawK);
    pitchTo(1.4, 6.0, -0.04, -0.16, smoothK);
    sfx(2.0, 'r4run');                     // "Get off the line! Somebody in the lalang! GO! GO!"
    sfx(6.0, 'k4shout');                   // "Eh, what is that? The bicycle! It's floating! Look over there!"
    yawTo(6.4, 8.6, Math.PI - 0.2, Math.PI + 0.42, smoothK);
    /* 10.6 he stops at the tonner and nobody turns round */
    tr(10.6, 12.2, (k, t) => { api.camera.rotation.z = Math.sin(t * 8.4) * 0.028 * (1 - k); api.yaw.position.y = 1.62 + Math.abs(Math.sin(t * 8.4)) * 0.075 * (1 - k); }, rawK);
    step(12.3, () => { api.camera.rotation.z = 0; api.yaw.position.y = 1.62; });
    sfx(12.6, 'rangepa', 0.5);
    sfx(13.2, 't4endex');                  // "All lanes. Cease fire. Unload, clear weapons. The range is closed."
    pitchTo(12.4, 16.0, -0.16, -0.05, smoothK);
    fade(18.6, 19.6, 0, 1);
    step(19.8, () => { handsRoot.visible = true; });
    sfx(19.4, 'n4dawn');                   // the dawn, under the card (scene A's note)
    c.endFade = 1;
  }

  (window.__CHAPTERS__ = window.__CHAPTERS__ || {}).e2c4 = Object.assign(DATA, {
    build,
    intro,
    scenes: [scArc, scCloser, scFire, scRun]
  });
})();
