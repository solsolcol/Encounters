
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

    /* THE FIREBALLS: a ruby light round a pale core, rising out of the Naga's mouth, arcing over and coming down on the Prai
       (never across a person: it rises), a short trail of ruby behind it and a ruby pool on the paving under it; a bloom
       where it lands. Four in the air at most (his own, and his teacher's when he is not played) */
    const FS_TRAIL = 6;
    const fsBalls = [0, 1, 2, 3].map(() => ({ on: false, core: fsSprite(FS_COL.rubyCore, true, 6), glow: fsSprite(FS_COL.ruby, true, 6),
      trail: Array.from({ length: FS_TRAIL }, () => fsSprite(FS_COL.ruby, true, 5)), pool: fsGround(fsDot, FS_COL.ruby, true, 0.016),
      a: new THREE.Vector3(), b: new THREE.Vector3(), t: 0, T: 0.7, ai: false, id: 0, hist: [] }));
    const fsBlooms = [0, 1, 2, 3].map(() => ({ on: false, s: fsSprite(FS_COL.ruby, true, 6), g: fsGround(fsDot, FS_COL.ruby, true, 0.017), t: 0, col: FS_COL.ruby, k: 1 }));
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
    const fsWheel = fsGround(fsWheelTex, FS_COL.gold, true, 0.02);
    const fsGatherRing = fsGround(fsRingTex, FS_COL.gold, true, 0.021);
    const fsGoldHalo = fsSprite(FS_COL.gold, true, 6);
    /* THE BAG: what is drawn streams to his mouth and down into the open bag at the doorway; a thin line on the paving joins
       him to the one the button will take while it shows */
    const FS_STREAK = 14;
    const fsStreaks = [0, 1, 2].map(() => ({ on: false, id: 0, t: 0, T: 1, gold: false, a: new THREE.Vector3(), m: new THREE.Vector3(), b: new THREE.Vector3(), c: new THREE.Vector3(),
      dots: Array.from({ length: FS_STREAK }, () => fsSprite(0x2a2f38, false, 5)), glints: Array.from({ length: 5 }, () => fsSprite(FS_COL.pale, true, 6)) }));
    const fsReach = (() => { const m = new THREE.Mesh(fsQuad, fsGroundMat(null, FS_COL.pale, true)); m.visible = false; m.position.y = 0.019; m.renderOrder = 2; FSG.add(m); return m; })();
    /* where a Prai presses his cage's bars: a violet flare on the bars, flickering */
    const fsPress = [0, 1, 2].map(() => fsSprite(FS_COL.violet, true, 5));

    /* ---------------------------------------------------------------- THE BUTTONS' PICTURES (drawn things, each in its
       act's own colour so a phone reads the act at a glance; no person is drawn: v21.16) */
    function fsIcon(draw) { const [c, x] = fsCanvas(96); x.lineCap = 'round'; x.lineJoin = 'round'; draw(x); return c; }
    const FS_ICON = {
      flame: fsIcon((x) => { const g = x.createRadialGradient(48, 52, 2, 48, 52, 34); g.addColorStop(0, '#fff1e8'); g.addColorStop(0.35, '#ff6a7c'); g.addColorStop(1, 'rgba(255,42,74,0)');
        x.fillStyle = g; x.beginPath(); x.arc(48, 52, 34, 0, Math.PI * 2); x.fill();
        x.strokeStyle = '#ff4a62'; x.lineWidth = 5; x.beginPath(); x.moveTo(30, 30); x.quadraticCurveTo(48, 6, 66, 30); x.stroke(); }),
      shock: fsIcon((x) => { x.strokeStyle = '#ffcf6a'; x.lineWidth = 7; x.beginPath(); x.arc(48, 48, 33, 0, Math.PI * 2); x.stroke();
        x.lineWidth = 3.5; for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI * 2; x.beginPath(); x.moveTo(48 + Math.cos(a) * 12, 48 + Math.sin(a) * 12); x.lineTo(48 + Math.cos(a) * 28, 48 + Math.sin(a) * 28); x.stroke(); }
        x.fillStyle = '#fff0c8'; x.beginPath(); x.arc(48, 48, 7, 0, Math.PI * 2); x.fill(); }),
      bag: fsIcon((x) => { x.fillStyle = '#20242c'; x.strokeStyle = '#d8dce6'; x.lineWidth = 4;
        x.beginPath(); x.moveTo(34, 30); x.bezierCurveTo(14, 46, 16, 84, 48, 84); x.bezierCurveTo(80, 84, 82, 46, 62, 30); x.closePath(); x.fill(); x.stroke();
        x.beginPath(); x.moveTo(30, 28); x.quadraticCurveTo(48, 38, 66, 28); x.stroke(); x.beginPath(); x.moveTo(42, 20); x.lineTo(40, 31); x.moveTo(54, 20); x.lineTo(56, 31); x.stroke(); }),
      bind: fsIcon((x) => { const g = x.createRadialGradient(48, 48, 10, 48, 48, 36); g.addColorStop(0, 'rgba(155,107,255,0.08)'); g.addColorStop(0.8, 'rgba(155,107,255,0.55)'); g.addColorStop(1, 'rgba(200,170,255,0.95)');
        x.fillStyle = g; x.beginPath(); x.arc(48, 48, 36, 0, Math.PI * 2); x.fill(); x.strokeStyle = '#c9b0ff'; x.lineWidth = 4; x.stroke();
        x.fillStyle = 'rgba(255,255,255,0.85)'; x.beginPath(); x.arc(36, 34, 6, 0, Math.PI * 2); x.fill(); }),
      smell: fsIcon((x) => { x.strokeStyle = '#c8d6a8'; x.lineWidth = 6;
        x.beginPath(); x.moveTo(38, 14); x.bezierCurveTo(36, 34, 26, 50, 22, 60); x.bezierCurveTo(18, 70, 28, 76, 38, 74); x.bezierCurveTo(42, 80, 50, 80, 54, 74); x.stroke();
        x.lineWidth = 4.5; for (let i = 0; i < 3; i++) { const y0 = 34 + i * 16; x.beginPath(); x.moveTo(62, y0); x.bezierCurveTo(70, y0 - 7, 76, y0 + 7, 86, y0); x.stroke(); } }),
      lend: fsIcon((x) => { x.strokeStyle = '#b896ff'; x.lineWidth = 5; for (let i = 0; i < 5; i++) { const px = 22 + i * 13; x.beginPath(); x.moveTo(px, 20); x.lineTo(px, 76); x.stroke(); }
        x.lineWidth = 4; x.beginPath(); x.ellipse(48, 78, 32, 7, 0, 0, Math.PI * 2); x.stroke(); }),
      together: fsIcon((x) => { x.lineWidth = 6; x.strokeStyle = '#ffcf6a'; x.beginPath(); x.arc(38, 48, 22, 0, Math.PI * 2); x.stroke();
        x.strokeStyle = '#b896ff'; x.beginPath(); x.arc(58, 48, 22, 0, Math.PI * 2); x.stroke(); x.strokeStyle = '#ff4a62'; x.lineWidth = 4; x.beginPath(); x.moveTo(48, 18); x.quadraticCurveTo(70, 48, 48, 78); x.stroke(); })
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
      fsMouth(B.a); const w = fsW(f.x, f.z); B.b.set(w.x, 0.85, w.z);
      if (!f.id && !f.cloud) B.b.y = 0.05;
      if (!B.wait) fsBallSound(B);
    }
    function fsBallSound(B) { const m = B.a; fsFx(fsDeal('ball'), B.ai ? 0.45 : 0.8, m.x, m.z); fsFx('u5flight', B.ai ? 0.32 : 0.6, m.x, m.z); }
    function fsBloom(x, z, col, k = 1) { const L = fsBlooms.find(b => !b.on) || fsBlooms[0]; L.on = true; L.t = 0; L.col = col; L.k = k;
      L.s.material.color.setHex(col); L.g.material.color.setHex(col); L.s.position.set(x, 0.9, z); L.g.position.set(x, 0.017, z); }
    function fsFxFrame(wdt, ft) {
      const st = FS5.st;
      /* the fireballs: up out of the mouth, over, and down (a parabola above the line between them; it rises 1.6 m) */
      for (const B of fsBalls) {
        if (!B.on) { if (B.core.visible) { B.core.visible = B.glow.visible = B.pool.visible = false; for (const s of B.trail) s.visible = false; } continue; }
        if (B.wait > 0) { B.wait -= wdt; if (B.wait > 0) continue; fsMouth(B.a); fsBallSound(B); }   // (let go now, from the stick's head)
        B.t += wdt; const u = c01(B.t / B.T), h = (B.ai ? 1.1 : 1.6) * 4 * u * (1 - u);
        _fsA.lerpVectors(B.a, B.b, u); _fsA.y += h;
        const sz = B.ai ? 0.62 : 1;
        B.core.visible = B.glow.visible = true; B.core.position.copy(_fsA); B.glow.position.copy(_fsA);
        B.core.scale.setScalar(0.16 * sz); B.glow.scale.setScalar(0.62 * sz * (0.9 + 0.1 * Math.sin(ft * 40)));
        B.core.material.opacity = 1; B.glow.material.opacity = 0.9;
        B.hist.unshift(_fsA.clone()); if (B.hist.length > FS_TRAIL * 2) B.hist.length = FS_TRAIL * 2;
        B.trail.forEach((s, j) => { const q = B.hist[j * 2 + 1]; s.visible = !!q; if (!q) return; s.position.copy(q); s.scale.setScalar(0.36 * sz * (1 - j / FS_TRAIL)); s.material.opacity = 0.55 * (1 - j / FS_TRAIL); });
        B.pool.visible = true; B.pool.position.set(_fsA.x, 0.016, _fsA.z); B.pool.scale.set(1.1 * sz, 1, 1.1 * sz); B.pool.material.opacity = 0.32 * (0.4 + 0.6 * (1 - h / 1.6));
        if (u >= 1) B.on = false;
      }
      for (const L of fsBlooms) {
        if (!L.on) { if (L.s.visible) L.s.visible = L.g.visible = false; continue; }
        L.t += wdt; const u = c01(L.t / 0.6); L.s.visible = L.g.visible = true;
        L.s.scale.setScalar((0.5 + 1.3 * u) * L.k); L.s.material.opacity = 0.95 * (1 - u);
        L.g.scale.set((0.8 + 1.8 * u) * L.k, 1, (0.8 + 1.8 * u) * L.k); L.g.material.opacity = 0.55 * (1 - u);
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
        fsGoldHalo.visible = true; fsHead(cast.pho, fsGoldHalo.position, 1.5); fsGoldHalo.position.y -= 0.15; fsGoldHalo.scale.setScalar(0.9 + 1.6 * wind); fsGoldHalo.material.opacity = 0.35 + 0.5 * wind; }
      else { fsGatherRing.visible = false; fsGoldHalo.visible = false; }
      if (ph.ring) { const w = fsW(ph.ring.x, ph.ring.z), r = Math.max(0.2, ph.ring.r), out = c01(r / Math.max(0.1, FN5.ringMax || 7));
        fsWheel.visible = true; fsWheel.position.set(w.x, 0.02, w.z); fsWheel.scale.set(r * 2, 1, r * 2); fsWheel.rotation.y = -r * 0.25; fsWheel.material.opacity = 0.95 * (1 - out * out);
        /* the lamps at the house flare as it passes them */
        const dl = Math.abs((COURT5.z - (HOUSE.face - 0.3)) - ph.ring.z) - r;
        if (dl < 0.2 && !FS5.flared) { FS5.flared = true; FS5.flare = 1; fsFx('u5lampflare', 0.4, DOOR_FRONT.x0 - 0.38, HOUSE.face - 0.3); fsFx('u5lampflare', 0.34, DOOR_FRONT.x1 + 0.38, HOUSE.face - 0.3); } }
      else { fsWheel.visible = false; FS5.flared = false; }
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
        S.glints.forEach((d, j) => { const q = u * 1.25 - j * 0.07 - 0.02; d.visible = q > 0 && q < 1; if (!d.visible) return; at(q, d.position);
          d.scale.setScalar(0.18); d.material.opacity = 0.7; d.material.color.setHex(S.gold ? FS_COL.gold : FS_COL.pale); });
        if (u >= 1) S.on = false;
      }
      /* the bubbles of light where a Prai presses the bars, flickering */
      const zz = FS5.st.cage.lent > 0 ? (cast.pho ? cast.pho.group.position : null) : (cast.zav ? cast.zav.group.position : null);
      const press = st.prai.filter(p => p.st === 'pressing');
      fsPress.forEach((s, j) => { const p = press[j]; if (!p || !zz) { s.visible = false; return; }
        const w = fsW(p.x, p.z), dx = w.x - zz.x, dz = w.z - zz.z, d = Math.hypot(dx, dz) || 1, R = (FN5.cageR || 1);
        s.visible = true; s.position.set(zz.x + dx / d * R, 1.0, zz.z + dz / d * R); s.scale.setScalar(0.5 + 0.18 * Math.sin(ft * 23 + j * 2));
        s.material.opacity = 0.55 + 0.35 * Math.sin(ft * 17 + j); });
    }

    /* ---------------------------------------------------------------- THE TWO OF THEM: their takes, their faces */
    const fsTake = { pho: { walking: false, t: 0, pace: 0 }, zav: { walking: false, t: 0, pace: 0 } };
    /* HIS ACTS IN HIS OWN BODY: three of Grandmaster Pho's own file's takes (none was made for the fight), each played
       between two of its own moments (span) on the frame the rules begin the act, with every posture law of his as it
       stands (none is keyed to these three, so each plays as his file has it). Read from his file through its bones
       (hands, head, hips and feet at thirty moments of each: M8's takeread), then photographed in the game:
       FIRE, mage_soell_cast: the stick swept up over his head from its rise (0.50 of the take) to its top (0.71) in
         0.12 s, the fireball let go at the top, then brought down to 1.30 in 0.42 s; he plants for it (his walk held
         from the rise to the stick's coming down: 0.54 s of the fire's 1.1 s wait)
       SHOCKWAVE, Charged_Spell_Cast: the gather low (0.50 to 1.50 of it) and both hands up (2.0) over the gold's 1.5 s,
         held up until the wheel goes out, then down (2.6) in 0.6 s; broken, he lets it go at once
       BAG, mage_soell_cast_8: both hands drawn in to his mouth (0 to 0.40 of it) over 0.6 s of the bag's draw, held
         until it is in the bag, then let down
       FS_ACTS off: he fires from his walk and his rest, as the first pass had him */
    const FS_ACTS = true;
    const FS_PHO_TAKE = { phoFire: { take: 'mage_soell_cast', a: 0.50, top: 0.71, b: 1.30, up: 0.12, down: 0.42, hold: false },
                          wave: { take: 'Charged_Spell_Cast', a: 0.50, top: 2.00, b: 2.60, up: 1.5, down: 0.60, hold: true },
                          bag:  { take: 'mage_soell_cast_8', a: 0.00, top: 0.40, b: 0.40, up: 0.6, down: 0.35, hold: true } };
    function fsPhoAct(kind, up) {
      const P = cast.pho, A = FS_PHO_TAKE[kind];
      if (!FS_ACTS || !P || !P.ready || !A || !P.acts[A.take]) return 0;
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
      if (T.pace > 0.08) { T.walking = true; T.t = 0; if (P.win) delete P.win.Walking; take(P, 'Walking', fade); if (P.acts.Walking) P.acts.Walking.timeScale = 1; }
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
      if (who === 'pho' && fsActing()) return;                         // (an act's take holds him: it hands him back itself)
      const moving = pace > 0.08;
      if (moving) { T.t = 0; if (!T.walking) { T.walking = true; if (P.win) delete P.win.Walking; take(P, 'Walking', 0.25); if (P.acts.Walking) P.acts.Walking.timeScale = 1; } }
      else if (T.walking) { T.t += wdt; if (T.t > 0.25) { T.walking = false;
        if (who === 'zav') { const rt = zavRest(); if (rt) rest(P, 0.35); else hold(P, 'Walking', ZAV_STAND5, 0.001, 0.35); } else rest(P, 0.35); } }
      const wp = (P.pace && P.pace.Walking) || 1.29;
      P.rate = moving ? Math.max(0.3, Math.min(1.6, pace / wp)) : 1;
    }
    /* THEIR FOOTFALLS on the paving (the engine's steps are the first person's, and he does not walk in the mode): each
       body's walk struck where its own take sets a foot down, read from each file through its bones (M8's takeread: his
       teacher's Walking at 0.37 and 0.85 of its 1.03 s, his own at 0.28 and 0.78), at the manifest's gain */
    const FS_STEP = { pho: { name: 'u5phostep', at: [0.37, 0.85] }, zav: { name: 'u5zstep', at: [0.28, 0.78] } };
    function fsSteps() {
      for (const who of ['pho', 'zav']) {
        const P = who === 'pho' ? cast.pho : cast.zav, S = FS_STEP[who], T = fsTake[who];
        if (!P || !P.ready || !P.acts.Walking || !P.group.visible) continue;
        const A = P.acts.Walking, d = A.getClip().duration || 1, u = ((A.time % d) + d) % d / d, last = T.stepU;
        T.stepU = u;
        if (last == null || !T.walking || (P.w.Walking || 0) < 0.5) continue;
        for (const a of S.at) if (last <= u ? (last < a && u >= a) : (last < a || u >= a)) {
          const k = Math.min(1, (T.pace || 0) / (who === 'pho' ? (FN5.phoWalk || 1.2) : (FN5.zavWalk || 0.6)));
          fsFx(S.name, 0.4 * (0.75 + 0.25 * k), P.group.position.x, P.group.position.z); }
      }
    }
    function fsStand(P, who) {
      if (!P) return; fsTake[who].walking = false; fsTake[who].t = 0;
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
        const s = p.st, w = fsW(p.x, p.z), V = fsVis[p.id - 1], y = 1.0 * (V ? V.s : 1);
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
            if (e.result === 'tired') { fsBloom(w.x, w.z, FS_COL.ruby, 1.2); fsFx('u5ruby', 0.8, w.x, w.z); fsFx(fsDeal('tired'), 0.8, w.x, w.z); const Bb = fsBubbles.find(b => b.id === e.id); if (Bb) Bb.fl = 1; }
            else if (e.result === 'chased' || e.result === 'setback') { fsBloom(w.x, w.z, FS_COL.ruby, e.result === 'setback' ? 0.7 : 1); fsFx(fsDeal('land'), e.result === 'setback' ? 0.5 : 0.8, w.x, w.z); if (p) fsFx(FS_HIT[p.kind] || 'u5hitc', e.result === 'setback' ? 0.5 : 0.8, w.x, w.z); }
            else if (e.result === 'slipped') { fsBloom(w.x, w.z, FS_COL.ruby, 0.5); fsFx('u5slipthru', 0.8, w.x, w.z); }
            else if (e.result === 'stale') { fsBloom(w.x, w.z, FS_COL.sour, 0.7); fsFx('u5stale', 0.8, w.x, w.z); }
            else { fsBloom(w.x, w.z, FS_COL.ruby, 0.6); fsFx(fsDeal('land'), 0.6, w.x, w.z); }
            break; }
          case 'bind': { const zw = cast.zav ? cast.zav.group.position : null;
            if (e.stale) fsFx('u5bindstale', 0.8, zw ? zw.x : null, zw ? zw.z : null);
            else { const p = st.prai[e.id - 1], w = p ? fsW(p.x, p.z) : null; fsFx(fsDeal('bind'), 0.8, w ? w.x : null, w ? w.z : null); if (w) { FS5.faceTo.zavier = { x: p.x, z: p.z }; FS5.faceT.zavier = 0.7; } }
            break; }
          case 'unbind': { const p = st.prai[e.id - 1], w = p ? fsW(p.x, p.z) : null; fsFx('u5bindpop', 0.8, w ? w.x : null, w ? w.z : null); break; }
          case 'smell': { const zw = cast.zav ? cast.zav.group.position : { x: 0, z: 0 }; fsRipple.t = 0; fsRipple.x = zw.x; fsRipple.z = zw.z;
            fsFx(fsDeal('sniff'), 0.8, null); fsFx('u5sournote', 0.8, null); fsFx('u5ripple', 0.8, null);
            if (kit && kit.chill) { kit.chill(0.3, { secs: 0.5, tint: 'sour' }); FS5.chillK = -1; FS5.chillHold = 0.9; }
            break; }
          case 'drawn': for (const p of st.prai) if (p.st === 'coming' || p.st === 'pressing') { const w = fsW(p.x, p.z); fsFx(fsDeal('strain'), 0.55, w.x, w.z); break; } break;
          case 'lend': { const pw = cast.pho ? cast.pho.group.position : null; fsFx('u5lend', 0.8, pw ? pw.x : null, pw ? pw.z : null); break; }
          case 'lendEnd': { const zw = cast.zav ? cast.zav.group.position : null; fsFx('u5lendback', 0.8, zw ? zw.x : null, zw ? zw.z : null); break; }
          case 'waveReady': fsFx('u5waveready', 0.8, null); break;
          case 'windup': { const pw = cast.pho ? cast.pho.group.position : null; fsFx('u5windup', 0.8, pw ? pw.x : null, pw ? pw.z : null); fsFx('u5robe', 0.8, pw ? pw.x : null, pw ? pw.z : null);
            fsPhoAct('wave', FN5.windSecs || 1.5); break; }
          case 'wave': fsFx('u5wave', 1.0, null); if (kit && kit.flash) kit.flash({ color: '#FFD27A', secs: 0.22 }); FS5.flared = false; fsPhoRelease('wave'); break;
          case 'broken': { const pw = cast.pho ? cast.pho.group.position : null; fsFx('u5wavebreak', 0.8, pw ? pw.x : null, pw ? pw.z : null); fsPhoCut('wave'); break; }
          case 'gathered': { const p = st.prai[e.id - 1]; fsStreak(p, e.by === 'wave');
            /* (the manifest's: gathered by the gold, drawn and its note; by the bag, the bag's snap and its note: the bag's
               drawing was heard at its press) */
            if (e.by === 'bag') { fsFx('u5bagsnap', 0.8, RITE.bag.x, RITE.bag.z); fsPhoRelease('bag'); } else fsFx(fsDeal('drawn'), 0.8, null);
            const n = Math.max(1, Math.min(9, 9 - e.left)); fsFx(FS_DEAL.note[n - 1], 0.7, null);
            if (FS5.pick === 'p' + e.id) FS5.pick = null;
            break; }
          case 'bag': { const p = st.prai[e.id - 1]; fsStreak(p, false); const pw = cast.pho ? cast.pho.group.position : null; fsFx('u5baginhale', 0.8, pw ? pw.x : null, pw ? pw.z : null);
            { const w = p ? fsW(p.x, p.z) : null; fsFx(fsDeal('drawn'), 0.8, w ? w.x : null, w ? w.z : null); } fsPhoAct('bag'); break; }
          case 'enter': { const p = st.prai[e.id - 1], w = p ? fsW(p.x, p.z) : null; if (w) fsFx(fsDeal('rise'), 0.8, w.x, w.z); break; }
          case 'state': fsState(e); break;
          case 'reach': { const p = st.prai[e.id - 1], w = p ? fsW(p.x, p.z) : null; fsFx(fsDeal('gather'), 0.8, w ? w.x : null, w ? w.z : null); break; }
          case 'rise': { const p = st.prai[e.id - 1], w = p ? fsW(p.x, p.z) : null; fsFx('u5unrise', 0.8, w ? w.x : null, w ? w.z : null); break; }
          case 'cageBreak': { const zw = cast.zav ? cast.zav.group.position : null; fsFx('u5cagecrack', 0.8, zw ? zw.x : null, zw ? zw.z : null); fsFx('u5stagger', 0.8, zw ? zw.x : null, zw ? zw.z : null); break; }
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
      fsRipple.t = -1; for (const Pf of fsPuffs) Pf.t = -1; FS5.flare = 0; FS5.flared = false;
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
      if (st.stage !== 'brief' && st.stage !== 'lost' && st.stage !== 'won' && st.stage !== 'naga') fsStep(input, dt);
      /* (the rules and the engine must agree on who is played: a switch the engine made inside the rules' last instant of
         lock is told to the rules again on the next frame) */
      if (st.stage === 'learn' || st.stage === 'fight') { const rw = st.who === 'pho' ? 'pho' : 'zavier'; if (rw !== played && !FS5.swNeed) FS5.swNeed = true; }
      /* 4. where the rules stopped him, he stops: the played one set back to the rules' place; the other moved by the rules */
      const playedNow = kit.tagState().played === 'zavier' ? 'zavier' : 'pho';
      for (const who of ['pho', 'zavier']) {
        const B = who === 'pho' ? phoB : zavB, R2 = who === 'pho' ? st.pho : st.zav, k2 = who === 'pho' ? 'pho' : 'zav'; if (!B) continue;
        const w = fsW(R2.x, R2.z), off = Math.hypot(w.x - B.x, w.z - B.z);
        if (who === playedNow) { if (off > 0.012 && st.stage !== 'brief') kit.tagPlace(who, w.x, w.z); }
        else { if (off > 0.004) kit.tagPlace(who, w.x, w.z); if (who === 'pho') FS5.aiPace.pho = dt > 0 ? off / dt : 0; }
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
      fsBodyTake(cast.pho, 'pho', played === 'pho' ? (phoB ? phoB.v : 0) : (FS5.aiPace.pho || 0), wdt);
      fsBodyTake(cast.zav, 'zav', played === 'zavier' ? (zavB ? zavB.v : 0) : 0, wdt);
      fsSteps();
      const zw = cast.zav ? cast.zav.group.position : null, pw = cast.pho ? cast.pho.group.position : null;
      /* the cage: round him, or round his teacher while it is lent; its strength its brightness; cracked when broken or in the surge */
      const c = st.cage, at = c.lent > 0 ? pw : zw;
      /* (lent, it lifts off him and closes round his teacher: it travels there, 0.4 s, and back) */
      if (at) { const C0 = FS5.cageAt || (FS5.cageAt = { x: at.x, z: at.z }), q = 1 - Math.exp(-wdt / 0.12);
        C0.x += (at.x - C0.x) * q; C0.z += (at.z - C0.z) * q;
        CAGE5.set({ k: c.broken ? 0.12 : Math.max(0.12, c.str / (FN5.cageMax || 100)), x: C0.x, z: C0.z, t: FS5.wall, crack: c.broken || st.stage === 'surge' }); }
      TRANCE5.set(1, FS5.wall); TRANCE5.pools(c.lent > 0 ? null : zw, pw, 1, 1);
      const wind = st.pho.wind > 0 ? 1 - st.pho.wind / (FN5.windSecs || 1.5) : 0;
      TRANCE5.gold(Math.min(1.8, 1 + 0.8 * wind));
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
    FS5.aiPace = { pho: 0 };
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
    /* what a probe and the walk test read (stage.snap().story.fight) */
    function fightSnap() {
      const st = FS5.st, left = { fxOn: FSG.visible, fx: FSG.children.reduce((n, o) => n + (o.visible ? 1 : 0), 0), loops: fsLoops.size, stems: FS5.stemsOn,
                                  praiShown: PRAI5.list.reduce((n, P) => n + (P.group.visible ? 1 : 0), 0) };
      if (!st) return Object.assign({ on: FS5.on }, left);
      const H = FIGHT.hud(st);
      return { on: FS5.on, mode: FS5.mode, brief: FS5.brief, stage: st.stage, who: st.who, left: st.left, losses: st.losses, sanity: +st.sanity.toFixed(2),
               t: +st.t.toFixed(2), need: st.cur ? { id: st.cur.id, act: st.cur.act, target: st.cur.target, ready: st.cur.ready, move: st.cur.move } : null,
               hud: { main: H.main, second: H.second, third: H.third, swap: H.swap, together: H.together, objective: H.objective, cage: H.cage },
               pho: { x: +st.pho.x.toFixed(3), z: +st.pho.z.toFixed(3) }, zav: { x: +st.zav.x.toFixed(3), z: +st.zav.z.toFixed(3) },
               prai: st.prai.map(p => ({ id: p.id, kind: p.kind, st: p.st, x: +p.x.toFixed(2), z: +p.z.toFixed(2) })), pick: FS5.pick,
               stats: Object.assign({}, st.stats), lines: FS5.heard.slice(-12), act: FS5.act ? FS5.act.kind : null, phoTake: cast.pho ? cast.pho.cur : null, ...left };
    }
    function fightReset() {
      FS5.run++;
      if (FS5.brief && kit && kit.abortEvent) kit.abortEvent();           // (the brief's own answer then finds a new run, and does nothing)
      if (FS5.on) fightLeave();
      fsLoopsStop(); fsFxClear(); FSG.visible = false;
      Object.assign(FS5, { on: false, st: null, mode: false, brief: false, live: false, lastT: 0, q: null, pick: null, wall: 0, wonAt: -1, done: false,
        hudSig: '', obj: null, objKey: '', film: false, losses: 0, rand: null, flare: 0, flared: false, drainSnd: 0, reached: 0, chillK: -1, chillHold: 0,
        swNeed: false, stemsOn: false, lastLine: '', card: null, cardAt: 0, lostAt: 0, retrying: false, cageAt: null, m8: null, act: null, actN: 0, waits: {} });
      FS5.heard.length = 0; FS5.last.pho = null; FS5.last.zav = null; FS5.faceT.pho = FS5.faceT.zavier = 0; FS5.aiPace.pho = 0;
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
        if (!r || r.aborted) { if (FS5.st.stage === 'brief' && getState() === 'play') fightBrief(); return; }
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
