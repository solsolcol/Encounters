
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
          /* (v25.3) his hands measured from their own vertices, his chest's and his head's rest turns, his neck (waiHands);
             the points his wrists were carried to by the drivers' solver are gone with it (armSolve) */
          waiHands(P);
          /* (v25.2) his back's three bones (the lean is shared down them), the lean laid on before the look (preLook);
             (v25.3) his arms solved, his hands turned and what he holds carried after the look and the bow (after) */
          const bone = (re) => { let r = null; P.model.traverse(b => { if (!r && b.isBone && re.test(b.name)) r = b; }); return r; };
          P.spines = [bone(/Spine(_\d+)?$/), bone(/Spine1(_\d+)?$/), P.spine];
          P.spineQ = [new THREE.Quaternion(), new THREE.Quaternion()]; P.spineHeld = [false, false];
          P.preLook = lcPreLook;
          P.after = bodyAfter;
        } });
      cast.pong = mkPerson('e4pong', { parent: worldS, x: PSTOOL.x, z: PSTOOL.z, ry: PONG_RY, height: 1.7, sizeTake: 'Idle_4',
        posture: 'sit', stand: 'Idle_4', sit: 'Sit_Upright', talk: 'Talk_with_Right_Hand_Open', seatH: 0.71, seatFloor: 0, feet: true,
        look: 0.9, noMip: true, hidden: true });
      cast.goldman = mkPerson('staffman', { parent: worldS, x: -3.2, z: 9.95, ry: Math.PI, height: 1.66, sizeTake: 'Idle_9', posture: 'stand', stand: 'Idle_9', walk: false, look: 0, noShadow: true });
      cast.mallA = mkPerson('sitwoman', { parent: worldS, x: 3.4, z: 4.15, ry: -Math.PI / 2, height: 1.56, anims: 'wifewalk', sizeTake: 'Walking', posture: 'stand', stand: 'Walking', look: 0, noShadow: true, hidden: true });
      cast.mallB = mkPerson('sitangry', { parent: worldS, x: 4.0, z: 6.9, ry: -Math.PI / 2, height: 1.7, anims: 'fatherwalk', sizeTake: 'Walking', posture: 'stand', stand: 'Walking', look: 0, noShadow: true, hidden: true });
      /* (v25.5, Chad: "when the female customer asks a question, there is no female customer in that cut scene, can you add
         one?" ... "when customer asks about the amulet, there is no customer, add the customer") THE WOMAN AT HIS COUNTER,
         in the opening film and in ending D. A STAND-IN, declared (DATA.reuse), until Chad's model for her lands
         (docs/E4-MODELS.md lists it as NEEDED). Only the films place her (b_build4: openFrame, endD).
         (11 Nov 2026, Chad, of the Yin shop's keeper who wore the part first: "Dont use the yin amulet shoplady. Use
         another women model.") The auntie of episode 1 chapter 3's paper table: a neighbourhood auntie in a floral
         blouse and her own sandals, as a woman who asks a shop "from which temple ah?" is. Her standing take is her
         own (Stand_and_Chat: arms down, her weight shifting, no gesture to speak of), her talk is her own at a third
         (Talk_Passionately opens both arms wide at full weight: photographed), and her walk was made for her as the
         mall's two passers-by got theirs (the admin tee's Walking retargeted onto her rig in world space, the clip
         alone: `grannywalk`, masters/v25.5/make.sh), with her arms brought in: the take as it is holds both arms out
         and swings a hand to the waist, a young man's march on an auntie (seen in the film, then photographed large
         from the front, the side and behind at four moments of the stride) */
      cast.woman = mkPerson('granny', { parent: worldS, x: -0.65, z: -0.92, ry: Math.PI, height: 1.55, anims: 'grannywalk', sizeTake: 'Stand_and_Chat',
        posture: 'stand', stand: 'Stand_and_Chat', walk: 'Walking', talk: 'Talk_Passionately', talkWeight: 0.3, look: 0, noShadow: true, hidden: true,
        then: centreStand });
    }
    /* (v25.5: the shoes drawn onto the Yin shop's keeper for this part, she being barefoot in her own house, went with
       her on 11 Nov; the auntie wears her own sandals)
       HER STANDING TAKE, BROUGHT ONTO HER MARK. Stand_and_Chat holds her hips half a metre off her own origin (measured
       in the film: her group at -0.65, -0.92, her hips at -1.01, -0.54), so she stood away from the counter and the
       shot that looks at her face looked across the shop; and her walk, made for her, is on the origin, so a body
       centred by its `centre` option (v24.5, for a figure who never walks) would have slid that half metre as she
       turned to go. The take's own Hips track is moved instead: its mean place brought over her group's middle, flat
       along the floor, in the track's own numbers (through the hips' parent, whatever turn or scale her armature
       holds), on the copy mkPerson's lower layer plays (lowerOnly clones the clip: her file and the shared clip are
       untouched). Standing and walking then share one place */
    const _csA = new THREE.Vector3(), _csB = new THREE.Vector3(), _csM = new THREE.Matrix4();
    function centreStand(P) {
      const a = P.L && P.L.standLo, tr = a && a.getClip().tracks.find(q => /Hips(_\d+)?\.position$/.test(q.name));
      if (!tr || !P.hips || !P.hips.parent) { console.warn('centreStand: no hips track to centre for ' + P.key); return; }
      const v = tr.values, n = v.length / 3; let ax = 0, ay = 0, az = 0;
      for (let i = 0; i < n; i++) { ax += v[i * 3]; ay += v[i * 3 + 1]; az += v[i * 3 + 2]; }
      ax /= n; ay /= n; az /= n;
      P.group.updateMatrixWorld(true);
      /* where the take's mean hips stand, in her group's frame (x and z are the floor); the step back to its middle */
      _csA.set(ax, ay, az).applyMatrix4(P.hips.parent.matrixWorld); P.group.worldToLocal(_csA);
      /* that step, as the difference of two points carried from her group's frame into the hips' parent's */
      _csM.copy(P.hips.parent.matrixWorld).invert().multiply(P.group.matrixWorld);
      _csB.set(-_csA.x, 0, -_csA.z).applyMatrix4(_csM); _csA.set(0, 0, 0).applyMatrix4(_csM); _csB.sub(_csA);
      for (let i = 0; i < n; i++) { v[i * 3] += _csB.x; v[i * 3 + 1] += _csB.y; v[i * 3 + 2] += _csB.z; }
    }
    /* HIS HANDS AND HIS BODY (Lersi Chin has no take for a wai, a reach or a bowl held; his rig has one joint to a hand
       and no fingers, so every pose is one a flat hand can make).
       (v25.0) his wrists carried onto points by the drivers' arm solver. (v25.2) one choreography per film, said each
       frame as a pure function of its clock (lcBody): where each hand is, how far he leans over his crossed legs, what
       he holds; every change on a minimum-jerk curve (ez5: a reach's speed rises and falls as a person's does).
       (v25.3, Chad, 10 Nov 2026, with v25.2's wai on his phone: "Look at how ridiculous this looks, and you said it
       looks natural, unbelievable") What was wrong, each MEASURED on his file before anything was moved
       (masters/v25.3/measure.cjs, hinge.cjs, twist.cjs, prof.cjs):
       - HIS ELBOW IS A HINGE AND WAS NOT SOLVED AS ONE. In every key of his twelve takes the forearm's line stays in one
         plane of the upper arm's frame (0.0 to 0.4 degrees out of it, flexing 3 to 145). The drivers' solver (armTo)
         turns the forearm onto the wrist by the shortest arc, which bends it out of that plane: an elbow bent sideways.
         His arms are solved here instead (armSolve): the elbow placed by its pole, the upper arm turned so its line
         runs to the elbow AND its hinge lies square to the arm's plane (the shoulder rolls, as a shoulder does), the
         forearm flexed about that hinge onto the wrist.
       - HIS FOREARM NEVER ROLLS. In his own takes the forearm joint's roll about its own line is one number in every
         key (18.15 degrees on his left, -17.54 on his right); the wrist does all the turning (to 100 degrees and
         more). v25.2 gave the forearm 70 % of a hand's turn: a twist at the elbow no take of his has. The forearm keeps
         his takes' roll and the hand turns at the wrist.
       - THE PALMS WERE NEVER PRESSED. The wrists stood 2.8 cm either side of his middle with the hands upright; but
         his hand is thick at the heel and thin at the fingers (its palm side stands 4 cm off the wrist's line at the
         bracelet and 1 cm at the fingertips), so the fingers stood 4 cm apart, and from beside him they read as two
         hands side by side. Each hand's palm side is measured from its own vertices (waiHands: the line it rests on,
         as on a table) and the two are laid against one plane: bracelet to bracelet, fingertips to fingertips, each
         hand leaning in by what its own shape asks (12 and 14 degrees).
       - THE WAI HAD NO FACE IN IT. The joined hands were carried to a point before his chest however high they went,
         his head upright behind them: a man hiding his face. A wai is measured on the face (the thumbs to the brow
         for the Buddha and for one's teachers) and the head and the back bow to MEET the hands. The high wai is placed
         from his head as it is drawn that frame (after his look and his bow), his thumbs' tips at his brow; the wai at
         his chest from his chest as it is (its own turn, not his feet's), the heels of his hands resting on him.
       - THE ELBOWS WENT STRAIGHT DOWN under hands at his middle, so both forearms stood upright and together before
         his chest. They hang beside his ribs: each pose's pole is in his chest's own frame.
       - THE BOWL WAS NOT HELD: two flat hands hung at its sides, fingers down. It is cradled: each palm under the curve
         of its belly, where the model's side slopes 47 degrees (measured), the fingers round it. And a thing raised in
         respect lies on both upturned palms (`cup`), not between pressed ones.
       The frame's order: his take; the lean down his back and his neck (preLook); the look; the bow; then, his head and
       his chest where they will be drawn, each hand's place and turn, the arms solved, the hands turned and what he
       holds carried (after). Every turn of ours is undone before the mixer runs again (the v11.5 law) */
    const _wv = new THREE.Vector3(), _wq = new THREE.Quaternion(), _wF = new THREE.Vector3(), _wN = new THREE.Vector3(), _wX = new THREE.Vector3();
    const _wMw = new THREE.Matrix4(), _wMl = new THREE.Matrix4(), _wqT = new THREE.Quaternion(), _wqP = new THREE.Quaternion();
    const _wa = new THREE.Vector3(), _wb = new THREE.Vector3();
    const lerpN = (a, b, k) => a + (b - a) * k;
    const HAND_BINS = 24;
    function waiHands(P) {
      const sks = []; P.model.traverse(m => { if (m.isSkinnedMesh) sks.push(m); });
      if (!sks.length) return;
      const bones = sks[0].skeleton.bones, inv = sks[0].skeleton.boneInverses;
      const idx = (re) => bones.findIndex(b => re.test(b.name));
      const bindAt = (i) => new THREE.Vector3().setFromMatrixPosition(new THREE.Matrix4().copy(inv[i]).invert());
      const hip = idx(/Hips(_\d+)?$/);
      /* (v25.3) a part's own axes as it is drawn (his left, up, forward), whatever his take has done to it: its joint's
         turn now against its turn at rest in the model's own axes (partAxes). And his neck, which shares a bow */
      const restInv = (b) => { const i = bones.indexOf(b); if (i < 0) return null;
        const q = new THREE.Quaternion(); new THREE.Matrix4().copy(inv[i]).invert().decompose(new THREE.Vector3(), q, new THREE.Vector3()); return q.invert(); };
      P.restInv = { chest: P.spine ? restInv(P.spine) : null, head: P.head ? restInv(P.head) : null };
      P.neckB = bones[idx(/Neck(_\d+)?$/)] || null; P.neckQ = new THREE.Quaternion(); P.neckHeld = false;
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
        /* (v25.3) THE HAND AS A THING, from those vertices, in the joint's own units (`mpu`, metres to a unit, is read off
           the drawn joint the first time it is wanted): along the fingers (s), across (w), out of the palm (h) */
        const C = pts.map(p => [p.dot(fL), p.dot(xL), p.dot(nL)]);
        let len = 0; for (const c of C) len = Math.max(len, c[0]);
        /* the four fingers' band across: the width of the last fifth of its length */
        let w0 = Infinity, w1 = -Infinity;
        for (const c of C) if (c[0] > 0.8 * len) { w0 = Math.min(w0, c[1]); w1 = Math.max(w1, c[1]); }
        /* the thumb: the lobe standing outside that band, on the side that stands out further; its tip the point of it
           furthest along the fingers */
        let below = 0, above = 0;
        for (const c of C) { below = Math.max(below, w0 - c[1]); above = Math.max(above, c[1] - w1); }
        const tSide = above > below ? 1 : -1, tMin = 0.3 * (w1 - w0), thumb = [0.6 * len, tSide > 0 ? w1 + tMin : w0 - tMin];
        let tBest = 0;
        for (const c of C) { const out = tSide > 0 ? c[1] - w1 : w0 - c[1]; if (out > tMin && c[0] > tBest) { tBest = c[0]; thumb[0] = c[0]; thumb[1] = c[1]; } }
        /* the palm side over that band, by steps of its length; and the line it RESTS on, as a hand laid palm down on a
           table rests on its heel and its fingers' pads: the edge of that profile's hull that lies over the hand's
           middle (h = a + b s) */
        const Hs = new Array(HAND_BINS).fill(-Infinity);
        for (const c of C) { if (c[1] < w0 || c[1] > w1 || c[0] < 0) continue;
          const i = Math.min(HAND_BINS - 1, Math.floor(c[0] / len * HAND_BINS)); if (c[2] > Hs[i]) Hs[i] = c[2]; }
        const sAt = (i) => (i + 0.5) * len / HAND_BINS, mid = 0.5 * len, tol = 0.002 * len;
        let sup = null;
        for (let i = 0; i < HAND_BINS && !sup; i++) {
          if (!(Hs[i] > -Infinity) || sAt(i) > mid) continue;
          for (let j = HAND_BINS - 1; j > i && !sup; j--) {
            if (!(Hs[j] > -Infinity) || sAt(j) < mid) continue;
            const sb = (Hs[j] - Hs[i]) / (sAt(j) - sAt(i)), sa = Hs[i] - sb * sAt(i);
            let ok = true;
            for (let q = 0; q < HAND_BINS && ok; q++) if (Hs[q] > sa + sb * sAt(q) + tol) ok = false;
            if (ok) sup = { a: sa, b: sb, s0: sAt(i) };
          }
        }
        if (!sup) sup = { a: 0.2 * len, b: -0.2, s0: 0.1 * len };
        const pI = Math.floor(0.34 * HAND_BINS);
        P.waiHand[sd] = { bone: bones[hi], fL, nL, xL, q0: new THREE.Quaternion(), wrote: false, mpu: 0, alignS: 0, alignU: 0,
                          len, band: [w0, w1], tSide, thumb, sup, palm: [sAt(pI), Hs[pI] > -Infinity ? Hs[pI] : sup.a + sup.b * sAt(pI)],
                          /* the palm side's height at a share k of its length (its own profile; the resting line where a step has no point) */
                          hAt: (k) => { const q = Math.max(0, Math.min(HAND_BINS - 1, Math.floor(k * HAND_BINS))); return Hs[q] > -Infinity ? Hs[q] : sup.a + sup.b * sAt(q); } };
      }
      /* the two hands laid on each other: each slid along its fingers so the fingertips are level (alignS) and toward its
         thumb so the fingers' bands lie on each other (alignU), by half of what the two differ */
      const HL = P.waiHand.Left, HR = P.waiHand.Right;
      if (HL && HR) for (const H of [HL, HR]) { const O = H === HL ? HR : HL;
        H.alignS = 0.5 * (O.len - H.len);
        H.alignU = 0.5 * (0.5 * (O.band[0] + O.band[1]) * O.tSide - 0.5 * (H.band[0] + H.band[1]) * H.tSide); }
    }
    /* (v25.2) minimum jerk: a share of a move eased so its speed rises and falls as a person's does (no sudden start or
       stop: its first and second rates are nothing at both ends); `ezk` the eased share of [a, b] at t */
    const ez5 = (k) => (k <= 0 ? 0 : k >= 1 ? 1 : k * k * k * (k * (k * 6 - 15) + 10));
    const ezk = (t, a, b) => ez5((t - a) / (b - a));
    /* a value through keys [[t0, t1, v], ...]: each change eased from the value before it, between its two times */
    function keyed(t, v0, keys) {
      let v = v0;
      for (const [a, b, w] of keys) { if (t <= a) break; v = lerpN(v, w, ezk(t, a, b)); }
      return v;
    }
    /* a hand through keys [[t0, t1, spec], ...]: on its way from the spec before (null: his take) to each between its
       two times, holding it after */
    function handKeys(t, keys) {
      let prev = null;
      for (const [a, b, sp] of keys) {
        if (t < a) return prev;
        if (t < b) return { mix: [prev, sp, ezk(t, a, b)] };
        prev = sp;
      }
      return prev;
    }
    /* HIS MOVES' MEASURES (v25.3: every number here was set looking at him full size, from before him, beside him and
       through the film's lens on a phone, never on a contact sheet).
       `pole`: which way each elbow goes, written for his LEFT arm (his left is +x; the right arm's mirrors it): the
       reaches' in his body's frame, the joined and the cupped hands' in his CHEST's (they ride his chest).
       `aim`: a reaching hand's turn, its fingers `f` and its palm `n`, written for his RIGHT hand (the left's mirrors it).
       `palm`: a reach's palm point from the wrist, along the fingers and out of the palm.
       `wai`: the joined hands. `low` and `chest` in his chest's frame from its joint: the heel point's height and how far
       before him (his robe and his belly stand 15 to 18 cm before that joint there, measured), and the fingers' slant
       forward. `brow` in his head's frame: his brow from the head joint (his face's profile, measured), how far the
       thumbs' tips stand off it, and the fingers' lean back toward his forehead. `press`: how far each hand leans in
       past the line it rests on (radians).
       `cup`: the two palms as a tray: their middles apart, each rolled in, toed in and tipped up; how far what lies on it
       sits below the palms' middles (in the trough between them); where the tray is held, up and before him from his
       chest's joint, and from his brow when it is raised.
       `bowl`: the bowl cradled: where each hand bears it, low on its belly, in the bowl's own frame (the model's side as
       fitted, measured: 7.2 cm from its axis at 3.5 cm up, where it faces 57 degrees downward); the palm's way in and
       up; the fingers toed in under it; `at`, how far along the hand the bowl rests (past the palm, at the fingers'
       roots, so the fingers end under its front and the heels lie under its back: borne at the palm's middle, flat
       fingers stood 12 cm out in front of it like a tray's, by photograph); the hand's air off the silver */
    const LCM = {
      pole: { reach: [0.35, -0.75, -0.3], floor: [0.5, -0.3, -0.55], bowl: [0.55, -0.7, -0.35],
              wai: [0.62, -0.74, -0.25], brow: [0.6, -0.78, 0.15], cup: [0.6, -0.72, -0.3] },
      aim: { down: { f: [0.12, -0.45, 0.88], n: [0, -1, 0] }, under: { f: [0.6, -0.1, 0.8], n: [0, 1, 0] } },
      palm: [0.075, 0.022],
      wai: { low: { y: -0.15, z: 0.225, slant: 0.6 }, chest: { y: -0.075, z: 0.2, slant: 0.5 },
             brow: { at: [0, 0.106, 0.118], off: 0.004, back: 0.45 }, press: 0.035 },
      cup: { sep: 0.1, roll: 0.26, toe: 0.2, tip: 0.12, seat: -0.006, chest: [0, -0.03, 0.3], brow: [0, -0.04, 0.15] },
      bowl: { r: 0.072, y: 0.035, z: 0, up: 1.0, toe: 0.35, at: 0.55, off: 0.003 }
    };
    /* his elbow's hinge in the upper arm's own frame, and the roll his forearm keeps about its own line: his takes'
       own, every key of all twelve (masters/v25.3/hinge.cjs, twist.cjs) */
    const HINGE = { Left: new THREE.Vector3(0.740, 0, -0.672).normalize(), Right: new THREE.Vector3(0.734, 0, 0.679).normalize() };
    const FORE_ROLL = { Left: 0.3168, Right: -0.3061 };
    const SPINE_SHARE = [0.45, 0.33, 0.22];                              // the lean down his back: low, middle, upper
    const LCS = { on: false, R: null, L: null, lean: 0, twist: 0, side: 0, neck: 0, holdBy: 'R', holdAt: null };
    /* his hands or his back in an action this frame (a film's lcBody) */
    const lcBusy = () => LCS.on && (Math.abs(LCS.lean) > 0.02 || !!LCS.R || !!LCS.L);
    const hState = () => ({ p: new THREE.Vector3(), k: 0, ak: 0, pole: new THREE.Vector3(), f: new THREE.Vector3(), n: new THREE.Vector3(), bend: 0 });
    const HS = { Left: hState(), Right: hState() }, _hA = hState(), _hB = hState();
    /* a film's word for his body this frame: R and L each a hand: { wai: 'low' | 'chest' | 'brow' } (the joined hands),
       { cup: 'chest' | 'brow' | [x, y, z] } (the two palms a tray, there or at a point of the room), { bowl: 1 } (the
       bowl cradled), { palm: [x, y, z] } or { at: [x, y, z] } (a reach, by the palm or the wrist, with `aim` and `pole`
       its action's names or their own numbers), each with `k`, its share from his take; or { mix: [a, b, u] }, on its
       way from a to b. `lean` (forward), `twist` (his chest turned to his left) and `side` (bent to his left) down his
       back, and `neck` (his neck forward), in radians. `hold`: a thing on his right palm ('R') or on both ('cup'),
       carried there after his arms are solved and turned there by `holdAt(obj, hand)`. null: his take */
    function lcBody(o) {
      LCS.on = !!o;
      LCS.R = (o && o.R) || null; LCS.L = (o && o.L) || null;
      LCS.lean = (o && o.lean) || 0; LCS.twist = (o && o.twist) || 0; LCS.side = (o && o.side) || 0; LCS.neck = (o && o.neck) || 0;
      LCS.holdBy = (o && o.holdBy) || 'R'; LCS.holdAt = (o && o.holdAt) || null;
      const P = cast.lersi; if (!P || !P.ready || !P.arms) return;
      P.holdObj = (o && o.hold) || null;
      if (!o) { P.gripK = 0; P.miss = null; }
    }
    /* v25.0's word for it, kept for the calls that still use it (the cast's API, a phase's rest) */
    function lcPose(mode, k = 1, o = {}) {
      if (!mode || !(k > 0.001)) return lcBody(null);
      const kk = Math.min(1, k);
      if (mode === 'wai') { const w = { wai: 'chest', k: kk }; return lcBody({ R: w, L: w }); }
      if (mode === 'bowl') { const b = { bowl: 1, k: kk }; return lcBody({ R: b, L: b }); }
      return lcBody({ R: { at: o.at, k: kk }, L: o.atL ? { at: o.atL, k: kk } : null, hold: o.hold });
    }
    /* (P.preLook: after his take has posed him, before the look) the lean, the side bend and the twist laid on his take,
       the low back first; and his neck's share of a bow (the head's own is the look's and the bow's, after this) */
    const _sq = new THREE.Quaternion(), _sq2 = new THREE.Quaternion(), _bq = new THREE.Quaternion(), _bqi = new THREE.Quaternion(), _le = new THREE.Euler();
    function bodyTurn(b, ex, ey, ez) {
      b.updateWorldMatrix(true, false); b.getWorldQuaternion(_sq);
      _sq2.setFromEuler(_le.set(ex, ey, ez, 'YXZ'));
      _sq2.premultiply(_bq).multiply(_bqi);                               // his own frame's turn, as a turn in the room
      _sq.premultiply(_sq2);
      b.parent.getWorldQuaternion(_sq2); b.quaternion.copy(_sq2.invert().multiply(_sq));
    }
    function lcPreLook(P) {
      if (!LCS.on) return;
      P.group.updateWorldMatrix(true, false); P.group.getWorldQuaternion(_bq); _bqi.copy(_bq).invert();
      if (P.spines[2] && (LCS.lean || LCS.twist || LCS.side)) {
        for (let i = 0; i < 3; i++) {
          const b = P.spines[i]; if (!b) continue;
          if (i < 2) { P.spineQ[i].copy(b.quaternion); P.spineHeld[i] = true; }
          const sh = SPINE_SHARE[i];
          bodyTurn(b, LCS.lean * sh, LCS.twist * sh, -LCS.side * sh);
        }
        P.spines[2].updateWorldMatrix(false, true);
      }
      if (P.neckB && LCS.neck) {
        P.neckQ.copy(P.neckB.quaternion); P.neckHeld = true;
        bodyTurn(P.neckB, LCS.neck, 0, 0); P.neckB.updateWorldMatrix(false, true);
      }
    }
    /* a part's own axes as it is drawn: his left, up and forward there (_pX, _pY, _pZ) */
    const _pX = new THREE.Vector3(), _pY = new THREE.Vector3(), _pZ = new THREE.Vector3(), _pQ = new THREE.Quaternion();
    function partAxes(bone, rInv) {
      bone.getWorldQuaternion(_pQ); if (rInv) _pQ.multiply(rInv);
      _pX.set(1, 0, 0).applyQuaternion(_pQ); _pY.set(0, 1, 0).applyQuaternion(_pQ); _pZ.set(0, 0, 1).applyQuaternion(_pQ);
    }
    /* an elbow's pole written for his left arm in a part's frame (its axes in _pX, _pY, _pZ), as a way in the room */
    function poleOf(pl, sg, out) { return out.set(0, 0, 0).addScaledVector(_pX, -sg * pl[0]).addScaledVector(_pY, pl[1]).addScaledVector(_pZ, pl[2]).normalize(); }
    function lcHandOf(P, h, sd, out) {
      if (!h) { out.k = out.ak = 0; return out; }
      if (!h.mix) return handSpec(P, h, sd, out);
      const a = h.mix[0], b = h.mix[1], u = h.mix[2];
      if (!a && !b) { out.k = out.ak = 0; return out; }
      if (!a) { handSpec(P, b, sd, out); fromTake(P, sd, out, u); return out; }       // from his take onto b
      if (!b) { handSpec(P, a, sd, out); fromTake(P, sd, out, 1 - u); return out; }   // from a back to his take
      handSpec(P, a, sd, _hA); handSpec(P, b, sd, _hB);
      out.p.lerpVectors(_hA.p, _hB.p, u); out.k = lerpN(_hA.k, _hB.k, u); out.ak = lerpN(_hA.ak, _hB.ak, u);
      out.pole.lerpVectors(_hA.pole, _hB.pole, u).normalize();
      out.f.lerpVectors(_hA.f, _hB.f, u).normalize(); out.n.lerpVectors(_hA.n, _hB.n, u);
      out.n.addScaledVector(out.f, -out.n.dot(out.f)).normalize();
      return out;
    }
    /* THE JOINED HANDS at a place: O the heel point on the plane between the palms, g the fingers' way in that plane, m
       the plane's normal (his left), t the way to his body (the thumbs' way). Each hand is laid against the plane by
       the line its own palm side rests on (waiHands), slid along the fingers so the two hands' fingertips are level
       (his left hand is 9 mm the longer) and across so the fingers' bands lie on each other */
    const _jO = new THREE.Vector3(), _jg = new THREE.Vector3(), _jm = new THREE.Vector3(), _jt = new THREE.Vector3();
    function joined(P, name, sd, out) {
      const W = LCM.wai[name] || LCM.wai.chest, S = P.scale || 1, HL = P.waiHand.Left, HR = P.waiHand.Right, H = P.waiHand[sd];
      const sg = sd === 'Left' ? -1 : 1;
      if (W.at && P.head) {
        /* from his head as it is drawn: his thumbs' tips at his brow, the fingers leaning back to his forehead */
        const sT = 0.5 * (HL.thumb[0] * HL.mpu + HR.thumb[0] * HR.mpu), wT = 0.5 * (Math.abs(HL.thumb[1]) * HL.mpu + Math.abs(HR.thumb[1]) * HR.mpu);
        partAxes(P.head, P.restInv.head);
        _jm.copy(_pX); _jg.copy(_pY).multiplyScalar(Math.cos(W.back)).addScaledVector(_pZ, -Math.sin(W.back)); _jt.crossVectors(_jg, _jm);
        P.head.getWorldPosition(_jO).addScaledVector(_pX, W.at[0] * S).addScaledVector(_pY, W.at[1] * S).addScaledVector(_pZ, (W.at[2] + W.off) * S);
        _jO.addScaledVector(_jg, -sT).addScaledVector(_jt, -wT);
        partAxes(P.spine, P.restInv.chest); poleOf(LCM.pole.brow, sg, out.pole);
      } else {
        /* from his chest as it is drawn: the heel point before it. The fingers stand in his chest's own plane but upright
           in the ROOM, slanted forward by `slant`: sitting, his chest leans 26 degrees over his crossed legs (measured),
           and joined hands that leaned with it pointed at the client like a diver's */
        partAxes(P.spine, P.restInv.chest);
        _jm.copy(_pX); _jt.set(0, 1, 0).addScaledVector(_jm, -_jm.y).normalize(); _wv.crossVectors(_jm, _jt);
        _jg.copy(_jt).multiplyScalar(Math.cos(W.slant)).addScaledVector(_wv, Math.sin(W.slant)); _jt.crossVectors(_jg, _jm);
        P.spine.getWorldPosition(_jO).addScaledVector(_pY, W.y * S).addScaledVector(_pZ, W.z * S);
        poleOf(LCM.pole.wai, sg, out.pole);
      }
      /* each hand leans in a little past its resting line, about its heel: flesh gives, and laid exactly on the line the
         fingertips (which curl back at their ends) stood a centimetre apart, a small V between the hands from before him */
      const b = H.sup.b - LCM.wai.press, c = Math.sqrt(1 + b * b), a = (H.sup.a + LCM.wai.press * H.sup.s0) * H.mpu;
      out.n.copy(_jm).multiplyScalar(sg).addScaledVector(_jg, b).divideScalar(c);
      out.f.copy(_jg).addScaledVector(_jm, -b * sg).divideScalar(c);
      out.p.copy(_jO).addScaledVector(out.n, -a).addScaledVector(_jg, H.alignS * H.mpu).addScaledVector(_jt, H.alignU * H.mpu);
    }
    /* THE TWO PALMS A TRAY at a place (before his chest, before his brow, or over a point of the room): each palm's
       middle half the gap from the tray's middle, its palm up and rolled in, its fingers forward, toed in and tipped
       up. The tray is LEVEL IN THE ROOM wherever it is held (a thing carried on open palms is not tipped off them when
       he bows his head to it): its place is found from his chest's joint or from his brow, and from there up and
       before him in his body's own level frame */
    const _cC = new THREE.Vector3();
    function cupped(P, where, sd, out, dy) {
      const K = LCM.cup, S = P.scale || 1, H = P.waiHand[sd], sg = sd === 'Left' ? -1 : 1;
      let off = null;
      if (Array.isArray(where)) _cC.set(where[0], where[1], where[2]);
      else if (where === 'brow' && P.head) {
        partAxes(P.head, P.restInv.head);
        P.head.getWorldPosition(_cC).addScaledVector(_pY, LCM.wai.brow.at[1] * S).addScaledVector(_pZ, LCM.wai.brow.at[2] * S);
        off = K.brow;
      } else { P.spine.getWorldPosition(_cC); off = K.chest; }
      partAxes(P.group, null);
      if (off) _cC.addScaledVector(_pY, off[1] * S).addScaledVector(_pZ, off[2] * S);
      if (dy) _cC.addScaledVector(_pY, dy);                                // (v25.4) a tall thing is carried lower (`dy`, metres)
      out.n.copy(_pY).multiplyScalar(Math.cos(K.roll)).addScaledVector(_pX, sg * Math.sin(K.roll));
      out.f.copy(_pZ).multiplyScalar(Math.cos(K.toe)).addScaledVector(_pX, sg * Math.sin(K.toe));
      out.f.multiplyScalar(Math.cos(K.tip)).addScaledVector(_pY, Math.sin(K.tip));
      out.f.addScaledVector(out.n, -out.f.dot(out.n)).normalize();
      out.p.copy(_cC).addScaledVector(_pX, -sg * K.sep / 2).addScaledVector(out.f, -H.palm[0] * H.mpu).addScaledVector(out.n, -H.palm[1] * H.mpu);
      partAxes(P.spine, P.restInv.chest); poleOf(LCM.pole.cup, sg, out.pole);
    }
    /* THE BOWL CRADLED: each palm on the curve of its belly, in the bowl's own frame (it is lifted and tipped, and the
       hands go with it): the palm's way in to its axis and up, the fingers forward and toed in round it */
    function cradled(P, sd, out) {
      const B = LCM.bowl, H = P.waiHand[sd], sg = sd === 'Left' ? -1 : 1;
      props.bowl.updateWorldMatrix(true, false); props.bowl.getWorldQuaternion(_pQ);
      out.n.set(sg * Math.cos(B.up), Math.sin(B.up), 0);
      out.f.set(sg * Math.sin(B.toe), 0, Math.cos(B.toe)); out.f.addScaledVector(out.n, -out.f.dot(out.n)).normalize();
      out.n.applyQuaternion(_pQ); out.f.applyQuaternion(_pQ);
      props.bowl.localToWorld(out.p.set(-sg * B.r, B.y, B.z));
      out.p.addScaledVector(out.n, -B.off - H.hAt(B.at) * H.mpu).addScaledVector(out.f, -B.at * H.len * H.mpu);
      partAxes(P.group, null); poleOf(LCM.pole.bowl, sg, out.pole);
    }
    function handSpec(P, h, sd, out) {
      const sg = sd === 'Left' ? -1 : 1;
      out.k = out.ak = h.k == null ? 1 : h.k;
      if (h.wai != null) { joined(P, h.wai, sd, out); return out; }
      if (h.cup != null) { cupped(P, h.cup, sd, out, h.dy || 0); return out; }
      if (h.bowl) { cradled(P, sd, out); return out; }
      /* a reach: the hand's turn and its elbow's side in his body's frame, its palm or its wrist at a point of the room */
      const am = h.aim && typeof h.aim === 'object' ? h.aim : LCM.aim[h.aim || 'down'];
      const pl = Array.isArray(h.pole) ? h.pole : LCM.pole[h.pole || 'reach'];
      partAxes(P.group, null); poleOf(pl, sg, out.pole);
      out.f.set(am.f[0] * sg, am.f[1], am.f[2]).normalize().applyQuaternion(_pQ);
      out.n.set(am.n[0] * sg, am.n[1], am.n[2]).applyQuaternion(_pQ); out.n.addScaledVector(out.f, -out.n.dot(out.f)).normalize();
      if (h.palm) { out.p.set(h.palm[0], h.palm[1], h.palm[2]); out.p.addScaledVector(out.f, -LCM.palm[0]).addScaledVector(out.n, -LCM.palm[1]); }
      else if (h.at) out.p.set(h.at[0], h.at[1], h.at[2]);
      return out;
    }
    /* a hand leaving his take for a place (or coming back to it): its wrist goes straight from where his take holds it
       to the place, its elbow's side from where his take has it to the action's, and the hand's turn over the whole of
       the way. (v25.3) The arm is solved all the way: his takes are hinge-true, so solving for his take's own wrist and
       elbow gives his take's own arm back, and nothing has to be blended from one solver to another */
    const _ra = new THREE.Vector3(), _rb = new THREE.Vector3(), _rw = new THREE.Vector3();
    function fromTake(P, sd, out, w) {
      const A = P.arms[sd]; if (!A) { out.k *= w; out.ak = out.k; return; }
      A.up.updateWorldMatrix(true, true);
      A.up.getWorldPosition(_ra); A.fore.getWorldPosition(_rb); A.hand.getWorldPosition(_rw);
      out.p.lerpVectors(_rw, out.p, w);
      _rw.sub(_ra).normalize(); _rb.sub(_ra); _rb.addScaledVector(_rw, -_rb.dot(_rw));
      if (_rb.lengthSq() > 1e-6) out.pole.lerpVectors(_rb.normalize(), out.pole, w).normalize();
      out.ak = out.k * w;
    }
    /* before the mixer: every turn of ours given back (the hands', the low back's, the neck's; the upper back's, the
       arms' and the head's are given back by peopleTick) */
    function waiUpdate() {
      const P = cast.lersi; if (!P || !P.ready) return;
      if (P.waiHand) for (const sd in P.waiHand) { const H = P.waiHand[sd]; if (H.wrote) { H.bone.quaternion.copy(H.q0); H.wrote = false; } }
      if (P.spineHeld) for (let i = 0; i < 2; i++) if (P.spineHeld[i]) { P.spines[i].quaternion.copy(P.spineQ[i]); P.spineHeld[i] = false; }
      if (P.neckHeld) { P.neckB.quaternion.copy(P.neckQ); P.neckHeld = false; }
    }
    /* ONE ARM SOLVED AS AN ARM (v25.3): the elbow over the target on the pole's side; the upper arm's line to the elbow
       and its hinge square to the arm's plane (the hinge is pole × reach, whatever the bend); the forearm flexed about
       the hinge onto the wrist, keeping his takes' roll. Blended from his take's own turns by k. Answers how far the
       wrist stops short of the target (a reach past his arm's length) */
    const _sS = new THREE.Vector3(), _sT = new THREE.Vector3(), _sP = new THREE.Vector3(), _sU = new THREE.Vector3(), _sH = new THREE.Vector3(),
          _sZ = new THREE.Vector3(), _sV = new THREE.Vector3(), _sY = new THREE.Vector3(0, 1, 0), _sHl = new THREE.Vector3(), _sZl = new THREE.Vector3(),
          _sQ = new THREE.Quaternion(), _sQ2 = new THREE.Quaternion(), _sQp = new THREE.Quaternion();
    function armSolve(A, sd, target, pole, k) {
      A.up.updateWorldMatrix(true, true);
      A.up.getWorldPosition(_sS); A.fore.getWorldPosition(_sU); A.hand.getWorldPosition(_sV);
      const la = _sS.distanceTo(_sU), lb = _sU.distanceTo(_sV);
      _sT.copy(target).sub(_sS); const d0 = _sT.length(); if (d0 < 1e-5 || la < 1e-5 || lb < 1e-5) return 0;
      _sT.divideScalar(d0); const d = THREE.MathUtils.clamp(d0, Math.abs(la - lb) + 1e-3, la + lb - 1e-3);
      _sP.copy(pole).addScaledVector(_sT, -pole.dot(_sT)); if (_sP.lengthSq() < 1e-10) return 0; _sP.normalize();
      const ca = THREE.MathUtils.clamp((la * la + d * d - lb * lb) / (2 * la * d), -1, 1), sa = Math.sqrt(1 - ca * ca);
      _sU.copy(_sT).multiplyScalar(ca).addScaledVector(_sP, sa);          // the upper arm's line
      _sH.crossVectors(_sP, _sT).normalize();                             // the hinge
      _sZ.crossVectors(_sU, _sH);
      _sV.copy(_sT).multiplyScalar(d).addScaledVector(_sU, -la).normalize();   // the forearm's line
      _sHl.copy(HINGE[sd]); _sHl.y = 0; _sHl.normalize(); _sZl.crossVectors(_sY, _sHl);
      _wMw.makeBasis(_sU, _sH, _sZ); _wMl.makeBasis(_sY, _sHl, _sZl).transpose(); _wMw.multiply(_wMl);
      _sQ.setFromRotationMatrix(_wMw);
      A.up.parent.getWorldQuaternion(_sQp); _sQ.premultiply(_sQp.invert());
      _sQ2.setFromAxisAngle(_sHl, Math.acos(THREE.MathUtils.clamp(_sU.dot(_sV), -1, 1))).multiply(_sQp.setFromAxisAngle(_sY, FORE_ROLL[sd]));
      if (k < 0.999) { A.up.quaternion.slerp(_sQ, k); A.fore.quaternion.slerp(_sQ2, k); }
      else { A.up.quaternion.copy(_sQ); A.fore.quaternion.copy(_sQ2); }
      A.up.updateWorldMatrix(false, true);
      return d0 - d;
    }
    /* a point of a hand in the room: `s` along its fingers and `h` out of its palm from the wrist, in its own units */
    function handPoint(H, s, h, out) {
      H.bone.getWorldPosition(out); H.bone.getWorldQuaternion(_wqP);
      _wF.copy(H.fL).applyQuaternion(_wqP); _wN.copy(H.nL).applyQuaternion(_wqP);
      return out.addScaledVector(_wF, s * H.mpu).addScaledVector(_wN, h * H.mpu);
    }
    /* (P.after: his take, his lean, his look and his bow all laid on) each hand's place and turn from his body as it is
       drawn, its arm solved, the hand turned at the wrist (blended from his take by its share); then what he holds
       carried to where it is held */
    function bodyAfter(P) {
      if (!LCS.on || !P.waiHand || !P.arms) { P.miss = null; return; }
      P.group.updateWorldMatrix(true, true);
      for (const sd in P.waiHand) { const H = P.waiHand[sd]; if (!H.mpu) H.mpu = _wv.setFromMatrixScale(H.bone.matrixWorld).x; }
      let miss = 0, kmax = 0;
      for (const sd of ['Left', 'Right']) {
        const H = P.waiHand[sd], S = HS[sd], A = P.arms[sd]; if (!H || !A) continue;
        lcHandOf(P, sd === 'Left' ? LCS.L : LCS.R, sd, S);
        if (!(Math.max(S.k, S.ak) > 0.001)) continue;
        kmax = Math.max(kmax, S.k);
        const short = armSolve(A, sd, S.p, S.pole, S.k);
        _wF.copy(S.f); _wN.copy(S.n); _wX.crossVectors(_wF, _wN);
        _wMw.makeBasis(_wF, _wN, _wX); _wMl.makeBasis(H.fL, H.nL, H.xL).transpose(); _wMw.multiply(_wMl);
        _wqT.setFromRotationMatrix(_wMw);                                    // the hand's turn, in the room
        H.q0.copy(H.bone.quaternion); H.wrote = true;
        H.bone.parent.getWorldQuaternion(_wqP); _wqT.premultiply(_wqP.invert());
        H.bone.quaternion.slerp(_wqT, S.ak);
        H.bone.updateWorldMatrix(false, true);
        /* (a probe's measures: how far a wrist stopped short of where it was sent, at full share; and the wrist's bend,
           the hand's line off the forearm's) */
        if (S.k > 0.98) miss = Math.max(miss, short);
        A.fore.getWorldPosition(_wa); H.bone.getWorldPosition(_wb); _wb.sub(_wa).normalize();
        S.bend = Math.acos(THREE.MathUtils.clamp(_wb.dot(S.f), -1, 1));
      }
      P.gripK = kmax; P.miss = miss;
      const obj = P.holdObj;
      if (obj && obj.parent) {
        const L = P.waiHand.Left, R = P.waiHand.Right;
        if (LCS.holdBy === 'cup' && L && R) { handPoint(L, L.palm[0], L.palm[1], _wa); handPoint(R, R.palm[0], R.palm[1], _wb); _wa.add(_wb).multiplyScalar(0.5); _wa.y += LCM.cup.seat; }
        else if (R) handPoint(R, R.palm[0], R.palm[1], _wa);
        else return;
        obj.parent.updateWorldMatrix(true, false); obj.position.copy(obj.parent.worldToLocal(_wa));
        if (LCS.holdAt && R) LCS.holdAt(obj, R);
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
      knelt: false, bowed: false, bow: null, asked: false, told: '', examined: false, cleared: false, warned: false,
      piece: 'nangkwak', turning: null, packAt: 0
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
        else if (play.asked && !play.told && !play.busy) o = W.objTell;
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
    /* (v25.5, found by the finger play-through at a phone's real size, 390 x 844: the decision's window covers the lower
       half of the screen there, and Lersi Chin, who sits below the eye's level, was behind it from his topknot down.
       Chad's note is about how he looks "when player is choosing options"; on such a phone he could not be seen at
       all, and on a desktop only his topknot) HE IS SEEN WHILE THE CHOICE IS MADE. While the window is open and he
       kneels before him, his look is eased (0.8 s, on the wall clock) so the master's face stands in the clear band
       of THIS screen: under the stats where they lie over the screen's middle (a phone), over the window's top edge
       (its laid-out place: its 40 px rise is a transform), a little below the band's middle so his topknot has room;
       where the band is too short for his head and topknot both (a small phone, a browser's bars), his chin is put
       just over the window's edge instead, so it is his face that shows and his topknot that goes under the stats.
       The yaw comes back onto him too. The look is the player's again the moment the window closes (Step back):
       nothing is put back, so nothing snaps. A screen with no band to speak of (under 48 px) is left as it is; a
       screen turned or resized while the window is up is measured again, and eased onto from where the look is */
    const DEC = { on: false, t0: 0, p0: 0, y0: 0, p1: null, w: 0, h: 0 }, _dcE = new THREE.Vector3();
    function decidePitch() {
      const P = document.querySelector('#decide .panel'); if (!P || !P.offsetHeight) return null;
      const H = window.innerHeight, W = window.innerWidth, S = document.getElementById('stats'), sr = S ? S.getBoundingClientRect() : null;
      const top = sr && sr.width > 0 && sr.left < W / 2 + 50 && sr.right > W / 2 - 50 ? sr.bottom + 8 : H * 0.07;
      const bot = P.offsetTop; if (bot - top < 48) return null;
      const fc = LC_HEAD();
      camera.getWorldPosition(_dcE);
      const tf = Math.tan(camera.fov * Math.PI / 360), hd = Math.hypot(fc[0] - _dcE.x, fc[2] - _dcE.z);
      /* elev: how far above his eye's level a height stands, as an angle; solve: the pitch that draws a height at a
         screen row */
      const elev = (y) => Math.atan2(y - _dcE.y, hd);
      const solve = (y, sy) => elev(y) - Math.atan((H / 2 - sy) / (H / 2) * tf);
      let th = solve(fc[1], top + (bot - top) * 0.55);
      /* (LC_HEAD is his brow: his eyes are 8 cm under it, his chin 20) */
      if (H / 2 - (H / 2) * Math.tan(elev(fc[1] - 0.2) - th) / tf > bot - 8) th = solve(fc[1] - 0.2, bot - 8);
      return Math.max(KNEEL.lo + 0.02, Math.min(KNEEL.hi, th));
    }
    function decideLook(now, st) {
      if (st !== 'decide' || phase !== 'decide' || !play.knelt) { DEC.on = false; return; }
      if (!DEC.on || DEC.w !== window.innerWidth || DEC.h !== window.innerHeight) {
        DEC.on = true; DEC.t0 = now; DEC.p0 = pitch.rotation.x; DEC.y0 = yaw.rotation.y; DEC.p1 = null;
        DEC.w = window.innerWidth; DEC.h = window.innerHeight; }
      if (DEC.p1 == null) { DEC.p1 = decidePitch(); if (DEC.p1 == null) { DEC.t0 = now; return; } }
      const k = smo(c01((now - DEC.t0) / 0.8));
      pitch.rotation.x = lp(DEC.p0, DEC.p1, k);
      yaw.rotation.y = DEC.y0 + angTo(DEC.y0, faceLC()) * k;
    }
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
    const WARM_CLEAR = ['lc2sit', 'lc2tell', 'q2tA', 'lc2tA', 'lc2w1', 'pg2w1', 'x2kneel', 'x2bow'];
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
      /* (v25.4) and the piece is on its shelf, whatever state this phase is applied over (applyPhase covers every phase,
         v7.3): only the clearing's phases and reset() took it back off the cloth, so a jump back to the shop or the night
         from a later beat left it on the master's cloth, hidden with his things (no play makes that jump; a probe did) */
      clothPiece(false); pieceShow(true); lcBlockOn(false);
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
      clothPiece(false); pieceShow(true); lcBlockOn(false);
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
        queueFn(() => { if (live(run)) askTell(); }); });
    }
    /* WHAT HE TELLS HIM (P5, the trial's 5.2): one telling, pressed — what he saw, Lersi Chin's answer, and the trial's lesson
       banked in his own words with its awareness (awareness only: the decision's wisdom is kept for the decision, §2.2 #5).
       (v25.2) The four-card pick is gone at Chad's word ("just have the player tell lersi chin what happened in a
       standradized way. If not i have to review 4 outcomes, on top of another 4 outcomes at the end"): the answer that
       was the trial's best is the telling. A save from before that told B, C or D goes on as told (readMark keeps it). */
    const TELL_AWARE = 9;
    /* (v25.2) the bow's busy ends with his question: the bow holds `busy` from its press through the wai and his two lines,
       and v25.0's pick never asked for it, but the telling's badge and objective wait for it to be clear — so in play
       (not on a Continue, which starts clear) the badge never came and the chapter stood still after the bow (found by the
       finger's play-through on the deployed v25.2 build) */
    function askTell() { play.asked = true; play.busy = false; objectiveFor('clearing'); }
    function tellIt() {
      if (!play.asked || play.told || play.busy) return false;
      const run = play.run;
      play.told = 'A'; play.busy = true; saveMark(); objectiveFor('clearing');
      bank(W.note52A, TELL_AWARE);
      line('q2tA'); queueGap(0.4); line('lc2tA', cast.lersi);
      queueFn(() => { if (live(run)) { play.busy = false; examBegin(); } });
      return true;
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
      /* (v25.2) he begins to pack as it opens (packTick); a Continue lands with him already bent to it */
      play.packAt = wallNow() - (resumed ? 10 : 0);
      if (resumed) after(0.6, openDecision); else openDecision();
    }
    /* the piece he took in chapter 1: on its shelf by the door (which one is his: the bag says, the save keeps it) */
    function pieceShow(on) { for (const k of PIECES) if (props.pieces[k]) props.pieces[k].visible = on && k === play.piece; }
    /* (v25.4) where each piece stood before the cloth, kept in a map and never on the piece's userData: a clone copies
       userData through JSON, and a parent kept there is a circle (a clone asked for after the piece had lain on the
       cloth threw on every frame; no play reaches it, the clones being made on the examination's first frame, but a
       probe that changed the piece between films did) */
    const pieceHome = new WeakMap();
    function clothPiece(on) {
      const pc = props.pieces[play.piece]; if (!pc) return;
      if (on) { if (pc.parent !== props.lcThings) { if (!pieceHome.has(pc)) pieceHome.set(pc, { p: pc.position.clone(), r: pc.rotation.clone(), parent: pc.parent });
                  props.lcThings.add(pc); }
                pc.position.set(props.cloth.position.x, props.clothTop + 0.002, props.cloth.position.z); pc.rotation.set(0, -0.4, 0); pc.visible = true; }
      else { const hm = pieceHome.get(pc); if (hm && pc.parent !== hm.parent) { hm.parent.add(pc); pc.position.copy(hm.p); pc.rotation.copy(hm.r); } }
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
      /* (v25.2) the one telling: pressed from where he kneels, named by the badge, no mark (the kneel spot's own rule) */
      { id: 'tell', pos: { x: LC.x, y: 0.95, z: LC.z }, radius: 3, anyView: true, prompt: W.hotTell, mark: false,
        enabled: () => phase === 'clearing' && play.bowed && play.asked && !play.told && !play.busy && !wDark, onInteract() { return tellIt(); } },
      { id: 'bowhead', pos: { x: LC.x, y: 0.95, z: LC.z }, radius: 3, anyView: true, prompt: W.hotBowHead, mark: false,
        enabled: () => phase === 'clearing' && play.examined && !play.cleared && !play.busy && !wDark, onInteract() { return bowHead(); } }
    ];

    /* ---------------------------------------------------------------- the frame */
    let castLast = 0;
    function updateNotes(dt, t) {
      const now = wallNow();
      const raw = castLast ? Math.max(0, now - castLast) : 0, wdt = Math.min(0.5, raw); castLast = now;
      /* (v25.2) the decision: his packing, play's own (a film's frame sets his body itself) */
      packTick(now);
      waiUpdate();
      peopleTick(now, wdt);                               // the cast's clocks run in films too (v5.19): only their looks wait for play
      shopFrame(now);
      lapTick();
      const st = getState();
      decideLook(now, st);
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
    const bedMix = { mall: 0, night: 0, fogmus: 0, visitmus: 0, mallclear: 0, whisper: 0 };
    /* (v25.0 CP11) a film's own room: films.frame writes it from the film's clock (filmBedAt), films.end takes it off */
    const filmBed = { on: false, mall: 0, night: 0, mallclear: 0, whisper: 0 };
    function mixBeds(wdt, st) {
      if (!(wdt > 0)) return;
      const want = { mall: 0, night: 0, fogmus: 0, visitmus: 0, mallclear: 0, whisper: 0 };
      if (st === 'cine') {
        if (filmBed.on) { want.mall = filmBed.mall; want.night = filmBed.night; want.mallclear = filmBed.mallclear; want.whisper = filmBed.whisper || 0; }
      } else {
        if (phase === 'shop') { want.mall = 0.3; want.fogmus = MUS.fog; }
        else if (phase === 'night') { want.night = 0.3; want.fogmus = MUS.fog * 0.8; }
        else if (phase === 'clearing' || phase === 'decide' || phase === 'visit') {
          want.night = 0.24;
          if (play.cleared) want.visitmus = MUS.visit; else want.fogmus = MUS.fog * 0.5;
        }
      }
      /* (v25.4) THE PIECE'S WHISPER, in play: while it stands on its shelf (the glow's own rule, pieceGlowTick), by how
         near he is to it, and under a voice; to the side the shelf is on (the lens's own right, so no sign is guessed) */
      const sdx = SHELF.x - camera.position.x, sdz = SHELF.z - camera.position.z, sd = Math.hypot(sdx, sdz) || 1;
      if (st !== 'cine' && props.pieceGlow && props.pieceGlow.visible) {
        const k = Math.min(1, Math.max(0, (WHISPER.far - sd) / (WHISPER.far - WHISPER.near)));
        want.whisper = WHISPER.vol * k * k * (3 - 2 * k) * (speak.voiceTo > dayClock.t ? WHISPER.under : 1);
      }
      for (const k in bedMix) bedMix[k] += (want[k] - bedMix[k]) * (1 - Math.exp(-wdt / (k === 'fogmus' || k === 'visitmus' ? 2.5 : k === 'whisper' ? 0.3 : 0.9)));
      const B2 = DATA.ambience.beds;
      B2[0][1] = bedMix.mall; B2[1][1] = bedMix.night; B2[2][1] = bedMix.fogmus; B2[3][1] = bedMix.visitmus;
      B2[4][1] = bedMix.mallclear;
      camera.updateMatrixWorld(); const ce = camera.matrixWorld.elements;
      B2[5][1] = bedMix.whisper; B2[5][2] = Math.max(-0.8, Math.min(0.8, (sdx * ce[0] + sdz * ce[2]) / sd * 0.8));
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
      if (play.bowed) { after(0.6, () => { if (!play.told) askTell(); }); return; }
    }
