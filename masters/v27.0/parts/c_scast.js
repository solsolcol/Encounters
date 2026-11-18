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
      P.upr = { hips, legs, spine: B, neck, B: [hips].concat(legs, B, [neck]).map(b => ({ b, sv: new THREE.Quaternion() })), take: Object.assign({}, P.o.upright), on: false };
    }
    const _upW0 = new THREE.Quaternion(), _upW1 = new THREE.Quaternion(), _upD = new THREE.Quaternion();
    function uprightLay(P) {
      const U = P.upr; if (!U) return;
      let tr = 0, hd = 0, hp = 0;
      for (const n in U.take) { const w = P.w[n] || 0; if (w > 0) { tr += w * (U.take[n].trunk || 0); hd += w * (U.take[n].head || 0); hp += w * (U.take[n].hips || 0); } }
      if (Math.abs(tr) < 1e-3 && Math.abs(hd) < 1e-3 && Math.abs(hp) < 1e-3) return;
      for (const R of U.B) R.sv.copy(R.b.quaternion);
      U.on = true;
      P.group.updateWorldMatrix(true, false); P.group.getWorldQuaternion(_upQ);
      _upF.set(0, 0, 1).applyQuaternion(_upQ); _upF.y = 0; _upF.normalize();
      _upA.set(0, 1, 0).cross(_upF).normalize();                       // (a turn about it by a positive angle leans the body forward)
      const turn = (b, deg) => { b.parent.updateWorldMatrix(true, false); b.parent.getWorldQuaternion(_upQp);
        _upV.copy(_upA).applyQuaternion(_upQp.invert()); _upQ.setFromAxisAngle(_upV, deg * Math.PI / 180); b.quaternion.premultiply(_upQ); b.updateWorldMatrix(false, true); };
      if (Math.abs(hp) >= 1e-3) { U.hips.getWorldQuaternion(_upW0); turn(U.hips, hp); U.hips.getWorldQuaternion(_upW1);
        _upD.copy(_upW1).invert().multiply(_upW0);                      // (each thigh's turn given back: new hips^-1 * old hips)
        for (const L of U.legs) { L.quaternion.premultiply(_upD); L.updateWorldMatrix(false, true); } }
      if (Math.abs(tr) >= 1e-3) for (const b of U.spine) turn(b, tr / 3);
      if (Math.abs(hd) >= 1e-3) turn(U.neck, hd);
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
    const PHO_SIT_HANDS = { how: 'lap' };
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
    const PHO_STAND_UPRIGHT = { Sit_to_Stand_Transition_M: { head: 12 }, Talk_with_Hands_Open: { head: 12 } };
    const PHO_STAND_SHOULDERS = { Talk_with_Hands_Open: 1, mage_soell_cast_3: 0.6 };
    const PHO_STAND_SHWIN = { mage_soell_cast_3: [0.5, 0.45] };
    /* the shoulders let down in every standing and talking take (v26.8, every standing person) */
    const STAND_SHOULDERS = { Idle_3: 1, Stand_and_Chat: 1, Listening_Gesture: 1, Talk_with_Hands_Open: 1, Talk_with_Right_Hand_Open: 1, Walking: 1 };

    /* LOOK D on Grandmaster Pho (Chad's pick, v24.52: "unlit, except for the robe"), chapter 3's own (c_cast.js lookD,
       its reason there): his face, hands and beads laid back at their own colour after the tone mapping, the robe lit.
       `level` is the hour's: under the tube he is lit as the room is (1); by the lamp alone the laid colour is dimmed */
    const phoLook = { k: { value: 1 }, level: { value: 1 }, lift: { value: 0.55 } };
    function lookD(model) {
      model.traverse(q => { if (!q.isMesh) return;
        const list = [].concat(q.material).map(m0 => { const mt = m0.clone(); mats.push(mt); const WHOLE = /\(face and hands\)$/.test(m0.name);
          mt.onBeforeCompile = (sh) => { sh.uniforms.uK = phoLook.k; sh.uniforms.uLevel = phoLook.level; sh.uniforms.uLift = phoLook.lift;
            sh.fragmentShader = 'uniform float uLevel;\nuniform float uK;\nuniform float uLift;\n' + sh.fragmentShader.replace('#include <tonemapping_fragment>', '#include <tonemapping_fragment>\n'
              + (WHOLE ? 'float skn = 1.0;\n' : 'vec3 sc = pow(max(diffuseColor.rgb, vec3(1e-4)), vec3(1.0 / 2.2)); float mxc = max(sc.r, max(sc.g, sc.b)); float skn = smoothstep(0.12, 0.25, (mxc - min(sc.r, min(sc.g, sc.b))) / max(mxc, 1e-4));\n')
              + 'float kS = clamp(uK * skn, 0.0, 1.0); vec3 unl = diffuseColor.rgb * uLevel;\n'
              + 'gl_FragColor.rgb += (1.0 - kS) * uK * uLift * max(vec3(0.0), unl * 0.9 - gl_FragColor.rgb);\n'
              + 'gl_FragColor.rgb = mix(gl_FragColor.rgb, unl, kS);'); };
          mt.customProgramCacheKey = () => 'phoLookD' + (WHOLE ? ':whole' : ''); return mt; });
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
        upright: PHO_STAND_UPRIGHT, shoulders: PHO_STAND_SHOULDERS, shWin: PHO_STAND_SHWIN });
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
       wherever it is set (his stool, R53). Not one of the altar's lights (they follow her lamp) */
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
    /* the altar, so a shot at it can be refused (Not at her altar.): her shelf's column, from the floor to its top */
    const altarHit = new THREE.Mesh(new THREE.BoxGeometry(0.95, 2.1, 0.7), hitMat); altarHit.position.set(ALTAR.x, 1.05, ALTAR.z - 0.32); altarHit.visible = false; altarHit.name = 'hit:altar';
    world.add(altarHit); owned.push(altarHit.geometry);
    const _hp = new THREE.Vector3();
    function hitsTick() {
      for (const P of [spirits.oppress, spirits.appa, spirits.large].concat(spirits.wander)) { const m = P.hit; if (!m) continue;
        const on = !!(P.ready && P.group.visible && !(P.gone));
        m.visible = on; if (!on) continue;
        if (P.hips) { P.hips.getWorldPosition(_hp); m.position.set(_hp.x, _hp.y + (P === spirits.appa ? 0.2 : 0.05), _hp.z); }
        else m.position.set(P.group.position.x, P.group.position.y + m.userData.up, P.group.position.z); }
    }
