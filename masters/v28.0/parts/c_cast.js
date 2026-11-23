
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
    function boomAt(feet) {
      const d = DATA.tag || {}, portrait = camera.aspect < 1;
      const b0 = Object.assign({ back: 4.0, up: 3.1, pitch: 26 }, d.boom || {}), b = portrait && d.portrait ? Object.assign({}, b0, d.portrait) : b0;
      const h = d.heading != null ? d.heading : COURT5.heading, soft = d.soft != null ? d.soft : 0.6, cb = d.camBox || null;
      const o = { x: feet.x + b.back * Math.sin(h), y: (feet.y || 0) + b.up, z: feet.z + b.back * Math.cos(h) };
      if (cb) { if (Number.isFinite(cb.minX) && Number.isFinite(cb.maxX)) o.x = boomSoft(o.x, cb.minX, cb.maxX, soft);
        if (Number.isFinite(cb.minZ) && Number.isFinite(cb.maxZ)) o.z = boomSoft(o.z, cb.minZ, cb.maxZ, soft);
        if (Number.isFinite(cb.minY) && Number.isFinite(cb.maxY)) o.y = boomSoft(o.y, cb.minY, cb.maxY, soft); }
      o.x = Math.max(DATA.bounds.minX, Math.min(DATA.bounds.maxX, o.x)); o.z = Math.max(DATA.bounds.minZ, Math.min(DATA.bounds.maxZ, o.z));
      /* (R37: then drawn in along its line toward his head where a solid stands between them, as the mode does it (main.js
         tagBoomFor: the head 1.6 m over his feet, every solid that does not hold the head, the nearest hit less 0.22 m).
         The gate's stop (b_world.js boomStop) counted whole whatever the phase: this boom is only ever the fight's) */
      { const H = new THREE.Vector3(feet.x, (feet.y || 0) + 1.6, feet.z), L = new THREE.Vector3(o.x, o.y, o.z).sub(H), len = L.length();
        if (len > 1e-4) {
          const ray = new THREE.Ray(H, L.divideScalar(len)), hit = new THREE.Vector3(), B = (S && S.blockers) || [], iStop = solids.indexOf(boomStop);
          let near = len;
          for (let i = 0; i < B.length; i++) { const bx = i === iStop && block0.has(boomStop) ? block0.get(boomStop) : B[i];
            if (bx.isEmpty() || bx.containsPoint(H)) continue; const q = ray.intersectBox(bx, hit); if (q) { const dd = q.distanceTo(H) - 0.22; if (dd < near) near = Math.max(0, dd); } }
          if (near < len) { const k = near / len; o.x = H.x + (o.x - H.x) * k; o.y = H.y + (o.y - H.y) * k; o.z = H.z + (o.z - H.z) * k; } } }
      return { eye: [o.x, o.y, o.z], heading: h, pitch: -(+b.pitch || 0) * Math.PI / 180, fov: Math.max(20, Math.min(110, +(b.fov || d.fov) || 72)) };
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
       Every other finger's tip is its own last bone's. The end site is made a child of the middle finger's last bone where it
       stands (attach keeps its place in the world, at rest the same as it was): open, nothing moves; closed, the tip goes
       with its finger. FIRST its tracks come out of his takes: all nineteen hold it still at its rest, 0.000 cm and 0.00
       degrees from it at every key (measured on his file), but each of them writes it again every frame as the HAND's child,
       and under the finger those same numbers threw it 14.6 cm out along the finger and dragged the tip's skin through the
       stick (the first try, measured by e4c5grip.mjs before it went anywhere: 124 points of his fingers inside the shaft) */
    const END5 = /RightHandEnd\./;
    whenReady(cast.pho, (P) => {
      const end = boneOf(P, 'RightHandEnd'), m3 = boneOf(P, 'RightHandMiddle3');
      if (!end || !m3 || end.parent === m3) return;
      let n = 0;
      for (const name of Object.keys(P.acts)) { const A = P.acts[name], clip = A.getClip(), keep = clip.tracks.filter(t => !END5.test(t.name));
        if (keep.length === clip.tracks.length) continue;
        const w = P.w[name] || 0, time = A.time; A.stop(); P.mixer.uncacheAction(clip);
        const A2 = P.mixer.clipAction(new THREE.AnimationClip(clip.name, clip.duration, keep)); A2.enabled = true; A2.setEffectiveWeight(w); A2.play(); A2.time = time;
        P.acts[name] = A2; n += clip.tracks.length - keep.length; }
      m3.updateWorldMatrix(true, false); end.updateWorldMatrix(true, false); m3.attach(end);
      console.log('HANDS5: ' + P.key + "'s middle fingertip carried by its own last bone (RightHandEnd under RightHandMiddle3; " + n + ' still tracks of it out of his takes)');
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
      for (const S0 of ['Left', 'Right']) { if (skip === S0) continue; for (const n of ['Arm', 'Hand']) { const b = bo(S0 + n); if (b) limKeep(L, b); } }
      P.group.updateWorldMatrix(true, false); for (const b of [lh, rh, la, ra]) b.updateWorldMatrix(true, false);
      const pa = la.getWorldPosition(_l.a), pb = ra.getWorldPosition(_l.b), mid = _l.c.copy(pa).add(pb).multiplyScalar(0.5);
      const U = _l.d.copy(mid).sub(_l.e.copy(lh.getWorldPosition(_l.e)).add(rh.getWorldPosition(_l.f)).multiplyScalar(0.5)).normalize();
      const Lf = _l.e.copy(pa).sub(pb); Lf.addScaledVector(U, -Lf.dot(U)).normalize(); const F = _l.f.crossVectors(Lf, U).normalize();
      for (const [S0, side] of [['Left', 1], ['Right', -1]]) {
        if (skip === S0) continue;
        const up = bo(S0 + 'Arm'), fo = bo(S0 + 'ForeArm'), hd = bo(S0 + 'Hand'); if (!up || !fo || !hd) continue;
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
        P.group.updateWorldMatrix(true, true);
        const L = palmOf(P, 'Left', _stA), R = palmOf(P, 'Right', _stB); if (!L || !R) return false;
        const dx = R.x - L.x, dz = R.z - L.z, dy = R.y - L.y, hl = Math.hypot(dx, dz), yaw = Math.atan2(-dz, dx);
        const mid = L.clone().add(R).multiplyScalar(0.5); mid.y += 0.02;
        if (which === 'wrap') { g.position.copy(mid); g.rotation.set(0, yaw, Math.atan2(dy, hl), 'YXZ'); }
        else { /* the stick's length is its y: laid down along the palms' line, its head to his left hand's side */
          g.position.set(mid.x, mid.y, mid.z); g.rotation.set(0, yaw, Math.PI / 2 + Math.atan2(dy, hl), 'YXZ');
          g.translateY(-STICK_LEN * 0.5); }
        g.visible = true; navCarried(P, g); return true; },
      /* stood upright by itself at a point (the Naga's film: planted, "the stick stands by itself once planted") */
      plant(x, z, ry = 0) { const g = things.nagaStaff; if (!g) return; if (g.parent !== world) world.attach(g); g.position.set(x, 0, z); g.rotation.set(0, ry, 0); g.visible = true; this.who = 'planted'; },
      /* the wrapped stick carried upright in Ton's right hand, its foot a hand over the floor (laid from his standing rest
         once and carried by the hand bone: c_yfilm.js handHold5), while he is its carrier */
      wrapOff: null,
      carry(P) { if (this.who !== 'tonWrap' || !P || !P.ready || !things.staffWrap) return;
        this.wrapOff = handHold5(P, 'Right', things.staffWrap, this.wrapOff, { upright: true, foot: 0.06, ry: Math.PI / 2, out: 0.07 }); }
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
    const praiU = { uPT: { value: 0 }, uPBody: { value: new THREE.Color(PRAI_LOOK.body) }, uPEdge: { value: new THREE.Color(PRAI_LOOK.edge) }, uPSheen: { value: new THREE.Color(PRAI_LOOK.sheen) } };
    function praiTranceMat() {
      const m = new THREE.MeshNormalMaterial({ side: THREE.FrontSide }); mats.push(m);
      m.transparent = true; m.depthWrite = true; m.fog = false; m.toneMapped = false;
      const U = Object.assign({ uPA: { value: 1 } }, praiU);
      m.onBeforeCompile = (sh) => { Object.assign(sh.uniforms, U);
        sh.vertexShader = 'varying vec3 vPw;\n' + sh.vertexShader.replace('#include <project_vertex>', '#include <project_vertex>\n  vPw = (modelMatrix * vec4(transformed, 1.0)).xyz;');
        const out = sh.fragmentShader.replace(PRAI_SHADE,
          `vec3 pN = normalize(normal); float pf = pow(1.0 - clamp(abs(pN.z), 0.0, 1.0), 2.2);
           float ps = pow(0.5 + 0.5 * sin(vPw.y * 5.0 - uPT * 1.3 + vPw.x * 1.7 + vPw.z * 1.1), 10.0);
           vec3 pc = mix(uPBody, uPEdge, pf * 0.85) + uPSheen * ps * 0.28 * (1.0 - pf);
           gl_FragColor = vec4(pc, uPA * (0.9 + 0.1 * pf));`);
        if (out === sh.fragmentShader) console.warn('e4c5: the Prai\'s trance look found no colour line to write (three changed?)');
        sh.fragmentShader = 'varying vec3 vPw;\nuniform vec3 uPBody, uPEdge, uPSheen;\nuniform float uPT, uPA;\n' + out; };
      m.customProgramCacheKey = () => 'e4c5praiTrance';
      m.userData.U = U; return m;
    }
    const PRAI5 = {
      list: [], mode: 'vision', t: 0,
      /* the nine made: each its body, hidden, its two looks laid on as it lands */
      make() {
        PRAI_KINDS.forEach((kind, i) => {
          const P = mkPerson(PRAI_BODY[kind], 0, 0, 0, { take: 'Idle_3', phase: 0.11 * i, hidden: true, noBlob: true, skins: false, s: 0.97 + 0.02 * (i % 3) });
          P.kind = kind; P.slot = i; P.alpha = 1;
          whenReady(P, (Q) => this.looks(Q));
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
        P.tr = { twins, m, on: false };
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
        if (P.tr.on !== on) { P.tr.on = on; for (const t of P.tr.twins) t.visible = on; } },
      /* a body's strength (0 gone .. 1): both looks */
      alpha(P, a) { P.alpha = a; if (P.tr) P.tr.m.userData.U.uPA.value = a; if (P.fx) P.fx.set('uAlpha', a); if (P.edge) P.edge.set('uAlpha', a); },
      /* each frame (the sheen's own clock: wall time, a cosmetic) */
      tick(wdt) { this.t += wdt; praiU.uPT.value = this.t; for (const P of this.list) this.lay(P); },
      /* where they stand in a phase: in the court all evening (the hunt; the preparation finds them there), at the fight's
         places in the fight, nowhere after it */
      home(p) {
        this.list.forEach((P, i) => {
          const s = PRAI_STAND[i], w = courtWorld(s[0], s[1]);
          if (p === 'hunt' || p === 'fight') { P.hidden = false; put(P, w.x, w.z, faceTo(w.x, w.z, w.x, HOUSE.face)); if (P.ready) { P.group.visible = true; rest(P, 0); } }
          else { P.hidden = true; P.group.visible = false; }
        });
        this.look('vision'); for (const P of this.list) this.alpha(P, 1);
      }
    };
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
