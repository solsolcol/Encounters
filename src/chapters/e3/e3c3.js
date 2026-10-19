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
    assets: ['buddhahd', 'buddhalod', 'timkp'],
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
  const SECS = {};

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

    /* ------------------------------------------------------------- the map */
    const SHOP = { x0: -4.5, x1: 4.5, z0: -7.0, z1: 0.0, H: 2.9 };
    const MALL = { x0: -14, x1: 14, z0: 0.0, z1: 5.0, H: 3.6 };
    const SHR = { x: -250, z: 0 };                       // WORLD B's origin
    const SHRINE_IN = { x0: SHR.x - 4.5, x1: SHR.x + 4.5, z0: -10.0, z1: 0.0, H: 3.4 };
    const MAT = { x: -0.9, z: -4.6 };                    // his mat at the celebration

    /* ----------------------------------------------------------- materials */
    const noteTex = makeHellNote();
    madeTex.push(noteTex);
    const matFloor = new THREE.MeshStandardMaterial({ color: 0xd9d2c4, roughness: 0.6 });
    const matWall  = new THREE.MeshStandardMaterial({ color: 0xece6da, roughness: 0.9 });
    const matDark  = new THREE.MeshStandardMaterial({ color: 0x15100e, roughness: 0.8 });
    const matRed   = new THREE.MeshStandardMaterial({ color: 0x8e1d14, roughness: 0.5 });
    const matProxy = new THREE.MeshStandardMaterial({ color: 0x8d7a66, roughness: 0.9 });

    const world = new THREE.Group();
    scene.add(world);

    const walls = [], solids = [];
    const box = (w, h, d, x, y, z, mat, parent = world, cast = true) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
      m.position.set(x, y, z); m.castShadow = cast && !LOW; m.receiveShadow = true;
      parent.add(m); return m;
    };

    /* --------------------------------------------- WORLD A · placeholder shell */
    const floorA = new THREE.Mesh(new THREE.PlaneGeometry(SHOP.x1 - SHOP.x0, SHOP.z1 - SHOP.z0), matFloor);
    floorA.rotation.x = -Math.PI / 2; floorA.position.set(0, 0, (SHOP.z0 + SHOP.z1) / 2); floorA.receiveShadow = true;
    world.add(floorA);
    walls.push(box(SHOP.x1 - SHOP.x0, SHOP.H, 0.2, 0, SHOP.H / 2, SHOP.z0 - 0.1, matWall));
    walls.push(box(0.2, SHOP.H, SHOP.z1 - SHOP.z0, SHOP.x0 - 0.1, SHOP.H / 2, (SHOP.z0 + SHOP.z1) / 2, matWall));
    walls.push(box(0.2, SHOP.H, SHOP.z1 - SHOP.z0, SHOP.x1 + 0.1, SHOP.H / 2, (SHOP.z0 + SHOP.z1) / 2, matWall));
    walls.push(box(SHOP.x1 - SHOP.x0, SHOP.H, 0.2, 0, SHOP.H / 2, SHOP.z1 + 0.1, matDark));

    /* --------------------------------------------- WORLD B · placeholder shell */
    const floorB = new THREE.Mesh(new THREE.PlaneGeometry(9, 12.2), matFloor);
    floorB.rotation.x = -Math.PI / 2; floorB.position.set(SHR.x, 0, -3.9); floorB.receiveShadow = true;
    world.add(floorB);
    walls.push(box(9, SHRINE_IN.H, 0.2, SHR.x, SHRINE_IN.H / 2, SHRINE_IN.z0 - 0.1, matRed));
    walls.push(box(0.2, SHRINE_IN.H, 12.2, SHRINE_IN.x0 - 0.1, SHRINE_IN.H / 2, -3.9, matWall));
    walls.push(box(0.2, SHRINE_IN.H, 12.2, SHRINE_IN.x1 + 0.1, SHRINE_IN.H / 2, -3.9, matWall));
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
    function updateNotes(dt, t) {
      if (getState() !== 'play') { lastWall = 0; return; }
      const now = performance.now() / 1000;
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

  (window.__CHAPTERS__ = window.__CHAPTERS__ || {}).e3c3 = Object.assign(DATA, {
    build,
    intro,
    scenes: [scAccept, scWrong, scLeave, scSeek]
  });
})();
