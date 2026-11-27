/* Fixture chapter · "The Empty Room"
   ---------------------------------------------------------------------------
   Not a chapter of the game. This is the SECOND chapter, and its whole job is
   to be one: with only ch1 in the folder, every claim the engine makes about
   being chapter-agnostic is untested, because there is nothing to be agnostic
   about. A `?ch=chtest` boot proves the seam is real — that the engine can
   build a world it has never seen, from a file it does not know the name of,
   with no location model, no bespoke assets, and no edits to main.js.

   It is also the cheap surface: primitives only, no GLB, no textures worth
   the name, so a harness that only needs "a world, a thing to act on, four
   choices and four scenes" can have one in a fraction of the frames a real
   void deck costs under SwiftShader.

   It is deliberately built against the SAME contract as ch1 — build(ctx)
   returning the same handle, scenes taking (c, s, api) — so if the engine
   ever grows a hidden dependency on chapter 1 specifically, this is what
   goes red. Keep it in sync with the contract, never with ch1's content.

   The words here are placeholders and are deliberately NOT in the text sheet:
   nothing a player will ever read lives in this file.                       */

(() => {
  'use strict';

  let S = null;

  const DATA = {
    /* v14.15: the items this chapter can hand out (kit.give), so the engine prepares
       their models behind the entry curtain rather than in play. chaptertest checks it. */
    items: ['amulet'],
    id: 99,
    episode: 1,            // the fixture rides with episode 1 (v6.0)
    title: 'The Empty Room',
    cardLabel: 'Fixture',
    cardTitle: 'The Empty Room<br>A Test Of The Seam',
    brief: 'A bare room with one thing in it. Not part of the game.',
    prompt: 'There is a marker on the floor. What do you do?',
    choices: [
      { k: 'A', text: 'Take it.', d: { sanity: -10, awareness: -5, wisdom: -5 },
        verdict: 'bad', say: 'You take it.', teach: 'Taking has a cost.' },
      { k: 'B', text: 'Break it.', d: { sanity: -15, awareness: -5, wisdom: -10 },
        verdict: 'worst', say: 'You break it.', teach: 'Breaking has a bigger one.' },
      { k: 'C', text: 'Look at it.', d: { sanity: 0, awareness: 15, wisdom: 5 },
        verdict: 'good', say: 'You look at it.', teach: 'Looking costs nothing.' },
      { k: 'D', text: 'Leave it be.', d: { sanity: 10, awareness: 5, wisdom: 15 },
        verdict: 'best', say: 'You leave it be.', teach: 'Leaving is also an answer.' }
    ],
    core: 'A fixture, not a teaching.',

    spawn:     { x: 0, y: 1.62, z: 9 },
    shrine:    { x: 0, z: -3 },
    ghostHome: { x: -2, z: -6 },
    bounds:    { minX: -11, maxX: 11, minZ: -11, maxZ: 11 },

    // nothing heavy at all: the engine's shared files are all this needs
    assets: [],

    /* v7.0: the play kit, declared — so `fixturetest` can prove every seam on
       a world the engine has never seen. A torch (off until asked), and the
       banner's words for an unseen presence. */
    torch: { on: false, angle: 0.5 },
    /* v26.1: the forty-ninth seam, a chapter's own drawing budget on a phone (fixturetest K.renderSeam): declared here at
       a number no real chapter uses, so the proof cannot pass on a default */
    render: { phoneRatio: 1.9 },
    /* v12.0: RIFLE MODE, declared with NO model — the seam (out while the
       item is in the hand slot, fire spends a round, the ray reaches the
       chapter's target, reload costs a magazine) is proved without the
       download. Three rounds and one spare magazine, so `empty` is reachable. */
    weapon: { item: 'rifle', rounds: 3, mags: 1, fireGap: 0.05, shot: 'uiclick', reload: 'uiclick', empty: 'uiclick' },
    /* v27.0: SPIRIT VISION (the fiftieth seam), declared with the engine's own look and no sounds of its own: the button,
       V, the wave out and home, the pass while it is open and the world's own drawing once it is home, a spirit drawn
       only through it (`ctx.spirit`), a held radius, and kitReset shutting it (fixturetest K.visionSeam) */
    vision: {},
    /* v28.0: THE TAG MODE (the sixtieth seam), declared with the plan's own camera (behind and above the played one:
       docs/V28.0-E4C5-PLAN.md §5.6) and an upright screen's own numbers (so the proof sees the screen's shape choose), a box
       for the lens inside the room; the fixture's fight below is plain shapes (the fixture is not part of the game) and
       exercises seams 60 to 65 (fixturetest K.tag*) */
    tag: { heading: 0, boom: { back: 4.0, up: 3.1, pitch: 26 }, portrait: { back: 4.4, up: 3.4, pitch: 26, fov: 74 },
           camBox: { minX: -10.4, maxX: 10.4, minZ: -10.4, maxZ: 10.2 }, lock: 0.6, glide: 0.4 },
    words: { presence: 'Something is in the room.' }
  };

  function build(ctx) {
    const { THREE, scene, camera, yaw, getState, startDecision, kit } = ctx;
    const SHRINE = new THREE.Vector3(DATA.shrine.x, 0, DATA.shrine.z);
    const owned = [];

    const world = new THREE.Group();
    scene.add(world);

    // one material for the walls, and it is what blockers() looks for
    const matWall = new THREE.MeshStandardMaterial({ color: 0x3a3f46, roughness: 0.95 });
    const matFloor = new THREE.MeshStandardMaterial({ color: 0x23262b, roughness: 0.98 });

    const floor = new THREE.Mesh(new THREE.PlaneGeometry(24, 24), matFloor);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    world.add(floor);

    // four walls, boxes at standing height so they read as blockers
    const wallGeo = new THREE.BoxGeometry(24, 3.2, 0.4);
    for (const [x, z, ry] of [[0, -11.5, 0], [0, 11.5, 0],
                              [-11.5, 0, Math.PI / 2], [11.5, 0, Math.PI / 2]]) {
      const w = new THREE.Mesh(wallGeo, matWall);
      w.position.set(x, 1.6, z);
      w.rotation.y = ry;
      w.castShadow = w.receiveShadow = true;
      world.add(w);
    }

    // the fire: a plain point light, so updateFire has something to drive
    const fireLight = new THREE.PointLight(0xff7a26, 14, 16, 1.7);
    fireLight.position.set(SHRINE.x, 0.95, SHRINE.z);
    scene.add(fireLight); owned.push(fireLight);

    // stand-ins for the props a scene is allowed to borrow. They exist so the
    // handle's shape is honest, not because this fixture animates them.
    const matProp = new THREE.MeshStandardMaterial({ color: 0x8a6a3a, roughness: 0.8 });
    const drum = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.36, 0.9, 10), matProp);
    drum.position.set(SHRINE.x, 0.45, SHRINE.z);
    world.add(drum);
    const ash = new THREE.Mesh(new THREE.CircleGeometry(0.34, 10),
      new THREE.MeshBasicMaterial({ color: 0xff5a12 }));
    ash.rotation.x = -Math.PI / 2;
    ash.position.set(SHRINE.x, 0.72, SHRINE.z);
    world.add(ash);
    const heroNote = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 0.15), matProp);
    heroNote.rotation.x = -Math.PI / 2;
    heroNote.position.set(SHRINE.x + 1, 0.05, SHRINE.z + 1);
    world.add(heroNote);

    const noteTex = new THREE.DataTexture(new Uint8Array([200, 170, 90, 255]), 1, 1);
    noteTex.needsUpdate = true;

    // particles, in the same shapes the engine drives them in
    const mkPoints = (n, size, y) => {
      const g = new THREE.BufferGeometry();
      const a = new Float32Array(n * 3);
      for (let i = 0; i < n; i++) {
        a[i * 3] = SHRINE.x + (Math.random() - 0.5);
        a[i * 3 + 1] = y + Math.random();
        a[i * 3 + 2] = SHRINE.z + (Math.random() - 0.5);
      }
      g.setAttribute('position', new THREE.BufferAttribute(a, 3));
      const p = new THREE.Points(g, new THREE.PointsMaterial({
        size, transparent: true, opacity: 0.4, depthWrite: false }));
      world.add(p);
      return p;
    };
    const SMOKE_N = 20, EM_N = 12;
    const smoke = mkPoints(SMOKE_N, 2.0, 0.9);
    const embers = mkPoints(EM_N, 0.08, 0.8);
    const sSeed = new Float32Array(SMOKE_N).map(() => Math.random() * 100);
    const flying = new THREE.InstancedMesh(
      new THREE.PlaneGeometry(0.3, 0.15), matProp, 8);
    flying.frustumCulled = false;
    world.add(flying);
    const jossTips = [];
    let noteStorm = 1;

    /* ------------------------------------------------------- the pile ---
       The one thing you can act on, and the only part of this fixture that
       has to behave exactly like the real one: the engine's prompts, hints,
       narration and tap handling all read these.                          */
    const PILE_POS = new THREE.Vector3(SHRINE.x + 1.15, 0, SHRINE.z + 1.55);
    const INTERACT_R = 5.0;
    const pile = new THREE.Group();
    pile.position.copy(PILE_POS);
    world.add(pile);
    const pileMat = new THREE.MeshStandardMaterial({ color: 0xc8b070, roughness: 0.85 });
    const pileNotes = [];
    for (let i = 0; i < 4; i++) {
      const n = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.02, 0.16), pileMat);
      n.position.set((Math.random() - 0.5) * 0.3, 0.02 + i * 0.02, (Math.random() - 0.5) * 0.3);
      n.castShadow = n.receiveShadow = true;
      pile.add(n);
      pileNotes.push(n);
    }
    const pileRing = new THREE.Mesh(
      new THREE.RingGeometry(0.5, 0.64, 16),
      new THREE.MeshBasicMaterial({ color: 0x63d6c8, transparent: true, opacity: 0,
        side: THREE.DoubleSide, blending: THREE.AdditiveBlending,
        depthWrite: false, fog: false }));
    pileRing.rotation.x = -Math.PI / 2;
    pileRing.position.y = 0.03;
    pileRing.visible = false;
    pile.add(pileRing);

    const _ndc = new THREE.Vector3(), _ray = new THREE.Raycaster(), _ptr = new THREE.Vector2();
    const syncCamera = () => {
      camera.updateWorldMatrix(true, false);
      camera.matrixWorldInverse.copy(camera.matrixWorld).invert();
    };
    function pileDist() {
      return Math.hypot(yaw.position.x - PILE_POS.x, yaw.position.z - PILE_POS.z);
    }
    function pileScreen() {
      syncCamera();
      return _ndc.set(PILE_POS.x, 0.15, PILE_POS.z).project(camera);
    }
    function pileInView() {
      const n = pileScreen();
      return n.z < 1 && Math.abs(n.x) < 0.97 && Math.abs(n.y) < 0.97;
    }
    function pointerHitsPile(cx, cy) {
      if (pileDist() > INTERACT_R) return false;
      syncCamera();
      _ptr.set((cx / innerWidth) * 2 - 1, -(cy / innerHeight) * 2 + 1);
      _ray.setFromCamera(_ptr, camera);
      if (_ray.intersectObjects(pileNotes, false).length) return true;
      const n = pileScreen();
      if (n.z > 1) return false;
      const sx = (n.x * 0.5 + 0.5) * innerWidth, sy = (-n.y * 0.5 + 0.5) * innerHeight;
      return Math.hypot(cx - sx, cy - sy) < Math.min(innerWidth, innerHeight) * 0.11;
    }
    function interactPile() {
      if (getState() !== 'play' || pileDist() >= INTERACT_R) return false;
      startDecision();
      return true;
    }
    function updatePile(t) {
      if (getState() === 'cine') { pileRing.visible = false; return; }
      const near = THREE.MathUtils.clamp((8 - pileDist()) / (8 - INTERACT_R), 0, 1);
      pileRing.visible = near > 0.01;
      pileRing.material.opacity = near * (0.62 + 0.38 * Math.sin(t * 2.6)) * 0.58;
    }

    function updateNotes(dt, t) {
      fightTick();                       // v28.0: the fixture's fight (seams 60 to 65), only while it is open
      const m = new THREE.Matrix4();
      for (let i = 0; i < 8; i++) {
        m.setPosition(SHRINE.x + Math.cos(t * noteStorm + i) * 2,
                      1 + ((t * 0.3 + i) % 4),
                      SHRINE.z + Math.sin(t * noteStorm + i) * 2);
        flying.setMatrixAt(i, m);
      }
      flying.instanceMatrix.needsUpdate = true;
    }
    function updateFire(t) {
      const fl = 0.75 + Math.sin(t * 11.3) * 0.14 + Math.random() * 0.08;
      if (getState() !== 'cine') {
        fireLight.intensity = 14 * fl;
        ash.material.color.setHSL(0.045, 1, 0.35 + fl * 0.16);
      }
    }
    function updateSlow(sdt, t) {
      for (const [pts, n, top, base] of [[smoke, SMOKE_N, 4.6, 0.9], [embers, EM_N, 3.6, 0.8]]) {
        const a = pts.geometry.attributes.position.array;
        for (let i = 0; i < n; i++) {
          a[i * 3 + 1] += sdt * 0.4;
          if (a[i * 3 + 1] > top) a[i * 3 + 1] = base;
        }
        pts.geometry.attributes.position.needsUpdate = true;
      }
    }

    function snap() {
      return { drumPos: drum.position.clone(), drumRotZ: drum.rotation.z,
               ashVis: ash.visible, hero: heroNote.visible, storm: noteStorm,
               emberSize: embers.material.size, emberOp: embers.material.opacity };
    }
    function restore(s) {
      drum.position.copy(s.drumPos); drum.rotation.z = s.drumRotZ;
      ash.visible = s.ashVis; heroNote.visible = s.hero; noteStorm = s.storm;
      embers.material.size = s.emberSize; embers.material.opacity = s.emberOp;
    }
    const DRUM_REST = { pos: drum.position.clone(), rotZ: drum.rotation.z };
    function reset() {
      drum.position.copy(DRUM_REST.pos); drum.rotation.z = DRUM_REST.rotZ;
      drum.rotation.y = 0;               // v28.0: the `lay` film's turn, if a reset comes inside it
      ash.visible = true; heroNote.visible = true; noteStorm = 1;
      fightReset();                      // v28.0: and no fight left open (kitReset has already left the mode)
    }

    /* v16.4 · THE GROUND (the twenty-first seam): a platform 0.9 m high on the
       east side with a ramp up to it from the west — the eye rides it, the ramp
       is walkable and the platform's wall is not (fixturetest proves all three) */
    const PLAT = { x0: 8.2, x1: 10.4, z0: -1.2, z1: 1.2, h: 0.9, rx0: 6.0 };
    {
      const pm = new THREE.MeshStandardMaterial({ color: 0x8a8a90, roughness: 0.9 });
      const pl = new THREE.Mesh(new THREE.BoxGeometry(PLAT.x1 - PLAT.x0, PLAT.h, PLAT.z1 - PLAT.z0), pm);
      pl.position.set((PLAT.x0 + PLAT.x1) / 2, PLAT.h / 2, 0); world.add(pl);
      const L = PLAT.x0 - PLAT.rx0, ramp = new THREE.Mesh(new THREE.BoxGeometry(Math.hypot(L, PLAT.h), 0.05, 1.2), pm);
      ramp.position.set((PLAT.x0 + PLAT.rx0) / 2, PLAT.h / 2, 0); ramp.rotation.z = Math.atan2(PLAT.h, L); world.add(ramp);
    }
    function groundAt(x, z) {
      if (x >= PLAT.x0 && x <= PLAT.x1 && z >= PLAT.z0 && z <= PLAT.z1) return PLAT.h;
      if (x > PLAT.rx0 && x < PLAT.x0 && Math.abs(z) <= 0.6) return PLAT.h * (x - PLAT.rx0) / (PLAT.x0 - PLAT.rx0);
      return 0;
    }

    function blockers() {
      const out = [];
      world.traverse(o => {
        if (o.isMesh && o.material === matWall) {
          o.updateWorldMatrix(true, false);
          const b = new THREE.Box3().setFromObject(o);
          b.expandByScalar(0.28);
          out.push(b);
        }
      });
      return out;
    }

    /* ------------------------------------------------ v7.0: the play kit --
       Three hotspots, each exercising a different verb, and an objective set
       from INSIDE build() — which runs during module init, before the HUD
       exists, and is exactly the call the kit promises to survive.       */
    const lamp = new THREE.PointLight(0xfff1c8, 0, 12, 1.8);
    lamp.position.set(-6, 2.4, -6);
    scene.add(lamp); owned.push(lamp);
    let lampOn = false;
    /* v14.7: a RELIC on a plinth, and the ball a tap on it lands on (never
       drawn; a raycast still finds it). Episode 1 chapter 3's amulet is the
       real one; this is the seam without the staging. */
    const RELIC = { x: -6, z: 6 };
    const plinth = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.9, 0.4), pileMat);
    plinth.position.set(RELIC.x, 0.45, RELIC.z);
    world.add(plinth);
    const relic = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.16, 0.03),
      new THREE.MeshStandardMaterial({ color: 0xd8b04a, roughness: 0.4, metalness: 0.3 }));
    relic.position.set(RELIC.x, 0.99, RELIC.z);
    world.add(relic);
    const relicProxy = new THREE.Mesh(new THREE.SphereGeometry(0.22, 10, 8),
      new THREE.MeshBasicMaterial({ visible: false }));
    relicProxy.position.copy(relic.position);
    world.add(relicProxy);
    function pointerHitsRelic(cx, cy) {
      if (!relic.visible) return false;
      syncCamera();
      _ptr.set((cx / innerWidth) * 2 - 1, -(cy / innerHeight) * 2 + 1);
      _ray.setFromCamera(_ptr, camera);
      return _ray.intersectObject(relicProxy, false).length > 0;
    }
    const hotspots = [
      { id: 'switch', pos: { x: -6, y: 1.2, z: -6 }, radius: 2.4, prompt: 'Flip the switch',
        onInteract() {
          lampOn = !lampOn; lamp.intensity = lampOn ? 18 : 0;
          if (kit) kit.conduct({ a: 3, note: lampOn ? 'You turned the light on.' : 'You turned the light off.' });
          return true;
        } },
      { id: 'bed', pos: { x: 6, y: 0.6, z: 6 }, radius: 2.4, prompt: 'Lie down',
        onInteract() {
          if (!kit) return false;
          kit.pose(kit.getPose() === 'lying' ? 'standing' : 'lying', { y: 0.62 });
          return true;
        } },
      { id: 'panel', pos: { x: 6, y: 1.2, z: -6 }, radius: 2.4, prompt: 'Trace the pipes', once: true,
        onInteract() {
          if (!kit) return false;
          /* v8.7: and it BRIEFS first — the fixture declares every seam the
             kit has, so `brief` is proven by fixturetest rather than only
             by the chapter that asked for it. */
          kit.event({ kind: 'sequence', label: 'THE PIPES', items: [{ label: 'feed' }, { label: 'valve' }, { label: 'drain' }],
                      brief: 'Three valves, named one at a time. Tap each one before it goes.',
                      demo: 'bar',      // v13.0: the briefing's OTHER illustration — a bar into a band
                      /* v9.3: GRADED, so the fixture proves the ladder and its
                         damage rather than only that an overlay appeared. */
                      each: 1.5, lead: 0.30, zone: 1,
                      penalty: { stat: 'sanity', per: 1 },
                      award: { stat: 'awareness', per: 1, lo: -12, hi: 9 } });
          return true;
        } },
      /* v9.4: the DRAG AND MATCH, declared here so `fixturetest` proves the
         seam rather than only the chapter that asked for it. Its icons are
         plain labels — a chapter may hand over a canvas or an asset key, and
         neither is the seam under test. */
      { id: 'kitlayout', pos: { x: -6, y: 1.2, z: -6 }, radius: 2.4, prompt: 'Lay out the kit', once: true,
        onInteract() {
          if (!kit) return false;
          kit.event({ kind: 'match', label: 'THE KIT',
                      pairs: [{ id: 'a', label: 'mug' }, { id: 'b', label: 'boots' },
                              { id: 'c', label: 'cord' }],
                      brief: 'Drag each thing on the left onto its place on the right.',
                      demo: 'drag',      // v10.3: the briefing's looping illustration
                      secs: 30, fast: 6, slow: 20, wrongCost: 3,
                      penalty: { stat: 'awareness' },
                      award: { stat: 'awareness', lo: -5, hi: 9 } });
          return true;
        } },
      /* v11.0: a hotspot SEEN BY LOOKING — `dwell` seconds with the reticle
         inside `aim` radians of it fires onInteract with no press. Episode
         2 chapter 3's torch spots are this; the fixture declares one so
         fixturetest proves the seam. Wide radius, generous cone: the test
         aims from across the room. */
      { id: 'mark', pos: { x: 0, y: 1.6, z: -8 }, radius: 14, dwell: 0.5, aim: 0.25, prompt: 'Look at the mark', once: true,
        onInteract() {
          if (kit) kit.conduct({ note: 'You looked at the mark.' });
          return true;
        } },
      /* v21.9: two spots answered by a PRESS on what you look at
         (`pressAim`, the twenty-eighth seam): no timer, offered only while
         the reticle is in its cone, the nearer of two overlapping cones
         winning, and a tap on its mark pressing it. 0.12 rad apart from the
         spawn, so the cones overlap; asleep until fixturetest arms them, so
         no other proof's aim can find them. Episode 3 chapter 3's four shop
         spots are this. */
      { id: 'sign', pos: { x: -10.5, y: 1.6, z: 0 }, radius: 16, aim: 0.25, pressAim: true, prompt: 'Read the sign', once: true, markFar: 16,
        enabled() { return !!this.armed; },
        onInteract() { if (kit) kit.conduct({ note: 'You read the sign.' }); return true; } },
      /* (v28.0, the eightieth seam: the plaque asks for the aim dot, `aimDot`; the sign does not) */
      { id: 'plaque', pos: { x: -10.5, y: 1.6, z: -2.5 }, radius: 16, aim: 0.25, pressAim: true, aimDot: true, prompt: 'Read the plaque', once: true, markFar: 16,
        enabled() { return !!this.armed; },
        onInteract() { if (kit) kit.conduct({ note: 'You read the plaque.' }); return true; } },
      /* v24.0: a spot the player must FIND (`mark: false`): pressed like the two above, but it wears no mark and so has
         none to tap — the badge names it only once the reticle is on it. Episode 4 chapter 1's four signs are this. */
      { id: 'clue', pos: { x: 10.5, y: 1.6, z: 0 }, radius: 16, aim: 0.25, pressAim: true, mark: false, prompt: 'Look closer', once: true, markFar: 16,
        enabled() { return !!this.armed; },
        onInteract() { if (kit) kit.conduct({ note: 'You found the clue.' }); return true; } },
      /* v27.0: A PICTURE, LOOKED AT (kit.picture, the fifty-eighth seam): pressed like the spots above, it opens a picture
         whole in the middle of the screen; play waits under it, and the chapter is told once when it is closed (`seen`).
         The fixture carries no picture of its own (it loads no assets, which is part of what it proves), so the harness
         names one when it wakes the spot: `armed` is an asset key. Episode 4 chapter 4's old photograph is this. */
      { id: 'photo', pos: { x: 6, y: 1.6, z: -4 }, radius: 16, aim: 0.25, pressAim: true, prompt: 'Look at the photograph', once: true, markFar: 16,
        seen: 0,
        enabled() { return !!this.armed; },
        onInteract() {
          if (!kit || !kit.picture) return false;
          const h = this;
          return kit.picture(this.armed, { ar: 4 / 3, onClose: () => { h.seen++; } });
        } },
      /* v14.7: a hotspot answered by a TAP ON THE THING — `hits(x, y)`,
         reached through the engine's hotspotTap from a touch or an unlocked
         click — whose press hands over an item and opens the ITEM UNLOCKED
         splash (kit.unlock). The amulet on the auntie's table in episode 1
         chapter 3 is both; fixturetest proves them here. */
      { id: 'relic', pos: { x: RELIC.x, y: 1.1, z: RELIC.z }, radius: 1.8, prompt: 'Take the relic', once: true,
        hits: pointerHitsRelic,
        onInteract() {
          if (!kit) return false;
          if (!kit.has('amulet') && !kit.give('amulet')) return false;
          relic.visible = false;
          if (kit.unlock) kit.unlock('amulet');
          return true;
        } }
    ];
    if (kit) { kit.objective('Find the marker on the floor'); kit.setPhase('room'); }

    /* v27.0: a SPIRIT for the vision — the fixture's primitives only (it is not part of the game), handed to the engine
       by ctx.spirit, which moves it to the vision's own layer: the world's pass never draws it */
    const spirit = new THREE.Mesh(new THREE.SphereGeometry(0.45, 16, 12), new THREE.MeshBasicMaterial({ color: 0xffffff }));
    spirit.name = 'spirit'; spirit.position.set(0, 1.4, 3.5); world.add(spirit);
    const spiritFx = ctx.spirit ? ctx.spirit(spirit, { color: 0x66ff88 }) : null;

    /* v12.0: a TARGET for the rifle — a board straight down the spawn's
       line of sight, and the two verbs the seam reaches a chapter through:
       shootables() names what a round may hit, onShot() is told about every
       round, hit or miss, and here writes each as conduct. */
    const target = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 1.6),
      new THREE.MeshStandardMaterial({ color: 0xd8c8a0, roughness: 0.9, side: THREE.DoubleSide }));
    target.name = 'target'; target.position.set(0, 1.4, 1); world.add(target);
    const shots = [];
    function shootables() { return [target]; }
    function onShot(r) {
      shots.push({ hit: r.hit, name: r.object ? r.object.name : null, dist: r.distance, rounds: r.rounds });
      if (kit) kit.conduct({ note: r.hit ? 'You hit the target.' : 'You missed.' });
    }

    /* v24.0 · S46: a stand from the chapter's OWN kit — two kinds (a cone, a post), one spot the chapter depends on
       (`always`) — planted by the engine's own dealing, instancing and per-tree culling (fixturetest proves it) */
    const kitGeos = [new THREE.ConeGeometry(0.25, 1, 6).translate(0, 0.5, 0), new THREE.BoxGeometry(0.16, 1, 0.16).translate(0, 0.5, 0)];
    const kitMat = new THREE.MeshStandardMaterial({ color: 0x3a6a3a, roughness: 0.9 });
    const kitI = new THREE.Matrix4();
    const kitStand = ctx.plantTrees ? ctx.plantTrees(world, [
      { x: 9, z: -9, h: 2.2, kind: 0 }, { x: 10, z: -9.5, h: 1.6, kind: 1 }, { x: 11, z: -9, h: 2.6, kind: 0, always: true }
    ], { kit: [[{ geo: kitGeos[0], mat: kitMat, m: kitI, leaf: false }], [{ geo: kitGeos[1], mat: kitMat, m: kitI, leaf: false }]], seed: 5 }) : null;
    function kitStandInfo() {
      if (!kitStand) return null;
      return { planted: kitStand.userData.planted.length, parts: kitStand.children.length,
               inst: kitStand.children.reduce((a, c) => a + (c.isInstancedMesh ? c.instanceMatrix.count : 0), 0),
               kinds: kitStand.children.map(c => c.geometry === kitGeos[0] ? 'cone' : c.geometry === kitGeos[1] ? 'post' : '?').sort().join(',') };
    }

    /* ---- v28.0 · THE FIXTURE'S FIGHT (seams 60 to 65) -------------------------------------------------------------------
       Not a fight of the game: two plain shapes (a column and a cone, a small block on each one's front to show where it
       faces) and three plain targets on the west half of the room, hidden until the harness opens it. Every seam the tag mode
       adds is driven through it: the brief's picture (`tag`), the mode itself (the lens behind and above, the walk by the
       screen, the switch and its lock, the acts and their rings, the marks and a pick, the other one's mark, the count) and
       a loss that begins again (kit.retry). A pillar stands where a boom would pass through it, so the lens is seen kept out
       of it. What each act does here is the fixture's own: the engine knows none of it. Two acts ('zap', 'sniff') are never
       written by the fixture's frame, so the harness can set their rings and locks itself */
    const pillar = new THREE.Mesh(new THREE.BoxGeometry(0.8, 3.2, 0.8), matWall);
    pillar.position.set(-3.2, 1.6, 8.6); world.add(pillar);
    const fMatA = new THREE.MeshStandardMaterial({ color: 0xd8b04a, roughness: 0.7 });
    const fMatB = new THREE.MeshStandardMaterial({ color: 0x8a6ad8, roughness: 0.7 });
    const fMatT = new THREE.MeshBasicMaterial({ color: 0xff6a5a });
    const fMatTired = new THREE.MeshBasicMaterial({ color: 0x8a9098 });
    const mkBody = (mat, geo) => {
      const g = new THREE.Group(), m = new THREE.Mesh(geo, mat); m.position.y = 0.85; g.add(m);
      const nose = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.3), mat); nose.position.set(0, 1.4, 0.3); g.add(nose);
      g.visible = false; world.add(g); return g;
    };
    const bodyA = mkBody(fMatA, new THREE.CylinderGeometry(0.3, 0.3, 1.7, 12));
    const bodyB = mkBody(fMatB, new THREE.ConeGeometry(0.34, 1.7, 12));
    const F_HOME = { a: [-6, 5], b: [-4.6, 5.6] };
    const F_START = [{ id: 't1', x: -6.5, z: -1 }, { id: 't2', x: -4.0, z: -2.5 }, { id: 't3', x: -5.2, z: -4, hides: true }];
    const fTargets = F_START.map(s => {
      const m = new THREE.Mesh(new THREE.SphereGeometry(0.28, 12, 8), fMatT); m.visible = false; world.add(m);
      return { ...s, m, tired: false, taken: false, hidden: !!s.hides };
    });
    const F = { on: false, left: 3, picked: null, ringAt: -1e9, gripTo: 0, lastT: 0, log: [], restarts: 0, losses: 0, lastRetry: null, manual: false };
    function fReset() {
      F.left = 3; F.picked = null; F.ringAt = -1e9; F.gripTo = 0; F.lastT = 0; F.log.length = 0;
      for (const T of fTargets) {
        T.tired = false; T.taken = false; T.hidden = !!T.hides;
        T.m.position.set(T.x, 1.0, T.z); T.m.material = fMatT; T.m.visible = F.on && !T.hidden;
      }
    }
    function fNearest(from, pred) {
      let best = null, bd = Infinity;
      for (const T of fTargets) {
        if (!pred(T)) continue;
        const d = Math.hypot(T.m.position.x - from.position.x, T.m.position.z - from.position.z);
        if (d < bd) { bd = d; best = T; }
      }
      return best ? { T: best, d: bd } : null;
    }
    function fTire(T) { T.tired = true; T.m.material = fMatTired; }
    function fMarks() {
      return fTargets.filter(T => !T.taken && !T.hidden).map(T => ({ id: T.id, at: [T.m.position.x, T.m.position.y, T.m.position.z],
        picked: T.id === F.picked, dim: T.tired, color: T.tired ? '#9aa0a8' : '#ff6a5a' }));
    }
    function fOnAct(r) {
      F.log.push({ ...r });
      if (r.act === 'target') { F.picked = r.id; return; }
      if (r.phase !== 'down') return;
      const t = kit.tagState().t;
      if (r.act === 'zap') {
        const T = fTargets.find(x => x.id === F.picked && !x.taken && !x.tired && !x.hidden)
          || (fNearest(bodyB, x => !x.taken && !x.tired && !x.hidden) || {}).T;
        if (T) fTire(T);
      } else if (r.act === 'ring') { for (const T of fTargets) if (!T.taken && !T.hidden) fTire(T); F.ringAt = t; }
      else if (r.act === 'take') {
        const n = fNearest(bodyA, x => !x.taken && x.tired);
        if (n && n.d <= 2.5) { n.T.taken = true; n.T.m.visible = false; F.left = Math.max(0, F.left - 1); if (F.picked === n.T.id) F.picked = null; }
      } else if (r.act === 'grip') F.gripTo = t + 5;
      else if (r.act === 'sniff') { for (const T of fTargets) if (T.hidden) { T.hidden = false; T.m.visible = true; } }
    }
    /* the fixture's own frame for its fight: the targets drift toward the violet one (and stop where it holds them), and the
       acts it owns say their state (a ring's long wait, a take shown only within reach, a hold lit while it lasts) */
    function fightTick() {
      if (!F.on || !kit || getState() !== 'play') return;
      const st = kit.tagState(); if (!st.on) return;
      const dtF = Math.max(0, Math.min(0.1, st.t - F.lastT)); F.lastT = st.t;
      const gripping = st.t < F.gripTo;
      for (const T of fTargets) {
        if (T.taken || T.tired) continue;
        T.m.visible = !T.hidden;
        const dx = bodyB.position.x - T.m.position.x, dz = bodyB.position.z - T.m.position.z, d = Math.hypot(dx, dz);
        if ((gripping && d < 2.5) || d < 1.2) continue;
        const step = Math.min(d - 1.2, 0.25 * dtF);
        T.m.position.x += dx / d * step; T.m.position.z += dz / d * step;
      }
      if (F.manual) return;
      const live = fTargets.filter(T => !T.taken && !T.hidden);
      kit.tagAct('ring', { wait: Math.max(0, 1 - (st.t - F.ringAt) / 20), blocked: live.length && live.every(T => T.tired) ? 'They are all down.' : null });
      const n = fNearest(bodyA, x => !x.taken && x.tired);
      kit.tagAct('take', { hidden: !(n && n.d <= 2.5) });
      kit.tagAct('grip', { on: gripping, wait: gripping ? (F.gripTo - st.t) / 5 : 0 });
      kit.tagCount(F.left, 3);
      kit.tagBody('b', { share: F.left / 3 });
    }
    /* the rig as the FIXTURE reads it (every matrix, the lens, the turns), taken the instant before the mode opens and the
       instant after it is left, so the harness can hold the two side by side, bit for bit */
    function rigNow() {
      camera.updateWorldMatrix(true, false);
      return [...yaw.matrixWorld.elements, ...ctx.pitch.matrixWorld.elements, ...camera.matrixWorld.elements, ...camera.projectionMatrix.elements,
              camera.fov, camera.position.x, camera.position.y, camera.position.z, yaw.rotation.y, ctx.pitch.rotation.x, camera.rotation.z];
    }
    function fightOpen(o = {}) {
      if (!kit || !kit.tag) return false;
      F.rig0 = rigNow();
      bodyA.position.set(F_HOME.a[0], 0, F_HOME.a[1]); bodyA.rotation.y = Math.PI;
      bodyB.position.set(F_HOME.b[0], 0, F_HOME.b[1]); bodyB.rotation.y = Math.PI;
      bodyA.visible = bodyB.visible = true;
      F.on = true; fReset();
      /* (v28.0, the sixty-eighth seam: with `party`, the switch is the party list: each body a tile with a picture, a small line
         over its name and a colour; the key may be named, Tab as chapter 5 names it) */
      const face = (col) => () => { const c = document.createElement('canvas'); c.width = c.height = 64; const x = c.getContext('2d');
        x.fillStyle = col; x.fillRect(0, 0, 64, 64); x.fillStyle = '#000'; x.beginPath(); x.arc(32, 28, 14, 0, Math.PI * 2); x.fill(); return c; };
      const P = o.party ? { a: { title: 'THE FIRST', color: '#FFC860', pic: face('#FFC860') }, b: { title: 'THE SECOND', color: '#9B6BFF', pic: face('#9B6BFF') } } : { a: {}, b: {} };
      const ok = kit.tag({
        ...(o.party ? { party: {}, keys: o.keys || {} } : {}), ...(o.arrow ? { arrow: o.arrow } : {}),   // (v28.0, the seventy-first seam: the played one's arrow)
        bodies: [
          { id: 'a', obj: bodyA, name: 'GOLD', ...P.a, speed: 1.2, acts: [
            { id: 'zap', slot: 'main', label: 'ZAP', key: 'Space' },
            { id: 'ring', slot: 'second', label: 'RING', key: 'KeyQ' },
            { id: 'take', slot: 'third', label: 'TAKE', key: 'KeyE' }] },
          { id: 'b', obj: bodyB, name: 'VIOLET', ...P.b, speed: 0.6, acts: [
            { id: 'grip', slot: 'main', label: 'GRIP', key: 'Space' },
            { id: 'sniff', slot: 'second', label: 'SNIFF', key: 'KeyN' }] }
        ],
        played: o.played || 'a', targets: fMarks, onAct: fOnAct
      });
      if (!ok) { F.on = false; bodyA.visible = bodyB.visible = false; for (const T of fTargets) T.m.visible = false; }
      else kit.tagCount(3, 3);
      return ok;
    }
    function fightEnd(how) {
      const ok = kit ? kit.tag(null, how) : false;
      F.rig1 = rigNow();
      F.on = false; bodyA.visible = bodyB.visible = false;
      for (const T of fTargets) T.m.visible = false;
      return ok;
    }
    /* the brief, with the mode's own picture under its title (the sixty-fourth seam); START opens the fight */
    function fightBrief() {
      if (!kit) return null;
      return kit.event({ kind: 'guard', label: 'THE ROOM', demo: 'tag',
                         brief: 'Two of you: switch between them. The gold one takes, the violet one holds. Three targets.' })
        .then(r => (r && r.ok ? fightOpen() : false));
    }
    /* a loss: the card, and the fight begun again where it opened (the bodies, the targets and the count are the fixture's) */
    function fightLose() {
      if (!kit || !kit.retry) return false;
      F.losses++;
      return kit.retry({ title: 'The room was lost', line: 'Begin the fight again from where it opened.', button: 'BEGIN AGAIN',
                         more: F.losses >= 3 ? 'AN EASIER WAY' : null,
                         onPress: r => {
                           /* what the run holds the moment the card hands back (the engine has put the held run back) */
                           F.atRetry = { s: kit.stat('sanity'), a: kit.stat('awareness'), w: kit.stat('wisdom'), ward: kit.wardLeft(), phase: kit.getPhase() };
                           F.restarts++; F.lastRetry = r.button; fReset();
                           kit.tagPlace('a', F_HOME.a[0], F_HOME.a[1], { ry: Math.PI });
                           kit.tagPlace('b', F_HOME.b[0], F_HOME.b[1], { ry: Math.PI });
                           kit.tagCount(3, 3);
                           /* the fight as it begins again, read in the same instant (a frame later its targets have drifted
                              by however long that frame was) */
                           F.atRetryFight = JSON.stringify({ left: F.left, picked: F.picked,
                             t: fTargets.map(T => [T.m.position.x, T.m.position.z, T.tired, T.taken, T.hidden]),
                             a: [bodyA.position.x, bodyA.position.z, bodyA.rotation.y], b: [bodyB.position.x, bodyB.position.z, bodyB.rotation.y],
                             played: kit.tagState().played });
                         } });
    }
    function fightReset() { F.on = false; F.losses = 0; F.restarts = 0; F.lastRetry = null; F.manual = false; bodyA.visible = bodyB.visible = false; fReset(); }

    function dispose() {
      fMatT.dispose(); fMatTired.dispose();   // (v28.0: the targets' two looks, one of them on no mesh until a target tires)
      if (kitStand && kitStand.userData.disposeTrees) kitStand.userData.disposeTrees();
      for (const g of kitGeos) g.dispose();
      kitMat.dispose();
      const geos = new Set(), mats = new Set();
      world.traverse(o => {
        if (o.geometry) geos.add(o.geometry);
        if (o.material) for (const m of (Array.isArray(o.material) ? o.material : [o.material])) mats.add(m);
      });
      scene.remove(world);
      for (const o of owned) { o.parent?.remove(o); o.dispose?.(); }
      owned.length = 0;
      for (const g of geos) g.dispose();
      for (const m of mats) { m.map?.dispose?.(); m.dispose(); }
      noteTex.dispose();
      world.clear();
      S = null;
    }

    return (S = {
      world, noteTex, blockers: blockers(), groundAt, kitStandInfo,
      /* v23.0 · S41: the progress store's read-only question, as a chapter asks it (fixturetest proves it answers) */
      sealedBefore: k => (ctx.sealedBefore ? ctx.sealedBefore(k) : null),
      ready: () => true,                       // nothing to wait for
      pile: { pos: PILE_POS, radius: INTERACT_R, group: pile,
              dist: pileDist, screen: pileScreen, inView: pileInView,
              hits: pointerHitsPile, interact: interactPile,
              glow: () => pileRing.material.opacity },
      drum, ash, embers, heroNote, smoke, flying, jossTips, fireLight,
      get noteStorm() { return noteStorm; },
      set noteStorm(v) { noteStorm = v; },
      updateNotes, updatePile, updateFire, updateSlow,
      snap, restore, reset, dispose,
      hotspots,                                  // v7.0
      shootables, onShot, shots,                 // v12.0: rifle mode
      /* v28.0: the fixture's fight (seams 60 to 65), for fixturetest */
      fight: F, fightOpen, fightEnd, fightBrief, fightLose, fightBodies: { a: bodyA, b: bodyB }, fightTargets: fTargets,
      fightHome: F_HOME, pillar,
      /* v29.0: the two briefing pictures episode 5 chapter 1 names (`demo:`), declared here so chaptertest checks they are
         drawn and fixturetest opens each: the steady kind as KEEP THE WATER STILL ('bowl'), the hands-on kind's circling
         step as CLOSE THE CIRCLE ('circle') */
      eventDemos: {
        bowl: { kind: 'steady', label: 'THE BOWL', brief: 'Keep the light inside the ring.', demo: 'bowl', secs: 2, lead: 0.2, grace: 5 },
        circle: { kind: 'craft', label: 'THE CIRCLE', brief: 'Lay the thread all the way round you.', demo: 'circle',
                  at: { sx: 0.5, sy: 0.5 }, steps: [{ g: 'twist', turns: 1 }] }
      }
    });
  }

  /* Four scenes, each a couple of seconds. They exercise the verbs a real
     chapter uses — camera moves, a fade, a sting, a ghost cue — without any
     of the staging, so a harness can get through all four quickly.        */
  function scene(seconds, extra) {
    return (c, s, api) => {
      const { fade, camTo, pitchTo, sfx } = api;
      const P = { x: s.yawPos.x, y: 1.62, z: s.yawPos.z - 1.2 };
      camTo(0, seconds * 0.6, { x: s.yawPos.x, y: s.yawPos.y, z: s.yawPos.z }, P);
      pitchTo(0, seconds * 0.6, s.pitchX, -0.2);
      sfx(0.2, 'boom');
      if (extra) extra(c, s, api);
      fade(seconds * 0.7, seconds, 0, 1);
      c.endFade = 1;
    };
  }

  const scTake = scene(2.4, (c, s, api) => {
    api.step(1.0, () => { api.noteProp.visible = true; });
  });
  const scBreak = scene(2.6, (c, s, api) => {
    api.tr(0.5, 1.6, k => { api.stage.drum.rotation.z = 1.5 * k; });
    api.tr(0.5, 1.6, k => { api.stage.noteStorm = 1 + 5 * k; }, api.rawK);
  });
  const scLook = scene(2.0, null);
  const scLeave = scene(2.2, (c, s, api) => {
    api.tr(0.4, 1.4, k => { api.ghostOpacity(1 - k); }, api.rawK);
    c.keep.ghostGone = true;
  });

  /* v21.0: an IN-PLAY film (kit.film, the twenty-sixth seam), so
     `fixturetest` can prove a cutscene started from play hands back to PLAY —
     no card — with the camera wherever the chapter puts it under the black it
     ends on. 3.6 s: past the Skip button's 3.0 s, so the skip is proven too. */
  const fiProbe = (c, s, api) => {
    const { fade, camTo, sfx, step, handsRoot } = api;
    camTo(0, 2.4, { x: s.yawPos.x, y: s.yawPos.y, z: s.yawPos.z }, { x: s.yawPos.x, y: 2.4, z: s.yawPos.z + 1.5 });
    sfx(0.2, 'boom');
    step(0.3, () => { handsRoot.visible = false; });   // v21.1: a film that hides the hands and never shows them — the hand-back must
    fade(2.6, 3.6, 0, 1);
    c.keepFade = true;
    c.endFade = 1;
  };

  /* v24.0 · S48: a film with a phone's chat over it (api.phone) — a message typed in, one sent, gone with the film */
  const fiPhone = (c, s, api) => {
    const { fade, step, phone } = api;
    phone(0.2, 3.2, { name: 'Pong', sub: 'online', ava: { text: 'P', color: '#b8742a' },
                      msgs: [{ at: 0.6, who: 'them', text: 'Brother!! Come Thailand.', typing: 0.3 },
                             { at: 1.6, who: 'me', text: 'Who is he?', typing: 0.6 }] });
    step(3.6, () => {});
    fade(3.4, 3.8, 0, 0);
  };

  /* v25.5 · the forty-third seam: a film's fade in a COLOUR (a white flash over the whole screen), up and down again,
     and a plain fade after it: the black must be the black again */
  const fiFlash = (c, s, api) => {
    const { fade, step } = api;
    fade(0.3, 0.7, 0, 1, '#ffffff');
    fade(1.5, 2.1, 1, 0, '#ffffff');
    fade(2.5, 3.3, 0, 0.5);
    step(3.5, () => {});
  };

  /* v28.0: a film from play that ENDS ON ITS OWN VIEW (`c.keep.view`): play takes up where the film left the lens, and the
     arm the film's end had hidden (restoreWorld does, for a card) is given back on play's first frame (kitFilm) */
  const fiKeepView = (c, s, api) => {
    const { step } = api;
    step(0.6, () => {});
    c.keep.view = true;
  };

  /* v28.0 · the seventy-third seam: a film LAID AT ITS FIRST INSTANT (kit.film's `layFirst`): its first track turns the
     drum the moment the film is asked for, not one drawn frame later; the drum is given back at its end, so play finds
     it as it left it whether the film ran or was skipped */
  const fiLay = (c, s, api) => {
    const { tr, step, fade, stage } = api;
    tr(0, 0.6, k => { stage.drum.rotation.y = 0.9 + 0.3 * k; });
    fade(0.7, 1.0, 0, 1);
    step(1.05, () => { stage.drum.rotation.y = 0; });
    c.keepFade = true;
    c.endFade = 1;
  };

  /* v29.0 · the eighty-first seam: a film that ASKS for the pressure (`cine: true`), so it is painted under the film; and
     gives it back before it ends, so play finds the picture as it was */
  const fiPress = (c, s, api) => {
    const { step, fade, kit } = api;
    step(0.1, () => { kit.press(0.9, { secs: 0, cine: true }); });
    step(3.2, () => { kit.press(0, { secs: 0, cine: false }); });
    fade(3.3, 3.6, 0, 0);
    step(3.7, () => {});
  };

  /* v23.0 · S39: a film that PAUSES on a surface event (api.eventWait) — the climb back runs inside a film and the
     film goes on, and hands back to play, once it resolves */
  const fiClimb = (c, s, api) => {
    const { fade, eventWait } = api;
    eventWait(0.4, { kind: 'surface', secs: 1.6, start: 0.4, sink: 0.4, lead: 0.1, slip: 0, minSanity: 10 },
              r => { window.__climbR = r; });
    fade(1.2, 2.0, 0, 1);
    c.keepFade = true;
    c.endFade = 1;
  };

  (window.__CHAPTERS__ = window.__CHAPTERS__ || {}).chtest = Object.assign(DATA, {
    build,
    films: { probe: fiProbe, climb: fiClimb, phone: fiPhone, flash: fiFlash, keepView: fiKeepView, lay: fiLay, press: fiPress },
    scenes: [scTake, scBreak, scLook, scLeave]
  });
})();
