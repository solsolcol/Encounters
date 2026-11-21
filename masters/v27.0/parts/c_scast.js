    /* ================================================================ THE CAST (the plan's §8; masters/v27.0/people.sh)
       Her family and her teacher's: AMMA in her wheelchair before her altar; RAVI, her son, by the standing fan toward
       her room's window; MALA, her daughter, by the sofa; GRANDMASTER PHO on his stool at her left (a body at a turn of 0
       faces +z, so +x is its left) and, a body of his own as chapter 3's hall had, STANDING BEHIND HER CHAIR for the
       blessing (the two are one model; the one not in the story is hidden, and the swap is made on a cut).
       And four who are not alive, each drawn ONLY through Spirit Vision (ctx.spirit: the vision's own layer, a glowing
       silhouette that the world's pass never draws): the one on her back (crimson), Appa by his photograph (pale blue),
       the hungry ones and the large one of the blessing (green). None of them casts a contact shadow (noBlob): nothing
       of them is in the world.
       Every place is a number the plan or a measure gave (the tracker's log, 18 Nov): the wheelchair's seat 0.44 m, its
       front edge 0.28 ahead of its middle, its footrest 0.10 up from 0.35 to 0.50 ahead; the stool's top 0.445. */
    /* A BODY SAT OR STOOD UP STRAIGHT (o.upright; R42, Chad, 18 Nov 2026: "From the very start of the intro cutscene to the
       gameplay and to the ending cutscene, grandmaster pho has some animations and poses that look unnatural and overly
       hunched with shoulders tightened upwards. Fix it so that he looks more natural."). MEASURED first (tools/probes/
       posture.mjs, on his own body in the takes this chapter has him wear): seated at rest, the first moment of his rise
       from a seat (his hands on his knees) leans his trunk 17.7 degrees forward of the vertical with his neck 27.6 forward,
       the stoop of a man about to push himself up, held as if it were his sitting; his seated talk lifts both collar bones
       25 to 28 degrees over his rest (7.8 and 8.4 cm). A man sitting upright on a stool with his hands on his knees holds
       his trunk within ten degrees of the vertical. So while a take named in o.upright is worn, its trunk is turned back
       about the body's own left-right line by that take's `trunk` degrees (shared out over the three spine bones, so the
       back stays a curve) and its neck by its `head` degrees, weighted by the take's weight (a take fading in or out
       takes its share): a CONSTANT turn per take, so every breath and gesture of the take moves as it did about the new
       stance. Laid after the mixer and the head's damping, before the shoulders and the hands (a hand laid on a knee
       reaches from the shoulder as it now stands: restHands lays it after), taken off by armsBack() before the mixer runs
       again (v11.5), and laid for restHands' own measure of the arms (assemble.py) */
    const _upA = new THREE.Vector3(), _upF = new THREE.Vector3(), _upQ = new THREE.Quaternion(), _upQp = new THREE.Quaternion(), _upV = new THREE.Vector3();
    /* (`hips`: the pelvis turned back about its own joint as a man sits up on his sit bones, each thigh given back the turn
       so his legs lie where they lay (the bow's own way, c_story.js); the whole trunk goes with it as one, so a lean of
       the hips is a lean of the trunk degree for degree. `trunk`: the spine's three bones, shared out. `head`: the neck) */
    function uprightInit(P) {
      const find = (re) => { for (const n in P.bone) if (re.test(n)) return P.bone[n]; return null; };
      const B = [find(/Spine$/), find(/Spine1$/), find(/Spine2$/)], neck = find(/Neck$/), hips = find(/Hips$/), legs = [find(/LeftUpLeg$/), find(/RightUpLeg$/)];
      if (B.some(b => !b) || !neck || !hips || legs.some(b => !b)) { console.warn(P.key + ': o.upright asked, and its spine is not all there'); return; }
      /* (R88: the head and the collar bones too, for a take that names `chest`, `nod` or `clav`) */
      const head = find(/Head$/), clL = find(/LeftShoulder$/), clR = find(/RightShoulder$/);
      P.upr = { hips, legs, spine: B, neck, head, clL, clR, B: [hips].concat(legs, B, [neck], [head, clL, clR].filter(Boolean)).map(b => ({ b, sv: new THREE.Quaternion() })), take: Object.assign({}, P.o.upright), on: false };
      /* (R88: the upper arms, and the drape that hangs beside the left one from the same collar bone, for a take that names `arms`) */
      const arms = [find(/^(mixamorig:?)?LeftArm$/), find(/^(mixamorig:?)?RightArm$/)].filter(Boolean);
      const drapes = clL ? clL.children.filter(c => c.isBone && /^Drape/.test(c.name)) : [];
      P.upr.arms = arms.concat(drapes).map(b => ({ b, sv: new THREE.Quaternion(), pw: new THREE.Quaternion() })); P.upr.ka = 0; P.upr.armsOn = false;
    }
    const _upW0 = new THREE.Quaternion(), _upW1 = new THREE.Quaternion(), _upD = new THREE.Quaternion();
    function uprightLay(P) {
      const U = P.upr; if (!U) return;
      let tr = 0, hd = 0, hp = 0, ch = 0, nd = 0, cl = 0, cr = 0, ka = 0, dl = 0, dr = 0;
      for (const n in U.take) { const w = P.w[n] || 0, T = U.take[n]; if (w > 0) { tr += w * (T.trunk || 0); hd += w * (T.head || 0); hp += w * (T.hips || 0);
        ch += w * (T.chest || 0); nd += w * (T.nod || 0); cl += w * (T.clavL || 0); cr += w * (T.clavR || 0); ka += w * (T.arms || 0); dl += w * (T.dropL || 0); dr += w * (T.dropR || 0); } }
      U.ka = Math.min(1, ka);
      if (Math.abs(tr) < 1e-3 && Math.abs(hd) < 1e-3 && Math.abs(hp) < 1e-3 && Math.abs(ch) < 1e-3 && Math.abs(nd) < 1e-3 && Math.abs(cl) < 1e-3 && Math.abs(cr) < 1e-3 && Math.abs(dl) < 1e-3 && Math.abs(dr) < 1e-3) return;
      for (const R of U.B) R.sv.copy(R.b.quaternion);
      U.on = true;
      P.group.updateWorldMatrix(true, false); P.group.getWorldQuaternion(_upQ);
      _upF.set(0, 0, 1).applyQuaternion(_upQ); _upF.y = 0; _upF.normalize();
      _upA.set(0, 1, 0).cross(_upF).normalize();                       // (a turn about it by a positive angle leans the body forward)
      /* (R88: where each upper arm hangs from before the back is turned: uprightArmsLay hangs it from there again) */
      if (U.ka > 1e-3) for (const A of U.arms) A.b.parent.getWorldQuaternion(A.pw);
      const turn = (b, deg) => { b.parent.updateWorldMatrix(true, false); b.parent.getWorldQuaternion(_upQp);
        _upV.copy(_upA).applyQuaternion(_upQp.invert()); _upQ.setFromAxisAngle(_upV, deg * Math.PI / 180); b.quaternion.premultiply(_upQ); b.updateWorldMatrix(false, true); };
      if (Math.abs(hp) >= 1e-3) { U.hips.getWorldQuaternion(_upW0); turn(U.hips, hp); U.hips.getWorldQuaternion(_upW1);
        _upD.copy(_upW1).invert().multiply(_upW0);                      // (each thigh's turn given back: new hips^-1 * old hips)
        for (const L of U.legs) { L.quaternion.premultiply(_upD); L.updateWorldMatrix(false, true); } }
      if (Math.abs(tr) >= 1e-3) for (const b of U.spine) turn(b, tr / 3);
      /* (R88: the upper back opened: the last two spine bones turned back, two thirds and one third, so the curve between
         the lower back and the upper eases as a back straightening does, not at one joint) */
      if (Math.abs(ch) >= 1e-3) { turn(U.spine[1], ch / 3); turn(U.spine[2], ch * 2 / 3); }
      if (Math.abs(hd) >= 1e-3) turn(U.neck, hd);
      if (Math.abs(nd) >= 1e-3 && U.head) turn(U.head, nd);
      /* (R88: a collar bone drawn back: turned about the vertical, its arm's top carried back with it; a positive turn takes
         either side back) */
      const clav = (b, deg, sgn) => { if (!b || Math.abs(deg) < 1e-3) return; b.parent.updateWorldMatrix(true, false); b.parent.getWorldQuaternion(_upQp);
        _upV.set(0, 1, 0).applyQuaternion(_upQp.invert()); _upQ.setFromAxisAngle(_upV, sgn * deg * Math.PI / 180); b.quaternion.premultiply(_upQ); b.updateWorldMatrix(false, true); };
      clav(U.clL, cl, 1); clav(U.clR, cr, -1);
      /* (R93, Chad, 19 Nov 2026: "And relax his shoulders by moving it down very slightly": each collar bone turned down
         about the body's forward line by `dropL` and `dropR` degrees, its shoulder going down with it; the arms are hung
         again from where the collar bones stood before (uprightArmsLay), so they hang as they did) */
      const drop = (b, deg, sgn) => { if (!b || Math.abs(deg) < 1e-3) return; b.parent.updateWorldMatrix(true, false); b.parent.getWorldQuaternion(_upQp);
        _upV.copy(_upF).applyQuaternion(_upQp.invert()); _upQ.setFromAxisAngle(_upV, sgn * deg * Math.PI / 180); b.quaternion.premultiply(_upQ); b.updateWorldMatrix(false, true); };
      drop(U.clL, dl, -1); drop(U.clR, dr, 1);
    }
    /* THE ARMS LEFT HANGING WHERE THE TAKE HUNG THEM (R88, Chad, 19 Nov 2026: "grandmaster pho's shoulders are still too
       bent forward, make it more natural"). A back straightened by the upright lay carries both upper arms with it, the
       hands swung forward of his thighs: photographed from his side on build 34 at the order to take the holy water, his
       left forearm out ahead of his leg and its hand open before it, as no man stands at ease (a hanging arm hangs by its
       weight, whatever his back does). So where a take names `arms` (by its weight), each upper arm, and the drape that
       hangs beside the left one from the same collar bone, is hung again from where its collar bone stood before the lay
       turned it: the arm keeps the turn it has now (the take's, or the rest the arm's hold gave it), only the turn the lay
       put on the back above it is taken away, so every gesture of the take keeps its aim in the room. Laid after the arm's
       hold and before the knees, the arm let out and the shoulders (which hold the upper arm where it then stands), and
       taken off by armsBack() before the arm's hold is (v11.5) */
    function uprightArmsLay(P) {
      const U = P.upr; if (!U || !U.on || !(U.ka > 1e-3) || !U.arms.length) return;
      for (const A of U.arms) { A.b.parent.getWorldQuaternion(_upQp);
        _upQ.copy(_upQp).invert().multiply(A.pw).multiply(A.b.quaternion);   // (the arm's own turn, hung from where its collar bone stood)
        A.sv.copy(A.b.quaternion); A.b.quaternion.slerp(_upQ, U.ka); }
      for (const A of U.arms) A.b.updateWorldMatrix(false, true);
      U.armsOn = true;
    }
    /* AN ARM HELD AT ITS REST under its cloth (o.armRest; R77, Chad, 18 Nov 2026: "his arms and hands keep clipping into
       his robes in many of his poses"). Grandmaster Pho's left arm is under the drape of his robe, and the drape hangs from
       his collar bone on two bones of its own (DrapeArm, DrapeHang: tools/robeskin.mjs's DRAPE family) baked to follow
       the arm in each take; in his standing talk the take's left hand comes up and in, and the drape, which follows it
       only part of the way, opens on his forearm (photographed: the close's word to the family, skin showing through the
       white at his left side). While a take named in o.armRest.takes is worn, the arm's bones and the drape's are laid at
       their turns in his rest (o.armRest.from: a take and its moment, where the drape covers the arm whole), by that take's
       weight: his left hand hangs at his side under the cloth and his right talks. Laid after the upright lay, taken off
       by armsBack() before the mixer runs again (v11.5). Measured once, from the rest take, when the body lands */
    function armRestInit(P) {
      const O = P.o.armRest, A = P.acts[O.from[0]]; if (!A) { console.warn(P.key + ': o.armRest asked, and no rest take ' + O.from[0]); return; }
      const B = []; for (const n in P.bone) if (O.re.test(n)) B.push({ b: P.bone[n], q: new THREE.Quaternion(), sv: new THREE.Quaternion() });
      if (!B.length) { console.warn(P.key + ': o.armRest asked, and no bone answers it'); return; }
      const keep = {}; for (const k in P.acts) keep[k] = [P.acts[k].time, P.acts[k].getEffectiveWeight()];
      for (const k in P.acts) P.acts[k].setEffectiveWeight(k === O.from[0] ? 1 : 0);
      A.time = Math.min(A.getClip().duration - 1e-3, O.from[1]); P.mixer.update(0);
      for (const R of B) R.q.copy(R.b.quaternion);
      for (const k in keep) { P.acts[k].time = keep[k][0]; P.acts[k].setEffectiveWeight(keep[k][1]); }
      P.mixer.update(0);
      const up = B.find(R => /LeftArm$/.test(R.b.name));
      P.arst = { B, top: up ? up.b.parent : B[0].b.parent, take: Object.assign({}, O.takes), on: false };
    }
    function armRestLay(P) {
      const H = P.arst; if (!H) return;
      let k = 0; for (const n in H.take) k += (P.w[n] || 0) * H.take[n];
      if (!(k > 1e-4)) return;
      k = Math.min(1, k);
      for (const R of H.B) { R.sv.copy(R.b.quaternion); R.b.quaternion.slerp(R.q, k); }
      H.top.updateWorldMatrix(false, true);                // (the collar bone: the arm and the drape both hang from it)
      H.on = true;
    }
    /* HIS LEFT ARM LET HANG A LITTLE OUT FROM HIS SIDE, STANDING (o.armOut; R77, Chad, 18 Nov 2026: "his arms and hands
       keep clipping into his robes in many of his poses"). Photographed standing in the blessing (build 25, four sides,
       the robe's back faces in red, the pixels read back): his left hand hung through the folds of the robe at his hip,
       a strip of white across it seen from his left, and his own forearm showed in a gap of the drape at his waist. Not my
       upright lay (taken off, more of the forearm showed) nor the drape's hanging band (swung 8 and 15 degrees out, back
       and forward on the live build: the strip stayed, it is the robe at his hip). His whole left arm with the drape over
       it (DrapeArm, DrapeHang: the upper arm's brothers under his collar bone), turned out about his forward line, was
       tried at 4, 7 and 10 degrees: at 7 the hand hangs clear of the robe and nothing of it crosses it, the forearm bare
       from the sleeve to the hand, as a robed man's arm hangs at ease (at 4 a streak of the drape still lay on the forearm;
       10 bought nothing more). Laid while a take named in o.armOut.takes is worn (inside its window: the standing end of
       his rise), by its weight, after the knees and before the shoulders (which hold the upper arm where it then stands),
       and taken off by armsBack() before the mixer runs again (v11.5) */
    const _aoQ = new THREE.Quaternion(), _aoP = new THREE.Quaternion(), _aoV = new THREE.Vector3(), _aoR = new THREE.Quaternion();
    function armOutInit(P) {
      const O = P.o.armOut; let up = null;
      for (const n in P.bone) if (/^(mixamorig:?)?LeftArm$/.test(n)) up = P.bone[n];
      if (!up) { console.warn(P.key + ': o.armOut asked, and no left upper arm'); return; }
      const B = [up].concat((O.follow || []).map(n => P.bone[n]).filter(b => b && b.parent === up.parent)).map(b => ({ b, sv: new THREE.Quaternion() }));
      P.aout = { B, take: Object.assign({}, O.takes), win: O.win || {}, rad: (O.deg || 0) * Math.PI / 180, on: false };
    }
    function armOutLay(P) {
      const H = P.aout; if (!H) return;
      let k = 0;
      for (const n in H.take) { const w = P.w[n] || 0; if (!(w > 0)) continue; const W = H.win[n], A = P.acts[n];
        if (W && A && (A.time < W[0] || A.time > W[1])) continue; k += w * H.take[n]; }
      if (!(k > 1e-4)) return;
      k = Math.min(1, k);
      P.group.updateWorldMatrix(true, false); P.group.getWorldQuaternion(_aoQ);
      _aoV.set(0, 0, 1).applyQuaternion(_aoQ);                    // (his forward: a turn about it by a positive angle takes his left arm out)
      const par = H.B[0].b.parent; par.updateWorldMatrix(true, false); par.getWorldQuaternion(_aoP);
      _aoV.applyQuaternion(_aoP.invert());                         // (in the collar bone's frame, which all of them hang from)
      _aoR.setFromAxisAngle(_aoV.normalize(), H.rad * k);
      for (const R of H.B) { R.sv.copy(R.b.quaternion); R.b.quaternion.premultiply(_aoR); }
      par.updateWorldMatrix(false, true);
      H.on = true;
    }
    /* KNEES STRAIGHT STANDING (o.knees; R76, Chad, 18 Nov 2026: "his knees seem bent even when standing"). MEASURED
       (tools/probes/posture.mjs, KNEE, on 21u): standing at rest the legs that are seen (the grafted ones,
       tools/leggraft.mjs) are bent 9.8 and 11.7 degrees, in his talk 12.7 and 12.2; a man standing at ease holds his knees
       within about 5 (the group photograph of the masters at the Wai Kru, masters/v26.0/ref/waikru-8: every one standing
       straight). Near straight a knee's bend is all in the last millimetres of the leg's reach (from 12 degrees to 4 the
       hip rises 4 mm), so while a take named in o.knees is worn (inside its window) his hips are lifted by what brings
       each grafted knee to `bend` degrees, by the take's weight, and both legs reach again to where his feet stood: his
       rig's (which carries his feet) and the grafted one (which is seen), each knee bending forward, each foot keeping
       its turn. Laid after the arm's hold, taken off by armsBack() before the mixer runs again (v11.5) */
    const _kA = new THREE.Vector3(), _kB = new THREE.Vector3(), _kC = new THREE.Vector3(), _kP = new THREE.Vector3(), _kF = new THREE.Vector3(), _kQ = new THREE.Quaternion();
    const _kD = new THREE.Vector3();
    function kneesInit(P) {
      const O = P.o.knees, bone = (re) => { for (const n in P.bone) if (re.test(n)) return P.bone[n]; return null; };
      const hips = bone(/^(mixamorig:?)?Hips$/), S = [];
      for (const sd of ['Left', 'Right']) {
        const up = bone(new RegExp('^(mixamorig:?)?' + sd + 'UpLeg$')), leg = bone(new RegExp('^(mixamorig:?)?' + sd + 'Leg$')), foot = bone(new RegExp('^(mixamorig:?)?' + sd + 'Foot$'));
        const gu = bone(new RegExp('^' + sd + 'LegGraftUp$')), gl = bone(new RegExp('^' + sd + 'LegGraftLow$'));
        if (!up || !leg || !foot || !gu || !gl) { console.warn(P.key + ': o.knees asked, and the ' + sd + ' legs are not all there'); return; }
        /* (the grafted shin's end, at the ankle it was solved to reach: his foot, measured in the shin's own frame) */
        P.group.updateWorldMatrix(true, true); foot.getWorldPosition(_kA); const gEnd = new THREE.Object3D(); gl.add(gEnd); gl.worldToLocal(gEnd.position.copy(_kA));
        S.push({ up, leg, foot, gu, gl, gEnd, T: new THREE.Vector3(), Q: new THREE.Quaternion() });
      }
      if (!hips) return;
      const B = []; for (const sd of S) for (const b of [sd.up, sd.leg, sd.foot, sd.gu, sd.gl]) B.push({ b, sv: new THREE.Quaternion() });
      P.knees = { hips, S, B, hp: new THREE.Vector3(), take: Object.assign({}, O.takes), win: O.win || {}, bend: (O.bend != null ? O.bend : 4) * Math.PI / 180, max: O.max || 0.012, on: false,
        own: O.own != null ? O.own * Math.PI / 180 : null };
    }
    function kneesLay(P) {
      const K = P.knees; if (!K) return;
      let k = 0;
      for (const n in K.take) { const w = P.w[n] || 0; if (!(w > 0)) continue; const W = K.win[n], A = P.acts[n];
        if (W && A && (A.time < W[0] || A.time > W[1])) continue; k += w * K.take[n]; }
      if (!(k > 1e-4)) return;
      k = Math.min(1, k);
      P.group.updateWorldMatrix(true, true);
      let lift = Infinity;
      for (const sd of K.S) {
        sd.foot.getWorldPosition(sd.T); sd.foot.getWorldQuaternion(sd.Q);
        sd.gu.getWorldPosition(_kA); sd.gl.getWorldPosition(_kB); sd.gEnd.getWorldPosition(_kC);
        const a = _kA.distanceTo(_kB), b = _kB.distanceTo(_kC), d = _kA.distanceTo(_kC);
        if (!(d > 0.2)) return;
        const bend = Math.PI - Math.acos(THREE.MathUtils.clamp((a * a + b * b - d * d) / (2 * a * b), -1, 1));
        if (bend > 0.6) return;                                    // (not standing: a knee bent past 34 degrees is left as the take has it)
        const want = Math.sqrt(a * a + b * b + 2 * a * b * Math.cos(K.bend)), up = (_kA.y - _kC.y) / d;
        lift = Math.min(lift, Math.max(0, (want - d) / Math.max(0.5, up)));
      }
      lift = Math.min(lift, K.max) * k;
      if (!(lift > 1e-5) && K.own == null) return;
      if (!(lift > 1e-5)) lift = 0;
      for (const R of K.B) R.sv.copy(R.b.quaternion); K.hp.copy(K.hips.position);
      K.on = true;
      K.hips.getWorldPosition(_kA); _kA.y += lift; K.hips.parent.worldToLocal(_kA); K.hips.position.copy(_kA); K.hips.updateWorldMatrix(false, true);
      const ry = P.group.rotation.y; _kF.set(Math.sin(ry), 0, Math.cos(ry));
      for (const sd of K.S) {
        sd.leg.getWorldPosition(_kP); _kP.addScaledVector(_kF, 0.5);
        /* (R92: his own legs, which his robe follows, are 3.6 to 4.5 cm longer than the grafted ones that are seen, so at
           the same hips and ankles they stood bent 21.6 and 31.1 degrees, the robe pushed forward at the knees, while the
           grafted legs stood at 5.9 and 7.4: measured at the order to take the holy water on build 37. The grafted legs
           cannot reach further, so his hips stay; his own legs reach their ankles on down along the leg until they stand
           at `own` degrees, the ankles the robe's hem hangs from going down with them) */
        let T = sd.T;
        if (K.own != null) { sd.up.getWorldPosition(_kA); const a = _kA.distanceTo(sd.leg.getWorldPosition(_kB)), b = _kB.distanceTo(sd.foot.getWorldPosition(_kC)),
            d = _kA.distanceTo(sd.T), want = Math.sqrt(a * a + b * b + 2 * a * b * Math.cos(K.own));
          if (d > 0.2 && d < want) T = _kD.copy(sd.T).sub(_kA).multiplyScalar(1 + (want / d - 1) * k).add(_kA); }
        armTo({ up: sd.up, fore: sd.leg, hand: sd.foot }, T, _kP);
        sd.foot.parent.getWorldQuaternion(_kQ); sd.foot.quaternion.copy(_kQ.invert().multiply(sd.Q)); sd.foot.updateWorldMatrix(false, true);
        sd.gl.getWorldPosition(_kP); _kP.addScaledVector(_kF, 0.5);
        armTo({ up: sd.gu, fore: sd.gl, hand: sd.gEnd }, sd.T, _kP);
      }
    }
    const cast = {};
    const WHEEL = { seat: 0.44, front: 0.28, foot: 0.10 };
    const STOOL_TOP = 0.445;
    /* chapter 3's numbers for a man set on a seat by his own body (its c_cast.js MASTER_DOWN, PHO_BREATH, PHO_TALK_HEAD,
       each with its reason there): the bottom on the seat, each leg solved down to the floor, the feet laid flat */
    const MASTER_DOWN = { hipOver: 0.11, sink: 0.01, sole: GROUND_SOLE, edge: -9, flat: true };
    const PHO_BREATH = 6;
    /* (R42: his seated rest sat up straight, his pelvis turned back 11 of its 17.7 degrees (to 6.7, a man sitting upright:
       turned at the spine instead, by the same 11 shared out, the trunk came back only 4, measured), his neck as the take
       holds it on the straightened trunk (27.6 less 11: 16.6 forward, his face level); his hands laid on
       his thighs where his arms reach them with the elbow bent (restHands 'lap'), since the trunk's turn carries his
       shoulders back off his knees; his seated talk's shrug let down whole) */
    const PHO_SIT_UPRIGHT = { Sit_to_Stand_Transition_M: { hips: -11, trunk: 0, head: 0 } };
    const PHO_SIT_SHOULDERS = { Sitting_Answering_Questions: 1 };
    /* (R77: the drape over his left arm goes with the arm as his hand is laid on his thigh: assemble.py's K.follow) */
    const PHO_SIT_HANDS = { how: 'lap', follow: { L: ['DrapeArm', 'DrapeHang'] } };
    const PHO_TALK_HEAD = { Sitting_Answering_Questions: [0.3, 'Sit_to_Stand_Transition_M'] };
    /* (standing, his talk's head held as his seated one is: Chad's word on chapter 3's, "greatly restrained", v26.3; its
       head swings 9 cm side to side in its own file: tools/probes/takepath.mjs) */
    const PHO_STAND_HEAD = { Talk_with_Hands_Open: [0.3, 'Sit_to_Stand_Transition_M'] };
    /* (R64, Chad, 18 Nov 2026: "not just pho's sitting posture, but also fix his standing posture, talking posture, and
       other postures he uses in this particular chapter". MEASURED first on his standing body in the takes it wears here
       (tools/probes/posture.mjs, the tracker's log): at rest on the end of his rise his head is held 15.1 degrees back
       of his bind pose's 2.5, in his talk 17.8, a chin raised as if looking down his nose at her (a face tilted up reads
       as disdain, v6.9); his talk lifts his right collar bone 5.3 degrees; his push (the cast's 0.50 to 0.95 s) lifts both
       collar bones 32 and 35 degrees, 9 and 13 cm, his shoulders at his ears. So his neck is turned forward 12 degrees in
       his rest and his talk (back to within a degree of his bind pose), his talk's shoulders let down whole, and his push's
       let down 0.6 of the way, measured over the part of the take he plays: a man who thrusts both hands out does lift
       and bring his shoulders forward, by a little, not to his ears) */
    /* (R76, Chad, 18 Nov 2026: "Grandmaster pho's standing pose and standing talking pose is still hunchbacked and not
       natural". Measured on 21u: his trunk leans 4.3 degrees forward at rest and 5.9 in his talk (8.7 at most); turned
       back by as much, his neck given it back so his face stays where R64 set it) */
    /* (R88, Chad, 19 Nov 2026: "grandmaster pho's shoulders are still too bent forward, make it more natural", with his
       photograph of play from his side. MEASURED on build 33 (tools/probes/posture.mjs LIVE, the blessing, his standing
       body with every lay): his trunk 2.6 degrees from the vertical and his head over his shoulders, but his back bent
       53 degrees between its lower and upper parts, the upper back 20.5 degrees further forward than his own scan's bind
       pose, and his right shoulder's top 10 cm further forward: the rounded back of the photograph. So the upper back is
       opened (`chest`: the last two spine bones turned back), the whole trunk given back the lean that takes away
       (`trunk`), the neck's forward turn eased and the skull's nod given the rest, so his head stays over his shoulders
       and his face where it was (`head`, `nod`), and his right collar bone drawn back (`clavR`). The numbers chosen by
       photographs from his side at several strengths, and measured again: the tracker's log) */
    /* (CHOSEN on build 35's code with the arms' lay (r88b, 19 Nov): photographed from his left at the order to take the holy
       water, four ways, each full size, and laid beside the people standing in line at the offering tables in Chad's own
       photograph 10 of the Wai Kru (upright, the head level over the shoulders, the arms hanging at the sides, the hands
       at the front of the thigh). R76's stance (trunk -4.5, head 16.5) dropped his chin to his chest over a rounded back;
       the opened back without `arms` swung his left forearm out ahead of his thigh, the hand spread (build 34); with
       `arms`, chest -15 and the rest below (V1a) stand as the photograph stands, his upper arm 3.8 degrees behind the
       vertical and his forearm 7.5 forward, the hand at his thigh; chest -20 (V2a) looked the same with his head a
       little further back, and the milder of the two was taken (v22.0: never overshoot). His talk takes the same,
       its own lean kept (its trunk and head one and a half degrees more, as R76 had them)) */
    /* (R93, 19 Nov: his collar bones let down 3 degrees each, "very slightly", standing and talking: chosen beside 5 by
       photographs from his side and from where his shot was taken) */
    const PHO_STAND_UPRIGHT = { Sit_to_Stand_Transition_M: { trunk: 0.5, chest: -15, head: 10, nod: 9, clavR: 10, arms: 1, dropL: 3, dropR: 3 },
      Talk_with_Hands_Open: { trunk: -1, chest: -15, head: 11.5, nod: 9, clavR: 10, arms: 1, dropL: 3, dropR: 3 } };
    /* (R92, 19 Nov: and his own legs, which his robe follows, straightened to 5 degrees at the knee (kneesLay `own`)) */
    const PHO_KNEES = { takes: { Sit_to_Stand_Transition_M: 1, Talk_with_Hands_Open: 1 }, win: { Sit_to_Stand_Transition_M: [5.2, 99] }, bend: 4, max: 0.012, own: 5 };
    const PHO_STAND_SHOULDERS = { Talk_with_Hands_Open: 1, mage_soell_cast_3: 0.6 };
    const PHO_STAND_SHWIN = { mage_soell_cast_3: [0.5, 0.45] };
    /* (R77: his left arm and the drape over it held at his rest's while he talks standing, so the cloth covers the arm) */
    const PHO_ARM_REST = { takes: { Talk_with_Hands_Open: 1 }, from: ['Sit_to_Stand_Transition_M', 6.0],
      re: /^(mixamorig:?)?Left(ForeArm|Hand|Hand(Thumb|Index|Middle|Ring|Pinky)\d)$|^(mixamorig:?)?LeftArm$|^Drape(Arm|Hang)$/ };
    /* (R77: standing, his left arm and the drape over it let hang 7 degrees out from his side, clear of the robe at his hip) */
    const PHO_ARM_OUT = { takes: { Sit_to_Stand_Transition_M: 1, Talk_with_Hands_Open: 1 }, win: { Sit_to_Stand_Transition_M: [5.2, 99] },
      deg: 7, follow: ['DrapeArm', 'DrapeHang'] };
    /* the shoulders let down in every standing and talking take (v26.8, every standing person) */
    const STAND_SHOULDERS = { Idle_3: 1, Stand_and_Chat: 1, Listening_Gesture: 1, Talk_with_Hands_Open: 1, Talk_with_Right_Hand_Open: 1, Walking: 1 };

    /* LOOK D on Grandmaster Pho (Chad's pick, v24.52: "unlit, except for the robe"), chapter 3's own (c_cast.js lookD,
       its reason there): his face, hands and beads laid back at their own colour after the tone mapping, the robe lit.
       `level` is the hour's: under the tube he is lit as the room is (1); by the lamp alone the laid colour is dimmed */
    const phoLook = { k: { value: 1 }, level: { value: 1 }, lift: { value: 0.55 } };
    /* R43 (Chad, 18 Nov 2026: "There are also some skin colour bits on the back of his robe that can be easily seen during
       gameplay"): his body sheet holds small islands of skin colour lying inside the white of the robe, and look D draws
       whatever its test calls skin unlit, so each one stood out of the lit robe as an orange speck (in his file's own lit
       look they show too, fainter). His file is unchanged: the islands (PHO_FLECKS, c_phofleck.js, found in his sheet by
       tools/phoflecks.py) are painted once on a canvas in the colour of the robe round each, and laid over his sheet where
       its colour is read (premultiplied: a cell is the robe's colour, opaque, or nothing). */
    let phoFleckTex = null;
    function phoFleck() {
      if (phoFleckTex) return phoFleckTex;
      const N = PHO_FLECKS.size, cv = document.createElement('canvas'); cv.width = cv.height = N;
      const g = cv.getContext('2d');
      for (const [r, gr, b, R] of PHO_FLECKS.f) { g.fillStyle = `rgb(${r},${gr},${b})`; for (let i = 0; i < R.length; i += 3) g.fillRect(R[i + 1], R[i], R[i + 2], 1); }
      const t = tex(new THREE.CanvasTexture(cv)); t.flipY = false; t.colorSpace = THREE.SRGBColorSpace; t.needsUpdate = true;
      return (phoFleckTex = t);
    }
    function lookD(model) {
      model.traverse(q => { if (!q.isMesh) return;
        const list = [].concat(q.material).map(m0 => { const mt = m0.clone(); mats.push(mt); const WHOLE = /\(face and hands\)$/.test(m0.name);
          mt.onBeforeCompile = (sh) => { sh.uniforms.uK = phoLook.k; sh.uniforms.uLevel = phoLook.level; sh.uniforms.uLift = phoLook.lift;
            if (!WHOLE && mt.map) { sh.uniforms.uFleck = { value: phoFleck() };
              sh.fragmentShader = 'uniform sampler2D uFleck;\n' + sh.fragmentShader.replace('#include <map_fragment>',
                '#include <map_fragment>\n{ vec4 fl = texture2D(uFleck, vMapUv); diffuseColor.rgb = diffuseColor.rgb * (1.0 - fl.a) + fl.rgb * diffuse; }'); }
            sh.fragmentShader = 'uniform float uLevel;\nuniform float uK;\nuniform float uLift;\n' + sh.fragmentShader.replace('#include <tonemapping_fragment>', '#include <tonemapping_fragment>\n'
              + (WHOLE ? 'float skn = 1.0;\n' : 'vec3 sc = pow(max(diffuseColor.rgb, vec3(1e-4)), vec3(1.0 / 2.2)); float mxc = max(sc.r, max(sc.g, sc.b)); float skn = smoothstep(0.12, 0.25, (mxc - min(sc.r, min(sc.g, sc.b))) / max(mxc, 1e-4));\n')
              + 'float kS = clamp(uK * skn, 0.0, 1.0); vec3 unl = diffuseColor.rgb * uLevel;\n'
              + 'gl_FragColor.rgb += (1.0 - kS) * uK * uLift * max(vec3(0.0), unl * 0.9 - gl_FragColor.rgb);\n'
              + 'gl_FragColor.rgb = mix(gl_FragColor.rgb, unl, kS);'); };
          mt.customProgramCacheKey = () => 'phoLookD' + (WHOLE ? ':whole' : ':fleck'); return mt; });
        q.material = Array.isArray(q.material) ? list : list[0]; });
    }

    /* ---------------------------------------------------------------- where each stands (the floor plan's numbers) */
    const AT = {
      ravi: { x: 2.62, z: 2.02 },                       // by the standing fan, her room's window behind him to his left
      mala: { x: 0.95, z: 2.40 },                       // by the sofa's end, beside her mother
      phoS: { x: STOOL.x, z: STOOL.z },                 // his stool at her left
      phoB: { x: CHAIR.x + 0.14, z: CHAIR.z - 0.72 },   // behind her chair, for the blessing: his hips here (18 Nov: his stand
                                                        // took his body 27 cm behind the mark, where his rise from a seat
                                                        // leaves him; `centre` now puts his hips on it, a hand behind her handles)
      appa: { x: 0.95, z: 4.72 }                        // by his own photograph on the altar's wall, turned to her
    };
    const HER_HEAD = () => { const P = cast.amma; if (P && P.ready && P.head) { P.head.getWorldPosition(_pv); return [_pv.x, _pv.y + 0.06, _pv.z]; } return [CHAIR.x, 1.18, CHAIR.z - 0.05]; };

    function buildCast() {
      /* AMMA, in her wheelchair, facing her altar. She sits as a woman sits in a wheelchair: her bottom on its seat (her
         hip joints `hipOver` above it), each leg solved down to the FOOTREST from there (its top, `sole`), and brought
         forward until her shins clear the seat's front. Her seated rest (`wsit`, written for her) back and forth over
         its own still middle; her talk the library's seated answer; her turn of the head to him (`wturn`) the opening
         film's and play's one beat of it. Within 2.2 m her full model is drawn (v26.5: the story turns on her) */
      cast.amma = mkPerson('p4amma', CHAIR.x, CHAIR.z, CHAIR.ry, { take: 'wsit', centre: true, phase: 0.2,
        win: { wsit: [2.0, 3.6, 12] }, talk: 'Sitting_Answering_Questions',
        seat: { y: WHEEL.seat, takes: /^(Sitting_Answering_Questions|wsit|wturn|trance)$/,
                down: { hipOver: 0.11, sink: 0.015, sole: WHEEL.foot + 0.004, edge: WHEEL.front, r: 0.055, apron: 0.14, flat: true } },
        headDamp: { Sitting_Answering_Questions: [0.45, 'wsit'] }, skins: { 0: 'p4ammah', 2: 'p4ammam' }, blobW: 0.8, blobD: 1.05 });   // (her shadow is her chair's too; no far body in a flat of ten metres)
      cast.amma.home = { x: CHAIR.x, z: CHAIR.z, ry: CHAIR.ry };
      /* RAVI and MALA, standing, turned to their mother; each talks in the library's chat (its head's turn measured
         before it is cast: tools/probes/headturn.mjs) and rests in its stand */
      cast.ravi = mkPerson('p4ravi', AT.ravi.x, AT.ravi.z, faceTo(AT.ravi.x, AT.ravi.z, CHAIR.x, CHAIR.z), { take: 'Idle_3', phase: 0.55,
        talk: 'Stand_and_Chat', shoulders: STAND_SHOULDERS, skins: { 0: 'p4ravih', 2: 'p4ravim' }, blobW: 0.8, blobD: 0.6 });
      cast.ravi.home = { x: AT.ravi.x, z: AT.ravi.z, ry: faceTo(AT.ravi.x, AT.ravi.z, CHAIR.x, CHAIR.z) };
      cast.mala = mkPerson('p4mala', AT.mala.x, AT.mala.z, faceTo(AT.mala.x, AT.mala.z, CHAIR.x, CHAIR.z), { take: 'Idle_3', phase: 0.15,
        talk: 'Stand_and_Chat', shoulders: STAND_SHOULDERS, skins: { 0: 'p4malah', 2: 'p4malam' }, blobW: 0.75, blobD: 0.6 });
      cast.mala.home = { x: AT.mala.x, z: AT.mala.z, ry: faceTo(AT.mala.x, AT.mala.z, CHAIR.x, CHAIR.z) };
      /* GRANDMASTER PHO ON HIS STOOL (Chad's own model in his look D, as chapter 3 cast him on his bench: the same
         numbers, the stool's top for the bench's), turned to her; his rest the start of his rise from a seat, both hands
         on his knees, there and back in a slow breath; his talk the seated answer, his head's turn restrained */
      const phoRy = faceTo(AT.phoS.x, AT.phoS.z, CHAIR.x, CHAIR.z + 0.15);
      cast.pho = mkPerson('pho', AT.phoS.x, AT.phoS.z, phoRy, { take: 'Sit_to_Stand_Transition_M', centre: true,
        win: { Sit_to_Stand_Transition_M: [0.02, 0.3, PHO_BREATH] },
        seat: { y: STOOL_TOP, takes: /^Sit/, down: Object.assign({}, MASTER_DOWN, { knees: 'keep', tuck: true }), rise: 'Sit_to_Stand_Transition_M' },
        skins: false, look: lookD, blobW: 0.9, blobD: 0.9, talk: 'Sitting_Answering_Questions', headDamp: PHO_TALK_HEAD,
        upright: PHO_SIT_UPRIGHT, shoulders: PHO_SIT_SHOULDERS, handsOn: PHO_SIT_HANDS });
      cast.pho.home = { x: AT.phoS.x, z: AT.phoS.z, ry: phoRy };
      /* GRANDMASTER PHO STANDING BEHIND HER CHAIR (the blessing): the same body standing, at rest on the end of his rise
         (upright, both arms down), his right hand laid on her head (handOnHead, c_story.js) */
      const phoBRy = faceTo(AT.phoB.x, AT.phoB.z, CHAIR.x, CHAIR.z);
      cast.phoB = mkPerson('pho', AT.phoB.x, AT.phoB.z, phoBRy, { take: 'Sit_to_Stand_Transition_M', hidden: true,
        win: { Sit_to_Stand_Transition_M: [5.85, 0.25, PHO_BREATH] }, skins: false, look: lookD, blobW: 0.9, blobD: 0.8,
        centre: true, talk: 'Talk_with_Hands_Open', headDamp: PHO_STAND_HEAD,
        upright: PHO_STAND_UPRIGHT, shoulders: PHO_STAND_SHOULDERS, shWin: PHO_STAND_SHWIN, armRest: PHO_ARM_REST, knees: PHO_KNEES,
        armOut: PHO_ARM_OUT });
      cast.phoB.home = { x: AT.phoB.x, z: AT.phoB.z, ry: phoBRy };
    }
    buildCast();
    /* WHERE A TAKE CARRIES A BODY: its hips over the floor from the take's first moment to `t`, in the person's own
       group's metres (its hips' track read through the fixed frame the armature stands in). Measured 18 Nov: her rise
       ends 0.35 m before the chair's middle and her steps carry her 0.29 m a second; Ravi's rush runs 2.94 m */
    const _htv = new THREE.Vector3();
    function hipsFrame(P) { if (!P._hm && P.hips) { P.group.updateWorldMatrix(true, true); P._hm = new THREE.Matrix3().setFromMatrix4(new THREE.Matrix4().copy(P.group.matrixWorld).invert().multiply(P.hips.parent.matrixWorld)); } return P._hm; }
    function hipsTravel(P, name, t) {
      const A = P.acts && P.acts[name], M = hipsFrame(P); if (!A || !M) return [0, 0];
      const tr = A.getClip().tracks.find(q => /Hips\.position$/.test(q.name)); if (!tr) return [0, 0];
      const v = tr.values, T = tr.times, n = T.length; let i = 0; while (i < n - 2 && T[i + 1] <= t) i++;
      const u = n > 1 ? c01((t - T[i]) / Math.max(1e-6, T[i + 1] - T[i])) : 0, j = Math.min(n - 1, i + 1);
      _htv.set(lp(v[i * 3], v[j * 3], u) - v[0], lp(v[i * 3 + 1], v[j * 3 + 1], u) - v[1], lp(v[i * 3 + 2], v[j * 3 + 2], u) - v[2]).applyMatrix3(M);
      return [_htv.x, _htv.z];
    }
    /* RAVI'S RUSH CARRIES HIS GROUP (18 Nov: at his mark he was not drawn: the renderer tests a body's sphere round its
       group, and the rush had carried his body three metres from it). Its travel over the floor is taken out of his hips
       as he lands and kept (P.rushPath, in his group's metres, every key of the take); a film moves his group along it
       (c_ufilm.js rushAt), so his body goes exactly where the take took it and his sphere goes with him. Kept on the clip
       too, so a second build of the chapter (a replay) finds it already taken out and reads it back */
    whenReady(cast.ravi, (P) => {
      const A = P.acts.rush, M = hipsFrame(P); if (!A || !M) { console.warn('p4ravi: no rush to carry'); return; }
      const clip = A.getClip(), tr = clip.tracks.find(q => /Hips\.position$/.test(q.name)); if (!tr) return;
      clip.userData = clip.userData || {};
      if (!clip.userData.rushPath) {
        const v = tr.values, T = tr.times, n = T.length, D = new Float32Array(n * 2), Mi = M.clone().invert(), d = new THREE.Vector3();
        for (let i = 0; i < n; i++) { d.set(v[i * 3] - v[0], v[i * 3 + 1] - v[1], v[i * 3 + 2] - v[2]).applyMatrix3(M); D[i * 2] = d.x; D[i * 2 + 1] = d.z;
          d.y = 0; d.applyMatrix3(Mi); v[i * 3] -= d.x; v[i * 3 + 1] -= d.y; v[i * 3 + 2] -= d.z; }
        clip.userData.rushPath = { T: Float32Array.from(T), D };
      }
      P.rushPath = clip.userData.rushPath;
    });

    /* ---------------------------------------------------------------- THE ONES ONLY THE VISION SHOWS (the plan's §4.2, §4.3)
       Each is a body made for it and drawn as light: its meshes handed to the engine (ctx.spirit), which moves them onto
       the vision's own layer. Their colours keep their meaning all chapter: crimson the one on her back, pale blue Appa,
       green the hungry ones; her goddess is a DARK BLUE LIGHT round her altar and never a figure (the standing rule);
       GOLD is Grandmaster Pho's alone (Chad, v25.5). A spirit's glow is read and set through P.fx (uAlpha, uFill, uRim) */
    /* (18 Nov, photographed through the vision on a phone: a generated body is many layers deep (its clothes, its rags),
       and a spirit is drawn over everything with no test of its own depth, so its fill summed through every layer and the
       one on her back read as a red block that hid her. Each is now its RIM, with a breath of fill. A glow laid over a
       body the world draws (his gold, her altar's blue) is drawn on its front surface only (xray 0: its own back layers
       stand behind the world's depth and drop out), or his robe's folds summed into an orange sheet) */
    /* (18 Nov: once the glow's own front surface passed its depth test whole (src/vision.js), her altar's rim lit every
       grazing face of it (its inner walls, its shelf) solid blue, a paint and not a light: photographed at three strengths
       (`$S/e4c4/auralab`), the most even taken, a light ON it: fill 0.14, rim 0.22, where it was 0.03 and 1.1) */
    const SPIRIT = {
      oppress: { color: 0xff2238, fill: 0.025, rim: 2.3, flicker: 0.35, power: 2.0, xray: 0 },
      appa:    { color: 0xbfe2ff, fill: 0.04, rim: 1.6, flicker: 0.05, power: 2.4 },
      wander:  { color: 0x8cff5e, fill: 0.02, rim: 2.0, flicker: 0.3, power: 2.2 },
      large:   { color: 0x5cff7a, fill: 0.025, rim: 2.2, flicker: 0.25, power: 2.0 },
      altar:   { color: 0x2f4dff, fill: 0.14, rim: 0.22, flicker: 0.08, power: 2.0, xray: 0 },
      pho:     { color: 0xffc456, fill: 0.0, rim: 0.5, flicker: 0.04, power: 3.0, xray: 0 },
      /* (R62: his water bowl, found in gold from across the room, a little through what stands before it) */
      bowl:    { color: 0xffc456, fill: 0.16, rim: 1.8, flicker: 0.05, power: 2.0, xray: 0.5 }
    };
    function spiritOf(P, look) {
      whenReady(P, () => { P.fx = ctx.spirit ? ctx.spirit(P.model, look) : null; P.glow = 1; if (P.fx) P.fx.set('uAlpha', P.alpha != null ? P.alpha : 1); });
      return P;
    }
    /* THE ONE ON HER BACK: crouched on her shoulders, its arms round her chest, its weight on her (its `cling`, written
       for it). It rides her chair, turned as she is. (18 Nov: first set over her seat, its hips stood at 1.01 m over her
       head's base at 0.85, and it floated over her head in the photographs (tools/probes/bonesat.mjs); placed by
       photograph (tools/probes/spiritlab.mjs, variant A2): its chest against her upper back, tipped back 15 degrees so it
       hugs her rather than hunching over her, its head beside hers over her right shoulder, its arms over her shoulders
       and across her chest. Drawn only where she does not hide it (xray 0): through her, its folded legs read from her
       front as feet in her lap) */
    const OPP_AT = { x: CHAIR.x - 0.115, y: 0.075, z: CHAIR.z - 0.452 }, OPP_TILT = -0.262;
    const spirits = {};
    spirits.oppress = spiritOf(mkPerson('p4oppress', OPP_AT.x, OPP_AT.z, CHAIR.ry, { y: OPP_AT.y, take: 'cling', centre: true, noBlob: true, skins: false }), SPIRIT.oppress);
    whenReady(spirits.oppress, (P) => { P.group.rotation.x = OPP_TILT; });
    /* IT RIDES HER (18 Nov: in the trance she sits up and forward of the recline it was placed on, and in the film's
       photographs it hung in the air behind her chair, a hand's breadth and more off her back): it is carried by her
       upper back (her Spine02) as if it were one of her bones, from exactly where the photograph placed it against her
       seated rest (her `wsit` at OPP_REF_T, inside the window play holds her in). Read once, as both bodies land, her own
       pose put back after; laid every frame after she is posed (play, every film), so where she leans, it leans */
    const OPP_REF_T = 3.0, OPP_REF = { m: null };
    /* HER CROWN: the top of her head as her skin has it. Her head bone sits at the base of her skull: a palm laid 9.5 cm
       over it was inside her head, its fingertips out at her ears in the trance's first picture (18 Nov). Read once below,
       and carried by her head bone after (a fallback until she lands) */
    const CROWN_LOCAL = new THREE.Vector3(0, 0.19, 0), _crw = new THREE.Vector3();
    const HER_CROWN = () => { const A = cast.amma; if (A && A.ready && A.head) { A.head.updateWorldMatrix(true, false); _crw.copy(CROWN_LOCAL); A.head.localToWorld(_crw); return [_crw.x, _crw.y, _crw.z]; } return [CHAIR.x, 1.1, CHAIR.z - 0.15]; };
    /* HER BROW, read off her skin the same way (18 Nov: the ash put by a guess at the head bone's height reached her chin
       and then her nose): the most forward point of her head's skin in its top 9 cm, over her eyebrows, where the ash is
       drawn. She faces +z in the seated rest it is read from */
    const BROW_LOCAL = new THREE.Vector3(0, 0.11, 0.09);
    const HER_BROW = () => { const A = cast.amma; if (A && A.ready && A.head) { A.head.updateWorldMatrix(true, false); _crw.copy(BROW_LOCAL); A.head.localToWorld(_crw); return [_crw.x, _crw.y, _crw.z]; } return [CHAIR.x, 1.05, CHAIR.z]; };
    const _om = new THREE.Matrix4(), _om2 = new THREE.Matrix4(), _os = new THREE.Vector3();
    function herBack(A) { if (A._back === undefined) { A._back = null; for (const n in A.bone) if (/^(mixamorig:?)?Spine02$/.test(n)) { A._back = A.bone[n]; break; } } return A._back; }
    whenReady(cast.amma, (A) => whenReady(spirits.oppress, (P) => {
      const bk = herBack(A); if (!bk || OPP_REF.m) return;
      const keep = {}; for (const k in A.acts) keep[k] = [A.acts[k].time, A.w[k]];
      const cur = A.cur, ft = A.filmT;
      put(A, CHAIR.x, CHAIR.z, CHAIR.ry); pose(A, 'wsit', OPP_REF_T); bk.updateWorldMatrix(true, false);
      put(P, OPP_AT.x, OPP_AT.z, CHAIR.ry, OPP_AT.y); P.group.rotation.x = OPP_TILT; P.group.updateWorldMatrix(true, false);
      OPP_REF.m = new THREE.Matrix4().copy(bk.matrixWorld).invert().multiply(P.group.matrixWorld);
      /* (her crown, read off the same seated rest: the highest point of the skin her head bone carries, in that bone's
         own frame) */
      const hb = A.head; A.group.updateWorldMatrix(true, true);
      if (hb) { let best = null; const v = new THREE.Vector3();
        for (const m of (A.lv[1] || [])) { if (!m.isSkinnedMesh || !m.geometry.attributes.skinIndex) continue; const bi = m.skeleton.bones.indexOf(hb); if (bi < 0) continue;
          const SI = m.geometry.attributes.skinIndex, SW = m.geometry.attributes.skinWeight;
          for (let i = 0; i < SI.count; i++) { let w = 0; for (let k = 0; k < 4; k++) if (SI.getComponent(i, k) === bi) w += SW.getComponent(i, k); if (w < 0.5) continue;
            m.getVertexPosition(i, v); m.localToWorld(v); if (!best || v.y > best.y) best = v.clone(); } }
        if (best) CROWN_LOCAL.copy(hb.worldToLocal(best)); else console.warn('p4amma: no skin on her head bone to read her crown from');
        if (best) { let brow = null;
          for (const m of (A.lv[1] || [])) { if (!m.isSkinnedMesh || !m.geometry.attributes.skinIndex) continue; const bi = m.skeleton.bones.indexOf(hb); if (bi < 0) continue;
            const SI = m.geometry.attributes.skinIndex, SW = m.geometry.attributes.skinWeight;
            for (let i = 0; i < SI.count; i++) { let w = 0; for (let k = 0; k < 4; k++) if (SI.getComponent(i, k) === bi) w += SW.getComponent(i, k); if (w < 0.5) continue;
              m.getVertexPosition(i, v); m.localToWorld(v); if (v.y < best.y - 0.09) continue; if (!brow || v.z > brow.z) brow = v.clone(); } }
          if (brow) BROW_LOCAL.copy(hb.worldToLocal(brow)); } }
      for (const k in A.acts) { A.acts[k].time = keep[k][0]; A.w[k] = keep[k][1]; A.acts[k].setEffectiveWeight(keep[k][1]); }
      A.cur = cur; A.filmT = ft; A.mixer.update(0);
    }));
    /* in play, every frame after the people are posed (play never moves it: the water does not, c_story.js) */
    function oppRidePlay() { const P = spirits.oppress; if (P && P.ready && P.group.visible) oppRide(P); }
    /* lay it on her back where she is posed now (its own take is its own: only its place and its turn are hers) */
    function oppRide(P = spirits.oppress) {
      const A = cast.amma, bk = A && A.ready ? herBack(A) : null;
      if (!P || !P.ready) return;
      if (!OPP_REF.m || !bk) { put(P, OPP_AT.x, OPP_AT.z, CHAIR.ry, OPP_AT.y); P.group.rotation.set(OPP_TILT, CHAIR.ry, 0); return; }
      bk.updateWorldMatrix(true, false);
      _om.multiplyMatrices(bk.matrixWorld, OPP_REF.m);
      const par = P.group.parent; if (par) { par.updateWorldMatrix(true, false); _om2.copy(par.matrixWorld).invert(); _om.premultiply(_om2); }
      _om.decompose(P.group.position, P.group.quaternion, _os);
    }
    /* APPA, her late husband, standing by his photograph, looking at her; still (his stand, its window its calmest);
       his turn of the head is to her, and once, if water is thrown at him, to the student */
    spirits.appa = spiritOf(mkPerson('p4appa', AT.appa.x, AT.appa.z, faceTo(AT.appa.x, AT.appa.z, CHAIR.x, CHAIR.z), { take: 'Idle_3', phase: 0.3, noBlob: true, skins: false }), SPIRIT.appa);
    /* THE HUNGRY ONES: one body, many of them (each its own clone; mirrored and sized a little apart so no two are one
       shape twice). Two wait in the corners from the start (by the kitchen, under the dining table: §4.2); the rest
       are the blessing's waves, hidden until they come */
    /* (sixteen: Chad, 18 Nov, the end of the blessing: "the green entities should swarm in the screen in dramatic numbers,
       filling the screen with many of them"; each a 15,799-triangle clone of one body, drawn in the vision only. The
       fight never has more than sixteen in the room at once: c_story.js freeBody) */
    const WANDER_N = 16;
    spirits.wander = [];
    for (let i = 0; i < WANDER_N; i++) {
      const P = mkPerson('p4wander', 0, 0, 0, { take: i % 2 ? 'creep' : 'crawl', phase: 0.13 * i, hidden: true, noBlob: true, skins: false, s: 0.94 + 0.03 * (i % 4) });
      P.slot = i; spirits.wander.push(spiritOf(P, SPIRIT.wander));
    }
    const CORNERS = [{ x: 5.95, z: 9.55, ry: -2.6 }, { x: 4.85, z: 6.65, ry: Math.PI }];   // the kitchen's far corner; under the dining table
    spirits.large = spiritOf(mkPerson('p4large', 0, 0, 0, { take: 'lumber', hidden: true, noBlob: true, skins: false }), SPIRIT.large);
    /* (19 Nov, Chad, R95/R96: with his sight shut "they can possibly keep it off all the way and not know what is going on and
       miss the entire climax"): IN THE FIGHT, WITH HIS SIGHT SHUT, THE GREEN ONES ARE FAINT DARK SHAPES. A twin of each of
       their meshes (the same geometry, the same skeleton) in the world's own layer, unlit: near black, a dim green at its
       edges so it reads in the dark room, and faint; written into the depth so a body's own layers (its rags) do not sum
       into a block. Hidden until the fight asks for them (c_story.js shadeTick), and gone the moment his sight opens (the
       vision draws them then, as themselves). Compiled under the curtain with everything else (compileAsync takes the
       hidden too) */
    const SHADE = { a: 0.38, col: 0x020504, rim: 0x2c5236 };
    const SHADE_OUT = /gl_FragColor\s*=\s*vec4\(\s*normalize\(\s*normal\s*\)\s*\*\s*0\.5\s*\+\s*0\.5\s*,\s*diffuseColor\.a\s*\);/;
    function shadeOf(P) {
      whenReady(P, () => {
        if (P.shade || !ctx.visionLayer) return;
        const U = { uShA: { value: 0 }, uShCol: { value: new THREE.Color(SHADE.col) }, uShRim: { value: new THREE.Color(SHADE.rim) } };
        const m = new THREE.MeshNormalMaterial({ side: THREE.FrontSide });
        m.transparent = true; m.depthWrite = true; m.fog = false; m.toneMapped = false;
        m.onBeforeCompile = (sh) => {
          Object.assign(sh.uniforms, U);
          const out = sh.fragmentShader.replace(SHADE_OUT, 'float shF = pow(1.0 - abs(normalize(normal).z), 2.0);\n  gl_FragColor = vec4(mix(uShCol, uShRim, shF), uShA * (0.6 + 0.4 * shF));');
          if (out === sh.fragmentShader) console.warn('e4c4: the green ones\' shade found no colour line to write (three changed?)');
          sh.fragmentShader = 'uniform vec3 uShCol, uShRim;\nuniform float uShA;\n' + out;
        };
        m.customProgramCacheKey = () => 'e4c4shade';
        const twins = [], list = [];
        P.model.traverse(o => { if (o.isMesh && !o.userData.__shade && o.layers.mask === (1 << ctx.visionLayer)) list.push(o); });
        for (const o of list) {
          let t;
          if (o.isSkinnedMesh) { t = new THREE.SkinnedMesh(o.geometry, m); t.bind(o.skeleton, o.bindMatrix); }
          else t = new THREE.Mesh(o.geometry, m);
          t.userData.__shade = true; t.frustumCulled = false; t.castShadow = false; t.receiveShadow = false; t.visible = false;
          t.position.copy(o.position); t.quaternion.copy(o.quaternion); t.scale.copy(o.scale);
          o.parent.add(t); twins.push(t);
        }
        P.shade = { twins, u: U, on: false };
      });
      return P;
    }
    for (const P of spirits.wander) shadeOf(P);
    shadeOf(spirits.large);
    function spiritsHome() {
      whenReady(spirits.oppress, (P) => { oppRide(P); P.group.visible = true; P.alpha = 1; if (P.fx) P.fx.set('uAlpha', 1); rest(P, 0); });
      whenReady(spirits.appa, (P) => { put(P, AT.appa.x, AT.appa.z, faceTo(AT.appa.x, AT.appa.z, CHAIR.x, CHAIR.z)); P.group.visible = true; P.alpha = 1; if (P.fx) P.fx.set('uAlpha', 1); rest(P, 0); });
      spirits.wander.forEach((P, i) => whenReady(P, (Q) => {
        const C = CORNERS[i]; Q.alpha = 1; if (Q.fx) Q.fx.set('uAlpha', 1);
        if (C) { put(Q, C.x, C.z, C.ry); Q.group.visible = true; take(Q, 'crawl', 0); } else Q.group.visible = false; }));
      whenReady(spirits.large, (P) => { P.group.visible = false; });
    }
    spiritsHome();
    /* HER GODDESS'S LIGHT: a dark blue glow laid over her altar (the shelf, its pictures, the lamp) in the vision only,
       twins of their own meshes (ctx.spiritAura): a light, never a figure. And GRANDMASTER PHO, in the vision, the one
       person in the room who stands in gold, faintly (gold is his alone: Chad, v25.5) */
    const auras = [], altarAuras = [];
    /* (a thing's twins are made once its model is in its group: stand() asked for the parse first, so its own handler,
       which puts the model in, has run before this one) */
    function auraOn(key, look) {
      const groups = things[key] || []; if (!groups.length || !have(key)) return;
      parseOnce(key).then(() => { if (!alive) return; for (const g of groups) { const a = ctx.spiritAura ? ctx.spiritAura(g, look) : null; if (a) { auras.push(a); altarAuras.push(a); } } }, () => {});
    }
    for (const k of ['w4prayershelf', 'w4vilakku']) auraOn(k, SPIRIT.altar);
    /* (R62, Chad, 18 Nov evening: "when spirit vision is turned on, make the holy water bowl silohuette in a golden glow too
       so player can more easily find it to reload the water"): Grandmaster Pho's large bowl, where the water is dipped
       again, in gold through the vision (gold is his alone, v25.5, and this is his bowl); its glow's twins ride the bowl
       wherever it is set (his stool, R53). Not one of the altar's lights (they follow her lamp). (R141, 21 Nov: the water
       never runs out now and nothing is filled there; the glow stays, his blessed water, and nothing says it refills) */
    { const groups = things.w4bigbowl || [];
      if (groups.length && have('w4bigbowl')) parseOnce('w4bigbowl').then(() => { if (!alive) return;
        for (const g of groups) { const a = ctx.spiritAura ? ctx.spiritAura(g, SPIRIT.bowl) : null; if (a) auras.push(a); } }, () => {}); }
    for (const P of [cast.pho, cast.phoB]) whenReady(P, (Q) => { const a = ctx.spiritAura ? ctx.spiritAura(Q.model, SPIRIT.pho) : null; if (a) { auras.push(a); Q.aura = a; } });

    /* WHAT THE WATER CAN REACH (the engine raycasts the lens's line into stage.shootables()): a sphere round each
       spirit's middle, drawn by nobody (its material is never drawn) and on the world's layer, where the ray looks.
       A skinned body is not raycast (its every point skinned on the processor, every shot) */
    const hitGeo = new THREE.SphereGeometry(1, 12, 8), hitMat = new THREE.MeshBasicMaterial({ visible: false });
    owned.push(hitGeo); mats.push(hitMat);
    function hitBall(P, r, up) { const m = new THREE.Mesh(hitGeo, hitMat); m.scale.setScalar(r); m.visible = false; m.userData.up = up; m.name = 'hit:' + P.key; world.add(m); P.hit = m; return m; }
    /* (18 Nov, Chad: "make the aoe of the water flicking bigger": the green ones' spheres 0.5 m where they were 0.36, the
       large one's 0.72 where it was 0.55, and every green one near the flick's line is reached too: c_story.js onShot.
       Appa's and the one on her back's stay as they were: a flick reaches him only when it is aimed at him) */
    hitBall(spirits.oppress, 0.32, 0.25); hitBall(spirits.appa, 0.36, 1.0); hitBall(spirits.large, 0.72, 1.05);
    for (const P of spirits.wander) hitBall(P, 0.5, 0.22);
    const _hp = new THREE.Vector3();
    function hitsTick() {
      for (const P of [spirits.oppress, spirits.appa, spirits.large].concat(spirits.wander)) { const m = P.hit; if (!m) continue;
        const on = !!(P.ready && P.group.visible && !(P.gone));
        m.visible = on; if (!on) continue;
        if (P.hips) { P.hips.getWorldPosition(_hp); m.position.set(_hp.x, _hp.y + (P === spirits.appa ? 0.2 : 0.05), _hp.z); }
        else m.position.set(P.group.position.x, P.group.position.y + m.userData.up, P.group.position.z); }
    }
