
//@@COPY 4502-5047

    /* ---- THE CAST (§3.5). Lersi Chin is Chad's own (`lersichin`, v24.38: his own twelve takes); Pong is Chad's
       (`e4pong`, declared reuse); the goldsmith's man and the two passers-by are the same mall's people chapter 1 cast
       (declared reuse), seen only at noon, a corridor away and blurred by the fog. Nobody is a block figure (v21.16); a
       failed download costs a person, never the chapter (v4.7). */
    const cast = {};
    /* his standing rest: he has no idle of his own (§6.1), so a talking take's quiet stretch is his rest — its opening
       frame, hands low, parked; it breathes on the cross-legged sit, which is a loop of his own */
    const LC_STAND = 'Talk_with_Hands_Open', LC_STAND_AT = 0.05;
    const MAT_TOP = 0.012;                                                       // the woven mat's top over the tiles
    const PONG_RY = Math.atan2(MAT.x - PSTOOL.x, MAT.z - PSTOOL.z);              // Pong on his stool, turned to the mat
    function buildCast() {
      cast.lersi = mkPerson('lersichin', { parent: worldS, x: LC.x, z: LC.z, ry: 0, height: 1.68, sizeTake: 'Walking',
        posture: 'sit', sit: 'Sit_Cross_Legged_on_Floor', stand: LC_STAND, walk: 'Walking', talk: 'Sitting_Answering_Questions', talkHead: false,
        seatH: MAT_TOP, seatFloor: 0.004, look: 1, noMip: true, hidden: true,
        grip: { pole: [0.35, -0.6, -0.15] },
        then: (P) => {
          for (const k of ['standLo', 'standUp']) if (P.L[k]) { P.L[k].time = LC_STAND_AT; P.L[k].setEffectiveTimeScale(0); }
          P.waiGrip = { Left: new THREE.Object3D(), Right: new THREE.Object3D() };
          for (const sd in P.waiGrip) P.group.add(P.waiGrip[sd]);
          P.reach = { Left: new THREE.Object3D(), Right: new THREE.Object3D() }; P.reachR = { Right: P.reach.Right };
          for (const sd in P.reach) worldS.add(P.reach[sd]);
          P.bowlGrip = { Left: new THREE.Object3D(), Right: new THREE.Object3D() };
          if (props.bowl) { P.bowlGrip.Left.position.set(0.118, 0.07, 0); P.bowlGrip.Right.position.set(-0.118, 0.07, 0); props.bowl.add(P.bowlGrip.Left, P.bowlGrip.Right); }
          waiHands(P);
          P.after = waiAfter;
        } });
      cast.pong = mkPerson('e4pong', { parent: worldS, x: PSTOOL.x, z: PSTOOL.z, ry: PONG_RY, height: 1.7, sizeTake: 'Idle_4',
        posture: 'sit', stand: 'Idle_4', sit: 'Sit_Upright', talk: 'Talk_with_Right_Hand_Open', seatH: 0.71, seatFloor: 0, feet: true,
        look: 0.9, noMip: true, hidden: true });
      cast.goldman = mkPerson('staffman', { parent: worldS, x: -3.2, z: 9.95, ry: Math.PI, height: 1.66, sizeTake: 'Idle_9', posture: 'stand', stand: 'Idle_9', walk: false, look: 0, noShadow: true });
      cast.mallA = mkPerson('sitwoman', { parent: worldS, x: 3.4, z: 4.15, ry: -Math.PI / 2, height: 1.56, anims: 'wifewalk', sizeTake: 'Walking', posture: 'stand', stand: 'Walking', look: 0, noShadow: true, hidden: true });
      cast.mallB = mkPerson('sitangry', { parent: worldS, x: 4.0, z: 6.9, ry: -Math.PI / 2, height: 1.7, anims: 'fatherwalk', sizeTake: 'Walking', posture: 'stand', stand: 'Walking', look: 0, noShadow: true, hidden: true });
    }
    /* HIS HANDS (Lersi Chin has no take for a wai, a reach or a bowl held): his wrists carried onto points by the arm
       solver the drivers use (armTo), blended from where his take holds them by `k` (gripTick's P.gripK, v25.0). In a wai
       each hand is turned fingers up and palm to the middle (waiAfter; the palm found from the hand's own vertices at its
       bind, since his rig has no finger bones). The wai's points ride his group, set each frame from his chest (the spine
       bone, last frame's); a reach's and a bowl's are in the world. A thing he holds rides his hand, or the middle of the
       two in a wai; let go, it goes home. Every pose is undone before the mixer runs again (the v11.5 law) */
    const _wv = new THREE.Vector3(), _wq = new THREE.Quaternion(), _wF = new THREE.Vector3(), _wN = new THREE.Vector3(), _wX = new THREE.Vector3();
    const _wMw = new THREE.Matrix4(), _wMl = new THREE.Matrix4(), _wqT = new THREE.Quaternion(), _wqP = new THREE.Quaternion();
    const _wa = new THREE.Vector3(), _wb = new THREE.Vector3();
    const lerpN = (a, b, k) => a + (b - a) * k;
    function waiHands(P) {
      const sks = []; P.model.traverse(m => { if (m.isSkinnedMesh) sks.push(m); });
      if (!sks.length) return;
      const bones = sks[0].skeleton.bones, inv = sks[0].skeleton.boneInverses;
      const idx = (re) => bones.findIndex(b => re.test(b.name));
      const bindAt = (i) => new THREE.Vector3().setFromMatrixPosition(new THREE.Matrix4().copy(inv[i]).invert());
      const hip = idx(/Hips(_\d+)?$/);
      P.waiHand = {};
      for (const sd of ['Left', 'Right']) {
        const hi = idx(new RegExp(sd + 'Hand(_\\d+)?$')), ti = idx(new RegExp(sd + 'HandMiddle\\d(_\\d+)?$'));
        if (hi < 0) continue;
        const Hinv = inv[hi];
        const fL = ti >= 0 ? bindAt(ti).applyMatrix4(Hinv).normalize() : new THREE.Vector3(0, 1, 0);
        /* the hand's own vertices (each one's heaviest bone the hand or its end), in the hand's frame at its bind */
        const pts = [], v = new THREE.Vector3(), M2 = new THREE.Matrix4();
        for (const sk of sks) {
          const sb = sk.skeleton.bones, h2 = sb.indexOf(bones[hi]), t2 = ti >= 0 ? sb.indexOf(bones[ti]) : -1; if (h2 < 0) continue;
          M2.multiplyMatrices(sk.skeleton.boneInverses[h2], sk.bindMatrix);
          const pos = sk.geometry.attributes.position, si = sk.geometry.attributes.skinIndex, sw = sk.geometry.attributes.skinWeight;
          if (!si || !sw) continue;
          for (let i = 0; i < pos.count; i++) {
            let bi = -1, bw = 0;
            for (let c = 0; c < 4; c++) { const w = sw.getComponent(i, c); if (w > bw) { bw = w; bi = si.getComponent(i, c); } }
            if (bi !== h2 && bi !== t2) continue;
            pts.push(v.fromBufferAttribute(pos, i).applyMatrix4(M2).clone());
          }
        }
        if (pts.length < 12) continue;
        /* the palm's normal: the thinnest way across the hand, square to the fingers (a 2 × 2 spread, its minor axis),
           turned to face the body at the bind (an A-pose's palms face the thighs) */
        const c0 = new THREE.Vector3(); for (const p of pts) c0.add(p); c0.divideScalar(pts.length);
        const u = new THREE.Vector3(1, 0, 0); if (Math.abs(u.dot(fL)) > 0.9) u.set(0, 0, 1);
        u.addScaledVector(fL, -u.dot(fL)).normalize(); const w2 = new THREE.Vector3().crossVectors(fL, u);
        let a = 0, b = 0, cc = 0;
        for (const p of pts) { const dx = p.x - c0.x, dy = p.y - c0.y, dz = p.z - c0.z, px = dx * u.x + dy * u.y + dz * u.z, py = dx * w2.x + dy * w2.y + dz * w2.z; a += px * px; b += px * py; cc += py * py; }
        const th = 0.5 * Math.atan2(2 * b, a - cc) + Math.PI / 2;
        const nL = u.clone().multiplyScalar(Math.cos(th)).addScaledVector(w2, Math.sin(th)).normalize();
        if (hip >= 0 && nL.dot(bindAt(hip).applyMatrix4(Hinv)) < 0) nL.negate();
        const xL = new THREE.Vector3().crossVectors(fL, nL);
        P.waiHand[sd] = { bone: bones[hi], fL, nL, xL, q0: new THREE.Quaternion(), wrote: false };
      }
    }
    function holdHome(obj) {
      const h = obj && obj.userData.holdHome; if (!h) return;
      if (obj.parent !== h.parent) h.parent.add(obj);
      obj.position.copy(h.p); obj.rotation.copy(h.r);
    }
    function lcPose(mode, k = 1, o = {}) {
      const P = cast.lersi; if (!P || !P.ready || !P.arms || !P.waiGrip) return;
      const kk = Math.max(0, Math.min(1, k)), on = !!mode && kk > 0.001;
      const hold = on ? (o.hold || null) : null;
      if (P.holdObj && P.holdObj !== hold) holdHome(P.holdObj);
      if (hold && !hold.userData.holdHome) hold.userData.holdHome = { parent: hold.parent, p: hold.position.clone(), r: hold.rotation.clone() };
      P.holdObj = hold;
      if (!on) { P.grip = null; P.gripK = 0; P.waiOn = false; return; }
      P.gripK = kk; P.waiOn = mode === 'wai'; P.waiLift = o.lift || 0;
      if (mode === 'wai') P.grip = P.waiGrip;
      else if (mode === 'bowl') P.grip = P.bowlGrip;
      else {
        worldS.updateWorldMatrix(true, false);
        P.reach.Right.position.copy(worldS.worldToLocal(_wv.set(o.at[0], o.at[1], o.at[2])));
        if (o.atL) P.reach.Left.position.copy(worldS.worldToLocal(_wv.set(o.atL[0], o.atL[1], o.atL[2])));
        P.grip = o.atL ? P.reach : P.reachR;
      }
    }
    /* before the mixer: the hands' turns given back, and the wai's two points set from his chest */
    function waiUpdate() {
      const P = cast.lersi; if (!P || !P.ready) return;
      if (P.waiHand) for (const sd in P.waiHand) { const H = P.waiHand[sd]; if (H.wrote) { H.bone.quaternion.copy(H.q0); H.wrote = false; } }
      if (!P.grip || P.grip !== P.waiGrip || !P.spine) return;
      P.spine.getWorldPosition(_wv); P.group.worldToLocal(_wv);
      const L = P.waiLift || 0, y = _wv.y + lerpN(-0.05, 0.13, L), z = _wv.z + lerpN(0.2, 0.15, L);
      P.waiGrip.Left.position.set(_wv.x + 0.028, y, z);
      P.waiGrip.Right.position.set(_wv.x - 0.028, y, z);
    }
    /* after the arms are solved (P.after): the hands turned for a wai, and what he holds carried */
    function waiAfter(P) {
      if (!P.grip || !(P.gripK > 0.001)) return;
      if (P.waiOn && P.waiHand) {
        P.group.getWorldQuaternion(_wq);
        for (const sd in P.waiHand) {
          const H = P.waiHand[sd];
          H.q0.copy(H.bone.quaternion); H.wrote = true;
          _wF.set(0, 1, 0.25).normalize().applyQuaternion(_wq);                       // the fingers up, a little forward
          _wN.set(sd === 'Left' ? -1 : 1, 0, 0).applyQuaternion(_wq);                 // the palm to the middle (his left is +x)
          _wN.addScaledVector(_wF, -_wN.dot(_wF)).normalize();
          _wX.crossVectors(_wF, _wN);
          _wMw.makeBasis(_wF, _wN, _wX); _wMl.makeBasis(H.fL, H.nL, H.xL).transpose(); _wMw.multiply(_wMl);
          _wqT.setFromRotationMatrix(_wMw);
          H.bone.parent.getWorldQuaternion(_wqP); _wqT.premultiply(_wqP.invert());
          H.bone.quaternion.slerp(_wqT, P.gripK);
        }
      }
      const obj = P.holdObj;
      if (obj && P.waiHand && obj.parent) {
        const L = P.waiHand.Left, R = P.waiHand.Right;
        if (P.waiOn && L && R) { L.bone.getWorldPosition(_wa); R.bone.getWorldPosition(_wb); _wa.add(_wb).multiplyScalar(0.5); _wa.y += 0.07; }
        else if (R) { R.bone.getWorldPosition(_wa); R.bone.getWorldQuaternion(_wqP); _wb.copy(R.fL).applyQuaternion(_wqP).multiplyScalar(0.07); _wa.add(_wb); }
        else return;
        obj.parent.updateWorldMatrix(true, false); obj.position.copy(obj.parent.worldToLocal(_wa));
      }
    }

    /* ================================================================ THE PLAY (§4.1, §4.3)
       P1 the wallet (noon) → P2 the shape by the door (closing time) → P3 the call (a film) → the visit (a film) → P4 the
       kneel and the bow → P5 what he tells him (the 5.2 pick) → P6 the examination (a film) → P7 the clearing (a film,
       the fog lifts) → P8 the warning → the decision. Every beat on the chapter clock (wall time, v7.1), every line
       through the queue, one voice at a time; each beat's receipt in the phase string, so a Continue lands where a
       reload would. */
    const PHASES = ['shop', 'night', 'visit', 'clearing', 'decide'];
    let phase = 'shop';
    let booted = false, preplaced = '';
    const dayClock = { t: 0 };
    let lastWall = 0, pausedAt = 0;
    const todo = [];
    function after(secs, fn) { todo.push({ at: dayClock.t + secs, fn }); todo.sort((a, b) => a.at - b.at); }
    function runTodo() { while (todo.length && todo[0].at <= dayClock.t) todo.shift().fn(); }
    function dropTodo() { todo.length = 0; }
    const heard = new Set();
    const speak = { until: 0, pending: null, voiceTo: 0 };
    function speakReset() { speak.until = 0; speak.pending = null; speak.voiceTo = 0; }
    /* A LINE IS A BEAT, HEARD OR NOT (e3c3's law): a muted game speaks it silently on its own length, a line whose bytes
       have not landed is held a moment (v8.0) and then spoken silently — so a beat chained on a line never stops */
    function sayLine(name, vol = 1, onStart, pan) {
      if (dayClock.t < speak.until) return false;
      const start = () => { speak.voiceTo = dayClock.t + (SECS[name] || 2.5); speak.until = speak.voiceTo + 0.25; heard.add(name); if (onStart) onStart(); };
      if ((soundOff && soundOff()) || !worldSfx) { start(); return true; }
      if (worldSfx(name, vol, 1, pan)) { start(); return true; }
      speak.pending = { name, vol, start, pan, give: dayClock.t + 1.6 };
      speak.until = dayClock.t + 0.2;
      return true;
    }
    function runSpeak() {
      const q = speak.pending;
      if (!q || dayClock.t < speak.until) return;
      if (dayClock.t > q.give || (soundOff && soundOff())) { speak.pending = null; q.start(); return; }
      if (worldSfx(q.name, q.vol, 1, q.pan)) { speak.pending = null; q.start(); }
      else speak.until = dayClock.t + 0.2;
    }
    const lineQ = [];
    function queueLine(name, onStart, vol = 1, pan = 0) { lineQ.push({ name, onStart, vol, pan }); }
    function queueFn(fn) { lineQ.push({ fn }); }
    function queueGap(gap) { lineQ.push({ gap }); }
    function runQueue() {
      if (!lineQ.length || speak.pending || dayClock.t < speak.until) return;
      const q = lineQ.shift();
      if (q.fn) { q.fn(); return; }
      if (q.gap) { speak.until = dayClock.t + q.gap; return; }
      sayLine(q.name, q.vol, q.onStart, q.pan);
    }
    /* one line, its speaker on his talking take for the line's own length */
    function line(name, P, vol = 1) { queueLine(name, () => { if (P) personTalk(P, (SECS[name] || 2.5) * 0.92); }, vol); }

    const W = DATA.words;
    const play = {
      run: 0, busy: false,
      searched: new Set(), wallet: false,                                   // P1
      shapeSeen: false, revealed: false, how: '', watchAt: 0, noteOn: false, // P2 (how: 'light' | 'watch' | 'walk')
      knelt: false, bowed: false, bow: null, told: '', examined: false, cleared: false, warned: false,
      piece: 'nangkwak', turning: null
    };
    const PIECES = ['nangkwak', 'takrut', 'phayant'];
    /* THE RECEIPT IS THE PHASE STRING (v7.3): every beat that counts, so a Continue lands where it was */
    function mark() {
      const t = [];
      /* (v25.0 CP13) one letter for each way he met the shape, as readMark reads them: 'watch' and 'walk' both begin with
         w, so a walk was saved as a watch and a Continue lit the shop it had left dark (found by the finger's play-through
         that walked up to it) */
      if (play.how) t.push('h' + ({ light: 'l', watch: 'w', walk: 'k' }[play.how] || ''));
      if (play.revealed) t.push('r');
      if (play.knelt) t.push('k');
      if (play.bowed) t.push('b');
      if (play.told) t.push('t' + play.told);
      if (play.examined) t.push('x');
      if (play.cleared) t.push('c');
      t.push('p' + play.piece);
      return t.join(',');
    }
    function readMark(p0) {
      const [p1, tag = ''] = String(p0 || '').split(':');
      const p = PHASES.includes(p1) ? p1 : 'shop', f = new Set(tag.split(',').filter(Boolean));
      const how = f.has('hl') ? 'light' : f.has('hw') ? 'watch' : f.has('hk') ? 'walk' : '';
      const told = ['A', 'B', 'C', 'D'].find(k => f.has('t' + k)) || '';
      const piece = PIECES.find(k => f.has('p' + k)) || '';
      return { p, how, told, piece, revealed: f.has('r'), knelt: f.has('k'), bowed: f.has('b'), examined: f.has('x'), cleared: f.has('c') };
    }
    let worldRun = 0, wDark = false, decOpen = false;
    function setPhase(p, opts) { phase = p; if (kit) kit.setPhase(p + ':' + mark()); objectiveFor(p, opts); }
    function saveMark() { if (kit) kit.setPhase(phase + ':' + mark()); }        // a beat inside a phase banks its receipt the moment it counts
    /* the orders (§4.1, §4.3). `complete: false` where the change is not his doing (the v8.7 lie) */
    function objectiveFor(p, opts) {
      if (!kit) return;
      if (wDark) { kit.objective(null, { complete: false }); kit.waypoint(null); return; }
      let o = null, wp = null;
      if (p === 'shop') { o = play.wallet ? null : play.objBlur ? null : W.objWallet;
        if (!play.wallet && play.searched.size >= 3) wp = { x: (FRIDGE.x0 + FRIDGE.x1) / 2, y: 1.0, z: FRIDGE.z - 0.1 }; }
      else if (p === 'night') {
        if (!play.shapeSeen) { o = W.objClose; wp = { x: 1.0, y: 1.1, z: SHOP.z1 - 0.15 }; }   // the shutter's pull: the way to it passes the stand
        else if (!play.revealed) o = W.bannerShape;
        else if (play.noteOn) { o = W.objCall; wp = { x: NOTE.x, y: COUNTER.h + 0.25, z: NOTE.z }; }
      }
      else if (p === 'clearing') {
        if (!play.knelt) o = W.objKneel;
        else if (!play.bowed && !play.busy) o = W.objBow;
        else if (play.examined && !play.cleared && !play.busy) o = W.objBowHead;
      }
      kit.objective(o, opts);
      kit.waypoint(wp);
    }
    let lookName = 'DAY';
    function look(name, secs = 0) { if (kit) kit.daylight(PRESETS[name] || null, secs); lookName = name; }
    /* THE FOG in play (§5): the cold's blur and drained colour, grey, and the smear — on, or eased off */
    function fog(on, secs = 1.2) {
      if (!kit) return;
      if (kit.chill) kit.chill(on ? FOG.chill : 0, { secs, tint: 'grey', cine: false });
      if (kit.smear) kit.smear(on ? FOG.smear : 0, { secs });
    }
    function openDecision() { decOpen = true; if (getState() === 'play') startDecision(); }
    /* the receipt is the note (v7.3): a note banked once, whatever a Continue replays — and the awareness with it */
    function bank(note, a = 0) {
      if (!kit || !note) return;
      const got = kit.getConduct ? kit.getConduct().notes : [];
      if (!got.includes(note)) kit.conduct({ note, s: 0, a });
    }
    const live = (run) => alive && run === play.run;
    /* a one-shot that waits for its bytes (a long sound decoded late is still the sound); muted, it is not waited for */
    function sfxReady(name, vol, keep, wait = 3) {
      const run = play.run, t0 = wallNow();
      const go = () => {
        if (!live(run) || (soundOff && soundOff())) return;
        const s2 = worldSfx ? worldSfx(name, vol) : null;
        if (s2) { if (keep) keep(s2); return; }
        if (wallNow() - t0 < wait) setTimeout(go, 100);
      };
      go();
    }
    /* THE SOUNDS PLAY ASKS FOR, warmed so the first of each is heard (CP13 of chapter 1: nothing warmed is silence) */
    const WARM_SHOP = ['q2till', 'q2bag', 'q2jacket', 'q2where', 'q2fridge', 'x2drawer', 'x2bagzip', 'x2cloth', 'x2fridge', 'x2wallet'];
    const WARM_NIGHT = ['q2flowers', 'q2note', 'x2switch', 'x2rustle', 'x2breath', 'x2ledhum', 'x2breathslow'];
    const WARM_CLEAR = ['lc2sit', 'lc2tell', 'q2tA', 'q2tB', 'q2tC', 'q2tD', 'lc2tA', 'lc2tB', 'lc2tC', 'lc2tD', 'lc2w1', 'pg2w1', 'x2kneel', 'x2bow'];
    if (warmSounds) warmSounds(WARM_SHOP.concat(WARM_NIGHT));

    /* ---------------------------------------------------------------- the floor's marks (the kneeling place) */
    const kneelZone = (() => {
      const g = new THREE.Group(); g.position.set(CL.x, MAT_TOP + 0.02, CL.z); g.visible = false; g.userData.dyn = true; worldS.add(g);
      const disc = new THREE.Mesh(new THREE.CircleGeometry(0.4, 32), B({ color: 0xf2c46a, transparent: true, opacity: 0.2, depthWrite: false, fog: false }));
      disc.rotation.x = -Math.PI / 2; g.add(disc);
      const ring = new THREE.Mesh(new THREE.RingGeometry(0.36, 0.43, 40), B({ color: 0xffd98a, transparent: true, opacity: 0.8, depthWrite: false, fog: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide }));
      ring.rotation.x = -Math.PI / 2; ring.position.y = 0.003; g.add(ring);
      const wave = new THREE.Mesh(new THREE.RingGeometry(0.38, 0.43, 40), B({ color: 0xffd98a, transparent: true, opacity: 0.7, depthWrite: false, fog: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide }));
      wave.rotation.x = -Math.PI / 2; wave.position.y = 0.005; g.add(wave);
      g.userData.parts = { disc, ring, wave };
      return g;
    })();
    function zoneTick(now) {
      if (!kneelZone.visible) return;
      const { disc, ring, wave } = kneelZone.userData.parts, k = (now % 2) / 2;
      wave.scale.setScalar(1 + k * 0.9); wave.material.opacity = 0.7 * (1 - k);
      ring.material.opacity = 0.6 + 0.3 * Math.sin(now * 3.1); disc.material.opacity = 0.16 + 0.08 * Math.sin(now * 3.1);
    }
    /* a glide and a turn to a heading, the eye easing to its height (chapter 1's) */
    const smooth = (u) => u * u * (3 - 2 * u);
    function turnTo(to, secs, o, done) {
      play.turning = { t: 0, from: yaw.rotation.y, to, secs, y: o.y, span: o.span, lo: o.lo, hi: o.hi, done,
                       pos: o.pos || null, p0: { x: yaw.position.x, z: yaw.position.z }, pitch: o.pitch, pt0: pitch.rotation.x };
    }
    function turnTick(wdt) {
      const T2 = play.turning; if (!T2) return;
      T2.t += wdt / T2.secs;
      const k = smooth(Math.min(1, T2.t));
      let d = T2.to - T2.from; while (d > Math.PI) d -= Math.PI * 2; while (d < -Math.PI) d += Math.PI * 2;
      yaw.rotation.y = T2.from + d * k;
      if (T2.pos) { yaw.position.x = T2.p0.x + (T2.pos.x - T2.p0.x) * k; yaw.position.z = T2.p0.z + (T2.pos.z - T2.p0.z) * k; }
      if (T2.pitch != null) pitch.rotation.x = T2.pt0 + (T2.pitch - T2.pt0) * k;
      if (kit) kit.pose('lying', { y: T2.y, yaw: yaw.rotation.y, span: 0.02, pitchLo: Math.min(T2.lo, pitch.rotation.x - 0.01), pitchHi: Math.max(T2.hi, pitch.rotation.x + 0.01), secs: 0.9 });
      if (T2.t >= 1) {
        play.turning = null;
        if (kit) kit.pose('lying', { y: T2.y, yaw: T2.to, span: T2.span, pitchLo: T2.lo, pitchHi: T2.hi, secs: 0.05 });
        if (T2.done) T2.done();
      }
    }

    /* ================================================================ P1 · THE WALLET (noon, the fog)
       The till, his bag, his jacket: each shows it is not there, and the order's own words go and come back between them
       (the fog eats the line, never the marker); after the three, the marker shows the drinks fridge — the wallet beside
       the water. No timer, no failure (§4.1 P1) */
    function shopStage() {
      look('DAY', 0); fog(true, 0.01);
      shopCtl.night(false); shopCtl.shutter(1, 0); shopCtl.lights(1, 0); shopCtl.ceiling(1, 0); shopCtl.lap('sales'); shopCtl.phone('');
      for (const P of [cast.lersi, cast.pong]) whenReady(P, (Q) => { Q.group.visible = false; });
      whenReady(cast.goldman, (Q) => { Q.group.visible = true; });
      props.lcThings.visible = false; props.note.visible = true; props.envelope.visible = false;
      pieceShow(true); lcBlockOn(false);
    }
    function shopBegin() {
      shopStage();
      setPhase('shop');
      if (warmSounds) warmSounds(WARM_SHOP);
    }
    const SEARCH = { till: ['q2till', 'x2drawer', (on) => shopCtl.till(on)], bag: ['q2bag', 'x2bagzip', (on) => shopCtl.bag(on)],
                     jacket: ['q2jacket', 'x2cloth', (on) => shopCtl.jacket(on)] };
    function search(k) {
      if (play.busy || play.wallet || play.searched.has(k) || !SEARCH[k]) return false;
      const [ln, fx, act] = SEARCH[k], run = play.run;
      play.busy = true;
      act(true); if (worldSfx) worldSfx(fx, 0.6);
      after(0.7, () => { if (!live(run)) return; line(ln); queueFn(() => {
        if (!live(run)) return;
        act(false); play.searched.add(k); play.busy = false;
        /* the fog eats the order's words and gives them back (never the marker) */
        play.objBlur = true; objectiveFor('shop', { complete: false });
        after(1.3, () => { if (!live(run)) return; play.objBlur = false;
          if (play.searched.size >= 3) { line('q2where'); queueFn(() => { if (live(run)) objectiveFor('shop', { complete: false }); }); }
          else objectiveFor('shop', { complete: false }); });
      }); });
      return true;
    }
    function fridgeOpen() {
      if (play.busy || play.wallet || play.searched.size < 3) return false;
      const run = play.run; play.busy = true;
      shopCtl.fridge(true); if (worldSfx) worldSfx('x2fridge', 0.65);
      after(1.0, () => { if (!live(run)) return; line('q2fridge'); queueFn(() => {
        if (!live(run)) return;
        props.wallet.visible = false; if (worldSfx) worldSfx('x2wallet', 0.6);
        after(0.8, () => { if (!live(run)) return; shopCtl.fridge(false); play.wallet = true; play.busy = false;
          objectiveFor('shop');                                  // done: OBJECTIVE COMPLETE, for the wallet found
          after(2.2, () => { if (live(run)) toNight(); }); });
      }); });
      return true;
    }

    /* ================================================================ P2 · THE SHAPE BY THE DOOR (closing time; the trial's 5.4)
       A cut in the black to closing time: the shutter half down, the ceiling off, the counter's LEDs low, the mall shut.
       He turns from his altar to close up: the Grand Opening stand inside the door is a tall shape in the dark and the
       fog, its ribbons lifting in the air-con's draft. The order gives way to what he sees (it never orders). Three ways,
       all the trial's good answers: switch on the light by the door (check calmly), stand still and watch it (observe and
       wait: the eyes adjust), or walk up to it. Then CALL PONG on the counter */
    function nightStage() {
      look('NIGHT', 0); fog(true, 0.01);
      shopCtl.night(true); shopCtl.shutter(0.42, 0); shopCtl.lights(0.28, 0); shopCtl.ceiling(0, 0); shopCtl.lap(''); shopCtl.phone('');
      for (const P of [cast.lersi, cast.pong, cast.goldman, cast.mallA, cast.mallB]) whenReady(P, (Q) => { Q.group.visible = false; });
      props.lcThings.visible = false; props.note.visible = true; props.wallet.visible = false; props.envelope.visible = false;
      pieceShow(true); lcBlockOn(false);
    }
    function toNight() {
      const run = ++worldRun;
      if (kit) { kit.root(false); kit.fade(1, 0.9); }
      wDark = true; objectiveFor('shop', { complete: false });
      if (worldSfx) after(0.9, () => { if (live(play.run)) worldSfx('x2shutter', 0.5); });   // in the black: the shutter brought half down
      setTimeout(() => {
        if (run !== worldRun || !alive) return;
        nightStage();
        yaw.position.set(HIS.x, yaw.position.y, HIS.z - 0.25); yaw.rotation.y = 0; pitch.rotation.x = 0;   // his back to the shop, at his altar
        if (kit) kit.pose('standing', { secs: 0.05 });
        play.shapeSeen = false; play.revealed = false; play.how = ''; play.noteOn = false;
        setPhase('night', { complete: false });
        const w = kit && kit.warm ? kit.warm() : Promise.resolve(0);
        w.then(() => { if (run !== worldRun || !alive) return; wDark = false; if (kit) kit.fade(0, 1.2); objectiveFor('night', { complete: false }); });
      }, 1100);
      if (warmSounds) warmSounds(WARM_NIGHT);
    }
    function nightBegin(resumed) {
      nightStage();
      /* a resume after the reveal: the light as he left it (switched on, or his eyes used to the dark) */
      if (resumed && play.revealed && play.how === 'light') { look('LIT', 0); shopCtl.lights(1, 0); shopCtl.ceiling(1, 0); }
      else if (resumed && play.revealed && play.how === 'watch') { look('LIT', 0); shopCtl.lights(0.6, 0); }
      setPhase('night', { complete: false });
      if (resumed && play.revealed) afterReveal(true);
    }
    const STAND_HEAD = { x: STAND.x, y: 1.5, z: STAND.z };
    const _nv2 = new THREE.Vector3();
    function nightTick(now) {
      if (play.revealed) return;
      if (!play.shapeSeen) {
        camera.updateMatrixWorld(); _nv2.set(STAND_HEAD.x, STAND_HEAD.y, STAND_HEAD.z).project(camera);
        const near = Math.hypot(yaw.position.x - STAND.x, yaw.position.z - STAND.z) < 2.6;
        /* (v25.0) looked at, not caught at the frame's edge */
        if ((_nv2.z < 1 && Math.abs(_nv2.x) < 0.7 && Math.abs(_nv2.y) < 0.7) || near) {
          play.shapeSeen = true; props.sway = 1;
          const rel = angTo(yaw.rotation.y, Math.atan2(-(STAND.x - yaw.position.x), -(STAND.z - yaw.position.z)));
          if (worldSfx) { worldSfx('x2rustle', 0.55, 1, Math.max(-0.8, Math.min(0.8, -Math.sin(rel) * 0.8))); worldSfx('x2breath', 0.45); }
          after(0.7, () => objectiveFor('night', { complete: false }));
        }
        return;
      }
      /* walked up to it: close enough to see what it is */
      if (!play.busy && Math.hypot(yaw.position.x - STAND.x, yaw.position.z - STAND.z) < 1.15) reveal('walk');
    }
    function reveal(how) {
      if (play.revealed || play.busy) return false;
      const run = play.run; play.busy = true; play.how = how;
      if (how === 'light') { if (worldSfx) { worldSfx('x2switch', 0.7); worldSfx('x2ledhum', 0.35); }
        shopCtl.ceiling(1, 0.25); shopCtl.lights(1, 0.4); look('LIT', 0.35); }
      props.sway = 0;
      after(how === 'light' ? 0.9 : 0.5, () => { if (!live(run)) return;
        line('q2flowers');
        queueFn(() => { if (!live(run)) return; play.revealed = true; play.busy = false; kit && kit.root(false);
          bank(how === 'light' ? W.noteLight : how === 'watch' ? W.noteWatch : W.noteWalk);
          saveMark(); afterReveal(false); }); });
      return true;
    }
    /* STAND STILL AND WATCH (the trial's 5.4 D): he holds still, and for four seconds his eyes adjust — the fog thins a
       little round the dark, the ribbons settle in the draft — and the dried flowers show what the shape is */
    function watch() {
      if (play.revealed || play.busy) return false;
      const run = play.run; play.busy = true;
      if (kit) { kit.root(true); if (kit.chill) kit.chill(FOG.chill * 0.6, { secs: 3.2, tint: 'grey' }); }
      /* (v25.1 F10) the press has its sound: his breath, slowed, as he holds still (four seconds of the beds alone before) */
      if (worldSfx) worldSfx('x2breathslow', 0.4);
      look('LIT', 4.5); shopCtl.lights(0.6, 3.5);
      props.sway = 0.2;
      after(4.0, () => { if (!live(run)) return; play.busy = false; reveal('watch');
        after(2.0, () => { if (live(run) && kit && kit.chill) kit.chill(FOG.chill, { secs: 2.5, tint: 'grey' }); }); });
      return true;
    }
    function afterReveal(resumed) {
      const run = play.run;
      if (!resumed) { line('q2note'); queueFn(() => { if (!live(run)) return; play.noteOn = true; objectiveFor('night', { complete: false }); }); }
      else { play.noteOn = true; objectiveFor('night', { complete: false }); }
    }
    /* THE CALL (§4.1 P3): a film from play; then the visit (a film) the next evening, and the clearing in play */
    function callPong() {
      if (!play.noteOn || play.called || play.busy || !kit || !kit.film) return false;
      play.called = true; play.busy = true;
      const ok = kit.film('call', { onDone: () => { play.busy = false; visitBegin(); } });
      if (!ok) { play.called = false; play.busy = false; }
      return !!ok;
    }
    function visitBegin() {
      setPhase('visit', { complete: false });
      if (warmSounds) warmSounds(WARM_CLEAR);
      const ok = kit && kit.film && kit.film('visit', { onDone: () => clearingBegin(false) });
      if (!ok) clearingBegin(false);
    }

    /* ================================================================ P4–P8 · THE CLEARING, IN HIS SHOP AT NIGHT
       Lersi Chin on his mat before the counter, the altar's Buddha over his shoulder; Pong on a stool at the side. */
    function clearStage(cleared) {
      look(cleared ? 'CLEAR' : 'VISIT', 0); fog(!cleared, 0.01);
      shopCtl.night(true); shopCtl.shutter(0.42, 0); shopCtl.lights(0.9, 0); shopCtl.ceiling(0, 0); shopCtl.lap(''); shopCtl.phone('');
      for (const P of [cast.goldman, cast.mallA, cast.mallB]) whenReady(P, (Q) => { Q.group.visible = false; });
      whenReady(cast.lersi, (P) => { P.group.visible = true; personPut(P, LC.x, LC.z, 0, 0); seatNow(P, true); lcPose(null, 0); });
      lcBlockOn(true);
      whenReady(cast.pong, (P) => { P.group.visible = true; personPut(P, PSTOOL.x, PSTOOL.z, PONG_RY, 0); seatNow(P, true); });
      props.lcThings.visible = true; props.matK = 1; props.note.visible = true; props.wallet.visible = false;
      mayomAt(cleared ? 'mat' : 'bowl');
      pieceShow(!play.examined); props.cloth.userData.piece = play.examined;
      clothPiece(play.examined);
      for (const f of props.flames) f.material.opacity = play.examined ? 1 : 0;
    }
    function clearingBegin(resumed) {
      clearStage(play.cleared);
      if (!resumed) {
        yaw.position.set(-0.95, yaw.position.y, 1.25); yaw.rotation.y = Math.atan2(-(LC.x + 0.95), -(LC.z - 1.25)); pitch.rotation.x = -0.36;
        if (kit) kit.pose('standing', { secs: 0.05 });
        /* the visit film hands over on its black: lifted here, on the room it ended on */
        if (kit && kit.getFade && kit.getFade() > 0.01) kit.fade(0, 1.1);
      }
      kneelZone.visible = !play.knelt;
      setPhase('clearing', { complete: false });
      if (warmSounds) warmSounds(WARM_CLEAR);
      /* the coda's sounds: every ending cues them through one helper (codaCues), so no scene's own source names them and
         the engine's warm scan cannot find them — warmed here, written out, before any ending can play */
      if (warmSounds) warmSounds(['x2codamus', 'q2K1', 'q2K2', 'q2K3', 'q2K4', 'x2scroll', 'x2page', 'x2click', 'x2ping']);
    }
    const seatNow = (P, on) => { if (!P) return; P.seated = !!on; P.sitW = on ? 1 : 0; P.sitOff = null; P.walk = null; };
    function kneel(instant) {
      if (play.knelt && !instant) return false;                     // (a resume kneels him where the save says he knelt)
      play.knelt = true; kneelZone.visible = false;
      if (kit) kit.root(true);
      if (!instant && worldSfx) worldSfx('x2kneel', 0.6);
      if (instant) {
        yaw.position.x = CL.x; yaw.position.z = CL.z; yaw.rotation.y = faceLC(); pitch.rotation.x = -0.06;
        if (kit) kit.pose('lying', { y: KNEEL.y, yaw: faceLC(), span: KNEEL.span, pitchLo: KNEEL.lo, pitchHi: KNEEL.hi, secs: 0.05 });
        return true;
      }
      saveMark(); objectiveFor('clearing');
      turnTo(faceLC(), 1.0, Object.assign({ pos: { x: CL.x, z: CL.z }, pitch: 0.02 }, KNEEL), () => objectiveFor('clearing', { complete: false }));
      return true;
    }
    /* THE BOW (P4): three prostrations to the Buddha, his hands in añjali — the view lowered to the mat three times and
       brought back, laid on his look as a delta and taken off again (v11.1), then a wai to Lersi Chin */
    const BOW = { secs: 7.2, n: 3, depth: 1.0 };
    function bow() {
      if (play.bowed || play.busy || !play.knelt) return false;
      play.busy = true; objectiveFor('clearing');
      if (kit) { kit.pray(true, { secs: 0.9, y: -0.3 });
        kit.pose('lying', { y: KNEEL.y, yaw: faceLC(), span: 0.02, pitchLo: -1.4, pitchHi: KNEEL.hi, secs: 0.3 }); }
      play.bow = { t: 0, prev: 0, run: play.run };
      return true;
    }
    function bowTick(wdt) {
      const Bw = play.bow; if (!Bw) return;
      if (!live(Bw.run)) { play.bow = null; return; }
      const t0 = Bw.t; Bw.t += wdt;
      const one = BOW.secs / BOW.n, u = Math.min(1, Bw.t / BOW.secs);
      const ph = (Bw.t % one) / one, d = -BOW.depth * Math.pow(Math.sin(Math.PI * Math.min(1, ph * 1.15)), 2) * (u < 1 ? 1 : 0);
      pitch.rotation.x += d - Bw.prev; Bw.prev = d;
      for (let k = 0; k < BOW.n; k++) { const at = k * one + one * 0.35; if (t0 < at && Bw.t >= at && worldSfx) worldSfx('x2bow', 0.45); }
      if (u >= 1) {
        pitch.rotation.x -= Bw.prev; play.bow = null;
        if (kit) kit.pose('lying', { y: KNEEL.y, yaw: faceLC(), span: KNEEL.span, pitchLo: KNEEL.lo, pitchHi: KNEEL.hi, secs: 0.3 });
        bowDone();
      }
    }
    function bowDone() {
      const run = play.run;
      play.bowed = true; saveMark();
      /* the wai to Lersi Chin: the clasp held a moment toward him, and lowered; he returns it, then speaks */
      after(0.8, () => { if (!live(run)) return; if (kit) kit.pray(false, { secs: 1.2 });
        line('lc2sit', cast.lersi); queueGap(0.5); line('lc2tell', cast.lersi);
        queueFn(() => { if (live(run)) tellPick(); }); });
    }
    /* WHAT HE TELLS HIM (P5, the trial's 5.2 verbatim): a pick; his line, Lersi Chin's answer, and the trial's lesson banked
       in his own words with its awareness (awareness only: the decision's wisdom is kept for the decision, §2.2 #5) */
    const TELL_A = { A: 9, B: 6, C: 3, D: 6 };
    function tellPick() {
      const run = play.run;
      if (!kit || !kit.pick) { tellAnswer('A'); return; }
      kit.pick([{ id: 'A', label: W.pickA, color: '#3a7a5a' }, { id: 'B', label: W.pickB, color: '#3a5a8a' },
                { id: 'C', label: W.pickC, color: '#8a3a3a' }, { id: 'D', label: W.pickD, color: '#7a6a3a' }],
               { label: W.pickLabel, title: W.pickTitle })
        .then((id) => { if (live(run)) tellAnswer(id || 'A'); });
    }
    function tellAnswer(k) {
      const run = play.run;
      play.told = k; saveMark();
      bank(W['note52' + k], TELL_A[k] || 0);
      line('q2t' + k); queueGap(0.4); line('lc2t' + k, cast.lersi);
      queueFn(() => { if (live(run)) examBegin(); });
    }
    /* THE EXAMINATION (P6, a film) — at its end the piece is on the clean cloth, and out of his bag */
    function examBegin() {
      const run = play.run;
      const ok = kit && kit.film && kit.film('exam', { onDone: () => { if (live(run)) examDone(); } });
      if (!ok) examDone();
    }
    function examDone() {
      play.examined = true; play.busy = false;
      if (kit && kit.has && kit.take) for (const id of PIECES) if (kit.has(id)) kit.take(id);   // set on the cloth for a temple (§2.2 #6)
      pieceShow(false); clothPiece(true);
      for (const f of props.flames) f.material.opacity = 1;
      saveMark(); objectiveFor('clearing', { complete: false });
    }
    /* THE CLEARING (P7, a film he cannot skip the first time: kit.film's noSkip until the chapter is sealed once) */
    function bowHead() {
      if (!play.examined || play.cleared || play.busy || !kit || !kit.film) return false;
      const run = play.run; play.busy = true; objectiveFor('clearing');
      const sealed = ctx.sealedBefore ? ctx.sealedBefore('e4c2') : false;
      const ok = kit.film('clear', { noSkip: !sealed, onDone: () => { if (live(run)) clearDone(); } });
      if (!ok) { play.busy = false; return false; }
      return true;
    }
    function clearDone() {
      play.cleared = true; play.busy = false; saveMark();
      fog(false, 0.01); look('CLEAR', 0);
      warning(false);
    }
    /* THE WARNING (P8): serious and kind; Pong to the shutter to wait outside; the decision opens */
    /* (v25.0 CP13) also from a Continue: the clearing's end is saved (`c`) before the master speaks, so a save in the
       clearing with `c` in it is a save in the warning, and a Continue from it plays the warning again and then opens the
       decision, as the first time (it opened the decision at once, and the warning the fourth answer names was never
       heard; found by the Continue probe) */
    function warning(resumed) {
      const run = play.run;
      after(resumed ? 1.0 : 0.6, () => { if (!live(run)) return;
        line('lc2w1', cast.lersi); queueGap(0.6);
        queueFn(() => { if (!live(run)) return; whenReady(cast.pong, (P) => { personSit(P, false); personWalk(P, [[1.4, 1.6], [0.9, 2.5]], { speed: 0.9, ry: Math.PI }); }); });
        line('pg2w1', cast.pong);
        queueFn(() => { if (live(run)) decideBegin(false); }); });
    }
    function decideBegin(resumed) {
      setPhase('decide', { complete: false });
      if (resumed) after(0.6, openDecision); else openDecision();
    }
    /* the piece he took in chapter 1: on its shelf by the door (which one is his: the bag says, the save keeps it) */
    function pieceShow(on) { for (const k of PIECES) if (props.pieces[k]) props.pieces[k].visible = on && k === play.piece; }
    function clothPiece(on) {
      const pc = props.pieces[play.piece]; if (!pc) return;
      if (on) { if (pc.parent !== props.lcThings) { pc.userData.home = pc.userData.home || { p: pc.position.clone(), r: pc.rotation.clone(), parent: pc.parent };
                  props.lcThings.add(pc); }
                pc.position.set(props.cloth.position.x, props.cloth.position.y + 0.006, props.cloth.position.z); pc.rotation.set(0, -0.4, 0); pc.visible = true; }
      else if (pc.userData.home && pc.parent !== pc.userData.home.parent) { pc.userData.home.parent.add(pc); pc.position.copy(pc.userData.home.p); pc.rotation.copy(pc.userData.home.r); }
    }

    /* ---------------------------------------------------------------- the decision: Lersi Chin, on his mat */
    const _ndc = new THREE.Vector3();
    const INTERACT_R = 3.2;
    const PILE_POS = new THREE.Vector3(LC.x, 0, LC.z);
    const pile = new THREE.Group(); pile.position.copy(PILE_POS); world.add(pile);
    const pileLive = () => decOpen && phase === 'decide';
    function pileDist() { return Math.hypot(yaw.position.x - PILE_POS.x, yaw.position.z - PILE_POS.z); }
    function pileScreen() { camera.updateMatrixWorld(); return _ndc.set(PILE_POS.x, 0.9, PILE_POS.z).project(camera); }
    function pileInView() { if (!pileLive()) return false; const n = pileScreen(); return n.z < 1 && Math.abs(n.x) < 1.1 && Math.abs(n.y) < 1.1; }
    function pointerHitsPile() { return pileLive() && pileDist() < INTERACT_R; }
    function interactPile() { if (!pileLive()) return false; startDecision(); return true; }

    /* ---------------------------------------------------------------- the hotspots */
    const _hv = new THREE.Vector3();
    const markHit = (posF, frac = 0.1) => (x, y) => { const p = posF(); camera.updateMatrixWorld(); _hv.set(p.x, p.y, p.z).project(camera);
      return _hv.z < 1 && Math.hypot(x - _hv.x, (y - _hv.y) / Math.max(0.3, camera.aspect)) < frac; };
    const TILL_AT = { x: TILL.x, y: 1.05, z: TILL.z - 0.12 }, BAG_AT = { x: BAG.x, y: 0.95, z: BAG.z }, JACKET_AT = { x: STOOL.x, y: 1.1, z: STOOL.z };
    const FRIDGE_AT = { x: (FRIDGE.x0 + FRIDGE.x1) / 2, y: 0.95, z: FRIDGE.z - 0.12 }, NOTE_AT = { x: NOTE.x, y: COUNTER.h + 0.2, z: NOTE.z };
    const BUDDHA = { x: 0, y: 1.72, z: SHOP.z0 + 0.12 };
    const hotspots = [
      { id: 'till', pos: TILL_AT, radius: 1.7, prompt: W.hotTill, hits: markHit(() => TILL_AT),
        enabled: () => phase === 'shop' && !play.wallet && !play.busy && !wDark && !play.searched.has('till'), onInteract() { return search('till'); } },
      { id: 'bag', pos: BAG_AT, radius: 1.7, prompt: W.hotBag, hits: markHit(() => BAG_AT),
        enabled: () => phase === 'shop' && !play.wallet && !play.busy && !wDark && !play.searched.has('bag'), onInteract() { return search('bag'); } },
      { id: 'jacket', pos: JACKET_AT, radius: 1.7, prompt: W.hotJacket, hits: markHit(() => JACKET_AT),
        enabled: () => phase === 'shop' && !play.wallet && !play.busy && !wDark && !play.searched.has('jacket'), onInteract() { return search('jacket'); } },
      { id: 'fridge', pos: FRIDGE_AT, radius: 1.7, prompt: W.hotFridge, hits: markHit(() => FRIDGE_AT),
        enabled: () => phase === 'shop' && !play.wallet && !play.busy && !wDark && play.searched.size >= 3, onInteract() { return fridgeOpen(); } },
      { id: 'switch', pos: { x: SWITCH.x + 0.06, y: SWITCH.y + 0.25, z: SWITCH.z }, radius: 1.6, prompt: W.hotSwitch,
        hits: markHit(() => ({ x: SWITCH.x + 0.06, y: SWITCH.y, z: SWITCH.z })),
        enabled: () => phase === 'night' && play.shapeSeen && !play.revealed && !play.busy && !wDark, onInteract() { return reveal('light'); } },
      { id: 'watch', pos: STAND_HEAD, radius: 7, aim: 0.32, pressAim: true, mark: false, prompt: W.hotWatch,
        hits: markHit(() => STAND_HEAD, 0.16),
        enabled: () => phase === 'night' && play.shapeSeen && !play.revealed && !play.busy && !wDark, onInteract() { return watch(); } },
      { id: 'note', pos: NOTE_AT, radius: 1.8, prompt: W.hotNote, hits: markHit(() => NOTE_AT),
        enabled: () => phase === 'night' && play.noteOn && !play.called && !play.busy && !wDark, onInteract() { return callPong(); } },
      { id: 'kneel', pos: { x: CL.x, y: 1.0, z: CL.z }, radius: 2.4, prompt: W.hotKneel, mark: false,
        enabled: () => phase === 'clearing' && !play.knelt && !wDark, onInteract() { return kneel(false); } },
      /* (v25.1 F8) the two presses made kneeling wear no mark (the kneel spot's own rule): each rode 0.55 m over its
         thing, so from the kneeling eye it stood at the very top of the screen, under a phone's stats; both are pressed
         from anywhere, and the badge names them */
      { id: 'bow', pos: BUDDHA, radius: 6, anyView: true, prompt: W.hotBow, mark: false,
        enabled: () => phase === 'clearing' && play.knelt && !play.bowed && !play.busy && !play.turning && !wDark, onInteract() { return bow(); } },
      { id: 'bowhead', pos: { x: LC.x, y: 0.95, z: LC.z }, radius: 3, anyView: true, prompt: W.hotBowHead, mark: false,
        enabled: () => phase === 'clearing' && play.examined && !play.cleared && !play.busy && !wDark, onInteract() { return bowHead(); } }
    ];

    /* ---------------------------------------------------------------- the frame */
    let castLast = 0;
    function updateNotes(dt, t) {
      const now = wallNow();
      const raw = castLast ? Math.max(0, now - castLast) : 0, wdt = Math.min(0.5, raw); castLast = now;
      waiUpdate();
      peopleTick(now, wdt);                               // the cast's clocks run in films too (v5.19): only their looks wait for play
      shopFrame(now);
      lapTick();
      const st = getState();
      mixBeds(Math.min(1, raw), st);
      const liveSt = st === 'play' || st === 'unlock' || st === 'choose';
      if (!booted && !preplaced && kit) { const w0 = preStage(kit.getPhase()); if (w0) preplaced = w0; }
      if (!liveSt) { if (!pausedAt) pausedAt = now; lastWall = 0; return; }
      /* a voice plays on under a panel while the chapter's clock stands still: its booking comes forward by the time
         the panel was up, as far as the voice's own end (e3c3's v21.21 law) */
      if (pausedAt) {
        const away = Math.max(0, now - pausedAt); pausedAt = 0;
        if (speak.voiceTo > dayClock.t) { const cut = Math.min(away, speak.voiceTo - dayClock.t); speak.until -= cut; speak.voiceTo -= cut; }
      }
      if (lastWall) dayClock.t += Math.min(0.5, now - lastWall);
      lastWall = now;
      if (!booted) { booted = true; applyPhase(kit ? kit.getPhase() : null); }
      runTodo(); runSpeak(); runQueue();
      playTick(now, wdt);
    }
    function playTick(now, wdt) {
      zoneTick(now);
      if (getState() !== 'play') return;
      mallPlay(now, phase === 'shop' && !wDark);                 // noon: the mall's people going by outside
      turnTick(wdt); bowTick(wdt);
      if (phase === 'night') nightTick(now);
      if (phase === 'clearing' && !play.knelt && kneelZone.visible && !wDark && Math.hypot(yaw.position.x - CL.x, yaw.position.z - CL.z) < 0.42) kneel(false);
    }
    /* ---- THE BEDS (§3.4): the mall by day (muffled: the fog's), the shop at night (the air-con, the fridge, the empty
       corridor), the fog's own music under play until the clearing, and the visit's after it — each eased; in a film the
       beds go down (every film cues its own sound, written to its pictures). The order is DATA.ambience.beds' */
    const MUS = { fog: 0.32, visit: 0.26 };
    const bedMix = { mall: 0, night: 0, fogmus: 0, visitmus: 0, mallclear: 0 };
    /* (v25.0 CP11) a film's own room: films.frame writes it from the film's clock (filmBedAt), films.end takes it off */
    const filmBed = { on: false, mall: 0, night: 0, mallclear: 0 };
    function mixBeds(wdt, st) {
      if (!(wdt > 0)) return;
      const want = { mall: 0, night: 0, fogmus: 0, visitmus: 0, mallclear: 0 };
      if (st === 'cine') {
        if (filmBed.on) { want.mall = filmBed.mall; want.night = filmBed.night; want.mallclear = filmBed.mallclear; }
      } else {
        if (phase === 'shop') { want.mall = 0.3; want.fogmus = MUS.fog; }
        else if (phase === 'night') { want.night = 0.3; want.fogmus = MUS.fog * 0.8; }
        else if (phase === 'clearing' || phase === 'decide' || phase === 'visit') {
          want.night = 0.24;
          if (play.cleared) want.visitmus = MUS.visit; else want.fogmus = MUS.fog * 0.5;
        }
      }
      for (const k in bedMix) bedMix[k] += (want[k] - bedMix[k]) * (1 - Math.exp(-wdt / (k === 'fogmus' || k === 'visitmus' ? 2.5 : 0.9)));
      const B2 = DATA.ambience.beds;
      B2[0][1] = bedMix.mall; B2[1][1] = bedMix.night; B2[2][1] = bedMix.fogmus; B2[3][1] = bedMix.visitmus;
      B2[4][1] = bedMix.mallclear;
    }
    function updatePile() {}
    function updateFire() {}
    function updateSlow() {}

    /* ------------------------------------------------------------ a resume (§9)
       A CONTINUE IS PLACED BEFORE THE CARD (the v4.8 contract): under the chapter card the saved moment's picture is set,
       so nothing jumps when play begins; applyPhase does it all again on the first live frame, idempotently */
    function preStage(p0) {
      const R = readMark(p0);
      if (R.piece) play.piece = R.piece;
      if (R.p === 'night') { nightStage(); yaw.position.set(HIS.x, yaw.position.y, HIS.z - 0.25); yaw.rotation.y = 0; pitch.rotation.x = 0; return 'night'; }
      if (R.p === 'clearing' || R.p === 'decide') {
        play.examined = R.examined; play.cleared = R.cleared || R.p === 'decide';
        clearStage(play.cleared);
        if (R.knelt || R.p === 'decide') { yaw.position.x = CL.x; yaw.position.z = CL.z; yaw.rotation.y = faceLC(); pitch.rotation.x = -0.06;
          if (kit) kit.pose('lying', { y: KNEEL.y, yaw: faceLC(), span: KNEEL.span, pitchLo: KNEEL.lo, pitchHi: KNEEL.hi, secs: 0.05 }); }
        return 'clearing';
      }
      return '';
    }
    function applyPhase(p0) {
      const R = readMark(p0);
      play.piece = R.piece || PIECES.find(k => kit && kit.has && kit.has(k)) || 'nangkwak';
      play.how = R.how; play.revealed = R.revealed; play.told = R.told;
      play.knelt = R.knelt; play.bowed = R.bowed; play.examined = R.examined; play.cleared = R.cleared;
      if (R.p === 'shop') { shopBegin(); return; }
      if (R.p === 'night') { play.shapeSeen = play.revealed; nightBegin(true); return; }
      if (R.p === 'visit') { visitBegin(); return; }
      if (R.p === 'decide') { play.knelt = play.bowed = play.examined = play.cleared = true; play.told = play.told || 'A'; }
      clearingBegin(play.knelt);
      if (play.knelt) kneel(true);
      if (R.p === 'decide') { decideBegin(true); return; }
      if (play.cleared) { warning(true); return; }
      if (play.examined) { objectiveFor('clearing', { complete: false }); return; }
      if (play.told) { after(0.6, examBegin); return; }
      if (play.bowed) { after(0.6, () => tellPick()); return; }
    }
