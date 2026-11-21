
    /* ================================================================ THE CLEANSING IN THE CHAPTER (masters/v28.0/parts/c_fightstage.js)
       The tracker's M8: the tag-team fight of docs/V28.0-FIGHT.md played in third person on the engine's tag mode (seams 60
       to 65, docs/V28.0-SEAMS.md). THE RULES ARE NOT HERE: every rule is FIGHT's (c_fightrules.js, the one table and the
       one step that tools/probes/fightsim.mjs plays ten thousand times), and this part only DRIVES them and DRAWS and SOUNDS
       what they answer (v8.7: what is played and what is tested are one function). Per frame of the mode:
         1. what the engine moved (the played one, by the stick, on the court's blockers) is handed to the rules as a walk
            from where the rules last had him, so the rules' own walk (their court, and his teacher kept out of his cage)
            is the one that holds; where the rules stop a step, the body is set back to where they stopped it;
         2. the one press the engine told this frame (`onAct`), a pick, and the engine's own sanity after its guards;
         3. FIGHT.step on the mode's own clock (wall time while the mode is live, a tenth at most a frame: the engine's);
         4. its events drawn and sounded (the manifest's map, masters/v28.0/sound/manifest.json), its lines said and
            captioned, its costs paid through kit.award as a minigame's (a worn piece guards here too, v14.13);
         5. the screen from FIGHT.hud (each act's face, ring, ask and lock) and FIGHT.need (the pulse, the marks).
       The one not played is moved by the rules (his teacher's own walk back beside him), through kit.tagPlace.
       COLOURS (the plan's 11): gold is Grandmaster Pho's alone (his shoulders, the golden shockwave); ruby the Naga stick's
       fire; violet the student's cage, his bubbles and his lend; the nine black with a pale edge. Nothing here adds a light
       (v9.4, v15.1): every glow is painted (additive cards and discs). THE SOUNDS are worldSfx one-shots and loops the part
       holds itself, every name a literal (build.py gives a sound to this chapter's pack only by its quoted name); a loop
       is held by a gain this frame renews: when the frame stops (a menu, the loss card, a film, a hidden tab) each loop
       goes quiet by itself within half a second, and comes back with the frame (the plan's 6.1: "every sound of the fight
       stops and starts with it"). M7 is five stems of one loop started in ONE instant (all five or none), so they stay in
       step for as long as the fight lasts; each brought up or down over 0.4 s (the manifest's rule). */
    const FN5 = (typeof FIGHT !== 'undefined' && FIGHT && FIGHT.NUM) || {};
    /* the court's frame (c_cast.js COURT5: local x across, z down the court; the house's face at local z -3.0) */
    const fsW = (lx, lz) => courtWorld(lx, lz);
    const fsL = (wx, wz) => ({ x: COURT5.x - wx, z: COURT5.z - wz });
    /* which of the rules' acts each body's buttons carry (FIGHT.SLOT), and the engine's id for each */
    const FS_ACT = { flame: 'FIRE', shock: 'SHOCKWAVE', bag: 'BAG', bind: 'BIND', smell: 'SMELL', lend: 'LEND' };
    const FS_ID = { pho: { main: 'flame', second: 'shock', third: 'bag' }, zavier: { main: 'bind', second: 'smell', third: 'lend' } };
    const FS_SLOT = { flame: 'main', shock: 'second', bag: 'third', bind: 'main', smell: 'second', lend: 'third' };
    /* the controller: one per fight (fightBegin makes it; fightReset puts it all back) */
    const FS5 = { on: false, st: null, mode: false, brief: false, live: false, lastT: 0, q: null, pick: null, run: 0, wall: 0,
                  last: { pho: null, zav: null }, faceTo: { pho: null, zavier: null }, faceT: { pho: 0, zavier: 0 }, wonAt: -1, done: false,
                  hudSig: '', obj: null, objKey: '', film: false, losses: 0, rand: null, fallback: false, lit: 0, flare: 0, drainSnd: 0,
                  reached: 0, chillK: -1, swNeed: false, stemsOn: false, lastLine: '', heard: [], log: [], act: null, actN: 0, waits: {} };

    /* ---------------------------------------------------------------- THE PICTURES THE FIGHT PAINTS (all painted light) */
    const fsCanvas = (n) => { const c = document.createElement('canvas'); c.width = c.height = n; return [c, c.getContext('2d')]; };
    /* a soft round light, white at its heart */
    const fsDot = (() => { const [c, x] = fsCanvas(128); const g = x.createRadialGradient(64, 64, 0, 64, 64, 63);
      g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.22, 'rgba(255,255,255,0.85)'); g.addColorStop(0.5, 'rgba(255,255,255,0.28)'); g.addColorStop(1, 'rgba(255,255,255,0)');
      x.fillStyle = g; x.fillRect(0, 0, 128, 128); return tex(done(THREE, c, false)); })();
    /* a thin ring of light (the tired one's closing ring, the smell's ripple) */
    const fsRingTex = (() => { const [c, x] = fsCanvas(256); const g = x.createRadialGradient(128, 128, 104, 128, 128, 127);
      g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(0.45, 'rgba(255,255,255,1)'); g.addColorStop(0.62, 'rgba(255,255,255,0.4)'); g.addColorStop(1, 'rgba(255,255,255,0)');
      x.fillStyle = g; x.fillRect(0, 0, 256, 256); return tex(done(THREE, c, false)); })();
    /* the golden shockwave: one ring like a wheel with its spokes (the plan's 11) */
    const fsWheelTex = (() => { const [c, x] = fsCanvas(512); x.translate(256, 256);
      const g = x.createRadialGradient(0, 0, 200, 0, 0, 255); g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(0.55, 'rgba(255,255,255,1)'); g.addColorStop(0.75, 'rgba(255,255,255,0.45)'); g.addColorStop(1, 'rgba(255,255,255,0)');
      x.fillStyle = g; x.beginPath(); x.arc(0, 0, 255, 0, Math.PI * 2); x.fill();
      for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2, sg = x.createLinearGradient(0, 0, Math.cos(a) * 240, Math.sin(a) * 240);
        sg.addColorStop(0, 'rgba(255,255,255,0)'); sg.addColorStop(0.55, 'rgba(255,255,255,0.05)'); sg.addColorStop(1, 'rgba(255,255,255,0.6)');
        x.strokeStyle = sg; x.lineWidth = 7; x.beginPath(); x.moveTo(Math.cos(a) * 60, Math.sin(a) * 60); x.lineTo(Math.cos(a) * 238, Math.sin(a) * 238); x.stroke(); }
      return tex(done(THREE, c, false)); })();
    /* a dark cloud of smell (the shown one rising out of it, a stale one left where it was), its edge a sour green */
    const fsSmokeTex = (() => { const [c, x] = fsCanvas(128), r = rng(28581);
      for (let i = 0; i < 26; i++) { const px = 64 + (r() - 0.5) * 50, py = 64 + (r() - 0.5) * 50, q = 14 + r() * 26, g = x.createRadialGradient(px, py, 0, px, py, q);
        g.addColorStop(0, 'rgba(255,255,255,0.32)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(px - q, py - q, q * 2, q * 2); }
      return tex(done(THREE, c, false)); })();
    const FS_COL = { ruby: 0xff2a4a, rubyCore: 0xffe2d6, gold: 0xffc860, violet: 0x9b6bff, sour: 0x8fa070, dark: 0x0b0d10, pale: 0xdfe4f0 };
    const fsSpriteMat = (col, add = true) => { const m = new THREE.SpriteMaterial({ map: fsDot, color: col, transparent: true, opacity: 0, depthWrite: false,
      blending: add ? THREE.AdditiveBlending : THREE.NormalBlending, fog: false, toneMapped: false }); mats.push(m); return m; };
    const fsGroundMat = (map, col, add = true) => { const m = new THREE.MeshBasicMaterial({ map, color: col, transparent: true, opacity: 0, depthWrite: false,
      blending: add ? THREE.AdditiveBlending : THREE.NormalBlending, fog: false, toneMapped: false, polygonOffset: true, polygonOffsetFactor: -3, polygonOffsetUnits: -3 }); mats.push(m); return m; };
    const fsQuad = (() => { const q = new THREE.PlaneGeometry(1, 1); q.rotateX(-Math.PI / 2); owned.push(q); return q; })();
    const FSG = new THREE.Group(); FSG.name = 'the cleansing'; FSG.visible = false; world.add(FSG);
    const fsSprite = (col, add, ro = 5) => { const s = new THREE.Sprite(fsSpriteMat(col, add)); s.visible = false; s.renderOrder = ro; FSG.add(s); return s; };
    const fsGround = (map, col, add, y = 0.014) => { const m = new THREE.Mesh(fsQuad, fsGroundMat(map, col, add)); m.visible = false; m.position.y = y; m.renderOrder = 2; FSG.add(m); return m; };

    /* THE FIREBALLS (R25, Chad: "make the fireball look more like a real orange flaming fireball, think diablo style"): a
       FLAME, not a light. A white-gold heart in a body of orange fire whose edge licks and tears in a moving noise, its
       tongues streaming back along the flight into a tail of fire: one card facing the lens, drawn by its own shader and
       laid along the flight AS THE LENS SEES IT (fsFlameLay: a ball coming at the lens is round, one going across shows
       its whole tail). Round it a soft orange halo, and an orange glow on the paving under it; behind it a short trail of
       fire, embers shed (most rising, as hot things rise; the brightest falling) and a thin smoke left in the air; a flare
       and a spit of sparks at the Naga's mouth as it is let go; and where it lands a BURST: a white flash, a roiling ball of
       fire swelling and thinning (the same shader, round), embers and smoke, a ring of light along the paving and a scorch
       that fades. Orange, the Naga stick's ruby only at the fire's outer tips and in a few embers (the plan's 11: the
       stick's fire; gold stays his alone). It still rises over whoever stands between (never across a person), lower than
       before: a fireball's flight, not a lob. Four in the air at most (his own, and his teacher's when he is not played) */
    const FS_FIRE = { core: 0xfff3cf, yel: 0xffc23a, orange: 0xff7417, deep: 0xff4a0e, ember: 0xffa640, smoke: 0x2e2119, scorch: 0x050302 };
    const FS_FLAME_FS = [
      'varying vec2 vUv; uniform float uT, uA, uW, uL, uSeed, uRound, uFlow;',
      'float h2(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }',
      'float vn(vec2 p){ vec2 i = floor(p), f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);',
      '  return mix(mix(h2(i), h2(i + vec2(1.0, 0.0)), u.x), mix(h2(i + vec2(0.0, 1.0)), h2(i + vec2(1.0, 1.0)), u.x), u.y); }',
      'float fbm(vec2 p){ float v = 0.0, a = 0.5; for (int i = 0; i < 4; i++) { v += a * vn(p); p = p * 2.03 + vec2(1.7, 9.2); a *= 0.5; } return v; }',
      'void main(){',
      /* (in the head's radii from the head's centre, +y the way it flies; the tail's length behind it) */
      '  float r = 0.5 * uW, tl = max(0.0, uL - uW) / max(r, 1e-4);',
      '  vec2 q = ((vUv - 0.5) * vec2(uW, uL) - vec2(0.0, 0.5 * uL - r)) / max(r, 1e-4);',
      '  float al = clamp(-q.y / max(tl, 1e-3), 0.0, 1.0);',
      '  float w = 0.62 * pow(1.0 - al, 0.85) + 0.02;',
      '  float d = q.y >= 0.0 || uRound > 0.5 ? length(q) / 0.62 : (q.y < -tl ? 9.0 : abs(q.x) / w + 0.3 * al);',
      /* (the flames flow back along the flight: the noise drawn along it on the clock; a finer one flickers the heat) */
      '  float n = fbm(vec2(q.x * 1.7 + uSeed, q.y * 1.15 + uT * uFlow)), n2 = fbm(vec2(q.x * 3.6 - uT * 1.1, q.y * 2.6 + uT * uFlow * 1.7) + uSeed * 1.9);',
      /* (tongues: a finer noise across the flame, drawn back along it, tearing its edge the more the further back) */
      '  float n3 = vn(vec2(q.x * 6.0 + uSeed * 3.1, q.y * 2.0 + uT * uFlow * 2.3));',
      '  float shape = 1.0 - smoothstep(0.45, 1.1, d + (n - 0.5) * 1.45 + (n3 - 0.5) * (0.25 + 0.6 * al));',
      '  float heat = shape * (1.0 - 0.6 * al) * (0.55 + 0.9 * n2);',
      '  float core = uRound > 0.5 ? 0.0 : exp(-dot(q, q) * 11.0);',
      '  vec3 c = mix(vec3(0.62, 0.05, 0.03), vec3(1.0, 0.30, 0.04), smoothstep(0.08, 0.42, heat));',
      '  c = mix(c, vec3(1.0, 0.62, 0.10), smoothstep(0.42, 0.72, heat));',
      '  c = mix(c, vec3(1.0, 0.94, 0.74), clamp(smoothstep(0.72, 1.0, heat) + core * 0.85, 0.0, 1.0));',
      '  float a = clamp(shape * (0.28 + 0.95 * heat) + core * 0.9, 0.0, 1.0) * uA;',
      '  if (a < 0.003) discard;',
      '  gl_FragColor = vec4(c, a); }'].join('\n');
    const fsFlameGeo = (() => { const g = new THREE.PlaneGeometry(1, 1); owned.push(g); return g; })();
    function fsFlame(round = false, ro = 6) {
      const m = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false, toneMapped: false,
        uniforms: { uT: { value: 0 }, uA: { value: 0 }, uW: { value: 0.5 }, uL: { value: 0.5 }, uSeed: { value: 0 }, uRound: { value: round ? 1 : 0 }, uFlow: { value: round ? -3.5 : 6.5 } },
        vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }', fragmentShader: FS_FLAME_FS });
      mats.push(m); const me = new THREE.Mesh(fsFlameGeo, m); me.visible = false; me.renderOrder = ro; me.frustumCulled = false; FSG.add(me); return me;
    }
    /* a flame card at x, facing the lens, its head there and its tail streaming back against `dir` as the lens sees it
       (`dir` a unit; a flight straight at the lens leaves it round); W its head's width, `tail` the most its tail runs */
    const _fbF = new THREE.Vector3(), _fbX = new THREE.Vector3(), _fbY = new THREE.Vector3(), _fbZ = new THREE.Vector3(), _fbC = new THREE.Vector3(), _fbM = new THREE.Matrix4();
    function fsFlameLay(me, x, dir, W, tail) {
      camera.getWorldPosition(_fbC); _fbF.subVectors(x, _fbC); const fl = _fbF.length(); if (fl < 1e-4) return; _fbF.multiplyScalar(1 / fl);
      _fbY.copy(dir).addScaledVector(_fbF, -dir.dot(_fbF)); const vp = _fbY.length();
      if (vp < 1e-3) { _fbY.set(0, 1, 0).addScaledVector(_fbF, -_fbF.y); if (_fbY.lengthSq() < 1e-8) _fbY.set(0, 0, 1); _fbY.normalize(); } else _fbY.multiplyScalar(1 / vp);
      _fbZ.copy(_fbF).negate(); _fbX.crossVectors(_fbY, _fbZ).normalize(); _fbY.crossVectors(_fbZ, _fbX);
      const L = W + tail * Math.min(1, vp);
      _fbM.makeBasis(_fbX, _fbY, _fbZ); me.quaternion.setFromRotationMatrix(_fbM);
      me.position.copy(x).addScaledVector(_fbY, -(L - W) / 2); me.scale.set(W, L, 1);
      const U = me.material.uniforms; U.uW.value = W; U.uL.value = L;
    }
    const FS_TRAIL = 6;
    const fsBalls = [0, 1, 2, 3].map((i) => ({ on: false, flame: fsFlame(false, 6), core: fsSprite(FS_FIRE.core, true, 7), glow: fsSprite(FS_FIRE.orange, true, 6), halo: fsSprite(FS_FIRE.deep, true, 5),
      trail: Array.from({ length: FS_TRAIL }, () => fsSprite(FS_FIRE.orange, true, 5)), pool: fsGround(fsDot, FS_FIRE.orange, true, 0.016),
      a: new THREE.Vector3(), b: new THREE.Vector3(), d: new THREE.Vector3(), t: 0, T: 0.7, ai: false, id: 0, hist: [], smokeT: 0, seed: 3.1 * i + 0.7 }));
    /* where it lands: the white flash and the roiling ball of fire (fire's), the light along the paving, and the scorch
       left under it (painted dark, fading over 2.4 s) */
    const fsBlooms = [0, 1, 2, 3].map(() => ({ on: false, s: fsSprite(FS_FIRE.orange, true, 6), g: fsGround(fsDot, FS_FIRE.orange, true, 0.017), t: 0, col: FS_FIRE.orange, k: 1,
      fire: false, y: 1.3, ball: fsFlame(true, 7), flash: fsSprite(FS_FIRE.core, true, 8) }));
    const fsScorches = [0, 1, 2, 3].map(() => { const m = fsGround(fsDot, FS_FIRE.scorch, false, 0.0155); return { m, t: -1, k: 1 }; });
    /* THE FIRE'S SMOKE: soft dark puffs left in the air behind a ball and rising from where it lands (dealt from twenty-
       four; the oldest goes) */
    const fsSmokes = Array.from({ length: 24 }, () => { const m = new THREE.SpriteMaterial({ map: fsSmokeTex, color: FS_FIRE.smoke, transparent: true, opacity: 0, depthWrite: false, fog: false, toneMapped: false }); mats.push(m);
      const s = new THREE.Sprite(m); s.visible = false; s.renderOrder = 4; FSG.add(s); return { s, t: -1, T: 1, s0: 0.1, s1: 0.5, a: 0.3, vy: 0.2, rot: 0 }; });
    let fsSmokeI = 0;
    function fsSmoke(x, y, z, o = {}) { const P = fsSmokes[fsSmokeI++ % fsSmokes.length], r = FS5.srand || Math.random;
      P.t = 0; P.T = o.life || 0.9; P.s0 = o.s0 || 0.12; P.s1 = o.s1 || 0.5; P.a = o.a != null ? o.a : 0.3; P.vy = o.vy != null ? o.vy : 0.25; P.rot = (r() - 0.5) * 1.2;
      P.s.position.set(x, y, z); P.s.material.rotation = r() * Math.PI * 2; P.s.visible = true; }
    /* the flare at the Naga's mouth as a ball is let go */
    const fsFlares = [0, 1].map(() => ({ s: fsSprite(FS_FIRE.yel, true, 8), t: -1 }));
    function fsFlare(p, k = 1) { const F = fsFlares.find(f => f.t < 0) || fsFlares[0]; F.t = 0; F.k = k; F.s.position.copy(p); }
    /* THE BUBBLES (BIND): violet light round the Prai, brighter at its edge (a fresnel), thinning as its time runs; three */
    const fsBubbleMat = () => {
      const m = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.FrontSide,
        uniforms: { uCol: { value: new THREE.Color(FS_COL.violet) }, uA: { value: 0 }, uT: { value: 0 }, uFl: { value: 0 } },
        vertexShader: 'varying vec3 vN; varying vec3 vV; void main(){ vec4 mv = modelViewMatrix * vec4(position, 1.0); vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }',
        fragmentShader: 'uniform vec3 uCol; uniform float uA, uT, uFl; varying vec3 vN; varying vec3 vV; void main(){ float f = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), 2.4); float w = 0.86 + 0.14 * sin(uT * 2.6 + vN.y * 4.0); vec3 c = mix(uCol, vec3(1.0, 0.35, 0.45), uFl); gl_FragColor = vec4(c * (0.10 + 1.25 * f) * w, uA * (0.10 + 0.9 * f)); }' });
      mats.push(m); return m; };
    const fsBubbleGeo = (() => { const g = new THREE.SphereGeometry(1, 28, 18); owned.push(g); return g; })();
    const fsBubbles = [0, 1, 2].map(() => { const me = new THREE.Mesh(fsBubbleGeo, fsBubbleMat()); me.visible = false; me.renderOrder = 4; FSG.add(me); return { me, id: 0, fl: 0 }; });
    /* THE TIRED ONES' RINGS, closing on the paving over the rules' ring time (the clock of its rising is on the screen) */
    const fsRings = Array.from({ length: 6 }, () => fsGround(fsRingTex, FS_COL.pale, true, 0.015));
    /* THE SMELL: its ripple out from him along the paving; a dark cloud where each hidden one is shown (rising into
       sight out of it); and a stale cloud where a smell was, thinning */
    const fsRipple = { m: fsGround(fsRingTex, FS_COL.sour, true, 0.018), t: -1, x: 0, z: 0 };
    const fsSmokeMat = () => { const m = new THREE.SpriteMaterial({ map: fsSmokeTex, color: 0x14170f, transparent: true, opacity: 0, depthWrite: false, fog: false, toneMapped: false }); mats.push(m); return m; };
    const fsClouds = Array.from({ length: 6 }, () => { const s = new THREE.Sprite(fsSmokeMat()); s.visible = false; s.renderOrder = 4; FSG.add(s);
      const e = fsSprite(FS_COL.sour, true, 4); return { s, e, id: '', t: 0 }; });
    const fsPuffs = Array.from({ length: 4 }, () => { const s = new THREE.Sprite(fsSmokeMat()); s.visible = false; s.renderOrder = 4; FSG.add(s); return { s, t: -1, x: 0, z: 0 }; });
    /* THE GOLDEN SHOCKWAVE: the gold gathering at his shoulders and a ring of gold drawn in round him (its 1.5 s), then the
       wheel going out over the paving; the lamps flaring as it passes them; the screen warmed a fifth of a second */
    const fsWheel = fsGround(fsWheelTex, FS_COL.gold, true, 0.02), fsWheel2 = fsGround(fsWheelTex, FS_COL.gold, true, 0.019);
    /* (and its rim a low wall of gold light standing up off the paving as it goes out: the wheel read from behind and
       above, where a ring lying flat on the paving is a thin line) */
    const fsWallTex = (() => { const [c, x] = fsCanvas(64); const g = x.createLinearGradient(0, 64, 0, 0); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.3, 'rgba(255,255,255,0.5)'); g.addColorStop(1, 'rgba(255,255,255,0)');
      x.fillStyle = g; x.fillRect(0, 0, 64, 64); return tex(done(THREE, c, false)); })();
    const fsWall = (() => { const geo = new THREE.CylinderGeometry(1, 1, 0.75, 72, 1, true); geo.translate(0, 0.375, 0); owned.push(geo);
      const m = new THREE.MeshBasicMaterial({ map: fsWallTex, color: FS_COL.gold, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, fog: false, toneMapped: false }); mats.push(m);
      const me = new THREE.Mesh(geo, m); me.visible = false; me.renderOrder = 3; FSG.add(me); return me; })();
    const fsGatherRing = fsGround(fsRingTex, FS_COL.gold, true, 0.021);
    const fsGoldHalo = fsSprite(FS_COL.gold, true, 6);
    /* THE BAG: what is drawn streams to his mouth and down into the open bag at the doorway; a thin line on the paving joins
       him to the one the button will take while it shows */
    const FS_STREAK = 14;
    const fsStreaks = [0, 1, 2].map(() => ({ on: false, id: 0, t: 0, T: 1, gold: false, a: new THREE.Vector3(), m: new THREE.Vector3(), b: new THREE.Vector3(), c: new THREE.Vector3(),
      dots: Array.from({ length: FS_STREAK }, () => fsSprite(0x2a2f38, false, 5)), glints: Array.from({ length: 9 }, () => fsSprite(FS_COL.pale, true, 6)) }));
    const fsReach = (() => { const m = new THREE.Mesh(fsQuad, fsGroundMat(null, FS_COL.pale, true)); m.visible = false; m.position.y = 0.019; m.renderOrder = 2; FSG.add(m); return m; })();
    /* where a Prai presses his cage's bars: a violet flare on the bars, flickering */
    const fsPress = [0, 1, 2].map(() => fsSprite(FS_COL.violet, true, 5));
    /* THE SPARKS AND MOTES: one cloud of points for every glint the fight throws (the fire's sparks and its burst where it
       lands, the gold's motes gathering into his shoulders and riding the wheel, its burst as it goes out, the bubbles'
       violet motes and the bind's burst, the bars' flicker where a Prai presses), ONE draw: each point a soft round light,
       hot at its heart, additive, sized in metres on the screen's own scale (chapter 1's points, e4c1's pxScale). Dealt
       from a ring of 360; the oldest goes when it is full; a spark that falls to the paving skips and dies there */
    const FS_PN = 360;
    const fsPts = (() => {
      const g = new THREE.BufferGeometry(), pos = new Float32Array(FS_PN * 3), col = new Float32Array(FS_PN * 3), siz = new Float32Array(FS_PN), alp = new Float32Array(FS_PN);
      const at = (a, n) => { const b = new THREE.BufferAttribute(a, n); b.setUsage(THREE.DynamicDrawUsage); return b; };
      g.setAttribute('position', at(pos, 3)); g.setAttribute('aC', at(col, 3)); g.setAttribute('aS', at(siz, 1)); g.setAttribute('aA', at(alp, 1));
      g.setDrawRange(0, 0); owned.push(g);
      const m = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, uniforms: { uScale: { value: 500 } },
        vertexShader: 'attribute vec3 aC; attribute float aS; attribute float aA; varying vec3 vC; varying float vA; uniform float uScale; void main(){ vC = aC; vA = aA; vec4 mv = modelViewMatrix * vec4(position, 1.0); gl_PointSize = aS * uScale / max(0.05, -mv.z); gl_Position = projectionMatrix * mv; }',
        fragmentShader: 'varying vec3 vC; varying float vA; void main(){ float d = length(gl_PointCoord - 0.5) * 2.0; if (d > 1.0) discard; float f = pow(1.0 - d, 1.7); gl_FragColor = vec4(vC + vec3(pow(1.0 - d, 6.0) * 0.75), vA * f); }' });
      mats.push(m);
      const pts = new THREE.Points(g, m); pts.frustumCulled = false; pts.renderOrder = 7; FSG.add(pts);
      const P = Array.from({ length: FS_PN }, () => ({ on: false, x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0, age: 0, life: 1, s0: 0.05, s1: 0.02, c: new THREE.Color(), a0: 1, drag: 0, grav: 0, to: null }));
      return { g, m, pts, pos, col, siz, alp, P, cur: 0 };
    })();
    const _fsCol = {}; const fsC = (hex) => _fsCol[hex] || (_fsCol[hex] = new THREE.Color(hex));
    function fsSpark(x, y, z, o) {
      const S = fsPts; let p = null;
      for (let i = 0; i < FS_PN; i++) { const q = S.P[(S.cur + i) % FS_PN]; if (!q.on) { p = q; S.cur = (S.cur + i + 1) % FS_PN; break; } }
      if (!p) { p = S.P[S.cur]; S.cur = (S.cur + 1) % FS_PN; }
      p.on = true; p.x = x; p.y = y; p.z = z; p.vx = o.vx || 0; p.vy = o.vy || 0; p.vz = o.vz || 0; p.age = 0; p.life = Math.max(0.05, o.life || 0.5);
      p.s0 = o.s0 || 0.06; p.s1 = o.s1 != null ? o.s1 : p.s0 * 0.35; p.c.copy(fsC(o.col || FS_COL.pale)); p.a0 = o.a != null ? o.a : 1;
      p.drag = o.drag != null ? o.drag : 1.5; p.grav = o.grav != null ? o.grav : -3; p.to = o.to || null;
    }
    /* a burst out from a point: `up` the least rise (0 flat, 1 straight up), `sp` its speed, `mix` the share in the second colour */
    function fsBurst(x, y, z, n, o) {
      const r = FS5.srand || Math.random;
      for (let i = 0; i < n; i++) { const th = r() * Math.PI * 2, ph = Math.asin(Math.min(1, (o.up != null ? o.up : 0.25) + r() * (1 - (o.up != null ? o.up : 0.25)))), sp = (o.sp || 2) * (0.45 + 0.55 * r());
        fsSpark(x, y, z, { vx: Math.cos(th) * Math.cos(ph) * sp, vy: Math.sin(ph) * sp, vz: Math.sin(th) * Math.cos(ph) * sp, life: (o.life || 0.6) * (0.6 + 0.4 * r()),
          s0: (o.s0 || 0.07) * (0.7 + 0.6 * r()), col: o.col2 != null && r() < (o.mix || 0) ? o.col2 : o.col, grav: o.grav, drag: o.drag, a: o.a }); }
    }
    function fsPtsFrame(wdt) {
      const S = fsPts; let hi = 0;
      S.m.uniforms.uScale.value = Math.min(devicePixelRatio || 1, LOW ? 1.6 : 2) * innerHeight / (2 * Math.tan(camera.fov * Math.PI / 360));
      for (let i = 0; i < FS_PN; i++) {
        const p = S.P[i];
        if (p.on && wdt > 0) { p.age += wdt; if (p.age >= p.life) p.on = false; }
        if (!p.on) { S.siz[i] = 0; S.alp[i] = 0; continue; }
        if (wdt > 0) { const dk = Math.exp(-p.drag * wdt); p.vx *= dk; p.vz *= dk; p.vy = p.vy * dk + p.grav * wdt;
          if (p.to) { const k = 1 - Math.exp(-p.to.k * wdt); p.x += (p.to.x - p.x) * k; p.y += (p.to.y - p.y) * k; p.z += (p.to.z - p.z) * k; }
          p.x += p.vx * wdt; p.y += p.vy * wdt; p.z += p.vz * wdt;
          if (p.y < 0.02) { p.y = 0.02; p.vy *= -0.25; p.vx *= 0.5; p.vz *= 0.5; p.life = Math.min(p.life, p.age + 0.12); } }
        const u = p.age / p.life, a = p.a0 * Math.min(1, u / 0.12) * Math.pow(1 - u, 1.3);
        S.pos[i * 3] = p.x; S.pos[i * 3 + 1] = p.y; S.pos[i * 3 + 2] = p.z; S.col[i * 3] = p.c.r; S.col[i * 3 + 1] = p.c.g; S.col[i * 3 + 2] = p.c.b;
        S.siz[i] = p.s0 + (p.s1 - p.s0) * u; S.alp[i] = a; hi = i + 1;
      }
      S.g.setDrawRange(0, hi); S.pts.visible = hi > 0;
      if (hi > 0) for (const k of ['position', 'aC', 'aS', 'aA']) S.g.attributes[k].needsUpdate = true;
    }
    function fsPtsClear() { for (const p of fsPts.P) p.on = false; fsPts.g.setDrawRange(0, 0); }

    /* ---------------------------------------------------------------- THE BUTTONS' PICTURES (drawn things, each in its
       act's own colour so a phone reads the act at a glance; no person is drawn: v21.16) */
    function fsIcon(draw) { const [c, x] = fsCanvas(96); x.lineCap = 'round'; x.lineJoin = 'round'; draw(x); return c; }
    const FS_ICON = {
      /* (bold enough to read in a button's 42 %: each fills most of its square; v26.0's phone at 360 points as the floor) */
      flame: fsIcon((x) => { const g = x.createLinearGradient(48, 92, 48, 6); g.addColorStop(0, '#ff2a4a'); g.addColorStop(0.55, '#ff6a7c'); g.addColorStop(1, '#fff1e8');
        x.fillStyle = g; x.beginPath(); x.moveTo(48, 4); x.bezierCurveTo(70, 30, 86, 46, 84, 64); x.bezierCurveTo(82, 84, 66, 93, 48, 93); x.bezierCurveTo(30, 93, 14, 84, 12, 64);
        x.bezierCurveTo(10, 46, 26, 30, 48, 4); x.closePath(); x.fill();
        x.fillStyle = '#fff6ee'; x.beginPath(); x.ellipse(48, 68, 13, 18, 0, 0, Math.PI * 2); x.fill(); }),
      shock: fsIcon((x) => { x.strokeStyle = '#ffcf6a'; x.lineWidth = 10; x.beginPath(); x.arc(48, 48, 37, 0, Math.PI * 2); x.stroke();
        x.lineWidth = 6; for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2; x.beginPath(); x.moveTo(48 + Math.cos(a) * 13, 48 + Math.sin(a) * 13); x.lineTo(48 + Math.cos(a) * 31, 48 + Math.sin(a) * 31); x.stroke(); }
        x.fillStyle = '#fff0c8'; x.beginPath(); x.arc(48, 48, 10, 0, Math.PI * 2); x.fill(); }),
      bag: fsIcon((x) => { x.fillStyle = '#2a2f3a'; x.strokeStyle = '#e8ecf4'; x.lineWidth = 6;
        x.beginPath(); x.moveTo(32, 26); x.bezierCurveTo(6, 44, 8, 92, 48, 92); x.bezierCurveTo(88, 92, 90, 44, 64, 26); x.closePath(); x.fill(); x.stroke();
        x.beginPath(); x.moveTo(26, 24); x.quadraticCurveTo(48, 38, 70, 24); x.stroke(); x.beginPath(); x.moveTo(40, 8); x.lineTo(38, 26); x.moveTo(56, 8); x.lineTo(58, 26); x.stroke(); }),
      bind: fsIcon((x) => { const g = x.createRadialGradient(40, 38, 6, 48, 48, 44); g.addColorStop(0, 'rgba(230,220,255,0.95)'); g.addColorStop(0.45, 'rgba(155,107,255,0.55)'); g.addColorStop(1, 'rgba(201,176,255,1)');
        x.fillStyle = g; x.beginPath(); x.arc(48, 48, 42, 0, Math.PI * 2); x.fill(); x.strokeStyle = '#e6dcff'; x.lineWidth = 7; x.stroke(); }),
      smell: fsIcon((x) => { x.strokeStyle = '#d4e2b4'; x.lineWidth = 8;
        x.beginPath(); x.moveTo(34, 6); x.bezierCurveTo(32, 30, 18, 50, 14, 62); x.bezierCurveTo(10, 76, 24, 84, 36, 80); x.bezierCurveTo(40, 88, 50, 88, 54, 80); x.stroke();
        x.lineWidth = 7; for (let i = 0; i < 3; i++) { const y0 = 30 + i * 20; x.beginPath(); x.moveTo(60, y0); x.bezierCurveTo(68, y0 - 9, 78, y0 + 9, 90, y0); x.stroke(); } }),
      lend: fsIcon((x) => { x.strokeStyle = '#c9b0ff'; x.lineWidth = 8; for (let i = 0; i < 5; i++) { const px = 14 + i * 17; x.beginPath(); x.moveTo(px, 8); x.lineTo(px, 78); x.stroke(); }
        x.lineWidth = 6; x.beginPath(); x.ellipse(48, 82, 40, 9, 0, 0, Math.PI * 2); x.stroke(); }),
      together: fsIcon((x) => { x.lineWidth = 9; x.strokeStyle = '#ffcf6a'; x.beginPath(); x.arc(34, 48, 26, 0, Math.PI * 2); x.stroke();
        x.strokeStyle = '#c9b0ff'; x.beginPath(); x.arc(62, 48, 26, 0, Math.PI * 2); x.stroke(); x.strokeStyle = '#ff4a62'; x.lineWidth = 7; x.beginPath(); x.moveTo(48, 6); x.quadraticCurveTo(80, 48, 48, 90); x.stroke(); })
    };

    /* ---------------------------------------------------------------- THE FIGHT'S SOUNDS (the manifest's map; each a
       literal name). One-shots from where they happen (panned by where it is on the screen), dealt in turn from a list;
       the cue volume is the manifest's */
    const FS_DEAL = { swing: ['u5swing1', 'u5swing2'], ball: ['u5fire1', 'u5fire2', 'u5fire3'], land: ['u5land1', 'u5land2'], tired: ['u5tired1', 'u5tired2'],
                      bind: ['u5bind1', 'u5bind2'], sniff: ['u5sniff1', 'u5sniff2', 'u5sniff3'], drawn: ['u5drawn1', 'u5drawn2'], rise: ['u5rise1', 'u5rise2'],
                      strain: ['u5strain1', 'u5strain2', 'u5strain3'], bars: ['u5barring1', 'u5barring2'], gather: ['u5gather1', 'u5gather2'],
                      note: ['u5note1', 'u5note2', 'u5note3', 'u5note4', 'u5note5', 'u5note6', 'u5note7', 'u5note8', 'u5note9'] };
    const FS_HIT = { come: 'u5hitc', slip: 'u5hits', hide: 'u5hith' };
    const FS_VOICE = { come: 'u5ncome', slip: 'u5nslip', hide: 'u5nhide' };
    const fsDealN = {};
    const fsDeal = (k) => { const L = FS_DEAL[k], i = (fsDealN[k] = (fsDealN[k] || 0) + 1); return L[(i - 1) % L.length]; };
    /* every sound the fight can ask for, warmed as its brief opens (v10.2) */
    const FS_WARM = ['u5swing1', 'u5swing2', 'u5fire1', 'u5fire2', 'u5fire3', 'u5flight', 'u5land1', 'u5land2', 'u5hitc', 'u5hits', 'u5hith', 'u5ruby', 'u5tired1', 'u5tired2',
      'u5slipthru', 'u5stale', 'u5bind1', 'u5bind2', 'u5bindhold', 'u5bindstale', 'u5bindpop', 'u5sniff1', 'u5sniff2', 'u5sniff3', 'u5sournote', 'u5ripple', 'u5shown',
      'u5strain1', 'u5strain2', 'u5strain3', 'u5lend', 'u5lendback', 'u5cagehum', 'u5cagethin', 'u5waveready', 'u5windup', 'u5robe', 'u5wave', 'u5lampflare', 'u5wavebreak',
      'u5drawn1', 'u5drawn2', 'u5baginhale', 'u5bagsnap', 'u5rise1', 'u5rise2', 'u5ncome', 'u5nslip', 'u5nhide', 'u5barring1', 'u5barring2', 'u5sink', 'u5gather1',
      'u5gather2', 'u5zbreath', 'u5unrise', 'u5cagecrack', 'u5stagger', 'u5cagewhole', 'u5murmur3', 'u5swpho', 'u5swzav', 'u5plant', 'u5shape', 'u5shapeloop',
      'u5togfill', 'u5done', 'u5broken', 'u5start', 'u5ready', 'u5note1', 'u5note2', 'u5note3', 'u5note4', 'u5note5', 'u5note6', 'u5note7', 'u5note8', 'u5note9',
      'u5m7low', 'u5m7drum', 'u5m7line', 'u5m7flute', 'u5m7voice', 'u5m8surge', 'u5m10last'];
    const _fsP = new THREE.Vector3();
    function fsPan(x, z, y = 1.0) { _fsP.set(x, y, z).project(camera); return Math.max(-0.8, Math.min(0.8, (_fsP.z > 1 ? -_fsP.x : _fsP.x) * 0.8)); }
    function fsFx(name, vol, x, z) {
      if (!worldSfx || (soundOff && soundOff())) return null;
      return worldSfx(name, vol, 0.97 + 0.06 * (FS5.srand ? FS5.srand() : 0.5), x == null ? 0 : fsPan(x, z));   // (a stream of its own: the rules' is theirs)
    }
    /* THE LOOPS the fight holds (the cage's hum and its thinning, his murmur, each Prai's voice, each bubble's held note, the
       tall shape, M7's five stems, M10): each a source the part keeps, its gain aimed each frame (eased over `tau`) and, a
       moment later, at nothing: so a loop the frame stops renewing goes quiet by itself (the plan's 6.1). A Prai's voice
       is panned as it moves (a panner put between the source and its gain) */
    const fsLoops = new Map();
    function fsLoopStart(L) {
      if (!worldSfx || (soundOff && soundOff())) return false;
      const s = worldSfx(L.name, 0.0001, 1, 0); if (!s || !s.buffer || !s.__g) { if (s) try { s.stop(); } catch (e) { } return false; }
      s.loop = true; s.loopStart = 0.06; s.loopEnd = Math.max(0.2, s.buffer.duration - 0.06);
      if (L.pan && s.context && s.context.createStereoPanner) { try { const pn = s.context.createStereoPanner(); s.disconnect(); s.connect(pn); pn.connect(s.__g); L.pn = pn; } catch (e) { L.pn = null; } }
      L.s = s; L.g = s.__g; L.set = -1; return true;
    }
    function fsLoop(key, name, want, o = {}) {
      let L = fsLoops.get(key);
      if (!L) { L = { key, name, s: null, g: null, pn: null, want: 0, set: -1, pan: !!o.pan, tau: o.tau || 0.13, panTo: 0, seen: true }; fsLoops.set(key, L); }
      L.want = Math.max(0, want); L.seen = true; if (o.tau) L.tau = o.tau; if (o.x != null) L.panTo = fsPan(o.x, o.z);
      return L;
    }
    /* the five stems, started in one instant or not at all (any not yet decoded: none starts, and it is tried again) */
    const FS_STEMS = ['u5m7low', 'u5m7drum', 'u5m7line', 'u5m7flute', 'u5m7voice'];
    function fsStemsStart() {
      if (FS5.stemsOn || !worldSfx || (soundOff && soundOff())) return;
      const got = [];
      for (const n of FS_STEMS) { const s = worldSfx(n, 0.0001, 1, 0); if (!s || !s.buffer || !s.__g) { if (s) try { s.stop(); } catch (e) { } for (const q of got) try { q.stop(); } catch (e) { } return; } got.push(s); }
      got.forEach((s, i) => { s.loop = true; s.loopStart = 0.06; s.loopEnd = Math.max(0.2, s.buffer.duration - 0.06);
        const L = fsLoop('stem' + i, FS_STEMS[i], 0, { tau: 0.133 }); L.s = s; L.g = s.__g; L.set = -1; L.stem = true; });
      FS5.stemsOn = true;
    }
    function fsLoopsTick() {
      const ac = (() => { for (const L of fsLoops.values()) if (L.s && L.s.context) return L.s.context; return null; })();
      const now = ac ? ac.currentTime : 0;
      for (const L of fsLoops.values()) {
        if (!L.seen) L.want = 0;
        L.seen = false;
        if (!L.s) { if (L.want > 0.002 && !L.stem && !fsLoopStart(L)) continue; if (!L.s) continue; }
        const g = L.g.gain;
        try {
          if (g.cancelAndHoldAtTime) g.cancelAndHoldAtTime(now); else { g.cancelScheduledValues(now); g.setValueAtTime(g.value, now); }
          g.setTargetAtTime(L.want, now, L.tau);
          g.setTargetAtTime(0, now + 0.35, 0.12);                 // (renewed every frame: if the frame stops, it goes quiet)
          if (L.pn) L.pn.pan.setTargetAtTime(L.panTo, now, 0.12);
        } catch (e) { }
      }
    }
    /* a one-shot the part holds (M8 under the surge) brought down and stopped */
    function fsFade(s, secs) { if (!s || !s.__g || !s.context) return; try { const t = s.context.currentTime, g = s.__g.gain; g.cancelScheduledValues(t); g.setValueAtTime(g.value, t); g.linearRampToValueAtTime(0.0001, t + secs); s.stop(t + secs + 0.05); } catch (e) { } }
    function fsLoopsStop() {
      for (const L of fsLoops.values()) if (L.s) { try { const t = L.s.context.currentTime; L.g.gain.cancelScheduledValues(t); L.g.gain.setValueAtTime(L.g.gain.value, t); L.g.gain.linearRampToValueAtTime(0.0001, t + 0.25); L.s.stop(t + 0.3); } catch (e) { } }
      fsLoops.clear(); FS5.stemsOn = false;
    }

    /* ---------------------------------------------------------------- THE WORDS (DATA.words: the sheet's) */
    const fsWords = () => DATA.words;
    /* (any why the rules answer is said by its own word on the sheet, `why` and its name: whyNone, whyGold, whyLendFirst,
       whyBindFirst, and whatever the rules come to answer; one with no word is not blocked here, so its press reaches
       the rules, which refuse it themselves) */
    function fsWhy(why) { const w = fsWords(); if (!why) return null; const k = 'why' + why[0].toUpperCase() + why.slice(1); return w[k] || null; }
    /* a line of the rules: said (its take), and captioned above the thumbs whether or not the sound is (the plan's 7.1) */
    function fsSay(key) {
      const L = LINES[key]; if (!L) return;
      FS5.lastLine = key; FS5.heard.push(key); if (FS5.heard.length > 120) FS5.heard.shift();
      if (kit && kit.captions) kit.captions([{ at: 0, end: (SECS[key] || 2.5) + 0.4, text: L[2], sub: WHO[L[0]] || '' }]);
      if (worldSfx && !(soundOff && soundOff())) worldSfx(key, 1, 1, 0);
    }

    /* ---------------------------------------------------------------- THE NINE ON THE COURT, as the rules have them */
    const fsPraiP = (id) => PRAI5.list[id - 1] || null;
    /* each one's look, eased toward its state (how far into the paving, how strong, how tall, its lean) */
    const fsVis = Array.from({ length: 9 }, () => ({ y: -1.9, a: 0, s: 1, lean: 0, sh: 0, was: '', vt: 0, voice: null }));
    const FS_SUNK = -1.9;
    function fsPraiReset(stand) {
      PRAI5.list.forEach((P, i) => { const V = fsVis[i]; V.was = ''; V.vt = 0; V.sh = 0;
        if (stand) { V.y = 0; V.a = 1; V.s = 1; V.lean = 0; } else { V.y = FS_SUNK; V.a = 0; V.s = 1; V.lean = 0; } });
    }
    /* where the nine stand while the brief is read: as the preparation's turn leaves them (the lesson's in the middle, the
       others where each will enter from), facing him */
    function fsNineStand() {
      const F = fightStart();
      PRAI5.list.forEach((P, i) => { const at = i === 0 ? F.lesson : (F.entry[(i - 1) % Math.max(1, F.entry.length)] || F.lesson);
        P.hidden = false; P.group.rotation.order = 'YXZ'; P.group.rotation.x = 0; P.group.scale.setScalar(1);
        put(P, at.x, at.z, faceTo(at.x, at.z, F.zav.x, F.zav.z)); if (P.ready) P.group.visible = true; PRAI5.alpha(P, 1); });
      PRAI5.look('trance');
    }
    function fsPraiFrame(wdt) {
      const st = FS5.st, zw = cast.zav ? cast.zav.group.position : { x: 0, z: 0 }, pw = cast.pho ? cast.pho.group.position : { x: 0, z: 0 };
      const k = (secs) => 1 - Math.exp(-wdt / Math.max(0.01, secs));
      st.prai.forEach((p, i) => {
        const P = PRAI5.list[i], V = fsVis[i]; if (!P) return;
        const w = fsW(p.x, p.z); let tY = 0, tA = 1, tS = 1, tL = 0, ry = faceTo(w.x, w.z, zw.x, zw.z), shake = 0, ease = 0.35;
        switch (p.st) {
          case 'waiting': case 'gathered': tY = FS_SUNK; tA = 0; ease = 0.4; break;
          case 'entering': { if (V.a > 0.9 && V.y > -0.1) break;                 // (already standing there: the lesson's, from the brief)
            const u = smo(c01(p.t / Math.max(0.05, FN5.enterSecs || 1))); V.y = FS_SUNK * (1 - u); V.a = u; tY = V.y; tA = V.a; ease = 0; break; }
          case 'coming': tL = 0.14; if (p.kind === 'slip') tL = 0.2; break;
          case 'pressing': tL = 0.24; shake = 0.035; break;
          case 'through': tL = 0.3; shake = 0.05; tA = 1; break;
          case 'fleeing': tL = -0.1; ry = faceTo(w.x, w.z, fsW(p.fx, p.fz).x, fsW(p.fx, p.fz).z); if (p.t > (FN5.fleeSecs || 1) * 0.55) { tY = FS_SUNK; tA = 0; ease = 0.3; } break;
          case 'hidden': case 'beneath': tY = FS_SUNK; tA = 0; ease = 0.35; break;
          case 'shown': ease = 0.4; break;
          case 'bound': tL = 0.05; break;
          case 'held': tS = 0.58; tA = 0.62; break;
          case 'tired': tS = 0.55; tA = 0.6; tL = 0.25; break;
          case 'rushing': tL = 0.3; ry = faceTo(w.x, w.z, pw.x, pw.z); ease = 0.15; break;
          case 'drawn': { const u = c01(p.t / Math.max(0.05, FN5.bagSecs || 1)); tS = 0.55 * (1 - 0.8 * u); tA = 0.6 * (1 - u); ease = 0; V.s = tS; V.a = tA; break; }
          case 'shape': break;                                         // (the surge's own: fsSurgeFrame)
          case 'laid': tS = 0.55; tA = 0.65; tL = 0.55; break;
        }
        if (p.st === 'shape') return;
        if (ease > 0) { const q = k(ease); V.y += (tY - V.y) * q; V.a += (tA - V.a) * q; V.s += (tS - V.s) * k(0.3); V.lean += (tL - V.lean) * k(0.25); }
        else { V.lean += (tL - V.lean) * k(0.25); }
        const vis = V.a > 0.02 && V.y > FS_SUNK + 0.05;
        P.hidden = !vis; if (P.ready) P.group.visible = vis;
        if (!vis) { V.was = p.st; return; }
        V.sh += wdt;
        const jx = shake ? Math.sin(V.sh * 31 + i) * shake : 0, jz = shake ? Math.cos(V.sh * 27 + i * 2) * shake : 0;
        /* (one waiting its turn, or gathered, has no place in the rules: it sinks where it stood) */
        if (p.st === 'waiting' || p.st === 'gathered') put(P, P.group.position.x, P.group.position.z, P.group.rotation.y, V.y);
        else put(P, w.x + jx, w.z + jz, ry, V.y);
        P.group.rotation.order = 'YXZ'; P.group.rotation.x = V.lean; P.group.scale.setScalar(V.s);
        PRAI5.alpha(P, V.a);
        V.was = p.st;
      });
    }
    /* THE SURGE (stage 4): the last three drawn together into one tall shape over him, leaning in: by its end exactly where
       the Naga's film begins them (c_yfilm.js FILMS5.together: his place, those three offsets, 1.55 times their height, a
       lean of -0.35), so the film opens on the picture the fight left */
    const FS_SHAPE = { ox: [-0.18, 0.2, 0.0], oz: [0.25, 0.22, 0.45] };
    function fsSurgeFrame(wdt) {
      const st = FS5.st, zw = cast.zav ? cast.zav.group.position : { x: 0, z: 0 };
      const u = smo(c01((st.stageT || 0) / 2.2));
      let j = 0;
      st.prai.forEach((p, i) => { if (p.st !== 'shape') return; const P = PRAI5.list[i], V = fsVis[i]; if (!P) return;
        if (V.from == null) V.from = { x: P.group.position.x, z: P.group.position.z, s: V.s, lean: V.lean, a: V.a };
        const x = lp(V.from.x, zw.x + FS_SHAPE.ox[j], u), z = lp(V.from.z, zw.z + FS_SHAPE.oz[j], u);
        V.y = 0; V.a = lp(V.from.a, 1, u); V.s = lp(V.from.s, 1.55, u); V.lean = lp(V.from.lean, -0.35, u);
        P.hidden = false; if (P.ready) P.group.visible = true;
        put(P, x, z, faceTo(x, z, zw.x, zw.z), 0); P.group.rotation.order = 'YXZ'; P.group.rotation.x = V.lean; P.group.scale.setScalar(V.s); PRAI5.alpha(P, V.a);
        j++; });
    }

    /* ---------------------------------------------------------------- THE EFFECTS' FRAME */
    const _fsA = new THREE.Vector3(), _fsB = new THREE.Vector3(), _fsC = new THREE.Vector3();
    /* the Naga's mouth: the stick's head in his hand (w5nagastaff: 1.40 m, its head at the top) */
    function fsMouth(out) { const g = things.nagaStaff; if (g && g.visible) { g.updateWorldMatrix(true, false); return out.set(0, 1.34, 0).applyMatrix4(g.matrixWorld); }
      const p = cast.pho ? cast.pho.group.position : { x: 0, z: 0 }; return out.set(p.x, 1.8, p.z); }
    function fsHead(P, out, y = 1.62) { if (P && P.ready && P.head) { P.head.getWorldPosition(out); return out; } const g = P ? P.group.position : { x: 0, z: 0 }; return out.set(g.x, y, g.z); }
    /* (let go `wait` seconds after the press: at the top of his swing, from where the stick's head is then; it lands when
       the rules land it, the flight the shorter by the wait) */
    function fsBallStart(f, wait = 0) {
      const B = fsBalls.find(b => !b.on) || fsBalls[0];
      B.on = true; B.t = 0; B.wait = Math.max(0, wait); B.T = Math.max(0.25, (FN5.flight || 0.7) - B.wait); B.ai = !!f.ai; B.id = f.id || 0; B.hist.length = 0;
      fsMouth(B.a); const w = fsW(f.x, f.z); B.b.set(w.x, 1.3, w.z);
      if (!f.id && !f.cloud) B.b.y = 0.05;
      if (!B.wait) fsBallGo(B);
    }
    /* let go: its sound, a flare at the Naga's mouth and a spit of sparks off it */
    function fsBallGo(B) { fsBallSound(B); fsFlare(B.a, B.ai ? 0.7 : 1);
      fsBurst(B.a.x, B.a.y, B.a.z, B.ai ? 8 : 16, { sp: 2.2, up: 0.1, life: 0.4, s0: 0.09, col: FS_FIRE.orange, col2: FS_FIRE.yel, mix: 0.5, grav: -1.5, drag: 3 }); }
    function fsBallSound(B) { const m = B.a; fsFx(fsDeal('ball'), B.ai ? 0.45 : 0.8, m.x, m.z); fsFx('u5flight', B.ai ? 0.32 : 0.6, m.x, m.z); }
    /* (a bloom of light where something lands: of fire (`fire`), with its flash, its roiling ball, its smoke and its scorch) */
    function fsBloom(x, z, col, k = 1, fire = false, y = 1.3) { const L = fsBlooms.find(b => !b.on) || fsBlooms[0]; L.on = true; L.t = 0; L.col = col; L.k = k; L.fire = fire; L.y = y;
      L.s.material.color.setHex(col); L.g.material.color.setHex(col); L.s.position.set(x, y, z); L.g.position.set(x, 0.017, z);
      if (!fire) return;
      L.ball.position.set(x, y, z); L.flash.position.set(x, y, z); L.ball.material.uniforms.uSeed.value = Math.abs(x * 7.3 + z * 3.1) % 10;
      const S = fsScorches.find(q => q.t < 0) || fsScorches[0]; S.t = 0; S.k = Math.min(1.2, k); S.m.position.set(x, 0.0155, z); S.m.scale.set(1.1 * k, 1, 1.1 * k);
      const r = FS5.srand || Math.random;
      for (let i = 0; i < 4; i++) fsSmoke(x + (r() - 0.5) * 0.3 * k, y + (r() - 0.3) * 0.3, z + (r() - 0.5) * 0.3 * k, { s0: 0.25 * k, s1: 0.9 * k, life: 1.2 + 0.4 * r(), a: 0.34, vy: 0.45 }); }
    const _fsUp = new THREE.Vector3(0, 1, 0);
    function fsFxFrame(wdt0, ft) {
      const st = FS5.st, wdt = FS5.labHold ? 0 : wdt0;
      /* the fireballs: out of the mouth, over, and down (a parabola above the line between them: it rises 0.8 m, his
         teacher's when he is not played 0.6 m: over whoever stands between, and a fireball's flight, not a lob) */
      for (const B of fsBalls) {
        if (!B.on) { if (B.flame.visible || B.core.visible) { B.flame.visible = B.core.visible = B.glow.visible = B.halo.visible = B.pool.visible = false; for (const s of B.trail) s.visible = false; } continue; }
        if (B.wait > 0) { B.wait -= wdt; if (B.wait > 0) continue; fsMouth(B.a); fsBallGo(B); }   // (let go now, from the stick's head)
        B.t += wdt; const u = c01(B.t / B.T), H = B.ai ? 0.6 : 0.8, h = H * 4 * u * (1 - u);
        _fsA.lerpVectors(B.a, B.b, u); _fsA.y += h;
        B.d.subVectors(B.b, B.a); B.d.y += H * 4 * (1 - 2 * u); if (B.d.lengthSq() > 1e-8) B.d.normalize(); else B.d.set(0, 0, 1);   // (its way now: the path's own)
        const sz = B.ai ? 0.72 : 1, fl = 0.9 + 0.07 * Math.sin(ft * 41 + B.id) + 0.05 * Math.sin(ft * 67 + B.seed);
        fsFlameLay(B.flame, _fsA, B.d, 0.5 * sz * fl, Math.min(1.25 * sz, 1.1 * _fsA.distanceTo(B.a)));   // (its tail never longer than the way it has come)
        const U = B.flame.material.uniforms; U.uT.value = ft; U.uA.value = 1; U.uSeed.value = B.seed;
        B.flame.visible = B.core.visible = B.glow.visible = B.halo.visible = true;
        B.core.position.copy(_fsA); B.glow.position.copy(_fsA); B.halo.position.copy(_fsA);
        B.core.scale.setScalar(0.15 * sz * fl); B.glow.scale.setScalar(0.6 * sz * fl); B.halo.scale.setScalar(1.6 * sz * (0.92 + 0.08 * fl));
        B.core.material.opacity = 0.95; B.glow.material.opacity = 0.5; B.halo.material.opacity = 0.26;
        /* (its embers: shed behind it, most rising as hot things rise, the brightest falling, a few of the stick's ruby;
           and a puff of thin smoke left in the air every 45 ms) */
        if (wdt > 0) { const r = FS5.srand || Math.random, n = B.ai ? 2 : 4;
          for (let k = 0; k < n; k++) { const hot = r() < 0.28, red = !hot && r() < 0.18;
            fsSpark(_fsA.x - B.d.x * 0.12 + (r() - 0.5) * 0.14, _fsA.y - B.d.y * 0.12 + (r() - 0.5) * 0.14, _fsA.z - B.d.z * 0.12 + (r() - 0.5) * 0.14,
              { vx: -B.d.x * 0.6 + (r() - 0.5) * 0.9, vy: hot ? (r() - 0.6) * 0.8 : 0.3 + r() * 0.7, vz: -B.d.z * 0.6 + (r() - 0.5) * 0.9,
                life: 0.4 + 0.5 * r(), s0: (hot ? 0.07 : 0.09) * (B.ai ? 0.8 : 1) * (0.7 + 0.6 * r()), col: hot ? FS_FIRE.core : (red ? FS_COL.ruby : FS_FIRE.ember),
                grav: hot ? -3 : 0.7, drag: 1.4 }); }
          B.smokeT -= wdt; if (B.smokeT <= 0) { B.smokeT = B.ai ? 0.07 : 0.045; fsSmoke(_fsA.x - B.d.x * 0.25, _fsA.y - B.d.y * 0.25, _fsA.z - B.d.z * 0.25, { s0: 0.12 * sz, s1: 0.5 * sz, life: 0.75, a: 0.3, vy: 0.3 }); } }
        if (wdt > 0) { B.hist.unshift(_fsA.clone()); if (B.hist.length > FS_TRAIL * 2) B.hist.length = FS_TRAIL * 2; }
        /* (the trail of fire behind: orange, deepening, the stick's ruby at its end) */
        B.trail.forEach((s, j) => { const q = B.hist[j * 2 + 1]; s.visible = !!q; if (!q) return; const v = 1 - j / FS_TRAIL;
          s.position.copy(q); s.scale.setScalar(0.42 * sz * v); s.material.opacity = 0.5 * v * v; s.material.color.setHex(j < 2 ? FS_FIRE.orange : (j < 4 ? FS_FIRE.deep : FS_COL.ruby)); });
        B.pool.visible = true; B.pool.position.set(_fsA.x, 0.016, _fsA.z); B.pool.scale.set(1.3 * sz, 1, 1.3 * sz); B.pool.material.opacity = 0.38 * (0.35 + 0.65 * (1 - Math.min(1, Math.max(0, _fsA.y - 0.3) / 2.2)));
        if (u >= 1) B.on = false;
      }
      /* the fire's smoke, its flares at the Naga's mouth, and the scorches fading off the paving */
      for (const P of fsSmokes) { if (P.t < 0) continue; P.t += wdt; const u = P.t / P.T; if (u >= 1) { P.t = -1; P.s.visible = false; continue; }
        P.s.position.y += P.vy * wdt; P.s.material.rotation += P.rot * wdt; P.s.scale.setScalar(P.s0 + (P.s1 - P.s0) * Math.sqrt(u)); P.s.material.opacity = P.a * Math.min(1, u / 0.15) * (1 - u); }
      for (const F of fsFlares) { if (F.t < 0) continue; F.t += wdt; const u = F.t / 0.22; if (u >= 1) { F.t = -1; F.s.visible = false; continue; }
        F.s.visible = true; F.s.scale.setScalar((0.35 + 0.7 * u) * F.k); F.s.material.opacity = 0.95 * (1 - u); }
      for (const S of fsScorches) { if (S.t < 0) continue; S.t += wdt; const u = S.t / 2.4; if (u >= 1) { S.t = -1; S.m.visible = false; continue; }
        S.m.visible = true; S.m.material.opacity = 0.55 * S.k * (1 - u) * Math.min(1, S.t / 0.1); }
      for (const L of fsBlooms) {
        if (!L.on) { if (L.s.visible || L.ball.visible || L.flash.visible) L.s.visible = L.g.visible = L.ball.visible = L.flash.visible = false; continue; }
        L.t += wdt; const u = c01(L.t / 0.6); L.s.visible = L.g.visible = true;
        L.s.scale.setScalar((0.5 + 1.3 * u) * L.k); L.s.material.opacity = (L.fire ? 0.6 : 0.95) * (1 - u);
        L.g.scale.set((0.8 + 1.8 * u) * L.k, 1, (0.8 + 1.8 * u) * L.k); L.g.material.opacity = 0.55 * (1 - u);
        /* (fire's: the white flash, 0.16 s, and the ball of fire swelling and thinning as it rises, 0.5 s) */
        if (L.fire) { const ub = c01(L.t / 0.5), uf = c01(L.t / 0.16);
          L.ball.visible = ub < 1; L.flash.visible = uf < 1;
          L.ball.position.y = L.y + 0.3 * ub * L.k; fsFlameLay(L.ball, L.ball.position, _fsUp, (0.5 + 1.7 * Math.sqrt(ub)) * L.k, 0);
          const U = L.ball.material.uniforms; U.uT.value = ft; U.uA.value = Math.pow(1 - ub, 1.2);
          L.flash.scale.setScalar((0.7 + 1.5 * uf) * L.k); L.flash.material.opacity = 1 - uf; }
        else { L.ball.visible = L.flash.visible = false; }
        if (u >= 1) L.on = false;
      }
      /* the bubbles: one on each bound (and bound and tired) Prai, thinning as its time runs; ruby for a moment when the
         fire tires the one in it */
      const bound = st.prai.filter(p => p.st === 'bound' || p.st === 'held');
      fsBubbles.forEach((Bb, j) => {
        const p = bound[j]; if (!p) { Bb.me.visible = false; Bb.id = 0; return; }
        const P = fsPraiP(p.id), V = fsVis[p.id - 1], w = fsW(p.x, p.z);
        if (Bb.id !== p.id) { Bb.id = p.id; Bb.fl = 0; }
        Bb.fl = Math.max(0, Bb.fl - wdt * 1.8);
        const left = c01((p.bub || 0) / Math.max(0.1, FN5.bubbleSecs || 10)), sc = V ? V.s : 1;
        Bb.me.visible = true; Bb.me.position.set(w.x, 0.92 * sc, w.z); Bb.me.scale.set(0.62 * sc, 1.0 * sc, 0.62 * sc);
        const U = Bb.me.material.uniforms; U.uA.value = 0.35 + 0.65 * left; U.uT.value = ft; U.uFl.value = Bb.fl;
        /* (violet motes rising off its skin, the fewer the thinner it has worn) */
        if (wdt > 0) { const rr = FS5.srand || Math.random; if (rr() < wdt * (6 + 10 * left)) { const a = rr() * Math.PI * 2, yy = rr() * 2 - 1, q = Math.sqrt(1 - yy * yy);
          fsSpark(w.x + Math.cos(a) * q * 0.6 * sc, 0.92 * sc + yy * 0.95 * sc, w.z + Math.sin(a) * q * 0.6 * sc, { vx: 0, vy: 0.22 + 0.2 * rr(), vz: 0, life: 0.8 + 0.4 * rr(), s0: 0.075, s1: 0.03, col: 0xc9b0ff, grav: 0.05, drag: 0.4, a: 0.85 }); } }
        void P;
      });
      /* the tired ones' rings, closing */
      const tired = st.prai.filter(p => p.st === 'tired');
      fsRings.forEach((m, j) => { const p = tired[j]; if (!p) { m.visible = false; return; }
        const w = fsW(p.x, p.z), left = c01((p.ring || 0) / Math.max(0.1, FN5.ringSecs || 6)), r = 0.3 + 0.95 * left;
        m.visible = true; m.position.set(w.x, 0.015, w.z); m.scale.set(r * 2, 1, r * 2); m.material.opacity = 0.75; });
      /* the smell's ripple out from him */
      if (fsRipple.t >= 0) { fsRipple.t += wdt; const u = c01(fsRipple.t / 1.1);
        fsRipple.m.visible = true; fsRipple.m.position.set(fsRipple.x, 0.018, fsRipple.z); const r = 0.6 + 5.4 * u; fsRipple.m.scale.set(r * 2, 1, r * 2);
        fsRipple.m.material.opacity = 0.6 * (1 - u); if (u >= 1) { fsRipple.t = -1; fsRipple.m.visible = false; } }
      /* the stale clouds, thinning where the smell was */
      fsClouds.forEach((C, j) => { const c = st.clouds[j];
        if (!c) { C.s.visible = C.e.visible = false; C.id = ''; return; }
        const w = fsW(c.x, c.z), k = c01(c.t / Math.max(0.1, FN5.staleSecs || 3));
        C.id = 'c' + c.id; C.s.visible = C.e.visible = true;
        C.s.position.set(w.x, 0.55, w.z); C.s.scale.setScalar(1.15 + 0.25 * Math.sin(ft * 0.9 + j)); C.s.material.opacity = 0.75 * k;
        C.e.position.set(w.x, 0.5, w.z); C.e.scale.setScalar(1.5); C.e.material.opacity = 0.22 * k; });
      for (const Pf of fsPuffs) { if (Pf.t < 0) { Pf.s.visible = false; continue; }
        Pf.t += wdt; const u = c01(Pf.t / 1.2); Pf.s.visible = true; Pf.s.position.set(Pf.x, 0.3 + 1.0 * u, Pf.z); Pf.s.scale.setScalar(0.8 + 1.0 * u); Pf.s.material.opacity = 0.85 * (1 - u);
        if (u >= 1) Pf.t = -1; }
      /* THE GOLD: gathering at his shoulders (a ring of gold drawn in round him), then the wheel out over the paving */
      const ph = st.pho, pw = cast.pho ? cast.pho.group.position : null, wind = ph.wind > 0 ? 1 - ph.wind / Math.max(0.1, FN5.windSecs || 1.5) : 0;
      if (wind > 0 && pw) { fsGatherRing.visible = true; fsGatherRing.position.set(pw.x, 0.021, pw.z); const r = 2.6 - 1.9 * wind; fsGatherRing.scale.set(r * 2, 1, r * 2); fsGatherRing.material.opacity = 0.35 + 0.5 * wind;
        fsGoldHalo.visible = true; fsHead(cast.pho, fsGoldHalo.position, 1.5); fsGoldHalo.position.y -= 0.15; fsGoldHalo.scale.setScalar(0.9 + 1.6 * wind); fsGoldHalo.material.opacity = 0.22 + 0.38 * wind;
        if (wdt > 0) { const rr = FS5.srand || Math.random, to = { x: fsGoldHalo.position.x, y: fsGoldHalo.position.y, z: fsGoldHalo.position.z, k: 3.2 };
          for (let k = 0; k < 4; k++) { const a = rr() * Math.PI * 2, R = r + 0.2 + rr() * 0.6;
            fsSpark(pw.x + Math.cos(a) * R, 0.15 + rr() * 1.7, pw.z + Math.sin(a) * R, { vx: -Math.sin(a) * 0.9, vy: 0, vz: Math.cos(a) * 0.9, life: 0.5 + 0.2 * rr(), s0: 0.1 * (0.7 + 0.6 * rr()), s1: 0.04, col: rr() < 0.25 ? 0xfff0c8 : FS_COL.gold, grav: 0, drag: 0.5, to }); } } }
      else { fsGatherRing.visible = false; fsGoldHalo.visible = false; }
      if (ph.ring) { const w = fsW(ph.ring.x, ph.ring.z), r = Math.max(0.2, ph.ring.r), out = c01(r / Math.max(0.1, FN5.ringMax || 7));
        fsWheel.visible = true; fsWheel.position.set(w.x, 0.02, w.z); fsWheel.scale.set(r * 2, 1, r * 2); fsWheel.rotation.y = -r * 0.25; fsWheel.material.opacity = 0.95 * (1 - out * out);
        /* (a second wheel just behind it, turning the other way; gold motes lifting off its rim as it goes) */
        fsWall.visible = true; fsWall.position.set(w.x, 0, w.z); fsWall.scale.set(r, 1 - 0.5 * out, r); fsWall.material.opacity = 0.75 * (1 - out);
        const r2 = Math.max(0.15, r - 0.55); fsWheel2.visible = true; fsWheel2.position.set(w.x, 0.019, w.z); fsWheel2.scale.set(r2 * 2, 1, r2 * 2); fsWheel2.rotation.y = r * 0.4; fsWheel2.material.opacity = 0.5 * (1 - out);
        if (wdt > 0) { const rr = FS5.srand || Math.random; for (let k = 0; k < 7; k++) { const a = rr() * Math.PI * 2;
          fsSpark(w.x + Math.cos(a) * r, 0.06, w.z + Math.sin(a) * r, { vx: Math.cos(a) * 0.5, vy: 0.7 + 0.8 * rr(), vz: Math.sin(a) * 0.5, life: 0.55 + 0.35 * rr(), s0: 0.11 * (0.7 + 0.6 * rr()), col: rr() < 0.3 ? 0xfff0c8 : FS_COL.gold, grav: 0.25, drag: 1.2, a: 0.9 * (1 - out) }); } }
        /* the lamps at the house flare as it passes them */
        const dl = Math.abs((COURT5.z - (HOUSE.face - 0.3)) - ph.ring.z) - r;
        if (dl < 0.2 && !FS5.flared) { FS5.flared = true; FS5.flare = 1; fsFx('u5lampflare', 0.4, DOOR_FRONT.x0 - 0.38, HOUSE.face - 0.3); fsFx('u5lampflare', 0.34, DOOR_FRONT.x1 + 0.38, HOUSE.face - 0.3); } }
      else { fsWheel.visible = fsWheel2.visible = fsWall.visible = false; FS5.flared = false; }
      FS5.flare = Math.max(0, FS5.flare - wdt * 2.2);
      /* the streaks: drawn to his mouth, and down into the bag (gold when the gold gathers it) */
      for (const S of fsStreaks) {
        if (!S.on) { if (S.dots[0].visible) { for (const d of S.dots) d.visible = false; for (const d of S.glints) d.visible = false; } continue; }
        S.t += wdt; const u = c01(S.t / S.T);
        if (!S.gold) fsHead(cast.pho, S.m, 1.55); else { S.m.set(S.a.x * 0.5 + S.c.x * 0.5, 2.6, S.a.z * 0.5 + S.c.z * 0.5); }
        const at = (q, out) => { if (q < 0.6) { const v = q / 0.6; return out.lerpVectors(S.a, S.m, v).setY(lp(S.a.y, S.m.y, v) + 0.35 * Math.sin(v * Math.PI)); }
          const v = (q - 0.6) / 0.4; return out.lerpVectors(S.m, S.c, v).setY(lp(S.m.y, S.c.y, v) + 0.25 * Math.sin(v * Math.PI)); };
        S.dots.forEach((d, j) => { const q = u * 1.25 - j * 0.03; d.visible = q > 0 && q < 1; if (!d.visible) return; at(q, d.position);
          d.scale.setScalar(0.26 * (1 - 0.6 * q) + 0.05); d.material.opacity = 0.85 * (1 - q * 0.5); d.material.color.setHex(S.gold ? 0x7a5a18 : 0x232830); });
        S.glints.forEach((d, j) => { const q = u * 1.25 - j * 0.04 - 0.02; d.visible = q > 0 && q < 1; if (!d.visible) return; at(q, d.position);
          d.scale.setScalar(0.3 * (1 - 0.4 * q)); d.material.opacity = 0.85; d.material.color.setHex(S.gold ? FS_COL.gold : FS_COL.pale); });
        if (u >= 1) S.on = false;
      }
      /* the bubbles of light where a Prai presses the bars, flickering */
      const zz = FS5.st.cage.lent > 0 ? (cast.pho ? cast.pho.group.position : null) : (cast.zav ? cast.zav.group.position : null);
      const press = st.prai.filter(p => p.st === 'pressing');
      fsPress.forEach((s, j) => { const p = press[j]; if (!p || !zz) { s.visible = false; return; }
        const w = fsW(p.x, p.z), dx = w.x - zz.x, dz = w.z - zz.z, d = Math.hypot(dx, dz) || 1, R = (FN5.cageR || 1);
        s.visible = true; s.position.set(zz.x + dx / d * R, 1.0, zz.z + dz / d * R); s.scale.setScalar(0.5 + 0.18 * Math.sin(ft * 23 + j * 2));
        s.material.opacity = 0.55 + 0.35 * Math.sin(ft * 17 + j);
        if (wdt > 0) { const rr = FS5.srand || Math.random; if (rr() < wdt * 24) fsSpark(s.position.x, 0.5 + rr() * 1.1, s.position.z, { vx: dx / d * (0.4 + rr() * 0.6), vy: (rr() - 0.4) * 1.2, vz: dz / d * (0.4 + rr() * 0.6), life: 0.22 + 0.15 * rr(), s0: 0.05, col: rr() < 0.3 ? 0xffffff : FS_COL.violet, grav: -1, drag: 3 }); } });
      fsPtsFrame(wdt);
    }

    /* ---------------------------------------------------------------- THE TWO OF THEM: their takes, their faces */
    const fsTake = { pho: { walking: false, t: 0, pace: 0, gait: 'Walking' }, zav: { walking: false, t: 0, pace: 0, gait: 'Walking' } };
    /* THEIR WALK AND HIS RUN, by the ground each covers (R25: "the characters walking speed feels sluggish, make it faster
       and more responsive"; "Fireball, shockwave, walking and bagging can all be different animations"): Grandmaster Pho
       WALKS (his file's Walking, 1.42 m a second of its own) below 1.7 m a second and RUNS (his file's Running, 2.31 of
       its own) above 1.9, keeping the one he has between; each played at the rate the ground asks of it (its own pace,
       read from his file the way c_cast.js `pace` reads it: the planted foot's way back), so a planted foot stays planted
       at every pace. A change between the two is a crossfade of a fifth of a second IN STEP: the new take begins where
       the old one's feet are, the run's phase the walk's less a tenth (each foot's stance in his run, 0.88 to 0.05 and
       0.35 to 0.52 of it, lies inside its stance in his walk, 0.90 to 0.25 and 0.43 to 0.65, shifted so: read from his
       file at a hundredth of each take). His student has only his Walking (1.23 of its own). The rates are held between
       0.35 and 1.5 of a take's own (a slower walk is a stroll, never a frozen leg) */
    const FS_RUN = { on: 1.9, off: 1.7, shift: -0.10, fade: 0.2 };
    function fsGait(P, who, pace) {
      if (who !== 'pho' || !P.acts.Running) return 'Walking';
      return fsTake[who].gait === 'Running' && fsTake[who].walking ? (pace < FS_RUN.off ? 'Walking' : 'Running') : (pace > FS_RUN.on ? 'Running' : 'Walking');
    }
    const fsGaitRate = (P, name, pace) => Math.max(0.35, Math.min(1.5, pace / ((P.pace && P.pace[name]) || (name === 'Running' ? 2.31 : 1.29))));
    /* into the walk or the run this pace asks for: from his rest (eased in over 0.15 s), or from the other one, in step */
    function fsGaitTo(P, who, g, fade) {
      const T = fsTake[who], from = T.walking && T.gait !== g ? T.gait : null;
      T.walking = true; T.t = 0; T.gait = g;
      if (P.win) delete P.win[g];
      take(P, g, from ? FS_RUN.fade : fade);
      if (from && P.acts[from] && P.acts[g]) {
        const A0 = P.acts[from], A1 = P.acts[g], d0 = A0.getClip().duration || 1, d1 = A1.getClip().duration || 1;
        const u0 = (((A0.time % d0) + d0) % d0) / d0, u1 = (((u0 + (g === 'Running' ? FS_RUN.shift : -FS_RUN.shift)) % 1) + 1) % 1;
        A1.time = u1 * d1; }
    }
    /* HIS ACTS IN HIS OWN BODY: three of Grandmaster Pho's own file's takes (none was made for the fight), each played
       between two of its own moments (span) on the frame the rules begin the act, with every posture law of his as it
       stands (none is keyed to these three, so each plays as his file has it). Read from his file through its bones
       (hands, head, hips and feet at thirty moments of each: M8's takeread), then photographed in the game:
       FIRE, mage_soell_cast_7 (R25: "Fireball, shockwave, walking and bagging can all be different animations"; his file's
         nineteen takes measured as motions, M8's takemotion: of the six that cast, this one is the THROW: a step in with
         his right foot, 0.7 m, its toe 4 cm off the paving, and his right hand driven out to arm's length at his
         shoulder's height, 1.14 m before him, fastest at 0.78 of it; mage_soell_cast, the first pass's, lifts the stick
         straight over his head and throws nothing): from his wind (0.45) to the hand out (0.95) in 0.28 s, the fireball let
         go there, then the hand back and the foot stepped home (2.2) in 0.55 s; he plants for it (0.83 s of the fire's
         1.1 s wait)
       SHOCKWAVE, Charged_Spell_Cast: the gather low (0.50 to 1.50 of it) and both hands up (2.0) over the gold's 1.5 s,
         held up until the wheel goes out, then down (2.6) in 0.6 s; broken, he lets it go at once
       BAG, mage_soell_cast_8: both hands drawn in to his mouth (0 to 0.40 of it) over 0.6 s of the bag's draw, held
         until it is in the bag, then let down
       FS_ACTS off: he fires from his walk and his rest, as the first pass had him */
    const FS_ACTS = true;
    /* (the fire's coming down ends at 0.90 of his take and hands him back from there. SHOCKWAVE and BAG play his own takes
       too (the lead's word, R23), each SET DOWN BY HIS OWN FEET over the moments played: fsGroundActs, below) */
    const FS_PHO_TAKE = { phoFire: { take: 'mage_soell_cast_7', a: 0.45, top: 0.95, b: 2.20, up: 0.28, down: 0.55, hold: false },
                          wave: { take: 'Charged_Spell_Cast', a: 0.50, top: 2.00, b: 2.60, up: 1.5, down: 0.60, hold: true },
                          bag:  { take: 'mage_soell_cast_8', a: 0.00, top: 0.40, b: 0.40, up: 0.6, down: 0.35, hold: true } };
    /* HIS ACTS SET DOWN BY HIS OWN FEET, at run time (his file untouched: his rule). Each of his takes is set down once at
       build over its whole length (groundTakes: by its lowest moment), so a take whose feet rise in its middle floats there
       (his charged cast's crouch: both feet 6 cm up, measured) and one whose foot dips between the moments read sinks
       (cast_8: his left foot 2 cm under). Here each act's played window gets a curve instead, as a rise from a seat has one
       (riseCurve, read by personSettle at the take's own moment): the lowest of his soles at 25 moments of the window,
       each set GROUND_SOLE over the paving, read on his own skin through groundTakes' own points. Once, when his body has
       landed (behind the loading curtain) */
    function fsGroundActs(P) {
      if (!P || !P.ready || !P.lv || !P.lv[1] || !P.lv[1][0] || !P.lv[1][0].skeleton || !P.hips) return;
      const skins = P.lv[1], PTS = groundPoints(P, skins), keep = {};
      for (const k in P.acts) keep[k] = [P.acts[k].time, P.w[k] || 0, P.acts[k].timeScale];
      for (const kind in FS_PHO_TAKE) {
        const R0 = FS_PHO_TAKE[kind], name = R0.take, A = P.acts[name]; if (!A || (P.rise && P.rise[name])) continue;
        for (const k in P.acts) P.acts[k].setEffectiveWeight(k === name ? 1 : 0);
        P.model.position.set(0, 0, 0);
        const t0 = Math.min(R0.a, R0.top, R0.b), t1 = Math.max(R0.a, R0.top, R0.b), N = 25, ts = [], off = [], ks = [];
        const sms = FASTSKIN ? new Map() : null;
        for (let i = 0; i < N; i++) { const t = t0 + (t1 - t0) * i / (N - 1); A.time = t; P.mixer.update(0); P.group.updateWorldMatrix(true, false); P.group.updateMatrixWorld(true);
          _grI.copy(P.group.matrixWorld).invert(); let m = Infinity; if (sms) sms.clear();
          for (const [k, j] of PTS.foot) { const q = skins[k]; if (!q) continue; _grM.multiplyMatrices(_grI, q.matrixWorld);
            if (sms) { let SM = sms.get(q); if (!SM) { SM = skinMats(q).map(x => x.clone()); sms.set(q, SM); } skinVertex(q, j, _grV, SM); } else q.getVertexPosition(j, _grV);
            _grV.applyMatrix4(_grM); if (_grV.y < m) m = _grV.y; }
          if (!(m < 1)) { m = P.offY[name] || 0; }
          ts.push(t); off.push(m - GROUND_SOLE); ks.push(0); }
        (P.rise = P.rise || {})[name] = { ts, off, k: ks };
        (P.groundRep = P.groundRep || {})[name + ' (the fight)'] = { from: +t0.toFixed(2), to: +t1.toFixed(2), lo: +Math.min(...off).toFixed(4), hi: +Math.max(...off).toFixed(4), whole: P.offY[name] };
      }
      for (const k in P.acts) { P.acts[k].time = keep[k][0]; P.acts[k].setEffectiveWeight(keep[k][1]); P.acts[k].timeScale = keep[k][2]; }
      P.mixer.update(0); personSettle(P);
    }
    /* (on only once proved: until tools/probes/e4c5ground.mjs has measured his feet over each window and photographed him,
       the gold and the bag stand as before and the fire keeps its build-time grounding; a probe turns it on: lab.groundOn) */
    /* (PROVED, 21 Nov, tools/probes/e4c5ground.mjs over each act's window at 13 moments, his own skin: the planted soles
       0.15 to 0.47 cm into the paving (GROUND_SOLE's 0.3), a lifted foot up to 5.6 cm in the throw's step and 5.2 in the
       bag's; the gold's crouch lays his robe's hem on the paving (its lowest 6 cm into it, read in the pictures as cloth
       pooled on the floor); his front and side photographed at the gold's crouch and top, the bag's draw, the throw and its
       held hand) */
    const FS_GROUND_ON = true;
    if (FS_GROUND_ON) whenReady(cast.pho, fsGroundActs);
    const fsActOn = (kind) => kind === 'phoFire' || FS_GROUND_ON || FS5.groundOn;
    function fsPhoAct(kind, up) {
      const P = cast.pho, A = FS_PHO_TAKE[kind];
      if (!FS_ACTS || !P || !P.ready || !A || !P.acts[A.take] || !fsActOn(kind)) return 0;
      const run = FS5.run, n = ++FS5.actN, u = up != null ? up : A.up;
      FS5.act = { kind, n, top: false, down: false, at: FS5.wall, until: FS5.wall + u + (A.hold ? 9 : A.down) };
      span(P, A.take, A.a, A.top, u, { fade: Math.min(0.2, u), then: () => { if (run !== FS5.run || !FS5.act || FS5.act.n !== n) return;
        FS5.act.top = true; if (!A.hold) fsPhoDown(); } });
      return u;
    }
    /* from the act's top back down, then his walk or his rest */
    function fsPhoDown() {
      const P = cast.pho, Ac = FS5.act; if (!P || !Ac || Ac.down) return;
      const A = FS_PHO_TAKE[Ac.kind], run = FS5.run, n = Ac.n;
      Ac.down = true; Ac.until = FS5.wall + A.down;
      span(P, A.take, A.top, A.b, A.down, { fade: 0, then: () => { if (run !== FS5.run || !FS5.act || FS5.act.n !== n) return; fsPhoBack(); } });
    }
    function fsPhoBack(fade = 0.3) {
      const P = cast.pho; FS5.act = null; if (!P) return;
      const T = fsTake.pho;
      if (T.pace > 0.08) { T.walking = false; fsGaitTo(P, 'pho', fsGait(P, 'pho', T.pace), fade); fsGaitRates(P, T.pace); }
      else { T.walking = false; T.t = 0; rest(P, fade); }
    }
    /* the act's held top let go (the wave gone out, the Prai in the bag), or the act broken off (the gold broken) */
    function fsPhoRelease(kind) { const Ac = FS5.act; if (!Ac || Ac.kind !== kind || Ac.down) return; if (Ac.top) fsPhoDown(); else { const P = cast.pho, A = FS_PHO_TAKE[kind];
      if (P && A) { const n = Ac.n, run = FS5.run; Ac.down = true; Ac.until = FS5.wall + A.down; span(P, A.take, P.acts[A.take] ? P.acts[A.take].time : A.top, A.b, A.down, { fade: 0, then: () => { if (run === FS5.run && FS5.act && FS5.act.n === n) fsPhoBack(); } }); } } }
    function fsPhoCut(kind) { const Ac = FS5.act; if (!Ac || (kind && Ac.kind !== kind)) return; fsPhoBack(0.25); }
    const fsActing = () => !!(FS5.act && FS5.wall < FS5.act.until);
    function fsBodyTake(P, who, pace, wdt) {
      if (!P || !P.ready) return;
      const T = fsTake[who]; T.pace = pace;
      if (who === 'pho' && (fsActing() || FS5.labPose)) return;       // (an act's take holds him: it hands him back itself)
      const moving = pace > 0.08;
      if (moving) { T.t = 0; const g = fsGait(P, who, pace); if (!T.walking || g !== T.gait) fsGaitTo(P, who, g, 0.15); }
      else if (T.walking) { T.t += wdt; if (T.t > 0.12) { T.walking = false;           // (stopped: his rest within 0.12 s, eased 0.25)
        if (who === 'zav') { const rt = zavRest(); if (rt) rest(P, 0.25); else hold(P, 'Walking', ZAV_STAND5, 0.001, 0.25); } else rest(P, 0.25); } }
      fsGaitRates(P, moving ? pace : 0);
    }
    /* each walking take at the rate its own pace asks (the one fading out too, so its feet keep step as it goes); his
       whole body at its own rate (P.rate, which his rest and every other take of his run on) */
    function fsGaitRates(P, pace) {
      P.rate = 1;
      for (const nm of ['Walking', 'Running']) { const A = P.acts[nm];
        if (!A || (P.span && P.span.name === nm) || (P.win && P.win[nm])) continue;
        A.timeScale = pace > 0.08 ? fsGaitRate(P, nm, pace) : 1; }
    }
    /* THEIR FOOTFALLS on the paving (the engine's steps are the first person's, and he does not walk in the mode): each
       body's walk struck where its own take sets a foot down, read from each file through its bones (M8's takeread: his
       teacher's Walking at 0.37 and 0.85 of its 1.03 s, his own at 0.28 and 0.78), at the manifest's gain */
    const FS_STEP = { pho: { name: 'u5phostep', at: [0.37, 0.85], run: [0.30, 0.86] }, zav: { name: 'u5zstep', at: [0.28, 0.78] } };
    /* (his run's own strikes, the same way: each foot within 3.5 cm of its lowest, at 0.30 and 0.86 of its 0.63 s) */
    function fsSteps() {
      for (const who of ['pho', 'zav']) {
        const P = who === 'pho' ? cast.pho : cast.zav, S = FS_STEP[who], T = fsTake[who];
        const g = T.gait === 'Running' && S.run && P && P.acts && P.acts.Running ? 'Running' : 'Walking';
        if (!P || !P.ready || !P.acts[g] || !P.group.visible) continue;
        const A = P.acts[g], d = A.getClip().duration || 1, u = ((A.time % d) + d) % d / d, last = T.stepG === g ? T.stepU : null;
        T.stepU = u; T.stepG = g;
        if (last == null || !T.walking || (P.w[g] || 0) < 0.5) continue;
        for (const a of (g === 'Running' ? S.run : S.at)) if (last <= u ? (last < a && u >= a) : (last < a || u >= a)) {
          const k = Math.min(1, (T.pace || 0) / (who === 'pho' ? (FN5.phoWalk || 1.2) : (FN5.zavWalk || 0.6)));
          fsFx(S.name, 0.4 * (0.75 + 0.25 * k), P.group.position.x, P.group.position.z); }
      }
    }
    function fsStand(P, who) {
      if (!P) return; fsTake[who].walking = false; fsTake[who].t = 0; fsTake[who].gait = 'Walking';
      whenReady(P, (Q) => { Q.rate = 1; if (who === 'zav') { const rt = zavRest(); if (rt) rest(Q, 0); else hold(Q, 'Walking', ZAV_STAND5, 0.001, 0); } else rest(Q, 0); });
    }

    /* ---------------------------------------------------------------- THE SCREEN: each act from FIGHT.hud, the switch, the
       objective, the count, the marks over the Prai, the other one's share */
    function fsActState(b) {
      const st = FS5.st, n = FN5, ph = st.pho;
      const o = { hidden: !b.shown, blocked: null, wait: 0, pulse: !!b.pulse, on: false };
      if (!b.shown) return o;
      const w = b.why;
      if (w === 'wait') o.wait = Math.max(0.002, b.wait);
      else if (w === 'lock') o.wait = Math.max(0.002, (st.lock || 0) / Math.max(0.1, n.switchLock || 0.8));
      else if (w === 'busy') {
        const share = Math.max(ph.wind > 0 ? ph.wind / (n.windSecs || 1.5) : 0, ph.draw > 0 ? ph.draw / (n.bagSecs || 1) : 0,
                               ph.ring ? 1 - c01(ph.ring.r / (n.ringMax || 7)) : 0, st.cage.lent > 0 ? st.cage.lent / (n.lendSecs || 6) : 0);
        o.wait = Math.max(0.002, Math.min(1, share));
        if (b.act === 'LEND' && st.cage.lent > 0) o.on = true;
      }
      else if (w === 'full') o.label = fsWords().whyFull;                  // (said on its face; the press goes to the rules, which refuse it and say why once)
      else if (w && w !== 'stage' && w !== 'notYours') o.blocked = fsWhy(w) || null;
      if (o.pulse && o.blocked) o.pulse = false;
      return o;
    }
    function fsHud() {
      const st = FS5.st, H = FIGHT.hud(st), W5 = fsWords(), played = H.who === 'pho' ? 'pho' : 'zavier';
      const surge = st.stage === 'surge';
      for (const who of ['pho', 'zavier']) for (const slot of ['main', 'second', 'third']) {
        const id = FS_ID[who][slot];
        if (who !== played) continue;                                     // (only the one played has buttons on the screen)
        if (surge) {
          if (slot === 'main') kit.tagAct(id, { hidden: false, blocked: null, wait: 0, fill: H.together.fill, pulse: H.together.live && !(H.together.fill > 0), on: H.together.fill > 0,
                                                label: W5.btnTogether, icon: FS_ICON.together });
          else kit.tagAct(id, { hidden: true, pulse: false });
          continue;
        }
        const o = fsActState(H[slot]);
        /* (a button come ready after a wait of its own of 2.4 s or more: the manifest's u5ready; the gold has its own) */
        const Wt = FS5.waits[id] || (FS5.waits[id] = { on: false, at: 0 });
        if (o.wait > 0 && H[slot].why === 'wait') { if (!Wt.on) { Wt.on = true; Wt.at = FS5.wall; } }
        else if (Wt.on) { Wt.on = false; if (!o.hidden && !o.blocked && FS5.wall - Wt.at >= 2.4 && id !== 'shock') fsFx('u5ready', 0.5, null); }
        const base = { flame: W5.btnFire, shock: W5.btnShockwave, bag: W5.btnBag, bind: W5.btnBind, smell: W5.btnSmell, lend: W5.btnLend }[id];
        kit.tagAct(id, { hidden: o.hidden, blocked: o.blocked, wait: o.wait, fill: 0, pulse: o.pulse, on: o.on, label: o.label || base, icon: FS_ICON[id] });
      }
      /* the switch: free once taught; said, never pressed, otherwise (the engine shows it whenever there are two) */
      const sw = H.swap, swWhy = FIGHT.why(st, 'SWITCH');
      let swBlock = null;
      if (st.stage === 'surge') swBlock = W5.objFight4;
      else if (st.stage === 'last') swBlock = W5.objFight6;
      else if (!sw.shown || (swWhy && swWhy !== 'lock')) swBlock = W5.whySwitchFirst || W5.objFight1;
      kit.tagAct('switch', { blocked: swBlock, pulse: !!sw.pulse && !swBlock });
      /* the objective (true whoever is played), the count, his cage's strength on his mark */
      const ob = H.objective, txt = ob ? String(W5[ob.key] || '').replace('{n}', String(ob.n != null ? ob.n : st.left)) : null;
      if (txt !== FS5.obj) {
        const lessonStep = /^objFight(1|1b|2|2b)$/.test(FS5.objKey) && ob && ob.key !== FS5.objKey;
        kit.objective(txt, { complete: lessonStep });
        FS5.obj = txt; FS5.objKey = ob ? ob.key : '';
      }
      kit.tagCount(st.left, 9);
      kit.tagBody('zavier', { share: played === 'pho' ? H.cage.str : null });
      kit.tagBody('pho', { share: null });
    }
    /* THE MARKS: a ring over each Prai the one he plays can act on, in that act's colour (ruby: the fire tires it; violet:
       bind it; pale and dashed: tired, for the bag), the one the moment asks for picked; and a stale cloud, dim */
    function fsMarks() {
      const st = FS5.st; if (!st || !FS5.live) return [];
      const P = st.who === 'pho', nd = st.cur, out = [];
      const pick = FS5.pick;
      for (const p of st.prai) {
        const s = p.st, w = fsW(p.x, p.z), V = fsVis[p.id - 1], y = 1.95 * (V ? V.s : 1);   // (over its head, never on one in front of it)
        let col = null, dim = false;
        if (P) {
          if (s === 'bound') col = '#ff4a62';
          else if (s === 'held' || s === 'tired' || s === 'laid') { col = '#e8ecf4'; dim = true; }
          else if ((s === 'coming' || s === 'pressing' || s === 'through' || s === 'shown') && p.kind !== 'slip') { col = '#ff8a96'; dim = true; }
        } else if (s === 'coming' || s === 'pressing' || s === 'through' || s === 'shown' || s === 'rushing') col = '#b896ff';
        else if (s === 'tired') { col = '#b896ff'; dim = true; }
        if (!col || !(V && V.a > 0.5)) continue;
        const id = 'p' + p.id, asked = nd && nd.target === p.id;
        out.push({ id, at: [w.x, y, w.z], r: 30, color: col, dim: dim && !asked, picked: pick ? pick === id : asked });
      }
      for (const c of st.clouds) { const w = fsW(c.x, c.z); out.push({ id: 'c' + c.id, at: [w.x, 0.6, w.z], r: 26, color: '#a8b890', dim: true, picked: FS5.pick === 'c' + c.id }); }
      return out;
    }

    /* ---------------------------------------------------------------- WHAT THE RULES ANSWERED, drawn and sounded */
    function fsEvents(ev) {
      const st = FS5.st;
      for (const e of ev) {
        switch (e.e) {
          case 'say': fsSay(e.key); break;
          case 'drain': if (kit && kit.award) kit.award('sanity', -e.amt, { minigame: true });
            if (FS5.wall - FS5.drainSnd > 2.2) { FS5.drainSnd = FS5.wall; const zw = cast.zav ? cast.zav.group.position : null; fsFx('u5zbreath', 0.8, zw ? zw.x : null, zw ? zw.z : null); }
            break;
          case 'sanity': { const now = kit && kit.stat ? kit.stat('sanity') : null; if (now != null && e.to > now + 0.01 && kit.award) kit.award('sanity', e.to - now); break; }
          case 'fireball': { const m = fsMouth(_fsA);
            /* (his swing: always when played, he plants for it; unplayed, only standing, for the rules walk him) */
            const up = !e.ai || (FS5.aiPace.pho || 0) < 0.08 ? fsPhoAct('phoFire') : 0;
            if (!e.ai) fsFx(fsDeal('swing'), 0.8, m.x, m.z);
            fsBallStart(e, up); FS5.faceTo.pho = e; FS5.faceT.pho = 0.7;
            break; }
          case 'land': { const w = fsW(e.x, e.z), p = e.id ? st.prai[e.id - 1] : null;
            const y0 = 1.3 * (p && fsVis[p.id - 1] ? fsVis[p.id - 1].s : 1);
            if (e.result === 'tired') { fsBloom(w.x, w.z, FS_FIRE.orange, 1.2, true, y0); fsFx('u5ruby', 0.8, w.x, w.z); fsFx(fsDeal('tired'), 0.8, w.x, w.z); const Bb = fsBubbles.find(b => b.id === e.id); if (Bb) Bb.fl = 1;
              fsBurst(w.x, y0, w.z, 30, { sp: 3.2, up: 0.15, life: 0.8, s0: 0.14, col: FS_FIRE.orange, col2: FS_FIRE.yel, mix: 0.4, grav: -4 });
              fsBurst(w.x, y0, w.z, 8, { sp: 2.4, up: 0.3, life: 0.7, s0: 0.1, col: FS_COL.ruby, grav: -3 }); }
            else if (e.result === 'chased' || e.result === 'setback') { fsBloom(w.x, w.z, FS_FIRE.orange, e.result === 'setback' ? 0.7 : 1, true, y0); fsFx(fsDeal('land'), e.result === 'setback' ? 0.5 : 0.8, w.x, w.z); if (p) fsFx(FS_HIT[p.kind] || 'u5hitc', e.result === 'setback' ? 0.5 : 0.8, w.x, w.z);
              fsBurst(w.x, y0, w.z, e.result === 'setback' ? 16 : 34, { sp: 3.0, up: 0.2, life: 0.7, s0: 0.12, col: FS_FIRE.orange, col2: FS_FIRE.yel, mix: 0.4, grav: -4 });
              fsBurst(w.x, y0, w.z, e.result === 'setback' ? 4 : 7, { sp: 2, up: 0.3, life: 0.6, s0: 0.09, col: FS_COL.ruby, grav: -3 }); }
            else if (e.result === 'slipped') { fsBloom(w.x, w.z, FS_FIRE.orange, 0.5, true, 0.6); fsFx('u5slipthru', 0.8, w.x, w.z); fsBurst(w.x, 0.3, w.z, 8, { sp: 1.6, up: 0.4, life: 0.5, s0: 0.06, col: FS_FIRE.orange, col2: FS_FIRE.yel, mix: 0.3, grav: -4 }); }
            else if (e.result === 'stale') { fsBloom(w.x, w.z, FS_COL.sour, 0.7); fsFx('u5stale', 0.8, w.x, w.z); fsBurst(w.x, 0.5, w.z, 8, { sp: 0.9, up: 0.5, life: 0.7, s0: 0.06, col: FS_COL.sour, grav: 0.3, a: 0.5 }); }
            else { fsBloom(w.x, w.z, FS_FIRE.orange, 0.6, true, 0.35); fsFx(fsDeal('land'), 0.6, w.x, w.z); fsBurst(w.x, 0.1, w.z, 10, { sp: 2, up: 0.45, life: 0.5, s0: 0.065, col: FS_FIRE.orange, col2: FS_FIRE.yel, mix: 0.3, grav: -5 }); }
            break; }
          case 'bind': { const zw = cast.zav ? cast.zav.group.position : null;
            if (e.stale) fsFx('u5bindstale', 0.8, zw ? zw.x : null, zw ? zw.z : null);
            else { const p = st.prai[e.id - 1], w = p ? fsW(p.x, p.z) : null; fsFx(fsDeal('bind'), 0.8, w ? w.x : null, w ? w.z : null);
              if (w) { FS5.faceTo.zavier = { x: p.x, z: p.z }; FS5.faceT.zavier = 0.7; fsBloom(w.x, w.z, FS_COL.violet, 0.9);
                fsBurst(w.x, 1.2, w.z, 20, { sp: 1.8, up: 0, life: 0.6, s0: 0.11, col: FS_COL.violet, col2: 0xe6dcff, mix: 0.3, grav: 0, drag: 3.5 }); } }
            break; }
          case 'unbind': { const p = st.prai[e.id - 1], w = p ? fsW(p.x, p.z) : null; fsFx('u5bindpop', 0.8, w ? w.x : null, w ? w.z : null); break; }
          case 'smell': { const zw = cast.zav ? cast.zav.group.position : { x: 0, z: 0 }; fsRipple.t = 0; fsRipple.x = zw.x; fsRipple.z = zw.z;
            fsFx(fsDeal('sniff'), 0.8, null); fsFx('u5sournote', 0.8, null); fsFx('u5ripple', 0.8, null);
            if (kit && kit.chill) { kit.chill(0.3, { secs: 0.5, tint: 'sour' }); FS5.chillK = -1; FS5.chillHold = 0.9; }
            break; }
          case 'drawn': for (const p of st.prai) if (p.st === 'coming' || p.st === 'pressing') { const w = fsW(p.x, p.z); fsFx(fsDeal('strain'), 0.55, w.x, w.z); break; } break;
          case 'lend': { const pw = cast.pho ? cast.pho.group.position : null; fsFx('u5lend', 0.8, pw ? pw.x : null, pw ? pw.z : null);
            FS5.faceTo.zavier = { x: st.pho.x, z: st.pho.z }; FS5.faceT.zavier = 0.9; break; }          // (he turns to the one he lends it to)
          case 'lendEnd': { const zw = cast.zav ? cast.zav.group.position : null; fsFx('u5lendback', 0.8, zw ? zw.x : null, zw ? zw.z : null); break; }
          case 'waveReady': fsFx('u5waveready', 0.8, null); break;
          case 'windup': { const pw = cast.pho ? cast.pho.group.position : null; fsFx('u5windup', 0.8, pw ? pw.x : null, pw ? pw.z : null); fsFx('u5robe', 0.8, pw ? pw.x : null, pw ? pw.z : null);
            fsPhoAct('wave', FN5.windSecs || 1.5); break; }
          case 'wave': fsFx('u5wave', 1.0, null); if (kit && kit.flash) kit.flash({ color: '#FFD27A', secs: 0.22 }); FS5.flared = false; fsPhoRelease('wave');
            { const pw = cast.pho ? cast.pho.group.position : null; if (pw) fsBurst(pw.x, 1.45, pw.z, 40, { sp: 4, up: 0, life: 0.85, s0: 0.13, col: FS_COL.gold, col2: 0xfff0c8, mix: 0.35, grav: -0.6, drag: 1.6 }); }
            break;
          case 'broken': { const pw = cast.pho ? cast.pho.group.position : null; fsFx('u5wavebreak', 0.8, pw ? pw.x : null, pw ? pw.z : null); fsPhoCut('wave'); break; }
          case 'gathered': { const p = st.prai[e.id - 1]; fsStreak(p, e.by === 'wave');
            /* (the manifest's: gathered by the gold, drawn and its note; by the bag, the bag's snap and its note: the bag's
               drawing was heard at its press) */
            if (e.by === 'bag') { fsFx('u5bagsnap', 0.8, RITE.bag.x, RITE.bag.z); fsPhoRelease('bag'); fsBurst(RITE.bag.x, 0.4, RITE.bag.z, 14, { sp: 1.2, up: 0.5, life: 0.55, s0: 0.05, col: FS_COL.pale, grav: -1 }); }
            else { fsFx(fsDeal('drawn'), 0.8, null); if (p) { const w = fsW(p.x, p.z); fsBurst(w.x, 0.9, w.z, 16, { sp: 1.6, up: 0.3, life: 0.6, s0: 0.11, col: FS_COL.gold, col2: 0xfff0c8, mix: 0.3, grav: 0.4 }); } }
            const n = Math.max(1, Math.min(9, 9 - e.left)); fsFx(FS_DEAL.note[n - 1], 0.7, null);
            if (FS5.pick === 'p' + e.id) FS5.pick = null;
            break; }
          case 'bag': { const p = st.prai[e.id - 1]; fsStreak(p, false); const pw = cast.pho ? cast.pho.group.position : null; fsFx('u5baginhale', 0.8, pw ? pw.x : null, pw ? pw.z : null);
            { const w = p ? fsW(p.x, p.z) : null; fsFx(fsDeal('drawn'), 0.8, w ? w.x : null, w ? w.z : null); } fsPhoAct('bag'); break; }
          case 'enter': { const p = st.prai[e.id - 1], w = p ? fsW(p.x, p.z) : null; if (w) fsFx(fsDeal('rise'), 0.8, w.x, w.z); break; }
          case 'state': fsState(e); break;
          case 'reach': { const p = st.prai[e.id - 1], w = p ? fsW(p.x, p.z) : null; fsFx(fsDeal('gather'), 0.8, w ? w.x : null, w ? w.z : null); break; }
          case 'rise': { const p = st.prai[e.id - 1], w = p ? fsW(p.x, p.z) : null; fsFx('u5unrise', 0.8, w ? w.x : null, w ? w.z : null); break; }
          case 'cageBreak': { const zw = cast.zav ? cast.zav.group.position : null; fsFx('u5cagecrack', 0.8, zw ? zw.x : null, zw ? zw.z : null); fsFx('u5stagger', 0.8, zw ? zw.x : null, zw ? zw.z : null);
            if (zw) fsBurst(zw.x, 1.1, zw.z, 26, { sp: 2.4, up: 0, life: 0.7, s0: 0.11, col: FS_COL.violet, col2: 0xffffff, mix: 0.2, grav: -3, drag: 1.5 }); break; }
          case 'cageWhole': fsFx('u5cagewhole', 0.8, null); break;
          case 'switch': fsFx(e.to === 'pho' ? 'u5swpho' : 'u5swzav', 0.8, null); break;
          case 'hold': fsFx('u5plant', 0.8, null); break;
          case 'stage': fsStage(e.to); break;
          case 'surge': fsFx('u5shape', 0.8, null); { const zw = cast.zav ? cast.zav.group.position : null; fsFx('u5cagecrack', 0.8, zw ? zw.x : null, zw ? zw.z : null); }
            FS5.m8 = fsFx('u5m8surge', 0.7, null); for (const V of fsVis) V.from = null; break;
          case 'together': fsFx('u5togfill', 0.8, null); break;
          case 'won': fsFx('u5done', 0.8, null); FS5.wonAt = FS5.wall; break;
          case 'lost': fsFx('u5broken', 0.8, null); FS5.lostAt = FS5.wall; break;
        }
      }
    }
    function fsState(e) {
      const st = FS5.st, p = st.prai[e.id - 1]; if (!p) return;
      const w = fsW(p.x, p.z);
      if (e.to === 'pressing') { fsFx(fsDeal('strain'), 0.8, w.x, w.z); fsFx(fsDeal('bars'), 0.8, w.x, w.z); }
      else if (e.to === 'hidden' && e.from !== 'waiting') fsFx('u5sink', 0.8, w.x, w.z);
      else if (e.to === 'shown') { fsFx('u5shown', 0.8, w.x, w.z); const Pf = fsPuffs.find(q => q.t < 0) || fsPuffs[0]; Pf.t = 0; Pf.x = w.x; Pf.z = w.z;
        const V = fsVis[e.id - 1]; if (V && V.y < -1) V.y = -1.0; }
      if (e.to === 'fleeing' || e.to === 'gathered' || e.to === 'drawn') { if (FS5.pick === 'p' + e.id) FS5.pick = null; }
    }
    function fsStreak(p, gold) {
      if (!p) return;
      const S = fsStreaks.find(q => q.on && q.id === p.id) || fsStreaks.find(q => !q.on) || fsStreaks[0];
      if (S.on && S.id === p.id && S.gold === gold) return;
      const w = fsW(p.x, p.z), V = fsVis[p.id - 1];
      S.on = true; S.id = p.id; S.t = 0; S.T = gold ? 0.9 : Math.max(0.6, FN5.bagSecs || 1); S.gold = gold;
      S.a.set(w.x, 0.9 * (V ? V.s : 1), w.z); fsHead(cast.pho, S.m, 1.55); S.c.set(RITE.bag.x, 0.35, RITE.bag.z);
    }
    function fsStage(to) {
      const st = FS5.st;
      if (to === 'surge') { if (kit && kit.tagSwitch && st.who !== 'pho') kit.tagSwitch('pho', { force: true });
        else if (kit && kit.tagState && kit.tagState().played !== 'pho') kit.tagSwitch('pho', { force: true }); }
      if (to === 'naga') fsNaga();
      if (to === 'lost') fsLost();
      if (to === 'fight' && FS5.retrying) { FS5.retrying = false; fsRestart(); }
    }

    /* ---------------------------------------------------------------- THE STAGES THE PART ITSELF CARRIES OUT */
    /* stage 5: the Naga's film, the one film inside the fight (it cannot be skipped until the chapter has been sealed once:
       the forty-first seam); the three it lays down are the three the surge drew together */
    function fsNaga() {
      const st = FS5.st, three = []; st.prai.forEach((p, i) => { if (p.st === 'shape') three.push(i); });
      if (typeof FILMS5 === 'object' && FILMS5.together) FILMS5.together.three = three.length === 3 ? three : null;
      FS5.film = true;
      /* M8 under the surge goes down as the film comes in (the film plays M9 over everything; the fight's loops go quiet by
         themselves under it, their frame stopped) */
      fsFade(FS5.m8, 0.4); FS5.m8 = null;
      const run = FS5.run, back = () => { if (run !== FS5.run || !FS5.st) return; FS5.film = false; fsStep({ act: 'FILMDONE' }, 0);
        /* the two stand where the film left them (where they stood when it began), whatever the rules reset them to; the
           three lie low and dim as its last picture laid them */
        const st2 = FS5.st, ts = kit.tagState();
        for (const b of ts.bodies) { const R2 = b.id === 'pho' ? st2.pho : st2.zav, l = fsL(b.x, b.z); R2.x = l.x; R2.z = l.z; FS5.last[b.id === 'pho' ? 'pho' : 'zav'] = l; }
        st2.prai.forEach((p, i) => { if (p.st === 'laid') { const V = fsVis[i]; V.y = 0; V.s = 0.55; V.lean = 0.55; V.a = 0.65; V.from = null; } });
        FS5.nagaDim = true; };
      const sealed = !!(ctx.sealedBefore && ctx.sealedBefore('e4c5'));
      if (!kit || !kit.film || !kit.film('together', { noSkip: !sealed, onDone: back })) back();
    }
    /* lost: his teacher's line (the rules said it), the card; BEGIN AGAIN begins the FIGHT again (Chad's R14), at stage 3 */
    function fsLost() {
      const st = FS5.st, W5 = fsWords(), run = FS5.run;
      FS5.losses = st.losses;
      if (kit && kit.chill) { kit.chill(0.55, { secs: 0.6, tint: 'sour' }); FS5.chillK = -1; }
      const card = () => {
        if (run !== FS5.run || !FS5.st || FS5.st.stage !== 'lost') return;
        const ok = kit && kit.retry && kit.retry({ title: W5.lostSay, line: '', button: W5.lostAgain, more: st.losses >= 3 ? W5.lostLead : null,
          onPress: (r) => { if (run !== FS5.run || !FS5.st) return; FS5.retrying = true; fsStep({ act: r && r.button === 'more' ? 'LEAD' : 'RETRY' }, 0); } });
        if (!ok) { FS5.retrying = true; fsStep({ act: 'RETRY' }, 0); }
      };
      FS5.cardAt = FS5.wall + 1.1; FS5.card = card;           // (a moment of the court going dark before the card)
    }
    /* begun again: the bodies at their places, the eight new, every effect and loop put back as the fight begins */
    function fsRestart() {
      const F = fightStart();
      if (kit && kit.tagState && kit.tagState().played !== 'pho') kit.tagSwitch('pho', { force: true });
      kit.tagPlace('pho', F.pho.x, F.pho.z, { ry: COURT5.heading + Math.PI }); kit.tagPlace('zavier', F.zav.x, F.zav.z, { ry: COURT5.heading + Math.PI });
      FS5.last.pho = null; FS5.last.zav = null; FS5.pick = null; FS5.act = null;
      fsFxClear(); for (let i = 1; i < 9; i++) { const V = fsVis[i]; V.y = FS_SUNK; V.a = 0; V.s = 1; V.lean = 0; V.from = null; }
      if (kit && kit.chill) { kit.chill(0, { secs: 0.8 }); FS5.chillK = -1; }
      kit.tagBody('pho', { face: null, root: false }); kit.tagBody('zavier', { face: null, root: false });
      fsStand(cast.pho, 'pho'); fsStand(cast.zav, 'zav');
    }
    function fsFxClear() {
      for (const B of fsBalls) B.on = false; for (const L of fsBlooms) L.on = false; for (const S of fsStreaks) S.on = false;
      fsRipple.t = -1; for (const Pf of fsPuffs) Pf.t = -1; FS5.flare = 0; FS5.flared = false; fsPtsClear();
      for (const P of fsSmokes) P.t = -1; for (const F of fsFlares) F.t = -1; for (const S of fsScorches) S.t = -1;
      for (const o of FSG.children) o.visible = false;
    }

    /* ---------------------------------------------------------------- ONE STEP OF THE FIGHT, from the part */
    function fsStep(input, dt) {
      const st = FS5.st; if (!st) return [];
      const inp = Object.assign({}, input || {});
      if (kit && kit.stat) { const s = kit.stat('sanity'); if (s != null) inp.sanity = s; }
      const ev = FIGHT.step(st, inp, dt, { rand: FS5.rand, secs: (k) => SECS[k] }).slice();
      fsEvents(ev);
      /* the surge's own press of his sanity toward its floor (the rules move theirs without an event): paid as the fight's */
      if (st.stage === 'surge' && kit && kit.stat && kit.award) { const s = kit.stat('sanity'); if (st.sanity < s - 0.01) kit.award('sanity', st.sanity - s, { minigame: true }); }
      return ev;
    }

    /* ---------------------------------------------------------------- THE FIGHT'S FRAME (c_story.js storyTick, in play) */
    function fightTick(wdt) {
      if (!FS5.on || !FS5.st || !kit || !kit.tagState) return;
      FS5.wall += wdt;
      const st = FS5.st, ts = kit.tagState();
      if (FS5.labPose && cast.pho && cast.pho.ready) pose(cast.pho, FS5.labPose.name, FS5.labPose.t);   // (a probe's: lab.pose)
      if (!ts.on) return;
      /* the card after a loss waits a moment of the court going dark */
      if (FS5.card && FS5.wall >= FS5.cardAt) { const c = FS5.card; FS5.card = null; c(); }
      if (FS5.wonAt >= 0) { fsWonTick(); }
      FS5.live = ts.live;
      const dt = Math.max(0, Math.min(0.1, ts.t - FS5.lastT)); FS5.lastT = ts.t;
      const phoB = ts.bodies.find(b => b.id === 'pho'), zavB = ts.bodies.find(b => b.id === 'zavier');
      const played = ts.played === 'zavier' ? 'zavier' : 'pho';
      /* 1. the walk the engine made, handed to the rules from where they last had him */
      let mx = 0, mz = 0;
      const P = played === 'pho' ? phoB : zavB, key = played === 'pho' ? 'pho' : 'zav', R = played === 'pho' ? st.pho : st.zav;
      if (P && st.stage !== 'brief' && st.stage !== 'lost' && st.stage !== 'won') {
        const now = fsL(P.x, P.z), was = FS5.last[key] || now, sp = played === 'pho' ? (FN5.phoWalk || 1.2) : (FN5.zavWalk || 0.6);
        const dx = now.x - was.x, dz = now.z - was.z, m = dt > 0 ? Math.hypot(dx, dz) / (sp * dt) : 0;
        R.x = was.x; R.z = was.z;
        if (dt > 0 && m > 0.06) { mx = dx / (sp * dt); mz = dz / (sp * dt); const mm = Math.hypot(mx, mz); if (mm > 1) { mx /= mm; mz /= mm; } }
        else { R.x = now.x; R.z = now.z; }
      }
      /* 2. this frame's one press */
      const q = FS5.q; FS5.q = null;
      const input = { mx, mz };
      if (q) {
        if (q.act) input.act = q.act; if (q.slot) input.slot = q.slot;
        const pk = FS5.pick;
        if (pk && q.slot && q.slot !== 'swap' && q.slot !== 'together') { if (pk[0] === 'p') input.pick = +pk.slice(1); else input.pickCloud = +pk.slice(1); FS5.pick = null; }
      } else if (FS5.swNeed) { input.act = 'SWITCH'; FS5.swNeed = false; }
      /* 3. the step */
      if (st.stage !== 'brief' && st.stage !== 'lost' && st.stage !== 'won' && st.stage !== 'naga') { fsStep(input, dt);
        /* (A PROBE'S SPEED, inert unless a probe sets it (lab.speed): on a box that draws a frame in seconds the rules are
           stepped k times a frame, each step the mode's own, the press only in the first; real play never sets it) */
        for (let i = 1; i < (FS5.probeK || 1) && FS5.st === st && (st.stage === 'learn' || st.stage === 'fight' || st.stage === 'surge' || st.stage === 'last'); i++) fsStep({ mx, mz }, dt); }
      /* (the rules and the engine must agree on who is played: a switch the engine made inside the rules' last instant of
         lock is told to the rules again on the next frame) */
      if (st.stage === 'learn' || st.stage === 'fight') { const rw = st.who === 'pho' ? 'pho' : 'zavier'; if (rw !== played && !FS5.swNeed) FS5.swNeed = true; }
      /* 3b. THE ONE NOT PLAYED KEEPS OUT OF THE LENS'S LINE (the lead's word on R25, measured on the after-pictures: with
         Master Zavier played, Grandmaster Pho stood between the lens and him and filled a third of a phone's screen; never
         a fade, which reads as R25's "disappearing and reappearing characters"). The lens stands 4.0 m behind the played one
         down the court (the boom; the court's frame, the lens's box at most 5.2) and 3.1 m up: whoever stands in that strip
         (his disc and the played one's half against the line, 0.3 m to spare) steps aside to the nearer side at his walk,
         inside the court and never inside the other's cage ring, and holds his place there; nothing while he gathers the
         gold or draws the bag, nor under the brief, a loss or the win */
      fsLensClear(dt);
      /* 4. where the rules stopped him, he stops: the played one set back to the rules' place; the other moved by the rules */
      const playedNow = kit.tagState().played === 'zavier' ? 'zavier' : 'pho';
      for (const who of ['pho', 'zavier']) {
        const B = who === 'pho' ? phoB : zavB, R2 = who === 'pho' ? st.pho : st.zav, k2 = who === 'pho' ? 'pho' : 'zav'; if (!B) continue;
        const w = fsW(R2.x, R2.z), off = Math.hypot(w.x - B.x, w.z - B.z);
        /* (the played one kept in by the rules keeps walking along what kept him (R25): only the push into it is lost) */
        if (who === playedNow) { if (off > 0.012 && st.stage !== 'brief') kit.tagPlace(who, w.x, w.z, { keep: true }); }
        else { if (off > 0.004) kit.tagPlace(who, w.x, w.z); if (who === 'pho') FS5.aiPace.pho = dt > 0 ? off / dt : 0; }
        /* (the ground each really covered this frame, where the rules have him: what his walk's rate follows. The engine's
           own reading counts a push the rules then took back, and his legs walked on the spot against the court's edge) */
        const L0 = FS5.last[k2]; FS5.cov[k2] = L0 && dt > 0 ? Math.hypot(R2.x - L0.x, R2.z - L0.z) / dt : 0;
        FS5.last[k2] = { x: R2.x, z: R2.z };
      }
      /* (a held act let go when the rules let it go, whatever ended it: the gold out or broken, the bag's draw done or
         stopped; it never holds him past its rules) */
      if (FS5.act && !FS5.act.down && FS5.wall - FS5.act.at > 0.3) {
        if (FS5.act.kind === 'wave' && !(st.pho.wind > 0)) fsPhoRelease('wave');
        else if (FS5.act.kind === 'bag' && !(st.pho.draw > 0)) fsPhoRelease('bag'); }
      /* (his teacher stands still while the gold gathers and while the bag draws: the rules' own; and for his swing) */
      const still = !(st.stage === 'learn' || st.stage === 'fight' || st.stage === 'last');
      kit.tagBody('pho', { root: still || st.pho.wind > 0 || st.pho.draw > 0 || (!!FS5.act && FS5.act.kind === 'phoFire' && fsActing()) });
      kit.tagBody('zavier', { root: still });
      fsFaces(wdt, playedNow);
      /* 5. the screen and the court */
      fsHud();
      fsLookFrame(wdt, playedNow, phoB, zavB);
      fsSoundFrame(wdt, playedNow);
    }
    function fsLensClear(dt) {
      const st = FS5.st; if (!st || !(dt > 0) || !(st.stage === 'learn' || st.stage === 'fight' || st.stage === 'last')) return;
      const n = st.n || FN5, played = st.who === 'pho' ? st.pho : st.zav, other = st.who === 'pho' ? st.zav : st.pho, otherIsPho = st.who !== 'pho';
      if (otherIsPho && (st.pho.wind > 0 || st.pho.draw > 0)) return;
      const lensZ = Math.min(played.z + 4.0, 5.2), half = 0.45 + 0.25 + 0.3;
      if (!(other.z > played.z - 0.2 && other.z < lensZ)) return;                    // (not between the lens and him)
      const dx = other.x - played.x; if (Math.abs(dx) >= half) return;
      const bx = n.bodyX || 1.6, room = (sg) => sg > 0 ? bx - (played.x + half) : (played.x - half) + bx;
      let sg = dx !== 0 ? Math.sign(dx) : (played.x <= 0 ? 1 : -1);
      if (room(sg) < 0.05 && room(-sg) > room(sg)) sg = -sg;                        // (the near side is the court's wall: the other)
      const want = played.x + sg * (half + 0.05), sp = otherIsPho ? (n.phoWalk || 1.2) : (n.zavWalk || 0.6);
      const nx = other.x + Math.sign(want - other.x) * Math.min(Math.abs(want - other.x), sp * dt), cx = Math.max(-bx, Math.min(bx, nx));
      if (Math.hypot(cx - played.x, other.z - played.z) < (n.apart || 1.45) - 1e-6) return;   // (never into the cage's ring)
      other.x = cx;
    }
    /* who faces where: the one played turns to his walk (the engine), and to what he acts on for a moment; the one not
       played faces what comes for his student (his teacher), or what has hidden from him (his head) */
    function fsFaces(wdt, played) {
      const st = FS5.st;
      for (const who of ['pho', 'zavier']) {
        const R = who === 'pho' ? st.pho : st.zav, B = who === 'pho' ? cast.pho : cast.zav; if (!B) continue;
        FS5.faceT[who] = Math.max(0, FS5.faceT[who] - wdt);
        let tgt = FS5.faceT[who] > 0 ? FS5.faceTo[who] : null;
        if (!tgt && who !== played) {
          if (who === 'pho') { let best = null, bd = 1e9; for (const p of st.prai) if (p.st === 'coming' || p.st === 'pressing' || p.st === 'through' || p.st === 'shown') { const d = Math.hypot(p.x - st.zav.x, p.z - st.zav.z); if (d < bd) { bd = d; best = p; } }
            tgt = best || { x: st.zav.x, z: st.zav.z - 2 }; }
          else { let best = null, bd = 1e9; for (const p of st.prai) if (p.st === 'pressing' || p.st === 'through' || p.st === 'coming') { const d = Math.hypot(p.x - st.zav.x, p.z - st.zav.z); if (d < bd) { bd = d; best = p; } }
            tgt = best || { x: st.zav.x, z: st.zav.z - 3 }; }
        }
        if (tgt) { const a = fsW(R.x, R.z), b = fsW(tgt.x, tgt.z); kit.tagBody(who, { face: faceTo(a.x, a.z, b.x, b.z) }); }
        else kit.tagBody(who, { face: null });
      }
      /* his head toward a Prai that has hidden (the rules' own look, z.look) */
      const zv = cast.zav; if (zv && zv.ready) { const p = st.zav.look ? st.prai[st.zav.look - 1] : null;
        if (p) { const w = fsW(p.x, p.z); gaze(zv, [w.x, 0.3, w.z], { secs: 0.6, reach: 0.6, down: 0 }); } else if (zv.gaze) gaze(zv, null, { secs: 0.6 }); }
    }
    /* THE COURT'S PICTURE: the two of them (their takes by the ground each covers), the cage where it stands, the trance's
       pools and the gold at his shoulders, the nine, the effects, the souring of the picture when he is reached */
    function fsLookFrame(wdt, played, phoB, zavB) {
      const st = FS5.st, ft = st.t;
      fsBodyTake(cast.pho, 'pho', FS5.cov.pho || 0, wdt);
      fsBodyTake(cast.zav, 'zav', FS5.cov.zav || 0, wdt);                       // (unplayed too: he walks when he steps out of the lens's line)
      fsSteps();
      const zw = cast.zav ? cast.zav.group.position : null, pw = cast.pho ? cast.pho.group.position : null;
      /* the cage: round him, or round his teacher while it is lent; its strength its brightness; cracked when broken or in the surge */
      const c = st.cage, at = c.lent > 0 ? pw : zw;
      /* (lent, it lifts off him and closes round his teacher: it travels there, 0.4 s, and back) */
      if (at) { const C0 = FS5.cageAt || (FS5.cageAt = { x: at.x, z: at.z }), q = 1 - Math.exp(-wdt / 0.12);
        C0.x += (at.x - C0.x) * q; C0.z += (at.z - C0.z) * q;
        /* (R25: its bars TURN ROUND HIM, a turn in 2.2 s, each with its wake: "to make it look more defensive"; broken, they
           drag round at a fifth of that) */
        CAGE5.set({ k: c.broken ? 0.12 : Math.max(0.12, c.str / (FN5.cageMax || 100)), x: C0.x, z: C0.z, t: FS5.wall, crack: c.broken || st.stage === 'surge', spin: c.broken ? 0.55 : 2.85 }); }
      TRANCE5.set(1, FS5.wall); TRANCE5.pools(c.lent > 0 ? null : zw, pw, 1, 1);
      const wind = st.pho.wind > 0 ? 1 - st.pho.wind / (FN5.windSecs || 1.5) : 0;
      TRANCE5.gold(0.35 + 0.65 * wind);                   // (the fight's lens is behind him: the card lies over his back, so a glow, full only as the gold gathers)
      if (FS5.flare > 0) courtLamps(0.15 + 0.85 * FS5.flare);
      /* the Naga lies round the court through the last three, dimmed (its body laid once by its film; its light only here) */
      if (st.stage === 'last' && NAGA5.U) { NAGA5.U.uNA.value = 0.3 + 0.04 * Math.sin(FS5.wall * 1.3); NAGA5.U.uNT.value = FS5.wall; }
      PRAI5.tick(wdt);
      if (st.stage === 'surge') fsSurgeFrame(wdt); else if (st.stage !== 'brief') fsPraiFrame(wdt);   // (under the brief the nine stand as the film left them)
      fsFxFrame(wdt, ft);
      FSG.visible = true;
      /* the reach line: him to the one the bag will take, while its button shows */
      const H3 = st.who === 'pho' && (st.stage === 'fight' || st.stage === 'last' || st.stage === 'learn') ? FIGHT.hud(st).third : null;
      const nd = st.cur;
      let tgt = null;
      if (H3 && H3.shown && nd && nd.act === 'BAG' && nd.target) tgt = st.prai[nd.target - 1];
      if (!tgt && H3 && H3.shown) { let bd = 1e9; for (const p of st.prai) if ((p.st === 'tired' || p.st === 'held' || p.st === 'laid') && Math.hypot(p.x - st.pho.x, p.z - st.pho.z) <= (FN5.bagReach || 2.5)) { const d = Math.hypot(p.x - st.pho.x, p.z - st.pho.z); if (d < bd) { bd = d; tgt = p; } } }
      if (tgt && pw) { const w = fsW(tgt.x, tgt.z), dx = w.x - pw.x, dz = w.z - pw.z, L = Math.hypot(dx, dz);
        fsReach.visible = L > 0.3; fsReach.position.set((w.x + pw.x) / 2, 0.019, (w.z + pw.z) / 2); fsReach.rotation.y = Math.atan2(dx, dz); fsReach.scale.set(0.04, 1, L); fsReach.material.opacity = 0.5; }
      else fsReach.visible = false;
      /* reached: the picture's edges sour (the engine's red edge is held off in the mode) */
      let n = 0; for (const p of st.prai) if (p.st === 'through' || p.st === 'beneath' || (p.st === 'shown' && p.at === 2)) n++;
      FS5.reached = n;
      FS5.chillHold = Math.max(0, (FS5.chillHold || 0) - wdt);
      const ck = st.stage === 'lost' ? 0.55 : st.stage === 'surge' ? 0.5 : c.lent > 0 ? 0.32 : Math.min(0.5, n * 0.2);
      const cq = Math.round(ck * 20) / 20;
      if (cq !== FS5.chillK && !(FS5.chillHold > 0)) { FS5.chillK = cq; if (kit && kit.chill) kit.chill(cq, { secs: 0.5, tint: c.lent > 0 && !n ? 'grey' : 'sour' }); }
    }
    /* THE FIGHT'S LOOPS, aimed each frame: the cage, the murmur, each Prai's voice where it is, each bubble's note, the
       shape, M7's stems (the one played leads: the manifest's levels), M10 for the last three */
    const FS_M7 = 1;                                                        // (M7 at the manifest's own gains, each stem's note: the sound helper's measured mix)
    FS5.aiPace = { pho: 0 }; FS5.cov = { pho: 0, zav: 0 };
    function fsSoundFrame(wdt, played) {
      /* (under the brief the mode is not live, but the court is his: the cage's hum and his murmur go on from the film's) */
      const st = FS5.st, c = st.cage, str = c.broken ? 0 : c.str / (FN5.cageMax || 100), live = (FS5.live || FS5.brief) && st.stage !== 'lost';
      const fighting = st.stage === 'learn' || st.stage === 'fight', zw = cast.zav ? cast.zav.group.position : null;
      fsLoop('cagehum', 'u5cagehum', live && st.stage !== 'won' ? 0.4 * str : 0, { tau: 0.2 });
      fsLoop('cagethin', 'u5cagethin', live && fighting ? (1 - str) * 0.45 : 0, { tau: 0.2 });
      fsLoop('murmur', 'u5murmur3', live && st.stage !== 'won' ? (c.lent > 0 ? 0.15 : 0.45) : 0, { tau: 0.3 });
      st.prai.forEach((p, i) => { const s = p.st, V = fsVis[i], w = fsW(p.x, p.z);
        const on = live && (s === 'entering' || s === 'coming' || s === 'pressing' || s === 'through' || s === 'shown' || s === 'rushing' || s === 'bound' || s === 'held');
        fsLoop('n' + p.id, FS_VOICE[p.kind] || 'u5ncome', on ? 0.4 * Math.min(1, (V ? V.a : 1) + 0.2) : 0, { pan: true, x: w.x, z: w.z, tau: 0.2 }); });
      const bound = st.prai.filter(p => p.st === 'bound' || p.st === 'held');
      for (let j = 0; j < 3; j++) { const p = bound[j], w = p ? fsW(p.x, p.z) : null; fsLoop('bub' + j, 'u5bindhold', live && p ? 0.35 : 0, { pan: true, x: w ? w.x : 0, z: w ? w.z : 0, tau: 0.15 }); }
      fsLoop('shape', 'u5shapeloop', live && st.stage === 'surge' ? 0.5 : 0, { tau: 0.3 });
      /* M7: the floor always; the teacher's two up while he is played, the student's while he is; a hold a step down */
      if (fighting && live) fsStemsStart();
      const P = played === 'pho', hold = st.stage === 'fight' && st.hold > 0, m = fighting && live ? FS_M7 : 0;
      const lv = [0.85, hold ? 0.5 : (P ? 1.0 : 0.3), hold ? 0.5 : (P ? 1.0 : 0.3), P ? 0.3 : 1.0, hold ? 0.8 : (P ? 0.2 : 0.8)];
      for (let i = 0; i < 5; i++) { const L = fsLoops.get('stem' + i); if (L) { L.want = m * lv[i]; L.seen = true; } }
      fsLoop('m10', 'u5m10last', live && st.stage === 'last' ? 0.55 : (st.stage === 'won' && FS5.wall - FS5.wonAt < 1.0 ? 0.55 * (1 - (FS5.wall - FS5.wonAt)) : 0), { tau: 0.4 });
      fsLoopsTick();
    }

    /* ---------------------------------------------------------------- WON: the court a moment, then the bag tied */
    function fsWonTick() {
      if (FS5.done) return;
      const busy = FS5.lastLine && FS5.wall - FS5.wonAt < (SECS[FS5.lastLine] || 2.5) + 0.5;
      if (FS5.wall - FS5.wonAt < 2.8 || (busy && FS5.wall - FS5.wonAt < 6)) return;
      FS5.done = true;
      cleanse();                                                // (c_story.js: the mode left, the bag tied, the next afternoon)
    }
    /* the mode left for good, the court as the bag tied film finds it */
    function fightLeave() {
      fsLoopsStop(); fsFxClear(); FSG.visible = false;
      if (kit && kit.tag && kit.tag().on) kit.tag(null, 'restore');
      if (kit && kit.chill) kit.chill(0, { secs: 0.4 });
      if (kit && kit.objective) kit.objective(null, { complete: false });
      if (cast.zav) cast.zav.force = null;
      if (kit && kit.captions) kit.captions(null);
      NAGA5.set(0, 0, 0, 0, 0);
      for (const P of PRAI5.list) { P.group.rotation.x = 0; P.group.rotation.order = 'XYZ'; P.group.scale.setScalar(1); }
      FS5.live = false; FS5.mode = false; FS5.on = false;
    }
    /* A PROBE'S LAB (tools/probes/e4c5look.mjs): one of the fight's moments set out by the fight's own effects and HELD, so
       each is photographed full size from the fight's camera on a phone (the play-through photographs them as they come).
       The brief is taken down and not put back (the rules stand at their brief: nothing steps); each moment is begun as
       its event begins it, run on its own frame in thirtieths of a second to the moment asked for, then held (labHold:
       the effects' clock stands). Only a probe calls it, through stage.snap().story.fight.lab */
    const FS_LAB = {
      open() { if (!FS5.st) return false; FS5.lab = true; if (FS5.brief && kit && kit.abortEvent) kit.abortEvent(); return true; },
      speed(k) { FS5.probeK = Math.max(1, Math.min(20, Math.round(+k || 1))); return FS5.probeK; },
      /* his body held in one of his takes at one moment (the chapter's own pose: every law of his, his feet's curve), laid
         on every frame until it is let go (null), so a probe photographs and measures it whatever else runs */
      pose(name, t) { FS5.labPose = name && cast.pho && cast.pho.acts[name] ? { name, t: +t || 0 } : null; return !!FS5.labPose || !name; },
      ground() { const P = cast.pho; return P && P.groundRep ? JSON.parse(JSON.stringify(P.groundRep)) : null; },
      groundOn() { FS5.groundOn = true; fsGroundActs(cast.pho); return this.ground(); },
      /* (a probe's walk measured from a clear start: one of the two set down at a place of the court in the rules' own frame,
         the rules and the engine both, standing still; and the switch shown, as the lesson shows it once it needs it) */
      place(who, x, z) { const st = FS5.st; if (!st) return false; const R = who === 'pho' ? st.pho : st.zav, k = who === 'pho' ? 'pho' : 'zav';
        R.x = +x; R.z = +z; FS5.last[k] = { x: R.x, z: R.z }; const w = fsW(R.x, R.z); return kit.tagPlace(who === 'pho' ? 'pho' : 'zavier', w.x, w.z); },
      swapOn() { const st = FS5.st; if (!st) return false; st.seen.swap = true; return true; },
      /* (his closed hand on the stick: the grip's solve, each joint's turn in degrees, and how far it is closed) */
      grip() { return typeof PHOGRIP5 === 'object' ? { report: PHOGRIP5.report(), k: PHOGRIP5.k() } : null; },
      gripOn() { return typeof PHOGRIP5 === 'object' ? PHOGRIP5.on() : false; },
      gripTune(o) { return typeof PHOGRIP5 === 'object' ? PHOGRIP5.tune(o) : null; },
      gait() { const out = {}; for (const [who, P] of [['pho', cast.pho], ['zav', cast.zav]]) { if (!P || !P.ready) continue; const T = fsTake[who];
        out[who] = { gait: T.gait, walking: T.walking, pace: +(T.pace || 0).toFixed(3), cur: P.cur, own: P.pace ? Object.fromEntries(Object.entries(P.pace).map(([k, v]) => [k, +v.toFixed(3)])) : null,
          w: Object.fromEntries(Object.keys(P.acts).filter(k => (P.w[k] || 0) > 0.005).map(k => [k, +P.w[k].toFixed(2)])),
          ts: Object.fromEntries(['Walking', 'Running'].filter(k => P.acts[k]).map(k => [k, +P.acts[k].timeScale.toFixed(3)])) }; }
        return out; },
      clear() { const st = FS5.st; FS5.labHold = false; fsFxClear(); if (!st) return;
        st.pho.wind = 0; st.pho.ring = null; for (const p of st.prai) if (p.labWas) { p.st = p.labWas; p.labWas = null; } },
      moment(name, secs = 0.3) {
        const st = FS5.st; if (!st) return false; this.clear();
        const L = st.prai[0], w = fsW(L.x, L.z);
        if (name === 'labBall') fsBallStart({ x: L.x, z: L.z, id: L.id }, 0);
        else if (name === 'labLand') fsEvents([{ e: 'land', result: 'chased', id: L.id, x: L.x, z: L.z }]);
        else if (name === 'labTired') { L.labWas = L.st; L.st = 'bound'; L.bub = FN5.bubbleSecs || 10; fsFxFrame(1 / 30, st.t || 0);   // (its bubble first, then the fire on it)
          fsEvents([{ e: 'land', result: 'tired', id: L.id, x: L.x, z: L.z }]); }
        else if (name === 'labBind') { L.labWas = L.st; L.st = 'bound'; L.bub = FN5.bubbleSecs || 10; fsEvents([{ e: 'bind', id: L.id }]); }
        else if (name === 'labGather') st.pho.wind = (FN5.windSecs || 1.5) * 0.35;
        else if (name === 'labWheel') { st.pho.ring = { x: st.pho.x, z: st.pho.z, r: 2.4 }; fsEvents([{ e: 'wave' }]); }
        else if (name === 'labStreak') fsStreak(L, false);
        else return false;
        void w;
        for (let t = 0; t < secs; t += 1 / 30) fsFxFrame(1 / 30, (st.t || 0) + t);
        FS5.labHold = true; return true;
      }
    };
    /* what a probe and the walk test read (stage.snap().story.fight) */
    function fightSnap() {
      const st = FS5.st, left = { fxOn: FSG.visible, fx: FSG.children.reduce((n, o) => n + (o.visible ? 1 : 0), 0), loops: fsLoops.size, stems: FS5.stemsOn,
                                  praiShown: PRAI5.list.reduce((n, P) => n + (P.group.visible ? 1 : 0), 0) };
      if (!st) return Object.assign({ on: FS5.on, lab: FS_LAB }, left);
      const H = FIGHT.hud(st);
      return { on: FS5.on, mode: FS5.mode, brief: FS5.brief, stage: st.stage, who: st.who, left: st.left, losses: st.losses, sanity: +st.sanity.toFixed(2),
               t: +st.t.toFixed(2), need: st.cur ? { id: st.cur.id, act: st.cur.act, target: st.cur.target, ready: st.cur.ready, move: st.cur.move } : null,
               hud: { main: H.main, second: H.second, third: H.third, swap: H.swap, together: H.together, objective: H.objective, cage: H.cage },
               pho: { x: +st.pho.x.toFixed(3), z: +st.pho.z.toFixed(3) }, zav: { x: +st.zav.x.toFixed(3), z: +st.zav.z.toFixed(3) },
               prai: st.prai.map(p => ({ id: p.id, kind: p.kind, st: p.st, x: +p.x.toFixed(2), z: +p.z.toFixed(2) })), pick: FS5.pick,
               stats: Object.assign({}, st.stats), lines: FS5.heard.slice(-12), act: FS5.act ? FS5.act.kind : null, phoTake: cast.pho ? cast.pho.cur : null, lab: FS_LAB, ...left };
    }
    function fightReset() {
      FS5.run++;
      if (FS5.brief && kit && kit.abortEvent) kit.abortEvent();           // (the brief's own answer then finds a new run, and does nothing)
      if (FS5.on) fightLeave();
      fsLoopsStop(); fsFxClear(); FSG.visible = false;
      Object.assign(FS5, { on: false, st: null, mode: false, brief: false, live: false, lastT: 0, q: null, pick: null, wall: 0, wonAt: -1, done: false,
        hudSig: '', obj: null, objKey: '', film: false, losses: 0, rand: null, flare: 0, flared: false, drainSnd: 0, reached: 0, chillK: -1, chillHold: 0,
        swNeed: false, stemsOn: false, lastLine: '', card: null, cardAt: 0, lostAt: 0, retrying: false, cageAt: null, m8: null, act: null, actN: 0, waits: {}, lab: false, labHold: false, labPose: null, probeK: FS5.probeK || 1, groundOn: !!FS5.groundOn });
      FS5.heard.length = 0; FS5.last.pho = null; FS5.last.zav = null; FS5.faceT.pho = FS5.faceT.zavier = 0; FS5.aiPace.pho = 0; FS5.cov.pho = FS5.cov.zav = 0;
      fsTake.pho.stepU = fsTake.zav.stepU = null;
      for (const k in fsDealN) delete fsDealN[k];
      fsPraiReset(false);
    }
    /* the engine tells the part each press (one a frame): queued for the frame's step */
    function fsOnAct(r) {
      if (!FS5.st || !r) return;
      if (r.act === 'target') { FS5.pick = r.id; return; }
      if (r.act === 'switch') { FS5.q = { act: 'SWITCH' }; return; }
      if (r.phase !== 'down') return;
      FS5.q = { slot: FS5.st.stage === 'surge' ? 'together' : FS_SLOT[r.act] };
    }
    /* THE FIGHT SET OUT, and the mode opened behind the brief: the court as the preparation's turn leaves it (the two of
       them at the fight's places, his cage, the trance, the nine at the far end facing him, the household behind the thread),
       whichever way he came (the film, or a Continue landing at the brief) */
    function fightOpen() {
      const F = fightStart(), W5 = fsWords();
      fightReset(); FS5.on = true; FS5.st = FIGHT.create({ sanity: kit && kit.stat ? kit.stat('sanity') : 100 }); FS5.rand = rng(0x2858); FS5.srand = rng(0x2859);
      if (warmSounds) warmSounds(FS_WARM.concat(FIGHT.LINES));
      /* the court */
      if (kit && kit.daylight && PRESETS.TRANCE) kit.daylight(PRESETS.TRANCE, 0);
      THREAD5.set(true, [DOOR_FRONT.x0 + 0.05, 0.52, HOUSE.face - 0.12], [STATION.fight.jun.x - 0.18, 0.86, STATION.fight.jun.z - 0.25]);
      setDown('bagOpen', RITE.bag, 0.3); setDown('threadReel', RITE.reel);
      if (things.staffCloth && typeof PR5AT !== 'undefined') { things.staffCloth.visible = true; things.staffCloth.position.set(PR5AT.tonU[0] + 0.32, 0.01, PR5AT.tonU[1] + 0.18); things.staffCloth.rotation.set(0, 0.6, 0); }
      for (const n of ['ton', 'jun', 'koh']) { const P = cast[n], s0 = STATION.fight[n]; if (!P || !s0) continue; P.hidden = false; put(P, s0.x, s0.z, s0.ry); if (P.ready) P.group.visible = true; rest(P, 0); }
      /* the two of them */
      const pho = cast.pho, zav = cast.zav;
      if (pho) { pho.hidden = false; put(pho, F.pho.x, F.pho.z, COURT5.heading + Math.PI); if (pho.ready) pho.group.visible = true; }
      if (zav) { zav.hidden = false; put(zav, F.zav.x, F.zav.z, COURT5.heading + Math.PI); if (zav.ready) zav.group.visible = true; zav.force = 1; }
      fsStand(pho, 'pho'); fsStand(zav, 'zav');
      if (typeof STICK5 === 'object') STICK5.to('pho');
      CAGE5.set({ k: 1, x: F.zav.x, z: F.zav.z, t: 0 }); TRANCE5.set(1, 0); TRANCE5.pools(F.zav, F.pho, 1, 1); TRANCE5.gold(1);
      fsNineStand(); fsPraiReset(true);
      /* the mode, behind and above Grandmaster Pho; the first person put where a Continue lands (the held save's place) */
      yaw.position.set(STATION.fight.at.x, EYE, STATION.fight.at.z); yaw.rotation.y = STATION.fight.at.ry; pitch.rotation.x = -0.04;
      const ok = !!(kit && kit.tag && pho && zav && kit.tag({
        bodies: [
          { id: 'pho', obj: pho.group, name: W5.btnPho, speed: FN5.phoWalk || 1.2, radius: 0.45, acts: [
            { id: 'flame', slot: 'main', label: W5.btnFire, icon: FS_ICON.flame, key: 'Space' },
            { id: 'shock', slot: 'second', label: W5.btnShockwave, icon: FS_ICON.shock, key: 'KeyQ' },
            { id: 'bag', slot: 'third', label: W5.btnBag, icon: FS_ICON.bag, key: 'KeyE' }] },
          { id: 'zavier', obj: zav.group, name: W5.btnZavier, speed: FN5.zavWalk || 0.6, radius: (FN5.apart || 1.45) - 0.45, acts: [
            { id: 'bind', slot: 'main', label: W5.btnBind, icon: FS_ICON.bind, key: 'Space' },
            { id: 'smell', slot: 'second', label: W5.btnSmell, icon: FS_ICON.smell, key: 'KeyQ' },
            { id: 'lend', slot: 'third', label: W5.btnLend, icon: FS_ICON.lend, key: 'KeyE' }] }
        ],
        played: 'pho', targets: fsMarks, onAct: fsOnAct }));
      FS5.mode = ok; FS5.fallback = !ok;
      /* (the run is held with him in first person, where a Continue lands; the mode's opening puts the lens on the boom
         behind his teacher at once (tagOpen's own rig), so the brief stands over the picture START keeps. A second boom
         laid on here doubled it: the lens 3 m behind the court's gate, measured, and taken back out) */
      if (ok) { FS5.lastT = kit.tagState().t; fsHud(); kit.tagCount(9, 9); }
      return ok;
    }
    /* THE BRIEF (v8.7, v18.2: instructions first, the mode's own picture under its title, START): nothing moves until START */
    function fightBrief() {
      const W5 = fsWords(), run = FS5.run;
      FS5.brief = true;
      if (kit && kit.objective) kit.objective(null, { complete: false });
      const brief = [W5.fightBrief1, W5.fightBrief2, W5.fightBrief3, TOUCHY ? W5.fightInTouch : W5.fightInKey].filter(Boolean).join(' ');
      kit.event({ kind: 'guard', label: W5.fightTitle, demo: 'tag', brief }).then((r) => {
        if (run !== FS5.run || !FS5.st) return;
        FS5.brief = false;
        if (!r || r.aborted) { if (FS5.lab) return; if (FS5.st.stage === 'brief' && getState() === 'play') fightBrief(); return; }
        fightStart5();
      });
    }
    /* START: the lesson's Prai rises in the middle of the court; the other eight sink back into the paving to wait their turn */
    function fightStart5() {
      const st = FS5.st; if (!st || st.stage !== 'brief') return;
      fsFx('u5start', 0.8, null);
      fsStep({ act: 'START' }, 0);
      for (let i = 1; i < 9; i++) { const V = fsVis[i]; V.y = 0; V.a = 1; }        // (they sink from where they stood)
      if (kit && kit.tagHold) kit.tagHold();                                     // (a loss begins again from here: his sanity as he opened the fight)
      fsHud();
    }

    /* ---------------------------------------------------------------- THE NAGA STICK IN HIS CLOSED HAND (R25, Chad: "the way
       the naga stick is attached to pho is very unnatural and wrongly attached, improve it so it looks like he is actually
       holding it"; R26, his pick: "Finger bones (Recommended)"). His file has no finger bones; this chapter's copy of it
       (p5pho, tools/fingergraft.mjs: fifteen of the library's, and their ends, grafted onto his right hand from its own
       geometry, masters/v28.0/pho5) has, and at rest draws exactly as his. Here his hand is CLOSED ROUND THE SHAFT:
       THE SHAFT, from the stick's file (w5nagastaff, read across its length, every 4 cm): 1.40 m; from 0.96 to 1.12 m up
         its middle stands 8.2 cm along its own x and its radius is 3.2 to 3.9 cm (3.6 taken; below 0.92 the Naga's coils
         are 5 to 8 cm, above 1.12 its head flares): his hand closes round the middle of that straight neck, as a staff is
         held, his little finger at its foot and his first finger under the head;
       ACROSS HIS PALM, in his hand's own frame (armsOf: the fingers' line, the palm's facing; across toward his thumb): its
         middle 2.5 cm short of his middle finger's knuckle along his hand, so the fingers close round its far side from
         the knuckles (the shaft deeper in the palm: 1.8 cm left the fingers hooked on its near side, drawn down the shaft
         with no browser by tools/probes/gripsolve.mjs and gripdraw.py), pressed into his palm 1.6 cm off the bone's line
         (his palm's skin there 1.1 to 1.7 cm: the thick pads at its heel no more than a grip's press into the shaft),
         straight across it (sloped toward the fingers, as a power grip's oblique line, it turned his wrist toward his
         thumb by as much again: 18 degrees took it past a real wrist's 25), the Naga's head up past his thumb;
       EACH FINGER CLOSED ROUND IT, solved from its own three bones' lengths in its own plane (MCP, PIP and DIP turning
         about the axis square to the finger and to the palm's facing): its first bone turned until its middle joint meets a
         circle round the shaft's line at the shaft's radius and the finger's (0.8 cm, pressed), then the middle and end
         bones laid as chords round that circle (a hand of his size closes about a third of the way round a shaft this
         thick: the fingertips on its far side, not under it); THE THUMB the other way round it, from the heel of the hand,
         its metacarpal turned at its base until its knuckle meets the thumb's circle (its radius 1.2 cm, a thumb's) above
         the shaft on his wrist's side, the root its metacarpal turns least to reach (its other, beneath, swung the thumb
         round under the shaft), its two bones as chords round it toward the fingertips; each joint held inside a hand's
         own range (MCP 90, PIP 110, DIP 85 degrees; the thumb's 60, 60, 80), measured after (tools/probes/jointscan.mjs);
       LAID at the very start of each drawing of the world, after every take, film and lay of his (a first child of the
         world whose matrix update runs before his: his bones' matrices are made from it), and taken off before his mixer
         runs again (armsBack, as every laid pose: v11.5); eased over 0.3 s as the stick comes into his hand or leaves it.
       The stick is laid in this hand at that place (STICK5.inHand asks PHOGRIP5 for it), and goes where the hand goes */
    const PHOGRIP5 = (() => {
      const STAFF_ON = true;
      /* (held OFF until photographed and measured: the stick stands as it did, and his hand is his file's; a probe turns it
         on through the fight's lab, gripOn) */
      let GRIP_ON = false;
      const STICK_R = 0.036, STICK_C = [0.082, -0.003], FING_R = 0.008, GAP = 0.003;
      let TILT = 0, STICK_Y = 1.07, THUMB_R = 0.012, BACK = 0.025, PALM = 0.016;    // (a probe may try others: tune)
      const LIM = { f: [90, 110, 85], t: [60, 60, 80] }, D2R = Math.PI / 180;
      const NAMES = ['Thumb', 'Index', 'Middle', 'Ring', 'Pinky'];
      let G = null, failed = false, k = 0, lastNow = 0, wroteQ = null;
      const V = () => new THREE.Vector3();
      /* the solve, once, from his rest: everything in his right hand's own frame (its bone's local space; `s` metres a unit) */
      function solve(P) {
        if (G || failed) return G;
        const As = armsOf(P), a = As && As.R; if (!a || !a.fingers) { failed = true; return null; }
        const hand = a.hand, chains = {};
        for (const nm of NAMES) { const L = [1, 2, 3, 4].map(i => boneOf(P, 'RightHand' + nm + i)); if (L.some(b => !b)) { failed = true; console.warn('PHOGRIP5: no ' + nm + ' bones on ' + P.key); return null; } chains[nm] = L; }
        hand.updateWorldMatrix(true, true);
        const s = new THREE.Vector3().setFromMatrixColumn(hand.matrixWorld, 0).length() / Math.max(1e-9, new THREE.Vector3().setFromMatrixColumn(P.group.matrixWorld, 0).length());
        const M = (m) => m / s;                                                        // (metres to the hand's units)
        const fL = a.fL.clone(), nL = a.nL.clone();                                    // (the fingers' line; the palm's facing)
        const J = {}; for (const nm of NAMES) { const L = chains[nm], p = [V()]; for (let i = 0; i < 4; i++) p.push(p[i].clone().add(L[i].position)); p.shift(); J[nm] = p; }   // (each joint's place in the hand's frame)
        const acL = J.Index[0].clone().sub(J.Pinky[0]); acL.addScaledVector(fL, -acL.dot(fL)).normalize();   // (across, toward the thumb)
        const up = nL.clone().negate();                                                // (the back of his hand)
        const A = acL.clone().multiplyScalar(Math.cos(TILT)).addScaledVector(fL, Math.sin(TILT)).normalize();   // (the shaft's line, its upper end toward his thumb)
        const C = fL.clone().multiplyScalar(J.Middle[0].dot(fL) - M(BACK)).addScaledVector(nL, M(PALM + STICK_R));   // (the shaft's middle under his palm)
        const out = { s, chains, q: {}, report: {} };
        const arc = (l, r) => 2 * Math.asin(Math.min(1, l / (2 * r)));
        /* one finger: its plane, the shaft's circle in it, its joints as chords round it */
        const finger = (nm) => {
          const P0 = J[nm][0], seg = [0, 1, 2].map(i => J[nm][i + 1].clone().sub(J[nm][i])), l = seg.map(v => v.length());
          const d = seg[0].clone().normalize(), w = d.clone().cross(nL).normalize();     // (square to the finger and to the palm's facing)
          const cs = C.clone().addScaledVector(A, P0.clone().sub(C).dot(w) / A.dot(w)); // (the shaft's line where it crosses this finger's plane)
          const x3 = d.clone().addScaledVector(w, -d.dot(w)).normalize(), y3 = w.clone().cross(x3).normalize();
          if (y3.dot(up) < 0) y3.negate();                                             // (y the back of the hand, -y the palm)
          const to2 = (p) => [p.clone().sub(P0).dot(x3), p.clone().sub(P0).dot(y3)], c = to2(cs), rho = M(STICK_R + FING_R + GAP);
          /* the first bone: turned toward the palm until its far joint meets the circle (the first meeting) */
          let phi = 0; const hit = (ph) => Math.hypot(l[0] * Math.cos(ph) - c[0], -l[0] * Math.sin(ph) - c[1]) - rho;
          for (let t = 0; t <= 100; t++) { const ph = t * D2R; if (hit(ph) <= 0) { phi = ph; break; } phi = ph; }
          for (let it = 0; it < 30; it++) { const a0 = phi - D2R, a1 = phi; const m2 = (a0 + a1) / 2; if (hit(m2) <= 0) phi = m2; else break; }
          const p1 = [l[0] * Math.cos(phi), -l[0] * Math.sin(phi)];
          let al = Math.atan2(p1[1] - c[1], p1[0] - c[0]);                           // (round the shaft from there, the way the fingers close)
          const pts = [[0, 0], p1];
          for (const li of [l[1], l[2]]) { al -= arc(li, rho); pts.push([c[0] + rho * Math.cos(al), c[1] + rho * Math.sin(al)]); }
          return { P0, x3, y3, w, l, pts, rest: seg.map(v => v.clone().normalize()), lim: LIM.f };
        };
        /* the thumb: the other way round the shaft, in the plane square to it through his thumb's knuckle */
        const thumb = () => {
          const P0 = J.Thumb[0], seg = [0, 1, 2].map(i => J.Thumb[i + 1].clone().sub(J.Thumb[i])), l = seg.map(v => v.length());
          const st = J.Thumb[1].clone().sub(C).dot(A), cs = C.clone().addScaledVector(A, st);
          const x3 = fL.clone().addScaledVector(A, -fL.dot(A)).normalize(), y3 = A.clone().cross(x3).normalize(); if (y3.dot(up) < 0) y3.negate();
          const rho = M(STICK_R + THUMB_R + GAP), Q = (b) => cs.clone().addScaledVector(x3, rho * Math.cos(b)).addScaledVector(y3, rho * Math.sin(b));
          /* its knuckle on the circle above the shaft, nearer the wrist, the metacarpal's own length from its base */
          let best = null; const es = []; for (let t = 60; t <= 200; t += 0.5) { const b = t * D2R, e = Math.abs(Q(b).distanceTo(P0) - l[0]); es.push([t, e]); if (!best || e < best.e) best = { b, e }; }
          /* (where the circle meets the metacarpal's reach: each place it comes nearest, said in the report, the one taken first) */
          const roots = es.filter((q, i) => i > 0 && i < es.length - 1 && q[1] <= es[i - 1][1] && q[1] <= es[i + 1][1]).map(q => [q[0], +(q[1] * s * 100).toFixed(2)]);
          /* (the circle meets that reach twice, above the shaft toward his wrist and under it: the one his metacarpal turns
             least to reach is taken (his thumb at rest lies along it nearly; under it the thumb swung round beneath the
             shaft, its first joint at 56 degrees, its skin 2.4 cm into the shaft), the nearer to exact where it is alone) */
          const rest0 = seg[0].clone().normalize(); let pick = best.b, least = Infinity;
          for (const [t, e] of roots) if (e < 0.4) { const d = Q(t * D2R).sub(P0).normalize(), turn = Math.acos(Math.max(-1, Math.min(1, d.dot(rest0)))); if (turn < least) { least = turn; pick = t * D2R; } }
          best.b = pick; best.e = Math.abs(Q(pick).distanceTo(P0) - l[0]);
          let be = best.b; const tg = [P0.clone(), Q(be)];
          for (const li of [l[1], l[2]]) { be += arc(li, rho); tg.push(Q(be)); }       // (round the shaft's near side and under it)
          return { thumb: true, P0, l, tg, rest: seg.map(v => v.clone().normalize()), lim: LIM.t, miss: best.e, at: +(best.b / D2R).toFixed(1), roots };
        };
        /* each chain's turns: each bone's rest line turned onto its target line, down the chain (each in its parent's frame) */
        const chainQ = (nm, tgDirs, lim) => {
          const L = chains[nm], qs = [], acc = new THREE.Quaternion(), rep = [];
          for (let i = 0; i < 3; i++) {
            const restW = L[i + 1].position.clone().normalize().applyQuaternion(acc);   // (its rest line as the bones above it now stand)
            let qw = new THREE.Quaternion().setFromUnitVectors(restW, tgDirs[i]);
            let ang = 2 * Math.acos(Math.min(1, Math.abs(qw.w)));
            if (ang > lim[i] * D2R) { qw = new THREE.Quaternion().slerp(qw, lim[i] * D2R / ang); ang = lim[i] * D2R; }
            const ql = acc.clone().invert().multiply(qw).multiply(acc);                  // (into this bone's parent's frame)
            qs.push(ql); acc.premultiply(qw); rep.push(+(ang / D2R).toFixed(1));
          }
          out.q[nm] = qs; out.report[nm] = rep;
        };
        for (const nm of ['Index', 'Middle', 'Ring', 'Pinky']) { const F = finger(nm);
          const dir = (i) => { const a0 = F.pts[i], a1 = F.pts[i + 1]; return F.x3.clone().multiplyScalar(a1[0] - a0[0]).addScaledVector(F.y3, a1[1] - a0[1]).normalize(); };
          chainQ(nm, [dir(0), dir(1), dir(2)], F.lim); }
        { const T = thumb(); chainQ('Thumb', [0, 1, 2].map(i => T.tg[i + 1].clone().sub(T.tg[i]).normalize()), T.lim); out.report.thumbMiss = +(T.miss * s * 100).toFixed(2); out.report.thumbAt = T.at; out.report.thumbRoots = T.roots; }
        /* the stick in this hand: its shaft's middle at 1.00 m up it on C, its length along A, the Naga's head facing as his knuckles do */
        const yA = A.clone(), xA = fL.clone().addScaledVector(A, -fL.dot(A)).normalize().negate(), zA = xA.clone().cross(yA).normalize();
        const R = new THREE.Matrix4().makeBasis(xA, yA, zA), sc = 1 / s;
        const off = new THREE.Matrix4().compose(V(), new THREE.Quaternion().setFromRotationMatrix(R), new THREE.Vector3(sc, sc, sc));
        const at = new THREE.Vector3(STICK_C[0], STICK_Y, STICK_C[1]).applyMatrix4(off);
        off.setPosition(C.clone().sub(at));
        out.off = off; out.C = C; out.A = A; out.F = xA.clone().negate();
        out.foreAxis = a.hand.position.clone().normalize();                         // (the forearm's own line, in its frame)
        G = out; console.log('PHOGRIP5: his grip solved: ' + JSON.stringify(out.report)); return G;
      }
      /* the closed hand laid on, by k (0 his file's hand .. 1 closed), from wherever the take left the fingers (they have none
         of their own tracks: at rest they stand as grafted) */
      const _q = new THREE.Quaternion();
      function lay(P, kk) {
        const As = armsOf(P), a = As && As.R; if (!a || !G) return;
        if (!a.fing || !a.fingAll) { a.fing = []; for (const nm of NAMES) G.chains[nm].slice(0, 3).forEach((b, i) => a.fing.push({ b, q: new THREE.Quaternion(), i: i + 1, nm, j: i })); a.fingAll = true; }
        /* (already laid in this frame by an earlier drawing: the same turns again, nothing saved twice) */
        const fresh = !a.curled || !wroteQ || a.fing.some((F, n) => !F.b.quaternion.equals(wroteQ[n]));
        if (fresh && !a.curled) { for (const F of a.fing) F.q.copy(F.b.quaternion); a.curled = true; }
        a.fing.forEach((F) => { _q.copy(G.q[F.nm][F.j]); F.b.quaternion.copy(F.q).slerp(_q, kk); });
        wroteQ = a.fing.map(F => F.b.quaternion.clone());
        for (const nm of NAMES) G.chains[nm][0].updateMatrixWorld(true);
      }
      /* HIS ARM HOLDING IT UPRIGHT while he rests, walks, runs and talks (his takes' arms hang and swing: a stick through a hanging
         fist would lie across his path). His right arm solved as an arm (armHinge: the elbow on its pole's side, its hinge
         the one ALL his takes bend about, (0.805, 0, 0.593) in his upper arm's frame, read from ten of them), the fist where
         a man stands holding a staff (in his own frame 0.30 m out to his right and 0.28 m before him, as high as the stick
         standing on the paving puts his hand: STICK_Y up it), turned thumb-up so the stick stands upright with its Naga's
         head toward where he faces, turned 15 degrees out; his elbow on the side that hangs it lowest, under his shoulder
         (to his left, down and back of the line from his shoulder to his wrist: his upper arm is 0.233 m, so with his hand
         at the stick's neck his forearm comes 21 degrees down to it and his wrist turns as much toward his thumb, a real
         wrist's range 25; elbows put out and back, as first, held it 40 and more: tools/probes/e4c5gripfit.mjs, two rounds
         in the game, every number jointscan's own); the hand's turn along the forearm carried by the forearm (thumb-up is a
         forearm's middle); a step nearer him (0.22 m) the stick's line crossed his robe; leaned, its top forward, it met
         his shins; lifted 6 cm as he walks or runs (his body dips 4 cm a step: the stick's foot kept off the paving). In
         every take but a cast, by the casts' weights: in a cast (the throw, the gold, the bag, the Naga's planting) his own
         take's arm carries it */
      const STAFF = { fist: [-0.30, 1.10, 0.28], lift: 0.06, out: 15 * D2R, pole: [0.36, -0.65, -0.66], hm: [0.805, 0, 0.593], lean: 0,
                      casts: /^(Charged_Spell_Cast|mage_soell_cast|Right_Hand_Sword_Slash)/ };
      const _sa = V(), _sb = V(), _sc = V(), _sd = V(), _se = V(), _sf = V(), _sq = new THREE.Quaternion(), _sq2 = new THREE.Quaternion(), _sq3 = new THREE.Quaternion(),
            _sm = new THREE.Matrix4(), _sm2 = new THREE.Matrix4(), _keep = [new THREE.Quaternion(), new THREE.Quaternion(), new THREE.Quaternion()];
      let wroteArm = null;
      function staffLay(P, kk) {
        const As = armsOf(P), a = As && As.R; if (!a || !G || !G.F) return;
        /* (every take of his holds it so but his casts, whose own arm carries the stick: his rest, walk and run, and his talk
           in the films, the free hand talking (with the talk's arm the stick swung through his robe: FILMS' clipscan of the
           preparation at 27 s, 144 crossings at 1.1 m); a cast by its weight, so the arm is handed over as the take is) */
        const w = P.w || {};
        let cast = 0; for (const nm in w) if (w[nm] > 0 && STAFF.casts.test(nm)) cast += w[nm];
        const share = Math.max(0, 1 - Math.min(1, cast)) * kk; if (!(share > 0.001)) return;
        if (a.wrote && wroteArm && a.up.quaternion.equals(wroteArm[0]) && a.fore.quaternion.equals(wroteArm[1]) && a.hand.quaternion.equals(wroteArm[2])) return;   // (laid already in this frame)
        if (!a.wrote) { a.qUp.copy(a.up.quaternion); a.qFore.copy(a.fore.quaternion); a.qHand.copy(a.hand.quaternion); a.wrote = true; }
        _keep[0].copy(a.up.quaternion); _keep[1].copy(a.fore.quaternion); _keep[2].copy(a.hand.quaternion);
        hingeOf(a, -1, STAFF.hm);
        P.group.updateWorldMatrix(true, false); P.group.getWorldQuaternion(_sq);
        const walk = Math.min(1, (w.Walking || 0) + (w.Running || 0));
        /* (the fist's height is where the stick's foot stands on the paving: the hand STICK_Y up it, leaned or not, 4 mm clear) */
        const Ct = _sa.set(STAFF.fist[0], STICK_Y * Math.cos(STAFF.lean || 0) + 0.004 + STAFF.lift * walk, STAFF.fist[2]); P.group.localToWorld(Ct);
        const up = _sb.set(0, 1, 0), front = _sc.set(-Math.sin(STAFF.out), 0, Math.cos(STAFF.out)).applyQuaternion(_sq).normalize();
        /* (its top leaned back toward him by STAFF.lean, its foot ahead: the hand turned with it) */
        if (STAFF.lean) { const cl = Math.cos(STAFF.lean), sl = Math.sin(STAFF.lean), fx = front.x, fy = front.y, fz = front.z;
          front.set(fx * cl, sl, fz * cl).normalize(); up.set(-fx * sl, cl, -fz * sl).normalize(); }
        /* the hand's turn in the world: the shaft's line (in the hand's frame) up, the knuckles' line front */
        _sd.crossVectors(G.F, G.A).normalize(); _se.crossVectors(front, up).normalize();
        _sm.makeBasis(front, up, _se); _sm2.makeBasis(G.F, G.A, _sd).transpose(); _sm.multiply(_sm2); _sq2.setFromRotationMatrix(_sm);
        /* the wrist, where the fist's middle comes onto its place */
        const Wr = _sf.copy(G.C).multiplyScalar(G.s).applyQuaternion(_sq2).negate().add(Ct);
        const pole = _sd.set(STAFF.pole[0], STAFF.pole[1], STAFF.pole[2]).normalize().applyQuaternion(_sq);
        armHinge(a, Wr, pole);
        /* the forearm turned along its own line by the hand's turn about it (swing and twist: the twist to the forearm) */
        a.fore.updateWorldMatrix(true, false); a.fore.getWorldQuaternion(_sq3);
        const rel = _sq3.clone().invert().multiply(_sq2), ax = G.foreAxis, dd = rel.x * ax.x + rel.y * ax.y + rel.z * ax.z;
        const tw = new THREE.Quaternion(ax.x * dd, ax.y * dd, ax.z * dd, rel.w); if (tw.lengthSq() > 1e-12) { tw.normalize(); a.fore.quaternion.multiply(tw); a.fore.updateWorldMatrix(false, true); }
        a.fore.getWorldQuaternion(_sq3); a.hand.quaternion.copy(_sq3.invert().multiply(_sq2)); a.hand.updateWorldMatrix(false, true);
        if (share < 0.999) { _sq.copy(a.up.quaternion); a.up.quaternion.copy(_keep[0]).slerp(_sq, share);
          _sq.copy(a.fore.quaternion); a.fore.quaternion.copy(_keep[1]).slerp(_sq, share);
          _sq.copy(a.hand.quaternion); a.hand.quaternion.copy(_keep[2]).slerp(_sq, share); a.up.updateWorldMatrix(false, true); }
        wroteArm = [a.up.quaternion.clone(), a.fore.quaternion.clone(), a.hand.quaternion.clone()];
      }
      const hook = new THREE.Object3D(); hook.name = 'his grip on the Naga stick';
      hook.updateMatrixWorld = function (force) {
        const P = cast.pho;
        try {
          const now = performance.now(), dt = lastNow ? Math.min(0.1, (now - lastNow) / 1000) : 0;
          if (now - lastNow > 1) { lastNow = now;
            const holding = !!(P && P.ready && typeof STICK5 === 'object' && STICK5.who === 'pho' && things.nagaStaff && things.nagaStaff.visible && P.group.visible);
            k = holding ? Math.min(1, k + dt / 0.3) : Math.max(0, k - dt / 0.3); }
          if (GRIP_ON && P && P.ready && k > 0 && solve(P)) { if (STAFF_ON) staffLay(P, k); lay(P, k); }
        } catch (e) { if (!failed) { failed = true; console.warn('PHOGRIP5 threw: ' + (e && e.message)); } }
        THREE.Object3D.prototype.updateMatrixWorld.call(this, force);
      };
      world.children.unshift(hook); hook.parent = world;
      return {
        /* the stick's place in his right hand, in that hand's frame (null: his hand has no fingers, and the stick stands as before) */
        offset(P) { if (!GRIP_ON) return null; const g = solve(P); return g ? g.off : null; },
        on() { GRIP_ON = true; if (typeof STICK5 === 'object') { STICK5.off = null; if (STICK5.who === 'pho' && cast.pho && cast.pho.ready) STICK5.inHand(cast.pho); } return true; },
        report() { return G ? JSON.parse(JSON.stringify(G.report)) : (failed ? 'failed' : null); },
        k() { return k; },
        /* (a probe's: another slope across his palm, place of his fist, side of his elbow or lean of the stick tried, the
           solve made again and the stick laid again; nothing calls it in play) */
        tune(o = {}) { if (o.tilt != null) TILT = o.tilt * D2R; if (o.fist) STAFF.fist = o.fist.slice(); if (o.pole) STAFF.pole = o.pole.slice(); if (o.lean != null) STAFF.lean = o.lean * D2R;
          if (o.stickY != null) STICK_Y = +o.stickY; if (o.thumbR != null) THUMB_R = +o.thumbR; if (o.back != null) BACK = +o.back; if (o.palm != null) PALM = +o.palm;
          if (o.out != null) STAFF.out = o.out * D2R;
          G = null; failed = false; wroteQ = null; wroteArm = null;
          if (typeof STICK5 === 'object') { STICK5.off = null; if (STICK5.who === 'pho' && cast.pho && cast.pho.ready) STICK5.inHand(cast.pho); }
          return { tilt: +(TILT / D2R).toFixed(1), fist: STAFF.fist, pole: STAFF.pole, lean: +((STAFF.lean || 0) / D2R).toFixed(1), stickY: STICK_Y, thumbR: THUMB_R, back: BACK, palm: PALM, out: +(STAFF.out / D2R).toFixed(1) }; }
      };
    })();
    if (typeof STICK5 === 'object') STICK5.grip = PHOGRIP5;
