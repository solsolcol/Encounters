
    /* ================================================================ THE CHAPTER'S SHARED CAST (masters/v28.0/parts/c_cast.js)
       Made by the FILMS helper (M9, 21 Nov 2026) and used by everyone: the play (M7), the fight (M8) and the films (M9).
       Mr Koh and Jun are the world's (b_xpeople.js); everyone else who stands in this chapter is here, ONE BODY EACH, so
       nothing is cast twice (two bodies of one man cost a phone twice and drift apart). Each is a person of chapter 3's
       machinery (mkPerson), posed by the films' clock (pose) and by the play's wall clock (take, hold, rest, talk):
         cast.pho    Grandmaster Pho standing, in his look D (Chad's pick, v24.52: "unlit, except for the robe"), with
                     every posture law chapter 4 learned on his standing body (R42, R64, R76, R77, R88, R92, R93): copied
                     here number for number. The fight drives him (DRIVABLE: his group's transform and his takes only)
         cast.phoS   the same body seated cross-legged on his cushion (case three), chapter 3's hall seat (v26.18)
         cast.ton    Ton, chapter 3's follower (a declared reuse: the same man), his own takes
         cast.zav    MASTER ZAVIER (Chad's R3 and R5: seen in the climax only), his pick, the first body (R10)
         cast.col    the collector (people/RECORD.md 3b: his rig mended here, way B)
         PRAI5       the nine, three bodies, each kind its own, in two looks (Spirit Vision's, and the trance's)
         CAGE5       his Lersi's cage of light (violet: the plan's 11)
         TRANCE5     the trance's look over the court (the plan's 11: a deep blue dark, the lamps down, a low mist, each of
                     the two lit by his own colour), and Grandmaster Pho's gold at his shoulders (gold is his alone, v25.5)
         COURT5      the fight's court frame (FIGHT.NUM's metres) in the world's, one function for everyone
       Nobody is a block figure: a body is not drawn at all until its model has landed (v21.16). */

    /* ---------------------------------------------------------------- GRANDMASTER PHO'S LAWS, copied from chapter 4 as it
       shipped (assemble.py pins its sha1): his robe's flecks, his posture numbers, his look D */
//@@COPY 3548-4954 :: /* R43 (Chad, 18 Nov 2026: "There are also some skin colour bits
//@@COPY 5430-5492 :: /* chapter 3's numbers for a man set on a seat by his own body
//@@COPY 5494-5527 :: /* LOOK D on Grandmaster Pho
    /* R33 (23 Nov; R28, "brown bits" on his robe in the fight): chapter 4's cover takes the robe's islands of SKIN colour;
       the scan also left small DARK specks in the robe's white (grey, brown and black dots, seen on his front and back at
       three metres on a phone). They are found in his sheet by tools/phodark.py (PHO_DARK5, c_phodark.js: on pieces that
       paint mostly robe, clear of the bead strands) and painted into the same cover once, in the robe's colour round each:
       chapter 4's look D, its mask and his file unchanged. */
    { const fleck0 = phoFleck;
      phoFleck = function () { const t = fleck0();
        if (t && !t.userData.dark5 && typeof PHO_DARK5 === 'object' && t.image && t.image.getContext) {
          const g = t.image.getContext('2d'), s = t.image.width / PHO_DARK5.size;
          for (const [r, gr, b, R] of PHO_DARK5.f) { g.fillStyle = `rgb(${r},${gr},${b})`; for (let i = 0; i < R.length; i += 3) g.fillRect(R[i + 1] * s, R[i] * s, R[i + 2] * s, s); }
          t.userData.dark5 = true; t.needsUpdate = true; }
        return t; }; }
    /* and chapter 3's numbers for him seated CROSS-LEGGED on a cushion (its hall, v26.18: masters/v26.18/pho), with the
       white cloth over his crossed legs (w3pholap, a declared reuse) */
//@@COPY3 4616-4618 :: const CROSS = {

    /* ---------------------------------------------------------------- THE COURT'S FRAME (the fight's metres, FIGHT.NUM:
       x across, z down it; the doorway and its thread at z -3.0, the gate's end at +3.0) IN THE WORLD'S. The court is
       turned half round from the world (the lens of the fight looks down it toward the house: heading pi), so local +x is
       the world's -x and local +z the world's -z; local z -3.0 is the house's face (-5.7). Every builder reads one frame */
    const COURT5 = { x: -8.5, z: -8.7, heading: Math.PI };
    const courtWorld = (lx, lz) => ({ x: COURT5.x - lx, z: COURT5.z - lz });
    /* where the fight begins (its own rules' places, FIGHT.NUM: read at run time, never at the build, where the rules' part
       is not yet declared): Grandmaster Pho played first, his student before him, the lesson's Prai in the court's middle,
       the other eight at the far end where each will enter from */
    function fightStart() {
      const N = (typeof FIGHT !== 'undefined' && FIGHT && FIGHT.NUM) || { phoAt: [1.15, 2.0], zavAt: [0, 0.7], lessonAt: [0.6, -1.6], entryAt: [] };
      return { pho: courtWorld(N.phoAt[0], N.phoAt[1]), zav: courtWorld(N.zavAt[0], N.zavAt[1]), lesson: courtWorld(N.lessonAt[0], N.lessonAt[1]),
               entry: (N.entryAt || []).map(a => courtWorld(a[0], a[1])), laid: (N.laidAt || []).map(a => courtWorld(a[0], a[1])) };
    }
    /* the fight's boom, as the engine derives it (main.js tagBoomFor: behind and above the played one's feet, inside the
       chapter's camBox, eased by tagSoft), so a film that hands to the mode ends on exactly its first picture. From the
       chapter's own `tag` declaration when the fight declares it, else the engine's defaults with the court's heading */
    function boomSoft(v, lo, hi, m) {
      if (!(hi > lo)) return (lo + hi) / 2;
      m = Math.max(0, Math.min(m, (hi - lo) / 2));
      if (m <= 0) return Math.max(lo, Math.min(hi, v));
      if (v > hi - m) return hi - m + m * (1 - Math.exp(-(v - (hi - m)) / m));
      if (v < lo + m) return lo + m - m * (1 - Math.exp(-((lo + m) - v) / m));
      return v;
    }
    /* (R46, 23 Nov: THE END'S LENS PULLED BACK. Chad's pick, "Bigger yard + roomy end ... the camera pulled back": from the
       surge on (the cage cracking, the Naga called round the court, the last three) the boom stands 5.4 m back and 4.3 m up
       where it stood 4.0 and 3.1, looking down 34 degrees where it looked 26, so the court round the two of them and the
       Naga's coil stand in the picture. The fight asks the engine for it (kit.tagBoom, the sixty-ninth seam, eased 1.4 s);
       the films that begin or end on the mode's picture in those stages ask boomAt for it (its second argument)) */
    /* (R102 and R103: 0.4 m higher, 4.7 where it stood 4.3, its look down 37 degrees where it was 34, so his hips stand where
       they stood on the screen, as the fight's own boom: a_head.js) */
    const PULL5 = { back: 5.4, up: 4.7, pitch: 37 };
    function boomAt(feet, over) {
      const d = DATA.tag || {}, portrait = camera.aspect < 1;
      const b1 = Object.assign({ back: 4.0, up: 3.5, pitch: 30.3 }, d.boom || {}), b0 = portrait && d.portrait ? Object.assign({}, b1, d.portrait) : b1,
            b = over ? Object.assign({}, b0, over) : b0;
      const h = d.heading != null ? d.heading : COURT5.heading, soft = d.soft != null ? d.soft : 0.6, cb = d.camBox || null;
      const o = { x: feet.x + b.back * Math.sin(h), y: (feet.y || 0) + b.up, z: feet.z + b.back * Math.cos(h) };
      if (cb) { if (Number.isFinite(cb.minX) && Number.isFinite(cb.maxX)) o.x = boomSoft(o.x, cb.minX, cb.maxX, soft);
        if (Number.isFinite(cb.minZ) && Number.isFinite(cb.maxZ)) o.z = boomSoft(o.z, cb.minZ, cb.maxZ, soft);
        if (Number.isFinite(cb.minY) && Number.isFinite(cb.maxY)) o.y = boomSoft(o.y, cb.minY, cb.maxY, soft); }
      o.x = Math.max(DATA.bounds.minX, Math.min(DATA.bounds.maxX, o.x)); o.z = Math.max(DATA.bounds.minZ, Math.min(DATA.bounds.maxZ, o.z));
      /* (R37: then drawn in toward his head where a solid stands between them, as the mode does it (main.js tagBoomFor: the
         head 1.6 m over his feet, every solid that does not hold the head, the nearest hit less 0.22 m); R41: with the
         chapter's crane, over the ground with its height kept (tagPull), and turned down to keep his head where the whole
         boom puts it on the screen, never past the crane's max (tagPitchFor): the same numbers, so the film's last picture is
         the mode's first) */
      const H = new THREE.Vector3(feet.x, (feet.y || 0) + 1.6, feet.z), cr = d.crane || null;
      { const L = new THREE.Vector3(o.x, o.y, o.z).sub(H), len = L.length();
        if (len > 1e-4) {
          const ray = new THREE.Ray(H, L.divideScalar(len)), hit = new THREE.Vector3(), B = (S && S.blockers) || [];
          let near = len;
          for (let i = 0; i < B.length; i++) { const bx = B[i];
            if (bx.isEmpty() || bx.containsPoint(H)) continue; const q = ray.intersectBox(bx, hit); if (q) { const dd = q.distanceTo(H) - 0.22; if (dd < near) near = Math.max(0, dd); } }
          if (near < len) { const k = near / len; o.x = H.x + (o.x - H.x) * k; if (!cr) o.y = H.y + (o.y - H.y) * k; o.z = H.z + (o.z - H.z) * k; } } }
      let pd = +b.pitch || 0;
      if (cr) { const e0 = Math.atan2((+b.up || 0) - 1.6, +b.back || 0), e = Math.atan2(o.y - H.y, Math.hypot(o.x - H.x, o.z - H.z));
        if (e - e0 > 1e-6) pd = Math.max(pd, Math.min(Number.isFinite(+cr.max) ? +cr.max : 60, pd + (e - e0) * 180 / Math.PI)); }
      return { eye: [o.x, o.y, o.z], heading: h, pitch: -pd * Math.PI / 180, fov: Math.max(20, Math.min(110, +(b.fov || d.fov) || 72)) };
    }

    /* ---------------------------------------------------------------- THE CAST */
    const boneOf = (P, nm) => { if (!P || !P.bone) return null; const re = new RegExp('^(mixamorig:?)?' + nm + '$'); for (const n in P.bone) if (re.test(n)) return P.bone[n]; return null; };
    const at0 = (p, k) => (STATION[p] && STATION[p][k]) || null;
    /* GRANDMASTER PHO STANDING: chapter 4's standing body exactly (its cast.phoB: the end of his rise from a seat, both
       arms down, there and back in a slow breath; his talk the library's open hands, his head greatly restrained; every
       posture law). His walk is his own file's (never yet seen in a chapter: photographed before it is cast at length) */
    { const S0 = at0('walk', 'pho');
      cast.pho = mkPerson('p5pho', S0.x, S0.z, S0.ry, { take: 'Sit_to_Stand_Transition_M',
        win: { Sit_to_Stand_Transition_M: [5.85, 0.25, PHO_BREATH] }, skins: false, look: lookD, blobW: 0.9, blobD: 0.8,
        centre: true, talk: 'Talk_with_Hands_Open', headDamp: PHO_STAND_HEAD, pace: true,
        upright: PHO_STAND_UPRIGHT, shoulders: PHO_STAND_SHOULDERS, shWin: PHO_STAND_SHWIN, armRest: PHO_ARM_REST, knees: PHO_KNEES,
        armOut: PHO_ARM_OUT });
      cast.pho.home = { x: S0.x, z: S0.z, ry: S0.ry }; }
    /* GRANDMASTER PHO SEATED CROSS-LEGGED on his cushion behind the low table (case three: the plan's 4.7): chapter 3's hall
       seat, its numbers (CROSS) and its cloth, on this room's cushion (w5cushion: its top 0.12 m) */
    const CUSHION_TOP = 0.12;
    { const S0 = at0('table', 'pho');
      cast.phoS = mkPerson('pho', S0.x, S0.z, S0.ry, { y: CUSHION_TOP, take: 'Sit_to_Stand_Transition_M', centre: true, hidden: true,
        win: { Sit_to_Stand_Transition_M: [0.02, 0.3, PHO_BREATH] }, seat: { y: 0, over: CROSS.hips, takes: /^Sit/ }, skins: false, look: lookD, blobW: 1.05, blobD: 0.85,
        talk: 'Sitting_Answering_Questions', headDamp: PHO_TALK_HEAD, cross: CROSS });
      cast.phoS.home = { x: S0.x, z: S0.z, ry: S0.ry, y: CUSHION_TOP }; }
    /* TON: chapter 3's own casting (a declared reuse: the same man, who works in Singapore), his shoulders let down, his
       look round restrained, his full body drawn to 2.75 m (he is talked to from about 2 m) */
    { const S0 = at0('walk', 'ton');
      cast.ton = mkPerson('e4ton', S0.x, S0.z, S0.ry, { take: 'Idle_3', talk: 'Stand_and_Chat', headDamp: { seiza: [0.35] }, lodK: 1.25,
        shoulders: { Idle_3: 1, Stand_and_Chat: 1, Walking: 1, seiza: 1 }, pace: true, phase: 0.3 });
      cast.ton.home = { x: S0.x, z: S0.z, ry: S0.ry }; }
    /* MASTER ZAVIER (Chad's R3, R5 and R10): seen only from the turn of the preparation to the bag tied (the plan's 4.4 to
       4.6: every other shot is his eyes). His lighter body with his walk, and every triangle of him within 2.2 m and in the
       films' close shots (v26.5). Hidden until a film or the fight shows him. HIS REST AND HIS TRANCE'S TAKES are CAST's to
       make (people/RECORD.md: his file holds only his walk): `restTake` reads whichever he has */
    /* (R33/R34, 23 Nov: his file holds his rest now, Meshy's Idle_3 on his own rig, and his run and his three acts: he stands
       in his rest wherever a film or the fight lets him stand, no longer frozen at his walk's 0.03 s; ZAV_STAND5 below stays
       for a file without it) */
    cast.zav = mkPerson('p5zavier', 0, 0, 0, { take: 'Idle_3', hidden: true, skins: { 0: 'p5zavierh' }, blobW: 0.8, blobD: 0.6, pace: true,
      shoulders: { Idle_3: 1, Walking: 1 } });
    const zavRest = () => { const P = cast.zav; return P && P.acts && P.acts.Idle_3 ? 'Idle_3' : (P && P.acts && P.acts.trance ? 'trance' : null); };
    /* (R35, 23 Nov: Chad, "The fingers, wrists, and arms of both zavier and pho models still look very wrong in many of the
       poses". HIS FINGERS HELD AS MODELLED. Measured on his file (tools/probes/fingerweights.mjs, fingershape.mjs): his rig's
       finger bones are 1.3 to 1.8 cm long where a man's are 2 to 4.5 (the generator's rig bunched each finger's joints toward
       its tip), and each finger's skin is tied almost all to its LAST bone (the middle bones lead 1 to 20 points, the last 50 to
       229; his thumbs' last bones 143 and 188 of their 150 and 210), so every bend his takes put in a finger turns its skin
       about the wrong places. His hands were modelled open and relaxed, as a man's hang at rest; so his takes' finger tracks
       are taken out of every take as he loads (76 of 132 channels in his walk, run and rest, 114 of 198 in his acts) and his
       fingers stand as modelled in every pose: his wrists and arms are still his takes'. A take's own time and weight are
       kept as it is made again) */
    const FING5 = /(Left|Right)Hand(Thumb|Index|Middle|Ring|Pinky)\d\./;
    whenReady(cast.zav, (P) => {
      let n = 0;
      for (const name of Object.keys(P.acts)) { const A = P.acts[name], clip = A.getClip(), keep = clip.tracks.filter(t => !FING5.test(t.name));
        if (keep.length === clip.tracks.length) continue;
        const w = P.w[name] || 0, time = A.time; A.stop(); P.mixer.uncacheAction(clip);
        const A2 = P.mixer.clipAction(new THREE.AnimationClip(clip.name, clip.duration, keep)); A2.enabled = true; A2.setEffectiveWeight(w); A2.play(); A2.time = time;
        P.acts[name] = A2; n += clip.tracks.length - keep.length; }
      for (const b in P.bone) if (/(Left|Right)Hand(Thumb|Index|Middle|Ring|Pinky)\d$/.test(b)) { const q = bindLocal(P, P.bone[b]); if (q) P.bone[b].quaternion.copy(q); }
      if (n) console.log('HANDS5: ' + P.key + "'s fingers held as modelled (" + n + ' finger tracks out of his takes)');
    });
    /* (R39, 23 Nov: Chad, "Why does the middle finger keep sticking out like that". MEASURED on his file, never guessed
       (tools/probes/fingerskin.mjs, each finger's skin against its own bones): the end of Grandmaster Pho's right MIDDLE
       finger, 86 points of its skin from its last joint to its tip and past it, is carried by RightHandEnd, his rig's old end
       site under his hand (the finger graft renamed it and took it to carry nothing), never by the finger's own last bone; so
       when his fingers close round the stick, that fingertip stays where his open hand held it, straight out past the others.
       It pulls on the other fingertips too, as a second bone (made to follow the middle finger, it drew the ring finger's tip
       into the stick by 0.7 cm: measured before it went anywhere). So EACH POINT IT CARRIES IS GIVEN TO ITS OWN FINGER: the
       finger whose line (its first joint to its end, past it a third) is nearest the point at bind takes the end site's share
       on that finger's last bone, the point's other shares kept, its sum the same. The end site then carries nothing; at rest
       every point stands where it stood (the end site and each finger's last bone are both at their bind there), and closed,
       every tip goes with its own finger. On the geometry once, for every copy of him) */
    whenReady(cast.pho, (P) => {
      let moved = 0, meshes = 0;
      P.group.traverse(o => {
        if (!o.isSkinnedMesh || !o.skeleton) return;
        const sk = o.skeleton, g = o.geometry, bi = sk.bones.findIndex(b => /RightHandEnd$/.test(b.name));
        if (bi < 0 || !g || g.userData.end5) return; g.userData.end5 = true; meshes++;
        const lines = [];
        for (const f of ['Thumb', 'Index', 'Middle', 'Ring', 'Pinky']) {
          const idx = [1, 2, 3, 4].map(k => sk.bones.findIndex(b => new RegExp('RightHand' + f + k + '$').test(b.name))); if (idx.some(i => i < 0)) continue;
          const at = idx.map(i => new THREE.Vector3().setFromMatrixPosition(new THREE.Matrix4().copy(sk.boneInverses[i]).invert()));
          lines.push({ a: at[0], ab: at[3].clone().sub(at[0]), last: idx[2] }); }
        if (!lines.length) return;
        const si = g.attributes.skinIndex, sw = g.attributes.skinWeight, pos = g.attributes.position, v = new THREE.Vector3(), c = new THREE.Vector3();
        for (let i = 0; i < si.count; i++) {
          let slot = -1; for (let q = 0; q < 4; q++) if (si.getComponent(i, q) === bi && sw.getComponent(i, q) > 0) slot = q;
          if (slot < 0) continue;
          v.fromBufferAttribute(pos, i).applyMatrix4(o.bindMatrix);
          let best = null, bd = Infinity;
          for (const L of lines) { const t = Math.max(0, Math.min(1.33, v.clone().sub(L.a).dot(L.ab) / L.ab.lengthSq())), d = c.copy(L.a).addScaledVector(L.ab, t).distanceTo(v); if (d < bd) { bd = d; best = L; } }
          const w = sw.getComponent(i, slot); let to = -1; for (let q = 0; q < 4; q++) if (q !== slot && si.getComponent(i, q) === best.last) to = q;
          if (to >= 0) { sw.setComponent(i, to, sw.getComponent(i, to) + w); sw.setComponent(i, slot, 0); } else si.setComponent(i, slot, best.last);
          moved++; }
        si.needsUpdate = true; sw.needsUpdate = true; });
      if (meshes) console.log('HANDS5: ' + P.key + "'s fingertips each carried by their own finger (" + moved + ' points from the old end site RightHandEnd)');
    });

    /* (R35, 23 Nov: THE ARMS HELD TO A REAL BODY'S RANGE, after every take, in every pose: the class, never pose by pose. The
       joint check (tools/probes/jointscan.mjs, run over every take both men play here: e4c5hands.mjs) read Master Zavier's
       right shoulder thrown back 71 to 75 degrees in his run (a real shoulder's limit is near 60, a runner's back swing 45)
       and his right wrist turned 41 to 49 degrees toward his little finger through his bind (a real wrist's 30 to 40), and
       Grandmaster Pho's left shoulder back 66 to 71 in his run and his gold. Each frame, after the takes and his grip, each
       arm is read by jointscan's own measures (the same formulas, so the check and the limit never differ) and, only where
       it is near or past them, eased inside: the upper arm turned forward toward the body's front to LIM5.back (the forearm
       and hand going with it), and the hand turned on the wrist inside LIM5's bends (its twist and its fingers kept).
       A take's own value of each bone is kept as the mixer last wrote it (an unchanged bone is not written again:
       v11.5), so nothing stacks, and given back where the arm is inside its range. Grandmaster Pho's right arm is his grip's
       (PHOGRIP5 lays it) while the stick is in his hand) */
    /* (each limit SOFT: [the knee where it begins to give, the edge it never passes], degrees; between them the take's bend is
       eased toward the edge (tanh), so an arm swinging through it slows into it and comes back, never stops dead on a line:
       a hard stop holds a runner's arm still for a tenth of a second at the back of every swing) */
    const LIM5 = { back: [42, 54], toLittle: [-28, -38], toThumb: [14, 22], flex: [55, 68], bentBack: [-45, -57] }, D2R5 = Math.PI / 180;
    const softHi = (x, k, m) => (x <= k ? x : k + (m - k) * Math.tanh((x - k) / (m - k)));
    const softLo = (x, k, m) => (x >= k ? x : k - (k - m) * Math.tanh((k - x) / (k - m)));
    const _l = { a: new THREE.Vector3(), b: new THREE.Vector3(), c: new THREE.Vector3(), d: new THREE.Vector3(), e: new THREE.Vector3(), f: new THREE.Vector3(), g: new THREE.Vector3(),
      h: new THREE.Vector3(), i: new THREE.Vector3(), j: new THREE.Vector3(), q: new THREE.Quaternion(), r: new THREE.Quaternion(), s: new THREE.Quaternion() };
    function limKeep(L, b) { const S = L.get(b) || (L.set(b, { take: new THREE.Quaternion(), wrote: null }), L.get(b));
      if (!S.wrote || !b.quaternion.equals(S.wrote)) S.take.copy(b.quaternion); else b.quaternion.copy(S.take); return S; }
    function limTurn(S, b, rot) { b.parent.getWorldQuaternion(_l.r); b.getWorldQuaternion(_l.s);
      b.quaternion.copy(_l.r.invert().multiply(rot).multiply(_l.s)); S.wrote = b.quaternion.clone(); b.updateWorldMatrix(false, true); }
    function armLimit(P, skip) {
      const L = P.limState || (P.limState = new Map()), B = P.limBones || (P.limBones = {});
      const bo = (n) => (n in B ? B[n] : (B[n] = boneOf(P, n)));
      const lh = bo('LeftUpLeg'), rh = bo('RightUpLeg'), la = bo('LeftArm'), ra = bo('RightArm'); if (!lh || !rh || !la || !ra) return;
      /* (each arm's bones as the take left them, read afresh: what was written last frame and not written again is taken back) */
      for (const S0 of ['Left', 'Right']) { if (skip === S0) continue; for (const n of ['Shoulder', 'Arm', 'Hand']) { const b = bo(S0 + n); if (b) limKeep(L, b); } }
      /* (each collarbone's rise at bind, jointscan's neutral, read once from the skin's bind) */
      if (!P.limBind) { P.limBind = {}; const bp = (b) => { let at = null; P.group.traverse(o => { if (at || !o.isSkinnedMesh || !o.skeleton) return; const i = o.skeleton.bones.indexOf(b);
            if (i >= 0) at = new THREE.Vector3().setFromMatrixPosition(new THREE.Matrix4().copy(o.skeleton.boneInverses[i]).invert()); }); return at; };
        const blh = bp(lh), brh = bp(rh), bla = bp(la), bra = bp(ra);
        if (blh && brh && bla && bra) { const bU = bla.clone().add(bra).multiplyScalar(0.5).sub(blh.clone().add(brh).multiplyScalar(0.5)).normalize();
          for (const S0 of ['Left', 'Right']) { const c0 = bo(S0 + 'Shoulder') && bp(bo(S0 + 'Shoulder')), s0 = bp(bo(S0 + 'Arm')); if (!c0 || !s0) continue;
            const d = s0.sub(c0), u0 = d.dot(bU); P.limBind[S0] = Math.atan2(u0, d.addScaledVector(bU, -u0).length()) / D2R5; } } }
      P.group.updateWorldMatrix(true, false); for (const b of [lh, rh, la, ra]) b.updateWorldMatrix(true, false);
      const pa = la.getWorldPosition(_l.a), pb = ra.getWorldPosition(_l.b), mid = _l.c.copy(pa).add(pb).multiplyScalar(0.5);
      const U = _l.d.copy(mid).sub(_l.e.copy(lh.getWorldPosition(_l.e)).add(rh.getWorldPosition(_l.f)).multiplyScalar(0.5)).normalize();
      const Lf = _l.e.copy(pa).sub(pb); Lf.addScaledVector(U, -Lf.dot(U)).normalize(); const F = _l.f.crossVectors(Lf, U).normalize();
      for (const [S0, side] of [['Left', 1], ['Right', -1]]) {
        if (skip === S0) continue;
        const up = bo(S0 + 'Arm'), fo = bo(S0 + 'ForeArm'), hd = bo(S0 + 'Hand'); if (!up || !fo || !hd) continue;
        /* THE COLLARBONE raised (jointscan's 'raised': its rise from its root out to the shoulder joint over the plane square to
           the torso's up, against its bind): a shrug, lowered softly to its edge, allowed more as the arm is raised (a raised
           arm lifts its collarbone with it, about a sixth of its own rise: jointscan's edge 10 degrees over its bind with the
           arm hanging, 25 with it level, 41 overhead; eased from 5 under that edge) */
        { const cl = bo(S0 + 'Shoulder'), el1 = P.limBind[S0];
          if (cl && el1 != null) { cl.updateWorldMatrix(true, false); up.updateWorldMatrix(true, false); fo.updateWorldMatrix(true, false);
            const d = up.getWorldPosition(_l.g).sub(cl.getWorldPosition(_l.h)), u0 = d.dot(U), el0 = Math.atan2(u0, Math.sqrt(Math.max(0, d.lengthSq() - u0 * u0))) / D2R5;
            const ua = fo.getWorldPosition(_l.i).sub(up.getWorldPosition(_l.j)).normalize(), rise = Math.acos(Math.max(-1, Math.min(1, -ua.dot(U)))) / D2R5;
            const edge = 10 + 0.17 * rise, ex = el0 - el1, ex1 = softHi(ex, edge - 5, edge);
            /* (lowered EXACTLY by what is over: turned about the line square to the collarbone and the torso's up, which moves
               its rise and nothing else; eased toward its bind turn instead, the live build's check still read Master Zavier's
               bind 30 to 32 degrees over, the edge 28: a blend toward a turn is not a share of an angle) */
            if (ex1 < ex - 0.05) { const ax = _l.a.crossVectors(d, U); if (ax.lengthSq() > 1e-10) limTurn(L.get(cl), cl, _l.q.setFromAxisAngle(ax.normalize(), -(ex - ex1) * D2R5)); } } }
        /* THE SHOULDER thrown back (read on an arm below the level, as jointscan reads it) */
        { up.updateWorldMatrix(true, false); fo.updateWorldMatrix(true, false);
          const sh = up.getWorldPosition(_l.g), u = fo.getWorldPosition(_l.h).sub(sh).normalize(), dn = -u.dot(U), ext = Math.atan2(-u.dot(F), dn) / D2R5;
          const ext1 = softHi(ext, LIM5.back[0], LIM5.back[1]);
          if (ext1 < ext - 0.05 && dn > 0.2) { const lat = u.dot(Lf), k = Math.sqrt(Math.max(0, 1 - lat * lat)), a = ext1 * D2R5;
            const want = _l.i.copy(Lf).multiplyScalar(lat).addScaledVector(U, -Math.cos(a) * k).addScaledVector(F, -Math.sin(a) * k).normalize();
            limTurn(L.get(up), up, _l.q.setFromUnitVectors(u, want)); } }
        /* THE WRIST: the fingers' line against the forearm's, toward the palm or the back, toward the thumb or the little finger */
        const i1 = bo(S0 + 'HandIndex1'), m1 = bo(S0 + 'HandMiddle1'), k1 = bo(S0 + 'HandPinky1') || bo(S0 + 'HandRing1'); if (!i1 || !m1 || !k1) continue;
        fo.updateWorldMatrix(true, false); for (const b of [hd, i1, m1, k1]) b.updateWorldMatrix(true, false);
        const el = fo.getWorldPosition(_l.g), wr = hd.getWorldPosition(_l.h), e = _l.i.copy(wr).sub(el).normalize();
        const f = m1.getWorldPosition(_l.j).sub(wr).normalize(), ac = i1.getWorldPosition(_l.a).sub(k1.getWorldPosition(_l.b)); ac.addScaledVector(f, -ac.dot(f)).normalize();
        const n = _l.b.crossVectors(f, ac).multiplyScalar(side).normalize(), ne = n.addScaledVector(e, -n.dot(e)).normalize(), re = ac.addScaledVector(e, -ac.dot(e)).normalize();
        const fe = f.dot(e); if (fe < 0.05) continue;
        const wf = Math.atan2(f.dot(ne), fe) / D2R5, wd = Math.atan2(f.dot(re), fe) / D2R5;
        const wf1 = softLo(softHi(wf, LIM5.flex[0], LIM5.flex[1]), LIM5.bentBack[0], LIM5.bentBack[1]), wd1 = softLo(softHi(wd, LIM5.toThumb[0], LIM5.toThumb[1]), LIM5.toLittle[0], LIM5.toLittle[1]);
        if (Math.abs(wf1 - wf) < 0.05 && Math.abs(wd1 - wd) < 0.05) continue;
        const want = _l.c.copy(e).addScaledVector(ne, Math.tan(wf1 * D2R5)).addScaledVector(re, Math.tan(wd1 * D2R5)).normalize();
        limTurn(L.get(hd), hd, _l.q.setFromUnitVectors(f, want));
      }
      /* (where an arm is in its range again, its take's own values stand: limKeep has put them back, and nothing was written) */
      for (const [b, S] of L) if (S.wrote && !b.quaternion.equals(S.wrote)) S.wrote = null;
    }
    const limHook = new THREE.Object3D(); limHook.name = 'the arms held to a real range';
    limHook.updateMatrixWorld = function (force) {
      try {
        for (const [P, skip] of [[cast.zav, null], [cast.pho, typeof PHOGRIP5 === 'object' && PHOGRIP5.k() > 0 ? 'Right' : null]])
          if (P && P.ready && P.group.visible) armLimit(P, skip);
      } catch (e) { if (!limHook.failed) { limHook.failed = true; console.warn('LIM5 threw: ' + (e && e.message)); } }
      THREE.Object3D.prototype.updateMatrixWorld.call(this, force);
    };
    world.children.unshift(limHook); limHook.parent = world;

    /* until he has a rest, the moment of his own walk where he most nearly stands (measured on his file, 21 Nov: at 0.03 s
       his feet 17 cm apart and level within 6 cm, his hands at his sides; the 0.27 s first held was mid-stride, his feet
       68 cm apart) */
    const ZAV_STAND5 = 0.03;
    /* THE COLLECTOR (people/RECORD.md 3b: ONE level, his full body, 314,540 triangles, drawn at every distance: he sits
       across the table inside 2.2 m), at his cushion at the table's west end. Seated by his own body on the cushion
       (o.seat.down: his bottom on it, each leg laid down to the floor from there). His four takes, as CAST-2 measured them
       (21 Nov): the sit (the hermit's, retargeted) holds his collar bones 12 to 23 degrees raised, the library take's own
       shrug, so it is let down (`shoulders`), and turns his head up to 57 degrees, so his head is damped as Grandmaster
       Pho's seated talk is (0.3); the stand (Jun's Idle_3) and his own walk are clean; the standing talk (Mr Koh's) slopes
       his shoulders and stands his collar off his neck: NEVER CAST HERE (he talks seated). His hands are each one rigid
       piece, the fingers spread: no shot shows him gripping a piece (they are laid on a cut, the case moved by itself) */
    { const S0 = at0('table', 'collector');
      cast.col = mkPerson('p5collector', S0.x, S0.z, S0.ry, { take: 'Sitting_Answering_Questions', centre: true, hidden: true, skins: false,
        win: { Sitting_Answering_Questions: [0.2, 1.2, 9] }, talk: 'Sitting_Answering_Questions', blobW: 0.8, blobD: 0.8,
        seat: { y: CUSHION_TOP, takes: /^Sit/, down: Object.assign({}, MASTER_DOWN, { hipOver: 0.1, edge: -9 }) },
        shoulders: { Sitting_Answering_Questions: 0.5, Idle_3: 1 },              // (the sit's shrug let down half: let down whole, his collar stood off his neck in the close shot: collector-00015)
        headDamp: { Sitting_Answering_Questions: [0.3, 'Sitting_Answering_Questions'] } });
      cast.col.home = { x: S0.x, z: S0.z, ry: S0.ry }; }

    /* (each phase's places for them are the play's: c_play.js castPhase, from the world's STATION; a film that hands to a
       phase leaves them there: c_yfilm.js endPhase5) */

    /* ---------------------------------------------------------------- THE NAGA STICK IN A HAND (w5nagastaff, made from
       Chad's photograph: R2; 1.40 m on its own foot, its head at the top). It is ONE thing (the world's, stage.things),
       carried by whoever the story gives it to: Ton wrapped (w5staffwrap, on both palms, as a sacred thing is carried),
       Ton unwrapped, held out to his teacher on both palms; Grandmaster Pho upright in his right hand, its foot on the
       paving, its shaft through his hand (laid there from his standing rest and carried by his hand bone after, so it goes
       where his hand goes in every take); and Ton again in both hands after. Never levelled at a person (the plan's 5.3) */
    const STICK_LEN = 1.40;
    const _stA = new THREE.Vector3(), _stB = new THREE.Vector3(), _stM = new THREE.Matrix4(), _stQ = new THREE.Quaternion(), _stS = new THREE.Vector3();
    const _stC = new THREE.Vector3(), _stD = new THREE.Vector3(), _stE = new THREE.Vector3(), _stF = new THREE.Vector3();
    /* R65 (23 Nov 2026, Chad: "when ton hands over the naga stick, it does not properly sit in his hands, instead it is
       floating higher. Fix it properly"). Measured (tools/probes/e4c5palms.mjs, the preparation film at 4.6 to 7.6 s): its
       underside stood 1.1 cm over the skin of his right palm and 5.5 cm over his left. The cause is the stick's own file: its
       shaft does not run along its origin's line. Prep set the origin on the middle of its box's foot, and the carved head at
       its top leans 0.17 m to one side, so the shaft stands 0.066 to 0.134 m off that line along its local x (its slices every
       5 cm, read from the file); laid by its origin with that x turned up, the whole shaft rode 9 cm high. It is laid now by
       ITS OWN UNDERSIDE (the lowest of its drawn points within a palm's width of each palm, read once from its mesh: STICKUNDER5)
       on EACH PALM'S OWN TOP: of the hand's own points (those its hand bone carries, no finger) within 3 cm of the palm's middle
       across the palm, the farthest out on the palm's side, in the hand bone's own frame so the hand carries it (PALMSKIN5:
       Ton's, read at 4.6 and 7.6 s, the same at both). And laid on it only once HIS WRISTS ARE A REAL OFFERING HOLD: read as
       tools/probes/jointscan.mjs reads a wrist, his 'give' bends them back 30 to 38 degrees and toward the thumb 35 to 44 (a
       real wrist stops near 25 that way, and an offering hand holds it near straight), so his hands pointed down 21 to 35
       degrees at the fingers and a stick on them could rest only on their heels, which from the films' lenses read as his
       wrists. palmsHold5 turns each hand on its wrist alone (the swing that carries its fingers' line, keeping the turn the
       forearm gives it) until the fingers' line stands 12 degrees back and 6 toward the thumb from the forearm's, a hand held
       out to offer; the forearm, the elbow and the shoulder are the take's. Laid after the mixer on the turn the mixer last
       wrote (a hand it did not write again this frame keeps its base: nothing stacks, v11.5) */
    const PALMSKIN5 = { e4ton: { Left: [0.0472, 0.0588, -0.0064], Right: [-0.0366, 0.0649, -0.0006] } };
    const PALMHOLD5 = { e4ton: { flex: -12, dev: 6 } };            // (degrees: + toward the palm, + toward the thumb)
    function palmSkin5(P, sd, out) {
      const o = PALMSKIN5[P.key] && PALMSKIN5[P.key][sd], hb = o && boneOf(P, sd + 'Hand');
      return hb ? hb.localToWorld(out.set(o[0], o[1], o[2])) : null;
    }
    const _phE = new THREE.Vector3(), _phF = new THREE.Vector3(), _phA = new THREE.Vector3(), _phN = new THREE.Vector3(), _phT = new THREE.Vector3(), _phQ = new THREE.Quaternion(), _qI5 = new THREE.Quaternion();
    function palmsHold5(P, k = 1) {
      const def = P && P.ready && PALMHOLD5[P.key]; if (!def || !(k > 1e-4)) return;
      const keep = P.__hold5 || (P.__hold5 = {}), D = Math.PI / 180;
      for (const [sd, side] of [['Left', 1], ['Right', -1]]) {
        const hb = boneOf(P, sd + 'Hand'), m1 = boneOf(P, sd + 'HandMiddle1'), i1 = boneOf(P, sd + 'HandIndex1'), k1 = boneOf(P, sd + 'HandPinky1') || boneOf(P, sd + 'HandRing1');
        if (!hb || !m1 || !i1 || !k1) continue;
        const r = keep[sd] || (keep[sd] = { base: new THREE.Quaternion(), wrote: new THREE.Quaternion(), has: false });
        if (!r.has || !hb.quaternion.equals(r.wrote)) r.base.copy(hb.quaternion);
        /* (all in the forearm's frame, the hand bone's parent: its long line toward the wrist is the hand bone's own place) */
        _phE.copy(hb.position).normalize();
        _phF.copy(m1.position).normalize().applyQuaternion(r.base);                       // (the fingers' line as the take holds it)
        _phA.copy(i1.position).sub(k1.position).applyQuaternion(r.base); _phA.addScaledVector(_phF, -_phA.dot(_phF)).normalize();   // (across the knuckles, toward the thumb)
        _phN.crossVectors(_phF, _phA).multiplyScalar(side).normalize();                   // (the way the palm faces)
        const ne = _phN.addScaledVector(_phE, -_phN.dot(_phE)).normalize(), re = _phA.addScaledVector(_phE, -_phA.dot(_phE)).normalize();
        _phT.copy(_phE).addScaledVector(ne, Math.tan(def.flex * D)).addScaledVector(re, Math.tan(def.dev * D)).normalize();
        _phQ.setFromUnitVectors(_phF, _phT); if (k < 1) _phQ.slerp(_qI5, 1 - k);
        hb.quaternion.copy(_phQ).multiply(r.base);
        r.wrote.copy(hb.quaternion); r.has = true; hb.updateMatrixWorld(true); }
    }
    const STICKUNDER5 = new WeakMap();
    function stickUnder5(g) {
      if (STICKUNDER5.has(g)) return STICKUNDER5.get(g);
      const N = Math.round(STICK_LEN * 100) + 1, lo = new Float32Array(N).fill(Infinity), M = new THREE.Matrix4(), v = new THREE.Vector3();
      g.updateWorldMatrix(true, true); const inv = new THREE.Matrix4().copy(g.matrixWorld).invert(); let any = false;
      g.traverse(m => { if (!m.isMesh || !m.geometry || !m.geometry.attributes.position) return; any = true;
        M.multiplyMatrices(inv, m.matrixWorld); const A = m.geometry.attributes.position;
        for (let i = 0; i < A.count; i++) { v.fromBufferAttribute(A, i).applyMatrix4(M); const j = Math.round(v.y * 100); if (j >= 0 && j < N && v.x < lo[j]) lo[j] = v.x; } });
      if (!any) return null;                                     // (not landed yet: nothing is drawn, read it when it is)
      const out = { under(y, w = 0.035) { let m = Infinity; for (let j = Math.max(0, Math.round((y - w) * 100)); j <= Math.min(N - 1, Math.round((y + w) * 100)); j++) m = Math.min(m, lo[j]);
                                           return isFinite(m) ? m : 0.09; } };
      STICKUNDER5.set(g, out); return out;
    }
    /* each palm's middle (halfway from its wrist to its middle finger's root, as chapter 3 laid the roll: e4c3 matOnArms) */
    function palmOf(P, sd, out) {
      const hb = boneOf(P, sd + 'Hand'), kb = boneOf(P, sd + 'HandMiddle1');
      if (!hb) return null; hb.getWorldPosition(out); if (kb) out.lerp(kb.getWorldPosition(_stS), 0.5); return out;
    }
    const STICK5 = {
      who: 'away', off: null,
      grip: null,                                   // (R25/R26: his closed hand round it, c_fightstage.js PHOGRIP5, where his hand has fingers)
      /* who carries it: 'pho' (upright in his right hand), 'ton' (held out on his palms), 'tonWrap' (wrapped, on his
         palms), 'planted' (standing by itself where it was set: TOGETHER), 'away' */
      to(who) { this.who = who; const g = things.nagaStaff, w = things.staffWrap; if (!g) return;
        if (who === 'pho') { whenReady(cast.pho, (P) => this.inHand(P)); }
        else if (g.parent !== world) { g.updateWorldMatrix(true, false); world.attach(g); }
        g.visible = who === 'pho' || who === 'ton' || who === 'planted';
        if (w) w.visible = who === 'tonWrap'; },
      /* laid in his right hand from his standing rest (once: the offset is kept), and carried by the hand bone */
      inHand(P) {
        const g = things.nagaStaff, hb = boneOf(P, 'RightHand'); if (!g || !hb) return;
        if (!this.off && this.grip) this.off = this.grip.offset(P);                 // (R25: through his closed fist, where his hand has fingers)
        if (!this.off) {
          const keep = {}; for (const k in P.acts) keep[k] = [P.acts[k].time, P.w[k]];
          const cur = P.cur, ft = P.filmT, gp = P.group.position.clone(), gr = P.group.rotation.y;
          pose(P, 'Sit_to_Stand_Transition_M', 5.9); P.group.updateWorldMatrix(true, true);
          const pm = palmOf(P, 'Right', _stA); const foot = _stB.set(pm.x, 0, pm.z);
          /* the stick upright, its foot on the paving under his palm, its Naga's head turned with his front */
          _stM.compose(foot, _stQ.setFromAxisAngle(_stS.set(0, 1, 0), gr), _stS.set(1, 1, 1));
          hb.updateWorldMatrix(true, false); this.off = new THREE.Matrix4().copy(hb.matrixWorld).invert().multiply(_stM);
          for (const k in P.acts) { P.acts[k].time = keep[k][0]; P.w[k] = keep[k][1]; P.acts[k].setEffectiveWeight(keep[k][1]); }
          P.cur = cur; P.filmT = ft; P.group.position.copy(gp); P.group.rotation.y = gr; P.mixer.update(0);
        }
        if (g.parent !== hb) hb.add(g);
        this.off.decompose(g.position, g.quaternion, g.scale); g.visible = true;
      },
      /* laid along both palms of a body (each palm's middle; chapter 3's roll on Ton's 'give'), the thing's own length on
         its local x for the wrapped staff and its local y for the stick; called after the body is posed, every frame */
      onPalms(P, which = 'stick') {
        const g = which === 'wrap' ? things.staffWrap : things.nagaStaff; if (!g || !P || !P.ready) return false;
        if (g.parent !== world) world.attach(g);
        palmsHold5(P);                                              // (R65: his wrists an offering hold under it first)
        P.group.updateWorldMatrix(true, true);
        const L = palmOf(P, 'Left', _stA), R = palmOf(P, 'Right', _stB); if (!L || !R) return false;
        const dx = R.x - L.x, dz = R.z - L.z, dy = R.y - L.y, hl = Math.hypot(dx, dz), yaw = Math.atan2(-dz, dx);
        const mid = L.clone().add(R).multiplyScalar(0.5); mid.y += 0.02;
        if (which === 'wrap') { g.position.copy(mid); g.rotation.set(0, yaw, Math.atan2(dy, hl), 'YXZ'); }
        else { /* the stick's length is its y: laid down along the palms' line, its head to his left hand's side; its underside
                  on each palm's skin (R65: the line its origin runs along set under each palm by the stick's own underside there;
                  3 mm over the skin's highest points, resting on them) */
          const pr = stickUnder5(g), sL = palmSkin5(P, 'Left', _stC), sR = palmSkin5(P, 'Right', _stD);
          let aL = L, aR = R, lift = 0.02;
          if (pr && sL && sR) { const d = Math.hypot(dx, dy, dz);
            aL = _stE.set(L.x, sL.y - pr.under(STICK_LEN * 0.5 + d * 0.5), L.z); aR = _stF.set(R.x, sR.y - pr.under(STICK_LEN * 0.5 - d * 0.5), R.z); lift = 0.003; }
          const ex = aR.x - aL.x, ez = aR.z - aL.z, ey = aR.y - aL.y, el = Math.hypot(ex, ez);
          g.position.set((aL.x + aR.x) * 0.5, (aL.y + aR.y) * 0.5 + lift, (aL.z + aR.z) * 0.5); g.rotation.set(0, Math.atan2(-ez, ex), Math.PI / 2 + Math.atan2(ey, el), 'YXZ');
          g.translateY(-STICK_LEN * 0.5); }
        g.visible = true; navCarried(P, g); return true; },
      /* (R65: its underside read from its mesh once it has landed: stickUnder5) */
      warm() { const g = things.nagaStaff; if (g) stickUnder5(g); },
      /* stood upright by itself at a point (the Naga's film: planted, "the stick stands by itself once planted") */
      /* (R75's debug, B2: carried upright in his right fist while he walks, its foot clear of the floor and drawn out from his
         hips by a hand's width, as the wrapped staff is in the opening (CARRY5): laid palm to palm while his hands swung at
         his sides, it went level through his hips at every stride into the lift) */
      carryUp(P) { const g = things.nagaStaff; if (!g || !P || !P.ready) return false;
        if (g.parent !== world) world.attach(g);
        P.group.updateWorldMatrix(true, true); const pm = palmOf(P, 'Right', _stA); if (!pm) return false;
        let x = pm.x, z = pm.z;
        if (P.hips) { P.hips.getWorldPosition(_stB); const dx = pm.x - _stB.x, dz = pm.z - _stB.z, dl = Math.hypot(dx, dz); if (dl > 1e-4) { x += dx / dl * 0.05; z += dz / dl * 0.05; } }
        g.position.set(x, Math.max(P.group.position.y + 0.03, pm.y - 0.78), z); g.rotation.set(0, P.group.rotation.y, 0);
        g.visible = true; navCarried(P, g); return true; },
      plant(x, z, ry = 0) { const g = things.nagaStaff; if (!g) return; if (g.parent !== world) world.attach(g); g.position.set(x, 0, z); g.rotation.set(0, ry, 0); g.visible = true; this.who = 'planted'; },
      /* the wrapped stick carried upright in Ton's right hand, its foot a hand over the floor (laid from his standing rest
         once and carried by the hand bone: c_yfilm.js handHold5), while he is its carrier */
      wrapOff: null,
      carry(P) { if (this.who !== 'tonWrap' || !P || !P.ready || !things.staffWrap) return;
        this.wrapOff = handHold5(P, 'Right', things.staffWrap, this.wrapOff, { upright: true, foot: 0.06, ry: Math.PI / 2, out: 0 }); }   // (R33 F4: in his fist, c_yfilm.js CARRY5; was out 0.07 from a hanging hand)
    };
    /* the nine as the play reaches them (c_play.js praiOf: cast.prai) */
    Object.defineProperty(cast, 'prai', { get: () => PRAI5.list, enumerable: false });

    /* ---------------------------------------------------------------- THE NINE (the plan's 9.2; people/RECORD.md)
       "Seen as a woman's standing shape, faceless, of black oil with a pale sheen moving over it", each with "a thin pale
       edge of light, so that a black shape reads on a dark court on a phone" (v24.12: never a test of eyesight). Three
       bodies, one for each kind, nine of them: the lesson's and the fight's eight in the rules' own order (FIGHT.NUM
       kinds3: comes, slips, hides, comes, slips, hides, slips, hides), the body each kind wears below.
       TWO LOOKS, one body: (1) IN SPIRIT VISION (the hunt, and the preparation through his eyes): the body moved to the
       vision's layer, laid on the vision's picture as BLACK (its spirit's colour black: the vision lays a colour by its
       own strength, so black reads on its white negative), with a twin of pale light round its edge, shimmering; seen
       nowhere else, and where the wave has reached. (2) IN THE TRANCE (from the turn of the preparation to the bag tied:
       the fight is seen with his senses open, the plan's 5.6): a twin in the world's own layer, near black and oily, its
       edge pale, a sheen sliding down it. Hidden until asked for. The hands stay spread as made (no finger bones): the
       body is drawn as oil and light, not as its paint */
    const PRAI_KINDS = ['comes', 'comes', 'slips', 'hides', 'comes', 'slips', 'hides', 'slips', 'hides'];
    const PRAI_BODY = { comes: 'p5praicome', slips: 'p5praiheavy', hides: 'p5praihide' };
    /* where the nine stand all evening (the hunt: "nine still figures, heads bowed, all facing the doors of the house",
       between where he walks, clear of the path's middle), the court's metres; and where each stands when the fight
       begins (the lesson's in the middle, the others where they enter from) */
    const PRAI_STAND = [[-1.2, 1.9], [0.9, 2.3], [-0.2, 1.2], [1.35, 0.6], [-1.45, 0.15], [0.55, -0.4], [-0.75, -0.95], [1.25, -1.45], [-1.3, -1.9]];
    const PRAI_LOOK = { body: 0x050507, edge: 0xd6dbe8, sheen: 0x9aa2bc };
    const PRAI_EDGE = { color: 0xdfe4f0, fill: 0.0, rim: 1.35, power: 2.6, flicker: 0.45, xray: 0 };
    const PRAI_FILL = { color: 0x000000, fill: 0.92, rim: 0.0, power: 2.0, flicker: 0.0, xray: 0 };
    const PRAI_SHADE = /gl_FragColor\s*=\s*vec4\(\s*normalize\(\s*normal\s*\)\s*\*\s*0\.5\s*\+\s*0\.5\s*,\s*diffuseColor\.a\s*\);/;
    /* R100 (24 Nov 2026, Chad: "it still looks simplistic to me, not quite AAA game quality"): THE EFFECTS' LIGHT. Four
       lights of the fight's own (a fireball, a burst, the gold, the violet), never three's lights: no light is added to the
       scene (v9.4, v15.1: a light's count builds shaders on screen and costs the phone a shadow pass), so the count never
       changes; the court's own lit surfaces, the two of them and the nine each carry a few lines that read these four and add
       their light as a light's (falling off with distance, brighter on a side that faces it, a little on the other).
       Their places are put in the lens's frame as the picture is drawn, their colours and strengths each frame of the fight
       (c_fightstage.js fxlHook, fxlFrame); outside it there are none (uFxlN 0: the same picture as before) */
    const FXL5 = { V: [0, 1, 2, 3].map(() => new THREE.Vector4()), W: [0, 1, 2, 3].map(() => new THREE.Vector4()), C: [0, 1, 2, 3].map(() => new THREE.Vector4()), done: new WeakSet(), counts: null };
    FXL5.U = { uFxlV: { value: FXL5.V }, uFxlC: { value: FXL5.C }, uFxlN: { value: 0 } };
    FXL5.GLSL = 'uniform vec4 uFxlV[4];\nuniform vec4 uFxlC[4];\nuniform float uFxlN;\n'
      + 'vec3 fxlAt(vec3 vp, vec3 nv) { vec3 s = vec3(0.0);\n'
      + '  for (int i = 0; i < 4; i++) { if (float(i) >= uFxlN) break;\n'
      + '    vec3 lp = uFxlV[i].xyz - vp; float d2 = dot(lp, lp), r = uFxlV[i].w, win = clamp(1.0 - d2 / (r * r), 0.0, 1.0);\n'
      + '    s += uFxlC[i].rgb * (win * win / (1.0 + 2.5 * d2)) * (0.15 + 0.85 * max(dot(nv, lp * inversesqrt(max(d2, 1e-6))), 0.0)); }\n'
      + '  return s; }\n';
    /* (a lit material given them: its own light first, then these four added as direct light on the same surface; a patch
       made before (Grandmaster Pho's look D) runs first and is kept, and his unlit skin carries them too) */
    function fxlPatch(m) {
      if (!m || FXL5.done.has(m) || !(m.isMeshStandardMaterial || m.isMeshLambertMaterial || m.isMeshPhongMaterial)) return false;
      FXL5.done.add(m);
      const prev = m.onBeforeCompile, pk = m.customProgramCacheKey;
      m.onBeforeCompile = function (sh, r) { if (prev) prev.call(this, sh, r);
        const at = '#include <lights_fragment_end>';
        if (sh.fragmentShader.indexOf(at) < 0) return;
        Object.assign(sh.uniforms, FXL5.U);
        let fs = sh.fragmentShader.replace(at, at + '\nvec3 fxlD = fxlAt(geometryPosition, geometryNormal);\nreflectedLight.directDiffuse += fxlD * BRDF_Lambert(material.diffuseColor);');
        fs = fs.replace('vec3 unl = diffuseColor.rgb * uLevel;', 'vec3 unl = diffuseColor.rgb * (uLevel + fxlD * 0.3183);');
        sh.fragmentShader = FXL5.GLSL + fs; };
      m.customProgramCacheKey = function () { return (pk ? pk.call(this) : '') + ':fxl5'; };
      m.needsUpdate = true; return true;
    }
    const praiU = { uPT: { value: 0 }, uPBody: { value: new THREE.Color(PRAI_LOOK.body) }, uPEdge: { value: new THREE.Color(PRAI_LOOK.edge) }, uPSheen: { value: new THREE.Color(PRAI_LOOK.sheen) } };
    function praiTranceMat() {
      const m = new THREE.MeshNormalMaterial({ side: THREE.FrontSide }); mats.push(m);
      m.transparent = true; m.depthWrite = true; m.fog = false; m.toneMapped = false;
      const U = Object.assign({ uPA: { value: 1 }, uPCool: { value: 0 } }, praiU);
      m.onBeforeCompile = (sh) => { Object.assign(sh.uniforms, U, FXL5.U);
        sh.vertexShader = 'varying vec3 vPw;\n' + sh.vertexShader.replace('#include <project_vertex>', '#include <project_vertex>\n  vPw = (modelMatrix * vec4(transformed, 1.0)).xyz;');
        /* (R47: COOLED by the Naga's water (uPCool, PRAI5.cool): its black turned a wet dark slate, its edge a pale blue-grey,
           its sheen running stronger, as a wet thing shines) */
        const out = sh.fragmentShader.replace(PRAI_SHADE,
          `vec3 pN = normalize(normal); float pf = pow(1.0 - clamp(abs(pN.z), 0.0, 1.0), 2.2);
           float ps = pow(0.5 + 0.5 * sin(vPw.y * 5.0 - uPT * 1.3 + vPw.x * 1.7 + vPw.z * 1.1), 10.0);
           vec3 pc = mix(uPBody, uPEdge, pf * 0.85) + uPSheen * ps * 0.28 * (1.0 - pf);
           vec3 pw = mix(vec3(0.04, 0.065, 0.09), vec3(0.58, 0.7, 0.82), pf * 0.8) + vec3(0.45, 0.58, 0.72) * ps * 0.5 * (1.0 - pf);
           pc = mix(pc, pw, uPCool);
           pc += fxlAt((viewMatrix * vec4(vPw, 1.0)).xyz, pN) * 0.3;
           gl_FragColor = vec4(pc, uPA * (0.9 + 0.1 * pf));`);
        if (out === sh.fragmentShader) console.warn('e4c5: the Prai\'s trance look found no colour line to write (three changed?)');
        sh.fragmentShader = 'varying vec3 vPw;\nuniform vec3 uPBody, uPEdge, uPSheen;\nuniform float uPT, uPA, uPCool;\n' + FXL5.GLSL + out; };
      m.customProgramCacheKey = () => 'e4c5praiTrance:fxl5';
      m.userData.U = U; return m;
    }
    /* R43 (23 Nov 2026, Chad: "add a red flaming effect to every prai around their silhouette"): a THIRD twin of each body in
       the trance (the fight, and the films from the turn to the bag tied), swelled out along its own normals by a flicker
       that rises up the body as flame does, and drawn ADDITIVE and only toward its edges (the body's face to the lens stays
       black: the flame stands round the silhouette), deep red at its roots, orange, yellow at its brightest tips; its
       strength the body's own (PRAI5.alpha). Painted light: no light added (v9.4). In Spirit Vision (the hunt) the nine
       keep the vision's look (its black and its pale edge on the white of the vision's picture) */
    /* (inflate and lick in METRES of the world: the bodies are built in centimetres under an armature of 0.01, so the swell is
       divided by the mesh's own scale in its shader; the first build swelled them 0.3 mm and the flame lay on the body, every
       thin limb orange across its whole width: the picture of build 34. Its band only where the shell turns from the lens) */
    const PRAI_FLAME = { inflate: 0.016, lick: 0.022, speed: 1.9, gain: 0.62 };   /* (R45: now only the heat at the flames' roots, deep red: the flames themselves are FIRE5's) */
    const praiFlameU = { uFT: { value: 0 } };
    const PRAI_NOISE = `float pfH(vec3 p) { return fract(sin(dot(p, vec3(127.1, 311.7, 74.7))) * 43758.5453); }
      float pfN(vec3 p) { vec3 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
        return mix(mix(mix(pfH(i), pfH(i + vec3(1.0, 0.0, 0.0)), f.x), mix(pfH(i + vec3(0.0, 1.0, 0.0)), pfH(i + vec3(1.0, 1.0, 0.0)), f.x), f.y),
                   mix(mix(pfH(i + vec3(0.0, 0.0, 1.0)), pfH(i + vec3(1.0, 0.0, 1.0)), f.x), mix(pfH(i + vec3(0.0, 1.0, 1.0)), pfH(i + vec3(1.0, 1.0, 1.0)), f.x), f.y), f.z); }\n`;
    function praiFlameMat() {
      const m = new THREE.MeshNormalMaterial({ side: THREE.FrontSide }); mats.push(m);
      m.transparent = true; m.depthWrite = false; m.fog = false; m.toneMapped = false; m.blending = THREE.AdditiveBlending;
      const U = Object.assign({ uFA: { value: 1 } }, praiFlameU), F = PRAI_FLAME;
      m.onBeforeCompile = (sh) => { Object.assign(sh.uniforms, U);
        const vs = sh.vertexShader.replace('#include <skinning_vertex>', `#include <skinning_vertex>
          { vec3 fw0 = (modelMatrix * vec4(transformed, 1.0)).xyz, on = normalize(objectNormal);
            float sc = max(1e-6, length(modelMatrix[0].xyz));
            float fl = pfN(vec3(fw0.x * 5.0, fw0.y * 3.2 - uFT * ${F.speed.toFixed(2)}, fw0.z * 5.0));
            transformed += on * ((${F.inflate.toFixed(3)} + ${F.lick.toFixed(3)} * fl * (0.55 + 0.45 * clamp(on.y * 0.5 + 0.5, 0.0, 1.0))) / sc); }`)
          .replace('#include <project_vertex>', '#include <project_vertex>\n  vFw = (modelMatrix * vec4(transformed, 1.0)).xyz;');
        if (vs === sh.vertexShader) console.warn('e4c5: the Prai\'s flame found no skinning line to swell (three changed?)');
        sh.vertexShader = 'varying vec3 vFw;\nuniform float uFT;\n' + PRAI_NOISE + vs;
        const out = sh.fragmentShader.replace(PRAI_SHADE,
          `vec3 fN0 = normalize(normal); float rim = smoothstep(0.35, 0.95, 1.0 - clamp(abs(fN0.z), 0.0, 1.0));
           float n1 = pfN(vec3(vFw.x * 6.0, vFw.y * 4.5 - uFT * 2.6, vFw.z * 6.0)), n2 = pfN(vec3(vFw.x * 13.0, vFw.y * 9.0 - uFT * 4.1, vFw.z * 13.0));
           float fire = clamp(rim * rim * (0.55 + 0.9 * n1) * (0.65 + 0.7 * n2), 0.0, 1.0);
           vec3 col = mix(vec3(0.42, 0.0, 0.0), vec3(0.95, 0.1, 0.015), smoothstep(0.2, 0.75, fire));
           gl_FragColor = vec4(col * fire * ${F.gain.toFixed(2)} * uFA, 1.0);`);
        if (out === sh.fragmentShader) console.warn('e4c5: the Prai\'s flame found no colour line to write (three changed?)');
        sh.fragmentShader = 'varying vec3 vFw;\nuniform float uFT, uFA;\n' + PRAI_NOISE + out; };
      m.customProgramCacheKey = () => 'e4c5praiFlame';
      m.userData.U = U; return m;
    }
    /* R44 and R45 (23 Nov 2026, Chad, of build 35's pictures: "That does not look like flame edge to me, where are the
       flames? Its just an orange edge"; "I meant the flame edge has to look like its on fire."): THE PRAI ON FIRE. The rim
       above stays, the glow at the flames' roots; over it each body now BURNS. (1) Tongues of flame standing on its outline:
       cards, each on one of its own bones and SKINNED to it (so a flame rides its body in every frame of every film, of the
       fight and of play, whoever ticks the look), turned to the lens round the upright and set out to the side of the
       outline the lens sees (a limb's outer side; both sides of the head, the neck, the chest, the waist and the hips; one
       up off the crown, the hands and the feet), rising, swaying and flickering, torn into tongues at their tips, deep red at
       their edges, red-orange in, a little yellow only at the hottest root; additive and tested against depth, so the body
       hides the flame behind it and the fire stands round its silhouette, lapping a little over its edge. (2) Embers rising
       off it, drifting and dying. (3) Its fire's light on the paving under it, a painted pool that breathes with the flames.
       Painted light, no light added (v9.4); caught over half a second as the trance's look turns on. Sized in the world's
       metres (the bodies are built in centimetres: the lesson of build 34) */
    const FIRE5 = { fwd: 0.05, catchS: 0.55, emb: { rate: 9, rateLow: 5, life: [0.7, 1.4], up: [0.45, 0.95], size: [0.016, 0.034] }, pool: { r: 0.75, a: 0.5 } };
    /* [its bone, a second bone (the card halfway between) or null, its side (0 on the bone, 1 both sides, 2 the side away
       from the body's middle as the lens sees it), how far out (m; 'W' the body's own half-width at the chest, 'M' at the
       waist, 'H' at the hips), the card's width and height (m)] */
    const FIRE_AT = [
      ['head_end', null, 0, 0, 0.3, 0.62], ['Head', null, 1, 0.08, 0.2, 0.42], ['neck', null, 1, 0.1, 0.22, 0.42],
      ['LeftArm', null, 2, 0.07, 0.26, 0.52], ['RightArm', null, 2, 0.07, 0.26, 0.52],
      ['LeftArm', 'LeftForeArm', 2, 0.055, 0.22, 0.44], ['RightArm', 'RightForeArm', 2, 0.055, 0.22, 0.44],
      ['LeftForeArm', null, 2, 0.05, 0.2, 0.4], ['RightForeArm', null, 2, 0.05, 0.2, 0.4],
      ['LeftForeArm', 'LeftHand', 2, 0.045, 0.19, 0.36], ['RightForeArm', 'RightHand', 2, 0.045, 0.19, 0.36],
      ['LeftHand', null, 0, 0, 0.2, 0.4], ['RightHand', null, 0, 0, 0.2, 0.4],
      ['Spine', null, 1, 'W', 0.28, 0.56], ['Spine01', null, 1, 'M', 0.26, 0.5], ['Spine02', null, 1, 'H', 0.25, 0.46], ['Hips', null, 1, 'H', 0.24, 0.42],
      ['LeftUpLeg', 'LeftLeg', 2, 0.07, 0.22, 0.4], ['RightUpLeg', 'RightLeg', 2, 0.07, 0.22, 0.4],
      ['LeftLeg', null, 2, 0.055, 0.2, 0.36], ['RightLeg', null, 2, 0.055, 0.2, 0.36],
      ['LeftLeg', 'LeftFoot', 2, 0.05, 0.18, 0.32], ['RightLeg', 'RightFoot', 2, 0.05, 0.18, 0.32],
      ['LeftFoot', null, 0, 0, 0.2, 0.3], ['RightFoot', null, 0, 0, 0.2, 0.3]];
    /* (each card its own size, its own beat and its own lean, so the tongues never stand in a row: the first pass drew small
       even teardrops stacked up each side, a ladder; the flame itself a field of turbulence carried up and cut into tongues
       where it thins, never a drawn teardrop) */
    const FIRE_VS = `#include <common>
      #include <skinning_pars_vertex>
      attribute vec2 aCorner; attribute vec4 aCard; attribute float aSeed;
      uniform float uT, uK, uA, uFwd; uniform vec3 uC;
      varying vec2 vUv; varying float vS; varying float vA;
      void main() {
        #include <skinbase_vertex>
        vec3 transformed = vec3(position);
        #include <skinning_vertex>
        vec3 wc = (modelMatrix * vec4(transformed, 1.0)).xyz;
        vec3 toC = cameraPosition - wc, toH = vec3(toC.x, 0.0, toC.z);
        vec3 rr = dot(toH, toH) > 1e-8 ? normalize(cross(vec3(0.0, 1.0, 0.0), toH)) : vec3(1.0, 0.0, 0.0);
        float sd = aCard.x;
        if (sd > 1.5) sd = dot(wc - uC, rr) >= 0.0 ? 1.0 : -1.0;
        wc += rr * (sd * aCard.y * uK) + normalize(toC) * (uFwd * uK);
        float s1 = fract(aSeed * 7.13), s2 = fract(aSeed * 3.71), s3 = fract(aSeed * 11.37);
        float fl = 0.78 + 0.2 * sin(uT * (6.1 + 2.0 * s1) + aSeed * 17.0) + 0.12 * sin(uT * (11.3 + 3.0 * s2) + aSeed * 5.3) + 0.07 * sin(uT * 21.7 + aSeed * 31.0);
        float w = aCard.z * uK * (0.8 + 0.35 * s2) * (0.92 + 0.08 * sin(uT * 4.7 + aSeed * 9.0)), h = aCard.w * uK * (0.7 + 0.6 * s1) * fl;
        float lean = (s3 - 0.5) * 0.5 * h + sd * 0.12 * h + 0.06 * h * sin(uT * 3.1 + aSeed * 13.0);
        vec3 wp = wc + rr * (aCorner.x * w + lean * max(0.0, aCorner.y)) + vec3(0.0, aCorner.y * h, 0.0);
        vUv = vec2(aCorner.x + 0.5, aCorner.y + 0.22); vS = aSeed; vA = uA;
        gl_Position = projectionMatrix * viewMatrix * vec4(wp, 1.0);
      }`;
    const FIRE_FS = `varying vec2 vUv; varying float vS; varying float vA; uniform float uT;
      float fh(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
      float fn(vec2 p) { vec2 i = floor(p), f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(mix(fh(i), fh(i + vec2(1.0, 0.0)), u.x), mix(fh(i + vec2(0.0, 1.0)), fh(i + vec2(1.0, 1.0)), u.x), u.y); }
      float fb(vec2 p) { float v = 0.0, a = 0.5; for (int i = 0; i < 4; i++) { v += a * fn(p); p = p * 2.03 + vec2(1.7, 9.2); a *= 0.5; } return v; }
      void main() {
        float y = clamp(vUv.y, 0.0, 1.0), x = (vUv.x - 0.5) * 2.0, t = uT + vS * 17.0;
        float n1 = fb(vec2(x * 1.7 + vS * 5.0, y * 2.3 - t * 2.5)), n2 = fb(vec2(x * 3.4 - vS * 2.0, y * 4.0 - t * 4.0));
        float xs = x + (n1 - 0.5) * 1.0 * y;
        float hx = pow(1.0 - smoothstep(0.0, 1.0, abs(xs)), 0.8);
        float g = pow(1.0 - y, 1.1);
        float f = hx * (0.3 + 0.7 * g) * (0.4 + 1.0 * n2) + 0.22 * hx * g;
        float base = smoothstep(0.02, 0.36, y + (0.16 * (1.0 - abs(xs)) + (n1 - 0.5) * 0.14) * smoothstep(0.0, 0.22, y));
        float win = (1.0 - smoothstep(0.7, 1.0, abs(x))) * (1.0 - smoothstep(0.84, 1.0, y));
        float shape = smoothstep(0.27, 0.52, f) * base * win;
        float heat = clamp(f * 1.5 - 0.25, 0.0, 1.0) * (0.35 + 0.65 * g) * (0.45 + 0.55 * base);
        vec3 c = mix(vec3(0.38, 0.0, 0.0), vec3(0.92, 0.05, 0.01), smoothstep(0.0, 0.3, heat));
        c = mix(c, vec3(1.0, 0.25, 0.03), smoothstep(0.3, 0.68, heat));
        c = mix(c, vec3(1.0, 0.6, 0.2), smoothstep(0.78, 1.0, heat) * 0.55);
        float a = shape * (0.16 + 0.95 * heat) * vA;
        if (a < 0.004) discard;
        gl_FragColor = vec4(c, a);
      }`;
    function praiFireMat() {
      const m = new THREE.ShaderMaterial({ vertexShader: FIRE_VS, fragmentShader: FIRE_FS, transparent: true, depthWrite: false, depthTest: true,
        blending: THREE.AdditiveBlending, fog: false, toneMapped: false, side: THREE.DoubleSide,
        uniforms: { uT: { value: 0 }, uK: { value: 1 }, uA: { value: 0 }, uFwd: { value: FIRE5.fwd }, uC: { value: new THREE.Vector3() } } });
      mats.push(m); return m;
    }
    let firePoolTex = null, firePoolGeo = null;
    function firePool() {
      if (!firePoolTex) { const [c, x] = canvas(128, 128), gr = x.createRadialGradient(64, 64, 0, 64, 64, 63);
        gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.35, 'rgba(255,255,255,0.55)'); gr.addColorStop(0.7, 'rgba(255,255,255,0.14)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
        x.fillStyle = gr; x.fillRect(0, 0, 128, 128); firePoolTex = tex(done(THREE, c, false)); }
      if (!firePoolGeo) { firePoolGeo = new THREE.PlaneGeometry(2 * FIRE5.pool.r, 2 * FIRE5.pool.r); firePoolGeo.rotateX(-Math.PI / 2); owned.push(firePoolGeo); }
      return [firePoolTex, firePoolGeo];
    }
    function praiFireBuild(P, list) {
      const o = list.find(q => q.isSkinnedMesh); if (!o || !o.skeleton) return null;
      const sk = o.skeleton, bones = sk.bones;
      const idx = (nm) => { const re = new RegExp('^(mixamorig:?)?' + nm + '$'); return bones.findIndex(b => re.test(b.name)); };
      /* (the body's own half-widths in its own metres, its shoulders' span and its hips', measured once as it lands) */
      P.group.updateWorldMatrix(true, true);
      const wpos = (nm) => { const i = idx(nm); return i < 0 ? null : bones[i].getWorldPosition(new THREE.Vector3()); };
      const s0 = P.group.scale.x || 1, la = wpos('LeftArm'), ra = wpos('RightArm'), lu = wpos('LeftUpLeg'), ru = wpos('RightUpLeg');
      const W = la && ra ? 0.5 * la.distanceTo(ra) / s0 * 0.78 : 0.16, H = lu && ru ? 0.5 * lu.distanceTo(ru) / s0 + 0.07 : 0.15, R = { W, M: 0.5 * (W + H), H };
      /* (each card's point in the mesh's own space at the bind: skinned to its bone, it lands on the bone) */
      const bi = new THREE.Matrix4().copy(o.bindMatrix).invert(), q = new THREE.Vector3(), q2 = new THREE.Vector3(), M = new THREE.Matrix4();
      const at = (i, out) => out.setFromMatrixPosition(M.copy(sk.boneInverses[i]).invert());
      const cards = [];
      for (const [a, b, side, r, w, h] of FIRE_AT) { const ia = idx(a), ib = b ? idx(b) : -1; if (ia < 0 || (b && ib < 0)) continue;
        const rr = typeof r === 'string' ? R[r] : r;
        for (const sd of side === 1 ? [-1, 1] : [side]) cards.push({ ia, ib, sd, rr, w, h }); }
      const N = cards.length; if (!N) return null;
      const pos = new Float32Array(N * 12), cor = new Float32Array(N * 8), crd = new Float32Array(N * 16), sed = new Float32Array(N * 4),
            sI = new Uint16Array(N * 16), sW = new Float32Array(N * 16), ind = [];
      const C4 = [[-0.5, -0.22], [0.5, -0.22], [0.5, 0.78], [-0.5, 0.78]], rnd = rng(9001 + 37 * (P.slot || 0));
      cards.forEach((c, k) => {
        at(c.ia, q); if (c.ib >= 0) { at(c.ib, q2); q.lerp(q2, 0.5); } q.applyMatrix4(bi);
        const s = rnd();
        for (let v = 0; v < 4; v++) { const j = k * 4 + v;
          pos[j * 3] = q.x; pos[j * 3 + 1] = q.y; pos[j * 3 + 2] = q.z; cor[j * 2] = C4[v][0]; cor[j * 2 + 1] = C4[v][1];
          crd[j * 4] = c.sd; crd[j * 4 + 1] = c.rr; crd[j * 4 + 2] = c.w; crd[j * 4 + 3] = c.h; sed[j] = s;
          sI[j * 4] = c.ia; sW[j * 4] = c.ib >= 0 ? 0.5 : 1; if (c.ib >= 0) { sI[j * 4 + 1] = c.ib; sW[j * 4 + 1] = 0.5; } }
        const b0 = k * 4; ind.push(b0, b0 + 1, b0 + 2, b0, b0 + 2, b0 + 3); });
      const g = new THREE.BufferGeometry(); owned.push(g);
      g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('aCorner', new THREE.BufferAttribute(cor, 2));
      g.setAttribute('aCard', new THREE.BufferAttribute(crd, 4)); g.setAttribute('aSeed', new THREE.BufferAttribute(sed, 1));
      g.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(sI, 4)); g.setAttribute('skinWeight', new THREE.BufferAttribute(sW, 4)); g.setIndex(ind);
      const m = praiFireMat(), me = new THREE.SkinnedMesh(g, m); me.bind(sk, o.bindMatrix);
      me.userData.__svTwin = true; me.userData.__praiTwin = true; me.frustumCulled = false; me.castShadow = false; me.receiveShadow = false; me.visible = false; me.renderOrder = 3;
      me.position.copy(o.position); me.quaternion.copy(o.quaternion); me.scale.copy(o.scale); o.parent.add(me);
      const hip = bones[Math.max(0, idx('Hips'))];
      const F = { me, m, k: 0, a: 1, last: 0, acc: 0, hip, n: N, emb: ['head_end', 'Head', 'LeftHand', 'RightHand', 'LeftArm', 'RightArm', 'Spine', 'LeftForeArm', 'RightForeArm', 'Hips', 'LeftLeg', 'RightLeg'].map(idx).filter(i => i >= 0).map(i => bones[i]) };
      /* (its clock, its size, its strength and where its middle stands: set as it is drawn, so they hold in every frame) */
      me.onBeforeRender = () => { const now = performance.now() / 1000, dt = F.last ? Math.min(0.1, Math.max(0, now - F.last)) : 0; F.last = now;
        F.k = Math.min(1, F.k + dt / FIRE5.catchS);
        const U = m.uniforms; U.uT.value = now % 1000; U.uK.value = P.group.scale.x || 1; U.uA.value = F.a * smo(F.k); hip.getWorldPosition(U.uC.value); };
      /* (3) its fire's light on the paving under it */
      const [pt, pg] = firePool();
      const gm = new THREE.MeshBasicMaterial({ map: pt, color: 0xff3b12, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, fog: false, toneMapped: false,
        polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }); mats.push(gm);
      const gq = new THREE.Mesh(pg, gm); gq.position.y = 0.019; gq.renderOrder = 2; gq.visible = false; gq.frustumCulled = false; gq.userData.__praiTwin = true; P.group.add(gq);
      gq.onBeforeRender = () => { const t = performance.now() / 1000, f = 0.82 + 0.1 * Math.sin(t * 9.1 + P.slot) + 0.08 * Math.sin(t * 15.7 + 2 * P.slot);
        gm.opacity = FIRE5.pool.a * F.a * smo(F.k) * f; };
      F.glow = gq; F.gm = gm;
      return F;
    }
    const _pr5 = new THREE.Vector3();
    const PRAI5 = {
      list: [], mode: 'vision', t: 0,
      /* the nine made: each its body, hidden, its two looks laid on as it lands */
      make() {
        PRAI_KINDS.forEach((kind, i) => {
          /* (R43: its struggle in a bubble a window of the take where its feet stay planted, made a loop: loopOf) */
          const P = mkPerson(PRAI_BODY[kind], 0, 0, 0, { take: 'Idle_3', phase: 0.11 * i, hidden: true, noBlob: true, skins: false, s: 0.97 + 0.02 * (i % 3),
                                                         loops: { Electrocution_Reaction: [0.05, 2.2, 0.5] } });
          P.kind = kind; P.slot = i; P.alpha = 1;
          whenReady(P, (Q) => { this.looks(Q); this.takes(Q); });
          this.list.push(P);
        });
      },
      looks(P) {
        if (P.tr) return;
        /* (2) the trance's twins, in the world's layer, made first from the body's own meshes */
        const m = praiTranceMat(), twins = [], list = [];
        P.model.traverse(o => { if (o.isMesh && !o.userData.__svTwin) list.push(o); });
        for (const o of list) { let t;
          if (o.isSkinnedMesh) { t = new THREE.SkinnedMesh(o.geometry, m); t.bind(o.skeleton, o.bindMatrix); } else t = new THREE.Mesh(o.geometry, m);
          t.userData.__svTwin = true; t.userData.__praiTwin = true; t.frustumCulled = false; t.castShadow = false; t.receiveShadow = false; t.visible = false;
          t.position.copy(o.position); t.quaternion.copy(o.quaternion); t.scale.copy(o.scale); o.parent.add(t); twins.push(t); }
        /* (R43: the flame's twins beside them, the same bones) */
        const fm = praiFlameMat(), flames = [];
        for (const o of list) { if (!o.isSkinnedMesh) continue; const t = new THREE.SkinnedMesh(o.geometry, fm); t.bind(o.skeleton, o.bindMatrix);
          t.userData.__svTwin = true; t.userData.__praiTwin = true; t.frustumCulled = false; t.castShadow = false; t.receiveShadow = false; t.visible = false; t.renderOrder = 2;
          t.position.copy(o.position); t.quaternion.copy(o.quaternion); t.scale.copy(o.scale); o.parent.add(t); flames.push(t); }
        P.tr = { twins, m, on: false, flames, fm };
        /* (R45: and its fire, on its own bones: praiFireBuild) */
        P.tr.fire = praiFireBuild(P, list);
        /* (1) Spirit Vision's: the body itself to the vision's layer, laid on as black, and a twin of pale light at its
           edge (ctx.spiritAura twins only what the world draws: the body is turned back to the world's layer for the one
           call, then sent to the vision's) */
        if (!ctx.spirit || !ctx.spiritAura || !ctx.visionLayer) return;
        const own = []; P.model.traverse(o => { if (o.isMesh && !o.userData.__svTwin) own.push(o); });
        P.fx = ctx.spirit({ traverse: (f) => own.forEach(f) }, PRAI_FILL);
        for (const o of own) o.layers.set(0);
        P.edge = ctx.spiritAura({ traverse: (f) => own.forEach(f) }, PRAI_EDGE);
        for (const o of own) o.layers.set(ctx.visionLayer);
      },
      /* which look: 'vision' (seen only through Spirit Vision) or 'trance' (the world's, from the turn) */
      look(mode) { this.mode = mode; for (const P of this.list) this.lay(P); },
      lay(P) { if (!P.tr) return; const on = this.mode === 'trance' && P.group.visible;
        if (P.tr.on !== on) { P.tr.on = on; for (const t of P.tr.twins) t.visible = on; for (const t of P.tr.flames || []) t.visible = on;
          const F = P.tr.fire; if (F) { F.me.visible = on; F.glow.visible = on; F.k = 0; F.last = 0; F.acc = 0; } } },
      /* a body's strength (0 gone .. 1): both looks */
      alpha(P, a) { P.alpha = a; const b = P.burnK == null ? 1 : P.burnK; if (P.tr) { P.tr.m.userData.U.uPA.value = a; if (P.tr.fm) P.tr.fm.userData.U.uFA.value = a * b; if (P.tr.fire) P.tr.fire.a = a * b; } if (P.fx) P.fx.set('uAlpha', a); if (P.edge) P.edge.set('uAlpha', a); },
      /* R47 (Chad: "As it pierces through each prai, the fire of each prai is extinguished and it cools them down"): its fire's
         strength (0 out .. 1: the flames, their glow at its edge, its embers and its light on the paving), and how cooled it
         is (0 .. 1: its trance look turned wet and cold) */
      burn(P, k) { P.burnK = k; const a = P.alpha == null ? 1 : P.alpha; if (P.tr) { if (P.tr.fm) P.tr.fm.userData.U.uFA.value = a * k; if (P.tr.fire) P.tr.fire.a = a * k; } },
      cool(P, k) { P.coolK = k; if (P.tr && P.tr.m.userData.U.uPCool) P.tr.m.userData.U.uPCool.value = k; },
      /* R43 (Chad: "add animations to the prais, walking animations, passive idle animations and animations when getting hit
         or binded"): its takes made ready once it has landed (masters/v28.0/people.sh: the library's acts set on each body).
         The stagger's own travel pinned (Hit_Reaction carries its hips 0.77 m back and 0.47 m aside: the rules carry the
         body back, so a body sent back by its take as well went twice as far, and stepped back to its mark as the take
         ended); and the two walks' paces read from the foot that is down (both come on the spot: tools/probes/gait.mjs),
         in the body's own metres, so the fight drives each walk's rate from the ground it covers (v7.1) */
      takes(P) {
        if (P.r43) return; P.r43 = true;
        const A = P.acts.Hit_Reaction;
        if (A) { const c = A.getClip().clone(), tr = c.tracks.find(t => /Hips\.position$/.test(t.name));
          if (tr) { const v = tr.values; for (let i = 3; i < v.length; i += 3) { v[i] = v[0]; v[i + 2] = v[2]; } }
          const w = P.w.Hit_Reaction || 0; A.stop(); P.mixer.uncacheAction(A.getClip());
          const A2 = P.mixer.clipAction(c); A2.enabled = true; A2.setEffectiveWeight(w); A2.play(); P.acts.Hit_Reaction = A2; }
        P.praiPace = {};
        const LF = boneOf(P, 'LeftFoot'), RF = boneOf(P, 'RightFoot'); if (!LF || !RF) return;
        const keep = {}; for (const k in P.acts) keep[k] = [P.acts[k].time, P.w[k] || 0];
        for (const name of ['Unsteady_Walk', 'Walking']) { const W = P.acts[name]; if (!W) continue;
          const d = W.getClip().duration, N = 48, F = [[], []];
          for (const k in P.acts) P.acts[k].setEffectiveWeight(k === name ? 1 : 0);
          for (let i = 0; i <= N; i++) { W.time = Math.min(d - 1e-4, d * i / N); P.mixer.update(0); P.group.updateWorldMatrix(true, true);
            [LF, RF].forEach((b, j) => { b.getWorldPosition(_pr5); P.group.worldToLocal(_pr5); F[j].push([_pr5.y, _pr5.z]); }); }
          let lo = Infinity; for (const f of F) for (const q of f) lo = Math.min(lo, q[0]);
          let back = 0, nn = 0; for (const f of F) for (let i = 0; i < N; i++) if (f[i][0] < lo + 0.035 && f[i + 1][0] < lo + 0.035) { back += f[i][1] - f[i + 1][1]; nn++; }
          if (nn > 2 && back > 0) P.praiPace[name] = back / (nn * d / N); }
        for (const k in P.acts) { P.acts[k].time = keep[k][0]; P.w[k] = keep[k][1]; P.acts[k].setEffectiveWeight(keep[k][1]); }
        P.mixer.update(0);
      },
      /* each frame (the sheen's own clock: wall time, a cosmetic) */
      tick(wdt) { this.t += wdt; praiU.uPT.value = this.t; praiFlameU.uFT.value = this.t; for (const P of this.list) this.lay(P); },
      /* where they stand in a phase: in the court all evening (the hunt; the preparation finds them there), at the fight's
         places in the fight, nowhere after it */
      home(p) {
        this.list.forEach((P, i) => {
          const s = PRAI_STAND[i], w = courtWorld(s[0], s[1]);
          if (p === 'hunt' || p === 'fight') { P.hidden = false; put(P, w.x, w.z, faceTo(w.x, w.z, w.x, HOUSE.face)); if (P.ready) { P.group.visible = true; rest(P, 0); } }
          else { P.hidden = true; P.group.visible = false; }
        });
        this.look('vision'); for (const P of this.list) { P.burnK = 1; this.cool(P, 0); this.alpha(P, 1); }
        PRAI_EMB.clear();
      }
    };
    /* R45 (2): THE EMBERS off the nine on fire: one cloud of points for all of them, each a soft spark, hot at its heart,
       additive, sized in metres on the screen's own scale (the fight's sparks' way, fsPts); they rise off a body's own bones
       at a few a second, drift, cool from orange to red and die. Stepped as the cloud is drawn (wall time, a cosmetic), so
       they run in every frame whoever ticks the look; their own seeded stream (v6.15) */
    const PRAI_EMB = (() => {
      const NMAX = 200, g = new THREE.BufferGeometry(), pos = new Float32Array(NMAX * 3), col = new Float32Array(NMAX * 3), siz = new Float32Array(NMAX), alp = new Float32Array(NMAX);
      const at = (a, n) => { const b = new THREE.BufferAttribute(a, n); b.setUsage(THREE.DynamicDrawUsage); return b; };
      g.setAttribute('position', at(pos, 3)); g.setAttribute('aC', at(col, 3)); g.setAttribute('aS', at(siz, 1)); g.setAttribute('aA', at(alp, 1)); g.setDrawRange(0, 0); owned.push(g);
      const m = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false, toneMapped: false, uniforms: { uScale: { value: 500 } },
        vertexShader: 'attribute vec3 aC; attribute float aS; attribute float aA; varying vec3 vC; varying float vA; uniform float uScale; void main(){ vC = aC; vA = aA; vec4 mv = modelViewMatrix * vec4(position, 1.0); gl_PointSize = aS * uScale / max(0.05, -mv.z); gl_Position = projectionMatrix * mv; }',
        fragmentShader: 'varying vec3 vC; varying float vA; void main(){ float d = length(gl_PointCoord - 0.5) * 2.0; if (d > 1.0) discard; float f = pow(1.0 - d, 1.6), h = pow(1.0 - d, 5.0); gl_FragColor = vec4(vC + vec3(0.5 * h, 0.35 * h, 0.0), vA * f); }' });
      mats.push(m);
      const pts = new THREE.Points(g, m); pts.frustumCulled = false; pts.renderOrder = 4; pts.userData.__praiTwin = true; world.add(pts);
      const E = Array.from({ length: NMAX }, () => ({ on: false, x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0, age: 0, life: 1, s: 0.02, ph: 0 }));
      const rnd = rng(4242), _e = new THREE.Vector3(), _r = new THREE.Vector3(), _u = new THREE.Vector3(), _f = new THREE.Vector3();
      let last = 0, cur = 0;
      const spawn = (x, y, z) => { let e = null;
        for (let i = 0; i < NMAX; i++) { const q = E[(cur + i) % NMAX]; if (!q.on) { e = q; cur = (cur + i + 1) % NMAX; break; } }
        if (!e) { e = E[cur]; cur = (cur + 1) % NMAX; }
        const L = FIRE5.emb; e.on = true; e.x = x; e.y = y; e.z = z; e.vx = (rnd() - 0.5) * 0.3; e.vz = (rnd() - 0.5) * 0.3; e.vy = L.up[0] + rnd() * (L.up[1] - L.up[0]);
        e.age = 0; e.life = L.life[0] + rnd() * (L.life[1] - L.life[0]); e.s = L.size[0] + rnd() * (L.size[1] - L.size[0]); e.ph = rnd() * 6.28; };
      pts.onBeforeRender = () => {
        const now = performance.now() / 1000, dt = last ? Math.min(0.1, Math.max(0, now - last)) : 0; last = now;
        m.uniforms.uScale.value = Math.min(devicePixelRatio || 1, LOW ? 1.6 : 2) * innerHeight / (2 * Math.tan(camera.fov * Math.PI / 360));
        camera.updateMatrixWorld(); camera.matrixWorld.extractBasis(_r, _u, _f); _r.y = 0; if (_r.lengthSq() < 1e-6) _r.set(1, 0, 0); _r.normalize();
        const rate = LOW ? FIRE5.emb.rateLow : FIRE5.emb.rate;
        for (const P of PRAI5.list) { const F = P.tr && P.tr.fire;
          if (!F || !P.tr.on || !P.group.visible || F.a < 0.05 || !F.emb.length) { if (F) F.acc = 0; continue; }
          const k = P.group.scale.x || 1; F.acc += dt * rate * F.a * smo(F.k) * k;
          while (F.acc >= 1) { F.acc -= 1; const b = F.emb[Math.floor(rnd() * F.emb.length)]; b.getWorldPosition(_e);
            const sd = (rnd() - 0.5) * 0.24 * k; spawn(_e.x + _r.x * sd, _e.y + rnd() * 0.08, _e.z + _r.z * sd); } }
        let hi = 0;
        for (let i = 0; i < NMAX; i++) { const e = E[i];
          if (e.on && dt > 0) { e.age += dt; if (e.age >= e.life) e.on = false; }
          if (!e.on) { siz[i] = 0; alp[i] = 0; continue; }
          if (dt > 0) { e.vy *= Math.exp(-0.6 * dt); e.x += (e.vx + 0.18 * Math.sin(e.ph + e.age * 5.0)) * dt; e.y += e.vy * dt; e.z += (e.vz + 0.18 * Math.cos(e.ph + e.age * 4.3)) * dt; }
          const u = e.age / e.life, a = Math.min(1, u / 0.1) * Math.pow(1 - u, 1.2);
          pos[i * 3] = e.x; pos[i * 3 + 1] = e.y; pos[i * 3 + 2] = e.z;
          col[i * 3] = 1.0; col[i * 3 + 1] = 0.55 - 0.42 * u; col[i * 3 + 2] = 0.16 - 0.15 * u;
          siz[i] = e.s * (1 - 0.5 * u); alp[i] = a; hi = i + 1; }
        g.setDrawRange(0, hi);
        if (hi > 0) for (const k of ['position', 'aC', 'aS', 'aA']) g.attributes[k].needsUpdate = true;
      };
      return { pts, clear() { for (const e of E) e.on = false; g.setDrawRange(0, 0); last = 0; } };
    })();
    PRAI5.make();

    /* ---------------------------------------------------------------- HIS LERSI'S CAGE (the plan's 5.3 and 11: "seven thin
       bars of light turning round him", a DRAWING of the Victor's Cage's "seven ramparts" (the text has walls; no line says
       it describes bars), and their ring on the paving; violet, his protection's colour, never gold or white). Its radius
       is the fight's (FIGHT.NUM cageR 1.0). A bar between the lens and him is drawn fainter (the mock: one always crosses
       his body). Painted light only: additive, no light added (v9.4) */
    const CAGE5 = (() => {
      const COL = 0x9b6bff, R = 1.0, H = 2.05, N = 7;
      const g = new THREE.Group(); g.visible = false; world.add(g);
      const spin = new THREE.Group(); g.add(spin);
      const add = (o) => { o.renderOrder = 3; return o; };
      const mBar = new THREE.MeshBasicMaterial({ color: COL, transparent: true, opacity: 0.85, depthWrite: false, blending: THREE.AdditiveBlending, fog: false, toneMapped: false }); mats.push(mBar);
      const mGlow = new THREE.MeshBasicMaterial({ color: COL, transparent: true, opacity: 0.22, depthWrite: false, blending: THREE.AdditiveBlending, fog: false, toneMapped: false }); mats.push(mGlow);
      const gBar = new THREE.CylinderGeometry(0.012, 0.012, H, 8, 1, true), gGlow = new THREE.CylinderGeometry(0.05, 0.05, H, 10, 1, true); owned.push(gBar, gGlow);
      const bars = [];
      for (let i = 0; i < N; i++) { const a = i / N * Math.PI * 2, b = new THREE.Group(); b.position.set(Math.sin(a) * R, H / 2 + 0.02, Math.cos(a) * R);
        const mb = mBar.clone(), mg = mGlow.clone(); mats.push(mb, mg);
        b.add(add(new THREE.Mesh(gBar, mb)), add(new THREE.Mesh(gGlow, mg))); spin.add(b); bars.push({ b, mb, mg }); }
      /* its ring on the paving, and a soft wider one (the gauge of its strength: the state is on the screen, v8.1) */
      const ringTex = (() => { const [c, x] = canvas(256, 256); const gr = x.createRadialGradient(128, 128, 96, 128, 128, 127);
        gr.addColorStop(0, 'rgba(255,255,255,0)'); gr.addColorStop(0.55, 'rgba(255,255,255,0.9)'); gr.addColorStop(0.7, 'rgba(255,255,255,0.35)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
        x.fillStyle = gr; x.fillRect(0, 0, 256, 256); return tex(done(THREE, c, false)); })();
      const mRing = new THREE.MeshBasicMaterial({ map: ringTex, color: COL, transparent: true, opacity: 0.7, depthWrite: false, blending: THREE.AdditiveBlending, fog: false, toneMapped: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }); mats.push(mRing);
      const gRing = new THREE.PlaneGeometry(2.7 * R, 2.7 * R); gRing.rotateX(-Math.PI / 2); owned.push(gRing);
      const ring = add(new THREE.Mesh(gRing, mRing)); ring.position.y = 0.012; g.add(ring);
      /* R25 (Chad: "zavier's cage you can make the light pillars of his cage spin around him in a circular motion to make it
         look more defensive"): asked with `spin` (radians a second), the bars TURN ROUND HIM at that pace, eased to it and
         from it over a third of a second, each drawing a wake of its own violet behind it round the circle (an arc of the
         cage's own wall, a third of a radian, brightest at the bar and gone at its end, soft at its top and foot), as
         bright as the turn is fast. Without `spin`, its slow turn exactly as it was (a bar a 9 s) and no wake drawn */
      const wakeTex = (() => { const [c, x] = canvas(128, 64); const gr = x.createLinearGradient(0, 0, 128, 0);
        gr.addColorStop(0, 'rgba(255,255,255,0)'); gr.addColorStop(0.65, 'rgba(255,255,255,0.35)'); gr.addColorStop(1, 'rgba(255,255,255,1)');
        x.fillStyle = gr; x.fillRect(0, 0, 128, 64);
        x.globalCompositeOperation = 'destination-in'; const gv = x.createLinearGradient(0, 0, 0, 64);
        gv.addColorStop(0, 'rgba(0,0,0,0)'); gv.addColorStop(0.18, 'rgba(0,0,0,1)'); gv.addColorStop(0.82, 'rgba(0,0,0,1)'); gv.addColorStop(1, 'rgba(0,0,0,0)');
        x.fillStyle = gv; x.fillRect(0, 0, 128, 64); return tex(done(THREE, c, false)); })();
      const WAKE = 0.62;
      for (const B of bars) { const a = Math.atan2(B.b.position.x, B.b.position.z), gw = new THREE.CylinderGeometry(R, R, H * 0.94, 12, 1, true, a - WAKE, WAKE); owned.push(gw);
        const mw = new THREE.MeshBasicMaterial({ map: wakeTex, color: COL, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, fog: false, toneMapped: false }); mats.push(mw);
        const w = add(new THREE.Mesh(gw, mw)); w.position.y = H / 2 + 0.02; w.visible = false; spin.add(w); B.w = w; B.mw = mw; }
      /* (and on the paving, turning with them, a swirl: each bar's arc of light along the circle at its foot, bright at the
         bar and gone a third of the way to the next: seen from above, where the bars' wakes stand edge-on, the turn reads) */
      const swirlTex = (() => { const n = 512, [c, x] = canvas(n, n); x.translate(n / 2, n / 2); x.lineCap = 'round';
        for (const B of bars) { const a0 = Math.atan2(B.b.position.x, B.b.position.z);
          for (let i = 0; i < 48; i++) { const u = i / 48, t0 = a0 - u * 1.1, t1 = a0 - (u + 1 / 48) * 1.1, al = Math.pow(1 - u, 1.6);
            /* (the canvas's x is the plane's x and its y the plane's z once laid flat: the bar at angle a stands at (sin a, cos a)) */
            x.strokeStyle = 'rgba(255,255,255,' + al.toFixed(3) + ')'; x.lineWidth = 14 * (1 - 0.6 * u);
            x.beginPath(); x.moveTo(Math.sin(t0) * n * 0.4, Math.cos(t0) * n * 0.4); x.lineTo(Math.sin(t1) * n * 0.4, Math.cos(t1) * n * 0.4); x.stroke(); } }
        return tex(done(THREE, c, false)); })();
      const mSwirl = new THREE.MeshBasicMaterial({ map: swirlTex, color: COL, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, fog: false, toneMapped: false, polygonOffset: true, polygonOffsetFactor: -3, polygonOffsetUnits: -3 }); mats.push(mSwirl);
      const gSwirl = new THREE.PlaneGeometry(2.5 * R, 2.5 * R); gSwirl.rotateX(-Math.PI / 2); owned.push(gSwirl);
      const swirl = add(new THREE.Mesh(gSwirl, mSwirl)); swirl.position.y = 0.014; swirl.visible = false; spin.add(swirl);
      let ang = 0, rate = 0, lastT = null;
      const _cv = new THREE.Vector3(), _cl = new THREE.Vector3();
      return {
        group: g, R,
        /* the cage at a body's feet: `k` its strength (0 gone .. 1 whole), `t` the clock that turns it (a slow turn: a bar
           a 9 s), `held` the bars standing still (the plan's STEADY / a gripped one), `crack` its breaking (the surge);
           null hides it */
        set(o) {
          if (!o || !(o.k > 0.001)) { g.visible = false; return; }
          g.visible = true; g.position.set(o.x, o.y || 0, o.z);
          let wk = 0;
          if (o.spin != null) { const t = o.t || 0, dt = lastT == null ? 0 : Math.max(0, Math.min(0.1, t - lastT)); lastT = t;
            rate += ((o.held ? 0 : +o.spin || 0) - rate) * (1 - Math.exp(-dt / 0.33)); ang += rate * dt; spin.rotation.y = ang; wk = Math.min(1, Math.abs(rate) / 2.4); }
          else { lastT = null; rate = 0; spin.rotation.y = o.held ? spin.rotation.y : (o.t || 0) * (Math.PI * 2 / (N * 9)); ang = spin.rotation.y; }
          camera.getWorldPosition(_cl);
          for (const B of bars) { B.b.getWorldPosition(_cv);
            /* a bar between the lens and him (nearer the lens than his middle, and inside the line to him) drawn fainter */
            const dl = Math.hypot(_cv.x - _cl.x, _cv.z - _cl.z), dm = Math.hypot(o.x - _cl.x, o.z - _cl.z);
            const front = dl < dm - 0.3 ? 0.35 : 1;
            const cr = o.crack ? 0.55 + 0.45 * Math.sin((o.t || 0) * 37 + B.b.position.x * 9) : 1;
            B.mb.opacity = 0.85 * o.k * front * cr; B.mg.opacity = 0.22 * o.k * front * cr;
            B.b.scale.set(0.7 + 0.6 * o.k, 1, 0.7 + 0.6 * o.k);
            B.w.visible = wk > 0.01; B.mw.opacity = 0.5 * wk * o.k * front * cr; }
          mRing.opacity = 0.7 * o.k;
          swirl.visible = wk > 0.01; mSwirl.opacity = 0.75 * wk * o.k * (o.crack ? 0.6 : 1);
        }
      };
    })();

    /* ---------------------------------------------------------------- THE TRANCE'S LOOK (the plan's 11): the court's lamps
       down, a deep blue dark, the paving still read; a soft pool of each one's colour painted under his feet (violet his,
       gold his teacher's); a low mist on the paving; and Grandmaster Pho's gold at his shoulders. TRANCE5.set(k) lays it
       on by k (0 none); its light is a preset handed to the kit's daylight (the chapter's own, v4.1) */
    const TRANCE_SKY = Object.assign({ stars: 0.4, moon: 0, sun: 0, clouds: 0 }, {
      stops: [[0.00, '#1a2040'], [0.12, '#141a36'], [0.35, '#0e1330'], [0.65, '#0a0e26'], [1.00, '#060818']],
      bg: 0x0a0e24, fog: [0x0b1028, 0.012],
      hemi: [0x5866b0, 0x141420, 0.55], key: [0x8fa0ff, 0.35, 1.0, 3.0, 1.0], fill: [0x403070, 0.25],
      vmHemi: [0x5866b0, 0x141420, 0.5], vmKey: [0x8fa0ff, 0.3] });
    PRESETS.TRANCE = TRANCE_SKY;
    const TRANCE5 = (() => {
      const g = new THREE.Group(); g.visible = false; world.add(g);
      const soft = (() => { const [c, x] = canvas(128, 128); const gr = x.createRadialGradient(64, 64, 2, 64, 64, 63);
        gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.45, 'rgba(255,255,255,0.4)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
        x.fillStyle = gr; x.fillRect(0, 0, 128, 128); return tex(done(THREE, c, false)); })();
      const pool = (col, size) => { const m = new THREE.MeshBasicMaterial({ map: soft, color: col, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending, fog: false, toneMapped: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }); mats.push(m);
        const q = new THREE.PlaneGeometry(size, size); q.rotateX(-Math.PI / 2); owned.push(q); const me = new THREE.Mesh(q, m); me.position.y = 0.01; me.renderOrder = 2; g.add(me); return me; };
      const poolZ = pool(0x8a5cff, 2.6), poolP = pool(0xffc860, 2.2);
      /* the mist: a few broad soft cards lying just over the paving, drifting (a seeded set: the same every run, v6.15) */
      const mist = [], r = rng(28590), mMist = new THREE.MeshBasicMaterial({ map: soft, color: 0x8090c8, transparent: true, opacity: 0, depthWrite: false, fog: false, toneMapped: false }); mats.push(mMist);
      for (let i = 0; i < 9; i++) { const q = new THREE.PlaneGeometry(2.4 + r() * 1.6, 1.6 + r() * 1.0); q.rotateX(-Math.PI / 2); owned.push(q);
        const me = new THREE.Mesh(q, mMist); me.position.set(COURT.x0 + 0.6 + r() * (COURT.x1 - COURT.x0 - 1.2), 0.05 + r() * 0.12, COURT.z0 + 1.0 + r() * (HOUSE.face - COURT.z0 - 2.0));
        me.userData.base = me.position.clone(); me.userData.ph = r() * 6.28; me.renderOrder = 2; g.add(me); mist.push(me); }
      /* his gold, at his shoulders: a soft warm light behind them (gold is his alone, v25.5), behind him as the lens sees him
         (below, in gold()) */
      const mGold = new THREE.SpriteMaterial({ map: soft, color: 0xffc860, transparent: true, opacity: 0, depthWrite: false, depthTest: true, blending: THREE.AdditiveBlending }); mats.push(mGold);
      const _gC = new THREE.Vector3(), _gD = new THREE.Vector3();
      const gold = new THREE.Sprite(mGold); gold.scale.set(1.3, 1.0, 1); gold.renderOrder = 4; world.add(gold); gold.visible = false;
      let k0 = 0, gk = 0;
      return {
        get k() { return k0; },
        /* the look at k (0..1): the pools under the two of them where they stand, the mist, and the court's lamps down */
        set(k, t = 0) { k0 = k; g.visible = k > 0.001;
          if (!g.visible) { this.gold(0); return; }
          for (const me of mist) { const b = me.userData.base, ph = me.userData.ph; me.position.set(b.x + Math.sin(t * 0.07 + ph) * 0.4, b.y, b.z + Math.cos(t * 0.05 + ph) * 0.3); }
          mMist.opacity = 0.10 * k;
          courtLamps(1 - 0.85 * k); },
        /* each one's pool where he stands */
        pools(zav, pho, kz, kp) { poolZ.position.set(zav ? zav.x : 0, 0.011, zav ? zav.z : 0); poolZ.material.opacity = (zav ? 0.5 : 0) * kz;
          poolP.position.set(pho ? pho.x : 0, 0.012, pho ? pho.z : 0); poolP.material.opacity = (pho ? 0.45 : 0) * kp; },
        /* his gold at his shoulders, by k, where his body stands (his neck's height, a little behind) */
        gold(k, P = cast.pho) { gk = k; gold.visible = k > 0.001 && P && P.ready && P.group.visible;
          if (!gold.visible) return; const nb = boneOf(P, 'Neck') || P.head; if (nb) nb.getWorldPosition(gold.position); else gold.position.set(P.group.position.x, 1.45, P.group.position.z);
          /* (BEHIND HIM AS THE LENS SEES HIM, R28/R33: 0.35 m on the far side of his neck from the camera, and tested against
             depth, so his body stands in front of the card and the gold is a light round his shoulders and head. Laid behind his
             neck by his own facing and drawn over everything, it lay OVER his back whenever the lens was behind him, as the
             fight's boom always is: the add summed his white robe to a blown-out white and his skin to yellow (the review's
             picture, R28; v8.8: additive colour over a bright surface sums to white). 0.35 m keeps the card behind his body's
             own depth, so it is never cut through him along a hard line, which was v25.5's reason for drawing it untested) */
          camera.getWorldPosition(_gC); _gD.subVectors(gold.position, _gC); _gD.y = 0; const dl = _gD.length();
          if (dl > 1e-3) gold.position.addScaledVector(_gD, 0.35 / dl); else { const ry = P.group.rotation.y; gold.position.x -= Math.sin(ry) * 0.35; gold.position.z -= Math.cos(ry) * 0.35; }
          gold.position.y -= 0.08;
          mGold.opacity = 0.55 * k; }
      };
    })();
