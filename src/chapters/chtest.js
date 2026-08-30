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
    id: 99,
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
    assets: []
  };

  function build(ctx) {
    const { THREE, scene, camera, yaw, getState, startDecision } = ctx;
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
      ash.visible = true; heroNote.visible = true; noteStorm = 1;
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

    function dispose() {
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
      world, noteTex, blockers: blockers(),
      ready: () => true,                       // nothing to wait for
      pile: { pos: PILE_POS, radius: INTERACT_R, group: pile,
              dist: pileDist, screen: pileScreen, inView: pileInView,
              hits: pointerHitsPile, interact: interactPile,
              glow: () => pileRing.material.opacity },
      drum, ash, embers, heroNote, smoke, flying, jossTips, fireLight,
      get noteStorm() { return noteStorm; },
      set noteStorm(v) { noteStorm = v; },
      updateNotes, updatePile, updateFire, updateSlow,
      snap, restore, reset, dispose
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

  (window.__CHAPTERS__ = window.__CHAPTERS__ || {}).chtest = Object.assign(DATA, {
    build,
    scenes: [scTake, scBreak, scLook, scLeave]
  });
})();
